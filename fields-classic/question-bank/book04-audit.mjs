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

// ── 2차(2026-11-28) 새 생성기 독립 검산 도우미 ──
// 칸 조각을 한 칸씩 붙여 키우며 서로 다른 모양(돌리고 뒤집어 같은 것은 하나)을 모두 센다.
const freePolyominoMemo = new Map();
function freePolyominoes(size) {
  if (freePolyominoMemo.has(size)) return freePolyominoMemo.get(size);
  let shapes = new Map([[polyominoSignature([[0, 0]]), [[0, 0]]]]);
  for (let s = 1; s < size; s += 1) {
    const next = new Map();
    for (const cells of shapes.values()) {
      const has = new Set(cells.map(([r, c]) => `${r}:${c}`));
      for (const [r, c] of cells) for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        if (has.has(`${r + dr}:${c + dc}`)) continue;
        const grown = [...cells, [r + dr, c + dc]];
        next.set(polyominoSignature(grown), grown);
      }
    }
    shapes = next;
  }
  freePolyominoMemo.set(size, shapes);
  return shapes;
}

// 같은 조각만으로 rows×cols를 덮을 수 있는지: 맨 위 왼쪽 빈칸을 덮는 놓임을 모두 시도한다.
function rectTileableBy(rows, cols, cells) {
  const orients = new Map();
  for (const reflected of [false, true]) for (let turns = 0; turns < 4; turns += 1) {
    let t = cells.map(([r, c]) => [r, reflected ? -c : c]);
    for (let i = 0; i < turns; i += 1) t = t.map(([r, c]) => [c, -r]);
    t.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const [r0, c0] = t[0];
    const rel = t.map(([r, c]) => [r - r0, c - c0]);
    orients.set(JSON.stringify(rel), rel);
  }
  const filled = Array.from({ length: rows }, () => Array(cols).fill(false));
  const go = () => {
    let at = null;
    for (let r = 0; r < rows && !at; r += 1) for (let c = 0; c < cols; c += 1) if (!filled[r][c]) { at = [r, c]; break; }
    if (!at) return true;
    for (const rel of orients.values()) {
      const placed = rel.map(([dr, dc]) => [at[0] + dr, at[1] + dc]);
      if (!placed.every(([r, c]) => r >= 0 && c >= 0 && r < rows && c < cols && !filled[r][c])) continue;
      placed.forEach(([r, c]) => { filled[r][c] = true; });
      if (go()) return true;
      placed.forEach(([r, c]) => { filled[r][c] = false; });
    }
    return false;
  };
  return (rows * cols) % cells.length === 0 && go();
}

// 칸 목록을 같은 수의 두 덩어리(둘 다 이어짐)로 나누고, 두 덩어리가 같은 모양인 것을 모양마다 센다.
function countCongruentHalves(cells, adjacent, signature) {
  const N = cells.length;
  const isConnected = (list) => {
    const seen = new Set([0]);
    const queue = [0];
    while (queue.length) {
      const i = queue.shift();
      list.forEach((cell, j) => { if (!seen.has(j) && adjacent(list[i], cell)) { seen.add(j); queue.push(j); } });
    }
    return seen.size === list.length;
  };
  const shapes = new Set();
  const choose = (start, picked) => {
    if (picked.length === N / 2) {
      const a = picked.map((i) => cells[i]);
      const b = cells.filter((_, i) => !picked.includes(i));
      if (isConnected(a) && isConnected(b) && signature(a) === signature(b)) shapes.add(signature(a));
      return;
    }
    for (let i = start; i < N; i += 1) choose(i + 1, [...picked, i]);
  };
  choose(1, [0]);
  return shapes;
}
const squareAdjacent = ([a, b], [c, d]) => Math.abs(a - c) + Math.abs(b - d) === 1;
const triangleCorners = ([a, b, up]) => (up ? [[a, b], [a + 1, b], [a, b + 1]] : [[a + 1, b], [a, b + 1], [a + 1, b + 1]]);
const triangleAdjacent = (s, t) => {
  const keys = new Set(triangleCorners(s).map(String));
  return triangleCorners(t).filter((p) => keys.has(String(p))).length === 2;
};
// 삼각형 칸 모양: 여섯 방향 돌리기와 뒤집기 가운데 가장 작은 글자.
function triangleSignature(tris) {
  const out = [];
  for (const flip of [false, true]) {
    for (let turn = 0; turn < 6; turn += 1) {
      const corners = tris.map((t) => triangleCorners(t).map(([a, b]) => {
        let p = flip ? [b, a] : [a, b];
        for (let i = 0; i < turn; i += 1) p = [-p[1], p[0] + p[1]];
        return p;
      }));
      const a0 = Math.min(...corners.flat().map((p) => p[0]));
      const b0 = Math.min(...corners.flat().map((p) => p[1]));
      out.push(corners.map((t) => t.map(([a, b]) => `${a - a0}.${b - b0}`).sort().join(",")).sort().join("/"));
    }
  }
  return out.sort()[0];
}
const halvesMemo = new Map();

// 칸 도형을 n칸씩 이어진 조각으로 나누는 모든 방법 가운데 accept(pieces)를 만족하는 것의 수.
function countPartitionsWithPieces(cells, n, accept, limit = 3, pieceOk = () => true) {
  const all = new Set(cells.map(([r, c]) => `${r}:${c}`));
  const order = [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(([r, c]) => `${r}:${c}`);
  const used = new Set();
  const pieces = [];
  let count = 0;
  const grow = (first) => {
    let sets = new Map([[first, [first]]]);
    for (let s = 1; s < n; s += 1) {
      const next = new Map();
      for (const piece of sets.values()) for (const cell of piece) {
        const [r, c] = cell.split(":").map(Number);
        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const k = `${r + dr}:${c + dc}`;
          if (!all.has(k) || used.has(k) || piece.includes(k)) continue;
          next.set([...piece, k].sort().join("|"), [...piece, k]);
        }
      }
      sets = next;
    }
    return [...sets.values()];
  };
  const run = () => {
    if (count >= limit) return;
    const first = order.find((k) => !used.has(k));
    if (!first) { if (accept(pieces.map((p) => p.map((k) => k.split(":").map(Number))))) count += 1; return; }
    for (const piece of grow(first)) {
      if (!pieceOk(piece.map((k) => k.split(":").map(Number)), pieces.map((p) => p.map((k) => k.split(":").map(Number))))) continue;
      piece.forEach((k) => used.add(k));
      pieces.push(piece);
      run();
      pieces.pop();
      piece.forEach((k) => used.delete(k));
    }
  };
  run();
  return count;
}

const pointInPolygonAudit = (poly, p) => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
    const a = poly[i];
    const b = poly[j];
    if ((a.y > p.y) !== (b.y > p.y) && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
};
const distToPolygonEdge = (poly, p) => Math.min(...poly.map((a, i) => {
  const b = poly[(i + 1) % poly.length];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}));

const permutationsAudit = (list) => (list.length < 2 ? [list] : list.flatMap((x, i) => permutationsAudit([...list.slice(0, i), ...list.slice(i + 1)]).map((rest) => [x, ...rest])));
const stripJosa = (word) => word.replace(/(이|가|은|는|과|와|을|를)$/u, "");

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
      // 접기 그림은 한 줄 흐름 SVG(처음 → 1번 접음 → …, 색종이 그림 기준 2026-11-21) — 장면 이름으로 센다
      assert((problemMarkup.match(/처음/g) || []).length === 1 && (problemMarkup.match(/번 접음/g) || []).length === meta.folds.length, id, difficulty, "fold stage count mismatch");
      assert(problem.answerVisual?.reveal === true, id, difficulty, "fold answer reveal missing");
      assert((book04Markup(problem.answerVisual).match(/#b03a5b/gi) || []).length === meta.cutCells.length, id, difficulty, "fold answer cut cells missing");
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
    case "polyomino-all-draw-b4": {
      const all = freePolyominoes(meta.size);
      assert(all.size === meta.total && problem.answer === `${all.size}가지`, id, difficulty, `free polyomino count ${all.size}`);
      const givenSigs = meta.given.map((g) => polyominoSignature(g.cells));
      assert(new Set(givenSigs).size === givenSigs.length && givenSigs.every((sig) => all.has(sig)), id, difficulty, "given pieces repeat or are not polyominoes");
      assert(meta.given.length + meta.missing.length === all.size, id, difficulty, "given + missing must be every shape");
      assert(problem.responseKind === "drawing" && problem.answerVisual?.kind === "fig", id, difficulty, "missing drawing answer");
      return;
    }
    case "same-piece-rect-tiling-b4": {
      const cannot = meta.options.filter((o) => !rectTileableBy(meta.rows, meta.cols, o.cells)).map((o) => o.option);
      assert(JSON.stringify(cannot) === JSON.stringify(meta.cannot), id, difficulty, `tiling check mismatch ${cannot}`);
      assert(cannot.length >= 1 && cannot.length < meta.options.length, id, difficulty, "all or no options tile");
      assert(problem.answer === cannot.map((n) => `${n}번`).join(", "), id, difficulty, "tiling answer mismatch");
      assert(new Set(meta.options.map((o) => polyominoSignature(o.cells))).size === meta.options.length, id, difficulty, "repeated option piece");
      return;
    }
    case "rect-halves-all-ways-b4": {
      const key = `sq${meta.rows}x${meta.cols}`;
      if (!halvesMemo.has(key)) {
        const cells = Array.from({ length: meta.rows * meta.cols }, (_, i) => [Math.floor(i / meta.cols), i % meta.cols]);
        halvesMemo.set(key, countCongruentHalves(cells, squareAdjacent, polyominoSignature));
      }
      const shapes = halvesMemo.get(key);
      assert(shapes.size === meta.total && problem.answer === `${shapes.size}가지`, id, difficulty, `rect halves count ${shapes.size}`);
      const drawn = meta.ways.map((cells) => polyominoSignature(cells));
      assert(new Set(drawn).size === drawn.length && drawn.every((sig) => shapes.has(sig)), id, difficulty, "drawn ways repeat or are wrong");
      assert(drawn.includes(polyominoSignature(meta.example)), id, difficulty, "example is not one of the ways");
      return;
    }
    case "triangle-grid-halves-b4": {
      const key = `tri:${meta.shape}`;
      if (!halvesMemo.has(key)) halvesMemo.set(key, countCongruentHalves(meta.tris, triangleAdjacent, triangleSignature));
      const shapes = halvesMemo.get(key);
      assert(meta.tris.length % 2 === 0 && shapes.size === meta.total && problem.answer === `${shapes.size}가지`, id, difficulty, `triangle halves count ${shapes.size}`);
      const drawn = meta.ways.map(triangleSignature);
      assert(new Set(drawn).size === drawn.length && drawn.every((sig) => shapes.has(sig)), id, difficulty, "drawn triangle ways wrong");
      assert(meta.total <= 5, id, difficulty, "more ways than drawing panels");
      return;
    }
    case "count-balanced-partition-b4": {
      const cells = Array.from({ length: meta.rows * meta.cols }, (_, i) => [Math.floor(i / meta.cols), i % meta.cols]);
      const n = cells.length / 4;
      const markSet = new Set(meta.marks.map(([r, c]) => `${r}:${c}`));
      const fits = (pieces) => new Set(pieces.map(polyominoSignature)).size === 1
        && pieces.every((piece) => piece.filter(([r, c]) => markSet.has(`${r}:${c}`)).length === meta.per);
      assert(meta.pieces.length === 4 && meta.pieces.every((p) => p.length === n && connected(p)) && fits(meta.pieces), id, difficulty, "given partition invalid");
      assert(new Set(meta.pieces.flat().map(String)).size === cells.length, id, difficulty, "partition does not cover");
      // 조각마다 도토리 수가 맞고 첫 조각과 같은 모양인 것만 이어 간다(가지치기 — 마지막에 fits로 다시 본다).
      const pieceOk = (piece, before) => piece.filter(([r, c]) => markSet.has(`${r}:${c}`)).length === meta.per
        && (!before.length || polyominoSignature(piece) === polyominoSignature(before[0]));
      assert(countPartitionsWithPieces(cells, n, fits, 3, pieceOk) === 1, id, difficulty, "balanced partition not unique");
      return;
    }
    case "fold-cut-two-corner-b4": {
      // 종이의 점을 접는 순서대로 접어 옮겼을 때 자른 조각 안에 들어가면 그 점은 잘려 나간다 — 펼친 구멍과 견준다.
      const fold = (p) => meta.lines.reduce((q, line) => {
        const side = (line.b.x - line.a.x) * (q.y - line.a.y) - (line.b.y - line.a.y) * (q.x - line.a.x);
        if (side * line.sign >= 0) return q;
        const dx = line.b.x - line.a.x;
        const dy = line.b.y - line.a.y;
        const t = ((q.x - line.a.x) * dx + (q.y - line.a.y) * dy) / (dx * dx + dy * dy);
        return { x: 2 * (line.a.x + t * dx) - q.x, y: 2 * (line.a.y + t * dy) - q.y };
      }, p);
      let bad = 0;
      for (let i = 0; i < 37; i += 1) for (let j = 0; j < 37; j += 1) {
        const p = { x: (i + 0.5) / 37, y: (j + 0.5) / 37 };
        const q = fold(p);
        if (distToPolygonEdge(meta.cut, q) < 0.01 || meta.holes.some((h) => distToPolygonEdge(h, p) < 0.01)) continue;
        if (pointInPolygonAudit(meta.cut, q) !== meta.holes.some((h) => pointInPolygonAudit(h, p))) bad += 1;
      }
      assert(bad === 0, id, difficulty, `unfolded holes mismatch at ${bad} points`);
      assert(meta.holes.length === 4 && problem.responseKind === "drawing", id, difficulty, "two folds must give four hole copies");
      return;
    }
    case "pyramid-wall-nth-b4": {
      let cubes = 0;
      for (let width = 1; width <= 2 * meta.k - 1; width += 2) cubes += width;
      assert(cubes === meta.answer && problem.answer === `${cubes}개`, id, difficulty, "pyramid wall count mismatch");
      assert(meta.k > meta.shown, id, difficulty, "asked figure is already drawn");
      return;
    }
    case "stepped-pyramid-hidden-b4": {
      const parts = [];
      meta.figures.forEach((figure) => {
        const h = figure.heights;
        const at = (r, c) => (r < 0 || c < 0 || r >= h.length || c >= h.length ? 0 : h[r][c]);
        let total = 0;
        let hidden = 0;
        for (let r = 0; r < h.length; r += 1) for (let c = 0; c < h.length; c += 1) for (let z = 0; z < h[r][c]; z += 1) {
          total += 1;
          // 바닥을 뺀 다섯 면이 모두 다른 나무에 막혀 있으면 보이지 않는다.
          if (z + 1 < h[r][c] && [[1, 0], [-1, 0], [0, 1], [0, -1]].every(([dr, dc]) => at(r + dr, c + dc) > z)) hidden += 1;
        }
        assert(total === figure.total && hidden === figure.hidden, id, difficulty, `pyramid hidden mismatch ${hidden}`);
        parts.push(`(${parts.length + 1}) ${hidden}개`);
      });
      assert(problem.answer === parts.join(", "), id, difficulty, "pyramid answer mismatch");
      return;
    }
    case "age-list-matching-b4": {
      const tests = meta.clues.map((text) => {
        let m = text.match(/^(.+?) (.+?)보다 (\d+)살 (많|적)습니다\.$/u);
        if (m) { const x = stripJosa(m[1]); const y = m[2]; const d = Number(m[3]) * (m[4] === "많" ? 1 : -1); return (q) => q[x] - q[y] === d; }
        m = text.match(/^(.+?) (.+?)의 동생입니다\.$/u);
        if (m) { const x = stripJosa(m[1]); const y = m[2]; return (q) => q[x] < q[y]; }
        return null;
      });
      assert(tests.every(Boolean), id, difficulty, "unparsed age clue");
      const fitsAll = permutationsAudit(meta.ages).map((list) => Object.fromEntries(meta.names.map((x, i) => [x, list[i]]))).filter((q) => tests.every((t) => t(q)));
      assert(fitsAll.length === 1 && fitsAll[0][meta.target] === meta.answer && problem.answer === `${meta.answer}살`, id, difficulty, `age assignment not unique (${fitsAll.length})`);
      return;
    }
    case "bib-rank-derangement-b4": {
      const tests = meta.clues.map((text) => {
        let m = text.match(/^(\d)번 선수: (\d)번 선수는 제 바로 뒤에 들어왔습니다\.$/u);
        if (m) { const a = Number(m[1]); const b = Number(m[2]); return (o) => o.indexOf(b) === o.indexOf(a) + 1; }
        m = text.match(/^(\d)번 선수: 저는 (\d)번 선수보다 먼저 들어왔습니다\.$/u);
        if (m) { const a = Number(m[1]); const b = Number(m[2]); return (o) => o.indexOf(a) < o.indexOf(b); }
        m = text.match(/^(\d)번 선수: 저는 1등도 꼴찌도 아닙니다\.$/u);
        if (m) { const a = Number(m[1]); return (o) => o.indexOf(a) !== 0 && o.indexOf(a) !== o.length - 1; }
        if (/^심판: 자기 등 번호와 같은 등수로 들어온 선수는 한 명도 없습니다\.$/u.test(text)) return (o) => o.every((b, i) => b !== i + 1);
        return null;
      });
      assert(tests.every(Boolean), id, difficulty, "unparsed bib clue");
      const bibs = Array.from({ length: meta.n }, (_, i) => i + 1);
      const fitsAll = permutationsAudit(bibs).filter((o) => tests.every((t) => t(o)));
      assert(fitsAll.length === 1 && JSON.stringify(fitsAll[0]) === JSON.stringify(meta.order), id, difficulty, `bib order not unique (${fitsAll.length})`);
      const withoutReferee = permutationsAudit(bibs).filter((o) => tests.slice(0, -1).every((t) => t(o)));
      assert(withoutReferee.length > 1, id, difficulty, "referee clue is not needed");
      assert(problem.answer === meta.order.map((b) => `${b}번`).join(", "), id, difficulty, "bib answer mismatch");
      return;
    }
    case "race-talk-ranking-b4": {
      const n = meta.names.length;
      const tests = meta.clues.map((text) => {
        const [speaker, said] = text.split(": ");
        let m = said.match(/^나는 (\d)명을 이겼어\.$/u);
        if (m) return (q) => q[speaker] === n - Number(m[1]);
        if (/맨 마지막으로 들어왔어\.$/u.test(said)) return (q) => q[speaker] === n;
        if (said === "나는 1등도 꼴찌도 아니었어.") return (q) => q[speaker] !== 1 && q[speaker] !== n;
        m = said.match(/^이번에는 (.+) 나를 이겼어\.$/u);
        if (m) { const x = stripJosa(m[1]); return (q) => q[x] < q[speaker]; }
        m = said.match(/^(.+) 나를 포함해서 (\d)명을 이겼어\.$/u);
        if (m) { const x = stripJosa(m[1]); const k = Number(m[2]); return (q) => q[x] === n - k && q[x] < q[speaker]; }
        m = said.match(/^나는 (.+)보다 먼저 들어왔어\.$/u);
        if (m) { const x = m[1]; return (q) => q[speaker] < q[x]; }
        return null;
      });
      assert(tests.every(Boolean), id, difficulty, `unparsed talk clue ${meta.clues[tests.findIndex((t) => !t)]}`);
      const fitsAll = permutationsAudit(meta.names).map((o) => Object.fromEntries(o.map((x, i) => [x, i + 1]))).filter((q) => tests.every((t) => t(q)));
      assert(fitsAll.length === 1 && meta.order.every((x, i) => fitsAll[0][x] === i + 1) && problem.answer === meta.order.join(", "), id, difficulty, `talk ranking not unique (${fitsAll.length})`);
      assert(new Set(meta.clues.map((c) => c.split(": ")[0])).size === meta.clues.length, id, difficulty, "a child speaks twice");
      return;
    }
    case "round-table-seat-b4": {
      const n = meta.n;
      const near = (a, b) => (a - b + n) % n === 1 || (b - a + n) % n === 1;
      const tests = meta.clues.map((text) => {
        let m = text.match(/^(.+?) (.+?)의 (오른쪽|왼쪽) 옆에 앉아 있습니다\.$/u);
        if (m) { const y = stripJosa(m[1]); const x = m[2]; const step = m[3] === "오른쪽" ? 1 : n - 1; return (o) => o.indexOf(y) === (o.indexOf(x) + step) % n; }
        m = text.match(/^(.+?) (.+?) 서로 떨어져 앉아 있습니다\.$/u);
        if (m) { const x = stripJosa(m[1]); const y = stripJosa(m[2]); return (o) => !near(o.indexOf(x), o.indexOf(y)); }
        m = text.match(/^(.+?) (.+?) (.+?) 사이에 앉아 있습니다\.$/u);
        if (m) { const z = stripJosa(m[1]); const x = stripJosa(m[2]); const y = m[3]; return (o) => near(o.indexOf(z), o.indexOf(x)) && near(o.indexOf(z), o.indexOf(y)); }
        return null;
      });
      assert(tests.every(Boolean), id, difficulty, `unparsed seat clue ${meta.clues[tests.findIndex((t) => !t)]}`);
      const rest = meta.names.filter((x) => x !== meta.anchor);
      const fitsAll = permutationsAudit(rest).map((o) => [meta.anchor, ...o]).filter((o) => tests.every((t) => t(o)));
      assert(fitsAll.length === 1 && fitsAll[0][meta.target] === problem.answer, id, difficulty, `round table not unique (${fitsAll.length})`);
      return;
    }
    case "person-item-full-match-b4": {
      const tests = meta.clues.map((text) => {
        let m = text.match(/^(.+?) (.+?) (.+?) (?:좋아하지|배우지) 않습니다\.$/u);
        if (m) { const p = stripJosa(m[1]); const a = stripJosa(m[2]); const b = stripJosa(m[3]); return (q) => q[p] !== a && q[p] !== b; }
        m = text.match(/^(.+?) (.+?) (?:좋아하지|배우지) 않습니다\.$/u);
        if (m) { const p = stripJosa(m[1]); const a = stripJosa(m[2]); return (q) => q[p] !== a; }
        m = text.match(/^(.+?) (?:좋아하는|배우는) 사람, (.+?), (.+?) (?:좋아하는|배우는) 사람은 서로 다른 친구입니다\.$/u);
        if (m) { const a = stripJosa(m[1]); const p = m[2]; const b = stripJosa(m[3]); return (q) => q[p] !== a && q[p] !== b; }
        m = text.match(/^(.+?) (.+?) (.+?) (?:좋아하는|배우는) 사람과 친구입니다\.$/u);
        if (m) { const p = stripJosa(m[1]); const p2 = stripJosa(m[2]); const a = stripJosa(m[3]); return (q) => q[p] !== a && q[p2] !== a; }
        return null;
      });
      assert(tests.every(Boolean), id, difficulty, `unparsed match clue ${meta.clues[tests.findIndex((t) => !t)]}`);
      const fitsAll = permutationsAudit(meta.items).map((o) => Object.fromEntries(meta.people.map((p, i) => [p, o[i]]))).filter((q) => tests.every((t) => t(q)));
      assert(fitsAll.length === 1 && meta.people.every((p) => fitsAll[0][p] === meta.truth[p]), id, difficulty, `matching not unique (${fitsAll.length})`);
      assert(problem.answer === meta.people.map((p) => `${p} ${meta.truth[p]}`).join(", "), id, difficulty, "matching answer mismatch");
      return;
    }
    case "grid-placement-b4": {
      const { rows, cols } = meta;
      const pos = (o, x) => { const i = o.indexOf(x); return [Math.floor(i / cols), i % cols]; };
      const tests = meta.clues.map((text) => {
        let m = text.match(/^(.+?) (.+?)의 바로 (위쪽 우리|위|아래|오른쪽 우리|오른쪽)에 있습니다\.$/u);
        if (m) {
          const x = stripJosa(m[1]); const y = m[2]; const where = m[3];
          return (o) => {
            const [a, b] = pos(o, x); const [c, e] = pos(o, y);
            if (where.startsWith("위")) return b === e && a === c - 1;
            if (where === "아래") return b === e && a === c + 1;
            return a === c && b === e + 1;
          };
        }
        m = text.match(/^(.+?) (.+?) 서로 붙어 있는 우리에 있습니다\.$/u);
        if (m) { const x = stripJosa(m[1]); const y = stripJosa(m[2]); return (o) => { const [a, b] = pos(o, x); const [c, e] = pos(o, y); return Math.abs(a - c) + Math.abs(b - e) === 1; }; }
        m = text.match(/^(.+?) (.+?) 가장 멀리 떨어진 두 우리에 있습니다\.$/u);
        if (m) {
          const x = stripJosa(m[1]); const y = stripJosa(m[2]);
          return (o) => { const [a, b] = pos(o, x); const [c, e] = pos(o, y); return Math.abs(a - c) + Math.abs(b - e) === rows - 1 + cols - 1; };
        }
        m = text.match(/^(.+?) (.+?) 같은 줄에 있습니다\.$/u);
        if (m) { const x = stripJosa(m[1]); const y = stripJosa(m[2]); return (o) => pos(o, x)[0] === pos(o, y)[0]; }
        return null;
      });
      assert(tests.every(Boolean), id, difficulty, `unparsed grid clue ${meta.clues[tests.findIndex((t) => !t)]}`);
      const others = meta.items.filter((x) => x !== meta.fixed);
      const fitsAll = permutationsAudit(others).map((o) => [...o.slice(0, meta.fixedIndex), meta.fixed, ...o.slice(meta.fixedIndex)]).filter((o) => tests.every((t) => t(o)));
      assert(fitsAll.length === 1 && fitsAll[0][meta.targetIndex] === problem.answer && JSON.stringify(fitsAll[0]) === JSON.stringify(meta.placed), id, difficulty, `grid placement not unique (${fitsAll.length})`);
      return;
    }
    default:
      // 1~3권과 Geometry Worksheet에서 이미 독립 검산한 재사용 생성기다.
      assert(meta.family || type.generator, id, difficulty, "reused generator has no audit identity");
  }
}

if (!book) throw new Error("book-04 missing");
if (units.length !== 4) throw new Error(`book-04 unit count ${units.length}`);
if (typeIds.length !== 92) throw new Error(`book-04 type count ${typeIds.length}`);
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
