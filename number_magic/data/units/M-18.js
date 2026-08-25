/* Numbers of Magic — 유닛 M-18: 분모의 유리화 (중등 W10 · 중3 제곱근과 실수) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-18'] = {
  id:'M-18', tier:'middle3', level:'35', order:18,
  generator:'md18_rationalize',
  title:{ ko:'분모의 유리화', en:'Rationalizing the Denominator', zh:'分母有理化' },
  subtitle:{ ko:'분모에서 근호를 쫓아내요 — 분자·분모에 같은 근호를 곱해서', en:'Chase the root out of the denominator — multiply top and bottom by the same root', zh:'把根号从分母赶出去——分子分母同乘一个相同的根号' },
  icon:'🚪',

  practice:{
    generator:'md18_rationalize', level:'practice', count:5,
    params:{level:'plain'},
    intro:{
      ko:'1/√2는 분모에 근호가 있어 계산이 불편해요. 분자·분모에 √2를 곱하면 √2/2로 바뀌어요!',
      en:'1/√2 has a root in the denominator, which makes calculation awkward. Multiply top and bottom by √2, and it becomes √2/2!',
      zh:'1/√2的分母有根号，算起来不方便。分子分母同乘√2，就变成√2/2！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'1/√2를 계산기 없이 어림해야 한다면 어떨까요? 분모에 근호가 있으면 크기를 가늠하기 어려워요 — 분모를 "깨끗한 정수"로 만들 방법이 있을까요?',
        en:'What if you had to estimate 1/√2 without a calculator? When the denominator has a root, it\'s hard to judge its size — is there a way to make the denominator a "clean integer"?',
        zh:'如果不用计算器估算1/√2会怎样？分母有根号时很难判断大小——有没有办法把分母变成"干净的整数"？' },
      history:{ ko:'분모의 유리화는 계산기가 없던 시절 특히 중요했어요. 손으로 근삿값을 계산할 때, 근호가 분모에 있으면 나눗셈이 훨씬 번거로웠거든요 — 분자로 옮겨두면 계산이 한결 쉬워졌어요.',
        en:'Rationalizing the denominator mattered a lot before calculators existed. When computing approximate values by hand, having a root in the denominator made division far more tedious — moving it to the numerator made things much easier.',
        zh:'在没有计算器的年代，分母有理化尤为重要。手算近似值时，分母有根号会让除法麻烦得多——把根号挪到分子上，计算就轻松多了。' }
    },
    stages:[
      { tag:{ko:'① 같은 근호를 분자·분모에 곱하기',en:'1) Multiply top and bottom by the same root',zh:'① 分子分母同乘一个相同的根号'},
        head:{ko:'\\dfrac{1}{\\sqrt2} = \\dfrac{\\sqrt2}{2}',en:'\\dfrac{1}{\\sqrt2} = \\dfrac{\\sqrt2}{2}',zh:'\\dfrac{1}{\\sqrt2} = \\dfrac{\\sqrt2}{2}'},
        desc:{ko:'√2×√2=2(제곱근을 다시 제곱하면 근호가 사라짐)를 이용해요. 분자와 분모에 <b>똑같이 √2를 곱하면</b> 분수의 값은 그대로인데 분모의 근호만 사라져요: 1×√2/(√2×√2) = √2/2.',
              en:'We use the fact that √2×√2=2 (squaring a root cancels it). Multiplying <b>both top and bottom by the same √2</b> keeps the fraction\'s value unchanged while removing the root from the denominator: 1×√2/(√2×√2) = √2/2.',
              zh:'利用√2×√2=2(平方根再平方，根号消失)这个事实。<b>分子分母同乘√2</b>，分数的值不变，但分母的根号消失了：1×√2/(√2×√2) = √2/2。'},
        mathSteps:['\\dfrac{1}{\\sqrt2}', '=\\dfrac{1\\times\\sqrt2}{\\sqrt2\\times\\sqrt2}', '=\\dfrac{\\sqrt2}{2}'],
        result:{ko:'분모·분자에 같은 근호를 곱하면 분모의 근호가 사라져요!',en:'Multiply top and bottom by the same root, and the denominator\'s root disappears!',zh:'分子分母同乘相同根号，分母的根号就消失了！'},
        book:{ko:'분모에 근호가 있는 분수를, 분자·분모에 같은 수를 곱해 분모를 유리수(근호 없는 수)로 만드는 것을 <b>분모의 유리화</b>라고 해요.',
              en:'Turning a fraction with a root in the denominator into one with a rational (root-free) denominator, by multiplying top and bottom by the same number, is called <b>rationalizing the denominator</b>.',
              zh:'把分母有根号的分数，通过分子分母同乘一个相同的数，变成分母是有理数(无根号)的分数，这叫做<b>分母有理化</b>。'} },

      { tag:{ko:'② 분모의 근호부터 정리해야 할 때',en:'2) When the denominator\'s root needs simplifying first',zh:'② 分母的根号需要先化简的时候'},
        head:{ko:'\\dfrac{1}{\\sqrt8} = \\dfrac{1}{2\\sqrt2} = \\dfrac{\\sqrt2}{4}',en:'\\dfrac{1}{\\sqrt8} = \\dfrac{1}{2\\sqrt2} = \\dfrac{\\sqrt2}{4}',zh:'\\dfrac{1}{\\sqrt8} = \\dfrac{1}{2\\sqrt2} = \\dfrac{\\sqrt2}{4}'},
        desc:{ko:'분모가 √8처럼 아직 안 정리된 근호라면, <b>먼저 근호 정리부터</b> 해요: √8=2√2. 그다음 유리화: 분자·분모에 √2를 곱해 1×√2/(2√2×√2) = √2/4.',
              en:'If the denominator is an unsimplified root like √8, <b>simplify it first</b>: √8=2√2. Then rationalize: multiply top and bottom by √2 to get 1×√2/(2√2×√2) = √2/4.',
              zh:'如果分母是像√8这样还没化简的根号，<b>先化简根号</b>：√8=2√2。然后再有理化：分子分母同乘√2得到1×√2/(2√2×√2) = √2/4。'},
        mathSteps:['\\sqrt8=2\\sqrt2', '\\dfrac1{2\\sqrt2}=\\dfrac{\\sqrt2}{2\\times2}', '=\\dfrac{\\sqrt2}{4}'],
        result:{ko:'근호 정리 → 유리화, 두 기술을 순서대로 이어 써요!',en:'Simplify the radical, then rationalize — chain the two skills in order!',zh:'先化简根号，再有理化——按顺序衔接这两项技能！'},
        book:{ko:'분모가 a√b 꼴이면 √b를 분자·분모에 곱해요: c/(a√b) = c√b/(ab).',
              en:'If the denominator has the form a√b, multiply top and bottom by √b: c/(a√b) = c√b/(ab).',
              zh:'如果分母是a√b的形式，就分子分母同乘√b：c/(a√b) = c√b/(ab)。'} }
    ],
    rule:{ ko:'① 분자·분모에 분모와 같은 근호를 곱함  ② √a×√a=a로 분모의 근호가 사라짐  ③ 분모가 안 정리돼 있으면 근호 정리부터 먼저',
      en:'① Multiply top and bottom by the denominator\'s root  ② √a×√a=a removes the denominator\'s root  ③ If the denominator isn\'t simplified, simplify it first',
      zh:'① 分子分母同乘分母的根号  ② √a×√a=a使分母的根号消失  ③ 分母未化简时先化简根号' }
  },

  check:{
    fills:[
      { tex:'\\dfrac{1}{\\sqrt3} = \\dfrac{\\sqrt{\\square}}{\\square}', answer:[3,3],
        hint:{ ko:'분자·분모에 √3을 곱해요', en:'Multiply top and bottom by √3', zh:'分子分母同乘√3' } },
      { tex:'\\dfrac{4}{\\sqrt5} = \\dfrac{4\\sqrt{\\square}}{\\square}', answer:[5,5],
        hint:{ ko:'계수 4는 그대로 두고 근호만 옮겨요', en:'Keep the coefficient 4 as is, only move the root', zh:'系数4不变，只处理根号' } }
    ],
    open:{ ko:'1/√12는 어떻게 유리화할까요?',
      en:'How do you rationalize 1/√12?',
      zh:'1/√12怎么有理化？' },
    openHint:{ ko:'√12=2√3부터 정리 → 1/(2√3) = √3/6',
      en:'First simplify √12=2√3 → 1/(2√3) = √3/6',
      zh:'先化简√12=2√3 → 1/(2√3) = √3/6' }
  },

  lab:{
    generator:'md18_rationalize', level:'main', count:4,
    params:{level:'coef'},
    intro:{
      ko:'분자에 계수가 있어도 방법은 똑같아! 근호만 처리하면 돼.',
      en:'Even with a coefficient in the numerator, the method is the same! Just handle the root.',
      zh:'分子有系数方法也一样！只需要处理根号。'
    }
  },

  arena:{
    generator:'md18_rationalize', level:'main', count:8, timeLimit:300,
    params:{level:'messyDenom'},
    rule:{ ko:'5분 안에 분모부터 정리해야 하는 유리화를 모두 풀어요!', en:'Solve all the rationalize-after-simplifying problems in 5 minutes!', zh:'5分钟内解答所有需要先化简分母的有理化题！' }
  },

  stamp:{ label:{ ko:'분모 청소부', en:'Denominator Cleaner', zh:'分母清洁工' }, coins:48 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'분모의 근호를 깔끔히 몰아냈어! 🚪',en:'You cleared the root out of the denominator perfectly!',zh:'把分母的根号赶得干干净净！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'분자·분모에 분모와 같은 근호를 곱해봐!',en:'Multiply top and bottom by the same root as the denominator!',zh:'分子分母同乘分母那个根号！'}, {ko:'분모가 안 정리돼 있으면 근호 정리부터 해봐!',en:'If the denominator isn\'t simplified, simplify it first!',zh:'分母没化简的话先化简根号！'} ],
    finish:{ ko:'완벽해! 분모 청소부! 🚪✨', en:'Perfect! Denominator Cleaner!', zh:'完美！分母清洁工！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
