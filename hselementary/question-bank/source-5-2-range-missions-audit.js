"use strict";

// Recompute every rendered numerical condition without using the producer's answer formulas.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-4-2-quadrilateral.js");
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
require("./source-5-2-range-e1.js");
require("./source-5-2-range-missions.js");
const ids = [1, 2, 3, 4, 5, 6].map(n => `5-2-u1-e1-mission-${n}`);
const types = window.HSE_CURRICULUM.semesters.flatMap(s => s.units.flatMap(u => u.subunits.flatMap(g => g.types)));
const missionTypes = ids.map(id => types.find(t => t.id === id));
const api = window.HSE_GENERATORS;
const direct = window.HSE_SOURCE_52_RANGE_MISSIONS;
const values = html => {
  const result = {};
  for (const match of html.matchAll(/data-given="([^"]+)"[^>]*>([^<]+)<\/span>/g)) {
    const key = match[1], value = Number(match[2]);
    assert(Number.isFinite(value), `${key} must be visible as a finite number`);
    if (result[key] !== undefined) assert.equal(result[key], value, `${key}: repeated givens disagree`);
    result[key] = value;
  }
  return result;
};
const sequence = (first, last) => Array.from({ length: last - first + 1 }, (_, i) => first + i);
const same = (actual, expected) => assert.deepEqual(JSON.parse(JSON.stringify(actual)), expected);
const plain = html => String(html).replace(/<[^>]+>/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();

function oracle(question, id) {
  const g = values(question.prompt);
  switch (Number(id.slice(-1))) {
    case 1: {
      const aLower = g["a-lower"], aUpper = g["a-upper-exclusive"] ?? g["upper-base"] + g["upper-extra"];
      const bFirst = g["b-lower-exclusive"] + 1, bUpper = g["b-upper"];
      const a = sequence(aLower, aUpper - 1), b = sequence(bFirst, bUpper);
      const union = new Set([...a, ...b]);
      const overlap = a.filter(x => b.includes(x));
      const sums = new Set(a.flatMap(x => b.map(y => x + y)));
      const lower = Math.min(...sums), upper = Math.max(...sums), sum = overlap.reduce((x,y) => x+y,0);
      assert.equal(sums.size, upper - lower + 1);
      return { answer: `(1) ${union.size}개, (2) ${sum}, (3) ${lower} 이상 ${upper} 이하`, model: { unionCount: union.size, overlapFirst: overlap[0], overlapLast: overlap.at(-1), overlapSum: sum, sumLower: lower, sumUpper: upper, allSumsConsecutive: true } };
    }
    case 2: {
      const lower = g.lower, divisor = g.divisor, count = g.count ?? g["count-base"] + g["count-extra"];
      const matches = [];
      for (let upper = lower + 1; upper < lower + 1000; upper++) {
        let found = 0;
        for (let x = lower; x < upper; x++) if (x % divisor === 0) found++;
        if (found === count) matches.push(upper);
        if (found > count) break;
      }
      const multiples = sequence(lower, matches.at(-1)).filter(x => x % divisor === 0);
      return { answer: matches.join(", "), model: { contract: "set", values: matches, lastMultiple: multiples.at(-2), nextMultiple: multiples.at(-1) } };
    }
    case 3: {
      const lower = g["target-lower"], upper = g["target-upper"] ?? lower + g["target-span"];
      const count = sequence(lower, upper).length;
      const pairs = [];
      for (let a = 10; a <= 99; a++) for (let b = 10; b <= 99; b++) {
        if (sequence(a + 1, b - 1).length === count && b > a + 1) pairs.push([a, b]);
      }
      return { answer: `${pairs.length}쌍`, model: { value: pairs.length, targetCount: count, endpointGap: pairs[0][1] - pairs[0][0], lowerFirst: pairs[0][0], lowerLast: pairs.at(-1)[0] } };
    }
    case 4: {
      const cards = [...question.prompt.matchAll(/class="source52-mission-card">(\d)<\/span>/g)].map(match => Number(match[1]));
      assert.equal(cards.length, 6);
      assert.equal(new Set(cards).size, 6);
      const lower = Math.round(g.lower * 100), upper = Math.round((g.upper ?? g["upper-base"] + g["upper-extra"]) * 100);
      const candidates = [];
      for (const whole of cards) for (const tenths of cards) for (const hundredths of cards) {
        if (new Set([whole, tenths, hundredths]).size !== 3) continue;
        const value = whole * 100 + tenths * 10 + hundredths;
        if (lower < value && value <= upper) candidates.push({ whole, value });
      }
      const groups = [...new Set(candidates.map(x => x.whole))].sort((a,b) => a-b).map(integer => ({ integer, count: candidates.filter(x => x.whole === integer).length }));
      return { answer: `${candidates.length}개`, model: { value: candidates.length, byIntegerPart: groups, strictLower: true, inclusiveUpper: true } };
    }
    case 5: {
      const capA = g["capacity-a"], countA = g["buses-a"], capB = g["capacity-b"], countB = g["buses-b"] ?? g["bus-base"] + g["bus-extra"];
      const people = sequence(1, Math.max(capA * countA, capB * countB) + 100).filter(n => Math.ceil(n / capA) === countA && Math.ceil(n / capB) === countB);
      const lower = people[0], upper = people.at(-1);
      assert.equal(people.length, upper - lower + 1);
      return { answer: `${lower - 1}명 초과 ${upper + 1}명 미만`, model: { lower, upper, displayLower: lower - 1, displayUpper: upper + 1, lowerIncluded: false, upperIncluded: false } };
    }
    case 6: {
      const total = g.total ?? g["total-base"] + g["total-extra"], minimum = g.minimum, maximum = g.maximum;
      const boxes = sequence(1, total).filter(n => minimum * n <= total && total <= maximum * n);
      const lower = boxes[0], upper = boxes.at(-1);
      assert.equal(boxes.length, upper - lower + 1);
      return { answer: `${lower - 1}상자 초과 ${upper + 1}상자 미만`, model: { lower, upper, displayLower: lower - 1, displayUpper: upper + 1, lowerIncluded: false, upperIncluded: false } };
    }
    default: throw new Error(`Unexpected ID: ${id}`);
  }
}
function verify(question, id) {
  const computed = oracle(question, id);
  assert.equal(question.answer, computed.answer, `${id}: rendered answer differs from independent enumeration`);
  same(question.answerModel, computed.model);
  assert(question.solution && plain(question.solution).length > 170, `${id}: detailed solution required`);
  assert(!/undefined|null|NaN|Infinity/.test(question.prompt + question.solution + question.answer));
  assert.equal(question.publisherKeyVerified, false);
  assert.equal(question.sourceItemId, id);
  assert.equal(question.verifiedVariantCount, 3);
  assert.equal(question.generationMode, "fixed-verified-pool");
  return computed;
}
const cases = [], promptSets = new Map();
missionTypes.forEach((type,index) => {
  assert(type && type.sourceItemId === ids[index]);
  assert.equal(type.reviewLocked, false);
  assert.equal(type.sourceVerified, true);
  assert.equal(type.publisherKeyVerified, false);
  assert.equal(api.generatorKey(type), direct.definitions[index].generatorKey);
  const prompts = new Set();
  for (const difficulty of [-1,0,1]) for (let variant=0; variant<3; variant++) {
    const q = api.generate(type, 1, difficulty, 1, variant);
    const computed = verify(q, type.id);
    assert.equal(q.verifiedPoolIndex, variant);
    assert.equal(q.difficultyOffset, difficulty);
    assert.match(q.prompt, /source52-mission-question/);
    prompts.add(q.prompt);
    cases.push({ id:type.id, variant, difficulty, answer:computed.answer });
  }
  assert.equal(prompts.size, 9, `${type.id}: three values and three structurally different levels required`);
  promptSets.set(type.id, prompts);
});
assert.equal(new Set(cases.filter(x => x.difficulty===0).map(x => x.answer)).size >= 12, true);
const controls = [];
for (const type of missionTypes) {
  for (const [name, change] of [
    ["forged-source", t => { t.sourceItemId = "5-2-u1-e1-mission-9"; }],
    ["forged-key", t => { t.generatorKey = "advancedRange"; }],
    ["review-lock", t => { t.reviewLocked = true; }],
    ["unverified-source", t => { t.sourceVerified = false; }]
  ]) {
    const changed = { ...type }; change(changed);
    assert.equal(api.generatorKey(changed), "", `${type.id} / ${name}`);
    assert.equal(api.generate(changed, 1, 0, 1, 0), null, `${type.id} / ${name}`);
    controls.push({id:type.id,name});
  }
  const q=direct.getQuestion(type.id,0,0);
  const sensitiveRole = {1:"a-lower",2:"count",3:"target-upper",4:"lower",5:"capacity-a",6:"maximum"}[Number(type.id.slice(-1))];
  for (const [name,change] of [
    ["changed-answer", x => { x.answer += "1"; }],
    ["changed-condition", x => {
      const expression = new RegExp(`(data-given="${sensitiveRole}"[^>]*>)([^<]+)`);
      assert.match(x.prompt, expression);
      x.prompt = x.prompt.replace(expression, (_, prefix, old) => `${prefix}${Number(old) + (sensitiveRole === "lower" ? 100 : sensitiveRole === "capacity-a" ? -20 : sensitiveRole === "maximum" ? -8 : 1)}`);
    }]
  ]) {
    const changed=JSON.parse(JSON.stringify(q)); change(changed);
    assert.throws(()=>verify(changed,type.id),undefined,`${type.id} / ${name}`);
    controls.push({id:type.id,name});
  }
}
const result={status:"pass",sourceTypes:6,numericalVariants:18,configurations:cases.length,negativeControls:controls.length,publisherKeyVerified:false,cases,controls};
const output=process.env.HSE_AUDIT_OUTPUT;
if(output){assert(path.isAbsolute(output));fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,"missions-math-audit.json"),JSON.stringify(result,null,2)+"\n");}
console.log(`5-2 Missions 1–6: ${cases.length} visible-prompt configurations, ${controls.length} rejected negative controls passed.`);
