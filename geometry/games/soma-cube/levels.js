import { sessionProblems } from "../../shared/problem-pool.js";

export const GAME_ID = "soma-cube";
export const PROGRESS_KEY = "somaCube";

const key = ([x, y, z]) => `${x},${y},${z}`;
const compareCell = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

const rotX = ([x, y, z]) => [x, -z, y];
const rotY = ([x, y, z]) => [z, y, -x];
const rotZ = ([x, y, z]) => [-y, x, z];

function buildRotations() {
  const basis = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  const signature = (matrix) => matrix.map((axis) => axis.join(",")).join("|");
  const seen = new Map([[signature(basis), basis]]);
  const queue = [basis];
  while (queue.length) {
    const current = queue.shift();
    [rotX, rotY, rotZ].forEach((rotate) => {
      const next = current.map(rotate);
      const id = signature(next);
      if (!seen.has(id)) {
        seen.set(id, next);
        queue.push(next);
      }
    });
  }
  return [...seen.values()].map((matrix) => ([x, y, z]) => [
    matrix[0][0] * x + matrix[1][0] * y + matrix[2][0] * z,
    matrix[0][1] * x + matrix[1][1] * y + matrix[2][1] * z,
    matrix[0][2] * x + matrix[1][2] * y + matrix[2][2] * z
  ]);
}

export const ROTATIONS = buildRotations();

export function normalize(cells) {
  const mins = [0, 1, 2].map((axis) => Math.min(...cells.map((cell) => cell[axis])));
  return cells.map((cell) => cell.map((value, axis) => value - mins[axis])).sort(compareCell);
}

const cellString = (cells) => cells.map(key).join(";");

export function orientations(cells) {
  const found = new Map();
  ROTATIONS.forEach((rotate) => {
    const next = normalize(cells.map(rotate));
    found.set(cellString(next), next);
  });
  return [...found.values()];
}

export function canonical(cells) {
  return orientations(cells).map(cellString).sort()[0];
}

export function canonicalArrangement(placements) {
  return ROTATIONS.map((rotate) => {
    const rotated = placements.map((placement) => ({ pieceId:placement.pieceId,cells:placement.cells.map(rotate) }));
    const all = rotated.flatMap((placement) => placement.cells);
    const mins = [0,1,2].map((axis) => Math.min(...all.map((cell) => cell[axis])));
    return rotated.map((placement) => `${placement.pieceId}:${cellString(placement.cells.map((cell) => cell.map((value,axis) => value-mins[axis])).sort(compareCell))}`).sort().join("|");
  }).sort()[0];
}

// The seven non-convex polycubes used by a Soma set: one tricube and six
// tetracubes. Labels are intentionally neutral; color and shape do the teaching.
export const PIECES = [
  { id: "V", color: "#f2a65a", cells: [[0,0,0],[1,0,0],[0,1,0]] },
  { id: "L", color: "#ef6f6c", cells: [[0,0,0],[0,1,0],[0,2,0],[1,0,0]] },
  { id: "T", color: "#59a6d8", cells: [[0,0,0],[1,0,0],[2,0,0],[1,1,0]] },
  { id: "Z", color: "#6ebf8b", cells: [[0,0,0],[1,0,0],[1,1,0],[2,1,0]] },
  { id: "P", color: "#a783cf", cells: [[0,0,0],[1,0,0],[0,1,0],[0,0,1]] },
  { id: "A", color: "#e6c84f", cells: [[0,0,0],[1,0,0],[0,1,0],[0,1,1]] },
  { id: "B", color: "#4db9b0", cells: [[0,0,0],[1,0,0],[1,1,0],[1,1,1]] }
];

export const PIECE_BY_ID = Object.fromEntries(PIECES.map((piece) => [piece.id, piece]));

export const CUBE_TARGET = Array.from({ length: 27 }, (_, index) => [
  index % 3,
  Math.floor(index / 9),
  Math.floor(index / 3) % 3
]);

function allPlacements(piece, targetCells) {
  const target = new Set(targetCells.map(key));
  const bounds = [0, 1, 2].map((axis) => Math.max(...targetCells.map((cell) => cell[axis])) + 1);
  const result = [];
  orientations(piece.cells).forEach((shape, rotation) => {
    const size = [0, 1, 2].map((axis) => Math.max(...shape.map((cell) => cell[axis])) + 1);
    for (let x = 0; x <= bounds[0] - size[0]; x += 1) {
      for (let y = 0; y <= bounds[1] - size[1]; y += 1) {
        for (let z = 0; z <= bounds[2] - size[2]; z += 1) {
          const cells = shape.map(([cx, cy, cz]) => [cx + x, cy + y, cz + z]).sort(compareCell);
          if (cells.every((cell) => target.has(key(cell)))) result.push({ pieceId: piece.id, rotation, cells });
        }
      }
    }
  });
  return result;
}

export function solveExactCover(targetCells, pieceIds, fixed = [], limit = 1) {
  const target = new Set(targetCells.map(key));
  const occupied = new Set(fixed.flatMap((placement) => placement.cells.map(key)));
  if ([...occupied].some((cell) => !target.has(cell))) return [];
  if (occupied.size !== fixed.reduce((sum, placement) => sum + placement.cells.length, 0)) return [];
  const remainingIds = pieceIds.filter((id) => !fixed.some((placement) => placement.pieceId === id));
  const byPiece = new Map(remainingIds.map((id) => [id, allPlacements(PIECE_BY_ID[id], targetCells)]));
  const solutions = [];

  function search(placed, freeIds) {
    if (solutions.length >= limit) return;
    if (!freeIds.length) {
      if (occupied.size === target.size) solutions.push([...fixed, ...placed]);
      return;
    }
    let bestId = null;
    let candidates = null;
    freeIds.forEach((id) => {
      const valid = byPiece.get(id).filter((placement) => placement.cells.every((cell) => !occupied.has(key(cell))));
      if (candidates === null || valid.length < candidates.length) {
        bestId = id;
        candidates = valid;
      }
    });
    if (!candidates?.length) return;
    const nextIds = freeIds.filter((id) => id !== bestId);
    candidates.forEach((placement) => {
      placement.cells.forEach((cell) => occupied.add(key(cell)));
      search([...placed, placement], nextIds);
      placement.cells.forEach((cell) => occupied.delete(key(cell)));
    });
  }

  search([], remainingIds);
  return solutions;
}

const ALL_IDS = PIECES.map((piece) => piece.id);
const RAW_FULL_SOLUTIONS = solveExactCover(CUBE_TARGET, ALL_IDS, [], 40);
const FULL_SOLUTIONS = [...new Map(
  RAW_FULL_SOLUTIONS.map((solution) => [canonicalArrangement(solution), solution])
).values()];

const adjacent = (a, b) => a.cells.some(([x1,y1,z1]) => b.cells.some(([x2,y2,z2]) =>
  Math.abs(x1-x2) + Math.abs(y1-y2) + Math.abs(z1-z2) === 1));

const arrangementKey = (placements) => placements
  .map((placement) => `${placement.pieceId}:${cellString(placement.cells)}`)
  .sort().join("|");

function isConnectedGroup(placements) {
  const reached = new Set([0]);
  const queue = [0];
  while (queue.length) {
    const current = queue.shift();
    placements.forEach((placement, index) => {
      if (!reached.has(index) && adjacent(placements[current], placement)) {
        reached.add(index);
        queue.push(index);
      }
    });
  }
  return reached.size === placements.length;
}

function connectedGroups(size, count) {
  const groups = new Map();
  FULL_SOLUTIONS.forEach((solution) => {
    const choose = (start, chosen) => {
      if (chosen.length === size) {
        if (isConnectedGroup(chosen)) groups.set(canonicalArrangement(chosen), chosen);
        return;
      }
      for (let index = start; index < solution.length; index += 1) choose(index + 1, [...chosen, solution[index]]);
    };
    choose(0, []);
  });
  return [...groups.values()].slice(0, count);
}

const cellsOf = (placements) => placements.flatMap((placement) => placement.cells).sort(compareCell);
const copyPlacement = (placement) => ({ pieceId: placement.pieceId, rotation: placement.rotation, cells: placement.cells.map((cell) => [...cell]) });

function supportedPrefixes(solution, count, limit = 24) {
  const prefixes = new Map();
  function search(chosen, occupied) {
    if (prefixes.size >= limit) return;
    if (chosen.length === count) {
      const copied = chosen.map(copyPlacement);
      prefixes.set(canonicalArrangement(copied), copied);
      return;
    }
    solution.forEach((placement) => {
      if (chosen.includes(placement)) return;
      const supported = placement.cells.some(([x,y,z]) => y === 0 || occupied.has(key([x,y-1,z])));
      if (!supported) return;
      const nextOccupied = new Set(occupied);
      placement.cells.forEach((cell) => nextOccupied.add(key(cell)));
      search([...chosen, placement], nextOccupied);
    });
  }
  search([], new Set());
  return [...prefixes.values()];
}

const TRI_DECOYS = [[[0,0,0],[1,0,0],[2,0,0]]];

function levelOneProblems() {
  const occurrences = new Map();
  return Array.from({ length: 10 }, (_, index) => {
    const targetPiece = PIECES[index % PIECES.length];
    const variants = orientations(targetPiece.cells);
    const occurrence = occurrences.get(targetPiece.id) || 0;
    occurrences.set(targetPiece.id, occurrence + 1);
    const targetIndex = (occurrence * Math.max(1, Math.floor(variants.length / 2)) + index) % variants.length;
    const target = variants[targetIndex];
    const same = variants[(targetIndex + 1 + occurrence) % variants.length];
    const decoyPieces = PIECES.filter((piece) => piece.cells.length === 4 && piece.id !== targetPiece.id);
    const decoys = targetPiece.id === "V"
      ? TRI_DECOYS.map((cells) => cells.map((cell) => [...cell]))
      : [0, 1].map((offset) => {
        const piece = decoyPieces[(index + offset * 2) % decoyPieces.length];
        const shapes = orientations(piece.cells);
        return shapes[(index + occurrence + offset) % shapes.length];
      });
    const correct = index % (decoys.length + 1);
    const options = [...decoys];
    options.splice(correct, 0, same);
    return { id: `soma-l1-${String(index + 1).padStart(2,"0")}`, mode: "recognize", targetPieceId: targetPiece.id, target, options, answer: correct };
  });
}

function assemblyProblems(level, groups) {
  return groups.map((placements, index) => ({
    id: `soma-l${level}-${String(index + 1).padStart(2,"0")}`,
    mode: "assemble",
    target: cellsOf(placements),
    pieceIds: placements.map((placement) => placement.pieceId),
    reference: placements.map(copyPlacement),
    answerPolicy: "any-exact-cover"
  }));
}

const groups2 = connectedGroups(2, 10);
const groups3 = connectedGroups(3, 10);

function cubeChallenges(level, fixedSchedule, answerPolicy) {
  const fixedCounts = [...new Set(fixedSchedule)];
  const required = new Map(fixedCounts.map((fixedCount) => [
    fixedCount,
    fixedSchedule.filter((value) => value === fixedCount).length
  ]));
  const pools = new Map(fixedCounts.map((fixedCount) => [fixedCount, []]));
  const seen = new Set();
  for (const solution of FULL_SOLUTIONS) {
    for (const fixedCount of fixedCounts) {
      if (pools.get(fixedCount).length >= required.get(fixedCount)) continue;
      for (const fixed of supportedPrefixes(solution, fixedCount)) {
        const signature = canonicalArrangement(fixed);
        if (seen.has(signature)) continue;
        const pieceIds = ALL_IDS.filter((id) => !fixed.some((placement) => placement.pieceId === id));
        let verifiedAssemblies = [];
        if (level === 5) {
          const solutions = solveExactCover(CUBE_TARGET, ALL_IDS, fixed, 8);
          const distinct = new Map(solutions.map((assembly) => [canonicalArrangement(assembly), assembly]));
          if (distinct.size < 2) continue;
          verifiedAssemblies = [...distinct.values()].slice(0, 2).map((assembly) => assembly.map(copyPlacement));
        }
        seen.add(signature);
        pools.get(fixedCount).push({
          mode: level === 4 ? "complete-cube" : "all-seven",
          target: CUBE_TARGET,
          fixed,
          pieceIds,
          reference: solution.map(copyPlacement),
          verifiedAssemblies,
          answerPolicy
        });
        if (pools.get(fixedCount).length >= required.get(fixedCount)) break;
      }
    }
    if (fixedCounts.every((fixedCount) => pools.get(fixedCount).length >= required.get(fixedCount))) break;
  }
  if (fixedCounts.some((fixedCount) => pools.get(fixedCount).length < required.get(fixedCount))) {
    throw new Error(`Could not build ${fixedSchedule.length} unique challenges for Soma level ${level}`);
  }
  return fixedSchedule.map((fixedCount, index) => ({
    ...pools.get(fixedCount).shift(),
    id: `soma-l${level}-${String(index + 1).padStart(2,"0")}`
  }));
}

const level4Problems = cubeChallenges(4, [2,3,4,2,3,4,2,3,4,2], "any-exact-cover-with-fixed");
const level5Problems = cubeChallenges(5, [1,2,1,2,1,2,1,2,2,2], "two-distinct-assemblies-required");

const levelDefinitions = [
  { id:1, stage:"키즈", difficulty:"중", title:"같은 조각 찾기", description:"돌아간 조각을 보고 같은 소마 조각을 찾아요.", problems:levelOneProblems() },
  { id:2, stage:"Pre", difficulty:"하", title:"두 조각 맞추기", description:"두 조각을 돌려 작은 입체를 완성해요.", problems:assemblyProblems(2, groups2) },
  { id:3, stage:"입문", difficulty:"중", title:"다른 조각, 같은 모양", description:"서로 다른 세 조각으로 같은 목표 모양을 만들어요.", problems:assemblyProblems(3, groups3) },
  { id:4, stage:"초급", difficulty:"중", title:"빈 큐브 채우기", description:"일부가 채워진 3×3×3 큐브의 나머지를 완성해요.", problems:level4Problems },
  { id:5, stage:"중급", difficulty:"상", title:"두 가지 조립법", description:"일곱 조각 큐브를 서로 다른 두 방법으로 완성해요.", problems:level5Problems }
];

export const levels = levelDefinitions.map((level) => ({
  ...level,
  session: () => sessionProblems(GAME_ID, level.id, level.problems, 5)
}));

export function problemSignature(problem) {
  if (problem.mode === "recognize") {
    return `${problem.targetPieceId}:${cellString(normalize(problem.target))}:${problem.options.map((option) => cellString(normalize(option))).join("|")}`;
  }
  if (problem.fixed?.length) return `${problem.mode}:${canonicalArrangement(problem.fixed)}`;
  return `${problem.mode}:${canonical(problem.target)}:${[...problem.pieceIds].sort().join("")}`;
}

export function validateLevels() {
  if (ROTATIONS.length !== 24) throw new Error(`Expected 24 cube rotations, found ${ROTATIONS.length}`);
  if (FULL_SOLUTIONS.length < 10) throw new Error("Soma solver did not produce enough verified cube solutions");
  if (new Set(PIECES.map((piece) => canonical(piece.cells))).size !== 7) throw new Error("Soma pieces must be rotation-distinct");
  if (PIECES.reduce((sum, piece) => sum + piece.cells.length, 0) !== 27) throw new Error("Soma pieces must fill 27 unit cubes");
  levels.forEach((level) => {
    if (level.problems.length !== 10) throw new Error(`Level ${level.id} needs 10 problems`);
    const signatures = level.problems.map(problemSignature);
    if (new Set(signatures).size !== signatures.length) throw new Error(`Level ${level.id} has duplicate challenges`);
    level.problems.forEach((problem) => {
      if (problem.mode === "recognize") {
        const target = canonical(problem.target);
        const matches = problem.options.filter((option) => canonical(option) === target).length;
        if (matches !== 1 || canonical(problem.options[problem.answer]) !== target) throw new Error(`${problem.id} must have one matching piece`);
        if (new Set(problem.options.map(canonical)).size !== problem.options.length) throw new Error(`${problem.id} has visually equivalent options`);
        return;
      }
      const fixed = problem.fixed || [];
      const solutions = solveExactCover(problem.target, [...problem.pieceIds, ...fixed.map((p) => p.pieceId)], fixed, level.id === 5 ? 8 : 2);
      if (!solutions.length) throw new Error(`${problem.id} has no valid assembly`);
      if (level.id === 5 && new Set(solutions.map(canonicalArrangement)).size < 2) throw new Error(`${problem.id} needs two distinct assemblies`);
      const volume = problem.target.length;
      const pieceVolume = [...problem.pieceIds, ...fixed.map((p) => p.pieceId)]
        .reduce((sum, id) => sum + PIECE_BY_ID[id].cells.length, 0);
      if (volume !== pieceVolume) throw new Error(`${problem.id} volume mismatch`);
    });
  });
  return { rotations: ROTATIONS.length, cubeSolutions: FULL_SOLUTIONS.length, problems: levels.reduce((sum, level) => sum + level.problems.length, 0) };
}

export function viewsOf(cells) {
  const encode = (pairs) => [...new Set(pairs)].sort().join(";");
  return {
    top: encode(cells.map(([x,,z]) => `${x},${z}`)),
    front: encode(cells.map(([x,y]) => `${x},${y}`)),
    right: encode(cells.map(([,y,z]) => `${z},${y}`))
  };
}
