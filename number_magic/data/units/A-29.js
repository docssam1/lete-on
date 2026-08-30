/* Numbers of Magic — 유닛 A-29: 10에서 부족한 수 (초급 G 챕터4) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};
window.NM_UNITS['A-29'] = {
  id:'A-29', tier:'beginner', level:'A', order:29,
  generator:'deficientFrom10',
  title:{ ko:'10에서 부족한 수', en:'Deficiency from 10', zh:'与10的差' },
  subtitle:{ ko:'빼는 수가 □0에서 얼마나 부족한지로 뺄셈을 계산해요', en:'Use how far the subtrahend falls short of □0 to compute the subtraction', zh:'用减数距整十数的差来计算减法' },
  icon:'🎯',

  practice:{
    generator:'deficientFrom10', level:'practice', count:5,
    intro:{ ko:'빼는 수가 10에서 얼마나 부족한지 찾아봐요!', en:'Find how far the subtrahend falls short of 10!', zh:'找出减数距10差多少！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 부족한 만큼 더 빼요', en:'1) The deficit becomes an extra subtraction', zh:'① 差多少就多减多少' },
        head:{ ko:'A - (□0 - d) = A - □0 + d', en:'A − (□0 − d) = A − □0 + d', zh:'A−(□0-d)=A-□0+d' },
        desc:{ ko:'53-8=? 8은 10보다 2 부족. 53-10=-이 아니라 53-10+2=45!',
               en:'53−8=? 8 falls 2 short of 10. So 53−10+2=45!',
               zh:'53-8=？8比10少2。所以53-10+2=45！' },
        mathSteps:['53 - 8 = □',{ko:'8 = 10 - 2  (부족한 수: 2)',en:'8 = 10 - 2 \\text{ (short by 2)}',zh:'8 = 10 - 2（还差2）'},'53 - 10 = 43','43 + 2 = 45'],
        result:{ ko:'53-8=45 ✓', en:'53−8=45 ✓', zh:'53-8=45 ✓' },
        book:{ ko:'빼는 수가 10에서 d만큼 부족하면, □0을 빼고 나서 d를 다시 더해요.', en:'If the subtrahend is d short of 10, subtract □0 then add d back.', zh:'如果减数比10少d，就先减整十数，再加回d。' } },
      { tag:{ ko:'② □0 단위도 같은 방법으로', en:'2) Same method for other round tens', zh:'② 其他整十数也用同样方法' },
        head:{ ko:'28, 38, 48도 □0보다 2 부족해요', en:'28, 38, 48 are all 2 short of their □0', zh:'28、38、48都比各自的整十数少2' },
        desc:{ ko:'75-28=? 28은 30보다 2 부족. 75-30+2=47!',
               en:'75−28=? 28 is 2 short of 30. 75−30+2=47!',
               zh:'75-28=？28比30少2。75-30+2=47！' },
        mathSteps:['75 - 28 = □',{ko:'28 = 30 - 2  (부족한 수: 2)',en:'28 = 30 - 2 \\text{ (short by 2)}',zh:'28 = 30 - 2（还差2）'},'75 - 30 = 45','45 + 2 = 47'],
        result:{ ko:'75-28=47 ✓', en:'75−28=47 ✓', zh:'75-28=47 ✓' },
        book:null }
    ],
    rule:{ ko:'① 빼는 수가 가까운 □0에서 d만큼 부족하다  ② A - □0 계산  ③ 결과에 d를 더한다',
      en:'① Subtrahend is d short of nearest □0  ② Compute A − □0  ③ Add d to the result',
      zh:'①减数比最近整十数少d ②算A-□0 ③结果再加d' }
  },

  check:{
    fills:[
      { tex:'53-8: 8=10-\\square', answer:2,
        hint:{ ko:'10-8=2, 부족한 수는 2', en:'10−8=2, deficit is 2', zh:'10-8=2，差2' } },
      { tex:'53-10+2=\\square', answer:45, hint:{ ko:'43+2=45', en:'43+2=45', zh:'43+2=45' } }
    ],
    open:{ ko:'빼는 수가 □0보다 d 부족할 때 □0을 빼고 d를 더하는 이유를 설명해봐요.', en:'Explain why you subtract □0 then add d when the subtrahend is d short of □0.', zh:'说说为什么减数比□0少d时，先减□0再加d。' },
    openHint:{ ko:'A-(□0-d) = A-□0+d. 괄호를 풀면 빼기가 더하기로 바뀌어요.', en:'A−(□0−d) = A−□0+d. Expanding the brackets flips the sign of d.', zh:'A-(□0-d)=A-□0+d。展开括号后，d的符号变了。' }
  },

  lab:{ generator:'deficientFrom10', level:'main', count:4,
    intro:{ ko:'부족한 수 마법! □0 빼고 d 더해요!', en:'Deficiency magic! Subtract □0 then add d!', zh:'不足数魔法！减□0再加d！' } },

  arena:{ generator:'deficientFrom10', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한! □0 빼고 부족한 수 더해!', en:'As many as you can! Subtract □0, add the deficit!', zh:'5分钟内尽量多做！减□0，加差值！' } },

  stamp:{ label:{ ko:'부족수 마법사', en:'Deficit Wizard', zh:'不足数魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'부족한 수 찾기 성공! 🎯✨',en:'Found the deficit!',zh:'找到差值！✨'}, {ko:'□0 빼고 d 더하기 완성!',en:'−□0+d perfect!',zh:'−□0+d完成！'} ],
    wrong:[ {ko:'빼는 수가 □0에서 얼마나 부족한지 찾아봐!',en:'Find how far the subtrahend is from □0!',zh:'找减数距整十数差多少！'}, {ko:'□0 빼고 부족한 수를 더해야 해!',en:'Subtract □0 then add the deficit!',zh:'减□0再加不足数！'} ],
    finish:{ ko:'완벽해! 부족수 마법사야! 🎯✨', en:"Perfect! You're a deficit wizard!", zh:'完美！你是不足数魔法师！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
