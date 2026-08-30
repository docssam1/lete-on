/* ============================================================
   Numbers of Magic — 유닛 데이터: A-11
   초급 C · 챕터3 "쉬었다 빼기"
   창의수연 초급 C 실제 교재 내용 기반. generator=restSubtract.
   핵심: 43-8 → 43-3-5 = 40-5 = 35
   "몇 십이 되도록 먼저 빼고, 쉬었다가 나머지를 빼요!"
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-11'] = {
  id:'A-11', tier:'beginner', level:'A', order:11,
  generator:'restSubtract',
  title:{ ko:'쉬었다 빼기', en:'Rest, Then Subtract', zh:'歇一下再减' },
  subtitle:{ ko:'몇 십까지 먼저 빼고, 잠깐 쉬었다 나머지를 빼요', en:'Subtract to a ten first, then rest and subtract the rest', zh:'先减到整十，歇一下再减剩下的' },
  icon:'🛌',

  practice:{
    generator:'restSubtract', level:'practice', count:5,
    intro:{
      ko:'준비 운동! 다음 몇십이 되려면 얼마를 빼야 하는지 맞혀봐.',
      en:"Warm up! Figure out how much to subtract to reach the ten below.",
      zh:'热热身！算算要减多少才能到整十。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 몇 십까지만 먼저 빼요', en:'1) Subtract just enough to reach a ten', zh:'① 先减到整十' },
        head:{ ko:'한 번에 다 빼지 않고, 나눠서 빼요', en:'Don\'t subtract it all at once — split it up', zh:'不要一次减完，分开来减' },
        desc:{ ko:'43-8처럼 받아내림이 생기는 뺄셈은, 먼저 40이 되도록 3만 빼고, 남은 5는 잠깐 쉬었다가 마저 빼요.',
               en:'For subtraction like 43-8 that needs borrowing, first subtract just 3 to reach 40, rest a moment, then subtract the remaining 5.',
               zh:'像43-8这样需要退位的减法，先减3变成40，歇一下，再减剩下的5。' },
        mathSteps:['43 - 8',{ko:'= 43 - 3 - 5  ← 40까지만 먼저!',en:'= 43 - 3 - 5 ← \\text{down to 40 first!}',zh:'= 43 - 3 - 5 ← 先减到40！'},'= 40 - 5','= 35'],
        result:{ ko:'8을 3과 5로 나눠서, 3을 먼저 빼고 40을 만든 다음 5를 빼요!', en:'Split 8 into 3 and 5 — subtract 3 first to make 40, then subtract 5!', zh:'把8分成3和5，先减3变成40，再减5！' },
        book:{ ko:'43의 일의 자리는 3이에요. 그래서 8을 3(먼저 뺄 것)과 5(나중에 뺄 것)로 나눠요. 3+5=8이 맞는지 항상 확인해요.',
               en:'The ones digit of 43 is 3. So we split 8 into 3 (subtract first) and 5 (subtract later). Always check 3+5=8.',
               zh:'43的个位是3，所以把8分成3(先减)和5(后减)。记得检查3+5=8。' } },

      { tag:{ ko:'② 세 자리 수도 똑같아요', en:'2) Works for 3-digit numbers too', zh:'② 三位数也一样' },
        head:{ ko:'몇 백, 몇 천이 되도록 쉬었다 빼기', en:'Rest at hundreds or thousands too', zh:'到整百、整千也能歇一下' },
        desc:{ ko:'큰 수여도 방법은 같아요. 가까운 몇 백(또는 몇 십)이 되도록 먼저 조금 빼고, 나머지를 마저 빼요.',
               en:'Even with bigger numbers, the method is the same: subtract just enough to reach the nearest hundred (or ten), then subtract the rest.',
               zh:'数再大，方法也一样：先减到最近的整百（或整十），再减剩下的。' },
        mathSteps:['451 - 7','= 451 - 1 - 6','= 450 - 6','= 444'],
        result:{ ko:'451-7 = 451-1-6 = 450-6 = 444', en:'451-7 = 451-1-6 = 450-6 = 444', zh:'451-7 = 451-1-6 = 450-6 = 444' },
        book:{ ko:'842-79처럼 빼는 수가 두 자리여도 괜찮아요. 842-42=800을 먼저 만들고, 남은 37을 빼면 763이에요.',
               en:'Even a two-digit subtrahend like in 842-79 works: subtract 42 first to make 800, then subtract the remaining 37 to get 763.',
               zh:'像842-79这样减数是两位数也可以：先减42变成800，再减剩下的37，得763。' } },

      { tag:{ ko:'③ 언제 쓰면 좋을까요?', en:'3) When is this handy?', zh:'③ 什么时候好用？' },
        head:{ ko:'받아내림이 생길 때 특히 편해요', en:'Especially handy when borrowing is needed', zh:'需要退位的时候特别好用' },
        desc:{ ko:'앞 수의 일의 자리보다 빼는 수가 더 클 때(예: 43-8) 이 방법이 좋아요. 이미 받아내림 없이 뺄 수 있는 경우(예: 48-12)엔 그냥 빼도 충분해요.',
               en:'This works great when the number you\'re subtracting is bigger than the ones digit (like 43-8). If no borrowing is needed (like 48-12), just subtract directly.',
               zh:'当减数比个位数大时（如43-8），这个方法很好用。不需要退位的（如48-12）直接减就行。' },
        mathSteps:['72 - 15','= 72 - 2 - 13','= 70 - 13','= 57'],
        result:{ ko:'72-15 = 72-2-13 = 70-13 = 57', en:'72-15 = 72-2-13 = 70-13 = 57', zh:'72-15 = 72-2-13 = 70-13 = 57' },
        book:null }
    ],
    rule:{ ko:'① 몇 십(백)이 되도록 필요한 만큼만 먼저 뺀다  ② 잠깐 쉰다  ③ 남은 만큼 마저 뺀다',
      en:'① Subtract just enough to reach a round ten (hundred)  ② Rest a moment  ③ Subtract the rest',
      zh:'①先减到整十(百)所需的量 ②歇一下 ③再减剩下的量' }
  },

  check:{
    fills:[
      { tex:'43 - 8 = 43 - 3 - \\square', answer:5,
        hint:{ ko:'8을 3과 무엇으로 나눠야 3+?=8이 될까?', en:'Split 8 into 3 and what, so that 3+?=8?', zh:'把8分成3和什么，使3+?=8？' } },
      { tex:'842 - 79 = 800 - \\square', answer:37,
        hint:{ ko:'842에서 42를 먼저 빼면 800. 79에서 42를 빼면 남는 건?', en:'842 minus 42 is 800. What\'s left of 79 after subtracting 42?', zh:'842先减42得800，79减去42还剩多少？' } }
    ],
    open:{
      ko:'쉬었다 빼기가 좋은 경우와 그냥 바로 빼는 게 더 좋은 경우를 각각 예를 들어 설명해봐요.',
      en:'Give an example of when "rest, then subtract" helps, and an example of when direct subtraction is simpler.',
      zh:'举例说说什么时候"歇一下再减"有用，什么时候直接减更简单。'
    },
    openHint:{
      ko:'예) 43-8처럼 일의 자리끼리 뺄 수 없을 때(3<8) 도움이 돼요. 48-12처럼 일의 자리끼리 바로 뺄 수 있을 때(8>2)는 그냥 빼는 게 더 빨라요.',
      en:'e.g. It helps when the ones digits can\'t subtract directly (43-8, since 3<8). When they can (48-12, since 8>2), direct subtraction is faster.',
      zh:'例）像43-8这样个位不能直接减时（3<8）有用。像48-12这样个位能直接减时（8>2），直接减更快。'
    }
  },

  lab:{
    generator:'restSubtract', level:'main', count:4,
    intro:{
      ko:'이제 진짜 마법! 몇 십까지 먼저 빼고, 쉬었다가 나머지를 빼봐요.',
      en:'Real magic time! Subtract to a ten first, rest, then finish the rest.',
      zh:'真正的魔法时刻！先减到整十，歇一下再减完。'
    }
  },

  arena:{
    generator:'restSubtract', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한 많이! 몇 십까지 먼저 빼요!', en:'As many as you can in 5 minutes — subtract to a ten first!', zh:'5分钟内尽量多做！先减到整十！' }
  },

  stamp:{ label:{ ko:'쉬었다 빼기 달인', en:'Rest-Subtract Master', zh:'歇一下减法达人' }, coins:20 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'딱 맞게 쉬었네! 🛌',en:'Perfect rest!',zh:'歇得刚刚好！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 몇 십이 되도록 얼마를 뺄지 먼저 생각해봐!',en:'Hmm — first think how much to reach a ten!',zh:'嗯，先想想减多少能到整十！'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 쉬었다 빼기 달인이야 🛌✨', en:"Perfect! You're a Rest-Subtract Master now!", zh:'完美！你现在是歇一下减法达人啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
