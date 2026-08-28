/* Numbers of Magic — 유닛 M-38: 로그의 성질 (고등 W13 · 대수 지수와 로그) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-38'] = {
  id:'M-38', tier:'algebra', level:'40', order:3,
  generator:'md38_logProperties',
  title:{ ko:'로그의 성질', en:'Properties of Logarithms', zh:'对数的性质' },
  subtitle:{ ko:'로그의 덧뺄셈은 진수의 곱나눗이 돼요', en:'Adding/subtracting logs multiplies/divides the arguments', zh:'对数的加减对应真数的乘除' },
  icon:'🔗',

  practice:{
    generator:'md38_logProperties', level:'practice', count:5,
    params:{mode:'sumProduct'},
    intro:{
      ko:'log₂4 + log₂8 = log₂(4×8) = log₂32! 두 로그를 더하면 안의 수를 곱해요.',
      en:'log₂4 + log₂8 = log₂(4×8) = log₂32! Adding two logs multiplies what\'s inside.',
      zh:'log₂4 + log₂8 = log₂(4×8) = log₂32！两个对数相加，就是把里面的数相乘。'
    }
  },

  discover:{
    story:{
      hook:{ ko:'곱셈을 덧셈으로 바꿀 수 있다면 얼마나 편할까요? 로그가 바로 그 일을 해요.',
        en:'What if multiplication could be turned into addition? That is exactly what a logarithm does.',
        zh:'如果乘法能变成加法该多方便？对数做的正是这件事。' },
      history:{ ko:'네이피어(1550~1617)는 곱셈과 나눗셈의 번거로움을 덜려고 로그를 만들었어요. 오늘날에는 계산기로 곱하니 로그표를 쓸 일은 없지만, 로그 자체는 자연과학·사회과학까지 퍼져 지금도 계속 넓어지고 있어요.',
        en:'John Napier (1550-1617) created logarithms to take the drudgery out of multiplying and dividing. Nobody reaches for a log table today, but the idea itself spread into the natural and social sciences and keeps widening.',
        zh:'纳皮尔(1550-1617)创造对数，是为了免去乘除的繁琐。今天没人再查对数表了，但对数这个概念本身扩展到了自然科学与社会科学，至今仍在延伸。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 로그의 덧셈 = 진수의 곱셈',en:'1) Adding logs = multiplying arguments',zh:'① 对数相加=真数相乘'},
        head:{ko:'\\log_2 4 + \\log_2 8 = \\log_2 32',en:'\\log_2 4 + \\log_2 8 = \\log_2 32',zh:'\\log_2 4 + \\log_2 8 = \\log_2 32'},
        desc:{ko:'log₂4=2(2를 2번), log₂8=3(2를 3번)이니까 더하면 2+3=5번. 2를 5번 곱한 건 log₂32=5(2⁵=32)와 같아요. 즉 <b>지수끼리 더하는 것</b>이 로그에서는 <b>진수끼리 곱하는 것</b>으로 보여요.',
              en:'log₂4=2 (multiply 2 twice) and log₂8=3 (three times), so adding gives 2+3=5 times. Multiplying 2 five times matches log₂32=5 (since 2⁵=32). So <b>adding exponents</b> shows up in logs as <b>multiplying arguments</b>.',
              zh:'log₂4=2(乘2次)，log₂8=3(乘3次)，相加就是2+3=5次。乘5次2正好对应log₂32=5(因为2⁵=32)。所以对数里的<b>指数相加</b>看起来就是<b>真数相乘</b>。'},
        mathSteps:['\\log_2 4=2,\\;\\log_2 8=3', '2+3=5', '\\log_2 32=5\\;(2^5=32)'],
        result:{ko:'log_a X + log_a Y = log_a(XY)!',en:'log_a X + log_a Y = log_a(XY)!',zh:'log_a X + log_a Y = log_a(XY)！'},
        book:{ko:'지수법칙 aᵐ×aⁿ=aᵐ⁺ⁿ이 로그의 옷을 입으면 이 덧셈 성질이 돼요 — 같은 마법, 다른 표기예요.',
              en:'The exponent law aᵐ×aⁿ=aᵐ⁺ⁿ, dressed in log notation, becomes this addition property — same magic, different clothes.',
              zh:'指数法则aᵐ×aⁿ=aᵐ⁺ⁿ换上对数的外衣，就变成了这条加法性质——同样的魔法，不同的衣服。'} },

      { tag:{ko:'② 뺄셈은 나눗셈, 밑변환은 정수만',en:'2) Subtracting is dividing; only clean change-of-base',zh:'② 相减是相除，只处理整数换底'},
        head:{ko:'\\log_2 32 - \\log_2 4 = \\log_2 8',en:'\\log_2 32 - \\log_2 4 = \\log_2 8',zh:'\\log_2 32 - \\log_2 4 = \\log_2 8'},
        desc:{ko:'32÷4=8이니까 log₂32-log₂4=log₂8(5-2=3, log₂8=3와 일치!)이 돼요. 밑이 다른 log₉81 같은 경우도 9=3²처럼 밑을 3의 거듭제곱으로 볼 수 있으면, 3을 몇 번 곱해야 81이 되는지 세고 2로 나눠 정수로 딱 떨어지게 만들 수 있어요.',
              en:'Since 32÷4=8, log₂32-log₂4=log₂8 (5-2=3, matching log₂8=3!). For a different base like log₉81, if the base can be seen as a power of 3 (9=3²), you count how many times 3 must be multiplied to reach 81, then divide by 2 to land cleanly on an integer.',
              zh:'因为32÷4=8，所以log₂32-log₂4=log₂8(5-2=3，正好等于log₂8=3！)。像log₉81这种不同底数，如果底数能看成3的幂(9=3²)，就数一数3要乘几次得到81，再除以2，正好得到整数。'},
        mathSteps:['32\\div4=8', '\\log_2 32-\\log_2 4=\\log_2 8', '5-2=3'],
        result:{ko:'log_a X - log_a Y = log_a(X÷Y), 밑변환은 정수 되는 경우만!',en:'log_a X - log_a Y = log_a(X÷Y); change-of-base only when it lands on an integer!',zh:'log_a X - log_a Y = log_a(X÷Y)，换底只处理正好是整数的情形！'},
        book:{ko:'로그의 곱셈·나눗셈은 다음 유닛(Σ)처럼 "이미 아는 걸 새 기호로 다시 쓰는 것"의 또 다른 예예요.',
              en:'Multiplying and dividing logs is another example of "rewriting what you already know in a new symbol" — just like the sigma unit coming next.',
              zh:'对数的乘除是"用新符号重写已知内容"的又一个例子——就像接下来的Σ单元一样。'} }
    ],
    rule:{ ko:'log_a X + log_a Y = log_a(XY)  ·  log_a X - log_a Y = log_a(X÷Y)  ·  밑변환은 정수가 되는 경우만',
      en:'log_a X + log_a Y = log_a(XY)  ·  log_a X - log_a Y = log_a(X÷Y)  ·  change-of-base only when it lands on an integer',
      zh:'log_a X + log_a Y = log_a(XY)  ·  log_a X - log_a Y = log_a(X÷Y)  ·  换底只处理正好是整数的情形' }
  },

  check:{
    fills:[
      { tex:'\\log_{3} 9 + \\log_{3} 3 = \\log_{3} \\square', answer:27,
        hint:{ ko:'9×3=27', en:'9×3=27', zh:'9×3=27' } },
      { tex:'\\log_{2} 64 - \\log_{2} 8 = \\log_{2} \\square', answer:8,
        hint:{ ko:'64÷8=8', en:'64÷8=8', zh:'64÷8=8' } }
    ],
    open:{ ko:'log₅25 + log₅5의 값을 두 가지 방법(각각 구해서 더하기 / 곱해서 한 번에 구하기)으로 설명해봐요.',
      en:'Find log₅25 + log₅5 two ways: adding the separate values, and multiplying first.',
      zh:'用两种方法算log₅25 + log₅5：分别求值再相加，以及先相乘再求一次。' },
    openHint:{ ko:'log₅25=2, log₅5=1, 2+1=3. 또는 25×5=125=5³이므로 log₅125=3',
      en:'log₅25=2, log₅5=1, so 2+1=3. Or 25×5=125=5³, so log₅125=3',
      zh:'log₅25=2，log₅5=1，2+1=3。或者25×5=125=5³，所以log₅125=3' }
  },

  lab:{
    generator:'md38_logProperties', level:'main', count:4,
    params:{mode:'diffQuotient'},
    intro:{
      ko:'이번엔 뺄셈! log_a X - log_a Y = log_a(X÷Y)를 확인해봐.',
      en:'Subtraction this time! Check that log_a X - log_a Y = log_a(X÷Y).',
      zh:'这次是减法！验证log_a X - log_a Y = log_a(X÷Y)。'
    }
  },

  arena:{
    generator:'md38_logProperties', level:'main', count:8, timeLimit:300,
    params:{mode:'changeBase'},
    rule:{ ko:'5분 안에 밑변환이 정수로 떨어지는 문제를 모두 풀어요!', en:'Solve all the change-of-base problems that land on integers in 5 minutes!', zh:'5分钟内解答所有换底后为整数的题目！' }
  },

  stamp:{ label:{ ko:'로그 성질 마스터', en:'Log-Property Master', zh:'对数性质大师' }, coins:54 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'로그의 덧뺄셈이 진수의 곱나눗인 걸 잘 아는구나! 🔗',en:'You\'ve got it — log addition/subtraction is argument multiplication/division!',zh:'你已经掌握了对数加减就是真数乘除！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'로그의 덧셈은 진수끼리 곱하는 거야!',en:'Adding logs multiplies the arguments!',zh:'对数相加就是真数相乘！'}, {ko:'로그의 뺄셈은 진수끼리 나누는 거야!',en:'Subtracting logs divides the arguments!',zh:'对数相减就是真数相除！'} ],
    finish:{ ko:'완벽해! 로그 성질 마스터! 🔗✨', en:'Perfect! Log-Property Master!', zh:'完美！对数性质大师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
