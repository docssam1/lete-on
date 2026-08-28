const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const spine = require("../curriculum/us-k8-domain-spine.js");
const map = require("../curriculum/us-k8-cluster-map.js");

const expectedCounts = { K: 9, 1: 11, 2: 10, 3: 11, 4: 12, 5: 11, 6: 10, 7: 10, 8: 10 };

test("the official-id cluster map covers exactly K-8 and all 94 clusters", function () {
  assert.deepEqual(map.gradeOrder, ["K", 1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(map.clusters.length, 94);
  map.grades.forEach(function (row) { assert.equal(row.clusters.length, expectedCounts[row.grade]); });
});

test("every domain in the K-8 spine is represented without an out-of-grade domain", function () {
  map.grades.forEach(function (row) {
    const expected = spine.gradeDomains[row.grade].slice().sort();
    const actual = Array.from(new Set(row.clusters.map(function (cluster) { return cluster.domainCode; }))).sort();
    assert.deepEqual(actual, expected, `grade ${row.grade}`);
  });
});

test("cluster IDs, standard ranges, unit IDs, and bilingual labels are complete and unique", function () {
  assert.equal(new Set(map.clusters.map(function (row) { return row.clusterId; })).size, map.clusters.length);
  assert.equal(new Set(map.clusters.map(function (row) { return row.unitId; })).size, map.clusters.length);
  map.clusters.forEach(function (cluster) {
    assert.match(cluster.clusterId, /^(K|[1-8])\.(CC|OA|NBT|NF|MD|G|RP|NS|EE|SP|F)\.[A-D]$/);
    assert.match(cluster.standardRange, /^(K|[1-8])\.(CC|OA|NBT|NF|MD|G|RP|NS|EE|SP|F)\.[A-D]\.\d+(?:-\d+)?$/);
    assert.ok(cluster.title.ko);
    assert.ok(cluster.title.en);
    assert.equal(cluster.mappingState, "official-id-verified");
    assert.equal(cluster.questionReleaseState, "locked-pending-skill-and-item-review");
  });
});

test("the independently reviewed 94-row manifest is fingerprint locked against silent drift", function () {
  const canonical = map.clusters.map(function (cluster) {
    return [cluster.clusterId, cluster.standardRange, cluster.title.ko, cluster.title.en].join("|");
  }).join("\n");
  assert.equal(
    crypto.createHash("sha256").update(canonical).digest("hex"),
    "17a240ee81c2bdf9f5d9cb7e66b21b099f509286791efd65ea97bba1c82dcd53"
  );
});

test("the map never presents GFIELD order or cut scores as official CCSS policy", function () {
  assert.equal(map.sequencePolicy.owner, "GFIELD");
  assert.equal(map.sequencePolicy.officialSequence, false);
  assert.doesNotMatch(JSON.stringify(map), /official(?:-| )?(?:promotion|placement|cut)/i);
});

test("the source record keeps both official current-site PDFs and avoids inventing a revision date", function () {
  assert.match(map.source.canonicalUrl, /^https:\/\/corestandards\.org\//);
  assert.match(map.source.adaPdfUrl, /ADA-Compliant-Math-Standards\.pdf$/);
  assert.match(map.source.originalPdfUrl, /Math_Standards1\.pdf$/);
  assert.match(map.source.sourceRevision, /revision number not stated/);
  assert.equal(map.source.lastVerified, "2026-08-26");
});
