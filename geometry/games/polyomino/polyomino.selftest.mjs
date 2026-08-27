import { levels, readyLevels, validateLevels, acceptsChoice, findCoverSolutions } from "./levels.js";
import { LANGUAGES, messages, text } from "./i18n.js";

function assert(condition, message) {
  if (!condition) throw new Error(`Polyomino self-test: ${message}`);
}

const normalizeIndependent = (cells) => {
  const minX = Math.min(...cells.map(([x]) => x));
  const minY = Math.min(...cells.map(([, y]) => y));
  return cells.map(([x, y]) => [x - minX, y - minY]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
};
const keyIndependent = (cells) => normalizeIndependent(cells).map((cell) => cell.join(",")).join(" ");
const rotateIndependent = (cells) => normalizeIndependent(cells.map(([x, y]) => [y, -x]));
const flipIndependent = (cells) => normalizeIndependent(cells.map(([x, y]) => [-x, y]));
const rotationSetIndependent = (cells) => {
  const found = new Set();
  let current = normalizeIndependent(cells);
  for (let turn = 0; turn < 4; turn += 1) {
    found.add(keyIndependent(current));
    current = rotateIndependent(current);
  }
  return found;
};
const sameByTurningIndependent = (a, b) => rotationSetIndependent(a).has(keyIndependent(b));
const sameFreeIndependent = (a, b) => sameByTurningIndependent(a, b) || sameByTurningIndependent(flipIndependent(a), b);

function connected(cells) {
  const wanted = new Set(cells.map((cell) => cell.join(",")));
  const seen = new Set([cells[0].join(",")]);
  const queue = [cells[0]];
  while (queue.length) {
    const [x, y] = queue.shift();
    [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].forEach((next) => {
      const id = next.join(",");
      if (!wanted.has(id) || seen.has(id)) return;
      seen.add(id);
      queue.push(next);
    });
  }
  return seen.size === cells.length;
}

function orientationsIndependent(cells, allowFlip) {
  const found = new Map();
  const seeds = allowFlip ? [cells, flipIndependent(cells)] : [cells];
  seeds.forEach((seed) => {
    let current = normalizeIndependent(seed);
    for (let turn = 0; turn < 4; turn += 1) {
      found.set(keyIndependent(current), current);
      current = rotateIndependent(current);
    }
  });
  return [...found.values()];
}

function exactCoversIndependent(problem, limit = 2) {
  const board = new Set(problem.board.map((cell) => cell.join(",")));
  const boardWidth = Math.max(...problem.board.map(([x]) => x)) + 1;
  const boardHeight = Math.max(...problem.board.map(([, y]) => y)) + 1;
  const placements = problem.pieces.map((piece, pieceIndex) => {
    const found = new Map();
    orientationsIndependent(piece.cells, problem.allowFlip).forEach((orientation) => {
      const width = Math.max(...orientation.map(([x]) => x)) + 1;
      const height = Math.max(...orientation.map(([, y]) => y)) + 1;
      for (let anchorY = 0; anchorY <= boardHeight - height; anchorY += 1) {
        for (let anchorX = 0; anchorX <= boardWidth - width; anchorX += 1) {
          const cells = orientation.map(([x, y]) => [x + anchorX, y + anchorY]);
          if (!cells.every((cell) => board.has(cell.join(",")))) continue;
          const key = cells.map((cell) => cell.join(",")).sort().join(" ");
          found.set(key, { pieceIndex, cells });
        }
      }
    });
    return [...found.values()];
  });
  const occupied = new Set();
  const used = new Set();
  const chosen = [];
  const solutions = [];

  function search() {
    if (solutions.length >= limit) return;
    if (occupied.size === board.size) {
      if (used.size === problem.pieces.length) solutions.push(chosen.map((entry) => ({
        pieceIndex: entry.pieceIndex,
        cells: entry.cells.map((cell) => [...cell])
      })));
      return;
    }
    const open = [...board].filter((id) => !occupied.has(id));
    let candidates = null;
    open.forEach((target) => {
      const fits = [];
      placements.forEach((piecePlacements, pieceIndex) => {
        if (used.has(pieceIndex)) return;
        piecePlacements.forEach((placement) => {
          if (!placement.cells.some((cell) => cell.join(",") === target)) return;
          if (placement.cells.some((cell) => occupied.has(cell.join(",")))) return;
          fits.push(placement);
        });
      });
      if (candidates === null || fits.length < candidates.length) candidates = fits;
    });
    for (const placement of candidates || []) {
      used.add(placement.pieceIndex);
      placement.cells.forEach((cell) => occupied.add(cell.join(",")));
      chosen.push(placement);
      search();
      chosen.pop();
      placement.cells.forEach((cell) => occupied.delete(cell.join(",")));
      used.delete(placement.pieceIndex);
      if (solutions.length >= limit) return;
    }
  }

  search();
  return solutions;
}

function assertExactCover(problem, solution) {
  const board = new Set(problem.board.map((cell) => cell.join(",")));
  const occupied = new Set();
  assert(solution.length === problem.pieces.length, `${problem.id} solution omits a piece`);
  assert(new Set(solution.map((entry) => entry.pieceIndex)).size === problem.pieces.length, `${problem.id} solution repeats a piece`);
  solution.forEach((entry) => entry.cells.forEach((cell) => {
    const id = cell.join(",");
    assert(board.has(id), `${problem.id} solution leaves the board`);
    assert(!occupied.has(id), `${problem.id} solution overlaps`);
    occupied.add(id);
  }));
  assert(occupied.size === board.size, `${problem.id} solution leaves a gap`);
}

validateLevels();
assert(levels.length === 5, "five planned levels must be declared");
assert(readyLevels.length === 5, "all five source-reviewed levels should be public");
const problems = readyLevels.flatMap((level) => level.problems);
assert(problems.length === 50 && new Set(problems.map((problem) => problem.id)).size === 50, "50 unique public problems are required");

for (const problem of problems) {
  if (problem.kind === "exact-cover") {
    assert(connected(problem.board), `${problem.id} board is disconnected`);
    assert(new Set(problem.board.map((cell) => cell.join(","))).size === problem.board.length, `${problem.id} board repeats a cell`);
    assert(problem.pieces.reduce((sum, piece) => sum + piece.cells.length, 0) === problem.board.length, `${problem.id} area does not balance`);
    problem.pieces.forEach((piece, index) => assert(connected(piece.cells), `${problem.id} piece ${index} is disconnected`));
    const independent = exactCoversIndependent(problem, 2);
    assert(independent.length > 0, `${problem.id} has no independently verified cover`);
    independent.forEach((solution) => assertExactCover(problem, solution));
    const engine = findCoverSolutions(problem, 2);
    assert(engine.length > 0, `${problem.id} engine did not find a cover`);
    engine.forEach((solution) => assertExactCover(problem, solution));
    const families = new Set(problem.pieces.map((piece) => keyIndependent(orientationsIndependent(piece.cells, true).sort((a, b) => keyIndependent(a).localeCompare(keyIndependent(b)))[0])));
    if (problem.family.startsWith("same")) assert(families.size === 1, `${problem.id} must use one piece family`);
    if (problem.family === "mixed-pentomino") assert(families.size >= 2, `${problem.id} must mix piece families`);
    continue;
  }
  assert(connected(problem.target), `${problem.id} target is disconnected`);
  problem.choices.forEach((choice, index) => assert(connected(choice.cells), `${problem.id} choice ${index} is disconnected`));
  const independentMatches = problem.choices.filter((choice) => problem.kind === "rotation-match"
    ? sameFreeIndependent(problem.target, choice.cells)
    : sameByTurningIndependent(problem.target, choice.cells));
  assert(independentMatches.length === 1, `${problem.id} does not have one independent answer`);
  assert(independentMatches[0].role === "correct", `${problem.id} independent answer role is wrong`);
  problem.choices.forEach((choice) => {
    assert(acceptsChoice(problem, choice.cells) === independentMatches.includes(choice), `${problem.id} engine and independent answer disagree`);
  });
  if (problem.kind === "turn-not-flip") {
    const mirror = problem.choices.find((choice) => choice.role === "mirror");
    assert(mirror, `${problem.id} needs a mirror decoy`);
    assert(sameFreeIndependent(problem.target, mirror.cells), `${problem.id} mirror decoy is not the same free piece`);
    assert(!sameByTurningIndependent(problem.target, mirror.cells), `${problem.id} mirror decoy can be turned to match`);
  }
}

const koreanKeys = Object.keys(messages.ko).sort();
for (const language of LANGUAGES) {
  assert(JSON.stringify(Object.keys(messages[language]).sort()) === JSON.stringify(koreanKeys), `${language} locale keys differ`);
  assert(text(language, "levelLabel", { level: 2 }).includes("2"), `${language} interpolation failed`);
  assert(messages[language].wrongDifferent !== messages[language].correct, `${language} wrong feedback praises the child`);
  assert(messages[language].wrongMirror.length > 0, `${language} mirror explanation is missing`);
}

console.log(`Polyomino self-test passed: ${problems.length} problems, ${LANGUAGES.length} locales.`);
