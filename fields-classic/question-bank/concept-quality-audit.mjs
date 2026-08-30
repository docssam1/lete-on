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
assert(CONCEPT_DEFINITIONS.length === 4, `expected four explicit concept definitions, got ${CONCEPT_DEFINITIONS.length}`);
assert(Object.keys(TYPE_CONCEPT_LESSONS).length === 4, `expected four pilot links, got ${Object.keys(TYPE_CONCEPT_LESSONS).length}`);
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
  })
});
assert(Object.keys(TYPE_CONCEPT_LESSONS).sort().join(",") === Object.keys(expectedPilot).sort().join(","), "pilot type set changed");
const sourceBook = CURRICULUM.find((book) => book.id === "book-01");
assert(sourceBook, "Book 1 curriculum source is missing");

const forbiddenPrivateOrAnswerData = /(?:[a-z]:[\\/]|\\\\|g:\\|c:\\|\/users\/|\banswer\b|정답|seed)/i;
for (const [typeId, expected] of Object.entries(expectedPilot)) {
  const lesson = TYPE_CONCEPT_LESSONS[typeId];
  const definition = CONCEPT_DEFINITION_BY_ID[lesson.conceptId];
  const concept = representativeConceptForType(typeId);
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
  assert(sourceRefs.length > 0, `${typeId}: Book 1 concept-stage source references are missing`);
  assert(JSON.stringify(evidenceRefs) === JSON.stringify(sourceRefs), `${typeId}: evidence does not match Book 1 typeStudyRefs`);
  assert(lesson.sourceEvidence.every((sourceEvidence) => sourceEvidence.source === "Fields the Classic Course 1 Book 1"
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

assert(sourceBackedCount === 4, `expected 4 source-backed types, got ${sourceBackedCount}`);
assert(principleOnlyCount === 438, `expected 438 principle-only types, got ${principleOnlyCount}`);
assert(REPRESENTATIVE_CONCEPTS.length >= 142, `expected at least 142 actual concept nodes, got ${REPRESENTATIVE_CONCEPTS.length}`);
const maxFanout = Math.max(...conceptFanout.values());

console.log(`CONCEPT_QUALITY_AUDIT_OK uniqueTypes=${curriculumTypeIds.size} placements=${typePlacements.length} conceptNodes=${REPRESENTATIVE_CONCEPTS.length} sourceBacked=${sourceBackedCount} principleOnly=${principleOnlyCount} genericSummary=${genericSummaryCount} maxFanout=${maxFanout}`);
