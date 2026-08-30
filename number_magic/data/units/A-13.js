/* ============================================================
   Numbers of Magic — 유닛 데이터: A-13
   초급 D · 챕터1 "백으로 쪼개서 빼기"
   창의수연 초급 D 실제 교재 내용 기반. generator=splitHundred.
   핵심: 400-35 → 300+100-35 = 300+65 = 365
   "100 하나를 따로 떼어 빼고, 남은 걸 더해요!"
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-13'] = {
  id:'A-13', tier:'beginner', level:'A', order:13,
  generator:'splitHundred',
  title:{ ko:'백으로 쪼개서 빼기', en:'Split Off a Hundred', zh:'拆出一个百来减' },
  subtitle:{ ko:'100 하나를 떼어 빼고, 남은 걸 더해요', en:'Set aside one hundred, subtract, then add back', zh:'拿出一个100来减，再加回来' },
  icon:'💯',

  practice:{
    generator:'splitHundred', level:'practice', count:5,
    intro:{
      ko:'준비 운동! 몇백에서 100을 떼어내는 연습이야.',
      en:"Warm up! Practice setting aside 100 from a round hundred.",
      zh:'热热身！练习从整百里拿出100。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 100 하나만 떼어내요', en:'1) Set aside just one hundred', zh:'① 只拿出一个百' },
        head:{ ko:'몇백 빼기 두 자리 수, 100 하나면 충분해요', en:'Hundreds minus a two-digit number — one hundred is enough', zh:'整百减两位数，拿出一个百就够' },
        desc:{ ko:'400-35처럼 몇백에서 두 자리 수를 뺄 땐, <b>100 하나를 따로 떼어내</b> 그 안에서 35를 빼고, 남은 300에 결과를 더해요.',
               en:'For 400-35, <b>set aside just one hundred, subtract 35 from it</b>, then add the result to the remaining 300.',
               zh:'像400-35这样整百减两位数，<b>先拿出一个100</b>，从中减去35，再把结果加到剩下的300上。' },
        mathSteps:['400 - 35',{ko:'= 300 + 100 - 35  ← 100 하나만!',en:'= 300 + 100 - 35 ← \\text{just one 100!}',zh:'= 300 + 100 - 35 ← 只用一个100！'},'= 300 + 65','= 365'],
        result:{ ko:'100에서 35를 빼면 65, 300+65=365예요!', en:'100 minus 35 is 65, so 300+65=365!', zh:'100减35是65，300+65=365！' },
        book:{ ko:'500-46: 500을 400+100으로 나누고, 100-46=54를 만들어 400+54=454.',
               en:'500-46: split 500 into 400+100, compute 100-46=54, then 400+54=454.',
               zh:'500-46：把500分成400+100，算出100-46=54，再400+54=454。' } },

      { tag:{ ko:'② 왜 100만 떼면 될까요?', en:'2) Why is one hundred enough?', zh:'② 为什么拿一个百就够？' },
        head:{ ko:'빼는 수가 두 자리라서 100이면 충분해요', en:'Since the subtrahend is only 2 digits, 100 covers it', zh:'因为减数只有两位数，100足够了' },
        desc:{ ko:'빼는 수가 항상 99 이하인 두 자리 수라서, <b>100 하나만 떼어내도</b> 그 안에서 충분히 뺄 수 있어요. 나머지 백의 자리는 그대로 두면 돼요.',
               en:'Since the number being subtracted is always a 2-digit number (99 or less), <b>one hundred is always enough to subtract from</b> — the rest of the hundreds stay untouched.',
               zh:'因为被减的数总是两位数（99以下），<b>拿出一个100就够减了</b>，其余的百位保持不变。' },
        mathSteps:['600 - 47','= 500 + 100 - 47','= 500 + 53','= 553'],
        result:{ ko:'600-47 = 500+100-47 = 500+53 = 553', en:'600-47 = 500+100-47 = 500+53 = 553', zh:'600-47 = 500+100-47 = 500+53 = 553' },
        book:null }
    ],
    rule:{ ko:'① 몇백에서 100 하나를 떼어낸다  ② 100에서 두 자리 수를 뺀다  ③ 남은 백의 자리에 결과를 더한다',
      en:'① Set aside one hundred from the round hundred  ② Subtract the 2-digit number from it  ③ Add the result to the rest',
      zh:'①从整百里拿出一个百 ②用它减两位数 ③把结果加到剩下的百位上' }
  },

  check:{
    fills:[
      { tex:'400 - 35 = 300 + \\square', answer:65,
        hint:{ ko:'100에서 35를 빼면?', en:'What is 100 minus 35?', zh:'100减35是多少？' } },
      { tex:'600 - 47 = 500 + \\square', answer:53,
        hint:{ ko:'100에서 47을 빼면?', en:'What is 100 minus 47?', zh:'100减47是多少？' } }
    ],
    open:{
      ko:'몇백에서 두 자리 수를 뺄 때 100만 떼어내도 되는 이유를 설명해봐요.',
      en:'Explain why setting aside just one hundred is enough when subtracting a 2-digit number from a round hundred.',
      zh:'说说为什么整百减两位数时，只拿出一个百就够了。'
    },
    openHint:{
      ko:'예) 빼는 수가 99보다 클 수 없어서, 100 하나면 항상 충분히 뺄 수 있어요.',
      en:'e.g. Since the number being subtracted can never exceed 99, one hundred is always enough.',
      zh:'例）因为被减的数不会超过99，一个百总是够减的。'
    }
  },

  lab:{
    generator:'splitHundred', level:'main', count:4,
    intro:{
      ko:'이제 진짜 마법! 100 하나만 떼어서 빼봐요.',
      en:'Real magic time! Set aside just one hundred to subtract.',
      zh:'真正的魔法时刻！拿出一个百来减。'
    }
  },

  arena:{
    generator:'splitHundred', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한 많이! 100 하나만 떼어내요!', en:'As many as you can in 5 minutes — set aside one hundred!', zh:'5分钟内尽量多做！拿出一个百！' }
  },

  stamp:{ label:{ ko:'백 쪼개기 마법사', en:'Hundred-Splitter', zh:'拆百魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'100 딱 떼어냈네! 💯',en:'Perfect split!',zh:'百拿得刚刚好！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 100 하나만 떼어서 빼봐!',en:'Hmm — try setting aside just one hundred!',zh:'嗯，试试只拿出一个百！'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 백 쪼개기 마법사야 💯✨', en:"Perfect! You're a Hundred-Splitter now!", zh:'完美！你现在是拆百魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
