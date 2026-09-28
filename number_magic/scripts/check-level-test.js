#!/usr/bin/env node
/* 표준 연산 진단지(app/level-test-core.js, level-test.html) 검사 — 2026-09-28.
   - 모든 형 × 두 판이 만들어지고, 같은 시드는 같은 시험지(결정성)
   - 문항: 식이 있고 답이 정수, 한 장 안에 같은 문제 없음, 과정 순(쉬운 → 어려운)
   - 문제 수: min(20, 과정 수 × 2), 한 과정 최대 2문제
   - 형의 범위 = 시작 단계 + 다음 단계(화면 진단 천장과 같은 규칙) — stages.js 에서 계산
   - 채점: 다 맞힘 → 천장 다음 / 첫 과정부터 연달아 틀림 → 형의 첫 과정 /
           한 번 실수(뒤 두 과정 다 맞힘)는 넘어감 / 빈 과정 건너뛰지 않음(통과 다음 번호) */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
global.window = global;
for (const f of ['engine/rng.js', 'engine/generators.js']) eval(fs.readFileSync(path.join(ROOT, f), 'utf8'));
fs.readdirSync(path.join(ROOT, 'engine/threads')).forEach(f => eval(fs.readFileSync(path.join(ROOT, 'engine/threads', f), 'utf8')));
for (const f of ['data/threads.js', 'data/courses.js', 'data/stages.js', 'app/level-test-core.js']) eval(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const LT = window.NM_LEVEL_TEST;
const fail = [];
const ok = (c, m) => { if (!c) fail.push(m); };
const forms = LT.forms();
ok(forms.length === window.NM_STAGES.length, `형 수 ${forms.length} = 단계 수 ${window.NM_STAGES.length}`);
forms.forEach((f, i) => {
  const st = window.NM_STAGES[i], nx = window.NM_STAGES[i + 1];
  ok(f.from === st.courses.from && f.to === (nx || st).courses.to, `형 ${f.id} 범위 ${f.from}~${f.to}`);
  [1, 2].forEach(v => {
    const a = LT.build(f.id, v), b = LT.build(f.id, v);
    const tag = `형 ${f.id}-${v}판`;
    ok(JSON.stringify(a) === JSON.stringify(b), `${tag}: 같은 시드 같은 시험지`);
    const want = Math.min(LT.TARGET, a.courses.length * 2);
    ok(a.items.length === want, `${tag}: 문제 ${a.items.length}개(기대 ${want})`);
    const keys = new Set();
    a.items.forEach((it, k) => {
      ok(it.tex && Number.isInteger(it.answer), `${tag} ${it.no}번: 식·정수 답`);
      ok(!keys.has(it.tex + '=' + it.answer), `${tag} ${it.no}번: 중복`); keys.add(it.tex + '=' + it.answer);
      if (k) ok(it.course >= a.items[k - 1].course, `${tag} ${it.no}번: 과정 순서`);
    });
    a.courses.forEach(c => { const n = a.items.filter(x => x.course === c).length; ok(n >= 1 && n <= 2, `${tag} 과정 ${c}: ${n}문제`); });
    const all = LT.score(a, []);
    ok(all.firstFail === null && all.rec === Math.min(f.to + 1, window.NM_COURSE_SPEC.slice(-1)[0].id), `${tag}: 다 맞힘 → ${all.rec}`);
    const allWrong = LT.score(a, a.items.map(x => x.no));
    ok(allWrong.rec === f.from, `${tag}: 다 틀림 → 과정 ${allWrong.rec}(기대 ${f.from})`);
    if (a.courses.length >= 6) {
      const slip = a.items.filter(x => x.course === a.courses[1]).map(x => x.no);
      ok(LT.score(a, slip).firstFail === null, `${tag}: 한 번 실수는 넘어감`);
      const mid = a.courses[4];
      const miss = a.items.filter(x => x.course >= mid).map(x => x.no);
      const r = LT.score(a, miss);
      ok(r.rec === a.courses[3] + 1, `${tag}: 과정 ${mid}부터 틀림 → ${r.rec}(기대 ${a.courses[3] + 1})`);
    }
    if (v === 1) console.log(`${tag}: 과정 ${f.from}~${f.to} · 시험지 과정 ${a.courses.length}개 · ${a.items.length}문제`);
  });
});
if (fail.length) { fail.forEach(m => console.log('FAIL', m)); process.exit(1); }
console.log('통과 — 표준 진단지 전 형·두 판이 같은 문제로 만들어지고 채점 규칙이 맞다.');
