"use strict";

const fs = require("node:fs");
const path = require("node:path");

function record(plan, targetId, paperId, sourceId) {
  const next = structuredClone(plan);
  const target = (next.targets || []).find(item => item.targetId === targetId);
  if (!target) throw new Error(`시험 구성을 찾을 수 없습니다: ${targetId}`);
  const source = (target.sourcePapersToReview || []).find(item => item.sourceId === sourceId);
  if (!source) throw new Error(`검수 계획에 없는 원본입니다: ${sourceId}`);
  target.indexedPaperIds = Array.from(new Set([...(target.indexedPaperIds || []), paperId])).sort();
  source.paperId = paperId;
  source.reviewStatus = "question_index_verified";
  return next;
}

function writeAtomic(filePath, value) {
  const resolved = path.resolve(filePath);
  const temporary = `${resolved}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  fs.renameSync(temporary, resolved);
}

function main(args) {
  if (args.length !== 5) {
    throw new Error("사용법: node record-dolpa-source-plan-paper.cjs <원본계획> <출력|- > <targetId> <paperId> <sourceId>");
  }
  const input = path.resolve(args[0]);
  const output = args[1] === "-" ? input : path.resolve(args[1]);
  const result = record(JSON.parse(fs.readFileSync(input, "utf8")), args[2], args[3], args[4]);
  writeAtomic(output, result);
  process.stdout.write(`${JSON.stringify({ targetId: args[2], paperId: args[3], sourceId: args[4], status: "question_index_verified" })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ record });
