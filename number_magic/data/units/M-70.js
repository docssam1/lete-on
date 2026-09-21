/* Numbers of Magic — 유닛 M-70: 일차방정식의 활용 (중등 교과 연산 4차 2026-09-21)
   표기 주의: 이 파일의 tex 는 KaTeX 간격 명령으로 `\quad` 만 쓴다(mid9.js 상단 주석 참조). */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-70'] = {
  id:'M-70', tier:'middle1', level:'30', order:12,
  generator:'md70_linearApply',
  title:{ ko:'일차방정식의 활용', en:'Linear Equations in Use', zh:'一元一次方程的应用' },
  subtitle:{ ko:'말을 식으로 옮기면 나머지는 이미 아는 일입니다', en:'Turn the words into an equation and the rest is work you already know', zh:'把话translate成算式，剩下的就是你已经会的' },
  icon:'🗺️',

  practice:{
    generator:'md70_linearApply', level:'practice', count:5,
    params:{mode:'number'},
    intro:{ ko:'구하려는 것을 x로 놓고, 문장을 그대로 식으로 옮겨 보세요!', en:'Let x be what you are asked for, then turn the sentences straight into an equation!', zh:'把要求的量设为x，再把句子直接写成算式！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'"연속하는 세 수의 합이 48"이라는 말을 듣고 48÷3=16이라고 바로 답하는 사람이 있습니다. 맞았습니다. 그런데 왜 맞았을까요? 가운데 수를 x로 놓으면 (x−1)+x+(x+1)=3x가 되어 −1과 +1이 서로 지워지기 때문입니다. 식은 감으로 맞힌 것을 **왜 맞는지**까지 알려줍니다.', en:'Told that three consecutive numbers add to 48, some people answer 16 at once by dividing. They are right - but why? Call the middle number x and the sum is (x-1)+x+(x+1) = 3x, because the -1 and the +1 cancel. The equation tells you not just the answer but why the shortcut works.', zh:'听到"三个连续数的和是48"，有人马上用48÷3=16答出来。答对了——可为什么对呢？设中间的数为x，和就是(x−1)+x+(x+1)=3x，因为−1和+1互相抵消了。式子不只给出答案，还告诉你**为什么**。' },
      history:{ ko:'이런 문제 풀이를 체계로 만든 사람이 9세기 페르시아의 알콰리즈미입니다. 그의 책 제목 『al-jabr』(흩어진 것을 다시 모으기)에서 "대수(algebra)"라는 말이 나왔고, 그의 이름 자체가 "알고리즘(algorithm)"이 됐습니다. 정해진 순서대로 따라가면 누구나 답에 닿는다는 생각이 거기서 시작됐습니다.', en:'The person who turned this into a system was al-Khwarizmi, a ninth-century Persian scholar. The title of his book, al-jabr - restoring what has been scattered - gave us the word algebra, and his own name became algorithm. The idea that anyone can reach the answer by following fixed steps starts there.', zh:'把这类解法做成体系的是9世纪波斯的花拉子米。他的书名《al-jabr》(把散开的重新聚拢)给了我们"代数(algebra)"一词，他的名字本身变成了"算法(algorithm)"。按固定步骤谁都能得到答案，这个想法就从那里开始。' }
    },
    stages:[
      { tag:{ ko:'① 거리 = 속력 × 시간', en:'1) Distance = speed x time', zh:'① 路程 = 速度 × 时间' },
        head:{ ko:'4x = 6x - 8 \\quad\\Rightarrow\\quad x = 4', en:'4x = 6x - 8 \\quad\\Rightarrow\\quad x = 4', zh:'4x = 6x - 8 \\quad\\Rightarrow\\quad x = 4' },
        desc:{ ko:'같은 길을 시속 4km로 걸으면 시속 6km로 갈 때보다 8km 덜 갑니다. 걸린 시간이 <b>같으므로</b> 시간을 x로 놓습니다. 거리는 각각 4x와 6x이고, 그 차가 8입니다.', en:'Walking a road at 4 km/h covers 8 km less than going at 6 km/h. The time is <b>the same</b> in both cases, so let the time be x: the distances are 4x and 6x, and they differ by 8.', zh:'同一条路以每小时4km走，比每小时6km少走8km。两种情况用的时间<b>相同</b>，所以设时间为x：路程分别是4x和6x，相差8。' },
        mathSteps:['6x - 4x = 8', '2x = 8', 'x = 4'],
        result:{ ko:'무엇이 같은지 찾으면 식이 보입니다!', en:'Find what is equal and the equation appears!', zh:'找出什么是相等的，式子就出来了！' },
        book:{ ko:'거리·속력·시간 문제는 <b>거리가 같다</b>, <b>시간이 같다</b>, <b>합이 얼마다</b> 중 하나에서 식이 나옵니다. 단위를 맞추는 것도 잊지 마세요 — 분과 시간이 섞이면 한쪽으로 고쳐야 합니다.', en:'These problems give an equation from one of three things: the distances are equal, the times are equal, or they add to a given total. And keep the units consistent - if minutes and hours are mixed, convert one of them first.', zh:'路程·速度·时间的题，等量关系来自三种之一：路程相同、时间相同、或两者之和为定值。还要注意单位统一——分和小时混在一起时要先换算。' } },

      { tag:{ ko:'② 원가 → 정가 → 판매가', en:'2) Cost, then marked price, then selling price', zh:'② 成本 → 定价 → 售价' },
        head:{ ko:'2000 \\times 1.2 \\times 0.9 = 2160', en:'2000 \\times 1.2 \\times 0.9 = 2160', zh:'2000 \\times 1.2 \\times 0.9 = 2160' },
        desc:{ ko:'원가 2000원에 20% 이익을 붙이면 정가는 2000×1.2=2400원입니다. 여기서 10%를 할인하면 2400×0.9=2160원. 이익은 <b>판매가에서 원가를 뺀</b> 160원입니다 — 정가에서 빼는 것이 아닙니다.', en:'A 20% markup on a cost of 2000 gives 2000 x 1.2 = 2400. Taking 10% off that gives 2400 x 0.9 = 2160. The profit is <b>selling price minus cost</b>, which is 160 - not the discount off the marked price.', zh:'成本2000元加价20%，定价是2000×1.2=2400元。再打九折就是2400×0.9=2160元。利润是<b>售价减成本</b>的160元——不是从定价里减。' },
        mathSteps:['2000 \\times 1.2 = 2400', '2400 \\times 0.9 = 2160', '2160 - 2000 = 160'],
        result:{ ko:'%는 100으로 나눈 비율 — 20% 이익은 ×1.2!', en:'A percent is a hundredth - a 20% markup is x1.2!', zh:'百分数就是百分之几——加价20%就是×1.2！' },
        book:{ ko:'20% 올렸다가 20% 내리면 원래대로 돌아오지 않습니다. 1.2×0.8=0.96이라 오히려 4% 손해입니다 — 올릴 때와 내릴 때 <b>기준이 다르기</b> 때문입니다.', en:'Raising a price 20% and then cutting it 20% does not get you back: 1.2 x 0.8 = 0.96, a 4% loss. The rise and the fall are percentages <b>of different amounts</b>.', zh:'先涨20%再降20%回不到原价：1.2×0.8=0.96，反而亏4%——因为涨和降的<b>基准不同</b>。' } }
    ],
    rule:{ ko:'구하려는 것을 x로 놓고 → 문장을 식으로 → 풀고 → 말이 되는지 확인! 관계식만 기억하면 두 번째 걸음이 쉬워집니다.', en:'Name what you want as x, turn the words into an equation, solve, then check it makes sense. Knowing the standard relations makes the second step easy.', zh:'设要求的量为x → 把句子写成算式 → 解出来 → 检验是否合理！记住关系式，第二步就容易了。' }
  },

  check:{
    fills:[
      { tex:'4x = 6x - 8 \\quad\\Rightarrow\\quad x = \\square', answer:4,
        hint:{ ko:'2x=8', en:'2x=8', zh:'2x=8' } },
      { tex:{ ko:'\\text{원가 } 3000, \\; 20\\% \\text{ 이익} \\quad\\Rightarrow\\quad \\text{정가} = \\square', en:'\\text{cost } 3000, \\; 20\\% \\text{ markup} \\quad\\Rightarrow\\quad \\text{marked price} = \\square', zh:'\\text{成本} 3000, \\; \\text{加价} 20\\% \\quad\\Rightarrow\\quad \\text{定价} = \\square' }, answer:3600,
        hint:{ ko:'3000 × 1.2', en:'3000 x 1.2', zh:'3000×1.2' } }
    ],
    open:{ ko:'거리·속력·시간 문제에서 무엇을 x로 놓을지 어떻게 정하는지 말해봅니다.', en:'Explain how you decide what to call x in a distance-speed-time problem.', zh:'说说路程·速度·时间的题里怎么决定把什么设为x。' },
    openHint:{ ko:'구하라는 것 또는 두 경우에 공통인 양(대개 시간)', en:'What is asked for, or whatever the two cases share - usually the time', zh:'题目要求的量，或两种情况共有的量(通常是时间)' }
  },

  lab:{
    generator:'md70_linearApply', level:'main', count:4,
    params:{mode:'speed'},
    intro:{ ko:'거리 = 속력 × 시간! 두 경우에 무엇이 같은지 먼저 찾으세요.', en:'Distance = speed x time. First find what the two cases have in common.', zh:'路程=速度×时间！先找出两种情况中什么是相同的。' }
  },

  arena:{
    generator:'md70_linearApply', level:'main', count:8, timeLimit:360,
    params:{mode:'price'},
    rule:{ ko:'6분 안에 정가와 판매가를 차례로 구하고 이익까지 냅니다!', en:'Within 6 minutes, work out the marked price, the selling price and then the profit!', zh:'6分钟内依次求出定价、售价和利润！' }
  },

  stamp:{ label:{ ko:'말을 식으로 바꾸는 이', en:'Turner of Words into Equations', zh:'把话变成算式的人' }, coins:54 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, { ko:'말을 식으로 정확히 옮겼구나! 🗺️', en:'You turned the words into an equation exactly right!', zh:'你把话准确地写成了算式！' }, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ { ko:'무엇을 x로 놓았는지 다시 확인해 봐!', en:'Check again what you called x!', zh:'再确认一下你把什么设成了x！' }, { ko:'이익은 판매가에서 원가를 빼는 거야!', en:'Profit is selling price minus cost!', zh:'利润是售价减成本！' } ],
    finish:{ ko:'완벽해! 말을 식으로 바꾸는 이! 🗺️✨', en:'Perfect! Turner of Words into Equations!', zh:'完美！把话变成算式的人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
