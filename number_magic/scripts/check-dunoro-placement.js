#!/usr/bin/env node
'use strict';
/* Dunoro completed-course papers: course N → 6 previous / 10 current / 4 next.
 * Loads the page's sources in a browser-like VM (no require fallback), builds
 * every course with many seeds, and checks band sources, uniqueness, determinism
 * and the recommendation. --quick: 5 seeds while developing. */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const SEEDS = process.argv.includes('--quick') ? 5 : 60;
const COUNTS = { previous: 6, current: 10, next: 4 };
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

execFileSync(process.execPath, [path.join(__dirname, 'build-dunoro-placement.js'), '--check'], { stdio: 'inherit' });
const html = read('index.html');
const pageScripts = [...html.matchAll(/<script\s+[^>]*src=["']([^"']+)["']/g)].map(m => m[1].split('?')[0]);
assert(pageScripts.includes('data/dunoro-placement.js'), 'index.html must load data/dunoro-placement.js');
assert(pageScripts.indexOf('data/dunoro-placement.js') < pageScripts.indexOf('app/placement-ui.js'), 'book data must load before the placement screen');
const generatorFiles = pageScripts.filter(file => /^engine\/(?:generators\.js|rng\.js|threads\/[^/]+\.js)$/.test(file));
const unitFiles = fs.readdirSync(path.join(ROOT, 'data/units')).filter(f => f.endsWith('.js')).sort().map(f => 'data/units/' + f);
const files = [...new Set([...generatorFiles, 'data/curriculum.js', 'data/threads.js', 'data/middle-pacing.js',
  'data/wordable.js', 'data/courses.js', 'data/stages.js', ...unitFiles, 'data/dunoro-placement.js', 'data/placement-plan.js'])];
const world = { console: { log() {}, warn() {}, error() {} } };
world.window = world;
const context = vm.createContext(world);
files.forEach(file => vm.runInContext(read(file), context, { filename: file, timeout: 20000 }));
const P = world.NM_PLACEMENT_PLAN, data = world.NM_DUNORO_CANDIDATES;
assert(P && typeof P.buildBook === 'function', 'NM_PLACEMENT_PLAN.buildBook is missing');
const row = n => data.courses.find(x => x.course === n);
const plain = v => JSON.parse(JSON.stringify(v));

let plans = 0;
const unused = [];
for (let n = 1; n <= 25; n++) {
  const allowed = {
    previous: n === 1 ? null : new Set(row(n - 1).current),
    current: new Set(row(n).current),
    next: new Set(n === 25 ? row(n).current : row(n + 1).current)
  };
  const seenCurrent = new Set();
  for (let seed = 0; seed < SEEDS; seed++) {
    const plan = P.buildBook('dunoro', n, seed), where = `course ${n} seed ${seed}`;
    assert.deepStrictEqual(plain(plan), plain(P.buildBook('dunoro', n, seed)), where + ': same seed must give the same paper');
    assert.strictEqual(plan.items.length, 20, where + ': 20 items');
    for (const band of Object.keys(COUNTS))
      assert.strictEqual(plan.items.filter(i => i.band === band).length, COUNTS[band], where + ': ' + band + ' count');
    assert.strictEqual(new Set(plan.items.map(i => i.id)).size, 20, where + ': unique ids');
    assert.strictEqual(new Set(plan.items.map(i => i.fingerprint)).size, 20, where + ': unique questions');
    assert(plan.book && plan.book.series === 'dunoro' && plan.book.course === n && plan.book.form === 'app', where + ': book source');
    assert(/앱 문제 형식/.test(plan.book.notice.ko), where + ': the paper must say it uses app problem forms');
    assert(P.stages().some(s => s.id === plan.baseline.id), where + ': baseline must be an app stage');
    for (const item of plan.items) {
      const key = item.thread + '@' + item.level;
      assert.notStrictEqual(key, 'MX4@2', where + ': excluded ref');
      if (allowed[item.band]) assert(allowed[item.band].has(key), where + ': ' + item.band + ' ' + key + ' is not a listed topic');
      else assert.strictEqual(item.stageId, 'f-ten10', where + ': course 1 previous uses the app foundation');
      assert(world.NM_COURSES[item.course] && item.session >= 1, where + ': ' + key + ' has no app location');
      if (item.band === 'current') seenCurrent.add(key);
    }
    const right = P.summarize(plan, plan.items.map(i => ({ id: i.id, value: i.answer })));
    assert.strictEqual(right.correct, 20, where + ': answer keys');
    assert.strictEqual(right.recommendation.course, plan.baseline.course, where + ': all correct keeps the main app course');
    const wrong = P.summarize(plan, plan.items.map(i => ({ id: i.id, value: -987654 })));
    assert.strictEqual(wrong.correct, 0, where + ': wrong answers');
    assert(world.NM_COURSES[wrong.recommendation.course] && wrong.recommendation.label && wrong.recommendation.label.ko,
      where + ': all wrong must point to a real app session');
    const first = plan.items.find(i => i.band === 'previous');
    const one = P.summarize(plan, plan.items.map(i => ({ id: i.id, value: i === first ? -987654 : i.answer })));
    assert.strictEqual(one.recommendation.course, first.course, where + ': one previous miss recommends that topic');
    assert.strictEqual(one.recommendation.stageId, first.stageId, where + ': the recommended stage is the missed band');
    plans++;
  }
  const missing = row(n).current.filter(k => !seenCurrent.has(k));
  if (missing.length) unused.push(n + ': ' + missing.join(' '));
}
assert.throws(() => P.buildBook('dunoro', 26, 0), /unknown book course/);
assert.throws(() => P.buildBook('nope', 1, 0), /unknown book series/);
console.log(`DUNORO_PLACEMENT_PAPERS_OK courses=25 seeds=${SEEDS} plans=${plans} counts=6/10/4`);
console.log('Listed current topics never asked (excluded or no supported app question):');
unused.forEach(line => console.log('  ' + line));
