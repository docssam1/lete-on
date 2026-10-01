/* Numbers of Magic — 유닛 M-132: 무리식의 계산 (고등 공통수학2 · 과정 59 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD132. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-132'] = {
  id:'M-132', tier:'highmath2', level:'59', order:132,
  generator:'md132_radExpr',
  title:{ ko:'무리식의 계산', en:'Irrational Expressions', zh:'无理式的运算' },
  subtitle:{ ko:'근호 안을 살피고, 분모를 유리화합니다', en:'Watch the radicand, rationalize the denominator', zh:'看根号内，把分母有理化' },
  icon:'🌱',

  practice:{
    generator:'md132_radExpr', level:'practice', count:6,
    params:{mode:'real'},
    intro:{
      ko:'근호 안은 0 이상, 분모는 0 이 아니어야 합니다. 조건을 모두 모아 x 의 범위를 정하고 그 안의 정수를 셉니다.',
      en:'Each radicand must be at least 0 and a denominator must not be 0. Combine the conditions into a range for x and count the integers in it.',
      zh:'根号内不小于0，分母不为0。把条件合起来确定x的范围，再数其中的整数。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'√(−4) 는 실수가 아닙니다. 그래서 문자가 들어간 근호는 "근호 안이 0 이상" 이라는 조건을 달고 다닙니다. 그리고 분모의 근호는 켤레를 곱해 없애면 계산이 훨씬 쉬워집니다.',
        en:'√(−4) is not a real number, so a radical with a letter always carries the condition "radicand at least 0". And a radical in a denominator is much easier to handle once the conjugate removes it.',
        zh:'√(−4)不是实数，所以含字母的根式总带着"根号内不小于0"的条件。分母中的根号用共轭式乘掉后，计算就容易多了。' }
    },
    stages:[
      { tag:{ko:'① 실수가 될 조건',en:'1) When it is real',zh:'① 为实数的条件'},
        head:{ko:'x-2\\ge 0,\\ 6-x\\ge 0\\ \\Rightarrow\\ 2\\le x\\le 6',en:'x-2\\ge 0,\\ 6-x\\ge 0\\ \\Rightarrow\\ 2\\le x\\le 6',zh:'x-2\\ge 0,\\ 6-x\\ge 0\\ \\Rightarrow\\ 2\\le x\\le 6'},
        desc:{ko:'√(x−2)+√(6−x) 가 실수가 되려면 2≤x≤6 이어야 합니다. 정수 x 는 2, 3, 4, 5, 6 의 <b>5</b> 개입니다.',
              en:'For √(x−2)+√(6−x) to be real we need 2≤x≤6. The integers are 2, 3, 4, 5, 6: <b>5</b> of them.',
              zh:'要使√(x−2)+√(6−x)为实数，需2≤x≤6。整数x有2、3、4、5、6，共<b>5</b>个。'},
        mathSteps:['2\\le x\\le 6'],
        result:{ko:'근호 안은 0 이상!',en:'Radicand at least 0!',zh:'根号内不小于0！'},
        book:{ko:'근호가 분모에 있으면 0 도 안 되므로 등호가 빠집니다. 1/√(6−x) 이면 x<6 입니다.',
              en:'If the radical is in a denominator, 0 is not allowed either, so the equality drops: 1/√(6−x) needs x<6.',
              zh:'根号在分母中时也不能为0，等号要去掉：1/√(6−x)要求x<6。'} },

      { tag:{ko:'② 분모의 유리화',en:'2) Rationalizing',zh:'② 分母有理化'},
        head:{ko:'\\dfrac{1}{\\sqrt{k}+\\sqrt{k+1}}=\\sqrt{k+1}-\\sqrt{k}',en:'\\dfrac{1}{\\sqrt{k}+\\sqrt{k+1}}=\\sqrt{k+1}-\\sqrt{k}',zh:'\\dfrac{1}{\\sqrt{k}+\\sqrt{k+1}}=\\sqrt{k+1}-\\sqrt{k}'},
        desc:{ko:'1/(√1+√2)+1/(√2+√3)+…+1/(√8+√9) 는 유리화하면 가운데가 모두 지워져 √9−√1=<b>2</b> 입니다.',
              en:'After rationalizing, 1/(√1+√2)+1/(√2+√3)+…+1/(√8+√9) collapses to √9−√1=<b>2</b>.',
              zh:'把1/(√1+√2)+1/(√2+√3)+…+1/(√8+√9)有理化后中间全部抵消，得√9−√1=<b>2</b>。'},
        mathSteps:['\\sqrt{9}-\\sqrt{1}=2'],
        result:{ko:'켤레를 곱하면 사라집니다!',en:'Multiply by the conjugate and it vanishes!',zh:'乘以共轭式就消失了！'},
        book:{ko:'(√A+√B)(√A−√B)=A−B 이므로 분모의 근호가 없어집니다.',
              en:'(√A+√B)(√A−√B)=A−B, so the radicals leave the denominator.',
              zh:'(√A+√B)(√A−√B)=A−B，所以分母中的根号消失。'} },

      { tag:{ko:'③ 식의 값',en:'3) Values of expressions',zh:'③ 式子的值'},
        head:{ko:'x+y=2\\sqrt{3},\\ xy=1\\ \\Rightarrow\\ x^2+y^2=10',en:'x+y=2\\sqrt{3},\\ xy=1\\ \\Rightarrow\\ x^2+y^2=10',zh:'x+y=2\\sqrt{3},\\ xy=1\\ \\Rightarrow\\ x^2+y^2=10'},
        desc:{ko:'x=√3+√2, y=√3−√2 이면 x+y=2√3, xy=1 입니다. x²+y²=(x+y)²−2xy=12−2=<b>10</b> 입니다.',
              en:'With x=√3+√2 and y=√3−√2: x+y=2√3 and xy=1, so x²+y²=(x+y)²−2xy=12−2=<b>10</b>.',
              zh:'x=√3+√2、y=√3−√2时x+y=2√3，xy=1，所以x²+y²=(x+y)²−2xy=12−2=<b>10</b>。'},
        mathSteps:['(x+y)^2-2xy=12-2'],
        result:{ko:'합과 곱으로 한 번에!',en:'Sum and product do it all!',zh:'用和与积一步到位！'},
        book:{ko:'x=2+√3 이면 (x−2)²=3 이므로 x²−4x+1=0 입니다. 이 식을 쓰면 복잡한 식의 값도 쉽게 구합니다.',
              en:'If x=2+√3 then (x−2)²=3, i.e. x²−4x+1=0 — which makes complicated expressions easy to evaluate.',
              zh:'若x=2+√3，则(x−2)²=3，即x²−4x+1=0，用它能轻松求复杂式子的值。'} }
    ],
    rule:{ ko:'① 근호 안은 0 이상, 분모는 0 이 아님  ② 켤레를 곱해 분모를 유리화  ③ 합과 곱으로 식의 값',
      en:'① Radicand at least 0, denominator not 0  ② Multiply by the conjugate to rationalize  ③ Evaluate with the sum and product',
      zh:'① 根号内不小于0，分母不为0  ② 乘以共轭式使分母有理化  ③ 用和与积求值' }
  },

  check:{
    fills:[
      { tex:{ko:'\\dfrac{1}{\\sqrt{2}+1}=\\sqrt{2}-\\square',en:'\\dfrac{1}{\\sqrt{2}+1}=\\sqrt{2}-\\square',zh:'\\dfrac{1}{\\sqrt{2}+1}=\\sqrt{2}-\\square'}, answer:1,
        hint:{ ko:'(√2+1)(√2−1)=1', en:'(√2+1)(√2−1)=1', zh:'(√2+1)(√2−1)=1' } },
      { tex:{ko:'x=\\sqrt{5}+\\sqrt{3},\\ y=\\sqrt{5}-\\sqrt{3}\\ \\Rightarrow\\ xy=\\square',en:'x=\\sqrt{5}+\\sqrt{3},\\ y=\\sqrt{5}-\\sqrt{3}\\ \\Rightarrow\\ xy=\\square',zh:'x=\\sqrt{5}+\\sqrt{3},\\ y=\\sqrt{5}-\\sqrt{3}\\ \\Rightarrow\\ xy=\\square'}, answer:2,
        hint:{ ko:'5−3', en:'5−3', zh:'5−3' } }
    ],
    open:{ ko:'x=√5+√3, y=√5−√3 일 때 x²+y² 를 바로 넣어 계산하는 것보다 x+y, xy 를 먼저 구하는 편이 쉬운 까닭을 설명해 봅니다.',
      en:'For x=√5+√3 and y=√5−√3, explain why finding x+y and xy first is easier than substituting straight into x²+y².',
      zh:'对x=√5+√3、y=√5−√3，说说为什么先求x+y与xy比直接代入x²+y²更简单。' },
    openHint:{ ko:'x+y=2√5, xy=2 는 근호가 거의 없거나 사라진 간단한 값이라 (x+y)²−2xy=20−4=16 으로 바로 끝납니다.',
      en:'x+y=2√5 and xy=2 are simple values with the radicals mostly gone, so (x+y)²−2xy=20−4=16 at once.',
      zh:'x+y=2√5、xy=2都很简单，根号几乎消失了，所以(x+y)²−2xy=20−4=16，一步就完成。' }
  },

  lab:{
    generator:'md132_radExpr', level:'main', count:6,
    params:{mode:'ration'},
    intro:{
      ko:'분모의 근호를 켤레를 곱해 없앤 뒤, 여러 항이면 가운데가 지워지는지 봅니다.',
      en:'Remove the radicals from the denominator with the conjugate, and with many terms look for the middle ones to cancel.',
      zh:'用共轭式消去分母中的根号；项多时看看中间项是否抵消。'
    }
  },

  arena:{
    generator:'md132_radExpr', level:'main', count:6, timeLimit:420,
    params:{mode:'value'},
    rule:{ ko:'7분 안에 합과 곱을 이용해 식의 값을 모두 구합니다!', en:'Evaluate every expression using the sum and product within 7 minutes!', zh:'7分钟内利用和与积求出所有式子的值！' }
  },

  stamp:{ label:{ ko:'근호 정원사', en:'Radical Gardener', zh:'根号园丁' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'근호를 깔끔하게 정리했어! 🌱',en:'Radicals neatly handled!',zh:'根号整理得很干净！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'근호 안이 0 이상인지 봐!',en:'Check the radicand is at least 0!',zh:'看看根号内是否不小于0！'}, {ko:'켤레를 곱해 봐!',en:'Try multiplying by the conjugate!',zh:'试着乘以共轭式！'} ],
    finish:{ ko:'완벽해! 근호 정원사! 🌱✨', en:'Perfect! Radical Gardener!', zh:'完美！根号园丁！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
