// 골든벨 7권 52쪽 활동 01 1. 대칭수 개수 구하기 01 (1) 「한 자리 대칭수」를 보류에서 풀어 넣는다(2026-10-23).
// 물음 글의 정의(앞으로 읽으나 뒤로 읽으나 같은 수)만으로는 한 자리 수를 셀지가 정해지지 않아 보류했었다.
// 원장 결정: 교사용 풀이를 따른다. 그래서 01의 물음(다섯 문항이 함께 쓰는 머리글)에 조건 한 줄을 밝힌다.
// 새 답 키는 단원 15의 아직 안 쓴 번호 items/15. 이 스크립트에는 정답이 없다.
// node patch-book07-s52-one-digit.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const b7 = books.find((b) => b.id === "book-07");
const lesson = b7.lessons.find((l) => l.id === "palindrome-source");
const items = lesson.original.items;
if (items.some((i) => i.id === "book07-src-s52-01-1")) throw new Error("already patched");
const holdIndex = b7.sourceHold.findIndex((h) => h.id === "book07-hold-52-01-1");
if (holdIndex < 0) throw new Error("page 52 hold missing");
const ref = "/books/book-07/lessons/15/original/items/15";
if (JSON.stringify(b7).includes(`"${ref}"`)) throw new Error("answer key taken");

const STEM = "232, 4554처럼 앞으로 읽으나 뒤로 읽으나 똑같은 수를 대칭수라고 합니다.";
const CONDITION = "(단, 대칭수는 두 자리 이상의 수에서 찾습니다.)";
const ASK = "다음 주어진 대칭수의 개수를 구하시오.";
const siblings = items.filter((i) => /^book07-src-s52-01-\d$/.test(i.id));
if (siblings.length !== 4) throw new Error(`52쪽 01 siblings ${siblings.length}`);
for (const item of siblings) {
  if (!item.prompt.startsWith(`${STEM} ${ASK}`)) throw new Error(`${item.id} stem changed`);
  item.prompt = item.prompt.replace(`${STEM} ${ASK}`, `${STEM} ${CONDITION} ${ASK}`);
}
const first = siblings[0];
items.unshift({
  ...first,
  id: "book07-src-s52-01-1",
  sourceNo: "GB7-S52-01-1",
  sourceLocator: "교사용 슬라이드 52 · 활동 01 팔린드롬과 대칭수 1. 대칭수 개수 구하기 01 (1)",
  printGroup: first.printGroup,
  prompt: `${STEM} ${CONDITION} ${ASK} (1) 한 자리 대칭수`,
  answerRef: ref,
  sourceDiscrepancy: "물음 글의 정의만으로는 한 자리 수를 대칭수로 셀지 정해지지 않는다. 원장 결정(2026-10-23)에 따라 교사용 풀이와 같은 조건을 01의 물음에 밝혔다."
});
if (Number.isInteger(lesson.original.sourceQuestionCount)) lesson.original.sourceQuestionCount += 1;

b7.sourceHold.splice(holdIndex, 1);
const cov = b7.sourceCoverage;
cov.publicItems += 1;
cov.publicAnswerUnits += 1;
cov.holdItems -= 1;
cov.heldAnswerUnits -= 1;
const page = cov.pageLedger.find((p) => p.page === 52);
page.releasedItems += 1; page.releasedAnswerUnits += 1; page.heldRecords -= 1; page.heldAnswerUnits -= 1;
if (cov.publicAnswerUnits + cov.heldAnswerUnits !== cov.totalAnswerUnits) throw new Error("answer unit ledger mismatch");

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book07 page 52 (1) released", { items: items.length, publicItems: cov.publicItems, publicAnswerUnits: cov.publicAnswerUnits, holds: b7.sourceHold.length });
