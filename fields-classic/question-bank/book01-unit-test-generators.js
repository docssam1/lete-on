// 더클래식 1과정 1권 권별테스트(단원 테스트) 25문항의 유사 문제.
// 원본 문항의 배치·응답 방식·문항 수·조건(빈칸 수, 접는 횟수, 카드 수)은 그대로 두고
// 수·배치·이름만 새로 만든다. 원본의 수와 답은 쓰지 않는다.
// 7번(두 번 접은 수의 합)·17번(오각진)은 교재 생성기가 이미 원본 구조라 여기서 만들지 않는다.

const SOURCE_QUESTIONS = new Set([1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25]);
export const BOOK01_UNIT_TEST_SOURCE_NUMBERS = Object.freeze([...SOURCE_QUESTIONS]);

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];
const total = (values) => values.reduce((sum, value) => sum + value, 0);

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
  return values.flatMap((value, index) => permutations(values.filter((_, other) => other !== index)).map((tail) => [value, ...tail]));
}

function combinations(values, size) {
  if (size === 0) return [[]];
  if (values.length < size) return [];
  const [head, ...rest] = values;
  return [...combinations(rest, size - 1).map((tail) => [head, ...tail]), ...combinations(rest, size)];
}

// 받침: 한글은 글자로, 숫자는 읽는 소리(영·일·삼·육·칠·팔)로 정한다.
function hasBatchim(word) {
  const last = String(word).at(-1) || "";
  const code = last.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) return (code - 0xac00) % 28 !== 0;
  if (/\d/.test(last)) return [0, 1, 3, 6, 7, 8].includes(Number(last));
  return false;
}
const josa = (word, withBatchim, without) => `${word}${hasBatchim(word) ? withBatchim : without}`;
const topic = (word) => josa(word, "은", "는");
const object = (word) => josa(word, "을", "를");
const subject = (word) => josa(word, "이", "가");
const withWord = (word) => josa(word, "과", "와");
// 사람 이름은 받침이 있으면 「민준이는」처럼 부른다.
const callName = (name) => (hasBatchim(name) ? `${name}이` : name);
const nameTopic = (name) => `${callName(name)}는`;
const nameSubject = (name) => `${callName(name)}가`;
const nameThan = (name) => `${callName(name)}보다`;
const listWithTopic = (words, last = topic) => `${words.slice(0, -1).join(", ")}, ${last(words.at(-1))}`;

function sourceMeta(sourceNumber, sourceLayout, detail = {}) {
  return { sourceBook: "book-01", sourceNumber, sourceLayout, ...detail };
}

// ── 1·5번: 4×4 판을 모양과 크기가 같은 네 조각으로 나누기 ─────────────────
const FREE_TETROMINOES = Object.freeze([
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [0, 1], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [2, 1]],
  [[0, 1], [0, 2], [1, 0], [1, 1]]
]);
const SQUARE_TETROMINO = 1;

function normalizeCells(cells) {
  const minRow = Math.min(...cells.map(([row]) => row));
  const minColumn = Math.min(...cells.map(([, column]) => column));
  return cells.map(([row, column]) => [row - minRow, column - minColumn]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function orientationsOf(cells) {
  const seen = new Map();
  for (let flip = 0; flip < 2; flip += 1) {
    for (let turn = 0; turn < 4; turn += 1) {
      const moved = normalizeCells(cells.map(([row, column]) => {
        let y = row;
        let x = flip ? -column : column;
        for (let step = 0; step < turn; step += 1) [y, x] = [x, -y];
        return [y, x];
      }));
      seen.set(moved.map((cell) => cell.join(":")).join("|"), moved);
    }
  }
  return [...seen.values()];
}

const FIXED_TETROMINOES = FREE_TETROMINOES.flatMap((cells, free) => orientationsOf(cells).map((fixed) => ({ free, cells: fixed })));

function tetrominoTilings() {
  const board = Array(16).fill(-1);
  const shapes = [];
  const found = [];
  const visit = (piece) => {
    const first = board.indexOf(-1);
    if (first < 0) {
      found.push({ labels: [...board], shapes: [...shapes] });
      return;
    }
    const row = Math.floor(first / 4);
    const column = first % 4;
    for (const fixed of FIXED_TETROMINOES) {
      const [anchorRow, anchorColumn] = fixed.cells[0];
      const cells = fixed.cells.map(([r, c]) => [r - anchorRow + row, c - anchorColumn + column]);
      if (cells.some(([r, c]) => r < 0 || r > 3 || c < 0 || c > 3 || board[r * 4 + c] !== -1)) continue;
      cells.forEach(([r, c]) => { board[r * 4 + c] = piece; });
      shapes.push(fixed.free);
      visit(piece + 1);
      shapes.pop();
      cells.forEach(([r, c]) => { board[r * 4 + c] = -1; });
    }
  };
  visit(0);
  return found;
}

const CONGRUENT_TILINGS = Object.freeze(tetrominoTilings()
  .filter((tiling) => tiling.shapes.every((shape) => shape === tiling.shapes[0]))
  .map((tiling) => Object.freeze({ labels: Object.freeze(tiling.labels), free: tiling.shapes[0] })));

// 원본처럼 가운데 점에서 네 방향으로 한 칸씩 그은 빨간 선(나눌 때 반드시 지나는 선).
const CENTER_GUIDES = Object.freeze([[5, 6], [9, 10], [5, 9], [6, 10]]);
const respectsGuides = (labels, guides) => guides.every(([a, b]) => labels[a] !== labels[b]);
const piecesOf = (labels) => [0, 1, 2, 3].map((piece) => labels.map((label, index) => (label === piece ? index : -1)).filter((index) => index >= 0));

function numberPartitionBoard(tiling, pool) {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const symbols = Array(16).fill(null);
    piecesOf(tiling.labels).forEach((cells) => shuffled([1, 2, 3, 4]).forEach((value, index) => { symbols[cells[index]] = value; }));
    const matches = pool.filter((candidate) => piecesOf(candidate.labels).every((cells) => new Set(cells.map((index) => symbols[index])).size === 4));
    if (matches.length === 1) return { symbols, labels: [...tiling.labels], free: tiling.free, uniqueCount: 1 };
  }
  return null;
}

function partitionProblem01() {
  const pool = CONGRUENT_TILINGS.filter((tiling) => respectsGuides(tiling.labels, CENTER_GUIDES));
  const boards = [];
  for (const tiling of shuffled(pool.filter((item) => item.free !== SQUARE_TETROMINO))) {
    if (boards.length === 2) break;
    const board = numberPartitionBoard(tiling, pool);
    if (board) boards.push(board);
  }
  if (boards.length < 2) return null;
  const visualFor = (board, reveal) => ({
    kind: "book1", subtype: "ut-partition", rows: 4, columns: 4,
    symbols: board.symbols.map(String), guides: CENTER_GUIDES, pivot: true,
    ...(reveal ? { labels: board.labels } : {})
  });
  const set = (reveal) => ({ kind: "book1", subtype: "ut-set", columns: 2, items: boards.map((board, index) => ({ label: `(${index + 1})`, visual: visualFor(board, reveal) })) });
  return {
    prompt: "다음과 같이 1, 2, 3, 4가 적힌 작은 정사각형으로 이루어진 도형이 있습니다. 각 도형에 1, 2, 3, 4가 하나씩 들어가도록 모양과 크기가 같은 도형으로 나누시오.",
    visual: set(false),
    answerVisual: set(true),
    answer: "그림과 같이 두 도형을 각각 모양과 크기가 같은 네 조각으로 나눕니다.",
    responseKind: "drawing",
    solution: "빨간 선은 가운데의 네 칸이 서로 다른 조각에 들어간다는 뜻입니다. 가운데 칸마다 이웃한 칸을 붙여 네 칸짜리 조각을 만들고, 네 조각이 돌리거나 뒤집으면 꼭 겹치는지, 조각마다 1, 2, 3, 4가 한 번씩 들어 있는지 확인합니다.",
    meta: sourceMeta(1, "two-four-by-four-number-partitions", { guides: CENTER_GUIDES, boards })
  };
}

function squirrelPartitionProblem05() {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const tiling = sample(CONGRUENT_TILINGS.filter((item) => item.free !== SQUARE_TETROMINO));
    const perPiece = 3;
    const occupied = Array(16).fill(false);
    piecesOf(tiling.labels).forEach((cells) => shuffled(cells).slice(0, perPiece).forEach((index) => { occupied[index] = true; }));
    const matches = CONGRUENT_TILINGS.filter((candidate) => piecesOf(candidate.labels).every((cells) => cells.filter((index) => occupied[index]).length === perPiece));
    if (matches.length !== 1) continue;
    const symbols = occupied.map((value) => (value ? "squirrel" : ""));
    const base = { kind: "book1", subtype: "ut-partition", rows: 4, columns: 4, symbols, fence: true };
    return {
      prompt: "우리 안의 다람쥐들이 다음과 같은 위치에 있을 때, 똑같은 수의 다람쥐가 들어가면서 크기와 모양이 같은 4부분이 되도록 울타리를 완성하시오. (단, 4부분으로 나눌 때 다람쥐의 위치는 같지 않아도 됩니다.)",
      visual: base,
      answerVisual: { ...base, labels: [...tiling.labels] },
      answer: `그림과 같이 다람쥐가 ${perPiece}마리씩 들어가는 네 부분으로 나눕니다.`,
      responseKind: "drawing",
      solution: `다람쥐는 모두 ${perPiece * 4}마리이므로 한 부분에 ${perPiece}마리씩, 빈칸은 한 부분에 1칸씩 들어가야 합니다. 네 칸짜리 같은 모양을 돌리거나 뒤집어 놓으며 빈칸이 한 부분에 하나씩 들어가는 배치를 찾습니다.`,
      meta: sourceMeta(5, "squirrel-balanced-four-congruent-regions", { occupied, perPiece, labels: [...tiling.labels], free: tiling.free, uniqueCount: 1 })
    };
  }
  return null;
}

// ── 2·3번: 디지털 숫자 뒤집기·반 바퀴 ───────────────────────────────────
// 원본처럼 1은 칸 가운데에 세운 막대라 뒤집거나 돌려도 1이다.
const DIGIT_SEGMENTS = Object.freeze({ 0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg" });
const SEGMENT_DIGIT = Object.freeze(Object.fromEntries(Object.entries(DIGIT_SEGMENTS).map(([digit, segments]) => [[...segments].sort().join(""), Number(digit)])));
const SEGMENT_MAPS = Object.freeze({
  "mirror-left-right": { a: "a", b: "f", c: "e", d: "d", e: "c", f: "b", g: "g" },
  "rotate-half": { a: "d", b: "e", c: "f", d: "a", e: "b", f: "c", g: "g" }
});

export function transformDigitalDigit(digit, operation) {
  if (digit === 1) return 1;
  const mapped = [...DIGIT_SEGMENTS[digit]].map((segment) => SEGMENT_MAPS[operation][segment]).sort().join("");
  return SEGMENT_DIGIT[mapped] ?? null;
}

function transformTwoDigit(digits, operation) {
  const out = [...digits].reverse().map((digit) => transformDigitalDigit(digit, operation));
  return out.some((digit) => digit == null) ? null : out;
}

function twoDigitCandidates(operation, excluded) {
  const values = [];
  for (let value = 10; value <= 99; value += 1) {
    const digits = [Math.floor(value / 10), value % 10];
    const out = transformTwoDigit(digits, operation);
    if (!out || out[0] === 0) continue;
    const result = out[0] * 10 + out[1];
    if (result === value || excluded.includes(value)) continue;
    values.push({ source: value, digits, result, resultDigits: out });
  }
  return values;
}

function digitalFlipProblem02() {
  const pool = twoDigitCandidates("mirror-left-right", [15, 82]);
  const items = shuffled(pool).slice(0, 2);
  const visual = { kind: "book1", subtype: "ut-set", columns: 1, items: items.map((item, index) => ({ label: `(${index + 1})`, visual: { kind: "book1", subtype: "ut-digital-flip", digits: item.digits } })) };
  return {
    prompt: "다음 두 자리 수를 오른쪽으로 뒤집은 수를 구하시오.",
    visual,
    answer: items.map((item, index) => `(${index + 1}) ${item.result}`).join(", "),
    solution: `오른쪽으로 뒤집으면 숫자 모양이 거울처럼 바뀌고 두 숫자의 자리도 서로 바뀝니다. ${items.map((item, index) => `(${index + 1}) ${item.source} → ${item.result}`).join(", ")}입니다.`,
    meta: sourceMeta(2, "two-digit-right-flip-two-subproblems", { operation: "mirror-left-right", items })
  };
}

function digitalAdditionProblem03() {
  const pool = twoDigitCandidates("rotate-half", [61, 52]).filter((item) => item.source + item.result < 100);
  const items = shuffled(pool).slice(0, 2).map((item) => ({ ...item, sum: item.source + item.result }));
  const visual = { kind: "book1", subtype: "ut-set", columns: 2, items: items.map((item, index) => ({ label: `(${index + 1})`, visual: { kind: "book1", subtype: "ut-digital-addition", digits: item.digits } })) };
  return {
    prompt: "다음 식은 원래 두 자리 수와 그 수를 반 바퀴 돌려 읽은 수를 더한 것입니다. 빈 칸에 알맞은 수를 구하시오.",
    visual,
    answer: items.map((item, index) => `(${index + 1}) 돌린 수 ${item.result}, 합 ${item.sum}`).join(" / "),
    solution: items.map((item, index) => `(${index + 1}) ${topic(String(item.source))} 반 바퀴 돌리면 ${subject(String(item.result))} 되므로 ${item.source} + ${item.result} = ${item.sum}입니다.`).join(" "),
    meta: sourceMeta(3, "two-digit-half-turn-related-additions", { operation: "rotate-half", items })
  };
}

// ── 4번: 숫자판을 오른쪽으로 뒤집은 뒤 아래로 뒤집기 ─────────────────────
// 놓인 모양은 화면 변환으로 적는다: normal, rot90(시계 방향 반의 반 바퀴), rot270, rot180, flipX(좌우), flipY(상하).
// 오른쪽 뒤집기 + 아래 뒤집기 = 반 바퀴. 처음에 rot180으로 놓인 수만 똑바로 선다.
// 뒤집어도 똑같아 보이는 숫자(8, 6↔9 등)는 헷갈리는 자세에 두지 않는다.
const BOARD_STATES = Object.freeze({
  1: ["rot90", "rot270", "normal", "flipY"], 2: ["rot90", "rot270", "normal"], 3: ["rot90", "rot270", "normal", "flipY"],
  4: ["rot90", "rot270", "normal", "flipX", "flipY"], 5: ["rot90", "rot270", "normal"], 6: ["rot90", "rot270", "flipX", "flipY"],
  7: ["rot90", "rot270", "normal", "flipX", "flipY"], 8: ["rot90", "rot270"], 9: ["rot90", "rot270", "flipX", "flipY"]
});
const UPRIGHT_TARGETS = Object.freeze([1, 2, 3, 4, 5, 7]);

function orientedBoardProblem04({ difficulty = 2 }) {
  const digits = shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const targetCount = difficulty <= 1 ? 2 : difficulty >= 3 ? 4 : randomInt(2, 4);
  const targets = new Set(shuffled(UPRIGHT_TARGETS).slice(0, targetCount));
  const cells = digits.map((digit) => ({ digit, state: targets.has(digit) ? "rot180" : sample(BOARD_STATES[digit]) }));
  const upright = cells.filter((cell) => cell.state === "rot180").map((cell) => cell.digit);
  const answer = total(upright);
  return {
    prompt: "다음 숫자판을 오른쪽으로 뒤집은 후 아래로 뒤집었을 때, 똑바로 놓이는 수들의 합을 구하시오.",
    visual: { kind: "book1", subtype: "ut-oriented-board", cells },
    answer: String(answer),
    solution: `오른쪽으로 뒤집은 뒤 아래로 뒤집으면 숫자판을 반 바퀴 돌린 것과 같습니다. 그래서 지금 거꾸로 놓인 ${upright.join(", ")}만 똑바로 놓입니다. 합은 ${upright.join(" + ")} = ${answer}입니다.`,
    meta: sourceMeta(4, "three-by-three-board-right-then-down-flip-sum", { cells, steps: ["flipX", "flipY"], upright, answer })
  };
}

// ── 색종이 접기 공통 (단위 정사각형, y는 아래로) ─────────────────────────
const FOLD_LINE = Object.freeze({
  h: { f: (p) => p.y - 0.5, m: (p) => ({ x: p.x, y: 1 - p.y }) },
  v: { f: (p) => p.x - 0.5, m: (p) => ({ x: 1 - p.x, y: p.y }) },
  d1: { f: (p) => p.y - p.x, m: (p) => ({ x: p.y, y: p.x }) },
  d2: { f: (p) => p.x + p.y - 1, m: (p) => ({ x: 1 - p.y, y: 1 - p.x }) }
});
const EPS = 1e-9;
const SQUARE = Object.freeze([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }]);
const lerp = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
const keepValue = (fold, p) => fold.keep * FOLD_LINE[fold.line].f(p);
const mirrorBy = (fold, p) => FOLD_LINE[fold.line].m(p);
const round = (value) => Math.round(value * 10000) / 10000;
const pt = (p) => [round(p.x), round(p.y)];

function signedArea(polygon) {
  let sum = 0;
  for (let index = 0; index < polygon.length; index += 1) {
    const a = polygon[index];
    const b = polygon[(index + 1) % polygon.length];
    sum += a.x * b.y - b.x * a.y;
  }
  return sum / 2;
}

function clipKeep(polygon, value) {
  const out = [];
  for (let index = 0; index < polygon.length; index += 1) {
    const current = polygon[index];
    const next = polygon[(index + 1) % polygon.length];
    const a = value(current);
    const b = value(next);
    if (a >= -EPS) out.push(current);
    if ((a > EPS && b < -EPS) || (a < -EPS && b > EPS)) out.push(lerp(current, next, a / (a - b)));
  }
  return out;
}

const centroid = (polygon) => ({ x: total(polygon.map((p) => p.x)) / polygon.length, y: total(polygon.map((p) => p.y)) / polygon.length });

function creaseSegment(polygon, fold) {
  const f = (p) => FOLD_LINE[fold.line].f(p);
  const points = [];
  for (let index = 0; index < polygon.length; index += 1) {
    const a = polygon[index];
    const b = polygon[(index + 1) % polygon.length];
    if (Math.abs(f(a)) < 1e-7) points.push(a);
    if ((f(a) > 1e-7 && f(b) < -1e-7) || (f(a) < -1e-7 && f(b) > 1e-7)) points.push(lerp(a, b, f(a) / (f(a) - f(b))));
  }
  let best = null;
  for (const a of points) for (const b of points) {
    const length = Math.hypot(a.x - b.x, a.y - b.y);
    if (!best || length > best.length) best = { a, b, length };
  }
  return best && best.length > 1e-6 ? [best.a, best.b] : null;
}

function foldArrow(moving, fold) {
  const start = centroid(moving);
  const end = mirrorBy(fold, start);
  const a = lerp(start, end, 0.12);
  const b = lerp(start, end, 0.88);
  const length = Math.hypot(b.x - a.x, b.y - a.y);
  const mid = lerp(a, b, 0.5);
  const c = { x: mid.x - (b.y - a.y) / length * length * 0.22, y: mid.y + (b.x - a.x) / length * length * 0.22 };
  return { a: pt(a), b: pt(b), c: pt(c) };
}

function foldStages(folds) {
  let polygon = SQUARE;
  const stages = [];
  for (const fold of folds) {
    const kept = clipKeep(polygon, (p) => keepValue(fold, p));
    const moving = clipKeep(polygon, (p) => -keepValue(fold, p));
    stages.push({ polygon, fold, kept, moving, crease: creaseSegment(polygon, fold), arrow: foldArrow(moving, fold) });
    polygon = kept;
  }
  return { stages, packet: polygon };
}

export function unfoldPoint(point, folds) {
  let points = [point];
  for (let index = folds.length - 1; index >= 0; index -= 1) points = points.concat(points.map((p) => mirrorBy(folds[index], p)));
  return points;
}

function unfoldPolygon(polygon, folds) {
  let polygons = [polygon];
  for (let index = folds.length - 1; index >= 0; index -= 1) polygons = polygons.concat(polygons.map((shape) => shape.map((p) => mirrorBy(folds[index], p))));
  return polygons;
}

function clipSegment(a, b, polygon) {
  let t0 = 0;
  let t1 = 1;
  const orient = signedArea(polygon) > 0 ? 1 : -1;
  for (let index = 0; index < polygon.length; index += 1) {
    const p = polygon[index];
    const q = polygon[(index + 1) % polygon.length];
    const ex = q.x - p.x;
    const ey = q.y - p.y;
    const fa = orient * (ex * (a.y - p.y) - ey * (a.x - p.x));
    const fb = orient * (ex * (b.y - p.y) - ey * (b.x - p.x));
    if (fa < -EPS && fb < -EPS) return null;
    if (fa < -EPS || fb < -EPS) {
      const t = fa / (fa - fb);
      if (fa < -EPS) t0 = Math.max(t0, t); else t1 = Math.min(t1, t);
    }
  }
  return t1 - t0 > 1e-6 ? [lerp(a, b, t0), lerp(a, b, t1)] : null;
}

const polyItem = (polygon, role) => ({ t: "poly", pts: polygon.map(pt), role });
const segItem = (segment, role) => (segment ? { t: "seg", a: pt(segment[0]), b: pt(segment[1]), role } : null);

function gridItems(polygon, role = "grid") {
  const items = [];
  for (let k = 1; k < 4; k += 1) {
    items.push(segItem(clipSegment({ x: k / 4, y: 0 }, { x: k / 4, y: 1 }, polygon), role));
    items.push(segItem(clipSegment({ x: 0, y: k / 4 }, { x: 1, y: k / 4 }, polygon), role));
  }
  return items.filter(Boolean);
}

function stagePanel(stage, { next = false } = {}) {
  return {
    items: [
      polyItem(stage.polygon, "paper"),
      segItem(stage.crease, next ? "crease-next" : "crease"),
      { t: "arrow", ...stage.arrow }
    ].filter(Boolean)
  };
}

// 4×4 칸을 대각선 두 개로 네 세모(위·오른쪽·아래·왼쪽)로 나눈다. 대각선 접기 선은 늘 이 세모의 변을 지난다.
const TRIANGLE_SIDES = Object.freeze(["top", "right", "bottom", "left"]);
export function cellTriangle(row, column, side) {
  const x0 = column / 4;
  const y0 = row / 4;
  const x1 = x0 + 0.25;
  const y1 = y0 + 0.25;
  const center = { x: x0 + 0.125, y: y0 + 0.125 };
  if (side === "top") return [{ x: x0, y: y0 }, { x: x1, y: y0 }, center];
  if (side === "right") return [{ x: x1, y: y0 }, { x: x1, y: y1 }, center];
  if (side === "bottom") return [{ x: x1, y: y1 }, { x: x0, y: y1 }, center];
  return [{ x: x0, y: y1 }, { x: x0, y: y0 }, center];
}

export function locateTriangle(point) {
  const column = Math.min(3, Math.max(0, Math.floor(point.x * 4)));
  const row = Math.min(3, Math.max(0, Math.floor(point.y * 4)));
  const dx = point.x * 4 - column - 0.5;
  const dy = point.y * 4 - row - 0.5;
  const side = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "bottom" : "top");
  return { row, column, side };
}

function packetUnits(folds) {
  const units = new Map();
  for (let row = 0; row < 4; row += 1) for (let column = 0; column < 4; column += 1) {
    for (const side of TRIANGLE_SIDES) {
      const c = centroid(cellTriangle(row, column, side));
      if (folds.every((fold) => keepValue(fold, c) > EPS)) {
        const key = `${row}:${column}`;
        if (!units.has(key)) units.set(key, { row, column, sides: [] });
        units.get(key).sides.push(side);
      }
    }
  }
  return [...units.values()].map((unit) => ({ ...unit, full: unit.sides.length === 4 }));
}

function cutCellsOf(cutUnits, folds) {
  const cells = new Set();
  for (const unit of cutUnits) {
    for (const side of unit.sides) {
      for (const image of unfoldPoint(centroid(cellTriangle(unit.row, unit.column, side)), folds)) {
        const located = locateTriangle(image);
        cells.add(located.row * 4 + located.column);
      }
    }
  }
  return [...cells].sort((a, b) => a - b);
}

const unitPolygons = (units) => units.flatMap((unit) => unit.sides.map((side) => cellTriangle(unit.row, unit.column, side)));

function numberGridPanel(numbers, extra = []) {
  const items = [polyItem(SQUARE, "paper"), ...gridItems(SQUARE)];
  numbers.forEach((row, r) => row.forEach((value, c) => items.push({ t: "num", x: round(c / 4 + 0.125), y: round(r / 4 + 0.125), v: value })));
  return { items: [...items, ...extra] };
}

function chooseCutUnits(units, count) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const chosen = shuffled(units).slice(0, count);
    if (chosen.some((unit) => unit.full)) return chosen;
  }
  return units.slice(0, count);
}

// ── 6번: 대각선으로 한 번 접어 자르기 두 문제 ───────────────────────────
function diagonalOnceItem(numbers) {
  const fold = { line: sample(["d1", "d2"]), keep: sample([1, -1]) };
  const folds = [fold];
  const { stages, packet } = foldStages(folds);
  const units = packetUnits(folds);
  const cutUnits = chooseCutUnits(units, randomInt(2, 3));
  const cutCells = cutCellsOf(cutUnits, folds);
  const answer = total(cutCells.map((index) => numbers[Math.floor(index / 4)][index % 4]));
  const stage = stages[0];
  const foldPanel = {
    items: [
      polyItem(stage.moving, "flap"),
      ...gridItems(stage.moving, "grid-flap"),
      polyItem(packet, "paper"),
      ...gridItems(packet),
      ...unitPolygons(cutUnits).map((triangle) => polyItem(triangle, "cut")),
      { t: "arrow", ...stage.arrow }
    ]
  };
  return {
    visual: { kind: "book1", subtype: "ut-fold-panels", panels: [foldPanel, numberGridPanel(numbers)] },
    folds,
    cutUnits: cutUnits.map(({ row, column, sides }) => ({ row, column, sides })),
    cutCells,
    answer
  };
}

function randomNumberGrid(max = 9) {
  return Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => randomInt(1, max)));
}

function diagonalFoldProblem06() {
  const numbers = randomNumberGrid();
  const items = [diagonalOnceItem(numbers), diagonalOnceItem(numbers)];
  const valuesOf = (item) => item.cutCells.map((index) => numbers[Math.floor(index / 4)][index % 4]);
  return {
    prompt: "색종이를 한 번 접은 후 칠해진 부분을 잘라내었습니다. 잘려나간 부분에 있는 수들의 합을 각각 구하시오.",
    visual: { kind: "book1", subtype: "ut-set", columns: 2, items: items.map((item, index) => ({ label: `(${index + 1})`, visual: item.visual })) },
    answer: items.map((item, index) => `(${index + 1}) ${item.answer}`).join(", "),
    solution: `접은 선에서 떨어진 칸은 맞은편의 겹친 칸과 함께 잘리고, 접은 선에 걸친 반 칸은 그 칸의 두 반쪽이 겹쳐 그 칸 하나만 잘립니다. ${items.map((item, index) => `(${index + 1}) ${valuesOf(item).join(" + ")} = ${item.answer}`).join(", ")}입니다.`,
    meta: sourceMeta(6, "two-diagonal-fold-number-grid-cut-sums", { numbers, items: items.map(({ folds, cutUnits, cutCells, answer }) => ({ folds, cutUnits, cutCells, answer })) })
  };
}

// ── 9번: 대각선으로 두 번 접어 자르기 ────────────────────────────────────
function diagonalTwiceProblem09() {
  const numbers = randomNumberGrid();
  const first = sample(["d1", "d2"]);
  const folds = [{ line: first, keep: sample([1, -1]) }, { line: first === "d1" ? "d2" : "d1", keep: sample([1, -1]) }];
  const { stages, packet } = foldStages(folds);
  const units = packetUnits(folds);
  const cutUnits = chooseCutUnits(units, 2);
  const cutCells = cutCellsOf(cutUnits, folds);
  const values = cutCells.map((index) => numbers[Math.floor(index / 4)][index % 4]);
  const answer = total(values);
  const longCrease = (() => {
    const [a, b] = stages[0].crease;
    return segItem([lerp(a, b, -0.1), lerp(a, b, 1.1)], "crease-line");
  })();
  const panels = [
    numberGridPanel(numbers, [longCrease, { t: "arrow", ...stages[0].arrow }]),
    { items: [polyItem(stages[1].polygon, "paper"), ...gridItems(stages[1].polygon), segItem(stages[1].crease, "crease-next"), { t: "arrow", ...stages[1].arrow }] },
    { zoom: 1.15, items: [polyItem(packet, "paper"), ...gridItems(packet), ...unitPolygons(cutUnits).map((triangle) => polyItem(triangle, "cut"))] }
  ];
  return {
    prompt: "다음과 같이 수가 쓰인 색종이를 접어서 색칠된 부분을 자른 후 펼쳤을 때, 잘려나간 부분에 있는 수들의 합을 구하시오.",
    visual: { kind: "book1", subtype: "ut-fold-panels", panels },
    answer: String(answer),
    solution: `두 번 접었으므로 색칠된 곳은 펼치면 접은 선마다 거울처럼 옮겨져 네 겹 모두에서 잘립니다. 잘린 칸의 수는 ${values.join(", ")}이고 합은 ${values.join(" + ")} = ${answer}입니다.`,
    meta: sourceMeta(9, "two-diagonal-folds-number-grid-cut-sum", { numbers, folds, cutUnits: cutUnits.map(({ row, column, sides }) => ({ row, column, sides })), cutCells, answer })
  };
}

// ── 8번: 두 번 접어 모서리를 자르고 펼친 모양 그리기 ─────────────────────
function orthogonalFolds() {
  const first = sample(["h", "v"]);
  return [{ line: first, keep: sample([1, -1]) }, { line: first === "h" ? "v" : "h", keep: sample([1, -1]) }];
}

function boundingBox(polygon) {
  const xs = polygon.map((p) => p.x);
  const ys = polygon.map((p) => p.y);
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

function unfoldBlankPanel() {
  return { items: [polyItem(SQUARE, "blank"), segItem([{ x: 0.5, y: 0 }, { x: 0.5, y: 1 }], "grid-blank"), segItem([{ x: 0, y: 0.5 }, { x: 1, y: 0.5 }], "grid-blank")] };
}

function foldCutUnfoldProblem08() {
  const folds = orthogonalFolds();
  const { stages, packet } = foldStages(folds);
  const box = boundingBox(packet);
  const side = box.x1 - box.x0;
  const corners = [
    { x: box.x0, y: box.y0, dx: 1, dy: 1 }, { x: box.x1, y: box.y0, dx: -1, dy: 1 },
    { x: box.x1, y: box.y1, dx: -1, dy: -1 }, { x: box.x0, y: box.y1, dx: 1, dy: -1 }
  ];
  const chosen = shuffled(corners).slice(0, 2);
  const cuts = chosen.map((corner) => {
    const leg = side * sample([0.4, 0.5]);
    return [{ x: corner.x, y: corner.y }, { x: corner.x + corner.dx * leg, y: corner.y }, { x: corner.x, y: corner.y + corner.dy * leg }];
  });
  const unfolded = cuts.flatMap((cut) => unfoldPolygon(cut, folds));
  const panels = [
    stagePanel(stages[0]),
    stagePanel(stages[1]),
    { items: [polyItem(packet, "paper"), ...cuts.map((cut) => polyItem(cut, "cut"))] },
    unfoldBlankPanel()
  ];
  const answerPanel = { items: [polyItem(SQUARE, "paper"), segItem([{ x: 0.5, y: 0 }, { x: 0.5, y: 1 }], "grid"), segItem([{ x: 0, y: 0.5 }, { x: 1, y: 0.5 }], "grid"), ...unfolded.map((shape) => polyItem(shape, "removed"))] };
  return {
    prompt: "색종이를 두 번 접은 후 칠해진 부분을 잘라내었습니다. 남은 부분을 펼쳤을 때의 그림을 그려 보시오.",
    visual: { kind: "book1", subtype: "ut-fold-panels", panels },
    answerVisual: { kind: "book1", subtype: "ut-fold-panels", panels: [answerPanel] },
    answer: "그림과 같이 잘린 모양이 접은 선을 기준으로 네 곳에 대칭으로 나타납니다.",
    responseKind: "drawing",
    solution: `나중에 접은 선부터 거꾸로 펼칩니다. 한 번 펼칠 때마다 잘린 모양이 접은 선의 반대쪽 같은 거리에 거울처럼 하나씩 더 생기므로, 잘린 모양 ${cuts.length}개가 모두 ${unfolded.length}곳에 나타납니다.`,
    meta: sourceMeta(8, "two-fold-corner-cut-unfold-drawing", { folds, packet: packet.map(pt), cuts: cuts.map((cut) => cut.map(pt)), unfolded: unfolded.map((shape) => shape.map(pt)) })
  };
}

// ── 10번: 두 번 접어 선을 따라 자른 조각의 종류별 개수 ──────────────────
// 가로·세로로 한 번씩 접은 1/4 조각 위에 그은 선을 따라 자른다. 조각을 자른 뒤 접은 선에서 맞닿은
// 조각끼리 이어 붙여 펼친 조각을 만들고, 모양을 삼각형·마름모로 가른다(다른 모양이 섞이면 내지 않는다).
// 아래 선 묶음은 오른쪽 아래 1/4 조각(가운데 꼭짓점이 (0.5, 0.5)) 기준이며, 실제 접힌 자리로 뒤집어 옮긴다.
// 원본의 두 대각선(X) 묶음은 원본 답과 같아지므로 쓰지 않는다.
export const PIECE_CUT_SETS = Object.freeze([
  Object.freeze([{ a: 1, b: 1, c: 1.5 }]),
  Object.freeze([{ a: 1, b: -1, c: 0 }, { a: 1, b: 0, c: 0.75 }, { a: 1, b: 1, c: 1.5 }]),
  Object.freeze([{ a: 1, b: -1, c: 0 }, { a: 0, b: 1, c: 0.75 }, { a: 1, b: 1, c: 1.5 }]),
  Object.freeze([{ a: 1, b: -1, c: -0.25 }, { a: 1, b: -1, c: 0.25 }, { a: 1, b: 1, c: 1.25 }, { a: 1, b: 1, c: 1.75 }])
]);

export function placeCutLine(line, box) {
  let { a, b, c } = line;
  if (box.x0 < 0.25) { c -= a; a = -a; }
  if (box.y0 < 0.25) { c -= b; b = -b; }
  return { a, b, c };
}

function splitPolygon(polygon, line) {
  const value = (p) => line.a * p.x + line.b * p.y - line.c;
  return [clipKeep(polygon, value), clipKeep(polygon, (p) => -value(p))].filter((part) => part.length >= 3 && Math.abs(signedArea(part)) > 1e-9);
}

function sharesEdge(first, second) {
  for (let i = 0; i < first.length; i += 1) {
    const a = first[i];
    const b = first[(i + 1) % first.length];
    for (let j = 0; j < second.length; j += 1) {
      const c = second[j];
      const d = second[(j + 1) % second.length];
      const cross1 = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
      const cross2 = (b.x - a.x) * (d.y - a.y) - (b.y - a.y) * (d.x - a.x);
      if (Math.abs(cross1) > 1e-9 || Math.abs(cross2) > 1e-9) continue;
      const length = Math.hypot(b.x - a.x, b.y - a.y);
      const ux = (b.x - a.x) / length;
      const uy = (b.y - a.y) / length;
      const s1 = (c.x - a.x) * ux + (c.y - a.y) * uy;
      const s2 = (d.x - a.x) * ux + (d.y - a.y) * uy;
      const overlap = Math.min(length, Math.max(s1, s2)) - Math.max(0, Math.min(s1, s2));
      if (overlap > 1e-6) return true;
    }
  }
  return false;
}

function convexHull(points) {
  const unique = [...new Map(points.map((p) => [`${round(p.x)}:${round(p.y)}`, { x: round(p.x), y: round(p.y) }])).values()].sort((a, b) => a.x - b.x || a.y - b.y);
  if (unique.length < 3) return unique;
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower = [];
  for (const p of unique) { while (lower.length >= 2 && cross(lower.at(-2), lower.at(-1), p) <= 1e-9) lower.pop(); lower.push(p); }
  const upper = [];
  for (const p of [...unique].reverse()) { while (upper.length >= 2 && cross(upper.at(-2), upper.at(-1), p) <= 1e-9) upper.pop(); upper.push(p); }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

export function classifyPieceGroup(polygons) {
  const area = total(polygons.map((polygon) => Math.abs(signedArea(polygon))));
  const hull = convexHull(polygons.flat());
  if (Math.abs(Math.abs(signedArea(hull)) - area) > 1e-7) return "other";
  if (hull.length === 3) return "triangle";
  if (hull.length === 4) {
    // 마름모는 보기 그림처럼 변이 모두 비스듬한(대각선 방향) 정사각형만 센다. 변이 가로·세로인 사각형은 다른 모양으로 본다.
    const edges = hull.map((p, index) => ({ x: hull[(index + 1) % 4].x - p.x, y: hull[(index + 1) % 4].y - p.y }));
    const lengths = edges.map((edge) => Math.hypot(edge.x, edge.y));
    const slanted = edges.every((edge) => Math.abs(Math.abs(edge.x) - Math.abs(edge.y)) < 1e-6);
    if (slanted && lengths.every((length) => Math.abs(length - lengths[0]) < 1e-6)) return "diamond";
  }
  return "other";
}

export function unfoldedPieces(packet, chords, folds) {
  let pieces = [packet];
  for (const chord of chords) pieces = pieces.flatMap((piece) => splitPolygon(piece, chord));
  const copies = unfoldPolygon(packet, folds).length;
  const images = [];
  pieces.forEach((piece) => unfoldPolygon(piece, folds).forEach((image, copy) => images.push({ copy, polygon: image })));
  const parent = images.map((_, index) => index);
  const find = (index) => (parent[index] === index ? index : (parent[index] = find(parent[index])));
  for (let i = 0; i < images.length; i += 1) for (let j = i + 1; j < images.length; j += 1) {
    if (images[i].copy !== images[j].copy && sharesEdge(images[i].polygon, images[j].polygon)) parent[find(i)] = find(j);
  }
  const groups = new Map();
  images.forEach((image, index) => {
    const root = find(index);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(image.polygon);
  });
  return { copies, pieces, groups: [...groups.values()].map((group) => ({ polygons: group, kind: classifyPieceGroup(group) })) };
}

function chordSegment(line, polygon) {
  const direction = { x: line.b, y: -line.a };
  const base = Math.abs(line.b) > Math.abs(line.a) ? { x: 0, y: line.c / line.b } : { x: line.c / line.a, y: 0 };
  return clipSegment({ x: base.x - direction.x * 4, y: base.y - direction.y * 4 }, { x: base.x + direction.x * 4, y: base.y + direction.y * 4 }, polygon);
}

function foldPieceProblem10() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const folds = orthogonalFolds();
    const { stages, packet } = foldStages(folds);
    const box = boundingBox(packet);
    const setIndex = randomInt(0, PIECE_CUT_SETS.length - 1);
    const chords = PIECE_CUT_SETS[setIndex].map((line) => placeCutLine(line, box));
    const { groups } = unfoldedPieces(packet, chords, folds);
    if (groups.some((group) => group.kind === "other")) continue;
    const triangles = groups.filter((group) => group.kind === "triangle").length;
    const diamonds = groups.filter((group) => group.kind === "diamond").length;
    if (!triangles || !diamonds) continue;
    const cutSegments = chords.map((chord) => chordSegment(chord, packet)).filter(Boolean);
    const panels = [
      stagePanel(stages[0]),
      stagePanel(stages[1]),
      { items: [polyItem(packet, "paper"), ...cutSegments.map((segment) => segItem(segment, "cutline"))] },
      unfoldBlankPanel()
    ];
    const base = { kind: "book1", subtype: "ut-fold-panels", panels, legend: [{ shape: "triangle" }, { shape: "diamond" }] };
    const answerPanel = { items: [polyItem(SQUARE, "paper"), ...groups.flatMap((group) => group.polygons.map((polygon) => polyItem(polygon, group.kind === "triangle" ? "piece-a" : "piece-b")))] };
    return {
      prompt: "정사각형 모양의 색종이를 다음과 같이 두 번 접어서 선을 따라 잘랐을 때 나오는 도형의 종류별 개수를 각각 구하시오.",
      visual: base,
      answerVisual: { ...base, panels: [answerPanel], legend: [{ shape: "triangle", value: triangles }, { shape: "diamond", value: diamonds }] },
      answer: `삼각형 ${triangles}개, 마름모 ${diamonds}개`,
      solution: `접힌 종이 위의 선을 접은 선마다 거울처럼 펼쳐 그립니다. 접은 선에 맞닿은 조각은 펼치면 맞은편 조각과 붙어 하나가 되므로, 펼친 종이에는 삼각형 ${triangles}개와 마름모 ${diamonds}개가 생깁니다.`,
      meta: sourceMeta(10, "two-fold-line-cuts-two-piece-types", { folds, packet: packet.map(pt), cutSet: setIndex, cutLines: chords, triangles, diamonds })
    };
  }
  return null;
}

// ── 11번: 대각선으로 두 번 접어 원·반원 구멍 뚫기 ─────────────────────────
function segmentDistance(point, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(point.x - (a.x + dx * t), point.y - (a.y + dy * t));
}

function pointInConvex(polygon, point) {
  const orient = signedArea(polygon) > 0 ? 1 : -1;
  return polygon.every((p, index) => {
    const q = polygon[(index + 1) % polygon.length];
    return orient * ((q.x - p.x) * (point.y - p.y) - (q.y - p.y) * (point.x - p.x)) > 0;
  });
}

function foldPunchProblem11({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const first = sample(["d1", "d2"]);
    const folds = [{ line: first, keep: sample([1, -1]) }, { line: first === "d1" ? "d2" : "d1", keep: sample([1, -1]) }];
    const { stages, packet } = foldStages(folds);
    const edges = packet.map((a, index) => {
      const b = packet[(index + 1) % packet.length];
      const crease = folds.findIndex((fold) => Math.abs(FOLD_LINE[fold.line].f(a)) < 1e-7 && Math.abs(FOLD_LINE[fold.line].f(b)) < 1e-7);
      return { a, b, crease };
    });
    const creaseEdges = edges.filter((edge) => edge.crease >= 0);
    const circleCount = difficulty <= 1 ? 1 : randomInt(1, 2);
    const semiCount = difficulty >= 3 ? 2 : randomInt(1, 2);
    const radius = 0.055;
    const holes = [];
    const clear = (center, r) => holes.every((hole) => Math.hypot(hole.cx - center.x, hole.cy - center.y) > hole.r + r + 0.05);
    let guard = 0;
    while (holes.filter((hole) => hole.type === "circle").length < circleCount && guard++ < 400) {
      const center = { x: Math.random(), y: Math.random() };
      if (!pointInConvex(packet, center)) continue;
      if (edges.some((edge) => segmentDistance(center, edge.a, edge.b) < radius + 0.045)) continue;
      if (clear(center, radius)) holes.push({ type: "circle", cx: round(center.x), cy: round(center.y), r: radius });
    }
    while (holes.filter((hole) => hole.type === "semi").length < semiCount && guard++ < 800) {
      const edge = sample(creaseEdges);
      const t = 0.25 + Math.random() * 0.5;
      const center = lerp(edge.a, edge.b, t);
      const length = Math.hypot(edge.b.x - edge.a.x, edge.b.y - edge.a.y);
      if (t * length < radius + 0.05 || (1 - t) * length < radius + 0.05) continue;
      if (!clear(center, radius)) continue;
      let nx = (edge.b.y - edge.a.y) / length;
      let ny = -(edge.b.x - edge.a.x) / length;
      const inside = centroid(packet);
      if ((inside.x - center.x) * nx + (inside.y - center.y) * ny > 0) { nx = -nx; ny = -ny; }
      holes.push({ type: "semi", cx: round(center.x), cy: round(center.y), r: radius, nx: round(nx), ny: round(ny), crease: edge.crease });
    }
    if (holes.filter((hole) => hole.type === "circle").length !== circleCount || holes.filter((hole) => hole.type === "semi").length !== semiCount) continue;
    const centers = [];
    holes.forEach((hole) => unfoldPoint({ x: hole.cx, y: hole.cy }, folds).forEach((image) => {
      if (!centers.some((center) => Math.hypot(center.x - image.x, center.y - image.y) < 1e-3)) centers.push(image);
    }));
    const answer = centers.length;
    if (answer !== circleCount * 4 + semiCount * 2) continue;
    const panels = [
      stagePanel(stages[0]),
      stagePanel(stages[1]),
      { zoom: 1.35, items: [polyItem(packet, "paper"), ...holes.map((hole) => (hole.type === "circle" ? { t: "circle", x: hole.cx, y: hole.cy, r: hole.r } : { t: "semi", x: hole.cx, y: hole.cy, r: hole.r, nx: hole.nx, ny: hole.ny }))] }
    ];
    return {
      prompt: "정사각형 모양의 색종이를 다음과 같이 2번 접은 후, 원 모양의 구멍과 반원 모양의 구멍을 뚫었습니다. 펼친 모양에서 뚫린 구멍은 모두 몇 개인지 구하시오.",
      visual: { kind: "book1", subtype: "ut-fold-panels", panels },
      answer: `${answer}개`,
      solution: `두 번 접어 네 겹이므로 접힌 종이 안쪽의 원 구멍은 펼치면 4개씩 생깁니다. 접은 선 위의 반원 구멍은 펼치면 맞은편 반원과 붙어 원 구멍이 되므로 2개씩 생깁니다. 원 ${circleCount}개, 반원 ${semiCount}개이므로 ${circleCount} × 4 + ${semiCount} × 2 = ${answer}개입니다.`,
      meta: sourceMeta(11, "two-diagonal-folds-circle-and-crease-semicircle-holes", { folds, packet: packet.map(pt), holes, circleCount, semiCount, answer })
    };
  }
  return null;
}

// ── 12·13번: 가운데 들어갈 수 있는 수 세 가지와 한 줄의 합 ──────────────────
function crossCenters(cards) {
  return cards.flatMap((center) => {
    const rest = cards.filter((value) => value !== center).sort((a, b) => a - b);
    return rest[0] + rest[3] === rest[1] + rest[2]
      ? [{ center, pairs: [[rest[0], rest[3]], [rest[1], rest[2]]], lineSum: center + rest[0] + rest[3] }]
      : [];
  });
}

function flowerCenters(cards) {
  return cards.flatMap((center) => {
    const rest = cards.filter((value) => value !== center).sort((a, b) => a - b);
    const pairs = [[rest[0], rest[5]], [rest[1], rest[4]], [rest[2], rest[3]]];
    return pairs.every((pair) => pair[0] + pair[1] === pairs[0][0] + pairs[0][1])
      ? [{ center, pairs, lineSum: center + pairs[0][0] + pairs[0][1] }]
      : [];
  });
}

const NUMBERS_1_12 = Array.from({ length: 12 }, (_, index) => index + 1);
const CROSS_CARD_SETS = Object.freeze(combinations(NUMBERS_1_12, 5).filter((cards) => crossCenters(cards).length === 3 && cards.join() !== "2,4,6,8,10"));
const FLOWER_CARD_SETS = Object.freeze(combinations(NUMBERS_1_12, 7).filter((cards) => flowerCenters(cards).length === 3 && cards.join() !== "3,4,5,6,7,8,9"));

function centerSumAnswer(options) {
  return options.map((option) => `가운데 ${option.center}, 합 ${option.lineSum}`).join(" / ");
}

function crossMagicProblem12() {
  const cards = sample(CROSS_CARD_SETS);
  const options = crossCenters(cards);
  const arrangement = (option) => {
    const [vertical, horizontal] = shuffled(option.pairs).map((pair) => shuffled(pair));
    return { top: vertical[0], bottom: vertical[1], left: horizontal[0], right: horizontal[1], center: option.center };
  };
  const base = { kind: "book1", subtype: "ut-cross-set", cards };
  return {
    prompt: "다음 주어진 수들을 이용하여 가로와 세로에 있는 세 수의 합이 같도록 십자 마방진을 완성하려고 합니다. 가운데 들어갈 수 있는 수와 한 줄의 합이 될 수 있는 수를 각각 구하시오.",
    visual: { ...base, boards: options.map(() => null), sums: options.map(() => null) },
    answerVisual: { ...base, boards: options.map(arrangement), sums: options.map((option) => option.lineSum) },
    answer: centerSumAnswer(options),
    responseKind: "drawing-plus-text",
    solution: `가운데 수를 뺀 나머지 네 수를 합이 같은 두 쌍으로 나눌 수 있어야 합니다. ${options.map((option) => `가운데에 ${object(String(option.center))} 놓으면 ${option.pairs.map((pair) => pair.join(" + ")).join(", ")}의 합이 같아 한 줄의 합은 ${option.lineSum}`).join("이고, ")}입니다.`,
    meta: sourceMeta(12, "three-cross-centers-and-line-sums", { cards, options })
  };
}

function flowerMagicProblem13() {
  const cards = sample(FLOWER_CARD_SETS);
  const options = flowerCenters(cards);
  const arrangement = (option) => {
    const pairs = shuffled(option.pairs).map((pair) => shuffled(pair));
    return { center: option.center, petals: [pairs[0][0], pairs[1][0], pairs[2][0], pairs[0][1], pairs[1][1], pairs[2][1]] };
  };
  const consecutive = cards.every((value, index) => index === 0 || value === cards[index - 1] + 1);
  const lead = consecutive ? `${cards[0]}에서 ${cards.at(-1)}까지의 숫자 카드를` : "주어진 숫자 카드를";
  const base = { kind: "book1", subtype: "ut-flower-set", cards };
  return {
    prompt: `${lead} 사용하여 같은 줄에 있는 세 수의 합이 모두 같도록 만들려고 합니다. 가운데 들어갈 수 있는 수와, 한 줄의 합이 될 수 있는 수를 각각 구하시오.`,
    visual: { ...base, boards: options.map(() => null), sums: options.map(() => null) },
    answerVisual: { ...base, boards: options.map(arrangement), sums: options.map((option) => option.lineSum) },
    answer: centerSumAnswer(options),
    responseKind: "drawing-plus-text",
    solution: `가운데 수를 뺀 나머지 여섯 수를 합이 같은 세 쌍으로 나눌 수 있어야 합니다. ${options.map((option) => `가운데에 ${object(String(option.center))} 놓으면 ${option.pairs.map((pair) => pair.join(" + ")).join(", ")}의 합이 같아 한 줄의 합은 ${option.lineSum}`).join("이고, ")}입니다.`,
    meta: sourceMeta(13, "three-seven-card-centers-and-line-sums", { cards, options })
  };
}

// ── 14번: 여덟 수를 네모 둘레에 놓아 네 줄의 합 맞추기 ──────────────────────
// 자리: 0 왼쪽 위, 1 위, 2 오른쪽 위, 3 오른쪽, 4 오른쪽 아래, 5 아래, 6 왼쪽 아래, 7 왼쪽
export const RING8_LINES = Object.freeze([[0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 0]]);
const ring8Cache = new Map();
function ring8Solutions(start) {
  if (!ring8Cache.has(start)) {
    const cards = Array.from({ length: 8 }, (_, index) => start + index);
    const bySum = new Map();
    for (const order of permutations(cards)) {
      const sums = RING8_LINES.map((line) => total(line.map((index) => order[index])));
      if (sums.every((value) => value === sums[0])) {
        if (!bySum.has(sums[0])) bySum.set(sums[0], []);
        bySum.get(sums[0]).push(order);
      }
    }
    ring8Cache.set(start, bySum);
  }
  return ring8Cache.get(start);
}

function ring8Problem14() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const start = sample([1, 2, 3, 4]);
    const bySum = ring8Solutions(start);
    const lineSum = sample([...bySum.keys()].filter((value) => !(start === 2 && value === 18)));
    if (lineSum == null) continue;
    const solutions = bySum.get(lineSum);
    const solution = sample(solutions);
    const corners = [0, 2, 4, 6];
    const clueSets = [...shuffled(combinations(corners, 3)), ...shuffled(combinations([0, 1, 2, 3, 4, 5, 6, 7], 3))];
    for (const clues of clueSets) {
      const matches = solutions.filter((candidate) => clues.every((index) => candidate[index] === solution[index]));
      if (matches.length !== 1) continue;
      const cards = Array.from({ length: 8 }, (_, index) => start + index);
      const shown = solution.map((value, index) => (clues.includes(index) ? value : null));
      const base = { kind: "book1", subtype: "ut-ring8", cards };
      return {
        prompt: `${start}부터 ${start + 7}까지 수를 한 번씩 사용하여 가로, 세로 각 줄의 합이 ${subject(String(lineSum))} 되도록 빈 칸에 알맞은 수를 써 넣으시오.`,
        visual: { ...base, shown },
        answerVisual: { ...base, cards: [], shown: solution },
        answer: `왼쪽 위부터 시계 방향으로 ${solution.join(", ")}`,
        responseKind: "drawing",
        solution: `이미 놓인 두 수가 있는 줄부터 ${lineSum}에서 그 수들을 빼어 가운데 칸을 찾고, 남은 수로 나머지 줄을 맞춥니다. 왼쪽 위부터 시계 방향으로 ${solution.join(", ")}입니다.`,
        meta: sourceMeta(14, "eight-card-square-ring-four-equal-lines", { cards, lineSum, solution, shown, clues, uniqueCount: 1 })
      };
    }
  }
  return null;
}

// ── 15번: 3에서 8처럼 이어진 여섯 수로 두 삼각진 ─────────────────────────────
// 자리: 0 위, 1 왼쪽 변, 2 오른쪽 변, 3 왼쪽 아래, 4 아래 변, 5 오른쪽 아래
export const TRIANGLE6_LINES = Object.freeze([[0, 1, 3], [0, 2, 5], [3, 4, 5]]);
export const TRIANGLE6_VERTICES = Object.freeze([0, 3, 5]);

function triangleProblem15() {
  const start = sample([1, 2, 4, 5]);
  const cards = Array.from({ length: 6 }, (_, index) => start + index);
  const bySum = new Map();
  for (const order of permutations(cards)) {
    const sums = TRIANGLE6_LINES.map((line) => total(line.map((index) => order[index])));
    if (sums.every((value) => value === sums[0])) {
      if (!bySum.has(sums[0])) bySum.set(sums[0], []);
      bySum.get(sums[0]).push(order);
    }
  }
  const lineSums = shuffled([...bySum.keys()]).slice(0, 2).sort((a, b) => a - b);
  const items = lineSums.map((lineSum) => {
    const solutions = bySum.get(lineSum);
    const solution = sample(solutions);
    for (const clues of shuffled(combinations(TRIANGLE6_VERTICES, 2))) {
      const matches = solutions.filter((candidate) => clues.every((index) => candidate[index] === solution[index]));
      if (matches.length === 1) return { lineSum, solution, clues, shown: solution.map((value, index) => (clues.includes(index) ? value : null)), uniqueCount: 1 };
    }
    return null;
  });
  if (items.some((item) => !item)) return null;
  const set = (reveal) => ({
    kind: "book1", subtype: "ut-set", columns: 2,
    items: items.map((item, index) => ({ label: `(${index + 1}) 한 줄의 합이 ${item.lineSum}인 경우`, visual: { kind: "book1", subtype: "ut-triangle6", shown: reveal ? item.solution : item.shown } }))
  });
  return {
    prompt: `삼각형의 꼭짓점과 변에 놓인 ○ 안에 ${start}에서 ${start + 5}까지의 수를 넣어 주어진 조건을 만족하는 삼각진을 완성하시오.`,
    visual: set(false),
    answerVisual: set(true),
    answer: items.map((item, index) => `(${index + 1}) 위부터 ${item.solution.join(", ")}`).join(" / "),
    responseKind: "drawing",
    solution: `세 변의 합을 모두 더하면 꼭짓점의 수는 두 번씩 더해집니다. ${items.map((item, index) => `(${index + 1}) 꼭짓점의 합은 ${item.lineSum} × 3 - ${total(cards)} = ${item.lineSum * 3 - total(cards)}이므로 남은 꼭짓점을 먼저 찾고, 변의 가운데 수는 ${item.lineSum}에서 양 끝 수를 빼어 구합니다`).join(". ")}.`,
    meta: sourceMeta(15, "two-six-card-triangle-edge-sums", { cards, items })
  };
}

// ── 16번: 일곱 장의 숫자 카드로 계단 모양 가쿠로 ─────────────────────────
export const GAKURO_MASK = Object.freeze([1, 1, 0, 1, 1, 1, 0, 1, 1]);
export const GAKURO_ACTIVE = Object.freeze([0, 1, 3, 4, 5, 7, 8]);
export function gakuroSums(values) {
  return {
    rowSums: [values[0] + values[1], values[3] + values[4] + values[5], values[7] + values[8]],
    columnSums: [values[0] + values[3], values[1] + values[4] + values[7], values[5] + values[8]]
  };
}

function gakuroProblem16() {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const cards = shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 7).sort((a, b) => a - b);
    if (cards.join() === "1,2,3,6,7,8,9") continue;
    const placed = shuffled(cards);
    const solution = Array(9).fill(null);
    GAKURO_ACTIVE.forEach((index, order) => { solution[index] = placed[order]; });
    const { rowSums, columnSums } = gakuroSums(solution);
    const given = sample(GAKURO_ACTIVE);
    const rest = cards.filter((value) => value !== solution[given]);
    const hidden = GAKURO_ACTIVE.filter((index) => index !== given);
    const matches = permutations(rest).filter((order) => {
      const values = [...solution];
      hidden.forEach((index, position) => { values[index] = order[position]; });
      const sums = gakuroSums(values);
      return sums.rowSums.join() === rowSums.join() && sums.columnSums.join() === columnSums.join();
    });
    if (matches.length !== 1) continue;
    const shown = solution.map((value, index) => (index === given ? value : null));
    const base = { kind: "book1", subtype: "ut-gakuro", mask: GAKURO_MASK, rowSums, columnSums };
    return {
      prompt: "주어진 숫자카드의 수를 한 번씩만 써서 가로줄, 세로줄에 있는 수의 합이 표의 위 또는 왼쪽에 쓰인 수가 되도록 빈 칸을 채우시오.",
      visual: { ...base, cards, shown },
      answerVisual: { ...base, cards: [], shown: solution },
      answer: `위 줄부터 ${GAKURO_ACTIVE.map((index) => solution[index]).join(", ")}`,
      responseKind: "drawing",
      solution: `두 칸짜리 줄은 합을 만드는 두 수의 짝이 적으므로 먼저 정하고, 그 수가 지나는 세 칸짜리 줄에서 나머지를 뺍니다. 위 줄부터 차례로 ${GAKURO_ACTIVE.map((index) => solution[index]).join(", ")}입니다.`,
      meta: sourceMeta(16, "seven-card-irregular-row-column-sums", { cards, solution, shown, given, rowSums, columnSums, uniqueCount: 1 })
    };
  }
  return null;
}

// ── 18번: 원 둘레의 네 수와 두 직선의 세 수 ─────────────────────────────────
// 자리: 0 위, 1 왼쪽, 2 가운데, 3 오른쪽, 4 아래
export function ellipseCenters(cards) {
  const centers = new Set();
  for (const order of permutations(cards)) {
    const vertical = order[0] + order[2] + order[4];
    const horizontal = order[1] + order[2] + order[3];
    const outer = order[0] + order[1] + order[3] + order[4];
    if (vertical === horizontal && horizontal === outer) centers.add(order[2]);
  }
  return [...centers];
}

function ellipseProblem18() {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const center = randomInt(5, 11);
    const pairs = [];
    const used = new Set([center]);
    for (const small of shuffled(Array.from({ length: center - 1 }, (_, index) => index + 1))) {
      const big = center - small;
      if (small === big || used.has(small) || used.has(big)) continue;
      used.add(small); used.add(big); pairs.push([small, big]);
      if (pairs.length === 2) break;
    }
    if (pairs.length < 2) continue;
    const cards = [...used].sort((a, b) => a - b);
    if (cards.join() === "1,2,3,4,5") continue;
    if (ellipseCenters(cards).join() !== String(center)) continue;
    return {
      prompt: `다음 그림의 원 안에 수 ${object(cards.join(", "))} 넣어 직선 위에 있는 세 수의 합과 원의 둘레에 있는 네 수의 합이 모두 같게 만들려고 합니다. 가운데 들어갈 수를 구하시오.`,
      visual: { kind: "book1", subtype: "ut-ellipse", cards, shown: [null, null, null, null, null] },
      answerVisual: { kind: "book1", subtype: "ut-ellipse", cards: [], shown: [pairs[0][0], pairs[1][0], center, pairs[1][1], pairs[0][1]] },
      answer: String(center),
      solution: `두 직선의 합을 더하면 둘레의 네 수에 가운데 수가 두 번 더해진 값이고, 이것이 둘레 네 수의 합의 두 배와 같으므로 둘레 네 수의 합은 가운데 수의 2배입니다. 다섯 수의 합 ${total(cards)}은 가운데 수의 3배이므로 가운데 수는 ${total(cards)} ÷ 3 = ${center}입니다.`,
      meta: sourceMeta(18, "five-card-circle-two-lines-center", { cards, center, pairs, answer: center })
    };
  }
  return null;
}

// ── 19·20·21번: 조건에 맞는 수 ─────────────────────────────────────────────
function conditionsVisual(clues, places = null) {
  return { kind: "book1", subtype: "ut-conditions", clues, ...(places ? { places } : {}) };
}

function digitSumRangeProblem19() {
  const options = [];
  for (let tens = 1; tens <= 7; tens += 1) for (let digitSum = tens + 1; digitSum <= tens + 9; digitSum += 1) {
    if (digitSum - tens > 9 || digitSum - tens - 1 < 0) continue;
    for (const parity of [0, 1]) {
      if (tens === 5 && digitSum === 8) continue;
      options.push({ lower: tens * 10, upper: (tens + 2) * 10, digitSum, parity });
    }
  }
  const choice = sample(options);
  const candidates = Array.from({ length: choice.upper - choice.lower - 1 }, (_, index) => choice.lower + index + 1)
    .filter((value) => Math.floor(value / 10) + (value % 10) === choice.digitSum);
  const answers = candidates.filter((value) => value % 2 === choice.parity);
  if (answers.length !== 1) return digitSumRangeProblem19();
  const parityWord = choice.parity ? "홀수" : "짝수";
  return {
    prompt: "다음 주어진 조건에 맞는 두 자리 수를 구하시오.",
    visual: conditionsVisual([`일의 자리 숫자와 십의 자리 숫자를 더하면 ${choice.digitSum}입니다.`, `${choice.lower}보다 크고 ${choice.upper}보다 작은 ${parityWord}입니다.`]),
    answer: String(answers[0]),
    solution: `${choice.lower}보다 크고 ${choice.upper}보다 작은 수 중 두 숫자의 합이 ${choice.digitSum}인 수는 ${candidates.join(", ")}입니다. 이 중 ${parityWord}는 ${answers[0]}입니다.`,
    meta: sourceMeta(19, "two-digit-range-digit-sum-parity", { ...choice, candidates, answer: answers[0] })
  };
}

function evenGapProblem20() {
  const options = [];
  for (const lower of [10, 20, 30, 40, 50, 60, 70, 80]) for (let gap = 1; gap <= 8; gap += 1) {
    if (lower === 70 && gap === 4) continue;
    const answers = Array.from({ length: 99 - lower }, (_, index) => lower + index + 1)
      .filter((value) => value % 2 === 0 && Math.floor(value / 10) - (value % 10) === gap);
    if (answers.length === 1) options.push({ lower, gap, answer: answers[0] });
  }
  const choice = sample(options);
  return {
    prompt: "다음 주어진 조건에 맞는 두 자리 수를 구하시오.",
    visual: conditionsVisual([`${choice.lower}보다 큰 두 자리 짝수입니다.`, `십의 자리 숫자가 일의 자리 숫자보다 ${choice.gap} 큽니다.`]),
    answer: String(choice.answer),
    solution: `십의 자리 숫자가 일의 자리 숫자보다 ${choice.gap} 큰 수를 차례로 써 보고, 그중 ${choice.lower}보다 크면서 일의 자리 숫자가 짝수인 수를 고르면 ${choice.answer}입니다.`,
    meta: sourceMeta(20, "even-two-digit-tens-minus-ones", { lower: choice.lower, gap: choice.gap, answer: choice.answer })
  };
}

const PLACE_FAMILIES = Object.freeze([
  { direction: "down", step: 1, example: 321 }, { direction: "down", step: 2, example: 531 },
  { direction: "up", step: 1, example: 123 }, { direction: "up", step: 2, example: 135 }
]);

export function placeFamilyNumbers(family) {
  const values = [];
  for (let hundreds = 1; hundreds <= 9; hundreds += 1) {
    const sign = family.direction === "down" ? -1 : 1;
    const tens = hundreds + sign * family.step;
    const ones = hundreds + sign * family.step * 2;
    if (tens >= 0 && tens <= 9 && ones >= 0 && ones <= 9) values.push(hundreds * 100 + tens * 10 + ones);
  }
  return values;
}
const digitSumOf = (value) => total(String(value).split("").map(Number));

function placeConditionProblem21() {
  const options = [];
  for (const family of PLACE_FAMILIES) {
    const numbers = placeFamilyNumbers(family);
    for (let threshold = 4; threshold <= 24; threshold += 1) for (const compare of ["큰", "작은"]) for (const parity of [0, 1]) {
      if (family.direction === "down" && family.step === 1 && threshold === 20 && compare === "큰" && parity === 0) continue;
      const answers = numbers.filter((value) => {
        const sum = digitSumOf(value);
        return (compare === "큰" ? sum > threshold : sum < threshold) && sum % 2 === parity;
      });
      if (answers.length === 1) options.push({ family, threshold, compare, parity, answer: answers[0], numbers });
    }
  }
  const choice = sample(options);
  const parityWord = choice.parity ? "홀수" : "짝수";
  const moveWord = choice.family.direction === "down" ? "작아집니다" : "커집니다";
  return {
    prompt: "다음 주어진 조건에 맞는 세 자리 수를 구하시오.",
    visual: conditionsVisual([
      `${withWord(String(choice.family.example))} 같이 자리가 내려갈수록 ${choice.family.step}씩 ${moveWord}.`,
      `각 자리 숫자의 합이 ${choice.threshold}보다 ${choice.compare} ${parityWord}입니다.`
    ], ["백", "십", "일"]),
    answer: String(choice.answer),
    solution: `자리가 내려갈수록 ${choice.family.step}씩 ${moveWord.replace("집니다", "지는")} 세 자리 수는 ${choice.numbers.join(", ")}입니다. 각 자리 숫자의 합이 ${choice.threshold}보다 ${choice.compare} ${parityWord}인 수는 ${choice.answer}뿐입니다.`,
    meta: sourceMeta(21, "three-digit-place-step-and-digit-sum", { direction: choice.family.direction, step: choice.family.step, threshold: choice.threshold, compare: choice.compare, parity: choice.parity, answer: choice.answer })
  };
}

// ── 22~25번: 논리 추리 ─────────────────────────────────────────────────────
const CHILD_NAMES = Object.freeze(["서준", "하윤", "도윤", "지아", "시우", "하린", "예준", "수아", "유나", "준서", "지호", "서아", "다온", "나래", "우진", "소희"]);
const FRUITS = Object.freeze(["사과", "배", "귤", "포도", "복숭아", "수박", "자두", "키위", "망고", "체리"]);
const COLORS = Object.freeze([
  { name: "빨강", hint: "빨간 사과를 좋아합니다.", dislike: "빨간색을 싫어합니다." },
  { name: "파랑", hint: "파란 바다를 보면 기분이 좋아집니다.", dislike: "파란색을 싫어합니다." },
  { name: "초록", hint: "초록 숲을 보면 기분이 좋아집니다.", dislike: "초록색을 싫어합니다." },
  { name: "노랑", hint: "노란 해바라기를 좋아합니다.", dislike: "노란색을 싫어합니다." },
  { name: "보라", hint: "보라색 포도를 좋아합니다.", dislike: "보라색을 싫어합니다." },
  { name: "주황", hint: "주황색 귤을 좋아합니다.", dislike: "주황색을 싫어합니다." }
]);
const JOBS = Object.freeze([
  { job: "의사", place: "병원" }, { job: "소방관", place: "소방서" }, { job: "선생님", place: "학교" },
  { job: "경찰관", place: "경찰서" }, { job: "요리사", place: "식당" }, { job: "집배원", place: "우체국" }, { job: "사서", place: "도서관" }
]);

export function countAssignments(size, clues) {
  return permutations(Array.from({ length: size }, (_, index) => index)).filter((perm) => clues.every((clue) => (clue.type === "is" ? perm[clue.person] === clue.item : perm[clue.person] !== clue.item)));
}

function logicVisual(layout, left, right, clueTexts, extra = {}) {
  return { kind: "book1", subtype: "ut-logic", layout, left, right, clues: clueTexts, ...extra };
}

function fruitLogicProblem22() {
  const names = shuffled(CHILD_NAMES).slice(0, 3);
  const items = shuffled(FRUITS).slice(0, 3);
  const solution = shuffled([0, 1, 2]);
  const [a, b, c] = shuffled([0, 1, 2]);
  const clues = [{ type: "not", person: a, item: solution[c] }, { type: "is", person: b, item: solution[b] }];
  const texts = [`${nameTopic(names[a])} ${object(items[solution[c]])} 좋아하지 않습니다.`, `${nameTopic(names[b])} ${object(items[solution[b]])} 좋아합니다.`];
  return {
    prompt: `${listWithTopic(names, nameTopic)} ${items.join(", ")} 중 서로 다른 과일을 한 가지씩 좋아합니다. ${nameSubject(names[c])} 좋아하는 과일을 구하시오.`,
    visual: logicVisual("columns", names, items, texts),
    answer: items[solution[c]],
    solution: `${nameTopic(names[b])} ${object(items[solution[b]])} 좋아하므로 남은 과일은 ${withWord(items[solution[a]])} ${items[solution[c]]}입니다. ${nameTopic(names[a])} ${object(items[solution[c]])} 좋아하지 않으므로 ${object(items[solution[a]])} 좋아하고, ${nameTopic(names[c])} ${object(items[solution[c]])} 좋아합니다.`,
    meta: sourceMeta(22, "three-person-three-fruit-logic", { names, items, clues, target: c, solution, answer: items[solution[c]], uniqueCount: countAssignments(3, clues).length })
  };
}

function colorLogicProblem23() {
  const names = shuffled(CHILD_NAMES).slice(0, 4);
  const colors = shuffled(COLORS).slice(0, 4);
  const solution = shuffled([0, 1, 2, 3]);
  const [a, b, c, d] = shuffled([0, 1, 2, 3]);
  const clues = [{ type: "is", person: a, item: solution[a] }, { type: "is", person: b, item: solution[b] }, { type: "not", person: c, item: solution[d] }];
  const texts = [`${nameTopic(names[a])} ${colors[solution[a]].hint}`, `${nameTopic(names[b])} ${colors[solution[b]].hint}`, `${nameTopic(names[c])} ${colors[solution[d]].dislike}`];
  const target = colors[solution[d]].name;
  return {
    prompt: `${listWithTopic(names, nameTopic)} ${colors.map((color) => color.name).join(", ")} 중에서 서로 다른 한 가지 색을 좋아합니다. ${object(target)} 좋아하는 사람은 누구인지 구하시오.`,
    visual: logicVisual("rows", names, colors.map((color) => color.name), texts),
    answer: names[d],
    solution: `${nameTopic(names[a])} ${colors[solution[a]].name}, ${nameTopic(names[b])} ${object(colors[solution[b]].name)} 좋아합니다. 남은 색은 ${withWord(colors[solution[c]].name)} ${target}인데 ${nameTopic(names[c])} ${object(target)} 싫어하므로 ${object(colors[solution[c]].name)} 좋아하고, ${object(target)} 좋아하는 사람은 ${names[d]}입니다.`,
    meta: sourceMeta(23, "four-child-four-color-logic", { names, colors: colors.map((color) => color.name), clues, targetItem: solution[d], solution, answer: names[d], uniqueCount: countAssignments(4, clues).length })
  };
}

function placeLogicProblem24() {
  const chosen = shuffled(JOBS).slice(0, 3);
  const jobs = chosen.map((item) => item.job);
  const places = shuffled(chosen.map((item) => item.place));
  const own = jobs.map((_, index) => places.indexOf(chosen[index].place));
  const derangements = permutations([0, 1, 2]).filter((perm) => perm.every((place, person) => place !== own[person]));
  const solution = sample(derangements);
  const [a, b, c] = shuffled([0, 1, 2]);
  const clues = [{ type: "is", person: b, item: solution[b] }, { type: "not", person: c, item: solution[a] }];
  const texts = [`${topic(jobs[b])} ${places[solution[b]]}에 있습니다.`, `${topic(jobs[c])} ${places[solution[a]]}에 없습니다.`];
  return {
    prompt: `${listWithTopic(jobs)} ${places.join(", ")} 중 서로 다른 장소에 있습니다. ${places[solution[a]]}에 있는 사람은 누구인지 구하시오.`,
    visual: logicVisual("columns", jobs, places, texts),
    answer: jobs[a],
    solution: `${topic(jobs[b])} ${places[solution[b]]}에 있으므로 남은 장소는 ${withWord(places[solution[a]])} ${places[solution[c]]}입니다. ${topic(jobs[c])} ${places[solution[a]]}에 없으므로 ${places[solution[c]]}에 있고, ${places[solution[a]]}에 있는 사람은 ${jobs[a]}입니다.`,
    meta: sourceMeta(24, "three-job-three-place-logic", { jobs, places, clues, targetItem: solution[a], solution, answer: jobs[a], uniqueCount: countAssignments(3, clues).length })
  };
}

// 키: order[0]이 가장 큰 사람. 단서 종류 lt(a가 b보다 작다)·between(a가 taller보다 작고 shorter보다 크다)·tallest·shortest.
export function heightOrders(clues, size = 4) {
  return permutations(Array.from({ length: size }, (_, index) => index)).filter((order) => {
    const rank = (person) => order.indexOf(person);
    return clues.every((clue) => {
      if (clue.type === "lt") return rank(clue.a) > rank(clue.b);
      if (clue.type === "between") return rank(clue.a) > rank(clue.taller) && rank(clue.a) < rank(clue.shorter);
      if (clue.type === "tallest") return rank(clue.a) === 0;
      return rank(clue.a) === size - 1;
    });
  });
}

function heightOrderProblem25() {
  const names = shuffled(CHILD_NAMES).slice(0, 4);
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const order = shuffled([0, 1, 2, 3]);
    const rank = (person) => order.indexOf(person);
    const people = [0, 1, 2, 3];
    const pairClues = people.flatMap((a) => people.filter((b) => b !== a && rank(a) > rank(b)).map((b) => ({ type: "lt", a, b })));
    const betweenClues = people.flatMap((a) => people.flatMap((taller) => people.filter((shorter) => rank(taller) < rank(a) && rank(shorter) > rank(a)).map((shorter) => ({ type: "between", a, taller, shorter }))));
    const extreme = sample([{ type: "tallest", a: order[0] }, { type: "shortest", a: order[3] }]);
    const clues = [sample(pairClues), sample(betweenClues), extreme];
    if (heightOrders(clues).length !== 1) continue;
    const third = order[2];
    if (clues.some((clue) => clue.type !== "lt" && clue.type !== "between" && clue.a === third)) continue;
    const text = (clue) => {
      if (clue.type === "lt") return `${nameTopic(names[clue.a])} ${nameThan(names[clue.b])} 작습니다.`;
      if (clue.type === "between") return `${nameTopic(names[clue.a])} ${nameThan(names[clue.taller])} 작고 ${nameThan(names[clue.shorter])} 큽니다.`;
      return `${nameSubject(names[clue.a])} 가장 ${clue.type === "tallest" ? "큽니다" : "작습니다"}.`;
    };
    return {
      prompt: `다음은 ${names.join(", ")}의 키를 비교한 것입니다. 키가 세 번째로 큰 사람은 누구인지 구하시오.`,
      visual: logicVisual("rows", names, ["1", "2", "3", "4"], clues.map(text), { ends: ["크다", "작다"] }),
      answer: names[third],
      solution: `단서를 키 순서로 이어 놓으면 큰 사람부터 ${order.map((person) => names[person]).join(", ")}입니다. 따라서 세 번째로 큰 사람은 ${names[third]}입니다.`,
      meta: sourceMeta(25, "four-person-height-third-tallest", { names, clues, order, targetRank: 3, answer: names[third], uniqueCount: 1 })
    };
  }
  return null;
}

const SOURCE_GENERATORS = Object.freeze({
  1: partitionProblem01,
  2: digitalFlipProblem02,
  3: digitalAdditionProblem03,
  4: orientedBoardProblem04,
  5: squirrelPartitionProblem05,
  6: diagonalFoldProblem06,
  8: foldCutUnfoldProblem08,
  9: diagonalTwiceProblem09,
  10: foldPieceProblem10,
  11: foldPunchProblem11,
  12: crossMagicProblem12,
  13: flowerMagicProblem13,
  14: ring8Problem14,
  15: triangleProblem15,
  16: gakuroProblem16,
  18: ellipseProblem18,
  19: digitSumRangeProblem19,
  20: evenGapProblem20,
  21: placeConditionProblem21,
  22: fruitLogicProblem22,
  23: colorLogicProblem23,
  24: placeLogicProblem24,
  25: heightOrderProblem25
});

export function book01UnitTestProblem({ difficulty = 2, sourceCase } = {}) {
  const number = Number(sourceCase?.number);
  if (sourceCase?.sourceKind !== "unit-test" || sourceCase?.sourceId !== "book-01" || !SOURCE_QUESTIONS.has(number)) return null;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const problem = SOURCE_GENERATORS[number]({ difficulty });
    if (problem) return problem;
  }
  return null;
}

export const BOOK01_UNIT_TEST_INTERNALS = Object.freeze({ CONGRUENT_TILINGS, CENTER_GUIDES, FOLD_LINE, SQUARE });
