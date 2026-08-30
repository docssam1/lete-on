/* Numbers of Magic — 유닛 B-04: 2단 곱셈구구 (중급 B 챕터4) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-04'] = {
  id:'B-04', tier:'intermediate', level:'B', order:4,
  generator:'ml2_tt25',
  title:{ ko:'2단 곱셈구구', en:'Times Table: 2', zh:'乘法口诀：2的乘法' },
  subtitle:{ ko:'2×1부터 2×9까지 — 두 배 패턴!', en:'2×1 to 2×9 — the doubling pattern!', zh:'2×1到2×9 — 翻倍的规律！' },
  icon:'2️⃣',

  practice:{
    generator:'ml2_tt25', level:'practice', count:5,
    params:{ tables:[2] },
    intro:{
      ko:'자, 2단 곱셈구구를 연습해 볼까! 2×□를 말할게, 바로 답을 눌러줘. 준비됐지?',
      en:"Let's practice the 2s table! I'll give you a 2× problem — tap the answer fast. Ready?",
      zh:'来练习2的乘法口诀！我出2×□，你快速按出答案。准备好了吗？'
    }
  },

  discover:{
    story:{
      hook:{ ko:'곱하기 기호 ×는 누가 만들었을까요?',
        en:'Who invented the multiplication sign ×?',
        zh:'乘号×是谁发明的？' },
      history:{ ko:'1631년 영국의 오트레드가 처음 썼어요. 그런데 왜 하필 이 모양인지는 아직도 아무도 모릅니다. 수학에도 이렇게 이유가 밝혀지지 않은 것들이 있어요. 2단은 그 알 수 없는 기호로 우리가 처음 만나는 곱셈이랍니다.',
        en:'William Oughtred first used it in 1631 — and to this day nobody knows why he chose that shape. Even mathematics has corners where the reason was simply lost. The 2 times table is where we first meet that mysterious little cross.',
        zh:'1631年英国人奥特雷德第一次使用它——可直到今天也没人知道他为什么选这个形状。数学里也有这样说不清来由的角落。2的乘法口诀，就是我们第一次遇见这个神秘小叉的地方。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 2단 = 두 배!', en:'1) ×2 = double!', zh:'① 乘2=加倍！' },
        head:{ ko:'2를 곱하면 항상 두 배가 돼요', en:'Multiplying by 2 always doubles the number', zh:'乘以2就是把数翻倍' },
        desc:{ ko:'2단은 2씩 늘어나요. 2×1=2, 2×2=4, ..., 2×9=18. 항상 2씩 커지는 패턴이에요!',
               en:'The 2s table grows by 2 each time: 2, 4, 6, 8 … up to 18.',
               zh:'2的乘法每次增加2：2, 4, 6, 8……一直到18。' },
        mathSteps:['2×1=2','2×2=4 (+2)','2×3=6 (+2)','...','2×9=18'],
        result:{ ko:'2×9=18까지 모두 2씩 늘어났어요!', en:'All the way to 2×9=18 — each step adds 2!', zh:'一直到2×9=18，每步加2！' },
        book:{ ko:'2단은 두 배 패턴이에요. 2×□ = □+□로 생각하면 쉬워요!', en:'×2 means double: think 2×□ = □+□', zh:'乘以2就是翻倍：2×□=□+□' } },

      { tag:{ ko:'② 두 배 배열로 보면', en:'2) Arrays show doubling', zh:'② 用阵列看翻倍' },
        head:{ ko:'2×6은 6개짜리 줄이 2줄이에요', en:'2×6 is 2 rows of 6', zh:'2×6是两行6个' },
        desc:{ ko:'2×6을 배열로 그리면 6개씩 2줄이에요. 6+6=12! 배열이 두 배를 눈으로 보여줘요.',
               en:'Draw 2×6 as an array: 2 rows of 6, so 6+6=12!',
               zh:'把2×6画成阵列：2行6个，所以6+6=12！' },
        mathSteps:['2×6 = 6+6','= 12',{ko:'배열: ●●●●●●  ×2줄',en:'\\text{array: } ●●●●●● ×\\text{2 rows}',zh:'排列:●●●●●● ×2行'}],
        result:{ ko:'2×6 = 6+6 = 12 ✓', en:'2×6 = 6+6 = 12 ✓', zh:'2×6 = 6+6 = 12 ✓' },
        book:null },

      { tag:{ ko:'③ 짝수 패턴!', en:'3) Even number pattern!', zh:'③ 偶数规律！' },
        head:{ ko:'2단의 결과는 모두 짝수예요', en:'All 2s-table results are even numbers', zh:'2的乘法结果全是偶数' },
        desc:{ ko:'2, 4, 6, 8, 10, 12, 14, 16, 18 — 모두 짝수(2의 배수)예요! 2단이면 결과가 반드시 짝수예요.',
               en:'2, 4, 6, 8, 10, 12, 14, 16, 18 — all even! Every 2s-table result is always even.',
               zh:'2, 4, 6, 8, 10, 12, 14, 16, 18——全是偶数！2的乘法结果一定是偶数。' },
        mathSteps:['2, 4, 6, 8, 10','12, 14, 16, 18',{ko:'모두 2의 배수!',en:'\\text{all multiples of 2!}',zh:'都是2的倍数！'}],
        result:{ ko:'2단 결과: 2, 4, 6, 8, 10, 12, 14, 16, 18 — 모두 짝수! ✓', en:'2s table: 2,4,6,8,10,12,14,16,18 — all even! ✓', zh:'2的乘法：2,4,6,8,10,12,14,16,18——全是偶数！✓' },
        book:null }
    ],
    rule:{ ko:'① 2를 곱하면 두 배  ② 2단 결과는 항상 2씩 증가  ③ 2단 결과는 모두 짝수',
      en:'① ×2 = double  ② 2s table grows by 2 each step  ③ All results are even numbers',
      zh:'①乘2等于翻倍 ②2的乘法每步加2 ③结果全是偶数' }
  },

  check:{
    fills:[
      { tex:'2 \\times 7 = \\square', answer:14,
        hint:{ ko:'7+7=14! 7을 두 번 더해봐요.', en:'7+7=14! Add 7 twice.', zh:'7+7=14！把7加两次。' } },
      { tex:'2 \\times 9 = \\square', answer:18,
        hint:{ ko:'9+9=18! 9를 두 번 더해봐요.', en:'9+9=18! Add 9 twice.', zh:'9+9=18！把9加两次。' } }
    ],
    open:{ ko:'2단의 결과가 모두 짝수인 이유를 나만의 말로 설명해볼까요?',
           en:'Can you explain in your own words why all 2s-table results are even numbers?',
           zh:'你能用自己的话解释为什么2的乘法结果全是偶数吗？' },
    openHint:{ ko:'예) 2를 계속 더하면 항상 짝수! 짝수+짝수=짝수이고, 2는 짝수이기 때문이에요.',
               en:'e.g. Adding 2 each time stays even — because even + even = even, and 2 itself is even!',
               zh:'例）每次加2都是偶数！因为偶数+偶数=偶数，而2本身是偶数！' }
  },

  lab:{
    generator:'ml2_tt25', level:'main', count:4,
    params:{ tables:[2] },
    intro:{ ko:'이제 2단 마법 실험실! 두 배 마법으로 문제를 풀어봐!',
            en:'Welcome to the 2s Magic Lab! Use the doubling power to solve these!',
            zh:'欢迎来到2的魔法实验室！用翻倍魔法解题！' }
  },

  arena:{
    generator:'ml2_tt25', level:'main', count:8, timeLimit:300,
    params:{ tables:[2] },
    rule:{ ko:'5분 안에 2단 문제를 최대한 많이 풀어봐!', en:'Solve as many 2s-table problems as you can in 5 minutes!', zh:'5分钟内尽量多做2的乘法题！' }
  },

  stamp:{ label:{ ko:'2단 마스터', en:'Two-Times Master', zh:'2的口诀达人' }, coins:25 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'구구단 달인! 🌟',en:'Times-table master!',zh:'口诀高手！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 2단 마스터야! 2️⃣✨', en:"Perfect! You're a Two-Times Master now! 2️⃣✨", zh:'完美！你现在是2的口诀达人啦！2️⃣✨' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
