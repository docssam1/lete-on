/* Numbers of Magic — 유닛 A-36: 소수를 더하기 (초급 I 챕터2) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};
window.NM_UNITS['A-36'] = {
  id:'A-36', tier:'beginner', level:'A', order:36,
  generator:'addDecimal',
  title:{ ko:'소수를 더하기', en:'Adding Decimals', zh:'小数相加' },
  subtitle:{ ko:'소수점을 맞추고 자리별로 더해요', en:'Align decimal points and add digit by digit', zh:'对齐小数点，按位相加' },
  icon:'🔵',

  practice:{
    generator:'addDecimal', level:'practice', count:5,
    intro:{ ko:'소수점 아래 숫자끼리 더하는 연습이에요!', en:'Practice adding the decimal digits!', zh:'练习小数点后的数字相加！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 소수점 아래를 먼저 더해요', en:'1) Add the decimal part first', zh:'① 先加小数部分' },
        head:{ ko:'소수점 아래끼리, 정수끼리 나눠 더해요', en:'Add decimal parts together, integer parts together', zh:'小数部分与小数部分相加，整数部分与整数部分相加' },
        desc:{ ko:'2.3+1.4=? 소수: 0.3+0.4=0.7, 정수: 2+1=3. 합: 3+0.7=3.7!',
               en:'2.3+1.4=? Decimal: 0.3+0.4=0.7, Integer: 2+1=3. Sum: 3+0.7=3.7!',
               zh:'2.3+1.4=？小数：0.3+0.4=0.7，整数：2+1=3。和：3+0.7=3.7！' },
        mathSteps:['2.3 + 1.4 = □','소수: 0.3 + 0.4 = 0.7','정수: 2 + 1 = 3','3 + 0.7 = 3.7'],
        result:{ ko:'2.3+1.4=3.7 ✓', en:'2.3+1.4=3.7 ✓', zh:'2.3+1.4=3.7 ✓' },
        book:{ ko:'소수점을 기준으로 왼쪽은 정수 부분, 오른쪽은 소수 부분. 같은 자리끼리 더해요!', en:'Left of decimal = integers, right = decimal fractions. Add like places together!', zh:'小数点左边是整数部分，右边是小数部分。同位相加！' } },
      { tag:{ ko:'② 올림(받아올림)이 있을 때', en:'2) When there\'s carrying', zh:'② 有进位时' },
        head:{ ko:'소수 부분 합이 1 이상이면 올려요', en:'If the decimal sum is 1 or more, carry over', zh:'小数部分之和≥1时需要进位' },
        desc:{ ko:'1.7+2.5=? 소수: 0.7+0.5=1.2 → 1을 올려서 정수부: 1+2+1=4. 답: 4.2!',
               en:'1.7+2.5=? Decimal: 0.7+0.5=1.2 → carry 1 to integers: 1+2+1=4. Answer: 4.2!',
               zh:'1.7+2.5=？小数：0.7+0.5=1.2→进1到整数：1+2+1=4。答案：4.2！' },
        mathSteps:['1.7 + 2.5 = □','소수: 0.7 + 0.5 = 1.2','올림 1 → 정수: 1+2+1=4','4 + 0.2 = 4.2'],
        result:{ ko:'1.7+2.5=4.2 ✓', en:'1.7+2.5=4.2 ✓', zh:'1.7+2.5=4.2 ✓' },
        book:null }
    ],
    rule:{ ko:'① 소수 부분(십분의 자리)끼리 더한다  ② 합이 10 이상이면 정수 자리로 올린다  ③ 정수 부분끼리 더하고 올림 수를 더한다',
      en:'① Add decimal (tenths) parts  ② If ≥10 (i.e. ≥1.0), carry to the integer  ③ Add integers and the carry',
      zh:'①小数（十分位）部分相加 ②若≥10（即≥1.0）则进位到整数位 ③整数部分相加再加进位数' }
  },

  check:{
    fills:[
      { tex:'2.3+1.4: 0.3+0.4=\\square', answer:0.7,
        hint:{ ko:'3+4=7이라서 0.3+0.4=0.7', en:'3+4=7 so 0.3+0.4=0.7', zh:'3+4=7，所以0.3+0.4=0.7' } },
      { tex:'3+0.7=\\square', answer:3.7, hint:{ ko:'3에 0.7을 더해요', en:'3 plus 0.7', zh:'3加0.7' } }
    ],
    open:{ ko:'소수 덧셈에서 소수점 자리를 맞춰야 하는 이유를 설명해봐요.', en:'Explain why you must align decimal points when adding decimals.', zh:'说说小数加法中为什么要对齐小数点。' },
    openHint:{ ko:'소수점 자리를 맞추지 않으면 십분의 자리와 일의 자리를 혼동해서 틀린 답이 나와요.', en:'Without alignment, you\'d add tenths to ones, giving the wrong answer.', zh:'不对齐小数点，十分位和个位就会混淆，得到错误答案。' }
  },

  lab:{ generator:'addDecimal', level:'main', count:4,
    intro:{ ko:'소수점 맞추고 더해요!', en:'Align the decimal point and add!', zh:'对齐小数点再相加！' } },

  arena:{ generator:'addDecimal', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한! 소수 덧셈!', en:'As many as you can! Decimal addition!', zh:'5分钟内尽量多做！小数加法！' } },

  stamp:{ label:{ ko:'소수 덧셈 마법사', en:'Decimal Adder', zh:'小数加法魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'소수 덧셈 성공! 🔵✨',en:'Decimal addition!',zh:'小数加法成功！✨'}, {ko:'소수점 딱 맞췄어!',en:'Decimal aligned!',zh:'小数点对准了！'} ],
    wrong:[ {ko:'소수 부분끼리, 정수 부분끼리 더해봐!',en:'Add decimals with decimals, integers with integers!',zh:'小数加小数，整数加整数！'}, {ko:'소수점 자리를 맞춰야 해!',en:'Align the decimal points!',zh:'要对齐小数点！'} ],
    finish:{ ko:'완벽해! 소수 덧셈 마법사야! 🔵✨', en:"Perfect! You're a decimal adder!", zh:'完美！你是小数加法魔法师！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
