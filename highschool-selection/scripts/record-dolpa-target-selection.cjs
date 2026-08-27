"use strict";

const fs = require("node:fs");
const path = require("node:path");
const scopes = require("../data/dolpa-target-scopes.js");

function record(plan, database, manifest) {
  const next = structuredClone(plan);
  const target = scopes.getTarget(manifest.targetId);
  if (!target) throw new Error(`시험 범위를 찾을 수 없습니다: ${manifest.targetId}`);
  const entry = (next.targets || []).find(item => item.targetId === manifest.targetId);
  if (!entry) throw new Error(`원본 계획에 시험이 없습니다: ${manifest.targetId}`);
  const ids = manifest.selectedQuestionIds || [];
  if (ids.length !== target.expectedQuestionCount || new Set(ids).size !== ids.length) {
    throw new Error(`서로 다른 원본 ${target.expectedQuestionCount}문항을 선택해야 합니다.`);
  }
  const questionById = new Map((database.questions || []).map(question => [question.questionId, question]));
  const allowedPapers = new Set(entry.indexedPaperIds || []);
  ids.forEach(questionId => {
    const question = questionById.get(questionId);
    if (!question) throw new Error(`문항 DB에 없습니다: ${questionId}`);
    if (!allowedPapers.has(question.paperId)) throw new Error(`검수한 원본 시험지의 문항이 아닙니다: ${questionId}`);
    const decision = scopes.evaluateQuestion(manifest.targetId, question);
    if (!decision.eligible) throw new Error(`시험 범위 밖 문항입니다: ${questionId} (${decision.reason})`);
  });
  entry.selectedQuestionIds = ids.slice();
  entry.selectionEvidenceId = String(manifest.evidenceId || "").trim();
  if (!entry.selectionEvidenceId) throw new Error("문항 선택 근거 ID가 필요합니다.");
  entry.selectionStatus = "ready_for_final_review";
  return next;
}

function writeAtomic(filePath, value) {
  const resolved = path.resolve(filePath);
  const temporary = `${resolved}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  fs.renameSync(temporary, resolved);
}

function main(args) {
  if (args.length !== 4) {
    throw new Error("사용법: node record-dolpa-target-selection.cjs <원본계획> <문항DB> <선택manifest> <출력|->");
  }
  const input = path.resolve(args[0]);
  const database = JSON.parse(fs.readFileSync(path.resolve(args[1]), "utf8"));
  const manifest = JSON.parse(fs.readFileSync(path.resolve(args[2]), "utf8"));
  const result = record(JSON.parse(fs.readFileSync(input, "utf8")), database, manifest);
  writeAtomic(args[3] === "-" ? input : path.resolve(args[3]), result);
  process.stdout.write(`${JSON.stringify({ targetId: manifest.targetId, selected: manifest.selectedQuestionIds.length, status: "ready_for_final_review" })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ record });
