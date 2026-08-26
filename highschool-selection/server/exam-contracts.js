"use strict";

const shR01Schema = require("../data/review-only/sh-r01-response-schema.js");
const dpMiddle22Schema = require("../data/review-only/dp-middle22-entry-202404-response-schema.js");
const dpCommon1Schema = require("../data/review-only/dp-cm1-entry-202405-response-schema.js");

const EXAMS = Object.freeze({
  "sh-selection-r01": Object.freeze({
    examId: "sh-selection-r01",
    programCode: "SH",
    trackId: "high-selection",
    title: "황소 고등 선발 대비 1회",
    durationMinutes: 110,
    durationScope: "our-sale-mock",
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
    programCode: "DP",
    trackId: "middle-transfer",
    title: "돌파 중2-2 편입 1차 모의고사",
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
  }),
  "dp-common1-entry-202405": Object.freeze({
    examId: "dp-common1-entry-202405",
    programCode: "DP",
    trackId: "common-math-entry",
    title: "돌파 공통수학1 입학 1차 모의고사",
    deliveryRole: "first-sale-mock",
    formProfile: "sale-mock-a4-v1",
    questionCount: 30,
    pageCount: 10,
    responseSchemaVersion: dpCommon1Schema.SCHEMA_VERSION,
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
  if (examId === dpCommon1Schema.EXAM_ID) return dpCommon1Schema.forStudent(studentId);
  return null;
}

module.exports = Object.freeze({ EXAMS, getExamContract, responseSchemaFor });
