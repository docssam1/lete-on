import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";

const fail = (message) => { throw new Error(message); };
if (GOLDEN_BELL_BOOKS.length !== 10) fail(`expected 10 books, got ${GOLDEN_BELL_BOOKS.length}`);
if (new Set(GOLDEN_BELL_BOOKS.map((book) => book.id)).size !== 10) fail("duplicate book ids");

const readyBooks = GOLDEN_BELL_BOOKS.filter((book) => book.status === "ready");
if (!readyBooks.length) fail("no ready golden bell book");

let lessonCount = 0;
let originalItemCount = 0;
for (const book of GOLDEN_BELL_BOOKS) {
  if (!book.source?.note) fail(`${book.id}: missing source status note`);
  if (book.status === "ready" && !book.source.verified) fail(`${book.id}: ready without verified source`);
  for (const lesson of book.lessons) {
    lessonCount += 1;
    if (!lesson.sourceLocator || !lesson.representativeConcept) fail(`${book.id}/${lesson.id}: missing evidence or concept`);
    if (!lesson.sourceTypeIds?.length) fail(`${book.id}/${lesson.id}: missing source type connection`);
    if (!lesson.story?.text || !lesson.story?.mission) fail(`${book.id}/${lesson.id}: missing story layer`);
    if (!lesson.explanation?.steps?.length) fail(`${book.id}/${lesson.id}: missing concept explanation`);
    if (!lesson.original?.items?.length) fail(`${book.id}/${lesson.id}: missing original check`);
    if (!lesson.extension?.story || !lesson.extension?.answer || !lesson.extension?.explanation) fail(`${book.id}/${lesson.id}: missing story extension`);
    if (!lesson.original.structureKey || lesson.original.structureKey !== lesson.extension.structureKey) {
      fail(`${book.id}/${lesson.id}: story extension changed the original problem structure`);
    }
    if (lesson.extension.prompt === lesson.original.prompt) fail(`${book.id}/${lesson.id}: story extension reused the original prompt`);
    const extensionMode = lesson.extension.answerMode || "choice";
    if (extensionMode === "choice") {
      if (!lesson.extension.options?.includes(lesson.extension.answer)) fail(`${book.id}/${lesson.id}: extension answer not visible`);
      if (new Set(lesson.extension.options).size !== lesson.extension.options.length) fail(`${book.id}/${lesson.id}: duplicate extension choices`);
    } else if (extensionMode === "input") {
      if (lesson.extension.options?.length) fail(`${book.id}/${lesson.id}: written extension must not add choices`);
    } else fail(`${book.id}/${lesson.id}: unsupported extension answer mode ${extensionMode}`);
    const originalModes = new Set(lesson.original.items.map((item) => item.answerMode || "choice"));
    if (originalModes.size !== 1 || !originalModes.has(extensionMode)) {
      fail(`${book.id}/${lesson.id}: story extension changed the original answer format`);
    }
    for (const item of lesson.original.items) {
      originalItemCount += 1;
      const answerMode = item.answerMode || "choice";
      if (answerMode === "choice") {
        if (!item.options?.includes(item.answer)) fail(`${book.id}/${lesson.id}/${item.id}: original answer not visible`);
        if (new Set(item.options).size !== item.options.length) fail(`${book.id}/${lesson.id}/${item.id}: duplicate choices`);
      } else if (answerMode === "input") {
        if (item.options?.length) fail(`${book.id}/${lesson.id}/${item.id}: written original must not add choices`);
      } else fail(`${book.id}/${lesson.id}/${item.id}: unsupported answer mode ${answerMode}`);
    }
  }
}

const book1 = GOLDEN_BELL_BOOKS.find((book) => book.id === "book-01");
const approvedBook1Answers = new Map([
  ["clock-turning", ["12", "6", "6", "3", "9"]],
  ["fold-one-cut", ["3번"]],
  ["equal-line-sums", ["2", "4", "10"]],
  ["preference-logic", ["딸기", "수영", "키위"]]
]);
const approvedBook1AnswerModes = new Map([
  ["clock-turning", ["input", "input", "input", "input", "input"]],
  ["fold-one-cut", ["choice"]],
  ["equal-line-sums", ["input", "input", "input"]],
  ["preference-logic", ["input", "input", "input"]]
]);
for (const [lessonId, approvedAnswers] of approvedBook1Answers) {
  const lesson = book1.lessons.find((candidate) => candidate.id === lessonId);
  if (!lesson) fail(`book-01: missing approved lesson ${lessonId}`);
  const actualAnswers = lesson.original.items.map((item) => item.answer);
  if (JSON.stringify(actualAnswers) !== JSON.stringify(approvedAnswers)) {
    fail(`book-01/${lessonId}: approved original answers changed`);
  }
  const actualModes = lesson.original.items.map((item) => item.answerMode || "choice");
  const approvedModes = approvedBook1AnswerModes.get(lessonId);
  if (JSON.stringify(actualModes) !== JSON.stringify(approvedModes)) {
    fail(`book-01/${lessonId}: source answer format changed`);
  }
}
const requiredUnits = ["도형 움직이기", "색종이 접기", "마방진과 가쿠로 퍼즐", "수추리와 논리추리"];
for (const unit of requiredUnits) if (!book1.lessons.some((lesson) => lesson.unit === unit)) fail(`book-01: missing ${unit}`);
if (!book1.lessons.some((lesson) => lesson.sourceHold)) fail("book-01: unresolved source wording must remain visible in data");

const book2 = GOLDEN_BELL_BOOKS.find((book) => book.id === "book-02");
const approvedBook2Answers = new Map([
  ["addition-matrix", ["3", "4", "6", "10", "16", "8"]],
  ["balance-order", ["B,C", "B", "A>C>B"]],
  ["dual-shape-color-pattern", ["◆"]],
  ["diamond-number-promise", ["18", "9"]]
]);
for (const [lessonId, approvedAnswers] of approvedBook2Answers) {
  const lesson = book2.lessons.find((candidate) => candidate.id === lessonId);
  if (!lesson) fail(`book-02: missing approved lesson ${lessonId}`);
  const actualAnswers = lesson.original.items.map((item) => item.answer);
  if (JSON.stringify(actualAnswers) !== JSON.stringify(approvedAnswers)) {
    fail(`book-02/${lessonId}: approved original answers changed`);
  }
  if (lesson.original.items.some((item) => item.answerMode !== "input")) {
    fail(`book-02/${lessonId}: source answer format changed`);
  }
}
const requiredBook2Units = ["매트릭스와 주고받기", "양팔저울", "규칙찾기와 수열", "약속과 스도쿠"];
for (const unit of requiredBook2Units) if (!book2.lessons.some((lesson) => lesson.unit === unit)) fail(`book-02: missing ${unit}`);

const book3 = GOLDEN_BELL_BOOKS.find((book) => book.id === "book-03");
const approvedBook3Answers = new Map([
  ["six-multiple-equations", ["14", "21", "30", "4", "2", "1", "14", "28", "42", "123", "77", "272"]],
  ["multiple-comparison", ["4", "6", "7", "2", "8", "5", "7"]],
  ["basic-vertical-cryptarithm", ["3", "8", "1", "2", "7", "2"]],
  ["magic-square-targets", ["30", ["12", "16"], "18", "45", "27", "27", "5", "21", "9"]]
]);
for (const [lessonId, approvedAnswers] of approvedBook3Answers) {
  const lesson = book3.lessons.find((candidate) => candidate.id === lessonId);
  if (!lesson) fail(`book-03: missing approved lesson ${lessonId}`);
  const actualAnswers = lesson.original.items.map((item) => item.answer);
  if (JSON.stringify(actualAnswers) !== JSON.stringify(approvedAnswers)) {
    fail(`book-03/${lessonId}: approved original answers changed`);
  }
  if (lesson.original.items.some((item) => item.answerMode !== "input")) {
    fail(`book-03/${lessonId}: source answer format changed`);
  }
}
const requiredBook3Units = ["단위넓이와 분수", "단위길이와 배수", "복면산", "마법카드와 마방진"];
for (const unit of requiredBook3Units) if (!book3.lessons.some((lesson) => lesson.unit === unit)) fail(`book-03: missing ${unit}`);

const book4 = GOLDEN_BELL_BOOKS.find((book) => book.id === "book-04");
const approvedBook4Answers = new Map([
  ["polyomino-family-count", ["1", "1", "2", "5"]],
  ["hidden-cube-count", ["1", "2", "4"]],
  ["balance-substitution", ["3", "8"]],
  ["cardinal-placement", ["학원", "도윤"]]
]);
for (const [lessonId, approvedAnswers] of approvedBook4Answers) {
  const lesson = book4.lessons.find((candidate) => candidate.id === lessonId);
  if (!lesson) fail(`book-04: missing approved lesson ${lessonId}`);
  const actualAnswers = lesson.original.items.map((item) => item.answer);
  if (JSON.stringify(actualAnswers) !== JSON.stringify(approvedAnswers)) {
    fail(`book-04/${lessonId}: approved original answers changed`);
  }
  if (lesson.original.items.some((item) => item.answerMode !== "input")) {
    fail(`book-04/${lessonId}: source answer format changed`);
  }
}
const requiredBook4Units = ["도형분할과 움직이기", "색종이 접기와 쌓기나무", "양팔저울과 비교하기", "논리추리와 자리배치"];
for (const unit of requiredBook4Units) if (!book4.lessons.some((lesson) => lesson.unit === unit)) fail(`book-04: missing ${unit}`);
if (!book4.lessons.some((lesson) => lesson.sourceHold)) fail("book-04: unresolved teacher-only wording must remain visible in data");

const book5 = GOLDEN_BELL_BOOKS.find((book) => book.id === "book-05");
const approvedBook5Answers = new Map([
  ["path-number-grid", ["14", "16", "11"]],
  ["digit-card-ranked-number", ["680"]],
  ["checkerboard-product-matrix", ["7", "5", "9"]],
  ["cube-tetrahedral-growth", ["20", "84"]]
]);
for (const [lessonId, approvedAnswers] of approvedBook5Answers) {
  const lesson = book5.lessons.find((candidate) => candidate.id === lessonId);
  if (!lesson) fail(`book-05: missing approved lesson ${lessonId}`);
  const actualAnswers = lesson.original.items.map((item) => item.answer);
  if (JSON.stringify(actualAnswers) !== JSON.stringify(approvedAnswers)) {
    fail(`book-05/${lessonId}: approved original answers changed`);
  }
  if (lesson.original.items.some((item) => item.answerMode !== "input")) {
    fail(`book-05/${lessonId}: source answer format changed`);
  }
}
const requiredBook5Units = ["수 배열표와 달력", "최단거리와 숫자 카드", "곱셈 매트릭스", "삼각수와 사각수"];
for (const unit of requiredBook5Units) if (!book5.lessons.some((lesson) => lesson.unit === unit)) fail(`book-05: missing ${unit}`);
if (!book5.lessons.some((lesson) => lesson.sourceHold)) fail("book-05: contradictory teacher-only matrix must remain locked");

const book6 = GOLDEN_BELL_BOOKS.find((book) => book.id === "book-06");
const approvedBook6Answers = new Map([
  ["number-line-unit-distance", ["4", "8"]],
  ["rectangle-missing-side", ["9", "18", "54", "45"]],
  ["inclusive-range-count", ["11", "60", "58", "50"]],
  ["number-and-digit-count", ["18", "44", "56", "192"]]
]);
for (const [lessonId, approvedAnswers] of approvedBook6Answers) {
  const lesson = book6.lessons.find((candidate) => candidate.id === lessonId);
  if (!lesson) fail(`book-06: missing approved lesson ${lessonId}`);
  const actualAnswers = lesson.original.items.map((item) => item.answer);
  if (JSON.stringify(actualAnswers) !== JSON.stringify(approvedAnswers)) {
    fail(`book-06/${lessonId}: approved original answers changed`);
  }
  if (lesson.original.items.some((item) => item.answerMode !== "input")) {
    fail(`book-06/${lessonId}: source answer format changed`);
  }
}
const requiredBook6Units = ["수직선의 분할과 비", "도형의 둘레", "연속수의 합", "수와 숫자의 개수"];
for (const unit of requiredBook6Units) if (!book6.lessons.some((lesson) => lesson.unit === unit)) fail(`book-06: missing ${unit}`);

const pathLesson = book5.lessons.find((lesson) => lesson.id === "path-number-grid");
const pathAnswers = pathLesson.original.visual.panels.map(({ visual }) => {
  const [row, column] = visual.path[visual.target.index];
  return String(visual.values[row][column]);
});
if (JSON.stringify(pathAnswers) !== JSON.stringify(["14", "16", "11"])) fail("book-05: path target calculation failed");
{
  const visual = pathLesson.extension.visual;
  const [row, column] = visual.path[visual.target.index];
  if (visual.values[row][column] !== 20) fail("book-05: story path target calculation failed");
}

function permutationsOf(items, length = items.length) {
  if (length === 0) return [[]];
  return items.flatMap((item, index) => permutationsOf(items.filter((_, at) => at !== index), length - 1).map((rest) => [item, ...rest]));
}
function rankedCardNumbers(digits, length, descending = false) {
  return permutationsOf(digits, length)
    .filter((number) => number[0] !== 0)
    .map((number) => Number(number.join("")))
    .sort((a, b) => descending ? b - a : a - b);
}
if (rankedCardNumbers([0, 6, 7, 8], 3)[4] !== 680) fail("book-05: first digit-card rank failed");
if (rankedCardNumbers([2, 4, 6, 8], 3)[3] !== 268) fail("book-05: story digit-card rank failed");

function checkerSolutions(rowProducts, columnProducts) {
  return permutationsOf([2, 3, 4, 5, 6, 7, 8, 9]).filter((values) =>
    values[0] * values[1] === rowProducts[0]
    && values[2] * values[3] === rowProducts[1]
    && values[4] * values[5] === rowProducts[2]
    && values[6] * values[7] === rowProducts[3]
    && values[2] * values[4] === columnProducts[0]
    && values[0] * values[5] === columnProducts[1]
    && values[1] * values[6] === columnProducts[2]
    && values[3] * values[7] === columnProducts[3]
  );
}
const sourceMatrixSolutions = checkerSolutions([28, 6, 40, 54], [15, 56, 36, 12]);
if (sourceMatrixSolutions.length !== 1 || sourceMatrixSolutions[0].join(",") !== "7,4,3,2,5,8,9,6") fail("book-05: source matrix is not uniquely solved");
const storyMatrixSolutions = checkerSolutions([24, 18, 35, 24], [45, 42, 12, 16]);
if (storyMatrixSolutions.length !== 1 || storyMatrixSolutions[0].join(",") !== "6,4,9,2,5,7,3,8") fail("book-05: story matrix is not uniquely solved");

const triangular = (level) => level * (level + 1) / 2;
const tetrahedral = (level) => Array.from({ length: level }, (_, index) => triangular(index + 1)).reduce((sum, value) => sum + value, 0);
if (tetrahedral(4) !== 20 || tetrahedral(7) !== 84 || tetrahedral(5) !== 35) fail("book-05: triangular stair totals failed");

const unitDistance = (start, end, intervals) => (end - start) / intervals;
if (unitDistance(15, 47, 8) !== 4 || unitDistance(39, 95, 7) !== 8 || unitDistance(12, 52, 5) !== 8) {
  fail("book-06: number-line unit-distance calculation failed");
}
const missingRectangleSide = (perimeter, knownSide) => perimeter / 2 - knownSide;
if ([missingRectangleSide(36, 9), missingRectangleSide(100, 32), missingRectangleSide(144, 18), missingRectangleSide(150, 30), missingRectangleSide(84, 17)].join(",") !== "9,18,54,45,25") {
  fail("book-06: rectangle missing-side calculation failed");
}
const inclusiveRange = (start, end) => end - start + 1;
if ([inclusiveRange(5, 15), inclusiveRange(10, 69), inclusiveRange(21, 78), inclusiveRange(47, 96), inclusiveRange(28, 73)].join(",") !== "11,60,58,50,46") {
  fail("book-06: inclusive range calculation failed");
}
const writtenDigits = (start, end) => Array.from({ length: end - start + 1 }, (_, index) => String(start + index).length).reduce((sum, count) => sum + count, 0);
if ([inclusiveRange(9, 26), inclusiveRange(14, 57), writtenDigits(12, 39), writtenDigits(1, 100), writtenDigits(1, 35)].join(",") !== "18,44,56,192,61") {
  fail("book-06: number and written-digit count failed");
}

function canonicalPolyomino(cells) {
  const variants = [];
  for (let reflected = 0; reflected < 2; reflected += 1) {
    for (let rotation = 0; rotation < 4; rotation += 1) {
      const transformed = cells.map(([sourceX, sourceY]) => {
        let x = reflected ? -sourceX : sourceX;
        let y = sourceY;
        for (let turn = 0; turn < rotation; turn += 1) [x, y] = [-y, x];
        return [x, y];
      });
      const minX = Math.min(...transformed.map(([x]) => x));
      const minY = Math.min(...transformed.map(([, y]) => y));
      variants.push(transformed.map(([x, y]) => [x - minX, y - minY]).sort(([ax, ay], [bx, by]) => ax - bx || ay - by).map(([x, y]) => `${x},${y}`).join(";"));
    }
  }
  return variants.sort()[0];
}

function freePolyominoCount(size) {
  let shapes = new Map([["0,0", [[0, 0]]]]);
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (let count = 1; count < size; count += 1) {
    const next = new Map();
    for (const cells of shapes.values()) {
      const occupied = new Set(cells.map(([x, y]) => `${x},${y}`));
      for (const [x, y] of cells) for (const [dx, dy] of directions) {
        if (occupied.has(`${x + dx},${y + dy}`)) continue;
        const grown = [...cells, [x + dx, y + dy]];
        next.set(canonicalPolyomino(grown), grown);
      }
    }
    shapes = next;
  }
  return shapes.size;
}

const enumeratedPolyominoCounts = [1, 2, 3, 4].map(freePolyominoCount);
if (JSON.stringify(enumeratedPolyominoCounts) !== JSON.stringify([1, 1, 2, 5])) fail("book-04: independent polyomino enumeration failed");
if ([4 - 3, 9 - 7, 10 - 6].join(",") !== "1,2,4") fail("book-04: hidden cube arithmetic failed");
if (2 * 2 + 2 !== 6 || 2 + 1 !== 3 || 4 * 2 !== 8) fail("book-04: balance substitution failed");

function cardinalSolutions(names, test) {
  const cells = [[0, 0], [1, 0], [0, 1], [1, 1]];
  const permutations = (items) => items.length < 2 ? [items] : items.flatMap((item, index) => permutations(items.filter((_, at) => at !== index)).map((rest) => [item, ...rest]));
  return permutations(names).map((order) => Object.fromEntries(order.map((name, index) => [name, cells[index]]))).filter(test);
}
const firstMaps = cardinalSolutions(["학원", "서점", "마트", "은행"], (map) => map.마트[0] + 1 === map.은행[0] && map.마트[1] === map.은행[1] && map.서점[0] === map.은행[0] && map.서점[1] + 1 === map.은행[1] && map.학원[0] + 1 === map.서점[0] && map.학원[1] === map.서점[1]);
if (firstMaps.length !== 1 || firstMaps[0].학원.join(",") !== "0,0") fail("book-04: first cardinal placement is not unique");
const secondMaps = cardinalSolutions(["서연", "도윤", "준서", "시우"], (map) => map.서연[0] === map.도윤[0] && map.서연[1] + 1 === map.도윤[1] && map.준서[0] + 1 === map.도윤[0] && map.준서[1] === map.도윤[1] && map.준서[0] === map.시우[0] && map.준서[1] - 1 === map.시우[1]);
if (secondMaps.length !== 1 || secondMaps[0].도윤.join(",") !== "1,1") fail("book-04: second cardinal placement is not unique");

console.log(`golden bell audit passed: ${GOLDEN_BELL_BOOKS.length} books, ${readyBooks.length} ready, ${lessonCount} lessons, ${originalItemCount} original checks`);
