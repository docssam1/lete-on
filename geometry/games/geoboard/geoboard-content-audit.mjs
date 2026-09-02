import { levels } from "./levels.js";

const fail = (message) => { throw new Error(`Geoboard content audit: ${message}`); };
const assert = (condition, message) => { if (!condition) fail(message); };
const key = ([x, y]) => `${x},${y}`;

function combinations(items, count, visit, start = 0, chosen = []) {
  if (chosen.length === count) return visit(chosen);
  for (let index = start; index <= items.length - (count - chosen.length); index += 1) {
    combinations(items, count, visit, index + 1, [...chosen, items[index]]);
  }
}

function squarePoints(size) {
  return Array.from({ length: size * size }, (_, index) => [index % size, Math.floor(index / size)]);
}

function triangularPoints(size) {
  const points = [];
  for (let a = 0; a < size; a += 1) for (let b = 0; b < size - a; b += 1) points.push([a, b]);
  return points;
}

function squareDistance(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return dx * dx + dy * dy;
}

function triangularDistance(a, b) {
  const da = a[0] - b[0];
  const db = a[1] - b[1];
  return da * da + da * db + db * db;
}

function sideDistances(vertices, metric) {
  const distances = [];
  for (let first = 0; first < vertices.length; first += 1) {
    for (let second = first + 1; second < vertices.length; second += 1) distances.push(metric(vertices[first], vertices[second]));
  }
  return distances.sort((a, b) => a - b);
}

function independentSquareSummary(size) {
  const placements = [];
  combinations(squarePoints(size), 4, (vertices) => {
    const d = sideDistances(vertices, squareDistance);
    if (d[0] > 0 && d[0] === d[3] && d[4] === d[5] && d[4] === d[0] * 2) placements.push(d[0]);
  });
  return { placementCount: placements.length, typeCount: new Set(placements).size };
}

function independentEquilateralSummary(size) {
  const placements = [];
  combinations(triangularPoints(size), 3, (vertices) => {
    const d = sideDistances(vertices, triangularDistance);
    if (d[0] > 0 && d[0] === d[1] && d[1] === d[2]) placements.push(d[0]);
  });
  return { placementCount: placements.length, typeCount: new Set(placements).size };
}

function shapeInvariant(problem) {
  const transforms = [
    ([x, y]) => [x, y], ([x, y]) => [-x, y], ([x, y]) => [x, -y], ([x, y]) => [-x, -y],
    ([x, y]) => [y, x], ([x, y]) => [-y, x], ([x, y]) => [y, -x], ([x, y]) => [-y, -x]
  ];
  return transforms.map((transform) => {
    const points = problem.vertices.map(transform);
    const minX = Math.min(...points.map(([x]) => x));
    const minY = Math.min(...points.map(([, y]) => y));
    const moved = points.map(([x, y]) => [x - minX, y - minY]);
    const ring = problem.kind === "closed" ? [...moved, moved[0]] : moved;
    const edges = [];
    for (let index = 0; index + 1 < ring.length; index += 1) edges.push([key(ring[index]), key(ring[index + 1])].sort().join("~"));
    return edges.sort().join("|");
  }).sort()[0];
}

function chordKey([a, b]) { return [a, b].sort((x, y) => x - y).join("-"); }

function independentPartitionKeys(problem) {
  const count = problem.outline.length;
  const diagonals = [];
  for (let a = 0; a < count; a += 1) {
    for (let b = a + 1; b < count; b += 1) {
      const distance = b - a;
      if (distance !== 1 && distance !== count - 1) diagonals.push([a, b]);
    }
  }
  const candidates = problem.lineTotal === 1
    ? diagonals.map((line) => [line])
    : diagonals.flatMap((first, index) => diagonals.slice(index + 1).map((second) => [first, second]));

  const cross = ([a, b], [c, d]) => {
    if ([a, b].includes(c) || [a, b].includes(d)) return false;
    return ((a < c && c < b) !== (a < d && d < b));
  };

  const split = (chords) => {
    const faces = [Array.from({ length: count }, (_, index) => index)];
    for (const [a, b] of chords) {
      const owner = faces.findIndex((face) => {
        const ia = face.indexOf(a);
        const ib = face.indexOf(b);
        if (ia < 0 || ib < 0) return false;
        const distance = Math.abs(ia - ib);
        return distance > 1 && distance < face.length - 1;
      });
      if (owner < 0) return [];
      const face = faces[owner];
      const left = Math.min(face.indexOf(a), face.indexOf(b));
      const right = Math.max(face.indexOf(a), face.indexOf(b));
      faces.splice(owner, 1, face.slice(left, right + 1), [...face.slice(right), ...face.slice(0, left + 1)]);
    }
    return faces;
  };

  return candidates.filter((chords) => {
    if (problem.requiredVertex != null && !chords.some((chord) => chord.includes(problem.requiredVertex))) return false;
    if (chords.length === 2 && cross(chords[0], chords[1])) return false;
    const faces = split(chords);
    return faces.length === problem.lineTotal + 1
      && faces.filter((face) => face.length === 3).length === problem.targetTriangles
      && faces.filter((face) => face.length === 4).length === problem.targetQuadrilaterals
      && faces.every((face) => face.length === 3 || face.length === 4);
  }).map((chords) => chords.map(chordKey).sort().join(" ")).sort();
}

export function auditGeoboardLevels(candidateLevels = levels) {
  assert(candidateLevels.length === 5, "expected five levels");
  assert(JSON.stringify(candidateLevels.map((level) => level.problemCount)) === JSON.stringify([10, 15, 10, 10, 10]), "expected 55 authored problems in 10/15/10/10/10 pools");
  assert(JSON.stringify(candidateLevels.map((level) => level.stage)) === JSON.stringify(["초급", "초급", "중급", "중급", "중급"]), "stage order must be beginner, beginner, then intermediate");
  assert(JSON.stringify(candidateLevels.map((level) => level.difficulty)) === JSON.stringify(["하", "상", "하", "중", "상"]), "within-stage difficulty order drifted");
  assert(JSON.stringify(candidateLevels.map((level) => level.conceptDepth)) === JSON.stringify([1, 2, 3, 4, 5]), "concept depth must increase by level");

  const ids = new Set();
  const expectedProvenance = ["internal-extension", "source-backed-adaptation", "owner-approved-internal-extension", "owner-approved-internal-extension", "owner-approved-internal-extension"];
  const answerPositions = { square: [0, 0, 0], triangle: [0, 0, 0] };
  const summaries = { square: new Map(), triangle: new Map() };
  const partitionContracts = new Set();

  for (const level of candidateLevels) {
    assert(level.problems.length === level.problemCount, `level ${level.id} problem count drifted`);
    const seenShapes = new Set();
    for (const problem of level.problems) {
      assert(!ids.has(problem.id), `${problem.id} is duplicated`);
      ids.add(problem.id);
      assert(problem.provenanceKind === expectedProvenance[level.id - 1], `${problem.id} provenance drifted`);
      assert(typeof problem.sourceRef === "string" && problem.sourceRef.length > 5, `${problem.id} lacks a source reference`);
      assert(typeof problem.answerPolicy === "string" && problem.answerPolicy.length > 8, `${problem.id} lacks an answer policy`);
      assert(Number.isInteger(problem.reasoningSteps) && problem.reasoningSteps > 0, `${problem.id} lacks reasoning steps`);
      assert(problem.learnerFit && ["language", "representation", "prerequisite", "reasoningLoad", "responseMode"].every((key) => typeof problem.learnerFit[key] === "string"), `${problem.id} lacks a learner-fit profile`);

      if (problem.kind === "open" || problem.kind === "closed") {
        assert(problem.vertices.every(([x, y]) => Number.isInteger(x) && Number.isInteger(y) && x >= 0 && y >= 0 && x < 5 && y < 5), `${problem.id} uses a missing peg`);
        assert(new Set(problem.vertices.map(key)).size === problem.vertices.length, `${problem.id} repeats a vertex`);
        const invariant = shapeInvariant(problem);
        assert(!seenShapes.has(invariant), `${problem.id} repeats an earlier shape under motion or reflection`);
        seenShapes.add(invariant);
        assert(problem.validation.solutionCount === 1 && problem.validation.samePosition && problem.validation.sameOrientation, `${problem.id} does not require one exact visual placement`);
        continue;
      }

      if (problem.kind === "square-count" || problem.kind === "triangle-count") {
        const family = problem.kind === "square-count" ? "square" : "triangle";
        const cache = summaries[family];
        if (!cache.has(problem.boardSize)) cache.set(problem.boardSize, family === "square" ? independentSquareSummary(problem.boardSize) : independentEquilateralSummary(problem.boardSize));
        const summary = cache.get(problem.boardSize);
        assert(problem.availableTypeCount === summary.typeCount, `${problem.id} type count is not independently verified`);
        assert(problem.availablePlacementCount === summary.placementCount, `${problem.id} placement count is not independently verified`);
        if (problem.questionMode === "types") {
          assert(problem.targetKindCount <= summary.typeCount, `${problem.id} asks for too many types`);
        } else {
          assert(problem.answerChoices.length === 3 && new Set(problem.answerChoices).size === 3, `${problem.id} needs three distinct choices`);
          assert(problem.answerValue === summary.placementCount, `${problem.id} answer drifted`);
          const position = problem.answerChoices.indexOf(problem.answerValue);
          assert(position >= 0, `${problem.id} choices omit the answer`);
          answerPositions[family][position] += 1;
        }
        continue;
      }

      assert(problem.kind === "partition", `${problem.id} has an unknown interaction`);
      const independent = independentPartitionKeys(problem);
      assert(independent.length > 0, `${problem.id} has no valid partition`);
      assert(JSON.stringify(independent) === JSON.stringify([...problem.acceptedSolutionKeys].sort()), `${problem.id} partition answers disagree with independent enumeration`);
      const contract = `${problem.outline.length}:${problem.lineTotal}:${problem.targetTriangles}:${problem.targetQuadrilaterals}:${problem.requiredVertex ?? "any"}`;
      assert(!partitionContracts.has(contract), `${problem.id} repeats a partition contract`);
      partitionContracts.add(contract);
    }
  }

  assert(candidateLevels[0].problems.slice(0, 4).every((problem) => problem.vertices.length === 2), "level 1 must begin with four single segments");
  assert(JSON.stringify(answerPositions.square) === JSON.stringify([1, 1, 1]), "square count answers must use positions 1, 2, and 3 once each");
  assert(JSON.stringify(answerPositions.triangle) === JSON.stringify([1, 1, 1]), "triangle count answers must use positions 1, 2, and 3 once each");

  return {
    levels: candidateLevels.length,
    problems: ids.size,
    stages: candidateLevels.map((level) => level.stage),
    difficulties: candidateLevels.map((level) => level.difficulty),
    answerPositions,
    squareBoards: [...summaries.square].map(([size, summary]) => ({ size, ...summary })),
    triangleBoards: [...summaries.triangle].map(([size, summary]) => ({ size, ...summary })),
    partitionSolutionCounts: candidateLevels[4].problems.map((problem) => problem.acceptedSolutionKeys.length)
  };
}

if (process.argv[1]?.endsWith("geoboard-content-audit.mjs")) console.log(JSON.stringify(auditGeoboardLevels(), null, 2));
