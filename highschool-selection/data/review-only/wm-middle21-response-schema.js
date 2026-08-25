(function (root, factory) {
  "use strict";
  const api = factory();
  root.HIGHSELECT_WM_MIDDLE21_RESPONSE_SCHEMA = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const EXAM_IDS = Object.freeze(Array.from({ length: 4 }, function (_, index) {
    return `wm-middle21-basic-entry-r${String(index + 1).padStart(2, "0")}`;
  }));
  const SCHEMA_VERSION = "wm-middle21-response-v1";
  const PRIVATE_KEY = /(?:answer|solution|explanation|sourcepath|filepath|pdfurl|downloadurl|storageurl|correct)/i;

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { deepFreeze(value[key]); });
    return Object.freeze(value);
  }

  const questions = Object.freeze(Array.from({ length: 40 }, function (_, index) {
    return Object.freeze({ number: index + 1, responseType: "input" });
  }));

  function inspectPublic(value, location, issues) {
    if (!value || typeof value !== "object") return;
    Object.keys(value).forEach(function (key) {
      if (PRIVATE_KEY.test(key)) issues.push(`${location}.${key}.private`);
      inspectPublic(value[key], `${location}.${key}`, issues);
    });
  }

  function validate(template) {
    const issues = [];
    if (!template || !EXAM_IDS.includes(template.examId)) issues.push("schema.exam_id");
    if (!template || template.schemaVersion !== SCHEMA_VERSION) issues.push("schema.version");
    const rows = template && Array.isArray(template.questions) ? template.questions : [];
    if (rows.length !== 40) issues.push("schema.item_count");
    rows.forEach(function (question, index) {
      const prefix = `question.${index + 1}`;
      if (!question || question.number !== index + 1) issues.push(`${prefix}.number`);
      if (!question || question.responseType !== "input") issues.push(`${prefix}.response_type`);
      if (question && Object.keys(question).some(function (key) { return !["number", "responseType"].includes(key); })) issues.push(`${prefix}.unexpected_field`);
    });
    inspectPublic(template, "schema", issues);
    return Object.freeze(Array.from(new Set(issues)).sort());
  }

  function forStudent(examId, studentId) {
    const normalizedExamId = String(examId || "").trim();
    const normalizedStudentId = String(studentId || "").trim();
    if (!EXAM_IDS.includes(normalizedExamId)) throw new Error("invalid exam id");
    if (!/^[A-Za-z0-9_-]{3,120}$/.test(normalizedStudentId)) throw new Error("invalid student id");
    const result = deepFreeze({ examId: normalizedExamId, studentId: normalizedStudentId, schemaVersion: SCHEMA_VERSION, questions });
    if (validate(result).length) throw new Error("invalid WM M2-1 public response schema");
    return result;
  }

  const templates = deepFreeze(Object.fromEntries(EXAM_IDS.map(function (examId) {
    return [examId, { examId, schemaVersion: SCHEMA_VERSION, questions }];
  })));
  Object.values(templates).forEach(function (template) {
    if (validate(template).length) throw new Error("invalid WM M2-1 public response schema");
  });

  return Object.freeze({ EXAM_IDS, SCHEMA_VERSION, questions, templates, validate, forStudent });
});
