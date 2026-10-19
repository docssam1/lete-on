// 골든벨 6권 묶음 2: 교사용 슬라이드 7~10 「크기가 같은 분수·분수와 비·분수, 비와 합·막대와 비·저울과 비」.
// 단원 6(분수와 비)은 원본 문항으로 새로 짜고, 9쪽 막대와 비·10쪽 저울과 비는 단원 13으로 덧붙인다.
// 이 스크립트에는 정답이 없다(고르기형 보기는 공개, 정답은 비공개 DB에만). node patch-book06-batch2.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-06");
if (book.lessons.some((l) => l.id === "bar-balance-ratio-source")) throw new Error("already patched");
const template = book.lessons.find((l) => l.id === "equal-share-source").experience;

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
  ...JSON.parse(JSON.stringify(template)), family, title, beats, hint, check: { ...check, answerRef: `/books/book-06/lessons/${lessonNo}/experience/check` }
});
const V = (subtype, v) => ({ kind: "book5", subtype, ...v });
const BL = ["가", "나", "다", "라", "마", "바", "사", "아"];
const labels = (n) => BL.slice(0, n);
const blanks = (rows) => rows.flat().filter((v) => v == null).length;

// ── 단원 6: 분수와 비 (7·8·9쪽) ──
const L6No = 6;
const chain = (fractions) => V("source-fraction-chain", { fractions });
const CHAINS = [[[1, 2], [null, 6], [null, 10], [7, null], [8, null]], [[3, 5], [21, null], [null, 10], [27, null]], [[18, 24], [null, 12], [6, null], [null, 4]], [[48, 60], [null, 20], [24, null], [96, null]]];
// 비 표: 첫 줄이 기준 비, 나머지 줄의 null이 빈칸(가·나… 차례).
const ratioTable = (rows) => { let k = 0; return V("source-text-table", { cells: [["앞 수", ":", "뒤 수"], ...rows.map(([a, b]) => [a ?? BL[k++], ":", b ?? BL[k++]])] }); };
const TABLES = [[[2, 3], [null, 6], [null, 9], [8, null], [12, null], [null, 27]], [[3, 5], [null, 15], [21, null], [null, 25], [24, null]], [[7, 9], [14, null], [null, 36], [49, null], [null, 72]]];
const SUM_NOTE = "원본의 분모·분자의 합은 교사용 안내에만 적혀 있어 물음에 합을 적었습니다.";
const EXPLAIN_NOTE = "원본은 교사가 설명하는 그림이라 화면에서는 고르기 물음으로 바꿨습니다.";
const plates = V("source-text-table", { cells: [["동생", "형"], ["사과 2개", "사과 3개"]] });
const shapeRatio = (a, b, rule) => V("source-shape-equations", { rows: [[String(a), ":", String(b), "=", "square", ":", "triangle"], rule], ask: ["square", "triangle"] });
const L6Specs = [
  ...CHAINS.map((fr, k) => ({ no: `GB6-S07-01-${k + 1}`, loc: `교사용 슬라이드 7 활동 01 크기가 같은 분수 ${"①②③④"[k]}`, group: 1 + Math.floor(k / 2), type: "크기가 같은 분수",
    prompt: `크기가 같은 분수가 되도록 빈칸에 알맞은 수를 쓰시오. (${k + 1})`, visual: chain(fr), parts: labels(blanks(fr)) })),
  { no: "GB6-S07-02-1", loc: "교사용 슬라이드 7 활동 02 분수와 비", group: 3, type: "비로 나타내기", visual: plates, discrepancy: EXPLAIN_NOTE,
    prompt: "동생은 사과 2개, 형은 사과 3개를 가지고 있습니다. 동생 : 형을 비로 나타내면?", options: ["3 : 2", "2 : 3", "2 : 5"] },
  { no: "GB6-S07-02-2", loc: "교사용 슬라이드 7 활동 02 분수와 비", group: 3, type: "분수로 나타내기", visual: plates,
    prompt: "동생이 가진 사과는 형이 가진 사과의 몇 분의 몇일까요?", options: ["형의 2분의 3", "형의 5분의 2", "형의 3분의 2"] },
  ...TABLES.map((rows, k) => ({ no: `GB6-S08-02-${k + 1}`, loc: `교사용 슬라이드 8 활동 02 비 표 ${"①②③"[k]}`, group: 4 + Math.floor(k / 2), type: "같은 비 채우기",
    prompt: `첫 줄의 비와 같은 비가 되도록 빈칸에 알맞은 수를 쓰시오. (${k + 1})`, visual: ratioTable(rows), parts: labels(blanks(rows)) })),
  { no: "GB6-S08-03-1", loc: "교사용 슬라이드 8 활동 03 분수, 비와 합 ①", group: 6, type: "크기가 같은 분수", visual: chain([[2, 3], [4, 6], [null, 9], [null, 12], [16, null], [18, null]]),
    prompt: "크기가 같은 분수가 되도록 빈칸에 알맞은 수를 쓰시오. 다 채운 뒤 분모와 분자의 합도 살펴보세요.", parts: labels(4) },
  { no: "GB6-S08-03-2", loc: "교사용 슬라이드 8 활동 03 분수, 비와 합 ②", group: 6, type: "합이 정해진 같은 분수", visual: chain([[1, 4], [null, null], [null, null], [null, null]]), discrepancy: SUM_NOTE,
    prompt: "1/4과 크기가 같으면서 분모와 분자의 합이 차례로 20, 35, 45인 분수를 찾아 빈칸을 채우시오.", parts: ["가 (분자)", "나 (분모)", "다 (분자)", "라 (분모)", "마 (분자)", "바 (분모)"] },
  ...[[3, 2, ["square", "+", "triangle", "=", "30"]], [2, 5, ["square", "+", "triangle", "=", "28"]], [5, 7, ["square", "+", "triangle", "=", "36"]], [3, 5, ["triangle", "-", "square", "=", "6"]]].map(([a, b, rule], k) => ({
    no: `GB6-S09-03-${k + 1}`, loc: `교사용 슬라이드 9 활동 03 분수, 비와 합 ${k < 3 ? "③④⑤"[k] : "도전"}`, group: 7 + Math.floor(k / 2), type: k < 3 ? "비와 합" : "비와 차",
    prompt: `비가 같도록 □와 △에 알맞은 수를 구하시오. (${k < 3 ? k + 1 : "도전"})`, visual: shapeRatio(a, b, rule), parts: ["□", "△"] }))
];
const L6 = {
  id: "fraction-balance-source", unit: "수직선의 분할과 비", title: "분수와 비", sourceLocator: "교사용 슬라이드 7 활동 01·02, 슬라이드 8·9 활동 02·03",
  sourceTypeIds: ["fraction-balance-source"], representativeConcept: "분모와 분자에 같은 수를 곱하거나 나누면 크기가 같은 분수가 되고, 비도 앞 수와 뒤 수에 같은 수를 곱하면 같은 비이며, 합이나 차로 몇 배인지 찾음",
  story: { title: "피자를 다르게 잘라도", text: "피자를 2조각, 4조각, 8조각으로 잘라도 절반은 언제나 같은 양입니다.", mission: "분모와 분자에 같은 수를 곱해 크기가 같은 분수를 찾아보세요." },
  explanation: { headline: "분모와 분자(앞 수와 뒤 수)에 같은 수를 곱하거나 나누면 크기가 같습니다.",
    steps: ["분모가 몇 배가 되었는지 봅니다.", "분자에도 같은 수를 곱합니다(나눌 때도 같은 수로).", "비도 앞 수와 뒤 수에 같은 수를 곱하면 같은 비입니다.", "합이 정해지면 (앞 수 + 뒤 수)가 몇 배인지 먼저 찾습니다."] },
  experience: experience(L6No, "fraction-ratio", "크기가 같은 분수를 찾아요", [
    { id: "fraction-ratio-step-1", action: "reveal", caption: "원을 2조각, 4조각, 8조각으로 나누어 색칠한 크기가 같습니다.", visual: V("source-fraction-discs", { discs: [{ pieces: 2, shaded: 1 }, { pieces: 4, shaded: 2 }, { pieces: 8, shaded: 4 }], fractions: false }) },
    { id: "fraction-ratio-step-2", action: "highlight", caption: "1/2의 분모와 분자에 2를 곱하면 2/4, 4를 곱하면 4/8입니다.", visual: chain([[1, 2], [2, 4], [4, 8]]) },
    { id: "fraction-ratio-step-3", action: "verify", caption: "비도 같습니다. 1 : 2 = 2 : 4 = 4 : 8입니다.", visual: V("source-text-table", { cells: [["앞 수", ":", "뒤 수"], ["1", ":", "2"], ["2", ":", "4"], ["4", ":", "8"]] }) }
  ], "분모가 몇 배가 되었는지 먼저 봅니다.", { prompt: "1/3과 크기가 같은 분수는 어느 것일까요?", options: ["2/5", "3/9", "3/6"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L6Specs.length, structureKey: "fraction-balance-source", prompt: "크기가 같은 분수와 같은 비를 찾으시오.", visual: chain([[1, 2], [2, 4], [4, 8]]), items: build(L6No, "fraction-balance-source", L6Specs) },
  extension: { title: "추가 학습", structureKey: "fraction-balance-source", story: "1/3과 크기가 같은 분수를 찾습니다.", prompt: "1/3과 크기가 같으면서 분모와 분자의 합이 24인 분수의 분모는 얼마일까요?",
    answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-06/lessons/${L6No}/extension` }
};

// ── 단원 13: 막대와 저울의 비 (9·10쪽) ──
const L13No = book.lessons.length;
const bar = (a, b, total) => V("source-bar-ratio", { a, b, total });
const scale = (left, right, weight) => V("source-balance-ratio", { left, right, ...(weight == null ? {} : { weight }) });
const BAR = "같은 길이를 ㉠ 칸과 ㉡ 칸으로 나누었습니다. ㉠ : ㉡을 가장 간단한 자연수의 비로 나타내고, ㉠ 하나와 ㉡ 하나를 이은 길이가";
const BAL = "저울이 수평입니다. 공 하나와 상자 하나의 무게의 비(공 : 상자)를 가장 간단한 자연수의 비로 나타내고, 공 하나와 상자 하나를 합한 무게가";
const L13Specs = [
  ...[[1, 2, 18], [1, 3, 24], [1, 4, 20], [2, 3, 30], [3, 4, 63]].map(([a, b, total], k) => ({ no: `GB6-S09-04-${k + 1}`, loc: `교사용 슬라이드 9 활동 04 막대와 비 ${k + 1}`, group: 1 + Math.floor(k / 3),
    type: "막대와 비", prompt: `${BAR} ${total}cm일 때 ㉠과 ㉡의 길이(가·나)를 구하시오. (${k + 1})`, visual: bar(a, b, total), parts: ["㉠ : ㉡의 앞 수", "㉠ : ㉡의 뒤 수", "가 (cm)", "나 (cm)"] })),
  ...[[2, 3, 30], [4, 3, 49], [3, 5, 64], [4, 5, 81]].map(([left, right, weight], k) => ({ no: `GB6-S10-05-${k + 1}`, loc: `교사용 슬라이드 10 활동 05 저울과 비 ${k + 1}`, group: 3 + Math.floor(k / 2),
    type: "저울과 비", prompt: `${BAL} ${weight}g일 때 공 하나와 상자 하나의 무게를 각각 구하시오. (${k + 1})`, visual: scale(left, right, weight), parts: ["공 : 상자의 앞 수", "공 : 상자의 뒤 수", "공 (g)", "상자 (g)"] }))
];
const L13 = {
  id: "bar-balance-ratio-source", unit: "수직선의 분할과 비", title: "막대와 저울의 비", sourceLocator: "교사용 슬라이드 9 활동 04 막대와 비, 슬라이드 10 활동 05 저울과 비",
  sourceTypeIds: ["bar-balance-ratio-source"], representativeConcept: "같은 길이(무게)를 이루는 개수의 비를 뒤집어 하나의 길이(무게)의 비를 구하고, 합을 비의 합으로 나누어 실제 값을 구함",
  story: { title: "시소 위의 공과 상자", text: "가벼운 것은 많이, 무거운 것은 조금 올려야 저울이 수평이 됩니다.", mission: "개수의 비를 뒤집어 무게의 비를 찾아보세요." },
  explanation: { headline: "같은 길이를 ㉠ 2칸, ㉡ 5칸으로 나누면 ㉠ : ㉡ = 5 : 2처럼 칸 수의 비를 뒤집습니다.",
    steps: ["같은 길이(무게)가 되는 개수를 셉니다.", "개수가 많을수록 하나는 작으므로 개수의 비를 뒤집어 하나의 비를 씁니다.", "비의 두 수를 더한 수로 실제 합을 나누면 한 몫이 나옵니다.", "한 몫에 비의 각 수를 곱하면 실제 길이(무게)입니다."] },
  experience: experience(L13No, "bar-balance-ratio", "개수의 비를 뒤집어요", [
    { id: "bar-balance-ratio-step-1", action: "reveal", caption: "공 1개와 상자 5개가 수평이면 공 하나는 상자 하나의 5배 무게입니다.", visual: scale(1, 5) },
    { id: "bar-balance-ratio-step-2", action: "highlight", caption: "그래서 공 : 상자 = 5 : 1입니다.", visual: scale(1, 5) },
    { id: "bar-balance-ratio-step-3", action: "verify", caption: "공 하나와 상자 하나가 30g이면 30 ÷ (5+1) = 5이므로 공은 25g, 상자는 5g입니다.", visual: scale(1, 5, 30) }
  ], "개수가 많은 쪽이 하나는 더 가볍습니다.", { prompt: "공 1개와 상자 6개가 수평입니다. 공 : 상자는?", options: ["1 : 6", "6 : 1", "1 : 7"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L13Specs.length, structureKey: "bar-balance-ratio-source", prompt: "막대와 저울을 보고 비와 실제 값을 구하시오.", visual: scale(1, 5), items: build(L13No, "bar-balance-ratio-source", L13Specs) },
  extension: { title: "추가 학습", structureKey: "bar-balance-ratio-source", story: "저울이 수평입니다.", prompt: "공 2개와 상자 5개가 수평이고, 공 하나와 상자 하나를 합한 무게가 35g입니다. 공 하나의 무게는 몇 g일까요?",
    visual: scale(2, 5, 35), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-06/lessons/${L13No}/extension` }
};

book.lessons[L6No] = L6;
book.lessons.push(L13);
const released = { 7: 6, 8: 5, 9: 9, 10: 4 };
for (const entry of book.sourceCoverage) {
  const page = entry.pages[0];
  if (released[page] != null) Object.assign(entry, { status: "implemented", releasedCount: released[page], holdCount: 0 });
}
const count = (p) => [...L6Specs, ...L13Specs].filter((s) => s.no.startsWith(`GB6-S${String(p).padStart(2, "0")}`)).length;
for (const p of [7, 8, 9, 10]) if (count(p) !== released[p]) throw new Error(`page ${p} count ${count(p)}`);

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book06 batch2 patched", { L6: L6.original.items.length, L13: L13.original.items.length, lessonNos: [L6No, L13No], released });
