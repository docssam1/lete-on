const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
require(path.resolve(root, "..", "geometry", "worksheet", "render.js"));
const source = require(path.join(root, "learning", "animated-math-lessons.js"));
const scenes = require(path.join(root, "learning", "animated-math-scene-model.js"));

test("catalog contains two GFIELD-authored multilingual concept samples", function () {
  assert.equal(source.schemaVersion, 2);
  assert.deepEqual(source.lessons.map(function (lesson) { return lesson.type; }), ["bar-model", "geometry-angle"]);
  source.lessons.forEach(function (lesson) {
    assert.deepEqual(lesson.languages, ["en", "ko", "zh"]);
    assert.equal(lesson.rights.assetRights, "original");
    assert.equal(lesson.rights.containsThirdPartyAssets, false);
    assert.equal(lesson.deliveryMode, "concept-open");
  });
});

test("each beat creates at most one new conceptual object and clears stale focus", function () {
  source.lessons.forEach(function (lesson) {
    const ids = new Set(lesson.objectIds);
    const introduced = new Set();
    lesson.beats.forEach(function (beat) {
      assert.ok(beat.durationMs >= 400);
      assert.deepEqual(Object.keys(beat.narrationI18n).sort(), ["en", "ko", "zh"]);
      Object.values(beat.narrationI18n).forEach(function (line) { assert.ok(line.length > 8); });
      beat.targetIds.forEach(function (id) { assert.ok(ids.has(id), `${lesson.id} has target ${id}`); });
      beat.visibleIds.forEach(function (id) { assert.ok(ids.has(id), `${lesson.id} shows ${id}`); });
      const draw = beat.actions.find(function (action) { return action.type === "draw"; });
      if (draw) {
        assert.equal(draw.targetIds.length, 1, `${lesson.id}/${beat.id} has one gaze target`);
        assert.equal(introduced.has(draw.targetIds[0]), false, `${draw.targetIds[0]} is newly drawn once`);
        introduced.add(draw.targetIds[0]);
      }
      if (beat.actions[0].type === "highlight") assert.equal(beat.targetIds.length, 1);
    });
    assert.deepEqual(Array.from(introduced).sort(), lesson.objectIds.slice().sort());
    assert.deepEqual(lesson.finalOverview.visibleObjectIds, lesson.objectIds);
  });
});

test("answers stay hidden until their declared answer beat", function () {
  source.lessons.forEach(function (lesson) {
    const answerIndex = lesson.beats.findIndex(function (beat) { return beat.id === lesson.answerBeatId; });
    const answerId = lesson.objectIds.find(function (id) { return id.endsWith("answer"); });
    assert.ok(answerIndex > 0);
    lesson.beats.slice(0, answerIndex).forEach(function (beat) {
      assert.equal(beat.visibleIds.includes(answerId), false);
      assert.equal(beat.targetIds.includes(answerId), false);
    });
    assert.equal(lesson.beats[answerIndex].targetIds[0], answerId);
  });
});

test("ratio and geometry answers are independently recomputed and unique", function () {
  const ratioSolutions = [];
  for (let a = 0; a <= 20; a += 1) {
    for (let b = 0; b <= 20; b += 1) {
      if (a + 3 * a === 20 && b + 4 * b === 20) ratioSolutions.push(a + b);
    }
  }
  assert.deepEqual(ratioSolutions, [9]);
  const baseAngle = (180 - 40) / 2;
  assert.equal(baseAngle, 70);
  assert.equal(40 + baseAngle + baseAngle, 180);
});

test("geometry is calculated from a point-segment model and shared renderer", function () {
  const lesson = source.lessons.find(function (item) { return item.type === "geometry-angle"; });
  const model = scenes.buildIsoscelesModel(lesson.sceneModel);
  function distanceToLine(point, a, b) {
    return Math.abs((b.x - a.x) * (a.y - point.y) - (a.x - point.x) * (b.y - a.y)) / Math.hypot(b.x - a.x, b.y - a.y);
  }
  function triangleContains(point, a, b, c) {
    function sign(p1, p2, p3) { return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y); }
    const d1 = sign(point, a, b), d2 = sign(point, b, c), d3 = sign(point, c, a);
    return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
  }
  assert.ok(Math.abs(model.sideLengths.AB - model.sideLengths.AC) < 1e-9);
  const BA = { x: model.points.A.x - model.points.B.x, y: model.points.A.y - model.points.B.y };
  const BC = { x: model.points.C.x - model.points.B.x, y: model.points.C.y - model.points.B.y };
  const angleB = Math.acos((BA.x * BC.x + BA.y * BC.y) / (Math.hypot(BA.x, BA.y) * Math.hypot(BC.x, BC.y))) * 180 / Math.PI;
  assert.ok(Math.abs(angleB - 70) < 1e-9);
  assert.ok(Math.abs(model.angles.A.measureDeg - 40) < 1e-9);
  assert.ok(Math.abs(model.angles.B.measureDeg - 70) < 1e-9);
  assert.ok(Math.abs(model.angles.C.measureDeg - 70) < 1e-9);
  assert.ok(Math.abs(distanceToLine(model.angles.A.label, model.points.A, model.points.B) - distanceToLine(model.angles.A.label, model.points.A, model.points.C)) < 1e-9);
  assert.ok(Math.abs(distanceToLine(model.angles.B.label, model.points.B, model.points.A) - distanceToLine(model.angles.B.label, model.points.B, model.points.C)) < 1e-9);
  assert.ok(Math.abs(distanceToLine(model.angles.C.label, model.points.C, model.points.A) - distanceToLine(model.angles.C.label, model.points.C, model.points.B)) < 1e-9);
  ["A", "B", "C"].forEach(function (key) {
    assert.equal(triangleContains(model.angles[key].label, model.points.A, model.points.B, model.points.C), true, `${key} angle label is inside the triangle`);
    assert.equal(triangleContains(model.pointLabels[key], model.points.A, model.points.B, model.points.C), false, `${key} point label is outside the triangle`);
  });
  const markup = scenes.geometryScene(lesson);
  assert.match(markup, /geometry-model-svg/);
  assert.match(markup, /data-object="geo-triangle"/);
  assert.match(markup, /text-anchor="middle" dominant-baseline="middle"/);
  assert.equal(/x1="380" y1="42"/.test(fs.readFileSync(path.join(root, "animated-math.js"), "utf8")), false);
  assert.match(fs.readFileSync(path.join(root, "animated-math.html"), "utf8"), /\.\.\/geometry\/worksheet\/render\.js/);
});

test("public shell exposes no private contest assets and keeps accessibility paths", function () {
  const files = ["animated-math.html", "animated-math.js", "learning/animated-math-lessons.js", "learning/animated-math-scene-model.js"];
  const bundle = files.map(function (file) { return fs.readFileSync(path.join(root, file), "utf8"); }).join("\n");
  ["SASMO 2019", "private-sources", "question-images", "third-party demo"].forEach(function (token) { assert.equal(bundle.includes(token), false); });
  assert.match(bundle, /lesson-language/);
  assert.match(bundle, /captions-toggle/);
  assert.match(fs.readFileSync(path.join(root, "animated-math.css"), "utf8"), /@media print/);
  assert.match(fs.readFileSync(path.join(root, "animated-math.css"), "utf8"), /prefers-reduced-motion:\s*reduce/);
});
