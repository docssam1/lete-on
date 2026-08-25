(function (root, factory) {
  "use strict";
  const inventoryModule = typeof module !== "undefined" && module.exports
    ? require("./dp-middle22-entry-202404-inventory.js")
    : root.HIGHSELECT_DP_MIDDLE22_ENTRY_202404_REVIEW_INVENTORY;
  const api = factory(inventoryModule);
  root.HIGHSELECT_DP_MIDDLE22_ENTRY_202404_RESPONSE_SCHEMA = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (inventoryModule) {
  "use strict";

  if (!inventoryModule || !inventoryModule.inventory) throw new Error("DP middle 2-2 review inventory is required");

  const EXAM_ID = "dp-middle2-2-transfer";
  const SCHEMA_VERSION = "dp-middle22-entry-202404-response-v1";
  const PRIVATE_KEY = /(?:answer(?:key|spec|value)?|solution|explanation|sourcepath|filepath|pdfurl|downloadurl|storageurl|correct)/i;

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { deepFreeze(value[key]); });
    return Object.freeze(value);
  }

  function fieldsFor(item) {
    if (item.responseCandidate !== "multi_input") return undefined;
    return Array.from({ length: item.responseSlotCount }, function (_, index) {
      return Object.freeze({ slotId: `slot-${index + 1}`, label: `${index + 1}번째 값` });
    });
  }

  const questions = Object.freeze(inventoryModule.inventory.items.map(function (item) {
    const question = { number: item.number, responseType: item.responseCandidate };
    const fields = fieldsFor(item);
    if (fields) question.fields = Object.freeze(fields);
    return Object.freeze(question);
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
      if (!question || question.number !== index + 1 || seen.has(question.number)) issues.push(`${prefix}.number`);
      if (question) seen.add(question.number);
      if (!question || !inventoryModule.RESPONSE_TYPES.includes(question.responseType)) issues.push(`${prefix}.response_type`);
      if (question && question.responseType === "multi_input") {
        if (!Array.isArray(question.fields) || question.fields.length !== 2) issues.push(`${prefix}.fields`);
        (question.fields || []).forEach(function (field, fieldIndex) {
          if (!field || field.slotId !== `slot-${fieldIndex + 1}` || field.label !== `${fieldIndex + 1}번째 값`) issues.push(`${prefix}.field.${fieldIndex + 1}`);
        });
      } else if (question && Object.prototype.hasOwnProperty.call(question, "fields")) {
        issues.push(`${prefix}.unexpected_fields`);
      }
    });
    inspectPublic(template, "schema", issues);
    return Object.freeze(Array.from(new Set(issues)).sort());
  }

  const template = deepFreeze({ examId: EXAM_ID, schemaVersion: SCHEMA_VERSION, questions });
  if (validate(template).length) throw new Error("invalid DP middle 2-2 public response schema");

  function forStudent(studentId) {
    const id = String(studentId || "").trim();
    if (!/^[A-Za-z0-9_-]{3,120}$/.test(id)) throw new Error("invalid student id");
    return deepFreeze({ examId: EXAM_ID, studentId: id, schemaVersion: SCHEMA_VERSION, questions });
  }

  return Object.freeze({ EXAM_ID, SCHEMA_VERSION, template, questions, validate, forStudent });
});
