"use strict";

const fs = require("node:fs");
const path = require("node:path");
const core = require("./project-question-bank-core.cjs");

const REVIEW_STATUSES = new Set(["reviewed", "pending"]);

function clean(value) {
  return String(value == null ? "" : value).trim();
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function semesterForRecord(record) {
  const explicit = clean(record.semester);
  if (explicit) return explicit;
  if (clean(record.sectionId) === "ALG") return "중1-1";
  if (clean(record.sectionId) === "GEO") return "중1-2";
  return "중1";
}

function validateMethodCatalog(catalog) {
  const issues = [];
  if (!catalog || catalog.schemaVersion !== 1 || !catalog.methods || typeof catalog.methods !== "object" || Array.isArray(catalog.methods)) {
    return ["method_catalog.shape"];
  }
  Object.entries(catalog.methods).forEach(([method, entry]) => {
    const prefix = `method.${method}`;
    if (!clean(method)) issues.push(`${prefix}.id`);
    if (!entry || !REVIEW_STATUSES.has(entry.status)) issues.push(`${prefix}.status`);
    if (entry && entry.status === "reviewed" && (!clean(entry.detailType) || !clean(entry.solutionArchetype))) issues.push(`${prefix}.classification`);
    if (entry && (!Array.isArray(entry.evidence) || !entry.evidence.length)) issues.push(`${prefix}.evidence`);
  });
  return Array.from(new Set(issues)).sort();
}

function buildReview(inputs) {
  const methodCatalog = inputs.methodCatalog;
  const issues = validateMethodCatalog(methodCatalog);
  if (issues.length) throw new Error(`원수학 세부유형 방법표를 확인해 주세요: ${issues.join(", ")}`);
  const seenSourceItems = new Set();
  const reviews = [];
  const usedMethods = new Set();

  (inputs.rounds || []).forEach((round, roundIndex) => {
    const roundNumber = Number(round.round || roundIndex + 1);
    if (!Number.isSafeInteger(roundNumber) || roundNumber < 1) throw new Error("원수학 회차 번호를 확인해 주세요.");
    const records = Array.isArray(round.audit && round.audit.records) ? round.audit.records : [];
    const manifestItems = new Map(((round.manifest && round.manifest.items) || []).map(item => [Number(item.examNumber), item]));
    records.forEach(record => {
      const examNumber = Number(record.examNumber);
      const manifest = manifestItems.get(examNumber);
      if (!manifest || clean(manifest.majorUnit) !== clean(record.majorUnit) || clean(manifest.minorUnit) !== clean(record.minorUnit) || clean(manifest.typeId) !== clean(record.typeId)) {
        throw new Error(`원수학 ${roundNumber}회 ${examNumber}번의 감사 기록과 구성표가 다릅니다.`);
      }
      const sourceItemId = `R${String(roundNumber).padStart(2, "0")}-Q${String(examNumber).padStart(2, "0")}`;
      if (seenSourceItems.has(sourceItemId)) throw new Error(`원수학 문항 ID가 중복됩니다: ${sourceItemId}`);
      seenSourceItems.add(sourceItemId);
      const method = clean(record.answer && record.answer.verificationMethod);
      const methodReview = methodCatalog.methods[method];
      if (!methodReview) throw new Error(`원수학 풀이법 분류가 없습니다: ${method}`);
      usedMethods.add(method);
      const reviewed = methodReview.status === "reviewed";
      const detailType = reviewed ? clean(methodReview.detailType) : clean(record.minorUnit);
      const solutionArchetype = reviewed ? clean(methodReview.solutionArchetype) : null;
      const semester = semesterForRecord(record);
      const sourceTypeId = reviewed ? core.stableId("WM-TYP", [semester, record.majorUnit, record.minorUnit, detailType, solutionArchetype]) : clean(record.typeId);
      reviews.push({
        sourceItemId,
        sourceUnitTypeId: clean(record.typeId),
        sourceTypeId,
        semester,
        majorUnit: clean(record.majorUnit),
        minorUnit: clean(record.minorUnit),
        detailType,
        solutionArchetype,
        detailPrecision: reviewed ? "verified" : "unit_only",
        classificationStatus: reviewed ? "reviewed" : "verified_unit_only",
        difficultyBand: clean(record.difficultyBand),
        evidence: Array.from(new Set([`wm-audit:${sourceItemId}`, `method:${method}`, ...(methodReview.evidence || [])]))
      });
    });
  });

  const unusedMethods = Object.keys(methodCatalog.methods).filter(method => !usedMethods.has(method)).sort();
  if (unusedMethods.length) throw new Error(`원수학 풀이법 방법표에 사용하지 않는 항목이 있습니다: ${unusedMethods.join(", ")}`);
  const output = {
    schemaVersion: 1,
    sourceBankId: "WONMATH-M21",
    taxonomyVersion: clean(methodCatalog.taxonomyVersion) || "wm-m21-detail-v1",
    status: reviews.every(review => review.detailPrecision === "verified") ? "reviewed" : "review_in_progress",
    reviews: reviews.sort((left, right) => left.sourceItemId.localeCompare(right.sourceItemId)),
    summary: {
      itemCount: reviews.length,
      reviewedItemCount: reviews.filter(review => review.detailPrecision === "verified").length,
      unitOnlyItemCount: reviews.filter(review => review.detailPrecision === "unit_only").length,
      detailTypeCount: new Set(reviews.filter(review => review.detailPrecision === "verified").map(review => review.sourceTypeId)).size,
      methodCount: usedMethods.size
    }
  };
  return output;
}

function loadInputs(config) {
  return {
    methodCatalog: readJson(config.methodCatalog),
    rounds: (config.rounds || []).map(round => ({
      round: round.round,
      audit: readJson(round.audit),
      manifest: readJson(round.manifest)
    }))
  };
}

function main(args) {
  if (args.length !== 2) throw new Error("사용법: node build-wonmath-detail-review.cjs <입력설정.json> <출력.json>");
  const output = buildReview(loadInputs(readJson(args[0])));
  fs.mkdirSync(path.dirname(path.resolve(args[1])), { recursive: true });
  fs.writeFileSync(path.resolve(args[1]), `${JSON.stringify(output, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(output.summary)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ REVIEW_STATUSES, semesterForRecord, validateMethodCatalog, buildReview, loadInputs });
