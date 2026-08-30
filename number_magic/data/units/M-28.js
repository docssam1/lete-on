/* Numbers of Magic — 유닛 M-28: 근의 공식 (고등 W11 · 공통수학1 방정식과 부등식) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-28'] = {
  id:'M-28', tier:'highmath1', level:'37', order:28,
  generator:'md28_quadraticFormula',
  title:{ ko:'근의 공식', en:'The Quadratic Formula', zh:'求根公式' },
  subtitle:{ ko:'인수분해가 안 될 때도 항상 통하는 만능 공식', en:'The universal formula that always works, even when factoring fails', zh:'即使不能因式分解也总能用的万能公式' },
  icon:'🧮',

  practice:{
    generator:'md28_quadraticFormula', level:'practice', count:5,
    params:{mode:'basic'},
    intro:{
      ko:'x²-3x+1=0은 인수분해가 안 돼요. 이럴 때 근의 공식 x=(-b±√(b²-4ac))/(2a)에 그대로 대입하면 답이 나와요.',
      en:'x²-3x+1=0 won\'t factor nicely. When that happens, plug straight into the quadratic formula x=(-b±√(b²-4ac))/(2a) and out comes the answer.',
      zh:'x²-3x+1=0无法因式分解。这时直接代入求根公式x=(-b±√(b²-4ac))/(2a)，答案就出来了。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'x²+bx+c=(x+p)(x+q) 인수분해는 p,q가 딱 맞아떨어질 때만 통해요. x²-3x+1=0처럼 정수로 안 떨어지는 방정식은 어떻게 풀까요?',
        en:'Factoring x²+bx+c=(x+p)(x+q) only works when p,q land on nice numbers. How do you solve something like x²-3x+1=0, where they don\'t come out as integers?',
        zh:'因式分解x²+bx+c=(x+p)(x+q)只在p、q刚好凑整数时才行。像x²-3x+1=0这种凑不出整数的方程怎么解？' },
      history:{ ko:'판별식(MD26)에서 본 b²-4ac가 사실 근의 공식 안에 그대로 들어 있어요. 완전제곱식으로 바꾸는 과정을 한 번만 미리 해 두면, 어떤 이차방정식이든 대입만으로 풀리는 만능 열쇠가 완성돼요.',
        en:'The b²-4ac you saw in the discriminant (MD26) sits right inside the quadratic formula. Doing the "complete the square" work once, in general, produces a master key that solves any quadratic just by substitution.',
        zh:'在判别式(MD26)里见过的b²-4ac，其实就藏在求根公式里面。把配方的过程一次性提前做好，就得到一把万能钥匙——任何二次方程只需代入就能解开。' }
    },
    stages:[
      { tag:{ko:'① 공식에 그대로 대입',en:'1) Substitute straight into the formula',zh:'① 直接代入公式'},
        head:{ko:'x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}',en:'x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}',zh:'x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}'},
        desc:{ko:'x²-3x+1=0은 a=1,b=-3,c=1. D=9-4=5이니 x=(3±√5)/2. <b>근호 안이 완전제곱수가 아니어도 그대로가 정답</b>이에요.',
              en:'For x²-3x+1=0: a=1, b=-3, c=1. D=9-4=5, so x=(3±√5)/2. Even when the radicand isn\'t a perfect square, <b>the unreduced form is the answer</b>.',
              zh:'x²-3x+1=0中a=1，b=-3，c=1。D=9-4=5，所以x=(3±√5)/2。即使根号内不是完全平方数，<b>不化简的形式就是答案</b>。'},
        mathSteps:['D=(-3)^2-4\\times1\\times1=5', 'x=\\frac{-(-3)\\pm\\sqrt5}{2\\times1}', 'x=\\frac{3\\pm\\sqrt5}{2}'],
        result:{ko:'D=b²-4ac를 먼저 구한 뒤 공식에 통째로 넣어요!',en:'Find D=b²-4ac first, then drop it straight into the formula!',zh:'先求D=b²-4ac，再整体代入公式！'},
        book:{ko:'답은 [p,q,r] 세 정수(x=(p±√q)/r)로 받아요 — 근호를 더 정리하지 않은 형태 그대로가 정답이에요.',
              en:'The answer is three integers [p,q,r] for x=(p±√q)/r — the unreduced radical form is correct as-is.',
              zh:'答案是三个整数[p,q,r]，对应x=(p±√q)/r——不用进一步化简根号，原样就是答案。'} },

      { tag:{ko:'② 공식이 나오는 이유(완전제곱식)',en:'2) Why the formula works (completing the square)',zh:'② 公式从何而来(配方)'},
        head:{ko:'ax^2+bx+c=0 \\;\\Rightarrow\\; \\left(x+\\dfrac{b}{2a}\\right)^2=\\dfrac{b^2-4ac}{4a^2}',en:'ax^2+bx+c=0 \\;\\Rightarrow\\; \\left(x+\\dfrac{b}{2a}\\right)^2=\\dfrac{b^2-4ac}{4a^2}',zh:'ax^2+bx+c=0 \\;\\Rightarrow\\; \\left(x+\\dfrac{b}{2a}\\right)^2=\\dfrac{b^2-4ac}{4a^2}'},
        desc:{ko:'양변을 a로 나누고 완전제곱식으로 묶으면 이 꼴이 돼요. 양변에 제곱근을 씌우고 x를 정리하면 <b>근의 공식이 그대로 나와요</b>.',
              en:'Dividing by a and completing the square produces this exact form. Take the square root of both sides and isolate x, and <b>out pops the quadratic formula</b>.',
              zh:'两边除以a并配成完全平方式，就会得到这个形式。两边开平方并整理x，<b>就直接得到求根公式</b>。'},
        mathSteps:['x^2+\\frac{b}{a}x=-\\frac{c}{a}', '\\left(x+\\frac{b}{2a}\\right)^2=\\frac{b^2-4ac}{4a^2}', 'x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}'],
        result:{ko:'근의 공식은 완전제곱식을 한 번만 일반적으로 풀어 둔 결과예요!',en:'The quadratic formula is just completing the square done once, in general!',zh:'求根公式就是把配方的过程一次性做好的结果！'},
        book:{ko:'D<0이면 근호 안이 음수라 실근이 없어요 — 판별식과 근의 공식은 한 몸이에요.',
              en:'When D<0, the radicand is negative and there\'s no real root — the discriminant and the formula are two sides of one coin.',
              zh:'D<0时根号内为负，没有实根——判别式和求根公式本是一体。'} }
    ],
    rule:{ ko:'① x=(-b±√(b²-4ac))/(2a)에 계수를 그대로 대입  ② 답은 [p,q,r] 세 정수(x=(p±√q)/r), 기약하지 않은 형태 그대로',
      en:'① Substitute coefficients into x=(-b±√(b²-4ac))/(2a)  ② The answer is [p,q,r] for x=(p±√q)/r, unreduced',
      zh:'① 把系数代入x=(-b±√(b²-4ac))/(2a)  ② 答案是[p,q,r]对应x=(p±√q)/r，不用化简' }
  },

  check:{
    fills:[
      { tex:'x^2 - 4x + 1 = 0 \\;\\Rightarrow\\; x = \\dfrac{\\square \\pm \\sqrt{\\square}}{\\square}', answer:[4,12,2],
        hint:{ ko:'D=16-4=12, p=-b=4, r=2a=2', en:'D=16-4=12, p=-b=4, r=2a=2', zh:'D=16-4=12，p=-b=4，r=2a=2' } },
      { tex:'2x^2 + 4x - 1 = 0 \\;\\Rightarrow\\; x = \\dfrac{\\square \\pm \\sqrt{\\square}}{\\square}', answer:[-4,24,4],
        hint:{ ko:'D=16-4×2×(-1)=24, p=-b=-4, r=2a=4', en:'D=16-4×2×(-1)=24, p=-b=-4, r=2a=4', zh:'D=16-4×2×(-1)=24，p=-b=-4，r=2a=4' } }
    ],
    open:{ ko:'x²+2x-4=0을 근의 공식으로 풀어봐요.',
      en:'Solve x²+2x-4=0 using the quadratic formula.',
      zh:'用求根公式解x²+2x-4=0。' },
    openHint:{ ko:'D=4+16=20, x=(-2±√20)/2 → [p,q,r]=[-2,20,2]',
      en:'D=4+16=20, x=(-2±√20)/2 → [p,q,r]=[-2,20,2]',
      zh:'D=4+16=20，x=(-2±√20)/2 → [p,q,r]=[-2,20,2]' }
  },

  lab:{
    generator:'md28_quadraticFormula', level:'main', count:4,
    params:{mode:'general'},
    intro:{
      ko:'이번엔 x²의 계수가 1이 아니야! 그래도 공식은 똑같이 적용돼.',
      en:'The x² coefficient isn\'t 1 this time! The formula still applies exactly the same way.',
      zh:'这次x²的系数不是1！公式的用法完全一样。'
    }
  },

  arena:{
    generator:'md28_quadraticFormula', level:'main', count:8, timeLimit:300,
    params:{mode:'wide'},
    rule:{ ko:'5분 안에 더 큰 범위의 근의 공식 문제를 모두 풀어요!', en:'Solve all the wider-range quadratic-formula problems in 5 minutes!', zh:'5分钟内解答所有更大范围的求根公式题！' }
  },

  stamp:{ label:{ ko:'근의 공식 달인', en:'Quadratic Formula Expert', zh:'求根公式高手' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'인수분해가 안 되는 식도 뚫었구나! 🧮',en:'You cracked one that wouldn\'t factor!',zh:'连不能因式分解的式子都解开了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'D=b²-4ac부터 구한 뒤 공식에 넣어봐!',en:'Find D=b²-4ac first, then plug into the formula!',zh:'先求D=b²-4ac，再代入公式！'}, {ko:'근호는 정리하지 않은 형태 그대로가 답이야!',en:'Leave the radical unreduced — that\'s the correct form!',zh:'根号不用化简，原样就是答案！'} ],
    finish:{ ko:'완벽해! 근의 공식 달인! 🧮✨', en:'Perfect! Quadratic Formula Expert!', zh:'完美！求根公式高手！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
