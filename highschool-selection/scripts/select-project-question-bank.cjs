"use strict";

const fs = require("node:fs");
const path = require("node:path");
const releaseGate = require("./select-question-bank.cjs");

const DEFAULT_ALLOWED_STATUSES = Object.freeze(["source_verified", "approved"]);
const CANDIDATE_ALLOWED_STATUSES = Object.freeze([...DEFAULT_ALLOWED_STATUSES, "candidate", "source_verified_not_current_exam_claim"]);

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
  const leftRank = left.sourceRole === "direct" ? "0" : "1";
  const rightRank = right.sourceRole === "direct" ? "0" : "1";
  const leftKey = [leftRank, left.course, left.semester, left.majorUnit, left.minorUnit, left.detailType, left.sourceBankId, left.sourceItemId].join("\u0000");
  const rightKey = [rightRank, right.course, right.semester, right.majorUnit, right.minorUnit, right.detailType, right.sourceBankId, right.sourceItemId].join("\u0000");
  return leftKey.localeCompare(rightKey, "ko") || left.itemId.localeCompare(right.itemId);
}

function exactMathItemMap(index, relations) {
  const result = new Map();
  const byItemId = new Map((index.items || []).map(item => [item.itemId, item]));
  const bySourceItemId = new Map();
  (index.items || []).forEach(item => {
    const matches = bySourceItemId.get(item.sourceItemId) || [];
    matches.push(item);
    bySourceItemId.set(item.sourceItemId, matches);
  });
  function resolve(id) {
    if (byItemId.has(id)) return id;
    const matches = bySourceItemId.get(id) || [];
    if (matches.length !== 1) throw new Error(`정확 중복 관계의 문항 ID가 없거나 모호합니다: ${id}`);
    return matches[0].itemId;
  }
  for (const relation of relations || []) {
    if (relation.kind !== "same_math_item") continue;
    if (!Array.isArray(relation.itemIds) || !relation.itemIds.includes(relation.canonicalMathItemId)) {
      throw new Error("정확 중복 관계의 대표 문항을 확인해 주세요.");
    }
    const canonicalItemId = resolve(relation.canonicalMathItemId);
    for (const id of relation.itemIds) {
      const itemId = resolve(id);
      const previous = result.get(itemId);
      if (previous && previous !== canonicalItemId) {
        throw new Error(`정확 중복 관계가 충돌합니다: ${id}`);
      }
      result.set(itemId, canonicalItemId);
    }
  }
  return result;
}

function contentPacks(contentData) {
  if (!contentData) return [];
  if (contentData.schemaVersion === "private-question-content-bundle/v1") {
    if (contentData.visibility !== "private" || !Array.isArray(contentData.packs) || !contentData.packs.length) {
      throw new Error("비공개 문항 본문 묶음의 구조를 확인해 주세요.");
    }
    return contentData.packs;
  }
  return [contentData];
}

function contentRecords(contentData) {
  const records = new Map();
  for (const pack of contentPacks(contentData)) {
    if (!["private-dp-cm1-content-db/v2", "private-question-content/v1"].includes(pack.schemaVersion)
        || pack.visibility !== "private" || !Array.isArray(pack.items)
        || pack.itemCount !== pack.items.length) {
      throw new Error("비공개 문항 본문 DB의 판본과 개수를 확인해 주세요.");
    }
    for (const row of pack.items) {
      if (!row?.canonicalItemId || records.has(row.canonicalItemId)) {
        throw new Error("비공개 문항 본문 DB의 ID가 없거나 중복됩니다.");
      }
      records.set(row.canonicalItemId, { row, packReleaseStatus: pack.releaseStatus });
    }
  }
  return records;
}

function visualAuditRecords(data) {
  if (!data) return new Map();
  if (data.schemaVersion !== "private-source-visual-audit/v1" || data.visibility !== "private"
      || !Array.isArray(data.items) || data.itemCount !== data.items.length) {
    throw new Error("비공개 원본 시각 감사의 판본과 개수를 확인해 주세요.");
  }
  const records = new Map();
  for (const row of data.items) {
    if (!row?.canonicalItemId || records.has(row.canonicalItemId)) {
      throw new Error("비공개 원본 시각 감사의 문항 ID가 없거나 중복됩니다.");
    }
    records.set(row.canonicalItemId, row);
  }
  return records;
}

const VISUAL_PART_KINDS = Object.freeze({
  none: [],
  table: ["table"],
  diagram: ["diagram", "svg"],
  graph: ["graph", "svg"],
  number_line: ["number_line", "svg"]
});

function isSha256(value) {
  return /^[a-f0-9]{64}$/i.test(clean(value));
}

function hasVisualPayload(part) {
  if (!part || typeof part !== "object") return false;
  if (part.kind === "table") return Array.isArray(part.columns) && part.columns.length > 0
    && Array.isArray(part.rows) && part.rows.length > 0;
  return [part.value, part.svg, part.model, part.assetId].some(value =>
    typeof value === "string" ? Boolean(value.trim())
      : value && typeof value === "object" ? Object.keys(value).length > 0 : false);
}

function presentationVerified(source, audit) {
  if (!source || !audit || audit.sourceQuestionId !== source.questionId) return false;
  const requirement = audit.visualRequirement;
  if (!Object.hasOwn(VISUAL_PART_KINDS, requirement)) return false;
  const requiredParts = VISUAL_PART_KINDS[requirement];
  // A source-page visual audit must explicitly say "none" when no visual is needed.
  const parts = Array.isArray(source.promptParts) ? source.promptParts : [];
  const kinds = new Set(parts.map(part => clean(part?.kind)));
  if (requiredParts.length ? !parts.some(part => requiredParts.includes(part?.kind) && hasVisualPayload(part))
    : Object.values(VISUAL_PART_KINDS).flat().some(kind => kinds.has(kind))) return false;

  const evidence = audit.renderEvidence;
  const originalHash = clean(source.sourceAssetSha256 || source.sourcePdfSha256);
  const reviewedHash = clean(audit.sourceSha256);
  if (!isSha256(originalHash) || originalHash.toLowerCase() !== reviewedHash.toLowerCase()
      || audit.sourceAuditStatus !== "source_checked" || audit.renderStatus !== "approved"
      || evidence?.visualReview !== "approved" || evidence?.sourceVisualMatch !== true
      || evidence?.singleAnswerVisible !== true || !isSha256(evidence.layoutAuditSha256)
      || !isSha256(evidence.a4PdfSha256)) return false;
  const profiles = Array.isArray(evidence.visualProfiles) ? evidence.visualProfiles : [];
  return ["desktop", "mobile", "a4"].every(surface => profiles.some(profile =>
    profile?.surface === surface && profile.status === "pass" && isSha256(profile.artifactSha256)));
}

function contentState(indexItem, records, visualAudits) {
  const entry = records.get(indexItem.itemId);
  const row = entry?.row;
  const source = row?.sourceItem;
  const valid = row?.canonicalItemId === indexItem.itemId
    && source?.questionId === indexItem.sourceItemId
    && Array.isArray(source.promptParts) && source.promptParts.length > 0
    && source.answer?.match === true
    && typeof source.solution?.summary === "string" && Boolean(source.solution.summary.trim())
    && Array.isArray(source.solution?.steps) && source.solution.steps.length >= 2
    && source.solution.steps.every(step => typeof step === "string" && Boolean(step.trim()))
    && ["single_choice", "input", "short_answer"].includes(source.response?.kind)
    && (!indexItem.responseKind || indexItem.responseKind === source.response.kind)
    && (source.response.kind !== "single_choice" || source.choices?.length === 5);
  return {
    verified: Boolean(valid),
    presentationVerified: Boolean(valid && presentationVerified(source, visualAudits?.get(indexItem.itemId))),
    releaseApproved: Boolean(valid && entry.packReleaseStatus === "approved"
      && source.releaseStatus === "approved" && source.mockExamEligible === true)
  };
}

function selectItems(index, profileTokens, options) {
  const opts = options || {};
  const tokens = Array.isArray(profileTokens) ? profileTokens : [profileTokens];
  const profiles = tokens.map(token => profileByToken(index, token));
  if (!profiles.length || profiles.some(profile => !profile)) throw new Error("학원형을 확인해 주세요.");
  const profileIds = new Set(profiles.map(profile => profile.profileId));
  const programIds = new Set(profiles.map(profile => profile.programId).filter(Boolean));
  const allowedStatuses = new Set(opts.allowedStatuses || DEFAULT_ALLOWED_STATUSES);
  const allowedConceptStatuses = new Set(opts.allowedConceptStatuses || ["mapped"]);
  const reviewInspection = opts.includeReviewCandidates === true || allowedStatuses.has("candidate");
  const query = clean(opts.query).toLocaleLowerCase("ko");
  const limit = Math.min(1000, Math.max(1, Number(opts.limit) || 300));
  if (opts.deduplicateExact === true && !Array.isArray(opts.itemRelations)) {
    throw new Error("정확 중복 제거에는 검수된 문항 관계가 필요합니다.");
  }
  const canonicalByItem = exactMathItemMap(index, opts.itemRelations);
  const privateContent = contentRecords(opts.contentData);
  const visualAudits = visualAuditRecords(opts.visualAuditData);
  const { familyById, sourceTypeByKey, sourceBankById } = buildLookups(index);

  const rows = (index.items || []).flatMap(item => {
    const fits = (item.academyFits || []).filter(fit => profileIds.has(fit.profileId) && allowedStatuses.has(fit.status));
    if (!fits.length || !allowedConceptStatuses.has(item.conceptStatus)) return [];
    const answerStatus = clean(item.answerCheck && item.answerCheck.status || item.answerStatus) || "pending";
    const learnerFit = releaseGate.normalizeLearnerFit(item.learnerFit);
    const classificationVerified = item.conceptStatus === "mapped" && item.classificationStatus === "verified";
    const explicitlyLocked = item.releaseStatus === "locked" || item.usageApproved === false;
    const usageApprovalPassed = item.usageApproved === true && fits.some(fit => fit.status === "approved");
    const content = contentState(item, privateContent, visualAudits);
    const releaseEligible = !explicitlyLocked && answerStatus === "verified"
      && releaseGate.learnerFitPassed(learnerFit) && classificationVerified
      && content.verified && content.presentationVerified && content.releaseApproved && usageApprovalPassed;
    if (!releaseEligible && !reviewInspection) return [];
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
      sourceRole: sourceBank && programIds.has(sourceBank.academyId) ? "direct" : "compatible",
      sourceItemId: item.sourceItemId,
      canonicalMathItemId: canonicalByItem.get(item.itemId) || item.itemId,
      sourceTypeId: item.sourceTypeId,
      sourceTypeLabel: sourceType ? sourceType.detailType : null,
      domainGroup: item.domainGroup || (sourceType && sourceType.domainGroup) || null,
      taxonomyReviewStatus: item.taxonomyReviewStatus || (sourceType && sourceType.taxonomyReviewStatus) || null,
      internalTypeGroupId: item.internalTypeGroupId || (sourceType && sourceType.internalTypeGroupId) || null,
      withinCurrentRange: Object.prototype.hasOwnProperty.call(item, "withinCurrentRange")
        ? item.withinCurrentRange === true
        : null,
      conceptFamilyId: familyId || null,
      course: curriculum.course || "",
      semester: curriculum.semester || "",
      majorUnit: curriculum.majorUnit || "",
      minorUnit: curriculum.minorUnit || "",
      detailType: family ? family.canonicalLabel : sourceType.detailType,
      solutionArchetype: item.solutionArchetype || (family ? family.solutionArchetype : (sourceType.solutionArchetype || null)),
      classificationStatus: item.classificationStatus,
      detailPrecision: item.detailPrecision,
      conceptStatus: item.conceptStatus,
      answerStatus,
      difficultyBand: item.difficulty && ["lowered", "standard", "raised"].includes(item.difficulty.targetBand)
        ? item.difficulty.targetBand
        : (item.difficultyBand || null),
      difficultyStatus: item.difficulty && item.difficulty.status || item.difficultyStatus || "pending",
      responseKind: item.responseKind || null,
      responseStatus: item.responseStatus || "pending",
      usageApproved: usageApprovalPassed,
      learnerFit,
      learnerFitPassed: releaseGate.learnerFitPassed(learnerFit),
      contentVerified: content.verified,
      presentationVerified: content.presentationVerified,
      releaseEligible,
      releaseBlockReason: explicitlyLocked
        ? "item_locked_or_not_approved"
        : !releaseGate.learnerFitPassed(learnerFit)
        ? "learner_fit_not_passed"
        : answerStatus !== "verified"
          ? "answer_check_not_verified"
          : !classificationVerified
            ? "classification_not_verified"
            : !content.verified ? "content_not_verified"
              : !content.presentationVerified ? "presentation_not_verified"
              : !content.releaseApproved ? "content_release_not_approved"
                : !usageApprovalPassed ? "academy_usage_not_approved" : null,
      academyFits: fits.map(fit => ({ profileId: fit.profileId, status: fit.status }))
    };
    if (query && ![
      row.itemId, row.sourceBankId, row.sourceItemId, row.sourceTypeId, row.sourceTypeLabel,
      row.conceptFamilyId, row.course, row.semester, row.majorUnit, row.minorUnit, row.detailType,
      row.solutionArchetype, row.domainGroup, row.taxonomyReviewStatus, row.internalTypeGroupId
    ].join(" ").toLocaleLowerCase("ko").includes(query)) return [];
    return [row];
  }).sort(compareItems);
  const seenMathItems = new Set();
  const selectedRows = (opts.deduplicateExact === true ? rows.filter(row => {
    if (seenMathItems.has(row.canonicalMathItemId)) return false;
    seenMathItems.add(row.canonicalMathItemId);
    return true;
  }) : rows).slice(0, limit);

  return {
    selectedProfiles: profiles.map(profile => ({ profileId: profile.profileId, programId: profile.programId, label: profile.label })),
    allowedStatuses: Array.from(allowedStatuses),
    allowedConceptStatuses: Array.from(allowedConceptStatuses),
    itemCount: selectedRows.length,
    items: selectedRows
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
module.exports = Object.freeze({ DEFAULT_ALLOWED_STATUSES, CANDIDATE_ALLOWED_STATUSES, profileByToken, buildLookups, compareItems, exactMathItemMap, contentPacks, contentRecords, visualAuditRecords, isSha256, presentationVerified, contentState, selectItems });
