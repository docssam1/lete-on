import { pathToFileURL } from "node:url";
import { levels, PIECES } from "./levels.js";

const cellKey = (cell) => cell.join(",");
const compareCell = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
const normalizeCells = (cells) => {
  const mins = [0, 1, 2].map((axis) => Math.min(...cells.map((cell) => cell[axis])));
  return cells.map((cell) => cell.map((value, axis) => value - mins[axis])).sort(compareCell);
};
const cellsKey = (cells) => normalizeCells(cells).map(cellKey).join(";");

const rotateX = ([x, y, z]) => [x, -z, y];
const rotateY = ([x, y, z]) => [z, y, -x];
const rotateZ = ([x, y, z]) => [-y, x, z];

function independentRotations() {
  const identity = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  const encode = (matrix) => matrix.flat().join(",");
  const found = new Map([[encode(identity), identity]]);
  const queue = [identity];
  while (queue.length) {
    const matrix = queue.shift();
    for (const rotate of [rotateX, rotateY, rotateZ]) {
      const next = matrix.map(rotate);
      const signature = encode(next);
      if (!found.has(signature)) {
        found.set(signature, next);
        queue.push(next);
      }
    }
  }
  return [...found.values()].map((matrix) => ([x, y, z]) => [
    matrix[0][0] * x + matrix[1][0] * y + matrix[2][0] * z,
    matrix[0][1] * x + matrix[1][1] * y + matrix[2][1] * z,
    matrix[0][2] * x + matrix[1][2] * y + matrix[2][2] * z
  ]);
}

const ROTATIONS = independentRotations();

function independentOrientations(cells) {
  return [...new Map(ROTATIONS.map((rotate) => {
    const oriented = normalizeCells(cells.map(rotate));
    return [oriented.map(cellKey).join(";"), oriented];
  })).values()];
}

const canonicalPiece = (cells) => independentOrientations(cells).map((shape) => shape.map(cellKey).join(";")).sort()[0];

function canonicalArrangement(placements) {
  return ROTATIONS.map((rotate) => {
    const rotated = placements.map((placement) => ({
      pieceId: placement.pieceId,
      cells: placement.cells.map(rotate)
    }));
    const all = rotated.flatMap((placement) => placement.cells);
    const mins = [0, 1, 2].map((axis) => Math.min(...all.map((cell) => cell[axis])));
    return rotated.map((placement) => {
      const cells = placement.cells
        .map((cell) => cell.map((value, axis) => value - mins[axis]))
        .sort(compareCell)
        .map(cellKey)
        .join(";");
      return `${placement.pieceId}:${cells}`;
    }).sort().join("|");
  }).sort()[0];
}

function placementsFor(piece, targetCells) {
  const target = new Set(targetCells.map(cellKey));
  const max = [0, 1, 2].map((axis) => Math.max(...targetCells.map((cell) => cell[axis])));
  const results = [];
  for (const shape of independentOrientations(piece.cells)) {
    const size = [0, 1, 2].map((axis) => Math.max(...shape.map((cell) => cell[axis])) + 1);
    for (let x = 0; x <= max[0] - size[0] + 1; x += 1) {
      for (let y = 0; y <= max[1] - size[1] + 1; y += 1) {
        for (let z = 0; z <= max[2] - size[2] + 1; z += 1) {
          const cells = shape.map(([cx, cy, cz]) => [cx + x, cy + y, cz + z]).sort(compareCell);
          if (cells.every((cell) => target.has(cellKey(cell)))) results.push({ pieceId: piece.id, cells });
        }
      }
    }
  }
  return results;
}

function independentSolve(problem, pieceById, limit = 16) {
  const target = new Set(problem.target.map(cellKey));
  const fixed = problem.fixed || [];
  const occupied = new Set();
  for (const placement of fixed) {
    for (const cell of placement.cells) {
      const id = cellKey(cell);
      if (!target.has(id) || occupied.has(id)) return [];
      occupied.add(id);
    }
  }
  const remaining = problem.pieceIds.filter((id) => !fixed.some((placement) => placement.pieceId === id));
  const candidates = new Map(remaining.map((id) => [id, placementsFor(pieceById.get(id), problem.target)]));
  const solutions = [];
  function search(placed, ids) {
    if (solutions.length >= limit) return;
    if (!ids.length) {
      if (occupied.size === target.size) solutions.push([...fixed, ...placed]);
      return;
    }
    let nextId = null;
    let nextCandidates = null;
    for (const id of ids) {
      const valid = candidates.get(id).filter((placement) => placement.cells.every((cell) => !occupied.has(cellKey(cell))));
      if (nextCandidates === null || valid.length < nextCandidates.length) {
        nextId = id;
        nextCandidates = valid;
      }
    }
    if (!nextCandidates?.length) return;
    const rest = ids.filter((id) => id !== nextId);
    for (const placement of nextCandidates) {
      placement.cells.forEach((cell) => occupied.add(cellKey(cell)));
      search([...placed, placement], rest);
      placement.cells.forEach((cell) => occupied.delete(cellKey(cell)));
    }
  }
  search([], remaining);
  return solutions;
}

function hasSupportedOrder(placements, occupied = new Set()) {
  if (!placements.length) return true;
  return placements.some((placement, index) => {
    const supported = placement.cells.some(([x, y, z]) => y === 0 || occupied.has(cellKey([x, y - 1, z])));
    if (!supported) return false;
    const next = new Set(occupied);
    placement.cells.forEach((cell) => next.add(cellKey(cell)));
    return hasSupportedOrder(placements.filter((_, at) => at !== index), next);
  });
}

function exactProblemSignature(problem) {
  const options = (problem.options || []).map(cellsKey).join("|");
  const fixed = problem.fixed?.length ? canonicalArrangement(problem.fixed) : "";
  return `${problem.mode}:${cellsKey(problem.target)}:${[...(problem.pieceIds || [])].sort().join("")}:${fixed}:${options}`;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

export function auditSomaContent(inputLevels = levels, inputPieces = PIECES) {
  assert(ROTATIONS.length === 24, `Independent rotation count is ${ROTATIONS.length}`);
  const pieceById = new Map(inputPieces.map((piece) => [piece.id, piece]));
  assert(pieceById.size === 7, "Soma set must have seven pieces");
  assert(new Set(inputPieces.map((piece) => canonicalPiece(piece.cells))).size === 7, "Soma pieces must be rotation-distinct");
  assert(inputPieces.reduce((sum, piece) => sum + piece.cells.length, 0) === 27, "Soma volume must be 27");
  assert(inputLevels.length === 5, "Soma workshop must have five levels");
  assert(inputLevels.map((level) => level.problems.length).every((count) => count === 10), "Each Soma level needs ten problems");
  assert(inputLevels.map((level) => level.difficulty).join(",") === "하,하,중,중,상", "Difficulty order must rise from easy to hard");

  const ids = new Set();
  const exactSignatures = new Set();
  const reports = [];
  for (const level of inputLevels) {
    const modeCounts = {};
    for (const problem of level.problems) {
      assert(!ids.has(problem.id), `Duplicate id ${problem.id}`);
      ids.add(problem.id);
      const signature = exactProblemSignature(problem);
      assert(!exactSignatures.has(signature), `Exact duplicate challenge ${problem.id}`);
      exactSignatures.add(signature);
      assert(Number.isInteger(problem.reasoningSteps) && problem.reasoningSteps > 0, `${problem.id} needs reasoningSteps`);
      assert(problem.sourceRef?.startsWith("internal-variation;"), `${problem.id} needs internal-variation provenance`);
      modeCounts[problem.mode] = (modeCounts[problem.mode] || 0) + 1;

      if (problem.mode === "recognize") {
        const target = canonicalPiece(problem.target);
        const matches = problem.options.filter((option) => canonicalPiece(option) === target);
        assert(matches.length === 1, `${problem.id} needs one independent recognition answer`);
        assert(canonicalPiece(problem.options[problem.answer]) === target, `${problem.id} stored recognition answer is wrong`);
        continue;
      }

      assert(Math.min(...problem.target.map((cell) => cell[1])) === 0, `${problem.id} target does not touch the floor`);
      const fixed = problem.fixed || [];
      const totalIds = [...problem.pieceIds, ...fixed.map((placement) => placement.pieceId)];
      const volume = totalIds.reduce((sum, id) => sum + pieceById.get(id).cells.length, 0);
      assert(volume === problem.target.length, `${problem.id} volume mismatch`);
      assert(hasSupportedOrder(problem.reference || fixed), `${problem.id} has no supported build order`);
      const solutions = independentSolve({ ...problem, pieceIds: totalIds }, pieceById, level.id === 5 ? 20 : 4);
      assert(solutions.length > 0, `${problem.id} has no independent exact cover`);
      if (level.id === 5) {
        assert(new Set(solutions.map(canonicalArrangement)).size >= 2, `${problem.id} needs two independent assemblies`);
        assert(problem.verifiedAssemblies.length === 2, `${problem.id} needs two stored assemblies`);
        assert(new Set(problem.verifiedAssemblies.map(canonicalArrangement)).size === 2, `${problem.id} stored assemblies are equivalent`);
        const targetCells = new Set(problem.target.map(cellKey));
        for (const assembly of problem.verifiedAssemblies) {
          const assemblyCells = assembly.flatMap((placement) => placement.cells.map(cellKey));
          assert(assemblyCells.length === problem.target.length && new Set(assemblyCells).size === targetCells.size, `${problem.id} stored assembly overlaps`);
          assert(assemblyCells.every((cell) => targetCells.has(cell)), `${problem.id} stored assembly leaves the target`);
          assert(fixed.every((required) => assembly.some((placement) => placement.pieceId === required.pieceId
            && cellsKey(placement.cells) === cellsKey(required.cells))), `${problem.id} stored assembly ignores fixed pieces`);
        }
      }
    }
    reports.push({ level: level.id, stage: level.stage, difficulty: level.difficulty, problems: level.problems.length, modes: modeCounts });
  }

  assert(inputLevels[0].problems.slice(0, 2).every((problem) => problem.target.length === 3 && problem.options.length === 2), "Level 1 must begin with two simple V-piece choices");
  const level4Movable = inputLevels[3].problems.map((problem) => problem.pieceIds.length);
  const level5Movable = inputLevels[4].problems.map((problem) => problem.pieceIds.length);
  assert(level4Movable.every((count, index) => index === 0 || count >= level4Movable[index - 1]), "Level 4 movable pieces must not decrease");
  assert(level5Movable.every((count, index) => index === 0 || count >= level5Movable[index - 1]), "Level 5 movable pieces must not decrease");
  const level4Fixed = new Set(inputLevels[3].problems.map((problem) => canonicalArrangement(problem.fixed)));
  assert(inputLevels[4].problems.every((problem) => !level4Fixed.has(canonicalArrangement(problem.fixed))), "Levels 4 and 5 repeat a starting configuration");

  return {
    levels: inputLevels.length,
    problems: ids.size,
    independentRotations: ROTATIONS.length,
    distinctPieces: pieceById.size,
    reports
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify(auditSomaContent(), null, 2));
}
