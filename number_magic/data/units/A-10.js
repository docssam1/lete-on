/* ============================================================
   Numbers of Magic — 유닛 데이터: A-10
   초급 C · 챕터2 "단위별 따로따로 빼기"
   창의수연 초급 C 실제 교재 내용 기반. generator=subByPlace.
   핵심: 80 - 47 → 80-40=40 → 40-7=33
   "십의 자리를 먼저 빼고, 일의 자리를 나중에 빼요!"
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-10'] = {
  id:'A-10', tier:'beginner', level:'A', order:10,
  generator:'subByPlace',
  title:{ ko:'단위별 따로따로 빼기', en:'Subtract Place by Place', zh:'按位分别相减' },
  subtitle:{ ko:'십의 자리 먼저, 일의 자리는 나중에', en:'Tens first, then ones', zh:'先十位，再个位' },
  icon:'✂️',

  practice:{
    generator:'subByPlace', level:'practice', count:5,
    intro:{
      ko:'준비 운동! 몇십을 먼저 빼는 연습을 해볼까?',
      en:"Warm up! Let's practice subtracting a round ten first.",
      zh:'热热身！先练习减去整十数。'
    }
  },

  discover:{
    story:{
      hook:{ ko:'빼기 기호 −는 어떻게 생겼을까요?',
        en:'Where did the minus sign come from?',
        zh:'减号−是怎么来的？' },
      history:{ ko:'모자란다는 뜻의 라틴어 minus를 짧게 −m이라고 적던 시절이 있었어요. 여기서 m마저 빼고 작대기만 남은 게 지금의 −라고 전해집니다. 1489년 독일 책에 처음 나왔죠. 빼기 기호 자체가 빼기로 만들어진 셈이에요.',
        en:'Scribes once shortened the Latin minus, meaning less, to −m. The story goes that even the m was dropped, leaving just the stroke we use today; it first appears in a German book in 1489. The minus sign was itself made by subtracting.',
        zh:'拉丁语minus意思是不足，从前被简写成−m。据说后来连m也去掉了，只剩下一道横杠，就是今天的−；它最早出现在1489年的一本德文书里。减号本身就是减出来的。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 수를 둘로 나눠요', en:'1) Split the number in two', zh:'① 把数字分成两半' },
        head:{ ko:'두 자리 수는 십의 자리와 일의 자리로 나눌 수 있어요', en:'A two-digit number splits into tens and ones', zh:'两位数可以分成十位和个位' },
        desc:{ ko:'80-47처럼 두 자리 수를 뺄 땐, 빼는 수(47)를 십의 자리(40)와 일의 자리(7)로 나눠서 순서대로 빼면 훨씬 쉬워요.',
               en:'When subtracting like 80-47, split the number you\'re subtracting (47) into tens (40) and ones (7), then subtract each in turn.',
               zh:'像80-47这样的减法，把要减的数(47)分成十位(40)和个位(7)，依次相减就容易多了。' },
        mathSteps:['80 - 47','= 80 - 40 - 7  ← 십의 자리 먼저!','= 40 - 7','= 33'],
        result:{ ko:'십의 자리를 먼저 빼면 계산이 훨씬 간단해져요!', en:'Subtracting the tens first makes it much simpler!', zh:'先减十位，计算就简单多了！' },
        book:{ ko:'80-47: 80에서 40(4×10)을 먼저 빼서 40을 만들고, 남은 7을 빼면 33이 돼요.',
               en:'80-47: subtract 40 (4 tens) from 80 to get 40, then subtract the remaining 7 to get 33.',
               zh:'80-47：先从80减去40（4个十），得到40，再减去剩下的7，得到33。' } },

      { tag:{ ko:'② 어떤 자리를 먼저 빼도 괜찮아요', en:'2) Either order works', zh:'② 先减哪一位都可以' },
        head:{ ko:'순서를 바꿔도 결과는 같아요', en:'The order doesn\'t change the result', zh:'顺序不同，结果一样' },
        desc:{ ko:'십의 자리를 먼저 빼든, 일의 자리를 먼저 빼든 답은 똑같아요. 다만 십의 자리부터 빼는 게 더 편할 때가 많아요.',
               en:'Whether you subtract tens or ones first, the answer is the same — but starting with tens is usually easier.',
               zh:'不管先减十位还是先减个位，答案都一样，但先减十位通常更方便。' },
        mathSteps:['63 - 39','= 63 - 30 - 9','= 33 - 9','= 24'],
        result:{ ko:'63-39 = 63-30-9 = 33-9 = 24', en:'63-39 = 63-30-9 = 33-9 = 24', zh:'63-39 = 63-30-9 = 33-9 = 24' },
        book:{ ko:'98-23: 98-20=78, 78-3=75. 어떤 순서로 나눠 빼도 자리마다 정확히 빼주면 답은 항상 같아요.',
               en:'98-23: 98-20=78, 78-3=75. As long as you subtract each place correctly, the order never changes the answer.',
               zh:'98-23：98-20=78，78-3=75。只要每一位都减对，顺序怎样都不影响答案。' } },

      { tag:{ ko:'③ 세 자리 수도 똑같아요', en:'3) Works for 3-digit numbers too', zh:'③ 三位数也一样' },
        head:{ ko:'자리가 늘어나도 방법은 그대로!', en:'More digits, same method!', zh:'位数变多，方法不变！' },
        desc:{ ko:'세 자리, 네 자리 수도 마찬가지예요. 백의 자리, 십의 자리, 일의 자리 순서로 하나씩 따로 빼주면 돼요.',
               en:'The same works for 3- and 4-digit numbers — subtract hundreds, then tens, then ones, one place at a time.',
               zh:'三位数、四位数也一样，按百位、十位、个位依次分别相减即可。' },
        mathSteps:['435 - 24','= 435 - 20 - 4','= 415 - 4','= 411'],
        result:{ ko:'435-24 = 435-20-4 = 415-4 = 411', en:'435-24 = 435-20-4 = 415-4 = 411', zh:'435-24 = 435-20-4 = 415-4 = 411' },
        book:null }
    ],
    rule:{ ko:'① 빼는 수를 십의 자리와 일의 자리로 나눈다  ② 십의 자리부터 뺀다  ③ 일의 자리를 뺀다',
      en:'① Split the number you\'re subtracting into tens and ones  ② Subtract the tens first  ③ Then subtract the ones',
      zh:'①把要减的数分成十位和个位 ②先减十位 ③再减个位' }
  },

  check:{
    fills:[
      { tex:'78 - 49 = 78 - \\square - 9', answer:40,
        hint:{ ko:'49를 십의 자리와 일의 자리로 나누면? 49 = ?0 + 9', en:'Split 49 into tens and ones: 49 = ?0 + 9', zh:'把49分成十位和个位：49 = ?0 + 9' } },
      { tex:'435 - 24 = 415 - \\square', answer:4,
        hint:{ ko:'435에서 20을 먼저 빼면 415. 이제 남은 일의 자리는?', en:'435 minus 20 is 415. What\'s left of the ones digit?', zh:'435先减20得415，还剩个位多少？' } }
    ],
    open:{
      ko:'십의 자리를 먼저 빼면 왜 계산이 더 편해질까요? 일의 자리를 먼저 빼도 답이 같은 이유도 설명해봐요.',
      en:'Why is it easier to subtract the tens first? Explain why the answer is the same even if you subtract ones first.',
      zh:'为什么先减十位会更方便？也说说为什么先减个位答案也一样。'
    },
    openHint:{
      ko:'예) 큰 자리부터 빼면 숫자가 한 번에 많이 줄어서 남은 계산이 작아져요. 자리를 나눠서 빼는 건 결국 같은 걸 두 번에 나눠서 하는 것뿐이라 순서를 바꿔도 총합은 같아요.',
      en:'e.g. Subtracting the bigger place first shrinks the number a lot at once, leaving a smaller calculation. Splitting the subtraction is just doing the same total in two steps, so the order doesn\'t matter.',
      zh:'例）先减大的位数，数字一下子变小很多，剩下的计算就简单了。分开减其实就是把同一件事分两步做，顺序不影响总数。'
    }
  },

  lab:{
    generator:'subByPlace', level:'main', count:4,
    intro:{
      ko:'이제 진짜 마법! 십의 자리부터 차근차근 빼봐요.',
      en:'Real magic time! Subtract the tens first, step by step.',
      zh:'真正的魔法时刻！先减十位，一步一步来。'
    }
  },

  arena:{
    generator:'subByPlace', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한 많이! 십의 자리부터 빼요!', en:'As many as you can in 5 minutes — subtract tens first!', zh:'5分钟内尽量多做！先减十位！' }
  },

  stamp:{ label:{ ko:'자리 나눔 마법사', en:'Place-Splitter', zh:'分位魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'자리 나누기 성공! ✂️',en:'Split it right!',zh:'分位成功！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 십의 자리부터 빼봐!',en:'Hmm — try subtracting the tens first!',zh:'嗯，试试先减十位！'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 자리 나눔 마법사야 ✂️✨', en:"Perfect! You're a Place-Splitter now!", zh:'完美！你现在是分位魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
