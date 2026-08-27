import { CURRICULUM, TYPES, typeById } from "./source-data.js";

const assert = (condition, message) => {
  if (!condition) throw new Error(`TYPE_PRECISION_AUDIT_FAILED: ${message}`);
};

const curriculumTypeIds = new Set(CURRICULUM.flatMap((book) => book.units.flatMap((unit) => unit.typeIds)));
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

const unverifiedMultiplicationCryptarithm = typeById("multiplicative-symbol-equation");
assert(unverifiedMultiplicationCryptarithm, "multiplication-symbol placeholder missing");
assert(!unverifiedMultiplicationCryptarithm.generator && !unverifiedMultiplicationCryptarithm.sourceMatched, "unverified multiplication cryptarithm was opened without source evidence");
assert(!curriculumTypeIds.has("multiplicative-symbol-equation"), "unverified multiplication cryptarithm was linked to a textbook");

console.log(`TYPE_PRECISION_AUDIT_OK exactTypes=${requiredTypes.size} curriculumTypes=${curriculumTypeIds.size} broadFoldTypes=0`);
