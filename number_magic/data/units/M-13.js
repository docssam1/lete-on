/* Numbers of Magic — 유닛 M-13: 단항식과 다항식의 곱셈·나눗셈 (중등 W9 · 중2 식의 계산 · 계보5 '자리의 마법') */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-13'] = {
  id:'M-13', tier:'middle2', level:'32', order:4,
  lineage:['place-magic'],
  generator:'md13_monoTimesPoly',
  title:{ ko:'단항식과 다항식의 곱셈·나눗셈', en:'Monomial–Polynomial Multiplication & Division', zh:'单项式与多项式的乘除法' },
  subtitle:{ ko:'곱해도 나누어도 다항식의 모든 항을 빠짐없이 계산합니다', en:'Whether multiplying or dividing, operate on every term of the polynomial', zh:'无论乘还是除，多项式的每一项都不能漏' },
  icon:'🎁',

  practice:{
    generator:'md13_monoTimesPoly', level:'practice', count:5,
    params:{mode:'binomial'},
    intro:{
      ko:'3(2x+5)는 "2x+5를 3번 더한 것"과 같습니다. 괄호를 풀면 3×2x + 3×5!',
      en:'3(2x+5) is the same as "adding 2x+5 three times." Open the brackets: 3×2x + 3×5!',
      zh:'3(2x+5)就相当于"把2x+5加3次"。打开括号就是3×2x + 3×5！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 분배법칙 — 밖의 하나가 안의 전부에게',en:'1) The distributive law — the outside term visits every inside term',zh:'① 分配律——括号外的乘遍括号内每一项'},
        head:{ko:'3(2x + 5) = 6x + 15',en:'3(2x + 5) = 6x + 15',zh:'3(2x + 5) = 6x + 15'},
        desc:{ko:'괄호 안에 여러 항이 있으면, 괄호 앞의 수가 <b>각 항에 하나씩 골고루</b> 곱해집니다. 3이 2x에 한 번, 5에 한 번 — 절대 하나만 곱하고 빠뜨리면 안 됩니다.',
              en:'When there are multiple terms inside the brackets, the number outside multiplies <b>each term one by one</b>. 3 multiplies 2x once, then 5 once — never skip one and only multiply the other.',
              zh:'括号里有多项时，括号外的数会<b>依次分别乘每一项</b>。3先乘2x一次，再乘5一次——绝不能只乘一项漏掉另一项。'},
        mathSteps:['3(2x+5)', '=3\\times2x+3\\times5', '=6x+15'],
        result:{ko:'괄호 안 모든 항에 빠짐없이 곱합니다!',en:'Multiply every single term inside — none skipped!',zh:'括号内每一项都要乘到，一个都不能漏！'},
        book:{ko:'분배법칙: a(b+c) = ab + ac. 괄호 안 항이 몇 개든 원칙은 같습니다.',
              en:'The distributive law: a(b+c) = ab + ac. No matter how many terms are inside, the principle stays the same.',
              zh:'分配律：a(b+c) = ab + ac。不管括号里有几项，原理都一样。'} },

      { tag:{ko:'② 곱하는 것이 x를 가지면 차수가 올라감',en:'2) When the multiplier has x, the power goes up',zh:'② 乘的那个带x时，次数就会升高'},
        head:{ko:'2x(3x + 4) = 6x^2 + 8x',en:'2x(3x + 4) = 6x^2 + 8x',zh:'2x(3x + 4) = 6x^2 + 8x'},
        desc:{ko:'이번엔 괄호 앞이 그냥 숫자가 아니라 2x입니다. x×3x = 3x²(지수법칙, x¹×x¹=x²)처럼 <b>차수가 하나 올라갑니다</b>. 계수는 여전히 계수끼리(2×3=6).',
              en:'This time the multiplier outside isn\'t just a number but 2x. Since x×3x = 3x² (exponent law, x¹×x¹=x²), <b>the power goes up by one</b>. Coefficients still multiply on their own (2×3=6).',
              zh:'这次括号外不只是数字，而是2x。因为x×3x = 3x²(指数法则，x¹×x¹=x²)，<b>次数会升高一级</b>。系数照样系数相乘(2×3=6)。'},
        mathSteps:['2x(3x+4)', '=2x\\times3x+2x\\times4', '=6x^2+8x'],
        result:{ko:'곱하는 게 x를 가지면 지수법칙이 함께 작동합니다!',en:'When the multiplier has x, the exponent law kicks in too!',zh:'乘数带x时，指数法则也一起起作用！'},
        book:{ko:'단항식×다항식은 분배법칙 + 지수법칙(문자끼리 곱할 때)을 함께 씁니다. 항이 세 개(삼항식)여도 방법은 같습니다.',
              en:'Monomial × polynomial uses the distributive law together with the exponent law (when letters multiply). Even with three terms (a trinomial), the method is the same.',
              zh:'单项式乘多项式要同时用分配律和指数法则(字母相乘时)。就算是三项(三项式)，方法也一样。'} },

      { tag:{ko:'③ 나눗셈 — 모든 항을 같은 단항식으로',en:'3) Division — divide every term by the same monomial',zh:'③ 除法——每一项都除以同一个单项式'},
        head:{ko:'(12x²−8xy)÷4x = 3x−2y',en:'(12x²−8xy)÷4x = 3x−2y',zh:'(12x²−8xy)÷4x = 3x−2y'},
        desc:{ko:'다항식 전체를 한 번에 나누는 것이 아니라 <b>각 항을 4x로 하나씩</b> 나눕니다. 계수는 나누고, 같은 문자의 지수는 뺍니다. 분수 계수로 나눌 때에는 역수를 곱합니다.',
              en:'Do not divide the polynomial as one opaque block: <b>divide each term by 4x</b>. Divide coefficients and subtract exponents of like variables. For a fractional divisor, multiply by its reciprocal.',
              zh:'不是把整个多项式当成一块来除，而是<b>每一项分别除以4x</b>。系数相除，同字母指数相减；除以分数系数时要乘倒数。'},
        mathSteps:['(12x^2-8xy)\\div4x','=12x^2\\div4x-8xy\\div4x','=3x-2y'],
        result:{ko:'나눗셈도 모든 항을 빠짐없이 계산합니다!',en:'Division also applies to every term — none skipped!',zh:'除法也要逐项计算，一个都不能漏！'},
        book:{ko:'나누는 단항식은 0이 아니어야 합니다. 부호·계수·문자의 지수를 항마다 따로 확인합니다.',
              en:'The divisor monomial must be nonzero. Check the sign, coefficient, and variable exponents term by term.',
              zh:'除数单项式必须不为0。每一项分别检查符号、系数和字母指数。'} }
    ],
    rule:{ ko:'① 곱셈은 괄호 안 모든 항에 곱하기  ② 나눗셈은 모든 항을 같은 단항식으로 나누기  ③ 계수와 같은 문자의 지수를 따로 계산하기',
      en:'① Multiply every term inside  ② Divide every term by the same monomial  ③ Work with coefficients and exponents of like variables separately',
      zh:'① 乘法要乘到括号内每一项  ② 除法每一项都除以同一个单项式  ③ 系数和同字母指数分别计算' }
  },

  check:{
    fills:[
      { tex:'4(x + 3) = \\square x + \\square', answer:[4,12],
        hint:{ ko:'4를 x에 한 번, 3에 한 번', en:'4 multiplies x once, then 3 once', zh:'4先乘x一次，再乘3一次' } },
      { tex:'3x(x + 2) = \\square x^2 + \\square x', answer:[3,6],
        hint:{ ko:'x×x=x², 계수는 3×1과 3×2', en:'x×x=x², coefficients are 3×1 and 3×2', zh:'x×x=x²，系数是3×1和3×2' } },
      { tex:'(12x^2-8xy)\\div4x = \\square x + \\square y', answer:[3,-2],
        hint:{ ko:'12x²와 −8xy를 각각 4x로 나눕니다', en:'Divide 12x² and −8xy separately by 4x', zh:'12x²和−8xy分别除以4x' } }
    ],
    open:{ ko:'-2(3x - 5)는 어떻게 전개할까요?',
      en:'How do you expand -2(3x - 5)?',
      zh:'-2(3x - 5)怎么展开？' },
    openHint:{ ko:'-2×3x=-6x, -2×(-5)=10 → -6x+10',
      en:'-2×3x=-6x, -2×(-5)=10 → -6x+10',
      zh:'-2×3x=-6x，-2×(-5)=10 → -6x+10' }
  },

  lab:{
    generator:'md13_monoTimesPoly', level:'main', count:6,
    params:{mode:'divideBinomial'},
    intro:{
      ko:'이번에는 모든 항을 같은 단항식으로 나눠요. 계수와 지수를 항마다 확인해 봐요.',
      en:'Now divide every term by the same monomial. Check each coefficient and exponent.',
      zh:'这次每一项都除以同一个单项式，逐项检查系数和指数。'
    }
  },

  arena:{
    generator:'md13_monoTimesPoly', level:'main', count:12, timeLimit:480,
    params:{mode:'divideTrinomial'},
    rule:{ ko:'8분 안에 세 항 나눗셈을 풀고, 모든 항의 부호와 지수를 확인합니다!', en:'Solve all three-term divisions in 8 minutes and check every sign and exponent!', zh:'8分钟内完成三项除法，并检查每一项的符号和指数！' }
  },

  stamp:{ label:{ ko:'분배법칙 요정', en:'Distributive Fairy', zh:'分配律精灵' }, coins:43 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'한 항도 빠뜨리지 않았어! 🎁',en:'You didn\'t skip a single term!',zh:'一项都没漏掉！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'괄호 안 모든 항에 다 곱했는지 확인해봐!',en:'Check that you multiplied every term inside!',zh:'检查一下是不是每一项都乘到了！'}, {ko:'문자끼리 곱하면 지수가 올라가는 거 기억해!',en:'Remember: multiplying letters raises the power!',zh:'记得字母相乘次数会升高！'} ],
    finish:{ ko:'완벽해! 분배법칙 요정! 🎁✨', en:'Perfect! Distributive Fairy!', zh:'完美！分配律精灵！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
