(function (root, factory) {
  "use strict";
  const core = typeof module !== "undefined" && module.exports
    ? require("./question-bank-core.js")
    : root.HIGHSELECT_QUESTION_BANK_CORE;
  const api = factory(core);
  root.HIGHSELECT_QUESTION_ITEM_INDEX = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (core) {
  "use strict";

  const INDEX_SCHEMA_VERSION = 1;
  const LOCATOR_KINDS = Object.freeze(["concept", "example", "mission", "exercise", "unknown"]);
  const DISCOVERY_STATUSES = Object.freeze(["page_located", "ocr_candidate", "visual_verified"]);
  const CLASSIFICATION_STATUSES = Object.freeze(["pending", "reviewed", "approved"]);
  const ALLOWED_FIELDS = Object.freeze([
    "id", "sourceRef", "locator", "discoveryStatus", "curriculum", "classificationStatus",
    "answerStatus", "reuse", "releaseStatus"
  ]);

  function invariant(condition, message) {
    if (!condition) throw new TypeError(message);
  }

  function enumValue(value, allowed, field) {
    invariant(allowed.includes(value), `${field} is not allowed`);
    return value;
  }

  function bounded(value, field) {
    const number = Number(value);
    invariant(Number.isFinite(number) && number >= 0 && number <= 1, `${field} must be between 0 and 1`);
    return number;
  }

  function createLocatorKey(sourceFingerprint, page, slot) {
    const fingerprint = String(sourceFingerprint == null ? "" : sourceFingerprint).toLowerCase();
    invariant(/^[0-9a-f]{64}$/.test(fingerprint), "sourceFingerprint must be a SHA-256 digest");
    const pageNumber = Number(page);
    const slotNumber = Number(slot);
    invariant(Number.isSafeInteger(pageNumber) && pageNumber >= 1, "page must be a positive integer");
    invariant(Number.isSafeInteger(slotNumber) && slotNumber >= 1, "slot must be a positive integer");
    return `loc:${fingerprint.slice(0, 24)}:p${String(pageNumber).padStart(4, "0")}:s${String(slotNumber).padStart(3, "0")}`;
  }

  function createLocator(input) {
    invariant(input && typeof input === "object", "locator is required");
    const page = Number(input.page);
    const slot = Number(input.slot);
    invariant(Number.isSafeInteger(page) && page >= 1, "locator.page must be a positive integer");
    invariant(Number.isSafeInteger(slot) && slot >= 1, "locator.slot must be a positive integer");
    const result = { page, slot, kind: enumValue(input.kind, LOCATOR_KINDS, "locator.kind") };
    if (input.box != null) {
      invariant(input.box && typeof input.box === "object", "locator.box must be an object");
      result.box = Object.freeze({
        x: bounded(input.box.x, "locator.box.x"),
        y: bounded(input.box.y, "locator.box.y"),
        width: bounded(input.box.width, "locator.box.width"),
        height: bounded(input.box.height, "locator.box.height")
      });
      invariant(result.box.x + result.box.width <= 1.000001, "locator.box exceeds page width");
      invariant(result.box.y + result.box.height <= 1.000001, "locator.box exceeds page height");
    }
    return Object.freeze(result);
  }

  function createCurriculum(input, status) {
    if (status === "pending") {
      invariant(input == null, "pending curriculum must remain null");
      return null;
    }
    return core.createCurriculumPath(input);
  }

  function createItemIndexEntry(input) {
    invariant(input && typeof input === "object", "item index entry is required");
    const extra = Object.keys(input).filter(function (key) { return !ALLOWED_FIELDS.includes(key); });
    invariant(extra.length === 0, `item index entry contains protected or unknown fields: ${extra.join(",")}`);
    invariant(core.isSharedBankId(input.id, "question"), "id must be a shared question-bank id");
    invariant(core.isSharedBankId(input.sourceRef, "source"), "sourceRef must be a shared source id");
    const classificationStatus = enumValue(input.classificationStatus, CLASSIFICATION_STATUSES, "classificationStatus");
    const answerStatus = enumValue(input.answerStatus, core.ANSWER_VERIFICATION_STATUSES, "answerStatus");
    invariant(Array.isArray(input.reuse) && input.reuse.length > 0, "reuse modes are required");
    const reuse = Array.from(new Set(input.reuse.map(function (mode) {
      const normalized = String(mode).toUpperCase();
      invariant(core.PROGRAM_MODES.includes(normalized), "reuse mode is not allowed");
      return normalized;
    }))).sort();
    invariant(input.releaseStatus === "locked", "new source items must remain release locked");
    return Object.freeze({
      id: input.id,
      sourceRef: input.sourceRef,
      locator: createLocator(input.locator),
      discoveryStatus: enumValue(input.discoveryStatus, DISCOVERY_STATUSES, "discoveryStatus"),
      curriculum: createCurriculum(input.curriculum, classificationStatus),
      classificationStatus,
      answerStatus,
      reuse: Object.freeze(reuse),
      releaseStatus: "locked"
    });
  }

  return Object.freeze({
    INDEX_SCHEMA_VERSION,
    LOCATOR_KINDS,
    DISCOVERY_STATUSES,
    CLASSIFICATION_STATUSES,
    createLocatorKey,
    createLocator,
    createItemIndexEntry
  });
});
