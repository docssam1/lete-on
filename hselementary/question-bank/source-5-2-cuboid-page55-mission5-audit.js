"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
const source = require("./source-5-2-cuboid-page55-mission5.js");
const type = window.HSE_CURRICULUM.semesters.find(x => x.id === "5-2")?.units.find(x => x.id === "5-2-u5")?.subunits.find(x => x.name === "주사위에 관한 문제 ①")?.types.find(x => x.sourceItemId === source.definition.sourceItemId);
assert(type, "source type exists in the dice-arrangement subunit");
assert.equal(type.reviewLocked, false, "source is unlocked after responsive and A4 review");
assert.equal(type.generationMode, "fixed-verified-pool");
assert.equal(type.verifiedVariantCount, 1);
assert.equal(window.HSE_GENERATORS.generatorKey(type), source.definition.generatorKey);
const model = source.verifyModel();
assert.deepEqual(model.startFaces, { top: 2, bottom: 5, front: 6, back: 1, right: 3, left: 4 });
assert.deepEqual(model.answer, { top: 5, front: 6, right: 4 });
assert.equal(model.rolls, 90);
assert.equal(model.firstAxisRolls + model.perpendicularAxisRolls, 90);
assert.equal(model.perpendicularAxisRolls % model.perpendicularCycle, 0);
let simulated = { U: 2, D: 5, F: 6, B: 1, R: 3, L: 4 };
for (let i = 0; i < 90; i += 1) {
  simulated = i < 2
    ? { U: simulated.L, D: simulated.R, F: simulated.F, B: simulated.B, R: simulated.U, L: simulated.D }
    : { U: simulated.F, D: simulated.B, F: simulated.D, B: simulated.U, R: simulated.R, L: simulated.L };
}
assert.deepEqual({ top: simulated.U, front: simulated.F, right: simulated.R }, model.answer, "independent 90-step face simulation matches the model");
const generated = source.makeQuestion();
const problemWide = generated.prompt.match(/<svg class="source52-p55m5-diagram source52-p55m5-diagram--wide"[\s\S]*?<\/svg>/)?.[0];
const solutionWide = generated.solution.match(/<svg class="source52-p55m5-diagram source52-p55m5-diagram--wide"[\s\S]*?<\/svg>/)?.[0];
const problemMobile = generated.prompt.match(/<svg class="source52-p55m5-diagram source52-p55m5-diagram--mobile"[\s\S]*?<\/svg>/)?.[0];
const solutionMobile = generated.solution.match(/<svg class="source52-p55m5-diagram source52-p55m5-diagram--mobile"[\s\S]*?<\/svg>/)?.[0];
assert(problemWide && problemMobile && solutionWide && solutionMobile, "desktop and mobile diagrams exist in both views");
assert.match(generated.prompt, /첫째·둘째 칸 → 꺾어서 셋째 칸부터 90째 칸/);
assert.match(problemMobile, /마지막 주사위의 위·앞·오른쪽 면은 빈칸입니다/);
assert.match(solutionMobile, /마지막 주사위의 위·앞·오른쪽 면은 5, 6, 4입니다/);
assert.equal(generated.answerVisualRequired, true);
assert.equal(generated.answerVisualStatus, "verified-drawing");
assert.equal((generated.answerVisual.match(/class="source52-p55m5-pip"/g) || []).length, 15, "answer visual draws 5, 6, and 4 pips");
assert.equal(generated.publisherAnswerVerified, false);
assert.match(generated.prompt, /주사위를 길을 따라 90번 굴려/);
assert.match(generated.prompt, /눈을 빈 곳에 알맞게 그려 넣으세요/);
assert.doesNotMatch(generated.prompt, /90째 칸[^<]*(?:위 5|앞 6|오른쪽 4)|data-source-answer/);
assert.match(generated.solution, /위 5, 앞 6, 오른쪽 4/);
assert.equal((problemWide.match(/class="source52-p55m5-pip"/g) || []).length, 11, "only starting die pips appear in desktop problem view");
assert.equal((solutionWide.match(/class="source52-p55m5-pip"/g) || []).length, 26, "desktop solution includes start and final die pips");
assert.equal((problemWide.match(/class="source52-p55m5-die" data-die-label="90th"[^>]*data-visible-faces="blank"/g) || []).length, 1, "desktop final die has three blank visible faces");
assert.equal((problemMobile.match(/class="source52-p55m5-cell /g) || []).length, 4, "mobile diagram shows all four source path cells");
assert.match(problemMobile, /points="58,107 108,107 124,94 74,94"/, "first cell meets the starting die");
assert.match(problemMobile, /points="108,107 158,107 174,94 124,94"/, "second cell meets first");
assert.match(problemMobile, /points="124,94 174,94 190,81 140,81"/, "third cell shares the second cell's back edge");
const runtimeQuestion = window.HSE_GENERATORS.generate(type, 2, 0, 54, 0);
assert.equal(runtimeQuestion.answer, "위 5, 앞 6, 오른쪽 4", "unlocked runtime generates the fixed source question");
assert.equal(runtimeQuestion.publisherAnswerVerified, false);
assert.equal(window.HSE_GENERATORS.generate(type, 2, 0, 54, 1), null, "unverified variants stay unavailable");
console.log(JSON.stringify({ status: "passed", sourceItemId: source.definition.sourceItemId, answer: model.answer, rolls: model.rolls, reviewLocked: false }));
