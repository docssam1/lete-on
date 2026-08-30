import { CONCEPT_DEFINITION_BY_ID, CONCEPT_DEFINITIONS, TYPE_CONCEPT_LESSONS } from "./concept-data.js";
import { CURRICULUM, DOMAINS, REPRESENTATIVE_CONCEPTS, TYPES, representativeConceptForType } from "./source-data.js";

const fail = (message) => {
  throw new Error(`CONCEPT_QUALITY_AUDIT_FAILED: ${message}`);
};
const assert = (condition, message) => {
  if (!condition) fail(message);
};

const curriculumTypeIds = new Set(CURRICULUM.flatMap((book) => book.units.flatMap((unit) => unit.typeIds)));
const typePlacements = CURRICULUM.flatMap((book) => book.units.flatMap((unit) => unit.typeIds));
const typeById = new Map(TYPES.map((item) => [item.id, item]));
const domainSummary = new Map(DOMAINS.map((domain) => [domain.id, (middle) => {
  const templates = {
    number: `${middle}에서 수와 식의 관계를 이해하고 여러 표현을 서로 연결합니다.`,
    pattern: `${middle}에서 반복과 변화를 찾아 같은 규칙을 다음 단계에 적용합니다.`,
    logic: `${middle}에서 주어진 조건을 빠짐없이 정리해 가능한 경우를 좁힙니다.`,
    geometry: `${middle}에서 모양·위치·공간 관계를 관찰하고 변화를 정확히 나타냅니다.`
  };
  return templates[domain.id];
}]));

assert(curriculumTypeIds.size === 442, `expected 442 unique curriculum types, got ${curriculumTypeIds.size}`);
assert(typePlacements.length === 489, `expected 489 curriculum placements, got ${typePlacements.length}`);
assert(CONCEPT_DEFINITIONS.length === 47, `expected 47 explicit concept definitions, got ${CONCEPT_DEFINITIONS.length}`);
assert(Object.keys(TYPE_CONCEPT_LESSONS).length === 51, `expected 51 Book 1-3 concept links, got ${Object.keys(TYPE_CONCEPT_LESSONS).length}`);
assert(new Set(CONCEPT_DEFINITIONS.map((definition) => definition.id)).size === CONCEPT_DEFINITIONS.length, "duplicate concept definition id");

const expectedPilot = Object.freeze({
  "shape-quarter-half-turn": Object.freeze({
    conceptId: "concept:geometry:rotation-center-turn",
    placementBooks: Object.freeze(["book-01", "book-04"])
  }),
  "fold-cut-shape-choice": Object.freeze({
    conceptId: "concept:geometry:fold-reflection-unfold",
    placementBooks: Object.freeze(["book-01"])
  }),
  "circular-magic-line-sum": Object.freeze({
    conceptId: "concept:number:common-center-equal-line-sum",
    placementBooks: Object.freeze(["book-01", "book-09"])
  }),
  "person-item-logic": Object.freeze({
    conceptId: "concept:logic:one-to-one-elimination",
    placementBooks: Object.freeze(["book-01", "book-04"])
  }),
  "shape-mirror-direction": Object.freeze({
    conceptId: "concept:geometry:mirror-line-reflection",
    placementBooks: Object.freeze(["book-01", "book-04"])
  }),
  "fold-number-cut-sum-textbook": Object.freeze({
    conceptId: "concept:geometry:folded-number-cut-sum",
    placementBooks: Object.freeze(["book-01"])
  }),
  "cross-shape-magic-sum": Object.freeze({
    conceptId: "concept:number:cross-center-equal-sum",
    placementBooks: Object.freeze(["book-01"])
  }),
  "two-digit-condition": Object.freeze({
    conceptId: "concept:number:two-digit-place-conditions",
    placementBooks: Object.freeze(["book-01"])
  }),
  "shape-flip-composition": Object.freeze({
    conceptId: "concept:geometry:sequential-rigid-transforms",
    placementBooks: Object.freeze(["book-01"])
  }),
  "digital-digit-transform": Object.freeze({
    conceptId: "concept:pattern:seven-segment-transform",
    placementBooks: Object.freeze(["book-01", "book-04"])
  }),
  "digital-two-digit-transform": Object.freeze({
    conceptId: "concept:pattern:seven-segment-transform",
    placementBooks: Object.freeze(["book-01"])
  }),
  "t-shape-magic-sum": Object.freeze({
    conceptId: "concept:number:shared-junction-equal-sum",
    placementBooks: Object.freeze(["book-01"])
  }),
  "gakuro-card-rectangle-placement": Object.freeze({
    conceptId: "concept:number:row-column-sum-constraints",
    placementBooks: Object.freeze(["book-01"])
  }),
  "gakuro-grid-sum": Object.freeze({
    conceptId: "concept:number:row-column-sum-constraints",
    placementBooks: Object.freeze(["book-01"])
  }),
  "gakuro-grid-nine-sum": Object.freeze({
    conceptId: "concept:number:row-column-sum-constraints",
    placementBooks: Object.freeze(["book-01"])
  }),
  "three-digit-step-sequence": Object.freeze({
    conceptId: "concept:pattern:constant-step-sequence",
    placementBooks: Object.freeze(["book-01"])
  }),
  "two-digit-even-ones-greater-gap": Object.freeze({
    conceptId: "concept:number:two-digit-place-conditions",
    placementBooks: Object.freeze(["book-01"])
  }),
  "equal-partition-two": Object.freeze({
    conceptId: "concept:number:equal-partition-two",
    sourceBookId: "book-02",
    placementBooks: Object.freeze(["book-02"])
  }),
  "equal-partition-four": Object.freeze({
    conceptId: "concept:number:nested-halving-four",
    sourceBookId: "book-02",
    placementBooks: Object.freeze(["book-02"])
  }),
  "equal-partition-three": Object.freeze({
    conceptId: "concept:number:equal-partition-three",
    sourceBookId: "book-02",
    placementBooks: Object.freeze(["book-02"])
  }),
  "shape-sum-table": Object.freeze({
    conceptId: "concept:number:shape-sum-matrix-elimination",
    sourceBookId: "book-02",
    placementBooks: Object.freeze(["book-02"])
  }),
  "equalize-transfer": Object.freeze({
    conceptId: "concept:number:transfer-equalization",
    sourceBookId: "book-02",
    placementBooks: Object.freeze(["book-02"])
  }),
  "total-difference": Object.freeze({
    conceptId: "concept:number:sum-difference-split",
    sourceBookId: "book-02",
    placementBooks: Object.freeze(["book-02"])
  }),
  "balance-order-chain": Object.freeze({
    conceptId: "concept:logic:balance-transitive-order",
    sourceBookId: "book-02",
    placementBooks: Object.freeze(["book-02"])
  }),
  "distinct-shape-value-equation": Object.freeze({
    conceptId: "concept:number:distinct-symbol-equation-chain",
    sourceBookId: "book-02",
    placementBooks: Object.freeze(["book-02"])
  }),
  "repeating-number-sequence": Object.freeze({
    conceptId: "concept:pattern:shortest-number-repeat-unit",
    sourceBookId: "book-02",
    placementBooks: Object.freeze(["book-02"])
  }),
  "repeating-symbol-sequence": Object.freeze({
    conceptId: "concept:pattern:multi-attribute-repeat-unit",
    sourceBookId: "book-02",
    placementBooks: Object.freeze(["book-02"])
  }),
  "matchstick-shared-polygon-growth": Object.freeze({
    conceptId: "concept:pattern:shared-edge-linear-growth",
    sourceBookId: "book-02",
    placementBooks: Object.freeze(["book-02"])
  }),
  "triangular-stone-growth": Object.freeze({
    conceptId: "concept:pattern:triangular-two-color-count",
    sourceBookId: "book-02",
    placementBooks: Object.freeze(["book-02", "book-05"])
  }),
  "square-border-stone-growth": Object.freeze({
    conceptId: "concept:pattern:square-border-interior-count",
    sourceBookId: "book-02",
    placementBooks: Object.freeze(["book-02", "book-05"])
  }),
  "four-number-center-rule": Object.freeze({
    conceptId: "concept:number:four-outer-center-operation",
    sourceBookId: "book-02",
    placementBooks: Object.freeze(["book-02"])
  }),
  "number-grid-row-rule": Object.freeze({
    conceptId: "concept:number:uniform-row-operation",
    sourceBookId: "book-02",
    placementBooks: Object.freeze(["book-02"])
  }),
  "two-digit-compose-rule": Object.freeze({
    conceptId: "concept:number:compose-two-digit-operation",
    sourceBookId: "book-02",
    placementBooks: Object.freeze(["book-02"])
  }),
  "sudoku-three-row-column": Object.freeze({
    conceptId: "concept:logic:latin-row-column-three",
    sourceBookId: "book-02",
    placementBooks: Object.freeze(["book-02"])
  }),
  "sudoku-four-square-region": Object.freeze({
    conceptId: "concept:logic:latin-row-column-region-four",
    sourceBookId: "book-02",
    placementBooks: Object.freeze(["book-02"])
  }),
  "tangram-shape-composition": Object.freeze({
    conceptId: "concept:geometry:tangram-composition",
    sourceBookId: "book-03",
    placementBooks: Object.freeze(["book-03"])
  }),
  "unit-grid-area": Object.freeze({
    conceptId: "concept:geometry:unit-grid-area",
    sourceBookId: "book-03",
    placementBooks: Object.freeze(["book-03", "book-09"])
  }),
  "equal-part-shaded-fraction": Object.freeze({
    conceptId: "concept:geometry:equal-parts-fraction",
    sourceBookId: "book-03",
    placementBooks: Object.freeze(["book-03"])
  }),
  "equal-partition-drawing": Object.freeze({
    conceptId: "concept:geometry:equal-partition-construction",
    sourceBookId: "book-03",
    placementBooks: Object.freeze(["book-03"])
  }),
  "folded-strip-length": Object.freeze({
    conceptId: "concept:geometry:folded-strip-total-length",
    sourceBookId: "book-03",
    placementBooks: Object.freeze(["book-03"])
  }),
  "midpoint-number-line": Object.freeze({
    conceptId: "concept:number:number-line-midpoint",
    sourceBookId: "book-03",
    placementBooks: Object.freeze(["book-03"])
  }),
  "equal-interval-length": Object.freeze({
    conceptId: "concept:geometry:equal-interval-unit-length",
    sourceBookId: "book-03",
    placementBooks: Object.freeze(["book-03"])
  }),
  "walking-step-ratio": Object.freeze({
    conceptId: "concept:number:step-length-ratio",
    sourceBookId: "book-03",
    placementBooks: Object.freeze(["book-03"])
  }),
  "route-distance-multiple": Object.freeze({
    conceptId: "concept:number:route-distance-multiple",
    sourceBookId: "book-03",
    placementBooks: Object.freeze(["book-03"])
  }),
  "rod-ratio-total-book3": Object.freeze({
    conceptId: "concept:number:rod-ratio-shared-unit",
    sourceBookId: "book-03",
    placementBooks: Object.freeze(["book-03"])
  }),
  "cryptarithm-repeated-number-double": Object.freeze({
    conceptId: "concept:number:repeated-two-digit-doubling",
    sourceBookId: "book-03",
    placementBooks: Object.freeze(["book-03"])
  }),
  "cryptarithm-fixed-digit-addition": Object.freeze({
    conceptId: "concept:number:fixed-digit-cryptarithm",
    sourceBookId: "book-03",
    placementBooks: Object.freeze(["book-03"])
  }),
  "cryptarithm-multi-symbol-carry": Object.freeze({
    conceptId: "concept:number:multi-symbol-carry",
    sourceBookId: "book-03",
    placementBooks: Object.freeze(["book-03"])
  }),
  "binary-weight-selection": Object.freeze({
    conceptId: "concept:number:binary-weight-decomposition",
    sourceBookId: "book-03",
    placementBooks: Object.freeze(["book-03"])
  }),
  "colored-cell-number-code": Object.freeze({
    conceptId: "concept:pattern:colored-cell-place-value",
    sourceBookId: "book-03",
    placementBooks: Object.freeze(["book-03"])
  }),
  "magic-square-three-target": Object.freeze({
    conceptId: "concept:number:magic-square-target",
    sourceBookId: "book-03",
    placementBooks: Object.freeze(["book-03", "book-09"])
  })
});
assert(Object.keys(TYPE_CONCEPT_LESSONS).sort().join(",") === Object.keys(expectedPilot).sort().join(","), "pilot type set changed");

const lockedConceptTypeIds = new Set(CURRICULUM.flatMap((book) => book.units.flatMap((unit) =>
  Object.entries(unit.sourceAuditBlockedStages || {})
    .filter(([, stages]) => stages.includes("concept"))
    .map(([typeId]) => typeId))));
assert([...lockedConceptTypeIds].every((typeId) => !Object.hasOwn(expectedPilot, typeId)),
  `locked concept-stage type entered expectedPilot: ${[...lockedConceptTypeIds].filter((typeId) => Object.hasOwn(expectedPilot, typeId)).join(",")}`);

const forbiddenPrivateOrAnswerData = /(?:[a-z]:[\\/]|\\\\|g:\\|c:\\|\/users\/|\banswer\b|정답|seed)/i;
for (const [typeId, expected] of Object.entries(expectedPilot)) {
  const lesson = TYPE_CONCEPT_LESSONS[typeId];
  const definition = CONCEPT_DEFINITION_BY_ID[lesson.conceptId];
  const concept = representativeConceptForType(typeId);
  const sourceBookId = expected.sourceBookId || "book-01";
  const sourceBook = CURRICULUM.find((book) => book.id === sourceBookId);
  const sourceBookNumber = Number(sourceBookId.split("-")[1]);
  assert(sourceBook, `${sourceBookId}: curriculum source is missing`);
  assert(curriculumTypeIds.has(typeId), `${typeId}: not in curriculum`);
  assert(lesson.conceptId === expected.conceptId, `${typeId}: wrong concept id`);
  assert(definition, `${typeId}: concept definition missing`);
  assert(definition.definition.trim().length > 30, `${typeId}: generic or missing definition`);
  assert(definition.invariant.trim().length > 30, `${typeId}: generic or missing invariant`);
  assert(Array.isArray(definition.representationKinds) && definition.representationKinds.length >= 3, `${typeId}: representation kinds missing`);
  assert(lesson.beats.length === 3, `${typeId}: expected exactly three beats`);
  assert(new Set(lesson.beats.map((beat) => beat.id)).size === 3, `${typeId}: duplicate beat id`);
  assert(new Set(lesson.beats.map((beat) => beat.label)).size === 3, `${typeId}: duplicate beat label`);
  assert(lesson.beats.every((beat) => beat.id && beat.label && beat.text), `${typeId}: incomplete beat`);
  assert(lesson.misconception.trim().length > 12, `${typeId}: misconception missing`);
  assert(lesson.verificationState === "source-confirmed", `${typeId}: verification state changed`);
  assert(lesson.scope === "global-type-id" && lesson.sharedByDesign === true, `${typeId}: intentional type-level sharing contract missing`);
  const sourceRefs = sourceBook.units.flatMap((unit) => (unit.typeStudyRefs?.[typeId]?.concept || []).map((reference) => ({
    bookId: sourceBook.id,
    unitLabel: unit.label,
    stage: "concept",
    section: reference.section,
    group: reference.group,
    numbers: reference.numbers
  })));
  const evidenceRefs = lesson.sourceEvidence.map((sourceEvidence) => ({
    bookId: sourceEvidence.bookId,
    unitLabel: sourceEvidence.unitLabel,
    stage: sourceEvidence.stage,
    section: sourceEvidence.section,
    group: sourceEvidence.group,
    numbers: sourceEvidence.numbers
  }));
  assert(sourceRefs.length > 0, `${typeId}: ${sourceBookId} concept-stage source references are missing`);
  assert(JSON.stringify(evidenceRefs) === JSON.stringify(sourceRefs), `${typeId}: evidence does not match ${sourceBookId} typeStudyRefs`);
  assert(lesson.sourceEvidence.every((sourceEvidence) => sourceEvidence.source === `Fields the Classic Course 1 Book ${sourceBookNumber}`
    && sourceEvidence.verificationState === "source-confirmed"
    && sourceEvidence.visibility === "public-safe"), `${typeId}: unsafe evidence state`);
  const placementBooks = CURRICULUM.filter((book) => book.units.some((unit) => unit.typeIds.includes(typeId))).map((book) => book.id);
  assert(JSON.stringify(placementBooks) === JSON.stringify(expected.placementBooks), `${typeId}: curriculum placement books changed`);
  assert(!forbiddenPrivateOrAnswerData.test(JSON.stringify({ definition, lesson })), `${typeId}: private path or answer data leaked`);
  assert(concept.lessonQuality === "source-backed", `${typeId}: source-backed lesson missing`);
  assert(concept.beats === lesson.beats && concept.sourceEvidence === lesson.sourceEvidence, `${typeId}: rich lesson contract lost`);
  assert(concept.scope === "global-type-id" && concept.sharedByDesign === true, `${typeId}: shared concept contract was not carried to the UI model`);
}

let sourceBackedCount = 0;
let principleOnlyCount = 0;
let genericSummaryCount = 0;
const conceptFanout = new Map();
for (const typeId of curriculumTypeIds) {
  const item = typeById.get(typeId);
  const concept = representativeConceptForType(typeId);
  assert(item, `${typeId}: unknown curriculum type`);
  assert(concept?.principle?.trim(), `${typeId}: explicit type-specific principle missing`);
  assert(concept.specificity === "type-specific", `${typeId}: type-specific principle contract missing`);
  if (concept.lessonQuality === "source-backed") sourceBackedCount += 1;
  else if (concept.lessonQuality === "principle-only") principleOnlyCount += 1;
  else fail(`${typeId}: unknown lesson quality ${concept.lessonQuality}`);
  const genericSummary = domainSummary.get(item.domain)?.(item.middle);
  if (concept.summary === genericSummary) genericSummaryCount += 1;
  conceptFanout.set(concept.id, (conceptFanout.get(concept.id) || 0) + 1);
}

assert(sourceBackedCount === 51, `expected 51 source-backed types, got ${sourceBackedCount}`);
assert(principleOnlyCount === 391, `expected 391 principle-only types, got ${principleOnlyCount}`);
assert(REPRESENTATIVE_CONCEPTS.length >= 142, `expected at least 142 actual concept nodes, got ${REPRESENTATIVE_CONCEPTS.length}`);
const maxFanout = Math.max(...conceptFanout.values());

console.log(`CONCEPT_QUALITY_AUDIT_OK uniqueTypes=${curriculumTypeIds.size} placements=${typePlacements.length} conceptNodes=${REPRESENTATIVE_CONCEPTS.length} sourceBacked=${sourceBackedCount} principleOnly=${principleOnlyCount} genericSummary=${genericSummaryCount} maxFanout=${maxFanout}`);
