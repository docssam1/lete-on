/* Numbers of Magic — 유닛 M-104: 연립이차방정식 (고등 공통수학1 · 과정 44, 2026-09-29)
   근거: docs/high-build-spec.md MD104. 예시는 새로 만들었다. 역사 문단은 널리 알려진 사실만. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-104'] = {
  id:'M-104', tier:'highmath1', level:'44', order:104,
  generator:'md104_simulQuad',
  title:{ ko:'연립이차방정식', en:'Systems with a Quadratic Equation', zh:'二元二次方程组' },
  subtitle:{ ko:'대입하거나 인수분해해서 한 문자로 줄입니다', en:'Substitute or factor to reach one variable', zh:'代入或因式分解，化成一个未知数' },
  icon:'🧩',

  practice:{
    generator:'md104_simulQuad', level:'practice', count:6,
    params:{mode:'linQuad'},
    intro:{
      ko:'일차방정식을 y=… 꼴로 고쳐 이차방정식에 넣습니다. 양수 조건으로 해를 하나 고릅니다.',
      en:'Rewrite the linear equation as y=… and substitute it into the quadratic. Use the positivity condition to pick one solution.',
      zh:'把一次方程写成y=…代入二次方程，再用正数条件选出一组解。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'미지수가 두 개인데 식 하나가 이차식이면, 한 문자를 없애는 것이 먼저입니다. 일차식이 있으면 대입하고, 둘 다 이차식이면 인수분해되는 식을 찾아 일차식으로 쪼갭니다.',
        en:'With two unknowns and a quadratic equation, first eliminate one variable. If there is a linear equation, substitute; if both are quadratic, find one that factors and split it into linear equations.',
        zh:'两个未知数且有二次方程时，先消去一个字母。有一次方程就代入；两个都是二次时，找能因式分解的拆成一次方程。' },
      history:{ ko:'고대 바빌로니아의 점토판에는 두 수의 합과 곱을 알려 주고 두 수를 구하는 문제가 남아 있습니다.',
        en:'Clay tablets from ancient Babylon contain problems that give the sum and product of two numbers and ask for the numbers.',
        zh:'古巴比伦的泥板上留有给出两数之和与积、求这两个数的题目。' }
    },
    stages:[
      { tag:{ko:'① 일차식을 대입',en:'1) Substitute the linear equation',zh:'① 代入一次方程'},
        head:{ko:'x-y=1,\\ x^2+y^2=13',en:'x-y=1,\\ x^2+y^2=13',zh:'x-y=1,\\ x^2+y^2=13'},
        desc:{ko:'y=x−1 을 넣으면 2x²−2x−12=0, 곧 (x−3)(x+2)=0 입니다. 해는 <b>(3, 2)</b> 와 (−2, −3) 입니다.',
              en:'Substituting y=x−1 gives 2x²−2x−12=0, that is (x−3)(x+2)=0. The solutions are <b>(3, 2)</b> and (−2, −3).',
              zh:'代入y=x−1得2x²−2x−12=0，即(x−3)(x+2)=0。解为<b>(3, 2)</b>和(−2, −3)。'},
        mathSteps:['x^2+(x-1)^2=13', '(x-3)(x+2)=0'],
        result:{ko:'한 문자만 남으면 이차방정식입니다!',en:'One variable left means a quadratic!',zh:'只剩一个字母就是二次方程！'},
        book:{ko:'해는 보통 두 쌍입니다. 조건(양수 등)이 있으면 맞는 쌍만 고릅니다.',
              en:'There are usually two pairs; a condition such as positivity picks the right one.',
              zh:'通常有两组解，有条件(如正数)时只选符合的一组。'} },

      { tag:{ko:'② 인수분해되는 식 쪼개기',en:'2) Split the equation that factors',zh:'② 拆开能分解的方程'},
        head:{ko:'x^2-xy-2y^2=0,\\ x^2+y^2=20',en:'x^2-xy-2y^2=0,\\ x^2+y^2=20',zh:'x^2-xy-2y^2=0,\\ x^2+y^2=20'},
        desc:{ko:'첫 식은 (x−2y)(x+y)=0 이라 x=2y 또는 x=−y 입니다. x=2y 를 넣으면 5y²=20, y=±2 이므로 <b>(4, 2)</b>, (−4, −2) 가 나옵니다.',
              en:'The first equation is (x−2y)(x+y)=0, so x=2y or x=−y. With x=2y we get 5y²=20, y=±2, giving <b>(4, 2)</b> and (−4, −2).',
              zh:'第一个方程为(x−2y)(x+y)=0，所以x=2y或x=−y。代入x=2y得5y²=20，y=±2，得<b>(4, 2)</b>、(−4, −2)。'},
        mathSteps:['(x-2y)(x+y)=0', '5y^2=20'],
        result:{ko:'우변이 0 인 이차식이 열쇠입니다!',en:'The quadratic equal to 0 is the key!',zh:'右边为0的二次式是关键！'},
        book:{ko:'x=−y 쪽도 2y²=20 으로 풀면 해가 더 있습니다. 조건이 있으면 그에 맞게 고릅니다.',
              en:'The branch x=−y also gives 2y²=20 and more solutions; choose according to the condition.',
              zh:'x=−y一支也可由2y²=20求出更多解，按条件选取。'} },

      { tag:{ko:'③ 합과 곱이 보이면',en:'3) When a sum and product appear',zh:'③ 看到和与积时'},
        head:{ko:'x+y=5,\\ xy=6',en:'x+y=5,\\ xy=6',zh:'x+y=5,\\ xy=6'},
        desc:{ko:'x, y 는 t²−5t+6=0 의 두 근이므로 <b>2 와 3</b> 입니다. x²+y² 이 주어지면 xy 부터 구합니다.',
              en:'x and y are the roots of t²−5t+6=0, namely <b>2 and 3</b>. If x²+y² is given, find xy first.',
              zh:'x、y是t²−5t+6=0的两个根，即<b>2和3</b>。若给出x²+y²，先求xy。'},
        mathSteps:['t^2-5t+6=0', '(t-2)(t-3)=0'],
        result:{ko:'근과 계수의 관계를 거꾸로 씁니다!',en:'Root–coefficient relations used in reverse!',zh:'反过来使用根与系数的关系！'},
        book:{ko:'x²+y²=(x+y)²−2xy 이므로 x²+y²=13, x+y=5 이면 xy=6 입니다.',
              en:'Since x²+y²=(x+y)²−2xy, x²+y²=13 with x+y=5 gives xy=6.',
              zh:'因为x²+y²=(x+y)²−2xy，x²+y²=13、x+y=5时xy=6。'} }
    ],
    rule:{ ko:'① 일차식이 있으면 대입  ② 둘 다 이차식이면 인수분해되는 식을 쪼갠다  ③ 합과 곱은 t²−(합)t+(곱)=0',
      en:'① Substitute a linear equation  ② If both are quadratic, split the one that factors  ③ Sum and product: t²−(sum)t+(product)=0',
      zh:'① 有一次方程就代入  ② 都是二次时拆开能分解的方程  ③ 和与积：t²−(和)t+(积)=0' }
  },

  check:{
    fills:[
      { tex:'y=x+1,\\ x^2+y^2=25,\\ x>0 \\;\\Rightarrow\\; x=\\square', answer:3,
        hint:{ ko:'x²+x−12=0', en:'x²+x−12=0', zh:'x²+x−12=0' } },
      { tex:'x+y=7,\\ xy=12,\\ x>y \\;\\Rightarrow\\; x=\\square', answer:4,
        hint:{ ko:'t²−7t+12=0', en:'t²−7t+12=0', zh:'t²−7t+12=0' } }
    ],
    open:{ ko:'x²−y²=0, x²+xy=8 을 푸는 과정을 설명해 봅니다.',
      en:'Explain how to solve x²−y²=0 together with x²+xy=8.',
      zh:'说说解x²−y²=0与x²+xy=8的过程。' },
    openHint:{ ko:'(x−y)(x+y)=0 에서 x=y 이면 2x²=8 이라 (2, 2), (−2, −2) 입니다. x=−y 이면 0=8 이 되어 해가 없습니다.',
      en:'From (x−y)(x+y)=0: x=y gives 2x²=8, so (2, 2) and (−2, −2); x=−y gives 0=8, no solution.',
      zh:'由(x−y)(x+y)=0：x=y时2x²=8，得(2, 2)、(−2, −2)；x=−y时0=8，无解。' }
  },

  lab:{
    generator:'md104_simulQuad', level:'main', count:6,
    params:{mode:'quadQuad'},
    intro:{
      ko:'우변이 0 인 이차식을 인수분해해 x 를 y 로 나타냅니다.',
      en:'Factor the quadratic equal to 0 and write x in terms of y.',
      zh:'把右边为0的二次式因式分解，用y表示x。'
    }
  },

  arena:{
    generator:'md104_simulQuad', level:'main', count:6, timeLimit:480,
    params:{mode:'symmetric'},
    rule:{ ko:'8분 안에 합과 곱으로 대칭형 연립방정식을 모두 풉니다!', en:'Solve every symmetric system through sum and product within 8 minutes!', zh:'8分钟内用和与积解完所有对称型方程组！' }
  },

  stamp:{ label:{ ko:'연립 퍼즐러', en:'System Puzzler', zh:'方程组拼图师' }, coins:51 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'두 조각을 딱 맞췄구나! 🧩',en:'You fitted both pieces perfectly!',zh:'两块拼得正好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'한 문자를 먼저 없애 봐!',en:'Eliminate one variable first!',zh:'先消去一个字母！'}, {ko:'x, y 의 조건을 다시 확인해 봐!',en:'Check the condition on x and y again!',zh:'再确认一下x、y的条件！'} ],
    finish:{ ko:'완벽해! 연립 퍼즐러! 🧩✨', en:'Perfect! System Puzzler!', zh:'完美！方程组拼图师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
