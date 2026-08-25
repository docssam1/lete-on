const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const schemaSource = fs.readFileSync(path.join(root, "data", "question-bank-schema.js"), "utf8");
const context = { globalThis: {} };
vm.runInNewContext(schemaSource, context);
const geometry = context.globalThis.HIGHSELECT_QUESTION_BANK.geometryPipeline;

test("geometry items are regenerated from formal constraints rather than copied images", () => {
  assert.match(geometry.principle, /복제하지 않고/);
  assert.deepEqual(Array.from(geometry.stages), [
    "formalize",
    "validate_constraints",
    "allocate_coordinates",
    "render_svg",
    "solve_independently",
    "verify_unique_answer",
    "audit_visual",
    "owner_approval"
  ]);
  assert.equal(geometry.renderPolicy.format, "svg");
  assert.equal(geometry.renderPolicy.lockOnFailure, true);
});

test("geometry records keep reasoning, provenance, and visual audit fields", () => {
  [
    "entities",
    "relations",
    "givens",
    "target",
    "theoremTrace",
    "answerValidator",
    "visualAudit",
    "sourceLicense",
    "derivativePolicy"
  ].forEach(field => assert.equal(geometry.itemFields.includes(field), true, field));
});

test("reference datasets never become an automatic public asset source", () => {
  const ids = Array.from(geometry.sourceReferences, source => source.id);
  assert.deepEqual(ids, ["geometry3k-intergps", "pgps9k", "geogen", "geoeval", "dl4gps"]);
  geometry.sourceReferences.forEach(source => {
    assert.match(source.productionAssetPolicy, /(직접|원문|구조만|데이터셋으로)/);
  });
  const geoEval = geometry.sourceReferences.find(source => source.id === "geoeval");
  assert.match(geoEval.accessPolicy, /학술 신청/);
});
