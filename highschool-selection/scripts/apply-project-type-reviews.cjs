"use strict";

const fs = require("node:fs");
const path = require("node:path");

const DECISIONS = Object.freeze([
  "merge_detail",
  "same_concept_family",
  "related_method",
  "prerequisite",
  "keep_separate",
  "insufficient_evidence"
]);

const DECISION_REASONS = Object.freeze({
  merge_detail: "원문 조건과 풀이 구조를 대조해 같은 세부 유형으로 확인",
  same_concept_family: "같은 개념군이지만 조건이나 요구값이 달라 세부 유형은 유지",
  related_method: "공통 풀이 도구만 공유하고 주개념이나 풀이 구조가 달라 분리",
  prerequisite: "한 유형이 다른 유형을 풀기 위한 선수 기능이므로 별도 연결",
  keep_separate: "이름 일부가 비슷해도 주개념과 풀이 구조가 달라 별도 유형으로 유지",
  insufficient_evidence: "현재 근거만으로 관계를 확정할 수 없어 추가 원본 검수가 필요"
});

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function pairKey(left, right) {
  return [String(left), String(right)].sort().join(":");
}

function expandBatchReviews(index, packet) {
  if (Array.isArray(packet.reviews)) return packet;
  const reviews = [];
  const familyById = new Map((index.conceptFamilies || []).map(family => [family.conceptFamilyId, family]));
  (packet.batches || []).forEach(batch => {
    Object.entries(batch.positions || {}).forEach(([decision, positions]) => {
      (positions || []).forEach(position => {
        const candidate = (index.overlapCandidates || [])[Number(position) - 1];
        if (!candidate) {
          reviews.push({ candidateId: `missing-position-${position}`, decision, reviewer: batch.reviewer, reviewedAt: batch.reviewedAt, reason: "후보 위치 오류", evidence: [] });
          return;
        }
        const left = familyById.get(candidate.leftConceptFamilyId);
        const right = familyById.get(candidate.rightConceptFamilyId);
        const evidence = decision === "merge_detail"
          ? Array.from(new Set([...(left ? left.evidence || [] : []), ...(right ? right.evidence || [] : []), ...(batch.evidence || []), ...((batch.evidenceByPosition || {})[position] || [])]))
          : Array.from(new Set([...(batch.evidence || []), ...((batch.evidenceByPosition || {})[position] || [])]));
        reviews.push({
          candidateId: candidate.candidateId,
          decision,
          reviewer: batch.reviewer,
          reviewedAt: batch.reviewedAt,
          reason: (batch.reasons || {})[position] || batch.reason || DECISION_REASONS[decision],
          evidence
        });
      });
    });
  });
  return { ...packet, reviews };
}

function validateReviews(index, packet) {
  const issues = [];
  if (!packet || packet.schemaVersion !== 1) issues.push("review.schema_version");
  const candidates = new Map((index.overlapCandidates || []).map(candidate => [candidate.candidateId, candidate]));
  const seen = new Set();
  (packet.reviews || []).forEach((review, position) => {
    const prefix = `review.${position + 1}`;
    if (!candidates.has(review.candidateId)) issues.push(`${prefix}.candidate`);
    if (seen.has(review.candidateId)) issues.push(`${prefix}.duplicate`);
    seen.add(review.candidateId);
    if (!DECISIONS.includes(review.decision)) issues.push(`${prefix}.decision`);
    if (!String(review.reviewer || "").trim() || !/^\d{4}-\d{2}-\d{2}$/.test(String(review.reviewedAt || ""))) issues.push(`${prefix}.reviewer`);
    if (!String(review.reason || "").trim()) issues.push(`${prefix}.reason`);
    if (review.decision === "merge_detail" && (!Array.isArray(review.evidence) || !review.evidence.length)) issues.push(`${prefix}.merge_evidence`);
  });
  return Array.from(new Set(issues)).sort();
}

function createUnionFind(ids) {
  const parent = new Map(ids.map(id => [id, id]));
  function find(id) {
    const current = parent.get(id);
    if (current === id) return id;
    const root = find(current);
    parent.set(id, root);
    return root;
  }
  function union(left, right) {
    const a = find(left);
    const b = find(right);
    if (a === b) return;
    const ordered = [a, b].sort();
    parent.set(ordered[1], ordered[0]);
  }
  return { find, union };
}

function applyReviews(index, packet) {
  const expanded = expandBatchReviews(index, packet);
  const issues = validateReviews(index, expanded);
  if (issues.length) throw new Error(`유형 검수표를 확인해 주세요: ${issues.join(", ")}`);
  const reviews = new Map((expanded.reviews || []).map(review => [review.candidateId, review]));
  const familyIds = (index.conceptFamilies || []).map(family => family.conceptFamilyId);
  const union = createUnionFind(familyIds);
  (index.overlapCandidates || []).forEach(candidate => {
    const review = reviews.get(candidate.candidateId);
    if (review && review.decision === "merge_detail") union.union(candidate.leftConceptFamilyId, candidate.rightConceptFamilyId);
  });
  const canonicalByFamily = new Map(familyIds.map(id => [id, union.find(id)]));
  const overlapCandidates = (index.overlapCandidates || []).map(candidate => {
    const review = reviews.get(candidate.candidateId);
    return review ? {
      ...candidate,
      status: review.decision === "insufficient_evidence" ? "evidence_required" : "resolved",
      decision: review.decision,
      review: {
        reviewer: review.reviewer,
        reviewedAt: review.reviewedAt,
        reason: review.reason,
        evidence: review.evidence || []
      }
    } : candidate;
  });
  const conceptFamilies = (index.conceptFamilies || []).map(family => ({
    ...family,
    canonicalConceptFamilyId: canonicalByFamily.get(family.conceptFamilyId),
    canonicalStatus: canonicalByFamily.get(family.conceptFamilyId) === family.conceptFamilyId ? "primary" : "alias"
  }));
  const items = (index.items || []).map(item => ({
    ...item,
    canonicalConceptFamilyId: item.conceptFamilyId ? canonicalByFamily.get(item.conceptFamilyId) : null
  }));
  const typeRelations = overlapCandidates.filter(candidate => candidate.status === "resolved").map(candidate => ({
    relationId: candidate.candidateId,
    leftConceptFamilyId: candidate.leftConceptFamilyId,
    rightConceptFamilyId: candidate.rightConceptFamilyId,
    relation: candidate.decision,
    evidence: candidate.review.evidence
  }));
  const output = { ...index, conceptFamilies, overlapCandidates, typeRelations, items };
  output.summary = {
    ...index.summary,
    resolvedOverlapCount: overlapCandidates.filter(candidate => candidate.status === "resolved").length,
    evidenceRequiredCount: overlapCandidates.filter(candidate => candidate.status === "evidence_required").length,
    pendingOverlapCount: overlapCandidates.filter(candidate => candidate.status === "review_required").length,
    mergedAliasCount: conceptFamilies.filter(family => family.canonicalStatus === "alias").length,
    relationCount: typeRelations.length
  };
  return output;
}

function main(args) {
  if (args.length < 3 || args.length > 4) throw new Error("사용법: node apply-project-type-reviews.cjs <공통인덱스.json> <검수결과.json> <출력.json> [후보ID고정검수표.json]");
  const index = readJson(args[0]);
  const expanded = expandBatchReviews(index, readJson(args[1]));
  const output = applyReviews(index, expanded);
  fs.mkdirSync(path.dirname(path.resolve(args[2])), { recursive: true });
  fs.writeFileSync(path.resolve(args[2]), `${JSON.stringify(output, null, 2)}\n`, "utf8");
  if (args[3]) {
    fs.mkdirSync(path.dirname(path.resolve(args[3])), { recursive: true });
    fs.writeFileSync(path.resolve(args[3]), `${JSON.stringify(expanded, null, 2)}\n`, "utf8");
  }
  process.stdout.write(`${JSON.stringify(output.summary)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ DECISIONS, DECISION_REASONS, pairKey, expandBatchReviews, validateReviews, createUnionFind, applyReviews });
