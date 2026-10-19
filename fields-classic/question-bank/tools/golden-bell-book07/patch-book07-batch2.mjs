// 골든벨 7권 묶음 2: 교사용 슬라이드 9~25 「규칙 찾기와 수열 · 식 세워 거꾸로 풀기」.
// 9~11쪽 연산 체크는 단원 6 그림 식만 원본대로(「= □」) 고치고, 12~17쪽은 단원 7, 18~19쪽은 단원 1 자리에 원본대로 다시 짠다.
// 20~25쪽은 새 단원 14로 넣는다. 이 스크립트에는 정답이 없다. node patch-book07-batch2.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-07");
if (book.lessons.some((l) => l.id === "reverse-sequence-source")) throw new Error("already patched");
const no = (id) => book.lessons.findIndex((l) => l.id === id);
const L6No = no("multiplication-equation"), L7No = no("arithmetic-sequence"), L1No = no("shared-polygon-matchsticks");
const L6 = book.lessons[L6No], L7 = book.lessons[L7No], L1 = book.lessons[L1No];

const build = (lessonNo, lessonId, topic, specs) => specs.map((spec, k) => {
  const item = { id: `book07-src-${spec.no.slice(4).toLowerCase()}`, sourcePage: Number(spec.no.slice(5, 7)), sourceNo: spec.no, lessonId, topic,
    typeLabel: spec.type, sourceLocator: spec.loc, printGroup: spec.group, answerMode: "input", inputMode: "numeric", prompt: spec.prompt,
    answerRef: `/books/book-07/lessons/${lessonNo}/original/items/${k}` };
  if (spec.visual) item.visual = spec.visual; else item.noVisual = true;
  if (spec.options) { item.answerMode = "choice"; delete item.inputMode; item.options = spec.options; }
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  return item;
});
const V = (subtype, v) => ({ kind: "book5", subtype, ...v });
const eq = (expression) => ({ kind: "book7", subtype: "equation", expression });
const seq = (values) => ({ kind: "book7", subtype: "sequence", values, sourceLayout: true });
// 표: 원본의 빈 칸은 ""로, 물을 칸(㉮·㉯·?)은 색칠한다.
const table = (cells, extra = {}) => V("source-number-table", {
  cells, shaded: cells.flatMap((row, r) => row.map((v, c) => (["㉮", "㉯", "?"].includes(v) ? [r, c] : null)).filter(Boolean)), ...extra });
const RULE_NOTE = "원본은 규칙을 글로 쓰는 문항이라, 화면에서는 세 가지 중에서 고르게 했습니다.";

// ── 단원 6: 연산 체크 (9~11쪽) — 문항·순서는 그대로, 원본 식 모양(「3×10=□」)으로 ──
const L6Exprs = L6.original.items.map((item) => item.visual.expression.includes("□") ? item.visual.expression : `${item.visual.expression}=□`);
if (L6Exprs.length !== 31) throw new Error("L6 count");
const L6Specs = L6Exprs.map((expression, k) => {
  const [page, sec, n] = k < 11 ? [9, 1, k + 1] : k < 22 ? [10, 2, k - 10] : [11, 3, k - 21];
  return { no: `GB7-S${String(page).padStart(2, "0")}-0${sec}-${n}`, loc: `교사용 슬라이드 ${page} · 1. 연산 체크 0${sec} (${n})`, group: page, type: sec === 3 ? "덧셈과 곱셈 식의 □" : "곱셈식의 □",
    prompt: `다음 주어진 식에서 □를 구하시오. (${n})`, visual: eq(expression) };
});
L6.sourceLocator = "교사용 슬라이드 9~11 · 활동 01 규칙 찾기와 수열 1. 연산 체크";
L6.original = { ...L6.original, title: "골든벨", sourceQuestionCount: L6Specs.length, prompt: "다음 주어진 식에서 □를 구하시오.", items: build(L6No, L6.id, "규칙 찾기와 수열", L6Specs) };

// ── 단원 7: 등차수열 N번째 수 구하기 (12~17쪽) ──
const NTH = "다음은 일정한 규칙으로 수를 나열한 것입니다.";
const nth = (page, sec, values, positions, start = 1) => positions.map((p, k) => ({
  no: `GB7-S${page}-${sec}-${start + k}`, loc: `교사용 슬라이드 ${Number(page)} · 2. 등차수열(N번째 수 구하기) ${sec} (${start + k})`, group: Number(page) * 10 + Number(sec) % 10,
  type: "N번째 수 구하기", prompt: `${NTH} ${p}번째 수를 구하시오.`, visual: seq(values) }));
const TABLE_Q = "다음 표는 어떤 규칙에 따라 만들어진 것입니다.";
const tableItems = (page, sec, cells, extra, ruleOptions) => {
  const specs = [];
  const loc = (k) => `교사용 슬라이드 ${Number(page)} · 표의 규칙 ${sec} (${k})`;
  const group = Number(page) * 10 + Number(sec) % 10;
  if (ruleOptions) specs.push({ no: `GB7-S${page}-${sec}-1`, loc: loc(1), group, type: "표의 규칙 찾기", prompt: `${TABLE_Q} 어떤 규칙이 있는지 고르시오.`, visual: table(cells, extra), options: ruleOptions, discrepancy: RULE_NOTE });
  for (const mark of ["㉮", "㉯"]) {
    const k = specs.length + 1;
    specs.push({ no: `GB7-S${page}-${sec}-${k}`, loc: loc(k), group, type: "표에서 빈칸 수 구하기", prompt: `${TABLE_Q} ${mark}에 알맞은 수를 구하시오.`, visual: table(cells, extra) });
  }
  return specs;
};
const L7Specs = [
  { no: "GB7-S12-01-1", loc: "교사용 슬라이드 12 · 2. 등차수열(N번째 수 구하기) 01 (1)", group: 121, type: "수열의 규칙 찾기", prompt: `${NTH} 수들의 규칙은 무엇입니까?`,
    visual: seq([3, 5, 7, 9, 11]), options: ["2씩 늘어납니다.", "3씩 늘어납니다.", "2씩 줄어듭니다."], discrepancy: RULE_NOTE },
  { no: "GB7-S12-01-2", loc: "교사용 슬라이드 12 · 2. 등차수열(N번째 수 구하기) 01 (2)", group: 121, type: "다음에 올 수", prompt: `${NTH} 11 다음에 올 수를 구하시오.`, visual: seq([3, 5, 7, 9, 11]) },
  ...nth("12", "01", [3, 5, 7, 9, 11], [6, 12, 40], 3),
  ...nth("12", "02", [4, 7, 10, 13, 16], [7, 10, 12, 21]),
  ...nth("13", "03", [9, 13, 17, 21, 25], [13, 26, 31]),
  ...nth("13", "04", [5, 9, 13, 17], [11, 16, 26]),
  ...nth("14", "05", [4, 11, 18, 25, 32], [10, 14, 25]),
  ...nth("14", "06", [3, 11, 19, 27, 35], [12, 16, 21]),
  ...tableItems("15", "07", [[1, 2, 3, 4, 5, 6, 7, 8], [6, 9, 12, 15, "", "㉮", "", "㉯"]], { head: true }, ["3씩 늘어납니다.", "6씩 늘어납니다.", "3씩 줄어듭니다."]),
  ...tableItems("15", "08", [[1, 2, 3, 4, 5, "…", 12, "…", 21], [6, 10, 14, 18, 22, "", "㉮", "", "㉯"]], { head: true }),
  ...tableItems("16", "09", [[1, 2, 3, 4, 5, "…", 16, "…", 26], [4, "", 12, "", 20, "", "㉮", "", "㉯"]], { head: true }, ["4씩 늘어납니다.", "8씩 늘어납니다.", "4씩 줄어듭니다."]),
  ...tableItems("16", "10", [[1, 2, 3, 4, "…", 9, "…", 21], [3, "", "", 21, "", "㉮", "", "㉯"]], { head: true }),
  ...tableItems("17", "11", [[3, 7, 11, 15, "…", 27, "…", 43], [4, 7, 10, 13, "", "㉮", "", "㉯"]], { head: true, arrows: [{ row: "top", at: 0, label: "+4" }, { row: "bottom", at: 0, label: "+3" }] })
];
L7.sourceLocator = "교사용 슬라이드 12~17 · 2. 등차수열(N번째 수 구하기)";
L7.original = { ...L7.original, title: "골든벨", sourceQuestionCount: L7Specs.length, prompt: "규칙을 찾아 N번째 수를 구하시오.", items: build(L7No, L7.id, "등차수열", L7Specs) };

// ── 단원 1: 도형에서의 등차수열 (18~19쪽) ──
const STICK = "다음은 성냥개비로 도형을 만들어 나열한 것입니다.";
const SHAPE = "다음은 어떤 규칙으로 도형을 나열한 것입니다.";
const tri = V("source-stick-stages", { shape: "triangle", stages: [1, 2, 3, 4] });
const house = V("source-stick-stages", { shape: "house", stages: [1, 2, 3] });
const L1Specs = [
  { no: "GB7-S18-12-1", loc: "교사용 슬라이드 18 · 3. 도형에서의 등차수열 12 (1)", group: 1812, type: "성냥개비 수", prompt: `${STICK} △가 5개일 때 성냥개비의 개수를 구하시오.`, visual: tri,
    discrepancy: "원본의 (1)은 순서와 성냥개비 수를 채우는 표가 있으나, 화면에서는 마지막 칸의 수 하나를 답으로 받습니다." },
  { no: "GB7-S18-12-2", loc: "교사용 슬라이드 18 · 3. 도형에서의 등차수열 12 (2)", group: 1812, type: "성냥개비 수", prompt: `${STICK} 10개의 △을 만들려면 필요한 성냥개비의 개수를 구하시오.`, visual: tri },
  { no: "GB7-S18-12-3", loc: "교사용 슬라이드 18 · 3. 도형에서의 등차수열 12 (3)", group: 1812, type: "성냥개비 수", prompt: `${STICK} 34개의 △을 만들려면 필요한 성냥개비의 개수를 구하시오.`, visual: tri },
  { no: "GB7-S18-13-1", loc: "교사용 슬라이드 18 · 3. 도형에서의 등차수열 13 (1)", group: 1813, type: "성냥개비 수", prompt: `${STICK} 오각형 5개를 만들려면 필요한 성냥개비의 개수를 구하시오.`, visual: house,
    discrepancy: "원본의 (1)은 순서와 성냥개비 수를 채우는 표가 있으나, 화면에서는 마지막 칸의 수 하나를 답으로 받습니다." },
  ...[10, 31, 36].map((n, k) => ({ no: `GB7-S18-13-${k + 2}`, loc: `교사용 슬라이드 18 · 3. 도형에서의 등차수열 13 (${k + 2})`, group: 1813, type: "성냥개비 수",
    prompt: `${STICK} ${n}개의 오각형을 만들려면 필요한 성냥개비의 개수를 구하시오.`, visual: house })),
  { no: "GB7-S19-14-1", loc: "교사용 슬라이드 19 · 3. 도형에서의 등차수열 14", group: 1914, type: "바둑돌 수", prompt: "다음과 같은 규칙으로 계속하여 흰색 바둑돌을 놓을 때, 50번째에 필요한 흰색 바둑돌의 개수를 구하시오.",
    visual: V("source-stone-cross", { stages: [1, 2, 3, 4] }) },
  { no: "GB7-S19-15-1", loc: "교사용 슬라이드 19 · 3. 도형에서의 등차수열 15", group: 1915, type: "도형 수", prompt: `${SHAPE} △가 100개일 때, □의 개수를 구하시오.`,
    visual: V("source-shape-stages", { layout: "roof-grid", stages: [1, 2, 3] }) },
  { no: "GB7-S19-16-1", loc: "교사용 슬라이드 19 · 3. 도형에서의 등차수열 16", group: 1916, type: "도형 수", prompt: `${SHAPE} □가 100개일 때, △의 개수를 구하시오.`,
    visual: V("source-shape-stages", { layout: "square-row", stages: [1, 2, 3] }) }
];
Object.assign(L1, { title: "도형에서의 등차수열", sourceLocator: "교사용 슬라이드 18~19 · 3. 도형에서의 등차수열",
  representativeConcept: "모양이 하나 늘 때마다 늘어나는 개수가 같으므로, 처음 개수에 늘어나는 개수를 (몇 번째 − 1)번 더함" });
L1.story = { ...L1.story, title: "도형에서의 등차수열" };
L1.original = { ...L1.original, title: "골든벨", sourceQuestionCount: L1Specs.length, prompt: "모양이 늘어나는 규칙을 찾아 개수를 구하시오.", items: build(L1No, L1.id, "도형 수열", L1Specs) };

// ── 단원 14: 식 세워 거꾸로 풀기 (20~25쪽) ──
const L14No = book.lessons.length;
const BACK = [["1+2×□=5", 1, 1], ["2+3×□=14", 1, 2], ["5+5×□=60", 1, 3], ["7+8×□=103", 1, 4], ["1+2×□=33", 2, 1], ["2+3×□=44", 2, 2], ["3+4×□=83", 3, 1], ["4+6×□=154", 3, 2]];
const ASC = "다음과 같이 앞의 수에 똑같은 수를 더하여 수를 나열하였습니다.";
// [쪽, 번호, 보이는 수열, [[수, 조사], …], 원본과 다른 점]
const WHICH = [
  ["21", "01", [4, 7, 10, 13], [[19, "는"], [31, "은"], [40, "은"]]],
  ["21", "02", [3, 7, 11, 15, 19], [[23, "은"], [43, "은"], [63, "은"]]],
  ["22", "03", [2, 6, 10, 14, 18], [[22, "는"], [46, "은"], [62, "는"]], "원본 수열 상자에 수 하나가 빠져 있어(앞의 수에 똑같은 수를 더한다는 조건과 맞지 않습니다) 빠진 수를 넣었습니다."],
  ["22", "04", [5, 11, 17, 23], [[35, "는"], [77, "은"], [131, "은"]]],
  ["23", "05", [1, 8, 15, 22], [[43, "은"], [85, "는"], [141, "은"]]],
  ["23", "06", [3, 7, 11, 15], [[35, "는"], [51, "은"], [103, "은"]]],
  ["24", "07", [8, 15, 22, 29], [[50, "은"], [85, "는"], [99, "는"]]],
  ["24", "08", [2, 9, 16, 23], [[37, "은"], [65, "는"], [93, "은"]]]
];
const ROWS = [
  [[2, "", 8, "", "", "", "", "?"]],
  [[5, "", 21, "", "", "", "", "", "?"]],
  [[4, "", "", "?", "", "", "", 46]],
  [[8, "", "", "", "", "?", "", "", 48]],
  [[1, 3, 5, 7, 9, "…", 31], [1, 6, 11, 16, 21, "…", "?"]]
];
const L14Specs = [
  ...BACK.map(([expression, sec, n], k) => ({ no: `GB7-S20-01-${k + 1}`, loc: `교사용 슬라이드 20 · 활동 02 식 세워 거꾸로 풀기 1. 연산 체크 01 ${sec}째 묶음 (${n})`, group: 20 * 10 + sec,
    type: "식에서 □ 구하기", prompt: `다음 주어진 식에서 □를 구하시오. (${k + 1})`, visual: eq(expression) })),
  ...WHICH.flatMap(([page, sec, values, asks, discrepancy]) => asks.map(([n, josa], k) => ({
    no: `GB7-S${page}-${sec}-${k + 1}`, loc: `교사용 슬라이드 ${Number(page)} · 2. 등차수열(거꾸로 계산하기) ${sec} (${k + 1})`, group: Number(page) * 10 + Number(sec) % 10,
    type: "몇 번째 수인지 구하기", prompt: `${ASC} ${n}${josa} 몇 번째 수인지 구하시오.`, visual: seq(values), ...(discrepancy ? { discrepancy } : {}) }))),
  ...ROWS.map((cells, k) => ({ no: `GB7-S25-07-${k + 1}`, loc: `교사용 슬라이드 25 · 2. 등차수열(거꾸로 계산하기) 07 (${k + 1})`, group: 250 + (k < 4 ? 1 : 2),
    type: k < 4 ? "칸 사이의 수" : "두 수열의 짝", prompt: `${ASC} ?에 들어갈 수를 구하시오. (${k + 1})`, visual: table(cells) }))
];
const L14 = {
  id: "reverse-sequence-source", unit: "곱셈과 수열", title: "식 세워 거꾸로 풀기", sourceLocator: "교사용 슬라이드 20~25 · 활동 02 식 세워 거꾸로 풀기",
  sourceTypeIds: ["book07-reverse-sequence-source"], representativeConcept: "몇 번째 수 = 첫째 수 + 늘어나는 수 × (몇 번째 − 1). 거꾸로 식을 세워 □를 구하면 몇 번째인지 알 수 있음",
  story: { title: "몇 번째 수일까?", text: "1층에서 3층까지 가려면 2층만 올라가요. 수열도 첫째 수에서 몇 번 더했는지 세면 몇 번째인지 알 수 있어요.", mission: "첫째 수에서 얼마나 커졌는지 먼저 구해 보세요." },
  explanation: { headline: "첫째 수에서 늘어난 만큼을 늘어나는 수로 나누면 더한 횟수가 나오고, 거기에 1을 더하면 몇 번째인지 알 수 있습니다.",
    steps: ["첫째 수와 늘어나는 수를 찾습니다.", "구하려는 수에서 첫째 수를 뺍니다.", "그 수가 늘어나는 수 몇 번인지 구합니다.", "더한 횟수에 1을 더하면 몇 번째 수입니다."] },
  experience: { ...JSON.parse(JSON.stringify(book.lessons[no("time-unit-source")].experience)), family: "reverse-sequence-b7", title: "몇 번째 수인지 거꾸로 찾아요",
    beats: [
      { id: "reverse-sequence-step-1", action: "reveal", caption: "5, 9, 13, 17 …은 4씩 커집니다.", visual: seq([5, 9, 13, 17]) },
      { id: "reverse-sequence-step-2", action: "highlight", caption: "25는 첫째 수 5보다 20 커요. 20은 4를 5번 더한 수예요.", visual: eq("5+4×5=25") },
      { id: "reverse-sequence-step-3", action: "verify", caption: "1층에서 5층 더 올라가면 6층이에요. 25는 6번째 수예요.", visual: seq([5, 9, 13, 17, 21, 25]) }
    ], hint: "첫째 수에서 몇 번 더했는지 셉니다.",
    check: { prompt: "2, 5, 8, 11 …에서 20은 몇 번째 수일까요?", options: ["6", "7", "8"], answerRef: `/books/book-07/lessons/${L14No}/experience/check` } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L14Specs.length, structureKey: "reverse-sequence-source", prompt: "식을 세워 거꾸로 풀어 □와 몇 번째 수를 구하시오.", items: build(L14No, "reverse-sequence-source", "식 세워 거꾸로 풀기", L14Specs) },
  extension: { title: "추가 학습", structureKey: "reverse-sequence-source", story: "5씩 커지는 수열에서 몇 번째 수인지 거꾸로 찾습니다.", prompt: "6, 11, 16, 21 …에서 61은 몇 번째 수입니까?", visual: seq([6, 11, 16, 21]),
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-07/lessons/${L14No}/extension` }
};
book.lessons.push(L14);

// ── 장부 · 보류 ──
const units = (specs) => specs.length;
const byPage = {};
for (const s of [...L6Specs, ...L7Specs, ...L1Specs, ...L14Specs]) (byPage[Number(s.no.slice(5, 7))] ||= []).push(s);
for (let page = 9; page <= 25; page += 1) {
  const specs = byPage[page];
  if (!specs) throw new Error(`page ${page} empty`);
  const entry = book.sourceCoverage.pageLedger.find((e) => e.page === page);
  Object.assign(entry, { releasedItems: specs.length, releasedAnswerUnits: units(specs), heldRecords: 0, heldAnswerUnits: 0 });
}
book.sourceHold = book.sourceHold.filter((h) => !(h.sourcePage >= 9 && h.sourcePage <= 25));
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
console.log("book07 batch2 patched", { L6: L6Specs.length, L7: L7Specs.length, L1: L1Specs.length, L14: L14Specs.length, lessonNos: [L6No, L7No, L1No, L14No], holds: book.sourceHold.length, coverage: { ...book.sourceCoverage, pageLedger: undefined } });
