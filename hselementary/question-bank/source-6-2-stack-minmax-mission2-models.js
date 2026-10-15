(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./source-6-2-stack-count-models.js"));
  } else {
    root.HSE_SOURCE_GRADE6_STACK_MINMAX_MISSION2_MODELS = factory(root.HSE_SOURCE_GRADE6_STACK_COUNT_MODELS);
  }
})(typeof window !== "undefined" ? window : globalThis, function (counts) {
  "use strict";
  if (!counts || typeof counts.enumerate !== "function") throw new Error("Stack count enumeration dependency is required");
  const copy = value => JSON.parse(JSON.stringify(value));
  const fail = message => { throw new RangeError(message); };
  function freeze(value) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze);
      Object.freeze(value);
    }
    return value;
  }
  const verification = freeze({ registrationOnly: true, official: false, officialAnswerVerified: false,
    learnerReleaseVerified: false, renderedFidelityVerified: false, difficultyVerified: false,
    directionPresentationVerified: false });
  const sourceItemId = "6-2-u3-e2-mission-2";
  const top = [[1,0,0],[1,1,1],[0,1,1],[1,1,1]];
  const conditionPolicy = freeze({
    finitePoolOnly: true, peaks: [4,5,6], exactFootprint: true, columnCount: 9,
    totalGiven: false, extraHeightClueGiven: false, fixedHeightsSecondaryOnly: true,
    answerBasis: "Independent calculation under the fixed projection convention; not a publisher key.",
    requestedAnswer: "Sum of the minimum and maximum cube counts, not a unique arrangement.",
    supportRule: "Each occupied footprint cell has one positive, gap-free column from the ground; no other columns.",
    directionRule: "Top rows go back to front; front columns go left to right; right columns go front to back.",
    releaseBoundary: "Projection direction must be explicit and visually checked before learner use; no UI, difficulty or release approval."
  });
  const source = freeze({ rawSourceItemId: sourceItemId, pdfPage: 33, printedPage: 35,
    cropFile: "mission-2-original.png", cropXYWH: [165,930,780,675],
    cropSha256: "7F559401D7D31C2591098EEAC5A65BE383697FD4D3948A0C19E8133401353574",
    independentReportFile: "remaining-four-independent-review.md", independentReportSection: "Mission 2",
    independentReportSha256: "DC272DED7B58546B03093F77C05E53FBEAACEFC224667CB9CE93CBCE2692D30C",
    evidenceBasis: "Report read and original crop visually inspected on 2026-10-12; handwritten answers excluded as authority.",
    pdfOpenedInThisWork: false, publisherAnswerProvided: false });
  const definitions = freeze([{ sourceItemId, mode: "min-max-sum", variantCount: 3,
    pools: [4,5,6].map(peak => ({ top: copy(top), front: [peak,2,3], right: [peak,3,1,3] })),
    variantPolicy: "Variant 0 preserves the source. Variants 1 and 2 change only front[0] and right[0] to 5 and 6.",
    source, conditionPolicy, ...verification }]);
  function sameArray(value, expected) {
    return Array.isArray(value) && value.length === expected.length && expected.every((entry,i) =>
      Object.hasOwn(value,i) && (Array.isArray(entry) ? sameArray(value[i],entry) : value[i] === entry));
  }
  function poolVariant(condition) {
    if (!condition || typeof condition !== "object" || Array.isArray(condition) ||
      Reflect.ownKeys(condition).some(key => !["top","front","right","fixedHeights"].includes(key)) ||
      ["top","front","right"].some(key => !Object.hasOwn(condition,key))) fail("Expected a finite Mission 2 pool condition");
    const variant = definitions[0].pools.findIndex(pool =>
      ["top","front","right"].every(key => sameArray(condition[key],pool[key])));
    if (variant < 0) fail("Only the exact Mission 2 footprint and ordered 4/5/6 profiles are supported");
    return variant;
  }
  function fixedClues(condition) {
    if (!Object.hasOwn(condition,"fixedHeights")) return undefined;
    const fixed = condition.fixedHeights;
    if (!Array.isArray(fixed) || fixed.length !== top.length) fail("Invalid secondary fixed-height clues");
    for (let row=0;row<top.length;row++) {
      if (!Object.hasOwn(fixed,row) || !Array.isArray(fixed[row]) || fixed[row].length !== top[row].length) fail("Invalid fixed-height row");
      for (let x=0;x<top[row].length;x++) {
        const height = fixed[row][x];
        if (!Object.hasOwn(fixed[row],x) || height !== null &&
          (!Number.isSafeInteger(height) || height < 0 || height > 6 || Boolean(height) !== Boolean(top[row][x]))) fail("Invalid fixed-height cell");
      }
    }
    return copy(fixed);
  }
  function enumerate(condition) {
    const variant = poolVariant(condition), fixed = fixedClues(condition);
    const normalized = copy(definitions[0].pools[variant]);
    if (fixed !== undefined) normalized.fixedHeights = fixed;
    const result = counts.enumerate(normalized);
    return freeze({ ...result, sourceItemId, variant, mode: "min-max-sum", sourceRef: source,
      answer: result.minMaxSum, answerStatus: "independent-calculation-under-fixed-direction",
      secondaryFixedHeights: fixed !== undefined, conditionPolicy,
      enumerationEngine: "source-6-2-stack-count-models.enumerate", ...verification });
  }
  function solve(id, variant = 0) {
    if (id !== sourceItemId || !Number.isSafeInteger(variant) || variant < 0 || variant > 2) fail("Unsupported Mission 2 source or variant");
    return enumerate(definitions[0].pools[variant]);
  }
  return freeze({ definitions, enumerate, solve, viewConvention: counts.viewConvention, conditionPolicy, ...verification });
});
