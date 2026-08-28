/* Numbers of Magic — 유닛 M-11: 단항식의 곱셈과 나눗셈 (중등 W9 · 중2 식의 계산) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-11'] = {
  id:'M-11', tier:'middle2', level:'32', order:11,
  generator:'md11_monoMulDiv',
  title:{ ko:'단항식의 곱셈과 나눗셈', en:'Multiplying & Dividing Monomials', zh:'单项式的乘除法' },
  subtitle:{ ko:'숫자는 숫자끼리, 문자는 문자끼리 — 두 개의 계산을 한 번에', en:'Numbers with numbers, letters with letters — two calculations at once', zh:'数字归数字，字母归字母——一次做两个计算' },
  icon:'🧩',

  practice:{
    generator:'md11_monoMulDiv', level:'practice', count:5,
    params:{mode:'mul'},
    intro:{
      ko:'3x²는 "3과 x²이 곱해진 것"이에요. 두 단항식을 곱할 땐 숫자는 숫자끼리, 문자는 지수법칙으로!',
      en:'3x² means "3 multiplied by x²." When multiplying two monomials, numbers combine with numbers, and letters use the exponent law!',
      zh:'3x²就是"3和x²相乘"。两个单项式相乘时，数字归数字，字母用指数法则！'
    }
  },

  discover:{
    story:{
      hook:{ ko:'a와 −a 중에 어느 쪽이 더 큰 수일까요?',
        en:'Which is larger, a or −a?',
        zh:'a和−a，哪个更大？' },
      history:{ ko:'정할 수 없어요. a가 −3이면 −a는 3이라 −a가 더 크죠. 문자는 숫자를 담는 상자라서, 안에 무엇이 들었는지 모르면 크기도 정해지지 않아요. 단항식을 계산할 때 숫자는 숫자끼리, 문자는 문자끼리 묶는 것도 같은 이유예요 — 상자는 상자끼리 세는 겁니다.',
        en:'You cannot say. If a is −3 then −a is 3, and −a wins. A letter is a box holding a number, so with the box closed its size is undecided. That is also why monomials group numbers with numbers and letters with letters — boxes get counted with boxes.',
        zh:'无法确定。若a是−3，则−a是3，−a更大。字母是装数字的盒子，不知道里面装了什么，大小就定不下来。单项式计算时数字归数字、字母归字母，也是同一个道理——盒子要和盒子一起数。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 계수는 계수끼리, 문자는 문자끼리',en:'1) Coefficients with coefficients, letters with letters',zh:'① 系数归系数，字母归字母'},
        head:{ko:'3x^2 \\times 4x^3 = 12x^5',en:'3x^2 \\times 4x^3 = 12x^5',zh:'3x^2 \\times 4x^3 = 12x^5'},
        desc:{ko:'단항식은 "숫자 부분(계수)"과 "문자 부분"으로 나뉘어요. 곱할 땐 계수는 계수끼리(3×4=12), 문자는 지수법칙으로(x²×x³=x⁵) — <b>두 계산을 각각 따로</b> 하면 끝이에요.',
              en:'A monomial splits into a "number part" (coefficient) and a "letter part." When multiplying, coefficients combine separately (3×4=12) and letters use the exponent law (x²×x³=x⁵) — <b>do the two calculations independently</b> and you\'re done.',
              zh:'单项式分成"数字部分"(系数)和"字母部分"。相乘时系数归系数(3×4=12)，字母用指数法则(x²×x³=x⁵)——<b>分别独立计算</b>这两部分就行了。'},
        mathSteps:['3\\times4=12', 'x^2\\times x^3=x^5', '3x^2\\times4x^3=12x^5'],
        result:{ko:'두 계산을 각각 따로 하면 돼요 — 섞이지 않아요!',en:'Do the two calculations separately — they never mix!',zh:'两个计算分开做——不会混在一起！'},
        book:{ko:'단항식끼리의 곱셈은 계수의 곱과 문자의 곱(지수법칙)을 각각 구해 합쳐요.',
              en:'Multiplying monomials: find the product of the coefficients and the product of the letters (exponent law) separately, then combine.',
              zh:'单项式相乘：分别求出系数的积和字母的积(指数法则)，再合起来。'} },

      { tag:{ko:'② 나눗셈도 같은 방식',en:'2) Division works the same way',zh:'② 除法也是一样的方式'},
        head:{ko:'8x^5 \\div 2x^2 = 4x^3',en:'8x^5 \\div 2x^2 = 4x^3',zh:'8x^5 \\div 2x^2 = 4x^3'},
        desc:{ko:'나눗셈도 계수는 계수끼리 나누고(8÷2=4), 문자는 지수법칙으로 나눠요(x⁵÷x²=x³). 세 개 이상이 곱셈·나눗셈으로 이어지면 <b>앞에서부터 차례로</b> 계산해요.',
              en:'Division works the same — divide coefficients (8÷2=4) and divide the letters with the exponent law (x⁵÷x²=x³). When three or more terms mix × and ÷, work <b>left to right</b>.',
              zh:'除法也一样——系数归系数相除(8÷2=4)，字母用指数法则相除(x⁵÷x²=x³)。三个以上单项式乘除混合时，<b>从左到右</b>依次计算。'},
        mathSteps:['8\\div2=4', 'x^5\\div x^2=x^3', '8x^5\\div2x^2=4x^3'],
        result:{ko:'곱셈과 똑같은 방식 — 숫자는 숫자, 문자는 문자!',en:'Same idea as multiplication — numbers with numbers, letters with letters!',zh:'和乘法一样的思路——数字归数字，字母归字母！'},
        book:{ko:'단항식끼리의 나눗셈은 계수의 나눗셈과 문자의 나눗셈(지수법칙)을 각각 구해요.',
              en:'Dividing monomials: find the quotient of the coefficients and the quotient of the letters (exponent law) separately.',
              zh:'单项式相除：分别求出系数的商和字母的商(指数法则)。'} }
    ],
    rule:{ ko:'① 곱셈·나눗셈 모두 계수는 계수끼리  ② 문자는 지수법칙으로  ③ 세 개 이상이면 앞에서부터 차례로',
      en:'① Coefficients combine with coefficients in both × and ÷  ② Letters use the exponent law  ③ Three or more terms — work left to right',
      zh:'① 乘除法系数都归系数  ② 字母用指数法则  ③ 三个以上从左到右依次计算' }
  },

  check:{
    fills:[
      { tex:'2x^2 \\times 5x^3 = \\square x^5', answer:10,
        hint:{ ko:'계수끼리: 2×5', en:'Coefficients: 2×5', zh:'系数相乘：2×5' } },
      { tex:'12x^6 \\div 3x^2 = \\square x^4', answer:4,
        hint:{ ko:'계수끼리: 12÷3', en:'Coefficients: 12÷3', zh:'系数相除：12÷3' } }
    ],
    open:{ ko:'-4x³ × 3x²는 어떻게 계산할까요?',
      en:'How do you compute -4x³ × 3x²?',
      zh:'-4x³ × 3x²怎么算？' },
    openHint:{ ko:'계수: -4×3=-12, 문자: x³×x²=x⁵ → -12x⁵',
      en:'Coefficients: -4×3=-12, letters: x³×x²=x⁵ → -12x⁵',
      zh:'系数：-4×3=-12，字母：x³×x²=x⁵ → -12x⁵' }
  },

  lab:{
    generator:'md11_monoMulDiv', level:'main', count:4,
    params:{mode:'div'},
    intro:{
      ko:'나눗셈도 같은 방식이야 — 계수는 계수끼리, 문자는 지수법칙으로!',
      en:'Division works the same way — coefficients with coefficients, letters with the exponent law!',
      zh:'除法也是一样——系数归系数，字母用指数法则！'
    }
  },

  arena:{
    generator:'md11_monoMulDiv', level:'main', count:8, timeLimit:300,
    params:{mode:'chain'},
    rule:{ ko:'5분 안에 세 단항식 곱나눗 혼합을 모두 풀어요!', en:'Solve all the three-monomial × and ÷ mixes in 5 minutes!', zh:'5分钟内解答所有三个单项式的乘除混合题！' }
  },

  stamp:{ label:{ ko:'단항식 조립가', en:'Monomial Assembler', zh:'单项式组装师' }, coins:41 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'계수와 문자를 정확히 나눠 계산했어! 🧩',en:'You split the coefficient and the letter perfectly!',zh:'系数和字母分得清清楚楚！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'계수는 계수끼리, 문자는 지수법칙으로 따로 계산해봐!',en:'Combine coefficients separately from the letters with the exponent law!',zh:'系数归系数，字母用指数法则，分开算算看！'}, {ko:'앞에서부터 차례로 계산해봐!',en:'Work from left to right!',zh:'从左到右依次计算试试！'} ],
    finish:{ ko:'완벽해! 단항식 조립가! 🧩✨', en:'Perfect! Monomial Assembler!', zh:'完美！单项式组装师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
