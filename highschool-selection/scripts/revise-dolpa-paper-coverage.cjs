"use strict";

const fs = require("node:fs");
const path = require("node:path");
const coverageCore = require("./record-dolpa-paper-coverage.cjs");

function clean(value) {
  return String(value == null ? "" : value).trim();
}

function revise(database, manifest) {
  const next = structuredClone(database);
  const paperId = clean(manifest && manifest.paperId);
  const paper = (next.papers || []).find(item => item.paperId === paperId);
  if (!paper) throw new Error(`문항 DB에 없는 시험지입니다: ${paperId}`);
  if (!manifest.expectedCurrentCoverage || JSON.stringify(paper.coverage) !== JSON.stringify(manifest.expectedCurrentCoverage)) {
    throw new Error(`예상한 기존 범위 기록과 다릅니다. 자동으로 고치지 않습니다: ${paperId}`);
  }
  const replacement = coverageCore.normalize({ paperId, ...(manifest.replacement || {}) });
  paper.coverage = replacement;
  const result = require("./audit-dolpa-question-db.cjs").audit(next);
  if (!result.ok) throw new Error(`문항 DB 검사가 실패했습니다: ${result.issues.join(", ")}`);
  return next;
}

function main(args) {
  if (args.length !== 2) throw new Error("사용법: node revise-dolpa-paper-coverage.cjs <question-db> <revision-manifest>");
  const databasePath = path.resolve(args[0]);
  const database = JSON.parse(fs.readFileSync(databasePath, "utf8"));
  const manifest = JSON.parse(fs.readFileSync(path.resolve(args[1]), "utf8"));
  const next = revise(database, manifest);
  const temporaryPath = `${databasePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  fs.renameSync(temporaryPath, databasePath);
  process.stdout.write(`${JSON.stringify({ paperId: manifest.paperId, revised: true })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ revise });
