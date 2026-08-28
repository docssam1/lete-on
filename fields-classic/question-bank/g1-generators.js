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
    meta: { difficulty, total, firstPosition, secondPosition, firstFromBack, secondFromBack, between, names, conditions }
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

function g1HeightOrderFour({ difficulty = 2 }) {
  const names = shuffle(["윤아", "재아", "하연", "라희", "서준", "민서", "지우"]).slice(0, 4);
  const ordered = shuffle(names);
  const conditions = ordered.slice(0, -1).map((shorter, index) => {
    const taller = ordered[index + 1];
    return Math.random() < 0.5
      ? `${subjectParticle(taller)} ${shorter}보다 큽니다.`
      : `${subjectParticle(shorter)} ${taller}보다 작습니다.`;
  });
  if (difficulty >= 2) conditions.push(`${subjectParticle(ordered[3])} ${ordered[0]}보다 큽니다.`);
  if (difficulty === 3) conditions.push(`${subjectParticle(ordered[2])} ${ordered[0]}보다 큽니다.`);
  const targetRank = difficulty === 1 ? 2 : randomInt(2, 3);
  const answer = ordered[targetRank - 1];
  return {
    prompt: `다음은 네 사람의 키를 비교한 것입니다. 키가 ${targetRank}번째로 작은 사람은 누구인지 구하세요.`,
    visual: { kind: "g1-condition-list", conditions: difficulty === 1 ? conditions : shuffle(conditions), title: "키 비교" },
    answer,
    solution: `조건을 작은 사람부터 차례로 놓으면 ${ordered.join(" < ")}입니다. 따라서 ${targetRank}번째로 작은 사람은 ${answer}입니다.`,
    meta: { difficulty, names, ordered, conditions, targetRank, answer, count: 4 }
  };
}

function g1SummerEqualizeTransfer({ difficulty = 2 }) {
  const transfer = difficulty === 1 ? randomInt(1, 2) : difficulty === 2 ? randomInt(3, 4) : randomInt(4, 5);
  const lower = difficulty === 1 ? randomInt(5, 8) : difficulty === 2 ? randomInt(7, 11) : randomInt(10, 15);
  const higher = lower + transfer * 2;
  const names = sample([["준호", "서윤"], ["민재", "예린"], ["도윤", "하린"]]);
  return {
    prompt: `${names[0]}${conjunctionParticle(names[0])} ${names[1]}${hasNameBatchim(names[1]) ? "이" : "가"} 구슬을 똑같이 가지려고 합니다. ${names[0]}${hasNameBatchim(names[0]) ? "이" : "가"} ${names[1]}에게 구슬 몇 개를 주어야 하는지 구하세요.`,
    visual: { kind: "equalize-bags", names, higher, lower, item: "구슬" },
    answer: `${transfer}개`,
    solution: `두 사람의 구슬 수 차이는 ${higher - lower}개입니다. 한 개를 주면 한쪽은 1개 줄고 다른 쪽은 1개 늘므로, 차이의 반인 ${transfer}개를 주면 같습니다.`,
    meta: { difficulty, higher, lower, transfer }
  };
}

function g1SummerTwoDigitSumGap({ difficulty = 2 }) {
  const pairs = difficulty === 1
    ? [[4, 1], [5, 2], [6, 3]]
    : difficulty === 2
      ? [[9, 4], [8, 3], [7, 4], [8, 5]]
      : [[9, 2], [9, 3], [8, 1], [8, 2]];
  const [tens, ones] = sample(pairs);
  const sum = tens + ones;
  const gap = tens - ones;
  const answer = tens * 10 + ones;
  return {
    prompt: "다음 주어진 조건을 만족하는 두 자리 수를 구하세요.",
    visual: { kind: "number-conditions", sum, gap },
    answer: String(answer),
    solution: `십의 자리와 일의 자리의 합이 ${sum}, 차가 ${gap}입니다. 두 수를 만족하는 십의 자리는 ${tens}, 일의 자리는 ${ones}이므로 ${answer}입니다.`,
    meta: { difficulty, tens, ones, sum, gap, answer }
  };
}

function g1SummerHeightOrderFive({ difficulty = 2 }) {
  const [tallest, target, middle, fourth, shortest] = shuffle(["지현", "준영", "윤주", "선미", "현우"]);
  const conditions = difficulty === 1
    ? [`${target}: 나는 키가 두 번째로 커.`]
    : difficulty === 2
      ? [
        `${fourth}: 나보다 키가 작은 어린이는 1명 있어.`,
        `${target}: 나는 ${tallest}보다 키가 작아.`,
        `${middle}: 나보다 키가 큰 어린이는 2명 있어.`,
        `${shortest}: 내가 키가 가장 작아.`
      ]
      : [
        `${tallest}: 나는 ${target}보다 키가 커.`,
        `${target}: 나는 ${middle}보다 키가 커.`,
        `${middle}: 나는 ${fourth}보다 키가 커.`,
        `${fourth}: 나는 ${shortest}보다 키가 커.`
      ];
  const solution = difficulty === 1
    ? `${target}의 말에 두 번째라고 바로 나와 있으므로 ${target}은 2번째입니다.`
    : difficulty === 2
      ? `${shortest}은 가장 작아 5번째입니다. ${fourth}보다 작은 어린이가 1명이므로 ${fourth}는 4번째이고, ${middle}보다 큰 어린이는 2명이므로 ${middle}는 3번째입니다. 남은 ${target}은 ${tallest}보다 작으므로 2번째입니다.`
      : `${tallest}부터 ${target}, ${middle}, ${fourth}, ${shortest} 순서로 키가 큽니다. 따라서 ${target}은 2번째입니다.`;
  return {
    prompt: `다음은 어린이 5명의 키를 비교하여 말한 것입니다. 키가 큰 어린이부터 차례로 셀 때, ${target}은 몇 번째인지 구하세요.`,
    visual: { kind: "g1-summer-height-order", conditions, target },
    answer: "2번째",
    solution,
    meta: { difficulty, tallest, target, middle, fourth, shortest, conditions, answer: 2 }
  };
}

function g1SummerBalanceShapeChain({ difficulty = 2 }) {
  const templates = difficulty === 1
    ? [{ circles: 1, squares: 2, triangles: 2 }]
    : difficulty === 2
      ? [{ circles: 2, squares: 4, triangles: 2 }]
      : [{ circles: 2, squares: 6, triangles: 3 }, { circles: 3, squares: 6, triangles: 3 }];
  const { circles, squares, triangles } = sample(templates);
  const squaresPerCircle = squares / circles;
  const answer = squaresPerCircle * triangles;
  return {
    prompt: "다음 양팔저울은 모두 수평입니다. 원 1개와 무게가 같은 세모는 몇 개인지 구하세요.",
    visual: { kind: "g1-summer-balance-chain", circles, squares, triangles },
    answer: `${answer}개`,
    solution: `첫째 저울에서 원 1개는 네모 ${squaresPerCircle}개와 같습니다. 둘째 저울에서 네모 1개는 세모 ${triangles}개와 같습니다. 따라서 원 1개는 세모 ${squaresPerCircle}개씩 ${triangles}개이므로 모두 ${answer}개와 같습니다.`,
    meta: { difficulty, circles, squares, triangles, squaresPerCircle, answer }
  };
}

function g1SummerFiveBoxWeightOrder({ difficulty = 2 }) {
  const [first, second, third, fourth, fifth] = shuffle([1, 2, 3, 4, 5]);
  const answerOrder = [first, second, third, fourth, fifth];
  const relations = [
    { heavier: first, lighter: second },
    { heavier: second, lighter: third },
    { heavier: third, lighter: fourth },
    { heavier: fourth, lighter: fifth }
  ];
  const conditions = difficulty === 1
    ? relations.map(({ heavier, lighter }) => `${heavier}번 상자는 ${lighter}번 상자보다 무겁습니다.`)
    : difficulty === 2
      ? [
        `${third}번 상자는 ${second}번 상자보다 가볍고 ${fourth}번 상자보다 무겁습니다.`,
        `${second}번 상자는 ${first}번 상자보다 가볍습니다.`,
        `${fourth}번 상자는 ${fifth}번 상자보다 무겁습니다.`
      ]
      : [
        `${third}번 상자는 ${second}번 상자보다 가볍고 ${fourth}번 상자보다 무겁습니다.`,
        `${second}번 상자는 ${first}번 상자보다 가볍습니다.`,
        `${fifth}번 상자는 ${fourth}번 상자보다 가볍습니다.`,
        `${first}번 상자는 ${third}번 상자보다 무겁습니다.`
      ];
  const answer = answerOrder.join(" > ");
  return {
    prompt: "번호가 적힌 상자 5개의 무게를 비교했습니다. 가장 무거운 상자부터 차례로 번호를 쓰세요.",
    visual: { kind: "g1-summer-five-box-weight", conditions, boxCount: 5 },
    answer,
    solution: `${conditions.join(" ")} 따라서 무거운 순서는 ${answer}입니다.`,
    meta: { difficulty, answerOrder, relations, conditions }
  };
}

function g1SummerFourShapeAddSubtract({ difficulty = 2 }) {
  const diamond = difficulty === 1 ? 4 : difficulty === 2 ? sample([4, 5, 6]) : sample([6, 7, 8]);
  const difference = 3;
  const star = diamond - difference;
  const circle = diamond + 1;
  const square = circle - difference;
  const sum = star + circle;
  return {
    prompt: "다음 식에서 네모가 나타내는 수를 구하세요.",
    visual: { kind: "g1-summer-four-shape-chain", star, circle, diamond, square, sum, difference },
    answer: String(square),
    solution: `마름모 2개의 합이 ${diamond * 2}이므로 마름모는 ${diamond}입니다. 마름모에서 별을 빼면 ${difference}이므로 별은 ${star}입니다. 별과 원의 합은 ${sum}이므로 원은 ${circle}입니다. 원에서 ${difference}을 빼면 네모는 ${square}입니다.`,
    meta: { difficulty, star, circle, diamond, square, sum, difference }
  };
}

function g1SummerPentagonAdjacentProduct({ difficulty = 2 }) {
  const cycles = difficulty === 1
    ? [[3, 4, 2, 5, 6], [4, 3, 2, 5, 6]]
    : difficulty === 2
      ? [[6, 9, 3, 5, 2], [4, 6, 3, 5, 2]]
      : [[8, 9, 3, 7, 2], [9, 8, 3, 7, 2]];
  const values = sample(cycles);
  const products = values.map((value, index) => value * values[(index + 1) % values.length]);
  const [top, upperLeft, lowerLeft, lowerRight, upperRight] = values;
  return {
    prompt: "다음 오각형 모양에서 원 안의 수는 2부터 9까지의 자연수이고, 네모 안의 수는 양쪽 원 안의 두 수의 곱입니다. 빈 원에 알맞은 수를 쓰세요.",
    visual: { kind: "g1-summer-pentagon-product", values, products },
    answer: String(top),
    solution: `왼쪽 위 네모와 왼쪽 아래 네모의 수를 이용하면 빈 원과 아래쪽 원의 관계를 알 수 있습니다. 주어진 곱을 차례로 맞추면 원 안의 수는 ${top}, ${upperLeft}, ${lowerLeft}, ${lowerRight}, ${upperRight}가 됩니다. 따라서 빈 원에는 ${top}을 씁니다.`,
    meta: { difficulty, values, products, top }
  };
}

function g1SummerFourByFourShapeSum({ difficulty = 2 }) {
  const templates = difficulty === 1
    ? [{ square: 4, triangle: 1, diamond: 2, star: 3, circle: 5 }]
    : difficulty === 2
      ? [{ square: 5, triangle: 1, diamond: 3, star: 2, circle: 4 }]
      : [{ square: 6, triangle: 2, diamond: 4, star: 3, circle: 5 }];
  const values = sample(templates);
  const { square, triangle, diamond, star, circle } = values;
  const rowSums = [square * 4, triangle + diamond + star + circle, triangle + star * 2 + circle, triangle * 2 + diamond * 2];
  const columnSums = [square + triangle * 3, square + diamond + star + triangle, square + star * 2 + diamond, square + circle * 2 + diamond];
  return {
    prompt: "같은 도형은 같은 수를 나타내고, 오른쪽과 아래에 쓰인 수는 각 줄의 합입니다. 빈 네모에 들어갈 수를 구하세요.",
    visual: { kind: "g1-summer-four-by-four-sum", rowSums, columnSums },
    answer: String(rowSums[2]),
    solution: `첫째 줄에서 네모는 ${square}입니다. 첫째 세로줄에서 세모는 ${triangle}입니다. 둘째와 셋째 세로줄을 비교하면 별은 ${star}, 마름모는 ${diamond}입니다. 둘째 가로줄에서 원은 ${circle}이므로, 빈 줄의 합은 ${triangle} + ${star} + ${star} + ${circle} = ${rowSums[2]}입니다.`,
    meta: { difficulty, values, rowSums, columnSums, answer: rowSums[2] }
  };
}

function g1SummerCirclePointSegments({ difficulty = 2 }) {
  const points = difficulty === 1 ? sample([4, 5]) : difficulty === 2 ? 6 : sample([7, 8]);
  const answer = points * (points - 1) / 2;
  return {
    prompt: `다음 그림과 같이 원 위에 ${points}개의 점이 있습니다. 두 점을 잇는 선분을 모두 몇 개 그을 수 있는지 구하세요.`,
    visual: { kind: "g1-summer-circle-points", points },
    answer: `${answer}개`,
    solution: `한 점에서 다른 ${points - 1}개의 점으로 선분을 그을 수 있습니다. 같은 선분을 두 번 세지 않도록 차례로 ${points - 1}개, ${points - 2}개, ${points - 3}개, ...개를 더하면 모두 ${answer}개입니다.`,
    meta: { difficulty, points, answer }
  };
}

function g1SummerFourByFourShapeSumBottom({ difficulty = 2 }) {
  const templates = difficulty === 1
    ? [{ circle: 1, diamond: 3, square: 2, blackDiamond: 2 }]
    : difficulty === 2
      ? [{ circle: 1, diamond: 4, square: 3, blackDiamond: 2 }]
      : [{ circle: 2, diamond: 5, square: 4, blackDiamond: 3 }];
  const values = sample(templates);
  const { circle, diamond, square, blackDiamond } = values;
  const rowSums = [circle * 2 + diamond * 2, square + blackDiamond + diamond * 2, square * 2 + circle * 2, circle + blackDiamond + diamond * 2];
  const columnSums = [circle * 2 + square * 2, circle * 2 + blackDiamond * 2, diamond * 3 + circle, diamond * 3 + square];
  const cells = ["○", "○", "◇", "◇", "□", "◆", "◇", "◇", "□", "○", "○", "□", "○", "◆", "◇", "◇"];
  return {
    prompt: "같은 도형은 같은 수를 나타내고, 오른쪽과 아래에 쓰인 수는 각 줄의 합입니다. 빈 네모에 들어갈 수를 구하세요.",
    visual: { kind: "g1-summer-four-by-four-sum", cells, rowSums, columnSums, targetRow: 3 },
    answer: String(rowSums[3]),
    solution: `첫째 가로줄에서 원과 마름모의 합을 구하고, 첫째 세로줄에서 네모를 구합니다. 둘째 세로줄에서 검은 마름모를 구하면 빈 줄의 합은 ${circle} + ${blackDiamond} + ${diamond} + ${diamond} = ${rowSums[3]}입니다.`,
    meta: { difficulty, values, rowSums, columnSums, answer: rowSums[3] }
  };
}

function g1SummerVerticalShapeAddition({ difficulty = 2 }) {
  const templates = difficulty === 1
    ? [{ square: 8, finalDigit: 6 }]
    : difficulty === 2
      ? [{ square: 7, finalDigit: 4 }]
      : [{ square: 6, finalDigit: 2 }];
  const { square, finalDigit } = sample(templates);
  const circle = 9;
  const diamond = 1;
  const firstNumber = circle * 10 + square;
  const secondNumber = diamond * 10 + square;
  const total = diamond * 100 + diamond * 10 + finalDigit;
  return {
    prompt: "다음 식에서 같은 모양은 같은 숫자를 나타냅니다. 겹친 원 모양이 나타내는 숫자를 구하세요.",
    visual: { kind: "g1-summer-vertical-shape-addition", square, finalDigit },
    answer: String(circle),
    solution: `일의 자리에서 네모 ${square}개를 더하면 ${square * 2}이므로 일의 자리는 ${finalDigit}이고 받아올림이 1입니다. 십의 자리에서 겹친 원에 ${diamond}과 받아올림 1을 더하면 결과의 ${diamond}이 됩니다. 따라서 겹친 원은 ${circle}입니다.`,
    meta: { difficulty, circle, diamond, square, finalDigit, firstNumber, secondNumber, total }
  };
}

function g1SummerOneToThreeRods({ difficulty = 2 }) {
  const total = difficulty === 1 ? sample([16, 20]) : difficulty === 2 ? 28 : sample([36, 44]);
  const shortLength = total / 4;
  const longLength = shortLength * 3;
  return {
    prompt: "㉠ 막대 1개와 ㉡ 막대 3개의 길이가 같습니다. ㉠ 막대와 ㉡ 막대의 길이의 합이 주어진 길이일 때, 두 막대의 길이를 각각 구하세요.",
    visual: { kind: "g1-summer-one-three-rods", total },
    answer: `㉠=${longLength}cm, ㉡=${shortLength}cm`,
    solution: `㉠ 막대 1개는 ㉡ 막대 3개와 같습니다. 모두 4등분한 길이가 ${total}cm이므로 ㉡은 ${shortLength}cm, ㉠은 ${shortLength}cm의 3배인 ${longLength}cm입니다.`,
    meta: { difficulty, total, longLength, shortLength }
  };
}

function g1SummerTriangularColorDifference({ difficulty = 2 }) {
  const target = difficulty === 1 ? 4 : difficulty === 2 ? 7 : 10;
  const white = target * (target + 1) / 2;
  const filled = target * (target - 1) / 2;
  return {
    prompt: `다음 그림과 같이 일정한 규칙으로 삼각형을 그렸습니다. ${target}번째 그림에서 색칠하지 않은 삼각형은 색칠한 삼각형보다 몇 개 더 많은지 구하세요.`,
    visual: { kind: "g1-triangle-color-difference", target },
    answer: `${target}개`,
    solution: `${target}번째 그림의 색칠하지 않은 삼각형은 ${white}개, 색칠한 삼각형은 ${filled}개입니다. 차이는 ${white} - ${filled} = ${target}개입니다.`,
    meta: { difficulty, target, white, filled }
  };
}

function g1SummerSquareSideComposition({ difficulty = 2 }) {
  const targetUnits = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
  const unit = difficulty === 3 ? 2 : 1;
  const answer = targetUnits * unit;
  return {
    prompt: "다음 그림은 정사각형을 붙여 만든 직사각형입니다. 정사각형 ㉠의 한 변의 길이가 주어진 길이일 때, 색칠한 정사각형 ㉡의 한 변의 길이를 구하세요.",
    visual: { kind: "g1-summer-square-composition", targetUnits, unit },
    answer: `${answer}cm`,
    solution: `㉠의 한 변을 ${unit}cm로 보면, ㉡의 한 변은 같은 작은 정사각형 ${targetUnits}개를 이은 길이입니다. 따라서 ${unit}×${targetUnits}=${answer}이므로 ${answer}cm입니다.`,
    meta: { difficulty, targetUnits, unit, answer }
  };
}

function g1SummerFoldCutTriangleCount({ difficulty = 2 }) {
  // 이 문항은 자르는 선과 접는 순서가 답을 결정한다. 검증하지 않은 절단 변형은 만들지 않는다.
  const templates = [{ triangles: 6, diagonal: "left" }];
  const { triangles, diagonal } = sample(templates);
  return {
    prompt: "다음과 같이 정사각형 색종이를 가로와 세로로 두 번 접어 선을 따라 자릅니다. 색종이를 펼치면 삼각형이 몇 개 나오는지 구하세요.",
    visual: { kind: "g1-summer-fold-cut-triangles", triangles, diagonal },
    answer: `${triangles}개`,
    solution: `두 번 접으면 같은 부분이 4겹이 됩니다. 대각선으로 자른 선이 펼쳐질 때 나뉘는 삼각형을 차례로 세면 모두 ${triangles}개입니다.`,
    meta: { difficulty, triangles, diagonal }
  };
}

function g1SummerFourSymbolRelation({ difficulty = 2 }) {
  // 원본과 같은 세 식은 1~9의 서로 다른 네 수에서 한 가지 값으로만 정해진다.
  const multiplier = difficulty === 1 ? 1 : difficulty === 2 ? 1 : 1;
  const star = 4 * multiplier;
  const square = 1 * multiplier;
  const diamond = 5 * multiplier;
  const circle = 3 * multiplier;
  return {
    prompt: "다음 각 도형은 1에서 9까지의 서로 다른 네 수를 나타냅니다. 네모가 나타내는 수를 구하세요.",
    visual: { kind: "g1-summer-four-symbol-relation" },
    answer: String(square),
    solution: `별 3개와 원 4개의 값이 같고, 별 2개는 마름모와 원의 합입니다. 1부터 9까지의 서로 다른 수를 넣어 맞추면 별은 ${star}, 원은 ${circle}, 마름모는 ${diamond}입니다. 따라서 네모는 ${diamond}-${star}=${square}입니다.`,
    meta: { difficulty, star, square, diamond, circle }
  };
}

function g1SummerShapeHeightDualCycle({ difficulty = 2 }) {
  const shapes = ["○", "□", "△", "♡", "◇"];
  const target = difficulty === 1 ? 19 : difficulty === 2 ? 29 : 39;
  const shape = shapes[(target - 1) % shapes.length];
  const height = (target - 1) % 4 + 1;
  const items = Array.from({ length: 16 }, (_, index) => ({ shape: shapes[index % shapes.length], height: index % 4 + 1, number: index + 1 }));
  return {
    prompt: `다음 모양을 일정한 규칙에 따라 나열했습니다. 규칙을 찾아 ${target}번째 모양을 그리세요.`,
    visual: { kind: "g1-summer-shape-height-cycle", items, target },
    answer: `${shape} ${height}개`,
    solution: `모양은 ○, □, △, ♡, ◇의 5개 주기로 반복되고, 쌓인 높이는 1개부터 4개까지의 4개 주기로 반복됩니다. ${target}번째는 ${shape}이 ${height}개 쌓인 모양입니다.`,
    meta: { difficulty, shapes, target, shape, height }
  };
}

function g1SummerOrangeRatioDistribution({ difficulty = 2 }) {
  const adults = difficulty === 1 ? 10 : difficulty === 2 ? 17 : 24;
  const children = adults * 3;
  const people = children + adults;
  const oranges = children / 3 + adults * 3;
  return {
    prompt: `${people}명의 어린이와 어른이 ${oranges}개의 귤을 나누어 먹습니다. 어린이는 3명이 귤 1개를 나누어 먹고, 어른은 1명이 귤 3개를 먹습니다. 어린이와 어른은 각각 몇 명인지 구하세요.`,
    visual: { kind: "g1-summer-orange-ratio", people, oranges },
    answer: `어린이 ${children}명, 어른 ${adults}명`,
    solution: `어른을 ${adults}명이라 하면 귤을 ${adults}×3=${adults * 3}개 먹습니다. 남은 귤 ${oranges - adults * 3}개는 어린이 ${children}명이 3명씩 나누어 먹는 양입니다. 따라서 어린이는 ${children}명, 어른은 ${adults}명입니다.`,
    meta: { difficulty, children, adults, people, oranges }
  };
}

function g1SummerRectilinearPerimeter({ difficulty = 2 }) {
  const templates = difficulty === 1
    ? [{ height: 8, top: 7, inner: 6, lower: 10 }]
    : difficulty === 2
      ? [{ height: 10, top: 9, inner: 8, lower: 13 }]
      : [{ height: 12, top: 11, inner: 9, lower: 15 }];
  const { height, top, inner, lower } = sample(templates);
  const notch = inner - lower + top;
  const answer = 2 * (height + top + inner);
  return {
    prompt: "다음 직각으로 꺾인 도형의 둘레의 길이를 구하세요.",
    visual: { kind: "g1-summer-rectilinear-perimeter", height, top, inner, lower, notch },
    answer: `${answer}cm`,
    solution: `세로 길이는 위아래를 합쳐 ${height}cm가 두 번이므로 ${height * 2}cm입니다. 가로 길이는 위쪽 ${top}cm와 안쪽 ${inner}cm가 양쪽에 한 번씩 있어 ${2 * (top + inner)}cm입니다. 따라서 둘레는 ${height * 2}+${2 * (top + inner)}=${answer}cm입니다.`,
    meta: { difficulty, height, top, inner, lower, notch, answer }
  };
}

function g1SummerOppositeStepSequences({ difficulty = 2 }) {
  const templates = difficulty === 1
    ? [{ topStart: 2, topStep: 2, topLast: 40, bottomStart: 300, bottomStep: -5 }]
    : difficulty === 2
      ? [{ topStart: 1, topStep: 3, topLast: 79, bottomStart: 500, bottomStep: -7 }]
      : [{ topStart: 4, topStep: 4, topLast: 100, bottomStart: 700, bottomStep: -9 }];
  const { topStart, topStep, topLast, bottomStart, bottomStep } = sample(templates);
  const moves = (topLast - topStart) / topStep;
  const answer = bottomStart + moves * bottomStep;
  return {
    prompt: "다음 표는 일정한 규칙에 따라 만들어진 것입니다. ㉠에 알맞은 수를 구하세요.",
    visual: { kind: "g1-summer-opposite-sequences", topStart, topStep, topLast, bottomStart, bottomStep },
    answer: String(answer),
    solution: `윗줄은 ${topStep}씩 커져 ${topStart}에서 ${topLast}까지 ${moves}번 움직입니다. 아랫줄은 한 칸마다 ${Math.abs(bottomStep)}씩 작으므로 ${bottomStart}-${Math.abs(bottomStep)}×${moves}=${answer}입니다.`,
    meta: { difficulty, topStart, topStep, topLast, bottomStart, bottomStep, moves, answer }
  };
}

function g1FallLinearInputOutputTable({ difficulty = 2 }) {
  const templates = difficulty === 1
    ? [{ startOutput: 3, step: 4, targetInput: 24, anchorInputs: [1, 2, 4, 7] }]
    : difficulty === 2
      ? [{ startOutput: 5, step: 6, targetInput: 46, anchorInputs: [1, 5, 7] }]
      : [{ startOutput: 7, step: 8, targetInput: 68, anchorInputs: [1, 4, 9] }];
  const { startOutput, step, targetInput, anchorInputs } = sample(templates);
  const outputFor = (input) => startOutput + (input - 1) * step;
  const anchors = anchorInputs.map((input) => ({ input, output: outputFor(input) }));
  const answer = outputFor(targetInput);
  return {
    prompt: "윗줄의 수가 1씩 커질 때 아랫줄의 수도 같은 규칙으로 커집니다. ㉠에 알맞은 수를 구하세요.",
    visual: { kind: "g1-fall-linear-table", anchors, targetInput },
    answer: String(answer),
    solution: `윗줄의 수가 1 커질 때마다 아랫줄의 수는 ${step}씩 커집니다. 윗줄의 1에서 ${targetInput}까지 ${targetInput - 1}칸 움직이므로 ${startOutput}에서 ${step}을 ${targetInput - 1}번 더한 ${answer}입니다.`,
    meta: { difficulty, startOutput, step, targetInput, anchors, answer }
  };
}

function g1FallThreePersonTotalTransfer({ difficulty = 2 }) {
  const transfer = randomInt(difficulty === 1 ? 2 : 3, difficulty === 3 ? 7 : 5);
  const lower = randomInt(difficulty === 1 ? 3 : 5, difficulty === 3 ? 16 : 12);
  const higher = lower + transfer * 2;
  const fixed = randomInt(4, difficulty === 3 ? 14 : 10);
  const total = fixed + lower + higher;
  const names = shuffle(["하윤", "윤하", "석호", "민서", "지우", "서준"]);
  const [fixedName, higherName, lowerName] = names;
  return {
    prompt: `${fixedName}·${higherName}·${lowerName}가 가진 구슬은 모두 ${total}개입니다. ${fixedName}는 ${fixed}개를 가지고 있습니다. ${higherName}가 ${lowerName}에게 ${transfer}개를 주면 두 사람이 가진 구슬 수가 같아집니다. ${higherName}가 처음에 가진 구슬은 몇 개인지 구하세요.`,
    visual: { kind: "g1-fall-three-person-transfer", people: [{ name: fixedName, count: fixed }, { name: higherName, count: null }, { name: lowerName, count: null }], transfer },
    answer: `${higher}개`,
    solution: `${higherName}와 ${lowerName}가 가진 구슬은 ${total}-${fixed}=${higher + lower}개입니다. ${transfer}개를 준 뒤 같아지므로 두 사람은 각각 ${(higher + lower) / 2}개가 됩니다. ${higherName}는 주기 전에는 ${transfer}개 더 많았으므로 ${higher}개입니다.`,
    meta: { difficulty, total, fixed, transfer, higher, lower, fixedName, higherName, lowerName, answer: higher }
  };
}

function numberSetOffsetSolutions(cards, offsets) {
  return cards.filter((start) => offsets.every((offset) => cards.includes(start + offset)));
}

function g1FallNumberSetOffsetChain({ difficulty = 2 }) {
  const offsetSets = difficulty === 1 ? [[0, 1, 2, -1]] : difficulty === 2 ? [[0, 1, 3, -1]] : [[0, 2, 5, -1]];
  const offsets = sample(offsetSets);
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const start = randomInt(2, difficulty === 3 ? 4 : 6);
    const required = offsets.map((offset) => start + offset);
    if (Math.min(...required) < 0 || Math.max(...required) > 9 || new Set(required).size !== 4) continue;
    const extras = shuffle(Array.from({ length: 10 }, (_, value) => value).filter((value) => !required.includes(value))).slice(0, 3);
    const cards = [...required, ...extras].sort((a, b) => a - b);
    const solutions = numberSetOffsetSolutions(cards, offsets);
    if (solutions.length !== 1) continue;
    const values = offsets.map((offset) => start + offset);
    const answer = values[0] + values[3];
    return {
      prompt: "수 카드 중에서 조건을 모두 만족하는 네 수 ㉠, ㉡, ㉢, ㉣을 찾으세요. ㉠과 ㉣의 합을 구하세요.",
      visual: { kind: "g1-fall-number-set-chain", cards, offsets, conditions: [`㉡은 ㉠보다 ${offsets[1]} 큽니다.`, `㉢은 ㉡보다 ${offsets[2] - offsets[1]} 큽니다.`, `㉣은 ㉢보다 ${offsets[2] - offsets[3]} 작습니다.`] },
      answer: String(answer),
      solution: `조건을 차례로 맞추면 ㉠=${values[0]}, ㉡=${values[1]}, ㉢=${values[2]}, ㉣=${values[3]}입니다. 따라서 ㉠과 ㉣의 합은 ${values[0]}+${values[3]}=${answer}입니다.`,
      meta: { difficulty, cards, offsets, values, candidateCount: solutions.length, answer }
    };
  }
  return null;
}

function g1FallFourByFourLatinTwoTarget({ difficulty = 2 }) {
  const source = [1, 4, 2, 3, 3, 2, 4, 1, 4, 1, 3, 2, 2, 3, 1, 4];
  const digitOrder = shuffle([1, 2, 3, 4]);
  const mapDigit = (value) => digitOrder[value - 1];
  const grid = source.map(mapDigit);
  const clueIndices = difficulty === 1 ? [0, 1, 5, 10, 12, 15] : [0, 5, 10, 12, 15];
  const targetIndices = [3, 6];
  const answerDigits = targetIndices.map((index) => grid[index]);
  return {
    prompt: "가로와 세로의 네 칸에 1, 2, 3, 4를 각각 한 번씩 넣습니다. ㉠과 ㉡에 알맞은 수를 이어 쓴 두 자리 수를 구하세요.",
    visual: { kind: "g1-fall-latin-two-target", size: 4, grid, clueIndices, targetIndices },
    answer: answerDigits.join(""),
    solution: `각 가로줄과 세로줄에서 빠진 수를 차례로 찾으면 ㉠=${answerDigits[0]}, ㉡=${answerDigits[1]}입니다. 이어 쓰면 ${answerDigits.join("")}입니다.`,
    meta: { difficulty, grid, clueIndices, targetIndices, answerDigits, answer: Number(answerDigits.join("")) }
  };
}

function g1FallPentagonAdjacentProductsAll({ difficulty = 2 }) {
  const range = difficulty === 1 ? [2, 3, 4, 5, 6] : difficulty === 2 ? [4, 5, 7, 8, 9] : shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5);
  const values = shuffle(range);
  const products = values.map((value, index) => value * values[(index + 1) % values.length]);
  return {
    prompt: "오각형의 원에는 2부터 9까지의 서로 다른 자연수가 들어갑니다. 네모의 수는 양쪽 원에 있는 두 수의 곱입니다. 다섯 원에 알맞은 수를 모두 써넣으세요.",
    visual: { kind: "g1-fall-pentagon-products-all", values, products },
    answer: values.join(", "),
    solution: `이웃한 두 곱의 공통 수를 먼저 찾고 차례로 나눕니다. 위에서 시작해 시계 반대 방향으로 쓰면 ${values.join(", ")}입니다.`,
    meta: { difficulty, values, products, answer: values }
  };
}

function g1FallFourByFourShapeSumFourTargets({ difficulty = 2 }) {
  const candidates = difficulty === 1 ? [1, 2, 3, 4] : difficulty === 2 ? [2, 3, 4, 5] : shuffle([1, 2, 3, 4, 5, 6, 7]).slice(0, 4);
  const [diamond, circle, square, star] = shuffle(candidates);
  const cells = [circle, diamond, diamond, circle, circle, square, circle, star, circle, square, square, star, diamond, star, square, square];
  const rowSums = Array.from({ length: 4 }, (_, row) => cells.slice(row * 4, row * 4 + 4).reduce((sum, value) => sum + value, 0));
  const columnSums = Array.from({ length: 4 }, (_, column) => cells.filter((_, index) => index % 4 === column).reduce((sum, value) => sum + value, 0));
  const answer = [rowSums[1], rowSums[3], columnSums[1], columnSums[3]];
  return {
    prompt: "같은 도형은 같은 수를 나타냅니다. 오른쪽과 아래쪽의 빈칸에 들어갈 네 수를 위에서 아래, 왼쪽에서 오른쪽 순서로 구하세요.",
    visual: { kind: "g1-fall-shape-sum-four-targets", symbols: ["○", "◇", "◇", "○", "○", "□", "○", "☆", "○", "□", "□", "☆", "◇", "☆", "□", "□"], rowSums, columnSums, hiddenRows: [1, 3], hiddenColumns: [1, 3] },
    answer: answer.join(", "),
    solution: `보이는 가로·세로 합으로 도형 값을 차례로 찾습니다. 빈 가로 합은 ${rowSums[1]}, ${rowSums[3]}이고 빈 세로 합은 ${columnSums[1]}, ${columnSums[3]}이므로 답은 ${answer.join(", ")}입니다.`,
    meta: { difficulty, values: { circle, diamond, square, star }, cells, rowSums, columnSums, answer }
  };
}

function g1FallFourShortOneLongRods({ difficulty = 2 }) {
  const short = difficulty === 1 ? randomInt(3, 6) : difficulty === 2 ? randomInt(5, 9) : randomInt(8, 14);
  const long = short * 4;
  const total = short + long;
  return {
    prompt: "짧은 막대 4개의 길이는 긴 막대 1개의 길이와 같습니다. 짧은 막대와 긴 막대를 하나씩 이었더니 전체 길이가 다음과 같습니다. 두 막대의 길이를 각각 구하세요.",
    visual: { kind: "g1-fall-four-one-rods", shortCount: 4, total },
    answer: `㉠=${short}cm, ㉡=${long}cm`,
    solution: `전체 ${total}cm는 짧은 막대 5개와 같습니다. 하나는 ${short}cm이고 긴 막대는 그 4개 길이인 ${long}cm입니다.`,
    meta: { difficulty, short, long, total, answer: [short, long] }
  };
}

function g1FallStackedSquareSideChain({ difficulty = 2 }) {
  const unit = difficulty === 1 ? randomInt(2, 4) : difficulty === 2 ? randomInt(3, 6) : randomInt(5, 9);
  const big = unit * 3;
  const medium = unit * 2;
  return {
    prompt: `가·나·다·라는 모두 정사각형이고, 가의 한 변은 ${big}cm입니다. 나와 다의 한 변의 길이를 각각 구하세요.`,
    visual: { kind: "g1-fall-stacked-square-sides", unit, big, medium },
    answer: `나=${medium}cm, 다=${unit}cm`,
    solution: `가의 한 변은 작은 정사각형 3개의 길이와 같습니다. 작은 다의 한 변은 ${big}÷3=${unit}cm이고, 나는 작은 정사각형 2개의 길이이므로 ${medium}cm입니다.`,
    meta: { difficulty, unit, big, medium, answer: [medium, unit] }
  };
}

function g1FallAaAbCccShapeAddition({ difficulty = 2 }) {
  const symbols = shuffle(["○", "□", "◇", "☆", "△"]);
  const [aSymbol, bSymbol, cSymbol] = symbols;
  const swapRows = difficulty === 3 && Math.random() < 0.5;
  const first = swapRows ? [aSymbol, bSymbol] : [aSymbol, aSymbol];
  const second = swapRows ? [aSymbol, aSymbol] : [aSymbol, bSymbol];
  return {
    prompt: "같은 모양은 같은 숫자를 나타냅니다. 세 모양이 나타내는 숫자를 모두 구하세요.",
    visual: { kind: "cryptarithm-vertical", first, second, sum: [cSymbol, cSymbol, cSymbol] },
    answer: `${aSymbol}=5, ${bSymbol}=6, ${cSymbol}=1`,
    solution: `백의 자리 ${cSymbol}은 받아올림 1입니다. 십의 자리에서 ${aSymbol}+${aSymbol}+1=11이므로 ${aSymbol}=5이고, 일의 자리에서 5+${bSymbol}=11이므로 ${bSymbol}=6입니다.`,
    meta: { difficulty, symbols: { aSymbol, bSymbol, cSymbol }, values: { a: 5, b: 6, c: 1 }, answer: [5, 6, 1] }
  };
}

function g1FallThreeFoldCreaseCutCount({ difficulty = 2 }) {
  const diagonal = Math.random() < 0.5 ? "down" : "up";
  const folds = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
  const pieces = 2 ** folds;
  return {
    prompt: `색종이를 그림처럼 ${folds}번 접었다가 완전히 펼쳤습니다. 접힌 선을 따라 모두 자르면 몇 조각이 되는지 구하세요.`,
    visual: { kind: "g1-fall-three-fold-crease-cut", folds, diagonal },
    answer: `${pieces}개`,
    solution: `접을 때마다 펼친 뒤의 조각 수가 두 배가 됩니다. ${folds}번 접었으므로 ${Array.from({ length: folds }, () => 2).join("×")}=${pieces}조각입니다.`,
    meta: { difficulty, folds, diagonal, pieces, answer: pieces }
  };
}

function g1FallTotalTripleShare({ difficulty = 2 }) {
  const smaller = difficulty === 1 ? randomInt(4, 7) : difficulty === 2 ? randomInt(6, 11) : randomInt(10, 18);
  const larger = smaller * 3;
  const total = smaller + larger;
  const [largerName, smallerName] = shuffle(["재석", "광수", "민준", "도윤"]);
  return {
    prompt: `${largerName}와 ${smallerName}가 딱지 ${total}장을 나누어 가졌습니다. ${largerName}가 가진 딱지는 ${smallerName}가 가진 딱지의 3배입니다. ${largerName}는 몇 장을 가졌는지 구하세요.`,
    visual: { kind: "g1-fall-triple-share", total, largerName, smallerName },
    answer: `${larger}장`,
    solution: `전체를 3묶음과 1묶음으로 나누면 한 묶음은 ${total}÷4=${smaller}장입니다. ${largerName}는 3묶음이므로 ${larger}장입니다.`,
    meta: { difficulty, total, smaller, larger, largerName, smallerName, answer: larger }
  };
}

function maskedAdditionSolutions(rows) {
  const slots = [];
  rows.forEach((row, rowIndex) => row.forEach((digit, columnIndex) => {
    if (digit === null) slots.push([rowIndex, columnIndex]);
  }));
  const solutions = [];
  const working = rows.map((row) => [...row]);
  const visit = (index) => {
    if (solutions.length > 1) return;
    if (index === slots.length) {
      if (working.some((row) => row[0] === 0)) return;
      const values = working.map((row) => Number(row.join("")));
      if (values[0] + values[1] === values[2]) solutions.push(working.map((row) => [...row]));
      return;
    }
    const [row, column] = slots[index];
    for (let digit = 0; digit <= 9; digit += 1) {
      if (column === 0 && digit === 0) continue;
      working[row][column] = digit;
      visit(index + 1);
    }
    working[row][column] = null;
  };
  visit(0);
  return solutions;
}

function g1FallFourBlankAddition({ difficulty = 2 }) {
  const threeTwo = Array.from({ length: 8 }, (_, index) => {
    const hundreds = index + 1;
    return Math.random() < 0.5
      ? [hundreds * 100 + 9, 10, hundreds * 100 + 19]
      : [hundreds * 100 + 91, 99, (hundreds + 1) * 100 + 90];
  });
  const threeThree = [[766, 152, 918], ...Array.from({ length: 40 }, (_, index) => [701 + index, 199 - index, 900])];
  const pool = difficulty === 1 ? threeTwo : difficulty === 2 ? [...threeTwo, ...threeThree] : threeThree;
  for (const [first, second, total] of shuffle(pool)) {
    const template = second < 100 ? "three-two" : "three-three";
    const fullRows = [String(first).split("").map(Number), String(second).split("").map(Number), String(total).split("").map(Number)];
    const masks = template === "three-two" ? [[0, 1], [1, 0], [1, 1], [2, 2]] : [[0, 1], [1, 0], [1, 2], [2, 0]];
    const shownRows = fullRows.map((row) => [...row]);
    masks.forEach(([row, column]) => { shownRows[row][column] = null; });
    const solutions = maskedAdditionSolutions(shownRows);
    if (solutions.length !== 1) continue;
    const hiddenDigits = masks.map(([row, column]) => fullRows[row][column]);
    return {
      prompt: "세로셈의 네모에 들어갈 숫자를 위에서 아래, 왼쪽에서 오른쪽 순서로 쓰세요.",
      visual: { kind: "g1-fall-four-blank-addition", rows: shownRows },
      answer: hiddenDigits.join(", "),
      solution: `일의 자리부터 받아올림을 확인하면 완성된 식은 ${first}+${second}=${total}입니다. 네모의 숫자는 ${hiddenDigits.join(", ")}입니다.`,
      meta: { difficulty, template, fullRows, shownRows, masks, hiddenDigits, candidateCount: solutions.length, answer: hiddenDigits }
    };
  }
  return null;
}

function g1FallSquareChainShadedPerimeter({ difficulty = 2 }) {
  const unit = difficulty === 1 ? randomInt(2, 4) : difficulty === 2 ? randomInt(4, 7) : randomInt(6, 10);
  const totalWidth = unit * 7;
  const perimeter = unit * 4;
  return {
    prompt: `정사각형을 그림과 같이 붙였더니 전체 가로 길이가 ${totalWidth}cm가 되었습니다. 색칠한 정사각형의 둘레를 구하세요.`,
    visual: { kind: "g1-fall-square-chain-perimeter", unit, totalWidth },
    answer: `${perimeter}cm`,
    solution: `전체 가로 길이는 작은 정사각형 한 변의 7배입니다. 한 변은 ${totalWidth}÷7=${unit}cm이므로 둘레는 ${unit}+${unit}+${unit}+${unit}=${perimeter}cm입니다.`,
    meta: { difficulty, unit, totalWidth, perimeter, answer: perimeter }
  };
}

function g1FallAlternatingResultCryptarithm({ difficulty = 2 }) {
  const patterns = [["AAB", "CB"], ["ABA", "BC"], ["ABB", "BB"], ["ABC", "BA"], ["ACB", "AB"]];
  const [firstPattern, secondPattern] = sample(patterns);
  const glyphs = shuffle(["□", "○", "☆", "◇", "△"]);
  const symbolMap = { A: glyphs[0], B: glyphs[1], C: glyphs[2], D: glyphs[3] };
  const valueMap = { A: 9, B: 5, C: 1, D: 0 };
  const symbols = (pattern) => [...pattern].map((key) => symbolMap[key]);
  const number = (pattern) => Number([...pattern].map((key) => valueMap[key]).join(""));
  const first = number(firstPattern);
  const second = number(secondPattern);
  return {
    prompt: "같은 모양은 같은 숫자를 나타냅니다. 세로셈을 완성하세요.",
    visual: { kind: "cryptarithm-vertical", first: symbols(firstPattern), second: symbols(secondPattern), sum: symbols("CDCD") },
    answer: `${first}+${second}=1010`,
    solution: `일의 자리부터 받아올림을 맞추면 ${symbolMap.A}=9, ${symbolMap.B}=5, ${symbolMap.C}=1, ${symbolMap.D}=0입니다. 따라서 ${first}+${second}=1010입니다.`,
    meta: { difficulty, firstPattern, secondPattern, symbolMap, valueMap, first, second, total: 1010, candidateCount: 1, answer: [first, second, 1010] }
  };
}

function g1FallConsecutiveThreeSumCompletion({ difficulty = 2 }) {
  const middle = randomInt(difficulty === 1 ? 20 : 50, difficulty === 3 ? 149 : 99);
  const values = [middle - 1, middle, middle + 1];
  const total = middle * 3;
  const visibleDigits = difficulty === 1 ? 2 : difficulty === 2 ? 1 : 0;
  return {
    prompt: "세로셈의 세 수는 차례로 이어지는 수입니다. 빈칸을 채워 세로셈을 완성하세요.",
    visual: { kind: "g1-fall-consecutive-three-sum", values, total, visibleDigits },
    answer: `${values.join("+")}=${total}`,
    solution: `세 수의 가운데 수는 ${total}을 똑같이 3묶음으로 나눈 ${middle}입니다. 앞뒤 수는 ${middle - 1}, ${middle + 1}이므로 ${values.join("+")}=${total}입니다.`,
    meta: { difficulty, middle, values, total, visibleDigits, answer: values }
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
  g1HeightOrderFour,
  g1TwoDigitOnesGreater,
  g1FrontBackBetween,
  g1ShapeAddSubtractChain,
  g1FoldCutPieceCount,
  g1RepeatedDigitAddition,
  g1MultiplicativeSymbolChain,
  g1BalanceThreeRelations,
  g1SummerEqualizeTransfer,
  g1SummerTwoDigitSumGap,
  g1SummerHeightOrderFive,
  g1SummerBalanceShapeChain,
  g1SummerFiveBoxWeightOrder,
  g1SummerFourShapeAddSubtract,
  g1SummerPentagonAdjacentProduct,
  g1SummerFourByFourShapeSum,
  g1SummerCirclePointSegments,
  g1SummerFourByFourShapeSumBottom,
  g1SummerVerticalShapeAddition,
  g1SummerOneToThreeRods,
  g1SummerTriangularColorDifference,
  g1SummerSquareSideComposition,
  g1SummerFoldCutTriangleCount,
  g1SummerFourSymbolRelation,
  g1SummerShapeHeightDualCycle,
  g1SummerOrangeRatioDistribution,
  g1SummerRectilinearPerimeter,
  g1SummerOppositeStepSequences,
  g1FallLinearInputOutputTable,
  g1FallThreePersonTotalTransfer,
  g1FallNumberSetOffsetChain,
  g1FallFourByFourLatinTwoTarget,
  g1FallPentagonAdjacentProductsAll,
  g1FallFourByFourShapeSumFourTargets,
  g1FallFourShortOneLongRods,
  g1FallStackedSquareSideChain,
  g1FallAaAbCccShapeAddition,
  g1FallThreeFoldCreaseCutCount,
  g1FallTotalTripleShare,
  g1FallFourBlankAddition,
  g1FallSquareChainShadedPerimeter,
  g1FallAlternatingResultCryptarithm,
  g1FallConsecutiveThreeSumCompletion,
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
