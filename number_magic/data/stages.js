/* ============================================================
   Numbers of Magic — 학습 단계(Stage) 정의 · 2026-09-07
   원장 지시: "제대로된 로드맵 만들고 광고 페이지도 수정해 … 수는 이렇게 공부해야 한다는 것을"

   왜 이 파일이 필요한가.
   지금까지 로드맵은 두 벌로 흩어져 있었다 — data/roadmap.js 의 챕터 60개(스토리 지도)와
   data/courses.js 의 과정 45개(학습지 사다리). 둘 다 "다음 한 걸음"은 보여 주지만 **아이가
   지금 어느 단계에 있고 그 단계에서 수를 어떻게 공부하는지**는 어디에도 없었다. 광고 페이지의
   세로 사다리(0급·초급·중급·고급·심화)는 또 세 번째 이름이었다.

   그래서 이 파일이 **하나의 단계 축**이다. 챕터도 과정도 여기에 붙는다:
     NM_STAGE_OF_CHAPTER('R3') → sprout      NM_STAGE_OF_COURSE(20) → mastery
   광고(landing.html)·앱 로드맵 화면·주간 학습지 표지가 같은 단계 이름을 쓰게 하는 것이 목적이다.

   ── 지켜야 할 것 ──
   - 순수 대입만 한다(의존 없음). ws.html 에는 main.js 도 roadmap.js 도 없다.
   - weeks 는 courses.js 의 **세션 수 실측값**이다(주 1회 기준). 손으로 고치지 말고
     scripts/check-stages.js 로 검산한다 — 코드가 바뀌면 광고가 조용히 틀린다.
   - band(학년대)는 앱 ROAD_TIERS 문구를 그대로 쓴다. 우리 편성은 학교 진도보다 앞서 있어서
     (계산의 새싹에 구구단이 들어 있다) aheadNote 를 반드시 같이 노출한다 —
     "우리 아이 초2인데 왜 새싹이냐"가 상담에서 실제로 나오는 질문이다.
   - status: 'live'(전 과정 편성 완료) | 'partial'(과정은 있으나 마법 유닛이 얇음).
     없는 것을 있다고 쓰지 않는다(광고-메시지-원칙.md §3).
   ============================================================ */
(function(){
'use strict';

window.NM_STAGES = [
  {
    key:'numberland', icon:'🐤', accent:'#6FA85B', status:'live',
    name:{ko:'수의 나라',en:'Number Land',zh:'数字之国'},
    band:{ko:'유아 5~7세',en:'Ages 5–7',zh:'幼儿5~7岁'},
    chapters:['N0','N1','N2','N3','N4'],
    tiers:[], courses:null, weeks:null,
    learn:{
      ko:'수 세기와 개수, 순서와 뛰어세기, 몇째와 크기 비교, 수의 여러 표현. 손으로 모으고 가릅니다.',
      en:'Counting and quantity, order and skip-counting, ordinals and comparing, many ways to show a number. Gathering and splitting by hand.',
      zh:'数数与数量、顺序与跳数、第几个与大小比较、数的多种表示。用手来合与分。'},
    how:{
      ko:'수와 친해지는 것이 목표라 시간을 재지 않습니다. 구슬을 두 접시로 직접 옮기며 5가 2와 3으로 갈라졌다가 다시 모이는 것을 손으로 봅니다. 이 단계의 가르기가 다음 단계의 보수이고, 훗날 분배법칙입니다.',
      en:'The goal is to befriend numbers, so nothing is timed. The child moves beads onto two plates and sees 5 split into 2 and 3, then come back together. This splitting becomes complements next, and the distributive law later.',
      zh:'目标是与数字亲近，所以不计时。孩子把珠子分到两个盘子里，亲眼看到5分成2和3，再合回来。这里的“分”就是下一阶段的补数，也是日后的分配律。'},
    example:'5 = 2 + 3',
    symbols:[{sym:'5', tr:{ko:'숫자와 탤리 막대 — 수는 그릴 수 있다',en:'Numerals and tally marks — a number can be drawn',zh:'数字与计数符号——数是可以画出来的'}}],
    symbolNote:{ko:'연산 기호는 아직 없습니다. + 는 다음 단계 과정 1에서 처음 만납니다.',
      en:'No operation symbols yet. The + sign is first met in Course 1 of the next stage.',
      zh:'还没有运算符号。＋在下一阶段的第1课程首次出现。'},
    meta:{ko:'로드맵 5칸 · 유닛 15 · 과정 번호 없는 프롤로그',en:'5 map stops · 15 units · a prologue with no course numbers',zh:'地图5站 · 15个单元 · 没有课程编号的序章'}
  },
  {
    key:'sprout', icon:'🌱', accent:'#16417C', status:'live',
    name:{ko:'계산의 새싹',en:'Sprout',zh:'计算的新芽'},
    band:{ko:'6~7세 · 초등 1학년',en:'Ages 6–7 · Grade 1',zh:'6~7岁 · 小学一年级'},
    chapters:['R0','R1','G0','G1','R2','R3','R4','T4','R5','R6','R7','R8'],
    tiers:['level1'], courses:{from:1,to:10}, weeks:55,
    learn:{
      ko:'자릿값과 모으기·가르기, 보수 5와 10, 받아올림·받아내림, 두 자리에서 네 자리 덧뺄셈, 구구단 2~9단, 나눗셈의 시작.',
      en:'Place value, gathering and splitting, complements of 5 and 10, carrying and borrowing, two- to four-digit addition and subtraction, times tables 2–9, the start of division.',
      zh:'位值与合分、5和10的补数、进位与退位、两位到四位数加减、2~9乘法口诀、除法入门。'},
    how:{
      ko:'수 감각의 첫 습관은 보수입니다. 8 + 7이 어려우면 7에서 2를 빌려 10을 먼저 만듭니다. 필산은 학교 진도 그대로 정확한 절차로 다지고, 같은 문제를 그 옆에서 펼쳐 다시 만듭니다.',
      en:'The first habit of number sense is the complement. If 8 + 7 is hard, borrow 2 from the 7 and make 10 first. The column method is practised exactly as school teaches it, and beside it the same problem is unfolded and remade.',
      zh:'数感的第一个习惯是补数。8＋7难，就从7里借2先凑成10。竖式按学校进度扎实练，旁边再把同一道题拆开重做一遍。'},
    example:'8 + 7 → 8 + 2 + 5 → 10 + 5 → 15',
    symbols:[
      {sym:'+', tr:{ko:'모아라',en:'put together',zh:'合起来'}},
      {sym:'=', tr:{ko:'양쪽이 같다 — 답이 나온다는 뜻이 아닙니다',en:'both sides are the same — not "here comes the answer"',zh:'两边一样——不是“答案来了”的意思'}},
      {sym:'□', tr:{ko:'아직 모르는 수의 자리 — 중1의 x가 여기서 자랍니다',en:'the seat of a number we do not know yet — the x of middle school grows from here',zh:'还不知道的数的位置——初一的x就是从这里长出来的'}}],
    aheadNote:{ko:'학교 진도보다 앞선 편성이라 구구단까지 이 단계에 들어 있습니다.',
      en:'The plan runs ahead of school, so times tables already sit in this stage.',
      zh:'编排比学校进度提前，所以乘法口诀已经在这一阶段。'},
    meta:{ko:'과정 1~10 · 주 1회 기준 55주',en:'Courses 1–10 · 55 weeks at one sheet a week',zh:'课程1~10 · 每周1次约55周'}
  },
  {
    key:'leap', icon:'🚀', accent:'#16417C', status:'live',
    name:{ko:'계산의 도약',en:'Leap',zh:'计算的跃进'},
    band:{ko:'초등 1학년 말 ~ 2학년',en:'End of Grade 1 – Grade 2',zh:'小学一年级末~二年级'},
    chapters:['T8','R9','T9','R10','R11','R12','R13','R14'],
    tiers:['level2'], courses:{from:11,to:16}, weeks:26,
    learn:{
      ko:'두 자리×두 자리, 나눗셈과 역연산, 분수의 첫걸음, 세 자리×두 자리, 두 자리로 나누기, 혼합계산.',
      en:'Two-digit × two-digit, division and inverse operations, first steps in fractions, three-digit × two-digit, dividing by two digits, mixed operations.',
      zh:'两位数乘两位数、除法与逆运算、分数入门、三位数乘两位数、除以两位数、混合运算。'},
    how:{
      ko:'분배법칙을 문자보다 수로 먼저 배웁니다. 47 × 6은 40 × 6과 7 × 6으로 쪼개고, × 5는 × 10의 절반으로 봅니다. 받아올림에서 아이가 가장 자주 멈추는 시기라, 개인별 정체 감지와 보강이 여기서 제일 많이 일합니다.',
      en:'The distributive law is learned with numbers before letters. 47 × 6 splits into 40 × 6 and 7 × 6; × 5 is seen as half of × 10. This is where children stall most often, so the per-child stall detection works hardest here.',
      zh:'分配律先用数学会，再用字母。47×6拆成40×6和7×6；×5看作×10的一半。这个阶段最容易卡住，所以个别停滞检测在这里工作得最多。'},
    example:'47 × 6 → 40 × 6 + 7 × 6 → 240 + 42 → 282',
    symbols:[
      {sym:'a/b', tr:{ko:'b로 나눈 것 중 a — 분수 막대 그림이 기호보다 먼저입니다',en:'a of b equal parts — the fraction bar picture comes before the symbol',zh:'分成b份中的a份——分数条的图先于符号'}},
      {sym:'( )', tr:{ko:'먼저 계산할 묶음',en:'the bundle to compute first',zh:'先算的那一组'}}],
    meta:{ko:'과정 11~16 · 주 1회 기준 26주',en:'Courses 11–16 · 26 weeks at one sheet a week',zh:'课程11~16 · 每周1次约26周'}
  },
  {
    key:'mastery', icon:'👑', accent:'#0E2C57', status:'live',
    name:{ko:'계산의 정복',en:'Mastery',zh:'计算的征服'},
    band:{ko:'초등 2학년 말 ~ 3학년',en:'End of Grade 2 – Grade 3',zh:'小学二年级末~三年级'},
    chapters:['T14','R15','T15','R16','CR8','R17'],
    tiers:['level3'], courses:{from:17,to:25}, weeks:38,
    learn:{
      ko:'소수 덧뺄과 곱셈, 제곱수, 약수와 배수·소인수분해, 이분모 분수, 분수 곱셈과 나눗셈, 수열, 백분율과 비율.',
      en:'Decimal addition, subtraction and multiplication, square numbers, factors and multiples, fractions with unlike denominators, multiplying and dividing fractions, sequences, percentages and ratios.',
      zh:'小数加减与乘法、平方数、约数与倍数与质因数分解、异分母分数、分数乘除、数列、百分数与比。'},
    how:{
      ko:'수 사이의 관계로 계산을 줄입니다. 2와 5는 친구라서 × 25는 × 100 ÷ 4이고, 1부터 100까지는 첫수와 끝수를 짝지어 5050입니다. 과정은 가로줄이고 계보는 세로줄이라, 마법마다 나중에 무엇으로 자라는지가 카드에 적혀 있습니다.',
      en:'Relations between numbers remove the calculation. 2 and 5 are friends, so × 25 is × 100 ÷ 4; 1 to 100 pairs first with last and gives 5050. Courses run across, lineages run down — each magic card says what it grows into later.',
      zh:'用数与数的关系省掉计算。2和5是朋友，所以×25就是×100÷4；1到100首尾配对得5050。课程是横线，脉络是竖线——每张魔法卡都写着它以后会长成什么。'},
    example:'× 25 → × 100 ÷ 4 · 1 + 2 + … + 100 → (1 + 100) × 50 → 5050',
    symbols:[
      {sym:'0.1', tr:{ko:'소수점 — 1보다 작은 자리를 여는 점',en:'the decimal point — the door to places below one',zh:'小数点——打开比1更小的位'}},
      {sym:'n²', tr:{ko:'같은 수를 두 번 곱해라',en:'multiply the same number twice',zh:'同一个数乘两次'}},
      {sym:'%', tr:{ko:'100 중 몇',en:'how many out of 100',zh:'100中的几'}}],
    aheadNote:{ko:'학교 진도로는 초4~5에 나오는 내용을 여기서 만납니다.',
      en:'In school terms this covers Grade 4–5 material.',
      zh:'按学校进度，这里学的是小学四~五年级的内容。'},
    meta:{ko:'과정 17~25 · 주 1회 기준 38주 · 학교로는 초4~5 내용',en:'Courses 17–25 · 38 weeks · the end of the arithmetic track',zh:'课程17~25 · 约38周 · 运算段的终点'}
  },
  {
    key:'tower', icon:'🗼', accent:'#C9A063', status:'live',
    name:{ko:'경시의 탑',en:'The Tower',zh:'竞赛之塔'},
    band:{ko:'초등 심화 · 중등 준비',en:'Elementary deep-dive · bridge to middle school',zh:'小学进阶 · 初中衔接'},
    chapters:['CR9','CR10','CR11','CRB'],
    tiers:['challenge'], courses:{from:26,to:28}, weeks:15,
    learn:{
      ko:'한쪽으로 모으기와 100 보수 곱, 피라미드 곱셈, 진법과 1001의 법칙, 순환소수, 50·100·1000 근처의 제곱.',
      en:'Shifting to one side, complement multiplication near 100, pyramid multiplication, number bases and the 1001 rule, repeating decimals, squares near 50, 100 and 1000.',
      zh:'向一边归拢与100补数乘法、金字塔乘法、进位制与1001法则、循环小数、50·100·1000附近的平方。'},
    how:{
      ko:'관계를 알면 계산이 사라집니다. 19 × 21은 20² − 1입니다. 이 단계의 출구가 곧 중학교의 입구라, 여기서 손으로 한 것이 중3의 곱셈공식과 그대로 이어집니다.',
      en:'Know the relation and the calculation disappears: 19 × 21 is 20² − 1. The exit here is the entrance to middle school — what the hand does now becomes the product formulas of Grade 9.',
      zh:'懂了关系，计算就消失了：19×21就是20²−1。这一阶段的出口就是初中的入口——现在手上做的，正是初三的乘法公式。'},
    example:'19 × 21 → 20² − 1 → 399',
    symbols:[{sym:'a² a³', tr:{ko:'제곱과 세제곱 — (a+b)(a−b)의 수 버전',en:'squares and cubes — the number version of (a+b)(a−b)',zh:'平方与立方——(a+b)(a−b)的数字版'}}],
    freeNote:{ko:'권유일 뿐 잠금이 아닙니다. 건너뛰고 중학교로 가도 되고, 나중에 돌아와도 됩니다.',
      en:'A suggestion, never a lock. Skip to middle school and come back later if you like.',
      zh:'只是建议，不是锁。可以跳到初中，以后再回来。'},
    meta:{ko:'과정 26~28 · 주 1회 기준 15주',en:'Courses 26–28 · 15 weeks',zh:'课程26~28 · 约15周'}
  },
  {
    key:'middle', icon:'🔤', accent:'#0E2C57', status:'live',
    name:{ko:'중학교 — 기호가 바뀌는 자리',en:'Middle School — where the symbols change',zh:'初中——符号改变的地方'},
    band:{ko:'중학교 1~3학년',en:'Grades 7–9',zh:'初中一~三年级'},
    chapters:['W8-1','W8-2','W8-3','W8-4','W8-5','W9-1','W9-2','W10-1','LAB-NUMLINE','W10-2'],
    tiers:['middle1','middle2','middle3'], courses:{from:29,to:35}, weeks:33,
    learn:{
      ko:'정수와 유리수, 부호의 규칙, 문자와 식, 방정식과 비례, 지수와 단항식, 다항식, 제곱근의 세계, 곱셈공식과 인수분해.',
      en:'Integers and rationals, the rules of sign, letters and expressions, equations and proportion, exponents and monomials, polynomials, square roots, product formulas and factorisation.',
      zh:'整数与有理数、符号法则、字母与式、方程与比例、指数与单项式、多项式、平方根、乘法公式与因式分解。'},
    how:{
      ko:'기호가 바뀌는 순간이 진짜 고비라, 순서를 말 → 그림 → 내 표기 → 표준 기호로 고정합니다. 음수는 해발과 해저로, √는 땅 위의 9와 뿌리의 3 그림으로 먼저 만납니다. 초등에서 수로 하던 쪼개기가 여기서 문자로 옮겨 갑니다.',
      en:'The real hurdle is the moment the symbols change, so the order is fixed: words → picture → my own notation → the standard symbol. Negatives arrive as altitude and depth, √ as the 9 above ground and the 3 in the root. The splitting done with numbers now moves into letters.',
      zh:'真正的坎是符号改变的瞬间，所以顺序固定为：话 → 图 → 自己的写法 → 标准符号。负数先以海拔和海底出现，√先看作地上的9和根部的3。小学用数做的拆分，在这里搬到字母上。'},
    example:'47 × 6 = 40 × 6 + 7 × 6 → (a + b)c = ac + bc → (a + b)² = a² + 2ab + b²',
    symbols:[
      {sym:'−', tr:{ko:'0을 기준으로 반대 방향',en:'the opposite direction from zero',zh:'以0为界的相反方向'}},
      {sym:'x', tr:{ko:'아직 모르는 수의 자리 — 초1의 □가 자란 것',en:'the seat of the unknown — the □ of Grade 1, grown up',zh:'未知数的位置——小一的□长大了'}},
      {sym:'√', tr:{ko:'제곱하기 전의 나',en:'me, before I was squared',zh:'平方之前的我'}}],
    meta:{ko:'과정 29~35 · 주 1회 기준 33주 · 실험실 2',en:'Courses 29–35 · 33 weeks · 2 labs',zh:'课程29~35 · 约33周 · 2个实验室'}
  },
  {
    key:'high', icon:'∫', accent:'#0E2C57', status:'partial',
    name:{ko:'고등 — 새 기호는 아는 마법의 새 이름표',en:'High School — a new symbol is a new label on a magic you know',zh:'高中——新符号只是熟悉魔法的新标签'},
    band:{ko:'공통수학1·2 · 대수 · 미적분Ⅰ',en:'Common Math 1·2 · Algebra · Calculus I',zh:'共同数学1·2 · 代数 · 微积分Ⅰ'},
    chapters:['W11-1','W11-2','W12-1','W12-2','W13-1','W13-2','W13-3','W13-4','W13-5','W14-1','W14-2','W14-3','W14-4','LAB-WHYCALC','LAB-CALC1'],
    tiers:['highmath1','highmath2','algebra','calculus1'], courses:{from:36,to:45}, weeks:49,
    learn:{
      ko:'다항식과 나머지정리, 이차방정식, 점과 직선·원, 지수와 로그, 삼각함수, 수열과 Σ, 극한과 미분, 접선과 적분.',
      en:'Polynomials and the remainder theorem, quadratic equations, points, lines and circles, exponents and logarithms, trigonometric functions, sequences and Σ, limits and differentiation, tangents and integration.',
      zh:'多项式与余数定理、二次方程、点与直线与圆、指数与对数、三角函数、数列与Σ、极限与微分、切线与积分。'},
    how:{
      ko:'새 기호는 이미 아는 마법에 붙는 새 이름표입니다. Σ는 초등에서 하던 짝지어 더하기가 기호 옷을 입은 것이고, log는 지수 사다리를 거꾸로 읽는 것입니다. 미적분은 기법보다 왜 태어났는지를 실험실에서 먼저 보고 들어갑니다.',
      en:'A new symbol is a new label on a magic already known. Σ is the pairing-and-adding of elementary school in symbolic clothing; log reads the ladder of exponents backwards. Calculus begins in the lab with why it was born, before any technique.',
      zh:'新符号只是熟悉魔法的新标签。Σ是小学的首尾配对相加穿上了符号的外衣；log是把指数的梯子倒过来读。微积分先在实验室看它为什么诞生，再谈技巧。'},
    example:'1 + 2 + … + 100 = 5050 → Σk = n(n+1)/2 → ∫',
    symbols:[
      {sym:'f(x)', tr:{ko:'x를 넣으면 결과가 나오는 기계',en:'a machine: put x in, a result comes out',zh:'放进x就出结果的机器'}},
      {sym:'Σ', tr:{ko:'쭉 더해라',en:'add them all up',zh:'一路加下去'}},
      {sym:'∫', tr:{ko:'잘게 쪼개 다 더해라',en:'cut it fine and add it all up',zh:'切细了全部加起来'}}],
    meta:{ko:'과정 36~45 · 주 1회 기준 49주 · 실험실 2',en:'Courses 36–45 · 49 weeks · 2 labs',zh:'课程36~45 · 约49周 · 2个实验室'}
  }
];

/* ── 조회 헬퍼 ── 모두 단계 객체 또는 null 을 돌려준다. */
window.NM_STAGE_OF_CHAPTER = function(id){
  for(var i=0;i<window.NM_STAGES.length;i++){
    if(window.NM_STAGES[i].chapters.indexOf(id) >= 0) return window.NM_STAGES[i];
  }
  return null;
};
/* 과정 번호(1~45) 또는 'C20' 같은 키. */
window.NM_STAGE_OF_COURSE = function(n){
  var num = (typeof n === 'string') ? parseInt(String(n).replace(/^C/i,''),10) : n;
  if(!(num >= 1)) return null;
  for(var i=0;i<window.NM_STAGES.length;i++){
    var c = window.NM_STAGES[i].courses;
    if(c && num >= c.from && num <= c.to) return window.NM_STAGES[i];
  }
  return null;
};
/* courses.js 의 tier 문자열(level1·middle2·calculus1 …). */
window.NM_STAGE_OF_TIER = function(tier){
  for(var i=0;i<window.NM_STAGES.length;i++){
    if(window.NM_STAGES[i].tiers.indexOf(tier) >= 0) return window.NM_STAGES[i];
  }
  return null;
};

if(typeof module !== 'undefined' && module.exports) module.exports = window.NM_STAGES;
})();
