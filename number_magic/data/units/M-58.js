/* Numbers of Magic — 유닛 M-58: 0/0 유리화형 극한 (미적분Ⅰ W14 심화, 2026-08-27) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-58'] = {
  id:'M-58', tier:'calculus1', level:'45', order:1,
  generator:'md58_limitRationalize',
  title:{ ko:'0/0 유리화형 극한', en:'Limits via Rationalization', zh:'0/0型有理化极限' },
  subtitle:{ ko:'켤레를 곱해 근호를 없애요', en:'Multiply by the conjugate to clear the root', zh:'乘以共轭式去掉根号' },
  icon:'√',

  practice:{
    generator:'md58_limitRationalize', level:'practice', count:5,
    params:{mode:'denomRoot'},
    intro:{
      ko:'근호가 있는 0/0 꼴은 켤레(부호만 반대인 짝)를 분모·분자에 곱해요 — 그러면 근호가 사라지고 (x-a)가 약분돼요!',
      en:'For a 0/0 form with a root, multiply top and bottom by the conjugate (same expression, opposite sign) — the root disappears and (x-a) cancels!',
      zh:'带根号的0/0型，把分子分母都乘以共轭式(符号相反的搭档)——根号消失，(x-a)就能约掉！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'lim(x→0) (√(x+4)-2)/x를 보면 x=0을 넣는 순간 0/0이 돼요. MD43에서 배운 인수분해로는 근호를 없앨 수가 없어요 — 근호가 있을 땐 새로운 도구, "켤레"가 필요해요.',
        en:'Looking at lim(x→0) (√(x+4)-2)/x, plugging in x=0 gives 0/0. The factoring trick from MD43 can\'t clear a root — when a root is involved, you need a new tool: the "conjugate".',
        zh:'看lim(x→0) (√(x+4)-2)/x，代入x=0会得到0/0。MD43学的因式分解无法去掉根号——有根号时需要新工具："共轭式"。' },
      history:{ ko:'"켤레(conjugate)"는 같은 두 항에서 부호만 반대인 짝을 말해요. (√A - B)와 (√A + B)를 곱하면 (√A)²-B²=A-B²이 되어 근호가 깔끔하게 사라져요 — 이건 곱셈공식 (x-y)(x+y)=x²-y²와 완전히 같은 원리예요.',
        en:'The "conjugate" is the same two terms with the opposite sign. Multiplying (√A - B) by (√A + B) gives (√A)²-B²=A-B², cleanly removing the root — this is exactly the same principle as the formula (x-y)(x+y)=x²-y².',
        zh:'"共轭式"是指同样两项但符号相反的搭档。(√A - B)乘以(√A + B)得到(√A)²-B²=A-B²，根号被干净地消去——这和乘法公式(x-y)(x+y)=x²-y²完全是同一个道理。' }
    },
    stages:[
      { tag:{ko:'① 켤레를 곱해 분자의 근호를 없애요',en:'1) Multiply by the conjugate to clear the root in the numerator',zh:'① 乘以共轭式去掉分子的根号'},
        head:{ko:'\\lim_{x\\to 0} \\dfrac{\\sqrt{x+4}-2}{x} = \\dfrac{1}{4}',en:'\\lim_{x\\to 0} \\dfrac{\\sqrt{x+4}-2}{x} = \\dfrac{1}{4}',zh:'\\lim_{x\\to 0} \\dfrac{\\sqrt{x+4}-2}{x} = \\dfrac{1}{4}'},
        desc:{ko:'분자·분모에 켤레 (√(x+4)+2)를 곱하면 분자가 (x+4)-4=<b>x</b>가 돼요. 그럼 분자·분모 둘 다 x라서 약분되고, 남는 건 1/(√(x+4)+2) — x=0을 넣으면 1/(2+2)=1/4.',
              en:'Multiplying top and bottom by the conjugate (√(x+4)+2) turns the numerator into (x+4)-4=<b>x</b>. Now both top and bottom are x, so they cancel, leaving 1/(√(x+4)+2) — plugging in x=0 gives 1/(2+2)=1/4.',
              zh:'分子分母乘以共轭式(√(x+4)+2)后，分子变成(x+4)-4=<b>x</b>。此时分子分母都是x，约分后剩下1/(√(x+4)+2)——代入x=0得1/(2+2)=1/4。'},
        mathSteps:['(\\sqrt{x+4}-2)(\\sqrt{x+4}+2)=x', '\\dfrac{x}{x(\\sqrt{x+4}+2)}', '=\\dfrac{1}{4}'],
        result:{ko:'분자에 근호가 있으면 켤레를 곱해 분자를 (x-a)로 만들어요!',en:'When the root is in the numerator, multiply by the conjugate to turn it into (x-a)!',zh:'根号在分子时，乘以共轭式把分子变成(x-a)！'},
        book:{ko:'켤레를 곱하는 건 "1을 곱하는 것"과 같아요(같은 걸 분모·분자에 곱하니까) — 그래서 식의 값은 바뀌지 않아요.',
              en:'Multiplying by the conjugate is the same as "multiplying by 1" (since you multiply top and bottom by the same thing) — so the value of the expression never changes.',
              zh:'乘以共轭式就相当于"乘以1"(因为分子分母乘了同样的东西)——所以式子的值不变。'} },

      { tag:{ko:'② 분모에 근호가 있으면 정수로 딱 떨어져요',en:'2) A root in the denominator lands on an integer',zh:'② 根号在分母时会得到整数'},
        head:{ko:'\\lim_{x\\to 0} \\dfrac{x}{\\sqrt{x+4}-2} = 4',en:'\\lim_{x\\to 0} \\dfrac{x}{\\sqrt{x+4}-2} = 4',zh:'\\lim_{x\\to 0} \\dfrac{x}{\\sqrt{x+4}-2} = 4'},
        desc:{ko:'이번엔 근호가 분모에 있어요. 켤레를 곱하면 분모가 x가 되어 분자의 x와 약분되고, 남는 건 <b>√(x+4)+2</b> — x=0을 넣으면 2+2=4(근호 없이 정수로 끝나요).',
              en:'This time the root is in the denominator. Multiplying by the conjugate turns the denominator into x, which cancels with the x in the numerator, leaving <b>√(x+4)+2</b> — plugging in x=0 gives 2+2=4 (a clean integer, no root).',
              zh:'这次根号在分母。乘以共轭式后分母变成x，和分子的x约分，剩下<b>√(x+4)+2</b>——代入x=0得2+2=4(干净的整数，没有根号)。'},
        mathSteps:['\\dfrac{x(\\sqrt{x+4}+2)}{x}', '=\\sqrt{x+4}+2', '=4'],
        result:{ko:'근호가 분모에 있으면 약분 후 근호값 그대로 정수로 끝나요!',en:'When the root is in the denominator, canceling leaves the root value itself — a clean integer!',zh:'根号在分母时，约分后剩下的根号值本身就是整数！'},
        book:{ko:'분자·분모 어느 쪽에 근호가 있는지에 따라 최종 답의 형태(정수 vs 분수)가 달라진다는 걸 기억해요.',
              en:'Remember that the final answer\'s form (integer vs. fraction) depends on which side — numerator or denominator — has the root.',
              zh:'记住最终答案的形式(整数还是分数)取决于根号在分子还是分母。'} }
    ],
    rule:{ ko:'근호가 있는 0/0 꼴은 켤레를 곱해 근호를 없애요 — 분모의 근호는 정수로, 분자의 근호는 분수(1/2m)로 끝나요!',
      en:'For a 0/0 form with a root, multiply by the conjugate to clear it — a root in the denominator ends in an integer, one in the numerator ends in a fraction (1/2m)!',
      zh:'带根号的0/0型，乘以共轭式去掉根号——根号在分母得到整数，在分子得到分数(1/2m)！' }
  },

  check:{
    fills:[
      { tex:'\\lim_{x\\to 0} \\dfrac{x}{\\sqrt{x+9}-3} = \\square', answer:6,
        hint:{ ko:'약분 후 √(x+9)+3, x=0이면 3+3', en:'After canceling, √(x+9)+3, at x=0 that\'s 3+3', zh:'约分后是√(x+9)+3，x=0时是3+3' } },
      { tex:'\\lim_{x\\to 1} \\dfrac{\\sqrt{x+3}-2}{x-1} = \\dfrac{\\square}{\\square}', answer:[1,4],
        hint:{ ko:'약분 후 1/(√(x+3)+2), x=1이면 1/4', en:'After canceling, 1/(√(x+3)+2), at x=1 that\'s 1/4', zh:'约分后是1/(√(x+3)+2)，x=1时是1/4' } }
    ],
    open:{ ko:'lim(x→2) (x-2)/(√(x+7)-3)의 값을 켤레를 곱하는 과정과 함께 설명해봐요.',
      en:'Explain lim(x→2) (x-2)/(√(x+7)-3), including the step of multiplying by the conjugate.',
      zh:'说说lim(x→2) (x-2)/(√(x+7)-3)的值，包括乘以共轭式的过程。' },
    openHint:{ ko:'분모·분자에 (√(x+7)+3)을 곱하면 √(x+7)+3, x=2이면 3+3=6',
      en:'Multiply top and bottom by (√(x+7)+3) to get √(x+7)+3, and at x=2 that\'s 3+3=6',
      zh:'分子分母乘以(√(x+7)+3)得到√(x+7)+3，x=2时是3+3=6' }
  },

  lab:{
    generator:'md58_limitRationalize', level:'main', count:4,
    params:{mode:'numRoot'},
    intro:{
      ko:'분자에 근호가 있으면 켤레를 곱한 뒤 분수로 답이 딱 떨어져요!',
      en:'When the root is in the numerator, multiplying by the conjugate lands the answer on a clean fraction!',
      zh:'根号在分子时，乘以共轭式后答案会落在干净的分数上！'
    }
  },

  arena:{
    generator:'md58_limitRationalize', level:'main', count:8, timeLimit:300,
    params:{mode:'wide'},
    rule:{ ko:'5분 안에 분모·분자 근호를 섞어서 모두 풀어요!', en:'Solve a mix of roots in numerator and denominator, all within 5 minutes!', zh:'5分钟内混合解出根号在分子·分母的题！' }
  },

  stamp:{ label:{ ko:'켤레 마법사', en:'Conjugate Sorcerer', zh:'共轭式法师' }, coins:70 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'켤레를 곱해 근호를 완벽하게 없앴구나! √',en:'You multiplied by the conjugate and cleared the root perfectly!',zh:'你乘以共轭式完美消去了根号！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'근호가 있는 0/0 꼴은 켤레를 곱해봐!',en:'For a 0/0 form with a root, try multiplying by the conjugate!',zh:'带根号的0/0型试试乘以共轭式！'}, {ko:'켤레는 부호만 반대인 짝이야 — (√A-B)엔 (√A+B)를!',en:'The conjugate flips only the sign — for (√A-B), use (√A+B)!',zh:'共轭式只是符号相反的搭档——(√A-B)配(√A+B)！'} ],
    finish:{ ko:'완벽해! 켤레 마법사! √✨', en:'Perfect! Conjugate Sorcerer!', zh:'完美！共轭式法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
