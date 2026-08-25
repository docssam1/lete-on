/* Numbers of Magic — 유닛 M-10: 지수법칙 (중등 W9 · 중2 식의 계산 · 계보5 '자리의 마법' 종착) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-10'] = {
  id:'M-10', tier:'middle2', level:'32', order:10,
  lineage:['place-magic'],
  generator:'md10_expLaw',
  title:{ ko:'지수법칙', en:'Laws of Exponents', zh:'指数法则' },
  subtitle:{ ko:'큰 수를 짧게 쓰려는 게으름이 만든 발명 — 곱한 횟수만 세면 끝', en:'An invention born from wanting to write big numbers short — just count how many times you multiplied', zh:'懒得写长数字，于是发明了它——只需数一数乘了几次' },
  icon:'📐',

  practice:{
    generator:'md10_expLaw', level:'practice', count:5,
    params:{mode:'mul'},
    intro:{
      ko:'2³은 2를 3번 곱한 거예요. 2³×2⁴는 2를 모두 몇 번 곱한 걸까?',
      en:'2³ means 2 multiplied 3 times. In 2³×2⁴, how many times is 2 multiplied in total?',
      zh:'2³就是把2连乘3次。那2³×2⁴一共把2乘了几次？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'2를 10번 곱한 수를 그냥 쓰면 1024예요. 근데 2를 100번 곱하면? 그걸 매번 다 쓰긴 너무 귀찮아요 — 더 짧게 쓸 방법 없을까요?',
        en:'Multiply 2 by itself 10 times and you get 1024. But what about 100 times? Writing that out every time is way too much work — is there a shorter way?',
        zh:'把2连乘10次就是1024。那连乘100次呢？每次都写出来太麻烦了——有没有更短的写法？' },
      history:{ ko:'거듭제곱 표기 aⁿ은 17세기 수학자 데카르트가 널리 퍼뜨렸어요. 그전엔 학자마다 제각각 표기를 썼는데, "곱한 횟수를 어깨 위에 작게 적는" 이 방법이 결국 표준이 됐어요.',
        en:'The exponent notation aⁿ was popularized by the 17th-century mathematician Descartes. Before that, scholars each used their own notation — but writing "how many times multiplied" as a small number up top eventually became the standard.',
        zh:'指数记号aⁿ由17世纪数学家笛卡尔推广开来。在那之前，学者们各用各的写法——但"把乘的次数写成右上角小数字"这种方法最终成了标准。' }
    },
    stages:[
      { tag:{ko:'① 곱셈은 지수를 더하기',en:'1) Multiplying means adding exponents',zh:'① 相乘就是指数相加'},
        head:{ko:'a^{3} \\times a^{4} = a^{7}',en:'a^{3} \\times a^{4} = a^{7}',zh:'a^{3} \\times a^{4} = a^{7}'},
        desc:{ko:'a³은 a를 3번, a⁴는 a를 4번 곱한 거예요. 둘을 곱하면 a를 <b>3+4=7번</b> 곱한 셈이니 a⁷이 돼요. 밑(a)이 같을 때만 이 규칙을 써요 — 밑이 다르면 지수를 더할 수 없어요.',
              en:'a³ means a multiplied 3 times, a⁴ means a multiplied 4 times. Multiply them together and a is multiplied <b>3+4=7 times</b>, giving a⁷. This rule only works when the base (a) is the same — different bases can\'t have their exponents added.',
              zh:'a³是把a乘3次，a⁴是把a乘4次。两者相乘就是把a乘了<b>3+4=7次</b>，变成a⁷。这个法则只在底数(a)相同时才成立——底数不同就不能把指数相加。'},
        mathSteps:['a^3 = a\\times a\\times a', 'a^4 = a\\times a\\times a\\times a', 'a^3\\times a^4 = a^{3+4}=a^7'],
        result:{ko:'밑이 같은 거듭제곱의 곱셈은 지수를 더해요!',en:'Multiplying same-base powers: add the exponents!',zh:'同底数幂相乘：指数相加！'},
        book:{ko:'같은 문자(밑)의 거듭제곱끼리 곱할 때 aᵐ×aⁿ=aᵐ⁺ⁿ이 성립해요.',
              en:'For powers of the same letter (base), aᵐ×aⁿ=aᵐ⁺ⁿ.',
              zh:'同一个字母(底数)的幂相乘时，aᵐ×aⁿ=aᵐ⁺ⁿ。'} },

      { tag:{ko:'② 거듭제곱의 거듭제곱은 지수끼리 곱하기',en:'2) A power of a power multiplies the exponents',zh:'② 幂的乘方是指数相乘'},
        head:{ko:'(a^{2})^{3} = a^{6}',en:'(a^{2})^{3} = a^{6}',zh:'(a^{2})^{3} = a^{6}'},
        desc:{ko:'(a²)³은 a²를 3번 곱하는 거예요 — a²×a²×a² = a^{2+2+2} = a⁶. 결국 2와 3을 <b>곱한</b> 것과 같아요. 나눗셈(aᵐ÷aⁿ)은 반대로 지수를 빼요 — 곱한 걸 다시 나누니까 당연해요.',
              en:'(a²)³ means a² multiplied 3 times — a²×a²×a² = a^{2+2+2} = a⁶. That\'s the same as <b>multiplying</b> 2 and 3. Division (aᵐ÷aⁿ) goes the other way and subtracts exponents — makes sense, since dividing undoes multiplying.',
              zh:'(a²)³就是把a²乘3次——a²×a²×a² = a^{2+2+2} = a⁶。这正好等于把2和3<b>相乘</b>。除法(aᵐ÷aⁿ)则反过来指数相减——因为除法就是乘法的逆运算，很合理。'},
        mathSteps:['(a^2)^3 = a^2\\times a^2\\times a^2', '=a^{2+2+2}=a^{2\\times3}', '=a^6'],
        result:{ko:'거듭제곱을 다시 거듭제곱하면 지수끼리 곱해요, 나누면 지수끼리 빼요!',en:'A power of a power multiplies the exponents; dividing subtracts them!',zh:'幂的乘方指数相乘，幂的相除指数相减！'},
        book:{ko:'(aᵐ)ⁿ=aᵐⁿ, aᵐ÷aⁿ=aᵐ⁻ⁿ(m>n)이에요. 세 법칙이 한 식에 섞이면 안쪽 괄호부터 하나씩 정리해요.',
              en:'(aᵐ)ⁿ=aᵐⁿ and aᵐ÷aⁿ=aᵐ⁻ⁿ (m>n). When all the rules mix in one expression, simplify from the innermost brackets outward.',
              zh:'(aᵐ)ⁿ=aᵐⁿ，aᵐ÷aⁿ=aᵐ⁻ⁿ(m>n)。三个法则混在一个式子里时，从最里面的括号开始依次化简。'} }
    ],
    rule:{ ko:'① 곱셈은 지수를 더하기(aᵐ×aⁿ=aᵐ⁺ⁿ)  ② 거듭제곱의 거듭제곱은 지수를 곱하기((aᵐ)ⁿ=aᵐⁿ)  ③ 나눗셈은 지수를 빼기(aᵐ÷aⁿ=aᵐ⁻ⁿ)',
      en:'① Multiplying adds exponents (aᵐ×aⁿ=aᵐ⁺ⁿ)  ② A power of a power multiplies them ((aᵐ)ⁿ=aᵐⁿ)  ③ Dividing subtracts them (aᵐ÷aⁿ=aᵐ⁻ⁿ)',
      zh:'① 相乘指数相加(aᵐ×aⁿ=aᵐ⁺ⁿ)  ② 幂的乘方指数相乘((aᵐ)ⁿ=aᵐⁿ)  ③ 相除指数相减(aᵐ÷aⁿ=aᵐ⁻ⁿ)' }
  },

  check:{
    fills:[
      { tex:'a^5 \\times a^2 = a^{\\square}', answer:7,
        hint:{ ko:'지수끼리 더해요: 5+2', en:'Add the exponents: 5+2', zh:'指数相加：5+2' } },
      { tex:'(a^3)^2 = a^{\\square}', answer:6,
        hint:{ ko:'지수끼리 곱해요: 3×2', en:'Multiply the exponents: 3×2', zh:'指数相乘：3×2' } }
    ],
    open:{ ko:'a⁶÷a² 는 지수법칙으로 어떻게 계산할까요?',
      en:'How do you compute a⁶÷a² using the exponent law?',
      zh:'a⁶÷a²用指数法则怎么算？' },
    openHint:{ ko:'지수끼리 빼요: 6-2=4 → a⁴',
      en:'Subtract the exponents: 6-2=4 → a⁴',
      zh:'指数相减：6-2=4 → a⁴' }
  },

  lab:{
    generator:'md10_expLaw', level:'main', count:4,
    params:{mode:'pow'},
    intro:{
      ko:'거듭제곱의 거듭제곱! 지수끼리 곱하면 바로 나와요.',
      en:'A power of a power! Multiply the exponents and you\'re done.',
      zh:'幂的乘方！指数相乘马上就出来了。'
    }
  },

  arena:{
    generator:'md10_expLaw', level:'main', count:8, timeLimit:300,
    params:{mode:'combo'},
    rule:{ ko:'5분 안에 지수법칙이 섞인 문제를 모두 풀어요!', en:'Solve all the mixed exponent-law problems in 5 minutes!', zh:'5分钟内解答所有混合指数法则的题目！' }
  },

  stamp:{ label:{ ko:'지수법칙 마스터', en:'Exponent Law Master', zh:'指数法则达人' }, coins:40 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'지수만 보고 바로 계산했구나! 📐',en:'You solved it just by watching the exponents!',zh:'只看指数就算出来了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'밑이 같을 때만 지수를 더하거나 뺄 수 있어!',en:'You can only add or subtract exponents when the base is the same!',zh:'只有底数相同才能把指数相加或相减！'}, {ko:'거듭제곱의 거듭제곱은 지수를 곱하는 거야!',en:'A power of a power multiplies the exponents!',zh:'幂的乘方是指数相乘哦！'} ],
    finish:{ ko:'완벽해! 지수법칙 마스터! 📐✨', en:'Perfect! Exponent Law Master!', zh:'完美！指数法则达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
