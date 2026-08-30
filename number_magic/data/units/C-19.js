/* Numbers of Magic — 유닛 C-19: 약분 나눗셈 (중급 E 챕터2) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-19'] = {
  id:'C-19', tier:'intermediate', level:'C', order:19,
  generator:'ml_div_simplify',
  title:{ ko:'약분 나눗셈', en:'Simplify-First Division', zh:'约分除法' },
  subtitle:{ ko:'84÷12: 양쪽을 같은 수로 줄이면 7÷1처럼 쉬워져요!', en:'84÷12: shrink both sides equally and it becomes as easy as 7÷1!', zh:'84÷12：两边同时缩小，就像7÷1一样简单！' },
  icon:'⚖️',

  practice:{
    generator:'ml_div_simplify', level:'practice', count:5,
    params:{},
    intro:{
      ko:'나누어지는 수와 나누는 수를 같은 수로 줄여도 몫은 변하지 않아. 작게 만들어서 쉽게 나누자! 준비됐지?',
      en:"Shrinking both the dividend and divisor by the same factor keeps the quotient unchanged. Make it small, make it easy! Ready?",
      zh:'被除数和除数同时缩小相同的倍数，商不变。缩小了就好除了！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 몫은 변하지 않아요',en:'1) The quotient never changes',zh:'① 商不会变'},
        head:{ko:'84÷12 = 42÷6 = 21÷3 = 7',en:'84÷12 = 42÷6 = 21÷3 = 7',zh:'84÷12 = 42÷6 = 21÷3 = 7'},
        desc:{ko:'놀라운 사실: <b>양쪽을 같은 수로 나눠도 몫은 그대로</b>예요! 84÷12에서 양쪽을 2로 나누면 42÷6, 또 2로 나누면 21÷3 = <b>7</b>. 사탕 84개를 12명이 나누나, 42개를 6명이 나누나 한 사람 몫은 똑같죠! 이렇게 <b>작은 나눗셈으로 줄여서</b> 풀어요.',
              en:'Amazing fact: <b>divide both sides by the same number and the quotient stays the same</b>! From 84÷12, halve both: 42÷6; halve again: 21÷3 = <b>7</b>. Sharing 84 sweets among 12 kids or 42 among 6 — each child gets the same! So we <b>shrink to a small division</b> and solve.',
              zh:'惊人的事实：<b>两边同除以一个数，商不变</b>！84÷12两边÷2得42÷6，再÷2得21÷3 = <b>7</b>。84颗糖分给12人，和42颗分给6人，每人分到的一样多！所以我们<b>缩成小除法</b>来解。'},
        mathSteps:['84 ÷ 12',{ko:'= 42 ÷ 6  (양쪽 ÷2)',en:'= 42 ÷ 6 \\text{ (both ÷2)}',zh:'= 42 ÷ 6（两边÷2）'},{ko:'= 21 ÷ 3  (양쪽 ÷2)',en:'= 21 ÷ 3 \\text{ (both ÷2)}',zh:'= 21 ÷ 3（两边÷2）'},'= 7'],
        result:{ko:'84÷12=7! 양쪽을 똑같이 줄이면 몫 그대로.',en:'84÷12=7! Shrink both equally, the quotient survives.',zh:'84÷12=7！两边同缩，商不变。'},
        book:{ko:'원리: a÷b = (a÷k)÷(b÷k). 분수로 보면 84/12를 약분하는 것과 똑같아요 — 그래서 "약분 나눗셈"이라 불러요.',
              en:'Principle: a÷b = (a÷k)÷(b÷k). In fraction form this is exactly simplifying 84/12 — hence "simplify-first division".',
              zh:'原理：a÷b = (a÷k)÷(b÷k)。用分数看就是给84/12约分——所以叫"约分除法"。'} },

      { tag:{ko:'② 무엇으로 줄일까?',en:'2) What to shrink by?',zh:'② 用什么缩小？'},
        head:{ko:'2로, 3으로, 될 때까지!',en:'By 2, by 3 — as far as it goes!',zh:'÷2、÷3，能除就除！'},
        desc:{ko:'제일 쉬운 방법: <b>둘 다 짝수면 2로</b> 계속 줄여요. 96÷12 → 48÷6 → 24÷3. 이제 2로는 안 되지만 <b>둘 다 3의 배수</b>! → 8÷1 = <b>8</b>. 2, 3, 5 같은 작은 수로 차근차근 줄이면 어느새 한 자리 나눗셈이 돼요.',
              en:'Easiest recipe: <b>while both are even, keep halving</b>. 96÷12 → 48÷6 → 24÷3. No more halving, but <b>both are multiples of 3</b>! → 8÷1 = <b>8</b>. Shrinking step by step with small numbers like 2, 3, 5 soon leaves a one-digit division.',
              zh:'最简单的做法：<b>两边都是偶数就一直÷2</b>。96÷12 → 48÷6 → 24÷3。不能再÷2了，但<b>都是3的倍数</b>！→ 8÷1 = <b>8</b>。用2、3、5这些小数一步步缩，很快就变成一位数除法。'},
        mathSteps:['96 ÷ 12','= 48 ÷ 6  (÷2)','= 24 ÷ 3  (÷2)','= 8 ÷ 1 = 8  (÷3)'],
        result:{ko:'96÷12=8! 짝수면 반으로, 3의 배수면 3으로.',en:'96÷12=8! Halve while even; divide by 3 when you can.',zh:'96÷12=8！是偶数就折半，是3的倍数就÷3。'},
        book:{ko:'배수 판별 마법: 짝수 = 끝자리가 0,2,4,6,8. 3의 배수 = 자릿수 합이 3의 배수(예: 96 → 9+6=15 ✓). 5의 배수 = 끝자리가 0,5.',
              en:'Divisibility magic: even = ends in 0,2,4,6,8. Multiple of 3 = digit sum divisible by 3 (96 → 9+6=15 ✓). Multiple of 5 = ends in 0 or 5.',
              zh:'倍数判别魔法：偶数=末位0,2,4,6,8。3的倍数=各位数字之和是3的倍数(96→9+6=15✓)。5的倍数=末位0或5。'} },

      { tag:{ko:'③ 한 번에 크게 줄이기',en:'3) One big shrink',zh:'③ 一次大缩'},
        head:{ko:'최대공약수를 알면 지름길!',en:'Knowing the GCD is the shortcut!',zh:'知道最大公约数就是捷径！'},
        desc:{ko:'익숙해지면 <b>한 번에 크게</b> 줄일 수 있어요. 72÷12에서 12가 둘 다의 약수임을 바로 보면: 72÷12 → 6÷1 = <b>6</b>. 이 "가장 크게 줄일 수 있는 수"가 <b>최대공약수(GCD)</b>예요. 구구단이 밝을수록 큰 공약수가 한눈에 보인답니다!',
              en:'With practice you can shrink <b>big in one step</b>. Seeing that 12 divides both in 72÷12: → 6÷1 = <b>6</b>. That "biggest possible shrinker" is the <b>greatest common divisor (GCD)</b>. The brighter your times tables, the faster big common factors jump out!',
              zh:'熟练后可以<b>一步大缩</b>。在72÷12中一眼看出12是公约数：→ 6÷1 = <b>6</b>。这个"能缩的最大的数"就是<b>最大公约数(GCD)</b>。口诀越熟，大公约数越容易一眼看出！'},
        mathSteps:['72 ÷ 12',{ko:'양쪽 ÷12 (최대공약수)',en:'\\text{both ÷12 (the GCD)}',zh:'两边÷12（最大公约数）'},'= 6 ÷ 1','= 6'],
        result:{ko:'72÷12=6! 최대공약수로 한 방에 끝.',en:'72÷12=6! One shot with the GCD.',zh:'72÷12=6！用最大公约数一步到位。'},
        book:null }
    ],
    rule:{ ko:'① 양쪽을 같은 수로 나눠도 몫 불변  ② 짝수면 ÷2, 3의 배수면 ÷3 반복  ③ 공약수가 크면 한 번에 줄이기',
      en:'① Dividing both sides equally keeps the quotient  ② Repeat ÷2 while even, ÷3 when possible  ③ A big common factor shrinks it in one step',
      zh:'① 两边同除商不变  ② 偶数÷2、3的倍数÷3反复进行  ③ 公约数大就一步缩小' }
  },

  check:{
    fills:[
      { tex:'72 \\div 8 = \\square', answer:9,
        hint:{ ko:'36÷4 → 18÷2 → 9÷1', en:'36÷4 → 18÷2 → 9÷1', zh:'36÷4 → 18÷2 → 9÷1' } },
      { tex:'60 \\div 12 = \\square', answer:5,
        hint:{ ko:'30÷6 → 15÷3 → 5÷1', en:'30÷6 → 15÷3 → 5÷1', zh:'30÷6 → 15÷3 → 5÷1' } }
    ],
    open:{ ko:'양쪽을 같은 수로 나눠도 몫이 변하지 않는 이유를 사탕 나누기 이야기로 설명해 봐요.',
      en:'Using a sweet-sharing story, explain why shrinking both sides equally keeps the quotient.',
      zh:'用分糖果的故事解释为什么两边同时缩小商不变。' },
    openHint:{ ko:'예) 사탕 84개를 12명이 나누면 한 명당 7개. 사람도 절반(6명), 사탕도 절반(42개)이 되면 여전히 한 명당 7개. 양쪽이 같은 비율로 줄면 한 사람 몫은 그대로예요.',
      en:'e.g. 84 sweets among 12 children is 7 each. Halve both — 42 sweets, 6 children — still 7 each. Equal shrinking on both sides leaves each share unchanged.',
      zh:'例）84颗糖分12人，每人7颗。都减半——42颗分6人——还是每人7颗。两边按同比例缩小，每人的份额不变。' }
  },

  lab:{
    generator:'ml_div_simplify', level:'main', count:4,
    params:{},
    intro:{
      ko:'약분 나눗셈 마법! 양쪽을 줄여서 쉽게 만들어봐.',
      en:'Simplify-first magic! Shrink both sides to make it easy.',
      zh:'约分除法魔法！两边缩小变简单。'
    }
  },

  arena:{
    generator:'ml_div_simplify', level:'main', count:8, timeLimit:300,
    params:{},
    rule:{ ko:'5분 안에 약분 나눗셈 문제를 모두 풀어요!', en:'Solve all simplify-division problems in 5 minutes!', zh:'5分钟内解答所有约分除法题！' }
  },

  stamp:{ label:{ ko:'약분 마법사', en:'Simplify Wizard', zh:'约分魔法师' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'가볍게 줄였어! ⚖️',en:'Shrunk it nicely!',zh:'缩得漂亮！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'둘 다 짝수면 반으로!',en:'Both even? Halve them!',zh:'都是偶数就折半！'}, {ko:'양쪽을 같은 수로 줄여야 해!',en:'Shrink both by the same number!',zh:'两边要除以同一个数！'} ],
    finish:{ ko:'완벽해! 약분 마법사! ⚖️✨', en:'Perfect! Simplify Wizard!', zh:'完美！约分魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
