const test = require("node:test");
const assert = require("node:assert/strict");
const contract = require("../shared/program-contract.js");
const adapter = require("../adapters/number-magic-adapter.js");

global.window = {};
const threads = require("../../number_magic/data/threads.js");
const courses = require("../../number_magic/data/courses.js");
const result = adapter.adapt(threads, courses.COURSE_SPEC);

test("configured elementary and middle tiers plus locked unassigned threads enter the lineage", function () {
  // The source snapshot includes Phase 3's AD9/elementary-level additions
  // and the new locked middle1 MD47–MD51 sequence. Keep it explicit so a
  // future upstream catalog change must be reviewed rather than silently
  // absorbed.
  assert.equal(result.summary.threads, 122);
  assert.equal(result.summary.levels, 313);
  assert.equal(result.summary.excludedOutOfScope, 37);
  assert.equal(result.threadRows.some(function (row) { return row.legacyThreadId === "MD21"; }), false);
  assert.equal(result.threadRows.some(function (row) { return row.legacyThreadId === "MD43"; }), false);
  assert.equal(result.threadRows.some(function (row) { return row.legacyThreadId === "MD47"; }), true);
  assert.equal(result.threadRows.some(function (row) { return row.legacyThreadId === "MD51"; }), true);
  assert.equal(result.threadRows.some(function (row) { return row.legacyThreadId === "MD52"; }), false);
  assert.equal(result.threadRows.some(function (row) { return row.legacyThreadId === "MD58"; }), false);
});

test("legacy Korean English Chinese labels survive locale normalization", function () {
  result.contentRecords.forEach(function (record) {
    assert.equal(contract.validateLocalizedText(record.title, record.skill), true);
    assert.ok(record.title["zh-Hans"]);
    assert.ok(record.legacy.levelLabel["zh-Hans"]);
  });
});

test("unresolved source lineage stays visible instead of being guessed", function () {
  assert.equal(result.summary.unitLinked, 63);
  assert.equal(result.summary.conceptOnly, 6);
  assert.equal(result.summary.needsUnitMapping, 53);
  assert.equal(result.summary.standardsPending, 122);
  assert.equal(
    result.summary.unitLinked + result.summary.conceptOnly + result.summary.needsUnitMapping,
    result.summary.threads
  );

  const ad9 = result.threadRows.find(function (row) { return row.legacyThreadId === "AD9"; });
  assert.ok(ad9, "the unassigned Phase 3 elementary thread must remain visible for review");
  assert.equal(ad9.mappingState, "concept-only");
  assert.deepEqual(ad9.prerequisiteIds, ["AD3"]);
  assert.deepEqual(ad9.legacyCourseIds, []);
  assert.equal(ad9.levelCount, 2);
  assert.equal(ad9.standardsReview, "pending");
  const ad9Records = result.contentRecords.filter(function (record) { return record.legacy.threadId === "AD9"; });
  assert.equal(ad9Records.length, 2);
  ad9Records.forEach(function (record) {
    assert.equal(record.publicationState, "locked");
    assert.equal(record.standardsReview, "pending");
    assert.equal(contract.canPublishContent(record), false);
  });

  const levelCounts = new Map(result.threadRows.map(function (row) {
    return [row.legacyThreadId, row.levelCount];
  }));
  assert.equal(levelCounts.get("NS1"), 4);
  assert.equal(levelCounts.get("AD3"), 4);
  assert.equal(levelCounts.get("AD4"), 3);

  const md47 = result.threadRows.find(function (row) { return row.legacyThreadId === "MD47"; });
  assert.ok(md47, "the locked middle1 expression thread must remain in the K–8 lineage");
  assert.equal(md47.mappingState, "unit-linked");
  assert.equal(md47.unit, "M-47");
  assert.deepEqual(md47.legacyCourseIds, ["C29"]);
});

test("no legacy item becomes public before provenance and standards review", function () {
  assert.equal(result.summary.publishable, 0);
  result.contentRecords.forEach(function (record) {
    assert.equal(record.publicationState, "locked");
    assert.equal(record.sourceRights.mode, "provenance_review");
    assert.equal(record.standardsReview, "pending");
    assert.equal(contract.canPublishContent(record), false);
  });
});

test("prerequisites and course memberships refer only to real source IDs", function () {
  const ids = new Set(Object.keys(threads));
  const courseIds = new Set(courses.COURSE_SPEC.filter(function (course) {
    return adapter.BOARDING_TIERS.includes(course.tier);
  }).map(function (course) { return `C${course.id}`; }));
  result.threadRows.forEach(function (row) {
    row.prerequisiteIds.forEach(function (id) { assert.ok(ids.has(id)); });
    row.legacyCourseIds.forEach(function (id) { assert.ok(courseIds.has(id), `${id} must exist in COURSE_SPEC`); });
  });
});
