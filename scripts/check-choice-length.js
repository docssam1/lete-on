#!/usr/bin/env node
'use strict';

/*
 * Reports the questions where the correct answer is the single longest choice.
 *
 *   node scripts/check-choice-length.js br1 br2      # named lessons
 *   node scripts/check-choice-length.js              # every lesson it can load
 *
 * Why this exists: across the three CARS books this ran at 67% before it was
 * fixed, and it still sits near 70% in Reading Prime, WonderSkills and Subject
 * Link. A student who reads nothing and presses the longest option scores that
 * much. Chance is 25%.
 *
 * The fix is never to pad the distractors. It is to give them the same kind of
 * specificity the answer has — a wrong choice that is short because it is vague
 * gets discarded without being read, so it was never a real competitor. Where
 * the answer has to be long (a summary), shorten it and write the distractors
 * as proper summaries instead.
 *
 * Two shapes are skipped, because a length strategy cannot work on them:
 *   - every choice under 25 characters (four names, four two-word definitions)
 *   - questions whose choices are sentences quoted out of the passage, where
 *     changing the length would mean misquoting it (fact-and-opinion items)
 */

const path = require('path');
const DATA = path.join(__dirname, '..', 'reading-world', 'data');

function loadLessons() {
  global.window = { LESSONS: {} };
  const load = f => { try { require(path.join(DATA, f)); } catch (e) { /* optional */ } };
  for (let i = 1; i <= 10; i++) load(`lesson${i}.js`);
  for (let i = 1; i <= 10; i++) load(`lc${i}.js`);
  load('cd1.js'); load('cars-d-engine.js');
  for (let i = 2; i <= 15; i++) load(`cd${i}-data.js`);
  for (let i = 1; i <= 7; i++) load(`rp${i}.js`);
  for (let i = 1; i <= 12; i++) load(`ws${i}.js`);
  for (let i = 1; i <= 16; i++) load(`sl${i}.js`);
  for (let i = 1; i <= 20; i++) load(`br${i}.js`);
  return global.window.LESSONS || {};
}

const SHORT = 25;
const quoted = q => /fact|opinion/i.test(q[0] || '');

function scan(id, label, questions) {
  const rows = [];
  let counted = 0, flagged = 0;
  (questions || []).forEach((q, i) => {
    const ch = (q[2] || []).map(String);
    if (ch.length < 2) return;
    const ai = 'ABCD'.indexOf(q[3]);
    if (ai < 0 || !ch[ai]) return;
    const lens = ch.map(c => c.length);
    if (Math.max(...lens) < SHORT) return;          // no length signal to exploit
    if (quoted(q)) return;                          // choices are quotations
    counted++;
    const mx = Math.max(...lens);
    if (lens[ai] === mx && lens.filter(x => x === mx).length === 1) {
      flagged++;
      const second = lens.slice().sort((a, b) => b - a)[1];
      rows.push(`    Q${i + 1} ${q[0]} — 정답 ${lens[ai]}자 vs 차순 ${second}자 (+${lens[ai] - second})`);
    }
  });
  return { id, label, counted, flagged, rows };
}

function main() {
  const LESSONS = loadLessons();
  const want = process.argv.slice(2);
  const ids = want.length ? want : Object.keys(LESSONS);
  let counted = 0, flagged = 0;

  ids.forEach(id => {
    const L = LESSONS[id];
    if (!L) { console.log(`${id}  레슨을 찾을 수 없음`); return; }
    [['추가 학습', L.extraLearning], ['유사 지문', L.newPassage]].forEach(([label, set]) => {
      if (!set || !set.questions) return;
      const r = scan(id, label, set.questions);
      counted += r.counted; flagged += r.flagged;
      if (r.flagged) {
        console.log(`\n${id} / ${label} — ${r.flagged}/${r.counted}`);
        r.rows.forEach(x => console.log(x));
      }
    });
  });

  const pct = counted ? Math.round((flagged / counted) * 100) : 0;
  console.log(`\n검사 ${counted}문항 · 정답이 유일한 최장 보기 ${flagged}문항 (${pct}%) · 우연 기대값 25%`);
  process.exit(pct > 40 ? 1 : 0);
}

main();
