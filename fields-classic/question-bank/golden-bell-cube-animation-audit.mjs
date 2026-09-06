import assert from "node:assert/strict";
import "../../geometry/worksheet/generators.js";
import "../../geometry/worksheet/render.js";
import { cubeSourceAnimation, renderCubeSourceFrame } from "./golden-bell-cube-animation.js";

let checked = 0;
for (let code = 1; code < 4 ** 4; code += 1) {
  const heights = Array.from({ length: 4 }, (_, index) => Math.floor(code / (4 ** index)) % 4);
  const map = [heights.slice(0, 2), heights.slice(2)];
  const cubes = map.flatMap((row, z) => row.flatMap((height, x) => Array.from({ length: height }, (_, y) => ({ x, y, z }))));
  const hidden = cubes.filter((cube) => ["x", "y", "z"].every((axis) => cubes.some((other) => other[axis] > cube[axis] && ["x", "y", "z"].filter((name) => name !== axis).every((name) => other[name] === cube[name]))));
  const item = { id: `synthetic-cube-${code}`, prompt: "Count the hidden cubes.", visual: { subtype: "source-hidden-cube", map } };
  const animation = cubeSourceAnimation(item);
  assert.equal(animation.total, cubes.length);
  assert.equal(animation.hidden, hidden.length);
  for (const column of animation.columns) assert.equal(column.hidden, hidden.filter((cube) => cube.x === column.x && cube.z === column.z).length);
  for (let step = 0; step < animation.beats.length; step += 1) {
    const html = renderCubeSourceFrame(animation, step);
    assert.match(html, new RegExp(`data-source-item="${item.id}"`));
    assert.doesNotMatch(html, /NaN|undefined|is-animating/);
    assert.ok(animation.beats[step].durationMs >= 3500);
    if (step === 0) assert.doesNotMatch(html, /ws-iso-top-label/);
    if (step > 0 && step <= animation.columns.length) assert.equal((html.match(/class="ws-iso-top-label"/g) || []).length, step);
  }
  assert.equal(new Set(animation.printSteps).size, animation.printSteps.length);
  assert.ok(animation.printSteps.every((index) => index >= 0 && index < animation.beats.length));
  assert.deepEqual(animation.map, map);
  checked += 1;
}
assert.equal(cubeSourceAnimation({ visual: { subtype: "other" } }), null);
assert.equal(cubeSourceAnimation({ visual: { subtype: "source-hidden-cube", map: [[-1]] } }), null);
assert.throws(() => cubeSourceAnimation({ visual: { subtype: "source-hidden-cube", map: [[1]], expected: { total: 9, hidden: 1, visible: 8 } } }));
console.log(`CUBE_SOURCE_ANIMATION_OK syntheticMaps=${checked} sameProblem=pass hiddenColumns=pass printFrames=pass`);
