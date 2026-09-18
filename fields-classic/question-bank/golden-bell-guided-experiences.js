import { book02Markup } from "./book02-renderers.js?v=20260904b";
import { book03Markup } from "./book03-renderers.js?v=20260905a";
import { book06Markup } from "./book06-renderers.js?v=20260905d";
import { book09Markup } from "./book09-renderers.js?v=20260829b";
import { GOLDEN_BELL_BOOKS as COURSE_ONE_BOOKS } from "./golden-bell-data.js?v=20260905e";
import { renderBook04Guided } from "./golden-bell-book04-guided.js?v=20260918a";
import { renderBook07Guided } from "./golden-bell-book07-guided.js?v=20260918a";
import { renderBook08Guided } from "./golden-bell-book08-guided.js?v=20260918a";

const BOOK_FOUR_GUIDED_FAMILIES = new Set([
  "book4-circle-logic-source",
  "book4-cube-box-fill",
  "book4-fold-hole-count",
  "book4-multiplication-matrix",
  "book4-row-logic-source",
  "book4-table-logic-source"
]);
const BOOK_SEVEN_PHASES = ["given", "organize", "calculate", "verify"];
const BOOK_SEVEN_GUIDED_FAMILIES = new Set([
  "arithmetic-sequence",
  "assumption-score",
  "calendar-weekday",
  "clock-reading",
  "closed-loop",
  "multiplication-equation",
  "reverse-digits",
  "reverse-growth",
  "shape-sequence",
  "venn-diagram"
]);
const BOOK_SEVEN_CAPTIONS = {
  "shape-sequence": ["처음 도형의 변을 셉니다.", "맞닿아 함께 쓰는 한 변을 표시합니다.", "새 도형마다 늘어나는 성냥개비 수를 계산합니다.", "완성한 모양의 바깥선과 공통 변을 다시 셉니다."],
  "closed-loop": ["닫힌 둘레의 나무와 간격을 봅니다.", "마지막 나무와 첫 나무 사이에도 간격이 있음을 표시합니다.", "나무 수와 간격의 길이를 곱합니다.", "간격 수가 나무 수와 같은지 다시 확인합니다."],
  "venn-diagram": ["전체 수와 두 조건의 수를 봅니다.", "두 원이 겹치는 자리를 표시합니다.", "두 조건의 합에서 전체를 뺍니다.", "세 구역을 더해 전체 수가 되는지 확인합니다."],
  "calendar-weekday": ["출발 요일과 옮길 날짜 수를 봅니다.", "7일씩 한 주로 묶고 남는 날을 찾습니다.", "출발 요일에서 남은 칸만 옮깁니다.", "7일 전과 같은 요일인지 달력 줄에서 확인합니다."],
  "clock-reading": ["긴바늘과 짧은바늘의 위치를 봅니다.", "긴바늘 숫자 한 칸을 5분으로 바꿉니다.", "긴바늘 숫자에 5를 곱합니다.", "구한 분에서 짧은바늘이 두 시 사이에 있는지 확인합니다."],
  "multiplication-equation": ["전체 수와 묶음 수를 봅니다.", "전체를 같은 수의 묶음으로 나눕니다.", "전체를 묶음 수로 나누어 빈칸을 찾습니다.", "찾은 수를 다시 곱해 전체가 되는지 확인합니다."],
  "arithmetic-sequence": ["앞에 나온 수들을 차례로 봅니다.", "이웃한 수 사이의 같은 차를 찾습니다.", "목표 순서까지 같은 수를 더합니다.", "구한 수에서 공차를 빼 앞 수가 되는지 확인합니다."],
  "assumption-score": ["두 점수와 문제 수, 전체 점수를 봅니다.", "모든 문제를 낮은 점수라고 가정합니다.", "실제 점수와의 차를 한 문제의 점수 차로 나눕니다.", "두 종류의 점수를 다시 더해 전체 점수를 확인합니다."],
  "reverse-growth": ["가득 찬 날과 찾을 날을 봅니다.", "하루 전으로 갈 때 같은 배수로 나눕니다.", "날짜 차만큼 거꾸로 나눕니다.", "찾은 양을 다시 늘려 가득 차는지 확인합니다."],
  "reverse-digits": ["십의 자리와 일의 자리를 바꾼 두 수를 봅니다.", "두 수의 차가 자리 차의 9배임을 표시합니다.", "두 수의 차를 9로 나눕니다.", "자리 차에 9를 곱해 처음 차가 되는지 확인합니다."]
};
const BOOK_EIGHT_GUIDED_FAMILIES = new Set([
  "book08-picture-division",
  "book08-pyramid-cryptarithm",
  "book08-shape-equation-targets"
]);
const BOOK_NINE_PHASES = ["problem", "organize", "calculate", "verify"];
const BOOK_NINE_GUIDED_FAMILIES = new Set(["book09-area", "book09-cube", "book09-magic", "book09-consecutive"]);
const SEQUENCED_PRINT_FAMILIES = new Set([
  ...BOOK_FOUR_GUIDED_FAMILIES,
  ...BOOK_SEVEN_GUIDED_FAMILIES,
  ...BOOK_EIGHT_GUIDED_FAMILIES,
  ...BOOK_NINE_GUIDED_FAMILIES
]);
const BOOK_NINE_CAPTIONS = {
  "book09-area": ["주어진 도형과 모눈만 봅니다.", "단위 칸으로 나누어 표시합니다.", "단위 넓이를 식으로 모읍니다.", "넓이와 단위 칸의 합을 확인합니다."],
  "book09-cube": ["주어진 쌓기 모양만 봅니다.", "바닥 자리마다 기둥 높이를 표시합니다.", "기둥별 개수를 덧셈식으로 모읍니다.", "전체 개수와 높이의 합을 확인합니다."],
  "book09-magic": ["빈칸이 있는 수 배열만 봅니다.", "빈칸이 든 한 줄을 골라 표시합니다.", "한 줄의 합에서 아는 수를 뺍니다.", "빈칸을 넣어 가로와 세로를 확인합니다."],
  "book09-consecutive": ["주어진 연속수만 봅니다.", "양끝의 수끼리 짝을 만듭니다.", "같은 합의 짝을 식으로 모읍니다.", "짝의 합과 전체 합을 확인합니다."]
};

function normalizeBookNineGuidedBeats() {
  for (const book of COURSE_ONE_BOOKS) {
    for (const lesson of book.lessons || []) {
      const experience = lesson.experience;
      if (experience?.kind !== "guided-concept" || !BOOK_NINE_GUIDED_FAMILIES.has(experience.family)) continue;
      const existing = Array.isArray(experience.beats) ? experience.beats : [];
      if (existing.length === 4 && existing.every((beat, index) => beat.phase === BOOK_NINE_PHASES[index])) continue;
      const captions = BOOK_NINE_CAPTIONS[experience.family];
      experience.beats = BOOK_NINE_PHASES.map((phase, index) => ({
        ...(phase === "problem" ? existing[0] : phase === "organize" ? existing[1] : phase === "verify" ? existing.at(-1) : {}),
        id: `${experience.family}-${phase}`,
        action: phase === "problem" ? "draw" : phase === "organize" ? "transform" : phase,
        phase,
        caption: captions[index]
      }));
    }
  }
}

function normalizeBookSevenGuidedBeats() {
  for (const book of COURSE_ONE_BOOKS) {
    for (const lesson of book.lessons || []) {
      const experience = lesson.experience;
      if (experience?.kind !== "guided-concept" || !BOOK_SEVEN_GUIDED_FAMILIES.has(experience.family)) continue;
      const existing = Array.isArray(experience.beats) ? experience.beats : [];
      if (existing.length === 4 && existing.every((beat, index) => beat.phase === BOOK_SEVEN_PHASES[index])) continue;
      const captions = BOOK_SEVEN_CAPTIONS[experience.family];
      experience.beats = BOOK_SEVEN_PHASES.map((phase, index) => ({
        ...(phase === "given" ? existing[0] : phase === "organize" ? existing[1] : phase === "verify" ? existing.at(-1) : {}),
        id: `${experience.family}-${phase}`,
        action: phase === "given" ? "draw" : phase === "organize" ? "transform" : phase,
        phase,
        caption: captions[index]
      }));
    }
  }
}

normalizeBookSevenGuidedBeats();
normalizeBookNineGuidedBeats();

function foldVisual(phase) {
  const folded = ["folded", "cut"].includes(phase);
  const cut = ["cut", "unfolded"].includes(phase);
  const unfolded = phase === "unfolded";
  return `<svg class="guided-fold-svg" viewBox="0 0 260 170" role="img" aria-label="색종이를 접고 자른 뒤 펼치는 과정"><rect class="guided-paper" x="40" y="30" width="180" height="110" /><path class="guided-crease" d="M130 30V140" /><g class="guided-fold-half ${folded ? "is-folded" : ""}"><rect x="40" y="30" width="90" height="110" /><path d="M52 85H112M104 77L114 85L104 93" /></g>${cut ? '<path class="guided-cut right" d="M151 70L168 85L151 100" />' : ""}${unfolded ? '<path class="guided-cut left" d="M109 70L92 85L109 100" />' : ""}<text x="130" y="160">${phase === "flat" ? "접기 전" : phase === "folded" ? "반으로 접기" : phase === "cut" ? "접은 채 자르기" : "거울처럼 펼치기"}</text></svg>`;
}

function doubleFoldVisual(phase) {
  const marks = phase === "open-two" ? 4 : phase === "open-one" ? 2 : phase === "second" ? 1 : 0;
  const captions = {
    flat: "접기 전 정사각형에서 두 접은 선을 확인해요.",
    first: "세로선을 따라 한 번 포개요.",
    second: "가로선을 따라 다시 포갠 뒤 한 곳을 잘라요.",
    "open-one": "마지막 가로 접기를 먼저 펼치면 자국이 2개가 돼요.",
    "open-two": "첫 세로 접기까지 펼치면 자국이 4개가 돼요."
  };
  return `<div class="guided-double-fold ${phase}" role="img" aria-label="색종이를 두 번 접고 마지막 접기부터 거꾸로 펼치는 과정"><div class="guided-double-fold-paper"><i class="vertical"></i><i class="horizontal"></i>${Array.from({ length: marks }, (_, index) => `<b class="m${index + 1}">★</b>`).join("")}</div><div class="guided-double-fold-order"><span>접기 1</span><span>접기 2</span><strong>펼치기 2</strong><strong>펼치기 1</strong></div><p>${captions[phase]}</p></div>`;
}

function equalLineVisual(phase, model) {
  const compare = ["compare", "solve"].includes(phase);
  const solved = phase === "solve";
  return `<div class="guided-line-visual ${phase}"><div class="guided-line-cross"><span class="top">${solved ? model.answer : "?"}</span><span class="left">${model.left}</span><span class="center">${model.center}</span><span class="right">${model.right}</span><span class="bottom">${model.bottom}</span></div><p>${phase === "center" ? `가운데 ${model.center}은 두 줄에 함께 있어요.` : compare ? `${model.left} + ${model.right} = ${model.left + model.right}　·　${solved ? `${model.answer} + ${model.bottom} = ${model.left + model.right}` : `? + ${model.bottom} = ${model.left + model.right}`}` : "가로줄과 세로줄을 찾아요."}</p></div>`;
}

function lineCardPlacementVisual(phase, model) {
  const centerVisible = ["center", "pairs", "verify"].includes(phase);
  const pairsVisible = ["pairs", "verify"].includes(phase);
  const valueAt = (index) => {
    if (!centerVisible && index === 2) return "?";
    if (!pairsVisible && index !== 2) return "?";
    return [model.pairs[0][0], model.pairs[1][0], model.center, model.pairs[0][1], model.pairs[1][1]][index];
  };
  return `<div class="guided-line-card-placement ${phase}" role="img" aria-label="교차점에 수를 놓고 남은 카드를 같은 합의 짝으로 묶는 과정"><div class="guided-line-card-deck">${model.cards.map((card) => `<span>${card}</span>`).join("")}</div><div class="guided-line-card-cross">${Array.from({ length: 5 }, (_, index) => `<b class="p${index + 1}">${valueAt(index)}</b>`).join("")}</div><p>${phase === "cards" ? "사용할 카드를 한 번씩 확인해요." : phase === "center" ? `교차점에 ${model.center}을 놓으면 두 줄에 공통으로 들어가요.` : phase === "pairs" ? `${model.pairs[0].join("+")}와 ${model.pairs[1].join("+")}의 합이 같아요.` : `${model.pairs[0][0]}+${model.center}+${model.pairs[0][1]} = ${model.pairs[1][0]}+${model.center}+${model.pairs[1][1]}인지 확인해요.`}</p></div>`;
}

function logicVisual(phase, model) {
  const states = {
    start: [["possible", "possible", "possible"], ["possible", "possible", "possible"], ["possible", "possible", "possible"]],
    fixed: [["yes", "no", "no"], ["no", "possible", "possible"], ["no", "possible", "possible"]],
    eliminate: [["yes", "no", "no"], ["no", "yes", "no"], ["no", "no", "yes"]],
    solved: [["yes", "no", "no"], ["no", "yes", "no"], ["no", "no", "yes"]]
  };
  const cells = states[phase] || states.start;
  return `<div class="guided-logic-visual"><div class="logic-grid"><span></span>${model.choices.map((choice) => `<b>${choice}</b>`).join("")}${model.people.map((person, row) => `<strong>${person}</strong>${cells[row].map((status) => `<i class="${status}">${status === "yes" ? "✓" : status === "no" ? "×" : "○"}</i>`).join("")}`).join("")}</div><p>${phase === "start" ? "처음에는 가능한 것을 모두 열어 둬요." : phase === "fixed" ? `${model.people[0]}의 답을 먼저 확정해요.` : phase === "eliminate" ? "이미 사용한 답과 조건에 맞지 않는 답을 지워요." : "한 사람에게 하나씩만 남았어요."}</p></div>`;
}

function shapeSubstitutionVisual(phase, model) {
  const pairKnown = ["pair", "substitute", "verify"].includes(phase);
  const targetKnown = ["substitute", "verify"].includes(phase);
  const token = (shape, value = "") => `<span class="guided-shape-token ${shape}">${shape === "diamond" ? "◇" : "○"}${value ? `<b>${value}</b>` : ""}</span>`;
  return `<div class="guided-substitution-visual ${phase}" role="img" aria-label="같은 모양의 값을 찾아 다른 식에 넣는 과정"><div class="guided-equation ${phase === "pair" ? "active" : ""}">${token(model.pairShape, pairKnown ? model.pairValue : "")}<i>+</i>${token(model.pairShape, pairKnown ? model.pairValue : "")}<i>=</i><strong>${model.pairTotal}</strong></div><div class="guided-equation ${phase === "substitute" || phase === "verify" ? "active" : ""}">${token(model.targetShape, targetKnown ? model.targetValue : "?")}<i>+</i>${token(model.pairShape, pairKnown ? model.pairValue : "")}<i>=</i><strong>${model.mixedTotal}</strong></div><p>${phase === "equations" ? "같은 모양은 언제나 같은 수예요." : phase === "pair" ? `${model.pairTotal}을 똑같이 나누면 ${model.pairValue}씩이에요.` : phase === "substitute" ? `${model.mixedTotal}에서 ${model.pairValue}를 빼면 ${model.targetValue}이에요.` : `${model.targetValue} + ${model.pairValue} = ${model.mixedTotal}, 두 식이 모두 맞아요.`}</p></div>`;
}

function balanceUnit([left, right, heavySide], active) {
  return `<figure class="guided-balance-unit ${heavySide}-heavy ${active ? "active" : ""}"><div class="guided-balance-load left">${left}</div><div class="guided-balance-load right">${right}</div><div class="guided-balance-line"></div><div class="guided-balance-stand"></div><figcaption>${left} ${heavySide === "left" ? ">" : "<"} ${right}</figcaption></figure>`;
}

function balanceOrderVisual(phase, model) {
  const showSecond = phase !== "first";
  const showChain = ["chain", "verify"].includes(phase);
  return `<div class="guided-balance-visual"><div class="guided-balance-pair">${balanceUnit(model.first, true)}${balanceUnit(model.second, showSecond)}</div>${showChain ? `<div class="guided-order-chain">${model.order.map((item, index) => `<span>${item}</span>${index < model.order.length - 1 ? "<b>&gt;</b>" : ""}`).join("")}</div>` : ""}<p>${phase === "first" ? "아래로 내려간 곰이 더 무거워요." : phase === "second" ? "둘째 저울도 아래로 내려간 토끼부터 읽어요." : phase === "chain" ? "토끼를 가운데에 놓으면 두 관계가 이어져요." : "완성한 순서를 두 저울에 다시 대어 확인해요."}</p></div>`;
}

function patternSymbol(shape, filled) {
  const symbols = { circle: filled ? "●" : "○", triangle: filled ? "▲" : "△", square: filled ? "■" : "□" };
  return symbols[shape] || "?";
}

function dualPatternVisual(phase, model) {
  const items = Array.from({ length: model.count }, (_, index) => ({
    shape: model.shapes[index % model.shapes.length],
    filled: model.fills[index % model.fills.length]
  }));
  const symbols = items.map(({ shape, filled }, index) => {
    const text = phase === "shape" ? patternSymbol(shape, false) : phase === "fill" ? (filled ? "●" : "○") : patternSymbol(shape, filled);
    return `<span><b>${text}</b><i>${index + 1}</i></span>`;
  }).join("");
  return `<div class="guided-pattern-visual ${phase}" role="img" aria-label="모양 주기와 색 주기를 따로 찾아 합치는 과정"><div class="guided-pattern-row">${symbols}</div><div class="guided-cycle-key"><span class="shape-key">모양 주기 ${model.shapes.length}</span><span class="fill-key">색 주기 ${model.fills.length}</span></div><p>${phase === "combined" ? "두 규칙이 한 줄에 함께 보여요." : phase === "shape" ? "색을 가리고 모양만 세 칸씩 읽어요." : phase === "fill" ? "모양을 가리고 빈 칸과 색칠한 칸만 읽어요." : "두 차례를 같은 번호에서 다시 합쳐요."}</p></div>`;
}

function promiseDiagramMarkup(diagram, showRule) {
  return `<figure class="guided-promise-diagram"><div><strong class="top">${diagram.top}</strong><span class="left">${diagram.left}</span><span class="right">${diagram.right}</span><span class="bottom">${diagram.bottom}</span></div>${showRule ? `<figcaption>${diagram.left} + ${diagram.bottom} + ${diagram.right} = ${diagram.top}</figcaption>` : ""}</figure>`;
}

function numberPromiseVisual(phase, model) {
  const showRule = ["rule", "confirm", "reverse"].includes(phase);
  const showSecond = ["confirm", "reverse"].includes(phase);
  return `<div class="guided-promise-visual"><div>${promiseDiagramMarkup(model.examples[0], showRule)}${showSecond ? promiseDiagramMarkup(model.examples[1], true) : ""}</div>${phase === "reverse" ? '<p class="guided-reverse-rule">위 - 왼쪽 - 아래 = 오른쪽</p>' : ""}<p>${phase === "observe" ? "네 자리의 수를 차례로 살펴봐요." : phase === "rule" ? "옆과 아래의 세 수를 더하면 위 수가 돼요." : phase === "confirm" ? "다른 그림에서도 같은 약속이 맞아요." : "빈자리가 바뀌면 덧셈을 거꾸로 계산해요."}</p></div>`;
}

function sixBundleVisual(phase, model) {
  const groups = phase === "groups" ? model.startGroups : phase === "extra" ? model.startGroups + model.extraGroups : model.totalGroups;
  const groupMarkup = Array.from({ length: Math.max(0, groups) }, (_, index) => `<span class="guided-six-bundle" aria-label="6개 묶음 ${index + 1}">${Array.from({ length: 6 }, () => '<i aria-hidden="true"></i>').join("")}</span>`).join("");
  const equation = phase === "groups"
    ? `${model.base} × ${model.startGroups} = ${model.base * model.startGroups}`
    : phase === "extra"
      ? `${model.base * model.extraGroups} = ${model.base} × ${model.extraGroups}`
      : phase === "combine"
        ? `${model.base} × ${model.startGroups} + ${model.base} × ${model.extraGroups} = ${model.base} × ${model.totalGroups}`
        : `${model.base * model.startGroups} + ${model.base * model.extraGroups} = ${model.base * model.totalGroups}`;
  return `<div class="guided-six-bundle-visual ${phase}" role="img" aria-label="6개씩 묶어 등가식으로 나타내는 과정"><div class="guided-six-bundle-groups">${groupMarkup}</div><div class="guided-six-bundle-equation">${equation}</div><p>${phase === "groups" ? "6개씩 묶인 덩어리를 세어 보세요." : phase === "extra" ? "더해진 12도 6개짜리 묶음으로 바꾸어 보세요." : phase === "combine" ? `${model.startGroups}묶음과 ${model.extraGroups}묶음을 합치면 ${model.totalGroups}묶음이에요.` : `${model.totalGroups}묶음 × 6 = ${model.totalGroups * 6}개인지 확인합니다.`}</p></div>`;
}

function multipleDirectionVisual(phase, model) {
  const solved = phase === "divide" || phase === "verify";
  return `<div class="guided-multiple-visual ${phase}" role="img" aria-label="기준량과 비교량의 방향을 확인하고 비교량을 기준량으로 나누는 과정"><div class="guided-multiple-bars"><span class="guided-multiple-unit">${model.unitLabel || "기준량"}<b>${model.unit}</b></span><span class="guided-multiple-comparison">${model.comparisonLabel || "비교량"}<b>${model.comparison}</b></span></div><div class="guided-multiple-equation">${solved ? `${model.comparison} ÷ ${model.unit} = ${model.ratio}` : `${model.comparison} ÷ ${model.unit} = ?`}</div><p>${phase === "unit" ? "먼저 기준이 되는 양을 정합니다." : phase === "repeat" ? `${model.comparison} 안에 기준량 ${model.unit}이 몇 번 들어가는지 세어요.` : phase === "divide" ? "비교량을 기준량으로 나누어 몇 배인지 구합니다." : `${model.ratio}배가 맞는지 기준량을 반복해 확인합니다.`}</p></div>`;
}

function verticalCryptarithmVisual(phase, model) {
  const showOnes = ["ones", "carry", "verify"].includes(phase);
  const showCarry = ["carry", "verify"].includes(phase);
  const cell = (value, label) => `<span class="guided-cryptarithm-cell" aria-label="${label}">${value}</span>`;
  const spacer = '<span class="guided-cryptarithm-spacer" aria-hidden="true"></span>';
  const addend = phase === "verify" ? model.symbolValue : model.symbol;
  const rows = Array.from({ length: model.repeat }, (_, index) => `<div class="guided-cryptarithm-addend"><b>${index === model.repeat - 1 ? "+" : ""}</b>${spacer}${cell(addend, `더하는 수 ${index + 1}`)}</div>`).join("");
  return `<div class="guided-cryptarithm-visual ${phase}" role="img" aria-label="도형을 숫자로 바꾸는 세로셈과 받아올림 과정"><div class="guided-cryptarithm-stack"><div class="guided-cryptarithm-carry"><small>${showCarry ? "받아올림" : ""}</small>${cell(showCarry ? model.carryValue : "", "받아올림")}${spacer}</div>${rows}<div class="guided-cryptarithm-rule"></div><div class="guided-cryptarithm-result">${spacer}${cell(phase === "verify" ? model.carryValue : model.resultTens, "십의 자리")}${cell(showOnes ? model.resultOnes : "?", "일의 자리")}</div></div><p>${phase === "layout" ? "같은 도형 세 개를 세로셈 자리에 맞추어 놓아요." : phase === "ones" ? `${model.symbol}을 세 번 더한 일의 자리는 ${model.resultOnes}예요.` : phase === "carry" ? `${model.symbolValue} + ${model.symbolValue} + ${model.symbolValue} = 12이므로 ${model.carryValue}을 십의 자리로 받아올려요.` : `${model.symbolValue} + ${model.symbolValue} + ${model.symbolValue} = ${model.carryValue}${model.resultOnes}, 받아올림 ${model.carryValue}까지 확인합니다.`}</p></div>`;
}

function magicLineTargetVisual(phase, model) {
  const grid = Array.from({ length: 9 }, (_, index) => index === model.targetIndex && ["solve", "verify"].includes(phase) ? model.target : index === model.targetIndex ? "?" : (model.grid[index] ?? "·"));
  const line = model.grid.slice(0, 3).join(" + ");
  return `<div class="guided-magic-visual ${phase}" role="img" aria-label="3x3 마방진의 완성 줄을 찾아 빈칸을 역산하는 과정"><div class="guided-magic-grid">${grid.map((value, index) => `<span class="${index < 3 ? "is-target-line" : ""}">${value}</span>`).join("")}</div><div class="guided-magic-equation">${phase === "complete" ? "완성된 줄을 찾아요" : `${line} = ${model.lineSum}`}${["solve", "verify"].includes(phase) ? ` → 빈칸 = ${model.target}` : " → ?"}</div><p class="guided-magic-rule">3×3 마방진은 9칸이고, 가로·세로·대각선 한 줄의 합은 ${model.lineSum}예요.</p><p>${phase === "complete" ? "가로, 세로, 대각선을 살펴 한 줄을 정합니다." : phase === "target" ? `이 줄의 합은 ${model.lineSum}이므로 빈칸을 찾아요.` : phase === "solve" ? `${model.lineSum}에서 알고 있는 수를 빼서 빈칸 ${model.target}을 역산합니다.` : `빈칸 ${model.target}을 넣어 다른 줄의 합도 확인합니다.`}</p></div>`;
}

function mirrorDirectionVisual(phase) {
  const sideVisible = ["side", "vertical", "compare"].includes(phase);
  const verticalVisible = ["vertical", "compare"].includes(phase);
  return `<div class="guided-mirror-direction ${phase}" role="img" aria-label="거울 방향에 따라 선이 좌우 또는 위아래로 바뀌는 과정"><svg viewBox="0 0 420 210"><path class="axis vertical" d="M210 16V194"/><path class="axis horizontal" d="M35 105H385"/><g class="source" transform="translate(105 66)"><path d="M0 32V-25M0-15L-30-15"/></g>${sideVisible ? '<g class="side" transform="translate(315 66)"><path d="M0 32V-25M0-15L30-15"/></g>' : ''}${verticalVisible ? '<g class="bottom" transform="translate(105 148)"><path d="M0-32V25M0 15L-30 15"/></g>' : ''}<text x="105" y="22">처음 모양</text><text x="315" y="22">좌우 거울</text><text x="105" y="203">위아래 거울</text></svg><p>${phase === "source" ? "비스듬한 선이 세로선의 위쪽 왼편에 있습니다." : phase === "side" ? "옆 거울에서는 높이는 그대로, 왼쪽과 오른쪽만 바뀝니다." : phase === "vertical" ? "위아래 거울에서는 좌우는 그대로, 높이만 바뀝니다." : "거울선에서 같은 거리인지 세 방향을 다시 비교합니다."}</p></div>`;
}

function digitalTransformVisual(phase, model) {
  const steps = [
    ["source", model.source, "처음 숫자의 켜진 선을 봅니다."],
    ["flip", model.flipped, "좌우로 뒤집으면 2와 5가 서로 바뀝니다."],
    ["half", model.halfTurned, "반 바퀴에서는 위아래와 자리 순서도 함께 바뀝니다."],
    ["equation", `${model.source} + ${model.flipped}`, "바뀐 수를 먼저 적고 계산합니다."]
  ];
  const active = Math.max(0, steps.findIndex(([name]) => name === phase));
  return `<div class="guided-digital-transform ${phase}" role="img" aria-label="디지털 숫자의 선분을 움직여 뒤집고 돌리는 과정"><div>${steps.map(([name, value], index) => `<span class="${index <= active ? "visible" : ""}"><small>${index + 1}</small><b>${value}</b><i>${name === "source" ? "처음" : name === "flip" ? "좌우" : name === "half" ? "반 바퀴" : "계산"}</i></span>`).join("")}</div><p>${steps[active][2]}</p></div>`;
}

function sumGridPlacementVisual(phase) {
  const values = phase === "given" ? [3, "", "", ""] : phase === "row" ? [3, 5, "", ""] : phase === "column" ? [3, 5, 6, ""] : [3, 5, 6, 4];
  return `<div class="guided-sum-grid-placement ${phase}" role="img" aria-label="숫자 카드를 한 번씩 놓아 가로와 세로 합을 맞추는 과정"><div class="cards"><span>4</span><span>5</span><span>6</span></div><div class="board">${values.map((value) => `<b>${value}</b>`).join("")}<i class="r1">8</i><i class="r2">10</i><i class="c1">9</i><i class="c2">9</i></div><p>${phase === "given" ? "3이 놓인 표와 사용할 카드 4, 5, 6을 확인합니다." : phase === "row" ? "윗줄은 8이므로 8-3=5를 놓습니다." : phase === "column" ? "왼쪽 세로줄은 9이므로 9-3=6을 놓습니다." : "남은 4를 놓고 네 줄의 합을 모두 확인합니다."}</p></div>`;
}

function numberConditionFilterVisual(phase, model) {
  const candidates = Array.isArray(model?.candidates) ? model.candidates : [];
  const remaining = Array.isArray(model?.answer)
    ? model.answer
    : candidates.filter((value) => Number.isInteger(value) && Math.abs(value) % 2 === 1);
  const firstDone = ["first", "second", "verify"].includes(phase);
  const secondDone = ["second", "verify"].includes(phase);
  return `<div class="guided-number-filter ${phase}" role="img" aria-label="후보 수에 조건을 하나씩 적용하는 과정"><div>${candidates.map((value) => `<span class="${secondDone && !remaining.includes(value) ? "removed" : firstDone ? "kept" : ""}">${value}</span>`).join("")}</div><ol><li class="${firstDone ? "done" : ""}">각 자리의 합이 4</li><li class="${secondDone ? "done" : ""}">홀수</li></ol><p>${phase === "candidates" ? "먼저 빠짐없이 후보를 적습니다." : phase === "first" ? "13, 22, 31, 40은 첫 조건을 모두 만족합니다." : phase === "second" ? "짝수인 22와 40을 지우면 13과 31이 남습니다." : "13과 31의 자리 합과 홀짝을 다시 확인합니다."}</p></div>`;
}

function relativeOrderVisual(phase, model) {
  const people = Array.isArray(model?.people) && model.people.length === 4 ? model.people : ["A", "B", "C", "D"];
  const [last, first, beforeLast, between] = people;
  const completed = Array.isArray(model?.answer) && model.answer.length === 4
    ? model.answer
    : [first, between, beforeLast, last];
  const shown = phase === "empty"
    ? ["?", "?", "?", "?"]
    : phase === "last"
      ? ["?", "?", "?", last]
      : phase === "pair"
        ? ["?", "?", beforeLast, last]
        : completed;
  return `<div class="guided-relative-order ${phase}" role="img" aria-label="조건을 읽어 앞뒤 순서를 정하는 과정"><div><b>앞</b>${shown.map((person) => `<span>${person}</span>`).join("")}<b>뒤</b></div><p>${phase === "empty" ? "왼쪽을 앞, 오른쪽을 뒤로 정합니다." : phase === "last" ? "A를 가장 뒤에 고정합니다." : phase === "pair" ? "C를 A의 바로 앞에 붙입니다." : "D를 B와 C 사이에 놓으면 B-D-C-A입니다."}</p></div>`;
}

function equalizeTransferVisual(phase, model) {
  const moved = ["move", "equal"].includes(phase) ? model.transfer : 0;
  const left = model.left - moved;
  const right = model.right + moved;
  const dots = (count, name) => `<span aria-label="${name} ${count}개">${Array.from({ length: count }, () => "<i></i>").join("")}</span>`;
  return `<div class="guided-equalize-transfer ${phase}" role="img" aria-label="많은 쪽에서 적은 쪽으로 옮겨 수를 같게 만드는 과정"><div>${dots(left, "A")}<b>${left}</b></div><strong>${phase === "difference" ? `${model.left}-${model.right}=${model.left-model.right}` : phase === "move" ? `${model.transfer}개 이동` : phase === "equal" ? `${left} = ${right}` : "차이는 몇 개?"}</strong><div>${dots(right, "B")}<b>${right}</b></div><p>${phase === "start" ? "두 양을 나란히 놓고 차이를 봅니다." : phase === "difference" ? "차이를 2로 나누면 옮길 수가 됩니다." : phase === "move" ? "많은 쪽에서 적은 쪽으로 차이의 절반을 옮깁니다." : "두 양이 같은지 마지막으로 확인합니다."}</p></div>`;
}

function bookTwoSourceVisual(experience, beat, step) {
  const itemVisual = beat.visual || experience.model?.visuals?.[step] || experience.model?.visual;
  return `<div class="guided-book2-source ${beat.phase || "step"}" data-book2-guided-step="${step + 1}" role="img" aria-label="${beat.caption}">${itemVisual ? book02Markup(itemVisual) : ""}<p>${beat.caption}</p></div>`;
}

function bookThreeSourceVisual(experience, beat, step) {
  const itemVisual = beat.visual || experience.model?.visuals?.[step] || experience.model?.visual;
  return `<div class="book03-visual guided-book3-source ${beat.phase || "step"}" data-book3-guided-step="${step + 1}" role="img" aria-label="${beat.caption}">${itemVisual ? book03Markup(itemVisual) : ""}<p>${beat.caption}</p></div>`;
}

function bookSixSourceVisual(experience, beat, step) {
  const itemVisual = beat.visual || experience.model?.visual;
  return `<div class="book06-visual guided-book6-source" data-book6-guided-step="${step + 1}" role="img" aria-label="${beat.caption}">${itemVisual ? book06Markup(itemVisual) : ""}<p>${beat.caption}</p></div>`;
}

const BOOK_NINE_COLOR = Object.freeze({
  given: "#187fa9",
  action: "#d39b20",
  verify: "#16734b",
  ink: "#233746",
  muted: "#b9c5cc",
  paper: "#ffffff",
  wash: "#f5f6f8"
});

function bookNineEscape(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function bookNineNumber(value) {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100);
}

function bookNinePhaseShell(family, phase, content) {
  const labels = { problem: "문제", organize: "정리", calculate: "계산", verify: "검산" };
  const activeIndex = BOOK_NINE_PHASES.indexOf(phase);
  const colorRole = phase === "problem" ? "given" : phase === "verify" ? "verify" : "action";
  const rail = BOOK_NINE_PHASES.map((name, index) => {
    const active = index === activeIndex;
    const complete = index < activeIndex;
    const color = name === "problem" ? BOOK_NINE_COLOR.given : name === "verify" ? BOOK_NINE_COLOR.verify : BOOK_NINE_COLOR.action;
    return `<span style="display:grid;place-items:center;min-height:28px;border-bottom:3px solid ${active || complete ? color : BOOK_NINE_COLOR.muted};color:${active ? color : BOOK_NINE_COLOR.ink};font-size:12px;font-weight:900">${labels[name]}</span>`;
  }).join("");
  return `<div class="book09-visual guided-book09-source" data-book09-family="${bookNineEscape(family)}" data-book09-phase="${phase}" data-color-role="${colorRole}" role="img" aria-label="${labels[phase]} 단계의 수학 그림" style="display:grid;gap:12px;width:100%;min-height:220px;padding:10px;background:${BOOK_NINE_COLOR.paper};overflow:hidden"><div aria-hidden="true" style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;width:min(100%,430px)">${rail}</div><div style="display:grid;gap:12px;place-items:center;width:100%">${content}</div></div>`;
}

function polygonArea(points) {
  return Math.abs(points.reduce((sum, [x, y], index) => {
    const [nextX, nextY] = points[(index + 1) % points.length];
    return sum + x * nextY - nextX * y;
  }, 0)) / 2;
}

function pointInPolygon([x, y], points) {
  let inside = false;
  for (let index = 0, previous = points.length - 1; index < points.length; previous = index, index += 1) {
    const [x1, y1] = points[index];
    const [x2, y2] = points[previous];
    const crosses = (y1 > y) !== (y2 > y) && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1;
    if (crosses) inside = !inside;
  }
  return inside;
}

function bookNineAreaFrame(visual, phase) {
  const width = Number(visual.gridWidth);
  const height = Number(visual.gridHeight);
  const points = (visual.points || []).map(([x, y]) => [Number(x), Number(y)]);
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || points.length < 3) {
    throw new Error("Book 9 area model is incomplete.");
  }
  const area = polygonArea(points);
  const unit = 48;
  const wholeCells = [];
  for (let row = 0; row < height; row += 1) {
    for (let column = 0; column < width; column += 1) {
      if (pointInPolygon([column + 0.5, row + 0.5], points)) wholeCells.push([column, row]);
    }
  }
  const highlight = phase === "verify" ? BOOK_NINE_COLOR.verify : BOOK_NINE_COLOR.action;
  const highlightedCells = phase === "problem" ? "" : wholeCells.map(([column, row]) => `<rect x="${column * unit + 3}" y="${row * unit + 3}" width="${unit - 6}" height="${unit - 6}" rx="3" fill="${highlight}" fill-opacity=".16" stroke="${highlight}" stroke-width="2"/><text x="${column * unit + unit / 2}" y="${row * unit + unit / 2 + 5}" fill="${highlight}" font-size="14" font-weight="900" text-anchor="middle">${phase === "verify" ? "✓" : "1"}</text>`).join("");
  const grid = `${Array.from({ length: width + 1 }, (_, index) => `<line x1="${index * unit}" y1="0" x2="${index * unit}" y2="${height * unit}"/>`).join("")}${Array.from({ length: height + 1 }, (_, index) => `<line x1="0" y1="${index * unit}" x2="${width * unit}" y2="${index * unit}"/>`).join("")}`;
  const polygon = points.map(([x, y]) => `${x * unit},${y * unit}`).join(" ");
  const svg = `<svg viewBox="-4 -4 ${width * unit + 8} ${height * unit + 8}" aria-label="모눈 위 주어진 도형" style="display:block;width:min(100%,360px);height:auto"><polygon points="${polygon}" fill="${phase === "verify" ? BOOK_NINE_COLOR.verify : BOOK_NINE_COLOR.given}" fill-opacity=".13" stroke="${phase === "verify" ? BOOK_NINE_COLOR.verify : BOOK_NINE_COLOR.given}" stroke-width="3"/>${highlightedCells}<g stroke="${BOOK_NINE_COLOR.muted}" stroke-width="1">${grid}</g></svg>`;
  if (phase === "problem" || phase === "organize") return svg;
  const fullCellTotal = wholeCells.length;
  const remainder = Math.max(0, area - fullCellTotal);
  const terms = [...Array.from({ length: fullCellTotal }, () => "1"), ...(remainder ? [bookNineNumber(remainder)] : [])];
  const expression = terms.length ? terms.join(" + ") : `${width} × ${height}`;
  if (phase === "calculate") {
    return `${svg}<div data-book09-expression style="padding:9px 14px;border-left:4px solid ${BOOK_NINE_COLOR.action};background:#fff8e4;color:${BOOK_NINE_COLOR.ink};font-size:20px;font-weight:900">${expression} = ?</div>`;
  }
  return `${svg}<div data-book09-answer="${bookNineNumber(area)}" style="display:grid;gap:5px;justify-items:center;color:${BOOK_NINE_COLOR.verify};font-size:20px;font-weight:900"><strong style="font-size:25px">넓이 ${bookNineNumber(area)}</strong><span data-book09-check="${bookNineEscape(`${expression} = ${bookNineNumber(area)}`)}">${expression} = ${bookNineNumber(area)}</span></div>`;
}

function bookNineCubeFrame(visual, phase) {
  const map = Array.isArray(visual.map) ? visual.map.map((row) => row.map(Number)) : [];
  const width = Math.max(0, ...map.map((row) => row.length));
  if (!map.length || !width || map.some((row) => row.length !== width || row.some((height) => !Number.isInteger(height) || height < 0))) {
    throw new Error("Book 9 cube height map is incomplete.");
  }
  const heights = map.flat();
  const total = heights.reduce((sum, height) => sum + height, 0);
  const source = book09Markup(visual).replace(/\sdata-total="[^"]*"/g, "");
  if (phase === "problem") return source;
  const cellColor = phase === "verify" ? BOOK_NINE_COLOR.verify : phase === "calculate" ? BOOK_NINE_COLOR.action : BOOK_NINE_COLOR.given;
  const columns = `<div aria-label="바닥 자리별 쌓기 높이" style="display:grid;grid-template-columns:repeat(${width},minmax(48px,62px));gap:7px">${heights.map((height, index) => `<span aria-label="${index + 1}번 자리 높이 ${height}" style="display:flex;flex-direction:column-reverse;align-items:center;justify-content:flex-start;gap:2px;min-height:66px;padding:6px;border:2px solid ${phase === "organize" ? BOOK_NINE_COLOR.action : cellColor};background:${BOOK_NINE_COLOR.wash}">${Array.from({ length: height }, () => `<i aria-hidden="true" style="display:block;width:24px;height:18px;border:1px solid ${cellColor};background:${cellColor};opacity:.78"></i>`).join("")}</span>`).join("")}</div>`;
  if (phase === "organize") return columns;
  const expression = heights.join(" + ");
  if (phase === "calculate") {
    return `${columns}<div data-book09-expression style="padding:9px 14px;border-left:4px solid ${BOOK_NINE_COLOR.action};background:#fff8e4;color:${BOOK_NINE_COLOR.ink};font-size:20px;font-weight:900">${expression} = ?</div>`;
  }
  return `${source}<div data-book09-answer="${total}" style="display:grid;gap:5px;justify-items:center;color:${BOOK_NINE_COLOR.verify};font-size:19px;font-weight:900"><strong style="font-size:25px">전체 ${total}개</strong><span data-book09-check="${bookNineEscape(`${expression} = ${total}`)}">${expression} = ${total}</span></div>`;
}

function magicSquareLines(size) {
  const rows = Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, column) => row * size + column));
  const columns = Array.from({ length: size }, (_, column) => Array.from({ length: size }, (_, row) => row * size + column));
  const diagonals = [
    Array.from({ length: size }, (_, index) => index * size + index),
    Array.from({ length: size }, (_, index) => index * size + (size - index - 1))
  ];
  return [...rows, ...columns, ...diagonals];
}

function bookNineMagicFrame(visual, phase) {
  const size = Number(visual.size);
  const lineSum = Number(visual.lineSum);
  const shown = Array.isArray(visual.shown) ? visual.shown.slice() : [];
  if (!Number.isInteger(size) || size < 2 || shown.length !== size * size || !Number.isFinite(lineSum)) {
    throw new Error("Book 9 magic-square model is incomplete.");
  }
  const blankIndexes = shown.map((value, index) => Number.isFinite(Number(value)) ? -1 : index).filter((index) => index >= 0);
  if (blankIndexes.length !== 1) throw new Error("Book 9 magic-square model must have one blank.");
  const blankIndex = blankIndexes[0];
  const relatedLines = magicSquareLines(size).filter((line) => line.includes(blankIndex));
  const candidates = relatedLines.map((line) => lineSum - line.reduce((sum, index) => index === blankIndex ? sum : sum + Number(shown[index]), 0));
  if (!candidates.length || new Set(candidates).size !== 1) throw new Error("Book 9 magic-square blank is not uniquely determined.");
  const target = candidates[0];
  const primaryLine = relatedLines[0];
  const filled = shown.map((value, index) => index === blankIndex ? target : Number(value));
  const reveal = phase === "verify";
  const grid = `<div aria-label="빈칸이 있는 ${size} 곱하기 ${size} 수 배열" style="display:grid;grid-template-columns:repeat(${size},48px);border:2px solid ${BOOK_NINE_COLOR.given}">${shown.map((value, index) => {
    const active = primaryLine.includes(index) && phase !== "problem";
    const targetCell = index === blankIndex;
    const color = reveal && targetCell ? BOOK_NINE_COLOR.verify : active ? BOOK_NINE_COLOR.action : BOOK_NINE_COLOR.ink;
    const background = reveal && targetCell ? "#e8f5ee" : active ? "#fff8e4" : BOOK_NINE_COLOR.paper;
    return `<span style="display:grid;place-items:center;width:48px;height:48px;border:1px solid ${active ? color : BOOK_NINE_COLOR.muted};background:${background};color:${color};font-size:17px;font-weight:900">${targetCell ? reveal ? target : "?" : bookNineEscape(value)}</span>`;
  }).join("")}</div><strong style="color:${BOOK_NINE_COLOR.given};font-size:13px">한 줄의 합 ${lineSum}</strong>`;
  if (phase === "problem" || phase === "organize") return grid;
  const known = primaryLine.filter((index) => index !== blankIndex).map((index) => Number(shown[index]));
  const calculation = `${lineSum} - ${known.join(" - ")}`;
  if (phase === "calculate") {
    return `${grid}<div data-book09-expression style="padding:9px 14px;border-left:4px solid ${BOOK_NINE_COLOR.action};background:#fff8e4;color:${BOOK_NINE_COLOR.ink};font-size:20px;font-weight:900">${calculation} = ?</div>`;
  }
  const checks = relatedLines.slice(0, 2).map((line) => `${line.map((index) => filled[index]).join(" + ")} = ${lineSum}`);
  return `${grid}<div data-book09-answer="${target}" style="display:grid;gap:4px;justify-items:center;color:${BOOK_NINE_COLOR.verify};font-size:17px;font-weight:900"><strong style="font-size:25px">빈칸 ${target}</strong><span data-book09-check="${bookNineEscape(checks.join(" / "))}">${checks.join("　")}</span></div>`;
}

function bookNineConsecutiveFrame(visual, phase) {
  const from = Number(visual.from);
  const to = Number(visual.to);
  if (!Number.isInteger(from) || !Number.isInteger(to) || to < from || to - from > 30) {
    throw new Error("Book 9 consecutive-number model is incomplete.");
  }
  const values = Array.from({ length: to - from + 1 }, (_, index) => from + index);
  const pairs = Array.from({ length: Math.floor(values.length / 2) }, (_, index) => [values[index], values[values.length - index - 1]]);
  const middle = values.length % 2 ? values[Math.floor(values.length / 2)] : null;
  const pairSum = pairs[0]?.reduce((sum, value) => sum + value, 0) || 0;
  const total = values.reduce((sum, value) => sum + value, 0);
  const card = (value, color) => `<span style="display:grid;place-items:center;min-width:42px;height:42px;padding:0 7px;border:2px solid ${color};background:${BOOK_NINE_COLOR.paper};color:${BOOK_NINE_COLOR.ink};font-size:17px;font-weight:900">${value}</span>`;
  if (phase === "problem") {
    return `<div aria-label="${from}부터 ${to}까지의 연속수" style="display:flex;flex-wrap:wrap;justify-content:center;gap:7px">${values.map((value) => card(value, BOOK_NINE_COLOR.given)).join("")}</div>`;
  }
  const pairMarkup = `<div aria-label="양끝 수로 만든 짝" style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px">${pairs.map(([left, right]) => `<span style="display:flex;align-items:center;gap:4px;padding:5px;border-bottom:3px solid ${phase === "verify" ? BOOK_NINE_COLOR.verify : BOOK_NINE_COLOR.action}">${card(left, BOOK_NINE_COLOR.given)}<i aria-hidden="true" style="color:${BOOK_NINE_COLOR.action};font-style:normal;font-weight:900">+</i>${card(right, BOOK_NINE_COLOR.given)}</span>`).join("")}${middle === null ? "" : `<span style="padding:5px;border-bottom:3px solid ${BOOK_NINE_COLOR.action}">${card(middle, BOOK_NINE_COLOR.given)}</span>`}</div>`;
  if (phase === "organize") return pairMarkup;
  const expression = middle === null ? `${pairs.length} × ${pairSum}` : `${pairs.length} × ${pairSum} + ${middle}`;
  if (phase === "calculate") {
    return `${pairMarkup}<div data-book09-expression style="padding:9px 14px;border-left:4px solid ${BOOK_NINE_COLOR.action};background:#fff8e4;color:${BOOK_NINE_COLOR.ink};font-size:20px;font-weight:900">${expression} = ?</div>`;
  }
  const check = `${values.join(" + ")} = ${total}`;
  return `${pairMarkup}<div data-book09-answer="${total}" style="display:grid;gap:4px;justify-items:center;color:${BOOK_NINE_COLOR.verify};font-size:17px;font-weight:900"><strong style="font-size:25px">합 ${total}</strong><span data-book09-check="${bookNineEscape(check)}">${expression} = ${total}　${check}</span></div>`;
}

function bookNineSourceVisual(experience, beat, step) {
  const visual = experience.model?.visual;
  if (!visual) return "";
  const phase = beat?.phase || (beat?.action === "verify" ? "verify" : BOOK_NINE_PHASES[Math.min(step, BOOK_NINE_PHASES.length - 1)]);
  let content = "";
  if (experience.family === "book09-area") content = bookNineAreaFrame(visual, phase);
  else if (experience.family === "book09-cube") content = bookNineCubeFrame(visual, phase);
  else if (experience.family === "book09-magic") content = bookNineMagicFrame(visual, phase);
  else if (experience.family === "book09-consecutive") content = bookNineConsecutiveFrame(visual, phase);
  else content = book09Markup(visual);
  return bookNinePhaseShell(experience.family, phase, content);
}

export function guidedConceptVisual(experience, step) {
  const beat = experience.beats[Math.max(0, Math.min(step, experience.beats.length - 1))];
  if (experience.family?.startsWith("book2-")) return bookTwoSourceVisual(experience, beat, step);
  if (experience.family?.startsWith("book3-")) return bookThreeSourceVisual(experience, beat, step);
  if (BOOK_FOUR_GUIDED_FAMILIES.has(experience.family)) return renderBook04Guided(experience, beat, step);
  if (experience.family === "book06-source") return bookSixSourceVisual(experience, beat, step);
  if (BOOK_SEVEN_GUIDED_FAMILIES.has(experience.family)) return renderBook07Guided(experience, beat, step);
  if (experience.family?.startsWith("book08-")) return renderBook08Guided(experience, beat, step);
  if (experience.family?.startsWith("book09-")) return bookNineSourceVisual(experience, beat, step);
  if (experience.family === "fold-symmetry") return foldVisual(beat.phase);
  if (experience.family === "double-fold-symmetry") return doubleFoldVisual(beat.phase);
  if (experience.family === "equal-line") return equalLineVisual(beat.phase, experience.model);
  if (experience.family === "line-card-placement") return lineCardPlacementVisual(beat.phase, experience.model);
  if (experience.family === "one-to-one-logic") return logicVisual(beat.phase, experience.model);
  if (experience.family === "shape-substitution") return shapeSubstitutionVisual(beat.phase, experience.model);
  if (experience.family === "balance-order-chain") return balanceOrderVisual(beat.phase, experience.model);
  if (experience.family === "dual-shape-color-cycle") return dualPatternVisual(beat.phase, experience.model);
  if (experience.family === "four-number-promise") return numberPromiseVisual(beat.phase, experience.model);
  if (experience.family === "six-bundle-equation") return sixBundleVisual(beat.phase, experience.model);
  if (experience.family === "multiple-direction") return multipleDirectionVisual(beat.phase, experience.model);
  if (experience.family === "vertical-cryptarithm-carry") return verticalCryptarithmVisual(beat.phase, experience.model);
  if (experience.family === "magic-line-target") return magicLineTargetVisual(beat.phase, experience.model);
  if (experience.family === "mirror-direction") return mirrorDirectionVisual(beat.phase, experience.model);
  if (experience.family === "digital-transform") return digitalTransformVisual(beat.phase, experience.model);
  if (experience.family === "sum-grid-placement") return sumGridPlacementVisual(beat.phase, experience.model);
  if (experience.family === "number-condition-filter") return numberConditionFilterVisual(beat.phase, experience.model);
  if (experience.family === "relative-order") return relativeOrderVisual(beat.phase, experience.model);
  if (experience.family === "equalize-transfer") return equalizeTransferVisual(beat.phase, experience.model);
  return "";
}

function guidedPrintPhase(beat, index, total) {
  const phase = String(beat?.phase || "").toLowerCase();
  if (["problem", "given", "organize", "calculate", "verify"].includes(phase)) return phase;
  if (index === 0) return "given";
  if (index === total - 1) return "verify";
  return total >= 4 && index === total - 2 ? "calculate" : "organize";
}

export function guidedConceptPrintSummary(experience) {
  if (SEQUENCED_PRINT_FAMILIES.has(experience.family)) {
    const phaseLabels = { problem: "문제 보기", given: "주어진 조건", organize: "구조 정리", calculate: "계산·추론", verify: "검산" };
    const total = experience.beats.length;
    const frames = experience.beats.map((beat, index) => {
      const phase = guidedPrintPhase(beat, index, total);
      return `<section class="guided-print-step" data-print-phase="${phase}"><header><span>${index + 1}</span><strong>${phaseLabels[phase]}</strong></header>${guidedConceptVisual(experience, index)}<p>${bookNineEscape(beat.caption)}</p></section>`;
    }).join("");
    return `<div class="gold-print-experience guided-print-summary is-sequenced" data-print-guided-family="${bookNineEscape(experience.family)}"><h2>개념을 ${total}단계로 확인해요</h2><div class="guided-print-step-grid">${frames}</div></div>`;
  }
  return `<div class="gold-print-experience guided-print-summary"><p><strong>개념 순서</strong> ${experience.beats.map((beat) => beat.caption).join(" → ")}</p>${guidedConceptVisual(experience, experience.beats.length - 1)}</div>`;
}
