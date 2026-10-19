#!/usr/bin/env node
'use strict';
/* 2019 SomaSem P: exact arithmetic topic, 6/10/4 and printed/online parity. */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
for (const page of ['index.html', 'placement-sheet.html']) {
  const scripts = [...read(page).matchAll(/<script\s+[^>]*src=["']([^"']+)["']/g)].map(m => m[1].split('?')[0]);
  assert(scripts.indexOf('data/soma-p-2019.js') >= 0 && scripts.indexOf('data/soma-p-2019.js') < scripts.indexOf('data/placement-plan.js'), page + ': load Soma P before the plan');
}
const pageScripts = [...read('index.html').matchAll(/<script\s+[^>]*src=["']([^"']+)["']/g)].map(m => m[1].split('?')[0]);
const generatorFiles = pageScripts.filter(file => /^engine\/(?:generators\.js|rng\.js|threads\/[^/]+\.js)$/.test(file));
const unitFiles = fs.readdirSync(path.join(ROOT, 'data/units')).filter(f => f.endsWith('.js')).sort().map(f => 'data/units/' + f);
const files = [...new Set([...generatorFiles, 'data/curriculum.js', 'data/threads.js', 'data/middle-pacing.js',
  'data/wordable.js', 'data/courses.js', 'data/stages.js', ...unitFiles,
  'data/soma-p-2019.js', 'data/placement-plan.js'])];
const world = { console: { log() {}, warn() {}, error() {} } }; world.window = world;
const context = vm.createContext(world);
files.forEach(file => vm.runInContext(read(file), context, { filename: file, timeout: 20000 }));
const P = world.NM_PLACEMENT_PLAN, source = world.NM_SOMA_P_2019;
assert.equal(source.courses.length, 8);
const seeds = process.argv.includes('--quick') ? 5 : 60;
const plain = value => JSON.parse(JSON.stringify(value));
let plans = 0;
for (let n = 1; n <= 8; n++) for (let seed = 0; seed < seeds; seed++) {
  const plan = P.buildBook('soma-p', n, seed), where = `P${n} seed ${seed}`;
  assert.deepStrictEqual(plain(plan), plain(P.buildBook('soma-p', n, seed)), where + ': deterministic');
  assert.equal(plan.book.series, 'soma-p'); assert.equal(plan.book.course, n);
  assert.equal(plan.items.length, 20);
  assert.equal(new Set(plan.items.map(i => i.fingerprint)).size, 20, where + ': no repeated question');
  for (const [band, count] of Object.entries({previous:6,current:10,next:4})) {
    const items = plan.items.filter(i => i.band === band);
    assert.equal(items.length, count, where + ': ' + band);
    const volume = band === 'previous' ? n-1 : band === 'next' ? Math.min(8,n+1) : n;
    if(volume>=1 && volume<=6)assert.equal(new Set(items.map(i=>i.domain)).size,2,where + ': both operations in ' + band);
    for (const item of items) {
      assert(world.NM_COURSES[item.course] && item.session >= 1, where + ': app anchor');
      assert(item.renderData.tex.includes('\\square'), where + ': visible blank');
      if (volume === 0) { assert.equal(item.stageId, 'f-order10'); continue; }
      const m = /^(\d+)([+-])(\d+)=\\square$/.exec(item.renderData.tex);
      assert(m, where + ': simple arithmetic form');
      const a=Number(m[1]), op=m[2], b=Number(m[3]);
      assert.equal(item.answer, op==='+'?a+b:a-b, where + ': answer');
      if (volume <= 4) {
        assert.equal(b, [0,5,6,10,9][volume], where + ': named operand');
        assert(a>=0 && a<=30 && item.answer>=0 && item.answer<=30, where + ': within 30');
      } else if (volume === 5) {
        assert(op==='+' ? item.answer<=9 : a<=9, where + ': bonds to 9');
      } else if (volume === 6) {
        assert(op==='+' ? item.answer===10 : a===10, where + ': bonds to 10');
      } else if (volume === 7) {
        assert(op==='+' && a<10 && b<10 && item.answer>10, where + ': add across ten');
      } else {
        assert(op==='-' && a>10 && item.answer<10, where + ': subtract across ten');
      }
    }
  }
  assert.equal(P.summarize(plan,plan.items.map(i=>({id:i.id,value:i.answer}))).correct,20,where + ': grading');
  const wrong=P.summarize(plan,plan.items.map(i=>({id:i.id,value:-999})));
  assert.equal(wrong.correct,0,where + ': wrong grading');
  assert(world.NM_COURSES[wrong.recommendation.course],where + ': practice recommendation');
  const first=plan.items[0], one=P.summarize(plan,plan.items.map(i=>({id:i.id,value:i===first?-999:i.answer})));
  assert.equal(one.recommendation.course,first.course,where + ': one earlier miss returns its app practice course');
  plans++;
}
assert.throws(()=>P.buildBook('soma-p',9,0),/unknown book course/);
console.log(`SOMA_P_PLACEMENT_OK volumes=8 seeds=${seeds} plans=${plans} counts=6/10/4`);
