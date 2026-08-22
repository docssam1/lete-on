(function (root, factory) {
  "use strict";
  const inventoryModule = typeof module !== "undefined" && module.exports
    ? require("./sh-r01-inventory.js")
    : root.HIGHSELECT_SH_R01_REVIEW_INVENTORY;
  const api = factory(inventoryModule);
  root.HIGHSELECT_SH_R01_RESPONSE_SCHEMA = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (inventoryModule) {
  "use strict";

  if (!inventoryModule || !inventoryModule.inventory) throw new Error("SH-R01 inventory is required");

  const EXAM_ID = "sh-selection-r01";
  const SCHEMA_VERSION = "sh-r01-response-v1";
  const TYPES = Object.freeze(["input", "multi_input", "ordered_list", "unordered_set", "self_check"]);
  const TYPE_SET = new Set(TYPES);
  const PRIVATE_KEY = /(?:answer|solution|explanation|sourcepath|filepath|pdfurl|downloadurl|storageurl|correct)/i;

  const MULTI_FIELDS = Object.freeze({
    7: Object.freeze([
      Object.freeze({ slotId: "f-x", groupId: "point-f", groupLabel: "F", label: "x" }),
      Object.freeze({ slotId: "f-y", groupId: "point-f", groupLabel: "F", label: "y" })
    ]),
    14: Object.freeze([
      Object.freeze({ slotId: "pair-a-x", groupId: "pair-a", groupLabel: "순서쌍 1", label: "x" }),
      Object.freeze({ slotId: "pair-a-y", groupId: "pair-a", groupLabel: "순서쌍 1", label: "y" }),
      Object.freeze({ slotId: "pair-b-x", groupId: "pair-b", groupLabel: "순서쌍 2", label: "x" }),
      Object.freeze({ slotId: "pair-b-y", groupId: "pair-b", groupLabel: "순서쌍 2", label: "y" })
    ]),
    21: Object.freeze([
      Object.freeze({ slotId: "p-x", groupId: "point-p", groupLabel: "P", label: "x" }),
      Object.freeze({ slotId: "p-y", groupId: "point-p", groupLabel: "P", label: "y" }),
      Object.freeze({ slotId: "q-x", groupId: "point-q", groupLabel: "Q", label: "x" }),
      Object.freeze({ slotId: "q-y", groupId: "point-q", groupLabel: "Q", label: "y" })
    ])
  });

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { deepFreeze(value[key]); });
    return Object.freeze(value);
  }

  function questionFromItem(item) {
    const responseType = item.responseCandidate;
    const question = { number: item.number, responseType };
    if (responseType === "multi_input") question.fields = MULTI_FIELDS[item.number];
    return deepFreeze(question);
  }

  const questions = Object.freeze(inventoryModule.inventory.items.map(questionFromItem));

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
    if (rows.length !== 40) issues.push("schema.item_count");
    const seen = new Set();
    rows.forEach(function (question, index) {
      const prefix = `question.${index + 1}`;
      if (!question || question.number !== index + 1) issues.push(`${prefix}.number`);
      if (!question || seen.has(question.number)) issues.push(`${prefix}.duplicate`);
      if (question) seen.add(question.number);
      if (!question || !TYPE_SET.has(question.responseType)) issues.push(`${prefix}.response_type`);
      if (question && question.responseType === "multi_input") {
        const expected = MULTI_FIELDS[question.number];
        if (!expected || question.fields !== expected) issues.push(`${prefix}.fields`);
      } else if (question && Object.prototype.hasOwnProperty.call(question, "fields")) {
        issues.push(`${prefix}.unexpected_fields`);
      }
    });
    inspectPublic(template, "schema", issues);
    return Object.freeze(Array.from(new Set(issues)).sort());
  }

  const template = deepFreeze({ examId: EXAM_ID, schemaVersion: SCHEMA_VERSION, questions });
  if (validate(template).length) throw new Error("invalid SH-R01 public response schema");

  function forStudent(studentId) {
    const id = String(studentId || "").trim();
    if (!/^[A-Za-z0-9_-]{3,120}$/.test(id)) throw new Error("invalid student id");
    return deepFreeze({ examId: EXAM_ID, studentId: id, schemaVersion: SCHEMA_VERSION, questions });
  }

  return Object.freeze({ EXAM_ID, SCHEMA_VERSION, TYPES, MULTI_FIELDS, template, questions, validate, forStudent });
});
