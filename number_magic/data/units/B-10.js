/* Numbers of Magic — 유닛 B-10: 4단 = 2단의 두 배! (중급 D 챕터1) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-10'] = {
  id:'B-10', tier:'intermediate', level:'B', order:10,
  generator:'ml2_tt25',
  title:{ ko:'4단 = 2단의 두 배!', en:'4 Times = Double the 2s!', zh:'4的乘法 = 2的乘法翻倍！' },
  subtitle:{ ko:'2단을 알면 4단은 저절로!', en:'Know your 2s, and 4s follow!', zh:'会了2的口诀，4的口诀自然就来！' },
  icon:'4️⃣',

  practice:{
    generator:'ml2_tt25', level:'practice', count:5,
    params:{ tables:[4] },
    intro:{
      ko:'4단 마법을 연습해 볼 거야. 내가 문제를 보여주면, 정답을 눌러줘. 2단을 생각하면 쉬워! 준비됐지?',
      en:"Let's practise the 4 times table! Think of your 2s and double them. Ready?",
      zh:'我们来练习4的口诀！想想2的口诀再翻倍。准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 4단 = 2단 × 2', en:'1) 4 times = 2 times × 2', zh:'① 4的口诀 = 2的口诀 × 2'},
        head:{ko:'2단을 알면 4단은 저절로!', en:'Know the 2s? Then you know the 4s!', zh:'会了2的口诀，4的口诀自然就来！'},
        desc:{ko:'4단은 <b>2단의 두 배</b>예요. 4×3은 "2×3을 두 배"하면 바로 나와요! 2×3=6이니까 6을 두 배 하면 12. 이게 4×3의 답이에요!',
              en:'The 4 times table is just <b>double the 2 times table</b>. 4×3? Do 2×3 first, then double it! 2×3=6, so 6×2=12. That\'s 4×3!',
              zh:'4的口诀就是<b>2的口诀翻倍</b>。算4×3？先算2×3=6，再翻倍=12。这就是4×3的答案！'},
        mathSteps:['4×3 = ?','= 2×3 × 2','= 6 × 2 = 12'],
        result:{ko:'4×3=12! 2단만 알아도 4단을 풀 수 있어요.', en:'4×3=12! Knowing your 2s unlocks the 4s.', zh:'4×3=12！会2的口诀就能解4的口诀。'},
        book:{ko:'4단 = 2단 × 2. 어떤 수든 2단 결과를 두 배 하면 4단이 나와요. 4×n = (2×n) × 2.', en:'4×n = (2×n) × 2. Any 4-times answer is just double the matching 2-times answer.', zh:'4×n = (2×n) × 2。任何4的口诀答案都是对应2的口诀答案的两倍。'} },

      { tag:{ko:'② 4단 끝자리 패턴', en:'2) The 4s digit pattern', zh:'② 4的口诀个位数规律'},
        head:{ko:'끝자리가 4·8·2·6·0으로 반복돼요', en:'The last digits cycle: 4, 8, 2, 6, 0', zh:'个位数按4·8·2·6·0循环'},
        desc:{ko:'4단의 답을 쭉 써보면 끝자리가 4→8→2→6→0 순서로 <b>반복</b>돼요. 4×5=20에서 끝자리가 0이 되고, 4×6부터 다시 4·8·2·6·0 패턴이 시작돼요!',
              en:'Write out the 4 times table and the last digits <b>repeat</b>: 4→8→2→6→0. After 4×5=20 (ends in 0), the pattern starts again from 4×6!',
              zh:'写出4的口诀，个位数<b>重复</b>：4→8→2→6→0。4×5=20（个位是0）之后，从4×6开始又重复这个规律！'},
        mathSteps:['4×1=4','4×2=8','4×3=12 (끝:2)','4×4=16 (끝:6)','4×5=20 (끝:0) → 반복!'],
        result:{ko:'끝자리 패턴 4·8·2·6·0을 기억하면 답이 맞는지 빠르게 확인할 수 있어요!', en:'Remember 4·8·2·6·0 to quickly check if your answer is right!', zh:'记住4·8·2·6·0，就能快速验证答案是否正确！'},
        book:{ko:'4단의 끝자리는 4·8·2·6·0이 반복돼요. 답의 끝자리가 이 중 하나가 아니면 실수한 거예요!', en:'4×table last digits cycle: 4, 8, 2, 6, 0. If your answer\'s last digit isn\'t in this list, recheck!', zh:'4的口诀个位数循环：4·8·2·6·0。若答案个位不在其中，说明算错了！'} },

      { tag:{ko:'③ 4단 쉬운 계산 전략', en:'3) Easy strategies for 4s', zh:'③ 轻松算4的口诀的策略'},
        head:{ko:'두 가지 방법으로 4×7을 풀어봐요', en:'Two ways to tackle 4×7', zh:'用两种方法算4×7'},
        desc:{ko:'4×7처럼 조금 큰 수도 걱정 없어요. <b>방법1</b>: 2×7=14를 두 배 해서 28. <b>방법2</b>: 4×5=20과 4×2=8을 더해서 28. 두 방법 모두 28이에요!',
              en:'Don\'t worry about bigger facts like 4×7. <b>Method 1</b>: Double 2×7=14 → 28. <b>Method 2</b>: 4×5=20 plus 4×2=8 → 28. Both give 28!',
              zh:'像4×7这样稍大的题目也不用担心。<b>方法1</b>：2×7=14翻倍=28。<b>方法2</b>：4×5=20加4×2=8=28。两种方法都是28！'},
        mathSteps:['4×7 방법1: 2×7=14, 14+14=28','4×7 방법2: 4×5=20, 4×2=8, 20+8=28','둘 다 28! ✓'],
        result:{ko:'4단이 어렵다면 방법1(2단 두 배)이나 방법2(쪼개서 더하기) 중 편한 것을 골라요!', en:'Struggling with 4s? Pick the method that works best for you — either one gets you there!', zh:'算4的口诀有困难？选一种你觉得顺手的方法——两种都能得出正确答案！'},
        book:null }
    ],
    rule:{ ko:'① 4단 = 2단 결과 × 2  ② 끝자리 패턴: 4·8·2·6·0 반복  ③ 어려우면 쪼개거나 2단 두 배!', en:'① 4×n = (2×n)×2  ② Last-digit pattern: 4·8·2·6·0  ③ Stuck? Split it or double the 2s!', zh:'① 4×n = (2×n)×2  ② 个位规律：4·8·2·6·0循环  ③ 难？拆分或对2的口诀翻倍！' }
  },

  check:{
    fills:[
      { tex:'4 \\times 7 = \\square', answer:28,
        hint:{ ko:'2×7=14, 14를 두 배 하면?', en:'2×7=14, then double it!', zh:'2×7=14，再翻倍是多少？' } },
      { tex:'4 \\times 9 = \\square', answer:36,
        hint:{ ko:'2×9=18, 18을 두 배 하면?', en:'2×9=18, then double it!', zh:'2×9=18，再翻倍是多少？' } }
    ],
    open:{ ko:'4단을 빠르게 외울 수 있는 나만의 방법이 있나요? 2단을 이용하거나 패턴을 활용해 설명해 봐요.', en:'Can you think of your own trick for the 4 times table? Explain using the 2s or the digit pattern.', zh:'你有自己快速记忆4的口诀的方法吗？试着用2的口诀或数字规律来解释。' },
    openHint:{ ko:'예) 4×6이 어려우면? 2×6=12, 12+12=24! 끝자리가 4니까 맞아요.', en:'e.g. Stuck on 4×6? 2×6=12, 12+12=24! Last digit is 4, so it checks out.', zh:'例）4×6算不出来？2×6=12，12+12=24！个位是4，对应规律，答对了。' }
  },

  lab:{
    generator:'ml2_tt25', level:'main', count:4,
    params:{ tables:[4] },
    intro:{
      ko:'이제 4단 마법을 써볼 차례야! 2단을 두 배 하는 전략을 떠올리며 풀어봐.',
      en:"Time to put the 4s into action! Remember: double your 2s.",
      zh:'是时候施展4的口诀魔法了！记住：对2的口诀翻倍。'
    }
  },

  arena:{
    generator:'ml2_tt25', level:'main', count:8, timeLimit:300,
    params:{ tables:[4] },
    rule:{ ko:'5분 안에 4단 문제를 모두 풀어요!', en:'Solve all 4-times problems in 5 minutes!', zh:'5分钟内解答所有4的口诀题！' }
  },

  stamp:{ label:{ ko:'4단 마스터', en:'Four-Times Master', zh:'4的口诀达人' }, coins:25 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'구구단 달인! 🌟',en:'Times-table master!',zh:'口诀高手！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 4단 마스터야! 4️⃣✨', en:'Perfect! 4-times master!', zh:'完美！4的口诀达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
