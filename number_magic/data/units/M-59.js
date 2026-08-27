/* Numbers of Magic — 유닛 M-59: 연속조건 상수 결정 (미적분Ⅰ W14 심화, 2026-08-27) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-59'] = {
  id:'M-59', tier:'calculus1', level:'45', order:2,
  generator:'md59_continuityConstant',
  title:{ ko:'연속조건 상수 결정', en:'Continuity — Determining Constants', zh:'连续条件·确定常数' },
  subtitle:{ ko:'끊어지지 않으려면 극한값과 함숫값이 같아야 해요', en:'To avoid a break, the limit must equal the function value', zh:'不断开，就要极限值等于函数值' },
  icon:'🔗',

  practice:{
    generator:'md59_continuityConstant', level:'practice', count:5,
    params:{mode:'basic'},
    intro:{
      ko:'함수가 어떤 점에서 연속이려면, 그 점에서의 극한값과 그 점의 함숫값이 정확히 같아야 해요!',
      en:'For a function to be continuous at a point, the limit there must exactly equal the function value there!',
      zh:'函数在某点连续，就要该点的极限值恰好等于函数值！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'연필을 떼지 않고 그래프를 그릴 수 있으면 "연속"이에요. 그런데 x=2에서만 값이 원래와 다른 이상한 점(k)이 있다면 어떻게 될까요? k가 딱 맞는 값이 아니면 그 점에서 그래프가 뚝 끊어지거나 튀어요.',
        en:'If you can draw a graph without lifting your pencil, it\'s "continuous". But what if there\'s an odd point at x=2 with a different value (k)? Unless k is exactly the right value, the graph will break or jump at that point.',
        zh:'如果画图时笔不离开纸，就是"连续"。但如果x=2处有个值不同的奇怪点(k)呢？除非k恰好是正确的值，否则图像会在那里断开或跳跃。' },
      history:{ ko:'"연속"의 정확한 수학적 정의(극한값=함숫값)는 19세기 독일 수학자 바이어슈트라스가 엄밀하게 정리했어요. 그전까지는 "연속"이 "손을 떼지 않고 그린다"는 직관적인 설명뿐이었어요.',
        en:'The precise mathematical definition of "continuity" (limit equals function value) was rigorously formalized by the 19th-century German mathematician Weierstrass. Before that, "continuous" was only described intuitively as "drawing without lifting the pen".',
        zh:'"连续"的精确数学定义(极限值等于函数值)由19世纪德国数学家魏尔斯特拉斯严格整理。在此之前，"连续"只是"笔不离纸"这样直观的说法。' }
    },
    stages:[
      { tag:{ko:'① k를 그 점의 극한값과 같게 두면 이어져요',en:'1) Setting k equal to the limit there connects the pieces',zh:'① 把k设成该点的极限值就能接上'},
        head:{ko:'f(x)=\\begin{cases}\\dfrac{x^2-9}{x-3} & (x\\ne 3) \\\\ k & (x=3)\\end{cases}\\;\\Rightarrow\\; k=6',en:'f(x)=\\begin{cases}\\dfrac{x^2-9}{x-3} & (x\\ne 3) \\\\ k & (x=3)\\end{cases}\\;\\Rightarrow\\; k=6',zh:'f(x)=\\begin{cases}\\dfrac{x^2-9}{x-3} & (x\\ne 3) \\\\ k & (x=3)\\end{cases}\\;\\Rightarrow\\; k=6'},
        desc:{ko:'x≠3일 땐 (x²-9)/(x-3)=(x-3)(x+3)/(x-3)=x+3이에요. x=3 근처의 극한값은 3+3=6. 이 함수가 <b>x=3에서 연속이려면</b> k도 정확히 6이어야 해요.',
              en:'For x≠3, (x²-9)/(x-3)=(x-3)(x+3)/(x-3)=x+3. The limit near x=3 is 3+3=6. For this function <b>to be continuous at x=3</b>, k must also be exactly 6.',
              zh:'x≠3时，(x²-9)/(x-3)=(x-3)(x+3)/(x-3)=x+3。x=3附近的极限值是3+3=6。这个函数要<b>在x=3处连续</b>，k也必须恰好是6。'},
        mathSteps:['\\dfrac{(x-3)(x+3)}{x-3}=x+3', '3+3', '=6'],
        result:{ko:'연속이려면 k = 그 점에서의 극한값!',en:'For continuity, k = the limit at that point!',zh:'要连续，k = 该点的极限值！'},
        book:{ko:'만약 k가 6이 아닌 다른 값이면, x=3인 그 한 점만 그래프에서 살짝 떨어져 나가요(불연속점).',
              en:'If k were anything other than 6, just that one point at x=3 would pop off the graph, disconnected (a discontinuity).',
              zh:'如果k不是6而是别的值，x=3那一点就会从图像上脱离出来(不连续点)。'} },

      { tag:{ko:'② 구간별 함수는 경계에서 값이 같아야 해요',en:'2) Piecewise functions must match at the boundary',zh:'② 分段函数在边界处值要相等'},
        head:{ko:'f(x)=\\begin{cases}x+b & (x<2) \\\\ 3x-1 & (x\\ge 2)\\end{cases}\\;\\Rightarrow\\; b=3',en:'f(x)=\\begin{cases}x+b & (x<2) \\\\ 3x-1 & (x\\ge 2)\\end{cases}\\;\\Rightarrow\\; b=3',zh:'f(x)=\\begin{cases}x+b & (x<2) \\\\ 3x-1 & (x\\ge 2)\\end{cases}\\;\\Rightarrow\\; b=3'},
        desc:{ko:'경계 x=2에서 두 조각이 만나려면, 양쪽 식에 x=2를 넣은 값이 <b>같아야</b> 해요: 2+b = 3(2)-1=5. 그러니 b=3.',
              en:'For the two pieces to meet at the boundary x=2, plugging x=2 into both must give <b>the same value</b>: 2+b = 3(2)-1=5. So b=3.',
              zh:'两段要在边界x=2处相接，把x=2代入两边必须<b>相等</b>：2+b = 3(2)-1=5。所以b=3。'},
        mathSteps:['3(2)-1=5', '2+b=5', 'b=3'],
        result:{ko:'구간별 함수는 경계에서 왼쪽 식과 오른쪽 식의 값이 같아야 이어져요!',en:'A piecewise function connects only if the left and right expressions agree at the boundary!',zh:'分段函数只有在边界处左右两式相等才能连接！'},
        book:{ko:'이 유형은 극한 계산이 아니라 "대입해서 값 맞추기"라서 다항식 대입만 있으면 돼요(MD43 factorCancel과는 다른 접근).',
              en:'This type isn\'t about limits — it\'s about "matching values by substitution", so it only needs plain polynomial substitution (a different approach from MD43\'s factorCancel).',
              zh:'这类题不是求极限，而是"代入配值"，只需要普通的多项式代入(和MD43的factorCancel思路不同)。'} }
    ],
    rule:{ ko:'함수가 한 점에서 연속이려면 그 점의 함숫값과 극한값이 같아야 해요 — 미정계수는 그 값에 맞춰서 정해요!',
      en:'For a function to be continuous at a point, its value there must equal the limit there — solve for the unknown constant to match!',
      zh:'函数在某点连续，就要该点函数值等于极限值——求待定常数使其相等！' }
  },

  check:{
    fills:[
      { tex:'f(x)=\\begin{cases}\\dfrac{x^2-16}{x-4} & (x\\ne 4) \\\\ k & (x=4)\\end{cases} \\;\\Rightarrow\\; k=\\square', answer:8,
        hint:{ ko:'x+4, x=4이면 8', en:'x+4, at x=4 that\'s 8', zh:'x+4，x=4时是8' } },
      { tex:'f(x)=\\begin{cases}x+b & (x<1) \\\\ 2x+1 & (x\\ge 1)\\end{cases} \\;\\Rightarrow\\; b=\\square', answer:2,
        hint:{ ko:'1+b=2(1)+1=3', en:'1+b=2(1)+1=3', zh:'1+b=2(1)+1=3' } }
    ],
    open:{ ko:'f(x)=(x²-25)/(x-5)(x≠5), k(x=5)가 연속이 되도록 k를 구하는 과정을 설명해봐요.',
      en:'Explain how to find k so that f(x)=(x²-25)/(x-5)(x≠5), k(x=5) is continuous.',
      zh:'说说f(x)=(x²-25)/(x-5)(x≠5)，k(x=5)要连续，求k的过程。' },
    openHint:{ ko:'x²-25=(x-5)(x+5), 약분하면 x+5, x=5이면 10',
      en:'x²-25=(x-5)(x+5), canceling gives x+5, at x=5 that\'s 10',
      zh:'x²-25=(x-5)(x+5)，约分后是x+5，x=5时是10' }
  },

  lab:{
    generator:'md59_continuityConstant', level:'main', count:4,
    params:{mode:'quadraticPiece',wide:true},
    intro:{
      ko:'분자를 인수분해해서 분모와 같은 인수를 약분한 뒤, 남은 값에 x=a를 대입해요!',
      en:'Factor the numerator, cancel the factor matching the denominator, then substitute x=a into what\'s left!',
      zh:'把分子因式分解，约去和分母相同的因式，再把x=a代入剩下的部分！'
    }
  },

  arena:{
    generator:'md59_continuityConstant', level:'main', count:8, timeLimit:300,
    params:{mode:'twoPiece',wide:true},
    rule:{ ko:'5분 안에 구간별 일차함수의 경계를 모두 맞춰요!', en:'Match every piecewise-linear boundary within 5 minutes!', zh:'5分钟内匹配所有分段一次函数的边界！' }
  },

  stamp:{ label:{ ko:'연속선 잇기 장인', en:'Continuity Connector', zh:'连续连接工匠' }, coins:72 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'극한값과 함숫값을 완벽하게 이었구나! 🔗',en:'You connected the limit and the function value perfectly!',zh:'你完美连接了极限值和函数值！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'그 점의 극한값과 k가 같아야 이어져!',en:'k must equal the limit at that point to connect!',zh:'k要等于该点的极限值才能连接！'}, {ko:'구간별 함수는 경계에서 양쪽 값을 같게 두고 풀어!',en:'For piecewise functions, set both sides equal at the boundary and solve!',zh:'分段函数要在边界处让两边相等来求解！'} ],
    finish:{ ko:'완벽해! 연속선 잇기 장인! 🔗✨', en:'Perfect! Continuity Connector!', zh:'完美！连续连接工匠！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
