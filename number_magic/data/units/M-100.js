/* Numbers of Magic — 유닛 M-100: 제한된 범위에서 이차함수의 최대·최소 (고등 공통수학1 · 과정 42, 2026-09-29)
   근거: docs/high-build-spec.md MD100. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-100'] = {
  id:'M-100', tier:'highmath1', level:'42', order:100,
  generator:'md100_rangeExtrema',
  title:{ ko:'제한된 범위에서 이차함수의 최대·최소', en:'Max & Min of a Quadratic on an Interval', zh:'限定范围内二次函数的最值' },
  subtitle:{ ko:'꼭짓점과 양 끝점, 세 후보만 비교합니다', en:'Compare just three candidates: the vertex and the two endpoints', zh:'只比较顶点和两个端点这三个候选' },
  icon:'⛰️',

  practice:{
    generator:'md100_rangeExtrema', level:'practice', count:6,
    params:{mode:'inside'},
    intro:{
      ko:'먼저 y=a(x−p)²+q 꼴로 고쳐 꼭짓점을 찾습니다. 꼭짓점이 범위 안이면 꼭짓점과 양 끝점의 값을 비교합니다.',
      en:'First rewrite as y=a(x−p)²+q to find the vertex. If it lies in the interval, compare the values at the vertex and both endpoints.',
      zh:'先化成y=a(x−p)²+q找出顶点。顶点在范围内就比较顶点与两端点的值。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'y=x²−4x+1은 x가 모든 실수일 때 최댓값이 없습니다. 그런데 0≤x≤5로 범위를 자르면 그래프의 양 끝이 생기고, 최댓값도 생깁니다.',
        en:'y=x²−4x+1 has no maximum when x can be any real number. But cut the domain to 0≤x≤5 and the graph gets two ends — and a maximum appears.',
        zh:'x取全体实数时y=x²−4x+1没有最大值。但把范围限制为0≤x≤5，图象就有了两端，最大值也出现了。' },
      history:{ ko:'범위가 정해진 포물선은 꼭짓점을 지나며 방향을 한 번 바꿀 뿐입니다. 그래서 가장 높은 곳과 가장 낮은 곳은 꼭짓점이나 양 끝점 가운데 있습니다.',
        en:'On a restricted interval a parabola changes direction only once, at its vertex. So its highest and lowest points are among the vertex and the two endpoints.',
        zh:'限定范围内的抛物线只在顶点处改变一次方向。所以最高点和最低点就在顶点与两个端点之中。' }
    },
    stages:[
      { tag:{ko:'① 꼭짓점이 범위 안',en:'1) Vertex inside the interval',zh:'① 顶点在范围内'},
        head:{ko:'y=(x-2)^2-3\\ (0\\le x\\le 5)',en:'y=(x-2)^2-3\\ (0\\le x\\le 5)',zh:'y=(x-2)^2-3\\ (0\\le x\\le 5)'},
        desc:{ko:'x²−4x+1=(x−2)²−3입니다. 꼭짓점 x=2가 범위 안이므로 최솟값은 <b>−3</b>입니다. 최댓값은 꼭짓점에서 더 먼 끝점 x=5에서 f(5)=<b>6</b>입니다.',
              en:'x²−4x+1=(x−2)²−3. The vertex x=2 is in the interval, so the minimum is <b>−3</b>. The maximum is at the endpoint farther from the vertex, x=5: f(5)=<b>6</b>.',
              zh:'x²−4x+1=(x−2)²−3。顶点x=2在范围内，最小值是<b>−3</b>。最大值在离顶点较远的端点x=5：f(5)=<b>6</b>。'},
        mathSteps:['f(0)=1,\\quad f(5)=6,\\quad f(2)=-3', {ko:'\\text{최댓값 }6,\\ \\text{최솟값 }-3',en:'\\text{maximum }6,\\ \\text{minimum }-3',zh:'\\text{最大值 }6,\\ \\text{最小值 }-3'}],
        result:{ko:'아래로 볼록이면 꼭짓점이 최솟값, 먼 끝점이 최댓값입니다!',en:'Opening upward: the vertex gives the minimum, the farther endpoint the maximum!',zh:'开口向上时顶点为最小值，较远端点为最大值！'},
        book:{ko:'위로 볼록(a<0)이면 거꾸로 꼭짓점이 최댓값입니다.',
              en:'If it opens downward (a<0), it is the other way round: the vertex gives the maximum.',
              zh:'开口向下(a<0)时正好相反，顶点为最大值。'} },

      { tag:{ko:'② 꼭짓점이 범위 밖',en:'2) Vertex outside the interval',zh:'② 顶点在范围外'},
        head:{ko:'y=(x-2)^2-3\\ (3\\le x\\le 5)',en:'y=(x-2)^2-3\\ (3\\le x\\le 5)',zh:'y=(x-2)^2-3\\ (3\\le x\\le 5)'},
        desc:{ko:'꼭짓점 x=2가 범위 밖이라 그래프는 이 범위에서 계속 올라갑니다. 최솟값은 f(3)=<b>−2</b>, 최댓값은 f(5)=<b>6</b>입니다.',
              en:'The vertex x=2 is outside, so the graph keeps rising on this interval. The minimum is f(3)=<b>−2</b> and the maximum f(5)=<b>6</b>.',
              zh:'顶点x=2在范围外，图象在此范围内一直上升。最小值f(3)=<b>−2</b>，最大值f(5)=<b>6</b>。'},
        mathSteps:['f(3)=-2,\\quad f(5)=6'],
        result:{ko:'꼭짓점이 밖에 있으면 양 끝점만 비교합니다!',en:'Vertex outside? Compare only the endpoints!',zh:'顶点在外面，只比较两个端点！'},
        book:{ko:'꼭짓점 값 −3은 이 범위에서 나오지 않는 값이라 답이 아닙니다.',
              en:'The vertex value −3 never occurs on this interval, so it is not the answer.',
              zh:'顶点值−3在此范围内取不到，所以不是答案。'} },

      { tag:{ko:'③ 최댓값으로 상수 찾기',en:'3) Find the constant from an extreme value',zh:'③ 由最值求常数'},
        head:{ko:'y=x^2-4x+k\\ (0\\le x\\le 3),\\ \\text{최솟값 }1',en:'y=x^2-4x+k\\ (0\\le x\\le 3),\\ \\text{minimum }1',zh:'y=x^2-4x+k\\ (0\\le x\\le 3),\\ \\text{最小值 }1'},
        desc:{ko:'y=(x−2)²−4+k이고 꼭짓점 x=2가 범위 안이므로 최솟값은 −4+k입니다. −4+k=1에서 <b>k=5</b>입니다.',
              en:'y=(x−2)²−4+k and the vertex x=2 is in the interval, so the minimum is −4+k. From −4+k=1, <b>k=5</b>.',
              zh:'y=(x−2)²−4+k，顶点x=2在范围内，最小值为−4+k。由−4+k=1得<b>k=5</b>。'},
        mathSteps:[{ko:'\\text{최솟값}=k-4',en:'\\text{minimum}=k-4',zh:'\\text{最小值}=k-4'}, 'k-4=1', 'k=5'],
        result:{ko:'k는 그래프를 위아래로만 옮기니, 어디서 최소인지는 그대로입니다!',en:'k only shifts the graph up or down, so where the minimum occurs does not change!',zh:'k只使图象上下平移，取最小值的位置不变！'},
        book:{ko:'최댓값이 주어져도 같은 방법으로, k를 뺀 식의 최댓값을 먼저 구합니다.',
              en:'If the maximum is given instead, do the same: first find the maximum of the expression without k.',
              zh:'给出最大值时方法相同：先求不含k部分的最大值。'} }
    ],
    rule:{ ko:'① y=a(x−p)²+q로 고친다  ② 꼭짓점이 범위 안이면 꼭짓점과 양 끝점, 밖이면 양 끝점만 비교  ③ 상수 k는 위아래 이동뿐입니다',
      en:'① Rewrite as y=a(x−p)²+q  ② Vertex inside: compare vertex and endpoints; outside: endpoints only  ③ A constant k only shifts up or down',
      zh:'① 化成y=a(x−p)²+q  ② 顶点在内比较顶点与两端点，在外只比较两端点  ③ 常数k只上下平移' }
  },

  check:{
    fills:[
      { tex:{ko:'y=(x-1)^2+2\\ (0\\le x\\le 4) \\;\\Rightarrow\\; \\text{최댓값}=\\square',en:'y=(x-1)^2+2\\ (0\\le x\\le 4) \\;\\Rightarrow\\; \\text{maximum}=\\square',zh:'y=(x-1)^2+2\\ (0\\le x\\le 4) \\;\\Rightarrow\\; \\text{最大值}=\\square'}, answer:11,
        hint:{ ko:'f(4)=9+2', en:'f(4)=9+2', zh:'f(4)=9+2' } },
      { tex:{ko:'y=(x-1)^2+2\\ (2\\le x\\le 4) \\;\\Rightarrow\\; \\text{최솟값}=\\square',en:'y=(x-1)^2+2\\ (2\\le x\\le 4) \\;\\Rightarrow\\; \\text{minimum}=\\square',zh:'y=(x-1)^2+2\\ (2\\le x\\le 4) \\;\\Rightarrow\\; \\text{最小值}=\\square'}, answer:3,
        hint:{ ko:'f(2)=1+2', en:'f(2)=1+2', zh:'f(2)=1+2' } }
    ],
    open:{ ko:'y=−x²+2x+3의 −1≤x≤2에서 최댓값과 최솟값을 구하는 과정을 설명해 봅니다.',
      en:'Explain how to find the maximum and minimum of y=−x²+2x+3 on −1≤x≤2.',
      zh:'说说求y=−x²+2x+3在−1≤x≤2上的最大值和最小值的过程。' },
    openHint:{ ko:'y=−(x−1)²+4이므로 최댓값 4(x=1), 최솟값 f(−1)=0입니다.',
      en:'y=−(x−1)²+4, so the maximum is 4 at x=1 and the minimum is f(−1)=0.',
      zh:'y=−(x−1)²+4，最大值4(x=1)，最小值f(−1)=0。' }
  },

  lab:{
    generator:'md100_rangeExtrema', level:'main', count:6,
    params:{mode:'outside'},
    intro:{
      ko:'꼭짓점이 범위 밖에 있습니다. 양 끝점의 함숫값만 비교합니다.',
      en:'The vertex is outside the interval. Compare only the values at the two endpoints.',
      zh:'顶点在范围外，只比较两端点的函数值。'
    }
  },

  arena:{
    generator:'md100_rangeExtrema', level:'main', count:6, timeLimit:480,
    params:{mode:'unknown'},
    rule:{ ko:'8분 안에 최댓값·최솟값 조건으로 상수 k를 모두 구합니다!', en:'Find every constant k from the max/min conditions within 8 minutes!', zh:'8分钟内由最值条件求出所有常数k！' }
  },

  stamp:{ label:{ ko:'봉우리 탐험가', en:'Peak Explorer', zh:'山峰探险家' }, coins:51 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'가장 높은 곳과 낮은 곳을 정확히 찾았구나! ⛰️',en:'You found the highest and lowest points exactly!',zh:'准确找到了最高点和最低点！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'꼭짓점이 범위 안에 있는지 먼저 확인해 봐!',en:'First check whether the vertex is inside the interval!',zh:'先确认顶点在不在范围内！'}, {ko:'양 끝점의 값도 꼭 계산해 봐!',en:'Remember to compute the values at both endpoints!',zh:'两端点的值也一定要算！'} ],
    finish:{ ko:'완벽해! 봉우리 탐험가! ⛰️✨', en:'Perfect! Peak Explorer!', zh:'完美！山峰探险家！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
