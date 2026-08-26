/* Numbers of Magic — 유닛 M-24: 나머지정리 (고등 W11 · 공통수학1 다항식) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-24'] = {
  id:'M-24', tier:'highmath1', level:'37', order:24,
  generator:'md24_remainderTheorem',
  title:{ ko:'나머지정리', en:'The Remainder Theorem', zh:'余数定理' },
  subtitle:{ ko:'나눗셈을 다 하지 않아도 대입 한 번으로 나머지를 알아요', en:'One substitution finds the remainder — no long division needed', zh:'不用做完整除法，代入一次就知道余数' },
  icon:'🎯',

  practice:{
    generator:'md24_remainderTheorem', level:'practice', count:5,
    params:{mode:'direct'},
    intro:{
      ko:'P(x)를 (x-2)로 나눈 나머지가 궁금하다면? 나눗셈을 안 하고 그냥 P(2)만 계산하면 바로 나와요!',
      en:'Want the remainder of P(x) divided by (x-2)? Skip the division — just compute P(2)!',
      zh:'想知道P(x)除以(x-2)的余数？不用做除法，直接算P(2)就行！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'P(x)=x²+3x-1을 (x-2)로 나눈 나머지가 궁금해요. 조립제법으로 나눌 수도 있지만, 더 빠른 지름길이 있대요 — 나눗셈을 아예 안 하고 나머지를 구할 수 있을까요?',
        en:'You want the remainder when P(x)=x²+3x-1 is divided by (x-2). You could use synthetic division, but there\'s a faster shortcut — can you find the remainder without dividing at all?',
        zh:'想知道P(x)=x²+3x-1除以(x-2)的余数。用综合除法当然可以，但还有更快的捷径——能不做除法就求出余数吗？' },
      history:{ ko:'"나머지 = P(2)"라는 사실은 나눗셈의 구조 자체에서 나와요. P(x)=(x-2)×(몫)+나머지인데, x에 2를 넣으면 (x-2) 부분이 0이 돼서 몫이 통째로 사라지고 나머지만 남거든요.',
        en:'The fact that "remainder = P(2)" comes straight from the structure of division itself. Since P(x)=(x-2)×(quotient)+remainder, plugging in x=2 makes the (x-2) part zero — the entire quotient vanishes, leaving only the remainder.',
        zh:'"余数=P(2)"这个事实源自除法本身的结构。因为P(x)=(x-2)×(商)+余数，代入x=2会让(x-2)那部分变成0——整个商都消失了，只剩下余数。' }
    },
    stages:[
      { tag:{ko:'① P(2)를 계산하면 그게 나머지',en:'1) P(2) is the remainder',zh:'① P(2)就是余数'},
        head:{ko:'P(2) = 4+6-1 = 9',en:'P(2) = 4+6-1 = 9',zh:'P(2) = 4+6-1 = 9'},
        desc:{ko:'P(x)=x²+3x-1에 x=2를 대입하면 2²+3×2-1=4+6-1=<b>9</b>. 조립제법으로 직접 나눠도 나머지는 똑같이 9가 나와요 — 훨씬 빠르죠.',
              en:'Substitute x=2 into P(x)=x²+3x-1: 2²+3×2-1=4+6-1=<b>9</b>. Do synthetic division directly and the remainder comes out the same, 9 — just much faster.',
              zh:'把x=2代入P(x)=x²+3x-1：2²+3×2-1=4+6-1=<b>9</b>。直接用综合除法算，余数同样是9——但快得多。'},
        mathSteps:['P(2)=2^2+3\\times2-1', '=4+6-1', '=9'],
        result:{ko:'P(a)를 계산하면 (x-a)로 나눈 나머지가 바로 나와요!',en:'Computing P(a) gives you the remainder of division by (x-a), instantly!',zh:'算出P(a)，就是除以(x-a)的余数！'},
        book:{ko:'P(x)를 (x-a)로 나눈 나머지 = P(a) — 이걸 나머지정리라고 해요.',
              en:'The remainder of P(x) divided by (x-a) equals P(a) — this is the Remainder Theorem.',
              zh:'P(x)除以(x-a)的余数=P(a)——这就是余数定理。'} },

      { tag:{ko:'② 왜 그럴까? 나눗셈 구조에서 확인',en:'2) Why? Check the division structure',zh:'② 为什么？看除法结构'},
        head:{ko:'P(x) = (x-2)\\times Q(x) + R',en:'P(x) = (x-2)\\times Q(x) + R',zh:'P(x) = (x-2)\\times Q(x) + R'},
        desc:{ko:'나눗셈은 항상 이 꼴로 쓸 수 있어요. 여기에 x=2를 넣으면 (x-2)가 0이 되어 앞부분이 통째로 사라지고, <b>P(2)=R</b>만 남아요.',
              en:'Division can always be written this way. Substituting x=2 makes (x-2) zero, wiping out the entire first term, leaving only <b>P(2)=R</b>.',
              zh:'除法总能写成这个形式。代入x=2会让(x-2)变成0，前面整项消失，只剩下<b>P(2)=R</b>。'},
        mathSteps:['P(2)=(2-2)\\times Q(2)+R', '=0\\times Q(2)+R', '=R'],
        result:{ko:'대입하면 몫은 사라지고 나머지만 남는 게 원리예요!',en:'Substituting makes the quotient vanish, leaving only the remainder — that\'s the principle!',zh:'代入后商消失，只剩余数——这就是原理！'},
        book:{ko:'같은 원리로 (x-a)가 P(x)의 인수인지도 알 수 있어요 — P(a)=0이면 (x-a)로 나누어떨어져요(인수정리).',
              en:'The same idea also tells you whether (x-a) is a factor of P(x) — if P(a)=0, then (x-a) divides P(x) exactly (the Factor Theorem).',
              zh:'同样的原理还能判断(x-a)是否是P(x)的因式——若P(a)=0，就能被(x-a)整除(因式定理)。'} }
    ],
    rule:{ ko:'① P(x)를 (x-a)로 나눈 나머지는 P(a)  ② 나눗셈 없이 대입 한 번으로 끝난다',
      en:'① The remainder of P(x) divided by (x-a) is P(a)  ② One substitution — no division needed',
      zh:'① P(x)除以(x-a)的余数是P(a)  ② 一次代入即可，不用做除法' }
  },

  check:{
    fills:[
      { tex:'P(x) = x^2 - 4x + 6, \\;\\; P(3) = \\square', answer:3,
        hint:{ ko:'9-12+6=3', en:'9-12+6=3', zh:'9-12+6=3' } },
      { tex:'P(x) = x^3 + 2x - 5, \\;\\; P(2) = \\square', answer:7,
        hint:{ ko:'8+4-5=7', en:'8+4-5=7', zh:'8+4-5=7' } }
    ],
    open:{ ko:'P(x)=x²+kx-3을 (x-1)로 나눈 나머지가 2일 때 k를 구하는 과정을 설명해봐요.',
      en:'Explain how to find k when P(x)=x²+kx-3 divided by (x-1) leaves remainder 2.',
      zh:'说说P(x)=x²+kx-3除以(x-1)余数为2时求k的过程。' },
    openHint:{ ko:'P(1)=1+k-3=k-2. k-2=2이므로 k=4',
      en:'P(1)=1+k-3=k-2. Since k-2=2, k=4',
      zh:'P(1)=1+k-3=k-2。因为k-2=2，所以k=4' }
  },

  lab:{
    generator:'md24_remainderTheorem', level:'main', count:4,
    params:{mode:'directCubic'},
    intro:{
      ko:'이번엔 삼차식! 차수가 늘어도 원리는 똑같아 — 그냥 대입만 하면 돼.',
      en:'A cubic this time! The degree changes but the principle is the same — just substitute.',
      zh:'这次是三次式！次数变了原理不变——直接代入就行。'
    }
  },

  arena:{
    generator:'md24_remainderTheorem', level:'main', count:8, timeLimit:300,
    params:{mode:'findUnknown'},
    rule:{ ko:'5분 안에 나머지로 계수를 역산하는 문제를 모두 풀어요!', en:'Solve all the coefficient-from-remainder problems in 5 minutes!', zh:'5分钟内解答所有由余数反求系数的题！' }
  },

  stamp:{ label:{ ko:'나머지정리 명사수', en:'Remainder Sharpshooter', zh:'余数定理神射手' }, coins:49 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'나눗셈 없이 한 번에 맞혔구나! 🎯',en:'You nailed it in one shot, no division needed!',zh:'不用除法一击命中！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'나머지를 구할 땐 그냥 P(a)를 계산하면 돼!',en:'To find the remainder, just compute P(a)!',zh:'求余数直接算P(a)就行！'}, {ko:'대입할 값은 (x-a)에서 a야, 부호에 주의해!',en:'The value to substitute is a from (x-a) — watch the sign!',zh:'代入的值是(x-a)中的a，注意符号！'} ],
    finish:{ ko:'완벽해! 나머지정리 명사수! 🎯✨', en:'Perfect! Remainder Sharpshooter!', zh:'完美！余数定理神射手！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
