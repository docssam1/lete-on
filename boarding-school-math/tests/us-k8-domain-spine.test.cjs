const test = require("node:test");
const assert = require("node:assert/strict");
const contract = require("../shared/program-contract.js");
const spine = require("../curriculum/us-k8-domain-spine.js");

test("the official K-8 spine contains exactly nine target grades", function () {
  assert.deepEqual(spine.grades.map(function (row) { return row.grade; }), ["K", 1, 2, 3, 4, 5, 6, 7, 8]);
});

test("grade-domain prefixes match the CCSS identifier form", function () {
  spine.grades.forEach(function (row) {
    row.domains.forEach(function (domain) {
      assert.equal(domain.standardPrefix, `${row.grade}.${domain.code}`);
      assert.match(domain.standardPrefix, /^(K|[1-8])\.(CC|OA|NBT|NF|MD|G|RP|NS|EE|SP|F)$/);
    });
  });
});

test("every domain title is Korean-English complete", function () {
  Object.entries(spine.domainTitles).forEach(function (entry) {
    assert.equal(contract.validateLocalizedText(entry[1], `domainTitles.${entry[0]}`), true);
  });
});

test("grade 8 includes functions and excludes the elementary operations domain", function () {
  assert.deepEqual(spine.gradeDomains[8], ["NS", "EE", "F", "G", "SP"]);
});

test("all eight mathematical practices are retained across grades", function () {
  assert.deepEqual(spine.practiceStandards, ["MP.1", "MP.2", "MP.3", "MP.4", "MP.5", "MP.6", "MP.7", "MP.8"]);
});
