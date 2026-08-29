#!/usr/bin/env node
"use strict";

/*
 * Local teacher-side scoring bridge for a privately verified year paper.
 * It reads private answers, but emits only answer-free student/teacher report
 * data. Browser delivery remains a separate authenticated-release decision.
 */
const fs = require("node:fs");
const path = require("node:path");
const intake = require("./validate-private-sasmo-diagnostic.cjs");
const catalog = require("../competition/sasmo-mock-catalog.js");
const readiness = require("../assessment/sasmo-mock-readiness.js");

const DEFAULT_POLICY = Object.freeze({
  bands: Object.freeze([
    Object.freeze({ id: "foundation", minPercent: 0, label: "기초 보완" }),
    Object.freeze({ id: "core", minPercent: 45, label: "핵심 정착" }),
    Object.freeze({ id: "practice", minPercent: 65, label: "실전 진입" }),
    Object.freeze({ id: "challenge", minPercent: 82, label: "상위권 도전" })
  ])
});

function fail(code) { const error = new Error(code); error.code = code; throw error; }
function isRecord(value) { return !!value && typeof value === "object" && !Array.isArray(value); }
function readJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (error) { fail("RESPONSE_FILE_INVALID"); }
}
function normalizedRational(value) {
  if (typeof value !== "string") return null;
  const text = value.trim();
  const match = /^([+-]?\d+)(?:\/(\d+))?$/.exec(text);
  if (!match || (match[2] && match[2] === "0")) return null;
  let numerator;
  let denominator;
  try { numerator = BigInt(match[1]); denominator = BigInt(match[2] || "1"); } catch (error) { return null; }
  function gcd(left, right) { let a = left < 0n ? -left : left; let b = right; while (b) { const next = a % b; a = b; b = next; } return a || 1n; }
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
}
function outcomeFor(item, response) {
  const submitted = typeof response === "string" ? response.trim() : "";
  if (!submitted) return "blank";
  if (item.privateScoring.answerKind === "option-id") return submitted.toUpperCase() === item.privateScoring.answerValue ? "correct" : "incorrect";
  const submittedRational = normalizedRational(submitted);
  const expectedRational = normalizedRational(item.privateScoring.answerValue);
  return submittedRational && expectedRational && submittedRational === expectedRational ? "correct" : "incorrect";
}
function parseResponses(filePath) {
  const value = readJson(filePath);
  if (!isRecord(value) || Object.keys(value).some(function (key) { return !["formId", "responses", "history", "targetScore"].includes(key); })) fail("RESPONSES_SHAPE_INVALID");
  if (typeof value.formId !== "string" || !Array.isArray(value.responses) || value.responses.length !== 25) fail("RESPONSES_SHAPE_INVALID");
  const byNumber = new Map();
  value.responses.forEach(function (entry, index) {
    if (!isRecord(entry) || Object.keys(entry).some(function (key) { return !["questionNumber", "value"].includes(key); }) || entry.questionNumber !== index + 1 || typeof entry.value !== "string") {
      fail("RESPONSES_SHAPE_INVALID");
    }
    byNumber.set(entry.questionNumber, entry.value);
  });
  return Object.freeze({ formId: value.formId, responses: byNumber, history: value.history || null, targetScore: value.targetScore == null ? null : value.targetScore });
}
function reportFor(pack, responsePayload) {
  const formId = `sasmo-${pack.paper.year}-${pack.paper.levelId.toLowerCase()}-baseline-a`;
  const form = catalog.getForm(formId);
  if (!form || responsePayload.formId !== formId) fail("FORM_CATALOG_NOT_READY");
  const outcomes = pack.items.map(function (item, index) {
    return Object.freeze({ questionNumber: index + 1, outcome: outcomeFor(item, responsePayload.responses.get(index + 1)) });
  });
  const analysis = readiness.analyzeAttempt(form, { formId, outcomes }, DEFAULT_POLICY, { history: responsePayload.history, targetScore: responsePayload.targetScore });
  return Object.freeze({
    schemaVersion: "gfield-private-sasmo-report-v1",
    sourceState: "private-reference-intake-only",
    officialAwardPrediction: false,
    student: Object.freeze({ score: analysis.score, readiness: analysis.readiness, axes: analysis.axes, strengths: analysis.strengths, weaknesses: analysis.weaknesses, prediction: analysis.prediction }),
    teacher: Object.freeze({
      score: analysis.score,
      questionEvidence: Object.freeze(form.items.map(function (item, index) {
        const outcome = outcomes[index].outcome;
        return Object.freeze({ questionNumber: item.questionNumber, axisId: item.axisId, skillId: item.skillId, outcome, workReviewRequired: outcome !== "correct" });
      })),
      followUpRule: "Wrong and blank responses are patterns only; assign an error type after reviewing the student's work or timing evidence."
    })
  });
}
function main(argv) {
  const rootIndex = argv.indexOf("--root");
  const fileIndex = argv.indexOf("--file");
  const responsesIndex = argv.indexOf("--responses");
  if (rootIndex < 0 || fileIndex < 0 || responsesIndex < 0 || !argv[rootIndex + 1] || !argv[fileIndex + 1] || !argv[responsesIndex + 1]) {
    console.error("Usage: node scripts/analyze-private-sasmo-mock.cjs --root <external-private-root> --file <sasmo-year-grade-diagnostic.json> --responses <external-response-json>");
    return 2;
  }
  try {
    const loaded = intake.loadPrivatePack(argv[rootIndex + 1], argv[fileIndex + 1]);
    const report = reportFor(loaded.pack, parseResponses(path.resolve(argv[responsesIndex + 1])));
    console.log(JSON.stringify(report));
    return 0;
  } catch (error) {
    console.error(`BLOCKED private SASMO report: ${error.code || "INVALID"}`);
    return 2;
  }
}
if (require.main === module) process.exitCode = main(process.argv.slice(2));
module.exports = Object.freeze({ DEFAULT_POLICY, parseResponses, reportFor, outcomeFor });
