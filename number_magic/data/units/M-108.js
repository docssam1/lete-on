/* Numbers of Magic — 유닛 M-108: 절댓값을 포함한 부등식 (고등 공통수학1 · 과정 45, 2026-09-29)
   근거: docs/high-build-spec.md MD108. 예시는 새로 만들었다. 역사 문단은 널리 알려진 사실만. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-108'] = {
  id:'M-108', tier:'highmath1', level:'45', order:108,
  generator:'md108_absIneq',
  title:{ ko:'절댓값을 포함한 부등식', en:'Inequalities with Absolute Values', zh:'含绝对值的不等式' },
  subtitle:{ ko:'|A|<c 는 −c<A<c 입니다', en:'|A|<c means −c<A<c', zh:'|A|<c即−c<A<c' },
  icon:'↔️',

  practice:{
    generator:'md108_absIneq', level:'practice', count:6,
    params:{mode:'linear'},
    intro:{
      ko:'|ax−b|<c 를 −c<ax−b<c 로 바꾼 뒤 x 의 범위의 양 끝을 두 칸에 씁니다.',
      en:'Rewrite |ax−b|<c as −c<ax−b<c and enter both ends of the range of x in the two boxes.',
      zh:'把|ax−b|<c改写为−c<ax−b<c，把x的范围的两端填入两格。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'|x−2| 는 수직선에서 x 와 2 사이의 거리입니다. 그래서 |x−2|<3 은 "2 에서 3 보다 가까운 곳"이라는 뜻이고, 답은 2 를 가운데 둔 구간이 됩니다.',
        en:'|x−2| is the distance between x and 2 on a number line. So |x−2|<3 means "closer than 3 to 2", and the answer is an interval centred at 2.',
        zh:'|x−2|是数轴上x与2之间的距离。所以|x−2|<3表示"离2的距离小于3"，答案是以2为中心的区间。' },
      history:{ ko:'절댓값 기호 |x| 는 1841년 독일의 바이어슈트라스가 처음 쓴 것으로 알려져 있습니다.',
        en:'The absolute value sign |x| is known to have been introduced by the German mathematician Weierstrass in 1841.',
        zh:'绝对值符号|x|一般认为是德国数学家魏尔斯特拉斯于1841年首先使用的。' }
    },
    stages:[
      { tag:{ko:'① 거리로 읽기',en:'1) Read it as a distance',zh:'① 看成距离'},
        head:{ko:'|x-2|<3',en:'|x-2|<3',zh:'|x-2|<3'},
        desc:{ko:'−3<x−2<3 이므로 양변에 2 를 더해 <b>−1<x<5</b> 입니다.',
              en:'−3<x−2<3, and adding 2 throughout gives <b>−1<x<5</b>.',
              zh:'−3<x−2<3，各边加2得<b>−1<x<5</b>。'},
        mathSteps:['-3<x-2<3', '-1<x<5'],
        result:{ko:'가운데 2 에서 양쪽으로 3 씩!',en:'3 either side of the centre 2!',zh:'以2为中心左右各3！'},
        book:{ko:'|x−2|>3 이면 반대로 x<−1 또는 x>5 입니다.',
              en:'For |x−2|>3 it is the outside instead: x<−1 or x>5.',
              zh:'|x−2|>3则相反：x<−1或x>5。'} },

      { tag:{ko:'② 절댓값이 둘이면 구간 나누기',en:'2) Two absolute values: split into intervals',zh:'② 两个绝对值：分区间'},
        head:{ko:'|x+1|+|x-3|\\le 6',en:'|x+1|+|x-3|\\le 6',zh:'|x+1|+|x-3|\\le 6'},
        desc:{ko:'x<−1, −1≤x<3, x≥3 으로 나누어 풀면 각각 −2≤x<−1, 모든 x, 3≤x≤4 입니다. 합치면 <b>−2≤x≤4</b> 이고 정수는 7 개입니다.',
              en:'Split into x<−1, −1≤x<3 and x≥3: the pieces give −2≤x<−1, every x, and 3≤x≤4. Together <b>−2≤x≤4</b>, which holds 7 integers.',
              zh:'分x<−1、−1≤x<3、x≥3求解，分别得−2≤x<−1、全部x、3≤x≤4。合并得<b>−2≤x≤4</b>，含7个整数。'},
        mathSteps:['x<-1,\\quad -1\\le x<3,\\quad x\\ge 3', '-2\\le x\\le 4'],
        result:{ko:'절댓값 안이 0 이 되는 곳에서 나눕니다!',en:'Split where the insides become 0!',zh:'在绝对值内为0处分开！'},
        book:{ko:'각 구간에서 찾은 해는 그 구간 안의 것만 인정합니다.',
              en:'Keep only the solutions that lie inside each interval.',
              zh:'每个区间求出的解只保留该区间内的部分。'} },

      { tag:{ko:'③ 이차식과 절댓값',en:'3) Quadratics with absolute values',zh:'③ 二次式与绝对值'},
        head:{ko:'x^2-|x|-6<0',en:'x^2-|x|-6<0',zh:'x^2-|x|-6<0'},
        desc:{ko:'x²=|x|² 이므로 |x|=t 로 두면 (t−3)(t+2)<0 입니다. t≥0 이라 t+2>0, 곧 |x|<3 이므로 <b>−3<x<3</b> 입니다.',
              en:'Since x²=|x|², put t=|x|: (t−3)(t+2)<0. As t≥0, t+2>0, so |x|<3, that is <b>−3<x<3</b>.',
              zh:'因为x²=|x|²，令t=|x|得(t−3)(t+2)<0。t≥0所以t+2>0，即|x|<3，得<b>−3<x<3</b>。'},
        mathSteps:['(|x|-3)(|x|+2)<0', '|x|<3'],
        result:{ko:'|x| 를 한 덩어리로 봅니다!',en:'Treat |x| as one block!',zh:'把|x|看成一个整体！'},
        book:{ko:'|x²−5|<4 처럼 이차식이 절댓값 안에 있으면 1<x²<9 로 바꿉니다.',
              en:'With a quadratic inside, as in |x²−5|<4, rewrite it as 1<x²<9.',
              zh:'像|x²−5|<4这样二次式在绝对值内时，改写为1<x²<9。'} }
    ],
    rule:{ ko:'① |A|<c 는 −c<A<c  ② 절댓값이 둘이면 구간을 나눈다  ③ x²−|x| 꼴은 |x|=t 로 치환합니다',
      en:'① |A|<c means −c<A<c  ② With two absolute values, split into intervals  ③ For x²−|x| forms, put t=|x|',
      zh:'① |A|<c即−c<A<c  ② 两个绝对值时分区间  ③ x²−|x|型令t=|x|' }
  },

  check:{
    fills:[
      { tex:'|x-2|<3 \\;\\Rightarrow\\; -1<x<\\square', answer:5,
        hint:{ ko:'2+3', en:'2+3', zh:'2+3' } },
      { tex:'|2x-1|\\le 5 \\;\\Rightarrow\\; \\square\\le x\\le 3', answer:-2,
        hint:{ ko:'−4≤2x≤6', en:'−4≤2x≤6', zh:'−4≤2x≤6' } }
    ],
    open:{ ko:'|x−1|≥2 의 해를 수직선으로 설명해 봅니다.',
      en:'Explain the solution of |x−1|≥2 using a number line.',
      zh:'用数轴说明|x−1|≥2的解。' },
    openHint:{ ko:'1 에서 거리가 2 이상인 곳이므로 x≤−1 또는 x≥3 입니다.',
      en:'It is where the distance from 1 is at least 2: x≤−1 or x≥3.',
      zh:'是离1的距离不小于2的部分：x≤−1或x≥3。' }
  },

  lab:{
    generator:'md108_absIneq', level:'main', count:6,
    params:{mode:'count'},
    intro:{
      ko:'해의 범위를 구한 뒤 그 안의 정수를 셉니다. 끝이 분수여도 정수만 셉니다.',
      en:'Find the solution range, then count the integers inside, even if the ends are fractions.',
      zh:'求出解的范围后数其中的整数，端点是分数也只数整数。'
    }
  },

  arena:{
    generator:'md108_absIneq', level:'main', count:6, timeLimit:480,
    params:{mode:'quad'},
    rule:{ ko:'8분 안에 이차식과 절댓값이 섞인 부등식을 모두 풉니다!', en:'Solve every inequality mixing quadratics and absolute values within 8 minutes!', zh:'8分钟内解完所有二次式与绝对值混合的不等式！' }
  },

  stamp:{ label:{ ko:'거리 측정사', en:'Distance Gauger', zh:'距离测量师' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'거리 감각이 대단하구나! ↔️',en:'What a sense of distance!',zh:'距离感真好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'|A|<c 는 −c<A<c 야!',en:'|A|<c means −c<A<c!',zh:'|A|<c就是−c<A<c！'}, {ko:'절댓값 안이 0 이 되는 곳에서 나눠 봐!',en:'Split where the inside becomes 0!',zh:'在绝对值内为0的地方分开试试！'} ],
    finish:{ ko:'완벽해! 거리 측정사! ↔️✨', en:'Perfect! Distance Gauger!', zh:'完美！距离测量师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
