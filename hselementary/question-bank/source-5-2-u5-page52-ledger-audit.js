"use strict";
const assert = require("node:assert/strict");
const { sourceItems } = require("./source-inventory/5-2-source-items.json");
const lookup = id => {
  const matches = sourceItems.filter(item => item.sourceItemId === `5-2-u5-e3-${id}`);
  assert.equal(matches.length, 1, id);
  return matches[0];
};
for (const id of ["exploration", "example-1", "example-2", "example-3", "example-4"]) {
  const item = lookup(id);
  assert.equal(item.pdfPage, 48);
  assert.equal(item.printedPage, 52);
  assert.equal(item.implementationStatus, ["example-1", "example-2", "example-3", "example-4"].includes(id) ? "verified-local" : "review-locked");
  assert.equal(item.sourceVerified, ["example-1", "example-2", "example-3", "example-4"].includes(id));
  if (id === "example-4") assert.equal(item.runtimeTypeId, "5-2-u5-e3-example-3-4");
  if (!["example-1", "example-2", "example-3", "example-4"].includes(id)) assert.equal(item.answerContract, "candidate: drawing");
  if (id === "example-3") assert.equal(item.runtimeTypeId, "5-2-u5-e3-example-3-3");
  if (id === "example-1") assert.equal(item.runtimeTypeId, "5-2-u5-e3-example-3-1");
  if (id === "example-2") assert.equal(item.runtimeTypeId, "5-2-u5-e3-example-3-2");
}
for (let n = 1; n <= 6; n++) {
  const item = lookup(`mission-${n}`);
  assert.equal(item.pdfPage, 49);
  assert.equal(item.printedPage, 53);
  if ([1, 3, 4].includes(n)) { assert.equal(item.sourceVerified, true); assert.equal(item.runtimeTypeId, `5-2-u5-e3-mission-${n}`); }
}
console.log("PASS: 52–53 source locators, verified examples 3-1 through 3-4 and remaining source locks");
