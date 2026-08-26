const range = (count, start = 0) => Array.from({ length: count }, (_, index) => index + start);

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

function permutations(values) {
  if (values.length <= 1) return [values];
  return values.flatMap((value, index) => permutations([
    ...values.slice(0, index),
    ...values.slice(index + 1)
  ]).map((rest) => [value, ...rest]));
}

function hasFinalConsonant(value) {
  const text = String(value);
  const last = [...text].at(-1) || "";
  if (/\d/.test(last)) return [0, 1, 3, 6, 7, 8].includes(Number(last));
  const code = last.charCodeAt(0) || 0;
  return code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
}

const withParticle = (value, withFinal, withoutFinal) => `${value}${hasFinalConsonant(value) ? withFinal : withoutFinal}`;
const topicOf = (value) => withParticle(value, "은", "는");
const subjectOf = (value) => withParticle(value, "이", "가");
const withOf = (value) => withParticle(value, "과", "와");
const objectOf = (value) => withParticle(value, "을", "를");

const SOURCE_WINDMILL_GROUPS = Object.freeze([
  Object.freeze([0, 4, 8, 9]),
  Object.freeze([1, 2, 3, 5]),
  Object.freeze([6, 7, 11, 15]),
  Object.freeze([10, 12, 13, 14])
]);

function cellTransform(index, transform) {
  let row = Math.floor(index / 4);
  let column = index % 4;
  if (transform >= 4) column = 3 - column;
  for (let turn = 0; turn < transform % 4; turn += 1) {
    [row, column] = [column, 3 - row];
  }
  return row * 4 + column;
}

const WINDMILL_VARIANTS = range(8).map((transform) => SOURCE_WINDMILL_GROUPS
  .map((group) => group.map((index) => cellTransform(index, transform)).sort((a, b) => a - b))
  .sort((a, b) => a[0] - b[0]));

function canonicalShape(cells) {
  const variants = [];
  for (let flip = 0; flip < 2; flip += 1) {
    for (let turn = 0; turn < 4; turn += 1) {
      const transformed = cells.map(([sourceRow, sourceColumn]) => {
        let row = sourceRow;
        let column = flip ? -sourceColumn : sourceColumn;
        for (let step = 0; step < turn; step += 1) [row, column] = [column, -row];
        return [row, column];
      });
      const minRow = Math.min(...transformed.map(([row]) => row));
      const minColumn = Math.min(...transformed.map(([, column]) => column));
      variants.push(transformed
        .map(([row, column]) => [row - minRow, column - minColumn])
        .sort((a, b) => a[0] - b[0] || a[1] - b[1])
        .map((cell) => cell.join(","))
        .join(";"));
    }
  }
  return variants.sort()[0];
}

function connectedFourCells(mask) {
  const cells = range(16).filter((index) => mask & (1 << index));
  if (cells.length !== 4) return null;
  const seen = new Set([cells[0]]);
  const queue = [cells[0]];
  while (queue.length) {
    const current = queue.shift();
    const row = Math.floor(current / 4);
    const column = current % 4;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nextRow = row + dr;
      const nextColumn = column + dc;
      const next = nextRow * 4 + nextColumn;
      if (nextRow < 0 || nextRow >= 4 || nextColumn < 0 || nextColumn >= 4 || seen.has(next) || !(mask & (1 << next))) continue;
      seen.add(next);
      queue.push(next);
    }
  }
  if (seen.size !== 4) return null;
  return { mask, cells, shape: canonicalShape(cells.map((index) => [Math.floor(index / 4), index % 4])) };
}

function buildCongruentPartitions() {
  const pieces = [];
  for (let mask = 0; mask < (1 << 16); mask += 1) {
    const piece = connectedFourCells(mask);
    if (piece) pieces.push(piece);
  }
  const found = new Map();
  const cover = (remaining, groups, shape) => {
    if (!remaining) {
      const sorted = [...groups].sort((a, b) => a.mask - b.mask);
      found.set(sorted.map((group) => group.mask).join(","), sorted.map((group) => group.cells));
      return;
    }
    const first = range(16).find((index) => remaining & (1 << index));
    for (const piece of pieces) {
      if (!(piece.mask & (1 << first)) || (piece.mask & remaining) !== piece.mask || (shape && piece.shape !== shape)) continue;
      cover(remaining ^ piece.mask, [...groups, piece], shape || piece.shape);
    }
  };
  cover((1 << 16) - 1, [], null);
  return [...found.values()];
}

const CONGRUENT_PARTITIONS = buildCongruentPartitions();

function partitionKey(groups) {
  return groups.map((group) => [...group].sort((a, b) => a - b).join("-")).sort().join("|");
}

function equalSumPartitions(values) {
  return CONGRUENT_PARTITIONS.filter((groups) => {
    const sums = groups.map((group) => group.reduce((total, index) => total + values[index], 0));
    return new Set(sums).size === 1;
  });
}

function practiceCongruentEqualSumPartition({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 800; attempt += 1) {
    const groups = sample(WINDMILL_VARIANTS);
    const target = difficulty === 1 ? randomInt(14, 20) : difficulty === 2 ? randomInt(17, 26) : randomInt(22, 32);
    const values = Array(16).fill(0);
    let valid = true;
    for (const group of groups) {
      const parts = [];
      for (let index = 0; index < 3; index += 1) {
        const upper = Math.min(9, target - parts.reduce((sum, value) => sum + value, 0) - (3 - index));
        if (upper < 1) {
          valid = false;
          break;
        }
        parts.push(randomInt(1, upper));
      }
      if (!valid) break;
      const last = target - parts.reduce((sum, value) => sum + value, 0);
      if (last < 1 || last > 9) {
        valid = false;
        break;
      }
      shuffle([...group]).forEach((cell, index) => { values[cell] = [...parts, last][index]; });
    }
    if (!valid) continue;
    const solutions = equalSumPartitions(values);
    if (solutions.length !== 1 || partitionKey(solutions[0]) !== partitionKey(groups)) continue;
    return {
      prompt: "점선을 따라 모양과 크기가 같은 네 조각으로 나누려고 합니다. 네 조각에 들어 있는 수의 합도 모두 같도록 나누어 보세요.",
      visual: { kind: "mock6-congruent-equal-sum", values },
      answerVisual: { kind: "mock6-congruent-equal-sum", values, groups },
      answer: `각 조각의 합이 ${target}인 바람개비 모양 분할`,
      solution: `네 조각은 모두 같은 ㄴ자 모양이며, 각 조각 안의 네 수를 더하면 모두 ${target}입니다.`,
      meta: { difficulty, values, groups, target, solutionCount: solutions.length, partitionCount: CONGRUENT_PARTITIONS.length }
    };
  }
  return null;
}

const LO_SHU_BASE = [8, 1, 6, 3, 5, 7, 4, 9, 2];

function transformThreeGrid(values, transform) {
  const output = Array(9);
  for (let index = 0; index < 9; index += 1) {
    let row = Math.floor(index / 3);
    let column = index % 3;
    if (transform >= 4) column = 2 - column;
    for (let turn = 0; turn < transform % 4; turn += 1) [row, column] = [column, 2 - row];
    output[row * 3 + column] = values[index];
  }
  return output;
}

const LO_SHU_GRIDS = [...new Map(range(8).map((transform) => {
  const grid = transformThreeGrid(LO_SHU_BASE, transform);
  return [grid.join(","), grid];
})).values()];

function magicSquareClues(solution, targetIndex, difficulty) {
  const desired = difficulty === 1 ? 5 : difficulty === 2 ? 3 : 2;
  const clues = [];
  const order = shuffle(range(9).filter((index) => index !== targetIndex));
  let candidates = LO_SHU_GRIDS;
  for (const index of order) {
    clues.push(index);
    candidates = LO_SHU_GRIDS.filter((grid) => clues.every((cell) => grid[cell] === solution[cell]));
    if (clues.length >= desired && candidates.length === 1) break;
  }
  return candidates.length === 1 ? clues : null;
}

function practiceTwoMagicColoredSums({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const solutions = shuffle(LO_SHU_GRIDS).slice(0, 2);
    const squares = [];
    for (const solution of solutions) {
      const target = sample(range(9).filter((index) => index !== 4));
      const clues = magicSquareClues(solution, target, difficulty);
      if (!clues) break;
      squares.push({ shown: solution.map((value, index) => clues.includes(index) ? value : null), target, solution, clues });
    }
    if (squares.length !== 2) continue;
    const values = squares.map((square) => square.solution[square.target]);
    const answer = values[0] + values[1];
    return {
      prompt: "1부터 9까지의 수를 한 번씩 사용하여 가로, 세로, 대각선의 합이 모두 같게 만들 때, 두 색칠한 칸에 들어갈 수의 합을 구하세요.",
      visual: { kind: "mock6-two-magic-sums", squares },
      answer: String(answer),
      solution: `왼쪽 색칠 칸은 ${values[0]}, 오른쪽 색칠 칸은 ${values[1]}이므로 ${values[0]} + ${values[1]} = ${answer}입니다.`,
      meta: { difficulty, squares, values, answer, candidateCounts: [1, 1] }
    };
  }
  return null;
}

const SHAPE_TOKENS = ["circle", "triangle", "star", "square"];
const SHAPE_LABELS = Object.freeze({
  circle: "동그라미",
  triangle: "세모",
  star: "별",
  square: "네모",
  diamond: "마름모"
});
const shapeLabel = (symbol) => SHAPE_LABELS[symbol] || symbol;

function practiceDistinctZeroOneShapeValues({ difficulty = 2 }) {
  const base = difficulty === 3 ? 3 : 2;
  const [same, zero, one, root] = shuffle(SHAPE_TOKENS);
  const values = { [same]: base * base, [zero]: 0, [one]: 1, [root]: base };
  const domainMax = base * base;
  const equations = [
    [same, "+", zero, "=", same],
    [one, "×", root, "=", root],
    [root, "×", root, "=", same]
  ];
  const ordered = SHAPE_TOKENS.map((symbol) => `${shapeLabel(symbol)}=${values[symbol]}`).join(", ");
  return {
    prompt: `네 모양은 0부터 ${domainMax}까지의 수 중 서로 다른 수를 나타냅니다. 식을 보고 각 모양이 나타내는 수를 구하세요.`,
    visual: { kind: "mock6-zero-one-shapes", equations, symbols: SHAPE_TOKENS, domainMax, hint: difficulty === 1 ? "같은 수에 0을 더해도 수는 그대로이고, 1을 곱해도 그대로입니다." : "" },
    answer: ordered,
    solution: `${topicOf(shapeLabel(zero))} 더해도 값이 그대로이므로 0, ${topicOf(shapeLabel(one))} 곱해도 값이 그대로이므로 1입니다. ${shapeLabel(root)} × ${shapeLabel(root)} = ${shapeLabel(same)}이고 가능한 서로 다른 수를 넣으면 ${shapeLabel(root)}=${base}, ${shapeLabel(same)}=${base * base}입니다.`,
    meta: { difficulty, base, values, roles: { same, zero, one, root }, equations, domainMax }
  };
}

const MATRIX_LAYOUT = [
  ["square", "circle", "circle", "diamond"],
  ["square", "star", "star", "diamond"],
  ["square", "diamond", "star", "triangle"],
  ["square", "triangle", "triangle", "triangle"]
];

function practiceShapeValueMatrix({ difficulty = 2 }) {
  const max = difficulty === 1 ? 7 : difficulty === 2 ? 9 : 12;
  const picked = shuffle(range(max, 1)).slice(0, 5);
  const values = Object.fromEntries(["triangle", "circle", "diamond", "square", "star"].map((symbol, index) => [symbol, picked[index]]));
  const rowSums = MATRIX_LAYOUT.map((row) => row.reduce((total, symbol) => total + values[symbol], 0));
  const columnSums = range(4).map((column) => MATRIX_LAYOUT.reduce((total, row) => total + values[row[column]], 0));
  return {
    prompt: "같은 모양은 같은 수를 나타내고, 오른쪽과 아래쪽의 수는 각 줄의 합입니다. 다섯 모양이 나타내는 수를 모두 구하세요.",
    visual: { kind: "mock6-shape-value-matrix", layout: MATRIX_LAYOUT, rowSums, columnSums, symbols: ["triangle", "circle", "diamond", "square", "star"] },
    answer: ["triangle", "circle", "diamond", "square", "star"].map((symbol) => `${shapeLabel(symbol)}=${values[symbol]}`).join(", "),
    solution: `첫째 세로줄은 네모 네 개이므로 네모는 ${values.square}입니다. 아래줄과 오른쪽 줄을 차례로 이용하면 세모 ${values.triangle}, 마름모 ${values.diamond}, 동그라미 ${values.circle}, ${objectOf(`별 ${values.star}`)} 구할 수 있습니다.`,
    meta: { difficulty, values, layout: MATRIX_LAYOUT, rowSums, columnSums }
  };
}

function practiceRepeatedTwoDigitShapeAddition({ difficulty = 2 }) {
  const hard = difficulty === 3;
  const relationCount = hard ? 3 : 2;
  const addendCount = hard ? 2 : 3;
  const digits = hard ? [2, 6, 5] : [2, 4, 7];
  const [tens, ones, hundreds] = shuffle(["circle", "diamond", "square"]);
  const values = { [tens]: digits[0], [ones]: digits[1], [hundreds]: digits[2] };
  return {
    prompt: `서로 다른 세 모양이 서로 다른 숫자를 나타냅니다. ${shapeLabel(tens)} ${relationCount}개를 더하면 ${shapeLabel(ones)}일 때, 세 모양의 값을 구하세요.`,
    visual: { kind: "mock6-repeated-two-digit-addition", relationCount, addendCount, tens, ones, hundreds },
    answer: [tens, ones, hundreds].map((symbol) => `${shapeLabel(symbol)}=${values[symbol]}`).join(", "),
    solution: `${shapeLabel(tens)} ${relationCount}개의 합이 ${shapeLabel(ones)}입니다. 두 자리 수 ${objectOf(digits[0] * 10 + digits[1])} ${addendCount}번 더하면 ${digits[2]}${digits[0]}이므로 ${shapeLabel(tens)}=${digits[0]}, ${shapeLabel(ones)}=${digits[1]}, ${shapeLabel(hundreds)}=${digits[2]}입니다.`,
    meta: { difficulty, relationCount, addendCount, tens, ones, hundreds, values, addend: digits[0] * 10 + digits[1], total: digits[2] * 10 + digits[0] }
  };
}

const NAME_POOL = ["소희", "예린", "유리", "준희", "여울", "민서", "지우", "다현", "서윤", "하린"];

function practiceFivePersonPhotoLine({ difficulty = 2 }) {
  const order = shuffle(NAME_POOL).slice(0, 5);
  const [first, second, middle, fourth, rightmost] = order;
  const clues = [
    `사진을 보는 방향으로 ${topicOf(second)} ${first}의 바로 오른쪽에 있습니다.`,
    `${rightmost}의 오른쪽에는 아무도 없습니다.`,
    `${withOf(first)} ${fourth} 사이에는 두 사람이 있습니다.`
  ];
  if (difficulty === 1) clues.push(`${topicOf(middle)} 가운데에 있습니다.`);
  return {
    prompt: "다섯 친구가 한 줄로 찍은 사진을 보고 있습니다. 설명에 맞게 왼쪽부터 다섯 친구의 이름을 쓰세요.",
    visual: { kind: "mock6-photo-line", names: shuffle(order), clues },
    answer: order.join(" - "),
    solution: `${objectOf(rightmost)} 맨 오른쪽에 놓고, ${withOf(first)} ${fourth} 사이를 두 칸 띄운 뒤 ${objectOf(second)} ${first}의 바로 오른쪽에 놓으면 ${order.join(" - ")} 순서입니다.`,
    meta: { difficulty, order, clues, solutionCount: 1 }
  };
}

const FOOD_SETS = [
  ["김밥", "떡볶이", "순대", "만두"],
  ["주먹밥", "매운 어묵", "라면", "샌드위치"],
  ["유부초밥", "매운 떡", "국수", "호떡"]
];

function practiceFoodPreferenceLogic({ difficulty = 2 }) {
  const people = shuffle(NAME_POOL).slice(0, 4);
  const [hotPerson, dislikedFoodPerson, referencePerson, friendPerson] = people;
  const [friendFood, hotFood, dislikedFood, remainingFood] = sample(FOOD_SETS);
  const foods = [friendFood, hotFood, dislikedFood, remainingFood];
  const assignments = {
    [hotPerson]: hotFood,
    [dislikedFoodPerson]: dislikedFood,
    [referencePerson]: remainingFood,
    [friendPerson]: friendFood
  };
  const clues = [
    `${objectOf(friendFood)} 좋아하는 아이는 ${referencePerson}의 가장 친한 친구입니다.`,
    `${topicOf(hotPerson)} 가장 매운 음식인 ${objectOf(hotFood)} 좋아합니다.`,
    `${withOf(referencePerson)} ${topicOf(friendPerson)} ${objectOf(dislikedFood)} 좋아하지 않습니다.`
  ];
  if (difficulty === 1) clues.push(`${topicOf(dislikedFoodPerson)} ${objectOf(dislikedFood)} 좋아합니다.`);
  return {
    prompt: "네 친구는 네 음식 중 서로 다른 음식을 하나씩 좋아합니다. 조건을 보고 각 친구가 좋아하는 음식을 구하세요.",
    visual: { kind: "mock6-food-logic", people, foods, clues },
    answer: people.map((person) => `${person}-${assignments[person]}`).join(", "),
    solution: `${topicOf(hotPerson)} ${hotFood}, ${withOf(referencePerson)} ${subjectOf(friendPerson)} 싫어하는 ${topicOf(dislikedFood)} ${dislikedFoodPerson}의 음식입니다. ${objectOf(friendFood)} 좋아하는 사람은 ${referencePerson} 자신이 아니므로 ${friendPerson}이고, ${topicOf(referencePerson)} ${objectOf(remainingFood)} 좋아합니다.`,
    meta: { difficulty, people, foods, clues, assignments, solutionCount: 1, roles: { hotPerson, dislikedFoodPerson, referencePerson, friendPerson } }
  };
}

function practiceRelativeNumberGridNine({ difficulty = 2 }) {
  const mapped = shuffle(range(9, 1));
  const value = (source) => mapped[source - 1];
  const sourceGrid = [7, 4, 1, 6, 5, 9, 3, 8, 2];
  const grid = sourceGrid.map(value);
  const clues = [
    `${topicOf(value(4))} ${value(5)} 위에 있습니다.`,
    `${topicOf(value(8))} ${value(5)} 아래에 있습니다.`,
    `${topicOf(value(2))} 맨 아랫줄 오른쪽에 있습니다.`,
    `${topicOf(value(9))} ${value(5)} 오른쪽에 있습니다.`,
    `${topicOf(value(1))} ${value(4)} 오른쪽에 있습니다.`,
    `${topicOf(value(3))} ${value(8)} 옆에 있습니다.`,
    `${topicOf(value(6))} ${value(5)} 왼쪽에 있습니다.`
  ];
  return {
    prompt: "조건에 맞게 1부터 9까지의 수를 빈칸에 한 번씩 써넣으세요.",
    visual: { kind: "mock6-relative-number-grid", clues },
    answer: [0, 1, 2].map((row) => grid.slice(row * 3, row * 3 + 3).join(" ")).join(" / "),
    solution: `가운데 수의 위·아래·왼쪽·오른쪽을 먼저 놓고, 모서리 조건을 채우면 ${[0, 1, 2].map((row) => grid.slice(row * 3, row * 3 + 3).join(" ")).join(" / ")}입니다.`,
    meta: { difficulty, mapped, grid, clues, solutionCount: 1 }
  };
}

function practiceThreeFoldLineUnfold({ difficulty = 2 }) {
  const position = difficulty === 1 ? 0.5 : sample([0.35, 0.4, 0.5, 0.6, 0.65]);
  const vertical = [position / 2, 1 - position / 2].sort((a, b) => a - b);
  const horizontal = [...vertical];
  return {
    prompt: "색종이를 위로 한 번, 왼쪽으로 한 번, 대각선으로 한 번 접었습니다. 접힌 색종이에 그어진 선을 보고 색종이를 펼쳤을 때의 선을 그리세요.",
    visual: { kind: "mock6-fold-line-unfold", position },
    answerVisual: { kind: "mock6-fold-line-unfold-answer", vertical, horizontal },
    answer: `세로선 ${vertical.length}개와 가로선 ${horizontal.length}개가 대칭으로 생긴 모양`,
    solution: "마지막 대각선 접기부터 거꾸로 펼치며 선을 대칭으로 옮깁니다. 그다음 왼쪽·오른쪽, 마지막으로 위·아래에 같은 선을 그립니다.",
    meta: { difficulty, position, vertical, horizontal, foldCount: 3, answerLineCount: vertical.length + horizontal.length }
  };
}

const DIRECTIONAL_ACTIVE_CELLS = Object.freeze([[0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1]]);
const SEVEN_PERMUTATIONS = permutations(range(7, 1));

function directionalSums(values) {
  const rows = [0, 0, 0];
  const columns = [0, 0, 0];
  DIRECTIONAL_ACTIVE_CELLS.forEach(([row, column], index) => {
    rows[row] += values[index];
    columns[column] += values[index];
  });
  return { rows, columns };
}

function directionalCandidates(rowSums, columnSums, given = null) {
  return SEVEN_PERMUTATIONS.filter((values) => {
    if (given && values[given.index] !== given.value) return false;
    const sums = directionalSums(values);
    return sums.rows.join(",") === rowSums.join(",") && sums.columns.join(",") === columnSums.join(",");
  });
}

function practiceDirectionalTriangleSums({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const values = sample(SEVEN_PERMUTATIONS);
    const { rows, columns } = directionalSums(values);
    const given = difficulty === 1 ? { index: randomInt(0, 6), value: 0 } : null;
    if (given) given.value = values[given.index];
    const candidates = directionalCandidates(rows, columns, given);
    if (candidates.length !== 1) continue;
    const grid = Array(9).fill(null);
    DIRECTIONAL_ACTIVE_CELLS.forEach(([row, column], index) => { grid[row * 3 + column] = values[index]; });
    return {
      prompt: "각 삼각형의 아래쪽 또는 왼쪽에 있는 수의 합이 삼각형 안의 수가 되도록, 빈칸에 1부터 7까지를 한 번씩 써넣으세요.",
      visual: { kind: "mock6-directional-sums", rowSums: rows, columnSums: columns, activeCells: DIRECTIONAL_ACTIVE_CELLS, given },
      answer: [0, 1, 2].map((row) => grid.slice(row * 3, row * 3 + 3).map((value) => value ?? "·").join(" ")).join(" / "),
      solution: `가로의 합과 세로의 합을 함께 맞추며 1부터 7까지를 한 번씩 넣으면 ${[0, 1, 2].map((row) => grid.slice(row * 3, row * 3 + 3).map((value) => value ?? "·").join(" ")).join(" / ")}입니다.`,
      meta: { difficulty, values, grid, rowSums: rows, columnSums: columns, activeCells: DIRECTIONAL_ACTIVE_CELLS, given, solutionCount: candidates.length }
    };
  }
  return null;
}

function practiceTwoClassTotalDifference({ difficulty = 2 }) {
  const halfBase = difficulty === 1 ? randomInt(12, 20) : difficulty === 2 ? randomInt(30, 50) : randomInt(45, 75);
  const difference = (difficulty === 1 ? randomInt(2, 5) : difficulty === 2 ? randomInt(4, 10) : randomInt(8, 18)) * 2;
  const smaller = halfBase;
  const larger = smaller + difference;
  const total = smaller + larger;
  return {
    prompt: `어느 학교 1학년은 두 반이고 학생은 모두 ${total}명입니다. 1반 학생이 2반보다 ${difference}명 더 많다면 1반 학생은 몇 명입니까?`,
    visual: { kind: "mock6-two-class-total", total, difference, showGuide: difficulty === 1 },
    answer: `${larger}명`,
    solution: `전체 ${total}명에서 차이 ${difference}명을 덜어 내면 ${total - difference}명입니다. 이를 똑같이 나누면 ${smaller}명이고, 많은 반은 ${smaller} + ${difference} = ${larger}명입니다.`,
    meta: { difficulty, total, difference, smaller, larger }
  };
}

function uniquePairResults(cards) {
  const byTarget = new Map();
  for (let left = 0; left < cards.length; left += 1) {
    for (let right = left + 1; right < cards.length; right += 1) {
      const a = cards[left];
      const b = cards[right];
      const entries = [
        { target: a + b, left: a, operator: "+", right: b },
        { target: Math.abs(a - b), left: Math.max(a, b), operator: "−", right: Math.min(a, b) }
      ];
      for (const entry of entries) {
        if (entry.target <= 0) continue;
        if (!byTarget.has(entry.target)) byTarget.set(entry.target, []);
        byTarget.get(entry.target).push(entry);
      }
    }
  }
  return [...byTarget.entries()].filter(([, entries]) => entries.length === 1).map(([target, [entry]]) => ({ ...entry, target }));
}

function practiceNumberBallPairTargets({ difficulty = 2 }) {
  const rowCount = difficulty === 1 ? 3 : difficulty === 2 ? 5 : 6;
  const max = difficulty === 1 ? 20 : difficulty === 2 ? 32 : 50;
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const cards = shuffle(range(max, 1)).slice(0, 6).sort((a, b) => a - b);
    const unique = shuffle(uniquePairResults(cards));
    const plus = unique.filter((entry) => entry.operator === "+");
    const minus = unique.filter((entry) => entry.operator === "−");
    if (plus.length < 2 || minus.length < 2 || unique.length < rowCount + 1) continue;
    const chosen = shuffle([sample(plus), sample(minus), ...shuffle(unique).slice(0, rowCount + 3)])
      .filter((entry, index, all) => all.findIndex((other) => other.target === entry.target) === index)
      .slice(0, rowCount + 1);
    if (chosen.length !== rowCount + 1 || !chosen.some((entry) => entry.operator === "+") || !chosen.some((entry) => entry.operator === "−")) continue;
    const [example, ...rows] = chosen;
    return {
      prompt: "공 안의 수 중 두 개를 골라 + 또는 −를 사용하여 목표 수가 되도록 빈칸을 채우세요. 한 식 안에서는 서로 다른 공을 사용합니다.",
      visual: { kind: "mock6-number-ball-targets", cards, example, rows },
      answer: rows.map((row, index) => `${index + 1}. ${row.left} ${row.operator} ${row.right} = ${row.target}`).join(" / "),
      solution: `각 목표 수가 되는 두 공을 찾아 계산하면 ${rows.map((row) => `${row.left}${row.operator}${row.right}=${row.target}`).join(", ")}입니다.`,
      meta: { difficulty, cards, example, rows, rowCount, allUnique: unique }
    };
  }
  return null;
}

function makeCornerRuleItem() {
  let corners;
  let result;
  do {
    corners = range(4).map(() => randomInt(0, 9));
    result = Math.abs((corners[0] + corners[3]) - (corners[1] + corners[2]));
  } while (result < 1 || new Set(corners).size < 3);
  return { corners, result };
}

function practiceDiagonalDifferenceSquare({ difficulty = 2 }) {
  const examples = [];
  while (examples.length < (difficulty === 1 ? 4 : 3)) {
    const item = makeCornerRuleItem();
    if (!examples.some((entry) => entry.result === item.result)) examples.push(item);
  }
  const target = makeCornerRuleItem();
  return {
    prompt: "네 모서리 수의 규칙을 찾아 마지막 네모 안에 들어갈 수를 쓰세요.",
    visual: { kind: "mock6-diagonal-difference", examples, target },
    answer: String(target.result),
    solution: `왼쪽 위와 오른쪽 아래의 합, 오른쪽 위와 왼쪽 아래의 합을 구해 큰 쪽에서 작은 쪽을 뺍니다. 마지막은 |(${target.corners[0]} + ${target.corners[3]}) - (${target.corners[1]} + ${target.corners[2]})| = ${target.result}입니다.`,
    meta: { difficulty, examples, target, rule: "absolute-diagonal-sum-difference" }
  };
}

function practiceThreePersonBookChain({ difficulty = 2 }) {
  const a = difficulty === 1 ? randomInt(8, 14) : difficulty === 2 ? randomInt(12, 22) : randomInt(18, 32);
  const addToA = randomInt(2, difficulty === 3 ? 8 : 5);
  let moreForB = randomInt(1, difficulty === 3 ? 6 : 4);
  if ((a + moreForB) % 2) moreForB += 1;
  const b = a + moreForB;
  const extraForC = randomInt(2, difficulty === 3 ? 8 : 5);
  const c = b / 2 + extraForC;
  const targetA = a + addToA;
  return {
    prompt: "A, B, C가 방학 동안 읽은 책은 각각 몇 권인지 구하세요.",
    visual: { kind: "mock6-book-chain", conditions: [
      `A는 ${addToA}권 더 읽으면 ${targetA}권이 됩니다.`,
      `B는 A보다 ${moreForB}권 더 많이 읽었습니다.`,
      `C는 B가 읽은 책의 절반보다 ${extraForC}권 더 읽었습니다.`
    ] },
    answer: `A ${a}권, B ${b}권, C ${c}권`,
    solution: `A는 ${targetA} - ${addToA} = ${a}권, B는 ${a} + ${moreForB} = ${b}권, C는 ${b}의 절반인 ${b / 2}에 ${objectOf(extraForC)} 더해 ${c}권입니다.`,
    meta: { difficulty, a, b, c, addToA, moreForB, extraForC, targetA }
  };
}

const COLOR_SEQUENCE_BASE = Object.freeze([
  Object.freeze([0]),
  Object.freeze([3, 6]),
  Object.freeze([1, 4, 7]),
  Object.freeze([0, 2, 5, 8]),
  Object.freeze([1, 3, 4, 6, 7]),
  Object.freeze([0, 2, 3, 5, 6, 8]),
  Object.freeze(range(9))
]);

function transformNineCell(index, transform) {
  let row = Math.floor(index / 3);
  let column = index % 3;
  if (transform >= 4) column = 2 - column;
  for (let turn = 0; turn < transform % 4; turn += 1) [row, column] = [column, 2 - row];
  return row * 3 + column;
}

function practiceGridColorCountSequence({ difficulty = 2 }) {
  const transform = randomInt(0, 7);
  const color = sample(["blue", "green", "coral"]);
  const panels = COLOR_SEQUENCE_BASE.map((cells) => cells.map((index) => transformNineCell(index, transform)).sort((a, b) => a - b));
  const missing = difficulty === 3 ? sample([4, 5]) : 5;
  const answerCells = panels[missing];
  return {
    prompt: `9개의 칸을 규칙에 따라 색칠했습니다. ${missing + 1}번째에 알맞은 모양을 색칠하세요.`,
    visual: { kind: "mock6-grid-color-sequence", panels, missing, color },
    answerVisual: { kind: "mock6-grid-color-answer", cells: answerCells, color },
    answer: `${missing + 1}번째 칸 ${answerCells.length}개 색칠`,
    solution: `색칠한 칸이 1개, 2개, 3개처럼 하나씩 늘어나는 위치 규칙을 이어가면 ${missing + 1}번째에는 ${answerCells.length}칸을 색칠합니다.`,
    meta: { difficulty, transform, color, panels, missing, answerCells, answerCount: answerCells.length }
  };
}

export const MOCK06_GENERATORS = {
  practiceCongruentEqualSumPartition,
  practiceTwoMagicColoredSums,
  practiceDistinctZeroOneShapeValues,
  practiceShapeValueMatrix,
  practiceRepeatedTwoDigitShapeAddition,
  practiceFivePersonPhotoLine,
  practiceFoodPreferenceLogic,
  practiceRelativeNumberGridNine,
  practiceThreeFoldLineUnfold,
  practiceDirectionalTriangleSums,
  practiceTwoClassTotalDifference,
  practiceNumberBallPairTargets,
  practiceDiagonalDifferenceSquare,
  practiceThreePersonBookChain,
  practiceGridColorCountSequence
};
