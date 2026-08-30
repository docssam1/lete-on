/* Numbers of Magic — 유닛 A-31: 쉬운 것 먼저 빼기 (초급 H 챕터2) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};
window.NM_UNITS['A-31'] = {
  id:'A-31', tier:'beginner', level:'A', order:31,
  generator:'subEasyFirst',
  title:{ ko:'쉬운 것 먼저 빼기', en:'Subtract Easy Parts First', zh:'先减容易的部分' },
  subtitle:{ ko:'받아내림 없는 쉬운 부분을 먼저 빼서 부담을 줄여요', en:'Subtract the easy borrow-free part first to reduce the mental load', zh:'先减不需要借位的简单部分，减轻计算负担' },
  icon:'🎈',

  practice:{
    generator:'subEasyFirst', level:'practice', count:5,
    intro:{ ko:'받아내림 없는 쉬운 뺄셈부터 해봐요!', en:'Start with the borrow-free subtraction!', zh:'先做不需要借位的减法！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 받아내림 없는 자리부터 빼요', en:'1) Subtract borrow-free digits first', zh:'① 先减不需要借位的那位' },
        head:{ ko:'쉬운 부분 먼저, 어려운 부분 나중에', en:'Easy part first, then tackle the tricky part', zh:'先减简单的，再减复杂的' },
        desc:{ ko:'74-36=? 일의 자리(4-6)는 받아내림 필요. 십의 자리(7-3=4)부터! 40남음. 40+4-6=38!',
               en:'74−36=? Ones (4−6) need borrowing. Start with tens (7−3=4): 40 left. 40+4−6=38!',
               zh:'74-36=？个位（4-6）需要借位。先算十位（7-3=4）：剩40。40+4-6=38！' },
        mathSteps:['74 - 36 = □',{ko:'십의 자리(쉬운 부분): 70-30=40',en:'\\text{tens (the easy part): } 70-30=40',zh:'十位（容易的部分）：70-30=40'},'40 + 4 - 6 = 40 - 2 = 38'],
        result:{ ko:'74-36=38 ✓', en:'74−36=38 ✓', zh:'74-36=38 ✓' },
        book:{ ko:'어떤 자리부터 빼는 게 쉬운지 먼저 판단하고, 쉬운 쪽부터 시작해요.', en:'First judge which digit is easiest, then start there.', zh:'先判断哪位最容易减，就从那位开始。' } },
      { tag:{ ko:'② 세 자리 수에서도 적용해요', en:'2) Works for 3-digit numbers too', zh:'② 三位数也适用' },
        head:{ ko:'받아내림 없는 자리를 먼저 찾아요', en:'Find the borrow-free digits first', zh:'先找不需要借位的那位' },
        desc:{ ko:'852-427=? 백(8-4=4, 쉬움), 십(5-2=3, 쉬움), 일(2-7 어려움). → 400+30=430, 430+2-7=425!',
               en:'852−427=? Hundreds(8−4=4, easy), Tens(5−2=3, easy), Ones(2−7 hard). → 400+30=430, 430+2−7=425!',
               zh:'852-427=？百（8-4=4，简单），十（5-2=3，简单），个（2-7难）。→400+30=430，430+2-7=425！' },
        mathSteps:['852 - 427 = □',{ko:'800-400=400, 50-20=30 (쉬운 부분 먼저)',en:'800-400=400, 50-20=30 \\text{ (easy parts first)}',zh:'800-400=400, 50-20=30（先算容易的）'},'400 + 30 = 430','430 + 2 - 7 = 425'],
        result:{ ko:'852-427=425 ✓', en:'852−427=425 ✓', zh:'852-427=425 ✓' },
        book:null }
    ],
    rule:{ ko:'① 받아내림 없는(쉬운) 자리를 먼저 찾는다  ② 쉬운 자리 먼저 뺀다  ③ 남은 어려운 자리를 처리한다',
      en:'① Identify borrow-free (easy) digits  ② Subtract easy digits first  ③ Handle the tricky digits',
      zh:'①找出不需要借位的（简单的）各位 ②先减简单的 ③再处理复杂的' }
  },

  check:{
    fills:[
      { tex:{ko:'74-36: 70-30=\\square \\text{(쉬운 부분)}',en:'74-36: 70-30=\\square \\text{(the easy part)}',zh:'74-36: 70-30=\\square \\text{（容易的部分）}'}, answer:40,
        hint:{ ko:'7-3=4이라서 70-30=40', en:'7−3=4 so 70−30=40', zh:'7-3=4，所以70-30=40' } },
      { tex:'40+4-6=\\square', answer:38, hint:{ ko:'44-6=38', en:'44−6=38', zh:'44-6=38' } }
    ],
    open:{ ko:'뺄셈에서 "쉬운 것 먼저" 전략이 유용한 이유를 설명해봐요.', en:'Explain why the "easy first" strategy is useful in subtraction.', zh:'说说减法中"先减简单部分"策略有用的原因。' },
    openHint:{ ko:'쉬운 부분을 먼저 처리하면 나머지 수가 작아져서 어려운 부분을 다룰 때 부담이 줄어요.', en:'Handling the easy parts first shrinks the remaining number, making the hard part easier to manage.', zh:'先处理简单部分后，剩余数变小，再处理复杂部分时负担减轻了。' }
  },

  lab:{ generator:'subEasyFirst', level:'main', count:4,
    intro:{ ko:'쉬운 것부터! 부담 없이 빼기!', en:'Easy parts first! Stress-free subtraction!', zh:'先减简单的！无压力减法！' } },

  arena:{ generator:'subEasyFirst', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한! 쉬운 것 먼저!', en:'As many as you can! Easy parts first!', zh:'5分钟内尽量多做！先减简单的！' } },

  stamp:{ label:{ ko:'쉬운것 먼저 마법사', en:'Easy-First Wizard', zh:'先简后难魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'쉬운 것 먼저 성공! 🎈✨',en:'Easy first!',zh:'先简后难成功！✨'}, {ko:'스마트하게 빼기!',en:'Smart subtraction!',zh:'聪明地减法！'} ],
    wrong:[ {ko:'받아내림 없는 자리를 먼저 빼봐!',en:'Subtract the borrow-free digit first!',zh:'先减不需要借位的那位！'}, {ko:'쉬운 부분부터 시작해!',en:'Start with the easy part!',zh:'从简单的部分开始！'} ],
    finish:{ ko:'완벽해! 쉬운것 먼저 마법사야! 🎈✨', en:"Perfect! You're an easy-first wizard!", zh:'完美！你是先简后难魔法师！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
