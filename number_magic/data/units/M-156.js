/* Numbers of Magic — 유닛 M-156: 함수의 증가와 감소 (고등 미적분Ⅰ · 과정 74 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD156. 교과서 없이 예시를 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-156'] = {
  id:'M-156', tier:'calculus1', level:'72', order:156,
  generator:'md156_monotone',
  title:{ ko:'함수의 증가와 감소', en:'Increasing & Decreasing Functions', zh:'函数的增减' },
  subtitle:{ ko:'도함수의 부호가 오르막과 내리막을 알려 줍니다', en:'The sign of the derivative shows uphill and downhill', zh:'导函数的符号告诉我们上坡和下坡' },
  icon:'📈',

  practice:{
    generator:'md156_monotone', level:'practice', count:6,
    params:{mode:'interval'},
    intro:{
      ko:'f′(x)=0 의 두 근 α<β 로 실수를 나누고, 각 부분에서 f′(x) 의 부호로 증가(↗)·감소(↘)를 정합니다.',
      en:'Split the real line at the two roots α<β of f′(x)=0, and decide increasing (↗) or decreasing (↘) on each part from the sign of f′(x).',
      zh:'用f′(x)=0的两根α<β把实数分开，在每一部分由f′(x)的符号确定递增(↗)或递减(↘)。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'산길을 걸을 때 발밑의 기울기가 양수이면 오르막, 음수이면 내리막입니다. 그래프 위의 각 점에서 접선의 기울기 f′(x) 가 바로 그 발밑의 기울기입니다.',
        en:'On a mountain path, a positive slope underfoot means uphill and a negative one downhill. At each point of a graph, the tangent slope f′(x) is exactly that slope underfoot.',
        zh:'走山路时，脚下的坡度为正就是上坡，为负就是下坡。图像上每一点的切线斜率f′(x)就是这个脚下的坡度。' }
    },
    stages:[
      { tag:{ko:'① 증가·감소 구간',en:'1) Where it rises and falls',zh:'① 增减区间'},
        head:{ko:"f(x)=x^3-3x^2-9x+1,\\ f'(x)=3(x+1)(x-3)",en:"f(x)=x^3-3x^2-9x+1,\\ f'(x)=3(x+1)(x-3)",zh:"f(x)=x^3-3x^2-9x+1,\\ f'(x)=3(x+1)(x-3)"},
        desc:{ko:'f′(x) 는 x<−1 과 x>3 에서 양수, 그 사이에서 음수입니다. 그래서 x≤−1, x≥3 에서 증가하고 <b>−1≤x≤3</b> 에서 감소합니다.',en:'f′(x) is positive for x<−1 and x>3 and negative in between, so f increases on x≤−1 and x≥3 and decreases on <b>−1≤x≤3</b>.',zh:'f′(x)在x<−1和x>3时为正，在两者之间为负。所以在x≤−1、x≥3递增，在<b>−1≤x≤3</b>递减。'},
        mathSteps:["f'(x)=0:\\ x=-1,\\ 3","+\\ \\to\\ -\\ \\to\\ +"],
        result:{ko:'부호표로 한눈에!',en:'A sign chart shows it at a glance!',zh:'符号表一目了然！'},
        book:{ko:'구간 끝값을 포함해도 됩니다. f′(x)=0 인 점이 하나뿐이면 그 점에서 증가가 끊기지 않기 때문입니다.',en:'The interval ends may be included: a single point with f′(x)=0 does not interrupt increasing.',zh:'区间端点可以包括在内：只有一个点f′(x)=0不会打断递增。'} },

      { tag:{ko:'② 실수 전체에서 증가',en:'2) Increasing everywhere',zh:'② 在实数范围内递增'},
        head:{ko:"f(x)=x^3+ax^2+3x:\\ \\frac{D}{4}=a^2-9\\le0",en:"f(x)=x^3+ax^2+3x:\\ \\frac{D}{4}=a^2-9\\le0",zh:"f(x)=x^3+ax^2+3x:\\ \\frac{D}{4}=a^2-9\\le0"},
        desc:{ko:'모든 x 에서 f′(x)=3x²+2ax+3≥0 이어야 하므로 판별식이 0 이하입니다. −3≤a≤3 이므로 정수 a 는 <b>7</b> 개입니다.',en:'We need f′(x)=3x²+2ax+3≥0 for every x, so the discriminant is at most 0. −3≤a≤3 gives <b>7</b> integers a.',zh:'要对所有x都有f′(x)=3x²+2ax+3≥0，所以判别式不大于0。−3≤a≤3，整数a有<b>7</b>个。'},
        mathSteps:["f'(x)=3x^2+2ax+3\\ge0","-3\\le a\\le3"],
        result:{ko:'x축과 만나지 않거나 한 점에서만!',en:'Never crossing the x-axis, touching at most once!',zh:'不与x轴相交，最多相切一点！'},
        book:{ko:'D=0 이면 f′(x) 가 한 점에서만 0 이고 나머지에서는 양수라 여전히 증가합니다. 그래서 D<0 이 아니라 D≤0 입니다.',en:'When D=0, f′(x) is 0 at only one point and positive elsewhere, so f is still increasing. That is why the condition is D≤0, not D<0.',zh:'D=0时f′(x)只在一点为0，其余处为正，仍然递增。所以条件是D≤0而不是D<0。'} },

      { tag:{ko:'③ 주어진 구간에서 감소',en:'3) Decreasing on an interval',zh:'③ 在给定区间内递减'},
        head:{ko:"f(x)=x^3-6x^2+ax\\ \\searrow\\ (1\\le x\\le3)",en:"f(x)=x^3-6x^2+ax\\ \\searrow\\ (1\\le x\\le3)",zh:"f(x)=x^3-6x^2+ax\\ \\searrow\\ (1\\le x\\le3)"},
        desc:{ko:'f′(x)=3x²−12x+a 는 아래로 볼록이라 [1, 3] 에서 가장 큰 값은 양 끝에서 나옵니다. f′(1)=f′(3)=a−9≤0 이므로 a 의 최댓값은 <b>9</b> 입니다.',en:'f′(x)=3x²−12x+a opens upward, so its greatest value on [1, 3] is at the ends. f′(1)=f′(3)=a−9≤0, so the greatest a is <b>9</b>.',zh:'f′(x)=3x²−12x+a开口向上，在[1, 3]上的最大值在两端取得。f′(1)=f′(3)=a−9≤0，所以a的最大值为<b>9</b>。'},
        mathSteps:["f'(1)=a-9\\le0","f'(3)=a-9\\le0"],
        result:{ko:'가장 위험한 점만 확인!',en:'Check only the riskiest point!',zh:'只检查最危险的点！'},
        book:{ko:'증가 조건이면 반대로 구간에서의 f′(x) 의 최솟값을 봅니다. 꼭짓점이 구간 안에 있으면 꼭짓점의 값이 최솟값입니다.',en:'For an increasing condition, look instead at the least value of f′(x) on the interval; if the vertex is inside, its value is the least.',zh:'若是递增的条件，反过来看f′(x)在区间上的最小值；顶点在区间内时顶点的值就是最小值。'} }
    ],
    rule:{ ko:'① f′>0 ↗, f′<0 ↘  ② 실수 전체 ↗ ⇔ f′(x)=0 의 D≤0  ③ 구간 ↗ ⇔ 그 구간에서 f′ 의 최솟값 ≥0',
      en:'① f′>0 ↗, f′<0 ↘  ② ↗ on all reals ⇔ D≤0 for f′(x)=0  ③ ↗ on an interval ⇔ least value of f′ there ≥0',
      zh:'① f′>0 ↗，f′<0 ↘  ② 在实数范围内↗ ⇔ f′(x)=0的D≤0  ③ 在区间内↗ ⇔ f′在该区间的最小值≥0' }
  },

  check:{
    fills:[
      { tex:{ko:"f(x)=2x^3-3x^2-12x\\ \\ \\searrow\\ (\\alpha\\le x\\le\\beta)\\ \\Rightarrow\\ \\alpha+\\beta=\\square",en:"f(x)=2x^3-3x^2-12x\\ \\ \\searrow\\ (\\alpha\\le x\\le\\beta)\\ \\Rightarrow\\ \\alpha+\\beta=\\square",zh:"f(x)=2x^3-3x^2-12x\\ \\ \\searrow\\ (\\alpha\\le x\\le\\beta)\\ \\Rightarrow\\ \\alpha+\\beta=\\square"}, answer:1,
        hint:{ko:"f'(x)=6(x+1)(x-2)",en:"f'(x)=6(x+1)(x-2)",zh:"f'(x)=6(x+1)(x-2)"} },
      { tex:{ko:"f(x)=-x^3+ax^2-12x\\ \\Rightarrow\\ N=\\square",en:"f(x)=-x^3+ax^2-12x\\ \\Rightarrow\\ N=\\square",zh:"f(x)=-x^3+ax^2-12x\\ \\Rightarrow\\ N=\\square"}, answer:13,
        hint:{ko:'\\frac{D}{4}=a^2-36\\le0',en:'\\frac{D}{4}=a^2-36\\le0',zh:'\\frac{D}{4}=a^2-36\\le0'} }
    ],
    open:{ ko:'삼차함수가 실수 전체에서 증가할 조건이 "f′(x)=0 의 판별식 D<0" 이 아니라 "D≤0" 인 까닭을 f(x)=x³ 으로 설명해 봅니다.',
      en:'Using f(x)=x³, explain why a cubic is increasing on all reals when the discriminant of f′(x)=0 satisfies D≤0, not only D<0.',
      zh:'用f(x)=x³说明，为什么三次函数在实数范围内递增的条件是f′(x)=0的判别式D≤0，而不只是D<0。' },
    openHint:{ ko:'f(x)=x³ 이면 f′(x)=3x² 이고 D=0 입니다. f′(0)=0 이지만 x<0 이든 x>0 이든 f′(x)>0 이라, x₁<x₂ 이면 언제나 x₁³<x₂³ 입니다. 한 점에서 0 이 되는 것은 증가를 막지 않습니다.',
      en:'For f(x)=x³, f′(x)=3x² and D=0. Although f′(0)=0, f′(x)>0 whenever x<0 or x>0, so x₁<x₂ always gives x₁³<x₂³. Being 0 at one point does not stop increasing.',
      zh:'f(x)=x³时f′(x)=3x²，D=0。虽然f′(0)=0，但x<0或x>0时都有f′(x)>0，所以x₁<x₂时总有x₁³<x₂³。在一点为0并不妨碍递增。' }
  },

  lab:{
    generator:'md156_monotone', level:'main', count:6,
    params:{mode:'always'},
    intro:{
      ko:'실수 전체에서 증가(또는 감소)하려면 f′(x)=0 의 판별식이 D≤0 이어야 합니다. 이 조건을 a 에 대한 부등식으로 풀어 정수 a 를 셉니다.',
      en:'To be increasing (or decreasing) on all reals, the discriminant of f′(x)=0 must satisfy D≤0. Solve this as an inequality in a and count the integers a.',
      zh:'要在实数范围内递增(或递减)，f′(x)=0的判别式须D≤0。把它当作关于a的不等式解出，数出整数a。'
    }
  },

  arena:{
    generator:'md156_monotone', level:'main', count:6, timeLimit:420,
    params:{mode:'local'},
    rule:{ ko:'7분 안에 주어진 구간에서 증가·감소할 조건을 모두 풉니다!', en:'Solve every increasing-or-decreasing-on-an-interval problem within 7 minutes!', zh:'7分钟内解出所有在给定区间内单调的条件题！' }
  },

  stamp:{ label:{ ko:'오르막 판별사', en:'Slope Judge', zh:'坡度判定师' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'오르막과 내리막을 딱 가렸어! 📈',en:'Sorted uphill from downhill exactly!',zh:'上坡下坡分得正好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:"f'(x) 의 부호부터 봐!",en:'Look at the sign of f′(x) first!',zh:'先看f′(x)的符号！'}, {ko:'D≤0 인지 D<0 인지 조심해!',en:'Careful: D≤0, not D<0!',zh:'小心是D≤0还是D<0！'} ],
    finish:{ ko:'완벽해! 오르막 판별사! 📈✨', en:'Perfect! Slope Judge!', zh:'完美！坡度判定师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
