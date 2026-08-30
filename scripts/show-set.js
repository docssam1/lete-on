#!/usr/bin/env node
'use strict';
/* 한 레슨의 지문과 문항을 사람이 읽을 수 있게 펼쳐 준다.
 * 보기 길이 보정 작업용 — 어느 보기가 왜 짧은지 보려면 지문이 옆에 있어야 한다.
 *   node scripts/show-set.js rp1            # 두 세트 전부
 *   node scripts/show-set.js rp1 extra      # 추가 학습만
 *   node scripts/show-set.js rp1 new flag   # 유사 지문 · 최장 보기로 걸린 문항만 */
const path = require('path');
const DATA = path.join(__dirname, '..', 'reading-world', 'data');
global.window = { LESSONS: {} };
const id = process.argv[2];
const which = process.argv[3] || 'both';
const onlyFlagged = process.argv[4] === 'flag';
try { require(path.join(DATA, id + '.js')); } catch (e) { console.error(e.message); }
const L = global.window.LESSONS[id];
if (!L) { console.error('not found: ' + id); process.exit(1); }
const sets = [['extra', '추가 학습', L.extraLearning], ['new', '유사 지문', L.newPassage]];
sets.forEach(([k, label, s]) => {
  const tag = k === 'extra' ? '[추가]' : '[유사]';
  if (!s || (which !== 'both' && which !== k)) return;
  console.log(`\n===== ${id} / ${label} — ${s.title}`);
  (s.passage || []).forEach((p, i) => console.log(`  [${i + 1}] ${p}`));
  console.log('');
  (s.questions || []).forEach((q, i) => {
    const ch = (q[2] || []).map(String);
    const ai = 'ABCD'.indexOf(q[3]);
    const lens = ch.map(c => c.length), mx = Math.max(...lens), mn = Math.min(...lens);
    const quoted = /fact|opinion/i.test(q[0]);
    const longFlag = lens[ai] === mx && lens.filter(x => x === mx).length === 1 && mx >= 25 && !quoted;
    const shortFlag = lens[ai] === mn && lens.filter(x => x === mn).length === 1 && mx - mn >= 20 && mx >= 25 && !quoted;
    const flag = longFlag || shortFlag;
    if (onlyFlagged && !flag) return;
    console.log(`${tag} Q${i + 1} ${longFlag ? '★' : shortFlag ? '▽' : ' '} ${q[0]} — ${q[1]}`);
    ch.forEach((c, j) => console.log(`   ${'ABCD'[j]}${j === ai ? '*' : ' '} (${c.length}) ${c}`));
  });
});
