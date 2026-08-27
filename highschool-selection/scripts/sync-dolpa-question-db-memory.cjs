"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function fingerprint(filePath) {
  const bytes = fs.readFileSync(path.resolve(filePath));
  const stat = fs.statSync(path.resolve(filePath), { bigint: true });
  return {
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    size: Number(stat.size),
    mtime_ns: Number(stat.mtimeNs)
  };
}

function upsert(list, id, value) {
  const index = list.findIndex(item => item.id === id);
  if (index >= 0) list[index] = value;
  else list.push(value);
}

function source(id, title, relativePath, filePath) {
  return { id, title, path: relativePath, kind: "json", sensitivity: "private", ...fingerprint(filePath) };
}

function sync(catalog, ledger, database, paths) {
  if (ledger.schemaVersion !== 1 || database.schemaVersion !== 1) throw new Error("작업 장부 또는 문항 DB 버전을 확인해 주세요.");
  const sources = [
    source("dp-work-ledger-v1", "돌파 원본 작업 장부", "지필드메모리/highschool-selection/question-bank/dolpa-work-ledger-v1.json", paths.ledger),
    source("dp-question-db-v1", "돌파 문항 DB", "지필드메모리/highschool-selection/question-bank/dolpa-question-db-v1.json", paths.database),
    source("dp-paper-links-v1", "돌파 대표 시험지 원본 연결", "지필드메모리/highschool-selection/question-bank/dolpa-paper-links-v1.json", paths.paperLinks),
    source("dp-review-decisions-v1", "돌파 검수 결정 기록", "지필드메모리/highschool-selection/question-bank/dolpa-review-decisions-v1.json", paths.reviewDecisions)
  ];
  sources.forEach(item => upsert(catalog.sources, item.id, item));
  const summary = database.summary;
  upsert(catalog.records, "dp.question-db.20260827", {
    id: "dp.question-db.20260827",
    title: "돌파 문항 DB와 반복 방지 작업 장부",
    aliases: ["돌파 문제 DB", "돌파 유형 DB"],
    tags: ["dp", "question-bank", "classification", "work-ledger"],
    summary: `돌파 고유 원본 ${ledger.summary.sourceCount}개를 sourceId로 관리하고, PDF 완료 ${ledger.summary.convertedSourceCount}개와 표지 확인 ${ledger.summary.coverVerifiedSourceCount}개를 이어받는다. 현재 문항 DB는 대표 시험지 ${summary.paperCount}회, ${summary.questionCount}문항, 세부 유형 ${summary.typeCount}개이며 학년·영역·단원·세부 유형 ${summary.classificationVerifiedCount}문항이 확정됐다. 시험형은 돌파·생수·원수학 기본·원수학 듀얼·이든·황소·깊은생각을 분리하며, 돌파 원본 외 사용은 호환성 검수 전 후보 상태다. 풀이법·난이도·답안·유사문항은 별도 근거가 있어야 확정한다.`,
    status: "verified",
    sensitivity: "private",
    updated: "2026-08-27",
    pointers: [
      { source_id: "dp-question-db-v1", role: "audit", locator: "summary, papers, typeCatalog, questions", note: "문항 ID·유형 ID·중복·금지 필드 자동검사 통과" },
      { source_id: "dp-work-ledger-v1", role: "test", locator: "summary, sources[1:334]", note: "변환·표지·본문·답안·문항분리·유형·난이도·분석지 상태 분리" },
      { source_id: "dp-paper-links-v1", role: "decision", locator: "links", note: "대표 시험지와 원본 sourceId 연결" },
      { source_id: "dp-review-decisions-v1", role: "decision", locator: "rangeReviews, sourceReviews", note: "이미 끝낸 검수를 다시 하지 않기 위한 결정 기록" }
    ]
  });
  catalog.updated = "2026-08-27";
  return catalog;
}

function main(args) {
  if (args.length !== 5) throw new Error("사용법: node sync-dolpa-question-db-memory.cjs <source-memory> <ledger> <question-db> <paper-links> <review-decisions>");
  const [catalogPath, ledgerPath, databasePath, paperLinksPath, reviewDecisionsPath] = args.map(value => path.resolve(value));
  const catalog = sync(readJson(catalogPath), readJson(ledgerPath), readJson(databasePath), {
    ledger: ledgerPath,
    database: databasePath,
    paperLinks: paperLinksPath,
    reviewDecisions: reviewDecisionsPath
  });
  fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ sources: catalog.sources.length, records: catalog.records.length })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ sync });
