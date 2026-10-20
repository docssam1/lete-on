// 골든벨 7권 묶음 6: 교사용 슬라이드 63~66 「2. 벤 다이어그램 · 3. 벤 다이어그램 2」 — 7권 마지막 묶음.
// 단원 3 자리에 원본 15문항으로 다시 짠다. 옛 venn 그림은 모든 칸의 수(겹친 수 = 답 포함)를 그리고 있었다(추가 학습·유사문제 포함).
// 이 스크립트에는 정답이 없다. node patch-book07-batch6.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-07");
const L3No = book.lessons.findIndex((l) => l.id === "venn-overlap-all"), L3 = book.lessons[L3No];
if (L3.original.items.some((i) => i.sourceNo.startsWith("GB7-"))) throw new Error("already patched");

const build = (lessonNo, lessonId, topic, specs) => specs.map((spec, k) => {
  const item = { id: `book07-src-${spec.no.slice(4).toLowerCase()}`, sourcePage: Number(spec.no.slice(5, 7)), sourceNo: spec.no, lessonId, topic,
    typeLabel: spec.type, sourceLocator: spec.loc, printGroup: spec.group, answerMode: "input", inputMode: "numeric", prompt: spec.prompt,
    answerRef: `/books/book-07/lessons/${lessonNo}/original/items/${k}`, visual: spec.visual };
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  return item;
});
const venn = (labels, universe = false) => ({ kind: "book5", subtype: "source-venn", labels, ...(universe ? { universe: true } : {}) });
const S2 = "2. 벤 다이어그램", S3 = "3. 벤 다이어그램 2";
const FRUIT = (n, a, b) => `영주의 친구들은 ${n}명인데 모두 과일을 좋아합니다. 그중에서 사과를 좋아하는 친구가 ${a}명이고, 포도를 좋아하는 친구가 ${b}명입니다.`;
const ASK = ["사과와 포도 모두 좋아하는 사람은 몇 명입니까?", "사과만 좋아하는 사람은 몇 명입니까?", "포도만 좋아하는 사람은 몇 명입니까?", "두 과일 중 하나만 좋아하는 사람은 몇 명입니까?"];
const TYPE = ["모두 좋아하는 수", "하나만 좋아하는 수", "하나만 좋아하는 수", "하나만 좋아하는 수"];
const BALL = "원석이의 친구들은 모두 축구나 야구를 좋아합니다. 그중에서 축구를 좋아하는 친구는 13명이고, 야구를 좋아하는 친구는 9명입니다.";
const specs = [
  ...[["01", 15, 7, 12], ["02", 27, 15, 21]].flatMap(([sec, n, a, b]) => ASK.map((q, k) => ({ no: `GB7-S63-${sec}-${k + 1}`, loc: `교사용 슬라이드 63 · ${S2} ${sec} (${k + 1})`, group: 630 + Number(sec),
    type: TYPE[k], prompt: `${FRUIT(n, a, b)} (${k + 1}) ${q}`, visual: venn(["사과", "포도"]) }))),
  ...[4, 7].map((x, k) => ({ no: `GB7-S64-03-${k + 1}`, loc: `교사용 슬라이드 64 · ${S2} 03 (${k + 1})`, group: 641, type: "전체 수",
    prompt: `${BALL} (${k + 1}) 모두 좋아하는 사람이 ${x}명일 때 원석이의 친구는 모두 몇 명입니까?`, visual: venn(["축구", "야구"]) })),
  { no: "GB7-S64-04-1", loc: `교사용 슬라이드 64 · ${S2} 04`, group: 642, type: "전체 수",
    prompt: "어느 지역을 조사해 보니 딸이 있는 가구가 20가구, 아들이 있는 가구가 28가구였습니다. 딸과 아들이 모두 있는 가구가 15가구라면 그 지역의 가구는 모두 몇 가구입니까? (단, 아들과 딸이 모두 없는 가구는 없습니다.)", visual: venn(["아들", "딸"]) },
  { no: "GB7-S65-01-1", loc: `교사용 슬라이드 65 · ${S3} 01`, group: 651, type: "모두 좋아하는 수",
    prompt: "학생 30명을 대상으로 각자 좋아하는 과목이 무엇인지 조사하였습니다. 수학을 좋아하는 학생은 21명, 영어를 좋아하는 학생은 15명, 수학과 영어 모두 좋아하지 않는 학생은 3명이었습니다. 수학과 영어를 모두 좋아하는 학생은 몇 명입니까?",
    visual: venn(["수학", "영어"], true), discrepancy: "원본 물음 글에 다른 문항의 과목 이름이 남아 있어 이 문항의 과목 이름으로 고쳤습니다." },
  { no: "GB7-S65-02-1", loc: `교사용 슬라이드 65 · ${S3} 02`, group: 652, type: "모두 좋아하는 수",
    prompt: "학생 50명을 대상으로 각자 좋아하는 운동이 무엇인지 조사하였습니다. 수영을 좋아하는 학생은 32명, 태권도를 좋아하는 학생은 25명, 수영과 태권도 모두 좋아하지 않는 학생은 10명이었습니다. 수영과 태권도를 모두 좋아하는 학생은 몇 명입니까?",
    visual: venn(["수영", "태권도"], true) },
  { no: "GB7-S66-03-1", loc: `교사용 슬라이드 66 · ${S3} 03`, group: 661, type: "둘 다 싫은 수",
    prompt: "학생 36명을 대상으로 각자 좋아하는 과일이 무엇인지 조사하였습니다. 귤을 좋아하는 학생은 19명, 포도를 좋아하는 학생은 16명, 귤과 포도 모두 좋아하는 학생은 8명이었습니다. 귤과 포도를 모두 싫어하는 학생은 몇 명입니까?",
    visual: venn(["귤", "포도"], true) },
  { no: "GB7-S66-04-1", loc: `교사용 슬라이드 66 · ${S3} 04`, group: 662, type: "하나만 좋아하는 수",
    prompt: "학생 42명을 대상으로 각자 좋아하는 동물이 무엇인지 조사하였습니다. 곤충을 좋아하는 학생은 31명, 물고기를 좋아하는 학생은 25명, 곤충과 물고기 모두 좋아하지 않는 학생은 7명이었습니다. 곤충과 물고기 둘 중 한 가지만 좋아하는 학생은 몇 명입니까?",
    visual: venn(["곤충", "물고기"], true), discrepancy: "원본 물음 글에 다른 문항의 운동 이름이 두 군데 남아 있어 이 문항의 동물 이름으로 고쳤습니다." }
];
Object.assign(L3, { title: "벤 다이어그램", sourceLocator: "교사용 슬라이드 63~66 · 2. 벤 다이어그램 · 3. 벤 다이어그램 2",
  representativeConcept: "두 모임의 수를 더하면 겹친 부분이 두 번 들어가므로, 전체(둘 다 싫은 수를 뺀 수)와의 차가 겹친 수" });
L3.story = { ...L3.story, title: "벤 다이어그램" };
L3.original = { ...L3.original, title: "골든벨", sourceQuestionCount: specs.length, prompt: "벤 다이어그램에 수를 채워 물음에 답하시오.", items: build(L3No, L3.id, "벤 다이어그램", specs) };
// 추가 학습·유사문제: 옛 그림은 겹친 수(답)를 적었다 → 빈 벤 다이어그램(물음 글에 수가 다 있다).
for (const p of [L3.extension, ...(L3.similarPractice || [])]) {
  if (p.visual?.subtype !== "venn") throw new Error("unexpected L3 practice visual");
  p.visual = venn(p.visual.labels);
}

// 묶음 4·5에서 남은 옛 그림: 단원 2 연습은 둥근 호수 그림으로, 단원 10 연습은 □△ − △□ 그림으로(옛 그림에는 물음에 없는 「두 수의 합」 범위가 적혀 있었다).
for (const p of [book.lessons.find((l) => l.id === "closed-loop-planting"), book.lessons.find((l) => l.id === "reverse-digits")].flatMap((l) => [l.extension, ...(l.similarPractice || [])])) {
  if (p.visual?.subtype === "perimeter-loop") p.visual = { kind: "book5", subtype: "source-lake", marker: "lamp", gap: `${p.visual.spacing}m` };
  else if (p.visual?.subtype === "reverse-digits") p.visual = { kind: "book5", subtype: "source-swap-sub", result: p.visual.difference };
  else throw new Error("unexpected practice visual");
}

const units = (list) => list.length;
for (let page = 63; page <= 66; page += 1) {
  const list = specs.filter((s) => Number(s.no.slice(5, 7)) === page);
  if (!list.length) throw new Error(`page ${page} empty`);
  Object.assign(book.sourceCoverage.pageLedger.find((e) => e.page === page), { releasedItems: list.length, releasedAnswerUnits: units(list), heldRecords: 0, heldAnswerUnits: 0 });
}
book.sourceHold = book.sourceHold.filter((h) => !(h.sourcePage >= 63 && h.sourcePage <= 66));
const L = book.sourceCoverage.pageLedger;
Object.assign(book.sourceCoverage, {
  publicItems: L.reduce((n, e) => n + e.releasedItems, 0), publicAnswerUnits: L.reduce((n, e) => n + e.releasedAnswerUnits, 0),
  holdItems: book.sourceHold.filter((h) => h.sourceHold.itemCount > 0).length, heldAnswerUnits: L.reduce((n, e) => n + e.heldAnswerUnits, 0)
});
book.sourceCoverage.totalAnswerUnits = book.sourceCoverage.publicAnswerUnits + book.sourceCoverage.heldAnswerUnits;

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book07 batch6 patched", { L3: specs.length, holds: book.sourceHold.map((h) => h.sourcePage), coverage: { ...book.sourceCoverage, pageLedger: undefined } });
