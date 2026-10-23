// 골든벨 각 권의 학습 순서를 더클 교재 순서로 다시 놓는다(2026-10-23, 원장: 「골든벨은 더클 교재 배우기 전날 정도 배우는
// 예습용이니 더클 교재 순서로 정리」, 「골든벨과 더클은 따로 — 합치지 말고 골든벨을 더클 교재 순서대로」).
// 순서 = 교재 단원(golden-bell-print-units.js의 단원 연결) → 그 단원 안에서는 골든벨 원본 쪽 순서.
// 원본 쪽이 없는 옛 개념 학습은 그 단원 맨 앞. 학습의 내용·id·answerRef는 그대로이고 배열 순서만 바뀐다. 정답 없음.
// node golden-bell-order-by-textbook.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const { goldenBellPrintUnits } = await import(new URL("../golden-bell-print-units.js", import.meta.url).href);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));

const pageOf = (item) => {
  if (Number.isFinite(item.sourcePage)) return item.sourcePage;
  const locator = item.sourceLocator || "";
  const match = locator.match(/(?:슬라이드|화면)\s*(\d+)/u) || locator.match(/(\d+)\s*쪽/u);
  return match ? Number(match[1]) : null;
};
const firstPage = (lesson) => {
  const pages = (lesson.original?.items || []).map(pageOf).filter(Number.isFinite);
  return pages.length ? Math.min(...pages) : -1;
};

const report = [];
for (const book of books) {
  const unitOf = new Map();
  for (const group of goldenBellPrintUnits(book)) for (const lesson of group.lessons) unitOf.set(lesson.id, group.number);
  const unmapped = book.lessons.filter((lesson) => !Number.isInteger(unitOf.get(lesson.id)));
  if (unmapped.length) throw new Error(`${book.id}: not linked to a textbook unit: ${unmapped.map((l) => l.id).join(", ")}`);
  const before = book.lessons.map((lesson) => lesson.id).join();
  book.lessons = book.lessons
    .map((lesson, index) => ({ lesson, index, unit: unitOf.get(lesson.id), page: firstPage(lesson) }))
    .sort((a, b) => a.unit - b.unit || a.page - b.page || a.index - b.index)
    .map((entry) => entry.lesson);
  const moved = before !== book.lessons.map((lesson) => lesson.id).join();
  report.push(`${book.id}${moved ? " 바뀜" : ""}: ${book.lessons.map((lesson) => unitOf.get(lesson.id)).join(",")}`);
}

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log(report.join("\n"));
