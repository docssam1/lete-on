// 골든벨 7권 묶음 4: 교사용 슬라이드 45~50 「활동 02 가로수 심기(닫힌 도형)」 — 1. 바둑돌 · 2. 닫힌 도형의 둘레 · 3. 호수.
// 한 활동이므로 단원 2 자리에 원본 21문항으로 다시 짠다. 옛 그림(polygon-points·perimeter-loop)은 나무·가로등 수(답)를 그리고 있었다.
// 이 스크립트에는 정답이 없다. node patch-book07-batch4.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-07");
const L2No = book.lessons.findIndex((l) => l.id === "closed-loop-planting"), L2 = book.lessons[L2No];
if (L2.original.items.some((i) => i.sourceNo.startsWith("GB7-"))) throw new Error("already patched");

const withParts = (item, labels) => ({ ...item, parts: labels.map((label, k) => ({ id: String.fromCharCode(97 + k), label, answerRef: `${item.answerRef}/parts/${k}` })) });
const build = (lessonNo, lessonId, topic, specs) => specs.map((spec, k) => {
  let item = { id: `book07-src-${spec.no.slice(4).toLowerCase()}`, sourcePage: Number(spec.no.slice(5, 7)), sourceNo: spec.no, lessonId, topic,
    typeLabel: spec.type, sourceLocator: spec.loc, printGroup: spec.group, answerMode: "input", inputMode: "numeric", prompt: spec.prompt,
    answerRef: `/books/book-07/lessons/${lessonNo}/original/items/${k}` };
  if (spec.visual) item.visual = spec.visual; else item.noVisual = true;
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  if (spec.parts) { item = withParts(item, spec.parts); delete item.answerMode; delete item.inputMode; }
  return item;
});
const V = (subtype, v) => ({ kind: "book5", subtype, ...v });
const each = (list) => list.map((n) => `${n}개일 때`);

const A = "활동 02 가로수 심기(닫힌 도형)";
// 빈칸(가·나…)은 빈칸 채우기 문항(01-0·02-0)에만 단다. 나머지 문항은 같은 그림을 빈칸 없이.
const TRI0 = V("source-stone-polygon", { shape: "triangle", sides: [2, 3, 4, 5] }), SQ0 = V("source-stone-polygon", { shape: "square", sides: [2, 3, 4] });
const TRI = { ...TRI0, blanks: false }, SQ = { ...SQ0, blanks: false };
const T1 = "다음 그림은 바둑돌을 늘어놓아 정삼각형을 만든 것입니다.", S1 = "다음 그림은 바둑돌을 늘어놓아 정사각형을 만든 것입니다.";
const loc = (page, sec, k) => `교사용 슬라이드 ${page} · ${A} ${page <= 46 ? "1. 바둑돌" : page === 47 ? "2. 닫힌 도형의 둘레" : "3. 호수"} ${sec}${k ? ` (${k})` : ""}`;
const LAKE = "둘레가 100m인 원 모양의 호수 주위에 10m 간격으로 가로등이";
const specs = [
  { no: "GB7-S45-01-0", loc: loc(45, "01", 0), group: 451, type: "바둑돌 정삼각형", prompt: `${T1} 빈칸에 알맞은 바둑돌의 개수를 쓰시오.`, visual: TRI0, parts: ["가", "나", "다", "라"] },
  { no: "GB7-S45-01-1", loc: loc(45, "01", 1), group: 451, type: "바둑돌 정삼각형", prompt: "정삼각형 모양으로 바둑돌을 늘어놓았을 때 한 변에 바둑돌이 6개씩 있다면 사용된 바둑돌의 개수는 모두 몇 개인지 구하시오.", visual: TRI },
  { no: "GB7-S45-01-2", loc: loc(45, "01", 2), group: 451, type: "바둑돌 정삼각형", prompt: `${T1} 한 변에 바둑돌이 8개씩 있다면 바둑돌의 개수는 모두 몇 개인지 구하시오.`, visual: TRI },
  { no: "GB7-S45-01-3", loc: loc(45, "01", 3), group: 451, type: "바둑돌 정삼각형", prompt: `${T1} 한 변에 바둑돌이 10개씩 있다면 바둑돌의 개수는 모두 몇 개인지 구하시오.`, visual: TRI },
  { no: "GB7-S45-01-4", loc: loc(45, "01", 4), group: 452, type: "한 변의 바둑돌 거꾸로", prompt: "정삼각형 모양으로 바둑돌을 늘어놓았을 때 사용된 바둑돌의 개수가 15개라면 한 변에 놓인 바둑돌의 개수를 구하시오.", visual: TRI },
  { no: "GB7-S45-01-5", loc: loc(45, "01", 5), group: 452, type: "한 변의 바둑돌 거꾸로", prompt: "정삼각형 모양으로 바둑돌을 늘어놓았을 때, 사용된 바둑돌의 개수가 21, 27, 36개일 때 한 변에 놓인 바둑돌의 개수를 각각 구하시오.", visual: TRI, parts: each([21, 27, 36]) },
  { no: "GB7-S46-02-0", loc: loc(46, "02", 0), group: 461, type: "바둑돌 정사각형", prompt: `${S1} 빈칸에 알맞은 바둑돌의 개수를 쓰시오.`, visual: SQ0, parts: ["가", "나", "다"] },
  { no: "GB7-S46-02-1", loc: loc(46, "02", 1), group: 461, type: "바둑돌 정사각형", prompt: "정사각형 모양으로 바둑돌을 늘어놓았을 때 한 변에 바둑돌이 5개씩 있다면 사용된 바둑돌의 개수는 모두 몇 개인지 구하시오.", visual: SQ },
  { no: "GB7-S46-02-2", loc: loc(46, "02", 2), group: 461, type: "바둑돌 정사각형", prompt: "정사각형 모양으로 바둑돌을 늘어놓았을 때, 한 변에 놓인 바둑돌의 개수가 7, 9, 12개일 때 사용된 바둑돌의 개수를 각각 구하시오.", visual: SQ, parts: each([7, 9, 12]) },
  { no: "GB7-S46-02-3", loc: loc(46, "02", 3), group: 462, type: "한 변의 바둑돌 거꾸로", prompt: "정사각형 모양으로 바둑돌을 늘어놓았을 때 사용된 바둑돌의 개수가 20개라면 한 변에 놓인 바둑돌의 개수를 구하시오.", visual: SQ },
  { no: "GB7-S46-02-4", loc: loc(46, "02", 4), group: 462, type: "한 변의 바둑돌 거꾸로", prompt: "정사각형 모양으로 바둑돌을 늘어놓았을 때, 사용된 바둑돌의 개수가 28, 40, 52개일 때 한 변에 놓인 바둑돌의 개수를 각각 구하시오.", visual: SQ, parts: each([28, 40, 52]) },
  { no: "GB7-S47-01-1", loc: loc(47, "01", 0), group: 471, type: "닫힌 도형의 둘레", prompt: "한 변의 길이가 100m인 정사각형 모양의 땅의 둘레에 20m 간격으로 나무를 심으려고 합니다. 나무는 모두 몇 그루 필요합니까? (단, 정사각형의 꼭짓점에는 나무를 심습니다.)",
    visual: V("source-plot", { shape: "square", lengths: ["100m"], gap: "20m" }) },
  { no: "GB7-S47-02-1", loc: loc(47, "02", 0), group: 472, type: "닫힌 도형의 둘레", prompt: "가로, 세로가 각각 28m, 16m인 직사각형 모양의 땅의 둘레에 4m 간격으로 나무를 심으려고 합니다. 나무는 모두 몇 그루 필요합니까? (단, 직사각형의 꼭짓점에는 나무를 심습니다.)",
    visual: V("source-plot", { shape: "rect", lengths: ["28m", "16m"], gap: "4m" }) },
  { no: "GB7-S47-03-1", loc: loc(47, "03", 0), group: 473, type: "닫힌 도형의 둘레", prompt: "한 변의 길이가 30m인 정삼각형 모양의 땅의 둘레에 5m 간격으로 나무를 심으려고 합니다. 나무는 모두 몇 그루 필요합니까? (단, 정삼각형의 꼭짓점에는 나무를 심습니다.)",
    visual: V("source-plot", { shape: "triangle", lengths: ["30m"], gap: "5m" }) },
  { no: "GB7-S48-01-1", loc: loc(48, "01", 0), group: 481, type: "호수 둘레", prompt: "둘레가 100m인 원 모양의 호수 주위에 10m 간격으로 가로등을 설치하려고 합니다. 가로등은 몇 개 필요합니까?", visual: V("source-lake", { marker: "lamp", gap: "10m" }) },
  { no: "GB7-S48-02-1", loc: loc(48, "02", 0), group: 482, type: "호수 둘레", prompt: `${LAKE} 설치되어 있고, 각각의 가로등 사이에 휴지통이 1개씩 놓여 있다면 가로등과 휴지통은 각각 몇 개 놓여 있습니까?`,
    visual: V("source-lake", { marker: "lamp", gap: "10m", between: "bin" }), parts: ["가로등", "휴지통"] },
  { no: "GB7-S49-03-1", loc: loc(49, "03", 0), group: 491, type: "호수 둘레", prompt: `${LAKE} 설치되어 있습니다. 각각의 가로등 사이에 3명이 앉을 수 있는 긴 의자를 1개씩 놓았습니다. 호수 주위에 가로등은 몇 개이고, 호수 주위의 의자에는 모두 몇 명이 앉을 수 있습니까?`,
    visual: V("source-lake", { marker: "lamp", gap: "10m", between: "bench" }), parts: ["가로등", "앉을 수 있는 사람"] },
  { no: "GB7-S49-04-1", loc: loc(49, "04", 0), group: 492, type: "호수 둘레", prompt: `${LAKE} 설치되어 있습니다. 각각의 가로등 사이에 4명이 앉을 수 있는 긴 의자를 2개씩 놓았습니다. 호수 주위에 가로등은 몇 개이고, 호수 주위의 의자에는 모두 몇 명이 앉을 수 있습니까?`,
    visual: V("source-lake", { marker: "lamp", gap: "10m", between: "bench2" }), parts: ["가로등", "앉을 수 있는 사람"] },
  { no: "GB7-S50-05-1", loc: loc(50, "05", 0), group: 501, type: "둘레 거꾸로", prompt: "원 모양의 호수 주위에 일정한 간격으로 나무가 심어져 있습니다. 나무 하나 사이의 간격이 15m이고, 나무가 모두 20그루 심어져 있다고 할 때, 호수의 둘레를 구하시오.",
    visual: V("source-lake", { marker: "tree", gap: "15m" }) },
  { no: "GB7-S50-06-1", loc: loc(50, "06", 0), group: 502, type: "둘레 거꾸로", prompt: "원 모양의 호수 주위에 일정한 간격으로 가로등이 설치되어 있습니다. 가로등 하나 사이의 간격이 12m이고, 가로등이 모두 8개 설치되어 있다고 할 때, 호수의 둘레를 구하시오.",
    visual: V("source-lake", { marker: "lamp", gap: "12m" }) },
  { no: "GB7-S50-07-1", loc: loc(50, "07", 0), group: 503, type: "둘레 거꾸로", prompt: "원 모양의 호수 주위에 일정한 간격으로 가로등이 설치되어 있습니다. 두 가로등 사이에는 나무가 2그루씩 심어져 있는데 나무는 모두 30그루 있습니다. 가로등 하나 사이의 간격이 8m라고 할 때, 호수의 둘레를 구하시오.",
    visual: V("source-lake", { marker: "lamp", gap: "8m", between: "tree2" }) }
];
Object.assign(L2, { title: "가로수 심기(닫힌 도형)", sourceLocator: "교사용 슬라이드 45~50 · 활동 02 가로수 심기(닫힌 도형)",
  representativeConcept: "닫힌 둘레에서는 처음과 끝이 만나므로 심는 수와 간격 수가 같음. 꼭짓점의 돌·나무는 두 변이 함께 씀" });
L2.story = { ...L2.story, title: "가로수 심기(닫힌 도형)" };
L2.original = { ...L2.original, title: "골든벨", sourceQuestionCount: specs.length, prompt: "둘레를 따라 같은 간격으로 놓을 때의 개수와 길이를 구하시오.", items: build(L2No, L2.id, "가로수 심기", specs) };

const units = (list) => list.reduce((n, s) => n + (s.parts ? s.parts.length : 1), 0);
for (let page = 45; page <= 50; page += 1) {
  const list = specs.filter((s) => Number(s.no.slice(5, 7)) === page);
  if (!list.length) throw new Error(`page ${page} empty`);
  Object.assign(book.sourceCoverage.pageLedger.find((e) => e.page === page), { releasedItems: list.length, releasedAnswerUnits: units(list), heldRecords: 0, heldAnswerUnits: 0 });
}
book.sourceHold = book.sourceHold.filter((h) => !(h.sourcePage >= 45 && h.sourcePage <= 50));
const L = book.sourceCoverage.pageLedger;
Object.assign(book.sourceCoverage, {
  publicItems: L.reduce((n, e) => n + e.releasedItems, 0), publicAnswerUnits: L.reduce((n, e) => n + e.releasedAnswerUnits, 0),
  holdItems: book.sourceHold.filter((h) => h.sourceHold.itemCount > 0).length, heldAnswerUnits: L.reduce((n, e) => n + e.heldAnswerUnits, 0)
});
book.sourceCoverage.totalAnswerUnits = book.sourceCoverage.publicAnswerUnits + book.sourceCoverage.heldAnswerUnits;

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book07 batch4 patched", { L2: specs.length, units: units(specs), holds: book.sourceHold.length, coverage: { ...book.sourceCoverage, pageLedger: undefined } });
