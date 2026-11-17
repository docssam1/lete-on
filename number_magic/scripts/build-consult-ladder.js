#!/usr/bin/env node
/* ============================================================
   상담판 단계표 만들기 — 2026-11-17
   원장 「지금 무슨 책 몇 권을 하고 있고 두 자리 받아내림은 되고 … 정보가 부족하면 더 물어볼 수 있도록」
   → 「상담 버전」 → 「응 그렇게 만들어」.

   상담판(consult.html)은 문제를 풀게 하지 않고 보호자에게 묻는다. 묻는 기술의 차례는
   기적의 계산법 권별 주제(data/placement-books.js 의 coverage — 출판사 주제 메타데이터와 우리 유형을
   이어 둔 것)를 뼈대로 쓴다: 예비초등 1~5권 → 초등 1~12권 = 17단계.
   소마셈 2019년 발행본 P~D 46권(soma-p-2019.js·book-volume-topics.js)과 두뇌로 과정 1~25(dunoro-courses.js)도
   같은 꼴로 사다리를 만든다(원장 2026-11-17 「대응 해야지 · 로드맵 진도 다 줬잖아」). 구몬수학 6A~F도 단계 순서대로 넣었다(2026-11-17). 원리셈은 권별 진도표가 없어 아직 없다.
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
/* 회차 드릴에 없으면 창의 칸(회차 creative)에서 처음 나오는 과정 — placement-plan.js locate() 와 같은 차례 */
function firstCourse(t, lv){
  const hit = (pred, col) => courseList.find(({ c }) => (c.sessions || []).some(s => (s[col] || []).some(d => !d.review && pred(d))));
  for(const col of ['drills', 'creative']){
    const exact = hit(d => d.t === t && d.lv === lv, col);
    if(exact) return { key: exact.key, exact: true };
  }
  for(const col of ['drills', 'creative']){
    const any = hit(d => d.t === t, col);
    if(any) return { key: any.key, exact: false };
  }
  return null;
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

/* 교재마다 사다리 하나. 행 = { id, group, volume, title(3개 언어 이름), topic(한국어 주제 — 교재가 공개한 짧은 주제 요약), refs } */
function buildLadder(rows){
  const seen = new Set();
  return rows.map(row => {
    const byThread = new Map();
    row.refs.forEach(r => { const [t, lv] = r.split('@'); if(TH[t] && (!byThread.has(t) || byThread.get(t) < +lv)) byThread.set(t, +lv); });
    const all = [...byThread.entries()].map(([t, lv]) => ({ t, lv, isNew: !seen.has(t) }));
    all.forEach(x => seen.add(x.t));
    const picked = all.filter(x => x.isNew).concat(all.filter(x => !x.isNew)).slice(0, 6);
    const skills = picked.map(({ t, lv }) => {
      const th = TH[t], lvObj = (th.levels || []).find(l => l.id === lv) || {};
      const fc = firstCourse(t, lv);
      return { ref: t + '@' + lv, name: th.name, level: lvObj.label || null, course: fc ? fc.key : null, example: example(t, lv) };
    });
    return { id: row.id, group: row.group, volume: row.volume, title: row.title, topic: row.topic, skills };
  });
}
const L3 = (ko, en, zh) => ({ ko, en, zh });
/* 기적의 계산법 — 예비초등 2023판 1~5권 → 초등 2021판 1~12권 (placement-books.js 권별 coverage) */
const miracleRows = BOOKS.getSteps('miracle').filter(s => /^(pre-2023|elem-2021)-v\d+$/.test(s.id)).map(s => {
  const m = /^(pre-2023|elem-2021)-v(\d+)$/.exec(s.id), v = +m[2], pre = m[1] === 'pre-2023';
  return { id: s.id, group: m[1], volume: v,
    title: pre ? L3('예비초등 ' + v + '권', 'Pre-school vol. ' + v, '学前第' + v + '册') : L3('초등 ' + v + '권', 'Elementary vol. ' + v, '小学第' + v + '册'),
    topic: (String(s.label.ko).split('—')[1] || '').trim(), refs: s.coverage || [] };
});
/* 소마셈 2019년 발행본 P1~P8 → K → A → B → C → D1~D6 (soma-p-2019.js · book-volume-topics.js) */
const somaRows = [];
[['P', 'NM_SOMA_P_2019'], ['K', 'NM_SOMA_K_2019'], ['A', 'NM_SOMA_A_2019'], ['B', 'NM_SOMA_B_2019'], ['C', 'NM_SOMA_C_2019'], ['D', 'NM_SOMA_D_2019']].forEach(([stage, key]) => {
  const d = W[key];
  if(!d) throw new Error('소마셈 표 없음: ' + key);
  d.courses.forEach(c => somaRows.push({ id: 'soma-' + stage.toLowerCase() + '-v' + c.course, group: stage, volume: c.course,
    title: L3(stage + c.course + '권', 'Vol. ' + stage + c.course, stage + c.course + '册'), topic: String(c.topics || ''), refs: c.refs }));
});
/* 두뇌로 과정 1~25 (dunoro-courses.js — 과정표에 적힌 연산을 우리 유형으로 옮긴 것) */
const dunoroRows = W.NM_DUNORO_COURSES.courses.map(c => ({ id: 'dunoro-' + c.course, group: 'level-' + c.level, volume: c.course,
  title: L3('과정 ' + c.course, 'Course ' + c.course, '课程' + c.course), topic: String(c.topics || ''), refs: c.refs }));
/* 구몬수학 6A~F (원장 2026-11-17 「구몬은 A부터 알파벳 순서대로 1학년 2학년 이런 과정」 · 공식 안내 kumon.co.kr/Subject/Math).
   공식: 유아 수 개념부터 고등 미적분까지 24단계 — 구몬수학 6A~I · 구몬수학 플러스 J~SS. 6A~4A 수의 기본(숫자 읽기·수 배열),
   3A~F 자연수·분수·소수 사칙연산, G~I 문자식·방정식·함수. 인정테스트 「자기 학년 기준」 유아 2A · 초1 A · 초2 B · 초3 C
   (우수회원 = 2단계 이상 앞섬: 초1 C↑ · 초2 D↑ · 초3 E↑ · 초4 F↑) → D = 초4, E = 초5, F = 초6.
   단계 안 세부 주제는 공식 목록이 없어 공개 설명(나무위키 「구몬」, 해외 Kumon 단계 안내)의 짧은 요약 — 우리 유형 대응은 우리 판단.
   G 이상(중등 대수)은 상담 범위 밖이라 진단 평가로 보낸다. */
const KUMON_GRADE = { '6A': ['유아', 'Pre-K', '幼儿'], '5A': ['유아', 'Pre-K', '幼儿'], '4A': ['유아', 'Pre-K', '幼儿'], '3A': ['유아', 'Pre-K', '幼儿'], '2A': ['유아', 'Pre-K', '幼儿'],
  A: ['초1', 'Gr 1', '小1'], B: ['초2', 'Gr 2', '小2'], C: ['초3', 'Gr 3', '小3'], D: ['초4', 'Gr 4', '小4'], E: ['초5', 'Gr 5', '小5'], F: ['초6', 'Gr 6', '小6'] };
const kumonRows = [
  ['6A', '10까지 수 세기', ['NL1@1', 'NL1@2']],
  ['5A', '50까지 수 읽기 · 수표', ['NL4@1', 'NL7@1', 'NL1@2']],
  ['4A', '100까지 수 읽기·쓰기 · 이어 쓰기', ['NL4@1', 'NL7@1', 'NL2@2']],
  ['3A', '덧셈 시작(+1~+3)', ['AD1@1', 'NL2@2', 'NL2@3']],
  ['2A', '덧셈(+4~+10) · 10의 보수', ['AD1@1', 'NS3@2', 'AD2@1', 'NL6@1']],
  ['A', '큰 수 덧셈 · 뺄셈 시작', ['SB1@1', 'AD2@1', 'SB2@1', 'AD3@1', 'SB3@1', 'AD10@1']],
  ['B', '세로셈 덧셈·뺄셈(두·세 자리, 받아올림·받아내림)', ['AD5@1', 'AD5@3', 'SB4@1', 'SB4@2', 'AD6@2', 'SB6@1']],
  ['C', '곱셈구구 · 곱셈 · 간단한 나눗셈', ['ML2@3', 'ML3@3', 'ML4@1', 'ML6@1', 'ML7@1', 'DV2@1']],
  ['D', '여러 자리 곱셈·나눗셈 · 분수와 약분', ['ML8@1', 'DV3@1', 'DV4@1', 'ML9@1', 'DV5@1', 'FR5@1']],
  ['E', '분수의 덧셈·뺄셈·곱셈·나눗셈', ['FR2@1', 'FR4@1', 'FR3@1', 'FR6@1', 'FR7@1', 'DV7@1']],
  ['F', '사칙 혼합 · 소수와 소수의 사칙', ['MX1@1', 'DC1@1', 'DC2@1', 'DC3@1', 'FR7@3', 'MX1@2']]
].map(([lv, topic, refs], i) => ({ id: 'kumon-' + lv.toLowerCase(), group: /A$/.test(lv) && lv !== 'A' ? 'pre' : 'elem', volume: i + 1,
  title: L3(lv + ' 단계 (' + KUMON_GRADE[lv][0] + ' 기준)', 'Level ' + lv + ' (' + KUMON_GRADE[lv][1] + ')', lv + '阶段（' + KUMON_GRADE[lv][2] + '）'), topic, refs }));
const ladders = { miracle: buildLadder(miracleRows), soma: buildLadder(somaRows), dunoro: buildLadder(dunoroRows), kumon: buildLadder(kumonRows) };
const ladder = [].concat(ladders.miracle, ladders.soma, ladders.dunoro, ladders.kumon);
const courses = {};
courseList.forEach(({ key, n, c }) => { courses[key] = { n, order: c.order ?? n, tier: c.tier, title: c.title }; });

const body = '/* 자동 생성 — node scripts/build-consult-ladder.js (손으로 고치지 않는다).\n' +
  '   기적의 계산법·소마셈(2019)·두뇌로 권별 주제 → 우리 유형·예시 문제·처음 나오는 과정. 예시는 우리 생성기 문제다(교재 문항 아님). */\n' +
  'window.NM_CONSULT_LADDER = ' + JSON.stringify({ version: 2, ladders, courses }) + ';\n';

if(process.argv.includes('--check')){
  const now = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if(now !== body){ console.error('data/consult-ladder.js 가 낡았다 — node scripts/build-consult-ladder.js'); process.exit(1); }
  console.log('consult-ladder 최신'); process.exit(0);
}
fs.writeFileSync(OUT, body);
const missing = ladder.flatMap(st => st.skills.filter(k => !k.course).map(k => st.id + ' ' + k.ref));
const noEx = ladder.flatMap(st => st.skills.filter(k => !k.example).map(k => st.id + ' ' + k.ref));
console.log(`기적 ${ladders.miracle.length} · 소마셈 ${ladders.soma.length} · 두뇌로 ${ladders.dunoro.length} · 구몬 ${ladders.kumon.length}단계 · 기술 ${ladder.reduce((a, s) => a + s.skills.length, 0)} · ${(body.length / 1024).toFixed(1)}KB`);
if(missing.length) console.log('과정 없음:', missing.join(' | '));
if(noEx.length) console.log('예시 없음:', noEx.join(' | '));
