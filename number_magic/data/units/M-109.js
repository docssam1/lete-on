/* Numbers of Magic — 유닛 M-109: 연립이차부등식 (고등 공통수학1 · 과정 45, 2026-09-29)
   근거: docs/high-build-spec.md MD109. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-109'] = {
  id:'M-109', tier:'highmath1', level:'45', order:109,
  generator:'md109_quadSystem',
  title:{ ko:'연립이차부등식', en:'Systems with Quadratic Inequalities', zh:'一元二次不等式组' },
  subtitle:{ ko:'두 근 사이인지 바깥인지 보고 공통부분을 찾습니다', en:'Between or outside the roots? Then find the overlap', zh:'看是两根之间还是两侧，再求公共部分' },
  icon:'🎯',

  practice:{
    generator:'md109_quadSystem', level:'practice', count:6,
    params:{mode:'count'},
    intro:{
      ko:'이차부등식은 인수분해해 두 근을 찾습니다. 0 보다 작으면 두 근 사이, 크면 바깥입니다. 두 해의 공통부분에서 정수를 셉니다.',
      en:'Factor the quadratic inequality to find its roots: less than 0 means between them, greater means outside. Count the integers in the common part.',
      zh:'二次不等式先因式分解求两根：小于0在两根之间，大于0在两侧。数公共部分中的整数。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'y=(x−1)(x−4) 의 그래프는 x=1 과 x=4 에서 x축과 만나고, 그 사이에서만 x축 아래에 있습니다. 이차부등식의 해는 이 그림 한 장으로 읽힙니다.',
        en:'The graph of y=(x−1)(x−4) meets the x-axis at x=1 and x=4 and lies below it only in between. One picture reads off the solution of the quadratic inequality.',
        zh:'y=(x−1)(x−4)的图象在x=1和x=4处与x轴相交，只在两者之间位于x轴下方。二次不等式的解从这一张图就能读出。' }
    },
    stages:[
      { tag:{ko:'① 이차부등식의 해',en:'1) Solving a quadratic inequality',zh:'① 二次不等式的解'},
        head:{ko:'x^2-5x+4\\le 0',en:'x^2-5x+4\\le 0',zh:'x^2-5x+4\\le 0'},
        desc:{ko:'(x−1)(x−4)≤0 이므로 두 근 사이, <b>1≤x≤4</b> 입니다.',
              en:'(x−1)(x−4)≤0, so between the roots: <b>1≤x≤4</b>.',
              zh:'(x−1)(x−4)≤0，在两根之间：<b>1≤x≤4</b>。'},
        mathSteps:['(x-1)(x-4)\\le 0', '1\\le x\\le 4'],
        result:{ko:'작다면 사이, 크다면 바깥!',en:'Less than: between. Greater than: outside!',zh:'小于在中间，大于在两侧！'},
        book:{ko:'x² 의 계수가 음수이면 양변에 −1 을 곱해 부등호를 뒤집고 시작합니다.',
              en:'If the x² coefficient is negative, multiply by −1 and flip the inequality first.',
              zh:'x²的系数为负时，先乘以−1并改变不等号方向。'} },

      { tag:{ko:'② 공통부분',en:'2) The common part',zh:'② 公共部分'},
        head:{ko:'x^2-5x+4\\le 0,\\ x^2-2x-3>0',en:'x^2-5x+4\\le 0,\\ x^2-2x-3>0',zh:'x^2-5x+4\\le 0,\\ x^2-2x-3>0'},
        desc:{ko:'둘째는 (x+1)(x−3)>0 이라 x<−1 또는 x>3 입니다. 1≤x≤4 와 겹치는 부분은 <b>3<x≤4</b> 이고 정수는 4 하나입니다.',
              en:'The second is (x+1)(x−3)>0, so x<−1 or x>3. Its overlap with 1≤x≤4 is <b>3<x≤4</b>, containing only the integer 4.',
              zh:'第二个为(x+1)(x−3)>0，即x<−1或x>3。与1≤x≤4重叠的部分是<b>3<x≤4</b>，整数只有4。'},
        mathSteps:['(x+1)(x-3)>0', '3<x\\le 4'],
        result:{ko:'수직선에 두 해를 겹쳐 봅니다!',en:'Overlay both solutions on a number line!',zh:'把两个解叠在数轴上看！'},
        book:{ko:'가장 작은 정수해는 공통부분의 왼쪽 끝부터 확인합니다.',
              en:'For the smallest integer solution, check from the left end of the common part.',
              zh:'最小的整数解从公共部分左端开始检查。'} },

      { tag:{ko:'③ 해가 없을 조건',en:'3) Condition for no solution',zh:'③ 无解的条件'},
        head:{ko:'1\\le x\\le 4,\\ x>a',en:'1\\le x\\le 4,\\ x>a',zh:'1\\le x\\le 4,\\ x>a'},
        desc:{ko:'x>a 가 1≤x≤4 와 겹치지 않으려면 a 가 4 이상이어야 합니다. a=4 이면 x>4 라 겹치지 않으므로 <b>a≥4</b> 입니다.',
              en:'For x>a not to overlap 1≤x≤4, a must be at least 4. With a=4, x>4 does not overlap, so <b>a≥4</b>.',
              zh:'要使x>a与1≤x≤4不重叠，a须不小于4。a=4时x>4不重叠，所以<b>a≥4</b>。'},
        mathSteps:['a\\ge 4'],
        result:{ko:'끝값에서 등호가 있는지가 승부처입니다!',en:'The equals sign at the end decides it!',zh:'端点有没有等号是关键！'},
        book:{ko:'x≥a 였다면 a=4 일 때 x=4 가 겹치므로 a>4 가 됩니다.',
              en:'If it were x≥a, a=4 would share x=4, so the answer would be a>4.',
              zh:'如果是x≥a，a=4时x=4重叠，答案就成了a>4。'} }
    ],
    rule:{ ko:'① (x−α)(x−β)<0 은 사이, >0 은 바깥(α<β)  ② 공통부분은 수직선에서  ③ 끝값의 등호를 따집니다',
      en:'① (x−α)(x−β)<0: between; >0: outside (α<β)  ② Find the common part on a number line  ③ Check the equals sign at the ends',
      zh:'① (x−α)(x−β)<0在中间，>0在两侧(α<β)  ② 在数轴上找公共部分  ③ 注意端点的等号' }
  },

  check:{
    fills:[
      { tex:'x^2-5x+4\\le 0,\\ x>2 \\;\\Rightarrow\\; 2<x\\le\\square', answer:4,
        hint:{ ko:'(x−1)(x−4)≤0', en:'(x−1)(x−4)≤0', zh:'(x−1)(x−4)≤0' } },
      { tex:'x^2-4<0,\\ x\\ge 1 \\;\\Rightarrow\\; \\square\\le x<2', answer:1,
        hint:{ ko:'−2<x<2', en:'−2<x<2', zh:'−2<x<2' } }
    ],
    open:{ ko:'x²−x−6<0 과 x²−4x>0 을 함께 만족하는 x 의 범위를 구하는 과정을 설명해 봅니다.',
      en:'Explain how to find the range of x satisfying both x²−x−6<0 and x²−4x>0.',
      zh:'说说求同时满足x²−x−6<0和x²−4x>0的x的范围的过程。' },
    openHint:{ ko:'첫째는 −2<x<3, 둘째는 x<0 또는 x>4 이므로 공통부분은 −2<x<0 입니다.',
      en:'The first gives −2<x<3 and the second x<0 or x>4, so the common part is −2<x<0.',
      zh:'第一个得−2<x<3，第二个得x<0或x>4，公共部分是−2<x<0。' }
  },

  lab:{
    generator:'md109_quadSystem', level:'main', count:6,
    params:{mode:'minInt'},
    intro:{
      ko:'공통부분의 왼쪽 끝부터 정수를 확인해 가장 작은 정수해를 찾습니다.',
      en:'Check integers from the left end of the common part to find the smallest integer solution.',
      zh:'从公共部分左端开始检查整数，找出最小的整数解。'
    }
  },

  arena:{
    generator:'md109_quadSystem', level:'main', count:6, timeLimit:480,
    params:{mode:'empty'},
    rule:{ ko:'8분 안에 해가 없을 조건을 모두 구합니다!', en:'Find every no-solution condition within 8 minutes!', zh:'8分钟内求出所有无解的条件！' }
  },

  stamp:{ label:{ ko:'구간 저격수', en:'Interval Sniper', zh:'区间狙击手' }, coins:51 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'겹치는 구간을 정확히 맞혔구나! 🎯',en:'Right on the overlapping interval!',zh:'正中重叠的区间！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'0 보다 작으면 두 근 사이야!',en:'Less than 0 means between the roots!',zh:'小于0就在两根之间！'}, {ko:'끝값의 등호를 다시 봐!',en:'Look at the equals sign at the end again!',zh:'再看看端点的等号！'} ],
    finish:{ ko:'완벽해! 구간 저격수! 🎯✨', en:'Perfect! Interval Sniper!', zh:'完美！区间狙击手！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
