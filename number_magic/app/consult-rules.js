/* ============================================================
   Numbers of Magic — 시작점 상담 규칙 (app/consult-rules.js, 2026-11-17)
   원장 「지금 무슨 책 몇 권을 하고 있고 두 자리 받아내림은 되고 … 정보가 부족하면 더 물어볼 수 있도록」
   → 「상담 버전」 → 「응 그렇게 만들어」.

   문제를 풀게 하지 않는다. 보호자의 답만으로 다음에 무엇을 물을지·어디서 시작할지 정한다. AI·서버 없음.
   단계표는 data/consult-ladder.js(교재별 사다리 → 우리 유형·과정).

   답 하나 = 기술(ref)마다 good(잘해요) · shaky(헷갈려요) · notyet(아직 안 배웠어요) · unsure(잘 모르겠어요).
   더 묻는 규칙
     1) 처음 물을 단계 = 지금 하는 권(막 시작했으면 앞 권도 먼저). 사다리는 교재마다 따로 — 기적의 계산법 17단계,
        소마셈 2019 P~D 46권, 두뇌로 과정 1~25(원장 2026-11-17 「대응 해야지」). 진도표가 없는 교재(구몬·원리셈 등)와
        교재 안 함은 기적의 계산법 사다리에서 나이·학년으로 시작 단계를 정한다.
     2) 「잘 모르겠어요」인데 예시 문제가 있으면 → 아이에게 그 문제를 내 보게 한다(맞힘·오래 걸림·틀림·못 해 봄).
        모두 세 문제까지, 높은 단계부터 단계마다 하나씩.
     3) 물은 가장 높은 단계가 다 「잘해요」면 → 한 단계 위를 묻는다(위로 셋까지).
     4) 물은 가장 낮은 단계의 절반 이상이 헷갈리거나 안 배웠으면 → 한 단계 아래를 묻는다(아래로 둘까지).
     5) 단계는 모두 다섯 번까지만 묻는다. 앞에서 답한 기술은 다시 묻지 않는다.
     6) 마지막에 한 번, 계산할 때 손가락으로 세거나 오래 걸리는지 묻는다.
   결과
     - 과정 단위로 본다: 약한 과정 = 헷갈리는 기술이 있거나 답한 기술의 절반 이상이 안 배운 것. 시작 = 약한 과정 중 가장 앞
       (우리 과정 차례는 교재 차례와 다를 수 있어서 — 구구단 과정 4가 세 자리 덧뺄 과정 5·6보다 앞). 약한 과정이 없으면
       잘하는 것 가운데 가장 뒤 과정의 다음 과정.
     - 잘하는 것이 대부분인 과정에 섞인 「안 배움」과 시작보다 앞의 「안 배움」은 시작점을 끌어내리지 않고 「빈틈」으로 따로 알린다.
     - 「잘 모르겠어요」로 남은 것이 있으면 문제로 확인하는 진단(연산 진단 평가)을 권한다.
   ============================================================ */
(function(root){
'use strict';
const MAX_STEPS = 5, MAX_UP = 3, MAX_DOWN = 2, MAX_PROBES = 3;
const AGES = ['k5', 'k6', 'k7', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'm'];
/* 나이·학년 → 처음 물을 단계(0~4 예비초등 1~5권, 5~16 초등 1~12권). 학년마다 기적 초등 두 권 중 앞 권. */
const AGE_ANCHOR = { k5: 0, k6: 1, k7: 3, g1: 5, g2: 7, g3: 9, g4: 11, g5: 13, g6: 15 };
/* 권별 진도표가 있는 교재 = 그 교재 사다리로 묻는다(기적의 계산법 · 소마셈 2019 · 두뇌로).
   나머지(구몬·원리셈·그 밖·안 함)는 기적의 계산법 사다리를 학교 진도 대신 쓰고 나이·학년으로 시작 단계를 잡는다. */
const MAPPED = { miracle: 'miracle', soma: 'soma', dunoro: 'dunoro', kumon: 'kumon' };

function data(){ return root.NM_CONSULT_LADDER; }
let current = null;   // 지금 상태의 사다리 — 아래 함수들이 state 를 받을 때마다 맞춘다
function use(state){ const p = state && state.profile; current = data().ladders[(p && MAPPED[p.book]) || 'miracle']; return current; }
function ladder(){ return current || data().ladders.miracle; }
function ladderFor(p){ return data().ladders[(p && MAPPED[p.book]) || 'miracle']; }
function courseOrder(key){ const c = key && data().courses[key]; return c ? c.order : Infinity; }

function newState(){
  return { profile: { age: null, book: null, stepId: null, progress: null },
    asked: [], answers: {}, probes: {}, fingers: null, probeAsked: [] };
}
function anchor(p){
  if(!p || p.age === 'm') return null;
  if(MAPPED[p.book] && p.stepId){
    const i = ladderFor(p).findIndex(s => s.id === p.stepId);
    if(i >= 0) return i;
  }
  return Object.prototype.hasOwnProperty.call(AGE_ANCHOR, p.age) ? AGE_ANCHOR[p.age] : null;
}
function initialSteps(p){
  const a = anchor(p);
  if(a == null) return [];
  return MAPPED[p.book] && p.progress === 'start' && a > 0 ? [a - 1, a] : [a];
}
/* 기술 상태 — 아이에게 내 본 결과가 있으면 그것이 먼저 */
function status(state, ref){
  const pr = state.probes[ref];
  if(pr === 'right') return 'good';
  if(pr === 'slow') return 'slow';
  if(pr === 'wrong') return 'shaky';
  const a = state.answers[ref];
  if(a === 'unsure') return 'unknown';
  return a || null;
}
function skillsOf(i){ return (ladder()[i] || { skills: [] }).skills; }
function unanswered(state, i){ return skillsOf(i).filter(k => !state.answers[k.ref]); }
function weakShare(state, i){
  const ks = skillsOf(i); if(!ks.length) return 0;
  return ks.filter(k => ['shaky', 'slow', 'notyet'].includes(status(state, k.ref))).length / ks.length;
}
function allGood(state, i){ const ks = skillsOf(i); return ks.length > 0 && ks.every(k => status(state, k.ref) === 'good'); }

/* 다음 질문 — {type:'skills', step} | {type:'probe', ref, step} | {type:'fingers'} | {type:'done'}.
   이미 다 답한 단계는 묻지 않고 「물은 것」으로 친다(state.asked 에 넣는다). */
function next(state){
  const p = state.profile;
  use(state);
  if(!p.age) return { type: 'age' };
  if(p.age !== 'm' && !p.book) return { type: 'book' };
  if(MAPPED[p.book] && !p.stepId) return { type: 'volume' };
  if(MAPPED[p.book] && !p.progress) return { type: 'progress' };
  if(p.age === 'm') return { type: 'done' };
  const init = initialSteps(p);
  for(const i of init){
    if(state.asked.includes(i)) continue;
    if(!unanswered(state, i).length){ state.asked.push(i); continue; }
    return { type: 'skills', step: i, why: 'start' };
  }
  /* 「잘 모르겠어요」 → 예시 문제가 있으면 아이에게 내 보기. 보호자에게 짐이 되지 않게 모두 세 문제까지,
     높은 단계부터 단계마다 하나씩. */
  if(state.probeAsked.length < MAX_PROBES){
    const order = state.asked.slice().sort((a, b) => b - a);
    for(const i of order){
      if(state.probeAsked.some(ref => skillsOf(i).some(k => k.ref === ref))) continue;
      const k = skillsOf(i).find(k => state.answers[k.ref] === 'unsure' && k.example && !state.probeAsked.includes(k.ref));
      if(k) return { type: 'probe', ref: k.ref, step: i };
    }
  }
  const lo0 = Math.min(...init), hi0 = Math.max(...init);
  for(let guard = 0; guard < ladder().length; guard++){
    if(state.asked.length >= MAX_STEPS) break;
    const hi = Math.max(...state.asked), lo = Math.min(...state.asked);
    let cand = null, why = null;
    if(allGood(state, hi) && hi + 1 < ladder().length && hi + 1 - hi0 <= MAX_UP && !state.asked.includes(hi + 1)){ cand = hi + 1; why = 'up'; }
    else if(weakShare(state, lo) >= 0.5 && lo - 1 >= 0 && lo0 - (lo - 1) <= MAX_DOWN && !state.asked.includes(lo - 1)){ cand = lo - 1; why = 'down'; }
    if(cand == null) break;
    if(!unanswered(state, cand).length){ state.asked.push(cand); continue; }
    return { type: 'skills', step: cand, why };
  }
  if(state.fingers == null) return { type: 'fingers' };
  return { type: 'done' };
}

function answerSkills(state, step, map){
  use(state);
  Object.keys(map).forEach(ref => { state.answers[ref] = map[ref]; });
  if(!state.asked.includes(step)) state.asked.push(step);
}
function answerProbe(state, ref, value){ state.probes[ref] = value; if(!state.probeAsked.includes(ref)) state.probeAsked.push(ref); }

/* 과정 안 회차까지(원장 2026-11-18 「구몬 진도로는 우리 과정도 세분화 되지 않아?」).
   시작 과정의 앞 회차가 이미 아는 것만 있으면 건너뛰어 「과정 N · M회차」로 잡는다. 회차를 건너뛰는 조건 =
   그 회차의 새 드릴(복습 표시 아님)이 모두 ① 아는 기술(같은 유형, 레벨이 같거나 낮음)이거나
   ② 시작 과정보다 앞 과정에서 이미 나온 것(같은 유형, 레벨이 같거나 낮음). 처음 만나는 모르는 회차에서 멈춘다.
   시작 과정 밖으로는 넘기지 않는다(과정을 다 알면 그 과정 1회차 — 과정은 시작 규칙이 이미 정했다).
   courses = 단계표의 courses({order, s:[[ '유형@레벨', … ] 회차마다]}), known = Map(유형 → 아는 가장 높은 레벨). */
function refineStart(courses, startKey, known){
  const keys = Object.keys(courses).filter(k => courses[k].s).sort((a, b) => courses[a].order - courses[b].order);
  const ci = keys.indexOf(startKey);
  if(ci < 0) return { course: startKey, session: 1 };
  const seen = new Map(), lvOf = r => { const i = r.lastIndexOf('@'); return [r.slice(0, i), +r.slice(i + 1)]; };
  keys.slice(0, ci).forEach(k => courses[k].s.forEach(ss => ss.forEach(r => { const [t, lv] = lvOf(r); if(!(seen.get(t) >= lv)) seen.set(t, lv); })));
  const knows = r => { const [t, lv] = lvOf(r); return known.get(t) >= lv || seen.get(t) >= lv; };
  const S = courses[startKey].s;
  for(let j = 0; j < S.length; j++) if(!S[j].length || !S[j].every(knows)) return { course: startKey, session: j + 1 };
  return { course: startKey, session: 1 };
}
function knownMap(refs){
  const m = new Map();
  refs.forEach(r => { const i = r.lastIndexOf('@'), t = r.slice(0, i), lv = +r.slice(i + 1); if(!(m.get(t) >= lv)) m.set(t, lv); });
  return m;
}

/* 결과 */
function result(state){
  const p = state.profile;
  use(state);
  if(p.age === 'm') return { middle: true };
  const seen = new Map();
  state.asked.slice().sort((a, b) => a - b).forEach(i => skillsOf(i).forEach(k => { if(!seen.has(k.ref)) seen.set(k.ref, Object.assign({ step: i }, k)); }));
  const list = [...seen.values()].map(k => Object.assign(k, { status: status(state, k.ref) })).filter(k => k.status);
  const by = s => list.filter(k => k.status === s);
  const good = by('good'), shaky = by('shaky').concat(by('slow')), notyet = by('notyet'), unknown = by('unknown');
  const minBy = arr => arr.filter(k => k.course).sort((a, b) => courseOrder(a.course) - courseOrder(b.course))[0] || null;
  /* 과정 단위로 본다(2026-11-17) — 우리 과정 차례는 교재 차례와 다를 수 있다(구구단 과정 4가 세 자리 덧뺄 과정 5·6보다 앞).
     약한 과정 = 헷갈리는 기술이 있거나, 답한 기술의 절반 이상이 안 배운 것. 시작 = 약한 과정 중 가장 앞.
     잘하는 것이 대부분인 과정에 섞인 「안 배움」 하나는 시작점을 끌어내리지 않고 「빈틈」으로만. */
  const groups = new Map();
  list.filter(k => k.course && k.status !== 'unknown').forEach(k => { if(!groups.has(k.course)) groups.set(k.course, []); groups.get(k.course).push(k); });
  const weak = [...groups.entries()].filter(([, ks]) => ks.some(k => k.status === 'shaky' || k.status === 'slow') ||
    ks.filter(k => k.status === 'notyet').length >= ks.length / 2).map(([c]) => c).sort((a, b) => courseOrder(a) - courseOrder(b));
  let start = null, reason = null;
  if(weak.length){
    start = weak[0];
    const inStart = list.filter(k => k.course === start);
    const sk = inStart.find(k => k.status === 'shaky' || k.status === 'slow');
    reason = sk ? { kind: 'shaky', skill: sk } : { kind: 'new', skill: inStart.find(k => k.status === 'notyet') };
  }
  const gaps = notyet.filter(k => !weak.includes(k.course) || (start && courseOrder(k.course) < courseOrder(start)));
  const ahead = notyet.filter(k => !gaps.includes(k));
  if(start){ /* 위에서 정함 */ }
  else if(good.length){
    const goodMax = good.reduce((m, k) => Math.max(m, courseOrder(k.course) === Infinity ? -1 : courseOrder(k.course)), -1);
    const keys = Object.keys(data().courses).sort((a, b) => courseOrder(a) - courseOrder(b));
    const top = keys.find(k => courseOrder(k) === goodMax);
    const after = keys[keys.indexOf(top) + 1];
    start = after || top; reason = { kind: 'next', course: top };
  } else {
    const a = anchor(p), first = minBy(a == null ? [] : skillsOf(a));
    start = first ? first.course : null; reason = { kind: 'unknown' };
  }
  const slowAny = by('slow').length > 0;
  const session = start && data().courses[start] && data().courses[start].s ? refineStart(data().courses, start, knownMap(good.map(k => k.ref))).session : 1;
  return { start, session, reason, good, shaky, notyet: ahead, gaps, unknown,
    pace: state.fingers === 'often' || slowAny ? 'slow' : state.fingers === 'sometimes' ? 'some' : 'ok',
    needCheck: unknown.length > 0 };
}

const api = { AGES, MAX_STEPS, MAPPED, newState, anchor, initialSteps, next, answerSkills, answerProbe, status, result, ladderFor, refineStart, knownMap };
root.NM_CONSULT_RULES = api;
if(typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
