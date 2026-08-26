const test = require("node:test");
const assert = require("node:assert/strict");
const contract = require("../shared/program-contract.js");
const adapter = require("../adapters/number-magic-adapter.js");

global.window = {};
const threads = require("../../number_magic/data/threads.js");
const courses = require("../../number_magic/data/courses.js");
const result = adapter.adapt(threads, courses.COURSE_SPEC);

test("all 142 legacy threads and 371 levels enter the common lineage", function () {
  assert.equal(result.summary.threads, 142);
  assert.equal(result.summary.levels, 371);
  assert.equal(result.threadRows.length, Object.keys(threads).length);
  assert.equal(result.contentRecords.length, Object.values(threads).reduce(function (count, thread) { return count + thread.levels.length; }, 0));
});

test("legacy Korean English Chinese labels survive locale normalization", function () {
  result.contentRecords.forEach(function (record) {
    assert.equal(contract.validateLocalizedText(record.title, record.skill), true);
    assert.ok(record.title["zh-Hans"]);
    assert.ok(record.legacy.levelLabel["zh-Hans"]);
  });
});

test("unresolved source lineage stays visible instead of being guessed", function () {
  assert.equal(result.summary.unitLinked, 84);
  assert.equal(result.summary.conceptOnly, 5);
  assert.equal(result.summary.needsUnitMapping, 53);
  assert.equal(result.summary.standardsPending, 142);
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
  const courseIds = new Set(courses.COURSE_SPEC.map(function (course) { return `C${course.id}`; }));
  result.threadRows.forEach(function (row) {
    row.prerequisiteIds.forEach(function (id) { assert.ok(ids.has(id)); });
    row.legacyCourseIds.forEach(function (id) { assert.ok(courseIds.has(id), `${id} must exist in COURSE_SPEC`); });
  });
});
