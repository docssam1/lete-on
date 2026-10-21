// 골든벨 9권 묶음 3: 교사용 판서 5~6쪽.
// 02-1 Q5 층별로 위에서 본 모양 2문항 → 단원 5(앞과 옆에서 본 모양) 뒤에 덧붙인다.
// 02-2 쌓기나무의 최대/최소 Q1 개수 구하기 8 · Q2 최소/최대 4 → 새 단원 6을 단원 5 뒤에 둔다.
// 그림: 위(칸이 있으면 1) · 앞(왼쪽 줄부터 층수) · 오른쪽 옆(앞줄부터 층수). 판서의 검정 선만 옮기고 필기 숫자는 옮기지 않는다.
// 이 스크립트에는 정답이 없다. node patch-book09-batch3.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-09");
if (book.lessons.some((l) => l.id === "cube-min-max-source")) throw new Error("already patched");
const L5 = book.lessons.find((l) => l.id === "cube-views-source");
if (!L5 || L5.original.items.length !== 7) throw new Error("lesson 5 state");
const numberOf = (l) => Number(l.extension.answerRef.match(/lessons\/(\d+)\//)[1]);
if (book.lessons.some((l) => numberOf(l) === 6)) throw new Error("lesson number 6 taken");

const views = (top, front, side) => ({ kind: "book9", subtype: "cube-three-views", ...(top ? { top } : {}), front, side });
const NOTE = (lines) => ({ kind: "book5", subtype: "source-note-box", lines });
const withParts = (item, labels) => ({ ...item, parts: labels.map((label, k) => ({ id: String.fromCharCode(97 + k), label, answerRef: `${item.answerRef}/parts/${k}` })) });
const T = (s) => s.split("/").map((row) => [...row].map((ch) => (ch === "X" ? 1 : 0)));
const circled = ["①", "②", "③", "④"];
const counter = { 5: 0, 6: 0 };
const make = (lessonNo, lessonId, topic, k, spec) => {
  counter[spec.page] += 1;
  const n = counter[spec.page];
  let item = { id: `book09-src-s0${spec.page}-02-${n}`, lessonId, sourcePage: spec.page, sourceNo: `GB9-S0${spec.page}-02-${n}`,
    sourceLocator: `교사용 판서 ${spec.page}쪽 · ${spec.loc}`, printGroup: spec.group, topic, typeLabel: spec.type, prompt: spec.prompt,
    answerMode: "input", inputMode: "numeric", visual: spec.visual, answerRef: `/books/book-09/lessons/${lessonNo}/original/items/${k}` };
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  if (spec.parts) { item = withParts(item, spec.parts); delete item.answerMode; delete item.inputMode; }
  return item;
};

// ── 단원 5에 Q5 2문항 덧붙이기 ──
const LAYER = "쌓기나무를 층별로 위에서 본 모양입니다. 앞과 오른쪽 옆에서 보면 각 줄에 몇 층이 보이는지 왼쪽 줄부터 차례로 쓰시오.";
const q5 = [
  ["XX./XXX/.X.", ".../XXX/.X.", ".../.X./.X."],
  [".XX/XX./XXX", ".XX/XX./X..", "..X/.X./..."]
];
q5.forEach((layers, k) => {
  L5.original.items.push(make(5, L5.id, "앞과 옆에서 본 모양", L5.original.items.length, {
    page: 5, loc: `02-1 Q5 층별로 쌓기나무 위에서 본 모양 ${k + 1})`, group: 430, type: "층별 모양으로 앞·옆 모양", prompt: LAYER,
    visual: { kind: "book9", subtype: "cube-layer-grids", layers: layers.map(T) },
    parts: [...circled.slice(0, 3).map((c) => `앞 ${c}`), ...circled.slice(0, 3).map((c) => `옆 ${c}`)] }));
});
L5.original.sourceQuestionCount = L5.original.items.length;
L5.sourceLocator = "교사용 판서 4~5쪽 · 02-1 Q4 쌓기나무 앞/옆/위 모양 · Q5 층별 모양";

// ── 새 단원 6: 쌓기나무의 최대와 최소 (5~6쪽) ──
const COUNT = "위, 앞, 오른쪽 옆에서 본 모양이 다음과 같습니다. 쌓기나무는 몇 개입니까?";
const RANGE = "위, 앞, 오른쪽 옆에서 본 모양이 다음과 같을 때, 쌓기나무가 가장 적을 때와 가장 많을 때의 개수를 구하시오.";
const q1 = [
  [5, "XX/XX", [2, 1], [1, 2]], [5, "XXX/XX.", [2, 1, 1], [2, 2]], [5, "XX./.XX", [3, 1, 2], [2, 3]], [5, ".XX/XX./.X.", [2, 1, 3], [1, 2, 3]],
  [6, "XXX/.X./.X.", [2, 3, 1], [2, 2, 3]], [6, ".X./XXX/.X.", [3, 2, 3], [1, 3, 1]], [6, "XXX/X../X..", [3, 3, 3], [1, 2, 3]], [6, "XXX/XXX/XXX", [1, 1, 3], [1, 3, 2]]
];
const q2 = [
  ["XX./XX./XXX", [2, 1, 3], [3, 1, 2], ["가장 적을 때", "가장 많을 때"]],
  ["XX./.XX/..X", [3, 3, 2], [1, 3, 3], ["가장 많을 때", "가장 적을 때"]],
  ["XXX/XX./X..", [4, 3, 1], [4, 2, 3], ["가장 많을 때", "가장 적을 때"]],
  ["XXX/XXX/X..", [3, 1, 2], [3, 2, 2], ["가장 많을 때", "가장 적을 때"]]
];
const L6Specs = [
  ...q1.map(([page, top, front, side], k) => ({ page, loc: `02-2 Q1 쌓기나무 개수 구하기 (${k + 1})`, group: page === 5 ? 451 + Math.floor(k / 2) : 461 + Math.floor((k - 4) / 2),
    type: "세 방향 모양으로 개수", prompt: COUNT, visual: views(T(top), front, side) })),
  ...q2.map(([top, front, side, parts], k) => ({ page: 6, loc: `02-2 Q2 최소/최대 ${k + 1})`, group: 471 + Math.floor(k / 2), type: "가장 적을 때와 많을 때", prompt: RANGE,
    visual: views(T(top), front, side), parts,
    ...(k === 0 ? { discrepancy: "원본 그림의 위·앞·오른쪽 옆 모양에 판서 필기(층수)가 겹쳐 있어 칸 모양만 옮겼습니다. 1)은 ① 최소 ② 최대, 2)~4)는 최대·최소 순서로 원본과 같게 묻습니다." } : {}) }))
];
const template = (family, title) => ({ kind: "progressive-concept", family, title, learnerStage: L5.experience.learnerStage,
  learnerFit: L5.experience.learnerFit, finalStill: { standsAlone: true, visualSource: "original" } });
const L6 = {
  id: "cube-min-max-source", unit: "쌓기나무", title: "쌓기나무의 최대와 최소", sourceLocator: "교사용 판서 5~6쪽 · 02-2 쌓기나무의 최대/최소 Q1·Q2", sourceTypeIds: ["book09-cube-min-max-source"],
  representativeConcept: "위에서 본 모양의 칸마다 층수를 쓰되, 앞·옆 모양에서 1층으로 정해지는 칸부터 채우고 겹치는 줄의 높은 층을 확인한 뒤 남은 칸을 가장 적게·가장 많게 정함",
  story: { title: "쌓기나무의 최대와 최소", text: "위·앞·옆 모양만 보고 쌓기나무를 몇 개 썼는지 알아내요.", mission: "위에서 본 모양의 칸마다 층수를 써 보세요." },
  explanation: { headline: "1층으로 정해지는 칸 → 앞·옆이 겹쳐 높이가 정해지는 칸 → 남은 칸 순서로 층수를 씁니다.",
    steps: ["위에서 본 모양의 칸마다 쌓기나무가 적어도 1개씩 있습니다.", "앞이나 옆에서 1층으로 보이는 줄의 칸은 모두 1층입니다.", "앞과 옆에서 본 높은 층이 겹치는 칸에 그 층수를 씁니다.", "남은 칸은 줄의 높이를 넘지 않게 가장 적게(1층) 또는 가장 많게 씁니다."] },
  experience: { ...template("cube-min-max-b9", "정해지는 칸부터 채워요"),
    beats: [
      { id: "cube-min-max-step-1", action: "reveal", caption: "위에서 보면 네 칸, 앞에서도 옆에서도 두 줄이 모두 2층으로 보여요.", visual: views([[1, 1], [1, 1]], [2, 2], [2, 2]) },
      { id: "cube-min-max-step-2", action: "highlight", caption: "가장 적게 쓰려면 2층을 한 칸씩만 겹쳐 두 칸에 2층, 나머지에 1층을 써요.", visual: NOTE(["2 1", "1 2", "2 + 1 + 1 + 2 = 6"]) },
      { id: "cube-min-max-step-3", action: "verify", caption: "가장 많게 쓰려면 네 칸 모두 2층을 써요. 앞과 옆 모양은 그대로예요.", visual: NOTE(["2 2", "2 2", "2 + 2 + 2 + 2 = 8"]) }
    ], hint: "앞과 옆 모양이 바뀌지 않는지 확인하세요.",
    check: { prompt: "위에서 본 모양이 네 칸이고 앞과 옆에서 본 모양이 모두 2층 두 줄입니다. 쌓기나무가 가장 많을 때는 몇 개일까요?", options: ["8", "6", "4"], answerRef: "/books/book-09/lessons/6/experience/check" } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L6Specs.length, structureKey: "cube-min-max-source", prompt: "위·앞·옆 모양으로 쌓기나무의 개수를 구하시오.", items: L6Specs.map((spec, k) => make(6, "cube-min-max-source", "쌓기나무의 최대와 최소", k, spec)) },
  extension: { title: "추가 학습", structureKey: "cube-min-max-source", story: "위·앞·옆 모양으로 개수를 구합니다.", prompt: COUNT,
    visual: views([[1, 1], [1, 1]], [3, 1], [1, 3]), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-09/lessons/6/extension" }
};
book.lessons.splice(book.lessons.indexOf(L5) + 1, 0, L6);
book.lessonIntegration.newLessonIds = [...new Set([...(book.lessonIntegration.newLessonIds || []), L6.id])];

// ── 장부: 5·6쪽 보류 해제 ──
const all = book.lessons.flatMap((l) => l.original.items);
const pages = book.sourceCoverage.pages;
const P = (n) => pages.find((p) => p.page === n);
const idsOn = (page) => all.filter((it) => it.sourcePage === page).map((it) => it.id);
P(5).slots = [{ id: "GB9-S05-02", status: "released", itemIds: idsOn(5) }];
P(6).slots = [{ id: "GB9-S06-02", status: "released", itemIds: idsOn(6) }];
book.sourceHold = book.sourceHold.filter((h) => !["S5-Q5", "S5-Q2-1", "S6-Q2-2"].includes(h.sourceNo));
const slots = pages.flatMap((p) => p.slots);
const released = slots.filter((s) => s.status === "released");
for (const s of released) for (const id of s.itemIds) if (!all.some((it) => it.id === id)) throw new Error(`ledger item ${id}`);
if (released.reduce((n, s) => n + s.itemIds.length, 0) !== all.length) throw new Error("ledger misses items");
Object.assign(book.sourceCoverage, { sourceSlots: slots.length, releasedSlots: released.length, heldSlots: slots.length - released.length,
  publicItems: all.length, publicAnswerUnits: all.reduce((n, it) => n + (it.parts?.length || 1), 0) });
if (book.sourceCoverage.heldSlots !== book.sourceHold.length) throw new Error("hold count");
book.source.note = `교사용 판서 11쪽(10~11쪽은 10권 내용)을 묶음별로 원본 대조합니다. 원본 대조를 마친 쪽: 1~6쪽(넓이·쌓기나무). 공개 ${all.length}문항, 보류 ${book.sourceHold.length}건.`;

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
const { pages: _p, ...coverage } = book.sourceCoverage;
console.log("book09 batch3 patched", { L5: L5.original.items.length, L6: L6Specs.length, holds: book.sourceHold.length, coverage });
