/* Numbers of Magic — 유닛 M-157: 닫힌구간에서의 최대·최소 (고등 미적분Ⅰ · 과정 74 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD157. 교과서 없이 예시를 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-157'] = {
  id:'M-157', tier:'calculus1', level:'74', order:157,
  generator:'md157_closedMax',
  title:{ ko:'닫힌구간에서의 최대·최소', en:'Max & Min on a Closed Interval', zh:'闭区间上的最值' },
  subtitle:{ ko:'극값과 양 끝을 한 줄로 세워 비교합니다', en:'Line up the extreme values and both ends, then compare', zh:'把极值与两端排成一行比较' },
  icon:'🏔️',

  practice:{
    generator:'md157_closedMax', level:'practice', count:6,
    params:{mode:'cubic'},
    intro:{
      ko:'f′(x)=0 인 x 중 구간 안에 있는 것과 양 끝에서 함숫값을 구해 가장 큰 값 M 과 가장 작은 값 m 을 찾습니다.',
      en:'Evaluate f at the points inside the interval where f′(x)=0 and at both ends, then pick the greatest value M and the least value m.',
      zh:'求区间内使f′(x)=0的点和两端的函数值，找出最大值M和最小值m。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'정해진 등산로 구간에서 가장 높은 곳은 봉우리일 수도 있지만, 오르막이 계속되는 길이라면 구간의 끝이 가장 높을 수도 있습니다. 그래서 극값과 끝점을 모두 봐야 합니다.',
        en:'On a set stretch of trail the highest point may be a peak, but if the path keeps climbing, the end of the stretch may be highest. So look at both the extreme values and the end points.',
        zh:'在一段固定的登山路上，最高点可能是山峰，但如果路一直往上，区间的终点也可能最高。所以极值和端点都要看。' }
    },
    stages:[
      { tag:{ko:'① 삼차함수',en:'1) A cubic',zh:'① 三次函数'},
        head:{ko:"f(x)=x^3-3x+1\\ \\ (-2\\le x\\le3)",en:"f(x)=x^3-3x+1\\ \\ (-2\\le x\\le3)",zh:"f(x)=x^3-3x+1\\ \\ (-2\\le x\\le3)"},
        desc:{ko:'f′(x)=3(x+1)(x−1) 이라 x=−1, 1 이 후보입니다. f(−2)=−1, f(−1)=3, f(1)=−1, f(3)=19 이므로 M=<b>19</b>, m=<b>−1</b> 입니다.',en:'f′(x)=3(x+1)(x−1), so x=−1, 1 are candidates. f(−2)=−1, f(−1)=3, f(1)=−1, f(3)=19, so M=<b>19</b> and m=<b>−1</b>.',zh:'f′(x)=3(x+1)(x−1)，候选点为x=−1, 1。f(−2)=−1，f(−1)=3，f(1)=−1，f(3)=19，所以M=<b>19</b>，m=<b>−1</b>。'},
        mathSteps:["f(-2)=-1,\\ f(-1)=3,\\ f(1)=-1,\\ f(3)=19","M=19,\\ m=-1"],
        result:{ko:'극댓값 3 보다 끝값 19 가 더 큼!',en:'The end value 19 beats the local max 3!',zh:'端点值19比极大值3还大！'},
        book:{ko:'연속함수는 닫힌구간에서 반드시 최댓값과 최솟값을 가집니다(최대·최소 정리).',en:'A continuous function always has a greatest and a least value on a closed interval (the extreme value theorem).',zh:'连续函数在闭区间上一定有最大值和最小值(最值定理)。'} },

      { tag:{ko:'② 사차함수',en:'2) A quartic',zh:'② 四次函数'},
        head:{ko:"f(x)=x^4-2x^2\\ \\ (-2\\le x\\le1),\\ f'(x)=4(x+1)x(x-1)",en:"f(x)=x^4-2x^2\\ \\ (-2\\le x\\le1),\\ f'(x)=4(x+1)x(x-1)",zh:"f(x)=x^4-2x^2\\ \\ (-2\\le x\\le1),\\ f'(x)=4(x+1)x(x-1)"},
        desc:{ko:'구간 안의 후보는 x=−1, 0 이고 x=1 은 끝점입니다. f(−2)=8, f(−1)=−1, f(0)=0, f(1)=−1 이므로 M+m=8+(−1)=<b>7</b> 입니다.',en:'Inside the interval the candidates are x=−1, 0, and x=1 is an end. f(−2)=8, f(−1)=−1, f(0)=0, f(1)=−1, so M+m=8+(−1)=<b>7</b>.',zh:'区间内的候选点为x=−1, 0，x=1是端点。f(−2)=8，f(−1)=−1，f(0)=0，f(1)=−1，所以M+m=8+(−1)=<b>7</b>。'},
        mathSteps:["f(-2)=8,\\ f(-1)=-1,\\ f(0)=0,\\ f(1)=-1","M+m=7"],
        result:{ko:'후보를 빠짐없이!',en:'Leave no candidate out!',zh:'候选点一个不漏！'},
        book:{ko:'최솟값 −1 이 두 곳에서 나올 수도 있습니다. 값이 같으면 최솟값은 하나입니다.',en:'The least value −1 may occur at two places; equal values still give one least value.',zh:'最小值−1可能在两处取得；值相同，最小值仍然只有一个。'} },

      { tag:{ko:'③ 미정계수',en:'3) Unknown constants',zh:'③ 待定系数'},
        head:{ko:"f(x)=x^3-3x^2+k\\ \\ (-1\\le x\\le3),\\ M=5",en:"f(x)=x^3-3x^2+k\\ \\ (-1\\le x\\le3),\\ M=5",zh:"f(x)=x^3-3x^2+k\\ \\ (-1\\le x\\le3),\\ M=5"},
        desc:{ko:'f(−1)=k−4, f(0)=k, f(2)=k−4, f(3)=k 이므로 최댓값은 k 입니다. k=5 이고 최솟값은 m=5−4=<b>1</b> 입니다.',en:'f(−1)=k−4, f(0)=k, f(2)=k−4, f(3)=k, so the greatest value is k. Then k=5 and the least value is m=5−4=<b>1</b>.',zh:'f(−1)=k−4，f(0)=k，f(2)=k−4，f(3)=k，所以最大值为k。k=5，最小值m=5−4=<b>1</b>。'},
        mathSteps:["M=k=5","m=k-4=1"],
        result:{ko:'k 는 그래프를 위아래로 옮길 뿐!',en:'k only slides the graph up or down!',zh:'k只是把图像上下平移！'},
        book:{ko:'a·f(x)+b(a>0) 도 최대·최소가 되는 x 는 그대로이고, 값만 a 배 한 뒤 b 를 더합니다.',en:'For a·f(x)+b (a>0) the x of the maximum and minimum stay the same; the values are multiplied by a and then b is added.',zh:'a·f(x)+b(a>0)取最值的x也不变，只是值乘以a再加b。'} }
    ],
    rule:{ ko:'① 구간 안의 f′(x)=0 인 x  ② 양 끝 f(a), f(b)  ③ 모두 비교해 가장 큰 것 M, 가장 작은 것 m',
      en:'① x inside with f′(x)=0  ② both ends f(a), f(b)  ③ compare all: greatest M, least m',
      zh:'① 区间内使f′(x)=0的x  ② 两端f(a)、f(b)  ③ 全部比较：最大为M，最小为m' }
  },

  check:{
    fills:[
      { tex:{ko:"f(x)=x^3-12x\\ \\ (-3\\le x\\le3)\\ \\Rightarrow\\ M=\\square",en:"f(x)=x^3-12x\\ \\ (-3\\le x\\le3)\\ \\Rightarrow\\ M=\\square",zh:"f(x)=x^3-12x\\ \\ (-3\\le x\\le3)\\ \\Rightarrow\\ M=\\square"}, answer:16,
        hint:{ko:'f(-3)=9,\\ f(-2)=16,\\ f(2)=-16,\\ f(3)=-9',en:'f(-3)=9,\\ f(-2)=16,\\ f(2)=-16,\\ f(3)=-9',zh:'f(-3)=9,\\ f(-2)=16,\\ f(2)=-16,\\ f(3)=-9'} },
      { tex:{ko:"f(x)=x^4-8x^2\\ \\ (-1\\le x\\le3)\\ \\Rightarrow\\ M+m=\\square",en:"f(x)=x^4-8x^2\\ \\ (-1\\le x\\le3)\\ \\Rightarrow\\ M+m=\\square",zh:"f(x)=x^4-8x^2\\ \\ (-1\\le x\\le3)\\ \\Rightarrow\\ M+m=\\square"}, answer:-7,
        hint:{ko:'f(-1)=-7,\\ f(0)=0,\\ f(2)=-16,\\ f(3)=9',en:'f(-1)=-7,\\ f(0)=0,\\ f(2)=-16,\\ f(3)=9',zh:'f(-1)=-7,\\ f(0)=0,\\ f(2)=-16,\\ f(3)=9'} }
    ],
    open:{ ko:'"극댓값은 언제나 최댓값이다" 가 틀린 까닭을 예를 들어 설명해 봅니다.',
      en:'Give an example to explain why "a local maximum is always the greatest value" is false.',
      zh:'举例说明为什么"极大值总是最大值"是错误的。' },
    openHint:{ ko:'f(x)=x³−3x+1 은 x=−1 에서 극댓값 3 을 갖지만, 구간 −2≤x≤3 에서는 끝점의 값 f(3)=19 가 더 큽니다. 극값은 그 근처에서만 가장 크거나 작은 값입니다.',
      en:'f(x)=x³−3x+1 has a local maximum 3 at x=−1, but on −2≤x≤3 the end value f(3)=19 is larger. An extreme value is only largest or smallest near that point.',
      zh:'f(x)=x³−3x+1在x=−1处有极大值3，但在−2≤x≤3上端点值f(3)=19更大。极值只是在该点附近最大或最小。' }
  },

  lab:{
    generator:'md157_closedMax', level:'main', count:6,
    params:{mode:'quartic'},
    intro:{
      ko:'사차함수는 극값이 셋까지 있습니다. 구간 안에 있는 극값만 골라 양 끝 값과 함께 비교하고 M, m, M+m 을 구합니다.',
      en:'A quartic has up to three extreme values. Keep only those inside the interval, compare them with the end values, and find M, m or M+m.',
      zh:'四次函数最多有三个极值。只挑出区间内的极值，与两端的值一起比较，求M、m或M+m。'
    }
  },

  arena:{
    generator:'md157_closedMax', level:'main', count:6, timeLimit:420,
    params:{mode:'coef'},
    rule:{ ko:'7분 안에 최댓값·최솟값으로 미정계수를 구하는 문제를 모두 풉니다!', en:'Solve every find-the-unknown-from-max-and-min problem within 7 minutes!', zh:'7分钟内解出所有由最值求待定系数的题！' }
  },

  stamp:{ label:{ ko:'봉우리 측량사', en:'Peak Surveyor', zh:'山峰测量员' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'꼭대기와 바닥을 다 찾았어! 🏔️',en:'Found the top and the bottom!',zh:'顶和底都找到了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'양 끝 값도 비교했어?',en:'Did you compare the end values too?',zh:'两端的值也比较了吗？'}, {ko:'구간 밖의 극값은 빼야 해!',en:'Leave out extreme points outside the interval!',zh:'区间外的极值要去掉！'} ],
    finish:{ ko:'완벽해! 봉우리 측량사! 🏔️✨', en:'Perfect! Peak Surveyor!', zh:'完美！山峰测量员！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
