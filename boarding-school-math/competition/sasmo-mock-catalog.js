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
    formVersion: "2019-g6-r1",
    programId: "sasmo",
    year: 2019,
    levelId: "G6",
    comparisonKey: "sasmo:g6:15x2-1_10x4:v1",
    scoringFingerprintSha256: "189222535874465b8ac2323a9672d445d978822278db8ad75472e06453caac05",
    sourceFingerprintSha256: "a2e7191c21d29fdfb5b9f8a0d08018df6d7c1b318d0e05207dcc522696074d6b",
    packFingerprintSha256: "0eea425f4fe4cef9270b92fe92dc41a7be76995fc4f44d24cc377f7c7c1272a7",
    sourceState: "private-verified-reference",
    sections: Object.freeze([
      Object.freeze({ id: "A", firstQuestionNumber: 1, itemCount: 15, correctPoints: 2, incorrectPoints: -1, blankPoints: 0 }),
      Object.freeze({ id: "B", firstQuestionNumber: 16, itemCount: 10, correctPoints: 4, incorrectPoints: 0, blankPoints: 0 })
    ]),
    items: Object.freeze(ITEMS.map(function (entry, index) {
      return Object.freeze({ questionNumber: index + 1, axisId: entry[0], skillId: entry[1] });
    }))
  });

  const PRIVATE_REVIEWS = Object.freeze({
    "sasmo-2019-g6-baseline-a": Object.freeze({
      schemaVersion: "gfield-private-sasmo-english-review-v1",
      packId: "sasmo-2019-g6-english-review-v1",
      imageIndexSha256: "aa99ae06b66a294a158248536be508faee1104d1b2d6ef48c165b94353145e07",
      studentSha256: "b5c4cf91a6e76efed5a6836d020caa6a72fb66479ec7a4e8eb09cfc035e6a64a",
      teacherSha256: "89f8538e59e979fe64b50331d7d5fe2871df2606dd7f6730d6106042ffc2963e"
    })
  });

  const forms = Object.freeze([g6Baseline2019]);
  function getForm(formId) {
    return forms.find(function (form) { return form.formId === formId; }) || null;
  }
  function availableFor(levelId) {
    return Object.freeze(forms.filter(function (form) { return form.levelId === String(levelId || "").trim().toUpperCase(); }));
  }
  function getPrivateReview(formId) {
    return PRIVATE_REVIEWS[formId] || null;
  }
  return Object.freeze({ FORM_SCHEMA_VERSION, forms, getForm, availableFor, getPrivateReview });
});
