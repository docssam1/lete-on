/* Numbers of Magic — 유닛 M-130: 유리식의 계산 (고등 공통수학2 · 과정 58 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD130. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-130'] = {
  id:'M-130', tier:'highmath2', level:'58', order:130,
  generator:'md130_ratExpr',
  title:{ ko:'유리식의 계산', en:'Rational Expressions', zh:'分式的运算' },
  subtitle:{ ko:'분수처럼 통분하고 약분합니다', en:'Common denominators and cancelling, just like fractions', zh:'像分数一样通分与约分' },
  icon:'➗',

  practice:{
    generator:'md130_ratExpr', level:'practice', count:6,
    params:{mode:'arith'},
    intro:{
      ko:'덧셈·뺄셈은 통분하고, 곱셈·나눗셈은 인수분해한 뒤 약분합니다. 결과를 오른쪽 식과 비교해 a, b 를 씁니다.',
      en:'Add and subtract over a common denominator; multiply and divide after factoring and cancelling. Compare with the right-hand side to find a and b.',
      zh:'加减先通分，乘除先因式分解再约分。与右边的式子比较，写出a、b。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'1/2+1/3 을 계산할 때 분모를 6 으로 맞추듯, 1/(x−1)+1/(x+2) 도 분모를 (x−1)(x+2) 로 맞춥니다. 유리식은 문자가 들어간 분수입니다.',
        en:'Just as 1/2+1/3 needs the common denominator 6, 1/(x−1)+1/(x+2) needs (x−1)(x+2). Rational expressions are fractions with letters.',
        zh:'就像计算1/2+1/3要把分母化为6，1/(x−1)+1/(x+2)也要把分母化为(x−1)(x+2)。分式就是含字母的分数。' }
    },
    stages:[
      { tag:{ko:'① 통분',en:'1) Common denominator',zh:'① 通分'},
        head:{ko:'\\dfrac{2}{x-1}+\\dfrac{1}{x+2}=\\dfrac{3x+3}{(x-1)(x+2)}',en:'\\dfrac{2}{x-1}+\\dfrac{1}{x+2}=\\dfrac{3x+3}{(x-1)(x+2)}',zh:'\\dfrac{2}{x-1}+\\dfrac{1}{x+2}=\\dfrac{3x+3}{(x-1)(x+2)}'},
        desc:{ko:'분자는 2(x+2)+(x−1)=3x+3 입니다. (ax+b)/((x−1)(x+2)) 꼴과 비교하면 a=<b>3</b>, b=<b>3</b> 입니다.',
              en:'The numerator is 2(x+2)+(x−1)=3x+3; comparing with (ax+b)/((x−1)(x+2)) gives a=<b>3</b> and b=<b>3</b>.',
              zh:'分子为2(x+2)+(x−1)=3x+3，与(ax+b)/((x−1)(x+2))比较得a=<b>3</b>，b=<b>3</b>。'},
        mathSteps:['2(x+2)+(x-1)=3x+3'],
        result:{ko:'분모를 맞추고 분자끼리!',en:'Match denominators, add numerators!',zh:'分母统一，分子相加！'},
        book:{ko:'곱셈·나눗셈은 먼저 인수분해해 같은 인수를 약분합니다. 나눗셈은 뒤의 식을 뒤집어 곱합니다.',
              en:'For multiplication and division, factor first and cancel common factors; to divide, flip the second expression and multiply.',
              zh:'乘除时先因式分解约去相同因式；除法把后面的式子倒过来相乘。'} },

      { tag:{ko:'② 부분분수',en:'2) Partial fractions',zh:'② 部分分式'},
        head:{ko:'\\dfrac{1}{1\\times2}+\\cdots+\\dfrac{1}{9\\times10}=1-\\dfrac{1}{10}=\\dfrac{9}{10}',en:'\\dfrac{1}{1\\times2}+\\cdots+\\dfrac{1}{9\\times10}=1-\\dfrac{1}{10}=\\dfrac{9}{10}',zh:'\\dfrac{1}{1\\times2}+\\cdots+\\dfrac{1}{9\\times10}=1-\\dfrac{1}{10}=\\dfrac{9}{10}'},
        desc:{ko:'1/(k(k+1))=1/k−1/(k+1) 로 쪼개면 가운데 항이 모두 지워지고 1−1/10 만 남아 <b>9/10</b> 입니다.',
              en:'Split 1/(k(k+1))=1/k−1/(k+1): every middle term cancels, leaving 1−1/10=<b>9/10</b>.',
              zh:'拆成1/(k(k+1))=1/k−1/(k+1)后中间项全部抵消，只剩1−1/10=<b>9/10</b>。'},
        mathSteps:['\\dfrac{1}{k(k+1)}=\\dfrac{1}{k}-\\dfrac{1}{k+1}'],
        result:{ko:'쪼개면 줄줄이 지워집니다!',en:'Split it and it collapses!',zh:'一拆就连环抵消！'},
        book:{ko:'두 인수의 차가 d 이면 1/(AB)=(1/d)(1/A−1/B) 처럼 앞에 1/d 을 곱합니다.',
              en:'If the two factors differ by d, then 1/(AB)=(1/d)(1/A−1/B): multiply by 1/d in front.',
              zh:'两个因式相差d时，1/(AB)=(1/d)(1/A−1/B)，前面要乘1/d。'} },

      { tag:{ko:'③ 번분수',en:'3) Complex fractions',zh:'③ 繁分式'},
        head:{ko:'\\dfrac{10}{7}=1+\\dfrac{1}{2+\\frac{1}{3}}',en:'\\dfrac{10}{7}=1+\\dfrac{1}{2+\\frac{1}{3}}',zh:'\\dfrac{10}{7}=1+\\dfrac{1}{2+\\frac{1}{3}}'},
        desc:{ko:'10/7=1+3/7 이고 3/7=1/(7/3), 7/3=2+1/3 입니다. 그래서 a=1, b=2, c=3 이고 a+b+c=<b>6</b> 입니다.',
              en:'10/7=1+3/7, 3/7=1/(7/3), and 7/3=2+1/3. So a=1, b=2, c=3 and a+b+c=<b>6</b>.',
              zh:'10/7=1+3/7，3/7=1/(7/3)，7/3=2+1/3。所以a=1、b=2、c=3，a+b+c=<b>6</b>。'},
        mathSteps:['\\dfrac{10}{7}=1+\\dfrac{3}{7}','\\dfrac{7}{3}=2+\\dfrac{1}{3}'],
        result:{ko:'떼어 내고 뒤집기!',en:'Take out, then flip!',zh:'取出，再倒过来！'},
        book:{ko:'문자가 있는 번분수는 분자와 분모에 x 같은 식을 곱해 작은 분수를 없앱니다.',
              en:'For complex fractions with letters, multiply the numerator and denominator by an expression such as x to clear the small fractions.',
              zh:'含字母的繁分式，给分子分母同乘x之类的式子，消去小分数。'} }
    ],
    rule:{ ko:'① 덧셈·뺄셈은 통분, 곱셈·나눗셈은 약분  ② 1/(AB)=(1/(B−A))(1/A−1/B)  ③ 번분수는 곱해서 정리하거나 떼어 내고 뒤집기',
      en:'① Add/subtract: common denominator; multiply/divide: cancel  ② 1/(AB)=(1/(B−A))(1/A−1/B)  ③ Complex fractions: multiply to clear, or take out and flip',
      zh:'① 加减通分，乘除约分  ② 1/(AB)=(1/(B−A))(1/A−1/B)  ③ 繁分式：同乘化简，或取出再倒过来' }
  },

  check:{
    fills:[
      { tex:{ko:'\\dfrac{1}{x}-\\dfrac{1}{x+1}=\\dfrac{1}{x(x+\\square)}',en:'\\dfrac{1}{x}-\\dfrac{1}{x+1}=\\dfrac{1}{x(x+\\square)}',zh:'\\dfrac{1}{x}-\\dfrac{1}{x+1}=\\dfrac{1}{x(x+\\square)}'}, answer:1,
        hint:{ ko:'(x+1)−x=1', en:'(x+1)−x=1', zh:'(x+1)−x=1' } },
      { tex:{ko:'\\dfrac{1}{1\\times2}+\\dfrac{1}{2\\times3}+\\dfrac{1}{3\\times4}=\\dfrac{\\square}{4}',en:'\\dfrac{1}{1\\times2}+\\dfrac{1}{2\\times3}+\\dfrac{1}{3\\times4}=\\dfrac{\\square}{4}',zh:'\\dfrac{1}{1\\times2}+\\dfrac{1}{2\\times3}+\\dfrac{1}{3\\times4}=\\dfrac{\\square}{4}'}, answer:3,
        hint:{ ko:'1−1/4', en:'1−1/4', zh:'1−1/4' } }
    ],
    open:{ ko:'1/(1×3)+1/(3×5) 를 부분분수로 계산할 때 앞에 1/2 을 곱해야 하는 까닭을 설명해 봅니다.',
      en:'Explain why a factor 1/2 is needed in front when computing 1/(1×3)+1/(3×5) with partial fractions.',
      zh:'说说用部分分式计算1/(1×3)+1/(3×5)时前面为什么要乘1/2。' },
    openHint:{ ko:'1/1−1/3=2/3 처럼 두 인수의 차 2 가 분자에 생기므로 1/2 을 곱해 1 로 맞춥니다.',
      en:'1/1−1/3=2/3: the difference 2 of the factors appears in the numerator, so multiply by 1/2 to get back to 1.',
      zh:'1/1−1/3=2/3，两个因式之差2出现在分子上，所以乘1/2使其变回1。' }
  },

  lab:{
    generator:'md130_ratExpr', level:'main', count:6,
    params:{mode:'partial'},
    intro:{
      ko:'각 항을 부분분수로 쪼개 가운데를 지우고, 처음과 끝만 남은 식을 정리합니다.',
      en:'Split each term into partial fractions, cancel the middle, and simplify what is left of the first and last terms.',
      zh:'把每一项拆成部分分式，消去中间项，整理只剩首末两项的式子。'
    }
  },

  arena:{
    generator:'md130_ratExpr', level:'main', count:6, timeLimit:420,
    params:{mode:'complex'},
    rule:{ ko:'7분 안에 번분수 식의 값을 모두 구합니다!', en:'Evaluate every complex fraction within 7 minutes!', zh:'7分钟内求出所有繁分式的值！' }
  },

  stamp:{ label:{ ko:'분수 정리사', en:'Fraction Tidier', zh:'分式整理师' }, coins:51 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'깔끔하게 정리했어! ➗',en:'Neatly simplified!',zh:'整理得很干净！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'분모부터 맞춰 봐!',en:'Match the denominators first!',zh:'先把分母统一！'}, {ko:'쪼개서 지워지는 항을 찾아봐!',en:'Split and look for terms that cancel!',zh:'拆开找能抵消的项！'} ],
    finish:{ ko:'완벽해! 분수 정리사! ➗✨', en:'Perfect! Fraction Tidier!', zh:'完美！分式整理师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
