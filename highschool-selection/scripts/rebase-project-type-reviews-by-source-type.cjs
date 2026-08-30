"use strict";

const fs = require("node:fs");
const path = require("node:path");
const reviewTools = require("./apply-project-type-reviews.cjs");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function pairKey(left, right) {
  return [String(left), String(right)].sort().join(":");
}

function sourceTypeKey(type) {
  return `${type.sourceBankId}:${type.sourceTypeId}`;
}

function rebase(oldIndex, newIndex, packet) {
  const oldCandidateById = new Map((oldIndex.overlapCandidates || []).map(candidate => [candidate.candidateId, candidate]));
  const oldFamilyById = new Map((oldIndex.conceptFamilies || []).map(family => [family.conceptFamilyId, family]));
  const newFamilyBySourceType = new Map();
  (newIndex.conceptFamilies || []).forEach(family => (family.sourceTypes || []).forEach(type => {
    const key = sourceTypeKey(type);
    if (newFamilyBySourceType.has(key)) throw new Error(`새 공통 인덱스에 원본 유형이 중복됩니다: ${key}`);
    newFamilyBySourceType.set(key, family.conceptFamilyId);
  }));
  const newCandidateByPair = new Map((newIndex.overlapCandidates || []).map(candidate => [
    pairKey(candidate.leftConceptFamilyId, candidate.rightConceptFamilyId), candidate
  ]));
  const expanded = reviewTools.expandBatchReviews(oldIndex, packet);
  const reviewsById = new Map();
  const retiredReviews = [];

  function mapFamily(oldFamilyId) {
    const family = oldFamilyById.get(oldFamilyId);
    if (!family) return { issue: "old_family_missing" };
    const mapped = Array.from(new Set((family.sourceTypes || []).map(type => newFamilyBySourceType.get(sourceTypeKey(type))).filter(Boolean)));
    if (!mapped.length) return { issue: "source_type_missing_in_new_index" };
    if (mapped.length > 1) return { issue: "old_family_split_in_new_index", mapped };
    return { familyId: mapped[0] };
  }

  (expanded.reviews || []).forEach(review => {
    const oldCandidate = oldCandidateById.get(review.candidateId);
    if (!oldCandidate) {
      retiredReviews.push({ ...review, retiredReason: "old_candidate_missing" });
      return;
    }
    const left = mapFamily(oldCandidate.leftConceptFamilyId);
    const right = mapFamily(oldCandidate.rightConceptFamilyId);
    if (left.issue || right.issue) {
      retiredReviews.push({ ...review, retiredReason: left.issue || right.issue });
      return;
    }
    if (left.familyId === right.familyId) {
      retiredReviews.push({ ...review, retiredReason: "pair_now_exact_family" });
      return;
    }
    const candidate = newCandidateByPair.get(pairKey(left.familyId, right.familyId));
    if (!candidate) {
      retiredReviews.push({ ...review, retiredReason: "pair_not_candidate_in_new_index" });
      return;
    }
    const rebased = { ...review, candidateId: candidate.candidateId };
    const prior = reviewsById.get(rebased.candidateId);
    if (prior && (prior.decision !== rebased.decision || prior.reason !== rebased.reason)) {
      throw new Error(`새 후보 하나에 서로 다른 기존 결정이 연결됩니다: ${rebased.candidateId}`);
    }
    reviewsById.set(rebased.candidateId, prior || rebased);
  });

  const reviews = Array.from(reviewsById.values()).sort((left, right) => left.candidateId.localeCompare(right.candidateId));
  retiredReviews.sort((left, right) => left.candidateId.localeCompare(right.candidateId));
  const output = {
    schemaVersion: 1,
    title: String(packet.title || "프로젝트 공통 유형 후보 ID 고정 검수표"),
    reviews,
    retiredReviews,
    summary: {
      previousReviewCount: (expanded.reviews || []).length,
      carriedReviewCount: reviews.length,
      retiredReviewCount: retiredReviews.length,
      currentCandidateCount: (newIndex.overlapCandidates || []).length,
      pendingCount: Math.max(0, (newIndex.overlapCandidates || []).length - reviews.length)
    }
  };
  const issues = reviewTools.validateReviews(newIndex, output);
  if (issues.length) throw new Error(`옮긴 유형 검수표를 확인해 주세요: ${issues.join(", ")}`);
  return output;
}

function main(args) {
  if (args.length !== 4) throw new Error("사용법: node rebase-project-type-reviews-by-source-type.cjs <이전인덱스> <새인덱스> <이전검수표> <출력>");
  const output = rebase(readJson(args[0]), readJson(args[1]), readJson(args[2]));
  fs.mkdirSync(path.dirname(path.resolve(args[3])), { recursive: true });
  fs.writeFileSync(path.resolve(args[3]), `${JSON.stringify(output, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(output.summary)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ pairKey, sourceTypeKey, rebase });
