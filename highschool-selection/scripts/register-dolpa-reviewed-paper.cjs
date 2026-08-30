"use strict";

const fs = require("node:fs");
const path = require("node:path");
const dbCore = require("./build-dolpa-question-db.cjs");
const { stableQuestionId } = require("./build-dolpa-work-ledger.cjs");

const FORBIDDEN_KEYS = new Set([
  "prompt", "stem", "answer", "answerValue", "solution", "content", "rawText", "pageImage", "privatePath"
]);
const RESPONSE_KINDS = new Set(["single_choice", "input", "open_response", "multi_select", "multi_input", "unordered_set"]);

function canonicalResponseKind(value) {
  const kind = clean(value);
  return kind === "open_response" ? "input" : kind;
}

function clean(value) {
  return String(value == null ? "" : value).trim();
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function walk(value, pointer, issues) {
  if (!value || typeof value !== "object") return;
  Object.entries(value).forEach(([key, child]) => {
    if (FORBIDDEN_KEYS.has(key)) issues.push(`forbidden:${pointer}/${key}`);
    walk(child, `${pointer}/${key}`, issues);
  });
}

function validatePacket(packet) {
  const issues = [];
  walk(packet, "", issues);
  if (packet.schemaVersion !== "highselect-dolpa-paper-review/v1") issues.push("schemaVersion");
  if (!/^DP-SRC-[0-9A-F]{12}$/.test(clean(packet.sourceId))) issues.push("sourceId");
  if (!/^[0-9a-f]{64}$/.test(clean(packet.sourceFingerprint))) issues.push("sourceFingerprint");
  ["paperId", "title", "registryEvidenceRecordId", "evidenceRecordId", "answerEvidenceId", "reviewedAt"].forEach(key => {
    if (!clean(packet[key])) issues.push(key);
  });
  const coverage = packet.coverage || {};
  if (!new Set(["full_range", "mid_unit_cutoff", "mixed_range"]).has(clean(coverage.coverageKind))) issues.push("coverage.coverageKind");
  if (!clean(coverage.declaredScopeLabel) || !clean(coverage.note)) issues.push("coverage.text");
  if (!clean(coverage.observedTerminal && coverage.observedTerminal.semester) || !clean(coverage.observedTerminal && coverage.observedTerminal.unit)) {
    issues.push("coverage.observedTerminal");
  }
  const questions = Array.isArray(packet.questions) ? packet.questions : [];
  const variant = packet.variant || null;
  const isPartialVariant = Boolean(variant);
  if (isPartialVariant) {
    if (variant.kind !== "partial_question_variant") issues.push("variant.kind");
    if (!clean(variant.primaryPaperId)) issues.push("variant.primaryPaperId");
    if (!Array.isArray(variant.sharedQuestionLinks) || !variant.sharedQuestionLinks.length) issues.push("variant.sharedQuestionLinks");
  } else if (questions.length !== 30) issues.push("questions.length");
  if (isPartialVariant && !questions.length) issues.push("questions.length");
  const numbers = new Set();
  const locators = new Set();
  questions.forEach((question, index) => {
    const prefix = `questions[${index}]`;
    if (!Number.isSafeInteger(question.number) || question.number < 1 || question.number > 30 || numbers.has(question.number)) issues.push(`${prefix}.number`);
    numbers.add(question.number);
    const pageValid = Number.isSafeInteger(question.page) && question.page >= 1;
    const slotValid = question.slot == null || (Number.isSafeInteger(question.slot) && question.slot >= 1);
    if (!pageValid || !slotValid) issues.push(`${prefix}.locator`);
    if (pageValid && Number.isSafeInteger(question.slot)) {
      const locatorKey = `${question.page}:${question.slot}`;
      if (locators.has(locatorKey)) issues.push(`${prefix}.locatorDuplicate`);
      locators.add(locatorKey);
    }
    ["semester", "unit", "typeLabel"].forEach(key => {
      if (!clean(question[key])) issues.push(`${prefix}.${key}`);
    });
    if (!RESPONSE_KINDS.has(clean(question.responseFormat))) issues.push(`${prefix}.responseFormat`);
    if (!Number.isSafeInteger(question.slotCount) || question.slotCount < 1) issues.push(`${prefix}.slotCount`);
    const canonicalKind = canonicalResponseKind(question.responseFormat);
    if (["single_choice", "input"].includes(canonicalKind) && question.slotCount !== 1) issues.push(`${prefix}.slotCountSingle`);
    if (["multi_select", "multi_input", "unordered_set"].includes(canonicalKind) && question.slotCount < 2) issues.push(`${prefix}.slotCountMulti`);
  });
  if (isPartialVariant) {
    const sharedNumbers = new Set();
    (variant.sharedQuestionLinks || []).forEach((link, index) => {
      const prefix = `variant.sharedQuestionLinks[${index}]`;
      if (!Number.isSafeInteger(link.number) || link.number < 1 || link.number > 30
        || sharedNumbers.has(link.number) || numbers.has(link.number)) issues.push(`${prefix}.number`);
      if (!/^DP-Q-[0-9A-F]{12}-[0-9]{3}$/.test(clean(link.questionId))) {
        issues.push(`${prefix}.questionId`);
      }
      if (!Number.isSafeInteger(link.page) || link.page < 1 || !Number.isSafeInteger(link.slot) || link.slot < 1) {
        issues.push(`${prefix}.locator`);
      }
      if (!Array.isArray(link.evidence) || !link.evidence.length || link.evidence.some(value => !clean(value))) {
        issues.push(`${prefix}.evidence`);
      }
      sharedNumbers.add(link.number);
    });
    for (let number = 1; number <= 30; number += 1) {
      if (!numbers.has(number) && !sharedNumbers.has(number)) issues.push(`missing:${number}`);
    }
    if (numbers.size + sharedNumbers.size !== 30) issues.push("variant.coverage");
  } else {
    for (let number = 1; number <= 30; number += 1) if (!numbers.has(number)) issues.push(`missing:${number}`);
  }
  if (issues.length) throw new Error(`돌파 시험지 검수표를 확인해 주세요: ${issues.join(", ")}`);
}

function registerSources(typeIndex, paperLinks, reviewDecisions, packet) {
  validatePacket(packet);
  if (typeIndex.schemaVersion !== 1 || !Array.isArray(typeIndex.papers)) throw new Error("돌파 원본 유형표 버전을 확인해 주세요.");
  if (paperLinks.schemaVersion !== 1 || !Array.isArray(paperLinks.links)) throw new Error("돌파 시험지 연결표 버전을 확인해 주세요.");
  if (reviewDecisions.schemaVersion !== 1 || !Array.isArray(reviewDecisions.sourceReviews)) throw new Error("돌파 검수 결정표 버전을 확인해 주세요.");
  const nextIndex = JSON.parse(JSON.stringify(typeIndex));
  const nextLinks = JSON.parse(JSON.stringify(paperLinks));
  const nextDecisions = JSON.parse(JSON.stringify(reviewDecisions));
  const variant = packet.variant ? {
    kind: "partial_question_variant",
    primaryPaperId: clean(packet.variant.primaryPaperId),
    sharedQuestionLinks: packet.variant.sharedQuestionLinks.slice().sort((a, b) => a.number - b.number).map(link => ({
      number: link.number,
      questionId: clean(link.questionId),
      page: link.page,
      slot: link.slot,
      evidence: Array.from(new Set(link.evidence.map(clean))).sort()
    }))
  } : null;
  const paper = {
    paperId: clean(packet.paperId),
    title: clean(packet.title),
    sourceKind: "돌파 원본 시험지",
    questionCount: 30,
    originalCount: variant ? 0 : 30,
    replacementCount: variant ? packet.questions.length : 0,
    ...(variant ? {
      sharedCount: variant.sharedQuestionLinks.length,
      sharedCanonicalCount: new Set(variant.sharedQuestionLinks.map(link => link.questionId)).size,
      variant
    } : {}),
    questions: packet.questions.slice().sort((a, b) => a.number - b.number).map(question => ({
      number: question.number,
      semester: clean(question.semester),
      unit: clean(question.unit),
      type: clean(question.typeLabel),
      sourceKind: "돌파 원본 시험지",
      sourceRelation: variant ? "replacement" : "original",
      similarQuestionStatus: "만들기 전"
    }))
  };
  const priorPaper = nextIndex.papers.find(item => item.paperId === paper.paperId);
  if (priorPaper && JSON.stringify(priorPaper) !== JSON.stringify(paper)) throw new Error(`같은 paperId의 원본 유형표가 다릅니다: ${paper.paperId}`);
  if (!priorPaper) nextIndex.papers.push(paper);
  nextIndex.papers.sort((left, right) => left.paperId.localeCompare(right.paperId));
  nextIndex.totalQuestionCount = nextIndex.papers.reduce((sum, item) => sum + item.questionCount, 0);

  const link = {
    paperId: paper.paperId,
    sourceId: clean(packet.sourceId),
    evidenceStatus: "verified",
    evidenceRecordId: clean(packet.registryEvidenceRecordId),
    verifiedStages: ["bodyReview", "answerReview", "questionSegmentation", "typeClassification"],
    ...(variant ? { variant } : {})
  };
  const sameSource = nextLinks.links.find(item => item.sourceId === link.sourceId);
  if (sameSource && JSON.stringify(sameSource) !== JSON.stringify(link)) throw new Error(`같은 원본의 시험지 연결이 다릅니다: ${link.sourceId}`);
  const samePaper = nextLinks.links.find(item => item.paperId === link.paperId);
  if (samePaper && JSON.stringify(samePaper) !== JSON.stringify(link)) throw new Error(`같은 paperId의 연결이 다릅니다: ${link.paperId}`);
  if (!sameSource && !samePaper) nextLinks.links.push(link);
  nextLinks.links.sort((left, right) => left.paperId.localeCompare(right.paperId));

  const tasks = Object.fromEntries(link.verifiedStages.map(stage => [stage, {
    status: "verified",
    evidence: [clean(packet.registryEvidenceRecordId)],
    note: variant
      ? `대표 시험 공유 ${variant.sharedQuestionLinks.length}문항과 교체 ${packet.questions.length}문항을 원본 화면에서 직접 확인`
      : "문제 본문 30문항, 답안 30개, 문항 위치와 교육과정 세부 유형을 원본 화면에서 직접 확인"
  }]));
  const decision = { sourceId: link.sourceId, tasks };
  const priorDecision = nextDecisions.sourceReviews.find(item => item.sourceId === decision.sourceId);
  if (priorDecision) {
    priorDecision.tasks = priorDecision.tasks || {};
    link.verifiedStages.forEach(stage => {
      const priorTask = priorDecision.tasks[stage];
      if (!priorTask || ["sampled", "pending", "not_started"].includes(priorTask.status)) {
        priorDecision.tasks[stage] = {
          ...tasks[stage],
          evidence: Array.from(new Set([...(priorTask && priorTask.evidence || []), link.evidenceRecordId])).sort()
        };
        return;
      }
      if (priorTask.status !== "verified") throw new Error(`기존 차단 사유를 확인해 주세요: ${decision.sourceId}/${stage}`);
      priorDecision.tasks[stage] = {
        ...priorTask,
        evidence: Array.from(new Set([...(priorTask.evidence || []), link.evidenceRecordId])).sort()
      };
    });
  }
  if (!priorDecision) nextDecisions.sourceReviews.push(decision);
  nextDecisions.sourceReviews.sort((left, right) => left.sourceId.localeCompare(right.sourceId));
  return { typeIndex: nextIndex, paperLinks: nextLinks, reviewDecisions: nextDecisions };
}

function applyToDatabase(database, packet) {
  validatePacket(packet);
  const next = JSON.parse(JSON.stringify(database));
  const paper = next.papers.find(item => item.paperId === packet.paperId);
  if (!paper || paper.sourceId !== packet.sourceId || paper.sourceFingerprint !== packet.sourceFingerprint) {
    throw new Error("시험지 검수표와 문항 DB 원본이 일치하지 않습니다.");
  }
  const isPartialVariant = Boolean(packet.variant);
  if (isPartialVariant) {
    const packetSharedLinks = packet.variant.sharedQuestionLinks.slice().sort((a, b) => a.number - b.number).map(link => ({
      number: link.number,
      questionId: clean(link.questionId),
      page: link.page,
      slot: link.slot,
      evidence: Array.from(new Set(link.evidence.map(clean))).sort()
    }));
    if (!paper.variant || paper.variant.kind !== "partial_question_variant"
      || paper.variant.primaryPaperId !== clean(packet.variant.primaryPaperId)
      || JSON.stringify(paper.variant.sharedQuestionLinks) !== JSON.stringify(packetSharedLinks)) {
      throw new Error("부분 교체 시험지의 공유 문항 연결이 문항 DB와 다릅니다.");
    }
  } else if (paper.variant) {
    throw new Error("부분 교체 시험지는 공유 문항 연결이 있는 검수표가 필요합니다.");
  }
  const questions = new Map(next.questions.filter(item => item.paperId === packet.paperId).map(item => [item.number, item]));
  const expectedOwnedCount = isPartialVariant ? packet.questions.length : 30;
  if (questions.size !== expectedOwnedCount) throw new Error("시험지가 직접 소유한 문항 수가 검수표와 다릅니다.");
  const locatorEvidenceId = clean(packet.locatorEvidenceId || packet.evidenceRecordId);
  const responseEvidenceId = clean(packet.responseEvidenceId || packet.evidenceRecordId);
  const paperEvidenceId = clean(packet.paperEvidenceId || packet.registryEvidenceRecordId);
  packet.questions.forEach(review => {
    const question = questions.get(review.number);
    if (!question || question.questionId !== stableQuestionId(packet.sourceId, review.number)) throw new Error(`문항 위치가 일치하지 않습니다: ${review.number}`);
    question.locator = { page: review.page, slot: review.slot, status: "verified", evidence: [locatorEvidenceId] };
    const responseKind = canonicalResponseKind(review.responseFormat);
    question.responseFormat = { kind: responseKind, slotCount: review.slotCount, status: "verified", evidence: [responseEvidenceId] };
    if (question.answerCheck.status !== "disputed") {
      question.answerCheck = { status: "verified", evidence: [clean(packet.answerEvidenceId)] };
    }
  });
  paper.coverage = {
    coverageKind: clean(packet.coverage.coverageKind),
    declaredScopeLabel: clean(packet.coverage.declaredScopeLabel),
    observedTerminal: {
      semester: clean(packet.coverage.observedTerminal.semester),
      unit: clean(packet.coverage.observedTerminal.unit)
    },
    status: "verified",
    evidence: [clean(packet.evidenceRecordId)],
    note: clean(packet.coverage.note)
  };
  paper.evidence = [paperEvidenceId];
  next.typeCatalog = dbCore.rebuildTypeCatalog(next.questions);
  next.summary = dbCore.summarize(next);
  return next;
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });
  fs.writeFileSync(path.resolve(filePath), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function main(args) {
  const mode = args.shift();
  if (mode === "registry" && args.length === 7) {
    const result = registerSources(readJson(args[0]), readJson(args[1]), readJson(args[2]), readJson(args[3]));
    writeJson(args[4], result.typeIndex);
    writeJson(args[5], result.paperLinks);
    writeJson(args[6], result.reviewDecisions);
    process.stdout.write(`${JSON.stringify({ paperCount: result.typeIndex.papers.length, linkCount: result.paperLinks.links.length })}\n`);
    return;
  }
  if (mode === "database" && args.length === 3) {
    const result = applyToDatabase(readJson(args[0]), readJson(args[1]));
    writeJson(args[2], result);
    process.stdout.write(`${JSON.stringify(result.summary)}\n`);
    return;
  }
  throw new Error("사용법: register-dolpa-reviewed-paper.cjs registry <type-index> <links> <decisions> <packet> <out-index> <out-links> <out-decisions> | database <db> <packet> <out-db>");
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ canonicalResponseKind, validatePacket, registerSources, applyToDatabase });
