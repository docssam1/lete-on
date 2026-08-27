import { ACADEMY_STYLES, CURRICULUM, DOMAINS, REPRESENTATIVE_CONCEPTS, SOURCE_QUESTION_INDEX, TYPES, representativeConceptForType, typeById } from "./source-data.js";

const assert = (condition, message) => {
  if (!condition) throw new Error(`TYPE_PRECISION_AUDIT_FAILED: ${message}`);
};

const curriculumTypeIds = new Set(CURRICULUM.flatMap((book) => book.units.flatMap((unit) => unit.typeIds)));
const academyStyleIds = new Set(ACADEMY_STYLES.map((item) => item.id));
const domainIds = new Set(DOMAINS.map((item) => item.id));
const representativeConceptIds = new Set(REPRESENTATIVE_CONCEPTS.map((item) => item.id));
assert(representativeConceptIds.size === REPRESENTATIVE_CONCEPTS.length, "duplicate representative concept id");
assert(REPRESENTATIVE_CONCEPTS.every((concept) => concept.label && concept.summary), "incomplete representative concept node");
assert(new Set(TYPES.map((item) => item.id)).size === TYPES.length, "duplicate type id");
for (const item of TYPES) {
  assert(domainIds.has(item.domain), `${item.id}: unknown major domain ${item.domain}`);
  assert(typeof item.middle === "string" && item.middle.trim(), `${item.id}: middle domain missing`);
  assert(typeof item.label === "string" && item.label.trim(), `${item.id}: detailed type label missing`);
  assert(Array.isArray(item.academyStyleIds) && item.academyStyleIds.length, `${item.id}: academy style tag missing`);
  assert(new Set(item.academyStyleIds).size === item.academyStyleIds.length, `${item.id}: duplicate academy style tag`);
  assert(item.academyStyleIds.every((id) => academyStyleIds.has(id)), `${item.id}: unknown academy style tag`);
  const concept = representativeConceptForType(item.id);
  assert(concept?.id && concept?.label && concept?.summary && concept?.principle, `${item.id}: representative concept missing`);
  assert(representativeConceptIds.has(concept.id), `${item.id}: unknown representative concept node`);
}

assert(SOURCE_QUESTION_INDEX.length > 0, "source question index is empty");
assert(new Set(SOURCE_QUESTION_INDEX.map((entry) => entry.sourceKey)).size === SOURCE_QUESTION_INDEX.length,
  "duplicate source question key");
for (const entry of SOURCE_QUESTION_INDEX) {
  const classification = entry.classification;
  assert(Array.isArray(entry.typeIds) && entry.typeIds.length, `${entry.sourceKey}: question type list missing`);
  assert(new Set(entry.typeIds).size === entry.typeIds.length, `${entry.sourceKey}: duplicate question type`);
  assert(Array.isArray(entry.classifications) && entry.classifications.length === entry.typeIds.length,
    `${entry.sourceKey}: question classification list mismatch`);
  assert(entry.typeIds.every((typeId) => typeById(typeId)), `${entry.sourceKey}: unknown question type`);
  assert(classification, `${entry.sourceKey}: question classification missing`);
  assert(domainIds.has(classification.majorDomainId), `${entry.sourceKey}: unknown question major domain`);
  assert(classification.minorDomain, `${entry.sourceKey}: question minor domain missing`);
  assert(classification.detailedTypeId === entry.typeId, `${entry.sourceKey}: detailed type mismatch`);
  assert(classification.representativeConceptId && classification.representativeConceptLabel,
    `${entry.sourceKey}: representative concept reference missing`);
  assert(Array.isArray(classification.academyStyleIds) && classification.academyStyleIds.length,
    `${entry.sourceKey}: question academy style missing`);
  assert(new Set(classification.academyStyleIds).size === classification.academyStyleIds.length,
    `${entry.sourceKey}: duplicate question academy style`);
  assert(classification.academyStyleIds.every((id) => academyStyleIds.has(id)),
    `${entry.sourceKey}: unknown question academy style`);
}
const requiredTypes = new Map([
  ["fold-cut-unfold-one-draw", "한 번 접어 자르고 펼친 모양 그리기"],
  ["fold-cut-unfold-two-draw", "두 번 접어 자르고 펼친 모양 그리기"],
  ["fold-number-grid-one", "한 번 접어 잘린 수의 합 구하기"],
  ["fold-number-grid-two-orthogonal", "가로·세로로 두 번 접어 잘린 수의 합"],
  ["fold-number-grid-two-diagonal", "대각선으로 두 번 접어 잘린 수의 합"],
  ["cube-count-solid", "입체 그림에서 쌓기나무 전체 개수 세기"],
  ["cube-minimum-from-solid", "입체 그림에서 필요한 쌓기나무의 최소 개수"],
  ["cube-top-number-grid", "위에서 본 바탕그림의 수로 전체 개수와 앞·옆 모양 구하기"],
  ["cube-three-views", "위·앞·옆 모양을 보고 쌓기나무 개수 구하기"],
  ["cube-three-view-minmax", "위·앞·옆 모양으로 가능한 최대·최소 개수 구하기"],
  ["cube-missing-view", "두 방향의 모양을 보고 나머지 방향 그리기"],
  ["cube-hidden-count-walled", "벽 모서리에서 보이지 않는 쌓기나무의 개수"],
  ["cube-tunnel", "여러 방향으로 구멍을 뚫은 뒤 남은 개수"],
  ["multiplication-table-pattern", "가로와 세로 머리수의 곱셈표"],
  ["product-cycle-completion", "다각형 이웃한 꼭짓점의 곱 완성"],
  ["multiplication-matrix-products", "가로·세로의 곱으로 빈칸 찾기"],
  ["multiplication-matrix-placement", "수 카드를 놓아 가로·세로의 곱 맞추기"],
  ["symbol-product-pair", "두 도형의 곱과 합으로 값 찾기"],
  ["symbol-multiplication-chain", "이어진 도형 곱셈식으로 값 찾기"],
  ["symbol-mixed-operation-grid", "곱셈·덧셈·뺄셈이 섞인 도형식"]
]);

for (const [typeId, expectedLabel] of requiredTypes) {
  const type = typeById(typeId);
  assert(type, `missing exact type ${typeId}`);
  assert(type.label === expectedLabel, `${typeId}: label changed to ${type.label}`);
  assert(type.generator || type.worksheetCode, `${typeId}: generation route missing`);
  assert(type.sourceMatched || type.bankApproved, `${typeId}: neither source-matched nor shared-bank approved`);
}

assert(!TYPES.some((type) => type.id === "fold-number-grid-multi"), "broad one-or-two-fold type returned");
assert(!TYPES.some((type) => /한두 번/.test(type.label)), "a label merges one-fold and two-fold structures");

const book04 = CURRICULUM.find((book) => book.id === "book-04");
const book04Test = new Map(book04.source.unitTestQuestions.map((question) => [question.number, question.typeId]));
assert(book04Test.get(6) === "fold-number-grid-two-orthogonal", "book 4 unit test q6 is not the exact two-orthogonal-fold type");
assert(book04Test.get(8) === "cube-count-solid", "book 4 unit test q8 is not total cube counting");
assert(book04.units[1].typeIds.includes("cube-minimum-from-solid"), "book 4 minimum-cube type missing");

const totalCube = typeById("cube-count-solid");
const minimumCube = typeById("cube-minimum-from-solid");
assert(totalCube.worksheetOptions?.promptMode === "total", "total cube type is not locked to one total answer");
assert(minimumCube.worksheetOptions?.promptMode === "minimum", "minimum cube type is not locked to one minimum answer");

const book09 = CURRICULUM.find((book) => book.id === "book-09");
for (const typeId of ["cube-top-number-grid", "cube-three-views", "cube-three-view-minmax", "cube-missing-view"]) {
  assert(book09.units[1].typeIds.includes(typeId), `book 9 cube unit missing ${typeId}`);
}

const book05 = CURRICULUM.find((book) => book.id === "book-05");
const book05MultiplicationTypes = [
  "multiplication-table-pattern",
  "product-cycle-completion",
  "multiplication-matrix-products",
  "multiplication-matrix-placement",
  "symbol-product-pair",
  "symbol-multiplication-chain",
  "symbol-mixed-operation-grid"
];
for (const typeId of book05MultiplicationTypes) {
  assert(book05.units[2].typeIds.includes(typeId), `book 5 multiplication unit missing ${typeId}`);
}
assert(new Set(book05MultiplicationTypes.map((typeId) => typeById(typeId).generator)).size === book05MultiplicationTypes.length,
  "book 5 multiplication structures share a generator");

const precisionBookTypeCounts = new Map([
  ["book-05", 38],
  ["book-06", 62],
  ["book-07", 72],
  ["book-08", 51],
  ["book-09", 63],
  ["book-10", 52]
]);
for (const [bookId, expectedCount] of precisionBookTypeCounts) {
  const book = CURRICULUM.find((item) => item.id === bookId);
  const typeIds = book.units.flatMap((unit) => unit.typeIds);
  const routeKeys = typeIds.map((typeId) => {
    const type = typeById(typeId);
    return `${type.generator || type.worksheetCode}:${JSON.stringify(type.worksheetOptions || {})}`;
  });
  assert(typeIds.length === expectedCount, `${bookId}: expected ${expectedCount} exact types, found ${typeIds.length}`);
  assert(new Set(typeIds).size === typeIds.length, `${bookId}: a type is repeated across units`);
  assert(new Set(routeKeys).size === routeKeys.length, `${bookId}: structurally different types share one generation route`);
}

const unverifiedMultiplicationCryptarithm = typeById("multiplicative-symbol-equation");
assert(unverifiedMultiplicationCryptarithm, "multiplication-symbol placeholder missing");
assert(!unverifiedMultiplicationCryptarithm.generator && !unverifiedMultiplicationCryptarithm.sourceMatched, "unverified multiplication cryptarithm was opened without source evidence");
assert(!curriculumTypeIds.has("multiplicative-symbol-equation"), "unverified multiplication cryptarithm was linked to a textbook");

console.log(`TYPE_PRECISION_AUDIT_OK exactTypes=${requiredTypes.size} curriculumTypes=${curriculumTypeIds.size} sourceQuestions=${SOURCE_QUESTION_INDEX.length} broadFoldTypes=0`);
