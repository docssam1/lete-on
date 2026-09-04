import { GENERATORS } from "./generators.js?v=20260827e";

const GENERATOR_BY_LESSON = Object.freeze({
  "addition-matrix": "shapeSumTable",
  "balance-order": "balanceOrderChain",
  "dual-shape-color-pattern": "repeatingSymbolSequence",
  "diamond-number-promise": "fourNumberCenterRule",
  "basic-vertical-cryptarithm": "cryptarithmSingleDouble",
  "magic-square-targets": "magicSquareThreeTarget",
  "polyomino-family-count": "tetrominoFamilyChoice",
  "balance-substitution": "balanceUnitRatio",
  "cardinal-placement": "directionalSeatPlacement",
  "path-number-grid": "sequentialPathNumberGrid",
  "digit-card-ranked-number": "digitCardRankedNumber",
  "checkerboard-product-matrix": "multiplicationMatrixPlacement",
  "number-line-unit-distance": "numberLineUnitDistanceBook6",
  "inclusive-range-count": "inclusiveRangeCount",
  "elapsed-time": "elapsedTimeAnalogBook7",
  "shared-polygon-matchsticks": "sharedPolygonMatchsticksBook7",
  "closed-loop-planting": "closedPerimeterFromSpacingCount",
  "venn-overlap-all": "vennOverlapAll",
  "addition-sum-matrix": "additionMatrixCompleteBook8",
  "vertical-shape-cryptarithm": "repeatedSymbolCryptarithmBook8",
  "equalize-transfer": "equalizeTransferBook8",
  "reverse-operation-chain": "reverseArithmeticChainBook8",
  "catch-up-acorns": "catchUpGrowingAmountBook10",
  "number-baseball-secret": "numberBaseballBook10"
});

const CUSTOM_PRACTICE = Object.freeze({
  "clock-turning": {
    story: "놀이 시계의 바늘이 7에서 출발합니다.",
    prompt: "7을 가리키는 바늘을 시계 방향으로 반 바퀴 돌리면 어디를 가리킬까요?",
    visual: { kind: "clock", value: 7 },
    answerMode: "input", inputMode: "numeric", answer: "1",
    explanation: "반 바퀴는 시계판의 맞은편으로 갑니다. 7의 맞은편은 1입니다."
  },
  "fold-one-cut": {
    story: "종이를 반으로 한 번 접고 별 모양 구멍을 두 개 뚫었습니다.",
    prompt: "종이를 완전히 펼치면 별 모양 구멍은 모두 몇 개일까요?",
    visual: { kind: "fold-star" },
    answerMode: "input", inputMode: "numeric", answer: "4",
    explanation: "한 번 접은 종이는 두 겹입니다. 구멍 두 개가 각각 두 겹에 생기므로 펼치면 2×2=4개입니다."
  },
  "equal-line-sums": {
    story: "가로줄과 세로줄의 세 수 합을 같게 만듭니다.",
    prompt: "위쪽 빈칸에 들어갈 수를 쓰세요.",
    visual: { kind: "equal-line", top: null, left: 8, center: 3, right: 4, bottom: 5 },
    answerMode: "input", inputMode: "numeric", answer: "7",
    explanation: "가로줄의 합은 8+3+4=15입니다. 세로줄도 15이므로 빈칸+3+5=15, 빈칸은 7입니다."
  },
  "preference-logic": {
    story: "민지, 서윤, 도윤이 서로 다른 음식을 하나씩 골랐습니다.",
    prompt: "민지는 김밥을 골랐고 도윤은 떡볶이를 고르지 않았습니다. 서윤이 고른 음식은 무엇일까요?",
    visual: { kind: "logic-food" },
    answerMode: "input", answer: "떡볶이",
    explanation: "민지가 김밥을 골랐습니다. 도윤은 떡볶이가 아니므로 샌드위치이고, 서윤에게는 떡볶이가 남습니다."
  },
  "six-multiple-equations": {
    story: "같은 수의 묶음으로 식을 바꿉니다.",
    prompt: "7×18+21=7×□일 때 빈칸에 알맞은 수를 쓰세요.",
    visual: { kind: "practice-expression", expression: "7 × 18 + 21 = 7 × □" },
    answerMode: "input", inputMode: "numeric", answer: "21",
    explanation: "21은 7이 3묶음입니다. 7×18+7×3=7×(18+3)이므로 빈칸은 21입니다."
  },
  "multiple-comparison": {
    story: "구슬 54개를 6개씩 같은 묶음으로 나눕니다.",
    prompt: "54는 6의 몇 배인지 쓰세요.",
    visual: { kind: "practice-groups", total: 54, unit: 6, groups: 9 },
    answerMode: "input", inputMode: "numeric", answer: "9",
    explanation: "54 안에 6이 9번 들어갑니다. 6×9=54이므로 54는 6의 9배입니다."
  },
  "hidden-cube-count": {
    story: "블록 창고의 쌓기나무는 모두 14개이고 밖에서 9개가 보입니다.",
    prompt: "보이지 않는 쌓기나무는 몇 개일까요?",
    visual: { kind: "book04-hidden-cubes-story", scenes: [{ map: [[3, 3, 2], [2, 2, 1], [1, 0, 0]] }] },
    answerMode: "input", inputMode: "numeric", answer: "5",
    explanation: "전체 14개에서 보이는 9개를 빼면 보이지 않는 쌓기나무는 14-9=5개입니다."
  },
  "cube-tetrahedral-growth": {
    story: "삼각 계단 모양의 블록 무대가 6단계까지 자랐습니다.",
    prompt: "6단계 무대에 필요한 쌓기나무는 모두 몇 개일까요?",
    visual: { kind: "book5", subtype: "tetrahedral-stair", previewStages: [1, 2, 3, 4, 5, 6], targetStages: [6] },
    answerMode: "input", inputMode: "numeric", answer: "56",
    explanation: "층마다 1, 3, 6, 10, 15, 21개가 필요합니다. 모두 더하면 56개입니다."
  },
  "rectangle-missing-side": {
    story: "둘레가 96cm인 직사각형 게시판의 한 변은 18cm입니다.",
    prompt: "다른 한 변은 몇 cm일까요?",
    visual: { kind: "book6", subtype: "rectangle", widthLabel: "18cm", heightLabel: "?", perimeterLabel: "96cm" },
    answerMode: "input", inputMode: "numeric", answer: "30",
    explanation: "가로와 세로의 합은 96÷2=48cm입니다. 48-18=30이므로 다른 한 변은 30cm입니다."
  },
  "number-and-digit-count": {
    story: "번호표에 1번부터 42번까지 빠짐없이 적었습니다.",
    prompt: "번호를 쓰는 데 숫자를 모두 몇 개 썼을까요?",
    visual: { kind: "book6", subtype: "range-count", start: 1, end: 42, mode: "digits" },
    answerMode: "input", inputMode: "numeric", answer: "75",
    explanation: "1부터 9까지 9개, 10부터 42까지 33×2=66개를 씁니다. 9+66=75개입니다."
  },
  "unit-area-and-half": {
    story: "가로 5칸, 세로 6칸인 모눈 직사각형을 대각선으로 반 나눴습니다.",
    prompt: "한쪽 삼각형의 넓이를 쓰세요.",
    visual: { kind: "book9", subtype: "area-grid", gridWidth: 5, gridHeight: 6, points: [[0, 0], [5, 0], [0, 6]] },
    answerMode: "input", inputMode: "numeric", answer: "15",
    explanation: "직사각형의 넓이는 5×6=30입니다. 대각선으로 반 나누었으므로 30÷2=15입니다."
  },
  "cube-map-total": {
    story: "네 자리의 쌓기나무 높이가 차례로 4층, 2층, 3층, 1층입니다.",
    prompt: "쌓기나무는 모두 몇 개인지 쓰세요.",
    visual: { kind: "book9", subtype: "cube-solid-views", map: [[4, 3], [3, 2]] },
    answerMode: "input", inputMode: "numeric", answer: "12",
    explanation: "위에서 본 각 자리의 층수를 모두 더합니다. 4+3+3+2=12개입니다."
  },
  "magic-square-missing": {
    story: "3×3 숫자판에서 어느 줄의 합도 18입니다.",
    prompt: "빈칸에 들어갈 수를 쓰세요.",
    visual: { kind: "book9", subtype: "magic-grid", size: 3, shown: [9, 2, 7, 4, 6, 8, 5, "□", 3], lineSum: 18 },
    answerMode: "input", inputMode: "numeric", answer: "10",
    explanation: "아래 가로줄의 합도 18입니다. 18-5-3=10이므로 빈칸은 10입니다."
  },
  "consecutive-sum-pairing": {
    story: "계단에 1번부터 24번까지 번호가 붙어 있습니다.",
    prompt: "모든 계단 번호의 합을 쓰세요.",
    visual: { kind: "book9", subtype: "consecutive-sum", from: 1, to: 24 },
    answerMode: "input", inputMode: "numeric", answer: "300",
    explanation: "1+24=25인 짝이 12개입니다. 25×12=300입니다."
  },
  "consecutive-page-range": {
    story: "연속된 7개의 보관함 번호를 더했더니 140이었습니다.",
    prompt: "가장 처음 보관함 번호를 쓰세요.",
    visual: { kind: "book10", subtype: "page-strip", count: 7, total: 140 },
    answerMode: "input", inputMode: "numeric", answer: "17",
    explanation: "140÷7=20이 가운데 번호입니다. 17, 18, 19, 20, 21, 22, 23이므로 처음 번호는 17입니다."
  },
  "digit-card-four-place": {
    story: "1, 3, 6, 8 카드 네 장을 한 번씩 사용해 네 자리 수를 만듭니다.",
    prompt: "만들 수 있는 네 자리 수는 모두 몇 개인지 쓰세요.",
    visual: { kind: "book10", subtype: "digit-slots", digits: [1, 3, 6, 8], length: 4 },
    answerMode: "input", inputMode: "numeric", answer: "24",
    explanation: "첫 자리부터 놓을 카드는 4장, 3장, 2장, 1장입니다. 4×3×2×1=24개입니다."
  }
});

function hashSeed(text) {
  let value = 2166136261;
  for (const character of text) {
    value ^= character.codePointAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function withSeed(seed, make) {
  const originalRandom = Math.random;
  let value = seed || 1;
  Math.random = () => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    return value / 4294967296;
  };
  try { return make(); }
  finally { Math.random = originalRandom; }
}

function answerAliases(answer) {
  const raw = String(answer ?? "").trim();
  const aliases = new Set([raw]);
  const numericWithUnit = raw.match(/^(-?\d+(?:\.\d+)?)(?:개|명|장|m|cm|일|번)(?:\s*뒤)?$/u)?.[1];
  if (numericWithUnit) aliases.add(numericWithUnit);
  const numbered = raw.match(/^(\d+)번$/u)?.[1];
  if (numbered) aliases.add(numbered);
  return [...aliases];
}

function comparableAnswer(answer) {
  const raw = String(Array.isArray(answer) ? answer[0] : answer).replace(/\s+/gu, "");
  return raw.match(/^(-?\d+(?:\.\d+)?)(?:개|명|장|m|cm|일|번)(?:뒤)?$/u)?.[1] || raw;
}

function generatedPractice(lesson) {
  const generatorName = GENERATOR_BY_LESSON[lesson.id];
  const generator = GENERATORS[generatorName];
  if (!generator) throw new Error(`Golden Bell similar-practice generator is missing: ${lesson.id}/${generatorName}`);
  let made;
  for (let attempt = 0; attempt < 24; attempt += 1) {
    made = withSeed(hashSeed(`golden-bell:${lesson.id}:similar-02:${attempt}`), () => generator({ difficulty: 1, max: 30 }));
    const madeAnswer = comparableAnswer(made.answer);
    const sourceAnswer = comparableAnswer(lesson.extension.answer);
    if (madeAnswer !== sourceAnswer && made.prompt !== lesson.extension.prompt) break;
  }
  return {
    id: `${lesson.id}:extension:2`,
    title: "유사문제",
    story: "같은 생각 방법을 새 문제에 적용해 봅니다.",
    prompt: made.prompt,
    visual: made.visual,
    answerMode: "input",
    inputMode: /^-?\d/u.test(String(made.answer ?? "")) ? "numeric" : "text",
    answer: answerAliases(made.answer),
    explanation: made.solution,
    structureKey: lesson.extension.structureKey,
    generatorId: generatorName,
    estimatedMinutes: 4
  };
}

export function attachGoldenBellSimilarPractice(books) {
  for (const book of books) {
    for (const lesson of book.lessons || []) {
      const custom = CUSTOM_PRACTICE[lesson.id];
      const practice = custom
        ? { ...custom, id: `${lesson.id}:extension:2`, title: "유사문제", structureKey: lesson.extension.structureKey, estimatedMinutes: 4 }
        : generatedPractice(lesson);
      lesson.similarPractice = Object.freeze([Object.freeze(practice)]);
    }
    book.dailyPractice = Object.freeze({ problemCount: book.lessons.length * 2, estimatedMinutes: 30 });
  }
  return books;
}

export const GOLDEN_BELL_SIMILAR_GENERATOR_MAP = GENERATOR_BY_LESSON;
export const GOLDEN_BELL_CUSTOM_PRACTICE = CUSTOM_PRACTICE;
