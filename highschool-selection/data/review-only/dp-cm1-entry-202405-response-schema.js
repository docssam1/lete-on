(function (root, factory) {
  "use strict";
  const inventoryModule = typeof module !== "undefined" && module.exports
    ? require("./dp-cm1-entry-202405-inventory.js")
    : root.HIGHSELECT_DP_CM1_ENTRY_202405_REVIEW_INVENTORY;
  const api = factory(inventoryModule);
  root.HIGHSELECT_DP_CM1_ENTRY_202405_RESPONSE_SCHEMA = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (inventoryModule) {
  "use strict";

  if (!inventoryModule || !inventoryModule.inventory) throw new Error("DP CM1 entry review inventory is required");

  const EXAM_ID = "dp-common1-entry-202405";
  const SCHEMA_VERSION = "dp-cm1-entry-202405-response-v1";
  const PRIVATE_KEY = /(?:answer(?:key|spec|value)?|solution|explanation|sourcepath|filepath|pdfurl|downloadurl|storageurl|correct)/i;

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { deepFreeze(value[key]); });
    return Object.freeze(value);
  }

  const questions = Object.freeze(inventoryModule.inventory.items.map(function (item) {
    return Object.freeze({ number: item.number, responseType: "input" });
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
    if (!template || template.examId !== EXAM_ID) issues.push("schema.exam_id");
    if (!template || template.schemaVersion !== SCHEMA_VERSION) issues.push("schema.version");
    const rows = template && Array.isArray(template.questions) ? template.questions : [];
    if (rows.length !== 30) issues.push("schema.item_count");
    const seen = new Set();
    rows.forEach(function (question, index) {
      const prefix = `question.${index + 1}`;
      if (!question || question.number !== index + 1) issues.push(`${prefix}.number`);
      if (!question || seen.has(question.number)) issues.push(`${prefix}.duplicate`);
      if (question) seen.add(question.number);
      if (!question || question.responseType !== "input") issues.push(`${prefix}.response_type`);
      if (!question || Object.keys(question).sort().join("|") !== "number|responseType") issues.push(`${prefix}.shape`);
    });
    inspectPublic(template, "schema", issues);
    return Object.freeze(Array.from(new Set(issues)).sort());
  }

  const template = deepFreeze({ examId: EXAM_ID, schemaVersion: SCHEMA_VERSION, questions });
  if (validate(template).length) throw new Error("invalid DP CM1 entry public response schema");

  function forStudent(studentId) {
    const id = String(studentId || "").trim();
    if (!/^[A-Za-z0-9_-]{3,120}$/.test(id)) throw new Error("invalid student id");
    return deepFreeze({ examId: EXAM_ID, studentId: id, schemaVersion: SCHEMA_VERSION, questions });
  }

  return Object.freeze({ EXAM_ID, SCHEMA_VERSION, template, questions, validate, forStudent });
});
