const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const paths = require(path.join(root, "learning", "clinic-paths.js"));
const concepts = require(path.join(root, "learning", "grade6-concept-lessons.js"));
const animated = require(path.join(root, "learning", "animated-math-lessons.js"));

test("all reviewed Grade 6 clusters receive a private-data-free concept route", function () {
  assert.equal(concepts.lessons.length, 10);
  concepts.lessons.forEach(function (lesson) {
    const clusterId = lesson.lineage.clusterId;
    const route = paths.routeFor(clusterId, { fromDiagnostic: true });
    assert.equal(route.clusterId, clusterId);
    assert.equal(route.source, "diagnostic-reviewed-route");
    assert.equal(route.concept.url, `./concept-learning.html?cluster=${encodeURIComponent(clusterId)}&from=diagnostic`);
    assert.equal(/studentId|attemptId|answerKey|correctAnswer|solutionText/i.test(JSON.stringify(route)), false);
  });
});

test("6.RP.A and 6.NS.A open reviewed workbooks with completion-gated rechecks", function () {
  ["6.RP.A", "6.NS.A"].forEach(function (cluster) {
    const before = paths.routeFor(cluster, { fromDiagnostic: true, workbookCompleted: false });
    assert.equal(before.workbook.state, "available");
    assert.equal(before.workbook.url, `./clinic-practice.html?cluster=${cluster}&mode=workbook&audience=student&locale=ko`);
    assert.equal(before.recheck.state, "locked-after-learning");
    assert.equal(before.recheck.url, "");
    const after = paths.routeFor(cluster, { fromDiagnostic: true, workbookCompleted: true });
    assert.equal(after.recheck.state, "available");
    assert.equal(after.recheck.url, `./clinic-practice.html?cluster=${cluster}&mode=recheck&audience=student&locale=ko`);
    assert.equal(paths.completionKey(cluster), `gfield-clinic-workbook:${cluster}:v1`);
  });

  const geometry = paths.routeFor("6.G.A", { workbookCompleted: true });
  assert.equal(geometry.workbook.state, "review-pending");
  assert.equal(geometry.recheck.state, "review-pending");
});

test("only exact cluster matches open the two reviewed animated clinic lessons", function () {
  assert.equal(paths.validateAnimatedMapping(animated.lessons), true);
  const ratio = paths.routeFor("6.RP.A", { fromDiagnostic: true });
  assert.equal(ratio.animated.state, "available");
  assert.equal(ratio.animated.lessonId, "common-total-ratio");
  assert.equal(ratio.animated.url, "./animated-math.html?lesson=common-total-ratio&cluster=6.RP.A&locale=ko");
  const fractions = paths.routeFor("6.NS.A", { fromDiagnostic: true });
  assert.equal(fractions.animated.state, "available");
  assert.equal(fractions.animated.lessonId, "fraction-division-eighths");
  assert.equal(fractions.animated.url, "./animated-math.html?lesson=fraction-division-eighths&cluster=6.NS.A&locale=ko");

  const geometry = paths.routeFor("6.G.A", { fromDiagnostic: true });
  assert.equal(geometry.animated.state, "review-pending");
  assert.equal(geometry.animated.url, "");
  assert.notEqual(animated.lessons.find(function (lesson) { return lesson.id === "isosceles-angle"; }).conceptClusterId, "6.G.A");
});

test("a false concept-to-animation mapping fails the exact-match validator", function () {
  const badCatalog = animated.lessons.map(function (lesson) {
    if (lesson.id !== "common-total-ratio") return lesson;
    return Object.assign({}, lesson, { conceptClusterId: "6.G.A" });
  });
  assert.throws(function () { paths.validateAnimatedMapping(badCatalog); }, /cluster mismatch/);
});

test("unsupported or injected cluster identifiers are rejected", function () {
  ["6.G.A&studentId=123", "6.MP.A", "7.RP.A", "", "../../admin.html"].forEach(function (clusterId) {
    assert.throws(function () { paths.routeFor(clusterId, { fromDiagnostic: true }); }, /unsupported/);
  });
});

test("diagnostic runner preserves the reviewed-route marker", function () {
  const runner = fs.readFileSync(path.join(root, "diagnostic-runner.js"), "utf8");
  assert.match(runner, /GFIELDClinicPaths\.conceptUrl\(route\.clusterId, true\)/);
  assert.match(runner, /from=diagnostic/);
});
