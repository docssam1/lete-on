// 골든벨 8권 묶음 4: 교사용 슬라이드 21~29 「활동 01 주고 받기와 합차 문제 · 활동 02 합차와 배수문제」.
// 단원 4(21쪽 연산 체크 14)·단원 5(22~23쪽 주고 받기 6)를 원본 문장대로 다시 짜고,
// 새 단원 10(24~25쪽 합차 7) · 11(26~27쪽 합과 배수·차와 배수 12) · 12(28~29쪽 응용 8)를 단원 5 뒤에 차례로 둔다.
// 이 스크립트에는 정답이 없다. node patch-book08-batch4.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-08");
if (book.lessons.some((l) => l.id === "sum-difference-source")) throw new Error("already patched");
const lesson = (id) => book.lessons.find((l) => l.id === id);
const numberOf = (l) => Number(l.extension.answerRef.match(/lessons\/(\d+)\//)[1]);
const L4 = lesson("picture-division"), L5 = lesson("equalize-transfer");
if (numberOf(L4) !== 4 || numberOf(L5) !== 5) throw new Error("unexpected lesson numbers");
for (const n of [10, 11, 12]) if (book.lessons.some((l) => numberOf(l) === n)) throw new Error(`lesson number ${n} taken`);

const withParts = (item, labels) => ({ ...item, parts: labels.map((label, k) => ({ id: String.fromCharCode(97 + k), label, answerRef: `${item.answerRef}/parts/${k}` })) });
const build = (lessonNo, lessonId, topic, specs) => specs.map((spec, k) => {
  let item = { id: `book08-src-${spec.no.slice(4).toLowerCase()}`, sourcePage: Number(spec.no.slice(5, 7)), sourceNo: spec.no, lessonId, topic,
    typeLabel: spec.type, sourceLocator: spec.loc, printGroup: spec.group, answerMode: "input", inputMode: "numeric", prompt: spec.prompt,
    answerRef: `/books/book-08/lessons/${lessonNo}/original/items/${k}` };
  if (spec.visual) item.visual = spec.visual; else item.noVisual = true;
  if (spec.parts) { item = withParts(item, spec.parts); delete item.answerMode; delete item.inputMode; }
  return item;
});
const V = (subtype, v) => ({ kind: "book5", subtype, ...v });
const NOTE = (lines) => V("source-note-box", { lines });
const SD = (rows, extra = {}) => V("source-sumdiff", { rows: rows.map(([label, n, ex]) => ({ label, n, ...(ex ? { extra: ex } : {}) })), ...extra });
const NAME = { "○": "circle", "△": "triangle" };
const eqs = (list) => V("source-shape-equations", { rows: list.map((e) => [...e.replaceAll(" ", "")].map((c) => NAME[c] ?? c)), ask: ["circle", "triangle"] });
const template = () => JSON.parse(JSON.stringify(L5.experience));
const A1 = "활동 01 주고 받기와 합차 문제", A2 = "활동 02 합차와 배수문제";
const loc = (page, act, sec, n) => `교사용 슬라이드 ${page} · ${act} ${sec} (${n})`;

// ── 단원 4: 연산 체크 (21쪽) ──
const DIV = [[28, 2], [36, 2], [42, 2], [58, 2], [64, 2], [72, 2], [106, 2], [116, 2], [36, 4], [42, 7], [28, 4], [48, 6], [56, 8], [96, 4]];
const L4Specs = DIV.map(([a, b], k) => ({ no: `GB8-S21-01-${k + 1}`, loc: loc(21, A1, "1. 연산 체크", k + 1), group: k < 8 ? 211 : 212, type: b === 2 ? "2로 나누기" : "곱셈구구로 나누기",
  prompt: `다음을 계산하시오. ${a} ÷ ${b}` }));
Object.assign(L4, { title: "연산 체크", sourceLocator: `교사용 슬라이드 21 · ${A1} 1. 연산 체크`,
  representativeConcept: "2로 나누기는 반으로 가르기이고, 다른 수로 나누기는 곱셈구구를 거꾸로 떠올림",
  story: { title: "연산 체크", text: "주고 받기와 합차 문제를 풀려면 반으로 나누는 계산이 자주 나와요.", mission: "2로 나누기는 십의 자리와 일의 자리를 나누어 반씩 생각해 보세요." },
  explanation: { headline: "2로 나누면 반이 됩니다. 십의 자리와 일의 자리를 나누어 반씩 구해 더해도 됩니다.",
    steps: ["28 ÷ 2는 20의 반 10과 8의 반 4를 더해 14입니다.", "36 ÷ 4처럼 다른 수로 나눌 때는 4단 곱셈구구에서 36을 찾습니다.", "답에 나누는 수를 곱해 처음 수가 되는지 확인합니다."] } });
L4.original = { ...L4.original, title: "골든벨", mode: "paged", sourceQuestionCount: L4Specs.length, prompt: "다음을 계산하시오.", items: build(4, L4.id, "연산 체크", L4Specs) };
delete L4.original.visual;

// ── 단원 5: 주고 받기 (22~23쪽) ──
const L5Specs = [
  ...[[10, 6], [22, 14], [35, 17]].map(([a, b], k) => ({ no: `GB8-S22-02-${k + 1}`, loc: loc(22, A1, "2. 주고 받기", k + 1), group: 221, type: "두 접시를 같게",
    prompt: "몇 개 주어야 같아지는지 구하시오.", visual: V("source-plates", { plates: [a, b] }) })),
  { no: "GB8-S23-02-4", loc: loc(23, A1, "2. 주고 받기", 4), group: 231, type: "세 사람의 차", prompt: "구슬을 A는 B보다 2개 더 가지고 있고, C는 B보다 10개 더 가지고 있다. C는 A보다 몇 개 더 가지고 있을까?" },
  { no: "GB8-S23-02-5", loc: loc(23, A1, "2. 주고 받기", 5), group: 231, type: "세 사람 중 두 사람을 같게", prompt: "구슬을 C는 A보다 4개 더 가지고 있고, B는 A보다 10개 더 가지고 있다. B가 C에게 몇 개를 주어야 B와 C가 같아질까?" },
  { no: "GB8-S23-02-6", loc: loc(23, A1, "2. 주고 받기", 6), group: 231, type: "세 사람 중 두 사람을 같게", prompt: "구슬을 A는 C보다 5개 더 가지고 있고, B는 A보다 7개 더 가지고 있다. B가 C에게 몇 개를 주어야 B와 C가 같아질까?" }
];
Object.assign(L5, { title: "주고 받기", sourceLocator: `교사용 슬라이드 22~23 · ${A1} 2. 주고 받기`,
  representativeConcept: "많은 쪽이 차의 반만큼 주면 같아짐(한 번 주면 차가 두 배로 줄어듦)",
  story: { ...L5.story, title: "주고 받기", text: "많은 쪽이 적은 쪽에게 구슬을 주면, 많은 쪽은 줄고 적은 쪽은 늘어요." } });
L5.original = { ...L5.original, title: "골든벨", mode: "paged", sourceQuestionCount: L5Specs.length, prompt: "몇 개 주어야 같아지는지 구하시오.", items: build(5, L5.id, "주고 받기", L5Specs) };
delete L5.original.visual;
L5.experience = { ...L5.experience, title: "차의 반만큼 주어요", visualProgression: null,
  beats: [
    { id: "equalize-transfer-step-1", action: "reveal", caption: "왼쪽 접시에 14개, 오른쪽 접시에 8개가 있어요.", visual: V("source-plates", { plates: [14, 8] }) },
    { id: "equalize-transfer-step-2", action: "highlight", caption: "차는 14 − 8 = 6이에요. 왼쪽이 1개를 주면 왼쪽은 1 줄고 오른쪽은 1 늘어서 차가 2 줄어요.", visual: NOTE(["14 − 8 = 6", "6을 반으로 → 3과 3"]) },
    { id: "equalize-transfer-step-3", action: "verify", caption: "3개를 주면 14 − 3 = 11, 8 + 3 = 11로 같아져요.", visual: NOTE(["14 − 3 = 11", "8 + 3 = 11"]) }
  ] };

// ── 새 단원 10: 합차 (24~25쪽) ──
const L10Specs = [
  { no: "GB8-S24-03-1", loc: loc(24, A1, "3. 합차", 1), group: 241, type: "합과 차를 그림으로", prompt: "A와 B의 합과 차를 보고 A와 B를 구하시오.", visual: SD([["A", 1], ["B", 1, "+ 7"]], { sum: 19 }), parts: ["A", "B"] },
  { no: "GB8-S24-03-2", loc: loc(24, A1, "3. 합차", 2), group: 241, type: "합과 차를 그림으로", prompt: "A와 B의 합과 차를 보고 A와 B를 구하시오.", visual: SD([["A", 1], ["B", 1, "+ 13"]], { sum: 31 }), parts: ["A", "B"] },
  { no: "GB8-S24-03-3", loc: loc(24, A1, "3. 합차", 3), group: 242, type: "합과 차의 식", prompt: "다음 식을 보고 ○와 △가 나타내는 수를 구하시오.", visual: eqs(["○+△=15", "○-△=3"]), parts: ["○", "△"] },
  { no: "GB8-S24-03-4", loc: loc(24, A1, "3. 합차", 4), group: 242, type: "합과 차의 식", prompt: "다음 식을 보고 ○와 △가 나타내는 수를 구하시오.", visual: eqs(["○+△=47", "○-△=19"]), parts: ["○", "△"] },
  { no: "GB8-S25-03-5", loc: loc(25, A1, "3. 합차", 5), group: 251, type: "합차 문장제", prompt: "A와 B가 가진 구슬의 합은 23개, A가 B보다 5개 더 가지고 있다면 A가 가진 개수는?" },
  { no: "GB8-S25-03-6", loc: loc(25, A1, "3. 합차", 6), group: 251, type: "주고 받아 같아지는 합차", prompt: "A와 B가 가진 구슬의 합은 28개, A가 B에게 3개 주면 A와 B의 개수가 같아진다면 A가 가진 개수는?" },
  { no: "GB8-S25-03-7", loc: loc(25, A1, "3. 합차", 7), group: 251, type: "주고 받아 같아지는 합차", prompt: "A와 B가 가진 구슬의 합은 32개, B가 A에게 7개를 주면 A와 B의 개수가 같아진다면 A가 가진 개수는?" }
];
const L10 = {
  id: "sum-difference-source", unit: "합차와 배수문제", title: "합차", sourceLocator: `교사용 슬라이드 24~25 · ${A1} 3. 합차`, sourceTypeIds: ["book08-sum-difference-source"],
  representativeConcept: "합에서 차를 빼면 작은 수의 두 배이므로 반으로 나누어 작은 수를 구하고, 차를 더해 큰 수를 구함",
  story: { title: "합차", text: "두 수의 합과 차를 알면 두 수를 찾을 수 있어요. 큰 수는 작은 수보다 차만큼 더 있어요.", mission: "합에서 차를 먼저 빼 보세요." },
  explanation: { headline: "합에서 차를 빼면 똑같은 두 묶음(작은 수 두 개)이 남습니다.",
    steps: ["합에서 차를 뺍니다.", "남은 수를 반으로 나누면 작은 수입니다.", "작은 수에 차를 더하면 큰 수입니다.", "「주면 같아진다」는 차가 준 수의 두 배라는 뜻입니다."] },
  experience: { ...template(), family: "sum-difference-b8", title: "합에서 차를 빼요",
    beats: [
      { id: "sum-difference-step-1", action: "reveal", caption: "A와 B의 합은 12이고, A는 B보다 4 더 많아요.", visual: SD([["A", 1, "+ 4"], ["B", 1]], { sum: 12 }) },
      { id: "sum-difference-step-2", action: "highlight", caption: "합에서 차 4를 빼면 동그라미 두 개만 남아요. 12 − 4 = 8, 8을 반으로 나누면 4예요.", visual: NOTE(["12 − 4 = 8", "8 ÷ 2 = 4"]) },
      { id: "sum-difference-step-3", action: "verify", caption: "B는 4, A는 4 + 4 = 8이에요. 8 + 4 = 12로 확인해요.", visual: NOTE(["B = 4, A = 8", "8 + 4 = 12"]) }
    ], hint: "합에서 차를 먼저 빼세요.",
    check: { prompt: "합이 10이고 차가 2인 두 수 중 큰 수는?", options: ["6", "4", "8"], answerRef: "/books/book-08/lessons/10/experience/check" } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L10Specs.length, structureKey: "sum-difference-source", prompt: "두 수의 합과 차로 두 수를 구하시오.", items: build(10, "sum-difference-source", "합차", L10Specs) },
  extension: { title: "추가 학습", structureKey: "sum-difference-source", story: "합과 차로 큰 수를 구합니다.", prompt: "A와 B가 가진 구슬의 합은 30개, A가 B보다 6개 더 가지고 있다면 A가 가진 개수는?",
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-08/lessons/10/extension" }
};
delete L10.experience.visualProgression;

// ── 새 단원 11: 합과 배수 · 차와 배수 (26~27쪽) ──
const PIC = "그림을 보고 A와 B를 구하시오. (동그라미 하나는 모두 같은 수를 나타냅니다.)";
const L11Specs = [
  ...[[1, 2, 27], [1, 4, 40], [5, 1, 48], [2, 5, 49]].map(([a, b, s], k) => ({ no: `GB8-S26-01-${k + 1}`, loc: loc(26, A2, "1. 합과 배수", k + 1), group: 261, type: "합과 배수를 그림으로",
    prompt: PIC, visual: SD([["A", a], ["B", b]], { sum: s }), parts: ["A", "B"] })),
  { no: "GB8-S26-01-5", loc: loc(26, A2, "1. 합과 배수", 5), group: 262, type: "합과 배수 문장제", prompt: "A와 B가 가진 구슬의 합은 30개, B가 A의 5배라면 A의 개수는?" },
  { no: "GB8-S26-01-6", loc: loc(26, A2, "1. 합과 배수", 6), group: 262, type: "합과 배수 문장제", prompt: "A와 B가 가진 구슬의 합은 72개, B가 A의 8배라면 A의 개수는?" },
  ...[[1, 3, { row: 1, from: 1, n: 2, value: 32, side: "above" }], [1, 4, { row: 1, from: 1, n: 3, value: 36, side: "above" }], [5, 1, { row: 0, from: 1, n: 4, value: 92, side: "below" }], [2, 5, { row: 1, from: 2, n: 3, value: 42, side: "above" }]].map(([a, b, diff], k) => ({
    no: `GB8-S27-02-${k + 1}`, loc: loc(27, A2, "2. 차와 배수", k + 1), group: 271, type: "차와 배수를 그림으로", prompt: PIC, visual: SD([["A", a], ["B", b]], { diff }), parts: ["A", "B"] })),
  { no: "GB8-S27-02-5", loc: loc(27, A2, "2. 차와 배수", 5), group: 272, type: "차와 배수 문장제", prompt: "A는 B보다 구슬을 18개 더 가지고 있는데, A는 B의 4배라면 A가 가진 개수는?" },
  { no: "GB8-S27-02-6", loc: loc(27, A2, "2. 차와 배수", 6), group: 272, type: "차와 배수 문장제", prompt: "큰 수가 작은 수보다 42 크고, 큰 수가 작은 수의 8배라면 큰 수는?" }
];
const L11 = {
  id: "sum-multiple-source", unit: "합차와 배수문제", title: "합과 배수 · 차와 배수", sourceLocator: `교사용 슬라이드 26~27 · ${A2} 1. 합과 배수 · 2. 차와 배수`, sourceTypeIds: ["book08-sum-multiple-source"],
  representativeConcept: "작은 수를 동그라미 하나로 그리면 몇 배인 수는 동그라미 여러 개. 합은 전체 동그라미 수로, 차는 더 많은 동그라미 수로 나눔",
  story: { title: "합과 배수", text: "B가 A의 3배라면 A를 동그라미 1개, B를 동그라미 3개로 그려요.", mission: "동그라미가 모두 몇 개인지(또는 몇 개 더 많은지) 세어 보세요." },
  explanation: { headline: "작은 수를 동그라미 하나로 그리고, 합이면 전체 동그라미 수로, 차면 더 많은 동그라미 수로 나눕니다.",
    steps: ["작은 수를 동그라미 1개로, 몇 배인 수를 그 배수만큼의 동그라미로 그립니다.", "합을 알면 전체 동그라미 수로 나누어 동그라미 하나를 구합니다.", "차를 알면 더 많은 동그라미 수로 나눕니다.", "동그라미 하나의 값에 동그라미 수를 곱해 두 수를 구합니다."] },
  experience: { ...template(), family: "sum-multiple-b8", title: "동그라미 하나를 구해요",
    beats: [
      { id: "sum-multiple-step-1", action: "reveal", caption: "B가 A의 3배이고 합이 20이에요. A는 동그라미 1개, B는 3개예요.", visual: SD([["A", 1], ["B", 3]], { sum: 20 }) },
      { id: "sum-multiple-step-2", action: "highlight", caption: "동그라미는 모두 4개예요. 20 ÷ 4 = 5이니 동그라미 하나는 5예요.", visual: NOTE(["1 + 3 = 4개", "20 ÷ 4 = 5"]) },
      { id: "sum-multiple-step-3", action: "verify", caption: "A = 5, B = 5 × 3 = 15예요. 5 + 15 = 20으로 확인해요.", visual: NOTE(["A = 5, B = 15", "5 + 15 = 20"]) }
    ], hint: "작은 수를 동그라미 하나로 그려 보세요.",
    check: { prompt: "A와 B의 합은 24이고 B가 A의 3배일 때 A는?", options: ["6", "8", "18"], answerRef: "/books/book-08/lessons/11/experience/check" } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L11Specs.length, structureKey: "sum-multiple-source", prompt: "합(또는 차)과 몇 배 관계로 두 수를 구하시오.", items: build(11, "sum-multiple-source", "합과 배수", L11Specs) },
  extension: { title: "추가 학습", structureKey: "sum-multiple-source", story: "합과 몇 배 관계로 작은 수를 구합니다.", prompt: "A와 B가 가진 구슬의 합은 35개, B가 A의 4배라면 A의 개수는?",
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-08/lessons/11/extension" }
};
delete L11.experience.visualProgression;

// ── 새 단원 12: 응용 (28~29쪽) ──
const L12Specs = [
  ...[[3, "+ 5", 33], [4, "+ 7", 52], [3, "- 3", 29], [5, "- 5", 37]].map(([b, ex, s], k) => ({ no: `GB8-S28-03-${k + 1}`, loc: loc(28, A2, "3. 응용", k + 1), group: 281, type: "몇 배보다 많거나 적은 수를 그림으로",
    prompt: PIC, visual: SD([["A", 1], ["B", b, ex]], { sum: s }), parts: ["A", "B"] })),
  { no: "GB8-S29-03-5", loc: loc(29, A2, "3. 응용", 5), group: 291, type: "몇 배보다 많은 수 문장제", prompt: "A와 B의 구슬의 합은 40개, A는 B의 5배보다 4개 더 많다면 A의 개수는?" },
  { no: "GB8-S29-03-6", loc: loc(29, A2, "3. 응용", 6), group: 291, type: "몇 배보다 많은 수 문장제", prompt: "아빠와 아들의 나이의 합은 41살, 아빠가 아들 나이의 4배보다 1살 더 많다면 아빠의 나이는?" },
  { no: "GB8-S29-03-7", loc: loc(29, A2, "3. 응용", 7), group: 291, type: "몇 배보다 적은 수 문장제", prompt: "엄마와 딸의 나이의 합은 38살, 엄마가 딸의 나이의 5배보다 4살 적다면 엄마의 나이는?" },
  { no: "GB8-S29-03-8", loc: loc(29, A2, "3. 응용", 8), group: 291, type: "몇 배보다 적은 수 문장제", prompt: "A와 B가 가진 카드의 수의 합은 60장, A가 B의 6배보다 3장 적다면 A가 가진 개수는?" }
];
const L12 = {
  id: "sum-multiple-applied-source", unit: "합차와 배수문제", title: "합차와 배수 응용", sourceLocator: `교사용 슬라이드 28~29 · ${A2} 3. 응용`, sourceTypeIds: ["book08-sum-multiple-applied-source"],
  representativeConcept: "몇 배보다 많으면 그만큼 합에서 빼고, 적으면 그만큼 합에 더한 뒤 전체 동그라미 수로 나눔",
  story: { title: "합차와 배수 응용", text: "「3배보다 5 많다」는 동그라미 3개에 5를 더 붙여 그려요.", mission: "덧붙은 수를 먼저 합에서 빼거나 더해 보세요." },
  explanation: { headline: "덧붙은 수를 합에서 먼저 정리하면 동그라미만 남습니다.",
    steps: ["몇 배보다 많으면 그 수를 합에서 뺍니다.", "몇 배보다 적으면 그 수를 합에 더합니다.", "전체 동그라미 수로 나누어 동그라미 하나를 구합니다.", "묻는 사람의 수를 다시 계산하고 합이 맞는지 확인합니다."] },
  experience: { ...template(), family: "sum-multiple-applied-b8", title: "덧붙은 수부터 정리해요",
    beats: [
      { id: "sum-multiple-applied-step-1", action: "reveal", caption: "B는 A의 2배보다 3 많고, 합은 18이에요.", visual: SD([["A", 1], ["B", 2, "+ 3"]], { sum: 18 }) },
      { id: "sum-multiple-applied-step-2", action: "highlight", caption: "덧붙은 3을 합에서 빼면 동그라미 3개가 15예요. 15 ÷ 3 = 5예요.", visual: NOTE(["18 − 3 = 15", "15 ÷ 3 = 5"]) },
      { id: "sum-multiple-applied-step-3", action: "verify", caption: "A = 5, B = 5 × 2 + 3 = 13이에요. 5 + 13 = 18로 확인해요.", visual: NOTE(["A = 5, B = 13", "5 + 13 = 18"]) }
    ], hint: "덧붙은 수를 합에서 먼저 정리하세요.",
    check: { prompt: "합이 22이고 B가 A의 3배보다 2 많을 때 A는?", options: ["5", "6", "4"], answerRef: "/books/book-08/lessons/12/experience/check" } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L12Specs.length, structureKey: "sum-multiple-applied-source", prompt: "몇 배보다 많거나 적은 관계로 두 수를 구하시오.", items: build(12, "sum-multiple-applied-source", "합차와 배수 응용", L12Specs) },
  extension: { title: "추가 학습", structureKey: "sum-multiple-applied-source", story: "몇 배보다 많은 관계입니다.", prompt: "A와 B의 구슬의 합은 29개, A는 B의 3배보다 1개 더 많다면 A의 개수는?",
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-08/lessons/12/extension" }
};
delete L12.experience.visualProgression;
book.lessons.splice(book.lessons.indexOf(L5) + 1, 0, L10, L11, L12);
book.lessonIntegration.newLessonIds = [...new Set([...book.lessonIntegration.newLessonIds, L10.id, L11.id, L12.id])];

// ── 장부 ──
const pageOf = (item) => item.sourcePage ?? Number(String(item.sourceNo).match(/^S(\d+)/)[1]);
const units = (item) => item.parts?.length || 1;
const holdPages = (h) => { const m = String(h.sourceNo).match(/^S(\d+)(?:-S(\d+))?/); const a = Number(m[1]), b = Number(m[2] || m[1]); return Array.from({ length: b - a + 1 }, (_, k) => a + k); };
book.sourceHold = book.sourceHold.filter((h) => h.sourceNo !== "S23-S29");
const items = book.lessons.flatMap((l) => l.original.items);
for (const e of book.sourceCoverage.pageLedger) {
  const list = items.filter((it) => pageOf(it) === e.page), holds = book.sourceHold.filter((h) => holdPages(h).includes(e.page));
  Object.assign(e, { releasedItems: list.length, releasedAnswerUnits: list.reduce((n, it) => n + units(it), 0), heldRecords: holds.length,
    heldAnswerUnits: holds.filter((h) => h.sourcePage === e.page).reduce((n, h) => n + h.sourceHold.itemCount, 0) });
}
const L = book.sourceCoverage.pageLedger;
Object.assign(book.sourceCoverage, { sourceLessons: book.lessons.length, publicItems: L.reduce((n, e) => n + e.releasedItems, 0), publicAnswerUnits: L.reduce((n, e) => n + e.releasedAnswerUnits, 0),
  holdItems: book.sourceHold.length, heldAnswerUnits: L.reduce((n, e) => n + e.heldAnswerUnits, 0) });
book.sourceCoverage.totalAnswerUnits = book.sourceCoverage.publicAnswerUnits + book.sourceCoverage.heldAnswerUnits;
if (items.length !== book.sourceCoverage.publicItems) throw new Error("ledger misses items");

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
const { pageLedger: _l, ...coverage } = book.sourceCoverage;
console.log("book08 batch4 patched", { L4: L4Specs.length, L5: L5Specs.length, L10: L10Specs.length, L11: L11Specs.length, L12: L12Specs.length, holds: book.sourceHold.map((h) => h.sourceNo), coverage });
