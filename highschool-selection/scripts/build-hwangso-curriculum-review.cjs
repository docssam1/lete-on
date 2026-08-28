"use strict";

const fs = require("node:fs");
const path = require("node:path");
const core = require("./project-question-bank-core.cjs");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function clean(value) {
  return String(value == null ? "" : value).trim();
}

function activeItems(index) {
  const activeIds = new Set((index.activeQuestionCandidates || []).map(item => typeof item === "string" ? item : item.id));
  const rejectedIds = new Set((index.rejectedCandidates || []).map(item => typeof item === "string" ? item : item.id));
  return activeIds.size
    ? (index.items || []).filter(item => activeIds.has(item.id))
    : (index.items || []).filter(item => item.releaseStatus === "locked" && !rejectedIds.has(item.id) && item.discoveryStatus !== "rejected");
}

function validateSourceMap(source) {
  const issues = [];
  if (!clean(source.sourceMemoryId) || !clean(source.title) || !clean(source.course)) issues.push("source_identity");
  const ranges = Array.isArray(source.pageRanges) ? source.pageRanges : [];
  if (!ranges.length) issues.push("page_ranges");
  ranges.forEach((range, index) => {
    const prefix = `range_${index + 1}`;
    if (!Number.isSafeInteger(range.pageStart) || !Number.isSafeInteger(range.pageEnd) || range.pageStart < 1 || range.pageEnd < range.pageStart) issues.push(`${prefix}_pages`);
    if (!["reviewed", "pending"].includes(range.status)) issues.push(`${prefix}_status`);
    if (range.status === "reviewed" && (!clean(range.majorUnit) || !clean(range.minorUnit) || !clean(range.evidenceLocator))) issues.push(`${prefix}_classification`);
    if (range.status === "pending" && (!clean(range.note) || !clean(range.evidenceLocator))) issues.push(`${prefix}_pending_reason`);
  });
  const sorted = ranges.slice().sort((left, right) => left.pageStart - right.pageStart || left.pageEnd - right.pageEnd);
  for (let index = 1; index < sorted.length; index += 1) {
    if (sorted[index].pageStart <= sorted[index - 1].pageEnd) issues.push("overlapping_ranges");
  }
  return Array.from(new Set(issues)).sort();
}

function buildReview(index, packets) {
  const sources = packets.flatMap(packet => packet.sources || []);
  const sourceMapByMemoryId = new Map();
  sources.forEach(source => {
    if (sourceMapByMemoryId.has(source.sourceMemoryId)) throw new Error(`황소 자료가 두 검수표에 있습니다: ${source.sourceMemoryId}`);
    const issues = validateSourceMap(source);
    if (issues.length) throw new Error(`황소 자료 범위표를 확인해 주세요: ${source.sourceMemoryId}: ${issues.join(", ")}`);
    sourceMapByMemoryId.set(source.sourceMemoryId, source);
  });
  const memoryIdBySourceRef = new Map((index.sources || []).map(source => [source.sourceRef, source.privateSourceMemoryId]));
  const reviews = activeItems(index).map(item => {
    const sourceMemoryId = memoryIdBySourceRef.get(item.sourceRef);
    const source = sourceMapByMemoryId.get(sourceMemoryId);
    if (!source) throw new Error(`황소 자료 범위표가 없습니다: ${sourceMemoryId || item.sourceRef}`);
    const page = Number(item.locator && item.locator.page);
    const matches = source.pageRanges.filter(range => page >= range.pageStart && page <= range.pageEnd);
    if (matches.length !== 1) throw new Error(`황소 문항 페이지가 한 범위에 연결되지 않습니다: ${item.id}: ${page}`);
    const range = matches[0];
    const reviewed = range.status === "reviewed";
    return {
      sourceItemId: item.id,
      sourceMemoryId,
      sourceRef: item.sourceRef,
      sourceUnitTypeId: reviewed ? core.stableId("SH-UNT", [source.course, range.majorUnit, range.minorUnit]) : null,
      semester: clean(source.course),
      majorUnit: reviewed ? clean(range.majorUnit) : null,
      minorUnit: reviewed ? clean(range.minorUnit) : null,
      classificationStatus: reviewed ? "reviewed_unit" : "pending",
      detailPrecision: reviewed ? "unit_only" : "pending",
      reviewReason: reviewed ? "page_range_reviewed" : clean(range.note),
      evidence: clean(range.evidenceLocator) ? [`${sourceMemoryId}:${clean(range.evidenceLocator)}`] : []
    };
  }).sort((left, right) => left.sourceItemId.localeCompare(right.sourceItemId));
  return {
    schemaVersion: 1,
    sourceBankId: "HWANGSO-MIDDLE",
    status: reviews.every(review => review.detailPrecision === "unit_only") ? "reviewed_unit" : "review_in_progress",
    reviews,
    summary: {
      sourceCount: sourceMapByMemoryId.size,
      itemCount: reviews.length,
      unitReviewedItemCount: reviews.filter(review => review.detailPrecision === "unit_only").length,
      pendingItemCount: reviews.filter(review => review.detailPrecision === "pending").length,
      pendingReasonCount: new Set(reviews.filter(review => review.detailPrecision === "pending").map(review => review.reviewReason)).size,
      unitTypeCount: new Set(reviews.filter(review => review.sourceUnitTypeId).map(review => review.sourceUnitTypeId)).size
    }
  };
}

function main(args) {
  if (args.length < 3) throw new Error("사용법: node build-hwangso-curriculum-review.cjs <황소인덱스.json> <출력.json> <범위표1.json> [범위표2.json ...]");
  const index = readJson(args[0]);
  const output = buildReview(index, args.slice(2).map(readJson));
  fs.mkdirSync(path.dirname(path.resolve(args[1])), { recursive: true });
  fs.writeFileSync(path.resolve(args[1]), `${JSON.stringify(output, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(output.summary)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ activeItems, validateSourceMap, buildReview });
