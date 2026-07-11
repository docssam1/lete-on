/* ============================================================
   Numbers of Magic — 유닛 데이터: A-02
   초급 A · 챕터2 "수를 이사시켜요"
   교재 실제 개념 기반(창작 재구성). generator=move10.
   - 개념: 한 수의 일부를 다른 수로 "이사"시켜 10을 만든 뒤 더한다.
     8 + 7 = 8 + (2+5) = 10 + 5 = 15
   - 범위 선택 없음(항상 받아올림 있는 한 자리+한 자리)
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-02'] = {
  id:'A-02', tier:'beginner', level:'A', order:2,
  generator:'move10',
  title:{ ko:'수를 이사시켜요', en:'Move the Numbers', zh:'把数字搬过去' },
  subtitle:{ ko:'부족한 만큼 이웃 수에서 빌려와 10을 만들기', en:'Borrow just enough from the other number to make 10', zh:'从旁边的数借一点凑成10' },
  icon:'🚚',

  /* ── STEP1 프랙티스: move10(practice) — "10이 되려면 얼마?" 즉답 ── */
  practice:{
    generator:'move10', level:'practice', count:5,
    intro:{
      ko:'이번엔 다른 마법이야! 내가 수를 하나 부르면, 그 수가 10이 되려면 얼마가 더 필요한지 말해줘.',
      en:"Different magic this time! I'll say a number — tell me how much more it needs to reach 10.",
      zh:'这次是不一样的魔法！我说一个数，你告诉我它要变成10还差多少。'
    }
  },

  /* ── STEP2 디스커버: 수를 이사시키는 개념 3단(mathSteps로 순서대로 전개) ── */
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 수는 나뉘어 있어요',en:'1) Numbers are made of parts',zh:'① 数字是拼出来的'},
        head:{ko:'7은 그냥 7이 아니에요',en:'7 isn\'t just 7',zh:'7不只是7'},
        desc:{ko:'7은 1과 6, 또는 2와 5, 또는 3과 4가 모인 것이기도 해요. 어떻게 나누느냐가 마법의 열쇠예요.',
              en:'7 is also 1+6, or 2+5, or 3+4. How you split it is the key to the magic.',
              zh:'7也可以是1+6，或者2+5，或者3+4。怎么拆开，就是魔法的关键。'},
        mathSteps:['7 = 1 + 6','7 = 2 + 5','7 = 3 + 4'],
        result:{ko:'하나의 수 안에 여러 짝이 숨어 있어요!',en:'One number hides many pairs inside!',zh:'一个数字里藏着好几种拆法！'},
        book:{ko:'큰 수를 더할 때 부족한 만큼만 골라 쓰면 됩니다.',en:'When adding, just pick the piece you need.',zh:'加法时，只挑出需要的那一小块就好。'} },

      { tag:{ko:'② 부족한 만큼 이사시켜요',en:'2) Move just enough',zh:'② 搬过去刚好的量'},
        head:{ko:'큰 수를 먼저 10으로 만들어요',en:'Make the bigger number 10 first',zh:'先把大一点的数凑成10'},
        desc:{ko:'8은 10이 되려면 2가 더 필요해요. 그래서 7에서 2만 이사 오면, 8은 10이 되고 7은 5만 남아요.',
              en:'8 needs 2 more to become 10. So we move 2 from the 7 — now 8 becomes 10, and 7 has 5 left.',
              zh:'8要变成10还差2。所以从7那里搬2过来——8变成10，7剩下5。'},
        mathSteps:['8 + 7','8 + 2 + 5','10 + 5','15'],
        result:{ko:'8 + 7 = 15! 이사 한 번으로 끝!',en:'8 + 7 = 15! One move and done!',zh:'8 + 7 = 15！搬一次就搞定！'},
        book:{ko:'두 수 중 10에 더 가까운 수를 먼저 채우면 계산이 훨씬 쉬워집니다.',
              en:'Fill whichever number is closer to 10 first — it makes the math much easier.',
              zh:'先把离10更近的那个数填满，计算会简单很多。'} },

      { tag:{ko:'③ 어떤 수를 옮겨도 답은 같아요',en:'3) Either direction works',zh:'③ 从哪边搬都一样'},
        head:{ko:'반대로 옮겨도 똑같아요',en:'Moving the other way works too',zh:'反过来搬也可以'},
        desc:{ko:'9는 10이 되려면 1이 필요해요. 6에서 1만 이사 오면 9는 10, 6은 5가 남아요. 어느 쪽에서 옮기든 결과는 같아요.',
              en:'9 needs 1 more to become 10. Move 1 from the 6 — 9 becomes 10, 6 has 5 left. Either direction gives the same answer.',
              zh:'9要变10还差1。从6那里搬1过来——9变10，6剩5。不管从哪边搬，结果都一样。'},
        mathSteps:['9 + 6','9 + 1 + 5','10 + 5','15'],
        result:{ko:'9 + 6 = 15! 8+7과 답이 똑같죠?',en:'9 + 6 = 15! Same answer as 8+7, right?',zh:'9 + 6 = 15！和8+7的答案一样吧？'},
        book:null }
    ],
    rule:{ ko:'① 두 수 중 10에 더 가까운 수를 찾는다  ② 다른 수에서 부족한 만큼만 이사시킨다  ③ 10 + 남은 수로 계산한다',
      en:'Find the number closer to 10 → move just enough from the other number → add 10 + what\'s left.',
      zh:'找出更接近10的数 → 从另一个数里搬来刚好够的量 → 用10+剩下的数计算。' }
  },

  /* ── STEP3 핵심체크 ── */
  check:{
    fills:[
      { tex:'8 + 7 = \\square', answer:15,
        hint:{ ko:'8은 2만 더 있으면 10! 7에서 2를 이사시켜요.', en:'8 needs 2 more. Move 2 from the 7.', zh:'8只差2就到10！从7那里搬2过来。' } },
      { tex:'9 + 6 = \\square', answer:15,
        hint:{ ko:'9는 1만 더 있으면 10! 6에서 1을 이사시켜요.', en:'9 needs 1 more. Move 1 from the 6.', zh:'9只差1就到10！从6那里搬1过来。' } }
    ],
    open:{
      ko:'8+7을 풀 때 7에서 8로 옮기지 않고, 8에서 7로 옮겨도 될까요? 한번 계산해 보고 왜 그런지 생각해 보아요.',
      en:'When solving 8+7, could you move from the 8 to the 7 instead? Try it and think about why it works (or not).',
      zh:'解8+7时，如果不是从7搬到8，而是从8搬到7，可以吗？试着算算看，想想为什么。'
    },
    openHint:{
      ko:'8에서 2를 옮기면 6이 남고, 7은 9가 돼요. 6+9=15로 답은 같아요! 다만 8을 10으로 만드는 쪽이 계산이 더 깔끔해요.',
      en:'Moving 2 from the 8 leaves 6, and the 7 becomes 9. 6+9=15 — same answer! But making the 8 into 10 keeps the numbers cleaner.',
      zh:'从8搬2过去，8剩6，7变9。6+9=15，答案一样！不过把8凑成10，数字会更清爽。'
    }
  },

  /* ── STEP4 매직랩: 대화형(숫자패드) ── */
  lab:{
    generator:'move10', level:'main', count:4,
    intro:{
      ko:'이제 직접 이사시켜 볼까? 두 수를 보고 답을 눌러줘!',
      en:"Now let's move some numbers ourselves — see the two numbers and tap the answer!",
      zh:'现在自己来搬数字吧！看好两个数，按出答案！'
    }
  },

  /* ── STEP5 아레나: 타임 배틀 ── */
  arena:{
    generator:'move10', level:'main', count:8, timeLimit:240,
    rule:{ ko:'4분 안에 최대한 많이 풀어봐요!', en:'Solve as many as you can in 4 minutes!', zh:'4分钟内尽量多解题！' }
  },

  stamp:{ label:{ ko:'수 이사 마법사', en:'Number Mover', zh:'搬数字魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'이사 성공! 🚚',en:'Move complete!',zh:'搬家成功！'}, {ko:'멋진 이사였어! 🪄',en:'Nice move!',zh:'搬得漂亮！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'조금만 더 생각해보자!',en:'Think a little more!',zh:'再想想看！'} ],
    finish:{ ko:'완벽해! 이제 넌 수 이사 마법사야 🚚✨', en:"Perfect! You're a Number Mover now!", zh:'完美！你现在是搬数字魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
