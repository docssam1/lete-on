/* Numbers of Magic — 유닛 M-13: (단항식)×(다항식)의 전개 (중등 W9 · 중2 식의 계산 · 계보5 '자리의 마법') */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-13'] = {
  id:'M-13', tier:'middle2', level:'33', order:13,
  lineage:['place-magic'],
  generator:'md13_monoTimesPoly',
  title:{ ko:'(단항식)×(다항식)의 전개', en:'Expanding Monomial × Polynomial', zh:'单项式乘多项式的展开' },
  subtitle:{ ko:'괄호 밖의 하나가 안의 모든 항을 하나씩 찾아가 곱해요', en:'The one outside the brackets visits every term inside, one by one', zh:'括号外的那一个，会一个个找到括号里的每一项相乘' },
  icon:'🎁',

  practice:{
    generator:'md13_monoTimesPoly', level:'practice', count:5,
    params:{mode:'binomial'},
    intro:{
      ko:'3(2x+5)는 "2x+5를 3번 더한 것"과 같아요. 괄호를 풀면 3×2x + 3×5!',
      en:'3(2x+5) is the same as "adding 2x+5 three times." Open the brackets: 3×2x + 3×5!',
      zh:'3(2x+5)就相当于"把2x+5加3次"。打开括号就是3×2x + 3×5！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 분배법칙 — 밖의 하나가 안의 전부에게',en:'1) The distributive law — the outside term visits every inside term',zh:'① 分配律——括号外的乘遍括号内每一项'},
        head:{ko:'3(2x + 5) = 6x + 15',en:'3(2x + 5) = 6x + 15',zh:'3(2x + 5) = 6x + 15'},
        desc:{ko:'괄호 안에 여러 항이 있으면, 괄호 앞의 수가 <b>각 항에 하나씩 골고루</b> 곱해져요. 3이 2x에 한 번, 5에 한 번 — 절대 하나만 곱하고 빠뜨리면 안 돼요.',
              en:'When there are multiple terms inside the brackets, the number outside multiplies <b>each term one by one</b>. 3 multiplies 2x once, then 5 once — never skip one and only multiply the other.',
              zh:'括号里有多项时，括号外的数会<b>依次分别乘每一项</b>。3先乘2x一次，再乘5一次——绝不能只乘一项漏掉另一项。'},
        mathSteps:['3(2x+5)', '=3\\times2x+3\\times5', '=6x+15'],
        result:{ko:'괄호 안 모든 항에 빠짐없이 곱해요!',en:'Multiply every single term inside — none skipped!',zh:'括号内每一项都要乘到，一个都不能漏！'},
        book:{ko:'분배법칙: a(b+c) = ab + ac. 괄호 안 항이 몇 개든 원칙은 같아요.',
              en:'The distributive law: a(b+c) = ab + ac. No matter how many terms are inside, the principle stays the same.',
              zh:'分配律：a(b+c) = ab + ac。不管括号里有几项，原理都一样。'} },

      { tag:{ko:'② 곱하는 것이 x를 가지면 차수가 올라감',en:'2) When the multiplier has x, the power goes up',zh:'② 乘的那个带x时，次数就会升高'},
        head:{ko:'2x(3x + 4) = 6x^2 + 8x',en:'2x(3x + 4) = 6x^2 + 8x',zh:'2x(3x + 4) = 6x^2 + 8x'},
        desc:{ko:'이번엔 괄호 앞이 그냥 숫자가 아니라 2x예요. x×3x = 3x²(지수법칙, x¹×x¹=x²)처럼 <b>차수가 하나 올라가요</b>. 계수는 여전히 계수끼리(2×3=6).',
              en:'This time the multiplier outside isn\'t just a number but 2x. Since x×3x = 3x² (exponent law, x¹×x¹=x²), <b>the power goes up by one</b>. Coefficients still multiply on their own (2×3=6).',
              zh:'这次括号外不只是数字，而是2x。因为x×3x = 3x²(指数法则，x¹×x¹=x²)，<b>次数会升高一级</b>。系数照样系数相乘(2×3=6)。'},
        mathSteps:['2x(3x+4)', '=2x\\times3x+2x\\times4', '=6x^2+8x'],
        result:{ko:'곱하는 게 x를 가지면 지수법칙이 함께 작동해요!',en:'When the multiplier has x, the exponent law kicks in too!',zh:'乘数带x时，指数法则也一起起作用！'},
        book:{ko:'단항식×다항식은 분배법칙 + 지수법칙(문자끼리 곱할 때)을 함께 써요. 항이 세 개(삼항식)여도 방법은 같아요.',
              en:'Monomial × polynomial uses the distributive law together with the exponent law (when letters multiply). Even with three terms (a trinomial), the method is the same.',
              zh:'单项式乘多项式要同时用分配律和指数法则(字母相乘时)。就算是三项(三项式)，方法也一样。'} }
    ],
    rule:{ ko:'① 괄호 앞의 것을 안의 모든 항에 하나씩 곱하기  ② 계수는 계수끼리, 문자는 지수법칙으로  ③ 항이 몇 개든 원칙은 같음',
      en:'① Multiply the outside term into every term inside, one at a time  ② Coefficients with coefficients, letters with the exponent law  ③ Same principle no matter how many terms',
      zh:'① 把括号外的乘到里面每一项  ② 系数归系数，字母用指数法则  ③ 不管几项原理都一样' }
  },

  check:{
    fills:[
      { tex:'4(x + 3) = \\square x + \\square', answer:[4,12],
        hint:{ ko:'4를 x에 한 번, 3에 한 번', en:'4 multiplies x once, then 3 once', zh:'4先乘x一次，再乘3一次' } },
      { tex:'3x(x + 2) = \\square x^2 + \\square x', answer:[3,6],
        hint:{ ko:'x×x=x², 계수는 3×1과 3×2', en:'x×x=x², coefficients are 3×1 and 3×2', zh:'x×x=x²，系数是3×1和3×2' } }
    ],
    open:{ ko:'-2(3x - 5)는 어떻게 전개할까요?',
      en:'How do you expand -2(3x - 5)?',
      zh:'-2(3x - 5)怎么展开？' },
    openHint:{ ko:'-2×3x=-6x, -2×(-5)=10 → -6x+10',
      en:'-2×3x=-6x, -2×(-5)=10 → -6x+10',
      zh:'-2×3x=-6x，-2×(-5)=10 → -6x+10' }
  },

  lab:{
    generator:'md13_monoTimesPoly', level:'main', count:4,
    params:{mode:'monomialX'},
    intro:{
      ko:'이번엔 곱하는 것도 x를 가져! 차수가 하나씩 올라가는 걸 잘 봐봐.',
      en:'This time the multiplier has x too! Watch how the power goes up by one each time.',
      zh:'这次乘数也带x！看清楚次数是怎么升高的。'
    }
  },

  arena:{
    generator:'md13_monoTimesPoly', level:'main', count:8, timeLimit:300,
    params:{mode:'trinomial'},
    rule:{ ko:'5분 안에 삼항식 전개를 모두 풀어요!', en:'Solve all the trinomial expansions in 5 minutes!', zh:'5分钟内解答所有三项式展开题！' }
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
