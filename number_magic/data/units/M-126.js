/* Numbers of Magic — 유닛 M-126: 절대부등식 (고등 공통수학2 · 과정 55 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD126. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-126'] = {
  id:'M-126', tier:'highmath2', level:'55', order:126,
  generator:'md126_absIneq',
  title:{ ko:'절대부등식', en:'Absolute Inequalities', zh:'绝对不等式' },
  subtitle:{ ko:'언제나 성립하는 부등식으로 최댓값·최솟값을 찾습니다', en:'Inequalities that always hold give greatest and least values', zh:'用恒成立的不等式求最大值与最小值' },
  icon:'⚖️',

  practice:{
    generator:'md126_absIneq', level:'practice', count:6,
    params:{mode:'min'},
    intro:{
      ko:'곱이 일정해지는 두 양수 항을 찾아 a+b≥2√(ab) 를 씁니다. 등호가 성립하는 값이 최솟값 m 입니다.',
      en:'Find two positive terms whose product is constant and use a+b≥2√(ab). The value where equality holds is the least value m.',
      zh:'找出积为定值的两个正项，用a+b≥2√(ab)。取等号时的值就是最小值m。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'둘레가 같은 직사각형 가운데 넓이가 가장 큰 것은 정사각형입니다. 두 수의 합이 같을 때 두 수가 같으면 곱이 가장 크다는 사실이 바로 산술평균과 기하평균의 관계입니다.',
        en:'Among rectangles with the same perimeter, the square has the largest area. That two numbers with a fixed sum have the largest product when they are equal is exactly the AM–GM inequality.',
        zh:'周长相同的长方形中，正方形面积最大。和一定的两个数相等时积最大，这正是算术平均与几何平均的关系。' }
    },
    stages:[
      { tag:{ko:'① 곱이 일정할 때',en:'1) Fixed product',zh:'① 积一定时'},
        head:{ko:'x+\\dfrac{9}{x}\\ge 2\\sqrt{9}=6',en:'x+\\dfrac{9}{x}\\ge 2\\sqrt{9}=6',zh:'x+\\dfrac{9}{x}\\ge 2\\sqrt{9}=6'},
        desc:{ko:'x>0 이면 x 와 9/x 의 곱은 9 로 일정합니다. 그래서 x+9/x≥2√9=6 이고 x=3 일 때 등호가 성립해 최솟값은 <b>6</b> 입니다.',
              en:'For x>0 the product of x and 9/x is always 9, so x+9/x≥2√9=6, with equality at x=3. The least value is <b>6</b>.',
              zh:'x>0时x与9/x的积恒为9，所以x+9/x≥2√9=6，x=3时取等号，最小值为<b>6</b>。'},
        mathSteps:['x\\times\\dfrac{9}{x}=9','x=3'],
        result:{ko:'곱이 일정하면 합의 최솟값!',en:'Fixed product → least sum!',zh:'积一定 → 和最小！'},
        book:{ko:'등호가 성립하는 x 가 실제로 있는지 꼭 확인합니다. x=9/x 에서 x=3 이 조건 x>0 을 만족합니다.',
              en:'Always check that the equality case really exists: x=9/x gives x=3, which satisfies x>0.',
              zh:'一定要确认取等号的x确实存在：由x=9/x得x=3，满足x>0。'} },

      { tag:{ko:'② 합이 일정할 때',en:'2) Fixed sum',zh:'② 和一定时'},
        head:{ko:'2x\\times y\\le\\left(\\dfrac{8}{2}\\right)^2=16',en:'2x\\times y\\le\\left(\\dfrac{8}{2}\\right)^2=16',zh:'2x\\times y\\le\\left(\\dfrac{8}{2}\\right)^2=16'},
        desc:{ko:'x>0, y>0, 2x+y=8 이면 2x·y≤16 이므로 xy≤8 입니다. 2x=y=4 일 때 등호가 성립해 xy 의 최댓값은 <b>8</b> 입니다.',
              en:'With x>0, y>0 and 2x+y=8, 2x·y≤16, so xy≤8. Equality holds when 2x=y=4, so the greatest value of xy is <b>8</b>.',
              zh:'x>0、y>0且2x+y=8时，2x·y≤16，所以xy≤8。2x=y=4时取等号，xy的最大值为<b>8</b>。'},
        mathSteps:['xy\\le 8'],
        result:{ko:'합이 일정하면 곱의 최댓값!',en:'Fixed sum → greatest product!',zh:'和一定 → 积最大！'},
        book:{ko:'x+y 의 최솟값을 구할 때 조건 1/x+4/y=1 을 곱해 (x+y)(1/x+4/y) 로 펼치는 방법도 자주 씁니다.',
              en:'To minimise x+y under 1/x+4/y=1, a common trick is to multiply by that 1 and expand (x+y)(1/x+4/y).',
              zh:'在1/x+4/y=1的条件下求x+y的最小值时，常把x+y乘以这个1，展开(x+y)(1/x+4/y)。'} },

      { tag:{ko:'③ 코시-슈바르츠',en:'3) Cauchy–Schwarz',zh:'③ 柯西-施瓦茨'},
        head:{ko:'(1^2+2^2)(x^2+y^2)\\ge(x+2y)^2',en:'(1^2+2^2)(x^2+y^2)\\ge(x+2y)^2',zh:'(1^2+2^2)(x^2+y^2)\\ge(x+2y)^2'},
        desc:{ko:'x²+y²=5 이면 (x+2y)²≤5×5=25 이므로 −5≤x+2y≤5 입니다. 최댓값은 <b>5</b>, 최솟값은 <b>−5</b> 입니다.',
              en:'If x²+y²=5, then (x+2y)²≤5×5=25, so −5≤x+2y≤5: the greatest value is <b>5</b> and the least is <b>−5</b>.',
              zh:'若x²+y²=5，则(x+2y)²≤5×5=25，所以−5≤x+2y≤5，最大值为<b>5</b>，最小值为<b>−5</b>。'},
        mathSteps:['(x+2y)^2\\le 25','-5\\le x+2y\\le 5'],
        result:{ko:'제곱의 합으로 일차식을 묶기!',en:'Bound a linear expression by sums of squares!',zh:'用平方和约束一次式！'},
        book:{ko:'등호는 x:y=1:2 일 때 성립합니다. 세 문자일 때도 (a²+b²+c²)(x²+y²+z²)≥(ax+by+cz)² 가 성립합니다.',
              en:'Equality holds when x:y=1:2. With three letters, (a²+b²+c²)(x²+y²+z²)≥(ax+by+cz)² also holds.',
              zh:'x:y=1:2时取等号。三个字母时(a²+b²+c²)(x²+y²+z²)≥(ax+by+cz)²也成立。'} }
    ],
    rule:{ ko:'① a+b≥2√(ab) (a>0, b>0), 등호는 a=b  ② 곱이 일정하면 합의 최솟값, 합이 일정하면 곱의 최댓값  ③ (a²+b²)(x²+y²)≥(ax+by)²',
      en:'① a+b≥2√(ab) (a>0, b>0), equality at a=b  ② Fixed product → least sum; fixed sum → greatest product  ③ (a²+b²)(x²+y²)≥(ax+by)²',
      zh:'① a+b≥2√(ab)(a>0，b>0)，a=b时取等号  ② 积一定求和的最小值，和一定求积的最大值  ③ (a²+b²)(x²+y²)≥(ax+by)²' }
  },

  check:{
    fills:[
      { tex:{ko:'x>0\\ \\Rightarrow\\ x+\\dfrac{16}{x}:\\ m=\\square',en:'x>0\\ \\Rightarrow\\ x+\\dfrac{16}{x}:\\ m=\\square',zh:'x>0\\ \\Rightarrow\\ x+\\dfrac{16}{x}:\\ m=\\square'}, answer:8,
        hint:{ ko:'2√16', en:'2√16', zh:'2√16' } },
      { tex:{ko:'x>0,\\ y>0,\\ x+y=10\\ \\Rightarrow\\ xy:\\ M=\\square',en:'x>0,\\ y>0,\\ x+y=10\\ \\Rightarrow\\ xy:\\ M=\\square',zh:'x>0,\\ y>0,\\ x+y=10\\ \\Rightarrow\\ xy:\\ M=\\square'}, answer:25,
        hint:{ ko:'x=y=5', en:'x=y=5', zh:'x=y=5' } }
    ],
    open:{ ko:'x>0 일 때 x+1/x 의 최솟값이 2 인 까닭을 (√x−1/√x)²≥0 을 이용해 설명해 봅니다.',
      en:'Using (√x−1/√x)²≥0, explain why the least value of x+1/x for x>0 is 2.',
      zh:'利用(√x−1/√x)²≥0，说说x>0时x+1/x的最小值为什么是2。' },
    openHint:{ ko:'(√x−1/√x)²=x−2+1/x≥0 이므로 x+1/x≥2 이고, √x=1/√x 즉 x=1 일 때 등호가 성립합니다.',
      en:'(√x−1/√x)²=x−2+1/x≥0 gives x+1/x≥2, with equality when √x=1/√x, i.e. x=1.',
      zh:'(√x−1/√x)²=x−2+1/x≥0，所以x+1/x≥2，当√x=1/√x即x=1时取等号。' }
  },

  lab:{
    generator:'md126_absIneq', level:'main', count:6,
    params:{mode:'prod'},
    intro:{
      ko:'합이 일정하면 곱의 최댓값 M, 곱이 일정하면 합의 최솟값 m 을 구합니다. 등호가 성립하는 때를 함께 확인합니다.',
      en:'With a fixed sum find the greatest product M; with a fixed product find the least sum m. Check when equality holds.',
      zh:'和一定求积的最大值M，积一定求和的最小值m，并确认取等号的情况。'
    }
  },

  arena:{
    generator:'md126_absIneq', level:'main', count:6, timeLimit:420,
    params:{mode:'cs'},
    rule:{ ko:'7분 안에 코시-슈바르츠 부등식으로 최댓값·최솟값을 모두 찾습니다!', en:'Find every greatest and least value with Cauchy–Schwarz within 7 minutes!', zh:'7分钟内用柯西-施瓦茨不等式求出所有最大值与最小值！' }
  },

  stamp:{ label:{ ko:'평형 저울사', en:'Balance Keeper', zh:'平衡掌秤师' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'등호 조건까지 완벽해! ⚖️',en:'Even the equality case is perfect!',zh:'取等条件也很完美！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'곱이 일정한 두 항을 찾아봐!',en:'Look for two terms with a constant product!',zh:'找找积为定值的两项！'}, {ko:'등호가 언제 성립하는지 봐!',en:'Check when equality holds!',zh:'看看什么时候取等号！'} ],
    finish:{ ko:'완벽해! 평형 저울사! ⚖️✨', en:'Perfect! Balance Keeper!', zh:'完美！平衡掌秤师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
