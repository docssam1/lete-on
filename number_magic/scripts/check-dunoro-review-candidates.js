#!/usr/bin/env node
'use strict';
/* Read-only review of proposed Dunoro topic candidates. Existing app refs and
 * reproducible samples do not establish book equivalence or paper readiness. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const candidateFile = path.join(root, 'data/dunoro-review-candidates.json');
const issues = [];
const issue = (where, message) => issues.push(`${where}: ${message}`);
const expectedLevel = course => course <= 10 ? 1 : course <= 16 ? 2 : 3;

if (!fs.existsSync(candidateFile)) {
  console.error('DUNORO_REVIEW_MISSING: data/dunoro-review-candidates.json is not present');
  process.exit(2);
}

let data;
try { data = JSON.parse(fs.readFileSync(candidateFile, 'utf8')); }
catch (error) {
  console.error('DUNORO_REVIEW_INVALID_JSON: ' + error.message);
  process.exit(1);
}
if (!data || data.version !== 1 || !Array.isArray(data.courses))
  issue('catalog', 'expected {version:1,courses:[...]}');
const topicOnly = data && data.status === 'topic-candidates-only';
if (!topicOnly) issue('catalog', 'status must remain topic-candidates-only');
const requiredGlobalHolds = [
  'book-edition-unverified', 'generator-number-bounds-unverified',
  'problem-form-unverified', 'solution-method-unverified',
  'answer-format-unverified'
];
if (!Array.isArray(data && data.globalHolds)) issue('catalog', 'globalHolds must be an array');
else {
  for (const hold of requiredGlobalHolds)
    if (!data.globalHolds.includes(hold)) issue('catalog', `missing global hold ${hold}`);
}
const rows = Array.isArray(data && data.courses) ? data.courses : [];
if (rows.length !== 25) issue('catalog', `expected exactly 25 courses, found ${rows.length}`);

// Load the same registered thread definitions and generators as the app, in
// page order, inside a disposable VM. No product or candidate file is written.
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const engineFiles = [...html.matchAll(/<script\s+[^>]*src=["']([^"']+)["']/g)]
  .map(match => match[1].split('?')[0])
  .filter(file => /^engine\/(?:generators\.js|rng\.js|threads\/[^/]+\.js)$/.test(file));
const world = { console }; world.window = world;
const context = vm.createContext(world);
try {
  for (const file of [...engineFiles, 'data/threads.js'])
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context,
      { filename: file, timeout: 10000 });
} catch (error) { issue('app sources', error.message); }
if (!world.NM_THREADS || !world.NM_TGEN || !world.NM_RNG)
  issue('app sources', 'thread, generator or seeded RNG registry is unavailable');

const bandCounts = { previous: 0, current: 0, next: 0 };
const emptyBands = { previous: 0, current: 0, next: 0 };
let holds = 0, samples = 0, crossBandOverlaps = 0;
const seenCourses = new Set();
for (const [index, row] of rows.entries()) {
  const where = `courses[${index}]`;
  if (!row || !Number.isInteger(row.course) || row.course < 1 || row.course > 25) {
    issue(where, 'course must be an integer from 1 to 25');
    continue;
  }
  if (seenCourses.has(row.course)) issue(where, `duplicate course ${row.course}`);
  seenCourses.add(row.course);
  if (row.level !== expectedLevel(row.course))
    issue(where, `course ${row.course} must be Level ${expectedLevel(row.course)}`);
  if (!row.bands || typeof row.bands !== 'object' || Array.isArray(row.bands))
    issue(where, 'bands must contain previous, current and next');
  if (!Array.isArray(row.holds)) issue(where, 'holds must be an array');
  holds += Array.isArray(row.holds) ? row.holds.length : 0;
  const firstBandByRef = new Map();
  for (const band of ['previous', 'current', 'next']) {
    const bandRow = row.bands && row.bands[band];
    const refs = bandRow && bandRow.refs;
    if (!Array.isArray(refs)) { issue(where, `bands.${band}.refs must be an array`); continue; }
    bandCounts[band] += refs.length;
    if (!refs.length) emptyBands[band]++;
    const seenInBand = new Set();
    for (const ref of refs) {
      const refWhere = `${where}.bands.${band}.refs[${String(ref)}]`;
      const match = typeof ref === 'string' && /^([A-Z][A-Z0-9]*)@([1-9]\d*)$/.exec(ref);
      if (!match) { issue(refWhere, 'expected an exact THREAD@LEVEL ref'); continue; }
      if (seenInBand.has(ref)) issue(refWhere, 'duplicate ref within band');
      seenInBand.add(ref);
      if (firstBandByRef.has(ref) && firstBandByRef.get(ref) !== band) crossBandOverlaps++;
      else firstBandByRef.set(ref, band);
      const thread = world.NM_THREADS && world.NM_THREADS[match[1]];
      const level = thread && (thread.levels || []).find(item => item.id === Number(match[2]));
      const generator = thread && world.NM_TGEN && world.NM_TGEN[thread.gen];
      if (!thread) { issue(refWhere, 'thread is absent from data/threads.js'); continue; }
      if (!level) { issue(refWhere, 'level is absent from data/threads.js'); continue; }
      if (typeof generator !== 'function') { issue(refWhere, `generator ${thread.gen} is unavailable`); continue; }
      if (!world.NM_RNG) continue;
      for (const seed of [1, 2, 3]) {
        const make = () => generator(JSON.parse(JSON.stringify(level.params || {})),
          world.NM_RNG.mulberry32(world.NM_RNG.hashSeed(`dunoro-review:${row.course}:${ref}:${seed}`)));
        try {
          const first = make(), second = make();
          if (!first || typeof first !== 'object' || Array.isArray(first))
            issue(refWhere, `seed ${seed}: generator did not return a problem object`);
          else if (JSON.stringify(first) !== JSON.stringify(second))
            issue(refWhere, `seed ${seed}: generator output is not reproducible`);
          samples++;
        } catch (error) { issue(refWhere, `seed ${seed}: ${error.message}`); }
      }
    }
  }
  if (Array.isArray(row.holds)) row.holds.forEach((note, i) => {
    if (typeof note !== 'string' || !note.trim())
      issue(`${where}.holds[${i}]`, 'expected a nonblank note');
  });
}
for (let course = 1; course <= 25; course++)
  if (!seenCourses.has(course)) issue('catalog', `course ${course} is missing`);
const byCourse = new Map(rows.filter(row => row && Number.isInteger(row.course))
  .map(row => [row.course, row]));
for (let course = 1; course <= 25; course++) {
  const row = byCourse.get(course);
  const previous = row && row.bands && row.bands.previous && row.bands.previous.refs;
  if (Array.isArray(previous) && course === 1 && previous.length)
    issue('course 1', 'previous.refs must be empty: no prior book course');
  if (Array.isArray(previous) && course > 1) {
    const prior = byCourse.get(course - 1);
    const priorCurrent = prior && prior.bands && prior.bands.current && prior.bands.current.refs;
    if (Array.isArray(priorCurrent)) {
      const allowed = new Set(priorCurrent);
      for (const ref of previous)
        if (!allowed.has(ref)) issue(`course ${course}`, `previous ref ${String(ref)} is absent from course ${course - 1} current.refs`);
    }
  }
  const next = row && row.bands && row.bands.next && row.bands.next.refs;
  if (Array.isArray(next) && course < 25) {
    const successor = byCourse.get(course + 1);
    const successorCurrent = successor && successor.bands && successor.bands.current && successor.bands.current.refs;
    if (Array.isArray(successorCurrent)) {
      const allowed = new Set(successorCurrent);
      for (const ref of next)
        if (!allowed.has(ref)) issue(`course ${course}`, `next ref ${String(ref)} is absent from course ${course + 1} current.refs`);
    }
  }
}
const last = byCourse.get(25);
const lastNext = last && last.bands && last.bands.next && last.bands.next.refs;
if (Array.isArray(lastNext) && lastNext.length)
  issue('course 25', 'next.refs must be empty: no later book course');

const summary = `courses=${seenCourses.size}/25 topicCandidates(previous=${bandCounts.previous},current=${bandCounts.current},next=${bandCounts.next}) emptyBands(previous=${emptyBands.previous},current=${emptyBands.current},next=${emptyBands.next}) crossBandOverlaps=${crossBandOverlaps} holds=${holds} generatorSamples=${samples} paperReady=${topicOnly ? 0 : 'UNASSERTED'}`;
if (issues.length) {
  issues.forEach(message => console.error('DUNORO_REVIEW_ERROR: ' + message));
  console.error(`DUNORO_REVIEW_FAILED ${summary} issues=${issues.length}`);
  process.exitCode = 1;
} else {
  console.log(`DUNORO_REVIEW_OK ${summary}`);
  console.log('Topic candidates only; book equivalence and 6/10/4 paper composition remain unverified.');
}
