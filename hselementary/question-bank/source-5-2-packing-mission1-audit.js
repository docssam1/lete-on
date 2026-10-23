"use strict";

const assert = require("node:assert/strict");
const api = require("./source-5-2-packing-mission1.js");
const sourceItemId = "5-2-u1-e3-mission-1-box-count";
const strip = html => html.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const read = (text, pattern) => {
  const match = text.match(pattern);
  assert(match, `Visible prompt must match ${pattern}`);
  return Number(match[1].replaceAll(",", ""));
};
const configurations = [];

for (let variant = 0; variant < api.storybookPools.length; variant++) {
  for (const difficulty of [-1, 0, 1]) {
    const q = api.getQuestion(variant, difficulty);
    assert(q);
    const visible = strip(q.prompt);
    const storybooks = read(visible, /동화책은\s*([\d,]+)권/);
    const capacity = read(visible, /한 상자에\s*([\d,]+)권씩/);
    assert.match(visible, /과학책은 동화책의 1\/4만큼/);
    assert.match(visible, /위인전은 동화책의 1\/2만큼/);
    const total = storybooks + storybooks / 4 + storybooks / 2;
    const expected = Math.ceil(total / capacity);
    assert.equal(q.answer, `${expected}개`, "Answer must be derived only from visible problem conditions");
    assert.match(strip(q.solution), new RegExp(`${expected}개입니다`));
    assert.equal(q.publisherKeyVerified, false);
    assert.equal(q.sourceItemId, sourceItemId);
    configurations.push({ variant, difficulty, storybooks, capacity, total, expected });
  }
}

assert.equal(configurations.length, 9);
assert.equal(new Set(configurations.map(item => item.storybooks)).size, 9, "Each pool/difficulty combination has distinct data");
for (const invalid of [-1, 3, 1.5]) assert.equal(api.getQuestion(invalid, 0), null);
for (const invalid of [-2, 2, 1.5]) assert.equal(api.getQuestion(0, invalid), null);
console.log(JSON.stringify({
  status: "passed",
  sourceItemId,
  configurations: configurations.length,
  variants: api.storybookPools.length,
  difficultyOffsets: 3,
  visiblePromptAnswersRecomputed: true,
  exactFractionRelationsPreserved: true,
  wholeBoxesRoundedUp: true,
  answerLeakChecks: configurations.length,
  publisherKeyVerified: false
}));
