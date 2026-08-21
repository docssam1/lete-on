function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sample(list) {
  return list[randomInt(0, list.length - 1)];
}

function shuffle(list) {
  const result = [...list];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = randomInt(0, index);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function hasBatchim(value) {
  return [0, 1, 3, 6, 7, 8].includes(Math.abs(value) % 10);
}

function hasNameBatchim(value) {
  const last = [...String(value)].at(-1);
  const code = last?.charCodeAt(0) || 0;
  return code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
}

function subjectParticle(value) {
  return `${value}${hasNameBatchim(value) ? "은" : "는"}`;
}

function conjunctionParticle(value) {
  return hasNameBatchim(value) ? "과" : "와";
}

function objectParticle(value) {
  return `${value}${hasBatchim(value) ? "을" : "를"}`;
}

function g1BusTwoStops({ difficulty = 2 }) {
  const stopCount = difficulty === 1 ? 1 : difficulty === 2 ? 2 : 3;
  const start = randomInt(difficulty === 1 ? 12 : 14, difficulty === 3 ? 38 : 28);
  let current = start;
  const events = [];
  for (let index = 0; index < stopCount; index += 1) {
    const left = randomInt(2, Math.min(current - 2, difficulty === 3 ? 10 : 7));
    const boarded = randomInt(2, difficulty === 3 ? 11 : 8);
    events.push({ left, boarded });
    current = current - left + boarded;
  }
  return {
    prompt: `${start}명의 승객을 태우고 출발한 버스가 있습니다. 각 정류장에서 다음과 같이 내리고 탔다면, 지금 버스에 타고 있는 승객은 몇 명인지 구하세요.`,
    visual: { kind: "g1-bus-two-stops", start, events },
    answer: `${current}명`,
    solution: `처음 ${start}명에서 ${events.map(({ left, boarded }, index) => `${index + 1}번째 정류장의 ${left}명을 빼고 ${boarded}명을 더합니다`).join(", ")}. 따라서 ${current}명입니다.`,
    meta: { difficulty, start, events, answer: current }
  };
}

function g1HeightOrder({ difficulty = 2 }) {
  const count = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
  const names = shuffle(["윤아", "재아", "하연", "라희", "서준", "민서", "지우"]).slice(0, count);
  const ordered = shuffle(names);
  const conditions = [];
  for (let index = 0; index < ordered.length - 1; index += 1) {
    const shorter = ordered[index];
    const taller = ordered[index + 1];
    conditions.push(Math.random() < 0.5 ? `${subjectParticle(taller)} ${shorter}보다 큽니다.` : `${subjectParticle(shorter)} ${taller}보다 작습니다.`);
  }
  if (difficulty >= 2) conditions.push(`${ordered.at(-1)}는 ${ordered[0]}보다 큽니다.`);
  const targetRank = difficulty === 3 ? randomInt(2, count - 1) : 2;
  const answer = ordered[targetRank - 1];
  return {
    prompt: `다음은 ${names.join("·")}의 키를 비교한 것입니다. 키가 ${targetRank}번째로 작은 사람은 누구인지 구하세요.`,
    visual: { kind: "g1-condition-list", conditions: shuffle(conditions), title: "키 비교" },
    answer,
    solution: `조건을 작은 사람부터 차례로 놓으면 ${ordered.join(" < ")}입니다. 따라서 ${targetRank}번째로 작은 사람은 ${answer}입니다.`,
    meta: { difficulty, names, ordered, conditions, targetRank, answer }
  };
}

function g1TwoDigitOnesGreater({ difficulty = 2 }) {
  const candidates = [];
  for (let tens = 1; tens <= 8; tens += 1) {
    for (let ones = tens + 1; ones <= 9; ones += 1) {
      const gap = ones - tens;
      if (difficulty === 1 && gap > 3) continue;
      if (difficulty === 2 && gap < 3) continue;
      candidates.push({ tens, ones, gap, sum: tens + ones });
    }
  }
  const { tens, ones, gap, sum } = sample(candidates);
  const answer = tens * 10 + ones;
  const conditions = ["두 자리 수입니다.", `각 자리 숫자의 합이 ${sum}입니다.`, `십의 자리 숫자가 일의 자리 숫자보다 ${gap} 작습니다.`];
  return {
    prompt: "다음 주어진 조건에 맞는 수를 구하세요.",
    visual: { kind: "g1-condition-list", conditions, title: difficulty === 1 ? `일의 자리 숫자는 ${ones}입니다.` : "수의 조건" },
    answer: String(answer),
    solution: `합이 ${sum}이고 차가 ${gap}인 두 숫자는 ${tens}${hasBatchim(tens) ? "과" : "와"} ${ones}입니다. 십의 자리가 더 작으므로 ${answer}입니다.`,
    meta: { difficulty, tens, ones, gap, sum, answer }
  };
}

function g1FrontBackBetween({ difficulty = 2 }) {
  const total = difficulty === 1 ? randomInt(5, 7) : difficulty === 2 ? randomInt(6, 9) : randomInt(9, 13);
  let firstPosition;
  let secondPosition;
  do {
    firstPosition = randomInt(1, total);
    secondPosition = randomInt(1, total);
  } while (firstPosition === secondPosition || Math.abs(firstPosition - secondPosition) < 2);
  const firstFromBack = total - firstPosition + 1;
  const secondFromBack = total - secondPosition + 1;
  const between = Math.abs(firstPosition - secondPosition) - 1;
  const names = shuffle(["은재", "찬형", "지우", "민서", "하준", "서윤"]);
  const conditions = [`${subjectParticle(names[0])} 앞에서 ${firstPosition}번째입니다.`, `${subjectParticle(names[1])} 뒤에서 ${secondFromBack}번째입니다.`];
  return {
    prompt: `${total}명이 한 줄로 서 있습니다. 다음을 보고 ${names[0]}${conjunctionParticle(names[0])} ${names[1]} 사이에 몇 명이 서 있는지 구하세요.`,
    visual: { kind: "g1-condition-list", conditions, title: difficulty === 1 ? `${subjectParticle(names[1])} 앞에서 ${secondPosition}번째입니다.` : "앞과 뒤에서 센 순서" },
    answer: `${between}명`,
    solution: `${names[1]}는 앞에서 ${total} - ${secondFromBack} + 1 = ${secondPosition}번째입니다. ${firstPosition}번째와 ${secondPosition}번째 사이에는 ${between}명이 있습니다.`,
    meta: { difficulty, total, firstPosition, secondPosition, firstFromBack, secondFromBack, between }
  };
}

function g1ShapeAddSubtractChain({ difficulty = 2 }) {
  let diamond;
  let starGap;
  let star;
  let square;
  let circleGap;
  let circle;
  do {
    diamond = randomInt(3, 7);
    starGap = randomInt(1, diamond - 1);
    star = diamond - starGap;
    square = randomInt(1, 5);
    circleGap = randomInt(1, Math.min(4, 7 - square));
    circle = square + circleGap;
  } while (new Set([diamond, star, square, circle]).size < 4);
  const equations = [
    `☆ + ○ = ${star + circle}`,
    `◇ - ☆ = ${starGap}`,
    `◇ + ◇ = ${diamond * 2}`,
    `○ - □ = ${circleGap}`
  ];
  return {
    prompt: "다음 식에서 각 도형은 서로 다른 수를 나타냅니다. □가 나타내는 수를 구하세요.",
    visual: { kind: "g1-equation-panel", equations, hint: difficulty === 1 ? `◇는 ${diamond}입니다.` : "" },
    answer: String(square),
    solution: `◇+◇=${diamond * 2}이므로 ◇=${diamond}, ◇-☆=${starGap}이므로 ☆=${star}입니다. ☆+○=${star + circle}에서 ○=${circle}, ○-□=${circleGap}에서 □=${square}입니다.`,
    meta: { difficulty, diamond, star, circle, square, equations, answer: square }
  };
}

const FOLD_PIECE_TEMPLATES = {
  1: [
    { folds: ["아래로"], cuts: "접힌 직사각형의 두 대각선", cutPattern: "diagonal", cutLines: 2, pieces: 7 },
    { folds: ["위로"], cuts: "접힌 직사각형의 두 대각선", cutPattern: "diagonal", cutLines: 2, pieces: 7 },
    { folds: ["왼쪽으로"], cuts: "가운데 가로선과 세로선", cutPattern: "cross", cutLines: 2, pieces: 6 },
    { folds: ["오른쪽으로"], cuts: "가운데 가로선과 세로선", cutPattern: "cross", cutLines: 2, pieces: 6 }
  ],
  2: [
    { folds: ["아래로", "왼쪽으로"], cuts: "접힌 정사각형의 두 대각선", cutPattern: "diagonal", cutLines: 2, pieces: 12 },
    { folds: ["위로", "오른쪽으로"], cuts: "접힌 정사각형의 두 대각선", cutPattern: "diagonal", cutLines: 2, pieces: 12 },
    { folds: ["아래로", "오른쪽으로"], cuts: "가운데 가로선과 세로선", cutPattern: "cross", cutLines: 2, pieces: 9 },
    { folds: ["위로", "왼쪽으로"], cuts: "가운데 가로선과 세로선", cutPattern: "cross", cutLines: 2, pieces: 9 }
  ],
  3: [
    { folds: ["오른쪽으로", "아래로"], cuts: "두 대각선과 가운데 선", cutPattern: "diagonal-middle", cutLines: 3, pieces: 18 },
    { folds: ["왼쪽으로", "위로"], cuts: "두 대각선과 가운데 선", cutPattern: "diagonal-middle", cutLines: 3, pieces: 18 },
    { folds: ["아래로", "오른쪽으로"], cuts: "가운데 십자선과 대각선", cutPattern: "cross-diagonal", cutLines: 3, pieces: 16 },
    { folds: ["위로", "왼쪽으로"], cuts: "가운데 십자선과 대각선", cutPattern: "cross-diagonal", cutLines: 3, pieces: 16 }
  ]
};

function g1FoldCutPieceCount({ difficulty = 2 }) {
  const template = sample(FOLD_PIECE_TEMPLATES[difficulty] || FOLD_PIECE_TEMPLATES[2]);
  const paperTone = sample(["blue", "gold", "coral"]);
  return {
    prompt: "정사각형 모양의 색종이를 그림과 같이 접어서 선을 따라 잘랐을 때, 펼친 색종이는 모두 몇 조각이 되는지 구하세요.",
    visual: { kind: "g1-fold-cut-pieces", ...template, difficulty, paperTone },
    answer: `${template.pieces}조각`,
    solution: `접은 방향을 거꾸로 한 단계씩 펼쳐 자른 선을 대칭으로 옮겨 그립니다. 펼친 선으로 나뉜 부분을 하나씩 세면 ${template.pieces}조각입니다.`,
    meta: { difficulty, ...template, paperTone, answer: template.pieces }
  };
}

function g1RepeatedDigitAddition({ difficulty = 2 }) {
  let tens;
  let ones;
  do {
    tens = randomInt(5, 9);
    ones = randomInt(0, 9);
  } while (tens === ones);
  const addend = tens * 10 + ones;
  const result = addend * 2;
  const ask = difficulty === 1 ? "ones" : difficulty === 3 ? "sum" : "both";
  const answer = ask === "ones" ? `□=${ones}` : ask === "sum" ? String(tens + ones) : `○=${tens}, □=${ones}`;
  const prompt = ask === "ones"
    ? `다음 계산식에서 ○는 ${tens}입니다. □가 나타내는 숫자를 구하세요.`
    : ask === "sum"
      ? "다음 계산식에서 같은 모양은 같은 숫자를 나타냅니다. ○와 □가 나타내는 숫자의 합을 구하세요."
      : "다음 계산식에서 같은 모양은 같은 숫자를, 다른 모양은 다른 숫자를 나타냅니다. 각 모양에 알맞은 숫자를 구하세요.";
  return {
    prompt,
    visual: { kind: "g1-repeated-digit-addition", digitSymbol: "○", otherSymbol: "□", result },
    answer,
    solution: `${tens}${ones}+${tens}${ones}=${result}이므로 ○=${tens}, □=${ones}입니다.${ask === "sum" ? ` 따라서 두 수의 합은 ${tens}+${ones}=${tens + ones}입니다.` : ""}`,
    meta: { difficulty, tens, ones, addend, result, ask, answer: ask === "sum" ? tens + ones : ones }
  };
}

function g1MultiplicativeSymbolChain({ difficulty = 2 }) {
  const circle = 1;
  const repeat = difficulty === 1 ? randomInt(2, 4) : difficulty === 2 ? randomInt(2, 5) : randomInt(4, 7);
  const triangle = repeat;
  const square = triangle * triangle;
  const star = circle + triangle + square;
  const symbols = sample([
    { square: "□", circle: "○", triangle: "△", star: "☆" },
    { square: "◇", circle: "○", triangle: "▽", star: "☆" },
    { square: "▣", circle: "◇", triangle: "○", star: "♡" },
    { square: "△", circle: "□", triangle: "○", star: "☆" },
    { square: "○", circle: "◇", triangle: "□", star: "♡" },
    { square: "▽", circle: "○", triangle: "◇", star: "★" }
  ]);
  const equations = [
    `${symbols.square} × ${symbols.circle} = ${symbols.square}`,
    `${Array.from({ length: repeat }, () => symbols.circle).join(" + ")} = ${symbols.triangle}`,
    `${symbols.triangle} × ${symbols.triangle} = ${symbols.square}`,
    `${symbols.circle} + ${symbols.triangle} + ${symbols.square} = ${symbols.star}`
  ];
  const asksSum = difficulty === 3;
  return {
    prompt: asksSum
      ? `다음 그림에서 다른 모양은 서로 다른 수를 나타냅니다. ${symbols.star}과 ${symbols.triangle}이 나타내는 수의 합을 구하세요.`
      : `다음 그림에서 다른 모양은 서로 다른 수를 나타냅니다. ${symbols.star}이 나타내는 수를 구하세요.`,
    visual: { kind: "g1-equation-panel", equations, hint: difficulty === 1 ? `${symbols.square}에 ${symbols.circle}를 곱해도 ${symbols.square}가 되려면 ${symbols.circle}는 1입니다.` : "" },
    answer: String(asksSum ? star + triangle : star),
    solution: `첫째 식에서 ${symbols.circle}=${circle}, 둘째 식에서 ${symbols.triangle}=${triangle}, 셋째 식에서 ${symbols.square}=${square}입니다. 따라서 ${symbols.star}=${circle}+${triangle}+${square}=${star}입니다.${asksSum ? ` ${symbols.star}과 ${symbols.triangle}의 합은 ${star}+${triangle}=${star + triangle}입니다.` : ""}`,
    meta: { difficulty, circle, repeat, triangle, square, star, symbols, asksSum, answer: asksSum ? star + triangle : star }
  };
}

function g1BalanceThreeRelations({ difficulty = 2 }) {
  const templates = [];
  const triangleMax = difficulty === 1 ? 4 : difficulty === 2 ? 4 : 5;
  const rectangleMax = difficulty === 1 ? 2 : difficulty === 2 ? 2 : 3;
  const circleTriangleMax = difficulty === 1 ? 1 : difficulty === 2 ? 2 : 3;
  for (let triangleRectangles = 2; triangleRectangles <= triangleMax; triangleRectangles += 1) {
    for (let circleRectangles = 1; circleRectangles <= rectangleMax; circleRectangles += 1) {
      for (let circleTriangles = 1; circleTriangles <= circleTriangleMax; circleTriangles += 1) {
        templates.push({ triangleRectangles, circleRectangles, circleTriangles });
      }
    }
  }
  const { triangleRectangles, circleRectangles, circleTriangles } = sample(templates);
  const answer = triangleRectangles + circleRectangles + circleTriangles * triangleRectangles;
  return {
    prompt: "다음 양팔저울은 모두 수평입니다. [그림 3]의 오른쪽 접시에 긴 네모를 몇 개 놓아야 하는지 구하세요.",
    visual: { kind: "g1-balance-three-relations", triangleRectangles, circleRectangles, circleTriangles },
    answer: `${answer}개`,
    solution: `삼각형 1개는 긴 네모 ${triangleRectangles}개입니다. 원 1개는 긴 네모 ${circleRectangles}개와 삼각형 ${circleTriangles}개이므로 긴 네모 ${circleRectangles + circleTriangles * triangleRectangles}개입니다. 삼각형과 원을 합하면 긴 네모 ${answer}개입니다.`,
    meta: { difficulty, triangleRectangles, circleRectangles, circleTriangles, answer }
  };
}

function g1StackedShapeDualCycle({ difficulty = 2 }) {
  const shapeCycles = difficulty === 1 ? [["○", "□"]] : [["○", "□", "△"], ["△", "○", "□"], ["□", "△", "○"]];
  const countCycles = difficulty === 3 ? [[1, 5, 3, 2, 4], [2, 4, 1, 3, 5]] : [[1, 4, 3, 2], [2, 1, 4, 3]];
  const shapes = sample(shapeCycles);
  const counts = sample(countCycles);
  const target = difficulty === 1 ? randomInt(15, 24) : difficulty === 2 ? randomInt(25, 45) : randomInt(40, 70);
  const shape = shapes[(target - 1) % shapes.length];
  const count = counts[(target - 1) % counts.length];
  const items = Array.from({ length: 10 }, (_, index) => ({ shape: shapes[index % shapes.length], count: counts[index % counts.length] }));
  return {
    prompt: `다음은 모양을 일정한 규칙에 따라 나열한 것입니다. ${target}번째에 올 모양을 구하세요.`,
    visual: { kind: "g1-stacked-shape-cycle", items, target },
    answer: `${shape} ${count}개`,
    solution: `모양은 ${shapes.join(" → ")} 순서로, 쌓인 개수는 ${counts.join(" → ")} 순서로 반복됩니다. ${target}번째는 ${shape} ${count}개입니다.`,
    meta: { difficulty, shapes, counts, target, shape, count }
  };
}

function g1TriangleColorDifference({ difficulty = 2 }) {
  const target = difficulty === 1 ? randomInt(2, 7) : difficulty === 2 ? randomInt(5, 10) : randomInt(8, 15);
  const white = target * (target + 1) / 2;
  const filled = target * (target - 1) / 2;
  const answer = white - filled;
  return {
    prompt: `다음 그림과 같이 일정한 규칙으로 삼각형을 그렸습니다. ${target}번째 그림에서 칠해지지 않은 삼각형은 칠해진 삼각형보다 몇 개 더 많은지 구하세요.`,
    visual: { kind: "g1-triangle-color-difference", target },
    answer: `${answer}개`,
    solution: `${target}번째에는 칠해지지 않은 삼각형이 ${white}개, 칠해진 삼각형이 ${filled}개입니다. ${white}-${filled}=${answer}이므로 ${answer}개 더 많습니다.`,
    meta: { difficulty, target, white, filled, answer }
  };
}

function countShapeGridSolutions(visible) {
  let count = 0;
  for (let circle = 1; circle <= 9; circle += 1) for (let square = 1; square <= 9; square += 1) for (let diamond = 1; diamond <= 9; diamond += 1) for (let black = 1; black <= 9; black += 1) {
    if (new Set([circle, square, diamond, black]).size < 4) continue;
    const rowSums = [circle * 2 + diamond * 2, square + black + diamond * 2, square + circle * 3];
    const columnSums = [circle * 2 + square * 2, circle * 2 + black * 2, diamond * 2 + circle + square, diamond * 3 + circle];
    if (rowSums.every((value, index) => value === visible.rowSums[index]) && columnSums.every((value, index) => value === visible.columnSums[index])) count += 1;
  }
  return count;
}

function g1ShapeSumGridFour({ difficulty = 2 }) {
  let data;
  do {
    const [circle, square, diamond, black] = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
    const rowSums = [circle * 2 + diamond * 2, square + black + diamond * 2, square + circle * 3];
    const columnSums = [circle * 2 + square * 2, circle * 2 + black * 2, diamond * 2 + circle + square, diamond * 3 + circle];
    data = { circle, square, diamond, black, rowSums, columnSums };
  } while (countShapeGridSolutions(data) !== 1);
  const answer = data.circle + data.black + data.square + data.diamond;
  return {
    prompt: "다음 그림에서 같은 도형은 같은 수를 나타내고, 오른쪽과 아래에 쓰인 수는 각 줄의 합을 나타냅니다. 빈칸에 알맞은 수를 구하세요.",
    visual: { kind: "g1-shape-sum-grid-four", ...data, hint: difficulty === 1 ? `○는 ${data.circle}입니다.` : "" },
    answer: String(answer),
    solution: `주어진 가로줄과 세로줄의 합을 차례로 비교하면 ○=${data.circle}, □=${data.square}, ◇=${data.diamond}, ▣=${data.black}입니다. 마지막 줄의 합은 ${data.circle}+${data.black}+${data.square}+${data.diamond}=${answer}입니다.`,
    meta: { difficulty, ...data, answer, uniqueSolutions: 1 }
  };
}

function g1RodRatioTotal({ difficulty = 2 }) {
  const unitPairs = difficulty === 1 ? [[2, 3]] : difficulty === 2 ? [[3, 5], [2, 5], [3, 4]] : [[4, 5], [3, 7], [5, 6]];
  const [topUnits, bottomUnits] = sample(unitPairs);
  const scale = randomInt(difficulty === 1 ? 2 : 4, difficulty === 3 ? 8 : 7);
  const topLength = bottomUnits * scale;
  const bottomLength = topUnits * scale;
  const total = topLength + bottomLength;
  return {
    prompt: "다음 그림은 두 막대의 길이를 비교한 것입니다. 두 막대의 길이를 각각 구하세요.",
    visual: { kind: "g1-rod-ratio-total", topUnits, bottomUnits, total },
    answer: `㉠=${topLength}cm, ㉡=${bottomLength}cm`,
    solution: `㉠ ${topUnits}칸과 ㉡ ${bottomUnits}칸의 길이가 같습니다. ㉠ 1칸과 ㉡ 1칸을 합한 ${total}cm를 ${topUnits + bottomUnits}칸으로 나누어 생각하면 ㉠은 ${topLength}cm, ㉡은 ${bottomLength}cm입니다.`,
    meta: { difficulty, topUnits, bottomUnits, scale, topLength, bottomLength, total }
  };
}

const FOUR_SYMBOL_TEMPLATES = (() => {
  const groups = new Map();
  for (let square = 1; square <= 9; square += 1) for (let diamond = 1; diamond <= 9; diamond += 1) for (let circle = 1; circle <= 9; circle += 1) for (let star = 1; star <= 9; star += 1) {
    if (new Set([square, diamond, circle, star]).size < 4) continue;
    for (let leftCount = 2; leftCount <= 5; leftCount += 1) for (let rightCount = 2; rightCount <= 5; rightCount += 1) for (let thirdSquare = 2; thirdSquare <= 3; thirdSquare += 1) {
      if (leftCount * square !== rightCount * diamond) continue;
      if (thirdSquare * square !== circle + diamond) continue;
      if (square + star !== circle * 2) continue;
      const key = `${leftCount}:${rightCount}:${thirdSquare}`;
      const solutions = groups.get(key) || [];
      solutions.push({ square, diamond, circle, star, leftCount, rightCount, thirdSquare });
      groups.set(key, solutions);
    }
  }
  return [...groups.values()].filter((solutions) => solutions.length === 1).map(([solution]) => solution);
})();

function g1FourSymbolRelation({ difficulty = 2 }) {
  const pool = FOUR_SYMBOL_TEMPLATES;
  const item = sample(pool);
  const equations = [`□ + ☆ = ○ + ○`, `${"□ + ".repeat(item.leftCount - 1)}□ = ${"◇ + ".repeat(item.rightCount - 1)}◇`, `${"□ + ".repeat(item.thirdSquare - 1)}□ = ○ + ◇`];
  return {
    prompt: "다음 각 도형은 서로 다른 한 자리 수를 나타냅니다. ☆이 나타내는 수를 구하세요.",
    visual: { kind: "g1-equation-panel", equations, hint: difficulty === 1 ? `□는 ${item.square}입니다.` : "" },
    answer: String(item.star),
    solution: `세 식을 모두 만족하는 서로 다른 한 자리 수는 □=${item.square}, ◇=${item.diamond}, ○=${item.circle}, ☆=${item.star}입니다.`,
    meta: { difficulty, ...item, equations, answer: item.star }
  };
}

function g1PolygonStoneRearrangement({ difficulty = 2 }) {
  const choices = [];
  const sourceSidesPool = difficulty === 1 ? [3, 4] : difficulty === 2 ? [4, 5, 6] : [5, 6];
  for (const sourceSides of sourceSidesPool) for (let sourcePerSide = 7; sourcePerSide <= (difficulty === 3 ? 24 : 20); sourcePerSide += 1) {
    const total = sourceSides * (sourcePerSide - 1);
    for (const targetSides of [3, 4, 5, 6]) {
      if (targetSides === sourceSides || total % targetSides !== 0) continue;
      const targetPerSide = total / targetSides + 1;
      if (targetPerSide <= 30) choices.push({ sourceSides, sourcePerSide, targetSides, targetPerSide, total });
    }
  }
  const item = sample(choices);
  const polygonNames = { 3: "정삼각형", 4: "정사각형", 5: "정오각형", 6: "정육각형" };
  const sourceName = polygonNames[item.sourceSides];
  const targetName = polygonNames[item.targetSides];
  return {
    prompt: `한 변에 바둑돌을 ${item.sourcePerSide}개씩 늘어놓아 ${sourceName}을 만들었습니다. 이 바둑돌을 ${targetName} 모양으로 늘어놓는다면 한 변에 몇 개를 놓아야 하는지 구하세요.`,
    visual: { kind: "g1-polygon-stones", ...item, sourceName, targetName },
    answer: `${item.targetPerSide}개`,
    solution: `꼭짓점 바둑돌은 이웃한 두 변이 함께 사용합니다. 전체는 ${item.sourceSides}×(${item.sourcePerSide}-1)=${item.total}개입니다. ${targetName}에서는 한 변의 처음 돌을 제외한 수가 ${item.total}÷${item.targetSides}=${item.targetPerSide - 1}이므로 한 변에는 ${item.targetPerSide}개를 놓습니다.`,
    meta: { difficulty, ...item, answer: item.targetPerSide }
  };
}

function g1PairedSequences({ difficulty = 2 }) {
  const terms = difficulty === 1 ? randomInt(8, 14) : difficulty === 2 ? randomInt(18, 30) : randomInt(31, 45);
  const topStart = randomInt(1, 8);
  const topStep = randomInt(2, difficulty === 3 ? 7 : 5);
  const bottomStep = -randomInt(3, difficulty === 3 ? 12 : 8);
  const minimumStart = Math.abs(bottomStep) * (terms - 1) + 20;
  const bottomStart = randomInt(Math.max(difficulty === 1 ? 100 : 350, minimumStart), Math.max(difficulty === 3 ? 900 : 650, minimumStart + 120));
  const topLast = topStart + (terms - 1) * topStep;
  const answer = bottomStart + (terms - 1) * bottomStep;
  return {
    prompt: "다음 표는 일정한 규칙에 따라 만들어진 것입니다. ㉮에 알맞은 수를 구하세요.",
    visual: { kind: "g1-paired-sequences", terms, topStart, topStep, topLast, bottomStart, bottomStep },
    answer: String(answer),
    solution: `윗줄은 ${topStep}씩 커져 ${topStart}에서 ${topLast}까지 ${terms}개의 수가 있습니다. 아랫줄은 ${Math.abs(bottomStep)}씩 작아지므로 ${bottomStart}${bottomStep < 0 ? "-" : "+"}${Math.abs(bottomStep)}×${terms - 1}=${answer}입니다.`,
    meta: { difficulty, terms, topStart, topStep, topLast, bottomStart, bottomStep, answer }
  };
}

function g1RatioDistribution({ difficulty = 2 }) {
  const childGroup = difficulty === 1 ? 2 : difficulty === 2 ? 3 : randomInt(3, 5);
  const adultItems = difficulty === 1 ? 2 : difficulty === 2 ? 3 : randomInt(3, 5);
  const children = childGroup * randomInt(difficulty === 1 ? 5 : 10, difficulty === 3 ? 24 : 18);
  const adults = randomInt(difficulty === 1 ? 4 : 8, difficulty === 3 ? 24 : 18);
  const people = children + adults;
  const items = children / childGroup + adults * adultItems;
  return {
    prompt: `${people}명의 어린이와 어른이 ${items}개의 귤을 나누어 먹습니다. 어린이는 ${childGroup}명이 1개를 나누어 먹고, 어른은 1명이 ${adultItems}개를 먹습니다. 어린이와 어른은 각각 몇 명인지 구하세요.`,
    visual: { kind: "g1-ratio-distribution", people, items, childGroup, adultItems },
    answer: `어린이 ${children}명, 어른 ${adults}명`,
    solution: `어른 수를 하나씩 늘려 보며 전체 사람 수와 귤 수를 함께 맞춥니다. 어린이 ${children}명은 ${children / childGroup}개, 어른 ${adults}명은 ${adults * adultItems}개를 먹어 모두 ${items}개입니다.`,
    meta: { difficulty, people, items, childGroup, adultItems, children, adults }
  };
}

function g1OddEvenSumDifference({ difficulty = 2 }) {
  const difference = difficulty === 1 ? randomInt(5, 10) : difficulty === 2 ? randomInt(11, 22) : randomInt(23, 40);
  const oddEnd = difference * 2 - 1;
  const evenEnd = difference * 2;
  return {
    prompt: `1부터 ㉠까지의 자연수 중에서 짝수 전체의 합과 홀수 전체의 합의 차가 ${difference}입니다. ㉠이 될 수 있는 수를 모두 구하세요.`,
    visual: { kind: "g1-odd-even-difference", difference, oddEnd, evenEnd },
    answer: `${oddEnd}, ${evenEnd}`,
    solution: `1부터 차례로 홀수와 짝수를 한 쌍씩 묶으면 한 쌍마다 짝수가 1 큽니다. ${difference}쌍까지 쓴 ${evenEnd}, 마지막 짝수를 쓰기 전인 ${oddEnd}에서 모두 차가 ${difference}이므로 답은 ${oddEnd}, ${evenEnd}입니다.`,
    meta: { difficulty, difference, oddEnd, evenEnd, answer: [oddEnd, evenEnd] }
  };
}

export const G1_GENERATORS = {
  g1BusTwoStops,
  g1HeightOrder,
  g1TwoDigitOnesGreater,
  g1FrontBackBetween,
  g1ShapeAddSubtractChain,
  g1FoldCutPieceCount,
  g1RepeatedDigitAddition,
  g1MultiplicativeSymbolChain,
  g1BalanceThreeRelations,
  g1StackedShapeDualCycle,
  g1TriangleColorDifference,
  g1ShapeSumGridFour,
  g1RodRatioTotal,
  g1FourSymbolRelation,
  g1PolygonStoneRearrangement,
  g1PairedSequences,
  g1RatioDistribution,
  g1OddEvenSumDifference
};
