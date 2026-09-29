/* Numbers of Magic — 유닛 M-131: 유리함수 (고등 공통수학2 · 과정 58 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD131. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-131'] = {
  id:'M-131', tier:'highmath2', level:'58', order:131,
  generator:'md131_ratFunc',
  title:{ ko:'유리함수', en:'Rational Functions', zh:'分式函数' },
  subtitle:{ ko:'점근선을 따라 움직이는 그래프', en:'Graphs that hug their asymptotes', zh:'沿着渐近线伸展的图像' },
  icon:'📉',

  practice:{
    generator:'md131_ratFunc', level:'practice', count:6,
    params:{mode:'asym'},
    intro:{
      ko:'분모가 0 이 되는 x 가 세로 점근선, 최고차항 계수의 비가 가로 점근선입니다. 두 값을 x=□, y=□ 에 씁니다.',
      en:'The x that makes the denominator 0 gives the vertical asymptote, and the ratio of leading coefficients gives the horizontal one. Write them in x=□, y=□.',
      zh:'使分母为0的x是竖直渐近线，最高次项系数之比是水平渐近线。把两个值写在x=□、y=□中。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'y=1/x 의 그래프는 x 가 커질수록 x축에 가까워지지만 끝내 닿지 않습니다. 이렇게 한없이 가까워지는 직선을 점근선이라 하고, 그래프를 옮기면 점근선도 함께 옮겨 갑니다.',
        en:'As x grows, the graph of y=1/x gets closer and closer to the x-axis but never touches it. Such a line is an asymptote, and when the graph is translated the asymptotes move with it.',
        zh:'x越大，y=1/x的图像越接近x轴，却永远碰不到。这样无限接近的直线叫渐近线，图像平移时渐近线也随之平移。' }
    },
    stages:[
      { tag:{ko:'① 점근선',en:'1) Asymptotes',zh:'① 渐近线'},
        head:{ko:'y=\\dfrac{2x+1}{x-1}=\\dfrac{3}{x-1}+2',en:'y=\\dfrac{2x+1}{x-1}=\\dfrac{3}{x-1}+2',zh:'y=\\dfrac{2x+1}{x-1}=\\dfrac{3}{x-1}+2'},
        desc:{ko:'2x+1=2(x−1)+3 이므로 y=3/(x−1)+2 입니다. 점근선은 x=<b>1</b>, y=<b>2</b> 입니다.',
              en:'Since 2x+1=2(x−1)+3, y=3/(x−1)+2, so the asymptotes are x=<b>1</b> and y=<b>2</b>.',
              zh:'因为2x+1=2(x−1)+3，所以y=3/(x−1)+2，渐近线为x=<b>1</b>、y=<b>2</b>。'},
        mathSteps:['2x+1=2(x-1)+3'],
        result:{ko:'나눗셈으로 모양 바꾸기!',en:'Divide to reshape it!',zh:'用除法变形！'},
        book:{ko:'y=k/(x−p)+q 의 그래프는 점 (p, q) 에 대하여 대칭입니다.',
              en:'The graph of y=k/(x−p)+q is symmetric about the point (p, q).',
              zh:'y=k/(x−p)+q的图像关于点(p, q)对称。'} },

      { tag:{ko:'② 정의역과 치역',en:'2) Domain and range',zh:'② 定义域与值域'},
        head:{ko:'y=\\dfrac{ax+1}{x+b}:\\ x\\ne 3,\\ y\\ne 2',en:'y=\\dfrac{ax+1}{x+b}:\\ x\\ne 3,\\ y\\ne 2',zh:'y=\\dfrac{ax+1}{x+b}:\\ x\\ne 3,\\ y\\ne 2'},
        desc:{ko:'정의역이 {x | x≠3} 이면 분모 x+b 가 x=3 에서 0 이므로 b=<b>−3</b>, 치역이 {y | y≠2} 이면 a=<b>2</b> 입니다.',
              en:'Domain {x | x≠3} means the denominator x+b is 0 at x=3, so b=<b>−3</b>; range {y | y≠2} means a=<b>2</b>.',
              zh:'定义域为{x | x≠3}说明分母x+b在x=3时为0，所以b=<b>−3</b>；值域为{y | y≠2}说明a=<b>2</b>。'},
        mathSteps:['3+b=0','a=2'],
        result:{ko:'빠진 값이 곧 점근선!',en:'The missing values are the asymptotes!',zh:'缺掉的值就是渐近线！'},
        book:{ko:'지나는 점이 주어지면 그 점을 식에 대입해 미정계수에 대한 방정식을 세웁니다.',
              en:'If points on the graph are given, substitute them to get equations for the unknowns.',
              zh:'若给出图像经过的点，就代入式子，列出关于待定系数的方程。'} },

      { tag:{ko:'③ 최댓값과 최솟값',en:'3) Greatest and least',zh:'③ 最大值与最小值'},
        head:{ko:'y=\\dfrac{6}{x-1}+1\\ (2\\le x\\le 4)',en:'y=\\dfrac{6}{x-1}+1\\ (2\\le x\\le 4)',zh:'y=\\dfrac{6}{x-1}+1\\ (2\\le x\\le 4)'},
        desc:{ko:'2≤x≤4 는 점근선 x=1 의 오른쪽이고 그래프는 계속 내려갑니다. x=2 에서 최댓값 <b>7</b>, x=4 에서 최솟값 <b>3</b> 입니다.',
              en:'2≤x≤4 lies to the right of the asymptote x=1, where the graph keeps falling: greatest value <b>7</b> at x=2 and least value <b>3</b> at x=4.',
              zh:'2≤x≤4在渐近线x=1的右侧，图像一直下降：x=2时最大值<b>7</b>，x=4时最小值<b>3</b>。'},
        mathSteps:['f(2)=7','f(4)=3'],
        result:{ko:'양 끝에서 결판!',en:'Decided at the ends!',zh:'在两端见分晓！'},
        book:{ko:'정의역 안에 점근선이 끼어 있으면 값이 한없이 커지거나 작아지므로 최댓값·최솟값이 없을 수 있습니다.',
              en:'If the asymptote lies inside the domain, values grow without bound, so there may be no greatest or least value.',
              zh:'若渐近线夹在定义域内，函数值会无限增大或减小，可能没有最大值或最小值。'} }
    ],
    rule:{ ko:'① y=k/(x−p)+q 의 점근선 x=p, y=q  ② 정의역 {x | x≠p}, 치역 {y | y≠q}  ③ 한쪽 범위에서는 양 끝값이 최대·최소',
      en:'① y=k/(x−p)+q has asymptotes x=p, y=q  ② Domain {x | x≠p}, range {y | y≠q}  ③ On one side, the end values are the extremes',
      zh:'① y=k/(x−p)+q的渐近线x=p、y=q  ② 定义域{x | x≠p}，值域{y | y≠q}  ③ 在一侧范围内，两端值即最值' }
  },

  check:{
    fills:[
      { tex:{ko:'y=\\dfrac{3}{x-2}+1\\ \\Rightarrow\\ x=\\square',en:'y=\\dfrac{3}{x-2}+1\\ \\Rightarrow\\ x=\\square',zh:'y=\\dfrac{3}{x-2}+1\\ \\Rightarrow\\ x=\\square'}, answer:2,
        hint:{ ko:'세로 점근선: 분모가 0', en:'Vertical asymptote: denominator 0', zh:'竖直渐近线：分母为0' } },
      { tex:{ko:'y=\\dfrac{4}{x}\\ (1\\le x\\le 4)\\ \\Rightarrow\\ M=\\square',en:'y=\\dfrac{4}{x}\\ (1\\le x\\le 4)\\ \\Rightarrow\\ M=\\square',zh:'y=\\dfrac{4}{x}\\ (1\\le x\\le 4)\\ \\Rightarrow\\ M=\\square'}, answer:4,
        hint:{ ko:'x=1 에서 가장 큽니다', en:'Largest at x=1', zh:'x=1时最大' } }
    ],
    open:{ ko:'y=2/(x−1)+3 의 치역에 3 이 들어가지 않는 까닭을 설명해 봅니다.',
      en:'Explain why 3 is not in the range of y=2/(x−1)+3.',
      zh:'说说为什么3不在y=2/(x−1)+3的值域中。' },
    openHint:{ ko:'y=3 이 되려면 2/(x−1)=0 이어야 하는데, 분자가 2 라 어떤 x 에서도 0 이 되지 않습니다.',
      en:'For y=3 we would need 2/(x−1)=0, but with numerator 2 that never happens for any x.',
      zh:'要y=3就需要2/(x−1)=0，而分子是2，对任何x都不可能为0。' }
  },

  lab:{
    generator:'md131_ratFunc', level:'main', count:6,
    params:{mode:'coef'},
    intro:{
      ko:'정의역·치역에서 빠진 값이나 지나는 점으로 식을 세워 a, b 를 구합니다.',
      en:'Use the values missing from the domain and range, or points on the graph, to set up equations for a and b.',
      zh:'利用定义域、值域中缺掉的值或图像经过的点列式，求a、b。'
    }
  },

  arena:{
    generator:'md131_ratFunc', level:'main', count:6, timeLimit:420,
    params:{mode:'range'},
    rule:{ ko:'7분 안에 범위가 정해진 유리함수의 최댓값·최솟값을 모두 찾습니다!', en:'Find every greatest and least value on the given intervals within 7 minutes!', zh:'7分钟内求出给定范围内所有的最大值与最小值！' }
  },

  stamp:{ label:{ ko:'점근선 항해사', en:'Asymptote Navigator', zh:'渐近线领航员' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'점근선을 정확히 찾았어! 📉',en:'Asymptotes spot on!',zh:'渐近线找得很准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'분모가 0 이 되는 x 를 찾아봐!',en:'Find the x that makes the denominator 0!',zh:'找使分母为0的x！'}, {ko:'양 끝의 함숫값을 비교해 봐!',en:'Compare the values at both ends!',zh:'比较两端的函数值！'} ],
    finish:{ ko:'완벽해! 점근선 항해사! 📉✨', en:'Perfect! Asymptote Navigator!', zh:'完美！渐近线领航员！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
