/* Numbers of Magic — 유닛 M-27: 근과 계수의 관계 (고등 W11 · 공통수학1 방정식과 부등식 · 계보4 '무지개 덧셈법' 연장) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-27'] = {
  id:'M-27', tier:'highmath1', level:'37', order:27,
  lineage:['rainbow-sum'],
  generator:'md27_rootsSumProduct',
  title:{ ko:'근과 계수의 관계', en:'Sum & Product of Roots', zh:'根与系数的关系' },
  subtitle:{ ko:'근을 구하지 않고도 계수만 보면 두 근의 합과 곱을 알아요', en:'You don\'t need to solve — the coefficients alone reveal the sum and product', zh:'不用求根，只看系数就知道两根之和与积' },
  icon:'🌈',

  practice:{
    generator:'md27_rootsSumProduct', level:'practice', count:5,
    params:{mode:'sumProduct'},
    intro:{
      ko:'x²-5x+6=0의 두 근은 2와 3이에요. 2+3=5=-(-5), 2×3=6 — 계수 -5, 6과 정확히 연결돼 있어요!',
      en:'The two roots of x²-5x+6=0 are 2 and 3. 2+3=5=-(-5), 2×3=6 — exactly matching the coefficients -5 and 6!',
      zh:'x²-5x+6=0的两根是2和3。2+3=5=-(-5)，2×3=6——正好和系数-5、6对应！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'무지개 덧셈법에서 두 수의 합과 곱만 알면 그 두 수를 다룰 수 있다는 걸 배웠어요. 이차방정식의 두 근도 "어떤 두 수"인데, 근을 직접 구하지 않고 합과 곱만 바로 알 수 있을까요?',
        en:'From rainbow addition, you learned that knowing just the sum and product of two numbers lets you work with them. The two roots of a quadratic are also "some two numbers" — can you find their sum and product directly, without solving for them?',
        zh:'从彩虹加法法你学到：只要知道两数之和与积，就能对付这两个数。二次方程的两个根也是"某两个数"——能不能不求根，直接知道它们的和与积？' },
      history:{ ko:'무지개 덧셈법 → 차가 2인 두 수의 곱 → 평균값 곱셈 → 합차공식으로 이어진 여정은 늘 "두 수를 합과 곱으로 다루는" 것이었어요. 근과 계수의 관계는 그 여정의 마지막 걸음 — 이번엔 그 두 수가 방정식의 근이라는 것만 다를 뿐이에요.',
        en:'The journey from rainbow addition through the product of two numbers differing by 2, average-value multiplication, and the difference-of-squares formula always came down to handling two numbers via their sum and product. The relation between roots and coefficients is the final step of that journey — this time the two numbers just happen to be an equation\'s roots.',
        zh:'从彩虹加法法到差为2的两数之积、平均值乘法、再到平方差公式，这段旅程一直都是用"和与积"来处理两个数。根与系数的关系是这段旅程的最后一步——这次那两个数恰好是方程的根而已。' }
    },
    stages:[
      { tag:{ko:'① α+β=-b, αβ=c(a=1일 때)',en:'1) α+β=-b, αβ=c (when a=1)',zh:'① α+β=-b，αβ=c(a=1时)'},
        head:{ko:'x^2-5x+6=0 \\;\\Rightarrow\\; \\alpha+\\beta=5,\\;\\alpha\\beta=6',en:'x^2-5x+6=0 \\;\\Rightarrow\\; \\alpha+\\beta=5,\\;\\alpha\\beta=6',zh:'x^2-5x+6=0 \\;\\Rightarrow\\; \\alpha+\\beta=5,\\;\\alpha\\beta=6'},
        desc:{ko:'x²-5x+6=(x-α)(x-β)로 전개하면 x²-(α+β)x+αβ가 돼요. 원래 식과 비교하면 <b>α+β=5, αβ=6</b> — 실제 근 2, 3과 정확히 맞아요(2+3=5, 2×3=6).',
              en:'Expanding x²-5x+6=(x-α)(x-β) gives x²-(α+β)x+αβ. Comparing with the original, <b>α+β=5, αβ=6</b> — matching the actual roots 2, 3 exactly (2+3=5, 2×3=6).',
              zh:'展开x²-5x+6=(x-α)(x-β)得x²-(α+β)x+αβ。和原式比较，<b>α+β=5，αβ=6</b>——正好对应实际的根2、3(2+3=5，2×3=6)。'},
        mathSteps:['(x-\\alpha)(x-\\beta)=x^2-(\\alpha+\\beta)x+\\alpha\\beta', '\\text{비교: } \\alpha+\\beta=5', '\\alpha\\beta=6'],
        result:{ko:'x²+bx+c=(x-α)(x-β)를 전개해서 계수와 바로 비교해요!',en:'Expand x²+bx+c=(x-α)(x-β) and compare with the coefficients directly!',zh:'展开x²+bx+c=(x-α)(x-β)，直接和系数比较！'},
        book:{ko:'x²+bx+c=0의 두 근 α,β는 α+β=-b, αβ=c를 항상 만족해요.',
              en:'For x²+bx+c=0 with roots α,β: always α+β=-b and αβ=c.',
              zh:'x²+bx+c=0的两根α、β恒满足α+β=-b，αβ=c。'} },

      { tag:{ko:'② 합·곱으로 다른 식도 구하기',en:'2) Use sum & product for other expressions',zh:'② 用和与积求其他式子'},
        head:{ko:'\\alpha^2+\\beta^2=(\\alpha+\\beta)^2-2\\alpha\\beta',en:'\\alpha^2+\\beta^2=(\\alpha+\\beta)^2-2\\alpha\\beta',zh:'\\alpha^2+\\beta^2=(\\alpha+\\beta)^2-2\\alpha\\beta'},
        desc:{ko:'α+β=5, αβ=6이면 α²+β²=(α+β)²-2αβ=25-12=<b>13</b>. 실제로 2²+3²=4+9=13 — 근을 몰라도 합·곱만으로 계산 끝!',
              en:'With α+β=5, αβ=6: α²+β²=(α+β)²-2αβ=25-12=<b>13</b>. Indeed 2²+3²=4+9=13 — computed entirely from the sum and product, no roots needed!',
              zh:'α+β=5，αβ=6时：α²+β²=(α+β)²-2αβ=25-12=<b>13</b>。实际上2²+3²=4+9=13——不用知道根，只用和与积就算出来了！'},
        mathSteps:['(\\alpha+\\beta)^2=\\alpha^2+2\\alpha\\beta+\\beta^2', '\\alpha^2+\\beta^2=(\\alpha+\\beta)^2-2\\alpha\\beta', '=25-12=13'],
        result:{ko:'(α+β)²를 펼쳐 보면 α²+β²을 합·곱만으로 뽑아낼 수 있어요!',en:'Expand (α+β)² and you can extract α²+β² from just the sum and product!',zh:'展开(α+β)²就能只用和与积求出α²+β²！'},
        book:{ko:'대칭식(α,β를 바꿔도 값이 같은 식)은 항상 합과 곱만으로 다시 쓸 수 있어요.',
              en:'A symmetric expression (unchanged when α and β swap) can always be rewritten using just the sum and product.',
              zh:'对称式(交换α、β值不变的式子)总能只用和与积重新写出。'} }
    ],
    rule:{ ko:'① x²+bx+c=0의 두 근: α+β=-b, αβ=c  ② α²+β²=(α+β)²-2αβ처럼 합·곱만으로 다른 식도 구할 수 있다',
      en:'① For x²+bx+c=0: α+β=-b, αβ=c  ② Expressions like α²+β²=(α+β)²-2αβ can be found from the sum and product alone',
      zh:'① x²+bx+c=0的两根：α+β=-b，αβ=c  ② α²+β²=(α+β)²-2αβ这类式子也只用和与积就能求出' }
  },

  check:{
    fills:[
      { tex:'x^2 - 7x + 10 = 0 \\;\\Rightarrow\\; \\alpha+\\beta=\\square, \\;\\; \\alpha\\beta=\\square', answer:[7,10],
        hint:{ ko:'α+β=-(-7)=7, αβ=10', en:'α+β=-(-7)=7, αβ=10', zh:'α+β=-(-7)=7，αβ=10' } },
      { tex:'2x^2 - 6x + 4 = 0 \\;\\Rightarrow\\; \\alpha+\\beta=\\square, \\;\\; \\alpha\\beta=\\square', answer:[3,2],
        hint:{ ko:'α+β=-b/a=6/2=3, αβ=c/a=4/2=2', en:'α+β=-b/a=6/2=3, αβ=c/a=4/2=2', zh:'α+β=-b/a=6/2=3，αβ=c/a=4/2=2' } }
    ],
    open:{ ko:'x²-4x+1=0의 두 근 α,β에 대해 α²+β²의 값을 구하는 과정을 설명해봐요.',
      en:'Explain how to find α²+β² for the roots α,β of x²-4x+1=0.',
      zh:'说说求x²-4x+1=0的根α,β的α²+β²的过程。' },
    openHint:{ ko:'α+β=4, αβ=1 → α²+β²=(α+β)²-2αβ=16-2=14',
      en:'α+β=4, αβ=1 → α²+β²=(α+β)²-2αβ=16-2=14',
      zh:'α+β=4，αβ=1 → α²+β²=(α+β)²-2αβ=16-2=14' }
  },

  lab:{
    generator:'md27_rootsSumProduct', level:'main', count:4,
    params:{mode:'sumProductA'},
    intro:{
      ko:'이번엔 x²의 계수가 1이 아니야! a로 나눠서 α+β=-b/a, αβ=c/a를 써봐.',
      en:'This time the x² coefficient isn\'t 1! Divide by a: α+β=-b/a, αβ=c/a.',
      zh:'这次x²的系数不是1！除以a：α+β=-b/a，αβ=c/a。'
    }
  },

  arena:{
    generator:'md27_rootsSumProduct', level:'main', count:8, timeLimit:300,
    params:{mode:'sumSquares'},
    rule:{ ko:'5분 안에 α²+β² 구하는 문제를 모두 풀어요!', en:'Solve all the α²+β² problems in 5 minutes!', zh:'5分钟内解答所有求α²+β²的题！' }
  },

  stamp:{ label:{ ko:'근과 계수 마법사', en:'Roots & Coefficients Wizard', zh:'根与系数魔法师' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'근을 몰라도 합과 곱만으로 풀었구나! 🌈',en:'You solved it using just the sum and product, no roots needed!',zh:'不知道根，只用和与积就解出来了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'α+β=-b, αβ=c야 — 부호에 주의해!',en:'α+β=-b, αβ=c — watch the sign!',zh:'α+β=-b，αβ=c——注意符号！'}, {ko:'x²의 계수가 1이 아니면 a로 나눠야 해!',en:'If the x² coefficient isn\'t 1, divide by a!',zh:'x²系数不是1就要除以a！'} ],
    finish:{ ko:'완벽해! 근과 계수 마법사! 🌈✨', en:'Perfect! Roots & Coefficients Wizard!', zh:'完美！根与系数魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
