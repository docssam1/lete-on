/* Numbers of Magic — 유닛 H-01: 한쪽으로 모으기 (고급 A-1 · 경시의 탑 26 곱셈의 정점) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['H-01'] = {
  id:'H-01', tier:'advanced', level:'26', order:1,
  lineage:['halves-doubles'],
  generator:'adv_gather',
  title:{ ko:'한쪽으로 모으기', en:'Gathering to One Side', zh:'移到一边' },
  subtitle:{ ko:'48×12 = 288×2 = 576: 곱하는 수를 나눈 만큼 곱해지는 수를 키워요!', en:'48×12 = 288×2 = 576: shrink one, grow the other!', zh:'48×12 = 288×2 = 576：一个变小，另一个就翻倍变大！' },
  icon:'🧲',

  practice:{
    generator:'adv_gather', level:'practice', count:5,
    params:{level:'practice'},
    intro:{
      ko:'곱하는 수를 반으로, 3분의 1로 계속 줄이면서 곱해지는 수를 그만큼 키워봐. 답은 절대 안 변해!',
      en:'Keep shrinking the multiplier by half or a third while growing the multiplicand by the same factor — the answer never changes!',
      zh:'把乘数不断减半或减到三分之一，同时把被乘数放大同样的倍数——答案永远不变！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 나누고 곱하면 그대로',en:'1) Divide and multiply — nothing changes',zh:'① 一除一乘，值不变'},
        head:{ko:'48×3×12÷3 = 48×12',en:'48×3×12÷3 = 48×12',zh:'48×3×12÷3 = 48×12'},
        desc:{ko:'어떤 수를 3으로 곱했다가 다시 3으로 나누면 원래대로 돌아와요. 그럼 <b>48×12</b>를 <b>48×3</b>과 <b>12÷3</b>으로 바꿔 써도 값은 똑같겠죠? <b>144×4</b>가 돼요! 한 번 더: <b>144×4 = 576×1 = 576</b>. 곱하는 수가 1이 될 때까지 계속하면, 마지막엔 그냥 답이 남아요.',
              en:'Multiply by 3 then divide by 3, and you land right back where you started. So <b>48×12</b> can become <b>48×3</b> and <b>12÷3</b> without changing the value — that\'s <b>144×4</b>! Keep going: <b>144×4 = 576×1 = 576</b>. Repeat until the multiplier hits 1, and the answer is just sitting there.',
              zh:'一个数乘3再除3，又回到原来的值。所以<b>48×12</b>可以变成<b>48×3</b>和<b>12÷3</b>而值不变——就是<b>144×4</b>！再来一次：<b>144×4 = 576×1 = 576</b>。一直做到乘数变成1，答案就自然出现了。'},
        mathSteps:['48 × 12','48×3 = 144, 12÷3 = 4','144 × 4','144×4 = 576, 4÷4 = 1','576 × 1 = 576'],
        result:{ko:'48×12=576! 곱하는 수를 1로 몰아가며 곱해지는 수를 키웠어요.',en:'48×12=576! Drove the multiplier to 1 while growing the multiplicand.',zh:'48×12=576！把乘数一路推到1，被乘数就跟着变大。'},
        book:{ko:'왜 값이 안 변할까요? 소인수분해로 보면 12=3×4니까, 48×12=48×(3×4)=(48×3)×4 — 그냥 곱셈의 순서를 바꾼 것뿐이에요.',
              en:'Why does the value stay the same? Since 12=3×4, we have 48×12=48×(3×4)=(48×3)×4 — just regrouping the multiplication.',
              zh:'为什么值不变？因为12=3×4，所以48×12=48×(3×4)=(48×3)×4——只是重新组合了乘法顺序。'} },

      { tag:{ko:'② 여러 걸음으로 몰아가기',en:'2) Several steps to the finish',zh:'② 分几步走到底'},
        head:{ko:'큰 수도 걸음걸음 쉬워져요',en:'Big numbers get easy, step by step',zh:'大数也能一步步变简单'},
        desc:{ko:'곱하는 수가 12든 24든, 2·3·4·6처럼 나누기 쉬운 수로 쪼개 여러 번에 나눠 몰아줄 수 있어요. 226×14라면 226×2=452, 14÷2=7 → 452×7=3164. 한 번에 안 끝나도 괜찮아요, 몇 걸음이든 곱하는 수가 1이 될 때까지 가면 돼요!',
              en:'Whether the multiplier is 12 or 24, split it using easy divisors like 2, 3, 4, 6 and gather in several steps. For 226×14: 226×2=452, 14÷2=7 → 452×7=3164. It\'s fine if it takes more than one step — just keep going until the multiplier is 1!',
              zh:'不管乘数是12还是24，都能用2、3、4、6这样好算的数拆开分几步来移。226×14：226×2=452，14÷2=7 → 452×7=3164。不用一步到位，走几步都行，直到乘数变成1！'},
        mathSteps:['226 × 14','226×2 = 452, 14÷2 = 7','452 × 7 = 3164'],
        result:{ko:'226×14=3164! 큰 곱셈도 몰아주기 몇 걸음이면 충분해요.',en:'226×14=3164! Even big products need only a few gathering steps.',zh:'226×14=3164！再大的乘法也只需几步就能搞定。'},
        book:{ko:'경시의 탑에서는 곱하는 수를 소인수(2, 3, 5, 7…)로 완전히 쪼개는 연습을 해요 — 나중에 배울 소인수분해의 예고편이에요.',
              en:'In the Tower of Challenges, we practice fully splitting the multiplier into prime factors (2, 3, 5, 7…) — a preview of prime factorization to come.',
              zh:'在"竞赛之塔"里，我们练习把乘数彻底拆成质因数（2、3、5、7…）——这是以后要学的质因数分解的预告。'} }
    ],
    rule:{ ko:'① 곱하는 수를 나누기 쉬운 수로 쪼개기  ② 그 수만큼 곱해지는 수를 키우기  ③ 곱하는 수가 1이 될 때까지 반복',
      en:'① Split the multiplier into easy factors  ② Grow the multiplicand by the same factor  ③ Repeat until the multiplier is 1',
      zh:'① 把乘数拆成好算的因数  ② 把被乘数放大同样的倍数  ③ 重复直到乘数变成1' }
  },

  check:{
    fills:[
      { tex:'36 \\times 4 = \\square', answer:144,
        hint:{ ko:'36×2=72, 4÷2=2 → 72×2=?', en:'36×2=72, 4÷2=2 → 72×2=?', zh:'36×2=72，4÷2=2 → 72×2=？' } },
      { tex:'25 \\times 16 = \\square', answer:400,
        hint:{ ko:'25×4=100, 16÷4=4 → 100×4=?', en:'25×4=100, 16÷4=4 → 100×4=?', zh:'25×4=100，16÷4=4 → 100×4=？' } }
    ],
    open:{ ko:'75×12를 한쪽으로 모으기로 풀고, 몇 걸음 만에 곱하는 수가 1이 됐는지 말해 봐요.',
      en:'Solve 75×12 by gathering to one side, and say how many steps it took for the multiplier to reach 1.',
      zh:'用"移到一边"算75×12，说说乘数经过几步变成了1。' },
    openHint:{ ko:'예) 75×2=150, 12÷2=6 → 150×2=300, 6÷2=3 → 300×3=900. 두 걸음!',
      en:'e.g. 75×2=150, 12÷2=6 → 150×2=300, 6÷2=3 → 300×3=900. Two steps!',
      zh:'例）75×2=150，12÷2=6 → 150×2=300，6÷2=3 → 300×3=900。两步！' }
  },

  lab:{
    generator:'adv_gather', level:'main', count:4,
    params:{level:'main'},
    intro:{
      ko:'세 자리×두 자리도 몰아주면 술술 풀려!',
      en:'Even 3-digit × 2-digit flows smoothly once you gather!',
      zh:'三位数乘两位数，移到一边照样顺畅！'
    }
  },

  arena:{
    generator:'adv_gather', level:'main', count:8, timeLimit:300,
    params:{level:'main'},
    rule:{ ko:'5분 안에 한쪽으로 모으기 문제를 모두 풀어요!', en:'Solve all gathering problems in 5 minutes!', zh:'5分钟内解答所有移到一边的题目！' }
  },

  stamp:{ label:{ ko:'몰아주기 마법사', en:'One-Side Gathering Wizard', zh:'移到一边魔法师' }, coins:34 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'한쪽으로 잘 모았어! 🧲',en:'Nicely gathered!',zh:'移得真好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'나눈 만큼 곱해줬는지 확인해봐!',en:'Check you grew it by the same amount you shrank!',zh:'检查一下放大的倍数是否和缩小的一样！'}, {ko:'곱하는 수가 1이 될 때까지 계속!',en:'Keep going until the multiplier hits 1!',zh:'继续做到乘数变成1！'} ],
    finish:{ ko:'완벽해! 몰아주기 마법사! 🧲✨', en:'Perfect! One-Side Gathering Wizard!', zh:'完美！移到一边魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
