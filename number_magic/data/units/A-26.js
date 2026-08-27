/* Numbers of Magic — 유닛 A-26: 은하철도 999 (초급 G 챕터1) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};
window.NM_UNITS['A-26'] = {
  id:'A-26', tier:'beginner', level:'A', order:26,
  generator:'galaxy999',
  title:{ ko:'은하철도 999', en:'Galaxy Express 999', zh:'银河铁道999' },
  subtitle:{ ko:'□+999는 □+1000-1로! 1000을 더하고 1을 빼요', en:'□+999 = □+1000−1: add 1000 then subtract 1', zh:'□+999=□+1000−1：先加1000再减1' },
  icon:'🚂',

  practice:{
    generator:'galaxy999', level:'practice', count:5,
    intro:{ ko:'999를 1000-1로 바꾸는 마법 연습이에요!', en:'Practice the trick of replacing 999 with 1000−1!', zh:'练习把999换成1000-1的魔法！' }
  },

  discover:{
    story:{
      hook:{ ko:'999에 1을 더하면 1000. 옛 우리말로 1000은 뭐라고 불렀을까요?',
        en:'Add 1 to 999 and you get 1,000. What did old Korean call a thousand?',
        zh:'999加1就是1000。古时候的韩语管一千叫什么？' },
      history:{ ko:'즈믄이라고 했어요. 100은 온, 1000은 즈믄이었죠. 아주 여러 번을 뜻하는 골백번의 골도 굉장히 큰 수를 가리키던 옛말이에요. 지금은 한자에서 온 백, 천에 밀려 거의 쓰이지 않지만, 999에 1을 더해 딱 떨어지는 1000을 만드는 마법은 그때나 지금이나 똑같습니다.',
        en:'They called it jeumeun. A hundred was on, a thousand was jeumeun, and the gol in golbaekbeon — meaning countless times — once named a huge number of its own. Sino-Korean baek and cheon have almost pushed those words out, but the trick of adding 1 to 999 to land on a clean 1,000 is the same now as it was then.',
        zh:'叫做jeumeun（즈믄）。一百是on（온），一千是jeumeun，而表示无数次的golbaekbeon里的gol，从前也是一个很大的数的名字。如今它们几乎被汉字词的百、千取代了，但给999加上1、凑成整整1000的魔法，古今都一样。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 999 = 1000 - 1', en:'1) 999 = 1000 − 1', zh:'① 999 = 1000 - 1' },
        head:{ ko:'1000을 더하고 1을 빼요', en:'Add 1000, then subtract 1', zh:'加1000，再减1' },
        desc:{ ko:'348+999=? 999=1000-1이니까 348+1000=1348, 1348-1=1347!',
               en:'348+999=? Since 999=1000−1: 348+1000=1348, 1348−1=1347!',
               zh:'348+999=？因为999=1000-1：348+1000=1348，1348-1=1347！' },
        mathSteps:['348 + 999 = □','999 = 1000 - 1','348 + 1000 = 1348','1348 - 1 = 1347'],
        result:{ ko:'348+999=1347 ✓', en:'348+999=1347 ✓', zh:'348+999=1347 ✓' },
        book:{ ko:'999를 만나면 먼저 1000을 더하고 1을 빼세요. 머릿속에서 빠르게!', en:'When you see 999, add 1000 first, then take away 1. Fast mental math!', zh:'看到999，先加1000，再减1。这是快速心算的技巧！' } },
      { tag:{ ko:'② 998, 997도 같은 방법으로', en:'2) Same trick for 998, 997…', zh:'② 998、997也用同样的方法' },
        head:{ ko:'998 = 1000 - 2, 997 = 1000 - 3', en:'998 = 1000 − 2, 997 = 1000 − 3', zh:'998 = 1000 - 2，997 = 1000 - 3' },
        desc:{ ko:'475+998=? 475+1000=1475, 1475-2=1473!  / 602+997=? 602+1000=1602, 1602-3=1599!',
               en:'475+998=? 475+1000=1475, 1475−2=1473! / 602+997=? 602+1000=1602, 1602−3=1599!',
               zh:'475+998=？475+1000=1475，1475-2=1473！ / 602+997=？602+1000=1602，1602-3=1599！' },
        mathSteps:['475 + 998 = □','998 = 1000 - 2','475 + 1000 = 1475','1475 - 2 = 1473'],
        result:{ ko:'475+998=1473 ✓', en:'475+998=1473 ✓', zh:'475+998=1473 ✓' },
        book:null }
    ],
    rule:{ ko:'① 999(또는 998, 997)를 1000-1(또는 1000-2, 1000-3)으로 바꾼다  ② □+1000 계산  ③ 결과에서 1(또는 2, 3)을 뺀다',
      en:'① Replace 999 (or 998, 997) with 1000−1 (or 1000−2, 1000−3)  ② Compute □+1000  ③ Subtract 1 (or 2, or 3)',
      zh:'①把999（或998、997）换成1000-1（或1000-2、1000-3）②算□+1000 ③再减1（或2、3）' }
  },

  check:{
    fills:[
      { tex:'348+999: 348+1000=\\square', answer:1348,
        hint:{ ko:'348+1000은 천의 자리만 1 늘어요', en:'348+1000: just add 1 to the thousands digit', zh:'348+1000：千位加1' } },
      { tex:'1348-1=\\square', answer:1347, hint:{ ko:'1348에서 1을 빼요', en:'Subtract 1 from 1348', zh:'1348减1' } }
    ],
    open:{ ko:'□+999를 계산할 때 왜 □+1000-1이 더 편리한지 설명해봐요.', en:'Explain why □+1000−1 is more convenient than □+999 when computing.', zh:'说说计算□+999时，为什么□+1000-1更方便。' },
    openHint:{ ko:'1000을 더하는 건 천의 자리만 바꾸면 되고, 1을 빼는 것도 간단해서 훨씬 빨라요.', en:'Adding 1000 only changes the thousands digit, and subtracting 1 is trivial — so it\'s much faster.', zh:'加1000只需改千位，再减1也很简单，因此计算更快。' }
  },

  lab:{ generator:'galaxy999', level:'main', count:4,
    intro:{ ko:'999 마법 열차 출발! +1000 하고 -1!', en:'Galaxy 999 express! Add 1000, subtract 1!', zh:'银河999快车出发！加1000再减1！' } },

  arena:{ generator:'galaxy999', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한! 999를 1000-1로!', en:'As many as you can! Turn 999 into 1000−1!', zh:'5分钟内尽量多做！把999变1000-1！' } },

  stamp:{ label:{ ko:'999 마법사', en:'999 Wizard', zh:'999魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'은하철도 999! 🚂✨',en:'Galaxy 999!',zh:'银河999！✨'}, {ko:'+1000-1 성공!',en:'+1000-1 perfect!',zh:'+1000-1成功！'} ],
    wrong:[ {ko:'1000을 먼저 더하고 1을 빼봐!',en:'Add 1000 first, then subtract 1!',zh:'先加1000，再减1！'}, {ko:'999=1000-1이야!',en:'Remember: 999=1000−1!',zh:'记住：999=1000-1！'} ],
    finish:{ ko:'완벽해! 999 마법사야! 🚂✨', en:"Perfect! You're a 999 wizard!", zh:'完美！你是999魔法师！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
