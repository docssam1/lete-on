// 골든벨 8권 묶음 5(마지막): 교사용 슬라이드 31~39 「활동 01 거꾸로 생각하기 · 활동 02 그림 그려 해결하기」.
// 단원 6(31쪽 거꾸로 풀기 4)을 원본대로 다시 짜고, 새 단원 13(32~34쪽 가지고 있는 만큼 주기 6) · 14(35~36쪽 분수 12) ·
// 15(37~39쪽 그림을 이용해 거꾸로 풀기 · 차를 이용해 전체 구하기 10)를 단원 6 뒤에 둔다. 물음 글의 분수는 {분자/분모}(쌓은 분수로 그려짐).
// 31쪽 (3)의 마지막 수는 답 없는 문제지(필기삭제본)에서 지워져 있었으나 교사용에는 검정 인쇄 글자로 있어 그 수를 쓴다.
// 이 스크립트에는 정답이 없다. node patch-book08-batch5.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-08");
if (book.lessons.some((l) => l.id === "give-same-source")) throw new Error("already patched");
const lesson = (id) => book.lessons.find((l) => l.id === id);
const numberOf = (l) => Number(l.extension.answerRef.match(/lessons\/(\d+)\//)[1]);
const L6 = lesson("reverse-operation-chain");
if (numberOf(L6) !== 6) throw new Error("unexpected lesson number");
for (const n of [13, 14, 15]) if (book.lessons.some((l) => numberOf(l) === n)) throw new Error(`lesson number ${n} taken`);

const withParts = (item, labels) => ({ ...item, parts: labels.map((label, k) => ({ id: String.fromCharCode(97 + k), label, answerRef: `${item.answerRef}/parts/${k}` })) });
const build = (lessonNo, lessonId, topic, specs) => specs.map((spec, k) => {
  let item = { id: `book08-src-${spec.no.slice(4).toLowerCase()}`, sourcePage: Number(spec.no.slice(5, 7)), sourceNo: spec.no, lessonId, topic,
    typeLabel: spec.type, sourceLocator: spec.loc, printGroup: spec.group, answerMode: "input", inputMode: spec.fraction ? "fraction" : "numeric", prompt: spec.prompt,
    answerRef: `/books/book-08/lessons/${lessonNo}/original/items/${k}` };
  if (spec.visual) item.visual = spec.visual; else item.noVisual = true;
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  if (spec.parts) { item = withParts(item, spec.parts); delete item.answerMode; delete item.inputMode; }
  return item;
});
const V = (subtype, v) => ({ kind: "book5", subtype, ...v });
const NOTE = (lines) => V("source-note-box", { lines });
const chain = (nodes, ops) => V("source-op-chain", { nodes, ops });
const bar = (parts, extra = {}) => V("source-frac-bar", { parts, ...extra });
const disc = (pieces, shaded) => V("source-fraction-discs", { discs: [{ pieces, shaded }], fractions: false, caption: false });
// 식이 줄 끝에서 □와 기호 사이로 끊기지 않게 식 안의 빈칸을 줄바꿈 없는 빈칸으로.
const keep = (eq) => eq.replace(/ /g, "\u00a0");
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, k) => a + k);
const template = () => JSON.parse(JSON.stringify(lesson("bundle-number-source").experience));
const A1 = "활동 01 거꾸로 생각하기", A2 = "활동 02 그림 그려 해결하기";
const loc = (page, act, sec, n) => `교사용 슬라이드 ${page} · ${act} ${sec} (${n})`;

// ── 단원 6: 거꾸로 풀기 (31쪽) ──
const L6Specs = [
  { no: "GB8-S31-01-1", loc: loc(31, A1, "1. 거꾸로 풀기", 1), group: 311, type: "식을 거꾸로 풀기", prompt: `다음 식에서 □에 알맞은 수를 구하시오. ${keep("□ + 6 − 2 = 10")}` },
  { no: "GB8-S31-01-2", loc: loc(31, A1, "1. 거꾸로 풀기", 2), group: 311, type: "식을 거꾸로 풀기", prompt: `다음 식에서 □에 알맞은 수를 구하시오. ${keep("□ + 2 − 5 + 9 − 7 = 17")}` },
  { no: "GB8-S31-01-3", loc: loc(31, A1, "1. 거꾸로 풀기", 3), group: 312, type: "계산 사슬을 거꾸로", prompt: "화살표를 따라 차례로 계산했습니다. □에 알맞은 수를 구하시오.", visual: chain(["□", null, null, "4"], ["×5", "−4", "÷9"]) },
  { no: "GB8-S31-01-4", loc: loc(31, A1, "1. 거꾸로 풀기", 4), group: 312, type: "계산 사슬을 거꾸로", prompt: "화살표를 따라 차례로 계산했습니다. □에 알맞은 수를 구하시오.", visual: chain(["□", null, null, null, "3"], ["−5", "×3", "+6", "÷9"]) }
];
Object.assign(L6, { title: "거꾸로 풀기", sourceLocator: `교사용 슬라이드 31 · ${A1} 1. 거꾸로 풀기`,
  story: { ...L6.story, title: "거꾸로 풀기", text: "마지막 수에서 출발해 계산을 하나씩 되돌리면 처음 수가 나와요." } });
L6.original = { ...L6.original, title: "골든벨", mode: "paged", sourceQuestionCount: L6Specs.length, prompt: "마지막 수에서 거꾸로 계산하시오.", items: build(6, L6.id, "거꾸로 풀기", L6Specs) };
delete L6.original.visual;
L6.experience = { ...L6.experience, visualProgression: null,
  beats: [
    { id: "reverse-operation-chain-step-1", action: "reveal", caption: "□에 3을 더하고 2를 곱했더니 14가 되었어요. 마지막 수 14에서 출발해요.", visual: chain(["□", null, "14"], ["+3", "×2"]) },
    { id: "reverse-operation-chain-step-2", action: "highlight", caption: "마지막 계산부터 되돌려요. ×2는 ÷2로, +3은 −3으로 바꿔요.", visual: NOTE(["14 ÷ 2 = 7", "7 − 3 = 4"]) },
    { id: "reverse-operation-chain-step-3", action: "verify", caption: "처음 수 4를 다시 넣어 봐요. 4 + 3 = 7, 7 × 2 = 14로 맞아요.", visual: NOTE(["4 + 3 = 7", "7 × 2 = 14"]) }
  ] };

// ── 새 단원 13: 가지고 있는 만큼 주기 (32~34쪽) ──
const GIVE = "A가 B에게 B가 가지고 있던 구슬의 개수 만큼 주었습니다.";
const EACH = "원본 「두 사람은 모두 ○개의 구슬을 가지게 되었습니다」는 두 사람의 합으로도 읽혀 처음 개수가 하나로 정해지지 않으므로, 34쪽 (5)·(6)과 같은 「두 사람 모두 각각 ○개씩」으로 고쳤습니다.";
const L13Specs = [
  { no: "GB8-S32-02-1", loc: loc(32, A1, "2. 가지고 있는 만큼 주기", 1), group: 321, type: "가진 만큼 주고 난 뒤", parts: ["A", "B"],
    prompt: "구슬을 A는 10개, B는 7개 가지고 있었다. A가 B에게 B가 가지고 있는 개수 만큼 구슬을 주면 A와 B가 가지고 있는 구슬의 개수는 각각 얼마인가?" },
  { no: "GB8-S32-02-2", loc: loc(32, A1, "2. 가지고 있는 만큼 주기", 2), group: 321, type: "가진 만큼 주기 거꾸로", prompt: "A가 B에게 B가 가지고 있던 구슬의 개수 만큼 주었더니 두 사람 모두 각각 12개씩 가지게 되었습니다. A가 처음에 가지고 있던 구슬의 개수는 몇 개일까?", discrepancy: EACH },
  ...[[3, 33, 7], [4, 33, 19]].map(([n, page, t]) => ({ no: `GB8-S${page}-02-${n}`, loc: loc(page, A1, "2. 가지고 있는 만큼 주기", n), group: 331, type: "두 번 주고받기 거꾸로",
    prompt: `${GIVE} 다시 B가 A에게 구슬 3개를 주었더니 두 사람 모두 각각 ${t}개씩 가지게 되었습니다. A가 처음에 가지고 있던 구슬의 개수는 몇 개일까?`, discrepancy: EACH })),
  ...[[5, 12], [6, 28]].map(([n, t]) => ({ no: `GB8-S34-02-${n}`, loc: loc(34, A1, "2. 가지고 있는 만큼 주기", n), group: 341, type: "서로 가진 만큼 주기 거꾸로",
    prompt: `${GIVE} 다시 B가 A에게 A가 가지고 있던 구슬의 개수 만큼 주었더니 두 사람 모두 각각 ${t}개씩 가지게 되었습니다. A가 처음에 가지고 있던 구슬의 개수는 몇 개일까?` }))
];
const L13 = {
  id: "give-same-source", unit: "거꾸로 생각하기", title: "가지고 있는 만큼 주기", sourceLocator: `교사용 슬라이드 32~34 · ${A1} 2. 가지고 있는 만큼 주기`, sourceTypeIds: ["book08-give-same-source"],
  representativeConcept: "가진 만큼 받으면 받은 사람의 수는 2배가 되므로, 거꾸로 갈 때는 받은 사람의 수를 반으로 나누고 준 사람에게 그만큼 돌려줌",
  story: { title: "가지고 있는 만큼 주기", text: "B가 가진 만큼 A가 주면 B의 구슬은 두 배가 돼요.", mission: "마지막 상태에서 한 단계씩 표를 거꾸로 채워 보세요." },
  explanation: { headline: "받은 사람은 2배가 됩니다. 거꾸로 갈 때는 받은 사람의 수를 반으로 나누고, 그 반을 준 사람에게 돌려줍니다.",
    steps: ["표에 「나중」 줄부터 씁니다.", "가진 만큼 받은 사람은 2배가 되었으니 반으로 나눕니다.", "나눈 반만큼을 준 사람에게 더해 줍니다.", "두 사람의 합은 처음과 나중이 같은지 확인합니다."] },
  experience: { ...template(), family: "give-same-b8", title: "받은 사람은 두 배",
    beats: [
      { id: "give-same-step-1", action: "reveal", caption: "A는 8개, B는 3개 있어요. A가 B에게 B가 가진 만큼(3개) 줘요.", visual: NOTE(["처음: A 8개, B 3개", "A → B 3개"]) },
      { id: "give-same-step-2", action: "highlight", caption: "A는 8 − 3 = 5개, B는 3 + 3 = 6개가 돼요. 받은 B는 두 배가 됐어요.", visual: NOTE(["나중: A 5개, B 6개", "B: 3 → 6 (두 배)"]) },
      { id: "give-same-step-3", action: "verify", caption: "거꾸로 가려면 B의 6을 반으로 나눠 3, 그 3을 A에게 돌려주면 처음 8과 3이 나와요.", visual: NOTE(["6 ÷ 2 = 3", "5 + 3 = 8"]) }
    ], hint: "받은 사람의 수를 반으로 나누세요.",
    check: { prompt: "A가 B에게 B가 가진 만큼 주었더니 B가 10개가 되었습니다. B는 처음에 몇 개였을까요?", options: ["5", "10", "20"], answerRef: "/books/book-08/lessons/13/experience/check" } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L13Specs.length, structureKey: "give-same-source", prompt: "주고받은 순서를 거꾸로 따라가 처음 개수를 구하시오.", items: build(13, "give-same-source", "가지고 있는 만큼 주기", L13Specs) },
  extension: { title: "추가 학습", structureKey: "give-same-source", story: "가진 만큼 주고 난 뒤의 개수를 구합니다.", prompt: "구슬을 A는 12개, B는 5개 가지고 있었다. A가 B에게 B가 가지고 있는 개수 만큼 구슬을 주면 A가 가지고 있는 구슬은 몇 개인가?",
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-08/lessons/13/extension" }
};
delete L13.experience.visualProgression;

// ── 새 단원 14: 분수 (35~36쪽) ──
const COUNT = "그림을 이용하여 개수를 구하시오.";
const RENUM = "원본에서 이 줄의 문항 번호가 (1), (2)로 다시 나와 이어지는 번호 (3), (4)로 고쳤습니다.";
const L14Specs = [
  { no: "GB8-S35-01-1", loc: `교사용 슬라이드 35 · ${A2} 1. 분수 · 색칠한 부분 분수로 나타내기 (1)`, group: 351, type: "색칠한 부분을 분수로", prompt: "색칠한 부분을 분수로 나타내시오.", visual: disc(3, 2), fraction: true },
  { no: "GB8-S35-01-2", loc: `교사용 슬라이드 35 · ${A2} 1. 분수 · 색칠한 부분 분수로 나타내기 (2)`, group: 351, type: "색칠한 부분을 분수로", prompt: "색칠한 부분을 분수로 나타내시오.", visual: disc(8, 5), fraction: true },
  ...[[6, 1, 3, 1, "은"], [16, 1, 4, 2, "은"], [12, 3, 4, 3, "은"], [18, 5, 6, 4, "는"]].map(([n, a, b, k, j]) => ({
    no: `GB8-S35-02-${k}`, loc: `교사용 슬라이드 35 · ${A2} 1. 분수 · 그림을 이용하여 개수 구하기 (${k})`, group: 352, type: "전체의 몇 분의 몇", prompt: `${COUNT} ${n}개의 {${a}/${b}}${j}?`,
    visual: disc(b, a), ...(k >= 3 ? { discrepancy: RENUM } : {}) })),
  ...[[5, "24개의 {1/4}은?", bar(4, { shaded: [0] })], [6, "24개의 {1/8}은?", bar(8, { shaded: [0] })], [7, "귤 16개의 {3/8}은?", bar(8, { shaded: [0, 1, 2] })],
    [8, "귤 20개의 {1/4}을 먹고 남은 개수는?", bar(4, { crossed: [0], below: { from: 1, to: 3 } })], [9, "귤 24개의 {5/6}를 먹고 남은 개수는?", bar(6, { crossed: range(0, 4), below: { from: 5, to: 5 } })],
    [10, "귤 14개의 {4/7}를 먹고 남은 개수는?", bar(7, { crossed: range(0, 3), below: { from: 4, to: 6 } })]].map(([k, q, visual]) => ({
    no: `GB8-S36-02-${k}`, loc: `교사용 슬라이드 36 · ${A2} 1. 분수 · 그림을 이용하여 개수 구하기 (${k})`, group: k <= 7 ? 361 : 362, type: /남은/.test(q) ? "먹고 남은 개수" : "전체의 몇 분의 몇", prompt: `${COUNT} ${q}`, visual }))
];
const L14 = {
  id: "fraction-picture-source", unit: "거꾸로 생각하기", title: "분수", sourceLocator: `교사용 슬라이드 35~36 · ${A2} 1. 분수`, sourceTypeIds: ["book08-fraction-picture-source"],
  representativeConcept: "전체를 분모만큼 똑같이 나누면 한 칸의 개수가 나오고, 분자만큼의 칸을 세면 그 분수만큼의 개수가 됨",
  story: { title: "분수", text: "전체를 똑같이 나눈 것 중 몇 칸인지를 분수로 나타내요.", mission: "전체를 몇 칸으로 똑같이 나누었는지부터 세어 보세요." },
  explanation: { headline: "전체를 분모만큼 똑같이 나누어 한 칸의 개수를 구한 뒤, 분자만큼 칸을 셉니다.",
    steps: ["전체를 분모만큼 똑같이 나눕니다.", "전체 개수를 분모로 나누면 한 칸의 개수입니다.", "분자만큼의 칸을 세면 그 분수만큼의 개수입니다.", "먹고 남은 개수는 지운 칸을 뺀 나머지 칸의 개수입니다."] },
  experience: { ...template(), family: "fraction-picture-b8", title: "한 칸이 몇 개인지부터",
    beats: [
      { id: "fraction-picture-step-1", action: "reveal", caption: "귤 12개를 똑같이 4칸으로 나누어요.", visual: bar(4) },
      { id: "fraction-picture-step-2", action: "highlight", caption: "12 ÷ 4 = 3이니 한 칸은 3개예요. 4칸 중 1칸은 3개예요.", visual: bar(4, { shaded: [0] }) },
      { id: "fraction-picture-step-3", action: "verify", caption: "4칸 중 3칸은 3 × 3 = 9개예요. 1칸을 먹으면 남은 3칸이 9개예요.", visual: bar(4, { crossed: [0], below: { from: 1, to: 3 } }) }
    ], hint: "한 칸이 몇 개인지부터 구하세요.",
    check: { prompt: "8개를 똑같이 2칸으로 나누면 한 칸은 몇 개일까요?", options: ["4", "2", "6"], answerRef: "/books/book-08/lessons/14/experience/check" } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L14Specs.length, structureKey: "fraction-picture-source", prompt: "그림을 이용하여 분수만큼의 개수를 구하시오.", items: build(14, "fraction-picture-source", "분수", L14Specs) },
  extension: { title: "추가 학습", structureKey: "fraction-picture-source", story: "똑같이 나눈 묶음을 셉니다.", prompt: "구슬 15개를 똑같이 3묶음으로 나눈 것 중 2묶음은 몇 개입니까?", visual: bar(3, { shaded: [0, 1] }),
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-08/lessons/14/extension" }
};
delete L14.experience.visualProgression;

// ── 새 단원 15: 그림을 이용해 거꾸로 풀기 · 차를 이용해 전체 구하기 (37~39쪽) ──
const L15Specs = [
  ...[[1, "{1/3}을", 6, 3], [2, "{1/4}을", 18, 4], [3, "{2/5}를", 12, 5]].map(([k, f, left, n]) => ({ no: `GB8-S37-02-${k}`, loc: loc(37, A2, "2. 그림을 이용해 거꾸로 풀기", k), group: 371, type: "준 뒤 남은 수로 처음 수",
    prompt: `A가 가지고 있던 구슬의 ${f} B에게 주었더니 ${left}개가 남았습니다. A가 처음에 가지고 있던 구슬의 개수는?`, visual: bar(n) })),
  { no: "GB8-S38-02-4", loc: loc(38, A2, "2. 그림을 이용해 거꾸로 풀기", 4), group: 381, type: "두 번 덜어 낸 뒤 처음 수", prompt: "A가 가지고 있던 귤의 {1/2}을 먹고, 나머지의 {1/2}을 친구에게 주었더니 5개가 남았습니다. A가 처음에 가지고 있던 귤의 개수는 몇 개일까요?", visual: bar(2, { sub: { from: 1, to: 1, parts: 2 } }) },
  { no: "GB8-S38-02-5", loc: loc(38, A2, "2. 그림을 이용해 거꾸로 풀기", 5), group: 381, type: "두 번 덜어 낸 뒤 처음 수", prompt: "A가 가지고 있던 리본의 {2/3}를 미술시간에 사용하고 나머지의 {1/2}을 친구에게 주었더니 남은 리본의 길이가 6cm였습니다. 처음 A가 가지고 있던 리본의 길이는 몇 cm입니까?", visual: bar(3, { sub: { from: 2, to: 2, parts: 2 } }),
    discrepancy: "원본 물음 「처음 A가 가지고 있던 리본의 길이는?」에 답의 단위가 드러나도록 「몇 cm입니까?」를 붙였습니다." },
  { no: "GB8-S38-02-6", loc: loc(38, A2, "2. 그림을 이용해 거꾸로 풀기", 6), group: 381, type: "두 번 덜어 낸 뒤 처음 수", prompt: "엄마가 사오신 귤을 형이 전체의 {1/2}을 먹고 나머지의 {1/3}을 동생이 먹었습니다. 남은 귤이 4개라면 처음 엄마가 사오신 귤의 개수는?", visual: bar(2, { sub: { from: 1, to: 1, parts: 3 } }) },
  { no: "GB8-S39-03-1", loc: loc(39, A2, "3. 차를 이용해 전체 구하기", 1), group: 391, type: "전체와 분수로 차 구하기", prompt: "A네 학교 반 아이들은 모두 30명입니다. 이 중 여학생이 전체의 {3/5}이라면 여학생은 남학생보다 몇 명 더 많습니까?", visual: bar(5) },
  { no: "GB8-S39-03-2", loc: loc(39, A2, "3. 차를 이용해 전체 구하기", 2), group: 391, type: "전체와 분수로 차 구하기", prompt: "25의 {3/5}은 25의 {1/5}보다 얼마만큼 더 큽니까?", visual: bar(5) },
  { no: "GB8-S39-03-3", loc: loc(39, A2, "3. 차를 이용해 전체 구하기", 3), group: 392, type: "차로 전체 구하기", prompt: "어떤 학교 반 남학생은 반 전체의 {4/7}입니다. 남학생이 여학생보다 4명 더 많다면 반 학생은 모두 몇 명일까요?", visual: bar(7, { slash: [5, 6] }) },
  { no: "GB8-S39-03-4", loc: loc(39, A2, "3. 차를 이용해 전체 구하기", 4), group: 392, type: "차로 전체 구하기", prompt: "어떤 수의 {3/7}은 어떤 수의 {1/7}보다 8만큼 더 큽니다. 어떤 수는 얼마일까요?", visual: bar(7, { slash: [0] }) }
];
const L15 = {
  id: "fraction-reverse-source", unit: "거꾸로 생각하기", title: "그림을 이용해 거꾸로 풀기", sourceLocator: `교사용 슬라이드 37~39 · ${A2} 2. 그림을 이용해 거꾸로 풀기 · 3. 차를 이용해 전체 구하기`, sourceTypeIds: ["book08-fraction-reverse-source"],
  representativeConcept: "띠를 분모만큼 나누어 남은 칸(또는 차가 나는 칸)이 몇 개인지 보고 한 칸의 크기를 구한 뒤 전체 칸 수를 곱함",
  story: { title: "그림을 이용해 거꾸로 풀기", text: "띠를 똑같이 나누어 그리면 남은 부분이 몇 칸인지 한눈에 보여요.", mission: "남은 칸(또는 차가 나는 칸)이 몇 칸인지 세어 보세요." },
  explanation: { headline: "남은 부분(또는 차)이 몇 칸인지 세어 한 칸의 크기를 구하고, 전체 칸 수를 곱합니다.",
    steps: ["전체를 띠로 그리고 분모만큼 똑같이 나눕니다.", "준 부분(먹은 부분)을 지우고 남은 칸을 셉니다.", "남은 수를 남은 칸 수로 나누면 한 칸의 크기입니다.", "나머지의 몇 분의 몇은 남은 부분을 다시 나누어 그립니다."] },
  experience: { ...template(), family: "fraction-reverse-b8", title: "남은 칸으로 한 칸을 구해요",
    beats: [
      { id: "fraction-reverse-step-1", action: "reveal", caption: "구슬을 똑같이 3칸으로 나누어 1칸을 주었더니 8개가 남았어요.", visual: bar(3, { crossed: [0], below: { from: 1, to: 2 } }) },
      { id: "fraction-reverse-step-2", action: "highlight", caption: "남은 것은 2칸이고 8개예요. 8 ÷ 2 = 4이니 한 칸은 4개예요.", visual: NOTE(["2칸 = 8개", "1칸 = 4개"]) },
      { id: "fraction-reverse-step-3", action: "verify", caption: "전체 3칸은 4 × 3 = 12개예요. 12개에서 1칸(4개)을 주면 8개가 남아요.", visual: NOTE(["3칸 = 12개", "12 − 4 = 8"]) }
    ], hint: "남은 칸이 몇 칸인지 세세요.",
    check: { prompt: "구슬을 똑같이 4칸으로 나누어 1칸을 주었더니 9개가 남았습니다. 처음 구슬은 몇 개일까요?", options: ["12", "9", "36"], answerRef: "/books/book-08/lessons/15/experience/check" } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L15Specs.length, structureKey: "fraction-reverse-source", prompt: "띠 그림을 그려 처음 수(전체)를 구하시오.", items: build(15, "fraction-reverse-source", "그림을 이용해 거꾸로 풀기", L15Specs) },
  extension: { title: "추가 학습", structureKey: "fraction-reverse-source", story: "남은 칸으로 처음 수를 구합니다.", prompt: "A가 가지고 있던 구슬을 똑같이 4묶음으로 나누어 그중 1묶음을 B에게 주었더니 15개가 남았습니다. A가 처음에 가지고 있던 구슬은 몇 개입니까?",
    visual: bar(4, { crossed: [0], below: { from: 1, to: 3 } }), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-08/lessons/15/extension" }
};
delete L15.experience.visualProgression;
book.lessons.splice(book.lessons.indexOf(L6) + 1, 0, L13, L14, L15);
book.lessonIntegration.newLessonIds = [...new Set([...book.lessonIntegration.newLessonIds, L13.id, L14.id, L15.id])];

// ── 장부: 남은 보류 둘(32~34 · 35~39)을 지운다. 8권 보류 0. ──
const pageOf = (item) => item.sourcePage ?? Number(String(item.sourceNo).match(/^S(\d+)/)[1]);
const units = (item) => item.parts?.length || 1;
book.sourceHold = book.sourceHold.filter((h) => !["S32-S34", "S35-S39"].includes(h.sourceNo));
if (book.sourceHold.length) throw new Error("holds left");
const items = book.lessons.flatMap((l) => l.original.items);
for (const e of book.sourceCoverage.pageLedger) {
  const list = items.filter((it) => pageOf(it) === e.page);
  Object.assign(e, { releasedItems: list.length, releasedAnswerUnits: list.reduce((n, it) => n + units(it), 0), heldRecords: 0, heldAnswerUnits: 0 });
  if (!e.title && !list.length) throw new Error(`page ${e.page} empty`);
}
const L = book.sourceCoverage.pageLedger;
Object.assign(book.sourceCoverage, { sourceLessons: book.lessons.length, publicItems: L.reduce((n, e) => n + e.releasedItems, 0), publicAnswerUnits: L.reduce((n, e) => n + e.releasedAnswerUnits, 0), holdItems: 0, heldAnswerUnits: 0 });
book.sourceCoverage.totalAnswerUnits = book.sourceCoverage.publicAnswerUnits;
if (items.length !== book.sourceCoverage.publicItems) throw new Error("ledger misses items");

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
const { pageLedger: _l, ...coverage } = book.sourceCoverage;
console.log("book08 batch5 patched", { L6: L6Specs.length, L13: L13Specs.length, L14: L14Specs.length, L15: L15Specs.length, holds: book.sourceHold.length, coverage });
