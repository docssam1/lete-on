#!/usr/bin/env node
/* ============================================================
   세 층 동기화 검사기 — "같은 것이 여러 곳에 실리는데 한 곳만 고친" 사고를 잡는다 (2026-09-23)
   ------------------------------------------------------------
   왜 필요한가: 기존 검사기 20종은 data/units 폴더와 engine/threads 폴더를 Node 에서
   **통째로** 읽는다. 그런데 브라우저의 각 페이지는 **자기가 <script> 로 나열한 파일만** 읽는다.
   그 틈으로 2026-09-20~23 사이 다섯 건이 새어 나갔고, 검사기는 전부 "통과"였다.

     ① 새 유닛 M-83 이 index.html 태그 목록에 없어 앱에서 통째로 로드 안 됨
     ② 같은 M-83 이 roadmap.js(앱 지도)에 없어 학습지에만 나옴
     ③ A-35~A-38 이 학습지 과정으로 옮겨진 뒤 앱 지도에서 사라짐
     ④ drill.html(문제은행) 손 목록에 657레벨 중 92개가 없음 — 중2·중3 교과 연산 전체
     ⑤ ws.html(주간 학습지 — 학부모 문자 링크·PDF)이 mid9·mid10 을 안 실어,
        중2·중3 학습지가 개념은 「함수와 함숫값」인데 문제는 88+8= 로 나감

   무엇을 보나 (A~D 는 실패하면 exit 1, E 는 보고만)
     A. 유닛 파일 ↔ index.html <script> 태그
     B. 학습지 과정의 마법 유닛 ↔ 앱 지도(roadmap.js) 챕터
     C. 문제를 만드는 페이지마다, **그 페이지가 싣는 파일만으로** 모든 유형의 생성기가 있는가
     D. 문제은행 메뉴(drill.html 의 실제 코드를 그대로 실행)가 모든 레벨을 담는가
     E. 같은 유닛이 학습지 과정과 앱 지도에서 서로 다른 단계에 있는가 (의도된 복습일 수 있어 보고만)

     node scripts/check-roadmap-sync.js           # A~D 검사 + E 요약
     node scripts/check-roadmap-sync.js --stages  # E 전체 목록
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const SHOW_STAGES = process.argv.includes('--stages');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const ctx = () => { const w = { document: {}, console: { log(){}, warn(){}, error(){} }, Math, JSON, Object, Array, String, Number, RegExp, Date, parseInt, parseFloat, isNaN, isFinite }; w.window = w; w.global = w; return w; };
const run = (w, files) => { const sb = vm.createContext(w); for (const f of files) vm.runInContext(read(f), sb, { filename: f }); return sb; };
const scriptsOf = html => [...read(html).matchAll(/<script\s+src="([^"]+)"/g)].map(m => m[1]);

const fail = [], warn = [];

/* ── 기준 데이터: 전부 싣는다 ── */
const unitFiles = fs.readdirSync(path.join(ROOT, 'data/units')).filter(f => f.endsWith('.js'));
const full = ctx();
run(full, ['data/threads.js', 'data/courses.js', 'data/roadmap.js', 'data/stages.js', ...unitFiles.map(f => 'data/units/' + f)]);
const T = full.NM_THREADS, U = full.NM_UNITS, RM = full.NM_ROADMAP, ST = full.NM_STAGES;
const COURSES = Array.isArray(full.NM_COURSES) ? full.NM_COURSES : Object.values(full.NM_COURSES);

/* ── A. 유닛 파일 ↔ index.html 태그 ── */
const idxScripts = scriptsOf('index.html');
const tagged = new Set(idxScripts.filter(s => s.startsWith('data/units/')).map(s => s.slice('data/units/'.length)));
const untagged = unitFiles.filter(f => !tagged.has(f));
const deadTags = [...tagged].filter(f => !unitFiles.includes(f));
untagged.forEach(f => fail.push(`A · index.html 에 태그 없음: data/units/${f} — 앱에서 이 유닛이 로드되지 않는다`));
deadTags.forEach(f => fail.push(`A · index.html 이 없는 파일을 가리킴: data/units/${f}`));

/* ── B. 과정 마법 유닛 ↔ 앱 지도 ── */
const roadUnits = new Map();                     /* unit → 챕터 id */
(RM.chapters || []).forEach(ch => (ch.units || []).forEach(u => { if (!roadUnits.has(u)) roadUnits.set(u, ch.id); }));
const courseUnits = new Map();                   /* unit → 처음 실린 과정 번호 */
COURSES.forEach(c => (c.sessions || []).forEach(s => (s.magic || []).forEach(m => {
  const id = typeof m === 'string' ? m : (m.u || m.unit || m.id);
  const num = c.order != null ? c.order : c.id;
  if (!courseUnits.has(id)) courseUnits.set(id, num);
})));
for (const [u, num] of courseUnits) {
  if (!U[u]) {
    if (T[u]) continue;                          /* ML10 처럼 스레드 자체가 마법인 자리 — 과정 문법상 정상 */
    fail.push(`B · 과정 ${num} 의 마법 ${u} 가 유닛도 스레드도 아니다`);
    continue;
  }
  if (!roadUnits.has(u)) fail.push(`B · 과정 ${num} 의 마법 ${u}(${(U[u].title && U[u].title.ko) || ''}) 가 앱 지도(roadmap.js) 어느 챕터에도 없다`);
}
for (const [u, ch] of roadUnits) if (!U[u]) fail.push(`B · 앱 지도 챕터 ${ch} 가 없는 유닛 ${u} 를 가리킴`);

/* ── C. 페이지별 생성기 ── */
const PAGES = ['index.html', 'drill.html', 'ws.html'];
const pageReport = [];
for (const page of PAGES) {
  const src = scriptsOf(page);
  const engine = src.filter(s => s.startsWith('engine/'));
  if (!src.includes('data/threads.js')) { fail.push(`C · ${page} 가 data/threads.js 를 안 싣는다`); continue; }
  const w = ctx();
  run(w, [...engine, 'data/threads.js']);
  const miss = Object.keys(w.NM_THREADS).filter(k => !(w.NM_TGEN || {})[w.NM_THREADS[k].gen]);
  pageReport.push(`${page} 생성기 ${Object.keys(w.NM_THREADS).length - miss.length}/${Object.keys(w.NM_THREADS).length}`);
  if (miss.length) {
    const files = new Set();
    for (const k of miss) for (const f of fs.readdirSync(path.join(ROOT, 'engine/threads')))
      if (read('engine/threads/' + f).includes(`NM_TGEN['${T[k].gen}']`)) files.add('engine/threads/' + f);
    fail.push(`C · ${page} 에서 생성기 없는 유형 ${miss.length}개(${miss.slice(0, 8).join(' ')}${miss.length > 8 ? ' …' : ''}) — 빠진 파일: ${[...files].join(', ')}`);
  }
}

/* ── D. 문제은행 메뉴 — drill.html 의 실제 코드(TOPICS 목록 + 자동 보충)를 그대로 실행 ── */
const drill = read('drill.html');
const a = drill.indexOf('var TOPICS = ['), b = drill.indexOf('var TOTAL_TOPICS');
let drillCovered = 0, drillAuto = 0, drillNew = [];
if (a < 0 || b < 0) fail.push('D · drill.html 에서 TOPICS 목록을 못 찾음 — 구조가 바뀌었으면 이 검사기도 고칠 것');
else if (!drill.slice(a, b).includes('fillMissingLevels')) fail.push('D · drill.html 의 빠진 레벨 자동 보충(fillMissingLevels)이 없어졌다');
else {
  const w = ctx();
  /* drill.html 이 실제로 싣는 데이터만 싣는다 — courses.js 태그가 빠지면 주제를 못 찾는 게 재현돼야 한다 */
  const drillData = scriptsOf('drill.html').filter(s => s === 'data/threads.js' || s === 'data/courses.js');
  const sb = run(w, drillData);
  vm.runInContext("function dL(o){return typeof o==='string'?o:((o&&(o.ko||o.en))||'');}\n" + drill.slice(a, b), sb, { filename: 'drill.html#TOPICS' });
  const topics = w.NM_DRILL_TOPICS || [];
  const menu = new Set();
  topics.forEach(tp => (tp.subs || []).forEach(s => { menu.add(s.thread + '@' + s.level); if (s.auto) drillAuto++; if (tp.id === 'new') drillNew.push(s.thread + '@' + s.level); }));
  const missing = [];
  Object.keys(T).forEach(k => (T[k].levels || []).forEach(l => { if (menu.has(k + '@' + l.id)) drillCovered++; else missing.push(k + '@' + l.id); }));
  if (missing.length) fail.push(`D · 문제은행 메뉴에 없는 레벨 ${missing.length}개: ${missing.slice(0, 10).join(' ')}`);
  /* 「새로 추가된 유형」은 화면에서 사라지지 않게 하는 안전망일 뿐이다. 거기 들어갔다는 건
     제 주제를 못 찾았다는 뜻이라 실패로 본다 — courses.js 태그가 빠지면 75개가 한꺼번에 몰린다. */
  if (drillNew.length) fail.push(`D · 제 주제를 못 찾아 「새로 추가된 유형」에 몰린 레벨 ${drillNew.length}개: ${drillNew.slice(0, 10).join(' ')}${drillNew.length > 10 ? ' …' : ''} — drill.html 이 data/courses.js 를 싣는지, TOPICS 에 그 tier 의 주제가 있는지 볼 것`);
}

/* ── E. 단계 일치(보고만) ── */
const stageOfCourse = n => (ST || []).find(s => s.courses && n >= s.courses.from && n <= s.courses.to);
const stageOfChapter = id => (ST || []).find(s => (s.chapters || []).includes(id));
const stageDiff = [];
for (const [u, num] of courseUnits) {
  if (!U[u] || !roadUnits.has(u)) continue;
  const sc = stageOfCourse(num), sr = stageOfChapter(roadUnits.get(u));
  if (sc && sr && sc.key !== sr.key) stageDiff.push(`${u} — 학습지 과정 ${num}(${sc.key}) · 앱 지도 ${roadUnits.get(u)}(${sr.key})`);
}

/* ── 보고 ── */
const levels = Object.keys(T).reduce((n, k) => n + (T[k].levels || []).length, 0);
console.log(`유닛 파일 ${unitFiles.length} · index.html 태그 ${tagged.size}`);
console.log(`학습지 마법 유닛 ${courseUnits.size} · 앱 지도 유닛 ${roadUnits.size}`);
console.log(pageReport.join(' · '));
console.log(`문제은행 메뉴 ${drillCovered}/${levels} 레벨 (손 목록 ${drillCovered - drillAuto} · 자동 보충 ${drillAuto})`);
console.log(`단계가 다른 유닛 ${stageDiff.length}개 (의도된 복습일 수 있어 보고만${SHOW_STAGES ? '' : ' — 목록은 --stages'})`);
if (SHOW_STAGES) stageDiff.forEach(s => console.log('  · ' + s));
warn.forEach(s => console.log('⚠ ' + s));
if (fail.length) {
  console.log(`\n✗ 실패 ${fail.length}건`);
  fail.forEach(s => console.log('  ' + s));
  console.log('\n새 유형·유닛을 넣을 땐 인수인계서.md §4 여덟 걸음을 따를 것.');
  process.exit(1);
}
console.log('\n통과 — 유닛·과정·지도·문제은행·주간 학습지가 서로 어긋나지 않는다.');
