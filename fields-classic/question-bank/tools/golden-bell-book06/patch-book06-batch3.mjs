// 골든벨 6권 묶음 3: 교사용 슬라이드 12~14 「여러 가지 사각형의 둘레·직사각형과 마름모를 붙였을 때 둘레·피보나치 사각형」.
// 단원 7(둘레)은 12·13쪽 원본 문항으로 새로 짜고, 14쪽은 단원 14로 덧붙인다.
// 이 스크립트에는 정답이 없다(고르기형 보기는 공개, 정답은 비공개 DB에만). node patch-book06-batch3.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-06");
if (book.lessons.some((l) => l.id === "joined-perimeter-source")) throw new Error("already patched");
const template = book.lessons.find((l) => l.id === "equal-share-source").experience;

const withParts = (item, labels) => ({ ...item, parts: labels.map((label, k) => ({ id: String.fromCharCode(97 + k), label, answerRef: `${item.answerRef}/parts/${k}` })) });
const build = (lessonNo, lessonId, specs) => specs.map((spec, k) => {
  let item = { id: `book06-full-${spec.no.slice(4).toLowerCase()}`, sourceNo: spec.no, lessonId, typeLabel: spec.type, sourceLocator: spec.loc, printGroup: spec.group,
    answerMode: spec.options ? "choice" : "input", ...(spec.options ? { options: spec.options } : { inputMode: "numeric" }), prompt: spec.prompt, answerRef: `/books/book-06/lessons/${lessonNo}/original/items/${k}` };
  if (spec.visual) item.visual = spec.visual; else item.noVisual = true;
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  if (spec.parts) { item = withParts(item, spec.parts); delete item.answerMode; delete item.inputMode; }
  return item;
});
const experience = (lessonNo, family, title, beats, hint, check) => ({
  ...JSON.parse(JSON.stringify(template)), family, title, beats, hint, check: { ...check, answerRef: `/books/book-06/lessons/${lessonNo}/experience/check` }
});
const V = (subtype, v) => ({ kind: "book5", subtype, ...v });
const quad = (shape, v) => V("source-quad", { shape, ...v });

// ── 단원 7: 사각형의 둘레 (12·13쪽) ──
const L7No = 7;
const gallery = V("source-quad-gallery", { items: [["가", "trapezoid"], ["나", "para"], ["다", "rhombus"], ["라", "rect"], ["마", "square"]] });
const EXPLAIN = "원본은 사각형을 알려 주는 설명이라 화면에서는 고르기 물음으로 바꿨습니다.";
const PICK = "원본은 교사가 수를 정해 주는 빈칸이라, 원본 곱셈표에 있는 수로 물음을 만들었습니다.";
const L7Specs = [
  { no: "GB6-S12-00-1", loc: "교사용 슬라이드 12 여러 가지 사각형 알아보기", group: 1, type: "사각형 알아보기", visual: gallery, discrepancy: EXPLAIN,
    prompt: "한 쌍의 마주 보는 변만 평행한 사각형은 어느 것일까요?", options: ["나 평행사변형", "가 사다리꼴", "라 직사각형"] },
  { no: "GB6-S12-00-2", loc: "교사용 슬라이드 12 여러 가지 사각형 알아보기", group: 1, type: "사각형 알아보기", visual: gallery,
    prompt: "네 각의 크기가 모두 같은 사각형을 무엇이라고 할까요?", options: ["마름모", "사다리꼴", "직사각형"] },
  { no: "GB6-S12-00-3", loc: "교사용 슬라이드 12 여러 가지 사각형 알아보기", group: 1, type: "사각형 알아보기", visual: gallery,
    prompt: "네 각의 크기와 네 변의 길이가 모두 같은 사각형은 어느 것일까요?", options: ["정사각형", "마름모", "평행사변형"] },
  ...[[9, 5, 3, 2], [8, 15, 1, 2], [24, 18, 4, 3], [25, 9, 3, 1]].map(([t, r, w, h], k) => ({ no: `GB6-S12-01-${k + 1}`, loc: `교사용 슬라이드 12 활동 01 직사각형의 둘레 ${k + 1}`, group: 2, type: "직사각형의 둘레",
    prompt: `직사각형의 둘레는 몇 cm일까요? (${k + 1})`, visual: quad("rect", { w, h, top: String(t), right: String(r) }) })),
  ...[[{ side: "9", top: "가" }, 36, 3, 2], [{ top: "32", side: "가" }, 100, 3, 2], [{ top: "18", side: "가" }, 144, 1, 3], [{ side: "30", top: "가" }, 150, 3, 2]].map(([labels, p, w, h], k) => ({
    no: `GB6-S13-02-${k + 1}`, loc: `교사용 슬라이드 13 활동 02 직사각형의 한 변의 길이 ${k + 1}`, group: 3, type: "직사각형의 한 변",
    prompt: `직사각형의 둘레를 보고 가에 알맞은 수를 구하시오. (${k + 1})`, visual: quad("rect", { w, h, ...labels, inner: `둘레 ${p}cm` }) })),
  ...[[{ top: "8", side: "6" }], [{ top: "14", right: "18" }], [{ top: "35", right: "16" }], [{ top: "42", right: "35" }]].map(([labels], k) => ({
    no: `GB6-S13-03-${k + 1}`, loc: `교사용 슬라이드 13 활동 03 평행사변형의 둘레 ${k + 1}`, group: 4, type: "평행사변형의 둘레",
    prompt: `평행사변형은 마주 보는 변의 길이가 같습니다. 평행사변형의 둘레는 몇 cm일까요? (${k + 1})`, visual: quad("para", { w: 3, h: 2, ...labels }) })),
  ...[[{ top: "11", side: "가" }, 36], [{ top: "가", side: "15" }, 56], [{ top: "36", side: "가" }, 114], [{ top: "45", right: "가" }, 146]].map(([labels, p], k) => ({
    no: `GB6-S13-04-${k + 1}`, loc: `교사용 슬라이드 13 활동 04 평행사변형의 한 변의 길이 ${k + 1}`, group: 5, type: "평행사변형의 한 변",
    prompt: `평행사변형의 둘레를 보고 가에 알맞은 수를 구하시오. (${k + 1})`, visual: quad("para", { w: 3, h: 2, ...labels, inner: `둘레 ${p}cm` }) })),
  { no: "GB6-S13-05-1", loc: "교사용 슬라이드 13 활동 05 정사각형의 둘레", group: 6, type: "정사각형의 둘레", discrepancy: PICK,
    prompt: "정사각형은 네 변의 길이가 모두 같습니다. 한 변이 13cm인 정사각형의 둘레(가)는 몇 cm일까요?", visual: quad("square", { right: "13", inner: "둘레 가" }) },
  { no: "GB6-S13-05-2", loc: "교사용 슬라이드 13 활동 05 정사각형의 둘레", group: 6, type: "정사각형의 한 변",
    prompt: "둘레가 96cm인 정사각형의 한 변(가)은 몇 cm일까요?", visual: quad("square", { right: "가", inner: "둘레 96cm" }) },
  { no: "GB6-S13-06-1", loc: "교사용 슬라이드 13 활동 06 마름모의 둘레", group: 6, type: "마름모의 둘레",
    prompt: "마름모는 네 변의 길이가 모두 같습니다. 한 변이 17cm인 마름모의 둘레(가)는 몇 cm일까요?", visual: quad("rhombus", { w: 3, h: 2, top: "17", inner: "둘레 가" }) },
  { no: "GB6-S13-06-2", loc: "교사용 슬라이드 13 활동 06 마름모의 둘레", group: 6, type: "마름모의 한 변",
    prompt: "둘레가 132cm인 마름모의 한 변(가)은 몇 cm일까요?", visual: quad("rhombus", { w: 3, h: 2, top: "가", inner: "둘레 132cm" }) }
];
const L7 = {
  id: "perimeter-source", unit: "도형의 둘레", title: "사각형의 둘레", sourceLocator: "교사용 슬라이드 12 활동 01, 슬라이드 13 활동 02~06",
  sourceTypeIds: ["perimeter-source"], representativeConcept: "직사각형·평행사변형은 (가로 + 세로) × 2, 정사각형·마름모는 한 변 × 4로 둘레를 구하고, 둘레에서 거꾸로 한 변을 찾음",
  story: { title: "꽃밭에 울타리 치기", text: "꽃밭 테두리를 한 바퀴 두르는 데 필요한 울타리의 길이가 둘레입니다.", mission: "길이가 같은 변을 찾아 둘레를 빠르게 구해 보세요." },
  explanation: { headline: "둘레는 도형을 둘러싸고 있는 테두리의 길이입니다.",
    steps: ["사각형 모양을 보고 길이가 같은 변을 찾습니다.", "직사각형·평행사변형은 (가로 + 세로) × 2입니다.", "정사각형·마름모는 한 변 × 4입니다.", "한 변을 모르면 둘레를 2(또는 4)로 나눈 뒤 아는 변을 뺍니다."] },
  experience: experience(L7No, "quad-perimeter", "사각형의 둘레를 구해요", [
    { id: "quad-perimeter-step-1", action: "reveal", caption: "직사각형은 마주 보는 변의 길이가 같습니다. 가로 6cm, 세로 4cm입니다.", visual: quad("rect", { w: 3, h: 2, top: "6", right: "4" }) },
    { id: "quad-perimeter-step-2", action: "highlight", caption: "가로 하나와 세로 하나를 더하면 6 + 4 = 10cm, 그것이 두 번 있습니다.", visual: quad("rect", { w: 3, h: 2, top: "6", right: "4" }) },
    { id: "quad-perimeter-step-3", action: "verify", caption: "(6 + 4) × 2 = 20이므로 둘레는 20cm입니다.", visual: quad("rect", { w: 3, h: 2, top: "6", right: "4", inner: "둘레 20cm" }) }
  ], "길이가 같은 변이 몇 개인지 먼저 봅니다.", { prompt: "가로 7cm, 세로 3cm인 직사각형의 둘레는 몇 cm일까요?", options: ["10", "20", "21"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L7Specs.length, structureKey: "perimeter-source", prompt: "사각형의 둘레와 한 변의 길이를 구하시오.", visual: quad("rect", { w: 3, h: 2, top: "6", right: "4" }), items: build(L7No, "perimeter-source", L7Specs) },
  extension: { title: "추가 학습", structureKey: "perimeter-source", story: "직사각형의 둘레가 70cm입니다.", prompt: "둘레가 70cm이고 가로가 20cm인 직사각형의 세로는 몇 cm일까요?",
    visual: quad("rect", { w: 3, h: 2, top: "20", right: "가", inner: "둘레 70cm" }), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-06/lessons/${L7No}/extension` }
};

// ── 단원 14: 붙인 도형의 둘레 (14쪽) ──
const L14No = book.lessons.length;
const joined = (parts, ends = {}) => V("source-joined", { parts, ...ends });
const JOIN = "직사각형과 마름모를 붙였습니다. 빈칸 가, 나, 다에 알맞은 수를 구하시오.";
const L14Specs = [
  { no: "GB6-S14-07-1", loc: "교사용 슬라이드 14 활동 07 직사각형과 마름모 1", group: 1, type: "붙인 도형의 변", prompt: `${JOIN} (1)`, parts: ["가", "나", "다"],
    visual: joined([{ shape: "rect", w: 1.6, top: "나", inner: "직사각형", innerNote: "둘레 40cm" }, { shape: "rhombus", slant: "다", inner: "마름모", innerNote: "둘레 32cm" }], { left: "가" }) },
  { no: "GB6-S14-07-2", loc: "교사용 슬라이드 14 활동 07 직사각형과 마름모 2", group: 1, type: "붙인 도형의 변", prompt: `${JOIN} (2)`, parts: ["가", "나", "다"],
    visual: joined([{ shape: "rhombus", slant: "가", inner: "마름모", innerNote: "둘레 60cm" }, { shape: "rect", w: 1.6, top: "나", inner: "직사각형", innerNote: "둘레 100cm" }], { right: "다" }) },
  { no: "GB6-S14-07-3", loc: "교사용 슬라이드 14 활동 07 직사각형과 마름모 3", group: 1, type: "붙인 도형의 변", prompt: `${JOIN} 다는 마름모의 둘레입니다. (3)`, parts: ["가", "나", "다"],
    visual: joined([{ shape: "rhombus", slant: "가", inner: "마름모 둘레", innerNote: "다" }, { shape: "rect", w: 1.6, top: "나", inner: "직사각형", innerNote: "둘레 72cm" }], { right: "16" }) },
  { no: "GB6-S14-07-4", loc: "교사용 슬라이드 14 활동 07 ①", group: 2, type: "붙인 도형의 둘레로 변 찾기", prompt: "정사각형과 직사각형을 붙인 도형의 둘레가 32cm일 때 A는 몇 cm일까요?",
    visual: joined([{ shape: "square", top: "3", inner: "정사각형" }, { shape: "rect", w: 1.6, top: "A cm", inner: "직사각형" }]) },
  { no: "GB6-S14-07-5", loc: "교사용 슬라이드 14 활동 07 ②", group: 2, type: "붙인 도형의 둘레로 변 찾기", prompt: "직사각형, 마름모, 정사각형을 붙인 도형의 둘레가 54cm라면 A는 몇 cm일까요?",
    visual: joined([{ shape: "rect", w: 1.8, top: "A cm", inner: "직사각형" }, { shape: "rhombus", inner: "마름모" }, { shape: "square", inner: "정사각형" }], { left: "5" }) },
  { no: "GB6-S14-07-6", loc: "교사용 슬라이드 14 활동 07 ③", group: 2, type: "붙인 도형의 둘레", prompt: "평행사변형, 마름모, 직사각형을 붙였습니다. 이 도형의 둘레는 몇 cm일까요?",
    visual: joined([{ shape: "para", w: 1.4, inner: "평행사변형", innerNote: "둘레 40cm" }, { shape: "rhombus", inner: "마름모" }, { shape: "rect", w: 1.5, inner: "직사각형", innerNote: "둘레 64cm" }]) },
  { no: "GB6-S14-08-1", loc: "교사용 슬라이드 14 활동 08 피보나치 사각형", group: 3, type: "정사각형으로 나누기",
    prompt: "그림에서 한 칸짜리 사각형은 모두 정사각형입니다. 가장 작은 정사각형 한 변의 길이가 1일 때 A, B, C, D의 한 변의 길이를 구하시오.", parts: ["A", "B", "C", "D"],
    visual: V("source-square-split", { squares: [[0, 0, 1, "1"], [1, 0, 1, ""], [0, 1, 2, "A"], [2, 0, 3, "B"], [0, 3, 5, "C"], [5, 0, 4, "D"], [5, 4, 4, ""]] }) }
];
const L14 = {
  id: "joined-perimeter-source", unit: "도형의 둘레", title: "붙인 도형의 둘레", sourceLocator: "교사용 슬라이드 14 활동 07 직사각형과 마름모를 붙였을 때 둘레, 활동 08 피보나치 사각형",
  sourceTypeIds: ["joined-perimeter-source"], representativeConcept: "도형을 붙이면 맞닿은 변이 같은 길이이고 바깥 둘레에서 빠짐을 이용해 모르는 변과 전체 둘레를 구함",
  story: { title: "블록 이어 붙이기", text: "블록을 맞대어 붙이면 맞닿은 변은 바깥에서 보이지 않습니다.", mission: "맞닿은 변이 같은 길이라는 것을 이용해 보세요." },
  explanation: { headline: "붙인 두 도형의 맞닿은 변은 길이가 같고, 바깥 둘레에는 들어가지 않습니다.",
    steps: ["맞닿은 변을 찾습니다. 두 도형에서 그 변의 길이가 같습니다.", "마름모·정사각형은 한 변을 알면 네 변을 모두 압니다.", "직사각형은 둘레의 절반에서 아는 변을 빼면 다른 변입니다.", "전체 둘레는 각 도형의 둘레를 더하고 맞닿은 변을 두 번씩 뺍니다."] },
  experience: experience(L14No, "joined-perimeter", "붙인 도형의 둘레를 구해요", [
    { id: "joined-perimeter-step-1", action: "reveal", caption: "한 변이 4cm인 정사각형 두 개를 붙였습니다.", visual: joined([{ shape: "square", top: "4" }, { shape: "square", top: "4" }]) },
    { id: "joined-perimeter-step-2", action: "highlight", caption: "맞닿은 변은 바깥에서 보이지 않으므로, 바깥에는 4cm 변이 6개 있습니다.", visual: joined([{ shape: "square", top: "4" }, { shape: "square", top: "4" }], { left: "4", right: "4" }) },
    { id: "joined-perimeter-step-3", action: "verify", caption: "4 × 6 = 24이므로 둘레는 24cm입니다.", visual: joined([{ shape: "square", top: "4" }, { shape: "square", top: "4" }], { left: "4", right: "4" }) }
  ], "맞닿은 변은 바깥 둘레에 들어가지 않습니다.", { prompt: "한 변이 5cm인 정사각형 두 개를 붙인 직사각형의 둘레는 몇 cm일까요?", options: ["40", "30", "20"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L14Specs.length, structureKey: "joined-perimeter-source", prompt: "붙인 도형의 변과 둘레를 구하시오.", visual: joined([{ shape: "square", top: "4" }, { shape: "square", top: "4" }]), items: build(L14No, "joined-perimeter-source", L14Specs) },
  extension: { title: "추가 학습", structureKey: "joined-perimeter-source", story: "정사각형 3개를 한 줄로 붙였습니다.", prompt: "한 변이 6cm인 정사각형 3개를 한 줄로 붙인 도형의 둘레는 몇 cm일까요?",
    visual: joined([{ shape: "square", top: "6" }, { shape: "square" }, { shape: "square" }]), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-06/lessons/${L14No}/extension` }
};

book.lessons[L7No] = L7;
book.lessons.push(L14);
const cleared = new Set(["B06-13-04", "B06-14-01"]);
const before = book.sourceHold.length;
book.sourceHold = book.sourceHold.filter((hold) => !cleared.has(hold.sourceNo));
if (before - book.sourceHold.length !== 2) throw new Error(`hold count ${before - book.sourceHold.length}`);
const released = { 12: 7, 13: 16, 14: 7 };
for (const entry of book.sourceCoverage) {
  const page = entry.pages[0];
  if (released[page] != null) Object.assign(entry, { status: "implemented", releasedCount: released[page], holdCount: 0 });
}
const count = (p) => [...L7Specs, ...L14Specs].filter((s) => s.no.startsWith(`GB6-S${p}`)).length;
for (const p of [12, 13, 14]) if (count(p) !== released[p]) throw new Error(`page ${p} count ${count(p)}`);

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book06 batch3 patched", { L7: L7.original.items.length, L14: L14.original.items.length, lessonNos: [L7No, L14No], holds: book.sourceHold.length, released });
