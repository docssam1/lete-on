"use strict";

const fs = require("node:fs");
const path = require("node:path");
const packetBuilder = require("./build-hwangso-detail-packet-from-rules.cjs");

const SAFE_PART_KEYS = new Set(["schemaVersion", "sourceMemoryId", "title", "pageStart", "pageEnd", "itemReviews", "deferred"]);
const clean = value => String(value == null ? "" : value).trim();
const readJson = filePath => JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));

function mergeParts(queue, parts) {
  if (!Array.isArray(parts) || !parts.length) throw new Error("황소 세부유형 분할 검수표가 없습니다.");
  const first = parts[0];
  const sourceMemoryId = clean(first && first.sourceMemoryId);
  const title = clean(first && first.title);
  const itemReviews = [];
  const deferred = [];
  const seen = new Set();
  parts.forEach((part, partIndex) => {
    const prefix = `part.${partIndex + 1}`;
    if (!part || part.schemaVersion !== 1 || Object.keys(part).some(key => !SAFE_PART_KEYS.has(key))) throw new Error(`${prefix} 형식을 확인해 주세요.`);
    if (clean(part.sourceMemoryId) !== sourceMemoryId || clean(part.title) !== title) throw new Error(`${prefix} 원본 정보가 다릅니다.`);
    if (!Number.isInteger(Number(part.pageStart)) || !Number.isInteger(Number(part.pageEnd)) || Number(part.pageStart) > Number(part.pageEnd)) throw new Error(`${prefix} 쪽 범위를 확인해 주세요.`);
    if (!Array.isArray(part.itemReviews) || !Array.isArray(part.deferred)) throw new Error(`${prefix} 문항 목록을 확인해 주세요.`);
    [...part.itemReviews, ...part.deferred].forEach(entry => {
      const id = clean(entry && entry.sourceItemId);
      if (!id || seen.has(id)) throw new Error(`${prefix} 문항 ID가 없거나 중복됩니다: ${id}`);
      if (Number(entry.page) < Number(part.pageStart) || Number(entry.page) > Number(part.pageEnd)) throw new Error(`${prefix} 문항이 담당 쪽 범위를 벗어났습니다: ${id}`);
      seen.add(id);
    });
    itemReviews.push(...part.itemReviews);
    deferred.push(...part.deferred);
  });
  const order = (left, right) => Number(left.page) - Number(right.page) || Number(left.slot) - Number(right.slot) || clean(left.sourceItemId).localeCompare(clean(right.sourceItemId));
  const spec = { schemaVersion: 1, coverageMode: "complete_source", sourceMemoryId, title, itemReviews: itemReviews.sort(order), deferred: deferred.sort(order) };
  packetBuilder.buildPacket(queue, spec);
  return spec;
}

function main(args) {
  if (args.length < 3) throw new Error("사용법: node merge-hwangso-detail-rule-parts.cjs <작업대기열.json> <출력규칙.json> <분할검수1.json> [분할검수2.json ...]");
  const queue = readJson(args[0]);
  const spec = mergeParts(queue, args.slice(2).map(readJson));
  fs.mkdirSync(path.dirname(path.resolve(args[1])), { recursive: true });
  fs.writeFileSync(path.resolve(args[1]), `${JSON.stringify(spec, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ sourceMemoryId: spec.sourceMemoryId, reviewedItemCount: spec.itemReviews.length, deferredItemCount: spec.deferred.length })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ SAFE_PART_KEYS, mergeParts });
