"use strict";

const fs = require("node:fs");
const path = require("node:path");

const DEFAULT_ALLOWED_STATUSES = Object.freeze(["source_verified", "approved"]);
const CANDIDATE_ALLOWED_STATUSES = Object.freeze([...DEFAULT_ALLOWED_STATUSES, "candidate"]);

function clean(value) {
  return String(value == null ? "" : value).trim();
}

function profileByToken(index, token) {
  const normalized = clean(token).toLocaleLowerCase("ko");
  return (index.academyProfiles || []).find(profile =>
    clean(profile.profileId).toLocaleLowerCase("ko") === normalized ||
    clean(profile.programId).toLocaleLowerCase("ko") === normalized ||
    clean(profile.label).toLocaleLowerCase("ko") === normalized
  ) || null;
}

function buildLookups(index) {
  return {
    familyById: new Map((index.conceptFamilies || []).map(family => [family.conceptFamilyId, family])),
    sourceTypeByKey: new Map((index.sourceTypes || []).map(type => [`${type.sourceBankId}:${type.sourceTypeId}`, type])),
    sourceBankById: new Map((index.sourceBanks || []).map(bank => [bank.sourceBankId, bank]))
  };
}

function compareItems(left, right) {
  const leftKey = [left.course, left.semester, left.majorUnit, left.minorUnit, left.detailType, left.sourceBankId, left.sourceItemId].join("\u0000");
  const rightKey = [right.course, right.semester, right.majorUnit, right.minorUnit, right.detailType, right.sourceBankId, right.sourceItemId].join("\u0000");
  return leftKey.localeCompare(rightKey, "ko") || left.itemId.localeCompare(right.itemId);
}

function selectItems(index, profileTokens, options) {
  const opts = options || {};
  const tokens = Array.isArray(profileTokens) ? profileTokens : [profileTokens];
  const profiles = tokens.map(token => profileByToken(index, token));
  if (!profiles.length || profiles.some(profile => !profile)) throw new Error("학원형을 확인해 주세요.");
  const profileIds = new Set(profiles.map(profile => profile.profileId));
  const allowedStatuses = new Set(opts.allowedStatuses || DEFAULT_ALLOWED_STATUSES);
  const allowedConceptStatuses = new Set(opts.allowedConceptStatuses || ["mapped"]);
  const query = clean(opts.query).toLocaleLowerCase("ko");
  const limit = Math.min(1000, Math.max(1, Number(opts.limit) || 300));
  const { familyById, sourceTypeByKey, sourceBankById } = buildLookups(index);

  const rows = (index.items || []).flatMap(item => {
    const fits = (item.academyFits || []).filter(fit => profileIds.has(fit.profileId) && allowedStatuses.has(fit.status));
    if (!fits.length || !allowedConceptStatuses.has(item.conceptStatus)) return [];
    const familyId = item.canonicalConceptFamilyId || item.conceptFamilyId;
    const family = familyById.get(familyId);
    const sourceType = sourceTypeByKey.get(`${item.sourceBankId}:${item.sourceTypeId}`);
    if (!family && !sourceType) return [];
    const sourceBank = sourceBankById.get(item.sourceBankId);
    const curriculum = family ? (family.curriculum || {}) : sourceType;
    const row = {
      itemId: item.itemId,
      sourceBankId: item.sourceBankId,
      sourceBankLabel: sourceBank ? sourceBank.label : item.sourceBankId,
      sourceItemId: item.sourceItemId,
      sourceTypeId: item.sourceTypeId,
      sourceTypeLabel: sourceType ? sourceType.detailType : null,
      conceptFamilyId: familyId || null,
      course: curriculum.course || "",
      semester: curriculum.semester || "",
      majorUnit: curriculum.majorUnit || "",
      minorUnit: curriculum.minorUnit || "",
      detailType: family ? family.canonicalLabel : sourceType.detailType,
      solutionArchetype: family ? family.solutionArchetype : (sourceType.solutionArchetype || null),
      classificationStatus: item.classificationStatus,
      detailPrecision: item.detailPrecision,
      conceptStatus: item.conceptStatus,
      academyFits: fits.map(fit => ({ profileId: fit.profileId, status: fit.status }))
    };
    if (query && ![
      row.itemId, row.sourceBankId, row.sourceItemId, row.sourceTypeId, row.sourceTypeLabel,
      row.conceptFamilyId, row.course, row.semester, row.majorUnit, row.minorUnit, row.detailType,
      row.solutionArchetype
    ].join(" ").toLocaleLowerCase("ko").includes(query)) return [];
    return [row];
  }).sort(compareItems).slice(0, limit);

  return {
    selectedProfiles: profiles.map(profile => ({ profileId: profile.profileId, programId: profile.programId, label: profile.label })),
    allowedStatuses: Array.from(allowedStatuses),
    allowedConceptStatuses: Array.from(allowedConceptStatuses),
    itemCount: rows.length,
    items: rows
  };
}

function main(args) {
  if (args.length < 2 || args.length > 3) {
    throw new Error("사용법: node select-project-question-bank.cjs <공통문항인덱스.json> <학원형[,학원형...]> [--include-incomplete]");
  }
  const index = JSON.parse(fs.readFileSync(path.resolve(args[0]), "utf8"));
  const includeIncomplete = args[2] === "--include-incomplete";
  const result = selectItems(index, args[1].split(",").map(clean).filter(Boolean), includeIncomplete ? {
    allowedStatuses: CANDIDATE_ALLOWED_STATUSES,
    allowedConceptStatuses: ["mapped", "unit_only", "pending"]
  } : {});
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ DEFAULT_ALLOWED_STATUSES, CANDIDATE_ALLOWED_STATUSES, profileByToken, buildLookups, compareItems, selectItems });
