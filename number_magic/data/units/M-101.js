/* Numbers of Magic — 유닛 M-101: 고차방정식 (고등 공통수학1 · 과정 43, 2026-09-29)
   근거: docs/high-build-spec.md MD101. 예시는 새로 만들었다. 역사 문단은 널리 알려진 사실만. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-101'] = {
  id:'M-101', tier:'highmath1', level:'43', order:101,
  generator:'md101_higherEq',
  title:{ ko:'고차방정식', en:'Higher-Degree Equations', zh:'高次方程' },
  subtitle:{ ko:'인수분해로 차수를 낮추어 풉니다', en:'Factor to lower the degree, then solve', zh:'用因式分解降次求解' },
  icon:'🧗',

  practice:{
    generator:'md101_higherEq', level:'practice', count:6,
    params:{mode:'oneRoot'},
    intro:{
      ko:'상수항의 약수를 차례로 넣어 P(a)=0 이 되는 정수 a 를 찾습니다. 그 a 가 실근입니다.',
      en:'Substitute the divisors of the constant term one by one to find the integer a with P(a)=0. That a is the real root.',
      zh:'依次代入常数项的约数，找出使P(a)=0的整数a，它就是实根。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'이차방정식에는 근의 공식이 있지만, 삼차·사차방정식은 대개 인수분해로 풉니다. 근 하나만 찾으면 식이 한 차수 낮아지고, 이차방정식까지 내려오면 익숙한 방법으로 끝낼 수 있습니다.',
        en:'Quadratics have a formula, but cubic and quartic equations are usually solved by factoring. Finding one root lowers the degree by one, and once you reach a quadratic you can finish with familiar tools.',
        zh:'二次方程有求根公式，而三次、四次方程通常用因式分解来解。找到一个根就能降一次，降到二次方程就能用熟悉的方法解完。' },
      history:{ ko:'16세기 이탈리아에서 타르탈리아와 카르다노가 삼차방정식의 풀이를, 페라리가 사차방정식의 풀이를 찾았고, 이 내용은 카르다노의 『아르스 마그나』(1545)에 실렸습니다. 1824년 아벨은 오차 이상의 방정식에는 일반적인 근의 공식이 없음을 증명했습니다.',
        en:'In 16th-century Italy, Tartaglia and Cardano found how to solve cubic equations and Ferrari found how to solve quartics; the methods appeared in Cardano\'s Ars Magna (1545). In 1824 Abel proved that equations of degree five or more have no general formula for their roots.',
        zh:'16世纪的意大利，塔尔塔利亚和卡尔达诺找到了三次方程的解法，费拉里找到了四次方程的解法，这些内容刊登在卡尔达诺的《大术》(1545)中。1824年阿贝尔证明了五次及以上的方程没有一般的求根公式。' }
    },
    stages:[
      { tag:{ko:'① 인수정리로 근 하나 찾기',en:'1) Find one root with the factor theorem',zh:'① 用因式定理找一个根'},
        head:{ko:'x^3-2x^2-5x+6=0',en:'x^3-2x^2-5x+6=0',zh:'x^3-2x^2-5x+6=0'},
        desc:{ko:'상수항 6 의 약수 ±1, ±2, ±3, ±6 을 넣어 봅니다. x=1 이면 1−2−5+6=0 이므로 <b>x−1 이 인수</b>입니다.',
              en:'Try the divisors ±1, ±2, ±3, ±6 of the constant 6. At x=1 we get 1−2−5+6=0, so <b>x−1 is a factor</b>.',
              zh:'代入常数6的约数±1、±2、±3、±6。x=1时1−2−5+6=0，所以<b>x−1是因式</b>。'},
        mathSteps:['P(1)=1-2-5+6=0'],
        result:{ko:'근 하나가 곧 인수 하나입니다!',en:'One root means one factor!',zh:'一个根就是一个因式！'},
        book:{ko:'정수 계수이고 최고차항의 계수가 1 이면, 정수 근은 상수항의 약수 가운데 있습니다.',
              en:'With integer coefficients and leading coefficient 1, any integer root divides the constant term.',
              zh:'整系数且首项系数为1时，整数根一定在常数项的约数之中。'} },

      { tag:{ko:'② 조립제법으로 차수 낮추기',en:'2) Lower the degree by synthetic division',zh:'② 用综合除法降次'},
        head:{ko:'(x-1)(x^2-x-6)=0',en:'(x-1)(x^2-x-6)=0',zh:'(x-1)(x^2-x-6)=0'},
        desc:{ko:'조립제법으로 나누면 몫이 x²−x−6 입니다. 이것을 다시 인수분해하면 (x+2)(x−3) 이므로 근은 <b>1, −2, 3</b> 입니다.',
              en:'Synthetic division gives the quotient x²−x−6, which factors as (x+2)(x−3). The roots are <b>1, −2, 3</b>.',
              zh:'用综合除法得商x²−x−6，再分解为(x+2)(x−3)，所以根是<b>1、−2、3</b>。'},
        mathSteps:['=(x-1)(x+2)(x-3)=0', 'x=1,\\ -2,\\ 3'],
        result:{ko:'삼차식이 일차식 셋으로 쪼개졌습니다!',en:'The cubic split into three linear factors!',zh:'三次式拆成了三个一次式！'},
        book:{ko:'남은 이차식의 판별식이 음수이면 실근은 처음 찾은 하나뿐입니다.',
              en:'If the remaining quadratic has a negative discriminant, the first root is the only real root.',
              zh:'剩下的二次式判别式为负时，实根只有最初找到的那一个。'} },

      { tag:{ko:'③ 복이차방정식은 치환',en:'3) Substitute in a biquadratic',zh:'③ 双二次方程用换元'},
        head:{ko:'x^4-5x^2+4=0',en:'x^4-5x^2+4=0',zh:'x^4-5x^2+4=0'},
        desc:{ko:'x²=t 로 두면 t²−5t+4=(t−1)(t−4)=0 입니다. x²=1, x²=4 에서 <b>x=±1, ±2</b> 입니다.',
              en:'Put t=x² to get t²−5t+4=(t−1)(t−4)=0. From x²=1 and x²=4, <b>x=±1, ±2</b>.',
              zh:'令t=x²得t²−5t+4=(t−1)(t−4)=0。由x²=1、x²=4得<b>x=±1、±2</b>。'},
        mathSteps:['t^2-5t+4=0', '(t-1)(t-4)=0', 'x=\\pm 1,\\ \\pm 2'],
        result:{ko:'x² 을 한 덩어리로 보면 이차방정식입니다!',en:'Treat x² as one block and it is a quadratic!',zh:'把x²看成一个整体，就是二次方程！'},
        book:{ko:'t 가 음수로 나오면 x²=t 는 실근이 없습니다.',
              en:'If t comes out negative, x²=t has no real root.',
              zh:'t为负数时，x²=t没有实根。'} }
    ],
    rule:{ ko:'① 상수항의 약수로 근 하나 찾기  ② 조립제법으로 차수 낮추기  ③ x⁴ 꼴은 x²=t 로 치환합니다',
      en:'① Find a root among divisors of the constant  ② Lower the degree by synthetic division  ③ For x⁴ forms, substitute t=x²',
      zh:'① 在常数项的约数中找一个根  ② 用综合除法降次  ③ x⁴型令t=x²换元' }
  },

  check:{
    fills:[
      { tex:'x^3-7x+6=0 \\;\\Rightarrow\\; x=1,\\ 2,\\ \\square', answer:-3,
        hint:{ ko:'(x−1)(x−2)(x+3)=0', en:'(x−1)(x−2)(x+3)=0', zh:'(x−1)(x−2)(x+3)=0' } },
      { tex:'x^4-10x^2+9=0,\\ x>2 \\;\\Rightarrow\\; x=\\square', answer:3,
        hint:{ ko:'(x²−1)(x²−9)=0', en:'(x²−1)(x²−9)=0', zh:'(x²−1)(x²−9)=0' } }
    ],
    open:{ ko:'x³=8 의 근을 모두 구하는 과정을 설명해 봅니다.',
      en:'Explain how to find all the roots of x³=8.',
      zh:'说说求x³=8的所有根的过程。' },
    openHint:{ ko:'x³−8=(x−2)(x²+2x+4)=0 이므로 x=2 와, 판별식이 음수인 x²+2x+4=0 의 두 허근입니다.',
      en:'x³−8=(x−2)(x²+2x+4)=0, so x=2 and the two imaginary roots of x²+2x+4=0, whose discriminant is negative.',
      zh:'x³−8=(x−2)(x²+2x+4)=0，所以x=2，以及判别式为负的x²+2x+4=0的两个虚根。' }
  },

  lab:{
    generator:'md101_higherEq', level:'main', count:6,
    params:{mode:'largest'},
    intro:{
      ko:'세 근이 모두 정수입니다. 근 하나를 찾아 인수분해하고 가장 큰 근이나 가장 작은 근을 고릅니다.',
      en:'All three roots are integers. Find one, factor, and pick the largest or smallest root.',
      zh:'三个根都是整数。找出一个根并分解，选出最大或最小的根。'
    }
  },

  arena:{
    generator:'md101_higherEq', level:'main', count:6, timeLimit:480,
    params:{mode:'biquad'},
    rule:{ ko:'8분 안에 x²=t 치환으로 복이차방정식을 모두 풉니다!', en:'Solve every biquadratic by substituting t=x² within 8 minutes!', zh:'8分钟内用t=x²换元解完所有双二次方程！' }
  },

  stamp:{ label:{ ko:'차수 등반가', en:'Degree Climber', zh:'降次攀登者' }, coins:51 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'차수를 한 칸씩 잘 내렸구나! 🧗',en:'You stepped the degree down perfectly!',zh:'一步步降次，做得很好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'상수항의 약수를 하나씩 넣어 봐!',en:'Try the divisors of the constant term one by one!',zh:'把常数项的约数一个个代进去试试！'}, {ko:'x²=t 로 바꾸면 이차방정식이 돼!',en:'Put t=x² and it becomes a quadratic!',zh:'令t=x²就变成二次方程了！'} ],
    finish:{ ko:'완벽해! 차수 등반가! 🧗✨', en:'Perfect! Degree Climber!', zh:'完美！降次攀登者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
