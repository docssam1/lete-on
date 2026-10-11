// 4권 묶음 3: 원본 22~27쪽 「비교하기」 26문항. 정답은 비공개 DB에만.
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-04");
if (book.lessons.some((l) => l.id === "compare-order-source")) throw new Error("already patched");
const STAGE = "7세 8월부터 초등 1학년 초반 · FC 1과정 4권";
const parts = (base, labels) => labels.map((label, i) => ({ id: `part-${i + 1}`, label, answerRef: `${base}/parts/${i}` }));
const R12 = (i) => `/books/book-04/lessons/12/original/items/${i}`;
const R13 = (i) => `/books/book-04/lessons/13/original/items/${i}`;
const rel = (left, right, op, n) => ({ left, right, op, n });
const relRow = ({ left, right, op, n }) => [left, "=", right, op, n];
const guided = (family, title, hint, relations, extra, check, captions) => ({
  kind: "guided-concept", family, title, hint, learnerStage: STAGE,
  model: { visual: { kind: "book4", subtype: "source-relations", rows: relations.map(relRow), relations, ...extra } },
  beats: captions.map((caption, i) => ({ id: `${family}-${i + 1}`, action: ["draw", "transform", "verify"][i], caption })),
  check, finalStill: { standsAlone: true }
});

// ── 단원 A: 크기를 비교해 순서를 정해요 (22~24쪽)
const cards = (id, sourceNo, n, prompt, visual) => ({ id, sourceNo, typeLabel: "사용하지 않는 숫자카드", sourceLocator: `학생용 22쪽 활동 01 ① Q${n}`, printGroup: 1, prompt, visual: { kind: "book4", subtype: "source-number-cards", ...visual }, answerMode: "input", inputMode: "numeric" });
const ORDER_PROMPT = "다음 도형에서 크기가 작은 것부터 순서대로 나타낸 것을 고르시오.";
const shapeOrder = (n, rows, options) => ({ id: `shape-order-${n}`, sourceNo: `23-(${n})`, typeLabel: "도형의 크기 비교", sourceLocator: `학생용 23쪽 활동 01 ② (${n})`, sourceDiscrepancy: "원본은 순서대로 그리는 문항이라 순서 보기 고르기로 바꿈", printGroup: 2, prompt: ORDER_PROMPT, visual: { kind: "book4", subtype: "source-relations", rows }, answerMode: "choice", options });
const two = ["△ < ○", "○ < △"];
const orderItems = [
  cards("unused-card-7", "22-(1)", 1, "1부터 7까지의 수를 한 번씩만 사용하여 다음 두 개의 덧셈식을 완성하려고 합니다. 5, 7은 이미 사용하였으므로 나머지 수를 가지고 덧셈식을 완성할 때, 사용할 수 없는 수는 무엇입니까?", { count: 7, used: [5, 7], sums: [5, 7] }),
  cards("unused-card-10", "22-(2)", 2, "1부터 10까지의 수를 한 번씩만 사용하여 다음 세 개의 덧셈식을 완성하려고 합니다. 6, 7, 10은 이미 사용하였으므로 나머지 수를 가지고 덧셈식을 완성할 때, 사용할 수 없는 수는 무엇입니까?", { count: 10, used: [6, 7, 10], sums: [6, 7, 10] }),
  shapeOrder(1, [["circle", "=", "triangle", "+", 6]], two),
  shapeOrder(2, [["circle", "-", 6, "=", "triangle"]], two),
  shapeOrder(3, [["circle", "=", "triangle", "-", 8]], two),
  shapeOrder(4, [["square", "=", "circle", "+", 7], ["circle", "=", "triangle", "+", 3]], ["△ < ○ < □", "□ < ○ < △", "○ < △ < □", "△ < □ < ○"]),
  shapeOrder(5, [["square", "=", "circle", "-", 4], ["triangle", "=", "circle", "-", 9]], ["□ < △ < ○", "△ < □ < ○", "○ < □ < △", "△ < ○ < □"]),
  shapeOrder(6, [["square", "=", "circle", "-", 7], ["triangle", "=", "circle", "+", 5]], ["△ < ○ < □", "○ < □ < △", "□ < ○ < △", "□ < △ < ○"]),
  shapeOrder(7, [["circle", "=", "diamond", "+", 2], ["triangle", "=", "square", "+", 4], ["circle", "=", "square", "+", 3]], ["◇ < □ < ○ < △", "□ < ○ < ◇ < △", "△ < ○ < ◇ < □", "□ < ◇ < ○ < △"]),
  shapeOrder(8, [["square", "=", "triangle", "-", 2], ["triangle", "=", "circle", "+", 3], ["diamond", "=", "square", "-", 6]], ["◇ < □ < ○ < △", "○ < ◇ < □ < △", "◇ < ○ < □ < △", "△ < □ < ○ < ◇"]),
  { id: "letter-order-3", sourceNo: "24-(1)", typeLabel: "식으로 수의 크기 순서 정하기", sourceLocator: "학생용 24쪽 활동 01 ② Q1", printGroup: 3, prompt: "어떤 수 A, B, C의 크기를 비교한 식입니다. 큰 수부터 순서대로 알파벳을 쓰시오.", visual: { kind: "book4", subtype: "source-relations", rows: [["A", "=", "B", "+", 6], ["B", "=", "C", "-", 10]] }, answerMode: "input", inputMode: "text" },
  { id: "letter-order-4", sourceNo: "24-(2)", typeLabel: "식으로 수의 크기 순서 정하기", sourceLocator: "학생용 24쪽 활동 01 ② Q2", printGroup: 3, prompt: "다음은 어떤 수 A, B, C, D의 크기를 비교한 식입니다. 크기가 큰 순서대로 쓰시오.", visual: { kind: "book4", subtype: "source-relations", rows: [["A", "=", "B", "-", 9], ["C", "=", "D", "+", 5], ["B", "=", "C", "-", 3]] }, answerMode: "input", inputMode: "text" },
  { id: "letter-difference", sourceNo: "24-(2) 추가", typeLabel: "식으로 두 수의 차이 구하기", sourceLocator: "학생용 24쪽 활동 01 ② Q2의 추가 물음", printGroup: 3, prompt: "다음은 어떤 수 A, B, C, D의 크기를 비교한 식입니다. A와 C의 차이는?", visual: { kind: "book4", subtype: "source-relations", rows: [["A", "=", "B", "-", 9], ["C", "=", "D", "+", 5], ["B", "=", "C", "-", 3]] }, answerMode: "input", inputMode: "numeric" }
];
orderItems.forEach((item, i) => { item.answerRef = R12(i); });
orderItems[10].parts = parts(R12(10), ["가장 큰 수", "둘째", "셋째"]);
orderItems[11].parts = parts(R12(11), ["가장 큰 수", "둘째", "셋째", "넷째"]);

const lessonOrder = {
  id: "compare-order-source",
  unit: "비교하기",
  title: "크기를 비교해 순서를 정해요",
  sourceLocator: "학생용 22~24쪽 활동 01 ①②",
  sourceTypeIds: ["compare-order-source"],
  representativeConcept: "정해진 값이 없어도 한 도형에 적당한 수를 넣으면 나머지 값을 구해 크기 순서를 정할 수 있음",
  experience: guided("book4-compare-order", "기준에 수를 넣어 크기 순서를 정해요", "정해진 값이 없을 때는 한 도형에 적당한 수를 넣고 나머지를 차례로 구하세요.",
    [rel("circle", "triangle", "+", 4), rel("square", "circle", "-", 2)], { base: "triangle", baseValue: 10 },
    { prompt: "가 = 나 + 3, 다 = 가 + 2일 때 가장 큰 것은?", options: ["가", "나", "다"], answerRef: "/books/book-04/lessons/12/experience/check" },
    ["두 식에서 =의 양쪽 중 어느 쪽이 큰지 읽습니다.", "△에 적당한 수를 넣고 ○, □의 값을 차례로 구합니다.", "구한 값을 작은 것부터 늘어놓아 순서를 정합니다."]),
  story: { title: "크기 비교 식 읽기", text: "○ = △ + 6이면 △에 6을 더해야 ○가 되므로 ○가 △보다 큽니다. 정해진 값이 없을 때는 한 도형에 적당한 수를 넣어 보아도 됩니다.", mission: "식마다 어느 쪽이 큰지 읽고, 함께 나오는 도형으로 순서를 이어 보세요." },
  explanation: { headline: "기준 하나에 수를 넣어 봅니다.", steps: ["식에서 =의 양쪽 중 어느 쪽이 큰지 읽습니다.", "정해진 값이 없으면 한 도형에 적당한 수를 넣고 나머지 값을 차례로 구합니다.", "구한 값을 크기 순서대로 늘어놓고 처음 식에 다시 넣어 확인합니다."] },
  original: { title: "골든벨 4권", mode: "paged", sourceQuestionCount: orderItems.length, structureKey: "compare-order-source-structure", prompt: "식과 조건을 읽고 크기 순서를 정하세요.", items: orderItems },
  extension: { title: "추가 학습", structureKey: "compare-order-source-structure", story: "세 상자 가, 나, 다의 무게를 비교한 식입니다.", prompt: "가 = 나 + 5, 다 = 가 − 2일 때 가장 가벼운 상자는 무엇일까요?", visual: { kind: "book4", subtype: "source-relations", rows: [["가", "=", "나", "+", 5], ["다", "=", "가", "-", 2]] }, answerMode: "input", inputMode: "text", extensionKind: "source-structured-authored", answerRef: "/books/book-04/lessons/12/extension" }
};

// ── 단원 B: 수의 크기 차이를 구해요 (25~27쪽)
const pairName = { circle: "○", triangle: "△", square: "□", diamond: "◇" };
const shapeDiff = (n, rows, pair) => ({ id: `shape-difference-${n}`, sourceNo: `25-(${n})`, typeLabel: "도형의 크기 차이", sourceLocator: `학생용 25쪽 활동 01 ③ (${n})`, sourceDiscrepancy: "물어보는 두 도형은 학생용에 빈칸이라 교사용 물음 문구대로 채움", printGroup: 1, prompt: `다음은 ○, ◇, □, △의 크기를 비교한 식입니다. ${pairName[pair[0]]}와 ${pairName[pair[1]]}의 차이를 구하시오.`, visual: { kind: "book4", subtype: "source-relations", tint: true, rows }, answerMode: "input", inputMode: "numeric" });
const clueItem = (id, sourceNo, page, n, printGroup, prompt, clues, inputMode, extra = {}) => ({ id, sourceNo, typeLabel: "조건으로 차이와 순서 찾기", sourceLocator: `학생용 ${page}쪽 활동 01 ③ Q${n}`, printGroup, prompt, ...(clues ? { visual: { kind: "book4", subtype: "source-clue-box", clues } } : { noVisual: true }), answerMode: "input", inputMode, ...extra });
const diffItems = [
  shapeDiff(1, [["circle", "=", "diamond", "+", 4], ["triangle", "=", "square", "+", 3], ["circle", "=", "square", "+", 10]], ["circle", "triangle"]),
  shapeDiff(2, [["diamond", "=", "square", "+", 9], ["triangle", "=", "circle", "+", 7], ["circle", "=", "square", "+", 5]], ["square", "triangle"]),
  shapeDiff(3, [["diamond", "=", "square", "+", 6], ["square", "=", "circle", "-", 10], ["triangle", "=", "diamond", "+", 8]], ["circle", "triangle"]),
  shapeDiff(4, [["circle", "=", "diamond", "-", 9], ["square", "=", "triangle", "+", 5], ["diamond", "=", "square", "-", 6]], ["diamond", "triangle"]),
  clueItem("weight-difference", "26-(1)", 26, 1, 2, "A, B, C, D의 무게를 비교했더니 다음과 같습니다. C와 D는 몇 kg 차이날까요?", ["A는 B보다 7kg 무겁다.", "C는 A보다 2kg 가볍다.", "D는 B보다 9kg 무겁다."], "numeric"),
  clueItem("age-difference", "26-(2)", 26, 2, 2, "현준, 승규, 지민, 지혜의 나이를 비교했더니 다음과 같습니다. 지민, 지혜는 몇 살 차이일까요?", ["현준이는 승규보다 4살 적습니다.", "지민이는 현준이보다 6살 많습니다.", "승규는 지혜보다 9살 많습니다."], "numeric"),
  clueItem("line-last", "26-(3)", 26, 3, 2, "민규, 승진, 희진, 서진이 다음과 같이 한 줄로 서있습니다. 제일 뒤에 있는 사람은 누구일까요?", ["민규는 승진이보다 21m 앞에 있습니다.", "희진이는 민규보다 17m 뒤에 있습니다.", "서진이는 희진이보다 30m 앞에 있습니다."], "text"),
  clueItem("ribbon-longest", "26-(4)", 26, 4, 2, "길이가 다른 A, B, C, D 리본 4개가 있습니다. 길이가 가장 긴 리본을 구하시오.", ["A는 B보다 46cm 길다.", "A는 C보다 37cm 짧다.", "D는 B보다 29cm 길다."], "text"),
  clueItem("height-difference", "27-(1)", 27, 1, 3, "연우, 경민, 준이, 하나 4명이 자신의 키에 대해 다음과 같이 말했습니다. 연우와 경민이의 키 차이는 몇 cm입니까?", ["준이: 나는 연우보다 12cm가 더 작고, 하나보다 4cm가 더 커", "경민: 나는 하나보다 9cm가 더 커"], "numeric", { sourceDiscrepancy: "학생용 물음의 '민이'는 등장인물에 없어 교사용 문구대로 '경민이'로 고침" }),
  clueItem("family-weight", "27-(2)", 27, 2, 3, "엄마, 아빠, 오빠, 나의 몸무게를 비교하였더니 다음과 같았습니다. 아빠와 엄마의 몸무게 차이는 몇 kg인지 구하시오.", ["엄마는 나보다 5kg 더 무겁습니다.", "아빠는 오빠보다 7kg 더 무겁습니다.", "오빠는 나보다 5kg 더 가볍습니다."], "numeric"),
  clueItem("stairs-gap", "27-(3)", 27, 3, 3, "미정, 하나, 승민, 지훈, 은정이는 계단에 한 줄로 서있습니다. 맨 위에 있는 사람은 맨 아래에서부터 두 번째에 있는 사람보다 몇 계단 위에 있습니까?", ["미정이는 하나보다 3계단 위에 있습니다.", "승민이는 지훈이보다 2계단 아래에 있습니다.", "은정이는 승민이보다 5계단 위에 있지만 하나보다는 1계단 아래에 있습니다."], "numeric", { sourceDiscrepancy: "조건의 '한나'는 등장인물 '하나'의 오기로 보고 이름을 통일함" }),
  clueItem("candy-difference", "27-(4)", 27, 4, 3, "A, B, C, D 네 사람이 사탕을 나누어 가졌는데, A는 B보다 5개 적게 가졌고, D보다는 8개를 더 가졌습니다. 또 B는 C보다 7개를 더 가졌다면, A는 C보다 사탕 몇 개를 더 가졌는지 구하시오.", null, "numeric"),
  clueItem("race-distance", "27-(5)", 27, 5, 3, "사자, 호랑이, 토끼, 돼지, 강아지가 달리기 시합을 하고 있습니다. 토끼는 돼지보다 8m 앞에 있고, 돼지는 강아지보다 3m 앞에 있습니다. 호랑이가 강아지보다 10m 앞에 있고, 사자보다 4m 뒤에 있다면, 토끼와 사자 사이의 거리는 몇 m입니까?", null, "numeric")
];
diffItems.forEach((item, i) => { item.answerRef = R13(i); });

const lessonDiff = {
  id: "compare-difference-source",
  unit: "비교하기",
  title: "수의 크기 차이를 구해요",
  sourceLocator: "학생용 25~27쪽 활동 01 ③",
  sourceTypeIds: ["compare-difference-source"],
  representativeConcept: "두 값의 차이는 어떤 수를 대입해도 같으므로, 기준에 수를 넣어 값을 구한 뒤 빼면 됨",
  experience: guided("book4-compare-difference", "기준에 수를 넣고 두 값을 빼요", "같은 대상과 비교한 식끼리 이으면, 한 곳에 수를 넣어 두 값을 모두 구할 수 있습니다.",
    [rel("circle", "square", "+", 6), rel("triangle", "square", "+", 2)], { base: "square", baseValue: 10, target: ["circle", "triangle"] },
    { prompt: "가 = 다 + 8, 나 = 다 + 3일 때 가와 나의 차이는?", options: ["5", "3", "11"], answerRef: "/books/book-04/lessons/13/experience/check" },
    ["○와 △가 모두 □와 비교되어 있습니다.", "□에 적당한 수를 넣고 ○, △의 값을 구합니다.", "물어보는 두 값을 빼서 차이를 구합니다."]),
  story: { title: "차이만 알면 됩니다", text: "두 값이 정확히 얼마인지 몰라도, 서로 얼마나 차이 나는지는 식과 조건에서 구할 수 있습니다.", mission: "같은 사람(도형)과 비교한 조건끼리 이어서 두 값의 차이를 구하세요." },
  explanation: { headline: "기준에 수를 넣고 두 값을 뺍니다.", steps: ["조건을 '누가 누구보다 얼마만큼 큰지' 식으로 바꿉니다.", "한 사람(도형)에 적당한 수를 넣고 나머지 값을 차례로 구합니다.", "물어보는 두 값을 빼서 차이를 구합니다. 다른 수를 넣어도 차이는 같습니다."] },
  original: { title: "골든벨 4권", mode: "paged", sourceQuestionCount: diffItems.length, structureKey: "compare-difference-source-structure", prompt: "식과 조건을 읽고 차이를 구하세요.", items: diffItems },
  extension: { title: "추가 학습", structureKey: "compare-difference-source-structure", story: "동생, 언니, 오빠의 나이를 비교했습니다.", prompt: "언니는 동생보다 3살 많고, 오빠는 언니보다 4살 많습니다. 오빠와 동생은 몇 살 차이일까요?", visual: { kind: "book4", subtype: "source-clue-box", clues: ["언니는 동생보다 3살 많습니다.", "오빠는 언니보다 4살 많습니다."] }, answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-04/lessons/13/extension" }
};

const at = book.lessons.findIndex((l) => l.id === "balance-substitution");
book.lessons.splice(at, 0, lessonOrder, lessonDiff);

// 보류 메모: 22~30 → 28~30만 남김
const hold = book.sourceHold.find((h) => /22 ~30/.test(h.sourceLocator));
if (!hold) throw new Error("hold 22~30 not found");
hold.sourceLocator = "교사용 슬라이드 28 ~30의 양팔저울 등식";
hold.reason = "다음 묶음에서 학생용 원본과 대조해 넣을 예정";

// 쪽별 상태표 바로잡기(묶음 1·2 반영분 포함)
const cov = book.sourceCoverage;
const replace = (pages, entries) => {
  const i = cov.findIndex((e) => e.pages.join() === pages.join());
  if (i < 0) throw new Error(`coverage ${pages} not found`);
  cov.splice(i, 1, ...entries);
};
replace([16, 17], [{ pages: [16, 17], lessonId: "cube-min-count", status: "implemented" }]);
replace([22, 23, 24, 25, 26, 27, 28, 29, 30], [
  { pages: [22, 23, 24], lessonId: "compare-order-source", status: "implemented" },
  { pages: [25, 26, 27], lessonId: "compare-difference-source", status: "implemented" },
  { pages: [28, 29, 30], status: "held", holdCount: 8 }
]);
replace([36, 37], [{ pages: [36, 37], lessonId: "order-logic-source", status: "implemented" }]);
replace([40, 41], [{ pages: [40, 41], lessonId: "order-logic-source", status: "implemented" }]);
replace([44], [{ pages: [44], lessonId: "circle-logic-source", status: "implemented" }]);

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("batch3 patched; lessons:", book.lessons.map((l) => l.id).join(" "));
