/* Numbers of Magic — 유닛 M-136: 지수함수의 그래프 (고등 대수 · 과정 62 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD136. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-136'] = {
  id:'M-136', tier:'algebra', level:'62', order:136,
  generator:'md136_expGraph',
  title:{ ko:'지수함수의 그래프', en:'Graphs of Exponential Functions', zh:'指数函数的图像' },
  subtitle:{ ko:'바닥에 닿을 듯 닿지 않는 곡선', en:'A curve that almost touches the floor', zh:'几乎贴地却永不相碰的曲线' },
  icon:'📈',

  practice:{
    generator:'md136_expGraph', level:'practice', count:6,
    params:{mode:'point'},
    intro:{
      ko:'x 에 값을 넣어 지나는 점의 y좌표를 구합니다. aˣ⁻ᵖ 은 언제나 양수이므로 그래프는 직선 y=q 에 한없이 다가가기만 합니다.',
      en:'Substitute x to get the y-coordinate of a point. aˣ⁻ᵖ is always positive, so the graph only approaches the line y=q.',
      zh:'代入x求点的纵坐标。aˣ⁻ᵖ总是正数，所以图像只是无限接近直线y=q。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'y=2ˣ 의 그래프는 오른쪽으로 갈수록 빠르게 솟고, 왼쪽으로 갈수록 x축에 붙을 듯 다가가지만 끝내 닿지 않습니다. 이 곡선을 옮기고 뒤집고, 같은 밑으로 크기를 비교해 봅니다.',
        en:'The graph of y=2ˣ climbs fast to the right and, to the left, creeps toward the x-axis without ever touching it. Let us move it, flip it, and compare sizes using a common base.',
        zh:'y=2ˣ的图像向右迅速上升，向左无限贴近x轴却永远碰不到。我们来移动它、翻转它，并用相同底数比较大小。' }
    },
    stages:[
      { tag:{ko:'① 점과 점근선',en:'1) Points and asymptote',zh:'① 点与渐近线'},
        head:{ko:'y=2^{x-1}+3:\\ (3,\\ 7),\\ y=3',en:'y=2^{x-1}+3:\\ (3,\\ 7),\\ y=3',zh:'y=2^{x-1}+3:\\ (3,\\ 7),\\ y=3'},
        desc:{ko:'x=3 이면 y=2²+3=<b>7</b> 입니다. 2ˣ⁻¹>0 이므로 y>3 이고, 점근선은 <b>y=3</b> 입니다.',
              en:'At x=3, y=2²+3=<b>7</b>. Since 2ˣ⁻¹>0, y>3 and the asymptote is <b>y=3</b>.',
              zh:'x=3时y=2²+3=<b>7</b>。因为2ˣ⁻¹>0，y>3，渐近线是<b>y=3</b>。'},
        mathSteps:['2^{3-1}+3=7','2^{x-1}>0\\ \\Rightarrow\\ y>3'],
        result:{ko:'점근선은 더한 수!',en:'The asymptote is the number added!',zh:'渐近线就是加上的数！'},
        book:{ko:'밑과 관계없이 x=1 이면 2ˣ⁻¹=1 이므로, y=aˣ⁻¹+3 은 언제나 점 (1, 4) 를 지납니다.',
              en:'Whatever the base, at x=1 the power equals 1, so y=aˣ⁻¹+3 always passes through (1, 4).',
              zh:'无论底数是多少，x=1时幂等于1，所以y=aˣ⁻¹+3总经过点(1, 4)。'} },

      { tag:{ko:'② 옮기고 뒤집기',en:'2) Moving and flipping',zh:'② 平移与翻转'},
        head:{ko:'y=2^{x}\\ \\xrightarrow{(x,\\,y)\\to(x+1,\\,y-2)}\\ y=2^{x-1}-2',en:'y=2^{x}\\ \\xrightarrow{(x,\\,y)\\to(x+1,\\,y-2)}\\ y=2^{x-1}-2',zh:'y=2^{x}\\ \\xrightarrow{(x,\\,y)\\to(x+1,\\,y-2)}\\ y=2^{x-1}-2'},
        desc:{ko:'옮긴 점을 (X, Y) 라 하면 x=X−1, y=Y+2 이므로 Y+2=2ˣ⁻¹ 입니다. f(x)=2ˣ⁻¹−2 이고 f(4)=8−2=<b>6</b> 입니다.',
              en:'Call the new point (X, Y): x=X−1 and y=Y+2, so Y+2=2^(X−1). Thus f(x)=2ˣ⁻¹−2 and f(4)=8−2=<b>6</b>.',
              zh:'设新点为(X, Y)，则x=X−1，y=Y+2，所以Y+2=2^(X−1)。于是f(x)=2ˣ⁻¹−2，f(4)=8−2=<b>6</b>。'},
        mathSteps:['x=X-1,\\ y=Y+2','f(4)=2^{3}-2=6'],
        result:{ko:'옮긴 만큼 빼서 넣기!',en:'Substitute with the shift taken away!',zh:'减去平移量再代入！'},
        book:{ko:'(x, y)→(−x, y) 이면 y=2⁻ˣ=(1/2)ˣ 가 되어 y축에 대하여 대칭인 그래프가 됩니다.',
              en:'(x, y)→(−x, y) gives y=2⁻ˣ=(1/2)ˣ, the mirror image in the y-axis.',
              zh:'(x, y)→(−x, y)得y=2⁻ˣ=(1/2)ˣ，是关于y轴对称的图像。'} },

      { tag:{ko:'③ 크기 비교',en:'3) Comparing sizes',zh:'③ 比较大小'},
        head:{ko:'A=\\sqrt[3]{4},\\ B=\\bigl(\\frac{1}{2}\\bigr)^{-1},\\ C=\\sqrt[3]{32}',en:'A=\\sqrt[3]{4},\\ B=\\bigl(\\frac{1}{2}\\bigr)^{-1},\\ C=\\sqrt[3]{32}',zh:'A=\\sqrt[3]{4},\\ B=\\bigl(\\frac{1}{2}\\bigr)^{-1},\\ C=\\sqrt[3]{32}'},
        desc:{ko:'A=2^(2/3), B=2¹, C=2^(5/3) 이므로 A<B<C 입니다. 가장 큰 수 M=C, 가장 작은 수 m=A 이고 M÷m=2^(5/3−2/3)=<b>2¹</b> 입니다.',
              en:'A=2^(2/3), B=2¹, C=2^(5/3), so A<B<C. The largest M=C, the smallest m=A, and M÷m=2^(5/3−2/3)=<b>2¹</b>.',
              zh:'A=2^(2/3)，B=2¹，C=2^(5/3)，所以A<B<C。最大的M=C，最小的m=A，M÷m=2^(5/3−2/3)=<b>2¹</b>。'},
        mathSteps:['2^{\\frac{2}{3}}<2^{1}<2^{\\frac{5}{3}}','M\\div m=2^{1}'],
        result:{ko:'밑을 맞추면 지수만 비교!',en:'Same base, compare exponents only!',zh:'底数相同只比指数！'},
        book:{ko:'밑이 1/2 처럼 1 보다 작으면 지수가 클수록 작은 수가 되므로, 먼저 밑을 1 보다 큰 수로 고쳐 두면 헷갈리지 않습니다.',
              en:'With a base below 1 such as 1/2, a larger exponent gives a smaller number, so rewrite with a base greater than 1 first to avoid confusion.',
              zh:'底数小于1(如1/2)时指数越大数越小，所以先化成大于1的底数就不会混淆。'} }
    ],
    rule:{ ko:'① 점근선 y=q, 점은 x 를 넣어 구하기  ② 옮긴 점 (X, Y) 로 x, y 를 나타내 대입  ③ 밑을 같게 해서 지수 비교',
      en:'① Asymptote y=q; get points by substituting x  ② Write x, y in terms of the new point (X, Y) and substitute  ③ Use a common base and compare exponents',
      zh:'① 渐近线y=q，代入x求点  ② 用新点(X, Y)表示x、y再代入  ③ 化成同底数比较指数' }
  },

  check:{
    fills:[
      { tex:{ko:'y=3^{x+2}-4:\\ x=0\\ \\Rightarrow\\ y=\\square',en:'y=3^{x+2}-4:\\ x=0\\ \\Rightarrow\\ y=\\square',zh:'y=3^{x+2}-4:\\ x=0\\ \\Rightarrow\\ y=\\square'}, answer:5,
        hint:{ ko:'3²−4', en:'3²−4', zh:'3²−4' } },
      { tex:{ko:'y=2^{x-3}+5\\ \\Rightarrow\\ y=\\square',en:'y=2^{x-3}+5\\ \\Rightarrow\\ y=\\square',zh:'y=2^{x-3}+5\\ \\Rightarrow\\ y=\\square'}, answer:5,
        hint:{ ko:'점근선: 2ˣ⁻³>0', en:'asymptote: 2ˣ⁻³>0', zh:'渐近线：2ˣ⁻³>0' } }
    ],
    open:{ ko:'y=2ˣ 과 y=(1/2)ˣ 의 그래프가 y축에 대하여 대칭인 까닭을 설명해 봅니다.',
      en:'Explain why the graphs of y=2ˣ and y=(1/2)ˣ are symmetric about the y-axis.',
      zh:'说说为什么y=2ˣ与y=(1/2)ˣ的图像关于y轴对称。' },
    openHint:{ ko:'(1/2)ˣ=2⁻ˣ 이므로 y=(1/2)ˣ 위의 점 (x, y) 에 대하여 (−x, y) 가 y=2ˣ 위에 있습니다. x 의 부호만 바뀐 점끼리 짝을 이룹니다.',
      en:'(1/2)ˣ=2⁻ˣ, so for each point (x, y) on y=(1/2)ˣ the point (−x, y) lies on y=2ˣ. Points pair up with only the sign of x changed.',
      zh:'(1/2)ˣ=2⁻ˣ，所以对y=(1/2)ˣ上的每个点(x, y)，点(−x, y)在y=2ˣ上。只有x的符号不同的点两两成对。' }
  },

  lab:{
    generator:'md136_expGraph', level:'main', count:6,
    params:{mode:'move'},
    intro:{
      ko:'화살표 위의 규칙으로 옮긴 점을 (X, Y) 로 놓고, x 와 y 를 X, Y 로 나타내 원래 식에 넣어 f(x) 를 구합니다.',
      en:'Call the point moved by the rule over the arrow (X, Y), write x and y in terms of X and Y, and substitute into the original equation to get f(x).',
      zh:'把按箭头上的规则移动后的点设为(X, Y)，用X、Y表示x、y后代入原式，求出f(x)。'
    }
  },

  arena:{
    generator:'md136_expGraph', level:'main', count:6, timeLimit:420,
    params:{mode:'order'},
    rule:{ ko:'7분 안에 밑을 맞추어 가장 큰 수와 가장 작은 수를 모두 찾습니다!', en:'Match the bases and find every largest and smallest number within 7 minutes!', zh:'7分钟内统一底数，找出所有最大数与最小数！' }
  },

  stamp:{ label:{ ko:'곡선 조련사', en:'Curve Tamer', zh:'曲线驯师' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'곡선을 제대로 옮겼어! 📈',en:'You moved the curve perfectly!',zh:'曲线移得正好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'점근선은 더한 수를 봐!',en:'The asymptote is the number added!',zh:'渐近线看加上的数！'}, {ko:'밑을 같게 고쳐 봐!',en:'Rewrite with the same base!',zh:'化成相同的底数试试！'} ],
    finish:{ ko:'완벽해! 곡선 조련사! 📈✨', en:'Perfect! Curve Tamer!', zh:'完美！曲线驯师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
