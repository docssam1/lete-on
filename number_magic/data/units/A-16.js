/* ============================================================
   Numbers of Magic — 유닛 데이터: A-16
   초급 D · 챕터4 "끊어서 더하기 1"
   창의수연 초급 D 실제 교재 내용 기반. generator=splitAddByDigit.
   핵심: 자리마다 따로 더한 뒤, 부분합을 마지막에 다 더한다.
   234+? → 백/십/일 자리끼리 따로 더하고 합산
   "자리마다 따로 더한 뒤, 마지막에 다 더해요!"
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-16'] = {
  id:'A-16', tier:'beginner', level:'A', order:16,
  generator:'splitAddByDigit',
  title:{ ko:'끊어서 더하기 1', en:'Add by Place Value', zh:'按位相加 1' },
  subtitle:{ ko:'자리마다 따로 더한 뒤, 마지막에 다 더해요', en:'Add each place separately, then combine', zh:'每位分别相加，最后合起来' },
  icon:'✂️',

  practice:{
    generator:'splitAddByDigit', level:'practice', count:5,
    intro:{
      ko:'준비 운동! 십의 자리끼리 먼저 더하는 연습이야.',
      en:"Warm up! Practice adding the tens places together first.",
      zh:'热热身！先练习把十位加在一起。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 자리마다 따로 더해요', en:'1) Add each place on its own', zh:'① 每位分别相加' },
        head:{ ko:'같은 자리 숫자끼리 각각 더해요', en:'Add digits of the same place value together', zh:'相同数位的数字各自相加' },
        desc:{ ko:'받아올림이 헷갈릴 땐, <b>백의 자리끼리·십의 자리끼리·일의 자리끼리 따로 더한</b> 다음, 그 부분합들을 마지막에 한꺼번에 더해요.',
               en:'When carrying gets confusing, <b>add hundreds-to-hundreds, tens-to-tens, ones-to-ones separately</b>, then add those partial totals all at once.',
               zh:'进位搞混时，先把<b>百位加百位、十位加十位、个位加个位</b>，再把这些部分和一起相加。' },
        mathSteps:['325 + 248','= (300+200) + (20+40) + (5+8)','= 500 + 60 + 13','= 573'],
        result:{ ko:'자리별 부분합을 마지막에 더하면 받아올림 걱정이 줄어요!', en:'Adding place-by-place partial totals at the end reduces carrying worries!', zh:'最后再加各位部分和，进位就不容易出错！' },
        book:{ ko:'십의 자리끼리 더한 60, 일의 자리끼리 더한 13처럼 부분합을 먼저 구하고, 500+60+13=573으로 합산해요.',
               en:'Get partial sums like 60 (tens) and 13 (ones) first, then combine: 500+60+13=573.',
               zh:'先求出十位和60、个位和13这样的部分和，再合起来：500+60+13=573。' } },

      { tag:{ ko:'② 왜 자리를 밀어서 쓸까요?', en:'2) Why shift the partial sums?', zh:'② 为什么部分和要错位写？' },
        head:{ ko:'자릿값만큼 밀어서 적어요', en:'Write each partial sum shifted by its place value', zh:'按数位大小错位写' },
        desc:{ ko:'십의 자리끼리 더한 "6"은 사실 60이에요. 그래서 자릿값만큼 밀어서(0을 붙여) 적어요. <b>자릿값을 정확히 지키면</b> 답이 절대 틀리지 않아요.',
               en:'The "6" from adding tens is really 60. So write it shifted (with a zero). <b>Keep place values exact</b> and the answer is always right.',
               zh:'十位相加得的"6"其实是60，所以要错位（补0）写。<b>数位对准</b>，答案就不会错。' },
        mathSteps:['412 + 356','= 700 + 60 + 8','= 768'],
        result:{ ko:'412+356 = 700+60+8 = 768', en:'412+356 = 700+60+8 = 768', zh:'412+356 = 700+60+8 = 768' },
        book:null }
    ],
    rule:{ ko:'① 백의 자리끼리, 십의 자리끼리, 일의 자리끼리 따로 더한다  ② 각 부분합을 자릿값대로 쓴다  ③ 마지막에 다 더한다',
      en:'① Add hundreds, tens, ones separately  ② Write each partial sum at its place value  ③ Add them all at the end',
      zh:'①百位、十位、个位分别相加 ②各部分和按数位写 ③最后全部加起来' }
  },

  check:{
    fills:[
      { tex:'325 + 248 = 500 + 60 + \\square', answer:13,
        hint:{ ko:'일의 자리끼리 더하면? 5+8=?', en:'Add the ones: 5+8=?', zh:'个位相加：5+8=？' } },
      { tex:'412 + 356 = 700 + \\square + 8', answer:60,
        hint:{ ko:'십의 자리끼리 더하면? 10+50=?', en:'Add the tens: 10+50=?', zh:'十位相加：10+50=？' } }
    ],
    open:{
      ko:'십의 자리끼리 더한 값을 왜 자리를 밀어서(0을 붙여) 적어야 하는지 설명해봐요.',
      en:'Explain why the sum of the tens places must be written shifted (with a zero).',
      zh:'说说为什么十位相加的结果要错位（补0）写。'
    },
    openHint:{
      ko:'예) 십의 자리 6은 실제로 60을 뜻해요. 자릿값을 지켜 밀어서 적어야 전체 합이 맞아요.',
      en:'e.g. A 6 in the tens place really means 60. Writing it shifted keeps the total correct.',
      zh:'例）十位的6其实代表60。错位书写才能保证总和正确。'
    }
  },

  lab:{
    generator:'splitAddByDigit', level:'main', count:4,
    intro:{
      ko:'이제 진짜 마법! 자리마다 따로 더한 뒤 합쳐봐요.',
      en:'Real magic time! Add each place separately, then combine.',
      zh:'真正的魔法时刻！每位分别相加，再合起来。'
    }
  },

  arena:{
    generator:'splitAddByDigit', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한 많이! 자리마다 따로 더해요!', en:'As many as you can in 5 minutes — add each place separately!', zh:'5分钟内尽量多做！每位分别相加！' }
  },

  stamp:{ label:{ ko:'끊어 더하기 마법사', en:'Place-Adder', zh:'按位相加魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'자리별 합 완벽! ✂️',en:'Partial sums perfect!',zh:'部分和完美！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 같은 자리끼리 먼저 더해봐!',en:'Hmm — add the same places together first!',zh:'嗯，先把相同数位加起来！'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 끊어 더하기 마법사야 ✂️✨', en:"Perfect! You're a Place-Adder now!", zh:'完美！你现在是按位相加魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
