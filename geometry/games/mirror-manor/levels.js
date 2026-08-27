/* =========================================================================
   거울 저택 (Mirror Manor) — problem data and reflection maths.

   WHY this file exists in this shape:

   - The project keeps every game self-contained (no cross-game imports), so the
     reflection formulas that paper-fold uses are re-implemented here rather than
     imported. They are the same maths, expressed for a cell grid instead of the
     0..1 paper square, because Mirror Manor works on whole cells and whole
     objects, never on folded paper.
   - The manor is NOT a paper game. There is no crease, no fold, no unfolding.
     A room has a mirror line; blocks, tiles and furniture stand on one side and
     the child completes what the mirror would show on the other side.
   - Level 3 is the equal-distance choice activity from the future-game design.
     It uses explicit square and triangular dot grids. Level 4 is the source-backed
     letter/symbol choice activity; level 5 remains locked until its double-mirror
     pool is verified.

   Every user-facing string lives in i18n.js. This file only carries keys.
   ========================================================================= */

export const GAME_ID = "mirror-manor";

// Progress record name inside the shared `gfield-profile` object. This game
// never writes to another game's record.
export const PROGRESS_KEY = "mirrorManor";

// Axis kinds the engine can draw and reflect across today. Level 3 will add
// triangular grids and level 5 a second simultaneous axis; both extend this list
// rather than replacing it, which is why the validator reads it instead of
// hard-coding "vertical"/"horizontal".
export const SUPPORTED_AXIS_KINDS = ["vertical", "horizontal", "diagonal"];

const GRID = { cols: 8, rows: 6 };

/* ---------------------------------------------------------------- reflection */

/**
 * Reflect one grid cell across the mirror.
 *
 * `axis.at` is a LINE index, not a cell index: `{kind:"vertical", at:4}` means the
 * mirror runs between column 3 and column 4. A cell at column x therefore lands on
 * column (2*at - 1 - x), which keeps the perpendicular distance equal on both
 * sides — the property `mirrorDistance` below measures and the validator asserts.
 */
export function reflectCell(cell, axis) {
  const [x, y] = cell;
  if (axis.kind === "vertical") return [2 * axis.at - 1 - x, y];
  if (axis.kind === "horizontal") return [x, 2 * axis.at - 1 - y];
  throw new Error(`Mirror Manor cannot reflect across "${axis.kind}".`);
}

/**
 * Distance from a cell to the mirror line, counted in cells (never zero).
 * The two cells that touch the mirror both return 1, so "same distance" reads the
 * way a child counts squares outward from the glass.
 */
export function mirrorDistance(cell, axis) {
  const across = axis.kind === "vertical" ? cell[0] : cell[1];
  return across < axis.at ? axis.at - across : across - axis.at + 1;
}

/** The coordinate that a reflection leaves untouched (row for a vertical mirror). */
export function parallelCoord(cell, axis) {
  return axis.kind === "vertical" ? cell[1] : cell[0];
}

/** True when the cell sits on the given (already drawn) side of the mirror. */
export function isGivenSide(cell, axis) {
  return (axis.kind === "vertical" ? cell[0] : cell[1]) < axis.at;
}

export function inGrid(cell, grid) {
  return cell[0] >= 0 && cell[1] >= 0 && cell[0] < grid.cols && cell[1] < grid.rows;
}

const sortCells = (cells) => [...cells].sort((a, b) => a[1] - b[1] || a[0] - b[0]);
const cellId = (cell) => cell.join(",");

/** Move a cell list so its bounding box starts at (0,0); this is a piece "shape". */
export function normalizeShape(cells) {
  const minX = Math.min(...cells.map((cell) => cell[0]));
  const minY = Math.min(...cells.map((cell) => cell[1]));
  return sortCells(cells.map(([x, y]) => [x - minX, y - minY]));
}

export function shapeKey(cells) {
  return normalizeShape(cells).map((cell) => cell.join(",")).join(" ");
}

const rotateQuarter = (cells) => cells.map(([x, y]) => [-y, x]);
const flipAcross = (cells) => cells.map(([x, y]) => [-x, y]);

/**
 * The eight rotations/reflections of a shape, de-duplicated.
 * Used for two things: choosing a decoy tray piece that is the same object turned
 * the wrong way, and telling "방향만 틀림" apart from a plain miss.
 */
export function shapeVariants(cells) {
  const found = new Map();
  let current = normalizeShape(cells);
  for (let turn = 0; turn < 4; turn += 1) {
    [current, flipAcross(current)].forEach((variant) => {
      const normalized = normalizeShape(variant);
      const key = shapeKey(normalized);
      if (!found.has(key)) found.set(key, normalized);
    });
    current = rotateQuarter(current);
  }
  return [...found.values()];
}

/**
 * Orientation of a piece after reflection. paper-fold expresses this as a
 * rotation/flip pair because its pieces are drawn sprites; here a piece IS its cell
 * set, so the mirrored orientation is simply the reflected cell set re-normalized.
 */
export function reflectedOrientation(cells, axis) {
  return normalizeShape(cells.map((cell) => reflectCell(cell, axis)));
}

/* --------------------------------------------------------- canonical problem id */

/**
 * Two problems that differ only by rotation or reflection are the SAME problem for
 * a learner. To dedupe the pool we redraw every problem in one canonical frame:
 *
 *   1. describe each given cell as (distance-from-mirror, coordinate-along-mirror),
 *      which erases whether the mirror was vertical or horizontal and which side
 *      the givens were drawn on;
 *   2. slide the along-mirror coordinates so the smallest is 0;
 *   3. take the smaller of that picture and the same picture with the along-mirror
 *      axis reversed, which is the one remaining symmetry of a mirror scene.
 *
 * For drag problems the piece decomposition also matters (the same silhouette split
 * into two dominoes is a different task from one L-piece), so the sorted piece
 * shapes join the key.
 */
export function canonicalKey(problem) {
  const describe = (cells) => {
    const points = cells.map((cell) => [mirrorDistance(cell, problem.axis), parallelCoord(cell, problem.axis)]);
    const minAlong = Math.min(...points.map((point) => point[1]));
    const maxAlong = Math.max(...points.map((point) => point[1]));
    const forward = sortCells(points.map(([d, a]) => [d, a - minAlong]));
    const backward = sortCells(points.map(([d, a]) => [d, maxAlong - a]));
    const render = (list) => list.map((point) => point.join(",")).join(" ");
    return [render(forward), render(backward)].sort()[0];
  };
  if (problem.interaction === "distance-match") {
    return `${problem.interaction}#${problem.grid.lattice}#${problem.sourceCell.join(",")}#${problem.targetCell.join(",")}#${problem.choices.map(cellId).sort().join("|")}`;
  }
  if (problem.interaction === "symbol-reflection") {
    const choices = problem.choices.map((choice) => `${choice.kind}:${choice.text}`).sort().join("|");
    return `${problem.interaction}#${problem.sourceKind}#${problem.sourceText}#${choices}`;
  }
  const cells = problem.interaction === "paint-reflection"
    ? problem.sourceCells
    : problem.givens.flatMap((given) => given.cells);
  const pieces = problem.interaction === "paint-reflection"
    ? ""
    : problem.givens.map((given) => shapeKey(given.cells)).sort().join("|");
  return `${problem.interaction}#${describe(cells)}#${pieces}`;
}

/* ------------------------------------------------------------- level 1 authoring */

/**
 * Level 1 pictures are authored as the GIVEN half only, drawn with "#".
 * For a vertical mirror the block is `rows` tall and `axis.at` wide; for a
 * horizontal mirror it is `axis.at` tall and `cols` wide. Authoring only the half
 * that the child can see makes it impossible to accidentally hand-write an answer
 * that is not a true reflection — the answer is always computed, never typed.
 */
function paintProblem(index, spec) {
  const axis = spec.axis;
  const sourceCells = [];
  // The picture block always starts at the board's top-left corner, so a "#" at
  // line `row`, character `column` is simply cell (column, row). A vertical mirror
  // keeps the block narrow, a horizontal mirror keeps it short; either way every
  // authored cell lands on the given side, which validateLevels re-checks.
  spec.picture.forEach((line, row) => {
    [...line].forEach((mark, column) => {
      if (mark === "#") sourceCells.push([column, row]);
    });
  });
  const targetCells = sourceCells.map((cell) => reflectCell(cell, axis));
  return {
    id: `mirror-manor-l1-${String(index + 1).padStart(2, "0")}`,
    game: GAME_ID,
    level: 1,
    interaction: "paint-reflection",
    grid: { ...GRID },
    axis,
    sourceCells,
    targetCells,
    validation: { solutionCount: 1, allowRotationEquivalent: false, allowReflectionEquivalent: false }
  };
}

const level1Specs = [
  // Vertical mirror: the given half is 4 columns wide and 6 rows tall.
  // Two pictures deliberately leave one line of the board empty. A tap on an empty
  // line can only be a "방향만 틀림" mistake (right count, reflected onto the wrong
  // line), so both named mistakes are reachable in level 1, not just the distance one.
  { axis: { kind: "vertical", at: 4 }, picture: ["##..", "###.", ".###", "...#", ".###", "###."] },
  { axis: { kind: "vertical", at: 4 }, picture: [".##.", "####", "####", ".###", "..##", "...#"] },
  { axis: { kind: "vertical", at: 4 }, picture: ["...#", "..##", ".###", "####", "...#", "...#"] },
  { axis: { kind: "vertical", at: 4 }, picture: ["####", ".###", ".###", "..##", "...#", ".###"] },
  { axis: { kind: "vertical", at: 4 }, picture: ["#.#.", "#.##", "####", "#..#", "#..#", "####"] },
  { axis: { kind: "vertical", at: 4 }, picture: ["..##", ".##.", ".##.", "..##", "....", "..##"] },
  { axis: { kind: "vertical", at: 4 }, picture: [".#..", "###.", "####", "###.", ".#..", "...."] },
  // Horizontal mirror: the given half is 8 columns wide and 3 rows tall.
  { axis: { kind: "horizontal", at: 3 }, picture: [".######.", ".#....#.", ".######."] },
  { axis: { kind: "horizontal", at: 3 }, picture: ["..####..", ".#....#.", "#......#"] },
  { axis: { kind: "horizontal", at: 3 }, picture: ["...##...", "..####..", ".######."] }
];

/* ------------------------------------------------------------- level 2 authoring */

/**
 * Manor furniture, described only by the cells it covers. `nameKey` points at
 * i18n.js so the tray and the screen-reader labels stay translated.
 * The S/Z and J/L pairs are chiral: their mirror image cannot be reached by turning
 * them, which is exactly the confusion level 2 is meant to expose.
 */
export const OBJECT_TYPES = {
  pot: { nameKey: "objPot", shape: [[0, 0]] },
  frame: { nameKey: "objFrame", shape: [[0, 0], [1, 0]] },
  candle: { nameKey: "objCandle", shape: [[0, 0], [0, 1]] },
  chairNE: { nameKey: "objChair", shape: [[0, 0], [0, 1], [1, 1]] },
  chairNW: { nameKey: "objChair", shape: [[1, 0], [0, 1], [1, 1]] },
  chairSE: { nameKey: "objChair", shape: [[0, 0], [1, 0], [0, 1]] },
  chairSW: { nameKey: "objChair", shape: [[0, 0], [1, 0], [1, 1]] },
  stairsS: { nameKey: "objStairs", shape: [[1, 0], [2, 0], [0, 1], [1, 1]] },
  stairsZ: { nameKey: "objStairs", shape: [[0, 0], [1, 0], [1, 1], [2, 1]] },
  sofaJ: { nameKey: "objSofa", shape: [[0, 0], [0, 1], [1, 1], [2, 1]] },
  sofaL: { nameKey: "objSofa", shape: [[2, 0], [0, 1], [1, 1], [2, 1]] }
};

function placeObject(type, at) {
  const definition = OBJECT_TYPES[type];
  if (!definition) throw new Error(`Mirror Manor has no object type "${type}".`);
  return {
    type,
    nameKey: definition.nameKey,
    cells: definition.shape.map(([dx, dy]) => [at[0] + dx, at[1] + dy])
  };
}

/**
 * Pick one tray piece that is the right object turned the wrong way.
 *
 * The child never rotates or flips anything — that would be a second kind of answer
 * action on one screen, which the house rules forbid. Instead the tray holds the
 * correctly mirrored pieces plus one turned twin, so choosing WHICH piece to drag is
 * itself the orientation decision, and a wrong choice is reportable as 방향만 틀림.
 */
function pickDecoy(targets) {
  const taken = new Set(targets.map((target) => shapeKey(target.cells)));
  for (const target of targets) {
    for (const variant of shapeVariants(target.cells)) {
      const key = shapeKey(variant);
      if (!taken.has(key)) return { type: target.type, nameKey: target.nameKey, shape: variant };
    }
  }
  return null;
}

function dragProblem(index, spec) {
  const axis = spec.axis;
  const givens = spec.givens.map(([type, at]) => placeObject(type, at));
  const targets = givens.map((given) => ({
    type: given.type,
    nameKey: given.nameKey,
    cells: sortCells(given.cells.map((cell) => reflectCell(cell, axis)))
  }));
  const decoy = pickDecoy(targets);
  if (!decoy) throw new Error(`Mirror Manor problem ${index + 1} of level 2 has no turned-twin decoy.`);
  const tray = [
    ...targets.map((target, slot) => ({
      id: `piece-${slot}`,
      type: target.type,
      nameKey: target.nameKey,
      shape: normalizeShape(target.cells)
    })),
    { id: "piece-decoy", type: decoy.type, nameKey: decoy.nameKey, shape: decoy.shape }
  ];
  return {
    id: `mirror-manor-l2-${String(index + 1).padStart(2, "0")}`,
    game: GAME_ID,
    level: 2,
    interaction: "drag-reflection",
    grid: { ...GRID },
    axis,
    givens,
    targets,
    tray,
    validation: { solutionCount: 1, allowRotationEquivalent: false, allowReflectionEquivalent: false }
  };
}

const level2Specs = [
  { axis: { kind: "vertical", at: 4 }, givens: [["frame", [1, 1]], ["pot", [0, 0]], ["chairNE", [0, 3]]] },
  { axis: { kind: "vertical", at: 4 }, givens: [["chairNE", [1, 1]], ["pot", [3, 4]]] },
  { axis: { kind: "vertical", at: 4 }, givens: [["stairsS", [1, 1]], ["pot", [0, 4]]] },
  { axis: { kind: "vertical", at: 4 }, givens: [["sofaJ", [0, 2]], ["frame", [2, 0]]] },
  { axis: { kind: "vertical", at: 4 }, givens: [["chairSE", [2, 1]], ["candle", [0, 3]], ["pot", [0, 0]]] },
  { axis: { kind: "vertical", at: 4 }, givens: [["stairsZ", [0, 0]], ["chairNW", [2, 3]]] },
  { axis: { kind: "vertical", at: 4 }, givens: [["sofaL", [1, 1]], ["pot", [0, 4]], ["pot", [3, 5]]] },
  { axis: { kind: "vertical", at: 4 }, givens: [["frame", [0, 0]], ["frame", [2, 2]], ["chairNE", [1, 4]]] },
  { axis: { kind: "vertical", at: 4 }, givens: [["candle", [3, 0]], ["chairSW", [0, 2]], ["pot", [2, 5]]] },
  { axis: { kind: "vertical", at: 4 }, givens: [["stairsS", [0, 3]], ["frame", [2, 0]], ["candle", [0, 0]]] }
];

/* ------------------------------------------------------------- level 3 authoring */

/**
 * Level 3 is deliberately a choice task, not a second drawing gesture. The child
 * sees one marker on the near side and taps one of three dots on the far side.
 * The correct dot is calculated by the same reflection formula as levels 1 and 2;
 * the two distractors are authored by role: one keeps the parallel line but changes
 * distance, and one keeps distance but changes the parallel line.
 */
function distanceProblem(index, lattice, source, distanceDecoy, directionDecoy) {
  const axis = { kind: "vertical", at: 4 };
  const grid = { cols: 8, rows: 6, lattice };
  const targetCell = reflectCell(source, axis);
  return {
    id: `mirror-manor-l3-${String(index + 1).padStart(2, "0")}`,
    game: GAME_ID,
    level: 3,
    interaction: "distance-match",
    grid,
    axis,
    sourceCell: source,
    targetCell,
    choices: [targetCell, distanceDecoy, directionDecoy],
    validation: { solutionCount: 1, allowRotationEquivalent: false, allowReflectionEquivalent: false }
  };
}

const level3Specs = [
  distanceProblem(0, "square", [3, 0], [5, 0], [4, 1]),
  distanceProblem(1, "square", [2, 1], [6, 1], [5, 0]),
  distanceProblem(2, "square", [1, 3], [5, 3], [6, 1]),
  distanceProblem(3, "square", [3, 5], [5, 5], [4, 4]),
  distanceProblem(4, "square", [0, 2], [6, 2], [7, 0]),
  distanceProblem(5, "triangle", [3, 0], [5, 0], [4, 1]),
  distanceProblem(6, "triangle", [2, 1], [6, 1], [5, 0]),
  distanceProblem(7, "triangle", [1, 3], [5, 3], [6, 1]),
  distanceProblem(8, "triangle", [3, 5], [5, 5], [4, 4]),
  distanceProblem(9, "triangle", [0, 2], [6, 2], [7, 0])
];

/* ------------------------------------------------------------- level 4 authoring */

/**
 * RAY C1-1 p.19-23 asks children to write the letter or word seen in a mirror.
 * The browser version uses three visual choices so a phone never needs freehand
 * glyph drawing. `mirror` is the only answer role; `normal` and `decoy` are both
 * deliberately wrong visual readings. Arrow items are a small internal extension
 * of the same left/right reflection rule, not copies of a source worksheet item.
 */
function symbolProblem(index, sourceKind, sourceText, decoyText, axisKind = "vertical") {
  const choices = [
    { id: "normal", kind: "normal", text: sourceText },
    { id: "mirror", kind: "mirror", text: sourceText },
    { id: "decoy", kind: "decoy", text: decoyText }
  ];
  const shift = index % choices.length;
  return {
    id: `mirror-manor-l4-${String(index + 1).padStart(2, "0")}`,
    game: GAME_ID,
    level: 4,
    interaction: "symbol-reflection",
    grid: { ...GRID },
    axis: { kind: axisKind, at: axisKind === "horizontal" ? 3 : 4 },
    sourceKind,
    sourceText,
    choices: choices.slice(shift).concat(choices.slice(0, shift)),
    validation: { solutionCount: 1, allowRotationEquivalent: false, allowReflectionEquivalent: false }
  };
}

const level4Specs = [
  symbolProblem(0, "letter", "ㄱ", "ㄴ"),
  symbolProblem(1, "letter", "ㅏ", "ㅗ"),
  symbolProblem(2, "letter", "아", "오"),
  symbolProblem(3, "letter", "움", "몸"),
  symbolProblem(4, "word", "어머", "어모"),
  symbolProblem(5, "word", "마롱", "마봉"),
  symbolProblem(6, "word", "야옹이", "야용이"),
  symbolProblem(7, "latin", "A", "F"),
  symbolProblem(8, "arrow", "↑", "→", "horizontal"),
  symbolProblem(9, "arrow", "→", "↗", "diagonal")
];

/* ------------------------------------------------------------------- level table */

export const levelMeta = [
  { id: 1, interaction: "paint-reflection", titleKey: "level1Title", descKey: "level1Desc", color: "#3f9bb0", ready: true },
  { id: 2, interaction: "drag-reflection", titleKey: "level2Title", descKey: "level2Desc", color: "#c9793f", ready: true },
  { id: 3, interaction: "distance-match", titleKey: "level3Title", descKey: "level3Desc", color: "#6f8ed6", ready: true },
  { id: 4, interaction: "symbol-reflection", titleKey: "level4Title", descKey: "level4Desc", color: "#8f76c4", ready: true },
  { id: 5, interaction: "double-mirror", titleKey: "level5Title", descKey: "level5Desc", color: "#d4a636", ready: false }
];

const pools = {
  1: level1Specs.map((spec, index) => paintProblem(index, spec)),
  2: level2Specs.map((spec, index) => dragProblem(index, spec)),
  3: level3Specs,
  4: level4Specs
};

export const levels = levelMeta.map((meta) => ({ ...meta, problems: pools[meta.id] || [] }));

export const readyLevels = levels.filter((level) => level.ready);

/* ------------------------------------------------------------------- answer help */

/**
 * Classify a tapped cell (level 1) without revealing where the answer is.
 *
 * The two named mistakes come straight from the design document:
 *   "distance"  — 거리가 틀림: the child kept the mirror row but missed by one
 *                 square, the only distance distractor promised by the design.
 *   "direction" — 방향만 틀림: the count was right but the reflection was slid to
 *                 another row/column, so the mirrored direction is wrong.
 * Anything else is a plain miss and gets a neutral nudge, never a hint.
 */
export function classifyCell(cell, problem) {
  const { axis, sourceCells, targetCells } = problem;
  const same = (a, b) => a[0] === b[0] && a[1] === b[1];
  if (targetCells.some((target) => same(target, cell))) return "correct";
  const distance = mirrorDistance(cell, axis);
  const along = parallelCoord(cell, axis);
  if (sourceCells.some((source) =>
    parallelCoord(source, axis) === along
    && Math.abs(mirrorDistance(source, axis) - distance) === 1)) return "distance";
  if (sourceCells.some((source) => mirrorDistance(source, axis) === distance)) return "direction";
  return "miss";
}

/**
 * Classify a dropped object (level 2) against the targets still missing.
 *
 * Order matters: a piece whose silhouette is a turned version of an expected object
 * and which sits the right number of squares from the glass is an orientation
 * mistake; a piece with exactly the right silhouette, on the right rows, but the
 * wrong number of squares out by one is a distance mistake. Larger misses stay
 * neutral so the feedback never overstates what the child almost solved.
 */
export function classifyPlacement(cells, problem, remainingTargets) {
  const axis = problem.axis;
  const key = shapeKey(cells);
  const asSet = (list) => new Set(list.map((cell) => cell.join(",")));
  const placedSet = asSet(cells);
  const pieceDistance = (list) => Math.min(...list.map((cell) => mirrorDistance(cell, axis)));
  const alongSet = (list) => [...new Set(list.map((cell) => parallelCoord(cell, axis)))].sort((a, b) => a - b).join(",");

  for (const target of remainingTargets) {
    const targetSet = asSet(target.cells);
    if (targetSet.size === placedSet.size && [...targetSet].every((entry) => placedSet.has(entry))) return "correct";
  }
  for (const target of remainingTargets) {
    if (pieceDistance(cells) !== pieceDistance(target.cells)) continue;
    const variants = shapeVariants(target.cells).map(shapeKey);
    if (key !== shapeKey(target.cells) && variants.includes(key)) return "direction";
  }
  for (const target of remainingTargets) {
    if (key !== shapeKey(target.cells)) continue;
    if (alongSet(cells) !== alongSet(target.cells)) continue;
    if (Math.abs(pieceDistance(cells) - pieceDistance(target.cells)) === 1) return "distance";
  }
  return "miss";
}

/* -------------------------------------------------------------------- validation */

function assert(condition, message) {
  if (!condition) throw new Error(`Mirror Manor: ${message}`);
}

/**
 * Throws on the first violation. Called at app start-up so a broken pool can never
 * reach a child, and called again by .selftest.mjs before the independent re-check.
 */
export function validateLevels() {
  assert(levels.length === 5, "must declare five levels.");
  assert(levels[0].interaction === "paint-reflection", "level 1 must be the paint activity.");
  assert(levels[1].interaction === "drag-reflection", "level 2 must be the drag activity.");

  const seenIds = new Set();

  levels.forEach((level, index) => {
    assert(level.id === index + 1, `level ${index + 1} is numbered ${level.id}.`);
    if (!level.ready) {
      assert(level.problems.length === 0, `level ${level.id} is not ready and must ship no problems.`);
      return;
    }
    assert(level.problems.length === 10, `level ${level.id} needs a pool of 10, found ${level.problems.length}.`);

    const canonical = new Map();
    level.problems.forEach((problem) => {
      assert(!seenIds.has(problem.id), `duplicate problem id ${problem.id}.`);
      seenIds.add(problem.id);
      assert(problem.level === level.id, `${problem.id} claims level ${problem.level}.`);
      assert(problem.interaction === level.interaction, `${problem.id} uses ${problem.interaction} on a ${level.interaction} level.`);
      assert(SUPPORTED_AXIS_KINDS.includes(problem.axis.kind), `${problem.id} uses unsupported axis "${problem.axis.kind}".`);
      assert(Number.isInteger(problem.axis.at) && problem.axis.at > 0, `${problem.id} has a non-integer mirror line.`);
      if (problem.interaction === "symbol-reflection" && problem.axis.kind === "diagonal") {
        assert(problem.axis.at === 4, `${problem.id} has an invalid diagonal mirror anchor.`);
      } else {
        const span = problem.axis.kind === "vertical" ? problem.grid.cols : problem.grid.rows;
        assert(problem.axis.at * 2 === span, `${problem.id} does not put the mirror at the middle of the board.`);
      }

      const key = canonicalKey(problem);
      assert(!canonical.has(key), `${problem.id} is a rotation/reflection of ${canonical.get(key)}.`);
      canonical.set(key, problem.id);

      if (problem.interaction === "paint-reflection") validatePaint(problem);
      else if (problem.interaction === "drag-reflection") validateDrag(problem);
      else if (problem.interaction === "distance-match") validateDistance(problem);
      else validateSymbol(problem);
    });
  });
  return true;
}

function validatePaint(problem) {
  const { axis, grid, sourceCells, targetCells } = problem;
  const cellId = (cell) => cell.join(",");
  const sourceIds = new Set(sourceCells.map(cellId));
  const targetIds = new Set(targetCells.map(cellId));

  assert(sourceCells.length > 0, `${problem.id} has an empty picture.`);
  assert(sourceIds.size === sourceCells.length, `${problem.id} repeats a given cell.`);
  assert(targetIds.size === targetCells.length, `${problem.id} repeats an answer cell.`);
  assert(sourceCells.length === targetCells.length, `${problem.id} answers and givens differ in count.`);

  sourceCells.forEach((cell) => {
    assert(inGrid(cell, grid), `${problem.id} draws outside the board.`);
    assert(isGivenSide(cell, axis), `${problem.id} draws a given past the mirror.`);
  });

  targetCells.forEach((cell, index) => {
    assert(inGrid(cell, grid), `${problem.id} answers outside the board.`);
    assert(!isGivenSide(cell, axis), `${problem.id} puts an answer on the given side.`);
    assert(!sourceIds.has(cellId(cell)), `${problem.id} overlaps an answer with the given half.`);
    const source = sourceCells[index];
    assert(mirrorDistance(cell, axis) === mirrorDistance(source, axis), `${problem.id} answer ${index} is a different distance from the mirror.`);
    assert(parallelCoord(cell, axis) === parallelCoord(source, axis), `${problem.id} answer ${index} slid along the mirror.`);
    assert(cellId(reflectCell(source, axis)) === cellId(cell), `${problem.id} answer ${index} is not the reflection of its given.`);
  });

  // Uniqueness: for each given cell, exhaust every cell on the answer side and count
  // how many satisfy "same distance, same line". Exactly one may.
  sourceCells.forEach((source) => {
    let matches = 0;
    for (let x = 0; x < grid.cols; x += 1) {
      for (let y = 0; y < grid.rows; y += 1) {
        const candidate = [x, y];
        if (isGivenSide(candidate, axis)) continue;
        if (mirrorDistance(candidate, axis) !== mirrorDistance(source, axis)) continue;
        if (parallelCoord(candidate, axis) !== parallelCoord(source, axis)) continue;
        matches += 1;
      }
    }
    assert(matches === 1, `${problem.id} has ${matches} answers for one given cell.`);
  });
}

function validateDrag(problem) {
  const { axis, grid, givens, targets, tray } = problem;
  const cellId = (cell) => cell.join(",");
  assert(givens.length >= 2, `${problem.id} needs at least two objects.`);
  assert(givens.length === targets.length, `${problem.id} has ${givens.length} objects but ${targets.length} answers.`);
  assert(tray.length === targets.length + 1, `${problem.id} tray must hold every answer plus one turned twin.`);

  const givenIds = new Set();
  givens.forEach((given) => {
    given.cells.forEach((cell) => {
      assert(inGrid(cell, grid), `${problem.id} places ${given.type} outside the board.`);
      assert(isGivenSide(cell, axis), `${problem.id} places ${given.type} past the mirror.`);
      assert(!givenIds.has(cellId(cell)), `${problem.id} overlaps two given objects.`);
      givenIds.add(cellId(cell));
    });
  });

  const targetIds = new Set();
  targets.forEach((target, index) => {
    const given = givens[index];
    assert(target.type === given.type, `${problem.id} answer ${index} changed object type.`);
    assert(target.cells.length === given.cells.length, `${problem.id} answer ${index} changed size.`);
    target.cells.forEach((cell) => {
      assert(inGrid(cell, grid), `${problem.id} answers outside the board.`);
      assert(!isGivenSide(cell, axis), `${problem.id} puts an answer on the given side.`);
      assert(!givenIds.has(cellId(cell)), `${problem.id} overlaps an answer with a given object.`);
      assert(!targetIds.has(cellId(cell)), `${problem.id} overlaps two answers.`);
      targetIds.add(cellId(cell));
    });
    const expected = new Set(given.cells.map((cell) => cellId(reflectCell(cell, axis))));
    assert(target.cells.length === expected.size && target.cells.every((cell) => expected.has(cellId(cell))), `${problem.id} answer ${index} is not the reflection of its object.`);
    assert(shapeKey(target.cells) === shapeKey(reflectedOrientation(given.cells, axis)), `${problem.id} answer ${index} has the wrong mirrored orientation.`);
    given.cells.forEach((cell, part) => {
      const mate = reflectCell(cell, axis);
      assert(mirrorDistance(mate, axis) === mirrorDistance(cell, axis), `${problem.id} answer ${index} part ${part} is a different distance from the mirror.`);
      assert(parallelCoord(mate, axis) === parallelCoord(cell, axis), `${problem.id} answer ${index} part ${part} slid along the mirror.`);
    });
  });

  const answerKeys = targets.map((target) => shapeKey(target.cells));
  const trayKeys = tray.map((piece) => shapeKey(piece.shape));
  answerKeys.forEach((key, index) => assert(trayKeys[index] === key, `${problem.id} tray slot ${index} does not match its answer.`));
  const decoyKey = trayKeys[trayKeys.length - 1];
  assert(!answerKeys.includes(decoyKey), `${problem.id} decoy is a real answer.`);
  assert(targets.some((target) => shapeVariants(target.cells).map(shapeKey).includes(decoyKey)), `${problem.id} decoy is not a turned version of an object.`);

  assert(countDragSolutions(problem) === 1, `${problem.id} does not have exactly one solution.`);
}

function validateDistance(problem) {
  const { grid, axis, sourceCell, targetCell, choices, validation } = problem;
  assert(grid.lattice === "square" || grid.lattice === "triangle", `${problem.id} has an unsupported dot grid.`);
  assert(sourceCell.length === 2 && targetCell.length === 2, `${problem.id} needs one source and one target dot.`);
  assert(inGrid(sourceCell, grid) && isGivenSide(sourceCell, axis), `${problem.id} source is outside the given side.`);
  assert(inGrid(targetCell, grid) && !isGivenSide(targetCell, axis), `${problem.id} target is outside the answer side.`);
  assert(cellId(reflectCell(sourceCell, axis)) === cellId(targetCell), `${problem.id} target is not the reflection of its source.`);
  assert(Array.isArray(choices) && choices.length === 3, `${problem.id} needs three answer choices.`);

  const choiceIds = new Set(choices.map(cellId));
  assert(choiceIds.size === choices.length, `${problem.id} repeats an answer choice.`);
  choices.forEach((choice) => {
    assert(inGrid(choice, grid) && !isGivenSide(choice, axis), `${problem.id} has a choice outside the answer side.`);
  });
  assert(choices.filter((choice) => cellId(choice) === cellId(targetCell)).length === 1, `${problem.id} does not have exactly one correct choice.`);

  // Independent candidate enumeration: same distance and same parallel line have
  // exactly one coordinate on the opposite side of a centered mirror.
  const matching = [];
  for (let x = 0; x < grid.cols; x += 1) {
    for (let y = 0; y < grid.rows; y += 1) {
      const candidate = [x, y];
      if (isGivenSide(candidate, axis)) continue;
      if (mirrorDistance(candidate, axis) !== mirrorDistance(sourceCell, axis)) continue;
      if (parallelCoord(candidate, axis) !== parallelCoord(sourceCell, axis)) continue;
      matching.push(candidate);
    }
  }
  assert(matching.length === 1 && cellId(matching[0]) === cellId(targetCell), `${problem.id} has a non-unique distance answer.`);

  const wrongDistance = choices.filter((choice) =>
    parallelCoord(choice, axis) === parallelCoord(sourceCell, axis)
    && mirrorDistance(choice, axis) !== mirrorDistance(sourceCell, axis));
  const wrongDirection = choices.filter((choice) =>
    parallelCoord(choice, axis) !== parallelCoord(sourceCell, axis)
    && mirrorDistance(choice, axis) === mirrorDistance(sourceCell, axis));
  assert(wrongDistance.length >= 1, `${problem.id} needs a distance distractor.`);
  assert(wrongDirection.length >= 1, `${problem.id} needs a direction distractor.`);
  assert(validation.solutionCount === 1, `${problem.id} must declare one solution.`);
}

function validateSymbol(problem) {
  const { grid, axis, sourceKind, sourceText, choices, validation } = problem;
  assert(sourceKind === "letter" || sourceKind === "word" || sourceKind === "latin" || sourceKind === "arrow", `${problem.id} has an unsupported symbol kind.`);
  assert(grid.cols === GRID.cols && grid.rows === GRID.rows, `${problem.id} uses the wrong room size.`);
  assert(SUPPORTED_AXIS_KINDS.includes(axis.kind), `${problem.id} has an unsupported symbol mirror.`);
  assert(axis.at === (axis.kind === "horizontal" ? 3 : 4), `${problem.id} has the wrong symbol mirror anchor.`);
  assert(typeof sourceText === "string" && sourceText.length > 0, `${problem.id} has no source symbol.`);
  assert(Array.isArray(choices) && choices.length === 3, `${problem.id} needs three symbol choices.`);
  const signatures = new Set(choices.map((choice) => `${choice.kind}:${choice.text}`));
  assert(signatures.size === choices.length, `${problem.id} repeats a symbol choice.`);
  choices.forEach((choice) => assert(typeof choice.text === "string" && choice.text.length > 0, `${problem.id} has an empty choice.`));
  const mirrorChoices = choices.filter((choice) => choice.kind === "mirror");
  assert(mirrorChoices.length === 1 && mirrorChoices[0].text === sourceText, `${problem.id} must have one reflected source choice.`);
  assert(choices.filter((choice) => choice.kind === "normal").length === 1, `${problem.id} needs one unreflected choice.`);
  assert(choices.filter((choice) => choice.kind === "decoy").length === 1, `${problem.id} needs one decoy choice.`);
  assert(validation.solutionCount === 1, `${problem.id} must declare one solution.`);
}

/**
 * Exhaustive search: place every tray piece at every legal anchor on the answer side
 * and count how many distinct complete arrangements make the room mirror-symmetric.
 * The pool ships only when that count is 1.
 */
export function countDragSolutions(problem) {
  const { axis, grid, givens, targets, tray } = problem;
  const cellId = (cell) => cell.join(",");
  const blocked = new Set(givens.flatMap((given) => given.cells.map(cellId)));
  const wanted = new Set(targets.flatMap((target) => target.cells.map(cellId)));

  const options = tray.map((piece) => {
    const placements = [];
    for (let x = 0; x < grid.cols; x += 1) {
      for (let y = 0; y < grid.rows; y += 1) {
        const cells = piece.shape.map(([dx, dy]) => [x + dx, y + dy]);
        if (!cells.every((cell) => inGrid(cell, grid) && !isGivenSide(cell, axis) && !blocked.has(cellId(cell)))) continue;
        placements.push(cells.map(cellId));
      }
    }
    return placements;
  });

  const solutions = new Set();
  const used = new Set();
  const chosen = [];

  const walk = (slot, filled) => {
    if (chosen.length === targets.length) {
      if (filled === wanted.size) solutions.add([...chosen].sort().join("|"));
      return;
    }
    if (slot >= options.length) return;
    // Skip this tray piece entirely (the decoy must be the one left behind).
    if (options.length - slot > targets.length - chosen.length) walk(slot + 1, filled);
    for (const placement of options[slot]) {
      if (!placement.every((id) => wanted.has(id) && !used.has(id))) continue;
      placement.forEach((id) => used.add(id));
      chosen.push(placement.slice().sort().join(","));
      walk(slot + 1, filled + placement.length);
      chosen.pop();
      placement.forEach((id) => used.delete(id));
    }
  };

  walk(0, 0);
  return solutions.size;
}
