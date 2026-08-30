// 더클래식 1과정 1권 전용 생성기.
// 원본 페이지를 저장하지 않고, 문제 번호로 확인한 풀이 구조만 새 수와 새 그림으로 재현한다.

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

function koreanParticle(word, withBatchim, withoutBatchim) {
  const last = [...String(word)].at(-1) || "";
  const code = last.charCodeAt(0) || 0;
  const hasBatchim = code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
  return `${word}${hasBatchim ? withBatchim : withoutBatchim}`;
}

const topicOf = (word) => koreanParticle(word, "은", "는");
const subjectOf = (word) => koreanParticle(word, "이", "가");
const withOf = (word) => koreanParticle(word, "과", "와");

function eachPermutation(values, callback) {
  const data = [...values];
  const visit = (index) => {
    if (index === data.length) return callback([...data]);
    for (let cursor = index; cursor < data.length; cursor += 1) {
      [data[index], data[cursor]] = [data[cursor], data[index]];
      visit(index + 1);
      [data[index], data[cursor]] = [data[cursor], data[index]];
    }
  };
  visit(0);
}

const pointKey = ([row, column]) => `${row}:${column}`;
const patternKey = (cells) => cells.map(pointKey).sort().join("|");

const BASE_PATTERNS = Object.freeze([
  [[0,0],[1,0],[2,0],[2,1],[1,2]],
  [[0,0],[0,1],[1,1],[2,1],[2,2]],
  [[0,1],[1,0],[1,1],[2,1],[2,2]],
  [[0,0],[1,0],[1,1],[1,2],[2,2]]
]);

function normalizePattern(cells) {
  const minRow = Math.min(...cells.map(([row]) => row));
  const minColumn = Math.min(...cells.map(([, column]) => column));
  return cells.map(([row, column]) => [row - minRow, column - minColumn]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function transformPattern(cells, operation, size = 4) {
  const transformed = cells.map(([row, column]) => {
    if (operation === "mirror-left-right") return [row, size - 1 - column];
    if (operation === "mirror-top-bottom") return [size - 1 - row, column];
    if (operation === "rotate-left") return [size - 1 - column, row];
    if (operation === "rotate-right") return [column, size - 1 - row];
    if (operation === "rotate-half") return [size - 1 - row, size - 1 - column];
    return [row, column];
  });
  return transformed.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

const OPERATION_LABELS = Object.freeze({
  "mirror-left-right": "오른쪽으로 뒤집기",
  "mirror-top-bottom": "아래쪽으로 뒤집기",
  "rotate-left": "왼쪽으로 반의 반 바퀴 돌리기",
  "rotate-right": "오른쪽으로 반의 반 바퀴 돌리기",
  "rotate-half": "반 바퀴 돌리기"
});
const OPERATION_CONNECTIVES = Object.freeze({
  "mirror-left-right": "오른쪽으로 뒤집고", "mirror-top-bottom": "아래쪽으로 뒤집고",
  "rotate-left": "왼쪽으로 반의 반 바퀴 돌리고", "rotate-right": "오른쪽으로 반의 반 바퀴 돌리고", "rotate-half": "반 바퀴 돌리고"
});
const OPERATION_FINALS = Object.freeze({
  "mirror-left-right": "오른쪽으로 뒤집었습니다.", "mirror-top-bottom": "아래쪽으로 뒤집었습니다.",
  "rotate-left": "왼쪽으로 반의 반 바퀴 돌렸습니다.", "rotate-right": "오른쪽으로 반의 반 바퀴 돌렸습니다.", "rotate-half": "반 바퀴 돌렸습니다."
});
const OPERATION_WHEN = Object.freeze({
  "mirror-left-right": "오른쪽으로 뒤집었을 때", "mirror-top-bottom": "아래쪽으로 뒤집었을 때",
  "rotate-left": "왼쪽으로 반의 반 바퀴 돌렸을 때", "rotate-right": "오른쪽으로 반의 반 바퀴 돌렸을 때", "rotate-half": "반 바퀴 돌렸을 때"
});

function distinctPatternOptions(source, correct, size) {
  const keys = new Set([patternKey(correct)]);
  const candidates = shuffle([
    transformPattern(source, "mirror-left-right", size),
    transformPattern(source, "mirror-top-bottom", size),
    transformPattern(source, "rotate-left", size),
    transformPattern(source, "rotate-right", size),
    transformPattern(source, "rotate-half", size),
    source
  ]).filter((cells) => {
    const key = patternKey(cells);
    if (keys.has(key)) return false;
    keys.add(key);
    return true;
  });
  while (candidates.length < 3) {
    const cells = shuffle(Array.from({ length: size * size }, (_, index) => [Math.floor(index / size), index % size])).slice(0, source.length);
    const key = patternKey(cells);
    if (!keys.has(key)) {
      keys.add(key);
      candidates.push(cells);
    }
  }
  return shuffle([{ cells: correct, correct: true }, ...candidates.slice(0, 3).map((cells) => ({ cells, correct: false }))])
    .map((option, index) => ({ ...option, option: index + 1 }));
}

function transformProblem(operations, family) {
  const size = 4;
  const source = transformPattern(sample(BASE_PATTERNS), sample(["identity", "rotate-right", "rotate-half"]), size);
  const correct = operations.reduce((cells, operation) => transformPattern(cells, operation, size), source);
  const options = distinctPatternOptions(source, correct, size);
  const correctOption = options.find((option) => option.correct).option;
  const actionText = operations.map((operation, index) => index === operations.length - 1 ? OPERATION_FINALS[operation] : OPERATION_CONNECTIVES[operation]).join(" ");
  return {
    prompt: `처음 모양을 ${actionText} 알맞은 결과를 고르세요.`,
    visual: { kind: "book1", subtype: "shape-transform", size, source, operations, options },
    answer: `${correctOption}번`,
    solution: `${operations.map((operation) => OPERATION_LABELS[operation]).join(" → ")} 순서로 각 칸을 옮기면 ${correctOption}번 모양입니다.`,
    meta: { family, sourceKey: patternKey(source), correctKey: patternKey(correct), correctOption, optionKeys: options.map((option) => patternKey(option.cells)) }
  };
}

function shapeMirrorDirection() {
  return transformProblem([sample(["mirror-left-right", "mirror-top-bottom"])], "shape-mirror");
}

function shapeQuarterHalfTurn({ difficulty = 2 }) {
  const operations = difficulty === 1
    ? [sample(["rotate-left", "rotate-right"])]
    : difficulty === 2
      ? [sample(["rotate-left", "rotate-right", "rotate-half"])]
      : [sample(["rotate-left", "rotate-right"]), sample(["rotate-left", "rotate-right"])];
  return transformProblem(operations, "shape-turn");
}

function shapeFlipComposition({ difficulty = 2 }) {
  const operations = difficulty === 1
    ? [sample(["mirror-left-right", "mirror-top-bottom"]), "rotate-half"]
    : difficulty === 2
      ? [sample(["mirror-left-right", "mirror-top-bottom"]), sample(["rotate-left", "rotate-right"])]
      : [sample(["rotate-left", "rotate-right"]), sample(["mirror-left-right", "mirror-top-bottom"]), "rotate-half"];
  return transformProblem(operations, "shape-composition");
}

function normalizeCells(cells) {
  const minRow = Math.min(...cells.map(([row]) => row));
  const minColumn = Math.min(...cells.map(([, column]) => column));
  return cells.map(([row, column]) => [row - minRow, column - minColumn]);
}

function polyominoCanonical(cells) {
  const normalizedKeys = [];
  for (let reflection = 0; reflection < 2; reflection += 1) {
    for (let rotation = 0; rotation < 4; rotation += 1) {
      const transformed = cells.map(([row, column]) => {
        let x = column;
        let y = row;
        if (reflection) x = -x;
        for (let step = 0; step < rotation; step += 1) [x, y] = [-y, x];
        return [y, x];
      });
      normalizedKeys.push(patternKey(normalizeCells(transformed)));
    }
  }
  return normalizedKeys.sort()[0];
}

function isConnected(cells) {
  if (!cells.length) return false;
  const all = new Set(cells.map(pointKey));
  const seen = new Set([pointKey(cells[0])]);
  const queue = [cells[0]];
  while (queue.length) {
    const [row, column] = queue.shift();
    [[row-1,column],[row+1,column],[row,column-1],[row,column+1]].forEach((next) => {
      const key = pointKey(next);
      if (all.has(key) && !seen.has(key)) {
        seen.add(key);
        queue.push(next);
      }
    });
  }
  return seen.size === cells.length;
}

function partitionGroups(rows, columns, labels) {
  const groups = new Map();
  labels.forEach((label, index) => {
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push([Math.floor(index / columns), index % columns]);
  });
  return [...groups.values()];
}

function isCongruentPartition(rows, columns, labels, pieceCount) {
  const groups = partitionGroups(rows, columns, labels);
  if (groups.length !== pieceCount || groups.some((group) => group.length !== rows * columns / pieceCount || !isConnected(group))) return false;
  const shape = polyominoCanonical(groups[0]);
  return groups.every((group) => polyominoCanonical(group) === shape);
}

const ROTATIONAL_PARTITION_TEMPLATES = Object.freeze({
  2: Object.freeze({
    easy: Object.freeze([[0,1],[2,1],[2,2]]),
    step: Object.freeze([[1,0],[1,1],[2,1],[2,2]]),
    stair: Object.freeze([[0,2],[1,2],[1,1],[2,1],[2,2]]),
    deep: Object.freeze([[1,4],[1,1],[2,1],[2,2]])
  }),
  4: Object.freeze({
    diagonal: Object.freeze([[2,0],[3,2],[3,3]]),
    bent: Object.freeze([[2,0],[3,1],[3,3]]),
    step: Object.freeze([[2,0],[2,2],[3,2],[3,3]])
  })
});

function rotatePartitionPoint([x, y], [centerX, centerY], quarterTurns) {
  let nextX = x;
  let nextY = y;
  for (let turn = 0; turn < ((quarterTurns % 4) + 4) % 4; turn += 1) {
    [nextX, nextY] = [centerX - (nextY - centerY), centerY + (nextX - centerX)];
  }
  return [nextX, nextY];
}

function transformPartitionPath(path, center, quarterTurns, reflected = false) {
  const reflectedPath = reflected
    ? path.map(([x, y]) => [center[0] * 2 - x, y])
    : path;
  return reflectedPath.map((point) => rotatePartitionPoint(point, center, quarterTurns));
}

function makePartition(pieceCount, { difficulty = 2 } = {}) {
  const rows = pieceCount === 2 ? 4 : 6;
  const columns = rows;
  const center = [columns / 2, rows / 2];
  const templateNames = pieceCount === 2
    ? (difficulty <= 1 ? ["easy", "step"] : difficulty >= 3 ? ["stair", "deep"] : ["step", "stair"])
    : (difficulty <= 1 ? ["diagonal"] : difficulty >= 3 ? ["step"] : ["diagonal", "bent"]);
  const templateName = sample(templateNames);
  const guidePath = transformPartitionPath(
    ROTATIONAL_PARTITION_TEMPLATES[pieceCount][templateName],
    center,
    randomInt(0, 3),
    pieceCount === 2 && Math.random() < 0.5
  );
  const turnStep = 4 / pieceCount;
  const completedPaths = Array.from({ length: pieceCount }, (_, index) =>
    transformPartitionPath(guidePath, center, index * turnStep)
  );
  const operation = pieceCount === 2 ? "반 바퀴" : "반의 반 바퀴씩 3번";
  return {
    prompt: `빨간 선을 가운데 점을 중심으로 ${operation} 돌린 선을 이어 그려, 모양과 크기가 같은 ${pieceCount}조각으로 나누세요.`,
    visual: { kind: "book1", subtype: "partition-draw", mode: "rotational", board: pieceCount === 2 ? "square" : "cross", rows, columns, pieceCount, guidePath, pivot: true },
    answer: `그림과 같이 ${pieceCount}조각으로 나눕니다.`,
    answerVisual: { kind: "book1", subtype: "partition-draw", mode: "rotational", board: pieceCount === 2 ? "square" : "cross", rows, columns, pieceCount, guidePath, completedPaths, pivot: true },
    solution: `빨간 시작선을 중심점 둘레로 ${operation} 정확히 돌려 그립니다. 새로 그릴 선은 ${pieceCount - 1}개이며, 완성된 각 조각은 돌리면 서로 정확히 겹칩니다.`,
    responseKind: "drawing",
    meta: { family: `partition-${pieceCount}`, board: pieceCount === 2 ? "square" : "cross", center, guidePath, completedPaths, templateName, turnStep, requiredAddedPaths: pieceCount - 1, uniqueCompletionCount: 1 }
  };
}

function rotationalPartitionTwo(context = {}) { return makePartition(2, context); }
function rotationalPartitionFour(context = {}) { return makePartition(4, context); }

const SYMBOL_PARTITION_GUIDE_CUTS = Object.freeze(["5:right", "9:right", "5:bottom", "6:bottom"]);
const SYMBOL_PARTITION_CANDIDATES = Object.freeze([
  Object.freeze([39, 2248, 4880, 58368]),
  Object.freeze([46, 785, 29696, 35008]),
  Object.freeze([51, 204, 13056, 52224]),
  Object.freeze([71, 3208, 4400, 57856]),
  Object.freeze([78, 305, 29184, 35968])
]);
const SOURCE_SYMBOL_PARTITIONS = Object.freeze([SYMBOL_PARTITION_CANDIDATES[1], SYMBOL_PARTITION_CANDIDATES[4]]);

function cellsInMask(mask) {
  return Array.from({ length: 16 }, (_, index) => index).filter((index) => (mask & (1 << index)) !== 0);
}

function labelsForPartition(masks) {
  const labels = Array(16).fill("");
  masks.forEach((mask, groupIndex) => {
    cellsInMask(mask).forEach((index) => { labels[index] = String.fromCharCode(65 + groupIndex); });
  });
  return labels;
}

function countSymbolPartitionSolutions(symbols) {
  return SYMBOL_PARTITION_CANDIDATES.filter((partition) => partition.every((mask) => {
    const values = cellsInMask(mask).map((index) => symbols[index]);
    return new Set(values).size === 4;
  })).length;
}

function symbolBalancedCongruentPartition({ difficulty = 2 } = {}) {
  const rows = 4;
  const columns = 4;
  const masks = sample(SOURCE_SYMBOL_PARTITIONS);
  const labels = labelsForPartition(masks);
  const symbolSet = difficulty <= 1 ? ["1", "2", "3", "4"] : ["○", "△", "□", "★"];
  let symbols = null;
  let uniqueCount = 0;
  for (let retry = 0; retry < 200 && uniqueCount !== 1; retry += 1) {
    const candidate = Array(rows * columns).fill("");
    masks.forEach((mask) => {
      shuffle(symbolSet).forEach((symbol, index) => {
        candidate[cellsInMask(mask)[index]] = symbol;
      });
    });
    uniqueCount = countSymbolPartitionSolutions(candidate);
    if (uniqueCount === 1) symbols = candidate;
  }
  if (!symbols) return null;
  const itemLabel = difficulty <= 1 ? "1, 2, 3, 4" : "○, △, □, ★";
  return {
    prompt: `각 조각에 ${itemLabel}가 하나씩 들어가도록 모양과 크기가 같은 네 조각으로 나누세요.`,
    visual: { kind: "book1", subtype: "partition-draw", rows, columns, pieceCount: 4, symbols, guideCuts: SYMBOL_PARTITION_GUIDE_CUTS, sourceGuide: true },
    answer: "그림과 같이 네 조각으로 나눕니다.",
    answerVisual: { kind: "book1", subtype: "partition-draw", rows, columns, pieceCount: 4, symbols, labels, guideCuts: SYMBOL_PARTITION_GUIDE_CUTS, sourceGuide: true, showPieceFills: false },
    solution: `각 조각이 이어져 있고, 돌리거나 뒤집으면 정확히 겹치는지 확인합니다. 각 조각에는 ${itemLabel}가 하나씩 들어 있습니다.`,
    responseKind: "drawing",
    meta: { family: "symbol-partition", labels, symbols, masks, guideCuts: SYMBOL_PARTITION_GUIDE_CUTS, uniqueCount }
  };
}

const DIGIT_SEGMENTS = Object.freeze({
  0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg",
  5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg"
});
const SEGMENT_DIGIT = Object.freeze(Object.fromEntries(Object.entries(DIGIT_SEGMENTS).map(([digit, segments]) => [[...segments].sort().join(""), Number(digit)])));
const SEGMENT_MAPS = Object.freeze({
  "mirror-left-right": { a:"a", b:"f", c:"e", d:"d", e:"c", f:"b", g:"g" },
  "mirror-top-bottom": { a:"d", b:"c", c:"b", d:"a", e:"f", f:"e", g:"g" },
  "rotate-half": { a:"d", b:"e", c:"f", d:"a", e:"b", f:"c", g:"g" }
});

function transformDigit(digit, operation) {
  const mapped = [...DIGIT_SEGMENTS[digit]].map((segment) => SEGMENT_MAPS[operation][segment]).sort().join("");
  return SEGMENT_DIGIT[mapped];
}

function validDigitPairs(operation, allowSame = false) {
  return Object.keys(DIGIT_SEGMENTS).map(Number).map((digit) => [digit, transformDigit(digit, operation)])
    .filter(([digit, result]) => result != null && (allowSame || digit !== result));
}

function transformDisplay(digits, operation) {
  const output = digits.map((digit) => transformDigit(digit, operation));
  if (output.some((digit) => digit == null)) return null;
  return operation === "mirror-left-right" || operation === "rotate-half" ? output.reverse() : output;
}

function numericOptions(answer) {
  const values = new Set([answer]);
  [answer + 1, answer - 1, answer + 9, answer - 9, Math.abs(Number(String(answer).split("").reverse().join("")))].forEach((value) => {
    if (value >= 0) values.add(value);
  });
  while (values.size < 4) values.add(answer + randomInt(2, 12));
  return shuffle([...values].slice(0, 4)).map((value, index) => ({ option: index + 1, value, correct: value === answer }));
}

function digitalDigitTransform({ difficulty = 2 }) {
  const operations = difficulty === 1 ? ["mirror-left-right", "mirror-top-bottom"] : ["mirror-left-right", "mirror-top-bottom", "rotate-half"];
  const operation = sample(operations);
  const [digit, result] = sample(validDigitPairs(operation, difficulty === 1));
  const options = numericOptions(result);
  const correctOption = options.find((option) => option.correct).option;
  return {
    prompt: `디지털 숫자 ${digit}의 숫자판을 ${OPERATION_WHEN[operation]} 보이는 숫자를 고르세요.`,
    visual: { kind: "book1", subtype: "digital-transform", digits: [digit], operation, options },
    answer: `${correctOption}번 (${result})`,
    solution: `켜진 막대를 ${OPERATION_LABELS[operation]} 하면 숫자 ${result}이므로 ${correctOption}번입니다.`,
    meta: { family: "digital-one", operation, source: digit, result, correctOption }
  };
}

function makeTwoDigitTransform(difficulty, allowedOperations = null, requireChanged = difficulty > 1) {
  const operations = allowedOperations || (difficulty === 1 ? ["mirror-top-bottom"] : ["mirror-left-right", "mirror-top-bottom", "rotate-half"]);
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const operation = sample(operations);
    const pairs = validDigitPairs(operation, true);
    const source = [sample(pairs)[0], sample(pairs)[0]];
    if (source[0] === 0 || source[0] === source[1]) continue;
    const transformed = transformDisplay(source, operation);
    if (!transformed || transformed[0] === 0) continue;
    const sourceValue = source[0] * 10 + source[1];
    const answer = transformed[0] * 10 + transformed[1];
    if (answer === sourceValue && requireChanged) continue;
    return { operation, source, transformed, sourceValue, answer };
  }
  return { operation: "rotate-half", source: [1, 9], transformed: [6, 1], sourceValue: 19, answer: 61 };
}

function digitalTwoDigitTransform({ difficulty = 2 }) {
  const made = makeTwoDigitTransform(difficulty);
  const options = numericOptions(made.answer);
  const correctOption = options.find((option) => option.correct).option;
  return {
    prompt: `두 자리 디지털 수 ${made.sourceValue}의 숫자판을 ${OPERATION_FINALS[made.operation]} 알맞은 수를 고르세요.`,
    visual: { kind: "book1", subtype: "digital-transform", digits: made.source, operation: made.operation, options },
    answer: `${correctOption}번 (${made.answer})`,
    solution: `각 숫자의 막대를 옮기고 자리의 순서까지 확인하면 ${made.answer}이므로 ${correctOption}번입니다.`,
    meta: { family: "digital-two", operation: made.operation, source: made.sourceValue, result: made.answer, correctOption }
  };
}

const BOARD_TURN_LABELS = Object.freeze({
  "rotate-right-quarter": "시계방향(오른쪽)으로 반의 반 바퀴",
  "rotate-left-quarter": "시계 반대방향(왼쪽)으로 반의 반 바퀴",
  "rotate-half": "반 바퀴"
});

const BOARD_TURN_STEPS = Object.freeze({
  "rotate-right-quarter": 1,
  "rotate-left-quarter": 3,
  "rotate-half": 2
});

function makeDigitalOrientationBoard(operation, difficulty) {
  const digits = shuffle([1,2,3,4,5,6,7,8,9]);
  const turn = BOARD_TURN_STEPS[operation];
  const uprightBeforeTurn = (4 - turn) % 4;
  const targetCount = difficulty <= 1 ? 4 : difficulty >= 3 ? 2 : 3;
  const targetIndices = new Set(shuffle([0,1,2,3,4,5,6,7,8]).slice(0, targetCount));
  const cells = digits.map((digit, index) => {
    if (targetIndices.has(index)) return { digit, orientation: uprightBeforeTurn };
    const otherOrientations = [0,1,2,3].filter((value) => value !== uprightBeforeTurn);
    return { digit, orientation: sample(otherOrientations) };
  });
  const uprightDigits = cells.filter((cell) => (cell.orientation + turn) % 4 === 0).map((cell) => cell.digit);
  return { operation, cells, uprightDigits, answer: uprightDigits.reduce((sum, digit) => sum + digit, 0) };
}

function makeDigitalBoardSum(operation, difficulty) {
  const made = makeDigitalOrientationBoard(operation, difficulty);
  return {
    prompt: `다음 숫자판을 ${BOARD_TURN_LABELS[operation]} 돌렸을 때, 똑바로 놓이는 수들의 합을 구하세요.`,
    visual: { kind: "book1", subtype: "digital-orientation-board", cells: made.cells, operation },
    answer: String(made.answer),
    solution: `숫자판 전체를 ${BOARD_TURN_LABELS[operation]} 돌리면 ${made.uprightDigits.join(", ")}이 똑바로 놓입니다. 따라서 ${made.uprightDigits.join(" + ")} = ${made.answer}입니다.`,
    meta: { family: "digital-board-sum", operation, uprightDigits: made.uprightDigits, answer: made.answer }
  };
}

function digitalTransformBoardSum({ difficulty = 2 }) {
  const operation = sample(["rotate-right-quarter", "rotate-left-quarter"]);
  return makeDigitalBoardSum(operation, difficulty);
}

function digitalBoardHalfTurnSum({ difficulty = 2 }) {
  return makeDigitalBoardSum("rotate-half", difficulty);
}

function makeRelatedDigitalAddition(operation, layout, difficulty) {
  const made = makeTwoDigitTransform(difficulty, [operation], true);
  const answer = made.sourceValue + made.answer;
  const transformedPhrase = operation === "mirror-left-right"
    ? "그 수를 오른쪽으로 뒤집어 읽은 수"
    : "그 수를 반 바퀴 돌려 읽은 수";
  return {
    prompt: `다음 덧셈식은 원래 두 자리 수와 ${transformedPhrase}를 더한 것입니다. 빈칸에 알맞은 수를 구하세요.`,
    visual: { kind: "book1", subtype: "digital-related-addition", source: made.source, operation, layout },
    answer: String(answer),
    solution: `원래 수 ${made.sourceValue}을 ${OPERATION_LABELS[operation]} 읽으면 ${made.answer}입니다. 따라서 ${made.sourceValue} + ${made.answer} = ${answer}입니다.`,
    meta: { family: "digital-related-addition", operation, layout, source: made.sourceValue, transformed: made.answer, answer }
  };
}

function digitalFlipAdditionHorizontal({ difficulty = 2 }) {
  return makeRelatedDigitalAddition("mirror-left-right", "horizontal", difficulty);
}

function digitalTransformAddition({ difficulty = 2 }) {
  return makeRelatedDigitalAddition("rotate-half", "vertical", difficulty);
}

function distinctPairValues(pairSum, count) {
  const candidates = shuffle(Array.from({ length: pairSum - 1 }, (_, index) => index + 1));
  const used = new Set();
  const pairs = [];
  for (const value of candidates) {
    const other = pairSum - value;
    if (other < 1 || used.has(value) || used.has(other) || value === other) continue;
    used.add(value); used.add(other); pairs.push([value, other]);
    if (pairs.length === count) break;
  }
  return pairs;
}

function circularMagicProblem(cardCount, difficulty) {
  const cards = Array.from({ length: cardCount }, (_, index) => index + 1);
  const centerChoices = [cards[0], cards[Math.floor(cardCount / 2)], cards.at(-1)];
  const center = difficulty === 1 ? centerChoices[1] : sample(centerChoices);
  const remaining = cards.filter((value) => value !== center);
  const pairs = [];
  while (remaining.length) pairs.push([remaining.shift(), remaining.pop()]);
  const arrangedPairs = shuffle(pairs).map((pair) => Math.random() < 0.5 ? pair : [...pair].reverse());
  const half = arrangedPairs.length;
  const nodes = Array(half * 2).fill(null);
  arrangedPairs.forEach(([first, second], index) => {
    nodes[index] = first;
    nodes[index + half] = second;
  });
  const lineSum = nodes[0] + center + nodes[half];
  return {
    prompt: `1부터 ${cardCount}까지의 수 카드를 한 번씩 사용하여 가운데를 지나는 ${half}줄의 합이 모두 같도록 원형진을 완성하고 한 줄의 합을 구하세요.`,
    visual: { kind: "book1", subtype: "circle-magic", cards, center: null, shown: nodes.map(() => null), lineSum: null },
    answerVisual: { kind: "book1", subtype: "circle-magic", cards: [], center, shown: nodes, lineSum },
    answer: `한 줄의 합 ${lineSum}`,
    responseKind: "drawing",
    solution: `가운데에 ${center}을 놓고 마주 보는 두 수의 합이 같도록 배치하면 한 줄의 합은 ${lineSum}입니다.`,
    meta: { family: "circle-magic", cards, nodes, center, lineSum, lineCount: half }
  };
}

function circularMagicLineSum({ difficulty = 2 }) {
  return circularMagicProblem(9, difficulty);
}

function circularMagicSevenLineSum({ difficulty = 2 }) {
  return circularMagicProblem(7, difficulty);
}

function circularMagicElevenLineSum({ difficulty = 2 }) {
  return circularMagicProblem(11, difficulty);
}

function fiveCardMagicProblem(layout, difficulty) {
  const step = difficulty === 1 ? 1 : difficulty === 2 ? sample([1, 2]) : sample([2, 3]);
  const start = randomInt(1, difficulty === 3 ? 5 : 3);
  const cards = Array.from({ length: 5 }, (_, index) => start + index * step);
  const shared = cards[2];
  const pairs = shuffle([[cards[0], cards[4]], [cards[1], cards[3]]])
    .map((pair) => Math.random() < 0.5 ? pair : [...pair].reverse());
  const values = layout === "cross"
    ? [pairs[0][0], pairs[0][1], pairs[1][0], shared, pairs[1][1]]
    : [pairs[0][0], pairs[0][1], shared, pairs[1][0], pairs[1][1]];
  const lines = layout === "cross" ? [[0,3,1],[2,3,4]] : [[0,1,2],[2,3,4]];
  const lineSum = lines[0].reduce((sum, index) => sum + values[index], 0);
  const shapeName = layout === "cross" ? "십자" : "T자";
  return {
    prompt: `주어진 다섯 수 카드를 한 번씩 사용하여 가로와 세로에 놓인 세 수의 합이 같도록 ${shapeName} 마방진을 완성하고 한 줄의 합을 구하세요.`,
    visual: { kind: "book1", subtype: "five-card-magic", layout, cards, shown: values.map(() => null), lineSum: null },
    answerVisual: { kind: "book1", subtype: "five-card-magic", layout, cards: [], shown: values, lineSum },
    answer: `한 줄의 합 ${lineSum}`,
    responseKind: "drawing",
    solution: `두 줄이 함께 지나는 칸에 ${shared}을 놓고, 나머지 수를 합이 같은 두 쌍으로 나누어 놓으면 한 줄의 합은 ${lineSum}입니다.`,
    meta: { family: "five-card-magic", layout, cards, values, lines, lineSum }
  };
}

function crossShapeMagicSum({ difficulty = 2 }) {
  return fiveCardMagicProblem("cross", difficulty);
}

function tShapeMagicSum({ difficulty = 2 }) {
  return fiveCardMagicProblem("t-shape", difficulty);
}

function gridSums(values, rows, columns) {
  return {
    rowSums: Array.from({ length: rows }, (_, row) => values.slice(row * columns, (row + 1) * columns).reduce((sum, value) => sum + value, 0)),
    columnSums: Array.from({ length: columns }, (_, column) => Array.from({ length: rows }, (_, row) => values[row * columns + column]).reduce((sum, value) => sum + value, 0))
  };
}

function maskedGridSums(values, rows, columns, mask) {
  const activeValue = (index) => mask[index] ? values[index] : 0;
  return {
    rowSums: Array.from({ length: rows }, (_, row) => Array.from({ length: columns }, (_, column) => activeValue(row * columns + column)).reduce((sum, value) => sum + value, 0)),
    columnSums: Array.from({ length: columns }, (_, column) => Array.from({ length: rows }, (_, row) => activeValue(row * columns + column)).reduce((sum, value) => sum + value, 0))
  };
}

function countGakuroSolutions({ rows, columns, mask, shown, cards, rowSums, columnSums }, limit = 2) {
  const values = shown.map((value, index) => mask[index] ? value : null);
  const hidden = values.map((value, index) => mask[index] && value == null ? index : -1).filter((index) => index >= 0);
  let count = 0;
  const visit = (depth, remaining) => {
    if (count >= limit) return;
    if (depth === hidden.length) {
      const sums = maskedGridSums(values, rows, columns, mask);
      if (sums.rowSums.join() === rowSums.join() && sums.columnSums.join() === columnSums.join()) count += 1;
      return;
    }
    const index = hidden[depth];
    const row = Math.floor(index / columns);
    const column = index % columns;
    for (let cursor = 0; cursor < remaining.length; cursor += 1) {
      const value = remaining[cursor];
      values[index] = value;
      const rowIndices = Array.from({ length: columns }, (_, offset) => row * columns + offset).filter((target) => mask[target]);
      const columnIndices = Array.from({ length: rows }, (_, offset) => offset * columns + column).filter((target) => mask[target]);
      const rowReady = rowIndices.every((target) => values[target] != null);
      const columnReady = columnIndices.every((target) => values[target] != null);
      const rowTotal = rowIndices.reduce((sum, target) => sum + (values[target] || 0), 0);
      const columnTotal = columnIndices.reduce((sum, target) => sum + (values[target] || 0), 0);
      if (rowTotal <= rowSums[row] && columnTotal <= columnSums[column]
        && (!rowReady || rowTotal === rowSums[row]) && (!columnReady || columnTotal === columnSums[column])) {
        visit(depth + 1, remaining.filter((_, itemIndex) => itemIndex !== cursor));
      }
      values[index] = null;
      if (count >= limit) break;
    }
  };
  visit(0, cards);
  return count;
}

const GAKURO_LAYOUTS = Object.freeze({
  square: { rows: 2, columns: 2, mask: [1,1,1,1], label: "2×2" },
  rectangle: { rows: 3, columns: 2, mask: [1,1,1,1,1,1], label: "3×2" },
  irregular: { rows: 3, columns: 3, mask: [1,1,0,1,1,1,0,1,1], label: "계단 모양" },
  gridSix: { rows: 3, columns: 2, mask: [1,1,1,1,1,1], label: "3×2" },
  gridNine: { rows: 3, columns: 3, mask: [1,1,1,1,1,1,1,1,1], label: "3×3" },
  gridIrregular: { rows: 3, columns: 3, mask: [1,1,0,1,1,1,0,1,1], label: "계단 모양" }
});

function makeGakuroProblem(layoutId, difficulty, cardMode) {
  const layout = GAKURO_LAYOUTS[layoutId];
  const active = layout.mask.map((value, index) => value ? index : -1).filter((index) => index >= 0);
  for (let attempt = 0; attempt < 160; attempt += 1) {
    const start = randomInt(1, difficulty === 3 ? 4 : 2);
    const pool = Array.from({ length: active.length }, (_, index) => start + index);
    const shuffled = shuffle(pool);
    const values = Array(layout.rows * layout.columns).fill(null);
    active.forEach((index, order) => { values[index] = shuffled[order]; });
    const { rowSums, columnSums } = maskedGridSums(values, layout.rows, layout.columns, layout.mask);
    const fixedOrder = shuffle(active);
    const initialFixed = layoutId === "square" ? 0
      : layoutId === "gridNine" ? (difficulty === 1 ? 5 : difficulty === 2 ? 4 : 3)
        : difficulty === 1 ? 2 : 1;
    const fixed = fixedOrder.slice(0, initialFixed);
    let shown = values.map((value, index) => layout.mask[index] && fixed.includes(index) ? value : null);
    let hidden = active.filter((index) => shown[index] == null);
    let cards = hidden.map((index) => values[index]).sort((a, b) => a - b);
    let uniqueCount = countGakuroSolutions({ ...layout, shown, cards, rowSums, columnSums });
    while (uniqueCount !== 1 && fixed.length < active.length - 1) {
      fixed.push(fixedOrder[fixed.length]);
      shown = values.map((value, index) => layout.mask[index] && fixed.includes(index) ? value : null);
      hidden = active.filter((index) => shown[index] == null);
      cards = hidden.map((index) => values[index]).sort((a, b) => a - b);
      uniqueCount = countGakuroSolutions({ ...layout, shown, cards, rowSums, columnSums });
    }
    if (uniqueCount !== 1 || hidden.length < 2) continue;
    const promptLead = cardMode
      ? `주어진 수 카드를 빈칸에 한 번씩만 넣어 ${layout.label} 가쿠로를 완성하세요.`
      : `${pool[0]}부터 ${pool.at(-1)}까지의 서로 다른 수를 한 번씩만 써서 ${layout.label} 가쿠로를 완성하세요.`;
    const visualBase = { kind: "book1", subtype: "sum-grid", rows: layout.rows, columns: layout.columns, mask: layout.mask, rowSums, columnSums };
    return {
      prompt: promptLead,
      visual: { ...visualBase, cards: cardMode ? cards : [], rangeLabel: cardMode ? "" : `${pool[0]}~${pool.at(-1)}를 한 번씩`, shown },
      answerVisual: { ...visualBase, cards: [], rangeLabel: "", shown: values },
      answer: "그림과 같이 채웁니다.",
      responseKind: "drawing",
      solution: "가로 합과 세로 합을 동시에 확인하며 한 칸씩 채우면 답의 배치가 하나로 정해집니다.",
      meta: { family: "gakuro-layout", layoutId, values, mask: layout.mask, hidden, cards, rowSums, columnSums, uniqueCount }
    };
  }
  return null;
}

function gakuroCardPlacement({ difficulty = 2 }) {
  return makeGakuroProblem("square", difficulty, true);
}

function gakuroCardRectanglePlacement({ difficulty = 2 }) {
  return makeGakuroProblem("rectangle", difficulty, true);
}

function gakuroCardIrregularPlacement({ difficulty = 2 }) {
  return makeGakuroProblem("irregular", difficulty, true);
}

function gakuroGridSum({ difficulty = 2 }) {
  return makeGakuroProblem("gridSix", difficulty, false);
}

function gakuroGridNineSum({ difficulty = 2 }) {
  return makeGakuroProblem("gridNine", difficulty, false);
}

function gakuroGridIrregularSum({ difficulty = 2 }) {
  return makeGakuroProblem("gridIrregular", difficulty, false);
}

function circleLineRingEqualSum({ difficulty = 2 }) {
  let pairSum;
  let pairs;
  do {
    pairSum = randomInt(10, difficulty === 3 ? 24 : 18);
    pairs = distinctPairValues(pairSum, 4);
  } while (pairs.length < 4);
  const nodes = [pairs[0][0], pairs[1][0], pairs[2][0], pairs[3][0], pairs[0][1], pairs[1][1], pairs[2][1], pairs[3][1]];
  const hidden = randomInt(0, 7);
  return {
    prompt: "가운데를 지나는 네 줄에서 양쪽 두 수의 합이 모두 같도록 ㉠에 알맞은 수를 쓰세요.",
    visual: { kind: "book1", subtype: "ring-lines", shown: nodes.map((value, index) => index === hidden ? null : value), lineSum: pairSum },
    answer: String(nodes[hidden]),
    solution: `마주 보는 두 수의 합은 ${pairSum}이므로 맞은편 수를 빼면 ㉠은 ${nodes[hidden]}입니다.`,
    meta: { family: "ring-lines", nodes, hidden, lineSum: pairSum, answer: nodes[hidden] }
  };
}

function digitSumEnumeration({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const minimum = difficulty === 1 ? 10 : randomInt(12, 45);
    const maximum = difficulty === 3 ? Math.min(99, minimum + randomInt(35, 55)) : Math.min(99, minimum + randomInt(20, 40));
    const targetSum = randomInt(5, 13);
    const answers = Array.from({ length: maximum - minimum + 1 }, (_, index) => minimum + index)
      .filter((value) => Math.floor(value / 10) + value % 10 === targetSum);
    if (answers.length >= 2 && answers.length <= 6) {
      return {
        prompt: `${minimum}부터 ${maximum}까지의 두 자리 수 중 각 자리 숫자의 합이 ${targetSum}인 수를 모두 쓰세요.`,
        visual: { kind: "book1", subtype: "condition-card", title: "수의 조건", clues: [`${minimum}부터 ${maximum}까지`, `십의 자리 + 일의 자리 = ${targetSum}`] },
        answer: answers.join(", "),
        solution: `십의 자리를 차례로 정하고 일의 자리가 ${targetSum}에서 그 수를 뺀 값인지 확인하면 ${answers.join(", ")}입니다.`,
        meta: { family: "digit-sum-enumeration", minimum, maximum, targetSum, answers }
      };
    }
  }
  return null;
}

function threeDigitStepSequence({ difficulty = 2 }) {
  const step = sample(difficulty === 1 ? [10,20,50] : difficulty === 2 ? [11,21,25,50] : [-45,-25,37,48]);
  const count = difficulty === 3 ? 6 : 5;
  const start = step > 0 ? randomInt(100, 450) : randomInt(550, 900);
  const values = Array.from({ length: count }, (_, index) => start + step * index);
  const hidden = shuffle(Array.from({ length: count - 1 }, (_, index) => index + 1)).slice(0, difficulty === 1 ? 1 : difficulty === 2 ? 2 : 3).sort((a,b) => a-b);
  return {
    prompt: "같은 규칙으로 늘어놓은 세 자리 수입니다. 빈칸에 알맞은 수를 쓰세요.",
    visual: { kind: "book1", subtype: "number-sequence", shown: values.map((value, index) => hidden.includes(index) ? null : value) },
    answer: hidden.map((index) => values[index]).join(", "),
    solution: `이웃한 수는 매번 ${Math.abs(step)}씩 ${step > 0 ? "커집니다" : "작아집니다"}. 빈칸은 ${hidden.map((index) => values[index]).join(", ")}입니다.`,
    meta: { family: "three-digit-step", values, step, hidden, answerValues: hidden.map((index) => values[index]) }
  };
}

function placeValueCandidates(length) {
  const minimum = 10 ** (length - 1);
  const maximum = 10 ** length - 1;
  return Array.from({ length: maximum - minimum + 1 }, (_, index) => minimum + index)
    .map((value) => ({ value, digits: String(value).split("").map(Number) }))
    .filter((item) => new Set(item.digits).size === length);
}

const PLACE_CANDIDATES = Object.freeze({ 3: placeValueCandidates(3), 4: placeValueCandidates(4) });

function placeValueProblem(length, difficulty) {
  const target = sample(PLACE_CANDIDATES[length]);
  const digits = target.digits;
  const digitNames = length === 3 ? ["백", "십", "일"] : ["천", "백", "십", "일"];
  const clues = [{ text: "각 자리에는 서로 다른 숫자가 있습니다.", test: (item) => new Set(item.digits).size === length }];
  if (difficulty === 1) clues.push({ text: `${digitNames[0]}의 자리 숫자는 ${digits[0]}입니다.`, test: (item) => item.digits[0] === digits[0] });
  clues.push({ text: `각 자리 숫자의 합은 ${digits.reduce((sum, value) => sum + value, 0)}입니다.`, test: (item) => item.digits.reduce((sum, value) => sum + value, 0) === digits.reduce((sum, value) => sum + value, 0) });
  for (let index = 1; index < length; index += 1) {
    const difference = digits[index] - digits[index - 1];
    clues.push({
      text: `${digitNames[index]}의 자리 숫자는 ${digitNames[index - 1]}의 자리 숫자보다 ${Math.abs(difference)} ${difference >= 0 ? "큽니다" : "작습니다"}.`,
      test: (item) => item.digits[index] - item.digits[index - 1] === difference
    });
  }
  clues.push({ text: `${digitNames.at(-1)}의 자리 숫자는 ${digits.at(-1) % 2 ? "홀수" : "짝수"}입니다.`, test: (item) => item.digits.at(-1) % 2 === digits.at(-1) % 2 });
  const selected = difficulty === 3 ? [clues[0], clues[1], ...shuffle(clues.slice(2))] : [...clues];
  const active = [];
  let candidates = PLACE_CANDIDATES[length];
  for (const clue of selected) {
    active.push(clue);
    candidates = candidates.filter((item) => clue.test(item));
    if (candidates.length === 1) break;
  }
  if (candidates.length !== 1 || candidates[0].value !== target.value) {
    const exact = { text: `${digitNames[0]}의 자리 숫자는 ${digits[0]}입니다.`, test: (item) => item.digits[0] === digits[0] };
    if (!active.some((clue) => clue.text === exact.text)) active.push(exact);
    candidates = PLACE_CANDIDATES[length].filter((item) => active.every((clue) => clue.test(item)));
  }
  if (candidates.length !== 1 || candidates[0].value !== target.value) return null;
  return {
    prompt: `다음 조건을 모두 만족하는 ${length === 3 ? "세" : "네"} 자리 수를 구하세요.`,
    visual: { kind: "book1", subtype: "condition-card", title: `${length === 3 ? "세" : "네"} 자리 수`, clues: active.map((clue) => clue.text) },
    answer: String(target.value),
    solution: `조건을 자리별로 차례로 적용하면 남는 수는 ${target.value} 하나입니다.`,
    meta: { family: `place-value-${length}`, target: target.value, digits, clues: active.map((clue) => clue.text), uniqueCount: candidates.length }
  };
}

function placeValueConditionThree({ difficulty = 2 }) { return placeValueProblem(3, difficulty); }
function placeValueConditionFour({ difficulty = 2 }) { return placeValueProblem(4, difficulty); }

const LOGIC_NAMES = ["서윤", "민준", "지우", "하린"];
const LOGIC_ITEMS = ["사과", "포도", "바나나", "딸기"];
const ITEM_PERMUTATIONS = [];
eachPermutation([0,1,2,3], (values) => ITEM_PERMUTATIONS.push(values));

function personItemLogicBook1({ difficulty = 2 }) {
  const solution = sample(ITEM_PERMUTATIONS);
  const validClues = [];
  LOGIC_NAMES.forEach((name, person) => {
    validClues.push({ text: `${topicOf(name)} ${LOGIC_ITEMS[solution[person]]}를 좋아합니다.`, test: (candidate) => candidate[person] === solution[person], direct: true });
    LOGIC_ITEMS.forEach((item, itemIndex) => {
      if (itemIndex !== solution[person]) validClues.push({ text: `${topicOf(name)} ${item}를 좋아하지 않습니다.`, test: (candidate) => candidate[person] !== itemIndex, direct: false });
    });
  });
  for (let first = 0; first < 3; first += 1) {
    const second = first + 1;
    const set = [solution[first], solution[second]].sort();
    validClues.push({
      text: `${withOf(LOGIC_NAMES[first])} ${subjectOf(LOGIC_NAMES[second])} 좋아하는 것은 ${LOGIC_ITEMS[set[0]]}와 ${LOGIC_ITEMS[set[1]]} 중 하나씩입니다.`,
      test: (candidate) => [candidate[first], candidate[second]].sort().join() === set.join(), direct: false
    });
  }
  const pool = shuffle(validClues.filter((clue) => difficulty === 1 || !clue.direct));
  if (difficulty === 1) pool.sort((a, b) => Number(b.direct) - Number(a.direct));
  const clues = [];
  let candidates = ITEM_PERMUTATIONS;
  for (const clue of pool) {
    clues.push(clue);
    candidates = ITEM_PERMUTATIONS.filter((candidate) => clues.every((item) => item.test(candidate)));
    if (candidates.length === 1) break;
  }
  for (const direct of validClues.filter((clue) => clue.direct && !clues.includes(clue))) {
    if (candidates.length === 1) break;
    clues.push(direct);
    candidates = ITEM_PERMUTATIONS.filter((candidate) => clues.every((item) => item.test(candidate)));
  }
  if (candidates.length !== 1) return null;
  const targetPerson = randomInt(0, 3);
  return {
    prompt: "네 사람은 서로 다른 과일을 하나씩 좋아합니다. 조건을 보고 물음에 답하세요.",
    visual: { kind: "book1", subtype: "logic-clues", names: LOGIC_NAMES, items: LOGIC_ITEMS, clues: clues.map((clue) => clue.text), question: `${subjectOf(LOGIC_NAMES[targetPerson])} 좋아하는 과일은 무엇인가요?` },
    answer: LOGIC_ITEMS[solution[targetPerson]],
    solution: `조건표에서 될 수 없는 칸을 지우면 ${LOGIC_NAMES[targetPerson]}에게 남는 과일은 ${LOGIC_ITEMS[solution[targetPerson]]} 하나입니다.`,
    meta: { family: "person-item-logic", solution, targetPerson, answerIndex: solution[targetPerson], uniqueCount: candidates.length }
  };
}

const ORDER_NAMES = ["가은", "도윤", "민서", "준호", "하은"];
const ORDER_PERMUTATIONS = [];
eachPermutation([0,1,2,3,4], (values) => ORDER_PERMUTATIONS.push(values));

function relativeOrderLogicBook1({ difficulty = 2 }) {
  const solution = sample(ORDER_PERMUTATIONS);
  const position = (order, person) => order.indexOf(person);
  const validClues = [];
  ORDER_NAMES.forEach((name, person) => validClues.push({
    text: `${topicOf(name)} 앞에서 ${position(solution, person) + 1}번째입니다.`,
    test: (candidate) => position(candidate, person) === position(solution, person), direct: true
  }));
  for (let first = 0; first < ORDER_NAMES.length; first += 1) {
    for (let second = first + 1; second < ORDER_NAMES.length; second += 1) {
      const before = position(solution, first) < position(solution, second) ? first : second;
      const after = before === first ? second : first;
      validClues.push({ text: `${topicOf(ORDER_NAMES[before])} ${ORDER_NAMES[after]}보다 앞에 있습니다.`, test: (candidate) => position(candidate, before) < position(candidate, after), direct: false });
      const gap = Math.abs(position(solution, first) - position(solution, second)) - 1;
      if (gap <= 2) validClues.push({ text: `${withOf(ORDER_NAMES[first])} ${ORDER_NAMES[second]} 사이에는 ${gap}명이 있습니다.`, test: (candidate) => Math.abs(position(candidate, first) - position(candidate, second)) - 1 === gap, direct: false });
    }
  }
  let pool = shuffle(validClues.filter((clue) => difficulty === 1 || !clue.direct));
  if (difficulty === 1) pool = [...validClues.filter((clue) => clue.direct).slice(0, 1), ...pool];
  const clues = [];
  let candidates = ORDER_PERMUTATIONS;
  for (const clue of pool) {
    clues.push(clue);
    candidates = ORDER_PERMUTATIONS.filter((candidate) => clues.every((item) => item.test(candidate)));
    if (candidates.length === 1) break;
  }
  if (candidates.length !== 1) return null;
  const targetPerson = randomInt(0, ORDER_NAMES.length - 1);
  const answer = position(solution, targetPerson) + 1;
  return {
    prompt: "다섯 사람이 한 줄로 서 있습니다. 조건을 보고 물음에 답하세요.",
    visual: { kind: "book1", subtype: "logic-clues", names: ORDER_NAMES, items: [], clues: clues.map((clue) => clue.text), question: `${topicOf(ORDER_NAMES[targetPerson])} 앞에서 몇 번째인가요?` },
    answer: `${answer}번째`,
    solution: `조건을 앞뒤 순서로 이어 한 줄로 놓으면 ${solution.map((person) => ORDER_NAMES[person]).join(" → ")}입니다. 따라서 ${topicOf(ORDER_NAMES[targetPerson])} ${answer}번째입니다.`,
    meta: { family: "relative-order", solution, targetPerson, answer, uniqueCount: candidates.length }
  };
}

export const BOOK01_GENERATORS = {
  shapeMirrorDirection,
  shapeQuarterHalfTurn,
  shapeFlipComposition,
  rotationalPartitionTwo,
  rotationalPartitionFour,
  symbolBalancedCongruentPartition,
  digitalDigitTransform,
  digitalTwoDigitTransform,
  digitalTransformBoardSum,
  digitalBoardHalfTurnSum,
  digitalFlipAdditionHorizontal,
  digitalTransformAddition,
  circularMagicLineSum,
  circularMagicSevenLineSum,
  circularMagicElevenLineSum,
  crossShapeMagicSum,
  tShapeMagicSum,
  gakuroCardPlacement,
  gakuroCardRectanglePlacement,
  gakuroCardIrregularPlacement,
  gakuroGridSum,
  gakuroGridNineSum,
  gakuroGridIrregularSum,
  circleLineRingEqualSum,
  digitSumEnumeration,
  threeDigitStepSequence,
  placeValueConditionThree,
  placeValueConditionFour,
  personItemLogicBook1,
  relativeOrderLogicBook1
};

export const BOOK01_INTERNALS = {
  patternKey,
  transformPattern,
  isCongruentPartition,
  countSymbolPartitionSolutions,
  transformDigit,
  transformDisplay,
  gridSums,
  maskedGridSums,
  countGakuroSolutions
};
