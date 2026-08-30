/* Numbers of Magic — 유닛 C-28: 5로 나눠라 (중급 창의전략 4단계) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-28'] = {
  id:'C-28', tier:'intermediate', level:'C', order:28,
  lineage:['ten-friends'],
  generator:'ml_x5',
  title:{ ko:'5로 나눠라', en:'Divide by 5', zh:'除以5' },
  subtitle:{ ko:'5로 나누기 = 10으로 나누고 2를 곱하기', en:'Dividing by 5 = divide by 10, then multiply by 2', zh:'除以5 = 除以10再乘2' },
  icon:'✋',

  practice:{
    generator:'ml_x5', level:'practice', count:5,
    params:{ level:'practice', mode:'div' },
    intro:{
      ko:'5로 나누는 건 10으로 나눈 다음 2배 하는 것과 같아. 10으로 나눈 몫 하나마다 5로 나눈 몫은 2개씩 들어있거든! 준비됐지?',
      en:"Dividing by 5 is the same as dividing by 10 and then doubling — because every share you get from 10 holds two shares of 5! Ready?",
      zh:'除以5就是先除以10再翻倍——因为除以10得到的每一份里都藏着两份除以5的结果！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① ÷5 = ×2 ÷ 10',en:'1) ÷5 = ×2 ÷ 10',zh:'① ÷5 = ×2 ÷ 10'},
        head:{ko:'85÷5: 두 배 하고 10으로 나눠요 = 17!',en:'85÷5: double it, divide by 10 = 17!',zh:'85÷5：翻倍再除以10=17！'},
        desc:{ko:'5로 나누기는 <b>10으로 나누고 2를 곱하기</b>와 정확히 같아요. 왜냐하면 5는 10의 절반이라서, 5로 나눈 몫은 10으로 나눈 몫보다 <b>정확히 두 배</b>가 되거든요. 85÷5 = 85×2÷10 = 170÷10 = <b>17</b>. 두 배 만들고 0 하나 지우기 — 나눗셈이 순식간에 끝나요!',
              en:'Dividing by 5 is exactly the same as <b>dividing by 10 and multiplying by 2</b>. Since 5 is half of 10, the quotient from dividing by 5 is always <b>exactly double</b> the quotient from dividing by 10. 85÷5 = 85×2÷10 = 170÷10 = <b>17</b>. Double it, drop a zero — done in a flash!',
              zh:'除以5正好等于<b>除以10再乘2</b>。因为5是10的一半，所以除以5的商永远是除以10的商的<b>正好两倍</b>。85÷5 = 85×2÷10 = 170÷10 = <b>17</b>。翻倍再去掉一个0——瞬间搞定！'},
        mathSteps:['85 ÷ 5','= 85 × 2 ÷ 10','= 170 ÷ 10','= 17'],
        result:{ko:'85÷5=17! 두 배 하고 0 하나 지우기.',en:'85÷5=17! Double, then drop a zero.',zh:'85÷5=17！翻倍，去掉一个0。'},
        book:{ko:'분수로 보면: ÷5 = ÷(10/2) = ×(2/10). 나누는 수를 2배로 부풀린 채로 10을 나누는 셈이에요.',
              en:'In fractions: ÷5 = ÷(10/2) = ×(2/10). You inflate the divisor to 10 while doubling the whole thing first.',
              zh:'用分数看：÷5 = ÷(10/2) = ×(2/10)。相当于把除数放大到10，同时先把整体翻倍。'} },

      { tag:{ko:'② 왜 10으로 나눈 것의 2배일까',en:'2) Why double the ÷10 result?',zh:'② 为什么是除以10的两倍？'},
        head:{ko:'60÷10=6인데 60÷5는 왜 12일까?',en:'60÷10=6, so why is 60÷5=12?',zh:'60÷10=6，为什么60÷5=12？'},
        desc:{ko:'60을 10명에게 나눠주면 한 명당 6개(60÷10=6)예요. 그런데 5명에게 나눠주면 <b>사람 수가 절반</b>이니까 한 명이 받는 몫은 <b>두 배</b>가 돼요: 6×2=<b>12</b>. 나누는 사람 수가 절반이 되면 몫은 그만큼 커져요 — 10=5×2니까 10으로 나눈 몫에 2를 곱하면 5로 나눈 몫이 나와요!',
              en:'Sharing 60 among 10 people gives 6 each (60÷10=6). But share it among 5 people — <b>half as many people</b> — and each share <b>doubles</b>: 6×2=<b>12</b>. Halve the number of people, and each share grows to match — since 10=5×2, doubling the ÷10 result gives the ÷5 result!',
              zh:'60分给10人，每人6个(60÷10=6)。但分给5人——<b>人数减半</b>——每人分到的就<b>翻倍</b>：6×2=<b>12</b>。分的人少一半，每份就多一倍——因为10=5×2，把除以10的结果乘2就是除以5的结果！'},
        mathSteps:['60 ÷ 10 = 6',{ko:'사람 수 절반 → 몫은 두 배',en:'\\text{half the people → double the share}',zh:'人数减半 → 每人份翻倍'},'6 × 2 = 12'],
        result:{ko:'60÷5=12! 10으로 나눈 몫의 두 배.',en:'60÷5=12! Double what ÷10 gives you.',zh:'60÷5=12！是除以10结果的两倍。'},
        book:null },

      { tag:{ko:'③ 큰 수도 문제없어요',en:'3) Big numbers, no problem',zh:'③ 大数也不怕'},
        head:{ko:'340÷5: 680÷10 = 68!',en:'340÷5: 680÷10 = 68!',zh:'340÷5：680÷10=68！'},
        desc:{ko:'세 자리 수도 똑같은 방법이에요. 340÷5 → 먼저 두 배: 340×2=680, 그다음 10으로 나누기: 680÷10=<b>68</b>. 수가 커져도 "두 배 하고 0 하나 지우기"라는 두 단계는 변하지 않아요. 5의 마법은 언제나 이 두 걸음이에요!',
              en:'Even 3-digit numbers follow the same route. 340÷5 → double first: 340×2=680, then divide by 10: 680÷10=<b>68</b>. However big the number, the two steps — "double, drop a zero" — never change. That\'s the whole magic of 5!',
              zh:'三位数也一样。340÷5 → 先翻倍：340×2=680，再除以10：680÷10=<b>68</b>。数再大，"翻倍再去0"这两步都不变。这就是5的全部魔法！'},
        mathSteps:['340 × 2 = 680','680 ÷ 10 = 68'],
        result:{ko:'340÷5=68! 두 배 하고 0 하나 지우기, 언제나 같은 방법.',en:'340÷5=68! Double, drop a zero — always the same.',zh:'340÷5=68！翻倍去0，永远这两步。'},
        book:null }
    ],
    rule:{ ko:'① ÷5 = ×2 후 ÷10  ② 나누는 사람이 절반이 되면 몫은 두 배  ③ 수가 커져도 방법은 그대로',
      en:'① ÷5 = ×2 then ÷10  ② Half the sharers means double the share  ③ Same method for any size number',
      zh:'① ÷5 = ×2后÷10  ② 分的人减半，每份就翻倍  ③ 数再大方法不变' }
  },

  check:{
    fills:[
      { tex:'90 \\div 5 = \\square', answer:18,
        hint:{ ko:'90×2=180, 180÷10=?', en:'90×2=180, 180÷10=?', zh:'90×2=180，180÷10=？' } },
      { tex:'65 \\div 5 = \\square', answer:13,
        hint:{ ko:'65×2=130, 130÷10=?', en:'65×2=130, 130÷10=?', zh:'65×2=130，130÷10=？' } }
    ],
    open:{ ko:'÷5=×2÷10이 항상 성립하는 이유를 5와 10의 관계로 설명해 봐요.',
      en:'Explain why ÷5=×2÷10 always works, using the relationship between 5 and 10.',
      zh:'用5和10的关系解释为什么÷5=×2÷10总是成立。' },
    openHint:{ ko:'예) 5=10÷2이므로 a÷5 = a÷(10÷2) = a×2÷10. 나누는 수를 절반으로 만들려면 전체를 두 배로 부풀린 채 나누면 된다는 뜻이에요.',
      en:'e.g. Since 5=10÷2, a÷5 = a÷(10÷2) = a×2÷10. To halve the divisor, you double the whole thing first, then divide.',
      zh:'例）因为5=10÷2，所以a÷5 = a÷(10÷2) = a×2÷10。要把除数减半，就先把整体翻倍再除。' }
  },

  lab:{
    generator:'ml_x5', level:'main', count:4,
    params:{ level:'main', mode:'div' },
    intro:{
      ko:'이번엔 더 큰 수로! 두 배 하고 10으로 나눠봐.',
      en:'Now with bigger numbers! Double it, then divide by 10.',
      zh:'现在数更大了！翻倍再除以10。'
    }
  },

  arena:{
    generator:'ml_x5', level:'main', count:8, timeLimit:300,
    params:{ level:'main', mode:'div' },
    rule:{ ko:'5분 안에 ÷5 문제를 모두 풀어요!', en:'Solve all ÷5 problems in 5 minutes!', zh:'5分钟内解答所有÷5题！' }
  },

  stamp:{ label:{ ko:'÷5 달인', en:'÷5 Master', zh:'÷5达人' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'두 배의 마법! ✋',en:'Doubling magic!',zh:'翻倍魔法！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'두 배 하고 10으로 나눠봐!',en:'Double it, then ÷10!',zh:'翻倍再除以10！'}, {ko:'10으로 나눈 몫의 두 배야!',en:'It\'s double the ÷10 result!',zh:'是除以10结果的两倍！'} ],
    finish:{ ko:'완벽해! ÷5 달인! ✋✨', en:'Perfect! ÷5 Master!', zh:'完美！÷5达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
