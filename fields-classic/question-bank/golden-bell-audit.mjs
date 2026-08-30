import "../../geometry/worksheet/generators.js";
import "../../geometry/worksheet/render.js";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";
import { book05Markup } from "./book05-renderers.js";
import { book09Markup } from "./book09-renderers.js";

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
    if (!lesson.story?.title?.trim() || !lesson.story?.text?.trim() || !lesson.story?.mission?.trim()) fail(`${book.id}/${lesson.id}: missing story layer`);
    if (!lesson.explanation?.headline?.trim() || !Array.isArray(lesson.explanation?.steps) || lesson.explanation.steps.length < 2 || lesson.explanation.steps.some((step) => !String(step).trim())) {
      fail(`${book.id}/${lesson.id}: incomplete concept tutorial`);
    }
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
const hiddenCubeLesson = book4.lessons.find((lesson) => lesson.id === "hidden-cube-count");
const hiddenScenes = hiddenCubeLesson.original.visual.scenes;
const expectedHidden = hiddenCubeLesson.original.items.map((item) => Number(item.answer));
hiddenScenes.forEach(({ map }, index) => {
  const hidden = globalThis.GW_GEN.countHiddenWalled(map);
  if (hidden !== expectedHidden[index]) fail(`book-04: geometry hidden count mismatch at scene ${index + 1}`);
});
const hiddenStoryMap = hiddenCubeLesson.extension.visual.scenes[0].map;
if (globalThis.GW_GEN.countHiddenWalled(hiddenStoryMap) !== Number(hiddenCubeLesson.extension.answer)) {
  fail("book-04: story hidden count differs from geometry data");
}

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

const book7 = GOLDEN_BELL_BOOKS.find((book) => book.id === "book-07");
const approvedBook7Answers = new Map([
  ["elapsed-time", ["4시간 50분", "4시간 23분", "오후 1시 45분", "4시간 30분"]],
  ["shared-polygon-matchsticks", ["21", "69"]],
  ["closed-loop-planting", ["300", "96", "120"]],
  ["venn-overlap-all", ["4", "3", "8", "11"]]
]);
for (const [lessonId, approvedAnswers] of approvedBook7Answers) {
  const lesson = book7.lessons.find((candidate) => candidate.id === lessonId);
  if (!lesson) fail(`book-07: missing approved lesson ${lessonId}`);
  const actualAnswers = lesson.original.items.map((item) => item.answer);
  if (JSON.stringify(actualAnswers) !== JSON.stringify(approvedAnswers)) {
    fail(`book-07/${lessonId}: approved original answers changed`);
  }
  if (lesson.original.items.some((item) => item.answerMode !== "input")) {
    fail(`book-07/${lessonId}: source answer format changed`);
  }
}
const requiredBook7Units = ["달력과 시계", "규칙 찾기와 수열", "가로수 심기", "대칭수와 벤다이어그램"];
for (const unit of requiredBook7Units) if (!book7.lessons.some((lesson) => lesson.unit === unit)) fail(`book-07: missing ${unit}`);

const book8 = GOLDEN_BELL_BOOKS.find((book) => book.id === "book-08");
const approvedBook8Answers = new Map([
  ["addition-sum-matrix", ["16", "10", "7", "22"]],
  ["vertical-shape-cryptarithm", ["8", "7", "8", "9"]],
  ["equalize-transfer", ["2", "4", "9"]],
  ["reverse-operation-chain", ["6", "18", "8", "12"]]
]);
for (const [lessonId, approvedAnswers] of approvedBook8Answers) {
  const lesson = book8.lessons.find((candidate) => candidate.id === lessonId);
  if (!lesson) fail(`book-08: missing approved lesson ${lessonId}`);
  const actualAnswers = lesson.original.items.map((item) => item.answer);
  if (JSON.stringify(actualAnswers) !== JSON.stringify(approvedAnswers)) {
    fail(`book-08/${lessonId}: approved original answers changed`);
  }
  if (lesson.original.items.some((item) => item.answerMode !== "input")) {
    fail(`book-08/${lessonId}: source answer format changed`);
  }
}
const requiredBook8Units = ["묶음수와 매트릭스", "복면산", "합차와 배수문제", "거꾸로 생각하기"];
for (const unit of requiredBook8Units) if (!book8.lessons.some((lesson) => lesson.unit === unit)) fail(`book-08: missing ${unit}`);

const book9 = GOLDEN_BELL_BOOKS.find((book) => book.id === "book-09");
const approvedBook9Answers = new Map([
  ["unit-area-and-half", ["2", "6", "1", "1"]],
  ["cube-map-total", ["8", "10", "14"]],
  ["magic-square-missing", ["10", "9"]],
  ["consecutive-sum-pairing", ["21", "55", "105", "210"]]
]);
for (const [lessonId, approvedAnswers] of approvedBook9Answers) {
  const lesson = book9.lessons.find((candidate) => candidate.id === lessonId);
  if (!lesson) fail(`book-09: missing approved lesson ${lessonId}`);
  const actualAnswers = lesson.original.items.map((item) => item.answer);
  if (JSON.stringify(actualAnswers) !== JSON.stringify(approvedAnswers)) {
    fail(`book-09/${lessonId}: approved original answers changed`);
  }
  if (lesson.original.items.some((item) => item.answerMode !== "input")) {
    fail(`book-09/${lessonId}: source answer format changed`);
  }
}
const requiredBook9Units = ["도형의 분할과 넓이", "쌓기나무의 개수", "마방진", "연속수의 합"];
for (const unit of requiredBook9Units) if (!book9.lessons.some((lesson) => lesson.unit === unit)) fail(`book-09: missing ${unit}`);

const book10 = GOLDEN_BELL_BOOKS.find((book) => book.id === "book-10");
const approvedBook10Answers = new Map([
  ["consecutive-page-range", ["10", "15"]],
  ["catch-up-acorns", ["5"]],
  ["digit-card-four-place", ["6", "24"]],
  ["number-baseball-secret", ["634"]]
]);
const snapshotOriginal = (original) => ({
  title: original.title,
  structureKey: original.structureKey,
  prompt: original.prompt,
  visual: original.visual,
  items: original.items.map(({ id, prompt, answerMode, inputMode, answer }) => ({ id, prompt, answerMode, inputMode, answer }))
});
const approvedOriginalSnapshots = new Map([
  ["book-01/clock-turning", {
    title: "골든벨",
    structureKey: "clock-turn-landing",
    prompt: "12를 가리키고 있는 시계 바늘을 다음과 같이 돌리면 어떤 수를 가리키는지 구하시오.",
    visual: { kind: "clock", value: 12 },
    items: [
      { id: "one-turn", prompt: "(1) 시계 방향으로 한 바퀴 돌리면 어떤 수를 가리키는지 쓰시오.", answerMode: "input", inputMode: "numeric", answer: "12" },
      { id: "half-clockwise", prompt: "(2) 시계 방향으로 반 바퀴 돌리면 어떤 수를 가리키는지 쓰시오.", answerMode: "input", inputMode: "numeric", answer: "6" },
      { id: "half-counter", prompt: "(3) 시계 반대 방향으로 반 바퀴 돌리면 어떤 수를 가리키는지 쓰시오.", answerMode: "input", inputMode: "numeric", answer: "6" },
      { id: "quarter-clockwise", prompt: "(4) 시계 방향으로 반의 반 바퀴 돌리면 어떤 수를 가리키는지 쓰시오.", answerMode: "input", inputMode: "numeric", answer: "3" },
      { id: "quarter-counter", prompt: "(5) 시계 반대 방향으로 반의 반 바퀴 돌리면 어떤 수를 가리키는지 쓰시오.", answerMode: "input", inputMode: "numeric", answer: "9" }
    ]
  }],
  ["book-10/consecutive-page-range", {
    title: "교재 확인",
    structureKey: "consecutive-page-range-from-count-and-total",
    prompt: "연속된 6쪽의 쪽수 합이 75일 때 처음 쪽수와 마지막 쪽수를 쓰세요.",
    visual: { kind: "book10", subtype: "page-strip", count: 6, total: 75 },
    items: [
      { id: "page-range-first", prompt: "처음 쪽수", answerMode: "input", inputMode: "numeric", answer: "10" },
      { id: "page-range-last", prompt: "마지막 쪽수", answerMode: "input", inputMode: "numeric", answer: "15" }
    ]
  }],
  ["book-10/catch-up-acorns", {
    title: "교재 확인",
    structureKey: "catch-up-from-start-gap-and-daily-gap",
    prompt: "두 다람쥐가 같은 수의 도토리를 가지게 되는 것은 며칠 뒤인지 쓰세요.",
    visual: { kind: "book10", subtype: "catch-up-table", labels: ["엄마 다람쥐", "아빠 다람쥐"], starts: [30, 50], changes: [7, 3], unit: "개/일" },
    items: [
      { id: "catch-up-days", prompt: "같아지는 날", answerMode: "input", inputMode: "numeric", answer: "5" }
    ]
  }],
  ["book-10/digit-card-four-place", {
    title: "교재 확인",
    structureKey: "four-distinct-digit-cards-used-once",
    prompt: "1, 3, 5, 7을 한 번씩 사용해 네 자리 수를 만듭니다.",
    visual: { kind: "book10", subtype: "digit-slots", digits: [1, 3, 5, 7], length: 4 },
    items: [
      { id: "fixed-first-digit-count", prompt: "천의 자리 숫자가 1인 수의 개수", answerMode: "input", inputMode: "numeric", answer: "6" },
      { id: "all-four-digit-count", prompt: "만들 수 있는 네 자리 수의 개수", answerMode: "input", inputMode: "numeric", answer: "24" }
    ]
  }],
  ["book-10/number-baseball-secret", {
    title: "교재 확인",
    structureKey: "three-distinct-digit-number-baseball",
    prompt: "1부터 9까지 서로 다른 숫자로 만든 세 자리 비밀 수를 쓰세요.",
    visual: { kind: "book10", subtype: "number-baseball", clues: [
      { guess: [2, 3, 6], strikes: 1, balls: 1 },
      { guess: [8, 3, 2], strikes: 1, balls: 0 },
      { guess: [8, 3, 4], strikes: 2, balls: 0 }
    ] },
    items: [
      { id: "baseball-secret", prompt: "비밀 수", answerMode: "input", inputMode: "numeric", answer: "634" }
    ]
  }]
]);
for (const [lessonId, approvedAnswers] of approvedBook10Answers) {
  const lesson = book10.lessons.find((candidate) => candidate.id === lessonId);
  if (!lesson) fail(`book-10: missing approved lesson ${lessonId}`);
  const actualAnswers = lesson.original.items.map((item) => item.answer);
  if (JSON.stringify(actualAnswers) !== JSON.stringify(approvedAnswers)) {
    fail(`book-10/${lessonId}: approved textbook answers changed`);
  }
  if (lesson.original.items.some((item) => item.answerMode !== "input")) {
    fail(`book-10/${lessonId}: textbook answer format changed`);
  }
}
for (const [lessonKey, approvedOriginal] of approvedOriginalSnapshots) {
  const [bookId, lessonId] = lessonKey.split("/");
  const book = GOLDEN_BELL_BOOKS.find((candidate) => candidate.id === bookId);
  const lesson = book?.lessons.find((candidate) => candidate.id === lessonId);
  if (!lesson) fail(`${lessonKey}: missing original snapshot target`);
  if (JSON.stringify(snapshotOriginal(lesson.original)) !== JSON.stringify(approvedOriginal)) {
    fail(`${lessonKey}: original problem snapshot changed`);
  }
}

const conceptText = (lesson) => [
  lesson.representativeConcept,
  lesson.story.title,
  lesson.story.text,
  lesson.story.mission,
  lesson.explanation.headline,
  ...lesson.explanation.steps
].join(" ");
const containsToken = (text, value) => {
  const escaped = String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![0-9])${escaped}(?![0-9])`).test(text);
};
const workedConclusion = (text) => /(?:=|따라서|이므로|되므로|확인합니다)/.test(text);
const conceptLeakChecks = new Map([
  ["book-01/clock-turning", {
    answers: ["12", "6", "6", "3", "9"],
    coreValues: ["12", "6", "3", "9"],
    required: ["2", "8", "5", "11", "네 부분"]
  }],
  ["book-10/consecutive-page-range", {
    answers: ["10", "15"],
    coreValues: ["75", "10", "15"],
    required: ["110", "20, 21, 22, 23, 24"]
  }],
  ["book-10/catch-up-acorns", {
    answers: ["5"],
    coreValues: ["50", "30", "7", "3"],
    required: ["24-12=12", "6-2=4", "12÷4=3"]
  }],
  ["book-10/digit-card-four-place", {
    answers: ["6", "24"],
    coreValues: ["1", "3", "5", "7"],
    required: ["5×4×3×2×1=120", "6×5×4×3×2×1=720"]
  }],
  ["book-10/number-baseball-secret", {
    answers: ["634"],
    coreValues: ["236", "832", "834"],
    required: ["A", "B", "C"]
  }]
]);
for (const [lessonKey, check] of conceptLeakChecks) {
  const [bookId, lessonId] = lessonKey.split("/");
  const lesson = GOLDEN_BELL_BOOKS.find((book) => book.id === bookId)?.lessons.find((candidate) => candidate.id === lessonId);
  if (!lesson) fail(`${lessonKey}: missing concept leak target`);
  const text = conceptText(lesson);
  if (check.required.some((marker) => !text.includes(marker))) fail(`${lessonKey}: revised concept example is missing`);
  const allAnswersVisible = check.answers.every((answer) => containsToken(text, answer));
  const visibleCoreCount = check.coreValues.filter((value) => containsToken(text, value)).length;
  if (allAnswersVisible && visibleCoreCount >= Math.min(2, check.coreValues.length) && workedConclusion(text)) {
    fail(`${lessonKey}: concept explanation reconstructs the original answer set`);
  }
}
if (book10.source.origin !== "textbook-derived") fail("book-10: textbook-derived source label is required");
const requiredBook10Units = ["연속수의 합", "따라잡기", "조건에 맞는 수", "숫자 야구게임"];
for (const unit of requiredBook10Units) if (!book10.lessons.some((lesson) => lesson.unit === unit)) fail(`book-10: missing ${unit}`);

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

const cubeGeometry = globalThis.GW_GEN;
if (!cubeGeometry?.buildTriangularStairShape || !globalThis.GW_RENDER?.renderIso) fail("geometry cube engine is unavailable");
for (let stage = 1; stage <= 10; stage += 1) {
  const map = cubeGeometry.buildTriangularStairShape(stage);
  const expected = stage * (stage + 1) * (stage + 2) / 6;
  if (cubeGeometry.mapTotal(map) !== expected || cubeGeometry.triangularStairTotal(stage) !== expected) {
    fail(`book-05: geometry triangular stair mismatch at stage ${stage}`);
  }
}
const book5CubeLesson = GOLDEN_BELL_BOOKS.find((book) => book.id === "book-05")?.lessons.find((lesson) => lesson.id === "cube-tetrahedral-growth");
if (!book5CubeLesson) fail("book-05: triangular stair golden bell lesson missing");
for (const item of book5CubeLesson.original.items) {
  const stage = Number(item.prompt.match(/(\d+)단계/)?.[1]);
  if (!stage || Number(item.answer) !== cubeGeometry.triangularStairTotal(stage)) fail(`book-05: approved answer mismatch for ${item.id}`);
}
if (Number(book5CubeLesson.extension.answer) !== cubeGeometry.triangularStairTotal(book5CubeLesson.extension.visual.targetStages[0])) {
  fail("book-05: extension answer differs from geometry data");
}
const cubeMarkup = book05Markup(book5CubeLesson.original.visual);
if (!cubeMarkup.includes('data-geometry-kind="triangular-stair"') || !cubeMarkup.includes('data-total="20"')) {
  fail("book-05: golden bell cube visual is not using geometry data");
}
const book09CubeLesson = GOLDEN_BELL_BOOKS.find((book) => book.id === "book-09")?.lessons.find((lesson) => lesson.id === "cube-map-total");
const book09CubeMarkup = book09CubeLesson?.original.visual.panels.map((panel) => book09Markup({ kind: "book9", ...panel.visual })).join("") || "";
if (!book09CubeMarkup.includes('data-geometry-kind="height-map"')) {
  fail("book-09: cube visual is not using geometry height-map rendering");
}

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

const minutes = (hour, minute, afternoon = false) => (hour % 12 + (afternoon ? 12 : 0)) * 60 + minute;
const duration = (start, end) => end - start;
if ([
  duration(minutes(9, 40), minutes(2, 30, true)),
  duration(minutes(10, 53), minutes(3, 16, true)),
  duration(minutes(5, 45), minutes(10, 15))
].join(",") !== "290,263,270") fail("book-07: elapsed-time calculation failed");
if (minutes(11, 10) + 155 !== minutes(1, 45, true) || minutes(8, 25) + 230 !== minutes(12, 15, true)) {
  fail("book-07: end-time calculation failed");
}
const sharedPolygonMatches = (sides, count) => sides + (sides - 1) * (count - 1);
if ([sharedPolygonMatches(3, 10), sharedPolygonMatches(3, 34), sharedPolygonMatches(4, 8)].join(",") !== "21,69,25") {
  fail("book-07: shared-polygon matchstick calculation failed");
}
const closedPerimeter = (count, spacing) => count * spacing;
if ([closedPerimeter(20, 15), closedPerimeter(8, 12), closedPerimeter(30 / 2, 8), closedPerimeter(18, 9)].join(",") !== "300,96,120,162") {
  fail("book-07: closed-loop planting calculation failed");
}
const vennParts = (total, leftTotal, rightTotal) => {
  const overlap = leftTotal + rightTotal - total;
  return { overlap, leftOnly: leftTotal - overlap, rightOnly: rightTotal - overlap, exactlyOne: total - overlap };
};
const sourceVenn = vennParts(15, 7, 12);
const storyVenn = vennParts(24, 14, 17);
if ([sourceVenn.overlap, sourceVenn.leftOnly, sourceVenn.rightOnly, sourceVenn.exactlyOne, storyVenn.overlap].join(",") !== "4,3,8,11,7") {
  fail("book-07: venn calculation failed");
}

function matrixMissingTotal(visual) {
  const symbols = [...new Set(visual.cells.flat())];
  const solutions = [];
  const search = (index, values) => {
    if (index < symbols.length) {
      for (let value = 0; value <= 15; value += 1) search(index + 1, { ...values, [symbols[index]]: value });
      return;
    }
    const rowSums = visual.cells.map((row) => row.reduce((sum, symbol) => sum + values[symbol], 0));
    const columnSums = visual.cells[0].map((_, column) => visual.cells.reduce((sum, row) => sum + values[row[column]], 0));
    if (visual.rowTotals.some((total, row) => total !== "?" && rowSums[row] !== total)) return;
    if (visual.columnTotals.some((total, column) => total !== "?" && columnSums[column] !== total)) return;
    const rowTarget = visual.rowTotals.indexOf("?");
    const columnTarget = visual.columnTotals.indexOf("?");
    solutions.push(rowTarget >= 0 ? rowSums[rowTarget] : columnSums[columnTarget]);
  };
  search(0, {});
  return [...new Set(solutions)];
}
const matrixLesson = book8.lessons.find((lesson) => lesson.id === "addition-sum-matrix");
const sourceMatrixTargets = matrixLesson.original.visual.panels.map(({ visual }) => matrixMissingTotal(visual));
if (JSON.stringify(sourceMatrixTargets) !== JSON.stringify([[16], [10], [7], [22]])) fail("book-08: source addition matrices are not uniquely solved");
if (JSON.stringify(matrixMissingTotal(matrixLesson.extension.visual)) !== JSON.stringify([11])) fail("book-08: story addition matrix is not uniquely solved");

const sourceCryptarithmTargets = [
  Array.from({ length: 10 }, (_, square) => square).filter((square) => Array.from({ length: 10 }, (_, circle) => circle).some((circle) => 10 * square + 4 + 20 + square === 110 * circle + 2)),
  Array.from({ length: 10 }, (_, square) => square).filter((square) => Array.from({ length: 10 }, (_, diamond) => diamond).some((diamond) => 30 + square + 10 * square + 5 === 110 * diamond + 2)),
  Array.from({ length: 10 }, (_, circle) => circle).filter((circle) => Array.from({ length: 10 }, (_, square) => square).some((square) => Array.from({ length: 10 }, (_, diamond) => diamond).some((diamond) => square > 0 && diamond > 0 && new Set([square, circle, diamond]).size === 3 && 2 * (10 * square + circle) === 110 * diamond + 6))),
  Array.from({ length: 10 }, (_, square) => square).filter((square) => Array.from({ length: 10 }, (_, circle) => circle).some((circle) => Array.from({ length: 10 }, (_, diamond) => diamond).some((diamond) => circle > 0 && new Set([square, circle, diamond]).size === 3 && 700 + 11 * diamond + 100 * circle + 50 + diamond === 100 * square + 22)))
];
if (JSON.stringify(sourceCryptarithmTargets) !== JSON.stringify([[8], [7], [8], [9]])) fail("book-08: source cryptarithms are not uniquely solved");
if (78 + 37 !== 115) fail("book-08: story cryptarithm failed");

const equalizeMove = (large, small) => (large - small) / 2;
if ([equalizeMove(10, 6), equalizeMove(22, 14), equalizeMove(35, 17), equalizeMove(28, 16)].join(",") !== "2,4,9,6") {
  fail("book-08: equalize transfer calculation failed");
}
const reverseChain = (result, reverseSteps) => reverseSteps.reduce((value, step) => step(value), result);
const sourceReverseStarts = [
  reverseChain(10, [(value) => value + 2, (value) => value - 6]),
  reverseChain(17, [(value) => value + 7, (value) => value - 9, (value) => value + 5, (value) => value - 2]),
  reverseChain(4, [(value) => value * 9, (value) => value + 4, (value) => value / 5]),
  reverseChain(3, [(value) => value * 9, (value) => value - 6, (value) => value / 3, (value) => value + 5])
];
if (sourceReverseStarts.join(",") !== "6,18,8,12") fail("book-08: source reverse chains failed");
if (reverseChain(22, [(value) => value + 4, (value) => value - 6, (value) => value + 3, (value) => value - 8]) !== 15) fail("book-08: story reverse chain failed");

function polygonArea(points) {
  return Math.abs(points.reduce((sum, [x, y], index) => {
    const [nextX, nextY] = points[(index + 1) % points.length];
    return sum + x * nextY - y * nextX;
  }, 0)) / 2;
}
const areaLesson = book9.lessons.find((lesson) => lesson.id === "unit-area-and-half");
const sourceAreas = areaLesson.original.visual.panels.map(({ visual }) => polygonArea(visual.points));
if (sourceAreas.join(",") !== "2,6,1,1" || polygonArea(areaLesson.extension.visual.points) !== 6) {
  fail("book-09: source or story area calculation failed");
}

const cubeCount = (map) => map.flat().reduce((sum, height) => sum + height, 0);
const cubeLesson = book9.lessons.find((lesson) => lesson.id === "cube-map-total");
const sourceCubeTotals = cubeLesson.original.visual.panels.map(({ visual }) => cubeCount(visual.map));
if (sourceCubeTotals.join(",") !== "8,10,14" || cubeCount(cubeLesson.extension.visual.map) !== 7) {
  fail("book-09: source or story cube total failed");
}

function validMagicSquare(shown, answer, lineSum) {
  const values = shown.map((value) => value === "□" ? answer : value);
  const lines = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return lines.every((line) => line.reduce((sum, index) => sum + values[index], 0) === lineSum);
}
const magicLesson = book9.lessons.find((lesson) => lesson.id === "magic-square-missing");
if (!validMagicSquare(magicLesson.original.visual.panels[0].visual.shown, 10, 18)
  || !validMagicSquare(magicLesson.original.visual.panels[1].visual.shown, 9, 21)
  || !validMagicSquare(magicLesson.extension.visual.shown, 9, 15)) {
  fail("book-09: source or story magic square failed");
}

const arithmeticSeries = (from, to) => (from + to) * (to - from + 1) / 2;
if ([6,10,14,20].map((to) => arithmeticSeries(1, to)).join(",") !== "21,55,105,210"
  || arithmeticSeries(1, 18) !== 171) {
  fail("book-09: source or story consecutive sum failed");
}

const consecutiveRangeFromSum = (count, total) => {
  const start = (total / count) - (count - 1) / 2;
  return Array.from({ length: count }, (_, index) => start + index);
};
const sourcePages = consecutiveRangeFromSum(6, 75);
const storyLockers = consecutiveRangeFromSum(5, 85);
if (sourcePages.join(",") !== "10,11,12,13,14,15" || storyLockers.join(",") !== "15,16,17,18,19") {
  fail("book-10: consecutive page range calculation failed");
}
const catchUpDays = (behind, ahead, behindRate, aheadRate) => (ahead - behind) / (behindRate - aheadRate);
if (catchUpDays(30, 50, 7, 3) !== 5 || catchUpDays(18, 38, 6, 2) !== 5) {
  fail("book-10: catch-up calculation failed");
}
const permutations = (items) => items.length < 2
  ? [items]
  : items.flatMap((item, index) => permutations(items.filter((_, at) => at !== index)).map((rest) => [item, ...rest]));
const sourceCardNumbers = permutations([1, 3, 5, 7]);
const storyCardNumbers = permutations([2, 4, 6, 8]);
if (sourceCardNumbers.length !== 24 || sourceCardNumbers.filter(([first]) => first === 1).length !== 6
  || storyCardNumbers.filter(([first]) => first === 2).length !== 6) {
  fail("book-10: digit-card enumeration failed");
}
const baseballScore = (secret, guess) => guess.reduce((score, digit, index) => {
  if (secret[index] === digit) score.strikes += 1;
  else if (secret.includes(digit)) score.balls += 1;
  return score;
}, { strikes: 0, balls: 0 });
const baseballCandidates = (clues) => {
  const candidates = [];
  for (let first = 1; first <= 9; first += 1) for (let second = 1; second <= 9; second += 1) for (let third = 1; third <= 9; third += 1) {
    const secret = [first, second, third];
    if (new Set(secret).size !== 3) continue;
    if (clues.every((clue) => {
      const score = baseballScore(secret, clue.guess);
      return score.strikes === clue.strikes && score.balls === clue.balls;
    })) candidates.push(secret.join(""));
  }
  return candidates;
};
const baseballLesson = book10.lessons.find((lesson) => lesson.id === "number-baseball-secret");
if (JSON.stringify(baseballCandidates(baseballLesson.original.visual.clues)) !== JSON.stringify(["634"])) {
  fail("book-10: textbook number-baseball clue set is not uniquely solved");
}
if (JSON.stringify(baseballCandidates(baseballLesson.extension.visual.clues)) !== JSON.stringify(["572"])) {
  fail("book-10: story number-baseball clue set is not uniquely solved");
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
