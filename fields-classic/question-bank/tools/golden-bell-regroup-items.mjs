// 골든벨에서 같은 이야기·같은 그림에 (1)(2)(3)… 물음만 다른 문항들을 원본 문제 하나로 묶는다(2026-10-23, 원장 요청
// 「하나씩 분리하다 보니 문제가 엄청난 것처럼 보여」). 묶은 문항은 공통 물음 + 답 칸(parts)이 되고, 답 칸의 answerRef는
// 원래 문항 키를 그대로 옮긴다(정답 불변). 묶음 풀이 키 `…/lessons/<번호>/original/groups/<k>`는 DB에 따로 넣는다.
// 5권 숫자 카드 단원(tools/golden-bell-book05/patch-book05-digit-card-groups.mjs) 다음의 같은 꼴 묶음이다. 정답 없음.
// node golden-bell-regroup-items.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));

const range = (prefix, from, to) => Array.from({ length: to - from + 1 }, (_, i) => `${prefix}${from + i}`);
const PALINDROME_STEM = "232, 4554처럼 앞으로 읽으나 뒤로 읽으나 똑같은 수를 대칭수라고 합니다. (단, 대칭수는 두 자리 이상의 수에서 찾습니다.) 다음 주어진 대칭수의 개수를 구하시오.";
const venn = (people, apple, grape) => `영주의 친구들은 ${people}명인데 모두 과일을 좋아합니다. 그중에서 사과를 좋아하는 친구가 ${apple}명이고, 포도를 좋아하는 친구가 ${grape}명입니다.`;
const CONDITION = "다음 조건에 알맞은 수를 구하시오.";
// { 권, 학습, 묶음 번호(그 학습 안), 공통 물음, 출처 위치, 원래 문항 id들 }
const SPECS = [
  { book: "book-07", lesson: "palindrome-source", group: 1, stem: PALINDROME_STEM, locator: "교사용 슬라이드 52 · 활동 01 팔린드롬과 대칭수 1. 대칭수 개수 구하기 01 (1)~(5)", ids: range("book07-src-s52-01-", 1, 5) },
  { book: "book-07", lesson: "venn-overlap-all", group: 1, stem: venn(15, 7, 12), locator: "교사용 슬라이드 63 · 2. 벤 다이어그램 01 (1)~(4)", ids: range("book07-src-s63-01-", 1, 4) },
  { book: "book-07", lesson: "venn-overlap-all", group: 2, stem: venn(27, 15, 21), locator: "교사용 슬라이드 63 · 2. 벤 다이어그램 02 (1)~(4)", ids: range("book07-src-s63-02-", 1, 4) },
  { book: "book-05", lesson: "triangle-number-source", group: 1, stem: "□개의 점 중 두 점을 연결한 선분의 개수를 구하시오.", locator: "교사용 슬라이드 54 활동 03 (1)~(3)", ids: range("book05-full-s54-03-", 1, 3) },
  { book: "book-05", lesson: "two-digit-condition-source", group: 1, stem: CONDITION, locator: "교사용 슬라이드 31 활동 05 (1)~(4)", ids: range("book05-full-s31-05-", 1, 4) },
  { book: "book-05", lesson: "two-digit-condition-source", group: 2, stem: CONDITION, locator: "교사용 슬라이드 31 활동 05 (5)~(8)", ids: range("book05-full-s31-05-", 5, 8) },
  { book: "book-05", lesson: "two-digit-condition-source", group: 3, stem: CONDITION, locator: "교사용 슬라이드 31 활동 05 (9)~(12)", ids: range("book05-full-s31-05-", 9, 12) },
  // 2차(원장 「1권부터 10권까지」): 1~10권을 다시 훑어 같은 꼴 연속 문항을 더 묶음. 1권 「모든 줄의 합」·6권 「빠진 한 변」은
  // 이미 그림 한 장에 함께 나오는 학습이라, 5권 곱셈구구 관찰은 고르기 문항이라 그대로 둔다.
  { book: "book-05", lesson: "radial-rows-source", group: 1, stem: "다음 그림과 같은 규칙으로 1부터 차례로 수를 나열하였습니다. ①번 줄의 4번째 수는 13이고, 15는 ③번 줄의 4번째 수입니다.", ids: range("book05-full-s09-08-", 1, 4) },
  { book: "book-05", lesson: "calendar-weekday-source", group: 1, stem: "어느 해 4월 첫 번째 월요일과 두 번째 월요일의 합은 13입니다.", ids: range("book05-full-s15-04-", 1, 2) },
  { book: "book-05", lesson: "calendar-weekday-source", group: 2, stem: "어느 해 9월 두 번째 목요일과 세 번째 일요일의 합은 28입니다.", ids: range("book05-full-s15-05-", 1, 2) },
  { book: "book-05", lesson: "checkerboard-product-matrix", group: 1, stem: "도전 다음 빈 칸에 2, 3, 4, 5, 6, 7, 8, 9를 한 번씩 넣어 곱셈 매트릭스를 만들었습니다.", ids: range("book05-full-s40-07-", 1, 3), labels: ["(1) 5가 있는 곳은? (칸의 글자를 쓰시오)", "(2) 8이 있는 곳은? (칸의 글자를 쓰시오)", "(3) 3이 있는 곳은? (칸의 글자를 쓰시오)"] },
  { book: "book-05", lesson: "square-number-source", group: 1, stem: "다음을 계산하시오.", ids: range("book05-full-s57-02-", 1, 3) },
  { book: "book-07", lesson: "reverse-growth", group: 1, stem: "준교가 매일 2배씩 자라는 개구리풀 하나를 가져와 연못에 넣었더니 1일째 되는 날 그림의 색칠된 부분만큼 연못을 덮었습니다.", ids: range("book07-src-s42-03-", 1, 2) },
  { book: "book-07", lesson: "palindrome-source", group: 2, stem: "시각을 보기와 같이 수로 나타낼 때, 대칭수는 모두 몇 번 나타납니까?", ids: range("book07-src-s56-09-", 1, 2) },
  { book: "book-07", lesson: "palindrome-source", group: 3, stem: "시각을 보기와 같이 수로 나타낼 때, 대칭수는 모두 몇 번 나타납니까?", ids: range("book07-src-s56-10-", 1, 2) },
  { book: "book-07", lesson: "venn-overlap-all", group: 3, stem: "원석이의 친구들은 모두 축구나 야구를 좋아합니다. 그중에서 축구를 좋아하는 친구는 13명이고, 야구를 좋아하는 친구는 9명입니다.", ids: range("book07-src-s64-03-", 1, 2) }
];

const changed = new Map();
for (const spec of SPECS) {
  const book = books.find((b) => b.id === spec.book);
  const lesson = book.lessons.find((l) => l.id === spec.lesson);
  const items = lesson.original.items;
  if (items.some((entry) => entry.id === `${spec.ids[0]}-group`)) continue; // 이미 묶음(도구를 다시 돌릴 때)
  const members = spec.ids.map((id) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) throw new Error(`${spec.book}/${spec.lesson}: missing ${id} (already grouped?)`);
    if (item.parts || item.resultContract) throw new Error(`${id}: not a single-answer item`);
    if (!item.prompt.startsWith(spec.stem)) throw new Error(`${id}: stem differs`);
    if (JSON.stringify(item.visual ?? null) !== JSON.stringify(members0(items, spec).visual ?? null)) throw new Error(`${id}: visual differs`);
    return item;
  });
  const first = members[0];
  const lessonNumber = first.answerRef.match(/\/lessons\/(\d+)\//)[1];
  const groupRef = `/books/${spec.book}/lessons/${lessonNumber}/original/groups/${spec.group}`;
  if (JSON.stringify(book).includes(`"${groupRef}"`)) throw new Error(`${groupRef} taken`);
  const discrepancies = members.map((item) => item.sourceDiscrepancy).filter(Boolean);
  const { answerMode, inputMode, sourceDiscrepancy, ...rest } = first;
  const grouped = {
    ...rest,
    id: `${first.id}-group`,
    sourceLocator: spec.locator || `${first.sourceLocator.replace(/\s*\(1\)\s*$/u, "")} (1)~(${members.length})`,
    prompt: spec.stem,
    answerRef: groupRef,
    ...(discrepancies.length ? { sourceDiscrepancy: discrepancies.join(" ") } : {}),
    parts: members.map((item, index) => ({
      id: `p${index + 1}`,
      label: spec.labels?.[index] || item.prompt.slice(spec.stem.length).trim(),
      ...(item.inputMode === "text" ? { inputMode: "text" } : {}),
      answerRef: item.answerRef
    }))
  };
  if (grouped.parts.some((part) => !part.label)) throw new Error(`${first.id}: empty part label`);
  const ids = new Set(spec.ids);
  lesson.original.items = items.flatMap((item) => item.id === first.id ? [grouped] : ids.has(item.id) ? [] : [item]);
  lesson.original.sourceQuestionCount = lesson.original.items.length;
  changed.set(spec.book, [...(changed.get(spec.book) || []), { page: first.sourcePage, removed: members.length - 1 }]);
}
function members0(items, spec) { return items.find((entry) => entry.id === spec.ids[0]); }

// 장부: 문항 수를 센 칸만 고친다(답 칸 수는 그대로).
for (const [bookId, edits] of changed) {
  const book = books.find((b) => b.id === bookId);
  const cov = book.sourceCoverage;
  const removed = edits.reduce((n, edit) => n + edit.removed, 0);
  if (Number.isInteger(cov.publicItems)) cov.publicItems -= removed;
  if (Array.isArray(cov.pageLedger)) for (const edit of edits) {
    const page = cov.pageLedger.find((entry) => entry.page === edit.page);
    if (page) page.releasedItems -= edit.removed;
  }
  if (bookId === "book-05") {
    const items = book.lessons.reduce((n, l) => n + l.original.items.length, 0);
    cov.total = items; cov.public = items;
  }
}

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
const allIds = books.flatMap((b) => b.lessons.flatMap((l) => l.original.items.map((item) => `${b.id}/${item.id}`)));
if (new Set(allIds).size !== allIds.length) throw new Error("duplicate item id after regrouping");
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("regrouped", SPECS.map((s) => `${s.book}/${s.lesson}#${s.group}:${s.ids.length}`).join(" "));
