// 골든벨 9권 묶음 5: 교사용 판서 9쪽 03-2 원형진·삼각진.
// Q1 원형진 1) 2문항 · 2) 1문항 / Q2 삼각진 1) 2 · 2) 2 · 3) 1문항 → 새 단원 7을 단원 2(마방진) 뒤에 둔다.
// 판서의 검정 글씨(수 카드·주어진 수·물음)만 옮기고, 빨강·파랑 필기(답·풀이·별표·「Q.」 표시)는 옮기지 않는다.
// 1)의 칸 이름 a~e는 물음 글이 「c」를 가리키므로 그림에 둔다.
// 이 스크립트에는 정답이 없다. node patch-book09-batch5.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-09");
if (book.lessons.some((l) => l.id === "magic-arrangement-source")) throw new Error("already patched");
const L2 = book.lessons.find((l) => l.id === "magic-square-missing");
const L5 = book.lessons.find((l) => l.id === "cube-views-source");
if (!L2 || L2.original.items.length !== 21) throw new Error("lesson 2 state");
const numberOf = (l) => Number(l.extension.answerRef.match(/lessons\/(\d+)\//)[1]);
if (book.lessons.some((l) => numberOf(l) === 7)) throw new Error("lesson number 7 taken");

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, k) => a + k);
const cross = (arm, cards, labels) => ({ kind: "book9", subtype: "magic-cross", arm, cards, ...(labels ? { labels } : {}) });
const tri = (cells, cards) => ({ kind: "book9", subtype: "magic-triangle", ...(cells ? { cells } : {}), ...(cards ? { cards } : {}) });
const NOTE = (lines) => ({ kind: "book5", subtype: "source-note-box", lines });
// 십자 칸 순서: 가운데, 위, 오른쪽, 아래, 왼쪽 → 판서의 칸 이름 c, a, d, e, b
const LABELS5 = ["c", "a", "d", "e", "b"];
const SET = { inputMode: "text", resultContract: { type: "set" } };

const CROSS1 = (cards) => `${cards[0]}부터 ${cards.at(-1)}까지의 수를 한 번씩 넣어 가로줄 세 수의 합과 세로줄 세 수의 합이 같게 하려고 합니다.`;
const CROSS2 = "1부터 9까지의 수를 한 번씩 넣으려고 합니다. 가운데 칸에서 위, 아래, 왼쪽, 오른쪽으로 뻗은 네 줄은 가운데 칸을 함께 넣어 세 수씩입니다. 네 줄의 합이 모두 같게 하려고 합니다.";
const TRI = "삼각형의 세 변에 놓인 세 수의 합이 모두 같습니다. □에 들어갈 수를 구하시오.";
const specs = [
  { loc: "Q1 원형진 1) 첫째", group: 601, type: "원형진의 가운데 칸", visual: cross(1, range(1, 5), LABELS5), prompt: `${CROSS1(range(1, 5))} 물음에 답하시오.`,
    parts: [{ id: "point", label: "여러 번 더해지는 칸", inputMode: "text" }, { id: "c", label: "c에 넣을 수 있는 수 모두", ...SET }, { id: "max-c", label: "한 줄의 합이 가장 클 때 c" }, { id: "max-sum", label: "그때 한 줄의 합" }] },
  { loc: "Q1 원형진 1) 둘째", group: 601, type: "원형진의 가운데 칸", visual: cross(1, range(2, 6), LABELS5), prompt: `${CROSS1(range(2, 6))} 물음에 답하시오.`,
    parts: [{ id: "c", label: "c에 넣을 수 있는 수 모두", ...SET }, { id: "min-c", label: "한 줄의 합이 가장 작을 때 c" }, { id: "min-sum", label: "그때 한 줄의 합" }] },
  { loc: "Q1 원형진 2)", group: 602, type: "원형진의 가운데 칸", visual: cross(2, range(1, 9)), prompt: `${CROSS2} 물음에 답하시오.`,
    parts: [{ id: "point", label: "가운데 칸에 넣을 수 있는 수 모두", ...SET }, { id: "min-c", label: "한 줄의 합이 가장 작을 때 가운데 칸의 수" }, { id: "min-sum", label: "그때 한 줄의 합" }],
    discrepancy: "판서 물음의 「한 줄(세 수)」을 따라, 가운데 칸에서 뻗은 네 줄을 가운데 칸을 함께 넣은 세 수씩으로 묻습니다(위아래 다섯 칸을 한 줄로 보지 않습니다)." },
  { loc: "Q2 삼각진 1) 왼쪽", group: 603, type: "삼각진의 빈칸", visual: tri([2, 7, 6, 3, "□", 4]), prompt: TRI },
  { loc: "Q2 삼각진 1) 오른쪽", group: 603, type: "삼각진의 빈칸", visual: tri([1, 6, 4, 3, "□", 5]), prompt: TRI },
  { loc: "Q2 삼각진 2) 왼쪽", group: 604, type: "삼각진의 겹치는 칸", visual: tri([null, 5, 3, 4, null, "□"]), prompt: TRI },
  { loc: "Q2 삼각진 2) 오른쪽", group: 604, type: "삼각진의 겹치는 칸", visual: tri([6, 5, null, null, "□", 8]), prompt: TRI },
  { loc: "Q2 삼각진 3)", group: 605, type: "삼각진의 가장 작은 합·가장 큰 합", visual: tri(null, range(4, 9)),
    prompt: "4부터 9까지의 수를 한 번씩 넣어 삼각형의 세 변에 놓인 세 수의 합이 모두 같게 하려고 합니다. 한 줄의 합이 가장 작을 때와 가장 클 때의 합을 구하시오.",
    parts: [{ id: "min", label: "한 줄의 합이 가장 작을 때" }, { id: "max", label: "한 줄의 합이 가장 클 때" }],
    discrepancy: "판서는 ① 가장 작을 때 ② 가장 클 때의 배치를 그리게 합니다. 화면에서는 배치 대신 그때의 한 줄의 합을 묻습니다." }
];
const lessonId = "magic-arrangement-source";
const items = specs.map((spec, k) => {
  const answerRef = `/books/book-09/lessons/7/original/items/${k}`;
  const item = { id: `book09-src-s09-03-${k + 1}`, lessonId, sourcePage: 9, sourceNo: `GB9-S09-03-${k + 1}`, sourceLocator: `교사용 판서 9쪽 · 03-2 ${spec.loc}`,
    printGroup: spec.group, topic: "원형진과 삼각진", typeLabel: spec.type, prompt: spec.prompt, visual: spec.visual, answerRef };
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  if (spec.parts) item.parts = spec.parts.map((p, j) => ({ ...p, answerRef: `${answerRef}/parts/${j}` }));
  else Object.assign(item, { answerMode: "input", inputMode: "numeric" });
  return item;
});

const L7 = {
  id: lessonId, unit: "마방진", title: "원형진과 삼각진", sourceLocator: "교사용 판서 9쪽 · 03-2 원형진 Q1 · 삼각진 Q2", sourceTypeIds: ["book09-magic-cross-source", "book09-magic-triangle-source"],
  representativeConcept: "여러 번 더해지는 칸(원형진은 가운데, 삼각진은 꼭짓점)을 먼저 찾고, 모든 수의 합에 그 칸의 수를 더한 값이 줄 수로 똑같이 나뉘는지로 넣을 수 있는 수와 한 줄의 합을 정함",
  story: { title: "원형진과 삼각진", text: "여러 줄이 함께 쓰는 칸이 있어요. 그 칸의 수는 여러 번 더해져요.", mission: "여러 번 더해지는 칸부터 찾아보세요." },
  explanation: { headline: "여러 번 더해지는 칸이 열쇠예요. 원형진은 가운데, 삼각진은 꼭짓점이에요.",
    steps: ["여러 줄이 함께 쓰는 칸을 찾습니다. 그 칸의 수는 줄마다 한 번씩 더해집니다.", "모든 수의 합에 여러 번 더해지는 수를 더 더하면 모든 줄의 합을 합친 값이 됩니다.",
      "그 값이 줄 수로 똑같이 나뉘어야 하므로 넣을 수 있는 수가 정해집니다. 여러 번 더해지는 칸에 작은 수를 넣으면 한 줄의 합이 작아지고, 큰 수를 넣으면 커집니다.",
      "삼각진에서 모르는 칸이 있으면 두 변이 함께 쓰는 꼭짓점을 찾아, 두 변의 나머지 수끼리 비교합니다."] },
  experience: { kind: "progressive-concept", family: "magic-arrangement-b9", title: "여러 번 더해지는 칸을 찾아요", learnerStage: L5.experience.learnerStage, learnerFit: L5.experience.learnerFit,
    finalStill: { standsAlone: true, visualSource: "original" },
    beats: [
      { id: "magic-arrangement-step-1", action: "reveal", caption: "가운데 칸은 가로줄에도 세로줄에도 들어가요. 두 번 더해지는 칸이에요.", visual: cross(1, range(3, 7)) },
      { id: "magic-arrangement-step-2", action: "highlight", caption: "다섯 수를 모두 더하고 가운데 수를 한 번 더 더하면 두 줄의 합을 합친 값이에요.", visual: NOTE(["3 + 4 + 5 + 6 + 7 = 25", "두 줄의 합을 합치면 25 + 가운데 수", "두 줄이 같으려면 둘로 똑같이 나뉘어야 해요"]) },
      { id: "magic-arrangement-step-3", action: "verify", caption: "그래서 가운데에는 3, 5, 7을 넣을 수 있어요. 삼각진에서는 세 꼭짓점이 두 번씩 더해져요.", visual: NOTE(["가운데 3 → 한 줄 14", "가운데 5 → 한 줄 15", "가운데 7 → 한 줄 16"]) }
    ], hint: "여러 번 더해지는 칸에 작은 수를 넣으면 한 줄의 합이 작아져요.",
    check: { prompt: "1부터 6까지의 수를 삼각진에 한 번씩 넣어 세 변의 합을 같게 합니다. 한 줄의 합이 가장 작을 때는 얼마일까요?", options: ["9", "10", "12"], answerRef: "/books/book-09/lessons/7/experience/check" } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: items.length, structureKey: "magic-arrangement-source", prompt: "여러 번 더해지는 칸을 찾아 물음에 답하시오.", items },
  extension: { title: "추가 학습", structureKey: "magic-arrangement-source", story: "십자 모양에 다섯 수를 넣습니다.", prompt: "4, 5, 6, 7, 8을 한 번씩 넣어 가로줄 세 수의 합과 세로줄 세 수의 합이 같게 하려고 합니다. 한 줄의 합이 가장 작을 때 그 합은 얼마입니까?",
    visual: cross(1, range(4, 8)), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-09/lessons/7/extension" }
};
book.lessons.splice(book.lessons.indexOf(L2) + 1, 0, L7);
book.lessonIntegration.newLessonIds = [...new Set([...(book.lessonIntegration.newLessonIds || []), L7.id])];

// ── 장부: 9쪽 보류 해제 ──
const all = book.lessons.flatMap((l) => l.original.items);
const pages = book.sourceCoverage.pages;
const P = (n) => pages.find((p) => p.page === n);
P(9).slots = [{ id: "GB9-S09-03", status: "released", itemIds: all.filter((it) => it.sourcePage === 9).map((it) => it.id) }];
book.sourceHold = book.sourceHold.filter((h) => !["S9-Q1", "S9-Q2"].includes(h.sourceNo));
const slots = pages.flatMap((p) => p.slots);
const released = slots.filter((s) => s.status === "released");
for (const s of released) for (const id of s.itemIds) if (!all.some((it) => it.id === id)) throw new Error(`ledger item ${id}`);
if (released.reduce((n, s) => n + s.itemIds.length, 0) !== all.length) throw new Error("ledger misses items");
Object.assign(book.sourceCoverage, { sourceSlots: slots.length, releasedSlots: released.length, heldSlots: slots.length - released.length,
  publicItems: all.length, publicAnswerUnits: all.reduce((n, it) => n + (it.parts?.length || 1), 0) });
if (book.sourceCoverage.heldSlots !== book.sourceHold.length) throw new Error("hold count");
book.source.note = `교사용 판서 11쪽(10~11쪽은 10권 내용)을 묶음별로 원본 대조합니다. 9권 내용인 1~9쪽(넓이·쌓기나무·마방진·원형진·삼각진)은 대조를 마쳤습니다. 공개 ${all.length}문항, 보류 ${book.sourceHold.length}건(10~11쪽, 10권 대조 때 옮김).`;

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
const { pages: _p, ...coverage } = book.sourceCoverage;
console.log("book09 batch5 patched", { L7: items.length, holds: book.sourceHold.length, coverage });
