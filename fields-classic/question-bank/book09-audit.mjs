import "../../geometry/worksheet/generators.js";
import "../../geometry/worksheet/render.js";
import { CURRICULUM, TEXTBOOK_STAGES, textbookGuideForType, typeById } from "./source-data.js";
import { GENERATORS } from "./generators.js";
import { book09Markup } from "./book09-renderers.js";
import { BOOK09_UNIT_TEST_GENERATORS, BOOK09_UNIT_TEST_SPECS } from "./book09-generators.js";

const iterations = Number(process.env.BOOK09_ITERATIONS || 1000);
const book = CURRICULUM.find((item) => item.id === "book-09");
const units = book?.units || [];
const typeIds = [...new Set(units.flatMap((unit) => unit.typeIds))];
const book09TypeIds = typeIds.filter((id) => id.endsWith("-b9"));
const expectedUnitCounts = [50, 36, 32, 40];
const expectedGuideFallback = "문제에 보이는 관계를 한 단계씩 표시한 뒤 같은 규칙을 적용합니다.";
const optionLabels = ["①", "②", "③", "④", "⑤"];

function fail(id, difficulty, message) {
  throw new Error(`BOOK09_AUDIT_FAILED [${id}] [difficulty=${difficulty}]: ${message}`);
}

function assert(condition, id, difficulty, message) {
  if (!condition) fail(id, difficulty, message);
}

const sum = (items) => items.reduce((total, value) => total + value, 0);
const same = (first, second) => JSON.stringify(first) === JSON.stringify(second);
const numericAnswer = (problem) => Number(String(problem.answer).match(/-?\d+(?:\.\d+)?/)?.[0]);

function unitMarkup(visual) {
  if (!visual || visual.kind !== "book9") return "";
  try {
    return book09Markup(visual);
  } catch {
    return "";
  }
}

function unitParts(problem) {
  return Array.isArray(problem?.parts) ? problem.parts : [];
}

function unitGroupCells(groups, cols = 4) {
  return groups.map((group) => group.map((index) => [index % cols, Math.floor(index / cols), index]));
}

function unitMapTotal(map) {
  return sum(map.flat());
}

function unitCubeBounds(map) {
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
      const total = unitMapTotal(current);
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

function unitMagicLineSums(grid) {
  const size = grid.length;
  const rows = grid.map((row) => sum(row));
  const columns = Array.from({ length: size }, (_, column) => sum(grid.map((row) => row[column])));
  const diagonals = [sum(grid.map((row, index) => row[index])), sum(grid.map((row, index) => row[size - 1 - index]))];
  return [...rows, ...columns, ...diagonals];
}

function unitMagicCompletionCount(shown, solution, limit = 2) {
  const board = shown.map((row) => [...row]);
  const values = [...new Set(solution.flat())];
  const blanks = [];
  board.forEach((row, rowIndex) => row.forEach((value, columnIndex) => { if (value === null) blanks.push([rowIndex, columnIndex]); }));
  const available = values.filter((value) => !board.flat().includes(value));
  let count = 0;
  const search = (index) => {
    if (count >= limit) return;
    if (index === blanks.length) {
      if (unitMagicLineSums(board).every((value) => value === unitMagicLineSums(board)[0])) count += 1;
      return;
    }
    const [row, column] = blanks[index];
    for (const value of available) {
      if (board.flat().includes(value)) continue;
      board[row][column] = value;
      search(index + 1);
      board[row][column] = null;
      if (count >= limit) return;
    }
  };
  search(0);
  return count;
}

function unitLineSums(values, lines) {
  return lines.map((line) => sum(line.map((index) => values[index])));
}

function unitSudokuSolutionCount(grid, regions, limit = 2) {
  const board = grid.map((row) => [...row]);
  let count = 0;
  const isComplete = () => {
    const validLine = (line) => same([...line].sort(), [1,2,3,4]);
    const regionValues = Array.from({ length: 4 }, (_, region) => board.flatMap((row, rowIndex) => row.filter((_, column) => regions[rowIndex][column] === region)));
    return board.every(validLine)
      && Array.from({ length: 4 }, (_, column) => board.map((row) => row[column])).every(validLine)
      && regionValues.every(validLine);
  };
  const allowed = (row, column, value) => {
    if (board[row].includes(value) || board.some((line) => line[column] === value)) return false;
    const region = regions[row][column];
    return !board.some((line, rowIndex) => line.some((cell, columnIndex) => regions[rowIndex][columnIndex] === region && cell === value));
  };
  const search = () => {
    if (count >= limit) return;
    let target = null;
    for (let row = 0; row < board.length && !target; row += 1) for (let column = 0; column < board[row].length; column += 1) {
      if (board[row][column] === 0 || board[row][column] === null) {
        target = [row, column];
        break;
      }
    }
    if (!target) {
      if (isComplete()) count += 1;
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

function permutations(items) {
  if (items.length <= 1) return [items.slice()];
  return items.flatMap((value, index) => permutations(items.slice(0, index).concat(items.slice(index + 1))).map((tail) => [value, ...tail]));
}

function pairings(items) {
  if (!items.length) return [[]];
  const [first, ...rest] = items;
  return rest.flatMap((second, index) => pairings(rest.slice(0, index).concat(rest.slice(index + 1))).map((tail) => [[first, second], ...tail]));
}

function polygonArea(points) {
  return Math.abs(points.reduce((twice, [x1, y1], index) => {
    const [x2, y2] = points[(index + 1) % points.length];
    return twice + x1 * y2 - x2 * y1;
  }, 0)) / 2;
}

function groupCells(groups) {
  const cols = 4;
  const output = new Map();
  groups.forEach((group, index) => {
    if (!output.has(group)) output.set(group, []);
    output.get(group).push([index % cols, Math.floor(index / cols), index]);
  });
  return [...output.values()];
}

function connected(cells) {
  const keys = new Set(cells.map(([x, y]) => `${x},${y}`));
  const seen = new Set([`${cells[0][0]},${cells[0][1]}`]);
  const queue = [cells[0]];
  while (queue.length) {
    const [x, y] = queue.shift();
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx, dy]) => {
      const key = `${x + dx},${y + dy}`;
      if (keys.has(key) && !seen.has(key)) {
        seen.add(key);
        queue.push([x + dx, y + dy]);
      }
    });
  }
  return seen.size === cells.length;
}

function canonicalCells(cells, markerSet = new Set()) {
  const transforms = [
    ([x,y]) => [x,y], ([x,y]) => [x,-y], ([x,y]) => [-x,y], ([x,y]) => [-x,-y],
    ([x,y]) => [y,x], ([x,y]) => [y,-x], ([x,y]) => [-y,x], ([x,y]) => [-y,-x]
  ];
  return transforms.map((transform) => {
    const points = cells.map(([x, y, index]) => [...transform([x, y]), markerSet.has(index) ? 1 : 0]);
    const minX = Math.min(...points.map(([x]) => x));
    const minY = Math.min(...points.map(([,y]) => y));
    return points.map(([x,y,marked]) => [x - minX, y - minY, marked]).sort((a,b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]).map((point) => point.join(",")).join(";");
  }).sort()[0];
}

const tetrominoSignature = canonicalCells([[0,0,0],[1,0,1],[2,0,2],[1,1,3]]);
const tetrominoShapes = [
  [[0,0],[1,0],[2,0],[1,1]],
  [[0,1],[1,1],[2,1],[1,0]],
  [[0,0],[0,1],[0,2],[1,1]],
  [[1,0],[1,1],[1,2],[0,1]]
];
const tetrominoTilingCache = new Map();

function isTTetromino(piece, cols) {
  return piece.length === 4 && canonicalCells(piece.map((index) => [index % cols, Math.floor(index / cols), index])) === tetrominoSignature;
}

function hasTetrominoTiling(rows, cols, blocked) {
  const key = `${rows}x${cols}:${[...blocked].sort((a,b) => a - b).join(",")}`;
  if (tetrominoTilingCache.has(key)) return tetrominoTilingCache.get(key);
  const blockedSet = new Set(blocked);
  const open = Array.from({ length: rows * cols }, (_, index) => index).filter((index) => !blockedSet.has(index));
  const placements = [];
  for (const shape of tetrominoShapes) {
    const width = Math.max(...shape.map(([x]) => x)) + 1;
    const height = Math.max(...shape.map(([,y]) => y)) + 1;
    for (let row = 0; row <= rows - height; row += 1) for (let column = 0; column <= cols - width; column += 1) {
      const cells = shape.map(([x,y]) => (row + y) * cols + column + x);
      if (cells.every((index) => !blockedSet.has(index))) placements.push(cells);
    }
  }
  const byCell = new Map(open.map((index) => [index, placements.filter((piece) => piece.includes(index))]));
  const used = new Set();
  const search = () => {
    const next = open.filter((index) => !used.has(index)).sort((a,b) => {
      const available = (cell) => byCell.get(cell).filter((piece) => piece.every((index) => !used.has(index))).length;
      return available(a) - available(b);
    })[0];
    if (next === undefined) return true;
    for (const piece of byCell.get(next)) {
      if (piece.some((index) => used.has(index))) continue;
      piece.forEach((index) => used.add(index));
      if (search()) return true;
      piece.forEach((index) => used.delete(index));
    }
    return false;
  };
  const result = open.length % 4 === 0 && search();
  tetrominoTilingCache.set(key, result);
  return result;
}

function congruentPartition(groups, markers = []) {
  const pieces = groupCells(groups);
  if (pieces.length !== 4 || pieces.some((cells) => cells.length !== 4 || !connected(cells))) return false;
  const markerSet = new Set(markers);
  const signatures = pieces.map((cells) => canonicalCells(cells, markerSet));
  return signatures.every((signature) => signature === signatures[0]);
}

function partitionValidity(meta, family) {
  return meta.options.map((option) => {
    if (!congruentPartition(option.groups, family === "landmark-partition-b9" ? meta.markerCells : [])) return false;
    const pieces = groupCells(option.groups);
    if (family === "latin-partition-b9") return pieces.every((cells) => same(cells.map((cell) => meta.values[cell[2]]).sort(), [1,2,3,4]));
    if (family === "equal-sum-partition-b9") return pieces.every((cells) => sum(cells.map((cell) => meta.values[cell[2]])) === meta.target);
    if (family === "landmark-partition-b9") return pieces.every((cells) => cells.filter((cell) => meta.markerCells.includes(cell[2])).length === 1);
    return true;
  });
}

const frontProfile = (map) => map[0].map((_, column) => Math.max(...map.map((row) => row[column])));
const sideProfile = (map) => map.map((row) => Math.max(...row)).reverse();
const topFootprint = (map) => map.map((row) => row.map((value) => value > 0 ? 1 : 0));

function rowsColumnsEqual(flat, size) {
  const line = sum(flat.slice(0, size));
  return Array.from({ length: size }, (_, row) => sum(flat.slice(row * size, row * size + size))).every((value) => value === line)
    && Array.from({ length: size }, (_, column) => sum(Array.from({ length: size }, (_, row) => flat[row * size + column]))).every((value) => value === line);
}

function uniqueAssignments(allowed) {
  return permutations(Array.from({ length: allowed.length }, (_, index) => index)).filter((assignment) => assignment.every((slot, person) => allowed[person].includes(slot)));
}

function predictionSolutions(size, pairs) {
  return permutations(Array.from({ length: size }, (_, index) => index)).filter((assignment) => pairs.every((pair) => pair.filter(([item, slot]) => assignment[item] === slot).length === 1));
}

function fixedSizeCombinations(size, pick) {
  const result = [];
  const visit = (start, selected) => {
    if (selected.length === pick) {
      result.push(selected.slice());
      return;
    }
    for (let value = start; value < size; value += 1) visit(value + 1, [...selected, value]);
  };
  visit(0, []);
  return result;
}

function preferenceSolutions(meta) {
  const choices = meta.knownRows.map((known) => fixedSizeCombinations(meta.items.length, 2).filter((row) => known.every((item) => row.includes(item))));
  const counts = Array(meta.items.length).fill(0);
  const selected = [];
  const solutions = [];
  const visit = (rowIndex) => {
    if (solutions.length >= 2) return;
    if (rowIndex === choices.length) {
      if (same(counts, meta.totals)) solutions.push(selected.map((row) => row.slice()));
      return;
    }
    for (const row of choices[rowIndex]) {
      const nextCounts = counts.slice();
      row.forEach((item) => { nextCounts[item] += 1; });
      if (nextCounts.some((count, item) => count > meta.totals[item])) continue;
      row.forEach((item) => { counts[item] += 1; });
      selected.push(row);
      visit(rowIndex + 1);
      selected.pop();
      row.forEach((item) => { counts[item] -= 1; });
    }
  };
  visit(0);
  return solutions;
}

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

function unitQ24ConstraintHolds(order, constraint) {
  const position = (name) => order.indexOf(name) + 1;
  if (constraint.kind === "notRank") return !constraint.ranks.includes(position(constraint.name));
  if (constraint.kind === "rank") return position(constraint.name) === constraint.rank;
  if (constraint.kind === "after") return position(constraint.first) > position(constraint.second);
  if (constraint.kind === "before") return position(constraint.first) < position(constraint.second);
  return false;
}

function unitDifficultyFingerprintValue(value) {
  if (Array.isArray(value)) return value.map((item) => unitDifficultyFingerprintValue(item));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().filter((key) => key !== "difficulty").map((key) => [key, unitDifficultyFingerprintValue(value[key])]));
  }
  return value;
}

function unitDifficultyFingerprint(problem) {
  return JSON.stringify(unitDifficultyFingerprintValue({
    prompt: problem.prompt,
    answer: problem.answer,
    solution: problem.solution,
    visual: problem.visual,
    visuals: problem.visuals,
    answerVisual: problem.answerVisual,
    answerVisuals: problem.answerVisuals,
    parts: problem.parts
  }));
}

function validate(problem, id, difficulty) {
  assert(problem && typeof problem === "object", id, difficulty, "문제 객체 없음");
  assert(typeof problem.prompt === "string" && problem.prompt.length >= 12, id, difficulty, "지문 없음");
  assert((problem.prompt.match(/\?/g) || []).length <= 1, id, difficulty, "지문 물음표 중복");
  assert(typeof problem.answer === "string" && problem.answer.trim(), id, difficulty, "정답 없음");
  assert(typeof problem.solution === "string" && problem.solution.length >= 12, id, difficulty, "풀이 없음");
  assert(problem.visual?.kind === "book9", id, difficulty, "9권 시각 자료 아님");
  assert(book09Markup(problem.visual).length > 20, id, difficulty, `렌더링 없음: ${problem.visual?.subtype}`);
  assert(problem.meta?.family, id, difficulty, "검산 family 없음");
  const allText = `${problem.prompt} ${problem.solution}`;
  assert(!/(은\(는\)|이\(가\)|을\(를\)|와\(과\)|과\(와\))/.test(allText), id, difficulty, "괄호 조사 남음");
  assert(!/(순열|퍼뮤테이션|조합|컴비네이션|제곱)/.test(allText), id, difficulty, "연령 부적합 용어");
  assert(!/(NaN|Infinity|undefined)/.test(JSON.stringify(problem)), id, difficulty, "잘못된 값 노출");

  const meta = problem.meta;
  const numeric = numericAnswer(problem);
  switch (meta.family) {
    case "latin-partition-b9":
    case "equal-sum-partition-b9":
    case "landmark-partition-b9":
    case "congruent-partition-b9": {
      const valid = partitionValidity(meta, meta.family);
      assert(valid.filter(Boolean).length === 1, id, difficulty, `분할 정답 수 ${valid.filter(Boolean).length}`);
      assert(valid[meta.correctIndex] && problem.answer === optionLabels[meta.correctIndex], id, difficulty, "분할 정답 위치 오류");
      return;
    }
    case "triangle-subdivision-b9": {
      const divisions = Math.sqrt(meta.count);
      assert(Number.isInteger(divisions) && [2,3,4].includes(divisions), id, difficulty, "삼각형 합동 분할 수 오류");
      assert(meta.result === meta.count - meta.hidden && numeric === meta.result, id, difficulty, "삼각형 조각 수 오류");
      const polygons = (book09Markup(problem.visual).match(/<polygon/g) || []).length;
      assert(polygons === meta.count, id, difficulty, `삼각형 렌더 조각 ${polygons}/${meta.count}`);
      return;
    }
    case "hexagon-subdivision-b9": {
      assert([6,12].includes(meta.count) && meta.result === meta.count - meta.marked && numeric === meta.result, id, difficulty, "육각형 조각 수 오류");
      const polygons = (book09Markup(problem.visual).match(/<polygon/g) || []).length;
      assert(polygons === meta.count, id, difficulty, `육각형 렌더 조각 ${polygons}/${meta.count}`);
      return;
    }
    case "tetromino-cover-b9": {
      const expected = { 1: [4,4,4,3], 2: [6,5,6,6], 3: [6,6,8,7] }[difficulty];
      assert(same([meta.rows, meta.cols, meta.blockedCount, meta.result], expected), id, difficulty, "난이도별 모눈·나무·블록 수 오류");
      assert(meta.total === meta.rows * meta.cols && meta.blockedCount === meta.blocked.length, id, difficulty, "전체 칸 또는 나무 수 오류");
      assert(meta.usable === meta.total - meta.blockedCount && meta.usable % 4 === 0 && numeric === meta.usable / 4, id, difficulty, "네 칸 블록 수 오류");
      const blocked = new Set(meta.blocked);
      const tiledCells = meta.tiling.flat();
      assert(meta.tiling.length === meta.result && meta.tiling.every((piece) => isTTetromino(piece, meta.cols)), id, difficulty, "저장된 조각이 T 모양이 아님");
      assert(tiledCells.length === meta.usable && new Set(tiledCells).size === meta.usable && tiledCells.every((index) => !blocked.has(index)), id, difficulty, "저장된 T 블록의 겹침·누락 오류");
      assert(hasTetrominoTiling(meta.rows, meta.cols, meta.blocked), id, difficulty, "보이는 나무 배치를 T 블록으로 채울 수 없음");
      const markup = book09Markup(problem.visual);
      assert(problem.visual.piece === "t" && markup.includes("b9-t-piece") && (markup.match(/class="b9-tree"/g) || []).length === meta.blockedCount, id, difficulty, "T 블록 또는 나무 그림 누락");
      return;
    }
    case "quadrilateral-area-b9":
      assert(meta.leftInset !== meta.rightInset && polygonArea(meta.points) === meta.result && numeric === meta.result, id, difficulty, "일반 사각형 넓이 오류"); return;
    case "composite-area-b9":
      assert(meta.width * meta.height - meta.cutWidth * meta.cutHeight === meta.result && polygonArea(meta.points) === meta.result && numeric === meta.result, id, difficulty, "복합 도형 넓이 오류"); return;
    case "parallelogram-area-b9": {
      const [a,b,c,d] = meta.points;
      assert(same([b[0]-a[0],b[1]-a[1]],[c[0]-d[0],c[1]-d[1]]) && same([d[0]-a[0],d[1]-a[1]],[c[0]-b[0],c[1]-b[1]]), id, difficulty, "평행사변형 변 오류");
      assert(meta.width * meta.height === meta.result && polygonArea(meta.points) === meta.result && numeric === meta.result, id, difficulty, "평행사변형 넓이 오류"); return;
    }
    case "cube-solid-views-b9":
      assert(same(frontProfile(meta.map), meta.front) && same(sideProfile(meta.map), meta.side), id, difficulty, "입체 앞·옆 모양 오류");
      assert(problem.responseKind === "drawing" && !problem.visual.front && same(problem.visual.blankProfiles, { frontColumns: meta.front.length, sideColumns: meta.side.length, rows: meta.profileRows }), id, difficulty, "문제지 빈 앞·옆 모눈 오류");
      return;
    case "cube-layer-views-b9": {
      const expectedLayers = Array.from({ length: Math.max(...meta.map.flat()) }, (_, layer) => meta.map.map((row) => row.map((value) => value > layer ? 1 : 0)));
      assert(same(expectedLayers, meta.layers) && same(frontProfile(meta.map), meta.front) && same(sideProfile(meta.map), meta.side), id, difficulty, "층별 바탕그림 오류");
      assert(problem.responseKind === "drawing" && !problem.visual.front && same(problem.visual.blankProfiles, { frontColumns: meta.front.length, sideColumns: meta.side.length, rows: meta.profileRows }), id, difficulty, "층별 문제지 빈 앞·옆 모눈 오류");
      return;
    }
    case "cube-shell-b9":
      assert((meta.width - 2) * (meta.depth - 2) * (meta.height - 2) === meta.result && numeric === meta.result, id, difficulty, "겉면 제거 개수 오류"); return;
    case "cube-model-choice-b9": {
      const signature = (map) => JSON.stringify([topFootprint(map), frontProfile(map), sideProfile(map)]);
      const matches = meta.options.map((option) => signature(option.map) === meta.targetSignature);
      assert(matches.filter(Boolean).length === 1 && matches[meta.correctIndex] && problem.answer === optionLabels[meta.correctIndex], id, difficulty, "쌓기나무 보기 유일성 오류"); return;
    }
    case "magic-swap-b9": {
      const repairs = [];
      for (let a = 0; a < 9; a += 1) for (let b = a + 1; b < 9; b += 1) {
        const candidate = [...meta.shown];
        [candidate[a], candidate[b]] = [candidate[b], candidate[a]];
        if (rowsColumnsEqual(candidate, 3)) repairs.push([a,b]);
      }
      assert(repairs.length === 1 && same(repairs, meta.repairs), id, difficulty, "자리 바꿈 해 유일성 오류");
      assert(meta.result === meta.shown[repairs[0][0]] + meta.shown[repairs[0][1]] && numeric === meta.result, id, difficulty, "자리 바꿈 두 수 합 오류"); return;
    }
    case "magic-four-pair-b9": {
      const flat = meta.solution.flat();
      const diagonals = [sum(meta.solution.map((row, index) => row[index])), sum(meta.solution.map((row, index) => row[3-index]))];
      assert(rowsColumnsEqual(flat, 4) && diagonals.every((value) => value === meta.lineSum), id, difficulty, "4×4 마방진 합 오류");
      assert(meta.result === sum(meta.columns.map((column) => meta.solution[meta.row][column])) && numeric === meta.result, id, difficulty, "A+B 오류"); return;
    }
    case "triangle-extreme-6-b9":
    case "triangle-extreme-9-b9": {
      const lines = meta.size === 6 ? [[0,1,2],[2,3,4],[4,5,0]] : [[0,1,2,3],[3,4,5,6],[6,7,8,0]];
      const expected = meta.size === 6 ? (meta.wantMax ? 12 : 9) : (meta.wantMax ? 23 : 17);
      assert(meta.extreme === expected && lines.every((line) => sum(line.map((index) => meta.solution[index])) === expected), id, difficulty, "삼각형 극값 오류"); return;
    }
    case "heptagon-ring-b9": {
      const lineSums = Array.from({ length: 7 }, (_, index) => sum([meta.solution[index*2], meta.solution[index*2+1], meta.solution[(index*2+2)%14]]));
      assert(new Set(meta.solution).size === 14 && lineSums.every((value) => value === meta.lineSum) && numeric === meta.lineSum, id, difficulty, "칠각형 줄 합 오류"); return;
    }
    case "overlap-regions-b9":
      assert(sum(meta.leftValues) + meta.overlap === meta.rightKnown + meta.result + meta.overlap && numeric === meta.result, id, difficulty, "겹친 영역 합 오류"); return;
    case "grid-minimum-b9": {
      const candidates = permutations([1,2,3,4,5]).filter((p) => p[0]+p[1]+p[2] === meta.rowSum && p[1]+p[3]+p[4] === meta.columnSum);
      assert(candidates.length > 0 && Math.min(...candidates.map((p) => p[1])) === meta.result && numeric === meta.result, id, difficulty, "가운데 최솟값 오류"); return;
    }
    case "circle-chain-b9": {
      const lines = [[0,1,2],[2,3,4],[4,5,6],[6,7,8]];
      assert(lines.every((line) => sum(line.map((index) => meta.solution[index])) === meta.lineSum) && numeric === meta.result, id, difficulty, "이어진 원 합 오류"); return;
    }
    case "triangle-line-b9":
      assert(meta.lines.every((line) => sum(line.map((index) => meta.solution[index])) === meta.lineSum) && numeric === meta.result, id, difficulty, "삼각형 직선 합 오류"); return;
    case "circular-magic-max-b9": {
      const outer = meta.values.slice(0, -1);
      const pairSums = Array.from({ length: outer.length / 2 }, (_, index) => outer[index] + outer[outer.length - 1 - index]);
      assert(pairSums.every((value) => value === meta.pairSum) && meta.center === Math.max(...meta.values) && numeric === meta.center + meta.pairSum, id, difficulty, "원형 마방진 최댓값 오류"); return;
    }
    case "fixed-order-b9":
      assert(new Set(Object.values(meta.assigned)).size === meta.names.length && meta.sortedNames.every((name,index) => !index || meta.assigned[meta.sortedNames[index-1]] < meta.assigned[name]) && numeric === meta.assigned[meta.target], id, difficulty, "고정값 순서 오류"); return;
    case "line-ranking-b9":
      assert(new Set(meta.order).size === meta.names.length && problem.answer === meta.order[meta.targetRank - 1], id, difficulty, "줄 순위 오류"); return;
    case "exclusion-ranking-b9": {
      const candidates = uniqueAssignments(meta.allowed);
      assert(candidates.length === 1 && same(candidates[0], meta.solution) && numeric === meta.result, id, difficulty, "가능 등수 유일성 오류"); return;
    }
    case "exact-one-ranking-b9":
    case "exact-one-answer-b9": {
      const candidates = predictionSolutions(meta.size, meta.pairs);
      assert(candidates.length === 1 && same(candidates[0], meta.solution), id, difficulty, "하나만 맞는 조건 유일성 오류");
      const expected = meta.mode === "ranking" ? `${meta.itemLabels[meta.targetItem]} ${meta.solution[meta.targetItem] + 1}등` : `${meta.targetItem + 1}번 ${meta.itemLabels[meta.solution[meta.targetItem]]}`;
      assert(problem.answer === expected, id, difficulty, "하나만 맞는 조건 정답 오류"); return;
    }
    case "pair-group-b9": {
      const candidates = pairings(Array.from({ length: 8 }, (_, index) => index)).filter((pairs) => pairs.every(([a,b]) => meta.meetings.every((group) => !(group.includes(a) && group.includes(b)))));
      const partners = new Set(candidates.map((pairs) => pairs.find((pair) => pair.includes(meta.target)).find((value) => value !== meta.target)));
      assert(partners.size === 1 && [...partners][0] === meta.partner && problem.answer === meta.names[meta.partner], id, difficulty, "같은 모둠 짝 유일성 오류"); return;
    }
    case "all-false-circle-b9": {
      const orders = permutations(meta.names.slice(1)).map((tail) => [meta.names[0], ...tail]);
      const rightOf = (order, a, b) => order[(order.indexOf(a) + 1) % order.length] === b;
      const adjacent = (order, a, b) => rightOf(order,a,b) || rightOf(order,b,a);
      const candidates = orders.filter((order) => meta.statements.every((statement) => statement.kind === "right" ? !rightOf(order,statement.a,statement.b) : !adjacent(order,statement.a,statement.b)));
      const neighbors = new Set(candidates.map((order) => order[(order.indexOf(meta.target)-1+order.length)%order.length]));
      assert(candidates.length > 0 && neighbors.size === 1 && [...neighbors][0] === meta.result && problem.answer === meta.result, id, difficulty, "모두 거짓 원탁 유일성 오류"); return;
    }
    case "preference-matrix-b9": {
      assert(meta.rows.every((row) => sum(row) === 2) && same(meta.totals, meta.items.map((_,column) => sum(meta.rows.map((row) => row[column])))), id, difficulty, "선호 표 합 오류");
      const visibleTotals = meta.items.map((_,column) => meta.knownRows.filter((row) => row.includes(column)).length);
      const missing = meta.totals.map((total,column) => total - visibleTotals[column]).map((value,index) => value === 1 ? index : -1).filter((index) => index >= 0);
      assert(missing.length === 1 && meta.items[missing[0]] === meta.result && problem.answer === meta.result, id, difficulty, "선호 표 빈칸 유일성 오류"); return;
    }
    case "apartment-logic-b9":
      assert(meta.solution.length === 6 && new Set(meta.solution).size === 6 && problem.answer === meta.solution[meta.targetIndex] && meta.conditions.length === 7, id, difficulty, "아파트 배치 오류"); return;
    case "profession-b9": {
      const candidates = uniqueAssignments(meta.allowed);
      assert(candidates.length === 1 && same(candidates[0], meta.solution) && problem.answer === meta.names[meta.doctor], id, difficulty, "직업 배치 유일성 오류"); return;
    }
    case "activity-enrollment-b9": {
      assert(meta.rows.every((row) => row.length === 3) && meta.rows.filter((row) => !row.includes(0)).length === 1, id, difficulty, "컴퓨터 미수강 학생 수 오류");
      assert(!meta.rows[meta.nonComputer].includes(0) && problem.answer === meta.names[meta.nonComputer], id, difficulty, "활동 선택 정답 오류");
      const visibleTotals = meta.items.map((_,column) => meta.knownRows.filter((row) => row.includes(column)).length);
      const missing = meta.totals.map((total,column) => total - visibleTotals[column]).map((value,index) => value === 1 ? index : -1).filter((index) => index >= 0);
      assert(missing.length === 1 && missing[0] !== 0, id, difficulty, "활동 선택 빈칸 유일성 오류"); return;
    }
    default:
      fail(id, difficulty, `검산 분기 없음: ${meta.family}`);
  }
}

function validateUnitShell(problem, spec, difficulty) {
  const id = spec.typeId;
  const parts = unitParts(problem);
  assert(problem?.typeId === id, id, difficulty, "래퍼 typeId 오류");
  assert(typeof problem?.prompt === "string" && problem.prompt.length >= 12, id, difficulty, "단원 테스트 지문 없음");
  assert(typeof problem?.solution === "string" && problem.solution.length >= 12, id, difficulty, "단원 테스트 전체 풀이 없음");
  assert(parts.length === spec.partCount, id, difficulty, `소문항 수 ${parts.length}/${spec.partCount}`);
  assert(Array.isArray(problem.visuals) && problem.visuals.length === parts.length, id, difficulty, "복수 그림 배열 없음");
  assert(same(problem.visuals, parts.map((part) => part.visual)), id, difficulty, "복수 그림 순서 불일치");
  assert(Array.isArray(problem.meta?.partAnswers) && problem.meta.partAnswers.length === parts.length, id, difficulty, "소문항 정답 배열 없음");
  assert(same(problem.meta.partAnswers, parts.map((part) => String(part.answer))), id, difficulty, "소문항 정답 배열 불일치");
  assert(problem.answer === problem.meta.partAnswers.join(" / "), id, difficulty, "전체 정답 조합 오류");
  assert(problem.meta.family === spec.family && problem.meta.difficulty === difficulty, id, difficulty, "래퍼 메타 오류");
  assert((problem.prompt.match(/\?/g) || []).length <= 1, id, difficulty, "래퍼 지문 물음표 중복");
  const allText = `${problem.prompt} ${problem.solution}`;
  assert(!/(순열|퍼뮤테이션|조합|컴비네이션|제곱|은\(는\)|이\(가\)|을\(를\)|와\(과\)|과\(와\))/.test(allText), id, difficulty, "학년 부적합 표현 또는 괄호 조사");
  assert(!/(NaN|Infinity|undefined)/.test(JSON.stringify(problem)), id, difficulty, "래퍼 잘못된 값 노출");
  parts.forEach((part, index) => {
    assert(part && typeof part.answer === "string" && part.answer.trim(), `${id}.part${index + 1}`, difficulty, "소문항 정답 없음");
    assert(typeof part.solution === "string" && part.solution.length >= 12, `${id}.part${index + 1}`, difficulty, "소문항 풀이 없음");
    assert(part.meta?.family, `${id}.part${index + 1}`, difficulty, "소문항 family 없음");
    assert(unitMarkup(part.visual).length > 20, `${id}.part${index + 1}`, difficulty, `그림 렌더링 없음: ${part.visual?.subtype}`);
    if (part.answerVisual) assert(unitMarkup(part.answerVisual).length > 20, `${id}.part${index + 1}`, difficulty, "답안 그림 렌더링 없음");
    assert(!/(순열|퍼뮤테이션|조합|컴비네이션|제곱|은\(는\)|이\(가\)|을\(를\)|와\(과\)|과\(와\))/.test(`${part.answer} ${part.solution}`), `${id}.part${index + 1}`, difficulty, "소문항 학년 부적합 표현");
    assert(!/(NaN|Infinity|undefined)/.test(JSON.stringify(part)), `${id}.part${index + 1}`, difficulty, "소문항 잘못된 값 노출");
  });
  if (problem.answerVisuals) {
    assert(problem.answerVisuals.length === parts.length, id, difficulty, "답안 그림 수 불일치");
    problem.answerVisuals.forEach((visual, index) => {
      if (visual) assert(unitMarkup(visual).length > 20, `${id}.answer${index + 1}`, difficulty, "답안 배열 그림 렌더링 없음");
    });
  }
  return parts;
}

function validateUnitTest(problem, spec, difficulty) {
  const parts = validateUnitShell(problem, spec, difficulty);
  const id = spec.typeId;
  switch (spec.question) {
    case 1: {
      const part = parts[0];
      const meta = part.meta;
      const grid = meta.solutionGrid;
      const shown = part.visual.shown;
      assert(grid.length === 4 && grid.every((row) => row.length === 4), id, difficulty, "4×4 퍼즐 크기 오류");
      assert(grid.flat().every((value) => Number.isInteger(value) && value >= 1 && value <= 4), id, difficulty, "퍼즐 해답 숫자 오류");
      assert(grid.every((row) => same([...row].sort(), [1,2,3,4])), id, difficulty, "퍼즐 가로줄 오류");
      assert(Array.from({ length: 4 }, (_, column) => grid.map((row) => row[column])).every((column) => same([...column].sort(), [1,2,3,4])), id, difficulty, "퍼즐 세로줄 오류");
      const regions = meta.regions;
      const regionValues = Array.from({ length: 4 }, (_, region) => grid.flatMap((row, rowIndex) => row.filter((_, column) => regions[rowIndex][column] === region)));
      assert(regionValues.every((region) => same([...region].sort(), [1,2,3,4])), id, difficulty, "퍼즐 굵은 영역 오류");
      assert(shown.length === 16 && shown.filter((value) => value === null || value === 0).length === meta.blankCount, id, difficulty, "퍼즐 빈칸 수 오류");
      assert(same(shown, meta.puzzle.flat()), id, difficulty, "퍼즐 표시 배열 오류");
      assert(unitSudokuSolutionCount(meta.puzzle, regions) === 1, id, difficulty, "퍼즐 해답 유일성 오류");
      assert(part.answer === grid.flat().join(" "), id, difficulty, "퍼즐 해답 배열 오류");
      return;
    }
    case 2: {
      const meta = parts[0].meta;
      const pieces = unitGroupCells(meta.groups);
      const flat = meta.groups.flat();
      const signatures = pieces.map((piece) => canonicalCells(piece));
      assert(pieces.length === 4 && pieces.every((piece) => piece.length === 4 && connected(piece)), id, difficulty, "합동 분할 조각 구조 오류");
      assert(flat.length === 16 && new Set(flat).size === 16 && flat.every((cell) => cell >= 0 && cell < 16), id, difficulty, "분할 칸 겹침·누락 오류");
      assert(new Set(signatures).size === 1, id, difficulty, "네 조각 모양 불일치");
      assert(pieces.every((piece) => sum(piece.map(([, , index]) => meta.values[index])) === meta.target), id, difficulty, "분할 수의 합 오류");
      assert(meta.sourceValues.length === 16 && meta.values.length === 16, id, difficulty, "분할 수 배열 오류");
      return;
    }
    case 3: {
      assert(parts.length === 2, id, difficulty, "도형 두 소문항 누락");
      parts.forEach((part) => {
        const meta = part.meta;
        assert(meta.pieceCount === 4 && meta.pieceAreas.length === 4, id, difficulty, "합동 분할 조각 수 오류");
        assert(meta.pieceAreas.every((value) => value > 0 && value === meta.pieceAreas[0]), id, difficulty, "합동 분할 넓이 불일치");
        assert(Math.abs(polygonArea(meta.points) - sum(meta.pieceAreas)) < 1e-9, id, difficulty, "합동 분할 전체 넓이 오류");
        assert(meta.partitionSignatures.length === 4 && new Set(meta.partitionSignatures).size === 1, id, difficulty, "합동 분할 모양 서명 오류");
        assert(part.answerVisual?.partitioned === true, id, difficulty, "합동 분할 답안 그림 표시 없음");
      });
      if (difficulty === 2) {
        assert(parts[0].meta.sourceFigure === "orthogonal-five-cell-outline" && same(parts[0].meta.points, [[0, 0], [2, 0], [2, 1], [3, 1], [3, 2], [0, 2]]), id, difficulty, "원본 첫 도형 변경");
        assert(parts[1].meta.sourceFigure === "isosceles-trapezoid-diagonal-outline" && same(parts[1].meta.points, [[1, 0], [3, 0], [4, 3], [0, 3]]), id, difficulty, "원본 둘째 도형 변경");
        assert(parts.every((part) => !part.meta.partitionHints), id, difficulty, "원본 중간 난이도 단서 변경");
      } else {
        assert(parts.every((part) => Array.isArray(part.meta.partitionHints) && part.meta.partitionHints.length > 0), id, difficulty, "도형 난이도 단서 누락");
        assert(new Set(parts.map((part) => part.meta.sourceFigure)).size === 2, id, difficulty, "도형 난이도 변형 중복");
      }
      return;
    }
    case 4:
    case 5: {
      const results = parts.map((part) => numericAnswer(part));
      parts.forEach((part) => assert(Math.abs(polygonArea(part.meta.points) - part.meta.result) < 1e-9 && numericAnswer(part) === part.meta.result, id, difficulty, "모눈 도형 넓이 재계산 오류"));
      if (difficulty === 2) assert(same(results, spec.question === 4 ? [5, 10] : [6, 9]), id, difficulty, "원본 중간 난이도 넓이 불일치");
      return;
    }
    case 6: {
      const meta = parts[0].meta;
      assert(meta.outerArea === meta.outerSize * meta.outerSize && meta.innerArea === meta.outerSize, id, difficulty, "안쪽 도형 넓이 조건 오류");
      assert(meta.result === meta.outerArea - meta.innerArea && numericAnswer(parts[0]) === meta.result, id, difficulty, "색칠 영역 넓이 오류");
      assert(Math.abs(polygonArea(meta.points) - meta.result) < 1e-9, id, difficulty, "넓이 그림과 정답 불일치");
      return;
    }
    case 7: {
      const meta = parts[0].meta;
      assert(meta.map.length === meta.size && meta.map.every((row) => row.length === meta.size), id, difficulty, "정육면체 현재 배열 오류");
      assert(meta.map.flat().every((value) => Number.isInteger(value) && value >= 1 && value <= meta.size), id, difficulty, "정육면체 높이 오류");
      assert(meta.fullMap.every((row) => row.every((value) => value === meta.size)), id, difficulty, "정육면체 완성 배열 오류");
      assert(meta.fullTotal === meta.size ** 3 && meta.total === unitMapTotal(meta.map) && meta.result === meta.fullTotal - meta.total && numericAnswer(parts[0]) === meta.result, id, difficulty, "정육면체 채우기 개수 오류");
      return;
    }
    case 8: {
      const meta = parts[0].meta;
      assert(meta.total === unitMapTotal(meta.map) && meta.visible > 0 && meta.visible < meta.total, id, difficulty, "보이지 않는 쌓기나무 조건 오류");
      assert(meta.hidden === meta.total - meta.visible && numericAnswer(parts[0]) === meta.hidden, id, difficulty, "보이지 않는 쌓기나무 개수 오류");
      return;
    }
    case 9: {
      const generated = parts[0];
      validate(generated, `${id}.part1`, difficulty);
      assert(generated.meta.family === "cube-layer-views-b9" && Array.isArray(generated.meta.layers), id, difficulty, "층별 쌓기나무 재사용 구조 오류");
      if (difficulty === 1) {
        assert(generated.meta.map.length === 2 && Math.max(...generated.meta.map.flat()) <= 2 && same(generated.meta.disclosedSide, generated.meta.side), id, difficulty, "층별 쌓기나무 쉬움 단서 오류");
      } else if (difficulty === 2) {
        assert(generated.meta.map.length === 3 && !generated.meta.askTotal && !generated.meta.disclosedSide, id, difficulty, "층별 쌓기나무 원본 구조 변경");
      } else {
        assert(generated.meta.map.length === 3 && Math.max(...generated.meta.map.flat()) === 4 && generated.meta.total === unitMapTotal(generated.meta.map) && generated.answer.includes(`전체 ${generated.meta.total}개`), id, difficulty, "층별 쌓기나무 어려움 단계 오류");
      }
      return;
    }
    case 10: {
      const meta = parts[0].meta;
      const bounds = unitCubeBounds(meta.map);
      assert(same(meta.top, bounds.top) && same(meta.front, bounds.front) && same(meta.side, bounds.side), id, difficulty, "세 방향 투영 오류");
      assert(meta.minimum === bounds.minimum && meta.maximum === bounds.maximum && numericAnswer(parts[0]) === meta.minimum, id, difficulty, "쌓기나무 최소 개수 오류");
      assert(meta.sourceSubtasks.length === 5 && parts[0].visual.blankProfiles, id, difficulty, "복합 쌓기나무 소문항 구조 누락");
      return;
    }
    case 11: {
      assert(parts.length === 2, id, difficulty, "세 방향 보기 두 소문항 누락");
      parts.forEach((part) => {
        const meta = part.meta;
        const bounds = unitCubeBounds(meta.map);
        assert(meta.total === unitMapTotal(meta.map) && same(meta.top, bounds.top) && same(meta.front, bounds.front) && same(meta.side, bounds.side), id, difficulty, "세 방향 쌓기나무 재계산 오류");
        assert(numericAnswer(part) === meta.total, id, difficulty, "세 방향 쌓기나무 개수 오류");
      });
      return;
    }
    case 12: {
      const meta = parts[0].meta;
      const bounds = unitCubeBounds(meta.map);
      assert(meta.minimum === bounds.minimum && meta.maximum === bounds.maximum, id, difficulty, "쌓기나무 최대·최소 재계산 오류");
      assert(numericAnswer(parts[0]) === meta.maximum && parts[0].answer.includes(String(meta.minimum)), id, difficulty, "쌓기나무 최대·최소 정답 오류");
      return;
    }
    case 13: {
      assert(parts.length === 2, id, difficulty, "마방진 두 소문항 누락");
      parts.forEach((part) => {
        const meta = part.meta;
        const values = meta.solutionGrid.flat();
        const lines = unitMagicLineSums(meta.solutionGrid);
        assert(new Set(values).size === 9 && lines.every((value) => value === meta.lineSum), id, difficulty, "마방진 행·열·대각선 오류");
        assert(unitMagicCompletionCount(meta.shown, meta.solutionGrid) === 1 && numericAnswer(part) === meta.lineSum, id, difficulty, "마방진 빈칸 유일성 오류");
      });
      if (difficulty === 2) assert(same(parts.map((part) => part.meta.lineSum), [21, 18]), id, difficulty, "원본 마방진 합 불일치");
      return;
    }
    case 14:
      validate(parts[0], `${id}.part1`, difficulty);
      if (difficulty === 1) assert(Number.isFinite(parts[0].meta.revealedTarget), id, difficulty, "4×4 마방진 쉬움 공개값 누락");
      if (difficulty === 2) assert(!parts[0].meta.revealedTarget && !parts[0].meta.deriveLineSum && Number.isFinite(parts[0].visual.lineSum), id, difficulty, "4×4 마방진 원본 구조 변경");
      if (difficulty === 3) assert(parts[0].meta.deriveLineSum && !parts[0].visual.lineSum, id, difficulty, "4×4 마방진 어려움 줄합 추론 누락");
      return;
    case 15: {
      const part = parts[0];
      const meta = part.meta;
      const repairs = [];
      for (let a = 0; a < 9; a += 1) for (let b = a + 1; b < 9; b += 1) {
        const candidate = [...meta.shown];
        [candidate[a], candidate[b]] = [candidate[b], candidate[a]];
        if (rowsColumnsEqual(candidate, 3)) repairs.push([a, b]);
      }
      assert(repairs.length === 1 && same(repairs, meta.repairs), id, difficulty, "자리 바꿈 해 유일성 오류");
      const values = repairs[0].map((index) => meta.shown[index]);
      assert(sum(values) === meta.result, id, difficulty, "자리 바꿈 두 수 합 오류");
      if (difficulty === 1) assert(meta.knownSwapValue === values[0] && meta.requestedValue === values[1] && numericAnswer(part) === values[1], id, difficulty, "자리 바꿈 쉬움 단서 오류");
      if (difficulty === 2) assert(!meta.knownSwapValue && !meta.requestedPair && numericAnswer(part) === meta.result, id, difficulty, "자리 바꿈 원본 구조 변경");
      if (difficulty === 3) assert(same(meta.requestedPair, values) && meta.lineSum === sum(meta.solution.slice(0, 3)) && part.answer.includes(`한 줄 합 ${meta.lineSum}`), id, difficulty, "자리 바꿈 어려움 추가 답 오류");
      return;
    }
    case 16: {
      assert(parts.length === 4, id, difficulty, "삼각형 네 소문항 누락");
      const expected = {
        1: { values: [1, 2, 3, 4, 5, 6], targets: [9, 10, 11, 12] },
        2: { values: [2, 3, 4, 5, 6, 7], targets: [12, 13, 14, 15] },
        3: { values: [4, 5, 6, 7, 8, 9], targets: [18, 19, 20, 21] }
      }[difficulty];
      assert(same(parts.map((part) => part.meta.values), parts.map(() => expected.values)), id, difficulty, "삼각형 카드 범위 오류");
      assert(same(parts.map((part) => part.meta.target), expected.targets), id, difficulty, "삼각형 목표 합 범위 오류");
      parts.forEach((part) => {
        const meta = part.meta;
        assert(same([...meta.values].sort((a,b) => a - b), expected.values), id, difficulty, "삼각형 카드 수 오류");
        assert(unitLineSums(meta.solution, meta.lines).every((value) => value === meta.target), id, difficulty, "삼각형 변의 합 오류");
        assert(part.answer.includes(String(meta.target)) && same(part.answerVisual.shown, meta.solution), id, difficulty, "삼각형 답안 배치 오류");
      });
      if (difficulty === 2) assert(same(parts.map((part) => part.meta.solution), [[2, 7, 3, 5, 4, 6], [2, 7, 4, 3, 6, 5], [3, 6, 5, 2, 7, 4], [5, 4, 6, 2, 7, 3]]), id, difficulty, "원본 삼각형 답안 변경");
      return;
    }
    case 17: {
      const meta = parts[0].meta;
      assert(same([...meta.solution].sort((a,b) => a - b), [1,2,3,4,5,6,7,8,9,10]), id, difficulty, "오각형 카드 수 오류");
      assert(unitLineSums(meta.solution, meta.lines).every((value) => value === meta.lineSum), id, difficulty, "오각형 줄의 합 오류");
      assert(meta.clueIndices.length === ({ 1: 8, 2: 6, 3: 4 }[difficulty]), id, difficulty, "오각형 난이도 단서 수 오류");
      return;
    }
    case 18: {
      const meta = parts[0].meta;
      const [top, left, center, right, bottom] = meta.positions;
      const expected = {
        1: { values: [1, 2, 4, 5, 6], positions: [1, 2, 6, 4, 5], lineSum: 12 },
        2: { values: [2, 4, 6, 8, 10], positions: [2, 4, 10, 6, 8], lineSum: 20 },
        3: { values: [3, 7, 9, 13, 16], positions: [3, 7, 16, 9, 13], lineSum: 32 }
      }[difficulty];
      assert(same(meta.values, expected.values) && same(meta.positions, expected.positions) && meta.lineSum === expected.lineSum, id, difficulty, "원형 난이도 프로필 오류");
      assert(same([...meta.values].sort((a,b) => a - b), [...expected.values].sort((a,b) => a - b)), id, difficulty, "원형 수 카드 오류");
      assert(top + center + bottom === meta.lineSum && left + center + right === meta.lineSum && top + left + right + bottom === meta.ringSum, id, difficulty, "원형 직선·둘레 합 오류");
      assert(parts[0].answer === String(meta.lineSum), id, difficulty, "원형 합 정답 오류");
      return;
    }
    case 19: {
      const meta = parts[0].meta;
      const values = meta.values;
      if (difficulty === 3) {
        assert(values["㉥"] - values["㉠"] === 4 && values["㉠"] - values["㉡"] === 4 && values["㉠"] - values["㉢"] === 6 && values["㉢"] - values["㉣"] === 3 && values["㉤"] - values["㉣"] === 2, id, difficulty, "막대 길이 조건 오류");
      } else {
        assert(values["㉤"] - values["㉠"] === 4 && values["㉠"] - values["㉡"] === 4 && values["㉠"] - values["㉢"] === 6 && values["㉢"] - values["㉣"] === 3, id, difficulty, "막대 길이 조건 오류");
      }
      assert(values["㉡"] - values["㉣"] === meta.result && numericAnswer(parts[0]) === 5, id, difficulty, "막대 길이 차이 오류");
      assert(meta.conditions.length === (difficulty === 1 ? 5 : difficulty === 2 ? 4 : 5) && meta.inferenceSteps === ({ 1: 1, 2: 2, 3: 4 }[difficulty]), id, difficulty, "막대 난이도 프로필 오류");
      if (difficulty === 2) {
        assert(same(meta.labels, ["㉠", "㉡", "㉢", "㉣", "㉤"]) && same(meta.values, { "㉠": 16, "㉡": 12, "㉢": 10, "㉣": 7, "㉤": 20 }), id, difficulty, "원본 막대 값 변경");
        assert(same(meta.conditions, ["㉤은 ㉠보다 4cm 깁니다.", "㉣은 ㉢보다 3cm 짧습니다.", "㉢은 ㉠보다 6cm 짧습니다.", "㉠은 ㉡보다 4cm 깁니다."]), id, difficulty, "원본 막대 조건 변경");
      }
      return;
    }
    case 20: {
      const meta = parts[0].meta;
      const candidates = permutations(meta.names.slice(1)).map((tail) => [meta.names[0], ...tail]).filter((order) => meta.constraints.every((constraint) => unitQ20ConstraintHolds(order, constraint)));
      assert(candidates.length === 1 && same(candidates[0], meta.solutionOrder), id, difficulty, "원탁 배치 유일성 오류");
      const jimin = candidates[0].indexOf("지민");
      const neighbors = [candidates[0][(jimin - 1 + candidates[0].length) % candidates[0].length], candidates[0][(jimin + 1) % candidates[0].length]].sort();
      assert(same(neighbors, meta.neighbors) && parts[0].answer === neighbors.join(", "), id, difficulty, "원탁 이웃 정답 오류");
      if (difficulty === 2) {
        assert(same(meta.names, ["다현", "윤서", "지민", "지후", "상준"]), id, difficulty, "원본 원탁 인원 변경");
        assert(same(meta.conditions, ["다현의 왼쪽에는 상준이가 앉아 있습니다.", "지후와 지민이는 이웃하여 앉지 않습니다.", "지후의 오른쪽에 앉은 사람은 윤서가 아닙니다."]), id, difficulty, "원본 원탁 조건 변경");
      }
      return;
    }
    case 21: {
      const meta = parts[0].meta;
      const candidates = permutations(meta.order).filter((order) => meta.relations.every(([winner, loser]) => order.indexOf(winner) < order.indexOf(loser)));
      assert(candidates.length === 1 && same(candidates[0], meta.order), id, difficulty, "순위 관계 유일성 오류");
      assert(parts[0].answer === meta.order.map((name, index) => `${index + 1}등 ${name}`).join(", "), id, difficulty, "순위 정답 배열 오류");
      assert(meta.conditions.length === ({ 1: 5, 2: 4, 3: 6 }[difficulty]) && parts[0].visual.slots === meta.order.length, id, difficulty, "순위 난이도 프로필 오류");
      if (difficulty === 2) {
        assert(same(meta.order, ["고은", "승우", "주희", "샛별", "경헌", "민아"]), id, difficulty, "원본 순위 인원 변경");
        assert(same(meta.conditions, ["주희는 샛별이를 이겼습니다.", "샛별이는 경헌이를 이겼습니다.", "민아는 경헌이에게 졌습니다.", "승우는 고은이에게 졌지만 주희에게 이겼습니다."]), id, difficulty, "원본 순위 조건 변경");
      }
      return;
    }
    case 22: {
      const meta = parts[0].meta;
      const candidates = preferenceSolutions(meta);
      assert(meta.rows.every((row) => row.length === 2 && row.every((item) => Number.isInteger(item) && item >= 0 && item < meta.items.length)), id, difficulty, "선호 표 행 구조 오류");
      assert(meta.rows.flat().reduce((counts, item) => { counts[item] += 1; return counts; }, Array(meta.items.length).fill(0)).every((count, item) => count === meta.totals[item]), id, difficulty, "선호 표 열 합 오류");
      assert(candidates.length === 1 && same(candidates[0], meta.rows), id, difficulty, "선호 표 완성 유일성 오류");
      assert(candidates[0][meta.targetRow].includes(meta.targetItem) && meta.result === meta.items[meta.targetItem] && parts[0].answer === meta.result, id, difficulty, "선호 표 빈칸 정답 오류");
      if (difficulty === 2) {
        assert(same(meta.names, ["A", "B", "C", "D"]) && same(meta.items, ["축구", "야구", "농구", "배구"]), id, difficulty, "원본 선호 표 범위 변경");
        assert(same(meta.rows, [[0,3],[1,3],[0,2],[0,1]]) && same(meta.knownRows, [[0],[1],[0,2],[0,1]]) && same(meta.totals, [3,2,1,2]), id, difficulty, "원본 선호 표 조건 변경");
      }
      return;
    }
    case 23: {
      const meta = parts[0].meta;
      const candidates = predictionSolutions(meta.teams.length, meta.pairs);
      assert(candidates.length === 1 && same(candidates[0], meta.solution), id, difficulty, "예상 결과 유일성 오류");
      assert(meta.pairs.length === meta.statements.length && meta.pairs.every((pair) => pair.length === 2), id, difficulty, "예상 결과 단서 수 오류");
      assert(meta.solution[meta.targetItem] === 0 && meta.result === meta.teams[meta.targetItem] && parts[0].answer === meta.result, id, difficulty, "예상 결과 우승팀 오류");
      if (difficulty === 2) {
        assert(same(meta.teams, ["한국", "브라질", "프랑스", "독일"]) && same(meta.solution, [1,0,2,3]), id, difficulty, "원본 예상 결과 범위 변경");
        assert(same(meta.pairs, [[[3,0],[2,2]], [[0,1],[1,2]], [[3,3],[2,0]]]), id, difficulty, "원본 예상 결과 조건 변경");
      }
      return;
    }
    case 24: {
      const meta = parts[0].meta;
      const position = (order, name) => order.indexOf(name) + 1;
      const candidates = permutations(meta.names).filter((order) => meta.constraints.every((constraint) => unitQ24ConstraintHolds(order, constraint)));
      const targetRanks = new Set(candidates.map((order) => position(order, meta.target)));
      assert(candidates.length > 0 && targetRanks.size === 1 && [...targetRanks][0] === meta.result && numericAnswer(parts[0]) === meta.result, id, difficulty, "등수 답 유일성 오류");
      assert(parts[0].visual.slots === meta.names.length && meta.conditions.length === ({ 1: 6, 2: 5, 3: 6 }[difficulty]), id, difficulty, "등수 난이도 프로필 오류");
      if (difficulty === 2) {
        assert(same(meta.names, ["㉮", "㉯", "㉰", "㉱", "㉲"]) && same(meta.conditions, ["㉮는 2등도 4등도 아닙니다.", "㉯는 3등도 4등도 아닙니다.", "㉰는 1등도 2등도 아닙니다.", "㉱는 ㉮와 ㉯에게 졌습니다.", "㉲는 ㉯에게 졌지만 ㉮에게 이겼습니다."]), id, difficulty, "원본 등수 조건 변경");
      }
      return;
    }
    case 25: {
      const meta = parts[0].meta;
      const valid = (layout) => same([...layout].sort((a,b) => a - b), meta.values) && unitLineSums(layout, meta.lines).every((value) => value === meta.lineSum);
      assert(problem.meta.multipleValidAnswers === true && meta.answerAlternatives.length >= 2, id, difficulty, "복수 정답 메타 누락");
      assert(new Set(meta.answerAlternatives.map((layout) => layout.join(","))).size === meta.answerAlternatives.length && meta.answerAlternatives.every(valid), id, difficulty, "복수 정답 배치 조건 오류");
      assert(valid(meta.solution) && meta.answerAlternatives.some((layout) => same(layout, meta.solution)), id, difficulty, "생성된 삼각형 배치 오류");
      if (difficulty === 2) assert(meta.lineSum === 19 && same(meta.answerAlternatives, [[1,3,8,7,2,6,4,5,9], [1,2,9,7,3,5,4,6,8]]), id, difficulty, "원본 삼각형 합·답안 변경");
      return;
    }
    default:
      fail(id, difficulty, "단원 테스트 검산 분기 없음");
  }
}

function numbersInReference(reference) {
  if (Array.isArray(reference.numbers)) return reference.numbers;
  return Array.from({ length: reference.to - reference.from + 1 }, (_, index) => reference.from + index);
}

function referenceKeys(stage, references) {
  return references.flatMap((reference) => numbersInReference(reference).map((number) => `${stage}:${reference.section}:${reference.group}:${number}`));
}

if (!book) throw new Error("book-09 missing");
if (units.length !== 4) throw new Error(`book-09 unit count ${units.length}`);
if (typeIds.length !== 63) throw new Error(`book-09 type count ${typeIds.length}`);
if (book09TypeIds.length !== 35) throw new Error(`book-09 new type count ${book09TypeIds.length}`);

let sourceQuestionCount = 0;
units.forEach((unit, unitIndex) => {
  const expected = TEXTBOOK_STAGES.flatMap((stage) => referenceKeys(stage.id, unit.studyRefs[stage.id] || []));
  const actual = [];
  unit.typeIds.forEach((typeId) => {
    const type = typeById(typeId);
    if (!type) throw new Error(`unknown type ${typeId}`);
    if (!type.worksheetCode && !GENERATORS[type.generator]) throw new Error(`missing generator ${type.generator}`);
    if (textbookGuideForType(typeId) === expectedGuideFallback) throw new Error(`generic guide ${typeId}`);
    const refs = unit.typeStudyRefs?.[typeId];
    if (!refs) throw new Error(`missing study refs ${typeId}`);
    TEXTBOOK_STAGES.forEach((stage) => actual.push(...referenceKeys(stage.id, refs[stage.id] || [])));
  });
  const duplicate = actual.find((key, index) => actual.indexOf(key) !== index);
  if (duplicate) throw new Error(`${unit.label} duplicate source question ${duplicate}`);
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);
  const missing = expected.find((key) => !actualSet.has(key));
  const extra = actual.find((key) => !expectedSet.has(key));
  if (missing || extra || actual.length !== expected.length) throw new Error(`${unit.label} coverage mismatch missing=${missing || "-"} extra=${extra || "-"} ${actual.length}/${expected.length}`);
  if (actual.length !== expectedUnitCounts[unitIndex]) throw new Error(`${unit.label} source count ${actual.length}`);
  sourceQuestionCount += actual.length;
});
if (sourceQuestionCount !== 158) throw new Error(`book-09 source count ${sourceQuestionCount}`);

let generated = 0;
for (const typeId of book09TypeIds) {
  const type = typeById(typeId);
  const generator = GENERATORS[type.generator];
  for (const difficulty of [1,2,3]) {
    for (let index = 0; index < iterations; index += 1) {
      validate(generator({ difficulty }), typeId, difficulty);
      generated += 1;
    }
  }
}

const requestedUnitIterations = Number(process.env.BOOK09_UNIT_ITERATIONS || 100);
const unitIterations = Number.isFinite(requestedUnitIterations) ? Math.max(100, requestedUnitIterations) : 100;
assert(BOOK09_UNIT_TEST_SPECS.length === 25, "book09-unit-tests", 0, `단원 테스트 명세 수 ${BOOK09_UNIT_TEST_SPECS.length}`);
assert(Object.keys(BOOK09_UNIT_TEST_GENERATORS).length === 25, "book09-unit-tests", 0, `단원 테스트 생성기 수 ${Object.keys(BOOK09_UNIT_TEST_GENERATORS).length}`);
assert(BOOK09_UNIT_TEST_SPECS.every((spec, index) => spec.question === index + 1), "book09-unit-tests", 0, "단원 테스트 번호 순서 오류");

let unitGenerated = 0;
for (const spec of BOOK09_UNIT_TEST_SPECS) {
  const generator = BOOK09_UNIT_TEST_GENERATORS[spec.typeId];
  assert(typeof generator === "function", spec.typeId, 0, "단원 테스트 생성기 누락");
  for (const difficulty of [1, 2, 3]) {
    for (let index = 0; index < unitIterations; index += 1) {
      validateUnitTest(generator({ difficulty }), spec, difficulty);
      unitGenerated += 1;
    }
  }
}

const difficultyFingerprintQuestions = Array.from({ length: 25 }, (_, index) => index + 1);
const seededRandom = (seed) => {
  let state = seed >>> 0;
  return () => ((state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 4294967296);
};
const originalRandom = Math.random;
let difficultyFingerprintChecks = 0;
for (const question of difficultyFingerprintQuestions) {
  const spec = BOOK09_UNIT_TEST_SPECS.find((candidate) => candidate.question === question);
  for (const seed of [9121, 9122, 9123]) {
    const fingerprints = [1, 2, 3].map((difficulty) => {
      Math.random = seededRandom(seed);
      return unitDifficultyFingerprint(spec.generator({ difficulty }));
    });
    Math.random = originalRandom;
    assert(new Set(fingerprints).size === 3, spec.typeId, 0, `난이도 fingerprint가 1·2·3에서 구분되지 않음 (seed ${seed})`);
    difficultyFingerprintChecks += 1;
  }
}
Math.random = originalRandom;

console.log(`book-09 audit passed: ${sourceQuestionCount} source questions, ${typeIds.length} types (${book09TypeIds.length} new), ${generated.toLocaleString("en-US")} generated checks, ${unitGenerated.toLocaleString("en-US")} unit-test checks, ${difficultyFingerprintChecks} difficulty fingerprints`);
