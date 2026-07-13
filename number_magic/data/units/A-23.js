/* Numbers of Magic — 유닛 A-23: 이사시켜 빼기 (초급 F 챕터2) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};
window.NM_UNITS['A-23'] = {
  id:'A-23', tier:'beginner', level:'A', order:23,
  generator:'moveAndSub',
  title:{ ko:'이사시켜 빼기', en:'Move Up & Subtract', zh:'向上凑整再相减' },
  subtitle:{ ko:'두 수에 같은 수를 더해 빼지는 수를 다음 □0으로 올려요', en:'Add the same to both so the minuend rounds up to the next multiple of ten', zh:'两数同加，把被减数向上凑成下一个整十数' },
  icon:'🏠',

  practice:{
    generator:'moveAndSub', level:'practice', count:5,
    intro:{ ko:'빼지는 수를 다음 □0으로 올리는 수를 찾아봐요!', en:'Find what to add to round the minuend up to the next ten!', zh:'找到能把被减数往上凑成整十的数！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 빼지는 수를 위로 □0으로 올려요', en:'1) Round the minuend UP to the next ten', zh:'① 把被减数向上凑成整十数' },
        head:{ ko:'두 수에 d를 더해 빼지는 수가 □0이 되게 해요', en:'Add d to both so the minuend becomes □0', zh:'两数同加d，使被减数变成整十数' },
        desc:{ ko:'73-38=? 에서 73+7=80으로 올려요. 38에도 7을 더해 45. 80-45=35!',
               en:'73-38=? Add 7 to 73 to get 80. Add 7 to 38 too: 45. 80-45=35!',
               zh:'73-38=？73+7=80。38也加7变45。80-45=35！' },
        mathSteps:['73 - 38 = □','73의 다음 □0은 80 → d = 7','73+7=80, 38+7=45','80 - 45 = 35'],
        result:{ ko:'73-38=35 ✓', en:'73-38=35 ✓', zh:'73-38=35 ✓' },
        book:{ ko:'이사(이동)시킨다 = 두 수를 같은 거리만큼 위로 "이사"해서 계산을 쉽게 해요.', en:'"Moving" both numbers up by the same distance makes subtraction easy.', zh:'"搬家"=两个数同时向上移动相同距离，让计算变简单。' } },
      { tag:{ ko:'② A-20(더해서 빼기)와 비교', en:'2) Compare with A-20 (add same, round subtrahend)', zh:'② 与A-20（同加减数）比较' },
        head:{ ko:'A-20은 빼는 수(B)를, A-23은 빼지는 수(A)를 □0으로!', en:'A-20 rounds the subtrahend B; A-23 rounds the minuend A', zh:'A-20让减数B变整十；A-23让被减数A变整十' },
        desc:{ ko:'두 전략 모두 "차는 변하지 않는다"는 원리를 이용해요. 어느 쪽으로 올리면 더 편한지 보고 골라요!',
               en:'Both strategies use the principle "the difference doesn\'t change". Choose whichever is more convenient!',
               zh:'两个策略都利用"差不变"的原理。看哪个方向凑整更方便，就选哪个！' },
        mathSteps:['85 - 57 = □','방법1(A-20): 57+3=60, 85+3=88, 88-60=28','방법2(A-23): 85+5=90, 57+5=62, 90-62=28'],
        result:{ ko:'두 방법 모두 85-57=28 ✓', en:'Both: 85-57=28 ✓', zh:'两种方法都得85-57=28 ✓' },
        book:null }
    ],
    rule:{ ko:'① 빼지는 수(A)의 다음 □0까지의 거리 d를 구한다  ② A+d=□0, B+d 계산  ③ (A+d)-(B+d) = 답',
      en:'① d = distance from A to the next multiple of 10  ② Compute A+d and B+d  ③ (A+d)-(B+d) = answer',
      zh:'①d=被减数A到下一个整十数的距离 ②算A+d和B+d ③(A+d)-(B+d)=答案' }
  },

  check:{
    fills:[
      { tex:'73-38: 73+\\square=80', answer:7, hint:{ ko:'73에서 80까지 몇이에요?', en:'How far from 73 to 80?', zh:'从73到80差多少？' } },
      { tex:'80-45=\\square', answer:35, hint:{ ko:'8-4=4, 0-5→빌려서 30+5=35', en:'80-45=35', zh:'80-45=35' } }
    ],
    open:{ ko:'이사시켜 빼기(A-23)와 같은수 빼서 빼기(A-21)의 차이점을 설명해봐요.', en:'Explain the difference between A-23 (move up) and A-21 (subtract same to round down minuend).', zh:'说说A-23（向上凑整）和A-21（向下凑整）有什么不同。' },
    openHint:{ ko:'A-21은 빼지는 수를 아래로(d를 빼서), A-23은 위로(d를 더해서) □0으로 만들어요.', en:'A-21 rounds the minuend DOWN (subtracts d); A-23 rounds it UP (adds d).', zh:'A-21把被减数向下降（减d），A-23向上升（加d）。' }
  },

  lab:{ generator:'moveAndSub', level:'main', count:4,
    intro:{ ko:'이사 마법! 두 수를 위로 올려봐요!', en:'Moving magic! Shift both numbers up!', zh:'搬家魔法！把两数一起向上移！' } },

  arena:{ generator:'moveAndSub', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한! 다음 □0으로 이사!', en:'As many as you can! Move up to the next ten!', zh:'5分钟内尽量多做！向上凑整十！' } },

  stamp:{ label:{ ko:'이사시켜 빼기 마법사', en:'Move-Up Subtractor', zh:'向上凑整魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'이사 성공! 🏠✨',en:'Moved up! ✨',zh:'搬家成功！✨'}, {ko:'□0으로 올라갔어!',en:'Rounded up to ten!',zh:'凑成整十了！'} ],
    wrong:[ {ko:'빼지는 수를 위의 □0으로 올려봐!',en:'Round the minuend UP to the next ten!',zh:'把被减数向上凑整十！'}, {ko:'d를 두 수에 모두 더했어?',en:'Did you add d to BOTH numbers?',zh:'两个数都加d了吗？'} ],
    finish:{ ko:'완벽해! 이사시켜 빼기 마법사야! 🏠✨', en:"Perfect! You're a move-up subtractor!", zh:'完美！你是向上凑整魔法师！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
