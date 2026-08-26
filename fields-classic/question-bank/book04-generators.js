// 더클래식 1과정 4권 전용 생성기.
// 원본 문제는 저장하지 않고, 문제 번호로 확인한 풀이 구조만 재현한다.

import { BOOK01_GENERATORS, BOOK01_INTERNALS } from "./book01-generators.js";

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

function permutations(items) {
  if (items.length < 2) return [items];
  return items.flatMap((item, index) => permutations(items.filter((_, itemIndex) => itemIndex !== index)).map((rest) => [item, ...rest]));
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

const STAR_PARTITIONS = Object.freeze([
  [[0,4,8,9],[1,2,3,5],[6,7,11,15],[10,12,13,14]],
  [[0,1,2,4],[3,5,6,7],[8,9,10,12],[11,13,14,15]],
  [[0,1,5,9],[2,3,7,11],[4,8,12,13],[6,10,14,15]]
]);
const FOREST_PARTITION = Object.freeze([
  [[0,1],[1,1],[1,2]],
  [[0,2],[0,3],[1,3]],
  [[1,0],[2,0],[2,1]],
  [[2,2],[3,1],[3,2]]
]);

function markedCongruentPartition({ rows, columns, groups, marker, markerLabel, prompt }) {
  const activeCells = groups.flat();
  const markerCells = groups.map((group) => sample(group));
  const pieceSizeLabel = groups[0].length === 3 ? "세" : "네";
  const visual = { kind: "book4", subtype: "marked-congruent-partition", rows, columns, activeCells, groups, markerCells, marker, markerLabel };
  return {
    prompt,
    visual: { ...visual, reveal: false },
    answerVisual: { ...visual, reveal: true },
    answer: "그림 답안",
    responseKind: "drawing",
    solution: `각 조각이 ${pieceSizeLabel} 칸으로 이어지고 돌려서 포개었을 때 모두 같은 모양이 되도록 나눕니다. 각 조각에는 ${subjectOf(markerLabel)} 하나씩 들어갑니다.`,
    meta: { family: "marked-congruent-partition-book4", rows, columns, activeCells, groups, markerCells, marker, answer: "drawing" }
  };
}

function starCongruentPartitionDrawBook4() {
  const groups = sample(STAR_PARTITIONS).map((group) => group.map((index) => [Math.floor(index / 4), index % 4]));
  return markedCongruentPartition({
    rows: 4,
    columns: 4,
    groups,
    marker: "★",
    markerLabel: "별",
    prompt: "칸의 선을 따라 모양과 크기가 같은 네 조각으로 나누어 보세요. 각 조각에는 별이 하나씩 들어가야 합니다."
  });
}

function forestCongruentPartitionDrawBook4() {
  const groups = FOREST_PARTITION.map((group) => group.map((cell) => [...cell]));
  return markedCongruentPartition({
    rows: 4,
    columns: 4,
    groups,
    marker: "♣",
    markerLabel: "나무",
    prompt: "나무가 심어진 땅을 모양과 크기가 같은 네 부분으로 나누어 집을 지으려고 합니다. 각 부분에 나무가 하나씩 들어가도록 선을 그으세요."
  });
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

const MATRIX_IDENTITY = Object.freeze([1, 0, 0, 1]);
const BOARD_TRANSFORMS = Object.freeze({
  "rotate-right": Object.freeze([0, -1, 1, 0]),
  "rotate-half": Object.freeze([-1, 0, 0, -1]),
  "mirror-left-right": Object.freeze([-1, 0, 0, 1]),
  "mirror-top-bottom": Object.freeze([1, 0, 0, -1])
});
const BOARD_TRANSFORM_LABELS = Object.freeze({
  "rotate-right": "오른쪽으로 반의 반 바퀴 돌리기",
  "rotate-half": "반 바퀴 돌리기",
  "mirror-left-right": "오른쪽으로 뒤집기",
  "mirror-top-bottom": "아래로 뒤집기"
});

function multiplyMatrix(left, right) {
  return [
    left[0] * right[0] + left[1] * right[2],
    left[0] * right[1] + left[1] * right[3],
    left[2] * right[0] + left[3] * right[2],
    left[2] * right[1] + left[3] * right[3]
  ];
}

function transposeMatrix(matrix) {
  return [matrix[0], matrix[2], matrix[1], matrix[3]];
}

const DIGIT_ORIENTATIONS = Object.freeze([
  [1, 0, 0, 1], [0, -1, 1, 0], [-1, 0, 0, -1], [0, 1, -1, 0],
  [-1, 0, 0, 1], [1, 0, 0, -1], [0, 1, 1, 0], [0, -1, -1, 0]
]);

function applyBoardOperation(grid, operation) {
  const moved = transformGrid(grid, operation);
  const matrix = BOARD_TRANSFORMS[operation];
  return moved.map((row) => row.map((card) => ({ ...card, matrix: multiplyMatrix(matrix, card.matrix) })));
}

function digitalGridUprightAfterMoves({ difficulty = 2 }) {
  const size = difficulty === 3 ? 4 : 3;
  const operationPool = Object.keys(BOARD_TRANSFORMS);
  const operations = difficulty === 1
    ? [sample(operationPool)]
    : difficulty === 2
      ? shuffle(["mirror-left-right", "mirror-top-bottom"])
      : [sample(operationPool), sample(operationPool), sample(operationPool)];
  const combined = operations.reduce((matrix, operation) => multiplyMatrix(BOARD_TRANSFORMS[operation], matrix), MATRIX_IDENTITY);
  const uprightStart = transposeMatrix(combined);
  const cardCount = size * size;
  const uprightCount = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
  const uprightIndexes = new Set(shuffle(Array.from({ length: cardCount }, (_, index) => index)).slice(0, uprightCount));
  const values = shuffle(Array.from({ length: cardCount }, (_, index) => index % 9 + 1));
  const cards = values.map((value, index) => ({
    value,
    matrix: uprightIndexes.has(index)
      ? [...uprightStart]
      : [...sample(DIGIT_ORIENTATIONS.filter((matrix) => matrix.join() !== uprightStart.join()))]
  }));
  const grid = Array.from({ length: size }, (_, row) => cards.slice(row * size, (row + 1) * size));
  const result = operations.reduce((current, operation) => applyBoardOperation(current, operation), grid);
  const upright = result.flat().filter((card) => card.matrix.join() === MATRIX_IDENTITY.join());
  const answer = upright.reduce((sum, card) => sum + card.value, 0);
  return {
    prompt: `숫자판을 ${operations.map((operation) => BOARD_TRANSFORM_LABELS[operation]).join(" 후 다시 ")} 했습니다. 움직인 뒤 똑바로 놓이는 수들의 합을 구하세요.`,
    visual: { kind: "book4", subtype: "digital-upright-grid", grid, operations, operationLabels: operations.map((operation) => BOARD_TRANSFORM_LABELS[operation]) },
    answer: String(answer),
    solution: `각 숫자의 방향을 숫자판과 함께 움직이면 똑바로 놓이는 수는 ${upright.map((card) => card.value).join(", ")}입니다. 합은 ${answer}입니다.`,
    meta: { family: "digital-upright-grid", size, grid, operations, result, uprightValues: upright.map((card) => card.value), answer }
  };
}

function halfTurnDisplay(value) {
  const digits = String(value).split("").map(Number);
  const turned = BOOK01_INTERNALS.transformDisplay(digits, "rotate-half");
  if (!turned || turned[0] === 0) return null;
  return Number(turned.join(""));
}

const HALF_TURN_NUMBERS = Object.freeze(Array.from({ length: 90 }, (_, index) => index + 10)
  .map((source) => ({ source, turned: halfTurnDisplay(source) }))
  .filter((item) => item.turned != null));

function digitalSelfHalfTurnCalculation({ difficulty = 2 }) {
  const addition = sample(HALF_TURN_NUMBERS.filter((item) => item.source !== item.turned || difficulty === 1));
  const subtraction = sample(HALF_TURN_NUMBERS.filter((item) => item.source !== item.turned));
  const rows = [
    { ...addition, operator: "+", result: addition.source + addition.turned },
    { ...subtraction, operator: "−", result: Math.abs(subtraction.source - subtraction.turned) }
  ];
  const answer = `(1) ${rows[0].result}, (2) ${rows[1].result}`;
  return {
    prompt: "각 두 자리 수와 그 숫자판을 반 바퀴 돌려 읽은 수를 계산하세요.",
    visual: { kind: "book4", subtype: "digital-self-half-turn", rows, showTurned: difficulty === 1 },
    answer,
    solution: `(1) ${rows[0].source} + ${rows[0].turned} = ${rows[0].result}, (2) ${Math.max(rows[1].source, rows[1].turned)} − ${Math.min(rows[1].source, rows[1].turned)} = ${rows[1].result}입니다.`,
    meta: { family: "digital-self-half-turn", rows, answers: rows.map((row) => row.result) }
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

const PAPER_COLORS = Object.freeze([
  { label: "가", color: "#ef8f85" }, { label: "나", color: "#f2c66f" },
  { label: "다", color: "#96cfa8" }, { label: "라", color: "#85bddd" },
  { label: "마", color: "#b8a4dc" }, { label: "바", color: "#eea9c3" },
  { label: "사", color: "#91c8c1" }, { label: "아", color: "#d7b38a" }
]);

function connectedPaperMask(size, count) {
  const cells = [[randomInt(0, size - 1), randomInt(0, size - 1)]];
  const keys = new Set(cells.map(([row, column]) => `${row}:${column}`));
  for (let attempt = 0; cells.length < count && attempt < 200; attempt += 1) {
    const [row, column] = sample(cells);
    const [dr, dc] = sample([[1,0],[-1,0],[0,1],[0,-1]]);
    const next = [row + dr, column + dc];
    const key = `${next[0]}:${next[1]}`;
    if (next[0] >= 0 && next[0] < size && next[1] >= 0 && next[1] < size && !keys.has(key)) {
      keys.add(key);
      cells.push(next);
    }
  }
  return cells;
}

function topPaperSnapshot(layers, removed, size) {
  return Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, column) => {
    const layer = layers.slice(removed).find((paper) => paper.cells.some(([cellRow, cellColumn]) => cellRow === row && cellColumn === column));
    return layer ? { label: layer.label, color: layer.color } : null;
  }));
}

function overlappingPaperBottom({ difficulty = 2 }) {
  const size = 4;
  const count = difficulty === 1 ? 5 : difficulty === 2 ? 8 : 7;
  const papers = shuffle(PAPER_COLORS).slice(0, count);
  const bottom = papers.at(-1);
  const layers = papers.map((paper, index) => ({
    ...paper,
    cells: index === papers.length - 1
      ? Array.from({ length: size * size }, (_, cellIndex) => [Math.floor(cellIndex / size), cellIndex % size])
      : connectedPaperMask(size, randomInt(4, 8))
  }));
  const snapshots = layers.map((_, removed) => topPaperSnapshot(layers, removed, size));
  return {
    prompt: `크기가 같은 색종이 ${count}장이 겹쳐 있습니다. 가장 위의 색종이부터 한 장씩 빼어 본 그림을 보고 가장 밑에 있는 색종이를 구하세요.`,
    visual: { kind: "book4", subtype: "overlapping-paper-order", size, snapshots },
    answer: bottom.label,
    solution: `한 장씩 뺀 그림을 끝까지 따라가면 마지막까지 남는 것은 ${bottom.label} 색종이입니다.`,
    meta: { family: "overlapping-paper-order", size, layers, snapshots, answer: bottom.label }
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
const subjectOf = (word) => `${word}${hasFinal(word) ? "이" : "가"}`;
const withOf = (word) => `${word}${hasFinal(word) ? "과" : "와"}`;
const objectOf = (word) => `${word}${hasFinal(word) ? "을" : "를"}`;

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

const DIFFERENCE_SCENES = Object.freeze({
  age: { unit: "살", comparison: "나이를", more: "많습니다", less: "적습니다" },
  distance: { unit: "m", comparison: "달리기 위치를", more: "앞에 있습니다", less: "뒤에 있습니다" },
  time: { unit: "초", comparison: "들어온 시각을", more: "늦게 들어왔습니다", less: "먼저 들어왔습니다" }
});

function measurementDifferenceChain({ difficulty = 2, sceneId: requestedSceneId = null }) {
  const sceneId = requestedSceneId || sample(Object.keys(DIFFERENCE_SCENES));
  const scene = DIFFERENCE_SCENES[sceneId];
  const count = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
  const names = shuffle(["가은", "도윤", "민서", "준호", "하은", "서윤"]).slice(0, count);
  const increments = Array.from({ length: count - 1 }, () => randomInt(2, difficulty === 3 ? 9 : 6));
  const offsets = [0];
  increments.forEach((increment) => offsets.push(offsets.at(-1) + increment));
  const rules = increments.map((difference, index) => {
    const reverse = Math.random() < 0.5;
    const first = reverse ? names[index] : names[index + 1];
    const second = reverse ? names[index + 1] : names[index];
    const relation = reverse ? "less" : "more";
    return { first, second, difference, relation };
  });
  const clues = rules.map((rule) => `${topic(rule.first)} ${rule.second}보다 ${rule.difference}${scene.unit} ${scene[rule.relation]}.`);
  const firstIndex = difficulty === 1 ? 0 : randomInt(0, count - 2);
  const secondIndex = difficulty === 1 ? count - 1 : randomInt(firstIndex + 1, count - 1);
  const answer = offsets[secondIndex] - offsets[firstIndex];
  return {
    prompt: `${count}명의 ${scene.comparison} 비교한 조건입니다. ${names[firstIndex]}와 ${names[secondIndex]}의 차이를 구하세요.`,
    visual: { kind: "book4", subtype: "measurement-difference", clues, target: `${names[firstIndex]}와 ${names[secondIndex]}의 차이` },
    answer: `${answer}${scene.unit}`,
    solution: `${names[firstIndex]}에서 ${names[secondIndex]}까지의 차 ${increments.slice(firstIndex, secondIndex).join(" + ")}를 더하면 ${answer}${scene.unit}입니다.`,
    meta: { family: "measurement-difference", sceneId, unit: scene.unit, names, increments, offsets, rules, firstIndex, secondIndex, answer }
  };
}

function measurementAgeDifferenceBook4({ difficulty = 2 }) {
  return measurementDifferenceChain({ difficulty, sceneId: "age" });
}

function measurementDistanceDifferenceBook4({ difficulty = 2 }) {
  return measurementDifferenceChain({ difficulty, sceneId: "distance" });
}

function measurementTimeDifferenceBook4({ difficulty = 2 }) {
  return measurementDifferenceChain({ difficulty, sceneId: "time" });
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

const LANDMARKS = Object.freeze(["학교", "도서관", "은행", "백화점", "병원", "우체국"]);
const MAP_POSITIONS = Object.freeze([[0,0],[0,1],[1,0],[1,1]]);

function mapDirection(from, to) {
  const vertical = to[0] < from[0] ? "북" : to[0] > from[0] ? "남" : "";
  const horizontal = to[1] < from[1] ? "서" : to[1] > from[1] ? "동" : "";
  return `${vertical}${horizontal}쪽`;
}

function directionalLandmarkPlacementBook4({ difficulty = 2 }) {
  const places = shuffle(LANDMARKS).slice(0, 4);
  const targetIndex = randomInt(0, 3);
  const anchorIndexes = shuffle([0,1,2,3].filter((index) => index !== targetIndex));
  const shownCount = difficulty === 1 ? 3 : difficulty === 2 ? 2 : 1;
  const shownIndexes = anchorIndexes.slice(0, shownCount);
  const targetPlace = places[targetIndex];
  const mainAnchor = shownIndexes[0];
  const targetDirection = mapDirection(MAP_POSITIONS[mainAnchor], MAP_POSITIONS[targetIndex]);
  const clues = [
    `${topic(targetPlace)} ${places[mainAnchor]}의 ${targetDirection}에 있습니다.`
  ];
  shownIndexes.slice(1).forEach((index) => {
    clues.push(`${topic(places[index])} ${places[mainAnchor]}의 ${mapDirection(MAP_POSITIONS[mainAnchor], MAP_POSITIONS[index])}에 있습니다.`);
  });
  const shown = places.map((place, index) => shownIndexes.includes(index) ? place : null);
  const visual = { kind: "book4", subtype: "directional-landmark-map", places, shown, targetIndex, clues };
  return {
    prompt: "네 장소의 위치를 나타낸 그림입니다. 조건을 보고 ㉠에 알맞은 장소를 구하세요.",
    visual: { ...visual, reveal: false },
    answerVisual: { ...visual, reveal: true },
    answer: targetPlace,
    solution: `${objectOf(places[mainAnchor])} 기준으로 ${clues[0]} 따라서 ㉠은 ${targetPlace}입니다.`,
    meta: { family: "directional-landmark-map-book4", places, shownIndexes, targetIndex, targetDirection, clues, mainAnchor, answer: targetPlace }
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

function raceThirdPlaceBook4({ difficulty = 2 }) {
  const names = shuffle(SEAT_NAMES).slice(0, 5);
  const orders = permutations(names);
  const solution = sample(orders);
  const position = (order, name) => order.indexOf(name);
  const rules = [];
  for (let first = 0; first < names.length; first += 1) {
    for (let second = first + 1; second < names.length; second += 1) {
      const a = names[first];
      const b = names[second];
      const before = position(solution, a) < position(solution, b) ? a : b;
      const after = before === a ? b : a;
      rules.push({ kind: "before", first: before, second: after, text: `${topic(before)} ${after}보다 먼저 들어왔습니다.` });
      if (Math.abs(position(solution, a) - position(solution, b)) === 1) {
        rules.push({ kind: "immediate", first: before, second: after, text: `${topic(before)} ${after}의 바로 앞에 들어왔습니다.` });
      }
    }
  }
  solution.forEach((name, index) => {
    if (index !== 2) rules.push({ kind: "position", name, position: index, text: `${name} 앞에는 ${index ? `${index}명` : "아무도"} 없습니다.` });
  });
  const matches = (order, rule) => {
    if (rule.kind === "before") return position(order, rule.first) < position(order, rule.second);
    if (rule.kind === "immediate") return position(order, rule.second) - position(order, rule.first) === 1;
    return position(order, rule.name) === rule.position;
  };
  const active = [];
  let candidates = orders;
  const pool = shuffle(rules).sort((a, b) => Number(a.kind === "position") - Number(b.kind === "position"));
  for (const rule of pool) {
    active.push(rule);
    candidates = orders.filter((order) => active.every((item) => matches(order, item)));
    if (new Set(candidates.map((order) => order[2])).size === 1) break;
  }
  if (!candidates.length || new Set(candidates.map((order) => order[2])).size !== 1) return raceThirdPlaceBook4({ difficulty });
  const answer = candidates[0][2];
  return {
    prompt: "다섯 명이 달리기 시합을 했습니다. 조건을 보고 세 번째로 들어온 사람을 구하세요.",
    visual: { kind: "book4", subtype: "race-third-place", clues: active.map((rule) => rule.text) },
    answer,
    solution: `조건을 앞에서부터 이어 놓으면 세 번째로 들어온 사람은 ${answer}입니다.`,
    meta: { family: "race-third-place-book4", names, rules: active, candidateOrders: candidates, answer }
  };
}

function circularSeatBlankBook4({ difficulty = 2 }) {
  const count = difficulty === 1 ? 5 : 6;
  const solution = shuffle(SEAT_NAMES).slice(0, count);
  const anchor = solution[0];
  const targetSeat = randomInt(1, count - 1);
  const candidates = permutations(solution.slice(1)).map((rest) => [anchor, ...rest]);
  const indexOf = (order, name) => order.indexOf(name);
  const rules = [];
  solution.forEach((name, index) => {
    const next = solution[(index + 1) % count];
    rules.push({ kind: "clockwise", first: next, second: name, text: `${topic(next)} ${name}의 시계 방향 바로 옆에 앉아 있습니다.` });
    const previous = solution[(index - 1 + count) % count];
    rules.push({ kind: "between", first: previous, second: next, middle: name, text: `${previous}와 ${next} 사이에 ${subjectOf(name)} 앉아 있습니다.` });
    if (count % 2 === 0 && index < count / 2) {
      const opposite = solution[(index + count / 2) % count];
      rules.push({ kind: "opposite", first: name, second: opposite, text: `${withOf(name)} ${opposite}는 마주 보고 있습니다.` });
    }
  });
  const matches = (order, rule) => {
    const first = indexOf(order, rule.first);
    const second = indexOf(order, rule.second);
    if (rule.kind === "clockwise") return first === (second + 1) % count;
    if (rule.kind === "opposite") return (first + count / 2) % count === second || (second + count / 2) % count === first;
    const middle = indexOf(order, rule.middle);
    return new Set([(middle - 1 + count) % count, (middle + 1) % count]).has(first)
      && new Set([(middle - 1 + count) % count, (middle + 1) % count]).has(second);
  };
  const active = [];
  let remaining = candidates;
  for (const rule of shuffle(rules)) {
    active.push(rule);
    remaining = candidates.filter((order) => active.every((item) => matches(order, item)));
    if (remaining.length && new Set(remaining.map((order) => order[targetSeat])).size === 1) break;
  }
  if (!remaining.length || new Set(remaining.map((order) => order[targetSeat])).size !== 1) return circularSeatBlankBook4({ difficulty });
  const answer = remaining[0][targetSeat];
  return {
    prompt: "친구들이 원탁에 앉아 있습니다. 조건을 보고 ㉠에 앉아 있는 사람을 구하세요.",
    visual: { kind: "book4", subtype: "circular-seat-blank", count, clues: active.map((rule) => rule.text), anchor, targetSeat },
    answer,
    solution: `${anchor} 자리를 기준으로 조건을 시계 방향으로 이어 놓으면 ㉠에는 ${subjectOf(answer)} 앉습니다.`,
    meta: { family: "circular-seat-blank-book4", count, anchor, targetSeat, rules: active, candidateOrders: remaining, answer }
  };
}

function threeFoldCutLineBook4({ difficulty = 2 }) {
  const folds = 3;
  const gridRows = 2;
  const gridColumns = 4;
  const cutInset = sample([15, 16, 17]);
  const repeatStarts = [0, 2];
  return {
    prompt: "색종이를 세 번 접은 후 표시한 두 사선을 따라 잘랐습니다. 펼쳤을 때 잘린 선의 모양을 모눈에 그리세요.",
    visual: { kind: "book4", subtype: "three-fold-cut-line", folds, gridRows, gridColumns, cutInset, repeatStarts, reveal: false },
    answer: "그림 답안",
    answerVisual: { kind: "book4", subtype: "three-fold-cut-line", folds, gridRows, gridColumns, cutInset, repeatStarts, reveal: true },
    responseKind: "drawing",
    solution: "접은 선을 따라 차례로 펼치면 접은 색종이에 있던 두 사선이 윗줄의 왼쪽과 오른쪽에 같은 모양으로 나타납니다.",
    meta: { family: "three-fold-cut-line-book4", folds, gridRows, gridColumns, cutInset, repeatStarts }
  };
}

function frontBackTwoOrderTotalsBook4({ difficulty = 2 }) {
  const between = randomInt(difficulty === 1 ? 1 : 2, difficulty === 3 ? 6 : 4);
  const firstFront = randomInt(between + 3, difficulty === 3 ? 15 : 11);
  const secondBack = randomInt(4, difficulty === 3 ? 12 : 9);
  const firstBeforeSecond = firstFront + between + 1 + secondBack - 1;
  const secondFront = firstFront - between - 1;
  const secondBeforeFirst = secondFront + secondBack - 1;
  const names = shuffle(SEAT_NAMES).slice(0, 2);
  return {
    prompt: `${topic(names[0])} 앞에서 ${firstFront}번째이고, ${topic(names[1])} 뒤에서 ${secondBack}번째입니다. 두 사람 사이에는 ${between}명이 있습니다. 두 사람이 앞선 순서가 바뀌는 두 경우의 전체 인원을 각각 구하세요.`,
    visual: { kind: "book4", subtype: "front-back-two-orders", clues: [`(1) ${subjectOf(names[0])} ${names[1]}보다 앞에 있는 경우`, `(2) ${subjectOf(names[1])} ${names[0]}보다 앞에 있는 경우`] },
    answer: `(1) ${firstBeforeSecond}명, (2) ${secondBeforeFirst}명`,
    solution: `(1) ${firstFront}+${between}+1+${secondBack}-1=${firstBeforeSecond}명, (2) ${firstFront}-${between}-1+${secondBack}-1=${secondBeforeFirst}명입니다.`,
    meta: { family: "front-back-two-orders-book4", firstFront, secondBack, between, firstBeforeSecond, secondBeforeFirst, names }
  };
}

export const BOOK04_GENERATORS = {
  tetrominoFamilyChoice,
  tetrominoSquareComposition,
  starCongruentPartitionDrawBook4,
  forestCongruentPartitionDrawBook4,
  digitalGridTransform,
  digitalTransformArithmetic,
  digitalGridUprightAfterMoves,
  digitalSelfHalfTurnCalculation,
  foldNumberGridMulti,
  foldSurfaceTopTrace,
  overlappingPaperBottom,
  pairSumCardCompletion,
  shapeDifferenceChain,
  measurementOrderChain,
  measurementAgeDifferenceBook4,
  measurementDistanceDifferenceBook4,
  measurementTimeDifferenceBook4,
  balanceUnitRatio,
  directionalSeatPlacement,
  directionalLandmarkPlacementBook4,
  circularSeatPlacement,
  ordinalLinePlacement,
  raceThirdPlaceBook4,
  circularSeatBlankBook4,
  threeFoldCutLineBook4,
  frontBackTwoOrderTotalsBook4
};
