#!/usr/bin/env node
/* 단계(data/stages.js) ↔ 과정(data/courses.js) ↔ 광고(landing.html) 검산 · 2026-09-07
 *
 * 광고에 적힌 "과정 1~10 · 주 1회 기준 55주" 같은 숫자는 courses.js 의 세션 수에서 나온다.
 * 코드가 바뀌면 광고가 조용히 틀리므로(학습-로드맵.md §2 주의) 여기서 잡는다.
 *
 *   node scripts/check-stages.js        # 실패하면 exit 1
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

global.window = {};
require(path.join(ROOT, 'data/courses.js'));
require(path.join(ROOT, 'data/stages.js'));
const COURSES = global.window.NM_COURSES;
const STAGES = global.window.NM_STAGES;
const html = fs.readFileSync(path.join(ROOT, 'landing.html'), 'utf8');

const fail = [];
const w2 = n => Math.ceil(n * 2 / 3);
const courseNum = c => c.order || c.id;

let totalSessions = 0, totalW1 = 0, opW1 = 0, opW2 = 0;
const seenCourses = new Set();

for (const st of STAGES) {
  /* 챕터 id 는 로드맵에 실제로 있어야 한다 */
  if (!st.chapters.length) fail.push(`${st.key}: 챕터가 비어 있다`);

  if (!st.courses) { if (st.weeks != null) fail.push(`${st.key}: 과정이 없는데 weeks 가 있다`); continue; }

  let sessions = 0, n = 0, weeksW2 = 0;
  for (const k of Object.keys(COURSES)) {
    const num = courseNum(COURSES[k]);
    if (num < st.courses.from || num > st.courses.to) continue;
    const nSess = (COURSES[k].sessions || []).length;
    sessions += nSess; weeksW2 += w2(nSess); n++; // 주 2회는 과정마다 올림한다(main.js courseWeeks 와 같게)
    if (seenCourses.has(num)) fail.push(`과정 ${num} 이 두 단계에 들어 있다`);
    seenCourses.add(num);
  }
  if (!n) { fail.push(`${st.key}: 과정 ${st.courses.from}~${st.courses.to} 이 courses.js 에 없다`); continue; }

  if (st.weeks !== sessions) fail.push(`${st.key}: weeks ${st.weeks} ≠ 실측 세션 ${sessions}`);
  totalSessions += sessions; totalW1 += sessions;
  st._w2 = weeksW2;
  if (st.courses.to <= 25) { opW1 += sessions; opW2 += weeksW2; }

  /* 광고 카드의 메타 줄 — "과정 A~B" 와 "N주" 가 실제와 같아야 한다 */
  const meta = st.meta && st.meta.ko;
  if (meta) {
    const mc = /과정 (\d+)~(\d+)/.exec(meta);
    if (!mc) fail.push(`${st.key} meta: 과정 범위 표기가 없다 — "${meta}"`);
    else if (+mc[1] !== st.courses.from || +mc[2] !== st.courses.to)
      fail.push(`${st.key} meta: 과정 ${mc[1]}~${mc[2]} ≠ ${st.courses.from}~${st.courses.to}`);
    const mw = /(\d+)주/.exec(meta);
    if (mw && +mw[1] !== sessions) fail.push(`${st.key} meta: ${mw[1]}주 ≠ ${sessions}주`);
    if (!html.includes(meta)) fail.push(`${st.key} meta 문구가 landing.html 에 없다 — "${meta}"`);
  }
  if (st.name && st.name.ko && !html.includes(st.name.ko.split(' — ')[0]))
    fail.push(`${st.key}: 단계 이름 "${st.name.ko}" 이 landing.html 에 없다`);
}

/* 모든 과정이 어느 단계엔가 들어갔는가 */
for (const k of Object.keys(COURSES)) {
  const num = courseNum(COURSES[k]);
  if (!seenCourses.has(num)) fail.push(`과정 ${num} 이 어느 단계에도 없다`);
}

/* 광고 합계 줄 — 연산 구간과 전 구간 주차 */
const totalW2 = STAGES.reduce((a, s) => a + (s._w2 || 0), 0);
const wants = [`${opW1}주`, `${totalW1}주`, `${opW2}주`, `${totalW2}주`];
for (const w of wants) if (!html.includes(w)) fail.push(`landing.html 합계 줄에 ${w} 가 없다`);

/* 조회 헬퍼가 실제로 도는가 */
if (!global.window.NM_STAGE_OF_COURSE(1)) fail.push('NM_STAGE_OF_COURSE(1) 이 null');
if (!global.window.NM_STAGE_OF_CHAPTER('R0')) fail.push("NM_STAGE_OF_CHAPTER('R0') 이 null");
if (!global.window.NM_STAGE_OF_TIER('level1')) fail.push("NM_STAGE_OF_TIER('level1') 이 null");

console.log(`단계 ${STAGES.length} · 과정 ${seenCourses.size} · 회차 ${totalSessions}`);
console.log(`주 1회 — 연산 구간 ${opW1}주 · 전 구간 ${totalW1}주 / 주 2회 — ${opW2}주 · ${totalW2}주`);
if (fail.length) { console.error('\n실패 ' + fail.length + '건'); fail.forEach(f => console.error('  ✗ ' + f)); process.exit(1); }
console.log('\n통과 — 단계·과정·광고 숫자가 서로 맞는다.');
