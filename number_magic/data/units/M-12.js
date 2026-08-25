/* Numbers of Magic — 유닛 M-12: 다항식의 덧셈과 뺄셈 (중등 W9 · 중2 식의 계산) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-12'] = {
  id:'M-12', tier:'middle2', level:'32', order:12,
  generator:'md12_polyAddSub',
  title:{ ko:'다항식의 덧셈과 뺄셈', en:'Adding & Subtracting Polynomials', zh:'多项式的加减法' },
  subtitle:{ ko:'같은 종류끼리만 모아요 — 사과는 사과끼리, x는 x끼리', en:'Only combine what matches — apples with apples, x with x', zh:'只把同类合在一起——苹果归苹果，x归x' },
  icon:'🍎',

  practice:{
    generator:'md12_polyAddSub', level:'practice', count:5,
    params:{mode:'linear'},
    intro:{
      ko:'사과 3개랑 배 2개는 "5개"로 합칠 수 없어요. x와 상수도 마찬가지 — 문자가 같은 항끼리만 더해요.',
      en:'3 apples and 2 pears can\'t be combined into "5 of something." x terms and constants work the same way — only combine terms with the same letter.',
      zh:'3个苹果和2个梨不能合成"5个什么"。x项和常数项也是——只有字母相同的项才能相加。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'사과 3개 + 배 2개는 몇 개일까요? "5개"라고 답하면 틀려요 — 사과랑 배는 다른 거니까요. 그럼 3x + 2y는 어떻게 정리해야 할까요?',
        en:'3 apples + 2 pears — how many is that? Saying "5" is wrong, because apples and pears are different things. So how should we simplify 3x + 2y?',
        zh:'3个苹果+2个梨，一共几个？答"5个"是错的——因为苹果和梨不是同一种东西。那3x+2y又该怎么整理呢？' },
      history:{ ko:'다항식(多項式)이라는 말 자체가 "여러(多) 개의 항(項)으로 된 식"이라는 뜻이에요. 항을 종류별로 나누는 습관은 대수학이 발전하면서 자연스럽게 자리 잡았어요.',
        en:'The word "polynomial" literally means "an expression with many (poly) terms (nomial)." Sorting terms by kind became natural as algebra developed.',
        zh:'"多项式"这个词的字面意思就是"由多个项组成的式子"。按种类给项分类，是代数学发展过程中自然形成的习惯。' }
    },
    stages:[
      { tag:{ko:'① 동류항 — 문자와 차수가 같은 항',en:'1) Like terms — same letter, same power',zh:'① 同类项——字母和次数都相同的项'},
        head:{ko:'3x + 5x = 8x',en:'3x + 5x = 8x',zh:'3x + 5x = 8x'},
        desc:{ko:'3x와 5x는 둘 다 "x가 1개씩인 항"이라 <b>동류항</b>이에요. 동류항끼리는 계수만 더하거나 빼요(3+5=8) — 문자 x는 그대로 둬요. 하지만 3x와 5(상수)는 종류가 달라 더할 수 없어요.',
              en:'3x and 5x are both "terms with a single x," so they are <b>like terms</b>. Combine like terms by adding or subtracting only the coefficients (3+5=8) — the letter x stays as is. But 3x and 5 (a constant) are different kinds and can\'t be combined.',
              zh:'3x和5x都是"只有一个x的项"，所以是<b>同类项</b>。同类项只把系数相加或相减(3+5=8)——字母x保持不变。但3x和5(常数)是不同种类，不能相加。'},
        mathSteps:['3x+5x', '=(3+5)x', '=8x'],
        result:{ko:'동류항끼리만 계수를 더하거나 빼요!',en:'Only add or subtract the coefficients of like terms!',zh:'只有同类项才能把系数相加或相减！'},
        book:{ko:'문자와 차수가 같은 항을 <b>동류항</b>이라 하고, 동류항끼리만 계수를 계산해 하나로 정리할 수 있어요.',
              en:'Terms with the same letter and the same power are <b>like terms</b>, and only like terms can be combined by calculating their coefficients.',
              zh:'字母和次数都相同的项叫做<b>同类项</b>，只有同类项才能通过计算系数合并成一项。'} },

      { tag:{ko:'② 괄호 앞이 −이면 부호가 전부 바뀜',en:'2) A minus before the brackets flips every sign',zh:'② 括号前是−号，全部变号'},
        head:{ko:'(4x+3) - (2x+5) = 2x - 2',en:'(4x+3) - (2x+5) = 2x - 2',zh:'(4x+3) - (2x+5) = 2x - 2'},
        desc:{ko:'괄호 앞에 −가 있으면 괄호를 풀 때 <b>안의 모든 항의 부호가 바뀌어요</b> — (2x+5)가 -2x-5로. 그다음 동류항끼리(4x와 -2x, 3과 -5) 정리하면 끝이에요.',
              en:'A minus sign in front of the brackets means <b>every term inside flips sign</b> when you open them — (2x+5) becomes -2x-5. Then combine like terms (4x with -2x, 3 with -5) and you\'re done.',
              zh:'括号前有−号，打开括号时<b>里面每一项的符号都要变</b>——(2x+5)变成-2x-5。然后把同类项(4x和-2x，3和-5)合并就完成了。'},
        mathSteps:['(4x+3)-(2x+5)', '=4x+3-2x-5', '=2x-2'],
        result:{ko:'괄호 앞 −는 안의 모든 항의 부호를 뒤집어요!',en:'A minus before the brackets flips every term inside!',zh:'括号前的−会把里面每一项都变号！'},
        book:{ko:'−(a+b) = -a-b 예요. 부호를 하나씩 다 바꿔야지, 첫 항만 바꾸면 틀려요(자주 하는 실수).',
              en:'−(a+b) = -a-b. You must flip every sign, not just the first term — that\'s a very common mistake.',
              zh:'−(a+b) = -a-b。要把每一项的符号都变，只变第一项是常见的错误。'} }
    ],
    rule:{ ko:'① 문자와 차수가 같은 항끼리만 계산  ② 계수만 더하거나 빼고 문자는 그대로  ③ 괄호 앞 −는 안의 모든 항의 부호를 바꿈',
      en:'① Only combine terms with the same letter and power  ② Add or subtract only the coefficients, keep the letter  ③ A minus before brackets flips every term inside',
      zh:'① 只合并字母和次数都相同的项  ② 只对系数相加减，字母不变  ③ 括号前的−会把里面每一项变号' }
  },

  check:{
    fills:[
      { tex:'7x + 2x = \\square x', answer:9,
        hint:{ ko:'계수끼리: 7+2', en:'Coefficients: 7+2', zh:'系数相加：7+2' } },
      { tex:'(5x+4) - (3x+1) = \\square x + \\square', answer:[2,3],
        hint:{ ko:'x끼리: 5-3, 상수끼리: 4-1', en:'x terms: 5-3, constants: 4-1', zh:'x项：5-3，常数项：4-1' } }
    ],
    open:{ ko:'(2x²+3x+1) + (x²+4x+2)는 어떻게 정리할까요?',
      en:'How do you simplify (2x²+3x+1) + (x²+4x+2)?',
      zh:'(2x²+3x+1) + (x²+4x+2)怎么整理？' },
    openHint:{ ko:'x²끼리: 2+1=3, x끼리: 3+4=7, 상수끼리: 1+2=3 → 3x²+7x+3',
      en:'x² terms: 2+1=3, x terms: 3+4=7, constants: 1+2=3 → 3x²+7x+3',
      zh:'x²项：2+1=3，x项：3+4=7，常数项：1+2=3 → 3x²+7x+3' }
  },

  lab:{
    generator:'md12_polyAddSub', level:'main', count:4,
    params:{mode:'quadratic'},
    intro:{
      ko:'이번엔 x²까지! 차수별로 세 종류를 각각 정리해봐.',
      en:'This time with x² too! Sort into three groups by degree, one at a time.',
      zh:'这次连x²也有了！按次数分成三组分别整理。'
    }
  },

  arena:{
    generator:'md12_polyAddSub', level:'main', count:8, timeLimit:300,
    params:{mode:'brackets'},
    rule:{ ko:'5분 안에 괄호 앞 부호 바꾸기 문제를 모두 풀어요!', en:'Solve all the sign-flip-before-brackets problems in 5 minutes!', zh:'5分钟内解答所有括号前变号的题目！' }
  },

  stamp:{ label:{ ko:'동류항 정리사', en:'Like-Term Sorter', zh:'同类项整理师' }, coins:42 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'같은 종류끼리 정확히 모았어! 🍎',en:'You matched up the right kinds perfectly!',zh:'同类项分得又快又准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'문자와 차수가 같은 항끼리만 더할 수 있어!',en:'Only terms with the same letter and power can be added!',zh:'只有字母和次数都相同的项才能相加！'}, {ko:'괄호 앞 −는 안의 모든 항의 부호를 바꿔야 해!',en:'A minus before the brackets must flip every term inside!',zh:'括号前的−要把里面每一项都变号！'} ],
    finish:{ ko:'완벽해! 동류항 정리사! 🍎✨', en:'Perfect! Like-Term Sorter!', zh:'完美！同类项整理师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
