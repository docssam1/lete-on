#!/usr/bin/env node
/* 연산 사다리 검산 — 스레드의 선수(prereq) 순서와 과정(courses.js) 배치가 맞는가 · 2026-09-19
 *
 * 왜 있나: 과정표는 사람이 손으로 짠다. 스레드를 새로 만들면 어느 과정에도 안 붙은 채로
 * 남거나(SB1 한 자리 뺄셈이 실제로 그랬다 — 덧셈은 과정 1에서 시작하는데 뺄셈은 과정 3의
 * 두 자리−한 자리부터였다), 선수보다 앞선 과정에 붙는다(ML11 제곱수가 ML8 두 자리×두
 * 자리보다 네 과정 앞, ML14가 선수 ML13보다 한 과정 앞이었다). 학습지는 이대로 인쇄되고
 * 아무도 오류라고 말해 주지 않는다 — 그래서 검사기가 대신 말한다.
 *
 * 보는 것 세 가지:
 *   ① 미배치 — threads.js 에 있는데 어느 과정의 드릴·창의·마법에도 안 나오는 스레드
 *   ② 선수 순서 — A 의 prereq B 가 A 보다 뒤 과정에 처음 나오면 위반(같은 과정은 괜찮다)
 *   ③ 레벨 핀 — 'ML8@6' 처럼 적은 핀이 그 스레드의 실제 레벨 수를 넘는가
 *
 *   node scripts/check-ladder.js        # 실패하면 exit 1
 */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');

global.window = {};
require(path.join(ROOT, 'data/threads.js'));
require(path.join(ROOT, 'data/courses.js'));
const TH = global.window.NM_THREADS;
const SPEC = global.window.NM_COURSE_SPEC;

const bare = r => String(r).split('@')[0];
const firstCourse = Object.create(null);   // 스레드 → 처음 나오는 과정 번호
const pinBad = [];

for (const s of SPEC) {
  const ids = [];
  (s.drills || []).forEach(r => ids.push(r));
  (s.creative || []).forEach(r => ids.push(r));
  (s.perSessionDrills || []).forEach(row => row.forEach(r => ids.push(r)));
  /* 마법 슬롯은 대개 유닛 id(A-01·C-12…)지만 스레드 id 가 직접 오기도 한다(ML10). */
  (s.magic || []).forEach(seg => seg.forEach(r => { if (TH[bare(r)]) ids.push(r); }));

  for (const raw of ids) {
    const t = bare(raw);
    if (!TH[t]) continue;
    const pin = String(raw).split('@')[1];
    if (pin) {
      const n = (TH[t].levels || []).length;
      if (+pin > n) pinBad.push(`과정 ${s.id}: ${raw} — ${t} 레벨은 ${n}개뿐`);
    }
    if (firstCourse[t] === undefined) firstCourse[t] = s.id;
  }
}

const all = Object.keys(TH);
const orphans = all.filter(t => firstCourse[t] === undefined);
const order = [];
for (const t of all) {
  const fc = firstCourse[t];
  if (fc === undefined) continue;
  for (const p of (TH[t].prereq || [])) {
    if (!TH[p]) { order.push(`${t}: 선수 ${p} 가 threads.js 에 없다`); continue; }
    const pc = firstCourse[p];
    if (pc === undefined) order.push(`${t}(과정 ${fc}) — 선수 ${p} 가 어느 과정에도 없다`);
    else if (pc > fc)     order.push(`${t}(과정 ${fc}) — 선수 ${p} 가 더 뒤(과정 ${pc})`);
  }
}

console.log(`스레드 ${all.length} · 과정 ${SPEC.length} · 배치됨 ${all.length - orphans.length}`);
const fail = [];
orphans.forEach(t => fail.push(`미배치: ${t} ${TH[t].name.ko} (선수 ${(TH[t].prereq || []).join(',') || '없음'})`));
order.forEach(v => fail.push(`선수 순서: ${v}`));
pinBad.forEach(v => fail.push(`레벨 핀: ${v}`));
if (fail.length) {
  console.error(`\n실패 ${fail.length}건`);
  fail.forEach(f => console.error('  ✗ ' + f));
  process.exit(1);
}
console.log('\n통과 — 모든 스레드가 제 자리에 있고, 선수가 앞선다.');
