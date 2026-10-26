#!/usr/bin/env node
'use strict';
/* 학습지 글자본 자동 검사 (2026-10-26, 전체 학습지 검수에서 손으로 찾은 것 중 기계가 잡을 수 있는 것).
   입력: scripts/render-worksheet-text.js 가 만든 폴더.
   usage: node scripts/check-worksheet-text.js <글자본 폴더> [--strict]
   잡는 것
     particle   처리 안 된 조사 「이(가)」, 숫자·분수 뒤 받침 오류(「9을」「2/3과」「72이에요」), 「노선와」류
     leftover   빈 수식 $$, 「= ____」, undefined/NaN, 수식 밖 캐럿(x^2), \t 가 탭이 된 「ext」·「qquad」, 내부 코드 노출
     daysplit   하루 분량이 가장 적은 날의 2배 이상(10문항 차 이상)
     sorted     정답지 한 묶음에서 답이 8개 이상 연달아 커지기만 함(답 짐작 가능)
   --strict 면 particle·leftover 가 하나라도 있으면 exit 1. 나머지는 보고만 한다. */
const fs = require('fs'), path = require('path');
const DIR = process.argv[2];
if (!DIR) { console.error('usage: check-worksheet-text.js <dir> [--strict]'); process.exit(2); }
const strict = process.argv.includes('--strict');
const bat = ch => { const c = ch.charCodeAt(0) - 0xAC00; return c >= 0 && c < 11172 ? c % 28 : -1; };
const digitBat = { 0: 1, 1: 8, 2: 0, 3: 16, 4: 0, 5: 0, 6: 1, 7: 8, 8: 8, 9: 0 }; // 영 일 이 삼 사 오 육 칠 팔 구
const wrongJosa = (p, b) => (p === '를' && b > 0) || (p === '을' && b === 0) || (p === '와' && b > 0) || (p === '과' && b === 0) ||
  (p === '는' && b > 0) || (p === '은' && b === 0) || (p === '가' && b > 0) || (p === '이' && b === 0) || (p === '이에요' && b === 0);
const hits = { particle: new Map(), leftover: new Map(), daysplit: [], sorted: [] };
const add = (kind, key, where) => { const m = hits[kind]; if (!m.has(key)) m.set(key, []); m.get(key).push(where); };
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.txt')).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
for (const f of files) {
  const raw = fs.readFileSync(path.join(DIR, f), 'utf8'), where = f.replace(/\.txt$/, '');
  const body = raw.slice(raw.indexOf('\n') + 1);
  const outside = body.replace(/\$[^$\n]*\$/g, ' ');
  for (const m of body.matchAll(/[가-힣0-9a-z】)}]\((이|가|은|는|을|를|와|과|으)\)/g)) add('particle', m[0], where);
  for (const m of outside.matchAll(/(\d+)(?:\/(\d+))?(이에요|를|을|와|과|는|은|가|이)(?=[\s.,?!)」]|$)/gm)) {
    const last = m[1].slice(-1); // 분수 a/b 는 「b분의 a」로 읽으니 분자 끝자리
    if (wrongJosa(m[3], digitBat[last])) add('particle', m[0], where);
  }
  for (const m of outside.matchAll(/([가-힣]+)(와|를)(?=\s)/g)) if (bat(m[1].slice(-1)) > 0) add('particle', m[0], where);
  // 수식 밖에서만 보는 것
  const leftovers = [[/=\s*_{3,}/g, '= ____'], [/undefined|NaN|\[object/g, null],
    [/[A-Za-z0-9)]\^[\d{(A-Za-z]/g, '수식 밖 ^'],
    [/\((?:MD|CH|ML|DV|FR|A-|B-|C-|H-|M-)\d+\)|factorCancel|\[계수,|실제 문항은 항상/g, '내부 표기']];
  for (const [re, label] of leftovers) for (const m of outside.matchAll(re)) add('leftover', label || m[0], where);
  // 수식 안팎 모두: 빈 수식(렌더러가 ' $..$ '로 감싸므로 붙은 $$ 는 내용이 빈 수식), 백슬래시가 빠진 TeX 명령
  for (const m of body.matchAll(/(^|\s)\$\$(?=\s|$)/gm)) add('leftover', '빈 $$', where);
  for (const m of body.matchAll(/(^|[^\\A-Za-z])(ext\{|qquad|mathrm\{)/gm)) add('leftover', '\\ 빠진 TeX(' + m[2] + ')', where);
  let days = {};
  try{days=JSON.parse(raw.slice(1,raw.indexOf('\n'))).days||{};}catch{}
  if(!Object.keys(days).length)for (const m of body.matchAll(/^(\d)일차(?:–\d일차)?\t\d+\t[^\t]+\t(\d+)문항/gm)) days[m[1]] = (days[m[1]] || 0) + Number(m[2]);
  const v = Object.values(days);
  if (v.length >= 2) { const mx = Math.max(...v), mn = Math.min(...v); if (mx >= 2 * mn && mx - mn >= 10) hits.daysplit.push(where + ' ' + JSON.stringify(days)); }
  let block = null, run = [];
  const flush = () => {
    let best = 0, cur = 1, distinct = new Set([run[0]]);
    for (let i = 1; i < run.length; i++) { if (run[i] >= run[i - 1]) { cur++; distinct.add(run[i]); } else { if (cur > best && distinct.size >= 3) best = cur; cur = 1; distinct = new Set([run[i]]); } }
    if (cur > best && distinct.size >= 3) best = cur;
    if (best >= 8) hits.sorted.push(where + ' ' + block + ' ×' + best);
  };
  for (const line of body.split('\n')) {
    const h = line.match(/#([A-Z]+\d+-L\d+)x\d+/);
    if (h) { if (block && run.length) flush(); block = h[1]; run = []; continue; }
    const a = block && line.match(/^\(\d+\)\s+(-?\d+(?:\.\d+)?)$/);
    if (a) run.push(Number(a[1]));
  }
  if (block && run.length) flush();
}
const show = (title, m) => {
  console.log(`\n[${title}] ${m.size} 종류`);
  [...m].sort((a, b) => b[1].length - a[1].length).forEach(([k, w]) => console.log(`  ${w.length}× ${k}  — ${[...new Set(w)].slice(0, 6).join(' ')}${w.length > 6 ? ' …' : ''}`));
};
console.log(`WORKSHEET_TEXT_CHECK rounds=${files.length}`);
show('particle 조사', hits.particle);
show('leftover 조판 흔적', hits.leftover);
console.log(`\n[daysplit 하루 분량 쏠림] ${hits.daysplit.length} 회차`); hits.daysplit.slice(0, 40).forEach(s => console.log('  ' + s));
console.log(`\n[sorted 정답 오름차순] ${hits.sorted.length} 묶음`); hits.sorted.slice(0, 40).forEach(s => console.log('  ' + s));
const bad = hits.particle.size + hits.leftover.size;
if (strict && bad) process.exit(1);
