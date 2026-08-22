import { CURRICULUM, TEXTBOOK_STAGES, textbookGuideForType, typeById } from "./source-data.js";
import { GENERATORS } from "./generators.js";
import { book09Markup } from "./book09-renderers.js";

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

console.log(`book-09 audit passed: ${sourceQuestionCount} source questions, ${typeIds.length} types (${book09TypeIds.length} new), ${generated.toLocaleString("en-US")} generated checks`);
