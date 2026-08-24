// 필즈 더 클래식 초1 4차 원본 구조 전용 문제 생성기.

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = randomInt(0, index);
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

const sum = (values) => values.reduce((total, value) => total + value, 0);
const range = (start, end) => Array.from({ length: end - start + 1 }, (_, index) => start + index);

function g1WinterSharedBoxMultiplication({ difficulty = 2 } = {}) {
  const shared = randomInt(2, difficulty === 1 ? 4 : difficulty === 2 ? 6 : 8);
  const left = randomInt(difficulty === 1 ? 2 : 3, difficulty === 3 ? 9 : 7);
  const right = randomInt(2, difficulty === 1 ? 5 : difficulty === 2 ? 7 : 9);
  const topProduct = left * shared;
  const bottomProduct = shared * right;

  return {
    prompt: "그림의 위쪽과 아래쪽 계산을 보고, 왼쪽 빈칸에 들어갈 수를 구하세요.",
    visual: { kind: "g1-winter-shared-box-multiplication", shared, right, topProduct, bottomProduct, left: null },
    answer: String(left),
    solution: `아래쪽에서 가운데 수는 ${bottomProduct}÷${right}=${shared}입니다. 위쪽은 ${topProduct}÷${shared}=${left}이므로 왼쪽 수는 ${left}입니다.`,
    meta: { difficulty, left, shared, right, topProduct, bottomProduct, answer: left }
  };
}

const SHAPE_GRID_PATTERN = [
  ["A", "A", "B", "C"],
  ["A", "B", "C", "D"],
  ["A", "C", "D", "D"],
  ["B", "B", "C", "D"]
];

function countShapeSolutions(grid, rowSums, columnSums, symbols) {
  const solutions = [];
  const letters = ["A", "B", "C", "D"];
  for (const values of valueChoices(symbols.length)) {
    const mapping = Object.fromEntries(letters.map((letter, index) => [letter, values[index]]));
    const rowsMatch = grid.every((row, index) => rowSums[index] === null || sum(row.map((letter) => mapping[letter])) === rowSums[index]);
    const columnsMatch = grid[0].every((_, column) => columnSums[column] === null
      || sum(grid.map((row) => mapping[row[column]])) === columnSums[column]);
    if (rowsMatch && columnsMatch) solutions.push(mapping);
  }
  return solutions;
}

function valueChoices(length) {
  const choices = [];
  const visit = (picked) => {
    if (picked.length === length) {
      choices.push(picked);
      return;
    }
    for (let value = 1; value <= 9; value += 1) {
      if (!picked.includes(value)) visit([...picked, value]);
    }
  };
  visit([]);
  return choices;
}

function g1WinterShapeSumGridTargetRow({ difficulty = 2 } = {}) {
  const symbolSets = [["○", "□", "△", "◇"], ["★", "○", "□", "△"], ["◇", "☆", "○", "□"]];
  const symbols = shuffle(symbolSets[randomInt(0, symbolSets.length - 1)]);
  const pickedValues = shuffle(range(1, difficulty === 1 ? 6 : difficulty === 2 ? 8 : 9)).slice(0, 4);
  const valuesByLetter = Object.fromEntries(["A", "B", "C", "D"].map((letter, index) => [letter, pickedValues[index]]));
  const values = Object.fromEntries(symbols.map((symbol, index) => [symbol, pickedValues[index]]));
  const grid = SHAPE_GRID_PATTERN.map((row) => row.map((letter) => symbols[["A", "B", "C", "D"].indexOf(letter)]));
  const numericGrid = SHAPE_GRID_PATTERN.map((row) => row.map((letter) => valuesByLetter[letter]));
  const rowSums = numericGrid.map(sum);
  const columnSums = numericGrid[0].map((_, column) => sum(numericGrid.map((row) => row[column])));
  const shownRowSums = [null, ...rowSums.slice(1)];
  const uniqueSolutions = countShapeSolutions(SHAPE_GRID_PATTERN, shownRowSums, columnSums, symbols);

  // The fixed pattern has four independent visible totals; retain a retry-free fallback.
  if (uniqueSolutions.length !== 1) throw new Error("Shape-sum grid must have one answer.");

  return {
    prompt: "같은 모양은 같은 수를 나타냅니다. 첫째 줄의 오른쪽 빈칸에 들어갈 수를 구하세요.",
    visual: { kind: "g1-winter-shape-sum-target-row", symbols, grid, rowSums: shownRowSums, columnSums, targetRow: 0 },
    answer: String(rowSums[0]),
    solution: `아래와 오른쪽의 보이는 합을 이용해 각 모양의 수를 찾습니다. 첫째 줄은 ${grid[0].join(" + ")}이므로 ${rowSums[0]}입니다.`,
    meta: { difficulty, values, symbols, grid, rowSums, columnSums, targetRow: 0, uniqueSolutions, answer: rowSums[0] }
  };
}

function g1WinterOpponentStepGame({ difficulty = 2 } = {}) {
  const limit = difficulty === 1 ? 10 : difficulty === 2 ? 14 : 18;
  let start;
  let wins;
  let losses;
  let draws;
  let aEnd;
  let bEnd;
  do {
    start = randomInt(difficulty === 1 ? 3 : 4, limit - 3);
    wins = randomInt(1, difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4);
    losses = randomInt(1, difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4);
    draws = randomInt(0, difficulty === 1 ? 1 : difficulty === 2 ? 2 : 3);
    aEnd = start + wins - losses;
    bEnd = start - wins + losses;
  } while (aEnd < 1 || aEnd > limit || bEnd < 1 || bEnd > limit);

  return {
    prompt: "두 사람은 같은 칸에서 시작합니다. A가 이기면 A는 한 칸 올라가고 B는 한 칸 내려갑니다. 비기면 둘 다 그대로이고, A가 지면 A는 한 칸 내려가고 B는 한 칸 올라갑니다. B는 몇 번째 칸에 있나요?",
    visual: { kind: "g1-winter-opponent-step-game", limit, start, wins, losses, draws, aEnd, bEnd },
    answer: `${bEnd}번째 칸`,
    solution: `A가 이긴 ${wins}번에는 B가 ${wins}칸 내려가고, A가 진 ${losses}번에는 B가 ${losses}칸 올라갑니다. ${start}-${wins}+${losses}=${bEnd}입니다.`,
    meta: { difficulty, limit, start, wins, losses, draws, aEnd, bEnd, answer: bEnd }
  };
}

function sudokuSolutions(puzzle, maximum = 2) {
  const board = puzzle.map((row) => [...row]);
  const solutions = [];
  const canPlace = (row, column, value) => {
    if (board[row].includes(value)) return false;
    if (board.some((line) => line[column] === value)) return false;
    const top = Math.floor(row / 2) * 2;
    const left = Math.floor(column / 2) * 2;
    for (let r = top; r < top + 2; r += 1) for (let c = left; c < left + 2; c += 1) if (board[r][c] === value) return false;
    return true;
  };
  const fill = () => {
    if (solutions.length >= maximum) return;
    let target = null;
    let choices = null;
    for (let row = 0; row < 4; row += 1) for (let column = 0; column < 4; column += 1) {
      if (board[row][column] !== null) continue;
      const possible = range(1, 4).filter((value) => canPlace(row, column, value));
      if (!target || possible.length < choices.length) {
        target = [row, column];
        choices = possible;
      }
    }
    if (!target) {
      solutions.push(board.map((row) => [...row]));
      return;
    }
    for (const value of choices) {
      board[target[0]][target[1]] = value;
      fill();
      board[target[0]][target[1]] = null;
    }
  };
  fill();
  return solutions;
}

function makeSudokuSolution() {
  const digits = shuffle(range(1, 4));
  const rowOrder = shuffle([0, 1]).concat(shuffle([2, 3]));
  const columnOrder = shuffle([0, 1]).concat(shuffle([2, 3]));
  const rowOffsets = [0, 2, 1, 3];
  return rowOrder.map((row) => columnOrder.map((column) => digits[(rowOffsets[row] + column) % 4]));
}

function g1WinterSudokuFourFullGrid({ difficulty = 2 } = {}) {
  const clueCount = difficulty === 1 ? 10 : difficulty === 2 ? 8 : 6;
  let solution;
  let puzzle;
  let solutions;
  for (let attempt = 0; attempt < 400; attempt += 1) {
    solution = makeSudokuSolution();
    const clues = new Set(shuffle(range(0, 15)).slice(0, clueCount));
    puzzle = solution.map((row, rowIndex) => row.map((value, columnIndex) => clues.has(rowIndex * 4 + columnIndex) ? value : null));
    solutions = sudokuSolutions(puzzle);
    if (solutions.length === 1) break;
  }
  if (solutions.length !== 1) {
    solution = makeSudokuSolution();
    puzzle = solution.map((row) => [row[0], row[1], row[2], null]);
    solutions = sudokuSolutions(puzzle);
  }
  const answer = solution.map((row) => row.join(" ")).join(" / ");

  return {
    prompt: "가로줄, 세로줄, 굵은 네 칸 안에는 1부터 4까지가 한 번씩 들어갑니다. 빈칸을 모두 채우세요.",
    visual: { kind: "g1-winter-sudoku-four-full", puzzle, size: 4, blockSize: 2 },
    answer,
    solution: "각 가로줄과 세로줄, 굵은 네 칸을 살펴보며 아직 없는 수를 넣습니다. 이렇게 빈칸을 하나씩 채우면 답과 같습니다.",
    meta: { difficulty, puzzle, solution, solutionCount: 1, answer }
  };
}

function g1WinterTwoDigitOddSumOrder({ difficulty = 2 } = {}) {
  const rule = difficulty === 1
    ? { digitSum: 3 }
    : difficulty === 2
      ? { digitSum: 5, minimumTens: 4 }
      : { digitSum: 9, gap: 3 };
  const candidates = [];
  for (let tens = 1; tens <= 9; tens += 1) for (const ones of [1, 3, 5, 7, 9]) {
    if (tens <= ones || tens + ones !== rule.digitSum) continue;
    if (rule.minimumTens && tens < rule.minimumTens) continue;
    if (rule.gap && tens - ones !== rule.gap) continue;
    candidates.push({ tens, ones, number: tens * 10 + ones });
  }
  const answer = candidates[0];
  const conditions = ["두 자리 홀수입니다.", `두 자리 숫자의 합은 ${rule.digitSum}입니다.`, "십의 자리 숫자가 일의 자리 숫자보다 큽니다."];
  if (rule.minimumTens) conditions.push(`십의 자리 숫자는 ${rule.minimumTens}보다 크거나 같습니다.`);
  if (rule.gap) conditions.push(`십의 자리 숫자는 일의 자리 숫자보다 ${rule.gap} 큽니다.`);

  return {
    prompt: "다음 조건에 맞는 수를 구하세요.",
    visual: { kind: "g1-condition-list", title: "수의 조건", conditions },
    answer: String(answer.number),
    solution: `조건에 맞는 두 자리 수는 ${answer.number}입니다. 십의 자리 ${answer.tens}이 일의 자리 ${answer.ones}보다 커서 모두 알맞습니다.`,
    meta: { difficulty, ...rule, conditions, candidates, candidateCount: candidates.length, answer: answer.number }
  };
}

const PRODUCT_SHADED_INDICES = [0, 1, 6, 7, 9, 11, 12, 14];

function productPlacementSolutions(rowProducts, columnProducts, maximum = 2) {
  const cells = PRODUCT_SHADED_INDICES;
  const positionsByRow = range(0, 3).map((row) => cells.filter((index) => Math.floor(index / 4) === row));
  const positionsByColumn = range(0, 3).map((column) => cells.filter((index) => index % 4 === column));
  const solutions = [];
  const assignment = new Map();
  const tryPlace = (index, available) => {
    if (solutions.length >= maximum) return;
    if (index === cells.length) {
      solutions.push(cells.map((cell) => assignment.get(cell)));
      return;
    }
    const cell = cells[index];
    for (const value of available) {
      assignment.set(cell, value);
      const valid = [...positionsByRow, ...positionsByColumn].every((pair, pairIndex) => {
        const first = assignment.get(pair[0]);
        const second = assignment.get(pair[1]);
        const target = pairIndex < 4 ? rowProducts[pairIndex] : columnProducts[pairIndex - 4];
        if (first === undefined && second === undefined) return true;
        if (first === undefined || second === undefined) return target % (first ?? second) === 0;
        return first * second === target;
      });
      if (valid) tryPlace(index + 1, available.filter((other) => other !== value));
      assignment.delete(cell);
    }
  };
  tryPlace(0, range(2, 9));
  return solutions;
}

function g1WinterProductPlacementFourGrid({ difficulty = 2 } = {}) {
  let placement;
  let rowProducts;
  let columnProducts;
  let solutions;
  do {
    placement = shuffle(range(2, 9));
    const byIndex = new Map(PRODUCT_SHADED_INDICES.map((index, order) => [index, placement[order]]));
    rowProducts = range(0, 3).map((row) => PRODUCT_SHADED_INDICES.filter((index) => Math.floor(index / 4) === row).map((index) => byIndex.get(index)).reduce((a, b) => a * b));
    columnProducts = range(0, 3).map((column) => PRODUCT_SHADED_INDICES.filter((index) => index % 4 === column).map((index) => byIndex.get(index)).reduce((a, b) => a * b));
    solutions = productPlacementSolutions(rowProducts, columnProducts);
  } while (solutions.length !== 1);
  const grid = range(0, 15).map((index) => PRODUCT_SHADED_INDICES.includes(index) ? null : "");
  const answerRows = range(0, 3).map((row) => PRODUCT_SHADED_INDICES.filter((index) => Math.floor(index / 4) === row).map((index) => placement[PRODUCT_SHADED_INDICES.indexOf(index)]).join(" "));
  const answer = answerRows.join(" / ");

  return {
    prompt: "색칠한 8칸에 2부터 9까지의 수를 한 번씩 넣으세요. 각 가로줄과 세로줄의 색칠한 두 수를 곱하면 바깥 수가 됩니다.",
    visual: { kind: "g1-winter-product-placement-four", grid, shadedIndices: PRODUCT_SHADED_INDICES, numbers: range(2, 9), rowProducts, columnProducts },
    answer,
    solution: `가로줄과 세로줄의 곱이 맞도록 색칠한 칸을 채웁니다. 위에서 아래로 읽으면 ${answer}입니다.`,
    meta: { difficulty, numbers: range(2, 9), shadedIndices: PRODUCT_SHADED_INDICES, placement, grid, rowProducts, columnProducts, solutionCount: 1, answer }
  };
}

function g1WinterThreeDigitCardsAbove({ difficulty = 2 } = {}) {
  const digitPool = difficulty === 1 ? range(1, 6) : difficulty === 2 ? range(0, 8) : range(0, 9);
  const digits = shuffle(digitPool).slice(0, 3);
  const numbers = [];
  for (const first of digits) for (const second of digits) for (const third of digits) {
    if (first === second || first === third || second === third || first === 0) continue;
    numbers.push(first * 100 + second * 10 + third);
  }
  const ordered = [...numbers].sort((a, b) => a - b);
  const requestedAbove = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
  const desiredAbove = Math.min(requestedAbove, ordered.length - 1);
  const threshold = ordered[ordered.length - desiredAbove - 1];
  const above = ordered.filter((number) => number > threshold);

  return {
    prompt: `숫자 카드 ${digits.join(", ")}을 모두 한 번씩 써서 세 자리 수를 만듭니다. ${threshold}보다 큰 수는 모두 몇 개인가요?`,
    visual: { kind: "g1-winter-three-digit-cards-above", digits, threshold },
    answer: `${above.length}개`,
    solution: `${threshold}보다 큰 수는 ${above.join(", ")}입니다. 모두 ${above.length}개입니다.`,
    meta: { difficulty, digits, threshold, numbers: ordered, above, desiredAbove, answer: above.length }
  };
}

function g1WinterThreeBalanceSubstitution({ difficulty = 2 } = {}) {
  const templates = {
    1: { starCount: 1, diamondCount: 2, squareStars: 1, squareDiamonds: 1, circleSquares: 1, circleDiamonds: 1 },
    2: { starCount: 2, diamondCount: 3, squareStars: 1, squareDiamonds: 1, circleSquares: 2, circleDiamonds: 1 },
    3: { starCount: 3, diamondCount: 6, squareStars: 2, squareDiamonds: 1, circleSquares: 2, circleDiamonds: 2 }
  };
  const relations = templates[difficulty] || templates[2];
  const starInDiamonds = relations.diamondCount / relations.starCount;
  const squareInDiamonds = relations.squareStars * starInDiamonds + relations.squareDiamonds;
  const answer = relations.circleSquares * squareInDiamonds + relations.circleDiamonds;

  return {
    prompt: "그림의 양쪽은 무게가 같습니다. 동그라미 1개는 마름모 몇 개만큼인지 구하세요.",
    visual: { kind: "g1-winter-three-balance-substitution", relations, target: "circle-in-diamonds" },
    answer: String(answer),
    solution: `첫째 저울에서 별 1개의 무게를 마름모로 바꿉니다. 그 값을 둘째 저울의 네모에 바꾸어 넣고, 마지막 저울의 동그라미까지 차례로 바꾸면 마름모 ${answer}개와 같습니다.`,
    meta: { difficulty, relations, starInDiamonds, squareInDiamonds, answer }
  };
}

function g1WinterThreeCardsParityChain({ difficulty = 2 } = {}) {
  const starts = difficulty === 1 ? [0] : difficulty === 2 ? [0, 2] : [2, 4, 6];
  const start = starts[randomInt(0, starts.length - 1)];
  const cards = range(start, start + 5);
  const candidates = [];
  for (const giyeok of cards) for (const nieun of cards) for (const digeut of cards) {
    if (new Set([giyeok, nieun, digeut]).size !== 3) continue;
    if (giyeok === nieun + 1 && nieun === digeut + 2 && giyeok % 2 === 0) candidates.push({ giyeok, nieun, digeut });
  }
  const answer = candidates[0];
  const total = answer.giyeok + answer.nieun + answer.digeut;

  return {
    prompt: `카드 ${cards.join(", ")} 중 서로 다른 세 장을 골라 ㄱ, ㄴ, ㄷ에 한 장씩 놓습니다. ㄱ은 ㄴ보다 1 크고, ㄴ은 ㄷ보다 2 큽니다. ㄱ은 짝수일 때, 세 수의 합을 구하세요.`,
    visual: { kind: "g1-winter-three-cards-parity-chain", cards, conditions: ["ㄱ = ㄴ + 1", "ㄴ = ㄷ + 2", "ㄱ은 짝수"] },
    answer: String(total),
    solution: `ㄱ은 짝수인 ${answer.giyeok}입니다. 그러면 ㄴ은 ${answer.nieun}, ㄷ은 ${answer.digeut}입니다. ${answer.giyeok}+${answer.nieun}+${answer.digeut}=${total}입니다.`,
    meta: { difficulty, cards, candidates, candidateCount: candidates.length, values: answer, answer: total }
  };
}

export const G1_WINTER_GENERATORS = {
  g1WinterSharedBoxMultiplication,
  g1WinterShapeSumGridTargetRow,
  g1WinterOpponentStepGame,
  g1WinterSudokuFourFullGrid,
  g1WinterTwoDigitOddSumOrder,
  g1WinterProductPlacementFourGrid,
  g1WinterThreeDigitCardsAbove,
  g1WinterThreeBalanceSubstitution,
  g1WinterThreeCardsParityChain
};
