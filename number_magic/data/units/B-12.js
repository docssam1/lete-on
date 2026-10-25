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
    title:{ko:'누미의 마법 노트',en:"Numi's Magic Note",zh:'努米的魔法笔记'},
    stages:[
      {tag:{ko:'① 같은 수를 곱해요',en:'1) Keep the second number the same',zh:'① 乘的数保持相同'},
       head:{ko:'2단에서 4단, 8단으로 두 배씩!',en:'Double from 2s to 4s to 8s!',zh:'从2到4再到8，依次翻倍！'},
       desc:{ko:'곱하는 수가 같을 때, 2단 답의 두 배는 4단 답이고 4단 답의 두 배는 8단 답이에요.',en:'With the same second factor, double the 2s answer to get the 4s answer, then double again for the 8s.',zh:'乘的数相同时，2的答案翻倍是4的答案，再翻倍就是8的答案。'},
       mathSteps:['2×6=12','4×6=12×2=24','8×6=24×2=48'],
       result:{ko:'6을 곱한 답은 12 → 24 → 48이에요.',en:'For a second factor of 6: 12 → 24 → 48.',zh:'都乘6时：12 → 24 → 48。'},book:null},
      {tag:{ko:'② 10묶음에서 한 묶음을 빼요',en:'2) Take one group away from ten groups',zh:'② 从十组里去掉一组'},
       head:{ko:'8×9는 8×10에서 8을 빼요',en:'For 8×9, subtract 8 from 8×10',zh:'8×9可以用8×10减8'},
       desc:{ko:'8이 10묶음이면 80이에요. 8 한 묶음을 빼면 9묶음이 남아요.',en:'Ten groups of 8 make 80. Remove one group of 8 to leave nine groups.',zh:'10组8是80，去掉一组8，就剩9组。'},
       mathSteps:['8×9=8×10−8','=80−8','=72'],
       result:{ko:'8 한 묶음을 빼면 80−8=72예요.',en:'Subtract one group, which is 8.',zh:'要减去的是一组的数量8。'},book:null},
      {tag:{ko:'③ 곱하는 수를 확인해요',en:'3) Check the second factor',zh:'③ 确认乘的是同一个数'},
       head:{ko:'같은 수를 곱한 답끼리 비교해요',en:'Compare answers with the same second factor',zh:'比较乘同一个数的答案'},
       desc:{ko:'앞의 수를 두 배로 바꿀 때, 뒤의 수는 그대로 두어요.',en:'When you double the first factor, keep the second one unchanged.',zh:'把前面的数翻倍时，后面的数保持不变。'},
       mathSteps:['2×3=6 → 4×3=12 → 8×3=24','2×9=18 → 4×9=36 → 8×9=72'],
       result:{ko:'2·4·8단은 같은 수를 곱한 답을 두 배씩 이어서 구해요.',en:'Link the 2s, 4s and 8s by doubling answers for the same second factor.',zh:'乘相同的数时，通过答案翻倍，把2、4、8的口诀联系起来。'},book:null}
    ],
    rule:{ko:'① 곱하는 수가 같을 때 두 배씩 이어져요. ② 8×9=8×10−8이에요. ③ 곱하는 수를 바꾸지 않았는지 확인해요.',en:'1) Keep the second factor the same when doubling. 2) 8×9=8×10−8. 3) Check both factors.',zh:'① 乘相同的数时，答案依次翻倍。② 8×9=8×10−8。③ 检查两个因数。'}
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
