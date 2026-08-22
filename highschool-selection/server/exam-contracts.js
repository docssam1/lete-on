"use strict";

const shR01Schema = require("../data/review-only/sh-r01-response-schema.js");
const dpMiddle22Schema = require("../data/review-only/dp-middle22-entry-202404-response-schema.js");

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
  }),
  "dp-middle2-2-transfer": Object.freeze({
    examId: "dp-middle2-2-transfer",
    title: "DP 중2-2 편입 1차 모의고사",
    deliveryRole: "first-sale-mock",
    formProfile: "sale-mock-a4-v1",
    questionCount: 30,
    pageCount: 10,
    responseSchemaVersion: dpMiddle22Schema.SCHEMA_VERSION,
    operationalScorePolicy: Object.freeze({
      kind: "unit-points",
      pointsPerItem: 1,
      totalPoints: 30,
      label: "운영 점수"
    }),
    cutlinePolicy: null
  })
});

function getExamContract(examId) {
  return EXAMS[String(examId || "")] || null;
}

function responseSchemaFor(examId, studentId) {
  if (examId === shR01Schema.EXAM_ID) return shR01Schema.forStudent(studentId);
  if (examId === dpMiddle22Schema.EXAM_ID) return dpMiddle22Schema.forStudent(studentId);
  return null;
}

module.exports = Object.freeze({ EXAMS, getExamContract, responseSchemaFor });
