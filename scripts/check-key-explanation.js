#!/usr/bin/env node
'use strict';
/*
 * 정답 letter가 해설과 어긋난 문항을 찾는다.
 *
 *   node scripts/check-key-explanation.js            # 실을 수 있는 모든 레슨
 *   node scripts/check-key-explanation.js sl5 ws3
 *
 * 왜 필요한가: sl5에서 정답 letter가 A인데 해설은 D의 내용을 설명하고, A의
 * 문장은 지문과 반대되는 사실인 문항을 두 개 찾았다("화산 압력으로 생겼다"
 * vs 지문의 "바닷물이 증발했다"). 보기 순서를 옮기면서 letter만 남고 내용이
 * 따라가지 않은 흔적이다. 길이·분포 검사는 이런 것을 전혀 못 잡는다.
 *
 * 방법은 단순하다. 해설과 각 보기의 내용어 겹침을 재서, 정답이 아닌 보기가
 * 정답보다 뚜렷하게 더 겹치면 후보로 보고한다. 판정이 아니라 후보다 —
 * 해설이 정답을 그대로 되풀이하지 않는 문항도 많기 때문에 사람이 봐야 한다.
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

const STOP = new Set(('a an the and or but of to in on at for with from by as is are was were be been being that this ' +
  'these those it its they them their he she his her him you your we our not no so than then there here what which ' +
  'who whom when where why how all any both each few more most other some such only own same too very can will just ' +
  'passage says text author states because into over about after before during while would could should').split(' '));

const words = t => new Set(String(t).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
  .filter(w => w.length > 3 && !STOP.has(w)));

function overlap(a, b) {
  let n = 0; a.forEach(w => { if (b.has(w)) n++; });
  return b.size ? n / Math.sqrt(b.size) : 0;
}

function main() {
  const LESSONS = loadLessons();
  const want = process.argv.slice(2);
  const ids = want.length ? want : Object.keys(LESSONS);
  let checked = 0, flagged = 0;

  ids.forEach(id => {
    const L = LESSONS[id];
    if (!L) { console.log(`${id}  레슨을 찾을 수 없음`); return; }
    [['추가 학습', L.extraLearning], ['유사 지문', L.newPassage]].forEach(([label, set]) => {
      if (!set || !set.questions) return;
      set.questions.forEach((q, i) => {
        const ch = (q[2] || []).map(String);
        const ai = 'ABCD'.indexOf(q[3]);
        const exp = q[4];
        if (ai < 0 || !ch[ai] || !exp || String(exp).length < 30) return;
        checked++;
        /* 해설이 "Options B, C, and D are opinions"처럼 오답 letter를 열거하면
           그 문장이 오답 쪽 낱말을 끌고 와 오탐이 된다. 그런 문장은 뺀다. */
        const cleaned = String(exp).split(/(?<=[.!?])\s+/)
          .filter(sen => !/\bOptions?\s+[A-D]\b/.test(sen)).join(' ');
        const e = words(cleaned || exp);
        if (e.size < 4) return;
        const scores = ch.map(c => overlap(e, words(c)));
        const best = Math.max(...scores);
        const bi = scores.indexOf(best);
        /* 정답이 최고가 아니고, 1등과의 차이가 뚜렷할 때만 (0.35는 sl5의 두 건이
           0.5~0.9로 벌어졌던 것을 기준으로 잡되 오탐을 줄이려 넉넉히 뒀다) */
        if (bi !== ai && best - scores[ai] > 0.35) {
          flagged++;
          console.log(`\n${id}/${label} Q${i + 1} ${q[0]}`);
          console.log(`  정답 ${q[3]} (겹침 ${scores[ai].toFixed(2)}): ${ch[ai]}`);
          console.log(`  더 겹치는 보기 ${'ABCD'[bi]} (${best.toFixed(2)}): ${ch[bi]}`);
          console.log(`  해설: ${String(exp).slice(0, 140)}`);
        }
      });
    });
  });
  console.log(`\n검사 ${checked}문항 · 정답보다 다른 보기가 해설에 더 가까운 문항 ${flagged}건 (후보)`);
}

main();
