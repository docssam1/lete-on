/* Numbers of Magic — 유닛 C-29: 25로 나눠라 (중급 창의전략 4단계) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-29'] = {
  id:'C-29', tier:'intermediate', level:'C', order:29,
  generator:'ml_x25',
  title:{ ko:'25로 나눠라', en:'Divide by 25', zh:'除以25' },
  subtitle:{ ko:'25로 나누기 = 100으로 나누고 4를 곱하기', en:'Dividing by 25 = divide by 100, then multiply by 4', zh:'除以25 = 除以100再乘4' },
  icon:'🪙',

  practice:{
    generator:'ml_x25', level:'practice', count:5,
    params:{ level:'practice', mode:'div' },
    intro:{
      ko:'25는 100의 반의 반이야. 그래서 25로 나누는 건 100으로 나눈 다음 4배 하는 것과 같아! 준비됐지?',
      en:"25 is a quarter of 100. So dividing by 25 is the same as dividing by 100 and multiplying by 4! Ready?",
      zh:'25是100的四分之一。所以除以25就是先除以100再乘4！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① ÷25 = ×4 ÷ 100',en:'1) ÷25 = ×4 ÷ 100',zh:'① ÷25 = ×4 ÷ 100'},
        head:{ko:'175÷25: 700÷100 = 7!',en:'175÷25: 700÷100 = 7!',zh:'175÷25：700÷100=7！'},
        desc:{ko:'25로 나누기는 <b>100으로 나누고 4를 곱하기</b>와 정확히 같아요. 25는 100의 4분의 1이라서, 25로 나눈 몫은 100으로 나눈 몫보다 <b>정확히 네 배</b>가 되거든요. 175÷25 = 175×4÷100 = 700÷100 = <b>7</b>. 네 배 만들고 00 지우기 — 나눗셈이 순식간에!',
              en:'Dividing by 25 is exactly the same as <b>dividing by 100 and multiplying by 4</b>. Since 25 is a quarter of 100, the quotient from ÷25 is always <b>exactly four times</b> the quotient from ÷100. 175÷25 = 175×4÷100 = 700÷100 = <b>7</b>. Quadruple it, drop two zeros — instant!',
              zh:'除以25正好等于<b>除以100再乘4</b>。因为25是100的四分之一，除以25的商永远是除以100的商的<b>正好四倍</b>。175÷25 = 175×4÷100 = 700÷100 = <b>7</b>。乘4再去掉两个0——瞬间搞定！'},
        mathSteps:['175 ÷ 25','= 175 × 4 ÷ 100','= 700 ÷ 100','= 7'],
        result:{ko:'175÷25=7! 네 배 하고 00 지우기.',en:'175÷25=7! Quadruple, drop two zeros.',zh:'175÷25=7！乘4，去掉两个0。'},
        book:{ko:'÷4는 반의 반으로 나눠도 돼요: 700÷2=350, 350÷2=175÷…아 잠깐, 4를 곱하는 것도 마찬가지: 175×2=350, 350×2=700. 두 배를 두 번 하면 네 배예요.',
              en:'×4 can also be done as double-double: 175×2=350, 350×2=700. Doubling twice is the same as quadrupling.',
              zh:'×4也可以看成翻倍两次：175×2=350，350×2=700。翻倍两次就是乘4。'} },

      { tag:{ko:'② 100으로 나눈 몫의 4배',en:'2) Four times the ÷100 result',zh:'② 除以100结果的四倍'},
        head:{ko:'200÷100=2인데 200÷25는 왜 8일까?',en:'200÷100=2, so why is 200÷25=8?',zh:'200÷100=2，为什么200÷25=8？'},
        desc:{ko:'200을 100명에게 나눠주면 한 명당 2개(200÷100=2)예요. 그런데 25명에게 나눠주면 <b>사람 수가 4분의 1</b>이 되니까 한 명이 받는 몫은 <b>네 배</b>가 돼요: 2×4=<b>8</b>. 나누는 사람 수가 4분의 1이 되면 몫은 그만큼 커져요 — 100=25×4니까 100으로 나눈 몫에 4를 곱하면 25로 나눈 몫이 나와요!',
              en:'Sharing 200 among 100 people gives 2 each (200÷100=2). But share it among 25 people — <b>a quarter as many</b> — and each share becomes <b>four times</b> bigger: 2×4=<b>8</b>. Since 100=25×4, multiplying the ÷100 result by 4 gives the ÷25 result!',
              zh:'200分给100人，每人2个(200÷100=2)。但分给25人——<b>人数只有四分之一</b>——每人分到的就变成<b>四倍</b>：2×4=<b>8</b>。因为100=25×4，把除以100的结果乘4就是除以25的结果！'},
        mathSteps:['200 ÷ 100 = 2','사람 수 4분의 1 → 몫은 네 배','2 × 4 = 8'],
        result:{ko:'200÷25=8! 100으로 나눈 몫의 네 배.',en:'200÷25=8! Four times what ÷100 gives you.',zh:'200÷25=8！是除以100结果的四倍。'},
        book:null },

      { tag:{ko:'③ 큰 수도 문제없어요',en:'3) Big numbers, no problem',zh:'③ 大数也不怕'},
        head:{ko:'300÷25: 1200÷100 = 12!',en:'300÷25: 1200÷100 = 12!',zh:'300÷25：1200÷100=12！'},
        desc:{ko:'세 자리 수도 똑같은 방법이에요. 300÷25 → 먼저 네 배: 300×4=1200, 그다음 100으로 나누기: 1200÷100=<b>12</b>. 4를 곱하기 어려우면 두 배를 두 번: 300×2=600, 600×2=1200. 수가 커져도 "네 배 하고 00 지우기"는 변하지 않아요!',
              en:'Even 3-digit numbers follow the same route. 300÷25 → quadruple first: 300×4=1200, then divide by 100: 1200÷100=<b>12</b>. If ×4 feels hard, double twice: 300×2=600, 600×2=1200. However big the number, "quadruple, drop two zeros" never changes!',
              zh:'三位数也一样。300÷25 → 先乘4：300×4=1200，再除以100：1200÷100=<b>12</b>。乘4难就翻倍两次：300×2=600，600×2=1200。数再大，"乘4去00"都不变！'},
        mathSteps:['300 × 4 = 1200','1200 ÷ 100 = 12'],
        result:{ko:'300÷25=12! 네 배 하고 00 지우기, 언제나 같은 방법.',en:'300÷25=12! Quadruple, drop two zeros — always the same.',zh:'300÷25=12！乘4去00，永远这两步。'},
        book:null }
    ],
    rule:{ ko:'① ÷25 = ×4 후 ÷100  ② 나누는 사람이 4분의 1이 되면 몫은 네 배  ③ ×4가 어려우면 두 배를 두 번',
      en:'① ÷25 = ×4 then ÷100  ② A quarter the sharers means four times the share  ③ If ×4 is hard, double twice',
      zh:'① ÷25 = ×4后÷100  ② 分的人变四分之一，每份就乘4  ③ 乘4难就翻倍两次' }
  },

  check:{
    fills:[
      { tex:'150 \\div 25 = \\square', answer:6,
        hint:{ ko:'150×4=600, 600÷100=?', en:'150×4=600, 600÷100=?', zh:'150×4=600，600÷100=？' } },
      { tex:'475 \\div 25 = \\square', answer:19,
        hint:{ ko:'475×4=1900, 1900÷100=?', en:'475×4=1900, 1900÷100=?', zh:'475×4=1900，1900÷100=？' } }
    ],
    open:{ ko:'÷25=×4÷100이 항상 성립하는 이유를 25와 100의 관계로 설명해 봐요.',
      en:'Explain why ÷25=×4÷100 always works, using the relationship between 25 and 100.',
      zh:'用25和100的关系解释为什么÷25=×4÷100总是成立。' },
    openHint:{ ko:'예) 25=100÷4이므로 a÷25 = a÷(100÷4) = a×4÷100. 나누는 수를 4분의 1로 만들려면 전체를 네 배로 부풀린 채 나누면 된다는 뜻이에요.',
      en:'e.g. Since 25=100÷4, a÷25 = a÷(100÷4) = a×4÷100. To quarter the divisor, quadruple the whole thing first, then divide.',
      zh:'例）因为25=100÷4，所以a÷25 = a÷(100÷4) = a×4÷100。要把除数变成四分之一，就先把整体乘4再除。' }
  },

  lab:{
    generator:'ml_x25', level:'main', count:4,
    params:{ level:'main', mode:'div' },
    intro:{
      ko:'이번엔 더 큰 수로! 네 배 하고 100으로 나눠봐.',
      en:'Now with bigger numbers! Quadruple it, then divide by 100.',
      zh:'现在数更大了！乘4再除以100。'
    }
  },

  arena:{
    generator:'ml_x25', level:'main', count:8, timeLimit:300,
    params:{ level:'main', mode:'div' },
    rule:{ ko:'5분 안에 ÷25 문제를 모두 풀어요!', en:'Solve all ÷25 problems in 5 minutes!', zh:'5分钟内解答所有÷25题！' }
  },

  stamp:{ label:{ ko:'÷25 달인', en:'÷25 Master', zh:'÷25达人' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'25의 마법! 🪙',en:'Magic of 25!',zh:'25的魔法！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'네 배 하고 100으로 나눠봐!',en:'Quadruple, then ÷100!',zh:'乘4再除以100！'}, {ko:'100으로 나눈 몫의 네 배야!',en:'It\'s four times the ÷100 result!',zh:'是除以100结果的四倍！'} ],
    finish:{ ko:'완벽해! ÷25 달인! 🪙✨', en:'Perfect! ÷25 Master!', zh:'完美！÷25达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
