/* Numbers of Magic — 유닛 C-17: ×25 / ÷25 전략 (중급 D 챕터3) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-17'] = {
  id:'C-17', tier:'intermediate', level:'C', order:17,
  generator:'ml_x25',
  title:{ ko:'×25 / ÷25 전략', en:'The ×25 / ÷25 Strategy', zh:'×25/÷25策略' },
  subtitle:{ ko:'25는 100의 4분의 1! ×25=×100÷4, ÷25=×4÷100', en:'25 is a quarter of 100! ×25=×100÷4, ÷25=×4÷100', zh:'25是100的四分之一！×25=×100÷4，÷25=×4÷100' },
  icon:'🪙',

  practice:{
    generator:'ml_x25', level:'practice', count:5,
    params:{ mode:'mul' },
    intro:{
      ko:'25를 곱할 때는 100을 곱하고 4로 나누면 돼. 25는 100의 4분의 1이니까! 준비됐지?',
      en:"To multiply by 25, multiply by 100 and divide by 4 — because 25 is a quarter of 100! Ready?",
      zh:'乘25时先乘100再除以4——因为25是100的四分之一！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① ×25 = ×100 ÷ 4',en:'1) ×25 = ×100 ÷ 4',zh:'① ×25 = ×100 ÷ 4'},
        head:{ko:'36×25: 3600÷4 = 900!',en:'36×25: 3600÷4 = 900!',zh:'36×25：3600÷4=900！'},
        desc:{ko:'25는 <b>100의 4분의 1</b>이에요(25×4=100). 그래서 ×25는 <b>×100 하고 ÷4</b>! 36×25 = 3600÷4 = <b>900</b>. ÷4가 어려우면 <b>반의 반</b>으로: 3600÷2=1800, 1800÷2=900. ×5 전략(C-16)의 형이라고 할 수 있죠!',
              en:'25 is <b>a quarter of 100</b> (25×4=100). So ×25 means <b>×100 then ÷4</b>! 36×25 = 3600÷4 = <b>900</b>. If ÷4 feels hard, do <b>half of a half</b>: 3600÷2=1800, 1800÷2=900. It\'s the big sibling of the ×5 strategy (C-16)!',
              zh:'25是<b>100的四分之一</b>(25×4=100)。所以×25就是<b>×100再÷4</b>！36×25 = 3600÷4 = <b>900</b>。÷4难的话就<b>折半再折半</b>：3600÷2=1800，1800÷2=900。它是×5策略(C-16)的哥哥！'},
        mathSteps:['36 × 25','= 36 × 100 ÷ 4','= 3600 ÷ 4','= 900'],
        result:{ko:'36×25=900! 00 붙이고 반의 반.',en:'36×25=900! Add two zeros, halve twice.',zh:'36×25=900！加两个0，折半两次。'},
        book:{ko:'÷4를 먼저 해도 돼요: 36÷4=9, 9×100=900. 4의 배수라면 먼저 나누는 쪽이 훨씬 쉬워요 — 분해곱셈법(C-03)과 같은 아이디어!',
              en:'You may divide first: 36÷4=9, then 9×100=900. If the number is a multiple of 4, dividing first is much easier — the same idea as decomposition (C-03)!',
              zh:'也可以先除：36÷4=9，9×100=900。是4的倍数时先除容易得多——和分解乘法(C-03)是同一个思路！'} },

      { tag:{ko:'② ÷25 = ×4 ÷ 100',en:'2) ÷25 = ×4 ÷ 100',zh:'② ÷25 = ×4 ÷ 100'},
        head:{ko:'175÷25: 700÷100 = 7!',en:'175÷25: 700÷100 = 7!',zh:'175÷25：700÷100=7！'},
        desc:{ko:'나누기 25도 뒤집으면 쉬워요! ÷25는 <b>×4 하고 ÷100</b>. 175÷25 = 175×4÷100 = 700÷100 = <b>7</b>. ×4는 <b>두 배의 두 배</b>: 175×2=350, 350×2=700. 나눗셈이 두 배 두 번으로 변신!',
              en:'Dividing by 25 flips easily too! ÷25 means <b>×4 then ÷100</b>. 175÷25 = 175×4÷100 = 700÷100 = <b>7</b>. And ×4 is <b>double the double</b>: 175×2=350, 350×2=700. Division becomes two doublings!',
              zh:'除以25翻转一下也简单！÷25就是<b>×4再÷100</b>。175÷25 = 175×4÷100 = 700÷100 = <b>7</b>。×4就是<b>翻倍再翻倍</b>：175×2=350，350×2=700。除法变成两次翻倍！'},
        mathSteps:['175 ÷ 25','= 175 × 4 ÷ 100','= 700 ÷ 100','= 7'],
        result:{ko:'175÷25=7! 네 배 하고 00 지우기.',en:'175÷25=7! Quadruple, then drop two zeros.',zh:'175÷25=7！乘4，去掉两个0。'},
        book:{ko:'왜 될까? a÷25 = a÷(100/4) = a×4÷100. 나누는 수를 100으로 부풀리는 대신 나눠지는 수도 똑같이 4배 — 몫은 변하지 않아요.',
              en:'Why? a÷25 = a÷(100/4) = a×4÷100. We inflate the divisor to 100 while quadrupling the dividend equally — the quotient stays the same.',
              zh:'为什么？a÷25 = a÷(100/4) = a×4÷100。把除数扩到100的同时被除数也同样×4——商不变。'} },

      { tag:{ko:'③ 동전으로 기억하기',en:'3) Remember with coins',zh:'③ 用硬币记忆'},
        head:{ko:'25원 4개 = 100원!',en:'Four 25s make 100!',zh:'4个25凑成100！'},
        desc:{ko:'외우는 법: <b>25가 4개 모이면 100</b>. 그래서 25 곱하기 = 100 곱하기의 4분의 1, 25로 나누기 = 100으로 나누기의 4배. 이 가족을 통째로 기억해요: <b>×5=×10÷2, ×25=×100÷4, ×50=×100÷2, ×125=×1000÷8</b>. 모두 "딱 떨어지는 수의 조각"이에요!',
              en:'How to remember: <b>four 25s make 100</b>. So ×25 is a quarter of ×100, and ÷25 is four times ÷100. Learn the whole family: <b>×5=×10÷2, ×25=×100÷4, ×50=×100÷2, ×125=×1000÷8</b>. Each is a "fraction of a round number"!',
              zh:'记忆方法：<b>4个25凑成100</b>。所以×25是×100的四分之一，÷25是÷100的4倍。整个家族一起记：<b>×5=×10÷2，×25=×100÷4，×50=×100÷2，×125=×1000÷8</b>。都是"整数的分块"！'},
        mathSteps:['×5 = ×10÷2','×25 = ×100÷4','×50 = ×100÷2','×125 = ×1000÷8'],
        result:{ko:'딱 떨어지는 수의 조각 가족! 하나를 알면 넷을 알아요.',en:'The round-number fraction family! Know one, know all four.',zh:'整数分块家族！会一个就会四个。'},
        book:null }
    ],
    rule:{ ko:'① ×25 = ×100 후 ÷4 (4의 배수면 ÷4 먼저)  ② ÷25 = ×4 후 ÷100  ③ ÷4는 반의 반, ×4는 두 배의 두 배',
      en:'① ×25 = ×100 then ÷4 (÷4 first for multiples of 4)  ② ÷25 = ×4 then ÷100  ③ ÷4 = half of half; ×4 = double of double',
      zh:'① ×25 = ×100后÷4(4的倍数先÷4)  ② ÷25 = ×4后÷100  ③ ÷4折半两次，×4翻倍两次' }
  },

  check:{
    fills:[
      { tex:'48 \\times 25 = \\square', answer:1200,
        hint:{ ko:'48÷4=12, 12×100=?', en:'48÷4=12, then 12×100=?', zh:'48÷4=12，12×100=？' } },
      { tex:'350 \\div 25 = \\square', answer:14,
        hint:{ ko:'350×4=1400, 1400÷100=?', en:'350×4=1400, 1400÷100=?', zh:'350×4=1400，1400÷100=？' } }
    ],
    open:{ ko:'×25=×100÷4인 이유를 설명하고, 같은 원리로 ×125는 어떻게 계산할지 말해 봐요.',
      en:'Explain why ×25=×100÷4, and using the same idea, how would you compute ×125?',
      zh:'解释为什么×25=×100÷4，用同样的思路×125该怎么算？' },
    openHint:{ ko:'예) 25=100÷4이므로 a×25=a×100÷4. 125=1000÷8이니까 ×125=×1000÷8. 예: 16×125 = 16000÷8 = 2000. 또는 16÷8=2 먼저 → 2×1000.',
      en:'e.g. Since 25=100÷4, a×25=a×100÷4. As 125=1000÷8, ×125=×1000÷8. E.g. 16×125 = 16000÷8 = 2000, or divide first: 16÷8=2 → 2×1000.',
      zh:'例）因为25=100÷4，所以a×25=a×100÷4。125=1000÷8，所以×125=×1000÷8。例：16×125=16000÷8=2000，或先除：16÷8=2→2×1000。' }
  },

  lab:{
    generator:'ml_x25', level:'main', count:4,
    params:{ mode:'div' },
    intro:{
      ko:'이번엔 ÷25 마법! 네 배 하고 100으로 나눠봐.',
      en:'Now ÷25 magic! Quadruple, then divide by 100.',
      zh:'现在是÷25魔法！乘4再除以100。'
    }
  },

  arena:{
    generator:'ml_x25', level:'main', count:8, timeLimit:300,
    params:{ mode:'mul' },
    rule:{ ko:'5분 안에 ×25/÷25 문제를 모두 풀어요!', en:'Solve all ×25/÷25 problems in 5 minutes!', zh:'5分钟内解答所有×25/÷25题！' }
  },

  stamp:{ label:{ ko:'×25 달인', en:'×25 Master', zh:'×25达人' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'25의 마법! 🪙',en:'Magic of 25!',zh:'25的魔法！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'×100 하고 ÷4 해봐!',en:'×100 then ÷4!',zh:'×100再÷4！'}, {ko:'÷4는 반의 반이야!',en:'÷4 is half of a half!',zh:'÷4就是折半两次！'} ],
    finish:{ ko:'완벽해! ×25 달인! 🪙✨', en:'Perfect! ×25 Master!', zh:'完美！×25达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
