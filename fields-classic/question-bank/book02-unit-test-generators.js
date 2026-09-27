const SOURCE_QUESTIONS = new Set([1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25]);

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sample(list) {
  return list[randomInt(0, list.length - 1)];
}

function shuffled(list) {
  const result = [...list];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function distinctValues(difficulty, count) {
  const bounds = difficulty === 1 ? [1, 7] : difficulty === 3 ? [3, 12] : [2, 9];
  return shuffled(Array.from({ length: bounds[1] - bounds[0] + 1 }, (_, index) => bounds[0] + index)).slice(0, count);
}

function sourceMeta(sourceNumber, sourceLayout, detail = {}) {
  return { sourceNumber, sourceLayout, ...detail };
}

function matrixProblem01(difficulty) {
  const [diamond, square, triangle, circle] = distinctValues(difficulty, 4);
  const cells = [
    ["diamond", "square", "triangle"],
    ["square", "square", "diamond"],
    ["triangle", "square", "circle"]
  ];
  const rowSums = [diamond + square + triangle, square * 2 + diamond, triangle + square + circle];
  const columnSums = [diamond + square + triangle, square * 3, null];
  const answer = triangle + diamond + circle;
  return {
    prompt: "같은 모양은 같은 수를 나타냅니다. 가로줄과 세로줄의 합을 이용하여 마지막 세로줄의 합을 구하세요.",
    visual: { kind: "book2", subtype: "matrix", cells, rowSums, columnSums },
    answer: String(answer),
    solution: `가운데 세로줄에는 네모가 3개 있으므로 네모는 ${columnSums[1]} ÷ 3 = ${square}입니다. 둘째 가로줄에서 마름모는 ${rowSums[1]} - ${square} - ${square} = ${diamond}, 첫째 가로줄에서 세모는 ${rowSums[0]} - ${diamond} - ${square} = ${triangle}, 셋째 가로줄에서 동그라미는 ${rowSums[2]} - ${triangle} - ${square} = ${circle}입니다. 마지막 세로줄은 ${triangle} + ${diamond} + ${circle} = ${answer}입니다.`,
    meta: sourceMeta(1, "shape-matrix-3x3-last-column", { shapeValues: { diamond, square, triangle, circle }, rowSums, columnSums, targetAxis: "column", targetIndex: 2 })
  };
}

function matrixProblem02(difficulty) {
  const [circle, diamond, square, triangle] = distinctValues(difficulty, 4);
  const cells = [
    ["circle", "circle", "triangle", "diamond"],
    ["diamond", "circle", "square", "square"],
    ["circle", "circle", "circle", "square"],
    ["diamond", "circle", "circle", "square"]
  ];
  const rowSums = [null, diamond + circle + square * 2, circle * 3 + square, diamond + circle * 2 + square];
  const columnSums = [circle * 2 + diamond * 2, circle * 4, triangle + square + circle * 2, diamond + square * 3];
  const answer = circle * 2 + triangle + diamond;
  return {
    prompt: "같은 모양은 같은 수를 나타냅니다. 가로줄과 세로줄의 합을 이용하여 첫째 가로줄의 합을 구하세요.",
    visual: { kind: "book2", subtype: "matrix", cells, rowSums, columnSums },
    answer: String(answer),
    solution: `둘째 세로줄에는 동그라미가 4개 있으므로 동그라미는 ${columnSums[1]} ÷ 4 = ${circle}입니다. 셋째 가로줄에서 네모는 ${rowSums[2]} - ${circle} × 3 = ${square}, 넷째 가로줄에서 마름모는 ${rowSums[3]} - ${circle} × 2 - ${square} = ${diamond}, 셋째 세로줄에서 세모는 ${columnSums[2]} - ${square} - ${circle} × 2 = ${triangle}입니다. 첫째 가로줄은 ${circle} + ${circle} + ${triangle} + ${diamond} = ${answer}입니다.`,
    meta: sourceMeta(2, "shape-matrix-4x4-first-row", { shapeValues: { circle, square, diamond, triangle }, rowSums, columnSums, targetAxis: "row", targetIndex: 0 })
  };
}

function totalDifferenceProblem(number, difficulty) {
  const settings = number === 3
    ? { pairs: [["나경", "정인"], ["서윤", "도윤"], ["민서", "준호"]], item: "큐브", unit: "개", small: [4, 10], gap: [3, 7] }
    : { pairs: [["규민", "재윤"], ["하린", "도현"], ["서아", "민준"]], item: "학생", unit: "명", small: [18, 29], gap: [5, 11] };
  const [largerName, smallerName] = sample(settings.pairs);
  const smaller = randomInt(settings.small[0] + difficulty - 1, settings.small[1] + difficulty - 1);
  const gapCandidates = Array.from({ length: settings.gap[1] - settings.gap[0] + 1 }, (_, index) => settings.gap[0] + index).filter((value) => value % 2 === 1);
  const gap = sample(gapCandidates);
  const larger = smaller + gap;
  const total = larger + smaller;
  const prompt = number === 3
    ? `${total}개의 큐브가 있습니다. ${largerName}이가 ${smallerName}이보다 큐브를 ${gap}개 더 많이 가지려면 두 사람은 각각 몇 개의 큐브를 가져야 합니까?`
    : `${largerName}이네 반과 ${smallerName}이네 반 학생을 모두 합하면 ${total}명입니다. ${largerName}이네 반이 ${smallerName}이네 반보다 ${gap}명 많을 때 두 반의 학생 수를 각각 구하세요.`;
  return {
    prompt,
    responseKind: "list",
    answer: `${largerName} ${larger}${settings.unit}, ${smallerName} ${smaller}${settings.unit}`,
    solution: `두 수의 합은 ${total}, 차는 ${gap}입니다. 전체에서 차 ${gap}${settings.unit}를 먼저 빼면 ${total - gap}${settings.unit}이고, 이를 둘로 똑같이 나누면 작은 수는 ${smaller}${settings.unit}입니다. 큰 수는 ${smaller} + ${gap} = ${larger}${settings.unit}이며 ${larger} + ${smaller} = ${total}, ${larger} - ${smaller} = ${gap}으로 확인됩니다.`,
    meta: sourceMeta(number, "total-difference-two-targets", { largerName, smallerName, larger, smaller, total, gap, unit: settings.unit, item: settings.item })
  };
}

function equationProblem06() {
  const values = { square: 2, circle: 3, diamond: 4, cross: 5 };
  const lines = [
    ["square", "+", "square", "=", "diamond"],
    ["circle", "+", "circle", "=", "square", "+", "diamond"],
    ["square", "+", "circle", "=", "cross"]
  ];
  return {
    prompt: "2, 3, 4, 5는 서로 다른 모양을 나타냅니다. 십자 모양이 나타내는 수를 구하세요.",
    visual: { kind: "book2", subtype: "equation", lines, cards: [2, 3, 4, 5] },
    answer: String(values.cross),
    solution: `네모 두 개가 마름모이므로 2 + 2 = 4에서 네모는 2, 마름모는 4입니다. 남은 3과 5 중 동그라미 두 개는 3 + 3 = 6이고 네모와 마름모도 2 + 4 = 6이므로 동그라미는 3입니다. 십자는 2 + 3 = 5입니다.`,
    meta: sourceMeta(6, "distinct-shape-equations-values-2-5", { values, cards: [2, 3, 4, 5], target: "cross" })
  };
}

function balanceProblem(number) {
  const diamond = number === 7 ? sample([2, 4]) : sample([4, 8]);
  const circle = diamond * 2;
  const square = number === 7 ? (diamond + circle * 2) / 2 : (diamond + circle) / 2;
  const star = number === 7 ? diamond + square : (diamond + square) / 2;
  const scales = number === 7 ? [
    { left: ["filled-circle"], right: ["filled-diamond", "filled-diamond"] },
    { left: ["filled-square", "filled-square"], right: ["filled-diamond", "filled-circle", "filled-circle"] },
    { left: ["filled-diamond", "filled-square"], right: ["filled-star"] }
  ] : [
    { left: ["filled-circle"], right: ["filled-diamond", "filled-diamond"] },
    { left: ["filled-square", "filled-square"], right: ["filled-diamond", "filled-circle"] },
    { left: ["filled-diamond", "filled-square"], right: ["filled-star", "filled-star"] }
  ];
  const solution = number === 7
    ? `마름모가 ${diamond}g이므로 동그라미는 ${diamond} × 2 = ${circle}g입니다. 네모 두 개는 ${diamond} + ${circle} + ${circle} = ${diamond + circle * 2}g이므로 네모 한 개는 ${diamond + circle * 2} ÷ 2 = ${square}g입니다. 별은 ${diamond} + ${square} = ${star}g입니다.`
    : `마름모가 ${diamond}g이므로 동그라미는 ${diamond} × 2 = ${circle}g입니다. 네모 두 개는 ${diamond} + ${circle} = ${diamond + circle}g이므로 네모 한 개는 ${square}g입니다. 별 두 개는 ${diamond} + ${square} = ${diamond + square}g이므로 별 한 개는 ${diamond + square} ÷ 2 = ${star}g입니다.`;
  return {
    prompt: `모든 저울은 수평입니다. 마름모 한 개의 무게가 ${diamond}g일 때 별 한 개의 무게를 구하세요.`,
    visual: { kind: "book2", subtype: "balance", scales, note: `◆ 한 개는 ${diamond}g` },
    answer: `${star}g`,
    solution,
    meta: sourceMeta(number, number === 7 ? "balance-substitute-divide-add" : "balance-substitute-divide-add-divide", { weights: { diamond, circle, square, star }, scales })
  };
}

function equationProblem08() {
  const values = { diamond: 4, square: 3, triangle: 5, circle: 2 };
  const lines = [
    ["diamond", "+", "diamond", "+", "diamond", "=", "square", "+", "square", "+", "square", "+", "square"],
    ["diamond", "+", "diamond", "=", "triangle", "+", "square"],
    ["triangle", "+", "circle", "=", "diamond", "+", "square"]
  ];
  return {
    prompt: "2, 3, 4, 5는 서로 다른 모양을 나타냅니다. 동그라미가 나타내는 수를 구하세요.",
    visual: { kind: "book2", subtype: "equation", lines, cards: [2, 3, 4, 5] },
    answer: String(values.circle),
    solution: `마름모 3개와 네모 4개의 수가 같아야 하므로 4 × 3 = 3 × 4에서 마름모는 4, 네모는 3입니다. 마름모 두 개는 8이므로 세모는 8 - 3 = 5입니다. 마지막 식에서 동그라미는 4 + 3 - 5 = 2입니다.`,
    meta: sourceMeta(8, "distinct-shape-equations-values-2-5", { values, cards: [2, 3, 4, 5], target: "circle" })
  };
}

function repeatingProblem10() {
  const patterns = [["circle", "triangle", "square"], ["circle", "diamond", "diamond", "circle"]];
  const extraCounts = [3, 1];
  const parts = patterns.map((pattern, index) => {
    const shown = Array.from({ length: pattern.length * 2 + extraCounts[index] }, (_, position) => pattern[position % pattern.length]);
    const answer = pattern[shown.length % pattern.length];
    return { visual: { kind: "book2", subtype: "sequence", values: [...shown, null], showOrdinals: false }, answer };
  });
  return {
    prompt: "반복되는 모양의 규칙을 찾아 빈칸에 알맞은 모양을 그리세요.",
    parts,
    responseKind: "drawing",
    answer: `(1) ○, (2) ◇`,
    answerVisuals: parts.map((part) => ({ kind: "book2", subtype: "sequence", values: [part.answer], showOrdinals: false })),
    solution: `⑴ 한 반복마디는 ○, △, □이고 세 묶음이 이어졌으므로 다음은 ○입니다. ⑵ 한 반복마디는 ○, ◇, ◇, ○이고 두 묶음 뒤에 ○가 더 있으므로 다음은 ◇입니다.`,
    meta: sourceMeta(10, "repeating-symbol-two-subproblems", { patterns, shown: parts.map((part) => part.visual.values.slice(0, -1)), answers: parts.map((part) => part.answer) })
  };
}

function repeatingProblem11() {
  const shapeCycle = ["circle", "diamond", "star", "heart"];
  const shown = Array.from({ length: 13 }, (_, index) => {
    const shape = shapeCycle[index % shapeCycle.length];
    return (index - 1) % 3 === 0 ? `filled-${shape}` : shape;
  });
  const answer = "filled-diamond";
  return {
    prompt: "모양과 채움의 반복 규칙을 함께 살펴보고 다음 모양을 그리세요.",
    visual: { kind: "book2", subtype: "sequence", values: [...shown, null], showOrdinals: false },
    responseKind: "drawing",
    answer: "◆",
    answerVisual: { kind: "book2", subtype: "sequence", values: [answer], showOrdinals: false },
    solution: `모양은 ○, ◇, ☆, ♡가 네 칸마다 반복되고, 채운 모양은 2번째부터 세 칸마다 나옵니다. 빈칸은 14번째이므로 모양은 마름모이고 채우는 차례여서 ◆입니다.`,
    meta: sourceMeta(11, "repeating-symbol-shape-and-fill", { shapeCycle, filledPositions: [2, 5, 8, 11, 14], shown, targetIndex: 14, answerToken: answer })
  };
}

function sequenceProblem12(difficulty) {
  const firstStart = randomInt(12 + difficulty, 16 + difficulty);
  const secondStart = randomInt(6 + difficulty - 2, 8 + difficulty - 2);
  const firstValues = [firstStart, firstStart - 1, firstStart - 2, firstStart + 4, firstStart + 3, firstStart + 2, firstStart + 8, firstStart + 7, firstStart + 6, null];
  const secondValues = [secondStart, secondStart - 2, secondStart - 4, secondStart + 1, secondStart - 1, secondStart - 3, secondStart + 2, secondStart, secondStart - 2, secondStart + 3, null, secondStart - 1];
  const firstAnswer = firstStart + 12;
  const secondAnswer = secondStart + 1;
  const parts = [
    { visual: { kind: "book2", subtype: "sequence", values: firstValues, showOrdinals: false } },
    { visual: { kind: "book2", subtype: "sequence", values: secondValues, showOrdinals: false } }
  ];
  return {
    prompt: "각 수열의 규칙을 찾아 빈칸에 알맞은 수를 쓰세요.",
    parts,
    responseKind: "list",
    answer: `(1) ${firstAnswer}, (2) ${secondAnswer}`,
    solution: `⑴ 세 수씩 ${firstStart}, ${firstStart - 1}, ${firstStart - 2}처럼 1씩 작아지고, 다음 묶음의 첫 수는 4씩 커집니다. 네 번째 묶음의 첫 수는 ${firstAnswer}입니다. ⑵ 세 수씩 2씩 작아지고 다음 묶음의 첫 수는 1씩 커지므로 마지막 묶음은 ${secondStart + 3}, ${secondAnswer}, ${secondStart - 1}입니다.`,
    meta: sourceMeta(12, "two-independent-sequences", { rows: [{ values: firstValues, answer: firstAnswer, blankIndex: 9 }, { values: secondValues, answer: secondAnswer, blankIndex: 10 }] })
  };
}

function houseGrowthProblem() {
  const target = 7;
  const answer = 5 + (target - 1) * 4;
  return {
    prompt: `성냥개비로 같은 크기의 집을 한 변씩 이어 붙입니다. ${target}번째 모양에 필요한 성냥개비는 몇 개입니까?`,
    visual: { kind: "book2", subtype: "house-growth", stages: [1, 2, 3], target },
    answer: `${answer}개`,
    solution: `첫 집에는 5개가 필요합니다. 집을 하나 더 붙일 때마다 맞닿은 변 1개를 함께 쓰므로 성냥개비는 4개씩 늘어납니다. ${target}번째는 5 + 4 × ${target - 1} = ${answer}개입니다.`,
    meta: sourceMeta(13, "shared-side-house-growth-stage-7", { target, first: 5, increase: 4, answer })
  };
}

function triangleGrowthProblem() {
  const target = 8;
  const white = target * (target + 1) / 2;
  const dark = target * (target - 1) / 2;
  const answer = white - dark;
  return {
    prompt: `규칙에 따라 삼각형을 늘려 갑니다. ${target}번째 모양에서 흰 삼각형은 검은 삼각형보다 몇 개 더 많습니까?`,
    visual: { kind: "book2", subtype: "triangle-growth", stages: [1, 2, 3, 4], target },
    answer: `${answer}개`,
    solution: `${target}번째 모양의 흰 삼각형은 1 + 2 + ⋯ + ${target} = ${white}개이고, 검은 삼각형은 1 + 2 + ⋯ + ${target - 1} = ${dark}개입니다. 따라서 ${white} - ${dark} = ${answer}개 더 많습니다.`,
    meta: sourceMeta(14, "black-white-triangle-growth-stage-8", { target, white, dark, answer })
  };
}

function reverseFoldProblem(difficulty) {
  const folds = difficulty === 1 ? 5 : difficulty === 3 ? 7 : 6;
  const pieces = 2 ** folds;
  return {
    prompt: `색종이를 계속 반으로 접고 접힌 선대로 모두 잘랐더니 ${pieces}조각이 되었습니다. 색종이를 몇 번 접었습니까?`,
    visual: { kind: "book2", subtype: "fold-growth", stages: [1, 2, 3], pieces },
    answer: `${folds}번`,
    solution: `한 번 접을 때마다 겹친 수가 2배가 되므로 자른 조각 수는 2, 4, 8, 16, …으로 늘어납니다. 2를 ${folds}번 곱한 수가 ${pieces}이므로 ${folds}번 접었습니다.`,
    meta: sourceMeta(15, "pieces-to-fold-count-reverse", { folds, pieces })
  };
}

function rowRuleProblem16() {
  const examples = Array.from({ length: 3 }, () => {
    const left = randomInt(5, 29);
    const right = randomInt(4, 24);
    return [left, left + right, right];
  });
  let left;
  let right;
  let sum;
  do {
    left = randomInt(25, 48);
    right = randomInt(24, 46);
    sum = left + right;
  } while (sum < 60 || sum > 89 || sum % 10 === 0);
  const tens = Math.floor(sum / 10);
  const answer = sum % 10;
  const visibleRows = [...examples, [left, `${tens}?`, right]];
  return {
    prompt: "수 표의 규칙을 찾아 색칠한 칸에 알맞은 숫자를 써넣으세요.",
    visual: { kind: "book2", subtype: "number-rule", mode: "table", rows: visibleRows, target: { row: 3, column: 1 } },
    answer: String(answer),
    answerVisual: { kind: "book2", subtype: "number-rule", mode: "table", rows: [...examples, [left, sum, right]] },
    solution: `각 줄에서 가운데 수는 양쪽 수의 합입니다. 마지막 줄은 ${left} + ${right} = ${sum}이므로 ${tens}□의 빈칸에는 ${answer}이 들어갑니다.`,
    meta: sourceMeta(16, "four-by-three-row-sum-rule", { rows: [...examples, [left, sum, right]], answer, target: { row: 3, column: 1, tens } })
  };
}

function rowRuleProblem17() {
  const makeRow = () => {
    const second = randomInt(1, 7);
    const third = randomInt(2, 9);
    const first = randomInt(second + 1, 12);
    return [first, second, third, first - second + third];
  };
  const target = makeRow();
  const rows = [[target[0], target[1], target[2], null], makeRow(), makeRow(), makeRow()];
  return {
    prompt: "각 줄에 같은 계산 규칙이 있습니다. 빈칸에 알맞은 수를 써넣으세요.",
    visual: { kind: "book2", subtype: "number-rule", mode: "equation", rows, operators: ["−", "+", "="] },
    answer: String(target[3]),
    answerVisual: { kind: "book2", subtype: "number-rule", mode: "equation", rows: [target, ...rows.slice(1)], operators: ["−", "+", "="] },
    solution: `각 줄은 첫째 수에서 둘째 수를 빼고 셋째 수를 더하면 넷째 수가 됩니다. 첫 줄은 ${target[0]} - ${target[1]} + ${target[2]} = ${target[3]}이므로 빈칸은 ${target[3]}입니다.`,
    meta: sourceMeta(17, "four-row-minus-middle-fixed-rule", { rows: [target, ...rows.slice(1)], targetRow: 0, answer: target[3] })
  };
}

function triangleCenterProblem() {
  const makeItem = (missing = false) => {
    const top = randomInt(2, 8);
    const left = randomInt(4, 10);
    const center = randomInt(4, 10);
    return { top, left, center: missing ? null : center, right: top + left + center, answer: center };
  };
  const items = [makeItem(), makeItem(), makeItem(), makeItem(true)];
  const target = items.at(-1);
  return {
    prompt: "삼각형에 놓인 수의 규칙을 찾아 빈칸에 알맞은 수를 써넣으세요.",
    visual: { kind: "book2", subtype: "promise-set", layout: "triangle", items },
    answer: String(target.answer),
    answerVisual: { kind: "book2", subtype: "promise-set", layout: "triangle", items: [...items.slice(0, -1), { ...target, center: target.answer }] },
    solution: `각 삼각형은 위 수와 왼쪽 수와 가운데 수를 더하면 오른쪽 수가 됩니다. 마지막 삼각형의 가운데 수는 ${target.right} - ${target.top} - ${target.left} = ${target.answer}입니다.`,
    meta: sourceMeta(18, "triangle-center-rule", { items: items.map((item) => ({ ...item, center: item.answer })), targetIndex: 3, answer: target.answer })
  };
}

function permuteDigits(grid, size) {
  const digits = shuffled(Array.from({ length: size }, (_, index) => index + 1));
  return grid.map((value) => digits[value - 1]);
}

function sudokuProblem(number) {
  if (number === 19) {
    const base = [3, 1, 2, 2, 3, 1, 1, 2, 3];
    const solution = permuteDigits(base, 3);
    const clueIndices = [0, 5];
    const cells = solution.map((value, index) => clueIndices.includes(index) ? value : null);
    const regionMap = [0, 0, 1, 0, 1, 1, 2, 2, 2];
    return {
      prompt: "가로줄, 세로줄, 굵은 영역마다 1, 2, 3이 한 번씩 들어가도록 모든 빈칸을 채우세요.",
      visual: { kind: "book2", subtype: "sudoku", size: 3, cells, regionMap },
      responseKind: "visual-fill",
      answer: `${solution.slice(0, 3).join(" ")} / ${solution.slice(3, 6).join(" ")} / ${solution.slice(6).join(" ")}`,
      answerVisual: { kind: "book2", subtype: "sudoku", size: 3, cells: solution, regionMap },
      solution: `각 행과 열에서 빠진 수를 찾고, 같은 굵은 영역에 이미 있는 수를 제외합니다. 완성한 세 줄은 ${solution.slice(0, 3).join(", ")} / ${solution.slice(3, 6).join(", ")} / ${solution.slice(6).join(", ")}이며 각 행·열·영역에 1, 2, 3이 한 번씩 있습니다.`,
      meta: sourceMeta(19, "three-by-three-irregular-region-fill-all", { size: 3, solution, cells, clueIndices, regionMap })
    };
  }
  const base = [1, 3, 4, 2, 3, 1, 2, 4, 2, 4, 1, 3, 4, 2, 3, 1];
  const solution = permuteDigits(base, 4);
  const clueIndices = [1, 3, 4, 10, 12];
  const cells = solution.map((value, index) => clueIndices.includes(index) ? value : null);
  const regionMap = [0, 0, 0, 1, 2, 2, 0, 1, 2, 3, 1, 1, 2, 3, 3, 3];
  return {
    prompt: "가로줄, 세로줄, 굵은 영역마다 1, 2, 3, 4가 한 번씩 들어가도록 모든 빈칸을 채우세요.",
    visual: { kind: "book2", subtype: "sudoku", size: 4, cells, regionMap },
    responseKind: "visual-fill",
    answer: Array.from({ length: 4 }, (_, row) => solution.slice(row * 4, row * 4 + 4).join(" ")).join(" / "),
    answerVisual: { kind: "book2", subtype: "sudoku", size: 4, cells: solution, regionMap },
    solution: `각 행과 열에서 빠진 수를 찾은 뒤, 같은 굵은 영역에 이미 있는 수를 제외합니다. 완성한 표는 ${Array.from({ length: 4 }, (_, row) => solution.slice(row * 4, row * 4 + 4).join(", ")).join(" / ")}이며 모든 행·열·영역에 1부터 4까지가 한 번씩 있습니다.`,
    meta: sourceMeta(20, "four-by-four-irregular-region-fill-all", { size: 4, solution, cells, clueIndices, regionMap })
  };
}

function diamondCenterProblem() {
  const makeItem = (missing = false) => {
    const top = randomInt(2, 9);
    const left = randomInt(2, 8);
    const right = randomInt(1, 7);
    const bottom = randomInt(2, 9);
    const center = left + right + bottom - top;
    if (center < 1 || center > 15) return makeItem(missing);
    return { top, left, right, bottom, center: missing ? null : center, answer: center };
  };
  const items = [makeItem(), makeItem(), makeItem(), makeItem(true)];
  const target = items.at(-1);
  return {
    prompt: "네 수 사이의 규칙을 찾아 마지막 마름모의 가운데에 알맞은 수를 써넣으세요.",
    visual: { kind: "book2", subtype: "promise-set", layout: "diamond", items },
    answer: String(target.answer),
    answerVisual: { kind: "book2", subtype: "promise-set", layout: "diamond", items: [...items.slice(0, -1), { ...target, center: target.answer }] },
    solution: `각 마름모는 위 수와 가운데 수의 합이 왼쪽·오른쪽·아래 수의 합과 같습니다. 마지막 가운데 수는 ${target.left} + ${target.right} + ${target.bottom} - ${target.top} = ${target.answer}입니다.`,
    meta: sourceMeta(21, "diamond-center-fixed-rule", { items: items.map((item) => ({ ...item, center: item.answer })), targetIndex: 3, answer: target.answer })
  };
}

function matrixProblem22(difficulty) {
  const [square, circle, cross, diamond, triangle] = distinctValues(difficulty, 5);
  const cells = [
    ["square", "circle", "circle", "square"],
    ["cross", "diamond", "triangle", "diamond"],
    ["circle", "circle", "square", "circle"]
  ];
  const rowSums = [square * 2 + circle * 2, null, square + circle * 3];
  const columnSums = [square + cross + circle, circle * 2 + diamond, circle + triangle + square, square + diamond + circle];
  const answer = cross + diamond * 2 + triangle;
  return {
    prompt: "같은 모양은 같은 수를 나타냅니다. 가로줄과 세로줄의 합을 이용하여 가운데 가로줄의 합을 구하세요.",
    visual: { kind: "book2", subtype: "matrix", cells, rowSums, columnSums },
    answer: String(answer),
    solution: `첫째와 셋째 가로줄을 비교하면 동그라미는 ${(rowSums[2] * 2) - rowSums[0]} ÷ 4 = ${circle}, 네모는 ${rowSums[2]} - ${circle} × 3 = ${square}입니다. 첫째 세로줄에서 십자는 ${columnSums[0]} - ${square} - ${circle} = ${cross}, 둘째 세로줄에서 마름모는 ${columnSums[1]} - ${circle} × 2 = ${diamond}, 셋째 세로줄에서 세모는 ${columnSums[2]} - ${circle} - ${square} = ${triangle}입니다. 가운데 가로줄은 ${cross} + ${diamond} + ${triangle} + ${diamond} = ${answer}입니다.`,
    meta: sourceMeta(22, "shape-matrix-3x4-second-row", { shapeValues: { square, circle, cross, diamond, triangle }, rowSums, columnSums, targetAxis: "row", targetIndex: 1 })
  };
}

function equationProblem23() {
  const values = { square: 3, diamond: 4, triangle: 5, circle: 6 };
  const lines = [
    ["diamond", "+", "diamond", "+", "diamond", "=", "square", "+", "square", "+", "square", "+", "square"],
    ["triangle", "+", "triangle", "+", "triangle", "=", "square", "+", "square", "+", "square", "+", "square", "+", "square"],
    ["diamond", "+", "triangle", "=", "square", "+", "circle"]
  ];
  return {
    prompt: "서로 다른 모양은 1부터 9까지의 서로 다른 수를 나타냅니다. 동그라미가 나타내는 수를 구하세요.",
    visual: { kind: "book2", subtype: "equation", lines },
    answer: String(values.circle),
    solution: `마름모 3개와 네모 4개의 값이 같고 세모 3개와 네모 5개의 값이 같습니다. 1부터 9까지의 서로 다른 수 중 두 식을 함께 만족하는 값은 네모 3, 마름모 4, 세모 5입니다. 마지막 식에서 동그라미는 4 + 5 - 3 = 6입니다.`,
    meta: sourceMeta(23, "four-distinct-shapes-three-relations-values-1-9", { values, range: [1, 9], target: "circle" })
  };
}

function stoneGrowthProblem() {
  const black = (stage) => stage * 3;
  const white = (stage) => (stage - 1) * (stage - 2) / 2;
  let target = 1;
  while (white(target) <= black(target)) target += 1;
  return {
    prompt: "같은 규칙으로 삼각형 바둑돌을 늘어놓습니다. 흰 돌의 수가 검은 돌의 수보다 처음 많아지는 것은 몇 번째입니까?",
    visual: { kind: "book2", subtype: "stone-growth", stages: [1, 2, 3, 4, 5, 6], target },
    answer: `${target}번째`,
    solution: `n번째의 검은 돌은 테두리에 3n개, 흰 돌은 안쪽에 (n-1)×(n-2)÷2개입니다. ${target - 1}번째는 흰 돌 ${white(target - 1)}개가 검은 돌 ${black(target - 1)}개보다 적고, ${target}번째는 흰 돌 ${white(target)}개가 검은 돌 ${black(target)}개보다 많습니다. 따라서 처음은 ${target}번째입니다.`,
    meta: sourceMeta(25, "first-stage-white-exceeds-black", { target, previous: { stage: target - 1, black: black(target - 1), white: white(target - 1) }, current: { stage: target, black: black(target), white: white(target) } })
  };
}

const SOURCE_GENERATORS = Object.freeze({
  1: matrixProblem01,
  2: matrixProblem02,
  3: (difficulty) => totalDifferenceProblem(3, difficulty),
  5: (difficulty) => totalDifferenceProblem(5, difficulty),
  6: equationProblem06,
  7: () => balanceProblem(7),
  8: equationProblem08,
  9: () => balanceProblem(9),
  10: repeatingProblem10,
  11: repeatingProblem11,
  12: sequenceProblem12,
  13: houseGrowthProblem,
  14: triangleGrowthProblem,
  15: reverseFoldProblem,
  16: rowRuleProblem16,
  17: rowRuleProblem17,
  18: triangleCenterProblem,
  19: () => sudokuProblem(19),
  20: () => sudokuProblem(20),
  21: diamondCenterProblem,
  22: matrixProblem22,
  23: equationProblem23,
  25: stoneGrowthProblem
});

export function book02UnitTestProblem({ difficulty = 2, sourceCase } = {}) {
  const number = Number(sourceCase?.number);
  if (sourceCase?.sourceKind !== "unit-test" || sourceCase?.sourceId !== "book-02" || !SOURCE_QUESTIONS.has(number)) return null;
  return SOURCE_GENERATORS[number](difficulty);
}

export function book02UnitTestShapeMatrix(options = {}) {
  const number = Number(options.sourceCase?.number);
  if (![1, 2, 22].includes(number)) return null;
  return book02UnitTestProblem(options);
}
