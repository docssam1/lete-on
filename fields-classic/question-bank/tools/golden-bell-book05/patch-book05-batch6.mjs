// 골든벨 5권 묶음 6: 교사용 슬라이드 41~49 「선분 나누기·도형이 나타내는 수·크기가 같은 분수」 49문항.
// 이 스크립트에는 정답이 없다. node patch-book05-batch6.mjs <golden-bell-data.js 경로>
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-05");
if (book.lessons.some((l) => l.id === "segment-division-source")) throw new Error("already patched");
const L0 = book.lessons.find((l) => l.id === "path-number-grid");

const withParts = (item, labels) => ({ ...item, parts: labels.map((label, k) => ({ id: String.fromCharCode(97 + k), label, answerRef: `${item.answerRef}/parts/${k}` })) });
const build = (lessonNo, lessonId, specs) => specs.map((spec, k) => {
  let item = { id: `book05-full-${spec.no.slice(4).toLowerCase()}`, sourceNo: spec.no, lessonId, typeLabel: spec.type, sourceLocator: spec.loc, printGroup: spec.group,
    answerMode: "input", inputMode: "numeric", prompt: spec.prompt, visual: spec.visual, answerRef: `/books/book-05/lessons/${lessonNo}/original/items/${k}` };
  if (spec.set) item = { ...item, inputMode: "text", resultContract: { type: "set" } };
  if (spec.discrepancy) item.sourceDiscrepancy = spec.discrepancy;
  if (spec.parts) { item = withParts(item, spec.parts); delete item.answerMode; delete item.inputMode; }
  return item;
});
const experience = (lessonNo, family, title, beats, hint, check) => ({
  ...JSON.parse(JSON.stringify(L0.experience)), family, title, beats, hint, check: { ...check, answerRef: `/books/book-05/lessons/${lessonNo}/experience/check` }
});
const lessonNo0 = book.lessons.length;

// ── 단원 11: 선분 나누기 (41쪽) ──
const seg = (v) => ({ kind: "book5", subtype: "source-segment", ...v });
const S1 = "같은 간격으로 자를 때 한 조각의 길이는?";
const S2 = "수직선 위 두 점 사이의 거리를 똑같은 간격으로 나눌 때, 가운데 점(중점)의 수를 구하시오.";
const L11No = lessonNo0, L12No = lessonNo0 + 1, L13No = lessonNo0 + 2;
const L11Specs = [
  ...[[2, 10], [3, 21], [4, 32]].map(([pieces, total], k) => ({ no: `GB5-S41-01-${k + 1}`, loc: `교사용 슬라이드 41 연산골든벨 01 그림 ${k + 1}`, group: 1, type: "같은 간격으로 자르기", prompt: `${S1} (그림 ${k + 1})`, visual: seg({ pieces, total }) })),
  ...[[2, 16, 7], [12, 34, 11]].map(([start, end, half], k) => ({ no: `GB5-S41-02-${k + 1}`, loc: `교사용 슬라이드 41 연산골든벨 02 그림 ${k + 1}`, group: 2, type: "가운데 점 찾기", prompt: `${S2} (그림 ${k + 1})`, visual: seg({ start, end, half }) }))
];
const L11 = {
  id: "segment-division-source", unit: "선분 나누기", title: "선분을 똑같이 나누기", sourceLocator: "교사용 슬라이드 41 연산골든벨 01·02",
  sourceTypeIds: ["segment-division-source"], representativeConcept: "전체 길이를 조각 수만큼 똑같이 나누고, 두 점 사이 거리의 절반만큼 앞의 점에서 가면 가운데 점",
  story: { title: "끈을 똑같이 자르기", text: "끈을 똑같은 길이로 자르면 조각마다 길이가 같습니다.", mission: "전체 길이와 조각 수로 한 조각의 길이를 찾아보세요." },
  explanation: { headline: "똑같이 자른 조각은 길이가 모두 같고, 가운데 점은 두 점에서 거리가 같습니다.",
    steps: ["조각이 몇 개인지 셉니다.", "같은 수를 조각 수만큼 더해 전체 길이가 되는 수를 찾습니다.", "두 점 사이 거리는 큰 수에서 작은 수를 뺍니다.", "거리의 절반만큼 앞의 점에서 가면 가운데 점입니다."] },
  experience: experience(L11No, "segment-division", "똑같이 나누어요", [
    { id: "segment-division-step-1", action: "reveal", caption: "길이 15를 같은 간격으로 3조각으로 자르면 5+5+5=15이므로 한 조각은 5입니다.", visual: seg({ pieces: 3, total: 15 }) },
    { id: "segment-division-step-2", action: "highlight", caption: "4와 10 사이의 거리는 10-4=6이고, 그 절반은 3입니다.", visual: seg({ start: 4, end: 10, half: 3 }) },
    { id: "segment-division-step-3", action: "verify", caption: "4에서 3만큼 가면 7이고, 7에서 10까지도 3이므로 가운데 점은 7입니다.", visual: seg({ start: 4, end: 10, half: 3, value: 7 }) }
  ], "같은 간격이면 조각마다 길이가 같습니다.", { prompt: "길이 12를 같은 간격으로 4조각으로 자르면 한 조각의 길이는 얼마일까요?", options: ["4", "3", "2"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L11Specs.length, structureKey: "segment-division-source", prompt: S1, visual: seg({ pieces: 3, total: 21 }), items: build(L11No, "segment-division-source", L11Specs) },
  extension: { title: "추가 학습", structureKey: "segment-division-source", story: "수직선 위 두 점 사이를 똑같이 나눕니다.", prompt: "5와 19 사이를 똑같이 나눈 가운데 점의 수를 쓰세요.",
    visual: seg({ start: 5, end: 19 }), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-05/lessons/${L11No}/extension` }
};

// ── 단원 12: 도형이 나타내는 수 (42~48쪽) ──
const sh = (v) => ({ kind: "book5", subtype: "source-shape-equations", ...v });
const T = (text) => text.split(" ").map((w) => ({ "○": "circle", "☆": "star", "△": "triangle", "□": "square", "◇": "diamond", "♡": "heart", "⬠": "pentagon" }[w] || w));
const P01 = "같은 모양은 같은 수를 나타냅니다. ○, ☆가 나타내는 수는? (단, ○ > ☆)";
const P02 = "○, △는 한 자리 수입니다. 같은 모양은 같은 수입니다.";
const P03 = "다음 식에서 각 도형은 주어진 숫자 카드의 수를 나타냅니다. 같은 모양끼리만 같은 수일 때, 물음에 답하시오.";
const P04 = "다음 식에서 각 도형은 0부터 9까지 서로 다른 수를 나타냅니다. 물음에 답하시오.";
const PX = "다음 식에서 각 도형은 괄호 안 범위의 서로 다른 수를 나타냅니다. 물음에 답하시오.";
const NAME = { circle: "○", triangle: "△", square: "□", diamond: "◇", star: "☆", heart: "♡", pentagon: "⬠" };
const askText = (ask) => (Array.isArray(ask) ? "마지막 식의 값은?" : `${NAME[ask]}에 알맞은 수는?`);
const card03 = [
  [[1, 2, 3, 4], ["□ × □ = △", "○ + □ = ◇"], "diamond", 45, 1],
  [[2, 3, 6, 9], ["○ × ○ = △", "○ × ◇ = □"], "square", 45, 2],
  [[2, 3, 4, 5, 6], ["△ + ○ = □", "△ × △ = ○", "◇ - ♡ = △"], "heart", 45, 3],
  [[0, 2, 4, 5, 8], ["△ + △ = □", "△ × □ = ○", "◇ + ♡ = ◇"], "diamond", 45, 4],
  [[2, 3, 4, 8, 9], ["○ × ○ = △", "□ × □ = ◇", "□ × ♡ = ◇ × ◇"], "square", 45, 5],
  [[0, 2, 3, 4, 9], ["□ × □ = △", "♡ + □ = △ - ○", "♡ × ♡ = ○", "◇ × ○ = ◇"], "square", 45, 6],
  [[2, 3, 4, 5, 6, 9], ["○ × ○ = △", "○ × □ = ◇ × △", "◇ + ◇ = □", "♡ - ⬠ = △"], ["square", "+", "pentagon"], 46, 7],
  [[2, 3, 5, 6, 8, 9], ["○ × ◇ = ♡ × □", "○ × ○ × ○ = △", "◇ - □ = ♡", "⬠ × ○ = ○ + △"], ["pentagon", "×", "diamond"], 46, 8]
];
const four04 = [
  [["○ + ○ = ☆", "○ × ○ = ☆", "△ × △ = □"], ["square"]],
  [["○ + □ = ○", "△ × ☆ = △", "☆ + ☆ = ○", "○ × ○ = △"], ["triangle"]],
  [["○ + ○ = ☆", "○ × ○ = ☆", "○ × ☆ = □"], ["square"]],
  [["○ × ○ = △", "△ + △ = ☆", "○ × ☆ = △ × △"], ["circle", "triangle", "star"]]
];
const extra = [
  ["0~5", ["♡ + ☆ = ♡", "◇ × □ = □", "□ × □ = ♡", "○ + □ = △"], "triangle"],
  ["0~4", ["□ + ☆ = □", "□ × ◇ = □", "□ × □ = △", "◇ + ○ = △"], "circle"],
  ["1~6", ["☆ × ☆ = ♡", "□ + □ = △", "□ × ☆ = △", "△ - ○ = ◇"], "diamond"],
  ["1~9", ["○ × ○ × ○ = △", "☆ × ☆ = □", "○ × △ = ♡ × ♡"], "heart"],
  ["1~9", ["△ × △ = ☆", "○ × ○ = □", "□ × □ = ○ × ◇", "□ × ♡ = △ × ◇"], "heart"],
  ["2~9", ["△ × ◇ = □", "△ + ○ = □", "△ × □ = ◇ × ○", "◇ + □ = ♡"], "heart"]
];
const L12Specs = [
  ...[[6, 5], [12, 7], [15, 8], [24, 10], [63, 16], [56, 15], [42, 13], [72, 17]].map(([p, s], k) => ({ no: `GB5-S42-01-${k + 1}`, loc: `교사용 슬라이드 42 활동 02-01 (${k + 1})`, group: 1, type: "곱과 합으로 두 수 찾기",
    prompt: `${P01} (${k + 1})`, visual: sh({ rows: [T(`○ × ☆ = ${p}`), T(`○ + ☆ = ${s}`)], ask: ["circle", "star"] }), parts: ["○", "☆"],
    discrepancy: k === 4 ? "원본 (5)의 곱 「68」은 두 식을 함께 만족하는 수가 없어 교사용 답안과 대조해 「63」으로 바로잡았습니다." : undefined })),
  ...[[6, 1], [20, 1], [24, 2], [15, 2], [28, 3], [48, 2], [36, 5], [63, 2]].map(([p, d], k) => ({ no: `GB5-S43-01-${k + 9}`, loc: `교사용 슬라이드 43 활동 02-01 (${k + 9})`, group: 1, type: "곱과 차로 두 수 찾기",
    prompt: `${P01} (${k + 9})`, visual: sh({ rows: [T(`○ × ☆ = ${p}`), T(`○ - ☆ = ${d}`)], ask: ["circle", "star"] }), parts: ["○", "☆"] })),
  { no: "GB5-S44-02-1", loc: "교사용 슬라이드 44 활동 02-02 (1)", group: 2, type: "0과 1의 성질", prompt: `${P02} (1) △에 알맞은 수는?`, visual: sh({ rows: [T("○ + △ = ○")], ask: ["triangle"] }) },
  { no: "GB5-S44-02-2", loc: "교사용 슬라이드 44 활동 02-02 (2)", group: 2, type: "0과 1의 성질", prompt: `${P02} (2) △에 알맞은 수는? (단, ○는 0이 아닙니다)`, visual: sh({ rows: [T("○ × △ = ○")], ask: ["triangle"] }),
    discrepancy: "○가 0이면 △에 어떤 수든 들어가 「○는 0이 아닙니다」 조건을 붙였습니다." },
  { no: "GB5-S44-02-3", loc: "교사용 슬라이드 44 활동 02-02 (3)", group: 2, type: "한 자리 수가 되는 경우", prompt: `${P02} (3) ○에 들어갈 수 있는 수를 모두 쓰시오. (단, ○는 0이 아닙니다)`, visual: sh({ rows: [T("○ × ○ = 한_자리_수")] }), set: true,
    discrepancy: "0을 넣는지에 따라 답이 달라져 「○는 0이 아닙니다」 조건을 붙였습니다(교사용 답안의 나열과 같음)." },
  { no: "GB5-S44-02-4", loc: "교사용 슬라이드 44 활동 02-02 (4)", group: 2, type: "한 자리 수가 되는 경우", prompt: `${P02} (4) ○에 들어갈 수 있는 수를 모두 쓰시오. (단, ○는 0이 아닙니다)`, visual: sh({ rows: [T("○ + ○ + ○ = 한_자리_수")] }), set: true },
  { no: "GB5-S44-02-5", loc: "교사용 슬라이드 44 활동 02-02 (6)", group: 2, type: "한 자리 수가 되는 경우", prompt: `${P02} (5) ○에 들어갈 수 있는 수를 모두 쓰시오. (단, ○는 0이 아닙니다)`, visual: sh({ rows: [T("○ × ○ × ○ = 한_자리_수")] }), set: true,
    discrepancy: "원본은 (4) 다음 번호가 (6)이라 (5)로 바로잡았습니다." },
  ...card03.map(([cards, rows, ask, slide, n]) => ({ no: `GB5-S${slide}-03-${n}`, loc: `교사용 슬라이드 ${slide} 활동 02-03 (${slide === 46 ? n - 2 : n})`, group: 3, type: "숫자 카드 도형식",
    prompt: `${P03} (${n}) ${askText(ask)}`, visual: sh({ cards, rows: rows.map(T), ask: [ask] }),
    discrepancy: slide === 46 ? `원본은 45쪽과 같은 번호 (${n - 2})를 다시 써서 (${n})로 바로잡았습니다.` : undefined })),
  ...four04.map(([rows, ask], k) => ({ no: `GB5-S47-04-${k + 1}`, loc: `교사용 슬라이드 47 활동 02-04 (${k + 1})`, group: 4, type: "서로 다른 수 도형식",
    prompt: `${P04} (${k + 1}) ${ask.length > 1 ? `${ask.map((t) => NAME[t]).join(", ")}에 알맞은 수는?` : askText(ask[0])}`, visual: sh({ rows: rows.map(T), ask }), ...(ask.length > 1 ? { parts: ask.map((t) => NAME[t]) } : {}) })),
  ...extra.map(([range, rows, ask], k) => ({ no: `GB5-S48-05-${k + 1}`, loc: `교사용 슬라이드 48 활동 02-03·04 추가문제 (${k + 1})`, group: 5, type: "범위가 있는 도형식",
    prompt: `${PX} (${k + 1}) ${askText(ask)}${k === 2 ? " (단, ○ < ◇)" : ""}`, visual: sh({ range, rows: rows.map(T), ask: [ask] }),
    discrepancy: k === 2 ? "원본 식만으로는 ○와 ◇에 들어갈 두 수가 서로 바뀌어도 모든 식이 맞아 답이 하나로 정해지지 않습니다. 「○ < ◇」 조건을 붙여 교사용 답안과 같게 했습니다." : undefined }))
].map((spec) => ({ ...spec, visual: { ...spec.visual, rows: spec.visual.rows.map((row) => row.map((t) => t.replaceAll("_", " "))) } }));
const L12 = {
  id: "shape-value-source", unit: "도형이 나타내는 수", title: "도형이 나타내는 수 찾기", sourceLocator: "교사용 슬라이드 42~48 활동 02",
  sourceTypeIds: ["shape-value-source"], representativeConcept: "같은 모양은 같은 수라는 약속으로, 곱셈처럼 경우가 적은 식부터 따져 도형의 수를 차례로 정함",
  story: { title: "모양 속에 숨은 수", text: "같은 모양에는 같은 수가 숨어 있습니다.", mission: "경우가 가장 적은 식부터 따져 모양의 수를 찾아보세요." },
  explanation: { headline: "같은 모양은 같은 수입니다. 경우가 적은 식부터 따지고, 찾은 수를 다른 식에 넣어 확인합니다.",
    steps: ["같은 모양끼리 곱한 식처럼 경우가 적은 식을 먼저 봅니다.", "주어진 카드나 범위 안에서 될 수 있는 수를 모두 적어 봅니다.", "다른 식에 넣어 맞지 않는 경우를 지웁니다.", "남은 수로 모든 식이 맞는지 확인합니다."] },
  experience: experience(L12No, "shape-value", "모양 속 수를 찾아요", [
    { id: "shape-value-step-1", action: "reveal", caption: "○ × ☆ = 10이 되는 짝은 1과 10, 2와 5입니다.", visual: sh({ rows: [T("○ × ☆ = 10"), T("○ + ☆ = 7")], ask: ["circle", "star"] }) },
    { id: "shape-value-step-2", action: "highlight", caption: "두 짝 가운데 더해서 7이 되는 것은 2와 5뿐입니다. ○가 더 크니까 ○는 5, ☆는 2입니다.", visual: sh({ rows: [T("○ × ☆ = 10"), T("○ + ☆ = 7")], ask: ["circle", "star"] }) },
    { id: "shape-value-step-3", action: "verify", caption: "5 × 2 = 10, 5 + 2 = 7로 두 식이 모두 맞습니다.", visual: sh({ rows: [T("○ × ☆ = 10"), T("○ + ☆ = 7")], values: { circle: 5, star: 2 } }) }
  ], "곱셈식은 될 수 있는 짝이 적어서 먼저 따지기 좋습니다.", { prompt: "○ × ☆ = 8, ○ + ☆ = 6이고 ○가 ☆보다 클 때 ○는 얼마일까요?", options: ["6", "4", "2"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L12Specs.length, structureKey: "shape-value-source", prompt: P03, visual: sh({ rows: [T("○ × ☆ = 10"), T("○ + ☆ = 7")] }), items: build(L12No, "shape-value-source", L12Specs) },
  extension: { title: "추가 학습", structureKey: "shape-value-source", story: "각 도형은 숫자 카드의 수를 나타내고, 같은 모양끼리만 같은 수입니다.", prompt: "◇에 알맞은 수를 쓰세요.",
    visual: sh({ cards: [1, 3, 4, 9], rows: [T("○ × ○ = △"), T("□ + ○ = ◇")], ask: ["diamond"] }), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-05/lessons/${L12No}/extension` }
};

// ── 단원 13: 크기가 같은 분수 (49쪽) ──
const discs = (list) => ({ kind: "book5", subtype: "source-fraction-discs", discs: list.map(([pieces, shaded]) => ({ pieces, shaded })) });
const chain = (fractions) => ({ kind: "book5", subtype: "source-fraction-chain", fractions });
const blanksOf = (fractions) => fractions.flat().filter((v) => v == null).map((_, k) => ["가", "나", "다", "라", "마", "바", "사", "아"][k]);
const D1 = "다음 그림은 원판을 같은 크기의 조각으로 나눈 것입니다. 원판에서 색칠된 부분의 크기가 모두 같을 때, 색칠된 부분의 크기를 분수로 나타내시오.";
const C1 = "크기가 같은 분수를 만드시오. 빈칸에 알맞은 수를 쓰시오.";
const chains = [
  [[2, 3], [null, 6], [null, 9], [null, 12], [null, 24]],
  [[3, 5], [null, 10], [9, null], [27, null], [null, 50]],
  [[56, 63], [null, 9], [null, 18], [24, null]],
  [[18, 30], [6, null], [null, 5], [null, 15]]
];
const L13Specs = [
  { no: "GB5-S49-01-1", loc: "교사용 슬라이드 49 연산골든벨 원판", group: 1, type: "원판의 색칠된 부분", prompt: `${D1} (가부터 아까지 위의 수, 아래의 수 순서)`,
    visual: discs([[3, 2], [6, 4], [9, 6], [12, 8]]), parts: ["가", "나", "다", "라", "마", "바", "사", "아"] },
  ...chains.map((fr, k) => ({ no: `GB5-S49-02-${k + 1}`, loc: `교사용 슬라이드 49 크기가 같은 분수 만들기 ${k + 1}`, group: 2, type: "크기가 같은 분수 만들기", prompt: `${C1} (${k + 1})`, visual: chain(fr), parts: blanksOf(fr) }))
];
const L13 = {
  id: "equivalent-fraction-source", unit: "크기가 같은 분수", title: "크기가 같은 분수 만들기", sourceLocator: "교사용 슬라이드 49 연산골든벨",
  sourceTypeIds: ["equivalent-fraction-source"], representativeConcept: "같은 원판을 더 잘게 나누어도 색칠한 크기는 같고, 위의 수와 아래의 수에 같은 수를 곱하거나 같은 수로 나누면 크기가 같은 분수",
  story: { title: "피자를 더 잘게 자르기", text: "피자를 더 잘게 잘라도 내가 먹은 양은 그대로입니다.", mission: "조각 수가 달라도 크기가 같은 분수를 찾아보세요." },
  explanation: { headline: "위의 수와 아래의 수에 같은 수를 곱하거나 같은 수로 나누면 크기가 같은 분수가 됩니다.",
    steps: ["원판이 몇 조각인지(아래의 수)와 색칠한 조각 수(위의 수)를 셉니다.", "아래의 수가 몇 배가 되었는지 봅니다.", "위의 수도 같은 배로 바꿉니다.", "작아지는 쪽은 같은 수로 나눕니다."] },
  experience: experience(L13No, "equivalent-fraction", "크기가 같은 분수를 찾아요", [
    { id: "equivalent-fraction-step-1", action: "reveal", caption: "2조각 중 1조각과 4조각 중 2조각은 색칠한 크기가 같습니다.", visual: { ...discs([[2, 1], [4, 2]]), fractions: false } },
    { id: "equivalent-fraction-step-2", action: "highlight", caption: "아래의 수가 2배가 되면 위의 수도 2배가 됩니다.", visual: chain([[1, 2], [2, 4], [3, 6]]) },
    { id: "equivalent-fraction-step-3", action: "verify", caption: "아래의 수 2를 4배 하면 8이므로 위의 수 1도 4배 해서 4입니다.", visual: chain([[1, 2], [4, 8]]) }
  ], "아래의 수에 곱한 수를 위의 수에도 곱합니다.", { prompt: "4조각 중 1조각과 크기가 같은 것은 8조각 중 몇 조각일까요?", options: ["2", "4", "1"] }),
  original: { title: "골든벨", mode: "paged", sourceQuestionCount: L13Specs.length, structureKey: "equivalent-fraction-source", prompt: C1, visual: chain([[1, 2], [2, 4]]), items: build(L13No, "equivalent-fraction-source", L13Specs) },
  extension: { title: "추가 학습", structureKey: "equivalent-fraction-source", story: "위의 수와 아래의 수에 같은 수를 곱합니다.", prompt: "가에 알맞은 수를 쓰세요.",
    visual: chain([[2, 5], [null, 10]]), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: `/books/book-05/lessons/${L13No}/extension` }
};
book.lessons.push(L11, L12, L13);

const cleared = new Set(["S41", "S42", "S43", "S44", "S45", "S46", "S47", "S48", "S49"].map((s) => `GB5-${s}-H01`));
const before = book.sourceHold.length;
book.sourceHold = book.sourceHold.filter((hold) => !cleared.has(hold.sourceNo));
if (before - book.sourceHold.length !== 9) throw new Error(`hold count ${before - book.sourceHold.length}`);
const publicCount = book.lessons.reduce((sum, l) => sum + l.original.items.length, 0);
Object.assign(book.sourceCoverage, { public: publicCount, hold: book.sourceHold.length, total: publicCount + book.sourceHold.length });

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("book05 batch6 patched", { L11: L11.original.items.length, L12: L12.original.items.length, L13: L13.original.items.length, lessonNos: [L11No, L12No, L13No], coverage: book.sourceCoverage });
