/* ============================================================
   Numbers of Magic — 1분 계산 속도 (app/speed-check.js, 2026-11-18)
   원장 「계산 속도 재는 것 넣어줘 · 우리도 진단 테스트 있잖아」.

   20문항 진단은 「무엇을 아는지」를 본다. 이 1분 검사는 「이미 아는 계산이 손에 붙었는지」를 본다.
   진단이 정한 시작 과정에 맞는 기본 셈 한 가지를 1분 동안 풀고, 맞힌 개수·정확도·느렸던 셈을 적는다.
     - 진도(시작 과정·회차)는 바꾸지 않는다. 학년별 「몇 개면 빠르다」 기준도 두지 않는다(근거 있는 기준이 없다).
       대신 같은 아이의 지난 기록과 견준다.
     - 답의 자릿수만큼 쓰면 바로 다음 문제로 넘어간다(엔터 없이) — 답 자릿수로 정답을 알려 주지는 않는다.
   묶음(과정 번호로 고름)
     add10    과정 0~1   10까지 더하기
     addsub20 과정 2~3   한 자리 수 더하기·빼기(20까지)
     times    과정 4~7   곱셈구구(2~9단)
     muldiv   과정 8~28  곱셈구구와 나눗셈(구구 거꾸로)
     integer  과정 29~37 정수(−9~9) 더하기·빼기
     과정 38 이상(고등)은 재지 않는다.
   ============================================================ */
(function(root){
'use strict';
const SECONDS = 60;
const SETS = {
  add10:    { ko: '10까지 더하기', en: 'Addition within 10', zh: '10以内加法' },
  addsub20: { ko: '한 자리 수 더하기·빼기', en: 'One-digit addition and subtraction', zh: '一位数加减法' },
  times:    { ko: '곱셈구구', en: 'Times tables', zh: '乘法口诀' },
  muldiv:   { ko: '곱셈구구와 나눗셈', en: 'Times tables and division facts', zh: '乘法口诀与除法' },
  integer:  { ko: '정수 더하기·빼기', en: 'Integer addition and subtraction', zh: '整数加减法' }
};
function setFor(courseKey){
  const n = Number(String(courseKey || '').replace(/^C/, ''));
  if(!Number.isFinite(n)) return null;
  if(n <= 1) return 'add10';
  if(n <= 3) return 'addsub20';
  if(n <= 7) return 'times';
  if(n <= 28) return 'muldiv';
  if(n <= 37) return 'integer';
  return null;
}
/* 시드 고정 난수 — 같은 시드면 같은 문제 차례(검사기가 다시 만든다) */
function rng(seed){
  let h = 2166136261;
  for(const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const neg = v => v < 0 ? '(−' + (-v) + ')' : String(v);
function one(set, r){
  const int = (a, b) => a + Math.floor(r() * (b - a + 1));
  if(set === 'add10'){ const s = int(2, 10), a = int(1, s - 1); return { q: a + ' + ' + (s - a), a: s }; }
  if(set === 'addsub20'){
    const a = int(1, 9), b = int(1, 9);
    return r() < 0.5 ? { q: a + ' + ' + b, a: a + b } : { q: (a + b) + ' − ' + b, a: a };
  }
  if(set === 'times'){ const a = int(2, 9), b = int(2, 9); return { q: a + ' × ' + b, a: a * b }; }
  if(set === 'muldiv'){
    const a = int(2, 9), b = int(2, 9);
    return r() < 0.5 ? { q: a + ' × ' + b, a: a * b } : { q: (a * b) + ' ÷ ' + a, a: b };
  }
  if(set === 'integer'){
    let a = int(-9, 9), b = int(-9, 9);
    if(a === 0) a = 4; if(b === 0) b = -3;
    return r() < 0.5 ? { q: neg(a) + ' + ' + neg(b), a: a + b } : { q: neg(a) + ' − ' + neg(b), a: a - b };
  }
  throw new Error('NM_SPEED_CHECK: unknown set ' + set);
}
/* 1분에 다 못 풀 만큼(80) 만든다. 바로 앞 문제와 같은 셈은 다시 뽑는다. */
function make(set, seed, n){
  const r = rng(set + '|' + seed), out = [];
  while(out.length < (n || 80)){
    const p = one(set, r);
    if(out.length && out[out.length - 1].q === p.q) continue;
    out.push(p);
  }
  return out;
}
/* 답 문자열(쓰는 모양) — 음수는 앞에 − */
const answerText = v => (v < 0 ? '−' : '') + Math.abs(v);
/* 기록 정리. log = [{q, a, v(쓴 답 문자열), ms}] — 시간이 끝날 때 쓰던 문제는 넣지 않는다. */
function summarize(set, log, seconds){
  const sec = seconds || SECONDS;
  const items = (log || []).filter(x => x && typeof x.ms === 'number');
  const ok = x => String(x.v).replace(/[−-]/g, '-') === String(x.a);
  const correct = items.filter(ok).length, attempted = items.length;
  const okMs = items.filter(ok).map(x => x.ms).sort((a, b) => a - b);
  const median = okMs.length ? okMs[Math.floor((okMs.length - 1) / 2)] : null;
  const slow = items.filter(ok).slice().sort((a, b) => b.ms - a.ms).slice(0, 3).map(x => ({ q: x.q, a: x.a, sec: +(x.ms / 1000).toFixed(1) }));
  const wrong = items.filter(x => !ok(x)).map(x => ({ q: x.q, a: x.a, v: x.v }));
  return { set, seconds: sec, attempted, correct, accuracy: attempted ? Math.round(correct / attempted * 100) : 0,
    perMin: Math.round(correct * 60 / sec), medianSec: median == null ? null : +(median / 1000).toFixed(1), slow, wrong };
}
/* 20문항 진단에서 맞힌 문항이 한 문제에 보통 몇 초 걸렸는지(묶음별). 참고만. */
function itemPace(profile){
  const out = {};
  (profile || []).forEach(p => {
    if(p.ok !== true || typeof p.sec !== 'number') return;
    (out[p.band] = out[p.band] || []).push(p.sec);
  });
  Object.keys(out).forEach(b => { const s = out[b].sort((x, y) => x - y); out[b] = { n: s.length, median: +s[Math.floor((s.length - 1) / 2)].toFixed(1) }; });
  return out;
}
const api = { SECONDS, SETS, setFor, make, one, summarize, itemPace, answerText };
root.NM_SPEED_CHECK = api;
if(typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
