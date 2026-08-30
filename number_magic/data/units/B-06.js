/* Numbers of Magic — 유닛 B-06: 2단·5단 혼합 + 교환법칙 (중급 B 챕터6) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-06'] = {
  id:'B-06', tier:'intermediate', level:'B', order:6,
  generator:'ml2_tt25',
  title:{ ko:'2단·5단 혼합 + 교환법칙', en:'2s & 5s Mix + Commutative Property', zh:'2和5的口诀混合 + 交换律' },
  subtitle:{ ko:'2×5=5×2! 곱셈의 순서를 바꿔도 같아요', en:"2×5=5×2! Multiplication order doesn't matter!", zh:'2×5=5×2！乘法顺序不影响结果！' },
  icon:'🔄',

  practice:{
    generator:'ml2_tt25', level:'practice', count:5,
    params:{ tables:[2,5] },
    intro:{
      ko:'2단과 5단을 섞어서 연습해요! 빠르게 답을 눌러줘. 준비됐지?',
      en:"Let's mix the 2s and 5s tables! Tap the answer fast. Ready?",
      zh:'混合练习2和5的乘法！快速按出答案。准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 교환법칙', en:'1) Commutative Property', zh:'① 交换律' },
        head:{ ko:'곱하는 순서를 바꿔도 답이 같아요', en:'Swap the order — same answer!', zh:'交换顺序——答案相同！' },
        desc:{ ko:'3×2와 2×3은 같아요! 배열을 옆으로 돌리면 같은 모양이 돼요. 곱셈은 <b>순서가 달라도 결과가 같아요</b>.',
               en:"3×2 and 2×3 are equal! Rotate the array and it's the same shape. Multiplication <b>order doesn't change the result</b>.",
               zh:'3×2和2×3相等！把阵列旋转一下形状相同。<b>乘法顺序不影响结果</b>。' },
        mathSteps:['3×2 = 2+2+2 = 6','2×3 = 3+3 = 6','3×2 = 2×3 ✓'],
        result:{ ko:'3×2 = 2×3 = 6 ✓', en:'3×2 = 2×3 = 6 ✓', zh:'3×2 = 2×3 = 6 ✓' },
        book:{ ko:'곱셈의 교환법칙: a×b = b×a. 더 쉬운 방향으로 계산할 수 있어요!', en:'Commutative law: a×b = b×a. Always pick the easier order!', zh:'乘法交换律：a×b=b×a。选更简单的顺序来计算！' } },

      { tag:{ ko:'② 2단·5단 연결', en:'2) Connecting 2s and 5s', zh:'② 连接2和5的乘法' },
        head:{ ko:'2×5와 5×2는 같아요!', en:'2×5 equals 5×2!', zh:'2×5等于5×2！' },
        desc:{ ko:'2×5=10이고 5×2=10이에요. 교환해도 같아요! 2단을 알면 5단 일부를 바로 알 수 있어요.',
               en:'2×5=10 and 5×2=10. Swap them — still equal! Knowing the 2s table gives you some 5s facts for free.',
               zh:'2×5=10，5×2=10。交换一样！知道2的乘法就能直接知道一些5的乘法。' },
        mathSteps:['2×5=10','5×2=10',{ko:'같은 배열 — 방향만 달라요!',en:'\\text{Same array — just turned around!}',zh:'同样的排列——只是方向不同！'}],
        result:{ ko:'2×5 = 5×2 = 10 ✓', en:'2×5 = 5×2 = 10 ✓', zh:'2×5 = 5×2 = 10 ✓' },
        book:null },

      { tag:{ ko:'③ 빠른 계산 전략', en:'3) Quick calculation strategy', zh:'③ 快速计算策略' },
        head:{ ko:'어려운 곱셈은 교환해서 더 쉽게!', en:'Swap to make hard multiplications easier!', zh:'交换让难题变简单！' },
        desc:{ ko:'8×5는 복잡해 보여도 5×8로 교환하면? 5+5+5+5+5+5+5+5=40! 또는 8+8+8+8+8=40. <b>더 쉬운 쪽을 골라요</b>.',
               en:'8×5 looks hard, but swap to 5×8: eight 5s or five 8s — both give 40! <b>Pick whichever is easier</b>.',
               zh:'8×5看起来难，交换成5×8：8个5加或5个8加——都等于40！<b>选更容易的方式</b>。' },
        mathSteps:['8×5 → 5×8?','8 + 8 + 8 + 8 + 8 = 40',{ko:'또는: 5+5+5+5+5+5+5+5=40',en:'\\text{or: } 5+5+5+5+5+5+5+5=40',zh:'或者：5+5+5+5+5+5+5+5=40'},'→ 5×8 = 40'],
        result:{ ko:'8×5 = 5×8 = 40 ✓', en:'8×5 = 5×8 = 40 ✓', zh:'8×5 = 5×8 = 40 ✓' },
        book:null }
    ],
    rule:{ ko:'① a×b = b×a (교환해도 같다)  ② 더 쉬운 순서를 골라 계산한다  ③ 2단과 5단은 교환법칙으로 서로 연결된다',
      en:'① a×b = b×a  ② Choose the easier order  ③ The 2s and 5s tables connect through the commutative property',
      zh:'①a×b=b×a ②选择更简单的顺序 ③2和5的乘法通过交换律相互关联' }
  },

  check:{
    fills:[
      { tex:'5 \\times 8 = \\square', answer:40,
        hint:{ ko:'8×5와 같아요! 5씩 8번 또는 8씩 5번 = 40', en:'Same as 8×5! Eight 5s or five 8s = 40', zh:'和8×5一样！8个5或5个8=40' } },
      { tex:'2 \\times 6 = \\square', answer:12,
        hint:{ ko:'6×2와 같아요! 6+6=12', en:'Same as 6×2! 6+6=12', zh:'和6×2一样！6+6=12' } }
    ],
    open:{ ko:'교환법칙을 사용하면 어떤 상황에서 계산이 더 쉬워질까요? 예를 들어볼까요?',
           en:'When does the commutative property make a calculation easier? Give an example!',
           zh:'什么情况下用交换律能让计算更简单？举个例子！' },
    openHint:{ ko:'예) 9×2는 9를 두 번 더하면 되지만, 2×9는 2를 아홉 번 더해야 해요. 9×2가 더 쉬워요!',
               en:'e.g. 9×2: add 9 twice (easier!) vs 2×9: add 2 nine times (harder). Swap!',
               zh:'例）9×2是9加两次（更简单！），而2×9要加九次2（更难）。交换！' }
  },

  lab:{
    generator:'ml2_tt25', level:'main', count:4,
    params:{ tables:[2,5] },
    intro:{ ko:'이제 2단·5단 혼합 마법 실험실! 교환법칙도 써가면서 풀어봐!',
            en:'Welcome to the 2s & 5s Mix Lab! Use the commutative trick whenever it helps!',
            zh:'欢迎来到2和5的混合魔法实验室！需要时随时用交换律！' }
  },

  arena:{
    generator:'ml2_tt25', level:'main', count:8, timeLimit:300,
    params:{ tables:[2,5] },
    rule:{ ko:'5분 안에 2단·5단 혼합 문제를 최대한 많이 풀어봐!', en:'Solve as many 2s & 5s mixed problems as you can in 5 minutes!', zh:'5分钟内尽量多做2和5的混合乘法题！' }
  },

  stamp:{ label:{ ko:'2·5단 달인', en:'2 & 5 Times Pro', zh:'2和5口诀达人' }, coins:25 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'구구단 달인! 🌟',en:'Times-table master!',zh:'口诀高手！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 2·5단 달인이야! 🔄✨', en:"Perfect! You're a 2 & 5 Times Pro now! 🔄✨", zh:'完美！你现在是2和5口诀达人啦！🔄✨' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
