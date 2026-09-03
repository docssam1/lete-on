"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { stableTypeId } = require("./build-dolpa-work-ledger.cjs");
const { CROSSWALK_SCHEMA } = require("./import-dolpa-full-source-audit.cjs");

function clean(value) {
  return String(value == null ? "" : value).trim();
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function writeJson(filePath, value) {
  const output = path.resolve(filePath);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  return output;
}

function canonicalFromItem(item) {
  const proposed = item.proposedNewType || {};
  return {
    semester: clean(proposed.semester) || clean(item.auditClassification && item.auditClassification.semester),
    unit: clean(proposed.minorUnit) || clean(item.auditClassification && item.auditClassification.unit),
    typeLabel: clean(proposed.label) || clean(item.auditClassification && item.auditClassification.fineType),
    solutionArchetype: clean(proposed.solutionArchetype) || clean(item.solutionStructure),
    methodTags: Array.isArray(proposed.methodTags) ? proposed.methodTags.map(clean).filter(Boolean) : []
  };
}

function prepare(review, sourceId, priorSharedGroups = new Map()) {
  if (!["dolpa-type-crosswalk-review/v1", "highselect-dolpa-type-crosswalk-review/v1"].includes(review.schemaVersion)) {
    throw new Error("교차검수 JSON 버전을 확인해 주세요.");
  }
  const singleSource = review.schemaVersion === "highselect-dolpa-type-crosswalk-review/v1";
  const rows = review.items.filter(item => singleSource ? review.sourceId === sourceId : item.sourceId === sourceId)
    .sort((a, b) => (a.questionNumber || a.number) - (b.questionNumber || b.number));
  if (rows.length !== 30 || rows.some((item, index) => Number(item.questionNumber || item.number) !== index + 1)) {
    throw new Error(`${sourceId}의 30문항 교차검수 결과가 필요합니다.`);
  }
  const items = rows.map(item => {
    const number = Number(item.questionNumber || item.number);
    const canonical = singleSource ? item.canonical : canonicalFromItem(item);
    const group = clean(item.proposedNewTypeGroup);
    const reuse = singleSource ? item.importerDecision === "reuse" : item.decision === "confirmed_reuse";
    if (reuse) {
      const reuseTypeId = clean(item.candidateTypeId || item.proposedReuseTypeId)
        || stableTypeId(canonical.semester, canonical.unit, canonical.typeLabel);
      return {
        number,
        decision: "reuse",
        typeId: reuseTypeId,
        expectedSolutionArchetype: clean(canonical && canonical.solutionArchetype) || clean(item.solutionStructure),
        reason: clean(item.reason || item.rationale)
      };
    }
    if (group && priorSharedGroups.has(group)) {
      return {
        number,
        decision: "reuse",
        typeId: priorSharedGroups.get(group).typeId,
        expectedSolutionArchetype: priorSharedGroups.get(group).solutionArchetype,
        reason: `앞서 검수한 공동 신규 유형 ${group}와 같은 학기·단원·풀이 구조로 확인했다.`
      };
    }
    return {
      number,
      decision: "new",
      canonical,
      reviewDisposition: item.decision,
      ...(group ? { proposedNewTypeGroup: group } : {}),
      reason: clean(item.reason || item.rationale)
    };
  });
  const sharedGroups = new Map(priorSharedGroups);
  items.forEach(item => {
    if (item.decision !== "new" || !item.proposedNewTypeGroup) return;
    sharedGroups.set(item.proposedNewTypeGroup, {
      typeId: stableTypeId(item.canonical.semester, item.canonical.unit, item.canonical.typeLabel),
      solutionArchetype: item.canonical.solutionArchetype
    });
  });
  return {
    crosswalk: {
      schemaVersion: CROSSWALK_SCHEMA,
      sourceId,
      generatedFrom: "dolpa-type-crosswalk-review/v1",
      items
    },
    sharedGroups
  };
}

function main(args) {
  if (args.length < 3) {
    throw new Error("사용법: node prepare-dolpa-import-crosswalks.cjs <combined-review> <output-dir> <source-id> [source-id ...]");
  }
  const review = readJson(args[0]);
  const outputDir = path.resolve(args[1]);
  let sharedGroups = new Map();
  const outputs = [];
  args.slice(2).forEach(sourceId => {
    const prepared = prepare(review, sourceId, sharedGroups);
    sharedGroups = prepared.sharedGroups;
    const suffix = sourceId.slice(-4).toLowerCase();
    outputs.push(writeJson(path.join(outputDir, `dp-${suffix}-import-crosswalk-v1.json`), prepared.crosswalk));
  });
  process.stdout.write(`${JSON.stringify({ outputs, sharedGroups: Array.from(sharedGroups.entries()) }, null, 2)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ canonicalFromItem, prepare });
