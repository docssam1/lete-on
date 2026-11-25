import { GENERATORS } from "./generators.js";
import { book04Markup } from "./book04-renderers.js";
import { CURRICULUM, TEXTBOOK_STAGES, textbookGuideForType, typeById } from "./source-data.js";

const iterations = Number.parseInt(process.argv[2] || "1000", 10);
const book = CURRICULUM.find((item) => item.id === "book-04");
const units = book?.units || [];
const typeIds = [...new Set(units.flatMap((unit) => unit.typeIds))];
const unitTestQuestions = book?.source?.unitTestQuestions || [];
const unitTestTypeIds = [...new Set(unitTestQuestions.map((question) => question.typeId))];
const auditedTypeIds = [...new Set([...typeIds, ...unitTestTypeIds])];
const stages = TEXTBOOK_STAGES.map((stage) => stage.id);
const expectedUnitCounts = [42, 35, 34, 42];
const expectedUnitTestTypes = [
  "star-congruent-partition-draw-book4", "forest-congruent-partition-draw-book4", "digital-grid-upright-after-moves",
  "digital-self-half-turn-calculation", "rotational-partition-two", "fold-number-grid-two-orthogonal", "overlapping-paper-bottom",
  "cube-count-solid", "cube-fill-rectangular-box", "shape-difference-chain", "measurement-age-difference-book4",
  "measurement-distance-difference-book4", "balance-unit-ratio", "balance-unit-ratio", "race-third-place-book4",
  "directional-landmark-placement-book4", "circular-seat-blank-book4", "g1-front-back-between",
  "digital-grid-upright-after-moves", "cube-shell-interior-b9", "three-fold-cut-line-book4", "balance-unit-ratio",
  "measurement-time-difference-book4", "circular-seat-blank-book4", "front-back-two-order-totals-book4"
];

const fail = (id, difficulty, message) => { throw new Error(`${id} / L${difficulty}: ${message}`); };
const assert = (condition, id, difficulty, message) => { if (!condition) fail(id, difficulty, message); };
const firstNumber = (value) => Number(String(value).replaceAll(",", "").match(/-?\d+(?:\.\d+)?/)?.[0]);

function connected(cells) {
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

function polyominoSignature(cells) {
  const variants = [];
  for (const reflected of [false, true]) {
    for (let turns = 0; turns < 4; turns += 1) {
      let transformed = cells.map(([row, column]) => [row, reflected ? -column : column]);
      for (let turn = 0; turn < turns; turn += 1) transformed = transformed.map(([row, column]) => [column, -row]);
      const minRow = Math.min(...transformed.map(([row]) => row));
      const minColumn = Math.min(...transformed.map(([, column]) => column));
      variants.push(transformed.map(([row, column]) => [row - minRow, column - minColumn])
        .sort(([rowA, columnA], [rowB, columnB]) => rowA - rowB || columnA - columnB)
        .map(([row, column]) => `${row}:${column}`).join("|"));
    }
  }
  return variants.sort()[0];
}

const MAP_POSITIONS = [[0,0],[0,1],[1,0],[1,1]];
function mapDirection(from, to) {
  const vertical = to[0] < from[0] ? "북" : to[0] > from[0] ? "남" : "";
  const horizontal = to[1] < from[1] ? "서" : to[1] > from[1] ? "동" : "";
  return `${vertical}${horizontal}쪽`;
}

function transformGrid(grid, operation) {
  const rows = grid.length;
  const columns = grid[0].length;
  if (operation === "rotate-right") return Array.from({ length: columns }, (_, row) => Array.from({ length: rows }, (_, column) => grid[rows - 1 - column][row]));
  if (operation === "rotate-half") return grid.map((row) => [...row].reverse()).reverse();
  if (operation === "mirror-left-right") return grid.map((row) => [...row].reverse());
  return [...grid].reverse().map((row) => [...row]);
}

const BOARD_TRANSFORMS = Object.freeze({
  "rotate-right": [0, -1, 1, 0],
  "rotate-half": [-1, 0, 0, -1],
  "mirror-left-right": [-1, 0, 0, 1],
  "mirror-top-bottom": [1, 0, 0, -1]
});
const MATRIX_IDENTITY = [1, 0, 0, 1];

function multiplyMatrix(left, right) {
  return [
    left[0] * right[0] + left[1] * right[2],
    left[0] * right[1] + left[1] * right[3],
    left[2] * right[0] + left[3] * right[2],
    left[2] * right[1] + left[3] * right[3]
  ];
}

function applyBoardOperation(grid, operation) {
  const moved = transformGrid(grid, operation);
  return moved.map((row) => row.map((card) => ({ ...card, matrix: multiplyMatrix(BOARD_TRANSFORMS[operation], card.matrix) })));
}

const HALF_TURN_DIGITS = Object.freeze({ 0: 0, 2: 2, 5: 5, 6: 9, 8: 8, 9: 6 });
function halfTurnNumber(value) {
  const digits = String(value).split("").map(Number).reverse().map((digit) => HALF_TURN_DIGITS[digit]);
  return digits.some((digit) => digit == null) || digits[0] === 0 ? null : Number(digits.join(""));
}

function foldedCoordinate(row, column, size, folds) {
  let rows = size;
  let columns = size;
  folds.forEach((fold) => {
    if (fold.axis === "vertical") {
      column = Math.min(column, columns - 1 - column);
      columns /= 2;
    } else {
      row = Math.min(row, rows - 1 - row);
      rows /= 2;
    }
  });
  return { row, column };
}

function seatLabel(position, rows, columns) {
  const [row, column] = position;
  const vertical = rows === 1 ? "" : row === 0 ? "윗줄 " : "아랫줄 ";
  const horizontal = columns === 2 ? (column === 0 ? "왼쪽" : "오른쪽") : ["왼쪽", "가운데", "오른쪽"][column];
  return `${vertical}${horizontal}`.trim();
}

// ── 교재 번호 꼴 생성기(book04-structure-generators.js) 독립 검산 ──
// 생성기 코드를 쓰지 않고 다른 방법으로 다시 푼다: 저울은 무게를 모두 넣어 보고, 칸 나누기는 이어진 칸 묶음을 모두 세고,
// 줄 세우기는 조건 글을 다시 읽어 모든 순서를 따져 본다.
function balanceRatiosByBruteForce(balances, target, unit, maxWeight = 12) {
  const kinds = [...new Set(balances.flatMap((b) => [...Object.keys(b.left), ...Object.keys(b.right)]))];
  const ratios = new Set();
  const weights = {};
  const walk = (index) => {
    if (index === kinds.length) {
      const ok = balances.every((b) => Object.entries(b.left).reduce((t, [k, n]) => t + n * weights[k], 0) === Object.entries(b.right).reduce((t, [k, n]) => t + n * weights[k], 0));
      if (ok) ratios.add(weights[target] / weights[unit]);
      return;
    }
    for (let w = 1; w <= maxWeight; w += 1) { weights[kinds[index]] = w; walk(index + 1); }
  };
  walk(0);
  return ratios;
}

// 영역을 n칸짜리 이어진 조각으로 빈틈없이 나누는 방법(조각 모양 조건 포함)을 limit까지 센다.
function countConnectedPartitions(cells, n, accept, limit = 2) {
  const all = new Set(cells.map(([r, c]) => `${r}:${c}`));
  const order = [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(([r, c]) => `${r}:${c}`);
  const used = new Set();
  let count = 0;
  const shapes = [];
  const piecesFrom = (first) => {
    let sets = new Map([[first, [first]]]);
    for (let size = 1; size < n; size += 1) {
      const next = new Map();
      for (const piece of sets.values()) {
        for (const cell of piece) {
          const [r, c] = cell.split(":").map(Number);
          for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const k = `${r + dr}:${c + dc}`;
            if (!all.has(k) || used.has(k) || piece.includes(k)) continue;
            const grown = [...piece, k];
            next.set([...grown].sort().join("|"), grown);
          }
        }
      }
      sets = next;
    }
    return [...sets.values()];
  };
  const run = () => {
    if (count >= limit) return;
    const first = order.find((k) => !used.has(k));
    if (!first) {
      if (accept(shapes)) count += 1;
      return;
    }
    for (const piece of piecesFrom(first)) {
      piece.forEach((k) => used.add(k));
      shapes.push(polyominoSignature(piece.map((k) => k.split(":").map(Number))));
      run();
      shapes.pop();
      piece.forEach((k) => used.delete(k));
    }
  };
  run();
  return count;
}

// 줄 세우기 조건 글을 다시 읽어 시험 함수로.
function parseOrderClue(text) {
  const ord = { 첫: 1, 두: 2, 세: 3, 네: 4, 다섯: 5 };
  const name = "([가-힣A-F]+?)";
  const strip = (x) => x.replace(/(이|가|은|는|과|와)$/u, "");
  let m;
  const cnt = { 한: 1, 두: 2, 세: 3, 네: 4, 다섯: 5 };
  if ((m = text.match(new RegExp(`^${name}보다 뒤에 선 사람은 (\\d+)명입니다\\.$`, "u")))) return (q, n) => q[m[1]] === n - Number(m[2]);
  if ((m = text.match(new RegExp(`^([가-힣]+) 맨 뒤에 서 있습니다\\.$`, "u")))) { const x = strip(m[1]); return (q, n) => q[x] === n; }
  if ((m = text.match(new RegExp(`^${name}보다 앞에 선 사람은 (\\d+)명입니다\\.$`, "u")))) return (q) => q[m[1]] === Number(m[2]) + 1;
  if ((m = text.match(new RegExp(`^([가-힣]+) ${name} 바로 뒤에 서 있습니다\\.$`, "u")))) { const y = strip(m[1]); return (q) => q[y] - q[m[2]] === 1; }
  if ((m = text.match(new RegExp(`^([가-힣]+) ${name}보다 (한|두|세|네|다섯) 자리 (뒤|앞)에 서 있습니다\\.$`, "u")))) { const y = strip(m[1]); const k = cnt[m[3]] * (m[4] === "뒤" ? 1 : -1); return (q) => q[y] - q[m[2]] === k; }
  if ((m = text.match(new RegExp(`^([A-F])[은는] ([A-F])에서 (오른쪽|왼쪽)으로 (첫|두|세|네|다섯) 번째 자리에 있습니다\\.$`, "u")))) { const k = ord[m[4]] * (m[3] === "오른쪽" ? 1 : -1); return (q) => q[m[1]] - q[m[2]] === k; }
  if ((m = text.match(new RegExp(`^([가-힣]+) ${name}의 (오른쪽|왼쪽)에 서 있습니다\\.$`, "u")))) { const y = strip(m[1]); const right = m[3] === "오른쪽"; return (q) => (right ? q[y] > q[m[2]] : q[y] < q[m[2]]); }
  if ((m = text.match(new RegExp(`^${name}보다 먼저 들어온 사람은 ([가-힣]+)뿐입니다\\.$`, "u")))) return (q) => q[m[1]] === 2 && q[m[2]] === 1;
  if ((m = text.match(new RegExp(`^([가-힣]+) ${name} 바로 다음으로 들어왔습니다\\.$`, "u")))) { const y = strip(m[1]); return (q) => q[y] - q[m[2]] === 1; }
  if ((m = text.match(new RegExp(`^([가-힣]+) ([가-힣]+) 모두 ${name}보다 먼저 들어왔습니다\\.$`, "u")))) { const x = strip(m[1]); const y = strip(m[2]); return (q) => q[x] < q[m[3]] && q[y] < q[m[3]]; }
  if ((m = text.match(new RegExp(`^([가-힣]+) ${name}보다 먼저 들어왔습니다\\.$`, "u")))) { const x = strip(m[1]); return (q) => q[x] < q[m[2]]; }
  if ((m = text.match(new RegExp(`^([가-힣]+) 가장 늦게 들어왔습니다\\.$`, "u")))) { const x = strip(m[1]); return (q, n) => q[x] === n; }
  return null;
}

function orderPermutations(list) {
  if (list.length < 2) return [list];
  return list.flatMap((x, i) => orderPermutations([...list.slice(0, i), ...list.slice(i + 1)]).map((rest) => [x, ...rest]));
}

// 「A는 B보다 3kg 더 무겁습니다」 같은 비교 글 → [A, B, A − B].
function parseDifferenceClue(text) {
  const m = text.match(/^(.+?)[은는] (.+?)보다 (?:구슬이 )?(\d+)(?:kg|개|m|cm) (?:더 )?(무겁습니다|가볍습니다|많습니다|적습니다|앞에 있습니다|뒤에 있습니다|깁니다|짧습니다)\.$/u);
  if (!m) return null;
  const up = ["무겁습니다", "많습니다", "앞에 있습니다", "깁니다"].includes(m[4]);
  return [m[1], m[2], up ? Number(m[3]) : -Number(m[3])];
}

function differenceFromRelations(relations, a, b) {
  const value = new Map([[relations[0][0], 0]]);
  for (let pass = 0; pass < 4; pass += 1) {
    for (const [x, y, d] of relations) {
      if (value.has(y) && !value.has(x)) value.set(x, value.get(y) + d);
      if (value.has(x) && !value.has(y)) value.set(y, value.get(x) - d);
    }
  }
  return Math.abs(value.get(a) - value.get(b));
}

function validateSurface(problem, id, difficulty) {
  const text = [problem.prompt, problem.answer, problem.solution].join(" ");
  assert(problem.prompt?.trim(), id, difficulty, "prompt missing");
  assert(String(problem.answer ?? "").trim(), id, difficulty, "answer missing");
  assert(problem.solution?.trim(), id, difficulty, "solution missing");
  assert(!/undefined|NaN|\[object Object\]/.test(text), id, difficulty, "invalid text token");
  assert(!/나이을|나이를를|위치를를|시간를|시각를|별가|나무이|학교을|도서관를|은행를|백화점를|병원를|우체국를/.test(text), id, difficulty, "broken Korean particle");
  assert(!/퍼뮤테이션|컴비네이션|제곱/.test(text), id, difficulty, "child-facing forbidden term");
  if (problem.visual?.kind === "book4") assert(book04Markup(problem.visual), id, difficulty, "blank book4 visual markup");
  if (problem.answerVisual?.kind === "book4") assert(book04Markup(problem.answerVisual), id, difficulty, "blank book4 answer visual markup");
}

function validate(type, problem, difficulty) {
  const id = type.id;
  const meta = problem.meta || {};
  const numeric = firstNumber(problem.answer);
  validateSurface(problem, id, difficulty);

  switch (meta.family) {
    case "marked-congruent-partition-book4": {
      const expectedPieceSize = id === "forest-congruent-partition-draw-book4" ? 3 : 4;
      assert(meta.groups.length === 4 && meta.groups.every((group) => group.length === expectedPieceSize), id, difficulty, "partition piece size mismatch");
      const active = meta.groups.flat().map(([row, column]) => `${row}:${column}`);
      assert(active.length === expectedPieceSize * 4 && new Set(active).size === active.length, id, difficulty, "partition cells overlap or are missing");
      const signatures = meta.groups.map(polyominoSignature);
      assert(new Set(signatures).size === 1, id, difficulty, "partition pieces are not congruent");
      assert(meta.groups.every(connected), id, difficulty, "partition piece is disconnected");
      assert(meta.markerCells.length === 4, id, difficulty, "marker count mismatch");
      meta.groups.forEach((group, index) => assert(group.some(([row, column]) => `${row}:${column}` === `${meta.markerCells[index][0]}:${meta.markerCells[index][1]}`), id, difficulty, "marker is outside its piece"));
      assert(problem.responseKind === "drawing" && problem.answerVisual, id, difficulty, "partition drawing answer missing");
      return;
    }
    case "tetromino-family":
      assert(meta.optionValidity.filter((valid) => !valid).length === 1, id, difficulty, "non-tetromino answer not unique");
      meta.optionCells.forEach((cells, index) => assert(connected(cells) === meta.optionValidity[index], id, difficulty, "connectivity label mismatch"));
      assert(numeric === meta.correctOption, id, difficulty, "tetromino option mismatch");
      return;
    case "tetromino-fit":
      assert(meta.optionIds.filter((optionId) => optionId === meta.targetId).length === 1, id, difficulty, "fit answer not unique");
      assert(meta.optionIds[meta.correctOption - 1] === meta.targetId, id, difficulty, "fit option mismatch");
      return;
    case "digital-grid-transform": {
      const result = meta.operations.reduce((grid, operation) => transformGrid(grid, operation), meta.source);
      assert(JSON.stringify(result) === JSON.stringify(meta.result), id, difficulty, "grid transform mismatch");
      assert(result[meta.target.row][meta.target.column] === meta.answer && numeric === meta.answer, id, difficulty, "grid target mismatch");
      return;
    }
    case "digital-arithmetic": {
      const expected = meta.operator === "+" ? meta.rows[0].result + meta.rows[1].result : meta.rows[0].result - meta.rows[1].result;
      assert(expected === meta.answer && numeric === expected, id, difficulty, "digital arithmetic mismatch");
      assert(meta.operator !== "-" || expected >= 0, id, difficulty, "negative child answer");
      return;
    }
    case "digital-upright-grid": {
      const result = meta.operations.reduce((grid, operation) => applyBoardOperation(grid, operation), meta.grid);
      const upright = result.flat().filter((card) => card.matrix.join() === MATRIX_IDENTITY.join()).map((card) => card.value);
      assert(JSON.stringify(result) === JSON.stringify(meta.result), id, difficulty, "upright grid transform mismatch");
      assert(JSON.stringify(upright) === JSON.stringify(meta.uprightValues), id, difficulty, "upright digit list mismatch");
      assert(upright.reduce((sum, value) => sum + value, 0) === meta.answer && numeric === meta.answer, id, difficulty, "upright digit sum mismatch");
      assert(upright.length >= 2, id, difficulty, "too few upright digits");
      return;
    }
    case "digital-self-half-turn":
      meta.rows.forEach((row, index) => {
        assert(halfTurnNumber(row.source) === row.turned, id, difficulty, `row ${index + 1} half turn mismatch`);
        const expected = row.operator === "+" ? row.source + row.turned : Math.abs(row.source - row.turned);
        assert(expected === row.result && meta.answers[index] === expected, id, difficulty, `row ${index + 1} arithmetic mismatch`);
      });
      return;
    case "fold-number-grid": {
      const expectedCells = [];
      meta.grid.forEach((rowValues, row) => rowValues.forEach((value, column) => {
        const position = foldedCoordinate(row, column, meta.size, meta.folds);
        if (position.row === meta.target.row && position.column === meta.target.column) expectedCells.push(value);
      }));
      const actualCells = meta.cutCells.map((cell) => cell.value);
      assert(JSON.stringify(expectedCells) === JSON.stringify(actualCells), id, difficulty, "fold orbit mismatch");
      assert(expectedCells.reduce((sum, value) => sum + value, 0) === meta.answer && numeric === meta.answer, id, difficulty, "fold sum mismatch");
      assert(meta.cutCells.length === 2 ** meta.folds.length, id, difficulty, "fold layer count mismatch");
      const problemMarkup = book04Markup(problem.visual);
      assert(problemMarkup.includes("b4-fold-sequence"), id, difficulty, "fold sequence diagram missing");
      assert((problemMarkup.match(/<figure>/g) || []).length === meta.folds.length + 1, id, difficulty, "fold stage count mismatch");
      assert(problem.answerVisual?.reveal === true, id, difficulty, "fold answer reveal missing");
      assert(book04Markup(problem.answerVisual).includes("is-cut"), id, difficulty, "fold answer cut cells missing");
      return;
    }
    case "fold-number-grid-diagonal-two": {
      assert(meta.directions.length === 2 && meta.directions.every((direction) => direction === "d1" || direction === "d2"), id, difficulty, "diagonal fold structure mismatch");
      assert(meta.cutCells.length === 4, id, difficulty, "two diagonal folds must cut four cells");
      assert(meta.cutCells.reduce((sum, cell) => sum + cell.value, 0) === meta.answer && numeric === meta.answer, id, difficulty, "diagonal fold sum mismatch");
      return;
    }
    case "fold-cut-unfold-draw":
      assert(meta.foldCount === (meta.structure === "one-fold" ? 1 : 2), id, difficulty, "fold count label mismatch");
      assert(meta.directions.length === meta.foldCount, id, difficulty, "fold direction count mismatch");
      assert(meta.unfoldedCuts.length === 2 ** meta.foldCount, id, difficulty, "unfolded cut count mismatch");
      assert(problem.responseKind === "drawing" && problem.answerVisual, id, difficulty, "drawing answer missing");
      return;
    case "fold-surface-top": {
      const allLabels = meta.finalStacks.flat(2);
      assert(allLabels.length === 4 && new Set(allLabels).size === 4, id, difficulty, "surface stack lost or duplicated a cell");
      assert(meta.finalStacks[meta.target.row][meta.target.column][0] === meta.answer, id, difficulty, "top surface mismatch");
      return;
    }
    case "overlapping-paper-order": {
      assert(meta.boardSize === 4 && meta.paperSize === 2, id, difficulty, "paper dimensions mismatch");
      assert(meta.layers.length >= 5 && meta.layers.length <= 8, id, difficulty, "paper count mismatch");
      assert(new Set(meta.layers.map((paper) => paper.label)).size === meta.layers.length, id, difficulty, "paper labels must be unique");
      assert(new Set(meta.layers.map((paper) => `${paper.row}:${paper.column}`)).size === meta.layers.length, id, difficulty, "paper positions must be unique");
      meta.layers.forEach((paper) => {
        assert(Number.isInteger(paper.row) && paper.row >= 0 && paper.row <= meta.boardSize - meta.paperSize, id, difficulty, "paper row is outside the board");
        assert(Number.isInteger(paper.column) && paper.column >= 0 && paper.column <= meta.boardSize - meta.paperSize, id, difficulty, "paper column is outside the board");
      });
      meta.layers.slice(1).forEach((paper, index) => {
        const previous = meta.layers[index];
        assert(Math.abs(paper.row - previous.row) <= 1 && Math.abs(paper.column - previous.column) <= 1, id, difficulty, "consecutive papers must overlap");
      });
      assert(meta.layers.at(-1).label === meta.answer && problem.answer === meta.answer, id, difficulty, "bottom paper mismatch");
      const problemMarkup = book04Markup(problem.visual);
      const answerMarkup = book04Markup(problem.answerVisual);
      assert((problemMarkup.match(/class="b4-paper-stack"/g) || []).length === 1, id, difficulty, "problem must open with one overlapping-paper scene");
      assert(problemMarkup.includes("class=\"b4-paper-toggle\""), id, difficulty, "paper removal steps must stay behind learner control");
      assert((answerMarkup.match(/b4-paper-stack/g) || []).length === meta.layers.length, id, difficulty, "answer removal sequence is incomplete");
      return;
    }
    case "pair-sum-cards":
      meta.pairs.forEach((pair) => assert(pair[0] + pair[1] === meta.target, id, difficulty, "pair sum mismatch"));
      assert(meta.pairs[meta.blankPair][meta.blankSide] === meta.answer && numeric === meta.answer, id, difficulty, "blank card mismatch");
      return;
    case "shape-difference-chain":
      meta.increments.forEach((difference, index) => assert(meta.values[index + 1] - meta.values[index] === difference, id, difficulty, "shape difference mismatch"));
      assert(meta.values.at(-1) - meta.values[0] === meta.answer && numeric === meta.answer, id, difficulty, "shape target mismatch");
      return;
    case "measurement-order": {
      const values = [meta.base];
      meta.differences.forEach((difference) => values.push(values.at(-1) + difference));
      assert(JSON.stringify(values) === JSON.stringify(meta.values), id, difficulty, "measurement chain mismatch");
      assert(meta.values[meta.targetIndex] === meta.answer && numeric === meta.answer, id, difficulty, "measurement answer mismatch");
      return;
    }
    case "measurement-difference": {
      const offsets = [0];
      meta.increments.forEach((difference) => offsets.push(offsets.at(-1) + difference));
      assert(JSON.stringify(offsets) === JSON.stringify(meta.offsets), id, difficulty, "difference offsets mismatch");
      meta.rules.forEach((rule) => {
        const first = meta.names.indexOf(rule.first);
        const second = meta.names.indexOf(rule.second);
        const actual = meta.offsets[first] - meta.offsets[second];
        assert(rule.relation === "more" ? actual === rule.difference : actual === -rule.difference, id, difficulty, "difference clue mismatch");
      });
      assert(meta.offsets[meta.secondIndex] - meta.offsets[meta.firstIndex] === meta.answer && numeric === meta.answer, id, difficulty, "difference answer mismatch");
      assert(meta.secondIndex - meta.firstIndex >= 2, id, difficulty, "target difference is stated directly instead of requiring linked clues");
      const targetPair = new Set([meta.names[meta.firstIndex], meta.names[meta.secondIndex]]);
      assert(!meta.rules.some((rule) => targetPair.has(rule.first) && targetPair.has(rule.second)), id, difficulty, "target pair appears together in a clue");
      const expectedScene = {
        "measurement-age-difference-book4": "age",
        "measurement-distance-difference-book4": "distance",
        "measurement-time-difference-book4": "time"
      }[id];
      if (expectedScene) assert(meta.sceneId === expectedScene, id, difficulty, `scene changed to ${meta.sceneId}`);
      return;
    }
    case "balance-unit-ratio":
      assert(meta.ratios.reduce((product, ratio) => product * ratio, 1) === meta.answer && numeric === meta.answer, id, difficulty, "balance ratio mismatch");
      return;
    case "directional-seat": {
      const positions = meta.path.map(([row, column]) => `${row}:${column}`);
      assert(new Set(positions).size === meta.rows * meta.columns, id, difficulty, "seat path repeats or misses a position");
      meta.path.slice(1).forEach(([row, column], index) => {
        const [previousRow, previousColumn] = meta.path[index];
        assert(Math.abs(row - previousRow) + Math.abs(column - previousColumn) === 1, id, difficulty, "seat clue is not adjacent");
      });
      const target = meta.placements.find((placement) => placement.name === meta.target);
      assert(target && seatLabel([target.row, target.column], meta.rows, meta.columns) === meta.answer, id, difficulty, "seat answer mismatch");
      return;
    }
    case "directional-landmark-map-book4":
      assert(meta.places.length === 4 && new Set(meta.places).size === 4, id, difficulty, "landmark names repeat");
      assert(meta.targetIndex >= 0 && meta.targetIndex < 4 && !meta.shownIndexes.includes(meta.targetIndex), id, difficulty, "target landmark is already shown");
      assert(meta.places[meta.targetIndex] === meta.answer && problem.answer === meta.answer, id, difficulty, "landmark answer mismatch");
      assert(mapDirection(MAP_POSITIONS[meta.mainAnchor], MAP_POSITIONS[meta.targetIndex]) === meta.targetDirection, id, difficulty, "landmark direction mismatch");
      assert(problem.answerVisual, id, difficulty, "landmark answer map missing");
      return;
    case "circular-seat": {
      const expected = meta.relation === "마주 보는"
        ? (meta.targetIndex + meta.count / 2) % meta.count
        : (meta.targetIndex + 1) % meta.count;
      assert(expected === meta.answerIndex && meta.clockwise[expected] === meta.answer, id, difficulty, "circular answer mismatch");
      assert(new Set(meta.clockwise).size === meta.count, id, difficulty, "circular names repeat");
      return;
    }
    case "ordinal-line":
      assert(meta.uniqueCount === 1 && numeric === meta.answer, id, difficulty, "ordinal line answer not unique");
      return;
    case "race-third-place-book4":
      assert(meta.candidateOrders.length === 1, id, difficulty, "race order is not uniquely determined");
      assert(new Set(meta.candidateOrders.map((order) => order[2])).size === 1, id, difficulty, "third place is not unique");
      assert(meta.candidateOrders[0][2] === meta.answer && problem.answer === meta.answer, id, difficulty, "third place answer mismatch");
      assert(problem.visual.clues.length === 3, id, difficulty, "race clues must stay in three source-like groups");
      assert(problem.prompt.length <= 30, id, difficulty, "race prompt is too long");
      assert(problem.answerVisual?.reveal === true, id, difficulty, "race answer order missing");
      assert((book04Markup(problem.answerVisual).match(/<li/g) || []).length === 5, id, difficulty, "race answer rank row missing");
      return;
    case "circular-seat-blank-book4":
      assert(meta.candidateOrders.length > 0, id, difficulty, "circle candidates missing");
      assert(new Set(meta.candidateOrders.map((order) => order[meta.targetSeat])).size === 1, id, difficulty, "marked circular seat is not unique");
      assert(meta.candidateOrders[0][meta.targetSeat] === meta.answer && problem.answer === meta.answer, id, difficulty, "marked circular seat mismatch");
      assert(meta.rules.length >= 3 && meta.rules.length <= 5, id, difficulty, "circle clues must stay within the source range of three to five");
      assert(problem.prompt.includes("㉠") && problem.visual.subtype === "circular-seat-blank", id, difficulty, "source marked-seat structure missing");
      assert(problem.answerVisual?.reveal === true && problem.answerVisual.order?.[meta.targetSeat] === meta.answer, id, difficulty, "circular answer diagram missing");
      return;
    case "three-fold-cut-line-book4":
      assert(meta.folds === 3 && meta.gridRows === 2 && meta.gridColumns === 4, id, difficulty, "source fold/grid structure mismatch");
      assert(JSON.stringify(meta.foldDirections) === JSON.stringify(["right-to-left", "top-to-bottom", "right-to-left"]), id, difficulty, "source fold directions mismatch");
      assert([1.35, 1.5, 1.65].includes(meta.cutApexY), id, difficulty, "source V-cut apex mismatch");
      assert(meta.cutSegments.length === 16, id, difficulty, "two cut lines across eight layers must unfold to sixteen lines");
      const segmentKeys = new Set(meta.cutSegments.map((segment) => segment.join(":")));
      assert(segmentKeys.size === 16, id, difficulty, "unfolded cut lines must be unique");
      meta.cutSegments.forEach((segment) => segment.forEach((value, index) => assert(value >= 0 && value <= (index % 2 ? meta.gridRows : meta.gridColumns), id, difficulty, "unfolded cut line leaves the paper")));
      assert(segmentKeys.has([0, meta.cutApexY, 1, 1].join(":")), id, difficulty, "source V cut is missing");
      meta.cutSegments.forEach(([x1, y1, x2, y2]) => {
        assert(segmentKeys.has([4 - x1, y1, 4 - x2, y2].join(":")), id, difficulty, "left-right reflection is missing");
        assert(segmentKeys.has([x1, 2 - y1, x2, 2 - y2].join(":")), id, difficulty, "top-bottom reflection is missing");
      });
      assert(problem.responseKind === "drawing" && problem.answerVisual, id, difficulty, "drawing answer missing");
      return;
    case "front-back-two-orders-book4": {
      const first = meta.firstFront + meta.between + 1 + meta.secondBack - 1;
      const second = meta.firstFront - meta.between - 1 + meta.secondBack - 1;
      assert(first === meta.firstBeforeSecond && second === meta.secondBeforeFirst, id, difficulty, "two-order total mismatch");
      assert(first > 0 && second > 0, id, difficulty, "non-positive line total");
      return;
    }
    case "mixed-pan-balance-b4": {
      const ratios = balanceRatiosByBruteForce(meta.balances, meta.target, meta.unit);
      assert(ratios.size === 1 && ratios.has(meta.answer) && numeric === meta.answer, id, difficulty, `balance ratio not unique: ${[...ratios].join(",")}`);
      assert(meta.balances.length === (id === "mixed-pan-balance-three-b4" ? 3 : 2), id, difficulty, "balance count mismatch");
      assert(problem.visual?.kind === "fig" && (problem.visual.html.match(/<svg/g) || []).length === meta.balances.length, id, difficulty, "balance figure count mismatch");
      return;
    }
    case "polyomino-partition-b4": {
      const spec = { pentominoTwo: [5, 2], tetrominoTwoSame: [4, 2], trominoFourSame: [3, 4], tetrominoThreeSame: [4, 3], pentominoGivenFour: [5, 4] }[meta.spec];
      assert(spec, id, difficulty, "unknown partition spec");
      const [size, count] = spec;
      const same = meta.spec !== "pentominoTwo";
      const givenSignature = meta.given ? meta.regions[0] && null : null;
      for (const region of meta.regions) {
        assert(region.cells.length === size * count && connected(region.cells), id, difficulty, "partition region size or connection mismatch");
        assert(region.pieces.length === count, id, difficulty, "partition piece count mismatch");
        if (meta.given) assert(region.pieces.every((piece) => piece === meta.given), id, difficulty, "partition does not use the given piece");
        const accept = (shapes) => !same || new Set(shapes).size === 1;
        const ways = countConnectedPartitions(region.cells, size, accept);
        if (!meta.given) assert(ways === 1, id, difficulty, `partition not unique (${ways})`);
        else assert(ways >= 1, id, difficulty, "given-piece partition impossible");
      }
      void givenSignature;
      assert(problem.responseKind === "drawing" && problem.answerVisual?.kind === "fig", id, difficulty, "partition drawing answer missing");
      return;
    }
    case "order-offset-placement-b4": {
      const n = meta.order.length;
      const tests = meta.clues.map(parseOrderClue);
      assert(tests.every(Boolean), id, difficulty, `unparsed order clue: ${meta.clues[tests.findIndex((t) => !t)]}`);
      const fits = orderPermutations(meta.order).map((list) => Object.fromEntries(list.map((x, i) => [x, i + 1]))).filter((q) => tests.every((t) => t(q, n)));
      assert(fits.length === 1 && meta.order.every((x, i) => fits[0][x] === i + 1), id, difficulty, `order not unique (${fits.length})`);
      assert(meta.order.includes(problem.answer), id, difficulty, "order answer is not a person");
      return;
    }
    case "shape-difference-tree-b4": {
      const relations = meta.equations.map((text) => { const m = text.match(/^(.+)=(.+?)([+-])(\d+)$/u); return [m[1], m[2], (m[3] === "+" ? 1 : -1) * Number(m[4])]; });
      assert(differenceFromRelations(relations, meta.target[0], meta.target[1]) === meta.answer && numeric === meta.answer, id, difficulty, "shape difference mismatch");
      assert(!relations.some(([x, y]) => (x === meta.target[0] && y === meta.target[1]) || (x === meta.target[1] && y === meta.target[0])), id, difficulty, "target pair is given directly");
      return;
    }
    case "measurement-relative-difference-b4": {
      const relations = meta.clues.map(parseDifferenceClue);
      assert(relations.every(Boolean), id, difficulty, "unparsed difference clue");
      assert(differenceFromRelations(relations, meta.target[0], meta.target[1]) === meta.answer && numeric === meta.answer, id, difficulty, "measurement difference mismatch");
      return;
    }
    case "polyline-turn-four-b4": {
      // 화면 좌표(아래로 갈수록 y가 큼)에서 시계 방향 반의 반 바퀴: (x, y) → (3 − y, x). 네 번 돌리면 처음으로.
      const turn = (points, times) => points.map(([x, y]) => { let p = [x, y]; for (let i = 0; i < times; i += 1) p = [3 - p[1], p[0]]; return p; });
      const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
      assert([1, 2, 3, 0].every((times, index) => same(turn(meta.points, times), meta.turned[index])), id, difficulty, "turned polyline mismatch");
      assert(new Set(meta.turned.slice(0, 3).map((p) => JSON.stringify(p))).size === 3, id, difficulty, "turned shapes repeat");
      assert(problem.responseKind === "drawing" && problem.answerVisual?.kind === "fig", id, difficulty, "turn drawing answer missing");
      return;
    }
    case "polyline-flip-four-b4": {
      const up = meta.points.map(([x, y]) => [x, 3 - y]);
      const side = meta.points.map(([x, y]) => [3 - x, y]);
      assert([up, up, side, side].every((points, index) => JSON.stringify(points) === JSON.stringify(meta.flipped[index])), id, difficulty, "flipped polyline mismatch");
      assert(problem.responseKind === "drawing" && problem.answerVisual?.kind === "fig", id, difficulty, "flip drawing answer missing");
      return;
    }
    case "digital-flip-turn-set-b4": {
      // 막대 이름 대신 막대의 두 끝점 좌표로 다시 뒤집어 본다.
      const ends = { a: [[0, 0], [1, 0]], b: [[1, 0], [1, 1]], c: [[1, 1], [1, 2]], d: [[0, 2], [1, 2]], e: [[0, 1], [0, 2]], f: [[0, 0], [0, 1]], g: [[0, 1], [1, 1]] };
      const toSet = (segs) => new Set([...segs].map((s) => ends[s].map(([x, y]) => `${x},${y}`).sort().join("-")));
      const move = (segs, fx, fy) => new Set([...segs].map((s) => ends[s].map(([x, y]) => `${fx ? 1 - x : x},${fy ? 2 - y : y}`).sort().join("-")));
      const eq = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));
      const first = meta.order[0] === "side" ? move(meta.start, true, false) : move(meta.start, false, true);
      assert(eq(first, toSet(meta.mid)), id, difficulty, "first flip mismatch");
      assert(eq(move(meta.start, true, true), toSet(meta.end)) && eq(toSet(meta.end), toSet(meta.half)), id, difficulty, "two flips are not a half turn");
      assert(/반 바퀴/.test(problem.answer), id, difficulty, "digital set answer missing half turn");
      return;
    }
    case "digital-three-moves-board-b4": {
      // 행렬을 쓰지 않고 칸 하나의 위·오른쪽 방향 화살표를 직접 움직여 다시 센다.
      const act = { LR: ([x, y]) => [-x, y], UD: ([x, y]) => [x, -y], CW: ([x, y]) => [-y, x], CCW: ([x, y]) => [y, -x], R180: ([x, y]) => [-x, -y] };
      const keyVectors = { I: [[0, -1], [1, 0]], LR: [[0, -1], [-1, 0]], UD: [[0, 1], [1, 0]], R180: [[0, 1], [-1, 0]], CW: [[1, 0], [0, 1]], CCW: [[-1, 0], [0, -1]], T: [[-1, 0], [0, 1]], AT: [[1, 0], [0, -1]] };
      const upright = meta.cells.filter((cell) => {
        let [up, right] = keyVectors[cell.key];
        for (const op of meta.ops) { up = act[op](up); right = act[op](right); }
        return up[0] === 0 && up[1] === -1 && right[0] === 1 && right[1] === 0;
      }).map((cell) => cell.value);
      assert(JSON.stringify(upright) === JSON.stringify(meta.upright), id, difficulty, `upright cells mismatch ${upright}`);
      const expected = meta.n === 2 ? upright[0] : upright.reduce((a, b) => a + b, 0);
      assert(meta.n !== 2 || upright.length === 1, id, difficulty, "2x2 board must have one upright number");
      assert(expected === meta.answer && problem.answer.endsWith(`(2) ${expected}`), id, difficulty, "board answer mismatch");
      assert(!meta.cells.some((cell) => [6, 8, 9].includes(cell.value) && upright.includes(cell.value)), id, difficulty, "look-alike digit stands upright");
      return;
    }
    case "floor-from-top-b4": {
      // 위에서부터 한 층씩 내려가며 센다.
      let floor = meta.total;
      for (let i = 1; i < meta.fromTop; i += 1) floor -= 1;
      assert(floor === meta.floor && meta.floor >= 1 && meta.fromTop >= 1, id, difficulty, "floor count mismatch");
      assert(problem.answer === (meta.askFloor ? `${floor}층` : `${meta.fromTop}번째`), id, difficulty, "floor answer mismatch");
      return;
    }
    default:
      // 1~3권과 Geometry Worksheet에서 이미 독립 검산한 재사용 생성기다.
      assert(meta.family || type.generator, id, difficulty, "reused generator has no audit identity");
  }
}

if (!book) throw new Error("book-04 missing");
if (units.length !== 4) throw new Error(`book-04 unit count ${units.length}`);
if (typeIds.length !== 76) throw new Error(`book-04 type count ${typeIds.length}`);
if (unitTestQuestions.length !== 25) throw new Error(`book-04 unit test count ${unitTestQuestions.length}`);
unitTestQuestions.forEach((question, index) => {
  if (question.number !== index + 1) throw new Error(`book-04 unit test number ${question.number}, expected ${index + 1}`);
  if (question.typeId !== expectedUnitTestTypes[index]) throw new Error(`book-04 unit test ${question.number} type ${question.typeId}, expected ${expectedUnitTestTypes[index]}`);
  if (!question.verified) throw new Error(`book-04 unit test ${question.number} is not verified`);
  if (!typeById(question.typeId)) throw new Error(`book-04 unit test ${question.number} unknown type ${question.typeId}`);
});

let sourceQuestionCount = 0;
units.forEach((unit, unitIndex) => {
  const seen = new Set();
  let unitCount = 0;
  for (const typeId of unit.typeIds) {
    const type = typeById(typeId);
    if (!type) throw new Error(`unknown type ${typeId}`);
    if (!type.generator && !type.worksheetCode) throw new Error(`no generation route ${typeId}`);
    if (textbookGuideForType(typeId).startsWith("문제에 보이는 관계")) throw new Error(`generic guide ${typeId}`);
    const references = unit.typeStudyRefs?.[typeId];
    if (!references) throw new Error(`typeStudyRefs missing ${typeId}`);
    for (const stage of stages) {
      for (const reference of references[stage] || []) {
        if (!Array.isArray(reference.numbers) || !reference.numbers.length) throw new Error(`problem numbers missing ${typeId}/${stage}`);
        for (const number of reference.numbers) {
          if (!Number.isInteger(number) || number < 1) throw new Error(`invalid problem number ${typeId}/${stage}`);
          const key = `${stage}:${reference.section}:${reference.group}:${number}`;
          if (seen.has(key)) throw new Error(`duplicate source question ${unit.label}/${key}`);
          seen.add(key);
          unitCount += 1;
        }
      }
    }
  }
  if (unitCount !== expectedUnitCounts[unitIndex]) throw new Error(`${unit.label} source count ${unitCount}, expected ${expectedUnitCounts[unitIndex]}`);
  sourceQuestionCount += unitCount;
});

const variants = new Map();
let generated = 0;
let worksheetOnly = 0;
for (const typeId of auditedTypeIds) {
  const type = typeById(typeId);
  // Geometry Worksheet 생성기는 브라우저에서 전역 GW_GEN을 로드한 뒤 동작한다.
  // Node 감사에서는 승인된 연결만 확인하고 실제 수학·그림은 브라우저 QA에서 검사한다.
  if (type.worksheetCode) {
    assert(type.worksheetCode && type.bankApproved, typeId, 0, "worksheet-only type is not approved");
    worksheetOnly += 1;
    continue;
  }
  const generator = GENERATORS[type.generator];
  assert(generator, typeId, 0, `missing generator ${type.generator}`);
  for (const difficulty of [1, 2, 3]) {
    const fingerprints = new Set();
    for (let run = 0; run < iterations; run += 1) {
      let problem = null;
      for (let attempt = 0; attempt < 100 && !problem; attempt += 1) problem = generator({ difficulty });
      assert(problem, typeId, difficulty, "generator returned null");
      validate(type, problem, difficulty);
      fingerprints.add(JSON.stringify(problem.meta || { prompt: problem.prompt, answer: problem.answer, visual: problem.visual }));
      generated += 1;
    }
    assert(fingerprints.size >= 3, typeId, difficulty, `only ${fingerprints.size} variants`);
    variants.set(`${typeId}/L${difficulty}`, fingerprints.size);
  }
}

assert(sourceQuestionCount === 153, "book-04", 0, `source count ${sourceQuestionCount}`);
const minVariants = Math.min(...variants.values());
console.log(`BOOK04_AUDIT_OK types=${typeIds.length} unitTestQuestions=${unitTestQuestions.length} unitTestTypes=${unitTestTypeIds.length} sourceQuestions=${sourceQuestionCount} generated=${generated} worksheetOnly=${worksheetOnly} minVariants=${minVariants}`);
