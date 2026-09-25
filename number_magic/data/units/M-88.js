/* Numbers of Magic — 유닛 M-88: 경우의 수 (중등 W9-5 · 중2 비기하 연산)
   근거: 디딤돌수학 개념연산 중2-2 인쇄 p.216~230.
   p.232 이후와 확률은 포함하지 않는다. */
(function(){
'use strict';
window.NM_UNITS=window.NM_UNITS||{};

window.NM_UNITS['M-88']={
  id:'M-88',tier:'middle2',level:'34',order:6,
  generator:'md88_countingCases',
  title:{ko:'경우의 수',en:'Counting Possibilities',zh:'情况数'},
  subtitle:{ko:'빠짐없이·겹치지 않게 세고, 또는이면 더하고 동시에 거치면 곱합니다',en:'Count without omissions or overlaps; add for either, multiply for both stages',zh:'不重不漏地数；“或”用加法，两步都要经过用乘法'},
  icon:'⋮',

  practice:{
    generator:'md88_countingCases',level:'practice',count:12,params:{mode:'eventCount'},
    intro:{ko:'가능한 결과를 먼저 직접 세어 봅니다. 조건에 맞는 결과만 한 번씩 세었는지 확인하세요.',en:'First count the possible results directly. Check that each valid result was counted once.',zh:'先直接数可能的结果，并确认每个符合条件的结果只数一次。'}
  },

  discover:{
    title:{ko:'누미의 경우의 수 노트',en:"Numi's Counting Note",zh:'努米的情况数笔记'},
    story:{
      hook:{ko:'버스 3가지 또는 지하철 2가지 중 하나만 고르면 3+2. 상의 3가지와 하의 2가지를 하나씩 고르면 3×2. 같은 숫자라도 상황의 연결 말이 계산을 바꿉니다.',en:'Choose one of 3 buses or 2 subway lines: 3+2. Choose one of 3 tops and one of 2 bottoms: 3×2. The connection word changes the operation.',zh:'3种公交或2种地铁中只选一个是3+2；3件上衣和2条下装各选一件是3×2。连接关系决定运算。'},
      history:{ko:'경우의 수에서는 계산보다 먼저 겹침을 판단합니다. 서로 겹치지 않는 갈래 중 하나를 고르면 더하고, 첫 선택마다 둘째 선택이 모두 이어지면 곱합니다. 줄 세우기는 앞자리부터 선택지가 하나씩 줄어드는 곱셈법칙입니다.',en:'Before calculating, decide whether cases overlap. Add non-overlapping alternatives, multiply stages that must both occur, and treat a lineup as choices decreasing one position at a time.',zh:'计算前先判断情况是否重叠。互不重叠的选择相加，必须依次完成的步骤相乘；排队则是每填一个位置，选择数减少一个。'}
    },
    stages:[
      {tag:{ko:'① 또는 — 겹치지 않으면 더하기',en:'1) Either — add when disjoint',zh:'① 或——互斥时相加'},head:{ko:'3+2=5',en:'3+2=5',zh:'3+2=5'},
       desc:{ko:'A 또는 B 중 하나만 고르고 두 갈래가 겹치지 않으면 A의 경우와 B의 경우를 이어 붙입니다.',en:'When exactly one of A or B is chosen and the groups do not overlap, join the two counts by addition.',zh:'A或B中只选一个且两类不重叠时，把两类情况数相加。'},
       mathSteps:[{ko:'A\\text{의 수}=3',en:'\\text{number of A}=3',zh:'A\\text{的情况数}=3'},{ko:'B\\text{의 수}=2',en:'\\text{number of B}=2',zh:'B\\text{的情况数}=2'},'3+2=5'],result:{ko:'배타적인 A 또는 B는 덧셈법칙',en:'Exclusive A or B uses addition',zh:'互斥的A或B用加法'},
       book:{ko:'동시에 A와 B가 될 수 있는 경우가 있으면 단순히 더할 수 없습니다. 이 유닛에서는 원본 p.220~223의 서로 겹치지 않는 경우만 다룹니다.',en:'If a result can belong to both A and B, simple addition is not valid. This unit only covers the disjoint cases evidenced on pp.220–223.',zh:'若某结果可同时属于A和B，就不能直接相加。本单元只学习原书220~223页有依据的互斥情况。'}},
      {tag:{ko:'② 그리고 — 두 단계를 모두 거치면 곱하기',en:'2) And — multiply consecutive stages',zh:'② 并且——两个步骤都经过时相乘'},head:{ko:'3\\times2=6',en:'3\\times2=6',zh:'3\\times2=6'},
       desc:{ko:'첫 단계의 각 선택마다 둘째 단계 선택이 모두 붙으면 같은 묶음이 첫 단계 수만큼 반복됩니다.',en:'If every first-stage choice can be followed by every second-stage choice, the second-stage bundle repeats for each first choice.',zh:'若第一步的每个选择都能接上第二步的全部选择，第二步的一组选择会按第一步的种数重复。'},
       mathSteps:[{ko:'3\\text{가지 각각에}',en:'\\text{for each of 3 choices}',zh:'\\text{对3种选择中的每一种}'},{ko:'2\\text{가지씩}',en:'2\\text{ choices}',zh:'2\\text{种选择}'},'3\\times2=6'],result:{ko:'A 다음 B는 곱셈법칙',en:'A followed by B uses multiplication',zh:'A之后再B用乘法'},
       book:{ko:'경로도 같습니다. A→B 길 3개와 B→C 길 2개를 모두 거치면 3×2입니다.',en:'Routes work the same way: 3 A-to-B routes followed by 2 B-to-C routes give 3×2.',zh:'路线也相同：A到B有3条，B到C有2条，必须都经过就是3×2。'}},
      {tag:{ko:'③ 줄 세우기 — 고정한 뒤 남은 자리만',en:'3) Lineups — fix first, then fill the rest',zh:'③ 排队——先固定，再排剩余位置'},head:{ko:'A\\text{ 고정}: 1\\times3\\times2\\times1=6',en:'A fixed: 1\\times3\\times2\\times1=6',zh:'固定A：1\\times3\\times2\\times1=6'},
       desc:{ko:'서로 다른 4명 중 A가 첫째 자리로 고정되면 실제로 선택해야 하는 사람은 3명뿐입니다. 남은 세 자리를 3×2×1로 채웁니다.',en:'With A fixed first among 4 distinct people, only 3 people remain to choose. Fill the remaining seats in 3×2×1 ways.',zh:'4名不同学生中A固定在第一位后，只剩3人需要安排，剩余位置有3×2×1种排法。'},
       mathSteps:[{ko:'A\\text{를 먼저 고정}',en:'\\text{fix A first}',zh:'\\text{先固定A}'},'3\\times2\\times1','=6'],result:{ko:'고정 자리는 경우의 수에서 빼고 남은 자리만 곱합니다',en:'Remove fixed positions, then multiply choices for the remaining seats',zh:'固定位置先去掉，只乘剩余位置的选择数'},
       book:{ko:'A와 B가 양 끝에 서되 누가 왼쪽인지 정하지 않았다면 끝 배치가 AB, BA 두 가지라 2를 더 곱합니다.',en:'If A and B occupy the ends but left and right are not assigned, the two end orders AB and BA add a factor of 2.',zh:'若A、B站两端但未指定左右，则端点有AB、BA两种，要再乘2。'}}
    ],
    rule:{ko:'① 한 사건은 결과를 직접 센다  ② 겹치지 않는 A 또는 B는 더한다  ③ A 다음 B를 모두 거치면 곱한다  ④ 줄 세우기는 앞자리부터 선택지가 하나씩 준다  ⑤ 고정 자리를 먼저 놓고 남은 자리만 센다',en:'① Count one event directly  ② Add disjoint A or B  ③ Multiply consecutive A then B  ④ Lineup choices decrease by one  ⑤ Place fixed seats first',zh:'① 直接数一个事件  ② 互斥的A或B相加  ③ 依次完成A再B时相乘  ④ 排队时选择数逐位减一  ⑤ 先固定指定位置'}
  },

  check:{
    fills:[
      {tex:{ko:'\\text{A가 4가지, B가 7가지이고 둘 중 하나만 선택}:\\quad4+7=\\square',en:'\\text{Choose one of 4 A choices or 7 B choices}:\\quad4+7=\\square',zh:'\\text{A有4种，B有7种，只选其中一类}:\\quad4+7=\\square'},answer:[11],hint:{ko:'겹치지 않는 또는 → 더합니다.',en:'Disjoint either → add.',zh:'互斥的“或”→相加。'}},
      {tex:{ko:'\\text{첫 단계 4가지, 둘째 단계 7가지}:\\quad4\\times7=\\square',en:'\\text{4 first-stage choices and 7 second-stage choices}:\\quad4\\times7=\\square',zh:'\\text{第一步4种，第二步7种}:\\quad4\\times7=\\square'},answer:[28],hint:{ko:'두 단계를 모두 거침 → 곱합니다.',en:'Both stages → multiply.',zh:'两个步骤都经过→相乘。'}}
    ],
    open:{ko:'서로 다른 5명 중 A가 맨 앞에 설 때 왜 4×3×2×1인지 설명합니다.',en:'Explain why fixing A first among 5 people gives 4×3×2×1.',zh:'说明5人中A固定在最前面时为什么是4×3×2×1。'},
    openHint:{ko:'A를 놓고 나면 4명과 4자리만 남습니다.',en:'After placing A, 4 people and 4 seats remain.',zh:'放好A后只剩4人和4个位置。'}
  },

  lab:{generator:'md88_countingCases',level:'main',count:12,params:{mode:'either'},intro:{ko:'겹치지 않는 두 갈래 중 하나를 고릅니다. 두 수를 더하세요.',en:'Choose one of two disjoint branches. Add the counts.',zh:'从两个互斥分支中选一个，把两数相加。'}},
  arena:{generator:'md88_countingCases',level:'main',count:24,timeLimit:720,params:{mode:'fixedSeat'},rule:{ko:'12분 동안 고정 자리를 먼저 지운 뒤 남은 자리의 곱을 계산합니다.',en:'In 12 minutes, place the fixed seats first and multiply the remaining choices.',zh:'12分钟内先固定指定位置，再计算剩余位置的乘积。'}},
  stamp:{label:{ko:'경우의 수 설계자',en:'Counting Designer',zh:'情况数设计师'},coins:50},
  voice:{
    correct:[{ko:'빠짐없이 셌어! ✨',en:'Counted without omissions!',zh:'一个不漏！'},{ko:'더할지 곱할지 정확해!',en:'You chose add or multiply correctly!',zh:'加法还是乘法，判断准确！'}],
    wrong:[{ko:'둘 중 하나만 고르니, 두 단계를 모두 거치니?',en:'Is it exactly one branch, or both stages?',zh:'是二选一，还是两个步骤都要经过？'},{ko:'고정된 자리를 먼저 표시하고 남은 자리만 세어 봐!',en:'Mark fixed seats first, then count only the rest!',zh:'先标出固定位置，再数剩余位置！'}],
    finish:{ko:'완벽해! 경우의 수 설계자! ⋮✨',en:'Perfect! Counting Designer!',zh:'完美！情况数设计师！'}
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
