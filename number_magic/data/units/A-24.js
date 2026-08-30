/* Numbers of Magic — 유닛 A-24: 크기가 비슷한 수 더하기 (초급 F 챕터3) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};
window.NM_UNITS['A-24'] = {
  id:'A-24', tier:'beginner', level:'A', order:24,
  generator:'addSimilarNums',
  title:{ ko:'크기가 비슷한 수 더하기', en:'Add Numbers of Similar Size', zh:'相近数相加' },
  subtitle:{ ko:'두 수가 같은 □0에 가까우면 □0+□0으로 먼저 계산해요', en:'When both numbers are close to the same round ten, compute □0+□0 first', zh:'两数都接近同一个整十数时，先算整十+整十' },
  icon:'⚖️',

  practice:{
    generator:'addSimilarNums', level:'practice', count:5,
    intro:{ ko:'수를 가장 가까운 □0으로 어림하는 연습이에요!', en:'Practice rounding to the nearest ten!', zh:'练习把数字四舍五入到最近的整十数！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 두 수를 같은 □0으로 어림해요', en:'1) Round both numbers to the same ten', zh:'① 把两数都四舍五入到同一个整十数' },
        head:{ ko:'비슷한 수 둘을 □0+□0으로 먼저!', en:'For two similar numbers, compute □0+□0 first!', zh:'两个相近数先算整十+整十！' },
        desc:{ ko:'48+53=? 두 수 모두 50 근처! 50+50=100으로 어림하고, 차이(-2+3=+1)를 보정해요. 100+1=101!',
               en:'48+53=? Both near 50! Estimate 50+50=100, then correct for the differences (-2+3=+1). 100+1=101!',
               zh:'48+53=？两数都接近50！先算50+50=100，再调整偏差（-2+3=+1）。100+1=101！' },
        mathSteps:['48 + 53 = □',{ko:'48 ≈ 50 (차이 -2), 53 ≈ 50 (차이 +3)',en:'48 ≈ 50 \\text{ (diff } -2), 53 ≈ 50 \\text{ (diff } +3)',zh:'48 ≈ 50（差-2），53 ≈ 50（差+3）'},'50 + 50 = 100','100 + (-2 + 3) = 100 + 1 = 101'],
        result:{ ko:'48+53=101 ✓', en:'48+53=101 ✓', zh:'48+53=101 ✓' },
        book:{ ko:'어림값으로 큰 그림을 잡은 뒤, 실제 차이를 더하거나 빼서 정확히 맞춰요.', en:'Get the big picture with the estimate, then fine-tune with the actual differences.', zh:'先用估算掌握大局，再用实际偏差精确调整。' } },
      { tag:{ ko:'② 오차(차이)를 보정해요', en:'2) Correct for the differences', zh:'② 调整偏差' },
        head:{ ko:'어림값과 실제 값의 차이를 더하거나 빼요', en:'Add or subtract the difference between estimate and actual', zh:'加减估算值与实际值的差' },
        desc:{ ko:'29+31=? 두 수 모두 30 근처. 30+30=60. 차이: -1+1=0. 60+0=60!',
               en:'29+31=? Both near 30. 30+30=60. Differences: -1+1=0. 60+0=60!',
               zh:'29+31=？两数都接近30。30+30=60。偏差：-1+1=0。60+0=60！' },
        mathSteps:['29 + 31 = □',{ko:'29 ≈ 30 (차이 -1), 31 ≈ 30 (차이 +1)',en:'29 ≈ 30 \\text{ (diff } -1), 31 ≈ 30 \\text{ (diff } +1)',zh:'29 ≈ 30（差-1），31 ≈ 30（差+1）'},'30 + 30 = 60','60 + (-1+1) = 60 + 0 = 60'],
        result:{ ko:'29+31=60 ✓', en:'29+31=60 ✓', zh:'29+31=60 ✓' },
        book:null }
    ],
    rule:{ ko:'① 두 수를 가장 가까운 같은 □0으로 어림  ② □0+□0 계산  ③ 각 오차(실제-어림)를 더해 보정',
      en:'① Round both to the same nearest □0  ② Compute □0+□0  ③ Add each difference (actual - estimate) to correct',
      zh:'①把两数四舍五入到同一个最近整十数 ②算整十+整十 ③加上各偏差（实际-估算）修正' }
  },

  check:{
    fills:[
      { tex:'48+53: 50+50=\\square', answer:100, hint:{ ko:'50+50=?', en:'50+50=?', zh:'50+50=？' } },
      { tex:'100+(-2+3)=\\square', answer:101, hint:{ ko:'오차 합: -2+3=1, 100+1=101', en:'Net difference: -2+3=1, so 100+1=101', zh:'偏差合计：-2+3=1，100+1=101' } }
    ],
    open:{ ko:'비슷한 수 두 개를 더할 때 □0+□0으로 어림하면 왜 편리한지 설명해봐요.', en:'Explain why estimating as □0+□0 is convenient when adding two similar numbers.', zh:'说说为什么两个相近数相加时，用整十+整十估算很方便。' },
    openHint:{ ko:'□0+□0은 머릿속에서 빠르게 계산되고, 작은 오차는 그 다음에 쉽게 보정할 수 있어요.', en:'□0+□0 is computed instantly in your head, and the small adjustment is easy to add.', zh:'整十+整十在脑子里飞速算出，再做小小的调整就好了。' }
  },

  lab:{ generator:'addSimilarNums', level:'main', count:4,
    intro:{ ko:'두 수가 비슷하면 □0+□0 전략!', en:'Similar sizes? Use the □0+□0 strategy!', zh:'两数相近？用整十+整十策略！' } },

  arena:{ generator:'addSimilarNums', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한! 어림 후 보정!', en:'As many as you can! Estimate then correct!', zh:'5分钟内尽量多做！先估算再调整！' } },

  stamp:{ label:{ ko:'비슷한수 더하기 마법사', en:'Similar-Number Adder', zh:'相近数相加魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'보정까지 완벽! ⚖️✨',en:'Correction perfect!',zh:'调整完美！✨'}, {ko:'어림 + 보정 성공!',en:'Estimate + correct!',zh:'估算+调整成功！'} ],
    wrong:[ {ko:'두 수 모두 어림하고, 오차도 더해봐!',en:'Round both, then add the differences!',zh:'两数都要四舍五入，偏差也要加上！'}, {ko:'□0+□0부터 시작해봐!',en:'Start with □0+□0!',zh:'从整十+整十开始！'} ],
    finish:{ ko:'완벽해! 비슷한 수 더하기 마법사야! ⚖️✨', en:"Perfect! You're a similar-number adder!", zh:'完美！你是相近数相加魔法师！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
