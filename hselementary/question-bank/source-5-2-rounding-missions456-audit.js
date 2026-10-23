"use strict";
const assert = require("node:assert/strict");
const api = require("./source-5-2-rounding-missions.js");
const strip = html => String(html).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const parseNum = value => Number(value.replaceAll(",", ""));
const ceil = (n, unit) => Math.ceil(n / unit) * unit;
const floor = (n, unit) => Math.floor(n / unit) * unit;
const round = (n, unit) => Math.floor(n / unit + 0.5) * unit;
const placeUnit = place => ({ "십": 10, "백": 100, "천": 1000, "만": 10000 })[place];
function expectedFromPrompt(id, prompt) {
  const text = strip(prompt);
  if (id.endsWith("mission-4")) {
    const match = text.match(/(\d{3})□(\d{2})/);
    assert(match, "Mission 4 must show a blank in the hundreds digit");
    const prefix = Number(match[1]), suffix = Number(match[2]);
    const digits = [];
    for (let digit = 0; digit <= 9; digit++) {
      const n = prefix * 1000 + digit * 100 + suffix;
      if (floor(n, 1000) === round(n, 1000)) digits.push(digit);
    }
    return digits;
  }
  if (id.endsWith("mission-5")) {
    const length = Number(text.match(/(\d)자리 자연수/)[1]);
    const place = text.match(/어림하여 (십|백|천)의 자리까지/)[1];
    const unit = placeUnit(place), lower = 10 ** (length - 1), upper = 10 ** length - 1;
    let count = 0;
    for (let n = lower; n <= upper; n++) if (ceil(n, unit) === floor(n, unit) && floor(n, unit) === round(n, unit)) count++;
    return [count];
  }
  if (id.endsWith("mission-6")) {
    const length = Number(text.match(/모두 만족하는 (\d)자리 자연수/)[1]);
    const units = [...text.matchAll(/(?:올림하여|반올림하여) (십|백|천|만)의 자리까지/g)].map(m => placeUnit(m[1]));
    assert.equal(units.length, 4, "Mission 6 must state both rounding conditions explicitly");
    const lower = 10 ** (length - 1), upper = 10 ** length - 1;
    let count = 0;
    for (let n = lower; n <= upper; n++) {
      const firstEqual = ceil(n, units[0]) === round(n, units[1]);
      const secondDifferent = ceil(n, units[2]) !== round(n, units[3]);
      if (firstEqual && secondDifferent) count++;
    }
    return [count];
  }
  throw new Error(`Unexpected source ID ${id}`);
}

const output = [];
for (const id of api.ids.slice(3)) for (let variant = 0; variant < 3; variant++) for (const difficulty of [-1, 0, 1]) {
  const q = api.getQuestion(id, variant, difficulty);
  assert(q, `${id} v${variant} d${difficulty} must generate`);
  const expected = expectedFromPrompt(id, q.prompt);
  const actual = id.endsWith("mission-6") ? [parseNum(q.answer)] : q.answer.split(/,\s*/).map(parseNum);
  assert.deepEqual(actual, expected, `${id} v${variant} d${difficulty}: visible condition and answer`);
  assert(q.solution && strip(q.solution).length > 20, `${id}: detailed explanation required`);
  assert.equal(q.publisherKeyVerified, false);
  assert.equal(q.answerVerification, "independent-enumeration-user-authorized");
  assert.equal(q.sourceStructurePreserved, true);
  assert.equal(q.verifiedVariantCount, 3);
  output.push({ id, variant, difficulty, expected });
}
assert.equal(output.length, 27);
for (const id of api.ids.slice(3)) {
  assert.equal(api.getQuestion(id, 3, 0).verifiedPoolIndex, 0, "Pool must not silently grow or cycle");
  assert.equal(api.getQuestion(id, -1, 0), null);
  assert.equal(api.getQuestion(id, 0, 2), null);
}
const fs = require("node:fs"), path = require("node:path");
if (process.env.HSE_AUDIT_OUTPUT) {
  const dir = process.env.HSE_AUDIT_OUTPUT;
  assert(path.isAbsolute(dir)); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "mission456-visible-prompt-configurations.json"), JSON.stringify({ status: "passed", configurations: output.length, answersDerivedFromVisiblePrompt: true }, null, 2) + "\n");
}
console.log(JSON.stringify({ status: "passed", types: api.ids.slice(3).length, configurations: output.length, variants: 3, difficultyOffsets: 3, answersDerivedFromVisiblePrompt: true, solutionSeparation: true, officialPublisherKey: false }));
