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

console.log(`golden bell audit passed: ${GOLDEN_BELL_BOOKS.length} books, ${readyBooks.length} ready, ${lessonCount} lessons, ${originalItemCount} original checks`);
