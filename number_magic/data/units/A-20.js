/* Numbers of Magic — 유닛 A-20: 같은 수 더해서 빼기 (초급 E 챕터4) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};
window.NM_UNITS['A-20'] = {
  id:'A-20', tier:'beginner', level:'A', order:20,
  generator:'addSameSub',
  title:{ ko:'같은 수 더해서 빼기', en:'Add Same to Both, Then Subtract', zh:'同加同减（向上凑整）' },
  subtitle:{ ko:'두 수에 같은 수를 더해 빼는 수를 □0으로 만들어요', en:'Add the same number to both so the subtrahend becomes a round ten', zh:'两数同加一个数，使减数变成整十数' },
  icon:'➕',

  practice:{
    generator:'addSameSub', level:'practice', count:5,
    intro:{ ko:'빼는 수를 □0으로 만드는 마법 수를 찾아봐요!', en:'Find the magic number to make the subtrahend a round ten!', zh:'找到能让减数变成整十数的魔法数！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 빼는 수를 □0으로 만들어요', en:'1) Make the subtrahend a round ten', zh:'① 把减数变成整十数' },
        head:{ ko:'두 수에 같은 수를 더해도 차는 변하지 않아요', en:'Adding the same number to both doesn\'t change the difference', zh:'两数同加一个数，差不变' },
        desc:{ ko:'53-38=? 에서 38+2=40으로 맞추면 빼기 쉬워져요. 53에도 2를 더해 55-40=15. 바로 답!',
               en:'53-38=? If 38+2=40, subtraction is easy. Add 2 to 53 too: 55-40=15. Done!',
               zh:'53-38=？如果38+2=40，减法就简单了。53也加2：55-40=15。搞定！' },
        mathSteps:['53 - 38 = □',{ko:'38 + 2 = 40 (□0이 됐어요!)',en:'38 + 2 = 40 \\text{ (a round number!)}',zh:'38 + 2 = 40（凑成整十了！）'},'53 + 2 = 55','55 - 40 = 15'],
        result:{ ko:'53-38=15 ✓', en:'53-38=15 ✓', zh:'53-38=15 ✓' },
        book:{ ko:'A-B 에서 B에 d를 더해 B+d=□0이 되면, A+d - (B+d) = A-B. 차는 그대로예요!', en:'In A-B, if adding d to B makes B+d=□0, then A+d - (B+d) = A-B. The difference stays the same!', zh:'A-B中，若B加d使B+d=整十数，则A+d-(B+d)=A-B。差不变！' } },
      { tag:{ ko:'② 더해야 할 수 d 찾기', en:'2) Find d to add', zh:'② 找到要加的数d' },
        head:{ ko:'빼는 수의 일의 자리를 보면 d가 보여요', en:'Look at the ones digit of the subtrahend to find d', zh:'看减数的个位就能找到d' },
        desc:{ ko:'일의 자리가 8이면 d=2 (8+2=10). 일의 자리가 7이면 d=3 (7+3=10). 간단!',
               en:'Ones digit 8 → d=2 (8+2=10). Ones digit 7 → d=3. Simple!',
               zh:'个位是8→d=2（8+2=10）。个位是7→d=3。简单！' },
        mathSteps:['67 - 49 = □',{ko:'49의 일의 자리 9 → d = 1',en:'\\text{ones digit of 49 is 9} → d = 1',zh:'49的个位是9 → d = 1'},'49+1=50, 67+1=68','68 - 50 = 18'],
        result:{ ko:'67-49=18 ✓', en:'67-49=18 ✓', zh:'67-49=18 ✓' },
        book:null }
    ],
    rule:{ ko:'① 빼는 수(B)의 일의 자리로 d를 찾는다 (d = 10 - B의 일의 자리)  ② A+d, B+d를 계산  ③ (A+d)-(B+d) = 답',
      en:'① Find d from ones digit of B (d = 10 - ones of B)  ② Compute A+d and B+d  ③ (A+d)-(B+d) = answer',
      zh:'①由B的个位找d（d=10-B的个位） ②计算A+d和B+d ③(A+d)-(B+d)=答案' }
  },

  check:{
    fills:[
      { tex:'53-38: 38+\\square=40', answer:2, hint:{ ko:'38의 일의 자리 8→ 10-8=?', en:'Ones digit 8 → 10-8=?', zh:'个位8→10-8=？' } },
      { tex:'55-40=\\square', answer:15, hint:{ ko:'십의 자리끼리: 5-4=1 → 15', en:'Tens: 5-4=1, ones: 5-0=5 → 15', zh:'十位：5-4=1，个位：5-0=5→15' } }
    ],
    open:{ ko:'A-B에서 두 수에 같은 수를 더해도 차가 변하지 않는 이유를 설명해봐요.', en:'Explain why adding the same number to both A and B doesn\'t change A-B.', zh:'说说为什么A-B中两数同加一个数，差不变。' },
    openHint:{ ko:'예) (A+d)-(B+d) = A+d-B-d = A-B. d가 사라져요!', en:'e.g. (A+d)-(B+d) = A+d-B-d = A-B. The d cancels out!', zh:'例）(A+d)-(B+d)=A+d-B-d=A-B。d消掉了！' }
  },

  lab:{ generator:'addSameSub', level:'main', count:4,
    intro:{ ko:'마법의 d를 찾아서 □0으로 만들어봐요!', en:'Find the magic d to create a round ten!', zh:'找到魔法数d，凑成整十数！' } },

  arena:{ generator:'addSameSub', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한! 같은 수를 더해 □0을 만들어요!', en:'As many as you can! Add same to both to get a round ten!', zh:'5分钟内尽量多做！两数同加凑整十！' } },

  stamp:{ label:{ ko:'같은수 더해서 빼기 마법사', en:'Equal-Add Subtractor', zh:'同加减法魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'d 찾기 성공! ➕✨',en:'Found d! ✨',zh:'找到d了！✨'}, {ko:'□0 완성! 대단해!',en:'Round ten complete!',zh:'整十数完成！太棒了！'} ],
    wrong:[ {ko:'빼는 수의 일의 자리를 봐봐!',en:'Check the ones digit of the subtrahend!',zh:'看看减数的个位！'}, {ko:'d를 두 수 모두에 더했어?',en:'Did you add d to BOTH numbers?',zh:'两个数都加d了吗？'} ],
    finish:{ ko:'완벽해! 같은 수 더해서 빼기 마법사야! ➕✨', en:"Perfect! You're an equal-add subtractor!", zh:'完美！你是同加减法魔法师！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
