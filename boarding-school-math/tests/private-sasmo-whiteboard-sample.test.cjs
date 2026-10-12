"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const renderer = require("../scripts/render-private-sasmo-whiteboard-sample.cjs");

function lesson(number) {
  const mathByQuestion = {
    6: ["angle ADE = 90 deg + 60 deg = 150 deg", "angle EAD = (180 deg - 150 deg) / 2 = 15 deg", "angle EAC = 45 deg - 15 deg = 30 deg"],
    7: ["A=2 blocks, B=4 blocks, D=4 blocks", "C = (2 + 4) ÷ 2 = 3 blocks", "1 small block = 10 coins", "(2 + 4 + 3 + 4) × 10 = 130 coins"],
    16: ["classes: 1-part, 4-part, 9-part", "19 small, 10 medium, 3 large", "19 + 10 + 3 = 32"],
    20: ["A=1/4, B=1/5, C=2/7 of total", "A=35u, B=28u, C=40u", "D=140-35-28-40=37u", "40u-37u=3u=3 candies; total=140"]
  };
  const answerByQuestion = {
    6: { kind: "option-id", value: "D", display: "Option D: 30 degrees" },
    7: { kind: "option-id", value: "B", display: "Option B: 130 coins" },
    16: { kind: "numeric-exact", value: "32", display: "32 triangles" },
    20: { kind: "numeric-exact", value: "140", display: "140 candies" }
  };
  return {
    itemId: `sasmo-2019-g6-q${String(number).padStart(2, "0")}`,
    questionNumber: number,
    title: `Verified sample ${number}`,
    conceptGoal: "Represent the verified mathematical relationships before calculating.",
    steps: mathByQuestion[number].map(function (math, index) {
      return { label: `Verified step ${index + 1}`, explanation: "Use the source conditions and independently checked model.", math };
    }),
    whyItWorks: "Equivalent relationships preserve the source conditions.",
    commonMistake: "Do not choose a method before identifying every quantity.",
    finalAnswer: answerByQuestion[number],
    verification: { sourceDiagramRequired: number === 6 || number === 16 }
  };
}

function concept() {
  return {
    conceptId: "ratio-common-totals",
    title: "Part-to-Whole Ratios and Common Totals",
    subtitle: "Compare several relationships on one whole.",
    learningGoal: "Convert a part-to-rest ratio into a fraction of the whole.",
    estimatedMinutes: 3,
    reflectionPrompt: "What share belongs to the named part?",
    segments: ["notice-the-language", "build-the-whole", "write-the-fraction", "compare-another-share", "choose-a-common-total", "thinking-pause", "recap"].map(function (id, index) {
      return { segmentId: id, title: `Step ${index + 1}`, narration: "Explain one verified relationship while the matching visual is highlighted.", math: `${index + 1} -> ${index + 2}` };
    })
  };
}

test("sample lesson-to-board contract blocks silent mathematical drift", function () {
  renderer.SAMPLE_QUESTIONS.forEach(function (number) {
    assert.equal(renderer.validateSampleBoardAlignment(lesson(number)), true);
  });

  const altered = [
    [6, function (entry) { entry.steps[2].math = "angle EAC = 45 deg - 15 deg = 35 deg"; }],
    [7, function (entry) { entry.whyItWorks = "Use A=1u, C=1.5u, and D=2u."; }],
    [16, function (entry) { entry.steps[1].math = "18 small, 10 medium, 3 large"; }],
    [20, function (entry) { entry.steps[1].math = "A=34u, B=28u, C=40u"; }]
  ];
  altered.forEach(function (record) {
    const entry = lesson(record[0]);
    record[1](entry);
    assert.throws(function () { renderer.validateSampleBoardAlignment(entry); }, {
      code: `WHITEBOARD_Q${String(record[0]).padStart(2,"0")}_LESSON_ALIGNMENT_INVALID`
    });
  });

  const embeddedWrongAnswer = lesson(6);
  embeddedWrongAnswer.finalAnswer.display = "Option D: 130 degrees";
  assert.throws(function () { renderer.validateSampleBoardAlignment(embeddedWrongAnswer); }, {
    code: "WHITEBOARD_Q06_LESSON_ALIGNMENT_INVALID"
  });

  const extraMathStep = lesson(20);
  extraMathStep.steps.push({ label: "Conflicting step", explanation: "A later edit must not bypass the contract.", math: "total=141" });
  assert.throws(function () { renderer.validateSampleBoardAlignment(extraMathStep); }, {
    code: "WHITEBOARD_Q20_LESSON_ALIGNMENT_INVALID"
  });
});

function intakeItem(entry) {
  return { itemId: entry.itemId, responseType: entry.questionNumber < 10 ? "multiple-choice" : "numeric-exact" };
}

test("G·MAP sample renders concept plus four actual-problem lesson shells", function () {
  const lessons = renderer.SAMPLE_QUESTIONS.map(lesson);
  const intakePack = { items: lessons.map(intakeItem) };
  const mediaAssets = new Map(lessons.map(function (entry) {
    return [entry.itemId, { dataUri: "data:image/png;base64,iVBORw0KGgo=", altText: `Source question ${entry.questionNumber}`, spokenPrompt: `Read source question ${entry.questionNumber}.`, width: 1300, height: 500 }];
  }));
  const html = renderer.documentHtml({ concept: concept(), pack: { lessons }, intakePack, mediaAssets });
  assert.match(html, /G·MAP Lessons/u);
  assert.match(html, /Diagnose\. Learn\. Advance\./u);
  assert.equal((html.match(/class="sample-panel/g) || []).length, 5);
  assert.equal((html.match(/class="question-image-frame"/g) || []).length, 4);
  assert.equal((html.match(/class="answer-button"/g) || []).length, 4);
  assert.match(html, /Reveal verified answer/u);
  assert.match(html, /\.sample-panel\[data-panel\^="q"\] \.teaching-board:not\(\.has-progress\)\{display:none\}/u);
  assert.match(html, /@media print\{\.sample-panel\[data-panel\^="q"\] \.teaching-board\{display:block!important\}/u);
  assert.match(html, /speechSynthesis/u);
  assert.match(html, /typeof window\.SpeechSynthesisUtterance/u);
  assert.match(html, /\^en-US\$/u);
  assert.match(html, /use Next to continue through the complete English captions/u);
  assert.match(html, /data-action="play"/u);
  assert.match(html, /▶ Play concept/u);
  assert.equal((html.match(/▶ Play solution/gu) || []).length, 4);
  assert.match(html, /data-action="previous"/u);
  assert.match(html, /data-action="next"/u);
  assert.match(html, /data-action="overview"/u);
  assert.match(html, /data-progress="concept"/u);
  assert.match(html, /Study step by step/u);
  assert.match(html, /@media\(max-width:760px\)/u);
  assert.match(html, /@page\{size:A4;margin:12mm\}/u);
  assert.match(html, /@media print/u);
  assert.match(html, /\.rail,\.player-controls,\.caption,\.zoom-control,\.answer\{display:none!important\}/u);
});

test("Q6 teaching geometry is calculated from one square-equilateral point model", function () {
  const model = renderer.buildQ6GeometryModel();
  const p = model.points;
  const distance = function (first, second) { return Math.hypot(first.x - second.x, first.y - second.y); };
  const dotAt = function (vertex, first, second) {
    return (first.x - vertex.x) * (second.x - vertex.x) + (first.y - vertex.y) * (second.y - vertex.y);
  };
  [
    [p.A,p.D],[p.D,p.C],[p.C,p.B],[p.B,p.A],
    [p.C,p.E],[p.E,p.F],[p.F,p.G],[p.G,p.C],
    [p.D,p.E]
  ].forEach(function (pair) { assert.ok(Math.abs(distance(pair[0], pair[1]) - 160) < 0.002); });
  assert.ok(Math.abs(dotAt(p.D,p.A,p.C)) < 0.02);
  assert.ok(Math.abs(dotAt(p.E,p.C,p.F)) < 0.02);
  const expected = { "angle-adc":90, "angle-cde":60, "angle-ade":150, "angle-ead":15, "angle-dac":45, "angle-eac":30 };
  model.angles.forEach(function (entry) {
    assert.ok(Math.abs(renderer.minorAngle(p[entry.start], p[entry.vertex], p[entry.end]) - expected[entry.id]) < 0.002);
  });

  const lessons = renderer.SAMPLE_QUESTIONS.map(lesson);
  const intakePack = { items: lessons.map(intakeItem) };
  const mediaAssets = new Map(lessons.map(function (entry) {
    return [entry.itemId, { dataUri: "data:image/png;base64,iVBORw0KGgo=", altText: `Source question ${entry.questionNumber}`, spokenPrompt: `Read source question ${entry.questionNumber}.`, width: 1300, height: 500 }];
  }));
  const html = renderer.documentHtml({ concept: concept(), pack: { lessons }, intakePack, mediaAssets });
  const sourceIndex = html.indexOf('data-panel="q06"');
  const sourceImageIndex = html.indexOf('class="question-image-frame"', sourceIndex);
  const geometryIndex = html.indexOf('class="geometry-board teaching-board q6-board"', sourceIndex);
  assert.ok(sourceIndex >= 0 && sourceImageIndex > sourceIndex && geometryIndex > sourceImageIndex);
  assert.match(html, /id="auxiliary-ae"[^>]+data-layout-role="segment"/u);
  assert.match(html, /id="auxiliary-ac"[^>]+data-layout-role="segment"/u);
  assert.match(html, /id="angle-eac"[^>]+data-layout-role="angle-sector"[^>]+data-angle-start="E"[^>]+data-angle-end="C"[^>]+data-owner-id="A"[^>]+data-angle-degrees="30"/u);
  assert.equal((html.match(/data-layout-role="point-label"/gu) || []).length, 7);
  assert.equal((html.match(/<line id="equal-[^"]+" data-layout-role="equal-mark"/gu) || []).length, 2);
  const panel = html.slice(sourceIndex,html.indexOf('data-panel="q16"'));
  assert.match(panel,/The original prompt, quantities, answer choices, labels, and diagram are preserved\./u);
});

test("Q16 source grid is reconstructed from 18 points and exhaustively yields 19, 10, and 3 triangles", function () {
  const model = renderer.buildQ16TriangleModel();
  assert.equal(Object.keys(model.points).length, 18);
  assert.equal(model.segments.length, 36);
  assert.equal(model.triangles.length, 32);
  const expected = {
    1: ["A0-A1-B1","A1-A2-B2","A1-B1-B2","A2-A3-B3","A2-B2-B3","B0-B1-C0","B1-B2-C1","B1-C0-C1","B2-B3-C2","B2-C1-C2","B3-B4-C3","B3-C2-C3","C0-C1-D0","C1-C2-D1","C1-D0-D1","C2-C3-D2","C2-D1-D2","D0-D1-E0","D1-D2-E1"],
    2: ["A0-A2-C1","A1-A3-C2","A1-C0-C2","A2-C1-C3","B0-B2-D0","B1-B3-D1","B2-B4-D2","B2-D0-D2","C0-C2-E0","C1-C3-E1"],
    3: ["A0-A3-D1","B0-B3-E0","B1-B4-E1"]
  };
  [1,2,3].forEach(function (sizeClass) {
    const actual = model.triangles.filter(function (entry) { return entry.sizeClass === sizeClass; }).map(function (entry) { return entry.vertices.join("-"); }).sort();
    assert.deepEqual(actual, expected[sizeClass].slice().sort());
  });

  const lessons = renderer.SAMPLE_QUESTIONS.map(lesson);
  const intakePack = { items: lessons.map(intakeItem) };
  const mediaAssets = new Map(lessons.map(function (entry) {
    return [entry.itemId, { dataUri: "data:image/png;base64,iVBORw0KGgo=", altText: `Source question ${entry.questionNumber}`, spokenPrompt: `Read source question ${entry.questionNumber}.`, width: 1300, height: 500 }];
  }));
  const html = renderer.documentHtml({ concept: concept(), pack: { lessons }, intakePack, mediaAssets });
  const sourceIndex = html.indexOf('data-panel="q16"');
  const sourceImageIndex = html.indexOf('class="question-image-frame"', sourceIndex);
  const geometryIndex = html.indexOf('class="triangle-count-board teaching-board q16-board"', sourceIndex);
  assert.ok(sourceIndex >= 0 && sourceImageIndex > sourceIndex && geometryIndex > sourceImageIndex);
  assert.equal((html.match(/data-layout-role="triangle-count-panel"/gu) || []).length, 3);
  assert.equal((html.match(/data-layout-role="counted-triangle"/gu) || []).length, 32);
  const panel = html.slice(sourceIndex,html.indexOf('data-panel="q07"'));
  assert.match(panel,/The original prompt, quantities, labels, and diagram are preserved\./u);
  assert.doesNotMatch(panel,/answer choices/u);
});

test("Q7 unit bars satisfy every source relationship and have one bounded integer solution", function () {
  const model = renderer.buildQ7UnitBarModel();
  assert.equal(model.halfUnitValue, 10);
  assert.deepEqual(model.people.map(function (entry) { return [entry.id,entry.halfUnits]; }), [["A",2],["B",4],["C",3],["D",4]]);
  assert.equal(model.people.reduce(function (sum, entry) { return sum + entry.halfUnits; }, 0), 13);

  const lessons = renderer.SAMPLE_QUESTIONS.map(lesson);
  const intakePack = { items: lessons.map(intakeItem) };
  const mediaAssets = new Map(lessons.map(function (entry) {
    return [entry.itemId, { dataUri: "data:image/png;base64,iVBORw0KGgo=", altText: `Source question ${entry.questionNumber}`, spokenPrompt: `Read source question ${entry.questionNumber}.`, width: 1300, height: 500 }];
  }));
  const html = renderer.documentHtml({ concept: concept(), pack: { lessons }, intakePack, mediaAssets });
  const panel = html.slice(html.indexOf('data-panel="q07"'), html.indexOf('data-panel="q20"'));
  assert.match(panel, /class="unit-bar-board teaching-board q7-board"/u);
  assert.equal((panel.match(/data-layout-role="unit-bar"/gu) || []).length, 4);
  assert.equal((panel.match(/data-layout-role="unit-block"/gu) || []).length, 13);
  assert.equal((panel.match(/data-difference-block="true"/gu) || []).length, 1);
  assert.match(panel, /The original prompt, quantities, and answer choices are preserved\./u);
  assert.doesNotMatch(panel, /labels, and diagram are preserved/u);
  assert.doesNotMatch(panel, /<details open>/u);
});

test("Q20 common-total shares satisfy all three part-to-rest conditions and uniquely total 140", function () {
  const model = renderer.buildQ20ShareModel();
  assert.equal(model.totalUnits, 140);
  assert.deepEqual(model.shares, { A:35, B:28, C:40, D:37 });
  assert.equal(model.shares.A * 3, model.totalUnits - model.shares.A);
  assert.equal(model.shares.B * 4, model.totalUnits - model.shares.B);
  assert.equal(model.shares.C * 5, (model.totalUnits - model.shares.C) * 2);
  assert.equal(model.shares.C - model.shares.D, 3);

  const lessons = renderer.SAMPLE_QUESTIONS.map(lesson);
  lessons.find(function (entry) { return entry.questionNumber === 20; }).steps[0].math = "A=1/4, B=1/5, C=2/7 of total";
  const intakePack = { items: lessons.map(intakeItem) };
  const mediaAssets = new Map(lessons.map(function (entry) {
    return [entry.itemId, { dataUri: "data:image/png;base64,iVBORw0KGgo=", altText: `Source question ${entry.questionNumber}`, spokenPrompt: `Read source question ${entry.questionNumber}.`, width: 1300, height: 500 }];
  }));
  const html = renderer.documentHtml({ concept: concept(), pack: { lessons }, intakePack, mediaAssets });
  const panel = html.slice(html.indexOf('data-panel="q20"'));
  assert.match(panel, /class="common-total-board teaching-board q20-board"/u);
  assert.equal((panel.match(/data-layout-role="common-total-bar"/gu) || []).length, 2);
  assert.equal((panel.match(/data-layout-role="share-segment"/gu) || []).length, 8);
  assert.equal((panel.match(/class="stacked-fraction"/gu) || []).length, 6);
  assert.doesNotMatch(panel, />A=1\/4, B=1\/5, C=2\/7 of total</u);
  assert.match(panel, /The original prompt and quantities are preserved\./u);
  assert.doesNotMatch(panel, /answer choices/u);
});
