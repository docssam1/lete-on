/* Numbers of Magic — 유닛 A-22: 쪼개서 빼기 (초급 F 챕터1) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};
window.NM_UNITS['A-22'] = {
  id:'A-22', tier:'beginner', level:'A', order:22,
  generator:'splitSubtract',
  title:{ ko:'쪼개서 빼기', en:'Split & Subtract', zh:'拆分相减' },
  subtitle:{ ko:'빼는 수를 □0 + 나머지로 쪼개서 두 번에 나눠 빼요', en:'Split the subtrahend into a round ten plus remainder, then subtract twice', zh:'把减数拆成整十数加余数，分两步相减' },
  icon:'🔪',

  practice:{
    generator:'splitSubtract', level:'practice', count:5,
    intro:{ ko:'먼저 십의 자리만 빼는 연습이에요!', en:'First, practice subtracting just the tens!', zh:'先练习只减十位！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 빼는 수를 □0 + 나머지로 쪼개요', en:'1) Split subtrahend into □0 + remainder', zh:'① 把减数拆成整十数加余数' },
        head:{ ko:'먼저 큰 부분(□0)을 빼고, 남은 수를 또 빼요', en:'Subtract the big part (□0) first, then the remainder', zh:'先减大的部分（整十数），再减余数' },
        desc:{ ko:'74-38=? 에서 38=30+8로 쪼개요. 74-30=44, 그 다음 44-8=36. 두 번 빼면 끝!',
               en:'74-38=? Split 38=30+8. First 74-30=44, then 44-8=36. Two subtractions done!',
               zh:'74-38=？把38拆成30+8。先74-30=44，再44-8=36。减两次搞定！' },
        mathSteps:['74 - 38 = □','38 = 30 + 8','74 - 30 = 44','44 - 8 = 36'],
        result:{ ko:'74-38=36 ✓', en:'74-38=36 ✓', zh:'74-38=36 ✓' },
        book:{ ko:'빼는 수를 십의 자리와 일의 자리로 쪼개면 각 단계가 간단해요.', en:'Splitting the subtrahend into tens and ones makes each step simpler.', zh:'把减数拆成十位和个位，每步就简单了。' } },
      { tag:{ ko:'② 세 자리 수도 쪼개서 빼요', en:'2) Split for 3-digit subtraction too', zh:'② 三位数也能拆分相减' },
        head:{ ko:'큰 수도 같은 방법으로!', en:'Same method works for bigger numbers!', zh:'大数也用同样的方法！' },
        desc:{ ko:'250-136=? → 136=130+6 → 250-130=120 → 120-6=114',
               en:'250-136=? → 136=130+6 → 250-130=120 → 120-6=114',
               zh:'250-136=？→136=130+6→250-130=120→120-6=114' },
        mathSteps:['250 - 136 = □','136 = 130 + 6','250 - 130 = 120','120 - 6 = 114'],
        result:{ ko:'250-136=114 ✓', en:'250-136=114 ✓', zh:'250-136=114 ✓' },
        book:null }
    ],
    rule:{ ko:'① 빼는 수를 □0(십의 자리)과 나머지(일의 자리)로 쪼갠다  ② □0 먼저 빼고  ③ 나머지를 뺀다',
      en:'① Split subtrahend into □0 (tens) and remainder (ones)  ② Subtract □0 first  ③ Subtract the remainder',
      zh:'①把减数拆成整十数(十位)和余数(个位) ②先减整十数 ③再减余数' }
  },

  check:{
    fills:[
      { tex:'74-38: 74-30=\\square', answer:44, hint:{ ko:'70-30=40, 4 남아서 44', en:'70-30=40, plus 4 = 44', zh:'70-30=40，加4得44' } },
      { tex:'44-8=\\square', answer:36, hint:{ ko:'44-8: 40-8=32, 32+4=36', en:'44-8=36', zh:'44-8=36' } }
    ],
    open:{ ko:'빼는 수를 쪼개서 빼면 왜 계산이 쉬워지는지 설명해봐요.', en:'Explain why splitting the subtrahend makes calculation easier.', zh:'说说为什么把减数拆开后，计算就容易了。' },
    openHint:{ ko:'□0을 빼는 건 앞자리를 그냥 빼면 되니까 쉽고, 일의 자리만 남아서 두 번째 계산도 간단해요.', en:'Subtracting □0 is easy (just change the tens digit), and then only ones remain.', zh:'减整十数只需改十位，很简单；再减个位也容易。' }
  },

  lab:{ generator:'splitSubtract', level:'main', count:4,
    intro:{ ko:'쪼개서 두 번에 빼는 마법!', en:'The magic of splitting and subtracting twice!', zh:'拆分两步减的魔法！' } },

  arena:{ generator:'splitSubtract', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한! □0 먼저, 그 다음 나머지!', en:'As many as you can! Round ten first, then remainder!', zh:'5分钟内尽量多做！先减整十数，再减余数！' } },

  stamp:{ label:{ ko:'쪼개서 빼기 마법사', en:'Split Subtractor', zh:'拆分相减魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'쪼개기 성공! 🔪✨',en:'Split success!',zh:'拆分成功！✨'}, {ko:'두 번에 딱 맞게!',en:'Two steps, exact!',zh:'两步刚好！'} ],
    wrong:[ {ko:'빼는 수를 □0+나머지로 쪼개봐!',en:'Split the subtrahend into □0+remainder!',zh:'把减数拆成整十+余数试试！'}, {ko:'□0 먼저, 그 다음 나머지야!',en:'Round ten first, then remainder!',zh:'先减整十，再减余数！'} ],
    finish:{ ko:'완벽해! 쪼개서 빼기 마법사야! 🔪✨', en:"Perfect! You're a split subtractor!", zh:'完美！你是拆分相减魔法师！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
