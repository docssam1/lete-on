/* Numbers of Magic — 유닛 M-82: 수직선 위의 위치 (중등 교과 연산 4차 2026-09-21)
   표기 주의: 이 파일의 tex 는 KaTeX 간격 명령으로 `\quad` 만 쓴다(mid9.js 상단 주석 참조). */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-82'] = {
  id:'M-82', tier:'middle1', level:'29', order:2,
  generator:'md82_numberLine',
  title:{ ko:'수직선 위의 위치', en:'Positions on the Number Line', zh:'数轴上的位置' },
  subtitle:{ ko:'0을 가운데 두면 모든 수에 제 자리가 생겨요', en:'Put zero in the middle and every number gets a place', zh:'把0放在中间，每个数就都有了位置' },
  icon:'📏',

  practice:{
    generator:'md82_numberLine', level:'practice', count:5,
    params:{mode:'integer'},
    intro:{ ko:'0에서 오른쪽으로 몇 칸인지, 왼쪽으로 몇 칸인지 세어 보세요!', en:'Count how many steps the dot is to the right or left of zero!', zh:'数一数点在0的右边或左边几格！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'온도계를 세워 놓고 보세요. 0℃ 위로는 영상, 아래로는 영하예요. 그 온도계를 눕히면 그대로 수직선이 돼요 — 0을 가운데 두고 오른쪽이 양수, 왼쪽이 음수. 수를 "크기"로만 알던 데서 "자리"로 보게 되는 순간이고, 이 한 줄이 나중에 좌표평면의 가로축이 돼요.', en:'Stand a thermometer up and look at it: above 0 degrees is warm, below is cold. Lay that thermometer on its side and it is a number line - zero in the middle, positives to the right, negatives to the left. This is where numbers stop being only sizes and start having places, and this single line later becomes the horizontal axis of the coordinate plane.', zh:'把温度计竖起来看：0℃以上是零上，以下是零下。把它放倒，就成了数轴——0在中间，右边是正数，左边是负数。这是数从"大小"变成"位置"的时刻，而这一条线以后就成了坐标平面的横轴。' },
      history:{ ko:'음수를 "수"로 인정하기까지는 오래 걸렸어요. 7세기 인도의 브라마굽타가 빚과 재산으로 음수를 다뤘지만, 유럽에서는 17세기까지도 "거짓된 수"라 부르며 꺼렸어요. 수직선에 자리를 주고 나서야 음수가 자연스러워졌어요 — 0보다 작은 수가 아니라 0의 반대쪽에 있는 수라고 보게 된 거예요.', en:'It took a long time for negatives to count as numbers. Brahmagupta in seventh-century India handled them as debts and fortunes, yet in Europe they were still called "false numbers" into the seventeenth century. What made them feel natural was giving them a place on a line: not numbers smaller than nothing, but numbers on the other side of zero.', zh:'让负数被承认为"数"花了很长时间。7世纪印度的婆罗摩笈多用欠债和财产来处理负数，而欧洲直到17世纪还称它们为"假数"。是数轴上的位置让负数变得自然——它们不是比"无"还小的数，而是在0另一侧的数。' }
    },
    stages:[
      { tag:{ ko:'① 0에서 몇 칸인가', en:'1) How many steps from zero', zh:'① 离0几格' },
        head:{ ko:'\\text{0에서 왼쪽 } 3 \\text{칸} \\quad\\Rightarrow\\quad -3', en:'\\text{3 steps left of } 0 \\quad\\Rightarrow\\quad -3', zh:'\\text{0向左} 3 \\text{格} \\quad\\Rightarrow\\quad -3' },
        desc:{ ko:'점이 어디 있든 <b>0에서 세기 시작</b>해요. 오른쪽으로 세면 양수, 왼쪽으로 세면 음수. 눈금 하나가 1이라 세 칸 왼쪽이면 −3이에요.', en:'Wherever the dot is, <b>start counting at zero</b>: right for positives, left for negatives. One mark is one, so three to the left is -3.', zh:'不管点在哪里，都要<b>从0开始数</b>：向右是正数，向左是负数。一格是1，往左三格就是−3。' },
        mathSteps:['-3 < 0 < 3', '\\text{P} = -3'],
        result:{ ko:'수직선은 수에게 자리를 주는 줄이에요!', en:'A number line gives every number a place!', zh:'数轴给每个数一个位置！' },
        book:{ ko:'오른쪽으로 갈수록 <b>큰 수</b>예요. 그래서 −5는 −3보다 왼쪽이고 더 작아요 — 절댓값(0에서 떨어진 거리)은 −5가 더 큰데도요. 이 둘을 헷갈리지 않는 것이 이 단원의 고비예요.', en:'Further right means <b>bigger</b>. So -5 sits left of -3 and is the smaller number, even though -5 is further from zero. Keeping those two ideas apart is the hurdle in this topic.', zh:'越往右<b>越大</b>。所以−5在−3的左边，是更小的数——尽管−5离0更远。分清这两件事，正是本单元的难点。' } },

      { tag:{ ko:'② 칸을 더 잘게 — 유리수의 자리', en:'2) Finer marks - places for the rationals', zh:'② 把格子再细分——有理数的位置' },
        head:{ ko:'\\text{한 칸을 } 4 \\text{등분, 왼쪽 } 7 \\text{칸} \\quad\\Rightarrow\\quad -\\dfrac{7}{4}', en:'\\text{unit cut into } 4, \\; 7 \\text{ marks left} \\quad\\Rightarrow\\quad -\\dfrac{7}{4}', zh:'\\text{一格} 4 \\text{等分，向左} 7 \\text{格} \\quad\\Rightarrow\\quad -\\dfrac{7}{4}' },
        desc:{ ko:'정수 사이도 비어 있지 않아요. 한 칸을 4등분하면 작은 눈금 하나가 1/4이고, 0에서 왼쪽으로 7칸이면 <b>−7/4</b>예요. "몇 등분한 것 중 몇 칸"을 그대로 적으면 돼요.', en:'The gaps between integers are not empty. Cut a unit into quarters and each small mark is a quarter, so seven of them to the left is <b>-7/4</b>. Just write "how many of how many".', zh:'整数之间并不是空的。把一格四等分，每个小刻度就是1/4，向左7格就是<b>−7/4</b>。照"几等分中的几格"写下来就行。' },
        mathSteps:['1 \\div 4 = \\dfrac{1}{4}', '7 \\times \\dfrac{1}{4} = \\dfrac{7}{4}', {ko:'\\text{왼쪽이므로 } -\\dfrac{7}{4}',en:'\\text{on the left, so } -\\dfrac{7}{4}',zh:'\\text{在左边，所以 } -\\dfrac{7}{4}'}],
        result:{ ko:'정수 사이는 비어 있지 않아요 — 유리수가 채우고 있어요!', en:'The gaps are not empty - the rationals fill them!', zh:'整数之间不是空的——有理数填在那里！' },
        book:{ ko:'−7/4 는 −1과 −2 <b>사이</b>에 있어요. 대분수로 −1과 3/4 이라 쓰면 어디쯤인지 더 잘 보이죠. 어느 쪽이든 수직선 위의 <b>같은 한 점</b>이에요.', en:'The number -7/4 lies <b>between</b> -1 and -2. Writing it as one and three quarters, negative, makes its position easier to see. Either way it is <b>the same single point</b> on the line.', zh:'−7/4在−1和−2<b>之间</b>。写成带分数−1又3/4，位置更好看清。不论哪种写法，都是数轴上<b>同一个点</b>。' } },

      { tag:{ ko:'③ 절댓값 — 0에서의 거리라 둘이다', en:'3) Absolute value - a distance, so there are two', zh:'③ 绝对值——是距离，所以有两个' },
        head:{ ko:'|x| = 5 \\quad\\Rightarrow\\quad x = -5 \\;\\text{or}\\; 5', en:'|x| = 5 \\quad\\Rightarrow\\quad x = -5 \\;\\text{or}\\; 5', zh:'|x| = 5 \\quad\\Rightarrow\\quad x = -5 \\;\\text{or}\\; 5' },
        desc:{ ko:'절댓값은 그 수가 <b>0에서 얼마나 떨어져 있는가</b>예요. 거리니까 방향은 상관없고, 그래서 5칸 떨어진 자리는 오른쪽 5와 왼쪽 −5 <b>둘</b>이에요.', en:'An absolute value is <b>how far a number is from zero</b>. Distance has no direction, so two places are five steps away: 5 on the right and -5 on the left.', zh:'绝对值是这个数<b>离0有多远</b>。距离不分方向，所以离5格的位置有<b>两个</b>：右边的5和左边的−5。' },
        mathSteps:['|-5| = 5', '|5| = 5', 'x = -5 \\;\\text{or}\\; 5'],
        result:{ ko:'거리는 방향이 없어서 답이 둘이에요!', en:'A distance has no direction, so there are two answers!', zh:'距离没有方向，所以答案有两个！' },
        book:{ ko:'그래서 절댓값은 <b>절대 음수가 되지 않아요</b>. |0|=0 이고, 0 말고는 절댓값이 0인 수가 없어요. 두 수의 절댓값이 같다면 두 수는 같거나 부호만 반대예요.', en:'That is why an absolute value is <b>never negative</b>. Zero is the only number whose absolute value is zero, and if two numbers share an absolute value they are either equal or opposite in sign.', zh:'所以绝对值<b>永远不会是负数</b>。|0|=0，除0以外没有绝对值为0的数。两数绝对值相同，它们要么相等，要么只是符号相反。' } }
    ],
    rule:{ ko:'0에서 몇 칸인지 세면 자리가 나와요 — 오른쪽은 양수, 왼쪽은 음수, 그리고 절댓값이 같은 수는 언제나 둘!', en:'Count the steps from zero and you have the place - right is positive, left is negative, and a shared absolute value always means two numbers!', zh:'数出离0几格就知道位置——右正左负，而绝对值相同的数总是有两个！' }
  },

  check:{
    fills:[
      { tex:{ ko:'\\text{0에서 왼쪽 } 4 \\text{칸} \\quad\\Rightarrow\\quad \\square', en:'\\text{4 steps left of } 0 \\quad\\Rightarrow\\quad \\square', zh:'\\text{0向左} 4 \\text{格} \\quad\\Rightarrow\\quad \\square' }, answer:-4,
        hint:{ ko:'왼쪽이면 음수', en:'Left means negative', zh:'向左就是负数' } },
      { tex:{ko:'|x| = 6 \\quad\\Rightarrow\\quad \\text{작은 수} = \\square',en:'|x| = 6 \\quad\\Rightarrow\\quad \\text{smaller} = \\square',zh:'|x| = 6 \\quad\\Rightarrow\\quad \\text{较小的数} = \\square'}, answer:-6,
        hint:{ ko:'왼쪽 자리', en:'The place on the left', zh:'左边的位置' } }
    ],
    open:{ ko:'−5와 −3 중 어느 쪽이 큰지, 절댓값은 어느 쪽이 큰지 말해봐요.', en:'Say which of -5 and -3 is bigger, and which has the bigger absolute value.', zh:'说说−5和−3哪个更大，哪个的绝对值更大。' },
    openHint:{ ko:'수는 −3이 크고(오른쪽), 절댓값은 −5가 크다(0에서 멀다)', en:'-3 is the bigger number (further right); -5 has the bigger absolute value (further from zero)', zh:'数是−3更大(更靠右)，绝对值是−5更大(离0更远)' }
  },

  lab:{
    generator:'md82_numberLine', level:'main', count:4,
    params:{mode:'rational'},
    intro:{ ko:'한 칸을 등분한 작은 눈금을 0에서부터 세어 분수로 적어 보세요!', en:'Count the small marks from zero and write it as a fraction!', zh:'从0开始数细分的小刻度，写成分数！' }
  },

  arena:{
    generator:'md82_numberLine', level:'main', count:8, timeLimit:360,
    params:{mode:'absolute'},
    rule:{ ko:'6분 안에 절댓값이 같은 두 자리를 찾아 왼쪽 수를 답해요!', en:'Within 6 minutes, find the two places with the same absolute value and give the left one!', zh:'6分钟内找出绝对值相同的两个位置，答出左边那个！' }
  },

  stamp:{ label:{ ko:'자리의 첫 측량사', en:'First Surveyor of Places', zh:'位置的首位测量师' }, coins:46 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, { ko:'0에서 정확히 세었구나! 📏', en:'You counted from zero exactly right!', zh:'你从0数得分毫不差！' }, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ { ko:'0에서부터 세어야 해 — 끝에서가 아니야!', en:'Count from zero, not from the end!', zh:'要从0开始数，不是从端点！' }, { ko:'왼쪽이면 음수를 붙여!', en:'If it is on the left, it needs a minus!', zh:'在左边就要加负号！' } ],
    finish:{ ko:'완벽해! 자리의 첫 측량사! 📏✨', en:'Perfect! First Surveyor of Places!', zh:'完美！位置的首位测量师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
