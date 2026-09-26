/* ============================================================
   Numbers of Magic — 창의 연산 "과정" 표 (2026-09-26)
   설계: docs/creative-stages-design-2026-09-26.md §3-3(과정 빈칸 문항) · §3-4(기법 가족별 표 + 색 규칙)
   원장: "창의 연산 때 한 문제는 빈칸 넣기도 있어야" · "학습지도 이런 스킬(자릿값 색)이 들어가야"

   ── 무엇을 정하나 ──
   NM_CREATIVE_PROCESS.cfg      — 몇 번째 문항에 과정 빈칸·색 힌트를 줄지(원장 결정이 바뀌면 여기 한 곳만)
   NM_CREATIVE_PROCESS.threads  — 스레드(유형)마다 기법 가족(F1~F11)과 ★마법 자리(key = 풀이 줄 index),
                                  과정 빈칸 꼴(blank: 'key' = 꼴 A 마법 자리 빈칸 · 'reverse' = 꼴 B 거꾸로)
   NM_CREATIVE_PROCESS.ask      — 과정 빈칸 문항에 붙는 학생용 한 줄(해요체, ko/en/zh)
   NM_CREATIVE_PROCESS.pairLegend — 짝 색(pair)을 쓴 쪽의 범례 한 줄

   ── 지어내지 않는다 ──
   과정 빈칸은 생성기가 이미 낸 풀이(p.steps, 없으면 p.solution)의 한 줄에서 **수 하나**를 가린다.
   새 수식을 만들지 않고, 가린 값은 그 줄의 등식을 다시 계산해 정수 하나로만 풀리는지 확인한 뒤에만 쓴다
   (app/exam.js applyProcessBlank). 확인이 안 되면 그 문항은 손대지 않는다 — 가짜 빈칸 금지.

   ── 표에 없는 유형 ──
   { key:0, blank:'key' }(꼴 A, 첫 줄) · 색은 식 모양대로(덧뺄 place · 곱나눗 key).
   설계 표 §3-4 에 있지만 아직 스레드가 없는 것(AD11~AD16·SB8·SB10·SB12~SB14·EL6·MX7·MX8, ML1 L3·EL1 countUp)은
   생성기가 생기면 여기 한 줄씩 더한다.
   ============================================================ */
(function(){
'use strict';

var cfg = {
  /* 과정 빈칸(§3-3, 원장 결정 Q4 = 권고안): index % every === offset 인 문항. 6문항이면 (4), 12문항이면 (4)(8).
     스스로 풀기(점선만) 구간(뒤 1/4)은 건너뛴다 — 단, 그러면 하나도 없게 되는 짧은 회차(4문항)는 offset 문항 하나를 준다. */
  blankEvery: 4,
  blankOffset: 3,
  blankKeepBare: true,
  blankAtLeastOne: true,
  /* 색 힌트(§3-4 공통 규칙): index % every === offset 인 문항 — 6문항이면 (2)(5). 과정 빈칸 문항은 빼고,
     Training Course 의 식 줄과 ★마법 자리 줄 두 줄에만 칠한다. */
  colorEvery: 3,
  colorOffset: 1,
  /* 색을 주지 않는 가족 — F9(기준수, 수가 크고 개념이 관계), F10(수의 성질), F11(분수·소수, 원장 결정 Q5 = 권고안) */
  noColorFamilies: ['F9', 'F10', 'F11'],
  /* 짝 색(pair)을 쓰는 가족 — 합이 10·100(곱셈 짝은 곱이 10·100·1000)인 두 수, 수열의 첫수·끝수 */
  pairFamilies: ['F1', 'F7'],
  maxPairs: 4,
  /* 초등 학교 급에서만(중등 과정의 창의 회차엔 칠하지 않는다) — 학년은 exam.js pvGradeWantsHint 가 따로 본다 */
  colorSchoolTiers: ['elem']
};

/* 가족: F1 짝 만들기 · F2 보정(옆집) · F3 자리별·쪼개기 · F4 불변 · F5 역연산·등식 · F6 반과 배 ·
         F7 무지개 덧셈 · F8 자리의 마법 곱셈 · F9 기준수·근처 수 · F10 수의 성질 · F11 분수·소수 전환
   key: ★마법 자리 = 학습지에 찍히는 풀이 줄(trainStepsOf)의 index
   blank: 'key'(꼴 A) · 'reverse'(꼴 B) — reverse 의 at 은 "되돌리는 수"가 있는 줄(F2 보정 줄). at 이 없으면 key 줄.
   levels: 레벨마다 다른 가족(ML16 L1 ×5 = F6, L2 ÷5 = F4) */
var threads = {
  /* F1 짝 만들기 — ★짝 고르기, 꼴 A(짝 값), 짝 색 */
  AD8:  { fam:'F1', key:0, blank:'key' },
  ML12: { fam:'F1', key:0, blank:'key' },
  DC6:  { fam:'F1', key:0, blank:'key' },
  /* F2 보정(옆집) — ★딱 떨어지는 수로 바꾸기, 꼴 B(돌려받은 수) */
  AD9:  { fam:'F2', key:0, blank:'reverse', at:1 },
  SB5:  { fam:'F2', key:0, blank:'reverse', at:1 },
  ML13: { fam:'F2', key:0, blank:'reverse', at:1 },
  ML24: { fam:'F2', key:0, blank:'reverse', at:1 },
  ML14: { fam:'F2', key:1, blank:'reverse', at:2 },
  /* F3 자리별·쪼개기 — ★쪼개기, 꼴 A(쪼갠 조각), 자리 색 */
  ML22: { fam:'F3', key:0, blank:'key' },
  ML23: { fam:'F3', key:0, blank:'key' },
  DV9:  { fam:'F3', key:0, blank:'key' },
  /* F4 불변 — ★양쪽에 같은 수, 꼴 B(무엇으로 바꿨나) */
  DV10: { fam:'F4', key:0, blank:'reverse' },
  DV11: { fam:'F4', key:0, blank:'reverse' },
  CH1:  { fam:'F4', key:0, blank:'reverse' },
  /* F5 역연산·등식 */
  EL1:  { fam:'F5', key:0, blank:'key' },
  EL2:  { fam:'F5', key:0, blank:'key' },
  /* F6 반과 배 — ×5·×25 는 L1, ÷5·÷25 는 L2(F4) */
  ML1:  { fam:'F6', key:0, blank:'key' },
  ML16: { fam:'F6', key:0, blank:'key', levels:{ 2:{ fam:'F4', key:0, blank:'reverse' } } },
  ML17: { fam:'F6', key:0, blank:'key', levels:{ 2:{ fam:'F4', key:0, blank:'reverse' } } },
  /* F7 무지개 덧셈 — ★짝 합, 짝 색(첫수·끝수) */
  MX6:  { fam:'F7', key:0, blank:'key' },
  CH10: { fam:'F7', key:0, blank:'key' },
  MX2:  { fam:'F7', key:0, blank:'key' },
  /* F8 자리의 마법 곱셈 */
  ML18: { fam:'F8', key:0, blank:'key' },
  ML15: { fam:'F8', key:0, blank:'key' },
  ML19: { fam:'F8', key:0, blank:'key' },
  /* F9 기준수·근처 수 — 꼴 C(선택형)는 아직 없다: 꼴 A 로(기준수 자리), 색 없음 */
  CH11: { fam:'F9', key:0, blank:'key' },
  ML20: { fam:'F9', key:0, blank:'key' },
  CH2:  { fam:'F9', key:0, blank:'key' },
  CH7:  { fam:'F9', key:0, blank:'key' },
  CH12: { fam:'F9', key:0, blank:'key' },
  CH6:  { fam:'F9', key:0, blank:'key' },
  ML11: { levels:{ 5:{ fam:'F9', key:0, blank:'key' } } },
  /* F10 수의 성질 — 색 없음 */
  DV6:  { fam:'F10', key:0, blank:'key' },
  CH3:  { fam:'F10', key:0, blank:'key' },
  CH4:  { fam:'F10', key:0, blank:'key' },
  CH5:  { fam:'F10', key:0, blank:'key' },
  CH13: { fam:'F10', key:0, blank:'key' },
  ML21: { fam:'F10', key:0, blank:'key' },
  /* F11 분수·소수 전환 — 꼴 A(분자·분모·자리 수 중 정수 하나), 색 없음 */
  FR9:  { fam:'F11', key:0, blank:'key' },
  FR10: { fam:'F11', key:0, blank:'key' },
  FR11: { fam:'F11', key:0, blank:'key' },
  FR12: { fam:'F11', key:0, blank:'key' },
  DC4:  { fam:'F11', key:0, blank:'key' },
  DC5:  { fam:'F11', key:0, blank:'key' }
};

var DEFAULT = { fam:null, key:0, blank:'key' };

/* 스레드·레벨의 설정 한 벌 — 레벨 덮어쓰기까지 합친 값 */
function of(threadId, level){
  var t = threads[threadId];
  if(!t) return { fam:DEFAULT.fam, key:DEFAULT.key, blank:DEFAULT.blank, mapped:false };
  var lv = (t.levels && t.levels[level]) || null;
  var base = lv || t;
  if(!base.fam && !lv) return { fam:DEFAULT.fam, key:DEFAULT.key, blank:DEFAULT.blank, mapped:false };
  return { fam:base.fam || null, key:base.key != null ? base.key : 0, blank:base.blank || 'key',
    at:base.at, mapped:true };
}

/* 과정 빈칸 문항의 지시 한 줄 — 꼴마다(해요체) */
var ask = {
  key: { ko:'풀이 과정의 □에 알맞은 수를 써요.',
         en:'Write the missing number in the working.',
         zh:'在解题过程的□里填上合适的数。' },
  reverse: { ko:'바꾼 수만큼 되돌려요. □에 알맞은 수를 써요.',
             en:'Undo the change. Write the missing number.',
             zh:'改变了多少就还回多少。在□里填上合适的数。' },
  reverseSame: { ko:'양쪽을 똑같이 바꿨어요. □에 알맞은 수를 써요.',
                 en:'Both sides were changed the same way. Write the missing number.',
                 zh:'两边做了同样的变化。在□里填上合适的数。' }
};

var pairLegend = { ko:'같은 색 = 짝꿍', en:'Same color = partners', zh:'同一种颜色 = 好朋友' };

window.NM_CREATIVE_PROCESS = { cfg:cfg, threads:threads, of:of, ask:ask, pairLegend:pairLegend };
if(typeof module !== 'undefined' && module.exports) module.exports = window.NM_CREATIVE_PROCESS;
})();
