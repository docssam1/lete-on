/* Numbers of Magic — 유닛 B-13: 7단 — 다른 단으로 쪼개기 (중급 E 챕터13) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-13'] = {
  id:'B-13', tier:'intermediate', level:'B', order:13,
  generator:'ml3_tt69',
  title:{ ko:'7단 — 다른 단으로 쪼개기', en:'7 Times — Split into Known Tables', zh:'7的乘法 — 拆成已知口诀' },
  subtitle:{ ko:'7단이 어려우면 5단+2단으로!', en:'Tough 7s? Use 5+2 or 6+1!', zh:'7的乘法难？用5+2或6+1拆！' },
  icon:'7️⃣',

  practice:{
    generator:'ml3_tt69', level:'practice', count:5,
    params:{ tables:[7] },
    intro:{
      ko:'이번엔 7단 연습이야! 7을 곱한 답을 눌러줘. 준비됐지?',
      en:"Let's practise the 7 times table! Tap the answer. Ready?",
      zh:'现在来练习7的乘法！按出答案。准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 7단 수열', en:'1) The 7s Sequence', zh:'① 7的乘法数列'},
        head:{ko:'7씩 늘어나는 수열을 외워요', en:'A sequence that grows by 7 each time', zh:'以7递增的数列'},
        desc:{ko:'7단은 7씩 늘어나는 수열이에요. <b>7, 14, 21, 28, 35, 42, 49, 56, 63</b> — 패턴을 찾으면 쉽게 기억할 수 있어요!',
              en:'The 7 times table is a sequence that increases by 7 each time. <b>7, 14, 21, 28, 35, 42, 49, 56, 63</b> — spot the pattern and it\'s easy to remember!',
              zh:'7的乘法是每次递增7的数列。<b>7、14、21、28、35、42、49、56、63</b>——找到规律就好记了！'},
        mathSteps:['7×1=7','7×2=14','7×3=21','7×4=28','7×5=35',{ko:'→ 7씩 증가!',en:'→ \\text{goes up by 7!}',zh:'→ 每次加7！'}],
        result:{ko:'7단 수열: 7, 14, 21, 28, 35, 42, 49, 56, 63. 리듬감 있게 읽으면 기억에 쏙!', en:'7s: 7, 14, 21, 28, 35, 42, 49, 56, 63. Read them rhythmically to memorise!', zh:'7的乘法：7、14、21、28、35、42、49、56、63。有节奏地朗读更容易记！'},
        book:{ko:'7×1=7부터 7×9=63까지 7씩 늘어나요. 이전 답에 7을 더하면 다음 답이 나와요.', en:'From 7×1=7 to 7×9=63, each step adds 7. Add 7 to the previous answer to get the next.', zh:'从7×1=7到7×9=63，每步加7。前一个答案加7就得到下一个。'} },

      { tag:{ko:'② 쪼개기 전략', en:'2) Split Strategy', zh:'② 拆分策略'},
        head:{ko:'7 = 5+2 또는 6+1로 분해해요', en:'Split 7 into 5+2 or 6+1', zh:'把7拆成5+2或6+1'},
        desc:{ko:'7×8처럼 외우기 어려운 곱셈은 <b>7을 쪼개서</b> 계산해요. 5×8=40과 2×8=16을 더하면 56! 또는 6×8=48과 1×8=8을 더해도 56!',
              en:'For tricky products like 7×8, <b>split 7 into parts you already know</b>. 5×8=40 plus 2×8=16 = 56! Or try 6×8=48 plus 1×8=8 = 56!',
              zh:'像7×8这样难记的乘法，把<b>7拆开来</b>计算。5×8=40加2×8=16等于56！或者6×8=48加1×8=8也等于56！'},
        mathSteps:['7×8 = (5+2)×8','= 5×8 + 2×8','= 40 + 16 = 56 ✓'],
        result:{ko:'7 = 5+2! 이미 아는 5단과 2단을 활용하면 7단도 문제없어요!', en:'7 = 5+2! Use the 5s and 2s you already know to crack the 7s!', zh:'7 = 5+2！用已知的5和2的乘法来搞定7的乘法！'},
        book:{ko:'7×n = 5×n + 2×n. 예: 7×6 = 5×6+2×6 = 30+12 = 42. 이미 아는 단수를 활용하는 전략이에요.', en:'7×n = 5×n + 2×n. e.g. 7×6 = 5×6+2×6 = 30+12 = 42. A strategy that reuses tables you already know!', zh:'7×n = 5×n + 2×n。例：7×6 = 5×6+2×6 = 30+12 = 42。利用已知口诀的策略。'} },

      { tag:{ko:'③ 이전 값+7 전략', en:'3) Previous + 7 Strategy', zh:'③ 前一个+7策略'},
        head:{ko:'이미 아는 값에 7을 더해요', en:'Add 7 to a value you already know', zh:'在已知的值上加7'},
        desc:{ko:'7×7=49를 알면, 7×8은 49+7=56이에요! <b>앞에서 구한 답에 7을 더하면</b> 다음 답을 바로 구할 수 있어요. 7×5=35부터 시작해 보아요!',
              en:"If you know 7×7=49, then 7×8 = 49+7 = 56! <b>Add 7 to the previous answer</b> to get the next one. Let's start from 7×5=35!",
              zh:'知道7×7=49，那7×8就是49+7=56！<b>在前一个答案上加7</b>就得到下一个。从7×5=35开始试试！'},
        mathSteps:['7×5=35','7×6=35+7=42','7×7=42+7=49','7×8=49+7=56','7×9=56+7=63'],
        result:{ko:'이전 답에 7만 더하면 다음 답! 7단을 쭉 세어 올라가 보아요.', en:'Just add 7 to the previous answer to get the next! Count up through the 7s.', zh:'只需在前一个答案上加7就得到下一个！沿着7的乘法往上数。'},
        book:null }
    ],
    rule:{ ko:'① 7단 = 7씩 늘어나는 수열  ② 7 = 5+2로 쪼개서 계산  ③ 이전 답+7로 다음 답 구하기', en:'① 7s = sequence adding 7 each time  ② Split 7 into 5+2 to calculate  ③ Previous answer +7 gives the next', zh:'① 7的口诀 = 每次加7的数列  ② 把7拆成5+2来计算  ③ 前一个答案+7得到下一个' }
  },

  check:{
    fills:[
      { tex:'7 \\times 6 = \\square', answer:42,
        hint:{ ko:'5×6=30, 2×6=12. 더하면?', en:'5×6=30, 2×6=12. Add them!', zh:'5×6=30，2×6=12。加起来是？' } },
      { tex:'7 \\times 8 = \\square', answer:56,
        hint:{ ko:'7×7=49, 거기에 7을 더하면?', en:'7×7=49, add 7 to get the next!', zh:'7×7=49，再加7是多少？' } }
    ],
    open:{ ko:'7을 (5+2)로 쪼개는 방법과 이전 값+7 방법 중 어느 방법이 더 편한가요? 두 방법을 모두 써서 7×6을 계산해 보아요.', en:'Which strategy do you prefer — splitting 7 into 5+2, or adding 7 to the previous answer? Use both methods to calculate 7×6.', zh:'你更喜欢哪种方法——把7拆成5+2，还是在前一个答案上加7？用两种方法计算一下7×6。' },
    openHint:{ ko:'예) 5×6=30, 2×6=12, 30+12=42 / 또는 7×5=35, 35+7=42!', en:'e.g. 5×6=30, 2×6=12, 30+12=42 / or 7×5=35, 35+7=42!', zh:'例）5×6=30，2×6=12，30+12=42 / 或者7×5=35，35+7=42！' }
  },

  lab:{
    generator:'ml3_tt69', level:'main', count:4,
    params:{ tables:[7] },
    intro:{
      ko:'이제 7단 마법을 써볼 차례야! 7을 곱한 정확한 답을 구해봐.',
      en:"Time to cast the 7-times spell! Find the exact product for each.",
      zh:'是时候施展7的乘法魔法了！找出每道题的正确积。'
    }
  },

  arena:{
    generator:'ml3_tt69', level:'main', count:8, timeLimit:300,
    params:{ tables:[7] },
    rule:{ ko:'5분 안에 7단 문제를 모두 풀어요! 쪼개기 전략을 써봐요!', en:'Solve all 7s problems in 5 minutes! Use the split strategy!', zh:'5分钟内解答所有7的口诀题！用拆分策略！' }
  },

  stamp:{ label:{ ko:'7단 마스터', en:'Seven-Times Master', zh:'7的口诀达人' }, coins:25 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'구구단 달인! 🌟',en:'Times-table master!',zh:'口诀高手！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 7단 마스터야! 7️⃣✨', en:'Perfect! 7-times master!', zh:'完美！7的口诀达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
