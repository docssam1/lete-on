/* Numbers of Magic — 유닛 C-20: 부풀려 나눗셈 (중급 E 챕터3) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-20'] = {
  id:'C-20', tier:'intermediate', level:'C', order:20,
  generator:'ml_div_expand',
  title:{ ko:'부풀려 나눗셈', en:'Inflate-and-Divide', zh:'扩大除法' },
  subtitle:{ ko:'÷5가 어려우면 양쪽을 부풀려 ÷10으로 바꿔요!', en:'÷5 feels hard? Inflate both sides and divide by 10 instead!', zh:'÷5难？两边同时扩大，变成÷10！' },
  icon:'🎈',

  practice:{
    generator:'ml_div_expand', level:'practice', count:5,
    params:{},
    intro:{
      ko:'약분 나눗셈의 반대! 이번엔 양쪽을 똑같이 부풀려서 나누는 수를 10이나 100으로 만들 거야. 준비됐지?',
      en:"The reverse of simplify-first! This time we inflate both sides equally to turn the divisor into 10 or 100. Ready?",
      zh:'和约分除法相反！这次把两边同时扩大，让除数变成10或100。准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 부풀려도 몫은 그대로',en:'1) Inflating keeps the quotient too',zh:'① 扩大商也不变'},
        head:{ko:'85÷5 = 170÷10 = 17',en:'85÷5 = 170÷10 = 17',zh:'85÷5 = 170÷10 = 17'},
        desc:{ko:'약분 나눗셈(C-19)에서 양쪽을 줄여도 몫이 그대로였죠? <b>부풀려도 똑같아요!</b> 85÷5의 양쪽에 2를 곱하면 170÷10. ÷10은 0 하나만 지우면 되니까 답은 <b>17</b>. 나누는 수를 <b>10으로 만들 수 있게</b> 부풀리는 것이 열쇠예요!',
              en:'In simplify-first division (C-19), shrinking both sides kept the quotient. <b>Inflating works the same way!</b> Double both sides of 85÷5: 170÷10. Since ÷10 just drops a zero, the answer is <b>17</b>. The key is inflating so the divisor <b>becomes 10</b>!',
              zh:'约分除法(C-19)里两边缩小商不变，<b>扩大也一样！</b>85÷5两边×2得170÷10。÷10只要去掉一个0，答案是<b>17</b>。关键是扩大到让除数<b>变成10</b>！'},
        mathSteps:['85 ÷ 5','= (85×2) ÷ (5×2)','= 170 ÷ 10','= 17'],
        result:{ko:'85÷5=17! 양쪽 ×2 → ÷10으로 변신.',en:'85÷5=17! Both ×2 → transforms into ÷10.',zh:'85÷5=17！两边×2→变身÷10。'},
        book:{ko:'원리: a÷b = (a×k)÷(b×k). 약분 나눗셈과 한 쌍이에요 — 줄이든 부풀리든 "양쪽을 똑같이"가 규칙!',
              en:'Principle: a÷b = (a×k)÷(b×k). It pairs with simplify-first division — shrink or inflate, the rule is "both sides equally"!',
              zh:'原理：a÷b = (a×k)÷(b×k)。和约分除法是一对——缩小或扩大，规则都是"两边同样"！'} },

      { tag:{ko:'② ÷25는 ×4로 부풀려요',en:'2) For ÷25, inflate by ×4',zh:'② ÷25就×4扩大'},
        head:{ko:'325÷25 = 1300÷100 = 13',en:'325÷25 = 1300÷100 = 13',zh:'325÷25 = 1300÷100 = 13'},
        desc:{ko:'25는 4배 하면 100! 그래서 ÷25는 <b>양쪽에 4를 곱해</b> ÷100으로 바꿔요. 325÷25 = (325×4)÷100 = 1300÷100 = <b>13</b>. ×4는 두 배의 두 배: 325→650→1300. ×25/÷25 전략(C-17)과 같은 원리를 나눗셈 눈으로 다시 보는 거예요!',
              en:'Four 25s make 100! So for ÷25, <b>multiply both sides by 4</b> to get ÷100. 325÷25 = (325×4)÷100 = 1300÷100 = <b>13</b>. And ×4 is double-double: 325→650→1300. It\'s the ×25/÷25 strategy (C-17) seen through division eyes!',
              zh:'25×4就是100！所以÷25要<b>两边×4</b>变成÷100。325÷25 = (325×4)÷100 = 1300÷100 = <b>13</b>。×4就是翻倍两次：325→650→1300。这是用除法的眼光重看×25/÷25策略(C-17)！'},
        mathSteps:['325 ÷ 25','= (325×4) ÷ (25×4)','= 1300 ÷ 100','= 13'],
        result:{ko:'325÷25=13! ×4로 부풀려 ÷100.',en:'325÷25=13! Inflate by 4, divide by 100.',zh:'325÷25=13！×4扩大，÷100。'},
        book:{ko:'부풀리기 짝꿍표: ÷5 → ×2(÷10) | ÷25 → ×4(÷100) | ÷50 → ×2(÷100) | ÷125 → ×8(÷1000). 나누는 수를 딱 떨어지는 수로!',
              en:'Inflation partners: ÷5 → ×2 (÷10) | ÷25 → ×4 (÷100) | ÷50 → ×2 (÷100) | ÷125 → ×8 (÷1000). Turn the divisor into a round number!',
              zh:'扩大搭档表：÷5→×2(÷10) | ÷25→×4(÷100) | ÷50→×2(÷100) | ÷125→×8(÷1000)。把除数变成整数！'} },

      { tag:{ko:'③ 줄일까, 부풀릴까?',en:'3) Shrink or inflate?',zh:'③ 缩小还是扩大？'},
        head:{ko:'나누는 수를 보고 결정해요',en:'Look at the divisor and decide',zh:'看除数来决定'},
        desc:{ko:'이제 도구가 두 개예요! <b>공약수가 보이면 줄이고(약분)</b>, <b>나누는 수가 5·25·50처럼 10·100의 조각이면 부풀려요</b>. 84÷12? 공약수가 많으니 줄이기. 340÷5? 5는 10의 절반이니 부풀리기 → 680÷10=68. 문제마다 더 빠른 길을 고르는 것이 마법사의 판단력!',
              en:'Now you have two tools! <b>See a common factor → shrink (simplify)</b>; <b>divisor like 5, 25, 50 (a fraction of 10/100) → inflate</b>. 84÷12? Plenty of common factors — shrink. 340÷5? Five is half of ten — inflate → 680÷10=68. Choosing the faster path per problem is wizard judgement!',
              zh:'现在你有两个工具！<b>看到公约数→缩小(约分)</b>；<b>除数是5、25、50这种10/100的分块→扩大</b>。84÷12？公约数多——缩小。340÷5？5是10的一半——扩大→680÷10=68。每题选更快的路，这就是魔法师的判断力！'},
        mathSteps:[{ko:'공약수 많다 → 줄이기(C-19)',en:'\\text{many common factors → shrink (C-19)}',zh:'公约数多 → 缩小(C-19)'},{ko:'나누는 수가 5·25·50 → 부풀리기',en:'\\text{divisor 5·25·50 → inflate}',zh:'除数是5·25·50 → 放大'},'340÷5 → 680÷10 = 68'],
        result:{ko:'줄이기와 부풀리기, 두 마법을 골라 써요!',en:'Shrink or inflate — pick the right magic!',zh:'缩小和扩大——挑对魔法用！'},
        book:null }
    ],
    rule:{ ko:'① 양쪽에 같은 수를 곱해도 몫 불변  ② ÷5→×2, ÷25→×4로 나누는 수를 10·100으로  ③ 마지막은 0 지우기',
      en:'① Multiplying both sides equally keeps the quotient  ② ÷5→×2, ÷25→×4 to make the divisor 10/100  ③ Finish by dropping zeros',
      zh:'① 两边同乘商不变  ② ÷5→×2、÷25→×4使除数变成10/100  ③ 最后去掉0' }
  },

  check:{
    fills:[
      { tex:'65 \\div 5 = \\square', answer:13,
        hint:{ ko:'130÷10=?', en:'130÷10=?', zh:'130÷10=？' } },
      { tex:'225 \\div 25 = \\square', answer:9,
        hint:{ ko:'225×4=900, 900÷100=?', en:'225×4=900, 900÷100=?', zh:'225×4=900，900÷100=？' } }
    ],
    open:{ ko:'450÷50을 부풀려 나눗셈으로 풀어 봐요. 어떤 수로 부풀리면 좋을까요?',
      en:'Solve 450÷50 by inflating. What factor should you inflate by?',
      zh:'用扩大除法算450÷50。该扩大几倍好呢？' },
    openHint:{ ko:'예) 50×2=100이니 양쪽 ×2: 900÷100=9. (사실 이 문제는 양쪽을 10으로 줄여 45÷5로 만든 뒤 다시 부풀려도 돼요 — 어느 길이든 답은 9!)',
      en:'e.g. 50×2=100, so double both: 900÷100=9. (You could also shrink both by 10 to get 45÷5 first — either path gives 9!)',
      zh:'例）50×2=100，两边×2：900÷100=9。（也可以先两边÷10变成45÷5再扩大——哪条路答案都是9！）' }
  },

  lab:{
    generator:'ml_div_expand', level:'main', count:4,
    params:{},
    intro:{
      ko:'부풀려 나눗셈 마법! 나누는 수를 10이나 100으로 만들어봐.',
      en:'Inflate-and-divide magic! Turn the divisor into 10 or 100.',
      zh:'扩大除法魔法！把除数变成10或100。'
    }
  },

  arena:{
    generator:'ml_div_expand', level:'main', count:8, timeLimit:300,
    params:{},
    rule:{ ko:'5분 안에 부풀려 나눗셈 문제를 모두 풀어요!', en:'Solve all inflate-divide problems in 5 minutes!', zh:'5分钟内解答所有扩大除法题！' }
  },

  stamp:{ label:{ ko:'풍선 나눗셈사', en:'Balloon Divider', zh:'气球除法师' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'멋지게 부풀렸어! 🎈',en:'Nicely inflated!',zh:'扩得漂亮！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'나누는 수를 10으로 만들어봐!',en:'Turn the divisor into 10!',zh:'把除数变成10！'}, {ko:'양쪽에 같은 수를 곱해야 해!',en:'Multiply both sides by the same number!',zh:'两边要乘同一个数！'} ],
    finish:{ ko:'완벽해! 풍선 나눗셈사! 🎈✨', en:'Perfect! Balloon Divider!', zh:'完美！气球除法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
