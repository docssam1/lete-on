"use strict";

const fs = require("node:fs");
const path = require("node:path");
const core = require("./project-question-bank-core.cjs");

function audit(index) {
  const issues = [];
  if (!index || index.schemaVersion !== 1) issues.push("schema_version");
  core.walkForbidden(index, "", issues);
  const bankIds = new Set((index.sourceBanks || []).map(bank => bank.sourceBankId));
  if (bankIds.size !== (index.sourceBanks || []).length) issues.push("duplicate_source_bank");
  const familyIds = new Set((index.conceptFamilies || []).map(family => family.conceptFamilyId));
  const declaredSourceTypeKeys = new Set((index.sourceTypes || []).map(type => `${type.sourceBankId}:${type.sourceTypeId}`));
  const seenFamilyIds = new Set();
  const sourceTypeKeys = new Set();
  (index.conceptFamilies || []).forEach(family => {
    if (seenFamilyIds.has(family.conceptFamilyId)) issues.push(`duplicate_family:${family.conceptFamilyId}`);
    seenFamilyIds.add(family.conceptFamilyId);
    if (!family.canonicalLabel || !family.sourceTypes.length) issues.push(`family_shape:${family.conceptFamilyId}`);
    family.sourceTypes.forEach(type => {
      const key = `${type.sourceBankId}:${type.sourceTypeId}`;
      if (sourceTypeKeys.has(key)) issues.push(`duplicate_source_type_mapping:${key}`);
      sourceTypeKeys.add(key);
      if (!bankIds.has(type.sourceBankId)) issues.push(`unknown_family_bank:${key}`);
    });
    if (Object.prototype.hasOwnProperty.call(family, "canonicalConceptFamilyId") && !familyIds.has(family.canonicalConceptFamilyId)) {
      issues.push(`unknown_canonical_family:${family.conceptFamilyId}`);
    }
  });
  const itemIds = new Set();
  (index.items || []).forEach(item => {
    if (itemIds.has(item.itemId)) issues.push(`duplicate_item:${item.itemId}`);
    itemIds.add(item.itemId);
    if (!bankIds.has(item.sourceBankId)) issues.push(`unknown_item_bank:${item.itemId}`);
    if (item.sourceTypeId !== null && item.sourceTypeId !== undefined && !declaredSourceTypeKeys.has(`${item.sourceBankId}:${item.sourceTypeId}`)) {
      issues.push(`unknown_item_source_type:${item.itemId}`);
    }
    if (item.conceptStatus === "mapped" && !familyIds.has(item.conceptFamilyId)) issues.push(`unknown_item_family:${item.itemId}`);
    if (item.conceptStatus !== "mapped" && item.conceptFamilyId !== null) issues.push(`unexpected_item_family:${item.itemId}`);
    if (Object.prototype.hasOwnProperty.call(item, "canonicalConceptFamilyId") && item.canonicalConceptFamilyId !== null && !familyIds.has(item.canonicalConceptFamilyId)) {
      issues.push(`unknown_item_canonical_family:${item.itemId}`);
    }
  });
  const candidateIds = new Set();
  const candidatesById = new Map();
  (index.overlapCandidates || []).forEach(candidate => {
    if (candidateIds.has(candidate.candidateId)) issues.push(`duplicate_candidate:${candidate.candidateId}`);
    candidateIds.add(candidate.candidateId);
    candidatesById.set(candidate.candidateId, candidate);
    if (!familyIds.has(candidate.leftConceptFamilyId) || !familyIds.has(candidate.rightConceptFamilyId)) issues.push(`candidate_family:${candidate.candidateId}`);
    if (!["review_required", "resolved", "evidence_required"].includes(candidate.status)) issues.push(`candidate_status:${candidate.candidateId}`);
    if (candidate.status === "review_required" && candidate.decision !== null) issues.push(`candidate_pending_decision:${candidate.candidateId}`);
    if (candidate.status !== "review_required" && !candidate.decision) issues.push(`candidate_resolved_decision:${candidate.candidateId}`);
  });
  const validRelations = new Set(["merge_detail", "same_concept_family", "related_method", "prerequisite", "keep_separate"]);
  const relationIds = new Set();
  (index.typeRelations || []).forEach(relation => {
    if (relationIds.has(relation.relationId)) issues.push(`duplicate_relation:${relation.relationId}`);
    relationIds.add(relation.relationId);
    if (!candidateIds.has(relation.relationId)) issues.push(`relation_candidate:${relation.relationId}`);
    if (!familyIds.has(relation.leftConceptFamilyId) || !familyIds.has(relation.rightConceptFamilyId)) issues.push(`relation_family:${relation.relationId}`);
    if (!validRelations.has(relation.relation)) issues.push(`relation_kind:${relation.relationId}`);
    const candidate = candidatesById.get(relation.relationId);
    if (candidate && (candidate.leftConceptFamilyId !== relation.leftConceptFamilyId || candidate.rightConceptFamilyId !== relation.rightConceptFamilyId || candidate.decision !== relation.relation)) {
      issues.push(`relation_mismatch:${relation.relationId}`);
    }
    if (relation.relation === "merge_detail" && (!Array.isArray(relation.evidence) || !relation.evidence.length)) issues.push(`relation_merge_evidence:${relation.relationId}`);
  });
  const expected = {
    sourceBankCount: (index.sourceBanks || []).length,
    itemCount: (index.items || []).length,
    mappedItemCount: (index.items || []).filter(item => item.conceptStatus === "mapped").length,
    unitOnlyItemCount: (index.items || []).filter(item => item.conceptStatus === "unit_only").length,
    pendingItemCount: (index.items || []).filter(item => item.conceptStatus === "pending").length,
    sourceTypeCount: (index.sourceTypes || []).length,
    conceptFamilyCount: (index.conceptFamilies || []).length,
    exactMergedFamilyCount: (index.conceptFamilies || []).filter(family => family.mergeStatus === "exact_verified").length,
    overlapCandidateCount: (index.overlapCandidates || []).length
  };
  Object.entries(expected).forEach(([key, value]) => {
    if (!index.summary || index.summary[key] !== value) issues.push(`summary:${key}`);
  });
  const reviewedCount = (index.overlapCandidates || []).filter(candidate => candidate.status !== "review_required").length;
  if (reviewedCount) {
    const reviewedExpected = {
      resolvedOverlapCount: (index.overlapCandidates || []).filter(candidate => candidate.status === "resolved").length,
      evidenceRequiredCount: (index.overlapCandidates || []).filter(candidate => candidate.status === "evidence_required").length,
      pendingOverlapCount: (index.overlapCandidates || []).filter(candidate => candidate.status === "review_required").length,
      mergedAliasCount: (index.conceptFamilies || []).filter(family => family.canonicalStatus === "alias").length,
      relationCount: (index.typeRelations || []).length
    };
    Object.entries(reviewedExpected).forEach(([key, value]) => {
      if (!index.summary || index.summary[key] !== value) issues.push(`summary:${key}`);
    });
  }
  return { ok: issues.length === 0, issues, actual: expected };
}

function main(args) {
  if (args.length !== 1) throw new Error("사용법: node audit-project-question-bank-index.cjs <공통문항인덱스.json>");
  const index = JSON.parse(fs.readFileSync(path.resolve(args[0]), "utf8"));
  const result = audit(index);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.ok) process.exitCode = 1;
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ audit });
