"use strict";

const fs = require("node:fs");
const path = require("node:path");
const grading = require("../shared/grading.js");
const shR01Metadata = require("../data/sh-r01-diagnostic-metadata.js");

const TYPES = new Set(["input", "multi_input", "ordered_list", "unordered_set", "self_check"]);
const DIFFICULTIES = new Set(["lowered", "standard", "raised"]);
const FORBIDDEN_PUBLIC_TEXT = /(?:https?:\/\/|[A-Za-z]:[\\/]|\\\\|\.pdf\b|\.hwp\b|황소|돌파|원수학|이든|깊은생각|깊생|생수)/i;

function fail(message) { throw new Error(message); }
function text(value, label, max) {
  const result = String(value == null ? "" : value).trim();
  if (!result || result.length > max || FORBIDDEN_PUBLIC_TEXT.test(result)) fail(`${label} is not safe public metadata`);
  return result;
}

function validateClassification(value, number) {
  if (!value || typeof value !== "object") fail(`item ${number} classification is missing`);
  const evidence = Array.isArray(value.evidence) ? value.evidence.map(function (item) { return text(item, `item ${number} evidence`, 240); }) : [];
  if (!evidence.length) fail(`item ${number} classification evidence is missing`);
  const difficulty = text(value.difficulty, `item ${number} difficulty`, 20);
  if (!DIFFICULTIES.has(difficulty)) fail(`item ${number} difficulty is invalid`);
  return Object.freeze({
    points: Number.isFinite(Number(value.points)) && Number(value.points) > 0 ? Number(value.points) : 1,
    domain: text(value.domain, `item ${number} domain`, 100),
    gradeBand: text(value.gradeBand, `item ${number} gradeBand`, 60),
    semester: text(value.semester, `item ${number} semester`, 60),
    majorUnit: text(value.majorUnit, `item ${number} majorUnit`, 100),
    minorUnit: text(value.minorUnit, `item ${number} minorUnit`, 100),
    detailType: text(value.detailType, `item ${number} detailType`, 120),
    difficulty,
    cutlineSectionId: value.cutlineSectionId == null ? null : text(value.cutlineSectionId, `item ${number} cutlineSectionId`, 80),
    evidence: Object.freeze(evidence)
  });
}

function publicClassification(examId, number) {
  if (examId !== "sh-selection-r01") return null;
  const item = shR01Metadata.reportMetadataFor(number);
  if (!item || item.points !== 1 || item.reviewStatus !== "verified" || item.classificationStatus !== "verified") {
    fail(`item ${number} public diagnostic metadata is not verified`);
  }
  return validateClassification({
    points: item.points,
    domain: item.domain,
    gradeBand: item.gradeBand,
    semester: item.semester,
    majorUnit: item.majorUnit,
    minorUnit: item.minorUnit,
    detailType: item.detailType,
    difficulty: item.difficulty,
    cutlineSectionId: item.cutlineSectionId,
    evidence: item.classificationEvidence
  }, number);
}

function classificationFor(examId, number, supplied) {
  const verifiedPublic = publicClassification(examId, number);
  if (!verifiedPublic) return validateClassification(supplied, number);
  if (supplied != null) {
    const privateCopy = validateClassification(supplied, number);
    if (JSON.stringify(privateCopy) !== JSON.stringify(verifiedPublic)) fail(`item ${number} private classification differs from verified public metadata`);
  }
  return verifiedPublic;
}

function canonicalSpecType(spec) {
  const type = String(spec && spec.type || "input").trim().toLowerCase();
  if (type === "ox") return "self_check";
  if (type === "input" && spec && spec.mode === "ordered-list") return "ordered_list";
  if (type === "input" && spec && spec.mode === "unordered-set") return "unordered_set";
  return type;
}

function validateAnswerSpec(question, item) {
  const spec = item.answerSpec;
  if (canonicalSpecType(spec) !== question.responseType) fail(`item ${item.number} private answer type differs from public response type`);
  if (question.responseType === "multi_input") {
    const variants = Array.isArray(spec.variants) && spec.variants.length ? spec.variants : [spec.slots];
    variants.forEach(function (slots) {
      if (!Array.isArray(slots) || slots.length !== question.fields.length) fail(`item ${item.number} private multi-input slots are invalid`);
      slots.forEach(function (slot, index) {
        const field = question.fields[index];
        if (!slot || String(slot.slotId || "") !== field.slotId || String(slot.groupId || "") !== String(field.groupId || "")) {
          fail(`item ${item.number} private multi-input slots differ from public response fields`);
        }
      });
    });
  } else if (question.responseType === "ordered_list" || question.responseType === "unordered_set" || question.responseType === "input") {
    if (!Array.isArray(spec.answers) || !spec.answers.length) fail(`item ${item.number} private accepted answers are missing`);
  }
  return spec;
}

function normalize(raw) {
  if (!raw || raw.schemaVersion !== "highselect-private-scorer/v1" || !raw.exams || typeof raw.exams !== "object") fail("private scorer schemaVersion is invalid");
  const exams = {};
  Object.entries(raw.exams).forEach(function (entry) {
    const examId = entry[0], exam = entry[1];
    if (!exam || exam.classificationStatus !== "verified") fail(`${examId} scorer is not verified`);
    const items = Array.isArray(exam.items) ? exam.items : [];
    exams[examId] = Object.freeze({
      gradingVersion: text(exam.gradingVersion, `${examId} gradingVersion`, 100),
      classificationStatus: "verified",
      items: Object.freeze(items.map(function (item, index) {
        const number = index + 1;
        if (!item || item.number !== number || !TYPES.has(item.responseType) || !item.answerSpec || typeof item.answerSpec !== "object") fail(`${examId} item ${number} is invalid`);
        return Object.freeze({ number, responseType: item.responseType, answerSpec: item.answerSpec, classification: classificationFor(examId, number, item.classification) });
      }))
    });
  });
  return Object.freeze({ schemaVersion: raw.schemaVersion, exams: Object.freeze(exams) });
}

function answerValue(answer) {
  if (answer.responseType === "multi_input") return { value: answer.value, slotIds: answer.slotIds, groupIds: answer.groupIds };
  return answer.value;
}

function createAdapter(options) {
  const opts = options || {};
  let data;
  if (opts.data) data = normalize(opts.data);
  else {
    const scorerPath = String(opts.scorerPath || process.env.HIGHSELECT_PRIVATE_SCORER_PATH || "").trim();
    if (!scorerPath) return { score: async function () { throw new Error("HIGHSELECT_PRIVATE_SCORER_PATH is not configured"); } };
    data = normalize(JSON.parse(fs.readFileSync(path.resolve(scorerPath), "utf8")));
  }
  return {
    score: async function (examId, answers, schema) {
      const exam = data.exams[examId];
      if (!exam || exam.items.length !== schema.questions.length || answers.length !== schema.questions.length) fail("verified private scorer does not match response schema");
      const items = exam.items.map(function (item, index) {
        const question = schema.questions[index], answer = answers[index];
        if (item.number !== question.number || item.responseType !== question.responseType || answer.responseType !== question.responseType) fail(`item ${item.number} response contract mismatch`);
        const result = grading.evaluate(answerValue(answer), validateAnswerSpec(question, item));
        return Object.freeze({
          number: item.number,
          state: result.state === "correct" ? "correct" : "wrong",
          classification: item.classification
        });
      });
      return Object.freeze({ gradingVersion: exam.gradingVersion, classificationStatus: exam.classificationStatus, items: Object.freeze(items) });
    }
  };
}

module.exports = { normalize, createAdapter };
