/* ============================================================
   Numbers of Magic — 유닛 데이터: A-07
   초급 A · 챕터7 "배와 반 + 구구 2~5단"
   교재 개념 기반(창작 재구성). generator=ml1_double / ml2_tt25.
   핵심: ×2 = 두 배(double), ÷2 = 절반(half)
   배열(직사각형)로 곱셈의 의미를 눈으로 확인.
   구구 2~5단: 배열 그림 → 패턴 찾기 → 암기
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-07'] = {
  id:'A-07', tier:'beginner', level:'A', order:7,
  generator:'ml1_double',
  title:{ ko:'배와 반 — 구구 2~5단', en:'Double & Half — Times Tables 2-5', zh:'翻倍与减半·乘法口诀2~5' },
  subtitle:{ ko:'두 배는 같은 수를 한 번 더 더하기, 절반은 둘로 나누기', en:'Double = add the same number once more; Half = split in two', zh:'翻倍=再加一次相同的数；减半=分成两份' },
  icon:'✌️',

  /* ── STEP1 프랙티스: ml1_double ×2 워밍업 ── */
  practice:{
    generator:'ml1_double', level:'practice', count:5,
    intro:{
      ko:'두 배 연습! 내가 숫자를 부르면 두 배가 얼마인지 눌러줘.',
      en:"Doubles practice! I'll call a number — tap its double!",
      zh:'翻倍练习！我说一个数，你按出它的两倍！'
    }
  },

  /* ── STEP2 디스커버: 배와 반 + 구구 2~5단 개념 3단 ── */
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 두 배와 절반이란?', en:'1) What are Double and Half?', zh:'① 什么是翻倍和减半？' },
        head:{ ko:'같은 수 두 묶음이 두 배, 둘로 나누면 절반', en:'Two groups of the same size = double; split in two = half', zh:'两组相同的数量=翻倍；分成两半=减半' },
        desc:{ ko:'4개의 사과가 있어요. 한 묶음이 4개인 두 묶음을 만들면 4×2=8 (두 배). 다시 둘로 나누면 8÷2=4 (절반). <b>두 배와 절반은 서로 반대 마법이에요!</b>',
               en:"Imagine 4 apples. Two groups of 4 gives 4×2=8 (double). Split 8 back into two equal groups → 8÷2=4 (half). Double and half are opposite spells!",
               zh:'假设有4个苹果。两组各4个，4×2=8（翻倍）。再分成两半，8÷2=4（减半）。翻倍和减半是互相反转的魔法！' },
        mathSteps:['4 × 2 = 8  (두 배)', '8 ÷ 2 = 4  (절반)', '두 배 ↔ 절반은 역(逆)관계'],
        result:{ ko:'두 배했다가 절반 하면 다시 원래 수로! 6→12→6', en:'Double then half returns to the start! 6→12→6', zh:'翻倍再减半回到原数！6→12→6' },
        book:{ ko:'직사각형 배열로 생각해요: 4×2 = 가로 4, 세로 2인 직사각형에 점이 몇 개?',
               en:'Think of arrays: 4×2 = how many dots in a 4-column, 2-row rectangle?',
               zh:'用阵列图来想：4×2 = 4列2行的矩形里有多少个点？' } },

      { tag:{ ko:'② 구구 2~5단 — 배열로 보기', en:'2) Times tables 2-5 through arrays', zh:'② 乘法口诀2~5——用阵列图看' },
        head:{ ko:'곱셈은 같은 묶음을 여러 번 더하는 것', en:'Multiplication = adding equal groups repeatedly', zh:'乘法=把相同的组重复相加' },
        desc:{ ko:'3×4는 3개짜리 묶음이 4개예요. 또는 4개짜리 묶음이 3개예요. 직사각형에서 가로 × 세로 = 전체 수! <b>구구단은 이 계산 결과를 미리 기억해 두는 거예요.</b>',
               en:'3×4 means 3 groups of 4 — or 4 groups of 3. In a rectangle: columns × rows = total. Times tables are just these results memorized in advance!',
               zh:'3×4表示3个4，或者4个3。在矩形里：列数×行数=总数。乘法口诀就是提前记住这些计算结果！' },
        mathSteps:['2단: 2,4,6,8,10,12,14,16,18','3단: 3,6,9,12,15,18,21,24,27','4단: 4,8,12,16,20,24,28,32,36','5단: 5,10,15,20,25,30,35,40,45'],
        result:{ ko:'2단은 짝수! 5단은 항상 0 또는 5로 끝나요!', en:'2-table: all even! 5-table: always ends in 0 or 5!', zh:'2的倍数都是偶数！5的倍数总以0或5结尾！' },
        book:{ ko:'배열 그림에서 가로·세로를 바꿔도 같아요: 3×4 = 4×3 = 12.',
               en:'Rotating the array gives the same answer: 3×4 = 4×3 = 12.',
               zh:'旋转阵列图结果不变：3×4 = 4×3 = 12。' } },

      { tag:{ ko:'③ 패턴을 찾아요', en:'3) Find the pattern', zh:'③ 发现规律' },
        head:{ ko:'구구단에는 아름다운 규칙이 있어요', en:'Times tables have beautiful patterns', zh:'乘法口诀里藏着美丽的规律' },
        desc:{ ko:'2단은 2씩 커져요. 3단은 3씩. 5단은 5씩이고 항상 0이나 5로 끝나요. 4단은 짝수만! 이런 패턴을 알면 외우기 훨씬 쉬워요.',
               en:'The 2-table grows by 2s; 3-table by 3s; 5-table by 5s (always ends 0 or 5); 4-table is all even. Knowing these patterns makes memorization easy.',
               zh:'2的倍数每次增加2；3的增加3；5的增加5且总以0或5结尾；4的都是偶数。掌握这些规律，背口诀容易多了。' },
        mathSteps:['5단 패턴: 5,10,15,20,25 → 끝자리가 5,0,5,0,5...','4단 = 2단의 두 배: 4×3 = 2×3×2 = 6×2 = 12','9단 손가락 트릭 맛보기: 9×3=27 (2+7=9!)'],
        result:{ ko:'패턴을 알면 외우다가 잊어도 직접 계산할 수 있어요!', en:'Knowing patterns means you can always figure it out — even if you forget!', zh:'知道规律，就算忘了也能推算出来！' },
        book:null }
    ],
    rule:{ ko:'① 두 배 = 같은 수 두 번 더하기(×2)  ② 절반 = 둘로 나누기(÷2)  ③ 구구단은 배열 그림으로 이해하면 오래 기억',
      en:'① Double = add the same number twice (×2)  ② Half = divide into 2 (÷2)  ③ Understanding tables with arrays helps you remember longer.',
      zh:'①翻倍=加两次相同的数(×2) ②减半=分成2份(÷2) ③用阵列图理解口诀，记忆更持久。' }
  },

  /* ── STEP3 핵심체크 ── */
  check:{
    fills:[
      { tex:'6 \\times 2 = \\square', answer:12,
        hint:{ ko:'6+6=? 또는 배열 그림으로 6개짜리 묶음 2개!', en:'6+6=? or think of 2 groups of 6 in an array!', zh:'6+6=？或者想想2组6个的阵列图！' } },
      { tex:'4 \\times 5 = \\square', answer:20,
        hint:{ ko:'5단: 5,10,15,20 — 4번째!', en:'5-table: 5,10,15,20 — the 4th!', zh:'5的倍数：5,10,15,20——第4个！' } }
    ],
    open:{
      ko:'배와 절반의 관계를 이용해서 8×4를 더 쉽게 계산하는 방법이 있을까요?',
      en:'Using the relationship between doubling and halving, can you find an easier way to calculate 8×4?',
      zh:'利用翻倍和减半的关系，有没有更简单的方法来计算8×4呢？'
    },
    openHint:{
      ko:'예) 8×4 = 8×2×2 = 16×2 = 32. 두 배를 두 번 하면 4배가 돼요!',
      en:'e.g. 8×4 = 8×2×2 = 16×2 = 32. Doubling twice = ×4!',
      zh:'例）8×4 = 8×2×2 = 16×2 = 32。翻倍两次就是乘以4！'
    }
  },

  /* ── STEP4 매직랩 ── */
  lab:{
    generator:'ml1_double', level:'main', count:4,
    intro:{
      ko:'배열 보드로 직접 두 배와 절반을 만들어봐요! 점을 배열해서 답을 확인해요.',
      en:"Use the array board to build doubles and halves yourself! Arrange the dots to find the answer.",
      zh:'用阵列板亲手做出翻倍和减半！排列点点来验证答案。'
    }
  },

  /* ── STEP5 아레나: 구구 2~5단 스피드 ── */
  arena:{
    generator:'ml2_tt25', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 구구 2~5단을 최대한 많이! 배열 그림으로 기억해요.', en:'Times tables 2-5 speed round — 5 minutes, as many as possible!', zh:'5分钟内尽量多答乘法口诀2~5！' }
  },

  stamp:{ label:{ ko:'배열 마법사', en:'Array Wizard', zh:'阵列魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'배열 완성! ✌️',en:'Array complete!',zh:'阵列完成！'}, {ko:'두 배 마법 성공! 🪄',en:'Double magic works!',zh:'翻倍魔法成功！'} ],
    wrong:[ {ko:'음~ 배열 그림을 그려볼까?',en:'Hmm — try drawing an array!',zh:'嗯，试试画阵列图？'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 배열 마법사야 ✌️✨', en:"Perfect! You're an Array Wizard now!", zh:'完美！你现在是阵列魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
