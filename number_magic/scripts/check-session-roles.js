#!/usr/bin/env node
/* ============================================================
   회차 세 층 검사 (2026-09-25) — 원장 "교과 연산과 창의 연산 문장제가 적절히 연결"
   courses.js 의 annotateRoles 가 만든 school · strategy · application · stretch 를 본다.

   실패(exit 1)
     A. 교과(school)가 없는 회차
     B. 한 회차 안에서 같은 유형·레벨이 두 층에 실림
        (초등의 "교과 첫 드릴을 문장제로" 한 칸 kind:'word' from:'school' 만 예외 — 설계상 같은 계산을 문장으로 다시 푼다)
     C. 창의 전략(마법 유닛이나 전략 드릴)이 한 번도 없는 과정
     D. 중등(middle1~3) 과정인데 적용(활용 스레드·공식 대입·자료)이 한 회차도 없음
   보고만: 고등 과정의 적용 개수(이번 범위는 유아~중등 비기하)
     node scripts/check-session-roles.js          # 과정별 표 + 실패
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const w = { document:{}, console:{log(){},warn(){},error(){}}, Math, JSON, Object, Array, String, Number, RegExp, Date, parseInt, parseFloat, isNaN, isFinite };
w.window = w; w.global = w;
const sb = vm.createContext(w);
for(const f of ['data/threads.js','data/courses.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sb, { filename:f });
const C = Object.values(w.NM_COURSES).sort((a,b) => a.order - b.order);
const MIDDLE = { middle1:1, middle2:1, middle3:1 };
const fail = [], rows = [];
for(const c of C){
  const ss = c.sessions.filter(s => !s.test);
  if(c.comingSoon || !ss.length) continue;
  let strat = 0, app = 0, word = 0, stretch = 0;
  ss.forEach((s, i) => {
    if(!s.school) { fail.push(`C${c.order} 회차 ${i+1}: 세 층 정보가 없다(annotateRoles 미적용)`); return; }
    if(!s.school.length) fail.push(`A · C${c.order} 회차 ${i+1}: 교과 연산이 없다`);
    const seen = {};
    const mark = (d, layer) => { const k = d.t + '@' + d.lv; if(seen[k] && seen[k] !== layer) fail.push(`B · C${c.order} 회차 ${i+1}: ${k} 가 ${seen[k]}·${layer} 두 층에`); seen[k] = seen[k] || layer; };
    s.school.forEach(d => mark(d, 'school'));
    s.strategy.practice.forEach(d => mark(d, 'strategy'));
    s.application.filter(a => a.from !== 'school').forEach(d => mark(d, 'application'));
    s.stretch.forEach(d => mark(d, 'stretch'));
    if(s.strategy.units.length || s.strategy.practice.length) strat++;
    if(s.application.some(a => a.from !== 'school')) app++;
    if(s.application.some(a => a.from === 'school')) word++;
    if(s.stretch.length) stretch++;
  });
  rows.push(`C${String(c.order).padEnd(3)}${c.tier.padEnd(11)}회차 ${String(ss.length).padStart(2)} · 창의 ${String(strat).padStart(2)} · 적용 ${String(app).padStart(2)} · 교과→문장제 ${String(word).padStart(2)} · 심화 ${String(stretch).padStart(2)}`);
  if(!strat) fail.push(`C · C${c.order}(${c.tier}): 창의 전략이 한 회차도 없다`);
  if(MIDDLE[c.tier] && !app) fail.push(`D · C${c.order}(${(c.title && c.title.ko) || ''}): 중등 과정인데 적용 문제가 한 회차도 없다`);
}
console.log(rows.join('\n'));
if(fail.length){
  console.log(`\n✗ 실패 ${fail.length}건`); fail.forEach(s => console.log('  ' + s));
  process.exit(1);
}
console.log('\n통과 — 모든 회차에 교과가 있고, 층 사이 중복이 없고, 과정마다 창의 전략이, 중등 과정마다 적용이 있다.');
