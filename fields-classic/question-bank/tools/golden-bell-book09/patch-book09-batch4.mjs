// 골든벨 9권 묶음 4: 교사용 판서 7~8쪽 03-1 마방진.
// Q1 마방진의 성질 1) 2문항 · 2) 6문항 / Q2 겹치는 칸 1) 6문항 · 2) 2문항 · 3) 5문항 → 단원 2(magic-square-missing)를 원본대로 다시 만든다.
// 판서의 검정 글씨(주어진 수·A·B·□)만 옮기고, 빨강·파랑 필기(답·풀이·칸 이름 a~d·겹치는 칸 동그라미)는 옮기지 않는다.
// 이 스크립트에는 정답이 없다. node patch-book09-batch4.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-09");
const L2 = book.lessons.find((l) => l.id === "magic-square-missing");
if (!L2 || L2.original.items.length !== 2 || L2.original.items[0].sourcePage !== 6) throw new Error("lesson 2 state (already patched?)");
if (!L2.extension.answerRef.includes("/lessons/2/")) throw new Error("lesson 2 number");

// 칸 글: 줄은 「|」, 칸은 빈칸 하나로 나눈다. 「_」 = 빈 칸, 수 = 주어진 수, 그 밖의 글자(□·A·B) = 구할 칸.
const G = (text) => {
  const rows = text.split("|").map((row) => row.trim().split(/\s+/));
  const size = rows.length;
  if (rows.some((row) => row.length !== size)) throw new Error(`not square: ${text}`);
  return { kind: "book9", subtype: "magic-grid", size, shown: rows.flat().map((cell) => (cell === "_" ? null : /^\d+$/.test(cell) ? Number(cell) : cell)) };
};
const HEAD = "가로, 세로, 대각선의 합이 모두 같은 마방진입니다.";
const PROMPT = {
  sumBox: `${HEAD} 한 줄의 합과 □에 들어갈 수를 구하시오.`,
  box: `${HEAD} □에 들어갈 수를 구하시오.`,
  ab: `${HEAD} A + B를 구하시오.`,
  a: `${HEAD} A에 들어갈 수를 구하시오.`,
  first: `${HEAD} A와 B 중 먼저 구할 수 있는 칸을 쓰고, A와 B와 한 줄의 합을 구하시오.`
};
const PARTS = {
  sumBox: [{ id: "sum", label: "한 줄의 합" }, { id: "box", label: "□" }],
  first: [{ id: "first", label: "먼저 구할 수 있는 칸", inputMode: "text" }, { id: "a", label: "A" }, { id: "b", label: "B" }, { id: "sum", label: "한 줄의 합" }]
};
const specs = [
  // 7쪽 Q1 1)
  { page: 7, group: 501, loc: "Q1 마방진의 성질 1) 왼쪽", kind: "sumBox", type: "한 줄의 합과 빈칸", grid: "_ _ _|4 6 8|5 □ _",
    discrepancy: "판서의 「가장 먼저 찾을 수 있는 칸」 물음은 필기로 붙인 칸 이름으로 답하는 것이라 받지 않고, 한 줄의 합과 □만 묻습니다." },
  { page: 7, group: 501, loc: "Q1 마방진의 성질 1) 오른쪽", kind: "sumBox", type: "한 줄의 합과 빈칸", grid: "_ 3 8|_ 7 □|6 _ _" },
  // 7쪽 Q1 2)
  { page: 7, group: 502, loc: "Q1 2) 첫째 줄 왼쪽", kind: "box", type: "가운데 수로 빈칸", grid: "_ _ _|_ □ _|8 18 4" },
  { page: 7, group: 502, loc: "Q1 2) 첫째 줄 오른쪽", kind: "box", type: "가운데 수로 빈칸", grid: "_ _ 18|_ □ 19|_ _ 14" },
  { page: 7, group: 503, loc: "Q1 2) 둘째 줄 왼쪽", kind: "ab", type: "가운데 수로 A + B", grid: "_ A _|_ 9 _|_ B _" },
  { page: 7, group: 503, loc: "Q1 2) 둘째 줄 오른쪽", kind: "ab", type: "가운데 수로 A + B", grid: "A _ _|_ 6 _|_ _ B" },
  { page: 7, group: 504, loc: "Q1 2) 셋째 줄 왼쪽", kind: "box", type: "가운데 수로 빈칸", grid: "_ 3 _|9 □ 1|_ _ 6" },
  { page: 7, group: 504, loc: "Q1 2) 셋째 줄 오른쪽", kind: "box", type: "가운데 수로 빈칸", grid: "9 _ 7|_ □ 8|5 _ _" },
  // 7~8쪽 Q2 1)
  { page: 7, group: 505, loc: "Q2 겹치는 칸 찾기 1) 첫째", kind: "a", type: "겹치는 칸으로 빈칸", grid: "_ _ 2|3 A _|_ _ 6" },
  { page: 8, group: 511, loc: "Q2 1) 첫째 줄 왼쪽", kind: "a", type: "겹치는 칸으로 빈칸", grid: "_ 3 8|_ 7 _|_ _ A" },
  { page: 8, group: 511, loc: "Q2 1) 첫째 줄 가운데", kind: "a", type: "겹치는 칸으로 빈칸", grid: "15 A _|_ _ 13|_ _ 3" },
  { page: 8, group: 512, loc: "Q2 1) 첫째 줄 오른쪽", kind: "a", type: "겹치는 칸으로 빈칸", grid: "5 _ 9|10 A _|_ _ _" },
  { page: 8, group: 512, loc: "Q2 1) 둘째 줄 왼쪽", kind: "a", type: "겹치는 칸으로 빈칸", grid: "_ _ _|_ A 8|6 _ 12" },
  { page: 8, group: 513, loc: "Q2 1) 둘째 줄 오른쪽", kind: "a", type: "겹치는 칸으로 빈칸", grid: "_ _ _|15 A _|16 _ 14" },
  // 8쪽 Q2 2)
  { page: 8, group: 514, loc: "Q2 2) 위", kind: "first", type: "먼저 구할 칸 찾기", grid: "A _ _|6 B _|_ 2 12" },
  { page: 8, group: 514, loc: "Q2 2) 아래", kind: "first", type: "먼저 구할 칸 찾기", grid: "18 11 _|_ A 17|_ _ B" },
  // 8쪽 Q2 3) 큰 마방진
  { page: 8, group: 515, loc: "Q2 3) 첫째 줄 왼쪽", kind: "a", type: "큰 마방진의 겹치는 칸", grid: "_ 14 _ _|8 _ A 5|_ 7 _ _|_ 2 _ _" },
  { page: 8, group: 515, loc: "Q2 3) 첫째 줄 오른쪽", kind: "ab", type: "큰 마방진의 겹치는 칸", grid: "13 2 _ _|_ _ _ _|_ A 10 _|_ B _ 4" },
  { page: 8, group: 516, loc: "Q2 3) 둘째 줄 왼쪽", kind: "ab", type: "큰 마방진의 겹치는 칸", grid: "_ _ 9 _|_ _ 4 _|A 11 _ B|_ _ 16 _" },
  { page: 8, group: 516, loc: "Q2 3) 둘째 줄 오른쪽", kind: "ab", type: "큰 마방진의 겹치는 칸", grid: "_ _ A 15|_ _ _ _|_ 10 11 _|3 _ B _" },
  { page: 8, group: 517, loc: "Q2 3) 셋째 줄", kind: "ab", type: "큰 마방진의 겹치는 칸", grid: "_ 24 _ _ _|_ 5 _ _ _|A _ 13 B 22|_ 12 _ _ _|_ 18 _ _ _" }
];
const counter = { 7: 0, 8: 0 };
const items = specs.map((spec, k) => {
  counter[spec.page] += 1;
  const n = counter[spec.page];
  const answerRef = `/books/book-09/lessons/2/original/items/${k}`;
  const item = { id: `book09-src-s0${spec.page}-03-${n}`, lessonId: L2.id, sourcePage: spec.page, sourceNo: `GB9-S0${spec.page}-03-${n}`,
    sourceLocator: `교사용 판서 ${spec.page}쪽 · 03-1 마방진 ${spec.loc}`, printGroup: spec.group, topic: "마방진", typeLabel: spec.type,
    prompt: PROMPT[spec.kind], visual: G(spec.grid), answerRef };
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  if (PARTS[spec.kind]) item.parts = PARTS[spec.kind].map((p, j) => ({ ...p, answerRef: `${answerRef}/parts/${j}` }));
  else Object.assign(item, { answerMode: "input", inputMode: "numeric" });
  return item;
});

L2.title = "가로·세로·대각선의 같은 합으로 빈칸을 찾아요";
L2.sourceLocator = "교사용 판서 7~8쪽 · 03-1 마방진 Q1 마방진의 성질 · Q2 겹치는 칸 찾기";
L2.sourceTypeIds = [...new Set([...(L2.sourceTypeIds || []), "book09-magic-center-source", "book09-magic-overlap-source"])];
L2.representativeConcept = "한 줄의 합은 가운데 수의 3배이고, 수가 모자랄 때는 두 줄이 겹치는 칸을 찾아 두 줄의 나머지 수끼리 비교함";
L2.story = { title: "숫자 유리창", text: "숫자 유리창은 가로, 세로, 대각선 어느 방향으로 더해도 합이 같습니다.", mission: "가운데 수와 두 줄이 겹치는 칸을 먼저 찾아보세요." };
L2.explanation = { headline: "가운데 수는 네 줄에 들어가요. 한 줄의 합은 가운데 수의 3배예요.",
  steps: ["가로, 세로, 대각선의 합이 모두 같은 수 배열을 마방진이라고 합니다.", "3칸 마방진에서 한 줄의 합은 가운데 수의 3배이고, 가운데 수를 사이에 둔 두 수의 합은 가운데 수의 2배입니다.",
    "아는 수가 모자라면 두 줄이 겹치는 칸을 찾습니다. 두 줄의 합이 같으니, 겹치는 칸을 뺀 나머지 수끼리도 합이 같습니다.", "구한 수를 다른 줄에 넣어 합이 같은지 확인합니다."] };
const { visual: _oldSetVisual, ...originalRest } = L2.original;
L2.original = { ...originalRest, title: "골든벨", mode: "paged", structureKey: "magic-square-missing-source-structure", prompt: "가로, 세로, 대각선의 합이 모두 같을 때 빈칸의 수를 구하시오.",
  sourceQuestionCount: items.length, items };
L2.experience = { ...L2.experience, title: "가운데 수와 겹치는 칸을 찾아요", hint: "한 줄의 합은 가운데 수의 3배예요.",
  model: { visual: { kind: "book9", subtype: "magic-grid", size: 3, shown: [2, 7, 6, 9, 5, 1, 4, "□", 8], lineSum: 15 } },
  beats: [
    { id: "magic-beat-1", action: "draw", phase: "problem", caption: "가로, 세로, 대각선 세 수의 합이 모두 같은 수 배열이에요. 가운데 수는 네 줄에 모두 들어가요." },
    { id: "magic-beat-2", action: "highlight", phase: "organize", caption: "빈칸이 든 줄을 하나 골라요. 한 줄의 합은 가운데 수의 3배예요." },
    { id: "magic-beat-3", action: "transform", phase: "calculate", caption: "한 줄의 합에서 그 줄에 적힌 수를 빼요." },
    { id: "magic-beat-4", action: "verify", phase: "verify", caption: "구한 수를 다른 줄에도 넣어 합이 같은지 확인해요. 아는 수가 모자라면 두 줄이 겹치는 칸을 찾아 나머지 수끼리 비교해요." }
  ],
  check: { prompt: "한 줄의 합이 24이고, 빈칸이 있는 줄의 다른 두 수가 11과 6이면 빈칸은?", options: ["7", "13", "17"], answerRef: "/books/book-09/lessons/2/experience/check" } };

// ── 장부: 옛 6쪽 표시였던 두 문항이 7쪽으로 가고, 7·8쪽 보류 해제 ──
const all = book.lessons.flatMap((l) => l.original.items);
const pages = book.sourceCoverage.pages;
const P = (n) => pages.find((p) => p.page === n);
const idsOn = (page) => all.filter((it) => it.sourcePage === page).map((it) => it.id);
P(6).slots = [{ id: "GB9-S06-02", status: "released", itemIds: idsOn(6) }];
P(7).slots = [{ id: "GB9-S07-03", status: "released", itemIds: idsOn(7) }];
P(8).slots = [{ id: "GB9-S08-03", status: "released", itemIds: idsOn(8) }];
book.sourceHold = book.sourceHold.filter((h) => !["S7-Q1", "S7-Q2", "S7-Q3", "S8-Q1", "S8-Q2"].includes(h.sourceNo));
const slots = pages.flatMap((p) => p.slots);
const released = slots.filter((s) => s.status === "released");
for (const s of released) for (const id of s.itemIds) if (!all.some((it) => it.id === id)) throw new Error(`ledger item ${id}`);
if (released.reduce((n, s) => n + s.itemIds.length, 0) !== all.length) throw new Error("ledger misses items");
Object.assign(book.sourceCoverage, { sourceSlots: slots.length, releasedSlots: released.length, heldSlots: slots.length - released.length,
  publicItems: all.length, publicAnswerUnits: all.reduce((n, it) => n + (it.parts?.length || 1), 0) });
if (book.sourceCoverage.heldSlots !== book.sourceHold.length) throw new Error("hold count");
book.source.note = `교사용 판서 11쪽(10~11쪽은 10권 내용)을 묶음별로 원본 대조합니다. 원본 대조를 마친 쪽: 1~8쪽(넓이·쌓기나무·마방진). 공개 ${all.length}문항, 보류 ${book.sourceHold.length}건.`;

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
const { pages: _p, ...coverage } = book.sourceCoverage;
console.log("book09 batch4 patched", { L2: items.length, holds: book.sourceHold.length, coverage });
