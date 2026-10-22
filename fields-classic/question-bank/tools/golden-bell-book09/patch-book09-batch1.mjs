// 골든벨 9권 묶음 1: 교사용 판서 1~2쪽 「01-2 도형의 넓이」 Q1 (1)~(5) 25문항.
// 원본은 모눈 노트에 손으로 그린 판서다. 검정 선(문제)만 옮기고, 빨강·파랑 필기(답·풀이)는 옮기지 않는다.
// 좌표는 노트 모눈 칸 번호 그대로 적고, 도형마다 바깥 1칸을 남겨 원점으로 옮긴다.
// 이 스크립트에는 정답이 없다. node patch-book09-batch1.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-09");
const L0 = book.lessons[0];
if (L0.id !== "unit-area-and-half") throw new Error("unexpected lesson 0");
if (L0.original.items.some((it) => it.sourceNo?.startsWith("GB9-"))) throw new Error("already patched");

// 도형 하나 → 모눈 그림. shapes: 칠하는 도형들, frame: [x0,y0,x1,y1] 틀, lines: 안쪽 선
const grid = ({ shapes, frame, lines }) => {
  const xs = [...shapes.flat().map(([x]) => x), ...(frame ? [frame[0], frame[2]] : [])];
  const ys = [...shapes.flat().map(([, y]) => y), ...(frame ? [frame[1], frame[3]] : [])];
  const dx = 1 - Math.min(...xs), dy = 1 - Math.min(...ys);
  const move = ([x, y]) => [x + dx, y + dy];
  const visual = { kind: "book9", subtype: "area-grid", gridWidth: Math.max(...xs) - Math.min(...xs) + 2, gridHeight: Math.max(...ys) - Math.min(...ys) + 2 };
  if (shapes.length === 1) visual.points = shapes[0].map(move); else visual.polygons = shapes.map((s) => s.map(move));
  if (frame) visual.frame = [...move([frame[0], frame[1]]), ...move([frame[2], frame[3]])];
  if (lines) visual.lines = lines.map(([a, b, c, d]) => [...move([a, b]), ...move([c, d])]);
  return visual;
};
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const ASK = "모눈 한 칸의 넓이를 1로 보고 도형의 넓이를 구하시오.";
const ASK_FRAME = "직사각형 안에 색칠한 도형의 넓이를 구하시오.";
const specs = [
  // 1쪽 (1) 직사각형
  [1, "1) 직사각형", 11, "직사각형의 넓이", ASK, { shapes: [rect(3, 24, 5, 25)] }],
  [1, "1) 직사각형", 11, "직사각형의 넓이", ASK, { shapes: [rect(7, 24, 10, 26)] }],
  // (2) 정사각형을 반으로 나눈 삼각형
  [1, "2) 반으로 나눈 정사각형", 12, "반으로 나눈 정사각형", "정사각형을 반으로 나눈 삼각형 두 개를 합친 넓이는 얼마입니까?", { shapes: [rect(3, 27, 4, 28)], lines: [[3, 28, 4, 27]] }],
  [1, "2) 반 칸 삼각형", 12, "반 칸 삼각형 모으기", ASK, { shapes: [[[3, 31], [4, 30], [5, 31]]] }],
  [1, "2) 반 칸 삼각형", 12, "반 칸 삼각형 모으기", ASK, { shapes: [[[3, 34], [5, 33], [5, 34]]] }],
  // 직사각형을 반으로 나눈 직각삼각형
  [1, "2) 직각삼각형", 13, "직사각형을 반으로 나눈 삼각형", ASK, { shapes: [[[24, 2], [24, 4], [27, 4]]] }],
  [1, "2) 직각삼각형", 13, "직사각형을 반으로 나눈 삼각형", ASK, { shapes: [[[31, 1], [35, 1], [35, 5]]] }],
  [1, "2) 직각삼각형", 13, "직사각형을 반으로 나눈 삼각형", ASK, { shapes: [[[24, 13], [26, 8], [26, 13]]] }],
  [1, "2) 직각삼각형", 13, "직사각형을 반으로 나눈 삼각형", ASK, { shapes: [[[36, 7], [40, 7], [40, 14]]] }],
  // (3) 여러 모양
  [1, "3) 여러 모양", 14, "여러 모양의 넓이", ASK, { shapes: [[[25, 17], [26, 17], [27, 19], [26, 19]]] }],
  [1, "3) 여러 모양", 14, "여러 모양의 넓이", ASK, { shapes: [[[30, 19], [31, 17], [33, 17], [32, 19]]] }],
  [1, "3) 여러 모양", 14, "여러 모양의 넓이", ASK, { shapes: [[[37, 18], [40, 17], [41, 18], [40, 19]]] }],
  [1, "3) 여러 모양", 15, "여러 모양의 넓이", ASK, { shapes: [[[24, 24], [27, 23], [27, 24], [24, 25]]] }],
  [1, "3) 여러 모양", 15, "여러 모양의 넓이", ASK, { shapes: [[[35, 22], [36, 23], [36, 24], [37, 25], [36, 25], [36, 26], [34, 26], [34, 25], [33, 25], [34, 24], [34, 23]]] }],
  [1, "3) 여러 모양", 16, "여러 모양의 넓이", ASK, { shapes: [[[26, 28], [27, 29], [26, 30], [25, 29]], [[24, 33], [26, 30], [28, 33]], [[28, 33], [29, 31], [29, 33]]] }],
  [1, "3) 여러 모양", 16, "여러 모양의 넓이", ASK, { shapes: [[[33, 32], [34, 31], [35, 31], [36, 30], [36, 31], [38, 31], [39, 30], [39, 31], [38, 32], [36, 32], [37, 33], [36, 33], [35, 32]]] }],
  // 2쪽 (4) 직사각형 틀 안의 도형
  [2, "4) 틀 안의 도형", 21, "틀 안의 도형", ASK_FRAME, { frame: [2, 1, 4, 5], shapes: [[[3, 1], [2, 3], [4, 5]]] }],
  [2, "4) 틀 안의 도형", 21, "틀 안의 도형", ASK_FRAME, { frame: [9, 2, 14, 5], shapes: [[[11, 2], [14, 2], [14, 3], [13, 5], [9, 4]]] }],
  [2, "4) 틀 안의 도형", 21, "틀 안의 도형", ASK_FRAME, { frame: [2, 8, 5, 12], shapes: [[[2, 8], [5, 9], [4, 12]]] }],
  [2, "4) 틀 안의 도형", 21, "틀 안의 도형", ASK_FRAME, { frame: [10, 8, 16, 13], shapes: [[[10, 8], [16, 12], [11, 13]]] }],
  // (5) 틀 안의 기운 사각형
  [2, "5) 틀 안의 기운 사각형", 22, "틀 안의 기운 사각형", ASK_FRAME, { frame: [2, 16, 5, 19], shapes: [[[2, 17], [4, 16], [5, 18], [3, 19]]] }],
  [2, "5) 틀 안의 기운 사각형", 22, "틀 안의 기운 사각형", ASK_FRAME, { frame: [10, 16, 15, 21], shapes: [[[10, 18], [13, 16], [15, 19], [12, 21]]] }],
  [2, "5) 틀 안의 기운 사각형", 23, "틀 안의 기운 사각형", ASK_FRAME, { frame: [2, 23, 6, 27], shapes: [[[2, 24], [5, 23], [6, 26], [3, 27]]] }],
  [2, "5) 틀 안의 기운 사각형", 23, "틀 안의 기운 사각형", ASK_FRAME, { frame: [2, 31, 6, 36], shapes: [[[2, 33], [5, 31], [6, 34], [3, 36]]] }],
  [2, "5) 틀 안의 기운 사각형", 23, "틀 안의 기운 사각형", ASK_FRAME, { frame: [12, 25, 17, 33], shapes: [[[12, 28], [16, 25], [17, 30], [13, 33]]] }]
];
const counter = {};
const items = specs.map(([page, part, group, type, prompt, fig], k) => {
  counter[page] = (counter[page] || 0) + 1;
  const n = counter[page];
  return { id: `book09-src-s0${page}-01-${n}`, lessonId: L0.id, sourcePage: page, sourceNo: `GB9-S0${page}-01-${n}`,
    sourceLocator: `교사용 판서 ${page}쪽 · 01-2 도형의 넓이 Q1 ${part} (${n}번째 그림)`, printGroup: group, topic: "도형의 넓이",
    typeLabel: type, prompt, answerMode: "input", inputMode: "numeric", visual: grid(fig), answerRef: `/books/book-09/lessons/0/original/items/${k}` };
});
L0.sourceLocator = "교사용 판서 1~2쪽 · 01-2 도형의 넓이 Q1 (1)~(5)";
L0.original = { ...L0.original, title: "골든벨", prompt: ASK, items, sourceQuestionCount: items.length };
delete L0.original.visual;
L0.experience = { ...L0.experience, title: "칸을 세어 넓이를 구해요", model: { visual: { kind: "book9", subtype: "area-grid", gridWidth: 3, gridHeight: 2, points: [[0, 0], [3, 0], [3, 1], [1, 1], [1, 2], [0, 2]] } },
  beats: [
    { id: "area-beat-1", action: "draw", phase: "problem", caption: "모눈 위에 ㄱ자 모양이 있어요. 한 칸의 넓이를 1로 봐요." },
    { id: "area-beat-2", action: "highlight", phase: "organize", caption: "도형 안에 꽉 찬 칸을 하나씩 표시해요." },
    { id: "area-beat-3", action: "transform", phase: "calculate", caption: "표시한 칸마다 1씩 더해요." },
    { id: "area-beat-4", action: "verify", phase: "verify", caption: "칸 수를 모두 더한 값이 넓이예요. 삼각형은 같은 직사각형의 반으로 생각해요." }
  ],
  check: { prompt: "가로 6칸, 세로 2칸 직사각형을 대각선으로 반으로 나눈 삼각형의 넓이는 얼마입니까?", options: ["6", "12", "8"], answerRef: "/books/book-09/lessons/0/experience/check" } };

// 장부: 1쪽 슬롯 하나(16), 2쪽 넓이 슬롯(9) 추가, 보류 S1-05 해제
const ids = (page) => items.filter((it) => it.sourcePage === page).map((it) => it.id);
const [p1, p2] = book.sourceCoverage.pages;
if (p1.page !== 1 || p2.page !== 2) throw new Error("ledger pages");
p1.slots = [{ id: "GB9-S01-01", status: "released", itemIds: ids(1) }];
p2.slots = [{ id: "GB9-S02-01", status: "released", itemIds: ids(2) }, ...p2.slots.filter((s) => !s.id.startsWith("GB9-"))];
book.sourceHold = book.sourceHold.filter((h) => h.sourceNo !== "S1-05");
const slots = book.sourceCoverage.pages.flatMap((p) => p.slots);
const allItems = book.lessons.flatMap((l) => l.original.items);
const released = slots.filter((s) => s.status === "released");
for (const s of released) for (const id of s.itemIds) if (!allItems.some((it) => it.id === id)) throw new Error(`ledger item ${id}`);
Object.assign(book.sourceCoverage, { sourceSlots: slots.length, releasedSlots: released.length, heldSlots: slots.length - released.length,
  publicItems: allItems.length, publicAnswerUnits: allItems.reduce((n, it) => n + (it.parts?.length || 1), 0) });
if (book.sourceCoverage.heldSlots !== book.sourceHold.length) throw new Error("hold count");
book.source.note = `교사용 판서 11쪽(10~11쪽은 10권 내용)을 묶음별로 원본 대조합니다. 원본 대조를 마친 쪽: 1~2쪽 넓이. 공개 ${allItems.length}문항, 보류 ${book.sourceHold.length}건.`;

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
const { pages: _p, ...coverage } = book.sourceCoverage;
console.log("book09 batch1 patched", { items: items.length, holds: book.sourceHold.length, coverage });
