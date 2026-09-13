import assert from "node:assert/strict";
import { COURSE02_A1_STONE_GROWTH_LESSON, STONE_GROWTH_KIND, course02StoneGrowthConceptMarkup, firstWhiteExceedsStage, stageForWhiteCount, stoneStageModel } from "./golden-bell-course02-stone-growth-lesson.js";

const lesson = COURSE02_A1_STONE_GROWTH_LESSON;
const forbiddenKeys = /(?:^|\.)(answer|solution|correctAnswer|officialAnswer|workedAnswer|workedSolution)(?:$|[.:])/i;
const forbiddenSource = /(?:[A-Z]:[\\/]|(?:\.pdf|\.pptx?|\.png)\b|sourceFile|sourcePath|sourcePage|teacherAnswer)/i;
const allItems = [...lesson.original.items, lesson.extension, ...lesson.similarPractice];

assert.equal(lesson.experience.kind, "course-concept");
assert.equal(lesson.experience.tracks.length, 2);
assert.equal(lesson.experience.tracks.every((track) => track.beats.length === 4), true);
assert.equal(lesson.learnerStage, "필즈 더 클래식 2과정 A1; 연령 미확정");
assert.equal(lesson.original.items.length, 4);
assert.ok(lesson.extension);
assert.equal(lesson.similarPractice.length, 5);
assert.equal(allItems.length, 10);
assert.equal(new Set(allItems.map((item) => item.id)).size, 10);
assert.equal(allItems.every((item) => item.answerRef && item.answerMode === "input" && item.inputMode === "numeric"), true);
assert.deepEqual(lesson.original.items.map((item) => item.sourceNo), ["1", "2", "3", "4"]);
assert.equal(allItems.every((item) => Object.keys(item).filter((key) => /answer|solution/i.test(key) && !["answerRef", "answerMode"].includes(key)).length === 0), true);

const walk = (value, path = "root") => {
  if (value && typeof value === "object") for (const [key, child] of Object.entries(value)) {
    assert.equal(forbiddenKeys.test(`${path}.${key}`), false, `forbidden key ${path}.${key}`);
    walk(child, `${path}.${key}`);
  } else if (typeof value === "string") assert.equal(forbiddenSource.test(value), false, `source-like value at ${path}`);
};
walk(lesson);

for (const item of allItems) {
  assert.equal(item.visual.kind, STONE_GROWTH_KIND);
  const model = stoneStageModel(item.visual.stage);
  assert.equal(model.totalCount, model.blackCount + model.whiteCount);
  assert.equal(model.rows.flat().length, (model.stage + 1) * (model.stage + 2) / 2);
  assert.ok(model.blackCount >= 0 && model.whiteCount >= 0);
  const expected = item.visual.task === "count-black" ? model.blackCount
    : item.visual.task === "count-white" ? model.whiteCount
      : item.visual.task === "difference-color" ? model.difference
        : item.visual.task === "first-white-exceeds" ? firstWhiteExceedsStage()
          : item.visual.task === "crossover-previous" ? firstWhiteExceedsStage() - 1
            : stageForWhiteCount(item.visual.targetWhiteCount);
  assert.equal(Number.isInteger(expected) && expected >= 0, true, `${item.id}: no unique numeric answer`);
}

const crossover = Array.from({ length: 24 }, (_, index) => stoneStageModel(index + 1));
const firstWhite = crossover.find((model) => model.whiteCount > model.blackCount);
assert.ok(firstWhite);
assert.equal(firstWhite.stage, 9);
assert.equal(crossover[firstWhite.stage - 2].whiteCount <= crossover[firstWhite.stage - 2].blackCount, true);

for (const visual of [...lesson.experience.tracks.flatMap((track) => track.beats.map((beat) => beat.visual)), ...allItems.map((item) => item.visual)]) {
  const markup = course02StoneGrowthConceptMarkup(visual);
  assert.ok(markup.length > 100);
  assert.equal(markup.includes("undefined"), false);
  assert.equal(markup.includes("NaN"), false);
  assert.equal(markup.includes("<svg"), true);
  assert.equal(markup.includes("<circle"), true);
}

const problem = course02StoneGrowthConceptMarkup({ kind: STONE_GROWTH_KIND, stage: 6, phase: "problem", task: "count-black" });
assert.equal(problem.includes("확인표"), false);
assert.equal(/검은 돌:\s*\d+개|흰 돌:\s*\d+개|차:\s*\d+개/.test(problem), false);
const verify = course02StoneGrowthConceptMarkup({ kind: STONE_GROWTH_KIND, stage: 6, phase: "verify", task: "difference-color" });
assert.equal(verify.includes("확인표"), true);
assert.equal(verify.includes("검은 돌:"), true);
assert.equal(verify.includes("흰 돌:"), true);
const crossoverProblem = course02StoneGrowthConceptMarkup(lesson.original.items[3].visual);
assert.equal(crossoverProblem.includes(`${firstWhite.stage}번째`), false, "crossover answer leaked in problem phase");
const reverseProblem = course02StoneGrowthConceptMarkup(lesson.extension.visual);
assert.equal(reverseProblem.includes(`${stageForWhiteCount(lesson.extension.visual.targetWhiteCount)}번째`), false, "reverse answer leaked in problem phase");
const reverseVerify = course02StoneGrowthConceptMarkup({ ...lesson.extension.visual, phase: "verify" });
assert.equal(reverseVerify.includes(`${stageForWhiteCount(lesson.extension.visual.targetWhiteCount)}번째`), true);
console.log(`COURSE02_A1_STONE_GROWTH_AUDIT_OK items=${allItems.length} tracks=${lesson.experience.tracks.length}`);
