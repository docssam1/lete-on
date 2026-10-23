// 골든벨 5권 「조건에 맞는 두 자리 수」의 물음을 기호 꼴(「일의 자리 + 십의 자리 = 16이 되는」)에서 아이가 읽는 문장으로 고친다
// (2026-10-23, 원장: 「이상하게 문제가 되어 있어」). 수와 조건은 그대로라 답은 바뀌지 않는다. 그림(□ + □ = 8 칸)은 그대로 둔다.
// 정답 없음.  node patch-book05-two-digit-wording.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const lesson = books.find((b) => b.id === "book-05").lessons.find((l) => l.id === "two-digit-condition-source");

// 기호 조건 → 문장. 「십의 자리」·「일의 자리」는 그 자리의 숫자를 뜻한다.
const sentence = (text) => text
  .replace(/일의 자리 \+ 십의 자리 = (\d+)이 되는/gu, "일의 자리 숫자와 십의 자리 숫자의 합이 $1인")
  .replace(/십의 자리 \+ 일의 자리 = (\d+)(?:이 되는|인|일 때)/gu, "십의 자리 숫자와 일의 자리 숫자의 합이 $1인")
  .replace(/십의 자리 = 일의 자리 \+ (\d+)인/gu, "십의 자리 숫자가 일의 자리 숫자보다 $1 큰")
  .replace(/십의 자리 = 일의 자리 - (\d+)인/gu, "십의 자리 숫자가 일의 자리 숫자보다 $1 작은")
  .replace(/숫자의 합이 (\d+)인 가장 큰 두 자리 수는\?/gu, "숫자의 합이 $1인 두 자리 수 중 가장 큰 수는?")
  .replace(/숫자의 합이 (\d+)인 (\d+번째로 (?:큰|작은) 수는\?)/gu, "숫자의 합이 $1인 두 자리 수 중 $2")
  .replace(/십의 자리와 일의 자리의 차가 (\d+)인 수를/gu, "십의 자리 숫자와 일의 자리 숫자의 차가 $1인 두 자리 수를")
  .replace(/십의 자리와 일의 자리의 차가/gu, "십의 자리 숫자와 일의 자리 숫자의 차가")
  .replace(/큰 수를 모두 쓰시오\./gu, "큰 두 자리 수를 모두 쓰시오.");

let changed = 0;
const fix = (holder, key) => {
  const next = sentence(holder[key]);
  if (next !== holder[key]) { holder[key] = next; changed += 1; }
};
for (const item of lesson.original.items) {
  fix(item, "prompt");
  for (const part of item.parts || []) fix(part, "label");
}
if (lesson.experience?.check?.prompt) fix(lesson.experience.check, "prompt");
const leftover = JSON.stringify(lesson).match(/(?:십|일)의 자리 ?[+=\-] ?/gu);
if (leftover) throw new Error(`symbolic wording left: ${leftover.length}`);
if (changed < 12) throw new Error(`only ${changed} texts changed`);

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book05 two-digit wording", { changed });
