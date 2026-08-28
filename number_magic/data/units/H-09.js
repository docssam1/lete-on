/* Numbers of Magic — 유닛 H-09: 분리 제곱법 (고급 E-5 · 경시의 탑 28 제곱의 산 · 종합편) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['H-09'] = {
  id:'H-09', tier:'advanced', level:'28', order:3,
  lineage:['place-magic'],
  generator:'adv_splitSquare',
  title:{ ko:'분리 제곱법', en:'Split-Number Squares', zh:'分离平方法' },
  subtitle:{ ko:'다섯 자리 수도 앞부분·뒷부분으로 나누면 풀려요!', en:'Even 5-digit numbers split into front and back!', zh:'五位数也能拆成前后两部分来解！' },
  icon:'✂️',

  practice:{
    generator:'adv_splitSquare', level:'practice', count:5,
    params:{split:2,level:'practice'},
    intro:{
      ko:'다섯 자리 수를 통째로 제곱하는 건 너무 커. 둘로 쪼개보자!',
      en:'Squaring a whole 5-digit number is huge — let\'s split it in two!',
      zh:'直接平方一个五位数太大了——把它拆成两半吧！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 앞부분·뒷부분으로 쪼개기',en:'1) Split into a front and back part',zh:'① 拆成前面和后面'},
        head:{ko:'123² = (100+23)² = 100²+2×100×23+23²',en:'123² = (100+23)² = 100²+2×100×23+23²',zh:'123² = (100+23)² = 100²+2×100×23+23²'},
        desc:{ko:'123을 100(앞)과 23(뒤)으로 나눠 봐요. 123²=(100+23)²이니까, <b>앞²+2×앞×뒤+뒤²</b>로 펼쳐져요: 100²=10000, 2×100×23=4600, 23²=529. 다 더하면 10000+4600+529=<b>15129</b>! 큰 수를 작은 조각 세 개로 쪼갠 거예요.',
              en:'Split 123 into 100 (front) and 23 (back). Since 123²=(100+23)², it expands to <b>front²+2×front×back+back²</b>: 100²=10000, 2×100×23=4600, 23²=529. Add them: 10000+4600+529=<b>15129</b>! A big number broken into three smaller pieces.',
              zh:'把123拆成100（前）和23（后）。因为123²=(100+23)²，展开就是<b>前²+2×前×后+后²</b>：100²=10000，2×100×23=4600，23²=529。加起来：10000+4600+529=<b>15129</b>！一个大数拆成了三个小块。'},
        mathSteps:['100² = 10000','2×100×23 = 4600','23² = 529','10000+4600+529 = 15129'],
        result:{ko:'123²=15129! 앞²+2×앞×뒤+뒤²로 쪼개서 계산했어요.',en:'123²=15129! Split as front²+2×front×back+back².',zh:'123²=15129！拆成前²+2×前×后+后²来算。'},
        book:{ko:'각 조각(100², 23² 등)은 이미 배운 마법(근처 수 제곱, 평균값 곱셈…)으로 또 풀 수 있어요 — 마법을 재사용하는 종합편이에요.',
              en:'Each piece (100², 23², etc.) can itself use tricks you already know (near-anchor squares, average-value multiplication…) — a grand finale that reuses everything.',
              zh:'每一块（100²、23²等）都能再用学过的魔法（邻近平方、平均值乘法……）来解——是把所有魔法综合运用的大结局。'} },

      { tag:{ko:'② 어디서 쪼갤지가 관건',en:'2) Where you split matters most',zh:'② 关键在于从哪里拆'},
        head:{ko:'뒷부분을 너무 크게 잡으면 오히려 힘들어져요',en:'Making the back part too big backfires',zh:'后面部分拆得太大反而更难'},
        desc:{ko:'12345²을 (12000+345)²로 풀 수도, (1234×10+5)²로 풀 수도 있어요. 후자는 뒷부분이 겨우 한 자리(5)지만 <b>앞부분(1234)이 너무 커져서</b> 1234²를 또 풀어야 해요 — 오히려 더 어려워져요! <b>뒷부분을 2~3자리 정도</b>로 잡아야 양쪽 다 다루기 좋은 크기가 돼요. 다섯 자리는 보통 (3자리+2자리)로, 여섯 자리는 (3자리+3자리)로 쪼개는 게 편해요.',
              en:'You could split 12345² as (12000+345)² or as (1234×10+5)². The second leaves a tiny 1-digit back (5), but the <b>front (1234) becomes huge</b> — you\'d need to square 1234 too, which is actually harder! Keeping the <b>back around 2–3 digits</b> keeps both sides manageable. A 5-digit number usually splits as (3 digits+2 digits); a 6-digit one as (3+3).',
              zh:'12345²可以拆成(12000+345)²，也可以拆成(1234×10+5)²。后者的后面部分只有一位（5），但<b>前面(1234)会变得很大</b>——还得再算1234²，反而更难！把<b>后面控制在2~3位</b>左右，两边都好处理。五位数通常拆成（3位+2位），六位数拆成（3位+3位）比较方便。'},
        mathSteps:['12345 = 12000+345 (권장)','12345 = 12340+5 (비권장: 1234가 너무 큼)'],
        result:{ko:'분리 지점을 잘 골라야 두 조각 다 계산하기 쉬워요.',en:'Pick the split point so both pieces stay easy to compute.',zh:'选好拆分点，两块才都好算。'},
        book:{ko:'경시의 탑의 마지막 문: 이 유닛은 자리의 마법(자릿값→자리 이동 곱셈→분리 제곱법)의 종착점이고, 다음은 중2~3의 다항식 곱셈·곱셈공식으로 이어져요.',
              en:'The final gate of the Tower of Challenges: this unit completes the place-value lineage, leading next to polynomial multiplication and the algebraic identities of middle school.',
              zh:'"竞赛之塔"的最后一关：这个单元完成了位值魔法的传承，接下来将通向初二、初三的多项式乘法与乘法公式。'} }
    ],
    rule:{ ko:'① 큰 수를 앞부분×10ⁿ+뒷부분으로 쪼개기  ② 앞²+2×앞×뒤+뒤²로 전개  ③ 뒷부분은 2~3자리로 — 앞이 너무 커지지 않게',
      en:'① Split a big number into front×10ⁿ+back  ② Expand as front²+2×front×back+back²  ③ Keep the back to 2–3 digits so the front stays manageable',
      zh:'① 把大数拆成前×10ⁿ+后  ② 展开为前²+2×前×后+后²  ③ 后面留2~3位，避免前面变得太大' }
  },

  check:{
    fills:[
      { tex:'205^2 = \\square', answer:42025,
        hint:{ ko:'200+5로 쪼개기: 200²+2×200×5+5²', en:'split 200+5: 200²+2×200×5+5²', zh:'拆成200+5：200²+2×200×5+5²' } },
      { tex:'11012^2 = \\square', answer:121264144,
        hint:{ ko:'11000+12로 쪼개기: 11000²+2×11000×12+12²', en:'split 11000+12: 11000²+2×11000×12+12²', zh:'拆成11000+12：11000²+2×11000×12+12²' } }
    ],
    open:{ ko:'54321²을 (3자리+2자리)와 (4자리+1자리) 두 방식으로 쪼개보고, 왜 하나가 더 어려운지 설명해 봐요.',
      en:'Split 54321² two ways — (3 digits+2) and (4 digits+1) — and explain why one is harder.',
      zh:'把54321²分别拆成（3位+2位）和（4位+1位），说说为什么其中一种更难。' },
    openHint:{ ko:'예) 543|21이 편해요(앞 543은 세 자리). 5432|1은 뒷부분이 한 자리로 작아 보이지만 5432²를 또 풀어야 해서 더 힘들어요.',
      en:'e.g. 543|21 is easier (front stays 3 digits). 5432|1 looks like a smaller back, but forces you to square 5432 too — harder overall.',
      zh:'例）543|21更方便（前面543是三位）。5432|1看起来后面只有一位，但还得再算5432²，反而更难。' }
  },

  lab:{
    generator:'adv_splitSquare', level:'main', count:4,
    params:{split:2,level:'main'},
    intro:{
      ko:'다섯 자리 수 제곱을 끝 두 자리 분리로 풀어보자!',
      en:'Tackle 5-digit squares by splitting off the last 2 digits!',
      zh:'用拆末两位来搞定五位数的平方！'
    }
  },

  arena:{
    generator:'adv_splitSquare', level:'main', count:8, timeLimit:300,
    params:{split:3,level:'main'},
    rule:{ ko:'5분 안에 끝 세 자리 분리 제곱을 모두 풀어요!', en:'Solve all last-3-digit split squares in 5 minutes!', zh:'5分钟内解答所有拆末三位的平方题！' }
  },

  stamp:{ label:{ ko:'분리 제곱 대마법사', en:'Split-Square Archmage', zh:'分离平方大魔法师' }, coins:40 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'딱 좋은 곳에서 쪼갰어! ✂️',en:'Split in just the right spot!',zh:'拆分位置刚刚好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'가운데 항(2×앞×뒤)을 잊지 않았는지 확인해봐!',en:'Check you didn\'t forget the middle term (2×front×back)!',zh:'检查是否漏掉了中间项(2×前×后)！'}, {ko:'세 조각을 자리값에 맞게 더했는지 봐!',en:'Make sure the three pieces are added at the right place value!',zh:'看看三块是否按正确的位值相加了！'} ],
    finish:{ ko:'완벽해! 분리 제곱 대마법사! ✂️✨', en:'Perfect! Split-Square Archmage!', zh:'完美！分离平方大魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
