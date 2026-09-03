"use strict";

const fs = require("node:fs");
const path = require("node:path");
const core = require("./dolpa-paper-placement-core.cjs");

function clean(value) {
  return String(value == null ? "" : value).trim();
}

function record(database, manifest) {
  const next = structuredClone(database);
  const rows = Array.isArray(manifest && manifest.papers) ? manifest.papers : [manifest];
  rows.forEach(item => {
    const paper = (next.papers || []).find(candidate => candidate.paperId === clean(item && item.paperId));
    if (!paper) throw new Error(`문항 DB에 없는 시험지입니다: ${clean(item && item.paperId)}`);
    const placementContext = core.normalize(item, paper.questionCount);
    if (paper.placementContext && JSON.stringify(paper.placementContext) !== JSON.stringify(placementContext)) {
      throw new Error(`기존 과정 위치 기록과 다릅니다. 자동으로 덮어쓰지 않습니다: ${paper.paperId}`);
    }
    paper.placementContext = placementContext;
  });
  const result = require("./audit-dolpa-question-db.cjs").audit(next);
  if (!result.ok) throw new Error(`문항 DB 검사가 실패했습니다: ${result.issues.join(", ")}`);
  return next;
}

function main(args) {
  if (args.length !== 2) throw new Error("사용법: node record-dolpa-paper-placement.cjs <question-db> <placement-manifest>");
  const databasePath = path.resolve(args[0]);
  const database = JSON.parse(fs.readFileSync(databasePath, "utf8"));
  const manifest = JSON.parse(fs.readFileSync(path.resolve(args[1]), "utf8"));
  const next = record(database, manifest);
  const temporaryPath = `${databasePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  fs.renameSync(temporaryPath, databasePath);
  process.stdout.write(`${JSON.stringify({ papers: (manifest.papers || [manifest]).length })}\n`);
}

module.exports = Object.freeze({ ...core, record });
if (require.main === module) main(process.argv.slice(2));
