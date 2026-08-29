"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const renderer = require("../scripts/render-private-sasmo-whiteboard-sample.cjs");

function lesson(number) {
  return {
    itemId: `sasmo-2019-g6-q${String(number).padStart(2, "0")}`,
    questionNumber: number,
    title: `Verified sample ${number}`,
    conceptGoal: "Represent the verified mathematical relationships before calculating.",
    steps: [
      { label: "Represent", explanation: "Build a faithful mathematical model from the source prompt.", math: "source -> model" },
      { label: "Solve", explanation: "Use the model to calculate the required value.", math: "model -> answer" },
      { label: "Check", explanation: "Check the result against every original condition.", math: "answer -> verified" }
    ],
    whyItWorks: "Equivalent relationships preserve the source conditions.",
    commonMistake: "Do not choose a method before identifying every quantity.",
    finalAnswer: { display: `Verified answer ${number}` }
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

test("G·MAP sample renders concept plus four actual-problem lesson shells", function () {
  const lessons = renderer.SAMPLE_QUESTIONS.map(lesson);
  const intakePack = { items: lessons.map(function (entry) { return { itemId: entry.itemId }; }) };
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
  assert.match(html, /speechSynthesis/u);
  assert.match(html, /data-action="play"/u);
  assert.match(html, /Study step by step/u);
  assert.match(html, /@media\(max-width:760px\)/u);
});
