/* Numbers of Magic — 유닛 H-13: 큰 수 정복 (고급 B-3 · 과정 24 보강) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['H-13'] = {
  id:'H-13', tier:'advanced', level:'boost', order:3,
  lineage:['ten-friends'],
  generator:'adv_bigscale',
  title:{ ko:'큰 수 정복', en:'Conquering Big Numbers', zh:'征服大数' },
  subtitle:{ ko:'1000 × 1000만은 얼마일까요?? 0을 세면 답이 보여요!', en:'1000 × 10,000,000 — what is it?? Count the zeros!', zh:'1000 × 1000万是多少？？数一数0就知道了！' },
  icon:'🏔️',

  practice:{
    generator:'adv_bigscale', level:'practice', count:5,
    params:{},
    intro:{
      ko:'만, 억, 조… 0이 몇 개씩 모여야 한 계단 올라갈까? 같이 세어보자!',
      en:'Ten-thousand, hundred-million, trillion… how many zeros climb one step? Let\'s count!',
      zh:'万、亿、万亿……要攒多少个0才能往上跳一级？一起数数吧！'
    }
  },

  discover:{
    story:{
      hook:{ ko:'계산기가 없던 시절, 천문학자들은 열두 자리 수끼리 손으로 곱해야 했어요. 어떻게 버텼을까요?',
        en:'Before calculators, astronomers multiplied twelve-digit numbers by hand. How did they survive it?',
        zh:'没有计算器的年代，天文学家要手算十二位数相乘。他们是怎么撑过来的？' },
      history:{ ko:'로그표를 썼어요. 곱셈을 덧셈으로 바꿔 주는 표라서, 두 수의 로그값을 찾아 더하고 다시 되돌리면 답이 나왔죠. 우리가 1000 × 1000만을 0의 개수만 세어 100억이라고 바로 아는 것도, 곱셈을 자릿수 덧셈으로 바꾸는 같은 아이디어의 초등판이에요.',
        en:'They used log tables, which turn multiplication into addition: look up two logarithms, add them, convert back. When we count zeros to see that 1,000 × 10,000,000 is 10 billion, we are doing the elementary version of that same trade — multiplication swapped for adding place values.',
        zh:'他们用对数表——把乘法变成加法：查出两个数的对数，相加，再换回来。我们数0就知道1000 × 1000万是100亿，正是同一个想法的小学版：把乘法换成位数相加。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 0을 다 세면 단위가 보여요',en:'1) Count every zero to see the unit',zh:'① 数完所有0就能看出单位'},
        head:{ko:'1000 × 1000만?? 얼마인가요?',en:'1000 × 10,000,000?? What is it?',zh:'1000 × 1000万？？是多少呢？'},
        desc:{ko:'1000×1000만을 순간적으로 대답하기란 쉽지 않아요. 이럴 땐 <b>0의 개수를 세는 것</b>이 열쇠예요! 1000에는 0이 <b>3개</b>, 1000만에는 0이 <b>7개</b> — 다 더하면 0이 <b>10개</b>예요. 0이 4개씩 모일 때마다 만→억→조로 한 계단씩 올라가요: 0이 8개면 억, 0이 10개면 억보다 두 계단 위 — 100억! 실제로 1000×1000만=<b>100억</b>이에요.',
              en:'Answering 1000×10,000,000 in a flash isn\'t easy — the key is <b>counting the zeros</b>! 1000 has <b>3</b> zeros, 10,000,000 has <b>7</b> — together, <b>10</b> zeros. Every 4 more zeros climbs one unit step: 만→억→조. 8 zeros means 억(hundred-million); 10 zeros lands two steps past that — 10 billion! Indeed, 1000×10,000,000=<b>10,000,000,000</b>.',
              zh:'要马上答出1000×1000万可不容易——关键是<b>数0的个数</b>！1000有<b>3</b>个0，1000万有<b>7</b>个——加起来<b>10</b>个0。每多4个0就往上跳一级：万→亿→万亿。8个0是亿；10个0比亿再多跳一点——100亿！确实，1000×1000万=<b>100亿</b>。'},
        mathSteps:['1000: 0이 3개','1000만: 0이 7개','3+7 = 10 (총 0의 개수)','0이 8개=억 → 100억'],
        result:{ko:'1000×1000만=100억! 0의 개수만 세면 단위가 저절로 보여요.',en:'1000×10,000,000=10 billion! Just count the zeros to see the unit.',zh:'1000×1000万=100亿！数一数0，单位自然就出来了。'},
        book:{ko:'우리나라 수 단위는 4자리씩 끊어 읽어요(만·억·조), 영어권은 3자리씩 끊어요(thousand·million·billion) — 그래서 번역할 때 헷갈리기 쉬워요.',
              en:'Korean groups digits by 4 (ten-thousand, hundred-million, trillion), while English groups by 3 (thousand, million, billion) — that mismatch is why translating between them trips people up.',
              zh:'韩语数字单位每4位一组（万、亿、万亿），英语每3位一组（thousand、million、billion）——所以两者换算时很容易搞混。'} },

      { tag:{ko:'② 실생활 속 큰 수',en:'2) Big numbers in real life',zh:'② 生活中的大数'},
        head:{ko:'컴퓨터의 1024, 우주까지의 거리…',en:'A computer\'s 1024, distances to space…',zh:'电脑里的1024，到太空的距离……'},
        desc:{ko:'큰 수는 교실 밖에서도 계속 만나요. 컴퓨터의 1킬로바이트는 1000이 아니라 <b>1024(=2¹⁰)</b>예요! 나라 예산, 인구 수, 별까지의 거리도 전부 만·억·조 단위로 이야기해요. 0의 개수 세는 습관을 들이면, 어떤 큰 수를 만나도 "이게 억 단위구나, 조 단위구나" 바로 감이 와요.',
              en:'Big numbers show up outside the classroom too. A computer\'s kilobyte isn\'t 1000 — it\'s <b>1024 (=2¹⁰)</b>! National budgets, populations, and distances to stars are all discussed in these huge units. Once you build the habit of counting zeros, any big number instantly tells you its scale.',
              zh:'大数在课堂外也随处可见。电脑里的1千字节不是1000，而是<b>1024（=2¹⁰）</b>！国家预算、人口、到星星的距离，都用这些巨大的单位来说。养成数0的习惯后，遇到任何大数都能立刻感觉出它的量级。'},
        mathSteps:['2¹⁰ = 1024 (컴퓨터의 1킬로바이트)'],
        result:{ko:'큰 수를 다루는 감각은 교실 밖에서도 계속 쓰여요.',en:'A feel for big numbers keeps being useful outside the classroom.',zh:'处理大数的直觉走出课堂也一样有用。'},
        book:{ko:'경시의 탑에서는 억·조까지 다뤘지만, 그 위로도 경(京)·해(垓)처럼 단위가 계속 이어져요 — 끝없이 큰 수가 있다는 뜻이에요.',
              en:'The Tower reaches up to trillion, but Korean has even bigger units above that — a hint that numbers can grow without end.',
              zh:'"竞赛之塔"讲到了万亿，但韩语里还有更大的单位——这提示着数字可以无穷无尽地变大。'} }
    ],
    rule:{ ko:'① 두 수의 0 개수를 각각 세기  ② 두 0의 개수를 더하기  ③ 0이 4개씩 모일 때마다 만→억→조로 한 단계씩',
      en:'① Count the zeros in each number  ② Add the two zero-counts  ③ Every 4 more zeros climbs one step: ten-thousand→hundred-million→trillion',
      zh:'① 分别数出两个数各自的0  ② 把两组0的个数相加  ③ 每多4个0就升一级：万→亿→万亿' }
  },

  check:{
    fills:[
      { tex:'10000 \\times 10000 = \\square\\,\\text{(억)}', answer:1,
        hint:{ ko:'0이 4+4=8개 → 억 1개', en:'zeros 4+4=8 → 1 hundred-million', zh:'0是4+4=8个 → 1亿' } },
      { tex:'100 \\times 1000000 = \\square\\,\\text{(억)}', answer:1,
        hint:{ ko:'0이 2+6=8개 → 억 1개', en:'zeros 2+6=8 → 1 hundred-million', zh:'0是2+6=8个 → 1亿' } }
    ],
    open:{ ko:'100만×100만을 0의 개수로 풀고, 몇 조인지 말해 봐요.',
      en:'Solve 1,000,000×1,000,000 by counting zeros, and say how many trillion it is.',
      zh:'用数0的方法算100万×100万，说说是多少万亿。' },
    openHint:{ ko:'예) 0이 6+6=12개. 0이 8개면 억, 12개면 그보다 한 단계 더 위인 조 — 12−12=0개 남으니 정확히 1조.',
      en:'e.g. zeros 6+6=12. 8 zeros is hundred-million, 12 is one step further — trillion — with 0 left over, so exactly 1 trillion.',
      zh:'例）0是6+6=12个。8个0是亿，12个是再往上一级——万亿——正好剩0个，所以恰好是1万亿。' }
  },

  lab:{
    generator:'adv_bigscale', level:'main', count:4,
    params:{},
    intro:{
      ko:'억과 조를 넘나드는 큰 수에 도전해보자!',
      en:'Take on big numbers crossing hundred-million and trillion!',
      zh:'挑战跨越亿和万亿的大数吧！'
    }
  },

  arena:{
    generator:'adv_bigscale', level:'main', count:8, timeLimit:300,
    params:{},
    rule:{ ko:'5분 안에 큰 수 정복 문제를 모두 풀어요!', en:'Solve all big-number problems in 5 minutes!', zh:'5分钟内解答所有征服大数的题目！' }
  },

  stamp:{ label:{ ko:'큰 수 정복왕', en:'Conqueror of Big Numbers', zh:'征服大数之王' }, coins:34 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'0을 완벽하게 셌어! 🏔️',en:'Zeros counted perfectly!',zh:'0数得真准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'두 수의 0 개수를 다시 세어봐!',en:'Recount the zeros in each number!',zh:'重新数一数两个数的0！'}, {ko:'0이 4개씩 모일 때마다 한 단계씩 올라가!',en:'Every 4 zeros climbs one step!',zh:'每4个0就升一级！'} ],
    finish:{ ko:'완벽해! 큰 수 정복왕! 🏔️✨', en:'Perfect! Conqueror of Big Numbers!', zh:'完美！征服大数之王！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
