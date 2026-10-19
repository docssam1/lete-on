// 골든벨 6권 묶음 7(마지막): 교사용 슬라이드 27~32 「숫자와 수·수의 개수·숫자의 개수·숫자가 들어간 수·수 만들기」.
// 단원 10은 27~30쪽 원본 문항으로 새로 짜고, 31·32쪽은 단원 19로 덧붙인다.
// 이 스크립트에는 정답이 없다. node patch-book06-batch7.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-06");
if (book.lessons.some((l) => l.id === "make-number-source")) throw new Error("already patched");
const template = book.lessons.find((l) => l.id === "equal-share-source").experience;

const withParts = (item, labels) => ({ ...item, parts: labels.map((label, k) => ({ id: String.fromCharCode(97 + k), label, answerRef: `${item.answerRef}/parts/${k}` })) });
const build = (lessonNo, lessonId, specs) => specs.map((spec, k) => {
  let item = { id: `book06-full-${spec.no.slice(4).toLowerCase()}`, sourceNo: spec.no, lessonId, typeLabel: spec.type, sourceLocator: spec.loc, printGroup: spec.group,
    answerMode: spec.options ? "choice" : "input", ...(spec.options ? { options: spec.options } : spec.text ? {} : { inputMode: "numeric" }), prompt: spec.prompt, answerRef: `/books/book-06/lessons/${lessonNo}/original/items/${k}` };
  if (spec.visual) item.visual = spec.visual; else item.noVisual = true;
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  if (spec.parts) { item = withParts(item, spec.parts); delete item.answerMode; delete item.inputMode; }
  return item;
});
const experience = (lessonNo, family, title, beats, hint, check) => ({
  ...JSON.parse(JSON.stringify(template)), family, title, beats, hint, check: { ...check, answerRef: `/books/book-06/lessons/${lessonNo}/experience/check` }
});
const V = (subtype, v) => ({ kind: "book5", subtype, ...v });
const eq = (text) => V("source-blank-equation", { tokens: text.split(" ").map((t) => (t === "□" ? null : t)) });

// ── 단원 10: 수와 숫자의 개수 (27~30쪽) ──
const L10No = 10;
const DIGITS_NOTE = "원본 「숫자의 개수」 칸의 물음이 「수의 개수?」로 적혀 있어, 그 칸의 뜻대로 「쓴 숫자의 개수」로 고쳐 적었습니다.";
const L10Specs = [
  { no: "GB6-S27-01-1", loc: "교사용 슬라이드 27 활동 01 숫자 & 수 구분하기", group: 1, type: "숫자와 수", discrepancy: "원본은 숫자와 수를 구분하는 설명이라 화면에서는 고르기 물음으로 바꿨습니다.",
    prompt: "0, 1, 2, 3, 4, 5, 6, 7, 8, 9처럼 수를 쓰는 데 쓰는 기호 10개를 무엇이라고 할까요?", options: ["수", "숫자", "자리"] },
  ...[[1, 9], [1, 15], [6, 15], [9, 26], [14, 57]].map(([a, b], k) => ({ no: `GB6-S27-02-${k + 1}`, loc: `교사용 슬라이드 27 활동 02 수의 개수 구하기 ${"①②③④⑤"[k]}`, group: 2, type: "수의 개수",
    prompt: `${a}부터 ${b}까지 수는 모두 몇 개일까요? (${k + 1})` })),
  ...[[1, 8], [12, 39], [100, 199], [5, 63], [7, 43], [1, 100], [7, 164]].map(([a, b], k) => ({ no: `GB6-S27-03-${k + 1}`, loc: `교사용 슬라이드 27 활동 03 숫자의 개수 ${"①②③④⑤⑥⑦"[k]}`, group: 3 + Math.floor(k / 4), type: "쓴 숫자의 개수",
    prompt: `${a}부터 ${b}까지 수를 차례로 쓸 때, 쓴 숫자는 모두 몇 개일까요? (${k + 1})`, ...(k === 0 ? { discrepancy: DIGITS_NOTE } : {}) })),
  ...[["3", 6], ["8", 7], ["0", 8]].map(([d, n], k) => ({ no: `GB6-S28-03-${k + 1}`, loc: `교사용 슬라이드 28 숫자의 개수 ${"⑥⑦⑧"[k]}`, group: 5, type: "특정 숫자의 개수",
    prompt: `1부터 100까지 수를 차례로 쓸 때, 숫자 ${d}은 모두 몇 번 쓸까요? (${n})` })),
  ...[[["3", "8"], 9], [["3", "7", "8"], 10]].map(([ds, n], k) => ({ no: `GB6-S29-03-${k + 1}`, loc: `교사용 슬라이드 29 숫자의 개수 ${"⑨⑩"[k]}`, group: 6, type: "여러 숫자의 개수",
    prompt: `1부터 100까지 수를 차례로 쓸 때, 숫자 ${ds.join(", ")}을 쓰는 횟수를 모두 더하면 몇 번일까요? (${n})` })),
  ...[[["3"], 11], [["3", "8"], 12], [["3", "7", "8"], 13]].map(([ds, n], k) => ({ no: `GB6-S${k === 0 ? 29 : 30}-04-${k + 1}`, loc: `교사용 슬라이드 ${k === 0 ? 29 : 30} 숫자가 들어간 수의 개수 ${"⑪⑫⑬"[k]}`, group: 7, type: "숫자가 들어간 수",
    prompt: `1부터 100까지의 수 가운데 숫자 ${ds.join(" 또는 ")}${ds.length > 1 ? "이 하나라도" : "이"} 들어간 수는 몇 개일까요? (${n})` }))
];
const L10 = {
  id: "digit-sign-source", unit: "수와 숫자의 개수", title: "수와 숫자의 개수", sourceLocator: "교사용 슬라이드 27~30 활동 01~03",
  sourceTypeIds: ["digit-sign-source"], representativeConcept: "수의 개수는 (끝 - 처음 + 1)이고, 쓴 숫자의 개수는 한 자리·두 자리·세 자리 수를 나누어 자릿수만큼 곱해 더하며, 특정 숫자가 들어간 수는 겹치는 수를 한 번만 셈",
  story: { title: "번호표 만들기", text: "1번부터 15번까지 번호표를 만들면 번호표는 15장이지만 쓴 숫자는 더 많습니다.", mission: "수의 개수와 숫자의 개수를 구별해 보세요." },
  explanation: { headline: "수의 개수와 쓴 숫자의 개수는 다릅니다. 두 자리 수 하나에는 숫자가 2개 들어갑니다.",
    steps: ["수의 개수는 끝 - 처음 + 1입니다.", "쓴 숫자의 개수는 한 자리, 두 자리, 세 자리 수로 나누어 셉니다.", "각 묶음의 수의 개수에 자릿수를 곱해 더합니다.", "특정 숫자는 일의 자리와 십의 자리에서 따로 세고, 「들어간 수」는 두 번 센 수를 한 번 뺍니다."] },
  experience: experience(L10No, "digit-count", "수와 숫자를 세요", [
    { id: "digit-count-step-1", action: "reveal", caption: "8부터 12까지 수는 8, 9, 10, 11, 12로 12 - 8 + 1 = 5개입니다.", visual: eq("8 9 10 11 12") },
    { id: "digit-count-step-2", action: "highlight", caption: "한 자리 수 8, 9는 숫자 1개씩, 두 자리 수 10, 11, 12는 숫자 2개씩입니다.", visual: eq("8 9 10 11 12") },
    { id: "digit-count-step-3", action: "verify", caption: "쓴 숫자는 2 × 1 + 3 × 2 = 8개입니다.", visual: eq("2 × 1 + 3 × 2 = 8") }
  ], "자릿수만큼 숫자를 씁니다.", { prompt: "4부터 20까지 수는 모두 몇 개일까요?", options: ["16", "17", "18"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L10Specs.length, structureKey: "digit-sign-source", prompt: "수의 개수와 숫자의 개수를 구하시오.", items: build(L10No, "digit-sign-source", L10Specs) },
  extension: { title: "추가 학습", structureKey: "digit-sign-source", story: "1부터 50까지 수를 차례로 씁니다.", prompt: "1부터 50까지 수를 쓸 때 숫자 5는 모두 몇 번 쓸까요?",
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-06/lessons/${L10No}/extension` }
};

// ── 단원 19: 수 만들기 (31·32쪽) ──
const L19No = book.lessons.length;
const SIGN = "○ 안에 + 또는 - 를 써넣어 식이 맞도록 만드시오. 가, 나 칸에 기호를 쓰시오.";
const WRITE_PLUS = "수 사이에 + 를 써넣어 식이 맞도록 만드시오. 만든 식을 「9+87」처럼 띄어쓰기 없이 쓰시오(붙어 있는 숫자는 한 수로 읽습니다).";
const WRITE_SIGN = "식이 성립하도록 수 사이에 + 또는 - 를 알맞게 써넣고, 만든 식을 「9+8-7」처럼 쓰시오. 수 사이에 늘 + 또는 - 가 들어갈 필요는 없습니다(붙어 있는 숫자는 한 수로 읽습니다).";
const MANY = "답이 되는 식이 여럿이면 어느 것을 써도 맞습니다.";
const L19Specs = [
  ...[["3", "2", "1", 6], ["3", "2", "1", 4], ["3", "2", "1", 2], ["3", "2", "1", 0], ["5", "3", "1", 9], ["5", "3", "1", 7], ["5", "3", "1", 3], ["5", "3", "1", 1]].map(([a, b, c, t], k) => ({
    no: `GB6-S31-01-${k + 1}`, loc: `교사용 슬라이드 31 수 만들기 ${k < 4 ? "왼쪽" : "오른쪽"} ${k % 4 + 1}`, group: 1 + Math.floor(k / 4), type: "+ − 넣기",
    prompt: `${SIGN} (${k + 1})`, visual: eq(`${a} □ ${b} □ ${c} = ${t}`), parts: ["가", "나"] })),
  { no: "GB6-S31-01-9", loc: "교사용 슬라이드 31 수 만들기 20 ○ 18 ○ 16 ○ 14 ○ 12", group: 3, type: "+ − 넣기", text: true,
    prompt: "○ 안에 + 또는 - 를 써넣어 식이 맞도록 만들고, 만든 식을 「9+8-7」처럼 띄어쓰기 없이 쓰시오. (9)",
    visual: eq("20 □ 18 □ 16 □ 14 □ 12 = 20"), discrepancy: "원본은 ○ 네 칸에 기호를 하나씩 쓰게 했지만 맞는 기호 배치가 두 가지라, 식 전체를 쓰게 바꾸고 두 식 모두 정답으로 받습니다." },
  ...["1 2 3 4 = 10", "1 2 3 4 = 19", "1 + 2 3 4 = 37", "1 2 3 4 = 235", "3 3 3 3 3 3 3 = 102", "5 5 5 5 5 5 5 5 = 220"].map((t, k) => ({
    no: `GB6-S31-02-${k + 1}`, loc: `교사용 슬라이드 31 Q. 덧셈 기호 써넣기 ${k + 1}`, group: 4 + Math.floor(k / 3), type: "+ 넣어 식 만들기", text: true,
    prompt: `${WRITE_PLUS} (${k + 1})`, visual: eq(t), ...(k === 4 ? { discrepancy: MANY } : {}) })),
  ...["3 2 1 = 31", "4 3 2 1 = 35", "4 3 2 1 = 42", "5 4 3 2 1 = 85", "5 4 3 2 1 = 40"].map((t, k) => ({
    no: `GB6-S32-01-${k + 1}`, loc: `교사용 슬라이드 32 Q. + − 써넣기 ${k + 1}`, group: 6, type: "+ − 넣어 식 만들기", text: true, prompt: `${WRITE_SIGN} (${k + 1})`, visual: eq(t) }))
];
const L19 = {
  id: "make-number-source", unit: "수와 숫자의 개수", title: "수 만들기", sourceLocator: "교사용 슬라이드 31·32 수 만들기",
  sourceTypeIds: ["make-number-source"], representativeConcept: "수 사이에 + 또는 -를 넣거나 숫자를 붙여 두 자리·세 자리 수로 읽어 원하는 값을 만듦",
  story: { title: "기호 퍼즐", text: "같은 숫자도 사이에 어떤 기호를 넣느냐에 따라 값이 달라집니다.", mission: "목표 수에 가까워지도록 기호를 바꿔 보세요." },
  explanation: { headline: "큰 수가 필요하면 숫자를 붙여 두 자리 수로 만들고, 넘치면 -로 줄입니다.",
    steps: ["먼저 모두 더해 보고 목표 수와 비교합니다.", "너무 크면 어느 수 앞을 -로 바꿀지 봅니다(그 수의 두 배만큼 줄어듭니다).", "너무 작으면 숫자를 붙여 두 자리 수를 만들어 봅니다.", "다 만든 식을 처음부터 계산해 목표 수가 되는지 확인합니다."] },
  experience: experience(L19No, "make-number", "기호를 넣어 수를 만들어요", [
    { id: "make-number-step-1", action: "reveal", caption: "4 ○ 2 ○ 1을 모두 더하면 7입니다. 목표는 3입니다.", visual: eq("4 □ 2 □ 1 = 3") },
    { id: "make-number-step-2", action: "highlight", caption: "2 앞을 -로 바꾸면 2의 두 배인 4만큼 줄어 3이 됩니다.", visual: eq("4 - 2 + 1 = 3") },
    { id: "make-number-step-3", action: "verify", caption: "4 - 2 + 1 = 3이 맞습니다.", visual: eq("4 - 2 + 1 = 3") }
  ], "모두 더한 값과 목표 수의 차이를 봅니다.", { prompt: "6 ○ 2 ○ 1 = 3이 되는 기호를 차례로 고르면?", options: ["-, +", "+, -", "-, -"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L19Specs.length, structureKey: "make-number-source", prompt: "기호를 넣어 수를 만드시오.", visual: eq("4 □ 2 □ 1 = 3"), items: build(L19No, "make-number-source", L19Specs) },
  extension: { title: "추가 학습", structureKey: "make-number-source", story: "수 사이에 + 를 넣습니다.", prompt: "1 2 3 = 15가 되도록 + 를 넣은 식을 쓰시오.", visual: eq("1 2 3 = 15"),
    answerMode: "input", extensionKind: "source-structured-authored", answerRef: `/books/book-06/lessons/${L19No}/extension` }
};

book.lessons[L10No] = L10;
book.lessons.push(L19);
const released = { 27: 13, 28: 3, 29: 3, 30: 2, 31: 15, 32: 5 };
for (const entry of book.sourceCoverage) {
  const page = entry.pages[0];
  if (released[page] != null) Object.assign(entry, { status: "implemented", releasedCount: released[page], holdCount: 0 });
}
for (const entry of book.sourceCoverage) if ([1, 11, 17, 26].includes(entry.pages[0])) Object.assign(entry, { status: "cover", releasedCount: 0, holdCount: 0 });
const count = (p) => [...L10Specs, ...L19Specs].filter((s) => s.no.startsWith(`GB6-S${p}`)).length;
for (const p of Object.keys(released)) if (count(p) !== released[p]) throw new Error(`page ${p} count ${count(p)}`);

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book06 batch7 patched", { L10: L10.original.items.length, L19: L19.original.items.length, lessonNos: [L10No, L19No], holds: book.sourceHold.length, released });
