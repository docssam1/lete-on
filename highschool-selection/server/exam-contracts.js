"use strict";

const shR01Schema = require("../data/review-only/sh-r01-response-schema.js");

const EXAMS = Object.freeze({
  "sh-selection-r01": Object.freeze({
    examId: "sh-selection-r01",
    title: "SH 고등 선발 대비 1회",
    questionCount: 40,
    pageCount: 8,
    responseSchemaVersion: shR01Schema.SCHEMA_VERSION,
    operationalScorePolicy: Object.freeze({
      kind: "unit-points",
      pointsPerItem: 1,
      totalPoints: 40,
      label: "운영 점수"
    }),
    cutlinePolicy: null
  })
});

function getExamContract(examId) {
  return EXAMS[String(examId || "")] || null;
}

function responseSchemaFor(examId, studentId) {
  if (examId !== shR01Schema.EXAM_ID) return null;
  return shR01Schema.forStudent(studentId);
}

module.exports = Object.freeze({ EXAMS, getExamContract, responseSchemaFor });
