/* Numbers of Magic — 유닛 H-05: 순환소수 나눗셈 (고급 D-2 · 경시의 탑 27 수의 비밀 · 중2 선행) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['H-05'] = {
  id:'H-05', tier:'advanced', level:'27', order:3,
  lineage:['nine-next-door'],
  generator:'adv_repeatDec',
  title:{ ko:'순환소수 나눗셈', en:'Repeating-Decimal Division', zh:'循环小数除法' },
  subtitle:{ ko:'1÷9=0.111…! 나누어 떨어지지 않아도 규칙이 있어요.', en:'1÷9=0.111…! Even without ending, there\'s a pattern.', zh:'1÷9=0.111…！除不尽也有规律。' },
  icon:'♾️',

  practice:{
    generator:'adv_repeatDec', level:'practice', count:5,
    params:{mode:'cycle'},
    intro:{
      ko:'9로 나누면 무슨 일이 생길까? 몫을 계속 살펴보자!',
      en:'What happens when you divide by 9? Let\'s watch the quotient closely!',
      zh:'除以9会发生什么？仔细看看商吧！'
    }
  },

  discover:{
    story:{
      hook:{ ko:'1/3을 소수로 쓰면 0.333… 끝나지 않아요. 왜 어떤 분수는 끝나고 어떤 분수는 끝나지 않을까요?',
        en:'Written as a decimal, 1/3 is 0.333… and never stops. Why do some fractions end and others never do?',
        zh:'把1/3写成小数是0.333……永远写不完。为什么有的分数会终止，有的却不会？' },
      history:{ ko:'분수를 소수로 바꾸면 반드시 끝나거나 같은 마디가 되풀이돼요 — 그 둘뿐이에요. 데데킨트는 수를 크기순으로 늘어놓았을 때 유리수에는 "빈틈"이 있고 실수에는 빈틈이 전혀 없다고 말했어요. 그 빈틈을 메우는 수가 다음에 만날 무리수예요.',
        en:'Turn a fraction into a decimal and it must either stop or repeat a block forever — those are the only two outcomes. Dedekind put it this way: line the numbers up by size and the rationals have gaps, while the reals have none at all. The numbers that fill those gaps are the irrationals you will meet next.',
        zh:'把分数化成小数，结果不是终止就是循环——只有这两种。戴德金说：把数按大小排好，有理数之间有"缝隙"，而实数完全没有缝隙。填补这些缝隙的，就是接下来要认识的无理数。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 9로 나누면 그대로 반복',en:'1) Divide by 9 — it just repeats',zh:'① 除以9就原样重复'},
        head:{ko:'1÷9=0.111…, 7÷9=0.777…',en:'1÷9=0.111…, 7÷9=0.777…',zh:'1÷9=0.111…，7÷9=0.777…'},
        desc:{ko:'소수점 아래에 같은 수들이 반복되는 소수를 <b>순환소수</b>라고 해요. 1÷9를 나눠보면 0.111…, 2÷9는 0.222…, 7÷9는 0.777… — <b>나눈 수(9)와 몫의 반복마디가 나누어지는 수와 똑같아요!</b> 99로 나누면 어떨까요? 23÷99=0.232323… — 이번엔 <b>두 자리씩</b> 반복돼요. 9는 한 자리, 99는 두 자리씩 반복시켜요.',
              en:'A decimal where the same digits repeat forever is a <b>repeating decimal</b>. Try 1÷9=0.111…, 2÷9=0.222…, 7÷9=0.777… — <b>the repeating block matches the number you divided!</b> What about dividing by 99? 23÷99=0.232323… — this time it repeats <b>two digits</b> at a time. 9 repeats one digit; 99 repeats two.',
              zh:'小数点后同样的数字不断重复，就叫<b>循环小数</b>。试试1÷9=0.111…，2÷9=0.222…，7÷9=0.777……<b>循环节正好就是被除数本身！</b>除以99会怎样？23÷99=0.232323……这次是<b>两位两位</b>地重复。9重复一位，99重复两位。'},
        mathSteps:['1÷9 = 0.111…','7÷9 = 0.777…','23÷99 = 0.232323…'],
        result:{ko:'9로 나누면 한 자리씩, 99로 나누면 두 자리씩 그대로 반복돼요.',en:'÷9 repeats one digit, ÷99 repeats two — matching the dividend.',zh:'除以9重复一位，除以99重复两位，都和被除数一样。'},
        book:{ko:'분모를 소인수분해했을 때 소인수가 2와 5뿐이면 나누어떨어지는 소수(유한소수)가 돼요. 9나 99처럼 다른 소인수(3, 11…)가 있으면 순환소수가 되죠.',
              en:'If a denominator\'s prime factors are only 2 and 5, the decimal terminates (finite). If it has other prime factors (like 3 or 11, as in 9 or 99), it repeats forever.',
              zh:'如果分母的质因数只有2和5，小数就能除尽（有限小数）。如果还有别的质因数（比如3、11，就像9或99那样），就会变成循环小数。'} },

      { tag:{ko:'② 순환소수를 다시 분수로',en:'2) Turn it back into a fraction',zh:'② 把它变回分数'},
        head:{ko:'0.\\overline{3} 은 어떤 분수일까요?',en:'What fraction is 0.\\overline{3}?',zh:'0.\\overline{3}是什么分数？'},
        desc:{ko:'0.333…을 x라고 해봐요. 10을 곱하면 10x=3.333…이 되죠. 이제 <b>10x−x</b>를 하면 반복되는 부분이 통째로 사라져요: 9x=3, 그러니까 x=3/9=<b>1/3</b>! 반복마디가 두 자리(예: 0.232323…)면 100을 곱해서 100x−x를 하면 돼요 — 반복마디 길이만큼 자리를 옮겨 빼는 것이 핵심이에요.',
              en:'Let x=0.333…. Multiply by 10: 10x=3.333…. Now subtract <b>10x−x</b>, and the repeating part vanishes: 9x=3, so x=3/9=<b>1/3</b>! For a two-digit block (like 0.232323…), multiply by 100 and subtract 100x−x — shift by exactly the block\'s length before subtracting.',
              zh:'设x=0.333…。乘以10：10x=3.333…。现在做<b>10x−x</b>，重复的部分就消失了：9x=3，所以x=3/9=<b>1/3</b>！如果循环节是两位（比如0.232323…），就乘100再做100x−x——关键是按循环节的长度移位再相减。'},
        mathSteps:['x = 0.333…','10x = 3.333…','10x−x = 9x = 3','x = 3/9 = 1/3'],
        result:{ko:'0.\\overline{3} = 1/3! 자리를 옮겨 빼면 반복되는 부분이 사라져요.',en:'0.\\overline{3} = 1/3! Shifting and subtracting erases the repeat.',zh:'0.\\overline{3} = 1/3！移位相减，重复部分就消失了。'},
        book:{ko:'이 방정식 방법(10★−★=정수)은 중학교 2학년에서 배우는 내용이에요. 여러분은 벌써 알고 있는 거예요!',
              en:'This equation trick (10★−★=whole number) is taught in middle school — you already know it!',
              zh:'这个方程小技巧（10★−★=整数）是初中才学的——你已经提前会了！'} }
    ],
    rule:{ ko:'① 9·99·999로 나누면 반복마디가 나눈 수 그대로  ② 다른 분모는 긴나눗셈으로 자리를 하나씩 살펴보기  ③ 되돌릴 땐 10★−★로 반복을 지우기',
      en:'① ÷9, ÷99, ÷999 repeat the dividend itself  ② For other divisors, walk through long division digit by digit  ③ To go back, use 10★−★ to erase the repeat',
      zh:'① 除以9、99、999时循环节就是被除数本身  ② 其他除数用长除法逐位查看  ③ 转换回去用10★−★消掉循环' }
  },

  check:{
    fills:[
      { tex:'5 \\div 9 = 0.\\overline{\\square}', answer:5,
        hint:{ ko:'9로 나누면 몫이 나눈 수 그대로', en:'÷9 repeats the dividend', zh:'除以9，商就是被除数本身' } },
      { tex:'17 \\div 99 = 0.\\overline{\\square}', answer:17,
        hint:{ ko:'99로 나누면 두 자리씩 그대로', en:'÷99 repeats two digits at a time', zh:'除以99两位两位重复' } }
    ],
    open:{ ko:'0.\\overline{45}를 방정식으로 분수로 바꾸고, 왜 100을 곱해야 하는지 설명해 봐요.',
      en:'Turn 0.\\overline{45} into a fraction using the equation method, and explain why you multiply by 100.',
      zh:'用方程法把0.\\overline{45}化成分数，说说为什么要乘以100。' },
    openHint:{ ko:'예) x=0.454545…, 100x=45.454545…, 100x−x=99x=45, x=45/99. 반복마디가 두 자리라서 100을 곱해야 자리가 맞아 빼져요.',
      en:'e.g. x=0.454545…, 100x=45.454545…, 100x−x=99x=45, x=45/99. The block is 2 digits, so ×100 lines things up for subtracting.',
      zh:'例）x=0.454545…，100x=45.454545…，100x−x=99x=45，x=45/99。循环节是两位，所以要乘100才能对齐相减。' }
  },

  lab:{
    generator:'adv_repeatDec', level:'main', count:4,
    params:{mode:'digitAt',level:'practice'},
    intro:{
      ko:'특정 소수 자리 숫자를 알아맞혀 봐!',
      en:'Figure out the digit at a specific decimal place!',
      zh:'找出小数点后某一位到底是几！'
    }
  },

  arena:{
    generator:'adv_repeatDec', level:'main', count:8, timeLimit:300,
    params:{mode:'digitAt',level:'main'},
    rule:{ ko:'5분 안에 순환소수 자리 찾기를 모두 풀어요!', en:'Find every repeating-decimal digit in 5 minutes!', zh:'5分钟内找出所有循环小数的位数！' }
  },

  stamp:{ label:{ ko:'순환소수 탐정', en:'Repeating-Decimal Detective', zh:'循环小数侦探' }, coins:36 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'반복 패턴을 딱 찾았어! ♾️',en:'Nailed the pattern!',zh:'找到规律啦！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'몇 자리씩 반복되는지 세어봐!',en:'Count how many digits repeat!',zh:'数数是几位一循环！'}, {ko:'긴나눗셈을 한 단계씩 따라가봐!',en:'Walk through the long division step by step!',zh:'一步步做长除法看看！'} ],
    finish:{ ko:'완벽해! 순환소수 탐정! ♾️✨', en:'Perfect! Repeating-Decimal Detective!', zh:'完美！循环小数侦探！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
