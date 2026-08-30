/* Numbers of Magic — 유닛 B-22: 두 자리 × 한 자리 (올림 없음) (중급 H 챕터2) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-22'] = {
  id:'B-22', tier:'intermediate', level:'B', order:22,
  generator:'ml6_mul2d1dMental',
  title:{ ko:'두 자리 × 한 자리 (올림 없음)', en:'2-Digit × 1-Digit (No Carrying)', zh:'两位数 × 一位数（无进位）' },
  subtitle:{ ko:'쪼개서 각각 곱하면 쉬워요!', en:'Split and multiply each part — easy!', zh:'拆开分别乘，就简单了！' },
  icon:'🔢',

  practice:{
    generator:'ml6_mul2d1dMental', level:'practice', count:5,
    params:{ easy:true },
    intro:{
      ko:'올림이 없는 두 자리 × 한 자리 곱셈을 연습해 볼 거야. 십의 자리와 일의 자리를 따로 곱한 다음 더하면 돼! 준비됐지?',
      en:"Let's practise 2-digit × 1-digit multiplication with no carrying! Multiply the tens and ones separately, then add. Ready?",
      zh:'我们来练习无进位的两位数×一位数！分别乘十位和个位，再相加。准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 올림 없는 두 자리×한 자리', en:'1) 2-Digit × 1-Digit, No Carrying', zh:'① 无进位的两位数×一位数' },
        head:{ ko:'23×3: 깔끔하게 쪼개서 풀어요!', en:'23×3: Split it cleanly!', zh:'23×3：干净利落地拆开算！' },
        desc:{ ko:'23×3을 풀어봐요. 23을 <b>20과 3으로 쪼개서</b> 각각 3을 곱해요. 20×3=60, 3×3=9. 60+9=69! 일의 자리 결과가 9 이하라 올림이 없어요.',
               en:'Solve 23×3. <b>Split 23 into 20 and 3</b>, multiply each by 3. 20×3=60, 3×3=9. 60+9=69! The ones result (9) is small, so no carrying needed.',
               zh:'来算23×3。<b>把23拆成20和3</b>，分别乘以3。20×3=60，3×3=9，60+9=69！个位结果是9，不用进位，很简单！' },
        mathSteps:['23×3','= 20×3 + 3×3','= 60 + 9','= 69'],
        result:{ ko:'20×3=60, 3×3=9. 60+9=69! 올림 없이 깔끔하게 풀렸어요.', en:'20×3=60, 3×3=9. 60+9=69! Solved cleanly with no carrying.', zh:'20×3=60，3×3=9，60+9=69！无进位，干净利落。' },
        book:{ ko:'올림이 없으면 두 부분의 합산이 아주 쉬워요. 십의 자리×한 자리(큰 수)와 일의 자리×한 자리(작은 수)를 각각 계산한 뒤 더하면 끝!', en:'No carrying means adding the two parts is very simple. Compute tens × digit (big part) and ones × digit (small part) separately, then add!', zh:'没有进位，两部分相加非常简单。分别算十位×一位（大数）和个位×一位（小数），加在一起就完成了！' } },

      { tag:{ ko:'② 어떤 경우에 올림이 없나?', en:'2) When Is There No Carrying?', zh:'② 什么情况下没有进位？' },
        head:{ ko:'일의 자리 × 한 자리가 9 이하면 올림 없음!', en:'Ones × digit ≤ 9 means no carrying!', zh:'个位×一位数 ≤ 9，就没有进位！' },
        desc:{ ko:'<b>일의 자리 숫자 × 한 자리 수의 결과가 9 이하</b>면 올림이 생기지 않아요. 21×4를 봐요: 일의 자리 1×4=4. 4는 9 이하니까 올림 없음! 20×4=80, 1×4=4, 80+4=84.',
               en:'<b>If (ones digit) × (1-digit number) ≤ 9</b>, there\'s no carrying. Look at 21×4: ones digit 1×4=4. Since 4 ≤ 9, no carrying! 20×4=80, 1×4=4, 80+4=84.',
               zh:'<b>如果个位数字×一位数 ≤ 9</b>，就不会有进位。看21×4：个位1×4=4，4≤9，无进位！20×4=80，1×4=4，80+4=84。' },
        mathSteps:[{ko:'21×4: 일×4=4 ≤9 (올림×)',en:'21×4: \\text{ones}×4=4 ≤9 \\text{ (no carry)}',zh:'21×4：个位×4=4 ≤9（不进位）'},'= 20×4 + 1×4','= 80 + 4 = 84'],
        result:{ ko:'일×한 자리 ≤ 9이면 올림 없이 바로 더할 수 있어요!', en:'Ones × digit ≤ 9 → add directly, no carrying!', zh:'个位×一位数 ≤ 9，直接相加，无进位！' },
        book:{ ko:'올림 없는 경우를 먼저 연습하면 분배법칙의 흐름을 익히기 좋아요. 일의 자리 결과가 한 자리 수인지 확인하는 습관을 들여요.', en:'Practising no-carrying cases first helps you master the distributive flow. Get in the habit of checking whether the ones result is a single digit.', zh:'先练习无进位的情况，有助于掌握分配律的流程。养成检查个位结果是否是一位数的习惯。' } },

      { tag:{ ko:'③ 속도 높이기', en:'3) Building Speed', zh:'③ 提升速度' },
        head:{ ko:'눈으로 보고 암산해요!', en:'Do it in your head — eyes only!', zh:'眼看心算，练成暗算！' },
        desc:{ ko:'32×3을 눈으로만 풀어봐요. <b>30×3=90</b>은 바로 나오죠? 그다음 <b>2×3=6</b>. 90+6=96! 올림 없을 때는 이렇게 빠르게 암산할 수 있어요.',
               en:'Try 32×3 in your head. <b>30×3=90</b> comes right away, then <b>2×3=6</b>. 90+6=96! With no carrying you can do this almost instantly.',
               zh:'用心算来做32×3。<b>30×3=90</b>立刻就出来了，然后<b>2×3=6</b>，90+6=96！无进位的时候，暗算可以非常快。' },
        mathSteps:['32×3','= 90 + 6',{ko:'= 96 (암산)',en:'= 96 \\text{ (in your head)}',zh:'= 96（心算）'},{ko:'속도가 붙어요!',en:'\\text{you get faster!}',zh:'速度会越来越快！'}],
        result:{ ko:'30×3=90, 2×3=6. 90+6=96! 암산으로 순식간에 끝났어요.', en:'30×3=90, 2×3=6. 90+6=96! Mental arithmetic in a flash.', zh:'30×3=90，2×3=6，90+6=96！暗算瞬间搞定。' },
        book:null }
    ],
    rule:{ ko:'① 두 자리 수를 십의 자리 + 일의 자리로 쪼개요  ② 일×한 자리 결과가 9 이하면 올림 없음  ③ 두 곱을 더하면 답!', en:'① Split the 2-digit number into tens + ones  ② If ones × digit ≤ 9, no carrying  ③ Add the two products for the answer!', zh:'① 把两位数拆成十位+个位  ② 若个位×一位数 ≤ 9，无进位  ③ 两个乘积相加即为答案！' }
  },

  check:{
    fills:[
      { tex:'32 \\times 3 = \\square', answer:96,
        hint:{ ko:'30×3=90, 2×3=6', en:'30×3=90, 2×3=6', zh:'30×3=90, 2×3=6' } },
      { tex:'21 \\times 4 = \\square', answer:84,
        hint:{ ko:'20×4=80, 1×4=4', en:'20×4=80, 1×4=4', zh:'20×4=80, 1×4=4' } }
    ],
    open:{ ko:'올림이 없을 때 분배법칙이 더 쉬운 이유를 설명해봐요. 어떤 두 자리 수와 한 자리 수 조합에서 올림이 생기지 않을까요?', en:'Explain why the distributive law is easier when there\'s no carrying. What 2-digit and 1-digit combinations avoid carrying?', zh:'解释一下为什么没有进位时分配律更简单。哪些两位数和一位数的组合不会产生进位？' },
    openHint:{ ko:'예) 일의 자리가 1이면 어떤 한 자리 수를 곱해도 올림이 없어요! 21×9=20×9+1×9=180+9=189.', en:'e.g. If the ones digit is 1, no carrying happens no matter what 1-digit number you multiply! 21×9=180+9=189.', zh:'例）如果个位是1，无论乘什么一位数都不会进位！21×9=20×9+1×9=180+9=189。' }
  },

  lab:{
    generator:'ml6_mul2d1dMental', level:'main', count:4,
    params:{ easy:true },
    intro:{
      ko:'이제 올림 없는 두 자리 × 한 자리 문제를 풀어봐! 쪼개서 각각 곱하고 더해봐.',
      en:"Now solve 2-digit × 1-digit problems with no carrying! Split, multiply each part, then add.",
      zh:'现在来做无进位的两位数×一位数！拆开分别乘，再相加。'
    }
  },

  arena:{
    generator:'ml6_mul2d1dMental', level:'main', count:8, timeLimit:300,
    params:{ easy:true },
    rule:{ ko:'5분 안에 두 자리 × 한 자리 (올림 없음) 문제를 모두 풀어요!', en:'Solve all 2-digit × 1-digit (no carrying) problems in 5 minutes!', zh:'5分钟内解答所有两位数×一位数（无进位）的题目！' }
  },

  stamp:{ label:{ ko:'분배법칙 견습생', en:'Distributive Apprentice', zh:'分配律学徒' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'분배법칙 마스터! 🌟',en:'Distributive master!',zh:'分配律高手！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해봐 💡',en:'Hmm, try again 💡',zh:'嗯，再试一次 💡'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 두 자리 곱셈 마스터! 🔢✨', en:'Perfect! 2-digit multiplication master!', zh:'完美！两位数乘法达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
