/* Numbers of Magic — 유닛 M-19: 곱셈공식의 전개 (중등 W10 · 중3 다항식의 곱셈과 인수분해 · 계보4 '무지개 덧셈법' 종착) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-19'] = {
  id:'M-19', tier:'middle3', level:'35', order:19,
  lineage:['rainbow-sum'],
  generator:'md19_expandFormula',
  title:{ ko:'곱셈공식의 전개', en:'Expanding Multiplication Formulas', zh:'乘法公式的展开' },
  subtitle:{ ko:'무지개 덧셈법에서 시작된 여정의 마지막 걸음 — 두 수의 합과 곱으로 답이 정해져요', en:'The final step of a journey that began with rainbow addition — the answer is decided by the sum and product of two numbers', zh:'从彩虹加法法出发的旅程终点——答案由两数之和与积决定' },
  icon:'🌈',

  practice:{
    generator:'md19_expandFormula', level:'practice', count:5,
    params:{mode:'twoFactors'},
    intro:{
      ko:'(x+2)(x+3)을 하나하나 곱하지 않아도, 2+3과 2×3만 알면 바로 답이 나와요!',
      en:'You don\'t need to multiply (x+2)(x+3) term by term — just knowing 2+3 and 2×3 gives you the answer right away!',
      zh:'不需要一项项去乘(x+2)(x+3)，只要知道2+3和2×3，答案马上就出来！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'무지개 덧셈법 기억나요? 1+2+…+10을 (1+10)×5로 순식간에 구했었죠. 그 뒤로 "두 수를 짝지어 다루는" 감각이 계속 자라서, 이번엔 곱셈식 (x+a)(x+b)까지 왔어요.',
        en:'Remember the rainbow addition method? You found 1+2+…+10 instantly as (1+10)×5. That instinct for "pairing two numbers" has kept growing — and now it reaches the multiplication (x+a)(x+b).',
        zh:'还记得彩虹加法法吗？曾经用(1+10)×5瞬间求出1+2+…+10。那种"配对处理两个数"的直觉一直在成长，这次成长到了乘法式(x+a)(x+b)。' },
      history:{ ko:'곱셈공식은 고대 그리스 수학자 유클리드의 『원론』에도 도형(정사각형·직사각형의 넓이)으로 등장해요. 지금 우리가 문자식으로 배우는 것을, 옛날 사람들은 넓이 그림으로 이해했어요.',
        en:'Multiplication formulas even appear in the ancient Greek mathematician Euclid\'s "Elements," expressed through shapes — the areas of squares and rectangles. What we now learn as algebraic formulas, people back then understood through area diagrams.',
        zh:'乘法公式在古希腊数学家欧几里得的《几何原本》中就以图形(正方形、矩形的面积)出现过。我们现在用代数式学习的内容，古人是通过面积图来理解的。' }
    },
    stages:[
      { tag:{ko:'① 두 수를 더하고, 곱하기',en:'1) Add the two numbers, then multiply them',zh:'① 先加，再乘这两个数'},
        head:{ko:'(x+2)(x+3) = x^2+5x+6',en:'(x+2)(x+3) = x^2+5x+6',zh:'(x+2)(x+3) = x^2+5x+6'},
        desc:{ko:'네 항을 하나씩 곱해도 되지만(전개하면 x²+3x+2x+6), 결국 가운데 항은 <b>2+3=5</b>(두 수의 합), 마지막 항은 <b>2×3=6</b>(두 수의 곱)이에요. 매번 다 곱하지 않고 이 두 값만 구하면 바로 답이 나와요.',
              en:'You could multiply all four term-pairs (expanding gives x²+3x+2x+6), but in the end the middle term is always <b>2+3=5</b> (the sum) and the last term is <b>2×3=6</b> (the product). Just find these two values instead of expanding every time.',
              zh:'虽然可以把四项一个个乘出来(展开得x²+3x+2x+6)，但最终中间项总是<b>2+3=5</b>(两数之和)，最后一项是<b>2×3=6</b>(两数之积)。不用每次都展开，只求这两个值就能立刻得出答案。'},
        mathSteps:['(x+2)(x+3)', '=x^2+(2+3)x+2\\times3', '=x^2+5x+6'],
        result:{ko:'가운데 항은 두 수의 합, 마지막 항은 두 수의 곱!',en:'The middle term is the sum, the last term is the product!',zh:'中间项是两数之和，最后一项是两数之积！'},
        book:{ko:'(x+a)(x+b) = x²+(a+b)x+ab. (x+a)²=x²+2ax+a²는 a=b인 특별한 경우예요.',
              en:'(x+a)(x+b) = x²+(a+b)x+ab. (x+a)²=x²+2ax+a² is the special case where a=b.',
              zh:'(x+a)(x+b) = x²+(a+b)x+ab。(x+a)²=x²+2ax+a²是a=b的特殊情形。'} },

      { tag:{ko:'② 부호가 반대면 가운데 항이 사라짐 — 합차공식',en:'2) Opposite signs cancel the middle term — the difference of squares',zh:'② 符号相反，中间项就消失——平方差公式'},
        head:{ko:'(x+4)(x-4) = x^2-16',en:'(x+4)(x-4) = x^2-16',zh:'(x+4)(x-4) = x^2-16'},
        desc:{ko:'a=4, b=-4를 앞의 규칙에 넣으면: 가운데 항 4+(-4)=0(사라짐!), 마지막 항 4×(-4)=-16. <b>가운데 항이 통째로 사라지고</b> x²과 -16(=-4²)만 남아요 — 무지개 덧셈법 → 평균값 곱셈을 지나 도착한 마지막 형태예요.',
              en:'Plug a=4, b=-4 into the earlier rule: the middle term is 4+(-4)=0 (it vanishes!), and the last term is 4×(-4)=-16. <b>The middle term disappears entirely</b>, leaving only x² and -16 (=-4²) — the final form reached after rainbow addition and average-value multiplication.',
              zh:'把a=4，b=-4代入前面的规则：中间项4+(-4)=0(消失了！)，最后一项4×(-4)=-16。<b>中间项完全消失</b>，只剩下x²和-16(=-4²)——这正是从彩虹加法法、经过平均值乘法后到达的最终形态。'},
        mathSteps:['(x+4)(x-4)', '=x^2+(4-4)x+4\\times(-4)', '=x^2-16'],
        result:{ko:'부호가 반대인 두 수는 가운데 항이 사라지고 제곱의 차만 남아요!',en:'Two numbers with opposite signs cancel the middle term, leaving just the difference of squares!',zh:'两数符号相反，中间项消失，只剩平方差！'},
        book:{ko:'(x+a)(x-a) = x²-a² — 이걸 <b>합차공식</b>이라고 해요. "합"과 "차"를 곱하면 "제곱의 차"가 된다는 뜻이에요.',
              en:'(x+a)(x-a) = x²-a² — this is called the <b>difference of squares</b> formula. It means multiplying a "sum" by a "difference" gives the "difference of squares."',
              zh:'(x+a)(x-a) = x²-a²——这叫做<b>平方差公式</b>。意思是"和"与"差"相乘，就得到"平方之差"。'} }
    ],
    rule:{ ko:'① (x+a)(x+b)=x²+(a+b)x+ab  ② (x+a)²=x²+2ax+a²(a=b인 경우)  ③ (x+a)(x-a)=x²-a²(합차공식, 가운데 항이 사라짐)',
      en:'① (x+a)(x+b)=x²+(a+b)x+ab  ② (x+a)²=x²+2ax+a² (the case a=b)  ③ (x+a)(x-a)=x²-a² (difference of squares — the middle term cancels)',
      zh:'① (x+a)(x+b)=x²+(a+b)x+ab  ② (x+a)²=x²+2ax+a²(a=b的情形)  ③ (x+a)(x-a)=x²-a²(平方差公式，中间项消失)' }
  },

  check:{
    fills:[
      { tex:'(x+4)(x+5) = x^2 + \\square x + \\square', answer:[9,20],
        hint:{ ko:'4+5와 4×5', en:'4+5 and 4×5', zh:'4+5和4×5' } },
      { tex:'(x+6)^2 = x^2 + \\square x + \\square', answer:[12,36],
        hint:{ ko:'가운데 항은 2×6, 마지막 항은 6²', en:'Middle term is 2×6, last term is 6²', zh:'中间项是2×6，最后一项是6²' } }
    ],
    open:{ ko:'(x+9)(x-9)의 전개 결과는 무엇이고, 왜 가운데 항이 없을까요?',
      en:'What is (x+9)(x-9) expanded, and why is there no middle term?',
      zh:'(x+9)(x-9)展开是什么？为什么没有中间项？' },
    openHint:{ ko:'x²-81. 9와 -9를 더하면 0이라 가운데 항이 사라져요.',
      en:'x²-81. Since 9 and -9 add to 0, the middle term vanishes.',
      zh:'x²-81。9和-9相加为0，所以中间项消失。' }
  },

  lab:{
    generator:'md19_expandFormula', level:'main', count:4,
    params:{mode:'square'},
    intro:{
      ko:'같은 수를 두 번 곱하는 특별한 경우! (x+a)²의 패턴을 익혀봐.',
      en:'A special case — multiplying the same number twice! Learn the pattern of (x+a)².',
      zh:'同一个数乘两次的特殊情形！熟悉(x+a)²的规律。'
    }
  },

  arena:{
    generator:'md19_expandFormula', level:'main', count:8, timeLimit:300,
    params:{mode:'diffSquares'},
    rule:{ ko:'5분 안에 합차공식 문제를 모두 풀어요!', en:'Solve all the difference-of-squares problems in 5 minutes!', zh:'5分钟内解答所有平方差公式题！' }
  },

  stamp:{ label:{ ko:'무지개 완주자', en:'Rainbow Finisher', zh:'彩虹完成者' }, coins:49 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'무지개 덧셈법의 감각이 여기까지 이어졌어! 🌈',en:'The instinct from rainbow addition carried you all the way here!',zh:'彩虹加法法的直觉一直延续到了这里！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'가운데 항은 두 수의 합, 마지막 항은 두 수의 곱이야!',en:'The middle term is the sum, the last term is the product!',zh:'中间项是两数之和，最后一项是两数之积！'}, {ko:'부호가 반대인 두 수는 가운데 항이 사라져!',en:'Opposite signs cancel the middle term!',zh:'符号相反的两数会让中间项消失！'} ],
    finish:{ ko:'완벽해! 무지개 완주자! 🌈✨', en:'Perfect! Rainbow Finisher!', zh:'完美！彩虹完成者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
