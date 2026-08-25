/* Numbers of Magic — 유닛 H-06: 100에 가까운 수의 나눗셈 (고급 D-3 · 경시의 탑 27 수의 비밀) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['H-06'] = {
  id:'H-06', tier:'advanced', level:'27', order:4,
  lineage:['place-magic'],
  generator:'adv_divNear',
  title:{ ko:'100에 가까운 수의 나눗셈', en:'Division Near 100', zh:'接近100的除法' },
  subtitle:{ ko:'98로 나눌 땐 100으로 나눈 척 어림하고 보정해요!', en:'Dividing by 98? Pretend it\'s 100, then correct!', zh:'除以98？先假装除以100，再修正！' },
  icon:'🎯',

  practice:{
    generator:'adv_divNear', level:'practice', count:5,
    params:{anchor:100,level:'practice'},
    intro:{
      ko:'96, 97, 98, 99로 나누는 건 100으로 나누는 것과 살짝만 달라. 그 차이를 메워보자!',
      en:'Dividing by 96–99 is almost like dividing by 100 — let\'s fill in the tiny gap!',
      zh:'除以96~99几乎和除以100一样——来补上那一点点差距吧！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 100으로 나눈 척 먼저',en:'1) Pretend to divide by 100',zh:'① 先假装除以100'},
        head:{ko:'6165÷98을 100으로 어림해요',en:'Estimate 6165÷98 as if dividing by 100',zh:'把6165÷98先按除以100来估'},
        desc:{ko:'98로 나누는 건 좀 까다롭죠? 대신 <b>100으로 나눈 것처럼</b> 어림해요: 6165÷100 ≈ 61(몫), 나머지 265. 그런데 우리는 진짜 100이 아니라 98로 나눴어야 하니까, <b>모자란 2만큼(100−98)</b>을 몫(61)에 곱해서 나머지에 더해줘요: 61×2=122, 265+122=387. 387은 아직 98보다 크니 다시: 387÷98≈3(몫 추가), 나머지 93. 최종 몫=61+3=<b>64</b>, 나머지=<b>93</b>.',
              en:'Dividing by 98 is awkward — so instead, estimate <b>as if dividing by 100</b>: 6165÷100 ≈ 61 (quotient), remainder 265. But we actually needed 98, not 100, so add back the <b>shortfall (100−98=2) times the quotient</b>: 61×2=122, 265+122=387. That\'s still ≥98, so repeat: 387÷98≈3 more, remainder 93. Final quotient=61+3=<b>64</b>, remainder=<b>93</b>.',
              zh:'除以98有点麻烦吧？我们<b>假装除以100</b>来估算：6165÷100 ≈ 61（商），余数265。但其实要除的是98不是100，所以要把<b>不足的部分（100−98=2）乘以商</b>加回余数：61×2=122，265+122=387。387还比98大，再来一次：387÷98≈再加3，余93。最终商=61+3=<b>64</b>，余数=<b>93</b>。'},
        mathSteps:['6165÷100 ≈ 61 …265','(100−98)×61 = 122','265+122 = 387','387÷98 ≈ 3 …93','몫 61+3=64, 나머지 93'],
        result:{ko:'6165÷98=64…93! 100으로 어림한 뒤 모자란 만큼 계속 더해요.',en:'6165÷98=64…93! Estimate by 100, then keep adding back the shortfall.',zh:'6165÷98=64…93！按100估算，再不断补回不足的部分。'},
        book:{ko:'100을 곱하는 건 계산이 아주 쉬워요(자리만 옮기면 되니까) — 그래서 99를 직접 곱하는 것보다 100을 곱하고 한 번 빼는 게 훨씬 편해요.',
              en:'Multiplying by 100 is trivial (just shift digits) — so it\'s far easier than multiplying by 99 directly and then subtracting once.',
              zh:'乘以100非常简单（只是移位）——所以比直接乘99再减一次要方便得多。'} },

      { tag:{ko:'② 10, 1000 근처로도 통해요',en:'2) Works near 10 and 1000 too',zh:'② 接近10和1000也行'},
        head:{ko:'같은 방법, 다른 기준수',en:'Same method, different anchor',zh:'方法相同，基准不同'},
        desc:{ko:'이 방법은 100 근처에만 통하는 게 아니에요! 나누는 수가 <b>10에 가까우면</b> 10으로 어림하고 모자란 만큼(10−나누는 수)을 더해요. <b>1000에 가까우면</b> 1000으로 어림해요. 어떤 딱 떨어지는 기준수든 원리는 똑같아요: <b>기준수로 어림 → 모자란 만큼 몫에 곱해 더하기 → 나머지가 나누는 수보다 작아질 때까지 반복</b>.',
              en:'This method isn\'t limited to near-100! If the divisor is <b>close to 10</b>, estimate with 10 and add the shortfall. <b>Close to 1000</b>, use 1000. Any friendly anchor works the same way: <b>estimate with the anchor → add back the shortfall times the quotient → repeat until the remainder is smaller than the divisor</b>.',
              zh:'这个方法不只对接近100的数有效！如果除数<b>接近10</b>，就用10来估算并加上不足的部分。<b>接近1000</b>就用1000估算。任何好算的基准数原理都一样：<b>用基准数估算→把不足的部分乘商加回去→重复直到余数小于除数</b>。'},
        mathSteps:['542÷9: 542÷10≈54…2','(10−9)×54=54, 2+54=56','56÷9≈6…2, 몫 54+6=60'],
        result:{ko:'542÷9=60…2! 10에 가까운 나눗셈도 같은 방법이 통해요.',en:'542÷9=60…2! The same trick works for divisors near 10.',zh:'542÷9=60…2！接近10的除法也是同样的技巧。'},
        book:{ko:'나머지가 나누는 수보다 작아질 때까지 이 과정을 몇 번이고 반복하는 게 핵심이에요 — 한 번에 안 끝나도 괜찮아요.',
              en:'The key is repeating until the remainder is smaller than the divisor — it\'s fine if it takes more than one round.',
              zh:'关键是反复做，直到余数比除数小——不用一次就搞定。'} }
    ],
    rule:{ ko:'① 가까운 기준수(10·100·1000)로 어림  ② 모자란 만큼을 몫에 곱해 나머지에 더하기  ③ 나머지<나누는 수가 될 때까지 반복',
      en:'① Estimate with the nearby anchor (10, 100, 1000)  ② Add the shortfall × quotient back to the remainder  ③ Repeat until remainder < divisor',
      zh:'① 用邻近的基准数（10·100·1000）估算  ② 把不足×商加回余数  ③ 重复直到余数小于除数' }
  },

  check:{
    fills:[
      { tex:'4^{\\ast}: 396 \\div 99 = \\square \\cdots \\square', answer:4,
        hint:{ ko:'396÷100≈3…96, (100−99)×3=3, 96+3=99=99×1 → 몫 4, 나머지 0', en:'396÷100≈3…96, add 1×3=3, 96+3=99 → quotient 4', zh:'396÷100≈3…96，加1×3=3，96+3=99 → 商4' } },
      { tex:'2900 \\div 97 = \\square \\cdots \\square', answer:29,
        hint:{ ko:'2900÷100=29…0, (100−97)×29=87, 87÷97은 안 되니 몫 그대로 29, 나머지 87', en:'2900÷100=29…0, shortfall 3×29=87 < 97, so quotient 29, remainder 87', zh:'2900÷100=29…0，不足3×29=87<97，商仍是29，余87' } }
    ],
    open:{ ko:'34241÷999을 1000 근처 나눗셈으로 풀고, 몇 라운드 만에 끝났는지 말해 봐요.',
      en:'Solve 34241÷999 using the near-1000 method, and say how many rounds it took.',
      zh:'用接近1000的方法算34241÷999，说说用了几轮才完成。' },
    openHint:{ ko:'예) 34241÷1000≈34…241, (1000−999)×34=34, 241+34=275<999 → 몫 34, 나머지 275. 한 라운드!',
      en:'e.g. 34241÷1000≈34…241, shortfall 1×34=34, 241+34=275<999 → quotient 34, remainder 275. One round!',
      zh:'例）34241÷1000≈34…241，不足1×34=34，241+34=275<999 → 商34，余275。一轮就好！' }
  },

  lab:{
    generator:'adv_divNear', level:'main', count:4,
    params:{anchor:100,level:'main'},
    intro:{
      ko:'네 자리÷두 자리, 나머지가 있는 경우도 익혀보자!',
      en:'Practice 4-digit ÷ 2-digit, including remainders!',
      zh:'练习四位数÷两位数，包括有余数的情况！'
    }
  },

  arena:{
    generator:'adv_divNear', level:'main', count:8, timeLimit:300,
    params:{anchor:1000},
    rule:{ ko:'5분 안에 1000 근처 나눗셈을 모두 풀어요!', en:'Solve all near-1000 divisions in 5 minutes!', zh:'5分钟内解答所有接近1000的除法！' }
  },

  stamp:{ label:{ ko:'어림 나눗셈 명인', en:'Near-Anchor Division Master', zh:'邻近估算除法大师' }, coins:36 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'딱 맞춰 어림했어! 🎯',en:'Estimated perfectly!',zh:'估算得真准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'모자란 만큼을 몫에 곱했는지 확인해봐!',en:'Check you multiplied the shortfall by the quotient!',zh:'检查一下是否把不足乘上了商！'}, {ko:'나머지가 나누는 수보다 작아질 때까지 반복!',en:'Keep going until the remainder is smaller than the divisor!',zh:'继续做到余数比除数小！'} ],
    finish:{ ko:'완벽해! 어림 나눗셈 명인! 🎯✨', en:'Perfect! Near-Anchor Division Master!', zh:'完美！邻近估算除法大师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
