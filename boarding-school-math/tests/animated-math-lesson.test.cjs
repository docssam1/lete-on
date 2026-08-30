const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
require(path.resolve(root, "..", "geometry", "worksheet", "render.js"));
const source = require(path.join(root, "learning", "animated-math-lessons.js"));
const scenes = require(path.join(root, "learning", "animated-math-scene-model.js"));

test("catalog contains six GFIELD-authored multilingual concept samples", function () {
  assert.equal(source.schemaVersion, 5);
  assert.deepEqual(source.lessons.map(function (lesson) { return lesson.type; }), ["bar-model", "fraction-strip", "factor-chain", "signed-number-line", "expression-tree", "geometry-angle"]);
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

test("ratio, fraction, GCF, signed-rational, and geometry answers are independently recomputed and unique", function () {
  const ratioSolutions = [];
  for (let a = 0; a <= 20; a += 1) {
    for (let b = 0; b <= 20; b += 1) {
      if (a + 3 * a === 20 && b + 4 * b === 20) ratioSolutions.push(a + b);
    }
  }
  assert.deepEqual(ratioSolutions, [9]);
  const fractionSolutions = [];
  for (let groups = 0; groups <= 16; groups += 1) {
    if (groups * 1 / 8 === 3 / 4) fractionSolutions.push(groups);
  }
  assert.deepEqual(fractionSolutions, [6]);
  assert.equal((3 / 4) / (1 / 8), 6);
  const common = [];
  for (let factor = 1; factor <= 84; factor += 1) if (84 % factor === 0 && 60 % factor === 0) common.push(factor);
  assert.deepEqual(common, [1, 2, 3, 4, 6, 12]);
  assert.equal(Math.max.apply(Math, common), 12);
  assert.equal(-7 * 3, -21);
  assert.equal(-5 * 4, -20);
  assert.ok(-21 < -20);
  assert.ok(-7 / 4 < -5 / 3);
  const baseAngle = (180 - 40) / 2;
  assert.equal(baseAngle, 70);
  assert.equal(40 + baseAngle + baseAngle, 180);
});

test("signed-rational scene positions and distances are calculated from one exact tick model", function () {
  const lesson = source.lessons.find(function (item) { return item.type === "signed-number-line"; });
  const model = scenes.buildSignedNumberLineModel(lesson.sceneModel);
  assert.equal(model.tickDenominator, 12);
  assert.equal(model.minUnit, -24);
  assert.equal(model.maxUnit, 0);
  assert.equal(model.ticks.length, 25);
  assert.equal(model.firstUnit, -21);
  assert.equal(model.secondUnit, -20);
  assert.equal(model.firstDistanceUnits, 21);
  assert.equal(model.secondDistanceUnits, 20);
  assert.ok(model.firstX < model.secondX);
  assert.ok(model.secondX < model.zeroX);
  const expectedStep = (model.right - model.left) / 24;
  assert.ok(Math.abs((model.secondX - model.firstX) - expectedStep) < 1e-9);
  const markup = scenes.signedNumberLineScene(lesson);
  assert.match(markup, /signed-number-line-svg/);
  assert.match(markup, /data-object="signed-point-a"/);
  assert.match(markup, /-7\/4 = -21\/12/);
  assert.match(markup, /data-object="signed-answer">-7\/4 &lt; -5\/3/);
  assert.match(lesson.beats.find(function (beat) { return beat.id === "signed-point-a"; }).narrationI18n.ko, /-1과 -2 사이/);
  assert.doesNotMatch(JSON.stringify(lesson.beats), /-1과 -3\/4 사이|-1과 -2\/3 사이/);
  assert.equal(scenes.sceneFor(lesson), markup);
});

test("expression tree is calculated from one exact nested-operation model", function () {
  const lesson = source.lessons.find(function (item) { return item.type === "expression-tree"; });
  const model = scenes.buildExpressionStructureModel(lesson.sceneModel);
  assert.deepEqual({ power: model.powerResult, inside: model.insideResult, product: model.productResult, answer: model.answer, distributed: model.distributedResult }, { power: 8, inside: 12, product: 36, answer: 31, distributed: 31 });
  assert.equal(model.coefficient * (model.powerResult + model.insideAddend) + model.outsideAddend, model.answer);
  assert.equal(model.coefficient * model.powerResult + model.coefficient * model.insideAddend + model.outsideAddend, model.answer);
  const markup = scenes.expressionScene(lesson, "ko");
  assert.match(markup, /data-object="expr-original"/);
  assert.match(markup, /data-object="expr-distribute"/);
  assert.match(markup, /data-object="expr-answer"/);
  assert.match(markup, /식의 값/);
  assert.match(markup, /거듭제곱/);
  assert.match(markup, /괄호 안/);
  assert.doesNotMatch(markup, /POWER|PARENTHESES|MULTIPLY|SUBTRACT/);
  assert.equal(scenes.sceneFor(lesson, "ko"), markup);
});

test("GCF scene is generated from factor arrays and an exact remainder chain", function () {
  const lesson = source.lessons.find(function (item) { return item.type === "factor-chain"; });
  assert.deepEqual(lesson.sceneModel.primeFactors, { 60: [2, 2, 3, 5], 84: [2, 2, 3, 7] });
  assert.deepEqual(lesson.sceneModel.commonFactors, [2, 2, 3]);
  lesson.sceneModel.euclideanChain.forEach(function (step) { assert.equal(step.dividend, step.divisor * step.quotient + step.remainder); });
  const markup = scenes.factorScene(lesson);
  assert.equal((markup.match(/class="factor-row/g) || []).length, 2);
  assert.match(markup, /84 = 60 × 1 \+ 24/);
  assert.match(markup, /data-object="gcf-answer"/);
  assert.equal(scenes.sceneFor(lesson), markup);
});

test("fraction scene is an eight-part model with six highlighted divisor-sized groups", function () {
  const lesson = source.lessons.find(function (item) { return item.type === "fraction-strip"; });
  assert.deepEqual(lesson.sceneModel, { wholeParts: 8, shadedParts: 6, divisorParts: 1, quotient: 6, dividend: { n: 3, d: 4 }, divisor: { n: 1, d: 8 } });
  const markup = scenes.fractionScene(lesson);
  assert.equal((markup.match(/class="fraction-cell/g) || []).length, 8);
  assert.equal((markup.match(/is-shaded/g) || []).length, 6);
  assert.match(markup, /data-object="frac-answer"/);
  assert.equal(scenes.sceneFor(lesson), markup);
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
  assert.match(fs.readFileSync(path.join(root, "animated-math.html"), "utf8"), /Six ways to make reasoning visible/);
  assert.match(fs.readFileSync(path.join(root, "animated-math.css"), "utf8"), /@media print/);
  assert.match(fs.readFileSync(path.join(root, "animated-math.css"), "utf8"), /prefers-reduced-motion:\s*reduce/);
});
