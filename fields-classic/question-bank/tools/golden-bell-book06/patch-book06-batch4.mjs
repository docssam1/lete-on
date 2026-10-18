// 골든벨 6권 묶음 4: 교사용 슬라이드 15~16 「직사각형을 잘라 정사각형 만들기·둘레의 차이·모눈 도형의 둘레·직각으로 꺾인 도형의 둘레」.
// 새 단원 15(15쪽)·16(16쪽)으로 덧붙인다.
// 이 스크립트에는 정답이 없다. node patch-book06-batch4.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-06");
if (book.lessons.some((l) => l.id === "cut-grid-perimeter-source")) throw new Error("already patched");
const template = book.lessons.find((l) => l.id === "equal-share-source").experience;

const withParts = (item, labels) => ({ ...item, parts: labels.map((label, k) => ({ id: String.fromCharCode(97 + k), label, answerRef: `${item.answerRef}/parts/${k}` })) });
const build = (lessonNo, lessonId, specs) => specs.map((spec, k) => {
  let item = { id: `book06-full-${spec.no.slice(4).toLowerCase()}`, sourceNo: spec.no, lessonId, typeLabel: spec.type, sourceLocator: spec.loc, printGroup: spec.group,
    answerMode: "input", inputMode: "numeric", prompt: spec.prompt, answerRef: `/books/book-06/lessons/${lessonNo}/original/items/${k}` };
  if (spec.visual) item.visual = spec.visual; else item.noVisual = true;
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  if (spec.parts) { item = withParts(item, spec.parts); delete item.answerMode; delete item.inputMode; }
  return item;
});
const experience = (lessonNo, family, title, beats, hint, check) => ({
  ...JSON.parse(JSON.stringify(template)), family, title, beats, hint, check: { ...check, answerRef: `/books/book-06/lessons/${lessonNo}/experience/check` }
});
const V = (subtype, v) => ({ kind: "book5", subtype, ...v });
const grid = (...rows) => V("source-grid-shape", { rows });

// ── 단원 15: 잘라 만든 정사각형과 모눈 도형의 둘레 (15쪽) ──
const L15No = book.lessons.length, L16No = L15No + 1;
const GRID = "모눈 한 칸의 한 변은 1cm입니다. 이 도형의 둘레는 몇 cm일까요?";
const CUT = "직사각형을 잘라 가장 큰 정사각형을 만들었을 때, 처음 직사각형과 나중에 만든 정사각형의 둘레의 차는 몇 cm일까요?";
const L15Specs = [
  { no: "GB6-S15-09-1", loc: "교사용 슬라이드 15 활동 09 직사각형을 잘라 정사각형 만들기", group: 1, type: "잘라 만든 정사각형의 둘레",
    prompt: "가로 15cm, 세로 8cm인 직사각형을 잘라 정사각형 ㉠, ㉡, ㉢과 직사각형 ㉣을 만들었습니다. ㉠, ㉡, ㉢, ㉣의 둘레를 각각 구하시오.",
    parts: ["㉠의 둘레", "㉡의 둘레", "㉢의 둘레", "㉣의 둘레"], discrepancy: "원본은 ㉣까지 모두 정사각형이라고 적었지만 ㉣은 정사각형이 아니어서 「㉣은 직사각형」으로 고쳤습니다.",
    visual: V("source-square-split", { top: "15cm", left: "8cm", unit: 16, squares: [[0, 0, 8, "㉠"], [8, 0, 7, "㉡"], [8, 7, 6, 1, "㉣"], [14, 7, 1, "㉢"]] }) },
  { no: "GB6-S15-10-1", loc: "교사용 슬라이드 15 활동 10 둘레의 차이 ①", group: 2, type: "둘레의 차이", prompt: `${CUT} (1)`,
    visual: V("source-cut-rect", { w: 13, h: 10, labels: { top: "13cm", left: "10cm" } }) },
  { no: "GB6-S15-10-2", loc: "교사용 슬라이드 15 활동 10 둘레의 차이 ②", group: 2, type: "둘레의 차이", prompt: `${CUT} (2)`,
    visual: V("source-cut-rect", { w: 14, h: 10, labels: { strip: "4cm" } }) },
  ...[["##", "##"], [".#", "##"]].map((rows, k) => ({ no: `GB6-S15-10-${k + 3}`, loc: `교사용 슬라이드 15 활동 10 ★ 모눈 도형 ${k + 1}`, group: 3, type: "모눈 도형의 둘레",
    prompt: `${GRID} (${k + 1})`, visual: grid(...rows), ...(k === 0 ? { discrepancy: "원본에는 모눈 한 칸의 길이가 적혀 있지 않아 1cm로 적었습니다." } : {}) })),
  ...[["###", "###", "###"], [".##", "###", "###"], [".##", ".##", "###"], ["..#", ".##", "###"], ["..#", "..#", "###"]].map((rows, k) => ({ no: `GB6-S15-10-${k + 5}`, loc: `교사용 슬라이드 15 ★ 꼭짓점에서 누른 모양 ${k + 1}`, group: 4,
    type: "꼭짓점에서 누른 모양의 둘레", prompt: `${GRID} (${k + 3})`, visual: grid(...rows) })),
  ...[["###", "###"], [".##", "###"], ["..#", "###"], [".#.", "###"], ["##.", ".##"]].map((rows, k) => ({ no: `GB6-S15-10-${k + 10}`, loc: `교사용 슬라이드 15 ★ 꼭짓점에서 누른 모양 ${k + 6}`, group: 5,
    type: "꼭짓점에서 누른 모양의 둘레", prompt: `${GRID} (${k + 8})`, visual: grid(...rows) }))
];
const L15 = {
  id: "cut-grid-perimeter-source", unit: "도형의 둘레", title: "잘라 만든 도형과 모눈 도형의 둘레", sourceLocator: "교사용 슬라이드 15 활동 09·10",
  sourceTypeIds: ["cut-grid-perimeter-source"], representativeConcept: "직사각형을 잘라 만든 정사각형의 한 변을 차례로 찾고, 꼭짓점에서 안쪽으로 누른 모양은 늘린 부분을 되돌리면 같은 직사각형이라 둘레가 같음을 앎",
  story: { title: "종이 잘라 정사각형 만들기", text: "긴 종이를 잘라 가장 큰 정사각형을 만들면 남은 조각이 생깁니다.", mission: "누른 모양의 둘레가 왜 같은지 생각해 보세요." },
  explanation: { headline: "꼭짓점에서 안쪽으로 누른 모양은 들어간 변을 밖으로 옮기면 처음 직사각형과 같아져 둘레가 같습니다.",
    steps: ["직사각형에서 가장 큰 정사각형의 한 변은 짧은 변의 길이입니다.", "남은 조각에서 또 가장 큰 정사각형을 찾습니다.", "꼭짓점에서 누른 모양은 안쪽 변을 바깥으로 밀어 처음 직사각형으로 되돌려 봅니다.", "되돌린 직사각형의 (가로 + 세로) × 2가 둘레입니다."] },
  experience: experience(L15No, "cut-grid-perimeter", "누른 모양의 둘레를 비교해요", [
    { id: "cut-grid-perimeter-step-1", action: "reveal", caption: "가로 4칸, 세로 3칸 직사각형의 둘레는 (4 + 3) × 2 = 14cm입니다.", visual: grid("####", "####", "####") },
    { id: "cut-grid-perimeter-step-2", action: "highlight", caption: "한 귀퉁이 칸을 떼어도 들어간 두 변을 밖으로 밀면 처음 모양과 같습니다.", visual: grid(".###", "####", "####") },
    { id: "cut-grid-perimeter-step-3", action: "verify", caption: "그래서 둘레는 그대로 14cm입니다.", visual: grid(".###", "####", "####") }
  ], "들어간 변을 밖으로 밀어 처음 직사각형으로 되돌려 봅니다.", { prompt: "가로 4칸, 세로 3칸 직사각형에서 귀퉁이 칸을 2개 떼어 계단 모양을 만들면 둘레는 몇 cm일까요? (한 칸 1cm)", options: ["12", "14", "16"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L15Specs.length, structureKey: "cut-grid-perimeter-source", prompt: "잘라 만든 도형과 모눈 도형의 둘레를 구하시오.", visual: grid("####", "####", "####"), items: build(L15No, "cut-grid-perimeter-source", L15Specs) },
  extension: { title: "추가 학습", structureKey: "cut-grid-perimeter-source", story: "직사각형을 잘라 가장 큰 정사각형을 만듭니다.", prompt: "가로 5cm, 세로 3cm인 직사각형을 잘라 가장 큰 정사각형을 만들면 두 도형의 둘레의 차는 몇 cm일까요?",
    visual: V("source-cut-rect", { w: 5, h: 3, labels: { top: "5cm", left: "3cm" } }), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-06/lessons/${L15No}/extension` }
};

// ── 단원 16: 직각으로 꺾인 도형의 둘레 (16쪽) ──
const ortho = (points, dims, extra = {}) => V("source-ortho", { shapes: [{ points }], dims, ...extra });
const BENT = "직각으로 꺾인 도형의 둘레는 몇 cm일까요?";
const L16Specs = [
  { no: "GB6-S16-01-1", loc: "교사용 슬라이드 16 ★ 직각으로 꺾인 직사각형 1", group: 1, type: "꺾인 도형의 둘레", prompt: `${BENT} (1)`,
    visual: ortho([[3, 0], [7, 0], [7, 4], [3, 4], [3, 5], [0, 5], [0, 2], [3, 2]], [{ a: [0, 0], b: [7, 0], text: "7cm" }, { a: [7, 0], b: [7, 5], text: "5cm" }]) },
  { no: "GB6-S16-01-2", loc: "교사용 슬라이드 16 ★ 직각으로 꺾인 직사각형 2", group: 1, type: "꺾인 도형의 둘레", prompt: `${BENT} (2)`,
    visual: ortho([[0, 0], [8, 0], [8, 2], [14, 2], [14, 10], [4, 10], [4, 4], [0, 4]], [{ a: [8, 0], b: [8, 2], text: "2cm" }, { a: [4, 4], b: [0, 4], text: "4cm" }, { a: [14, 2], b: [14, 10], text: "8cm" }, { a: [14, 10], b: [4, 10], text: "10cm" }]) },
  { no: "GB6-S16-01-3", loc: "교사용 슬라이드 16 ★ 직각으로 꺾인 직사각형 3", group: 1, type: "꺾인 도형의 둘레", prompt: `${BENT} (3)`,
    visual: ortho([[0, 0], [3, 0], [3, 1], [5, 1], [5, 4], [6, 4], [6, 6], [1, 6], [1, 3], [0, 3]], [{ a: [0, 0], b: [3, 0], text: "3cm" }, { a: [3, 1], b: [5, 1], text: "2cm" }, { a: [5, 4], b: [6, 4], text: "1cm" }, { a: [0, 3], b: [0, 0], text: "3cm" }, { a: [1, 6], b: [1, 3], text: "3cm" }]) },
  { no: "GB6-S16-01-4", loc: "교사용 슬라이드 16 ★ 안으로 들어간 도형 1", group: 2, type: "들어간 도형의 둘레", prompt: `${BENT} (4)`,
    visual: ortho([[0, 0], [7, 0], [7, 3], [11, 3], [11, 6], [7, 6], [7, 9], [11, 9], [11, 12], [0, 12]], [{ a: [0, 12], b: [0, 0], text: "12cm" }, { a: [11, 12], b: [0, 12], text: "11cm" }, { a: [11, 6], b: [7, 6], text: "4cm" }]) },
  { no: "GB6-S16-01-5", loc: "교사용 슬라이드 16 ★ 안으로 들어간 도형 2", group: 2, type: "들어간 도형의 둘레", prompt: `${BENT} (5)`,
    visual: ortho([[0, 0], [5, 0], [5, 6], [11, 6], [11, 0], [16, 0], [16, 10], [9, 10], [9, 14], [16, 14], [16, 17], [0, 17]],
      [{ a: [0, 0], b: [5, 0], text: "5cm" }, { a: [11, 0], b: [16, 0], text: "5cm" }, { a: [11, 6], b: [11, 0], text: "6cm" }, { a: [11, 6], b: [5, 6], text: "6cm" }, { a: [16, 10], b: [9, 10], text: "7cm" }, { a: [0, 17], b: [0, 0], text: "17cm" }]) },
  { no: "GB6-S16-02-1", loc: "교사용 슬라이드 16 정사각형 3개를 붙인 도형", group: 3, type: "붙인 정사각형의 둘레", prompt: "한 변이 5cm인 정사각형 3개를 붙인 이 도형의 둘레는 몇 cm일까요?",
    visual: ortho([[0, 5], [1.5, 5], [1.5, 0], [6.5, 0], [6.5, 5], [10, 5], [10, 10], [0, 10]], [{ a: [1.5, 0], b: [6.5, 0], text: "5cm" }], { lines: [[5, 5, 5, 10], [1.5, 5, 6.5, 5]] }) },
  { no: "GB6-S16-02-2", loc: "교사용 슬라이드 16 정삼각형과 정사각형을 붙인 도형", group: 3, type: "붙인 도형의 둘레", prompt: "정삼각형 1개와 정사각형 2개를 붙인 이 도형의 둘레는 몇 cm일까요?",
    visual: V("source-ortho", { shapes: [{ points: [[0, 6], [12, 6], [12, 12], [0, 12]], text: "" }, { points: [[1.3, 6], [8.3, 6], [4.8, -0.06]], shape: "triangle", text: "정삼각형" }],
      lines: [[6, 6, 6, 12]], dims: [{ a: [4.8, -0.06], b: [8.3, 6], text: "7cm" }, { a: [6, 12], b: [0, 12], text: "6cm" }] }) }
];
const L16 = {
  id: "bent-perimeter-source", unit: "도형의 둘레", title: "직각으로 꺾인 도형의 둘레", sourceLocator: "교사용 슬라이드 16 ★ 직각으로 꺾인 직사각형의 둘레",
  sourceTypeIds: ["bent-perimeter-source"], representativeConcept: "직각으로 꺾인 변을 밖으로 옮겨 큰 직사각형의 둘레로 바꾸고, 안으로 들어간 부분은 들어간 깊이를 두 번 더함",
  story: { title: "계단 모양 담장", text: "계단처럼 꺾인 담장도 변을 밖으로 밀면 네모 담장이 됩니다.", mission: "꺾인 변을 옮겨 큰 직사각형을 만들어 보세요." },
  explanation: { headline: "꺾인 변을 바깥으로 옮기면 큰 직사각형의 둘레와 같습니다. 안으로 쏙 들어간 곳은 들어간 길이만큼 두 번 더합니다.",
    steps: ["가로로 놓인 변을 모두 위로, 세로로 놓인 변을 모두 옆으로 옮겨 봅니다.", "옮긴 뒤 생기는 큰 직사각형의 가로와 세로를 찾습니다.", "(가로 + 세로) × 2를 계산합니다.", "옮겨도 채워지지 않는 들어간 부분은 그 깊이를 두 번 더합니다."] },
  experience: experience(L16No, "bent-perimeter", "꺾인 변을 옮겨요", [
    { id: "bent-perimeter-step-1", action: "reveal", caption: "가로 6cm, 세로 4cm 안에 계단처럼 꺾인 도형입니다.", visual: ortho([[0, 0], [2, 0], [2, 1], [4, 1], [4, 2], [6, 2], [6, 4], [0, 4]], [{ a: [0, 4], b: [0, 0], text: "4cm" }, { a: [6, 4], b: [0, 4], text: "6cm" }]) },
    { id: "bent-perimeter-step-2", action: "highlight", caption: "꺾인 가로 변을 위로, 세로 변을 옆으로 옮기면 가로 6cm, 세로 4cm 직사각형이 됩니다.", visual: ortho([[0, 0], [6, 0], [6, 4], [0, 4]], [{ a: [0, 4], b: [0, 0], text: "4cm" }, { a: [6, 4], b: [0, 4], text: "6cm" }]) },
    { id: "bent-perimeter-step-3", action: "verify", caption: "(6 + 4) × 2 = 20이므로 둘레는 20cm입니다.", visual: ortho([[0, 0], [2, 0], [2, 1], [4, 1], [4, 2], [6, 2], [6, 4], [0, 4]], [{ a: [0, 4], b: [0, 0], text: "4cm" }, { a: [6, 4], b: [0, 4], text: "6cm" }]) }
  ], "꺾인 변을 바깥으로 옮겨 봅니다.", { prompt: "가로 8cm, 세로 5cm 안에 계단처럼 꺾인 도형의 둘레는 몇 cm일까요?", options: ["13", "26", "40"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L16Specs.length, structureKey: "bent-perimeter-source", prompt: "직각으로 꺾인 도형의 둘레를 구하시오.", visual: ortho([[0, 0], [2, 0], [2, 1], [4, 1], [4, 2], [6, 2], [6, 4], [0, 4]], []), items: build(L16No, "bent-perimeter-source", L16Specs) },
  extension: { title: "추가 학습", structureKey: "bent-perimeter-source", story: "오른쪽 가운데가 안으로 들어간 도형입니다.", prompt: "세로 10cm, 가로 8cm인 직사각형의 오른쪽 가운데가 3cm 안으로 들어갔습니다. 이 도형의 둘레는 몇 cm일까요?",
    visual: ortho([[0, 0], [8, 0], [8, 3], [5, 3], [5, 7], [8, 7], [8, 10], [0, 10]], [{ a: [0, 10], b: [0, 0], text: "10cm" }, { a: [8, 10], b: [0, 10], text: "8cm" }, { a: [8, 7], b: [5, 7], text: "3cm" }]),
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-06/lessons/${L16No}/extension` }
};

book.lessons.push(L15, L16);
const cleared = new Set(["B06-15-01", "B06-16-01"]);
const before = book.sourceHold.length;
book.sourceHold = book.sourceHold.filter((hold) => !cleared.has(hold.sourceNo));
if (before - book.sourceHold.length !== 2) throw new Error(`hold count ${before - book.sourceHold.length}`);
const released = { 15: L15Specs.length, 16: L16Specs.length };
for (const entry of book.sourceCoverage) {
  const page = entry.pages[0];
  if (released[page] != null) Object.assign(entry, { status: "implemented", releasedCount: released[page], holdCount: 0 });
}

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book06 batch4 patched", { L15: L15.original.items.length, L16: L16.original.items.length, lessonNos: [L15No, L16No], holds: book.sourceHold.length, released });
