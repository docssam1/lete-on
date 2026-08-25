/* Numbers of Magic — 유닛 C-17: ×25 전략 (중급 창의전략 4단계) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-17'] = {
  id:'C-17', tier:'intermediate', level:'C', order:17,
  lineage:['ten-friends'],
  generator:'ml_x25',
  title:{ ko:'×25 전략', en:'The ×25 Strategy', zh:'×25策略' },
  subtitle:{ ko:'25는 100의 4분의 1! ×25 = ×100 ÷ 4', en:'25 is a quarter of 100! ×25 = ×100 ÷ 4', zh:'25是100的四分之一！×25 = ×100 ÷ 4' },
  icon:'🪙',

  practice:{
    generator:'ml_x25', level:'practice', count:5,
    params:{ level:'practice', mode:'mul' },
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

      { tag:{ko:'② ×250, ×2500도 똑같이',en:'2) ×250 and ×2500 work the same way',zh:'② ×250、×2500也一样'},
        head:{ko:'12×250: 12000÷4 = 3000!',en:'12×250: 12000÷4 = 3000!',zh:'12×250：12000÷4=3000！'},
        desc:{ko:'250은 1000의 4분의 1, 2500은 10000의 4분의 1이에요 — <b>×25 가족</b>이죠. 그래서 ×250은 <b>×1000 하고 ÷4</b>: 12×250 = 12×1000÷4 = 12000÷4 = <b>3000</b>. 0의 개수만 늘어날 뿐 방법은 완전히 똑같아요. ×25 하나만 익히면 ×250, ×2500까지 전부 내 것!',
              en:'250 is a quarter of 1000, and 2500 is a quarter of 10000 — they\'re all part of the <b>×25 family</b>. So ×250 means <b>×1000 then ÷4</b>: 12×250 = 12×1000÷4 = 12000÷4 = <b>3000</b>. Only the zeros change — the method stays identical. Master ×25, and ×250, ×2500 come free!',
              zh:'250是1000的四分之一，2500是10000的四分之一——都是<b>×25家族</b>。所以×250就是<b>×1000再÷4</b>：12×250 = 12×1000÷4 = 12000÷4 = <b>3000</b>。只是0的个数变多，方法完全一样。学会×25，×250、×2500也顺带学会！'},
        mathSteps:['12 × 250','= 12 × 1000 ÷ 4','= 12000 ÷ 4','= 3000'],
        result:{ko:'12×250=3000! ×25 가족은 전부 같은 방법.',en:'12×250=3000! The whole ×25 family uses the same trick.',zh:'12×250=3000！×25家族都是同一招。'},
        book:{ko:'0을 붙이는 규칙: ×25는 0 두 개(×100), ×250은 0 세 개(×1000), ×2500은 0 네 개(×10000). 붙인 0의 개수만큼 마지막에 ÷4를 해요.',
              en:'The zero rule: ×25 adds two zeros (×100), ×250 adds three (×1000), ×2500 adds four (×10000). However many zeros you add, finish with one ÷4.',
              zh:'加0规则：×25加两个0(×100)，×250加三个0(×1000)，×2500加四个0(×10000)。不管加几个0，最后都÷4一次。'} },

      { tag:{ko:'③ 동전으로 기억하기',en:'3) Remember with coins',zh:'③ 用硬币记忆'},
        head:{ko:'25원 4개 = 100원!',en:'Four 25s make 100!',zh:'4个25凑成100！'},
        desc:{ko:'외우는 법: <b>25가 4개 모이면 100</b>. 그래서 25 곱하기 = 100 곱하기의 4분의 1. 이 가족을 통째로 기억해요: <b>×5=×10÷2, ×25=×100÷4, ×50=×100÷2, ×125=×1000÷8</b>. 모두 "딱 떨어지는 수의 조각"이에요!',
              en:'How to remember: <b>four 25s make 100</b>. So ×25 is a quarter of ×100. Learn the whole family: <b>×5=×10÷2, ×25=×100÷4, ×50=×100÷2, ×125=×1000÷8</b>. Each is a "fraction of a round number"!',
              zh:'记忆方法：<b>4个25凑成100</b>。所以×25是×100的四分之一。整个家族一起记：<b>×5=×10÷2，×25=×100÷4，×50=×100÷2，×125=×1000÷8</b>。都是"整数的分块"！'},
        mathSteps:['×5 = ×10÷2','×25 = ×100÷4','×50 = ×100÷2','×125 = ×1000÷8'],
        result:{ko:'딱 떨어지는 수의 조각 가족! 하나를 알면 넷을 알아요.',en:'The round-number fraction family! Know one, know all four.',zh:'整数分块家族！会一个就会四个。'},
        book:null }
    ],
    rule:{ ko:'① ×25 = ×100 후 ÷4 (4의 배수면 ÷4 먼저)  ② ×250=×1000÷4, ×2500=×10000÷4 — 0만 늘어남  ③ ÷4는 반의 반',
      en:'① ×25 = ×100 then ÷4 (÷4 first for multiples of 4)  ② ×250=×1000÷4, ×2500=×10000÷4 — only the zeros grow  ③ ÷4 = half of half',
      zh:'① ×25 = ×100后÷4(4的倍数先÷4)  ② ×250=×1000÷4，×2500=×10000÷4——只是0变多  ③ ÷4折半两次' }
  },

  check:{
    fills:[
      { tex:'48 \\times 25 = \\square', answer:1200,
        hint:{ ko:'48÷4=12, 12×100=?', en:'48÷4=12, then 12×100=?', zh:'48÷4=12，12×100=？' } },
      { tex:'16 \\times 25 = \\square', answer:400,
        hint:{ ko:'16×100=1600, 1600÷4=?', en:'16×100=1600, 1600÷4=?', zh:'16×100=1600，1600÷4=？' } }
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
    params:{ mode:'mul', level:'main' },
    intro:{
      ko:'이번엔 더 큰 수! ×100 하고 4로 나눠봐.',
      en:'Now with bigger numbers! Multiply by 100, then divide by 4.',
      zh:'现在数更大了！乘100再除以4。'
    }
  },

  arena:{
    generator:'ml_x25', level:'main', count:8, timeLimit:300,
    params:{ mode:'mul' },
    rule:{ ko:'5분 안에 ×25 문제를 모두 풀어요!', en:'Solve all ×25 problems in 5 minutes!', zh:'5分钟内解答所有×25题！' }
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
