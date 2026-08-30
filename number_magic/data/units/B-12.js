/* Numbers of Magic — 유닛 B-12: 4단·8단 혼합 — 짝수 구구 총정리 (중급 D 챕터3) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-12'] = {
  id:'B-12', tier:'intermediate', level:'B', order:12,
  generator:'ml3_tt69',
  title:{ ko:'4단·8단 혼합 — 짝수 구구', en:'4s & 8s Mix — Even Times Tables', zh:'4和8的口诀混合 — 偶数口诀' },
  subtitle:{ ko:'2·4·8단은 모두 두 배 패밀리!', en:'2, 4, 8 — all in the doubling family!', zh:'2·4·8都是翻倍家族！' },
  icon:'🔢',

  practice:{
    generator:'ml3_tt69', level:'practice', count:5,
    params:{ tables:[4,8] },
    intro:{
      ko:'4단과 8단을 섞어 연습해 볼 거야. 두 배 패밀리 전략을 떠올리며 풀어봐! 준비됐지?',
      en:"Let's mix up 4s and 8s! Keep the doubling-family strategy in mind. Ready?",
      zh:'我们来混合练习4和8的口诀！记住翻倍家族的策略。准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 두 배 패밀리 관계', en:'1) The doubling-family connection', zh:'① 翻倍家族的关系'},
        head:{ko:'2단 → 4단 → 8단, 두 배씩 이어져요!', en:'2s → 4s → 8s, each doubles the last!', zh:'2的口诀→4的口诀→8的口诀，每次都翻倍！'},
        desc:{ko:'2단·4단·8단은 모두 <b>두 배 패밀리</b>예요. 2단에 ×2를 하면 4단, 4단에 ×2를 하면 8단이 나와요. 하나만 알면 나머지 둘도 바로 풀려요!',
              en:'The 2s, 4s, and 8s are all in the <b>doubling family</b>. 2s × 2 = 4s, and 4s × 2 = 8s. Know one and you can get the other two instantly!',
              zh:'2·4·8的口诀都属于<b>翻倍家族</b>。2的口诀×2=4的口诀，4的口诀×2=8的口诀。只要会一个，另外两个立刻就能算出来！'},
        mathSteps:['2×6=12','4×6=24 (12×2)','8×6=48 (24×2)',{ko:'→ 서로 두 배 관계!',en:'→ \\text{each is double the last!}',zh:'→ 互为两倍关系！'}],
        result:{ko:'6을 기준으로: 2단=12, 4단=24, 8단=48. 모두 두 배씩 이어져요!', en:'With 6 as the base: 2s=12, 4s=24, 8s=48. Each is double the previous!', zh:'以6为基础：2的口诀=12，4的口诀=24，8的口诀=48。每个都是前一个的两倍！'},
        book:{ko:'2·4·8단은 두 배 패밀리. 2×n → (×2) → 4×n → (×2) → 8×n. 이 구조를 이해하면 세 단을 한꺼번에 기억할 수 있어요.', en:'2×n → (×2) → 4×n → (×2) → 8×n. Understanding this structure lets you hold all three tables in memory at once.', zh:'2×n → (×2) → 4×n → (×2) → 8×n。理解这个结构，三个口诀就能一起记住。'} },

      { tag:{ko:'② 빠른 8단 전략: ×10-×2', en:'2) Fast 8s trick: ×10 − ×2', zh:'② 快速算8的口诀：×10−×2'},
        head:{ko:'8×9처럼 큰 식은 이렇게!', en:'For bigger 8s facts like 8×9, try this!', zh:'像8×9这样较大的题，这样算！'},
        desc:{ko:'8×9가 어렵다면, <b>10을 곱하고 2를 빼는</b> 방법을 써봐요! 8×10=80, 여기서 8×1=8을 빼면 72. 훨씬 쉽죠?',
              en:'If 8×9 feels hard, try <b>multiplying by 10 then subtracting one group</b>! 8×10=80, minus 8×1=8, gives 72. Much easier!',
              zh:'如果8×9很难，试试<b>先乘10再减一个</b>的方法！8×10=80，减去8×1=8，得到72。简单多了！'},
        mathSteps:['8×9 = 8×10 - 8','= 80 - 8','= 72 ✓'],
        result:{ko:'8×9=72! ×10-×1 전략은 8단의 큰 수에도 쓸 수 있어요.', en:'8×9=72! The ×10−×1 trick works for any large 8s fact.', zh:'8×9=72！×10−×1的技巧适用于任何较大的8的口诀。'},
        book:{ko:'8×n이 어려우면: 8×(n+1)에서 8을 빼거나, 8×10=80에서 빼는 방법으로 접근해요. 계산 전략은 한 가지만이 아니에요!', en:'If 8×n is tricky: try 8×10 minus extras, or step up to 8×(n+1) and subtract. Multiple strategies = more flexibility!', zh:'如果8×n很难：试试8×10减去多余的，或从8×(n+1)减去一个。掌握多种策略 = 更灵活！'} },

      { tag:{ko:'③ 2·4·8단 구별 팁', en:'3) How to tell 2s, 4s, and 8s apart', zh:'③ 如何区分2·4·8的口诀'},
        head:{ko:'어떤 수가 2단인지, 4단인지, 8단인지 알 수 있어요!', en:'You can tell whether a number is in the 2s, 4s, or 8s!', zh:'你能判断一个数是2·4·8哪个口诀的！'},
        desc:{ko:'모든 짝수는 2단에 있어요. 4의 배수(4·8·12·16…)는 4단에도 있고, 8의 배수(8·16·24·32…)는 8단에도 있어요. 큰 수가 어느 단인지 판별해 봐요!',
              en:'Every even number is in the 2s. Multiples of 4 (4, 8, 12, 16…) are also in the 4s, and multiples of 8 (8, 16, 24, 32…) are in the 8s too. Can you sort these?',
              zh:'所有偶数都在2的口诀里。4的倍数（4·8·12·16…）也在4的口诀里，8的倍数（8·16·24·32…）也在8的口诀里。你能判断这些数吗？'},
        mathSteps:[{ko:'18: 2단○(2×9) / 4단×(4×4.5) / 8단×',en:'18: \\text{×2 ○ }(2×9)\\text{ / ×4 ✗ }(4×4.5)\\text{ / ×8 ✗}',zh:'18：×2○(2×9) / ×4✗(4×4.5) / ×8✗'},{ko:'24: 2단○ / 4단○(4×6) / 8단×(8×3=24) ✓',en:'24: \\text{×2 ○ / ×4 ○ }(4×6)\\text{ / ×8 }(8×3=24) ✓',zh:'24：×2○ / ×4○(4×6) / ×8(8×3=24) ✓'},{ko:'48: 2단○ / 4단○(4×12) / 8단○(8×6)',en:'48: \\text{×2 ○ / ×4 ○ }(4×12)\\text{ / ×8 ○ }(8×6)',zh:'48：×2○ / ×4○(4×12) / ×8○(8×6)'}],
        result:{ko:'48은 2단·4단·8단 모두에 있어요! 더 큰 배수일수록 더 많은 단에 속해요.', en:'48 appears in the 2s, 4s, and 8s! The larger the multiple, the more tables it belongs to.', zh:'48同时在2·4·8的口诀里！倍数越大，属于的口诀越多。'},
        book:null }
    ],
    rule:{ ko:'① 2→4→8단은 두 배 패밀리  ② 큰 8단은 ×10−×n 전략  ③ 2단⊃4단⊃8단 포함 관계', en:'① 2s→4s→8s: doubling family  ② Big 8s: use ×10−n trick  ③ Every 8s fact is also a 4s and 2s fact', zh:'① 2→4→8：翻倍家族  ② 较大8的口诀：用×10−n技巧  ③ 8的口诀也属于4和2的口诀' }
  },

  check:{
    fills:[
      { tex:'4 \\times 8 = \\square', answer:32,
        hint:{ ko:'2×8=16, 16을 두 배 하면?', en:'2×8=16, then double it!', zh:'2×8=16，再翻倍是多少？' } },
      { tex:'8 \\times 9 = \\square', answer:72,
        hint:{ ko:'8×10=80, 80에서 8을 빼면?', en:'8×10=80, then subtract 8!', zh:'8×10=80，再减去8是多少？' } }
    ],
    open:{ ko:'2단·4단·8단 중 가장 외우기 쉬운 단은 무엇인가요? 세 단이 어떻게 연결되어 있는지 설명해봐요.', en:'Which is easiest to learn — 2s, 4s, or 8s? Explain how the three tables are connected.', zh:'2·4·8的口诀中，哪个最容易记？试着解释三个口诀是如何联系在一起的。' },
    openHint:{ ko:'예) 2단을 알면 ×2로 4단, 4단을 ×2하면 8단. 2×7=14 → 4×7=28 → 8×7=56!', en:'e.g. 2s → ×2 → 4s → ×2 → 8s. So 2×7=14 → 4×7=28 → 8×7=56!', zh:'例）2的口诀×2=4的口诀，4的口诀×2=8的口诀。2×7=14→4×7=28→8×7=56！' }
  },

  lab:{
    generator:'ml3_tt69', level:'main', count:4,
    params:{ tables:[4,8] },
    intro:{
      ko:'4단과 8단이 섞여 나와! 두 배 패밀리 전략을 골라 빠르게 풀어봐.',
      en:"4s and 8s are mixed together now! Pick your doubling-family strategy and go fast.",
      zh:'4和8的口诀混在一起了！选择你的翻倍家族策略，快速解题。'
    }
  },

  arena:{
    generator:'ml3_tt69', level:'main', count:8, timeLimit:300,
    params:{ tables:[4,8] },
    rule:{ ko:'5분 안에 4단·8단 혼합 문제를 모두 풀어요!', en:'Solve all 4s & 8s mixed problems in 5 minutes!', zh:'5分钟内解答所有4和8的混合口诀题！' }
  },

  stamp:{ label:{ ko:'짝수 구구 달인', en:'Even Tables Pro', zh:'偶数口诀达人' }, coins:25 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'구구단 달인! 🌟',en:'Times-table master!',zh:'口诀高手！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 짝수 구구 달인이야! 🔢✨', en:'Perfect! Even-tables pro!', zh:'完美！偶数口诀达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
