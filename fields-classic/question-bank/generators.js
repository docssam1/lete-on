const COLORS = ["흰색", "검은색"];
const SHAPES = ["동그라미", "세모", "네모"];

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

function hiddenCardCondition({ difficulty = 2 }) {
  const universe = Array.from({ length: 10 }, (_, index) => index);
  const hidden = sample(universe);
  const clueCount = difficulty === 1 ? 3 : difficulty === 3 ? 5 : 4;
  const cardCount = difficulty === 1 ? 4 : difficulty === 3 ? 6 : 5;
  const pattern = difficulty === 1
    ? [true, false, true]
    : difficulty === 3
      ? [true, false, true, false, true]
      : [true, false, true, false];
  let clues;
  let candidates;
  let attempts = 0;

  do {
    clues = pattern.slice(0, clueCount).map((hasCard) => {
      const pool = hasCard ? universe.filter((value) => value !== hidden) : universe.filter((value) => value !== hidden);
      const values = shuffle(pool).slice(0, hasCard ? cardCount - 1 : cardCount);
      if (hasCard) values.push(hidden);
      return { hasCard, values: values.sort((a, b) => a - b) };
    });
    candidates = universe.filter((value) => clues.every((clue) => (
      clue.hasCard ? clue.values.includes(value) : !clue.values.includes(value)
    )));
    attempts += 1;
  } while ((candidates.length !== 1 || candidates[0] !== hidden) && attempts < 500);

  if (candidates.length !== 1 || candidates[0] !== hidden) return hiddenCardCondition({ difficulty });

  return {
    prompt: "숫자 카드 1장을 찾고 있습니다. 다음은 여러 숫자 카드 중에 찾는 카드가 있는지 없는지를 나타낸 것입니다. 찾는 숫자 카드는 무엇일까요?",
    visual: { kind: "hidden-card-conditions", clues },
    answer: String(hidden),
    solution: `‘있습니다’인 줄에는 모두 있고 ‘없습니다’인 줄에는 없는 수를 차례로 확인하면 ${hidden}만 남습니다.`
  };
}

function numberCardEquation({ difficulty = 2 }) {
  const cardMin = difficulty === 1 ? 10 : difficulty === 2 ? 20 : 35;
  const cardMax = difficulty === 1 ? 45 : difficulty === 2 ? 79 : 99;
  let first;
  let second;
  let third;
  let target;
  do {
    first = randomInt(cardMin, cardMax);
    second = randomInt(cardMin, cardMax);
    third = randomInt(cardMin, cardMax);
    target = first + second - third;
  } while (new Set([first, second, third]).size !== 3 || target < cardMin || target > (difficulty === 3 ? 130 : 99));
  const cards = shuffle([first, second, third]);
  return {
    prompt: "숫자 카드 세 장을 한 번씩 모두 사용하여 다음 식을 완성하세요.",
    visual: { kind: "number-card-plus-minus", values: cards, target },
    answer: `${first} + ${second} - ${third} = ${target}`,
    solution: `세 수 중에서 먼저 더할 두 수와 뺄 수를 정합니다. ${first} + ${second} - ${third} = ${target}입니다. 곱셈과 나눗셈은 사용하지 않습니다.`
  };
}

function permutations(values) {
  if (values.length < 2) return [values];
  return values.flatMap((value, index) => permutations([...values.slice(0, index), ...values.slice(index + 1)])
    .map((tail) => [value, ...tail]));
}

function edgeSumCycle({ difficulty = 2 }) {
  const max = difficulty === 1 ? 9 : difficulty === 2 ? 15 : 25;
  let values;
  let solution;
  let edges;
  do {
    values = shuffle(Array.from({ length: max }, (_, index) => index + 1)).slice(0, 4);
    solution = shuffle(values);
    edges = [
      solution[0] + solution[1],
      solution[1] + solution[2],
      solution[2] + solution[3],
      solution[3] + solution[0]
    ];
  } while (permutations(values).filter((candidate) => (
    candidate[0] + candidate[1] === edges[0]
    && candidate[1] + candidate[2] === edges[1]
    && candidate[2] + candidate[3] === edges[2]
    && candidate[3] + candidate[0] === edges[3]
  )).length !== 1);

  const [topLeft, topRight, bottomRight, bottomLeft] = solution;
  return {
    prompt: "주어진 수 카드를 한 번씩 모두 사용하여 네 원 안에 넣으세요. 각 변에 적힌 수는 양끝 원 안의 두 수의 합입니다.",
    visual: { kind: "edge-sum-cycle", values: shuffle(values), edges },
    answer: `왼쪽 위 ${topLeft}, 오른쪽 위 ${topRight}, 오른쪽 아래 ${bottomRight}, 왼쪽 아래 ${bottomLeft}`,
    solution: `윗변의 합이 ${edges[0]}이 되는 두 수를 먼저 찾습니다. 이어서 오른쪽 변, 아랫변, 왼쪽 변의 합을 차례로 확인하면 네 자리가 하나로 정해집니다.`
  };
}

function equalizeTransfer({ difficulty = 2 }) {
  const lower = randomInt(difficulty === 1 ? 4 : difficulty === 2 ? 6 : 10, difficulty === 1 ? 8 : difficulty === 2 ? 12 : 15);
  const transfer = randomInt(1, difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5);
  const higher = lower + transfer * 2;
  const names = Math.random() < 0.5 ? ["강준", "다현"] : ["유진", "민서"];
  return {
    prompt: `${names[0]}이와 ${names[1]}이가 사탕을 똑같이 가지려고 합니다. ${names[0]}이가 ${names[1]}이에게 사탕 몇 개를 주어야 하는지 구하세요.`,
    visual: { kind: "equalize-bags", names, higher, lower },
    answer: `${transfer}개`,
    solution: `두 사람의 사탕 수 차이는 ${higher - lower}개입니다. 한 개를 주면 한쪽은 1개 줄고 다른 쪽은 1개 늘므로, 차이의 반인 ${transfer}개를 주면 같습니다.`
  };
}

function numberPyramid({ difficulty = 2 }) {
  const max = difficulty === 1 ? 6 : difficulty === 2 ? 10 : 16;
  const cards = shuffle(Array.from({ length: max }, (_, index) => index + 1)).slice(0, 3);
  const middle = sample(cards);
  const target = cards.reduce((sum, value) => sum + value, 0) + middle;
  return {
    prompt: "첫째 줄에 주어진 수 카드 세 장을 한 번씩 넣어 두 번 모으기 한 값이 아래 수가 되도록 하세요. ㉠에 들어갈 수를 구하세요.",
    visual: { kind: "number-pyramid", cards: shuffle(cards), target },
    answer: String(middle),
    solution: `두 번 모으기 한 값은 첫째 줄의 세 수의 합에 가운데 수를 한 번 더 더한 값입니다. 카드의 합은 ${cards.reduce((sum, value) => sum + value, 0)}이므로, ${target}에서 ${cards.reduce((sum, value) => sum + value, 0)}을 빼면 ㉠은 ${middle}입니다.`
  };
}

function raceOrder({ difficulty = 2 }) {
  const names = shuffle(["준수", "민호", "성준", "연우", "지우"]);
  const total = difficulty === 3 ? 5 : 4;
  const selected = names.slice(0, total);
  const [first, earlier, fixed, later, extra] = selected;
  if (total === 4) {
    return {
      prompt: `${selected.join("·")} ${total}명의 친구들이 달리기를 하고 있습니다. 다음을 보고 ${first}는 몇 등인지 구하세요.`,
      visual: { kind: "race-order", total, conditions: [`${fixed}은 3등입니다.`, `${earlier}은 ${later}보다 먼저 들어왔지만 1등은 아닙니다.`] },
      answer: "1등",
      solution: `${fixed}은 3등입니다. ${earlier}은 ${later}보다 먼저 들어왔지만 1등이 아니므로 ${earlier}은 2등, ${later}은 4등입니다. 따라서 ${first}는 1등입니다.`,
    };
  }
  return {
    prompt: `${selected.join("·")} ${total}명의 친구들이 달리기를 하고 있습니다. 다음을 보고 ${first}는 몇 등인지 구하세요.`,
    visual: { kind: "race-order", total, conditions: [`${fixed}은 3등입니다.`, `${extra}은 5등입니다.`, `${earlier}은 ${later}보다 먼저 들어왔지만 1등은 아닙니다.`] },
    answer: "1등",
    solution: `${fixed}은 3등이고, ${earlier}은 ${later}보다 먼저 들어왔지만 1등이 아닙니다. ${extra}은 5등이므로 ${earlier}은 2등, ${later}은 4등입니다. 따라서 ${first}는 1등입니다.`,
  };
}

function discNumberRule({ difficulty = 2 }) {
  const max = difficulty === 1 ? 8 : difficulty === 2 ? 12 : 20;
  const makeDisc = () => {
    const northWest = randomInt(1, max);
    const northEast = randomInt(1, max);
    const southWest = randomInt(1, max);
    const southEast = randomInt(1, max);
    const center = (northWest + northEast + southWest + southEast) / 2;
    return Number.isInteger(center) ? { northWest, northEast, southWest, southEast, center } : null;
  };
  let first;
  let second;
  let third;
  do {
    first = makeDisc();
    second = makeDisc();
    const northEast = randomInt(2, max);
    const southWest = randomInt(1, max);
    const southEast = randomInt(1, max);
    const center = randomInt(3, max);
    const northWest = center * 2 - northEast - southWest - southEast;
    third = northWest >= 1 && northWest <= max ? { northWest, northEast, southWest, southEast, center } : null;
  } while (!first || !second || !third);
  return {
    prompt: "원판에 적힌 수의 규칙을 찾아 마지막 원판의 빈 칸에 알맞은 수를 구하세요.",
    visual: { kind: "disc-number-rule", discs: [first, second, { ...third, northWest: "?" }] },
    answer: String(third.northWest),
    solution: `중심 수는 바깥 네 수의 합을 2로 나눈 값입니다. 마지막 원판에서 바깥 세 수의 합을 더해 ${third.center * 2}에서 빼면 빈 칸은 ${third.northWest}입니다.`
  };
}

function shapeSumTable({ difficulty = 2 }) {
  const max = difficulty === 1 ? 5 : difficulty === 2 ? 9 : 15;
  const diamond = randomInt(1, max);
  const square = randomInt(1, max);
  const circle = randomInt(1, max);
  const rowOne = diamond * 2;
  const rowTwo = square + circle;
  const columnOne = diamond + square;
  const columnTwo = diamond + circle;
  return {
    prompt: "[보기]는 가로, 세로 각 줄의 합을 나타낸 표입니다. 오른쪽 표에서 같은 모양은 같은 수를 나타낼 때, ㉠에 알맞은 수를 구하세요.",
    visual: { kind: "shape-sum-table", rowOne, columnOne, columnTwo, rowTwo },
    answer: String(rowTwo),
    solution: `마름모는 ${diamond}, 네모는 ${square}, 동그라미는 ${circle}입니다. 두 번째 줄의 합은 ${square} + ${circle} = ${rowTwo}입니다.`
  };
}

function repeatShapeSequence({ difficulty = 2 }) {
  const target = randomInt(difficulty === 1 ? 8 : difficulty === 2 ? 11 : 21, difficulty === 1 ? 12 : difficulty === 2 ? 20 : 35);
  const cycle = ["동그라미", "세모", "동그라미"];
  const answer = cycle[(target - 1) % cycle.length];
  return {
    prompt: `아래 그림의 규칙을 찾아 ${target}번째 모양을 구하세요.`,
    visual: { kind: "repeat-shape-sequence", items: cycle.concat(cycle, cycle.slice(0, 1)), target },
    answer,
    solution: `동그라미, 세모, 동그라미가 3개씩 반복됩니다. ${target}을 3개씩 나눈 나머지를 확인하면 ${target}번째는 ${answer}입니다.`
  };
}

function arrowNumberGrid({ difficulty = 2 }) {
  const start = randomInt(difficulty === 1 ? 40 : difficulty === 2 ? 60 : 120, difficulty === 1 ? 59 : difficulty === 2 ? 89 : 180);
  const moves = [1, 1, -10, 1, -10, -1, -1, -10];
  const answer = moves.reduce((value, move) => value + move, start);
  return {
    prompt: "보기의 화살표가 나타내는 규칙을 찾아, 출발 수에서 화살표를 따라간 마지막 칸의 수를 구하세요.",
    visual: { kind: "arrow-number-grid", start },
    answer: String(answer),
    solution: `오른쪽 화살표는 1씩 커지고, 위쪽 화살표는 10씩 작아집니다. 화살표를 차례로 따라가면 ${start}에서 ${answer}가 됩니다.`
  };
}

function busPassengers({ max, difficulty }) {
  const start = randomInt(8, Math.max(9, Math.min(max - 5, 35)));
  const boarded = randomInt(2, Math.max(2, Math.min(max - start, difficulty >= 2 ? 12 : 8)));
  const left = randomInt(2, Math.min(start + boarded - 1, difficulty >= 3 ? 15 : 9));
  return {
    prompt: `버스에 ${start}명이 타고 있었습니다. 정류장에서 ${boarded}명이 타고 ${left}명이 내렸습니다. 지금 버스에 몇 명이 타고 있나요?`,
    visual: { kind: "bus", start, boarded, left },
    answer: `${start + boarded - left}명`,
    solution: `처음 사람 수에 탄 사람 ${boarded}명을 더하고, 내린 사람 ${left}명을 뺍니다.`
  };
}

function twoDigitCondition({ max }) {
  const tens = randomInt(2, Math.max(2, Math.min(8, Math.floor((max - 1) / 10))));
  const gap = randomInt(1, Math.min(5, tens));
  const ones = tens - gap;
  const value = tens * 10 + ones;
  const lower = tens * 10 - 1;
  const upper = (tens + 1) * 10;
  const parity = value % 2 === 0 ? "짝수" : "홀수";
  return {
    prompt: `${lower}보다 크고 ${upper}보다 작은 두 자리 ${parity}입니다. 십의 자리 숫자가 일의 자리 숫자보다 ${gap} 큰 수를 구하세요.`,
    visual: { kind: "place", tens, ones: "?" },
    answer: String(value),
    solution: "범위 안의 수를 먼저 적고, 일의 자리와 십의 자리의 차이를 확인합니다. 마지막으로 짝수나 홀수 조건을 확인합니다."
  };
}

function repeatShape({ max, difficulty }) {
  const shapePattern = shuffle(SHAPES).slice(0, difficulty >= 3 ? 3 : 2);
  const colorPattern = difficulty >= 2 ? COLORS : [sample(COLORS)];
  const cycle = shapePattern.length * colorPattern.length;
  const target = randomInt(Math.max(8, cycle + 2), Math.max(10, max));
  const shape = shapePattern[(target - 1) % shapePattern.length];
  const color = colorPattern[(target - 1) % colorPattern.length];
  const items = Array.from({ length: Math.min(cycle * 2, 8) }, (_, index) => ({
    shape: shapePattern[index % shapePattern.length],
    color: colorPattern[index % colorPattern.length]
  }));
  return {
    prompt: `아래 규칙에서 ${target}번째 모양은 무엇인가요?`,
    visual: { kind: "shapes", items },
    answer: `${color} ${shape}`,
    solution: `모양과 색이 각각 몇 개씩 반복되는지 찾아 ${target}번째 위치를 확인합니다.`
  };
}

function pianoZigzag({ max, difficulty }) {
  const keys = difficulty >= 3 ? 7 : 5;
  const target = randomInt(keys + 3, Math.max(keys + 5, max));
  const period = (keys - 1) * 2;
  const offset = (target - 1) % period;
  const position = offset < keys ? offset + 1 : period - offset + 1;
  return {
    prompt: `건반 1에서 시작해 오른쪽으로 한 칸씩 가다가 ${keys}번 건반에서 다시 왼쪽으로 한 칸씩 옵니다. ${target}번째에 누르는 건반은 몇 번인가요?`,
    visual: { kind: "piano", keys, target },
    answer: `${position}번`,
    solution: `1번부터 ${keys}번까지 갔다가 되돌아오는 왕복 마디를 그려 ${target}번째를 찾습니다.`
  };
}

function goStoneTriangle({ max, difficulty }) {
  const largestGap = Math.max(3, Math.min(Math.floor(max / 2), difficulty + 5));
  const gap = randomInt(difficulty >= 3 ? 4 : 2, largestGap);
  const blackMore = Math.random() < 0.5;
  const target = blackMore ? gap * 2 - 1 : gap * 2;
  const color = blackMore ? "검은 돌" : "흰 돌";
  return {
    prompt: `그림과 같은 규칙으로 바둑돌을 놓습니다. ${color}이 다른 색 돌보다 ${gap}개 더 많다면 몇 번째 모양인가요?`,
    visual: { kind: "go-stone", stages: difficulty >= 2 ? 5 : 4 },
    answer: `${target}번째`,
    solution: `1번째는 검은 돌이 1개, 2번째는 흰 돌이 1개 더 많습니다. 그다음에는 색이 번갈아 바뀌면서 차이가 2개, 3개처럼 하나씩 늘어납니다. ${color}의 차이가 ${gap}개가 되는 차례는 ${target}번째입니다.`
  };
}

function lineOrder({ difficulty }) {
  const total = randomInt(difficulty >= 3 ? 7 : 5, difficulty >= 2 ? 9 : 7);
  const between = randomInt(1, Math.min(3, total - 2));
  const first = randomInt(1, total - between - 1);
  const second = first + between + 1;
  return {
    prompt: `${total}명의 친구가 한 줄로 서 있습니다. 지우는 앞에서 ${first}번째이고, 지우와 민서 사이에는 ${between}명이 있습니다. 민서가 지우보다 뒤에 있다면 민서는 앞에서 몇 번째인가요?`,
    visual: { kind: "line", total, first, second },
    answer: `${second}번째`,
    solution: `지우의 자리에서 뒤로 사이 사람 수 ${between}명과 민서 자리 한 칸을 더 이동합니다.`
  };
}

function sourceNonadjacentPyramid() {
  const pairs = [[1,2],[1,3],[2,1],[2,3],[3,1],[3,2]];
  const [top, left] = sample(pairs);
  const answer = [1,2,3].find((value) => value !== top && value !== left);
  return {
    prompt: "도형 안에 1, 2, 3을 같은 숫자끼리 서로 이웃하지 않도록 써넣을 때, ㉠에 들어갈 수를 구하세요.",
    visual: { kind: "nonadjacent-pyramid", top, left },
    answer: String(answer),
    solution: `꼭대기 ${top}과 이웃한 칸에는 ${top}을 쓸 수 없고, 둘째 줄 왼쪽의 ${left}과 이웃한 칸에는 ${left}을 쓸 수 없습니다. 따라서 ㉠에는 남은 수 ${answer}이 들어갑니다.`
  };
}

function sourceGoStoneDifference({ difficulty = 2 }) {
  const target = difficulty === 1 ? randomInt(6, 10) : difficulty === 2 ? randomInt(12, 18) : randomInt(19, 30);
  return {
    prompt: `바둑돌이 그림과 같은 규칙으로 놓여 있습니다. ${target}번째에 놓여 있는 흰 바둑돌과 검은 바둑돌의 수의 차는 몇 개인지 구하세요.`,
    visual: { kind: "source-go-stones", target },
    answer: `${target + 1}개`,
    solution: `1번째의 차는 2개, 2번째의 차는 3개, 3번째의 차는 4개, 4번째의 차는 5개입니다. 다음 모양으로 갈수록 차가 1개씩 늘어나므로 ${target}번째의 차는 ${target + 1}개입니다.`
  };
}

function sourceColoredShapeNumber({ difficulty = 2 }) {
  const digits = [0, 0, 0, 0];
  const active = difficulty === 1 ? randomInt(2, 3) : 4;
  shuffle([0, 1, 2, 3]).slice(0, active).forEach((index) => {
    digits[index] = randomInt(1, 3);
  });
  const weights = [64, 16, 4, 1];
  const answer = digits.reduce((sum, digit, index) => sum + digit * weights[index], 0);
  return {
    prompt: "다음은 도형을 색칠하여 수를 나타낸 것입니다. 아래 도형이 나타내는 수는 얼마인지 구하세요.",
    visual: { kind: "colored-shape-number", digits },
    answer: String(answer),
    solution: `각 열의 칸 하나는 왼쪽부터 64, 16, 4, 1을 나타냅니다. 색칠한 칸의 수를 세어 더하면 ${answer}입니다.`
  };
}

function sourceSymbolRelations({ difficulty = 2 }) {
  const rule = difficulty === 1
    ? { star: 6, circle: 4, triangle: 5, square: 9, firstStar: 2, firstCircle: 3, final: ["○", "▽"] }
    : difficulty === 3
      ? { star: 8, circle: 6, triangle: 7, square: 22, firstStar: 3, firstCircle: 4, final: ["☆", "▽", "▽"] }
      : { star: 8, circle: 6, triangle: 7, square: 15, firstStar: 3, firstCircle: 4, final: ["☆", "▽"] };
  return {
    prompt: "다음 ☆, ○, ▽은 서로 다른 한 자리 수입니다. □가 나타내는 수를 구하세요.",
    visual: { kind: "symbol-relations", ...rule },
    answer: String(rule.square),
    solution: `첫째 식에서 ☆는 ${rule.star}, ○은 ${rule.circle}입니다. 둘째 식에서 ▽은 ${rule.triangle}입니다. 마지막 식을 계산하면 □는 ${rule.square}입니다.`
  };
}

function sourceBalanceRelations({ difficulty = 2 }) {
  const rectangleWeight = difficulty === 3 ? 3 : 2;
  const starRectangles = difficulty === 1 ? 1 : 2;
  const starWeight = 1 + starRectangles * rectangleWeight;
  const answer = starWeight + rectangleWeight;
  return {
    prompt: "다음 양팔저울은 모두 수평입니다. [그림 3]이 수평이 되려면 오른쪽 접시에 ○을 몇 개 놓아야 하는지 구하세요.",
    visual: { kind: "balance-relations", rectangleWeight, starRectangles },
    answer: `${answer}개`,
    solution: `둘째 저울에서 긴 네모 1개는 ○ ${rectangleWeight}개와 같습니다. 첫째 저울에서 ☆는 ○ 1개와 긴 네모 ${starRectangles}개입니다. 따라서 [그림 3]의 ☆와 긴 네모의 무게는 ○ ${answer}개와 같습니다.`
  };
}

function sourcePianoBounce({ difficulty = 2 }) {
  const target = difficulty === 1 ? randomInt(18, 42) : difficulty === 2 ? randomInt(50, 90) : randomInt(91, 150);
  const notes = ["도", "레", "미", "파", "솔", "라", "시", "도"];
  const offset = (target - 1) % 14;
  const key = offset < 8 ? offset + 1 : 15 - offset;
  return {
    prompt: `윤아는 건반 아래에 쓰인 순서로 피아노를 치고 있습니다. 윤아가 건반을 ${target}번 쳤다면 마지막에 친 음은 무엇인지 구하세요.`,
    visual: { kind: "source-piano", target },
    answer: notes[key - 1],
    solution: `도부터 다음 도까지 갔다가 다시 처음 도로 돌아오는 순서를 확인합니다. ${target}번째는 ${notes[key - 1]}를 치는 차례입니다.`
  };
}

function sourceSymbolSumGrid({ difficulty = 2 }) {
  const square = randomInt(difficulty === 1 ? 3 : 5, difficulty === 3 ? 10 : 8);
  const star = randomInt(difficulty === 1 ? 2 : 3, difficulty === 3 ? 10 : 7);
  const triangle = randomInt(difficulty === 1 ? 3 : 5, difficulty === 3 ? 12 : 9);
  const circle = randomInt(difficulty === 1 ? 2 : 4, difficulty === 3 ? 12 : 9);
  const rowOne = star + square + triangle;
  const rowTwo = square * 2 + star;
  const rowThree = triangle + square + circle;
  const columnTwo = square * 3;
  const answer = triangle + star + circle;
  return {
    prompt: "다음 그림에서 같은 도형은 같은 수를 나타내고, 오른쪽과 아래에 쓰여진 수는 각 줄의 합을 나타냅니다. ㉠에 알맞은 수를 구하세요.",
    visual: { kind: "symbol-sum-grid", rowOne, rowTwo, rowThree, columnTwo },
    answer: String(answer),
    solution: `가운데 세모 칸의 합은 ${columnTwo}이므로 네모는 ${square}입니다. 둘째 줄에서 별은 ${star}, 첫째 줄에서 세모는 ${triangle}, 셋째 줄에서 동그라미는 ${circle}입니다. 따라서 ㉠은 ${triangle} + ${star} + ${circle} = ${answer}입니다.`
  };
}

function sourceGrowingDotSquare({ difficulty = 2 }) {
  const target = difficulty === 1 ? randomInt(5, 6) : difficulty === 2 ? randomInt(6, 7) : randomInt(7, 9);
  return {
    prompt: `구슬을 놓아 다음 모양을 만들어 갈 때, ${target}번째 모양에는 구슬을 몇 개 놓는지 구하세요.`,
    visual: { kind: "growing-dot-square", target },
    answer: String(target * target),
    solution: `1번째는 1개, 2번째는 4개, 3번째는 9개, 4번째는 16개입니다. 다음 모양으로 갈수록 가로와 세로에 구슬이 한 개씩 늘어납니다. ${target}번째는 가로 ${target}줄에 ${target}개씩 있으므로 모두 ${target * target}개입니다.`
  };
}

function sourceTwoDigitSumDifference({ difficulty = 2 }) {
  const choices = [];
  const minTens = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
  for (let tens = minTens; tens <= 9; tens += 1) {
    for (let ones = 0; ones < tens; ones += 1) {
      if (difficulty === 1 && ones > 5) continue;
      choices.push({ tens, ones });
    }
  }
  const { tens, ones } = sample(choices);
  const sum = tens + ones;
  const gap = tens - ones;
  return {
    prompt: "다음 주어진 조건을 만족하는 두 자리 수를 구하세요.",
    visual: { kind: "number-conditions", sum, gap },
    answer: String(tens * 10 + ones),
    solution: `십의 자리와 일의 자리의 합이 ${sum}, 차가 ${gap}입니다. 두 수를 만족하는 십의 자리는 ${tens}, 일의 자리는 ${ones}이므로 ${tens * 10 + ones}입니다.`
  };
}

function sourceEqualLineCross() {
  const layouts = [
    [1, 3, 5, 2, 4], [1, 4, 3, 2, 5], [2, 3, 1, 4, 5], [2, 5, 3, 1, 4],
    [3, 1, 5, 4, 2], [3, 2, 1, 5, 4], [3, 4, 5, 1, 2], [3, 5, 1, 2, 4],
    [4, 1, 3, 5, 2], [4, 3, 5, 2, 1], [5, 2, 3, 4, 1], [5, 3, 1, 4, 2]
  ];
  const [top, left, center, right, bottom] = sample(layouts);
  const sum = top + bottom;
  return {
    prompt: "1부터 5까지 수를 한 번씩 넣어 가로줄과 세로줄에 놓인 세 수의 합을 같게 하려고 합니다. ㉠에 들어갈 수를 구하세요.",
    visual: { kind: "equal-line-cross", top, left, center, right, bottom },
    answer: String(center),
    solution: `가로줄과 세로줄의 합이 모두 ${sum}이 되어야 합니다. 남은 수를 차례로 넣어 확인하면 가운데 ㉠은 ${center}입니다.`
  };
}

function sourceBusStops({ difficulty = 2 }) {
  const start = randomInt(difficulty === 1 ? 15 : difficulty === 2 ? 20 : 26, difficulty === 1 ? 24 : difficulty === 2 ? 34 : 45);
  const left = randomInt(difficulty === 1 ? 3 : 5, difficulty === 1 ? 7 : difficulty === 2 ? 11 : 16);
  const boarded = randomInt(difficulty === 1 ? 4 : 6, difficulty === 1 ? 9 : difficulty === 2 ? 14 : 20);
  const answer = start - left + boarded;
  return {
    prompt: `${start}명이 탄 버스가 출발했습니다. 다음과 같이 내리고 탔다면, 지금 버스에 타고 있는 사람은 몇 명인지 구하세요.`,
    visual: { kind: "bus-stops", start, left, boarded },
    answer: `${answer}명`,
    solution: `처음 ${start}명에서 첫 번째 정류장에 내린 ${left}명을 빼고, 두 번째 정류장에서 탄 ${boarded}명을 더합니다. ${start} - ${left} + ${boarded} = ${answer}입니다.`
  };
}

function paperFoldHoleCount({ difficulty }) {
  const folds = difficulty === 1 ? 1 : difficulty >= 3 ? 2 : randomInt(1, 2);
  const firstDirection = Math.random() < 0.5 ? "v" : "h";
  const directions = folds === 1 ? [firstDirection] : [firstDirection, firstDirection === "v" ? "h" : "v"];
  const maxHoles = difficulty >= 4 ? 3 : folds === 1 ? 3 : 2;
  const holeCount = randomInt(1, maxHoles);
  const holes = [];
  let attempts = 0;
  while (holes.length < holeCount && attempts < 80) {
    const hole = { x: 0.22 + Math.random() * 0.56, y: 0.22 + Math.random() * 0.56 };
    if (holes.every((item) => Math.hypot(item.x - hole.x, item.y - hole.y) > 0.3)) holes.push(hole);
    attempts += 1;
  }
  const multiplier = 2 ** folds;
  return {
    prompt: `색종이를 그림처럼 반으로 ${folds === 1 ? "한 번" : "두 번"} 접은 다음 구멍을 ${holeCount}개 뚫었습니다. 색종이를 펼쳤을 때 구멍은 모두 몇 개인가요?`,
    visual: { kind: "paper-fold", folds, directions, holes },
    answer: `${holeCount * multiplier}개`,
    solution: `${folds === 1 ? "한 번" : "두 번"} 접었으므로 구멍 하나가 펼쳤을 때 ${multiplier}개가 됩니다. ${holeCount}개를 각각 펼치면 모두 ${holeCount * multiplier}개입니다.`
  };
}

export const GENERATORS = {
  hiddenCardCondition,
  edgeSumCycle,
  equalizeTransfer,
  numberPyramid,
  raceOrder,
  discNumberRule,
  shapeSumTable,
  repeatShapeSequence,
  arrowNumberGrid,
  numberCardEquation,
  busPassengers,
  sourceNonadjacentPyramid,
  sourceGoStoneDifference,
  sourceColoredShapeNumber,
  sourceSymbolRelations,
  sourceBalanceRelations,
  sourcePianoBounce,
  sourceSymbolSumGrid,
  sourceGrowingDotSquare,
  sourceTwoDigitSumDifference,
  sourceEqualLineCross,
  sourceBusStops,
  twoDigitCondition,
  repeatShape,
  pianoZigzag,
  goStoneTriangle,
  lineOrder,
  paperFoldHoleCount
};
