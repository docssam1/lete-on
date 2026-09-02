"use strict";

const fs = require("node:fs");
const path = require("node:path");
const ledgerCore = require("./build-dolpa-work-ledger.cjs");
const dbCore = require("./build-dolpa-question-db.cjs");
const placementCore = require("./dolpa-paper-placement-core.cjs");

const FORBIDDEN_KEYS = new Set(["prompt", "stem", "answer", "answervalue", "officialanswer", "independentanswer", "derivedanswer", "correctanswer", "solution", "content", "rawtext", "pageimage"]);

function normalizedKey(value) {
  return String(value || "").normalize("NFKC").toLowerCase().replace(/[^a-z0-9가-힣]/g, "");
}

function walk(value, pointer, issues) {
  if (!value || typeof value !== "object") return;
  Object.entries(value).forEach(([key, child]) => {
    if (FORBIDDEN_KEYS.has(normalizedKey(key))) issues.push(`forbidden:${pointer}/${key}`);
    walk(child, `${pointer}/${key}`, issues);
  });
}

function findAnswerLeakIssues(value) {
  const issues = [];
  walk(value, "", issues);
  return issues;
}

function audit(database) {
  const issues = [];
  if (database.schemaVersion !== 1) issues.push("schemaVersion");
  issues.push(...findAnswerLeakIssues(database));
  const questionIds = new Set();
  const questionsById = new Map();
  database.questions.forEach(question => {
    if (questionIds.has(question.questionId)) issues.push(`duplicate_question:${question.questionId}`);
    questionIds.add(question.questionId);
    questionsById.set(question.questionId, question);
    if (question.questionId !== ledgerCore.stableQuestionId(question.sourceId, question.number)) issues.push(`question_id:${question.questionId}`);
    const typeId = ledgerCore.stableTypeId(question.classification.semester, question.classification.unit, question.classification.typeLabel);
    if (question.classification.typeId !== typeId) issues.push(`type_id:${question.questionId}`);
    if (question.classification.majorUnit !== question.classification.domain) issues.push(`major_unit:${question.questionId}`);
    if (question.classification.minorUnit !== question.classification.unit) issues.push(`minor_unit:${question.questionId}`);
    if (question.classification.status === "verified" && !question.classification.evidence.length) issues.push(`classification_evidence:${question.questionId}`);
    if (question.method.status === "verified" && (!question.method.solutionArchetype || !question.method.tags.length || !question.method.evidence.length)) issues.push(`method_evidence:${question.questionId}`);
    if (question.difficulty.status === "verified" && (!question.difficulty.band || !question.difficulty.evidence.length)) issues.push(`difficulty_evidence:${question.questionId}`);
    if (question.responseFormat.status === "verified" && (!question.responseFormat.kind
      || !Number.isSafeInteger(question.responseFormat.slotCount) || question.responseFormat.slotCount < 1
      || !question.responseFormat.evidence.length)) issues.push(`response_evidence:${question.questionId}`);
    if (question.answerCheck.status === "verified" && !question.answerCheck.evidence.length) issues.push(`answer_evidence:${question.questionId}`);
    if (question.answerCheck.status === "disputed") {
      if (!(question.answerCheck.evidence || []).length || !String(question.answerCheck.note || "").trim()) {
        issues.push(`answer_dispute_evidence:${question.questionId}`);
      }
      if (question.releaseStatus !== "locked") issues.push(`answer_dispute_release:${question.questionId}`);
      const unsafeUsage = (question.usageProfiles || []).filter(profile => !["candidate", "excluded"].includes(profile.status));
      if (unsafeUsage.length) issues.push(`answer_dispute_usage:${question.questionId}:${unsafeUsage.map(profile => profile.profileId).join("|")}`);
    }
    const expectedProfileIds = dbCore.PROFILE_CATALOG.map(profile => profile.profileId).sort();
    const actualProfileIds = (question.usageProfiles || []).map(profile => profile.profileId).sort();
    if (new Set(actualProfileIds).size !== actualProfileIds.length) issues.push(`duplicate_usage_profile:${question.questionId}`);
    if (JSON.stringify(actualProfileIds) !== JSON.stringify(expectedProfileIds)) issues.push(`usage_profiles:${question.questionId}`);
    (question.usageProfiles || []).forEach(profile => {
      if (!dbCore.PROFILE_STATUSES.includes(profile.status)) issues.push(`usage_status:${question.questionId}:${profile.profileId}`);
      if (["source_verified", "approved"].includes(profile.status) && !(profile.evidence || []).length) {
        issues.push(`usage_evidence:${question.questionId}:${profile.profileId}`);
      }
    });
    if (question.releaseStatus !== "locked") issues.push(`release:${question.questionId}`);
  });
  const primarySourceIds = new Set(database.papers.map(paper => paper.sourceId));
  const papersById = new Map(database.papers.map(paper => [paper.paperId, paper]));
  const equivalentSourceIds = new Set();
  database.papers.forEach(paper => {
    const paperQuestionIds = Array.isArray(paper.questionIds) ? paper.questionIds : [];
    if (paper.questionCount !== paperQuestionIds.length) issues.push(`paper_count:${paper.paperId}`);
    const rows = paperQuestionIds.map(id => questionsById.get(id));
    if (paper.variant) {
      const variant = paper.variant;
      if (variant.kind !== "partial_question_variant") issues.push(`paper_variant_kind:${paper.paperId}`);
      const primary = papersById.get(variant.primaryPaperId);
      if (!primary || primary.paperId === paper.paperId || primary.variant) issues.push(`paper_variant_primary:${paper.paperId}`);
      const shared = Array.isArray(variant.sharedQuestionLinks) ? variant.sharedQuestionLinks : [];
      const overrideIds = Array.isArray(variant.overrideQuestionIds) ? variant.overrideQuestionIds : [];
      const occupiedNumbers = new Set();
      shared.forEach(link => {
        const number = link && link.number;
        const questionId = link && link.questionId;
        if (!Number.isSafeInteger(number) || number < 1 || number > paper.questionCount || occupiedNumbers.has(number)) {
          issues.push(`paper_variant_shared_number:${paper.paperId}:${number}`);
          return;
        }
        occupiedNumbers.add(number);
        if (!questionId) issues.push(`paper_variant_shared_link:${paper.paperId}:${number}`);
        if (!Number.isSafeInteger(link && link.page) || link.page < 1
          || !Number.isSafeInteger(link && link.slot) || link.slot < 1 || !(link.evidence || []).length) {
          issues.push(`paper_variant_shared_locator:${paper.paperId}:${number}`);
        }
        const row = questionsById.get(questionId);
        if (!primary || !row || row.paperId !== primary.paperId || row.sourceId !== primary.sourceId
          || !(primary.questionIds || []).includes(questionId) || paperQuestionIds[number - 1] !== questionId) {
          issues.push(`paper_variant_shared_link:${paper.paperId}:${number}`);
        }
      });
      const overrideIdSet = new Set();
      overrideIds.forEach(questionId => {
        if (!questionId || overrideIdSet.has(questionId) || shared.some(link => link.questionId === questionId)) {
          issues.push(`paper_variant_override_duplicate:${paper.paperId}:${questionId}`);
          return;
        }
        overrideIdSet.add(questionId);
        const row = questionsById.get(questionId);
        if (!row || row.paperId !== paper.paperId || row.sourceId !== paper.sourceId
          || !Number.isSafeInteger(row.number) || row.number < 1 || row.number > paper.questionCount
          || occupiedNumbers.has(row.number) || paperQuestionIds[row.number - 1] !== questionId) {
          issues.push(`paper_variant_override_link:${paper.paperId}:${questionId}`);
          return;
        }
        occupiedNumbers.add(row.number);
      });
      if (!shared.length || !overrideIds.length || occupiedNumbers.size !== paper.questionCount
        || shared.length + overrideIds.length !== paper.questionCount) {
        issues.push(`paper_variant_coverage:${paper.paperId}`);
      }
      const ownedRows = database.questions.filter(row => row.paperId === paper.paperId);
      if (ownedRows.some(row => !overrideIdSet.has(row.questionId)) || ownedRows.length !== overrideIdSet.size) {
        issues.push(`paper_variant_ownership:${paper.paperId}`);
      }
    } else {
      if (rows.some(row => !row || row.paperId !== paper.paperId || row.sourceId !== paper.sourceId)) issues.push(`paper_link:${paper.paperId}`);
      const numbers = rows.filter(Boolean).map(row => row.number).sort((a, b) => a - b);
      if (numbers.some((number, index) => number !== index + 1)) issues.push(`paper_numbers:${paper.paperId}`);
    }
    if (paper.coverage) {
      if (!["full_range", "mid_unit_cutoff", "mixed_range"].includes(paper.coverage.coverageKind)) issues.push(`paper_coverage_kind:${paper.paperId}`);
      if (!paper.coverage.declaredScopeLabel || !paper.coverage.observedTerminal
        || !paper.coverage.observedTerminal.semester || !paper.coverage.observedTerminal.unit) issues.push(`paper_coverage_terminal:${paper.paperId}`);
      if (paper.coverage.status !== "verified" || !(paper.coverage.evidence || []).length) issues.push(`paper_coverage_evidence:${paper.paperId}`);
    }
    if (paper.placementContext) {
      let normalizedPlacement = null;
      try {
        normalizedPlacement = placementCore.normalize({
          paperId: paper.paperId,
          evidenceId: (paper.placementContext.evidence || [])[0],
          examLabelKind: paper.placementContext.examLabelKind,
          operationalAdmissionMode: paper.placementContext.operationalAdmissionMode,
          sequenceIndex: paper.placementContext.courseEntryPhase && paper.placementContext.courseEntryPhase.sequenceIndex,
          courseEntryPhaseLabel: paper.placementContext.courseEntryPhase && paper.placementContext.courseEntryPhase.label,
          targetCourseLabel: paper.placementContext.targetCourse && paper.placementContext.targetCourse.label,
          testedPrerequisiteEndpoint: paper.placementContext.testedPrerequisiteEndpoint,
          testedCoreEndpoint: paper.placementContext.testedCoreEndpoint,
          maximumObservedContent: paper.placementContext.maximumObservedContent,
          extensionProbeQuestionNumbers: paper.placementContext.extensionProbeQuestionNumbers,
          rangeAlignment: paper.placementContext.rangeAlignment,
          representativeMode: paper.placementContext.representativePolicy && paper.placementContext.representativePolicy.mode,
          evidenceStatus: paper.placementContext.status,
          note: paper.placementContext.note
        }, paper.questionCount);
      } catch (error) {
        issues.push(`paper_placement:${paper.paperId}:${error.message}`);
      }
      if (normalizedPlacement && JSON.stringify(normalizedPlacement) !== JSON.stringify(paper.placementContext)) {
        issues.push(`paper_placement_normalization:${paper.paperId}`);
      }
      (paper.placementContext.extensionProbeQuestionNumbers || []).forEach(number => {
        if (!paperQuestionIds[number - 1]) issues.push(`paper_placement_question:${paper.paperId}:${number}`);
      });
    }
    (paper.equivalentSources || []).forEach(source => {
      if (!/^DP-SRC-[0-9A-F]{12}$/.test(source.sourceId || "")) issues.push(`paper_equivalent_source_id:${paper.paperId}`);
      if (!/^[0-9a-f]{64}$/.test(source.sourceFingerprint || "")) issues.push(`paper_equivalent_fingerprint:${paper.paperId}:${source.sourceId}`);
      if (source.relation !== "same_question_content_revision") issues.push(`paper_equivalent_relation:${paper.paperId}:${source.sourceId}`);
      if (!Number.isSafeInteger(source.pageCount) || source.pageCount < 1) issues.push(`paper_equivalent_pages:${paper.paperId}:${source.sourceId}`);
      if (source.status !== "verified" || !(source.evidence || []).length) issues.push(`paper_equivalent_evidence:${paper.paperId}:${source.sourceId}`);
      if (primarySourceIds.has(source.sourceId)) issues.push(`paper_equivalent_primary_collision:${paper.paperId}:${source.sourceId}`);
      if (equivalentSourceIds.has(source.sourceId)) issues.push(`paper_equivalent_duplicate:${source.sourceId}`);
      equivalentSourceIds.add(source.sourceId);
    });
  });
  const rebuiltTypes = dbCore.rebuildTypeCatalog(database.questions);
  if (JSON.stringify(rebuiltTypes) !== JSON.stringify(database.typeCatalog)) issues.push("type_catalog");
  if (JSON.stringify(database.profileCatalog) !== JSON.stringify(dbCore.PROFILE_CATALOG)) issues.push("profile_catalog");
  const actual = dbCore.summarize(database);
  Object.entries(actual).forEach(([key, value]) => {
    if (Number(database.summary[key]) !== value) issues.push(`summary:${key}:${database.summary[key]}/${value}`);
  });
  return { ok: issues.length === 0, issues, actual };
}

function main(args) {
  if (args.length !== 1) throw new Error("사용법: node audit-dolpa-question-db.cjs <question-db>");
  const database = JSON.parse(fs.readFileSync(path.resolve(args[0]), "utf8"));
  const result = audit(database);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.ok) process.exitCode = 1;
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ normalizedKey, findAnswerLeakIssues, audit });
