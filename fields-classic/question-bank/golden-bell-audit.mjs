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
    if (lesson.extension.prompt === lesson.original.prompt) fail(`${book.id}/${lesson.id}: story extension reused the original prompt`);
    if (!lesson.extension.options.includes(lesson.extension.answer)) fail(`${book.id}/${lesson.id}: extension answer not visible`);
    for (const item of lesson.original.items) {
      originalItemCount += 1;
      if (!item.options.includes(item.answer)) fail(`${book.id}/${lesson.id}/${item.id}: original answer not visible`);
      if (new Set(item.options).size !== item.options.length) fail(`${book.id}/${lesson.id}/${item.id}: duplicate choices`);
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
for (const [lessonId, approvedAnswers] of approvedBook1Answers) {
  const lesson = book1.lessons.find((candidate) => candidate.id === lessonId);
  if (!lesson) fail(`book-01: missing approved lesson ${lessonId}`);
  const actualAnswers = lesson.original.items.map((item) => item.answer);
  if (JSON.stringify(actualAnswers) !== JSON.stringify(approvedAnswers)) {
    fail(`book-01/${lessonId}: approved original answers changed`);
  }
}
const requiredUnits = ["도형 움직이기", "색종이 접기", "마방진과 가쿠로 퍼즐", "수추리와 논리추리"];
for (const unit of requiredUnits) if (!book1.lessons.some((lesson) => lesson.unit === unit)) fail(`book-01: missing ${unit}`);
if (!book1.lessons.some((lesson) => lesson.sourceHold)) fail("book-01: unresolved source wording must remain visible in data");

console.log(`golden bell audit passed: ${GOLDEN_BELL_BOOKS.length} books, ${readyBooks.length} ready, ${lessonCount} lessons, ${originalItemCount} original checks`);
