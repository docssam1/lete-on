(function (root, factory) {
  "use strict";
  const drafts = typeof module !== "undefined" && module.exports
    ? require("./exam-draft-core.js")
    : root.HIGHSELECT_EXAM_DRAFT_CORE;
  const api = factory(drafts);
  root.HIGHSELECT_EXAM_CANDIDATE_QUERY = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (drafts) {
  "use strict";

  if (!drafts) throw new Error("exam draft core is required");
  const SORTS = Object.freeze(["item_id", "curriculum", "difficulty", "response_type"]);

  function clean(value) { return String(value == null ? "" : value).trim(); }
  function queryCandidates(draft, candidates, options) {
    const opts = options || {};
    const sort = clean(opts.sort || "item_id");
    if (!SORTS.includes(sort)) throw new TypeError("candidate sort is not allowed");
    const pathKey = clean(opts.pathKey);
    const difficultyBand = clean(opts.difficultyBand);
    const responseType = clean(opts.responseType);
    const typeId = clean(opts.typeId);
    const source = Array.isArray(candidates) ? candidates : [];
    const items = source.map(function (candidate) { return drafts.createCandidate(candidate, draft); }).filter(function (candidate) {
      return (!pathKey || candidate.curriculum.key === pathKey)
        && (!difficultyBand || candidate.difficultyBand === difficultyBand)
        && (!responseType || candidate.responseType === responseType)
        && (!typeId || candidate.typeId === typeId);
    });
    const compare = {
      item_id: function (a, b) { return a.itemId.localeCompare(b.itemId); },
      curriculum: function (a, b) { return a.curriculum.key.localeCompare(b.curriculum.key) || a.itemId.localeCompare(b.itemId); },
      difficulty: function (a, b) { return a.difficultyBand.localeCompare(b.difficultyBand) || a.itemId.localeCompare(b.itemId); },
      response_type: function (a, b) { return a.responseType.localeCompare(b.responseType) || a.itemId.localeCompare(b.itemId); }
    }[sort];
    return Object.freeze(items.sort(compare));
  }

  function candidateFacets(draft, candidates) {
    const items = queryCandidates(draft, candidates, { sort: "item_id" });
    function values(key) { return Object.freeze(Array.from(new Set(items.map(function (item) { return key(item); }))).sort()); }
    return Object.freeze({
      total: items.length,
      pathKeys: values(function (item) { return item.curriculum.key; }),
      difficultyBands: values(function (item) { return item.difficultyBand; }),
      responseTypes: values(function (item) { return item.responseType; }),
      typeIds: values(function (item) { return item.typeId; })
    });
  }

  return Object.freeze({ SORTS, queryCandidates, candidateFacets });
});
