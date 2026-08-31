"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const recordCore = require("./record-dolpa-paper-questions.cjs");
const registerCore = require("./register-dolpa-reviewed-paper.cjs");
const classificationCore = require("./apply-dolpa-classification-review.cjs");
const methodCore = require("./apply-dolpa-method-review.cjs");
const difficultyCore = require("./apply-dolpa-difficulty-review.cjs");
const ledgerCore = require("./build-dolpa-work-ledger.cjs");
const dbCore = require("./build-dolpa-question-db.cjs");
const dbAudit = require("./audit-dolpa-question-db.cjs");
const ledgerAudit = require("./audit-dolpa-work-ledger.cjs");

const AUDIT_SCHEMA = "highselect-dolpa-full-source-audit/v1";
const ACCEPTED_AUDIT_SCHEMAS = new Set([AUDIT_SCHEMA, "1.0.0"]);
const CROSSWALK_SCHEMA = "highselect-dolpa-type-crosswalk/v1";
const REVIEW_DATE = "2026-08-31";

function clean(value) {
  return String(value == null ? "" : value).trim();
}

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function writeJson(filePath, value) {
  const output = path.resolve(filePath);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const temporary = `${output}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  fs.renameSync(temporary, output);
  return output;
}

function responseKind(value) {
  const kind = clean(value);
  const map = {
    short_answer: "input",
    short_answer_with_unit: "input",
    algebraic_expression: "input",
    constructed_response: "multi_input",
    multi_field: "multi_input",
    multi_part: "multi_input",
    ordered_sequence: "multi_input",
    multi_short_answer: "multi_input",
    compound_short_answer: "multi_input",
    coordinate_pair: "multi_input",
    multiple_choice: "single_choice",
    single_choice: "single_choice",
    multi_select: "multi_select",
    unordered_set: "unordered_set"
  };
  if (!map[kind]) throw new Error(`지원하지 않는 답안 형식입니다: ${kind}`);
  return map[kind];
}

function normalizeAnswerStatus(value) {
  const status = clean(value);
  if (status === "verified") return "verified";
  if (status === "disputed") return "disputed";
  if (status === "needs_review" || status === "pending") return "pending";
  throw new Error(`답 검수 상태를 확인해 주세요: ${status}`);
}

function validateAudit(audit) {
  if (!audit || typeof audit !== "object") throw new Error("원본 전체 검수 JSON이 필요합니다.");
  if (!ACCEPTED_AUDIT_SCHEMAS.has(clean(audit.schemaVersion))) throw new Error(`검수 JSON 버전을 확인해 주세요: ${audit.schemaVersion}`);
  const source = audit.source || {};
  if (!/^DP-SRC-[0-9A-F]{12}$/.test(clean(source.sourceId))) throw new Error("sourceId를 확인해 주세요.");
  if (!/^[0-9a-f]{64}$/.test(clean(source.sourceFingerprint))) throw new Error("원본 지문을 확인해 주세요.");
  if (!/^DP-[A-Z0-9-]+$/.test(clean(source.paperIdProposal))) throw new Error("paperId 제안값을 확인해 주세요.");
  if (!Array.isArray(audit.questions) || audit.questions.length !== 30) throw new Error("원본 30문항 검수표가 필요합니다.");
  const numbers = new Set();
  audit.questions.forEach((question, index) => {
    if (question.number !== index + 1 || numbers.has(question.number)) throw new Error(`문항 번호가 이어지지 않습니다: ${question.number}`);
    numbers.add(question.number);
    ["semester", "smallUnit", "fineType", "solutionStructure", "absoluteDifficulty"].forEach(key => {
      if (!clean(question[key])) throw new Error(`${question.number}번의 ${key}가 필요합니다.`);
    });
    if (!["standard", "raised"].includes(question.absoluteDifficulty)) throw new Error(`${question.number}번 난이도를 확인해 주세요.`);
    if (!Number.isSafeInteger(question.page) || question.page < 1) throw new Error(`${question.number}번 페이지를 확인해 주세요.`);
    if (!question.responseFormat || !Number.isSafeInteger(question.responseFormat.slotCount) || question.responseFormat.slotCount < 1) {
      throw new Error(`${question.number}번 답안 칸을 확인해 주세요.`);
    }
    responseKind(question.responseFormat.kind);
    normalizeAnswerStatus(question.answerCheck && question.answerCheck.status);
  });
}

function validateCrosswalk(crosswalk, audit, database) {
  if (!crosswalk || crosswalk.schemaVersion !== CROSSWALK_SCHEMA) throw new Error("유형 대조표 버전을 확인해 주세요.");
  if (crosswalk.sourceId !== audit.source.sourceId) throw new Error("유형 대조표와 원본 sourceId가 다릅니다.");
  if (!Array.isArray(crosswalk.items) || crosswalk.items.length !== 30) throw new Error("30문항 유형 대조표가 필요합니다.");
  const types = new Map(database.typeCatalog.map(type => [type.typeId, type]));
  const decisions = new Map();
  crosswalk.items.forEach((item, index) => {
    const number = Number(item.number);
    if (number !== index + 1 || decisions.has(number)) throw new Error(`유형 대조표 문항 번호를 확인해 주세요: ${number}`);
    if (!["reuse", "new"].includes(item.decision)) throw new Error(`${number}번 유형 결정은 reuse 또는 new여야 합니다.`);
    if (!clean(item.reason)) throw new Error(`${number}번 유형 결정 근거가 필요합니다.`);
    if (item.decision === "reuse") {
      const type = types.get(clean(item.typeId));
      if (!type) throw new Error(`${number}번 재사용 유형을 현재 DB에서 찾을 수 없습니다: ${item.typeId}`);
      if (clean(item.expectedSolutionArchetype) && clean(type.solutionArchetype)
        && clean(item.expectedSolutionArchetype) !== clean(type.solutionArchetype)) {
        throw new Error(`${number}번 재사용 유형의 풀이 구조가 다릅니다: ${item.typeId}`);
      }
    } else {
      if (item.typeId) throw new Error(`${number}번 새 유형에는 기존 typeId를 넣지 않습니다.`);
      const question = audit.questions[number - 1];
      const canonical = item.canonical || {};
      const derived = ledgerCore.stableTypeId(
        clean(canonical.semester) || question.semester,
        clean(canonical.unit) || question.smallUnit,
        clean(canonical.typeLabel) || question.fineType
      );
      if (types.has(derived)) throw new Error(`${number}번은 현재 DB에 같은 유형 ID가 있으므로 reuse로 연결해야 합니다: ${derived}`);
    }
    decisions.set(number, item);
  });
  return decisions;
}

function slotNumbers(questions) {
  const byPage = new Map();
  questions.forEach(question => {
    if (!byPage.has(question.page)) byPage.set(question.page, []);
    byPage.get(question.page).push(question.number);
  });
  const result = new Map();
  byPage.forEach(numbers => numbers.sort((a, b) => a - b).forEach((number, index) => result.set(number, index + 1)));
  return result;
}

function canonicalClassification(question, decision, database) {
  if (decision.decision === "new") {
    const canonical = decision.canonical || {};
    return {
      semester: clean(canonical.semester) || clean(question.semester),
      unit: clean(canonical.unit) || clean(question.smallUnit),
      typeLabel: clean(canonical.typeLabel) || clean(question.fineType)
    };
  }
  const type = database.typeCatalog.find(item => item.typeId === decision.typeId);
  return { semester: type.semester, unit: type.unit, typeLabel: type.label };
}

function observedTerminal(audit) {
  const terminal = clean(audit.coursePlacement && audit.coursePlacement.terminalCoreUnit);
  const match = terminal.match(/^(초|중|고)[0-9]+-[12]/u);
  const semester = match ? match[0] : clean(audit.questions[audit.questions.length - 1].semester);
  const candidates = audit.questions.filter(question => question.semester === semester && question.scopeRole !== "future_unit_diagnostic");
  const unit = candidates.length ? clean(candidates[candidates.length - 1].smallUnit) : terminal;
  return { semester, unit };
}

function buildPackets(audit, crosswalk, database) {
  validateAudit(audit);
  const decisions = validateCrosswalk(crosswalk, audit, database);
  const source = audit.source;
  const paperId = clean(source.paperIdProposal);
  const evidenceRoot = `dolpa.${paperId.toLowerCase().replace(/[^a-z0-9]+/g, ".")}`;
  const evidenceId = `${evidenceRoot}.full-source-audit-v1`;
  const slots = slotNumbers(audit.questions);
  const rows = audit.questions.map(question => {
    const decision = decisions.get(question.number);
    const classification = canonicalClassification(question, decision, database);
    const answerStatus = normalizeAnswerStatus(question.answerCheck.status);
    return { question, decision, classification, answerStatus, questionId: ledgerCore.stableQuestionId(source.sourceId, question.number) };
  });
  const paperQuestions = rows.map(({ question, classification, answerStatus }) => ({
    number: question.number,
    page: question.page,
    slot: slots.get(question.number),
    semester: classification.semester,
    unit: classification.unit,
    typeLabel: classification.typeLabel,
    responseFormat: responseKind(question.responseFormat.kind),
    slotCount: question.responseFormat.slotCount,
    answerStatus,
    ...(answerStatus === "disputed" ? { answerNote: "공식 답과 독립 검산이 일치하지 않아 재검수 필요" } : {})
  }));
  const paperReview = {
    schemaVersion: "highselect-dolpa-paper-review/v1",
    sourceId: source.sourceId,
    sourceFingerprint: source.sourceFingerprint,
    paperId,
    title: source.title,
    registryEvidenceRecordId: evidenceId,
    evidenceRecordId: evidenceId,
    paperEvidenceId: evidenceId,
    locatorEvidenceId: evidenceId,
    responseEvidenceId: evidenceId,
    answerEvidenceId: evidenceId,
    reviewedAt: clean(audit.auditDate) || REVIEW_DATE,
    examTimeMinutes: source.timeMinutes,
    sourceFacts: [{
      label: "원본 표기",
      value: `CUT : ${source.sourceCutFactOnly}개`,
      interpretation: "원본에 적힌 문구만 보존하며 현재 합격 기준으로 사용하지 않음"
    }],
    coverage: {
      coverageKind: audit.coursePlacement.midCourseJoin ? "mid_unit_cutoff" : "full_range",
      declaredScopeLabel: clean(audit.coursePlacement.centralScope),
      observedTerminal: observedTerminal(audit),
      note: `${clean(audit.coursePlacement.target)}에 해당하는 원본 30문항과 답안 페이지를 직접 대조했다. 범위를 벗어난 확인용 문항은 원본 DB에는 보존하되 대표 시험 구성에서는 별도로 구분한다.`
    },
    questions: paperQuestions
  };
  const recordManifest = {
    paperId,
    sourceId: source.sourceId,
    title: source.title,
    evidenceId,
    answerEvidenceId: evidenceId,
    questions: paperQuestions.map(question => ({
      number: question.number,
      semester: question.semester,
      unit: question.unit,
      typeLabel: question.typeLabel,
      sourceRelation: "original",
      page: question.page,
      slot: question.slot,
      responseKind: question.responseFormat,
      responseSlotCount: question.slotCount
    }))
  };
  const classificationReview = {
    schemaVersion: "highselect-dolpa-classification-review/v1",
    reviewId: `${paperId.toLowerCase()}-classification-review-v1`,
    sourceId: source.sourceId,
    paperId,
    reviewedAt: clean(audit.auditDate) || REVIEW_DATE,
    reviews: rows.map(({ question, classification, questionId }) => ({
      questionId,
      number: question.number,
      ...classification,
      evidenceLocator: `p.${question.page} Q${question.number}`,
      reason: decisions.get(question.number).decision === "reuse"
        ? "원본의 조건과 풀이 구조를 기존 세부 유형과 대조해 같은 유형으로 확인했다."
        : "원본의 조건과 풀이 구조를 확인해 독립 세부 유형으로 분류했다."
    }))
  };
  const methodReview = {
    schemaVersion: "highselect-dolpa-method-review/v1",
    reviewId: `${paperId.toLowerCase()}-method-review-v1`,
    sourceId: source.sourceId,
    paperId,
    reviewedAt: clean(audit.auditDate) || REVIEW_DATE,
    reviews: rows.map(({ question, decision, classification, questionId }) => ({
      questionId,
      number: question.number,
      solutionArchetype: clean(decision.canonical && decision.canonical.solutionArchetype) || clean(question.solutionStructure),
      tags: Array.from(new Set([
        clean(question.largeUnit),
        classification.unit,
        classification.typeLabel,
        ...(Array.isArray(decision.canonical && decision.canonical.methodTags) ? decision.canonical.methodTags.map(clean) : []),
        ...(Array.isArray(question.academyStyleTags) ? question.academyStyleTags.map(clean) : [])
      ].filter(Boolean))).slice(0, 6),
      evidenceLocator: `p.${question.page} Q${question.number}`,
      confidence: question.answerCheck.status === "verified" ? "high" : "medium"
    }))
  };
  const difficultyReview = {
    schemaVersion: "highselect-dolpa-difficulty-review/v1",
    reviewId: `${paperId.toLowerCase()}-difficulty-review-v1`,
    sourceId: source.sourceId,
    paperId,
    reviewedAt: clean(audit.auditDate) || REVIEW_DATE,
    rubric: { standard: "한 핵심 개념의 직접 적용", raised: "개념 결합·조건 분기·역추론·복합 모델링" },
    reviews: rows.map(({ question, questionId }) => ({
      questionId,
      number: question.number,
      band: question.absoluteDifficulty,
      evidenceLocator: `p.${question.page} Q${question.number}`,
      reason: clean(question.difficultyReason) || "원본 조건 수와 풀이 단계, 계산 부담을 함께 대조했다.",
      confidence: question.answerCheck.status === "verified" ? "high" : "medium"
    }))
  };
  return { evidenceId, rows, paperReview, recordManifest, classificationReview, methodReview, difficultyReview };
}

function mergeDecisionSource(reviewDecisions, audit, packets) {
  const next = structuredClone(reviewDecisions);
  const sourceId = audit.source.sourceId;
  const verified = audit.summary.verified;
  const pending = audit.summary.needsReview || 0;
  const disputed = audit.summary.disputed || 0;
  const taskEvidence = [packets.evidenceId];
  const task = (status, note, evidence = taskEvidence) => ({ status, evidence, note });
  const entry = {
    sourceId,
    tasks: {
      bodyReview: task("verified", "원본 30문항의 본문과 위치를 직접 확인"),
      answerReview: task(verified === 30 ? "verified" : "sampled", `답 확인 ${verified}문항, 확인 대기 ${pending}문항, 이견 ${disputed}문항`),
      questionSegmentation: task("verified", "원본 30문항을 한 문제씩 분리하고 페이지와 칸을 확인"),
      typeClassification: task("verified", "학기·단원·세부 유형을 원본과 기존 유형 DB에 대조"),
      difficultyReview: task("verified", "원본 풀이 단계와 조건 수를 기준으로 30문항 난이도를 확인", [packets.difficultyReview.reviewId]),
      learnerFitReview: task("pending", "학생별 적합성 검수 전이므로 사용 승인을 잠금", []),
      analysisReport: task("verified", "범위·단원·난이도·답안 형식을 집계한 대표 시험 분석 자료를 생성", [`${packets.paperReview.paperId.toLowerCase()}-analysis-report-v1`])
    }
  };
  next.sourceReviews = (next.sourceReviews || []).filter(item => item.sourceId !== sourceId).concat(entry)
    .sort((a, b) => a.sourceId.localeCompare(b.sourceId));
  return next;
}

function syncLedgerQuestionReviews(ledger, database, sourceId) {
  const selected = sourceId ? database.questions.filter(question => question.sourceId === sourceId) : database.questions;
  const byId = new Map(selected.map(question => [question.questionId, question]));
  const ledgerQuestions = sourceId ? ledger.questions.filter(question => question.sourceId === sourceId) : ledger.questions;
  ledgerQuestions.forEach(question => {
    const dbQuestion = byId.get(question.questionId);
    if (!dbQuestion) throw new Error(`문항 DB와 장부 연결이 끊겼습니다: ${question.questionId}`);
    question.type.methodTags = dbQuestion.method.tags;
    question.type.methodReviewStatus = dbQuestion.method.status;
    question.difficulty = structuredClone(dbQuestion.difficulty);
  });
  ledger.summary.difficultyVerifiedQuestionCount = ledger.questions.filter(question => question.difficulty.status === "verified").length;
}

function buildAnalysisReport(audit, database, packets) {
  const questions = database.questions.filter(question => question.sourceId === audit.source.sourceId);
  const counts = values => Object.fromEntries(Array.from(new Set(values)).sort().map(value => [value, values.filter(item => item === value).length]));
  const standardCount = questions.filter(question => question.difficulty.band === "standard").length;
  const raisedCount = questions.filter(question => question.difficulty.band === "raised").length;
  return {
    schemaVersion: "highselect-dolpa-representative-analysis/v1",
    reportId: `${packets.paperReview.paperId.toLowerCase()}-analysis-report-v1`,
    sourceId: audit.source.sourceId,
    paperId: packets.paperReview.paperId,
    title: audit.source.title,
    processRole: audit.coursePlacement.processRole,
    target: audit.coursePlacement.target,
    declaredScope: audit.coursePlacement.centralScope,
    observedTerminal: packets.paperReview.coverage.observedTerminal,
    questionCount: questions.length,
    reviewedAt: clean(audit.auditDate) || REVIEW_DATE,
    summary: {
      questionCount: questions.length,
      standardCount,
      raisedCount,
      raisedRate: Number(((raisedCount / questions.length) * 100).toFixed(1)),
      answerDisputeCount: audit.summary.disputed || 0,
      dominantDomains: Object.entries(counts(questions.map(question => question.classification.domain)))
        .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0])).slice(0, 3).map(([domain]) => domain)
    },
    bySemester: counts(questions.map(question => question.classification.semester)),
    byUnit: counts(questions.map(question => question.classification.unit)),
    byDifficulty: counts(questions.map(question => question.difficulty.band)),
    byResponseKind: counts(questions.map(question => question.responseFormat.kind)),
    answerReview: {
      verified: audit.summary.verified,
      pending: audit.summary.needsReview || 0,
      disputed: audit.summary.disputed || 0
    },
    releaseStatus: "locked",
    usageApprovalCount: 0,
    evidence: [packets.evidenceId]
  };
}

function importAudit(input) {
  const { audit, crosswalk, database, ledger, typeIndex, paperLinks, reviewDecisions, inventory, queue } = input;
  const source = ledger.sources.find(item => item.sourceId === audit.source.sourceId);
  if (!source) throw new Error(`작업 장부에 없는 원본입니다: ${audit.source.sourceId}`);
  if (source.sourceFingerprint !== audit.source.sourceFingerprint) throw new Error("작업 장부와 검수 원본 지문이 다릅니다.");
  if (database.papers.some(paper => paper.sourceId === audit.source.sourceId)) throw new Error("이미 문항 DB에 등록된 원본입니다.");
  const packets = buildPackets(audit, crosswalk, database);
  let nextDatabase = recordCore.merge(structuredClone(database), ledger, packets.recordManifest).database;
  nextDatabase = registerCore.applyToDatabase(nextDatabase, packets.paperReview);
  nextDatabase = classificationCore.applyClassificationReview(nextDatabase, packets.classificationReview);
  nextDatabase = methodCore.applyMethodReview(nextDatabase, packets.methodReview);
  nextDatabase = difficultyCore.applyDifficultyReview(nextDatabase, packets.difficultyReview);
  const rows = new Map(packets.rows.map(row => [row.question.number, row]));
  nextDatabase.questions.filter(question => question.sourceId === audit.source.sourceId).forEach(question => {
    const row = rows.get(question.number);
    question.responseFormat = {
      kind: responseKind(row.question.responseFormat.kind),
      slotCount: row.question.responseFormat.slotCount,
      status: "verified",
      evidence: [packets.evidenceId],
      ordered: Boolean(row.question.responseFormat.ordered),
      fieldOrder: Array.isArray(row.question.responseFormat.fieldOrder) ? row.question.responseFormat.fieldOrder.map(clean) : []
    };
    question.releaseStatus = "locked";
    Object.values(question.usageProfiles || {}).forEach(profile => {
      profile.approvals = [];
      if (row.answerStatus !== "verified") profile.status = "candidate";
    });
  });
  nextDatabase.typeCatalog = dbCore.rebuildTypeCatalog(nextDatabase.questions);
  nextDatabase.summary = dbCore.summarize(nextDatabase);
  const databaseResult = dbAudit.audit(nextDatabase);
  if (!databaseResult.ok) throw new Error(`문항 DB 검사가 실패했습니다: ${databaseResult.issues.join(", ")}`);

  const registry = registerCore.registerSources(typeIndex, paperLinks, reviewDecisions, packets.paperReview, nextDatabase);
  registry.reviewDecisions = mergeDecisionSource(registry.reviewDecisions, audit, packets);
  const typeIndexHash = crypto.createHash("sha256").update(JSON.stringify(registry.typeIndex)).digest("hex");
  const linksHash = crypto.createHash("sha256").update(JSON.stringify(registry.paperLinks)).digest("hex");
  const decisionsHash = crypto.createHash("sha256").update(JSON.stringify(registry.reviewDecisions)).digest("hex");
  const nextLedger = ledgerCore.buildLedger(inventory, queue, registry.typeIndex, registry.paperLinks, registry.reviewDecisions, {
    inventorySha256: crypto.createHash("sha256").update(JSON.stringify(inventory)).digest("hex"),
    queueSha256: crypto.createHash("sha256").update(JSON.stringify(queue)).digest("hex"),
    typeIndexSha256: typeIndexHash,
    paperLinksSha256: linksHash,
    reviewDecisionsSha256: decisionsHash
  });
  syncLedgerQuestionReviews(nextLedger, nextDatabase);
  const ledgerResult = ledgerAudit.audit(nextLedger);
  if (!ledgerResult.ok) throw new Error(`작업 장부 검사가 실패했습니다: ${ledgerResult.issues.join(", ")}`);
  return {
    database: nextDatabase,
    ledger: nextLedger,
    typeIndex: registry.typeIndex,
    paperLinks: registry.paperLinks,
    reviewDecisions: registry.reviewDecisions,
    analysisReport: buildAnalysisReport(audit, nextDatabase, packets),
    packets
  };
}

function main(args) {
  if (args.length !== 11) {
    throw new Error("사용법: node import-dolpa-full-source-audit.cjs <db> <ledger> <type-index> <paper-links> <review-decisions> <inventory> <queue> <audit> <crosswalk> <output-dir> <label>");
  }
  const [dbPath, ledgerPath, typeIndexPath, linksPath, decisionsPath, inventoryPath, queuePath, auditPath, crosswalkPath, outputDir, label] = args;
  const result = importAudit({
    database: readJson(dbPath), ledger: readJson(ledgerPath), typeIndex: readJson(typeIndexPath), paperLinks: readJson(linksPath),
    reviewDecisions: readJson(decisionsPath), inventory: readJson(inventoryPath), queue: readJson(queuePath),
    audit: readJson(auditPath), crosswalk: readJson(crosswalkPath)
  });
  const root = path.resolve(outputDir);
  const outputs = {
    database: writeJson(path.join(root, "dolpa-question-db-v1.json"), result.database),
    ledger: writeJson(path.join(root, "dolpa-work-ledger-v1.json"), result.ledger),
    typeIndex: writeJson(path.join(root, "dolpa-original-question-index-v1.json"), result.typeIndex),
    paperLinks: writeJson(path.join(root, "dolpa-paper-links-v1.json"), result.paperLinks),
    reviewDecisions: writeJson(path.join(root, "dolpa-review-decisions-v1.json"), result.reviewDecisions),
    analysisReport: writeJson(path.join(root, `${label}-representative-analysis-v1.json`), result.analysisReport),
    paperReview: writeJson(path.join(root, `${label}-paper-review-v1.json`), result.packets.paperReview),
    classificationReview: writeJson(path.join(root, `${label}-classification-review-v1.json`), result.packets.classificationReview),
    methodReview: writeJson(path.join(root, `${label}-method-review-v1.json`), result.packets.methodReview),
    difficultyReview: writeJson(path.join(root, `${label}-difficulty-review-v1.json`), result.packets.difficultyReview)
  };
  const manifest = {
    schemaVersion: "highselect-dolpa-staged-import/v1",
    label,
    sourceId: result.analysisReport.sourceId,
    paperId: result.analysisReport.paperId,
    releaseStatus: "locked",
    usageApprovalCount: 0,
    outputs: Object.fromEntries(Object.entries(outputs).map(([key, file]) => [key, { file: path.basename(file), sha256: sha256(file) }]))
  };
  writeJson(path.join(root, `${label}-staged-import-manifest-v1.json`), manifest);
  process.stdout.write(`${JSON.stringify({ summary: result.database.summary, ledger: result.ledger.summary, manifest }, null, 2)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({
  AUDIT_SCHEMA, ACCEPTED_AUDIT_SCHEMAS, CROSSWALK_SCHEMA, responseKind, normalizeAnswerStatus, validateAudit, validateCrosswalk,
  slotNumbers, canonicalClassification, observedTerminal, buildPackets, mergeDecisionSource, syncLedgerQuestionReviews,
  buildAnalysisReport, importAudit
});
