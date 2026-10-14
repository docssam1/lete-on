// 골든벨 5권 묶음 1: 교사용 슬라이드 3~10 「수 배열·수열」 32문항.
// 이 스크립트에는 정답이 없다(정답은 비공개 DB에만). node patch-book05-batch1.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-05");
const book7 = books.find((b) => b.id === "book-07");
if (book.lessons.some((l) => l.id === "number-sequence-source")) throw new Error("already patched");
const L0 = book.lessons.find((l) => l.id === "path-number-grid");
const learnerStage = L0.experience.learnerStage;

const ref = (lesson, index) => `/books/book-05/lessons/${lesson}/original/items/${index}`;
const withParts = (item, labels) => ({ ...item, parts: labels.map((label, k) => ({ id: String.fromCharCode(97 + k), label, answerRef: `${item.answerRef}/parts/${k}` })) });
const table = (cells, shaded) => ({ kind: "book5", subtype: "source-number-table", cells: cells.map((row) => row.map((v) => String(v))), shaded });

// ── 단원 0(수 배열표)에 슬라이드 3~5 6문항 ──
const L0_START = L0.original.items.length;
const tableItems = [
  { no: "GB5-S03-01", loc: "교사용 슬라이드 3 활동 02 (1)", group: 2, prompt: "(1) 다음 수 배열표의 규칙을 찾아 A, B에 알맞은 수를 구하시오.",
    visual: table([[1, 2, 3, 4, "", "", ""], ["", "", "", "", "", 9, ""], ["", 16, "", "", "", "", 21], ["", "", "A", "", "", "", ""], ["", "", "", "", "", "B", ""]], [[3, 2], [4, 5]]), parts: ["A", "B"] },
  { no: "GB5-S03-02", loc: "교사용 슬라이드 3 활동 02 (2)", group: 2, prompt: "(2) 다음 수 배열표의 규칙을 찾아 A, B, C에 알맞은 수를 구하시오.",
    discrepancy: "원본 물음은 「A, B」만 적었지만 표에 C도 있어 세 칸을 함께 묻습니다.",
    visual: table([[1, 2, 9, 10, "", "", ""], [4, 3, 8, 11, "", "B", ""], [5, 6, 7, 12, "", "", ""], ["", 15, 14, 13, "", "", ""], ["", "", "", "", "", "", ""], ["", "", "A", "", "", "", ""], ["", "", "", "", "C", "", ""]], [[1, 5], [5, 2], [6, 4]]), parts: ["A", "B", "C"] },
  { no: "GB5-S04-03", loc: "교사용 슬라이드 4 활동 03", group: 3, prompt: "다음 수 배열표의 규칙을 찾아 색칠된 빈칸에 들어갈 수를 구하시오.",
    discrepancy: "원본 표 맨 아랫줄 셋째 칸의 「5」는 세로로 오르내리며 1씩 커지는 규칙에 맞지 않아 「15」로 바로잡았습니다.",
    visual: table([[1, "", 11, "", ""], [2, 9, "", "", ""], [3, "", "", "", ""], ["", "", "", "", ""], ["", 6, 15, 16, ""]], [[0, 4]]) },
  { no: "GB5-S04-04", loc: "교사용 슬라이드 4 활동 04", group: 3, prompt: "다음 수 배열표의 규칙을 찾아 A+B의 값을 구하시오.",
    visual: table([["", "", "", "B", "", ""], ["", "", "A", "", "", ""], ["", "", "", "", "", ""], ["", 17, "", "", 14, 13], ["", 11, "", "", 8, 7], ["", 5, "", "", 2, 1]], [[0, 3], [1, 2]]) },
  { no: "GB5-S05-01", loc: "교사용 슬라이드 5 도전 (1)", group: 4, prompt: "도전 (1) 다음 수 배열표의 규칙을 찾아 A+B의 값을 구하시오.",
    visual: table([[1, 13, "", "", 14, 2], [3, 15, "", "", "", 4], [5, "", "", "", "", 6], [7, "", "A", "B", "", 8], [9, 21, "", "", "", 10], [11, "", "", "", "", 12]], [[3, 2], [3, 3]]) },
  { no: "GB5-S05-02", loc: "교사용 슬라이드 5 도전 (2)", group: 4, prompt: "도전 (2) 다음 수 배열표의 규칙을 찾아 A+B의 값을 구하시오.",
    visual: table([[1, 4, 7, "", "", ""], [19, 22, 25, "", "", ""], ["", "", "", 46, 49, 52], ["", "", "", "", "", ""], ["", "A", "", "B", "", ""], ["", "", "", "", "", ""]], [[4, 1], [4, 3]]) }
];
tableItems.forEach((spec, k) => {
  const index = L0_START + k;
  let item = { id: `book05-full-${spec.no.slice(4).toLowerCase()}`, sourceNo: spec.no, lessonId: L0.id, typeLabel: "수 배열표의 규칙", sourceLocator: spec.loc, printGroup: spec.group,
    answerMode: "input", inputMode: "numeric", prompt: spec.prompt, visual: spec.visual, answerRef: ref(0, index) };
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  if (spec.parts) { item = withParts(item, spec.parts); delete item.answerMode; delete item.inputMode; }
  L0.original.items.push(item);
});
Object.assign(L0, { sourceLocator: "교사용 슬라이드 2~5 활동 01~04·도전", representativeConcept: "수가 놓인 차례(규칙)를 찾아 색칠한 칸이나 A, B, C 칸이 몇 번째 수인지 구함" });
L0.explanation.steps = [...L0.explanation.steps.slice(0, 2), "색칠한 칸까지 몇 번째인지 다시 따라가 답을 확인합니다.", "줄마다 같은 수만큼 커지는 표는 한 줄씩 건너뛰며 셉니다."];

// ── 개념 설명: 7권 arithmetic-sequence 안내형 가족을 재사용(check 문장·경로만 바꿈) ──
const seqSource = book7.lessons.find((l) => l.id === "arithmetic-sequence").experience;
const experience = (lessonNo, prompt, options) => ({
  ...JSON.parse(JSON.stringify(seqSource)), learnerStage,
  check: { prompt, options, answerRef: `/books/book-05/lessons/${lessonNo}/experience/check` }
});

// ── 단원 4: 수열에서 몇 번째 수 (슬라이드 6·7·10, 9문항) ──
const seq = (values, extra = {}) => ({ kind: "book5", subtype: "source-sequence", values, ...extra });
const SEQ_STEM = "어떤 규칙으로 차례로 수를 나열했습니다.";
const triangle = { kind: "book5", subtype: "source-triangle-numbers", rows: [[1], [2, 3], [4, 5, 6], [7, 8, 9, 10]] };
const seqSpecs = [
  { no: "GB5-S06-05-1", loc: "교사용 슬라이드 6 활동 05 (1)", group: 1, type: "수열의 빈칸", prompt: `${SEQ_STEM} (1) 색칠된 빈칸에 들어갈 수를 구하시오.`, visual: seq([1, 3, 5, 7, 9], { boxes: ["", "", "15", "", ""], shaded: [4] }) },
  { no: "GB5-S06-05-2", loc: "교사용 슬라이드 6 활동 05 (2)", group: 1, type: "수열의 빈칸", prompt: `${SEQ_STEM} (2) 색칠된 빈칸에 들어갈 수를 구하시오.`, visual: seq([1, 4, 7, 10, 13], { boxes: ["", "", "", "", "28", "", ""], shaded: [6] }) },
  { no: "GB5-S06-05-3", loc: "교사용 슬라이드 6 활동 05 (3)", group: 1, type: "수열의 빈칸", prompt: `${SEQ_STEM} (3) 색칠된 빈칸에 들어갈 수를 구하시오.`, visual: seq([2, 6, 10, 14, 18], { boxes: ["", "", "", "", "", ""], shaded: [5] }) },
  { no: "GB5-S06-06-1", loc: "교사용 슬라이드 6 활동 06 (1)", group: 1, type: "몇 번째 수", prompt: `${SEQ_STEM} (1) 9번째 수를 구하시오.`, visual: seq([4, 9, 14, 19], { more: true }) },
  { no: "GB5-S06-06-2", loc: "교사용 슬라이드 6 활동 06 (2)", group: 1, type: "몇 번째 수", prompt: `${SEQ_STEM} (2) 11번째 수를 구하시오.`, visual: seq([1, 7, 13, 19, 25], { more: true }) },
  { no: "GB5-S07-01", loc: "교사용 슬라이드 7 도전 (1)", group: 2, type: "몇 번째 수", prompt: `도전 ${SEQ_STEM} (1) 10번째, 16번째, 21번째 수를 구하시오.`, visual: seq([1, 4, 7, 10, 13]), parts: ["10번째 수", "16번째 수", "21번째 수"] },
  { no: "GB5-S07-02", loc: "교사용 슬라이드 7 도전 (2)", group: 2, type: "몇 번째 수", prompt: `도전 ${SEQ_STEM} (2) 10번째, 16번째, 21번째 수를 구하시오.`, visual: seq([1, 5, 9, 13, 17]), parts: ["10번째 수", "16번째 수", "21번째 수"] },
  { no: "GB5-S10-01", loc: "교사용 슬라이드 10 도전 (1)", group: 3, type: "삼각 배열", prompt: `도전 ${SEQ_STEM} (1) 다섯 번째 줄의 4번째 수는?`, visual: triangle },
  { no: "GB5-S10-02", loc: "교사용 슬라이드 10 도전 (2)", group: 3, type: "삼각 배열", prompt: `도전 ${SEQ_STEM} (2) 21은 몇 번째 줄의 몇 번째 수입니까?`, visual: triangle, parts: ["몇 번째 줄", "몇 번째 수"] }
];

// ── 단원 5: 갈래 줄에 놓인 수 (슬라이드 8·9, 17문항) ──
const radial3 = { kind: "book5", subtype: "source-radial-rows", shape: "triangle", arms: [{ label: "①", numbers: [1, 4, 7, 10] }, { label: "②", numbers: [2, 5, 8, 11] }, { label: "③", numbers: [3, 6, 9, 12] }] };
const radial4 = { kind: "book5", subtype: "source-radial-rows", shape: "square", arms: [{ label: "①", numbers: [1, 5, 9, 13] }, { label: "②", numbers: [2, 6, 10, 14] }, { label: "③", numbers: [3, 7, 11, 15] }, { label: "④", numbers: [4, 8, 12, 16] }] };
const RADIAL_STEM = "다음 그림과 같은 규칙으로 1부터 차례로 수를 나열하였습니다.";
const where = ["몇 번 줄", "몇 번째"];
// 수를 읽은 끝소리에 맞춘 조사(16은, 19는)
const topic = (n) => `${n}${"0136781".includes(String(n).at(-1)) ? "은" : "는"}`;
const radialSpecs = [
  ...[16, 19, 21, 26, 30, 49].map((n, k) => ({ no: `GB5-S08-07-${k + 1}`, loc: `교사용 슬라이드 8 활동 07 (${k + 1})`, group: k < 2 ? 1 : 2, type: "세 갈래 줄의 자리", prompt: `${RADIAL_STEM} (${k + 1}) ${topic(n)} 몇 번 줄의 몇 번째 수입니까?`,
    conditions: ["①번 줄의 4번째 수는 10이고, 12는 ③번 줄의 4번째 수입니다."], visual: radial3, parts: where,
    discrepancy: k === 0 ? "원본 그림은 가운데 삼각형의 ②·③ 표시가 문제 글(12는 ③번 줄)과 반대로 놓여 있어 문제 글에 맞춰 ②를 2, 5, 8 줄 쪽에 두었습니다." : undefined })),
  ...[["①", 10], ["②", 7], ["③", 11], ["④", 9]].map(([row, nth], k) => ({ no: `GB5-S09-08-${k + 1}`, loc: `교사용 슬라이드 9 활동 08 (${k + 1})`, group: 3, type: "네 갈래 줄의 수", prompt: `${RADIAL_STEM} (${k + 1}) ${row}번 줄의 ${nth}번째 수를 구하시오.`,
    conditions: ["①번 줄의 4번째 수는 13이고, 15는 ③번 줄의 4번째 수입니다."], visual: radial4,
    discrepancy: k === 3 ? "원본은 이 물음의 번호를 (1)로 적었지만 (3) 다음 물음이라 (4)로 고쳤습니다." : undefined })),
  ...[17, 22, 27, 45, 60, 74, 87].map((n, k) => ({ no: `GB5-S09-08-${k + 5}`, loc: `교사용 슬라이드 9 활동 08 (${k + 5})`, group: k < 4 ? 4 : 5, type: "네 갈래 줄의 자리", prompt: `${RADIAL_STEM} (${k + 5}) ${topic(n)} 몇 번 줄의 몇 번째 수입니까?`,
    conditions: ["①번 줄의 4번째 수는 13이고, 15는 ③번 줄의 4번째 수입니다."], visual: radial4, parts: where,
    discrepancy: k === 0 ? "원본 답 칸 앞에 뜻 없는 「1」이 찍혀 있어 지웠습니다." : undefined }))
];

const buildItems = (lessonNo, lessonId, specs) => specs.map((spec, index) => {
  let item = { id: `book05-full-${spec.no.slice(4).toLowerCase()}`, sourceNo: spec.no, lessonId, typeLabel: spec.type, sourceLocator: spec.loc, printGroup: spec.group,
    answerMode: "input", inputMode: "numeric", prompt: spec.conditions ? spec.prompt.replace(/ \((\d+)\) /, ` ${spec.conditions.join(" ")} ($1) `) : spec.prompt, visual: spec.visual, answerRef: ref(lessonNo, index) };
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  if (spec.parts) { item = withParts(item, spec.parts); delete item.answerMode; delete item.inputMode; }
  return item;
});

const L4 = {
  id: "number-sequence-source", unit: "수열", title: "수열에서 몇 번째 수", sourceLocator: "교사용 슬라이드 6·7·10 활동 05~06·도전",
  sourceTypeIds: ["number-sequence-source"], representativeConcept: "이웃한 수의 차(규칙)를 찾아 원하는 자리의 수를 구하고, 삼각 배열에서 줄과 자리를 찾음",
  story: { title: "줄지어 선 수", text: "수가 같은 수만큼씩 커지며 줄지어 서 있습니다. 이웃한 두 수의 차이가 그 줄의 규칙입니다.", mission: "이웃한 수의 차이를 찾고, 원하는 자리까지 몇 번 건너가는지 세어 보세요." },
  explanation: { headline: "첫 수에서 원하는 자리까지 건너가는 횟수는 자리 수보다 하나 적습니다.",
    steps: ["이웃한 두 수의 차이를 구합니다.", "첫 수에서 원하는 자리까지 몇 번 건너가는지 셉니다.", "건너간 횟수만큼 차이를 더해 원하는 자리의 수를 구합니다.", "삼각 배열은 줄마다 수가 하나씩 늘어나므로 줄의 끝 수로 몇째 줄인지 찾습니다."] },
  experience: experience(4, "1, 4, 7, 10에서 8번째 수는 얼마일까요?", ["22", "25", "19"]),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: seqSpecs.length, structureKey: "number-sequence-source", prompt: SEQ_STEM, visual: seqSpecs[0].visual, items: buildItems(4, "number-sequence-source", seqSpecs) },
  extension: { title: "추가 학습", structureKey: "number-sequence-source", story: "4씩 커지는 수가 줄지어 서 있습니다.", prompt: "3, 7, 11, 15, …에서 12번째 수를 쓰세요.",
    visual: seq([3, 7, 11, 15], { more: true }), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-05/lessons/4/extension" }
};
const L5 = {
  id: "radial-rows-source", unit: "수열", title: "갈래 줄에 놓인 수", sourceLocator: "교사용 슬라이드 8~9 활동 07~08",
  sourceTypeIds: ["radial-rows-source"], representativeConcept: "갈래마다 하나씩 돌아가며 놓인 수에서 줄 번호와 몇 번째인지 찾음",
  story: { title: "갈래 길에 놓인 수", text: "1부터 차례로 수를 갈래마다 하나씩 돌아가며 놓았습니다. 한 바퀴를 돌 때마다 모든 줄에 수가 하나씩 늘어납니다.", mission: "갈래 수만큼씩 묶어 세어 몇 번째 바퀴인지, 그 바퀴의 몇째 자리인지 찾아보세요." },
  explanation: { headline: "갈래 수만큼씩 한 바퀴로 묶어 세면 줄 번호와 몇 번째를 함께 알 수 있습니다.",
    steps: ["1부터 갈래 수만큼씩 묶어 한 바퀴로 봅니다.", "찾는 수가 몇 번째 바퀴에 있는지가 그 줄의 몇 번째입니다.", "바퀴 안에서 몇째 자리인지가 줄 번호입니다.", "같은 줄의 수는 갈래 수만큼씩 커지므로 몇 번째 수는 차이를 더해 구합니다."] },
  experience: experience(5, "3, 6, 9, 12에서 7번째 수는 얼마일까요?", ["24", "21", "18"]),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: radialSpecs.length, structureKey: "radial-rows-source", prompt: RADIAL_STEM, visual: radial3, items: buildItems(5, "radial-rows-source", radialSpecs) },
  extension: { title: "추가 학습", structureKey: "radial-rows-source", story: "세 갈래 줄에 1부터 차례로 수를 하나씩 돌아가며 놓았습니다.", prompt: "②번 줄의 9번째 수를 쓰세요.",
    visual: radial3, answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-05/lessons/5/extension" }
};
book.lessons.push(L4, L5);

// ── 보류 정리와 집계 ──
const cleared = new Set(["S03", "S04", "S05", "S06", "S07", "S08", "S09", "S10"].map((s) => `GB5-${s}-H01`));
const before = book.sourceHold.length;
book.sourceHold = book.sourceHold.filter((hold) => !cleared.has(hold.sourceNo));
if (before - book.sourceHold.length !== 8) throw new Error("hold count");
const publicCount = book.lessons.reduce((sum, l) => sum + l.original.items.length, 0);
Object.assign(book.sourceCoverage, { public: publicCount, hold: book.sourceHold.length, total: publicCount + book.sourceHold.length });

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book05 batch1 patched", { L0: L0.original.items.length, L4: L4.original.items.length, L5: L5.original.items.length, coverage: book.sourceCoverage });
