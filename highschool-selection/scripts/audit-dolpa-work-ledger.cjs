"use strict";

const fs = require("node:fs");
const path = require("node:path");
const core = require("./build-dolpa-work-ledger.cjs");

function audit(ledger) {
  const issues = [];
  if (ledger.schemaVersion !== 1) issues.push("schemaVersion");
  if (ledger.taxonomyVersion !== "dolpa-kr-math-v1") issues.push("taxonomyVersion");
  const sources = Array.isArray(ledger.sources) ? ledger.sources : [];
  const questions = Array.isArray(ledger.questions) ? ledger.questions : [];
  const sourceIds = new Set();
  const orders = new Set();
  sources.forEach(source => {
    if (sourceIds.has(source.sourceId)) issues.push(`duplicate_source:${source.sourceId}`);
    sourceIds.add(source.sourceId);
    if (orders.has(source.conversion.order)) issues.push(`duplicate_order:${source.conversion.order}`);
    orders.add(source.conversion.order);
    core.TASK_NAMES.forEach(name => {
      const task = source.tasks && source.tasks[name];
      if (!task || !core.TASK_STATUSES.includes(task.status)) issues.push(`task:${source.sourceId}:${name}`);
      if (task && task.status === "verified" && (!Array.isArray(task.evidence) || !task.evidence.length)) {
        issues.push(`verified_without_evidence:${source.sourceId}:${name}`);
      }
    });
    if (source.tasks.typeClassification.status === "verified" && !source.paperIds.length) {
      issues.push(`classified_without_paper:${source.sourceId}`);
    }
  });
  const questionIds = new Set();
  questions.forEach(question => {
    if (questionIds.has(question.questionId)) issues.push(`duplicate_question:${question.questionId}`);
    questionIds.add(question.questionId);
    if (!sourceIds.has(question.sourceId)) issues.push(`unknown_source:${question.questionId}`);
    if (question.questionId !== core.stableQuestionId(question.sourceId, question.number)) issues.push(`question_id:${question.questionId}`);
    const expectedType = core.stableTypeId(question.curriculum.semester, question.curriculum.unit, question.type.label);
    if (question.type.typeId !== expectedType) issues.push(`type_id:${question.questionId}`);
    if (question.classificationStatus === "verified" && !question.evidence.length) issues.push(`classification_evidence:${question.questionId}`);
    if (question.type.methodReviewStatus === "verified" && !question.type.methodTags.length) issues.push(`method_evidence:${question.questionId}`);
    if (question.difficulty.status === "verified" && (!question.difficulty.band || !question.difficulty.evidence.length)) {
      issues.push(`difficulty_evidence:${question.questionId}`);
    }
  });
  const expected = ledger.summary || {};
  const actual = {
    sourceCount: sources.length,
    convertedSourceCount: sources.filter(source => source.conversion.status === "변환 완료").length,
    coverVerifiedSourceCount: sources.filter(source => source.tasks.coverReview.status === "verified").length,
    segmentedSourceCount: sources.filter(source => source.tasks.questionSegmentation.status === "verified").length,
    classifiedSourceCount: sources.filter(source => source.tasks.typeClassification.status === "verified").length,
    questionCount: questions.length,
    classifiedQuestionCount: questions.filter(question => question.classificationStatus === "verified").length,
    difficultyVerifiedQuestionCount: questions.filter(question => question.difficulty.status === "verified").length,
    analysisCompleteSourceCount: sources.filter(source => source.tasks.analysisReport.status === "verified").length
  };
  Object.entries(actual).forEach(([key, value]) => {
    if (Number(expected[key]) !== value) issues.push(`summary:${key}:${expected[key]}/${value}`);
  });
  return { ok: issues.length === 0, issues, actual };
}

function main(args) {
  if (args.length !== 1) throw new Error("사용법: node audit-dolpa-work-ledger.cjs <ledger>");
  const ledger = JSON.parse(fs.readFileSync(path.resolve(args[0]), "utf8"));
  const result = audit(ledger);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.ok) process.exitCode = 1;
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ audit });
