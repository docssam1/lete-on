/* Numbers of Magic — 유닛 A-32: 두 수로 쪼개서 빼기 (초급 H 챕터3) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};
window.NM_UNITS['A-32'] = {
  id:'A-32', tier:'beginner', level:'A', order:32,
  generator:'splitTwo',
  title:{ ko:'두 수로 쪼개서 빼기', en:'Split into Two & Subtract', zh:'拆成两数相减' },
  subtitle:{ ko:'빼지는 수와 빼는 수를 모두 쪼개서 자리별로 빼요', en:'Split both numbers by place value and subtract each part', zh:'被减数和减数都按位拆分，分别相减' },
  icon:'✂️',

  practice:{
    generator:'splitTwo', level:'practice', count:5,
    intro:{ ko:'두 수 모두 자리별로 쪼개서 빼는 연습이에요!', en:'Practice splitting both numbers by place value!', zh:'练习把两个数都按位拆分相减！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 두 수 모두 쪼개요', en:'1) Split both numbers', zh:'① 两数都拆分' },
        head:{ ko:'A-B = (A의 백+십+일) - (B의 백+십+일)', en:'A−B = (A\'s hundreds+tens+ones) − (B\'s hundreds+tens+ones)', zh:'A-B=(A的百+十+个)-(B的百+十+个)' },
        desc:{ ko:'673-425=? → (600+70+3)-(400+20+5). 600-400=200, 70-20=50, 3-5=-2. 200+50-2=248!',
               en:'673−425=? → (600+70+3)−(400+20+5). 600−400=200, 70−20=50, 3−5=−2. 200+50−2=248!',
               zh:'673-425=？→(600+70+3)-(400+20+5)。600-400=200，70-20=50，3-5=-2。200+50-2=248！' },
        mathSteps:['673 - 425 = □','600-400=200, 70-20=50, 3-5=-2','200 + 50 - 2 = 248'],
        result:{ ko:'673-425=248 ✓', en:'673−425=248 ✓', zh:'673-425=248 ✓' },
        book:{ ko:'두 수를 모두 쪼개면 각 자리의 차를 따로 계산할 수 있어요. 마지막에 합치면 돼요.', en:'Splitting both numbers lets you compute each place difference separately, then combine.', zh:'把两数都拆开，可以分别算每位的差，最后合并结果。' } },
      { tag:{ ko:'② 자리별 차의 합이 전체 차와 같아요', en:'2) Sum of place differences equals the total difference', zh:'② 各位差之和等于总差' },
        head:{ ko:'분배법칙으로 이해해요', en:'Understand through the distributive property', zh:'用分配律来理解' },
        desc:{ ko:'(600+70+3)-(400+20+5) = (600-400)+(70-20)+(3-5) = 200+50+(-2) = 248!',
               en:'(600+70+3)−(400+20+5) = (600−400)+(70−20)+(3−5) = 200+50+(−2)=248!',
               zh:'(600+70+3)-(400+20+5)=(600-400)+(70-20)+(3-5)=200+50+(-2)=248！' },
        mathSteps:['(600-400) = 200','(70-20) = 50','(3-5) = -2','200+50+(-2) = 248'],
        result:{ ko:'673-425=248 ✓', en:'673−425=248 ✓', zh:'673-425=248 ✓' },
        book:null }
    ],
    rule:{ ko:'① 두 수를 자리별로 쪼갠다  ② 같은 자리끼리 뺀다  ③ 결과를 합친다',
      en:'① Split both numbers by place  ② Subtract matching places  ③ Combine the results',
      zh:'①两数都按位拆分 ②同位相减 ③合并结果' }
  },

  check:{
    fills:[
      { tex:'673-425: 600-400=\\square', answer:200,
        hint:{ ko:'6-4=2이라서 600-400=200', en:'6−4=2 so 600−400=200', zh:'6-4=2，所以600-400=200' } },
      { tex:'200+50+(-2)=\\square', answer:248, hint:{ ko:'250-2=248', en:'250−2=248', zh:'250-2=248' } }
    ],
    open:{ ko:'두 수를 자리별로 쪼개서 빼는 방법의 장점을 설명해봐요.', en:'Explain the advantages of splitting both numbers by place value before subtracting.', zh:'说说把两数按位拆分再相减的优点。' },
    openHint:{ ko:'각 자리를 독립적으로 계산하니까 받아내림 없이 머릿속에서 순서대로 처리할 수 있어요.', en:'Computing each place independently means no borrowing steps — you just process them in order mentally.', zh:'每位独立计算，不需要借位，可以在脑子里按顺序处理。' }
  },

  lab:{ generator:'splitTwo', level:'main', count:4,
    intro:{ ko:'두 수 모두 쪼개서 자리별로 빼요!', en:'Split both numbers and subtract by place!', zh:'两数都拆分，按位相减！' } },

  arena:{ generator:'splitTwo', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한! 둘 다 쪼개봐!', en:'As many as you can! Split them both!', zh:'5分钟内尽量多做！两数都拆分！' } },

  stamp:{ label:{ ko:'두수 쪼개기 마법사', en:'Double-Split Wizard', zh:'双拆法魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'둘 다 쪼개서 성공! ✂️✨',en:'Both split!',zh:'两数都拆了！✨'}, {ko:'자리별로 딱!',en:'Place by place!',zh:'按位相减！'} ],
    wrong:[ {ko:'두 수 모두 자리별로 쪼개봐!',en:'Split BOTH numbers by place value!',zh:'两个数都要按位拆分！'}, {ko:'같은 자리끼리 빼야 해!',en:'Subtract matching places!',zh:'同位相减！'} ],
    finish:{ ko:'완벽해! 두수 쪼개기 마법사야! ✂️✨', en:"Perfect! You're a double-split wizard!", zh:'完美！你是双拆法魔法师！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
