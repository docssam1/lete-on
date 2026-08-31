import { levels } from "./levels.js";

function fail(message) {
  throw new Error(`Mirror Manor content audit: ${message}`);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const key = ([x, y]) => `${x},${y}`;
const setKey = (cells) => [...new Set(cells.map(key))].sort().join("|");

function oracleReflect([x, y], axis) {
  if (axis.kind === "vertical") return [axis.at + (axis.at - 1 - x), y];
  if (axis.kind === "horizontal") return [x, axis.at + (axis.at - 1 - y)];
  fail(`unsupported single axis ${axis.kind}`);
}

function oracleDouble([x, y], axis) {
  const rx = axis.verticalAt + (axis.verticalAt - 1 - x);
  const ry = axis.horizontalAt + (axis.horizontalAt - 1 - y);
  return [[rx, y], [x, ry], [rx, ry]];
}

function normalize(cells) {
  const minX = Math.min(...cells.map(([x]) => x));
  const minY = Math.min(...cells.map(([, y]) => y));
  return cells.map(([x, y]) => [x - minX, y - minY]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}

function shapeKey(cells) {
  return normalize(cells).map(key).join("|");
}

function multiset(values) {
  const counts = new Map();
  values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return [...counts].sort(([a], [b]) => a.localeCompare(b));
}

export function auditMirrorLevels(candidateLevels = levels) {
  assert(candidateLevels.length === 5, `expected 5 levels, found ${candidateLevels.length}`);
  const expectedInteractions = ["paint-reflection", "distance-match", "drag-reflection", "symbol-reflection", "double-mirror"];
  const expectedDifficulties = ["입문", "초급", "초급", "중급", "중급"];
  const ids = new Set();
  const answerPositions = { distance: [0, 0, 0], symbol: [0, 0, 0] };
  const distanceStructures = new Set();
  const decoyPositions = [];
  const knownVerticalSymmetry = new Set(["A", "H", "I", "M", "O", "T", "U", "V", "W", "X", "Y", "움"]);

  candidateLevels.forEach((level, levelIndex) => {
    assert(level.id === levelIndex + 1, `level order breaks at ${level.id}`);
    assert(level.interaction === expectedInteractions[levelIndex], `level ${level.id} interaction drifted`);
    assert(level.difficulty === expectedDifficulties[levelIndex], `level ${level.id} difficulty drifted`);
    assert(level.conceptDepth === level.id, `level ${level.id} concept depth drifted`);
    assert(level.problems.length === 10, `level ${level.id} has ${level.problems.length} problems`);
    const costs = level.problems.map((problem) => problem.reasoningSteps);
    assert(costs.every((cost) => Number.isInteger(cost) && cost > 0), `level ${level.id} lacks reasoning costs`);
    assert(costs.every((cost, index) => index === 0 || costs[index - 1] <= cost), `level ${level.id} is not easy-first`);

    level.problems.forEach((problem) => {
      assert(!ids.has(problem.id), `duplicate id ${problem.id}`);
      ids.add(problem.id);
      assert(problem.level === level.id, `${problem.id} has wrong level`);
      assert(problem.provenanceKind && problem.sourceRef, `${problem.id} has no source contract`);
      assert(problem.answerPolicy, `${problem.id} has no answer policy`);

      if (problem.interaction === "paint-reflection") {
        const expected = problem.sourceCells.map((cell) => oracleReflect(cell, problem.axis));
        assert(setKey(expected) === setKey(problem.targetCells), `${problem.id} paint answer is wrong`);
        assert(problem.answerPolicy === "exact-cell-set", `${problem.id} paint policy drifted`);
      } else if (problem.interaction === "drag-reflection") {
        const expectedTargets = problem.givens.map((given) => given.cells.map((cell) => oracleReflect(cell, problem.axis)));
        assert(multiset(expectedTargets.map(setKey)).toString() === multiset(problem.targets.map((target) => setKey(target.cells))).toString(), `${problem.id} target arrangement is wrong`);
        const expectedShapes = multiset(problem.targets.map((target) => shapeKey(target.cells)));
        const trayShapes = multiset(problem.tray.map((piece) => shapeKey(piece.shape)));
        expectedShapes.forEach(([shape, count]) => {
          const available = trayShapes.find(([candidate]) => candidate === shape)?.[1] || 0;
          assert(available >= count, `${problem.id} tray omits a reflected object`);
        });
        assert(problem.tray.length === problem.targets.length + 1, `${problem.id} needs one orientation decoy`);
        decoyPositions.push(problem.tray.findIndex((piece) => piece.id === "piece-decoy"));
      } else if (problem.interaction === "distance-match") {
        const expected = oracleReflect(problem.sourceCell, problem.axis);
        assert(key(expected) === key(problem.targetCell), `${problem.id} distance target is wrong`);
        assert(new Set(problem.choices.map(key)).size === 3, `${problem.id} repeats a distance choice`);
        const answerIndex = problem.choices.findIndex((choice) => key(choice) === key(expected));
        assert(answerIndex >= 0, `${problem.id} omits its distance answer`);
        answerPositions.distance[answerIndex] += 1;
        const signature = `${key(problem.sourceCell)}#${problem.choices.map(key).sort().join("|")}`;
        assert(!distanceStructures.has(signature), `${problem.id} repeats a distance structure`);
        distanceStructures.add(signature);
      } else if (problem.interaction === "symbol-reflection") {
        const kinds = problem.choices.map((choice) => choice.kind);
        assert(new Set(kinds).size === 3 && ["normal", "mirror", "decoy"].every((kind) => kinds.includes(kind)), `${problem.id} symbol roles are not unique`);
        const answerIndex = problem.choices.findIndex((choice) => choice.kind === "mirror");
        answerPositions.symbol[answerIndex] += 1;
        if (problem.axis.kind === "vertical") assert(!knownVerticalSymmetry.has(problem.sourceText), `${problem.id} has a visually identical normal and mirror choice`);
      } else {
        const expected = problem.sourceCells.flatMap((cell) => oracleDouble(cell, problem.axis));
        assert(setKey(expected) === setKey(problem.targetCells), `${problem.id} double-mirror answer is wrong`);
        assert(new Set(expected.map(key)).size === problem.sourceCells.length * 3, `${problem.id} double copies overlap`);
      }
    });
  });

  assert(ids.size === 50, `expected 50 unique ids, found ${ids.size}`);
  assert(answerPositions.distance.join(",") === "4,3,3", `distance answers are ${answerPositions.distance.join("/")}`);
  assert(answerPositions.symbol.join(",") === "4,3,3", `symbol answers are ${answerPositions.symbol.join("/")}`);
  assert(distanceStructures.size === 10, `distance structures collapsed to ${distanceStructures.size}`);
  assert(new Set(decoyPositions).size >= 3, "drag decoys stay in a predictable tray position");
  assert(candidateLevels[0].problems[0].reasoningSteps === 2 && Math.max(...candidateLevels[0].problems.slice(0, 5).map((problem) => problem.reasoningSteps)) <= 6, "intro session does not start with 2-6 cells");
  assert(candidateLevels[3].problems.filter((problem) => problem.provenanceKind === "internal-extension").length === 3, "level 4 source and internal extensions are not separated");
  return {
    levels: candidateLevels.length,
    problems: ids.size,
    answerPositions,
    difficulties: candidateLevels.map((level) => level.difficulty),
    distanceStructures: distanceStructures.size,
    dragDecoyPositions: decoyPositions,
    provenanceKinds: [...new Set(candidateLevels.flatMap((level) => level.problems.map((problem) => problem.provenanceKind)))]
  };
}

if (process.argv[1]?.endsWith("mirror-manor-content-audit.mjs")) {
  console.log(JSON.stringify(auditMirrorLevels(), null, 2));
}
