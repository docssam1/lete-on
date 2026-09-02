"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const dbCore = require("./build-dolpa-question-db.cjs");
const ledgerCore = require("./build-dolpa-work-ledger.cjs");
const dbAudit = require("./audit-dolpa-question-db.cjs");
const ledgerAudit = require("./audit-dolpa-work-ledger.cjs");
const equivalentCore = require("./record-dolpa-equivalent-source.cjs");
const reviewCore = require("./record-dolpa-review.cjs");

const AUDIT_SCHEMA = "dolpa-equivalent-source-visual-audit-v1";
const PAGE_SCHEMA = "source-page-manifest-v1";
const FORBIDDEN_CATALOG_KEYS = new Set([
  "content", "rawtext", "fulltext", "ocrtext", "excerpt", "pageimage", "base64", "blob", "binary",
  "answer", "answervalue", "officialanswer", "independentanswer", "correctanswer", "solution", "prompt", "stem"
]);

function clean(value) {
  return String(value == null ? "" : value).trim();
}

function normalizeKey(value) {
  return clean(value).normalize("NFKC").toLowerCase().replace(/[^a-z0-9가-힣]/g, "");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function jsonBytes(value) {
  return Buffer.from(`${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function sha256Bytes(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function objectHash(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function fingerprintFile(filePath) {
  const resolved = path.resolve(filePath);
  const bytes = fs.readFileSync(resolved);
  const stat = fs.statSync(resolved, { bigint: true });
  return { sha256: sha256Bytes(bytes), size: Number(stat.size), mtime_ns: Number(stat.mtimeNs) };
}

function writeJson(filePath, value) {
  const resolved = path.resolve(filePath);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  const temporary = `${resolved}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, jsonBytes(value));
  fs.renameSync(temporary, resolved);
  return resolved;
}

function upsert(list, id, value) {
  const index = list.findIndex(item => item.id === id);
  if (index >= 0) list[index] = value;
  else list.push(value);
}

function assertNoProtectedPayload(value, label) {
  const issues = [];
  function walk(node, pointer) {
    if (!node || typeof node !== "object") return;
    Object.entries(node).forEach(([key, child]) => {
      if (FORBIDDEN_CATALOG_KEYS.has(normalizeKey(key))) issues.push(`${pointer}/${key}`);
      if (typeof child === "string" && /^[A-Za-z]:[\\/]/.test(child)) issues.push(`${pointer}/${key}:absolute-path`);
      walk(child, `${pointer}/${key}`);
    });
  }
  walk(value, "");
  if (issues.length) throw new Error(`${label}에 원문·정답 값·절대경로 필드가 있습니다: ${issues.join(", ")}`);
}

function evidenceKey(audit) {
  const paper = clean(audit.equivalenceDecision.canonicalPaperId)
    .replace(/^DP-/, "").toLowerCase().replaceAll("-", ".");
  const source = clean(audit.sourceId).replace(/^DP-SRC-/, "").slice(0, 4).toLowerCase();
  return `dolpa.${paper}.alt-${source}.equivalent-render-audit-v1`;
}

function recordKey(audit) {
  const paper = clean(audit.equivalenceDecision.canonicalPaperId)
    .replace(/^DP-/, "").toLowerCase().replaceAll("-", ".");
  const source = clean(audit.sourceId).replace(/^DP-SRC-/, "").slice(0, 4).toLowerCase();
  return `dp.${paper}.equivalent-source.${source}.20260831`;
}

function ensureLocked(database, audit) {
  if (Number(database.summary && database.summary.usageApprovedCount) !== 0) {
    throw new Error("사용 승인 0건인 잠금 DB만 처리할 수 있습니다.");
  }
  const unsafe = (database.questions || []).filter(question => question.releaseStatus !== "locked"
    || (question.usageProfiles || []).some(profile => (profile.approvals || []).length || profile.status === "approved"));
  if (unsafe.length) throw new Error(`공개 잠금 또는 승인 상태를 확인해 주세요: ${unsafe[0].questionId}`);
  const policy = audit.releasePolicy || {};
  if (Number(policy.approvalCount) !== 0 || policy.publicationStatus !== "locked"
    || policy.learnerFitOverall !== "pending" || policy.responseKeyPayloadIncluded !== false
    || policy.privateAbsolutePathsIncluded !== false) {
    throw new Error("등가 감사의 공개 잠금·학습 적합성·승인 정책을 확인해 주세요.");
  }
  const unsafeAudit = (audit.questions || []).find(question => question.approvalStatus !== "unapproved"
    || question.publicationStatus !== "locked" || question.learnerFit && question.learnerFit.overall !== "pending");
  if (unsafeAudit) throw new Error(`등가 감사 문항의 잠금 상태를 확인해 주세요: ${unsafeAudit.number}`);
}

function validateAudit(database, ledger, audit, pageManifest) {
  assertNoProtectedPayload(audit, "등가 원본 감사");
  assertNoProtectedPayload(pageManifest, "원본 페이지 목록");
  if (audit.schemaVersion !== AUDIT_SCHEMA) throw new Error("등가 원본 감사 버전을 확인해 주세요.");
  if (audit.visibility !== "public-safe-metadata-only") throw new Error("등가 원본 감사의 공개 안전 표시를 확인해 주세요.");
  if (!/^DP-SRC-[0-9A-F]{12}$/.test(clean(audit.sourceId)) || !/^[0-9a-f]{64}$/.test(clean(audit.sourceFingerprint))) {
    throw new Error("등가 원본 ID 또는 지문을 확인해 주세요.");
  }
  const decision = audit.equivalenceDecision || {};
  if (decision.status !== "content_equivalent_existing_paper" || decision.newPaperRequired !== false
    || Number(decision.newQuestionRowsRequired) !== 0 || decision.equivalentSourceRegistrationRequired !== true) {
    throw new Error("새 시험지·문항을 만들지 않는 등가 결정만 처리할 수 있습니다.");
  }
  if (clean(audit.paperIdProposal) !== clean(decision.canonicalPaperId)) throw new Error("제안 시험지와 대표 시험지가 다릅니다.");
  const paper = (database.papers || []).find(item => item.paperId === decision.canonicalPaperId);
  if (!paper || paper.sourceId !== decision.canonicalSourceId) throw new Error("대표 시험지와 대표 원본 연결을 확인해 주세요.");
  const source = (ledger.sources || []).find(item => item.sourceId === audit.sourceId);
  if (!source || source.sourceFingerprint !== audit.sourceFingerprint) throw new Error("작업 장부와 등가 원본 지문이 다릅니다.");
  if ((database.papers || []).some(item => item.sourceId === audit.sourceId)) throw new Error("등가 원본이 이미 대표 시험지로 등록돼 있습니다.");

  const questionCount = Number(audit.sourceFacts && audit.sourceFacts.questionCount);
  if (questionCount !== 30 || paper.questionCount !== questionCount || paper.questionIds.length !== questionCount
    || (audit.questions || []).length !== questionCount) throw new Error("대표 시험지와 등가 감사의 30문항 구성을 확인해 주세요.");
  const comparison = decision.directVisualComparison || {};
  if (Number(comparison.sameQuestionCount) !== questionCount || Number(comparison.sameOfficialAnswerCount) !== questionCount) {
    throw new Error("30문항·공식 답안 직접 대조 결과가 필요합니다.");
  }
  const comparedPages = [...(comparison.pixelIdenticalRenderedPages || []),
    ...(comparison.contentIdenticalWithMinorRasterDifferencePages || [])].map(Number).sort((a, b) => a - b);
  const expectedPages = Array.from({ length: Number(audit.sourceFacts.pageCount) }, (_, index) => index + 1);
  if (JSON.stringify(comparedPages) !== JSON.stringify(expectedPages)) throw new Error("모든 원본 페이지의 직접 대조 결과가 필요합니다.");
  const answerTotal = Number(audit.summary && audit.summary.answerVerified || 0)
    + Number(audit.summary && audit.summary.answerDisputed || 0)
    + Number(audit.summary && audit.summary.answerNeedsReview || 0);
  if (Number(audit.summary && audit.summary.canonicalExactDuplicates) !== questionCount || answerTotal !== questionCount) {
    throw new Error("등가 감사의 문항·답 확인 집계가 30문항과 맞지 않습니다.");
  }
  const canonicalRows = new Map((database.questions || []).map(question => [question.questionId, question]));
  audit.questions.forEach((question, index) => {
    const expectedId = paper.questionIds[index];
    const canonical = canonicalRows.get(expectedId);
    if (Number(question.number) !== index + 1 || question.canonicalQuestionId !== expectedId
      || question.questionRelation !== "exact_content_duplicate" || !canonical
      || canonical.paperId !== paper.paperId || canonical.sourceId !== paper.sourceId
      || question.canonicalTypeId !== canonical.classification.typeId) {
      throw new Error(`대표 시험 문항 연결이 다릅니다: ${index + 1}`);
    }
  });

  if (pageManifest.schemaVersion !== PAGE_SCHEMA || pageManifest.sourceId !== audit.sourceId
    || Number(pageManifest.pageCount) !== Number(audit.sourceFacts.pageCount)
    || (pageManifest.pages || []).length !== Number(pageManifest.pageCount)) {
    throw new Error("원본 페이지 목록과 감사의 페이지 수가 다릅니다.");
  }
  if (!pageManifest.pdf || pageManifest.pdf.file !== `${audit.sourceId}.pdf`
    || !/^[0-9a-f]{64}$/.test(clean(pageManifest.pdf.sha256))
    || !Number.isSafeInteger(Number(pageManifest.pdf.bytes)) || Number(pageManifest.pdf.bytes) < 1) {
    throw new Error("원본 PDF 지문과 파일 정보를 확인해 주세요.");
  }
  (pageManifest.pages || []).forEach((page, index) => {
    if (Number(page.page) !== index + 1 || !/^[0-9a-f]{64}$/.test(clean(page.sha256))
      || !Number.isSafeInteger(Number(page.bytes)) || Number(page.bytes) < 1) {
      throw new Error(`원본 페이지 목록을 확인해 주세요: ${index + 1}`);
    }
  });
  ensureLocked(database, audit);
  return { paper, source, evidenceId: evidenceKey(audit) };
}

function equivalentNote() {
  return "직접 시각 대조에서 30문항과 공식 답안 순서가 대표 시험과 같음을 확인했다. 새 시험지·문항·유형을 만들지 않고 대표 시험의 보조 원본으로만 연결하며 기존 답 이견·학습 적합성 대기·공개 잠금을 그대로 따른다.";
}

function decisionManifest(audit, evidenceId) {
  const note = equivalentNote();
  return {
    sourceId: audit.sourceId,
    evidenceId,
    note,
    tasks: {
      bodyReview: "verified",
      answerReview: "not_applicable",
      questionSegmentation: "not_applicable",
      typeClassification: "not_applicable",
      difficultyReview: "not_applicable",
      learnerFitReview: "not_applicable",
      analysisReport: "not_applicable"
    }
  };
}

function copyQuestionReviews(nextLedger, priorLedger) {
  const prior = new Map((priorLedger.questions || []).map(question => [question.questionId, question]));
  (nextLedger.questions || []).forEach(question => {
    const old = prior.get(question.questionId);
    if (!old) throw new Error(`기존 작업 장부 문항을 찾을 수 없습니다: ${question.questionId}`);
    question.type.methodTags = structuredClone(old.type.methodTags || []);
    question.type.methodReviewStatus = old.type.methodReviewStatus || "pending";
    question.difficulty = structuredClone(old.difficulty);
  });
  nextLedger.summary.difficultyVerifiedQuestionCount = nextLedger.questions
    .filter(question => question.difficulty.status === "verified").length;
}

function sameIdentities(before, after, key) {
  return JSON.stringify((before || []).map(item => item[key]).sort()) === JSON.stringify((after || []).map(item => item[key]).sort());
}

function integrate(input) {
  const { database, ledger, typeIndex, paperLinks, reviewDecisions, inventory, queue, audit, pageManifest } = input;
  const checked = validateAudit(database, ledger, audit, pageManifest);
  const counts = { papers: database.papers.length, questions: database.questions.length, types: database.typeCatalog.length };
  const manifest = {
    paperId: checked.paper.paperId,
    sourceId: audit.sourceId,
    evidenceId: checked.evidenceId,
    pageCount: Number(pageManifest.pageCount),
    note: equivalentNote()
  };
  const nextDatabase = equivalentCore.record(database, ledger, manifest).database;
  const nextDecisions = reviewCore.merge(structuredClone(reviewDecisions), decisionManifest(audit, checked.evidenceId));
  const nextLedger = ledgerCore.buildLedger(inventory, queue, typeIndex, paperLinks, nextDecisions, {
    inventorySha256: objectHash(inventory),
    queueSha256: objectHash(queue),
    typeIndexSha256: objectHash(typeIndex),
    paperLinksSha256: objectHash(paperLinks),
    reviewDecisionsSha256: objectHash(nextDecisions)
  });
  copyQuestionReviews(nextLedger, ledger);
  const dbResult = dbAudit.audit(nextDatabase);
  if (!dbResult.ok) throw new Error(`문항 DB 검사가 실패했습니다: ${dbResult.issues.join(", ")}`);
  const ledgerResult = ledgerAudit.audit(nextLedger);
  if (!ledgerResult.ok) throw new Error(`작업 장부 검사가 실패했습니다: ${ledgerResult.issues.join(", ")}`);
  if (nextDatabase.papers.length !== counts.papers || nextDatabase.questions.length !== counts.questions
    || nextDatabase.typeCatalog.length !== counts.types
    || !sameIdentities(database.papers, nextDatabase.papers, "paperId")
    || !sameIdentities(database.questions, nextDatabase.questions, "questionId")) {
    throw new Error("등가 원본 연결 중 시험지·문항·유형 수가 바뀌었습니다.");
  }
  if (nextLedger.questions.length !== ledger.questions.length
    || !sameIdentities(ledger.questions, nextLedger.questions, "questionId")) {
    throw new Error("등가 원본 연결 중 작업 장부 문항 수가 바뀌었습니다.");
  }
  ensureLocked(nextDatabase, audit);
  return { database: nextDatabase, ledger: nextLedger, reviewDecisions: nextDecisions, evidenceId: checked.evidenceId };
}

function sourceEntry(id, title, relativePath, filePath) {
  return { id, title, path: relativePath, kind: "json", sensitivity: "private", ...fingerprintFile(filePath) };
}

function existingAbsoluteValues(catalog) {
  const values = new Set();
  function walk(value) {
    if (!value || typeof value !== "object") return;
    Object.values(value).forEach(child => {
      if (typeof child === "string" && /^[A-Za-z]:[\\/]/.test(child)) values.add(child);
      walk(child);
    });
  }
  walk(catalog);
  return values;
}

function assertCatalogSafe(catalog, allowedExistingAbsoluteValues = new Set()) {
  const issues = [];
  function walk(value, pointer) {
    if (!value || typeof value !== "object") return;
    Object.entries(value).forEach(([key, child]) => {
      if (FORBIDDEN_CATALOG_KEYS.has(normalizeKey(key))) issues.push(`${pointer}/${key}`);
      // A private source-memory catalog may already have one authorized absolute root.
      // New source paths, records, notes, and locators must remain relative.
      if (typeof child === "string" && /^[A-Za-z]:[\\/]/.test(child) && `${pointer}/${key}` !== "/root"
        && !allowedExistingAbsoluteValues.has(child)) {
        issues.push(`${pointer}/${key}:absolute-path`);
      }
      walk(child, `${pointer}/${key}`);
    });
  }
  walk(catalog, "");
  if (issues.length) throw new Error(`출처 메모리에 저장할 수 없는 필드가 있습니다: ${issues.join(", ")}`);
}

function updateCatalog(catalog, database, ledger, reviewDecisions, audit, pageManifest, label, paths) {
  const allowedExistingAbsoluteValues = existingAbsoluteValues(catalog);
  const next = structuredClone(catalog);
  if (next.version !== 1 || !Array.isArray(next.sources) || !Array.isArray(next.records)) {
    throw new Error("출처 메모리 버전을 확인해 주세요.");
  }
  const suffix = audit.sourceId.replace(/^DP-SRC-/, "").slice(0, 4).toLowerCase();
  const paperKey = audit.equivalenceDecision.canonicalPaperId.replace(/^DP-/, "").toLowerCase();
  const auditSourceId = `dp-${paperKey}-alt-${suffix}-equivalent-v1`;
  const pageSourceId = `dp-${paperKey}-alt-${suffix}-page-assets-v1`;
  upsert(next.sources, "dp-question-db-v1", sourceEntry("dp-question-db-v1", "돌파 문항 DB", "지필드메모리/highschool-selection/question-bank/dolpa-question-db-v1.json", paths.database));
  upsert(next.sources, "dp-work-ledger-v1", sourceEntry("dp-work-ledger-v1", "돌파 원본 작업 장부", "지필드메모리/highschool-selection/question-bank/dolpa-work-ledger-v1.json", paths.ledger));
  upsert(next.sources, "dp-review-decisions-v1", sourceEntry("dp-review-decisions-v1", "돌파 검수 결정 기록", "지필드메모리/highschool-selection/question-bank/dolpa-review-decisions-v1.json", paths.reviewDecisions));
  upsert(next.sources, auditSourceId, sourceEntry(auditSourceId, "돌파 동일 원본 직접 대조 감사", `지필드메모리/highschool-selection/question-bank/${label}.json`, paths.audit));
  upsert(next.sources, pageSourceId, sourceEntry(pageSourceId, "돌파 동일 원본 페이지 목록", `지필드메모리/highschool-selection/artifacts/question-pages/dolpa/${audit.sourceId}/manifest.json`, paths.pageManifest));

  const equivalentCount = (database.papers || []).reduce((sum, paper) => sum + (paper.equivalentSources || []).length, 0);
  const project = next.records.find(record => record.id === "dp.question-db.20260827");
  if (project) {
    project.summary = `돌파 고유 원본 ${ledger.summary.sourceCount}개와 시험지 ${database.summary.paperCount}회, 직접 소유 ${database.summary.questionCount}문항, 세부 유형 ${database.summary.typeCount}개를 관리한다. 같은 시험의 완전 동일 원본 ${equivalentCount}개는 새 시험지·문항·유형을 만들지 않고 대표 시험에 연결한다. 학생 선택은 학습 적합성 검수와 별도 승인 전까지 잠근다.`;
    if (!(project.pointers || []).some(pointer => pointer.source_id === auditSourceId)) {
      project.pointers = (project.pointers || []).concat({
        source_id: auditSourceId,
        role: "audit",
        locator: "equivalenceDecision, summary, questions[1:30]",
        note: "30문항과 공식 답안 순서의 직접 대조 및 중복 생성 금지 결정"
      });
    }
  }
  upsert(next.records, recordKey(audit), {
    id: recordKey(audit),
    title: "돌파 2-1 입반테스트 3 이전 운영본 중복 방지 연결",
    aliases: [`돌파 ${audit.sourceId.replace(/^DP-SRC-/, "").slice(0, 4)} 동일 시험 연결`],
    tags: ["dp", "middle2-1", "equivalent-source", "duplicate-source", "release-locked"],
    summary: "직접 시각 대조에서 30문항과 공식 답안 순서가 대표 시험과 같아 새 시험지·문항·유형을 만들지 않고 보조 원본으로 연결했다. 기존 문항의 답 이견, 학습 적합성 대기, 공개 잠금, 승인 0건을 그대로 유지한다.",
    status: "verified",
    sensitivity: "private",
    updated: "2026-08-31",
    pointers: [
      { source_id: auditSourceId, role: "audit", locator: "equivalenceDecision, summary, questions[1:30]", note: "30문항과 공식 답안 순서 직접 대조" },
      { source_id: pageSourceId, role: "render", locator: `pages[1:${pageManifest.pageCount}]`, note: "페이지별 파일 지문과 쪽수 확인" },
      { source_id: "dp-question-db-v1", role: "decision", locator: `papers[paperId=${audit.equivalenceDecision.canonicalPaperId}].equivalentSources[sourceId=${audit.sourceId}]`, note: "대표 시험의 보조 원본 연결" },
      { source_id: "dp-work-ledger-v1", role: "decision", locator: `sources[sourceId=${audit.sourceId}].tasks`, note: "본문 대조 완료 및 중복 검수 작업 제외" },
      { source_id: "dp-review-decisions-v1", role: "decision", locator: `sourceReviews[sourceId=${audit.sourceId}]`, note: "장부 재생성 시에도 같은 결정 유지" }
    ]
  });
  next.updated = [clean(next.updated), "2026-08-31"].sort().at(-1);
  assertCatalogSafe(next, allowedExistingAbsoluteValues);
  return next;
}

function stage(input, outputDir, label, filePaths) {
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(label)) throw new Error("출력 이름은 영문·숫자·하이픈만 사용할 수 있습니다.");
  const result = integrate(input);
  const root = path.resolve(outputDir);
  const outputs = {
    database: writeJson(path.join(root, "dolpa-question-db-v1.json"), result.database),
    ledger: writeJson(path.join(root, "dolpa-work-ledger-v1.json"), result.ledger),
    reviewDecisions: writeJson(path.join(root, "dolpa-review-decisions-v1.json"), result.reviewDecisions)
  };
  const nextCatalog = updateCatalog(input.sourceMemory, result.database, result.ledger, result.reviewDecisions,
    input.audit, input.pageManifest, label, {
      database: outputs.database,
      ledger: outputs.ledger,
      reviewDecisions: outputs.reviewDecisions,
      audit: filePaths.audit,
      pageManifest: filePaths.pageManifest
    });
  outputs.sourceMemory = writeJson(path.join(root, "source-memory.json"), nextCatalog);
  const manifest = {
    schemaVersion: "highselect-dolpa-equivalent-source-staged-import/v1",
    sourceId: input.audit.sourceId,
    canonicalSourceId: input.audit.equivalenceDecision.canonicalSourceId,
    canonicalPaperId: input.audit.equivalenceDecision.canonicalPaperId,
    evidenceId: result.evidenceId,
    createdPaperRows: 0,
    createdQuestionRows: 0,
    createdTypeRows: 0,
    releaseStatus: "locked",
    usageApprovalCount: 0,
    outputs: Object.fromEntries(Object.entries(outputs).map(([key, file]) => [key, { file: path.basename(file), sha256: fingerprintFile(file).sha256 }])),
    requiredPrivateCopies: [
      { file: `${label}.json`, sha256: fingerprintFile(filePaths.audit).sha256, target: `question-bank/${label}.json` },
      { file: "manifest.json", sha256: fingerprintFile(filePaths.pageManifest).sha256, target: `artifacts/question-pages/dolpa/${input.audit.sourceId}/manifest.json` }
    ]
  };
  outputs.manifest = writeJson(path.join(root, `${label}-staged-import-manifest-v1.json`), manifest);
  return { ...result, sourceMemory: nextCatalog, manifest, outputs };
}

function main(args) {
  if (args.length !== 12) {
    throw new Error("사용법: node import-dolpa-equivalent-source-audit.cjs <db> <ledger> <type-index> <paper-links> <review-decisions> <inventory> <queue> <source-memory> <audit> <page-manifest> <output-dir> <label>");
  }
  const [dbPath, ledgerPath, typeIndexPath, paperLinksPath, decisionsPath, inventoryPath, queuePath,
    memoryPath, auditPath, pageManifestPath, outputDir, label] = args;
  const result = stage({
    database: readJson(dbPath),
    ledger: readJson(ledgerPath),
    typeIndex: readJson(typeIndexPath),
    paperLinks: readJson(paperLinksPath),
    reviewDecisions: readJson(decisionsPath),
    inventory: readJson(inventoryPath),
    queue: readJson(queuePath),
    sourceMemory: readJson(memoryPath),
    audit: readJson(auditPath),
    pageManifest: readJson(pageManifestPath)
  }, outputDir, label, { audit: auditPath, pageManifest: pageManifestPath });
  process.stdout.write(`${JSON.stringify({
    sourceId: result.manifest.sourceId,
    paperId: result.manifest.canonicalPaperId,
    createdPaperRows: 0,
    createdQuestionRows: 0,
    createdTypeRows: 0,
    equivalentSourceCount: result.database.papers.find(paper => paper.paperId === result.manifest.canonicalPaperId).equivalentSources.length,
    releaseStatus: "locked",
    usageApprovalCount: 0
  }, null, 2)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({
  AUDIT_SCHEMA, PAGE_SCHEMA, evidenceKey, recordKey, assertNoProtectedPayload, validateAudit, decisionManifest,
  integrate, existingAbsoluteValues, assertCatalogSafe, updateCatalog, stage
});
