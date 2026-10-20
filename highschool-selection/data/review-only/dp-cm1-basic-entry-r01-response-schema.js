(function (root, factory) {
  "use strict";
  const api = factory();
  root.HIGHSELECT_DP_CM1_BASIC_ENTRY_R01_RESPONSE_SCHEMA = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const EXAM_ID = "dp-common1-basic-entry-mock-r01";
  const SCHEMA_VERSION = "dp-cm1-basic-entry-r01-response-v1";
  const questions = Object.freeze(Array.from({ length: 30 }, function (_, index) {
    return Object.freeze({ number: index + 1, responseType: "input" });
  }));

  function validate(value) {
    const issues = [];
    if (!value || value.examId !== EXAM_ID) issues.push("schema.exam_id");
    if (!value || value.schemaVersion !== SCHEMA_VERSION) issues.push("schema.version");
    const rows = value && Array.isArray(value.questions) ? value.questions : [];
    if (rows.length !== 30) issues.push("schema.item_count");
    rows.forEach(function (row, index) {
      if (!row || row.number !== index + 1 || row.responseType !== "input") issues.push(`question.${index + 1}.contract`);
      if (row && Object.keys(row).sort().join("|") !== "number|responseType") issues.push(`question.${index + 1}.shape`);
    });
    const permitted = new Set(["examId", "studentId", "schemaVersion", "questions"]);
    if (value && typeof value === "object") {
      Object.keys(value).forEach(function (key) { if (!permitted.has(key)) issues.push(`schema.${key}.private`); });
    }
    return Object.freeze(Array.from(new Set(issues)).sort());
  }

  const template = Object.freeze({ examId: EXAM_ID, schemaVersion: SCHEMA_VERSION, questions });
  if (validate(template).length) throw new Error("invalid DP CM1 basic entry review response schema");

  function forStudent(studentId) {
    const id = String(studentId || "").trim();
    if (!/^[A-Za-z0-9_-]{3,120}$/.test(id)) throw new Error("invalid student id");
    return Object.freeze({ examId: EXAM_ID, studentId: id, schemaVersion: SCHEMA_VERSION, questions });
  }

  return Object.freeze({ EXAM_ID, SCHEMA_VERSION, template, questions, validate, forStudent });
});
