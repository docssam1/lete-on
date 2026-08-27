/* ============================================================
   Numbers of Magic — 유닛 데이터: A-03
   초급 A · 챕터3 "우선 10을 더하기"
   교재 실제 개념 기반(창작 재구성). generator=add10sub.
   - 개념: 9(또는 8, 7)를 더할 때는 우선 10을 더하고,
     더 준 만큼 다시 빼준다. 25 + 9 = 25 + 10 - 1 = 35 - 1 = 34
   - 범위 선택 없음(항상 두 자리 + 7~9)
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-03'] = {
  id:'A-03', tier:'beginner', level:'A', order:3,
  lineage:['nine-next-door'],
  generator:'add10sub',
  title:{ ko:'우선 10을 더하기', en:'Add Ten First', zh:'先加10再说' },
  subtitle:{ ko:'10에 가까운 수는 우선 10을 주고, 더 준 만큼 돌려받기', en:'Give 10 first, then take back what you overgave', zh:'先给10，多给的再拿回来' },
  icon:'🎁',

  /* ── STEP1 프랙티스: add10sub(practice) — "10보다 얼마 작아?" 즉답 ── */
  practice:{
    generator:'add10sub', level:'practice', count:5,
    intro:{
      ko:'이번 마법은 선물이야! 내가 수를 하나 부르면, 10보다 얼마나 작은지 말해줘.',
      en:"This magic is a gift trick! I'll say a number — tell me how much smaller it is than 10.",
      zh:'这次的魔法是礼物哦！我说一个数，你告诉我它比10小多少。'
    }
  },

  /* ── STEP2 디스커버: 우선 10을 더하고 빼는 개념 3단 ── */
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 9는 10에서 살짝 모자라요',en:'1) 9 is just short of 10',zh:'① 9只比10少一点'},
        head:{ko:'9 + 얼마 = 10?',en:'9 + how much = 10?',zh:'9加多少等于10？'},
        desc:{ko:'9는 10보다 딱 1이 작아요. 그래서 9를 더할 땐 우선 10을 통째로 주고, 나중에 1을 돌려받으면 돼요.',
              en:'9 is exactly 1 short of 10. So when adding 9, give a full 10 first, then take 1 back later.',
              zh:'9正好比10少1。所以加9的时候，先整个给10，之后再要回1就行。'},
        mathSteps:['9 = 10 - 1'],
        result:{ko:'9를 더하는 건 곧 "10을 더하고 1을 빼는 것"과 같아요!',en:'Adding 9 is the same as "add 10, subtract 1"!',zh:'加9其实就等于"加10再减1"！'},
        book:{ko:'8은 10보다 2 작고, 7은 10보다 3 작아요. 같은 방법을 쓸 수 있어요.',
              en:'8 is 2 short of 10, 7 is 3 short. The same trick works for both.',
              zh:'8比10少2，7比10少3，同样的方法都能用。'} },

      { tag:{ko:'② 우선 10을 다 주고 봐요',en:'2) Give the full 10 first',zh:'② 先给足10'},
        head:{ko:'25 + 9를 풀어볼까요',en:"Let's solve 25 + 9",zh:'来解25 + 9吧'},
        desc:{ko:'25에 9를 그냥 더하면 헷갈리기 쉬워요. 대신 25에 10을 먼저 주고, 1을 더 준 걸 알아채고 돌려받아요.',
              en:'Adding 9 to 25 directly is easy to mess up. Instead, give 25 a full 10 first, then notice we overgave 1 and take it back.',
              zh:'直接给25加9容易出错。不如先给25加满10，再发现多给了1，把它拿回来。'},
        mathSteps:['25 + 9','25 + 10 - 1','35 - 1','34'],
        result:{ko:'25 + 9 = 34! 받아올림 걱정 없이 끝!',en:'25 + 9 = 34! No carrying to worry about!',zh:'25 + 9 = 34！完全不用担心进位！'},
        book:{ko:'딱 떨어지는 10을 먼저 만들면, 나머지는 간단한 한 자리 뺄셈이 됩니다.',
              en:'Make a clean 10 first — the rest becomes simple one-digit subtraction.',
              zh:'先凑出整整齐齐的10，剩下的就只是简单的一位数减法了。'} },

      { tag:{ko:'③ 8이나 7을 더할 때도 똑같아요',en:'3) Works for 8 and 7 too',zh:'③ 加8或7也一样'},
        head:{ko:'47 + 8도 같은 방법으로',en:'47 + 8, the same way',zh:'47 + 8也用同样的方法'},
        desc:{ko:'8은 10보다 2가 작으니, 10을 주고 2를 돌려받으면 돼요. 어떤 수를 더하든 "10을 주고 남는 걸 빼기"는 똑같아요.',
              en:'8 is 2 short of 10, so give 10 and take back 2. No matter the number, "give 10 then subtract the extra" always works.',
              zh:'8比10少2，所以给10再拿回2。不管加几，"先给10再减多给的"都一样管用。'},
        mathSteps:['47 + 8','47 + 10 - 2','57 - 2','55'],
        result:{ko:'47 + 8 = 55! 언제나 같은 마법!',en:'47 + 8 = 55! Always the same magic!',zh:'47 + 8 = 55！永远是同一个魔法！'},
        book:null }
    ],
    rule:{ ko:'① 더하는 수가 10보다 얼마나 작은지 본다  ② 우선 10을 통째로 더한다  ③ 더 준 만큼 다시 뺀다',
      en:'See how far the number is from 10 → add a full 10 → subtract back the extra.',
      zh:'看加的数比10少多少 → 先整整加10 → 再把多给的减回去。' }
  },

  /* ── STEP3 핵심체크 ── */
  check:{
    fills:[
      { tex:'34 + 9 = \\square', answer:43,
        hint:{ ko:'9는 10보다 1 작아요. 34+10-1로 풀어봐요.', en:'9 is 1 short of 10. Try 34+10-1.', zh:'9比10少1。试试34+10-1。' } },
      { tex:'56 + 8 = \\square', answer:64,
        hint:{ ko:'8은 10보다 2 작아요. 56+10-2로 풀어봐요.', en:'8 is 2 short of 10. Try 56+10-2.', zh:'8比10少2。试试56+10-2。' } }
    ],
    open:{
      ko:'만약 9가 아니라 6을 더한다면, "우선 10을 더하기" 방법을 그대로 써도 편할까요? 왜 그런지 생각해 보아요.',
      en:'If you were adding 6 instead of 9, would "add 10 first" still be the easiest way? Think about why or why not.',
      zh:'如果加的不是9而是6，"先加10"这个方法还方便吗？想想为什么。'
    },
    openHint:{
      ko:'6은 10보다 4나 작아서, 10을 주고 4를 돌려받는 게 오히려 번거로울 수 있어요. 6처럼 작은 수는 그냥 더하거나 다른 방법이 더 쉬울 때도 있어요.',
      en:'6 is 4 short of 10, so giving 10 and taking back 4 can feel like more work. For smaller numbers like 6, adding directly (or another trick) may be easier.',
      zh:'6比10少4，先给10再拿回4反而可能更麻烦。像6这样小的数，直接加或者用别的方法有时更简单。'
    }
  },

  /* ── STEP4 매직랩: 대화형(숫자패드) ── */
  lab:{
    generator:'add10sub', level:'main', count:4,
    intro:{
      ko:'이제 직접 10을 먼저 줘볼까? 문제를 보고 답을 눌러줘!',
      en:"Now let's give the 10 first ourselves — see the problem and tap the answer!",
      zh:'现在自己先给10试试！看好题目，按出答案！'
    }
  },

  /* ── STEP5 아레나: 타임 배틀 ── */
  arena:{
    generator:'add10sub', level:'main', count:8, timeLimit:240,
    rule:{ ko:'4분 안에 최대한 많이 풀어봐요!', en:'Solve as many as you can in 4 minutes!', zh:'4分钟内尽量多解题！' }
  },

  stamp:{ label:{ ko:'선물 마법사', en:'Gift-Giver', zh:'送礼魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'선물 완료! 🎁',en:'Gift delivered!',zh:'礼物送到啦！'}, {ko:'깔끔했어! 🪄',en:'So clean!',zh:'干净利落！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'10을 먼저 줘볼까?',en:'Try giving 10 first?',zh:'试试先给10？'} ],
    finish:{ ko:'완벽해! 이제 넌 선물 마법사야 🎁✨', en:"Perfect! You're a Gift-Giver now!", zh:'完美！你现在是送礼魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
