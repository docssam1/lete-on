#!/usr/bin/env node
'use strict';
/* Topic-based book papers: all supported volumes, band provenance, unique
 * questions, reproducibility, answer grading and a usable app practice link. */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
for (const page of ['index.html', 'placement-sheet.html']) {
  const scripts = [...read(page).matchAll(/<script\s+[^>]*src=["']([^"']+)["']/g)].map(m => m[1].split('?')[0]);
  for (const source of ['data/placement-books.js', 'data/book-volume-topics.js'])
    assert(scripts.indexOf(source) >= 0 && scripts.indexOf(source) < scripts.indexOf('data/placement-plan.js'), page + ': ' + source + ' must load before the plan');
}
const pageScripts = [...read('index.html').matchAll(/<script\s+[^>]*src=["']([^"']+)["']/g)].map(m => m[1].split('?')[0]);
const generators = pageScripts.filter(file => /^engine\/(?:generators\.js|rng\.js|threads\/[^/]+\.js)$/.test(file));
const units = fs.readdirSync(path.join(ROOT, 'data/units')).filter(f => f.endsWith('.js')).sort().map(f => 'data/units/' + f);
const files = [...new Set([...generators, 'data/curriculum.js', 'data/threads.js', 'data/middle-pacing.js',
  'data/wordable.js', 'data/courses.js', 'data/stages.js', ...units,
  'data/placement-books.js', 'data/dunoro-courses.js', 'data/soma-p-2019.js', 'data/book-volume-topics.js', 'data/placement-plan.js'])];
const world = { console: { log() {}, warn() {}, error() {} } }; world.window = world;
const context = vm.createContext(world);
files.forEach(file => vm.runInContext(read(file), context, { filename: file, timeout: 20000 }));
const series = [
  ['soma-k','NM_SOMA_K_2019'], ['soma-a','NM_SOMA_A_2019'], ['soma-b','NM_SOMA_B_2019'],
  ['soma-c','NM_SOMA_C_2019'], ['soma-d','NM_SOMA_D_2019'],
  ['miracle-pre-2023','NM_MIRACLE_PRE_2023'], ['miracle-elem-2021','NM_MIRACLE_ELEM_2021']
];
const plain = x => JSON.parse(JSON.stringify(x));
const counts = { previous: 6, current: 10, next: 4 };
const seeds = process.argv.includes('--quick') ? 3 : 20;
let plans = 0;
const unasked = [];
for (const [id, key] of series) {
  const data = world[key]; assert(data && data.courses.length > 0, id + ' data');
  for (const row of data.courses) {
   const seenCurrent = new Set();
   for (let seed = 0; seed < seeds; seed++) {
    const where = id + ' ' + row.course + ' seed ' + seed;
    const plan = world.NM_PLACEMENT_PLAN.buildBook(id, row.course, seed);
    assert.deepStrictEqual(plain(plan), plain(world.NM_PLACEMENT_PLAN.buildBook(id, row.course, seed)), where + ': deterministic');
    assert.equal(plan.book.series, id, where + ': series');
    assert.equal(plan.book.course, row.course, where + ': volume');
    assert.equal(plan.items.length, 20, where + ': 20 questions');
    assert.equal(new Set(plan.items.map(i => i.fingerprint)).size, 20, where + ': distinct visible questions');
    plan.items.filter(i => i.band === 'current').forEach(i => seenCurrent.add(i.thread + '@' + i.level));
    if (id === 'soma-k') {
      const limit = [0,10,20,10,20,10,20,20,7][row.course];
      for (const item of plan.items.filter(i => i.band === 'current')) {
        const shown = (item.renderData.tex || '').match(/\d+/g) || [];
        const values = shown.map(Number).concat(Array.isArray(item.answer) ? item.answer : [item.answer]);
        assert(values.every(value => value >= 0 && value <= limit), where + ': K' + row.course + ' heading limit ' + limit + ' exceeded by ' + values.join(','));
      }
    }
    for (const [band, count] of Object.entries(counts)) {
      const items = plan.items.filter(i => i.band === band);
      assert.equal(items.length, count, where + ': ' + band + ' count');
      const source = band === 'current' ? row : band === 'next' ? data.courses[row.course] || row :
        data.courses[row.course - 2] || (data.beforeBook && world[series.find(x => x[0] === data.beforeBook.series)?.[1] || 'NM_SOMA_P_2019']?.courses[data.beforeBook.course - 1]);
      for (const item of items) {
        assert(world.NM_COURSES[item.course] && item.session >= 1, where + ': practice anchor');
        if (source) assert(source.refs.includes(item.thread + '@' + item.level), where + ': ' + band + ' topic ' + item.thread + '@' + item.level);
      }
    }
    assert.equal(world.NM_PLACEMENT_PLAN.summarize(plan, plan.items.map(i => ({ id: i.id, value: i.answer, validationFlags:{validTargets:true} }))).correct, 20, where + ': scoring');
    plans++;
   }
   const missed = row.refs.filter(ref => !seenCurrent.has(ref));
   if (missed.length) unasked.push(id + ' ' + row.course + ': ' + missed.join(' '));
  }
}
const mixes = [
  [{series:'soma-p',course:1},{series:'soma-k',course:1}],
  // The parent may combine completed books without a shared arithmetic topic.
  [{series:'soma-p',course:1},{series:'soma-d',course:6}],
  [{series:'dunoro',course:17},{series:'miracle-elem-2021',course:6}],
  [{series:'soma-p',course:8},{series:'soma-k',course:8},{series:'soma-a',course:8},{series:'soma-b',course:8},
    {series:'soma-c',course:8},{series:'soma-d',course:6},{series:'miracle-pre-2023',course:5},{series:'miracle-elem-2021',course:12}]
];
assert.equal(world.NM_SOMA_P_2019.courses[0].refs.filter(ref => world.NM_SOMA_D_2019.courses[5].refs.includes(ref)).length,0,
  'cross-topic mix example must have no shared topic anchors');
for (const sources of mixes) for (let seed = 0; seed < seeds; seed++) {
  const plan = world.NM_PLACEMENT_PLAN.buildBooks(sources, seed), where = 'mix ' + sources.length + ' seed ' + seed;
  assert.deepStrictEqual(plain(plan), plain(world.NM_PLACEMENT_PLAN.buildBooks(sources, seed)), where + ': deterministic');
  assert.equal(plan.items.length, 20, where + ': 20 questions');
  assert.equal(new Set(plan.items.map(i => i.fingerprint)).size, 20, where + ': no repeated visible questions');
  for (const [band, count] of Object.entries(counts)) assert.equal(plan.items.filter(i => i.band === band).length, count, where + ': ' + band);
  for (const item of plan.items) assert(sources.some(x => x.series === item.sourceBook.series && x.course === item.sourceBook.course), where + ': source trace');
  if (sources[0].series === 'soma-p' && sources[1].series === 'soma-d')
    assert.equal(new Set(plan.items.filter(i => i.band === 'current').map(i => i.sourceBook.series)).size,2,
      where + ': unrelated completed topics both contribute');
  if (sources.length === 8) assert.equal(new Set(plan.items.filter(i => i.band === 'current').map(i => i.sourceBook.series)).size, 8, where + ': each book gets a completed topic');
  assert.equal(world.NM_PLACEMENT_PLAN.summarize(plan,plan.items.map(i => ({id:i.id,value:i.answer,validationFlags:{validTargets:true}}))).correct,20,where + ': scoring');
}
assert.throws(() => world.NM_PLACEMENT_PLAN.buildBooks([{series:'soma-k',course:1},{series:'soma-k',course:1}],0),/repeated/);
console.log(`BOOK_VOLUME_PLACEMENT_OK series=${series.length} volumes=${series.reduce((n,x)=>n+world[x[1]].courses.length,0)} seeds=${seeds} plans=${plans} mixed=${mixes.length*seeds}`);
if (unasked.length) console.log('Topic anchors not sampled as current: ' + unasked.join('; '));
