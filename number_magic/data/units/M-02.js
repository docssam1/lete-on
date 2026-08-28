/* Numbers of Magic — 유닛 M-02: 정수의 덧셈과 뺄셈 (중등 W8 · 중1 정수와 유리수) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-02'] = {
  id:'M-02', tier:'middle1', level:'29', order:2,
  generator:'md2_intAddSub',
  title:{ ko:'정수의 덧셈과 뺄셈', en:'Adding & Subtracting Integers', zh:'整数的加减法' },
  subtitle:{ ko:'같은 부호는 더하고, 다른 부호는 빼고 — 큰 쪽 부호를 따라가요', en:'Same sign: add. Different sign: subtract and follow the bigger one', zh:'同号相加，异号相减——跟着绝对值大的那个符号走' },
  icon:'⚖️',

  practice:{
    generator:'md2_intAddSub', level:'practice', count:5,
    params:{mode:'same', level:'practice'},
    intro:{
      ko:'부호가 같은 두 수를 더할 땐 절댓값끼리 더하고 그 부호를 그대로 붙여!',
      en:'Adding two same-sign numbers: add the absolute values and keep that sign!',
      zh:'两个同号的数相加：绝对值相加，符号不变！'
    }
  },

  discover:{
    story:{
      hook:{ ko:'용돈 5만 원이 있는데 빌린 돈이 3만 원이에요. 지금 내 돈은 얼마일까요?',
        en:'You have 50,000 won of pocket money and owe 30,000 won. How much is really yours?',
        zh:'你有5万韩元零花钱，还欠3万韩元。你实际有多少钱？' },
      history:{ ko:'인도의 수학자들은 서기 628년 무렵 이미 재산은 +, 빚은 −로 두고 계산 규칙을 정리했어요. 음수는 어려워서 늦게 나온 게 아니라, 장사와 이자 계산이라는 아주 실용적인 필요에서 먼저 태어났어요.',
        en:'Around 628 CE, Indian mathematicians were already writing assets as + and debts as −, with rules for combining them. Negative numbers did not arrive late because they were hard — they arrived early, out of the very practical business of trade and interest.',
        zh:'大约公元628年，印度数学家已经把财产记作+、债务记作−，并整理出运算规则。负数出现得并不晚——它来自贸易和利息计算这种非常实际的需要。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 부호가 같으면 더하기',en:'1) Same sign — just add',zh:'① 同号就相加'},
        head:{ko:'(−4) + (−7) = −11',en:'(−4) + (−7) = −11',zh:'(−4) + (−7) = −11'},
        desc:{ko:'해저 4m에서 7m를 더 내려가면 해저 11m — <b>절댓값끼리 더하고(4+7=11) 공통 부호(−)</b>를 붙이면 끝이에요. 양수끼리도 똑같아요: (+2)+(+5)=+7.',
              en:'4m below sea level, go 7m further down: 11m below — <b>add the absolute values (4+7=11) and attach the shared sign (−)</b>. Same for positives: (+2)+(+5)=+7.',
              zh:'海下4米再往下7米，就是海下11米——<b>绝对值相加(4+7=11)，加上共同的符号(−)</b>就好了。正数也一样：(+2)+(+5)=+7。'},
        mathSteps:['(-4)+(-7)', '|-4|+|-7| = 11', '-11'],
        result:{ko:'부호가 같으면 크기만 합치면 돼요!',en:'Same sign? Just combine the sizes!',zh:'同号只需合并大小！'},
        book:null },

      { tag:{ko:'② 부호가 다르면 큰 쪽이 이겨요',en:'2) Different sign — the bigger one wins',zh:'② 异号时绝对值大的胜出'},
        head:{ko:'(+8) + (−3) = +5',en:'(+8) + (−3) = +5',zh:'(+8) + (−3) = +5'},
        desc:{ko:'3득점하고 8실점했다고 생각해봐요 — 절댓값의 <b>차(8−3=5)</b>를 구하고, <b>절댓값이 더 큰 쪽의 부호(+)</b>를 따라가요. 뺄셈은 빼는 수의 부호를 바꿔서 덧셈으로: 5 − (−3) = 5 + (+3) = 8.',
              en:'Think of scoring 3 and conceding 8 — find the <b>difference of absolute values (8−3=5)</b> and follow the <b>sign of the bigger one (+)</b>. Subtraction becomes addition by flipping the sign: 5 − (−3) = 5 + (+3) = 8.',
              zh:'想象得3分又丢8分——求绝对值的<b>差(8−3=5)</b>，符号跟着<b>绝对值更大的那个(+)</b>。减法把减数变号后改成加法：5 − (−3) = 5 + (+3) = 8。'},
        mathSteps:['(+8)+(-3)', '|8|-|-3| = 5', '+5'],
        result:{ko:'다른 부호는 빼서 차이를 찾고, 큰 쪽 부호를 따라가요!',en:'Different sign: subtract to find the gap, follow the bigger sign!',zh:'异号就相减找差距，跟着更大的符号走！'},
        book:{ko:'괄호가 있는 식은 괄호를 풀어서 덧셈으로 바꾸면 계산이 편해져요 — 부호에 주의!',
              en:'Expressions with brackets are easier once you open them into plain addition — watch the signs!',
              zh:'带括号的式子打开括号变成加法会更好算——注意符号！'} }
    ],
    rule:{ ko:'① 같은 부호: 절댓값을 더하고 공통 부호  ② 다른 부호: 절댓값 차에 큰 쪽 부호  ③ 뺄셈은 부호를 바꿔 덧셈으로',
      en:'① Same sign: add absolute values, keep the shared sign  ② Different sign: subtract, follow the bigger one  ③ Subtraction = addition with a flipped sign',
      zh:'① 同号：绝对值相加，符号不变  ② 异号：绝对值相减，跟大的符号  ③ 减法＝变号后加法' }
  },

  check:{
    fills:[
      { tex:'(-6) + (-9) = \\square', answer:-15,
        hint:{ ko:'절댓값 6+9=15, 공통 부호 −', en:'6+9=15, shared sign −', zh:'6+9=15，共同符号−' } },
      { tex:'12 - (-5) = \\square', answer:17,
        hint:{ ko:'부호를 바꿔 덧셈으로: 12+5', en:'Flip sign to addition: 12+5', zh:'变号变加法：12+5' } }
    ],
    open:{ ko:'(+9) + (−14)를 계산하고, 어떤 규칙을 썼는지 설명해봐요.',
      en:'Compute (+9) + (−14) and explain which rule you used.',
      zh:'计算(+9) + (−14)，并说说用了哪条规则。' },
    openHint:{ ko:'절댓값 차 14−9=5, 더 큰 쪽(−14)의 부호를 따라가서 −5.',
      en:'Difference 14−9=5, follow the bigger one (−14)\'s sign: −5.',
      zh:'差14−9=5，跟着更大的(−14)的符号：−5。' }
  },

  lab:{
    generator:'md2_intAddSub', level:'main', count:4,
    params:{mode:'diff', level:'main'},
    intro:{
      ko:'부호가 다른 두 수, 큰 쪽을 찾아 부호를 따라가봐!',
      en:'Different signs — find the bigger one and follow its sign!',
      zh:'符号不同，找到更大的那个，跟着它的符号！'
    }
  },

  arena:{
    generator:'md2_intAddSub', level:'main', count:8, timeLimit:300,
    params:{mode:'chain3', level:'main'},
    rule:{ ko:'5분 안에 세 수 혼합 덧뺄셈을 모두 풀어요!', en:'Solve all three-number ± chains in 5 minutes!', zh:'5分钟内解答所有三数加减混合题！' }
  },

  stamp:{ label:{ ko:'부호 저울 마법사', en:'Sign-Balance Wizard', zh:'符号天平魔法师' }, coins:32 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'부호를 딱 맞췄어! ⚖️',en:'Nailed the sign!',zh:'符号抓得很准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'부호가 같은지 다른지부터 확인해봐!',en:'Check if the signs match first!',zh:'先看看符号是不是一样！'}, {ko:'절댓값이 큰 쪽 부호를 따라가!',en:'Follow the sign of the bigger absolute value!',zh:'跟着绝对值更大的那个符号！'} ],
    finish:{ ko:'완벽해! 부호 저울 마법사! ⚖️✨', en:'Perfect! Sign-Balance Wizard!', zh:'完美！符号天平魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
