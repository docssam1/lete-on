/* Numbers of Magic — 유닛 M-107: 연립일차부등식 (고등 공통수학1 · 과정 45, 2026-09-29)
   근거: docs/high-build-spec.md MD107. 예시는 새로 만들었다. 역사 문단은 널리 알려진 사실만. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-107'] = {
  id:'M-107', tier:'highmath1', level:'45', order:107,
  generator:'md107_linSystem',
  title:{ ko:'연립일차부등식', en:'Systems of Linear Inequalities', zh:'一元一次不等式组' },
  subtitle:{ ko:'각각 풀어 수직선에서 겹치는 부분을 읽습니다', en:'Solve each, then read the overlap on a number line', zh:'分别求解，在数轴上读出重叠部分' },
  icon:'⚖️',

  practice:{
    generator:'md107_linSystem', level:'practice', count:6,
    params:{mode:'count'},
    intro:{
      ko:'두 부등식을 각각 풀어 공통부분을 구하고, 그 안의 정수를 셉니다. 등호가 있는 끝은 포함합니다.',
      en:'Solve both inequalities, find the common part and count the integers in it. An end with an equals sign is included.',
      zh:'分别解两个不等式，求公共部分，数其中的整数。带等号的端点要包含。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'"키는 140 이상이고 150 미만" 처럼 조건이 둘이면 두 조건을 모두 만족해야 합니다. 부등식 두 개를 함께 풀면 두 해의 겹치는 부분이 답입니다.',
        en:'With two conditions such as "at least 140 and under 150", both must hold. Solving two inequalities together, the answer is where their solutions overlap.',
        zh:'像"不低于140且低于150"这样有两个条件时，必须同时满足。一起解两个不等式，答案是两个解重叠的部分。' },
      history:{ ko:'부등호 <, > 는 17세기 영국의 해리엇이 쓴 책(1631년 출간)에 처음 나타난 것으로 알려져 있습니다.',
        en:'The symbols < and > are known to have first appeared in a book by the Englishman Thomas Harriot, published in 1631.',
        zh:'不等号<、>一般认为最早出现在英国人哈里奥特的著作中(1631年出版)。' }
    },
    stages:[
      { tag:{ko:'① 각각 풀기',en:'1) Solve each one',zh:'① 分别求解'},
        head:{ko:'2x-1<x+3,\\ 3x+2\\ge x-4',en:'2x-1<x+3,\\ 3x+2\\ge x-4',zh:'2x-1<x+3,\\ 3x+2\\ge x-4'},
        desc:{ko:'첫째는 x<4, 둘째는 2x≥−6 에서 x≥−3 입니다. 공통부분은 <b>−3≤x<4</b> 입니다.',
              en:'The first gives x<4; the second gives 2x≥−6, so x≥−3. The common part is <b>−3≤x<4</b>.',
              zh:'第一个得x<4，第二个由2x≥−6得x≥−3。公共部分是<b>−3≤x<4</b>。'},
        mathSteps:['x<4,\\quad x\\ge -3', '-3\\le x<4'],
        result:{ko:'수직선에 두 해를 겹쳐 그려 봅니다!',en:'Draw both solutions on one number line!',zh:'把两个解画在同一条数轴上！'},
        book:{ko:'음수로 나누면 부등호 방향이 바뀝니다 — −2x>6 이면 x<−3 입니다.',
              en:'Dividing by a negative number reverses the inequality: −2x>6 means x<−3.',
              zh:'除以负数时不等号方向改变——−2x>6即x<−3。'} },

      { tag:{ko:'② 정수해 세기',en:'2) Count integer solutions',zh:'② 数整数解'},
        head:{ko:'-3\\le x<4',en:'-3\\le x<4',zh:'-3\\le x<4'},
        desc:{ko:'−3 은 포함, 4 는 빠지므로 정수는 −3, −2, −1, 0, 1, 2, 3 의 <b>7개</b>이고, 가장 큰 정수해는 <b>3</b> 입니다.',
              en:'−3 is included and 4 is not, so the integers are −3, −2, −1, 0, 1, 2, 3: <b>7 of them</b>, and the largest is <b>3</b>.',
              zh:'−3包含，4不包含，整数为−3、−2、−1、0、1、2、3，共<b>7个</b>，最大的整数解是<b>3</b>。'},
        mathSteps:['3-(-3)+1=7'],
        result:{ko:'끝에 등호가 있는지 꼭 봅니다!',en:'Always check the ends for an equals sign!',zh:'一定要看端点有没有等号！'},
        book:{ko:'공통부분이 없으면 "해가 없다"고 합니다.',
              en:'If there is no common part, the system has no solution.',
              zh:'没有公共部分时称"无解"。'} },

      { tag:{ko:'③ 해로 상수 찾기',en:'3) Find a constant from the solution',zh:'③ 由解求常数'},
        head:{ko:'x+2>2x-1,\\ 2x-a\\ge x',en:'x+2>2x-1,\\ 2x-a\\ge x',zh:'x+2>2x-1,\\ 2x-a\\ge x'},
        desc:{ko:'첫째는 x<3, 둘째는 x≥a 입니다. 해가 −1≤x<3 이라면 <b>a=−1</b> 입니다.',
              en:'The first gives x<3 and the second x≥a. If the solution is −1≤x<3, then <b>a=−1</b>.',
              zh:'第一个得x<3，第二个得x≥a。若解为−1≤x<3，则<b>a=−1</b>。'},
        mathSteps:['x<3,\\quad x\\ge a', 'a=-1'],
        result:{ko:'a 가 들어 있는 끝을 주어진 끝과 맞춥니다!',en:'Match the end that contains a with the given end!',zh:'让含a的端点与已知端点一致！'},
        book:{ko:'a 가 있는 부등식도 x 에 대해 먼저 풉니다.',
              en:'Solve the inequality containing a for x first.',
              zh:'含a的不等式也先对x求解。'} }
    ],
    rule:{ ko:'① 각 부등식을 x 에 대해 푼다  ② 공통부분을 수직선에서 읽는다  ③ 끝의 등호를 확인합니다',
      en:'① Solve each inequality for x  ② Read the common part on a number line  ③ Check the equals signs at the ends',
      zh:'① 每个不等式对x求解  ② 在数轴上读出公共部分  ③ 检查端点的等号' }
  },

  check:{
    fills:[
      { tex:'x-1<5,\\ 2x\\ge x+2 \\;\\Rightarrow\\; \\square\\le x<6', answer:2,
        hint:{ ko:'2x−x≥2', en:'2x−x≥2', zh:'2x−x≥2' } },
      { tex:'x+1\\le 4,\\ 3x>x-4 \\;\\Rightarrow\\; -2<x\\le\\square', answer:3,
        hint:{ ko:'x≤4−1', en:'x≤4−1', zh:'x≤4−1' } }
    ],
    open:{ ko:'x>2 와 x<1 을 함께 만족하는 x 가 있는지 설명해 봅니다.',
      en:'Explain whether any x satisfies both x>2 and x<1.',
      zh:'说说是否有同时满足x>2和x<1的x。' },
    openHint:{ ko:'수직선에서 겹치는 부분이 없으므로 해가 없습니다.',
      en:'They do not overlap on the number line, so there is no solution.',
      zh:'在数轴上没有重叠部分，所以无解。' }
  },

  lab:{
    generator:'md107_linSystem', level:'main', count:6,
    params:{mode:'largest'},
    intro:{
      ko:'공통부분 안에서 가장 큰 정수나 가장 작은 정수를 고릅니다.',
      en:'Pick the largest or smallest integer in the common part.',
      zh:'在公共部分中选出最大或最小的整数。'
    }
  },

  arena:{
    generator:'md107_linSystem', level:'main', count:6, timeLimit:480,
    params:{mode:'unknown'},
    rule:{ ko:'8분 안에 주어진 해로 상수 a 를 모두 구합니다!', en:'Find every constant a from the given solution within 8 minutes!', zh:'8分钟内由已知解求出所有常数a！' }
  },

  stamp:{ label:{ ko:'공통부분 사냥꾼', en:'Overlap Hunter', zh:'公共部分猎手' }, coins:49 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'겹치는 곳을 정확히 찾았구나! ⚖️',en:'You found the overlap exactly!',zh:'准确找到了重叠部分！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음수로 나누면 부등호가 뒤집혀!',en:'Dividing by a negative flips the inequality!',zh:'除以负数不等号要反向！'}, {ko:'끝에 등호가 있는지 봐!',en:'Check whether the end has an equals sign!',zh:'看看端点有没有等号！'} ],
    finish:{ ko:'완벽해! 공통부분 사냥꾼! ⚖️✨', en:'Perfect! Overlap Hunter!', zh:'完美！公共部分猎手！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
