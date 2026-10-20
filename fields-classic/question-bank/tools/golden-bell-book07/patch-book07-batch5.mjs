// 골든벨 7권 묶음 5: 교사용 슬라이드 52~62 「활동 01 팔린드롬과 대칭수 · 2. 자릿수 바꾸어 빼기 · 활동 02 벤 다이어그램 1.(수직선 위의 거리)」.
// 52~56쪽은 새 단원 15, 57~60쪽은 단원 10 자리에 다시, 61~62쪽은 새 단원 16. 51쪽은 단원 표지(보류 그대로).
// 52쪽 (1) 한 자리 대칭수는 물음 글만으로 답이 하나로 정해지지 않아 보류로 남긴다.
// 이 스크립트에는 정답이 없다. node patch-book07-batch5.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-07");
if (book.lessons.some((l) => l.id === "palindrome-source")) throw new Error("already patched");
const L10No = book.lessons.findIndex((l) => l.id === "reverse-digits"), L10 = book.lessons[L10No];

const withParts = (item, labels) => ({ ...item, parts: labels.map((label, k) => ({ id: String.fromCharCode(97 + k), label, answerRef: `${item.answerRef}/parts/${k}` })) });
const build = (lessonNo, lessonId, topic, specs) => specs.map((spec, k) => {
  let item = { id: `book07-src-${spec.no.slice(4).toLowerCase()}`, sourcePage: Number(spec.no.slice(5, 7)), sourceNo: spec.no, lessonId, topic,
    typeLabel: spec.type, sourceLocator: spec.loc, printGroup: spec.group, answerMode: "input", inputMode: "numeric", prompt: spec.prompt,
    answerRef: `/books/book-07/lessons/${lessonNo}/original/items/${k}` };
  if (spec.visual) item.visual = spec.visual; else item.noVisual = true;
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  if (spec.set) { item.inputMode = "text"; item.resultContract = { type: "set" }; }
  if (spec.parts) { item = withParts(item, spec.parts); delete item.answerMode; delete item.inputMode; }
  return item;
});
const V = (subtype, v) => ({ kind: "book5", subtype, ...v });
const template = () => JSON.parse(JSON.stringify(book.lessons.find((l) => l.id === "time-unit-source").experience));

// ── 단원 15: 팔린드롬과 대칭수 (52~56쪽) ──
const L15No = book.lessons.length;
const P1 = "232, 4554처럼 앞으로 읽으나 뒤로 읽으나 똑같은 수를 대칭수라고 합니다. 다음 주어진 대칭수의 개수를 구하시오.";
const P2 = "22, 252, 1881과 같이 앞으로 읽으나 뒤로 읽으나 같은 수를 대칭수 또는 팔린드롬 수라고 합니다. 다음 주어진 조건을 만족하는 수를 모두 구하시오. (여러 개이면 쉼표로 모두 쓰시오.)";
const CAL = "달력에서 날짜를 보기와 같이 나타낼 때, 1월 1일부터 12월 31일까지의 날짜 중에서 대칭수는 모두 몇 개입니까?";
const CLK = "시각을 보기와 같이 수로 나타낼 때, 대칭수는 모두 몇 번 나타납니까?";
const box = (lines, title) => V("source-note-box", title ? { title, lines } : { lines });
const A1 = "활동 01 팔린드롬과 대칭수";
const L15Specs = [
  ...[["두", 2], ["세", 3], ["네", 4], ["다섯", 5]].map(([w], k) => ({ no: `GB7-S52-01-${k + 2}`, loc: `교사용 슬라이드 52 · ${A1} 1. 대칭수 개수 구하기 01 (${k + 2})`, group: 521, type: "대칭수 개수",
    prompt: `${P1} (${k + 2}) ${w} 자리 대칭수` })),
  ...[[53, "02", "세 자리의 대칭수입니다.", "각 자리의 숫자의 합이 8입니다."], [53, "03", "세 자리의 대칭수입니다.", "각 자리의 숫자의 합이 12입니다."],
    [54, "04", "300보다 크고 600보다 작습니다.", "각 자리의 숫자의 합이 10입니다."], [54, "05", "네 자리의 대칭수입니다.", "각 자리의 숫자의 합이 10입니다."]].map(([page, sec, a, b]) => ({
    no: `GB7-S${page}-${sec}-1`, loc: `교사용 슬라이드 ${page} · ${A1} 조건에 맞는 대칭수 구하기 ${sec}`, group: page * 10 + Number(sec) % 10, type: "조건에 맞는 대칭수", prompt: P2, visual: box([a, b]), set: true })),
  ...[["06", "2월 5일 → 25, 3월 13일 → 313, 12월 7일 → 127"], ["07", "1월 8일 → 108, 4월 27일 → 427, 10월 4일 → 1004"], ["08", "1월 1일 → 0101, 5월 15일 → 0515, 11월 5일 → 1105"]].map(([sec, ex]) => ({
    no: `GB7-S55-${sec}-1`, loc: `교사용 슬라이드 55 · ${A1} 달력 대칭수 ${sec}`, group: 550 + Number(sec) % 10, type: "달력 대칭수", prompt: CAL, visual: box(ex.split(", "), "보기") })),
  ...[["09", ["3시 5분 → 35", "11시 7분 → 117", "8시 23분 → 823", "12시 22분 → 1222"], ["8시부터 10시 사이에", "2시부터 12시 사이에"]],
    ["10", ["3시 5분 → 305", "11시 7분 → 1107", "8시 23분 → 823", "12시 22분 → 1222"], ["3시부터 9시 사이에", "8시부터 12시 사이에"]]].flatMap(([sec, ex, asks]) => asks.map((ask, k) => ({
    no: `GB7-S56-${sec}-${k + 1}`, loc: `교사용 슬라이드 56 · ${A1} 시계 대칭수 ${sec} (${k + 1})`, group: 560 + Number(sec) % 10, type: "시계 대칭수",
    prompt: `${CLK} (${k + 1}) ${ask} 대칭수는 모두 몇 번 나타납니까?`, visual: box(ex, "보기") })))
];
const L15 = {
  id: "palindrome-source", unit: "자리 바꾸기", title: "팔린드롬과 대칭수", sourceLocator: "교사용 슬라이드 52~56 · 활동 01 팔린드롬과 대칭수",
  sourceTypeIds: ["book07-palindrome-source"], representativeConcept: "대칭수는 앞에서부터 읽은 숫자와 뒤에서부터 읽은 숫자가 같으므로, 앞쪽 절반의 숫자만 정하면 나머지가 정해짐",
  story: { title: "대칭수", text: "121, 3443처럼 앞으로 읽어도 뒤로 읽어도 같은 수가 있어요. 이런 수를 대칭수(팔린드롬 수)라고 해요.", mission: "맨 앞 숫자와 맨 뒤 숫자가 같은지부터 보세요." },
  explanation: { headline: "대칭수는 맨 앞과 맨 뒤, 둘째와 끝에서 둘째 숫자가 서로 같습니다. 앞쪽 절반만 정하면 됩니다.",
    steps: ["맨 앞 숫자와 맨 뒤 숫자가 같은 짝을 찾습니다.", "맨 앞 숫자는 0이 될 수 없습니다.", "가운데 숫자는 혼자라 아무 숫자나 됩니다.", "조건(합·범위)에 맞는 것만 빠짐없이 차례로 씁니다."] },
  experience: { ...template(), family: "palindrome-b7", title: "앞뒤가 같은 수를 찾아요",
    beats: [
      { id: "palindrome-step-1", action: "reveal", caption: "121은 앞에서 읽어도 1, 2, 1, 뒤에서 읽어도 1, 2, 1이에요.", visual: box(["1 2 1 → 1 2 1"]) },
      { id: "palindrome-step-2", action: "highlight", caption: "세 자리 대칭수는 첫째 숫자와 셋째 숫자가 같아요. 가운데는 아무 숫자나 돼요.", visual: box(["2 □ 2"]) },
      { id: "palindrome-step-3", action: "verify", caption: "2로 시작하는 세 자리 대칭수는 202, 212, …, 292예요.", visual: box(["202, 212, 222, …, 292"]) }
    ], hint: "맨 앞 숫자와 맨 뒤 숫자를 짝으로 보세요.",
    check: { prompt: "3으로 시작하는 세 자리 대칭수는 모두 몇 개일까요?", options: ["9", "10", "11"], answerRef: `/books/book-07/lessons/${L15No}/experience/check` } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L15Specs.length, structureKey: "palindrome-source", prompt: "앞으로 읽으나 뒤로 읽으나 같은 수를 찾으시오.", items: build(L15No, "palindrome-source", "대칭수", L15Specs) },
  extension: { title: "추가 학습", structureKey: "palindrome-source", story: "네 자리 대칭수를 셉니다.", prompt: "1로 시작하는 네 자리 대칭수는 모두 몇 개입니까?", visual: box(["1 □ □ 1"]),
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-07/lessons/${L15No}/extension` }
};

// ── 단원 10: 자릿수 바꾸어 빼기 (57~60쪽) ──
const SW = (d) => `두 자리 수에서 앞뒤 숫자를 바꾸어 새로운 ${d === 9 || d === 18 ? "두 자리 " : ""}수를 만들었습니다. 새로운 수와 원래 수의 차가 ${d}일 때, 만들 수 있는 수는 모두 몇 가지인지 구하시오.`;
const PAGE = { 9: 57, 18: 58, 27: 58, 36: 59, 45: 59, 54: 60, 63: 60, 72: 60 };
const L10Specs = [9, 18, 27, 36, 45, 54, 63, 72].flatMap((d, k) => {
  const page = PAGE[d], sec = `0${k + 1}`, loc = (n) => `교사용 슬라이드 ${page} · 2. 자릿수 바꾸어 빼기 ${sec} (${n})`, group = page * 10 + k + 1;
  const visual = V("source-swap-sub", { result: d });
  const first = { no: `GB7-S${page}-${sec}-1`, loc: loc(1), group, type: "원래 수의 가짓수", prompt: `${SW(d)} (1) 만들 수 있는 원래 수는 몇 가지인지 구하시오.`, visual };
  if (d === 72) return [first];
  return [first, { no: `GB7-S${page}-${sec}-2`, loc: loc(2), group, type: "가장 큰 수와 가장 작은 수", prompt: `${SW(d)} (2) 만들 수 있는 원래 수 중 가장 큰 수와 가장 작은 수를 각각 구하시오.`, visual, parts: ["가장 큰 수", "가장 작은 수"] }];
});
Object.assign(L10, { title: "자릿수 바꾸어 빼기", sourceLocator: "교사용 슬라이드 57~60 · 2. 자릿수 바꾸어 빼기",
  representativeConcept: "두 자리 수와 앞뒤를 바꾼 수의 차는 두 숫자의 차에 9를 곱한 값과 같음" });
L10.story = { ...L10.story, title: "자릿수 바꾸어 빼기" };
L10.original = { ...L10.original, title: "골든벨", sourceQuestionCount: L10Specs.length, prompt: "두 자리 수에서 앞뒤 숫자를 바꾼 수와의 차를 보고 원래 수를 구하시오.", items: build(L10No, L10.id, "자릿수 바꾸어 빼기", L10Specs) };

// ── 단원 16: 수직선 위의 거리 (61~62쪽) ──
const L16No = L15No + 1;
const pt = (spec) => spec.map(([label, at]) => ({ label, at }));
const ar = (from, to, side, label, blank) => ({ from, to, side, ...(label ? { label } : {}), ...(blank ? { blank: true } : {}) });
const D = (points, arcs) => V("source-distance-arcs", { points: pt(points), arcs });
const PLACE = "원본 장소 이름(교재 회사 이름)을 「학원」으로 바꾸었습니다.";
const B1 = "활동 02 벤 다이어그램 1.";
const Q1 = "다음은 수직선 위에 장소를 나타낸 것입니다. 질문에 답하시오.";
const Q2 = "수직선 위에 점 A, B, C, D가 있습니다. 주어진 거리를 차례로 구하시오.";
const ABCD = (b, c) => [["A", 0], ["B", b], ["C", c], ["D", 100]];
const L16Specs = [
  { no: "GB7-S61-01-1", loc: `교사용 슬라이드 61 · ${B1} 01 (1)`, group: 611, type: "장소 사이의 거리", prompt: `${Q1} (1) 학원~역까지 거리는 몇 cm입니까?`, discrepancy: PLACE,
    visual: D([["집", 0], ["학원", 72], ["역", 100]], [ar("집", "역", "over", "50cm"), ar("집", "학원", "under", "36cm")]) },
  { no: "GB7-S61-01-2", loc: `교사용 슬라이드 61 · ${B1} 01 (2)`, group: 611, type: "장소 사이의 거리", prompt: `${Q1} (2) 집~슈퍼까지 거리는 몇 cm입니까?`, discrepancy: PLACE,
    visual: D([["집", 0], ["슈퍼", 16], ["학원", 72], ["역", 100]], [ar("집", "역", "over", "50cm"), ar("슈퍼", "역", "under", "42cm")]) },
  { no: "GB7-S61-01-3", loc: `교사용 슬라이드 61 · ${B1} 01 (3)`, group: 611, type: "장소 사이의 거리", prompt: `${Q1} (3) 슈퍼~학원까지 거리는 몇 cm입니까?`, discrepancy: PLACE,
    visual: D([["집", 0], ["슈퍼", 16], ["학원", 72], ["역", 100]], [ar("집", "역", "over", "50cm"), ar("집", "학원", "under", "36cm"), ar("슈퍼", "역", "under", "42cm")]) },
  { no: "GB7-S61-02-1", loc: `교사용 슬라이드 61 · ${B1} 02 (1)`, group: 612, type: "겹친 거리", prompt: `${Q2} (1) B와 C 사이의 거리`, parts: ["A-B", "B-C", "C-D"],
    visual: D(ABCD(29, 47), [ar("A", "D", "over", "17cm"), ar("A", "C", "under", "8cm"), ar("B", "D", "under", "12cm")]) },
  { no: "GB7-S61-02-2", loc: `교사용 슬라이드 61 · ${B1} 02 (2)`, group: 612, type: "겹친 거리", prompt: `${Q2} (2) B와 C 사이의 거리`, parts: ["A-B", "B-C", "C-D"],
    visual: D(ABCD(32, 48), [ar("A", "D", "over", "40cm"), ar("A", "C", "under", "19cm"), ar("B", "D", "under", "27cm")]) },
  { no: "GB7-S61-02-3", loc: `교사용 슬라이드 61 · ${B1} 02 (3)`, group: 613, type: "겹친 거리", prompt: `${Q2} (3) A와 D 사이의 거리`, parts: ["A-B", "C-D", "A-D"],
    visual: D(ABCD(33, 49), [ar("A", "C", "over", "21cm"), ar("B", "D", "over", "29cm"), ar("B", "C", "under", "7cm")]) },
  { no: "GB7-S61-02-4", loc: `교사용 슬라이드 61 · ${B1} 02 (4)`, group: 613, type: "겹친 거리", prompt: `${Q2} (4) A와 D 사이의 거리`, parts: ["A-B", "C-D", "A-D"],
    discrepancy: "원본에서 이 문항 번호가 (2)로 한 번 더 적혀 있어 차례대로 (4)로 고쳤습니다.",
    visual: D(ABCD(31, 48), [ar("A", "C", "over", "31cm"), ar("B", "D", "over", "45cm"), ar("B", "C", "under", "11cm")]) },
  { no: "GB7-S61-02-5", loc: `교사용 슬라이드 61 · ${B1} 02 (5)`, group: 614, type: "겹친 거리", prompt: `${Q2} (5) B와 C 사이의 거리`,
    visual: D(ABCD(23, 49), [ar("A", "D", "over", "47cm"), ar("A", "C", "under", "23cm"), ar("B", "D", "under", "36cm")]) },
  { no: "GB7-S61-02-6", loc: `교사용 슬라이드 61 · ${B1} 02 (6)`, group: 614, type: "겹친 거리", prompt: `${Q2} (6) A와 D 사이의 거리`,
    visual: D(ABCD(30, 45), [ar("A", "C", "over", "18cm"), ar("B", "D", "over", "28cm"), ar("B", "C", "under", "6cm")]) },
  ...[[13, 16, 4, 34, 48], [19, 17, 6, 40, 53], [29, 43, 14, 25, 50], [37, 25, 13, 52, 77]].map(([ac, bd, bc, b, c], k) => ({
    no: `GB7-S62-03-${k + 1}`, loc: `교사용 슬라이드 62 · ${B1} 03 (${k + 1})`, group: 620 + (k < 2 ? 1 : 2), type: "빈칸의 거리",
    prompt: `다음은 수직선 위의 A, B, C, D 사이의 거리를 표시한 그림입니다. 빈칸에 알맞은 수를 구하시오. (${k + 1})`,
    visual: D(ABCD(b, c), [ar("A", "D", "over", null, true), ar("B", "C", "over", String(bc)), ar("A", "C", "under", String(ac)), ar("B", "D", "under", String(bd))]) }))
];
const L16 = {
  id: "distance-line-source", unit: "벤다이어그램", title: "수직선 위의 거리", sourceLocator: "교사용 슬라이드 61~62 · 활동 02 벤 다이어그램 1.",
  sourceTypeIds: ["book07-distance-line-source"], representativeConcept: "겹치는 두 거리를 더하면 겹친 부분이 두 번 들어가므로 한 번 뺌. 전체에서 한쪽 거리를 빼면 나머지 거리",
  story: { title: "수직선 위의 거리", text: "두 길이가 가운데에서 겹치면, 두 길이를 더했을 때 겹친 부분을 두 번 세게 돼요.", mission: "겹친 부분이 어디인지 먼저 찾아보세요." },
  explanation: { headline: "A~C와 B~D를 더하면 B~C가 두 번 들어가므로 B~C를 한 번 빼면 A~D입니다.",
    steps: ["전체 길이와 부분 길이를 그림에서 찾습니다.", "전체에서 한쪽 부분을 빼면 나머지가 나옵니다.", "겹친 두 길이를 더하면 겹친 부분이 두 번 들어갑니다.", "겹친 부분을 한 번 빼서 전체를 구합니다."] },
  experience: { ...template(), family: "distance-overlap-b7", title: "겹친 길이를 한 번 빼요",
    beats: [
      { id: "distance-step-1", action: "reveal", caption: "A~C는 10cm, B~D는 12cm이고, B~C 4cm가 겹쳐 있어요.", visual: D(ABCD(33, 55), [ar("A", "C", "over", "10cm"), ar("B", "D", "under", "12cm"), ar("B", "C", "over", "4cm")]) },
      { id: "distance-step-2", action: "highlight", caption: "10 + 12를 하면 겹친 B~C 4cm를 두 번 센 것이에요.", visual: D(ABCD(33, 55), [ar("A", "C", "over", "10cm"), ar("B", "D", "under", "12cm")]) },
      { id: "distance-step-3", action: "verify", caption: "그래서 A~D는 10 + 12 - 4 = 18cm예요.", visual: D(ABCD(33, 55), [ar("A", "D", "over", "18cm")]) }
    ], hint: "겹친 부분을 두 번 세지 않았는지 보세요.",
    check: { prompt: "A~C가 9cm, B~D가 11cm, 겹친 B~C가 3cm일 때 A~D는 몇 cm일까요?", options: ["17", "20", "23"], answerRef: `/books/book-07/lessons/${L16No}/experience/check` } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L16Specs.length, structureKey: "distance-line-source", prompt: "수직선 위의 거리를 더하고 빼서 구하시오.", items: build(L16No, "distance-line-source", "수직선 위의 거리", L16Specs) },
  extension: { title: "추가 학습", structureKey: "distance-line-source", story: "겹친 두 길이로 전체 길이를 구합니다.", prompt: "A~C가 15cm, B~D가 20cm, B~C가 5cm일 때 A와 D 사이의 거리는 몇 cm입니까?",
    visual: D(ABCD(33, 50), [ar("A", "D", "over", null, true), ar("B", "C", "over", "5cm"), ar("A", "C", "under", "15cm"), ar("B", "D", "under", "20cm")]),
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-07/lessons/${L16No}/extension` }
};
book.lessons.push(L15, L16);

// ── 장부 · 보류 ──
const units = (list) => list.reduce((n, s) => n + (s.parts ? s.parts.length : 1), 0);
const all = [...L15Specs, ...L10Specs, ...L16Specs];
for (let page = 52; page <= 62; page += 1) {
  const list = all.filter((s) => Number(s.no.slice(5, 7)) === page);
  if (!list.length) throw new Error(`page ${page} empty`);
  const held = page === 52 ? 1 : 0;
  Object.assign(book.sourceCoverage.pageLedger.find((e) => e.page === page), { releasedItems: list.length, releasedAnswerUnits: units(list), heldRecords: held, heldAnswerUnits: held });
}
book.sourceHold = book.sourceHold.filter((h) => !(h.sourcePage >= 52 && h.sourcePage <= 62));
book.sourceHold.push({ id: "book07-hold-52-01-1", sourcePage: 52, sourceNo: "GB7-S52-01-1", sourceLocator: `교사용 슬라이드 52 · ${A1} 1. 대칭수 개수 구하기 01 (1)`, printGroup: 52, topic: "대칭수",
  sourceHold: { itemCount: 1, reason: "한 자리 수를 대칭수로 셀지 물음 글이 정하지 않아, 물음 글만으로는 답이 하나로 정해지지 않습니다." } });
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
console.log("book07 batch5 patched", { L15: L15Specs.length, L10: L10Specs.length, L16: L16Specs.length, units: units(all), lessonNos: [L15No, L10No, L16No], holds: book.sourceHold.length, coverage: { ...book.sourceCoverage, pageLedger: undefined } });
