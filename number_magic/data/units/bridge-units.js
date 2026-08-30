/* ============================================================
   Numbers of Magic — 브리지 유닛 (T-*)
   학년별 교실(grade-course)의 갭 채우기 유닛 11종.
   기존 A/B/C 유닛 사이 건너뛰는 과정(나눗셈 도입·분수 개념·
   소수 개념·큰 수·혼합계산 등)을 스레드 생성기 재사용으로 채움.
   기존 커리큘럼 티어는 건드리지 않음 — 학년별 교실에서만 노출.
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

/* 공용 응원 보이스 */
function voice(finishKo,finishEn,finishZh){
  return {
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'훌륭해! 🌟',en:'Wonderful!',zh:'太棒了！'}, {ko:'딱 맞았어! 🎯',en:'Spot on!',zh:'完全正确！'} ],
    wrong:[ {ko:'괜찮아, 다시 생각해 봐!',en:"It's okay — think again!",zh:'没关系，再想想！'}, {ko:'힌트를 떠올려 봐 💡',en:'Remember the hint 💡',zh:'想想提示 💡'} ],
    finish:{ ko:finishKo, en:finishEn, zh:finishZh }
  };
}

/* ─────────────────────────────────────────────
   T-AD1 · 네 자리 수 덧뺄셈 (초2-2 교과 보충)
───────────────────────────────────────────── */
window.NM_UNITS['T-AD1'] = {
  id:'T-AD1', tier:'bridge', level:'T', order:101,
  generator:'ad7_add4d', edu:'2-2',
  title:{ ko:'네 자리 수 덧뺄셈', en:'4-Digit Add & Subtract', zh:'四位数加减法' },
  subtitle:{ ko:'천의 자리까지! 자리만 맞추면 똑같아요', en:'Up to thousands — line up the places and it works the same!', zh:'到千位！对齐数位就一样简单' },
  icon:'🏔️',
  practice:{ generator:'ad7_add4d', level:'practice', count:4, params:{ op:'+' },
    intro:{ ko:'수가 커져도 방법은 같아! 자리끼리 더하면 돼. 몸풀기로 덧셈부터!',
      en:'Bigger numbers, same method! Add place by place. Warm up with addition!',
      zh:'数字变大方法不变！按数位相加。先热身做加法！' } },
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 저금통 이야기',en:'1) Piggy bank story',zh:'① 存钱罐的故事'},
        head:{ko:'3450원 + 2380원은?',en:'3450 + 2380 won?',zh:'3450元 + 2380元？'},
        desc:{ko:'저금통에 <b>3450원</b>이 있는데 세뱃돈 <b>2380원</b>을 더 넣었어요. 천 원짜리는 천 원짜리끼리(3+2=5), 백 원짜리는 백 원짜리끼리(4+3=7), 십 원짜리끼리(5+8=13 → 올림!). 자리끼리 더하는 건 두 자리 수 때랑 완전히 같아요!',
          en:'Your piggy bank has <b>3450 won</b> and you add <b>2380 won</b>. Thousands with thousands (3+2=5), hundreds with hundreds (4+3=7), tens with tens (5+8=13 → carry!). Exactly the same as two-digit numbers!',
          zh:'存钱罐里有<b>3450元</b>，又放进<b>2380元</b>。千和千相加(3+2=5)，百和百相加(4+3=7)，十和十相加(5+8=13→进位！)。和两位数的方法完全一样！'},
        mathSteps:['3450 + 2380','3000+2000=5000, 400+300=700','50+80=130 → 5000+700+130','= 5830'],
        result:{ko:'5830원! 자리끼리 더하면 네 자리도 무섭지 않아요.',en:'5830 won! Place by place — four digits are no problem.',zh:'5830元！按数位相加，四位数也不可怕。'},
        book:{ko:'수가 아무리 커져도 "같은 자리끼리" 규칙은 변하지 않아요.',en:'No matter how big the number, the "same place" rule never changes.',zh:'数字再大，"同数位相加"的规则永远不变。'} },
      { tag:{ko:'② 세로셈 정렬',en:'2) Line up vertically',zh:'② 竖式对齐'},
        head:{ko:'오른쪽 끝(일의 자리)을 딱 맞춰요',en:'Align the right edge (ones place)!',zh:'把右端(个位)对齐！'},
        desc:{ko:'세로셈의 비밀은 <b>오른쪽 끝 맞추기</b>. 일의 자리끼리, 십의 자리끼리 같은 줄에 서게 한 다음 아래부터 차례로 더해요. 올림이 생기면 윗자리에 작게 1을 적어두고 같이 더해요.',
          en:'The secret of vertical form: <b>align the right edge</b>. Ones above ones, tens above tens — then add from the bottom digit up. Write a little 1 for carries.',
          zh:'竖式的秘诀是<b>右端对齐</b>。个位对个位、十位对十位，然后从低位往高位加。有进位就在上一位记个小1。'},
        mathSteps:['  3450','+ 2380','──────','  5830'],
        result:{ko:'자리를 맞추면 눈이 계산을 도와줘요!',en:'Aligned places let your eyes do the math!',zh:'对齐数位，眼睛也来帮你计算！'},
        book:null },
      { tag:{ko:'③ 뺄셈도 똑같이',en:'3) Subtraction too',zh:'③ 减法也一样'},
        head:{ko:'5830 − 2380 = 3450 (되돌리기!)',en:'5830 − 2380 = 3450 (undo!)',zh:'5830 − 2380 = 3450（还原！）'},
        desc:{ko:'뺄셈도 같은 자리끼리! 받아내림이 생기면 윗자리에서 10을 빌려와요. 그리고 뺄셈은 덧셈의 <b>되돌리기</b>라서, 답에 뺀 수를 다시 더해보면 검산이 돼요. 5830−2380=3450, 확인: 3450+2380=5830 ✓',
          en:'Subtract place by place too! Borrow 10 from the next place when needed. Subtraction <b>undoes</b> addition — check your answer by adding back: 5830−2380=3450, and 3450+2380=5830 ✓',
          zh:'减法也按数位来！不够减就向上一位借10。减法是加法的<b>还原</b>——用加法验算：5830−2380=3450，检查 3450+2380=5830 ✓'},
        mathSteps:['5830 - 2380','= 3450',{ko:'검산: 3450 + 2380 = 5830 ✓',en:'\\text{check: } 3450 + 2380 = 5830 ✓',zh:'验算：3450 + 2380 = 5830 ✓'}],
        result:{ko:'더해서 검산하는 습관 — 마법사의 기본기예요!',en:'Checking by adding back — a wizard\'s basic skill!',zh:'用加法验算——魔法师的基本功！'},
        book:null }
    ],
    rule:{ ko:'① 오른쪽 끝(일의 자리)을 맞춘다 ② 같은 자리끼리 더하고 뺀다 ③ 올림·내림은 작게 메모 ④ 뺄셈은 덧셈으로 검산',
      en:'① Align the ones place ② Add/subtract same places ③ Note carries/borrows ④ Check subtraction by adding back',
      zh:'① 对齐个位 ② 同数位相加减 ③ 进退位做小记号 ④ 减法用加法验算' }
  },
  check:{
    fills:[
      { tex:'2300 + 1500 = \\square', answer:3800,
        hint:{ ko:'천끼리 2+1, 백끼리 3+5', en:'Thousands 2+1, hundreds 3+5', zh:'千位2+1，百位3+5' } },
      { tex:'5600 - 2400 = \\square', answer:3200,
        hint:{ ko:'천끼리 5-2, 백끼리 6-4', en:'Thousands 5−2, hundreds 6−4', zh:'千位5-2，百位6-4' } }
    ],
    open:{ ko:'네 자리 수 덧셈이 두 자리 수 덧셈과 "같은 점"을 한 가지 써 봐요.',
      en:'Write one way 4-digit addition is the SAME as 2-digit addition.',
      zh:'写出四位数加法和两位数加法的一个"相同点"。' },
    openHint:{ ko:'예) 둘 다 같은 자리끼리 더해요. 올림 규칙도 똑같아요. 자리 수만 늘었을 뿐!',
      en:'e.g. Both add same places together; the carry rule is identical — only the number of places grew!',
      zh:'例）都是同数位相加，进位规则也一样，只是位数变多了！' }
  },
  lab:{ generator:'ad7_add4d', level:'main', count:4, params:{ op:'±' },
    intro:{ ko:'이제 덧셈·뺄셈 섞어서! 자리 맞추기를 기억해.', en:'Now mixed + and −! Remember to align places.', zh:'现在加减混合！记住对齐数位。' } },
  arena:{ generator:'ad7_add4d', level:'main', count:8, timeLimit:300, params:{ op:'±' },
    rule:{ ko:'5분 안에 네 자리 덧뺄셈을 모두 풀어요!', en:'Solve all 4-digit problems in 5 minutes!', zh:'5分钟内解答所有四位数题！' } },
  stamp:{ label:{ ko:'천 자리 등반가', en:'Thousands Climber', zh:'千位登山家' }, coins:26 },
  voice: voice('완벽해! 천 자리 등반가! 🏔️','Perfect! Thousands Climber!','完美！千位登山家！')
};

/* ─────────────────────────────────────────────
   T-NS1 · 큰 수 읽기 — 만의 자리 (초4-1 교과)
───────────────────────────────────────────── */
window.NM_UNITS['T-NS1'] = {
  id:'T-NS1', tier:'bridge', level:'T', order:102,
  generator:'ns1_placeValue', edu:'4-1',
  title:{ ko:'큰 수의 세계 — 만', en:'Big Numbers — Ten Thousands', zh:'大数的世界——万' },
  subtitle:{ ko:'천이 10개 모이면 만! 자리 이름으로 큰 수를 읽어요', en:'Ten thousands = 10 thousands! Read big numbers by place names', zh:'10个千是一万！用数位名称读大数' },
  icon:'🔭',
  practice:{ generator:'ns1_placeValue', level:'practice', count:4, params:{ max:9999 },
    intro:{ ko:'자리 이름 복습부터! 일·십·백·천. 각 자리의 숫자를 찾아봐.',
      en:'First review place names: ones, tens, hundreds, thousands. Find the digit at each place!',
      zh:'先复习数位名称：个·十·百·千。找出每个数位上的数字！' } },
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 조회수 이야기',en:'1) View-count story',zh:'① 播放量的故事'},
        head:{ko:'조회수 47382회 — 몇만이지?',en:'47,382 views — how many ten-thousands?',zh:'播放量47382次——是几万？'},
        desc:{ko:'누미의 마법 영상 조회수가 <b>47382</b>회가 됐어요! 이 수를 읽으려면 자리 이름이 필요해요. 오른쪽부터 일·십·백·천, 그리고 새 친구 <b>만</b>! 4가 만의 자리에 있으니 "사만 칠천삼백팔십이"라고 읽어요.',
          en:"Numi's magic video hit <b>47,382</b> views! To read it we need place names: ones, tens, hundreds, thousands — and a new friend, <b>ten-thousands</b>! The 4 sits in the ten-thousands place: forty-seven thousand three hundred eighty-two.",
          zh:'努米的魔法视频播放量达到<b>47382</b>次！要读它需要数位名称：从右往左是个·十·百·千，还有新朋友<b>万</b>！4在万位上，读作"四万七千三百八十二"。'},
        mathSteps:['47382','4🔟000 7000 300 80 2',{ko:'= 4만 7천 3백 8십 2',en:'= \\text{4 ten-thousands 7 thousands 3 hundreds 8 tens 2}',zh:'= 4万7千3百8十2'}],
        result:{ko:'자리 이름만 알면 아무리 큰 수도 읽을 수 있어요!',en:'Know the place names and you can read any number!',zh:'知道数位名称，多大的数都能读！'},
        book:{ko:'천이 10개 = 만(10000). 万은 0이 4개예요.',en:'10 thousands = 1 ten-thousand (10000) — four zeros.',zh:'10个千=1万(10000)——有4个0。'} },
      { tag:{ko:'② 자리의 값',en:'2) Value of a place',zh:'② 数位的值'},
        head:{ko:'같은 4라도 자리가 다르면 값이 달라요',en:'The same 4 has different values in different places',zh:'同样是4，数位不同值就不同'},
        desc:{ko:'44444에서 다섯 개의 4는 전부 값이 달라요! 맨 왼쪽 4는 <b>40000</b>, 그 다음은 4000, 400, 40, 4. 왼쪽으로 한 칸 갈 때마다 <b>10배</b>씩 커져요. 이게 자릿값의 마법!',
          en:'In 44444 the five 4s all have different values! The leftmost is <b>40000</b>, then 4000, 400, 40, 4. Each step left multiplies by <b>10</b>. That is the magic of place value!',
          zh:'44444里五个4的值都不同！最左边是<b>40000</b>，然后是4000、400、40、4。每往左一位就<b>×10</b>。这就是数位的魔法！'},
        mathSteps:['44444','= 40000+4000+400+40+4',{ko:'왼쪽 한 칸 = ×10',en:'\\text{one place left} = ×10',zh:'左移一位 = ×10'}],
        result:{ko:'자리가 수의 크기를 정해요!',en:'The place decides the size!',zh:'数位决定大小！'},
        book:null },
      { tag:{ko:'③ 뛰어세기',en:'3) Skip counting',zh:'③ 跳数'},
        head:{ko:'10000씩 뛰면 만의 자리만 변해요',en:'Jump by 10000 — only the ten-thousands digit moves',zh:'一万一万地跳——只有万位在变'},
        desc:{ko:'23000에서 10000씩 뛰어세면 33000, 43000, 53000… <b>만의 자리 숫자만 1씩</b> 커지고 나머지는 그대로! 1000씩 뛰면 천의 자리만 변하죠. 어느 자리에서 뛰는지만 보면 돼요.',
          en:'From 23000, jumping by 10000: 33000, 43000, 53000… only the <b>ten-thousands digit grows by 1</b>; the rest stays! Jump by 1000 and only the thousands digit moves.',
          zh:'从23000开始一万一万地跳：33000、43000、53000……只有<b>万位数字加1</b>，其他不变！按1000跳就只有千位在变。'},
        mathSteps:['23000 → 33000 → 43000',{ko:'만의 자리: 2→3→4',en:'\\text{ten-thousands digit: } 2→3→4',zh:'万位：2→3→4'},{ko:'나머지 자리는 그대로!',en:'\\text{the other digits stay!}',zh:'其他数位不变！'}],
        result:{ko:'뛰어세기는 자릿값을 눈으로 확인하는 놀이예요!',en:'Skip counting shows place value in action!',zh:'跳数就是用眼睛验证数位的游戏！'},
        book:null }
    ],
    rule:{ ko:'① 오른쪽부터 일·십·백·천·만 ② 왼쪽 한 칸 = ×10 ③ 뛰어세기는 그 자리 숫자만 변한다',
      en:'① From the right: ones, tens, hundreds, thousands, ten-thousands ② One step left = ×10 ③ Skip counting moves only that place',
      zh:'① 从右起：个·十·百·千·万 ② 左移一位=×10 ③ 跳数只改变对应数位' }
  },
  check:{
    fills:[
      { tex:{ko:'23456 \\;\\rightarrow\\; \\text{천의 자리} = \\square',en:'23456 \\;\\rightarrow\\; \\text{thousands digit} = \\square',zh:'23456 \\;\\rightarrow\\; \\text{千位} = \\square'}, answer:3,
        hint:{ ko:'오른쪽에서 네 번째 자리', en:'4th digit from the right', zh:'从右数第四位' } },
      { tex:{ko:'23456 \\;\\rightarrow\\; \\text{만의 자리} = \\square',en:'23456 \\;\\rightarrow\\; \\text{ten-thousands digit} = \\square',zh:'23456 \\;\\rightarrow\\; \\text{万位} = \\square'}, answer:2,
        hint:{ ko:'맨 왼쪽, 다섯 번째 자리', en:'Leftmost — 5th place', zh:'最左边第五位' } }
    ],
    open:{ ko:'50000이 왜 5×10000인지 자리 이름으로 설명해 봐요.',
      en:'Using place names, explain why 50000 equals 5×10000.',
      zh:'用数位名称解释为什么50000等于5×10000。' },
    openHint:{ ko:'예) 5가 만의 자리에 있으니 만(10000)이 5개라는 뜻 → 5×10000=50000.',
      en:'e.g. The 5 sits in the ten-thousands place, meaning five 10000s → 5×10000=50000.',
      zh:'例）5在万位上，表示有5个10000 → 5×10000=50000。' }
  },
  lab:{ generator:'ns1_placeValue', level:'main', count:4, params:{ max:99999 },
    intro:{ ko:'이제 만의 자리까지 다섯 자리! 자리 이름을 크게 말하면서 찾아봐.',
      en:'Now five digits up to ten-thousands! Say the place names out loud.',
      zh:'现在到万位共五位数！大声说出数位名称来找。' } },
  arena:{ generator:'ns1_placeValue', level:'main', count:8, timeLimit:240, params:{ max:99999 },
    rule:{ ko:'4분 안에 자릿값 문제를 모두 풀어요!', en:'Solve all place-value problems in 4 minutes!', zh:'4分钟内解答所有数位题！' } },
  stamp:{ label:{ ko:'만 자리 탐험가', en:'Ten-Thousands Explorer', zh:'万位探险家' }, coins:26 },
  voice: voice('완벽해! 만 자리 탐험가! 🔭','Perfect! Ten-Thousands Explorer!','完美！万位探险家！')
};

/* ─────────────────────────────────────────────
   T-DV1 · 나눗셈 첫걸음 (초3-1 교과)
───────────────────────────────────────────── */
window.NM_UNITS['T-DV1'] = {
  id:'T-DV1', tier:'bridge', level:'T', order:103,
  generator:'dv2_div2d1d', edu:'3-1',
  title:{ ko:'나눗셈 첫걸음', en:'First Steps in Division', zh:'除法第一步' },
  subtitle:{ ko:'똑같이 나누기 = 구구단 거꾸로!', en:'Sharing equally = times tables in reverse!', zh:'平均分＝乘法口诀倒着用！' },
  icon:'🍪',
  practice:{ generator:'dv2_div2d1d', level:'practice', count:5, params:{},
    intro:{ ko:'쿠키를 친구들과 똑같이 나눠보자! 구구단을 거꾸로 떠올리면 돼.',
      en:"Let's share cookies equally! Just think of the times tables backwards.",
      zh:'和朋友们平均分饼干吧！把乘法口诀倒过来想就行。' } },
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 쿠키 나누기',en:'1) Sharing cookies',zh:'① 分饼干'},
        head:{ko:'쿠키 12개를 3명이 똑같이 나누면?',en:'12 cookies shared by 3 friends?',zh:'12块饼干3个人平均分？'},
        desc:{ko:'쿠키 <b>12개</b>를 친구 <b>3명</b>이 똑같이 나눠 먹으려 해요. 한 개씩 돌아가며 나눠주면… 한 명당 <b>4개</b>씩! 이렇게 "똑같이 나누기"를 기호로 <b>12÷3=4</b>라고 써요. ÷는 나눗셈 기호예요.',
          en:'<b>12 cookies</b> shared equally among <b>3 friends</b>. Deal them out one by one… each friend gets <b>4</b>! We write this "equal sharing" as <b>12÷3=4</b>. The ÷ symbol means division.',
          zh:'<b>12块饼干</b>要让<b>3个朋友</b>平均分。一块一块轮流发……每人<b>4块</b>！这种"平均分"用符号写作<b>12÷3=4</b>。÷就是除号。'},
        mathSteps:[{ko:'🍪12개 ÷ 3명',en:'🍪 \\text{12 cookies} ÷ \\text{3 kids}',zh:'🍪12块 ÷ 3人'},{ko:'한 명당 4개씩',en:'\\text{4 for each}',zh:'每人4块'},'12 ÷ 3 = 4'],
        result:{ko:'나눗셈은 "똑같이 나누면 하나에 몇 개?"를 묻는 거예요!',en:'Division asks: share equally, how many each?',zh:'除法问的是：平均分后每份几个？'},
        book:{ko:'나눗셈의 두 얼굴: ①한 명당 몇 개? ②몇 명에게 줄 수 있나? 둘 다 ÷로 써요.',en:'Division has two faces: ① how many each? ② how many groups? Both use ÷.',zh:'除法有两张脸：①每份几个？②能分几组？都用÷表示。'} },
      { tag:{ko:'② 구구단 거꾸로',en:'2) Times tables backwards',zh:'② 口诀倒着用'},
        head:{ko:'12÷3은 "3×□=12"의 □!',en:'12÷3 is the □ in "3×□=12"!',zh:'12÷3就是"3×□=12"里的□！'},
        desc:{ko:'12÷3을 빨리 푸는 비밀은 <b>구구단 거꾸로</b>! "3에 무엇을 곱하면 12가 되지?" → 3×<b>4</b>=12니까 답은 4. 구구단을 잘 외웠다면 나눗셈은 이미 절반은 아는 거예요!',
          en:'The secret to fast division: <b>times tables backwards</b>! "3 times what makes 12?" → 3×<b>4</b>=12, so the answer is 4. If you know your tables, you already half-know division!',
          zh:'快速除法的秘诀：<b>口诀倒着用</b>！"3乘几等于12？"→3×<b>4</b>=12，所以答案是4。口诀背得熟，除法就已经会一半了！'},
        mathSteps:['12 \\div 3 = \\square','3 \\times \\square = 12','3 \\times 4 = 12 \\Rightarrow 4'],
        result:{ko:'나눗셈 = 곱셈 구멍 채우기!',en:'Division = filling the multiplication blank!',zh:'除法＝填乘法的空！'},
        book:null },
      { tag:{ko:'③ 묶어 세기',en:'3) Grouping',zh:'③ 分组数'},
        head:{ko:'12÷3 = "3씩 묶으면 몇 묶음?"도 돼요',en:'12÷3 also asks "how many groups of 3?"',zh:'12÷3也可以问"3个一组能分几组？"'},
        desc:{ko:'12개를 <b>3개씩 묶으면</b> 몇 묶음일까요? 3, 6, 9, 12 — <b>4묶음</b>! 같은 12÷3=4지만 이번엔 "몇 묶음?"을 물었어요. 나눠주기(한 명당 몇 개)와 묶어세기(몇 묶음), 나눗셈은 이 두 질문에 모두 답해요.',
          en:'Bundle 12 into <b>groups of 3</b>: 3, 6, 9, 12 — <b>4 groups</b>! Same 12÷3=4, but now the question was "how many groups?" Division answers both sharing and grouping questions.',
          zh:'把12个<b>3个一组</b>：3、6、9、12——<b>4组</b>！同样是12÷3=4，但这次问的是"几组？"。分东西和数组数，除法都能回答。'},
        mathSteps:[{ko:'12개를 3개씩',en:'\\text{12, in groups of 3}',zh:'12块，每3块一组'},'3, 6, 9, 12',{ko:'= 4묶음',en:'= \\text{4 groups}',zh:'= 4组'}],
        result:{ko:'한 식, 두 질문! 나눗셈은 만능이에요.',en:'One equation, two questions — division does both!',zh:'一个算式，两个问题！除法真万能。'},
        book:null }
    ],
    rule:{ ko:'① ÷는 "똑같이 나누기" ② a÷b는 b×□=a의 □ ③ 구구단이 나눗셈의 열쇠',
      en:'① ÷ means equal sharing ② a÷b is the □ in b×□=a ③ Times tables are the key',
      zh:'① ÷是"平均分" ② a÷b就是b×□=a的□ ③ 口诀是除法的钥匙' }
  },
  check:{
    fills:[
      { tex:'15 \\div 3 = \\square', answer:5,
        hint:{ ko:'3×□=15의 □는?', en:'3×□=15 — what is □?', zh:'3×□=15的□是几？' } },
      { tex:'3 \\times \\square = 21', answer:7,
        hint:{ ko:'3단에서 21이 나오는 곳!', en:'Where does 21 appear in the 3s table?', zh:'3的口诀里哪里是21？' } }
    ],
    open:{ ko:'"20÷4"로 만들 수 있는 이야기 문제를 하나 지어 봐요.',
      en:'Make up a story problem for "20÷4".',
      zh:'编一道"20÷4"的应用题。' },
    openHint:{ ko:'예) 사탕 20개를 4명이 똑같이 나누면 한 명에 몇 개? 또는 20개를 4개씩 봉지에 담으면 몇 봉지?',
      en:'e.g. 20 candies shared by 4 friends — how many each? Or: bag 20 candies 4 at a time — how many bags?',
      zh:'例）20颗糖4个人平均分，每人几颗？或：20颗糖每袋装4颗，能装几袋？' }
  },
  lab:{ generator:'dv2_div2d1d', level:'main', count:4, params:{},
    intro:{ ko:'그림(배열)을 보면서 나눗셈을 눈으로 확인해 보자!',
      en:'Use the array picture to SEE the division!',
      zh:'看着点阵图，用眼睛确认除法！' } },
  arena:{ generator:'dv2_div2d1d', level:'main', count:10, timeLimit:240, params:{},
    rule:{ ko:'4분 안에 나눗셈을 모두 풀어요! 구구단 거꾸로!', en:'Solve all divisions in 4 minutes — tables backwards!', zh:'4分钟内解答所有除法——口诀倒着用！' } },
  stamp:{ label:{ ko:'나눗셈 개척자', en:'Division Pioneer', zh:'除法开拓者' }, coins:24 },
  voice: voice('완벽해! 나눗셈 개척자! 🍪','Perfect! Division Pioneer!','完美！除法开拓者！')
};

/* ─────────────────────────────────────────────
   T-DV2 · 몫과 나머지 (초3-2 교과)
───────────────────────────────────────────── */
window.NM_UNITS['T-DV2'] = {
  id:'T-DV2', tier:'bridge', level:'T', order:104,
  generator:'dv3_divRem', edu:'3-2',
  title:{ ko:'몫과 나머지', en:'Quotient & Remainder', zh:'商与余数' },
  subtitle:{ ko:'딱 안 나눠떨어지면? 남는 게 나머지!', en:"Doesn't divide evenly? What's left is the remainder!", zh:'分不完怎么办？剩下的就是余数！' },
  icon:'🍬',
  practice:{ generator:'dv3_divRem', level:'practice', count:4, params:{},
    intro:{ ko:'사탕이 딱 안 나눠떨어질 때도 있어. 남는 사탕이 바로 나머지야!',
      en:"Sometimes candies don't divide evenly — the leftovers are the remainder!",
      zh:'糖果有时分不完——剩下的就是余数！' } },
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 남는 사탕',en:'1) Leftover candies',zh:'① 剩下的糖'},
        head:{ko:'사탕 13개를 4명이 나누면… 1개가 남아요!',en:'13 candies for 4 friends… 1 left over!',zh:'13颗糖4个人分……剩1颗！'},
        desc:{ko:'사탕 <b>13개</b>를 <b>4명</b>이 나눠요. 3개씩 주면 12개를 쓰고 <b>1개가 남죠</b>. 더 주고 싶어도 4명에게 똑같이 줄 수 없어요. 이때 3을 <b>몫</b>, 남은 1을 <b>나머지</b>라고 해요: 13÷4=3…1',
          en:'<b>13 candies</b> for <b>4 friends</b>. Give 3 each — that uses 12, and <b>1 is left</b>. You can\'t split it fairly. The 3 is the <b>quotient</b>, the leftover 1 is the <b>remainder</b>: 13÷4=3 r1.',
          zh:'<b>13颗糖</b>分给<b>4个人</b>。每人3颗用掉12颗，<b>剩1颗</b>，没法再公平分了。3叫<b>商</b>，剩下的1叫<b>余数</b>：13÷4=3……1。'},
        mathSteps:['13 ÷ 4',{ko:'4×3=12, 남은 것 1',en:'4×3=12, \\text{1 left over}',zh:'4×3=12，剩1'},{ko:'몫 3, 나머지 1',en:'\\text{quotient 3, remainder 1}',zh:'商3，余1'}],
        result:{ko:'나머지는 "더 나눠줄 수 없어 남은 수"예요!',en:'The remainder is what cannot be shared further!',zh:'余数就是"没法再分而剩下的数"！'},
        book:{ko:'검산 마법: (나누는 수)×(몫)+(나머지)=(나눠지는 수). 4×3+1=13 ✓',en:'Check magic: divisor×quotient+remainder = dividend. 4×3+1=13 ✓',zh:'验算魔法：除数×商+余数=被除数。4×3+1=13 ✓'} },
      { tag:{ko:'② 나머지의 규칙',en:'2) The remainder rule',zh:'② 余数的规则'},
        head:{ko:'나머지는 나누는 수보다 항상 작아요!',en:'The remainder is always smaller than the divisor!',zh:'余数一定比除数小！'},
        desc:{ko:'나머지가 4보다 크면 이상해요 — 4명에게 <b>한 개씩 더 줄 수 있으니까요</b>! 그래서 4로 나눈 나머지는 0, 1, 2, 3 중 하나뿐. 나머지가 나누는 수와 같거나 크면, 몫을 1 올려야 한다는 신호예요.',
          en:'A remainder bigger than 4 would be odd — you could <b>give everyone one more</b>! So dividing by 4 leaves remainder 0, 1, 2, or 3 only. If your remainder reaches the divisor, raise the quotient by 1.',
          zh:'余数比4大就不对了——还能<b>再给每人一颗</b>！所以除以4的余数只能是0、1、2、3。余数≥除数就说明商还要加1。'},
        mathSteps:[{ko:'÷4의 나머지',en:'\\text{remainders of } ÷4',zh:'÷4的余数'},{ko:'0, 1, 2, 3만 가능',en:'\\text{only 0, 1, 2, 3 possible}',zh:'只能是0, 1, 2, 3'},{ko:'나머지 ≥ 4 → 몫 +1!',en:'\\text{remainder} ≥ 4 → \\text{quotient} +1!',zh:'余数 ≥ 4 → 商+1！'}],
        result:{ko:'나머지 < 나누는 수 — 꼭 확인하세요!',en:'Remainder < divisor — always check!',zh:'余数<除数——一定要检查！'},
        book:null },
      { tag:{ko:'③ 생활 속 나머지',en:'3) Remainders in life',zh:'③ 生活中的余数'},
        head:{ko:'남으면 한 상자 더? 버려? 문제가 정해요',en:'Round up or leave out? The story decides!',zh:'进一还是舍去？看题目！'},
        desc:{ko:'학생 13명이 4인용 보트를 타면? 13÷4=3…1 — 남은 1명도 타야 하니 보트는 <b>4척</b> 필요! 반대로 리본 13cm로 4cm짜리를 만들면 <b>3개</b>만 되고 1cm는 못 써요. 같은 3…1인데 답이 달라요. 나머지를 어떻게 할지는 이야기가 정해요!',
          en:'13 students on 4-seat boats? 13÷4=3 r1 — the last student needs a boat too, so <b>4 boats</b>! But cutting 4cm ribbons from 13cm gives only <b>3</b>; the 1cm is scrap. Same 3 r1, different answers — the story decides!',
          zh:'13名学生坐4人船？13÷4=3……1——剩下的1人也要坐，所以要<b>4条船</b>！但13cm彩带剪4cm一段只能剪<b>3段</b>，1cm用不了。同样是3余1，答案却不同——看题目决定！'},
        mathSteps:['13÷4 = 3…1',{ko:'보트: 4척 (올림!)',en:'\\text{boats: 4 (round up!)}',zh:'船：4艘（进一！）'},{ko:'리본: 3개 (버림!)',en:'\\text{ribbons: 3 (round down!)}',zh:'丝带：3条（去尾！）'}],
        result:{ko:'나머지 처리 = 이야기 읽기! 수학과 국어의 콜라보예요.',en:'Handling remainders means reading the story!',zh:'处理余数＝读懂题目！'},
        book:null }
    ],
    rule:{ ko:'① 나머지 = 똑같이 나누고 남은 수 ② 나머지 < 나누는 수 ③ 검산: 나누는수×몫+나머지=원래 수',
      en:'① Remainder = what is left after equal sharing ② Remainder < divisor ③ Check: divisor×quotient+remainder = dividend',
      zh:'① 余数=平均分后剩下的数 ② 余数<除数 ③ 验算：除数×商+余数=被除数' }
  },
  check:{
    fills:[
      { tex:'17 \\div 5 = \\square \\cdots 2', answer:3,
        hint:{ ko:'5×□+2=17', en:'5×□+2=17', zh:'5×□+2=17' } },
      { tex:'17 = 5 \\times 3 + \\square', answer:2,
        hint:{ ko:'5×3=15, 17까지 얼마 남지?', en:'5×3=15 — how far to 17?', zh:'5×3=15，到17还差几？' } }
    ],
    open:{ ko:'어떤 수를 6으로 나눈 나머지가 될 수 있는 수를 모두 써 봐요.',
      en:'List every possible remainder when dividing by 6.',
      zh:'写出除以6时所有可能的余数。' },
    openHint:{ ko:'예) 0, 1, 2, 3, 4, 5 — 나머지는 나누는 수 6보다 항상 작아야 해요!',
      en:'e.g. 0, 1, 2, 3, 4, 5 — the remainder must be smaller than 6!',
      zh:'例）0、1、2、3、4、5——余数必须比6小！' }
  },
  lab:{ generator:'dv3_divRem', level:'main', count:4, params:{},
    intro:{ ko:'몫과 나머지를 단계별로 구해 보자! 검산도 잊지 말고.',
      en:'Find quotient and remainder step by step — and check your work!',
      zh:'一步步求商和余数——别忘了验算！' } },
  arena:{ generator:'dv3_divRem', level:'main', count:8, timeLimit:300, params:{},
    rule:{ ko:'5분 안에 몫과 나머지 문제를 모두 풀어요!', en:'Solve all quotient-remainder problems in 5 minutes!', zh:'5分钟内解答所有商与余数题！' } },
  stamp:{ label:{ ko:'나머지 수호자', en:'Remainder Guardian', zh:'余数守护者' }, coins:26 },
  voice: voice('완벽해! 나머지 수호자! 🍬','Perfect! Remainder Guardian!','完美！余数守护者！')
};

/* ─────────────────────────────────────────────
   T-ML1 · 세 자리 × 한 자리 (초3-2 교과)
───────────────────────────────────────────── */
window.NM_UNITS['T-ML1'] = {
  id:'T-ML1', tier:'bridge', level:'T', order:105,
  generator:'ml7_mul3d1d', edu:'3-2',
  title:{ ko:'세 자리 × 한 자리', en:'3-Digit × 1-Digit', zh:'三位数乘一位数' },
  subtitle:{ ko:'백·십·일로 쪼개서 곱하고 합쳐요', en:'Split into hundreds, tens, ones — multiply and combine', zh:'拆成百·十·个分别乘再合并' },
  icon:'🚚',
  practice:{ generator:'ml7_mul3d1d', level:'practice', count:4, params:{},
    intro:{ ko:'두 자리 곱셈에서 했던 "쪼개기"를 세 자리에도! 백·십·일로 나눠 봐.',
      en:'The same "splitting" from 2-digit multiplication — now with hundreds too!',
      zh:'两位数乘法的"拆分法"，现在加上百位！' } },
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 사과 트럭 이야기',en:'1) Apple truck story',zh:'① 苹果卡车的故事'},
        head:{ko:'한 트럭에 사과 214개, 3트럭이면?',en:'214 apples per truck — 3 trucks?',zh:'一辆卡车214个苹果，3辆是多少？'},
        desc:{ko:'사과가 트럭 한 대에 <b>214개</b>씩, <b>3대</b>가 왔어요. 214를 통째로 3배 하긴 어렵지만, <b>200과 10과 4로 쪼개면</b> 쉬워요! 200×3=600, 10×3=30, 4×3=12. 합치면 600+30+12=<b>642개</b>!',
          en:'Trucks carry <b>214 apples</b> each and <b>3 trucks</b> arrive. Tripling 214 at once is hard — but <b>split it into 200, 10, and 4</b>! 200×3=600, 10×3=30, 4×3=12. Combine: 600+30+12=<b>642</b>!',
          zh:'每辆卡车<b>214个</b>苹果，来了<b>3辆</b>。直接算214×3很难——<b>拆成200、10、4</b>就简单了！200×3=600，10×3=30，4×3=12。合起来600+30+12=<b>642个</b>！'},
        mathSteps:['214 × 3','200×3=600, 10×3=30, 4×3=12','600+30+12 = 642'],
        result:{ko:'큰 곱셈 = 작은 곱셈 3개의 합! 쪼개면 다 쉬워요.',en:'A big product = three small products! Splitting makes it easy.',zh:'大乘法＝三个小乘法的和！拆开就简单。'},
        book:{ko:'이게 분배법칙이에요: (200+10+4)×3 = 200×3+10×3+4×3.',en:'This is the distributive law: (200+10+4)×3 = 200×3+10×3+4×3.',zh:'这就是分配律：(200+10+4)×3 = 200×3+10×3+4×3。'} },
      { tag:{ko:'② 자리별 곱',en:'2) Multiply each place',zh:'② 按数位乘'},
        head:{ko:'백×, 십×, 일× — 세 번 곱하고 한 번 더해요',en:'Hundreds ×, tens ×, ones × — three multiplies, one add',zh:'百×、十×、个×——乘三次加一次'},
        desc:{ko:'순서를 정해두면 안 헷갈려요: ①백의 자리부터 곱한다 ②십의 자리 곱 ③일의 자리 곱 ④셋을 더한다. 각각은 전부 <b>구구단+0 붙이기</b>라서 이미 배운 것만으로 끝나요!',
          en:'A fixed order keeps you safe: ① hundreds × ② tens × ③ ones × ④ add all three. Each step is just <b>times tables plus zeros</b> — nothing new!',
          zh:'定好顺序就不会乱：①先乘百位 ②再乘十位 ③再乘个位 ④三个相加。每步都只是<b>口诀+添0</b>——全是学过的！'},
        mathSteps:['327 × 2','300×2=600, 20×2=40, 7×2=14','600+40+14 = 654'],
        result:{ko:'세 자리 곱셈 = 구구단 세 번!',en:'3-digit multiplication = times tables, three times!',zh:'三位数乘法＝口诀用三次！'},
        book:null },
      { tag:{ko:'③ 어림 감각',en:'3) Estimation sense',zh:'③ 估算感觉'},
        head:{ko:'답을 쓰기 전, 대충 얼마쯤일지 먼저!',en:'Before answering, estimate first!',zh:'写答案前先估一估！'},
        desc:{ko:'214×3의 답이 64가 나왔다면? 이상하죠! <b>200×3=600</b>이니까 답은 600보다 커야 해요. 백의 자리 곱만 먼저 해 보는 <b>어림</b>은 실수를 잡아주는 안전망이에요.',
          en:'Got 64 for 214×3? Something\'s wrong! Since <b>200×3=600</b>, the answer must exceed 600. Estimating with just the hundreds is a safety net that catches mistakes.',
          zh:'214×3算出64？不对劲！因为<b>200×3=600</b>，答案一定超过600。先用百位估算，是抓错误的安全网。'},
        mathSteps:[{ko:'214×3 어림',en:'214×3 \\text{ estimate}',zh:'214×3 估算'},'200×3 = 600',{ko:'답은 600보다 크다!',en:'\\text{the answer is over 600!}',zh:'答案比600大！'}],
        result:{ko:'어림 먼저, 계산은 그다음 — 마법사의 습관!',en:'Estimate first, calculate second — a wizard\'s habit!',zh:'先估算再计算——魔法师的习惯！'},
        book:null }
    ],
    rule:{ ko:'① 백·십·일로 쪼갠다 ② 자리별로 곱한다(구구단+0) ③ 모두 더한다 ④ 어림으로 검산',
      en:'① Split into hundreds/tens/ones ② Multiply each (tables+zeros) ③ Add them all ④ Check with an estimate',
      zh:'① 拆成百·十·个 ② 按位相乘(口诀+0) ③ 全部相加 ④ 用估算检查' }
  },
  check:{
    fills:[
      { tex:'200 \\times 3 = \\square', answer:600,
        hint:{ ko:'2×3에 0 두 개!', en:'2×3 with two zeros!', zh:'2×3再添两个0！' } },
      { tex:'214 \\times 3 = \\square', answer:642,
        hint:{ ko:'600+30+12', en:'600+30+12', zh:'600+30+12' } }
    ],
    open:{ ko:'123×4를 쪼개서 계산하는 과정을 차례대로 써 봐요.',
      en:'Write out the steps for computing 123×4 by splitting.',
      zh:'写出用拆分法计算123×4的步骤。' },
    openHint:{ ko:'예) 100×4=400, 20×4=80, 3×4=12 → 400+80+12=492.',
      en:'e.g. 100×4=400, 20×4=80, 3×4=12 → 400+80+12=492.',
      zh:'例）100×4=400，20×4=80，3×4=12 → 400+80+12=492。' }
  },
  lab:{ generator:'ml7_mul3d1d', level:'main', count:4, params:{},
    intro:{ ko:'단계별로 쪼개 곱해 보자! 마지막 합치기까지.',
      en:'Split, multiply step by step, then combine!',
      zh:'一步步拆开乘，最后合并！' } },
  arena:{ generator:'ml7_mul3d1d', level:'main', count:6, timeLimit:360, params:{},
    rule:{ ko:'6분 안에 세 자리 곱셈을 모두 풀어요!', en:'Solve all 3-digit multiplications in 6 minutes!', zh:'6分钟内解答所有三位数乘法！' } },
  stamp:{ label:{ ko:'트럭 곱셈사', en:'Truckload Multiplier', zh:'卡车乘法师' }, coins:28 },
  voice: voice('완벽해! 트럭 곱셈사! 🚚','Perfect! Truckload Multiplier!','完美！卡车乘法师！')
};

/* ─────────────────────────────────────────────
   T-FR1 · 분수 알기 (초3-1 교과)
───────────────────────────────────────────── */
window.NM_UNITS['T-FR1'] = {
  id:'T-FR1', tier:'bridge', level:'T', order:106,
  generator:'fr0_partWhole', edu:'3-1',
  title:{ ko:'분수 알기', en:'Meet Fractions', zh:'认识分数' },
  subtitle:{ ko:'전체를 똑같이 나눈 것 중 몇 개 — 그게 분수!', en:'Some pieces out of an equally-cut whole — that is a fraction!', zh:'把整体平均分后取几份——这就是分数！' },
  icon:'🍕',
  practice:{ generator:'fr0_partWhole', level:'practice', count:5, params:{},
    intro:{ ko:'피자로 분수를 배워보자! 전체 조각 수와 먹은 조각 수만 세면 돼.',
      en:"Let's learn fractions with pizza! Just count total pieces and eaten pieces.",
      zh:'用比萨学分数！数一数总块数和吃掉的块数就行。' } },
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 피자 한 조각',en:'1) One pizza slice',zh:'① 一块比萨'},
        head:{ko:'4조각 중 1조각 = 4분의 1',en:'1 of 4 pieces = one quarter',zh:'4块中的1块＝四分之一'},
        desc:{ko:'피자를 <b>똑같이 4조각</b>으로 나누고 1조각을 먹었어요. 먹은 양은 전체의 <b>4분의 1</b> — 이렇게 써요: <b>1/4</b>. 아래 수(분모) 4는 "전체를 4개로 나눴다", 위 수(분자) 1은 "그중 1개"라는 뜻!',
          en:'Cut a pizza into <b>4 equal pieces</b> and eat one. You ate <b>one quarter</b> — written <b>1/4</b>. The bottom number (denominator) 4 says "cut into 4"; the top (numerator) 1 says "took 1 of them"!',
          zh:'把比萨<b>平均切成4块</b>，吃了1块。吃掉的是<b>四分之一</b>——写作<b>1/4</b>。下面的数(分母)4表示"分成4份"，上面的数(分子)1表示"取了1份"！'},
        mathSteps:[{ko:'🍕 4조각으로 똑같이',en:'🍕 \\text{4 equal slices}',zh:'🍕 平均分成4块'},{ko:'1조각 먹음',en:'\\text{ate 1 slice}',zh:'吃了1块'},'= \\dfrac{1}{4}'],
        result:{ko:'분모 = 전체 조각 수(아래), 분자 = 내 조각 수(위)!',en:'Denominator = total pieces (bottom); numerator = your pieces (top)!',zh:'分母=总块数(下)，分子=取的块数(上)！'},
        book:{ko:'읽는 순서도 아래부터: "4분의 1". 아래(전체)를 먼저 말해요.',en:'Read from the bottom: "one quarter" — the whole comes first in Korean!',zh:'读的时候从下往上："四分之一"——先说整体。'} },
      { tag:{ko:'② 똑같이가 생명',en:'2) EQUAL is everything',zh:'② "平均"是关键'},
        head:{ko:'삐뚤게 자르면 분수가 아니에요!',en:'Unequal cuts are NOT fractions!',zh:'切得不均匀就不是分数！'},
        desc:{ko:'피자를 크게 1조각, 작게 3조각으로 잘랐다면 큰 조각을 1/4이라고 할 수 <b>없어요</b>! 분수는 반드시 <b>똑같이</b> 나눴을 때만 써요. "똑같이 나누기"가 분수 나라의 제1 법칙이에요.',
          en:'If one piece is huge and three are tiny, the big one is <b>not</b> 1/4! Fractions only work when parts are <b>equal</b>. "Divide equally" is the first law of Fraction Land.',
          zh:'如果切成1块大3块小，大块<b>不能</b>叫1/4！只有<b>平均分</b>才能用分数。"平均分"是分数王国的第一法则。'},
        mathSteps:[{ko:'❌ 크기 다른 4조각',en:'❌ \\text{4 unequal slices}',zh:'❌ 大小不同的4块'},{ko:'⭕ 똑같은 4조각',en:'⭕ \\text{4 equal slices}',zh:'⭕ 一样大的4块'},{ko:'분수 = 똑같이 나눈 것!',en:'\\text{a fraction = equal shares!}',zh:'分数 = 平均分！'}],
        result:{ko:'분수를 보면 먼저 물어봐요: "똑같이 나눴나?"',en:'Always ask first: "Are the parts equal?"',zh:'看到分数先问："分得平均吗？"'},
        book:null },
      { tag:{ko:'③ 남은 부분도 분수',en:'3) The rest is a fraction too',zh:'③ 剩下的也是分数'},
        head:{ko:'3조각 먹으면 남은 건 8분의 5!',en:'Eat 3 of 8 — 5/8 remains!',zh:'8块吃3块——剩8分之5！'},
        desc:{ko:'8조각 피자에서 3조각(3/8)을 먹으면 남은 건 8−3=5조각, 즉 <b>5/8</b>이에요. 먹은 분수와 남은 분수를 더하면? 3/8+5/8=8/8=<b>전체(1)</b>! 부분들을 다 모으면 언제나 전체가 돼요.',
          en:'From an 8-piece pizza, eat 3 (3/8) — 8−3=5 pieces remain: <b>5/8</b>. Eaten plus left? 3/8+5/8=8/8=<b>the whole (1)</b>! Parts always add back to the whole.',
          zh:'8块比萨吃了3块(3/8)，剩8−3=5块，就是<b>5/8</b>。吃掉的加剩下的？3/8+5/8=8/8=<b>整体(1)</b>！部分合起来永远是整体。'},
        mathSteps:[{ko:'8조각 중 3조각 먹음',en:'\\text{ate 3 of 8 slices}',zh:'8块中吃了3块'},{ko:'남은 조각: 8-3=5',en:'\\text{slices left: } 8-3=5',zh:'剩下的块数：8-3=5'},{ko:'남은 부분 = \\dfrac{5}{8}',en:'\\text{left over} = \\dfrac{5}{8}',zh:'\\text{剩下的部分} = \\dfrac{5}{8}'}],
        result:{ko:'부분+부분=전체. 분수는 퍼즐 조각 같아요!',en:'Part + part = whole. Fractions are puzzle pieces!',zh:'部分+部分=整体。分数就像拼图！'},
        book:null }
    ],
    rule:{ ko:'① 반드시 똑같이 나눈다 ② 분모(아래)=전체 조각 수 ③ 분자(위)=세는 조각 수 ④ 부분을 다 모으면 1',
      en:'① Parts must be equal ② Denominator (bottom) = total pieces ③ Numerator (top) = counted pieces ④ All parts make 1',
      zh:'① 必须平均分 ② 分母(下)=总份数 ③ 分子(上)=所取份数 ④ 所有部分合起来是1' }
  },
  check:{
    fills:[
      { tex:{ko:'\\text{8조각 중 3조각} = \\dfrac{\\square}{8}',en:'\\text{3 of 8 slices} = \\dfrac{\\square}{8}',zh:'\\text{8块中的3块} = \\dfrac{\\square}{8}'}, answer:3,
        hint:{ ko:'분자 = 세는 조각 수(위)', en:'Numerator = pieces counted (top)', zh:'分子=所取块数(上)' } },
      { tex:{ko:'\\dfrac{2}{\\square} = \\text{5조각 중 2조각}',en:'\\dfrac{2}{\\square} = \\text{2 of 5 slices}',zh:'\\dfrac{2}{\\square} = \\text{5块中的2块}'}, answer:5,
        hint:{ ko:'분모 = 전체 조각 수(아래)', en:'Denominator = total pieces (bottom)', zh:'分母=总块数(下)' } }
    ],
    open:{ ko:'생활에서 분수를 쓰는 순간을 하나 찾아 분수로 써 봐요.',
      en:'Find one real-life fraction moment and write it as a fraction.',
      zh:'找一个生活中用分数的时刻，并写成分数。' },
    openHint:{ ko:'예) 초콜릿 6칸 중 2칸 먹기 = 2/6. 하루 24시간 중 잠 8시간 = 8/24!',
      en:'e.g. Eating 2 of 6 chocolate squares = 2/6. Sleeping 8 of 24 hours = 8/24!',
      zh:'例）6格巧克力吃2格=2/6。一天24小时睡8小时=8/24！' }
  },
  lab:{ generator:'fr0_partWhole', level:'main', count:4, params:{},
    intro:{ ko:'이번엔 남은 부분 분수까지! 전체에서 빼는 것 기억해.',
      en:'Now including leftover fractions! Remember: subtract from the whole.',
      zh:'这次包括剩余的分数！记住从整体里减。' } },
  arena:{ generator:'fr0_partWhole', level:'main', count:8, timeLimit:240, params:{},
    rule:{ ko:'4분 안에 분수 문제를 모두 풀어요!', en:'Solve all fraction problems in 4 minutes!', zh:'4分钟内解答所有分数题！' } },
  stamp:{ label:{ ko:'분수 나라 입국자', en:'Fraction Land Arrival', zh:'分数王国入境者' }, coins:24 },
  voice: voice('완벽해! 분수 나라에 온 걸 환영해! 🍕','Perfect! Welcome to Fraction Land!','完美！欢迎来到分数王国！')
};

/* ─────────────────────────────────────────────
   T-FR2 · 가분수와 대분수 (초4-2 교과)
───────────────────────────────────────────── */
window.NM_UNITS['T-FR2'] = {
  id:'T-FR2', tier:'bridge', level:'T', order:107,
  generator:'fr2_improperMixed', edu:'4-2',
  title:{ ko:'가분수와 대분수', en:'Improper & Mixed Numbers', zh:'假分数与带分数' },
  subtitle:{ ko:'7/4 = 1과 3/4 — 같은 양, 두 가지 옷', en:'7/4 = 1¾ — same amount, two outfits', zh:'7/4＝1又3/4——同一个量，两件衣服' },
  icon:'🎂',
  practice:{ generator:'fr2_improperMixed', level:'practice', count:4, params:{},
    intro:{ ko:'분자가 분모보다 큰 분수를 만나볼 시간! 나눗셈이 열쇠야.',
      en:'Time to meet fractions whose top beats the bottom! Division is the key.',
      zh:'来认识分子比分母大的分数！除法是钥匙。' } },
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 케이크 7조각',en:'1) Seven cake pieces',zh:'① 7块蛋糕'},
        head:{ko:'4조각들이 케이크인데 7조각이 있다면?',en:'Cakes cut in 4 — but you have 7 pieces?',zh:'一个蛋糕切4块——现在有7块？'},
        desc:{ko:'한 판을 4조각으로 자르는 케이크. 조각이 <b>7개</b> 있으면 몇 판일까요? 4조각으로 <b>한 판</b>을 채우고 3조각이 남아요 → <b>1판 하고 3/4판</b>! 7/4처럼 분자≥분모인 분수를 <b>가분수</b>, 1과 3/4처럼 쓴 것을 <b>대분수</b>라고 해요.',
          en:'A cake makes 4 pieces. With <b>7 pieces</b>, how many cakes? Four pieces fill <b>one whole cake</b>, three remain → <b>1 and 3/4</b>! A fraction with top ≥ bottom (7/4) is <b>improper</b>; the "1 and 3/4" form is a <b>mixed number</b>.',
          zh:'一个蛋糕切4块。有<b>7块</b>是几个蛋糕？4块拼成<b>一整个</b>，还剩3块→<b>1又3/4</b>！像7/4这样分子≥分母的叫<b>假分数</b>，写成"1又3/4"的叫<b>带分数</b>。'},
        mathSteps:['\\dfrac{7}{4}',{ko:'4조각 = 1판, 3조각 남음',en:'\\text{4 slices = 1 pizza, 3 left}',zh:'4块 = 1个，剩3块'},'= 1\\dfrac{3}{4}'],
        result:{ko:'같은 양이에요! 옷만 갈아입은 것.',en:'The same amount — just a change of clothes!',zh:'同一个量——只是换了衣服！'},
        book:{ko:'가분수→대분수는 나눗셈: 7÷4=1…3 → 몫이 정수, 나머지가 분자!',en:'Improper→mixed is division: 7÷4=1 r3 → quotient is the whole, remainder the numerator!',zh:'假分数→带分数用除法：7÷4=1……3→商是整数部分，余数是分子！'} },
      { tag:{ko:'② 나눗셈으로 변신',en:'2) Transform by division',zh:'② 用除法变身'},
        head:{ko:'가분수→대분수: 분자÷분모!',en:'Improper→mixed: top ÷ bottom!',zh:'假分数→带分数：分子÷分母！'},
        desc:{ko:'몫과 나머지를 배웠으니 이제 써먹을 시간! <b>분자÷분모</b>를 하면 몫이 "몇 판", 나머지가 "남은 조각". 9/4라면 9÷4=2…1이니 <b>2와 1/4</b>. 나머지 나눗셈이 분수 나라에서 이렇게 다시 만나요!',
          en:'Time to use quotients and remainders! <b>Top ÷ bottom</b>: the quotient is the wholes, the remainder the leftover pieces. For 9/4: 9÷4=2 r1, so <b>2¼</b>. Remainder division returns in Fraction Land!',
          zh:'商和余数派上用场了！<b>分子÷分母</b>：商是"几个整"，余数是"剩几块"。9/4就是9÷4=2……1，即<b>2又1/4</b>。余数除法在分数王国重逢！'},
        mathSteps:['\\dfrac{9}{4}','9 ÷ 4 = 2 \\cdots 1','= 2\\dfrac{1}{4}'],
        result:{ko:'배운 마법은 꼭 다시 쓰여요 — 나머지 나눗셈처럼!',en:'Old magic always returns — like remainder division!',zh:'学过的魔法总会再用上——就像余数除法！'},
        book:null },
      { tag:{ko:'③ 반대로 변신',en:'3) Transform back',zh:'③ 反向变身'},
        head:{ko:'대분수→가분수: 정수×분모+분자!',en:'Mixed→improper: whole×bottom+top!',zh:'带分数→假分数：整数×分母+分子！'},
        desc:{ko:'2와 1/4을 가분수로 되돌리려면? 판 2개는 조각 <b>2×4=8개</b>, 더하기 낱조각 1개 = <b>9조각</b> → 9/4! 공식: <b>정수×분모+분자</b>가 새 분자. 계산할 땐 가분수가, 크기를 느낄 땐 대분수가 편해요.',
          en:'Turn 2¼ back: 2 cakes are <b>2×4=8 pieces</b>, plus 1 loose piece = <b>9</b> → 9/4! Formula: <b>whole×bottom+top</b> gives the new numerator. Improper is handy for computing; mixed for sensing size.',
          zh:'把2又1/4变回去：2个蛋糕是<b>2×4=8块</b>，加1块散的＝<b>9块</b>→9/4！公式：<b>整数×分母+分子</b>＝新分子。计算用假分数方便，感受大小用带分数直观。'},
        mathSteps:['2\\dfrac{1}{4}','2 \\times 4 + 1 = 9','= \\dfrac{9}{4}'],
        result:{ko:'두 방향 다 자유자재로 — 분수 변신술 완성!',en:'Both directions mastered — transformation complete!',zh:'两个方向都熟练——分数变身术完成！'},
        book:null }
    ],
    rule:{ ko:'① 가분수(분자≥분모) ↔ 대분수(정수+진분수) ② 가→대: 분자÷분모(몫…나머지) ③ 대→가: 정수×분모+분자',
      en:'① Improper (top≥bottom) ↔ mixed (whole+proper) ② Improper→mixed: divide top by bottom ③ Mixed→improper: whole×bottom+top',
      zh:'① 假分数(分子≥分母)↔带分数(整数+真分数) ② 假→带：分子÷分母 ③ 带→假：整数×分母+分子' }
  },
  check:{
    fills:[
      { tex:'\\dfrac{9}{4} = \\square\\dfrac{1}{4}', answer:2,
        hint:{ ko:'9÷4의 몫!', en:'The quotient of 9÷4!', zh:'9÷4的商！' } },
      { tex:'1\\dfrac{2}{3} = \\dfrac{\\square}{3}', answer:5,
        hint:{ ko:'1×3+2', en:'1×3+2', zh:'1×3+2' } }
    ],
    open:{ ko:'가분수와 대분수 중 언제 어느 쪽이 편한지 생각을 써 봐요.',
      en:'When is each form (improper vs mixed) more convenient? Write your thoughts.',
      zh:'什么时候假分数方便、什么时候带分数方便？写下你的想法。' },
    openHint:{ ko:'예) 곱셈·나눗셈 계산엔 가분수가, "얼마나 큰지" 한눈에 보긴 대분수가 편해요.',
      en:'e.g. Improper is easier for multiplying; mixed shows the size at a glance.',
      zh:'例）乘除计算用假分数容易；一眼看出大小用带分数。' }
  },
  lab:{ generator:'fr2_improperMixed', level:'main', count:4, params:{},
    intro:{ ko:'두 방향 변신을 연습하자! 나눗셈과 곱셈, 둘 다 필요해.',
      en:'Practice both transformations — division AND multiplication!',
      zh:'练习两个方向的变身——除法和乘法都要用！' } },
  arena:{ generator:'fr2_improperMixed', level:'main', count:8, timeLimit:300, params:{},
    rule:{ ko:'5분 안에 분수 변신을 모두 완성해요!', en:'Complete all transformations in 5 minutes!', zh:'5分钟内完成所有分数变身！' } },
  stamp:{ label:{ ko:'분수 변신술사', en:'Fraction Shapeshifter', zh:'分数变身师' }, coins:28 },
  voice: voice('완벽해! 분수 변신술사! 🎂','Perfect! Fraction Shapeshifter!','完美！分数变身师！')
};

/* ─────────────────────────────────────────────
   T-FR3 · 약분 마법 (초5-1 교과)
───────────────────────────────────────────── */
window.NM_UNITS['T-FR3'] = {
  id:'T-FR3', tier:'bridge', level:'T', order:108,
  generator:'fr5_simplify', edu:'5-1',
  title:{ ko:'약분 마법', en:'Simplifying Magic', zh:'约分魔法' },
  subtitle:{ ko:'분자·분모를 같은 수로 나눠도 크기는 그대로!', en:'Divide top and bottom by the same number — the size stays!', zh:'分子分母同除一个数，大小不变！' },
  icon:'✂️',
  practice:{ generator:'fr5_simplify', level:'practice', count:4, params:{},
    intro:{ ko:'분수를 더 간단하게 만드는 가위질! 같은 수로 위아래를 잘라내.',
      en:'Scissor magic to simplify fractions — cut top and bottom by the same number!',
      zh:'把分数变简单的剪刀魔法——上下同除一个数！' } },
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 같은 피자, 다른 이름',en:'1) Same pizza, different name',zh:'① 同一块比萨，不同名字'},
        head:{ko:'6/8과 3/4은 같은 양이에요!',en:'6/8 and 3/4 are the same amount!',zh:'6/8和3/4是一样多！'},
        desc:{ko:'8조각 피자에서 6조각(6/8)을 먹은 것과 4조각 피자에서 3조각(3/4)을 먹은 것 — 그림으로 겹쳐보면 <b>정확히 같은 양</b>이에요! 분자와 분모를 <b>같은 수 2로 나누면</b> 6/8 → 3/4. 크기는 그대로, 이름만 간단해졌어요.',
          en:'Eating 6 of 8 pieces (6/8) equals eating 3 of 4 bigger pieces (3/4) — overlay the pictures and they match <b>exactly</b>! Divide top and bottom <b>by the same 2</b>: 6/8 → 3/4. Same size, simpler name.',
          zh:'8块中吃6块(6/8)和4块中吃3块(3/4)——图叠起来<b>完全一样多</b>！分子分母<b>同除以2</b>：6/8→3/4。大小不变，名字更简单。'},
        mathSteps:['\\dfrac{6}{8} = \\dfrac{6 \\div 2}{8 \\div 2}','= \\dfrac{3}{4}',{ko:'크기는 그대로!',en:'\\text{the size stays the same!}',zh:'大小不变！'}],
        result:{ko:'약분 = 분수의 별명 짓기. 짧고 간단하게!',en:'Simplifying = giving the fraction a nickname — short and simple!',zh:'约分＝给分数起小名——又短又简单！'},
        book:{ko:'왜 같을까? 위아래를 같이 나누는 건 조각을 2개씩 붙여 큰 조각으로 만드는 것과 같아요.',en:'Why equal? Dividing both is like gluing pairs of pieces into bigger pieces.',zh:'为什么相等？上下同除相当于把小块两两粘成大块。'} },
      { tag:{ko:'② 공약수 찾기',en:'2) Finding common factors',zh:'② 找公因数'},
        head:{ko:'위아래를 모두 나누는 수를 찾아요',en:'Find a number that divides both!',zh:'找一个能同时整除上下的数！'},
        desc:{ko:'약분하려면 분자와 분모를 <b>둘 다 나눠떨어뜨리는 수(공약수)</b>가 필요해요. 6/9라면? 6의 약수 1,2,3,6과 9의 약수 1,3,9 중 공통은 <b>3</b>! 6÷3=2, 9÷3=3 → <b>2/3</b>. 약수 찾기가 여기서 빛나요.',
          en:'To simplify you need a number dividing <b>both</b> top and bottom (a common factor). For 6/9: factors of 6 are 1,2,3,6; of 9 are 1,3,9 — shared: <b>3</b>! 6÷3=2, 9÷3=3 → <b>2/3</b>. Factor-finding shines here.',
          zh:'约分需要一个能<b>同时整除</b>分子分母的数(公因数)。6/9呢？6的因数1,2,3,6，9的因数1,3,9，公共的是<b>3</b>！6÷3=2，9÷3=3→<b>2/3</b>。找因数在这里大显身手。'},
        mathSteps:['\\dfrac{6}{9}',{ko:'공약수 3으로 나누기',en:'\\text{divide by the common factor 3}',zh:'除以公约数3'},'= \\dfrac{2}{3}'],
        result:{ko:'약수 찾기 실력 = 약분 실력!',en:'Factor skill = simplifying skill!',zh:'找因数的本领＝约分的本领！'},
        book:null },
      { tag:{ko:'③ 끝까지 간단하게',en:'3) Simplify to the end',zh:'③ 约到最简'},
        head:{ko:'더 못 나눌 때까지 = 기약분수',en:'Until you can\'t anymore = simplest form',zh:'除到不能再除＝最简分数'},
        desc:{ko:'12/16을 2로 나누면 6/8 — 아직 2로 또 나눠져요! 6/8 → 3/4. 이제 3과 4는 공약수가 1뿐이라 끝. 이런 "더는 약분 안 되는" 분수를 <b>기약분수</b>라고 해요. 한 번에 큰 공약수(4)로 나누면 지름길!',
          en:'12/16 ÷2 gives 6/8 — still divisible by 2! 6/8 → 3/4. Now 3 and 4 share only 1, so we stop. A fraction that can\'t be reduced further is in <b>simplest form</b>. Dividing by the biggest common factor (4) is a shortcut!',
          zh:'12/16除以2得6/8——还能再除2！6/8→3/4。3和4只有公因数1，结束。不能再约的分数叫<b>最简分数</b>。一次除以最大公因数(4)是捷径！'},
        mathSteps:['\\dfrac{12}{16} \\rightarrow \\dfrac{6}{8}','\\rightarrow \\dfrac{3}{4}',{ko:'기약분수 완성!',en:'\\text{fully reduced!}',zh:'化成最简分数！'}],
        result:{ko:'끝까지 잘라야 진짜 완성 — 기약분수!',en:'Cut all the way — simplest form!',zh:'剪到底才算完成——最简分数！'},
        book:null }
    ],
    rule:{ ko:'① 분자·분모를 같은 수로 나눈다(크기 불변) ② 공약수를 찾는다 ③ 더 못 나눌 때까지 = 기약분수',
      en:'① Divide top & bottom by the same number (size unchanged) ② Find common factors ③ Repeat until simplest form',
      zh:'① 分子分母同除一数(大小不变) ② 找公因数 ③ 除到最简分数为止' }
  },
  check:{
    fills:[
      { tex:'\\dfrac{4}{8} = \\dfrac{\\square}{2}', answer:1,
        hint:{ ko:'위아래를 4로 나눠요', en:'Divide both by 4', zh:'上下同除以4' } },
      { tex:'\\dfrac{6}{9} = \\dfrac{2}{\\square}', answer:3,
        hint:{ ko:'위아래를 3으로 나눠요', en:'Divide both by 3', zh:'上下同除以3' } }
    ],
    open:{ ko:'약분해도 분수의 크기가 변하지 않는 이유를 피자로 설명해 봐요.',
      en:'Using pizza, explain why simplifying does not change the size.',
      zh:'用比萨解释为什么约分不改变分数的大小。' },
    openHint:{ ko:'예) 8조각 중 6조각을 2조각씩 붙이면 4조각 중 3조각 — 붙이기만 했으니 양은 그대로!',
      en:'e.g. Glue the 8 pieces into pairs: 6 of 8 becomes 3 of 4 — same pizza, bigger pieces!',
      zh:'例）把8块两两粘起来：6/8变成3/4——只是粘起来，量没变！' }
  },
  lab:{ generator:'fr5_simplify', level:'main', count:4, params:{},
    intro:{ ko:'단계별로 약분해 보자! 공약수부터 찾고.',
      en:'Simplify step by step — find the common factor first!',
      zh:'一步步约分——先找公因数！' } },
  arena:{ generator:'fr5_simplify', level:'main', count:8, timeLimit:300, params:{},
    rule:{ ko:'5분 안에 약분을 모두 완성해요!', en:'Simplify everything in 5 minutes!', zh:'5分钟内完成所有约分！' } },
  stamp:{ label:{ ko:'약분 가위손', en:'Simplifying Scissorhands', zh:'约分剪刀手' }, coins:28 },
  voice: voice('완벽해! 약분 가위손! ✂️','Perfect! Simplifying Scissorhands!','完美！约分剪刀手！')
};

/* ─────────────────────────────────────────────
   T-DV3 · 약수 찾기 (초5-1 교과)
───────────────────────────────────────────── */
window.NM_UNITS['T-DV3'] = {
  id:'T-DV3', tier:'bridge', level:'T', order:109,
  generator:'dv7_gcdLcm', edu:'5-1',
  title:{ ko:'약수 찾기', en:'Finding Factors', zh:'找因数' },
  subtitle:{ ko:'나누어떨어지게 하는 수들 — 직사각형으로 찾아요!', en:'Numbers that divide evenly — find them with rectangles!', zh:'能整除的数——用长方形来找！' },
  icon:'🧩',
  practice:{ generator:'dv7_gcdLcm', level:'practice', count:4, params:{ mode:'factors' },
    intro:{ ko:'12를 나눠떨어뜨리는 수를 전부 찾아보자! 짝으로 찾으면 빠짐없어.',
      en:'Find every number that divides 12 — hunt in pairs so you miss none!',
      zh:'找出所有能整除12的数——成对找就不会漏！' } },
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 타일 직사각형',en:'1) Tile rectangles',zh:'① 瓷砖长方形'},
        head:{ko:'타일 12장으로 직사각형 만들기!',en:'Make rectangles with 12 tiles!',zh:'用12块瓷砖拼长方形！'},
        desc:{ko:'타일 <b>12장</b>을 빈틈없이 직사각형으로 놓아 볼까요? <b>1×12, 2×6, 3×4</b> — 세 가지 모양이 돼요! 여기 등장한 수 1, 2, 3, 4, 6, 12가 바로 12의 <b>약수</b>: 12를 나누어떨어지게 하는 수들이에요.',
          en:'Arrange <b>12 tiles</b> into perfect rectangles: <b>1×12, 2×6, 3×4</b> — three shapes! The numbers 1, 2, 3, 4, 6, 12 are the <b>factors</b> of 12 — numbers that divide it evenly.',
          zh:'把<b>12块瓷砖</b>拼成整齐的长方形：<b>1×12、2×6、3×4</b>——三种形状！出现的数1、2、3、4、6、12就是12的<b>因数</b>——能整除12的数。'},
        mathSteps:[{ko:'12장의 타일',en:'\\text{12 tiles}',zh:'12块瓷砖'},'1×12, 2×6, 3×4',{ko:'약수: 1,2,3,4,6,12 (6개)',en:'\\text{factors: } 1,2,3,4,6,12 \\text{ (6)}',zh:'因数：1,2,3,4,6,12（6个）'}],
        result:{ko:'직사각형 한 개 = 약수 한 쌍!',en:'One rectangle = one pair of factors!',zh:'一个长方形＝一对因数！'},
        book:{ko:'약수는 항상 짝으로 나와요: 2를 찾으면 12÷2=6도 약수!',en:'Factors come in pairs: find 2 and 12÷2=6 is a factor too!',zh:'因数总是成对出现：找到2，12÷2=6也是因数！'} },
      { tag:{ko:'② 짝 사냥법',en:'2) Pair hunting',zh:'② 成对猎因数'},
        head:{ko:'1부터 차례로, 짝과 함께 찾아요',en:'From 1 upward — catch each with its partner',zh:'从1开始，和搭档一起抓'},
        desc:{ko:'약수를 빠짐없이 찾는 법: <b>1부터 차례로</b> 나눠보고, 나눠떨어지면 <b>짝(몫)도 같이</b> 적어요. 18이라면: 1과 18, 2와 9, 3과 6. 4, 5는 안 나눠지고… 6은 이미 나왔으니 끝! 절반만 검사해도 전부 찾아져요.',
          en:'To find all factors: try <b>1, 2, 3…</b> in order, and when one divides, write <b>its partner (the quotient)</b> too. For 18: 1&18, 2&9, 3&6. 4 and 5 fail… 6 already appeared — done! Checking half finds all.',
          zh:'找全因数的方法：<b>从1开始</b>依次试除，能整除就把<b>搭档(商)也</b>写上。18：1和18、2和9、3和6。4、5不行……6已经出现过——结束！只查一半就能找全。'},
        mathSteps:[{ko:'18의 약수',en:'\\text{factors of 18}',zh:'18的因数'},'1·18, 2·9, 3·6',{ko:'= 6개',en:'= \\text{6 of them}',zh:'= 6个'}],
        result:{ko:'짝 사냥 = 빠뜨림 없는 약수 찾기!',en:'Pair hunting = no factor left behind!',zh:'成对猎捕＝一个因数都不漏！'},
        book:null },
      { tag:{ko:'③ 특별한 수들',en:'3) Special numbers',zh:'③ 特别的数'},
        head:{ko:'약수가 2개뿐인 수 = 소수!',en:'Only 2 factors = a prime!',zh:'只有2个因数＝质数！'},
        desc:{ko:'7의 약수는? 1과 7, <b>딱 2개</b>. 이렇게 1과 자기 자신밖에 약수가 없는 수를 <b>소수</b>라고 해요(2, 3, 5, 7, 11…). 타일로는 한 줄짜리 직사각형밖에 안 되는 수죠! 반대로 12처럼 약수가 많은 수는 나누기 쉬운 친절한 수예요.',
          en:'Factors of 7? Just 1 and 7 — <b>only two</b>. Numbers with no factors besides 1 and themselves are <b>primes</b> (2, 3, 5, 7, 11…) — tiles only form a single row! Numbers like 12 with many factors are friendly to divide.',
          zh:'7的因数？只有1和7，<b>就2个</b>。除了1和自己没有别的因数的数叫<b>质数</b>(2、3、5、7、11……)——瓷砖只能摆成一行！而像12这样因数多的数，分起来很友好。'},
        mathSteps:[{ko:'7의 약수: 1, 7',en:'\\text{factors of 7: } 1, 7',zh:'7的因数：1, 7'},{ko:'2개뿐 → 소수!',en:'\\text{only 2 → prime!}',zh:'只有2个 → 质数！'},{ko:'12: 6개 → 친절한 수',en:'12: \\text{6 factors → a friendly number}',zh:'12：6个 → 友好的数'}],
        result:{ko:'약수 개수는 수의 성격이에요!',en:'The factor count is a number\'s personality!',zh:'因数个数是数的性格！'},
        book:null }
    ],
    rule:{ ko:'① 약수 = 나누어떨어지게 하는 수 ② 1부터 짝으로 찾는다 ③ 약수 2개뿐이면 소수',
      en:'① Factors divide a number evenly ② Hunt in pairs from 1 ③ Exactly 2 factors = prime',
      zh:'① 因数=能整除的数 ② 从1开始成对找 ③ 恰好2个因数=质数' }
  },
  check:{
    fills:[
      { tex:{ko:'12\\text{의 약수 개수} = \\square',en:'\\text{number of factors of }12 = \\square',zh:'12\\text{的因数个数} = \\square'}, answer:6,
        hint:{ ko:'1·12, 2·6, 3·4', en:'1&12, 2&6, 3&4', zh:'1·12，2·6，3·4' } },
      { tex:{ko:'10\\text{의 약수 개수} = \\square',en:'\\text{number of factors of }10 = \\square',zh:'10\\text{的因数个数} = \\square'}, answer:4,
        hint:{ ko:'1·10, 2·5', en:'1&10, 2&5', zh:'1·10，2·5' } }
    ],
    open:{ ko:'16의 약수를 모두 찾아 써 봐요. 몇 개인가요?',
      en:'Find and list every factor of 16. How many are there?',
      zh:'找出16的所有因数。一共几个？' },
    openHint:{ ko:'예) 1·16, 2·8, 4·4 → 1, 2, 4, 8, 16으로 5개! (4는 짝이 자기 자신이라 한 번만)',
      en:'e.g. 1&16, 2&8, 4&4 → 1, 2, 4, 8, 16 — five! (4 pairs with itself, count once)',
      zh:'例）1·16，2·8，4·4→1、2、4、8、16共5个！(4的搭档是自己，只算一次)' }
  },
  lab:{ generator:'dv7_gcdLcm', level:'main', count:4, params:{ mode:'factors' },
    intro:{ ko:'더 큰 수의 약수도 짝 사냥으로! 빠뜨리지 않게 차례차례.',
      en:'Bigger numbers now — hunt in pairs, in order, miss nothing!',
      zh:'更大的数也用成对猎捕——按顺序一个不漏！' } },
  arena:{ generator:'dv7_gcdLcm', level:'main', count:8, timeLimit:300, params:{ mode:'factors' },
    rule:{ ko:'5분 안에 약수 문제를 모두 풀어요!', en:'Solve all factor problems in 5 minutes!', zh:'5分钟内解答所有因数题！' } },
  stamp:{ label:{ ko:'약수 사냥꾼', en:'Factor Hunter', zh:'因数猎人' }, coins:28 },
  voice: voice('완벽해! 약수 사냥꾼! 🧩','Perfect! Factor Hunter!','完美！因数猎人！')
};

/* ─────────────────────────────────────────────
   T-DV4 · 최대공약수·최소공배수 (초5-1 교과)
───────────────────────────────────────────── */
window.NM_UNITS['T-DV4'] = {
  id:'T-DV4', tier:'bridge', level:'T', order:110,
  generator:'dv7_gcdLcm', edu:'5-1',
  title:{ ko:'공약수·공배수', en:'GCD & LCM', zh:'公因数与公倍数' },
  subtitle:{ ko:'두 수가 함께 가진 약수와 배수를 찾아요!', en:'Find the common factors and multiples of two numbers!', zh:'找两个数共同拥有的因数和倍数！' },
  icon:'🔗',
  practice:{ generator:'dv7_gcdLcm', level:'practice', count:4, params:{ mode:'gcd' },
    intro:{ ko:'두 수 모두의 약수 = 공약수! 그 중 가장 큰 것 = 최대공약수(GCD).',
      en:'A factor of both numbers = common factor! The largest one = GCD.',
      zh:'两个数共同的因数=公因数！其中最大的=最大公因数(GCD)。' } },
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 공약수',en:'1) Common factors',zh:'① 公因数'},
        head:{ko:'두 수가 함께 가진 약수!',en:'Factors shared by two numbers!',zh:'两个数共同拥有的因数！'},
        desc:{ko:'12의 약수: <b>1, 2, 3, 4, 6, 12</b>. 18의 약수: <b>1, 2, 3, 6, 9, 18</b>. 둘 다 가진 약수 = <b>공약수: 1, 2, 3, 6</b>! 그 중 가장 큰 <b>6 = 최대공약수(GCD)</b>. 최대공약수의 약수 = 전체 공약수, 이것만 알면 다 찾을 수 있어요!',
          en:'Factors of 12: <b>1, 2, 3, 4, 6, 12</b>. Factors of 18: <b>1, 2, 3, 6, 9, 18</b>. Shared ones = <b>common factors: 1, 2, 3, 6</b>! The biggest, <b>6 = GCD</b>. All factors of the GCD are common factors — super handy!',
          zh:'12的因数：<b>1、2、3、4、6、12</b>。18的因数：<b>1、2、3、6、9、18</b>。两者共有的=<b>公因数：1、2、3、6</b>！其中最大的<b>6=最大公因数</b>。最大公因数的因数就是全部公因数！'},
        mathSteps:['12: 1,2,3,4,6,12','18: 1,2,3,6,9,18',{ko:'공약수: 1,2,3,6 → GCD=6',en:'\\text{common factors: } 1,2,3,6 → GCD=6',zh:'公约数：1,2,3,6 → GCD=6'}],
        result:{ko:'공약수 = GCD의 약수!',en:'Common factors = factors of the GCD!',zh:'公因数＝最大公因数的因数！'},
        book:{ko:'GCD는 "두 수를 동시에 나눌 수 있는 가장 큰 수"예요. 직사각형 타일 문제에서 자주 나와요!',en:'GCD = "the largest number that divides both" — appears in tiling and sharing problems!',zh:'最大公因数=能同时整除两数的最大数——常出现在铺瓷砖和分组问题中！'} },
      { tag:{ko:'② 유클리드 호제법',en:'2) Euclidean algorithm',zh:'② 辗转相除法'},
        head:{ko:'큰 수도 몇 단계면 GCD 완성!',en:'Even big numbers: GCD in just a few steps!',zh:'大数也能几步求出最大公因数！'},
        desc:{ko:'48과 36의 GCD? 직접 약수 찾기엔 오래 걸려요. <b>유클리드 호제법</b>: ①큰 수 ÷ 작은 수의 나머지를 구하고 ②나머지가 0이 될 때까지 반복! <b>48 = 36×1 + 12 → 36 = 12×3 + 0</b> → GCD = <b>12</b>!',
          en:'GCD of 48 and 36? Finding all factors takes too long. <b>Euclidean algorithm</b>: ① find the remainder of big÷small, ② repeat until remainder=0! <b>48 = 36×1+12 → 36 = 12×3+0</b> → GCD = <b>12</b>!',
          zh:'48和36的最大公因数？直接找因数太慢。<b>辗转相除法</b>：①求大数÷小数的余数，②余数为0时停止！<b>48=36×1+12→36=12×3+0</b>→最大公因数=<b>12</b>！'},
        mathSteps:['48 ÷ 36 = 1 ··· 12','36 ÷ 12 = 3 ··· 0','GCD(48, 36) = 12'],
        result:{ko:'나머지가 0이 될 때 마지막 나누는 수 = GCD!',en:'The last divisor before remainder=0 is the GCD!',zh:'余数变为0时的最后除数＝最大公因数！'},
        book:null },
      { tag:{ko:'③ 최소공배수',en:'3) LCM',zh:'③ 最小公倍数'},
        head:{ko:'GCD만 알면 LCM도 1초!',en:'Know the GCD? LCM takes 1 second!',zh:'知道最大公因数，最小公倍数1秒搞定！'},
        desc:{ko:'공배수는 두 수 모두의 배수. 4의 배수: 4,8,12,16,20,<b>24</b>… 6의 배수: 6,12,18,<b>24</b>… 공배수: 12, 24, 36… 그 중 가장 작은 <b>12 = 최소공배수(LCM)</b>! 공식: <b>LCM = a × b ÷ GCD</b>. 4×6÷2 = <b>12</b>!',
          en:'Common multiples appear in both lists. Multiples of 4: 4,8,12… Multiples of 6: 6,12,18… First shared: <b>12 = LCM</b>! Formula: <b>LCM = a × b ÷ GCD</b>. 4×6÷2 = <b>12</b>!',
          zh:'公倍数是两个数共同的倍数。4的倍数：4、8、12……6的倍数：6、12、18……最小公倍数：<b>12</b>！公式：<b>LCM = a × b ÷ GCD</b>。4×6÷2 = <b>12</b>！'},
        mathSteps:['GCD(4, 6) = 2','LCM = 4 × 6 ÷ 2','= 12'],
        result:{ko:'LCM = 두 수의 곱 ÷ GCD!',en:'LCM = product of two numbers ÷ GCD!',zh:'LCM＝两数之积÷最大公因数！'},
        book:null }
    ],
    rule:{ ko:'① 공약수 = GCD의 약수 ② GCD: 나머지 0까지 나누기 반복 ③ LCM = a×b÷GCD',
      en:'① Common factors = factors of GCD ② GCD: divide until remainder=0 ③ LCM = a×b÷GCD',
      zh:'① 公因数=最大公因数的因数 ② 辗转相除至余数为0 ③ LCM=a×b÷最大公因数' }
  },
  check:{
    fills:[
      { tex:'\\gcd(12,\\,18) = \\square', answer:6,
        hint:{ ko:'12의 약수: 1,2,3,4,6,12 / 18의 약수: 1,2,3,6,9,18 → 공약수 1,2,3,6', en:'Factors of 12: 1,2,3,4,6,12 / Factors of 18: 1,2,3,6,9,18 → common: 1,2,3,6', zh:'12的因数：1,2,3,4,6,12 / 18的因数：1,2,3,6,9,18 → 公因数：1,2,3,6' } },
      { tex:'\\text{lcm}(4,\\,6) = \\square', answer:12,
        hint:{ ko:'GCD(4,6)=2, LCM=4×6÷2=12', en:'GCD(4,6)=2, LCM=4×6÷2=12', zh:'GCD(4,6)=2，LCM=4×6÷2=12' } }
    ],
    open:{ ko:'24와 36의 최대공약수를 유클리드 호제법으로 구해 보세요.',
      en:'Find GCD(24, 36) using the Euclidean algorithm.',
      zh:'用辗转相除法求24和36的最大公因数。' },
    openHint:{ ko:'36 ÷ 24 = 1 ··· 12 → 24 ÷ 12 = 2 ··· 0 → GCD = 12',
      en:'36 ÷ 24 = 1 r 12 → 24 ÷ 12 = 2 r 0 → GCD = 12',
      zh:'36÷24=1余12→24÷12=2余0→GCD=12' }
  },
  lab:{ generator:'dv7_gcdLcm', level:'main', count:4, params:{ mode:'lcm' },
    intro:{ ko:'이제 최소공배수! GCD를 먼저 구하고 공식에 넣어요.',
      en:'Now for LCM! Find the GCD first, then apply the formula.',
      zh:'现在求最小公倍数！先求最大公因数，再套公式。' } },
  arena:{ generator:'dv7_gcdLcm', level:'main', count:8, timeLimit:300, params:{ mode:'gcd' },
    rule:{ ko:'5분 안에 최대공약수 문제를 모두 풀어요!', en:'Solve all GCD problems in 5 minutes!', zh:'5分钟内解答所有最大公因数题！' } },
  stamp:{ label:{ ko:'공약수 탐정', en:'GCD Detective', zh:'公因数侦探' }, coins:32 },
  voice: voice('완벽해! 공약수 탐정! 🔗','Perfect! GCD Detective!','完美！公因数侦探！')
};

/* ─────────────────────────────────────────────
   T-DV5 · 배수 판정법 (초5-1 교과)
───────────────────────────────────────────── */
window.NM_UNITS['T-DV5'] = {
  id:'T-DV5', tier:'bridge', level:'T', order:111,
  generator:'dv6_divisibility', edu:'5-1',
  title:{ ko:'배수 판정법', en:'Divisibility Rules', zh:'整除规律' },
  subtitle:{ ko:'끝자리와 자릿수 합으로 배수를 1초에 판별해요!', en:'Judge multiples in seconds — last-digit and digit-sum rules!', zh:'用末位和数字和规律，1秒判断整除性！' },
  icon:'🔍',
  practice:{ generator:'dv6_divisibility', level:'practice', count:4, params:{ mode:'digitSum' },
    intro:{ ko:'각 자리 숫자를 더하면 3의 배수인지 바로 알 수 있어요!',
      en:'Add the digits — you can tell right away if it\'s a multiple of 3!',
      zh:'把各位数字相加——马上就能知道是不是3的倍数！' } },
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 끝자리 규칙',en:'1) Last-digit rules',zh:'① 末位规律'},
        head:{ko:'끝자리만 봐도 2·5·10의 배수!',en:'Check the last digit for multiples of 2, 5 and 10!',zh:'只看末位，判断2·5·10的倍数！'},
        desc:{ko:'2의 배수: 끝자리가 <b>0, 2, 4, 6, 8</b>(짝수). 5의 배수: 끝자리가 <b>0 또는 5</b>. 10의 배수: 끝자리가 <b>0</b>! 274는 끝자리가 4이니 <b>2의 배수</b>. 375는 끝자리가 5이니 <b>5의 배수</b>. 끝자리만 보면 OK!',
          en:'Multiples of 2: last digit is <b>0, 2, 4, 6, or 8</b> (even). Multiples of 5: last digit is <b>0 or 5</b>. Multiples of 10: last digit is <b>0</b>! 274 ends in 4 → <b>multiple of 2</b>. 375 ends in 5 → <b>multiple of 5</b>.',
          zh:'2的倍数：末位是<b>0、2、4、6、8</b>(偶数)。5的倍数：末位是<b>0或5</b>。10的倍数：末位是<b>0</b>！274末位是4→<b>2的倍数</b>。375末位是5→<b>5的倍数</b>。'},
        mathSteps:[{ko:'2의 배수: 끝 0,2,4,6,8',en:'\\text{multiples of 2 end in } 0,2,4,6,8',zh:'2的倍数：末位0,2,4,6,8'},{ko:'5의 배수: 끝 0 또는 5',en:'\\text{multiples of 5 end in 0 or 5}',zh:'5的倍数：末位0或5'},{ko:'10의 배수: 끝 0',en:'\\text{multiples of 10 end in 0}',zh:'10的倍数：末位0'}],
        result:{ko:'끝자리만 보면 2·5·10의 배수 판별 완료!',en:'Last digit alone decides multiples of 2, 5, and 10!',zh:'只看末位，2·5·10的整除性一目了然！'},
        book:{ko:'왜 끝자리만 볼까요? 앞 자리들은 항상 10의 배수라 2·5·10으로 나눠지거든요!',en:'Why only the last digit? The other digits are multiples of 10, which is divisible by 2, 5, and 10!',zh:'为什么只看末位？因为其余位都是10的倍数，自然能被2、5、10整除！'} },
      { tag:{ko:'② 자릿수 합 규칙',en:'2) Digit-sum rule',zh:'② 数字和规律'},
        head:{ko:'자릿수 합이 3의 배수면 그 수도 3의 배수!',en:'If the digit sum is a multiple of 3, so is the number!',zh:'如果数字和是3的倍数，这个数也是3的倍数！'},
        desc:{ko:'234의 자릿수 합: 2+3+4 = <b>9</b>. 9는 3의 배수 → 234도 <b>3의 배수</b>! 231: 2+3+1=6 → 3의 배수. 233: 2+3+3=8 → 3의 배수 아님. <b>9의 배수</b>는 더 엄격: 자릿수 합이 9의 배수면 돼요. 234: 합 9 → <b>9의 배수</b>도!',
          en:'Digit sum of 234: 2+3+4 = <b>9</b>. 9 is a multiple of 3 → 234 is a <b>multiple of 3</b>! 231: 2+3+1=6 → multiple of 3. 233: 2+3+3=8 → not. <b>Rule for 9</b>: digit sum must be a multiple of 9. 234: sum=9 → also a <b>multiple of 9</b>!',
          zh:'234的数字和：2+3+4=<b>9</b>。9是3的倍数→234也是<b>3的倍数</b>！231：2+3+1=6→是3的倍数。233：2+3+3=8→不是。<b>9的倍数</b>更严：数字和是9的倍数。234：和=9→也是<b>9的倍数</b>！'},
        mathSteps:['234: 2+3+4 = 9',{ko:'9 ÷ 3 = 3 → 3의 배수 ✓',en:'9 ÷ 3 = 3 → \\text{multiple of 3} ✓',zh:'9 ÷ 3 = 3 → 3的倍数 ✓'},{ko:'9 ÷ 9 = 1 → 9의 배수 ✓',en:'9 ÷ 9 = 1 → \\text{multiple of 9} ✓',zh:'9 ÷ 9 = 1 → 9的倍数 ✓'}],
        result:{ko:'자릿수 합이 3의 배수 → 3의 배수! 9의 배수 → 9의 배수!',en:'Digit sum divisible by 3 → multiple of 3! By 9 → multiple of 9!',zh:'数字和能被3整除→是3的倍数！能被9整除→是9的倍数！'},
        book:null },
      { tag:{ko:'③ 6의 배수',en:'3) Multiples of 6',zh:'③ 6的倍数'},
        head:{ko:'2의 배수 + 3의 배수 = 6의 배수!',en:'Multiple of 2 AND 3 = multiple of 6!',zh:'既是2的倍数又是3的倍数＝6的倍数！'},
        desc:{ko:'6 = 2 × 3이니까, <b>2의 배수이면서 3의 배수</b>인 수는 6의 배수예요! 312: 끝자리 2(→2의 배수✓), 3+1+2=6(→3의 배수✓) → <b>6의 배수</b>! 314: 끝자리 4(→2의 배수✓), 3+1+4=8(→3의 배수✗) → 6의 배수 아님. 두 조건 모두 확인!',
          en:'6 = 2 × 3, so a number divisible by <b>both 2 and 3</b> is divisible by 6! 312: ends in 2 (✓), 3+1+2=6 (✓) → <b>divisible by 6</b>! 314: ends in 4 (✓), 3+1+4=8 (✗) → not divisible by 6. Check both!',
          zh:'因为6=2×3，所以<b>既能被2整除又能被3整除</b>的数就能被6整除！312：末位2(✓)，3+1+2=6(✓)→<b>6的倍数</b>！314：末位4(✓)，3+1+4=8(✗)→不是6的倍数。两条都要满足！'},
        mathSteps:[{ko:'312: 끝자리 2 → 2의 배수 ✓',en:'312: \\text{ends in 2 → multiple of 2} ✓',zh:'312：末位2 → 2的倍数 ✓'},{ko:'3+1+2=6 → 3의 배수 ✓',en:'3+1+2=6 → \\text{multiple of 3} ✓',zh:'3+1+2=6 → 3的倍数 ✓'},{ko:'→ 6의 배수!',en:'→ \\text{multiple of 6!}',zh:'→ 6的倍数！'}],
        result:{ko:'6의 배수 = 끝자리 짝수 AND 자릿수 합이 3의 배수!',en:'Multiple of 6 = even last digit AND digit sum divisible by 3!',zh:'6的倍数＝末位偶数 且 数字和是3的倍数！'},
        book:null }
    ],
    rule:{ ko:'① 2: 끝 짝수 / 5: 끝 0,5 / 10: 끝 0 ② 3: 자릿수 합이 3의 배수 ③ 6: ①+②',
      en:'① ×2: even end / ×5: ends 0,5 / ×10: ends 0 ② ×3: digit sum ÷3 ③ ×6: ①+②',
      zh:'① 2：末位偶数 / 5：末位0或5 / 10：末位0 ② 3：数字和÷3 ③ 6：①+②' }
  },
  check:{
    fills:[
      { tex:'2+3+4 = \\square', answer:9,
        hint:{ ko:'234의 자릿수 합 — 9이면 3의 배수이면서 9의 배수!', en:'Digit sum of 234 — 9 means multiple of both 3 and 9!', zh:'234的数字和——9既是3的倍数也是9的倍数！' } },
      { tex:'1+5+3 = \\square', answer:9,
        hint:{ ko:'153의 자릿수 합도 9 → 3과 9의 배수!', en:'Digit sum of 153 is also 9 → multiple of 3 and 9!', zh:'153的数字和也是9→是3和9的倍数！' } }
    ],
    open:{ ko:'258은 2의 배수인가요? 3의 배수인가요? 6의 배수인가요? 이유를 설명해 보세요.',
      en:'Is 258 a multiple of 2? Of 3? Of 6? Explain why.',
      zh:'258是2的倍数吗？是3的倍数吗？是6的倍数吗？说说理由。' },
    openHint:{ ko:'끝자리 8(짝수)→2의 배수✓, 2+5+8=15(3의 배수)→3의 배수✓, 둘 다→6의 배수!',
      en:'Last digit 8 (even) → ×2✓; 2+5+8=15 (÷3) → ×3✓; both → ×6!',
      zh:'末位8(偶数)→2的倍数✓；2+5+8=15(÷3)→3的倍数✓；两者都满足→6的倍数！' }
  },
  lab:{ generator:'dv6_divisibility', level:'main', count:4, params:{ rules:[3,6,9] },
    intro:{ ko:'이번엔 3·6·9 배수 문제! 자릿수 합 규칙을 써봐요.',
      en:'Now 3, 6, and 9 multiples! Use the digit-sum rule.',
      zh:'现在是3·6·9的倍数题！用数字和规律解题。' } },
  arena:{ generator:'dv6_divisibility', level:'main', count:8, timeLimit:300, params:{ mode:'digitSum' },
    rule:{ ko:'5분 안에 배수 판정 문제를 모두 풀어요!', en:'Solve all divisibility problems in 5 minutes!', zh:'5分钟内解答所有整除题！' } },
  stamp:{ label:{ ko:'배수 판정사', en:'Divisibility Detective', zh:'整除侦探' }, coins:30 },
  voice: voice('완벽해! 배수 판정사! 🔍','Perfect! Divisibility Detective!','完美！整除侦探！')
};

/* ─────────────────────────────────────────────
   T-DC1 · 소수 알기 (초4-2 교과)
───────────────────────────────────────────── */
window.NM_UNITS['T-DC1'] = {
  id:'T-DC1', tier:'bridge', level:'T', order:112,
  generator:'dc0_intro', edu:'4-2',
  title:{ ko:'소수 알기', en:'Meet Decimals', zh:'认识小数' },
  subtitle:{ ko:'1을 10칸으로 나눈 한 칸 = 0.1', en:'One of ten equal parts of 1 = 0.1', zh:'把1分成10份中的1份＝0.1' },
  icon:'💧',
  practice:{ generator:'dc0_intro', level:'practice', count:5, params:{},
    intro:{ ko:'1보다 작은 수를 쓰는 새 방법, 소수! 0.1부터 만나보자.',
      en:'A new way to write numbers smaller than 1 — decimals! Meet 0.1.',
      zh:'表示比1小的数的新方法——小数！先认识0.1。' } },
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 물병 이야기',en:'1) Water bottle story',zh:'① 水瓶的故事'},
        head:{ko:'1리터 물병에 눈금이 10칸!',en:'A 1-liter bottle with 10 marks!',zh:'1升水瓶上有10个刻度！'},
        desc:{ko:'1리터 물병에 눈금이 <b>10칸</b> 있어요. 물이 3칸까지 있으면 몇 리터일까요? 1리터를 10으로 나눈 한 칸은 <b>0.1리터</b> — 그래서 3칸은 <b>0.3리터</b>! 점(.)을 <b>소수점</b>이라 하고, 0.1은 분수 1/10과 같은 수예요.',
          en:'A 1-liter bottle has <b>10 marks</b>. Water up to mark 3 — how much? One tenth of a liter is <b>0.1 L</b>, so three marks is <b>0.3 L</b>! The dot is the <b>decimal point</b>, and 0.1 equals the fraction 1/10.',
          zh:'1升的水瓶有<b>10个刻度</b>。水到第3格是多少？1升的十分之一是<b>0.1升</b>，所以3格是<b>0.3升</b>！那个点叫<b>小数点</b>，0.1和分数1/10是同一个数。'},
        mathSteps:[{ko:'1L를 10칸으로',en:'\\text{1 L into 10 parts}',zh:'1L分成10格'},{ko:'한 칸 = 0.1 = \\dfrac{1}{10}',en:'\\text{one part} = 0.1 = \\dfrac{1}{10}',zh:'\\text{一格} = 0.1 = \\dfrac{1}{10}'},{ko:'3칸 = 0.3',en:'\\text{3 parts} = 0.3',zh:'3格 = 0.3'}],
        result:{ko:'0.1은 "1의 10분의 1" — 분수의 사촌이에요!',en:'0.1 is one tenth of 1 — a cousin of fractions!',zh:'0.1是1的十分之一——分数的表亲！'},
        book:{ko:'왜 소수를 쓸까요? 키 1.3m, 몸무게 32.5kg처럼 "사이의 값"을 편하게 쓰려고!',en:'Why decimals? To write in-between values easily: height 1.3 m, weight 32.5 kg!',zh:'为什么用小数？为了方便写"中间值"：身高1.3米、体重32.5千克！'} },
      { tag:{ko:'② 0.1을 세어요',en:'2) Counting 0.1s',zh:'② 数0.1'},
        head:{ko:'0.1이 12개면? 1.2!',en:'Twelve 0.1s? 1.2!',zh:'12个0.1？是1.2！'},
        desc:{ko:'0.1을 세어 볼까요? 7개면 0.7. <b>10개면 꽉 차서 1</b>! 12개면 1하고 0.2 남으니 <b>1.2</b>예요. "10개가 모이면 윗자리로" — 일·십·백에서 쓰던 규칙이 소수점 아래에서도 똑같이 통해요!',
          en:'Count 0.1s: seven make 0.7. <b>Ten fill up to exactly 1</b>! Twelve make 1 and 0.2 more: <b>1.2</b>. "Ten of these make the next place" — the same rule from ones/tens/hundreds works below the decimal point!',
          zh:'数一数0.1：7个是0.7。<b>10个正好凑成1</b>！12个就是1再加0.2：<b>1.2</b>。"满十进一"——个十百的规则在小数点下面照样适用！'},
        mathSteps:['0.1 × 7 = 0.7','0.1 × 10 = 1','0.1 × 12 = 1.2'],
        result:{ko:'소수도 10개 모이면 한 자리 올라가요!',en:'Decimals carry up in tens too!',zh:'小数也是满十进一！'},
        book:null },
      { tag:{ko:'③ 소수의 자리',en:'3) Decimal places',zh:'③ 小数的数位'},
        head:{ko:'소수점 오른쪽 첫째 자리 = 십분의 자리',en:'First place right of the point = tenths',zh:'小数点右边第一位＝十分位'},
        desc:{ko:'3.7에서 3은 <b>일의 자리</b>(소수점 왼쪽), 7은 <b>소수 첫째 자리</b>(=십분의 자리)예요. 자리 이름표가 있으니 아무리 긴 소수도 읽을 수 있어요. 크기 비교도 자리부터: 0.9와 1.2는 일의 자리 0<1이니 1.2가 커요!',
          en:'In 3.7, the 3 is in the <b>ones place</b> (left of the point) and 7 in the <b>tenths place</b>. With place labels you can read any decimal. Compare by place too: 0.9 vs 1.2 — ones digits 0<1, so 1.2 wins!',
          zh:'3.7里，3在<b>个位</b>(小数点左边)，7在<b>十分位</b>。有了数位名称，多长的小数都能读。比大小也看数位：0.9和1.2，个位0<1，所以1.2大！'},
        mathSteps:['3.7',{ko:'3 = 일의 자리, 7 = 십분의 자리',en:'3 = \\text{ones, } 7 = \\text{tenths}',zh:'3 = 个位，7 = 十分位'},{ko:'0.9 < 1.2 (일의 자리 비교)',en:'0.9 < 1.2 \\text{ (compare the ones)}',zh:'0.9 < 1.2（比个位）'}],
        result:{ko:'자릿값 마법이 소수점 아래로 이어져요!',en:'Place-value magic continues below the point!',zh:'数位魔法延伸到小数点下面！'},
        book:null }
    ],
    rule:{ ko:'① 0.1 = 1을 10으로 나눈 것 = 1/10 ② 0.1이 10개면 1 ③ 소수점 오른쪽 첫째 = 십분의 자리',
      en:'① 0.1 = 1 split into 10 = 1/10 ② Ten 0.1s make 1 ③ First place right of the point = tenths',
      zh:'① 0.1=1分成10份=1/10 ② 10个0.1是1 ③ 小数点右第一位=十分位' }
  },
  check:{
    fills:[
      { tex:'0.1 \\times 4 = \\square', answer:0.4,
        hint:{ ko:'0.1이 4칸 — 소수점 키를 써요!', en:'Four tenths — use the decimal-point key!', zh:'4个0.1——用小数点键！' } },
      { tex:{ko:'5.8 \\;\\rightarrow\\; \\text{소수 첫째 자리} = \\square',en:'5.8 \\;\\rightarrow\\; \\text{tenths digit} = \\square',zh:'5.8 \\;\\rightarrow\\; \\text{十分位} = \\square'}, answer:8,
        hint:{ ko:'소수점 바로 오른쪽 숫자', en:'The digit just right of the point', zh:'小数点右边的那个数字' } }
    ],
    open:{ ko:'생활에서 소수를 본 곳을 하나 떠올려 써 봐요.',
      en:'Recall one place you saw decimals in real life.',
      zh:'想一想生活中哪里见过小数，写下来。' },
    openHint:{ ko:'예) 체온 36.5도, 달리기 기록 9.58초, 음료수 1.5리터!',
      en:'e.g. Body temp 36.5°, sprint record 9.58 s, a 1.5 L drink!',
      zh:'例）体温36.5度、百米纪录9.58秒、饮料1.5升！' }
  },
  lab:{ generator:'dc0_intro', level:'main', count:4, params:{},
    intro:{ ko:'0.1 세기, 자리 찾기, 분수 변신까지 골고루!',
      en:'Counting tenths, naming places, converting fractions — all mixed!',
      zh:'数0.1、找数位、分数变身——混合练习！' } },
  arena:{ generator:'dc0_intro', level:'main', count:8, timeLimit:240, params:{},
    rule:{ ko:'4분 안에 소수 문제를 모두 풀어요!', en:'Solve all decimal problems in 4 minutes!', zh:'4分钟内解答所有小数题！' } },
  stamp:{ label:{ ko:'소수점 발견자', en:'Decimal Point Discoverer', zh:'小数点发现者' }, coins:24 },
  voice: voice('완벽해! 소수점 발견자! 💧','Perfect! Decimal Point Discoverer!','完美！小数点发现者！')
};

/* ─────────────────────────────────────────────
   T-MX1 · 혼합 계산 (초5-1 교과)
───────────────────────────────────────────── */
window.NM_UNITS['T-MX1'] = {
  id:'T-MX1', tier:'bridge', level:'T', order:111,
  generator:'mx1_orderOps', edu:'5-1',
  title:{ ko:'혼합 계산의 규칙', en:'Order of Operations', zh:'混合运算的规则' },
  subtitle:{ ko:'곱셈 먼저! 계산 순서의 교통 신호', en:'Multiply first! Traffic lights for calculation', zh:'先乘除！计算顺序的红绿灯' },
  icon:'🚦',
  practice:{ generator:'mx1_orderOps', level:'practice', count:4, params:{ brackets:0 },
    intro:{ ko:'덧셈과 곱셈이 한 식에 있으면 누가 먼저일까? 규칙을 배우자!',
      en:'Addition and multiplication in one line — who goes first? Learn the rule!',
      zh:'加法和乘法在一个算式里——谁先算？来学规则！' } },
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 문방구 이야기',en:'1) Stationery story',zh:'① 文具店的故事'},
        head:{ko:'지우개 300원 + 연필 200원×3자루',en:'One 300-won eraser + three 200-won pencils',zh:'一块300元橡皮＋三支200元铅笔'},
        desc:{ko:'지우개 <b>300원</b> 1개와 <b>200원</b>짜리 연필 <b>3자루</b>를 샀어요. 식은 300+200×3. 왼쪽부터 계산하면 500×3=1500원?! 이상해요 — 연필 3자루 값은 <b>200×3=600원</b>이니 300+600=<b>900원</b>이 맞죠. 그래서 규칙: <b>곱셈을 덧셈보다 먼저</b>!',
          en:'You buy one <b>300-won</b> eraser and three <b>200-won</b> pencils: 300+200×3. Left to right gives 500×3=1500?! Wrong — the pencils cost <b>200×3=600</b>, so it\'s 300+600=<b>900</b>. Hence the rule: <b>multiplication before addition</b>!',
          zh:'买一块<b>300元</b>橡皮和三支<b>200元</b>铅笔：300+200×3。从左往右算是500×3=1500？！不对——铅笔是<b>200×3=600元</b>，所以是300+600=<b>900元</b>。规则由此而来：<b>先乘后加</b>！'},
        mathSteps:['300 + 200×3',{ko:'200×3 = 600 (먼저!)',en:'200×3 = 600 \\text{ (first!)}',zh:'200×3 = 600（先算！）'},'300 + 600 = 900'],
        result:{ko:'곱셈 먼저는 멋이 아니라 이야기가 시키는 것!',en:'Multiply-first is not style — the story demands it!',zh:'先乘不是耍帅——是题目的要求！'},
        book:{ko:'곱셈은 "묶음"이라 하나의 덩어리예요. 덩어리부터 계산하는 게 순서!',en:'A product is one bundle — compute bundles first!',zh:'乘法是"一捆"，先把捆算出来！'} },
      { tag:{ko:'② 신호등 규칙',en:'2) The traffic rule',zh:'② 红绿灯规则'},
        head:{ko:'×÷ 먼저, +− 나중, 같은 급은 왼쪽부터',en:'×÷ first, +− later; equals go left to right',zh:'先×÷后+−，同级从左到右'},
        desc:{ko:'계산 순서 신호등: ①<b>곱셈·나눗셈</b>이 파란불(먼저) ②<b>덧셈·뺄셈</b>은 빨간불(나중) ③같은 급끼리는 <b>왼쪽부터</b> 차례로. 4×6+2×5라면 두 곱을 각각 먼저: 24+10=34!',
          en:'Traffic lights of calculation: ① <b>× and ÷</b> get the green light (first) ② <b>+ and −</b> wait (later) ③ same level goes <b>left to right</b>. For 4×6+2×5, do both products first: 24+10=34!',
          zh:'计算的红绿灯：①<b>乘除</b>是绿灯(先) ②<b>加减</b>是红灯(后) ③同级<b>从左到右</b>。4×6+2×5就先算两个积：24+10=34！'},
        mathSteps:['4×6 + 2×5','24 + 10','= 34'],
        result:{ko:'신호만 지키면 아무리 긴 식도 안전 운전!',en:'Follow the lights and any long expression is safe driving!',zh:'守住信号灯，多长的算式都安全！'},
        book:null },
      { tag:{ko:'③ 밑줄 습관',en:'3) The underline habit',zh:'③ 画线的习惯'},
        head:{ko:'먼저 할 곳에 밑줄부터 긋기!',en:'Underline what to do first!',zh:'先给要先算的地方画线！'},
        desc:{ko:'긴 식을 만나면 계산 전에 <b>곱셈·나눗셈 부분에 밑줄</b>을 그어요. 7+<u>3×6</u>−2라면 밑줄 친 18을 먼저 구하고, 남은 7+18−2는 왼쪽부터: 25−2=23. 밑줄 습관은 실수를 반으로 줄여요!',
          en:'Before computing a long expression, <b>underline the × and ÷ parts</b>. In 7+<u>3×6</u>−2, compute the underlined 18 first, then go left to right: 7+18−2 → 25−2=23. The underline habit halves mistakes!',
          zh:'遇到长算式，先给<b>乘除部分画线</b>。7+<u>3×6</u>−2就先算画线的18，再从左到右：7+18−2→25−2=23。画线习惯让错误减半！'},
        mathSteps:['7 + 3×6 - 2','7 + 18 - 2','25 - 2 = 23'],
        result:{ko:'밑줄 → 계산 → 왼쪽부터. 삼박자 완성!',en:'Underline → compute → left to right. Three beats!',zh:'画线→计算→从左到右。三步完成！'},
        book:null }
    ],
    rule:{ ko:'① 곱셈·나눗셈 먼저 ② 덧셈·뺄셈 나중 ③ 같은 급은 왼쪽부터 ④ 먼저 할 곳에 밑줄!',
      en:'① × and ÷ first ② + and − later ③ Same level: left to right ④ Underline what comes first!',
      zh:'① 先乘除 ② 后加减 ③ 同级从左到右 ④ 先算的画线！' }
  },
  check:{
    fills:[
      { tex:'2 + 3 \\times 4 = \\square', answer:14,
        hint:{ ko:'3×4 먼저!', en:'3×4 first!', zh:'先算3×4！' } },
      { tex:'5 \\times 2 + 6 = \\square', answer:16,
        hint:{ ko:'5×2 먼저, 그다음 +6', en:'5×2 first, then +6', zh:'先5×2，再+6' } }
    ],
    open:{ ko:'2+3×4를 왼쪽부터 계산하면 왜 틀리는지 이야기로 설명해 봐요.',
      en:'Using a story, explain why computing 2+3×4 left-to-right goes wrong.',
      zh:'用一个故事解释为什么2+3×4从左往右算会错。' },
    openHint:{ ko:'예) 사탕 2개에 3개들이 봉지 4개를 더 받으면 2+12=14개. 왼쪽부터 하면 5봉지×4=20이 되어 이야기와 달라져요!',
      en:'e.g. 2 candies plus 4 bags of 3: 2+12=14. Left-to-right gives (2+3)×4=20 — not what the story says!',
      zh:'例）2颗糖加4袋每袋3颗：2+12=14颗。从左往右变成(2+3)×4=20——和故事不符！' }
  },
  lab:{ generator:'mx1_orderOps', level:'main', count:4, params:{ brackets:0 },
    intro:{ ko:'단계별로 순서를 지켜 계산하자! 밑줄 먼저.',
      en:'Compute in order, step by step — underline first!',
      zh:'按顺序一步步算——先画线！' } },
  arena:{ generator:'mx1_orderOps', level:'main', count:8, timeLimit:300, params:{ brackets:0 },
    rule:{ ko:'5분 안에 혼합 계산을 모두 풀어요! 곱셈 먼저!', en:'Solve all mixed expressions in 5 minutes — multiply first!', zh:'5分钟内解答所有混合运算——先乘！' } },
  stamp:{ label:{ ko:'계산 순서 지휘자', en:'Order Conductor', zh:'运算顺序指挥家' }, coins:28 },
  voice: voice('완벽해! 계산 순서 지휘자! 🚦','Perfect! Order Conductor!','完美！运算顺序指挥家！')
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
