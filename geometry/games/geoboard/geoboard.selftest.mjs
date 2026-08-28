import {
  levels, readyLevels, validateLevels, targetPoints, acceptsAnswer, allPlacements,
  acceptsPartitionAnswer, partitionAnswerKey,
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
assert(readyLevels.length === 5, "all five levels must be playable in this release");

const ids = readyLevels.flatMap((level) => level.problems.map((problem) => problem.id));
const expectedProblemCount = readyLevels.reduce((total, level) => total + level.problemCount, 0);
assert(ids.length === expectedProblemCount && new Set(ids).size === expectedProblemCount, `the ${expectedProblemCount} ready problems need unique ids`);

function chordKey(chord) {
  return [...chord].sort((a, b) => a - b).join("-");
}

function independentPartitionKeys(problem) {
  const n = problem.outline.length;
  const diagonals = [];
  for (let a = 0; a < n; a += 1) {
    for (let b = a + 1; b < n; b += 1) {
      const distance = b - a;
      if (distance !== 1 && distance !== n - 1) diagonals.push([a, b]);
    }
  }
  const groups = problem.lineTotal === 1
    ? diagonals.map((line) => [line])
    : diagonals.flatMap((first, i) => diagonals.slice(i + 1).map((second) => [first, second]));

  function chordsCross([a, b], [c, d]) {
    if ([a, b].includes(c) || [a, b].includes(d)) return false;
    return ((a < c && c < b) !== (a < d && d < b));
  }

  function splitFaces(chords) {
    let faces = [Array.from({ length: n }, (_, index) => index)];
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
  }

  return groups.filter((chords) => {
    if (chords.length === 2 && chordsCross(chords[0], chords[1])) return false;
    const faces = splitFaces(chords);
    return faces.length === problem.lineTotal + 1
      && faces.filter((face) => face.length === 3).length === problem.targetTriangles
      && faces.filter((face) => face.length === 4).length === problem.targetQuadrilaterals
      && faces.every((face) => face.length === 3 || face.length === 4);
  }).map((chords) => chords.map((chord) => chordKey(chord)).sort().join(" ")).sort();
}

for (const level of readyLevels) {
  for (const problem of level.problems) {
    if (problem.kind === "partition") {
      const independent = independentPartitionKeys(problem);
      const shipped = [...problem.acceptedSolutionKeys].sort();
      assert(JSON.stringify(independent) === JSON.stringify(shipped), `${problem.id} partition solutions disagree with independent enumeration`);
      assert(independent.length > 0, `${problem.id} needs at least one accepted drawing`);
      for (const solution of problem.acceptedSolutions) {
        assert(solution.length === problem.lineTotal, `${problem.id} accepted a drawing with the wrong line count`);
        assert(acceptsPartitionAnswer(problem, solution), `${problem.id} rejects an accepted partition`);
        assert(problem.acceptedSolutionKeys.includes(partitionAnswerKey(solution)), `${problem.id} solution key drifted`);
      }
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
