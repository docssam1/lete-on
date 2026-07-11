/* ============================================================
   Numbers of Magic — 시드 RNG + 생성기 공용 헬퍼
   시험/인쇄 학습지 재현(같은 코드=같은 문제)을 위해 모든 스레드
   생성기는 Math.random 대신 여기서 만든 rng를 주입받아 쓴다.
   계약: NM_TGEN[genKey] = (params, rng) => problem
   problem = {
     prompt:{ko,en,zh},        // 지시문(동적 수 포함, 3개 언어 필수)
     tex:'8 + 7 = \\square',   // KaTeX 표시용
     answer:15,                // 최종 답(정수). 분수/소수는 steps의 blank로 분해
     answerType:'number'|'decimal'|'steps',
     steps:[                   // 있으면 단계 채우기 위젯 사용(계산기 금지 원칙)
       {tex:'8 + \\square + 5', blank:2},   // blank = 그 단계의 정답(정수)
       {tex:'10 + \\square',   blank:5},
       {tex:'\\square',        blank:15}
     ],
     widget:'cubes'|'array'|'steps'|'split'|'tenframe'|'vertical'|'missing'|'numpad'|'selectPairs',
     // cubes(큐브 옮기기·가르기) / array(직사각형·정사각형 만들기) 위젯용 필드:
     cubes:{piles:[8,7], moveTo:10},          // widget:'cubes' — 더미 구성과 목표
     array:{n:12, rows:3}                     // widget:'array' — 큐브 수, 목표 행수(없으면 자유 탐색)
   }
   ============================================================ */
(function(){
'use strict';

/* mulberry32 — 32bit 시드 PRNG */
function mulberry32(seed){
  let a = seed >>> 0;
  return function(){
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* 문자열 → 32bit 시드 (학습지 코드 해시용) */
function hashSeed(str){
  let h = 2166136261 >>> 0;
  for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/* 랜덤 시드 학습지 코드 생성 (5자 base36) */
function newCode(){
  return Math.floor(Math.random()*60466176).toString(36).padStart(5,'0');
}

/* rng 기반 헬퍼 — 생성기에서 R(rng,a,b) 형태로 사용 */
const R    = (rng,a,b)=>Math.floor(rng()*(b-a+1))+a;
const pick = (rng,arr)=>arr[Math.floor(rng()*arr.length)];
const shuffle = (rng,a)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};

window.NM_RNG = { mulberry32, hashSeed, newCode, R, pick, shuffle };
window.NM_TGEN = window.NM_TGEN || {};   // 스레드 생성기 레지스트리 (engine/threads/*.js가 채움)

if(typeof module!=='undefined'&&module.exports)module.exports={mulberry32,hashSeed,newCode,R,pick,shuffle};
})();
