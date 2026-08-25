/* Numbers of Magic — 유닛 M-05: 거듭제곱과 부호 (중등 W8 · 중1 정수와 유리수) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-05'] = {
  id:'M-05', tier:'middle1', level:'30', order:5,
  generator:'md5_signedPower',
  title:{ ko:'거듭제곱과 부호', en:'Powers & Signs', zh:'乘方与符号' },
  subtitle:{ ko:'(−2)³과 −2³, 괄호 하나가 답을 완전히 바꿔놓기도 해요', en:'(−2)³ vs −2³ — one pair of parentheses can change everything', zh:'(−2)³和−2³，一个括号可能改变一切' },
  icon:'💥',

  practice:{
    generator:'md5_signedPower', level:'main', count:5,
    params:{mode:'paren'},
    intro:{
      ko:'(−a)ⁿ은 밑이 통째로 음수예요 — (−a)를 n번 곱해봐!',
      en:'(−a)ⁿ has a negative base — multiply (−a) by itself n times!',
      zh:'(−a)ⁿ的底数整体是负数——把(−a)连乘n次！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 괄호가 있으면 밑 전체가 음수',en:'1) With brackets, the whole base is negative',zh:'① 有括号，底数整体为负'},
        head:{ko:'(−2)⁴ = 16',en:'(−2)⁴ = 16',zh:'(−2)⁴ = 16'},
        desc:{ko:'(−2)⁴은 (−2)를 <b>4번 곱하는 것</b>: (−2)×(−2)×(−2)×(−2). 음수 4개(짝수)를 곱하니까 부호는 +, 절댓값은 2⁴=16 → <b>+16</b>이에요.',
              en:'(−2)⁴ means <b>multiplying (−2) four times</b>: (−2)×(−2)×(−2)×(−2). Four negatives (even) give +, and the absolute value is 2⁴=16 → <b>+16</b>.',
              zh:'(−2)⁴表示把(−2)<b>连乘4次</b>：(−2)×(−2)×(−2)×(−2)。4个负数(偶数)得+，绝对值是2⁴=16→<b>+16</b>。'},
        mathSteps:['(-2)^4', '(-2)\\times(-2)\\times(-2)\\times(-2)', '16'],
        result:{ko:'괄호 안 음수를 지수만큼 곱하면 부호는 홀짝으로 결정돼요!',en:'Multiply the bracketed negative by its exponent count — the sign follows odd/even!',zh:'把括号里的负数连乘指数次，符号看奇偶数决定！'},
        book:null },

      { tag:{ko:'② 괄호가 없으면 지수는 밑에만',en:'2) Without brackets, the exponent hugs the base only',zh:'② 没有括号，指数只贴着底数'},
        head:{ko:'−2⁴ = −16 (≠ (−2)⁴)',en:'−2⁴ = −16 (≠ (−2)⁴)',zh:'−2⁴ = −16 (≠ (−2)⁴)'},
        desc:{ko:'−2⁴은 "마이너스, 2의 4제곱"으로 읽어요 — 지수는 <b>2에만</b> 걸리고 맨 앞의 −는 마지막에 붙여요: 2⁴=16을 먼저 구하고 −를 붙이면 <b>−16</b>. (−2)⁴=16과 완전히 다른 값이죠!',
              en:'−2⁴ reads as "negative, two to the fourth" — the exponent applies <b>only to 2</b>, and the leading − is attached last: find 2⁴=16 first, then attach −, giving <b>−16</b>. Completely different from (−2)⁴=16!',
              zh:'−2⁴读作"负的，2的4次方"——指数只作用于<b>2</b>，最前面的−最后才加上：先求2⁴=16，再加−，得<b>−16</b>。和(−2)⁴=16完全不同！'},
        mathSteps:['-2^4', '2^4 = 16', '-16'],
        result:{ko:'지수는 딱 붙어 있는 밑에만 걸려요 — 괄호가 없으면 부호는 그대로!',en:'The exponent only reaches the base it touches — no brackets, the leading sign stays put!',zh:'指数只作用于紧贴着的底数——没有括号，前面的符号原地不动！'},
        book:{ko:'지수가 <b>홀수</b>일 땐 (−a)ⁿ과 −aⁿ이 우연히 같은 값이 돼요(둘 다 음수) — 하지만 <b>짝수</b>일 땐 반드시 값이 갈려요. 헷갈리면 항상 괄호 유무부터 확인하세요.',
              en:'When the exponent is <b>odd</b>, (−a)ⁿ and −aⁿ happen to give the same value (both negative) — but when it is <b>even</b>, they always differ. When in doubt, always check for brackets first.',
              zh:'当指数是<b>奇数</b>时，(−a)ⁿ和−aⁿ恰好得到相同的值(都是负数)——但当指数是<b>偶数</b>时，两者必然不同。拿不准时，先看看有没有括号。'} }
    ],
    rule:{ ko:'① (−a)ⁿ: 괄호 안 음수를 n번 곱하기  ② −aⁿ: aⁿ을 먼저, −는 마지막에  ③ 짝수 지수일 때만 두 값이 달라져요',
      en:'① (−a)ⁿ: multiply the bracketed negative n times  ② −aⁿ: find aⁿ first, attach − last  ③ Only even exponents make the two differ',
      zh:'① (−a)ⁿ：括号里的负数连乘n次  ② −aⁿ：先求aⁿ，最后加−  ③ 只有偶数指数时两者才不同' }
  },

  check:{
    fills:[
      { tex:'(-3)^3 = \\square', answer:-27,
        hint:{ ko:'(-3)를 3번 곱해요', en:'Multiply (-3) three times', zh:'把(-3)连乘3次' } },
      { tex:'-3^3 = \\square', answer:-27,
        hint:{ ko:'3³=27을 구하고 -를 붙여요(홀수라 같은 값!)', en:'Find 3³=27, attach - (odd exponent, same value!)', zh:'先求3³=27再加负号(奇数指数值相同!)' } }
    ],
    open:{ ko:'(−3)⁴과 −3⁴을 각각 계산하고, 왜 값이 다른지 설명해봐요.',
      en:'Compute (−3)⁴ and −3⁴ separately, and explain why they differ.',
      zh:'分别计算(−3)⁴和−3⁴，说说为什么不一样。' },
    openHint:{ ko:'(−3)⁴=81(괄호 안 음수 4번 곱), −3⁴=−81(3⁴=81 먼저, −는 나중). 지수 4가 짝수라서 값이 갈려요.',
      en:'(−3)⁴=81 (bracketed negative × 4). −3⁴=−81 (3⁴=81 first, − last). The exponent 4 is even, so the values differ.',
      zh:'(−3)⁴=81(括号里的负数连乘4次)。−3⁴=−81(先3⁴=81，再加负号)。指数4是偶数，所以值不同。' }
  },

  lab:{
    generator:'md5_signedPower', level:'main', count:4,
    params:{mode:'bare'},
    intro:{
      ko:'괄호가 없는 −aⁿ, 지수는 밑에만 걸린다는 걸 잊지 마!',
      en:'No brackets in −aⁿ — remember the exponent only touches the base!',
      zh:'−aⁿ没有括号，记住指数只作用于底数！'
    }
  },

  arena:{
    generator:'md5_signedPower', level:'main', count:8, timeLimit:300,
    params:{mode:'mixed'},
    rule:{ ko:'5분 안에 괄호형·비괄호형을 구분하며 다 풀어요!', en:'Solve all — telling bracketed and bare forms apart — in 5 minutes!', zh:'5分钟内区分带括号和不带括号，全部解答！' }
  },

  stamp:{ label:{ ko:'괄호 판별사', en:'Bracket Detective', zh:'括号侦探' }, coins:34 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'괄호를 정확히 봤어! 💥',en:'You spotted the brackets exactly!',zh:'括号看得很准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'괄호가 있는지 없는지부터 확인해봐!',en:'Check for brackets first!',zh:'先看看有没有括号！'}, {ko:'지수가 짝수면 두 식의 값이 다를 수 있어!',en:'With an even exponent, the two forms can differ!',zh:'指数是偶数时，两种写法结果可能不同！'} ],
    finish:{ ko:'완벽해! 괄호 판별사! 💥✨', en:'Perfect! Bracket Detective!', zh:'完美！括号侦探！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
