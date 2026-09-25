#!/usr/bin/env node
/* ============================================================
   레벨 개념 검사기 — 그 주의 개념이 그 주의 문항을 설명하는가 (2026-09-20)
   ------------------------------------------------------------
   왜 필요한가: 회차 첫 장의 개념 패널은 ①`levels[].concept` ②없으면 **스레드 전체의
   `concept`** 을 읽는다. 스레드 concept 은 그 스레드의 모든 레벨을 뭉뚱그리므로,
   레벨이 **서로 다른 기술로 갈리는**(params.mode 가 바뀌는) 스레드에서는 설명과 문항이
   어긋난다. 실제로 CH3 은 레벨 1(5진법→십진수)만 인쇄되는데 개념은 절반이 이진법
   곱셈(레벨 4·5)이었고, ML20 은 레벨 3(기준수 제시형)이 인쇄되는데 개념은 레벨 1의
   "차가 2인 두 수"만 말하고 있었다 — 그 규칙으로는 그 주 문항이 풀리지 않는다.

   무엇을 보나: 학습지에 **실제로 실리는** (스레드, 레벨) 쌍만 본다. 그 레벨이
   갈래형(앞뒤 레벨과 mode 가 다름)인데 `levels[].concept` 이 없으면 보고한다.
   난이도만 오르는 계단형 레벨은 스레드 개념 하나로 충분하므로 보지 않는다.

   쓰는 법:
     node scripts/check-level-concept.js          # 보고
     node scripts/check-level-concept.js --strict # 하나라도 있으면 exit 1
   기본은 보고만 한다(exit 0) — 글을 쓰는 일이라 기계가 막을 일이 아니다.
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const STRICT = process.argv.includes('--strict');

const w = { document: {}, console, Math, JSON, Object, Array, String, Number, RegExp, parseInt, parseFloat, isNaN, isFinite };
w.window = w; w.global = w;
const sb = vm.createContext(w);
for(const f of ['data/threads.js', 'data/courses.js'])
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sb, { filename: f });
const T = w.NM_THREADS;
const COURSES = w.NM_COURSES;
if(!T || !COURSES){ console.error('스레드/과정을 읽지 못했습니다.'); process.exit(2); }

/* 학습지에 실리는 (스레드, 레벨) — 드릴·창의·복습·시험 전부 */
const used = {};
Object.values(COURSES).forEach(c => (c.sessions || []).forEach(s =>
  Object.keys(s).forEach(k => {
    const v = s[k];
    if(!Array.isArray(v)) return;
    v.forEach(d => { if(d && d.t) (used[d.t] = used[d.t] || new Set()).add(d.lv || 1); });
  })));

/* 갈래형 레벨 — **첫 레벨과 mode 가 다른** 레벨이다.
   스레드 개념은 사실상 첫 레벨(그 유형의 대표 기술)을 설명하도록 쓰여 있다. 그러니
   첫 레벨과 같은 갈래면 그 문장으로 읽히고, 갈래가 바뀐 레벨만 제 문장이 필요하다.
   (처음엔 "이웃 레벨과 mode 가 다르면"으로 봤는데, 난이도만 오르는 중간 레벨까지
   전부 걸려 237건이 나왔다 — 기준이 느슨하면 검사기가 아니라 소음이 된다.) */
function isBranch(t, id){
  const L = (T[t].levels || []);
  if(L.length < 2) return false;
  const me = L.find(l => l.id === id);
  if(!me || me.id === L[0].id) return false;
  return (me.params || {}).mode !== (L[0].params || {}).mode;
}

const rows = [];
Object.keys(used).forEach(t => {
  if(!T[t]) return;
  [...used[t]].sort((a, b) => a - b).forEach(id => {
    const L = (T[t].levels || []).find(l => l.id === id);
    if(!L || L.concept) return;
    if(!isBranch(t, id)) return;
    rows.push([t, id, (L.label && (L.label.ko || L.label)) || '']);
  });
});

console.log(`학습지에 실리는 (스레드, 레벨) 중 갈래형인데 레벨 개념이 없는 것: ${rows.length}건\n`);
rows.forEach(r => console.log(`  ${(r[0] + ' L' + r[1]).padEnd(10)} ${r[2]}`));
if(!rows.length) console.log('통과 — 갈래가 바뀌는 레벨은 모두 제 개념 문장을 가지고 있다.');
else console.log(`\n고치는 법: data/threads.js 의 그 레벨에 concept:{ko,en,zh} 를 단다.
  그 레벨 문항으로 실제로 풀리는 설명이어야 한다 — 다른 레벨의 기술을 적으면 이 검사는
  통과하지만 학습지는 여전히 틀린 설명을 싣는다.`);
process.exit(STRICT && rows.length ? 1 : 0);
