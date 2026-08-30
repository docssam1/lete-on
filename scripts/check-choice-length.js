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
  const rows = [], shortRows = [];
  let counted = 0, flagged = 0, shortFlagged = 0;
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
    /* 반대 방향도 신호다. 정답이 늘 길어서 티가 나는 것을 고치겠다고 정답만
       깎으면 이번엔 "제일 짧은 것이 정답"이 된다 — 찍는 방법이 바뀔 뿐이다. */
    const mn = Math.min(...lens);
    if (lens[ai] === mn && lens.filter(x => x === mn).length === 1 && mx - mn >= 20) {
      shortFlagged++;
      const second = lens.slice().sort((a, b) => a - b)[1];
      /* 목표 길이도 같이 적는다 — 정답이 최장 -19자 이상이면 격차가 좁아 신호가 안 된다 */
      shortRows.push(`    Q${i + 1} ${q[0]} — 정답 ${lens[ai]}자 · 차순 ${second}자 · 최장 ${mx}자 → ${mx - 19}자 이상으로 [최단]`);
    }
  });
  return { id, label, counted, flagged, rows, shortFlagged, shortRows };
}

function main() {
  const LESSONS = loadLessons();
  const want = process.argv.slice(2);
  const ids = want.length ? want : Object.keys(LESSONS);
  let counted = 0, flagged = 0, shortFlagged = 0;

  ids.forEach(id => {
    const L = LESSONS[id];
    if (!L) { console.log(`${id}  레슨을 찾을 수 없음`); return; }
    [['추가 학습', L.extraLearning], ['유사 지문', L.newPassage]].forEach(([label, set]) => {
      if (!set || !set.questions) return;
      const r = scan(id, label, set.questions);
      counted += r.counted; flagged += r.flagged; shortFlagged += r.shortFlagged;
      if (r.flagged || r.shortFlagged) {
        console.log(`\n${id} / ${label} — 최장 ${r.flagged}/${r.counted} · 최단 ${r.shortFlagged}/${r.counted}`);
        r.rows.forEach(x => console.log(x));
        r.shortRows.forEach(x => console.log(x));
      }
    });
  });

  const pct = counted ? Math.round((flagged / counted) * 100) : 0;
  const spct = counted ? Math.round((shortFlagged / counted) * 100) : 0;
  console.log(`\n검사 ${counted}문항 · 최장=정답 ${flagged}문항 (${pct}%) · 최단=정답 ${shortFlagged}문항 (${spct}%) · 우연 기대값 각 25%`);
  process.exit(pct > 40 || spct > 40 ? 1 : 0);
}

main();
