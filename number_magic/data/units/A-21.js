/* Numbers of Magic — 유닛 A-21: 같은 수 빼서 빼기 (초급 E 챕터5) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};
window.NM_UNITS['A-21'] = {
  id:'A-21', tier:'beginner', level:'A', order:21,
  generator:'subSameSub',
  title:{ ko:'같은 수 빼서 빼기', en:'Subtract Same from Both, Then Subtract', zh:'同减同减（向下凑整）' },
  subtitle:{ ko:'두 수에서 같은 수를 빼서 빼지는 수를 □0으로 만들어요', en:'Subtract the same number from both so the minuend becomes a round ten', zh:'两数同减一个数，使被减数变成整十数' },
  icon:'➖',

  practice:{
    generator:'subSameSub', level:'practice', count:5,
    intro:{ ko:'빼지는 수를 □0으로 만드는 마법 수를 찾아봐요!', en:'Find the magic number to make the minuend a round ten!', zh:'找到能让被减数变成整十数的魔法数！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 빼지는 수를 □0으로 낮춰요', en:'1) Round the minuend down to a multiple of 10', zh:'① 把被减数降到整十数' },
        head:{ ko:'두 수에서 같은 수를 빼도 차는 변하지 않아요', en:'Subtracting the same from both doesn\'t change the difference', zh:'两数同减一个数，差不变' },
        desc:{ ko:'62-28=? 에서 62-2=60으로 맞추면 계산이 쉬워요. 28에서도 2를 빼서 26으로. 60-26=34!',
               en:'62-28=? If 62-2=60, calculation is easy. Subtract 2 from 28 too: 26. 60-26=34!',
               zh:'62-28=？如果62-2=60，计算就简单了。28也减2变26。60-26=34！' },
        mathSteps:['62 - 28 = □','62의 일의 자리 2 → d = 2','62-2=60, 28-2=26','60 - 26 = 34'],
        result:{ ko:'62-28=34 ✓', en:'62-28=34 ✓', zh:'62-28=34 ✓' },
        book:{ ko:'빼지는 수를 □0으로 만들면 그 다음 계산이 훨씬 쉬워져요.', en:'Making the minuend a round ten makes the next step much easier.', zh:'把被减数变成整十数，后面的计算就简单多了。' } },
      { tag:{ ko:'② 이전 전략(더해서 빼기)와 차이점', en:'2) How is this different from "Add Same to Both"?', zh:'② 与"同加"策略有什么不同？' },
        head:{ ko:'상황에 따라 더하기 or 빼기를 선택해요', en:'Choose adding or subtracting depending on the situation', zh:'根据情况选择同加或同减' },
        desc:{ ko:'A-20(더해서 빼기): 빼는 수(B)를 □0으로 올림. A-21(빼서 빼기): 빼지는 수(A)를 □0으로 낮춤. 어느 쪽이 더 편한지 골라요!',
               en:'A-20: rounds the subtrahend (B) UP to □0. A-21: rounds the minuend (A) DOWN to □0. Pick whichever is easier!',
               zh:'A-20：把减数(B)向上凑到整十数。A-21：把被减数(A)向下降到整十数。选哪个方便用哪个！' },
        mathSteps:['75 - 38 = □','방법1: 38+2=40, 75+2=77, 77-40=37','방법2: 75-5=70, 38-5=33, 70-33=37'],
        result:{ ko:'두 방법 모두 75-38=37 ✓', en:'Both methods: 75-38=37 ✓', zh:'两种方法都得75-38=37 ✓' },
        book:null }
    ],
    rule:{ ko:'① 빼지는 수(A)의 일의 자리가 d  ② A-d=□0, B-d 계산  ③ (A-d)-(B-d) = 답',
      en:'① d = ones digit of minuend A  ② A-d=□0, compute B-d  ③ (A-d)-(B-d) = answer',
      zh:'①d=被减数A的个位 ②A-d=整十数，算B-d ③(A-d)-(B-d)=答案' }
  },

  check:{
    fills:[
      { tex:'62-28: 62-\\square=60', answer:2, hint:{ ko:'62의 일의 자리가 d예요', en:'The ones digit of 62 is d', zh:'62的个位就是d' } },
      { tex:'60-26=\\square', answer:34, hint:{ ko:'6-2=4, 0-6은 빌려야… 60-26=34', en:'60-26: borrow to get 34', zh:'60-26=34' } }
    ],
    open:{ ko:'A-21(빼서 빼기)와 A-20(더해서 빼기)를 비교하고, 각각 언제 쓰면 좋은지 설명해봐요.', en:'Compare A-21 (subtract same) with A-20 (add same) and explain when to use each.', zh:'比较A-21（同减）和A-20（同加），说说各自适合什么情况。' },
    openHint:{ ko:'빼지는 수의 일의 자리가 작으면 빼서 □0 (A-21), 빼는 수의 일의 자리가 크면 더해서 □0 (A-20).', en:'Small ones digit in A → subtract same (A-21). Large ones digit in B → add same (A-20).', zh:'被减数个位小→同减（A-21），减数个位大→同加（A-20）。' }
  },

  lab:{ generator:'subSameSub', level:'main', count:4,
    intro:{ ko:'빼지는 수를 □0으로 내려봐요!', en:'Round the minuend down to a multiple of 10!', zh:'把被减数降到整十数！' } },

  arena:{ generator:'subSameSub', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한! 빼지는 수를 □0으로!', en:'As many as you can! Make the minuend a round ten!', zh:'5分钟内尽量多做！把被减数变整十！' } },

  stamp:{ label:{ ko:'같은수 빼서 빼기 마법사', en:'Equal-Sub Subtractor', zh:'同减减法魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'빼기 성공! ➖✨',en:'Subtracted! ✨',zh:'减成功！✨'}, {ko:'□0 완성! 멋져!',en:'Round ten achieved!',zh:'整十数搞定！'} ],
    wrong:[ {ko:'빼지는 수의 일의 자리가 d야!',en:'The ones digit of the minuend is d!',zh:'被减数的个位就是d！'}, {ko:'두 수 모두에서 d를 뺐어?',en:'Did you subtract d from BOTH numbers?',zh:'两个数都减d了吗？'} ],
    finish:{ ko:'완벽해! 같은 수 빼서 빼기 마법사야! ➖✨', en:"Perfect! You're an equal-sub subtractor!", zh:'完美！你是同减减法魔法师！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
