/* Numbers of Magic — 유닛 M-03: 유리수의 덧셈과 뺄셈 (중등 W8 · 중1 정수와 유리수) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-03'] = {
  id:'M-03', tier:'middle1', level:'29', order:3,
  generator:'md3_ratAddSub',
  title:{ ko:'유리수의 덧셈과 뺄셈', en:'Adding & Subtracting Rational Numbers', zh:'有理数的加减法' },
  subtitle:{ ko:'분모만 맞추면 정수와 똑같은 규칙이 그대로 통해요', en:'Match the denominators, and the integer rules work exactly the same', zh:'只要分母对齐，整数的规则原封不动地适用' },
  icon:'🧩',

  practice:{
    generator:'md3_ratAddSub', level:'practice', count:5,
    params:{mode:'sameDenom'},
    intro:{
      ko:'분모가 같으면 정수처럼 분자끼리만 더하고 빼면 돼!',
      en:'Same denominator? Just add or subtract the numerators, like integers!',
      zh:'分母相同的话，像整数一样只加减分子就行！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 분모가 같으면 분자만',en:'1) Same denominator — just the numerators',zh:'① 分母相同就只管分子'},
        head:{ko:'\\dfrac{-2}{5} + \\dfrac{-1}{5} = \\dfrac{-3}{5}',en:'\\dfrac{-2}{5} + \\dfrac{-1}{5} = \\dfrac{-3}{5}',zh:'\\dfrac{-2}{5} + \\dfrac{-1}{5} = \\dfrac{-3}{5}'},
        desc:{ko:'분모가 같은 유리수는 분모는 그대로 두고 <b>분자끼리 정수 덧뺄셈 규칙 그대로</b> 계산해요. −2와 −1은 같은 부호니까 절댓값을 더하고 공통 부호 −를 붙여 −3, 분모는 그대로 5예요.',
              en:'When denominators match, keep the denominator and apply the <b>exact same integer ± rule</b> to the numerators. −2 and −1 share a sign, so add the absolute values and keep the shared − sign: −3, over the same denominator 5.',
              zh:'分母相同时，分母不变，分子按<b>整数加减法的规则</b>来算。−2和−1同号，绝对值相加，符号不变，得−3，分母还是5。'},
        mathSteps:['\\dfrac{-2}{5} + \\dfrac{-1}{5}', '(-2)+(-1) = -3', '\\dfrac{-3}{5}'],
        result:{ko:'분모가 같으면 정수 규칙을 분자에 그대로 쓰면 돼요!',en:'Same denominator — just reuse the integer rule on the numerators!',zh:'分母相同——分子直接套用整数规则！'},
        book:null },

      { tag:{ko:'② 분모가 다르면 통분부터',en:'2) Different denominators — convert first',zh:'② 分母不同先通分'},
        head:{ko:'\\dfrac{1}{2} + \\dfrac{-1}{3} = \\dfrac{1}{6}',en:'\\dfrac{1}{2} + \\dfrac{-1}{3} = \\dfrac{1}{6}',zh:'\\dfrac{1}{2} + \\dfrac{-1}{3} = \\dfrac{1}{6}'},
        desc:{ko:'분모가 다르면 <b>최소공배수(LCM)</b>로 통분해서 분모를 맞춰요. 2와 3의 LCM은 6이니까 \\dfrac{1}{2}=\\dfrac{3}{6}, \\dfrac{-1}{3}=\\dfrac{-2}{6} — 이제 분모가 같아졌으니 분자만 계산: 3+(−2)=1.',
              en:'Different denominators? Convert to the <b>LCM</b> (least common multiple) first. LCM of 2 and 3 is 6, so \\dfrac{1}{2}=\\dfrac{3}{6} and \\dfrac{-1}{3}=\\dfrac{-2}{6} — now the denominators match, so just combine numerators: 3+(−2)=1.',
              zh:'分母不同就先通分到<b>最小公倍数(LCM)</b>。2和3的LCM是6，所以\\dfrac{1}{2}=\\dfrac{3}{6}，\\dfrac{-1}{3}=\\dfrac{-2}{6}——现在分母一样了，只算分子：3+(−2)=1。'},
        mathSteps:['\\text{LCM}(2,3)=6', '\\dfrac{3}{6} + \\dfrac{-2}{6}', '\\dfrac{1}{6}'],
        result:{ko:'통분만 마치면 그다음은 이미 아는 규칙이에요!',en:'Once converted, the rest is a rule you already know!',zh:'通分完成之后，剩下的就是已经会的规则了！'},
        book:{ko:'계산 결과가 약분이 되면 기약분수로 나타내는 게 원칙이에요.',
              en:'When the result can be simplified, it should be written as a fraction in lowest terms.',
              zh:'如果结果能约分，就应该化成最简分数。'} }
    ],
    rule:{ ko:'① 분모가 같으면 분자만 정수 규칙으로  ② 분모가 다르면 LCM으로 통분  ③ 통분한 뒤엔 같은 규칙 그대로',
      en:'① Same denominator: just the numerators, integer rules  ② Different: convert to the LCM  ③ After converting, the same rules apply',
      zh:'① 分母相同：分子按整数规则  ② 分母不同：通分到LCM  ③ 通分后同样的规则照用' }
  },

  check:{
    fills:[
      { tex:'\\dfrac{3}{7} + \\dfrac{-5}{7} = \\dfrac{\\square}{7}', answer:-2,
        hint:{ ko:'분모는 그대로, 3+(-5)=?', en:'Denominator stays, 3+(-5)=?', zh:'分母不变，3+(-5)=？' } },
      { tex:'\\text{LCM}(4,\\,6) = \\square', answer:12,
        hint:{ ko:'4와 6의 최소공배수', en:'The least common multiple of 4 and 6', zh:'4和6的最小公倍数' } }
    ],
    open:{ ko:'\\dfrac{1}{4} + \\dfrac{-1}{6}를 통분부터 해서 계산해봐요.',
      en:'Compute 1/4 + (−1/6) by converting to a common denominator first.',
      zh:'先通分，再计算1/4 + (−1/6)。' },
    openHint:{ ko:'LCM(4,6)=12. \\dfrac{3}{12}+\\dfrac{-2}{12}=\\dfrac{1}{12}.',
      en:'LCM(4,6)=12. 3/12 + (−2/12) = 1/12.',
      zh:'LCM(4,6)=12。3/12 + (−2/12) = 1/12。' }
  },

  lab:{
    generator:'md3_ratAddSub', level:'main', count:4,
    params:{mode:'diffDenom'},
    intro:{
      ko:'분모가 다르면 먼저 최소공배수부터 찾아봐!',
      en:'Different denominators — find the LCM first!',
      zh:'分母不同，先找最小公倍数！'
    }
  },

  arena:{
    generator:'md3_ratAddSub', level:'main', count:8, timeLimit:300,
    params:{mode:'chain3'},
    rule:{ ko:'5분 안에 세 유리수 혼합 계산을 모두 풀어요!', en:'Solve all three-term rational mixes in 5 minutes!', zh:'5分钟内解答所有三数有理数混合题！' }
  },

  stamp:{ label:{ ko:'통분의 달인', en:'Common-Denominator Master', zh:'通分达人' }, coins:34 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'통분을 완벽하게 했어! 🧩',en:'Perfect conversion!',zh:'通分做得很完美！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'분모가 같은지 먼저 확인해봐!',en:'Check whether the denominators match first!',zh:'先看看分母是不是一样！'}, {ko:'최소공배수로 통분하는 걸 잊지 마!',en:"Don't forget to convert to the LCM!",zh:'别忘了通分到最小公倍数！'} ],
    finish:{ ko:'완벽해! 통분의 달인! 🧩✨', en:'Perfect! Common-Denominator Master!', zh:'完美！通分达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
