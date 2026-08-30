/* ============================================================
   Numbers of Magic — 유닛 데이터: A-04
   초급 A · 챕터4 "계단식 덧셈"
   교재 실제 개념 기반(창작 재구성). generator=stairAdd.
   - 개념: 두 자리 수를 십의 자리·일의 자리로 쪼개, 십의 자리를
     먼저 더하고 일의 자리를 나중에 더해 계단처럼 오른다.
     24 + 13 = 24 + 10 + 3 = 34 + 3 = 37
   - 범위 선택 없음(항상 두 자리 수 2~3개)
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-04'] = {
  id:'A-04', tier:'beginner', level:'A', order:4,
  generator:'stairAdd',
  title:{ ko:'계단식 덧셈', en:'Staircase Addition', zh:'阶梯加法' },
  subtitle:{ ko:'십의 자리부터, 일의 자리는 나중에 — 계단처럼 오르기', en:'Tens first, ones later — climb like a staircase', zh:'先十位，后个位——像爬楼梯一样' },
  icon:'🪜',

  /* ── STEP1 프랙티스: stairAdd(practice) — "몇십 하고 얼마?" 가르기 즉답 ── */
  practice:{
    generator:'stairAdd', level:'practice', count:5,
    intro:{
      ko:'이번엔 계단 마법이야! 내가 두 자리 수를 부르면, 몇십 하고 얼마인지 나눠서 말해줘.',
      en:"Staircase magic this time! I'll say a 2-digit number — split it into tens and ones for me.",
      zh:'这次是阶梯魔法！我说一个两位数，你把它拆成几十和几来告诉我。'
    }
  },

  /* ── STEP2 디스커버: 계단식 덧셈 개념 3단 ── */
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 두 자리 수는 계단 두 칸',en:'1) A 2-digit number is two steps',zh:'① 两位数是两个台阶'},
        head:{ko:'24는 20과 4로 나뉘어요',en:'24 splits into 20 and 4',zh:'24拆成20和4'},
        desc:{ko:'두 자리 수는 언제나 <b>십의 자리와 일의 자리로 쪼갤 수 있어요</b>. 24는 20(십의 자리)과 4(일의 자리)예요.',
              en:'Any 2-digit number <b>splits into a tens part and a ones part</b>. 24 is 20 (tens) and 4 (ones).',
              zh:'两位数总能<b>拆成十位和个位</b>。24就是20（十位）和4（个位）。'},
        mathSteps:['24 = 20 + 4'],
        result:{ko:'두 자리 수 = 십의 자리 + 일의 자리!',en:'2-digit number = tens + ones!',zh:'两位数 = 十位 + 个位！'},
        book:{ko:'이렇게 쪼개면 큰 수를 더할 때 훨씬 편해져요.',en:'Splitting like this makes adding bigger numbers much easier.',zh:'这样拆开，加大数字时会方便很多。'} },

      { tag:{ko:'② 십의 자리부터 계단을 올라요',en:'2) Climb the tens step first',zh:'② 先爬十位的台阶'},
        head:{ko:'24 + 13을 풀어볼까요',en:"Let's solve 24 + 13",zh:'来解24 + 13吧'},
        desc:{ko:'13을 10과 3으로 나눠서, 먼저 10을 더하고(첫 계단), 그다음 3을 더해요(둘째 계단). <b>한 칸씩 밟아 올라가는 거예요</b>.',
              en:'Split 13 into 10 and 3. Add the 10 first (first step), then the 3 (second step) — <b>climbing one step at a time</b>.',
              zh:'把13拆成10和3。先加10（第一级台阶），再加3（第二级台阶）——<b>一级一级往上爬</b>。'},
        mathSteps:['24 + 13','24 + 10 + 3','34 + 3','37'],
        result:{ko:'24 + 13 = 37! 계단 두 칸으로 도착!',en:'24 + 13 = 37! Two steps and we\'re there!',zh:'24 + 13 = 37！两级台阶就到了！'},
        book:{ko:'십의 자리를 더할 땐 일의 자리가 0이라 계산이 쉽고, 일의 자리를 더할 땐 한 자리 수끼리라 또 쉬워요.',
              en:'Adding tens is easy since the ones digit is 0, and adding ones is easy since it\'s single digits.',
              zh:'加十位时因为个位是0所以简单，加个位时又都是一位数，也简单。'} },

      { tag:{ko:'③ 수가 늘어도 계단은 계속돼요',en:'3) More numbers, more steps',zh:'③ 数字变多，台阶继续爬'},
        head:{ko:'세 수를 더해도 똑같아요',en:'Adding three numbers works the same',zh:'加三个数也一样'},
        desc:{ko:'32+15+21처럼 수가 늘어나도, 각 수를 십의 자리와 일의 자리로 나눠 <b>순서대로 계단을 오르면 돼요</b>.',
              en:'Even with three numbers like 32+15+21, split each into tens and ones and <b>keep climbing in order</b>.',
              zh:'即使是32+15+21这样三个数，只要把每个都拆成十位和个位，<b>按顺序继续爬台阶</b>就行。'},
        mathSteps:['32 + 15 + 21','32 + 10 + 5 + 20 + 1','42 + 5 + 20 + 1','47 + 20 + 1','67 + 1','68'],
        result:{ko:'32 + 15 + 21 = 68! 계단이 길어져도 무섭지 않아요.',en:'32 + 15 + 21 = 68! Longer staircases aren\'t scary at all.',zh:'32 + 15 + 21 = 68！台阶再长也不怕。'},
        book:null }
    ],
    rule:{ ko:'① 각 수를 십의 자리와 일의 자리로 나눈다  ② 십의 자리를 먼저 순서대로 더한다  ③ 일의 자리를 나중에 순서대로 더한다',
      en:'Split each number into tens and ones → add the tens first, in order → add the ones after.',
      zh:'把每个数拆成十位和个位 → 先按顺序加十位 → 再按顺序加个位。' }
  },

  /* ── STEP3 핵심체크 ── */
  check:{
    fills:[
      { tex:'32 + 45 = \\square', answer:77,
        hint:{ ko:'32+40+5로 나눠서 더해봐요.', en:'Try splitting into 32+40+5.', zh:'试试拆成32+40+5。' } },
      { tex:'24 + 13 + 21 = \\square', answer:58,
        hint:{ ko:'십의 자리(10+20)를 먼저, 일의 자리(3+1)를 나중에 더해봐요.', en:'Add the tens (10+20) first, then the ones (3+1).', zh:'先加十位(10+20)，再加个位(3+1)。' } }
    ],
    open:{
      ko:'만약 두 자리 수가 아니라 세 자리 수를 더한다면, 계단식 덧셈을 어떻게 나눠서 써야 할까요?',
      en:'If you were adding 3-digit numbers instead of 2-digit ones, how would you split the staircase steps?',
      zh:'如果要加的不是两位数而是三位数，阶梯加法应该怎么拆分台阶呢？'
    },
    openHint:{
      ko:'백의 자리, 십의 자리, 일의 자리 이렇게 세 칸으로 나누면 돼요. 계단이 한 칸 더 늘어날 뿐, 방법은 똑같아요.',
      en:'Split into hundreds, tens, and ones — three steps instead of two. Just one more step, same method.',
      zh:'拆成百位、十位、个位三段就行。只是多一级台阶，方法完全一样。'
    }
  },

  /* ── STEP4 매직랩: 대화형(숫자패드) ── */
  lab:{
    generator:'stairAdd', level:'main', count:4,
    intro:{
      ko:'이제 직접 계단을 올라볼까? 문제를 보고 답을 눌러줘!',
      en:"Now let's climb the staircase ourselves — see the problem and tap the answer!",
      zh:'现在自己来爬台阶吧！看好题目，按出答案！'
    }
  },

  /* ── STEP5 아레나: 타임 배틀 ── */
  arena:{
    generator:'stairAdd', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한 많이 풀어봐요!', en:'Solve as many as you can in 5 minutes!', zh:'5分钟内尽量多解题！' }
  },

  stamp:{ label:{ ko:'계단 마법사', en:'Staircase Climber', zh:'阶梯魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'한 계단 올랐어! 🪜',en:'One step up!',zh:'爬上一级啦！'}, {ko:'멋진 등반이었어! 🪄',en:'Great climb!',zh:'爬得真棒！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'십의 자리부터 다시!',en:'Start from the tens again!',zh:'从十位重新来！'} ],
    finish:{ ko:'완벽해! 이제 넌 계단 마법사야 🪜✨', en:"Perfect! You're a Staircase Climber now!", zh:'完美！你现在是阶梯魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
