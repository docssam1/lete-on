/* Numbers of Magic — 유닛 M-21: 다항식의 곱셈과 나눗셈 (고등 W11 · 공통수학1 다항식) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-21'] = {
  id:'M-21', tier:'highmath1', level:'36', order:21,
  generator:'md21_polyMulDiv',
  title:{ ko:'다항식의 곱셈과 나눗셈', en:'Multiplying & Dividing Polynomials', zh:'多项式的乘除法' },
  subtitle:{ ko:'괄호를 분배해서 곱하고, 조립제법으로 나눠요', en:'Distribute to multiply, use synthetic division to divide', zh:'分配展开来相乘，用综合除法来相除' },
  icon:'📦',

  practice:{
    generator:'md21_polyMulDiv', level:'practice', count:5,
    params:{mode:'mul'},
    intro:{
      ko:'(2x+3)(4x+1)을 곱할 때, 앞항끼리·바깥끼리·안쪽끼리·뒷항끼리 — 네 번 곱해서 더해요.',
      en:'To multiply (2x+3)(4x+1): multiply first×first, outer, inner, last×last — four products, then add.',
      zh:'乘(2x+3)(4x+1)时：首项×首项、外侧、内侧、末项×末项——四次相乘后相加。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'단항식 하나를 다항식에 곱하는 건 이미 할 줄 알아요. 그런데 (2x+3)(4x+1)처럼 괄호 두 개를 곱하면 어떻게 될까요? 나누는 것도 거꾸로 할 수 있을까요?',
        en:'You already know how to multiply a monomial into a polynomial. But what about two brackets together, like (2x+3)(4x+1)? And can division work in reverse?',
        zh:'把一个单项式乘进多项式，你已经会了。但两个括号相乘，像(2x+3)(4x+1)呢？除法能不能反过来做？' },
      history:{ ko:'괄호 두 개를 곱하는 방법은 예로부터 "네 부분을 빠짐없이 곱한다"는 원칙 하나로 정리돼 왔어요. 나눗셈은 그 반대 방향 — 몫을 하나씩 맞춰가며 나머지를 줄여가는 조립제법으로 다듬어졌어요.',
        en:'Multiplying two brackets has long been organized around one rule: multiply all four parts without missing any. Division works the opposite way — synthetic division builds the quotient piece by piece while shrinking the remainder.',
        zh:'两个括号相乘自古以来都归结为一条原则：把四个部分都乘到，一个不漏。除法则反过来——综合除法一点点拼出商，同时把余数缩小。' }
    },
    stages:[
      { tag:{ko:'① 괄호 두 개는 네 번 곱해서 더하기',en:'1) Two brackets: four products, then add',zh:'① 两个括号：四次相乘后相加'},
        head:{ko:'(2x+3)(4x+1) = 8x^2+14x+3',en:'(2x+3)(4x+1) = 8x^2+14x+3',zh:'(2x+3)(4x+1) = 8x^2+14x+3'},
        desc:{ko:'2x×4x=8x², 2x×1=2x, 3×4x=12x, 3×1=3. 가운데 두 항(2x와 12x)을 더하면 14x — <b>8x²+14x+3</b>이 돼요.',
              en:'2x×4x=8x², 2x×1=2x, 3×4x=12x, 3×1=3. Add the two middle terms (2x and 12x) to get 14x — giving <b>8x²+14x+3</b>.',
              zh:'2x×4x=8x²，2x×1=2x，3×4x=12x，3×1=3。把中间两项(2x和12x)相加得14x——变成<b>8x²+14x+3</b>。'},
        mathSteps:['(2x+3)(4x+1)=8x^2+2x+12x+3', '=8x^2+(2x+12x)+3', '=8x^2+14x+3'],
        result:{ko:'네 부분을 빠짐없이 곱한 뒤 같은 차수끼리 모아요!',en:'Multiply all four parts, then collect like-degree terms!',zh:'四个部分都乘到，再合并同类项！'},
        book:{ko:'(ax+b)(cx+d) = acx² + (ad+bc)x + bd — 항상 이 네 항의 합으로 정리돼요.',
              en:'(ax+b)(cx+d) = acx² + (ad+bc)x + bd — it always reduces to the sum of these four terms.',
              zh:'(ax+b)(cx+d) = acx² + (ad+bc)x + bd——总能归结为这四项之和。'} },

      { tag:{ko:'② 조립제법으로 나누기',en:'2) Divide with synthetic division',zh:'② 用综合除法相除'},
        head:{ko:'(2x^2+5x-3)\\div(x-1) = 2x+7\\;\\text{R}\\,4',en:'(2x^2+5x-3)\\div(x-1) = 2x+7\\;\\text{R}\\,4',zh:'(2x^2+5x-3)\\div(x-1) = 2x+7\\;\\text{R}\\,4'},
        desc:{ko:'맨 앞 계수 2를 그대로 내리고, 1을 곱해 다음 계수에 더해요: 2×1+5=7. 다시 7×1+(-3)=4가 나머지예요. 몫은 <b>2x+7</b>, 나머지는 <b>4</b>.',
              en:'Bring down the first coefficient 2, multiply by 1 and add to the next: 2×1+5=7. Then 7×1+(-3)=4 is the remainder. Quotient <b>2x+7</b>, remainder <b>4</b>.',
              zh:'先把最前面的系数2直接落下，乘以1加到下一个：2×1+5=7。再7×1+(-3)=4就是余数。商是<b>2x+7</b>，余数是<b>4</b>。'},
        mathSteps:['2\\to 2\\times1+5=7', '7\\times1+(-3)=4', '\\text{몫}=2x+7,\\;\\text{나머지}=4'],
        result:{ko:'k를 곱하고 다음 계수를 더하는 걸 반복해요!',en:'Multiply by k and add the next coefficient, again and again!',zh:'乘以k再加上下一个系数，反复进行！'},
        book:{ko:'(x-k)로 나눌 때: 몫의 계수를 왼쪽부터 차례로 만들며, 마지막에 남는 수가 나머지예요. 검산은 (x-k)×몫+나머지=원래 식.',
              en:'Dividing by (x-k): build the quotient\'s coefficients left to right; what\'s left at the end is the remainder. Check: (x-k)×quotient+remainder=original.',
              zh:'除以(x-k)时：从左到右依次生成商的系数，最后剩下的数就是余数。验算：(x-k)×商+余数=原式。'} }
    ],
    rule:{ ko:'① 곱셈은 괄호 두 개를 네 번 곱해서 같은 차수끼리 모으기  ② 나눗셈은 조립제법으로 k를 곱하고 다음 계수를 더하기를 반복',
      en:'① Multiplication: multiply the two brackets four ways and collect like terms  ② Division: repeat "multiply by k, add the next coefficient" (synthetic division)',
      zh:'① 乘法：两括号四次相乘后合并同类项  ② 除法：反复"乘以k、加下一个系数"(综合除法)' }
  },

  check:{
    fills:[
      { tex:'(x+2)(x+5) = x^2 + \\square x + \\square', answer:[7,10],
        hint:{ ko:'2+5=7, 2×5=10', en:'2+5=7, 2×5=10', zh:'2+5=7，2×5=10' } },
      { tex:'(3x^2+2x-1) \\div (x-1) = 3x + \\square \\;\\; \\text{R} \\square', answer:[5,4],
        hint:{ ko:'3×1+2=5, 5×1+(-1)=4', en:'3×1+2=5, 5×1+(-1)=4', zh:'3×1+2=5，5×1+(-1)=4' } }
    ],
    open:{ ko:'(2x-1)(3x+4)를 전개하는 과정을 설명해봐요.',
      en:'Explain how to expand (2x-1)(3x+4).',
      zh:'说说展开(2x-1)(3x+4)的过程。' },
    openHint:{ ko:'2x×3x + 2x×4 + (-1)×3x + (-1)×4 = 6x²+8x-3x-4 = 6x²+5x-4',
      en:'2x×3x + 2x×4 + (-1)×3x + (-1)×4 = 6x²+8x-3x-4 = 6x²+5x-4',
      zh:'2x×3x + 2x×4 + (-1)×3x + (-1)×4 = 6x²+8x-3x-4 = 6x²+5x-4' }
  },

  lab:{
    generator:'md21_polyMulDiv', level:'main', count:4,
    params:{mode:'div'},
    intro:{
      ko:'이번엔 조립제법! k를 곱하고 다음 계수를 더하는 걸 반복해봐.',
      en:'Synthetic division this time! Multiply by k and add the next coefficient, again and again.',
      zh:'这次是综合除法！反复乘以k再加下一个系数。'
    }
  },

  arena:{
    generator:'md21_polyMulDiv', level:'main', count:8, timeLimit:300,
    params:{mode:'mulTri'},
    rule:{ ko:'5분 안에 이항식×삼항식 전개를 모두 풀어요! 이번엔 답이 네 칸이에요.', en:'Solve all the binomial×trinomial expansions in 5 minutes! The answer has four slots this time.', zh:'5分钟内解答所有二项式×三项式的展开题！这次答案有四格。' }
  },

  stamp:{ label:{ ko:'다항식 조립가', en:'Polynomial Assembler', zh:'多项式组装师' }, coins:48 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'네 부분을 하나도 안 빠뜨렸구나! 📦',en:'You didn\'t miss a single one of the four parts!',zh:'四个部分一个都没漏掉！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'괄호 두 개를 곱할 땐 네 번 곱해서 다 더해야 해!',en:'Multiplying two brackets needs all four products added together!',zh:'两括号相乘要把四次乘积都加起来！'}, {ko:'조립제법은 k를 곱하고 다음 계수를 더하는 걸 반복하는 거야!',en:'Synthetic division repeats "multiply by k, add the next coefficient"!',zh:'综合除法是反复"乘以k、加下一个系数"！'} ],
    finish:{ ko:'완벽해! 다항식 조립가! 📦✨', en:'Perfect! Polynomial Assembler!', zh:'完美！多项式组装师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
