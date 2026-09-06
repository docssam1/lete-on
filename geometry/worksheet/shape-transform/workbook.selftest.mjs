import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { levels, validateLevels } from "../../games/shape-transform/levels.js";
import { normalizeCount, chooseEntries, groupPages, anchorIndex, edgeLength, drawingQuota, entryHeight, PAGE_CAPACITY } from "./workbook-core.js";
import { deriveDrawing, validateDrawing } from "./drawing-problems.js";

validateLevels();
const sourceSnapshot = JSON.stringify(levels);
assert.equal(normalizeCount(0), 1);
assert.equal(normalizeCount(99), 20);
assert.equal(normalizeCount(20, 10), 10);
assert.equal(normalizeCount(""), 10);
assert.equal(normalizeCount("not-a-number"), 10);
assert.equal(normalizeCount(2.6), 3);
let seed = 20260906;
const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
let selections = 0;
for (let trial = 0; trial < 25; trial += 1) {
  for (const selection of ["1", "2", "3", "4", "5", "all"]) {
    for (let count = 1; count <= 20; count += 1) {
      const entries = chooseEntries(levels, selection, count, random);
      assert.equal(entries.length, selection === "all" ? count : Math.min(10, count));
      assert.equal(new Set(entries.map(({ problem }) => problem.id)).size, entries.length);
      if (selection !== "all") assert.ok(entries.every(({ level }) => String(level.id) === selection));
      for (const page of groupPages(entries)) {
        assert.ok(page.length <= 5);
        assert.equal(new Set(page.map(({ level }) => level.id)).size, 1);
        assert.ok(page.reduce((sum, entry) => sum + entryHeight(entry), 0) <= PAGE_CAPACITY);
      }
      for (const level of levels) {
        const domain = entries.filter((entry) => entry.level.id === level.id);
        const draws = domain.filter((entry) => entry.responseMode === "draw");
        const quota = drawingQuota(domain.length);
        assert.equal(draws.length, quota);
        assert.deepEqual(domain.map((entry) => entry.responseMode), [...Array(domain.length - quota).fill("choice"), ...Array(quota).fill("draw")]);
        if (quota) assert.ok(draws.some((entry) => entry.problem.closed));
        if (quota === 2) assert.ok(draws.some((entry) => !entry.problem.closed));
        for (const entry of draws) assert.equal(entry.problem.id, entry.drawing.id);
      }
      if (selection === "all" && count === 20) {
        assert.deepEqual(groupPages(entries).map((page) => page.length), [4, 4, 4, 4, 4]);
      }
      selections += 1;
    }
  }
}

const derived = levels.flatMap((level) => level.problems.map((problem) => {
  const drawing = deriveDrawing(problem);
  assert.equal(validateDrawing(problem, drawing), true);
  assert.notEqual(drawing.target, problem.target);
  assert.equal(drawing.derivation.kind, "ordered-whole-grid-v1");
  assert.equal(drawing.derivation.sourceProblemId, problem.id);
  assert.equal(Object.hasOwn(drawing, "choices"), false);
  assert.equal(Object.hasOwn(drawing, "answerIndex"), false);
  assert.ok([...drawing.target, ...drawing.answer].every((point) => point.every((value) => value % 10 === 0)));
  const corruptAnswer = structuredClone(drawing);
  corruptAnswer.answer[0][0] += 10;
  assert.throws(() => validateDrawing(problem, corruptAnswer));
  const corruptMetadata = structuredClone(drawing);
  corruptMetadata.derivation.sourceTarget[0][0] += 1;
  assert.throws(() => validateDrawing(problem, corruptMetadata));
  return drawing;
}));
assert.equal(JSON.stringify(levels), sourceSnapshot, "The bank must remain untouched");
await mkdir(new URL("./qa-artifacts/drawing/", import.meta.url), { recursive: true });
await writeFile(new URL("./qa-artifacts/drawing/coordinate-verification.json", import.meta.url), JSON.stringify({ passed: true, sourceCount: 50, negativeControls: 100, drawings: derived }, null, 2));

// Independently check the coordinates used by the worksheet's visual proofs.
for (const level of levels) {
  for (const problem of level.problems) {
    const { operation } = problem;
    const pivot = operation.pivot || [50, 50];
    const { scale = 1, angle = 0, dx = 0, dy = 0 } = operation;
    problem.target.forEach(([x, y], index) => {
      let px = (x - pivot[0]) * scale;
      let py = (y - pivot[1]) * scale;
      if (angle === 90) [px, py] = [-py, px];
      else if (angle === -90) [px, py] = [py, -px];
      else if (Math.abs(angle) === 180) [px, py] = [-px, -py];
      const actual = problem.choices[problem.answerIndex][index];
      assert.ok(Math.abs(actual[0] - (px + pivot[0] + dx)) < .002, problem.id);
      assert.ok(Math.abs(actual[1] - (py + pivot[1] + dy)) < .002, problem.id);
    });
    if (operation.kind === "rotate") {
      const anchor = problem.target[anchorIndex(problem)];
      assert.ok(Math.hypot(anchor[0] - pivot[0], anchor[1] - pivot[1]) > 1);
    }
    if (["enlarge", "reduce"].includes(operation.kind)) {
      assert.ok(Math.abs(edgeLength(problem.choices[problem.answerIndex]) / edgeLength(problem.target) - scale) < .001);
    }
  }
}
console.log(JSON.stringify({ passed: true, selections, bankCoordinateProofs: 50, derivedCoordinateProofs: derived.length, negativeControls: 100, all20DomainPages: 5, withCover: 6 }, null, 2));
