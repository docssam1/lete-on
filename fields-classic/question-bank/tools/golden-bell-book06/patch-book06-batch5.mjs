// 골든벨 6권 묶음 5: 교사용 슬라이드 18~21 「타일 그림 곱셈·간편하게 계산하기·같은 수로 묶기·9에 가까운 수」.
// 단원 8은 18·19쪽 원본 문항으로 새로 짜고, 20·21쪽은 단원 17로 덧붙인다.
// 이 스크립트에는 정답이 없다. node patch-book06-batch5.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-06");
if (book.lessons.some((l) => l.id === "same-factor-source")) throw new Error("already patched");
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
// "9 + 1 + 3" 같은 식 글자를 토큰으로. "□"는 빈칸, "*9"는 강조(원본의 노란 동그라미).
const eq = (text, answerBlank = true) => V("source-blank-equation", { tokens: [...text.split(" ").map((t) => (t === "□" ? null : t)), ...(answerBlank ? ["=", null] : [])] });
const tiles = (tens, ones, m) => V("source-area-tiles", { tens, ones, m });

// ── 단원 8: 타일 그림 곱셈과 간편 계산 (18·19쪽) ──
const L8No = 8;
const MULTS = [[14, 3], [21, 6], [43, 8], [62, 9], [33, 9], [47, 50], [59, 30], [74, 80]];
const SUMS = ["9 + 1 + 3 + 7 + 4 + 6", "25 + 75 + 31 + 69 + 43 + 57", "333 + 667 + 555 + 445 + 111 + 889", "875 + 125 + 653 + 347 + 321 + 679 + 878 + 122", "19 + 36 + 81 + 57 + 43 + 64", "3 + 28 + 45 + 47 + 52 + 55"];
const MISSING = ["12 + 88 + 34 + 66 + 51 + □ = 300", "39 + 61 + 46 + 54 + 23 + 78 + 47 + □ = 400", "135 + 865 + 146 + 854 + 369 + 631 + 258 + □ = 4000"];
const L8Specs = [
  ...MULTS.map(([a, m], k) => ({ no: `GB6-S18-01-${k + 1}`, loc: `교사용 슬라이드 18 활동 01 타일 그림 곱셈 ${k + 1}`, group: 1 + Math.floor(k / 4), type: "타일 그림 곱셈",
    prompt: `타일 그림을 이용하여 ${a} × ${m}을 하시오. 두 칸 가, 나에 들어갈 곱과 답을 쓰시오. (${k + 1})`, parts: ["가", "나", `${a} × ${m}`], visual: tiles(Math.floor(a / 10) * 10, a % 10, m) })),
  ...SUMS.map((t, k) => ({ no: `GB6-S19-02-${k + 1}`, loc: `교사용 슬라이드 19 활동 02 간편하게 계산하기 ${"①②③④⑤⑥"[k]}`, group: 3 + Math.floor(k / 3), type: "간편하게 더하기",
    prompt: `더해서 딱 떨어지는 수끼리 먼저 묶어 간편하게 계산하시오. (${k + 1})`, visual: eq(t) })),
  ...MISSING.map((t, k) => ({ no: `GB6-S19-02-${k + 7}`, loc: `교사용 슬라이드 19 활동 02 간편하게 계산하기 ${"⑦⑧⑨"[k]}`, group: 5, type: "빈칸 채우기",
    prompt: `식이 맞도록 가에 알맞은 수를 구하시오. (${k + 7})`, visual: eq(t, false) }))
];
const L8 = {
  id: "multiplication-source", unit: "연속수의 합", title: "타일 곱셈과 간편 계산", sourceLocator: "교사용 슬라이드 18 활동 01 타일 그림 곱셈, 슬라이드 19 활동 02 간편하게 계산하기",
  sourceTypeIds: ["multiplication-source"], representativeConcept: "두 자리 수를 십의 자리와 일의 자리로 갈라 타일 칸마다 곱해 더하고, 더해서 딱 떨어지는 수끼리 묶어 간편하게 더함",
  story: { title: "타일 바닥 깔기", text: "큰 바닥을 두 칸으로 나누어 타일을 세면 쉽습니다.", mission: "수를 십과 일로 갈라 칸마다 곱해 보세요." },
  explanation: { headline: "곱하는 수를 십의 자리와 일의 자리로 가르면 두 칸의 곱을 더해 답이 나옵니다.",
    steps: ["두 자리 수를 십의 자리와 일의 자리로 가릅니다.", "칸마다 곱셈을 합니다.", "두 칸의 곱을 더하면 답입니다.", "더할 때는 10, 100, 1000처럼 딱 떨어지는 짝을 먼저 찾습니다."] },
  experience: experience(L8No, "area-tiles", "타일 그림으로 곱해요", [
    { id: "area-tiles-step-1", action: "reveal", caption: "23 × 4는 23을 20과 3으로 갈라 두 칸으로 그립니다.", visual: tiles(20, 3, 4) },
    { id: "area-tiles-step-2", action: "highlight", caption: "큰 칸은 20 × 4 = 80, 작은 칸은 3 × 4 = 12입니다.", visual: tiles(20, 3, 4) },
    { id: "area-tiles-step-3", action: "verify", caption: "80 + 12 = 92이므로 23 × 4 = 92입니다.", visual: eq("23 × 4 = 80 + 12 = 92", false) }
  ], "십의 자리와 일의 자리를 따로 곱합니다.", { prompt: "31 × 5는 얼마일까요?", options: ["150", "155", "165"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L8Specs.length, structureKey: "multiplication-source", prompt: "타일 그림과 간편 계산", visual: tiles(20, 3, 4), items: build(L8No, "multiplication-source", L8Specs) },
  extension: { title: "추가 학습", structureKey: "multiplication-source", story: "타일 그림으로 곱합니다.", prompt: "52 × 7은 얼마일까요?", visual: tiles(50, 2, 7),
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-06/lessons/${L8No}/extension` }
};

// ── 단원 17: 같은 수로 묶기와 9에 가까운 수 (20·21쪽) ──
const L17No = book.lessons.length;
const FACTOR = ["*9 × 9 + *9", "*6 × 2 + *6 × 3", "*5 × 7 + *5 × 3", "*22 × 4 + *22 × 6", "*16 × 2 + *16 × 3 + *16 × 5", "*77 × 5 + *77 × 4 + *77", "*31 × 11 + *31 × 19",
  "*47 × 33 + *47 × 67", "*55 × 44 + *55 × 56", "*72 × 33 + *72 × 66 + *72", "*333 × 999 + *333", "*111 × 777 + *111 × 223", "*888 × 555 + *888 × 445", "*222 × 666 + *222 × 333 + *222"];
const NINES = ["9 × 99", "55 × 99", "99 × 99", "3 × 29", "6 × 69"];
const NEAR = ["99 + 9", "999 + 99 + 9", "9999 + 999 + 99 + 9", "9998 + 998 + 98 + 8", "2999 + 299 + 29 + 9", "9 + 19 + 29 + 39", "99 + 199 + 299"];
const MARK = "원본 학생지의 노란 동그라미(같은 수 표시)를 식 그림에 노란 바탕으로 옮겼습니다.";
const L17Specs = [
  { no: "GB6-S20-00-1", loc: "교사용 슬라이드 20 머리 상자 1", group: 1, type: "같은 수 더하기를 곱셈으로", prompt: "같은 수를 여러 번 더하면 곱셈으로 나타낼 수 있습니다. 가에 알맞은 수를 구하시오. (1)",
    visual: eq("12 + 12 + 12 + 12 + 12 = 12 × 5") },
  { no: "GB6-S20-00-2", loc: "교사용 슬라이드 20 머리 상자 2", group: 1, type: "같은 수 더하기를 곱셈으로", prompt: "같은 수를 여러 번 더하면 곱셈으로 나타낼 수 있습니다. 가에 알맞은 수를 구하시오. (2)",
    visual: eq("49 + 49 + 49 + 49 + 49 + 49 + 49 + 49 + 49 + 49 = 49 × 10") },
  ...FACTOR.map((t, k) => ({ no: `GB6-S20-01-${k + 1}`, loc: `교사용 슬라이드 20 같은 수로 묶기 ${k + 1}`, group: 2 + Math.floor(k / 4), type: "같은 수로 묶어 곱하기",
    prompt: `노란색으로 표시한 같은 수로 묶어 간편하게 계산하시오. (${k + 1})`, visual: eq(t), ...(k === 0 ? { discrepancy: MARK } : {}) })),
  { no: "GB6-S21-00-1", loc: "교사용 슬라이드 21 머리 상자 1", group: 6, type: "9를 곱하기", prompt: "9는 10보다 1 작은 수입니다. 간편하게 계산하시오. (1)", visual: eq("5 × 9") },
  { no: "GB6-S21-00-2", loc: "교사용 슬라이드 21 머리 상자 2", group: 6, type: "99를 곱하기", prompt: "99는 100보다 1 작은 수입니다. 간편하게 계산하시오. (2)", visual: eq("5 × 99") },
  ...NINES.map((t, k) => ({ no: `GB6-S21-01-${k + 1}`, loc: `교사용 슬라이드 21 ${"①②③④⑤"[k]} 곱셈`, group: 6 + Math.floor((k + 2) / 4), type: "9에 가까운 수 곱하기",
    prompt: `간편하게 계산하시오. (${k + 3})`, visual: eq(t) })),
  ...NEAR.map((t, k) => ({ no: `GB6-S21-02-${k + 1}`, loc: `교사용 슬라이드 21 ${"①②③④⑤⑥⑦"[k]} 덧셈`, group: 8 + Math.floor(k / 4), type: "9에 가까운 수 더하기",
    prompt: `딱 떨어지는 수로 바꾸어 간편하게 계산하시오. (${k + 1})`, visual: eq(t) }))
];
const L17 = {
  id: "same-factor-source", unit: "연속수의 합", title: "같은 수로 묶기와 9에 가까운 수", sourceLocator: "교사용 슬라이드 20 같은 수로 묶기, 슬라이드 21 9에 가까운 수",
  sourceTypeIds: ["same-factor-source"], representativeConcept: "같은 수를 곱한 덧셈은 곱하는 수끼리 먼저 더해 한 번에 곱하고, 9·99처럼 딱 떨어지는 수에 가까운 수는 10·100으로 바꾼 뒤 모자란 만큼 뺌",
  story: { title: "사탕 봉지 세기", text: "같은 사탕이 든 봉지가 여러 묶음이면 봉지 수를 먼저 모아 셉니다.", mission: "같은 수를 찾아 한 번에 곱해 보세요." },
  explanation: { headline: "같은 수에 곱한 것끼리는 곱하는 수를 먼저 더해 한 번에 곱합니다. 9·99는 10·100에서 1을 뺀 수로 생각합니다.",
    steps: ["식에서 여러 번 나오는 같은 수를 찾습니다(곱하지 않은 같은 수는 × 1로 봅니다).", "같은 수에 곱한 수끼리 먼저 더합니다.", "9는 10 - 1, 99는 100 - 1로 바꾸어 곱한 뒤 뺍니다.", "9에 가까운 수를 더할 때는 1씩 더해 딱 떨어지게 한 뒤, 더한 만큼 뺍니다."] },
  experience: experience(L17No, "same-factor", "같은 수로 묶어요", [
    { id: "same-factor-step-1", action: "reveal", caption: "8 + 8 + 8은 8이 3번이므로 8 × 3입니다.", visual: eq("8 + 8 + 8 = 8 × 3 = 24", false) },
    { id: "same-factor-step-2", action: "highlight", caption: "7 × 6 + 7 × 4는 7이 6번과 4번, 모두 10번입니다.", visual: eq("*7 × 6 + *7 × 4", false) },
    { id: "same-factor-step-3", action: "verify", caption: "7 × 10 = 70입니다.", visual: eq("*7 × 6 + *7 × 4 = 7 × 10 = 70", false) }
  ], "같은 수가 모두 몇 번인지 셉니다.", { prompt: "4 × 8 + 4 × 2는 얼마일까요?", options: ["32", "40", "48"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L17Specs.length, structureKey: "same-factor-source", prompt: "같은 수로 묶어 간편하게 계산하시오.", visual: eq("*7 × 6 + *7 × 4", false), items: build(L17No, "same-factor-source", L17Specs) },
  extension: { title: "추가 학습", structureKey: "same-factor-source", story: "99는 100보다 1 작습니다.", prompt: "8 × 99는 얼마일까요?", visual: eq("8 × 99"),
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-06/lessons/${L17No}/extension` }
};

book.lessons[L8No] = L8;
book.lessons.push(L17);
const cleared = new Set(["B06-19-08"]);
const before = book.sourceHold.length;
book.sourceHold = book.sourceHold.filter((hold) => !cleared.has(hold.sourceNo));
if (before - book.sourceHold.length !== 1) throw new Error(`hold count ${before - book.sourceHold.length}`);
const released = { 18: 8, 19: 9, 20: 16, 21: 14 };
for (const entry of book.sourceCoverage) {
  const page = entry.pages[0];
  if (released[page] != null) Object.assign(entry, { status: "implemented", releasedCount: released[page], holdCount: 0 });
}
const count = (p) => [...L8Specs, ...L17Specs].filter((s) => s.no.startsWith(`GB6-S${p}`)).length;
for (const p of [18, 19, 20, 21]) if (count(p) !== released[p]) throw new Error(`page ${p} count ${count(p)}`);

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book06 batch5 patched", { L8: L8.original.items.length, L17: L17.original.items.length, lessonNos: [L8No, L17No], holds: book.sourceHold.length, released });
