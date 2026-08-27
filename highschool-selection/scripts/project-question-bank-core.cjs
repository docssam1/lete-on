"use strict";

const crypto = require("node:crypto");

const FORBIDDEN_KEYS = new Set([
  "prompt", "stem", "answer", "answerValue", "answerKey", "solution", "content",
  "rawText", "pageImage", "sourcePath", "filePath", "downloadUrl", "storageUrl"
]);

function clean(value) {
  return String(value == null ? "" : value).trim();
}

function normalizeText(value) {
  return clean(value)
    .normalize("NFKC")
    .toLocaleLowerCase("ko")
    .replace(/[·ㆍ・]/g, " ")
    .replace(/[()\[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stableId(prefix, parts) {
  const digest = crypto.createHash("sha256").update(parts.map(normalizeText).join("\u0000")).digest("hex").slice(0, 16).toUpperCase();
  return `${prefix}-${digest}`;
}

function stableConceptId(type) {
  return stableId("CPT", [type.course || type.semester, type.majorUnit, type.minorUnit, type.detailType, type.solutionArchetype]);
}

function canonicalKey(type) {
  return [
    normalizeText(type.course || type.semester),
    normalizeText(type.majorUnit),
    normalizeText(type.minorUnit),
    normalizeText(type.detailType)
  ].join("|");
}

const STOP_WORDS = new Set(["구하기", "찾기", "판별", "판단", "이용", "조건", "관계", "문제", "나타내기", "계산하기"]);

function tokens(value) {
  return new Set(normalizeText(value).split(/[^0-9a-z가-힣]+/u).filter(token => token.length >= 2 && !STOP_WORDS.has(token)));
}

function jaccard(left, right) {
  const a = tokens(left);
  const b = tokens(right);
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  a.forEach(token => { if (b.has(token)) intersection += 1; });
  return intersection / (a.size + b.size - intersection);
}

function characterBigrams(value) {
  const compact = normalizeText(value).replace(/[^0-9a-z가-힣]/gu, "");
  const grams = [];
  for (let index = 0; index < compact.length - 1; index += 1) grams.push(compact.slice(index, index + 2));
  return grams;
}

function dice(left, right) {
  const a = characterBigrams(left);
  const b = characterBigrams(right);
  if (!a.length || !b.length) return 0;
  const remaining = new Map();
  b.forEach(gram => remaining.set(gram, (remaining.get(gram) || 0) + 1));
  let intersection = 0;
  a.forEach(gram => {
    const count = remaining.get(gram) || 0;
    if (!count) return;
    intersection += 1;
    remaining.set(gram, count - 1);
  });
  return (2 * intersection) / (a.length + b.length);
}

function overlapScore(left, right) {
  const sameMajor = normalizeText(left.majorUnit) && normalizeText(left.majorUnit) === normalizeText(right.majorUnit);
  const sameMinor = normalizeText(left.minorUnit) && normalizeText(left.minorUnit) === normalizeText(right.minorUnit);
  const label = Math.max(jaccard(left.detailType, right.detailType), dice(left.detailType, right.detailType));
  const method = Math.max(jaccard(left.solutionArchetype, right.solutionArchetype), dice(left.solutionArchetype, right.solutionArchetype));
  return Math.min(1, (sameMajor ? 0.12 : 0) + (sameMinor ? 0.28 : 0) + label * 0.45 + method * 0.15);
}

function createConceptFamilies(sourceTypes) {
  const exactGroups = new Map();
  sourceTypes.filter(type => type.detailPrecision === "verified").forEach(type => {
    const key = canonicalKey(type);
    if (!exactGroups.has(key)) exactGroups.set(key, []);
    exactGroups.get(key).push(type);
  });
  return Array.from(exactGroups.values()).map(group => {
    const preferred = group.find(type => type.sourceBankId === "COMMON-TYPE-INDEX") || group[0];
    return {
      conceptFamilyId: stableConceptId(preferred),
      curriculum: {
        course: clean(preferred.course),
        semester: clean(preferred.semester),
        majorUnit: clean(preferred.majorUnit),
        minorUnit: clean(preferred.minorUnit)
      },
      canonicalLabel: clean(preferred.detailType),
      solutionArchetype: clean(preferred.solutionArchetype) || null,
      sourceTypes: group.map(type => ({
        sourceBankId: type.sourceBankId,
        sourceTypeId: type.sourceTypeId,
        sourceLabel: type.detailType,
        status: type.status
      })).sort((a, b) => `${a.sourceBankId}:${a.sourceTypeId}`.localeCompare(`${b.sourceBankId}:${b.sourceTypeId}`)),
      mergeStatus: group.length > 1 ? "exact_verified" : "single_source",
      evidence: group.flatMap(type => type.evidence || []).filter(Boolean)
    };
  }).sort((a, b) => a.conceptFamilyId.localeCompare(b.conceptFamilyId));
}

function createOverlapCandidates(families) {
  const candidates = [];
  for (let leftIndex = 0; leftIndex < families.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < families.length; rightIndex += 1) {
      const left = families[leftIndex];
      const right = families[rightIndex];
      if (normalizeText(left.curriculum.majorUnit) !== normalizeText(right.curriculum.majorUnit)) continue;
      const score = overlapScore({ ...left.curriculum, detailType: left.canonicalLabel, solutionArchetype: left.solutionArchetype }, {
        ...right.curriculum, detailType: right.canonicalLabel, solutionArchetype: right.solutionArchetype
      });
      if (score < 0.55) continue;
      candidates.push({
        candidateId: stableId("OVR", [left.conceptFamilyId, right.conceptFamilyId]),
        leftConceptFamilyId: left.conceptFamilyId,
        rightConceptFamilyId: right.conceptFamilyId,
        score: Number(score.toFixed(3)),
        status: "review_required",
        decision: null,
        reason: normalizeText(left.curriculum.minorUnit) === normalizeText(right.curriculum.minorUnit)
          ? "같은 단원에서 세부 유형 이름 또는 풀이 구조가 겹칠 가능성"
          : "같은 대단원 안에서 연결 개념일 가능성"
      });
    }
  }
  return candidates.sort((a, b) => b.score - a.score || a.candidateId.localeCompare(b.candidateId));
}

function walkForbidden(value, pointer, issues) {
  if (!value || typeof value !== "object") return;
  Object.entries(value).forEach(([key, child]) => {
    if (FORBIDDEN_KEYS.has(key)) issues.push(`forbidden:${pointer}/${key}`);
    walkForbidden(child, `${pointer}/${key}`, issues);
  });
}

module.exports = Object.freeze({
  FORBIDDEN_KEYS,
  clean,
  normalizeText,
  stableId,
  stableConceptId,
  canonicalKey,
  jaccard,
  dice,
  overlapScore,
  createConceptFamilies,
  createOverlapCandidates,
  walkForbidden
});
