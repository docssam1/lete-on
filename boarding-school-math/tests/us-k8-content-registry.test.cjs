const test = require("node:test");
const assert = require("node:assert/strict");
const registry = require("../curriculum/us-k8-content-registry.js");
const clusterMap = require("../curriculum/us-k8-cluster-map.js");

test("the registry gives every verified K-8 cluster one stable GFIELD unit and anchor skill", function () {
  assert.equal(registry.COURSE_ID, "us-core-k8");
  assert.equal(registry.units.length, 94);
  assert.equal(registry.skills.length, 94);
  assert.deepEqual(new Set(registry.units.map(function (unit) { return unit.clusterId; })), new Set(clusterMap.clusters.map(function (cluster) { return cluster.clusterId; })));
  assert.equal(new Set(registry.units.map(function (unit) { return unit.unitId; })).size, 94);
  assert.equal(new Set(registry.skills.map(function (skill) { return skill.skillId; })).size, 94);
  registry.skills.forEach(function (skill) {
    assert.match(skill.skillId, /^skill:us-core-k8:(?:k|[1-8])-[a-z]+-[a-d]:anchor$/);
    assert.equal(skill.skillScope, "cluster-anchor-not-individual-standard-decomposition");
    assert.equal(skill.standardDecompositionState, "locked-pending-reviewed-skill-breakdown");
    assert.equal(skill.itemReleaseState, "locked-pending-reviewed-item-and-server-signature");
  });
});

test("levels describe evidence intent rather than official cut scores or a numeric difficulty promise", function () {
  assert.deepEqual(registry.levels.map(function (level) { return level.levelId; }), ["foundation", "core", "advanced"]);
  registry.levels.forEach(function (level) {
    assert.ok(level.title.ko);
    assert.ok(level.title.en);
    assert.ok(level.evidenceIntent);
    assert.equal(level.publicationState, "metadata-only");
  });
  assert.doesNotMatch(JSON.stringify(registry.levels), /official|cut.?score|promotion/i);
});

test("a content reference requires one exact course-unit-skill chain and one audience-safe resource", function () {
  const reference = {
    courseId: "us-core-k8",
    unitId: "ccss-6-rp-a",
    skillId: registry.skillIdForCluster("6.RP.A"),
    levelId: "core",
    testType: "unit-screener",
    resourceType: "quiz",
    audience: "student"
  };
  const resolved = registry.resolveLineage(reference);
  assert.equal(resolved.unit.clusterId, "6.RP.A");
  assert.equal(resolved.skill.clusterId, "6.RP.A");
  assert.equal(resolved.resourceType.audience, "student");
  assert.throws(function () {
    registry.resolveLineage(Object.assign({}, reference, { resourceType: "answer-key" }));
  }, /audience is mismatched/);
  assert.throws(function () {
    registry.resolveLineage(Object.assign({}, reference, { skillId: registry.skillIdForCluster("6.NS.A") }));
  }, /lineage is mismatched/);
});

test("registry metadata remains a rights-locked shell without questions or answers", function () {
  const record = registry.buildMetadataRecord({
    courseId: "us-core-k8",
    unitId: "ccss-6-rp-a",
    skillId: registry.skillIdForCluster("6.RP.A"),
    levelId: "foundation",
    testType: "guided-practice",
    resourceType: "guided-practice",
    audience: "student"
  });
  assert.equal(record.publicationState, "locked-pending-source-rights-and-item-review");
  assert.equal(record.sourceRights.mode, "provenance_review");
  assert.doesNotMatch(JSON.stringify(record), /answer|solution|option|prompt/i);
});
