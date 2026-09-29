/* Numbers of Magic — 유닛 M-110: 합의 법칙과 곱의 법칙 (고등 공통수학1 · 과정 46, 2026-09-29)
   근거: docs/high-build-spec.md MD110. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-110'] = {
  id:'M-110', tier:'highmath1', level:'46', order:110,
  generator:'md110_sumProduct',
  title:{ ko:'합의 법칙과 곱의 법칙', en:'The Addition and Multiplication Rules', zh:'加法原理与乘法原理' },
  subtitle:{ ko:'"또는"은 더하고, "잇달아"는 곱합니다', en:'"Or" adds, "then" multiplies', zh:'"或"相加，"接着"相乘' },
  icon:'🎲',

  practice:{
    generator:'md110_sumProduct', level:'practice', count:6,
    params:{mode:'sum'},
    intro:{
      ko:'동시에 일어나지 않는 경우들은 더합니다. 겹치는 경우가 있으면 한 번만 세도록 뺍니다.',
      en:'Add cases that cannot happen together; if some overlap, subtract so they are counted once.',
      zh:'不能同时发生的情况相加；有重叠时减去，使其只算一次。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'경우의 수를 하나하나 적으면 금방 지칩니다. "이것 아니면 저것"은 더하고, "이것 다음에 저것"은 곱한다는 두 가지 법칙만 있으면 큰 수도 순식간에 셀 수 있습니다.',
        en:'Listing every case one by one soon wears you out. With two rules — add for "this or that", multiply for "this, then that" — even large counts take a moment.',
        zh:'把情况一个个列出来很快就累了。只要两条原理——"这个或那个"相加，"这个接着那个"相乘——再大的数也能瞬间数出。' }
    },
    stages:[
      { tag:{ko:'① 합의 법칙',en:'1) Addition rule',zh:'① 加法原理'},
        head:{ko:'3+4=7',en:'3+4=7',zh:'3+4=7'},
        desc:{ko:'주사위 두 개를 던져 눈의 합이 4 인 경우는 3가지, 5 인 경우는 4가지입니다. 합이 4 또는 5 인 경우는 겹치지 않으므로 <b>3+4=7</b> 가지입니다.',
              en:'Throwing two dice, a sum of 4 happens 3 ways and a sum of 5 happens 4 ways. They cannot happen together, so a sum of 4 or 5 happens <b>3+4=7</b> ways.',
              zh:'掷两枚骰子，点数和为4有3种，为5有4种。两者不会同时发生，所以和为4或5有<b>3+4=7</b>种。'},
        mathSteps:['3+4=7'],
        result:{ko:'"또는"이면 더합니다!',en:'"Or" means add!',zh:'"或"就相加！'},
        book:{ko:'"2 의 배수 또는 3 의 배수"처럼 겹치면, 6 의 배수를 한 번 빼 줍니다.',
              en:'When cases overlap, as in "multiple of 2 or of 3", subtract the multiples of 6 once.',
              zh:'像"2的倍数或3的倍数"这样有重叠时，减去一次6的倍数。'} },

      { tag:{ko:'② 곱의 법칙',en:'2) Multiplication rule',zh:'② 乘法原理'},
        head:{ko:'3\\times4=12',en:'3\\times4=12',zh:'3\\times4=12'},
        desc:{ko:'A 에서 B 로 가는 길이 3가지, B 에서 C 로 가는 길이 4가지이면, 길마다 다음 길을 4가지씩 고를 수 있어 A→B→C 는 <b>12</b> 가지입니다.',
              en:'With 3 roads A→B and 4 roads B→C, each first road can be followed by any of 4, so A→B→C has <b>12</b> ways.',
              zh:'A到B有3条路、B到C有4条路，每条路之后都能选4条，所以A→B→C有<b>12</b>种。'},
        mathSteps:['3\\times4=12'],
        result:{ko:'"잇달아"이면 곱합니다!',en:'"Then" means multiply!',zh:'"接着"就相乘！'},
        book:{ko:'(a+b)(x+y+z) 를 전개하면 2×3=6 개의 항이 생기는 것도 곱의 법칙입니다.',
              en:'Expanding (a+b)(x+y+z) into 2×3=6 terms is the multiplication rule too.',
              zh:'(a+b)(x+y+z)展开成2×3=6项，也是乘法原理。'} },

      { tag:{ko:'③ 약수의 개수',en:'3) Counting divisors',zh:'③ 约数的个数'},
        head:{ko:'72=2^3\\times3^2',en:'72=2^3\\times3^2',zh:'72=2^3\\times3^2'},
        desc:{ko:'약수는 2 의 지수(0~3, 4가지)와 3 의 지수(0~2, 3가지)를 하나씩 골라 만듭니다. 그래서 <b>4×3=12</b> 개입니다.',
              en:'A divisor chooses an exponent of 2 (0–3, 4 ways) and of 3 (0–2, 3 ways), so there are <b>4×3=12</b>.',
              zh:'约数由2的指数(0~3，4种)与3的指数(0~2，3种)各取一个构成，所以有<b>4×3=12</b>个。'},
        mathSteps:['(3+1)\\times(2+1)=12'],
        result:{ko:'지수에 1 을 더해 곱합니다!',en:'Add 1 to each exponent and multiply!',zh:'各指数加1再相乘！'},
        book:{ko:'약수의 총합은 (1+2+4+8)(1+3+9)=195 처럼 괄호끼리 곱합니다.',
              en:'The sum of the divisors is the product of brackets: (1+2+4+8)(1+3+9)=195.',
              zh:'约数之和为括号相乘：(1+2+4+8)(1+3+9)=195。'} }
    ],
    rule:{ ko:'① 겹치지 않는 "또는"은 더한다(겹치면 뺀다)  ② "잇달아"는 곱한다  ③ 약수의 개수는 (지수+1) 의 곱입니다',
      en:'① Disjoint "or": add (subtract overlaps)  ② "Then": multiply  ③ Number of divisors: product of (exponent+1)',
      zh:'① 不重叠的"或"相加(重叠则减)  ② "接着"相乘  ③ 约数个数是(指数+1)之积' }
  },

  check:{
    fills:[
      { tex:{ko:'(a+b)(x+y+z)(p+q)\\ \\text{의 항의 개수}=\\square',en:'\\text{number of terms of }(a+b)(x+y+z)(p+q)=\\square',zh:'(a+b)(x+y+z)(p+q)\\ \\text{的项数}=\\square'}, answer:12,
        hint:{ ko:'2×3×2', en:'2×3×2', zh:'2×3×2' } },
      { tex:{ko:'36\\ \\text{의 양의 약수의 개수}=\\square',en:'\\text{number of positive divisors of }36=\\square',zh:'36\\ \\text{的正约数个数}=\\square'}, answer:9,
        hint:{ ko:'36=2²×3² → 3×3', en:'36=2²×3² → 3×3', zh:'36=2²×3² → 3×3' } }
    ],
    open:{ ko:'1 부터 30 까지의 자연수 가운데 2 의 배수 또는 3 의 배수의 개수를 구하는 과정을 설명해 봅니다.',
      en:'Explain how to count the natural numbers from 1 to 30 that are multiples of 2 or of 3.',
      zh:'说说求1到30的自然数中2的倍数或3的倍数的个数的过程。' },
    openHint:{ ko:'15+10−5=20 개입니다. 6 의 배수 5 개가 두 번 세어졌으므로 뺍니다.',
      en:'15+10−5=20. The 5 multiples of 6 were counted twice, so subtract them.',
      zh:'15+10−5=20个。6的倍数5个被算了两次，所以减去。' }
  },

  lab:{
    generator:'md110_sumProduct', level:'main', count:6,
    params:{mode:'product'},
    intro:{
      ko:'단계를 잇달아 거치면 각 단계의 경우의 수를 곱합니다.',
      en:'When steps follow one another, multiply the counts of the steps.',
      zh:'步骤接连进行时，把各步骤的方法数相乘。'
    }
  },

  arena:{
    generator:'md110_sumProduct', level:'main', count:6, timeLimit:420,
    params:{mode:'divisors'},
    rule:{ ko:'7분 안에 약수의 개수와 총합을 모두 구합니다!', en:'Find every divisor count and sum within 7 minutes!', zh:'7分钟内求出所有约数的个数与总和！' }
  },

  stamp:{ label:{ ko:'경우의 수 셈꾼', en:'Case Counter', zh:'计数能手' }, coins:48 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'더할지 곱할지 딱 알았구나! 🎲',en:'You knew exactly when to add and when to multiply!',zh:'知道何时相加何时相乘！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'"또는"은 더하고 "잇달아"는 곱해!',en:'"Or" adds, "then" multiplies!',zh:'"或"相加，"接着"相乘！'}, {ko:'두 번 센 것이 없는지 봐!',en:'Check for anything counted twice!',zh:'看看有没有重复计算的！'} ],
    finish:{ ko:'완벽해! 경우의 수 셈꾼! 🎲✨', en:'Perfect! Case Counter!', zh:'完美！计数能手！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
