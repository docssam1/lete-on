/* Numbers of Magic — 유닛 A-25: 덧셈 뺄셈 끼리끼리 2 (초급 F 챕터4) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};
window.NM_UNITS['A-25'] = {
  id:'A-25', tier:'beginner', level:'A', order:25,
  generator:'addSubGroup2',
  title:{ ko:'덧셈 뺄셈 끼리끼리 2', en:'Group Additions & Subtractions 2', zh:'加减法分组2' },
  subtitle:{ ko:'긴 혼합식에서 덧셈끼리, 뺄셈끼리 묶어서 계산해요', en:'In long mixed expressions, group the additions and subtractions separately', zh:'在长混合算式中，加法归加法，减法归减法' },
  icon:'🔗',

  practice:{
    generator:'addSubGroup2', level:'practice', count:5,
    intro:{ ko:'간단한 혼합 계산 연습이에요!', en:'Practice simple mixed calculations!', zh:'练习简单的混合计算！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 덧셈끼리, 뺄셈끼리 모아요', en:'1) Group the additions together, subtractions together', zh:'① 加法归组，减法归组' },
        head:{ ko:'부호를 바꾸지 않고 순서만 바꿔요', en:'Rearrange the order without changing signs', zh:'只换顺序，不改变符号' },
        desc:{ ko:'200+350-100+450-200에서 덧셈: 200+350+450=1000, 뺄셈: 100+200=300. 1000-300=700!',
               en:'200+350-100+450-200: additions: 200+350+450=1000, subtractions: 100+200=300. 1000-300=700!',
               zh:'200+350-100+450-200：加法：200+350+450=1000，减法：100+200=300。1000-300=700！' },
        mathSteps:['200+350-100+450-200',{ko:'덧셈: 200+350+450 = 1000',en:'\\text{addition: } 200+350+450 = 1000',zh:'加法：200+350+450 = 1000'},{ko:'뺄셈: 100+200 = 300',en:'\\text{subtraction: } 100+200 = 300',zh:'减法：100+200 = 300'},'1000 - 300 = 700'],
        result:{ ko:'200+350-100+450-200=700 ✓', en:'200+350-100+450-200=700 ✓', zh:'200+350-100+450-200=700 ✓' },
        book:{ ko:'덧셈끼리 먼저 모아 큰 합을 만든 뒤, 뺄셈끼리 모은 합을 한 번에 빼요.', en:'Group all additions first to make a big sum, then subtract the combined subtractions at once.', zh:'先把所有加法聚在一起得到大数，再一次性减去所有减法之和。' } },
      { tag:{ ko:'② 왜 순서를 바꿔도 될까요?', en:'2) Why can we rearrange the order?', zh:'② 为什么可以改变顺序？' },
        head:{ ko:'덧셈과 뺄셈은 교환법칙이 성립해요', en:'Addition and subtraction satisfy a rearrangement property', zh:'加减法满足可交换的性质' },
        desc:{ ko:'a+b-c+d = a+b+d-c. 부호가 붙어 이동하기 때문에 정확해요. 단, <b>뺄셈 부호는 함께 가져가야 해요</b>!',
               en:'a+b-c+d = a+b+d-c. The sign travels with the number. <b>Always bring the minus sign along!</b>',
               zh:'a+b-c+d = a+b+d-c。符号跟着数字走，所以是准确的。<b>注意减号要一起带走</b>！' },
        mathSteps:['a + b - c + d','= (a + b + d) - c',{ko:'부호를 잘 챙기면 OK!',en:'\\text{Keep track of the signs and you are OK!}',zh:'管好符号就OK！'}],
        result:{ ko:'부호만 잘 챙기면 어떤 순서로 묶어도 OK!', en:'As long as signs are correct, any grouping works!', zh:'只要符号处理正确，怎么分组都可以！' },
        book:null }
    ],
    rule:{ ko:'① 덧셈 항을 모두 모아 더한다  ② 뺄셈 항을 모두 모아 더한다  ③ (덧셈 합) - (뺄셈 합) = 답',
      en:'① Sum all the addition terms  ② Sum all the subtraction terms  ③ (Addition sum) - (Subtraction sum) = answer',
      zh:'①把所有加法项加起来 ②把所有减法项加起来 ③(加法和)-(减法和)=答案' }
  },

  check:{
    fills:[
      { tex:{ko:'200+350-100+450-200:\\;\\text{덧셈 합}=\\square',en:'200+350-100+450-200:\\;\\text{sum of additions}=\\square',zh:'200+350-100+450-200:\\;\\text{加法之和}=\\square'}, answer:1000,
        hint:{ ko:'200+350+450=?', en:'200+350+450=?', zh:'200+350+450=？' } },
      { tex:'1000-300=\\square', answer:700, hint:{ ko:'1000-300=?', en:'1000-300=?', zh:'1000-300=？' } }
    ],
    open:{ ko:'혼합 계산에서 덧셈끼리 묶을 때 "뺄셈 부호"를 잘 챙겨야 하는 이유를 설명해봐요.', en:'Explain why you must carry the minus sign when regrouping in mixed calculations.', zh:'说说在混合计算分组时，为什么一定要把减号也带走。' },
    openHint:{ ko:'예) a-b+c 에서 c를 b 앞에 쓰면 a+c-b. b는 여전히 빼야 해요. 부호를 빼먹으면 답이 완전히 달라져요.', en:'e.g. a-b+c: writing c before b gives a+c-b. b is still subtracted. Forgetting the sign changes everything.', zh:'例）a-b+c，把c提前：a+c-b。b仍然是被减的。忘了符号，答案全变了。' }
  },

  lab:{ generator:'addSubGroup2', level:'main', count:4,
    intro:{ ko:'긴 식도 끼리끼리 모으면 쉬워요!', en:'Even long expressions become easy when grouped!', zh:'再长的算式，分组就简单了！' } },

  arena:{ generator:'addSubGroup2', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한! 덧셈끼리 묶어봐!', en:'As many as you can! Group the additions!', zh:'5分钟内尽量多做！把加法聚在一起！' } },

  stamp:{ label:{ ko:'끼리끼리2 마법사', en:'Grouping2 Wizard', zh:'分组2魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'끼리끼리 완벽! 🔗✨',en:'Grouping perfect!',zh:'分组完美！✨'}, {ko:'묶어서 계산 성공!',en:'Grouped and calculated!',zh:'分组计算成功！'} ],
    wrong:[ {ko:'덧셈끼리, 뺄셈끼리 먼저 묶어봐!',en:'Group additions together, subtractions together first!',zh:'先把加法归组，减法归组！'}, {ko:'뺄셈 부호를 빼먹지 마!',en:'Don\'t forget the minus signs!',zh:'别忘了减号！'} ],
    finish:{ ko:'완벽해! 끼리끼리2 마법사야! 🔗✨', en:"Perfect! You're a Grouping2 wizard!", zh:'完美！你是分组2魔法师！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
