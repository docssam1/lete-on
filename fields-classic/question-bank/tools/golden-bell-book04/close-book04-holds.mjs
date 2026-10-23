// 골든벨 4권 보류 3건(교사용 슬라이드 3 다섯 칸 확장 · 34 △n 빈칸 · 47)을 「원장 결정으로 넣지 않음(종결)」으로 표시한다(2026-10-23).
// 원장이 승인한 4권 묶음 계획에서 이 셋은 「보류 유지 — 넣지 않는다」였다(인수인계 4절 표). 문항으로는 넣지 않고,
// 다시 대조할 거리로 오해하지 않게 장부에만 종결 표시를 남긴다. 정답 없음.  node close-book04-holds.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const b4 = books.find((b) => b.id === "book-04");
if (b4.sourceHold.length !== 3) throw new Error(`book-04 holds ${b4.sourceHold.length}`);
if (b4.sourceHold.some((h) => h.status === "closed")) throw new Error("already closed");
for (const hold of b4.sourceHold) {
  hold.status = "closed";
  hold.decision = "원장 결정: 넣지 않음(4권 묶음 계획의 「보류 유지」). 원본에 문항으로 확정할 조건이 없어 다시 대조하지 않는다.";
}
const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book-04 holds closed", b4.sourceHold.map((h) => h.sourceLocator));
