/* Numbers of Magic — 유닛 A-30: 앞부터 빼기 (초급 H 챕터1) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};
window.NM_UNITS['A-30'] = {
  id:'A-30', tier:'beginner', level:'A', order:30,
  generator:'subFromFront',
  title:{ ko:'앞부터 빼기', en:'Subtract from the Front', zh:'从前往后减' },
  subtitle:{ ko:'높은 자리수부터 차례로 빼서 결과를 누적해요', en:'Subtract digit by digit from the highest place value, accumulating the result', zh:'从最高位开始逐位相减，累积结果' },
  icon:'⬅️',

  practice:{
    generator:'subFromFront', level:'practice', count:5,
    intro:{ ko:'백의 자리부터 먼저 빼는 연습이에요!', en:'Practice subtracting hundreds first!', zh:'练习先减百位！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 높은 자리부터 차례로 빼요', en:'1) Subtract from the highest place first', zh:'① 从最高位开始依次减' },
        head:{ ko:'백 → 십 → 일 순서로 빼요', en:'Hundreds → Tens → Ones', zh:'百位→十位→个位，依次相减' },
        desc:{ ko:'563-241=? 먼저 500-200=300, 그 다음 300+60-40=320, 마지막 320+3-1=322!',
               en:'563−241=? First 500−200=300, then 300+60−40=320, last 320+3−1=322!',
               zh:'563-241=？先500-200=300，再300+60-40=320，最后320+3-1=322！' },
        mathSteps:['563 - 241 = □','500 - 200 = 300','300 + 60 - 40 = 320','320 + 3 - 1 = 322'],
        result:{ ko:'563-241=322 ✓', en:'563−241=322 ✓', zh:'563-241=322 ✓' },
        book:{ ko:'높은 자리부터 빼면 중간 결과가 점점 정확해져요. 낮은 자리로 내려갈수록 조정이 줄어요.', en:'Subtracting from high to low makes each intermediate result more accurate.', zh:'从高位减起，中间结果越来越准确，到低位时调整越来越小。' } },
      { tag:{ ko:'② 받아내림이 있을 때는 조금 더 신중하게', en:'2) Be careful with borrowing', zh:'② 有借位时更要小心' },
        head:{ ko:'낮은 자리에서 빼기가 안 되면 위 자리에서 빌려요', en:'If a lower digit is too small, borrow from above', zh:'低位不够减时从上位借' },
        desc:{ ko:'732-358=? 100대: 700-300=400. 400+30-50=-20+400=380. 380+2-8=-6+380=374!',
               en:'732−358=? Hundreds: 700−300=400. Tens: 400+30−50=380. Ones: 380+2−8=374!',
               zh:'732-358=？百位：700-300=400。十位：400+30-50=380。个位：380+2-8=374！' },
        mathSteps:['732 - 358 = □','700 - 300 = 400','400 + 30 - 50 = 380','380 + 2 - 8 = 374'],
        result:{ ko:'732-358=374 ✓', en:'732−358=374 ✓', zh:'732-358=374 ✓' },
        book:null }
    ],
    rule:{ ko:'① 백의 자리 빼기  ② (결과)+십의 자리 빼기  ③ (결과)+일의 자리 빼기',
      en:'① Subtract hundreds  ② (result)+tens digits  ③ (result)+ones digits',
      zh:'①减百位 ②（结果）再减十位 ③（结果）再减个位' }
  },

  check:{
    fills:[
      { tex:'563-241: 500-200=\\square', answer:300,
        hint:{ ko:'5-2=3이라서 500-200=300', en:'5−2=3 so 500−200=300', zh:'5-2=3，所以500-200=300' } },
      { tex:'320+3-1=\\square', answer:322, hint:{ ko:'323-1=322', en:'323−1=322', zh:'323-1=322' } }
    ],
    open:{ ko:'앞부터 빼기와 세로셈(자리맞춤 뺄셈) 방법을 비교해봐요.', en:'Compare "subtract from the front" with the standard column subtraction method.', zh:'比较"从前往后减"和竖式减法。' },
    openHint:{ ko:'앞부터 빼기는 머릿속에서 순서대로, 세로셈은 오른쪽부터. 상황에 따라 편한 쪽을 써요.', en:'"Front to back" goes left to right mentally; column subtraction goes right to left on paper. Use whichever fits.', zh:'"从前往后"在脑子里从左到右；竖式从右到左写在纸上。根据情况选择。' }
  },

  lab:{ generator:'subFromFront', level:'main', count:4,
    intro:{ ko:'앞자리부터 차례로! 빼기 마법!', en:'Subtract place by place, highest first!', zh:'从最高位开始，逐位相减！' } },

  arena:{ generator:'subFromFront', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한! 앞부터 빼기!', en:'As many as you can! Subtract from the front!', zh:'5分钟内尽量多做！从前往后减！' } },

  stamp:{ label:{ ko:'앞부터 빼기 마법사', en:'Front-Sub Wizard', zh:'从前减法魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'앞부터 빼기 성공! ⬅️✨',en:'Front subtraction!',zh:'从前减法成功！✨'}, {ko:'높은 자리부터 딱!',en:'High place first!',zh:'从高位开始，漂亮！'} ],
    wrong:[ {ko:'높은 자리(백)부터 시작해봐!',en:'Start from the highest place (hundreds)!',zh:'从最高位（百位）开始！'}, {ko:'백→십→일 순서로!',en:'Hundreds → Tens → Ones!',zh:'百位→十位→个位！'} ],
    finish:{ ko:'완벽해! 앞부터 빼기 마법사야! ⬅️✨', en:"Perfect! You're a front-sub wizard!", zh:'完美！你是从前减法魔法师！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
