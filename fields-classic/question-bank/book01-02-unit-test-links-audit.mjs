import { GENERATORS } from "./generators.js";
import { book01Markup } from "./book01-renderers.js";
import { book02Markup } from "./book02-renderers.js";
import { CURRICULUM, typeById } from "./source-data.js";
import {
  BOOK01_02_UNIT_TEST_LINKS,
  BOOK01_UNIT_TEST_LINKS,
  BOOK02_UNIT_TEST_LINKS,
  LEARNER_STAGE
} from "./book01-02-unit-test-links.js";

const failures = [];
const variants = Number.parseInt(process.argv[2] || "3", 10);

const fail = (message) => failures.push(message);
const assert = (condition, message) => {
  if (!condition) fail(message);
};

const curriculumTypeIds = (bookId) => {
  const book = CURRICULUM.find((entry) => entry.id === bookId);
  return new Set(book?.units.flatMap((unit) => unit.typeIds) || []);
};

const auditLinks = (bookId, links) => {
  assert(links.length === 25, `${bookId}: expected exactly 25 links, got ${links.length}`);
  assert(links.every((entry, index) => entry.number === index + 1), `${bookId}: question numbers must be 1..25`);
  assert(new Set(links.map((entry) => entry.number)).size === 25, `${bookId}: duplicate question number`);

  const typeIds = curriculumTypeIds(bookId);
  const sourcePrefix = `book${bookId.slice(-2)}`;
  for (const entry of links) {
    const prefix = `${bookId} q${String(entry.number).padStart(2, "0")}`;
    assert(typeof entry.label === "string" && entry.label.trim(), `${prefix}: label missing`);
    assert(entry.sourceLocator === `${sourcePrefix}-unit-test:q${String(entry.number).padStart(2, "0")}`, `${prefix}: unstable source locator`);
    assert(typeof entry.sourceVisualSignature === "string" && entry.sourceVisualSignature.trim(), `${prefix}: visual signature missing`);
    assert(entry.sourceContract && typeof entry.sourceContract === "object", `${prefix}: source contract missing`);
    assert(entry.sourceContract.responseKind && entry.sourceContract.answerShape && entry.sourceContract.visualShape, `${prefix}: incomplete source contract`);
    assert(entry.difficulty >= 1 && entry.difficulty <= 3, `${prefix}: difficulty outside 1..3`);
    assert(["classified", "exact-generator"].includes(entry.sourceFidelity), `${prefix}: unsupported source fidelity ${entry.sourceFidelity}`);
    assert(entry.generationCaseMode === (entry.sourceFidelity === "exact-generator" ? "source" : "variant-from-source"), `${prefix}: generationCase mode mismatch`);
    if (entry.verified) {
      assert(typeof entry.typeId === "string" && typeIds.has(entry.typeId), `${prefix}: verified link is not a current ${bookId} curriculum type`);
      assert(entry.generatorContract && typeof entry.generatorContract === "object", `${prefix}: verified generator contract missing`);
      assert(entry.sourceContract.responseKind === entry.generatorContract.responseKind, `${prefix}: response kind mismatch`);
      assert(entry.sourceContract.answerShape === entry.generatorContract.answerShape, `${prefix}: answer shape mismatch`);
      assert(entry.sourceContract.visualShape === entry.generatorContract.visualShape, `${prefix}: visual shape mismatch`);
      assert(entry.sourceContract.conditionSignature === entry.generatorContract.conditionSignature, `${prefix}: condition contract mismatch`);
      assert(!entry.reason, `${prefix}: verified link must not have a hold reason`);
    } else {
      assert(entry.typeId === null || (typeof entry.typeId === "string" && typeIds.has(entry.typeId)), `${prefix}: held candidate typeId is not a current curriculum type`);
      if (entry.typeId) assert(entry.generatorContract && typeof entry.generatorContract === "object", `${prefix}: held candidate generator contract missing`);
      assert(typeof entry.reason === "string" && entry.reason.trim(), `${prefix}: blocked link needs an explicit reason`);
    }
  }
};

const render = (bookId, problem) => {
  if (!problem.visual) return "";
  if (bookId === "book-01" && problem.visual.kind === "book1") return book01Markup(problem.visual);
  if (bookId === "book-02") return book02Markup(problem.visual);
  return "";
};

const permutationsOf = (values) => {
  if (values.length <= 1) return [values];
  return values.flatMap((value, index) => permutationsOf(values.filter((_, itemIndex) => itemIndex !== index)).map((tail) => [value, ...tail]));
};

function sudokuCompletionCount(meta) {
  const { size, cells } = meta;
  const board = [...cells];
  const digits = Array.from({ length: size }, (_, index) => index + 1);
  const regionOf = (index) => meta.regionMap
    ? meta.regionMap[index]
    : Math.floor(Math.floor(index / size) / meta.regionRows) * (size / meta.regionColumns) + Math.floor((index % size) / meta.regionColumns);
  const valid = (index, value) => {
    const row = Math.floor(index / size);
    const column = index % size;
    for (let cursor = 0; cursor < size; cursor += 1) {
      if (board[row * size + cursor] === value || board[cursor * size + column] === value) return false;
    }
    const region = regionOf(index);
    return !board.some((item, itemIndex) => item === value && regionOf(itemIndex) === region);
  };
  const visit = () => {
    const index = board.indexOf(null);
    if (index < 0) return 1;
    let count = 0;
    for (const value of digits) {
      if (!valid(index, value)) continue;
      board[index] = value;
      count += visit();
      board[index] = null;
      if (count > 1) return count;
    }
    return count;
  };
  return visit();
}

// ── 1권 권별테스트 원본 구조 생성기 독립 검산 ─────────────────────────────
// 생성기 코드를 다시 부르지 않고, 문제에 실린 그림·조건만으로 답을 다시 구한다.
const sumOf = (values) => values.reduce((total, value) => total + value, 0);
const cellKey = ([row, column]) => `${row}:${column}`;
function shapeCanonical(cells) {
  const keys = [];
  for (let flip = 0; flip < 2; flip += 1) for (let turn = 0; turn < 4; turn += 1) {
    let moved = cells.map(([row, column]) => [row, flip ? -column : column]);
    for (let step = 0; step < turn; step += 1) moved = moved.map(([row, column]) => [column, -row]);
    const minRow = Math.min(...moved.map(([row]) => row));
    const minColumn = Math.min(...moved.map(([, column]) => column));
    keys.push(moved.map(([row, column]) => [row - minRow, column - minColumn]).map(cellKey).sort().join("|"));
  }
  return keys.sort()[0];
}
// 4×4를 이어진 네 칸짜리 조각 넷으로 나누는 모든 방법을 칸을 하나씩 붙여 가며 찾는다(생성기의 테트로미노 표와 다른 방법).
const ALL_QUAD_PARTITIONS = (() => {
  const found = [];
  const labels = Array(16).fill(-1);
  const neighbors = (index) => [index - 4, index + 4, index % 4 ? index - 1 : -1, index % 4 < 3 ? index + 1 : -1].filter((value) => value >= 0 && value < 16);
  const grow = (piece, set, done) => {
    if (set.length === 4) {
      const key = [...set].sort((a, b) => a - b).join(",");
      if (done.has(key)) return;
      done.add(key);
      set.forEach((index) => { labels[index] = piece; });
      place(piece + 1);
      set.forEach((index) => { labels[index] = -1; });
      return;
    }
    const frontier = new Set(set.flatMap(neighbors).filter((index) => labels[index] === -1 && !set.includes(index)));
    for (const next of frontier) grow(piece, [...set, next], done);
  };
  const place = (piece) => {
    const first = labels.indexOf(-1);
    if (first < 0) { found.push([...labels]); return; }
    grow(piece, [first], new Set());
  };
  place(0);
  return found;
})();
const quadPieces = (labels) => [0, 1, 2, 3].map((piece) => labels.map((label, index) => (label === piece ? index : -1)).filter((index) => index >= 0));
const CONGRUENT_QUADS = ALL_QUAD_PARTITIONS.filter((labels) => new Set(quadPieces(labels).map((cells) => shapeCanonical(cells.map((index) => [Math.floor(index / 4), index % 4])))).size === 1);
const samePartition = (a, b) => quadPieces(a).every((cells) => cells.every((index) => b[index] === b[cells[0]]));

const MIRROR_GLYPH = { 0: 0, 1: 1, 2: 5, 5: 2, 8: 8 };
const HALF_TURN_GLYPH = { 0: 0, 1: 1, 2: 2, 5: 5, 6: 9, 8: 8, 9: 6 };
const turnTwoDigit = (digits, table) => {
  const out = [digits[1], digits[0]].map((digit) => table[digit]);
  return out.some((digit) => digit === undefined) ? null : out[0] * 10 + out[1];
};

// 색종이: 한 점을 접힌 조각 안으로 차례로 접어 넣는다(생성기는 반대로 펼친다).
const FOLD_F = { h: (p) => p.y - 0.5, v: (p) => p.x - 0.5, d1: (p) => p.y - p.x, d2: (p) => p.x + p.y - 1 };
const FOLD_M = { h: (p) => ({ x: p.x, y: 1 - p.y }), v: (p) => ({ x: 1 - p.x, y: p.y }), d1: (p) => ({ x: p.y, y: p.x }), d2: (p) => ({ x: 1 - p.y, y: 1 - p.x }) };
const foldInto = (point, folds) => folds.reduce((p, fold) => (fold.keep * FOLD_F[fold.line](p) < 0 ? FOLD_M[fold.line](p) : p), point);
const unfoldAll = (point, folds) => folds.reduceRight((points, fold) => points.concat(points.map((p) => FOLD_M[fold.line](p))), [point]);
const triangleSide = (p) => {
  const column = Math.min(3, Math.floor(p.x * 4));
  const row = Math.min(3, Math.floor(p.y * 4));
  const dx = p.x * 4 - column - 0.5;
  const dy = p.y * 4 - row - 0.5;
  return { row, column, side: Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "bottom" : "top") };
};
const SAMPLE_OFFSETS = { top: [0.5, 0.18], right: [0.82, 0.5], bottom: [0.5, 0.82], left: [0.18, 0.5] };
function foldCutCells(folds, cutUnits, prefix) {
  const isCut = (located) => cutUnits.some((unit) => unit.row === located.row && unit.column === located.column && unit.sides.includes(located.side));
  const cells = [];
  for (let row = 0; row < 4; row += 1) for (let column = 0; column < 4; column += 1) {
    const marks = Object.values(SAMPLE_OFFSETS).map(([ox, oy]) => isCut(triangleSide(foldInto({ x: (column + ox) / 4, y: (row + oy) / 4 }, folds))));
    assert(marks.every(Boolean) || !marks.some(Boolean), `${prefix}: a cell was only partly cut`);
    if (marks.every(Boolean)) cells.push(row * 4 + column);
  }
  return cells;
}
const pointInPolygon = (polygon, [x, y]) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const lineClip = (line, polygon) => {
  const value = (p) => line.a * p[0] + line.b * p[1] - line.c;
  const points = [];
  polygon.forEach((a, index) => {
    const b = polygon[(index + 1) % polygon.length];
    const fa = value(a);
    const fb = value(b);
    if (Math.abs(fa) < 1e-9) points.push(a);
    else if (fa * fb < -1e-18) points.push([a[0] + (b[0] - a[0]) * fa / (fa - fb), a[1] + (b[1] - a[1]) * fa / (fa - fb)]);
  });
  return points.length >= 2 ? [points[0], points.at(-1)] : null;
};
function rasterPieceKinds(segments, resolution = 360) {
  const blocked = new Uint8Array(resolution * resolution);
  for (const [a, b] of segments) {
    const steps = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) * resolution * 3) + 2;
    for (let k = 0; k <= steps; k += 1) {
      const x = (a[0] + (b[0] - a[0]) * k / steps) * resolution;
      const y = (a[1] + (b[1] - a[1]) * k / steps) * resolution;
      for (let dy = -1; dy <= 1; dy += 1) for (let dx = -1; dx <= 1; dx += 1) {
        const px = Math.floor(x + dx);
        const py = Math.floor(y + dy);
        if (px >= 0 && py >= 0 && px < resolution && py < resolution) blocked[py * resolution + px] = 1;
      }
    }
  }
  const owner = new Int32Array(resolution * resolution).fill(-1);
  const kinds = { triangle: 0, diamond: 0, other: 0 };
  let region = 0;
  for (let start = 0; start < owner.length; start += 1) {
    if (blocked[start] || owner[start] >= 0) continue;
    const stack = [start];
    owner[start] = region;
    let count = 0;
    let x0 = resolution; let y0 = resolution; let x1 = 0; let y1 = 0;
    while (stack.length) {
      const index = stack.pop();
      count += 1;
      const x = index % resolution;
      const y = Math.floor(index / resolution);
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
      for (const next of [x > 0 ? index - 1 : -1, x < resolution - 1 ? index + 1 : -1, index - resolution, index + resolution]) {
        if (next >= 0 && next < owner.length && !blocked[next] && owner[next] < 0) { owner[next] = region; stack.push(next); }
      }
    }
    if (count > 40) {
      const inset = 4;
      const corners = [[x0 + inset, y0 + inset], [x1 - inset, y0 + inset], [x0 + inset, y1 - inset], [x1 - inset, y1 - inset]]
        .filter(([x, y]) => owner[y * resolution + x] === region).length;
      const w = x1 - x0 + 1;
      const h = y1 - y0 + 1;
      const fill = count / (w * h);
      if (corners >= 1 && fill > 0.35 && fill < 0.62) kinds.triangle += 1;
      else if (!corners && Math.abs(w - h) <= 4 && fill > 0.38 && fill < 0.6) kinds.diamond += 1;
      else kinds.other += 1;
    }
    region += 1;
  }
  return kinds;
}

const forEachPermutation = (values, visit) => permutationsOf(values).forEach(visit);
const completions = (cards, shown, valid) => {
  const used = shown.filter((value) => value != null);
  const free = cards.filter((value) => !used.includes(value));
  const blanks = shown.map((value, index) => (value == null ? index : -1)).filter((index) => index >= 0);
  const found = [];
  forEachPermutation(free, (order) => {
    const values = [...shown];
    blanks.forEach((index, position) => { values[index] = order[position]; });
    if (valid(values)) found.push(values);
  });
  return found;
};

function book01SourceCheck(problem, prefix) {
  const meta = problem.meta;
  const n = meta.sourceNumber;
  const answerNumber = Number.parseInt(problem.answer, 10);
  const items = problem.visual?.subtype === "ut-set" ? problem.visual.items : null;
  if (["drawing", "drawing-plus-text"].includes(problem.responseKind)) assert(problem.answerVisual, `${prefix}: drawing answer visual missing`);
  if (n === 1) {
    assert(items?.length === 2 && meta.boards.length === 2, `${prefix}: q1 needs two boards`);
    meta.boards.forEach((board, index) => {
      const symbols = board.symbols;
      assert([1, 2, 3, 4].every((value) => symbols.filter((item) => item === value).length === 4), `${prefix}: q1 board ${index + 1} numbers`);
      const matches = CONGRUENT_QUADS.filter((labels) => meta.guides.every(([a, b]) => labels[a] !== labels[b])
        && quadPieces(labels).every((cells) => new Set(cells.map((cell) => symbols[cell])).size === 4));
      assert(matches.length === 1 && samePartition(matches[0], board.labels), `${prefix}: q1 board ${index + 1} must have exactly one partition`);
      assert(problem.answerVisual.items[index].visual.labels.join() === board.labels.join(), `${prefix}: q1 answer drawing disagrees`);
    });
    assert(meta.boards[0].labels.join() !== meta.boards[1].labels.join(), `${prefix}: q1 two boards must differ`);
  } else if (n === 5) {
    assert(meta.occupied.filter(Boolean).length === meta.perPiece * 4, `${prefix}: q5 squirrel total`);
    const matches = CONGRUENT_QUADS.filter((labels) => quadPieces(labels).every((cells) => cells.filter((cell) => meta.occupied[cell]).length === meta.perPiece));
    assert(matches.length === 1 && samePartition(matches[0], problem.answerVisual.labels), `${prefix}: q5 must have exactly one fence`);
  } else if (n === 2 || n === 3) {
    assert(items?.length === 2 && meta.items.length === 2, `${prefix}: q${n} needs two subproblems`);
    const table = n === 2 ? MIRROR_GLYPH : HALF_TURN_GLYPH;
    const forbidden = n === 2 ? [15, 82] : [61, 52];
    meta.items.forEach((item, index) => {
      const value = item.digits[0] * 10 + item.digits[1];
      const result = turnTwoDigit(item.digits, table);
      assert(result === item.result && result !== value && Math.floor(result / 10) > 0, `${prefix}: q${n} item ${index + 1} transform disagrees`);
      assert(!forbidden.includes(value), `${prefix}: q${n} reuses a source number`);
      assert(items[index].visual.digits.join() === item.digits.join(), `${prefix}: q${n} picture digits disagree`);
      if (n === 2) assert(problem.answer.includes(`(${index + 1}) ${result}`), `${prefix}: q2 answer ${index + 1} missing`);
      else {
        assert(value + result === item.sum && item.sum < 100, `${prefix}: q3 sum disagrees`);
        assert(problem.answer.includes(`(${index + 1}) 돌린 수 ${result}, 합 ${item.sum}`), `${prefix}: q3 answer ${index + 1} missing`);
      }
    });
    assert(meta.items[0].digits.join() !== meta.items[1].digits.join(), `${prefix}: q${n} two subproblems must differ`);
  } else if (n === 4) {
    const cells = problem.visual.cells;
    assert(cells.length === 9 && new Set(cells.map((cell) => cell.digit)).size === 9, `${prefix}: q4 board digits`);
    // 화면 변환 행렬: 오른쪽 뒤집기 = x 뒤집기, 아래 뒤집기 = y 뒤집기. 처음 자세에 둘을 차례로 곱해 단위 행렬이면 똑바로 선다.
    const M = { normal: [1, 0, 0, 1], rot90: [0, -1, 1, 0], rot180: [-1, 0, 0, -1], rot270: [0, 1, -1, 0], flipX: [-1, 0, 0, 1], flipY: [1, 0, 0, -1] };
    const mul = ([a, b, c, d], [e, f, g, h]) => [a * e + b * g, a * f + b * h, c * e + d * g, c * f + d * h];
    const upright = cells.filter((cell) => mul(M.flipY, mul(M.flipX, M[cell.state])).join() === "1,0,0,1").map((cell) => cell.digit);
    assert(answerNumber === sumOf(upright) && upright.length >= 2, `${prefix}: q4 upright sum disagrees`);
    assert(cells.every((cell) => ![6, 8, 9].includes(cell.digit) || !["normal", "rot180"].includes(cell.state)), `${prefix}: q4 look-alike digit placed ambiguously`);
    assert(cells.every((cell) => cell.digit !== 8 || ["rot90", "rot270"].includes(cell.state)), `${prefix}: q4 8 must lie sideways`);
  } else if (n === 6 || n === 9) {
    const list = n === 6 ? meta.items : [meta];
    if (n === 6) assert(items?.length === 2, `${prefix}: q6 needs two subproblems`);
    list.forEach((item, index) => {
      assert(item.folds.length === (n === 6 ? 1 : 2) && item.folds.every((fold) => ["d1", "d2"].includes(fold.line)), `${prefix}: q${n} fold structure changed`);
      const cells = foldCutCells(item.folds, item.cutUnits, prefix);
      assert(cells.join() === item.cutCells.join(), `${prefix}: q${n} item ${index + 1} cut cells disagree`);
      const value = sumOf(cells.map((cell) => meta.numbers[Math.floor(cell / 4)][cell % 4]));
      assert(value === item.answer && (n === 9 ? answerNumber === value : problem.answer.includes(`(${index + 1}) ${value}`)), `${prefix}: q${n} sum disagrees`);
    });
  } else if (n === 8) {
    const removed = problem.answerVisual.panels[0].items.filter((item) => item.role === "removed").map((item) => item.pts);
    assert(meta.folds.length === 2 && removed.length === meta.cuts.length * 4, `${prefix}: q8 unfolded cut count`);
    let mismatch = 0;
    const steps = 113;
    for (let j = 0; j < steps; j += 1) for (let i = 0; i < steps; i += 1) {
      const p = [(i + 0.37) / steps, (j + 0.61) / steps];
      const folded = foldInto({ x: p[0], y: p[1] }, meta.folds);
      const cut = meta.cuts.some((polygon) => pointInPolygon(polygon, [folded.x, folded.y]));
      if (cut !== removed.some((polygon) => pointInPolygon(polygon, p))) mismatch += 1;
    }
    assert(mismatch <= steps * steps * 0.006, `${prefix}: q8 unfolded drawing disagrees (${mismatch})`);
  } else if (n === 10) {
    assert(meta.folds.length === 2 && meta.cutSet !== undefined, `${prefix}: q10 structure`);
    const packet = meta.packet;
    const segments = meta.cutLines.map((line) => lineClip(line, packet)).filter(Boolean)
      .flatMap(([a, b]) => {
        const as = unfoldAll({ x: a[0], y: a[1] }, meta.folds);
        const bs = unfoldAll({ x: b[0], y: b[1] }, meta.folds);
        return as.map((p, index) => [[p.x, p.y], [bs[index].x, bs[index].y]]);
      });
    const kinds = rasterPieceKinds(segments);
    assert(kinds.other === 0 && kinds.triangle === meta.triangles && kinds.diamond === meta.diamonds, `${prefix}: q10 raster count ${JSON.stringify(kinds)} disagrees`);
    assert(!(meta.triangles === 8 && meta.diamonds === 4), `${prefix}: q10 reproduces the source cut`);
    assert(problem.answer === `삼각형 ${meta.triangles}개, 마름모 ${meta.diamonds}개`, `${prefix}: q10 answer text`);
  } else if (n === 11) {
    const packet = meta.packet;
    const centers = [];
    for (const hole of meta.holes) {
      if (hole.type === "circle") assert(pointInPolygon(packet, [hole.cx, hole.cy]), `${prefix}: q11 circle outside the folded paper`);
      else {
        const onCrease = meta.folds.some((fold) => Math.abs(FOLD_F[fold.line]({ x: hole.cx, y: hole.cy })) < 1e-3);
        assert(onCrease, `${prefix}: q11 half circle must sit on a fold line`);
      }
      unfoldAll({ x: hole.cx, y: hole.cy }, meta.folds).forEach((p) => {
        if (!centers.some((center) => Math.hypot(center.x - p.x, center.y - p.y) < 2e-3)) centers.push(p);
      });
    }
    assert(answerNumber === centers.length && centers.length === meta.circleCount * 4 + meta.semiCount * 2, `${prefix}: q11 hole count disagrees`);
  } else if (n === 12 || n === 13) {
    const size = n === 12 ? 5 : 7;
    assert(meta.cards.length === size && problem.visual.boards.length === 3, `${prefix}: q${n} needs three diagrams`);
    assert(meta.cards.join() !== (n === 12 ? "2,4,6,8,10" : "3,4,5,6,7,8,9"), `${prefix}: q${n} reuses the source cards`);
    const found = new Map();
    forEachPermutation(meta.cards, (order) => {
      const center = order[0];
      const sums = n === 12 ? [order[1] + center + order[2], order[3] + center + order[4]] : [order[1] + center + order[4], order[2] + center + order[5], order[3] + center + order[6]];
      if (sums.every((value) => value === sums[0])) {
        if (!found.has(center)) found.set(center, new Set());
        found.get(center).add(sums[0]);
      }
    });
    assert(found.size === 3 && [...found.values()].every((set) => set.size === 1), `${prefix}: q${n} must have three centers`);
    const expected = [...found].sort((a, b) => a[0] - b[0]).map(([center, set]) => `가운데 ${center}, 합 ${[...set][0]}`).join(" / ");
    assert(problem.answer === expected, `${prefix}: q${n} answer disagrees`);
    problem.answerVisual.boards.forEach((board, index) => {
      const lines = n === 12 ? [[board.top, board.center, board.bottom], [board.left, board.center, board.right]]
        : [0, 1, 2].map((k) => [board.petals[k], board.center, board.petals[k + 3]]);
      assert(lines.every((line) => sumOf(line) === problem.answerVisual.sums[index]), `${prefix}: q${n} answer drawing ${index + 1} invalid`);
    });
  } else if (n === 14) {
    const lines = [[0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 0]];
    const found = completions(meta.cards, problem.visual.shown, (values) => lines.every((line) => sumOf(line.map((index) => values[index])) === meta.lineSum));
    assert(found.length === 1 && found[0].join() === problem.answerVisual.shown.join(), `${prefix}: q14 must have one completion`);
    assert(!(meta.cards[0] === 2 && meta.lineSum === 18), `${prefix}: q14 reuses the source condition`);
  } else if (n === 15) {
    assert(items?.length === 2 && meta.items.length === 2 && meta.items[0].lineSum !== meta.items[1].lineSum, `${prefix}: q15 needs two triangles`);
    assert(meta.cards[0] !== 3 && meta.cards.every((value, index) => value === meta.cards[0] + index), `${prefix}: q15 cards`);
    const lines = [[0, 1, 3], [0, 2, 5], [3, 4, 5]];
    meta.items.forEach((item, index) => {
      const found = completions(meta.cards, item.shown, (values) => lines.every((line) => sumOf(line.map((cell) => values[cell])) === item.lineSum));
      assert(found.length === 1 && found[0].join() === problem.answerVisual.items[index].visual.shown.join(), `${prefix}: q15 triangle ${index + 1} must have one completion`);
    });
  } else if (n === 16) {
    const rowsOf = (v) => [v[0] + v[1], v[3] + v[4] + v[5], v[7] + v[8]];
    const columnsOf = (v) => [v[0] + v[3], v[1] + v[4] + v[7], v[5] + v[8]];
    const mask = problem.visual.mask;
    const base = problem.visual.shown.map((value, index) => (mask[index] ? value : 0));
    const found = completions(meta.cards, base, (values) => rowsOf(values).join() === meta.rowSums.join() && columnsOf(values).join() === meta.columnSums.join());
    assert(found.length === 1 && found[0].every((value, index) => !mask[index] || value === problem.answerVisual.shown[index]), `${prefix}: q16 must have one completion`);
    assert(meta.cards.length === 7 && problem.visual.shown.filter((value, index) => mask[index] && value != null).length === 1, `${prefix}: q16 needs seven cards and one given`);
    assert(meta.cards.join() !== "1,2,3,6,7,8,9", `${prefix}: q16 reuses the source cards`);
  } else if (n === 18) {
    const centers = new Set();
    forEachPermutation(meta.cards, ([top, left, center, right, bottom]) => {
      if (top + center + bottom === left + center + right && left + center + right === top + left + right + bottom) centers.add(center);
    });
    assert(centers.size === 1 && [...centers][0] === answerNumber && meta.cards.join() !== "1,2,3,4,5", `${prefix}: q18 center disagrees`);
  } else if (n === 19) {
    const found = Array.from({ length: 90 }, (_, index) => index + 10).filter((value) => value > meta.lower && value < meta.upper && Math.floor(value / 10) + (value % 10) === meta.digitSum && value % 2 === meta.parity);
    assert(found.length === 1 && found[0] === answerNumber, `${prefix}: q19 answer disagrees`);
    assert(!(meta.lower === 50 && meta.upper === 70 && meta.digitSum === 8), `${prefix}: q19 reuses the source condition`);
    assert(problem.visual.clues.some((clue) => clue.includes(String(meta.digitSum))) && problem.visual.clues.some((clue) => clue.includes(String(meta.lower))), `${prefix}: q19 conditions not shown`);
  } else if (n === 20) {
    const found = Array.from({ length: 90 }, (_, index) => index + 10).filter((value) => value > meta.lower && value % 2 === 0 && Math.floor(value / 10) - (value % 10) === meta.gap);
    assert(found.length === 1 && found[0] === answerNumber && !(meta.lower === 70 && meta.gap === 4), `${prefix}: q20 answer disagrees`);
  } else if (n === 21) {
    const found = Array.from({ length: 900 }, (_, index) => index + 100).filter((value) => {
      const [h, t, o] = String(value).split("").map(Number);
      const step = meta.direction === "down" ? -meta.step : meta.step;
      const sum = h + t + o;
      return t - h === step && o - t === step && (meta.compare === "큰" ? sum > meta.threshold : sum < meta.threshold) && sum % 2 === meta.parity;
    });
    assert(found.length === 1 && found[0] === answerNumber, `${prefix}: q21 answer disagrees`);
    assert(!(meta.direction === "down" && meta.step === 1 && meta.threshold === 20 && meta.compare === "큰" && meta.parity === 0), `${prefix}: q21 reuses the source condition`);
    assert(problem.visual.places?.join() === "백,십,일", `${prefix}: q21 place table missing`);
  } else if ([22, 23, 24].includes(n)) {
    const size = n === 23 ? 4 : 3;
    const people = n === 24 ? meta.jobs : meta.names;
    const things = n === 22 ? meta.items : n === 23 ? meta.colors : meta.places;
    const found = permutationsOf(Array.from({ length: size }, (_, index) => index)).filter((perm) => meta.clues.every((clue) => (clue.type === "is" ? perm[clue.person] === clue.item : perm[clue.person] !== clue.item)));
    assert(found.length === 1 && people.length === size && things.length === size, `${prefix}: q${n} must have one assignment`);
    const expected = n === 22 ? things[found[0][meta.target]] : people[found[0].indexOf(meta.targetItem)];
    assert(problem.answer === expected, `${prefix}: q${n} answer disagrees`);
  } else if (n === 25) {
    const found = permutationsOf([0, 1, 2, 3]).filter((order) => {
      const rank = (person) => order.indexOf(person);
      return meta.clues.every((clue) => (clue.type === "lt" ? rank(clue.a) > rank(clue.b)
        : clue.type === "between" ? rank(clue.a) > rank(clue.taller) && rank(clue.a) < rank(clue.shorter)
          : clue.type === "tallest" ? rank(clue.a) === 0 : rank(clue.a) === 3));
    });
    assert(found.length === 1 && problem.answer === meta.names[found[0][2]], `${prefix}: q25 third tallest disagrees`);
  } else {
    fail(`${prefix}: no book-01 source check for q${n}`);
  }
}

function independentCheck(entry, problem, prefix) {
  const meta = problem.meta;
  if (meta?.sourceBook === "book-01") {
    assert(meta.sourceNumber === entry.number, `${prefix}: book-01 source number mismatch`);
    return book01SourceCheck(problem, prefix);
  }
  if (meta?.sourceNumber && ![1, 2, 22].includes(meta.sourceNumber)) {
    const answerNumber = Number.parseInt(problem.answer, 10);
    if ([3, 5].includes(meta.sourceNumber)) {
      assert(meta.larger + meta.smaller === meta.total, `${prefix}: two-target total disagrees`);
      assert(meta.larger - meta.smaller === meta.gap, `${prefix}: two-target difference disagrees`);
      assert(problem.answer.includes(String(meta.larger)) && problem.answer.includes(String(meta.smaller)), `${prefix}: both target values must be in the answer`);
    } else if (meta.sourceNumber === 6) {
      const solutions = permutationsOf(meta.cards).filter(([square, circle, diamond, cross]) => square * 2 === diamond && circle * 2 === square + diamond && square + circle === cross);
      assert(solutions.length === 1, `${prefix}: q6 must have one shape assignment`);
      assert(solutions[0][3] === answerNumber && answerNumber === meta.values.cross, `${prefix}: q6 target disagrees`);
    } else if (meta.sourceNumber === 7) {
      const { diamond, circle, square, star } = meta.weights;
      assert(circle === diamond * 2 && square * 2 === diamond + circle * 2 && star === diamond + square, `${prefix}: q7 balance chain disagrees`);
      assert(answerNumber === star, `${prefix}: q7 answer disagrees`);
    } else if (meta.sourceNumber === 8) {
      const solutions = permutationsOf(meta.cards).filter(([diamond, square, triangle, circle]) => diamond * 3 === square * 4 && diamond * 2 === triangle + square && triangle + circle === diamond + square);
      assert(solutions.length === 1, `${prefix}: q8 must have one shape assignment`);
      assert(solutions[0][3] === answerNumber && answerNumber === meta.values.circle, `${prefix}: q8 target disagrees`);
    } else if (meta.sourceNumber === 9) {
      const { diamond, circle, square, star } = meta.weights;
      assert(circle === diamond * 2 && square * 2 === diamond + circle && star * 2 === diamond + square, `${prefix}: q9 balance chain disagrees`);
      assert(answerNumber === star, `${prefix}: q9 answer disagrees`);
    } else if (meta.sourceNumber === 10) {
      assert(meta.patterns.length === 2 && meta.answers.length === 2, `${prefix}: q10 needs two subproblems`);
      meta.patterns.forEach((pattern, index) => {
        const shown = meta.shown[index];
        assert(shown.length >= pattern.length * 2 + 1, `${prefix}: q10 must show at least two full repeats and one extra item`);
        assert(shown.every((value, position) => value === pattern[position % pattern.length]), `${prefix}: q10 shown pattern ${index + 1} disagrees`);
        assert(meta.answers[index] === pattern[shown.length % pattern.length], `${prefix}: q10 next shape ${index + 1} disagrees`);
      });
      assert(problem.parts?.length === 2 && problem.answerVisuals?.length === 2, `${prefix}: q10 multipart drawing contract missing`);
    } else if (meta.sourceNumber === 11) {
      const targetShape = meta.shapeCycle[(meta.targetIndex - 1) % meta.shapeCycle.length];
      const filled = meta.filledPositions.includes(meta.targetIndex);
      assert(meta.answerToken === `${filled ? "filled-" : ""}${targetShape}`, `${prefix}: q11 shape/fill cycles disagree`);
      assert(problem.answerVisual, `${prefix}: q11 drawing answer visual missing`);
    } else if (meta.sourceNumber === 12) {
      assert(meta.rows.length === 2 && problem.parts?.length === 2, `${prefix}: q12 needs two independent sequences`);
      meta.rows.forEach((row, index) => {
        const values = [...row.values];
        values[row.blankIndex] = row.answer;
        if (index === 0) {
          assert(values.every((value, position) => position < 3 || value === values[position - 3] + 4), `${prefix}: q12 first grouped sequence disagrees`);
        } else {
          assert(values.every((value, position) => position < 3 || value === values[position - 3] + 1), `${prefix}: q12 second grouped sequence disagrees`);
        }
      });
    } else if (meta.sourceNumber === 13) {
      assert(meta.answer === meta.first + meta.increase * (meta.target - 1), `${prefix}: q13 shared-side growth disagrees`);
      assert(answerNumber === meta.answer && meta.target === 7, `${prefix}: q13 source target changed`);
    } else if (meta.sourceNumber === 14) {
      assert(meta.white - meta.dark === meta.answer && meta.answer === meta.target, `${prefix}: q14 triangle color difference disagrees`);
      assert(answerNumber === meta.answer && meta.target === 8, `${prefix}: q14 source target changed`);
    } else if (meta.sourceNumber === 15) {
      assert(2 ** meta.folds === meta.pieces, `${prefix}: q15 reverse fold count disagrees`);
      assert(answerNumber === meta.folds, `${prefix}: q15 answer must be the fold count`);
    } else if (meta.sourceNumber === 16) {
      assert(meta.rows.every(([left, center, right]) => left + right === center), `${prefix}: q16 row sums disagree`);
      assert(answerNumber === meta.answer && meta.answer === meta.rows[3][1] % 10, `${prefix}: q16 target digit disagrees`);
    } else if (meta.sourceNumber === 17) {
      assert(meta.rows.every(([first, second, third, fourth]) => first - second + third === fourth), `${prefix}: q17 row rule disagrees`);
      assert(answerNumber === meta.answer, `${prefix}: q17 answer disagrees`);
    } else if (meta.sourceNumber === 18) {
      assert(meta.items.every(({ top, left, center, right }) => top + left + center === right), `${prefix}: q18 triangle relation disagrees`);
      assert(answerNumber === meta.answer, `${prefix}: q18 answer disagrees`);
    } else if ([19, 20].includes(meta.sourceNumber)) {
      const digits = Array.from({ length: meta.size }, (_, index) => index + 1).join(",");
      const rows = Array.from({ length: meta.size }, (_, row) => meta.solution.slice(row * meta.size, row * meta.size + meta.size));
      const columns = Array.from({ length: meta.size }, (_, column) => rows.map((row) => row[column]));
      assert([...rows, ...columns].every((line) => [...line].sort((a, b) => a - b).join(",") === digits), `${prefix}: sudoku row or column invalid`);
      const regionOf = (index) => meta.regionMap
        ? meta.regionMap[index]
        : Math.floor(Math.floor(index / meta.size) / meta.regionRows) * (meta.size / meta.regionColumns) + Math.floor((index % meta.size) / meta.regionColumns);
      const regions = Array.from({ length: meta.size }, (_, region) => meta.solution.filter((_, index) => regionOf(index) === region));
      assert(regions.every((region) => [...region].sort((a, b) => a - b).join(",") === digits), `${prefix}: sudoku region invalid`);
      assert(meta.cells.every((value, index) => value == null || value === meta.solution[index]), `${prefix}: sudoku clue disagrees with answer`);
      assert(sudokuCompletionCount(meta) === 1, `${prefix}: sudoku must have one completion`);
      assert(problem.answerVisual?.cells?.every((value, index) => value === meta.solution[index]), `${prefix}: full sudoku answer visual missing`);
    } else if (meta.sourceNumber === 21) {
      assert(meta.items.every(({ top, left, right, bottom, center }) => top + center === left + right + bottom), `${prefix}: q21 diamond relation disagrees`);
      assert(answerNumber === meta.answer, `${prefix}: q21 answer disagrees`);
    } else if (meta.sourceNumber === 23) {
      let count = 0;
      let target = null;
      for (let square = 1; square <= 9; square += 1) for (let diamond = 1; diamond <= 9; diamond += 1) for (let triangle = 1; triangle <= 9; triangle += 1) for (let circle = 1; circle <= 9; circle += 1) {
        if (new Set([square, diamond, triangle, circle]).size !== 4) continue;
        if (diamond * 3 !== square * 4 || triangle * 3 !== square * 5 || diamond + triangle !== square + circle) continue;
        count += 1;
        target = circle;
      }
      assert(count === 1 && target === answerNumber && answerNumber === meta.values.circle, `${prefix}: q23 must have one assignment`);
    } else if (meta.sourceNumber === 25) {
      assert(meta.previous.white <= meta.previous.black, `${prefix}: q25 previous stage already qualifies`);
      assert(meta.current.white > meta.current.black && meta.current.stage === meta.previous.stage + 1, `${prefix}: q25 first qualifying stage disagrees`);
      assert(answerNumber === meta.target, `${prefix}: q25 answer disagrees`);
    }
    return;
  }
  if (entry.typeId === "fold-number-cut-sum-textbook") {
    const folded = (index, direction) => ["down", "right"].includes(direction)
      ? Math.max(index, 3 - index) - 2 : Math.min(index, 3 - index);
    const cut = meta.grid.reduce((sum, row, r) => sum + row.reduce((subtotal, value, c) =>
      subtotal + (meta.cells.some((cell) => cell.r === folded(r, meta.hDir) && cell.c === folded(c, meta.vDir)) ? value : 0), 0), 0);
    assert(meta.grid.length === 4 && meta.grid.every((row) => row.length === 4), `${prefix}: folding grid shape changed`);
    assert(Number(problem.answer) === cut, `${prefix}: independently folded sum disagrees`);
  } else if (entry.typeId === "polygon-ring-equal-sum") {
    const { shown, cards, lineSum } = problem.visual;
    const values = problem.answer.split(",").map(Number);
    assert(values.length === 10 && new Set(values).size === 10 && values.every((value) => cards.includes(value)), `${prefix}: ring cards mismatch`);
    const valid = (ring) => Array.from({ length: 5 }, (_, edge) => [edge * 2, edge * 2 + 1, (edge * 2 + 2) % 10])
      .every((indices) => indices.some((index) => ring[index] == null) || indices.reduce((sum, index) => sum + ring[index], 0) === lineSum);
    assert(shown.every((value, index) => value == null || value === values[index]) && valid(values), `${prefix}: ring solution violates given clues`);
    const countCompletions = (ring, unused) => {
      if (!valid(ring)) return 0;
      const empty = ring.indexOf(null);
      if (empty < 0) return 1;
      return unused.reduce((total, value) => {
        if (total > 1) return total;
        const next = [...ring];
        next[empty] = value;
        return total + countCompletions(next, unused.filter((item) => item !== value));
      }, 0);
    };
    assert(countCompletions([...shown], cards.filter((value) => !shown.includes(value))) === 1, `${prefix}: ring has multiple or no completions`);
  } else if (entry.typeId === "equalize-transfer") {
    const answer = Number.parseInt(problem.answer, 10);
    assert(meta.higher - answer === meta.lower + answer && answer >= 0, `${prefix}: transfer does not equalize both quantities`);
  } else if (entry.typeId === "reverse-transfer-total") {
    const answer = Number.parseInt(problem.answer, 10);
    assert(meta.receiverBefore * 2 === meta.afterEach && answer - meta.receiverBefore === meta.afterEach, `${prefix}: reverse transfer does not reproduce the final state`);
  } else if (entry.typeId === "shape-sum-table" && meta?.sourceLayout) {
    const { cells, rowSums, columnSums } = problem.visual;
    const valueOf = (shape) => meta.shapeValues[shape];
    const calculatedRows = cells.map((row) => row.reduce((sum, shape) => sum + valueOf(shape), 0));
    const calculatedColumns = cells[0].map((_, column) => cells.reduce((sum, row) => sum + valueOf(row[column]), 0));
    rowSums.forEach((sum, index) => assert(sum == null || sum === calculatedRows[index], `${prefix}: visible row sum ${index + 1} disagrees`));
    columnSums.forEach((sum, index) => assert(sum == null || sum === calculatedColumns[index], `${prefix}: visible column sum ${index + 1} disagrees`));
    const values = Object.values(meta.shapeValues);
    assert(values.every((value) => Number.isInteger(value) && value > 0) && new Set(values).size === values.length, `${prefix}: shape values must be distinct positive integers`);
    assert(rowSums.filter((sum) => sum == null).length + columnSums.filter((sum) => sum == null).length === 1, `${prefix}: matrix needs exactly one target sum`);
    const expected = meta.targetAxis === "row" ? calculatedRows[meta.targetIndex] : calculatedColumns[meta.targetIndex];
    assert(Number(problem.answer) === expected, `${prefix}: target sum disagrees with the matrix`);

    let solved;
    if (meta.sourceLayout === "shape-matrix-3x3-last-column") {
      const square = columnSums[1] / 3;
      const diamond = rowSums[1] - square * 2;
      const triangle = rowSums[0] - diamond - square;
      const circle = rowSums[2] - triangle - square;
      solved = { square, diamond, triangle, circle };
      assert(cells.length === 3 && cells.every((row) => row.length === 3), `${prefix}: source 3x3 structure changed`);
    } else if (meta.sourceLayout === "shape-matrix-4x4-first-row") {
      const circle = columnSums[1] / 4;
      const square = rowSums[2] - circle * 3;
      const diamond = rowSums[3] - circle * 2 - square;
      const triangle = columnSums[2] - square - circle * 2;
      solved = { circle, square, diamond, triangle };
      assert(cells.length === 4 && cells.every((row) => row.length === 4), `${prefix}: source 4x4 structure changed`);
    } else if (meta.sourceLayout === "shape-matrix-3x4-second-row") {
      const circle = (rowSums[2] * 2 - rowSums[0]) / 4;
      const square = rowSums[2] - circle * 3;
      const cross = columnSums[0] - square - circle;
      const diamond = columnSums[1] - circle * 2;
      const triangle = columnSums[2] - circle - square;
      solved = { circle, square, cross, diamond, triangle };
      assert(cells.length === 3 && cells.every((row) => row.length === 4), `${prefix}: source 3x4 structure changed`);
    }
    assert(solved && Object.entries(solved).every(([shape, value]) => value === meta.shapeValues[shape]), `${prefix}: visible sums do not recover one unique value per shape`);
  } else {
    fail(`${prefix}: independent validator is required before enabling a new link`);
  }
}

const auditGeneratedContracts = (bookId, links) => {
  for (const entry of links.filter((item) => item.verified)) {
    const type = typeById(entry.typeId);
    assert(entry.generatorContract, `${bookId} q${entry.number}: generator contract missing`);
    assert(type?.generator && typeof GENERATORS[type.generator] === "function", `${bookId} q${entry.number}: generator missing for ${entry.typeId}`);
    for (const difficulty of [1, 2, 3].slice(0, variants)) {
      const sourceCase = {
        mode: entry.generationCaseMode,
        sourceKey: `unit-test:${bookId}:q${entry.number}`,
        sourceKind: "unit-test",
        sourceId: bookId,
        number: entry.number,
        sourceFidelity: entry.sourceFidelity
      };
      const problem = GENERATORS[type.generator]({ difficulty, sourceCase });
      const prefix = `${bookId} q${String(entry.number).padStart(2, "0")} ${entry.typeId} d${difficulty}`;
      assert(problem && typeof problem === "object", `${prefix}: generator returned no problem`);
      assert(typeof problem.prompt === "string" && problem.prompt.trim(), `${prefix}: prompt missing`);
      assert(problem.answer !== undefined && String(problem.answer).trim(), `${prefix}: answer missing`);
      assert(typeof problem.solution === "string" && problem.solution.trim(), `${prefix}: solution missing`);
      assert(!/undefined|NaN|\[object Object\]/.test(`${problem.prompt}${problem.answer}${problem.solution}`), `${prefix}: invalid generated text`);
      assert((problem.responseKind || "text") === entry.generatorContract.responseKind, `${prefix}: generated response kind differs from contract`);
      independentCheck(entry, problem, prefix);
      const markup = [render(bookId, problem), ...(problem.parts || []).map((part) => render(bookId, part))].join("");
      if (problem.visual?.kind === "book1" || problem.visual?.kind === "book2" || problem.parts?.some((part) => ["book1", "book2"].includes(part.visual?.kind))) {
        assert(markup.trim().length > 30, `${prefix}: renderer produced blank markup`);
      }
    }
  }
};

const auditBook02MatrixStress = () => {
  const matrixLinks = BOOK02_UNIT_TEST_LINKS.filter((entry) => [1, 2, 22].includes(entry.number));
  for (const entry of matrixLinks) {
    const type = typeById(entry.typeId);
    const sourceCase = {
      mode: entry.generationCaseMode,
      sourceKey: `unit-test:book-02:q${entry.number}`,
      sourceKind: "unit-test",
      sourceId: "book-02",
      number: entry.number,
      sourceFidelity: entry.sourceFidelity
    };
    for (const difficulty of [1, 2, 3]) {
      for (let sample = 0; sample < 100; sample += 1) {
        const problem = GENERATORS[type.generator]({ difficulty, sourceCase });
        independentCheck(entry, problem, `book-02 q${String(entry.number).padStart(2, "0")} stress d${difficulty} sample${sample + 1}`);
      }
    }
  }
};

const BOOK01_STRESS_VARIANTS = 20;
const auditBook01SourceStress = () => {
  for (const entry of BOOK01_UNIT_TEST_LINKS) {
    const type = typeById(entry.typeId);
    const sourceCase = {
      mode: entry.generationCaseMode,
      sourceKey: `unit-test:book-01:q${entry.number}`,
      sourceKind: "unit-test",
      sourceId: "book-01",
      number: entry.number,
      sourceFidelity: entry.sourceFidelity
    };
    const seen = new Set();
    for (const difficulty of [1, 2, 3]) {
      for (let sample = 0; sample < BOOK01_STRESS_VARIANTS; sample += 1) {
        const problem = GENERATORS[type.generator]({ difficulty, sourceCase });
        const prefix = `book-01 q${String(entry.number).padStart(2, "0")} source stress d${difficulty} sample${sample + 1}`;
        if (!problem) { fail(`${prefix}: generator returned no problem`); continue; }
        assert((problem.responseKind || "text") === entry.generatorContract.responseKind, `${prefix}: response kind differs from contract`);
        independentCheck(entry, problem, prefix);
        seen.add(JSON.stringify([problem.prompt, problem.visual, problem.answer]));
      }
    }
    // 원본 구조를 지키되 수·배치는 매번 바뀌어야 한다(유사 문제).
    assert(seen.size >= 5, `book-01 q${entry.number}: source-shaped generator makes too few different problems (${seen.size})`);
  }
};

const BOOK02_STRESS_VARIANTS = 20;
const auditBook02SourceStress = () => {
  for (const entry of BOOK02_UNIT_TEST_LINKS) {
    const type = typeById(entry.typeId);
    const sourceCase = {
      mode: entry.generationCaseMode,
      sourceKey: `unit-test:book-02:q${entry.number}`,
      sourceKind: "unit-test",
      sourceId: "book-02",
      number: entry.number,
      sourceFidelity: entry.sourceFidelity
    };
    for (const difficulty of [1, 2, 3]) {
      for (let sample = 0; sample < BOOK02_STRESS_VARIANTS; sample += 1) {
        const problem = GENERATORS[type.generator]({ difficulty, sourceCase });
        independentCheck(entry, problem, `book-02 q${String(entry.number).padStart(2, "0")} source stress d${difficulty} sample${sample + 1}`);
      }
    }
  }
};

assert(LEARNER_STAGE === "7세 8월부터 초등 1학년 초반 · FC 1과정", "learner stage contract changed");
assert(BOOK01_02_UNIT_TEST_LINKS["book-01"] === BOOK01_UNIT_TEST_LINKS, "book-01 export alias mismatch");
assert(BOOK01_02_UNIT_TEST_LINKS["book-02"] === BOOK02_UNIT_TEST_LINKS, "book-02 export alias mismatch");
for (const [bookId, links] of Object.entries(BOOK01_02_UNIT_TEST_LINKS)) {
  assert(CURRICULUM.find((book) => book.id === bookId).source.unitTestQuestions.length === links.length, `${bookId}: inventory is not connected`);
}
assert(BOOK02_UNIT_TEST_LINKS.every((entry) => entry.verified), "Every Book 2 source contract must have a verified source-shaped generator");
assert(BOOK01_UNIT_TEST_LINKS.every((entry) => entry.verified), "Every Book 1 source contract must have a verified source-shaped generator");
assert(BOOK02_UNIT_TEST_LINKS.filter((entry) => [1, 2, 22].includes(entry.number)).every((entry) => entry.verified), "Source-shaped matrix generators must stay enabled");

auditLinks("book-01", BOOK01_UNIT_TEST_LINKS);
auditLinks("book-02", BOOK02_UNIT_TEST_LINKS);
auditGeneratedContracts("book-01", BOOK01_UNIT_TEST_LINKS);
auditGeneratedContracts("book-02", BOOK02_UNIT_TEST_LINKS);
auditBook02MatrixStress();
auditBook02SourceStress();
auditBook01SourceStress();

const counts = (links) => ({ total: links.length, verified: links.filter((entry) => entry.verified).length, held: links.filter((entry) => !entry.verified).length });
const result = {
  learnerStage: LEARNER_STAGE,
  books: {
    "book-01": counts(BOOK01_UNIT_TEST_LINKS),
    "book-02": counts(BOOK02_UNIT_TEST_LINKS)
  },
  generatedVariantsPerVerifiedLink: Math.min(variants, 3),
  matrixStressSamples: 3 * 3 * 100,
  book01SourceStressSamples: 25 * 3 * BOOK01_STRESS_VARIANTS,
  book02SourceStressSamples: 25 * 3 * BOOK02_STRESS_VARIANTS,
  status: failures.length ? "FAIL" : "BOOK01_BOOK02_UNIT_TEST_LINKS_OK",
  failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
