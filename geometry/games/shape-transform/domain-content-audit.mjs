import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { levels } from "./levels.js";

// Independent oracle: no production transformation, key, or validator helpers.
export function independentAnswer(problem) {
  const op = problem.operation;
  return problem.target.map(([x, y]) => {
    if (op.kind === "same-bends") return [x, y];
    if (op.kind === "translate") return [x + op.dx, y + op.dy];
    if (op.kind === "rotate") {
      if (op.angle === 90) return [100 - y, x];
      if (op.angle === -90) return [y, 100 - x];
      if (op.angle === 180) return [100 - x, 100 - y];
      throw new Error("Unsupported angle in independent oracle");
    }
    if (op.kind === "enlarge") return [2 * x - 50, 2 * y - 50];
    if (op.kind === "reduce") return [(x + 50) / 2, (y + 50) / 2];
    throw new Error("Unknown domain in independent oracle");
  });
}

const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const edgesOf = (points, closed) => points.slice(0, closed ? points.length : -1).map((p, i) => [p, points[(i + 1) % points.length]]);
const inkKey = (points, closed) => edgesOf(points, closed).map((edge) => edge.map((p) => p.join(",")).sort().join(":")).sort().join(";");
const distance2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
const onSegment = (a, b, p) => cross(a, b, p) === 0 && [0, 1].every((axis) => p[axis] >= Math.min(a[axis], b[axis]) && p[axis] <= Math.max(a[axis], b[axis]));
const area2 = (points) => edgesOf(points, true).reduce((sum, [a, b]) => sum + a[0] * b[1] - a[1] * b[0], 0);

function intersects([a, b], [c, d]) {
  if (onSegment(a, b, c) || onSegment(a, b, d) || onSegment(c, d, a) || onSegment(c, d, b)) return true;
  return Math.sign(cross(a, b, c)) !== Math.sign(cross(a, b, d)) && Math.sign(cross(c, d, a)) !== Math.sign(cross(c, d, b));
}

function inspectPath(points, closed, label, report) {
  assert.ok(Array.isArray(points) && points.length >= (closed ? 4 : 3), `${label}: invalid path`);
  assert.ok(points.every((p) => p.length === 2 && p.every((v) => Number.isFinite(v) && v >= 6 && v <= 94)), `${label}: safe-frame bounds`);
  assert.equal(new Set(points.map((p) => p.join(","))).size, points.length, `${label}: repeated vertex`);
  const edges = edgesOf(points, closed);
  for (const [a, b] of edges) {
    assert.ok((a[0] === b[0]) !== (a[1] === b[1]), `${label}: nonzero orthogonal edge`);
    const length = Math.sqrt(distance2(a, b));
    assert.ok(length >= 4, `${label}: bend too small to distinguish`);
    report.minimumEdgeLength = Math.min(report.minimumEdgeLength, length);
  }
  for (let i = 0; i < edges.length; i++) {
    if (closed || i < edges.length - 1) assert.notEqual(cross(edges[i][0], edges[i][1], edges[(i + 1) % edges.length][1]), 0, `${label}: degenerate bend`);
    for (let j = i + 2; j < edges.length; j++) {
      if (closed && i === 0 && j === edges.length - 1) continue;
      assert.ok(!intersects(edges[i], edges[j]), `${label}: self-intersection`);
      report.segmentPairChecks++;
    }
  }
  if (closed) assert.notEqual(area2(points), 0, `${label}: zero-area polygon`);
  report.paths++;
  for (const value of points.flat()) {
    report.coordinateMin = Math.min(report.coordinateMin, value);
    report.coordinateMax = Math.max(report.coordinateMax, value);
  }
}

function assertDistances(target, choice, factor, label, report) {
  for (let i = 0; i < target.length; i++) {
    for (let j = i + 1; j < target.length; j++) {
      assert.equal(distance2(choice[i], choice[j]), distance2(target[i], target[j]) * factor ** 2, `${label}: pairwise distance invariant`);
      report.distancePairChecks++;
    }
  }
}

function shapeFingerprint(points, closed) {
  const minX = Math.min(...points.map((p) => p[0]));
  const minY = Math.min(...points.map((p) => p[1]));
  const extent = Math.max(...points.map(([x, y]) => Math.max(x - minX, y - minY)));
  return `${closed}:${inkKey(points.map(([x, y]) => [(x - minX) / extent, (y - minY) / extent]), closed)}`;
}

export function auditDomainContent(bank = levels) {
  const kinds = ["same-bends", "translate", "rotate", "enlarge", "reduce"];
  assert.equal(bank.length, 5, "five domains required");
  const report = { problems: 0, paths: 0, segmentPairChecks: 0, distancePairChecks: 0, coordinateMin: Infinity, coordinateMax: -Infinity, minimumEdgeLength: Infinity, distinctSeeds: 0 };
  const ids = new Set(), fingerprints = new Set(), sources = new Set();
  for (const [levelIndex, level] of bank.entries()) {
    assert.equal(level.id, levelIndex + 1);
    assert.equal(level.problems.length, 10);
    const answerPositions = [0, 0, 0];
    for (const [problemIndex, p] of level.problems.entries()) {
      const label = p.id, op = p.operation;
      assert.ok(!ids.has(label), `${label}: duplicate ID`);
      ids.add(label);
      assert.equal(p.level, level.id, `${label}: domain ID`);
      assert.equal(p.closed, problemIndex % 2 === 0, `${label}: polygon/line alternation`);
      assert.equal(op.kind, kinds[levelIndex], `${label}: domain operation`);
      assert.match(p.sourceRef, /^owner-designed-shape-transform-v2-/);
      assert.ok(!sources.has(p.sourceRef), `${label}: distinct source seed`);
      sources.add(p.sourceRef);
      const fields = level.id === 1 ? ["kind"] : level.id === 2 ? ["dx", "dy", "kind"] : level.id === 3 ? ["angle", "kind", "pivot"] : ["kind", "pivot", "scale"];
      assert.deepEqual(Object.keys(op).sort(), fields, `${label}: explicit domain fields only`);
      if (level.id === 2) assert.ok([op.dx, op.dy].every((v) => Number.isFinite(v) && v % 10 === 0) && Math.abs(op.dx) + Math.abs(op.dy) > 0, `${label}: grid vector`);
      if (level.id >= 3) assert.deepEqual(op.pivot, [50, 50], `${label}: fixed pivot`);
      if (level.id === 3) assert.ok([90, -90, 180].includes(op.angle), `${label}: angle`);
      if (level.id >= 4) assert.equal(op.scale, level.id === 4 ? 2 : .5, `${label}: scale factor`);
      const seedKey = shapeFingerprint(p.target, p.closed);
      assert.ok(!fingerprints.has(seedKey), `${label}: seed repeats a translated or uniformly scaled shape`);
      fingerprints.add(seedKey);
      inspectPath(p.target, p.closed, label, report);
      assert.equal(p.choices.length, 3, `${label}: three choices`);
      assert.ok(Number.isInteger(p.answerIndex) && p.answerIndex >= 0 && p.answerIndex < 3, `${label}: answer index`);
      for (const choice of p.choices) {
        assert.equal(choice.length, p.target.length, `${label}: vertex count`);
        inspectPath(choice, p.closed, label, report);
      }
      const keys = p.choices.map((c) => inkKey(c, p.closed));
      assert.equal(new Set(keys).size, 3, `${label}: visually duplicate choices`);
      const expected = independentAnswer(p);
      const expectedInk = inkKey(expected, p.closed);
      assert.equal(keys.filter((key) => key === expectedInk).length, 1, `${label}: independent single answer`);
      assert.equal(keys[p.answerIndex], expectedInk, `${label}: independent answer index`);
      assert.deepEqual(p.choices[p.answerIndex], expected, `${label}: vertex correspondence`);
      answerPositions[p.answerIndex]++;
      const wrong = p.choices.filter((_, i) => i !== p.answerIndex);

      if (level.id === 1) {
        for (const choice of wrong) {
          const changed = choice.flatMap((point, i) => equal(point, p.target[i]) ? [] : [i]);
          assert.equal(changed.length, 2, `${label}: observation changes two bend vertices`);
          const [i, j] = changed;
          assert.ok(i > 0 && j === i + 1 && j < p.target.length - 1, `${label}: observation changes one internal section`);
          const shifts = changed.map((k) => [choice[k][0] - p.target[k][0], choice[k][1] - p.target[k][1]]);
          assert.deepEqual(shifts[0], shifts[1], `${label}: section moves intact`);
          const [sx, sy] = shifts[0];
          assert.ok(sx * (p.target[j][0] - p.target[i][0]) + sy * (p.target[j][1] - p.target[i][1]) === 0, `${label}: perpendicular section offset`);
          assert.ok(Math.hypot(sx, sy) >= 3 && Math.hypot(sx, sy) <= 6, `${label}: subtle visible difference`);
          assert.equal(distance2(choice[i], choice[j]), distance2(p.target[i], p.target[j]), `${label}: shifted section length`);
        }
      } else if (level.id === 2) {
        const offsets = p.choices.map((choice) => {
          assertDistances(p.target, choice, 1, label, report);
          const dx = choice[0][0] - p.target[0][0], dy = choice[0][1] - p.target[0][1];
          assert.ok(dx % 10 === 0 && dy % 10 === 0, `${label}: whole grid steps`);
          choice.forEach(([x, y], i) => assert.deepEqual([x - p.target[i][0], y - p.target[i][1]], [dx, dy], `${label}: common translation vector`));
          if (p.closed) assert.equal(area2(choice), area2(p.target), `${label}: translation signed area`);
          return [dx, dy];
        });
        assert.ok(offsets.some(([dx, dy]) => dx === -op.dx && dy === -op.dy), `${label}: wrong direction`);
        assert.ok(offsets.some(([dx, dy]) => dx * op.dy === dy * op.dx && dx * op.dx + dy * op.dy > 0 && (dx !== op.dx || dy !== op.dy)), `${label}: wrong distance`);
      } else if (level.id === 3) {
        assert.deepEqual(p.target[0], [50, 50], `${label}: visible pivot vertex`);
        assert.ok(wrong.some((c) => equal(c, p.target)), `${label}: unturned distractor`);
        const allowedWrongAngles = op.angle === 180 ? [90, -90] : [-op.angle];
        assert.ok(wrong.some((c) => allowedWrongAngles.some((angle) => equal(c, independentAnswer({ ...p, operation: { ...op, angle } })))), `${label}: wrong-turn distractor`);
        for (const choice of p.choices) {
          assertDistances(p.target, choice, 1, label, report);
          choice.forEach((point, i) => assert.equal(distance2(point, [50, 50]), distance2(p.target[i], [50, 50]), `${label}: pivot radius`));
          if (p.closed) assert.equal(area2(choice), area2(p.target), `${label}: rotation signed area`);
        }
      } else {
        assert.ok(wrong.some((c) => equal(c, p.target)), `${label}: unchanged distractor`);
        const distorted = wrong.find((c) => !equal(c, p.target));
        const axes = [[op.scale, 1], [1, op.scale]].find(([sx, sy]) => distorted.every(([x, y], i) => x - 50 === (p.target[i][0] - 50) * sx && y - 50 === (p.target[i][1] - 50) * sy));
        assert.ok(axes, `${label}: nonuniform axis-scale distractor`);
        assertDistances(p.target, expected, op.scale, label, report);
        assert.ok(edgesOf(p.target, p.closed).some(([a, b]) => a[0] !== b[0]) && edgesOf(p.target, p.closed).some(([a, b]) => a[1] !== b[1]), `${label}: both axes observable`);
        expected.forEach((point, i) => assert.equal(distance2(point, [50, 50]), distance2(p.target[i], [50, 50]) * op.scale ** 2, `${label}: scaled pivot radius`));
        if (p.closed) {
          assert.equal(area2(expected), area2(p.target) * op.scale ** 2, `${label}: scaled area`);
          assert.equal(area2(distorted), area2(p.target) * axes[0] * axes[1], `${label}: distorted area`);
        }
      }
      report.problems++;
    }
    assert.ok(answerPositions.every((n) => n >= 3 && n <= 4), `Level ${level.id}: balanced answer positions`);
  }
  assert.deepEqual([...new Set(bank[2].problems.map((p) => p.operation.angle))].sort((a, b) => a - b), [-90, 90, 180]);
  report.distinctSeeds = fingerprints.size;
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = auditDomainContent();
  console.log("Shape-transform independent domain audit passed:");
  console.log(JSON.stringify(report, null, 2));
}
