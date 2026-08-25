(function (root, factory) {
  "use strict";
  const drafts = typeof module !== "undefined" && module.exports ? require("./exam-draft-core.js") : root.HIGHSELECT_EXAM_DRAFT_CORE;
  const api = factory(drafts);
  root.HIGHSELECT_EXAM_OUTPUT_PREVIEW = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (drafts) {
  "use strict";
  if (!drafts) throw new Error("exam draft core is required");
  const PREVIEW_SCHEMA = "highselect-exam-output-preview/v1";
  function count(value) { const number = Number(value == null ? 10 : value); if (!Number.isSafeInteger(number) || number < 1 || number > 20) throw new TypeError("questionsPerPage must be between 1 and 20"); return number; }
  function build(draft, placements, options) {
    const questionsPerPage = count(options && options.questionsPerPage);
    const validation = drafts.validateExamDraft(draft, placements);
    const rows = placements.slice().sort(function (a, b) { return a.order - b.order; }).map(function (placement, index) {
      return Object.freeze({ number: index + 1, placementId: placement.id, points: placement.points, responseType: placement.item.responseType });
    });
    const pages = [];
    for (let index = 0; index < rows.length; index += questionsPerPage) pages.push(Object.freeze({ pageNumber: pages.length + 1, questions: Object.freeze(rows.slice(index, index + questionsPerPage)) }));
    return Object.freeze({
      schemaVersion: PREVIEW_SCHEMA, draftId: draft.id, title: draft.title, mode: draft.mode, questionsPerPage,
      eligibleForProduction: validation.eligible, issues: validation.issues, pages: Object.freeze(pages),
      answerResponseLayout: Object.freeze(rows)
    });
  }
  return Object.freeze({ PREVIEW_SCHEMA, build });
});
