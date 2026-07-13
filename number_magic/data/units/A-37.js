/* Numbers of Magic — 유닛 A-37: 소수를 빼기 (초급 I 챕터3) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};
window.NM_UNITS['A-37'] = {
  id:'A-37', tier:'beginner', level:'A', order:37,
  generator:'subDecimal',
  title:{ ko:'소수를 빼기', en:'Subtracting Decimals', zh:'小数相减' },
  subtitle:{ ko:'소수점을 맞추고 자리별로 빼요', en:'Align decimal points and subtract digit by digit', zh:'对齐小数点，按位相减' },
  icon:'🔴',

  practice:{
    generator:'subDecimal', level:'practice', count:5,
    intro:{ ko:'소수점 아래 숫자끼리 빼는 연습이에요!', en:'Practice subtracting decimal digits!', zh:'练习小数点后的数字相减！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 소수 부분을 먼저 빼요', en:'1) Subtract the decimal part first', zh:'① 先减小数部分' },
        head:{ ko:'소수점 아래끼리, 정수끼리 나눠 빼요', en:'Subtract decimal parts separately, then integer parts', zh:'小数部分单独相减，整数部分也单独相减' },
        desc:{ ko:'3.7-1.4=? 소수: 0.7-0.4=0.3, 정수: 3-1=2. 결과: 2+0.3=2.3!',
               en:'3.7−1.4=? Decimal: 0.7−0.4=0.3, Integer: 3−1=2. Result: 2+0.3=2.3!',
               zh:'3.7-1.4=？小数：0.7-0.4=0.3，整数：3-1=2。结果：2+0.3=2.3！' },
        mathSteps:['3.7 - 1.4 = □','소수: 0.7 - 0.4 = 0.3','정수: 3 - 1 = 2','2 + 0.3 = 2.3'],
        result:{ ko:'3.7-1.4=2.3 ✓', en:'3.7−1.4=2.3 ✓', zh:'3.7-1.4=2.3 ✓' },
        book:{ ko:'소수 뺄셈도 덧셈처럼 소수점을 먼저 맞추고, 같은 자리끼리 빼면 돼요!', en:'Just like addition: align the decimal point first, then subtract digit by digit!', zh:'和加法一样：先对齐小数点，再按位相减！' } },
      { tag:{ ko:'② 받아내림이 있을 때', en:'2) When borrowing is needed', zh:'② 需要借位时' },
        head:{ ko:'소수 부분이 부족하면 정수에서 빌려요', en:'If the decimal part is too small, borrow from the integer', zh:'小数部分不够减时从整数部分借位' },
        desc:{ ko:'4.2-1.7=? 소수: 0.2-0.7 불가 → 정수에서 1 빌려서 1.2-0.7=0.5. 정수: 4-1-1=2. 답: 2.5!',
               en:'4.2−1.7=? Decimal: 0.2−0.7 impossible → borrow 1 from integer: 1.2−0.7=0.5. Integer: 4−1−1=2. Answer: 2.5!',
               zh:'4.2-1.7=？小数：0.2-0.7不够→从整数借1：1.2-0.7=0.5。整数：4-1-1=2。答案：2.5！' },
        mathSteps:['4.2 - 1.7 = □','소수: 0.2-0.7 → 정수에서 1 빌림','(10+2)-7 = 5 → 0.5','정수: 4-1-1 = 2 → 2.5'],
        result:{ ko:'4.2-1.7=2.5 ✓', en:'4.2−1.7=2.5 ✓', zh:'4.2-1.7=2.5 ✓' },
        book:null }
    ],
    rule:{ ko:'① 소수 부분(십분의 자리) 빼기  ② 부족하면 정수에서 1 빌리기  ③ 정수 부분 빼기 (빌렸으면 1 더 빼기)',
      en:'① Subtract tenths  ② Borrow 1 from integer if needed  ③ Subtract integers (minus the borrow)',
      zh:'①减十分位 ②不够减时从整数借1 ③减整数（借了就多减1）' }
  },

  check:{
    fills:[
      { tex:'3.7-1.4: 0.7-0.4=\\square', answer:0.3,
        hint:{ ko:'7-4=3이라서 0.7-0.4=0.3', en:'7−4=3 so 0.7−0.4=0.3', zh:'7-4=3，所以0.7-0.4=0.3' } },
      { tex:'2+0.3=\\square', answer:2.3, hint:{ ko:'2에 0.3을 더해요', en:'2 plus 0.3', zh:'2加0.3' } }
    ],
    open:{ ko:'소수 뺄셈에서 받아내림이 생기는 경우를 예시를 들어 설명해봐요.', en:'Give an example of borrowing in decimal subtraction and explain it.', zh:'举例说明小数减法中借位的情况。' },
    openHint:{ ko:'4.2-1.7처럼 소수 부분(0.2)이 빼는 수의 소수 부분(0.7)보다 작을 때 정수에서 1을 빌려요.', en:'When the decimal part (0.2) is smaller than what you subtract (0.7), borrow 1 from the integer (like 4.2−1.7).', zh:'当小数部分（0.2）小于被减的小数（0.7）时，从整数部分借1（如4.2-1.7）。' }
  },

  lab:{ generator:'subDecimal', level:'main', count:4,
    intro:{ ko:'소수점 맞추고 빼요!', en:'Align and subtract decimals!', zh:'对齐小数点再相减！' } },

  arena:{ generator:'subDecimal', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한! 소수 뺄셈!', en:'As many as you can! Decimal subtraction!', zh:'5分钟内尽量多做！小数减法！' } },

  stamp:{ label:{ ko:'소수 뺄셈 마법사', en:'Decimal Subtractor', zh:'小数减法魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'소수 뺄셈 성공! 🔴✨',en:'Decimal subtraction!',zh:'小数减法成功！✨'}, {ko:'소수점 완벽!',en:'Decimal perfect!',zh:'小数点完美！'} ],
    wrong:[ {ko:'소수 부분끼리 먼저 빼봐!',en:'Subtract decimal parts first!',zh:'先减小数部分！'}, {ko:'부족하면 정수에서 1 빌려야 해!',en:'Borrow 1 from integer if needed!',zh:'不够减就从整数借1！'} ],
    finish:{ ko:'완벽해! 소수 뺄셈 마법사야! 🔴✨', en:"Perfect! You're a decimal subtractor!", zh:'完美！你是小数减法魔法师！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
