// 골든벨 8권 묶음 3: 교사용 슬라이드 13~19 「활동 01 피라미드 복면산 · 활동 02 복면산」.
// 단원 2 자리에 13~15쪽 13문항(같은 모양·여러 모양 피라미드, 빈칸의 합), 단원 3 자리에 16쪽 5문항(복면산 연습·도전)을 다시 짜고,
// 17~19쪽 14문항은 새 단원 9로 단원 3 바로 뒤에 둔다. 그림은 원본 세로셈 모양(source-crypt).
// 옛 16쪽 도전은 원본의 빈칸·㉠을 도형으로 바꿔 그리고 있었다. 17쪽 (3)은 원본 그림의 결과 가운데 칸을 바로잡는다(아래 주석).
// 이 스크립트에는 정답이 없다. node patch-book08-batch3.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-08");
if (book.lessons.some((l) => l.id === "crypt-source")) throw new Error("already patched");
const lesson = (id) => book.lessons.find((l) => l.id === id);
const numberOf = (l) => Number(l.experience.check.answerRef.match(/lessons\/(\d+)\//)[1]);
const L2 = lesson("pyramid-cryptarithm"), L3 = lesson("vertical-shape-cryptarithm");
if (numberOf(L2) !== 2 || numberOf(L3) !== 3) throw new Error("unexpected lesson numbers");

const withParts = (item, labels) => ({ ...item, parts: labels.map((label, k) => ({ id: String.fromCharCode(97 + k), label, answerRef: `${item.answerRef}/parts/${k}` })) });
const build = (lessonNo, lessonId, topic, specs) => specs.map((spec, k) => {
  let item = { id: `book08-src-${spec.no.slice(4).toLowerCase()}`, sourcePage: Number(spec.no.slice(5, 7)), sourceNo: spec.no, lessonId, topic,
    typeLabel: spec.type, sourceLocator: spec.loc, printGroup: spec.group, answerMode: "input", inputMode: "numeric", prompt: spec.prompt,
    answerRef: `/books/book-08/lessons/${lessonNo}/original/items/${k}`, visual: spec.visual };
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  if (spec.set) { item.inputMode = "text"; item.resultContract = { type: "set" }; }
  if (spec.parts) { item = withParts(item, [...spec.parts]); delete item.answerMode; delete item.inputMode; }
  return item;
});
const V = (subtype, v) => ({ kind: "book5", subtype, ...v });
const crypt = (rows, result, extra = {}) => V("source-crypt", { rows, result, ...extra });
const NOTE = (lines) => V("source-note-box", { lines });
const ONE = (s) => `같은 모양에는 같은 숫자가 들어갑니다. ${s}에 알맞은 숫자를 구하시오.`;
const MANY = "같은 모양에는 같은 숫자가, 다른 모양에는 다른 숫자가 들어갑니다. 각 모양에 알맞은 숫자를 구하시오.";
const A1 = "활동 01 피라미드 복면산", A2 = "활동 02 복면산";

// ── 단원 2: 피라미드 복면산 · 빈칸의 합 (13~15쪽) ──
const L2Specs = [
  ...[[["□", "□□"], "36", "□"], [["□", "□□"], "96", "□"], [["○", "○○", "○○○"], "615", "○"], [["△", "△△", "△△△"], "984", "△"]].map(([rows, res, s], k) => ({
    no: `GB8-S13-01-${k + 1}`, loc: `교사용 슬라이드 13 · ${A1} 1. 같은 모양만 있는 피라미드 복면산 (${k + 1})`, group: 131, type: "같은 모양만 있는 피라미드", prompt: ONE(s), visual: crypt(rows, res) })),
  ...[[["○", "○△"], "61", "○△"], [["☆", "☆□"], "82", "☆□"], [["□", "□△", "□△☆"], "305", "□△☆"], [["☆", "☆○", "☆○□"], "513", "☆○□"]].map(([rows, res, parts], k) => ({
    no: `GB8-S14-02-${k + 1}`, loc: `교사용 슬라이드 14 · ${A1} 2. 모양이 다양한 피라미드 복면산 (${k + 1})`, group: 141, type: "모양이 다양한 피라미드", prompt: MANY, visual: crypt(rows, res), parts })),
  ...[[["__", "_"], "100"], [["__", "_"], "106"], [["__", "__"], "189"], [["__", "__"], "192"], [["__", "__", "__"], "282"]].map(([rows, res], k) => ({
    no: `GB8-S15-03-${k + 1}`, loc: `교사용 슬라이드 15 · ${A1} 3. 빈칸의 합 구하기 (${k + 1})${k === 4 ? " 도전" : ""}`, group: k < 2 ? 151 : k < 4 ? 152 : 153, type: k === 4 ? "빈칸의 합 · 답이 여러 가지" : "빈칸의 합",
    prompt: `다음 □ 안에 들어갈 숫자의 합을 구하시오.${k === 4 ? " (답이 여러 개이면 쉼표로 모두 쓰시오.)" : ""}`, visual: crypt(rows, res), ...(k === 4 ? { set: true } : {}) }))
];
Object.assign(L2, { title: "피라미드 복면산", sourceLocator: `교사용 슬라이드 13~15 · ${A1} 1~3`,
  representativeConcept: "□ + □□ + □□□처럼 쌓인 수는 자리마다 같은 모양이 몇 개인지 세어 1, 11, 111배로 읽고, 빈칸의 합은 자리마다 합과 받아올림으로 구함",
  story: { title: "피라미드 복면산", text: "같은 모양이 계단처럼 쌓인 덧셈이에요. 맨 아래 줄은 세 자리, 그 위는 두 자리, 맨 위는 한 자리 수예요.", mission: "일의 자리에 같은 모양이 몇 개 있는지부터 세어 보세요." },
  explanation: { headline: "일의 자리부터 같은 모양이 몇 개 더해지는지 세고, 받아올림을 다음 자리에 넘깁니다.",
    steps: ["일의 자리에 같은 모양이 몇 개인지 셉니다(받아올림이 없는 경우와 있는 경우를 비교).", "다음 자리에는 받아올림을 더해 끝자리를 맞춥니다.", "빈칸의 합을 구할 때는 일의 자리 합을 먼저 정합니다. 한 자리 + 한 자리는 19가 될 수 없습니다.", "답이 여러 가지인 문제는 가능한 경우를 빠짐없이 찾습니다."] } });
L2.original = { ...L2.original, title: "골든벨", mode: "paged", sourceQuestionCount: L2Specs.length, prompt: "같은 모양에는 같은 숫자가 들어갑니다.", items: build(2, L2.id, "피라미드 복면산", L2Specs) };

// ── 단원 3: 복면산 연습 (16쪽) ──
const L3Specs = [
  ...[[["□4", "2□"], "○○2", "□○"], [["3□", "□5"], "◇◇2", "□◇"], [["□○", "□○"], "◇◇6", "○□◇"], [["7◇◇", "○5◇"], "□22", "○□◇"]].map(([rows, res, parts], k) => ({
    no: `GB8-S16-04-${k + 1}`, loc: `교사용 슬라이드 16 · ${A1} 4. 복면산 연습 (${k + 1})`, group: 161, type: "모양 복면산", prompt: MANY, visual: crypt(rows, res), parts })),
  { no: "GB8-S16-04-5", loc: `교사용 슬라이드 16 · ${A1} 4. 복면산 연습 도전`, group: 162, type: "1~8을 한 번씩 쓰는 복면산",
    prompt: "다음은 1에서 8까지의 숫자를 한 번씩만 사용하여 만든 덧셈식입니다. 복면산의 빈칸에 알맞은 수를 써넣고, ㉠에 알맞은 숫자를 구하시오.",
    visual: crypt(["_7_", "_5"], "2㉠_", { pool: ["1", "2", "3", "4", "5", "6", "7", "8"] }) }
];
Object.assign(L3, { title: "복면산 연습", sourceLocator: `교사용 슬라이드 16 · ${A1} 4. 복면산 연습`,
  representativeConcept: "일의 자리부터 더하며 같은 모양의 숫자와 받아올림을 찾고, 두 자리 + 두 자리의 백의 자리는 1임을 이용함",
  story: { ...L3.story, title: "복면산 연습", text: "같은 모양에는 언제나 같은 숫자가 들어가요. 세로셈의 자리마다 합과 받아올림을 맞추면 모양의 숫자를 찾을 수 있어요." } });
L3.original = { ...L3.original, title: "골든벨", mode: "paged", sourceQuestionCount: L3Specs.length, prompt: "같은 모양에는 같은 숫자가 들어갑니다.", items: build(3, L3.id, "복면산 연습", L3Specs) };
delete L3.original.visual;
const L3Ex = crypt(["□2", "4□"], "○○9");
L3.experience = { ...L3.experience, title: "일의 자리부터 맞춰요", visualProgression: null,
  beats: [
    { id: "vertical-shape-cryptarithm-step-1", action: "reveal", caption: "두 □에는 같은 숫자가 들어가요. 일의 자리부터 봐요.", visual: L3Ex },
    { id: "vertical-shape-cryptarithm-step-2", action: "highlight", caption: "일의 자리: 2 + □의 끝자리가 9이니 □ = 7이에요. 받아올림은 없어요.", visual: NOTE(["2 + □ → 끝자리 9", "□ = 7"]) },
    { id: "vertical-shape-cryptarithm-step-3", action: "verify", caption: "두 자리 수 둘을 더하면 200보다 작으니 맨 앞 ○는 1이에요. 72 + 47 = 119로 확인해요.", visual: NOTE(["○ = 1", "72 + 47 = 119"]) }
  ] };

// ── 새 단원 9: 복면산 (17~19쪽) ──
const L9No = 9, L9Id = "crypt-source";
if (book.lessons.some((l) => (l.experience?.check?.answerRef || "").includes(`/lessons/${L9No}/`))) throw new Error("lesson number 9 taken");
const FIX3 = "원본 그림의 결과 가운데 칸이 □로 그려져 있어 (2)번과 같은 문제가 되고 교사용 풀이와도 맞지 않습니다. 교사용 풀이대로 가운데 칸을 △로 고쳤습니다.";
const L9Raw = [
  // [쪽, 번호, 더하는 수, 결과, 답 칸(원본 순서)]
  [17, 1, ["□", "□", "□□"], "6□", "□"], [17, 2, ["△□", "△□", "△□"], "2□□", "□△"], [17, 3, ["△□", "△□", "△□"], "☆△□", "☆△□"],
  [17, 4, ["□△", "△"], "△6", "△□"], [17, 5, ["□△△", "△△"], "△◇2", "△◇□"], [17, 6, ["□△", "□"], "◇☆◇", "◇□☆△"],
  [18, 7, ["□△", "□"], "△◇◇", "△□◇"], [18, 8, ["□△", "△◇"], "△◇△", "△◇□"], [18, 9, ["□□", "□◇"], "△△△", "△□◇"],
  [18, 10, ["□□△", "☆◇"], "△◇△△", "△□◇☆"], [18, 11, ["7□□", "◇52"], "○◇8", "□◇○"],
  [19, 12, ["△□3", "□□"], "39△", "△□"], [19, 13, ["1□1", "□□"], "29◇", "□◇"], [19, 14, ["5◇4", "2◇○"], "□□□", "□◇○"]
];
const L9Specs = L9Raw.map(([page, n, rows, res, parts]) => ({
  no: `GB8-S${page}-01-${n}`, loc: `교사용 슬라이드 ${page} · ${A2} (${n})`, group: page * 10 + (n <= 3 || (n >= 7 && n <= 9) || n >= 12 ? 1 : 2),
  type: rows.length > 2 ? "같은 수를 여러 번 더하는 복면산" : "받아올림이 있는 모양 복면산", prompt: parts.length === 1 ? ONE(parts) : MANY, visual: crypt(rows, res),
  ...(parts.length > 1 ? { parts } : {}), ...(page === 17 && n === 3 ? { discrepancy: FIX3 } : {})
}));
const template = () => JSON.parse(JSON.stringify(lesson("bundle-number-source").experience));
const L9 = {
  id: L9Id, unit: "복면산", title: "복면산", sourceLocator: `교사용 슬라이드 17~19 · ${A2}`, sourceTypeIds: ["book08-crypt-source"],
  representativeConcept: "자리가 늘어난 맨 앞 숫자는 받아올림이라 1이고, 같은 수를 여러 번 더할 때는 일의 자리 합의 끝자리로 후보를 줄임",
  story: { title: "복면산", text: "숫자가 모양 가면을 쓰고 숨었어요. 같은 모양에는 같은 숫자, 다른 모양에는 다른 숫자가 들어가요.", mission: "답의 자리 수가 늘었다면 맨 앞 숫자부터 정해 보세요." },
  explanation: { headline: "더해서 자리 수가 하나 늘면 맨 앞 숫자는 1입니다. 그다음 일의 자리부터 받아올림을 따라갑니다.",
    steps: ["답의 자리 수가 늘었는지 보고, 늘었다면 맨 앞 숫자를 1로 정합니다.", "일의 자리에서 같은 모양을 몇 번 더하는지 보고 끝자리로 후보를 줄입니다.", "받아올림을 다음 자리에 더하며 남은 모양을 정합니다.", "다른 모양에 같은 숫자가 들어가지 않았는지 확인합니다."] },
  experience: { ...template(), family: "crypt-source-b8", title: "맨 앞 숫자부터 정해요",
    beats: [
      { id: "crypt-source-step-1", action: "reveal", caption: "두 자리 수에 한 자리 수를 더했더니 세 자리 수가 되었어요.", visual: crypt(["△△", "□"], "□◇◇") },
      { id: "crypt-source-step-2", action: "highlight", caption: "두 자리 + 한 자리는 200보다 작아요. 그래서 맨 앞 □는 1이에요.", visual: NOTE(["두 자리 + 한 자리 < 200", "□ = 1"]) },
      { id: "crypt-source-step-3", action: "verify", caption: "△△ + 1이 1◇◇가 되려면 △△는 99, ◇는 0이에요.", visual: NOTE(["99 + 1 = 100", "△ = 9, ◇ = 0"]) }
    ], hint: "답의 자리 수가 늘었는지부터 보세요.",
    check: { prompt: "두 자리 수와 한 자리 수를 더했더니 세 자리 수가 되었습니다. 세 자리 수의 맨 앞 숫자는?", options: ["1", "2", "9"], answerRef: `/books/book-08/lessons/${L9No}/experience/check` } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L9Specs.length, structureKey: L9Id, prompt: "같은 모양에는 같은 숫자가, 다른 모양에는 다른 숫자가 들어갑니다.", items: build(L9No, L9Id, "복면산", L9Specs) },
  extension: { title: "추가 학습", structureKey: L9Id, story: "자리 수가 늘어난 덧셈입니다.", prompt: ONE("□"), visual: crypt(["□□", "△"], "△◇◇"),
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-08/lessons/${L9No}/extension` }
};
delete L9.experience.visualProgression;
book.lessons.splice(book.lessons.indexOf(L3) + 1, 0, L9);
book.lessonIntegration.newLessonIds = [...new Set([...book.lessonIntegration.newLessonIds, L9Id])];

// ── 장부 ──
const pageOf = (item) => item.sourcePage ?? Number(String(item.sourceNo).match(/^S(\d+)/)[1]);
const units = (item) => item.parts?.length || 1;
const holdPages = (h) => { const m = String(h.sourceNo).match(/^S(\d+)(?:-S(\d+))?/); const a = Number(m[1]), b = Number(m[2] || m[1]); return Array.from({ length: b - a + 1 }, (_, k) => a + k); };
book.sourceHold = book.sourceHold.filter((h) => !["S15", "S17-S19"].includes(h.sourceNo));
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
console.log("book08 batch3 patched", { L2: L2Specs.length, L3: L3Specs.length, L9: L9Specs.length, holds: book.sourceHold.map((h) => h.sourceNo), coverage });
