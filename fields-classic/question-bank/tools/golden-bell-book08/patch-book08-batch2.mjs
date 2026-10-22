// 골든벨 8권 묶음 2: 교사용 슬라이드 7~11 「활동 02 도형이 나타내는 수와 곱셈 매트릭스」.
// 단원 1 자리에 7~9쪽 도형식 6문항을 원본 문장대로 다시 짠다(옛 문항은 수의 범위 조건이 빠져 답이 하나로 정해지지 않았다).
// 10~11쪽 곱셈 매트릭스 8문항은 새 단원 8로 단원 1 바로 뒤에 둔다. 판을 완성하는 문항이라
// 「가로줄마다·세로줄마다 들어가는 두 수」를 칸 물음(쉼표, 순서 무관)으로 묻는다 — 두 가지를 다 알면 칸 위치까지 하나로 정해진다.
// 이 스크립트에는 정답이 없다. node patch-book08-batch2.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-08");
if (book.lessons.some((l) => l.id === "product-matrix-source")) throw new Error("already patched");
const L1At = book.lessons.findIndex((l) => l.id === "shape-equation-targets"), L1 = book.lessons[L1At];
const L1No = Number(L1.extension.answerRef.match(/lessons\/(\d+)\//)[1]);
if (L1No !== 1) throw new Error("unexpected lesson number");

const withParts = (item, parts) => ({ ...item, parts: parts.map((p, k) => ({ id: String.fromCharCode(97 + k), ...(typeof p === "string" ? { label: p } : p), answerRef: `${item.answerRef}/parts/${k}` })) });
const build = (lessonNo, lessonId, topic, specs) => specs.map((spec, k) => {
  let item = { id: `book08-src-${spec.no.slice(4).toLowerCase()}`, sourcePage: Number(spec.no.slice(5, 7)), sourceNo: spec.no, lessonId, topic,
    typeLabel: spec.type, sourceLocator: spec.loc, printGroup: spec.group, answerMode: "input", inputMode: "numeric", prompt: spec.prompt,
    answerRef: `/books/book-08/lessons/${lessonNo}/original/items/${k}`, visual: spec.visual };
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  if (spec.parts) { item = withParts(item, spec.parts); delete item.answerMode; delete item.inputMode; }
  return item;
});
const V = (subtype, v) => ({ kind: "book5", subtype, ...v });
const NAME = { "○": "circle", "□": "square", "△": "triangle", "☆": "star", "◇": "diamond", "◎": "dcircle", "▣": "squarein", "●": "dot" };
const tok = (eq) => [...eq.replaceAll(" ", "")].map((c) => NAME[c] ?? c);
const eqs = (list, ask) => V("source-shape-equations", { rows: list.map(tok), ask: ask ? [NAME[ask] ?? ask] : [] });
const A2 = "활동 02 도형이 나타내는 수와 곱셈 매트릭스";

// ── 단원 1: 도형이 나타내는 수 (7~9쪽) ──
const DIFF = (n) => `다음 식을 만족하는 1에서 ${n}까지의 서로 다른 수입니다.`;
const L1Specs = [
  { no: "GB8-S07-01-1", page: 7, n: 1, prompt: "다음 식에서 각 도형은 0에서 4까지의 수 중에서 하나씩을 나타냅니다. ○이 나타내는 수를 구하시오.", visual: eqs(["□+☆=□", "□×◇=□", "□×□=△", "◇+○=△"], "○") },
  { no: "GB8-S07-01-2", page: 7, n: 2, prompt: "다음 식에서 각 도형은 1에서 6까지의 수 중에서 하나씩을 나타냅니다. ◇이 나타내는 수를 구하시오. (단, ○는 ◇보다 큽니다.)", visual: eqs(["□+□=△", "□×☆=△", "△-○=◇", "☆×☆=◎"], "◇") },
  { no: "GB8-S08-01-3", page: 8, n: 3, prompt: "다음 식에서 각 도형은 1에서 9까지의 수 중에서 하나씩을 나타냅니다. ◎가 나타내는 수를 구하시오.", visual: eqs(["△×△×△=☆", "▣×▣=●", "◇×△=☆", "▣+◇=◎"], "◎") },
  { no: "GB8-S08-01-4", page: 8, n: 4, prompt: `㉠, ㉡, ㉢, ㉣은 ${DIFF(4)} ㉢이 나타내는 수를 구하시오.`, visual: eqs(["㉠×㉠=㉠+㉠", "㉠×㉡=㉠", "㉠+㉠=㉣", "㉡+㉠=㉢"], "㉢") },
  { no: "GB8-S09-01-5", page: 9, n: 5, prompt: `㉠, ㉡, ㉢, ㉣은 ${DIFF(9)} 다음 식을 보고 각각의 문자가 나타내는 수를 쓰시오.`, visual: eqs(["㉠×㉠×㉠=㉡+㉡", "㉢+㉢+㉢=㉣", "㉢×㉣=㉣"]), parts: ["㉠", "㉡", "㉢", "㉣"] },
  { no: "GB8-S09-01-6", page: 9, n: 6, prompt: `㉠, ㉡, ㉢, ㉣, ㉤, ㉥은 ${DIFF(9)} 다음 식을 보고 각각의 문자가 나타내는 수를 쓰시오.`, visual: eqs(["㉠×㉠=㉡", "㉢×㉢=㉣", "㉠×㉡=㉤", "㉣-㉡=㉥"]), parts: ["㉠", "㉡", "㉢", "㉣", "㉤", "㉥"],
    discrepancy: "원본에서 이 문항의 번호가 (4)로 다시 나와 (6)으로 고쳤습니다." }
].map((s) => ({ ...s, loc: `교사용 슬라이드 ${s.page} · ${A2} 1. 도형이 나타내는 수 (${s.n})`, group: s.page * 10 + 1, type: s.parts ? "서로 다른 수 · 모든 문자의 값" : s.n <= 3 ? "도형식 · 목표 도형의 값" : "서로 다른 수 · 목표 문자의 값" }));
Object.assign(L1, { title: "도형이 나타내는 수", sourceLocator: `교사용 슬라이드 7~9 · ${A2} 1. 도형이 나타내는 수`,
  representativeConcept: "0·1의 성질(□ + 0 = □, □ × 1 = □)과 곱셈구구로 후보를 줄이고, 서로 다른 수라는 조건으로 하나씩 정함",
  story: { title: "도형이 나타내는 수", text: "식마다 같은 도형은 같은 수, 다른 도형은 다른 수예요.", mission: "□ + ☆ = □처럼 0이나 1이 바로 보이는 식부터 찾아보세요." },
  explanation: { headline: "더해도 그대로면 0, 곱해도 그대로면 1입니다. 그다음 같은 수를 곱하는 식으로 후보를 줄입니다.",
    steps: ["□ + ☆ = □이면 ☆ = 0, □ × ◇ = □이면 ◇ = 1입니다.", "△ × △ × △처럼 같은 수를 곱하는 식은 후보가 적습니다.", "다른 도형은 다른 수라는 조건으로 남은 후보를 지웁니다.", "찾은 값을 모든 식에 넣어 확인합니다."] } });
L1.original = { ...L1.original, title: "골든벨", mode: "paged", sourceQuestionCount: L1Specs.length, prompt: "각 도형(문자)이 나타내는 수를 구하시오.", items: build(L1No, L1.id, "도형이 나타내는 수", L1Specs) };

// ── 새 단원 8: 곱셈 매트릭스 (10~11쪽) ──
const L8No = 8, L8Id = "product-matrix-source";
if (book.lessons.some((l) => (l.extension?.answerRef || "").includes(`/lessons/${L8No}/`))) throw new Error("lesson number 8 taken");
const POOL = ["2", "3", "4", "5", "6", "7", "8", "9"];
const P1 = "다음 그림의 빈칸에 주어진 수를 한 번씩 넣어 한 줄 위의 곱이 오른쪽과 아래쪽의 수가 되도록 만들어 보시오. (단, 색칠된 칸에는 수가 들어가지 않습니다.)";
const P2 = "다음은 2에서 9까지의 수를 한 번씩 넣어 만든 곱셈 매트릭스입니다. 각 줄에 수를 두 개씩 넣어 가로줄에 있는 두 수의 곱은 오른쪽, 세로줄에 있는 두 수의 곱은 아래쪽에 있는 수가 되도록 매트릭스를 완성하시오.";
const ASK = " (가로줄마다, 세로줄마다 들어가는 두 수를 쉼표로 쓰시오.)";
const ORD = ["첫째", "둘째", "셋째", "넷째"];
const lineParts = [...ORD.map((o) => `${o} 가로줄`), ...ORD.map((o) => `${o} 세로줄`)].map((label) => ({ label, inputMode: "text", resultContract: { type: "set" } }));
const toShaded = (white) => white.flatMap((cols, r) => [0, 1, 2, 3].filter((c) => !cols.includes(c)).map((c) => [r, c]));
const PM = [
  // [쪽, 묶음, 번호, 가로 곱, 세로 곱, 수가 들어가는 칸(없으면 학생이 정함), 수 목록 표시]
  [10, "02", 1, [12, 54, 14, 40], [18, 21, 30, 32], [[1, 3], [0, 2], [0, 1], [2, 3]], true],
  [10, "02", 2, [12, 45, 56, 12], [14, 15, 36, 48], [[0, 3], [1, 2], [0, 3], [1, 2]], true],
  [10, "03", 1, [24, 20, 63, 12], [28, 27, 16, 30], null, true],
  [10, "03", 2, [30, 63, 16, 12], [10, 27, 42, 32], null, true],
  [11, "03", 1, [63, 18, 16, 20], [28, 40, 6, 54], null, false],
  [11, "03", 2, [28, 30, 27, 16], [35, 18, 48, 12], null, false],
  [11, "03", 3, [54, 16, 21, 20], [40, 42, 36, 6], null, false],
  [11, "03", 4, [24, 20, 42, 18], [12, 72, 14, 30], null, false]
];
const L8Specs = PM.map(([page, sec, n, rows, cols, white, pool]) => ({
  no: `GB8-S${page}-${sec}-${n}`, loc: `교사용 슬라이드 ${page} · ${A2} 2. 곱셈 매트릭스 (${n})`, group: page * 10 + (sec === "02" ? 1 : page === 10 ? 2 : n <= 2 ? 3 : 4),
  type: white ? "색칠 칸이 있는 곱셈 매트릭스" : "두 칸씩 넣는 곱셈 매트릭스", prompt: (white ? P1 : P2) + ASK,
  visual: V("source-product-grid", { shaded: white ? toShaded(white) : [], ...(white ? { shadedEmpty: true } : {}), rowProducts: rows, columnProducts: cols, ...(pool ? { pool: POOL } : {}) }),
  parts: lineParts, ...(white ? { discrepancy: "원본 물음의 「한 줄의 위의 곱」을 「한 줄 위의 곱」으로 고쳤습니다." } : {})
}));
const NOTE = (lines) => V("source-note-box", { lines });
const template = () => JSON.parse(JSON.stringify(book.lessons.find((l) => l.id === "bundle-number-source").experience));
const L8 = {
  id: L8Id, unit: "묶음수와 매트릭스", title: "곱셈 매트릭스", sourceLocator: `교사용 슬라이드 10~11 · ${A2} 2. 곱셈 매트릭스`, sourceTypeIds: ["book08-product-matrix-source"],
  representativeConcept: "두 수의 곱이 한 가지로만 나오는 줄(63 = 7 × 9처럼)부터 채우고, 쓴 수는 다시 쓰지 않음",
  story: { title: "곱셈 매트릭스", text: "가로줄 오른쪽의 수는 그 줄 두 수의 곱, 세로줄 아래의 수는 그 줄 두 수의 곱이에요.", mission: "곱이 한 가지로만 나오는 줄부터 찾아보세요." },
  explanation: { headline: "곱셈구구에서 짝이 하나뿐인 곱부터 정합니다. 5와 7이 들어간 곱은 짝이 적어 찾기 쉽습니다.",
    steps: ["2~9 중 두 수의 곱이 한 가지로만 나오는 줄을 찾습니다(예: 63 = 7 × 9).", "5단, 7단, 9단처럼 짝이 적은 수부터 자리를 정합니다.", "한 줄에 두 수가 채워지면 남은 칸은 비웁니다.", "쓴 수는 다시 쓰지 않으므로 남은 수로 나머지 줄을 채우고 모든 곱을 확인합니다."] },
  experience: { ...template(), family: "product-matrix-b8", title: "짝이 하나뿐인 곱부터",
    beats: [
      { id: "product-matrix-step-1", action: "reveal", caption: "2~9 중 두 수를 곱해 63이 되는 것은 7 × 9 하나뿐이에요. 12는 2 × 6도 되고 3 × 4도 돼요.", visual: NOTE(["63 = 7 × 9 → 한 가지", "12 = 2 × 6 = 3 × 4 → 두 가지"]) },
      { id: "product-matrix-step-2", action: "highlight", caption: "5가 들어간 곱은 10, 15, 20, 30, 35, 40, 45예요. 5의 짝을 먼저 찾으면 쉬워요.", visual: NOTE(["35 = 5 × 7", "40 = 5 × 8"]) },
      { id: "product-matrix-step-3", action: "verify", caption: "한 번 쓴 수는 다시 쓰지 않아요. 남은 수로 나머지 줄을 채우고 모든 곱을 확인해요.", visual: NOTE(["2, 3, 4, 5, 6, 7, 8, 9", "쓴 수를 하나씩 지워요"]) }
    ], hint: "곱이 한 가지로만 나오는 줄부터 찾으세요.",
    check: { prompt: "2에서 9까지의 서로 다른 두 수를 곱해 56이 되는 두 수는?", options: ["7과 8", "6과 9", "4와 14"], answerRef: `/books/book-08/lessons/${L8No}/experience/check` } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L8Specs.length, structureKey: L8Id, prompt: "곱셈 매트릭스를 완성하시오.", items: build(L8No, L8Id, "곱셈 매트릭스", L8Specs) },
  extension: { title: "추가 학습", structureKey: L8Id, story: "곱이 한 가지로만 나오는 짝을 찾습니다.", prompt: "2에서 9까지의 서로 다른 두 수를 곱해 42가 되었습니다. 두 수를 쉼표로 쓰시오.",
    answerMode: "input", inputMode: "text", resultContract: { type: "set" }, extensionKind: "source-structured-authored", answerRef: `/books/book-08/lessons/${L8No}/extension` }
};
book.lessons.splice(L1At + 1, 0, L8);
book.lessonIntegration.newLessonIds = [...new Set([...book.lessonIntegration.newLessonIds, L8Id])];

// ── 장부 ──
const pageOf = (item) => item.sourcePage ?? Number(String(item.sourceNo).match(/^S(\d+)/)[1]);
const units = (item) => item.parts?.length || 1;
const holdPages = (h) => { const m = String(h.sourceNo).match(/^S(\d+)(?:-S(\d+))?/); const a = Number(m[1]), b = Number(m[2] || m[1]); return Array.from({ length: b - a + 1 }, (_, k) => a + k); };
book.sourceHold = book.sourceHold.filter((h) => !["S8-S9", "S10-S11"].includes(h.sourceNo));
const items = book.lessons.flatMap((l) => l.original.items);
for (const e of book.sourceCoverage.pageLedger) {
  const list = items.filter((it) => pageOf(it) === e.page), holds = book.sourceHold.filter((h) => holdPages(h).includes(e.page));
  Object.assign(e, { releasedItems: list.length, releasedAnswerUnits: list.reduce((n, it) => n + units(it), 0), heldRecords: holds.length,
    heldAnswerUnits: holds.filter((h) => h.sourcePage === e.page).reduce((n, h) => n + h.sourceHold.itemCount, 0) });
}
const L = book.sourceCoverage.pageLedger;
Object.assign(book.sourceCoverage, { sourceLessons: book.lessons.length, publicItems: L.reduce((n, e) => n + e.releasedItems, 0), publicAnswerUnits: L.reduce((n, e) => n + e.releasedAnswerUnits, 0),
  holdItems: book.sourceHold.length, heldAnswerUnits: L.reduce((n, e) => n + e.heldAnswerUnits, 0) });
book.sourceCoverage.totalAnswerUnits = book.sourceCoverage.publicAnswerUnits + book.sourceCoverage.heldAnswerUnits;
if (items.length !== book.sourceCoverage.publicItems) throw new Error("ledger misses items");

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
const { pageLedger: _l, ...coverage } = book.sourceCoverage;
console.log("book08 batch2 patched", { L1: L1Specs.length, L8: L8Specs.length, holds: book.sourceHold.map((h) => h.sourceNo), coverage });
