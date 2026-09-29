/* Numbers of Magic — 유닛 M-158: 방정식과 부등식에의 활용 (고등 미적분Ⅰ · 과정 74 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD158. 교과서 없이 예시를 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-158'] = {
  id:'M-158', tier:'calculus1', level:'74', order:158,
  generator:'md158_rootsIneq',
  title:{ ko:'방정식과 부등식에의 활용', en:'Derivatives in Equations & Inequalities', zh:'导数在方程与不等式中的应用' },
  subtitle:{ ko:'근을 풀지 않고 그래프로 셉니다', en:'Count roots from the graph without solving', zh:'不解方程，用图像数根' },
  icon:'🎯',

  practice:{
    generator:'md158_rootsIneq', level:'practice', count:6,
    params:{mode:'count'},
    intro:{
      ko:'식을 f(x)=0 꼴로 모은 뒤 극댓값과 극솟값을 구합니다. 두 값의 곱이 음수이면 3 개, 0 이면 2 개, 양수이면 1 개의 서로 다른 실근이 있습니다.',
      en:'Collect terms into f(x)=0, then find the local maximum and minimum. A negative product gives 3 distinct real roots, zero gives 2 and a positive product gives 1.',
      zh:'把式子整理成f(x)=0后求极大值和极小值。两值之积为负时有3个不同实根，为0时2个，为正时1个。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'삼차방정식은 근의 공식을 쓰기 어렵지만, 근이 몇 개인지는 쉽게 알 수 있습니다. 그래프의 봉우리와 골짜기가 x축의 위에 있는지 아래에 있는지만 보면 됩니다.',
        en:'A cubic equation is hard to solve by formula, but how many roots it has is easy to tell: just see whether the peak and valley of the graph are above or below the x-axis.',
        zh:'三次方程很难用求根公式解，但有几个根却很容易知道：只要看图像的山峰和山谷在x轴的上方还是下方。' }
    },
    stages:[
      { tag:{ko:'① 실근의 개수',en:'1) Number of real roots',zh:'① 实根的个数'},
        head:{ko:"x^3-3x+1=0:\\ f(-1)=3,\\ f(1)=-1",en:"x^3-3x+1=0:\\ f(-1)=3,\\ f(1)=-1",zh:"x^3-3x+1=0:\\ f(-1)=3,\\ f(1)=-1"},
        desc:{ko:'극댓값 3 은 x축 위, 극솟값 −1 은 x축 아래에 있어 그래프가 x축을 세 번 지납니다. 서로 다른 실근은 <b>3</b> 개입니다.',en:'The local maximum 3 is above the x-axis and the local minimum −1 below, so the graph crosses the x-axis three times: <b>3</b> distinct real roots.',zh:'极大值3在x轴上方，极小值−1在x轴下方，图像三次穿过x轴。不同实根有<b>3</b>个。'},
        mathSteps:["f'(x)=3(x+1)(x-1)","3\\times(-1)<0\\ \\Rightarrow\\ 3"],
        result:{ko:'봉우리는 위, 골짜기는 아래!',en:'Peak above, valley below!',zh:'山峰在上，山谷在下！'},
        book:{ko:'극값 하나가 0 이면 그래프가 x축에 접해 서로 다른 실근은 2 개가 됩니다(중근 하나와 다른 근 하나).',en:'If one extreme value is 0, the graph touches the x-axis and there are 2 distinct real roots (one double root and one other).',zh:'若有一个极值为0，图像与x轴相切，不同实根有2个(一个重根和另一个根)。'} },

      { tag:{ko:'② f(x)=k',en:'2) f(x)=k',zh:'② f(x)=k'},
        head:{ko:"x^3-3x^2=k:\\ f(0)=0,\\ f(2)=-4",en:"x^3-3x^2=k:\\ f(0)=0,\\ f(2)=-4",zh:"x^3-3x^2=k:\\ f(0)=0,\\ f(2)=-4"},
        desc:{ko:'수평선 y=k 가 −4<k<0 이면 그래프와 세 점에서 만납니다. 그런 정수 k 는 −3, −2, −1 의 <b>3</b> 개이고, k=0 또는 k=−4 이면 두 점에서 만납니다.',en:'The horizontal line y=k meets the graph at three points when −4<k<0. The integers k are −3, −2, −1, so <b>3</b> of them; k=0 or k=−4 gives two points.',zh:'水平直线y=k在−4<k<0时与图像有三个交点。这样的整数k为−3, −2, −1，共<b>3</b>个；k=0或k=−4时有两个交点。'},
        mathSteps:["-4<k<0","k=-3,\\ -2,\\ -1"],
        result:{ko:'수평선을 위아래로 움직여 보기!',en:'Slide the horizontal line up and down!',zh:'把水平线上下移动看看！'},
        book:{ko:'k 를 좌변에 두지 말고 f(x)=k 로 떼어 놓으면, 그래프는 고정되고 직선만 움직이니 생각하기 쉽습니다.',en:'Separating it as f(x)=k instead of keeping k on the left fixes the graph so that only the line moves, which is easier to picture.',zh:'不把k留在左边，而是分离成f(x)=k，图像固定、只有直线移动，更容易思考。'} },

      { tag:{ko:'③ 항상 성립하는 부등식',en:'3) Inequalities that always hold',zh:'③ 恒成立的不等式'},
        head:{ko:"x^4-4x^3+k\\ge0:\\ f'(x)=4x^2(x-3)",en:"x^4-4x^3+k\\ge0:\\ f'(x)=4x^2(x-3)",zh:"x^4-4x^3+k\\ge0:\\ f'(x)=4x^2(x-3)"},
        desc:{ko:'f(x)=x⁴−4x³ 의 최솟값은 f(3)=81−108=−27 입니다. 모든 x 에서 성립하려면 −27+k≥0, 곧 k 의 최솟값은 <b>27</b> 입니다.',en:'The least value of f(x)=x⁴−4x³ is f(3)=81−108=−27. For every x we need −27+k≥0, so the least k is <b>27</b>.',zh:'f(x)=x⁴−4x³的最小值为f(3)=81−108=−27。要对所有x成立需−27+k≥0，所以k的最小值为<b>27</b>。'},
        mathSteps:["\\min f(x)=f(3)=-27","k\\ge27"],
        result:{ko:'가장 낮은 곳만 버티면 된다!',en:'If the lowest point holds, all do!',zh:'最低点成立就都成立！'},
        book:{ko:'x=0 에서도 f′(x)=0 이지만 부호가 바뀌지 않아 극값이 아닙니다. 최솟값 후보는 부호가 −에서 +로 바뀌는 x=3 입니다.',en:'f′(0)=0 too, but the sign does not change there, so it is not an extreme point. The candidate for the least value is x=3, where the sign changes from − to +.',zh:'x=0处也有f′(x)=0，但符号不变，不是极值点。最小值的候选是符号由−变+的x=3。'} }
    ],
    rule:{ ko:'① 실근의 개수 = x축과의 교점 수  ② f(x)=k 는 수평선 y=k 와의 교점  ③ 항상 f(x)≥k ⇔ 최솟값 ≥ k',
      en:'① Number of real roots = meeting points with the x-axis  ② f(x)=k: meeting points with y=k  ③ Always f(x)≥k ⇔ least value ≥ k',
      zh:'① 实根个数 = 与x轴的交点数  ② f(x)=k：与y=k的交点  ③ 恒有f(x)≥k ⇔ 最小值 ≥ k' }
  },

  check:{
    fills:[
      { tex:{ko:"x^3-3x^2+4=0\\ \\Rightarrow\\ N=\\square",en:"x^3-3x^2+4=0\\ \\Rightarrow\\ N=\\square",zh:"x^3-3x^2+4=0\\ \\Rightarrow\\ N=\\square"}, answer:2,
        hint:{ko:'f(0)=4,\\ f(2)=0',en:'f(0)=4,\\ f(2)=0',zh:'f(0)=4,\\ f(2)=0'} },
      { tex:{ko:"x^3-3x=k\\ \\Rightarrow\\ N=\\square",en:"x^3-3x=k\\ \\Rightarrow\\ N=\\square",zh:"x^3-3x=k\\ \\Rightarrow\\ N=\\square"}, answer:3,
        hint:{ko:'f(-1)=2,\\ f(1)=-2',en:'f(-1)=2,\\ f(1)=-2',zh:'f(-1)=2,\\ f(1)=-2'} }
    ],
    open:{ ko:'삼차방정식 f(x)=0 에서 극댓값과 극솟값의 곱이 음수이면 서로 다른 실근이 3 개인 까닭을 그래프로 설명해 봅니다.',
      en:'Using the graph, explain why a cubic equation f(x)=0 has 3 distinct real roots when the product of its local maximum and minimum is negative.',
      zh:'用图像说明，为什么三次方程f(x)=0的极大值与极小值之积为负时有3个不同实根。' },
    openHint:{ ko:'곱이 음수이면 봉우리는 x축 위, 골짜기는 x축 아래에 있습니다. 그래프는 왼쪽 끝에서 봉우리까지 한 번, 봉우리에서 골짜기까지 한 번, 골짜기에서 오른쪽 끝까지 한 번, 모두 세 번 x축을 지납니다.',
      en:'A negative product puts the peak above the x-axis and the valley below it. The graph crosses the axis once from the far left to the peak, once from the peak to the valley and once from the valley to the far right: three times.',
      zh:'积为负时山峰在x轴上方，山谷在下方。图像从最左边到山峰穿过一次，从山峰到山谷一次，从山谷到最右边一次，共三次。' }
  },

  lab:{
    generator:'md158_rootsIneq', level:'main', count:6,
    params:{mode:'k'},
    intro:{
      ko:'f(x)=k 의 실근은 y=f(x) 와 수평선 y=k 의 교점입니다. 극댓값과 극솟값을 구해 세 점·두 점·한 점에서 만나는 k 를 찾습니다.',
      en:'The real roots of f(x)=k are where y=f(x) meets the horizontal line y=k. Find the local maximum and minimum, then the k giving three, two or one meeting point.',
      zh:'f(x)=k的实根是y=f(x)与水平直线y=k的交点。求出极大值和极小值，找出有三个、两个、一个交点的k。'
    }
  },

  arena:{
    generator:'md158_rootsIneq', level:'main', count:6, timeLimit:420,
    params:{mode:'ineq'},
    rule:{ ko:'7분 안에 항상 성립하는 부등식의 k 를 모두 구합니다!', en:'Find k for every always-true inequality within 7 minutes!', zh:'7分钟内求出所有恒成立不等式中的k！' }
  },

  stamp:{ label:{ ko:'교점 사냥꾼', en:'Crossing Hunter', zh:'交点猎人' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'교점을 딱 맞게 셌어! 🎯',en:'Counted the crossings exactly!',zh:'交点数得正好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'극댓값과 극솟값부터 구해 봐!',en:'Find the local max and min first!',zh:'先求极大值和极小值！'}, {ko:'등호가 없으면 끝값을 빼야 해!',en:'Without an equals sign, leave out the end value!',zh:'没有等号就要去掉端点值！'} ],
    finish:{ ko:'완벽해! 교점 사냥꾼! 🎯✨', en:'Perfect! Crossing Hunter!', zh:'完美！交点猎人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
