#!/usr/bin/env node
/* ============================================================
   레벨 도달 검사기 — 만들어 둔 레벨이 학습지에 실제로 나오는가 (2026-09-20)
   ------------------------------------------------------------
   왜 필요한가: 레벨은 `buildCourses()`에서 "처음 등장 1, 그 과정에서 또 자기 재료로
   나오면 +1"로만 오른다. 그래서 **한 과정에만 실린 스레드는 영원히 레벨 1**이다.
   받아올림 7단계(AD5)·받아내림 4단계(SB3·SB4)처럼 계단을 촘촘히 만들어 둔 스레드가
   첫 칸만 쓰이고 나머지는 학습지에 한 번도 안 나온다 — 교재 단원이 요구하는 난이도에
   영영 닿지 못한다는 뜻이다. `'AD5@3'` 고정 레벨 문법이 이미 있으니 편성에서 펴 주면 된다.

   회차 안 난이도 램프(exam.js rampLevelFor)는 **한 칸**만 올려 주고, 그것도 다음 레벨이
   "같은 연산의 한 단계 위"일 때만이다. 그래서 여기서는 램프로 닿는 레벨(lv+1)도
   도달한 것으로 세되, 램프가 성립하는 스레드에서만 그렇게 센다.

   쓰는 법:
     node scripts/check-level-coverage.js          # 전체 표
     node scripts/check-level-coverage.js --gap    # 못 닿는 레벨이 있는 것만
   보고만 한다(exit 0) — 편성 판단이 필요한 항목이라 자동 실패로 막지 않는다.
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const GAP_ONLY = process.argv.includes('--gap');

const w = { document: {}, console, Math, JSON, Object, Array, String, Number, RegExp, parseInt, parseFloat, isNaN, isFinite };
w.window = w; w.global = w;
const sb = vm.createContext(w);
for(const f of ['data/threads.js', 'data/courses.js'])
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sb, { filename: f });
const T = w.NM_THREADS;
const COURSES = w.NM_COURSES || (w.buildCourses && w.buildCourses());
if(!T || !COURSES){ console.error('스레드/과정을 읽지 못했습니다.'); process.exit(2); }
const list = Array.isArray(COURSES) ? COURSES : Object.values(COURSES);

/* 램프가 성립하는가 — exam.js rampLevelFor 와 같은 판정: 다음 레벨이 같은 params 키를
   쓰고 mode 로 갈라지지 않으면 "같은 연산의 한 단계 위"다. */
function rampsTo(k, lv){
  const levels = (T[k].levels || []);
  const a = levels.find(l => l.id === lv), b = levels.find(l => l.id === lv + 1);
  if(!a || !b) return false;
  const pa = a.params || {}, pb = b.params || {};
  if(pa.mode !== pb.mode) return false;
  const ka = Object.keys(pa).sort().join(','), kb = Object.keys(pb).sort().join(',');
  return ka === kb;
}

const used = {};                       /* thread -> Set(level) — 드릴·복습·적용에서 실제로 뽑히는 레벨 */
list.forEach(c => (c.sessions || []).forEach(s => {
  Object.keys(s).forEach(key => {
    const v = s[key];
    if(!Array.isArray(v)) return;
    v.forEach(d => {
      if(!d || typeof d !== 'object') return;
      const t = d.t || d.thread; if(!t) return;
      (used[t] = used[t] || new Set()).add(d.lv || d.level || 1);
    });
  });
}));

let gaps = 0, reachedAll = 0, unplaced = 0;
const rows = [];
Object.keys(T).forEach(k => {
  const levels = (T[k].levels || []);
  const max = levels.length || 1;
  const direct = used[k] ? [...used[k]].sort((a, b) => a - b) : [];
  const reach = new Set(direct);
  direct.forEach(lv => { if(rampsTo(k, lv)) reach.add(lv + 1); });   /* 회차 램프로 닿는 한 칸 */
  const miss = levels.map(l => l.id).filter(id => !reach.has(id));
  if(!direct.length){ unplaced++; rows.push([k, max, '드릴 편성 없음(시험 풀에만)', '']); return; }
  if(!miss.length){ reachedAll++; return; }
  gaps++;
  rows.push([k, max, direct.join(','), miss.join(',')]);
});

const name = k => (T[k].name && (T[k].name.ko || T[k].name)) || k;
console.log(`스레드 ${Object.keys(T).length} · 전 레벨 도달 ${reachedAll} · 못 닿는 레벨 있음 ${gaps} · 드릴 편성 없음 ${unplaced}\n`);
rows.forEach(r => {
  if(GAP_ONLY && !r[3]) return;
  console.log(`  ${r[0].padEnd(6)} ${String(name(r[0])).padEnd(16)} 레벨 ${r[1]}개 · 편성 ${r[2]}` + (r[3] ? ` · 못 닿음 ${r[3]}` : ''));
});
console.log(`\n고치는 법: data/courses.js 의 COURSE_SPEC 에서 그 스레드를 'AD5@3' 처럼 레벨을 박아 싣는다.`);
