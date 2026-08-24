// 더클래식 1과정 4권 전용 생성기.
// 원본 문제는 저장하지 않고, 문제 번호로 확인한 풀이 구조만 재현한다.

import { BOOK01_GENERATORS } from "./book01-generators.js";

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = randomInt(0, index);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

const TETROMINOES = Object.freeze([
  { id: "I", label: "긴 막대", cells: [[0,0],[0,1],[0,2],[0,3]] },
  { id: "O", label: "네모", cells: [[0,0],[0,1],[1,0],[1,1]] },
  { id: "T", label: "T 모양", cells: [[0,0],[0,1],[0,2],[1,1]] },
  { id: "L", label: "L 모양", cells: [[0,0],[1,0],[2,0],[2,1]] },
  { id: "J", label: "거꾸로 L 모양", cells: [[0,1],[1,1],[2,0],[2,1]] },
  { id: "S", label: "S 모양", cells: [[0,1],[0,2],[1,0],[1,1]] },
  { id: "Z", label: "Z 모양", cells: [[0,0],[0,1],[1,1],[1,2]] }
]);

function normalizeCells(cells) {
  const minRow = Math.min(...cells.map(([row]) => row));
  const minColumn = Math.min(...cells.map(([, column]) => column));
  return cells.map(([row, column]) => [row - minRow, column - minColumn])
    .sort(([rowA, columnA], [rowB, columnB]) => rowA - rowB || columnA - columnB);
}

function rotateCells(cells, turns) {
  let result = cells.map((cell) => [...cell]);
  for (let turn = 0; turn < turns; turn += 1) result = result.map(([row, column]) => [column, -row]);
  return normalizeCells(result);
}

function cellsKey(cells) {
  return normalizeCells(cells).map(([row, column]) => `${row}:${column}`).join("|");
}

function connectedCells(cells) {
  const keys = new Set(cells.map(([row, column]) => `${row}:${column}`));
  const seen = new Set();
  const queue = [cells[0]];
  while (queue.length) {
    const [row, column] = queue.shift();
    const key = `${row}:${column}`;
    if (seen.has(key)) continue;
    seen.add(key);
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr, dc]) => {
      const next = `${row + dr}:${column + dc}`;
      if (keys.has(next) && !seen.has(next)) queue.push([row + dr, column + dc]);
    });
  }
  return seen.size === cells.length;
}

function tetrominoFamilyChoice({ difficulty = 2 }) {
  const valid = shuffle(TETROMINOES).slice(0, 3).map((shape) => ({
    id: shape.id,
    cells: rotateCells(shape.cells, difficulty === 1 ? 0 : randomInt(0, 3)),
    valid: true
  }));
  const invalidShapes = [
    [[0,0],[0,1],[0,2],[1,3]],
    [[0,0],[0,1],[1,2],[2,2]],
    [[0,0],[1,0],[1,1],[2,2]]
  ];
  const invalid = { id: "not-tetromino", cells: rotateCells(sample(invalidShapes), randomInt(0, 3)), valid: false };
  const options = shuffle([...valid, invalid]).map((option, index) => ({ ...option, option: index + 1 }));
  const correctOption = options.find((option) => !option.valid).option;
  return {
    prompt: "같은 크기의 정사각형 4개를 변끼리 이어 붙여 만든 모양이 아닌 것을 고르세요.",
    visual: { kind: "book4", subtype: "tetromino-choice", options },
    answer: `${correctOption}번`,
    solution: `${correctOption}번은 정사각형 4개가 모두 변으로 이어지지 않습니다. 나머지는 네 칸이 한 덩어리로 이어집니다.`,
    meta: { family: "tetromino-family", correctOption, optionValidity: options.map((option) => option.valid), optionCells: options.map((option) => option.cells) }
  };
}

function tetrominoSquareComposition({ difficulty = 2 }) {
  const target = sample(TETROMINOES);
  const targetCells = rotateCells(target.cells, difficulty === 1 ? 0 : randomInt(0, 3));
  const others = shuffle(TETROMINOES.filter((shape) => shape.id !== target.id)).slice(0, 3);
  const options = shuffle([target, ...others]).map((shape, index) => ({
    option: index + 1,
    id: shape.id,
    cells: rotateCells(shape.cells, difficulty === 1 ? 0 : randomInt(0, 3)),
    correct: shape.id === target.id
  }));
  const correctOption = options.find((option) => option.correct).option;
  return {
    prompt: "빈자리에 꼭 맞는 네 칸 조각을 고르세요. 조각은 돌려서 놓을 수 있습니다.",
    visual: { kind: "book4", subtype: "tetromino-fit", targetCells, options },
    answer: `${correctOption}번`,
    solution: `빈자리의 꺾인 방향과 네 칸의 이어진 모양을 비교하면 ${correctOption}번 조각만 돌려서 정확히 겹칩니다.`,
    meta: { family: "tetromino-fit", targetId: target.id, targetCells, correctOption, optionIds: options.map((option) => option.id) }
  };
}

const GRID_OPERATIONS = Object.freeze({
  "rotate-right": "오른쪽으로 반의 반 바퀴 돌리기",
  "rotate-half": "반 바퀴 돌리기",
  "mirror-left-right": "좌우로 뒤집기",
  "mirror-top-bottom": "위아래로 뒤집기"
});

const GRID_OPERATION_CONNECTIVES = Object.freeze({
  "rotate-right": "오른쪽으로 반의 반 바퀴 돌리고",
  "rotate-half": "반 바퀴 돌리고",
  "mirror-left-right": "좌우로 뒤집고",
  "mirror-top-bottom": "위아래로 뒤집고"
});

const GRID_OPERATION_FINALS = Object.freeze({
  "rotate-right": "오른쪽으로 반의 반 바퀴 돌렸습니다.",
  "rotate-half": "반 바퀴 돌렸습니다.",
  "mirror-left-right": "좌우로 뒤집었습니다.",
  "mirror-top-bottom": "위아래로 뒤집었습니다."
});

function transformGrid(grid, operation) {
  const rows = grid.length;
  const columns = grid[0].length;
  if (operation === "rotate-right") {
    return Array.from({ length: columns }, (_, row) => Array.from({ length: rows }, (_, column) => grid[rows - 1 - column][row]));
  }
  if (operation === "rotate-half") return grid.map((row) => [...row].reverse()).reverse();
  if (operation === "mirror-left-right") return grid.map((row) => [...row].reverse());
  return [...grid].reverse().map((row) => [...row]);
}

function digitalGridTransform({ difficulty = 2 }) {
  const size = difficulty === 1 ? 3 : 4;
  const start = randomInt(1, difficulty === 3 ? 20 : 8);
  const values = Array.from({ length: size * size }, (_, index) => start + index);
  const grid = Array.from({ length: size }, (_, row) => values.slice(row * size, (row + 1) * size));
  const operationPool = Object.keys(GRID_OPERATIONS);
  const operations = difficulty === 3 ? [sample(operationPool), sample(operationPool)] : [sample(operationPool)];
  const result = operations.reduce((current, operation) => transformGrid(current, operation), grid);
  const target = { row: randomInt(0, size - 1), column: randomInt(0, size - 1) };
  const answer = result[target.row][target.column];
  const actionText = operations.map((operation, index) => (
    index === operations.length - 1 ? GRID_OPERATION_FINALS[operation] : GRID_OPERATION_CONNECTIVES[operation]
  )).join(" ");
  return {
    prompt: `수 배열판을 ${actionText} 물음표 칸의 수를 구하세요.`,
    visual: { kind: "book4", subtype: "digital-grid-transform", grid, operations, operationLabels: operations.map((operation) => GRID_OPERATIONS[operation]), target },
    answer: String(answer),
    solution: `${operations.map((operation) => GRID_OPERATIONS[operation]).join(" → ")}의 순서로 칸을 옮기면 물음표 자리에는 ${answer}이 옵니다.`,
    meta: { family: "digital-grid-transform", source: grid, operations, result, target, answer }
  };
}

function digitalTransformArithmetic({ difficulty = 2 }) {
  const first = BOOK01_GENERATORS.digitalTwoDigitTransform({ difficulty });
  const second = BOOK01_GENERATORS.digitalTwoDigitTransform({ difficulty });
  let rows = [
    { source: first.meta.source, result: first.meta.result, operation: first.meta.operation },
    { source: second.meta.source, result: second.meta.result, operation: second.meta.operation }
  ];
  const operator = difficulty === 3 && Math.random() < 0.5 ? "-" : "+";
  if (operator === "-" && rows[0].result < rows[1].result) rows = rows.reverse();
  const answer = operator === "+" ? rows[0].result + rows[1].result : rows[0].result - rows[1].result;
  return {
    prompt: `두 디지털 수를 각각 설명대로 움직인 뒤 ${operator === "+" ? "더한" : "큰 수에서 작은 수를 뺀"} 값을 구하세요.`,
    visual: { kind: "book4", subtype: "digital-arithmetic", rows, operator },
    answer: String(answer),
    solution: `움직인 뒤의 수는 ${rows[0].result}, ${rows[1].result}입니다. ${rows[0].result} ${operator} ${rows[1].result} = ${answer}입니다.`,
    meta: { family: "digital-arithmetic", rows, operator, answer }
  };
}

function foldCoordinate(row, column, size, folds) {
  let currentRow = row;
  let currentColumn = column;
  let rows = size;
  let columns = size;
  folds.forEach((fold) => {
    if (fold.axis === "vertical") {
      currentColumn = Math.min(currentColumn, columns - 1 - currentColumn);
      columns /= 2;
    } else {
      currentRow = Math.min(currentRow, rows - 1 - currentRow);
      rows /= 2;
    }
  });
  return { row: currentRow, column: currentColumn, rows, columns };
}

function foldNumberGridMulti({ difficulty = 2 }) {
  const size = 4;
  const start = randomInt(1, difficulty === 3 ? 25 : 8);
  const values = Array.from({ length: size * size }, (_, index) => start + index);
  const grid = Array.from({ length: size }, (_, row) => values.slice(row * size, (row + 1) * size));
  const vertical = { axis: "vertical", direction: sample(["오른쪽을 왼쪽으로", "왼쪽을 오른쪽으로"]) };
  const horizontal = { axis: "horizontal", direction: sample(["아래쪽을 위쪽으로", "위쪽을 아래쪽으로"]) };
  const folds = difficulty === 1 ? [sample([vertical, horizontal])] : shuffle([vertical, horizontal]);
  const finalSize = folds.reduce((current, fold) => ({
    rows: fold.axis === "horizontal" ? current.rows / 2 : current.rows,
    columns: fold.axis === "vertical" ? current.columns / 2 : current.columns
  }), { rows: size, columns: size });
  const target = { row: randomInt(0, finalSize.rows - 1), column: randomInt(0, finalSize.columns - 1) };
  const cutCells = [];
  grid.forEach((rowValues, row) => rowValues.forEach((value, column) => {
    const folded = foldCoordinate(row, column, size, folds);
    if (folded.row === target.row && folded.column === target.column) cutCells.push({ row, column, value });
  }));
  const answer = cutCells.reduce((sum, cell) => sum + cell.value, 0);
  return {
    prompt: `번호판을 ${folds.map((fold) => fold.direction).join(" 접고, 다시 ")} 접었습니다. 표시한 칸을 잘랐을 때 잘린 수의 합을 구하세요.`,
    visual: { kind: "book4", subtype: "fold-number-grid", grid, folds, foldedRows: finalSize.rows, foldedColumns: finalSize.columns, target },
    answer: String(answer),
    solution: `접은 선을 따라 표시한 칸을 펼치면 ${cutCells.map((cell) => cell.value).join(", ")}이 함께 잘립니다. 합은 ${cutCells.map((cell) => cell.value).join(" + ")} = ${answer}입니다.`,
    meta: { family: "fold-number-grid", size, grid, folds, finalSize, target, cutCells, answer }
  };
}

function reverseStack(stack) {
  return [...stack].reverse();
}

function applySurfaceFold(grid, fold) {
  const rows = grid.length;
  const columns = grid[0].length;
  if (fold === "right-to-left") {
    return Array.from({ length: rows }, (_, row) => Array.from({ length: columns / 2 }, (_, column) => [
      ...reverseStack(grid[row][columns - 1 - column]), ...grid[row][column]
    ]));
  }
  if (fold === "left-to-right") {
    return Array.from({ length: rows }, (_, row) => Array.from({ length: columns / 2 }, (_, column) => [
      ...reverseStack(grid[row][columns / 2 - 1 - column]), ...grid[row][columns / 2 + column]
    ]));
  }
  if (fold === "bottom-to-top") {
    return Array.from({ length: rows / 2 }, (_, row) => Array.from({ length: columns }, (_, column) => [
      ...reverseStack(grid[rows - 1 - row][column]), ...grid[row][column]
    ]));
  }
  return Array.from({ length: rows / 2 }, (_, row) => Array.from({ length: columns }, (_, column) => [
    ...reverseStack(grid[rows / 2 - 1 - row][column]), ...grid[rows / 2 + row][column]
  ]));
}

const SURFACE_FOLD_LABELS = Object.freeze({
  "right-to-left": "오른쪽을 왼쪽으로",
  "left-to-right": "왼쪽을 오른쪽으로",
  "bottom-to-top": "아래쪽을 위쪽으로",
  "top-to-bottom": "위쪽을 아래쪽으로"
});

function foldSurfaceTopTrace({ difficulty = 2 }) {
  const labels = shuffle(["빨강", "노랑", "초록", "파랑"]);
  let grid = [[ [labels[0]], [labels[1]] ], [ [labels[2]], [labels[3]] ]];
  const first = sample(["right-to-left", "left-to-right", "bottom-to-top", "top-to-bottom"]);
  const secondPool = first.includes("left") || first.includes("right")
    ? ["bottom-to-top", "top-to-bottom"]
    : ["right-to-left", "left-to-right"];
  const folds = difficulty === 1 ? [first] : [first, sample(secondPool)];
  folds.forEach((fold) => { grid = applySurfaceFold(grid, fold); });
  const target = difficulty === 1
    ? { row: randomInt(0, grid.length - 1), column: randomInt(0, grid[0].length - 1) }
    : { row: 0, column: 0 };
  const answer = grid[target.row][target.column][0];
  return {
    prompt: "각 칸의 앞뒤 색이 같습니다. 설명대로 접었을 때 맨 위에 보이는 색을 구하세요.",
    visual: { kind: "book4", subtype: "fold-surface-top", labels, folds, foldLabels: folds.map((fold) => SURFACE_FOLD_LABELS[fold]), finalRows: grid.length, finalColumns: grid[0].length, target },
    answer,
    solution: `${folds.map((fold) => SURFACE_FOLD_LABELS[fold]).join(" → ")} 순서로 위에 포개지는 칸을 따라가면 ${answer}색이 맨 위입니다.`,
    meta: { family: "fold-surface-top", labels, folds, finalStacks: grid, target, answer }
  };
}

function pairSumCardCompletion({ difficulty = 2 }) {
  const target = randomInt(difficulty === 1 ? 9 : 12, difficulty === 3 ? 24 : 18);
  const possible = [];
  for (let first = 1; first < target / 2; first += 1) possible.push([first, target - first]);
  const pairCount = Math.min(difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5, possible.length);
  const pairs = shuffle(possible).slice(0, pairCount).map((pair) => shuffle(pair));
  const blankPair = randomInt(0, pairs.length - 1);
  const blankSide = randomInt(0, 1);
  const answer = pairs[blankPair][blankSide];
  return {
    prompt: `한 쌍의 두 수를 더하면 모두 ${target}입니다. 빈 카드에 알맞은 수를 쓰세요.`,
    visual: { kind: "book4", subtype: "pair-sum-cards", target, pairs, blankPair, blankSide },
    answer: String(answer),
    solution: `${target}에서 같은 쌍의 보이는 수 ${pairs[blankPair][1 - blankSide]}을 빼면 ${answer}입니다.`,
    meta: { family: "pair-sum-cards", target, pairs, blankPair, blankSide, answer }
  };
}

function shapeDifferenceChain({ difficulty = 2 }) {
  const symbols = shuffle(["●", "▲", "■", "★"]).slice(0, difficulty === 1 ? 3 : 4);
  const increments = Array.from({ length: symbols.length - 1 }, () => randomInt(2, difficulty === 3 ? 9 : 6));
  const values = [randomInt(2, 8)];
  increments.forEach((increment) => values.push(values.at(-1) + increment));
  const equations = increments.map((difference, index) => ({ larger: symbols[index + 1], smaller: symbols[index], difference }));
  const answer = values.at(-1) - values[0];
  return {
    prompt: "같은 모양은 같은 수를 나타냅니다. 식의 관계를 이어 물음표에 알맞은 수를 구하세요.",
    visual: { kind: "book4", subtype: "shape-difference-chain", equations, target: { larger: symbols.at(-1), smaller: symbols[0] } },
    answer: String(answer),
    solution: `${equations.map((equation) => equation.difference).join(" + ")} = ${answer}이므로 두 끝 모양의 차는 ${answer}입니다.`,
    meta: { family: "shape-difference-chain", symbols, values, increments, equations, answer }
  };
}

const ORDER_NAMES = ["가은", "도윤", "민서", "준호", "하은"];
const hasFinal = (word) => {
  const code = word.charCodeAt(word.length - 1);
  return code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
};
const topic = (word) => `${word}${hasFinal(word) ? "은" : "는"}`;

function measurementOrderChain({ difficulty = 2 }) {
  const count = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
  const names = shuffle(ORDER_NAMES).slice(0, count);
  const base = randomInt(95, difficulty === 3 ? 135 : 120);
  const differences = Array.from({ length: count - 1 }, () => randomInt(2, difficulty === 3 ? 9 : 6));
  const values = [base];
  differences.forEach((difference) => values.push(values.at(-1) + difference));
  const clues = [`${topic(names[0])} ${base}cm입니다.`];
  differences.forEach((difference, index) => clues.push(`${topic(names[index + 1])} ${names[index]}보다 ${difference}cm 큽니다.`));
  const targetIndex = randomInt(1, count - 1);
  const answer = values[targetIndex];
  return {
    prompt: `친구들의 키를 비교한 조건입니다. ${names[targetIndex]}의 키를 구하세요.`,
    visual: { kind: "book4", subtype: "measurement-order", clues, names, target: names[targetIndex] },
    answer: `${answer}cm`,
    solution: `${base}cm에서 차례로 ${differences.slice(0, targetIndex).join("cm, ")}cm를 더하면 ${names[targetIndex]}의 키는 ${answer}cm입니다.`,
    meta: { family: "measurement-order", names, base, differences, values, targetIndex, answer }
  };
}

function balanceUnitRatio({ difficulty = 2 }) {
  const objects = shuffle([
    { symbol: "●", label: "동그라미" },
    { symbol: "▲", label: "세모" },
    { symbol: "■", label: "네모" },
    { symbol: "★", label: "별" }
  ]).slice(0, difficulty === 3 ? 4 : 3);
  const ratios = Array.from({ length: objects.length - 1 }, () => randomInt(2, difficulty === 3 ? 4 : 3));
  const answer = ratios.reduce((product, ratio) => product * ratio, 1);
  const equations = ratios.map((ratio, index) => ({ left: objects[index], right: objects[index + 1], ratio }));
  return {
    prompt: `저울이 모두 수평입니다. ${objects[0].label} 1개는 ${objects.at(-1).label} 몇 개와 무게가 같을까요?`,
    visual: { kind: "book4", subtype: "balance-unit-ratio", equations, target: { left: objects[0], right: objects.at(-1) } },
    answer: `${answer}개`,
    solution: `차례로 ${ratios.join("배, ")}배의 관계이므로 ${ratios.join(" × ")} = ${answer}입니다.`,
    meta: { family: "balance-unit-ratio", objects, ratios, equations, answer }
  };
}

const SEAT_NAMES = ["가은", "도윤", "민서", "준호", "하은", "서윤"];

function snakePath(rows, columns) {
  const path = [];
  for (let row = 0; row < rows; row += 1) {
    const columnsInRow = Array.from({ length: columns }, (_, column) => column);
    if (row % 2) columnsInRow.reverse();
    columnsInRow.forEach((column) => path.push([row, column]));
  }
  if (Math.random() < 0.5) path.reverse();
  if (Math.random() < 0.5) return path.map(([row, column]) => [row, columns - 1 - column]);
  return path;
}

function directionBetween(from, to) {
  if (to[0] === from[0] && to[1] === from[1] + 1) return "오른쪽";
  if (to[0] === from[0] && to[1] === from[1] - 1) return "왼쪽";
  if (to[0] === from[0] + 1) return "아래";
  return "위";
}

function seatPositionLabel([row, column], rows, columns) {
  const vertical = rows === 1 ? "" : row === 0 ? "윗줄 " : "아랫줄 ";
  const horizontal = columns === 2 ? (column === 0 ? "왼쪽" : "오른쪽") : ["왼쪽", "가운데", "오른쪽"][column];
  return `${vertical}${horizontal}`.trim();
}

function directionalSeatPlacement({ difficulty = 2 }) {
  const rows = 2;
  const columns = difficulty === 1 ? 2 : 3;
  const count = rows * columns;
  const names = shuffle(SEAT_NAMES).slice(0, count);
  const path = snakePath(rows, columns);
  const placements = names.map((name, index) => ({ name, row: path[index][0], column: path[index][1] }));
  const clues = [`${topic(names[0])} ${seatPositionLabel(path[0], rows, columns)} 자리에 있습니다.`];
  for (let index = 1; index < names.length; index += 1) {
    clues.push(`${topic(names[index])} ${names[index - 1]}의 ${directionBetween(path[index - 1], path[index])}에 바로 붙어 있습니다.`);
  }
  const target = sample(placements.slice(1));
  const answer = seatPositionLabel([target.row, target.column], rows, columns);
  return {
    prompt: `조건에 맞게 친구들을 자리에 놓을 때, ${target.name}의 자리를 말하세요.`,
    visual: { kind: "book4", subtype: "directional-seat", rows, columns, clues, target: target.name },
    answer,
    solution: `첫 친구의 자리를 정하고 ${clues.slice(1).join(" ")} 따라서 ${target.name}의 자리는 ${answer}입니다.`,
    meta: { family: "directional-seat", rows, columns, names, path, placements, clues, target: target.name, answer }
  };
}

function circularSeatPlacement({ difficulty = 2 }) {
  const count = difficulty === 1 ? 5 : 6;
  const names = shuffle(SEAT_NAMES).slice(0, count);
  const clockwise = difficulty === 3 ? [...names].reverse() : names;
  const clues = [`${topic(clockwise[0])} 맨 위 자리에 앉습니다.`];
  for (let index = 1; index < clockwise.length; index += 1) clues.push(`${topic(clockwise[index])} ${clockwise[index - 1]}의 시계 방향 바로 옆에 앉습니다.`);
  const targetIndex = randomInt(1, count - 1);
  const askOpposite = count % 2 === 0 && difficulty >= 2 && Math.random() < 0.5;
  const answerIndex = askOpposite ? (targetIndex + count / 2) % count : (targetIndex + 1) % count;
  const relation = askOpposite ? "마주 보는" : "시계 방향 바로 옆의";
  return {
    prompt: `조건에 맞게 원탁에 앉을 때, ${clockwise[targetIndex]}와 ${relation} 사람은 누구인가요?`,
    visual: { kind: "book4", subtype: "circular-seat", count, clues, anchor: clockwise[0], target: clockwise[targetIndex], relation },
    answer: clockwise[answerIndex],
    solution: `맨 위 자리부터 시계 방향으로 ${clockwise.join(" → ")} 순서입니다. 따라서 답은 ${clockwise[answerIndex]}입니다.`,
    meta: { family: "circular-seat", count, clockwise, clues, targetIndex, answerIndex, relation, answer: clockwise[answerIndex] }
  };
}

function ordinalLinePlacement({ difficulty = 2 }) {
  const made = BOOK01_GENERATORS.relativeOrderLogicBook1({ difficulty });
  if (!made) return null;
  return {
    ...made,
    prompt: "친구들이 한 줄로 서 있습니다. 앞뒤 순서와 사이 사람 수 조건을 보고 물음에 답하세요.",
    meta: { ...made.meta, family: "ordinal-line" }
  };
}

export const BOOK04_GENERATORS = {
  tetrominoFamilyChoice,
  tetrominoSquareComposition,
  digitalGridTransform,
  digitalTransformArithmetic,
  foldNumberGridMulti,
  foldSurfaceTopTrace,
  pairSumCardCompletion,
  shapeDifferenceChain,
  measurementOrderChain,
  balanceUnitRatio,
  directionalSeatPlacement,
  circularSeatPlacement,
  ordinalLinePlacement
};
