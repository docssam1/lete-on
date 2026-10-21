// 골든벨 8권 묶음 1: 교사용 슬라이드 2~6 「활동 01 묶음수와 덧셈 매트릭스」.
// 단원 0 자리에 2·3·5·6쪽 덧셈 매트릭스 16문항을 다시 짜고, 4쪽 묶음수 연습과 5쪽 저울 (5)는 새 단원 7로 단원 0 바로 뒤에 둔다.
// 3·4쪽 8문항은 예전에 보충 문항(golden-bell-recovery-data.js)으로 들어가 있었으므로 그 파일에서 8권 묶음을 지운다(같은 문항이 두 번 보이지 않게).
// 옛 단원 0 개념 설명은 원본 (1)번 문항을 그대로 풀고 마지막에 그 답을 적었다 → 원본에 없는 새 예시로 바꾼다.
// 장부를 7권과 같은 쪽 장부(pageLedger)로 바꾼다. 이 스크립트에는 정답이 없다.
// node patch-book08-batch1.mjs <golden-bell-data.js 경로> <golden-bell-recovery-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const [file, recoveryFile] = process.argv.slice(2);
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-08");
if (book.lessons.some((l) => l.id === "bundle-number-source")) throw new Error("already patched");
const L0No = book.lessons.findIndex((l) => l.id === "addition-sum-matrix"), L0 = book.lessons[L0No];
if (L0No !== 0) throw new Error("unexpected lesson 0");

const withParts = (item, labels) => ({ ...item, parts: labels.map((label, k) => ({ id: String.fromCharCode(97 + k), label, answerRef: `${item.answerRef}/parts/${k}` })) });
const build = (lessonNo, lessonId, topic, specs) => specs.map((spec, k) => {
  let item = { id: `book08-src-${spec.no.slice(4).toLowerCase()}`, sourcePage: Number(spec.no.slice(5, 7)), sourceNo: spec.no, lessonId, topic,
    typeLabel: spec.type, sourceLocator: spec.loc, printGroup: spec.group, answerMode: "input", inputMode: "numeric", prompt: spec.prompt,
    answerRef: `/books/book-08/lessons/${lessonNo}/original/items/${k}`, visual: spec.visual };
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  if (spec.parts) { item = withParts(item, spec.parts); delete item.answerMode; delete item.inputMode; }
  return item;
});
const V = (subtype, v) => ({ kind: "book5", subtype, ...v });
const grid = (cells, rows, cols) => V("source-sum-grid", { cells: cells.map((r) => [...r.replaceAll(" ", "")]), rows, cols });
const NOTE = (lines) => V("source-note-box", { lines });
const A1 = "활동 01 묶음수와 덧셈 매트릭스";

// ── 단원 0: 덧셈 매트릭스 (2·3·5·6쪽) ──
const P1 = "다음 매트릭스에서 같은 모양은 같은 수를 나타낼 때, 빈 칸에 알맞은 수를 써 넣으시오.";
const P3 = "다음 그림에서 같은 도형은 같은 수를 나타냅니다. 같은 도형의 묶음을 찾아 이용하여 도형이 나타내는 수를 구하고, 빈 칸에 들어갈 수를 구하시오.";
const MARKED = "원본 물음의 「표시된 묶음」은 수업 중 선생님이 그려 주는 표시라 문제지에는 없어, 「같은 도형의 묶음을 찾아」로 고쳤습니다.";
const _ = "";
const M = [
  // [쪽, 번호, 칸, 가로 합, 세로 합] — null은 빈 칸(물음), ""는 원본에도 합이 없는 자리
  [2, 1, ["□□□", "□△☆", "△◎◎"], [24, 17, 10], [20, 15, null]],
  [2, 2, ["□△☆", "□□△", "□◎△"], [14, 15, 10], [18, null, 11]],
  [2, 3, ["☆△△", "□□□", "□◎☆"], [5, 12, 10], [9, 11, null]],
  [2, 4, ["△☆◎", "□△☆", "□□□"], [20, 29, 36], [34, 29, null]],
  [3, 5, ["△△△△", "□☆☆☆", "□○○○", "△☆○□"], [20, 12, 18, 17], [22, 13, 15, null]],
  [3, 6, ["△□□□", "△□☆☆", "△△○○", "△○☆□"], [21, 17, 20, 18], [24, 20, 15, null]],
  [3, 7, ["☆△○○", "□□△☆", "△△△△", "△□□□"], [22, 20, 36, 18], [26, 24, 25, null]],
  [3, 8, ["□□△□", "☆☆△□", "□△△□", "○○△○"], [25, 27, 30, 22], [20, null, 40, 19]],
  [5, 1, ["○□○□", "□□○□"], [12, 10], [_, _, _, null]],
  [5, 2, ["○□□○", "○□○○"], [18, 19], [_, _, _, null]],
  [5, 3, ["○□□○", "☆◇○◎", "□□□○"], [24, null, 22], [15, 18, 17, 20]],
  [5, 4, ["☆○□□", "☆△☆□", "○○□○"], [17, null, 15], [7, 10, 14, 15]],
  [6, 5, ["○☆□□", "☆○△□", "○○△△", "☆○△○"], [12, 16, 22, null], [12, 14, 24, 17]],
  [6, 6, ["○△○△", "○○△○", "☆◇☆◇", "○☆△△"], [30, 27, 36, 32], [26, 33, 32, null]],
  [6, 7, ["○□○□", "○□☆☆", "○□○◇", "□○○☆"], [10, 11, 14, 12], [13, 7, 15, null]],
  // 6쪽 (8): 원본 첫째 가로줄 합에 숫자 하나가 빠져 있다(나머지 일곱 줄로 도형값이 하나로 정해지고 이 줄만 맞지 않는다) → 그 값으로 고친다.
  [6, 8, ["○○△☆", "△△☆△", "☆△☆△", "◇◇☆◇"], [35, 31, 30, 25], [31, 32, 29, null], "원본 첫째 가로줄의 합에 숫자 하나가 빠져 있어(나머지 일곱 줄의 조건과 맞지 않음), 다른 줄로 정해지는 값으로 고쳤습니다. 빈 칸의 답은 이 줄과 관계없습니다."]
];
const L0Specs = M.map(([page, n, cells, rows, cols, fix]) => {
  const bundle = page >= 5, sec = page === 2 || page === 3 ? "01" : "03";
  const size = `${cells.length}×${cells[0].length}`;
  return { no: `GB8-S0${page}-${sec}-${n}`, loc: `교사용 슬라이드 ${page} · ${A1} ${bundle ? "3. 덧셈 매트릭스에서 묶음수 연습" : "1. 덧셈 매트릭스 연습"} (${n})`,
    group: page * 10 + (page === 5 || page === 6 ? (n % 4 === 1 || n % 4 === 2 ? 1 : 2) : 1),
    type: bundle ? `${size} 매트릭스 · 묶음으로 도형값 찾기` : `${size} 매트릭스 · 빈 칸의 합`, prompt: bundle ? P3 : P1, visual: grid(cells, rows, cols), ...(bundle ? { discrepancy: fix ? `${MARKED} ${fix}` : MARKED } : {}) };
});
const L0Ex = grid(["○○○", "○△□", "△□□"], [15, 12, null], [13, 12, 13]);
Object.assign(L0, {
  title: "덧셈 매트릭스", sourceLocator: `교사용 슬라이드 2·3·5·6 · ${A1} 1. 덧셈 매트릭스 연습 · 3. 덧셈 매트릭스에서 묶음수 연습`,
  representativeConcept: "같은 도형은 같은 수이므로, 한 가지 도형만 있는 줄이나 같은 묶음이 들어 있는 줄부터 값을 찾아 다른 줄에 바꾸어 넣음",
  story: { title: "도형 암호판의 합", text: "가로줄 끝의 수와 세로줄 아래의 수는 그 줄에 있는 도형들의 합입니다.", mission: "한 가지 도형만 있는 줄이나 같은 묶음이 보이는 줄을 먼저 찾으세요." },
  explanation: { headline: "한 가지 도형만 있는 줄이 가장 좋은 출발점입니다. 그런 줄이 없으면 두 줄에 함께 들어 있는 묶음을 찾습니다.",
    steps: ["같은 도형만 있는 줄의 합을 도형 개수로 나누어 도형 하나의 값을 찾습니다.", "○와 □처럼 함께 자주 나오는 묶음의 합을 먼저 구해도 됩니다.", "알게 된 값을 다른 줄에 바꾸어 넣어 남은 도형을 찾습니다.", "빈 칸의 합을 계산한 뒤 모든 줄의 합이 맞는지 확인합니다."] }
});
L0.experience = { ...L0.experience, title: "덧셈 매트릭스의 빈 칸을 채워요", visualProgression: null,
  beats: [
    { id: "addition-sum-matrix-step-1", action: "reveal", caption: "가로줄 끝과 세로줄 아래의 수는 그 줄에 있는 도형들의 합이에요. 셋째 가로줄의 합이 비어 있어요.", visual: L0Ex },
    { id: "addition-sum-matrix-step-2", action: "highlight", caption: "첫째 가로줄은 ○만 세 개예요. 15를 셋으로 나누면 ○ 하나는 5예요. 첫째 세로줄에서 △를 찾아요.", visual: NOTE(["○ + ○ + ○ = 15 → ○ = 5", "○ + ○ + △ = 13 → △ = 3"]) },
    { id: "addition-sum-matrix-step-3", action: "verify", caption: "둘째 가로줄에서 □를 찾고, 빈 칸은 △ + □ + □로 계산해요.", visual: NOTE(["○ + △ + □ = 12 → □ = 4", "△ + □ + □ = 3 + 4 + 4 = 11"]) }
  ], hint: "한 가지 도형만 있는 줄부터 찾으세요." };
L0.original = { ...L0.original, title: "골든벨", mode: "paged", sourceQuestionCount: L0Specs.length, prompt: "같은 모양은 같은 수를 나타냅니다. 빈 칸에 알맞은 수를 구하시오.", items: build(L0No, L0.id, "덧셈 매트릭스", L0Specs) };
delete L0.original.visual;
// 추가 학습은 수를 그대로 두고 그림만 원본 모양으로(답 기록 그대로). 유사문제는 도형값이 그림에 적혀 있어 새 매트릭스로 바꾼다(DB 답도 교체).
const ext = L0.extension.visual;
if (ext.subtype !== "sum-matrix") throw new Error("unexpected L0 extension");
L0.extension.visual = grid(ext.cells.map((r) => r.join("")), ext.rowTotals, ext.columnTotals.map((v) => (v === "?" ? null : v)));
L0.extension.prompt = "빈 칸에 들어갈 합을 쓰세요.";
L0.similarPractice = [{ ...L0.similarPractice[0], prompt: "같은 모양은 같은 수를 나타냅니다. 빈 칸에 알맞은 수를 쓰세요.", visual: grid(["☆☆☆", "☆□○", "□○○"], [12, 13, null], [14, 13, 10]) }];
delete L0.similarPractice[0].generatorId;

// ── 새 단원 7: 묶음수 연습 (4쪽 · 5쪽 (5)) ──
const L7No = book.lessons.length, L7Id = "bundle-number-source";
const eq = (text) => text.split(" ").map((t) => ({ "○": "circle", "□": "square" })[t] ?? t);
const shapes = (rows) => V("source-shape-equations", { rows: rows.map(eq), ask: ["square"] });
const PE = "다음 식에서 같은 모양은 같은 수를 나타냅니다. □가 나타내는 수를 구하시오.";
const PS = "저울 위에 공(○)과 상자(□)를 올려놓았습니다. 같은 모양은 무게가 같습니다.";
const scales = (a, b, ask) => V("source-kitchen-scales", { scales: [a, b], ask, ...(ask.length > 1 ? { numbered: true } : {}) });
const L7Specs = [
  { no: "GB8-S04-02-1", loc: `교사용 슬라이드 4 · ${A1} 2. 묶음수 연습 (1)`, group: 41, type: "두 식의 묶음수", prompt: PE, visual: shapes(["○ + □ = 17", "□ + ○ + ○ = 20"]) },
  { no: "GB8-S04-02-2", loc: `교사용 슬라이드 4 · ${A1} 2. 묶음수 연습 (2)`, group: 41, type: "두 식의 묶음수", prompt: PE, visual: shapes(["○ + □ + □ + ○ = 24", "○ + ○ + □ + ○ = 20"]) },
  { no: "GB8-S04-02-3", loc: `교사용 슬라이드 4 · ${A1} 2. 묶음수 연습 (3)`, group: 41, type: "두 식의 묶음수", prompt: PE, visual: shapes(["○ + □ + □ = 12", "○ + □ + ○ + ○ + □ = 16"]) },
  { no: "GB8-S04-02-4", loc: `교사용 슬라이드 4 · ${A1} 2. 묶음수 연습 (4)`, group: 42, type: "두 저울의 묶음수", prompt: `${PS} □ 한 개의 무게는 몇 g입니까?`,
    visual: scales({ rows: [["○"], ["□", "□"]], weight: "21g" }, { rows: [["□", "□"], ["○", "○", "○"]], weight: "27g" }, ["□"]) },
  { no: "GB8-S05-02-5", loc: `교사용 슬라이드 5 · ${A1} 2. 묶음수 연습 (5)`, group: 51, type: "두 저울의 묶음수", prompt: `${PS} 다음은 각각 몇 g입니까?`,
    visual: scales({ rows: [["□"], ["○", "○"]], weight: "13g" }, { rows: [["○"], ["□", "□"]], weight: "17g" }, [["□", "+", "○"], "□", "○"]), parts: ["① □ + ○", "② □", "③ ○"] }
];
const template = () => JSON.parse(JSON.stringify(L0.experience));
const L7 = {
  id: L7Id, unit: L0.unit, title: "묶음수 연습", sourceLocator: `교사용 슬라이드 4~5 · ${A1} 2. 묶음수 연습`, sourceTypeIds: ["book08-bundle-number-source"],
  representativeConcept: "두 식(두 저울)에 함께 들어 있는 묶음을 찾아 그 합을 빼면 남은 모양의 값이 나옴",
  story: { title: "묶음수", text: "○ + □처럼 여러 번 나오는 모양의 짝을 묶음이라고 해요. 묶음의 합을 알면 나머지를 쉽게 찾아요.", mission: "두 식에 똑같이 들어 있는 묶음을 먼저 찾아 보세요." },
  explanation: { headline: "두 식에 같은 묶음이 들어 있으면, 그 묶음의 합을 빼서 남은 모양의 값을 구합니다.",
    steps: ["두 식을 나란히 놓고 똑같이 들어 있는 모양의 묶음을 찾습니다.", "한 식에서 그 묶음의 합을 알아냅니다.", "다른 식의 합에서 묶음의 합을 빼면 남은 모양의 값이 됩니다.", "두 저울을 모두 더한 무게를 이용하는 방법도 있습니다."] },
  experience: { ...template(), family: "bundle-number-b8", title: "묶음을 찾아 빼요",
    beats: [
      { id: "bundle-number-step-1", action: "reveal", caption: "두 식에 ○ + □ 묶음이 똑같이 들어 있어요.", visual: V("source-shape-equations", { rows: [eq("○ + □ = 10"), eq("○ + □ + □ = 16")], ask: ["square"] }) },
      { id: "bundle-number-step-2", action: "highlight", caption: "둘째 식에서 ○ + □ 묶음(10)을 빼면 □ 하나가 남아요.", visual: NOTE(["○ + □ + □ = 16", "(○ + □) + □ = 10 + □ = 16"]) },
      { id: "bundle-number-step-3", action: "verify", caption: "□는 16 − 10 = 6이에요. 첫째 식에서 ○는 10 − 6 = 4예요.", visual: NOTE(["□ = 16 − 10 = 6", "○ = 10 − 6 = 4"]) }
    ], hint: "두 식에 똑같이 들어 있는 묶음을 찾으세요.",
    check: { prompt: "○ + □ = 9이고 ○ + □ + □ = 14일 때 □는 얼마일까요?", options: ["4", "5", "9"], answerRef: `/books/book-08/lessons/${L7No}/experience/check` } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L7Specs.length, structureKey: L7Id, prompt: "같은 모양은 같은 수(같은 무게)를 나타냅니다. 묶음을 찾아 구하시오.", items: build(L7No, L7Id, "묶음수", L7Specs) },
  extension: { title: "추가 학습", structureKey: L7Id, story: "두 저울에 같은 묶음이 있습니다.", prompt: `${PS} □ 한 개의 무게는 몇 g입니까?`,
    visual: scales({ rows: [["○"], ["□", "□"]], weight: "16g" }, { rows: [["□", "□"], ["○", "○", "○"]], weight: "20g" }, ["□"]),
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-08/lessons/${L7No}/extension` }
};
delete L7.experience.visualProgression;
book.lessons.splice(L0No + 1, 0, L7);
book.lessonIntegration.newLessonIds = [...new Set([...book.lessonIntegration.newLessonIds, L7Id])];

// ── 장부: 쪽 장부로. 아직 대조하지 않은 쪽의 옛 보류는 첫 쪽에 걸고 나머지 쪽에도 기록 1건으로 적는다. ──
const pageOf = (item) => item.sourcePage ?? Number(String(item.sourceNo).match(/^S(\d+)/)[1]);
const units = (item) => item.parts?.length || 1;
const holdPages = (h) => { const m = String(h.sourceNo).match(/^S(\d+)(?:-S(\d+))?/); const a = Number(m[1]), b = Number(m[2] || m[1]); return Array.from({ length: b - a + 1 }, (_, k) => a + k); };
book.sourceHold = book.sourceHold.filter((h) => !["S3", "S4", "S5-S6"].includes(h.sourceNo)).map((h) => ({ ...h, sourcePage: holdPages(h)[0] }));
const items = book.lessons.flatMap((l) => l.original.items);
const TITLES = [1, 12, 20, 30];
const pageLedger = Array.from({ length: 39 }, (_, k) => {
  const page = k + 1, list = items.filter((it) => pageOf(it) === page), holds = book.sourceHold.filter((h) => holdPages(h).includes(page));
  return { page, ...(TITLES.includes(page) ? { title: true } : {}), releasedItems: list.length, releasedAnswerUnits: list.reduce((n, it) => n + units(it), 0),
    heldRecords: holds.length, heldAnswerUnits: holds.filter((h) => h.sourcePage === page).reduce((n, h) => n + h.sourceHold.itemCount, 0) };
});
const { slides } = book.sourceCoverage;
book.sourceCoverage = { slides, titleSlides: TITLES.length, sourceLessons: book.lessons.length,
  publicItems: pageLedger.reduce((n, e) => n + e.releasedItems, 0), publicAnswerUnits: pageLedger.reduce((n, e) => n + e.releasedAnswerUnits, 0),
  holdItems: book.sourceHold.length, heldAnswerUnits: pageLedger.reduce((n, e) => n + e.heldAnswerUnits, 0), totalAnswerUnits: 0, pageLedger };
book.sourceCoverage.totalAnswerUnits = book.sourceCoverage.publicAnswerUnits + book.sourceCoverage.heldAnswerUnits;
if (items.length !== book.sourceCoverage.publicItems) throw new Error("ledger misses items");

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");

// 보충 문항: 8권 묶음(3·4쪽)은 이제 원본 문항이다.
const rec = await readFile(recoveryFile, "utf8");
const at = rec.indexOf("Object.freeze(") + 14, end = rec.lastIndexOf(");");
const groups = JSON.parse(rec.slice(at, end)), kept = groups.filter((g) => g.bookId !== "book-08");
if (kept.length !== groups.length - 1) throw new Error("no book-08 recovery group");
await writeFile(recoveryFile, rec.slice(0, at) + JSON.stringify(kept) + rec.slice(end), "utf8");
const { pageLedger: _l, ...coverage } = book.sourceCoverage;
console.log("book08 batch1 patched", { L0: L0Specs.length, L7: L7Specs.length, holds: book.sourceHold.map((h) => h.sourceNo), coverage, recovery: kept.map((g) => g.bookId) });
