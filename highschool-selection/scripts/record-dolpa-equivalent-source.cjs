"use strict";

const fs = require("node:fs");
const path = require("node:path");
const auditor = require("./audit-dolpa-question-db.cjs");

function clean(value) {
  return String(value == null ? "" : value).trim();
}

function normalize(database, ledger, manifest) {
  const paperId = clean(manifest && manifest.paperId);
  const sourceId = clean(manifest && manifest.sourceId);
  const evidenceId = clean(manifest && manifest.evidenceId);
  const pageCount = Number(manifest && manifest.pageCount);
  if (!paperId || !sourceId || !evidenceId) throw new Error("시험지·원본·비교 근거가 필요합니다.");
  if (!/^DP-SRC-[0-9A-F]{12}$/.test(sourceId)) throw new Error(`원본 ID를 확인해 주세요: ${sourceId}`);
  if (!Number.isSafeInteger(pageCount) || pageCount < 1) throw new Error("비교한 페이지 수를 확인해 주세요.");
  const paper = (database.papers || []).find(item => item.paperId === paperId);
  if (!paper) throw new Error(`문항 DB에 없는 시험지입니다: ${paperId}`);
  const source = (ledger.sources || []).find(item => item.sourceId === sourceId);
  if (!source) throw new Error(`작업 장부에 없는 원본입니다: ${sourceId}`);
  if (paper.sourceId === sourceId) throw new Error("대표 원본은 같은 시험의 다른 파일로 다시 연결하지 않습니다.");
  const primaryOwner = (database.papers || []).find(item => item.sourceId === sourceId);
  if (primaryOwner) throw new Error(`이미 다른 시험지의 대표 원본입니다: ${primaryOwner.paperId}`);
  return {
    paper,
    record: {
      sourceId,
      sourceFingerprint: source.sourceFingerprint,
      relation: "same_question_content_revision",
      pageCount,
      status: "verified",
      evidence: [evidenceId],
      note: clean(manifest.note) || null
    }
  };
}

function identity(value) {
  return JSON.stringify(value);
}

function record(database, ledger, manifest) {
  const next = structuredClone(database);
  const normalized = normalize(next, ledger, manifest);
  const owner = (next.papers || []).find(paper => (paper.equivalentSources || []).some(item => item.sourceId === normalized.record.sourceId));
  if (owner && owner.paperId !== normalized.paper.paperId) {
    throw new Error(`같은 원본이 다른 시험지에 이미 연결돼 있습니다: ${owner.paperId}`);
  }
  normalized.paper.equivalentSources = normalized.paper.equivalentSources || [];
  const existing = normalized.paper.equivalentSources.find(item => item.sourceId === normalized.record.sourceId);
  if (existing) {
    if (identity(existing) !== identity(normalized.record)) throw new Error("기존 동일 원본 연결과 다릅니다. 자동으로 덮어쓰지 않습니다.");
    return { database: next, changed: false };
  }
  normalized.paper.equivalentSources.push(normalized.record);
  normalized.paper.equivalentSources.sort((a, b) => a.sourceId.localeCompare(b.sourceId));
  const result = auditor.audit(next);
  if (!result.ok) throw new Error(`문항 DB 검사가 실패했습니다: ${result.issues.join(", ")}`);
  return { database: next, changed: true };
}

function main(args) {
  if (args.length !== 3) throw new Error("사용법: node record-dolpa-equivalent-source.cjs <question-db> <work-ledger> <manifest>");
  const databasePath = path.resolve(args[0]);
  const database = JSON.parse(fs.readFileSync(databasePath, "utf8"));
  const ledger = JSON.parse(fs.readFileSync(path.resolve(args[1]), "utf8"));
  const manifest = JSON.parse(fs.readFileSync(path.resolve(args[2]), "utf8"));
  const result = record(database, ledger, manifest);
  if (result.changed) {
    const temporaryPath = `${databasePath}.tmp-${process.pid}`;
    fs.writeFileSync(temporaryPath, `${JSON.stringify(result.database, null, 2)}\n`, "utf8");
    fs.renameSync(temporaryPath, databasePath);
  }
  process.stdout.write(`${JSON.stringify({ changed: result.changed, paperId: manifest.paperId, sourceId: manifest.sourceId })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ normalize, record });
