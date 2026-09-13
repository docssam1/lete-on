import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { GENERATORS } from "./generators.js";

const difficulties = [1, 2, 3];
const sequenceGenerators = [
  "fourShapeCycle",
  "fourItemCycleWithDuplicate"
];

for (const generatorName of sequenceGenerators) {
  const generate = GENERATORS[generatorName];
  assert.equal(typeof generate, "function", `${generatorName}: generator missing`);
  for (const difficulty of difficulties) {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const question = generate({ difficulty });
      const { cycle, items, target, answerShape, previewCount } = question.meta;
      assert.equal(cycle.length, 4, `${generatorName}: cycle must contain four positions`);
      assert.ok(previewCount >= cycle.length * 2 + 1, `${generatorName}: fewer than two cycles and one extra item`);
      assert.equal(items.length, previewCount, `${generatorName}: preview length mismatch`);
      assert.deepEqual(items.slice(0, cycle.length), cycle, `${generatorName}: first cycle mismatch`);
      assert.deepEqual(items.slice(cycle.length, cycle.length * 2), cycle, `${generatorName}: second cycle mismatch`);
      assert.equal(answerShape.name, cycle[(target - 1) % cycle.length].name, `${generatorName}: target answer mismatch`);
    }
  }
}

for (const difficulty of difficulties) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const question = GENERATORS.trianglePositionCycle({ difficulty });
    const { cycle, shown, target, answerPosition } = question.meta;
    assert.equal(cycle.length, 4, "trianglePositionCycle: cycle must contain four positions");
    assert.ok(shown >= cycle.length * 2 + 1, "trianglePositionCycle: fewer than two cycles and one extra item");
    assert.equal(question.visual.sequence.length, shown, "trianglePositionCycle: preview length mismatch");
    assert.equal(answerPosition, cycle[(target - 1) % cycle.length], "trianglePositionCycle: target answer mismatch");
  }
}

for (const difficulty of difficulties) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const question = GENERATORS.g1StackedShapeDualCycle({ difficulty });
    const { shapes, counts, target, shape, count, previewCount } = question.meta;
    const minimumPreview = Math.max(shapes.length, counts.length) * 2 + 1;
    assert.ok(previewCount >= minimumPreview, "g1StackedShapeDualCycle: an independent cycle is not visible twice");
    assert.equal(question.visual.items.length, previewCount, "g1StackedShapeDualCycle: preview length mismatch");
    assert.equal(shape, shapes[(target - 1) % shapes.length], "g1StackedShapeDualCycle: shape answer mismatch");
    assert.equal(count, counts[(target - 1) % counts.length], "g1StackedShapeDualCycle: count answer mismatch");
  }
}

const appSource = await readFile(new URL("./app.js", import.meta.url), "utf8");
assert.ok(
  !appSource.includes('pieces("square", visual.starRectangles)'),
  "balanceRelationsMarkup: rectangle is rendered as square"
);
assert.ok(
  appSource.includes('pieces("rectangle", visual.starRectangles)'),
  "balanceRelationsMarkup: rectangle renderer missing"
);

const styleSource = await readFile(new URL("./styles.css", import.meta.url), "utf8");
assert.ok(
  !styleSource.includes(".g1-stacked-cycle section:nth-child(n+8){display:none}"),
  "g1StackedShapeDualCycle: mobile or print CSS hides the second cycle"
);

console.log("PATTERN_VISIBILITY_AUDIT_OK");
