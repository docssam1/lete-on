import {
  levels, readyLevels, validateLevels, targetPoints, acceptsAnswer, allPlacements,
  isClosed, vertexCount, edgeCount, pointOnSegment, segmentsIntersect,
  hasSelfIntersection, polygonArea, answerKey
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
assert(readyLevels.length === 4, "levels 1 through 4 must be playable in this release");

const ids = readyLevels.flatMap((level) => level.problems.map((problem) => problem.id));
const expectedProblemCount = readyLevels.reduce((total, level) => total + level.problemCount, 0);
assert(ids.length === expectedProblemCount && new Set(ids).size === expectedProblemCount, `the ${expectedProblemCount} ready problems need unique ids`);

for (const level of readyLevels) {
  for (const problem of level.problems) {
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
