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

function randomBalancedLabels(cellCount, pieceCount) {
  return shuffle(Array.from({ length: cellCount }, (_, index) => String.fromCharCode(65 + Math.floor(index / (cellCount / pieceCount)))));
}

function partitionOptions(rows, columns, pieceCount, validLabels, symbols = null) {
  const validity = (labels) => {
    if (!isCongruentPartition(rows, columns, labels, pieceCount)) return false;
    if (!symbols) return true;
    const groups = partitionGroups(rows, columns, labels);
    const signatures = groups.map((group) => group.map(([row, column]) => symbols[row * columns + column]).sort().join(""));
    return signatures.every((signature) => signature === signatures[0]);
  };
  const invalid = [];
  let attempts = 0;
  while (invalid.length < 3 && attempts < 2000) {
    const labels = randomBalancedLabels(rows * columns, pieceCount);
    const key = labels.join("");
    if (!validity(labels) && !invalid.some((item) => item.join("") === key)) invalid.push(labels);
    attempts += 1;
  }
  const options = shuffle([{ labels: validLabels, correct: true }, ...invalid.slice(0, 3).map((labels) => ({ labels, correct: false }))])
    .map((option, index) => ({ ...option, option: index + 1 }));
  return { options, correctOption: options.find((option) => option.correct).option, optionValidity: options.map((option) => validity(option.labels)) };
}

function makePartition(pieceCount, withSymbols = false) {
  const rows = pieceCount === 2 ? 3 : 4;
  const columns = 4;
  const validLabels = Array.from({ length: rows * columns }, (_, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    if (pieceCount === 2) return column < 2 ? "A" : "B";
    return String.fromCharCode(65 + Math.floor(row / 2) * 2 + Math.floor(column / 2));
  });
  const symbolSet = ["○", "△", "□", "★"];
  const symbols = withSymbols
    ? validLabels.map((label, index) => symbolSet[(index % 2) + (Math.floor(index / columns) % 2) * 2])
    : null;
  const made = partitionOptions(rows, columns, pieceCount, validLabels, symbols);
  return {
    prompt: withSymbols
      ? "네 조각의 모양과 크기가 같고, 각 조각에 네 가지 기호가 하나씩 들어가도록 나눈 보기를 고르세요."
      : `전체를 돌려서 포개면 정확히 겹치는 ${pieceCount}조각으로 나눈 보기를 고르세요.`,
    visual: { kind: "book1", subtype: "partition-choice", rows, columns, pieceCount, symbols, options: made.options },
    answer: `${made.correctOption}번`,
    solution: `${made.correctOption}번은 모든 조각이 이어져 있고, 돌리거나 뒤집으면 모양과 크기가 정확히 같습니다.${withSymbols ? " 또 각 조각에 ○, △, □, ★가 하나씩 있습니다." : ""}`,
    meta: { family: withSymbols ? "symbol-partition" : `partition-${pieceCount}`, correctOption: made.correctOption, optionValidity: made.optionValidity }
  };
}

function rotationalPartitionTwo() { return makePartition(2); }
function rotationalPartitionFour() { return makePartition(4); }
function symbolBalancedCongruentPartition() { return makePartition(4, true); }

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

function makeTwoDigitTransform(difficulty) {
  const operations = difficulty === 1 ? ["mirror-top-bottom"] : ["mirror-left-right", "mirror-top-bottom", "rotate-half"];
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const operation = sample(operations);
    const pairs = validDigitPairs(operation, true);
    const source = [sample(pairs)[0], sample(pairs)[0]];
    if (source[0] === 0) continue;
    const transformed = transformDisplay(source, operation);
    if (!transformed || transformed[0] === 0) continue;
    const sourceValue = source[0] * 10 + source[1];
    const answer = transformed[0] * 10 + transformed[1];
    if (answer === sourceValue && difficulty > 1) continue;
    return { operation, source, transformed, sourceValue, answer };
  }
  return { operation: "rotate-half", source: [6, 9], transformed: [6, 9], sourceValue: 69, answer: 69 };
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

function digitalTransformBoardSum({ difficulty = 2 }) {
  const count = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
  const operations = ["mirror-left-right", "mirror-top-bottom", "rotate-half"];
  const rows = Array.from({ length: count }, () => {
    const operation = sample(operations);
    const [digit, result] = sample(validDigitPairs(operation, true));
    return { digit, operation, result };
  });
  const answer = rows.reduce((sum, row) => sum + row.result, 0);
  return {
    prompt: "각 디지털 숫자를 화살표의 설명대로 움직였습니다. 나온 숫자를 모두 더하세요.",
    visual: { kind: "book1", subtype: "digital-board", rows },
    answer: String(answer),
    solution: `움직인 뒤의 숫자는 ${rows.map((row) => row.result).join(", ")}이고, 합은 ${rows.map((row) => row.result).join(" + ")} = ${answer}입니다.`,
    meta: { family: "digital-board-sum", results: rows.map((row) => row.result), answer }
  };
}

function digitalTransformAddition({ difficulty = 2 }) {
  const first = makeTwoDigitTransform(difficulty);
  const second = makeTwoDigitTransform(difficulty);
  const answer = first.answer + second.answer;
  return {
    prompt: "두 디지털 수를 각각 설명대로 움직인 뒤, 새로 보이는 두 수를 더하세요.",
    visual: { kind: "book1", subtype: "digital-addition", rows: [first, second] },
    answer: String(answer),
    solution: `움직인 뒤 ${first.answer}과 ${second.answer}이므로 ${first.answer} + ${second.answer} = ${answer}입니다.`,
    meta: { family: "digital-addition", values: [first.answer, second.answer], answer }
  };
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

function circularMagicLineSum({ difficulty = 2 }) {
  const center = randomInt(2, 8);
  let pairSum;
  let pairs;
  do {
    pairSum = randomInt(9, difficulty === 3 ? 20 : 15);
    pairs = distinctPairValues(pairSum, 3);
  } while (pairs.length < 3);
  const nodes = [pairs[0][0], pairs[1][0], pairs[2][0], pairs[0][1], pairs[1][1], pairs[2][1]];
  const hidden = randomInt(0, 5);
  const shown = nodes.map((value, index) => index === hidden ? null : value);
  const answer = nodes[hidden];
  return {
    prompt: "가운데를 지나는 세 줄에 놓인 세 수의 합이 모두 같도록 ㉠에 알맞은 수를 쓰세요.",
    visual: { kind: "book1", subtype: "circle-magic", center, shown, lineSum: pairSum + center },
    answer: String(answer),
    solution: `한 줄의 합은 ${pairSum + center}입니다. 가운데 ${center}과 맞은편 수를 빼면 ㉠은 ${answer}입니다.`,
    meta: { family: "circle-magic", nodes, center, hidden, lineSum: pairSum + center, answer }
  };
}

function crossShapeMagicSum({ difficulty = 2 }) {
  const center = randomInt(2, 9);
  const pairSum = randomInt(8, difficulty === 3 ? 22 : 16);
  const top = randomInt(1, pairSum - 1);
  const left = randomInt(1, pairSum - 1);
  const values = [top, pairSum - top, left, pairSum - left];
  const hidden = randomInt(0, 3);
  return {
    prompt: "가로줄과 세로줄에 놓인 세 수의 합이 같도록 ㉠에 알맞은 수를 쓰세요.",
    visual: { kind: "book1", subtype: "cross-magic", center, shown: values.map((value, index) => index === hidden ? null : value), lineSum: pairSum + center },
    answer: String(values[hidden]),
    solution: `완성된 줄의 합 ${pairSum + center}에서 가운데 ${center}과 보이는 수를 빼면 ㉠은 ${values[hidden]}입니다.`,
    meta: { family: "cross-magic", center, values, hidden, lineSum: pairSum + center, answer: values[hidden] }
  };
}

function gridSums(values, rows, columns) {
  return {
    rowSums: Array.from({ length: rows }, (_, row) => values.slice(row * columns, (row + 1) * columns).reduce((sum, value) => sum + value, 0)),
    columnSums: Array.from({ length: columns }, (_, column) => Array.from({ length: rows }, (_, row) => values[row * columns + column]).reduce((sum, value) => sum + value, 0))
  };
}

function gakuroCardPlacement({ difficulty = 2 }) {
  const values = shuffle([1,2,3,4,5,6,7,8,9]).slice(0, 4);
  const { rowSums, columnSums } = gridSums(values, 2, 2);
  const hiddenCount = difficulty === 1 ? 1 : difficulty === 2 ? 2 : 3;
  const hidden = shuffle([0,1,2,3]).slice(0, hiddenCount).sort((a,b) => a-b);
  const shown = values.map((value, index) => hidden.includes(index) ? null : value);
  return {
    prompt: "네 수 카드를 한 번씩 사용하여 가로와 세로의 합이 맞도록 빈칸을 채우세요.",
    visual: { kind: "book1", subtype: "sum-grid", rows: 2, columns: 2, cards: [...values].sort((a,b) => a-b), shown, rowSums, columnSums },
    answer: hidden.map((index) => values[index]).join(", "),
    solution: `줄의 합에서 보이는 수를 빼며 채우면 빈칸은 차례로 ${hidden.map((index) => values[index]).join(", ")}입니다.`,
    meta: { family: "gakuro-card", values, hidden, rowSums, columnSums, answerValues: hidden.map((index) => values[index]), uniqueCount: 1 }
  };
}

const SIX_PERMUTATIONS = [];
eachPermutation([1,2,3,4,5,6], (values) => SIX_PERMUTATIONS.push(values));

function gakuroGridSum({ difficulty = 2 }) {
  const values = sample(SIX_PERMUTATIONS);
  const { rowSums, columnSums } = gridSums(values, 2, 3);
  const order = shuffle([0,1,2,3,4,5]);
  const clues = order.slice(0, difficulty === 1 ? 3 : difficulty === 2 ? 2 : 1);
  const candidates = () => SIX_PERMUTATIONS.filter((candidate) => {
    const sums = gridSums(candidate, 2, 3);
    return sums.rowSums.join() === rowSums.join() && sums.columnSums.join() === columnSums.join()
      && clues.every((index) => candidate[index] === values[index]);
  });
  while (candidates().length !== 1 && clues.length < 5) clues.push(order[clues.length]);
  const shown = values.map((value, index) => clues.includes(index) ? value : null);
  const hidden = values.map((_, index) => index).filter((index) => !clues.includes(index));
  const uniqueCount = candidates().length;
  if (uniqueCount !== 1) return null;
  return {
    prompt: "1부터 6까지를 한 번씩 사용하여 가로와 세로의 합이 맞도록 가쿠로 칸을 채우세요.",
    visual: { kind: "book1", subtype: "sum-grid", rows: 2, columns: 3, cards: [1,2,3,4,5,6], shown, rowSums, columnSums },
    answerVisual: { kind: "book1", subtype: "sum-grid", rows: 2, columns: 3, cards: [], shown: values, rowSums, columnSums },
    answer: values.join(", "),
    responseKind: "drawing",
    solution: `가로 합과 세로 합을 함께 만족하는 배치는 ${values.join(", ")} 순서 하나뿐입니다.`,
    meta: { family: "gakuro-grid", values, clues, rowSums, columnSums, hidden, uniqueCount }
  };
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
  digitalTransformAddition,
  circularMagicLineSum,
  crossShapeMagicSum,
  gakuroCardPlacement,
  gakuroGridSum,
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
  transformDigit,
  transformDisplay,
  gridSums
};
