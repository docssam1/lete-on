// 골든벨 7권 묶음 1b: 교사용 슬라이드 6~7 「시계 — 시간 변환·시각 읽기·시간 계산」.
// 6쪽 1. 시간 변환은 단원 13으로 새로 만들고, 6쪽 2. 시각 읽기는 단원 5, 7쪽 3. 시간 계산은 단원 0 자리에 원본대로 다시 짠다.
// 이 스크립트에는 정답이 없다. node patch-book07-batch1b.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-07");
if (book.lessons.some((l) => l.id === "time-unit-source")) throw new Error("already patched");
const L0No = book.lessons.findIndex((l) => l.id === "elapsed-time"), L5No = book.lessons.findIndex((l) => l.id === "clock-reading");
const L0 = book.lessons[L0No], L5 = book.lessons[L5No];

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
const eq = (text) => V("source-blank-equation", { tokens: text.split(" ").map((t) => (t === "□" ? null : t)) });
const blanksIn = (text) => text.split(" ").filter((t) => t === "□").length;
const LABELS = ["가", "나", "다"];

// ── 단원 13: 시간 단위 바꾸기 (6쪽 1. 시간 변환 + 확장하기) ──
const L13No = book.lessons.length;
const CONV = ["2일 = □ 시간", "2일 5시간 = □ 시간", "3일 = □ 시간", "3일 8시간 = □ 시간",
  "2시간 = □ 분", "2시간 30분 = □ 분", "3시간 15분 = □ 분", "4시간 10분 = □ 분", "180분 = □ 시간", "300분 = □ 시간", "420분 = □ 시간", "450분 = □ 시간 □ 분",
  "3분 = □ 초", "9분 = □ 초"];
const EXT = ["2주일 = □ 일", "18일 = 7일 + 7일 + □ 일 = □ 주일 □ 일", "30개월 = 12개월 + 12개월 + □ 개월 = □ 년 □ 개월", "2년 = □ 개월"];
const UNIT_NOTE = "1년 = 365일, 1일 = 24시간, 1시간 = 60분, 1분 = 60초";
const L13Specs = [
  ...CONV.map((t, k) => ({ no: `GB7-S06-01-${k + 1}`, loc: `교사용 슬라이드 6 · 1. 시간 변환 ${k < 4 ? "첫째" : k < 12 ? "둘째" : "셋째"} 줄`, group: 1 + Math.floor(k / 4), type: "시간 단위 바꾸기",
    prompt: `빈칸에 알맞은 수를 쓰시오. (${k + 1})`, visual: eq(t), ...(blanksIn(t) > 1 ? { parts: LABELS.slice(0, blanksIn(t)) } : {}) })),
  ...EXT.map((t, k) => ({ no: `GB7-S06-02-${k + 1}`, loc: "교사용 슬라이드 6 · 확장하기", group: 5, type: "주일·개월로 바꾸기",
    prompt: `1주일 = 7일, 1년 = 12개월입니다. 빈칸에 알맞은 수를 쓰시오. (${CONV.length + k + 1})`, visual: eq(t), ...(blanksIn(t) > 1 ? { parts: LABELS.slice(0, blanksIn(t)) } : {}) }))
];
const template = JSON.parse(JSON.stringify(L0.experience));
const L13 = {
  id: "time-unit-source", unit: "달력과 시계", title: "시간 단위 바꾸기", sourceLocator: "교사용 슬라이드 6 · 활동 02 시계 1. 시간 변환",
  sourceTypeIds: ["book07-time-unit-source"], representativeConcept: "1일 = 24시간, 1시간 = 60분, 1분 = 60초, 1주일 = 7일, 1년 = 12개월로 큰 단위와 작은 단위를 바꿈",
  story: { title: "시간의 단위", text: "날, 시간, 분, 초는 한 단계 큰 단위가 작은 단위 몇 개로 되어 있는지 알면 서로 바꿀 수 있습니다.", mission: "큰 단위 하나가 작은 단위 몇 개인지 먼저 떠올려 보세요." },
  explanation: { headline: "큰 단위를 작은 단위로 바꿀 때는 곱하고, 작은 단위를 큰 단위로 바꿀 때는 묶습니다.",
    steps: ["큰 단위 하나가 작은 단위 몇 개인지 떠올립니다.", "큰 단위가 여러 개면 그만큼 더합니다.", "남는 작은 단위를 더합니다.", "작은 단위를 큰 단위로 바꿀 때는 묶음으로 나눕니다."] },
  experience: { ...template, family: "time-unit-b7", title: "시간 단위를 바꿔요",
    beats: [
      { id: "time-unit-step-1", action: "reveal", caption: "1일은 24시간입니다.", visual: eq("1일 = 24시간") },
      { id: "time-unit-step-2", action: "highlight", caption: "4일은 24시간이 4번이므로 24 + 24 + 24 + 24를 합니다.", visual: eq("4일 = 24시간 + 24시간 + 24시간 + 24시간") },
      { id: "time-unit-step-3", action: "verify", caption: "4일은 96시간입니다.", visual: eq("4일 = 96시간") }
    ], hint: "큰 단위 하나가 작은 단위 몇 개인지 생각합니다.",
    check: { prompt: "1시간 20분은 몇 분일까요?", options: ["70분", "80분", "120분"], answerRef: `/books/book-07/lessons/${L13No}/experience/check` } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L13Specs.length, structureKey: "time-unit-source", prompt: `${UNIT_NOTE}, 1주일 = 7일, 1년 = 12개월입니다. 빈칸에 알맞은 수를 쓰시오.`, items: build(L13No, "time-unit-source", "시계", L13Specs) },
  extension: { title: "추가 학습", structureKey: "time-unit-source", story: "분을 초로 바꿉니다.", prompt: "5분은 몇 초입니까?", visual: eq("5분 = □ 초"),
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-07/lessons/${L13No}/extension` }
};

// ── 단원 5: 시각 읽기 (6쪽 2.) — 시계 그림은 원본 바늘 위치 그대로(옛 그림 데이터를 쓴다) ──
// 옛 그림의 「?시 ?분」 글자는 렌더러가 바늘을 숨기는 표시라, 바늘이 보이게 「몇 시 몇 분」으로 바꾸고 숫자판을 단다.
const clocks = L5.original.items.map((item) => ({ ...item.visual, clocks: item.visual.clocks.map((c) => ({ ...c, label: "몇 시 몇 분", numbers: true })) }));
if (clocks.length !== 6) throw new Error("clock count");
const L5Specs = clocks.map((v, k) => ({ no: `GB7-S06-03-${k + 1}`, loc: `교사용 슬라이드 6 · 2. 시각 읽기 ${k + 1}번째 시계`, group: 6 + Math.floor(k / 3), type: "시계 읽기",
  prompt: `시계가 가리키는 시각을 쓰시오. (${k + 1})`, visual: v, parts: ["시", "분"] }));
L5.sourceLocator = "교사용 슬라이드 6 · 2. 시각 읽기";
L5.original = { ...L5.original, title: "골든벨", sourceQuestionCount: L5Specs.length, prompt: "시계가 가리키는 시각을 쓰시오.", items: build(L5No, "clock-reading", "시계", L5Specs) };

// ── 단원 0: 시간 계산 (7쪽) ──
const t = (str, pre = "") => { const m = str.match(/^(?:(\d+)(시간|시))?\s*(?:(\d+)분)?$/); return { pre, h: m[1] ?? "", hu: m[2] ?? "", m: m[3] ?? "", mu: m[3] ? "분" : "" }; };
const col = (rows, result) => V("source-time-column", { rows, result });
const AT = { pre: "", hu: "시", mu: "분" }, LONG = { pre: "", hu: "시간", mu: "분" };
const ADD = [["3시 20분", "1시간 10분"], ["5시 40분", "3시간 20분"], ["2시 45분", "4시간 20분"], ["4시 35분", "3시간 45분"], ["7시 35분", "3시간 55분"]];
const SUB = [["8시 50분", "5시 30분"], ["7시 20분", "6시 30분"], ["5시 35분", "3시 50분"], ["9시 10분", "7시 52분"], ["10시 17분", "5시 25분"]];
const PM = [["2시 30분", "7시 20분"], ["3시 25분", "9시 35분"], ["5시 10분", "10시 45분"]];
const SPAN = [["9시 40분", "2시 30분"], ["10시 53분", "3시 16분"]];
const WORDS = [
  ["2시간 35분 동안 상영되는 영화가 11시 10분에 시작할 때 끝나는 시각은 오후 몇 시 몇 분입니까?", ["시", "분"]],
  ["9시 20분에 출발한 기차가 4시간 50분을 달려 도착했다면 몇 시 몇 분에 도착합니까?", ["시", "분"]],
  ["비행기를 5시 45분에 타고 10시 15분에 내렸을 때, 비행기를 탄 시간은 얼마입니까?", ["시간", "분"]],
  ["오전 11시 20분에 놀이공원에 갔다가 오후 5시 5분에 나왔을 때, 놀이공원에 있던 시간은 얼마입니까?", ["시간", "분"]]
];
const C = "교사용 슬라이드 7 · 3. 시간 계산";
const L0Specs = [
  ...ADD.map(([a, b], k) => ({ no: `GB7-S07-01-${k + 1}`, loc: `${C} 더하기 ${k + 1}`, group: 1, type: "시각 + 시간", prompt: `계산하시오. (${k + 1})`,
    visual: col([t(a), t(b, "+")], AT), parts: ["가", "나"] })),
  ...SUB.map(([a, b], k) => {
    const longZero = Number(a.match(/^\d+/)[0]) - Number(b.match(/^\d+/)[0]) === 1 && Number(a.match(/(\d+)분/)[1]) < Number(b.match(/(\d+)분/)[1]);
    return { no: `GB7-S07-02-${k + 1}`, loc: `${C} 빼기 ${k + 1}`, group: 2, type: "시각 − 시각", prompt: `두 시각 사이의 시간을 계산하시오. (${k + 1})`,
      visual: col([t(a), t(b, "-")], longZero ? { pre: "", mu: "분" } : LONG), ...(longZero ? {} : { parts: ["가", "나"] }) };
  }),
  ...PM.map(([a, b], k) => ({ no: `GB7-S07-03-${k + 1}`, loc: `${C} 오후 − 오전 ${k + 1}`, group: 3, type: "오후 − 오전", prompt: `두 시각 사이의 시간을 계산하시오. (${k + 1})`,
    visual: col([t(a, "오후"), t(b, "- 오전")], LONG), parts: ["가", "나"] })),
  ...SPAN.map(([a, b], k) => ({ no: `GB7-S07-04-${k + 1}`, loc: `${C} 걸린 시간 ${k + 1}`, group: 4, type: "걸린 시간", prompt: `시작 시각과 끝난 시각을 보고 걸린 시간을 구하시오. (${k + 1})`,
    visual: col([t(a, "시작 시각 오전"), t(b, "끝난 시각 오후")], { pre: "걸린 시간", hu: "시간", mu: "분" }), parts: ["가", "나"] })),
  ...WORDS.map(([q, parts], k) => ({ no: `GB7-S07-05-${k + 1}`, loc: `${C} 글 문제 ${k + 1}`, group: 5, type: "시간 글 문제", prompt: q, parts }))
];
Object.assign(L0, { sourceLocator: "교사용 슬라이드 7 · 3. 시간 계산", representativeConcept: "시는 시끼리, 분은 분끼리 계산하고 60분을 1시간으로 받아올리거나 받아내림. 오후 시각은 12를 더해 오전과 같은 기준으로 놓음" });
const { visual: _oldSet, ...origRest } = L0.original;
L0.original = { ...origRest, mode: "paged", sourceQuestionCount: L0Specs.length, prompt: "시간을 계산하시오.", items: build(L0No, "elapsed-time", "시계", L0Specs) };

book.lessons.push(L13);

const units = (specs) => specs.reduce((n, s) => n + (s.parts ? s.parts.length : 1), 0);
for (const [page, specs] of Object.entries({ 6: [...L13Specs, ...L5Specs], 7: L0Specs })) {
  const entry = book.sourceCoverage.pageLedger.find((e) => e.page === Number(page));
  Object.assign(entry, { releasedItems: specs.length, releasedAnswerUnits: units(specs), heldRecords: 0, heldAnswerUnits: 0 });
}
book.sourceHold = book.sourceHold.filter((h) => ![6, 7].includes(h.sourcePage));
const L = book.sourceCoverage.pageLedger;
Object.assign(book.sourceCoverage, {
  sourceLessons: book.lessons.length,
  publicItems: L.reduce((n, e) => n + e.releasedItems, 0), publicAnswerUnits: L.reduce((n, e) => n + e.releasedAnswerUnits, 0),
  holdItems: book.sourceHold.filter((h) => h.sourceHold.itemCount > 0).length, heldAnswerUnits: L.reduce((n, e) => n + e.heldAnswerUnits, 0)
});
book.sourceCoverage.totalAnswerUnits = book.sourceCoverage.publicAnswerUnits + book.sourceCoverage.heldAnswerUnits;

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book07 batch1b patched", { L0: L0.original.items.length, L5: L5.original.items.length, L13: L13.original.items.length, lessonNos: [L0No, L5No, L13No], holds: book.sourceHold.length });
