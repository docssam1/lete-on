// 더클래식 1과정 9권 전용 생성기.
// 도형 분할은 채점 가능한 선택형으로 바꾸되 원본의 합동·표식·합 조건을 유지한다.

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];
const sum = (items) => items.reduce((total, value) => total + value, 0);
const labels = ["①", "②", "③", "④", "⑤"];

function hasBatchim(value) {
  const code = String(value).charCodeAt(String(value).length - 1) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0;
}

const subject = (value) => `${value}${hasBatchim(value) ? "이" : "가"}`;
const topic = (value) => `${value}${hasBatchim(value) ? "은" : "는"}`;
const and = (value) => `${value}${hasBatchim(value) ? "과" : "와"}`;

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = randomInt(0, index);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function permutations(items) {
  if (items.length <= 1) return [items.slice()];
  const result = [];
  items.forEach((value, index) => {
    const rest = items.slice(0, index).concat(items.slice(index + 1));
    permutations(rest).forEach((tail) => result.push([value, ...tail]));
  });
  return result;
}

function book9Problem({ prompt, subtype, visual = {}, answer, solution, family, meta = {}, answerVisual = null, responseKind }) {
  return {
    prompt,
    visual: { kind: "book9", subtype, ...visual },
    ...(answerVisual ? { answerVisual: { kind: "book9", subtype, ...answerVisual } } : {}),
    answer: String(answer),
    solution,
    ...(responseKind ? { responseKind } : {}),
    meta: { family, answer, ...meta }
  };
}

const blockPartition = Object.freeze([
  0, 0, 1, 1,
  0, 0, 1, 1,
  2, 2, 3, 3,
  2, 2, 3, 3
]);

function mutatePartition(groups, seed) {
  const variants = [
    [0, 1], [5, 2], [10, 1], [15, 2], [3, 0], [12, 3]
  ];
  const [index, replacement] = variants[seed % variants.length];
  const result = [...groups];
  result[index] = replacement;
  return result;
}

function optionSet(correct, extras = {}) {
  const candidates = [
    { groups: correct, correct: true },
    { groups: mutatePartition(correct, 0), correct: false },
    { groups: mutatePartition(correct, 1), correct: false },
    { groups: mutatePartition(correct, 2), correct: false }
  ].map((candidate) => ({ ...candidate, ...extras }));
  const options = shuffle(candidates);
  const correctIndex = options.findIndex((candidate) => candidate.correct);
  return { options, correctIndex, answer: labels[correctIndex] };
}

function latinSquareCongruentPartitionBook9({ difficulty = 2 }) {
  const base = [
    1, 2, 3, 4,
    3, 4, 1, 2,
    2, 1, 4, 3,
    4, 3, 2, 1
  ];
  const shift = randomInt(0, 3);
  const values = base.map((value) => ((value + shift - 1) % 4) + 1);
  const choice = optionSet(blockPartition);
  return book9Problem({
    prompt: "각 조각에 1, 2, 3, 4가 하나씩 들어가도록 모양과 크기가 같은 네 조각으로 바르게 나눈 것을 고르세요.",
    subtype: "partition-choice", visual: { rows: 4, cols: 4, values, options: choice.options },
    answer: choice.answer,
    solution: `${choice.answer}은 네 조각의 모양과 크기가 같고, 각 조각에 1부터 4까지가 한 번씩 들어갑니다.`,
    family: "latin-partition-b9", meta: { difficulty, rows: 4, cols: 4, values, correctGroups: [...blockPartition], options: choice.options, correctIndex: choice.correctIndex }
  });
}

function equalSumCongruentPartitionBook9({ difficulty = 2 }) {
  const target = randomInt(difficulty === 1 ? 12 : 18, difficulty === 3 ? 40 : 30);
  const values = [];
  for (let piece = 0; piece < 4; piece += 1) {
    const a = randomInt(1, Math.floor(target / 4));
    const b = randomInt(1, Math.floor(target / 4));
    const c = randomInt(1, Math.floor(target / 4));
    const d = target - a - b - c;
    if (d < 1) return equalSumCongruentPartitionBook9({ difficulty });
    values.push(a, b, c, d);
  }
  const board = [values[0], values[1], values[4], values[5], values[2], values[3], values[6], values[7], values[8], values[9], values[12], values[13], values[10], values[11], values[14], values[15]];
  const choice = optionSet(blockPartition);
  return book9Problem({
    prompt: "모양과 크기가 같은 네 조각에 들어 있는 수의 합도 모두 같도록 바르게 나눈 것을 고르세요.",
    subtype: "partition-choice", visual: { rows: 4, cols: 4, values: board, options: choice.options },
    answer: choice.answer,
    solution: `${choice.answer}은 네 조각이 모두 2×2 모양이고, 각 조각의 수의 합이 ${target}으로 같습니다.`,
    family: "equal-sum-partition-b9", meta: { difficulty, target, values: board, correctGroups: [...blockPartition], options: choice.options, correctIndex: choice.correctIndex }
  });
}

function markerPartitionProblem(difficulty, icon, family) {
  const relativeCell = sample([0, 1, 4, 5]);
  const markerCells = [relativeCell, relativeCell + 2, relativeCell + 8, relativeCell + 10];
  const choice = optionSet(blockPartition);
  return book9Problem({
    prompt: `${icon}이 각 조각에 하나씩 같은 위치에 들어가도록 모양과 크기가 같은 네 조각으로 바르게 나눈 것을 고르세요.`,
    subtype: "partition-choice", visual: { rows: 4, cols: 4, markers: markerCells, markerIcon: icon, options: choice.options },
    answer: choice.answer,
    solution: `${choice.answer}은 네 조각을 돌려 겹쳤을 때 모양과 ${icon}의 위치가 모두 같습니다.`,
    family, meta: { difficulty, markerCells, correctGroups: [...blockPartition], options: choice.options, correctIndex: choice.correctIndex }
  });
}

function landmarkCongruentPartitionBook9({ difficulty = 2 }) {
  return markerPartitionProblem(difficulty, sample(["★", "●", "나무"]), "landmark-partition-b9");
}

function congruentCompositePartitionBook9({ difficulty = 2 }) {
  const choice = optionSet(blockPartition);
  return book9Problem({
    prompt: "점선을 따라 모양과 크기가 같은 네 조각으로 바르게 나눈 것을 고르세요.",
    subtype: "partition-choice", visual: { rows: 4, cols: 4, options: choice.options },
    answer: choice.answer,
    solution: `${choice.answer}의 네 조각은 돌리거나 뒤집으면 모두 포개집니다.`,
    family: "congruent-partition-b9", meta: { difficulty, correctGroups: [...blockPartition], options: choice.options, correctIndex: choice.correctIndex }
  });
}

function triangleEqualSubdivisionBook9({ difficulty = 2 }) {
  const count = sample(difficulty === 1 ? [4] : difficulty === 2 ? [4, 9] : [9, 16]);
  const hidden = randomInt(1, Math.max(1, Math.floor(count / 3)));
  const result = count - hidden;
  return book9Problem({
    prompt: `정삼각형을 모양과 크기가 같은 ${count}조각으로 나누었습니다. 색칠한 ${hidden}조각을 제외하면 몇 조각인가요?`,
    subtype: "polygon-subdivision", visual: { shape: "triangle", count, shaded: hidden },
    answer: `${result}조각`, solution: `전체 ${count}조각에서 색칠한 ${hidden}조각을 빼면 ${result}조각입니다.`,
    family: "triangle-subdivision-b9", meta: { difficulty, count, hidden, result }
  });
}

function hexagonEqualSubdivisionBook9({ difficulty = 2 }) {
  const count = sample(difficulty === 1 ? [6] : [6, 12]);
  const marked = sample([1, 2, 3]);
  const result = count - marked;
  return book9Problem({
    prompt: `정육각형을 모양과 크기가 같은 ${count}조각으로 나누었습니다. 표시된 ${marked}조각을 제외한 조각 수를 구하세요.`,
    subtype: "polygon-subdivision", visual: { shape: "hexagon", count, shaded: marked },
    answer: `${result}조각`, solution: `${count}-${marked}=${result}이므로 ${result}조각입니다.`,
    family: "hexagon-subdivision-b9", meta: { difficulty, count, marked, result }
  });
}

const TETROMINO_COVER_TEMPLATES = Object.freeze({
  1: Object.freeze({
    rows: 4, cols: 4,
    blocked: [1, 2, 10, 15],
    tiling: [[12, 13, 14, 9], [0, 4, 8, 5], [3, 7, 11, 6]]
  }),
  2: Object.freeze({
    // 교사용 27쪽의 5×6 모눈과 같은 나무 배치·T 블록 여섯 개 구조다.
    rows: 6, cols: 5,
    blocked: [11, 13, 15, 19, 24, 25],
    tiling: [[0, 5, 10, 6], [1, 2, 3, 7], [4, 9, 14, 8], [27, 28, 29, 23], [16, 17, 18, 12], [20, 21, 22, 26]]
  }),
  3: Object.freeze({
    rows: 6, cols: 6,
    blocked: [3, 5, 8, 15, 17, 29, 30, 35],
    tiling: [[19, 25, 31, 24], [16, 22, 28, 23], [9, 10, 11, 4], [0, 1, 2, 7], [14, 20, 26, 21], [32, 33, 34, 27], [6, 12, 18, 13]]
  })
});

function transformedTetrominoTemplate(difficulty) {
  const base = TETROMINO_COVER_TEMPLATES[difficulty] || TETROMINO_COVER_TEMPLATES[2];
  const flipHorizontal = sample([false, true]);
  const flipVertical = sample([false, true]);
  const transform = (index) => {
    const row = Math.floor(index / base.cols);
    const column = index % base.cols;
    const nextRow = flipVertical ? base.rows - 1 - row : row;
    const nextColumn = flipHorizontal ? base.cols - 1 - column : column;
    return nextRow * base.cols + nextColumn;
  };
  return {
    rows: base.rows,
    cols: base.cols,
    blocked: base.blocked.map(transform).sort((a, b) => a - b),
    tiling: base.tiling.map((piece) => piece.map(transform).sort((a, b) => a - b))
  };
}

function tetrominoCoverCountBook9({ difficulty = 2 }) {
  const { rows, cols, blocked, tiling } = transformedTetrominoTemplate(difficulty);
  const total = rows * cols;
  const blockedCount = blocked.length;
  const usable = total - blockedCount;
  const result = tiling.length;
  return book9Problem({
    prompt: "그림의 나무가 있는 칸을 제외한 나머지 부분을 옆의 T 모양 네 칸 블록으로 빈틈없이 채우려고 합니다. 블록이 몇 개 필요한가요?",
    subtype: "cell-board", visual: { rows, cols, blocked, blockedIcon: "나무", piece: "t" },
    answer: `${result}개`, solution: `전체 ${total}칸에서 나무 ${blockedCount}칸을 빼면 ${usable}칸입니다. 블록 하나는 4칸이므로 ${usable}÷4=${result}개입니다.`,
    family: "tetromino-cover-b9", meta: { difficulty, rows, cols, total, blocked, blockedCount, usable, tiling, result }
  });
}

function polygonArea(points) {
  let twice = 0;
  for (let index = 0; index < points.length; index += 1) {
    const [x1, y1] = points[index];
    const [x2, y2] = points[(index + 1) % points.length];
    twice += x1 * y2 - x2 * y1;
  }
  return Math.abs(twice) / 2;
}

function quadrilateralGridAreaBook9({ difficulty = 2 }) {
  const width = randomInt(3, difficulty === 3 ? 7 : 5);
  const height = randomInt(2, difficulty === 3 ? 6 : 4);
  const leftInset = randomInt(0, Math.min(2, width - 2));
  let rightInset = randomInt(0, Math.min(2, width - leftInset - 1));
  if (leftInset === rightInset) rightInset = (rightInset + 1) % Math.min(3, width - leftInset);
  const points = [[1, 1], [1 + width, 1], [1 + width - rightInset, 1 + height], [1 + leftInset, 1 + height]];
  const result = polygonArea(points);
  return book9Problem({
    prompt: "한 칸의 넓이가 1㎠인 모눈 위 사각형의 넓이를 구하세요.",
    subtype: "area-grid", visual: { gridWidth: width + 3, gridHeight: height + 2, points, shaded: true },
    answer: `${result}㎠`, solution: `모눈의 온칸과 반칸을 짝지어 세면 넓이는 ${result}㎠입니다.`,
    family: "quadrilateral-area-b9", meta: { difficulty, points, width, height, leftInset, rightInset, result }
  });
}

function shadedCompositeGridAreaBook9({ difficulty = 2 }) {
  const width = randomInt(4, difficulty === 3 ? 8 : 6);
  const height = randomInt(3, difficulty === 3 ? 7 : 5);
  const cutWidth = randomInt(1, width - 2);
  const cutHeight = randomInt(1, height - 1);
  const result = width * height - cutWidth * cutHeight;
  const points = [[0,0],[width,0],[width,height],[cutWidth,height],[cutWidth,height-cutHeight],[0,height-cutHeight]];
  return book9Problem({
    prompt: "한 칸의 넓이가 1㎠인 모눈에서 색칠한 ㄱ자 도형의 넓이를 구하세요.",
    subtype: "area-grid", visual: { gridWidth: width + 1, gridHeight: height + 1, points, shaded: true },
    answer: `${result}㎠`, solution: `큰 직사각형 ${width}×${height}=${width * height}에서 빈 직사각형 ${cutWidth}×${cutHeight}=${cutWidth * cutHeight}를 빼면 ${result}㎠입니다.`,
    family: "composite-area-b9", meta: { difficulty, points, width, height, cutWidth, cutHeight, result }
  });
}

function parallelogramGridAreaBook9({ difficulty = 2 }) {
  const width = randomInt(3, difficulty === 3 ? 7 : 5);
  const height = randomInt(2, difficulty === 3 ? 6 : 4);
  const slant = randomInt(1, Math.min(2, width - 1));
  const offset = slant + 1;
  const points = [[offset, 1], [offset + width, 1], [1 + width, 1 + height], [1, 1 + height]];
  const result = polygonArea(points);
  return book9Problem({
    prompt: "한 칸의 넓이가 1㎠인 모눈 위 평행사변형의 넓이를 구하세요.",
    subtype: "area-grid", visual: { gridWidth: width + slant + 2, gridHeight: height + 2, points, shaded: true },
    answer: `${result}㎠`, solution: `밑변은 ${width}cm, 높이는 ${height}cm이므로 넓이는 ${width}×${height}=${result}㎠입니다.`,
    family: "parallelogram-area-b9", meta: { difficulty, points, width, height, slant, result }
  });
}

function randomHeightMap(difficulty) {
  const size = difficulty === 1 ? 2 : 3;
  const maxHeight = difficulty === 3 ? 4 : 3;
  const map = Array.from({ length: size }, () => Array.from({ length: size }, () => randomInt(0, maxHeight)));
  if (!map.flat().some(Boolean)) map[0][0] = 1;
  return map;
}

const mapTotal = (map) => sum(map.flat());
const frontProfile = (map) => map[0].map((_, column) => Math.max(...map.map((row) => row[column])));
const sideProfile = (map) => map.map((row) => Math.max(...row)).reverse();
const topFootprint = (map) => map.map((row) => row.map((value) => value > 0 ? 1 : 0));

function cubeSolidToViewsBook9({ difficulty = 2 }) {
  const map = randomHeightMap(difficulty);
  const front = frontProfile(map);
  const side = sideProfile(map);
  const profileRows = Math.max(...front, ...side);
  const answer = `앞 ${front.join("-")} / 옆 ${side.join("-")}`;
  return book9Problem({
    prompt: "쌓기나무 모양을 앞과 오른쪽 옆에서 본 모양을 빈 모눈에 각각 그리세요.",
    subtype: "cube-solid-views", visual: { map, blankProfiles: { frontColumns: front.length, sideColumns: side.length, rows: profileRows } },
    answer, solution: `앞에서는 같은 세로줄의 가장 높은 수를 보아 ${front.join(", ")}층, 옆에서는 ${side.join(", ")}층입니다.`,
    answerVisual: { map, front, side }, responseKind: "drawing",
    family: "cube-solid-views-b9", meta: { difficulty, map, front, side, profileRows, total: mapTotal(map) }
  });
}

function cubeLayerViewsBook9({ difficulty = 2 }) {
  let map = randomHeightMap(difficulty);
  if (difficulty === 1) map = map.map((row) => row.map((value) => Math.min(value, 2)));
  if (difficulty === 3 && Math.max(...map.flat()) < 4) return cubeLayerViewsBook9({ difficulty });
  const maxHeight = Math.max(...map.flat());
  const layers = Array.from({ length: maxHeight }, (_, layer) => map.map((row) => row.map((value) => value > layer ? 1 : 0)));
  const front = frontProfile(map);
  const side = sideProfile(map);
  const profileRows = Math.max(...front, ...side);
  const answer = `앞 ${front.join("-")} / 옆 ${side.join("-")}`;
  return book9Problem({
    prompt: "각 층을 위에서 본 모양을 보고, 앞과 오른쪽 옆에서 본 모양을 빈 모눈에 각각 그리세요.",
    subtype: "cube-layers", visual: { layers, blankProfiles: { frontColumns: front.length, sideColumns: side.length, rows: profileRows } }, answer,
    solution: `각 위치에서 칠해진 가장 높은 층을 합치면 앞은 ${front.join(", ")}층, 옆은 ${side.join(", ")}층입니다.`,
    answerVisual: { layers, front, side }, responseKind: "drawing",
    family: "cube-layer-views-b9", meta: { difficulty, map, layers, front, side, profileRows }
  });
}

function cubeShellInteriorBook9({ difficulty = 2 }) {
  const width = randomInt(3, difficulty === 3 ? 7 : 5);
  const depth = randomInt(3, difficulty === 3 ? 7 : 5);
  const height = randomInt(3, difficulty === 3 ? 7 : 5);
  const result = (width - 2) * (depth - 2) * (height - 2);
  return book9Problem({
    prompt: `가로 ${width}개, 세로 ${depth}개, 높이 ${height}개로 가득 쌓은 직육면체에서 바닥을 포함한 겉면의 쌓기나무를 모두 걷어 냈습니다. 안쪽에 몇 개가 남나요?`,
    subtype: "cube-box", visual: { width, depth, height, shell: true }, answer: `${result}개`,
    solution: `안쪽은 가로 ${width - 2}개, 세로 ${depth - 2}개, 높이 ${height - 2}개이므로 (${width - 2})×(${depth - 2})×(${height - 2})=${result}개입니다.`,
    family: "cube-shell-b9", meta: { difficulty, width, depth, height, result }
  });
}

function cubeViewModelChoiceBook9({ difficulty = 2 }) {
  const target = randomHeightMap(Math.max(2, difficulty));
  const targetSignature = JSON.stringify([topFootprint(target), frontProfile(target), sideProfile(target)]);
  const options = [{ map: target, correct: true }];
  for (let attempt = 0; options.length < 4 && attempt < 200; attempt += 1) {
    const candidate = target.map((row) => [...row]);
    const row = randomInt(0, candidate.length - 1);
    const column = randomInt(0, candidate[0].length - 1);
    candidate[row][column] = Math.max(0, candidate[row][column] + sample([-1, 1]));
    const signature = JSON.stringify([topFootprint(candidate), frontProfile(candidate), sideProfile(candidate)]);
    if (mapTotal(candidate) && signature !== targetSignature && !options.some((option) => JSON.stringify(option.map) === JSON.stringify(candidate))) options.push({ map: candidate, correct: false });
  }
  if (options.length < 4) return cubeViewModelChoiceBook9({ difficulty });
  const shuffled = shuffle(options);
  const correctIndex = shuffled.findIndex((option) => option.correct);
  return book9Problem({
    prompt: "위·앞·오른쪽 옆에서 본 모양과 모두 맞는 쌓기나무를 고르세요.",
    subtype: "cube-model-choice", visual: { top: topFootprint(target), front: frontProfile(target), side: sideProfile(target), options: shuffled },
    answer: labels[correctIndex], solution: `${labels[correctIndex]}만 위의 바탕그림과 앞·옆의 최고 층수가 모두 같습니다.`,
    family: "cube-model-choice-b9", meta: { difficulty, target, options: shuffled, correctIndex, targetSignature }
  });
}

const LO_SHU = Object.freeze([[8,1,6],[3,5,7],[4,9,2]]);
const MAGIC_FOUR = Object.freeze([[16,2,3,13],[5,11,10,8],[9,7,6,12],[4,14,15,1]]);

function affineMatrix(matrix, start, step) {
  return matrix.map((row) => row.map((value) => start + (value - 1) * step));
}

function rowsAndColumnsEqual(flat, size) {
  const rows = Array.from({ length: size }, (_, row) => sum(flat.slice(row * size, row * size + size)));
  const columns = Array.from({ length: size }, (_, column) => sum(Array.from({ length: size }, (_, row) => flat[row * size + column])));
  return [...rows, ...columns].every((value) => value === rows[0]);
}

function magicSquareSwapPairBook9({ difficulty = 2 }) {
  const start = randomInt(1, 5);
  const step = randomInt(1, difficulty === 3 ? 4 : 2);
  const solution = affineMatrix(LO_SHU, start, step).flat();
  const pairs = shuffle(Array.from({ length: 9 }, (_, first) => Array.from({ length: 9 - first - 1 }, (_, offset) => [first, first + offset + 1])).flat());
  for (const [first, second] of pairs) {
    const shown = [...solution];
    [shown[first], shown[second]] = [shown[second], shown[first]];
    const repairs = [];
    for (let a = 0; a < 9; a += 1) for (let b = a + 1; b < 9; b += 1) {
      const candidate = [...shown];
      [candidate[a], candidate[b]] = [candidate[b], candidate[a]];
      if (rowsAndColumnsEqual(candidate, 3)) repairs.push([a, b]);
    }
    if (repairs.length !== 1) continue;
    const result = shown[first] + shown[second];
    return book9Problem({
      prompt: "두 수의 위치를 한 번 바꾸어 모든 가로줄과 세로줄의 합을 같게 만들려고 합니다. 바꿀 두 수의 합을 구하세요.",
      subtype: "magic-grid", visual: { size: 3, shown }, answer: result,
      solution: `${shown[first]}과 ${shown[second]}의 위치를 바꾸면 각 줄의 합이 같아지므로 두 수의 합은 ${result}입니다.`,
      family: "magic-swap-b9", meta: { difficulty, start, step, solution, shown, swapped: [first, second], repairs, result }
    });
  }
  return magicSquareSwapPairBook9({ difficulty });
}

function magicSquareFourPairSumBook9({ difficulty = 2 }) {
  const start = randomInt(1, 5);
  const step = randomInt(1, difficulty === 3 ? 3 : 2);
  const solution = affineMatrix(MAGIC_FOUR, start, step);
  const row = randomInt(0, 3);
  const columns = shuffle([0,1,2,3]).slice(0, 2).sort();
  const labelsByColumn = { [columns[0]]: "A", [columns[1]]: "B" };
  const shown = solution.flat().map((value, index) => Math.floor(index / 4) === row && labelsByColumn[index % 4] ? labelsByColumn[index % 4] : value);
  const result = solution[row][columns[0]] + solution[row][columns[1]];
  const lineSum = sum(solution[row]);
  return book9Problem({
    prompt: "가로, 세로, 대각선의 네 수의 합이 모두 같을 때 A와 B에 들어갈 두 수의 합을 구하세요.",
    subtype: "magic-grid", visual: { size: 4, shown, lineSum }, answer: result,
    solution: `한 줄의 합 ${lineSum}에서 같은 줄에 보이는 두 수를 빼면 A+B=${result}입니다.`,
    family: "magic-four-pair-b9", meta: { difficulty, start, step, solution, row, columns, lineSum, result }
  });
}

const triangleLayoutCache = new Map();
function triangleLines(size) {
  return size === 6 ? [[0,1,2],[2,3,4],[4,5,0]] : [[0,1,2,3],[3,4,5,6],[6,7,8,0]];
}
function triangleLayouts(size) {
  if (triangleLayoutCache.has(size)) return triangleLayoutCache.get(size);
  const lines = triangleLines(size);
  const layouts = permutations(Array.from({ length: size }, (_, index) => index + 1)).map((values) => ({ values, lineSum: sum(lines[0].map((index) => values[index])) })).filter((item) => lines.every((line) => sum(line.map((index) => item.values[index])) === item.lineSum));
  triangleLayoutCache.set(size, layouts);
  return layouts;
}

function triangleExtremeProblem(size, difficulty) {
  const layouts = triangleLayouts(size);
  const wantMax = difficulty === 3 ? Math.random() < 0.65 : Math.random() < 0.5;
  const extreme = wantMax ? Math.max(...layouts.map((item) => item.lineSum)) : Math.min(...layouts.map((item) => item.lineSum));
  const candidates = layouts.filter((item) => item.lineSum === extreme);
  const solution = sample(candidates);
  return book9Problem({
    prompt: `1부터 ${size}까지의 수를 한 번씩 넣어 삼각형 세 변의 합을 같게 만들 때, 한 변의 합이 가장 ${wantMax ? "크게" : "작게"} 되는 값을 구하세요.`,
    subtype: "triangle-sum", visual: { size, shown: Array(size).fill(null), cards: Array.from({ length: size }, (_, index) => index + 1) },
    answer: extreme, solution: `꼭짓점의 수를 ${wantMax ? "크게" : "작게"} 배치해 세 변의 합을 맞추면 한 변의 합은 ${extreme}입니다.`,
    answerVisual: { size, shown: solution.values, cards: [], lineSum: extreme }, responseKind: "drawing",
    family: `triangle-extreme-${size}-b9`, meta: { difficulty, size, wantMax, extreme, solution: solution.values, candidateCount: candidates.length }
  });
}

function triangleEdgeExtremeSixBook9({ difficulty = 2 }) { return triangleExtremeProblem(6, difficulty); }
function triangleEdgeExtremeNineBook9({ difficulty = 2 }) { return triangleExtremeProblem(9, difficulty); }

const HEPTAGON_BASE = Object.freeze([1,14,4,13,2,12,5,8,6,10,3,9,7,11]);
function heptagonRingEqualSumBook9({ difficulty = 2 }) {
  const start = randomInt(1, difficulty === 3 ? 6 : 3);
  const step = randomInt(1, difficulty === 3 ? 3 : 2);
  const solution = HEPTAGON_BASE.map((value) => start + (value - 1) * step);
  const turn = randomInt(0, 6) * 2;
  const rotated = solution.map((_, index) => solution[(index + turn) % 14]);
  const lineSum = 3 * start + 16 * step;
  const clueCount = difficulty === 1 ? 9 : difficulty === 2 ? 7 : 5;
  const clueIndices = shuffle(Array.from({ length: 14 }, (_, index) => index)).slice(0, clueCount);
  const shown = rotated.map((value, index) => clueIndices.includes(index) ? value : null);
  return book9Problem({
    prompt: "주어진 열네 수를 한 번씩 사용하여 칠각형의 일곱 줄에 놓인 세 수의 합이 모두 같도록 빈 원을 채우고 한 줄의 합을 구하세요.",
    subtype: "polygon-ring", visual: { sides: 7, shown, cards: rotated.slice().sort((a,b)=>a-b), lineSum: null }, answer: lineSum,
    solution: `꼭짓점 사이의 수를 차례로 맞추면 모든 줄의 합은 ${lineSum}입니다.`,
    answerVisual: { sides: 7, shown: rotated, cards: [], lineSum }, responseKind: "drawing",
    family: "heptagon-ring-b9", meta: { difficulty, start, step, solution: rotated, clueIndices, lineSum }
  });
}

function overlapRegionEqualSumBook9({ difficulty = 2 }) {
  const values = shuffle(Array.from({ length: 5 }, (_, index) => index + randomInt(1, difficulty === 3 ? 8 : 4)));
  const left = values[0] + values[1] + values[2];
  const rightKnown = values[3];
  const result = left - rightKnown - values[2];
  if (result < 1 || result === rightKnown) return overlapRegionEqualSumBook9({ difficulty });
  return book9Problem({
    prompt: "겹친 두 원 안에 있는 수의 합이 같을 때 ㉠에 들어갈 수를 구하세요.",
    subtype: "overlap-regions", visual: { left: [values[0], values[1]], overlap: values[2], right: [rightKnown, "㉠"] }, answer: result,
    solution: `겹친 수는 양쪽에 함께 있으므로 ${values[0]}+${values[1]}-${rightKnown}=${result}입니다.`,
    family: "overlap-regions-b9", meta: { difficulty, leftValues: [values[0], values[1]], overlap: values[2], rightKnown, result }
  });
}

function gridLineSumMinimumBook9({ difficulty = 2 }) {
  const cards = shuffle([1,2,3,4,5]);
  const a = cards[0], b = cards[1], c = cards[2], d = cards[3], e = cards[4];
  const rowSum = a + b + c;
  const columnSum = b + d + e;
  const candidates = permutations([1,2,3,4,5]).filter((p) => p[0] + p[1] + p[2] === rowSum && p[1] + p[3] + p[4] === columnSum);
  const result = Math.min(...candidates.map((p) => p[1]));
  return book9Problem({
    prompt: "1부터 5까지를 한 번씩 넣어 가로 합과 세로 합을 맞출 때, 가운데 ㉡에 들어갈 수 있는 가장 작은 수를 구하세요.",
    subtype: "cross-sum", visual: { cards: [1,2,3,4,5], rowSum, columnSum }, answer: result,
    solution: `두 합 조건을 모두 만족하는 배치를 차례로 확인하면 가운데 수의 최솟값은 ${result}입니다.`,
    family: "grid-minimum-b9", meta: { difficulty, rowSum, columnSum, candidates, result }
  });
}

const CIRCLE_CHAIN_BASE = Object.freeze([1,7,6,5,3,9,2,4,8]);
function circleChainEqualSumBook9({ difficulty = 2 }) {
  const start = randomInt(1, difficulty === 3 ? 6 : 3);
  const step = randomInt(1, difficulty === 3 ? 3 : 2);
  const solution = CIRCLE_CHAIN_BASE.map((value) => start + (value - 1) * step);
  const lineSum = 3 * start + 11 * step;
  const targetIndex = sample([1,3,5,7]);
  const shown = solution.map((value, index) => index === targetIndex ? "㉠" : value);
  const result = solution[targetIndex];
  return book9Problem({
    prompt: "서로 이어진 네 줄에 놓인 세 수의 합이 모두 같을 때 ㉠에 들어갈 수를 구하세요.",
    subtype: "circle-chain", visual: { shown, lineSum }, answer: result,
    solution: `한 줄의 합 ${lineSum}에서 같은 줄의 보이는 두 수를 빼면 ㉠=${result}입니다.`,
    family: "circle-chain-b9", meta: { difficulty, start, step, solution, lineSum, targetIndex, result }
  });
}

const TRIANGLE_LINE_BASE = Object.freeze([2,4,7,1,5,6,3]);
const TRIANGLE_LINE_LINES = Object.freeze([[0,1,2],[2,3,4],[4,5,0],[1,6,5]]);
function triangleLineEqualSumBook9({ difficulty = 2 }) {
  const start = randomInt(1, difficulty === 3 ? 6 : 3);
  const step = randomInt(1, difficulty === 3 ? 3 : 2);
  const solution = TRIANGLE_LINE_BASE.map((value) => start + (value - 1) * step);
  const lineSum = 3 * start + 10 * step;
  const targetIndex = randomInt(0, 6);
  const shown = solution.map((value, index) => index === targetIndex ? "㉠" : value);
  const result = solution[targetIndex];
  return book9Problem({
    prompt: "삼각형 위의 세 수와 일직선 위의 세 수의 합이 모두 같을 때 ㉠을 구하세요.",
    subtype: "triangle-line", visual: { shown, lineSum }, answer: result,
    solution: `한 줄의 합 ${lineSum}에서 ㉠과 같은 줄의 두 수를 빼면 ${result}입니다.`,
    family: "triangle-line-b9", meta: { difficulty, start, step, solution, lines: TRIANGLE_LINE_LINES, lineSum, targetIndex, result }
  });
}

function circularMagicMaximumBook9({ difficulty = 2 }) {
  const count = sample(difficulty === 1 ? [7,9] : difficulty === 2 ? [9,11] : [11,13]);
  const start = randomInt(1, difficulty === 3 ? 5 : 2);
  const values = Array.from({ length: count }, (_, index) => start + index);
  const center = values.at(-1);
  const pairSum = values[0] + values.at(-2);
  const result = center + pairSum;
  return book9Problem({
    prompt: `연속한 ${count}개의 수를 한 번씩 넣어 가운데를 지나는 모든 세 수의 합을 같게 만들 때, 그 합의 가장 큰 값을 구하세요.`,
    subtype: "circular-magic", visual: { values, center: "?", spokes: (count - 1) / 2 }, answer: result,
    solution: `가장 큰 수 ${center}를 가운데 놓으면 나머지는 작은 수와 큰 수를 짝지어 합이 ${pairSum}이 됩니다. 따라서 ${center}+${pairSum}=${result}입니다.`,
    family: "circular-magic-max-b9", meta: { difficulty, count, start, values, center, pairSum, result }
  });
}

const PEOPLE = ["민준", "서윤", "지후", "하린", "도윤", "예린", "수아", "현우"];

function fixedValueOrderAssignmentBook9({ difficulty = 2 }) {
  const names = shuffle(PEOPLE).slice(0, difficulty === 3 ? 6 : 5);
  const increments = difficulty === 1 ? [1,2,1,2] : [1,2,1,2,1];
  const values = [randomInt(9, 20)];
  for (let index = 0; index < names.length - 1; index += 1) values.push(values.at(-1) + increments[index]);
  const order = shuffle(Array.from({ length: names.length }, (_, index) => index));
  const assigned = Object.fromEntries(names.map((name, index) => [name, values[order[index]]]));
  const sortedNames = names.slice().sort((a,b) => assigned[a] - assigned[b]);
  const conditions = sortedNames.slice(0, -1).map((name, index) => `${topic(sortedNames[index + 1])} ${name}보다 ${assigned[sortedNames[index + 1]] - assigned[name]}만큼 큽니다.`);
  const target = sample(names);
  return book9Problem({
    prompt: `서로 다른 값 ${values.join(", ")}을 조건에 맞게 한 번씩 정했습니다. ${target}의 값을 구하세요.`,
    subtype: "condition-list", visual: { conditions: shuffle(conditions), cards: values }, answer: assigned[target],
    solution: `가장 작은 값부터 조건의 차이만큼 이어 놓으면 ${sortedNames.map((name) => `${name} ${assigned[name]}`).join(" → ")}이므로 ${topic(target)} ${assigned[target]}입니다.`,
    family: "fixed-order-b9", meta: { difficulty, names, values, assigned, sortedNames, conditions, target, result: assigned[target] }
  });
}

function lineRankingConstraintsBook9({ difficulty = 2 }) {
  const names = shuffle(PEOPLE).slice(0, difficulty === 3 ? 6 : 5);
  const order = shuffle(names);
  const conditions = order.slice(0, -1).map((name, index) => `${topic(name)} ${order[index + 1]}보다 먼저 들어왔습니다.`);
  const targetRank = difficulty === 1 ? 2 : randomInt(2, order.length - 1);
  return book9Problem({
    prompt: `조건을 모두 만족할 때 ${targetRank}등으로 들어온 사람은 누구인가요?`,
    subtype: "condition-list", visual: { conditions: shuffle(conditions), slots: order.length }, answer: order[targetRank - 1],
    solution: `조건을 앞에서부터 이어 쓰면 ${order.join(" → ")} 순서이므로 ${targetRank}등은 ${order[targetRank - 1]}입니다.`,
    family: "line-ranking-b9", meta: { difficulty, names, order, conditions, targetRank, result: order[targetRank - 1] }
  });
}

function uniqueAssignments(allowed) {
  return permutations(Array.from({ length: allowed.length }, (_, index) => index)).filter((assignment) => assignment.every((slot, person) => allowed[person].includes(slot)));
}

function exclusionGridRankingBook9({ difficulty = 2 }) {
  const size = difficulty === 3 ? 6 : 5;
  const names = shuffle(PEOPLE).slice(0, size);
  const solution = shuffle(Array.from({ length: size }, (_, index) => index));
  const allowed = solution.map((slot) => [slot, (slot + randomInt(1, size - 1)) % size]);
  let candidates = uniqueAssignments(allowed);
  while (candidates.length > 1) {
    const person = randomInt(0, size - 1);
    if (allowed[person].length > 1) allowed[person] = [solution[person]];
    candidates = uniqueAssignments(allowed);
  }
  const target = randomInt(0, size - 1);
  return book9Problem({
    prompt: `가능한 등수 표를 보고 ${names[target]}의 등수를 구하세요.`,
    subtype: "logic-grid", visual: { rowLabels: names, columnLabels: Array.from({ length: size }, (_, index) => `${index + 1}등`), allowed }, answer: `${solution[target] + 1}등`,
    solution: `가능한 칸이 하나뿐인 사람부터 정하면 배치가 하나로 결정되고 ${topic(names[target])} ${solution[target] + 1}등입니다.`,
    family: "exclusion-ranking-b9", meta: { difficulty, names, solution, allowed, candidates, target, result: solution[target] + 1 }
  });
}

function predictionSolutions(size, predictionPairs) {
  return permutations(Array.from({ length: size }, (_, index) => index)).filter((assignment) => predictionPairs.every((pair) => pair.filter(([item, slot]) => assignment[item] === slot).length === 1));
}

function exactOnePredictionProblem(difficulty, mode) {
  const size = difficulty === 3 ? 5 : 4;
  const itemLabels = mode === "ranking" ? ["한국", "중국", "프랑스", "일본", "미국"].slice(0, size) : ["수박", "딸기", "사과", "복숭아", "참외"].slice(0, size);
  const solution = shuffle(Array.from({ length: size }, (_, index) => index));
  for (let outer = 0; outer < 300; outer += 1) {
    const pairs = [];
    for (let person = 0; person < size - 1; person += 1) {
      const trueItem = randomInt(0, size - 1);
      let falseItem = randomInt(0, size - 1);
      while (falseItem === trueItem) falseItem = randomInt(0, size - 1);
      let falseSlot = randomInt(0, size - 1);
      while (solution[falseItem] === falseSlot) falseSlot = randomInt(0, size - 1);
      pairs.push(shuffle([[trueItem, solution[trueItem]], [falseItem, falseSlot]]));
    }
    const candidates = predictionSolutions(size, pairs);
    if (candidates.length !== 1 || JSON.stringify(candidates[0]) !== JSON.stringify(solution)) continue;
    const targetItem = randomInt(0, size - 1);
    const statements = pairs.map((pair, index) => ({
      speaker: PEOPLE[index],
      guesses: pair.map(([item, slot]) => mode === "ranking"
        ? `${topic(itemLabels[item])} ${slot + 1}등`
        : `${topic(`${item + 1}번 답`)} ${itemLabels[slot]}`)
    }));
    const answer = mode === "ranking" ? `${itemLabels[targetItem]} ${solution[targetItem] + 1}등` : `${targetItem + 1}번 ${itemLabels[solution[targetItem]]}`;
    return book9Problem({
      prompt: mode === "ranking" ? `각 사람의 예상 두 가지 중 하나씩만 맞았습니다. ${itemLabels[targetItem]}의 등수를 구하세요.` : `각 사람의 답 두 가지 중 하나씩만 맞았습니다. ${targetItem + 1}번의 답을 구하세요.`,
      subtype: "predictions", visual: { statements }, answer,
      solution: `각 줄에서 하나만 맞도록 표에 표시하면 가능한 경우가 하나이고 답은 ${answer}입니다.`,
      family: mode === "ranking" ? "exact-one-ranking-b9" : "exact-one-answer-b9",
      meta: { difficulty, mode, size, itemLabels, solution, pairs, candidates, targetItem, result: answer }
    });
  }
  return exactOnePredictionProblem(difficulty, mode);
}

function exactOneRankingPredictionsBook9({ difficulty = 2 }) { return exactOnePredictionProblem(difficulty, "ranking"); }
function exactOneAnswerAssignmentBook9({ difficulty = 2 }) { return exactOnePredictionProblem(difficulty, "answer"); }

function pairings(items) {
  if (!items.length) return [[]];
  const [first, ...rest] = items;
  const result = [];
  rest.forEach((second, index) => {
    const remaining = rest.slice(0, index).concat(rest.slice(index + 1));
    pairings(remaining).forEach((tail) => result.push([[first, second], ...tail]));
  });
  return result;
}

function pairGroupInferenceBook9({ difficulty = 2 }) {
  const names = shuffle(PEOPLE).slice(0, 8);
  const truePairs = pairings(Array.from({ length: 8 }, (_, index) => index))[randomInt(0, 104)];
  const meetings = [];
  let candidates = pairings(Array.from({ length: 8 }, (_, index) => index));
  while (meetings.length < 8) {
    const meeting = truePairs.map((pair) => sample(pair));
    if (meetings.some((item) => JSON.stringify(item) === JSON.stringify(meeting))) continue;
    meetings.push(meeting);
    candidates = candidates.filter((pairs) => pairs.every(([a,b]) => meetings.every((group) => !(group.includes(a) && group.includes(b)))));
    const target = 0;
    const partners = new Set(candidates.map((pairs) => pairs.find((pair) => pair.includes(target)).find((value) => value !== target)));
    if (partners.size === 1) {
      const partner = [...partners][0];
      return book9Problem({
        prompt: "각 모둠에서 한 명씩 회의에 참석했습니다. 1번 학생과 같은 모둠인 학생을 구하세요.",
        subtype: "meeting-table", visual: { names, meetings: meetings.map((group) => group.map((index) => names[index])) }, answer: names[partner],
        solution: `한 회의에 함께 나온 두 사람은 같은 모둠이 아닙니다. 이 조건을 모두 지우고 남기면 ${names[0]}의 짝은 ${names[partner]}입니다.`,
        family: "pair-group-b9", meta: { difficulty, names, truePairs, meetings, candidates, target, partner }
      });
    }
  }
  return pairGroupInferenceBook9({ difficulty });
}

function allFalseCircularSeatingBook9({ difficulty = 2 }) {
  const names = shuffle(PEOPLE).slice(0, 5);
  const solution = [names[0], ...shuffle(names.slice(1))];
  const allOrders = permutations(names.slice(1)).map((tail) => [names[0], ...tail]);
  const rightOf = (order, left, right) => order[(order.indexOf(left) + 1) % order.length] === right;
  const adjacent = (order, a, b) => rightOf(order, a, b) || rightOf(order, b, a);
  const pool = [];
  for (const a of names) for (const b of names) if (a !== b) {
    if (!rightOf(solution, a, b)) pool.push({ kind: "right", a, b, text: `${topic(b)} ${a}의 오른쪽에 앉았습니다.` });
    if (a < b && !adjacent(solution, a, b)) pool.push({ kind: "adjacent", a, b, text: `${and(a)} ${topic(b)} 이웃해 앉았습니다.` });
  }
  const statements = [];
  let candidates = allOrders;
  const target = names[0];
  for (const statement of shuffle(pool)) {
    statements.push(statement);
    candidates = candidates.filter((order) => statement.kind === "right" ? !rightOf(order, statement.a, statement.b) : !adjacent(order, statement.a, statement.b));
    const leftNeighbors = new Set(candidates.map((order) => order[(order.indexOf(target) - 1 + order.length) % order.length]));
    if (candidates.length && leftNeighbors.size === 1) {
      const result = [...leftNeighbors][0];
      return book9Problem({
        prompt: `다음 말이 모두 거짓일 때 ${target}의 왼쪽에 앉은 사람은 누구인가요?`,
        subtype: "condition-list", visual: { conditions: statements.map((item) => item.text), circular: true }, answer: result,
        solution: `각 말을 반대로 표시하여 원탁에 놓으면 ${target}의 왼쪽에는 ${subject(result)} 앉습니다.`,
        family: "all-false-circle-b9", meta: { difficulty, names, solution, statements, candidates, target, result }
      });
    }
  }
  return allFalseCircularSeatingBook9({ difficulty });
}

function preferenceCountMatrixBook9({ difficulty = 2 }) {
  const names = shuffle(PEOPLE).slice(0, 4);
  const items = ["사과", "배", "귤", "딸기"];
  const rows = [
    [1,1,0,0], [1,0,1,0], [0,1,0,1], [1,0,1,0]
  ];
  const shuffledRows = shuffle(rows.map((row) => [...row]));
  const totals = items.map((_, column) => sum(shuffledRows.map((row) => row[column])));
  const target = randomInt(0, 3);
  const liked = items.filter((_, column) => shuffledRows[target][column]);
  const given = liked[0];
  const result = liked[1];
  const knownRows = shuffledRows.map((row, index) => index === target ? [items.indexOf(given)] : row.map((value, column) => value ? column : -1).filter((column) => column >= 0));
  return book9Problem({
    prompt: `각 사람은 과일을 두 가지씩 좋아합니다. 열의 인원수와 보이는 표시를 보고 ${subject(names[target])} ${given}과 함께 좋아하는 과일을 구하세요.`,
    subtype: "logic-matrix", visual: { rowLabels: names, columnLabels: items, knownRows, totals }, answer: result,
    solution: `열마다 필요한 표시 수를 채우면 ${names[target]}의 남은 표시는 ${result} 칸에 들어갑니다.`,
    family: "preference-matrix-b9", meta: { difficulty, names, items, rows: shuffledRows, totals, target, given, knownRows, result }
  });
}

function apartmentNeighborLogicBook9({ difficulty = 2 }) {
  const names = shuffle(["토끼", "쥐", "늑대", "고양이", "사자", "원숭이"]);
  const solution = shuffle(names);
  const conditions = [];
  for (let row = 0; row < 2; row += 1) for (let column = 0; column < 2; column += 1) {
    const left = solution[row * 3 + column];
    const right = solution[row * 3 + column + 1];
    conditions.push(`${topic(right)} ${left}의 오른쪽 옆집에 삽니다.`);
  }
  for (let column = 0; column < 3; column += 1) conditions.push(`${topic(solution[column + 3])} ${solution[column]}의 아래층에 삽니다.`);
  const targetIndex = randomInt(0, 5);
  return book9Problem({
    prompt: "조건에 맞게 동물들을 2층 3칸 집에 배치할 때 색칠한 집에 사는 동물을 구하세요.",
    subtype: "apartment", visual: { conditions: shuffle(conditions), targetIndex }, answer: solution[targetIndex],
    solution: `오른쪽 옆집 관계로 각 층을 먼저 만들고 위·아래 조건을 맞추면 색칠한 집에는 ${solution[targetIndex]}가 삽니다.`,
    answerVisual: { conditions: [], targetIndex, occupants: solution },
    family: "apartment-logic-b9", meta: { difficulty, names, solution, conditions, targetIndex, result: solution[targetIndex] }
  });
}

function uniqueMatchingProblem(difficulty, mode) {
  const names = shuffle(PEOPLE).slice(0, mode === "profession" ? 4 : 5);
  const items = mode === "profession" ? ["의사", "화가", "교사", "작곡가"] : ["컴퓨터", "농구", "미술", "테니스", "피아노"];
  if (mode === "profession") {
    const solution = shuffle(Array.from({ length: 4 }, (_, index) => index));
    const allowed = solution.map((item) => [item, (item + randomInt(1, 3)) % 4]);
    let candidates = uniqueAssignments(allowed);
    while (candidates.length > 1) {
      const person = randomInt(0, 3);
      if (allowed[person].length > 1) allowed[person] = [solution[person]];
      candidates = uniqueAssignments(allowed);
    }
    const doctor = solution.indexOf(0);
    return book9Problem({
      prompt: "각 사람의 직업이 모두 다를 때 의사는 누구인가요?",
      subtype: "logic-grid", visual: { rowLabels: names, columnLabels: items, allowed }, answer: names[doctor],
      solution: `가능한 직업이 하나인 사람부터 정하면 의사는 ${names[doctor]}입니다.`,
      family: "profession-b9", meta: { difficulty, names, items, solution, allowed, candidates, doctor, result: names[doctor] }
    });
  }
  const nonComputer = randomInt(0, 4);
  const rows = names.map((_, index) => {
    if (index === nonComputer) return shuffle([1,2,3,4]).slice(0, 3).sort();
    return [0, ...shuffle([1,2,3,4]).slice(0, 2)].sort();
  });
  const knownRows = rows.map((row, index) => index === nonComputer ? row.slice(0, 2) : row);
  const totals = items.map((_, item) => rows.filter((row) => row.includes(item)).length);
  return book9Problem({
    prompt: "각 학생은 활동 세 가지를 배웁니다. 표와 전체 인원수를 보고 컴퓨터를 배우지 않는 학생을 구하세요.",
    subtype: "logic-matrix", visual: { rowLabels: names, columnLabels: items, knownRows, totals }, answer: names[nonComputer],
    solution: `각 열의 전체 인원에 맞춰 빈 표시를 채우면 컴퓨터 칸이 비는 학생은 ${names[nonComputer]}입니다.`,
    family: "activity-enrollment-b9", meta: { difficulty, names, items, rows, knownRows, totals, nonComputer, result: names[nonComputer] }
  });
}

function professionAssignmentBook9({ difficulty = 2 }) { return uniqueMatchingProblem(difficulty, "profession"); }
function activityEnrollmentBook9({ difficulty = 2 }) { return uniqueMatchingProblem(difficulty, "activity"); }

// 단원 테스트는 본문 typeId에 아직 연결하지 않고, 원본의 복수 소문항 구조를 보존한다.
function unitTestPart({ visual, answer, solution, family, meta = {}, answerVisual = null, responseKind = "numeric" }) {
  return {
    visual,
    ...(answerVisual ? { answerVisual } : {}),
    answer: String(answer),
    solution,
    responseKind,
    meta: { family, ...meta }
  };
}

function unitTestWrapper({ typeId, prompt, parts, solution, family, difficulty, meta = {} }) {
  const answers = parts.map((part) => String(part.answer));
  return {
    typeId,
    prompt,
    visual: parts[0]?.visual || null,
    visuals: parts.map((part) => part.visual),
    ...(parts.some((part) => part.answerVisual) ? { answerVisuals: parts.map((part) => part.answerVisual || null) } : {}),
    parts,
    answer: answers.join(" / "),
    solution,
    responseKind: parts.length > 1 ? "composite" : parts[0]?.responseKind || "numeric",
    meta: { family, difficulty, partCount: parts.length, partAnswers: answers, ...meta }
  };
}

const UNIT_SUDOKU_REGIONS = Object.freeze([
  [0, 1, 2, 3],
  [0, 1, 2, 3],
  [0, 1, 2, 3],
  [0, 1, 2, 3]
]);
const UNIT_SUDOKU_SOLUTION = Object.freeze([
  [3, 1, 2, 4],
  [1, 4, 3, 2],
  [2, 3, 4, 1],
  [4, 2, 1, 3]
]);

function sudokuSolutionCount(grid, regions, limit = 2) {
  const board = grid.map((row) => [...row]);
  let count = 0;
  const allowed = (row, column, value) => {
    if (board[row].includes(value)) return false;
    if (board.some((line) => line[column] === value)) return false;
    const region = regions[row][column];
    return !board.some((line, rowIndex) => line.some((cell, columnIndex) => regions[rowIndex][columnIndex] === region && cell === value));
  };
  const search = () => {
    if (count >= limit) return;
    let target = null;
    for (let row = 0; row < board.length && !target; row += 1) for (let column = 0; column < board[row].length; column += 1) {
      if (board[row][column] === 0) target = [row, column];
    }
    if (!target) {
      count += 1;
      return;
    }
    const [row, column] = target;
    for (let value = 1; value <= 4; value += 1) {
      if (!allowed(row, column, value)) continue;
      board[row][column] = value;
      search();
      board[row][column] = 0;
      if (count >= limit) return;
    }
  };
  search();
  return count;
}

function unitTestQ01({ difficulty = 2 }) {
  const blankCount = { 1: 4, 2: 6, 3: 8 }[difficulty] || 6;
  const puzzle = UNIT_SUDOKU_SOLUTION.map((row) => [...row]);
  const blankCells = [];
  for (const index of shuffle(Array.from({ length: 16 }, (_, cell) => cell))) {
    if (blankCells.length >= blankCount) break;
    const row = Math.floor(index / 4);
    const column = index % 4;
    const previous = puzzle[row][column];
    puzzle[row][column] = 0;
    if (sudokuSolutionCount(puzzle, UNIT_SUDOKU_REGIONS) === 1) blankCells.push(index);
    else puzzle[row][column] = previous;
  }
  if (blankCells.length !== blankCount) return unitTestQ01({ difficulty });
  const part = unitTestPart({
    visual: { kind: "book9", subtype: "magic-grid", size: 4, shown: puzzle.flat(), regions: UNIT_SUDOKU_REGIONS, sudoku: true },
    answer: UNIT_SUDOKU_SOLUTION.flat().join(" "),
    solution: "가로줄, 세로줄과 굵은 선으로 나뉜 네 칸에 1, 2, 3, 4가 한 번씩만 들어가도록 채웁니다.",
    family: "unit-q01-sudoku",
    responseKind: "grid-fill",
    meta: { difficulty, puzzle, solutionGrid: UNIT_SUDOKU_SOLUTION, regions: UNIT_SUDOKU_REGIONS, blankCells, blankCount, answerKind: "grid" }
  });
  return unitTestWrapper({
    typeId: "book09-unit-test-q01",
    prompt: "주어진 규칙에 맞게 빈칸에 알맞은 수를 채워 퍼즐을 완성하시오.",
    parts: [part], solution: part.solution, family: "unit-q01-sudoku", difficulty,
    meta: { reuseTypeId: "sudoku-four-square-region", sourceQuestion: 1 }
  });
}

const UNIT_Q02_GROUPS = Object.freeze([
  [0, 4, 5, 8],
  [1, 2, 3, 6],
  [7, 10, 11, 15],
  [9, 12, 13, 14]
]);
const UNIT_Q02_SOURCE_VALUES = Object.freeze([1, 4, 3, 6, 5, 1, 2, 3, 8, 1, 7, 1, 2, 9, 3, 4]);

const UNIT_Q02_VALUES = Object.freeze({
  1: [[1, 2, 3, 6], [1, 2, 4, 5], [1, 3, 3, 5], [1, 2, 4, 5]],
  2: [[1, 5, 1, 8], [4, 3, 6, 2], [3, 7, 1, 4], [1, 2, 9, 3]],
  3: [[2, 4, 6, 12], [3, 5, 7, 9], [1, 5, 8, 10], [2, 4, 7, 11]]
});

function unitTestQ02({ difficulty = 2 }) {
  const groups = UNIT_Q02_GROUPS.map((group) => [...group]);
  const groupValues = UNIT_Q02_VALUES[difficulty] || UNIT_Q02_VALUES[2];
  const values = Array(16).fill(0);
  groups.forEach((group, groupIndex) => group.forEach((cell, index) => { values[cell] = groupValues[groupIndex][index]; }));
  const target = sum(groupValues[0]);
  const visual = { kind: "book9", subtype: "partition-choice", rows: 4, cols: 4, values, options: [{ groups }] };
  const part = unitTestPart({
    visual, answer: `네 조각, 각 조각의 합 ${target}`,
    solution: `답안의 굵은 선처럼 네 조각으로 나누면 각 조각의 수의 합이 ${target}로 같습니다.`,
    family: "unit-q02-equal-sum-partition", responseKind: "drawing",
    answerVisual: visual,
    meta: { difficulty, values, groups, target, sourceValues: UNIT_Q02_SOURCE_VALUES, answerKind: "layout" }
  });
  return unitTestWrapper({
    typeId: "book09-unit-test-q02",
    prompt: "준영이는 다음과 같은 도형을 점선을 따라서 크기와 모양이 같은 4개의 도형으로 나누려고 합니다. 각 도형에 들어있는 수들의 합이 같도록 나누어 보시오.",
    parts: [part], solution: part.solution, family: "unit-q02-equal-sum-partition", difficulty,
    meta: { reuseTypeId: "equal-sum-congruent-partition-b9", sourceQuestion: 2 }
  });
}

const UNIT_Q03_FIGURES = Object.freeze([
  {
    sourceFigure: "orthogonal-five-cell-outline",
    points: [[0, 0], [2, 0], [2, 1], [3, 1], [3, 2], [0, 2]],
    partitionSignatures: ["orthogonal-piece", "orthogonal-piece", "orthogonal-piece", "orthogonal-piece"]
  },
  {
    sourceFigure: "isosceles-trapezoid-diagonal-outline",
    points: [[1, 0], [3, 0], [4, 3], [0, 3]],
    partitionSignatures: ["trapezoid-piece", "trapezoid-piece", "trapezoid-piece", "trapezoid-piece"]
  }
]);

const UNIT_Q03_FIGURES_BY_DIFFICULTY = Object.freeze({
  1: [
    {
      sourceFigure: "square-outline",
      points: [[0, 0], [2, 0], [2, 2], [0, 2]],
      partitionSignatures: ["square-piece", "square-piece", "square-piece", "square-piece"],
      partitionHints: ["가운데를 세로로 나누기", "나뉜 조각을 다시 가로로 나누기"]
    },
    {
      sourceFigure: "rectangle-outline",
      points: [[0, 0], [4, 0], [4, 2], [0, 2]],
      partitionSignatures: ["rectangle-piece", "rectangle-piece", "rectangle-piece", "rectangle-piece"],
      partitionHints: ["같은 너비로 네 부분 만들기"]
    }
  ],
  2: UNIT_Q03_FIGURES,
  3: [
    {
      sourceFigure: "concave-eight-vertex-outline",
      points: [[0, 0], [3, 0], [3, 1], [4, 1], [4, 4], [1, 4], [1, 3], [0, 3]],
      partitionSignatures: ["concave-piece", "concave-piece", "concave-piece", "concave-piece"],
      partitionHints: ["오목한 부분의 방향을 먼저 비교하기"]
    },
    {
      sourceFigure: "offset-concave-outline",
      points: [[0, 0], [4, 0], [4, 1], [2, 1], [2, 3], [4, 3], [4, 4], [0, 4]],
      partitionSignatures: ["offset-concave-piece", "offset-concave-piece", "offset-concave-piece", "offset-concave-piece"],
      partitionHints: ["오목한 모서리의 위치를 서로 비교하기"]
    }
  ]
});

function areaVisual(points) {
  return {
    kind: "book9",
    subtype: "area-grid",
    gridWidth: Math.max(...points.map(([x]) => x)) + 1,
    gridHeight: Math.max(...points.map(([, y]) => y)) + 1,
    points,
    shaded: true
  };
}

function unitTestQ03({ difficulty = 2 }) {
  const figures = UNIT_Q03_FIGURES_BY_DIFFICULTY[difficulty] || UNIT_Q03_FIGURES;
  const parts = figures.map((figure, index) => {
    const figureArea = polygonArea(figure.points);
    const pieceArea = figureArea / 4;
    const visual = areaVisual(figure.points);
    if (figure.partitionHints) visual.partitionHints = figure.partitionHints;
    const answerVisual = { ...visual, partitioned: true };
    return unitTestPart({
      visual, answer: `${index + 1}번 도형을 네 조각으로 분할`,
      solution: difficulty === 2
        ? `${index + 1}번 도형을 네 조각으로 나누고 네 조각이 서로 포개지는지 확인합니다.`
        : `${index + 1}번 도형은 ${figure.partitionHints.join(", ")} 순서로 살펴 네 조각이 서로 포개지는지 확인합니다.`,
      family: "unit-q03-congruent-partition", responseKind: "drawing", answerVisual,
      meta: { difficulty, sourceFigure: figure.sourceFigure, points: figure.points, pieceCount: 4, pieceAreas: Array(4).fill(pieceArea), partitionSignatures: figure.partitionSignatures, ...(figure.partitionHints ? { partitionHints: figure.partitionHints } : {}), answerKind: "layout" }
    });
  });
  return unitTestWrapper({
    typeId: "book09-unit-test-q03",
    prompt: "다음 도형을 크기와 모양이 같은 4조각으로 나누어 보시오.",
    parts, solution: "각 도형의 답안처럼 점선을 따라 네 조각으로 나누고, 조각의 크기와 모양이 같은지 확인합니다.",
    family: "unit-q03-congruent-partition", difficulty,
    meta: { reuseTypeId: "congruent-composite-partition-b9", secondaryTypeId: "rotational-partition-four", sourceQuestion: 3 }
  });
}

const UNIT_Q04_POINTS = Object.freeze({
  1: [
    [[0, 2], [3, 0], [1, 4]],
    [[1, 0], [3, 2], [2, 4], [0, 4]]
  ],
  2: [
    [[0, 2], [4, 0], [1, 4]],
    [[1, 0], [4, 2], [3, 4], [0, 4]]
  ],
  3: [
    [[0, 2], [4, 0], [1, 6]],
    [[1, 0], [5, 2], [4, 6], [0, 6]]
  ]
});

const UNIT_Q05_POINTS = Object.freeze({
  1: [
    [[0, 0], [2, 0], [2, 1], [1, 2], [0, 2]],
    [[0, 0], [3, 0], [2, 2], [0, 2]]
  ],
  2: [
    [[0, 0], [2, 0], [3, 2], [2, 2], [1, 3], [0, 2]],
    [[0, 0], [4, 0], [2, 3], [0, 3]]
  ],
  3: [
    [[0, 0], [3, 0], [4, 2], [3, 2], [2, 4], [0, 3]],
    [[0, 0], [5, 0], [4, 4], [0, 4]]
  ]
});

function unitAreaQuestion(question, pointsByDifficulty, typeId, family, reuseTypeId, prompt) {
  return ({ difficulty = 2 }) => {
    const points = pointsByDifficulty[difficulty] || pointsByDifficulty[2];
    const parts = points.map((polygon, index) => {
      const result = polygonArea(polygon);
      const visual = areaVisual(polygon);
      return unitTestPart({
        visual, answer: `${result}cm²`,
        solution: `모눈의 삼각형과 사각형을 나누어 세면 ${index + 1}번 색칠한 도형의 넓이는 ${result}cm²입니다.`,
        family, meta: { difficulty, points: polygon, result, subquestion: index + 1 }
      });
    });
    return unitTestWrapper({ typeId, prompt, parts, solution: parts.map((part) => part.solution).join(" "), family, difficulty, meta: { reuseTypeId, sourceQuestion: question } });
  };
}

const unitQ04Generator = unitAreaQuestion(4, UNIT_Q04_POINTS, "book09-unit-test-q04", "unit-q04-grid-area", "shaded-composite-grid-area-b9", "한 변의 길이가 1cm인 모눈 위에 도형을 그린 것입니다. 색칠된 도형의 넓이를 각각 구하시오.");
const unitQ05Generator = unitAreaQuestion(5, UNIT_Q05_POINTS, "book09-unit-test-q05", "unit-q05-grid-area", "shaded-composite-grid-area-b9", "한 변의 길이가 1cm인 모눈 위에 도형을 그린 것입니다. 색칠된 도형의 넓이를 각각 구하시오.");
function unitTestQ04({ difficulty = 2 }) { return unitQ04Generator({ difficulty }); }
function unitTestQ05({ difficulty = 2 }) { return unitQ05Generator({ difficulty }); }

function unitTestQ06({ difficulty = 2 }) {
  const outerSize = difficulty + 2;
  const innerArea = outerSize;
  const result = outerSize * outerSize - innerArea;
  const points = [[0, 0], [outerSize, 0], [outerSize, outerSize - 1], [0, outerSize - 1]];
  const visual = areaVisual(points);
  const part = unitTestPart({
    visual, answer: `${result}cm²`,
    solution: `큰 정사각형의 넓이 ${outerSize}×${outerSize}에서 안쪽 도형의 넓이 ${innerArea}를 빼면 ${result}cm²입니다.`,
    family: "unit-q06-oblique-square-area", meta: { difficulty, outerSize, outerArea: outerSize * outerSize, innerArea, points, result }
  });
  return unitTestWrapper({ typeId: "book09-unit-test-q06", prompt: "가로, 세로 한 칸의 간격이 1cm인 모눈종이에서 다음과 같이 정사각형을 그렸습니다. 색칠한 부분의 넓이를 구하시오.", parts: [part], solution: part.solution, family: "unit-q06-oblique-square-area", difficulty, meta: { reuseTypeId: "oblique-square-grid-area", sourceQuestion: 6 } });
}

function cubeFullMap(size) {
  return Array.from({ length: size }, () => Array(size).fill(size));
}

const UNIT_Q07_MAPS = Object.freeze({
  1: [[2, 2, 1], [2, 1, 1], [1, 1, 1]],
  2: [[3, 3, 3, 3], [3, 3, 3, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
  3: [[4, 4, 4, 4, 3], [4, 4, 4, 3, 3], [3, 3, 3, 3, 3], [3, 3, 3, 3, 3], [3, 3, 3, 3, 3]]
});

function cubePartVisual(map) {
  const front = frontProfile(map);
  const side = sideProfile(map);
  return { kind: "book9", subtype: "cube-solid-views", map, front, side };
}

function unitTestQ07({ difficulty = 2 }) {
  const map = (UNIT_Q07_MAPS[difficulty] || UNIT_Q07_MAPS[2]).map((row) => [...row]);
  const size = map.length;
  const fullMap = cubeFullMap(size);
  const total = mapTotal(map);
  const fullTotal = size * size * size;
  const result = fullTotal - total;
  const part = unitTestPart({
    visual: { ...cubePartVisual(map), fullMap, fullSize: size }, answer: `${result}개`,
    solution: `완성된 상자는 ${size}×${size}×${size}=${fullTotal}개이고, 현재 ${total}개이므로 ${fullTotal}-${total}=${result}개가 더 필요합니다.`,
    family: "unit-q07-cube-fill", meta: { difficulty, map, fullMap, size, total, fullTotal, result }
  });
  return unitTestWrapper({ typeId: "book09-unit-test-q07", prompt: "다음 그림은 정육면체 모양의 상자 속에 크기가 같은 상자 모양의 쌓기나무를 여러 개 채워 놓은 것입니다. 이 상자를 오른쪽 그림과 같이 완전히 채우려면 쌓기나무가 몇 개 더 필요한지 구하시오.", parts: [part], solution: part.solution, family: "unit-q07-cube-fill", difficulty, meta: { reuseTypeId: "cube-fill-rectangular-box", sourceQuestion: 7 } });
}

const UNIT_Q08_MAPS = Object.freeze({
  1: { map: [[1, 2], [2, 3]], visible: 3 },
  2: { map: [[2, 3, 2], [3, 4, 2], [2, 3, 2]], visible: 6 },
  3: { map: [[3, 4, 3], [4, 5, 3], [3, 4, 3]], visible: 12 }
});

function unitTestQ08({ difficulty = 2 }) {
  const source = UNIT_Q08_MAPS[difficulty] || UNIT_Q08_MAPS[2];
  const map = source.map.map((row) => [...row]);
  const total = mapTotal(map);
  const hidden = total - source.visible;
  const part = unitTestPart({
    visual: cubePartVisual(map), answer: `${hidden}개`,
    solution: `쌓기나무 전체 ${total}개에서 보이는 ${source.visible}개를 빼면 보이지 않는 쌓기나무는 ${hidden}개입니다.`,
    family: "unit-q08-hidden-cube", meta: { difficulty, map, total, visible: source.visible, hidden }
  });
  return unitTestWrapper({ typeId: "book09-unit-test-q08", prompt: "다음 그림에서 보이지 않는 쌓기나무의 개수를 구하시오.", parts: [part], solution: part.solution, family: "unit-q08-hidden-cube", difficulty, meta: { reuseTypeId: "cube-hidden-count-walled", sourceQuestion: 8 } });
}

function cubeViewBounds(map) {
  const rows = map.length;
  const columns = map[0].length;
  const top = map.map((row) => row.map((value) => value > 0 ? 1 : 0));
  const front = map[0].map((_, column) => Math.max(...map.map((row) => row[column])));
  const side = map.map((row) => Math.max(...row)).reverse();
  const cells = [];
  for (let row = 0; row < rows; row += 1) for (let column = 0; column < columns; column += 1) if (top[row][column]) cells.push([row, column]);
  const current = top.map((row) => [...row]);
  const maxHeight = Math.max(...front, ...side);
  let minimum = Infinity;
  let maximum = -Infinity;
  const search = (index) => {
    if (index === cells.length) {
      if (!front.every((value, column) => Math.max(...current.map((row) => row[column])) === value)) return;
      if (!side.every((value, row) => Math.max(...current[rows - 1 - row]) === value)) return;
      const total = mapTotal(current);
      minimum = Math.min(minimum, total);
      maximum = Math.max(maximum, total);
      return;
    }
    const [row, column] = cells[index];
    for (let value = 1; value <= maxHeight; value += 1) {
      current[row][column] = value;
      search(index + 1);
    }
    current[row][column] = 0;
  };
  search(0);
  return { top, front, side, minimum, maximum };
}

const UNIT_Q10_MAPS = Object.freeze({
  1: [[0, 2, 0], [2, 1, 0], [1, 0, 2]],
  2: [[0, 3, 0], [3, 1, 0], [2, 0, 3]],
  3: [[0, 4, 0], [4, 2, 0], [2, 0, 4]]
});

function unitTestQ09({ difficulty = 2 }) {
  const generated = cubeLayerViewsBook9({ difficulty });
  const total = mapTotal(generated.meta.map);
  const part = difficulty === 1
    ? {
        ...generated,
        prompt: generated.prompt + ` 오른쪽 옆에서 본 층수는 ${generated.meta.side.join(", ")}입니다.`,
        solution: `오른쪽 옆의 층수를 단서로 각 위치의 가장 높은 층을 합치면 앞은 ${generated.meta.front.join(", ")}층입니다.`,
        meta: { ...generated.meta, disclosedSide: generated.meta.side }
      }
    : difficulty === 3
      ? {
          ...generated,
          prompt: generated.prompt + " 두 방향의 모양을 그린 뒤 쌓기나무의 전체 개수도 구하세요.",
          answer: `${generated.answer} / 전체 ${total}개`,
          solution: generated.solution + ` 각 위치의 높이를 모두 더하면 전체는 ${total}개입니다.`,
          meta: { ...generated.meta, total, askTotal: true }
        }
      : generated;
  return unitTestWrapper({
    typeId: "book09-unit-test-q09",
    prompt: difficulty === 1
      ? "각 층을 위에서 본 모양과 오른쪽 옆의 층수를 보고 앞에서 본 모양을 그리시오."
      : difficulty === 3
        ? "각 층을 위에서 본 모양을 보고 앞과 오른쪽 옆에서 본 모양을 그린 뒤, 쌓기나무의 전체 개수도 구하시오."
        : "다음은 쌓기나무를 3층으로 쌓았을 때의 각 층의 쌓기나무를 위에서 본 모양입니다. 쌓기나무 모양을 앞에서 본 모양과 오른쪽 옆에서 본 모양을 그리시오.",
    parts: [part], solution: part.solution, family: "unit-q09-cube-layer-views", difficulty,
    meta: { reuseTypeId: "cube-layer-views-b9", sourceQuestion: 9 }
  });
}

function unitTestQ10({ difficulty = 2 }) {
  const map = (UNIT_Q10_MAPS[difficulty] || UNIT_Q10_MAPS[2]).map((row) => [...row]);
  const bounds = cubeViewBounds(map);
  const visual = { ...cubePartVisual(map), top: bounds.top, topNumbers: map, front: undefined, side: undefined, blankProfiles: { frontColumns: 3, sideColumns: 3, rows: Math.max(...bounds.front, ...bounds.side) } };
  const answerVisual = { ...cubePartVisual(map), top: bounds.top, topNumbers: map, front: bounds.front, side: bounds.side };
  const part = unitTestPart({
    visual, answer: `최소 ${bounds.minimum}개`,
    solution: `위·앞·오른쪽 옆에서 보이는 높이를 맞추는 가장 작은 배치를 세면 ${bounds.minimum}개입니다.`,
    family: "unit-q10-cube-minimum", responseKind: "composite", answerVisual,
    meta: { difficulty, map, top: bounds.top, topNumbers: map, front: bounds.front, side: bounds.side, minimum: bounds.minimum, maximum: bounds.maximum, sourceSubtasks: ["위", "앞", "오른쪽 옆", "위 칸의 개수", "최소 개수"] }
  });
  return unitTestWrapper({ typeId: "book09-unit-test-q10", prompt: "쌓기나무로 쌓은 모양을 보고 위, 앞, 오른쪽 옆에서 본 모양을 그린 후, 위에서 본 모양의 각 칸에 쌓여 있는 쌓기나무의 개수를 써넣고, 쌓기나무의 최소 개수를 구하시오.", parts: [part], solution: part.solution, family: "unit-q10-cube-minimum", difficulty, meta: { reuseTypeId: "cube-top-number-grid", secondaryTypeId: "cube-solid-to-views-b9", sourceQuestion: 10 } });
}

const UNIT_Q11_MAPS = Object.freeze({
  1: [[[1, 1], [1, 2]], [[1, 1], [2, 1]]],
  2: [[[1, 2], [2, 4]], [[2, 1], [3, 3]]],
  3: [[[2, 3], [3, 5]], [[3, 2], [4, 4]]]
});

function unitTestQ11({ difficulty = 2 }) {
  const maps = UNIT_Q11_MAPS[difficulty] || UNIT_Q11_MAPS[2];
  const parts = maps.map((map, index) => {
    const copied = map.map((row) => [...row]);
    const total = mapTotal(copied);
    const bounds = cubeViewBounds(copied);
    return unitTestPart({
      visual: { ...cubePartVisual(copied), givenViews: { top: bounds.top, front: bounds.front, side: bounds.side } },
      answer: `${total}개`, solution: `${index + 1}번 모양의 칸별 높이를 더하면 ${total}개입니다.`,
      family: "unit-q11-cube-view-count", meta: { difficulty, map: copied, total, top: bounds.top, front: bounds.front, side: bounds.side, subquestion: index + 1 }
    });
  });
  return unitTestWrapper({ typeId: "book09-unit-test-q11", prompt: "쌓기나무를 위, 앞, 오른쪽 옆에서 본 모양이 다음과 같을 때, 쌓기나무의 개수를 구하시오.", parts, solution: parts.map((part) => part.solution).join(" "), family: "unit-q11-cube-view-count", difficulty, meta: { reuseTypeId: "cube-three-views", sourceQuestion: 11 } });
}

const UNIT_Q12_MAPS = Object.freeze({
  1: [[3, 3, 1], [0, 0, 3], [0, 1, 1]],
  2: [[4, 4, 2], [0, 0, 4], [0, 2, 1]],
  3: [[5, 5, 3], [0, 0, 5], [0, 3, 2]]
});

function unitTestQ12({ difficulty = 2 }) {
  const map = (UNIT_Q12_MAPS[difficulty] || UNIT_Q12_MAPS[2]).map((row) => [...row]);
  const bounds = cubeViewBounds(map);
  const part = unitTestPart({
    visual: { ...cubePartVisual(map), givenViews: { top: bounds.top, front: bounds.front, side: bounds.side } },
    answer: `최대 ${bounds.maximum}개 / 최소 ${bounds.minimum}개`,
    solution: `세 방향의 모양을 만족하는 배치 중 가장 많은 경우는 ${bounds.maximum}개, 가장 적은 경우는 ${bounds.minimum}개입니다.`,
    family: "unit-q12-cube-view-minmax", meta: { difficulty, map, top: bounds.top, front: bounds.front, side: bounds.side, maximum: bounds.maximum, minimum: bounds.minimum }
  });
  return unitTestWrapper({ typeId: "book09-unit-test-q12", prompt: "다음은 쌓기나무를 쌓아서 만든 모양을 위, 앞, 오른쪽 옆에서 본 모양입니다. 쌓기나무를 만드는 데 필요한 쌓기나무의 최대, 최소 개수를 구하시오.", parts: [part], solution: part.solution, family: "unit-q12-cube-view-minmax", difficulty, meta: { reuseTypeId: "cube-three-view-minmax", sourceQuestion: 12 } });
}

const UNIT_Q13_MATRICES = Object.freeze({
  1: [
    [[8, 1, 6], [3, 5, 7], [4, 9, 2]],
    [[9, 2, 7], [4, 6, 8], [5, 10, 3]]
  ],
  2: [
    [[10, 3, 8], [5, 7, 9], [6, 11, 4]],
    [[9, 2, 7], [4, 6, 8], [5, 10, 3]]
  ],
  3: [
    [[15, 1, 11], [5, 9, 13], [7, 17, 3]],
    [[16, 2, 12], [6, 10, 14], [8, 18, 4]]
  ]
});

function unitMagicPart(matrix, difficulty, subquestion) {
  const blankCount = { 1: 3, 2: 4, 3: 5 }[difficulty] || 4;
  const blankCells = Array.from({ length: blankCount }, (_, index) => [Math.floor(index / 3), index % 3]);
  const shown = matrix.map((row, rowIndex) => row.map((value, columnIndex) => blankCells.some(([rowNumber, column]) => rowNumber === rowIndex && column === columnIndex) ? null : value));
  const lineSum = sum(matrix[0]);
  return unitTestPart({
    visual: { kind: "book9", subtype: "magic-grid", size: 3, shown },
    answer: `합 ${lineSum}`, solution: `${subquestion}번 마방진의 가로, 세로, 대각선 세 수의 합은 ${lineSum}입니다.`,
    family: "unit-q13-magic-square", meta: { difficulty, subquestion, shown, blankCells, solutionGrid: matrix, lineSum, answerKind: "grid" }
  });
}

function unitTestQ13({ difficulty = 2 }) {
  const parts = (UNIT_Q13_MATRICES[difficulty] || UNIT_Q13_MATRICES[2]).map((matrix, index) => unitMagicPart(matrix, difficulty, index + 1));
  return unitTestWrapper({ typeId: "book09-unit-test-q13", prompt: "다음 빈칸에 적당한 수를 넣어 가로, 세로, 대각선 방향으로 세 수의 합이 같게 만들고, 합을 구하시오.", parts, solution: parts.map((part) => part.solution).join(" "), family: "unit-q13-magic-square", difficulty, meta: { reuseTypeId: "magic-square-three-complete", sourceQuestion: 13 } });
}

function unitTestQ14({ difficulty = 2 }) {
  const generated = magicSquareFourPairSumBook9({ difficulty });
  const [firstColumn] = generated.meta.columns;
  const firstIndex = generated.meta.row * 4 + firstColumn;
  const firstValue = generated.meta.solution[generated.meta.row][firstColumn];
  const part = difficulty === 1
    ? {
        ...generated,
        visual: { ...generated.visual, shown: generated.visual.shown.map((value, index) => index === firstIndex ? firstValue : value), knownTarget: firstValue },
        solution: `㉠=${firstValue}가 주어졌습니다. 한 줄의 합 ${generated.meta.lineSum}에서 같은 줄의 보이는 수와 ㉠을 빼면 ㉡을 구할 수 있고, 두 수의 합은 ${generated.meta.result}입니다.`,
        meta: { ...generated.meta, revealedTarget: firstValue }
      }
    : difficulty === 3
      ? { ...generated, visual: { ...generated.visual, lineSum: null }, meta: { ...generated.meta, deriveLineSum: true } }
      : generated;
  const prompt = difficulty === 1
    ? `㉠에는 ${firstValue}가 들어갑니다. 빈칸을 완성하고 ㉠과 ㉡의 합을 구하시오.`
    : difficulty === 3
      ? "먼저 완성된 가로줄에서 한 줄의 합을 찾아 빈칸을 완성한 뒤, ㉠과 ㉡의 합을 구하시오."
      : "다음 빈칸에 수를 넣어 가로, 세로, 대각선의 네 수의 합이 모두 같게 만들려고 합니다. ㉠, ㉡에 들어갈 두 수의 합은 얼마입니까?";
  return unitTestWrapper({ typeId: "book09-unit-test-q14", prompt, parts: [part], solution: part.solution, family: "unit-q14-magic-four-pair", difficulty, meta: { reuseTypeId: "magic-square-four-pair-sum-b9", sourceQuestion: 14 } });
}

function unitTestQ15({ difficulty = 2 }) {
  const generated = magicSquareSwapPairBook9({ difficulty });
  const [firstIndex, secondIndex] = generated.meta.swapped;
  const firstValue = generated.meta.shown[firstIndex];
  const secondValue = generated.meta.shown[secondIndex];
  const lineSum = sum(generated.meta.solution.slice(0, 3));
  const part = difficulty === 1
    ? {
        ...generated,
        answer: String(secondValue),
        solution: `${firstValue}과 위치를 바꿀 수를 찾으면 ${secondValue}입니다. 두 수의 위치를 바꾸면 모든 줄의 합이 같아집니다.`,
        meta: { ...generated.meta, knownSwapValue: firstValue, requestedValue: secondValue }
      }
    : difficulty === 3
      ? {
          ...generated,
          answer: `${firstValue}, ${secondValue} / 한 줄 합 ${lineSum}`,
          solution: `${firstValue}과 ${secondValue}의 위치를 바꾸면 각 줄의 합이 ${lineSum}으로 같아집니다.`,
          meta: { ...generated.meta, requestedPair: [firstValue, secondValue], lineSum }
        }
      : generated;
  const prompt = difficulty === 1
    ? `${firstValue}과 위치를 바꾸어야 하는 수를 구하시오.`
    : difficulty === 3
      ? "위치를 바꿀 두 수를 모두 찾고, 바꾼 뒤 한 줄의 합도 구하시오."
      : "다음 표에서 두 수의 위치를 바꾸면 각 가로줄과 세로줄에 놓이는 세 수의 합이 모두 같아집니다. 위치를 바꾼 두 수의 합은 얼마인지 구하시오.";
  return unitTestWrapper({ typeId: "book09-unit-test-q15", prompt, parts: [part], solution: part.solution, family: "unit-q15-magic-swap", difficulty, meta: { reuseTypeId: "magic-square-swap-pair-b9", sourceQuestion: 15 } });
}

const UNIT_Q16_LAYOUTS = Object.freeze({
  12: [2, 7, 3, 5, 4, 6],
  13: [2, 7, 4, 3, 6, 5],
  14: [3, 6, 5, 2, 7, 4],
  15: [5, 4, 6, 2, 7, 3]
});
const UNIT_Q16_PROFILES = Object.freeze({
  1: {
    values: [1, 2, 3, 4, 5, 6],
    targets: [9, 10, 11, 12],
    layouts: {
      9: [1, 5, 3, 4, 2, 6],
      10: [1, 4, 5, 2, 3, 6],
      11: [2, 3, 6, 1, 4, 5],
      12: [4, 2, 6, 1, 5, 3]
    }
  },
  2: { values: [2, 3, 4, 5, 6, 7], targets: [12, 13, 14, 15], layouts: UNIT_Q16_LAYOUTS },
  3: {
    values: [4, 5, 6, 7, 8, 9],
    targets: [18, 19, 20, 21],
    layouts: {
      18: [4, 8, 6, 7, 5, 9],
      19: [4, 7, 8, 5, 6, 9],
      20: [5, 6, 9, 4, 7, 8],
      21: [7, 5, 9, 4, 8, 6]
    }
  }
});
const UNIT_TRIANGLE_SIX_LINES = Object.freeze([[0, 1, 2], [2, 3, 4], [4, 5, 0]]);

function unitTestQ16({ difficulty = 2 }) {
  const profile = UNIT_Q16_PROFILES[difficulty] || UNIT_Q16_PROFILES[2];
  const values = profile.values.slice();
  const targets = profile.targets.slice();
  const parts = targets.map((target) => {
    const solution = profile.layouts[target].slice();
    const visual = { kind: "book9", subtype: "triangle-sum", size: 6, shown: Array(6).fill(null), cards: values, lineSum: target };
    const answerVisual = { ...visual, shown: solution, cards: [], lineSum: target };
    return unitTestPart({
    visual, answer: `합 ${target} 완성`, solution: `${values[0]}부터 ${values[values.length - 1]}까지를 한 번씩 넣어 세 변의 합을 ${target}로 만들면 됩니다.`,
      family: "unit-q16-triangle-edge-sum", responseKind: "drawing", answerVisual,
      meta: { difficulty, target, solution, lines: UNIT_TRIANGLE_SIX_LINES, values, answerKind: "layout" }
    });
  });
  const prompt = difficulty === 2
    ? "2에서 7까지의 수를 한 번씩 써넣어 한 변 위에 있는 세 수의 합이 12, 13, 14, 15가 되도록 삼각진을 완성하시오."
    : `${values[0]}에서 ${values[values.length - 1]}까지의 수를 한 번씩 써넣어 한 변 위에 있는 세 수의 합이 ${targets.join(", ")}가 되도록 삼각형을 완성하시오.`;
  return unitTestWrapper({ typeId: "book09-unit-test-q16", prompt, parts, solution: "네 삼각형 모두 각 변의 합 조건을 확인합니다.", family: "unit-q16-triangle-edge-sum", difficulty, meta: { reuseTypeId: "triangle-edge-sum-six", sourceQuestion: 16, values, targets } });
}

const UNIT_Q17_SOLUTION = Object.freeze([7, 8, 1, 10, 5, 2, 9, 4, 3, 6]);
const UNIT_Q17_LINES = Object.freeze([[0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 8], [8, 9, 0]]);

function unitTestQ17({ difficulty = 2 }) {
  const clueCount = { 1: 8, 2: 6, 3: 4 }[difficulty] || 6;
  const clueIndices = shuffle(Array.from({ length: 10 }, (_, index) => index)).slice(0, clueCount);
  const shown = UNIT_Q17_SOLUTION.map((value, index) => clueIndices.includes(index) ? value : null);
  const visual = { kind: "book9", subtype: "polygon-ring", sides: 5, shown, cards: Array.from({ length: 10 }, (_, index) => index + 1), lineSum: 16 };
  const answerVisual = { ...visual, shown: UNIT_Q17_SOLUTION, cards: [], lineSum: 16 };
  const part = unitTestPart({
    visual, answer: "조건을 만족하는 배치", solution: "1부터 10까지를 한 번씩 넣고 오각형의 다섯 선을 확인하면 각 선의 합은 16입니다.",
    family: "unit-q17-pentagon-ring", responseKind: "drawing", answerVisual,
    meta: { difficulty, solution: UNIT_Q17_SOLUTION, lines: UNIT_Q17_LINES, clueIndices, lineSum: 16, answerKind: "layout" }
  });
  return unitTestWrapper({ typeId: "book09-unit-test-q17", prompt: "다음 오각진에서 빈 원 안에 1부터 10까지의 수를 한 번씩 써넣어 한 줄 위에 있는 세 수의 합이 모두 16이 되게 만드시오.", parts: [part], solution: part.solution, family: "unit-q17-pentagon-ring", difficulty, meta: { reuseTypeId: "polygon-ring-equal-sum", sourceQuestion: 17 } });
}

const UNIT_Q18_PROFILES = Object.freeze({
  1: { values: [1, 2, 4, 5, 6], positions: [1, 2, 6, 4, 5], lineSum: 12 },
  2: { values: [2, 4, 6, 8, 10], positions: [2, 4, 10, 6, 8], lineSum: 20 },
  3: { values: [3, 7, 9, 13, 16], positions: [3, 7, 16, 9, 13], lineSum: 32 }
});

function unitTestQ18({ difficulty = 2 }) {
  const profile = UNIT_Q18_PROFILES[difficulty] || UNIT_Q18_PROFILES[2];
  const { values, positions, lineSum } = profile;
  const [top, left, center, right, bottom] = positions;
  const visual = { kind: "book9", subtype: "circular-magic", values, center: "?", spokes: 2 };
  const answerVisual = { ...visual, center: positions[2] };
  const part = unitTestPart({
    visual, answer: String(lineSum), solution: `세로는 ${top}+${center}+${bottom}=${lineSum}, 가로는 ${left}+${center}+${right}=${lineSum}이고, 원의 둘레도 ${top}+${left}+${right}+${bottom}=${lineSum}입니다.`,
    family: "unit-q18-circle-line-ring", answerVisual,
    meta: { difficulty, positions, lineSum, ringSum: lineSum, values }
  });
  const prompt = difficulty === 2
    ? "다음 그림의 원 안에 2에서 10까지의 짝수를 넣어 직선 위에 있는 세 수의 합과 원의 둘레에 있는 네 수의 합이 모두 같게 만드시오."
    : `다음 그림의 수 카드 ${values.join(", ")}를 원 안에 넣어 직선 위에 있는 세 수의 합과 원의 둘레에 있는 네 수의 합이 모두 같게 만드시오.`;
  return unitTestWrapper({ typeId: "book09-unit-test-q18", prompt, parts: [part], solution: part.solution, family: "unit-q18-circle-line-ring", difficulty, meta: { reuseTypeId: "circle-line-ring-equal-sum", sourceQuestion: 18 } });
}

const UNIT_Q19_PROFILES = Object.freeze({
  1: {
    labels: ["㉠", "㉡", "㉢", "㉣", "㉤"],
    conditions: ["㉤은 ㉠보다 4cm 깁니다.", "㉣은 ㉢보다 3cm 짧습니다.", "㉢은 ㉠보다 6cm 짧습니다.", "㉠은 ㉡보다 4cm 깁니다.", "㉠의 길이는 14cm입니다."],
    values: { "㉠": 14, "㉡": 10, "㉢": 8, "㉣": 5, "㉤": 18 },
    inferenceSteps: 1
  },
  2: {
    labels: ["㉠", "㉡", "㉢", "㉣", "㉤"],
    conditions: ["㉤은 ㉠보다 4cm 깁니다.", "㉣은 ㉢보다 3cm 짧습니다.", "㉢은 ㉠보다 6cm 짧습니다.", "㉠은 ㉡보다 4cm 깁니다."],
    values: { "㉠": 16, "㉡": 12, "㉢": 10, "㉣": 7, "㉤": 20 },
    inferenceSteps: 2
  },
  3: {
    labels: ["㉠", "㉡", "㉢", "㉣", "㉤", "㉥"],
    conditions: ["㉥은 ㉠보다 4cm 깁니다.", "㉠은 ㉡보다 4cm 깁니다.", "㉢은 ㉠보다 6cm 짧습니다.", "㉣은 ㉢보다 3cm 짧습니다.", "㉤은 ㉣보다 2cm 깁니다."],
    values: { "㉠": 30, "㉡": 26, "㉢": 24, "㉣": 21, "㉤": 23, "㉥": 34 },
    inferenceSteps: 4
  }
});

function unitTestQ19({ difficulty = 2 }) {
  const profile = UNIT_Q19_PROFILES[difficulty] || UNIT_Q19_PROFILES[2];
  const values = profile.values;
  const one = values["㉠"];
  const two = values["㉡"];
  const three = values["㉢"];
  const four = values["㉣"];
  const part = unitTestPart({
    visual: { kind: "book9", subtype: "condition-list", conditions: profile.conditions, ...(difficulty === 3 ? { labels: profile.labels } : {}) },
    answer: "5cm", solution: `㉠을 ${one}이라고 하면 ㉡은 ${two}, ㉢은 ${three}, ㉣은 ${four}이므로 차이는 ${two}-${four}=5cm입니다.`,
    family: "unit-q19-measurement-chain", meta: { difficulty, values, labels: profile.labels, conditions: profile.conditions, result: 5, inferenceSteps: profile.inferenceSteps }
  });
  const prompt = difficulty === 3
    ? "6개의 막대 ㉠, ㉡, ㉢, ㉣, ㉤, ㉥의 길이를 비교하였더니 다음과 같았습니다. ㉡과 ㉣은 몇 cm만큼 차이가 나는지 구하시오."
    : "5개의 막대 ㉠, ㉡, ㉢, ㉣, ㉤의 길이를 비교하였더니 다음과 같았습니다. ㉡과 ㉣은 몇 cm만큼 차이가 나는지 구하시오.";
  return unitTestWrapper({ typeId: "book09-unit-test-q19", prompt, parts: [part], solution: part.solution, family: "unit-q19-measurement-chain", difficulty, meta: { reuseTypeId: "measurement-order-chain", sourceQuestion: 19 } });
}

const UNIT_Q20_PROFILES = Object.freeze({
  1: {
    names: ["다현", "윤서", "지민", "지후", "상준"],
    constraints: [
      { kind: "leftOf", first: "다현", second: "상준" },
      { kind: "rightOf", first: "다현", second: "지민" },
      { kind: "secondRight", first: "다현", second: "윤서" }
    ],
    conditions: ["다현의 왼쪽에는 상준이가 앉아 있습니다.", "다현의 오른쪽에는 지민이가 앉아 있습니다.", "다현의 오른쪽에서 두 번째에는 윤서가 앉아 있습니다."]
  },
  2: {
    names: ["다현", "윤서", "지민", "지후", "상준"],
    constraints: [
      { kind: "leftOf", first: "다현", second: "상준" },
      { kind: "notAdjacent", first: "지후", second: "지민" },
      { kind: "notRightOf", first: "지후", second: "윤서" }
    ],
    conditions: ["다현의 왼쪽에는 상준이가 앉아 있습니다.", "지후와 지민이는 이웃하여 앉지 않습니다.", "지후의 오른쪽에 앉은 사람은 윤서가 아닙니다."]
  },
  3: {
    names: ["다현", "윤서", "지민", "지후", "상준", "예린"],
    constraints: [
      { kind: "leftOf", first: "다현", second: "상준" },
      { kind: "notRightOf", first: "지후", second: "윤서" },
      { kind: "rightOf", first: "다현", second: "지민" },
      { kind: "notAdjacent", first: "윤서", second: "예린" }
    ],
    conditions: ["다현의 왼쪽에는 상준이가 앉아 있습니다.", "지후의 오른쪽에 앉은 사람은 윤서가 아닙니다.", "다현의 오른쪽에는 지민이가 앉아 있습니다.", "윤서와 예린이는 이웃하여 앉지 않습니다."]
  }
});

function unitQ20ConstraintHolds(order, constraint) {
  const rightOf = (left, right) => order[(order.indexOf(left) + 1) % order.length] === right;
  const leftOf = (left, right) => order[(order.indexOf(left) - 1 + order.length) % order.length] === right;
  const adjacent = (first, second) => rightOf(first, second) || rightOf(second, first);
  if (constraint.kind === "rightOf") return rightOf(constraint.first, constraint.second);
  if (constraint.kind === "leftOf") return leftOf(constraint.first, constraint.second);
  if (constraint.kind === "notRightOf") return !rightOf(constraint.first, constraint.second);
  if (constraint.kind === "notAdjacent") return !adjacent(constraint.first, constraint.second);
  if (constraint.kind === "secondRight") return order[(order.indexOf(constraint.first) + 2) % order.length] === constraint.second;
  return false;
}

function unitTestQ20({ difficulty = 2 }) {
  const profile = UNIT_Q20_PROFILES[difficulty] || UNIT_Q20_PROFILES[2];
  const names = profile.names;
  const candidates = permutations(names.slice(1)).map((tail) => [names[0], ...tail]).filter((order) => profile.constraints.every((constraint) => unitQ20ConstraintHolds(order, constraint)));
  const order = candidates[0];
  const jiminIndex = order.indexOf("지민");
  const neighbors = [order[(jiminIndex - 1 + order.length) % order.length], order[(jiminIndex + 1) % order.length]].sort();
  const part = unitTestPart({
    visual: { kind: "book9", subtype: "condition-list", conditions: profile.conditions, circular: true, names },
    answer: neighbors.join(", "), solution: `조건을 원탁에 배치하면 지민의 양옆에는 ${neighbors.join("와 ")}가 앉습니다.`,
    family: "unit-q20-circular-seating", meta: { difficulty, names, conditions: profile.conditions, constraints: profile.constraints, candidates, solutionOrder: order, neighbors }
  });
  const prompt = difficulty === 2
    ? "다음과 같이 다현, 윤서, 지민, 지후, 상준이가 둥근 탁자 주위에 둥글게 앉아 있습니다. 지민은 누구와 누구 사이에 앉아 있습니까?"
    : `다음과 같이 ${names.join(", ")}가 둥근 탁자 주위에 앉아 있습니다. 지민은 누구와 누구 사이에 앉아 있습니까?`;
  return unitTestWrapper({ typeId: "book09-unit-test-q20", prompt, parts: [part], solution: part.solution, family: "unit-q20-circular-seating", difficulty, meta: { reuseTypeId: "circular-seat-placement", sourceQuestion: 20 } });
}

const UNIT_Q21_PROFILES = Object.freeze({
  1: {
    order: ["고은", "승우", "주희", "샛별", "경헌", "민아"],
    conditions: ["고은이는 승우보다 앞입니다.", "승우는 주희보다 앞입니다.", "주희는 샛별이보다 앞입니다.", "샛별이는 경헌보다 앞입니다.", "경헌은 민아보다 앞입니다."],
    relations: [["고은", "승우"], ["승우", "주희"], ["주희", "샛별"], ["샛별", "경헌"], ["경헌", "민아"]]
  },
  2: {
    order: ["고은", "승우", "주희", "샛별", "경헌", "민아"],
    conditions: ["주희는 샛별이를 이겼습니다.", "샛별이는 경헌이를 이겼습니다.", "민아는 경헌이에게 졌습니다.", "승우는 고은이에게 졌지만 주희에게 이겼습니다."],
    relations: [["주희", "샛별"], ["샛별", "경헌"], ["경헌", "민아"], ["고은", "승우"], ["승우", "주희"]]
  },
  3: {
    order: ["고은", "승우", "주희", "샛별", "경헌", "민아", "도현"],
    conditions: ["고은이는 승우보다 앞입니다.", "승우는 주희보다 앞입니다.", "주희는 샛별이보다 앞입니다.", "샛별이는 경헌보다 앞입니다.", "경헌은 민아보다 앞입니다.", "민아는 도현보다 앞입니다."],
    relations: [["고은", "승우"], ["승우", "주희"], ["주희", "샛별"], ["샛별", "경헌"], ["경헌", "민아"], ["민아", "도현"]]
  }
});

function unitTestQ21({ difficulty = 2 }) {
  const profile = UNIT_Q21_PROFILES[difficulty] || UNIT_Q21_PROFILES[2];
  const order = profile.order;
  const conditions = profile.conditions;
  const part = unitTestPart({
    visual: { kind: "book9", subtype: "condition-list", conditions, slots: order.length },
    answer: order.map((name, index) => `${index + 1}등 ${name}`).join(", "), solution: `조건을 이어 놓으면 ${order.join(" → ")} 순서입니다.`,
    family: "unit-q21-line-ranking", meta: { difficulty, order, conditions, relations: profile.relations, answerKind: "ordering" }
  });
  const prompt = difficulty === 2 ? "높이뛰기 대회를 하고 나서 친구들이 다음과 같이 말했습니다. 빈칸에 알맞은 이름을 써넣으시오." : `높이뛰기 대회에 참가한 ${order.length}명의 순서를 조건에 맞게 빈칸에 써넣으시오.`;
  return unitTestWrapper({ typeId: "book09-unit-test-q21", prompt, parts: [part], solution: part.solution, family: "unit-q21-line-ranking", difficulty, meta: { reuseTypeId: "line-ranking-constraints-b9", sourceQuestion: 21 } });
}

const UNIT_Q22_PROFILES = Object.freeze({
  1: {
    names: ["A", "B", "C", "D"], items: ["축구", "야구", "농구", "배구"],
    rows: [[0, 3], [1, 3], [0, 2], [0, 1]], knownRows: [[0, 3], [1], [0, 2], [0, 1]], totals: [3, 2, 1, 2], targetItem: 3
  },
  2: {
    names: ["A", "B", "C", "D"], items: ["축구", "야구", "농구", "배구"],
    rows: [[0, 3], [1, 3], [0, 2], [0, 1]], knownRows: [[0], [1], [0, 2], [0, 1]], totals: [3, 2, 1, 2], targetItem: 3
  },
  3: {
    names: ["A", "B", "C", "D", "E"], items: ["축구", "야구", "농구", "배구", "테니스"],
    rows: [[0, 4], [0, 1], [1, 2], [2, 3], [3, 4]], knownRows: [[0], [0, 1], [1, 2], [2, 3], [3]], totals: [2, 2, 2, 2, 2], targetItem: 4
  }
});

function unitTestQ22({ difficulty = 2 }) {
  const profile = UNIT_Q22_PROFILES[difficulty] || UNIT_Q22_PROFILES[2];
  const { names, items, rows, knownRows, totals, targetItem } = profile;
  const result = items[targetItem];
  const part = unitTestPart({
    visual: { kind: "book9", subtype: "logic-matrix", rowLabels: names, columnLabels: items, knownRows, totals },
    answer: result, solution: difficulty === 3
      ? "각 열의 인원수를 세어 아직 표시되지 않은 칸을 채우면 A의 두 번째 운동은 테니스입니다."
      : "축구는 3명, 야구는 2명, 농구는 C만 좋아하므로 A가 두 번째로 좋아하는 운동은 배구입니다.",
    family: "unit-q22-preference-matrix", meta: { difficulty, names, items, rows, knownRows, totals, targetRow: 0, targetItem, result }
  });
  const prompt = difficulty === 3
    ? "A, B, C, D, E 다섯 사람은 축구, 야구, 농구, 배구, 테니스 중 두 가지씩 좋아합니다. 표와 운동별 인원수를 보고 A가 아직 표시하지 않은 운동을 구하시오."
    : "A, B, C, D 네 사람은 축구, 야구, 농구, 배구 중 두 가지씩 좋아합니다. 축구를 좋아하는 사람은 3명이고 야구와 배구를 좋아하는 사람은 각각 2명입니다. 농구를 좋아하는 사람은 C뿐이며, A는 축구를 좋아하고 B는 야구를 좋아하며 D는 축구와 야구를 좋아합니다. A가 두 번째로 좋아하는 운동을 구하시오.";
  return unitTestWrapper({ typeId: "book09-unit-test-q22", prompt, parts: [part], solution: part.solution, family: "unit-q22-preference-matrix", difficulty, meta: { reuseTypeId: "preference-count-matrix-b9", sourceQuestion: 22 } });
}

const UNIT_Q23_PROFILES = Object.freeze({
  1: {
    teams: ["한국", "브라질", "프랑스", "독일"], solution: [1, 0, 2, 3], result: "브라질",
    pairs: [[[3, 0], [2, 2]], [[0, 1], [1, 2]], [[3, 3], [2, 0]], [[0, 1], [3, 0]]],
    statements: [
      { speaker: "A", guesses: ["독일이 1위", "프랑스가 3위"] },
      { speaker: "B", guesses: ["한국이 2위", "브라질이 3위"] },
      { speaker: "C", guesses: ["독일이 4위", "프랑스가 1위"] },
      { speaker: "D", guesses: ["한국이 2위", "독일이 1위"] }
    ]
  },
  2: {
    teams: ["한국", "브라질", "프랑스", "독일"], solution: [1, 0, 2, 3], result: "브라질",
    pairs: [[[3, 0], [2, 2]], [[0, 1], [1, 2]], [[3, 3], [2, 0]]],
    statements: [
      { speaker: "A", guesses: ["독일이 1위", "프랑스가 3위"] },
      { speaker: "B", guesses: ["한국이 2위", "브라질이 3위"] },
      { speaker: "C", guesses: ["독일이 4위", "프랑스가 1위"] }
    ]
  },
  3: {
    teams: ["한국", "브라질", "프랑스", "독일", "일본"], solution: [1, 0, 2, 3, 4], result: "브라질",
    pairs: [[[3, 0], [2, 2]], [[0, 1], [1, 2]], [[3, 3], [2, 0]], [[4, 4], [0, 2]]],
    statements: [
      { speaker: "A", guesses: ["독일이 1위", "프랑스가 3위"] },
      { speaker: "B", guesses: ["한국이 2위", "브라질이 3위"] },
      { speaker: "C", guesses: ["독일이 4위", "프랑스가 1위"] },
      { speaker: "D", guesses: ["일본이 5위", "한국이 3위"] }
    ]
  }
});

function unitTestQ23({ difficulty = 2 }) {
  const profile = UNIT_Q23_PROFILES[difficulty] || UNIT_Q23_PROFILES[2];
  const { teams, pairs, solution, statements, result } = profile;
  const part = unitTestPart({
    visual: { kind: "book9", subtype: "predictions", statements }, answer: result,
    solution: `각 사람의 두 예상 중 하나만 맞도록 순위를 놓으면 ${result}이 1위입니다.`,
    family: "unit-q23-exact-one-answer", meta: { difficulty, teams, pairs, solution, statements, targetItem: 1, result }
  });
  const prompt = difficulty === 3
    ? `${teams.join(", ")} 다섯 팀의 축구 순위를 네 사람이 예상했습니다. 각 사람의 예상 중 정확히 하나만 맞을 때 우승팀을 구하시오.`
    : difficulty === 1
      ? "한국, 브라질, 프랑스, 독일 네 팀의 축구 순위를 네 사람이 예상했습니다. 각 사람의 예상 중 정확히 하나만 맞을 때 우승팀을 구하시오."
      : "한국, 브라질, 프랑스, 독일 네 팀의 축구 순위를 세 사람이 예상했습니다. 각 사람의 예상 중 정확히 하나만 맞을 때 우승팀을 구하시오.";
  return unitTestWrapper({ typeId: "book09-unit-test-q23", prompt, parts: [part], solution: part.solution, family: "unit-q23-exact-one-answer", difficulty, meta: { reuseTypeId: "exact-one-answer-assignment-b9", sourceQuestion: 23 } });
}

const UNIT_Q24_BASE_CONSTRAINTS = Object.freeze([
  { kind: "notRank", name: "㉮", ranks: [2, 4] },
  { kind: "notRank", name: "㉯", ranks: [3, 4] },
  { kind: "notRank", name: "㉰", ranks: [1, 2] },
  { kind: "after", first: "㉱", second: "㉮" },
  { kind: "after", first: "㉱", second: "㉯" },
  { kind: "after", first: "㉲", second: "㉯" },
  { kind: "before", first: "㉲", second: "㉮" }
]);
const UNIT_Q24_PROFILES = Object.freeze({
  1: {
    names: ["㉮", "㉯", "㉰", "㉱", "㉲"], target: "㉮", constraints: [...UNIT_Q24_BASE_CONSTRAINTS, { kind: "rank", name: "㉮", rank: 3 }],
    conditions: ["㉮는 2등도 4등도 아닙니다.", "㉯는 3등도 4등도 아닙니다.", "㉰는 1등도 2등도 아닙니다.", "㉱는 ㉮와 ㉯에게 졌습니다.", "㉲는 ㉯에게 졌지만 ㉮에게 이겼습니다.", "㉮는 3등입니다."]
  },
  2: {
    names: ["㉮", "㉯", "㉰", "㉱", "㉲"], target: "㉮", constraints: UNIT_Q24_BASE_CONSTRAINTS,
    conditions: ["㉮는 2등도 4등도 아닙니다.", "㉯는 3등도 4등도 아닙니다.", "㉰는 1등도 2등도 아닙니다.", "㉱는 ㉮와 ㉯에게 졌습니다.", "㉲는 ㉯에게 졌지만 ㉮에게 이겼습니다."]
  },
  3: {
    names: ["㉮", "㉯", "㉰", "㉱", "㉲", "㉳"], target: "㉮", constraints: [...UNIT_Q24_BASE_CONSTRAINTS, { kind: "before", first: "㉳", second: "㉲" }],
    conditions: ["㉮는 2등도 4등도 아닙니다.", "㉯는 3등도 4등도 아닙니다.", "㉰는 1등도 2등도 아닙니다.", "㉱는 ㉮와 ㉯에게 졌습니다.", "㉲는 ㉯에게 졌지만 ㉮에게 이겼습니다.", "㉳는 ㉲보다 앞입니다."]
  }
});

function unitQ24ConstraintHolds(order, constraint) {
  const position = (name) => order.indexOf(name) + 1;
  if (constraint.kind === "notRank") return !constraint.ranks.includes(position(constraint.name));
  if (constraint.kind === "rank") return position(constraint.name) === constraint.rank;
  if (constraint.kind === "after") return position(constraint.first) > position(constraint.second);
  if (constraint.kind === "before") return position(constraint.first) < position(constraint.second);
  return false;
}

function unitTestQ24({ difficulty = 2 }) {
  const profile = UNIT_Q24_PROFILES[difficulty] || UNIT_Q24_PROFILES[2];
  const { names, conditions, target } = profile;
  const position = (order, name) => order.indexOf(name) + 1;
  const candidates = permutations(names).filter((order) => profile.constraints.every((constraint) => unitQ24ConstraintHolds(order, constraint)));
  const targetRank = position(candidates[0], target);
  const part = unitTestPart({
    visual: { kind: "book9", subtype: "condition-list", conditions, slots: names.length }, answer: `${targetRank}등`,
    solution: `조건을 모두 표시하면 ㉮의 가능한 자리는 ${targetRank}등 하나이므로 정답은 ${targetRank}등입니다.`,
    family: "unit-q24-exclusion-ranking", meta: { difficulty, names, conditions, constraints: profile.constraints, candidates, target, result: targetRank }
  });
  const prompt = difficulty === 3
    ? "여섯 명 ㉮, ㉯, ㉰, ㉱, ㉲, ㉳가 달리기를 했습니다. 다음 조건을 모두 만족할 때 ㉮는 몇 등인지 구하시오."
    : "다섯 명 ㉮, ㉯, ㉰, ㉱, ㉲가 달리기를 했습니다. 다음 조건을 모두 만족할 때 ㉮는 몇 등인지 구하시오.";
  return unitTestWrapper({ typeId: "book09-unit-test-q24", prompt, parts: [part], solution: part.solution, family: "unit-q24-exclusion-ranking", difficulty, meta: { reuseTypeId: "exclusion-grid-ranking-b9", sourceQuestion: 24 } });
}

const UNIT_Q25_LINES = Object.freeze([[0, 1, 2, 3], [3, 4, 5, 6], [6, 7, 8, 0]]);
const UNIT_Q25_ALTERNATIVES = Object.freeze([
  [1, 3, 8, 7, 2, 6, 4, 5, 9],
  [1, 2, 9, 7, 3, 5, 4, 6, 8]
]);
const UNIT_Q25_PROFILES = Object.freeze({
  1: { lineSum: 17, alternatives: [[1, 4, 9, 3, 5, 7, 2, 6, 8], [1, 4, 9, 3, 5, 7, 2, 8, 6]] },
  2: { lineSum: 19, alternatives: UNIT_Q25_ALTERNATIVES },
  3: { lineSum: 21, alternatives: [[3, 1, 8, 9, 2, 4, 6, 5, 7], [3, 1, 8, 9, 2, 4, 6, 7, 5]] }
});

function unitTestQ25({ difficulty = 2 }) {
  const profile = UNIT_Q25_PROFILES[difficulty] || UNIT_Q25_PROFILES[2];
  const solution = profile.alternatives[0].slice();
  const visual = { kind: "book9", subtype: "triangle-sum", size: 9, shown: Array(9).fill(null), cards: [1, 2, 3, 4, 5, 6, 7, 8, 9], lineSum: profile.lineSum };
  const answerVisual = { ...visual, shown: solution, cards: [], lineSum: profile.lineSum };
  const part = unitTestPart({
    visual, answer: "조건을 만족하는 배치", solution: `1부터 9까지를 한 번씩 넣어 세 변의 네 수 합을 각각 ${profile.lineSum}로 맞춥니다.`,
    family: "unit-q25-triangle-edge-sum", responseKind: "drawing", answerVisual,
    meta: { difficulty, solution, lines: UNIT_Q25_LINES, lineSum: profile.lineSum, values: [1, 2, 3, 4, 5, 6, 7, 8, 9], answerAlternatives: profile.alternatives, answerKind: "layout" }
  });
  const prompt = difficulty === 2
    ? "다음 삼각진에 1에서 9까지의 수를 한 번씩 써넣어 한 변 위에 있는 네 수의 합이 모두 19가 되도록 삼각진을 완성하시오."
    : `다음 삼각형에 1에서 9까지의 수를 한 번씩 써넣어 한 변 위에 있는 네 수의 합이 모두 ${profile.lineSum}이 되도록 삼각형을 완성하시오.`;
  return unitTestWrapper({ typeId: "book09-unit-test-q25", prompt, parts: [part], solution: part.solution, family: "unit-q25-triangle-edge-sum", difficulty, meta: { reuseTypeId: "triangle-edge-sum-nine", sourceQuestion: 25, multipleValidAnswers: true } });
}

export const BOOK09_UNIT_TEST_SPECS = Object.freeze([
  { question: 1, typeId: "book09-unit-test-q01", generator: unitTestQ01, reuseTypeId: "sudoku-four-square-region", family: "unit-q01-sudoku", partCount: 1 },
  { question: 2, typeId: "book09-unit-test-q02", generator: unitTestQ02, reuseTypeId: "equal-sum-congruent-partition-b9", family: "unit-q02-equal-sum-partition", partCount: 1 },
  { question: 3, typeId: "book09-unit-test-q03", generator: unitTestQ03, reuseTypeId: "congruent-composite-partition-b9", family: "unit-q03-congruent-partition", partCount: 2 },
  { question: 4, typeId: "book09-unit-test-q04", generator: unitTestQ04, reuseTypeId: "shaded-composite-grid-area-b9", family: "unit-q04-grid-area", partCount: 2 },
  { question: 5, typeId: "book09-unit-test-q05", generator: unitTestQ05, reuseTypeId: "shaded-composite-grid-area-b9", family: "unit-q05-grid-area", partCount: 2 },
  { question: 6, typeId: "book09-unit-test-q06", generator: unitTestQ06, reuseTypeId: "oblique-square-grid-area", family: "unit-q06-oblique-square-area", partCount: 1 },
  { question: 7, typeId: "book09-unit-test-q07", generator: unitTestQ07, reuseTypeId: "cube-fill-rectangular-box", family: "unit-q07-cube-fill", partCount: 1 },
  { question: 8, typeId: "book09-unit-test-q08", generator: unitTestQ08, reuseTypeId: "cube-hidden-count-walled", family: "unit-q08-hidden-cube", partCount: 1 },
  { question: 9, typeId: "book09-unit-test-q09", generator: unitTestQ09, reuseTypeId: "cube-layer-views-b9", family: "unit-q09-cube-layer-views", partCount: 1 },
  { question: 10, typeId: "book09-unit-test-q10", generator: unitTestQ10, reuseTypeId: "cube-top-number-grid", family: "unit-q10-cube-minimum", partCount: 1 },
  { question: 11, typeId: "book09-unit-test-q11", generator: unitTestQ11, reuseTypeId: "cube-three-views", family: "unit-q11-cube-view-count", partCount: 2 },
  { question: 12, typeId: "book09-unit-test-q12", generator: unitTestQ12, reuseTypeId: "cube-three-view-minmax", family: "unit-q12-cube-view-minmax", partCount: 1 },
  { question: 13, typeId: "book09-unit-test-q13", generator: unitTestQ13, reuseTypeId: "magic-square-three-complete", family: "unit-q13-magic-square", partCount: 2 },
  { question: 14, typeId: "book09-unit-test-q14", generator: unitTestQ14, reuseTypeId: "magic-square-four-pair-sum-b9", family: "unit-q14-magic-four-pair", partCount: 1 },
  { question: 15, typeId: "book09-unit-test-q15", generator: unitTestQ15, reuseTypeId: "magic-square-swap-pair-b9", family: "unit-q15-magic-swap", partCount: 1 },
  { question: 16, typeId: "book09-unit-test-q16", generator: unitTestQ16, reuseTypeId: "triangle-edge-sum-six", family: "unit-q16-triangle-edge-sum", partCount: 4 },
  { question: 17, typeId: "book09-unit-test-q17", generator: unitTestQ17, reuseTypeId: "polygon-ring-equal-sum", family: "unit-q17-pentagon-ring", partCount: 1 },
  { question: 18, typeId: "book09-unit-test-q18", generator: unitTestQ18, reuseTypeId: "circle-line-ring-equal-sum", family: "unit-q18-circle-line-ring", partCount: 1 },
  { question: 19, typeId: "book09-unit-test-q19", generator: unitTestQ19, reuseTypeId: "measurement-order-chain", family: "unit-q19-measurement-chain", partCount: 1 },
  { question: 20, typeId: "book09-unit-test-q20", generator: unitTestQ20, reuseTypeId: "circular-seat-placement", family: "unit-q20-circular-seating", partCount: 1 },
  { question: 21, typeId: "book09-unit-test-q21", generator: unitTestQ21, reuseTypeId: "line-ranking-constraints-b9", family: "unit-q21-line-ranking", partCount: 1 },
  { question: 22, typeId: "book09-unit-test-q22", generator: unitTestQ22, reuseTypeId: "preference-count-matrix-b9", family: "unit-q22-preference-matrix", partCount: 1 },
  { question: 23, typeId: "book09-unit-test-q23", generator: unitTestQ23, reuseTypeId: "exact-one-answer-assignment-b9", family: "unit-q23-exact-one-answer", partCount: 1 },
  { question: 24, typeId: "book09-unit-test-q24", generator: unitTestQ24, reuseTypeId: "exclusion-grid-ranking-b9", family: "unit-q24-exclusion-ranking", partCount: 1 },
  { question: 25, typeId: "book09-unit-test-q25", generator: unitTestQ25, reuseTypeId: "triangle-edge-sum-nine", family: "unit-q25-triangle-edge-sum", partCount: 1 }
]);

export const BOOK09_UNIT_TEST_GENERATORS = Object.freeze(Object.fromEntries(BOOK09_UNIT_TEST_SPECS.map((spec) => [spec.typeId, spec.generator])));

export const BOOK09_GENERATORS = Object.freeze({
  latinSquareCongruentPartitionBook9,
  equalSumCongruentPartitionBook9,
  landmarkCongruentPartitionBook9,
  congruentCompositePartitionBook9,
  triangleEqualSubdivisionBook9,
  hexagonEqualSubdivisionBook9,
  tetrominoCoverCountBook9,
  quadrilateralGridAreaBook9,
  shadedCompositeGridAreaBook9,
  parallelogramGridAreaBook9,
  cubeSolidToViewsBook9,
  cubeLayerViewsBook9,
  cubeShellInteriorBook9,
  cubeViewModelChoiceBook9,
  magicSquareSwapPairBook9,
  magicSquareFourPairSumBook9,
  triangleEdgeExtremeSixBook9,
  triangleEdgeExtremeNineBook9,
  heptagonRingEqualSumBook9,
  overlapRegionEqualSumBook9,
  gridLineSumMinimumBook9,
  circleChainEqualSumBook9,
  triangleLineEqualSumBook9,
  circularMagicMaximumBook9,
  fixedValueOrderAssignmentBook9,
  lineRankingConstraintsBook9,
  exclusionGridRankingBook9,
  exactOneRankingPredictionsBook9,
  exactOneAnswerAssignmentBook9,
  pairGroupInferenceBook9,
  allFalseCircularSeatingBook9,
  preferenceCountMatrixBook9,
  apartmentNeighborLogicBook9,
  professionAssignmentBook9,
  activityEnrollmentBook9
});
