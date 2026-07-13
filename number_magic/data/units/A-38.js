/* Numbers of Magic — 유닛 A-38: 소수를 더하고 빼기 (초급 I 챕터4) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};
window.NM_UNITS['A-38'] = {
  id:'A-38', tier:'beginner', level:'A', order:38,
  generator:'addSubDecimal',
  title:{ ko:'소수를 더하고 빼기', en:'Adding and Subtracting Decimals', zh:'小数加减混合' },
  subtitle:{ ko:'소수가 섞인 혼합 계산도 소수점을 맞추면 끝!', en:'Mixed decimal calculations: just align the decimal point!', zh:'混合小数计算：对齐小数点就搞定！' },
  icon:'🟣',

  practice:{
    generator:'addSubDecimal', level:'practice', count:5,
    intro:{ ko:'소수 더하기와 빼기를 섞어 연습해요!', en:'Practice mixed decimal addition and subtraction!', zh:'练习小数加减混合运算！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 소수 혼합 계산 순서', en:'1) Order of operations in mixed decimal calculations', zh:'① 小数混合运算的顺序' },
        head:{ ko:'왼쪽부터 차례로, 소수점을 항상 맞춰요', en:'Left to right, always aligning the decimal point', zh:'从左到右，始终对齐小数点' },
        desc:{ ko:'3.5+1.2-0.8=? 3.5+1.2=4.7, 그 다음 4.7-0.8=3.9!',
               en:'3.5+1.2−0.8=? First 3.5+1.2=4.7, then 4.7−0.8=3.9!',
               zh:'3.5+1.2-0.8=？先3.5+1.2=4.7，再4.7-0.8=3.9！' },
        mathSteps:['3.5 + 1.2 - 0.8 = □','3.5 + 1.2 = 4.7','4.7 - 0.8 = 3.9'],
        result:{ ko:'3.5+1.2-0.8=3.9 ✓', en:'3.5+1.2−0.8=3.9 ✓', zh:'3.5+1.2-0.8=3.9 ✓' },
        book:{ ko:'소수 혼합 계산도 자연수처럼 왼쪽부터 차례로 계산해요. 소수점만 맞추면 규칙은 같아요!', en:'Mixed decimal calculations follow the same left-to-right rule as integers. Just align the decimal!', zh:'小数混合运算和整数一样从左到右算。只要对齐小数点，规则相同！' } },
      { tag:{ ko:'② 덧셈끼리 먼저 묶어도 돼요', en:'2) You can group additions together', zh:'② 也可以先把加法归组' },
        head:{ ko:'A+B-C = (A+B)-C, 또는 A+(B-C)', en:'A+B−C = (A+B)−C, or A+(B−C)', zh:'A+B-C=(A+B)-C，或A+(B-C)' },
        desc:{ ko:'2.4+0.9-1.3=? 방법1: 2.4+0.9=3.3, 3.3-1.3=2.0. 방법2: 0.9-1.3 먼저 안 됨 → 2.4+(0.9-1.3)=-0.4+2.4=2.0!',
               en:'2.4+0.9−1.3=? Method 1: 2.4+0.9=3.3, 3.3−1.3=2.0. Both give 2.0!',
               zh:'2.4+0.9-1.3=？方法1：2.4+0.9=3.3，3.3-1.3=2.0。两种方法都得2.0！' },
        mathSteps:['2.4 + 0.9 - 1.3 = □','2.4 + 0.9 = 3.3','3.3 - 1.3 = 2.0'],
        result:{ ko:'2.4+0.9-1.3=2.0 ✓', en:'2.4+0.9−1.3=2.0 ✓', zh:'2.4+0.9-1.3=2.0 ✓' },
        book:null }
    ],
    rule:{ ko:'① 소수점을 항상 맞춘다  ② 왼쪽부터 차례로 더하거나 뺀다  ③ 각 단계에서 소수 부분의 올림/받아내림에 주의',
      en:'① Always align decimal points  ② Compute left to right  ③ Watch for carrying/borrowing at each step',
      zh:'①始终对齐小数点 ②从左到右依次计算 ③每步注意进位/借位' }
  },

  check:{
    fills:[
      { tex:'3.5+1.2-0.8: 3.5+1.2=\\square', answer:4.7,
        hint:{ ko:'0.5+0.2=0.7, 3+1=4, → 4.7', en:'0.5+0.2=0.7, 3+1=4: 4.7', zh:'0.5+0.2=0.7，3+1=4：4.7' } },
      { tex:'4.7-0.8=\\square', answer:3.9, hint:{ ko:'0.7-0.8 → 빌림: 1.7-0.8=0.9, 4-1=3 → 3.9', en:'Borrow: 1.7−0.8=0.9, 4−1=3: 3.9', zh:'借位：1.7-0.8=0.9，4-1=3：3.9' } }
    ],
    open:{ ko:'소수 혼합 계산에서 소수점 자리를 맞추는 것이 왜 중요한지 예를 들어 설명해봐요.', en:'Give an example to show why aligning decimal points is crucial in mixed decimal calculations.', zh:'举例说明为什么在小数混合运算中对齐小数点很重要。' },
    openHint:{ ko:'소수점을 맞추지 않으면 일의 자리를 십분의 자리로 착각해서 값이 10배 차이 날 수 있어요.', en:'Without alignment, you might confuse ones with tenths — a factor-of-10 error.', zh:'不对齐小数点，可能把个位当十分位，结果差10倍。' }
  },

  lab:{ generator:'addSubDecimal', level:'main', count:4,
    intro:{ ko:'소수 더하고 빼기 혼합 마법!', en:'Mixed decimal add-and-subtract magic!', zh:'小数加减混合魔法！' } },

  arena:{ generator:'addSubDecimal', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한! 소수 혼합 계산!', en:'As many as you can! Mixed decimal calculations!', zh:'5分钟内尽量多做！小数加减混合！' } },

  stamp:{ label:{ ko:'소수혼합 마법사', en:'Decimal Mix Wizard', zh:'小数混合魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'소수 혼합 완성! 🟣✨',en:'Decimal mix done!',zh:'小数混合完成！✨'}, {ko:'소수점 맞추기 성공!',en:'Decimals aligned!',zh:'小数点对准了！'} ],
    wrong:[ {ko:'소수점을 먼저 맞추고 계산해봐!',en:'Align the decimal point first!',zh:'先对齐小数点再计算！'}, {ko:'왼쪽부터 차례로 계산해야 해!',en:'Calculate left to right!',zh:'从左到右依次计算！'} ],
    finish:{ ko:'완벽해! 소수혼합 마법사야! 🟣✨', en:"Perfect! You're a decimal mix wizard!", zh:'完美！你是小数混合魔法师！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
