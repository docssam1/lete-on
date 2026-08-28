/* =========================================================================
   Polyomino Garden - source-backed piece data and exact shape comparisons.

   A piece is stored as unit-square coordinates. Level 1 asks whether two
   pieces are the same after turning. Level 2 deliberately separates turning
   from flipping, so its answer key uses rotationKey rather than freeShapeKey.
   ========================================================================= */

export const GAME_ID = "polyomino";
export const PROGRESS_KEY = "polyominoGarden";

const sortCells = (cells) => [...cells].sort((a, b) => a[1] - b[1] || a[0] - b[0]);

export function normalize(cells) {
  const minX = Math.min(...cells.map(([x]) => x));
  const minY = Math.min(...cells.map(([, y]) => y));
  return sortCells(cells.map(([x, y]) => [x - minX, y - minY]));
}

export function shapeKey(cells) {
  return normalize(cells).map(([x, y]) => `${x},${y}`).join(" ");
}

export const rotate = (cells) => normalize(cells.map(([x, y]) => [-y, x]));
export const reflect = (cells) => normalize(cells.map(([x, y]) => [-x, y]));

export function rotations(cells) {
  const found = new Map();
  let current = normalize(cells);
  for (let turn = 0; turn < 4; turn += 1) {
    found.set(shapeKey(current), current);
    current = rotate(current);
  }
  return [...found.values()];
}

export function rotationKey(cells) {
  return rotations(cells).map(shapeKey).sort()[0];
}

export function freeShapeKey(cells) {
  return [rotationKey(cells), rotationKey(reflect(cells))].sort()[0];
}

export function transform(cells, turns = 0, flipped = false) {
  let result = flipped ? reflect(cells) : normalize(cells);
  for (let index = 0; index < turns; index += 1) result = rotate(result);
  return normalize(result);
}

export const PIECES = Object.freeze({
  i2: [[0, 0], [1, 0]],
  i3: [[0, 0], [1, 0], [2, 0]],
  l3: [[0, 0], [0, 1], [1, 1]],
  i4: [[0, 0], [1, 0], [2, 0], [3, 0]],
  o4: [[0, 0], [1, 0], [0, 1], [1, 1]],
  t4: [[0, 0], [1, 0], [2, 0], [1, 1]],
  l4: [[0, 0], [0, 1], [0, 2], [1, 2]],
  s4: [[1, 0], [2, 0], [0, 1], [1, 1]],
  p5: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]],
  n5: [[0, 0], [0, 1], [1, 1], [1, 2], [1, 3]],
  f5: [[1, 0], [0, 1], [1, 1], [1, 2], [2, 2]],
  u5: [[0, 0], [2, 0], [0, 1], [1, 1], [2, 1]],
  y5: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 1]],
  i5: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
  l5: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]],
  t5: [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]],
  v5: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]],
  w5: [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2]],
  x5: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]],
  z5: [[0, 0], [1, 0], [2, 0], [2, 1], [3, 1]]
});

const choice = (role, piece, turns, flipped = false) => ({
  role,
  cells: transform(PIECES[piece], turns, flipped)
});

const level1Specs = [
  ["i2", 0, [["l3", 0], ["i2", 1], ["i3", 1]]],
  ["i3", 1, [["i2", 0], ["l3", 2], ["i3", 0]]],
  ["l3", 0, [["i3", 1], ["l3", 2], ["i2", 1]]],
  ["i2", 1, [["i3", 0], ["l3", 1], ["i2", 0]]],
  ["l3", 3, [["l3", 1], ["i3", 0], ["i2", 0]]],
  ["i3", 0, [["l3", 0], ["i2", 1], ["i3", 1]]],
  ["l3", 1, [["i2", 0], ["i3", 1], ["l3", 3]]],
  ["i2", 0, [["i3", 1], ["i2", 1], ["l3", 2]]],
  ["i3", 1, [["l3", 3], ["i3", 0], ["i2", 0]]],
  ["l3", 2, [["i2", 1], ["l3", 0], ["i3", 0]]]
];

const level1Problems = level1Specs.map(([piece, turns, options], index) => ({
  id: `polyomino-l1-${String(index + 1).padStart(2, "0")}`,
  kind: "rotation-match",
  target: transform(PIECES[piece], turns),
  choices: options.map(([candidate, candidateTurns]) => choice(
    freeShapeKey(PIECES[candidate]) === freeShapeKey(PIECES[piece]) ? "correct" : "different",
    candidate,
    candidateTurns
  ))
}));

const level2Specs = [
  ["l4", 0, 2, "t4", 1], ["s4", 1, 3, "o4", 0],
  ["p5", 0, 1, "u5", 2], ["n5", 1, 3, "y5", 0],
  ["f5", 0, 2, "t4", 3], ["l4", 2, 1, "i4", 1],
  ["s4", 0, 2, "t4", 0], ["p5", 3, 0, "y5", 2],
  ["n5", 2, 0, "u5", 1], ["f5", 1, 3, "l4", 0]
];

const level2Problems = level2Specs.map(([piece, targetTurns, answerTurns, decoy, decoyTurns], index) => {
  const target = transform(PIECES[piece], targetTurns);
  const entries = [
    choice("correct", piece, answerTurns),
    choice("mirror", piece, (answerTurns + 1) % 4, true),
    choice("different", decoy, decoyTurns)
  ];
  const order = index % 3 === 0 ? [1, 0, 2] : index % 3 === 1 ? [2, 1, 0] : [0, 2, 1];
  return {
    id: `polyomino-l2-${String(index + 1).padStart(2, "0")}`,
    kind: "turn-not-flip",
    target,
    choices: order.map((choiceIndex) => entries[choiceIndex])
  };
});

const cellId = ([x, y]) => `${x},${y}`;

function connected(cells) {
  if (!cells.length) return false;
  const wanted = new Set(cells.map(cellId));
  const seen = new Set([cellId(cells[0])]);
  const queue = [cells[0]];
  while (queue.length) {
    const [x, y] = queue.shift();
    [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].forEach((next) => {
      const id = cellId(next);
      if (!wanted.has(id) || seen.has(id)) return;
      seen.add(id);
      queue.push(next);
    });
  }
  return seen.size === cells.length;
}

function normalizeAbsolute(cells) {
  const minX = Math.min(...cells.map(([x]) => x));
  const minY = Math.min(...cells.map(([, y]) => y));
  return sortCells(cells.map(([x, y]) => [x - minX, y - minY]));
}

function orientationList(cells, allowFlip = true) {
  const found = new Map();
  [false, ...(allowFlip ? [true] : [])].forEach((flipped) => {
    for (let turns = 0; turns < 4; turns += 1) {
      const oriented = transform(cells, turns, flipped);
      found.set(shapeKey(oriented), oriented);
    }
  });
  return [...found.values()];
}

function bounds(cells) {
  return {
    width: Math.max(...cells.map(([x]) => x)) - Math.min(...cells.map(([x]) => x)) + 1,
    height: Math.max(...cells.map(([, y]) => y)) - Math.min(...cells.map(([, y]) => y)) + 1
  };
}

function buildConnectedBoard(specs) {
  const placements = [];
  let occupied = [];
  specs.forEach((spec, pieceIndex) => {
    const oriented = transform(PIECES[spec.piece], spec.turns || 0, Boolean(spec.flipped));
    if (!occupied.length) {
      const cells = oriented.map(([x, y]) => [x, y]);
      placements.push({ pieceIndex, cells });
      occupied = cells;
      return;
    }
    const occupiedSet = new Set(occupied.map(cellId));
    const candidates = [];
    for (let dy = -6; dy <= 6; dy += 1) {
      for (let dx = -6; dx <= 6; dx += 1) {
        const cells = oriented.map(([x, y]) => [x + dx, y + dy]);
        if (cells.some((cell) => occupiedSet.has(cellId(cell)))) continue;
        const touches = cells.some(([x, y]) => [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].some((cell) => occupiedSet.has(cellId(cell))));
        if (!touches) continue;
        const union = [...occupied, ...cells];
        const size = bounds(union);
        const longestSide = Math.max(size.width, size.height);
        candidates.push({
          cells,
          score: longestSide * 200 + size.width * size.height * 10 + (size.width + size.height) * 4 + Math.abs(dx) + Math.abs(dy)
        });
      }
    }
    candidates.sort((a, b) => a.score - b.score || a.cells.map(cellId).sort().join(" ").localeCompare(b.cells.map(cellId).sort().join(" ")));
    if (!candidates.length) throw new Error(`Cannot join cover piece ${pieceIndex}.`);
    placements.push({ pieceIndex, cells: candidates[0].cells });
    occupied.push(...candidates[0].cells);
  });
  const minX = Math.min(...occupied.map(([x]) => x));
  const minY = Math.min(...occupied.map(([, y]) => y));
  const shift = (cells) => sortCells(cells.map(([x, y]) => [x - minX, y - minY]));
  return {
    board: shift(occupied),
    sampleSolution: placements.map((placement) => ({ ...placement, cells: shift(placement.cells) }))
  };
}

function coverProblem(level, index, specs, family) {
  const built = buildConnectedBoard(specs);
  const sourceRef = {
    3: "RAY Kids A4-2 p.14-17, p.23-25",
    4: "RAY Kids A4-2 p.36-40",
    5: "RAY Kids A4-2 p.41-50"
  }[level];
  return {
    id: `polyomino-l${level}-${String(index + 1).padStart(2, "0")}`,
    kind: "exact-cover",
    family,
    sourceRef,
    allowFlip: true,
    board: built.board,
    pieces: specs.map((spec, pieceIndex) => ({ id: `${spec.piece}-${pieceIndex}`, piece: spec.piece, cells: PIECES[spec.piece] })),
    sampleSolution: built.sampleSolution
  };
}

const specs = (names, seed = 0) => names.map((piece, index) => ({
  piece,
  turns: (seed + index * 3) % 4,
  flipped: index > 0 && (seed + index) % 3 === 0
}));

const level3Sets = [
  ["i2", "i2"], ["l3", "l3"], ["i3", "i3"], ["l3", "l3", "l3"], ["i2", "i2", "i2", "i2"],
  ["o4", "o4"], ["t4", "t4"], ["s4", "s4"], ["l4", "l4"], ["p5", "p5"]
];
const level4Sets = ["p5", "n5", "f5", "u5", "y5", "t5", "v5", "w5", "z5", "l5"]
  .map((piece) => [piece, piece]);
const level5Sets = [
  ["p5", "u5"], ["t5", "l5"], ["v5", "z5"], ["w5", "y5"], ["f5", "i5"],
  ["p5", "n5", "t5"], ["u5", "v5", "l5"], ["w5", "z5", "y5"], ["f5", "p5", "t5"], ["i5", "l5", "u5"]
];

const level3Problems = level3Sets.map((names, index) => coverProblem(3, index, specs(names, index), "same-basic"));
const level4Problems = level4Sets.map((names, index) => coverProblem(4, index, specs(names, index + 2), "same-pentomino"));
const level5Problems = level5Sets.map((names, index) => coverProblem(5, index, specs(names, index + 1), "mixed-pentomino"));

export function placementOptions(problem, pieceIndex) {
  const board = normalizeAbsolute(problem.board);
  const boardSet = new Set(board.map(cellId));
  const piece = problem.pieces[pieceIndex];
  const result = [];
  const seen = new Set();
  orientationList(piece.cells, problem.allowFlip).forEach((oriented) => {
    const size = bounds(oriented);
    const boardSize = bounds(board);
    for (let y = 0; y <= boardSize.height - size.height; y += 1) {
      for (let x = 0; x <= boardSize.width - size.width; x += 1) {
        const cells = oriented.map(([cx, cy]) => [cx + x, cy + y]);
        if (!cells.every((cell) => boardSet.has(cellId(cell)))) continue;
        const key = cells.map(cellId).sort().join(" ");
        if (seen.has(key)) continue;
        seen.add(key);
        result.push({ pieceIndex, cells: sortCells(cells) });
      }
    }
  });
  return result;
}

export function findCoverSolutions(problem, limit = 2, fixed = []) {
  if (problem.kind !== "exact-cover") return [];
  const boardSet = new Set(problem.board.map(cellId));
  const occupied = new Set();
  const used = new Set();
  const fixedPlacements = [];
  for (const placement of fixed) {
    if (used.has(placement.pieceIndex)) return [];
    if (!placement.cells.every((cell) => boardSet.has(cellId(cell)) && !occupied.has(cellId(cell)))) return [];
    used.add(placement.pieceIndex);
    placement.cells.forEach((cell) => occupied.add(cellId(cell)));
    fixedPlacements.push({ pieceIndex: placement.pieceIndex, cells: sortCells(placement.cells) });
  }
  const options = problem.pieces.map((_, pieceIndex) => placementOptions(problem, pieceIndex));
  const solutions = [];
  const chosen = [...fixedPlacements];

  function visit() {
    if (solutions.length >= limit) return;
    if (occupied.size === boardSet.size) {
      if (used.size === problem.pieces.length) solutions.push(chosen.map((placement) => ({ pieceIndex: placement.pieceIndex, cells: placement.cells.map((cell) => [...cell]) })));
      return;
    }
    const uncovered = [...boardSet].filter((id) => !occupied.has(id));
    let target = uncovered[0];
    let candidates = [];
    for (const cell of uncovered) {
      const next = [];
      options.forEach((pieceOptions, pieceIndex) => {
        if (used.has(pieceIndex)) return;
        pieceOptions.forEach((placement) => {
          if (placement.cells.some((candidate) => occupied.has(cellId(candidate)))) return;
          if (placement.cells.some((candidate) => cellId(candidate) === cell)) next.push(placement);
        });
      });
      if (!candidates.length || next.length < candidates.length) {
        target = cell;
        candidates = next;
      }
    }
    if (!candidates.length) return;
    candidates.sort((a, b) => a.pieceIndex - b.pieceIndex || a.cells.map(cellId).join(" ").localeCompare(b.cells.map(cellId).join(" ")));
    for (const placement of candidates) {
      if (solutions.length >= limit) break;
      if (!placement.cells.some((cell) => cellId(cell) === target)) continue;
      used.add(placement.pieceIndex);
      placement.cells.forEach((cell) => occupied.add(cellId(cell)));
      chosen.push(placement);
      visit();
      chosen.pop();
      placement.cells.forEach((cell) => occupied.delete(cellId(cell)));
      used.delete(placement.pieceIndex);
    }
  }

  visit();
  return solutions;
}

export const levels = [
  { id: 1, titleKey: "level1Title", descriptionKey: "level1Desc", ready: true, problems: level1Problems },
  { id: 2, titleKey: "level2Title", descriptionKey: "level2Desc", ready: true, problems: level2Problems },
  { id: 3, titleKey: "level3Title", descriptionKey: "level3Desc", ready: true, problems: level3Problems },
  { id: 4, titleKey: "level4Title", descriptionKey: "level4Desc", ready: true, problems: level4Problems },
  { id: 5, titleKey: "level5Title", descriptionKey: "level5Desc", ready: true, problems: level5Problems }
];

export const readyLevels = levels.filter((level) => level.ready);

export function acceptsChoice(problem, candidate) {
  if (problem.kind === "rotation-match") return freeShapeKey(candidate) === freeShapeKey(problem.target);
  if (problem.kind === "turn-not-flip") return rotationKey(candidate) === rotationKey(problem.target);
  return false;
}

export function validateLevels() {
  const ids = new Set();
  for (const level of readyLevels) {
    if (level.problems.length !== 10) throw new Error(`Polyomino level ${level.id} needs 10 problems.`);
    for (const problem of level.problems) {
      if (ids.has(problem.id)) throw new Error(`Duplicate problem id: ${problem.id}`);
      ids.add(problem.id);
      if (problem.kind === "exact-cover") {
        if (!connected(problem.board)) throw new Error(`${problem.id} board is disconnected.`);
        if (!problem.sourceRef) throw new Error(`${problem.id} needs a source locator.`);
        if (new Set(problem.board.map(cellId)).size !== problem.board.length) throw new Error(`${problem.id} repeats a board cell.`);
        const area = problem.pieces.reduce((sum, piece) => sum + piece.cells.length, 0);
        if (area !== problem.board.length) throw new Error(`${problem.id} piece area does not match its board.`);
        if (!findCoverSolutions(problem, 1).length) throw new Error(`${problem.id} has no exact cover.`);
        const keys = new Set(problem.pieces.map((piece) => freeShapeKey(piece.cells)));
        if (problem.family.startsWith("same") && keys.size !== 1) throw new Error(`${problem.id} must use copies of one piece.`);
        if (problem.family === "mixed-pentomino" && keys.size < 2) throw new Error(`${problem.id} needs different pieces.`);
        continue;
      }
      if (problem.choices.length !== 3) throw new Error(`${problem.id} needs three choices.`);
      const accepted = problem.choices.filter((candidate) => acceptsChoice(problem, candidate.cells));
      if (accepted.length !== 1) throw new Error(`${problem.id} needs exactly one accepted choice.`);
      if (accepted[0].role !== "correct") throw new Error(`${problem.id} has a mislabeled answer.`);
      if (new Set(problem.choices.map((candidate) => shapeKey(candidate.cells))).size !== 3) {
        throw new Error(`${problem.id} repeats a displayed orientation.`);
      }
      if (problem.kind === "turn-not-flip") {
        const mirror = problem.choices.find((candidate) => candidate.role === "mirror");
        if (!mirror) throw new Error(`${problem.id} needs a mirror decoy.`);
        if (freeShapeKey(mirror.cells) !== freeShapeKey(problem.target)) throw new Error(`${problem.id} mirror is not the same free piece.`);
        if (rotationKey(mirror.cells) === rotationKey(problem.target)) throw new Error(`${problem.id} mirror can be reached by turning.`);
      }
    }
  }
  return true;
}

validateLevels();
