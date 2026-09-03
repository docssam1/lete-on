"use strict";

const fs = require("node:fs");
const path = require("node:path");
const dbCore = require("./build-dolpa-question-db.cjs");
const { stableQuestionId } = require("./build-dolpa-work-ledger.cjs");

const FORBIDDEN_KEYS = new Set([
  "prompt", "stem", "answer", "answervalue", "answerkey", "officialanswer", "officialanswerkey",
  "sourceofficialanswer", "independentanswer", "independentlyderivedanswer", "derivedanswer", "correctanswer",
  "solution", "content", "rawtext", "pageimage", "privatepath"
]);
const RESPONSE_KINDS = new Set(["single_choice", "input", "open_response", "multi_select", "multi_input", "unordered_set"]);
const ANSWER_STATUSES = new Set(["verified", "disputed", "pending"]);
const VERIFIED_STAGES = Object.freeze(["bodyReview", "answerReview", "questionSegmentation", "typeClassification"]);

function canonicalResponseKind(value) {
  const kind = clean(value);
  return kind === "open_response" ? "input" : kind;
}

function clean(value) {
  return String(value == null ? "" : value).trim();
}

function normalizedKey(value) {
  return clean(value).normalize("NFKC").toLowerCase().replace(/[^a-z0-9가-힣]/g, "");
}

function sensitivePathLeak(value) {
  const text = clean(value);
  if (!text) return false;
  return /(?:^|[\s"'`(])(?:[a-z]:[\\/]|\\\\[^\\\s]+\\|\/(?:users|home)\/|file:\/\/)/iu.test(text)
    || /(?:^|[\\/\s])(?:answers?|answer[-_ ]?key|solutions?)[-_ .()a-z0-9가-힣]*\.(?:pdf|hwp|hwpx|png|jpe?g)(?:$|[\s"'`)])/iu.test(text);
}

function answerStatus(question) {
  return clean(question && question.answerStatus) || "verified";
}

function answerNoteLeaksValue(value) {
  const note = clean(value);
  if (!note) return false;
  return /[0-9①-⑳⓪❶-❿０-９°π]/u.test(note)
    || /(?:정답|공식\s*답|독립\s*답)\s*(?:은|는|:|=)/u.test(note)
    || /(?:^|\s)(?:정답|공식\s*답|독립\s*답)[^\n]{0,24}(?:[=≠<>]|ㄱ|ㄴ|ㄷ|ㄹ|ㅁ|ㅂ|ㅅ|ㅇ|ㅈ|ㅊ|ㅋ|ㅌ|ㅍ|ㅎ)/u.test(note);
}

function answerReviewNeedsDatabase(packet) {
  return packet.questions.some(question => !clean(question.answerStatus))
    || Boolean(packet.variant && packet.variant.sharedQuestionLinks && packet.variant.sharedQuestionLinks.length);
}

function summarizeAnswerReview(packet, database = null) {
  if (answerReviewNeedsDatabase(packet) && (!database || !Array.isArray(database.questions))) {
    throw new Error("답 상태를 합칠 문항 DB가 필요합니다. 구형 검수표와 부분 교체 시험지는 question-db 없이 등록할 수 없습니다.");
  }
  const databaseQuestions = new Map((database && database.questions || []).map(question => [question.questionId, question]));
  const statuses = packet.questions.map(question => {
    if (clean(question.answerStatus)) return answerStatus(question);
    const existing = databaseQuestions.get(stableQuestionId(packet.sourceId, question.number));
    if (!existing) throw new Error(`문항 DB에서 기존 답 상태를 찾을 수 없습니다: ${packet.sourceId}/${question.number}`);
    return existing && existing.answerCheck && existing.answerCheck.status === "disputed" ? "disputed" : "verified";
  });
  if (packet.variant) {
    packet.variant.sharedQuestionLinks.forEach(link => {
      const canonical = databaseQuestions.get(clean(link.questionId));
      if (!canonical) throw new Error(`문항 DB에서 공유 문항 답 상태를 찾을 수 없습니다: ${clean(link.questionId)}`);
      const canonicalStatus = clean(canonical && canonical.answerCheck && canonical.answerCheck.status);
      if (!ANSWER_STATUSES.has(canonicalStatus)) {
        throw new Error(`공유 문항의 답 상태를 확인해 주세요: ${clean(link.questionId)}`);
      }
      statuses.push(canonicalStatus);
    });
  }
  const counts = { verified: 0, disputed: 0, pending: 0 };
  statuses.forEach(status => { counts[status] += 1; });
  const complete = statuses.length === 30 && counts.verified === 30;
  return {
    ...counts,
    total: statuses.length,
    complete,
    taskStatus: complete ? "verified" : (counts.verified > 0 ? "sampled" : "pending"),
    note: complete
      ? "답 확인 30문항을 모두 완료"
      : `답 확정 ${counts.verified}문항, 이견 ${counts.disputed}문항, 확인 대기 ${counts.pending}문항. 이견·대기 문항은 다시 검수 필요`
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function walk(value, pointer, issues) {
  if (typeof value === "string") {
    if (sensitivePathLeak(value)) issues.push(`sensitivePath:${pointer}`);
    return;
  }
  if (!value || typeof value !== "object") return;
  Object.entries(value).forEach(([key, child]) => {
    if (FORBIDDEN_KEYS.has(normalizedKey(key))) issues.push(`forbidden:${pointer}/${key}`);
    walk(child, `${pointer}/${key}`, issues);
  });
}

function linkIdentity(link) {
  return JSON.stringify({
    paperId: clean(link.paperId),
    sourceId: clean(link.sourceId),
    evidenceStatus: clean(link.evidenceStatus),
    evidenceRecordId: clean(link.evidenceRecordId),
    variant: link.variant || null
  });
}

function mergeVerifiedStages(...stageLists) {
  const values = new Set(stageLists.flat().map(clean).filter(Boolean));
  return VERIFIED_STAGES.filter(stage => values.has(stage));
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
    const hasAnswerStatus = question.answerStatus != null && clean(question.answerStatus) !== "";
    const status = answerStatus(question);
    const note = clean(question.answerNote);
    if (hasAnswerStatus && !ANSWER_STATUSES.has(status)) issues.push(`${prefix}.answerStatus`);
    if (question.answerNote != null && !hasAnswerStatus) issues.push(`${prefix}.answerNoteWithoutStatus`);
    if (status === "disputed" && !note) issues.push(`${prefix}.answerNoteRequired`);
    if (note && answerNoteLeaksValue(note)) issues.push(`${prefix}.answerNoteValue`);
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

function registerSources(typeIndex, paperLinks, reviewDecisions, packet, database = null) {
  validatePacket(packet);
  if (typeIndex.schemaVersion !== 1 || !Array.isArray(typeIndex.papers)) throw new Error("돌파 원본 유형표 버전을 확인해 주세요.");
  if (paperLinks.schemaVersion !== 1 || !Array.isArray(paperLinks.links)) throw new Error("돌파 시험지 연결표 버전을 확인해 주세요.");
  if (reviewDecisions.schemaVersion !== 1 || !Array.isArray(reviewDecisions.sourceReviews)) throw new Error("돌파 검수 결정표 버전을 확인해 주세요.");
  const nextIndex = JSON.parse(JSON.stringify(typeIndex));
  const nextLinks = JSON.parse(JSON.stringify(paperLinks));
  const nextDecisions = JSON.parse(JSON.stringify(reviewDecisions));
  const answerReview = summarizeAnswerReview(packet, database);
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
    verifiedStages: VERIFIED_STAGES.filter(stage => stage !== "answerReview" || answerReview.complete),
    ...(variant ? { variant } : {})
  };
  const sameSource = nextLinks.links.find(item => item.sourceId === link.sourceId);
  const samePaper = nextLinks.links.find(item => item.paperId === link.paperId);
  if (sameSource && samePaper && sameSource !== samePaper) throw new Error(`원본과 paperId가 서로 다른 연결을 가리킵니다: ${link.sourceId}/${link.paperId}`);
  const priorLink = sameSource || samePaper;
  if (priorLink && linkIdentity(priorLink) !== linkIdentity(link)) {
    throw new Error(`같은 원본의 시험지 연결 내용이 다릅니다: ${link.sourceId}`);
  }
  if (priorLink) priorLink.verifiedStages = mergeVerifiedStages(priorLink.verifiedStages || [], link.verifiedStages);
  if (!priorLink) nextLinks.links.push(link);
  nextLinks.links.sort((left, right) => left.paperId.localeCompare(right.paperId));
  const registeredLink = priorLink || link;
  const answerStageVerified = registeredLink.verifiedStages.includes("answerReview");

  const tasks = Object.fromEntries(VERIFIED_STAGES.map(stage => [stage, {
    status: stage === "answerReview" && !answerStageVerified ? answerReview.taskStatus : "verified",
    evidence: [clean(packet.registryEvidenceRecordId)],
    note: stage === "answerReview"
      ? (answerStageVerified && !answerReview.complete ? `기존 확정 단계 보존. ${answerReview.note}` : answerReview.note)
      : variant
        ? `대표 시험 공유 ${variant.sharedQuestionLinks.length}문항과 교체 ${packet.questions.length}문항을 원본 화면에서 직접 확인`
        : "문제 본문 30문항, 문항 위치와 교육과정 세부 유형을 원본 화면에서 직접 확인"
  }]));
  const decision = { sourceId: link.sourceId, tasks };
  const priorDecision = nextDecisions.sourceReviews.find(item => item.sourceId === decision.sourceId);
  if (priorDecision) {
    priorDecision.tasks = priorDecision.tasks || {};
    VERIFIED_STAGES.forEach(stage => {
      const priorTask = priorDecision.tasks[stage];
      if (stage === "answerReview" && tasks[stage].status !== "verified") {
        if (priorTask && priorTask.status === "verified") return;
        if (priorTask && priorTask.status === "sampled" && tasks[stage].status === "pending") return;
        if (priorTask && !["verified", "sampled", "pending", "not_started"].includes(priorTask.status)) {
          throw new Error(`기존 차단 사유를 확인해 주세요: ${decision.sourceId}/${stage}`);
        }
        priorDecision.tasks[stage] = {
          ...tasks[stage],
          evidence: Array.from(new Set([...(priorTask && priorTask.evidence || []), link.evidenceRecordId])).sort()
        };
        return;
      }
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
  const answerEvidenceId = clean(packet.answerEvidenceId);
  packet.questions.forEach(review => {
    const question = questions.get(review.number);
    if (!question || question.questionId !== stableQuestionId(packet.sourceId, review.number)) throw new Error(`문항 위치가 일치하지 않습니다: ${review.number}`);
    question.locator = { page: review.page, slot: review.slot, status: "verified", evidence: [locatorEvidenceId] };
    const responseKind = canonicalResponseKind(review.responseFormat);
    question.responseFormat = { kind: responseKind, slotCount: review.slotCount, status: "verified", evidence: [responseEvidenceId] };
    const explicitStatus = clean(review.answerStatus);
    const note = clean(review.answerNote);
    if (!explicitStatus) {
      if (question.answerCheck.status !== "disputed") {
        question.answerCheck = { status: "verified", evidence: [answerEvidenceId] };
      }
    } else {
      question.answerCheck = {
        status: explicitStatus,
        evidence: [answerEvidenceId],
        ...(note ? { note } : {})
      };
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
  paper.answerEvidenceId = answerEvidenceId;
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
  if (mode === "registry" && args.length === 8) {
    const result = registerSources(readJson(args[0]), readJson(args[1]), readJson(args[2]), readJson(args[3]), readJson(args[7]));
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
  throw new Error("사용법: register-dolpa-reviewed-paper.cjs registry <type-index> <links> <decisions> <packet> <out-index> <out-links> <out-decisions> <question-db> | database <db> <packet> <out-db>");
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({
  ANSWER_STATUSES,
  canonicalResponseKind,
  normalizedKey,
  sensitivePathLeak,
  answerNoteLeaksValue,
  answerReviewNeedsDatabase,
  summarizeAnswerReview,
  validatePacket,
  registerSources,
  applyToDatabase
});
