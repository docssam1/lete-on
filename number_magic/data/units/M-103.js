/* Numbers of Magic — 유닛 M-103: x³=1 의 허근 ω (고등 공통수학1 · 과정 43, 2026-09-29)
   근거: docs/high-build-spec.md MD103. 예시는 새로 만들었다. 역사 문단은 널리 알려진 사실만. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-103'] = {
  id:'M-103', tier:'highmath1', level:'43', order:103,
  generator:'md103_omega',
  title:{ ko:'x³=1 의 허근 ω', en:'The Complex Cube Root of Unity ω', zh:'x³=1的虚根ω' },
  subtitle:{ ko:'ω³=1 과 ω²+ω+1=0 두 식이면 충분합니다', en:'ω³=1 and ω²+ω+1=0 are all you need', zh:'有ω³=1和ω²+ω+1=0就够了' },
  icon:'🔱',

  practice:{
    generator:'md103_omega', level:'practice', count:6,
    params:{mode:'basic'},
    intro:{
      ko:'ω 의 지수는 3으로 나눈 나머지만 봅니다. ω+ω² 이 보이면 −1 로 바꿉니다.',
      en:'For powers of ω only the remainder of the exponent divided by 3 matters. Whenever ω+ω² appears, replace it with −1.',
      zh:'ω的指数只看除以3的余数。看到ω+ω²就换成−1。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'세제곱해서 1 이 되는 수는 1 하나뿐일까요? 복소수까지 넓히면 1 말고도 두 개가 더 있습니다. 그 가운데 하나를 ω 라 부르면, 계산이 놀랄 만큼 간단해집니다.',
        en:'Is 1 the only number whose cube is 1? Among complex numbers there are two more. Call one of them ω, and calculations become surprisingly simple.',
        zh:'立方等于1的数只有1吗？扩展到复数还有两个。把其中一个叫作ω，计算就会变得出奇地简单。' },
      history:{ ko:'가우스는 xⁿ=1 꼴 방정식의 근을 연구해 1796년 정십칠각형을 자와 컴퍼스로 작도할 수 있음을 보였습니다.',
        en:'Studying the roots of equations of the form xⁿ=1, Gauss showed in 1796 that a regular 17-gon can be constructed with straightedge and compass.',
        zh:'高斯研究xⁿ=1型方程的根，于1796年证明了正十七边形可以用尺规作图。' }
    },
    stages:[
      { tag:{ko:'① ω 가 만족하는 두 식',en:'1) Two facts about ω',zh:'① ω满足的两个式子'},
        head:{ko:'x^3-1=(x-1)(x^2+x+1)',en:'x^3-1=(x-1)(x^2+x+1)',zh:'x^3-1=(x-1)(x^2+x+1)'},
        desc:{ko:'허근 ω 는 x²+x+1=0 의 근입니다. 그래서 <b>ω²+ω+1=0</b> 이고, x³=1 의 근이므로 <b>ω³=1</b> 입니다.',
              en:'The imaginary root ω is a root of x²+x+1=0, so <b>ω²+ω+1=0</b>; and since it solves x³=1, <b>ω³=1</b>.',
              zh:'虚根ω是x²+x+1=0的根，所以<b>ω²+ω+1=0</b>；又是x³=1的根，所以<b>ω³=1</b>。'},
        mathSteps:['\\omega^3=1', '\\omega^2+\\omega+1=0'],
        result:{ko:'ω+ω²=−1 로도 자주 씁니다!',en:'Often used as ω+ω²=−1!',zh:'也常写成ω+ω²=−1！'},
        book:{ko:'x²+x+1=0 의 두 허근은 서로 켤레이므로 ω 의 켤레 ω̄ 도 근입니다.',
              en:'The two imaginary roots of x²+x+1=0 are conjugates, so ω̄ is a root as well.',
              zh:'x²+x+1=0的两个虚根互为共轭，所以ω̄也是根。'} },

      { tag:{ko:'② 거듭제곱은 셋마다 되풀이',en:'2) Powers repeat every three',zh:'② 幂每三次循环'},
        head:{ko:'\\omega^{100}=\\omega',en:'\\omega^{100}=\\omega',zh:'\\omega^{100}=\\omega'},
        desc:{ko:'100=3×33+1 이므로 ω¹⁰⁰=(ω³)³³·ω=<b>ω</b> 입니다. 지수를 3으로 나눈 나머지만 남습니다.',
              en:'100=3×33+1, so ω¹⁰⁰=(ω³)³³·ω=<b>ω</b>. Only the remainder of the exponent divided by 3 is left.',
              zh:'100=3×33+1，所以ω¹⁰⁰=(ω³)³³·ω=<b>ω</b>。只剩指数除以3的余数。'},
        mathSteps:['\\omega^{100}=(\\omega^3)^{33}\\omega', '=\\omega'],
        result:{ko:'i 는 넷마다, ω 는 셋마다 되풀이됩니다!',en:'i repeats every four, ω every three!',zh:'i每四次循环，ω每三次循环！'},
        book:{ko:'연속한 세 항 ωᵏ+ωᵏ⁺¹+ωᵏ⁺² 은 ωᵏ(1+ω+ω²)=0 입니다.',
              en:'Three consecutive powers ωᵏ+ωᵏ⁺¹+ωᵏ⁺² sum to ωᵏ(1+ω+ω²)=0.',
              zh:'连续三项ωᵏ+ωᵏ⁺¹+ωᵏ⁺²=ωᵏ(1+ω+ω²)=0。'} },

      { tag:{ko:'③ 켤레와 함께 쓰기',en:'3) Working with the conjugate',zh:'③ 与共轭一起用'},
        head:{ko:'\\overline{\\omega}=\\omega^2',en:'\\overline{\\omega}=\\omega^2',zh:'\\overline{\\omega}=\\omega^2'},
        desc:{ko:'두 허근의 합과 곱에서 <b>ω+ω̄=−1, ωω̄=1</b> 입니다. 또 1+ω=−ω² 이므로 분모에 1+ω 가 있으면 −ω² 로 바꿉니다.',
              en:'From the sum and product of the two roots, <b>ω+ω̄=−1 and ωω̄=1</b>. Also 1+ω=−ω², so a denominator 1+ω becomes −ω².',
              zh:'由两个虚根的和与积得<b>ω+ω̄=−1，ωω̄=1</b>。又1+ω=−ω²，分母里的1+ω可换成−ω²。'},
        mathSteps:['\\omega+\\overline{\\omega}=-1', '\\omega\\overline{\\omega}=1'],
        result:{ko:'근과 계수의 관계가 그대로 쓰입니다!',en:'The root–coefficient relations apply directly!',zh:'根与系数的关系直接适用！'},
        book:{ko:'(2+ω)(2+ω²)=4+2(ω+ω²)+ω³=4−2+1=3 처럼 계산합니다.',
              en:'For example (2+ω)(2+ω²)=4+2(ω+ω²)+ω³=4−2+1=3.',
              zh:'例如(2+ω)(2+ω²)=4+2(ω+ω²)+ω³=4−2+1=3。'} }
    ],
    rule:{ ko:'① ω³=1, ω²+ω+1=0  ② 지수는 3으로 나눈 나머지  ③ ω̄=ω², ω+ω̄=−1, ωω̄=1',
      en:'① ω³=1, ω²+ω+1=0  ② Reduce exponents by 3  ③ ω̄=ω², ω+ω̄=−1, ωω̄=1',
      zh:'① ω³=1，ω²+ω+1=0  ② 指数看除以3的余数  ③ ω̄=ω²，ω+ω̄=−1，ωω̄=1' }
  },

  check:{
    fills:[
      { tex:'\\omega^{100}+\\omega^{50}+1=\\square', answer:0,
        hint:{ ko:'ω+ω²+1', en:'ω+ω²+1', zh:'ω+ω²+1' } },
      { tex:'(1+\\omega)(1+\\omega^2)=\\square', answer:1,
        hint:{ ko:'1+(ω+ω²)+ω³', en:'1+(ω+ω²)+ω³', zh:'1+(ω+ω²)+ω³' } }
    ],
    open:{ ko:'1+ω+ω²+…+ω⁸ 의 값을 구하는 과정을 설명해 봅니다.',
      en:'Explain how to find the value of 1+ω+ω²+…+ω⁸.',
      zh:'说说求1+ω+ω²+…+ω⁸的值的过程。' },
    openHint:{ ko:'항이 9 개이므로 셋씩 세 묶음이 모두 0 이 되어 값은 0 입니다.',
      en:'There are 9 terms, three groups of three, each 0, so the value is 0.',
      zh:'共9项，每三项一组共三组都为0，所以值为0。' }
  },

  lab:{
    generator:'md103_omega', level:'main', count:6,
    params:{mode:'powerSum'},
    intro:{
      ko:'연속한 세 항씩 묶어 지우고 남은 항만 계산합니다.',
      en:'Cancel consecutive terms in groups of three and compute only what is left.',
      zh:'连续三项一组消去，只算剩下的项。'
    }
  },

  arena:{
    generator:'md103_omega', level:'main', count:6, timeLimit:420,
    params:{mode:'expr'},
    rule:{ ko:'7분 안에 ω 가 들어간 식의 값을 모두 구합니다!', en:'Evaluate every expression in ω within 7 minutes!', zh:'7分钟内求出所有含ω的式子的值！' }
  },

  stamp:{ label:{ ko:'세 갈래 마법사', en:'Triple Wizard', zh:'三叉魔法师' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'ω 를 자유자재로 다루는구나! 🔱',en:'You handle ω with ease!',zh:'把ω运用自如！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'ω+ω² 은 −1 이야!',en:'ω+ω² is −1!',zh:'ω+ω²等于−1！'}, {ko:'지수를 3으로 나눈 나머지를 봐!',en:'Look at the exponent divided by 3!',zh:'看指数除以3的余数！'} ],
    finish:{ ko:'완벽해! 세 갈래 마법사! 🔱✨', en:'Perfect! Triple Wizard!', zh:'完美！三叉魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
