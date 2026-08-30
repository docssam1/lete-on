(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDSASMOMockCatalog = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  /*
   * Public, answer-free catalogue. It declares only the scoring shape and
   * learning map for a private year-paper intake. It never contains a prompt,
   * option, answer, source file path, or delivery URL.
   */
  const FORM_SCHEMA_VERSION = "gfield-sasmo-mock-readiness-v1";
  const ITEMS = Object.freeze([
    ["number-operations", "digit-product-sum"], ["data-probability", "two-set-inclusion-exclusion"], ["geometry-spatial", "polyhedron-edge-count"], ["combinatorics-logic", "adjacent-block-arrangements"], ["number-operations", "reverse-percent-total"],
    ["geometry-spatial", "square-equilateral-angle-chase"], ["patterns-algebra", "relational-coin-equations"], ["number-operations", "digit-parity-divisibility"], ["data-probability", "whole-number-frequency-count"], ["number-operations", "net-rate-leakage"],
    ["problem-solving-strategies", "weekday-cycle"], ["geometry-spatial", "clock-hand-overlap"], ["combinatorics-logic", "truth-statement-cases"], ["number-operations", "factorial-prime-coverage"], ["patterns-algebra", "figure-composition-rule"],
    ["geometry-spatial", "composite-triangle-count"], ["number-operations", "geometric-fraction-sum"], ["data-probability", "repeated-percent-change"], ["patterns-algebra", "calendar-sequence-encoding"], ["patterns-algebra", "multi-ratio-total"],
    ["combinatorics-logic", "parity-minimum-selection"], ["number-operations", "rate-cycle-lcm"], ["geometry-spatial", "composite-shaded-area"], ["combinatorics-logic", "cryptarithm-column-constraints"], ["problem-solving-strategies", "calendar-digit-count"]
  ]);

  const g6Baseline2019 = Object.freeze({
    schemaVersion: FORM_SCHEMA_VERSION,
    formId: "sasmo-2019-g6-baseline-a",
    programId: "sasmo",
    year: 2019,
    levelId: "G6",
    sourceState: "private-verified-reference",
    sections: Object.freeze([
      Object.freeze({ id: "A", firstQuestionNumber: 1, itemCount: 15, correctPoints: 2, incorrectPoints: -1, blankPoints: 0 }),
      Object.freeze({ id: "B", firstQuestionNumber: 16, itemCount: 10, correctPoints: 4, incorrectPoints: 0, blankPoints: 0 })
    ]),
    items: Object.freeze(ITEMS.map(function (entry, index) {
      return Object.freeze({ questionNumber: index + 1, axisId: entry[0], skillId: entry[1] });
    }))
  });

  const forms = Object.freeze([g6Baseline2019]);
  function getForm(formId) {
    return forms.find(function (form) { return form.formId === formId; }) || null;
  }
  function availableFor(levelId) {
    return Object.freeze(forms.filter(function (form) { return form.levelId === String(levelId || "").trim().toUpperCase(); }));
  }
  return Object.freeze({ FORM_SCHEMA_VERSION, forms, getForm, availableFor });
});
