import assert from "node:assert/strict";
import {
  ORIENTATION_PARITY,
  PUNCH_SHAPES,
  REFLECTION_AXES,
  createPolygonMark,
  createPunchMark,
  deduplicateMarks,
  isMarkInPaper,
  markGeometryKey,
  polygonSignedArea,
  punchVertices,
  reflectMark,
  reflectPoint,
  unfoldMarkStages,
  unfoldMarks,
  validateMark,
  validateMarks
} from "./mark-geometry.js";

const pointKey = ({ x, y }) => `${x.toFixed(9)},${y.toFixed(9)}`;
const pointSet = (points) => [...points].map(pointKey).sort();

function assertReflectedVertices(mark, axis) {
  const expected = pointSet(punchVertices(mark).map((point) => reflectPoint(point, axis)));
  const actual = pointSet(punchVertices(reflectMark(mark, axis)));
  assert.deepEqual(actual, expected, `${mark.shape} vertices must reflect across ${axis}`);
}

const region = createPolygonMark([
  { x: 0.11, y: 0.14 },
  { x: 0.29, y: 0.16 },
  { x: 0.25, y: 0.32 },
  { x: 0.13, y: 0.28 }
]);

const punches = [
  createPunchMark("circle", { x: 0.18, y: 0.37 }, { radius: 0.025 }),
  createPunchMark("triangle", { x: 0.31, y: 0.23 }, { radius: 0.035, angle: 0.37 }),
  createPunchMark("square", { x: 0.37, y: 0.39 }, { radius: 0.03, angle: 0.21 })
];

assert.deepEqual(REFLECTION_AXES, ["vertical", "horizontal", "diag-main", "diag-anti"]);
assert.deepEqual(PUNCH_SHAPES, ["circle", "triangle", "square"]);
assert.equal(validateMark(region), true);
assert.equal(validateMarks([region, ...punches]), true);
assert.ok([region, ...punches].every(isMarkInPaper));

assert.deepEqual(reflectPoint({ x: 0.2, y: 0.3 }, "vertical"), { x: 0.8, y: 0.3 });
assert.deepEqual(reflectPoint({ x: 0.2, y: 0.3 }, "horizontal"), { x: 0.2, y: 0.7 });
assert.deepEqual(reflectPoint({ x: 0.2, y: 0.3 }, "diag-main"), { x: 0.3, y: 0.2 });
assert.deepEqual(reflectPoint({ x: 0.2, y: 0.3 }, "diag-anti"), { x: 0.7, y: 0.8 });

for (const axis of REFLECTION_AXES) {
  const reflectedRegion = reflectMark(region, axis);
  assert.equal(reflectedRegion.parity, ORIENTATION_PARITY.MIRRORED);
  assert.ok(polygonSignedArea(region.points) * polygonSignedArea(reflectedRegion.points) < 0);
  assert.deepEqual(reflectMark(reflectedRegion, axis), region, `polygon double reflection failed for ${axis}`);

  for (const punch of punches) {
    const reflected = reflectMark(punch, axis);
    assert.equal(reflected.parity, ORIENTATION_PARITY.MIRRORED);
    assertReflectedVertices(punch, axis);
    assert.deepEqual(reflectMark(reflected, axis), punch, `${punch.shape} double reflection failed for ${axis}`);
    assert.equal(markGeometryKey(reflectMark(reflected, axis)), markGeometryKey(punch));
  }
}

const halfTurnTriangle = reflectMark(reflectMark(punches[1], "vertical"), "horizontal");
assert.equal(halfTurnTriangle.parity, ORIENTATION_PARITY.PRESERVED);
assert.deepEqual(halfTurnTriangle.direction, {
  x: -punches[1].direction.x,
  y: -punches[1].direction.y
});

const seed = createPunchMark("circle", { x: 0.17, y: 0.23 }, { radius: 0.02 });
const foldSets = [
  [],
  ["vertical"],
  ["vertical", "horizontal"],
  [{ axis: "vertical" }, { axis: "horizontal" }, { axis: "diag-main" }]
];
const expectedStageCounts = [
  [1],
  [1, 2],
  [1, 2, 4],
  [1, 2, 4, 8]
];

foldSets.forEach((folds, index) => {
  const stages = unfoldMarkStages([seed], folds);
  assert.deepEqual(stages.map((stage) => stage.marks.length), expectedStageCounts[index]);
  stages.forEach((stage) => assert.equal(validateMarks(stage.marks), true));
});

const reverseStages = unfoldMarkStages([seed], ["vertical", "horizontal", "diag-main"]);
assert.deepEqual(reverseStages.map((stage) => stage.axis), [null, "diag-main", "horizontal", "vertical"]);
assert.deepEqual(reverseStages.map((stage) => stage.foldIndex), [null, 2, 1, 0]);
assert.deepEqual(unfoldMarks([seed], ["vertical", "horizontal", "diag-main"]), reverseStages.at(-1).marks);

const mixedStages = unfoldMarkStages([region, ...punches], ["vertical", "horizontal"]);
assert.deepEqual(mixedStages.map((stage) => stage.marks.length), [4, 8, 16]);
const mixedFinal = mixedStages.at(-1).marks;
assert.equal(mixedFinal.filter((mark) => mark.kind === "polygon").length, 4);
for (const shape of PUNCH_SHAPES) {
  assert.equal(mixedFinal.filter((mark) => mark.kind === "punch" && mark.shape === shape).length, 4);
}
assert.equal(mixedFinal.filter((mark) => mark.parity === ORIENTATION_PARITY.PRESERVED).length, 8);
assert.equal(mixedFinal.filter((mark) => mark.parity === ORIENTATION_PARITY.MIRRORED).length, 8);
assert.ok(mixedStages.every((stage) => stage.marks.every(isMarkInPaper)));

const rotatedRegion = createPolygonMark([...region.points.slice(2), ...region.points.slice(0, 2)]);
const reversedRegion = createPolygonMark([...region.points].reverse(), { parity: ORIENTATION_PARITY.MIRRORED });
const dedupedRegionsA = deduplicateMarks([reversedRegion, rotatedRegion, region]);
const dedupedRegionsB = deduplicateMarks([region, rotatedRegion, reversedRegion]);
assert.equal(dedupedRegionsA.length, 1);
assert.deepEqual(dedupedRegionsA, dedupedRegionsB);
assert.equal(dedupedRegionsA[0].parity, ORIENTATION_PARITY.PRESERVED);

const squareQuarterTurn = createPunchMark("square", { x: 0.37, y: 0.39 }, {
  radius: 0.03,
  angle: 0.21 + Math.PI / 2
});
assert.equal(deduplicateMarks([punches[2], squareQuarterTurn]).length, 1);

const triangleThirdTurn = createPunchMark("triangle", { x: 0.31, y: 0.23 }, {
  radius: 0.035,
  angle: 0.37 + Math.PI * 2 / 3
});
assert.equal(deduplicateMarks([punches[1], triangleThirdTurn]).length, 1);

const creaseCircle = createPunchMark("circle", { x: 0.5, y: 0.35 }, { radius: 0.02 });
const creaseStages = unfoldMarkStages([creaseCircle], ["vertical"]);
assert.deepEqual(creaseStages.map((stage) => stage.marks.length), [1, 1]);
assert.equal(creaseStages.at(-1).marks[0].parity, ORIENTATION_PARITY.PRESERVED);

assert.throws(
  () => createPolygonMark([{ x: 0, y: 0 }, { x: 1.01, y: 0 }, { x: 0, y: 1 }]),
  /normalized paper bounds/
);
assert.throws(
  () => createPunchMark("circle", { x: 0.02, y: 0.5 }, { radius: 0.03 }),
  /normalized paper bounds/
);
assert.throws(
  () => createPunchMark("square", { x: 0.98, y: 0.98 }, { radius: 0.08, angle: 0.4 }),
  /normalized paper bounds/
);
assert.throws(() => createPunchMark("hexagon", { x: 0.5, y: 0.5 }), /Unknown punch shape/);
assert.throws(
  () => punchVertices({
    kind: "punch",
    shape: "hexagon",
    center: { x: 0.5, y: 0.5 },
    radius: 0.1,
    direction: { x: 1, y: 0 },
    parity: ORIENTATION_PARITY.PRESERVED
  }),
  /Unknown punch shape/
);
assert.throws(() => unfoldMarkStages([seed], ["skew"]), /Invalid fold at index 0/);

console.log(
  "Paper mark geometry self-test passed: polygon regions; circle, triangle, and square punches; "
  + "1/2/3-fold stages 1/2/4/8; reverse order; deterministic deduplication; bounds; and double-reflection invariants."
);
