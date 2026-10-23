// 골든벨 5권 「숫자 카드로 만든 수의 차례를 찾아요」(단원 1)의 문항을 원본 한 문제 단위로 다시 묶는다(2026-10-23, 원장 요청).
// 같은 카드·같은 물음의 「한 자리 수 / 두 자리 수 / 세 자리 수 …」를 문항 하나씩으로 나눠 35문항이 되어
// 문제가 엄청 많아 보였다. 원본 문제 하나 = 문항 하나로 묶고, 자릿수별 물음은 그 문항 안의 답 칸(parts)으로 둔다.
// 답 칸의 answerRef는 원래 문항의 키를 그대로 옮기므로 정답은 바뀌지 않는다. 묶은 문항마다 풀이를 보여 줄
// 키(/groups/N)만 새로 생긴다. 카드가 다른 문항(28쪽 04, 29쪽)은 그대로 둔다. 정답 없음.
// node patch-book05-digit-card-groups.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const lesson = books.find((b) => b.id === "book-05").lessons.find((l) => l.id === "digit-card-ranked-number");
const items = lesson.original.items;
if (items.length !== 35) throw new Error(`already patched? items ${items.length}`);
const byId = new Map(items.map((item) => [item.id, item]));
const base = "/books/book-05/lessons/1/original/groups";

const STEM_COUNT = "다음 숫자카드가 1장씩만 있을 때, 조건에 맞는 수의 개수를 구하시오.";
const STEM_CHALLENGE = "도전 다음 숫자카드가 1장씩만 있을 때 물음에 답하시오.";
// [묶음 번호, 문제 번호 머리, 물음, 출처 위치, [[원래 문항 id, 답 칸 이름], …]]
const GROUPS = [
  [1, "(1) ", STEM_COUNT, "교사용 슬라이드 25 활동 01 (1)", [["book05-full-s25-01", "한 자리 수"], ["book05-full-s25-02", "두 자리 수"]]],
  [2, "(2) ", STEM_COUNT, "교사용 슬라이드 25 활동 01 (2)", [["book05-full-s25-03", "한 자리 수"], ["book05-full-s25-04", "두 자리 수"], ["book05-full-s25-05", "세 자리 수"]]],
  [3, "(3) ", STEM_COUNT, "교사용 슬라이드 26 활동 01 (3)", [["book05-full-s26-01-1", "한 자리 수"], ["book05-full-s26-01-2", "두 자리 수"], ["book05-full-s26-01-3", "세 자리 수"], ["book05-full-s26-01-4", "네 자리 수"]]],
  [4, "(3) ", "숫자카드 1, 2, 3, 4가 1장씩 있을 때, 만들 수 있는 수 중 다음 수를 구하시오.", "교사용 슬라이드 26 활동 01 (3) Q1~Q4", [["book05-full-s26-01-5", "Q1 두 자리 수 중 6번째로 큰 수"], ["book05-full-s26-01-6", "Q2 세 자리 수 중 5번째로 작은 수"], ["book05-full-s26-01-7", "Q3 세 자리 수 중 8번째로 큰 수"], ["book05-full-s26-01-8", "Q4 네 자리 수 중 10번째로 작은 수"]]],
  [5, "", "다음 세 장의 숫자카드를 한 번씩만 써서 만들 수 있는 서로 다른 수의 개수를 모두 구하시오.", "교사용 슬라이드 27 활동 02 (1)·(2)", [["book05-full-s27-02-1", "(1) 두 자리 수"], ["book05-full-s27-02-2", "(2) 세 자리 수"]]],
  [6, "", "다음 세 장의 숫자카드를 한 번씩만 써서 수를 만듭니다. 만들 수 있는 세 자리 수 중 다음 수를 구하시오.", "교사용 슬라이드 27 활동 03 (1)·(2)", [["book05-full-s27-03-1", "(1) 4번째로 작은 수"], ["book05-full-s27-03-2", "(2) 3번째로 작은 수"]]],
  [7, "", STEM_CHALLENGE, "교사용 슬라이드 30 도전 (1)~(4)", [["book05-full-s30-01", "(1) 한 자리 수의 개수"], ["book05-full-s30-02", "(2) 두 자리 수의 개수"], ["book05-full-s30-03", "(3) 세 자리 수의 개수"], ["book05-full-s30-04", "(4) 네 자리 수의 개수"]]],
  [8, "", STEM_CHALLENGE, "교사용 슬라이드 30 도전 (5)~(8)", [["book05-full-s30-05", "(5) 두 자리 수 중 5번째로 작은 수"], ["book05-full-s30-06", "(6) 두 자리 수 중 10번째로 작은 수"], ["book05-full-s30-07", "(7) 두 자리 수 중 4번째로 큰 수"], ["book05-full-s30-08", "(8) 두 자리 수 중 12번째로 큰 수"]]],
  [9, "", STEM_CHALLENGE, "교사용 슬라이드 30 도전 (9)~(12)", [["book05-full-s30-09", "(9) 세 자리 수 중 7번째로 작은 수"], ["book05-full-s30-10", "(10) 세 자리 수 중 13번째로 작은 수"], ["book05-full-s30-11", "(11) 세 자리 수 중 6번째로 큰 수"], ["book05-full-s30-12", "(12) 세 자리 수 중 12번째로 큰 수"]]],
  [10, "", STEM_CHALLENGE, "교사용 슬라이드 30 도전 (13)·(14)", [["book05-full-s30-13", "(13) 네 자리 수 중 5번째로 작은 수"], ["book05-full-s30-14", "(14) 네 자리 수 중 5번째로 큰 수"]]]
];

const used = new Set();
const grouped = new Map();
for (const [number, head, stem, locator, members] of GROUPS) {
  const sources = members.map(([id]) => {
    const item = byId.get(id);
    if (!item) throw new Error(`missing ${id}`);
    if (used.has(id)) throw new Error(`used twice ${id}`);
    used.add(id);
    return item;
  });
  const first = sources[0];
  const digits = JSON.stringify(first.visual.digits);
  if (sources.some((item) => JSON.stringify(item.visual.digits) !== digits)) throw new Error(`group ${number} mixes cards`);
  const discrepancies = sources.map((item) => item.sourceDiscrepancy).filter(Boolean);
  const { ask, ...visual } = first.visual;
  grouped.set(first.id, {
    id: `book05-full-group-${number}`,
    sourceNo: first.sourceNo,
    lessonId: first.lessonId,
    typeLabel: first.typeLabel,
    sourceLocator: locator,
    printGroup: first.printGroup,
    prompt: `${head}${stem}`,
    visual,
    answerRef: `${base}/${number}`,
    ...(discrepancies.length ? { sourceDiscrepancy: discrepancies.join(" ") } : {}),
    parts: sources.map((item, index) => ({ id: `p${index + 1}`, label: members[index][1], answerRef: item.answerRef }))
  });
}
const next = [];
for (const item of items) {
  if (grouped.has(item.id)) next.push(grouped.get(item.id));
  else if (!used.has(item.id)) next.push(item);
}
lesson.original.items = next;
lesson.original.sourceQuestionCount = next.length;
const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book05 digit-card lesson regrouped", { before: items.length, after: next.length, groups: GROUPS.length, answerSlots: next.reduce((n, item) => n + (item.parts?.length || 1), 0) });
