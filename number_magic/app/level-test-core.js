/* ============================================================
   Numbers of Magic — 표준 연산 진단지: 순수 로직 (app/level-test-core.js)
   ------------------------------------------------------------
   원장(2026-09-28): "화면에서 할 수도 있지만 인쇄해서 할 수 있도록 표준 시험지를 만들면 어때?"

   화면 진단(placement-core.js)은 한 문제씩 적응형으로 올라가서 종이에 옮길 수 없다. 이 파일은
   **누가 뽑아도 같은 문제가 나오는** 고정 시험지를 만든다(시드 = 형 + 판 + 과정 + 번호).

   - 형(form)  : 로드맵 단계(data/stages.js)마다 하나. 그 단계 **와 다음 단계**의 과정을 담는다 —
                 화면 진단의 천장 규칙(main.js placementCeilCourse)과 같은 범위다.
                 유아 → 과정 0~10, 계산의 새싹 → 1~16, … 고등은 다음 단계가 없어 자기 단계만.
   - 판(v)     : 1·2. 같은 형의 다른 문제(다시 볼 때). 문제 수·과정 배치는 같다.
   - 문제 고르기 : 과정의 드릴 목록(NM_COURSE_SPEC.drills, 'AD3@5' = 레벨 5) 순서대로, 답이 **정수 하나**이고
                 식(tex)이 있는 스레드만(그림을 만지는 수의 나라 위젯은 종이에 못 옮긴다). 레벨은 그 과정에
                 적힌 가장 높은 레벨 = 그 과정을 끝내면 풀 수 있어야 하는 문제.
                 과정당 1문제, 남는 자리는 고르게 한 문제씩 더(최대 2) — 한 장 20문제 안팎.
                 쓸 문제가 없는 과정(0·15·32·36 — 위젯 전용이거나 답이 정수가 아님)은 시험지에 없다.
   - 채점      : 처음으로 **확실히** 틀린 과정 = 틀린 과정 중 뒤이은 두 과정 안에 또 틀린 과정이 있는 첫 곳
                 (한 번 실수는 실수로 본다). 추천 = 그 앞에서 마지막으로 다 맞힌 과정의 **다음 과정**
                 (시험지에 없는 과정도 건너뛰지 않는다: 14 통과 · 16 틀림 → 15).
                 끝까지 다 맞히면 천장 다음 과정 + "다음 형으로" 안내.
   scripts/check-level-test.js 가 전 형·두 판을 만들어 결정성·정수 답·중복 없음·채점 규칙을 확인한다.
   ============================================================ */
(function(){
'use strict';
const W = (typeof window !== 'undefined') ? window : global;
const TARGET = 20, PER_MAX = 2;

function stages(){ return (W.NM_STAGES || []).filter(s => s.courses); }

/* 형 목록 — 단계 i 에서 시작, 단계 i+1 끝까지 */
function forms(){
  const st = stages();
  return st.map((s, i) => {
    const nx = st[i + 1];
    return { id: i + 1, stage: s, next: nx || null, from: s.courses.from, to: (nx || s).courses.to };
  });
}

/* 과정 하나의 후보 스레드(순서 유지) — [{t, lv}] */
function candidates(courseId){
  const spec = (W.NM_COURSE_SPEC || []).find(x => x.id === courseId);
  if(!spec) return [];
  const TH = W.NM_THREADS || {}, TG = W.NM_TGEN || {}, RNG = W.NM_RNG;
  const order = [], top = {};
  (spec.drills || []).forEach(d => {
    const [t, l] = String(d).split('@'); const lv = +l || 1;
    if(!(t in top)) order.push(t);
    top[t] = Math.max(top[t] || 0, lv);
  });
  const out = [];
  order.forEach(t => {
    const th = TH[t], gen = th && TG[th.gen];
    if(!gen) return;
    const lvl = (th.levels || []).find(x => x.id === top[t]) || (th.levels || []).slice(-1)[0];
    if(!lvl) return;
    for(let i = 0; i < 6; i++){
      let p; try{ p = gen(lvl.params || {}, RNG.mulberry32(RNG.hashSeed('ltProbe' + t + i))); }catch(e){ return; }
      if(!p || !p.tex || typeof p.answer !== 'number' || !Number.isInteger(p.answer)) return;
    }
    out.push({ t, lv: lvl.id });
  });
  return out;
}

/* 형 하나의 시험지 — {form, v, items:[{no, course, t, lv, tex, prompt, answer}], courses:[과정 id…]} */
function build(formId, v){
  const f = forms().find(x => x.id === formId);
  if(!f) return null;
  v = v === 2 ? 2 : 1;
  const TH = W.NM_THREADS || {}, TG = W.NM_TGEN || {}, RNG = W.NM_RNG;
  const rows = [];
  for(let c = f.from; c <= f.to; c++){ const cs = candidates(c); if(cs.length) rows.push({ c, cs, n: 1 }); }
  /* 과정이 한 장(20문제)보다 많으면(공통수학2+대수 = 21과정) 처음·끝을 남기고 고르게 솎는다 —
     빠진 과정은 채점에서 앞뒤 과정으로 판단된다(시험지에 없는 과정 규칙과 같다). */
  if(rows.length > TARGET){
    const n = rows.length, keep = new Set();
    for(let k = 0; k < TARGET; k++) keep.add(Math.round(k * (n - 1) / (TARGET - 1)));
    for(let i = n - 1; i >= 0; i--) if(!keep.has(i)) rows.splice(i, 1);
  }
  /* 남는 자리를 고르게 나눠 한 문제씩 더 — 앞(쉬운 쪽)과 뒤(어려운 쪽)가 한쪽으로 쏠리지 않게 */
  let spare = Math.min(TARGET, rows.length * PER_MAX) - rows.length;
  if(spare > 0){
    const step = rows.length / spare;
    for(let k = 0; k < spare; k++) rows[Math.min(rows.length - 1, Math.floor(k * step + step / 2))].n++;
  }
  const items = [], seen = new Set();
  rows.forEach(r => {
    for(let j = 0; j < r.n; j++){
      const pick = r.cs[j % r.cs.length];
      const th = TH[pick.t], gen = TG[th.gen];
      const params = ((th.levels || []).find(x => x.id === pick.lv) || {}).params || {};
      let p = null;
      for(let tries = 0; tries < 20; tries++){
        const q = gen(params, RNG.mulberry32(RNG.hashSeed(`LT${f.id}v${v}c${r.c}j${j}r${tries}`)));
        const key = q.tex + '=' + q.answer;
        if(!seen.has(key) && Number.isInteger(q.answer)){ seen.add(key); p = q; break; }
      }
      if(!p) continue;
      items.push({ no: items.length + 1, course: r.c, t: pick.t, lv: pick.lv, tex: p.tex, prompt: p.prompt || null, answer: p.answer });
    }
  });
  return { form: f, v, items, courses: rows.map(r => r.c) };
}

/* 채점 — wrong: 틀린 문항 번호 배열(또는 Set). 반환 {rec, passedTo, firstFail, allRight, perCourse} */
function score(test, wrong){
  const bad = new Set(Array.from(wrong || []).map(Number));
  const per = test.courses.map(c => {
    const its = test.items.filter(i => i.course === c);
    return { c, n: its.length, miss: its.filter(i => bad.has(i.no)).length };
  });
  let firstFail = -1;
  for(let i = 0; i < per.length; i++){
    if(!per[i].miss) continue;
    const confirmed = i >= per.length - 2 || per.slice(i + 1, i + 3).some(x => x.miss);
    if(confirmed){ firstFail = i; break; }
  }
  const f = test.form;
  if(firstFail < 0){
    return { rec: Math.min(f.to + 1, maxCourse()), passedTo: f.to, firstFail: null, allRight: bad.size === 0, perCourse: per };
  }
  const passedTo = firstFail > 0 ? per[firstFail - 1].c : null;
  const rec = passedTo == null ? f.from : passedTo + 1;
  return { rec, passedTo, firstFail: per[firstFail].c, allRight: false, perCourse: per };
}
function maxCourse(){ const s = W.NM_COURSE_SPEC || []; return s.length ? s[s.length - 1].id : 45; }

W.NM_LEVEL_TEST = { forms, candidates, build, score, TARGET };
if(typeof module !== 'undefined' && module.exports) module.exports = W.NM_LEVEL_TEST;
})();
