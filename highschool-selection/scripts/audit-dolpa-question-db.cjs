"use strict";

const fs = require("node:fs");
const path = require("node:path");
const ledgerCore = require("./build-dolpa-work-ledger.cjs");
const dbCore = require("./build-dolpa-question-db.cjs");

const FORBIDDEN_KEYS = new Set(["prompt", "stem", "answer", "answerValue", "solution", "content", "rawText", "pageImage"]);

function walk(value, pointer, issues) {
  if (!value || typeof value !== "object") return;
  Object.entries(value).forEach(([key, child]) => {
    if (FORBIDDEN_KEYS.has(key)) issues.push(`forbidden:${pointer}/${key}`);
    walk(child, `${pointer}/${key}`, issues);
  });
}

function audit(database) {
  const issues = [];
  if (database.schemaVersion !== 1) issues.push("schemaVersion");
  walk(database, "", issues);
  const questionIds = new Set();
  const questionsById = new Map();
  database.questions.forEach(question => {
    if (questionIds.has(question.questionId)) issues.push(`duplicate_question:${question.questionId}`);
    questionIds.add(question.questionId);
    questionsById.set(question.questionId, question);
    if (question.questionId !== ledgerCore.stableQuestionId(question.sourceId, question.number)) issues.push(`question_id:${question.questionId}`);
    const typeId = ledgerCore.stableTypeId(question.classification.semester, question.classification.unit, question.classification.typeLabel);
    if (question.classification.typeId !== typeId) issues.push(`type_id:${question.questionId}`);
    if (question.classification.majorUnit !== question.classification.domain) issues.push(`major_unit:${question.questionId}`);
    if (question.classification.minorUnit !== question.classification.unit) issues.push(`minor_unit:${question.questionId}`);
    if (question.classification.status === "verified" && !question.classification.evidence.length) issues.push(`classification_evidence:${question.questionId}`);
    if (question.method.status === "verified" && (!question.method.tags.length || !question.method.evidence.length)) issues.push(`method_evidence:${question.questionId}`);
    if (question.difficulty.status === "verified" && (!question.difficulty.band || !question.difficulty.evidence.length)) issues.push(`difficulty_evidence:${question.questionId}`);
    if (question.responseFormat.status === "verified" && (!question.responseFormat.kind
      || !Number.isSafeInteger(question.responseFormat.slotCount) || question.responseFormat.slotCount < 1
      || !question.responseFormat.evidence.length)) issues.push(`response_evidence:${question.questionId}`);
    if (question.answerCheck.status === "verified" && !question.answerCheck.evidence.length) issues.push(`answer_evidence:${question.questionId}`);
    const expectedProfileIds = dbCore.PROFILE_CATALOG.map(profile => profile.profileId).sort();
    const actualProfileIds = (question.usageProfiles || []).map(profile => profile.profileId).sort();
    if (new Set(actualProfileIds).size !== actualProfileIds.length) issues.push(`duplicate_usage_profile:${question.questionId}`);
    if (JSON.stringify(actualProfileIds) !== JSON.stringify(expectedProfileIds)) issues.push(`usage_profiles:${question.questionId}`);
    (question.usageProfiles || []).forEach(profile => {
      if (!dbCore.PROFILE_STATUSES.includes(profile.status)) issues.push(`usage_status:${question.questionId}:${profile.profileId}`);
      if (["source_verified", "approved"].includes(profile.status) && !(profile.evidence || []).length) {
        issues.push(`usage_evidence:${question.questionId}:${profile.profileId}`);
      }
    });
    if (question.releaseStatus !== "locked") issues.push(`release:${question.questionId}`);
  });
  database.papers.forEach(paper => {
    if (paper.questionCount !== paper.questionIds.length) issues.push(`paper_count:${paper.paperId}`);
    const rows = paper.questionIds.map(id => questionsById.get(id));
    if (rows.some(row => !row || row.paperId !== paper.paperId || row.sourceId !== paper.sourceId)) issues.push(`paper_link:${paper.paperId}`);
    const numbers = rows.map(row => row.number).sort((a, b) => a - b);
    if (numbers.some((number, index) => number !== index + 1)) issues.push(`paper_numbers:${paper.paperId}`);
  });
  const rebuiltTypes = dbCore.rebuildTypeCatalog(database.questions);
  if (JSON.stringify(rebuiltTypes) !== JSON.stringify(database.typeCatalog)) issues.push("type_catalog");
  if (JSON.stringify(database.profileCatalog) !== JSON.stringify(dbCore.PROFILE_CATALOG)) issues.push("profile_catalog");
  const actual = dbCore.summarize(database);
  Object.entries(actual).forEach(([key, value]) => {
    if (Number(database.summary[key]) !== value) issues.push(`summary:${key}:${database.summary[key]}/${value}`);
  });
  return { ok: issues.length === 0, issues, actual };
}

function main(args) {
  if (args.length !== 1) throw new Error("사용법: node audit-dolpa-question-db.cjs <question-db>");
  const database = JSON.parse(fs.readFileSync(path.resolve(args[0]), "utf8"));
  const result = audit(database);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.ok) process.exitCode = 1;
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ audit });
