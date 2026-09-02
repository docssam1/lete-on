const test = require("node:test");
const assert = require("node:assert/strict");
const catalog = require("../competition/sasmo-mock-catalog.js");
const readiness = require("../assessment/sasmo-mock-readiness.js");

test("the public SASMO mock catalogue exposes a validated score map without contest content", function () {
  const form = catalog.getForm("sasmo-2019-g6-baseline-a");
  assert.ok(form);
  assert.equal(readiness.validateForm(form), true);
  assert.equal(form.items.length, 25);
  const serialized = JSON.stringify(form);
  assert.doesNotMatch(serialized, /answer|option|questionText|sourceLocator|\.pdf/i);
  assert.equal(catalog.availableFor("G6").length, 1);
});
