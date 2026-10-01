/* Numbers of Magic — 유닛 M-93: 인수정리 (고등 공통수학1 · 과정 39 나머지정리와 인수분해, 2026-09-29)
   근거: docs/high-build-spec.md MD93. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-93'] = {
  id:'M-93', tier:'highmath1', level:'39', order:93,
  generator:'md93_factorTheorem',
  title:{ ko:'인수정리', en:'The Factor Theorem', zh:'因式定理' },
  subtitle:{ ko:'P(α)=0이면 x−α가 인수입니다', en:'If P(α)=0, then x−α is a factor', zh:'若P(α)=0，则x−α是因式' },
  icon:'🔑',

  practice:{
    generator:'md93_factorTheorem', level:'practice', count:5,
    params:{mode:'coef'},
    intro:{
      ko:'x−α가 인수라는 말은 P(α)=0이라는 말과 같습니다. α를 넣고 0과 같다고 놓습니다.',
      en:'Saying x−α is a factor is the same as saying P(α)=0. Substitute α and set the result equal to 0.',
      zh:'x−α是因式等价于P(α)=0。代入α，令结果等于0。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'P(x)=x³−2x²−x+2입니다. x=1을 넣어 보면 1−2−1+2=0입니다. 나머지가 0이라는 것은 x−1로 나누어떨어진다는 뜻입니다. 삼차식의 인수분해가 여기서 시작됩니다.',
        en:'Take P(x)=x³−2x²−x+2. Putting x=1 gives 1−2−1+2=0. A remainder of 0 means P(x) is divisible by x−1 — this is where factoring a cubic begins.',
        zh:'设P(x)=x³−2x²−x+2。代入x=1得1−2−1+2=0。余数为0说明能被x−1整除——三次式的因式分解就从这里开始。' },
      history:{ ko:'인수정리는 나머지정리에서 나머지가 0인 경우입니다. P(x)=(x−α)Q(x)+P(α)이므로 P(α)=0이면 P(x)=(x−α)Q(x)가 되어 x−α가 인수가 됩니다.',
        en:'The factor theorem is the remainder theorem when the remainder is 0. Since P(x)=(x−α)Q(x)+P(α), P(α)=0 gives P(x)=(x−α)Q(x), so x−α is a factor.',
        zh:'因式定理就是余数定理中余数为0的情形。因为P(x)=(x−α)Q(x)+P(α)，P(α)=0时P(x)=(x−α)Q(x)，x−α就是因式。' }
    },
    stages:[
      { tag:{ko:'① 인수라는 조건 = P(α)=0',en:'1) Being a factor means P(α)=0',zh:'① 是因式 = P(α)=0'},
        head:{ko:'P(x)=x^3+kx^2-4,\\ P(2)=0',en:'P(x)=x^3+kx^2-4,\\ P(2)=0',zh:'P(x)=x^3+kx^2-4,\\ P(2)=0'},
        desc:{ko:'x−2가 인수이면 P(2)=0입니다. 8+4k−4=0에서 <b>k=−1</b>입니다.',
              en:'If x−2 is a factor then P(2)=0: 8+4k−4=0, so <b>k=−1</b>.',
              zh:'若x−2是因式则P(2)=0：8+4k−4=0，<b>k=−1</b>。'},
        mathSteps:['P(2)=8+4k-4=0', '4k=-4', 'k=-1'],
        result:{ko:'인수 조건 하나가 방정식 하나가 됩니다!',en:'One factor condition becomes one equation!',zh:'一个因式条件就是一个方程！'},
        book:{ko:'x+3이 인수라면 x−(−3)이므로 P(−3)=0입니다. 부호에 주의합니다.',
              en:'If x+3 is a factor, that is x−(−3), so P(−3)=0. Watch the sign.',
              zh:'若x+3是因式，即x−(−3)，所以P(−3)=0。注意符号。'} },

      { tag:{ko:'② 정수 근은 상수항의 약수에서 찾는다',en:'2) Integer roots come from divisors of the constant',zh:'② 整数根在常数项的约数中找'},
        head:{ko:'x^3-2x^2-x+2:\\ \\pm1,\\ \\pm2',en:'x^3-2x^2-x+2:\\ \\pm1,\\ \\pm2',zh:'x^3-2x^2-x+2:\\ \\pm1,\\ \\pm2'},
        desc:{ko:'최고차항의 계수가 1이면 정수 근은 상수항 2의 약수 ±1, ±2 가운데 있습니다. 차례로 넣어 보면 <b>P(1)=0</b>입니다.',
              en:'With leading coefficient 1, any integer root is among the divisors ±1, ±2 of the constant 2. Trying them in turn, <b>P(1)=0</b>.',
              zh:'最高次项系数为1时，整数根在常数项2的约数±1、±2之中。依次代入得<b>P(1)=0</b>。'},
        mathSteps:['P(1)=1-2-1+2=0'],
        result:{ko:'근 하나를 찾으면 x−1이라는 인수 하나가 생깁니다!',en:'One root found means one factor, x−1!',zh:'找到一个根就得到一个因式x−1！'},
        book:{ko:'상수항의 약수를 작은 수부터 넣어 보면 빨리 찾습니다.',
              en:'Trying the divisors from the smallest up usually finds it quickly.',
              zh:'从小的约数开始代入，通常很快就能找到。'} },

      { tag:{ko:'③ 조립제법으로 나머지 이차식',en:'3) Synthetic division gives the remaining quadratic',zh:'③ 用综合除法求剩下的二次式'},
        head:{ko:'x^3-2x^2-x+2=(x-1)(x^2-x-2)',en:'x^3-2x^2-x+2=(x-1)(x^2-x-2)',zh:'x^3-2x^2-x+2=(x-1)(x^2-x-2)'},
        desc:{ko:'계수 1, −2, −1, 2를 1로 조립제법하면 몫의 계수는 1, −1, −2이고 나머지는 0입니다. 몫 x²−x−2를 다시 인수분해하면 (x−2)(x+1)입니다.',
              en:'Synthetic division of the coefficients 1, −2, −1, 2 by 1 gives quotient coefficients 1, −1, −2 and remainder 0. The quotient x²−x−2 factors again as (x−2)(x+1).',
              zh:'把系数1、−2、−1、2用1做综合除法，商的系数是1、−1、−2，余数为0。商x²−x−2再分解为(x−2)(x+1)。'},
        mathSteps:['=(x-1)(x^2-x-2)', '=(x-1)(x-2)(x+1)'],
        result:{ko:'삼차식이 일차식 세 개의 곱이 되었습니다!',en:'The cubic became a product of three linear factors!',zh:'三次式变成了三个一次式之积！'},
        book:{ko:'남은 이차식이 실수 범위에서 더 인수분해되지 않을 수도 있습니다. 그때는 (일차식)×(이차식)에서 멈춥니다.',
              en:'The remaining quadratic may not factor further over the reals; then stop at (linear)×(quadratic).',
              zh:'剩下的二次式在实数范围内可能无法再分解，那时就停在(一次式)×(二次式)。'} }
    ],
    rule:{ ko:'① x−α가 인수 ⇔ P(α)=0  ② 정수 근은 상수항의 약수에서  ③ 조립제법으로 나머지 이차식',
      en:'① x−α is a factor ⇔ P(α)=0  ② Integer roots come from divisors of the constant  ③ Synthetic division gives the rest',
      zh:'① x−α是因式 ⇔ P(α)=0  ② 整数根在常数项的约数中  ③ 综合除法求剩下部分' }
  },

  check:{
    fills:[
      { tex:'P(x)=x^3+kx-6,\\ P(1)=0 \\;\\Rightarrow\\; k=\\square', answer:5,
        hint:{ ko:'1+k−6=0', en:'1+k−6=0', zh:'1+k−6=0' } },
      { tex:'x^3-1=(x-1)(x^2+ax+1) \\;\\Rightarrow\\; a=\\square', answer:1,
        hint:{ ko:'조립제법: 1, 1, 1', en:'Synthetic division: 1, 1, 1', zh:'综合除法：1、1、1' } }
    ],
    open:{ ko:'x³+x²−4x−4의 정수 근을 찾는 방법을 설명해 봅니다.',
      en:'Explain how to find the integer roots of x³+x²−4x−4.',
      zh:'说说如何找x³+x²−4x−4的整数根。' },
    openHint:{ ko:'상수항 −4의 약수를 넣으면 P(−1)=0, P(2)=0, P(−2)=0입니다.',
      en:'Try divisors of −4: P(−1)=0, P(2)=0, P(−2)=0.',
      zh:'代入−4的约数：P(−1)=0、P(2)=0、P(−2)=0。' }
  },

  lab:{
    generator:'md93_factorTheorem', level:'main', count:5,
    params:{mode:'findRoot'},
    intro:{
      ko:'상수항의 약수를 차례로 넣어 P(a)=0이 되는 정수 a를 찾습니다.',
      en:'Try the divisors of the constant term in turn to find the integer a with P(a)=0.',
      zh:'依次代入常数项的约数，找出使P(a)=0的整数a。'
    }
  },

  arena:{
    generator:'md93_factorTheorem', level:'main', count:6, timeLimit:480,
    params:{mode:'factorConst'},
    rule:{ ko:'8분 안에 근을 찾고 조립제법으로 나머지 이차식의 계수를 구합니다!', en:'Within 8 minutes, find the root and use synthetic division to get the remaining quadratic!', zh:'8分钟内找出根，用综合除法求剩下二次式的系数！' }
  },

  stamp:{ label:{ ko:'인수 열쇠공', en:'Factor Locksmith', zh:'因式开锁匠' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'인수의 열쇠를 찾았구나! 🔑',en:'You found the key factor!',zh:'找到因式的钥匙了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'x−α가 인수면 P(α)=0이야!',en:'If x−α is a factor, then P(α)=0!',zh:'x−α是因式，就有P(α)=0！'}, {ko:'상수항의 약수를 하나씩 넣어 봐!',en:'Try the divisors of the constant one by one!',zh:'把常数项的约数一个个代进去试试！'} ],
    finish:{ ko:'완벽해! 인수 열쇠공! 🔑✨', en:'Perfect! Factor Locksmith!', zh:'完美！因式开锁匠！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
