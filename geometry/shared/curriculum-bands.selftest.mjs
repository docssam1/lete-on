import assert from "node:assert/strict";
import fs from "node:fs";
import { activityBands, curriculumBands, excludedConcepts } from "./curriculum-bands.js";

assert.deepEqual(Object.keys(curriculumBands), ["facto1", "1031-intro-entry", "1031-basic"]);
assert.equal(Object.keys(activityBands["mirror-manor"]).length, 5);
assert.equal(Object.keys(activityBands.geoboard).length, 5);
assert.equal(curriculumBands["1031-intro-entry"].ko, "1031 입문 · 입문");
assert.deepEqual(excludedConcepts, ["similarity", "scale-up", "scale-down"]);

const publicMapCopy = [
  fs.readFileSync(new URL("../world-map/app.js", import.meta.url), "utf8"),
  fs.readFileSync(new URL("../world-map/world-3d.js", import.meta.url), "utf8")
].join("\n").toLowerCase();

for (const term of ["닮음", "相似", "similarity"]) {
  assert.equal(publicMapCopy.includes(term.toLowerCase()), false, `public roadmap still exposes ${term}`);
}

console.log("Geometry curriculum bands passed: 3 bands, 10 mapped activities, similarity excluded.");
