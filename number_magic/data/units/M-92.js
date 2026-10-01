/* Numbers of Magic — 유닛 M-92: 이차식으로 나눈 나머지 (고등 공통수학1 · 과정 39 나머지정리와 인수분해, 2026-09-29)
   근거: docs/high-build-spec.md MD92. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-92'] = {
  id:'M-92', tier:'highmath1', level:'39', order:92,
  generator:'md92_quadRemainder',
  title:{ ko:'이차식으로 나눈 나머지', en:'Remainders on Division by a Quadratic', zh:'除以二次式的余式' },
  subtitle:{ ko:'나머지를 ax+b로 두고 두 값을 대입해 연립합니다', en:'Write the remainder as ax+b and substitute two values', zh:'把余式设为ax+b，代入两个值联立求解' },
  icon:'🧮',

  practice:{
    generator:'md92_quadRemainder', level:'practice', count:5,
    params:{mode:'coefA'},
    intro:{
      ko:'이차식으로 나눈 나머지는 일차 이하입니다. ax+b로 두고 두 식을 빼서 a부터 구합니다.',
      en:'A remainder on division by a quadratic has degree at most 1. Write it as ax+b and subtract the two equations to get a first.',
      zh:'除以二次式的余式次数不超过1。设为ax+b，两式相减先求a。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'P(x)를 x−1로 나누면 나머지가 5, x−3으로 나누면 나머지가 9입니다. P(x)가 무엇인지 몰라도 (x−1)(x−3)으로 나눈 나머지를 구할 수 있을까요?',
        en:'P(x) leaves remainder 5 when divided by x−1 and remainder 9 when divided by x−3. Without knowing P(x), can we find the remainder on division by (x−1)(x−3)?',
        zh:'P(x)除以x−1余5，除以x−3余9。不知道P(x)是什么，能求出它除以(x−1)(x−3)的余式吗？' },
      history:{ ko:'나누는 식의 차수보다 나머지의 차수가 항상 낮습니다. 일차식으로 나누면 나머지는 상수 하나, 이차식으로 나누면 나머지는 ax+b라서 미지수가 둘입니다. 그래서 조건도 두 개가 필요합니다.',
        en:'A remainder always has lower degree than the divisor. Dividing by a linear expression leaves a single constant; dividing by a quadratic leaves ax+b, with two unknowns — so two conditions are needed.',
        zh:'余式的次数总比除式低。除以一次式余数是一个常数；除以二次式余式是ax+b，有两个未知数，所以需要两个条件。' }
    },
    stages:[
      { tag:{ko:'① 나머지를 ax+b로 둔다',en:'1) Write the remainder as ax+b',zh:'① 设余式为ax+b'},
        head:{ko:'P(x)=(x-1)(x-3)Q(x)+ax+b',en:'P(x)=(x-1)(x-3)Q(x)+ax+b',zh:'P(x)=(x-1)(x-3)Q(x)+ax+b'},
        desc:{ko:'x=1을 넣으면 앞부분이 0이 되어 <b>P(1)=a+b</b>, x=3을 넣으면 <b>P(3)=3a+b</b>입니다. 나머지정리로 P(1)=5, P(3)=9입니다.',
              en:'Putting x=1 makes the first part 0, so <b>P(1)=a+b</b>; putting x=3 gives <b>P(3)=3a+b</b>. By the remainder theorem P(1)=5 and P(3)=9.',
              zh:'代入x=1前面部分为0，<b>P(1)=a+b</b>；代入x=3得<b>P(3)=3a+b</b>。由余数定理P(1)=5、P(3)=9。'},
        mathSteps:['a+b=5', '3a+b=9'],
        result:{ko:'몫 Q(x)를 몰라도 식 두 개가 생깁니다!',en:'Two equations appear without knowing the quotient Q(x)!',zh:'不知道商Q(x)也得到了两个方程！'},
        book:{ko:'대입하는 값은 나누는 식을 0으로 만드는 값입니다. 그래야 몫 부분이 사라집니다.',
              en:'Substitute the values that make the divisor 0 — that is what makes the quotient part vanish.',
              zh:'代入的是使除式为0的值——这样商的部分才会消失。'} },

      { tag:{ko:'② 두 식을 빼서 a, 다시 넣어 b',en:'2) Subtract for a, substitute back for b',zh:'② 相减求a，代回求b'},
        head:{ko:'2a=4 \\;\\Rightarrow\\; a=2,\\ b=3',en:'2a=4 \\;\\Rightarrow\\; a=2,\\ b=3',zh:'2a=4 \\;\\Rightarrow\\; a=2,\\ b=3'},
        desc:{ko:'(3a+b)−(a+b)=9−5이므로 2a=4, <b>a=2</b>입니다. a+b=5에 넣으면 <b>b=3</b>이라 나머지는 2x+3입니다.',
              en:'(3a+b)−(a+b)=9−5 gives 2a=4, so <b>a=2</b>. Putting it into a+b=5 gives <b>b=3</b>, so the remainder is 2x+3.',
              zh:'(3a+b)−(a+b)=9−5得2a=4，<b>a=2</b>。代入a+b=5得<b>b=3</b>，余式是2x+3。'},
        mathSteps:['2a=9-5=4', 'a=2', 'b=5-2=3'],
        result:{ko:'나머지는 2x+3입니다!',en:'The remainder is 2x+3!',zh:'余式是2x+3！'},
        book:{ko:'나누는 식이 x²−4x+3처럼 전개되어 있으면 먼저 (x−1)(x−3)으로 인수분해해 대입할 값을 찾습니다.',
              en:'If the divisor is written out, like x²−4x+3, factor it into (x−1)(x−3) first to find the values to substitute.',
              zh:'除式若是x²−4x+3这样的展开式，先分解成(x−1)(x−3)，找出要代入的值。'} }
    ],
    rule:{ ko:'① 이차식으로 나눈 나머지는 ax+b  ② 나누는 식을 0으로 만드는 두 값을 대입  ③ 두 식을 빼서 a, 다시 넣어 b',
      en:'① The remainder on division by a quadratic is ax+b  ② Substitute the two values that make the divisor 0  ③ Subtract for a, substitute back for b',
      zh:'① 除以二次式的余式是ax+b  ② 代入使除式为0的两个值  ③ 相减求a，代回求b' }
  },

  check:{
    fills:[
      { tex:'a+b=4,\\ 2a+b=7 \\;\\Rightarrow\\; a=\\square', answer:3,
        hint:{ ko:'두 식을 빼면 a=3', en:'Subtract: a=3', zh:'两式相减得a=3' } },
      { tex:'a=3,\\ a+b=4 \\;\\Rightarrow\\; b=\\square', answer:1,
        hint:{ ko:'4−3=1', en:'4−3=1', zh:'4−3=1' } }
    ],
    open:{ ko:'P(x)를 x²−1로 나눈 나머지를 구하려면 어떤 두 값을 대입해야 하는지 설명해 봅니다.',
      en:'Explain which two values to substitute to find the remainder of P(x) divided by x²−1.',
      zh:'说说求P(x)除以x²−1的余式时应代入哪两个值。' },
    openHint:{ ko:'x²−1=(x−1)(x+1)이므로 x=1과 x=−1을 대입합니다.',
      en:'x²−1=(x−1)(x+1), so substitute x=1 and x=−1.',
      zh:'x²−1=(x−1)(x+1)，所以代入x=1和x=−1。' }
  },

  lab:{
    generator:'md92_quadRemainder', level:'main', count:5,
    params:{mode:'coefB'},
    intro:{
      ko:'a를 구한 다음 한 식에 다시 넣어 상수항 b까지 구합니다.',
      en:'After finding a, substitute back into one equation to get the constant b.',
      zh:'求出a后代回一个式子，再求常数项b。'
    }
  },

  arena:{
    generator:'md92_quadRemainder', level:'main', count:6, timeLimit:420,
    params:{mode:'both'},
    rule:{ ko:'7분 안에 나머지 ax+b의 a와 b를 모두 구합니다!', en:'Find both a and b of the remainder ax+b within 7 minutes!', zh:'7分钟内求出余式ax+b的a和b！' }
  },

  stamp:{ label:{ ko:'나머지 추적자', en:'Remainder Tracker', zh:'余式追踪者' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'몫을 몰라도 나머지를 찾아냈구나! 🧮',en:'You found the remainder without the quotient!',zh:'不知道商也找到了余式！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'나머지를 ax+b로 두고 두 값을 넣어 봐!',en:'Write the remainder as ax+b and substitute the two values!',zh:'把余式设为ax+b，代入两个值试试！'}, {ko:'두 식을 빼면 b가 사라져!',en:'Subtract the two equations and b disappears!',zh:'两式相减b就消掉了！'} ],
    finish:{ ko:'완벽해! 나머지 추적자! 🧮✨', en:'Perfect! Remainder Tracker!', zh:'完美！余式追踪者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
