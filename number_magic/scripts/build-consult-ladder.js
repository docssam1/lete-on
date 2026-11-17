#!/usr/bin/env node
/* ============================================================
   상담판 단계표 만들기 — 2026-11-17
   원장 「지금 무슨 책 몇 권을 하고 있고 두 자리 받아내림은 되고 … 정보가 부족하면 더 물어볼 수 있도록」
   → 「상담 버전」 → 「응 그렇게 만들어」.

   상담판(consult.html)은 문제를 풀게 하지 않고 보호자에게 묻는다. 묻는 기술의 차례는
   기적의 계산법 권별 주제(data/placement-books.js 의 coverage — 출판사 주제 메타데이터와 우리 유형을
   이어 둔 것)를 뼈대로 쓴다: 예비초등 1~5권 → 초등 1~12권 = 17단계.
   단계마다
     - 그 단계에서 새로 나오는 유형(앞 단계에 없던 스레드) 먼저, 많아야 6개
     - 이름은 우리 유형 이름(NM_THREADS, 3개 언어)
     - 보호자가 아이에게 내 볼 예시 한 문제(우리 생성기로 만든 것, 시드 고정 — 교재 문항이 아니다)
     - 그 유형·레벨이 처음 나오는 우리 과정(NM_COURSES 의 회차 드릴)
   을 data/consult-ladder.js 로 쓴다. 앱 엔진을 통째로 싣지 않으려고 미리 계산해 둔다.

   쓰는 법: node scripts/build-consult-ladder.js         # 다시 만들기
           node scripts/build-consult-ladder.js --check # 지금 파일이 최신인지(아니면 exit 1)
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'data/consult-ladder.js');

function load(){
  const box = { console, URL, setTimeout, clearTimeout, navigator: { language: 'ko' },
    document: { currentScript: null, addEventListener(){}, querySelector(){ return null; }, querySelectorAll(){ return []; },
      createElement(){ return { style: {}, setAttribute(){}, appendChild(){} }; }, documentElement: { lang: 'ko' } },
    localStorage: { getItem(){ return null; }, setItem(){} }, location: { search: '', hash: '', pathname: '/' }, addEventListener(){} };
  box.window = box; box.globalThis = box; vm.createContext(box);
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  for(const m of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)){
    const f = m[1].split(/[?#]/)[0];
    if(!/^(engine\/|data\/)/.test(f)) continue;
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), box, { filename: f });
  }
  if(!box.NM_PLACEMENT_BOOKS) vm.runInContext(fs.readFileSync(path.join(ROOT, 'data/placement-books.js'), 'utf8'), box);
  return box;
}

const W = load();
const TH = W.NM_THREADS, COURSES = W.NM_COURSES, BOOKS = W.NM_PLACEMENT_BOOKS, TGEN = W.NM_TGEN, RNG = W.NM_RNG;

/* 과정 차례 — order 순. 첫 등장 = 회차 드릴(복습 표시 제외)에서 그 유형·레벨이 처음 나오는 과정 */
const courseList = Object.keys(COURSES).filter(k => /^C\d+$/.test(k))
  .map(k => ({ key: k, n: +k.slice(1), c: COURSES[k] }))
  .sort((a, b) => (a.c.order ?? a.n) - (b.c.order ?? b.n));
function firstCourse(t, lv){
  const hit = pred => courseList.find(({ c }) => (c.sessions || []).some(s => (s.drills || []).some(d => !d.review && pred(d))));
  const exact = hit(d => d.t === t && d.lv === lv);
  if(exact) return { key: exact.key, exact: true };
  const any = hit(d => d.t === t);
  return any ? { key: any.key, exact: false } : null;
}

/* 예시 문제 — 보호자가 아이에게 그대로 내 볼 짧은 식 하나. 그림 위젯만 있는 유형은 예시 없음.
   { q: 묻는 식(KaTeX), a: 답이 채워진 식(KaTeX) }. 「… = □」로 끝나는 꼴을 먼저 고른다(아이에게 말로 내기 쉽다).
   생성기가 소수 답을 □/100 칸으로 받는 꼴이면 보호자에게는 소수로 보인다. */
function fill(tex, answers){
  let i = 0;
  return tex.replace(/\\square/g, () => String(answers[Math.min(i++, answers.length - 1)]));
}
function example(t, lv){
  const th = TH[t], gen = th && TGEN[th.gen];
  if(!gen) return null;
  const lvObj = (th.levels || []).find(l => l.id === lv) || {};
  let best = null;
  for(let i = 0; i < 60; i++){
    let p;
    try { p = gen(Object.assign({}, lvObj.params || {}), RNG.mulberry32(RNG.hashSeed('consult|' + t + '@' + lv + '|' + i))); } catch(e){ continue; }
    const tex = p && typeof p.tex === 'string' ? p.tex.trim() : '';
    if(!tex || tex.length > 46 || /\\text|\\begin|\\boxed|\[|\\,\\%|\\%/.test(tex) || !/\\square/.test(tex)) continue;
    const ans = (Array.isArray(p.answer) ? p.answer : [p.answer]).filter(v => v !== undefined && v !== null);
    if(!ans.length || ans.some(v => typeof v !== 'number' || !Number.isFinite(v))) continue;
    const eq = tex.lastIndexOf('=');
    if(eq < 0) continue;
    const lhs = tex.slice(0, eq).trim(), rhs = tex.slice(eq + 1).trim();
    let ex = null, rank = 9;
    if(rhs === '\\square' && !/\\square/.test(lhs)){ ex = { q: lhs + ' = \\square', a: lhs + ' = ' + ans[0] }; rank = 0; }
    else if(/\\square/.test(lhs) && !/\\square/.test(rhs) && ans.length === 1){ ex = { q: tex, a: fill(tex, ans) }; rank = 1; }
    else {
      const dec = /^\\d?frac\{\\square\}\{(10|100|1000)\}$/.exec(rhs);
      if(dec && ans.length === 1){ const v = ans[0] / +dec[1]; ex = { q: lhs + ' = \\square', a: lhs + ' = ' + String(+v.toFixed(3)) }; rank = 2; }
      else if(/^\d*\.?\\square$/.test(rhs) && ans.length === 1){ ex = { q: lhs + ' = \\square', a: fill(tex, ans) }; rank = 2; }
      else if(!/\\square/.test(lhs)){ ex = { q: tex, a: fill(tex, ans) }; rank = 3; }
    }
    if(ex && (!best || rank < best.rank)) best = Object.assign(ex, { rank });
    if(best && best.rank === 0) break;
  }
  if(!best) return null;
  delete best.rank;
  return best;
}

const steps = BOOKS.getSteps('miracle').filter(s => /^(pre-2023|elem-2021)-v\d+$/.test(s.id));
const seenThreads = new Set(), ladder = [];
for(const s of steps){
  const m = /^(pre-2023|elem-2021)-v(\d+)$/.exec(s.id);
  const refs = (s.coverage || []).map(r => { const [t, lv] = r.split('@'); return { t, lv: +lv }; });
  const byThread = new Map();
  refs.forEach(r => { if(TH[r.t] && (!byThread.has(r.t) || byThread.get(r.t) < r.lv)) byThread.set(r.t, r.lv); });
  const all = [...byThread.entries()].map(([t, lv]) => ({ t, lv, isNew: !seenThreads.has(t) }));
  all.forEach(x => seenThreads.add(x.t));
  const picked = all.filter(x => x.isNew).concat(all.filter(x => !x.isNew)).slice(0, 6);
  const skills = picked.map(({ t, lv }) => {
    const th = TH[t], lvObj = (th.levels || []).find(l => l.id === lv) || {};
    const fc = firstCourse(t, lv);
    return { ref: t + '@' + lv, name: th.name, level: lvObj.label || null,
      course: fc ? fc.key : null, example: example(t, lv) };
  });
  ladder.push({ id: s.id, book: m[1], volume: +m[2], label: s.label, skills });
}
const courses = {};
courseList.forEach(({ key, n, c }) => { courses[key] = { n, order: c.order ?? n, tier: c.tier, title: c.title }; });

const body = '/* 자동 생성 — node scripts/build-consult-ladder.js (손으로 고치지 않는다).\n' +
  '   기적의 계산법 권별 주제 → 우리 유형·예시 문제·처음 나오는 과정. 예시는 우리 생성기 문제다(교재 문항 아님). */\n' +
  'window.NM_CONSULT_LADDER = ' + JSON.stringify({ version: 1, ladder, courses }) + ';\n';

if(process.argv.includes('--check')){
  const now = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if(now !== body){ console.error('data/consult-ladder.js 가 낡았다 — node scripts/build-consult-ladder.js'); process.exit(1); }
  console.log('consult-ladder 최신'); process.exit(0);
}
fs.writeFileSync(OUT, body);
const missing = ladder.flatMap(st => st.skills.filter(k => !k.course).map(k => st.id + ' ' + k.ref));
const noEx = ladder.flatMap(st => st.skills.filter(k => !k.example).map(k => st.id + ' ' + k.ref));
console.log(`단계 ${ladder.length} · 기술 ${ladder.reduce((a, s) => a + s.skills.length, 0)} · ${(body.length / 1024).toFixed(1)}KB`);
if(missing.length) console.log('과정 없음:', missing.join(' | '));
if(noEx.length) console.log('예시 없음:', noEx.join(' | '));
