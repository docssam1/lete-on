/* ============================================================
   Numbers of Magic — 유닛 데이터: A-17
   초급 E · 챕터1 "끊어서 더하기 2"
   4자리 수를 앞 두 자리/뒤 두 자리로 쪼개서 각각 더한 뒤 합산.
   1234+5678 → (12+56)=68→6800 ; (34+78)=112 ; 6800+112=6912
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-17'] = {
  id:'A-17', tier:'beginner', level:'A', order:17,
  generator:'splitAdd2Digit',
  title:{ ko:'끊어서 더하기 2', en:'Split & Add (4-Digit)', zh:'拆分相加 2' },
  subtitle:{ ko:'앞 두 자리·뒤 두 자리로 나눠 각각 더해요', en:'Split each number into front and back pairs, then add', zh:'把每个数拆成前两位和后两位分别相加' },
  icon:'✂️',

  practice:{
    generator:'splitAdd2Digit', level:'practice', count:5,
    intro:{
      ko:'먼저 두 자리 수 덧셈을 빠르게 연습해요!',
      en:'First, let\'s practice two-digit addition quickly!',
      zh:'先快速练习两位数加法！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 앞 두 자리·뒤 두 자리로 쪼개요', en:'1) Split into front pair + back pair', zh:'① 拆成前两位和后两位' },
        head:{ ko:'4자리 수를 두 부분으로 나눠요', en:'Divide each 4-digit number into two parts', zh:'把4位数分成两部分' },
        desc:{ ko:'1234는 앞쪽 12×100=1200 과 뒤쪽 34 로 이루어져 있어요. 덧셈할 때 <b>앞끼리, 뒤끼리 따로 더하면</b> 쉬워져요!',
               en:'1234 is made of front 12×100=1200 and back 34. When adding, work <b>front+front and back+back separately</b>!',
               zh:'1234由前面12×100=1200和后面34组成。做加法时，<b>前面加前面、后面加后面</b>，更简单！' },
        mathSteps:['1234 + 5678',{ko:'앞: 12 + 56 = 68 → 6800',en:'\\text{front: } 12 + 56 = 68 → 6800',zh:'前面：12 + 56 = 68 → 6800'},{ko:'뒤: 34 + 78 = 112',en:'\\text{back: } 34 + 78 = 112',zh:'后面：34 + 78 = 112'},'6800 + 112 = 6912'],
        result:{ ko:'앞끼리 더한 값에 ×100하고, 뒤끼리 더한 값을 더하면 끝!', en:'Multiply the front sum by 100, then add the back sum!', zh:'前两位之和×100，再加上后两位之和，大功告成！' },
        book:{ ko:'4자리 수를 두 자리씩 끊어 계산하면 받아올림 걱정이 줄어요.', en:'Splitting into 2-digit pairs makes carrying much easier.', zh:'每两位拆开计算，就不用担心进位啦。' } },

      { tag:{ ko:'② 쪼갠 뒤 합산하기', en:'2) Combine the partial sums', zh:'② 合并部分和' },
        head:{ ko:'두 부분 합을 더하면 정답!', en:'Add the two partial sums to get the answer!', zh:'两个部分和相加即可得出答案！' },
        desc:{ ko:'<b>앞 두 자리 합×100 + 뒤 두 자리 합 = 전체 합</b>. 이 순서를 지키면 항상 정확해요.',
               en:'<b>Front sum × 100 + Back sum = Total</b>. Follow this order and you\'ll always be correct.',
               zh:'<b>前两位和×100 + 后两位和 = 总和</b>。按这个顺序，永远准确！' },
        mathSteps:['3412 + 5281',{ko:'앞: 34 + 52 = 86 → 8600',en:'\\text{front: } 34 + 52 = 86 → 8600',zh:'前面：34 + 52 = 86 → 8600'},{ko:'뒤: 12 + 81 = 93',en:'\\text{back: } 12 + 81 = 93',zh:'后面：12 + 81 = 93'},'8600 + 93 = 8693'],
        result:{ ko:'3412+5281=8693 ✓', en:'3412+5281=8693 ✓', zh:'3412+5281=8693 ✓' },
        book:null }
    ],
    rule:{ ko:'① 각 수를 앞 두 자리/뒤 두 자리로 쪼갠다  ② 앞끼리, 뒤끼리 따로 더한다  ③ 앞 합×100 + 뒤 합 = 정답',
      en:'① Split each number into front/back 2-digit pairs  ② Add fronts, add backs separately  ③ Front sum × 100 + Back sum = answer',
      zh:'①把每个数拆成前两位/后两位 ②前面加前面、后面加后面 ③前两位和×100+后两位和=答案' }
  },

  check:{
    fills:[
      { tex:'1234 + 5678 = 6800 + \\square', answer:112,
        hint:{ ko:'뒤 두 자리끼리: 34+78=?', en:'Back pair: 34+78=?', zh:'后两位相加：34+78=？' } },
      { tex:'3412 + 5281 = \\square + 93', answer:8600,
        hint:{ ko:'앞 두 자리끼리 34+52=86 → 86×100=?', en:'Front pair 34+52=86 → 86×100=?', zh:'前两位34+52=86→86×100=？' } }
    ],
    open:{
      ko:'4자리 수를 "앞 두 자리 × 100 + 뒤 두 자리"로 표현하는 이유를 설명해봐요.',
      en:'Explain why a 4-digit number equals its front two digits × 100 plus its back two digits.',
      zh:'说说为什么4位数等于前两位×100加后两位。'
    },
    openHint:{
      ko:'예) 1234 = 12 × 100 + 34. 자릿값(백의 자리, 천의 자리)을 생각해봐요.',
      en:'e.g. 1234 = 12 × 100 + 34. Think about place values (hundreds, thousands).',
      zh:'例）1234=12×100+34。想想数位的含义（百位、千位）。'
    }
  },

  lab:{
    generator:'splitAdd2Digit', level:'main', count:4,
    intro:{
      ko:'진짜 마법! 4자리 수를 두 조각으로 끊어 더해봐요.',
      en:'Real magic! Split each 4-digit number into two chunks and add.',
      zh:'真正的魔法！把4位数拆成两块分别相加。'
    }
  },

  arena:{
    generator:'splitAdd2Digit', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한 많이! 앞끼리·뒤끼리 끊어서 더해요!', en:'As many as you can in 5 min — split front and back!', zh:'5分钟内尽量多做！前面加前面，后面加后面！' }
  },

  stamp:{ label:{ ko:'끊어 더하기2 마법사', en:'4-Digit Splitter', zh:'拆分相加魔法师2' }, coins:20 },

  voice:{
    correct:[ {ko:'완벽해! ✨',en:'Perfect!',zh:'完美！'}, {ko:'앞뒤 모두 맞았어! ✂️',en:'Both parts right!',zh:'前后都对了！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'앞 두 자리끼리 먼저 더해봐!',en:'Try adding the front pairs first!',zh:'先把前两位加起来！'}, {ko:'천천히 쪼개봐!',en:'Split it slowly!',zh:'慢慢拆开来！'} ],
    finish:{ ko:'완벽해! 넌 이제 끊어 더하기 2 마법사야 ✂️✨', en:"Perfect! You're a 4-digit splitter now!", zh:'完美！你现在是拆分相加魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
