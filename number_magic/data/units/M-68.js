/* Numbers of Magic — 유닛 M-68: 좌표와 사분면 (중등 교과 연산 4차 2026-09-21)
   표기 주의: 이 파일의 tex 는 KaTeX 간격 명령으로 `\quad` 만 쓴다(mid9.js 상단 주석 참조). */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-68'] = {
  id:'M-68', tier:'middle1', level:'31', order:17,
  generator:'md68_coordinate',
  title:{ ko:'좌표와 사분면', en:'Coordinates & Quadrants', zh:'坐标与象限' },
  subtitle:{ ko:'두 수로 평면 위의 한 자리를 꼭 집어요', en:'Two numbers pin down one spot on the plane', zh:'用两个数就能确定平面上的一个位置' },
  icon:'📍',

  practice:{
    generator:'md68_coordinate', level:'practice', count:5,
    params:{mode:'readPoint'},
    intro:{ ko:'점에서 아래로 내려 가로 좌표를, 옆으로 옮겨 세로 좌표를 읽어 보세요!', en:'Drop down from the point for the first number, and go across for the second!', zh:'从点往下读出横坐标，往旁读出纵坐标！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'영화관 표에 적힌 "F열 12번"을 생각해 보세요. 글자 하나와 숫자 하나면 그 넓은 객석에서 자리 하나가 딱 정해져요. 좌표도 똑같아요 — 가로로 얼마, 세로로 얼마, 이 두 수만 있으면 평면 위 어디든 가리킬 수 있어요.', en:'Think of a cinema ticket that says "row F, seat 12". One letter and one number pick out a single seat in the whole hall. Coordinates work the same way: how far across and how far up, and those two numbers point anywhere on the plane.', zh:'想想电影票上写的"F排12号"。一个字母加一个数字，就在整个放映厅里定下了一个座位。坐标也一样——横着多少、竖着多少，有这两个数就能指向平面上任何地方。' },
      history:{ ko:'이 방법을 만든 사람은 데카르트예요. 천장에 앉은 파리의 자리를 두 벽에서 잰 거리로 적을 수 있다는 걸 깨달았다는 이야기가 전해져요. 덕분에 "도형"과 "식"이 처음으로 한 언어가 됐어요 — 원도, 직선도 식으로 쓸 수 있게 됐거든요.', en:'The idea is credited to Descartes. The story goes that he realised a fly resting on the ceiling could be located by its distances from two walls. It let shapes and equations become one language for the first time - suddenly a circle or a line could be written as a formula.', zh:'这个方法出自笛卡儿。传说他意识到停在天花板上的苍蝇，可以用它到两面墙的距离来确定位置。从此"图形"和"式子"第一次成了同一种语言——圆和直线都能写成式子了。' }
    },
    stages:[
      { tag:{ ko:'① 가로 먼저, 세로 나중', en:'1) Across first, then up', zh:'① 先横后纵' },
        head:{ ko:'(3,\\, 2) \\quad\\Rightarrow\\quad \\text{x} = 3, \\; \\text{y} = 2', en:'(3,\\, 2) \\quad\\Rightarrow\\quad \\text{x} = 3, \\; \\text{y} = 2', zh:'(3,\\, 2) \\quad\\Rightarrow\\quad \\text{x} = 3, \\; \\text{y} = 2' },
        desc:{ ko:'좌표는 <b>순서가 있는 짝</b>이에요. (3, 2)와 (2, 3)은 다른 점이에요 — 앞의 수가 가로, 뒤의 수가 세로라는 약속을 모두가 지키기 때문에 통해요.', en:'Coordinates are an <b>ordered</b> pair: (3, 2) and (2, 3) are different points. It works because everyone keeps the same agreement - across first, up second.', zh:'坐标是<b>有顺序的</b>一对：(3, 2)和(2, 3)是不同的点。之所以能通用，是因为大家都遵守同一个约定——先横后纵。' },
        mathSteps:['x = 3', 'y = 2', '(3,\\, 2)'],
        result:{ ko:'앞이 가로, 뒤가 세로 — 순서가 뜻을 정해요!', en:'Across then up - the order carries the meaning!', zh:'先横后纵——顺序决定含义！' },
        book:{ ko:'원점 O는 (0, 0)이에요. x축 위의 점은 세로가 0이라 (a, 0), y축 위의 점은 (0, b) 꼴이에요 — 축 위의 점은 어느 사분면에도 들어가지 않아요.', en:'The origin O is (0, 0). A point on the x-axis has zero height, so it is (a, 0), and one on the y-axis is (0, b). Points on the axes belong to no quadrant at all.', zh:'原点O是(0, 0)。x轴上的点纵坐标为0，写成(a, 0)；y轴上的点是(0, b)。轴上的点不属于任何象限。' } },

      { tag:{ ko:'② 부호 두 개가 사분면을 정한다', en:'2) Two signs decide the quadrant', zh:'② 两个符号决定象限' },
        head:{ ko:'(-4,\\, 5) \\quad\\Rightarrow\\quad \\text{제} 2 \\text{사분면}', en:'(-4,\\, 5) \\quad\\Rightarrow\\quad \\text{quadrant } 2', zh:'(-4,\\, 5) \\quad\\Rightarrow\\quad \\text{第} 2 \\text{象限}' },
        desc:{ ko:'x가 음수면 <b>왼쪽</b>, y가 양수면 <b>위쪽</b>이니 왼위 — 제2사분면이에요. 오른위부터 시계 반대 방향으로 1, 2, 3, 4예요.', en:'A negative x means <b>left</b> and a positive y means <b>up</b>, so this is the upper left - quadrant 2. Numbering runs counter-clockwise from the top right: 1, 2, 3, 4.', zh:'x为负在<b>左</b>，y为正在<b>上</b>，所以是左上——第2象限。从右上开始逆时针依次是1、2、3、4。' },
        mathSteps:['x = -4 < 0', 'y = 5 > 0', {ko:'\\text{제} 2 \\text{사분면}',en:'\\text{quadrant } 2',zh:'\\text{第} 2 \\text{象限}'}],
        result:{ ko:'부호만 봐도 어느 구역인지 알 수 있어요!', en:'The signs alone tell you which region it is in!', zh:'只看符号就知道在哪个区域！' },
        book:{ ko:'x축에 비추면 y의 부호만 바뀌고, y축에 비추면 x의 부호만, 원점에 대해 비추면 둘 다 바뀌어요. 제2사분면의 점을 원점에 비추면 제4사분면으로 가요.', en:'Reflecting in the x-axis flips only y, in the y-axis only x, and through the origin flips both. A point in quadrant 2 lands in quadrant 4 after a reflection through the origin.', zh:'关于x轴对称只变y的符号，关于y轴对称只变x的符号，关于原点对称两个都变。第2象限的点关于原点对称后落在第4象限。' } }
    ],
    rule:{ ko:'가로 먼저 세로 나중, 부호 둘이 사분면을 정해요 — 이 약속 하나로 평면 위 어디든 가리킬 수 있어요!', en:'Across first and up second, and the two signs give the quadrant - one agreement lets you point anywhere on the plane!', zh:'先横后纵，两个符号决定象限——有了这一个约定，就能指向平面上的任何地方！' }
  },

  check:{
    fills:[
      { tex:{ ko:'(5,\\, -2) \\quad\\Rightarrow\\quad \\text{제} \\square \\text{사분면}', en:'(5,\\, -2) \\quad\\Rightarrow\\quad \\text{quadrant } \\square', zh:'(5,\\, -2) \\quad\\Rightarrow\\quad \\text{第} \\square \\text{象限}' }, answer:4,
        hint:{ ko:'오른쪽 아래예요', en:'Right and down', zh:'在右下方' } },
      { tex:{ ko:'(3,\\, 4) \\text{의 x축 대칭} \\quad\\Rightarrow\\quad \\left(3,\\, \\square\\right)', en:'(3,\\, 4) \\text{ reflected in the x-axis} \\quad\\Rightarrow\\quad \\left(3,\\, \\square\\right)', zh:'(3,\\, 4) \\text{关于x轴对称} \\quad\\Rightarrow\\quad \\left(3,\\, \\square\\right)' }, answer:-4,
        hint:{ ko:'y의 부호만 바뀌어요', en:'Only y changes sign', zh:'只有y变号' } }
    ],
    open:{ ko:'(−2, −5)가 제몇사분면인지, 그 까닭을 말해봐요.', en:'Say which quadrant (-2, -5) is in and why.', zh:'说说(−2, −5)在第几象限，为什么。' },
    openHint:{ ko:'둘 다 음수 → 왼쪽 아래 → 제3사분면', en:'Both negative, so lower left: quadrant 3', zh:'两个都是负数→左下→第3象限' }
  },

  lab:{
    generator:'md68_coordinate', level:'main', count:4,
    params:{mode:'quadrant'},
    intro:{ ko:'x의 부호로 좌우를, y의 부호로 위아래를 정해 보세요!', en:'Use the sign of x for left or right, and the sign of y for up or down!', zh:'用x的符号定左右，用y的符号定上下！' }
  },

  arena:{
    generator:'md68_coordinate', level:'main', count:8, timeLimit:360,
    params:{mode:'symmetry'},
    rule:{ ko:'6분 안에 x축·y축·원점 대칭점을 정확히 구해요!', en:'Within 6 minutes, reflect points in the x-axis, the y-axis and the origin!', zh:'6分钟内准确求出关于x轴、y轴、原点的对称点！' }
  },

  stamp:{ label:{ ko:'자리의 지도사', en:'Mapper of Places', zh:'位置绘图师' }, coins:48 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, { ko:'두 수로 자리를 꼭 집었구나! 📍', en:'You pinned the spot down with two numbers!', zh:'你用两个数准确定位了！' }, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ { ko:'앞이 가로, 뒤가 세로야!', en:'Across comes first, up comes second!', zh:'前面是横，后面是纵！' }, { ko:'부호를 다시 봐 — 음수면 왼쪽이나 아래야!', en:'Check the signs - negative means left or down!', zh:'再看看符号——负数表示左边或下面！' } ],
    finish:{ ko:'완벽해! 자리의 지도사! 📍✨', en:'Perfect! Mapper of Places!', zh:'完美！位置绘图师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
