/* Numbers of Magic — 유닛 B-11: 8단 = 두 배 세 번! (중급 D 챕터2) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-11'] = {
  id:'B-11', tier:'intermediate', level:'B', order:11,
  generator:'ml3_tt69',
  title:{ ko:'8단 = 두 배 세 번!', en:'8 Times = Triple Doubling!', zh:'8的乘法 = 三次翻倍！' },
  subtitle:{ ko:'×8 = ×2×2×2. 두 배를 세 번!', en:'×8 = ×2×2×2. Double three times!', zh:'×8 = ×2×2×2，翻三次倍！' },
  icon:'8️⃣',

  practice:{
    generator:'ml3_tt69', level:'practice', count:5,
    params:{ tables:[8] },
    intro:{
      ko:'8단 마법을 연습해 볼 거야. 두 배를 세 번 하면 8배! 준비됐지?',
      en:"Let's practise the 8 times table! Double, double, double — that's ×8. Ready?",
      zh:'我们来练习8的口诀！翻倍，翻倍，再翻倍——这就是×8。准备好了吗？'
    }
  },

  discover:{
    story:{
      hook:{ ko:'원판 3개를 규칙대로 다른 기둥에 모두 옮기려면 몇 번 옮겨야 할까요? (한 번에 하나씩, 큰 원판을 작은 원판 위에 놓으면 안 돼요)',
        en:'How many moves to shift 3 discs to another peg — one at a time, never a bigger disc on a smaller one?',
        zh:'要把3个圆盘按规则全部移到另一根柱子，需要移动几次？（一次只能移一个，大盘不能压在小盘上）' },
      history:{ ko:'7번이에요. 두 배를 세 번 한 8에서 하나 뺀 수죠. 원판이 하나 늘 때마다 횟수는 두 배보다 하나 적게 늘어나서, 4개면 15번, 5개면 31번이 돼요. 인도 사원에 원판 64개가 있다는 하노이 탑 전설에서는 1초에 한 번씩 옮겨도 약 6000억 년이 걸립니다.',
        en:'Seven. That is three doublings, eight, minus one. Each extra disc doubles the count and takes one off: 4 discs need 15, 5 discs need 31. In the Tower of Hanoi legend the temple has 64 discs — one move per second would take about 600 billion years.',
        zh:'7次。也就是翻三次倍得到的8再减1。每多一个圆盘，次数就翻倍再减一：4个要15次，5个要31次。汉诺塔传说里寺庙有64个圆盘，就算每秒移一次，也要约6000亿年。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 8단 = 두 배 × 두 배 × 두 배', en:'1) 8 times = double × double × double', zh:'① 8的口诀 = 翻倍×翻倍×翻倍'},
        head:{ko:'두 배를 세 번 하면 8배!', en:'Double three times and you get 8 times!', zh:'翻三次倍就是8倍！'},
        desc:{ko:'8=2×2×2이에요. 그래서 <b>어떤 수든 두 배를 세 번</b> 하면 8배가 돼요! 3×8을 구하려면 3을 출발해서 두 배·두 배·두 배를 해봐요.',
              en:'Since 8=2×2×2, you can get <b>8 times any number by doubling three times</b>! Start with 3 and double three times to find 3×8.',
              zh:'因为8=2×2×2，所以<b>把任意数翻三次倍</b>就能得到它的8倍！从3出发，翻倍三次来算3×8。'},
        mathSteps:['3×8','= 3 →×2→ 6 →×2→ 12 →×2→ 24','= 24 ✓'],
        result:{ko:'3→6→12→24. 두 배를 세 번 하면 끝! 3×8=24이에요.', en:'3→6→12→24. Three doublings and you\'re done! 3×8=24.', zh:'3→6→12→24。翻倍三次就完成了！3×8=24。'},
        book:{ko:'8×n = n을 두 배 세 번. n →×2→ 2n →×2→ 4n →×2→ 8n. 단계별로 차근차근 하면 실수를 줄일 수 있어요.', en:'8×n = double n three times: n → 2n → 4n → 8n. Step by step reduces mistakes.', zh:'8×n = 把n翻倍三次：n → 2n → 4n → 8n。一步步来能减少失误。'} },

      { tag:{ko:'② 4단에서 8단으로', en:'2) From 4s to 8s', zh:'② 从4的口诀到8的口诀'},
        head:{ko:'4단을 알면 8단은 두 배!', en:'Know the 4s? Just double for 8s!', zh:'会4的口诀？再翻倍就是8的口诀！'},
        desc:{ko:'4단 결과에 <b>×2만 더</b> 하면 8단이 돼요. 4×6=24라는 걸 알면, 8×6=24×2=48! 4단 덕분에 8단을 절반의 노력으로 외울 수 있어요.',
              en:'The 8s are just <b>double the 4s</b>. Already know 4×6=24? Then 8×6=24×2=48! The 4s save you half the work for the 8s.',
              zh:'8的口诀就是<b>4的口诀再翻倍</b>。已知4×6=24？那么8×6=24×2=48！会4的口诀，学8的口诀就省了一半力气。'},
        mathSteps:['4×6=24 → 8×6=48 (×2)','4×7=28 → 8×7=56 (×2)','4×8=32 → 8×8=64 (×2)'],
        result:{ko:'4단 × 2 = 8단. 세 쌍을 보면서 패턴을 느껴봐요!', en:'4s × 2 = 8s. Study these pairs and feel the pattern!', zh:'4的口诀 × 2 = 8的口诀。看这三对，感受规律！'},
        book:{ko:'8단을 새로 외울 필요 없어요. 4단 결과를 두 배 하면 그게 바로 8단이에요. 8×n = 2 × (4×n).', en:'No need to memorise the 8s from scratch. 8×n = 2×(4×n). Your 4s knowledge does the work!', zh:'不用从头背8的口诀。8×n = 2×(4×n)。你的4的口诀知识就能搞定！'} },

      { tag:{ko:'③ 8단 끝자리 패턴', en:'3) The 8s digit pattern', zh:'③ 8的口诀个位数规律'},
        head:{ko:'끝자리가 8·6·4·2·0으로 반복돼요', en:'Last digits cycle: 8, 6, 4, 2, 0', zh:'个位数按8·6·4·2·0循环'},
        desc:{ko:'8단의 답을 쭉 적어보면 끝자리가 8→6→4→2→0 순서로 <b>반복</b>돼요! 8×5=40에서 끝자리가 0이 되고, 8×6부터 다시 8·6·4·2·0이 시작돼요.',
              en:'Write out the 8s and the last digits <b>repeat</b>: 8→6→4→2→0! At 8×5=40 (ends in 0) the cycle resets, and 8×6 starts it again.',
              zh:'写出8的口诀，个位数<b>重复</b>：8→6→4→2→0！到8×5=40（个位是0）循环重置，8×6又重新开始。'},
        mathSteps:['8×1=8',{ko:'8×2=16 (끝:6)',en:'8×2=16 \\text{ (ends in 6)}',zh:'8×2=16（末位6）'},{ko:'8×3=24 (끝:4)',en:'8×3=24 \\text{ (ends in 4)}',zh:'8×3=24（末位4）'},{ko:'8×4=32 (끝:2)',en:'8×4=32 \\text{ (ends in 2)}',zh:'8×4=32（末位2）'},{ko:'8×5=40 (끝:0) → 반복!',en:'8×5=40 \\text{ (ends in 0) → repeats!}',zh:'8×5=40（末位0）→ 循环！'}],
        result:{ko:'8·6·4·2·0 패턴! 답이 이 끝자리가 아니면 다시 확인해요.', en:'8·6·4·2·0 pattern! If your answer\'s last digit isn\'t in this list, check again.', zh:'8·6·4·2·0规律！若答案个位不在其中，记得检查。'},
        book:null }
    ],
    rule:{ ko:'① 8단 = 두 배 × 두 배 × 두 배  ② 4단을 알면 ×2로 8단!  ③ 끝자리 패턴: 8·6·4·2·0 반복', en:'① 8×n = double three times  ② 8s = 4s × 2  ③ Last-digit pattern: 8·6·4·2·0', zh:'① 8×n = 翻倍三次  ② 8的口诀 = 4的口诀×2  ③ 个位规律：8·6·4·2·0循环' }
  },

  check:{
    fills:[
      { tex:'8 \\times 6 = \\square', answer:48,
        hint:{ ko:'4×6=24, 24를 두 배 하면?', en:'4×6=24, then double it!', zh:'4×6=24，再翻倍是多少？' } },
      { tex:'8 \\times 7 = \\square', answer:56,
        hint:{ ko:'4×7=28, 28을 두 배 하면?', en:'4×7=28, then double it!', zh:'4×7=28，再翻倍是多少？' } }
    ],
    open:{ ko:'8단을 외울 때 어떤 방법이 제일 쉬웠나요? 두 배 세 번, 4단 두 배, 끝자리 패턴 중 골라 설명해봐요.', en:'Which method worked best for you to learn the 8s? Explain using triple-doubling, the 4s, or the digit pattern.', zh:'学8的口诀时，哪种方法最简单？试着用三次翻倍、4的口诀翻倍或个位规律来解释。' },
    openHint:{ ko:'예) 8×9가 어려우면? 4×9=36, 36+36=72! 끝자리 2이니까 맞아요.', en:'e.g. Stuck on 8×9? 4×9=36, 36+36=72! Last digit 2, matches the pattern.', zh:'例）8×9算不出来？4×9=36，36+36=72！个位是2，符合规律，答对了。' }
  },

  lab:{
    generator:'ml3_tt69', level:'main', count:4,
    params:{ tables:[8] },
    intro:{
      ko:'이제 8단 마법을 써볼 차례야! 두 배 세 번 또는 4단 두 배 전략을 골라 풀어봐.',
      en:"Time to cast the 8-times spell! Use triple-doubling or the 4s-then-double strategy.",
      zh:'是时候施展8的口诀魔法了！用三次翻倍或4的口诀翻倍策略来解题。'
    }
  },

  arena:{
    generator:'ml3_tt69', level:'main', count:8, timeLimit:300,
    params:{ tables:[8] },
    rule:{ ko:'5분 안에 8단 문제를 모두 풀어요!', en:'Solve all 8-times problems in 5 minutes!', zh:'5分钟内解答所有8的口诀题！' }
  },

  stamp:{ label:{ ko:'8단 마스터', en:'Eight-Times Master', zh:'8的口诀达人' }, coins:25 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'구구단 달인! 🌟',en:'Times-table master!',zh:'口诀高手！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 두 배 세 번 마스터! 8️⃣✨', en:'Perfect! Triple-double master!', zh:'完美！三次翻倍达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
