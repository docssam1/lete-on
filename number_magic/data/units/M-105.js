/* Numbers of Magic — 유닛 M-105: 부정방정식 (고등 공통수학1 · 과정 44, 2026-09-29)
   근거: docs/high-build-spec.md MD105. 예시는 새로 만들었다. 역사 문단은 널리 알려진 사실만. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-105'] = {
  id:'M-105', tier:'highmath1', level:'44', order:105,
  generator:'md105_indefinite',
  title:{ ko:'부정방정식', en:'Indeterminate Equations', zh:'不定方程' },
  subtitle:{ ko:'자연수·정수·실수 조건으로 해를 좁힙니다', en:'Narrow the solutions with natural, integer or real conditions', zh:'用自然数、整数、实数条件缩小解的范围' },
  icon:'🔢',

  practice:{
    generator:'md105_indefinite', level:'practice', count:6,
    params:{mode:'intCount'},
    intro:{
      ko:'한 문자에 1, 2, 3, … 을 넣어 다른 문자도 자연수가 되는지 확인하며 순서쌍을 셉니다.',
      en:'Put 1, 2, 3, … into one variable and check whether the other is also a natural number, counting the pairs.',
      zh:'给一个字母代入1、2、3、…，检查另一个是否也是自然数，数出数对。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'2x+3y=13 을 만족하는 (x, y) 는 끝없이 많습니다. 그런데 "x, y 는 자연수"라는 조건 하나로 단 두 쌍만 남습니다. 조건이 곧 두 번째 방정식 역할을 합니다.',
        en:'Infinitely many (x, y) satisfy 2x+3y=13, but the single condition "x and y are natural numbers" leaves only two pairs. The condition acts as a second equation.',
        zh:'满足2x+3y=13的(x, y)有无数个，但"x、y是自然数"这一条件只留下两组。条件起到了第二个方程的作用。' },
      history:{ ko:'3세기 알렉산드리아의 디오판토스는 『산학(아리트메티카)』에서 이런 방정식의 해를 다루었습니다. 그래서 정수 해를 찾는 방정식을 "디오판토스 방정식"이라고도 부릅니다.',
        en:'In 3rd-century Alexandria, Diophantus treated the solutions of such equations in his Arithmetica. That is why equations solved in integers are also called Diophantine equations.',
        zh:'3世纪亚历山大的丢番图在《算术》中研究了这类方程的解。所以求整数解的方程也叫"丢番图方程"。' }
    },
    stages:[
      { tag:{ko:'① 자연수 조건',en:'1) Natural-number condition',zh:'① 自然数条件'},
        head:{ko:'2x+3y=13',en:'2x+3y=13',zh:'2x+3y=13'},
        desc:{ko:'y=1 이면 x=5, y=3 이면 x=2 이고 y=2 는 x 가 자연수가 아닙니다. 해는 <b>(5, 1), (2, 3)</b> 두 쌍입니다.',
              en:'y=1 gives x=5, y=3 gives x=2, and y=2 does not give a natural x. The solutions are <b>(5, 1) and (2, 3)</b>.',
              zh:'y=1时x=5，y=3时x=2，y=2时x不是自然数。解为<b>(5, 1)、(2, 3)</b>两组。'},
        mathSteps:['x=\\dfrac{13-3y}{2}', '(x,\\,y)=(5,\\,1),\\ (2,\\,3)'],
        result:{ko:'계수가 큰 쪽 문자를 넣으면 빨리 끝납니다!',en:'Substituting for the variable with the larger coefficient is quicker!',zh:'代入系数大的字母更快！'},
        book:{ko:'x, y 가 모두 양수여야 하므로 넣어 볼 값이 몇 개 되지 않습니다.',
              en:'Both x and y must be positive, so there are only a few values to try.',
              zh:'x、y都须为正，所以要试的值不多。'} },

      { tag:{ko:'② (일차식)×(일차식)=정수',en:'2) (linear)×(linear)=integer',zh:'② (一次式)×(一次式)=整数'},
        head:{ko:'xy-2x-y=1',en:'xy-2x-y=1',zh:'xy-2x-y=1'},
        desc:{ko:'양변에 2 를 더하면 (x−1)(y−2)=3 입니다. 3=1×3=3×1 로 짝지으면 자연수 해는 <b>(2, 5), (4, 3)</b> 입니다.',
              en:'Add 2 to both sides: (x−1)(y−2)=3. Pairing 3=1×3=3×1 gives the natural solutions <b>(2, 5) and (4, 3)</b>.',
              zh:'两边加2得(x−1)(y−2)=3。按3=1×3=3×1配对，自然数解为<b>(2, 5)、(4, 3)</b>。'},
        mathSteps:['(x-1)(y-2)=3'],
        result:{ko:'곱이 정해지면 약수로 짝을 지으면 됩니다!',en:'A fixed product means pairing divisors!',zh:'积确定了，就用约数配对！'},
        book:{ko:'음수 약수 (−1)×(−3) 도 확인해야 합니다. 여기서는 x=0 이 되어 자연수가 아닙니다.',
              en:'Check negative divisors such as (−1)×(−3) too; here they give x=0, not a natural number.',
              zh:'负约数(−1)×(−3)也要检查；这里得x=0，不是自然数。'} },

      { tag:{ko:'③ 실수 조건 — 제곱의 합',en:'3) Real condition: sum of squares',zh:'③ 实数条件——平方和'},
        head:{ko:'x^2+y^2-2x+4y+5=0',en:'x^2+y^2-2x+4y+5=0',zh:'x^2+y^2-2x+4y+5=0'},
        desc:{ko:'(x−1)²+(y+2)²=0 으로 묶입니다. 실수의 제곱은 0 이상이라 둘 다 0 이어야 하므로 <b>x=1, y=−2</b> 입니다.',
              en:'It becomes (x−1)²+(y+2)²=0. Squares of reals are at least 0, so both must be 0: <b>x=1, y=−2</b>.',
              zh:'配成(x−1)²+(y+2)²=0。实数的平方不小于0，两者都须为0，所以<b>x=1，y=−2</b>。'},
        mathSteps:['(x-1)^2+(y+2)^2=0', 'x=1,\\ y=-2'],
        result:{ko:'식 하나로 두 문자가 정해집니다!',en:'One equation fixes both variables!',zh:'一个方程就确定了两个字母！'},
        book:{ko:'xy 항이 있으면 x 를 먼저 완전제곱식으로 묶고 남은 것을 y 로 묶습니다.',
              en:'If there is an xy term, complete the square in x first and then in y with what remains.',
              zh:'有xy项时，先把x配成完全平方，再把剩下的对y配方。'} }
    ],
    rule:{ ko:'① 자연수·정수는 값을 넣어 확인  ② (일차식)(일차식)=정수 꼴로 묶어 약수 짝짓기  ③ 실수는 제곱의 합=0',
      en:'① Natural or integer: substitute and check  ② Group into (linear)(linear)=integer and pair divisors  ③ Real: sum of squares=0',
      zh:'① 自然数、整数：代值检验  ② 整理成(一次式)(一次式)=整数，约数配对  ③ 实数：平方和=0' }
  },

  check:{
    fills:[
      { tex:'x^2+y^2-4x+6y+13=0 \\;\\Rightarrow\\; x=\\square', answer:2,
        hint:{ ko:'(x−2)²+(y+3)²=0', en:'(x−2)²+(y+3)²=0', zh:'(x−2)²+(y+3)²=0' } },
      { tex:'(x+y-5)^2+(x-y-1)^2=0 \\;\\Rightarrow\\; x=\\square', answer:3,
        hint:{ ko:'x+y=5, x−y=1', en:'x+y=5, x−y=1', zh:'x+y=5, x−y=1' } }
    ],
    open:{ ko:'x, y 가 자연수일 때 3x+2y=12 의 해를 모두 구하는 과정을 설명해 봅니다.',
      en:'Explain how to find all natural-number solutions of 3x+2y=12.',
      zh:'说说求3x+2y=12的所有自然数解的过程。' },
    openHint:{ ko:'x=2 이면 y=3 이고, x=1, 3 은 y 가 자연수가 아니며 x=4 이면 y=0 입니다. 해는 (2, 3) 하나입니다.',
      en:'x=2 gives y=3; x=1 and x=3 do not give natural y, and x=4 gives y=0. The only solution is (2, 3).',
      zh:'x=2时y=3；x=1、3时y不是自然数，x=4时y=0。解只有(2, 3)。' }
  },

  lab:{
    generator:'md105_indefinite', level:'main', count:6,
    params:{mode:'product'},
    intro:{
      ko:'(x−a)(y−b)=정수 꼴로 묶고 약수를 짝지어 봅니다.',
      en:'Group into (x−a)(y−b)=integer and pair up the divisors.',
      zh:'整理成(x−a)(y−b)=整数，把约数配对。'
    }
  },

  arena:{
    generator:'md105_indefinite', level:'main', count:6, timeLimit:480,
    params:{mode:'real'},
    rule:{ ko:'8분 안에 제곱의 합으로 x, y 를 모두 구합니다!', en:'Find every x and y through a sum of squares within 8 minutes!', zh:'8分钟内用平方和求出所有x、y！' }
  },

  stamp:{ label:{ ko:'조건 탐정', en:'Condition Detective', zh:'条件侦探' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'조건 하나로 딱 찾아냈구나! 🔢',en:'One condition and you nailed it!',zh:'一个条件就找到了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음수 약수도 빠뜨리지 마!',en:'Do not forget negative divisors!',zh:'别漏了负约数！'}, {ko:'제곱의 합이 0 이면 각각 0 이야!',en:'If a sum of squares is 0, each one is 0!',zh:'平方和为0，每个都为0！'} ],
    finish:{ ko:'완벽해! 조건 탐정! 🔢✨', en:'Perfect! Condition Detective!', zh:'完美！条件侦探！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
