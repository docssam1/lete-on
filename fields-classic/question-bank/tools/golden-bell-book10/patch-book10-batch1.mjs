// 골든벨 10권 묶음 1: 9권 판서 파일의 10~11쪽(제목 「<10권> 01. 연속수의 합」)을 10권으로 옮긴다.
// 10쪽 01 네이피어 곱셈 Q1~Q3 12문항 · 02 수의 개수 Q1 10문항 / 11쪽 03 연속수의 합(짝수 개) Q1·Q2 12문항 · 04 연속수의 합(홀수 개) Q1·Q2 12문항.
// 9권의 단원 consecutive-sum-pairing(11쪽 03 Q1 6문항)은 지우고 10권 새 단원에 그대로 넣는다. 9권 장부에서 10~11쪽과 보류 3건을 뺀다.
// 판서의 검정 글씨(식·범위)만 옮기고, 빨강·파랑 필기(답·나눈 수·부분곱·짝 표시·가운데 수 동그라미)는 옮기지 않는다.
// 이 스크립트에는 정답이 없다. node patch-book10-batch1.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const b9 = books.find((b) => b.id === "book-09"), b10 = books.find((b) => b.id === "book-10");
if (b10.lessons.some((l) => l.id === "napier-split-source")) throw new Error("already patched");
const old9 = b9.lessons.find((l) => l.id === "consecutive-sum-pairing");
if (!old9 || old9.original.items.length !== 6) throw new Error("book 9 consecutive lesson state");
const numberOf = (l) => Number(l.extension.answerRef.match(/lessons\/(\d+)\//)[1]);
const used = new Set(b10.lessons.map(numberOf));
for (const n of [7, 8, 9, 10]) if (used.has(n)) throw new Error(`book 10 lesson number ${n} taken`);
const base = b10.lessons[0].experience;

const op = (expression) => ({ kind: "book10", subtype: "operation", expression });
const box = (first, second, cols, rows) => ({ kind: "book10", subtype: "split-box", first, second, cols, rows });
const NOTE = (lines) => ({ kind: "book5", subtype: "source-note-box", lines });
const S = (text) => text.replace(/\+/g, " + ").replace(/…/g, " … ").replace(/\s+/g, " ").trim();
const make = (lessonNo, lessonId, prefix, page, k, n, spec) => {
  const answerRef = `/books/book-10/lessons/${lessonNo}/original/items/${k}`;
  const item = { id: `book10-src-s${page}-${prefix}-${n}`, unit: 1, sourcePage: page, sourceNo: `GB10-S${page}-${prefix}-${n}`,
    sourceLocator: `교사용 판서(9권 파일) ${page}쪽 · ${spec.loc}`, printGroup: spec.group, typeLabel: spec.type, prompt: spec.prompt, visual: spec.visual, answerRef };
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  if (spec.parts) item.parts = spec.parts.map((p, j) => ({ ...p, answerRef: `${answerRef}/parts/${j}` }));
  else Object.assign(item, { answerMode: "input", inputMode: "numeric" });
  return item;
};
const lesson = (no, id, title, locator, concept, story, explanation, experience, items, extension) => ({
  id, unit: 1, title, sourceLocator: locator, sourceTypeIds: [`book10-${id}`], representativeConcept: concept, story, explanation,
  experience: { kind: "progressive-concept", learnerStage: base.learnerStage, learnerFit: base.learnerFit, finalStill: { standsAlone: true, visualSource: "original" }, ...experience,
    check: { ...experience.check, answerRef: `/books/book-10/lessons/${no}/experience/check` } },
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: items.length, structureKey: id, prompt: items[0].prompt, items },
  extension: { title: "추가 학습", structureKey: id, answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", ...extension, answerRef: `/books/book-10/lessons/${no}/extension` }
});

// ── 10쪽 01 네이피어 곱셈 ──
const MUL = "곱하는 수를 몇십과 몇으로 나누어 칸마다 곱하고, 모두 더해 곱을 구하시오.";
const napierSpecs = [
  ...[[14, 3], [23, 7], [38, 9], [43, 8], [62, 9], [98, 6]].map(([a, b], k) => ({ loc: `01 네이피어 곱셈 Q1 (${k + 1})`, group: 701 + Math.floor(k / 2), type: "(두 자리 수) × (한 자리 수)", visual: box(a, b, 2, 1) })),
  ...[[47, 50], [59, 30], [74, 80]].map(([a, b], k) => ({ loc: `01 네이피어 곱셈 Q2 (${k + 1})`, group: 704, type: "(두 자리 수) × (몇십)", visual: box(a, b, 2, 1) })),
  ...[[21, 67, 2], [37, 89, 2], [87, 296, 3]].map(([a, b, rows], k) => ({ loc: `01 네이피어 곱셈 Q3 (${k + 1})`, group: 705 + (k === 2 ? 1 : 0), type: "곱하는 수도 나누어 곱하기", visual: box(a, b, 2, rows) }))
].map((s, k) => ({ ...s, prompt: MUL, ...(k === 0 ? { discrepancy: "판서의 칸 위·옆에 쓴 나눈 수와 칸 안의 부분곱은 필기라 옮기지 않았습니다. 빈 칸은 계산하는 자리이고, 곱만 답으로 받습니다." } : {}) }));
const napierItems = napierSpecs.map((s, k) => make(7, "napier-split-source", "01", 10, k, k + 1, s));

// ── 10쪽 02 수의 개수 ──
const ranges = [[10, 69], [10, 30], [21, 78], [50, 100], [47, 96], [62, 81], [18, 73], [100, 199], [300, 400], [100, 999]];
const countItems = ranges.map(([a, b], k) => make(8, "number-count-source", "02", 10, k, k + 1, {
  loc: `02 수의 개수 Q1 (${k + 1})`, group: 711 + Math.floor(k / 2), type: "범위 안의 수의 개수", prompt: `${a}부터 ${b}까지의 수는 모두 몇 개입니까?`, visual: op(`${a} ~ ${b}`) }));

// ── 11쪽 03 연속수의 합(짝수 개) ──
const EVEN = "다음 연속수의 합을 구하시오.";
const evenQ1 = ["1+2+3+4+5+6", "1+2+3+4+5+6+7+8+9+10", "1+2+3+…+12+13+14", "1+2+3+…+18+19+20", "1+2+3+…+60", "1+2+3+…+80"];
const evenQ2 = ["2+3+4+5+6+7", "6+7+8+9+10+11+12+13", "7+8+9+…+12+13+14", "10+11+12+…+17+18+19", "5+6+7+…+16", "17+18+19+…+38"];
const evenItems = [...evenQ1.map((e, k) => ({ q: 1, k, e })), ...evenQ2.map((e, k) => ({ q: 2, k, e }))].map(({ q, k, e }, i) => make(9, "consecutive-even-source", "03", 11, i, i + 1, {
  loc: `03 연속수의 합(짝수 개) Q${q} (${k + 1})`, group: 721 + Math.floor(i / 2), type: q === 1 ? "1부터 시작하는 연속수의 합" : "중간부터 시작하는 연속수의 합", prompt: EVEN, visual: op(S(e)),
  ...(i === 0 ? { discrepancy: "판서는 「식」으로 짝의 합 × 짝의 개수를 쓰게 합니다. 화면에서는 합만 답으로 받고, 풀이에서 식을 보여 줍니다. 이 묶음의 첫 6문항은 예전 9권 단원 「연속수의 합」에 있던 문항을 10권으로 옮긴 것입니다." } : {}) }));

// ── 11쪽 04 연속수의 합(홀수 개) ──
const ODD1 = "다음 연속수에서 가운데 수를 찾고, 합을 구하시오.";
const ODD2 = "다음 연속수의 합을 구하시오.";
const oddQ1 = ["1+2+3", "1+2+3+4+5+6+7+8+9", "1+2+3+…+11+12+13", "1+2+…+16+17", "1+2+…+38+39", "1+2+…+58+59"];
const oddQ2 = ["19+20+21", "38+39+40+41+42", "6+7+…+13+14", "27+28+…+32+33", "2+3+…+15+16", "45+46+…+54+55"];
const oddItems = [...oddQ1.map((e, k) => ({ q: 1, k, e })), ...oddQ2.map((e, k) => ({ q: 2, k, e }))].map(({ q, k, e }, i) => make(10, "consecutive-odd-source", "04", 11, i, i + 1, {
  loc: `04 연속수의 합(홀수 개) Q${q} (${k + 1})`, group: 731 + Math.floor(i / 2), type: q === 1 ? "가운데 수 찾기" : "가운데 수로 합 구하기", prompt: q === 1 ? ODD1 : ODD2, visual: op(S(e)),
  ...(q === 1 ? { parts: [{ id: "middle", label: "가운데 수" }, { id: "sum", label: "합" }] } : {}),
  ...(i === 0 ? { discrepancy: "판서는 가운데 수에 동그라미를 치고 왕관을 그려 찾게 합니다. 화면에서는 식에서 가운데 수를 빼고(…로 줄임) 가운데 수와 합을 따로 받습니다." } : {}) }));

const L7 = lesson(7, "napier-split-source", "곱셈을 칸으로 나누어 계산해요", "교사용 판서(9권 파일) 10쪽 · 01 네이피어 곱셈 Q1~Q3",
  "곱하는 수를 몇십과 몇으로 나누어 칸마다 곱한 뒤 모두 더함",
  { title: "칸으로 나누는 곱셈", text: "큰 수를 몇십과 몇으로 나누면 쉬운 곱셈 두 개가 돼요.", mission: "칸마다 곱하고 모두 더해 보세요." },
  { headline: "몇십과 몇으로 나누어 칸마다 곱하고 더합니다.", steps: ["두 자리 수를 몇십과 몇으로 나눕니다.", "칸마다 곱을 씁니다.", "칸의 곱을 모두 더하면 처음 곱셈의 답입니다.", "곱하는 수도 두 자리 이상이면 줄을 나누어 칸을 더 만듭니다."] },
  { family: "napier-split-b10", title: "나누어 곱하고 더해요", hint: "몇십 × 몇, 몇 × 몇을 따로 계산해요.",
    beats: [
      { id: "napier-split-step-1", action: "reveal", caption: "26 × 4는 26을 20과 6으로 나누어 두 칸으로 계산해요.", visual: box(26, 4, 2, 1) },
      { id: "napier-split-step-2", action: "highlight", caption: "칸마다 곱해요. 20 × 4와 6 × 4예요.", visual: NOTE(["20 × 4 = 80", "6 × 4 = 24"]) },
      { id: "napier-split-step-3", action: "verify", caption: "두 칸의 곱을 더하면 26 × 4의 답이에요.", visual: NOTE(["80 + 24 = 104", "26 × 4 = 104"]) }
    ],
    check: { prompt: "35 × 6을 30 × 6과 5 × 6으로 나누어 계산하면 얼마일까요?", options: ["210", "185", "240"] } },
  napierItems, { story: "곱셈을 칸으로 나누어 계산합니다.", prompt: MUL, visual: box(52, 7, 2, 1) });

const L8 = lesson(8, "number-count-source", "수의 개수를 세어요", "교사용 판서(9권 파일) 10쪽 · 02 수의 개수 Q1",
  "어떤 범위의 수의 개수는 (끝 수 - 처음 수 + 1)로 셈",
  { title: "수의 개수", text: "5부터 15까지의 수는 몇 개일까요? 15 - 5만 하면 하나가 모자라요.", mission: "처음 수도 세었는지 확인해 보세요." },
  { headline: "끝 수에서 처음 수를 빼고 1을 더합니다.", steps: ["1부터 끝 수까지의 개수는 끝 수와 같습니다.", "처음 수 바로 앞까지의 수를 뺍니다: 끝 수 - (처음 수 - 1).", "그래서 개수는 끝 수 - 처음 수 + 1입니다.", "처음 수를 빼먹지 않았는지 작은 예로 확인합니다."] },
  { family: "number-count-b10", title: "처음 수도 세어요", hint: "끝 수 - 처음 수 + 1",
    beats: [
      { id: "number-count-step-1", action: "reveal", caption: "1부터 15까지는 15개, 1부터 4까지는 4개예요.", visual: NOTE(["1 ~ 15 → 15개", "1 ~ 4 → 4개"]) },
      { id: "number-count-step-2", action: "highlight", caption: "5부터 15까지는 15개에서 4개를 빼요.", visual: NOTE(["15 - 4 = 11"]) },
      { id: "number-count-step-3", action: "verify", caption: "끝 수 - 처음 수에 1을 더해도 같아요. 처음 수 5도 세어야 하니까요.", visual: NOTE(["15 - 5 + 1 = 11"]) }
    ],
    check: { prompt: "20부터 45까지의 수는 모두 몇 개일까요?", options: ["26", "25", "24"] } },
  countItems, { story: "범위 안의 수를 셉니다.", prompt: "24부터 90까지의 수는 모두 몇 개입니까?", visual: op("24 ~ 90") });

const L9 = lesson(9, "consecutive-even-source", "짝수 개 연속수의 합", "교사용 판서(9권 파일) 11쪽 · 03 연속수의 합(짝수 개) Q1·Q2",
  "양끝 수를 짝지으면 짝의 합이 모두 같으므로 (처음 수 + 끝 수) × (수의 개수 ÷ 2)로 합을 구함",
  { title: "가우스의 덧셈", text: "1부터 100까지 더할 때 1 + 100, 2 + 99처럼 짝을 지으면 모두 101이에요.", mission: "양끝 수를 짝지어 보세요." },
  { headline: "(처음 수 + 끝 수) × 짝의 개수", steps: ["처음 수와 끝 수를 짝지어 더합니다.", "안쪽으로 한 칸씩 들어가며 짝을 지어도 합이 같습니다.", "수의 개수는 끝 수 - 처음 수 + 1이고, 짝의 개수는 그 반입니다.", "짝의 합 × 짝의 개수가 전체 합입니다."] },
  { family: "consecutive-even-b10", title: "양끝 수를 짝지어요", hint: "짝의 합 × 짝의 개수",
    beats: [
      { id: "consecutive-even-step-1", action: "reveal", caption: "1부터 100까지 더할 때 양끝 수를 짝지어요.", visual: op("1 + 2 + 3 + … + 98 + 99 + 100") },
      { id: "consecutive-even-step-2", action: "highlight", caption: "1 + 100, 2 + 99, 3 + 98 … 짝의 합이 모두 101이에요.", visual: NOTE(["1 + 100 = 101", "2 + 99 = 101", "3 + 98 = 101"]) },
      { id: "consecutive-even-step-3", action: "verify", caption: "수가 100개라 짝은 50개예요. 101 × 50이 전체 합이에요.", visual: NOTE(["101 × 50 = 5050"]) }
    ],
    check: { prompt: "1부터 8까지의 합은 얼마일까요?", options: ["36", "32", "40"] } },
  evenItems, { story: "양끝 수를 짝지어 더합니다.", prompt: EVEN, visual: op("3 + 4 + 5 + … + 10 + 11 + 12") });

const L10 = lesson(10, "consecutive-odd-source", "홀수 개 연속수의 합", "교사용 판서(9권 파일) 11쪽 · 04 연속수의 합(홀수 개) Q1·Q2",
  "홀수 개 연속수는 가운데 수가 하나 남고, 합은 가운데 수 × 수의 개수",
  { title: "가운데 수", text: "1 + 2 + 3 + 4 + 5에서 짝을 지으면 3이 혼자 남아요.", mission: "가운데 수를 찾아 보세요." },
  { headline: "가운데 수 × 수의 개수", steps: ["양끝 수를 짝지으면 가운데 수 하나가 남습니다.", "짝의 합은 가운데 수의 2배라, 모든 수를 가운데 수로 바꾼 것과 같습니다.", "가운데 수는 (처음 수 + 끝 수) ÷ 2입니다.", "합은 가운데 수 × 수의 개수입니다."] },
  { family: "consecutive-odd-b10", title: "가운데 수를 찾아요", hint: "가운데 수 × 수의 개수",
    beats: [
      { id: "consecutive-odd-step-1", action: "reveal", caption: "1 + 2 + 3 + 4 + 5에서 짝을 지으면 3이 혼자 남아요.", visual: op("1 + 2 + 3 + 4 + 5") },
      { id: "consecutive-odd-step-2", action: "highlight", caption: "1 + 5와 2 + 4는 모두 6이에요. 3의 2배예요.", visual: NOTE(["1 + 5 = 6 = 3 × 2", "2 + 4 = 6 = 3 × 2"]) },
      { id: "consecutive-odd-step-3", action: "verify", caption: "다섯 수가 모두 3인 것과 같아요. 3 × 5가 합이에요.", visual: NOTE(["3 × 5 = 15"]) }
    ],
    check: { prompt: "4 + 5 + 6 + 7 + 8의 합은 얼마일까요?", options: ["30", "25", "35"] } },
  oddItems, { story: "가운데 수로 합을 구합니다.", prompt: ODD2, visual: op("12 + 13 + … + 19 + 20") });

const at = (id) => b10.lessons.findIndex((l) => l.id === id);
b10.lessons.splice(at("napier-multiplication") + 1, 0, L7, L8);
b10.lessons.splice(at("even-consecutive-sum") + 1, 0, L9);
b10.lessons.splice(at("consecutive-page-range") + 1, 0, L10);
const gbItems = [L7, L8, L9, L10].flatMap((l) => l.original.items);
b10.sourceCoverage.goldenBell = { file: "9권 교사용 판서 10~11쪽(제목 「<10권> 01. 연속수의 합」)", pages: [10, 11], lessons: [L7.id, L8.id, L9.id, L10.id], publicItems: gbItems.length,
  publicAnswerUnits: gbItems.reduce((n, it) => n + (it.parts?.length || 1), 0), hold: 0 };
b10.source.goldenBellNote = `골든벨 판서는 9권 판서 파일의 10~11쪽에 있습니다(${gbItems.length}문항, 원본 대조 완료).`;

// ── 9권에서 10~11쪽과 옮긴 단원을 뺀다 ──
b9.lessons = b9.lessons.filter((l) => l.id !== "consecutive-sum-pairing");
b9.lessonIntegration.existingLessonIds = b9.lessonIntegration.existingLessonIds.filter((id) => id !== "consecutive-sum-pairing");
b9.sourceCoverage.pages = b9.sourceCoverage.pages.filter((p) => p.page <= 9);
b9.sourceHold = b9.sourceHold.filter((h) => !["S10-Q1", "S10-Q2", "S11-Q2"].includes(h.sourceNo));
const all9 = b9.lessons.flatMap((l) => l.original.items);
const slots = b9.sourceCoverage.pages.flatMap((p) => p.slots), released = slots.filter((s) => s.status === "released");
for (const s of released) for (const id of s.itemIds) if (!all9.some((it) => it.id === id)) throw new Error(`ledger item ${id}`);
if (released.reduce((n, s) => n + s.itemIds.length, 0) !== all9.length) throw new Error("ledger misses items");
Object.assign(b9.sourceCoverage, { sourceSlots: slots.length, releasedSlots: released.length, heldSlots: slots.length - released.length,
  publicItems: all9.length, publicAnswerUnits: all9.reduce((n, it) => n + (it.parts?.length || 1), 0) });
if (b9.sourceCoverage.heldSlots !== b9.sourceHold.length || b9.sourceHold.length) throw new Error("book 9 holds");
b9.source.note = `교사용 판서 11쪽 중 9권 내용인 1~9쪽(넓이·쌓기나무·마방진·원형진·삼각진)을 원본 대조했습니다. 공개 ${all9.length}문항, 보류 없음. 10~11쪽은 10권 내용이라 10권으로 옮겼습니다.`;

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
const { pages: _p, ...coverage9 } = b9.sourceCoverage;
console.log("book10 batch1 patched", { napier: napierItems.length, count: countItems.length, even: evenItems.length, odd: oddItems.length, b10Lessons: b10.lessons.map((l) => l.id), coverage9 });
