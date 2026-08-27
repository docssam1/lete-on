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
  const familyIds = new Set();
  const sourceTypeKeys = new Set();
  (index.conceptFamilies || []).forEach(family => {
    if (familyIds.has(family.conceptFamilyId)) issues.push(`duplicate_family:${family.conceptFamilyId}`);
    familyIds.add(family.conceptFamilyId);
    if (!family.canonicalLabel || !family.sourceTypes.length) issues.push(`family_shape:${family.conceptFamilyId}`);
    family.sourceTypes.forEach(type => {
      const key = `${type.sourceBankId}:${type.sourceTypeId}`;
      if (sourceTypeKeys.has(key)) issues.push(`duplicate_source_type_mapping:${key}`);
      sourceTypeKeys.add(key);
      if (!bankIds.has(type.sourceBankId)) issues.push(`unknown_family_bank:${key}`);
    });
  });
  const itemIds = new Set();
  (index.items || []).forEach(item => {
    if (itemIds.has(item.itemId)) issues.push(`duplicate_item:${item.itemId}`);
    itemIds.add(item.itemId);
    if (!bankIds.has(item.sourceBankId)) issues.push(`unknown_item_bank:${item.itemId}`);
    if (item.conceptStatus === "mapped" && !familyIds.has(item.conceptFamilyId)) issues.push(`unknown_item_family:${item.itemId}`);
    if (item.conceptStatus !== "mapped" && item.conceptFamilyId !== null) issues.push(`unexpected_item_family:${item.itemId}`);
  });
  const candidateIds = new Set();
  (index.overlapCandidates || []).forEach(candidate => {
    if (candidateIds.has(candidate.candidateId)) issues.push(`duplicate_candidate:${candidate.candidateId}`);
    candidateIds.add(candidate.candidateId);
    if (!familyIds.has(candidate.leftConceptFamilyId) || !familyIds.has(candidate.rightConceptFamilyId)) issues.push(`candidate_family:${candidate.candidateId}`);
    if (candidate.status !== "review_required" || candidate.decision !== null) issues.push(`candidate_status:${candidate.candidateId}`);
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
