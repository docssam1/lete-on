/* Numbers of Magic — 유닛 M-61: 곡선과 x축 사이의 넓이 (미적분Ⅰ W14 심화, 2026-08-27) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-61'] = {
  id:'M-61', tier:'calculus1', level:'45', order:4,
  generator:'md61_areaUnderCurve',
  title:{ ko:'곡선과 x축 사이의 넓이', en:'Area Between a Curve & the x-axis', zh:'曲线与x轴之间的面积' },
  subtitle:{ ko:'두 교점을 구간 삼아 정적분해요', en:'Take the two intersection points as the interval and integrate', zh:'以两个交点为区间求定积分' },
  icon:'🏔️',

  practice:{
    generator:'md61_areaUnderCurve', level:'practice', count:5,
    params:{mode:'basic'},
    intro:{
      ko:'곡선이 x축과 만나는 두 점 사이의 넓이는 그 구간의 정적분값이에요 — 원시함수 F를 구해 F(q)-F(p)만 계산하면 돼요!',
      en:'The area between a curve and the x-axis, between its two intersection points, is the definite integral over that interval — just find the antiderivative F and compute F(q)-F(p)!',
      zh:'曲线与x轴之间、两个交点之间的面积，就是该区间的定积分——求出原函数F后计算F(q)-F(p)就行！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'포물선 f(x)=-(x-1)(x-4)를 그리면, x=1과 x=4에서 x축을 만나고 그 사이에서는 곡선이 x축 위로 볼록 솟아 있어요. 이 볼록한 부분과 x축 사이의 넓이는 얼마일까요? MD46에서 배운 정적분이 답을 줘요.',
        en:'Graphing the parabola f(x)=-(x-1)(x-4), it meets the x-axis at x=1 and x=4, and between those points the curve bulges above the x-axis. How much area is enclosed between that bulge and the x-axis? The definite integral from MD46 gives the answer.',
        zh:'画抛物线f(x)=-(x-1)(x-4)，它在x=1和x=4处与x轴相交，两点之间曲线鼓起在x轴上方。这个鼓起部分与x轴之间的面积是多少呢？MD46学过的定积分给出答案。' },
      history:{ ko:'"곡선 아래 넓이를 구하는 문제"는 고대 그리스 아르키메데스가 포물선 조각의 넓이를 구하면서 처음 다뤘어요(기원전 3세기, "소진법"이라는 방법으로). 뉴턴·라이프니츠의 미적분학이 이걸 F(q)-F(p)라는 간단한 계산으로 바꿔놓았어요.',
        en:'The problem of "finding the area under a curve" was first tackled by the ancient Greek Archimedes when he found the area of a parabolic segment (3rd century BCE, using a method called "exhaustion"). Newton and Leibniz\'s calculus turned it into the simple calculation F(q)-F(p).',
        zh:'"求曲线下方面积"的问题最早由古希腊的阿基米德在求抛物线弓形面积时处理(公元前3世纪，用一种叫"穷竭法"的方法)。牛顿和莱布尼茨的微积分把它变成了F(q)-F(p)这样简单的计算。' }
    },
    stages:[
      { tag:{ko:'① 두 교점을 정적분 구간으로 삼아요',en:'1) Take the two intersection points as the integral\'s interval',zh:'① 以两个交点为定积分的区间'},
        head:{ko:'f(x)=-x^2+5x-4 \\;\\Rightarrow\\; \\int_{1}^{4} f(x)\\,dx = \\dfrac{9}{2}',en:'f(x)=-x^2+5x-4 \\;\\Rightarrow\\; \\int_{1}^{4} f(x)\\,dx = \\dfrac{9}{2}',zh:'f(x)=-x^2+5x-4 \\;\\Rightarrow\\; \\int_{1}^{4} f(x)\\,dx = \\dfrac{9}{2}'},
        desc:{ko:'f(x)=−(x-1)(x-4)를 전개하면 −x²+5x−4예요. x=1과 x=4에서 x축과 만나고, 그 사이에서 f(x)≥0이니 <b>[1,4] 구간의 정적분</b>이 곧 넓이예요.',
              en:'Expanding f(x)=−(x-1)(x-4) gives −x²+5x−4. It meets the x-axis at x=1 and x=4, and f(x)≥0 between them, so <b>the definite integral over [1,4]</b> is exactly the area.',
              zh:'展开f(x)=−(x-1)(x-4)得到−x²+5x−4。它在x=1和x=4处与x轴相交，中间f(x)≥0，所以<b>[1,4]区间的定积分</b>就是面积。'},
        mathSteps:['(x-1)(x-4)=0\\;\\Rightarrow\\;x=1,4', '\\int_1^4 f(x)\\,dx', ''],
        result:{ko:'곡선이 x축을 만나는 두 점이 정적분의 시작과 끝!',en:'The curve\'s two intersection points with the x-axis are the integral\'s start and end!',zh:'曲线与x轴的两个交点就是定积分的起点和终点！'},
        book:{ko:'이 유닛의 문항은 항상 두 교점(p,q)과 볼록한 정도(계수)를 먼저 정해두고 거꾸로 f(x)를 만들어요 — 그래서 넓이가 항상 정수로 딱 떨어져요.',
              en:'This unit\'s problems always fix the two intersection points (p,q) and the amount of bulge (coefficient) first, then build f(x) backward — so the area always lands on a clean integer.',
              zh:'本单元的题目总是先定好两个交点(p,q)和鼓起的程度(系数)，再反推出f(x)——所以面积总能得到干净的整数。'} },

      { tag:{ko:'② 원시함수를 구해 F(q)-F(p)만 계산해요',en:'2) Find the antiderivative and just compute F(q)-F(p)',zh:'② 求出原函数只需算F(q)-F(p)'},
        head:{ko:'F(x)=-\\dfrac{x^3}{3}+\\dfrac{5x^2}{2}-4x \\;\\Rightarrow\\; F(4)-F(1)=\\dfrac{9}{2}',en:'F(x)=-\\dfrac{x^3}{3}+\\dfrac{5x^2}{2}-4x \\;\\Rightarrow\\; F(4)-F(1)=\\dfrac{9}{2}',zh:'F(x)=-\\dfrac{x^3}{3}+\\dfrac{5x^2}{2}-4x \\;\\Rightarrow\\; F(4)-F(1)=\\dfrac{9}{2}'},
        desc:{ko:'MD46처럼 계수를 (지수+1)의 배수로 미리 골라두면 F(x)는 분수 없이 정수 계수가 돼요. F(4)-F(1)만 계산하면 넓이가 <b>바로</b> 나와요.',
              en:'Just like in MD46, pre-choosing coefficients as multiples of (exponent+1) makes F(x) come out with integer coefficients, no fractions. Computing F(4)-F(1) gives the area <b>directly</b>.',
              zh:'和MD46一样，把系数预先取成(指数+1)的倍数，F(x)的系数就会是整数，不带分数。只需计算F(4)-F(1)就<b>直接</b>得到面积。'},
        mathSteps:['F(4)-F(1)', '', ''],
        result:{ko:'넓이 = F(오른쪽 교점) - F(왼쪽 교점)!',en:'Area = F(right intersection) - F(left intersection)!',zh:'面积 = F(右交点) - F(左交点)！'},
        book:{ko:'만약 곡선이 x축 아래로 파여 있으면(f(x)≤0) 정적분값 자체는 음수가 나와요 — 그럴 땐 절댓값을 취해야 진짜 넓이예요.',
              en:'If the curve dips below the x-axis (f(x)≤0), the definite integral itself comes out negative — you\'d take the absolute value to get the actual area.',
              zh:'如果曲线在x轴下方(f(x)≤0)，定积分本身会是负数——这时要取绝对值才是真正的面积。'} }
    ],
    rule:{ ko:'곡선과 x축 사이의 넓이 = 두 교점을 구간으로 삼은 정적분 = F(오른쪽 교점) - F(왼쪽 교점)!',
      en:'The area between a curve and the x-axis = the definite integral over the two intersection points = F(right) - F(left)!',
      zh:'曲线与x轴之间的面积 = 以两交点为区间的定积分 = F(右) - F(左)！' }
  },

  check:{
    fills:[
      { tex:'f(x) = -6x^2+12x \\;\\Rightarrow\\; \\int_{0}^{2} f(x)\\,dx = \\square', answer:8,
        hint:{ ko:'F(x)=-2x³+6x², F(2)-F(0)=(-16+24)-0', en:'F(x)=-2x³+6x², F(2)-F(0)=(-16+24)-0', zh:'F(x)=-2x³+6x², F(2)-F(0)=(-16+24)-0' } },
      { tex:'f(x) = -6x^2+6x+12 \\;\\Rightarrow\\; \\int_{-1}^{2} f(x)\\,dx = \\square', answer:27,
        hint:{ ko:'f(x)=-6(x+1)(x-2), F(2)-F(-1)', en:'f(x)=-6(x+1)(x-2), F(2)-F(-1)', zh:'f(x)=-6(x+1)(x-2), F(2)-F(-1)' } }
    ],
    open:{ ko:'f(x)=-x²+2x가 x축과 만나는 두 점을 찾고, 그 사이 넓이를 구하는 과정을 설명해봐요.',
      en:'Find the two points where f(x)=-x²+2x meets the x-axis, then explain how to find the area between them.',
      zh:'找出f(x)=-x²+2x与x轴相交的两点，说说求两点间面积的过程。' },
    openHint:{ ko:'x(x-2)=0이니 x=0,2. F(x)=-x³/3+x², F(2)-F(0)=(-8/3+4)-0=4/3',
      en:'x(x-2)=0, so x=0,2. F(x)=-x³/3+x², F(2)-F(0)=(-8/3+4)-0=4/3',
      zh:'x(x-2)=0，所以x=0,2。F(x)=-x³/3+x²，F(2)-F(0)=(-8/3+4)-0=4/3' }
  },

  lab:{
    generator:'md61_areaUnderCurve', level:'main', count:4,
    params:{mode:'wide'},
    intro:{
      ko:'교점이 음수여도 방법은 같아요 — 원시함수를 구해 F(q)-F(p)를 계산해요!',
      en:'Even with a negative intersection point, the method is the same — find the antiderivative and compute F(q)-F(p)!',
      zh:'交点是负数也一样——求出原函数计算F(q)-F(p)！'
    }
  },

  arena:{
    generator:'md61_areaUnderCurve', level:'main', count:8, timeLimit:300,
    params:{mode:'wider'},
    rule:{ ko:'5분 안에 더 큰 범위의 넓이까지 모두 구해요!', en:'Find every wider-range area within 5 minutes!', zh:'5分钟内求出所有更大范围的面积！' }
  },

  stamp:{ label:{ ko:'넓이 측량사', en:'Area Surveyor', zh:'面积测量师' }, coins:76 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'두 교점 사이의 넓이를 완벽하게 구했구나! 🏔️',en:'You found the area between the two intersection points perfectly!',zh:'你完美求出了两交点间的面积！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'곡선이 x축과 만나는 두 점을 먼저 찾아봐!',en:'First find where the curve meets the x-axis!',zh:'先找出曲线与x轴相交的两点！'}, {ko:'원시함수를 구해서 F(오른쪽)-F(왼쪽)을 계산해!',en:'Find the antiderivative and compute F(right)-F(left)!',zh:'求出原函数计算F(右)-F(左)！'} ],
    finish:{ ko:'완벽해! 넓이 측량사! 🏔️✨', en:'Perfect! Area Surveyor!', zh:'完美！面积测量师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
