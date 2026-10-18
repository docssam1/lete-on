// 골든벨 6권 묶음 6: 교사용 슬라이드 22~25 「수의 개수·연속수의 합(짝수 개·홀수 개)·짝수와 홀수의 순서」.
// 단원 9는 22~24쪽 원본 문항으로 새로 짜고, 25쪽은 단원 18로 덧붙인다.
// 이 스크립트에는 정답이 없다. node patch-book06-batch6.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-06");
if (book.lessons.some((l) => l.id === "even-odd-order-source")) throw new Error("already patched");
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
const eq = (text, answerBlank = true) => V("source-blank-equation", { tokens: [...text.split(" ").map((t) => (t === "□" ? null : t)), ...(answerBlank ? ["=", null] : [])] });
const ruler = V("source-arc-line", { points: [1, 10], groups: [{ n: 9, arcs: "none" }], tickLabels: Object.fromEntries([2, 3, 4, 5, 6, 7, 8, 9].map((n) => [n - 1, String(n)])) });
const range = (a, b) => `${a} ~ ${b}`;

// ── 단원 9: 수의 개수와 연속수의 합 (22~24쪽) ──
const L9No = 9;
const COUNT = "처음 수와 끝 수를 모두 넣어 수의 개수를 구하시오.";
const EVEN = ["1 + 2 + 3 + 4 + 5 + 6", "1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10", "1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 + 11 + 12 + 13 + 14", "1 + 2 + 3 + … + 20", "1 + 2 + 3 + … + 60", "1 + 2 + 3 + … + 100",
  "2 + 3 + 4 + 5 + 6 + 7", "6 + 7 + 8 + 9 + 10 + 11 + 12 + 13", "7 + 8 + 9 + 10 + 11 + 12 + 13 + 14", "10 + 11 + 12 + 13 + 14 + 15 + 16 + 17 + 18 + 19", "5 + 6 + 7 + 8 + 9 + 10 + 11 + 12 + 13 + 14 + 15 + 16"];
const ODD = ["1 + 2 + 3 + 4 + 5", "1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9", "1 + 2 + 3 + … + □ + … + 11 + 12 + 13", "1 + 2 + 3 + … + □ + … + 15 + 16 + 17", "1 + 2 + 3 + … + □ + … + 37 + 38 + 39",
  "1 + 2 + 3 + … + □ + … + 57 + 58 + 59", "1 + 2 + 3 + … + □ + … + 77 + 78 + 79", "19 + 20 + 21", "38 + 39 + 40 + 41 + 42", "27 + 28 + 29 + 30 + 31 + 32 + 33", "6 + 7 + 8 + 9 + 10 + 11 + 12 + 13 + 14",
  "2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 + 11 + 12 + 13 + 14"];
const L9Specs = [
  { no: "GB6-S22-01-1", loc: "교사용 슬라이드 22 활동 01 수의 개수 ①", group: 1, type: "수의 개수", prompt: `${COUNT} (1)`, parts: [range(1, 10), range(2, 10), range(5, 10)], visual: ruler },
  { no: "GB6-S22-01-2", loc: "교사용 슬라이드 22 활동 01 수의 개수 ②", group: 1, type: "수의 개수", prompt: `${COUNT} (2)`, parts: [range(1, 30), range(10, 30)] },
  { no: "GB6-S22-01-3", loc: "교사용 슬라이드 22 활동 01 수의 개수 ③", group: 1, type: "수의 개수", prompt: `${COUNT} (3)`, parts: [range(1, 100), range(50, 100)] },
  ...[[[5, 15], [10, 69], [21, 78]], [[47, 96], [62, 81], [18, 73]], [[100, 199], [300, 400], [100, 999]]].map((rs, k) => ({ no: `GB6-S22-01-${k + 4}`, loc: `교사용 슬라이드 22 활동 01 수의 개수 ④ ${k + 1}`, group: 2,
    type: "수의 개수", prompt: `${COUNT} (4-${k + 1})`, parts: rs.map(([a, b]) => range(a, b)) })),
  ...EVEN.map((t, k) => ({ no: `GB6-S23-02-${k + 1}`, loc: `교사용 슬라이드 23 활동 02 연속수의 합(짝수 개) ${k + 1}`, group: 3 + Math.floor(k / 4), type: "연속수의 합(짝수 개)",
    prompt: `앞뒤로 짝지어 더하는 방법으로 계산하시오. (${k + 1})`, visual: eq(t) })),
  ...ODD.map((t, k) => ({ no: `GB6-S24-03-${k + 1}`, loc: `교사용 슬라이드 24 활동 03 연속수의 합(홀수 개) ${k + 1}`, group: 6 + Math.floor(k / 4), type: "연속수의 합(홀수 개)",
    prompt: t.includes("□") ? `가에는 한가운데 수를 쓰고, 가운데 수와 더한 수의 개수로 나를 계산하시오. (${k + 1})` : `가운데 수와 더한 수의 개수로 계산하시오. (${k + 1})`,
    visual: eq(t), ...(t.includes("□") ? { parts: ["가 (가운데 수)", "나 (합)"] } : {}) }))
];
const L9 = {
  id: "consecutive-source", unit: "연속수의 합", title: "수의 개수와 연속수의 합", sourceLocator: "교사용 슬라이드 22 활동 01 수의 개수, 슬라이드 23·24 활동 02·03 연속수의 합",
  sourceTypeIds: ["consecutive-source"], representativeConcept: "처음 수부터 끝 수까지의 개수는 (끝 - 처음 + 1)이고, 연속수의 합은 짝수 개면 (처음 + 끝) × 짝의 수, 홀수 개면 가운데 수 × 개수",
  story: { title: "줄 선 친구 세기", text: "5번부터 10번까지 줄 선 친구는 5명이 아니라 6명입니다.", mission: "처음과 끝을 모두 넣어 세어 보세요." },
  explanation: { headline: "개수는 (끝 - 처음 + 1)입니다. 연속수의 합은 짝지어 더하거나 가운데 수로 곱합니다.",
    steps: ["처음 수와 끝 수를 모두 세므로 끝 - 처음에 1을 더합니다.", "더하는 수가 짝수 개면 앞뒤로 짝지어 (처음 + 끝) × 짝의 수입니다.", "홀수 개면 한가운데 수가 평균이므로 가운데 수 × 개수입니다.", "1부터가 아니어도 같은 방법을 씁니다."] },
  experience: experience(L9No, "consecutive-sum", "연속수를 짝지어 더해요", [
    { id: "consecutive-sum-step-1", action: "reveal", caption: "1 + 2 + … + 8은 8개입니다. 1과 8, 2와 7처럼 앞뒤로 짝지으면 합이 모두 9입니다.", visual: eq("1 + 2 + 3 + 4 + 5 + 6 + 7 + 8", false) },
    { id: "consecutive-sum-step-2", action: "highlight", caption: "짝은 8 ÷ 2 = 4쌍입니다.", visual: eq("1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 = 9 × 4", false) },
    { id: "consecutive-sum-step-3", action: "verify", caption: "9 × 4 = 36입니다.", visual: eq("1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 = 9 × 4 = 36", false) }
  ], "처음과 끝을 짝지어 봅니다.", { prompt: "1 + 2 + 3 + … + 8은 얼마일까요?", options: ["32", "36", "45"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L9Specs.length, structureKey: "consecutive-source", prompt: "수의 개수와 연속수의 합을 구하시오.", visual: ruler, items: build(L9No, "consecutive-source", L9Specs) },
  extension: { title: "추가 학습", structureKey: "consecutive-source", story: "홀수 개를 더합니다.", prompt: "11 + 12 + 13 + 14 + 15는 얼마일까요?", visual: eq("11 + 12 + 13 + 14 + 15"),
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-06/lessons/${L9No}/extension` }
};

// ── 단원 18: 짝수와 홀수의 순서 (25쪽) ──
const L18No = book.lessons.length;
const row = V("source-sequence", { values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], more: true });
const ODD_FIX = "원본의 홀수 칸에 「20은 몇 번째?」가 있으나 20은 홀수가 아니어서, 교사용 표시(19, 20)에 맞추어 19로 고쳤습니다.";
const L18Specs = [
  ...[[6, 10, 20, 50, 100], [19, 24, 37, 45, 72]].map((ns, k) => ({ no: `GB6-S25-01-${k + 1}`, loc: `교사용 슬라이드 25 짝수 ${k + 1}열`, group: 1, type: "몇 번째 짝수",
    prompt: `2, 4, 6, …처럼 짝수를 차례로 늘어놓습니다. 다음 번째의 짝수를 구하시오. (${k + 1})`, parts: ns.map((n) => `${n}번째 짝수`), visual: row })),
  { no: "GB6-S25-01-3", loc: "교사용 슬라이드 25 짝수 3열", group: 1, type: "짝수의 순서", prompt: "다음 짝수는 몇 번째 짝수일까요? (3)", parts: [20, 42, 68, 76, 94].map((n) => `${n}`), visual: row },
  ...[[6, 8, 10, 20, 50], [23, 31, 38, 41, 56]].map((ns, k) => ({ no: `GB6-S25-02-${k + 1}`, loc: `교사용 슬라이드 25 홀수 ${k + 1}열`, group: 2, type: "몇 번째 홀수",
    prompt: `1, 3, 5, …처럼 홀수를 차례로 늘어놓습니다. 다음 번째의 홀수를 구하시오. (${k + 4})`, parts: ns.map((n) => `${n}번째 홀수`), visual: row })),
  { no: "GB6-S25-02-3", loc: "교사용 슬라이드 25 홀수 3열", group: 2, type: "홀수의 순서", prompt: "다음 홀수는 몇 번째 홀수일까요? (6)", parts: [19, 27, 33, 63, 87].map((n) => `${n}`), visual: row, discrepancy: ODD_FIX }
];
const L18 = {
  id: "even-odd-order-source", unit: "연속수의 합", title: "짝수와 홀수의 순서", sourceLocator: "교사용 슬라이드 25 짝수·홀수 몇 번째",
  sourceTypeIds: ["even-odd-order-source"], representativeConcept: "☆번째 짝수는 2 × ☆, ☆번째 홀수는 2 × ☆ - 1이고, 거꾸로 짝수 ÷ 2, (홀수 + 1) ÷ 2로 몇 번째인지 찾음",
  story: { title: "짝수 계단, 홀수 계단", text: "짝수는 2단 곱셈의 답이고, 홀수는 그 바로 앞의 수입니다.", mission: "몇 번째인지와 수 사이의 규칙을 찾아보세요." },
  explanation: { headline: "☆번째 짝수는 2 × ☆이고, ☆번째 홀수는 그보다 1 작은 수입니다.",
    steps: ["짝수 2, 4, 6, …은 2 × 1, 2 × 2, 2 × 3, …입니다.", "그래서 ☆번째 짝수는 2 × ☆입니다.", "홀수는 짝을 이루는 짝수보다 1 작으므로 ☆번째 홀수는 2 × ☆ - 1입니다.", "거꾸로 짝수는 ÷ 2, 홀수는 1을 더한 뒤 ÷ 2를 하면 몇 번째인지 나옵니다."] },
  experience: experience(L18No, "even-odd-order", "몇 번째인지 찾아요", [
    { id: "even-odd-order-step-1", action: "reveal", caption: "짝수 2, 4, 6, 8은 2 × 1, 2 × 2, 2 × 3, 2 × 4입니다.", visual: row },
    { id: "even-odd-order-step-2", action: "highlight", caption: "그래서 15번째 짝수는 2 × 15 = 30입니다.", visual: row },
    { id: "even-odd-order-step-3", action: "verify", caption: "15번째 홀수는 30보다 1 작은 29입니다.", visual: row }
  ], "짝수는 2단 곱셈의 답입니다.", { prompt: "15번째 짝수는 얼마일까요?", options: ["15", "30", "29"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L18Specs.length, structureKey: "even-odd-order-source", prompt: "몇 번째 짝수와 홀수를 구하시오.", visual: row, items: build(L18No, "even-odd-order-source", L18Specs) },
  extension: { title: "추가 학습", structureKey: "even-odd-order-source", story: "홀수를 차례로 늘어놓습니다.", prompt: "30번째 홀수는 얼마일까요?",
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-06/lessons/${L18No}/extension` }
};

book.lessons[L9No] = L9;
book.lessons.push(L18);
const released = { 22: 6, 23: 11, 24: 12, 25: 6 };
for (const entry of book.sourceCoverage) {
  const page = entry.pages[0];
  if (released[page] != null) Object.assign(entry, { status: "implemented", releasedCount: released[page], holdCount: 0 });
}
const count = (p) => [...L9Specs, ...L18Specs].filter((s) => s.no.startsWith(`GB6-S${p}`)).length;
for (const p of [22, 23, 24, 25]) if (count(p) !== released[p]) throw new Error(`page ${p} count ${count(p)}`);

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book06 batch6 patched", { L9: L9.original.items.length, L18: L18.original.items.length, lessonNos: [L9No, L18No], released });
