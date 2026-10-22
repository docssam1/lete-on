// 골든벨 9권 묶음 2: 교사용 판서 2~4쪽 「02 쌓기나무 개수」 02-1 Q1~Q4.
// 단원 1(쌓기나무 개수)을 Q1 10문항 + Q2 보이지 않는 쌓기나무 3문항으로 다시 짜고,
// 새 단원 4(정육면체와 페인트칠, Q3 7문항) · 5(앞과 옆에서 본 모양, Q4 7문항)를 단원 1 뒤에 둔다.
// 그림은 4권 16~18쪽과 같은 빗각 쌓기나무(book04-renderers.js source-hidden-cube). map[줄][칸], 0번 줄이 뒤.
// 3쪽 (7) 십자 모양은 옛 데이터가 위·아래 칸을 둘째 줄에 두었으나 판서의 위에서 본 모양대로 셋째 줄로 고친다.
// 이 스크립트에는 정답이 없다. node patch-book09-batch2.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-09");
if (book.lessons.some((l) => l.id === "cube-paint-source")) throw new Error("already patched");
const L1 = book.lessons[1];
if (L1.id !== "cube-map-total") throw new Error("unexpected lesson 1");
const numberOf = (l) => Number(l.extension.answerRef.match(/lessons\/(\d+)\//)[1]);
for (const n of [4, 5]) if (book.lessons.some((l) => numberOf(l) === n)) throw new Error(`lesson number ${n} taken`);

const cubes = (map, extra = {}) => ({ kind: "book4", subtype: "source-hidden-cube", single: true, map, ...extra });
const NOTE = (lines) => ({ kind: "book5", subtype: "source-note-box", lines });
const withParts = (item, labels) => ({ ...item, parts: labels.map((label, k) => ({ id: String.fromCharCode(97 + k), label, answerRef: `${item.answerRef}/parts/${k}` })) });
const NOHIDE = "(보이지 않는 곳에는 쌓기나무가 없습니다.)";
const counter = {};
const build = (lessonNo, lessonId, topic, specs) => specs.map((spec, k) => {
  counter[spec.page] = (counter[spec.page] || 0) + 1;
  const n = counter[spec.page];
  let item = { id: `book09-src-s0${spec.page}-02-${n}`, lessonId, sourcePage: spec.page, sourceNo: `GB9-S0${spec.page}-02-${n}`,
    sourceLocator: `교사용 판서 ${spec.page}쪽 · 02-1 쌓기나무의 개수 ${spec.loc}`, printGroup: spec.group, topic, typeLabel: spec.type,
    prompt: spec.prompt, answerMode: "input", inputMode: "numeric", visual: spec.visual, answerRef: `/books/book-09/lessons/${lessonNo}/original/items/${k}` };
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  if (spec.parts) { item = withParts(item, spec.parts); delete item.answerMode; delete item.inputMode; }
  return item;
});

// ── 단원 1: Q1 전체 개수 10 + Q2 보이지 않는 쌓기나무 3 ──
const Q1 = `쌓기나무를 위에서 본 모양의 각 칸에 쌓인 개수를 생각하여, 쌓기나무는 모두 몇 개인지 구하시오. ${NOHIDE}`;
const Q1NOTE = "원본 ① 「위에서 본 모양」(칸에 층수를 쓰는 그림 답)은 풀이에서 보여 주고, ② 전체 개수를 답으로 받습니다.";
const q1maps = [
  [2, [[2, 2], [2, 2]]], [2, [[2, 1], [1, 0]]], [2, [[3, 3, 3], [3, 3, 3], [3, 3, 3]]],
  [3, [[2, 2, 1], [2, 1, 0]]], [3, [[1, 4, 3, 1], [0, 0, 1, 0]]], [3, [[4, 3, 1], [3, 2, 0], [1, 0, 0]]],
  [3, [[4, 3, 1], [3, 2, 1], [2, 1, 0], [1, 0, 0]]], [3, [[3, 1], [1, 2]]], [3, [[2, 1], [3, 2], [2, 0]]],
  [3, [[0, 0, 2, 0], [1, 4, 3, 1], [0, 0, 1, 0]]]
];
const pyramid = (n) => Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => Math.max(0, n - r - c)));
const STAIR = "벽 모서리에 계단 모양으로 빈틈없이 쌓은 쌓기나무입니다.";
const STAIR_NOTE = "원본 그림은 벽 모서리에 계단 모양으로 쌓은 쌓기나무이고, 보이지 않는 자리에도 빈틈없이 쌓았다는 것을 물음 글에 밝혔습니다.";
const L1Specs = [
  ...q1maps.map(([page, map], k) => ({ page, loc: `Q1 (${k + 1})`, group: page === 2 ? 221 : 230 + Math.floor((k - 3) / 2), type: "쌓기나무 전체 개수", prompt: Q1, visual: cubes(map), ...(k === 0 ? { discrepancy: Q1NOTE } : {}) })),
  { page: 3, loc: "Q2 1) 첫째 그림", group: 241, type: "보이지 않는 쌓기나무", prompt: `${STAIR} 전체 쌓기나무, 보이는 쌓기나무, 보이지 않는 쌓기나무는 각각 몇 개입니까?`, visual: cubes(pyramid(4), { walls: true }),
    parts: ["전체", "보이는 쌓기나무", "보이지 않는 쌓기나무"], discrepancy: STAIR_NOTE },
  { page: 3, loc: "Q2 1) 둘째 그림", group: 241, type: "보이지 않는 쌓기나무", prompt: `${STAIR} 보이지 않는 쌓기나무는 몇 개입니까?`, visual: cubes(pyramid(5), { walls: true }), discrepancy: STAIR_NOTE },
  { page: 3, loc: "Q2 2)", group: 242, type: "빼야 하는 쌓기나무", prompt: "A모양을 B모양이 되도록 하려면 쌓기나무를 몇 개 빼야 합니까? (보이지 않는 곳에도 빈틈없이 쌓았습니다.)",
    visual: { kind: "book4", subtype: "source-hidden-cube", figures: [{ label: "A", map: [[3, 3, 3], [3, 3, 3], [3, 3, 3]] }, { label: "B", map: [[3, 2, 1], [2, 1, 0], [1, 0, 0]] }] } }
];
Object.assign(L1, { title: "쌓기나무의 개수", sourceLocator: "교사용 판서 2~3쪽 · 02-1 쌓기나무의 개수 Q1·Q2" });
L1.original = { ...L1.original, title: "골든벨", prompt: "쌓기나무의 개수를 구하시오.", items: build(1, L1.id, "쌓기나무의 개수", L1Specs), sourceQuestionCount: L1Specs.length };
delete L1.original.visual;
L1.experience = { ...L1.experience, model: { visual: { kind: "book9", subtype: "cube-solid-views", map: [[3, 1], [2, 1]] } },
  beats: [
    { id: "cube-beat-1", action: "draw", phase: "problem", caption: "쌓기나무를 위에서 내려다본다고 생각해요." },
    { id: "cube-beat-2", action: "highlight", phase: "organize", caption: "위에서 본 모양의 칸마다 몇 층인지 써요." },
    { id: "cube-beat-3", action: "transform", phase: "calculate", caption: "칸에 쓴 층수를 모두 더해요." },
    { id: "cube-beat-4", action: "verify", phase: "verify", caption: "더한 값이 쌓기나무의 전체 개수예요." }
  ] };

// 추가 학습·유사문제 그림도 원본과 같은 빗각 쌓기나무로(높이 지도는 그대로)
L1.extension.visual = cubes(L1.extension.visual.map);
for (const p of L1.similarPractice || []) if (p.visual?.map) p.visual = cubes(p.visual.map);

// ── 새 단원 4: 정육면체와 페인트칠 (4쪽 Q3) ──
const PAINT = "쌓기나무 27개로 만든 큰 정육면체의 바깥쪽 면(바닥 포함)을 모두 페인트로 칠했습니다.";
const big = [[3, 3, 3], [3, 3, 3], [3, 3, 3]];
const L4Specs = [
  ...["면", "모서리", "꼭짓점"].map((w) => ({ page: 4, loc: `Q3 1) ${w}`, group: 411, type: "정육면체의 면·모서리·꼭짓점", prompt: `정육면체의 ${w}은 몇 개입니까?`.replace("면은", "면은").replace("리은", "리는").replace("점은", "점은"), visual: cubes([[1]], { size: 96 }) })),
  ...[["세 면이", "세 면이 색칠된"], ["두 면이", "두 면이 색칠된"], ["한 면이", "한 면이 색칠된"], ["색칠", "색칠이 안 된"]].map(([w, t]) => ({ page: 4, loc: `Q3 2) ${t}`, group: 412, type: "페인트칠한 정육면체",
    prompt: `${PAINT} ${t} 쌓기나무는 몇 개입니까?`, visual: cubes(big) }))
];
const template = (family, title) => ({ kind: "progressive-concept", family, title, learnerStage: L1.experience.learnerStage || "7세 8월부터 초등 1학년 초반 · FC 1과정 9권",
  learnerFit: { language: "한 문장에 한 행동을 담은 짧은 한국어", representations: "교재 구조를 보존한 도형·수·표 시각화", prerequisites: "수 세기, 한 자리 덧셈·뺄셈, 방향과 기본 도형", reasoningLoad: "보기, 관계 찾기, 확인하기의 세 단계", responseMode: "터치 가능한 3지선다와 답 보기" },
  finalStill: { standsAlone: true, visualSource: "original" } });
const L4 = {
  id: "cube-paint-source", unit: "쌓기나무", title: "정육면체와 페인트칠", sourceLocator: "교사용 판서 4쪽 · 02-1 Q3 페인트칠", sourceTypeIds: ["book09-cube-paint-source"],
  representativeConcept: "큰 정육면체의 꼭짓점 자리 쌓기나무는 세 면, 모서리 가운데는 두 면, 면 가운데는 한 면이 칠해지고, 가장 안쪽은 칠해지지 않음",
  story: { title: "정육면체와 페인트칠", text: "큰 정육면체 겉을 칠하면 쌓기나무마다 칠해진 면의 수가 달라요.", mission: "꼭짓점·모서리·면 가운데·가장 안쪽으로 나누어 세어 보세요." },
  explanation: { headline: "꼭짓점 자리는 세 면, 모서리 자리는 두 면, 면 가운데는 한 면이 칠해집니다.",
    steps: ["정육면체는 면 6개, 모서리 12개, 꼭짓점 8개입니다.", "꼭짓점마다 쌓기나무 하나가 세 면이 칠해집니다.", "모서리마다 꼭짓점을 뺀 가운데 쌓기나무가 두 면이 칠해집니다.", "면마다 가장자리를 뺀 가운데가 한 면, 가장 안쪽은 칠해지지 않습니다."] },
  experience: { ...template("cube-paint-b9", "어느 자리가 몇 면 칠해질까"),
    beats: [
      { id: "cube-paint-step-1", action: "reveal", caption: "쌓기나무 8개로 만든 큰 정육면체의 겉을 칠해요.", visual: cubes([[2, 2], [2, 2]]) },
      { id: "cube-paint-step-2", action: "highlight", caption: "8개가 모두 꼭짓점 자리라서 하나마다 세 면이 칠해져요.", visual: NOTE(["꼭짓점 자리 8개", "모두 세 면이 칠해짐"]) },
      { id: "cube-paint-step-3", action: "verify", caption: "가장 안쪽 쌓기나무가 없으니 칠해지지 않은 쌓기나무는 없어요.", visual: NOTE(["세 면: 8개", "칠해지지 않음: 0개"]) }
    ], hint: "꼭짓점 자리부터 세어 보세요.",
    check: { prompt: "쌓기나무 8개로 만든 큰 정육면체의 겉을 모두 칠했습니다. 세 면이 칠해진 쌓기나무는 몇 개일까요?", options: ["8", "4", "6"], answerRef: "/books/book-09/lessons/4/experience/check" } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L4Specs.length, structureKey: "cube-paint-source", prompt: "정육면체와 페인트칠한 쌓기나무를 세시오.", items: build(4, "cube-paint-source", "정육면체와 페인트칠", L4Specs) },
  extension: { title: "추가 학습", structureKey: "cube-paint-source", story: "가로·세로·높이를 4개씩 쌓은 큰 정육면체를 칠합니다.", prompt: "쌓기나무 64개로 만든 큰 정육면체의 바깥쪽 면(바닥 포함)을 모두 칠했습니다. 두 면이 칠해진 쌓기나무는 몇 개입니까?",
    visual: cubes([[4, 4, 4, 4], [4, 4, 4, 4], [4, 4, 4, 4], [4, 4, 4, 4]]), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-09/lessons/4/extension" }
};
// 「정육면체의 면은」「모서리는」「꼭짓점은」 조사 맞춤
for (const it of L4.original.items) it.prompt = it.prompt.replace("모서리은", "모서리는");

// ── 새 단원 5: 앞과 옆에서 본 모양 (4쪽 Q4) ──
const VIEW = `쌓기나무를 앞과 오른쪽 옆에서 보면 각 줄에 몇 층이 보이는지 왼쪽 줄부터 차례로 쓰시오. ${NOHIDE}`;
const views = [
  [[[3, 2, 2], [2, 2, 1], [1, 0, 0]], 3, 3], [[[3, 2, 1], [2, 1, 1], [1, 0, 0]], 3, 3], [[[4, 3, 1], [3, 2, 0], [1, 0, 0]], 3, 3],
  [[[0, 3, 1], [3, 2, 0], [1, 0, 0]], 3, 3], [[[3, 1, 1], [1, 2, 1], [1, 0, 0]], 3, 3], [[[2, 3, 0], [2, 1, 1], [1, 0, 0]], 3, 3],
  [[[0, 0, 2, 0], [1, 4, 3, 1], [0, 0, 1, 0]], 4, 3]
];
const circled = ["①", "②", "③", "④"];
const L5Specs = views.map(([map, fw, sw], k) => ({ page: 4, loc: `Q4 (${k + 1})`, group: 420 + Math.floor(k / 2), type: "앞과 옆에서 본 모양", prompt: VIEW, visual: cubes(map),
  parts: [...circled.slice(0, fw).map((c) => `앞 ${c}`), ...circled.slice(0, sw).map((c) => `옆 ${c}`)],
  ...(k === 3 ? { discrepancy: "원본은 이 그림에서 위에서 본 모양도 그리게 하지만, 칸 모양을 그리는 답이라 앞과 오른쪽 옆에서 본 층수만 받습니다." } : {}) }));
const L5 = {
  id: "cube-views-source", unit: "쌓기나무", title: "앞과 옆에서 본 모양", sourceLocator: "교사용 판서 4쪽 · 02-1 Q4 쌓기나무 앞/옆/위 모양", sourceTypeIds: ["book09-cube-views-source"],
  representativeConcept: "앞에서 보면 왼쪽에서 오른쪽으로 줄마다 가장 높은 층이, 오른쪽 옆에서 보면 앞에서 뒤로 줄마다 가장 높은 층이 보임",
  story: { title: "앞과 옆에서 본 모양", text: "같은 쌓기나무도 보는 곳에 따라 다른 모양으로 보여요.", mission: "줄마다 가장 높은 기둥을 찾아 보세요." },
  explanation: { headline: "앞에서 본 모양은 세로줄마다, 오른쪽 옆에서 본 모양은 가로줄마다 가장 높은 층수만큼 보입니다.",
    steps: ["앞에서 볼 때는 왼쪽 줄부터 오른쪽 줄까지 차례로 봅니다.", "한 줄에 기둥이 여러 개면 가장 높은 기둥만 보입니다.", "오른쪽 옆에서 볼 때는 앞줄이 왼쪽, 뒷줄이 오른쪽에 보입니다.", "보이지 않는 곳에 쌓기나무가 없다고 생각하고 셉니다."] },
  experience: { ...template("cube-views-b9", "줄마다 가장 높은 기둥"),
    beats: [
      { id: "cube-views-step-1", action: "reveal", caption: "뒷줄에 2층 2개, 앞줄 왼쪽에 1층 1개가 있어요.", visual: cubes([[2, 2], [1, 0]]) },
      { id: "cube-views-step-2", action: "highlight", caption: "앞에서 보면 왼쪽 줄도 오른쪽 줄도 가장 높은 기둥이 2층이에요.", visual: NOTE(["앞: 왼쪽 줄 2층", "앞: 오른쪽 줄 2층"]) },
      { id: "cube-views-step-3", action: "verify", caption: "오른쪽 옆에서 보면 앞줄은 1층, 뒷줄은 2층이 보여요.", visual: NOTE(["옆: 앞줄 1층", "옆: 뒷줄 2층"]) }
    ], hint: "한 줄에서 가장 높은 기둥만 보여요.",
    check: { prompt: "앞줄에 3층 기둥, 그 뒤에 1층 기둥이 있습니다. 앞에서 보면 그 줄은 몇 층으로 보일까요?", options: ["3", "1", "4"], answerRef: "/books/book-09/lessons/5/experience/check" } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L5Specs.length, structureKey: "cube-views-source", prompt: VIEW, items: build(5, "cube-views-source", "앞과 옆에서 본 모양", L5Specs) },
  extension: { title: "추가 학습", structureKey: "cube-views-source", story: "앞에서 본 모양의 칸 수를 셉니다.", prompt: "쌓기나무를 앞에서 본 모양은 모두 몇 칸입니까? (보이지 않는 곳에는 쌓기나무가 없습니다.)",
    visual: cubes([[3, 1], [2, 1]]), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-09/lessons/5/extension" }
};
book.lessons.splice(book.lessons.indexOf(L1) + 1, 0, L4, L5);
book.lessonIntegration.newLessonIds = [...new Set([...(book.lessonIntegration.newLessonIds || []), L4.id, L5.id])];

// ── 장부: 2쪽 쌓기나무 슬롯, 3쪽, 4쪽 보류 해제 ──
const all = book.lessons.flatMap((l) => l.original.items);
const idsOn = (page, lessonIds) => all.filter((it) => it.sourcePage === page && lessonIds.includes(it.lessonId)).map((it) => it.id);
const pages = book.sourceCoverage.pages;
const P = (n) => pages.find((p) => p.page === n);
P(2).slots = [P(2).slots.find((s) => s.id === "GB9-S02-01"), { id: "GB9-S02-02", status: "released", itemIds: idsOn(2, [L1.id]) }];
P(3).slots = [{ id: "GB9-S03-02", status: "released", itemIds: idsOn(3, [L1.id]) }];
P(4).slots = [{ id: "GB9-S04-02", status: "released", itemIds: idsOn(4, [L4.id, L5.id]) }];
if (P(2).slots.some((s) => !s || !s.itemIds.length) || !P(3).slots[0].itemIds.length || !P(4).slots[0].itemIds.length) throw new Error("ledger slots");
book.sourceHold = book.sourceHold.filter((h) => !["S3-Q2", "S4-Q3", "S4-Q4"].includes(h.sourceNo));
const slots = pages.flatMap((p) => p.slots);
const released = slots.filter((s) => s.status === "released");
for (const s of released) for (const id of s.itemIds) if (!all.some((it) => it.id === id)) throw new Error(`ledger item ${id}`);
if (released.reduce((n, s) => n + s.itemIds.length, 0) !== all.length) throw new Error("ledger misses items");
Object.assign(book.sourceCoverage, { sourceSlots: slots.length, releasedSlots: released.length, heldSlots: slots.length - released.length,
  publicItems: all.length, publicAnswerUnits: all.reduce((n, it) => n + (it.parts?.length || 1), 0), cubeSourceItems: all.filter((it) => it.visual?.subtype === "source-hidden-cube").length });
if (book.sourceCoverage.heldSlots !== book.sourceHold.length) throw new Error("hold count");
book.source.note = `교사용 판서 11쪽(10~11쪽은 10권 내용)을 묶음별로 원본 대조합니다. 원본 대조를 마친 쪽: 1~4쪽(넓이·쌓기나무). 공개 ${all.length}문항, 보류 ${book.sourceHold.length}건.`;

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
const { pages: _p, ...coverage } = book.sourceCoverage;
console.log("book09 batch2 patched", { L1: L1Specs.length, L4: L4Specs.length, L5: L5Specs.length, holds: book.sourceHold.length, coverage });
