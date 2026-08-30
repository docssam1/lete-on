/* Numbers of Magic — 유닛 M-04: 정수의 곱셈과 나눗셈 (중등 W8 · 중1 정수와 유리수) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-04'] = {
  id:'M-04', tier:'middle1', level:'30', order:4,
  generator:'md4_intMulDiv',
  title:{ ko:'정수의 곱셈과 나눗셈', en:'Multiplying & Dividing Integers', zh:'整数的乘除法' },
  subtitle:{ ko:'음수 개수가 짝이면 +, 홀이면 − — 부호부터 정하고 시작해요', en:'Even count of negatives = +, odd = − : decide the sign first', zh:'负数个数为偶得正，为奇得负——先定符号' },
  icon:'🎲',

  practice:{
    generator:'md4_intMulDiv', level:'practice', count:5,
    params:{mode:'mul2', level:'practice'},
    intro:{
      ko:'곱셈은 부호부터! 음수가 1개면 −, 0개나 2개면 +야.',
      en:'Multiplication: sign first! One negative gives −, zero or two give +.',
      zh:'乘法先看符号！1个负数得−，0个或2个负数得+。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 부호를 먼저 정해요',en:'1) Decide the sign first',zh:'① 先确定符号'},
        head:{ko:'(−4) × (−6) = +24',en:'(−4) × (−6) = +24',zh:'(−4) × (−6) = +24'},
        desc:{ko:'음수가 <b>2개(짝수)</b>면 곱은 +, <b>1개(홀수)</b>면 −예요. (−4)×(−6)은 음수가 2개니까 부호는 +, 절댓값끼리 곱해서 4×6=24 → <b>+24</b>. 나눗셈도 똑같은 규칙이에요.',
              en:'An <b>even</b> count of negatives (2, 4, …) gives +, an <b>odd</b> count (1, 3, …) gives −. (−4)×(−6) has 2 negatives, so the sign is +; multiply absolute values 4×6=24 → <b>+24</b>. Division follows the same rule.',
              zh:'负数个数是<b>偶数</b>(2、4…)得+，是<b>奇数</b>(1、3…)得−。(−4)×(−6)有2个负数，符号是+，绝对值相乘4×6=24→<b>+24</b>。除法也是同样的规则。'},
        mathSteps:['(-4)\\times(-6)', {ko:'\\text{음수 2개(짝수)} \\Rightarrow +',en:'\\text{2 negatives (even)} \\Rightarrow +',zh:'\\text{2个负数（偶数）} \\Rightarrow +'}, '4\\times6=24 \\Rightarrow +24'],
        result:{ko:'음수 개수만 세면 부호는 저절로 정해져요!',en:'Just count the negatives and the sign decides itself!',zh:'数一数负数个数，符号自然就定了！'},
        book:{ko:'어떤 수와 0의 곱은 항상 0이에요 — 부호를 셀 필요도 없어요.',
              en:'Any number times 0 is always 0 — no sign-counting needed.',
              zh:'任何数乘0都等于0——都不用数符号了。'} },

      { tag:{ko:'② 세 개 이상도 개수만 세면 끝',en:'2) Three or more — just count',zh:'② 三个以上也只数个数'},
        head:{ko:'(−2) × (−3) × (−5) = −30',en:'(−2) × (−3) × (−5) = −30',zh:'(−2) × (−3) × (−5) = −30'},
        desc:{ko:'몇 개를 곱하든 규칙은 같아요 — 음수가 <b>3개(홀수)</b>니까 부호는 −, 절댓값끼리 곱해 2×3×5=30 → <b>−30</b>. 나눗셈이 섞여 있어도(앞에서부터 차례로) 같은 방식으로 부호를 정해요.',
              en:'No matter how many factors, the rule is the same — 3 negatives (odd) gives −, multiply absolute values 2×3×5=30 → <b>−30</b>. Even with division mixed in (worked left to right), the sign is decided the same way.',
              zh:'不管乘几个数，规则都一样——3个负数(奇数)得−，绝对值相乘2×3×5=30→<b>−30</b>。就算混有除法(从左到右)，符号也用同样的方法决定。'},
        mathSteps:['(-2)\\times(-3)\\times(-5)', {ko:'\\text{음수 3개(홀수)} \\Rightarrow -',en:'\\text{3 negatives (odd)} \\Rightarrow -',zh:'\\text{3个负数（奇数）} \\Rightarrow -'}, '2\\times3\\times5=30 \\Rightarrow -30'],
        result:{ko:'음수를 세는 습관만 들이면 아무리 길어도 두렵지 않아요!',en:'Once you build the habit of counting negatives, long chains stop being scary!',zh:'养成数负数的习惯，再长的算式也不怕！'},
        book:null }
    ],
    rule:{ ko:'① 음수 개수가 짝수면 +, 홀수면 −  ② 절댓값끼리 곱하거나 나누기  ③ 곱나눗 혼합은 앞에서부터 차례로',
      en:'① Even negatives = +, odd = −  ② Multiply or divide the absolute values  ③ Mixed × and ÷ go left to right',
      zh:'① 负数偶数个得+，奇数个得−  ② 绝对值相乘或相除  ③ 乘除混合从左到右' }
  },

  check:{
    fills:[
      { tex:'(-7) \\times 4 = \\square', answer:-28,
        hint:{ ko:'음수 1개(홀수) → -', en:'1 negative (odd) → -', zh:'1个负数(奇数)→-' } },
      { tex:'(-36) \\div (-9) = \\square', answer:4,
        hint:{ ko:'음수 2개(짝수) → +', en:'2 negatives (even) → +', zh:'2个负数(偶数)→+' } }
    ],
    open:{ ko:'(−2) × (−3) × 5를 계산하고, 부호를 어떻게 정했는지 설명해봐요.',
      en:'Compute (−2) × (−3) × 5 and explain how you found the sign.',
      zh:'计算(−2) × (−3) × 5，并说说怎么确定符号的。' },
    openHint:{ ko:'음수 2개(짝수) → +. 2×3×5=30 → +30.',
      en:'2 negatives (even) → +. 2×3×5=30 → +30.',
      zh:'2个负数(偶数)→+。2×3×5=30→+30。' }
  },

  lab:{
    generator:'md4_intMulDiv', level:'main', count:4,
    params:{mode:'mulChain', level:'main'},
    intro:{
      ko:'음수 개수를 세면서 세 수 이상 곱셈에 도전해봐!',
      en:'Count the negatives and take on multiplying three or more numbers!',
      zh:'数着负数个数，挑战三个以上的乘法！'
    }
  },

  arena:{
    generator:'md4_intMulDiv', level:'main', count:8, timeLimit:300,
    params:{mode:'mixedChain', level:'main'},
    rule:{ ko:'5분 안에 곱셈·나눗셈 혼합 문제를 모두 풀어요!', en:'Solve all × and ÷ mixed problems in 5 minutes!', zh:'5分钟内解答所有乘除混合题！' }
  },

  stamp:{ label:{ ko:'부호 사냥꾼', en:'Sign Hunter', zh:'符号猎人' }, coins:32 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'음수를 완벽하게 셌어! 🎲',en:'Perfect negative count!',zh:'负数数得很准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음수가 몇 개인지 먼저 세어봐!',en:'Count the negatives first!',zh:'先数数有几个负数！'}, {ko:'절댓값끼리 곱하거나 나누는 걸 잊지 마!',en:"Don't forget to multiply or divide the absolute values!",zh:'别忘了绝对值相乘或相除！'} ],
    finish:{ ko:'완벽해! 부호 사냥꾼! 🎲✨', en:'Perfect! Sign Hunter!', zh:'完美！符号猎人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
