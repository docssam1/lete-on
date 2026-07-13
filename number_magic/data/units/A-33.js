/* Numbers of Magic — 유닛 A-33: 합과 차 1 (초급 H 챕터4) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};
window.NM_UNITS['A-33'] = {
  id:'A-33', tier:'beginner', level:'A', order:33,
  generator:'sumAndDiff1',
  title:{ ko:'합과 차 1', en:'Sum and Difference 1', zh:'和与差 1' },
  subtitle:{ ko:'두 수의 합과 차를 알면 각 수를 구할 수 있어요', en:'Knowing the sum and difference of two numbers lets you find each one', zh:'已知两数之和与差，可以求出各个数' },
  icon:'⚡',

  practice:{
    generator:'sumAndDiff1', level:'practice', count:5,
    intro:{ ko:'합과 차를 이용해 두 수를 찾는 마법이에요!', en:'Magic of finding two numbers from their sum and difference!', zh:'利用和与差求两数的魔法！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 합과 차로 큰 수를 구해요', en:'1) Find the larger number from sum and difference', zh:'① 用和与差求较大数' },
        head:{ ko:'큰 수 = (합 + 차) ÷ 2', en:'Larger number = (Sum + Difference) ÷ 2', zh:'较大数 = (和 + 差) ÷ 2' },
        desc:{ ko:'두 수의 합=18, 차=4. 큰 수=(18+4)÷2=22÷2=11. 작은 수=18-11=7!',
               en:'Two numbers: sum=18, difference=4. Larger=(18+4)÷2=22÷2=11. Smaller=18−11=7!',
               zh:'两数之和=18，差=4。较大数=(18+4)÷2=22÷2=11。较小数=18-11=7！' },
        mathSteps:['합=18, 차=4','큰 수 = (18+4) ÷ 2 = 22 ÷ 2 = 11','작은 수 = 18 - 11 = 7','검증: 11+7=18 ✓, 11-7=4 ✓'],
        result:{ ko:'두 수는 11과 7 ✓', en:'The two numbers are 11 and 7 ✓', zh:'两数为11和7 ✓' },
        book:{ ko:'a+b=S, a-b=D 라면, a=(S+D)÷2, b=(S-D)÷2. 합과 차가 같은 짝수·홀수여야 해요.', en:'If a+b=S and a-b=D, then a=(S+D)÷2 and b=(S−D)÷2.', zh:'若a+b=S，a-b=D，则a=(S+D)÷2，b=(S-D)÷2。' } },
      { tag:{ ko:'② 왜 (합+차)÷2가 큰 수일까요?', en:'2) Why does (sum+diff)÷2 equal the larger number?', zh:'② 为什么(和+差)÷2是较大数？' },
        head:{ ko:'식으로 이해해요', en:'Understand algebraically', zh:'用算式来理解' },
        desc:{ ko:'a+b=S, a-b=D. 두 식을 더하면 2a=S+D, a=(S+D)÷2!',
               en:'a+b=S, a−b=D. Add them: 2a=S+D, so a=(S+D)÷2!',
               zh:'a+b=S，a-b=D。两式相加：2a=S+D，所以a=(S+D)÷2！' },
        mathSteps:['a+b = S', 'a-b = D','(a+b)+(a-b) = S+D','2a = S+D → a = (S+D)÷2'],
        result:{ ko:'a = (합+차)÷2 ✓', en:'a = (sum+diff)÷2 ✓', zh:'a=(和+差)÷2 ✓' },
        book:null }
    ],
    rule:{ ko:'① 큰 수 a = (합 + 차) ÷ 2  ② 작은 수 b = 합 - a  ③ 검증: a+b=합, a-b=차',
      en:'① Larger a = (sum+diff)÷2  ② Smaller b = sum−a  ③ Check: a+b=sum, a−b=diff',
      zh:'①较大数a=(和+差)÷2 ②较小数b=和-a ③验证：a+b=和，a-b=差' }
  },

  check:{
    fills:[
      { tex:'\\text{합}=18,\\text{차}=4: (18+4)\\div 2=\\square', answer:11,
        hint:{ ko:'22÷2=11', en:'22÷2=11', zh:'22÷2=11' } },
      { tex:'18-11=\\square \\text{(작은 수)}', answer:7, hint:{ ko:'18-11=7', en:'18−11=7', zh:'18-11=7' } }
    ],
    open:{ ko:'두 수의 합과 차를 알면 왜 각 수를 구할 수 있는지 설명해봐요.', en:'Explain why knowing the sum and difference of two numbers lets you find each one.', zh:'说说为什么知道两数之和与差就能求出每个数。' },
    openHint:{ ko:'합과 차를 더하면 큰 수가 2배가 돼요. ÷2하면 큰 수를 얻어요. 합에서 큰 수를 빼면 작은 수!', en:'Sum+difference = twice the larger. Divide by 2 to get the larger. Subtract from the sum to get the smaller!', zh:'和+差=较大数的2倍。÷2得较大数。用和减去较大数得较小数！' }
  },

  lab:{ generator:'sumAndDiff1', level:'main', count:4,
    intro:{ ko:'합과 차로 두 수를 찾아봐요!', en:'Find both numbers from sum and difference!', zh:'用和与差求出两数！' } },

  arena:{ generator:'sumAndDiff1', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한! (합+차)÷2!', en:'As many as you can! (sum+diff)÷2!', zh:'5分钟内尽量多做！(和+差)÷2！' } },

  stamp:{ label:{ ko:'합과차 마법사', en:'Sum-Diff Wizard', zh:'和差魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'합과 차 완벽! ⚡✨',en:'Sum-diff perfect!',zh:'和差完美！✨'}, {ko:'두 수를 찾았어!',en:'Found both numbers!',zh:'找到两数！'} ],
    wrong:[ {ko:'(합+차)÷2가 큰 수야!',en:'(Sum+diff)÷2 is the larger number!',zh:'(和+差)÷2是较大数！'}, {ko:'합과 차를 더해서 2로 나눠봐!',en:'Add sum and diff, then divide by 2!',zh:'和与差相加再÷2！'} ],
    finish:{ ko:'완벽해! 합과차 마법사야! ⚡✨', en:"Perfect! You're a sum-diff wizard!", zh:'完美！你是和差魔法师！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
