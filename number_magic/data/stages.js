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
    tiers:['level0'], courses:{from:0,to:0}, weeks:19,
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
    meta:{ko:'과정 0 · 주 2회 기준 10주(주 1회 19주) · 유닛 15',en:'Course 0 · 10 weeks at two sheets a week (19 at one) · 15 units',zh:'课程0 · 每周2次约10周(每周1次19周) · 15个单元'}
  },
  {
    key:'sprout', icon:'🌱', accent:'#16417C', status:'live',
    name:{ko:'계산의 새싹',en:'Sprout',zh:'计算的新芽'},
    band:{ko:'6~7세 · 초등 1학년',en:'Ages 6–7 · Grade 1',zh:'6~7岁 · 小学一年级'},
    chapters:['R0','R1','G0','G1','R2','R3','R4','T4','R5','R6','R7','R8'],
    tiers:['level1'], courses:{from:1,to:10}, weeks:75,
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
    meta:{ko:'과정 1~10 · 주 2회 기준 39주(주 1회 75주)',en:'Courses 1–10 · 39 weeks at two sheets a week (75 at one)',zh:'课程1~10 · 每周2次约39周(每周1次75周)'}
  },
  {
    key:'leap', icon:'🚀', accent:'#16417C', status:'live',
    name:{ko:'계산의 도약',en:'Leap',zh:'计算的跃进'},
    band:{ko:'초등 1학년 말 ~ 2학년',en:'End of Grade 1 – Grade 2',zh:'小学一年级末~二年级'},
    chapters:['T8','R9','T9','R10','R11','R12','R13','R14'],
    tiers:['level2'], courses:{from:11,to:16}, weeks:31,
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
    meta:{ko:'과정 11~16 · 주 2회 기준 16주(주 1회 31주)',en:'Courses 11–16 · 16 weeks at two sheets a week (31 at one)',zh:'课程11~16 · 每周2次约16周(每周1次31周)'}
  },
  {
    key:'mastery', icon:'👑', accent:'#0E2C57', status:'live',
    name:{ko:'계산의 정복',en:'Mastery',zh:'计算的征服'},
    band:{ko:'초등 2학년 말 ~ 3학년',en:'End of Grade 2 – Grade 3',zh:'小学二年级末~三年级'},
    chapters:['T14','R15','T15','R16','CR8','R17'],
    tiers:['level3'], courses:{from:17,to:25}, weeks:53,
    learn:{
      ko:'소수 덧뺄과 곱셈, 제곱수, 약수와 배수·소인수분해, 분모가 다른 분수, 분수 곱셈과 나눗셈, 수열, 백분율과 비율.',
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
    meta:{ko:'과정 17~25 · 주 2회 기준 29주(주 1회 53주) · 학교로는 초5~6 내용',en:'Courses 17–25 · 29 weeks at two sheets a week (53 at one) · the end of the arithmetic track',zh:'课程17~25 · 每周2次约29周(每周1次53周) · 运算段的终点'}
  },
  {
    key:'tower', icon:'🗼', accent:'#C9A063', status:'live',
    name:{ko:'경시의 탑',en:'The Tower',zh:'竞赛之塔'},
    band:{ko:'초등 심화 · 중등 준비',en:'Elementary deep-dive · bridge to middle school',zh:'小学进阶 · 初中衔接'},
    chapters:['CR9','CR10','CR11','CRB'],
    tiers:['challenge'], courses:{from:26,to:28}, weeks:32,
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
    meta:{ko:'과정 26~28 · 주 2회 기준 16주(주 1회 32주)',en:'Courses 26–28 · 16 weeks at two sheets a week (32 at one)',zh:'课程26~28 · 每周2次约16周(每周1次32周)'}
  },
  {
    key:'middle', icon:'🔤', accent:'#0E2C57', status:'live',
    name:{ko:'중학교 — 기호가 바뀌는 자리',en:'Middle School — where the symbols change',zh:'初中——符号改变的地方'},
    band:{ko:'중학교 1~3학년',en:'Grades 7–9',zh:'初中一~三年级'},
    chapters:['W8-1','W8-2','W8-3','W8-4','W8-5','W8-6','W8-7','W8-8','W9-1','W9-2','W9-3','W9-4','W9-5','W10-1','LAB-NUMLINE','W10-2','W10-3','W10-4','W10-5','W10-6','W10-7'],
    tiers:['middle1','middle2','middle3'], courses:{from:29,to:37}, weeks:92,
    learn:{
      ko:'정수와 유리수, 부호의 규칙, 문자와 식, 방정식과 비례, 지수와 단항식, 다항식, 연립방정식과 일차부등식, 일차함수, 경우의 수, 제곱근, 인수분해와 이차방정식, 이차함수, 산포도, 사분위수·상자그림, 산점도·상관관계.',
      en:'Integers and rationals, signs, algebraic expressions, equations and proportion, exponents and polynomials, systems and inequalities, functions, counting, roots, factorisation and quadratics, dispersion, quartiles and box plots, and scatter plots and correlation.',
      zh:'整数与有理数、符号法则、代数式、方程与比例、指数与多项式、方程组与不等式、函数、情况数、平方根、因式分解与二次函数、离散程度、四分位数与箱形图、散点图与相关关系。'},
    how:{
      ko:'기호가 바뀌는 순간이 진짜 고비라, 순서를 말 → 그림 → 내 표기 → 표준 기호로 고정합니다. 음수는 해발과 해저로, √는 땅 위의 9와 뿌리의 3 그림으로 먼저 만납니다. 초등에서 수로 하던 쪼개기가 여기서 문자로 옮겨 갑니다.',
      en:'The real hurdle is the moment the symbols change, so the order is fixed: words → picture → my own notation → the standard symbol. Negatives arrive as altitude and depth, √ as the 9 above ground and the 3 in the root. The splitting done with numbers now moves into letters.',
      zh:'真正的坎是符号改变的瞬间，所以顺序固定为：话 → 图 → 自己的写法 → 标准符号。负数先以海拔和海底出现，√先看作地上的9和根部的3。小学用数做的拆分，在这里搬到字母上。'},
    example:'47 × 6 = 40 × 6 + 7 × 6 → (a + b)c = ac + bc → (a + b)² = a² + 2ab + b²',
    symbols:[
      {sym:'−', tr:{ko:'0을 기준으로 반대 방향',en:'the opposite direction from zero',zh:'以0为界的相反方向'}},
      {sym:'x', tr:{ko:'아직 모르는 수의 자리 — 초1의 □가 자란 것',en:'the seat of the unknown — the □ of Grade 1, grown up',zh:'未知数的位置——小一的□长大了'}},
      {sym:'√', tr:{ko:'제곱하기 전의 나',en:'me, before I was squared',zh:'平方之前的我'}}],
    meta:{ko:'과정 29~37 · 주 2회 기준 48주(주 1회 92주) · 실험실 2',en:'Courses 29–37 · 48 weeks at two sheets a week (92 at one) · 2 labs',zh:'课程29~37 · 每周2次约48周(每周1次92周) · 2个实验室'}
  },
  /* 고등(2026-09-29) — 원장 "공통수학1, 공통수학2도 있어야지 / 대수 / 미적분1".
     한 칸에 네 과목을 묶어 두었던 'high' 단계를 과목마다 한 단계로 나눈다(로드맵 10단계).
     이름·설명은 data/curriculum.js 의 같은 tier 부제·desc 에서 가져왔다 — 새 구호를 짓지 않는다. */
  {
    key:'common1', icon:'🧱', accent:'#0f2e4f', status:'partial',
    name:{ko:'공통수학1 — 다항식의 탑',en:'Common Math 1 — Tower of Polynomials',zh:'共同数学1——多项式之塔'},
    band:{ko:'고등 · 공통수학1',en:'High school · Common Math 1',zh:'高中 · 共同数学1'},
    chapters:['W11-1','W11-2'],
    tiers:['highmath1'], courses:{from:38,to:48}, weeks:76,
    learn:{
      ko:'다항식의 연산과 나머지정리, 곱셈공식의 확장과 항등식, 인수분해, 이차방정식의 판별식과 근과 계수의 관계, 이차부등식, 행렬.',
      en:'Operations on polynomials and the remainder theorem, extended product formulas and identities, factorisation, the discriminant and the relation between roots and coefficients, quadratic inequalities, matrices.',
      zh:'多项式运算与余数定理、乘法公式的扩展与恒等式、因式分解、二次方程的判别式与根与系数的关系、二次不等式、矩阵。'},
    how:{
      ko:'새 기호는 이미 아는 마법에 붙는 새 이름표입니다. 괄호 두 개를 곱하는 것부터 판별식·근의 공식·행렬까지, 다항식을 다루는 손이 한 단계 더 정교해집니다. 중학교에서 문자로 옮겨 온 쪼개기가 여기서 나머지정리가 됩니다.',
      en:'A new symbol is a new label on a magic already known. From multiplying two brackets to the discriminant, the quadratic formula and matrices, handling polynomials gets a level more precise. The splitting carried into letters in middle school becomes the remainder theorem here.',
      zh:'新符号只是熟悉魔法的新标签。从两括号相乘到判别式、求根公式、矩阵，处理多项式的手法更进一层。初中搬到字母上的拆分，在这里成为余数定理。'},
    example:'f(x) = (x − 1)Q(x) + R → R = f(1)',
    symbols:[
      {sym:'f(x)', tr:{ko:'x를 넣으면 결과가 나오는 기계',en:'a machine: put x in, a result comes out',zh:'放进x就出结果的机器'}}],
    meta:{ko:'과정 38~48 · 주 2회 기준 40주(주 1회 76주)',en:'Courses 38–48 · 40 weeks at two sheets a week (76 at one)',zh:'课程38~48 · 每周2次约40周(每周1次76周)'}
  },
  {
    key:'common2', icon:'📍', accent:'#1b6e5b', status:'partial',
    name:{ko:'공통수학2 — 도형의 방정식 나라',en:'Common Math 2 — Land of Coordinate Geometry',zh:'共同数学2——图形方程之国'},
    band:{ko:'고등 · 공통수학2',en:'High school · Common Math 2',zh:'高中 · 共同数学2'},
    chapters:['W12-1','W12-2'],
    tiers:['highmath2'], courses:{from:49,to:57}, weeks:67,
    learn:{
      ko:'두 점 사이의 거리, 중점과 내분점, 직선의 방정식, 두 직선의 평행·수직 조건, 원의 방정식.',
      en:'The distance between two points, midpoints and internal division, equations of lines, conditions for parallel and perpendicular lines, equations of circles.',
      zh:'两点间的距离、中点与内分点、直线的方程、两直线平行·垂直的条件、圆的方程。'},
    how:{
      ko:'좌표평면 위의 도형을 식으로 붙잡습니다. 두 점 사이의 거리부터 직선·원의 방정식까지, 그림으로 보던 도형이 식이 되고 식이 다시 그림이 됩니다.',
      en:'Shapes on the coordinate plane are pinned down with equations. From the distance between two points to lines and circles, a shape seen as a picture becomes an equation, and the equation becomes a picture again.',
      zh:'用方程把坐标平面上的图形定住。从两点间的距离到直线、圆的方程，看作图的图形变成方程，方程又变回图。'},
    example:'(0, 0) ↔ (3, 4) → √(3² + 4²) → 5',
    symbols:[
      {sym:'(x, y)', tr:{ko:'좌표평면 위의 한 점 — 가로 x, 세로 y',en:'one point on the coordinate plane — across x, up y',zh:'坐标平面上的一个点——横x，竖y'}}],
    meta:{ko:'과정 49~57 · 주 2회 기준 36주(주 1회 67주)',en:'Courses 49–57 · 36 weeks at two sheets a week (67 at one)',zh:'课程49~57 · 每周2次约36周(每周1次67周)'}
  },
  {
    key:'algebra', icon:'Σ', accent:'#5b3a8f', status:'partial',
    name:{ko:'대수 — 기호의 탑',en:'Algebra — Tower of Symbols',zh:'代数——符号之塔'},
    band:{ko:'고등 · 대수',en:'High school · Algebra',zh:'高中 · 代数'},
    chapters:['W13-1','W13-2','W13-3','W13-4','W13-5'],
    tiers:['algebra'], courses:{from:58,to:69}, weeks:92,
    learn:{
      ko:'지수와 로그·상용로그, 지수함수와 로그함수, 지수·로그 방정식과 부등식, 호도법과 삼각함수·그래프·삼각방정식, 사인·코사인법칙과 넓이, 등차·등비수열과 원리합계, Σ와 여러 가지 수열의 합, 귀납적 정의와 수학적 귀납법.',
      en:'Exponents, logarithms and common logarithms, exponential and log functions, exponential and log equations and inequalities, radians, trigonometric functions, their graphs and equations, the sine and cosine laws and area, arithmetic and geometric sequences with compound savings, Σ and sums of various sequences, and recursive definitions with mathematical induction.',
      zh:'指数与对数·常用对数、指数函数与对数函数、指数·对数方程与不等式、弧度制与三角函数·图像·三角方程、正弦·余弦定理与面积、等差·等比数列与本利和、Σ与各种数列的和、递推定义与数学归纳法。'},
    how:{
      ko:'새 기호를 하나씩 만납니다. Σ는 초등에서 하던 짝지어 더하기가 기호 옷을 입은 것이고, log는 지수 사다리를 거꾸로 읽는 것입니다.',
      en:'New symbols are met one at a time. Σ is the pairing-and-adding of elementary school in symbolic clothing; log reads the ladder of exponents backwards.',
      zh:'一个个认识新符号。Σ是小学的首尾配对相加穿上了符号的外衣；log是把指数的梯子倒过来读。'},
    example:'1 + 2 + … + 100 = 5050 → Σk = n(n+1)/2',
    symbols:[
      {sym:'log', tr:{ko:'지수 사다리를 거꾸로 읽어라',en:'read the ladder of exponents backwards',zh:'把指数的梯子倒过来读'}},
      {sym:'Σ', tr:{ko:'쭉 더해라',en:'add them all up',zh:'一路加下去'}}],
    meta:{ko:'과정 58~69 · 주 2회 기준 48주(주 1회 92주)',en:'Courses 58–69 · 48 weeks at two sheets a week (92 at one)',zh:'课程58~69 · 每周2次约48周(每周1次92周)'}
  },
  {
    key:'calculus1', icon:'∫', accent:'#0d3b66', status:'partial',
    name:{ko:'미적분Ⅰ — 변화의 정상',en:'Calculus I — Summit of Change',zh:'微积分Ⅰ——变化之巅'},
    band:{ko:'고등 · 미적분Ⅰ',en:'High school · Calculus I',zh:'高中 · 微积分Ⅰ'},
    chapters:['W14-1','W14-2','W14-3','W14-4','LAB-WHYCALC','LAB-CALC1'],
    tiers:['calculus1'], courses:{from:70,to:73}, weeks:20,
    learn:{
      ko:'함수의 극한과 연속, 미분계수와 도함수·미분법 공식, 접선·평균값 정리·증가와 감소·극값·최대와 최소·방정식과 부등식에의 활용, 다항함수의 적분·정적분의 성질, 넓이와 속도·거리.',
      en:'Limits and continuity, the derivative at a point, the derived function and the rules of differentiation, tangents, the mean value theorem, increase and decrease, extrema, maximum and minimum, applications to equations and inequalities, integrating polynomials and properties of definite integrals, area and speed and distance.',
      zh:'函数的极限与连续、微分系数与导函数·求导公式、切线·中值定理·增减·极值·最值·在方程与不等式中的应用、多项式函数的积分·定积分的性质、面积与速度·距离。'},
    how:{
      ko:'미적분은 기법보다 왜 태어났는지를 실험실에서 먼저 보고 들어갑니다. x가 다가가는 값에서 순간의 기울기, 잘게 쪼개 다 더하기까지 — 로드맵의 마지막 봉우리입니다.',
      en:'Calculus begins in the lab with why it was born, before any technique. From the value x approaches to the instantaneous slope and adding up infinitely thin pieces — the final peak of the roadmap.',
      zh:'微积分先在实验室看它为什么诞生，再谈技巧。从x趋近的值到瞬时斜率，再到把细小碎片全部加起来——路线图的最后一座山峰。'},
    example:'f(x) = x² → f′(x) = 2x → ∫2x dx = x² + C',
    symbols:[
      {sym:'lim', tr:{ko:'x가 다가가는 값',en:'the value x approaches',zh:'x趋近的值'}},
      {sym:'f′', tr:{ko:'순간의 기울기',en:'the instantaneous slope',zh:'瞬时斜率'}},
      {sym:'∫', tr:{ko:'잘게 쪼개 다 더해라',en:'cut it fine and add it all up',zh:'切细了全部加起来'}}],
    meta:{ko:'과정 70~73 · 주 2회 기준 11주(주 1회 20주) · 실험실 2',en:'Courses 70–73 · 11 weeks at two sheets a week (20 at one) · 2 labs',zh:'课程70~73 · 每周2次约11周(每周1次20周) · 2个实验室'}
  }
];

/* ── 조회 헬퍼 ── 모두 단계 객체 또는 null 을 돌려준다. */
window.NM_STAGE_OF_CHAPTER = function(id){
  for(var i=0;i<window.NM_STAGES.length;i++){
    if(window.NM_STAGES[i].chapters.indexOf(id) >= 0) return window.NM_STAGES[i];
  }
  return null;
};
/* 과정 번호(0~47) 또는 'C20' 같은 키. */
window.NM_STAGE_OF_COURSE = function(n){
  var num = (typeof n === 'string') ? parseInt(String(n).replace(/^C/i,''),10) : n;
  if(!(num >= 0)) return null;   // 과정 0(수의 나라)도 단계가 있다(2026-09-19)
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
