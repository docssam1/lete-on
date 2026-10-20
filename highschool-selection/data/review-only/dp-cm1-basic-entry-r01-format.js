(function (root, factory) {
  "use strict";
  const api = factory();
  root.HIGHSELECT_DP_CM1_BASIC_ENTRY_R01_FORMAT = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  // Number and answer-entry mode only. Source IDs, correct answers, and solutions remain private.
  const choiceNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 14, 18, 22, 23, 24, 25, 26, 30]);
  const items = Object.freeze(Array.from({ length: 30 }, (_, index) => Object.freeze({
    number: index + 1,
    responseFormatCandidate: choiceNumbers.has(index + 1) ? "single_choice" : "short_answer"
  })));
  return Object.freeze({ examId: "dp-common1-basic-entry-mock-r01", items });
});
