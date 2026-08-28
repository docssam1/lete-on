"use strict";

const fs = require("node:fs");
const path = require("node:path");
const auditor = require("./audit-dolpa-question-db.cjs");

const COVERAGE_KINDS = Object.freeze(["full_range", "mid_unit_cutoff", "mixed_range"]);

function clean(value) {
  return String(value == null ? "" : value).trim();
}

function normalize(item) {
  const paperId = clean(item && item.paperId);
  const evidenceId = clean(item && item.evidenceId);
  const coverageKind = clean(item && item.coverageKind);
  const declaredScopeLabel = clean(item && item.declaredScopeLabel);
  const observedTerminal = item && item.observedTerminal;
  if (!paperId) throw new Error("paperId가 필요합니다.");
  if (!evidenceId) throw new Error(`${paperId}의 범위 확인 근거가 필요합니다.`);
  if (!COVERAGE_KINDS.includes(coverageKind)) throw new Error(`${paperId}의 범위 형태를 확인해 주세요.`);
  if (!declaredScopeLabel) throw new Error(`${paperId}의 표시 범위가 필요합니다.`);
  if (!observedTerminal || !clean(observedTerminal.semester) || !clean(observedTerminal.unit)) {
    throw new Error(`${paperId}의 실제 마지막 학기·단원이 필요합니다.`);
  }
  return {
    coverageKind,
    declaredScopeLabel,
    observedTerminal: {
      semester: clean(observedTerminal.semester),
      unit: clean(observedTerminal.unit)
    },
    status: "verified",
    evidence: [evidenceId],
    note: clean(item.note) || null
  };
}

function record(database, manifest) {
  const next = structuredClone(database);
  const rows = Array.isArray(manifest && manifest.papers) ? manifest.papers : [manifest];
  rows.forEach(item => {
    const paper = (next.papers || []).find(candidate => candidate.paperId === clean(item && item.paperId));
    if (!paper) throw new Error(`문항 DB에 없는 시험지입니다: ${clean(item && item.paperId)}`);
    const coverage = normalize(item);
    if (paper.coverage && JSON.stringify(paper.coverage) !== JSON.stringify(coverage)) {
      throw new Error(`기존 범위 기록과 다릅니다. 자동으로 덮어쓰지 않습니다: ${paper.paperId}`);
    }
    paper.coverage = coverage;
  });
  const result = auditor.audit(next);
  if (!result.ok) throw new Error(`문항 DB 검사가 실패했습니다: ${result.issues.join(", ")}`);
  return next;
}

function main(args) {
  if (args.length !== 2) throw new Error("사용법: node record-dolpa-paper-coverage.cjs <question-db> <coverage-manifest>");
  const databasePath = path.resolve(args[0]);
  const database = JSON.parse(fs.readFileSync(databasePath, "utf8"));
  const manifest = JSON.parse(fs.readFileSync(path.resolve(args[1]), "utf8"));
  const next = record(database, manifest);
  const temporaryPath = `${databasePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  fs.renameSync(temporaryPath, databasePath);
  process.stdout.write(`${JSON.stringify({ papers: (manifest.papers || [manifest]).length })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ COVERAGE_KINDS, normalize, record });
