/* Numbers of Magic — 유닛 M-139: 로그함수의 최대·최소 (고등 대수 · 과정 60, 2026-09-29)
   근거: docs/high-build-spec.md MD139. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-139'] = {
  id:'M-139', tier:'algebra', level:'60', order:139,
  generator:'md139_logMaxMin',
  title:{ ko:'로그함수의 최대·최소', en:'Maxima & Minima of Logarithmic Functions', zh:'对数函数的最大值与最小值' },
  subtitle:{ ko:'양 끝, 치환, 그리고 진수 묶기', en:'Ends, substitution, and combining arguments', zh:'两端、换元与合并真数' },
  icon:'🎚️',

  practice:{
    generator:'md139_logMaxMin', level:'practice', count:6,
    params:{mode:'range'},
    intro:{
      ko:'로그함수도 한 방향으로만 움직이므로 닫힌 범위의 양 끝에서 함숫값을 구합니다. 밑이 1 보다 작으면 크기 관계가 뒤집힙니다.',
      en:'A logarithmic function also moves in one direction only, so evaluate at both ends of the closed interval. With a base below 1 the order flips.',
      zh:'对数函数也只朝一个方向变化，求出闭区间两端的函数值即可。底数小于1时大小关系会反过来。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'소리의 크기를 나타내는 데시벨처럼, 로그는 큰 범위를 작은 눈금으로 줄여 줍니다. 1 부터 8 까지의 x 가 log₂x 에서는 0 부터 3 까지로 줄어듭니다.',
        en:'Like decibels for loudness, logarithms squeeze a huge range into a small scale: x from 1 to 8 becomes log₂x from 0 to 3.',
        zh:'就像表示声音大小的分贝，对数把很大的范围压缩成小刻度：x从1到8，log₂x只从0到3。' }
    },
    stages:[
      { tag:{ko:'① 양 끝에서',en:'1) At the ends',zh:'① 在两端'},
        head:{ko:'y=\\log_{2}(x+1)\\ (1\\le x\\le 7):\\ M=3,\\ m=1',en:'y=\\log_{2}(x+1)\\ (1\\le x\\le 7):\\ M=3,\\ m=1',zh:'y=\\log_{2}(x+1)\\ (1\\le x\\le 7):\\ M=3,\\ m=1'},
        desc:{ko:'밑 2>1 이므로 증가합니다. x=7 에서 M=log₂8=<b>3</b>, x=1 에서 m=log₂2=<b>1</b> 입니다.',
              en:'Base 2>1, so it increases: M=log₂8=<b>3</b> at x=7 and m=log₂2=<b>1</b> at x=1.',
              zh:'底数2>1，函数递增：x=7时M=log₂8=<b>3</b>，x=1时m=log₂2=<b>1</b>。'},
        mathSteps:['x=7:\\ \\log_{2}8=3','x=1:\\ \\log_{2}2=1'],
        result:{ko:'증가하면 오른쪽 끝이 M!',en:'Increasing: the right end gives M!',zh:'递增时右端是M！'},
        book:{ko:'y=log_(1/2)x 처럼 밑이 1 보다 작으면 감소하므로 왼쪽 끝이 M 입니다.',
              en:'With a base below 1, as in y=log_(1/2)x, it decreases, so the left end gives M.',
              zh:'像y=log_(1/2)x这样底数小于1时递减，左端是M。'} },

      { tag:{ko:'② log 를 t 로',en:'2) The log as t',zh:'② 把log换成t'},
        head:{ko:'y=(\\log_{2}x)^2-2\\log_{2}x+3\\ (\\frac{1}{2}\\le x\\le 8)',en:'y=(\\log_{2}x)^2-2\\log_{2}x+3\\ (\\frac{1}{2}\\le x\\le 8)',zh:'y=(\\log_{2}x)^2-2\\log_{2}x+3\\ (\\frac{1}{2}\\le x\\le 8)'},
        desc:{ko:'log₂x=t 로 놓으면 −1≤t≤3 이고 y=(t−1)²+2 입니다. t=1 에서 m=<b>2</b>, t=−1 과 t=3 에서 M=<b>6</b> 입니다.',
              en:'Put log₂x=t: −1≤t≤3 and y=(t−1)²+2. At t=1, m=<b>2</b>; at t=−1 and t=3, M=<b>6</b>.',
              zh:'令log₂x=t，则−1≤t≤3，y=(t−1)²+2。t=1时m=<b>2</b>；t=−1与t=3时M=<b>6</b>。'},
        mathSteps:['t=\\log_{2}x\\ (-1\\le t\\le 3)','y=(t-1)^2+2'],
        result:{ko:'x 의 범위를 t 의 범위로!',en:'Turn the range of x into the range of t!',zh:'把x的范围化成t的范围！'},
        book:{ko:'x=1/2 이면 t=log₂(1/2)=−1 입니다. t 는 지수와 달리 음수도 될 수 있습니다.',
              en:'At x=1/2, t=log₂(1/2)=−1. Unlike an exponential, t can be negative.',
              zh:'x=1/2时t=log₂(1/2)=−1。与指数不同，t可以是负数。'} },

      { tag:{ko:'③ 진수 묶기',en:'3) Combining arguments',zh:'③ 合并真数'},
        head:{ko:'y=\\log_{2}x+\\log_{2}(8-x)\\ (0<x<8):\\ M=4',en:'y=\\log_{2}x+\\log_{2}(8-x)\\ (0<x<8):\\ M=4',zh:'y=\\log_{2}x+\\log_{2}(8-x)\\ (0<x<8):\\ M=4'},
        desc:{ko:'y=log₂x(8−x) 이고 x(8−x)=−(x−4)²+16 은 x=4 에서 16 으로 가장 큽니다. 그래서 M=log₂16=<b>4</b> 입니다.',
              en:'y=log₂x(8−x), and x(8−x)=−(x−4)²+16 is greatest, 16, at x=4. So M=log₂16=<b>4</b>.',
              zh:'y=log₂x(8−x)，而x(8−x)=−(x−4)²+16在x=4时最大为16。所以M=log₂16=<b>4</b>。'},
        mathSteps:['x(8-x)=-(x-4)^2+16','M=\\log_{2}16=4'],
        result:{ko:'진수가 가장 클 때 로그도 가장 크다!',en:'Largest argument, largest logarithm!',zh:'真数最大时对数也最大！'},
        book:{ko:'밑이 1 보다 크기 때문에 성립합니다. 밑이 1 보다 작으면 진수가 가장 클 때 로그는 가장 작습니다.',
              en:'This works because the base is greater than 1. With a base below 1, the largest argument gives the smallest logarithm.',
              zh:'这是因为底数大于1。底数小于1时，真数最大时对数最小。'} }
    ],
    rule:{ ko:'① 밑>1 이면 오른쪽 끝이 M, 0<밑<1 이면 왼쪽 끝이 M  ② logₐx=t 로 놓고 t 의 범위부터  ③ 로그의 합은 진수를 곱해 하나로',
      en:'① Base>1: right end gives M; 0<base<1: left end gives M  ② Put logₐx=t and find the range of t first  ③ A sum of logs is the log of the product',
      zh:'① 底数>1时右端为M，0<底数<1时左端为M  ② 令logₐx=t，先求t的范围  ③ 对数之和化为真数之积' }
  },

  check:{
    fills:[
      { tex:{ko:'y=\\log_{\\frac{1}{3}}x\\ (1\\le x\\le 27)\\ \\Rightarrow\\ m=\\square',en:'y=\\log_{\\frac{1}{3}}x\\ (1\\le x\\le 27)\\ \\Rightarrow\\ m=\\square',zh:'y=\\log_{\\frac{1}{3}}x\\ (1\\le x\\le 27)\\ \\Rightarrow\\ m=\\square'}, answer:-3,
        hint:{ ko:'감소 → x=27', en:'decreasing → x=27', zh:'递减 → x=27' } },
      { tex:{ko:'y=\\log_{2}(x-1)+k\\ (2\\le x\\le 9),\\ M=5\\ \\Rightarrow\\ k=\\square',en:'y=\\log_{2}(x-1)+k\\ (2\\le x\\le 9),\\ M=5\\ \\Rightarrow\\ k=\\square',zh:'y=\\log_{2}(x-1)+k\\ (2\\le x\\le 9),\\ M=5\\ \\Rightarrow\\ k=\\square'}, answer:2,
        hint:{ ko:'x=9: log₂8+k', en:'x=9: log₂8+k', zh:'x=9：log₂8+k' } }
    ],
    open:{ ko:'밑이 1 보다 작은 로그함수에서는 x 가 커질수록 함숫값이 작아지는 까닭을 설명해 봅니다.',
      en:'Explain why, for a logarithmic function with base less than 1, the value gets smaller as x grows.',
      zh:'说说为什么底数小于1的对数函数中，x越大函数值越小。' },
    openHint:{ ko:'log_(1/2)x=−log₂x 입니다. log₂x 가 커지면 앞에 붙은 − 때문에 log_(1/2)x 는 작아집니다.',
      en:'log_(1/2)x=−log₂x. As log₂x grows, the minus sign in front makes log_(1/2)x smaller.',
      zh:'log_(1/2)x=−log₂x。log₂x变大时，由于前面的负号，log_(1/2)x变小。' }
  },

  lab:{
    generator:'md139_logMaxMin', level:'main', count:6,
    params:{mode:'quad'},
    intro:{
      ko:'logₐx=t 로 놓아 이차함수로 바꾸고, x 의 범위에서 구한 t 의 범위 안에서 꼭짓점과 양 끝을 비교합니다.',
      en:'Put logₐx=t to get a quadratic, then compare the vertex and the ends within the range of t found from the range of x.',
      zh:'令logₐx=t化成二次函数，在由x的范围得到的t的范围内比较顶点与两端。'
    }
  },

  arena:{
    generator:'md139_logMaxMin', level:'main', count:6, timeLimit:420,
    params:{mode:'coef'},
    rule:{ ko:'7분 안에 최댓값·최솟값으로 로그함수의 미정계수를 모두 구합니다!', en:'Find every unknown in logarithmic functions from extreme values within 7 minutes!', zh:'7分钟内由最值求出所有对数函数的待定系数！' }
  },

  stamp:{ label:{ ko:'눈금 조율사', en:'Scale Tuner', zh:'刻度调音师' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'눈금을 정확히 읽었어! 🎚️',en:'Scale read exactly!',zh:'刻度读得很准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'밑이 1 보다 작은지 봐!',en:'Check whether the base is below 1!',zh:'看看底数是否小于1！'}, {ko:'t 의 범위부터 구해 봐!',en:'Find the range of t first!',zh:'先求t的范围！'} ],
    finish:{ ko:'완벽해! 눈금 조율사! 🎚️✨', en:'Perfect! Scale Tuner!', zh:'完美！刻度调音师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
