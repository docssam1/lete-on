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
  const map = randomHeightMap(Math.max(2, difficulty));
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
