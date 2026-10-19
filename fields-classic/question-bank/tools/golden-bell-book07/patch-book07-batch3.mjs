// 골든벨 7권 묶음 3: 교사용 슬라이드 26~44 「가정하여 풀기 · 재치 있게 풀기」.
// 26~33쪽은 단원 8, 35~44쪽은 단원 9 자리에 원본대로 다시 짠다. 34쪽은 단원 표지(그대로 보류).
// 옛 단원 9 그림(climb·doubling)은 날 수·길이 답을 그림에 그리고 있어 모두 바꾼다(추가 학습·유사문제 포함).
// 이 스크립트에는 정답이 없다. node patch-book07-batch3.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-07");
const no = (id) => book.lessons.findIndex((l) => l.id === id);
const L8No = no("assumption-score"), L9No = no("reverse-growth");
const L8 = book.lessons[L8No], L9 = book.lessons[L9No];
if (L8.original.items.some((i) => i.sourceNo.startsWith("GB7-"))) throw new Error("already patched");

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
// 원본의 빈 풀이 표: 첫 칸은 줄 이름, 나머지 칸은 비운다.
const work = (labels, cols) => V("source-text-table", { head: false, cells: labels.map((l) => [l, ...Array(cols).fill("")]) });
const dayTable = (days, rows) => [["날짜", ...days.map((d) => `${d}일`)], ...rows.map((r) => [r, ...days.map(() => "")])];
const range = (a, b) => (a <= b ? Array.from({ length: b - a + 1 }, (_, k) => a + k) : Array.from({ length: a - b + 1 }, (_, k) => a - k));
const pg = (n) => String(n).padStart(2, "0");

// ── 단원 8: 가정하여 풀기 (26~33쪽) ──
const S1 = "활동 03 가정하여 풀기 1. 기본 유형 연습", S2 = "2. 기본점수와 감점요인이 포함되는 유형";
const BIKE = (n, other, cars, wheels) => `두발자전거와 ${other}가 모두 합하여 ${cars}대가 있습니다. 두발자전거와 ${other}의 바퀴 수가 모두 합쳐 ${wheels}개였다면 ${n}`;
const QUIZ = (a, b, n, total) => `지민이는 퀴즈대회에 나갔습니다. 이 퀴즈대회의 문제는 ${a}점과 ${b}점짜리 문제로 이루어져 있습니다. 지민이가 ${n}문제를 맞혀 ${total}점이 되었다면 맞힌 문제는 각각 몇 문제인지 구하시오.`;
const PM = (base, plus, minus, total) => `지민이는 퀴즈대회에 나갔습니다. 이 퀴즈대회에서는 ${base ? `기본 점수 ${base}점부터 시작하여 ` : ""}한 문제를 맞히면 ${plus}점을 얻고, 틀리면 ${minus}점을 감점합니다. 지민이가 10문제를 풀어 ${total}점이 되었다면 맞힌 문제와 틀린 문제는 각각 몇 문제인지 구하시오.`;
const RW = ["맞힌 문제", "틀린 문제"];
const pmTable = (plus, minus, cols) => work([`맞힌 문제(+${plus})`, `틀린 문제(-${minus})`, "점수"], cols);
const L8Specs = [
  { no: "GB7-S26-01-1", loc: `교사용 슬라이드 26 · ${S1} 01`, group: 261, type: "두 가지 바퀴 수", prompt: BIKE("두발자전거는 몇 대인지 구하시오.", "세발자전거", 4, 11),
    visual: work(["두발자전거", "세발자전거", "바퀴 수의 합"], 4) },
  { no: "GB7-S26-02-1", loc: `교사용 슬라이드 26 · ${S1} 02`, group: 262, type: "두 가지 바퀴 수", prompt: BIKE("두발자전거와 세발자전거는 각각 몇 대씩 있는지 구하시오.", "세발자전거", 10, 25),
    visual: work(["두발자전거", "세발자전거", "바퀴 수의 합"], 6), parts: ["두발자전거", "세발자전거"] },
  { no: "GB7-S26-03-1", loc: `교사용 슬라이드 26 · ${S1} 03`, group: 263, type: "두 가지 바퀴 수", prompt: BIKE("두발자전거와 네발자전거는 각각 몇 대씩 있는지 구하시오.", "네발자전거", 15, 40),
    visual: work(["두발자전거", "네발자전거", "바퀴 수의 합"], 10), parts: ["두발자전거", "네발자전거"] },
  { no: "GB7-S27-04-1", loc: `교사용 슬라이드 27 · ${S1} 04`, group: 271, type: "두 가지 점수", prompt: QUIZ(3, 5, 10, 34), visual: work(["3점짜리", "5점짜리", "점수"], 8), parts: ["3점짜리", "5점짜리"] },
  { no: "GB7-S27-05-1", loc: `교사용 슬라이드 27 · ${S1} 05`, group: 272, type: "두 가지 점수", prompt: QUIZ(2, 6, 10, 36), visual: work(["2점짜리", "6점짜리", "점수"], 8), parts: ["2점짜리", "6점짜리"] },
  { no: "GB7-S28-01-1", loc: `교사용 슬라이드 28 · ${S2} 01`, group: 281, type: "기본 점수가 있는 점수", prompt: "기본점수 30점이 있는 시험에서 2점짜리 문제와 5점짜리 문제 5개를 풀어서 49점을 받았습니다. 2점짜리 문제의 개수를 구하시오." },
  { no: "GB7-S28-02-1", loc: `교사용 슬라이드 28 · ${S2} 02`, group: 282, type: "감점이 있는 점수", prompt: "퀴즈대회에서 맞으면 3점을 받고, 틀리면 1점 감점일 때, 8문제를 풀고 16점을 받았다면 맞은 문제의 개수는?" },
  { no: "GB7-S28-03-1", loc: `교사용 슬라이드 28 · ${S2} 03`, group: 283, type: "감점이 있는 점수", prompt: "퀴즈대회에서 맞으면 3점을 받고, 틀리면 2점 감점일 때, 10문제를 풀고 0점을 받았다면 맞은 문제의 개수는?",
    visual: work(["맞힘(+3)", "틀림(-2)", "점수"], 7), discrepancy: "원본 물음 글은 틀렸을 때 감점이 아래 표(틀림 칸)와 다르게 적혀 있어, 표와 교사용 풀이의 감점으로 고쳤습니다." },
  { no: "GB7-S29-04-1", loc: `교사용 슬라이드 29 · ${S2} 04`, group: 291, type: "감점이 있는 점수", prompt: "민수는 퀴즈대회에서 총 10문제를 풀고 28점을 받았습니다. 한 문제를 맞힐 때마다 6점을 얻고 틀리면 2점이 감점됩니다. 민수가 맞힌 문제는 몇 문제인지 구하시오." },
  { no: "GB7-S29-05-1", loc: `교사용 슬라이드 29 · ${S2} 05`, group: 292, type: "감점이 있는 점수", prompt: "민수는 퀴즈대회에서 총 20문제를 풀고 36점을 받았습니다. 한 문제를 맞힐 때마다 5점을 얻고 틀리면 3점이 감점됩니다. 민수가 맞힌 문제는 몇 문제인지 구하시오." },
  ...[[30, "06", 0, 3, 2, 10, 6], [30, "07", 0, 3, 2, 15, 7], [31, "08", 20, 3, 2, 30, 7], [31, "09", 30, 3, 2, 45, 6],
    [32, "10", 30, 5, 3, 40, 7], [32, "11", 30, 5, 3, 48, 6], [33, "12", 50, 10, 5, 105, 7], [33, "13", 50, 10, 5, 60, 6]].map(([page, sec, base, plus, minus, total, cols]) => ({
    no: `GB7-S${page}-${sec}-1`, loc: `교사용 슬라이드 ${page} · ${S2} ${sec}`, group: page * 10 + Number(sec) % 10, type: base ? "기본 점수와 감점" : "감점이 있는 점수",
    prompt: PM(base, plus, minus, total), visual: pmTable(plus, minus, cols), parts: RW }))
];
Object.assign(L8, { sourceLocator: "교사용 슬라이드 26~33 · 활동 03 가정하여 풀기",
  representativeConcept: "모두 한 가지라고 가정해 계산한 값과 실제 값의 차이를, 하나를 바꿀 때 달라지는 양으로 나누어 개수를 구함" });
L8.original = { ...L8.original, title: "골든벨", sourceQuestionCount: L8Specs.length, prompt: "모두 한 가지라고 가정하고 차이를 비교하여 구하시오.", items: build(L8No, L8.id, "가정하여 풀기", L8Specs) };

// ── 단원 9: 재치 있게 풀기 (35~44쪽) ──
const W1 = "활동 01 재치 있게 풀기 1. 우물 안 달팽이", W2 = "2. 빈 병 바꾸기", W3 = "3. 개구리 풀(죽순 문제)", W4 = "4. 연못 개구리 풀 문제";
const SNAIL = (d, up, down) => `달팽이가 ${d}m 깊이의 우물을 기어 올라가는데, 낮에는 ${up}m 올라가고, 밤에는 ${down}m 미끄러져 내려간다고 합니다. 달팽이가 우물 위로 올라가 빠져나오는 데 며칠이 걸립니까?`;
const well = (depth, marks, days) => V("source-well", { depth, marks, table: dayTable(range(1, days), ["낮", "밤"]) });
const MART = (k, n) => `어느 마트에서는 음료수를 다 마신 후 빈 병 ${k}개를 가져오면 새 음료수 1병으로 바꾸어 준다고 합니다. 이 마트에서 음료수를 ${n}병 사면 최대 몇 병까지 마실 수 있습니까?`;
const MART_NOTE = "원본의 가게 이름(교재 회사 이름이 들어간 마트)을 「어느 마트」로 바꾸었습니다.";
const swap = (gk, gc, tk, tc) => V("source-swap", { give: { kind: gk, count: gc }, get: { kind: tk, count: tc } });
const TREE = (day, cm, ask) => `어떤 나무는 다 자랄 때까지 매일 2배씩 자란다고 합니다. 나무가 자라기 시작한 날부터 ${day}일째 되는 날 길이를 재어 보았더니 ${cm}cm입니다. ${ask}`;
const table = (cells) => V("source-text-table", { cells });
const pond = (rows, cols, days) => V("source-pond", { rows, cols, shaded: 1, table: dayTable(range(1, days), ["개구리풀"]) });
const FROG = "준교가 매일 2배씩 자라는 개구리풀 하나를 가져와 연못에 넣었더니";
const L9Specs = [
  { no: "GB7-S35-01-1", loc: `교사용 슬라이드 35 · ${W1} 01`, group: 351, type: "우물 안 달팽이", prompt: SNAIL(4, 2, 1), visual: well(4, [1, 2, 3, 4], 5) },
  { no: "GB7-S35-02-1", loc: `교사용 슬라이드 35 · ${W1} 02`, group: 352, type: "우물 안 달팽이", prompt: SNAIL(17, 3, 1), visual: well(17, [5, 10, 15, 17], 9) },
  { no: "GB7-S36-03-1", loc: `교사용 슬라이드 36 · ${W1} 03`, group: 361, type: "우물 안 달팽이", prompt: SNAIL(23, 5, 2), visual: well(23, [5, 10, 15, 20, 23], 9) },
  { no: "GB7-S36-04-1", loc: `교사용 슬라이드 36 · ${W1} 04`, group: 362, type: "우물 안 달팽이", prompt: SNAIL(29, 9, 4), visual: well(29, [5, 10, 15, 20, 25, 29], 9) },
  { no: "GB7-S37-01-1", loc: `교사용 슬라이드 37 · ${W2} 01`, group: 371, type: "빈 병 바꾸기", prompt: MART(2, 8), visual: swap("bottle", 2, "bottle", 1), discrepancy: MART_NOTE },
  { no: "GB7-S37-02-1", loc: `교사용 슬라이드 37 · ${W2} 02`, group: 372, type: "빈 병 바꾸기", prompt: MART(5, 50), visual: swap("bottle", 5, "bottle", 1), discrepancy: MART_NOTE },
  { no: "GB7-S38-03-1", loc: `교사용 슬라이드 38 · ${W2} 03`, group: 381, type: "쿠폰 바꾸기",
    prompt: "어떤 피자 가게에서는 상자에 붙어 있는 쿠폰을 9장 모으면 피자 1판을 준다고 합니다. 피자를 81판 시켰을 때, 최대 몇 판을 먹을 수 있는지 구하시오. (이때, 모든 피자 상자에는 쿠폰이 1장씩 들어 있습니다.)", visual: swap("coupon", 9, "pizza", 1) },
  { no: "GB7-S38-04-1", loc: `교사용 슬라이드 38 · ${W2} 04`, group: 382, type: "빈 병 바꾸기",
    prompt: "어느 가게에서 우유를 마신 다음 빈 병 7개를 주면 새 우유 2병을 준다고 합니다. 우유를 49병 사면 최대 몇 병까지 마실 수 있습니까?", visual: swap("milk", 7, "newMilk", 2) },
  { no: "GB7-S39-01-1", loc: `교사용 슬라이드 39 · ${W3} 01`, group: 391, type: "두 배씩 자라기",
    prompt: "어떤 대나무 죽순은 다 자랄 때까지 매일 2배씩 자란다고 합니다. 대나무 죽순이 자라기 시작한 날부터 1일째 되는 날 길이를 재어 보았더니 3cm입니다. 7일째 되는 날 대나무 죽순의 길이는 몇 cm가 되는지 구하시오.",
    visual: table(dayTable(range(1, 7), ["죽순"])) },
  { no: "GB7-S39-02-1", loc: `교사용 슬라이드 39 · ${W3} 02`, group: 392, type: "거꾸로 반씩",
    prompt: TREE(12, 32, "8일째 되는 날 나무의 길이는 몇 cm가 되는지 구하시오."), visual: table(dayTable(range(12, 8), ["나무"])),
    discrepancy: "원본 물음 글의 마지막 문장에 앞 문항의 「대나무 죽순」이 남아 있어, 이 문항의 「나무」로 고쳤습니다." },
  { no: "GB7-S40-03-1", loc: `교사용 슬라이드 40 · ${W3} 03`, group: 401, type: "거꾸로 반씩", prompt: TREE(15, 64, "나무가 4cm가 된 것은 며칠째 되는 날인지 구하시오."), visual: table(dayTable(range(15, 9), ["나무"])) },
  { no: "GB7-S40-04-1", loc: `교사용 슬라이드 40 · ${W3} 04`, group: 402, type: "거꾸로 반씩", prompt: TREE(20, 32, "나무가 1cm가 된 것은 며칠째 되는 날인지 구하시오."), visual: table(dayTable(range(20, 13), ["나무"])) },
  { no: "GB7-S41-01-1", loc: `교사용 슬라이드 41 · ${W4} 01`, group: 411, type: "연못 개구리풀",
    prompt: "준교가 매일 2배씩 자라는 개구리풀을 가져와 연못에 넣었더니 1일째 되는 날 그림의 색칠된 부분만큼 연못을 덮었습니다. 연못을 모두 덮으려면 며칠이 걸리는지 구하시오.", visual: pond(2, 2, 3) },
  { no: "GB7-S41-02-1", loc: `교사용 슬라이드 41 · ${W4} 02`, group: 412, type: "연못 개구리풀",
    prompt: `${FROG} 1일째 되는 날 연못 전체의 32분의 1만큼 덮었습니다. 연못을 모두 덮으려면 며칠이 걸리는지 구하시오.`, visual: pond(4, 8, 6) },
  { no: "GB7-S42-03-1", loc: `교사용 슬라이드 42 · ${W4} 03 (1)`, group: 421, type: "연못 개구리풀",
    prompt: `${FROG} 1일째 되는 날 그림의 색칠된 부분만큼 연못을 덮었습니다. (1) 연못을 모두 덮으려면 며칠이 걸리는지 구하시오.`, visual: pond(2, 4, 4) },
  { no: "GB7-S42-03-2", loc: `교사용 슬라이드 42 · ${W4} 03 (2)`, group: 421, type: "처음 수가 다를 때",
    prompt: `${FROG} 1일째 되는 날 그림의 색칠된 부분만큼 연못을 덮었습니다. (2) 개구리풀이 처음에 2개였다면 연못을 모두 덮으려면 며칠이 걸리는지 구하시오.`, visual: pond(2, 4, 4) },
  { no: "GB7-S42-04-1", loc: `교사용 슬라이드 42 · ${W4} 04`, group: 422, type: "거꾸로 반씩",
    prompt: `${FROG} 10일 만에 연못을 모두 덮었습니다. 연못 전체의 4분의 1을 덮으려면 며칠이 걸리는지 구하시오.`, visual: table(dayTable(range(10, 6), ["개구리풀"])) },
  { no: "GB7-S43-05-1", loc: `교사용 슬라이드 43 · ${W4} 05`, group: 431, type: "처음 수가 다를 때",
    prompt: `${FROG} 15일 만에 연못을 모두 덮었습니다. 처음 가져온 개구리풀이 2개일 때 연못을 모두 덮으려면 며칠이 걸리는지 구하시오.`, visual: table(dayTable(range(15, 12), ["개구리풀 1개", "개구리풀 2개"])) },
  { no: "GB7-S43-06-1", loc: `교사용 슬라이드 43 · ${W4} 06`, group: 432, type: "처음 수가 다를 때",
    prompt: `${FROG} 100일 만에 연못을 모두 덮었습니다. 처음 가져온 개구리풀이 4개일 때 연못을 모두 덮으려면 며칠이 걸리는지 구하시오.`, visual: table(dayTable(range(100, 96), ["개구리풀 1개", "개구리풀 4개"])) },
  { no: "GB7-S44-07-1", loc: `교사용 슬라이드 44 · ${W4} 07`, group: 441, type: "며칠 앞당기기",
    prompt: `${FROG} 20일 만에 연못을 모두 덮었습니다. 17일 만에 연못을 모두 덮으려면 몇 개의 개구리풀을 넣으면 되는지 구하시오.`, visual: table(dayTable(range(20, 16), ["개구리풀", "가득 채우기 위해 필요한 개구리풀 개수"])) },
  { no: "GB7-S44-08-1", loc: `교사용 슬라이드 44 · ${W4} 08`, group: 442, type: "며칠 앞당기기",
    prompt: `${FROG} 50일 만에 연못을 모두 덮었습니다. 45일 만에 연못을 모두 덮으려면 몇 개의 개구리풀을 넣으면 되는지 구하시오.`, visual: table(dayTable(range(50, 45), ["개구리풀"])) }
];
Object.assign(L9, { sourceLocator: "교사용 슬라이드 35~44 · 활동 01 재치 있게 풀기",
  representativeConcept: "마지막 날은 미끄러지지 않고, 빈 병은 바꾼 병도 다시 빈 병이 되며, 매일 두 배가 되면 하루 전은 절반임" });
L9.original = { ...L9.original, title: "골든벨", sourceQuestionCount: L9Specs.length, prompt: "규칙을 따라가거나 거꾸로 따라가며 구하시오.", items: build(L9No, L9.id, "재치 있게 풀기", L9Specs) };
// 추가 학습·유사문제 그림: 옛 climb 그림은 날 수(답)만큼 칸을 그렸다 → 우물 그림으로(답은 그대로).
for (const p of [L9.extension, ...(L9.similarPractice || [])]) {
  if (p.visual?.subtype !== "climb") throw new Error("unexpected L9 practice visual");
  const d = p.visual.height;
  p.visual = V("source-well", { depth: d, marks: [...range(1, Math.floor(d / 5)).map((k) => k * 5).filter((m) => m < d), d] });
}

// ── 장부 · 보류 ──
const units = (specs) => specs.reduce((n, s) => n + (s.parts ? s.parts.length : 1), 0);
const byPage = {};
for (const s of [...L8Specs, ...L9Specs]) (byPage[Number(s.no.slice(5, 7))] ||= []).push(s);
for (let page = 26; page <= 44; page += 1) {
  if (page === 34) continue;
  const specs = byPage[page];
  if (!specs) throw new Error(`page ${pg(page)} empty`);
  const entry = book.sourceCoverage.pageLedger.find((e) => e.page === page);
  Object.assign(entry, { releasedItems: specs.length, releasedAnswerUnits: units(specs), heldRecords: 0, heldAnswerUnits: 0 });
}
book.sourceHold = book.sourceHold.filter((h) => !(h.sourcePage >= 26 && h.sourcePage <= 44 && h.sourcePage !== 34));
const t34 = book.sourceHold.find((h) => h.sourcePage === 34);
if (t34) t34.topic = "가로수 심기";
const L = book.sourceCoverage.pageLedger;
Object.assign(book.sourceCoverage, {
  publicItems: L.reduce((n, e) => n + e.releasedItems, 0), publicAnswerUnits: L.reduce((n, e) => n + e.releasedAnswerUnits, 0),
  holdItems: book.sourceHold.filter((h) => h.sourceHold.itemCount > 0).length, heldAnswerUnits: L.reduce((n, e) => n + e.heldAnswerUnits, 0)
});
book.sourceCoverage.totalAnswerUnits = book.sourceCoverage.publicAnswerUnits + book.sourceCoverage.heldAnswerUnits;

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book07 batch3 patched", { L8: L8Specs.length, L9: L9Specs.length, units: units([...L8Specs, ...L9Specs]), holds: book.sourceHold.length, coverage: { ...book.sourceCoverage, pageLedger: undefined } });
