import {
  levels, readyLevels, validateLevels, targetPoints, acceptsAnswer, allPlacements,
  isClosed, vertexCount, edgeCount, pointOnSegment, segmentsIntersect,
  hasSelfIntersection, polygonArea, answerKey, pointKey
} from "./levels.js";
import { LANGUAGES, messages, text } from "./i18n.js";
import {
  DOT_BOARD_REFERENCE, squareBoardSummary, triangularBoardSummary
} from "./lattice-enumerator.js";

function assert(condition, message) {
  if (!condition) throw new Error(`Geoboard self-test: ${message}`);
}

validateLevels();
assert(levels.length === 5, "five levels must be declared");
assert(readyLevels.length === 5, "all five levels must be playable in this release");

const ids = readyLevels.flatMap((level) => level.problems.map((problem) => problem.id));
const expectedProblemCount = readyLevels.reduce((total, level) => total + level.problemCount, 0);
assert(ids.length === expectedProblemCount && new Set(ids).size === expectedProblemCount, `the ${expectedProblemCount} ready problems need unique ids`);

for (const level of readyLevels) {
  for (const problem of level.problems) {
    if (problem.kind === "compound-count") {
      const independent = independentlyCountCompound(problem);
      assert(independent.triangles === problem.triangleCount, `${problem.id} triangle count disagrees with independent sampling`);
      assert(independent.quadrilaterals === problem.quadrilateralCount, `${problem.id} quadrilateral count disagrees with independent sampling`);
      assert(problem.triangleChoices.filter((value) => value === problem.triangleCount).length === 1,
        `${problem.id} triangle choices do not have one answer`);
      assert(problem.quadrilateralChoices.filter((value) => value === problem.quadrilateralCount).length === 1,
        `${problem.id} quadrilateral choices do not have one answer`);
      continue;
    }
    if (problem.kind === "square-count" || problem.kind === "triangle-count") {
      const summary = problem.kind === "square-count"
        ? squareBoardSummary(problem.boardSize).squares
        : triangularBoardSummary(problem.boardSize).equilateralTriangles;
      const expectedTypes = summary.typeCount;
      assert(problem.availableTypeCount === expectedTypes, `${problem.id} available kind count drifted`);
      assert(problem.availablePlacementCount === summary.placementCount, `${problem.id} available placement count drifted`);
      if (problem.questionMode === "types") {
        assert(problem.targetKindCount >= 1 && problem.targetKindCount <= expectedTypes, `${problem.id} target kind count is impossible`);
      } else {
        assert(problem.questionMode === "placements", `${problem.id} question mode is invalid`);
        assert(problem.answerValue === summary.placementCount, `${problem.id} total-count answer drifted`);
        assert(problem.answerChoices.includes(problem.answerValue), `${problem.id} choices omit the answer`);
      }
      continue;
    }
    const target = targetPoints(problem);
    assert(acceptsAnswer(problem, target), `${problem.id} rejects its target`);
    assert(acceptsAnswer(problem, [...target].reverse()), `${problem.id} rejects reverse tap order`);

    if (problem.kind === "closed") {
      problem.vertices.forEach((_, start) => {
        const ring = [...problem.vertices.slice(start), ...problem.vertices.slice(0, start)];
        assert(acceptsAnswer(problem, [...ring, ring[0]]), `${problem.id} rejects start corner ${start}`);
      });
    }

    const accepted = allPlacements(problem).filter((candidate) => acceptsAnswer(problem, candidate));
    assert(accepted.length === 1, `${problem.id} has ${accepted.length} accepted placements`);
    assert(answerKey(accepted[0]) === answerKey(target), `${problem.id} accepts the wrong placement`);
  }
}

// Independent oracle for level 5. The production enumerator merges projected
// intervals. This test instead samples every candidate side densely and asks if
// each sample lies on any authored segment, then walks all vertex permutations.
// The different calculation catches interval-merging and cycle-order mistakes.
function independentlyCountCompound(problem) {
  const cross = (a, b, p) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
  const onSegment = (p, a, b) => Math.abs(cross(a, b, p)) < 1e-8
    && p[0] >= Math.min(a[0], b[0]) - 1e-8 && p[0] <= Math.max(a[0], b[0]) + 1e-8
    && p[1] >= Math.min(a[1], b[1]) - 1e-8 && p[1] <= Math.max(a[1], b[1]) + 1e-8;
  const visible = (a, b) => Array.from({ length: 97 }, (_, index) => index / 96).every((ratio) => {
    const sample = [a[0] + (b[0] - a[0]) * ratio, a[1] + (b[1] - a[1]) * ratio];
    return problem.segments.some(([c, d]) => onSegment(sample, c, d));
  });
  const combinations = (items, size, start = 0, prefix = [], result = []) => {
    if (prefix.length === size) { result.push(prefix); return result; }
    for (let index = start; index <= items.length - (size - prefix.length); index += 1) {
      combinations(items, size, index + 1, [...prefix, items[index]], result);
    }
    return result;
  };
  const permutations = ([head, ...tail]) => {
    const visit = (remaining, built, result) => {
      if (!remaining.length) { result.push([head, ...built]); return; }
      remaining.forEach((point, index) => visit([...remaining.slice(0, index), ...remaining.slice(index + 1)], [...built, point], result));
    };
    const result = [];
    visit(tail, [], result);
    return result;
  };
  const properCross = (a, b, c, d) => cross(a, b, c) * cross(a, b, d) < 0 && cross(c, d, a) * cross(c, d, b) < 0;
  const edgeKey = (ring) => ring.map((point, index) => [pointKey(point), pointKey(ring[(index + 1) % ring.length])].sort().join("-")).sort().join("|");

  const triangles = combinations(problem.points, 3).filter((ring) => cross(...ring) !== 0 && ring.every((point, index) => visible(point, ring[(index + 1) % 3])));
  const quadrilateralKeys = new Set();
  combinations(problem.points, 4).forEach((points) => permutations(points).forEach((ring) => {
    if (ring.some((point, index) => cross(point, ring[(index + 1) % 4], ring[(index + 2) % 4]) === 0)) return;
    if (properCross(ring[0], ring[1], ring[2], ring[3]) || properCross(ring[1], ring[2], ring[3], ring[0])) return;
    if (ring.every((point, index) => visible(point, ring[(index + 1) % 4]))) quadrilateralKeys.add(edgeKey(ring));
  }));
  return { triangles: triangles.length, quadrilaterals: quadrilateralKeys.size };
}

const square = [[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]];
const openPath = [[0, 0], [1, 0], [1, 2]];
const bowTie = [[0, 0], [2, 2], [0, 2], [2, 0], [0, 0]];
assert(isClosed(square) && !isClosed(openPath), "open/closed detection failed");
assert(vertexCount(square) === 4 && vertexCount(openPath) === 3, "vertex counting failed");
assert(edgeCount(square) === 4 && edgeCount(openPath) === 2, "edge counting failed");
assert(pointOnSegment([1, 1], [0, 0], [2, 2]), "point-on-segment missed a point");
assert(!pointOnSegment([1, 2], [0, 0], [2, 2]), "point-on-segment accepted an off-line point");
assert(segmentsIntersect([0, 0], [2, 2], [0, 2], [2, 0]), "crossing segments were missed");
assert(!segmentsIntersect([0, 0], [1, 0], [0, 2], [1, 2]), "separate segments were marked crossing");
assert(hasSelfIntersection(bowTie) && !hasSelfIntersection(square), "self-intersection detection failed");
assert(polygonArea(square) === 4, "polygon area calculation failed");

for (const expected of DOT_BOARD_REFERENCE.square) {
  const actual = squareBoardSummary(expected.size);
  assert(actual.triangles.placementCount === expected.trianglePlacements,
    `${expected.size}x${expected.size} square board triangle placement count drifted`);
  assert(actual.triangles.typeCount === expected.triangleTypes,
    `${expected.size}x${expected.size} square board triangle type count drifted`);
  assert(actual.squares.placementCount === expected.squarePlacements,
    `${expected.size}x${expected.size} square board square placement count drifted`);
  assert(actual.squares.typeCount === expected.squareTypes,
    `${expected.size}x${expected.size} square board square type count drifted`);
  assert(actual.equilateralTriangles.placementCount === 0,
    `${expected.size}x${expected.size} square board must not claim an exact equilateral triangle`);
}

for (const expected of DOT_BOARD_REFERENCE.triangular) {
  const actual = triangularBoardSummary(expected.size);
  assert(actual.equilateralTriangles.placementCount === expected.equilateralPlacements,
    `triangular board size ${expected.size} equilateral placement count drifted`);
  assert(actual.equilateralTriangles.typeCount === expected.equilateralTypes,
    `triangular board size ${expected.size} equilateral type count drifted`);
  // Independent closed form for the number of equilateral placements in a
  // triangular patch: choose(size + 2, 4).
  const n = expected.size;
  const formula = (n + 2) * (n + 1) * n * (n - 1) / 24;
  assert(actual.equilateralTriangles.placementCount === formula,
    `triangular board size ${n} disagrees with the independent formula`);
}

const koreanKeys = Object.keys(messages.ko).sort();
for (const lang of LANGUAGES) {
  assert(JSON.stringify(Object.keys(messages[lang]).sort()) === JSON.stringify(koreanKeys), `${lang} locale keys differ from Korean`);
  assert(text(lang, "levelLabel", { level: 2 }).includes("2"), `${lang} level label does not interpolate`);
  assert(messages[lang].successGreat === "GREAT JOB!", `${lang} success text drifted`);
}

console.log(`Geoboard self-test passed: ${ids.length} problems, ${LANGUAGES.length} locales.`);
