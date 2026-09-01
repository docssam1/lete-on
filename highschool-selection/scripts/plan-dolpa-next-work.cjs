"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { TASK_NAMES } = require("./build-dolpa-work-ledger.cjs");

const STAGE_ORDER = Object.freeze([
  "coverReview",
  "bodyReview",
  "answerReview",
  "questionSegmentation",
  "typeClassification",
  "difficultyReview",
  "analysisReport"
]);

function nextStage(source) {
  if (source.conversion.status !== "변환 완료") return "conversion";
  return STAGE_ORDER.find(name => ["pending", "sampled", "stale", "blocked"].includes(source.tasks[name].status)) || null;
}

function reviewBundle(source) {
  return STAGE_ORDER.slice(0, -1).filter(name => ["pending", "sampled", "stale", "blocked"].includes(source.tasks[name].status));
}

function plan(ledger, requestedTask, limit) {
  const task = requestedTask === "next" ? null : requestedTask;
  if (task && task !== "conversion" && !TASK_NAMES.includes(task)) throw new Error(`작업 이름을 확인해 주세요: ${task}`);
  const rows = [];
  for (const source of ledger.sources) {
    const stage = nextStage(source);
    if (!stage) continue;
    if (task && stage !== task) continue;
    const bundled = !task && stage !== "conversion" && stage !== "analysisReport";
    rows.push({
      order: source.conversion.order,
      sourceId: source.sourceId,
      courseHint: source.courseHint,
      familyHint: source.familyHint,
      task: bundled ? "paperReviewBundle" : stage,
      tasks: bundled ? reviewBundle(source) : [stage],
      path: source.canonicalRelativePath,
      priorStatus: stage === "conversion" ? source.conversion.status : source.tasks[stage].status
    });
    if (rows.length >= limit) break;
  }
  return rows;
}

function main(args) {
  if (args.length < 1 || args.length > 3) throw new Error("사용법: node plan-dolpa-next-work.cjs <ledger> [next|task] [limit]");
  const ledger = JSON.parse(fs.readFileSync(path.resolve(args[0]), "utf8"));
  const task = args[1] || "next";
  const limit = Number(args[2] || 20);
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) throw new Error("limit은 1~100이어야 합니다.");
  const rows = plan(ledger, task, limit);
  process.stdout.write(`${JSON.stringify({ task, count: rows.length, rows }, null, 2)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ STAGE_ORDER, nextStage, plan });
