/* Numbers of Magic — 유닛 M-106: 식의 값의 범위 (고등 공통수학1 · 과정 44, 2026-09-29)
   근거: docs/high-build-spec.md MD106. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-106'] = {
  id:'M-106', tier:'highmath1', level:'44', order:106,
  generator:'md106_exprRange',
  title:{ ko:'식의 값의 범위', en:'Ranges of Expressions', zh:'式子的取值范围' },
  subtitle:{ ko:'끝값끼리 계산해 범위의 양 끝을 찾습니다', en:'Combine endpoints to find both ends of the range', zh:'用端点计算范围的两端' },
  icon:'📏',

  practice:{
    generator:'md106_exprRange', level:'practice', count:6,
    params:{mode:'sum'},
    intro:{
      ko:'더하는 식은 작은 끝끼리, 큰 끝끼리 더합니다. 계수가 있으면 먼저 곱합니다.',
      en:'For a sum, add the small ends together and the large ends together; multiply by any coefficients first.',
      zh:'求和时小端加小端、大端加大端；有系数先乘系数。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'x 는 1 과 3 사이, y 는 2 와 5 사이 어딘가에 있습니다. 정확한 값은 몰라도 x+y 가 어디부터 어디까지인지는 확실히 말할 수 있습니다.',
        en:'x lies somewhere between 1 and 3, and y between 2 and 5. Without knowing the exact values we can still say exactly where x+y can range.',
        zh:'x在1和3之间，y在2和5之间。不知道确切的值，也能确定x+y的范围。' }
    },
    stages:[
      { tag:{ko:'① 합: 같은 쪽 끝끼리',en:'1) Sum: same ends together',zh:'① 和：同侧端点相加'},
        head:{ko:'1\\le x\\le 3,\\ 2\\le y\\le 5',en:'1\\le x\\le 3,\\ 2\\le y\\le 5',zh:'1\\le x\\le 3,\\ 2\\le y\\le 5'},
        desc:{ko:'가장 작을 때는 1+2, 가장 클 때는 3+5 이므로 <b>3≤x+y≤8</b> 입니다.',
              en:'The smallest is 1+2 and the largest 3+5, so <b>3≤x+y≤8</b>.',
              zh:'最小是1+2，最大是3+5，所以<b>3≤x+y≤8</b>。'},
        mathSteps:['1+2\\le x+y\\le 3+5', '3\\le x+y\\le 8'],
        result:{ko:'작은 것끼리, 큰 것끼리 더합니다!',en:'Small with small, large with large!',zh:'小的加小的，大的加大的！'},
        book:{ko:'2x+3y 처럼 계수가 있으면 2≤2x≤6, 6≤3y≤15 로 먼저 바꿉니다.',
              en:'With coefficients, as in 2x+3y, first write 2≤2x≤6 and 6≤3y≤15.',
              zh:'像2x+3y这样有系数时，先写成2≤2x≤6、6≤3y≤15。'} },

      { tag:{ko:'② 차: 엇갈려 빼기',en:'2) Difference: cross the ends',zh:'② 差：交叉相减'},
        head:{ko:'-5\\le -y\\le -2',en:'-5\\le -y\\le -2',zh:'-5\\le -y\\le -2'},
        desc:{ko:'x−y=x+(−y) 로 보면 −y 의 범위는 끝이 뒤바뀝니다. 그래서 1−5≤x−y≤3−2, 곧 <b>−4≤x−y≤1</b> 입니다.',
              en:'Seeing x−y as x+(−y), the ends of −y swap. So 1−5≤x−y≤3−2, that is <b>−4≤x−y≤1</b>.',
              zh:'把x−y看成x+(−y)，−y的两端互换。所以1−5≤x−y≤3−2，即<b>−4≤x−y≤1</b>。'},
        mathSteps:['1-5\\le x-y\\le 3-2', '-4\\le x-y\\le 1'],
        result:{ko:'(작은 끝)−(큰 끝) 이 아래끝입니다!',en:'(small end)−(large end) is the lower end!',zh:'(小端)−(大端)是下端！'},
        book:{ko:'끝끼리 그대로 빼서 1−2≤x−y≤3−5 로 쓰면 틀립니다.',
              en:'Subtracting end from matching end, 1−2≤x−y≤3−5, is wrong.',
              zh:'直接同侧相减写成1−2≤x−y≤3−5是错的。'} },

      { tag:{ko:'③ 곱: 네 개를 모두',en:'3) Product: check all four',zh:'③ 积：四个都算'},
        head:{ko:'-1\\le x\\le 2,\\ 3\\le y\\le 4',en:'-1\\le x\\le 2,\\ 3\\le y\\le 4',zh:'-1\\le x\\le 2,\\ 3\\le y\\le 4'},
        desc:{ko:'끝끼리의 곱은 −3, −4, 6, 8 입니다. 가장 작은 값과 가장 큰 값을 골라 <b>−4≤xy≤8</b> 입니다.',
              en:'The endpoint products are −3, −4, 6, 8. Taking the smallest and largest gives <b>−4≤xy≤8</b>.',
              zh:'端点之积为−3、−4、6、8。取最小和最大得<b>−4≤xy≤8</b>。'},
        mathSteps:['(-1)\\times3=-3,\\ (-1)\\times4=-4', '2\\times3=6,\\ 2\\times4=8'],
        result:{ko:'부호가 섞이면 네 개를 다 봅니다!',en:'Mixed signs? Look at all four!',zh:'符号不同时四个都要看！'},
        book:{ko:'x, y 가 모두 양수일 때만 작은 끝끼리·큰 끝끼리 곱해도 됩니다.',
              en:'Only when x and y are both positive may you multiply small by small and large by large.',
              zh:'只有x、y都为正时才能小端乘小端、大端乘大端。'} }
    ],
    rule:{ ko:'① 합은 같은 쪽 끝끼리  ② 차는 (작은 끝)−(큰 끝) ~ (큰 끝)−(작은 끝)  ③ 곱은 네 개를 모두 비교합니다',
      en:'① Sum: same ends together  ② Difference: (small)−(large) to (large)−(small)  ③ Product: compare all four',
      zh:'① 和：同侧端点相加  ② 差：(小端)−(大端)到(大端)−(小端)  ③ 积：四个都比较' }
  },

  check:{
    fills:[
      { tex:'1\\le x\\le 3,\\ 2\\le y\\le 5 \\;\\Rightarrow\\; x+y\\le\\square', answer:8,
        hint:{ ko:'3+5', en:'3+5', zh:'3+5' } },
      { tex:'1\\le x\\le 3,\\ 2\\le y\\le 5 \\;\\Rightarrow\\; \\square\\le x-y', answer:-4,
        hint:{ ko:'1−5', en:'1−5', zh:'1−5' } }
    ],
    open:{ ko:'2≤x≤4, 1≤y≤2 일 때 x/y 의 범위를 구하는 방법을 설명해 봅니다.',
      en:'Explain how to find the range of x/y when 2≤x≤4 and 1≤y≤2.',
      zh:'说说2≤x≤4、1≤y≤2时求x/y范围的方法。' },
    openHint:{ ko:'모두 양수이므로 가장 작은 값은 2/2=1, 가장 큰 값은 4/1=4 입니다.',
      en:'All are positive, so the smallest is 2/2=1 and the largest is 4/1=4.',
      zh:'都为正，最小是2/2=1，最大是4/1=4。' }
  },

  lab:{
    generator:'md106_exprRange', level:'main', count:6,
    params:{mode:'diff'},
    intro:{
      ko:'빼는 문자는 부호를 바꾸면 끝이 뒤바뀝니다. 그다음 끝끼리 더합니다.',
      en:'Changing the sign of the subtracted variable swaps its ends; then add the ends.',
      zh:'减去的字母变号后两端互换，再把端点相加。'
    }
  },

  arena:{
    generator:'md106_exprRange', level:'main', count:6, timeLimit:420,
    params:{mode:'prod'},
    rule:{ ko:'7분 안에 xy 의 범위를 모두 구합니다!', en:'Find every range of xy within 7 minutes!', zh:'7分钟内求出所有xy的范围！' }
  },

  stamp:{ label:{ ko:'범위 측량사', en:'Range Surveyor', zh:'范围测量师' }, coins:48 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'양 끝을 정확히 잡았구나! 📏',en:'You caught both ends exactly!',zh:'两端抓得很准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'빼기는 끝을 엇갈려 계산해!',en:'For a difference, cross the ends!',zh:'减法要交叉端点计算！'}, {ko:'곱은 네 가지를 다 계산해 봐!',en:'For a product, compute all four!',zh:'积要把四种都算一算！'} ],
    finish:{ ko:'완벽해! 범위 측량사! 📏✨', en:'Perfect! Range Surveyor!', zh:'完美！范围测量师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
