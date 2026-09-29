/* Numbers of Magic — 유닛 M-137: 지수함수의 최대·최소 (고등 대수 · 과정 62 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD137. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-137'] = {
  id:'M-137', tier:'algebra', level:'62', order:137,
  generator:'md137_expMaxMin',
  title:{ ko:'지수함수의 최대·최소', en:'Maxima & Minima of Exponential Functions', zh:'指数函数的最大值与最小值' },
  subtitle:{ ko:'양 끝을 보거나, t 로 바꾸어 보거나', en:'Look at the ends, or change to t', zh:'看两端，或换成t' },
  icon:'⛰️',

  practice:{
    generator:'md137_expMaxMin', level:'practice', count:6,
    params:{mode:'range'},
    intro:{
      ko:'지수함수는 한 방향으로만 움직이므로 닫힌 범위의 양 끝에서 함숫값을 구하면 최댓값 M 과 최솟값 m 이 나옵니다.',
      en:'An exponential function moves in one direction only, so evaluating at both ends of the closed interval gives the greatest value M and the least value m.',
      zh:'指数函数只朝一个方向变化，求出闭区间两端的函数值就得到最大值M与最小值m。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'y=2ˣ 은 오르막만 있는 길입니다. 그래서 가장 높은 곳과 가장 낮은 곳은 길의 양 끝에 있습니다. 그런데 4ˣ 과 2ˣ 이 섞이면 길에 골짜기가 생깁니다.',
        en:'y=2ˣ is a road that only goes uphill, so its highest and lowest points are at the two ends. But when 4ˣ and 2ˣ are mixed, a valley appears.',
        zh:'y=2ˣ是一条只有上坡的路，所以最高点和最低点在路的两端。可是4ˣ与2ˣ混在一起时，路上就出现了山谷。' }
    },
    stages:[
      { tag:{ko:'① 양 끝에서',en:'1) At the ends',zh:'① 在两端'},
        head:{ko:'y=2^{x}+1\\ (0\\le x\\le 3):\\ M=9,\\ m=2',en:'y=2^{x}+1\\ (0\\le x\\le 3):\\ M=9,\\ m=2',zh:'y=2^{x}+1\\ (0\\le x\\le 3):\\ M=9,\\ m=2'},
        desc:{ko:'밑 2 가 1 보다 크므로 증가합니다. x=3 에서 M=2³+1=<b>9</b>, x=0 에서 m=2⁰+1=<b>2</b> 입니다.',
              en:'Base 2 is greater than 1, so it increases: M=2³+1=<b>9</b> at x=3 and m=2⁰+1=<b>2</b> at x=0.',
              zh:'底数2大于1，函数递增：x=3时M=2³+1=<b>9</b>，x=0时m=2⁰+1=<b>2</b>。'},
        mathSteps:['x=3:\\ 2^{3}+1=9','x=0:\\ 2^{0}+1=2'],
        result:{ko:'증가하면 오른쪽 끝이 M!',en:'Increasing: the right end gives M!',zh:'递增时右端是M！'},
        book:{ko:'y=(1/2)ˣ 처럼 밑이 1 보다 작으면 감소하므로 왼쪽 끝이 M 이 됩니다.',
              en:'With a base below 1, as in y=(1/2)ˣ, the function decreases, so the left end gives M.',
              zh:'像y=(1/2)ˣ这样底数小于1时函数递减，左端是M。'} },

      { tag:{ko:'② t 로 바꾸기',en:'2) Changing to t',zh:'② 换成t'},
        head:{ko:'y=4^{x}-2^{x+2}+5\\ (0\\le x\\le 2)',en:'y=4^{x}-2^{x+2}+5\\ (0\\le x\\le 2)',zh:'y=4^{x}-2^{x+2}+5\\ (0\\le x\\le 2)'},
        desc:{ko:'2ˣ=t 로 놓으면 1≤t≤4 이고 y=t²−4t+5=(t−2)²+1 입니다. t=2 에서 m=<b>1</b>, 꼭짓점에서 먼 t=4 에서 M=<b>5</b> 입니다.',
              en:'Put 2ˣ=t: 1≤t≤4 and y=t²−4t+5=(t−2)²+1. At t=2, m=<b>1</b>; at t=4, farther from the vertex, M=<b>5</b>.',
              zh:'令2ˣ=t，则1≤t≤4，y=t²−4t+5=(t−2)²+1。t=2时m=<b>1</b>；离顶点较远的t=4时M=<b>5</b>。'},
        mathSteps:['t=2^{x}\\ (1\\le t\\le 4)','y=(t-2)^2+1'],
        result:{ko:'t 의 범위부터!',en:'Range of t first!',zh:'先求t的范围！'},
        book:{ko:'2ˣ⁺²=4×2ˣ 이므로 −2ˣ⁺² 은 −4t 가 됩니다.',
              en:'2ˣ⁺²=4×2ˣ, so −2ˣ⁺² becomes −4t.',
              zh:'2ˣ⁺²=4×2ˣ，所以−2ˣ⁺²变成−4t。'} },

      { tag:{ko:'③ 거꾸로 — 미정계수',en:'3) Backwards — unknowns',zh:'③ 反过来——待定系数'},
        head:{ko:'y=3^{x-1}+k\\ (1\\le x\\le 3),\\ M=10\\ \\Rightarrow\\ k=1',en:'y=3^{x-1}+k\\ (1\\le x\\le 3),\\ M=10\\ \\Rightarrow\\ k=1',zh:'y=3^{x-1}+k\\ (1\\le x\\le 3),\\ M=10\\ \\Rightarrow\\ k=1'},
        desc:{ko:'증가하므로 M 은 x=3 에서 나옵니다. 3²+k=10 이므로 k=<b>1</b> 입니다.',
              en:'It increases, so M occurs at x=3: 3²+k=10 gives k=<b>1</b>.',
              zh:'函数递增，M在x=3处取得：3²+k=10，所以k=<b>1</b>。'},
        mathSteps:['x=3:\\ 3^{2}+k=10','k=1'],
        result:{ko:'어느 끝인지 정하고 식 세우기!',en:'Pick the end, then set up the equation!',zh:'先定是哪一端，再列方程！'},
        book:{ko:'m 이 주어지면 반대쪽 끝, 곧 x=1 을 넣어 3⁰+k=m 을 풉니다.',
              en:'If m is given, use the other end, x=1, and solve 3⁰+k=m.',
              zh:'若给出m，就代入另一端x=1，解3⁰+k=m。'} }
    ],
    rule:{ ko:'① 밑>1 이면 오른쪽 끝이 M, 0<밑<1 이면 왼쪽 끝이 M  ② aˣ=t 로 놓고 t 의 범위부터  ③ 주어진 M·m 이 어디서 나오는지 정해 식 세우기',
      en:'① Base>1: right end gives M; 0<base<1: left end gives M  ② Put aˣ=t and find the range of t first  ③ Decide where the given M or m occurs, then set up the equation',
      zh:'① 底数>1时右端为M，0<底数<1时左端为M  ② 令aˣ=t，先求t的范围  ③ 确定所给M或m在何处取得再列方程' }
  },

  check:{
    fills:[
      { tex:{ko:'y=\\bigl(\\frac{1}{2}\\bigr)^{x}\\ (-3\\le x\\le 1)\\ \\Rightarrow\\ M=\\square',en:'y=\\bigl(\\frac{1}{2}\\bigr)^{x}\\ (-3\\le x\\le 1)\\ \\Rightarrow\\ M=\\square',zh:'y=\\bigl(\\frac{1}{2}\\bigr)^{x}\\ (-3\\le x\\le 1)\\ \\Rightarrow\\ M=\\square'}, answer:8,
        hint:{ ko:'감소 → x=−3', en:'decreasing → x=−3', zh:'递减 → x=−3' } },
      { tex:{ko:'y=9^{x}-6\\times3^{x}+10\\ (0\\le x\\le 1)\\ \\Rightarrow\\ m=\\square',en:'y=9^{x}-6\\times3^{x}+10\\ (0\\le x\\le 1)\\ \\Rightarrow\\ m=\\square',zh:'y=9^{x}-6\\times3^{x}+10\\ (0\\le x\\le 1)\\ \\Rightarrow\\ m=\\square'}, answer:1,
        hint:{ ko:'t=3ˣ, (t−3)²+1', en:'t=3ˣ, (t−3)²+1', zh:'t=3ˣ，(t−3)²+1' } }
    ],
    open:{ ko:'aˣ=t 로 바꿀 때 t 의 범위를 먼저 구해야 하는 까닭을 설명해 봅니다.',
      en:'Explain why you must find the range of t first when you put aˣ=t.',
      zh:'说说令aˣ=t时为什么要先求t的范围。' },
    openHint:{ ko:'t=aˣ 는 언제나 양수이고, x 의 범위에 따라 t 가 움직이는 범위가 정해집니다. 꼭짓점이 그 범위 밖이면 꼭짓점의 값은 최솟값이 될 수 없습니다.',
      en:'t=aˣ is always positive, and the range of x fixes where t can move. If the vertex is outside that range, its value cannot be the least value.',
      zh:'t=aˣ总是正数，x的范围决定t的变化范围。顶点在范围外时，顶点的值不能成为最小值。' }
  },

  lab:{
    generator:'md137_expMaxMin', level:'main', count:6,
    params:{mode:'quad'},
    intro:{
      ko:'bˣ=t 로 놓아 t 에 대한 이차함수로 바꾸고, t 의 범위에서 꼭짓점과 양 끝의 값을 비교합니다.',
      en:'Put bˣ=t to get a quadratic in t, then compare the vertex value and the end values over the range of t.',
      zh:'令bˣ=t化成关于t的二次函数，在t的范围内比较顶点与两端的值。'
    }
  },

  arena:{
    generator:'md137_expMaxMin', level:'main', count:6, timeLimit:420,
    params:{mode:'coef'},
    rule:{ ko:'7분 안에 최댓값·최솟값이 주어진 지수함수의 미정계수를 모두 구합니다!', en:'Find every unknown in exponential functions with given extreme values within 7 minutes!', zh:'7分钟内求出所有已知最值的指数函数的待定系数！' }
  },

  stamp:{ label:{ ko:'봉우리 측량사', en:'Peak Surveyor', zh:'山峰测量员' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'꼭대기와 골짜기를 찾았어! ⛰️',en:'Peak and valley found!',zh:'找到了山顶和山谷！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'밑이 1 보다 큰지 작은지 봐!',en:'Is the base above or below 1?',zh:'看看底数比1大还是小！'}, {ko:'t 의 범위를 먼저 구해 봐!',en:'Find the range of t first!',zh:'先求t的范围！'} ],
    finish:{ ko:'완벽해! 봉우리 측량사! ⛰️✨', en:'Perfect! Peak Surveyor!', zh:'完美！山峰测量员！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
