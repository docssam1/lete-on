"use strict";

const fs = require("node:fs");
const path = require("node:path");
const core = require("./project-question-bank-core.cjs");

const SAFE_ITEM_REVIEW_KEYS = new Set([
  "sourceItemId",
  "detailType",
  "solutionArchetype",
  "classificationStatus",
  "detailPrecision",
  "evidenceLocator",
  "note"
]);
const SAFE_SOURCE_KEYS = new Set(["sourceMemoryId", "title", "itemReviews"]);

function clean(value) {
  return String(value == null ? "" : value).trim();
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function validatePacket(packet) {
  const issues = [];
  if (!packet || packet.schemaVersion !== 1 || !Array.isArray(packet.sources)) return ["packet.shape"];
  packet.sources.forEach((source, sourceIndex) => {
    const sourcePrefix = `source.${sourceIndex + 1}`;
    if (Object.keys(source || {}).some(key => !SAFE_SOURCE_KEYS.has(key))) issues.push(`${sourcePrefix}.unsafe_keys`);
    if (!clean(source.sourceMemoryId) || !clean(source.title) || !Array.isArray(source.itemReviews)) issues.push(`${sourcePrefix}.shape`);
    (source.itemReviews || []).forEach((review, reviewIndex) => {
      const prefix = `${sourcePrefix}.review.${reviewIndex + 1}`;
      const unknownKeys = Object.keys(review || {}).filter(key => !SAFE_ITEM_REVIEW_KEYS.has(key));
      if (unknownKeys.length) issues.push(`${prefix}.unsafe_keys`);
      if (!clean(review && review.sourceItemId)) issues.push(`${prefix}.item_id`);
      if (review && review.classificationStatus !== "reviewed_detail") issues.push(`${prefix}.status`);
      if (review && review.detailPrecision !== "verified") issues.push(`${prefix}.precision`);
      if (!clean(review && review.detailType) || !clean(review && review.solutionArchetype)) issues.push(`${prefix}.classification`);
      if (!clean(review && review.evidenceLocator)) issues.push(`${prefix}.evidence`);
      if (clean(review && review.detailType).length > 120 || clean(review && review.solutionArchetype).length > 240 || clean(review && review.evidenceLocator).length > 240 || clean(review && review.note).length > 240) issues.push(`${prefix}.length`);
    });
  });
  return Array.from(new Set(issues)).sort();
}

function buildReview(curriculumReviews, packets) {
  if (!curriculumReviews || curriculumReviews.sourceBankId !== "HWANGSO-MIDDLE" || !Array.isArray(curriculumReviews.reviews)) {
    throw new Error("황소 단원 검수표를 확인해 주세요.");
  }
  const curriculumByItemId = new Map(curriculumReviews.reviews.map(review => [review.sourceItemId, review]));
  const detailByItemId = new Map();

  packets.forEach((packet, packetIndex) => {
    const issues = validatePacket(packet);
    if (issues.length) throw new Error(`황소 세부유형 검수 묶음 ${packetIndex + 1}을 확인해 주세요: ${issues.join(", ")}`);
    packet.sources.forEach(source => {
      source.itemReviews.forEach(review => {
        const itemId = clean(review.sourceItemId);
        if (detailByItemId.has(itemId)) throw new Error(`황소 문항을 두 번 세부 검수했습니다: ${itemId}`);
        const curriculum = curriculumByItemId.get(itemId);
        if (!curriculum) throw new Error(`황소 단원 검수표에 없는 문항입니다: ${itemId}`);
        if (clean(curriculum.sourceMemoryId) !== clean(source.sourceMemoryId)) throw new Error(`황소 문항의 원본 자료가 다릅니다: ${itemId}`);
        if (curriculum.detailPrecision !== "unit_only" || curriculum.classificationStatus !== "reviewed_unit" || !curriculum.sourceUnitTypeId) {
          throw new Error(`단원까지 확인되지 않은 황소 문항은 세부유형으로 올릴 수 없습니다: ${itemId}`);
        }
        detailByItemId.set(itemId, { source, review });
      });
    });
  });

  const reviews = curriculumReviews.reviews.map(curriculum => {
    const matched = detailByItemId.get(curriculum.sourceItemId);
    if (!matched) {
      return {
        ...curriculum,
        sourceTypeId: curriculum.detailPrecision === "unit_only" ? curriculum.sourceUnitTypeId : null,
        detailType: curriculum.detailPrecision === "unit_only" ? curriculum.minorUnit : null,
        solutionArchetype: null
      };
    }
    const detailType = clean(matched.review.detailType);
    const solutionArchetype = clean(matched.review.solutionArchetype);
    return {
      ...curriculum,
      sourceTypeId: core.stableId("SH-TYP", [curriculum.semester, curriculum.majorUnit, curriculum.minorUnit, detailType, solutionArchetype]),
      detailType,
      solutionArchetype,
      classificationStatus: "reviewed_detail",
      detailPrecision: "verified",
      reviewReason: clean(matched.review.note) || "item_detail_visually_reviewed",
      evidence: Array.from(new Set([...(curriculum.evidence || []), `${curriculum.sourceMemoryId}:${clean(matched.review.evidenceLocator)}`]))
    };
  }).sort((left, right) => left.sourceItemId.localeCompare(right.sourceItemId));

  return {
    schemaVersion: 1,
    sourceBankId: "HWANGSO-MIDDLE",
    taxonomyVersion: "hwangso-middle-detail-v1",
    status: reviews.every(review => review.detailPrecision === "verified") ? "reviewed" : "review_in_progress",
    reviews,
    summary: {
      itemCount: reviews.length,
      reviewedDetailItemCount: reviews.filter(review => review.detailPrecision === "verified").length,
      unitOnlyItemCount: reviews.filter(review => review.detailPrecision === "unit_only").length,
      pendingItemCount: reviews.filter(review => review.detailPrecision === "pending").length,
      detailTypeCount: new Set(reviews.filter(review => review.detailPrecision === "verified").map(review => review.sourceTypeId)).size,
      reviewedSourceCount: new Set(Array.from(detailByItemId.values()).map(entry => entry.source.sourceMemoryId)).size
    }
  };
}

function loadConfig(config) {
  if (!config || !clean(config.curriculumReviews) || !Array.isArray(config.packets) || !config.packets.length) {
    throw new Error("황소 세부유형 빌드 설정을 확인해 주세요.");
  }
  return {
    curriculumReviews: readJson(config.curriculumReviews),
    packets: config.packets.map(readJson)
  };
}

function main(args) {
  if (args.length < 2) throw new Error("사용법: node build-hwangso-detail-review.cjs <설정.json> <출력.json> 또는 <단원검수표.json> <출력.json> <세부검수1.json> [세부검수2.json ...]");
  const inputs = args.length === 2
    ? loadConfig(readJson(args[0]))
    : { curriculumReviews: readJson(args[0]), packets: args.slice(2).map(readJson) };
  const output = buildReview(inputs.curriculumReviews, inputs.packets);
  fs.mkdirSync(path.dirname(path.resolve(args[1])), { recursive: true });
  fs.writeFileSync(path.resolve(args[1]), `${JSON.stringify(output, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(output.summary)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ SAFE_ITEM_REVIEW_KEYS, SAFE_SOURCE_KEYS, validatePacket, buildReview, loadConfig });
