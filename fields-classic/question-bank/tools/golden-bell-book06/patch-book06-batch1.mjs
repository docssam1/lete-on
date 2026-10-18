// 골든벨 6권 묶음 1: 교사용 슬라이드 2~6 「가르기·수직선·수직선과 비·수직선 활용 1·2」.
// 단원 4(가르기)·5(수직선의 거리)는 원본 문항으로 새로 짜고, 4쪽은 단원 11, 6쪽은 단원 12로 덧붙인다.
// 이 스크립트에는 정답이 없다(고르기형 보기는 공개, 정답은 비공개 DB에만). node patch-book06-batch1.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-06");
if (book.lessons.some((l) => l.id === "number-line-ratio-compare-source")) throw new Error("already patched");
const template = books.find((b) => b.id === "book-05").lessons.find((l) => l.id === "halving-tree-source").experience;
const stage = book.lessons[0].experience.learnerStage;

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
  ...JSON.parse(JSON.stringify(template)), learnerStage: stage, family, title, beats, hint, check: { ...check, answerRef: `/books/book-06/lessons/${lessonNo}/experience/check` }
});
const V = (subtype, v) => ({ kind: "book5", subtype, ...v });
const C = { circle: "#e8503a", triangle: "#2f9e5f", green: "#2f9e5f", orange: "#f39a1e", blue: "#2f6fe0", pink: "#e0559a", purple: "#8e5bd8" };

// ── 단원 4: 똑같이 가르기 (2쪽) ──
const split = (top, ways, values) => V("source-split-tree", { top, ways, ...(values ? { values } : {}) });
const WAYS = { 2: "둘", 3: "셋", 4: "넷" };
const L4No = 4;
const L4Specs = [
  ...[24, 34, 46, 56, 68, 78, 82, 92].map((top, k) => ({ no: `GB6-S02-01-${k + 1}`, loc: `교사용 슬라이드 2 활동 01 가르기 ${k + 1}`, group: k < 4 ? 1 : 2, type: "똑같이 둘로 가르기",
    prompt: `윗수를 똑같이 둘로 가르시오. (${k + 1})`, visual: split(top, 2), parts: ["가", "나"] })),
  ...[48, 72].map((top, k) => ({ no: `GB6-S02-01-${k + 9}`, loc: `교사용 슬라이드 2 활동 01 가르기 ${k + 9}`, group: 3, type: "똑같이 넷으로 가르기",
    prompt: `윗수를 똑같이 넷으로 가르시오. (${k + 9})`, visual: split(top, 4), parts: ["가", "나", "다", "라"] })),
  ...[12, 27, 42, 54].map((top, k) => ({ no: `GB6-S02-01-${k + 11}`, loc: `교사용 슬라이드 2 활동 01 가르기 ${k + 11}`, group: 4, type: "똑같이 셋으로 가르기",
    prompt: `윗수를 똑같이 셋으로 가르시오. (${k + 11})`, visual: split(top, 3), parts: ["가", "나", "다"] })),
  ...[["12", "2", "4"], ["18", "6", "2"]].map(([n, a, b], k) => ({ no: `GB6-S02-02-${k + 1}`, loc: `교사용 슬라이드 2 활동 01 곱셈식 ${k + 1}`, group: 5, type: "곱셈식의 빈칸",
    prompt: `빈칸에 알맞은 수를 쓰시오. (${k + 1})`, visual: V("source-blank-equation", { tokens: [n, "=", a, "×", null, "=", b, "×", null] }), parts: ["가", "나"] }))
];
const L4 = {
  id: "equal-share-source", unit: "수직선의 분할과 비", title: "똑같이 가르기", sourceLocator: "교사용 슬라이드 2 활동 01 가르기",
  sourceTypeIds: ["equal-share-source"], representativeConcept: "윗수를 둘·셋·넷으로 똑같이 갈라 같은 수가 몇 번 들어 있는지 알고, 곱셈식으로 나타냄",
  story: { title: "사탕 똑같이 나누기", text: "친구들이 사탕을 똑같이 나누면 모두 같은 수를 가집니다.", mission: "윗수를 똑같이 갈라 한 사람 몫을 구해 보세요." },
  explanation: { headline: "똑같이 가르면 아래 칸의 수가 모두 같고, 모두 더하면 윗수가 됩니다.",
    steps: ["몇 개로 가르는지 아래 칸의 수를 셉니다.", "십의 자리와 일의 자리를 나누어 똑같이 가릅니다.", "아래 칸의 수를 모두 더해 윗수가 되는지 확인합니다.", "같은 수가 몇 번 있는지 곱셈식으로 나타냅니다."] },
  experience: experience(L4No, "equal-share", "똑같이 갈라요", [
    { id: "equal-share-step-1", action: "reveal", caption: "40을 똑같이 둘로 가르면 20과 20입니다. 20+20=40입니다.", visual: split(40, 2, [20, 20]) },
    { id: "equal-share-step-2", action: "highlight", caption: "90을 똑같이 셋으로 가르면 30, 30, 30입니다.", visual: split(90, 3, [30, 30, 30]) },
    { id: "equal-share-step-3", action: "verify", caption: "30이 3번이므로 90 = 3 × 30입니다.", visual: V("source-blank-equation", { tokens: ["90", "=", "3", "×", "30"] }) }
  ], "십의 자리와 일의 자리를 따로 가르면 쉽습니다.", { prompt: "60을 똑같이 셋으로 가르면 한 칸은 얼마일까요?", options: ["30", "20", "15"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L4Specs.length, structureKey: "equal-share-source", prompt: "윗수를 똑같이 가르시오.", visual: split(40, 2), items: build(L4No, "equal-share-source", L4Specs) },
  extension: { title: "추가 학습", structureKey: "equal-share-source", story: "윗수를 똑같이 넷으로 가릅니다.", prompt: "96을 똑같이 넷으로 가르면 한 칸은 얼마일까요?",
    visual: split(96, 4), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-06/lessons/${L4No}/extension` }
};

// ── 단원 5: 수직선의 거리 (3·5쪽) ──
const line = (points, groups, extra = {}) => V("source-arc-line", { points, groups, ...extra });
const END_NOTE = "원본 물음 글에는 끝 수가 그림과 다르게 적혀 있어 그림의 수로 맞췄습니다.";
const L5No = 5;
const PAIR = "①은 두 끝 수 사이 전체 거리이고, ②는 똑같이 나눈 한 칸의 거리입니다. ① 거리와 ② 거리를 구하시오.";
const L5Specs = [
  { no: "GB6-S03-02-1", loc: "교사용 슬라이드 3 활동 02 수직선 1", group: 1, type: "두 수 사이의 거리", prompt: "17과 35 사이의 거리는?", discrepancy: END_NOTE,
    visual: line([17, 35], [{ n: 1, color: C.circle }]) },
  { no: "GB6-S03-02-2", loc: "교사용 슬라이드 3 활동 02 수직선 2", group: 1, type: "가운데로 나눈 한 칸", prompt: "17과 35의 한가운데에 눈금을 그었습니다. ㉠으로 표시한 한 칸의 거리는?",
    visual: line([17, 35], [{ n: 2, color: C.circle, label: "㉠" }], { tickLabels: { 1: "중간" } }) },
  { no: "GB6-S03-02-3", loc: "교사용 슬라이드 3 활동 02 수직선 3", group: 1, type: "3등분한 한 칸", prompt: "17과 35 사이의 거리를 똑같이 3칸으로 나누었습니다. ㉠으로 표시한 한 칸의 거리는?", discrepancy: END_NOTE,
    visual: line([17, 35], [{ n: 3, color: C.circle, label: "㉠" }]) },
  { no: "GB6-S03-02-4", loc: "교사용 슬라이드 3 활동 02 수직선 4 (8등분)", group: 2, type: "8등분한 한 칸", prompt: "15부터 47까지를 똑같이 8칸으로 나누었습니다. ㉠으로 표시한 한 칸의 거리는?",
    visual: line([15, 47], [{ n: 8, arcs: "first", color: C.circle, label: "㉠" }], { caption: "8등분" }) },
  { no: "GB6-S03-02-5", loc: "교사용 슬라이드 3 활동 02 수직선 5 (7등분)", group: 2, type: "7등분한 한 칸", prompt: "39부터 95까지를 똑같이 7칸으로 나누었습니다. ㉠으로 표시한 한 칸의 거리는?",
    visual: line([39, 95], [{ n: 7, arcs: "first", color: C.circle, label: "㉠" }], { caption: "7등분" }) },
  ...[[17, 33, 2], [23, 41, 3], [38, 86, 4], [26, 61, 5], [19, 43, 8]].map(([a, b, n], k) => ({ no: `GB6-S03-03-${k + 1}`, loc: `교사용 슬라이드 3 활동 02 ①·② 거리 ${k + 1}`, group: 3 + Math.floor(k / 3),
    type: "전체 거리와 한 칸의 거리", prompt: `${PAIR} (${k + 1})`, parts: ["① 거리", "② 거리"],
    visual: line([a, b], [{ n, side: "under", color: C.green, label: "②" }], { spans: [{ from: 0, to: n, side: "over", label: "①", color: C.purple }] }) })),
  { no: "GB6-S05-04-1", loc: "교사용 슬라이드 5 활동 04 수직선 활용 1 (1)", group: 5, type: "같은 칸의 거리", prompt: "○ 칸끼리, △ 칸끼리 거리가 같습니다. ○와 △는 각각 얼마일까요?", parts: ["○", "△"],
    visual: line([9, 36, 64], [{ n: 3, mark: "circle", color: C.circle }, { n: 4, mark: "triangle", color: C.triangle }]) },
  { no: "GB6-S05-04-2", loc: "교사용 슬라이드 5 활동 04 수직선 활용 1 (2)", group: 5, type: "칸 거리로 수 찾기", prompt: "○ 칸끼리, △ 칸끼리 거리가 같습니다. A와 B에 알맞은 수는?", parts: ["A", "B"],
    visual: line([22, 58, 83], [{ n: 6, mark: "circle", color: C.circle }, { n: 5, mark: "triangle", color: C.triangle }], { tickLabels: { 3: "A", 8: "B" } }) },
  ...[[[19, 43, 71], 8, 4, [5, 11]], [[28, 44, 79], 4, 5, [1, 7]]].map(([points, a, b, [s0, s1]], k) => ({ no: `GB6-S05-04-${k + 3}`, loc: `교사용 슬라이드 5 활동 04 수직선 활용 1 (${k + 3})`, group: 6,
    type: "여러 칸을 묶은 거리", prompt: `A 칸끼리, B 칸끼리 거리가 같습니다. ① 거리, ② 거리, A 한 칸의 거리, B 한 칸의 거리, ☆ 거리를 구하시오. (${k + 1})`,
    parts: ["① 거리", "② 거리", "A 거리", "B 거리", "☆ 거리"],
    visual: line(points, [{ n: a, color: C.green, label: "A" }, { n: b, color: C.orange, label: "B" }],
      { spans: [{ from: 0, to: a, side: "under", label: "①", color: C.blue }, { from: a, to: a + b, side: "under", label: "②", color: C.blue }, { from: s0, to: s1, side: "over", label: "☆", color: C.pink }] }) }))
];
const L5 = {
  id: "number-line-ratio-source", unit: "수직선의 분할과 비", title: "수직선의 거리", sourceLocator: "교사용 슬라이드 3 활동 02 수직선, 슬라이드 5 활동 04 수직선 활용 1",
  sourceTypeIds: ["number-line-ratio-source"], representativeConcept: "두 끝 수의 차로 전체 거리를 구하고, 똑같이 나눈 칸 수로 나누어 한 칸의 거리를 구한 뒤 칸을 묶어 거리를 다시 셈",
  story: { title: "정류장 사이 걷기", text: "정류장 사이를 똑같은 걸음으로 나누어 걸어갑니다.", mission: "전체 거리를 칸 수로 나누어 한 칸의 거리를 구해 보세요." },
  explanation: { headline: "큰 끝 수에서 작은 끝 수를 빼면 전체 거리이고, 칸 수로 나누면 한 칸의 거리입니다.",
    steps: ["큰 끝 수에서 작은 끝 수를 빼 전체 거리를 구합니다.", "눈금이 아니라 눈금 사이의 칸 수를 셉니다.", "전체 거리를 칸 수로 나누면 한 칸의 거리입니다.", "여러 칸을 묶은 거리는 (한 칸의 거리) × (칸 수)로 더합니다."] },
  experience: experience(L5No, "number-line-distance", "한 칸의 거리를 찾아요", [
    { id: "number-line-distance-step-1", action: "reveal", caption: "10부터 30까지의 거리는 30 - 10 = 20입니다.", visual: line([10, 30], [{ n: 1, color: C.circle }], { spans: [{ from: 0, to: 1, side: "under", label: "20", color: C.purple }] }) },
    { id: "number-line-distance-step-2", action: "highlight", caption: "20을 똑같이 4칸으로 나눕니다.", visual: line([10, 30], [{ n: 4, color: C.circle }]) },
    { id: "number-line-distance-step-3", action: "verify", caption: "20 ÷ 4 = 5이므로 한 칸의 거리는 5입니다.", visual: line([10, 30], [{ n: 4, color: C.circle, label: "5" }]) }
  ], "눈금이 아니라 칸의 수를 셉니다.", { prompt: "20부터 44까지를 똑같이 6칸으로 나누면 한 칸의 거리는 얼마일까요?", options: ["6", "4", "24"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L5Specs.length, structureKey: "number-line-ratio-source", prompt: "수직선을 보고 거리를 구하시오.", visual: line([10, 30], [{ n: 4, color: C.circle }]), items: build(L5No, "number-line-ratio-source", L5Specs) },
  extension: { title: "추가 학습", structureKey: "number-line-ratio-source", story: "두 끝 수 사이를 똑같이 나눕니다.", prompt: "13부터 58까지를 똑같이 5칸으로 나누면 한 칸의 거리는 얼마일까요?",
    visual: line([13, 58], [{ n: 5, color: C.circle }]), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-06/lessons/${L5No}/extension` }
};

// ── 단원 11: 수직선과 비 (4쪽) ──
const L11No = book.lessons.length, L12No = L11No + 1;
const ratio = (start, end, a, b) => V("source-ratio-lines", { start, end, a, b });
const NEXT_NOTE = "원본 표에는 빈칸이 없고, 교사 안내(다음에 올 비를 규칙으로 찾기)에 따라 다음 줄을 빈칸으로 넣었습니다.";
const ratioTable = (rows, blank = true) => V("source-text-table", { cells: [["A (앞 수)", "B (뒤 수)"], ...rows.map(([a, b]) => [String(a), String(b)]), ...(blank ? [["가", "나"]] : [])] });
const L11Specs = [
  ...[[9, 15, 2, 3], [9, 21, 2, 3], [17, 32, 3, 5], [21, 51, 3, 5]].map(([s, e, a, b], k) => ({ no: `GB6-S04-03-${k + 1}`, loc: `교사용 슬라이드 4 활동 03 수직선과 비 ${k + 1}`, group: 1 + Math.floor(k / 2),
    type: "같은 길이를 다르게 나누기", prompt: `같은 길이를 위는 A 칸으로, 아래는 B 칸으로 똑같이 나누었습니다. 총 길이, A 한 칸의 길이, B 한 칸의 길이를 구하시오. (${k + 1})`,
    parts: ["총 길이", "A의 길이", "B의 길이"], visual: ratio(s, e, a, b) })),
  ...[[2, 1], [3, 2], [4, 3], [5, 3]].map(([a, b], k) => ({ no: `GB6-S04-04-${k + 1}`, loc: `교사용 슬라이드 4 비 뻥튀기 연습 ${k + 1}열`, group: 3, type: "같은 비 늘어놓기",
    prompt: `같은 비를 규칙에 따라 차례로 늘어놓았습니다. 다음에 올 비 가 : 나를 구하시오. (${k + 1})`, parts: ["가", "나"],
    visual: ratioTable([1, 2, 3, 4, 5].map((m) => [a * m, b * m])), ...(k === 0 ? { discrepancy: NEXT_NOTE } : {}) }))
];
const L11 = {
  id: "number-line-ratio-compare-source", unit: "수직선의 분할과 비", title: "수직선과 비", sourceLocator: "교사용 슬라이드 4 활동 03 수직선과 비·비 뻥튀기 연습",
  sourceTypeIds: ["number-line-ratio-compare-source"], representativeConcept: "같은 길이를 서로 다른 칸 수로 나누어 두 칸의 길이를 비교하고, 앞 수와 뒤 수에 같은 수를 곱한 비가 같은 비임을 앎",
  story: { title: "같은 길을 다른 걸음으로", text: "형은 큰 걸음으로, 동생은 작은 걸음으로 같은 길을 걸어갑니다.", mission: "같은 길이를 몇 칸으로 나누었는지 보고 한 칸의 길이를 비교해 보세요." },
  explanation: { headline: "같은 길이를 적게 나눈 쪽이 한 칸이 더 깁니다. 앞 수와 뒤 수에 같은 수를 곱하면 같은 비입니다.",
    steps: ["두 끝 수의 차로 총 길이를 구합니다.", "총 길이를 위 칸 수로 나누면 A, 아래 칸 수로 나누면 B입니다.", "A와 B를 비교한 것을 A : B로 씁니다.", "앞 수와 뒤 수에 같은 수를 곱하거나 나누어도 같은 비입니다."] },
  experience: experience(L11No, "number-line-ratio", "같은 길이를 나눠 비교해요", [
    { id: "number-line-ratio-step-1", action: "reveal", caption: "4부터 28까지 총 길이는 28 - 4 = 24입니다.", visual: ratio(4, 28, 2, 3) },
    { id: "number-line-ratio-step-2", action: "highlight", caption: "위는 2칸이라 A = 24 ÷ 2 = 12, 아래는 3칸이라 B = 24 ÷ 3 = 8입니다.", visual: ratio(4, 28, 2, 3) },
    { id: "number-line-ratio-step-3", action: "verify", caption: "A : B = 12 : 8이고, 4로 나누면 3 : 2와 같은 비입니다.", visual: ratioTable([[3, 2], [6, 4], [9, 6], [12, 8]], false) }
  ], "같은 길이를 적게 나눌수록 한 칸이 깁니다.", { prompt: "길이 18을 위는 2칸, 아래는 3칸으로 똑같이 나누면 A 한 칸의 길이는 얼마일까요?", options: ["9", "6", "3"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L11Specs.length, structureKey: "number-line-ratio-compare-source", prompt: "같은 길이를 다르게 나누어 비교하시오.", visual: ratio(4, 28, 2, 3), items: build(L11No, "number-line-ratio-compare-source", L11Specs) },
  extension: { title: "추가 학습", structureKey: "number-line-ratio-compare-source", story: "7 : 4와 같은 비를 차례로 늘어놓습니다.", prompt: "7 : 4와 같은 비 가운데 뒤 수가 20인 비의 앞 수는 얼마일까요?",
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-06/lessons/${L11No}/extension` }
};

// ── 단원 12: 연필 길이와 잰 횟수 (6쪽) ──
const pencil = (a, b) => V("source-pencil-bars", { head: "pencil", rows: [{ n: a, label: "A", color: "#dcf5e5" }, { n: b, label: "B", color: "#ffe9cc" }], diff: true });
const SET_NOTE = "원본 오른쪽 칸은 교사가 연필 길이를 정해 주는 연습이라, 화면에서는 연필 길이를 물음에 적었습니다.";
const SHORT = "길이가 모두 1cm, 2cm, 3cm처럼 cm로 딱 떨어지고 연필이 가장 짧을 때, 연필·A·B·C의 길이를 구하시오. (단위 cm)";
const pencilSpecs = [[2, 3, 12], [3, 4, 24], [3, 5, 30]].flatMap(([a, b, given], k) => [
  { no: `GB6-S06-05-${k * 2 + 1}`, loc: `교사용 슬라이드 6 활동 05 연필 ${k + 1} 가장 짧을 때`, group: 1 + k, type: "가장 짧은 연필 길이",
    prompt: `연필의 길이는 A ${a}개를 이은 길이, B ${b}개를 이은 길이와 같습니다. C는 A와 B의 길이 차이입니다. ${SHORT}`, parts: ["연필", "A", "B", "C"], visual: pencil(a, b) },
  { no: `GB6-S06-05-${k * 2 + 2}`, loc: `교사용 슬라이드 6 활동 05 연필 ${k + 1} 길이를 정했을 때`, group: 1 + k, type: "정한 연필 길이",
    prompt: `연필의 길이는 A ${a}개, B ${b}개를 이은 길이와 같고, C는 A와 B의 길이 차이입니다. 연필의 길이가 ${given}cm일 때 A, B, C의 길이를 구하시오. (단위 cm)`, parts: ["A", "B", "C"], visual: pencil(a, b),
    ...(k === 0 ? { discrepancy: SET_NOTE } : {}) }
]);
const WORD = [
  "망치의 길이는 길이가 5cm인 못으로 4번 잰 것과 같습니다. 같은 망치의 길이는 길이가 4cm인 못으로 몇 번 잰 것과 같습니까?",
  "화분의 높이는 길이가 8cm인 색연필로 5번 잰 것과 같습니다. 같은 화분의 높이는 길이가 10cm인 가위로 몇 번 잰 것과 같습니까?",
  "그림처럼 리코더의 길이는 딱풀 5개를 이은 길이와 같습니다. 리코더로 3번 잰 밧줄의 길이는 딱풀로 몇 번 잰 길이와 같습니까?",
  "민준이가 팔 길이로 목도리의 긴 쪽 길이를 재었더니 3번이었습니다. 목도리의 긴 쪽의 길이가 90cm라면 민준이의 팔 길이는 몇 cm입니까?",
  "식탁의 높이를 티스푼으로 재면 8번이고, 주걱으로 재면 4번입니다. 주걱의 길이는 티스푼으로 몇 번 잰 것과 같습니까?",
  "잠자리채의 길이를 크레파스로 재면 18번이고, 머리빗의 길이를 크레파스로 재면 3번입니다. 머리빗의 길이가 11cm일 때 잠자리채의 길이는 몇 cm입니까?"
];
const L12Specs = [
  ...pencilSpecs,
  ...WORD.map((prompt, k) => ({ no: `GB6-S06-06-${k + 1}`, loc: `교사용 슬라이드 6 활동 05 문장제 ${k + 1}`, group: 4 + Math.floor(k / 3), type: "잰 횟수와 길이", prompt,
    ...(k === 2 ? { visual: V("source-pencil-bars", { head: "recorder", rows: [{ n: 5, label: "딱풀", color: "#fff3c4" }] }) } : {}) }))
];
const L12 = {
  id: "pencil-measure-source", unit: "수직선의 분할과 비", title: "막대로 길이 재기", sourceLocator: "교사용 슬라이드 6 활동 05 수직선 활용 2",
  sourceTypeIds: ["pencil-measure-source"], representativeConcept: "같은 길이를 서로 다른 막대로 잴 때 막대 길이와 잰 횟수의 곱이 같음을 이용해 길이와 횟수를 구함",
  story: { title: "무엇으로 잴까?", text: "같은 연필을 긴 막대로 재면 조금, 짧은 막대로 재면 여러 번 잽니다.", mission: "(막대 길이) × (잰 횟수)가 같다는 것을 이용해 보세요." },
  explanation: { headline: "같은 길이를 재면 (막대 길이) × (잰 횟수)가 늘 같습니다.",
    steps: ["먼저 전체 길이를 (막대 길이) × (잰 횟수)로 구합니다.", "다른 막대로 나누면 몇 번 재는지 알 수 있습니다.", "A 2개 = B 3개처럼 같으면, 전체 길이는 2단에도 3단에도 나오는 수입니다.", "C는 A와 B의 길이 차이입니다."] },
  experience: experience(L12No, "pencil-measure", "막대로 재 봐요", [
    { id: "pencil-measure-step-1", action: "reveal", caption: "연필의 길이가 18cm이고 A 2개, B 3개를 이은 길이와 같습니다.", visual: pencil(2, 3) },
    { id: "pencil-measure-step-2", action: "highlight", caption: "A = 18 ÷ 2 = 9cm, B = 18 ÷ 3 = 6cm입니다.", visual: pencil(2, 3) },
    { id: "pencil-measure-step-3", action: "verify", caption: "C는 A와 B의 차이이므로 9 - 6 = 3cm입니다.", visual: pencil(2, 3) }
  ], "전체 길이부터 구하면 쉽습니다.", { prompt: "책상 길이는 20cm 자로 3번 잰 것과 같습니다. 같은 책상을 10cm 막대로 재면 몇 번일까요?", options: ["6", "5", "2"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L12Specs.length, structureKey: "pencil-measure-source", prompt: "막대로 잰 횟수와 길이를 구하시오.", visual: pencil(2, 3), items: build(L12No, "pencil-measure-source", L12Specs) },
  extension: { title: "추가 학습", structureKey: "pencil-measure-source", story: "같은 길이를 다른 막대로 잽니다.", prompt: "책상 길이는 30cm 자로 4번 잰 것과 같습니다. 같은 책상을 20cm 막대로 재면 몇 번일까요?",
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-06/lessons/${L12No}/extension` }
};

book.lessons[L4No] = L4;
book.lessons[L5No] = L5;
book.lessons.push(L11, L12);

const cleared = new Set(["B06-03-03", "B06-06-01"]);
const before = book.sourceHold.length;
book.sourceHold = book.sourceHold.filter((hold) => !cleared.has(hold.sourceNo));
if (before - book.sourceHold.length !== 2) throw new Error(`hold count ${before - book.sourceHold.length}`);
const released = { 2: L4Specs.length, 3: L5Specs.filter((s) => s.no.startsWith("GB6-S03")).length, 4: L11Specs.length, 5: L5Specs.filter((s) => s.no.startsWith("GB6-S05")).length, 6: L12Specs.length };
for (const entry of book.sourceCoverage) {
  const page = entry.pages[0];
  if (released[page] != null) Object.assign(entry, { status: "implemented", releasedCount: released[page], holdCount: 0 });
}

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book06 batch1 patched", { L4: L4.original.items.length, L5: L5.original.items.length, L11: L11.original.items.length, L12: L12.original.items.length, lessonNos: [L4No, L5No, L11No, L12No], holds: book.sourceHold.length, released });
