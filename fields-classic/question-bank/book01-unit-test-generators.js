const SOURCE_QUESTIONS = new Set([
  1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25
]);

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];

function shuffled(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = randomInt(0, index);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function permutations(values) {
  if (values.length <= 1) return [values];
  return values.flatMap((value, index) => permutations(values.filter((_, itemIndex) => itemIndex !== index)).map((tail) => [value, ...tail]));
}

function sourceMeta(sourceNumber, sourceLayout, detail = {}) {
  return { sourceBook: "book-01", sourceNumber, sourceLayout, ...detail };
}

const PARTITION_CANDIDATES = Object.freeze([
  Object.freeze([39, 2248, 4880, 58368]),
  Object.freeze([46, 785, 29696, 35008]),
  Object.freeze([51, 204, 13056, 52224]),
  Object.freeze([71, 3208, 4400, 57856]),
  Object.freeze([78, 305, 29184, 35968])
]);

const SOURCE_PARTITIONS = Object.freeze([PARTITION_CANDIDATES[1], PARTITION_CANDIDATES[4]]);
const PARTITION_GUIDE_CUTS = Object.freeze(["5:right", "9:right", "5:bottom", "6:bottom"]);

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

function balancedPartitionCount(symbols, expectedPerGroup = null) {
  return PARTITION_CANDIDATES.filter((partition) => partition.every((mask) => {
    const values = cellsInMask(mask).map((index) => symbols[index]);
    if (expectedPerGroup == null) return new Set(values).size === 4;
    return values.filter(Boolean).length === expectedPerGroup;
  })).length;
}

function makeSymbolPartitionBoard(masks) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const symbols = Array(16).fill("");
    masks.forEach((mask) => {
      shuffled(["1", "2", "3", "4"]).forEach((symbol, index) => {
        symbols[cellsInMask(mask)[index]] = symbol;
      });
    });
    const uniqueCount = balancedPartitionCount(symbols);
    if (uniqueCount === 1) return { masks, labels: labelsForPartition(masks), symbols, uniqueCount };
  }
  throw new Error("Could not create a unique symbol partition board");
}

function partitionProblem01() {
  const boards = SOURCE_PARTITIONS.map(makeSymbolPartitionBoard);
  const visualFor = (board, answer = false) => ({
    kind: "book1",
    subtype: "partition-draw",
    rows: 4,
    columns: 4,
    pieceCount: 4,
    symbols: board.symbols,
    guideCuts: PARTITION_GUIDE_CUTS,
    sourceGuide: true,
    ...(answer ? { labels: board.labels, showPieceFills: false } : {})
  });
  return {
    prompt: "각 조각에 1, 2, 3, 4가 하나씩 들어가도록 두 정사각형을 각각 모양과 크기가 같은 네 조각으로 나누세요.",
    visual: { kind: "book1", subtype: "unit-set", items: boards.map((board, index) => ({ label: `(${index + 1})`, visual: visualFor(board) })) },
    answerVisual: { kind: "book1", subtype: "unit-set", items: boards.map((board, index) => ({ label: `(${index + 1})`, visual: visualFor(board, true) })) },
    answer: "두 그림의 빨간 시작선을 이어 각각 네 조각으로 나눕니다.",
    responseKind: "drawing",
    solution: "빨간 선에서 시작해 네 칸짜리 조각을 만듭니다. 각 조각이 이어져 있고 서로 돌리거나 뒤집어 겹칠 수 있으며, 1, 2, 3, 4가 한 번씩 들어가는지 확인합니다.",
    meta: sourceMeta(1, "two-four-by-four-symbol-partitions", {
      boards: boards.map(({ masks, labels, symbols, uniqueCount }) => ({ masks, labels, symbols, uniqueCount }))
    })
  };
}

const MIRROR_DIGIT = Object.freeze({ 0: 0, 2: 5, 5: 2, 8: 8 });
const HALF_TURN_DIGIT = Object.freeze({ 0: 0, 2: 2, 5: 5, 6: 9, 8: 8, 9: 6 });

function transformedTwoDigit(map, allowed, requireChange = true) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const sourceDigits = [sample(allowed.filter((digit) => digit !== 0)), sample(allowed)];
    const resultDigits = [...sourceDigits].reverse().map((digit) => map[digit]);
    if (resultDigits[0] === 0) continue;
    const source = sourceDigits[0] * 10 + sourceDigits[1];
    const result = resultDigits[0] * 10 + resultDigits[1];
    if (!requireChange || source !== result) return { source, sourceDigits, result, resultDigits };
  }
  return { source: 25, sourceDigits: [2, 5], result: 25, resultDigits: [2, 5] };
}

function digitalMirrorProblem02() {
  const first = transformedTwoDigit(MIRROR_DIGIT, [2, 5, 8]);
  let second = transformedTwoDigit(MIRROR_DIGIT, [2, 5, 8]);
  while (second.source === first.source) second = transformedTwoDigit(MIRROR_DIGIT, [2, 5, 8]);
  const items = [first, second];
  return {
    prompt: "다음 두 자리 수를 오른쪽으로 뒤집었을 때 보이는 수를 각각 쓰세요.",
    visual: { kind: "book1", subtype: "digital-direct-set", mode: "mirror", items },
    answerVisual: { kind: "book1", subtype: "digital-direct-set", mode: "mirror", items, reveal: true },
    answer: items.map((item, index) => `(${index + 1}) ${item.result}`).join("  "),
    responseKind: "visual-fill",
    solution: `숫자판을 오른쪽으로 뒤집으면 자리 순서도 바뀝니다. ${items.map((item) => `${item.source} → ${item.result}`).join(", ")}이므로 답은 ${items.map((item) => item.result).join(", ")}입니다.`,
    meta: sourceMeta(2, "two-digit-horizontal-mirror-two-direct-write", { operation: "mirror-left-right", items })
  };
}

function digitalAdditionProblem03() {
  const first = transformedTwoDigit(HALF_TURN_DIGIT, [2, 5, 6, 8, 9]);
  let second = transformedTwoDigit(HALF_TURN_DIGIT, [2, 5, 6, 8, 9]);
  while (second.source === first.source) second = transformedTwoDigit(HALF_TURN_DIGIT, [2, 5, 6, 8, 9]);
  const items = [first, second].map((item) => ({ ...item, sum: item.source + item.result }));
  return {
    prompt: "다음 두 자리 수를 반 바퀴 돌렸을 때 보이는 수를 쓰고, 원래 수와 더하세요.",
    visual: { kind: "book1", subtype: "digital-direct-set", mode: "addition", items },
    answerVisual: { kind: "book1", subtype: "digital-direct-set", mode: "addition", items, reveal: true },
    answer: items.map((item, index) => `(${index + 1}) ${item.result}, ${item.sum}`).join("  "),
    responseKind: "visual-fill",
    solution: items.map((item, index) => `(${index + 1}) ${item.source}를 반 바퀴 돌리면 ${item.result}이고, ${item.source} + ${item.result} = ${item.sum}입니다.`).join(" "),
    meta: sourceMeta(3, "two-half-turn-related-additions", { operation: "rotate-half", items })
  };
}

function twoStepBoardProblem04(difficulty) {
  const values = shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const targetCount = difficulty <= 1 ? 4 : difficulty >= 3 ? 2 : 3;
  const targetIndices = new Set(shuffled(Array.from({ length: 9 }, (_, index) => index)).slice(0, targetCount));
  const cells = values.map((value, index) => ({
    value,
    orientation: targetIndices.has(index) ? 180 : sample([0, 90, 270])
  }));
  const uprightValues = cells.filter((cell) => (cell.orientation + 180) % 360 === 0).map((cell) => cell.value);
  const answer = uprightValues.reduce((sum, value) => sum + value, 0);
  return {
    prompt: "숫자판을 오른쪽으로 뒤집은 뒤 아래로 뒤집었을 때, 똑바로 놓이는 수들의 합을 구하세요.",
    visual: { kind: "book1", subtype: "two-step-number-board", cells, steps: ["오른쪽으로 뒤집기", "아래로 뒤집기"] },
    answer: String(answer),
    solution: `오른쪽 뒤집기와 아래 뒤집기를 이어 하면 판을 반 바퀴 돌린 것과 같습니다. 처음에 거꾸로 놓인 ${uprightValues.join(", ")}이 똑바로 서므로 ${uprightValues.join(" + ")} = ${answer}입니다.`,
    meta: sourceMeta(4, "three-by-three-board-right-then-down-flip-sum", { cells, netRotation: 180, uprightValues, answer })
  };
}

function frogPartitionProblem05() {
  const masks = sample(SOURCE_PARTITIONS);
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const symbols = Array(16).fill("");
    masks.forEach((mask) => {
      shuffled(cellsInMask(mask)).slice(0, 2).forEach((index) => { symbols[index] = "●"; });
    });
    const uniqueCount = balancedPartitionCount(symbols, 2);
    if (uniqueCount !== 1) continue;
    const labels = labelsForPartition(masks);
    const base = { kind: "book1", subtype: "partition-draw", rows: 4, columns: 4, pieceCount: 4, symbols };
    return {
      prompt: "개구리의 위치를 옮기지 않고, 각 조각에 개구리가 2마리씩 들어가도록 모양과 크기가 같은 네 조각으로 나누세요.",
      visual: base,
      answerVisual: { ...base, labels, showPieceFills: false },
      answer: "그림과 같이 네 조각으로 나눕니다.",
      responseKind: "drawing",
      solution: "먼저 개구리 2마리가 들어가는 네 칸짜리 조각 하나를 찾습니다. 같은 모양을 돌려 네 번 놓고, 각 조각의 칸 수와 개구리 수가 모두 같은지 확인합니다.",
      meta: sourceMeta(5, "frog-balanced-four-congruent-regions", { masks, labels, symbols, frogIndices: symbols.map((value, index) => value ? index : -1).filter((index) => index >= 0), uniqueCount })
    };
  }
  throw new Error("Could not create a unique frog partition board");
}

const diagonalMate = (index, diagonal) => {
  const row = Math.floor(index / 4);
  const column = index % 4;
  return diagonal === "main" ? column * 4 + row : (3 - column) * 4 + (3 - row);
};

function diagonalFoldItem(diagonal) {
  const numbers = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => randomInt(1, 9)));
  const candidates = Array.from({ length: 16 }, (_, index) => index).filter((index) => index !== diagonalMate(index, diagonal));
  const cutIndex = sample(candidates);
  const selected = [...new Set([cutIndex, diagonalMate(cutIndex, diagonal)])].sort((a, b) => a - b);
  const answer = selected.reduce((sum, index) => sum + numbers[Math.floor(index / 4)][index % 4], 0);
  return { diagonal, numbers, cutIndex, selected, answer };
}

function diagonalFoldProblem06() {
  const items = [diagonalFoldItem("main"), diagonalFoldItem("anti")];
  return {
    prompt: "색종이를 대각선으로 한 번 접어 색칠된 부분을 잘랐습니다. 잘려 나간 부분에 있는 수들의 합을 각각 구하세요.",
    visual: { kind: "book1", subtype: "diagonal-fold-set", items },
    answerVisual: { kind: "book1", subtype: "diagonal-fold-set", items, reveal: true },
    answer: items.map((item, index) => `(${index + 1}) ${item.answer}`).join("  "),
    responseKind: "visual-fill",
    solution: items.map((item, index) => {
      const values = item.selected.map((cell) => item.numbers[Math.floor(cell / 4)][cell % 4]);
      return `(${index + 1}) 대각선을 사이에 두고 겹치는 두 칸은 ${values.join("과 ")}이므로 합은 ${values.join(" + ")} = ${item.answer}입니다.`;
    }).join(" "),
    meta: sourceMeta(6, "two-diagonal-fold-number-grid-cut-sums", { items })
  };
}

function foldUnfoldProblem08() {
  const rotation = sample([0, 90, 180, 270]);
  const visual = { kind: "book1", subtype: "fold-unfold-draw", rotation, reveal: false };
  return {
    prompt: "색종이를 두 번 접어 색칠된 부분을 잘랐습니다. 접은 색종이를 모두 펼쳤을 때의 모양을 그리세요.",
    visual,
    answerVisual: { ...visual, reveal: true },
    answer: "네 변의 가운데에 같은 삼각형 모양이 하나씩 생깁니다.",
    responseKind: "drawing",
    solution: "나중에 접은 선부터 거꾸로 펼칩니다. 한 번 펼칠 때마다 자른 모양을 접은 선의 반대쪽 같은 거리에 옮겨 그리면, 네 변의 가운데에 같은 삼각형이 하나씩 생깁니다.",
    meta: sourceMeta(8, "two-fold-cut-unfold-four-symmetric-notches", { folds: ["horizontal", "vertical"], rotation, notchCount: 4, symmetricPairs: [[0, 2], [1, 3]] })
  };
}

function diagonalFoldProblem09() {
  const item = diagonalFoldItem(sample(["main", "anti"]));
  return {
    prompt: "수가 쓰인 색종이를 대각선으로 접어 색칠된 부분을 잘랐습니다. 잘려 나간 부분에 있는 수들의 합을 구하세요.",
    visual: { kind: "book1", subtype: "diagonal-fold-set", items: [item], compact: true },
    answer: String(item.answer),
    solution: `접은 대각선을 기준으로 색칠된 칸과 마주 겹치는 칸을 찾습니다. 두 칸의 수 ${item.selected.map((cell) => item.numbers[Math.floor(cell / 4)][cell % 4]).join(" + ")} = ${item.answer}입니다.`,
    meta: sourceMeta(9, "single-diagonal-fold-number-grid-cut-sum", { items: [item] })
  };
}

function foldPieceProblem10() {
  const folds = sample([["위쪽을 아래로", "왼쪽을 오른쪽으로"], ["아래쪽을 위로", "오른쪽을 왼쪽으로"]]);
  const triangleCount = 8;
  const diamondCount = 4;
  const base = { kind: "book1", subtype: "fold-piece-types", folds, triangleCount, diamondCount };
  return {
    prompt: "정사각형 색종이를 두 번 접어 접힌 종이에 그은 두 대각선을 따라 잘랐습니다. 펼친 뒤 생기는 삼각형과 마름모의 수를 각각 구하세요.",
    visual: base,
    answerVisual: { ...base, reveal: true },
    answer: `삼각형 ${triangleCount}개, 마름모 ${diamondCount}개`,
    responseKind: "visual-fill",
    solution: `두 번 접어 네 겹이 된 종이를 두 대각선으로 자릅니다. 펼치면 모서리 쪽 삼각형은 ${triangleCount}개, 가운데 둘레의 마름모는 ${diamondCount}개가 됩니다.`,
    meta: sourceMeta(10, "two-fold-x-cut-two-piece-types", { folds: 2, triangleCount, diamondCount })
  };
}

function foldPunchProblem11() {
  const fullPunchCopies = 4;
  const edgePunchCopies = 2;
  const total = fullPunchCopies + edgePunchCopies;
  const base = { kind: "book1", subtype: "fold-punch-total", fullPunchCopies, edgePunchCopies, total };
  return {
    prompt: "정사각형 색종이를 대각선으로 두 번 접은 뒤, 원 모양과 반원 모양으로 구멍을 뚫었습니다. 모두 펼치면 구멍은 몇 개인지 구하세요.",
    visual: base,
    answer: `${total}개`,
    solution: `종이 안쪽의 원 구멍은 두 번 펼치며 2배씩 늘어 ${fullPunchCopies}개가 됩니다. 접힌 변의 반원 구멍은 펼치면 원 구멍 ${edgePunchCopies}개가 됩니다. 모두 ${fullPunchCopies} + ${edgePunchCopies} = ${total}개입니다.`,
    meta: sourceMeta(11, "two-diagonal-fold-circle-and-edge-punch-total", { folds: 2, fullPunchCopies, edgePunchCopies, total })
  };
}

function crossMagicProblem12(difficulty) {
  const step = difficulty >= 3 ? 3 : difficulty <= 1 ? 1 : 2;
  const start = randomInt(1, Math.max(1, 10 - step * 4));
  const cards = Array.from({ length: 5 }, (_, index) => start + index * step);
  const centers = [cards[0], cards[2], cards[4]];
  const lineSums = centers.map((center, index) => center + (index === 0 ? cards[1] + cards[4] : index === 1 ? cards[0] + cards[4] : cards[0] + cards[3]));
  const makeVisual = (reveal = false) => ({
    kind: "book1",
    subtype: "unit-set",
    sharedCards: cards,
    items: centers.map((center, index) => ({
      label: `(${index + 1})`,
      visual: { kind: "book1", subtype: "line-card-board", layout: "cross", shown: [null, null, reveal ? center : null, null, null], lineSum: reveal ? lineSums[index] : null, cards: [], blankLabels: false }
    }))
  });
  return {
    prompt: "주어진 다섯 수를 한 번씩 써서 가로와 세로의 세 수 합이 같게 만들 때, 가운데 들어갈 수와 한 줄의 합을 세 가지 모두 구하세요.",
    visual: makeVisual(),
    answerVisual: makeVisual(true),
    answer: centers.map((center, index) => `가운데 ${center}, 합 ${lineSums[index]}`).join(" / "),
    responseKind: "visual-fill",
    solution: `가운데 수를 ${centers.join(", ")}로 정하면 나머지 네 수를 같은 합의 두 쌍으로 묶을 수 있습니다. 각 한 줄의 합은 차례로 ${lineSums.join(", ")}입니다.`,
    meta: sourceMeta(12, "three-cross-centers-and-line-sums", { cards, centers, lineSums })
  };
}

function flowerMagicProblem13(difficulty) {
  const step = difficulty >= 3 ? 2 : 1;
  const start = randomInt(1, Math.max(1, 12 - step * 6));
  const cards = Array.from({ length: 7 }, (_, index) => start + index * step);
  const centers = [cards[0], cards[3], cards[6]];
  const pairSums = [cards[1] + cards[6], cards[0] + cards[6], cards[0] + cards[5]];
  const lineSums = centers.map((center, index) => center + pairSums[index]);
  const makeVisual = (reveal = false) => ({
    kind: "book1",
    subtype: "unit-set",
    sharedCards: cards,
    items: centers.map((center, index) => ({
      label: `(${index + 1})`,
      visual: { kind: "book1", subtype: "line-card-board", layout: "source-flower", shown: [reveal ? center : null, null, null, null, null, null, null], lineSum: reveal ? lineSums[index] : null, cards: [], blankLabels: false }
    }))
  });
  return {
    prompt: "주어진 일곱 수를 한 번씩 써서 가운데를 지나는 세 줄의 합이 같게 만들 때, 가운데 들어갈 수와 한 줄의 합을 세 가지 모두 구하세요.",
    visual: makeVisual(),
    answerVisual: makeVisual(true),
    answer: centers.map((center, index) => `가운데 ${center}, 합 ${lineSums[index]}`).join(" / "),
    responseKind: "visual-fill",
    solution: `가운데 수를 ${centers.join(", ")}로 정하면 나머지 여섯 수를 합이 같은 세 쌍으로 묶을 수 있습니다. 한 줄의 합은 차례로 ${lineSums.join(", ")}입니다.`,
    meta: sourceMeta(13, "three-seven-card-centers-and-line-sums", { cards, centers, lineSums })
  };
}

const BORDER_BASE = Object.freeze([4, 5, 9, 2, 7, 3, 8, 6]);
const BORDER_LINES = Object.freeze([[0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 0]]);

function borderSolutionCount(cards, shown, target, stopAt = 2) {
  const blanks = shown.map((value, index) => value == null ? index : -1).filter((index) => index >= 0);
  const used = new Set(shown.filter((value) => value != null));
  const remaining = cards.filter((value) => !used.has(value));
  let count = 0;
  for (const candidate of permutations(remaining)) {
    const values = [...shown];
    blanks.forEach((index, order) => { values[index] = candidate[order]; });
    if (BORDER_LINES.every((line) => line.reduce((sum, index) => sum + values[index], 0) === target)) count += 1;
    if (count >= stopAt) break;
  }
  return count;
}

function borderMagicProblem14(difficulty) {
  const step = difficulty >= 3 ? 2 : 1;
  const start = randomInt(1, Math.max(1, 12 - step * 7));
  const cards = Array.from({ length: 8 }, (_, index) => start + index * step);
  const solution = BORDER_BASE.map((value) => start + (value - 2) * step);
  const lineSum = BORDER_LINES[0].reduce((sum, index) => sum + solution[index], 0);
  const clueOrder = shuffled(Array.from({ length: 8 }, (_, index) => index));
  const clues = clueOrder.slice(0, difficulty <= 1 ? 4 : 3);
  let shown = solution.map((value, index) => clues.includes(index) ? value : null);
  while (borderSolutionCount(cards, shown, lineSum) !== 1 && clues.length < 7) {
    clues.push(clueOrder[clues.length]);
    shown = solution.map((value, index) => clues.includes(index) ? value : null);
  }
  return {
    prompt: `주어진 여덟 수를 한 번씩 써서 위, 아래, 왼쪽, 오른쪽 세 수의 합이 모두 ${lineSum}이 되도록 빈칸을 채우세요.`,
    visual: { kind: "book1", subtype: "border-magic", cards, shown, lineSum },
    answerVisual: { kind: "book1", subtype: "border-magic", cards: [], shown: solution, lineSum },
    answer: solution.join(", "),
    responseKind: "visual-fill",
    solution: `각 줄에서 이미 보이는 수를 ${lineSum}에서 빼며 맞은편 줄도 함께 확인합니다. 위쪽 왼쪽부터 시계 방향으로 ${solution.join(", ")}입니다.`,
    meta: sourceMeta(14, "eight-card-border-four-equal-lines", { cards, solution, shown, clues, lineSum, uniqueCount: borderSolutionCount(cards, shown, lineSum) })
  };
}

const TRIANGLE_LINES = Object.freeze([[0, 1, 3], [0, 2, 5], [3, 4, 5]]);

function triangleSolutionCount(cards, shown, lineSum, stopAt = 2) {
  const blanks = shown.map((value, index) => value == null ? index : -1).filter((index) => index >= 0);
  const used = new Set(shown.filter((value) => value != null));
  const remaining = cards.filter((value) => !used.has(value));
  let count = 0;
  for (const candidate of permutations(remaining)) {
    const values = [...shown];
    blanks.forEach((index, order) => { values[index] = candidate[order]; });
    if (TRIANGLE_LINES.every((line) => line.reduce((sum, index) => sum + values[index], 0) === lineSum)) count += 1;
    if (count >= stopAt) break;
  }
  return count;
}

function triangleItem(cards, solution, lineSum, difficulty) {
  const order = shuffled(Array.from({ length: 6 }, (_, index) => index));
  const clues = order.slice(0, difficulty <= 1 ? 3 : 2);
  let shown = solution.map((value, index) => clues.includes(index) ? value : null);
  while (triangleSolutionCount(cards, shown, lineSum) !== 1 && clues.length < 5) {
    clues.push(order[clues.length]);
    shown = solution.map((value, index) => clues.includes(index) ? value : null);
  }
  return { cards, solution, lineSum, shown, clues, uniqueCount: triangleSolutionCount(cards, shown, lineSum) };
}

function triangleMagicProblem15(difficulty) {
  const shift = randomInt(0, difficulty >= 3 ? 3 : 2);
  const cards = Array.from({ length: 6 }, (_, index) => index + 3 + shift);
  const firstSolution = [3, 8, 7, 4, 6, 5].map((value) => value + shift);
  const secondSolution = [6, 5, 4, 7, 3, 8].map((value) => value + shift);
  const items = [
    triangleItem(cards, firstSolution, 15 + shift * 3, difficulty),
    triangleItem(cards, secondSolution, 18 + shift * 3, difficulty)
  ];
  const makeVisual = (answer = false) => ({
    kind: "book1",
    subtype: "unit-set",
    items: items.map((item, index) => ({ label: `(${index + 1}) 한 줄의 합 ${item.lineSum}`, visual: { kind: "book1", subtype: "triangle-magic", shown: answer ? item.solution : item.shown, lineSum: item.lineSum, cards: answer ? [] : item.cards } }))
  });
  return {
    prompt: "주어진 여섯 수를 한 번씩 써서 삼각형의 각 변에 놓인 세 수의 합이 제시된 수가 되도록 두 삼각형을 완성하세요.",
    visual: makeVisual(),
    answerVisual: makeVisual(true),
    answer: items.map((item, index) => `(${index + 1}) ${item.solution.join(", ")}`).join(" / "),
    responseKind: "visual-fill",
    solution: items.map((item, index) => `(${index + 1}) 꼭짓점의 수를 먼저 정하고 ${item.lineSum}에서 두 수를 빼 나머지 수를 찾으면 ${item.solution.join(", ")}입니다.`).join(" "),
    meta: sourceMeta(15, "two-six-card-triangle-edge-sums", { items })
  };
}

const IRREGULAR_MASK = Object.freeze([1, 1, 0, 1, 1, 1, 0, 1, 1]);
const IRREGULAR_ACTIVE = Object.freeze([0, 1, 3, 4, 5, 7, 8]);

function irregularSums(values) {
  return {
    rowSums: [values[0] + values[1], values[3] + values[4] + values[5], values[7] + values[8]],
    columnSums: [values[0] + values[3], values[1] + values[4] + values[7], values[5] + values[8]]
  };
}

function irregularSolutionCount(cards, shown, rowSums, columnSums, stopAt = 2) {
  const hidden = IRREGULAR_ACTIVE.filter((index) => shown[index] == null);
  const used = new Set(shown.filter((value) => value != null));
  const remaining = cards.filter((value) => !used.has(value));
  let count = 0;
  for (const candidate of permutations(remaining)) {
    const values = [...shown];
    hidden.forEach((index, order) => { values[index] = candidate[order]; });
    const sums = irregularSums(values);
    if (sums.rowSums.every((value, index) => value === rowSums[index]) && sums.columnSums.every((value, index) => value === columnSums[index])) count += 1;
    if (count >= stopAt) break;
  }
  return count;
}

function irregularGakuroProblem16() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const cards = shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 7).sort((a, b) => a - b);
    const placed = shuffled(cards);
    const solution = Array(9).fill(null);
    IRREGULAR_ACTIVE.forEach((index, order) => { solution[index] = placed[order]; });
    const { rowSums, columnSums } = irregularSums(solution);
    const clueOrder = shuffled(IRREGULAR_ACTIVE);
    const clues = [clueOrder[0]];
    let shown = solution.map((value, index) => clues.includes(index) ? value : null);
    while (irregularSolutionCount(cards, shown, rowSums, columnSums) !== 1 && clues.length < 6) {
      clues.push(clueOrder[clues.length]);
      shown = solution.map((value, index) => clues.includes(index) ? value : null);
    }
    const uniqueCount = irregularSolutionCount(cards, shown, rowSums, columnSums);
    if (uniqueCount !== 1 || clues.length > 3) continue;
    const base = { kind: "book1", subtype: "irregular-gakuro", cards, mask: IRREGULAR_MASK, shown, rowSums, columnSums };
    return {
      prompt: "주어진 일곱 수를 한 번씩 써서 각 가로줄과 세로줄의 합이 표의 왼쪽과 위쪽 수가 되도록 빈칸을 채우세요.",
      visual: base,
      answerVisual: { ...base, cards: [], shown: solution },
      answer: IRREGULAR_ACTIVE.map((index) => solution[index]).join(", "),
      responseKind: "visual-fill",
      solution: `두 칸짜리 줄부터 합에서 보이는 수를 빼고, 같은 칸이 만나는 다른 줄을 이어 확인합니다. 위쪽부터 ${IRREGULAR_ACTIVE.map((index) => solution[index]).join(", ")}입니다.`,
      meta: sourceMeta(16, "seven-card-irregular-row-column-sums", { cards, solution, shown, clues, rowSums, columnSums, mask: IRREGULAR_MASK, active: IRREGULAR_ACTIVE, uniqueCount })
    };
  }
  throw new Error("Could not create a unique irregular sum puzzle");
}

const RING_BASE = Object.freeze([4, 8, 2, 7, 5, 6, 3, 10, 1, 9]);
const RING_LINES = Object.freeze([[0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 8], [8, 9, 0]]);

function ringSolutionCount(shown, lineSum, stopAt = 2) {
  const blanks = shown.map((value, index) => value == null ? index : -1).filter((index) => index >= 0);
  const used = new Set(shown.filter((value) => value != null));
  const remaining = Array.from({ length: 10 }, (_, index) => index + 1).filter((value) => !used.has(value));
  let count = 0;
  for (const candidate of permutations(remaining)) {
    const values = [...shown];
    blanks.forEach((index, order) => { values[index] = candidate[order]; });
    if (RING_LINES.every((line) => line.reduce((sum, index) => sum + values[index], 0) === lineSum)) count += 1;
    if (count >= stopAt) break;
  }
  return count;
}

function ringProblem17(difficulty) {
  const shift = sample([0, 2, 4, 6, 8]);
  const reversed = Math.random() < 0.5;
  const solution = Array.from({ length: 10 }, (_, index) => RING_BASE[((reversed ? shift - index : shift + index) + 100) % 10]);
  const lineSum = RING_LINES[0].reduce((sum, index) => sum + solution[index], 0);
  const clueOrder = shuffled(Array.from({ length: 10 }, (_, index) => index));
  const clues = clueOrder.slice(0, difficulty <= 1 ? 5 : 4);
  let shown = solution.map((value, index) => clues.includes(index) ? value : null);
  while (ringSolutionCount(shown, lineSum) !== 1 && clues.length < 9) {
    clues.push(clueOrder[clues.length]);
    shown = solution.map((value, index) => clues.includes(index) ? value : null);
  }
  const base = { kind: "book1", subtype: "polygon-ring", cards: [1,2,3,4,5,6,7,8,9,10], shown, lineSum };
  return {
    prompt: `1부터 10까지의 수를 한 번씩 써서 오각형 둘레의 다섯 줄에 놓인 세 수의 합이 모두 ${lineSum}이 되도록 빈 원을 채우세요.`,
    visual: base,
    answerVisual: { ...base, cards: [], shown: solution },
    answer: solution.join(", "),
    responseKind: "visual-fill",
    solution: `한 줄의 합 ${lineSum}에서 이미 놓인 두 수를 빼며 이웃한 빈 원을 차례로 정합니다. 위에서 시계 방향으로 ${solution.join(", ")}입니다.`,
    meta: sourceMeta(17, "ten-card-pentagon-ring-five-equal-lines", { solution, shown, clues, lineSum, uniqueCount: ringSolutionCount(shown, lineSum) })
  };
}

function ellipseProblem18() {
  const cards = [1, 2, 3, 4, 5];
  const center = 5;
  const solution = [1, 2, center, 3, 4];
  return {
    prompt: "1부터 5까지의 수를 한 번씩 넣어, 직선 위 세 수의 합과 타원 둘레 네 수의 합이 모두 같게 만들 때 가운데 수를 구하세요.",
    visual: { kind: "book1", subtype: "ellipse-magic", cards, shown: [null, null, null, null, null] },
    answerVisual: { kind: "book1", subtype: "ellipse-magic", cards: [], shown: solution },
    answer: String(center),
    solution: `다섯 수의 합은 15입니다. 둘레 네 수의 합을 L, 가운데 수를 C라 하면 두 직선의 합을 더한 값은 L + 2C이고, 동시에 둘레 수는 한 번씩 더해져 L + 2C = 2L입니다. 따라서 L = 2C이고 15 = L + C = 3C이므로 C = 5입니다.`,
    meta: sourceMeta(18, "five-card-ellipse-center", { cards, solution, center, total: 15, outerSum: 10, lineSum: 10 })
  };
}

function twoDigitConditionProblem19() {
  const tens = randomInt(3, 7);
  const digitSum = randomInt(tens + 1, Math.min(14, tens + 8));
  const first = tens * 10 + (digitSum - tens);
  const second = (tens + 1) * 10 + (digitSum - tens - 1);
  const parity = sample([0, 1]);
  const answer = [first, second].find((value) => value % 2 === parity);
  const lower = tens * 10;
  const upper = (tens + 2) * 10;
  const candidates = Array.from({ length: upper - lower - 1 }, (_, index) => lower + index + 1)
    .filter((value) => Math.floor(value / 10) + value % 10 === digitSum && value % 2 === parity);
  return {
    prompt: "다음 조건에 맞는 두 자리 수를 구하세요.",
    visual: { kind: "book1", subtype: "condition-card", title: "수의 조건", clues: [`일의 자리 숫자와 십의 자리 숫자의 합은 ${digitSum}입니다.`, `${lower}보다 크고 ${upper}보다 작은 ${parity ? "홀수" : "짝수"}입니다.`] },
    answer: String(answer),
    solution: `자리 숫자의 합이 ${digitSum}인 수를 ${lower}와 ${upper} 사이에서 찾으면 ${first}, ${second}입니다. 이 중 ${parity ? "홀수" : "짝수"}는 ${answer} 하나입니다.`,
    meta: sourceMeta(19, "two-digit-range-digit-sum-and-parity", { lower, upper, digitSum, parity, candidates, answer })
  };
}

function twoDigitConditionProblem20() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const gap = randomInt(3, 5);
    const lower = sample([50, 60, 70]);
    const candidates = Array.from({ length: 99 - lower }, (_, index) => lower + index + 1)
      .filter((value) => value % 2 === 0 && Math.floor(value / 10) - value % 10 === gap);
    if (candidates.length !== 1) continue;
    const answer = candidates[0];
    return {
      prompt: "다음 조건에 맞는 두 자리 수를 구하세요.",
      visual: { kind: "book1", subtype: "condition-card", title: "수의 조건", clues: [`${lower}보다 큰 두 자리 짝수입니다.`, `십의 자리 숫자가 일의 자리 숫자보다 ${gap} 큽니다.`] },
      answer: String(answer),
      solution: `십의 자리와 일의 자리의 차가 ${gap}인 두 자리 수를 적고, ${lower}보다 큰 짝수만 남기면 ${answer} 하나입니다.`,
      meta: sourceMeta(20, "even-two-digit-tens-minus-ones", { lower, gap, candidates, answer })
    };
  }
  throw new Error("Could not create a unique two-digit condition problem");
}

function threeDigitConditionProblem21() {
  const answer = 876;
  const candidates = Array.from({ length: 900 }, (_, index) => index + 100).filter((value) => {
    const [hundreds, tens, ones] = String(value).split("").map(Number);
    const sum = hundreds + tens + ones;
    return hundreds - tens === 1 && tens - ones === 1 && sum > 20 && sum % 2 === 1;
  });
  return {
    prompt: "다음 조건에 맞는 세 자리 수를 구하세요.",
    visual: { kind: "book1", subtype: "condition-card", title: "자리의 조건", clues: ["321처럼 백의 자리에서 일의 자리로 갈수록 1씩 작아집니다.", "각 자리 숫자의 합은 20보다 큰 홀수입니다."], places: ["백", "십", "일"] },
    answer: String(answer),
    solution: "자리 숫자가 1씩 작아지는 수 중 합이 20보다 큰 것은 876과 987입니다. 8 + 7 + 6 = 21은 홀수이고, 9 + 8 + 7 = 24는 짝수이므로 답은 876입니다.",
    meta: sourceMeta(21, "descending-consecutive-three-digit-condition", { candidates, answer })
  };
}

function logicProblem22() {
  const names = shuffled(["민준", "연지", "루나"]);
  const items = shuffled(["감", "딸기", "참외"]);
  const solution = [items[2], items[1], items[0]];
  const clues = [`${names[0]}가 좋아하는 과일은 ${items[0]}이 아닙니다.`, `${names[1]}가 좋아하는 과일은 ${items[1]}입니다.`];
  return {
    prompt: "세 사람은 서로 다른 과일을 하나씩 좋아합니다. 조건을 보고 물음에 답하세요.",
    visual: { kind: "book1", subtype: "logic-clues", names, items, clues, question: `${names[2]}가 좋아하는 과일은 무엇인가요?` },
    answer: solution[2],
    solution: `${names[1]}은 ${items[1]}입니다. 남은 ${items[0]}과 ${items[2]} 중 ${names[0]}은 ${items[0]}이 아니므로 ${items[2]}이고, 따라서 ${names[2]}는 ${items[0]}입니다.`,
    meta: sourceMeta(22, "three-person-three-fruit-logic", { names, items, solution, clues, targetPerson: 2, answer: solution[2], uniqueCount: 1 })
  };
}

function logicProblem24() {
  const jobs = shuffled(["의사", "소방관", "선생님"]);
  const places = shuffled(["병원", "소방서", "학교"]);
  const solution = [places[1], places[2], places[0]];
  const clues = [`${jobs[1]}은 ${places[2]}에 있습니다.`, `${jobs[2]}은 ${places[1]}에 있지 않습니다.`];
  return {
    prompt: "세 사람은 서로 다른 장소에 있습니다. 조건을 보고 물음에 답하세요.",
    visual: { kind: "book1", subtype: "logic-clues", names: jobs, items: places, clues, question: `${places[1]}에 있는 사람은 누구인가요?` },
    answer: jobs[0],
    solution: `${jobs[1]}의 장소 ${places[2]}을 먼저 잇습니다. 남은 ${places[0]}과 ${places[1]} 중 ${jobs[2]}은 ${places[1]}이 아니므로 ${places[0]}이고, ${places[1]}에는 ${jobs[0]}가 있습니다.`,
    meta: sourceMeta(24, "three-job-three-place-logic", { jobs, places, solution, clues, targetPlace: 1, answer: jobs[0], uniqueCount: 1 })
  };
}

function heightOrderProblem25() {
  const names = shuffled(["민우", "은율", "예서", "수민"]);
  const order = [names[3], names[2], names[1], names[0]];
  const clues = [`${names[0]}는 ${names[1]}보다 작습니다.`, `${names[2]}는 ${names[3]}보다 작고 ${names[1]}보다 큽니다.`, `${names[3]}이 가장 큽니다.`];
  return {
    prompt: "네 사람의 키를 비교한 조건입니다. 키가 세 번째로 큰 사람을 구하세요.",
    visual: { kind: "book1", subtype: "height-order", names, clues, order: [null, null, null, null] },
    answerVisual: { kind: "book1", subtype: "height-order", names, clues, order },
    answer: names[1],
    solution: `${names[3]}이 가장 크고, ${names[3]} > ${names[2]} > ${names[1]} > ${names[0]} 순서입니다. 따라서 세 번째로 큰 사람은 ${names[1]}입니다.`,
    meta: sourceMeta(25, "four-person-height-third-tallest", { names, clues, order, targetRank: 3, answer: names[1], uniqueCount: 1 })
  };
}

const SOURCE_GENERATORS = Object.freeze({
  1: partitionProblem01,
  2: digitalMirrorProblem02,
  3: digitalAdditionProblem03,
  4: twoStepBoardProblem04,
  5: frogPartitionProblem05,
  6: diagonalFoldProblem06,
  8: foldUnfoldProblem08,
  9: diagonalFoldProblem09,
  10: foldPieceProblem10,
  11: foldPunchProblem11,
  12: crossMagicProblem12,
  13: flowerMagicProblem13,
  14: borderMagicProblem14,
  15: triangleMagicProblem15,
  16: irregularGakuroProblem16,
  17: ringProblem17,
  18: ellipseProblem18,
  19: twoDigitConditionProblem19,
  20: twoDigitConditionProblem20,
  21: threeDigitConditionProblem21,
  22: logicProblem22,
  24: logicProblem24,
  25: heightOrderProblem25
});

export function book01UnitTestProblem({ difficulty = 2, sourceCase } = {}) {
  const number = Number(sourceCase?.number);
  if (sourceCase?.sourceKind !== "unit-test" || sourceCase?.sourceId !== "book-01" || !SOURCE_QUESTIONS.has(number)) return null;
  return SOURCE_GENERATORS[number](difficulty);
}
