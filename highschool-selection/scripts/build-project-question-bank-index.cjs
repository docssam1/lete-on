"use strict";

const fs = require("node:fs");
const path = require("node:path");
const core = require("./project-question-bank-core.cjs");
const dolpaCore = require("./build-dolpa-question-db.cjs");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function sourceType(sourceBankId, sourceTypeId, fields) {
  return {
    sourceBankId,
    sourceTypeId: String(sourceTypeId),
    course: fields.course || "",
    semester: fields.semester || "",
    majorUnit: fields.majorUnit || "",
    minorUnit: fields.minorUnit || "",
    detailType: fields.detailType || "",
    solutionArchetype: fields.solutionArchetype || "",
    detailPrecision: fields.detailPrecision || "verified",
    status: fields.status || "verified",
    evidence: fields.evidence || []
  };
}

function adaptDolpa(database) {
  const types = database.typeCatalog.map(type => sourceType("DOLPA-ORIGINAL", type.typeId, {
    semester: type.semester,
    majorUnit: type.majorUnit,
    minorUnit: type.minorUnit,
    detailType: type.label,
    solutionArchetype: type.methodStatus === "verified" ? type.solutionArchetype : "",
    evidence: type.questionIds.map(id => `dolpa:${id}`)
  }));
  const items = database.questions.map(question => ({
    itemId: `DOLPA-ORIGINAL:${question.questionId}`,
    sourceBankId: "DOLPA-ORIGINAL",
    sourceItemId: question.questionId,
    sourceTypeId: question.classification.typeId,
    solutionArchetype: question.method && question.method.status === "verified" ? question.method.solutionArchetype : null,
    classificationStatus: question.classification.status,
    detailPrecision: "verified",
    academyFits: question.usageProfiles.map(usage => ({ profileId: usage.profileId, status: usage.status }))
  }));
  return {
    bank: { sourceBankId: "DOLPA-ORIGINAL", academyId: "DP", label: "돌파 원본 시험", itemCount: items.length, status: "verified" },
    types,
    items
  };
}

function adaptSharedTypes(index) {
  const types = index.types.map(type => sourceType("COMMON-TYPE-INDEX", type.type_id, {
    course: type.course,
    majorUnit: type.major_unit,
    minorUnit: type.minor_unit,
    detailType: type.detail_type,
    solutionArchetype: type.solution_archetype,
    status: "verified",
    evidence: (type.evidence || []).map(item => `bundle:${item.bundle_id}:${item.questions}`)
  }));
  return {
    bank: {
      sourceBankId: "COMMON-TYPE-INDEX",
      academyId: null,
      label: "공통수학 유형표",
      itemCount: index.types.reduce((sum, type) => sum + Number(type.question_count || 0), 0),
      indexedTypeCount: types.length,
      status: "type_catalog_only"
    },
    types,
    items: []
  };
}

function adaptHwangsoRound(metadata) {
  const types = metadata.items.map(item => sourceType("HWANGSO-HIGH-R01", item.detailTypeId, {
    semester: [item.gradeBand, item.semester].filter(Boolean).join(" "),
    majorUnit: item.domain,
    minorUnit: item.majorUnit,
    detailType: item.detailType,
    status: item.classificationStatus,
    evidence: item.classificationEvidence
  }));
  const items = metadata.items.map(item => ({
    itemId: `HWANGSO-HIGH-R01:${item.id}`,
    sourceBankId: "HWANGSO-HIGH-R01",
    sourceItemId: item.id,
    sourceTypeId: item.detailTypeId,
    classificationStatus: item.classificationStatus,
    detailPrecision: "verified",
    academyFits: [{ profileId: "SH_SELECTION", status: "source_verified" }]
  }));
  return {
    bank: { sourceBankId: "HWANGSO-HIGH-R01", academyId: "SH", label: "황소 고등 대표 시험 1회", itemCount: items.length, status: "verified" },
    types,
    items
  };
}

function adaptWonmathManifests(manifests, detailReviews) {
  const typesById = new Map();
  const items = [];
  const reviewByItemId = new Map(((detailReviews && detailReviews.reviews) || []).map(review => [review.sourceItemId, review]));
  const usedReviewIds = new Set();
  manifests.forEach((manifest, roundIndex) => {
    const round = String(roundIndex + 1).padStart(2, "0");
    manifest.items.forEach(item => {
      const sourceItemId = `R${round}-Q${String(item.examNumber).padStart(2, "0")}`;
      const sourceUnitTypeId = String(item.typeId);
      const review = reviewByItemId.get(sourceItemId);
      if (review && (review.sourceUnitTypeId !== sourceUnitTypeId || review.majorUnit !== item.majorUnit || review.minorUnit !== item.minorUnit)) {
        throw new Error(`원수학 세부유형 검수표가 구성표와 다릅니다: ${sourceItemId}`);
      }
      if (review) usedReviewIds.add(sourceItemId);
      const verified = Boolean(review && review.detailPrecision === "verified" && ["reviewed", "verified"].includes(review.classificationStatus));
      const sourceTypeId = verified ? review.sourceTypeId : sourceUnitTypeId;
      if (!typesById.has(sourceTypeId)) {
        typesById.set(sourceTypeId, sourceType("WONMATH-M21", sourceTypeId, verified ? {
          semester: review.semester,
          majorUnit: review.majorUnit,
          minorUnit: review.minorUnit,
          detailType: review.detailType,
          solutionArchetype: review.solutionArchetype,
          detailPrecision: "verified",
          status: review.classificationStatus,
          evidence: review.evidence || []
        } : {
          semester: "중1",
          majorUnit: item.majorUnit,
          minorUnit: item.minorUnit,
          detailType: item.minorUnit,
          detailPrecision: "unit_only",
          status: "verified_unit_only",
          evidence: [`wonmath:${sourceUnitTypeId}`]
        }));
      }
      items.push({
        itemId: `WONMATH-M21:${sourceItemId}`,
        sourceBankId: "WONMATH-M21",
        sourceItemId,
        sourceUnitTypeId,
        sourceTypeId,
        classificationStatus: verified ? review.classificationStatus : "verified_unit_only",
        detailPrecision: verified ? "verified" : "unit_only",
        academyFits: [{ profileId: "WM_BASIC", status: "source_verified" }]
      });
    });
  });
  const unknownReviewIds = Array.from(reviewByItemId.keys()).filter(id => !usedReviewIds.has(id));
  if (unknownReviewIds.length) throw new Error(`원수학 세부유형 검수표에 구성표에 없는 문항이 있습니다: ${unknownReviewIds.join(", ")}`);
  const allVerified = items.length > 0 && items.every(item => item.detailPrecision === "verified");
  return {
    bank: { sourceBankId: "WONMATH-M21", academyId: "WM", label: "원수학 중2-1 기본반 4회", itemCount: items.length, status: allVerified ? "reviewed_detail" : "review_in_progress" },
    types: Array.from(typesById.values()),
    items
  };
}

function adaptHwangsoMiddle(index, curriculumReviews) {
  const sourceItems = Array.isArray(index.items) ? index.items : [];
  const activeIds = new Set((index.activeQuestionCandidates || []).map(item => typeof item === "string" ? item : item.id));
  const rejectedIds = new Set((index.rejectedCandidates || []).map(item => typeof item === "string" ? item : item.id));
  const active = activeIds.size
    ? sourceItems.filter(item => activeIds.has(item.id))
    : sourceItems.filter(item => item.releaseStatus === "locked" && !rejectedIds.has(item.id) && item.discoveryStatus !== "rejected");
  const typesById = new Map();
  const reviewByItemId = new Map(((curriculumReviews && curriculumReviews.reviews) || []).map(review => [review.sourceItemId, review]));
  const usedReviewIds = new Set();
  const items = active.map(item => {
    const review = reviewByItemId.get(item.id);
    if (review) usedReviewIds.add(item.id);
    const reviewedDetail = Boolean(review && review.detailPrecision === "verified" && review.classificationStatus === "reviewed_detail" && review.sourceUnitTypeId && review.sourceTypeId && review.detailType && review.solutionArchetype);
    const reviewedUnit = Boolean(review && review.detailPrecision === "unit_only" && review.classificationStatus === "reviewed_unit" && review.sourceUnitTypeId);
    if (review && review.detailPrecision === "verified" && !reviewedDetail) throw new Error(`황소 세부유형 검수표가 완전하지 않습니다: ${item.id}`);
    const sourceTypeId = reviewedDetail ? review.sourceTypeId : reviewedUnit ? review.sourceUnitTypeId : null;
    if (sourceTypeId && !typesById.has(sourceTypeId)) {
      typesById.set(sourceTypeId, sourceType("HWANGSO-MIDDLE", sourceTypeId, reviewedDetail ? {
        semester: review.semester,
        majorUnit: review.majorUnit,
        minorUnit: review.minorUnit,
        detailType: review.detailType,
        solutionArchetype: review.solutionArchetype,
        detailPrecision: "verified",
        status: "reviewed_detail",
        evidence: review.evidence || []
      } : {
        semester: review.semester,
        majorUnit: review.majorUnit,
        minorUnit: review.minorUnit,
        detailType: review.minorUnit,
        detailPrecision: "unit_only",
        status: "reviewed_unit",
        evidence: review.evidence || []
      }));
    }
    return {
      itemId: `HWANGSO-MIDDLE:${item.id}`,
      sourceBankId: "HWANGSO-MIDDLE",
      sourceItemId: item.id,
      sourceUnitTypeId: reviewedDetail || reviewedUnit ? review.sourceUnitTypeId : null,
      sourceTypeId,
      classificationStatus: reviewedDetail ? "reviewed_detail" : reviewedUnit ? "reviewed_unit" : item.classificationStatus || "pending",
      detailPrecision: reviewedDetail ? "verified" : reviewedUnit ? "unit_only" : "pending",
      academyFits: [{ profileId: "SH_SELECTION", status: "candidate" }]
    };
  });
  const unknownReviewIds = Array.from(reviewByItemId.keys()).filter(id => !usedReviewIds.has(id));
  if (unknownReviewIds.length) throw new Error(`황소 교육과정 검수표에 활성 문항이 아닌 ID가 있습니다: ${unknownReviewIds.join(", ")}`);
  const allDetailReviewed = items.length > 0 && items.every(item => item.detailPrecision === "verified");
  const allUnitReviewed = items.length > 0 && items.every(item => ["verified", "unit_only"].includes(item.detailPrecision));
  return {
    bank: { sourceBankId: "HWANGSO-MIDDLE", academyId: "SH", label: "황소 중등 교재 후보", itemCount: items.length, status: allDetailReviewed ? "reviewed_detail" : allUnitReviewed ? "reviewed_unit" : "classification_in_progress" },
    types: Array.from(typesById.values()),
    items
  };
}

function buildIndex(inputs) {
  const adapters = [
    adaptDolpa(inputs.dolpa),
    adaptSharedTypes(inputs.sharedTypes),
    adaptHwangsoRound(inputs.hwangsoRound),
    adaptWonmathManifests(inputs.wonmathManifests, inputs.wonmathDetailReviews),
    adaptHwangsoMiddle(inputs.hwangsoMiddle, inputs.hwangsoCurriculumReviews)
  ];
  const sourceTypes = adapters.flatMap(adapter => adapter.types);
  const conceptFamilies = core.createConceptFamilies(sourceTypes);
  const familyBySourceType = new Map();
  conceptFamilies.forEach(family => family.sourceTypes.forEach(type => familyBySourceType.set(`${type.sourceBankId}:${type.sourceTypeId}`, family.conceptFamilyId)));
  const items = adapters.flatMap(adapter => adapter.items).map(item => ({
    ...item,
    conceptFamilyId: item.sourceTypeId ? familyBySourceType.get(`${item.sourceBankId}:${item.sourceTypeId}`) || null : null,
    conceptStatus: item.detailPrecision === "verified" ? "mapped" : item.detailPrecision === "unit_only" ? "unit_only" : "pending"
  })).sort((a, b) => a.itemId.localeCompare(b.itemId));
  const profiles = dolpaCore.PROFILE_CATALOG.map(profile => ({
    profileId: profile.profileId,
    programId: profile.programId,
    label: profile.label,
    definitionStatus: profile.definitionStatus
  }));
  const generatedCandidates = core.createOverlapCandidates(conceptFamilies);
  const candidateByPair = new Map(generatedCandidates.map(candidate => {
    const pair = [candidate.leftConceptFamilyId, candidate.rightConceptFamilyId].sort().join(":");
    return [pair, candidate];
  }));
  ((inputs.reviewDecisions && inputs.reviewDecisions.candidates) || []).forEach(candidate => {
    const left = familyBySourceType.get(`${candidate.left.sourceBankId}:${candidate.left.sourceTypeId}`);
    const right = familyBySourceType.get(`${candidate.right.sourceBankId}:${candidate.right.sourceTypeId}`);
    if (!left || !right || left === right) return;
    const ordered = [left, right].sort();
    const pair = ordered.join(":");
    const existing = candidateByPair.get(pair);
    candidateByPair.set(pair, {
      candidateId: core.stableId("OVR", ordered),
      leftConceptFamilyId: ordered[0],
      rightConceptFamilyId: ordered[1],
      score: existing ? existing.score : null,
      status: "review_required",
      decision: null,
      proposedRelation: candidate.proposedRelation,
      reason: candidate.reason,
      evidence: candidate.evidence || []
    });
  });
  const overlapCandidates = Array.from(candidateByPair.values()).sort((a, b) => (b.score || 0) - (a.score || 0) || a.candidateId.localeCompare(b.candidateId));
  const index = {
    schemaVersion: 1,
    taxonomyVersion: "kr-2022-shared-concepts-v1",
    title: "프로젝트 공통 문항 인덱스",
    rules: [
      "원본 문항 ID와 원본 유형명은 보존한다.",
      "같은 교육과정 위치와 같은 세부 유형만 자동으로 하나의 공통 개념에 묶는다.",
      "비슷한 이름은 자동 병합하지 않고 겹침 후보로 남긴다.",
      "선수 개념과 연계 개념은 같은 유형으로 합치지 않는다.",
      "학원형은 공통 개념 ID와 분리된 적합도 태그로 관리한다."
    ],
    academyProfiles: profiles,
    sourceBanks: adapters.map(adapter => adapter.bank),
    conceptFamilies,
    sourceTypes,
    overlapCandidates,
    items
  };
  index.summary = {
    sourceBankCount: index.sourceBanks.length,
    itemCount: items.length,
    mappedItemCount: items.filter(item => item.conceptStatus === "mapped").length,
    unitOnlyItemCount: items.filter(item => item.conceptStatus === "unit_only").length,
    pendingItemCount: items.filter(item => item.conceptStatus === "pending").length,
    sourceTypeCount: sourceTypes.length,
    conceptFamilyCount: conceptFamilies.length,
    exactMergedFamilyCount: conceptFamilies.filter(family => family.mergeStatus === "exact_verified").length,
    overlapCandidateCount: index.overlapCandidates.length
  };
  return index;
}

function loadInputs(config) {
  return {
    dolpa: readJson(config.dolpaDb),
    sharedTypes: readJson(config.sharedTypeIndex),
    hwangsoRound: require(path.resolve(config.hwangsoRoundModule)).metadata,
    wonmathManifests: config.wonmathManifests.map(readJson),
    wonmathDetailReviews: config.wonmathDetailReviews ? readJson(config.wonmathDetailReviews) : null,
    hwangsoMiddle: readJson(config.hwangsoMiddleIndex),
    hwangsoCurriculumReviews: config.hwangsoCurriculumReviews ? readJson(config.hwangsoCurriculumReviews) : null,
    reviewDecisions: config.reviewDecisions ? readJson(config.reviewDecisions) : { candidates: [] }
  };
}

function main(args) {
  if (args.length !== 2) throw new Error("사용법: node build-project-question-bank-index.cjs <입력설정.json> <출력.json>");
  const config = readJson(args[0]);
  const index = buildIndex(loadInputs(config));
  fs.mkdirSync(path.dirname(path.resolve(args[1])), { recursive: true });
  fs.writeFileSync(path.resolve(args[1]), `${JSON.stringify(index, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(index.summary)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({
  sourceType,
  adaptDolpa,
  adaptSharedTypes,
  adaptHwangsoRound,
  adaptWonmathManifests,
  adaptHwangsoMiddle,
  buildIndex,
  loadInputs
});
