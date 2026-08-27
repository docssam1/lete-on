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
  y5: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 1]]
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

export const levels = [
  { id: 1, titleKey: "level1Title", descriptionKey: "level1Desc", ready: true, problems: level1Problems },
  { id: 2, titleKey: "level2Title", descriptionKey: "level2Desc", ready: true, problems: level2Problems },
  { id: 3, titleKey: "level3Title", descriptionKey: "level3Desc", ready: false, problems: [] },
  { id: 4, titleKey: "level4Title", descriptionKey: "level4Desc", ready: false, problems: [] },
  { id: 5, titleKey: "level5Title", descriptionKey: "level5Desc", ready: false, problems: [] }
];

export const readyLevels = levels.filter((level) => level.ready);

export function acceptsChoice(problem, candidate) {
  if (problem.kind === "rotation-match") return freeShapeKey(candidate) === freeShapeKey(problem.target);
  return rotationKey(candidate) === rotationKey(problem.target);
}

export function validateLevels() {
  const ids = new Set();
  for (const level of readyLevels) {
    if (level.problems.length !== 10) throw new Error(`Polyomino level ${level.id} needs 10 problems.`);
    for (const problem of level.problems) {
      if (ids.has(problem.id)) throw new Error(`Duplicate problem id: ${problem.id}`);
      ids.add(problem.id);
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
