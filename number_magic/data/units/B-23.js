/* Numbers of Magic — 유닛 B-23: 두 자리 × 한 자리 (올림 있음) (중급 H 챕터3) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-23'] = {
  id:'B-23', tier:'intermediate', level:'B', order:23,
  generator:'ml6_mul2d1dMental',
  title:{ ko:'두 자리 × 한 자리 (올림!)', en:'2-Digit × 1-Digit (With Carrying!)', zh:'两位数 × 一位数（有进位！）' },
  subtitle:{ ko:'올림이 있어도 분배법칙은 같아요!', en:'Even with carrying, the method stays the same!', zh:'有进位也用分配律，方法一样！' },
  icon:'⬆️',

  practice:{
    generator:'ml6_mul2d1dMental', level:'practice', count:5,
    params:{ easy:false },
    intro:{
      ko:'올림이 있는 두 자리 × 한 자리 곱셈을 연습해 볼 거야. 분배법칙으로 쪼개서 두 부분을 더하면 올림도 걱정 없어! 준비됐지?',
      en:"Let's practise 2-digit × 1-digit with carrying! The distributive law handles it — split into two parts and add. No need to worry about carrying. Ready?",
      zh:'我们来练习有进位的两位数×一位数！用分配律拆成两部分相加，进位也不怕！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 올림이 생기는 경우', en:'1) When Carrying Happens', zh:'① 什么时候会产生进位' },
        head:{ ko:'26×4: 일의 자리에서 올림이 생겨요!', en:'26×4: The ones digit causes a carry!', zh:'26×4：个位产生了进位！' },
        desc:{ ko:'26×4를 풀어봐요. 26을 <b>20과 6으로 쪼개서</b> 각각 4를 곱해요. 6×4=24! 24는 두 자리 수라서 십의 자리로 20이 올라가요. 하지만 분배법칙을 쓰면 그냥 더하면 돼요.',
               en:'Solve 26×4. <b>Split 26 into 20 and 6</b>, then multiply each by 4. 6×4=24! Since 24 is two digits, it carries into the tens — but with the distributive law you just add the two parts directly.',
               zh:'来算26×4。<b>把26拆成20和6</b>，分别乘以4。6×4=24！24是两位数，会向十位进位，但用分配律只需直接把两部分相加就好。' },
        mathSteps:['26×4','= 20×4 + 6×4','= 80 + 24','= 80+24=104'],
        result:{ ko:'20×4=80, 6×4=24. 80+24=104! 올림을 따로 신경 쓸 필요 없어요.', en:'20×4=80, 6×4=24. 80+24=104! No need to track carrying separately.', zh:'20×4=80，6×4=24。80+24=104！不用单独处理进位。' },
        book:{ ko:'분배법칙을 쓰면 올림이 있어도 두 부분의 합만 구하면 돼요. 올림을 따로 기억할 필요가 없어서 실수가 줄어요!', en:'With the distributive law, even when carrying occurs you just add two simple products. No need to remember a carry separately — fewer mistakes!', zh:'用分配律，即使有进位，也只需把两个乘积相加。不用单独记住进位，减少失误！' } },

      { tag:{ ko:'② 올림을 포함한 계산', en:'2) Calculating With Carrying', zh:'② 包含进位的计算' },
        head:{ ko:'38×5: 올림이 있어도 두 부분의 합!', en:'38×5: Still just two parts added together!', zh:'38×5：有进位也只是两部分相加！' },
        desc:{ ko:'38×5를 풀어봐요. 38을 <b>30과 8로 쪼개서</b> 각각 5를 곱해요. 30×5=150, 8×5=40. 두 결과를 더하면 150+40=190! 올림이 있어도 방법은 똑같아요.',
               en:'Solve 38×5. <b>Split 38 into 30 and 8</b>, then multiply each by 5. 30×5=150, 8×5=40. Add them: 150+40=190! Same method even with carrying.',
               zh:'来算38×5。<b>把38拆成30和8</b>，分别乘以5。30×5=150，8×5=40，相加：150+40=190！有进位方法也一样。' },
        mathSteps:['38×5','= 30×5 + 8×5','= 150 + 40','= 190'],
        result:{ ko:'30×5=150, 8×5=40. 150+40=190! 올림 걱정 없이 계산했어요.', en:'30×5=150, 8×5=40. 150+40=190! Calculated without worrying about carrying.', zh:'30×5=150，8×5=40，150+40=190！完全不用担心进位。' },
        book:{ ko:'일의 자리×한 자리 결과가 두 자리 수가 되더라도 괜찮아요. 십의 자리×한 자리 결과와 그냥 더하면 올림이 자동으로 해결돼요!', en:'Even if ones × digit gives a two-digit result, that\'s fine. Just add it to the tens × digit result and the carry takes care of itself!', zh:'即使个位×一位数的结果是两位数也没关系。直接和十位×一位数的结果相加，进位自然就解决了！' } },

      { tag:{ ko:'③ 올림 포함 암산 전략', en:'3) Mental Arithmetic With Carrying', zh:'③ 含进位的暗算策略' },
        head:{ ko:'47×6: 올림 걱정 없이 더하면 끝!', en:'47×6: Just add — no carrying to worry about!', zh:'47×6：直接加，不用担心进位！' },
        desc:{ ko:'47×6을 암산해봐요. 47을 <b>40과 7로 쪼개서</b> 각각 6을 곱해요. 40×6=240, 7×6=42. 240+42=282! 일의 자리 결과(42)가 두 자리여도 그냥 더하면 돼요.',
               en:'Work out 47×6 mentally. <b>Split 47 into 40 and 7</b>, then multiply each by 6. 40×6=240, 7×6=42. 240+42=282! Even though the ones result (42) is two digits, just add it on.',
               zh:'心算47×6。<b>把47拆成40和7</b>，分别乘以6。40×6=240，7×6=42，240+42=282！个位结果（42）是两位数也没关系，直接加就行。' },
        mathSteps:['47×6','= 40×6 + 7×6','= 240 + 42','= 282'],
        result:{ ko:'40×6=240, 7×6=42. 240+42=282! 올림이 있어도 암산으로 빠르게 풀렸어요.', en:'40×6=240, 7×6=42. 240+42=282! Even with carrying, solved quickly in your head.', zh:'40×6=240，7×6=42，240+42=282！有进位也能快速暗算。' },
        book:null }
    ],
    rule:{ ko:'① 두 자리 수를 십의 자리 + 일의 자리로 쪼개요  ② 각 부분에 한 자리 수를 곱해요  ③ 일의 자리 결과가 두 자리여도 그냥 더하면 끝!', en:'① Split the 2-digit number into tens + ones  ② Multiply each part by the 1-digit number  ③ Even if the ones result is two digits, just add — done!', zh:'① 把两位数拆成十位+个位  ② 分别乘以一位数  ③ 即使个位结果是两位数，直接相加就完成了！' }
  },

  check:{
    fills:[
      { tex:'26 \\times 4 = \\square', answer:104,
        hint:{ ko:'20×4=80, 6×4=24', en:'20×4=80, 6×4=24', zh:'20×4=80, 6×4=24' } },
      { tex:'38 \\times 5 = \\square', answer:190,
        hint:{ ko:'30×5=150, 8×5=40', en:'30×5=150, 8×5=40', zh:'30×5=150, 8×5=40' } }
    ],
    open:{ ko:'올림이 있을 때 분배법칙이 왜 편리한지 설명해봐요. 필산(세로셈)과 어떻게 다른가요?', en:'Explain why the distributive law is helpful even when carrying occurs. How does it compare to the column method?', zh:'解释一下为什么有进位时分配律仍然方便。它和竖式计算有什么不同？' },
    openHint:{ ko:'예) 47×6: 필산은 올림을 기억해야 하지만 분배법칙은 40×6=240, 7×6=42, 240+42=282로 올림 없이 풀 수 있어요!', en:'e.g. 47×6: column method needs you to remember the carry, but the distributive law gives 40×6=240, 7×6=42, 240+42=282 — no carry to track!', zh:'例）47×6：竖式需要记住进位，但分配律只需40×6=240，7×6=42，240+42=282——无需追踪进位！' }
  },

  lab:{
    generator:'ml6_mul2d1dMental', level:'main', count:4,
    params:{ easy:false },
    intro:{
      ko:'이제 올림이 있는 두 자리 × 한 자리 문제를 풀어봐! 분배법칙으로 쪼개면 올림도 걱정 없어.',
      en:"Now tackle 2-digit × 1-digit problems with carrying! The distributive law handles it — no carrying worries.",
      zh:'现在来做有进位的两位数×一位数！用分配律拆开，进位完全不用担心。'
    }
  },

  arena:{
    generator:'ml6_mul2d1dMental', level:'main', count:8, timeLimit:300,
    params:{ easy:false },
    rule:{ ko:'5분 안에 두 자리 × 한 자리 (올림 포함) 문제를 모두 풀어요!', en:'Solve all 2-digit × 1-digit (with carrying) problems in 5 minutes!', zh:'5分钟内解答所有两位数×一位数（含进位）的题目！' }
  },

  stamp:{ label:{ ko:'분배법칙 마스터', en:'Distributive Law Master', zh:'分配律达人' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'분배법칙 마스터! 🌟',en:'Distributive master!',zh:'分配律高手！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해봐 💡',en:'Hmm, try again 💡',zh:'嗯，再试一次 💡'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 올림까지 마스터야! ⬆️✨', en:'Perfect! Even carrying — mastered!', zh:'完美！进位也掌握了！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
