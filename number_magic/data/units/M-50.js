/* Numbers of Magic — 유닛 M-50: 일차방정식 풀이 (중1 W8 · 문자와 식, 심화 유형 2차 2026-08-27) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-50'] = {
  id:'M-50', tier:'middle1', level:'30', order:13,
  generator:'md50_linearEquation',
  title:{ ko:'일차방정식 풀이', en:'Solving Linear Equations', zh:'一元一次方程的解法' },
  subtitle:{ ko:'저울처럼 양변에 같은 조작을 해서 x를 찾아요', en:'Like a balance scale, do the same thing to both sides to find x', zh:'像天平一样对两边做相同的操作来找出x' },
  icon:'⚖️',

  practice:{
    generator:'md50_linearEquation', level:'practice', count:5,
    params:{mode:'oneStep'},
    intro:{
      ko:'등식은 저울과 같아요 — 양변에 같은 수를 더하거나 빼거나 곱하거나 나눠도 균형이 유지돼요!',
      en:'An equation is like a balance scale — add, subtract, multiply, or divide both sides by the same number and it stays balanced!',
      zh:'等式就像天平——两边同时加、减、乘或除以相同的数，仍然保持平衡！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'양팔저울에 왼쪽엔 상자 하나와 추 3개, 오른쪽엔 추 9개가 있고 저울이 평형이에요. 상자 안에는 무게가 얼마인 물건이 들었을까요? 이게 바로 방정식이 하는 일이에요 — 모르는 값(x)을 찾는 거예요.',
        en:'On a balance scale, the left pan has one box and 3 weights, the right pan has 9 weights, and it\'s balanced. How heavy is what\'s inside the box? That\'s exactly what an equation does — find the unknown value (x).',
        zh:'天平左边放着一个箱子和3个砝码，右边放着9个砝码，正好平衡。箱子里的东西有多重呢？这正是方程要做的事——找出未知的值(x)。' },
      history:{ ko:'"방정식(equation)"이라는 말은 라틴어 "aequare"(같게 하다)에서 왔어요. 9세기 페르시아 수학자 알콰리즈미가 쓴 책 제목 『al-jabr』(복원)에서 오늘날의 "algebra"(대수)라는 단어가 나왔어요.',
        en:'The word "equation" comes from the Latin "aequare" (to make equal). The English word "algebra" comes from "al-jabr" ("restoration"), the title of a book by the 9th-century Persian mathematician al-Khwarizmi.',
        zh:'"方程(equation)"一词来自拉丁语"aequare"(使相等)。今天的"algebra"(代数)一词，源自9世纪波斯数学家花拉子米所著《al-jabr》(还原)一书的书名。' }
    },
    stages:[
      { tag:{ko:'① 상수항을 반대쪽으로 이항',en:'1) Transpose the constant to the other side',zh:'① 把常数项移到另一边'},
        head:{ko:'2x+3=11 \\;\\Rightarrow\\; x=4',en:'2x+3=11 \\;\\Rightarrow\\; x=4',zh:'2x+3=11 \\;\\Rightarrow\\; x=4'},
        desc:{ko:'양변에서 3을 <b>똑같이</b> 빼면 2x=8이 돼요(저울의 양쪽에서 같은 무게를 덜어내도 평형은 유지돼요). 그다음 양변을 2로 나누면 x=4.',
              en:'Subtracting 3 from <b>both sides equally</b> gives 2x=8 (removing the same weight from both pans keeps the balance). Then dividing both sides by 2 gives x=4.',
              zh:'两边<b>同时</b>减去3得到2x=8(天平两边同时拿走相同的重量，仍然平衡)。再两边同时除以2，得到x=4。'},
        mathSteps:['2x+3-3=11-3', '2x=8', 'x=4'],
        result:{ko:'양변에 같은 조작을 해서 x만 남겨요!',en:'Apply the same operation to both sides until only x remains!',zh:'两边做相同的操作，最后只留下x！'},
        book:{ko:'"이항"이란 등식의 한쪽 항을 부호를 바꿔 반대쪽으로 옮기는 걸 말해요(+3을 옮기면 −3이 되는 것도 사실은 양변에서 3을 뺀 것과 같아요).',
              en:'"Transposing" means moving a term to the other side with a flipped sign (moving +3 becomes −3, which is really the same as subtracting 3 from both sides).',
              zh:'"移项"是指把等式一边的项变号后移到另一边(+3移过去变成−3，其实和两边同时减3是一回事)。'} },

      { tag:{ko:'② 양변에 x가 있으면 x항끼리 모아요',en:'2) With x on both sides, gather the x-terms',zh:'② 两边都有x就把x项集中在一起'},
        head:{ko:'5x+2=2x+11 \\;\\Rightarrow\\; x=3',en:'5x+2=2x+11 \\;\\Rightarrow\\; x=3',zh:'5x+2=2x+11 \\;\\Rightarrow\\; x=3'},
        desc:{ko:'양변에서 2x를 빼면 3x+2=11이 돼요(x항을 한쪽으로 모으는 것). 그다음 상수항 2를 이항하면 3x=9, 마지막으로 3으로 나누면 x=3.',
              en:'Subtracting 2x from both sides gives 3x+2=11 (gathering the x-terms on one side). Then transposing the constant 2 gives 3x=9, and dividing by 3 gives x=3.',
              zh:'两边同时减去2x得到3x+2=11(把x项集中到一边)。再把常数2移项得到3x=9，最后除以3得x=3。'},
        mathSteps:['5x-2x=3x', '3x+2=11', 'x=3'],
        result:{ko:'x항은 한쪽으로, 상수항은 다른 쪽으로 모아요!',en:'Gather the x-terms on one side, constants on the other!',zh:'x项集中一边，常数项集中另一边！'},
        book:{ko:'등식의 성질(양변에 같은 수를 더하기·빼기·곱하기·나누기)만 지키면, 어떤 순서로 풀어도 답은 항상 같아요.',
              en:'As long as you follow the properties of equality (add/subtract/multiply/divide both sides by the same amount), the answer is always the same no matter the order.',
              zh:'只要遵守等式的性质(两边同时加、减、乘、除以相同的数)，不管按什么顺序解，答案都一样。'} }
    ],
    rule:{ ko:'등식의 성질로 양변에 같은 조작을 해서 x만 남겨요 — 상수항은 이항, x항은 한쪽으로 모으고, 마지막엔 계수로 나눠요!',
      en:'Use the properties of equality to isolate x — transpose constants, gather x-terms on one side, then divide by the coefficient!',
      zh:'用等式的性质只留下x——移项常数，把x项集中一边，最后除以系数！' }
  },

  check:{
    fills:[
      { tex:'3x = 12 \\;\\Rightarrow\\; x = \\square', answer:4,
        hint:{ ko:'양변을 3으로 나눠요', en:'Divide both sides by 3', zh:'两边除以3' } },
      { tex:'2x+5 = 13 \\;\\Rightarrow\\; x = \\square', answer:4,
        hint:{ ko:'5를 이항하면 2x=8', en:'Transpose the 5 to get 2x=8', zh:'移项5得2x=8' } }
    ],
    open:{ ko:'4x+1=2x+9의 풀이 과정을 이항 순서대로 설명해봐요.',
      en:'Explain the solution steps for 4x+1=2x+9 in transposing order.',
      zh:'按移项顺序说说4x+1=2x+9的解题过程。' },
    openHint:{ ko:'2x=8 → x=4',
      en:'2x=8 → x=4',
      zh:'2x=8 → x=4' }
  },

  lab:{
    generator:'md50_linearEquation', level:'main', count:4,
    params:{mode:'twoStep',wide:true},
    intro:{
      ko:'상수항부터 이항하고, 마지막에 x의 계수로 나눠요!',
      en:'Transpose the constant first, then divide by x\'s coefficient at the end!',
      zh:'先移项常数，最后除以x的系数！'
    }
  },

  arena:{
    generator:'md50_linearEquation', level:'main', count:8, timeLimit:300,
    params:{mode:'bothSides',wide:true},
    rule:{ ko:'5분 안에 양변에 x가 있는 방정식도 빠르게 풀어요!', en:'Solve equations with x on both sides quickly, within 5 minutes!', zh:'5分钟内快速解出两边都有x的方程！' }
  },

  stamp:{ label:{ ko:'저울 균형사', en:'Balance-Scale Keeper', zh:'天平平衡师' }, coins:46 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'저울의 균형을 완벽하게 지키며 x를 찾았구나! ⚖️',en:'You kept the balance perfectly and found x!',zh:'你完美保持平衡并找出了x！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'상수항을 반대쪽으로 이항해봐!',en:'Transpose the constant to the other side!',zh:'把常数项移到另一边！'}, {ko:'양변에 x가 있으면 x항부터 한쪽으로 모아!',en:'When x is on both sides, gather the x-terms first!',zh:'两边都有x时，先把x项集中一边！'} ],
    finish:{ ko:'완벽해! 저울 균형사! ⚖️✨', en:'Perfect! Balance-Scale Keeper!', zh:'完美！天平平衡师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
