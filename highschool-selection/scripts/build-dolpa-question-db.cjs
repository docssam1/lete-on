"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const ledgerCore = require("./build-dolpa-work-ledger.cjs");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function fingerprint(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.resolve(filePath))).digest("hex");
}

function pendingEvidence() {
  return { status: "pending", evidence: [] };
}

function fromLedgerQuestion(question) {
  return {
    questionId: question.questionId,
    sourceId: question.sourceId,
    paperId: question.paperId,
    number: question.number,
    sourceRelation: question.sourceRelation,
    locator: { page: null, slot: null, status: "pending", evidence: [] },
    classification: {
      semester: question.curriculum.semester,
      domain: question.curriculum.domain,
      unit: question.curriculum.unit,
      typeId: question.type.typeId,
      typeLabel: question.type.label,
      status: question.classificationStatus,
      evidence: question.evidence
    },
    method: { tags: question.type.methodTags, status: question.type.methodReviewStatus, evidence: [] },
    difficulty: question.difficulty,
    responseFormat: { kind: null, ...pendingEvidence() },
    answerCheck: { status: "pending", evidence: [] },
    variantSet: { status: "not_started", originalId: question.questionId, twinIds: [], similarIds: [] },
    releaseStatus: "locked"
  };
}

function sameIdentity(left, right) {
  return left.sourceId === right.sourceId && left.paperId === right.paperId && left.number === right.number &&
    left.classification.typeId === right.classification.typeId;
}

function mergeExisting(seed, existing) {
  if (!existing) return seed;
  if (existing.schemaVersion !== 1) throw new Error("기존 돌파 문항 DB 버전을 확인해 주세요.");
  const oldById = new Map((existing.questions || []).map(question => [question.questionId, question]));
  return seed.map(question => {
    const old = oldById.get(question.questionId);
    if (!old) return question;
    if (!sameIdentity(question, old)) throw new Error(`기존 문항의 출처·유형이 달라졌습니다: ${question.questionId}`);
    return {
      ...question,
      locator: old.locator,
      method: old.method,
      difficulty: old.difficulty,
      responseFormat: old.responseFormat,
      answerCheck: old.answerCheck,
      variantSet: old.variantSet,
      releaseStatus: "locked"
    };
  });
}

function rebuildTypeCatalog(questions) {
  const map = new Map();
  questions.forEach(question => {
    const key = question.classification.typeId;
    if (!map.has(key)) {
      map.set(key, {
        typeId: key,
        semester: question.classification.semester,
        domain: question.classification.domain,
        unit: question.classification.unit,
        label: question.classification.typeLabel,
        questionIds: []
      });
    }
    const type = map.get(key);
    const expected = [type.semester, type.domain, type.unit, type.label].join("|");
    const actual = [question.classification.semester, question.classification.domain, question.classification.unit, question.classification.typeLabel].join("|");
    if (expected !== actual) throw new Error(`같은 유형 ID에 서로 다른 분류가 연결됐습니다: ${key}`);
    type.questionIds.push(question.questionId);
  });
  return Array.from(map.values()).map(type => ({ ...type, questionIds: type.questionIds.sort() })).sort((a, b) => a.typeId.localeCompare(b.typeId));
}

function rebuildPapers(questions, ledger) {
  const sourceById = new Map(ledger.sources.map(source => [source.sourceId, source]));
  const map = new Map();
  questions.forEach(question => {
    if (!map.has(question.paperId)) {
      const seed = ledger.questions.find(item => item.paperId === question.paperId);
      map.set(question.paperId, {
        paperId: question.paperId,
        title: seed ? seed.paperTitle : question.paperId,
        sourceId: question.sourceId,
        sourceFingerprint: sourceById.get(question.sourceId).sourceFingerprint,
        classificationStatus: "verified",
        evidence: Array.from(new Set(question.classification.evidence)).sort(),
        questionIds: []
      });
    }
    const paper = map.get(question.paperId);
    if (paper.sourceId !== question.sourceId) throw new Error(`시험지에 원본이 둘 이상 연결됐습니다: ${question.paperId}`);
    paper.questionIds.push(question.questionId);
  });
  return Array.from(map.values()).map(paper => ({ ...paper, questionCount: paper.questionIds.length, questionIds: paper.questionIds.sort() }))
    .sort((a, b) => a.paperId.localeCompare(b.paperId));
}

function summarize(database) {
  return {
    sourceCount: new Set(database.questions.map(question => question.sourceId)).size,
    paperCount: database.papers.length,
    questionCount: database.questions.length,
    typeCount: database.typeCatalog.length,
    classificationVerifiedCount: database.questions.filter(question => question.classification.status === "verified").length,
    locatorVerifiedCount: database.questions.filter(question => question.locator.status === "verified").length,
    methodVerifiedCount: database.questions.filter(question => question.method.status === "verified").length,
    difficultyVerifiedCount: database.questions.filter(question => question.difficulty.status === "verified").length,
    answerVerifiedCount: database.questions.filter(question => question.answerCheck.status === "verified").length,
    variantReadyCount: database.questions.filter(question => question.variantSet.status === "verified").length
  };
}

function buildDatabase(ledger, existing, ledgerSha256) {
  const seed = ledger.questions.map(fromLedgerQuestion);
  const questions = mergeExisting(seed, existing).sort((a, b) => a.sourceId.localeCompare(b.sourceId) || a.number - b.number);
  const database = {
    schemaVersion: 1,
    taxonomyVersion: ledger.taxonomyVersion,
    title: "돌파 문항 DB",
    rules: [
      "한 문제는 sourceId와 원본 문항 번호로 만든 questionId 하나만 사용한다.",
      "문제 원문과 정답 값은 이 DB에 저장하지 않는다.",
      "학년·영역·단원·세부 유형은 근거가 있는 문항만 verified로 둔다.",
      "풀이법·난이도·답안·유사문항은 각각 따로 검수한다.",
      "기존 questionId의 출처나 유형이 달라지면 자동 덮어쓰지 않고 오류로 막는다."
    ],
    inputs: { workLedgerSha256: ledgerSha256 },
    papers: [],
    typeCatalog: [],
    questions
  };
  database.papers = rebuildPapers(questions, ledger);
  database.typeCatalog = rebuildTypeCatalog(questions);
  database.summary = summarize(database);
  return database;
}

function main(args) {
  if (args.length < 2 || args.length > 3) {
    throw new Error("사용법: node build-dolpa-question-db.cjs <work-ledger> [existing-db|-] <output>");
  }
  const ledgerPath = args[0];
  const existingPath = args.length === 3 ? args[1] : "-";
  const outputPath = args.length === 3 ? args[2] : args[1];
  const ledger = readJson(ledgerPath);
  const existing = existingPath === "-" || !fs.existsSync(path.resolve(existingPath)) ? null : readJson(existingPath);
  const database = buildDatabase(ledger, existing, fingerprint(ledgerPath));
  fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
  fs.writeFileSync(path.resolve(outputPath), `${JSON.stringify(database, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(database.summary)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ fromLedgerQuestion, mergeExisting, rebuildTypeCatalog, rebuildPapers, summarize, buildDatabase });
