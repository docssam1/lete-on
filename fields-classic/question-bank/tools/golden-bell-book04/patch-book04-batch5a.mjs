// 4권 묶음 5-1: 원본 5~7쪽 「숫자 돌리기와 뒤집기」 34문항. 정답은 비공개 DB에만.
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-04");
if (book.lessons.some((l) => l.id === "flip-rotate-source")) throw new Error("already patched");
const R = (i) => `/books/book-04/lessons/15/original/items/${i}`;
const CIRCLED = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧"];
const items = [];
const add = (item) => { item.answerRef = R(items.length); items.push(item); };

// 5쪽 ①: 「1」 둘레 12물음 → 보기 ①~⑧
const ONE_PROMPT = "주어진 도형을 여러 방향으로 뒤집을 때 생기는 모양을 고르시오.";
const ops = [
  { type: "axis", side: "top" }, { type: "axis", side: "left" }, { type: "axis", side: "right" }, { type: "axis", side: "bottom" },
  { type: "rotate", side: "top", deg: 360, dir: "cw" }, { type: "rotate", side: "right", deg: 90, dir: "cw" }, { type: "rotate", side: "bottom", deg: 180, dir: "cw" }, { type: "rotate", side: "left", deg: 270, dir: "cw" },
  { type: "rotate", side: "top", deg: 360, dir: "ccw" }, { type: "rotate", side: "left", deg: 90, dir: "ccw" }, { type: "rotate", side: "bottom", deg: 180, dir: "ccw" }, { type: "rotate", side: "right", deg: 270, dir: "ccw" }
];
ops.forEach((op, i) => add({ id: `one-flip-${i + 1}`, sourceNo: `5-Q${i + 1}`, typeLabel: op.type === "axis" ? "「1」 모양 뒤집기" : "「1」 모양 돌리기", sourceLocator: `학생용 5쪽 활동 02 ① Q${i + 1}`, printGroup: i < 4 ? 1 : i < 8 ? 2 : 3, prompt: ONE_PROMPT, visual: { kind: "book4", subtype: "source-one-flip", op }, answerMode: "choice", options: CIRCLED.slice() }));

// 6쪽 ②: 오른쪽으로 뒤집은 후 아래로 뒤집은 모양(그리기 → 고르기)
const LRop = { op: { type: "axis", axis: "vertical" } };
const UDop = { op: { type: "axis", axis: "horizontal" } };
const FOUR = CIRCLED.slice(0, 4);
const DRAW_NOTE = "원본은 모양을 그리는 문항이라 후보 모양 고르기로 바꿈";
[["1", ["UD", "R180", "LR", "I"]], ["7", ["R180", "I", "UD", "LR"]], ["4", ["LR", "UD", "I", "R180"]], ["9", ["I", "LR", "R180", "UD"]]].forEach(([digit, candidates], i) => add({
  id: `digit-flip-${digit}`, sourceNo: `6-②(${i + 1})`, typeLabel: "숫자를 두 번 뒤집은 모양", sourceLocator: `학생용 6쪽 활동 02 ② ${i + 1}번째 줄`, sourceDiscrepancy: DRAW_NOTE, printGroup: 4,
  prompt: "다음 숫자를 오른쪽으로 뒤집은 후 아래로 뒤집은 모양을 고르시오.",
  visual: { kind: "book4", subtype: "source-digit-flip", digit, steps: [{ ...LRop, show: "LR" }, { ...UDop }], candidates }, answerMode: "choice", options: FOUR.slice()
}));

// 6쪽 ③: 숫자 1을 차례로 움직인 마지막 모양 + 한 번에 바꾸는 기호
const rot = (deg, dir) => ({ op: { type: "rotate", deg, dir } });
const moves = [
  [[LRop, UDop], ["LR", "UD", "I", "R180"]],
  [[LRop, UDop, rot(90, "cw")], ["CW", "UD", "CCW", "R180"]],
  [[rot(180, "cw"), LRop, UDop], ["I", "R180", "LR", "UD"]]
];
const ICONS = [{ deg: 90, dir: "cw" }, { deg: 180, dir: "cw" }, { deg: 90, dir: "ccw" }, { deg: 360, dir: "ccw" }, { deg: 270, dir: "ccw" }];
moves.forEach(([steps, candidates], i) => add({
  id: `one-moves-${i + 1}`, sourceNo: `6-③(${i + 1})`, typeLabel: "숫자 1을 차례로 움직인 마지막 모양", sourceLocator: `학생용 6쪽 활동 02 ③ (${i + 1})`, sourceDiscrepancy: DRAW_NOTE, printGroup: 5,
  prompt: "숫자 1을 다음과 같이 움직일 때, 마지막 모양을 고르시오.",
  visual: { kind: "book4", subtype: "source-digit-flip", digit: "1", steps, candidates }, answerMode: "choice", options: FOUR.slice()
}));
moves.forEach(([steps], i) => add({
  id: `one-moves-once-${i + 1}`, sourceNo: `6-③(${i + 1})+`, typeLabel: "한 번에 바꾸는 돌리기", sourceLocator: `학생용 6쪽 활동 02 ③ ＋ 물음 (${i + 1})`, printGroup: 6,
  prompt: `(${i + 1})에서 처음 모양을 마지막 모양으로 한 번 만에 바꿀 수 있는 것은?`,
  visual: { kind: "book4", subtype: "source-digit-flip", digit: "1", steps, iconOptions: ICONS }, answerMode: "choice", options: CIRCLED.slice(0, 5)
}));

// 7쪽 ④: 2×2 숫자판 (셀: 숫자, 놓인 방향)
const c = (value, t) => ({ value, t });
const boardsA = [
  [c("1", "I"), c("3", "R180"), c("4", "CW"), c("5", "CCW")],
  [c("2", "CW"), c("4", "R180"), c("9", "CCW"), c("8", "I")],
  [c("7", "CCW"), c("5", "R180"), c("9", "R180"), c("2", "CW")],
  [c("8", "I"), c("6", "CCW"), c("2", "R180"), c("4", "CW")]
];
const boardsB = [
  [c("3", "R180"), c("9", "CCW"), c("5", "I"), c("7", "CCW")],
  [c("1", "I"), c("2", "R180"), c("8", "CW"), c("9", "CCW")],
  [c("4", "CCW"), c("5", "R180"), c("7", "I"), c("1", "CW")],
  [c("9", "R180"), c("4", "CCW"), c("3", "CW"), c("5", "I")]
];
const boardPrompts = [
  ["(1)", "다음 숫자판을 시계 방향으로 반의 반바퀴 돌릴 때 똑바로 놓이는 수를 찾으시오.", boardsA, "CW"],
  ["(2)", "다음 숫자판을 시계 방향으로 반바퀴 돌릴 때 똑바로 놓이는 수를 찾으시오.", boardsB, "R180"],
  ["(3)", "다음 숫자판을 아래로 뒤집은 후 다시 오른쪽으로 뒤집었을 때, 똑바로 놓이는 수를 찾으시오.", boardsA, "UD+LR"]
];
boardPrompts.forEach(([no, prompt, boards, op], g) => boards.forEach((cells, b) => add({
  id: `upright-board-${g + 1}-${b + 1}`, sourceNo: `7-④${no}-${b + 1}`, typeLabel: "숫자판을 움직여 똑바로 놓이는 수", sourceLocator: `학생용 7쪽 활동 02 ④ ${no} ${b + 1}번째 판`, printGroup: 7 + g,
  prompt: `${prompt} (여러 개이면 쉼표로 모두 쓰시오.)`, visual: { kind: "book4", subtype: "source-upright-board", cells, op }, answerMode: "input", inputMode: "text", resultContract: { type: "set" }
})));

const ref = books.find((b) => b.id === "book-01").lessons.find((l) => l.id === "mirror-reflection");
const experience = JSON.parse(JSON.stringify(ref.experience).replaceAll("/books/book-01/lessons/1/experience/", "/books/book-04/lessons/15/experience/"));
const lesson = {
  id: "flip-rotate-source",
  unit: "도형 분할과 움직이기",
  title: "숫자를 돌리고 뒤집어요",
  sourceLocator: "학생용 5~7쪽 활동 02 ①~④",
  sourceTypeIds: ["flip-rotate-source"],
  representativeConcept: "왼쪽·오른쪽으로 뒤집으면 좌우만, 위·아래로 뒤집으면 위아래만 바뀌고, 두 번 뒤집으면 반 바퀴 돌린 것과 같음",
  experience,
  story: { title: "돌리기와 뒤집기 기호", text: "점선을 감은 화살표는 그 선을 따라 뒤집기, 원 안의 색칠은 시계 방향이나 반대 방향으로 돌린 만큼을 나타냅니다.", mission: "기호가 뒤집기인지 돌리기인지 먼저 읽고, 한 번씩 차례로 움직여 보세요." },
  explanation: { headline: "뒤집기와 돌리기를 구별합니다.", steps: ["옆 점선으로 뒤집으면 왼쪽과 오른쪽만, 위아래 점선으로 뒤집으면 위와 아래만 바뀝니다.", "원 안에 색칠된 만큼, 화살표 방향으로 돌립니다(반의 반 바퀴·반 바퀴·한 바퀴).", "오른쪽으로 뒤집은 뒤 아래로 뒤집으면 반 바퀴 돌린 것과 같습니다."] },
  original: { title: "골든벨 4권", mode: "paged", sourceQuestionCount: items.length, structureKey: "flip-rotate-source-structure", prompt: "기호대로 숫자와 모양을 뒤집고 돌려 보세요.", items },
  extension: { title: "추가 학습", structureKey: "flip-rotate-source-structure", story: "숫자 카드 7을 오른쪽으로 뒤집은 뒤 다시 오른쪽으로 뒤집었습니다.", prompt: "마지막 모양을 고르시오.", visual: { kind: "book4", subtype: "source-digit-flip", digit: "7", steps: [LRop, LRop], candidates: ["LR", "I", "UD", "R180"] }, answerMode: "choice", options: FOUR.slice(), extensionKind: "source-structured-authored", answerRef: "/books/book-04/lessons/15/extension" }
};
book.lessons.splice(book.lessons.findIndex((l) => l.id === "polyomino-family-count") + 1, 0, lesson);

const hold = book.sourceHold.findIndex((h) => /5 ~8/.test(h.sourceLocator));
if (hold < 0) throw new Error("hold 5~8 not found");
book.sourceHold.splice(hold, 1);
const cov = book.sourceCoverage;
const i58 = cov.findIndex((e) => e.pages.join() === "5,6,7,8");
if (i58 < 0) throw new Error("coverage 5~8 not found");
cov.splice(i58, 1, { pages: [5, 6, 7], lessonId: "flip-rotate-source", status: "implemented" }, { pages: [8], status: "held", holdCount: 21 });

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("batch5a patched; items", items.length, "; lessons:", book.lessons.map((l) => l.id).join(" "));
