/* ============================================================
   Numbers of Magic — 유닛 데이터: A-14
   초급 D · 챕터2 "자릿수 이동 뺄셈"
   창의수연 초급 D 실제 교재 내용 기반. generator=digitShiftSub.
   핵심: 123-85 → 23+100-85 = 23+15 = 38
   "백의 자리 하나를 앞으로 이동시켜 계산해요!"
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-14'] = {
  id:'A-14', tier:'beginner', level:'A', order:14,
  generator:'digitShiftSub',
  title:{ ko:'자릿수 이동 뺄셈', en:'Digit-Shift Subtraction', zh:'数位挪移减法' },
  subtitle:{ ko:'100을 이동시켜 남은 수끼리 먼저 빼요', en:'Shift a hundred over and subtract from it first', zh:'挪一个百过去，先减它' },
  icon:'🚚',

  practice:{
    generator:'digitShiftSub', level:'practice', count:5,
    intro:{
      ko:'준비 운동! 세 자리 수를 100과 나머지로 나눠볼까?',
      en:"Warm up! Split a 3-digit number into 100 and the rest.",
      zh:'热热身！把三位数分成100和其余的部分。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 100을 하나 앞으로 옮겨요', en:'1) Move one hundred to the front', zh:'① 挪一个百到前面' },
        head:{ ko:'세 자리 수를 100과 나머지로 나눠요', en:'Split the 3-digit number into 100 and the rest', zh:'把三位数分成100和其余部分' },
        desc:{ ko:'123-85처럼 세 자리에서 두 자리를 뺄 땐, 123을 23과 100으로 나누고, <b>100에서 85를 뺀 다음 23에 더해요</b>.',
               en:'For 123-85, split 123 into 23 and 100, <b>subtract 85 from the 100, then add the result to 23</b>.',
               zh:'像123-85这样三位数减两位数，把123分成23和100，<b>用100减85，再加到23上</b>。' },
        mathSteps:['123 - 85','= 23 + 100 - 85','= 23 + 15','= 38'],
        result:{ ko:'100-85=15, 23+15=38이에요!', en:'100-85=15, so 23+15=38!', zh:'100-85=15，23+15=38！' },
        book:{ ko:'256-75: 256을 156+100으로 나누고, 100-75=25를 만들어 156+25=181.',
               en:'256-75: split 256 into 156+100, compute 100-75=25, then 156+25=181.',
               zh:'256-75：把256分成156+100，算出100-75=25，再156+25=181。' } },

      { tag:{ ko:'② 세 자리 수 어디서든 똑같아요', en:'2) Works no matter the hundreds digit', zh:'② 无论百位是几都一样' },
        head:{ ko:'큰 세 자리 수도 방법은 그대로', en:'Same method for any 3-digit number', zh:'再大的三位数也一样' },
        desc:{ ko:'326처럼 백의 자리가 3이어도 <b>100 하나만 떼어내요</b>. 226+100으로 나누고 나머지는 그대로 226에 남아있어요.',
               en:'Even for 326 (hundreds digit 3), <b>set aside just one hundred: split into 226+100</b>, and 226 stays as is.',
               zh:'像326这样百位是3，也<b>只拿出一个100</b>：分成226+100，226保持不变。' },
        mathSteps:['326 - 57','= 226 + 100 - 57','= 226 + 43','= 269'],
        result:{ ko:'326-57 = 226+100-57 = 226+43 = 269', en:'326-57 = 226+100-57 = 226+43 = 269', zh:'326-57 = 226+100-57 = 226+43 = 269' },
        book:null }
    ],
    rule:{ ko:'① 세 자리 수를 (나머지)+100으로 나눈다  ② 100에서 두 자리 수를 뺀다  ③ 나머지에 결과를 더한다',
      en:'① Split the number into (the rest) + 100  ② Subtract the 2-digit number from the 100  ③ Add the result to the rest',
      zh:'①把数分成(其余部分)+100 ②用100减两位数 ③把结果加到其余部分上' }
  },

  check:{
    fills:[
      { tex:'123 - 85 = 23 + \\square', answer:15,
        hint:{ ko:'100에서 85를 빼면?', en:'What is 100 minus 85?', zh:'100减85是多少？' } },
      { tex:'326 - 57 = 226 + \\square', answer:43,
        hint:{ ko:'100에서 57을 빼면?', en:'What is 100 minus 57?', zh:'100减57是多少？' } }
    ],
    open:{
      ko:'123-85를 자릿수 이동 뺄셈으로 어떻게 계산하는지 순서대로 설명해봐요.',
      en:'Explain step by step how to compute 123-85 using digit-shift subtraction.',
      zh:'按步骤说说怎么用数位挪移法算123-85。'
    },
    openHint:{
      ko:'예) 123을 23과 100으로 나눈다 → 100에서 85를 빼 15를 만든다 → 23에 15를 더해 38을 얻는다.',
      en:'e.g. Split 123 into 23 and 100 → subtract 85 from 100 to get 15 → add 15 to 23 to get 38.',
      zh:'例）把123分成23和100 → 用100减85得15 → 23加15得38。'
    }
  },

  lab:{
    generator:'digitShiftSub', level:'main', count:4,
    intro:{
      ko:'이제 진짜 마법! 100을 앞으로 이동시켜 계산해봐요.',
      en:'Real magic time! Shift a hundred over to calculate.',
      zh:'真正的魔法时刻！挪一个百过去来计算。'
    }
  },

  arena:{
    generator:'digitShiftSub', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한 많이! 100을 이동시켜요!', en:'As many as you can in 5 minutes — shift the hundred!', zh:'5分钟内尽量多做！挪一个百！' }
  },

  stamp:{ label:{ ko:'자릿수 이동 마법사', en:'Digit-Shifter', zh:'数位挪移魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'100 이동 성공! 🚚',en:'Shifted it right!',zh:'挪移成功！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 100을 앞으로 옮겨서 빼봐!',en:'Hmm — try shifting a hundred over first!',zh:'嗯，试试先挪一个百过去！'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 자릿수 이동 마법사야 🚚✨', en:"Perfect! You're a Digit-Shifter now!", zh:'完美！你现在是数位挪移魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
