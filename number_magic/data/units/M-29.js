/* Numbers of Magic — 유닛 M-29: 이차부등식 (고등 W11 · 공통수학1 방정식과 부등식) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-29'] = {
  id:'M-29', tier:'highmath1', level:'37', order:29,
  generator:'md29_quadIneq',
  title:{ ko:'이차부등식', en:'Quadratic Inequalities', zh:'二次不等式' },
  subtitle:{ ko:'두 인수의 부호가 다를 때만 곱이 음수가 돼요', en:'The product is negative only when the two factors disagree in sign', zh:'只有两因式符号相反时乘积才是负' },
  icon:'🚦',

  practice:{
    generator:'md29_quadIneq', level:'practice', count:5,
    params:{mode:'between'},
    intro:{
      ko:'(x-2)(x-5)<0이 되려면? 두 인수 중 하나는 양수, 하나는 음수여야 해요 — 그건 x가 2와 5 사이일 때뿐이에요.',
      en:'For (x-2)(x-5)<0, one factor must be positive and the other negative — that only happens when x is between 2 and 5.',
      zh:'要让(x-2)(x-5)<0，两个因式必须一正一负——只有x在2和5之间时才会这样。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'이차방정식은 등호(=)로 특정 x만 찾았어요. 그런데 (x-2)(x-5)<0처럼 부등호가 있으면 답은 특정 값이 아니라 범위예요 — 어떤 x들이 이 부등식을 만족할까요?',
        en:'A quadratic equation with an equals sign finds specific x-values. But with an inequality like (x-2)(x-5)<0, the answer isn\'t a single value — it\'s a range. Which x-values satisfy it?',
        zh:'二次方程用等号(=)找出特定的x。但像(x-2)(x-5)<0这样带不等号的，答案不是一个特定值，而是一个范围——哪些x满足它？' },
      history:{ ko:'부호를 다루는 규칙은 아주 단순해요: 양수×양수=양수, 음수×음수=양수, 양수×음수=음수. 이 규칙 하나만 있으면 두 인수의 부호 조합을 따져서 부등식의 해를 구간으로 정리할 수 있어요.',
        en:'The sign rule is simple: positive×positive=positive, negative×negative=positive, positive×negative=negative. With just this one rule, you can track the sign combinations of the two factors and sort the inequality\'s solution into an interval.',
        zh:'符号法则很简单：正×正=正，负×负=正，正×负=负。只凭这一条法则，就能梳理两因式的符号组合，把不等式的解整理成一个区间。' }
    },
    stages:[
      { tag:{ko:'① 두 인수의 부호가 다를 때만 곱이 음수',en:'1) The product is negative only when the signs differ',zh:'① 只有符号不同乘积才是负'},
        head:{ko:'(x-2)(x-5)<0 \\;\\Rightarrow\\; 2<x<5',en:'(x-2)(x-5)<0 \\;\\Rightarrow\\; 2<x<5',zh:'(x-2)(x-5)<0 \\;\\Rightarrow\\; 2<x<5'},
        desc:{ko:'x=3(2와 5 사이)이면 (3-2)(3-5)=1×(-2)=<b>음수</b> — 부등식을 만족해요. x=6(5보다 큼)이면 (6-2)(6-5)=4×1=<b>양수</b> — 만족 안 해요. 그래서 해는 두 근 사이예요.',
              en:'At x=3 (between 2 and 5): (3-2)(3-5)=1×(-2)=<b>negative</b> — satisfies the inequality. At x=6 (past 5): (6-2)(6-5)=4×1=<b>positive</b> — doesn\'t. So the solution lies between the two roots.',
              zh:'x=3(在2和5之间)时：(3-2)(3-5)=1×(-2)=<b>负</b>——满足不等式。x=6(超过5)时：(6-2)(6-5)=4×1=<b>正</b>——不满足。所以解在两根之间。'},
        mathSteps:['x=3:\\;(3-2)(3-5)=-2<0', 'x=6:\\;(6-2)(6-5)=4>0', '\\therefore\\; 2<x<5'],
        result:{ko:'곱이 음수인 구간은 항상 두 근 사이예요!',en:'The negative-product interval is always between the two roots!',zh:'乘积为负的区间总是在两根之间！'},
        book:{ko:'(x-p)(x-q)<0(p<q)의 해는 p<x<q — 두 근이 경계가 되는 열린 구간이에요.',
              en:'For (x-p)(x-q)<0 with p<q, the solution is p<x<q — an open interval bounded by the two roots.',
              zh:'(x-p)(x-q)<0(p<q)的解是p<x<q——以两根为边界的开区间。'} },

      { tag:{ko:'② 전개된 식은 먼저 인수분해',en:'2) Factor an expanded expression first',zh:'② 展开式先因式分解'},
        head:{ko:'x^2-7x+10<0 \\;\\Rightarrow\\; (x-2)(x-5)<0',en:'x^2-7x+10<0 \\;\\Rightarrow\\; (x-2)(x-5)<0',zh:'x^2-7x+10<0 \\;\\Rightarrow\\; (x-2)(x-5)<0'},
        desc:{ko:'더해서 7, 곱해서 10인 두 수는 2와 5 — <b>(x-2)(x-5)<0</b>으로 인수분해되고, 앞서 배운 대로 해는 2<x<5예요.',
              en:'Two numbers that add to 7 and multiply to 10 are 2 and 5 — this factors as <b>(x-2)(x-5)<0</b>, and as before, the solution is 2<x<5.',
              zh:'相加得7、相乘得10的两个数是2和5——因式分解为<b>(x-2)(x-5)<0</b>，和前面一样，解是2<x<5。'},
        mathSteps:['x^2-7x+10=(x-2)(x-5)', '(x-2)(x-5)<0', '2<x<5'],
        result:{ko:'전개된 식은 먼저 인수분해해서 두 근을 찾아요!',en:'For an expanded expression, factor first to find the two roots!',zh:'展开式先因式分解，找出两根！'},
        book:{ko:'x²의 계수가 1이 아니면 먼저 그 수로 나눠(양수일 때 부등호 방향 유지) 인수분해해요.',
              en:'If the x² coefficient isn\'t 1, divide by it first (the inequality direction stays the same when positive) before factoring.',
              zh:'若x²的系数不是1，先用它除(为正时不等号方向不变)再因式分解。'} }
    ],
    rule:{ ko:'① (x-p)(x-q)<0의 해는 두 근 사이(p<x<q)  ② 전개된 식은 먼저 인수분해해서 두 근을 찾은 뒤 적용',
      en:'① The solution of (x-p)(x-q)<0 lies between the roots (p<x<q)  ② Factor expanded expressions first, then apply the rule',
      zh:'① (x-p)(x-q)<0的解在两根之间(p<x<q)  ② 展开式先因式分解找两根，再套用规则' }
  },

  check:{
    fills:[
      { tex:'(x-1)(x-4) < 0', answer:[1,4],
        hint:{ ko:'두 근 사이가 해', en:'the solution lies between the roots', zh:'解在两根之间' } },
      { tex:'x^2 - 3x - 10 < 0', answer:[-2,5],
        hint:{ ko:'인수분해: (x+2)(x-5)<0', en:'factor: (x+2)(x-5)<0', zh:'因式分解：(x+2)(x-5)<0' } }
    ],
    open:{ ko:'2x²-2x-24<0의 해를 구하는 과정을 설명해봐요.',
      en:'Explain how to solve 2x²-2x-24<0.',
      zh:'说说解2x²-2x-24<0的过程。' },
    openHint:{ ko:'2로 나누면 x²-x-12<0 → (x+3)(x-4)<0 → -3<x<4',
      en:'Divide by 2: x²-x-12<0 → (x+3)(x-4)<0 → -3<x<4',
      zh:'除以2：x²-x-12<0 → (x+3)(x-4)<0 → -3<x<4' }
  },

  lab:{
    generator:'md29_quadIneq', level:'main', count:4,
    params:{mode:'expandForm'},
    intro:{
      ko:'이번엔 전개된 식이야! 먼저 인수분해부터 해봐.',
      en:'An expanded expression this time! Factor it first.',
      zh:'这次是展开式！先因式分解。'
    }
  },

  arena:{
    generator:'md29_quadIneq', level:'main', count:8, timeLimit:300,
    params:{mode:'withCoeff'},
    rule:{ ko:'5분 안에 x²계수가 1이 아닌 이차부등식을 모두 풀어요!', en:'Solve all the quadratic inequalities with a leading coefficient ≠1 in 5 minutes!', zh:'5分钟内解答所有x²系数不是1的二次不等式！' }
  },

  stamp:{ label:{ ko:'부등식 신호수', en:'Inequality Signalman', zh:'不等式信号手' }, coins:48 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'부호가 바뀌는 구간을 정확히 짚었구나! 🚦',en:'You pinpointed exactly where the sign flips!',zh:'精准找到了符号变化的区间！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'두 인수의 부호가 다를 때만 곱이 음수가 돼!',en:'The product is negative only when the two factors have opposite signs!',zh:'两因式符号不同乘积才是负！'}, {ko:'전개된 식이면 먼저 인수분해부터 해야 해!',en:'For an expanded expression, factor first!',zh:'展开式要先因式分解！'} ],
    finish:{ ko:'완벽해! 부등식 신호수! 🚦✨', en:'Perfect! Inequality Signalman!', zh:'完美！不等式信号手！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
