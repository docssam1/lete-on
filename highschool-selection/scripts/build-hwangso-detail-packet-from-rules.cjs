"use strict";

const fs = require("node:fs");
const path = require("node:path");

const SAFE_RULE_KEYS = new Set(["sourceItemId", "page", "slot", "detailType", "solutionArchetype"]);
const SAFE_DEFERRED_KEYS = new Set(["sourceItemId", "page", "slot", "reason"]);
const clean = value => String(value == null ? "" : value).trim();
const locatorKey = value => `${Number(value && value.page)}:${Number(value && value.slot)}`;

function readJson(filePath) { return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8")); }

function validateRules(spec) {
  const issues = [];
  if (!spec || spec.schemaVersion !== 1 || spec.coverageMode !== "complete_source") return ["rules.shape"];
  if (!clean(spec.sourceMemoryId) || !clean(spec.title)) issues.push("rules.source");
  if (!Array.isArray(spec.itemReviews) || !Array.isArray(spec.deferred)) issues.push("rules.lists");
  const seen = new Set();
  (spec.itemReviews || []).forEach((review, index) => {
    const prefix = `review.${index + 1}`;
    if (Object.keys(review || {}).some(key => !SAFE_RULE_KEYS.has(key))) issues.push(`${prefix}.unsafe_keys`);
    if (!clean(review && review.sourceItemId)) issues.push(`${prefix}.item_id`);
    if (!Number.isInteger(Number(review && review.page)) || Number(review.page) < 1 || !Number.isInteger(Number(review && review.slot)) || Number(review.slot) < 1) issues.push(`${prefix}.locator`);
    if (!clean(review && review.detailType) || !clean(review && review.solutionArchetype)) issues.push(`${prefix}.classification`);
    if (clean(review && review.detailType).length > 120 || clean(review && review.solutionArchetype).length > 240) issues.push(`${prefix}.length`);
    if (seen.has(clean(review && review.sourceItemId))) issues.push(`${prefix}.duplicate`);
    seen.add(clean(review && review.sourceItemId));
  });
  (spec.deferred || []).forEach((deferred, index) => {
    const prefix = `deferred.${index + 1}`;
    if (Object.keys(deferred || {}).some(key => !SAFE_DEFERRED_KEYS.has(key))) issues.push(`${prefix}.unsafe_keys`);
    if (!clean(deferred && deferred.sourceItemId)) issues.push(`${prefix}.item_id`);
    if (!Number.isInteger(Number(deferred && deferred.page)) || Number(deferred.page) < 1 || !Number.isInteger(Number(deferred && deferred.slot)) || Number(deferred.slot) < 1) issues.push(`${prefix}.locator`);
    if (!clean(deferred && deferred.reason)) issues.push(`${prefix}.reason`);
    if (clean(deferred && deferred.reason).length > 600) issues.push(`${prefix}.length`);
    if (seen.has(clean(deferred && deferred.sourceItemId))) issues.push(`${prefix}.duplicate`);
    seen.add(clean(deferred && deferred.sourceItemId));
  });
  return Array.from(new Set(issues)).sort();
}

function sourceJobs(queue, sourceMemoryId) {
  const source = Array.isArray(queue && queue.sources) && queue.sources.find(entry => clean(entry.sourceMemoryId) === clean(sourceMemoryId));
  if (!source || !Array.isArray(source.jobs)) throw new Error(`황소 세부 검수 대기열에서 원본을 찾지 못했습니다: ${sourceMemoryId}`);
  return source.jobs;
}

function buildPacket(queue, spec) {
  const issues = validateRules(spec);
  if (issues.length) throw new Error(`황소 세부유형 규칙을 확인해 주세요: ${issues.join(", ")}`);
  const jobs = sourceJobs(queue, spec.sourceMemoryId);
  const jobById = new Map(jobs.map(job => [clean(job.sourceItemId), job]));
  if (jobById.size !== jobs.length) throw new Error("황소 세부 검수 대기열에 문항 ID가 중복됩니다.");
  const allRules = [...spec.itemReviews, ...spec.deferred];
  if (allRules.length !== jobs.length) throw new Error(`황소 원본 전체 규칙 수가 다릅니다: queue ${jobs.length}, rules ${allRules.length}`);
  allRules.forEach(rule => {
    const job = jobById.get(clean(rule.sourceItemId));
    if (!job) throw new Error(`대기열에 없는 황소 문항 규칙입니다: ${rule.sourceItemId}`);
    if (locatorKey(job.locator) !== locatorKey(rule)) throw new Error(`황소 문항 위치가 대기열과 다릅니다: ${rule.sourceItemId}`);
  });
  const itemReviews = spec.itemReviews.map(review => ({
    sourceItemId: clean(review.sourceItemId),
    detailType: clean(review.detailType),
    solutionArchetype: clean(review.solutionArchetype),
    classificationStatus: "reviewed_detail",
    detailPrecision: "verified",
    evidenceLocator: `PDF p.${Number(review.page)}, slot ${Number(review.slot)}`,
    note: "원본 PDF의 해당 문항 영역을 직접 보고 문제 조건과 요구값을 확인함."
  }));
  const deferred = spec.deferred.map(entry => ({
    sourceItemId: clean(entry.sourceItemId),
    evidenceLocator: `PDF p.${Number(entry.page)}, slot ${Number(entry.slot)}`,
    reason: clean(entry.reason)
  }));
  return { schemaVersion: 1, sources: [{ sourceMemoryId: clean(spec.sourceMemoryId), title: clean(spec.title), itemReviews }], deferred };
}

function main(args) {
  if (args.length !== 3) throw new Error("사용법: node build-hwangso-detail-packet-from-rules.cjs <작업대기열.json> <검수규칙.json> <출력.json>");
  const packet = buildPacket(readJson(args[0]), readJson(args[1]));
  fs.mkdirSync(path.dirname(path.resolve(args[2])), { recursive: true });
  fs.writeFileSync(path.resolve(args[2]), `${JSON.stringify(packet, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ sourceMemoryId: packet.sources[0].sourceMemoryId, reviewedItemCount: packet.sources[0].itemReviews.length, deferredItemCount: packet.deferred.length })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ SAFE_RULE_KEYS, SAFE_DEFERRED_KEYS, validateRules, sourceJobs, buildPacket });
