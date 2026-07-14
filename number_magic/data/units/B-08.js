/* Numbers of Magic — 유닛 B-08: 6단 = 3의 두 배! (중급 C 챕터8) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-08'] = {
  id:'B-08', tier:'intermediate', level:'B', order:8,
  generator:'ml3_tt69',
  title:{ ko:'6단 = 3의 두 배!', en:'6 Times = Double the 3s!', zh:'6的乘法 = 3的乘法翻倍！' },
  subtitle:{ ko:'6단을 몰라도 3단만 알면 돼요', en:'Know your 3s, and 6s come free!', zh:'会3的口诀，6的口诀自然就会！' },
  icon:'6️⃣',

  practice:{
    generator:'ml3_tt69', level:'practice', count:5,
    params:{ tables:[6] },
    intro:{
      ko:'6단을 연습해 볼 거야. 3단을 알면 6단도 금방이야! 정답을 눌러줘. 준비됐지?',
      en:"Let's practise the 6 times table. Know your 3s? Then 6s are easy! Tap the answer. Ready?",
      zh:'我们来练习6的乘法口诀。会3的口诀就能轻松学会6的！按出答案。准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 6단 = 3단 × 2', en:'1) 6× = 3× doubled', zh:'① 6的乘法 = 3的乘法×2'},
        head:{ko:'3단을 알면 6단은 두 배!', en:'Double your 3× answer to get 6×!', zh:'3的答案翻倍就是6的答案！'},
        desc:{ko:'6단은 <b>3단의 두 배</b>예요. 6×4가 궁금하면? 3×4=12를 두 배 하면 24! 3단만 알면 6단도 저절로 풀려요.',
              en:'6× is simply <b>3× doubled</b>. Wondering about 6×4? Double 3×4=12 to get 24! Knowing your 3s unlocks your 6s automatically.',
              zh:'6的乘法就是<b>3的乘法翻倍</b>。想知道6×4？把3×4=12翻倍就得24！会3的口诀，6的口诀自然就会了。'},
        mathSteps:['6×4 = ?','= 3×4 × 2','= 12 × 2 = 24'],
        result:{ko:'6×4=24. 3×4=12의 두 배! 이 방법으로 6단을 모두 구할 수 있어요.', en:'6×4=24. That is double 3×4=12! Use this method for every 6× fact.', zh:'6×4=24，正好是3×4=12的两倍！用这个方法可以算出所有6的乘法。'},
        book:{ko:'6×n = 3×n × 2. 3단 답을 기억하고 두 배 하면 6단 완성! 암산 시 두 단계로 나눠 생각해요.', en:'6×n = 3×n × 2. Remember the 3× answer, then double it to get any 6× fact.', zh:'6×n = 3×n × 2。记住3的答案再翻倍，就能得出任何6的乘法结果。'} },

      { tag:{ko:'② 6단 끝자리 패턴', en:'2) The ones-digit pattern in 6×', zh:'② 6的乘法个位规律'},
        head:{ko:'끝자리가 반복돼요', en:'The ones digit repeats!', zh:'个位数字在重复！'},
        desc:{ko:'6단 결과의 <b>끝자리</b>를 보면 규칙이 있어요. 6, 2, 8, 4, 0이 계속 반복돼요! 이 패턴을 알면 답을 빨리 확인할 수 있어요.',
              en:'Look at the <b>ones digit</b> of each 6× answer — it cycles through 6, 2, 8, 4, 0, then repeats! Spotting the pattern helps you check answers fast.',
              zh:'看6的乘法结果的<b>个位数字</b>，有规律！6、2、8、4、0不断循环！认识这个规律能帮你快速验证答案。'},
        mathSteps:['6×1=6','6×2=12','6×3=18','6×4=24','6×5=30 → 끝자리: 6,2,8,4,0 반복'],
        result:{ko:'6단 끝자리: 6→2→8→4→0→6→2→8→4→0. 규칙적으로 반복돼요!', en:'6× ones digits: 6→2→8→4→0→6→2→8→4→0. A perfect cycle!', zh:'6的乘法个位：6→2→8→4→0→6→2→8→4→0，完美循环！'},
        book:{ko:'6단 결과의 끝자리는 6, 2, 8, 4, 0 순서로 반복돼요. 끝자리로 답이 맞는지 바로 확인할 수 있어요.', en:'6× ones digits cycle as 6, 2, 8, 4, 0. Use this cycle to spot-check any 6× answer.', zh:'6的乘法个位按6、2、8、4、0循环。可以用这个规律快速检验6的乘法答案。'} },

      { tag:{ko:'③ 6단 vs 3단 비교', en:'3) Comparing 6× and 3×', zh:'③ 6的乘法与3的乘法对比'},
        head:{ko:'항상 3단의 두 배예요', en:'Always exactly double the 3× answer', zh:'总是3的答案的两倍'},
        desc:{ko:'3단과 6단을 나란히 보면 <b>항상 딱 두 배</b>예요. 3×5=15, 6×5=30=15×2. 이 관계를 외우면 두 단을 한꺼번에 마스터할 수 있어요!',
              en:'Put 3× and 6× side by side and 6× is <b>always exactly double</b>. 3×5=15, 6×5=30=15×2. Master this link and you master both tables at once!',
              zh:'把3的乘法和6的乘法放在一起，6的结果<b>总是3的两倍</b>。3×5=15，6×5=30=15×2。掌握这个联系，就能同时掌握两张口诀表！'},
        mathSteps:['3×6=18 → 6×6=36=18×2','3×7=21 → 6×7=42=21×2','3×8=24 → 6×8=48=24×2'],
        result:{ko:'6×6=36, 6×7=42, 6×8=48, 6×9=54 — 3단의 딱 두 배!', en:'6×6=36, 6×7=42, 6×8=48, 6×9=54 — exactly double the 3× answers!', zh:'6×6=36，6×7=42，6×8=48，6×9=54——正好是3的乘法答案的两倍！'},
        book:null }
    ],
    rule:{ ko:'① 6단 = 3단의 두 배  ② 끝자리: 6→2→8→4→0 반복  ③ 3단을 알면 6단은 자동!',
      en:'① 6× = double the 3× answer  ② Ones digit cycles 6→2→8→4→0  ③ Know your 3s — 6s follow automatically!',
      zh:'① 6的乘法 = 3的乘法×2  ② 个位循环6→2→8→4→0  ③ 会3的口诀，6的口诀自然就会！' }
  },

  check:{ fills:[
    { tex:'6 \\times 7 = \\square', answer:42, hint:{ko:'3×7=21이면, 21×2=?', en:'3×7=21, so 21×2=?', zh:'3×7=21，那么21×2=？'} },
    { tex:'6 \\times 9 = \\square', answer:54, hint:{ko:'3×9=27이면, 27×2=?', en:'3×9=27, so 27×2=?', zh:'3×9=27，那么27×2=？'} }
  ], open:{ko:'6단을 외울 때 3단을 먼저 생각하는 게 도움이 되나요? 어떤 방법이 더 좋을까요?', en:'Does thinking about 3× first help you with 6×? What strategy works best for you?', zh:'先想3的口诀再推出6的口诀，这样有帮助吗？哪种方法对你最有效？'}, openHint:{ko:'예) 3×8=24를 먼저 떠올리고 두 배 해서 6×8=48! 3단이 탄탄하면 6단도 금방이에요.', en:'e.g. Think 3×8=24 first, then double it → 6×8=48! Strong 3s make 6s lightning-fast.', zh:'例）先想3×8=24，再翻倍→6×8=48！3的口诀记得牢，6的口诀就飞快了。'} },

  lab:{ generator:'ml3_tt69', level:'main', count:4, params:{tables:[6]}, intro:{ko:'이제 진짜 6단 마법을 써볼 차례야! 3단의 두 배 전략으로 빠르게 풀어봐.', en:"Time to cast the real 6-times spell! Use the double-your-3s strategy to solve fast.", zh:'是时候施展真正的6的乘法魔法了！用翻倍3的口诀的策略快速解题。'} },
  arena:{ generator:'ml3_tt69', level:'main', count:8, timeLimit:300, params:{tables:[6]}, rule:{ko:'5분 안에 6단 문제를 모두 풀어요!', en:'Solve all 6× problems in 5 minutes!', zh:'5分钟内解答所有6的乘法题！'} },

  stamp:{ label:{ ko:'6단 마스터', en:'Six-Times Master', zh:'6的口诀达人' }, coins:25 },
  voice:{
    correct:[{ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'},{ko:'구구단 달인! 🌟',en:'Times-table master!',zh:'口诀高手！'},{ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'}],
    wrong:[{ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'},{ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'}],
    finish:{ ko:'완벽해! 6단 마스터 달성! 🎯✨', en:'Perfect! 6-times table master!', zh:'完美！6的乘法口诀达人！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
