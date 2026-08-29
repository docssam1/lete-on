const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const source = require(path.join(root, "learning", "animated-math-lessons.js"));

test("animated lesson catalog contains original ratio and geometry samples", function () {
  assert.equal(source.schemaVersion, 1);
  assert.deepEqual(source.lessons.map(function (lesson) { return lesson.type; }), ["bar-model", "geometry-angle"]);
  assert.deepEqual(source.lessons.map(function (lesson) { return lesson.verifiedAnswer; }), ["9 tokens", "70°"]);
});

test("every animated lesson has one canonical verified beat sequence", function () {
  source.lessons.forEach(function (lesson) {
    const beatIds = lesson.beats.map(function (beat) { return beat.id; });
    const objectIds = new Set(lesson.objectIds);
    assert.equal(objectIds.size, lesson.objectIds.length, `${lesson.id} object ids are unique`);
    assert.deepEqual(lesson.fullPlayBeatIds, beatIds);
    assert.deepEqual(lesson.stepByStepBeatIds, beatIds);
    assert.equal(new Set(beatIds).size, beatIds.length);
    assert.ok(beatIds.includes(lesson.answerBeatId));
    lesson.beats.forEach(function (beat) {
      assert.ok(beat.durationMs >= 400);
      assert.ok(beat.narration.length > 20);
      beat.targetIds.forEach(function (id) { assert.ok(objectIds.has(id), `${lesson.id} has target ${id}`); });
      beat.visibleIds.forEach(function (id) { assert.ok(objectIds.has(id), `${lesson.id} shows ${id}`); });
    });
    const answerIndex = beatIds.indexOf(lesson.answerBeatId);
    const answerId = lesson.objectIds.find(function (id) { return id.endsWith("answer"); });
    lesson.beats.slice(0, answerIndex).forEach(function (beat) {
      assert.equal(beat.targetIds.includes(answerId), false, `${lesson.id} answer target leaked early`);
      assert.equal(beat.visibleIds.includes(answerId), false, `${lesson.id} answer visibility leaked early`);
    });
    assert.ok(lesson.beats[answerIndex].targetIds.includes(answerId));
    assert.ok(lesson.beats[answerIndex].visibleIds.includes(answerId));
    assert.equal(lesson.mathChecks.length, 2);
  });
});

test("public lesson shell exposes no private contest assets or external skill branding", function () {
  const html = fs.readFileSync(path.join(root, "animated-math.html"), "utf8");
  const js = fs.readFileSync(path.join(root, "animated-math.js"), "utf8");
  const data = fs.readFileSync(path.join(root, "learning", "animated-math-lessons.js"), "utf8");
  assert.match(html, /GFIELD authored samples/);
  assert.match(html, /Play full lesson/);
  assert.match(html, /Step-by-step/);
  assert.match(html, /Teacher view/);
  ["SASMO 2019", "private-sources", "question-images", "third-party demo"].forEach(function (token) {
    assert.equal(`${html}\n${js}\n${data}`.includes(token), false, `public demo leaked ${token}`);
  });
});

test("animated lesson CSS preserves a reduced-motion path", function () {
  const css = fs.readFileSync(path.join(root, "animated-math.css"), "utf8");
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /transition:\s*none\s*!important/);
});

test("GitHub skill package includes human-facing usage proof", function () {
  const skill = path.resolve(root, "..", "skills", "gmap-animated-math-lesson");
  const readme = fs.readFileSync(path.join(skill, "README.md"), "utf8");
  assert.match(readme, /실제 사용 화면/);
  assert.match(readme, /gmap-animated-lesson-demo\.mp4/);
  ["ratio-answer.png", "geometry-step.png", "gmap-animated-lesson-demo.mp4"].forEach(function (file) {
    assert.equal(fs.existsSync(path.join(skill, "assets", file)), true, `missing skill asset ${file}`);
  });
});
