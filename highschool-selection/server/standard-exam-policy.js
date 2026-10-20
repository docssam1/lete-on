"use strict";

require("../data/catalog.js");
require("../data/academy-engagement.js");
const policy = require("../data/standard-exam-policy.js");

function status(programCode, courseId) {
  return policy.resolve(programCode, courseId, global.HIGHSELECT_CATALOG);
}

function assertCourseOpen(programCode, courseId) {
  const resolved = status(programCode, courseId);
  if (!resolved.canApply || !resolved.canSell) {
    const error = new Error("standard_exam_not_ready");
    error.code = "standard_exam_not_ready";
    error.statusCode = 409;
    error.details = Object.freeze({
      programCode: resolved.programCode,
      courseId: resolved.courseId,
      standardExamId: resolved.standardExamId,
      state: resolved.state,
      gates: resolved.gates
    });
    throw error;
  }
  return resolved;
}

function auditConfiguration() {
  return policy.auditAll(global.HIGHSELECT_ACADEMY_ENGAGEMENT, global.HIGHSELECT_CATALOG);
}

module.exports = Object.freeze({ status, assertCourseOpen, auditConfiguration });
