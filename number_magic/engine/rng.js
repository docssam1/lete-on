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
// Korean particles use the spoken ending. a/b is read "b분의 a".
function koBatchim(value){
  const s=String(value).trim(),fraction=s.match(/^(-?\d+)\s*\/\s*\d+$/),spoken=fraction?fraction[1]:s,last=spoken.slice(-1);
  if(/\d/.test(last))return /[013678]/.test(last);
  const c=last.charCodeAt(0)-0xac00;return c>=0&&c<11172&&c%28!==0;
}
function koJosa(value,withBatchim,without){
  const s=String(value),fraction=s.trim().match(/^(-?\d+)\s*\/\s*\d+$/),last=(fraction?fraction[1]:s.trim()).slice(-1),c=last.charCodeAt(0)-0xac00;
  const rieul=/[178]/.test(last)||c>=0&&c<11172&&c%28===8;
  return s+(koBatchim(s)&&!(withBatchim==='으로'&&rieul)?withBatchim:without);
}

window.NM_RNG = { mulberry32, hashSeed, newCode, R, pick, shuffle, koBatchim, koJosa };
/* ── 빼기 키(−)를 보일 생성기(2026-11-17, 원장 「정수의 계산에서 음수가 나와 · 음수 답을 쓸 수 없어」) ──
   숫자 자판의 빼기 키는 문항의 negative 표시가 있을 때만 나온다. 그런데 표시를 붙이는 방식이 생성기마다 달랐다:
   ① 정수의 덧셈·뺄셈·곱셈·나눗셈·거듭제곱·혼합 계산(md2·md4·md5·md6)은 아예 안 붙여, 단원 확인·진단·대결처럼
      단계 위젯을 거치지 않는 화면에서는 음수 답을 넣을 수 없었다.
   ② 나머지 대부분은 답이 음수인 문항에만 붙여, 빼기 키가 보이면 「답이 음수」라는 힌트가 됐다.
   그래서 음수 답(또는 음수 단계 답)이 나올 수 있는 생성기는 **답의 부호와 상관없이 모든 문항**에 negative 를 붙인다.
   목록은 check-negative-keypad.js 가 모든 유형·레벨을 돌려 지킨다(빠진 생성기가 있으면 실패). 전부 중등(md) 생성기다. */
const NEG_GENS = new Set(['md100_rangeExtrema','md101_higherEq','md102_cubicVieta','md103_omega','md104_simulQuad','md105_indefinite','md106_exprRange','md107_linSystem','md108_absIneq','md109_quadSystem','md10_expLaw','md115_centroid','md116_pointLine','md117_circleAxis','md118_circleLine','md119_tangentLine','md11_monoMulDiv','md120_translate','md121_reflect','md125_truthSet','md126_absIneq','md127_funcCount','md128_compose','md129_inverse','md12_polyAddSub','md130_ratExpr','md131_ratFunc','md132_radExpr','md133_radFunc','md135_commonLog','md136_expGraph','md137_expMaxMin','md138_logGraph','md139_logMaxMin','md13_monoTimesPoly','md140_radian','md142_trigDef','md143_trigGraph','md146_snAn','md147_apExtreme','md14_isolateX','md151_recDef','md152_recurrence','md154_diffRules','md155_mvt','md156_monotone','md157_closedMax','md158_rootsIneq','md159_defInt','md19_expandFormula','md1_intConcept','md20_factorBasic','md21_polyMulDiv','md22_cubeFormula','md23_identity','md24_remainderTheorem','md25_factorAdvanced','md26_discriminant','md27_rootsSumProduct','md28_quadraticFormula','md29_quadIneq','md2_intAddSub','md30_matrix2x2','md32_midSection','md33_lineEquation','md34_parallelPerp','md35_circleEquation','md3_ratAddSub','md40_arithmeticSeq','md41_geometricSeq','md42_sigmaSum','md43_limit','md44_derivative','md45_tangentLine','md46_polyIntegral','md48_expressionValue','md49_linearExprOps','md4_intMulDiv','md50_linearEquation','md51_proportion','md52_expEquation','md53_logEquation','md54_expLogInequality','md57_trigMaxMinPeriod','md59_continuityConstant','md5_signedPower','md60_extrema','md62_velocityDistance','md63_simultaneous','md64_linearInequality','md65_linearFunction','md66_quadEquation','md67_quadVertex','md68_coordinate','md69_proportionGraph','md6_intMixed','md73_functionValue','md74_lineGraph','md75_lineEquation','md78_quadBasic','md79_quadShift','md7_ratMulDiv','md80_quadExtrema','md81_quadFind','md83_radicalAddSub','md85_dispersion','md89_intApply','md91_formulaVariant','md92_quadRemainder','md93_factorTheorem','md95_complexArith','md96_complexEqual','md97_iPower','md98_buildQuadratic','md99_graphLine']);
/* 레지스트리에 들어오는 생성기를 감싸 negative 를 붙인다. 생성기 파일은 `NM_TGEN.x = function…`으로 넣으므로
   한 곳에서 걸러진다 — 앱의 단원·진단·대결·학습지 어느 길로 문제를 만들어도 같다. 시드 흐름(rng)은 건드리지 않는다. */
function negWrap(key, fn){
  if(typeof fn !== 'function' || !NEG_GENS.has(key) || fn.__nmNeg) return fn;
  const w = function(){ const p = fn.apply(this, arguments); if(p && typeof p === 'object' && !Array.isArray(p)) p.negative = true; return p; };
  w.__nmNeg = true;
  return w;
}
const tgenBase = window.NM_TGEN || {};
Object.keys(tgenBase).forEach(k => { tgenBase[k] = negWrap(k, tgenBase[k]); });
window.NM_TGEN = (typeof Proxy === 'function' && !tgenBase.__nmNegProxy)
  ? new Proxy(tgenBase, { set(t, k, v){ t[k] = negWrap(k, v); return true; },
                          get(t, k){ return k === '__nmNegProxy' ? true : t[k]; } })
  : tgenBase;   // 스레드 생성기 레지스트리 (engine/threads/*.js가 채움)
window.NM_NEG_GENS = NEG_GENS;

if(typeof module!=='undefined'&&module.exports)module.exports={mulberry32,hashSeed,newCode,R,pick,shuffle,koBatchim,koJosa};
})();
