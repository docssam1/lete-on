// 골든벨 5권 묶음 5: 교사용 슬라이드 35~40 「곱셈구구와 곱셈 매트릭스」 31문항.
// 이 스크립트에는 정답이 없다(고르기형 보기는 공개, 정답 보기는 비공개 DB에만). node patch-book05-batch5.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-05");
if (book.lessons.some((l) => l.id === "multiplication-table-source")) throw new Error("already patched");
const L0 = book.lessons.find((l) => l.id === "path-number-grid");
const L2 = book.lessons.find((l) => l.id === "checkerboard-product-matrix");

const withParts = (item, labels) => ({ ...item, parts: labels.map((label, k) => ({ id: String.fromCharCode(97 + k), label, answerRef: `${item.answerRef}/parts/${k}` })) });
const build = (lessonNo, lessonId, specs, startIndex = 0) => specs.map((spec, k) => {
  let item = { id: `book05-full-${spec.no.slice(4).toLowerCase()}`, sourceNo: spec.no, lessonId, typeLabel: spec.type, sourceLocator: spec.loc, printGroup: spec.group,
    answerMode: spec.options ? "choice" : "input", ...(spec.options ? { options: spec.options } : { inputMode: spec.text ? "text" : "numeric" }), prompt: spec.prompt, visual: spec.visual,
    answerRef: `/books/book-05/lessons/${lessonNo}/original/items/${startIndex + k}` };
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  if (spec.parts) { item = withParts(item, spec.parts); delete item.answerMode; delete item.inputMode; }
  return item;
});

// ── 새 단원 10: 곱셈구구와 곱셈표 (35~39쪽) ──
const timesTable = (() => {
  const cells = [["×", 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 1, 2, 3, 4, 5, 6, 7, 8, 9], [2, 2, 4, 6, 8, "", "", "", "", ""]];
  for (let r = 3; r <= 9; r += 1) cells.push([r, r, "", "", "", "", "", "", "", ""]);
  return { kind: "book5", subtype: "source-number-table", cells: cells.map((row) => row.map(String)), shaded: Array.from({ length: 9 }, (_, i) => [i + 1, i + 1]) };
})();
const T01 = "다음은 곱셈구구 표입니다. 함께 특징을 관찰해 봅시다.";
const pair = (product) => ({ kind: "book5", subtype: "source-pair-product", product });
const tri = (products) => ({ kind: "book5", subtype: "source-product-triangle", products });
const ring = (circles, squares) => ({ kind: "book5", subtype: "source-product-ring", circles, squares });
const grid2 = (cells, rowProducts, columnProducts) => ({ kind: "book5", subtype: "source-product-grid", shaded: [[0, 0], [0, 1], [1, 0], [1, 1]], letters: cells, rowProducts, columnProducts });
const P02 = "다음 A와 B에 한 자리 수를 넣어 곱한 값이 가운데 수입니다. 뒤의 수가 앞의 수보다 클 때 A, B를 순서대로 구하시오.";
const P03 = "다음 삼각형 모양의 그림에서 ○ 안의 수는 2부터 9까지의 자연수이고, □ 안의 수는 양쪽 ○의 곱입니다.";
const P04 = "다음 사각형, 오각형 모양의 그림에서 ○ 안의 수는 2~9의 자연수이고, □ 안의 수는 양쪽 ○의 곱입니다. 빈 칸에 알맞은 수를 써넣으시오.";
const P05 = "다음 표는 가로줄, 세로줄 두 수의 곱을 오른쪽이나 아래에 쓴 것입니다. 색칠된 빈 칸에 알맞은 수를 써넣으시오.";
const L10Specs = [
  { no: "GB5-S35-01-1", loc: "교사용 슬라이드 35 활동 01 (1)", group: 1, type: "곱셈구구의 특징", prompt: `${T01} (1) 5단의 특징은?`, visual: timesTable,
    options: ["일의 자리 숫자가 모두 다릅니다.", "일의 자리가 0과 5로 끝납니다.", "모두 짝수입니다."],
    discrepancy: "원본 01 (1)~(4)는 말로 쓰는 물음이라 화면에서는 고르기형으로 바꿨습니다." },
  { no: "GB5-S35-01-2", loc: "교사용 슬라이드 35 활동 01 (2)", group: 1, type: "곱셈구구의 특징", prompt: `${T01} (2) 7단의 특징은?`, visual: timesTable,
    options: ["일의 자리가 0과 5로 끝납니다.", "모두 홀수입니다.", "일의 자리 숫자가 모두 다릅니다."] },
  { no: "GB5-S35-01-3", loc: "교사용 슬라이드 35 활동 01 (3)", group: 1, type: "곱셈구구의 특징", prompt: `${T01} (3) 9단의 특징은?`, visual: timesTable,
    options: ["일의 자리 숫자가 모두 다릅니다.", "모두 홀수입니다.", "일의 자리가 0과 5로 끝납니다."] },
  { no: "GB5-S35-01-4", loc: "교사용 슬라이드 35 활동 01 (4)", group: 1, type: "곱셈구구의 특징", prompt: `${T01} (4) 색칠된 칸의 특징은?`, visual: timesTable,
    options: ["모두 짝수입니다.", "일의 자리가 모두 같습니다.", "같은 수를 두 번 곱합니다."] },
  ...[14, 35, 36, 72].map((p, k) => ({ no: `GB5-S36-02-${k + 1}`, loc: `교사용 슬라이드 36 활동 02 (${k + 1})`, group: 2, type: "곱해서 가운데 수", prompt: `${P02} (${k + 1})`, visual: pair(p), parts: ["A", "B"] })),
  { no: "GB5-S37-03-0", loc: "교사용 슬라이드 37 활동 03 같이 연습", group: 3, type: "곱셈 삼각형", prompt: `${P03} (같이 연습) A, B, C에 알맞은 수를 구하시오.`, visual: tri([20, 24, 30]), parts: ["A", "B", "C"],
    discrepancy: "원본 03은 「가장 먼저 찾을 수 있는 칸」을 묻고 교사와 함께 채웁니다. 화면에서는 A, B, C를 모두 구하는 물음으로 바꿨습니다." },
  ...[[15, 6, 10], [18, 21, 42], [27, 36, 12]].map((pr, k) => ({ no: `GB5-S37-03-${k + 1}`, loc: `교사용 슬라이드 37 활동 03 (1) 그림 ${k + 1}`, group: 3, type: "곱셈 삼각형",
    prompt: `${P03} (그림 ${k + 1}) 가장 먼저 찾을 수 있는 칸부터 찾아 A, B, C에 알맞은 수를 구하시오.`, visual: tri(pr), parts: ["A", "B", "C"] })),
  { no: "GB5-S38-04-1", loc: "교사용 슬라이드 38 활동 04 사각형 1", group: 4, type: "곱셈 고리", prompt: `${P04} (사각형 1)`, visual: ring([2, 4, null, null], [8, 28, 35, 10]), parts: ["가", "나"],
    discrepancy: "빈 ○을 가리키려고 원본에 없는 가·나 표시를 넣었습니다." },
  { no: "GB5-S38-04-2", loc: "교사용 슬라이드 38 활동 04 사각형 2", group: 4, type: "곱셈 고리", prompt: `${P04} (사각형 2)`, visual: ring([3, 6, null, null], [18, 42, 63, 27]), parts: ["가", "나"] },
  { no: "GB5-S38-04-3", loc: "교사용 슬라이드 38 활동 04 사각형 3", group: 4, type: "곱셈 고리", prompt: `${P04} (사각형 3)`, visual: ring([8, null, null, 6], [40, 35, 42, 48]), parts: ["가", "나"] },
  { no: "GB5-S38-04-4", loc: "교사용 슬라이드 38 활동 04 오각형 1", group: 4, type: "곱셈 고리", prompt: `${P04} (오각형 1) 가에 알맞은 수는?`, visual: ring([6, null, 2, 8, 4], [18, 6, 16, 32, 24]) },
  { no: "GB5-S38-04-5", loc: "교사용 슬라이드 38 활동 04 오각형 2", group: 4, type: "곱셈 고리", prompt: `${P04} (오각형 2)`, visual: ring([8, 4, null, null, 6], [32, 28, 35, 30, 48]), parts: ["가", "나"] },
  ...[
    ["3, 4, 5, 6", [["6", "4"], ["3", "가"]], [24, 15], [18, 20], null],
    ["6, 7, 8, 9", [["가", "나"], ["6", "8"]], [63, 48], [54, 56], ["가", "나"]],
    ["2, 4, 6, 8", [["4", "가"], ["6", "2"]], [32, 12], [24, 16], null],
    ["3, 5, 7, 9", [["가", "3"], ["9", "7"]], [15, 63], [45, 21], null]
  ].map(([set, cells, rows, cols, parts], k) => ({ no: `GB5-S39-05-1${k + 1}`, loc: `교사용 슬라이드 39 활동 05 (1) 표 ${k + 1}`, group: 5, type: "곱셈표 빈칸",
    prompt: `${P05} (1) 주어진 숫자가 있는 경우: ${set} (표 ${k + 1})${parts ? "" : " 가에 알맞은 수는?"}`, visual: grid2(cells, rows, cols), ...(parts ? { parts } : {}),
    discrepancy: k === 3 ? "원본 표 아래 둘째 칸의 「12」는 3×7과 맞지 않아 숫자가 뒤바뀐 오타로 보고 「21」로 바로잡았습니다." : k === 0 ? "빈 칸을 가리키려고 원본에 없는 가·나 표시를 넣었습니다." : undefined })),
  ...[
    [[["4", "7"], ["9", "가"]], [28, 45], [36, 35], null],
    [[["가", "5"], ["6", "나"]], [35, 54], [42, 45], ["가", "나"]],
    [[["4", "가"], ["5", "3"]], [36, 15], [20, 27], null],
    [[["6", "2"], ["가", "8"]], [12, 56], [42, 16], null]
  ].map(([cells, rows, cols, parts], k) => ({ no: `GB5-S39-05-2${k + 1}`, loc: `교사용 슬라이드 39 활동 05 (2) 표 ${k + 1}`, group: 5, type: "곱셈표 빈칸",
    prompt: `${P05} (2) 주어진 숫자가 없는 경우 (표 ${k + 1})${parts ? "" : " 가에 알맞은 수는?"}`, visual: grid2(cells, rows, cols), ...(parts ? { parts } : {}) }))
];
const L10 = {
  id: "multiplication-table-source", unit: "곱셈구구와 곱셈 매트릭스", title: "곱셈구구로 빈칸 찾기", sourceLocator: "교사용 슬라이드 35~39 활동 01~05",
  sourceTypeIds: ["multiplication-table-source"], representativeConcept: "곱셈구구에서 곱이 되는 두 한 자리 수의 짝을 찾고, 두 곱에 함께 쓰인 수(공통인 수)로 빈칸을 차례로 채움",
  story: { title: "곱셈구구 짝 찾기", text: "한 수가 두 곱에 함께 들어가면 그 수는 두 곱을 모두 나누는 수입니다.", mission: "곱셈구구에서 짝을 찾고, 함께 쓰인 수부터 정해 보세요." },
  explanation: { headline: "곱셈구구의 짝 가운데 조건에 맞는 것을 고르고, 두 곱에 함께 쓰인 수부터 정합니다.",
    steps: ["곱이 되는 두 한 자리 수(2~9)의 짝을 곱셈구구에서 모두 찾습니다.", "한 수가 두 곱에 함께 쓰였으면 두 곱을 모두 나누는 수를 찾습니다.", "정한 수로 나머지 수를 나눗셈하듯 찾습니다.", "찾은 수로 모든 곱이 맞는지 확인합니다."] },
  experience: {
    ...JSON.parse(JSON.stringify(L0.experience)), family: "multiplication-pair", title: "곱이 되는 짝을 찾아요",
    beats: [
      { id: "multiplication-pair-step-1", action: "reveal", caption: "곱셈구구 표에서 같은 곱이 나오는 칸을 찾으면 곱이 되는 짝을 알 수 있습니다.", visual: timesTable },
      { id: "multiplication-pair-step-2", action: "highlight", caption: "A×B=20, A×C=24이면 A는 20과 24를 모두 나누는 수 4입니다.", visual: tri([20, 24, 30]) },
      { id: "multiplication-pair-step-3", action: "verify", caption: "A가 4이면 B는 5, C는 6이고, B×C=30이 맞는지 확인합니다.", visual: { ...tri([20, 24, 30]), values: { A: 4, B: 5, C: 6 } } }
    ],
    hint: "두 곱에 함께 쓰인 ○은 두 곱을 모두 나누는 수입니다.",
    check: { prompt: "A×B=45이고 A와 B는 한 자리 수이며 A가 B보다 작습니다. A는 얼마일까요?", options: ["9", "5", "3"], answerRef: "/books/book-05/lessons/10/experience/check" }
  },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L10Specs.length, structureKey: "multiplication-table-source", prompt: P04, visual: timesTable, items: build(10, "multiplication-table-source", L10Specs) },
  extension: { title: "추가 학습", structureKey: "multiplication-table-source", story: "○ 안의 수는 2~9, □ 안의 수는 양쪽 ○의 곱입니다.", prompt: "A에 알맞은 수를 쓰세요.",
    visual: tri([12, 20, 15]), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-05/lessons/10/extension" }
};

// ── 기존 단원 2(곱셈 매트릭스)에 40쪽 표 2~4와 도전 ──
const PROD = "색칠된 빈 칸에 2, 3, 4, 5, 6, 7, 8, 9를 한 번씩 넣어 한 줄 위의 곱이 오른쪽과 아래의 수가 되도록 만들고 있습니다.";
const matrix = (shaded, letters, rowProducts, columnProducts) => ({ kind: "book5", subtype: "source-product-grid", shaded, letters, rowProducts, columnProducts });
const blank4 = () => [["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""]];
const lettersAt = (spec) => { const g = blank4(); for (const [r, c, v] of spec) g[r][c] = v; return g; };
const CH = "도전 다음 빈 칸에 2, 3, 4, 5, 6, 7, 8, 9를 한 번씩 넣어 곱셈 매트릭스를 만들었습니다.";
const challenge = matrix([], [["a", "b", "c", "d"], ["e", "f", "g", "h"], ["i", "j", "k", "l"], ["m", "n", "o", "p"]], [18, 21, 20, 48], [35, 18, 16, 36]);
const L2Specs = [
  { no: "GB5-S40-06-2", loc: "교사용 슬라이드 40 활동 06 표 2", group: 2, type: "곱셈 매트릭스", prompt: `${PROD} (표 2) A, B에 알맞은 숫자는?`,
    visual: matrix([[0, 0], [0, 1], [1, 2], [1, 3], [2, 0], [2, 3], [3, 1], [3, 2]], lettersAt([[0, 0, "A"], [2, 0, "B"]]), [21, 20, 72, 12], [63, 18, 8, 40]), parts: ["A", "B"],
    discrepancy: "원본 표 2는 둘째 줄 곱(12)과 넷째 세로줄 곱(24)으로는 8칸을 채울 수 없습니다(어떻게 넣어도 성립하지 않음). A·B와 관계없는 이 두 수를 고쳐야 성립해 20, 40으로 바로잡았습니다." },
  { no: "GB5-S40-06-3", loc: "교사용 슬라이드 40 활동 06 표 3", group: 2, type: "곱셈 매트릭스", prompt: `${PROD} (표 3) A, B, C에 알맞은 숫자는?`,
    visual: matrix([[0, 1], [0, 3], [1, 0], [1, 2], [2, 1], [2, 3], [3, 0], [3, 2]], lettersAt([[1, 2, "A"], [2, 1, "B"], [3, 0, "C"]]), [12, 36, 56, 15], [20, 42, 27, 16]), parts: ["A", "B", "C"] },
  { no: "GB5-S40-06-4", loc: "교사용 슬라이드 40 활동 06 표 4", group: 2, type: "곱셈 매트릭스", prompt: `${PROD} (표 4) A, B, C에 알맞은 숫자는?`,
    visual: matrix([[0, 0], [0, 3], [1, 1], [1, 2], [2, 1], [2, 2], [3, 0], [3, 3]], lettersAt([[1, 1, "A"], [3, 0, "B"], [3, 3, "C"]]), [6, 72, 24, 35], [21, 54, 32, 10]), parts: ["A", "B", "C"] },
  ...[5, 8, 3].map((d, k) => ({ no: `GB5-S40-07-${k + 1}`, loc: `교사용 슬라이드 40 도전 (${k + 1})`, group: 3, type: "곱셈 매트릭스 도전", prompt: `${CH} (${k + 1}) ${d}가 있는 곳은? (칸의 글자를 쓰시오)`, visual: challenge, text: true }))
];
const L2Start = L2.original.items.length;
L2.original.items.push(...build(2, L2.id, L2Specs, L2Start));
L2.original.mode = "paged";
L2.original.sourceQuestionCount = L2.original.items.length;
delete L2.sourceHold;
Object.assign(L2, { sourceLocator: "교사용 슬라이드 40 활동 06·도전" });
book.lessons.push(L10);

const cleared = new Set(["S35", "S36", "S37", "S38", "S39", "S40"].map((s) => `GB5-${s}-H01`));
const before = book.sourceHold.length;
book.sourceHold = book.sourceHold.filter((hold) => !cleared.has(hold.sourceNo));
if (before - book.sourceHold.length !== 6) throw new Error(`hold count ${before - book.sourceHold.length}`);
const publicCount = book.lessons.reduce((sum, l) => sum + l.original.items.length, 0);
Object.assign(book.sourceCoverage, { public: publicCount, hold: book.sourceHold.length, total: publicCount + book.sourceHold.length });

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book05 batch5 patched", { L2: L2.original.items.length, L10: L10.original.items.length, coverage: book.sourceCoverage });
