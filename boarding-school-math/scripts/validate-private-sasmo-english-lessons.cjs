#!/usr/bin/env node
"use strict";

/*
 * Validates a private, post-attempt English lesson pack for one verified
 * SASMO paper. Source prompts and answers remain outside the Git worktree.
 */

const fs = require("node:fs");
const path = require("node:path");
const intake = require("./validate-private-sasmo-diagnostic.cjs");

const SCHEMA_VERSION = "gfield-private-sasmo-english-lessons-v1";
const DELIVERY_STATE = "private-post-attempt-review";
const VISUAL_KINDS = new Set([
  "equation-flow", "set-diagram", "edge-double-count", "arrangement-blocks",
  "percent-bar", "angle-map", "unit-bar", "constraint-table", "counting-table",
  "rate-bar", "weekday-cycle", "clock-arcs", "truth-table", "factor-tree",
  "cell-overlay", "triangle-size-table", "fraction-strip", "percent-chain",
  "calendar-code", "ratio-bars", "parity-selection", "cycle-timeline",
  "area-decomposition", "column-addition", "calendar-count-table"
]);

class ValidationError extends Error {
  constructor(code, reference) {
    super(`${code}: ${reference}`);
    this.code = code;
    this.reference = reference;
  }
}

function fail(code, reference) { throw new ValidationError(code, reference); }
function record(value) { return !!value && typeof value === "object" && !Array.isArray(value); }
function text(value, code, reference, pattern) {
  if (typeof value !== "string" || value !== value.trim() || !value || (pattern && !pattern.test(value))) fail(code, reference);
}
function dense(value, code, reference, min, max) {
  if (!Array.isArray(value) || value.length < min || value.length > max) fail(code, reference);
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.prototype.hasOwnProperty.call(value, index)) fail(code, reference);
  }
  return value;
}
function onlyKeys(value, keys, code, reference) {
  if (!record(value) || Object.keys(value).some(function (key) { return !keys.includes(key); })) fail(code, reference);
}

function validateLessonPack(pack, intakePack) {
  onlyKeys(pack, ["schemaVersion", "packId", "language", "deliveryState", "paperBinding", "lessonPattern", "lessons"], "LESSON_PACK_SHAPE_INVALID", "pack");
  if (pack.schemaVersion !== SCHEMA_VERSION || pack.language !== "en" || pack.deliveryState !== DELIVERY_STATE) fail("LESSON_PACK_IDENTITY_INVALID", "pack");
  text(pack.packId, "LESSON_PACK_ID_INVALID", "pack.packId", /^sasmo-[0-9]{4}-g(?:[2-9]|10)-english-review-v[0-9]+$/u);
  onlyKeys(pack.paperBinding, ["programId", "year", "levelId", "intakeFingerprintSha256"], "LESSON_BINDING_INVALID", "paperBinding");
  if (pack.paperBinding.programId !== "sasmo" || pack.paperBinding.year !== intakePack.paper.year || pack.paperBinding.levelId !== intakePack.paper.levelId || pack.paperBinding.intakeFingerprintSha256 !== intakePack.paper.sourceFingerprintSha256) fail("LESSON_BINDING_INVALID", "paperBinding");
  if (pack.lessonPattern !== "concept-visual-solve-mistake-retry") fail("LESSON_PATTERN_INVALID", "lessonPattern");

  const lessons = dense(pack.lessons, "LESSON_COUNT_INVALID", "lessons", 25, 25);
  const intakeById = new Map(intakePack.items.map(function (item) { return [item.itemId, item]; }));
  const seen = new Set();
  lessons.forEach(function (lesson, index) {
    const ref = `lessons[${index}]`;
    onlyKeys(lesson, ["itemId", "questionNumber", "title", "conceptGoal", "priorKnowledge", "visualModel", "steps", "whyItWorks", "commonMistake", "tryAgain", "finalAnswer", "teacherNote", "verification"], "LESSON_SHAPE_INVALID", ref);
    const itemId = `sasmo-${intakePack.paper.year}-${intakePack.paper.levelId.toLowerCase()}-q${String(index + 1).padStart(2, "0")}`;
    if (lesson.itemId !== itemId || lesson.questionNumber !== index + 1 || seen.has(lesson.itemId) || !intakeById.has(lesson.itemId)) fail("LESSON_ITEM_BINDING_INVALID", ref);
    seen.add(lesson.itemId);
    ["title", "conceptGoal", "priorKnowledge", "whyItWorks", "commonMistake", "tryAgain", "teacherNote"].forEach(function (field) {
      text(lesson[field], "LESSON_TEXT_INVALID", `${ref}.${field}`, /^.{12,900}$/su);
    });
    onlyKeys(lesson.visualModel, ["kind", "caption", "tokens"], "LESSON_VISUAL_INVALID", `${ref}.visualModel`);
    if (!VISUAL_KINDS.has(lesson.visualModel.kind)) fail("LESSON_VISUAL_INVALID", `${ref}.visualModel.kind`);
    text(lesson.visualModel.caption, "LESSON_VISUAL_INVALID", `${ref}.visualModel.caption`, /^.{12,300}$/su);
    dense(lesson.visualModel.tokens, "LESSON_VISUAL_INVALID", `${ref}.visualModel.tokens`, 2, 12).forEach(function (token, tokenIndex) {
      text(token, "LESSON_VISUAL_INVALID", `${ref}.visualModel.tokens[${tokenIndex}]`, /^.{1,100}$/su);
    });
    dense(lesson.steps, "LESSON_STEPS_INVALID", `${ref}.steps`, 3, 7).forEach(function (step, stepIndex) {
      onlyKeys(step, ["label", "explanation", "math"], "LESSON_STEP_INVALID", `${ref}.steps[${stepIndex}]`);
      text(step.label, "LESSON_STEP_INVALID", `${ref}.steps[${stepIndex}].label`, /^.{3,60}$/su);
      text(step.explanation, "LESSON_STEP_INVALID", `${ref}.steps[${stepIndex}].explanation`, /^.{12,600}$/su);
      text(step.math, "LESSON_STEP_INVALID", `${ref}.steps[${stepIndex}].math`, /^.{1,220}$/su);
    });
    onlyKeys(lesson.finalAnswer, ["kind", "value", "display"], "LESSON_ANSWER_INVALID", `${ref}.finalAnswer`);
    const intakeAnswer = intakeById.get(lesson.itemId).privateScoring;
    if (lesson.finalAnswer.kind !== intakeAnswer.answerKind || lesson.finalAnswer.value !== intakeAnswer.answerValue) fail("LESSON_ANSWER_MISMATCH", `${ref}.finalAnswer`);
    text(lesson.finalAnswer.display, "LESSON_ANSWER_INVALID", `${ref}.finalAnswer.display`, /^.{1,120}$/su);
    onlyKeys(lesson.verification, ["publishedSolutionMatched", "independentMethodMatched", "sourceDiagramRequired"], "LESSON_VERIFICATION_INVALID", `${ref}.verification`);
    if (lesson.verification.publishedSolutionMatched !== true || lesson.verification.independentMethodMatched !== true || typeof lesson.verification.sourceDiagramRequired !== "boolean") fail("LESSON_VERIFICATION_INVALID", `${ref}.verification`);
  });
  return Object.freeze({ packId: pack.packId, lessonCount: lessons.length, language: pack.language, deliveryState: pack.deliveryState });
}

function loadJson(filePath, code) {
  const stat = fs.lstatSync(filePath);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size <= 0 || stat.size > 2 * 1024 * 1024) fail(code, path.basename(filePath));
  try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (_error) { fail(code, path.basename(filePath)); }
}

function loadAndValidate(options) {
  const lessonRoot = intake.assertExternalPrivateRoot(options.lessonRoot);
  const intakeRoot = intake.assertExternalPrivateRoot(options.intakeRoot);
  const lessonPath = path.resolve(lessonRoot, options.lessonFile);
  const intakePath = path.resolve(intakeRoot, options.intakeFile);
  const pack = loadJson(lessonPath, "LESSON_PACK_JSON_INVALID");
  const intakePack = loadJson(intakePath, "LESSON_INTAKE_JSON_INVALID");
  intake.validatePack(intakePack);
  return Object.freeze({ pack, intakePack, validation: validateLessonPack(pack, intakePack) });
}

function argument(args, flag) {
  const index = args.indexOf(flag);
  if (index < 0 || !args[index + 1]) fail("LESSON_COMMAND_INVALID", flag);
  return args[index + 1];
}

if (require.main === module) {
  try {
    const result = loadAndValidate({
      lessonRoot: argument(process.argv, "--lesson-root"), lessonFile: argument(process.argv, "--lesson-file"),
      intakeRoot: argument(process.argv, "--intake-root"), intakeFile: argument(process.argv, "--intake-file")
    }).validation;
    console.log(`PASS private SASMO English lessons: ${result.packId}, ${result.lessonCount} verified lessons`);
  } catch (error) {
    console.error(`BLOCKED private SASMO English lessons: ${error.code || "INVALID"} ${error.reference || ""}`.trim());
    process.exitCode = 2;
  }
}

module.exports = Object.freeze({ SCHEMA_VERSION, DELIVERY_STATE, VISUAL_KINDS, ValidationError, validateLessonPack, loadAndValidate });
