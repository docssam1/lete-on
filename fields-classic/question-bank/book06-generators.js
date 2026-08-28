// 더클래식 1과정 6권 전용 생성기.
// 원본 문항의 풀이 구조와 인쇄 문제 번호를 기준으로 새 수치와 도형을 만든다.

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];
const sum = (items) => items.reduce((total, value) => total + value, 0);
const product = (items) => items.reduce((total, value) => total * value, 1);

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = randomInt(0, index);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function gcd(first, second) {
  let a = Math.abs(first);
  let b = Math.abs(second);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function firstUnique(items, keyOf) {
  const counts = new Map();
  items.forEach((item) => counts.set(keyOf(item), (counts.get(keyOf(item)) || 0) + 1));
  return items.find((item) => counts.get(keyOf(item)) === 1) || null;
}

function cellKey([x, y]) {
  return `${x}:${y}`;
}

function cellPerimeter(cells) {
  const occupied = new Set(cells.map(cellKey));
  let edges = 0;
  cells.forEach(([x, y]) => {
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
      if (!occupied.has(`${x + dx}:${y + dy}`)) edges += 1;
    });
  });
  return edges;
}

function expressionProblem({ prompt, expression, answer, solution, family, meta = {}, values = [] }) {
  return {
    prompt,
    visual: { kind: "book6", subtype: "expression", expression, values },
    answer: String(answer),
    solution,
    meta: { family, answer, ...meta }
  };
}

function numberLineMidpointBook6({ difficulty = 2 }) {
  const step = randomInt(2, difficulty === 3 ? 12 : 8);
  const radius = randomInt(difficulty === 1 ? 2 : 3, difficulty === 3 ? 6 : 4);
  const midpoint = randomInt(radius * step + 2, difficulty === 3 ? 90 : 50);
  const left = midpoint - radius * step;
  const right = midpoint + radius * step;
  return {
    prompt: `${left}와 ${right}의 한가운데에 있는 수를 구하세요.`,
    visual: { kind: "book6", subtype: "number-line", start: left, step, intervals: radius * 2, labels: { 0: left, [radius]: "?", [radius * 2]: right }, target: radius },
    answer: String(midpoint),
    solution: `${left}에서 ${right}까지를 똑같이 둘로 나누면 한가운데 수는 ${midpoint}입니다.`,
    meta: { family: "number-line-midpoint", left, right, step, radius, answer: midpoint }
  };
}

function numberLineUnitDistanceBook6({ difficulty = 2 }) {
  const intervals = randomInt(difficulty === 1 ? 3 : 4, difficulty === 3 ? 9 : 7);
  const unit = randomInt(2, difficulty === 3 ? 12 : 8);
  const start = randomInt(0, difficulty === 3 ? 30 : 15);
  const end = start + intervals * unit;
  return {
    prompt: `${start}에서 ${end}까지를 똑같이 ${intervals}칸으로 나누었습니다. 한 칸의 길이는 얼마인가요?`,
    visual: { kind: "book6", subtype: "number-line", start, step: unit, intervals, labels: { 0: start, [intervals]: end }, target: null },
    answer: String(unit),
    solution: `전체 거리 ${end - start}를 ${intervals}칸으로 똑같이 나누면 한 칸은 ${unit}입니다.`,
    meta: { family: "number-line-unit", start, end, intervals, answer: unit }
  };
}

function numberLineTwoPartDistance({ difficulty = 2 }) {
  const leftIntervals = randomInt(2, difficulty === 3 ? 6 : 4);
  const rightIntervals = randomInt(2, difficulty === 3 ? 7 : 5);
  const leftUnit = randomInt(2, difficulty === 3 ? 9 : 6);
  let rightUnit = randomInt(2, difficulty === 3 ? 10 : 7);
  if (rightUnit === leftUnit) rightUnit += 1;
  const answer = leftIntervals * leftUnit + rightIntervals * rightUnit;
  return {
    prompt: `가에서 나까지는 한 칸이 ${leftUnit}인 ${leftIntervals}칸이고, 나에서 다까지는 한 칸이 ${rightUnit}인 ${rightIntervals}칸입니다. 가에서 다까지의 거리를 구하세요.`,
    visual: { kind: "book6", subtype: "split-number-line", sections: [{ label: "가-나", intervals: leftIntervals, unit: leftUnit }, { label: "나-다", intervals: rightIntervals, unit: rightUnit }] },
    answer: String(answer),
    solution: `가-나는 ${leftIntervals * leftUnit}, 나-다는 ${rightIntervals * rightUnit}이므로 전체 거리는 ${answer}입니다.`,
    meta: { family: "number-line-two-part", leftIntervals, rightIntervals, leftUnit, rightUnit, answer }
  };
}

function rodDifferenceMeasureCount({ difficulty = 2 }) {
  const difference = randomInt(2, difficulty === 3 ? 9 : 6);
  const short = randomInt(difference + 2, difficulty === 3 ? 20 : 14);
  const long = short + difference;
  const count = randomInt(difficulty === 1 ? 3 : 5, difficulty === 3 ? 14 : 10);
  const target = difference * count;
  return {
    prompt: `${long}cm 막대와 ${short}cm 막대의 길이 차이로 ${target}cm를 재려면 몇 번 재어야 하나요?`,
    visual: { kind: "book6", subtype: "rods", rods: [{ label: "긴 막대", count: long, tone: "green" }, { label: "짧은 막대", count: short, tone: "yellow" }, { label: "길이 차", count: difference, repeat: count, tone: "blue" }] },
    answer: `${count}번`,
    solution: `두 막대의 차이는 ${long}-${short}=${difference}cm입니다. ${difference}cm씩 ${count}번이면 ${target}cm입니다.`,
    meta: { family: "rod-difference", long, short, difference, target, answer: count }
  };
}

function equivalentFractionChain({ difficulty = 2 }) {
  let numerator = randomInt(1, difficulty === 3 ? 8 : 5);
  let denominator = randomInt(numerator + 1, difficulty === 3 ? 12 : 9);
  const common = gcd(numerator, denominator);
  numerator /= common;
  denominator /= common;
  const factor = randomInt(2, difficulty === 3 ? 9 : 6);
  const hideNumerator = Math.random() < 0.5;
  const answer = hideNumerator ? numerator * factor : denominator * factor;
  return {
    prompt: `두 분수의 크기가 같습니다. 빈칸에 알맞은 수를 쓰세요.`,
    visual: { kind: "book6", subtype: "fraction-chain", left: [numerator, denominator], right: [hideNumerator ? "?" : numerator * factor, hideNumerator ? denominator * factor : "?"], symbol: "=" },
    answer: String(answer),
    solution: `분자와 분모에 똑같이 ${factor}를 곱하므로 빈칸은 ${answer}입니다.`,
    meta: { family: "equivalent-fraction", numerator, denominator, factor, hideNumerator, answer }
  };
}

function equivalentRatioChain({ difficulty = 2 }) {
  let first = randomInt(1, difficulty === 3 ? 9 : 6);
  let second = randomInt(1, difficulty === 3 ? 10 : 7);
  const common = gcd(first, second);
  first /= common;
  second /= common;
  if (first === second) second += 1;
  const factor = randomInt(2, difficulty === 3 ? 9 : 6);
  const hideFirst = Math.random() < 0.5;
  const answer = hideFirst ? first * factor : second * factor;
  return {
    prompt: `두 비가 같습니다. 빈칸에 알맞은 수를 쓰세요.`,
    visual: { kind: "book6", subtype: "ratio-chain", left: [first, second], right: [hideFirst ? "?" : first * factor, hideFirst ? second * factor : "?"], symbol: "=" },
    answer: String(answer),
    solution: `앞수와 뒷수에 똑같이 ${factor}를 곱하므로 빈칸은 ${answer}입니다.`,
    meta: { family: "equivalent-ratio", first, second, factor, hideFirst, answer }
  };
}

function barRatioRead({ difficulty = 2 }) {
  let first = randomInt(2, difficulty === 3 ? 8 : 6);
  let second = randomInt(2, difficulty === 3 ? 8 : 6);
  if (first === second) second += 1;
  const common = gcd(first, second);
  const reduced = [first / common, second / common];
  return {
    prompt: `같은 길이의 조각으로 나타낸 가 막대와 나 막대의 길이의 비를 가장 간단하게 나타내세요.`,
    visual: { kind: "book6", subtype: "segmented-bars", bars: [{ label: "가", segments: first }, { label: "나", segments: second }] },
    answer: `${reduced[0]}:${reduced[1]}`,
    solution: `가와 나는 ${first}:${second}이고, 두 수를 ${common}씩 나누면 ${reduced[0]}:${reduced[1]}입니다.`,
    meta: { family: "bar-ratio-read", first, second, common, answer: reduced }
  };
}

function barRatioTotalLength({ difficulty = 2 }) {
  let firstRatio = randomInt(1, difficulty === 3 ? 6 : 4);
  let secondRatio = randomInt(1, difficulty === 3 ? 7 : 5);
  const common = gcd(firstRatio, secondRatio);
  firstRatio /= common;
  secondRatio /= common;
  if (firstRatio === secondRatio) secondRatio += 1;
  const unit = randomInt(2, difficulty === 3 ? 12 : 8);
  const total = (firstRatio + secondRatio) * unit;
  const askFirst = Math.random() < 0.5;
  const answer = (askFirst ? firstRatio : secondRatio) * unit;
  return {
    prompt: `가와 나 막대의 길이의 비는 ${firstRatio}:${secondRatio}이고 두 막대의 길이의 합은 ${total}cm입니다. ${askFirst ? "가" : "나"} 막대의 길이를 구하세요.`,
    visual: { kind: "book6", subtype: "segmented-bars", bars: [{ label: "가", segments: firstRatio }, { label: "나", segments: secondRatio }], totalLabel: `합 ${total}cm` },
    answer: `${answer}cm`,
    solution: `전체 ${firstRatio + secondRatio}칸이 ${total}cm이므로 한 칸은 ${unit}cm입니다. ${askFirst ? "가" : "나"}는 ${answer}cm입니다.`,
    meta: { family: "bar-ratio-total", firstRatio, secondRatio, unit, total, askFirst, answer }
  };
}

function balanceRatioBook6({ difficulty = 2 }) {
  let leftCount = randomInt(1, difficulty === 3 ? 6 : 4);
  let rightCount = randomInt(1, difficulty === 3 ? 6 : 4);
  if (leftCount === rightCount) rightCount += 1;
  const common = gcd(leftCount, rightCount);
  leftCount /= common;
  rightCount /= common;
  const answer = [rightCount, leftCount];
  return {
    prompt: `수평인 저울에서 세모 ${leftCount}개와 동그라미 ${rightCount}개의 무게가 같습니다. 세모 한 개와 동그라미 한 개의 무게의 비를 구하세요.`,
    visual: { kind: "book6", subtype: "balance", left: { shape: "triangle", count: leftCount }, right: { shape: "circle", count: rightCount } },
    answer: `${answer[0]}:${answer[1]}`,
    solution: `세모 ${leftCount}개와 동그라미 ${rightCount}개가 같으므로 한 개의 무게는 개수와 반대의 비인 ${answer[0]}:${answer[1]}입니다.`,
    meta: { family: "balance-ratio", leftCount, rightCount, answer }
  };
}

function balanceWeightRatio({ difficulty = 2 }) {
  let firstRatio = randomInt(1, difficulty === 3 ? 5 : 4);
  let secondRatio = randomInt(1, difficulty === 3 ? 6 : 5);
  const common = gcd(firstRatio, secondRatio);
  firstRatio /= common;
  secondRatio /= common;
  if (firstRatio === secondRatio) secondRatio += 1;
  const unit = randomInt(2, difficulty === 3 ? 10 : 7);
  const total = (firstRatio + secondRatio) * unit;
  const askFirst = Math.random() < 0.5;
  const answer = (askFirst ? firstRatio : secondRatio) * unit;
  return {
    prompt: `세모 한 개와 동그라미 한 개의 무게의 비가 ${firstRatio}:${secondRatio}이고 두 개의 무게의 합은 ${total}g입니다. ${askFirst ? "세모" : "동그라미"} 한 개는 몇 g인가요?`,
    visual: { kind: "book6", subtype: "balance-total", firstRatio, secondRatio, total },
    answer: `${answer}g`,
    solution: `전체 ${firstRatio + secondRatio}칸이 ${total}g이므로 한 칸은 ${unit}g입니다. 따라서 ${answer}g입니다.`,
    meta: { family: "balance-weight", firstRatio, secondRatio, unit, total, askFirst, answer }
  };
}

function symbolSumCardDeduction({ difficulty = 2 }) {
  const values = shuffle(Array.from({ length: difficulty === 3 ? 9 : 7 }, (_, index) => index + 1)).slice(0, 3);
  const equations = [
    ["△", "○", values[0] + values[1]],
    ["○", "□", values[1] + values[2]],
    ["△", "□", values[0] + values[2]]
  ];
  const targetIndex = randomInt(0, 2);
  const symbols = ["△", "○", "□"];
  return {
    prompt: `서로 다른 수 카드 세 장을 도형에 한 장씩 놓았습니다. 식을 보고 ${symbols[targetIndex]}의 수를 구하세요.`,
    visual: { kind: "book6", subtype: "symbol-equations", cards: [...values].sort((a, b) => a - b), equations, target: symbols[targetIndex] },
    answer: String(values[targetIndex]),
    solution: `세 식을 함께 비교하면 ${symbols[0]}=${values[0]}, ${symbols[1]}=${values[1]}, ${symbols[2]}=${values[2]}이므로 답은 ${values[targetIndex]}입니다.`,
    meta: { family: "symbol-sum-deduction", values, equations, targetIndex, answer: values[targetIndex] }
  };
}

function strideRatioTotal({ difficulty = 2 }) {
  let firstSteps = randomInt(2, difficulty === 3 ? 8 : 6);
  let secondSteps = randomInt(2, difficulty === 3 ? 9 : 7);
  if (firstSteps === secondSteps) secondSteps += 1;
  const common = gcd(firstSteps, secondSteps);
  firstSteps /= common;
  secondSteps /= common;
  const firstStrideRatio = secondSteps;
  const secondStrideRatio = firstSteps;
  const unit = randomInt(2, difficulty === 3 ? 8 : 5);
  const strideSum = (firstStrideRatio + secondStrideRatio) * unit;
  const askFirst = Math.random() < 0.5;
  const answer = (askFirst ? firstStrideRatio : secondStrideRatio) * unit;
  return {
    prompt: `같은 거리를 가는 데 가는 ${firstSteps}걸음, 나는 ${secondSteps}걸음이 필요합니다. 두 사람의 한 걸음 길이의 합이 ${strideSum}cm일 때 ${askFirst ? "가" : "나"}의 한 걸음 길이를 구하세요.`,
    visual: { kind: "book6", subtype: "stride", firstSteps, secondSteps, strideSum },
    answer: `${answer}cm`,
    solution: `걸음 수와 한 걸음 길이는 반대의 비이므로 ${firstStrideRatio}:${secondStrideRatio}입니다. 한 칸은 ${unit}cm이므로 답은 ${answer}cm입니다.`,
    meta: { family: "stride-ratio", firstSteps, secondSteps, firstStrideRatio, secondStrideRatio, unit, strideSum, askFirst, answer }
  };
}

function repeatedUnitLengthTotal({ difficulty = 2 }) {
  const firstLength = randomInt(2, difficulty === 3 ? 12 : 8);
  const secondLength = randomInt(2, difficulty === 3 ? 12 : 8);
  const firstCount = randomInt(2, difficulty === 3 ? 9 : 6);
  const secondCount = randomInt(2, difficulty === 3 ? 9 : 6);
  const answer = firstLength * firstCount + secondLength * secondCount;
  return {
    prompt: `${firstLength}cm 막대 ${firstCount}개와 ${secondLength}cm 막대 ${secondCount}개를 겹치지 않게 이어 붙였습니다. 전체 길이를 구하세요.`,
    visual: { kind: "book6", subtype: "rods", rods: [{ label: `${firstLength}cm`, count: firstCount, unit: firstLength, tone: "green" }, { label: `${secondLength}cm`, count: secondCount, unit: secondLength, tone: "yellow" }] },
    answer: `${answer}cm`,
    solution: `${firstLength}×${firstCount}=${firstLength * firstCount}, ${secondLength}×${secondCount}=${secondLength * secondCount}이므로 전체는 ${answer}cm입니다.`,
    meta: { family: "repeated-unit-total", firstLength, secondLength, firstCount, secondCount, answer }
  };
}

function quadrilateralPerimeter({ difficulty = 2 }) {
  const width = randomInt(4, difficulty === 3 ? 18 : 12);
  const height = randomInt(3, Math.min(width - 1, difficulty === 3 ? 14 : 9));
  const perimeter = 2 * (width + height);
  const inverse = difficulty > 1 && Math.random() < 0.5;
  if (inverse) {
    return {
      prompt: `직사각형의 둘레는 ${perimeter}cm이고 가로는 ${width}cm입니다. 세로를 구하세요.`,
      visual: { kind: "book6", subtype: "rectangle", width, height: "?", widthLabel: `${width}cm`, heightLabel: "?", perimeterLabel: `${perimeter}cm` },
      answer: `${height}cm`,
      solution: `가로와 세로의 합은 ${perimeter / 2}cm이므로 세로는 ${perimeter / 2}-${width}=${height}cm입니다.`,
      meta: { family: "quadrilateral-perimeter", mode: "inverse", width, height, perimeter, answer: height }
    };
  }
  return {
    prompt: `가로가 ${width}cm, 세로가 ${height}cm인 직사각형의 둘레를 구하세요.`,
    visual: { kind: "book6", subtype: "rectangle", width, height, widthLabel: `${width}cm`, heightLabel: `${height}cm` },
    answer: `${perimeter}cm`,
    solution: `가로와 세로를 두 번씩 더하면 ${width}+${height}+${width}+${height}=${perimeter}cm입니다.`,
    meta: { family: "quadrilateral-perimeter", mode: "direct", width, height, perimeter, answer: perimeter }
  };
}

function equalSidedQuadrilateralPerimeter({ difficulty = 2 }) {
  const side = randomInt(3, difficulty === 3 ? 18 : 12);
  const perimeter = side * 4;
  const inverse = difficulty > 1 && Math.random() < 0.5;
  const shape = Math.random() < 0.5 ? "정사각형" : "마름모";
  return {
    prompt: inverse ? `${shape}의 둘레가 ${perimeter}cm일 때 한 변의 길이를 구하세요.` : `한 변의 길이가 ${side}cm인 ${shape}의 둘레를 구하세요.`,
    visual: { kind: "book6", subtype: "equal-quadrilateral", shape, sideLabel: inverse ? "?" : `${side}cm`, perimeterLabel: inverse ? `${perimeter}cm` : "" },
    answer: `${inverse ? side : perimeter}cm`,
    solution: inverse ? `${perimeter}cm를 같은 네 변으로 나누면 한 변은 ${side}cm입니다.` : `${side}cm인 변이 네 개이므로 둘레는 ${perimeter}cm입니다.`,
    meta: { family: "equal-quadrilateral", shape, side, perimeter, inverse, answer: inverse ? side : perimeter }
  };
}

function joinedQuadrilateralDimensions({ difficulty = 2 }) {
  const height = randomInt(3, difficulty === 3 ? 12 : 8);
  const leftWidth = randomInt(2, difficulty === 3 ? 10 : 7);
  const rightWidth = randomInt(2, difficulty === 3 ? 11 : 8);
  const totalWidth = leftWidth + rightWidth;
  const perimeter = 2 * (totalWidth + height);
  return {
    prompt: `높이가 같은 두 직사각형을 빈틈없이 붙였습니다. 전체 둘레가 ${perimeter}cm이고 왼쪽 직사각형의 가로가 ${leftWidth}cm, 세로가 ${height}cm일 때 오른쪽 직사각형의 가로를 구하세요.`,
    visual: { kind: "book6", subtype: "joined-rectangles", height, widths: [leftWidth, "?"], perimeterLabel: `${perimeter}cm` },
    answer: `${rightWidth}cm`,
    solution: `붙인 큰 직사각형의 가로와 세로의 합은 ${perimeter / 2}cm입니다. 전체 가로는 ${perimeter / 2}-${height}=${totalWidth}cm이므로 ${totalWidth}-${leftWidth}=${rightWidth}cm입니다.`,
    meta: { family: "joined-dimensions", height, leftWidth, rightWidth, totalWidth, perimeter, answer: rightWidth }
  };
}

function joinedQuadrilateralSide({ difficulty = 2 }) {
  const firstWidth = randomInt(4, difficulty === 3 ? 14 : 10);
  const firstHeight = randomInt(3, difficulty === 3 ? 10 : 7);
  const secondWidth = randomInt(3, difficulty === 3 ? 12 : 8);
  const secondHeight = randomInt(3, difficulty === 3 ? 10 : 7);
  const shared = randomInt(2, Math.min(firstHeight, secondHeight));
  const firstPerimeter = 2 * (firstWidth + firstHeight);
  const secondPerimeter = 2 * (secondWidth + secondHeight);
  const unionPerimeter = firstPerimeter + secondPerimeter - 2 * shared;
  return {
    prompt: `두 직사각형의 둘레가 각각 ${firstPerimeter}cm와 ${secondPerimeter}cm이고, 붙인 도형의 둘레가 ${unionPerimeter}cm입니다. 서로 맞닿은 변의 길이를 구하세요.`,
    visual: { kind: "book6", subtype: "joined-offset", first: [firstWidth, firstHeight], second: [secondWidth, secondHeight], shared: "?" },
    answer: `${shared}cm`,
    solution: `따로 잰 둘레의 합에서 맞닿은 변이 두 번 빠집니다. (${firstPerimeter}+${secondPerimeter}-${unionPerimeter})÷2=${shared}cm입니다.`,
    meta: { family: "joined-shared-side", firstPerimeter, secondPerimeter, unionPerimeter, shared, answer: shared }
  };
}

function joinedRegularShapeSide({ difficulty = 2 }) {
  const firstSides = sample(difficulty === 1 ? [3, 4] : [3, 4, 5, 6]);
  const secondSides = sample(difficulty === 1 ? [3, 4] : [3, 4, 5, 6]);
  const side = randomInt(2, difficulty === 3 ? 12 : 8);
  const outsideEdges = firstSides + secondSides - 2;
  const perimeter = outsideEdges * side;
  return {
    prompt: `한 변의 길이가 같은 정${firstSides}각형과 정${secondSides}각형을 한 변이 겹치게 붙였습니다. 바깥 둘레가 ${perimeter}cm일 때 한 변의 길이를 구하세요.`,
    visual: { kind: "book6", subtype: "attached-polygons", sides: [firstSides, secondSides], sideLabel: "?", perimeterLabel: `${perimeter}cm` },
    answer: `${side}cm`,
    solution: `맞닿은 두 변을 빼면 바깥에는 ${outsideEdges}개의 변이 남습니다. ${perimeter}÷${outsideEdges}=${side}cm입니다.`,
    meta: { family: "joined-regular", firstSides, secondSides, outsideEdges, side, perimeter, answer: side }
  };
}

function diagonalTrianglePerimeter({ difficulty = 2 }) {
  const width = randomInt(4, difficulty === 3 ? 16 : 11);
  const height = randomInt(3, difficulty === 3 ? 13 : 9);
  const diagonal = randomInt(Math.max(width, height) + 1, width + height - 1);
  const answer = width + height + diagonal;
  return {
    prompt: `가로 ${width}cm, 세로 ${height}cm인 직사각형을 대각선으로 나누었습니다. 대각선이 ${diagonal}cm일 때 한쪽 삼각형의 둘레를 구하세요.`,
    visual: { kind: "book6", subtype: "diagonal-rectangle", width, height, diagonal, labels: [`${width}cm`, `${height}cm`, `${diagonal}cm`] },
    answer: `${answer}cm`,
    solution: `삼각형의 세 변은 직사각형의 가로, 세로, 대각선이므로 ${width}+${height}+${diagonal}=${answer}cm입니다.`,
    meta: { family: "diagonal-triangle", width, height, diagonal, answer }
  };
}

function squareCompositionSide({ difficulty = 2 }) {
  const small = randomInt(2, difficulty === 3 ? 8 : 6);
  const count = randomInt(2, difficulty === 3 ? 5 : 4);
  const answer = small * count;
  return {
    prompt: `한 변이 ${small}cm인 정사각형 ${count}개를 한 줄로 빈틈없이 붙였습니다. 긴 쪽의 길이를 구하세요.`,
    visual: { kind: "book6", subtype: "cell-strip", count, side: small, target: "length" },
    answer: `${answer}cm`,
    solution: `${small}cm가 ${count}번 이어지므로 ${small}×${count}=${answer}cm입니다.`,
    meta: { family: "square-composition-side", small, count, answer }
  };
}

function squareCompositionPerimeter({ difficulty = 2 }) {
  const order = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
  const cells = [];
  for (let x = 0; x < order; x += 1) cells.push([x, 0]);
  for (let y = 1; y < order; y += 1) cells.push([0, y]);
  if (difficulty === 3) cells.push([1, 1]);
  const side = randomInt(1, 5);
  const edgeCount = cellPerimeter(cells);
  const answer = edgeCount * side;
  return {
    prompt: `한 변이 ${side}cm인 정사각형으로 만든 색칠한 도형의 둘레를 구하세요.`,
    visual: { kind: "book6", subtype: "cell-shape", cells, sideLabel: `${side}cm` },
    answer: `${answer}cm`,
    solution: `바깥에 드러난 짧은 변은 ${edgeCount}개입니다. ${edgeCount}×${side}=${answer}cm입니다.`,
    meta: { family: "cell-perimeter", cells, side, edgeCount, answer }
  };
}

function foldCutRectanglePerimeter({ difficulty = 2 }) {
  const foldedWidth = randomInt(3, difficulty === 3 ? 12 : 8);
  const foldedHeight = randomInt(3, difficulty === 3 ? 10 : 7);
  const foldWidth = Math.random() < 0.5;
  const originalWidth = foldWidth ? foldedWidth * 2 : foldedWidth;
  const originalHeight = foldWidth ? foldedHeight : foldedHeight * 2;
  const answer = 2 * (originalWidth + originalHeight);
  return {
    prompt: `직사각형 종이를 정확히 반으로 접었더니 가로 ${foldedWidth}cm, 세로 ${foldedHeight}cm가 되었습니다. 그림의 접는 방향을 보고 처음 종이의 둘레를 구하세요.`,
    visual: { kind: "book6", subtype: "folded-rectangle", foldedWidth, foldedHeight, foldWidth },
    answer: `${answer}cm`,
    solution: `${foldWidth ? "가로" : "세로"}가 반으로 줄었으므로 처음 크기는 가로 ${originalWidth}cm, 세로 ${originalHeight}cm입니다. 둘레는 ${answer}cm입니다.`,
    meta: { family: "fold-rectangle", foldedWidth, foldedHeight, foldWidth, originalWidth, originalHeight, answer }
  };
}

function rectilinearRoutePerimeter({ difficulty = 2 }) {
  const width = randomInt(6, difficulty === 3 ? 20 : 14);
  const height = randomInt(5, difficulty === 3 ? 16 : 11);
  const bend = randomInt(2, width - 2);
  const answer = width + height;
  return {
    prompt: `가에서 나까지 오른쪽과 아래쪽으로만 꺾어 간 굵은 선의 전체 길이를 구하세요.`,
    visual: { kind: "book6", subtype: "route", width, height, bend, labels: [`가로 합 ${width}cm`, `세로 합 ${height}cm`] },
    answer: `${answer}cm`,
    solution: `오른쪽으로 간 길이의 합은 ${width}cm, 아래쪽으로 간 길이의 합은 ${height}cm이므로 전체는 ${answer}cm입니다.`,
    meta: { family: "rectilinear-route", width, height, bend, answer }
  };
}

function rectilinearPerimeterBook6({ difficulty = 2 }) {
  const width = randomInt(5, difficulty === 3 ? 16 : 11);
  const height = randomInt(4, difficulty === 3 ? 13 : 9);
  const notchWidth = randomInt(1, width - 2);
  const notchHeight = randomInt(1, height - 2);
  const vertices = [[0, 0], [width, 0], [width, height - notchHeight], [width - notchWidth, height - notchHeight], [width - notchWidth, height], [0, height]];
  const answer = 2 * (width + height);
  return {
    prompt: `직각으로 꺾인 도형의 가로 전체가 ${width}cm, 세로 전체가 ${height}cm입니다. 둘레를 구하세요.`,
    visual: { kind: "book6", subtype: "orthogonal-polygon", vertices, labels: { width: `${width}cm`, height: `${height}cm` } },
    answer: `${answer}cm`,
    solution: `들어간 가로와 세로를 바깥쪽으로 옮겨 생각하면 가로와 세로가 각각 두 번씩입니다. 둘레는 ${answer}cm입니다.`,
    meta: { family: "orthogonal-perimeter", mode: "corner", width, height, notchWidth, notchHeight, vertices, answer }
  };
}

function concavePerimeter({ difficulty = 2 }) {
  const width = randomInt(6, difficulty === 3 ? 18 : 12);
  const height = randomInt(5, difficulty === 3 ? 14 : 10);
  const notchWidth = randomInt(1, width - 3);
  const depth = randomInt(1, height - 2);
  const offset = randomInt(1, width - notchWidth - 1);
  const vertices = [[0, 0], [width, 0], [width, height], [offset + notchWidth, height], [offset + notchWidth, height - depth], [offset, height - depth], [offset, height], [0, height]];
  const answer = 2 * (width + height) + 2 * depth;
  return {
    prompt: `가로 ${width}cm, 세로 ${height}cm인 큰 직사각형의 한쪽이 그림처럼 ${depth}cm 깊이로 들어갔습니다. 도형의 둘레를 구하세요.`,
    visual: { kind: "book6", subtype: "orthogonal-polygon", vertices, labels: { width: `${width}cm`, height: `${height}cm`, depth: `${depth}cm` } },
    answer: `${answer}cm`,
    solution: `큰 직사각형의 둘레 ${2 * (width + height)}cm에 들어간 두 변 ${depth}cm씩을 더하면 ${answer}cm입니다.`,
    meta: { family: "orthogonal-perimeter", mode: "notch", width, height, notchWidth, depth, offset, vertices, answer }
  };
}

function gridCutoutPerimeter({ difficulty = 2 }) {
  const width = difficulty === 1 ? 4 : difficulty === 2 ? 5 : 6;
  const height = difficulty === 3 ? 5 : 4;
  const cut = difficulty === 1 ? [[width - 1, height - 1]] : [[width - 1, height - 1], [width - 2, height - 1]];
  const cutSet = new Set(cut.map(cellKey));
  const cells = [];
  for (let x = 0; x < width; x += 1) for (let y = 0; y < height; y += 1) if (!cutSet.has(`${x}:${y}`)) cells.push([x, y]);
  const side = randomInt(1, 4);
  const edgeCount = cellPerimeter(cells);
  const answer = edgeCount * side;
  return {
    prompt: `한 변이 ${side}cm인 모눈 정사각형에서 회색 칸을 잘라냈습니다. 남은 도형의 둘레를 구하세요.`,
    visual: { kind: "book6", subtype: "cell-cutout", width, height, cells, cut, sideLabel: `${side}cm` },
    answer: `${answer}cm`,
    solution: `남은 도형의 바깥에 드러난 짧은 변은 ${edgeCount}개이므로 둘레는 ${answer}cm입니다.`,
    meta: { family: "cell-perimeter", cells, cut, side, edgeCount, answer }
  };
}

function makeConnectedCells(count) {
  const cells = [[0, 0]];
  const occupied = new Set(["0:0"]);
  while (cells.length < count) {
    const base = sample(cells);
    const next = sample([[base[0] + 1, base[1]], [base[0] - 1, base[1]], [base[0], base[1] + 1], [base[0], base[1] - 1]]);
    if (!occupied.has(cellKey(next))) {
      occupied.add(cellKey(next));
      cells.push(next);
    }
  }
  const minX = Math.min(...cells.map(([x]) => x));
  const minY = Math.min(...cells.map(([, y]) => y));
  return cells.map(([x, y]) => [x - minX, y - minY]);
}

function polyominoOuterPerimeter({ difficulty = 2 }) {
  const count = randomInt(difficulty === 1 ? 4 : 6, difficulty === 3 ? 12 : 9);
  const cells = makeConnectedCells(count);
  const side = randomInt(1, difficulty === 3 ? 5 : 3);
  const edgeCount = cellPerimeter(cells);
  const answer = edgeCount * side;
  return {
    prompt: `한 변이 ${side}cm인 정사각형 ${count}개를 붙여 만든 도형의 바깥 둘레를 구하세요.`,
    visual: { kind: "book6", subtype: "cell-shape", cells, sideLabel: `${side}cm` },
    answer: `${answer}cm`,
    solution: `바깥에 드러난 짧은 변을 세면 ${edgeCount}개입니다. ${edgeCount}×${side}=${answer}cm입니다.`,
    meta: { family: "cell-perimeter", cells, side, edgeCount, answer }
  };
}

function attachedRegularShapePerimeter({ difficulty = 2 }) {
  const sides = difficulty === 1 ? [4, 4] : difficulty === 2 ? [4, 4, 4] : [4, 4, 4, 4];
  const sharedEdges = sides.length - 1;
  const outsideEdges = sum(sides) - sharedEdges * 2;
  const side = randomInt(2, difficulty === 3 ? 9 : 6);
  const answer = outsideEdges * side;
  return {
    prompt: `한 변이 ${side}cm인 정다각형 ${sides.length}개를 그림처럼 한 변씩 붙였습니다. 전체 바깥 둘레를 구하세요.`,
    visual: { kind: "book6", subtype: "attached-polygons", sides, sideLabel: `${side}cm` },
    answer: `${answer}cm`,
    solution: `모든 변 ${sum(sides)}개에서 맞닿아 사라진 변 ${sharedEdges * 2}개를 빼면 ${outsideEdges}개입니다. 둘레는 ${answer}cm입니다.`,
    meta: { family: "attached-regular", sides, sharedEdges, outsideEdges, side, answer }
  };
}

function perimeterUnitEdgeInverse({ difficulty = 2 }) {
  const cells = makeConnectedCells(randomInt(difficulty === 1 ? 4 : 6, difficulty === 3 ? 11 : 8));
  const edgeCount = cellPerimeter(cells);
  const side = randomInt(2, difficulty === 3 ? 8 : 5);
  const perimeter = edgeCount * side;
  return {
    prompt: `같은 정사각형을 붙인 도형의 둘레가 ${perimeter}cm입니다. 작은 정사각형 한 변의 길이를 구하세요.`,
    visual: { kind: "book6", subtype: "cell-shape", cells, sideLabel: "?", perimeterLabel: `${perimeter}cm` },
    answer: `${side}cm`,
    solution: `바깥에 드러난 짧은 변은 ${edgeCount}개입니다. ${perimeter}÷${edgeCount}=${side}cm입니다.`,
    meta: { family: "unit-edge-inverse", cells, edgeCount, side, perimeter, answer: side }
  };
}

function cutoutPerimeterChange({ difficulty = 2 }) {
  const width = difficulty === 3 ? 6 : 5;
  const height = difficulty === 1 ? 3 : 4;
  const before = [];
  for (let x = 0; x < width; x += 1) for (let y = 0; y < height; y += 1) before.push([x, y]);
  const removed = [randomInt(1, width - 2), height - 1];
  const after = before.filter((cell) => cellKey(cell) !== cellKey(removed));
  const side = randomInt(1, 5);
  const beforePerimeter = cellPerimeter(before) * side;
  const afterPerimeter = cellPerimeter(after) * side;
  const answer = afterPerimeter - beforePerimeter;
  return {
    prompt: `한 변이 ${side}cm인 모눈 정사각형 한 칸을 그림처럼 가장자리 가운데에서 잘라냈습니다. 둘레는 몇 cm 늘어났나요?`,
    visual: { kind: "book6", subtype: "before-after-cells", before, after, removed, sideLabel: `${side}cm` },
    answer: `${answer}cm`,
    solution: `잘라낸 뒤 새로 드러난 변이 사라진 변보다 2개 많으므로 ${side}×2=${answer}cm 늘어납니다.`,
    meta: { family: "cutout-change", before, after, side, beforePerimeter, afterPerimeter, answer }
  };
}

function squarePartitionLengths({ difficulty = 2 }) {
  const parts = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
  const small = randomInt(2, difficulty === 3 ? 7 : 5);
  const total = parts * small;
  return {
    prompt: `큰 정사각형의 한 변을 같은 길이 ${parts}개로 나누었습니다. 작은 정사각형 한 변이 ${small}cm일 때 큰 정사각형 한 변의 길이를 구하세요.`,
    visual: { kind: "book6", subtype: "square-partition", parts, smallLabel: `${small}cm`, totalLabel: "?" },
    answer: `${total}cm`,
    solution: `${small}cm가 ${parts}번 이어지므로 큰 정사각형 한 변은 ${total}cm입니다.`,
    meta: { family: "square-partition", parts, small, total, answer: total }
  };
}

function nestedSquarePerimeter({ difficulty = 2 }) {
  const outer = randomInt(difficulty === 1 ? 6 : 9, difficulty === 3 ? 24 : 16);
  const inner = randomInt(2, outer - 3);
  const answer = 4 * (outer + inner);
  return {
    prompt: `한 변이 ${outer}cm인 정사각형 안에 한 변이 ${inner}cm인 정사각형 구멍이 있습니다. 색칠한 부분의 바깥쪽과 안쪽 경계의 길이를 모두 구하세요.`,
    visual: { kind: "book6", subtype: "nested-square", outer, inner, labels: [`${outer}cm`, `${inner}cm`] },
    answer: `${answer}cm`,
    solution: `바깥 둘레는 ${outer * 4}cm, 안쪽 둘레는 ${inner * 4}cm이므로 모두 ${answer}cm입니다.`,
    meta: { family: "nested-square", outer, inner, answer }
  };
}

function napierMultiplication({ difficulty = 2 }) {
  const first = randomInt(difficulty === 1 ? 12 : 21, difficulty === 3 ? 398 : 89);
  const second = randomInt(12, difficulty === 3 ? 87 : 49);
  const answer = first * second;
  return {
    prompt: `네이피어 격자에 맞게 ${first}×${second}를 계산하세요.`,
    visual: { kind: "book6", subtype: "multiplication-grid", mode: "napier", first, second },
    answer: String(answer),
    solution: `각 자리의 곱을 격자에 적고 대각선끼리 더하면 ${answer}입니다.`,
    meta: { family: "multiplication", mode: "napier", first, second, answer }
  };
}

function areaModelMultiplication({ difficulty = 2 }) {
  const first = randomInt(difficulty === 1 ? 12 : 21, difficulty === 3 ? 89 : 59);
  const second = randomInt(difficulty === 1 ? 3 : 11, difficulty === 3 ? 49 : 29);
  const firstParts = [Math.floor(first / 10) * 10, first % 10].filter(Boolean);
  const secondParts = second >= 10 ? [Math.floor(second / 10) * 10, second % 10].filter(Boolean) : [second];
  const partials = firstParts.flatMap((a) => secondParts.map((b) => a * b));
  const answer = first * second;
  return {
    prompt: `넓이 모형을 이용하여 ${first}×${second}를 계산하세요.`,
    visual: { kind: "book6", subtype: "multiplication-grid", mode: "area", first, second, firstParts, secondParts, partials },
    answer: String(answer),
    solution: `${partials.join("+")}=${answer}이므로 ${first}×${second}=${answer}입니다.`,
    meta: { family: "multiplication", mode: "area", first, second, firstParts, secondParts, partials, answer }
  };
}

function roundPairAddition({ difficulty = 2 }) {
  const base = difficulty === 1 ? 10 : difficulty === 2 ? 100 : sample([100, 1000]);
  const pairCount = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
  const pairs = Array.from({ length: pairCount }, () => {
    const low = randomInt(Math.max(1, Math.floor(base * 0.12)), Math.floor(base * 0.48));
    return [low, base - low];
  });
  const values = shuffle(pairs.flat());
  const answer = base * pairCount;
  return expressionProblem({
    prompt: "합이 둥근 수가 되는 수끼리 짝지어 계산하세요.",
    expression: values.join(" + "),
    values,
    answer,
    solution: `${base}이 되는 짝이 ${pairCount}쌍이므로 합은 ${answer}입니다.`,
    family: "round-pair-addition",
    meta: { base, pairCount, pairs }
  });
}

function roundPairMissingAddend({ difficulty = 2 }) {
  const base = difficulty === 1 ? 10 : difficulty === 2 ? 100 : 1000;
  const shown = randomInt(Math.max(1, Math.floor(base * 0.12)), Math.floor(base * 0.88));
  const answer = base - shown;
  return expressionProblem({
    prompt: `두 수의 합이 ${base}이 되도록 빈칸에 알맞은 수를 쓰세요.`,
    expression: `${shown} + □ = ${base}`,
    values: [shown, base],
    answer,
    solution: `${base}-${shown}=${answer}이므로 빈칸은 ${answer}입니다.`,
    family: "round-pair-missing",
    meta: { base, shown }
  });
}

function commonFactorSum({ difficulty = 2 }) {
  const factor = randomInt(2, difficulty === 3 ? 25 : 12);
  const terms = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
  const multipliers = Array.from({ length: terms }, () => randomInt(2, difficulty === 3 ? 18 : 10));
  const answer = factor * sum(multipliers);
  const expression = multipliers.map((value) => `${factor}×${value}`).join(" + ");
  return expressionProblem({
    prompt: "같은 수를 묶어 빠르게 계산하세요.", expression, values: multipliers, answer,
    solution: `${factor}가 ${multipliers.join(", ")}만큼 있으므로 ${factor}×(${multipliers.join("+")})=${answer}입니다.`,
    family: "common-factor-sum", meta: { factor, multipliers }
  });
}

function nearRoundMultiplication({ difficulty = 2 }) {
  const base = difficulty === 3 ? 1000 : 100;
  const multiplier = base - 1;
  const value = randomInt(difficulty === 1 ? 2 : 8, difficulty === 3 ? 45 : 25);
  const answer = value * multiplier;
  return expressionProblem({
    prompt: `${value}를 ${multiplier}번 더한 값을 빠르게 계산하세요.`,
    expression: `${value}×${multiplier}`,
    values: [value, multiplier], answer,
    solution: `${value}를 ${base}번 더한 ${value * base}에서 ${value}를 한 번 빼면 ${answer}입니다.`,
    family: "near-round-multiplication", meta: { base, multiplier, value }
  });
}

function nearRoundAddition({ difficulty = 2 }) {
  const base = difficulty === 1 ? 10 : difficulty === 2 ? 100 : 1000;
  const count = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
  const gaps = Array.from({ length: count }, () => randomInt(1, difficulty === 3 ? 9 : 5));
  const values = gaps.map((gap) => base - gap);
  const answer = sum(values);
  return expressionProblem({
    prompt: "둥근 수에 가깝게 고쳐 빠르게 계산하세요.",
    expression: values.join(" + "), values, answer,
    solution: `${base}을 ${count}번 더한 ${base * count}에서 ${gaps.join("+")}=${sum(gaps)}를 빼면 ${answer}입니다.`,
    family: "near-round-addition", meta: { base, count, gaps }
  });
}

function inclusiveRangeCount({ difficulty = 2 }) {
  const start = randomInt(1, difficulty === 3 ? 120 : 50);
  const count = randomInt(difficulty === 1 ? 5 : 12, difficulty === 3 ? 80 : 40);
  const end = start + count - 1;
  return expressionProblem({
    prompt: `${start}부터 ${end}까지의 수는 모두 몇 개인가요?`,
    expression: `${start}, ${start + 1}, ${start + 2}, …, ${end}`,
    values: [start, end], answer: count,
    solution: `끝 수에서 처음 수를 빼고 1을 더하면 ${end}-${start}+1=${count}개입니다.`,
    family: "inclusive-range", meta: { start, end }
  });
}

function consecutiveSumEvenCount({ difficulty = 2 }) {
  const count = difficulty === 1 ? 4 : difficulty === 2 ? 6 : 8;
  const start = randomInt(1, difficulty === 3 ? 60 : 30);
  const values = Array.from({ length: count }, (_, index) => start + index);
  const answer = sum(values);
  return expressionProblem({
    prompt: `연속한 ${count}개의 수를 짝지어 합을 구하세요.`,
    expression: values.join(" + "), values, answer,
    solution: `양끝을 짝지으면 한 쌍의 합은 ${values[0] + values.at(-1)}이고 ${count / 2}쌍이므로 ${answer}입니다.`,
    family: "consecutive-sum", meta: { start, count, values, parity: "even" }
  });
}

function consecutiveSumOddCount({ difficulty = 2 }) {
  const count = difficulty === 1 ? 3 : difficulty === 2 ? 5 : 7;
  const start = randomInt(1, difficulty === 3 ? 60 : 30);
  const values = Array.from({ length: count }, (_, index) => start + index);
  const middle = values[Math.floor(count / 2)];
  const answer = middle * count;
  return expressionProblem({
    prompt: `연속한 ${count}개의 수의 합을 가운데 수를 이용해 구하세요.`,
    expression: values.join(" + "), values, answer,
    solution: `가운데 수는 ${middle}이고 수가 ${count}개이므로 합은 ${middle}×${count}=${answer}입니다.`,
    family: "consecutive-sum", meta: { start, count, values, middle, parity: "odd" }
  });
}

function nthEvenOdd({ difficulty = 2 }) {
  const odd = Math.random() < 0.5;
  const position = randomInt(difficulty === 1 ? 3 : 8, difficulty === 3 ? 80 : 35);
  const answer = odd ? position * 2 - 1 : position * 2;
  return {
    prompt: `${position}번째 ${odd ? "홀수" : "짝수"}를 구하세요.`,
    visual: { kind: "book6", subtype: "sequence", values: Array.from({ length: Math.min(6, position) }, (_, index) => odd ? index * 2 + 1 : index * 2 + 2), tail: `${position}번째 = ?` },
    answer: String(answer),
    solution: odd ? `${position}을 두 배 한 수에서 1을 빼면 ${answer}입니다.` : `${position}을 두 배 하면 ${answer}입니다.`,
    meta: { family: "nth-even-odd", odd, position, answer }
  };
}

function evenOddPosition({ difficulty = 2 }) {
  const odd = Math.random() < 0.5;
  const position = randomInt(difficulty === 1 ? 3 : 8, difficulty === 3 ? 80 : 35);
  const value = odd ? position * 2 - 1 : position * 2;
  return {
    prompt: `${value}은 ${odd ? "홀수" : "짝수"} 중 몇 번째 수인가요?`,
    visual: { kind: "book6", subtype: "sequence", values: Array.from({ length: 6 }, (_, index) => odd ? index * 2 + 1 : index * 2 + 2), tail: `… ${value}` },
    answer: `${position}번째`,
    solution: odd ? `(${value}+1)÷2=${position}이므로 ${position}번째입니다.` : `${value}÷2=${position}이므로 ${position}번째입니다.`,
    meta: { family: "even-odd-position", odd, position, value, answer: position }
  };
}

function facingPageNumber({ difficulty = 2 }) {
  const left = randomInt(difficulty === 1 ? 2 : 10, difficulty === 3 ? 98 : 48) * 2;
  const right = left + 1;
  const showLeft = Math.random() < 0.5;
  const answer = showLeft ? right : left;
  return {
    prompt: `펼친 책에서 ${showLeft ? "왼쪽" : "오른쪽"} 쪽이 ${showLeft ? left : right}쪽입니다. 마주 보는 쪽수를 구하세요.`,
    visual: { kind: "book6", subtype: "book-pages", left: showLeft ? left : "?", right: showLeft ? "?" : right },
    answer: `${answer}쪽`,
    solution: `펼친 책의 왼쪽은 짝수 쪽, 오른쪽은 바로 다음 홀수 쪽이므로 답은 ${answer}쪽입니다.`,
    meta: { family: "facing-pages", left, right, showLeft, answer }
  };
}

function alternatingPairSum({ difficulty = 2 }) {
  const count = difficulty === 1 ? 6 : difficulty === 2 ? 10 : 16;
  const start = randomInt(1, difficulty === 3 ? 40 : 20);
  const values = Array.from({ length: count }, (_, index) => start + index);
  const answer = -count / 2;
  const expression = values.map((value, index) => `${index ? (index % 2 ? " - " : " + ") : ""}${value}`).join("");
  return expressionProblem({
    prompt: "앞에서부터 두 수씩 짝지어 계산하세요.", expression, values, answer,
    solution: `(${start}-${start + 1})처럼 각 쌍이 -1이고 ${count / 2}쌍이므로 답은 ${answer}입니다.`,
    family: "alternating-pair", meta: { start, count, values }
  });
}

function commonFactorMissingTerm({ difficulty = 2 }) {
  const factor = randomInt(2, difficulty === 3 ? 25 : 12);
  const first = randomInt(2, difficulty === 3 ? 20 : 10);
  const missing = randomInt(2, difficulty === 3 ? 20 : 10);
  const totalMultiplier = first + missing;
  return expressionProblem({
    prompt: "같은 수를 묶어 생각하여 빈칸에 알맞은 수를 쓰세요.",
    expression: `${factor}×${first} + ${factor}×□ = ${factor}×${totalMultiplier}`,
    values: [factor, first, totalMultiplier], answer: missing,
    solution: `${first}+□=${totalMultiplier}이므로 빈칸은 ${missing}입니다.`,
    family: "common-factor-missing", meta: { factor, first, totalMultiplier }
  });
}

function consecutiveNumbersFromSum({ difficulty = 2 }) {
  const count = difficulty === 1 ? 3 : difficulty === 2 ? sample([3, 5]) : sample([4, 5, 6]);
  const start = randomInt(1, difficulty === 3 ? 60 : 30);
  const values = Array.from({ length: count }, (_, index) => start + index);
  const total = sum(values);
  return {
    prompt: `연속한 ${count}개의 수의 합이 ${total}입니다. 이 수들을 작은 수부터 차례로 쓰세요.`,
    visual: { kind: "book6", subtype: "sequence-boxes", count, total },
    answer: values.join(", "),
    solution: `${count % 2 ? `가운데 수는 ${total}÷${count}=${values[Math.floor(count / 2)]}` : `가운데 두 수의 합은 ${total / (count / 2)}`}입니다. 연속하게 놓으면 ${values.join(", ")}입니다.`,
    meta: { family: "consecutive-from-sum", count, start, values, total, answer: values }
  };
}

function newspaperPagePair({ difficulty = 2 }) {
  const totalPages = randomInt(difficulty === 1 ? 4 : 8, difficulty === 3 ? 30 : 18) * 4;
  const shown = randomInt(1, totalPages);
  const answer = totalPages + 1 - shown;
  return {
    prompt: `${totalPages}쪽짜리 신문을 한꺼번에 접어 만들었습니다. ${shown}쪽과 같은 종이의 반대쪽에 있는 쪽수를 구하세요.`,
    visual: { kind: "book6", subtype: "newspaper-pages", totalPages, shown, target: "?" },
    answer: `${answer}쪽`,
    solution: `같은 종이의 마주 보는 두 쪽수의 합은 ${totalPages + 1}이므로 ${totalPages + 1}-${shown}=${answer}쪽입니다.`,
    meta: { family: "newspaper-pair", totalPages, shown, answer }
  };
}

function countWrittenDigits(start, end) {
  let total = 0;
  for (let number = start; number <= end; number += 1) total += String(number).length;
  return total;
}

function countDigitOccurrences(start, end, digit) {
  let total = 0;
  for (let number = start; number <= end; number += 1) total += [...String(number)].filter((value) => value === String(digit)).length;
  return total;
}

function rangeNumberDigitCount({ difficulty = 2 }) {
  const digits = difficulty === 1 ? 1 : difficulty === 2 ? 2 : sample([2, 3]);
  const lower = digits === 1 ? 1 : Math.pow(10, digits - 1);
  const upper = Math.pow(10, digits) - 1;
  const start = randomInt(lower, upper - 12);
  const end = Math.min(upper, start + randomInt(5, difficulty === 3 ? 45 : 22));
  const numberCount = end - start + 1;
  const answer = countWrittenDigits(start, end);
  return {
    prompt: `${start}부터 ${end}까지의 수를 모두 쓸 때 숫자를 모두 몇 개 쓰나요?`,
    visual: { kind: "book6", subtype: "digit-range", start, end, sample: [start, start + 1, start + 2, "…", end] },
    answer: `${answer}개`,
    solution: `수는 ${numberCount}개이고 각 수는 ${digits}자리이므로 숫자는 ${numberCount}×${digits}=${answer}개입니다.`,
    meta: { family: "range-digit-count", start, end, digits, numberCount, answer }
  };
}

function totalWrittenDigits({ difficulty = 2 }) {
  const end = randomInt(difficulty === 1 ? 12 : 45, difficulty === 3 ? 420 : 180);
  const answer = countWrittenDigits(1, end);
  return {
    prompt: `1부터 ${end}까지의 수를 차례로 모두 쓸 때 숫자를 모두 몇 개 쓰나요?`,
    visual: { kind: "book6", subtype: "digit-range", start: 1, end, sample: [1, 2, 3, "…", end] },
    answer: `${answer}개`,
    solution: `한 자리, 두 자리${end >= 100 ? ", 세 자리" : ""} 수가 쓰는 숫자를 나누어 세면 모두 ${answer}개입니다.`,
    meta: { family: "total-written-digits", end, answer }
  };
}

function digitOccurrenceCount({ difficulty = 2 }) {
  const end = randomInt(difficulty === 1 ? 25 : 60, difficulty === 3 ? 350 : 160);
  const digit = randomInt(difficulty === 1 ? 1 : 0, 9);
  const answer = countDigitOccurrences(1, end, digit);
  return {
    prompt: `1부터 ${end}까지의 수를 모두 쓸 때 숫자 ${digit}을 몇 번 쓰나요?`,
    visual: { kind: "book6", subtype: "digit-focus", start: 1, end, digit },
    answer: `${answer}번`,
    solution: `각 자리에서 숫자 ${digit}이 나타나는 경우를 빠짐없이 세면 ${answer}번입니다.`,
    meta: { family: "digit-occurrence", start: 1, end, digit, answer }
  };
}

function digitExclusionCount({ difficulty = 2 }) {
  const end = randomInt(difficulty === 1 ? 25 : 60, difficulty === 3 ? 300 : 150);
  const digit = randomInt(difficulty === 1 ? 1 : 0, 9);
  const valid = [];
  for (let number = 1; number <= end; number += 1) if (!String(number).includes(String(digit))) valid.push(number);
  const answer = valid.length;
  return {
    prompt: `1부터 ${end}까지에서 숫자 ${digit}이 들어 있지 않은 수는 모두 몇 개인가요?`,
    visual: { kind: "book6", subtype: "digit-focus", start: 1, end, digit, excluded: true },
    answer: `${answer}개`,
    solution: `각 수의 십의 자리와 일의 자리${end >= 100 ? ", 백의 자리" : ""}를 살펴 숫자 ${digit}이 들어간 수를 제외하면 ${answer}개입니다.`,
    meta: { family: "digit-exclusion", start: 1, end, digit, valid, answer }
  };
}

function operatorPatterns(length, operators) {
  let patterns = [[]];
  for (let index = 0; index < length - 1; index += 1) patterns = patterns.flatMap((pattern) => operators.map((operator) => [...pattern, operator]));
  return patterns;
}

function evaluateJoinedExpression(digits, operators) {
  const terms = [];
  let current = String(digits[0]);
  let sign = 1;
  for (let index = 0; index < operators.length; index += 1) {
    const operator = operators[index];
    if (operator === "") current += String(digits[index + 1]);
    else {
      terms.push(sign * Number(current));
      sign = operator === "+" ? 1 : -1;
      current = String(digits[index + 1]);
    }
  }
  terms.push(sign * Number(current));
  return { value: sum(terms), terms };
}

function formatJoinedExpression(digits, operators, blanks = false) {
  let text = String(digits[0]);
  operators.forEach((operator, index) => {
    text += blanks ? " □ " : operator === "" ? "" : ` ${operator} `;
    text += digits[index + 1];
  });
  return text;
}

function uniqueOperatorProblem(values, operators, require) {
  const candidates = operatorPatterns(values.length, operators)
    .map((pattern) => ({ pattern, value: evaluateJoinedExpression(values, pattern).value }));
  const counts = new Map();
  candidates.forEach((candidate) => counts.set(candidate.value, (counts.get(candidate.value) || 0) + 1));
  return shuffle(candidates).find((candidate) => counts.get(candidate.value) === 1 && (!require || require(candidate.pattern))) || null;
}

function signInsertionProblem(values, family, prompt) {
  let selected = uniqueOperatorProblem(values, ["+", "-"], (pattern) => pattern.includes("+") && pattern.includes("-"));
  if (!selected) selected = uniqueOperatorProblem(values, ["+", "-"]);
  return {
    prompt: `${prompt} 계산 결과가 ${selected.value}이 되도록 빈칸에 더하기 또는 빼기를 넣으세요.`,
    visual: { kind: "book6", subtype: "operator-row", digits: values, target: selected.value, choices: ["+", "-"] },
    answer: selected.pattern.join(", "),
    solution: `${formatJoinedExpression(values, selected.pattern)}=${selected.value}이므로 빈칸의 기호는 차례로 ${selected.pattern.join(", ")}입니다.`,
    meta: { family, values, operators: ["+", "-"], pattern: selected.pattern, target: selected.value, answer: selected.pattern }
  };
}

function consecutiveSignInsertion({ difficulty = 2 }) {
  const length = difficulty === 1 ? 4 : difficulty === 2 ? 5 : 6;
  const start = randomInt(1, difficulty === 3 ? 8 : 4);
  const values = Array.from({ length }, (_, index) => start + index);
  return signInsertionProblem(values, "sign-insertion", "이어진 수 사이에서");
}

function oddSequenceSignInsertion({ difficulty = 2 }) {
  const length = difficulty === 1 ? 4 : difficulty === 2 ? 5 : 6;
  const start = randomInt(0, difficulty === 3 ? 4 : 2) * 2 + 1;
  const values = Array.from({ length }, (_, index) => start + index * 2);
  return signInsertionProblem(values, "sign-insertion", "홀수 사이에서");
}

function doublingSequenceSignInsertion({ difficulty = 2 }) {
  const length = difficulty === 1 ? 4 : difficulty === 2 ? 5 : 6;
  const start = randomInt(1, difficulty === 3 ? 3 : 2);
  const values = Array.from({ length }, (_, index) => start * Math.pow(2, index));
  return signInsertionProblem(values, "sign-insertion", "두 배씩 커지는 수 사이에서");
}

function plusConcatenationEvaluate({ difficulty = 2 }) {
  const length = difficulty === 1 ? 4 : difficulty === 2 ? 5 : 6;
  const digits = Array.from({ length }, () => randomInt(1, 9));
  let operators = Array.from({ length: length - 1 }, () => Math.random() < 0.5 ? "+" : "");
  if (!operators.includes("")) operators[randomInt(0, operators.length - 1)] = "";
  if (!operators.includes("+")) operators[randomInt(0, operators.length - 1)] = "+";
  const result = evaluateJoinedExpression(digits, operators);
  return expressionProblem({
    prompt: "붙어 있는 숫자는 한 수로 읽어 계산하세요.",
    expression: formatJoinedExpression(digits, operators), values: digits, answer: result.value,
    solution: `${result.terms.join("+")}=${result.value}입니다.`,
    family: "concat-evaluate", meta: { digits, operators, terms: result.terms }
  });
}

function plusConcatenationTarget({ difficulty = 2 }) {
  const length = difficulty === 1 ? 4 : difficulty === 2 ? 5 : 6;
  let digits;
  let selected;
  for (let attempt = 0; attempt < 100 && !selected; attempt += 1) {
    digits = Array.from({ length }, () => randomInt(1, 9));
    selected = uniqueOperatorProblem(digits, ["+", ""], (pattern) => pattern.includes("+") && pattern.includes(""));
  }
  return {
    prompt: `계산 결과가 ${selected.value}이 되도록 빈칸에 더하기를 넣거나 숫자를 그대로 이어 붙이세요.`,
    visual: { kind: "book6", subtype: "operator-row", digits, target: selected.value, choices: ["+", "이어 붙이기"] },
    answer: selected.pattern.map((operator) => operator || "이어 붙이기").join(", "),
    solution: `${formatJoinedExpression(digits, selected.pattern)}=${selected.value}입니다.`,
    meta: { family: "concat-target", digits, operators: ["+", ""], pattern: selected.pattern, target: selected.value, answer: selected.pattern }
  };
}

function mixedSignConcatenation({ difficulty = 2 }) {
  const length = difficulty === 1 ? 4 : difficulty === 2 ? 4 : 5;
  let digits;
  let selected;
  for (let attempt = 0; attempt < 150 && !selected; attempt += 1) {
    digits = Array.from({ length }, () => randomInt(1, 9));
    selected = uniqueOperatorProblem(digits, ["+", "-", ""], (pattern) => pattern.includes("") && pattern.some((operator) => operator === "+" || operator === "-"));
  }
  return {
    prompt: `계산 결과가 ${selected.value}이 되도록 더하기, 빼기 또는 이어 붙이기를 사용하세요.`,
    visual: { kind: "book6", subtype: "operator-row", digits, target: selected.value, choices: ["+", "-", "이어 붙이기"] },
    answer: selected.pattern.map((operator) => operator || "이어 붙이기").join(", "),
    solution: `${formatJoinedExpression(digits, selected.pattern)}=${selected.value}입니다.`,
    meta: { family: "concat-target", digits, operators: ["+", "-", ""], pattern: selected.pattern, target: selected.value, answer: selected.pattern }
  };
}

function removePlusConcatenation({ difficulty = 2 }) {
  const length = difficulty === 1 ? 4 : difficulty === 2 ? 5 : 6;
  const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, length);
  const removedIndex = randomInt(0, length - 2);
  const baseSum = sum(digits);
  const target = baseSum + digits[removedIndex] * 9;
  return {
    prompt: `${digits.join(" + ")}에서 더하기 하나를 지워 계산 결과를 ${target}으로 만들려고 합니다. 왼쪽에서 몇 번째 더하기를 지워야 하나요?`,
    visual: { kind: "book6", subtype: "removable-plus", digits, target },
    answer: `${removedIndex + 1}번째`,
    solution: `${digits[removedIndex]}과 ${digits[removedIndex + 1]} 사이를 이어 ${digits[removedIndex] * 10 + digits[removedIndex + 1]}로 만들면 합이 ${target}입니다. 따라서 ${removedIndex + 1}번째 더하기를 지웁니다.`,
    meta: { family: "remove-plus", digits, removedIndex, baseSum, target, answer: removedIndex + 1 }
  };
}

function lastNumberFromDigitTotal({ difficulty = 2 }) {
  const end = randomInt(difficulty === 1 ? 12 : 45, difficulty === 3 ? 480 : 180);
  const total = countWrittenDigits(1, end);
  return {
    prompt: `1부터 어떤 수까지 차례로 썼더니 숫자를 모두 ${total}개 썼습니다. 마지막에 쓴 수를 구하세요.`,
    visual: { kind: "book6", subtype: "digit-range", start: 1, end: "?", sample: [1, 2, 3, "…", "?"] },
    answer: String(end),
    solution: `한 자리 수부터 자리 수별로 사용한 숫자를 빼 가면 마지막 수는 ${end}입니다.`,
    meta: { family: "last-number-digits", end, total, answer: end }
  };
}

function unitTestMidpointPairBook6({ difficulty = 2 }) {
  const makePart = () => {
    const step = randomInt(2, difficulty === 3 ? 12 : 8);
    const half = randomInt(2, difficulty === 3 ? 6 : 4);
    const middle = randomInt(half * step + 2, difficulty === 3 ? 100 : 60);
    return { left: middle - half * step, right: middle + half * step, middle, intervals: half * 2 };
  };
  const parts = [makePart(), makePart()];
  return {
    prompt: "두 수직선에서 양 끝 수의 중간에 있는 수를 각각 구하세요.",
    visual: { kind: "book6", subtype: "unit-test", layout: "midpoint-pair", parts },
    answer: `(1) ${parts[0].middle} (2) ${parts[1].middle}`,
    solution: `각 수직선의 양 끝 수를 더해 2로 나누면 (1) ${parts[0].middle}, (2) ${parts[1].middle}입니다.`,
    meta: { family: "unit-midpoint-pair", parts, answer: parts.map((part) => part.middle) }
  };
}

function unitTestSplitTargetsBook6({ difficulty = 2 }) {
  const leftIntervals = difficulty === 1 ? 6 : difficulty === 2 ? 8 : 9;
  const rightIntervals = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
  const leftUnit = randomInt(2, difficulty === 3 ? 9 : 6);
  let rightUnit = randomInt(2, difficulty === 3 ? 10 : 7);
  if (rightUnit === leftUnit) rightUnit += 1;
  const start = randomInt(10, difficulty === 3 ? 50 : 30);
  const middle = start + leftIntervals * leftUnit;
  const end = middle + rightIntervals * rightUnit;
  const leftTarget = Math.floor(leftIntervals / 2);
  const rightTarget = rightIntervals - 1;
  const first = start + leftTarget * leftUnit;
  const second = middle + rightTarget * rightUnit;
  const answer = Math.abs(second - first);
  return {
    prompt: `가-나는 ${leftIntervals}칸, 나-다는 ${rightIntervals}칸으로 똑같이 나누었습니다. 표시한 두 점 사이의 거리를 구하세요.`,
    visual: { kind: "book6", subtype: "unit-test", layout: "split-targets", start, middle, end, leftIntervals, rightIntervals, leftTarget, rightTarget },
    answer: String(answer),
    solution: `가-나 한 칸은 ${leftUnit}, 나-다 한 칸은 ${rightUnit}입니다. 표시한 수는 ${first}와 ${second}이므로 거리는 ${answer}입니다.`,
    meta: { family: "unit-split-targets", start, middle, end, leftIntervals, rightIntervals, leftUnit, rightUnit, leftTarget, rightTarget, first, second, answer }
  };
}

function unitTestRodDifferenceRatioBook6({ difficulty = 2 }) {
  const choices = difficulty === 1 ? [[2, 3], [3, 4]] : difficulty === 2 ? [[3, 4], [6, 9]] : [[4, 6], [6, 8], [8, 12]];
  const [longCount, shortCount] = sample(choices);
  const answer = longCount * shortCount / (shortCount - longCount);
  return {
    prompt: `같은 길이를 긴 끈으로 재면 ${longCount}번, 짧은 끈으로 재면 ${shortCount}번입니다. 긴 끈에서 짧은 끈을 잘라 낸 길이로 재면 몇 번인가요?`,
    visual: { kind: "book6", subtype: "unit-test", layout: "measure-counts", longCount, shortCount },
    answer: `${answer}번`,
    solution: `전체 길이를 ${longCount * shortCount}칸으로 보면 긴 끈은 ${shortCount}칸, 짧은 끈은 ${longCount}칸입니다. 차이는 ${shortCount - longCount}칸이므로 ${longCount * shortCount}÷${shortCount - longCount}=${answer}번입니다.`,
    meta: { family: "unit-rod-ratio", longCount, shortCount, answer }
  };
}

function unitTestEqualBarsBook6({ difficulty = 2 }) {
  const [firstCount, secondCount] = sample(difficulty === 1 ? [[2, 3], [3, 4]] : difficulty === 2 ? [[3, 5], [4, 6]] : [[4, 7], [5, 8]]);
  const unit = randomInt(2, difficulty === 3 ? 9 : 7);
  const first = secondCount * unit;
  const second = firstCount * unit;
  const total = first + second;
  return {
    prompt: `같은 길이 안에 ㉠은 ${firstCount}개, ㉡은 ${secondCount}개가 들어갑니다. ㉠과 ㉡의 길이의 합이 ${total}cm일 때 각각의 길이를 구하세요.`,
    visual: { kind: "book6", subtype: "unit-test", layout: "equal-bars", firstCount, secondCount, total },
    answer: `㉠ ${first}cm, ㉡ ${second}cm`,
    solution: `㉠:㉡=${secondCount}:${firstCount}입니다. 모두 ${firstCount + secondCount}묶음이 ${total}cm이므로 한 묶음은 ${unit}cm, ㉠은 ${first}cm, ㉡은 ${second}cm입니다.`,
    meta: { family: "unit-equal-bars", firstCount, secondCount, unit, total, first, second, answer: [first, second] }
  };
}

function unitTestTwoWeightBook6({ difficulty = 2 }) {
  const [circleCount, squareCount] = sample(difficulty === 1 ? [[3, 2], [4, 3]] : difficulty === 2 ? [[5, 4], [4, 3]] : [[7, 5], [8, 6]]);
  const unit = randomInt(2, difficulty === 3 ? 8 : 6);
  const circle = squareCount * unit;
  const square = circleCount * unit;
  const total = circle + square;
  return {
    prompt: `동그라미 ${circleCount}개와 네모 ${squareCount}개의 무게가 같습니다. 두 도형 한 개씩의 무게 합이 ${total}g일 때 각각의 무게를 구하세요.`,
    visual: { kind: "book6", subtype: "unit-test", layout: "two-weight", circleCount, squareCount, total },
    answer: `○ ${circle}g, □ ${square}g`,
    solution: `○:□=${squareCount}:${circleCount}입니다. ${squareCount + circleCount}묶음이 ${total}g이므로 ○는 ${circle}g, □는 ${square}g입니다.`,
    meta: { family: "unit-two-weight", circleCount, squareCount, unit, total, circle, square, answer: [circle, square] }
  };
}

function unitTestSymbolCardChainBook6() {
  const symbols = shuffle(["◆", "■", "▲", "●", "✚"]);
  const [diamond, square, triangle, circle, cross] = symbols;
  const values = { [square]: 3, [diamond]: 4, [circle]: 6, [cross]: 7, [triangle]: 8 };
  const equations = [`${diamond}${diamond}${diamond} = ${square}${square}${square}${square}`, `${triangle}${triangle}${triangle} = ${circle}${circle}${circle}${circle}`, `${diamond} + ${triangle} = ${circle}${circle}`, `${triangle} + ${circle} = ${cross}${cross}`];
  return {
    prompt: "3, 4, 6, 7, 8을 서로 다른 도형에 하나씩 넣을 때, 식을 보고 마지막 도형의 수를 구하세요.",
    visual: { kind: "book6", subtype: "unit-test", layout: "symbol-chain", cards: [3, 4, 6, 7, 8], equations, target: cross },
    answer: String(values[cross]),
    solution: `도형 값은 차례로 ${square}=3, ${diamond}=4, ${circle}=6, ${triangle}=8, ${cross}=7입니다.`,
    meta: { family: "unit-symbol-chain", symbols: { diamond, square, triangle, circle, cross }, values, answer: values[cross] }
  };
}

function unitTestRectangleRhombusBook6({ difficulty = 2 }) {
  const shared = randomInt(5, difficulty === 3 ? 18 : 12);
  const width = randomInt(4, difficulty === 3 ? 16 : 10);
  const rectanglePerimeter = 2 * (shared + width);
  return {
    prompt: `둘레가 ${rectanglePerimeter}cm인 직사각형의 한 변 ${width}cm에 마름모를 붙였습니다. 마름모의 한 변을 구하세요.`,
    visual: { kind: "book6", subtype: "unit-test", layout: "rectangle-rhombus", width, shared, rectanglePerimeter },
    answer: `${shared}cm`,
    solution: `직사각형의 가로와 세로의 합은 ${rectanglePerimeter / 2}cm이므로 붙인 변은 ${rectanglePerimeter / 2}-${width}=${shared}cm입니다. 마름모의 한 변도 ${shared}cm입니다.`,
    meta: { family: "unit-rectangle-rhombus", width, shared, rectanglePerimeter, answer: shared }
  };
}

function unitTestAttachedThreeShapesBook6({ difficulty = 2 }) {
  const side = randomInt(3, difficulty === 3 ? 12 : 8);
  const width = randomInt(side + 2, difficulty === 3 ? 24 : 16);
  const perimeter = 2 * width + 5 * side;
  return {
    prompt: `직사각형, 정삼각형, 정사각형을 그림처럼 붙였습니다. 같은 표시의 변은 ${side}cm이고 전체 둘레는 ${perimeter}cm일 때 직사각형의 긴 변을 구하세요.`,
    visual: { kind: "book6", subtype: "unit-test", layout: "three-shapes", side, width, perimeter },
    answer: `${width}cm`,
    solution: `바깥에 보이는 짧은 변은 ${side}cm가 5개입니다. 긴 변 두 개는 ${perimeter}-${5 * side}=${2 * width}cm이므로 한 변은 ${width}cm입니다.`,
    meta: { family: "unit-three-shapes", side, width, perimeter, answer: width }
  };
}

function unitTestThreeSquaresBook6({ difficulty = 2 }) {
  const large = randomInt(5, difficulty === 3 ? 14 : 10);
  const middle = randomInt(Math.floor(large / 2) + 1, large - 1);
  const small = large - middle;
  const answer = 2 * middle;
  return {
    prompt: `한 변이 ${large}cm인 정사각형과 ${middle}cm인 정사각형을 붙이고 남은 자리에 작은 정사각형을 놓았습니다. 색칠한 직사각형의 둘레를 구하세요.`,
    visual: { kind: "book6", subtype: "unit-test", layout: "three-squares", large, middle, small },
    answer: `${answer}cm`,
    solution: `작은 정사각형의 한 변은 ${large}-${middle}=${small}cm입니다. 색칠한 직사각형의 두 변은 ${middle - small}cm와 ${small}cm이므로 둘레는 ${answer}cm입니다.`,
    meta: { family: "unit-three-squares", large, middle, small, answer }
  };
}

function unitTestScatteredPerimeterBook6({ difficulty = 2 }) {
  const horizontal = [randomInt(2, difficulty === 3 ? 12 : 8), randomInt(2, difficulty === 3 ? 12 : 8)];
  const vertical = [randomInt(2, difficulty === 3 ? 11 : 7), randomInt(2, difficulty === 3 ? 11 : 7)];
  const answer = 2 * (sum(horizontal) + sum(vertical));
  return {
    prompt: "직각으로 꺾인 도형에서 표시한 네 변의 길이를 이용해 둘레를 구하세요.",
    visual: { kind: "book6", subtype: "unit-test", layout: "scattered-perimeter", horizontal, vertical },
    answer: `${answer}cm`,
    solution: `가로 길이의 합 ${sum(horizontal)}cm와 세로 길이의 합 ${sum(vertical)}cm가 각각 두 번씩 있으므로 둘레는 ${answer}cm입니다.`,
    meta: { family: "unit-scattered-perimeter", horizontal, vertical, answer }
  };
}

function unitTestSquareTriangleStripBook6({ difficulty = 2 }) {
  const side = randomInt(2, difficulty === 3 ? 10 : 7);
  const answer = 10 * side;
  return {
    prompt: `한 변이 ${side}cm인 정사각형 2개와 정삼각형 4개를 그림처럼 붙였습니다. 바깥 둘레를 구하세요.`,
    visual: { kind: "book6", subtype: "unit-test", layout: "square-triangle-strip", side },
    answer: `${answer}cm`,
    solution: `바깥에 드러난 같은 길이의 변은 10개이므로 ${side}×10=${answer}cm입니다.`,
    meta: { family: "unit-square-triangle-strip", side, outsideEdges: 10, answer }
  };
}

function unitTestSquareTilingBook6({ difficulty = 2 }) {
  const unit = randomInt(2, difficulty === 3 ? 10 : 7);
  const answer = 4 * unit;
  return {
    prompt: "큰 정사각형을 크기가 다른 정사각형으로 나누었습니다. 표시한 전체 길이를 보고 색칠한 가장 작은 정사각형의 둘레를 구하세요.",
    visual: { kind: "book6", subtype: "unit-test", layout: "square-tiling", unit, total: 7 * unit },
    answer: `${answer}cm`,
    solution: `전체 한 변 ${7 * unit}cm는 작은 길이 7칸이므로 한 칸은 ${unit}cm입니다. 색칠한 정사각형의 둘레는 ${unit}×4=${answer}cm입니다.`,
    meta: { family: "unit-square-tiling", unit, total: 7 * unit, answer }
  };
}

function unitTestRoundPairEightBook6({ difficulty = 2 }) {
  const base = difficulty === 1 ? 10 : difficulty === 2 ? 100 : 1000;
  const pairs = Array.from({ length: 4 }, () => {
    const low = randomInt(Math.floor(base * 0.12), Math.floor(base * 0.46));
    return [low, base - low];
  });
  const values = shuffle(pairs.flat());
  const answer = 4 * base;
  return expressionProblem({
    prompt: "여덟 수를 합이 둥근 수가 되는 것끼리 짝지어 계산하세요.", expression: values.join(" + "), values, answer,
    solution: `${base}이 되는 짝이 4쌍이므로 합은 ${answer}입니다.`, family: "unit-round-pair-eight", meta: { base, pairs }
  });
}

function unitTestEvenOddPositionPairBook6({ difficulty = 2 }) {
  const evenPosition = randomInt(5, difficulty === 3 ? 60 : 30);
  const oddPosition = randomInt(5, difficulty === 3 ? 60 : 30);
  const evenValue = evenPosition * 2;
  const oddValue = oddPosition * 2 - 1;
  return {
    prompt: `${evenValue}은 몇 번째 짝수이고, ${oddValue}은 몇 번째 홀수인지 각각 구하세요.`,
    visual: { kind: "book6", subtype: "unit-test", layout: "two-parts", parts: [`(1) ${evenValue}은 몇 번째 짝수?`, `(2) ${oddValue}은 몇 번째 홀수?`] },
    answer: `(1) ${evenPosition}번째 (2) ${oddPosition}번째`,
    solution: `${evenValue}÷2=${evenPosition}, (${oddValue}+1)÷2=${oddPosition}이므로 각각 ${evenPosition}번째, ${oddPosition}번째입니다.`,
    meta: { family: "unit-even-odd-pair", evenValue, oddValue, evenPosition, oddPosition, answer: [evenPosition, oddPosition] }
  };
}

function unitTestFacingPageSumBook6({ difficulty = 2 }) {
  const left = randomInt(difficulty === 1 ? 4 : 10, difficulty === 3 ? 70 : 45) * 2;
  const right = left + 1;
  const pageSum = left + right;
  return {
    prompt: `펼친 책의 마주 보는 두 쪽수의 합이 ${pageSum}입니다. 왼쪽 쪽수를 구하세요.`,
    visual: { kind: "book6", subtype: "book-pages", left: "?", right: "?", sum: pageSum },
    answer: `${left}쪽`,
    solution: `왼쪽은 짝수, 오른쪽은 바로 다음 수입니다. ${pageSum}을 거의 반으로 나누면 ${left}와 ${right}이므로 왼쪽은 ${left}쪽입니다.`,
    meta: { family: "unit-facing-sum", left, right, pageSum, answer: left }
  };
}

function unitTestRangeDigitPairBook6({ difficulty = 2 }) {
  const firstStart = randomInt(1, 7);
  const firstEnd = randomInt(difficulty === 1 ? 18 : 30, difficulty === 3 ? 75 : 48);
  const secondStart = randomInt(12, difficulty === 3 ? 45 : 28);
  const secondEnd = secondStart + randomInt(difficulty === 1 ? 20 : 35, difficulty === 3 ? 100 : 70);
  const parts = [[firstStart, firstEnd], [secondStart, secondEnd]].map(([start, end]) => ({ start, end, numberCount: end - start + 1, digitCount: countWrittenDigits(start, end) }));
  return {
    prompt: "각 범위에서 수의 개수와 수를 쓸 때 필요한 숫자의 개수를 모두 구하세요.",
    visual: { kind: "book6", subtype: "unit-test", layout: "two-parts", parts: parts.map((part, index) => `(${index + 1}) ${part.start}부터 ${part.end}까지`) },
    answer: parts.map((part, index) => `(${index + 1}) 수 ${part.numberCount}개, 숫자 ${part.digitCount}개`).join(" / "),
    solution: parts.map((part, index) => `(${index + 1}) 수는 ${part.end}-${part.start}+1=${part.numberCount}개이고 숫자는 ${part.digitCount}개입니다.`).join(" "),
    meta: { family: "unit-range-digit-pair", parts, answer: parts.map((part) => [part.numberCount, part.digitCount]) }
  };
}

function makeConsecutivePart(count, start) {
  const values = Array.from({ length: count }, (_, index) => start + index);
  return { start, count, end: values.at(-1), answer: sum(values) };
}

function unitTestConsecutiveEvenPairBook6({ difficulty = 2 }) {
  const parts = [makeConsecutivePart(difficulty === 1 ? 6 : 8, randomInt(1, 12)), makeConsecutivePart(difficulty === 3 ? 80 : 60, 1)];
  return {
    prompt: "연속한 수를 양 끝끼리 짝지어 두 합을 각각 구하세요.",
    visual: { kind: "book6", subtype: "unit-test", layout: "two-parts", parts: parts.map((part, index) => `(${index + 1}) ${part.start}+${part.start + 1}+…+${part.end}`) },
    answer: `(1) ${parts[0].answer} (2) ${parts[1].answer}`,
    solution: parts.map((part, index) => `(${index + 1}) 양 끝의 합 ${part.start + part.end}이 ${part.count / 2}쌍이므로 ${part.answer}입니다.`).join(" "),
    meta: { family: "unit-consecutive-even-pair", parts, answer: parts.map((part) => part.answer) }
  };
}

function unitTestConsecutiveOddPairBook6({ difficulty = 2 }) {
  const firstCount = difficulty === 1 ? 5 : 7;
  const secondCount = difficulty === 3 ? 25 : 19;
  const parts = [makeConsecutivePart(firstCount, randomInt(1, 10)), makeConsecutivePart(secondCount, 1)];
  return {
    prompt: "연속한 수의 가운데 수를 이용해 두 합을 각각 구하세요.",
    visual: { kind: "book6", subtype: "unit-test", layout: "two-parts", parts: parts.map((part, index) => `(${index + 1}) ${part.start}+${part.start + 1}+…+${part.end}`) },
    answer: `(1) ${parts[0].answer} (2) ${parts[1].answer}`,
    solution: parts.map((part, index) => `(${index + 1}) 가운데 수 ${(part.start + part.end) / 2}에 ${part.count}을 곱하면 ${part.answer}입니다.`).join(" "),
    meta: { family: "unit-consecutive-odd-pair", parts, answer: parts.map((part) => part.answer) }
  };
}

function unitTestSignTripleBook6({ difficulty = 2 }) {
  const low = randomInt(2, difficulty === 3 ? 7 : 5);
  const values = [low + 6, low + 4, low + 2, low];
  const patterns = [["+", "+", "-"], ["-", "+", "+"], ["-", "+", "-"]];
  const evaluate = (pattern) => values.slice(1).reduce((total, value, index) => total + (pattern[index] === "+" ? value : -value), values[0]);
  const targets = patterns.map(evaluate);
  return {
    prompt: "같은 네 수 사이에 + 또는 -를 넣어 세 결과를 각각 만드세요.",
    visual: { kind: "book6", subtype: "unit-test", layout: "sign-multi", values, targets },
    answer: patterns.map((pattern, index) => `(${index + 1}) ${pattern.join(", ")}`).join(" / "),
    solution: patterns.map((pattern, index) => `(${index + 1}) ${values.map((value, i) => `${i ? pattern[i - 1] : ""}${value}`).join("")}=${targets[index]}`).join(" / "),
    meta: { family: "unit-sign-triple", values, patterns, targets, answer: patterns }
  };
}

function unitTestPlusConcatenationPairBook6({ difficulty = 2 }) {
  const start = randomInt(difficulty === 1 ? 4 : 5, difficulty === 3 ? 9 : 7);
  const digits = Array.from({ length: 5 }, (_, index) => Math.max(1, start - index));
  const patterns = [["+", "", "+", ""], ["+", "+", "", "+"]];
  const targets = patterns.map((pattern) => evaluateJoinedExpression(digits, pattern).value);
  return {
    prompt: "수 사이에 더하기를 넣거나 수를 이어 붙여 두 식을 완성하세요.",
    visual: { kind: "book6", subtype: "unit-test", layout: "join-pair", digits, targets },
    answer: patterns.map((pattern, index) => `(${index + 1}) ${formatJoinedExpression(digits, pattern)}`).join(" / "),
    solution: patterns.map((pattern, index) => `(${index + 1}) ${formatJoinedExpression(digits, pattern)}=${targets[index]}입니다.`).join(" "),
    meta: { family: "unit-join-pair", digits, patterns, targets, answer: patterns }
  };
}

function unitTestBalanceChainBook6() {
  const shapes = shuffle(["●", "■", "◆", "★"]);
  const [circle, square, diamond, star] = shapes;
  const equations = [`${circle}${circle} = ${square}${square}${square}`, `${diamond} = ${circle}${square}`, `${star} = ${square}${diamond}${diamond}`];
  return {
    prompt: "세 양팔저울이 모두 평형입니다. 별 한 개는 네모 몇 개와 같은 무게인지 구하세요.",
    visual: { kind: "book6", subtype: "unit-test", layout: "balance-chain", equations, target: `${star} = ${square} 몇 개?` },
    answer: "6개",
    solution: `${circle} 2개가 ${square} 3개이므로 ${circle}은 ${square} 1개 반입니다. ${diamond}은 ${square} 2개 반, ${star}은 ${square}+${diamond}${diamond}이므로 ${square} 6개와 같습니다.`,
    meta: { family: "unit-balance-chain", shapes: { circle, square, diamond, star }, answer: 6 }
  };
}

function unitTestFoldCutOpenPerimeterBook6({ difficulty = 2 }) {
  const openedSide = randomInt(6, difficulty === 3 ? 16 : 11);
  const cut = randomInt(1, Math.max(2, Math.floor(openedSide / 3)));
  const openedPerimeter = openedSide * 4;
  const foldedWidth = openedSide + cut;
  const originalWidth = foldedWidth * 2;
  const originalHeight = openedSide * 2;
  const answer = 2 * (originalWidth + originalHeight);
  return {
    prompt: `직사각형 색종이를 가로와 세로로 반씩 접고 ${cut}cm만큼 잘라 펼쳤습니다. 펼친 정사각형의 네 변의 합이 ${openedPerimeter}cm일 때 처음 직사각형의 둘레를 구하세요.`,
    visual: { kind: "book6", subtype: "unit-test", layout: "fold-cut-open", cut, openedPerimeter, openedSide },
    answer: `${answer}cm`,
    solution: `펼친 정사각형 한 변은 ${openedPerimeter}÷4=${openedSide}cm입니다. 자르기 전 접힌 크기는 ${foldedWidth}cm와 ${openedSide}cm이고, 처음 종이는 각각 두 배인 ${originalWidth}cm와 ${originalHeight}cm입니다. 둘레는 ${answer}cm입니다.`,
    meta: { family: "unit-fold-cut-open", cut, openedPerimeter, openedSide, foldedWidth, originalWidth, originalHeight, answer }
  };
}

function repeatedDigitConcatenation({ difficulty = 2 }) {
  const digit = randomInt(1, 9);
  const terms = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
  const values = Array.from({ length: terms }, (_, index) => Number(String(digit).repeat(index + 1)));
  const answer = sum(values);
  return expressionProblem({
    prompt: "같은 숫자를 이어 붙여 만든 수들을 더하세요.",
    expression: values.join(" + "), values, answer,
    solution: `${values.join("+")}=${answer}입니다.`,
    family: "repeated-digit-concat", meta: { digit, terms, values }
  });
}

export const BOOK06_GENERATORS = Object.freeze({
  numberLineMidpointBook6,
  numberLineUnitDistanceBook6,
  numberLineTwoPartDistance,
  rodDifferenceMeasureCount,
  equivalentFractionChain,
  equivalentRatioChain,
  barRatioRead,
  barRatioTotalLength,
  balanceRatioBook6,
  balanceWeightRatio,
  symbolSumCardDeduction,
  strideRatioTotal,
  repeatedUnitLengthTotal,
  quadrilateralPerimeter,
  equalSidedQuadrilateralPerimeter,
  joinedQuadrilateralDimensions,
  joinedQuadrilateralSide,
  joinedRegularShapeSide,
  diagonalTrianglePerimeter,
  squareCompositionSide,
  squareCompositionPerimeter,
  foldCutRectanglePerimeter,
  rectilinearRoutePerimeter,
  rectilinearPerimeterBook6,
  concavePerimeter,
  gridCutoutPerimeter,
  polyominoOuterPerimeter,
  attachedRegularShapePerimeter,
  perimeterUnitEdgeInverse,
  cutoutPerimeterChange,
  squarePartitionLengths,
  nestedSquarePerimeter,
  napierMultiplication,
  areaModelMultiplication,
  roundPairAddition,
  roundPairMissingAddend,
  commonFactorSum,
  nearRoundMultiplication,
  nearRoundAddition,
  inclusiveRangeCount,
  consecutiveSumEvenCount,
  consecutiveSumOddCount,
  nthEvenOdd,
  evenOddPosition,
  facingPageNumber,
  alternatingPairSum,
  commonFactorMissingTerm,
  consecutiveNumbersFromSum,
  newspaperPagePair,
  rangeNumberDigitCount,
  totalWrittenDigits,
  digitOccurrenceCount,
  digitExclusionCount,
  consecutiveSignInsertion,
  oddSequenceSignInsertion,
  doublingSequenceSignInsertion,
  plusConcatenationEvaluate,
  plusConcatenationTarget,
  mixedSignConcatenation,
  removePlusConcatenation,
  lastNumberFromDigitTotal,
  unitTestMidpointPairBook6,
  unitTestSplitTargetsBook6,
  unitTestRodDifferenceRatioBook6,
  unitTestEqualBarsBook6,
  unitTestTwoWeightBook6,
  unitTestSymbolCardChainBook6,
  unitTestRectangleRhombusBook6,
  unitTestAttachedThreeShapesBook6,
  unitTestThreeSquaresBook6,
  unitTestScatteredPerimeterBook6,
  unitTestSquareTriangleStripBook6,
  unitTestSquareTilingBook6,
  unitTestRoundPairEightBook6,
  unitTestEvenOddPositionPairBook6,
  unitTestFacingPageSumBook6,
  unitTestRangeDigitPairBook6,
  unitTestConsecutiveEvenPairBook6,
  unitTestConsecutiveOddPairBook6,
  unitTestSignTripleBook6,
  unitTestPlusConcatenationPairBook6,
  unitTestBalanceChainBook6,
  unitTestFoldCutOpenPerimeterBook6,
  repeatedDigitConcatenation
});
