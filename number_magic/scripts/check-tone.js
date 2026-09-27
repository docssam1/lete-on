#!/usr/bin/env node
/* ============================================================
   말투 검사 — 중등·고등 콘텐츠는 "…합니다"체여야 한다 (2026-09-21)
   ------------------------------------------------------------
   원장 "이건 과정에 따라 어울리도록". 초등·유아는 지금 그대로 해요체,
   유닛 tier 가 middle·high·algebra·calculus 계열이면 합니다체다.

   `tone-middle.js` 가 한 번 바꿔 놓아도, 다음에 누가 문장을 새로 쓰면 손이
   가는 대로 "…해요"가 다시 섞인다. 그래서 검사기로 고정한다.

   무엇을 잡나 — 평서문 종결 "…요". 문장 끝은 tone-middle.js 와 같은 기준이다
   (닫는 태그를 건너뛰고 마침표·느낌표·말줄임·줄표·여는괄호·문자열 끝).
   무엇을 봐주나 — 권유("…세요")와 질문("…할까요"). 둘은 일부러 남겨 둔 것이다.
   단 "…니까요"(이유)는 질문이 아니라 평서문이므로 잡는다.

     node scripts/check-tone.js     # 실패하면 exit 1
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

global.window = {};
for (const f of fs.readdirSync(path.join(ROOT, 'data/units'))) require(path.join(ROOT, 'data/units', f));
require(path.join(ROOT, 'data/threads.js'));
const U = global.window.NM_UNITS, T = global.window.NM_THREADS;
const isMid = t => /^(middle|high|algebra|calculus)/.test(t || '');

const TAIL = '(?=(?:<\\/[a-zA-Z][^>]*>)*\\s*(?:[.!…(]|—|$))';
const HAEYO = new RegExp('([가-힣]{1,6}요)' + TAIL, 'g');
const spared = w => /세요$/.test(w) || (/까요$/.test(w) && !/니까요$/.test(w));

/* 검사 대상 문장 모으기 — 화면·인쇄에 실제로 나가는 ko 문자열만 */
const rows = [];
const add = (where, s) => { if (s && typeof s.ko === 'string') rows.push([where, s.ko]); };
for (const k of Object.keys(T)) {
  const t = T[k], u = t.unit && U[t.unit];
  if (!u || !isMid(u.tier)) continue;
  add(k + '.concept', t.concept);
  add(k + '.instr', t.instr);
  (t.levels || []).forEach((l, i) => add(k + '.levels[' + i + '].concept', l.concept));
}
for (const id of Object.keys(U)) {
  const u = U[id];
  if (!isMid(u.tier)) continue;
  add(id + '.subtitle', u.subtitle);
  if (u.practice) add(id + '.practice.intro', u.practice.intro);
  const d = u.discover || {};
  if (d.story) { add(id + '.story.hook', d.story.hook); add(id + '.story.history', d.story.history); }
  add(id + '.rule', d.rule);
  (d.stages || []).forEach((s, i) => {
    const w = id + '.stages[' + i + ']';
    add(w + '.tag', s.tag); add(w + '.desc', s.desc); add(w + '.result', s.result); add(w + '.book', s.book);
    (s.mathSteps || []).forEach((m, j) => add(w + '.mathSteps[' + j + ']', m));
  });
  const c = u.check || {};
  add(id + '.check.open', c.open); add(id + '.check.openHint', c.openHint);
  (c.fills || []).forEach((f, i) => add(id + '.check.fills[' + i + '].hint', f.hint));
  if (u.lab) add(id + '.lab.intro', u.lab.intro);
  if (u.arena) add(id + '.arena.rule', u.arena.rule);
}

const bad = [];
for (const [where, ko] of rows) {
  for (const m of ko.matchAll(HAEYO)) {
    if (spared(m[1])) continue;
    bad.push([where, m[1], ko.replace(/<[^>]+>/g, '')]);
  }
}

console.log('검사한 중등·고등 ko 문장: ' + rows.length + '개');
if (!bad.length) {
  console.log('통과 — 중등·고등 콘텐츠에 해요체 종결이 없다.');
  process.exit(0);
}
console.log('\n✗ 해요체 종결 ' + bad.length + '건 — 중등·고등은 "…합니다"체다:');
for (const [where, w, ko] of bad.slice(0, 40)) {
  console.log('  ' + where + '  「' + w + '」');
  console.log('      ' + ko.slice(0, 120));
}
if (bad.length > 40) console.log('  … 외 ' + (bad.length - 40) + '건');
console.log('\n고치는 법: node scripts/tone-middle.js (미리보기) → --write.');
console.log('표에 없는 종결은 바꾸지 않고 보고하니, 보고된 것을 MAP 에 더하거나 문장을 고쳐 쓴다.');
process.exit(1);
