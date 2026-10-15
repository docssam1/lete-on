// 골든벨 5권 묶음 3: 교사용 슬라이드 18~24 「파스칼 삼각형과 최단거리」 27문항.
// 이 스크립트에는 정답이 없다(정답은 비공개 DB에만). node patch-book05-batch3.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-05");
if (book.lessons.some((l) => l.id === "shortest-route-source")) throw new Error("already patched");
const L0 = book.lessons.find((l) => l.id === "path-number-grid");

const rect = (r0, c0, rows, cols) => Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => [r0 + r, c0 + c])).flat();
const AB = (r, c) => [{ r: 0, c: 0, label: "A" }, { r, c, label: "B", pos: "se" }];
const route = (extra) => ({ kind: "book5", subtype: "source-route", ...extra });
const shape = (cells) => { const R = Math.max(...cells.map(([r]) => r)) + 1, C = Math.max(...cells.map(([, c]) => c)) + 1; return route({ rows: R, cols: C, cells, points: AB(R, C) }); };
const grid = (rows, cols, extra = {}) => route({ rows, cols, points: AB(rows, cols), ...extra });

const P01 = "다음 그림의 A 지점에서 B 지점까지 가는 최단거리의 가짓수를 구하시오.";
const P02 = "다음 그림의 A 지점에서 B 지점까지 최단거리로 갈 수 있는 방법의 가짓수를 구하시오.";
const P03 = "다음 그림을 보고 A에서 B까지 최단거리로 갈 수 있는 방법의 가짓수를 구하시오.";
const P04 = "다음 그림을 보고 굵은 선을 따라 A에서 B까지 최단거리로 갈 수 있는 방법의 가짓수를 구하시오.";
const P05 = "출발에서 도착까지 되돌아가지 않고 갈 수 있는 방법의 가짓수를 구하시오.";
const specs = [
  ...[[1, 1], [3, 1], [2, 2]].map(([rows, cols], k) => ({ no: `GB5-S18-01-${k + 1}`, loc: `교사용 슬라이드 18 활동 01 (${k + 1})`, group: 1, type: "격자 최단거리", prompt: `(${k + 1}) ${P01}`, visual: grid(rows, cols) })),
  ...[[1, 2], [1, 3], [1, 4], [1, 5], [2, 2], [2, 3]].map(([rows, cols], k) => ({ no: `GB5-S19-02-${k + 1}`, loc: `교사용 슬라이드 19 활동 02 그림 ${k + 1}`, group: 2, type: "격자 최단거리", prompt: `${P02} (그림 ${k + 1})`, visual: grid(rows, cols) })),
  ...[
    [...rect(0, 0, 1, 1), ...rect(1, 1, 1, 1)],
    [...rect(0, 0, 1, 2), ...rect(1, 2, 1, 2)],
    [...rect(0, 0, 1, 1), ...rect(1, 1, 1, 2)],
    [...rect(0, 0, 1, 2), ...rect(1, 2, 2, 2)],
    [...rect(0, 0, 1, 1), ...rect(1, 1, 2, 2)]
  ].map((cells, k) => ({ no: `GB5-S20-03-${k + 1}`, loc: `교사용 슬라이드 20 활동 03 그림 ${k + 1}`, group: 3, type: "이어 붙인 모양의 최단거리", prompt: `${P03} (그림 ${k + 1})`, visual: shape(cells) })),
  ...[
    [2, 2, [[0, 0], [1, 1]]],
    [3, 3, [[0, 0], [1, 0], [2, 1], [2, 2]]],
    [2, 3, [[0, 0], [0, 1], [1, 2]]],
    [3, 3, [...rect(0, 0, 2, 2), [2, 2]]]
  ].map(([rows, cols, bold], k) => ({ no: `GB5-S21-04-${k + 1}`, loc: `교사용 슬라이드 21 활동 04 그림 ${k + 1}`, group: 4, type: "굵은 선 최단거리", prompt: `${P04} (그림 ${k + 1})`, visual: grid(rows, cols, { bold }) })),
  ...[
    [3, 4, [[0, 0], ...rect(1, 1, 2, 3)], []],
    [4, 4, [...rect(0, 0, 2, 2), [3, 3]], [[2, 2]]],
    [3, 4, [...rect(0, 0, 2, 2), [2, 2], [2, 3]], []],
    [4, 5, [...rect(0, 0, 2, 2), [3, 3], [3, 4]], [[2, 2]]]
  ].map(([rows, cols, bold, diagonals], k) => ({ no: `GB5-S22-04-${k + 5}`, loc: `교사용 슬라이드 22 활동 04 이어서 그림 ${k + 1}`, group: 5, type: diagonals.length ? "굵은 선과 대각선 최단거리" : "굵은 선 최단거리",
    prompt: `${P04} (그림 ${k + 5})`, visual: grid(rows, cols, { bold, diagonals }) })),
  { no: "GB5-S23-05-1", loc: "교사용 슬라이드 23 활동 05 그림 1", group: 6, type: "갈림길 가짓수", prompt: `${P05} (그림 1)`, visual: { kind: "book5", subtype: "source-loop-routes" },
    discrepancy: "원본 05에는 학생용 물음 문장이 없고 교사 메모만 있어 03과 같은 뜻의 물음을 붙였습니다. 길 이름(가·나·다)은 교사용 표시라 넣지 않았습니다." },
  { no: "GB5-S23-05-2", loc: "교사용 슬라이드 23 활동 05 그림 2", group: 6, type: "이어 붙인 모양의 최단거리", prompt: `${P05} (그림 2)`,
    visual: route({ rows: 2, cols: 3, cells: [[0, 0], [1, 1], [1, 2]], points: [{ r: 0, c: 0, label: "출발" }, { r: 2, c: 3, label: "도착", pos: "se" }] }) },
  { no: "GB5-S24-06-1", loc: "교사용 슬라이드 24 활동 06 (1)", group: 7, type: "거쳐 가는 최단거리", prompt: "A→C로 가는 최단거리는 몇 가지입니까?",
    visual: route({ rows: 4, cols: 4, cells: [...rect(0, 0, 2, 2), ...rect(2, 2, 2, 2)], points: [{ r: 0, c: 0, label: "A" }, { r: 2, c: 2, label: "B", pos: "ne" }, { r: 4, c: 4, label: "C", pos: "se" }] }) },
  { no: "GB5-S24-06-2", loc: "교사용 슬라이드 24 활동 06 (2)", group: 7, type: "거쳐 가는 최단거리", prompt: "A에서 B를 거쳐 C로 가는 최단거리는 몇 가지입니까?",
    visual: grid(3, 4, { points: [{ r: 0, c: 0, label: "A" }, { r: 1, c: 3, label: "B", pos: "se" }, { r: 3, c: 4, label: "C", pos: "se" }] }) },
  { no: "GB5-S24-06-3", loc: "교사용 슬라이드 24 활동 06 (3)", group: 7, type: "대각선이 있는 최단거리", prompt: "A에서 B까지의 최단거리는 몇 가지입니까?", visual: grid(4, 4, { diagonals: [[2, 1]] }) }
];
const items = specs.map((spec, index) => {
  const item = { id: `book05-full-${spec.no.slice(4).toLowerCase()}`, sourceNo: spec.no, lessonId: "shortest-route-source", typeLabel: spec.type, sourceLocator: spec.loc, printGroup: spec.group,
    answerMode: "input", inputMode: "numeric", prompt: spec.prompt, visual: spec.visual, answerRef: `/books/book-05/lessons/8/original/items/${index}` };
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  return item;
});

const L8 = {
  id: "shortest-route-source", unit: "최단거리와 숫자 카드", title: "최단거리 가짓수", sourceLocator: "교사용 슬라이드 18~24 활동 01~06",
  sourceTypeIds: ["shortest-route-source"], representativeConcept: "각 점까지 오는 가짓수를 왼쪽과 위쪽 수의 합으로 이어 적어(파스칼 삼각형) 최단거리 가짓수를 구하고, 이어 붙인 길은 곱으로 구함",
  story: { title: "가장 짧은 길 세기", text: "최단거리는 가장 빠르게 가는 길입니다. 격자에서는 오른쪽과 아래쪽으로만 가면 가장 짧습니다.", mission: "각 점까지 올 수 있는 가짓수를 적으며 B까지 가 보세요." },
  explanation: { headline: "각 점에는 왼쪽 점의 수와 위쪽 점의 수를 더해 적습니다.",
    steps: ["출발점에서 곧게 가는 가장자리 점은 모두 1가지입니다.", "안쪽 점은 왼쪽 점의 수와 위쪽 점의 수를 더합니다.", "굵은 선만 다닐 수 있으면 굵은 선으로 이어진 점의 수만 더합니다.", "한 점에서 이어 붙은 길은 앞 길의 가짓수와 뒤 길의 가짓수를 곱합니다."] },
  experience: {
    ...JSON.parse(JSON.stringify(L0.experience)), family: "shortest-route-count", title: "갈림길마다 수를 더해요",
    beats: [
      { id: "shortest-route-count-step-1", action: "reveal", caption: "한 칸짜리 네모는 위로 돌아가는 길 1가지와 아래로 돌아가는 길 1가지가 있어 1+1입니다.",
        visual: route({ rows: 1, cols: 1, points: AB(1, 1), numbers: [{ r: 0, c: 1, v: 1 }, { r: 1, c: 0, v: 1 }, { r: 1, c: 1, v: "1+1" }] }) },
      { id: "shortest-route-count-step-2", action: "highlight", caption: "각 점에는 왼쪽 점과 위쪽 점의 수를 더해 적습니다. 가장자리는 모두 1입니다.",
        visual: route({ rows: 3, cols: 3, points: AB(3, 3), numbers: [{ r: 0, c: 1, v: 1 }, { r: 0, c: 2, v: 1 }, { r: 0, c: 3, v: 1 }, { r: 1, c: 0, v: 1 }, { r: 2, c: 0, v: 1 }, { r: 3, c: 0, v: 1 }, { r: 1, c: 1, v: 2 }, { r: 1, c: 2, v: 3 }, { r: 2, c: 1, v: 3 }, { r: 2, c: 2, v: 6 }] }) },
      { id: "shortest-route-count-step-3", action: "verify", caption: "두 모양이 한 점에서 이어지면, 이음점까지의 가짓수 3과 그 뒤의 가짓수 3을 곱해 3×3=9입니다.",
        visual: route({ rows: 3, cols: 3, cells: [[0, 0], [1, 0], [2, 1], [2, 2]], points: AB(3, 3), numbers: [{ r: 2, c: 1, v: 3 }, { r: 3, c: 3, v: "3×3" }] }) }
    ],
    hint: "가장자리 점은 1, 안쪽 점은 왼쪽 수 + 위쪽 수입니다.",
    check: { prompt: "가로 4칸, 세로 2칸인 격자에서 왼쪽 위에서 오른쪽 아래까지 최단거리의 가짓수는 얼마일까요?", options: ["15", "10", "8"], answerRef: "/books/book-05/lessons/8/experience/check" }
  },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: items.length, structureKey: "shortest-route-source", prompt: P02, visual: specs[0].visual, items },
  extension: { title: "추가 학습", structureKey: "shortest-route-source", story: "가로 4칸, 세로 3칸인 격자 길이 있습니다.", prompt: "A에서 B까지 최단거리의 가짓수를 쓰세요.",
    visual: grid(3, 4), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-05/lessons/8/extension" }
};
book.lessons.push(L8);

const cleared = new Set(["S18", "S19", "S20", "S21", "S22", "S23", "S24"].map((s) => `GB5-${s}-H01`));
const before = book.sourceHold.length;
book.sourceHold = book.sourceHold.filter((hold) => !cleared.has(hold.sourceNo));
if (before - book.sourceHold.length !== 7) throw new Error("hold count");
const publicCount = book.lessons.reduce((sum, l) => sum + l.original.items.length, 0);
Object.assign(book.sourceCoverage, { public: publicCount, hold: book.sourceHold.length, total: publicCount + book.sourceHold.length });

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book05 batch3 patched", { L8: items.length, coverage: book.sourceCoverage });
