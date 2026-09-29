/* Numbers of Magic — 유닛 M-121: 대칭이동 (고등 공통수학2 · 과정 52 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD121. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-121'] = {
  id:'M-121', tier:'highmath2', level:'52', order:121,
  generator:'md121_reflect',
  title:{ ko:'대칭이동', en:'Reflections', zh:'对称变换' },
  subtitle:{ ko:'x축·y축·원점·직선 y=x 에 대하여 뒤집기', en:'Flip in the x-axis, y-axis, origin or the line y=x', zh:'关于x轴、y轴、原点、直线y=x翻折' },
  icon:'🪞',

  practice:{
    generator:'md121_reflect', level:'practice', count:6,
    params:{mode:'point'},
    intro:{
      ko:'화살표 위의 기호가 대칭의 기준입니다(y=0 은 x축, x=0 은 y축, O 는 원점). 답은 두 칸에 씁니다.',
      en:'The label on the arrow is the mirror (y=0 is the x-axis, x=0 the y-axis, O the origin). Enter two boxes.',
      zh:'箭头上的记号是对称的基准(y=0是x轴，x=0是y轴，O是原点)。答案填两格。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'거울 앞에 서면 거울까지의 거리만큼 거울 뒤에 내 모습이 보입니다. 좌표평면의 거울은 x축, y축, 원점, 직선 y=x 이고, 좌표의 부호나 순서가 바뀝니다.',
        en:'In a mirror your image appears as far behind it as you stand in front. On the coordinate plane the mirrors are the x-axis, the y-axis, the origin and the line y=x, and they change signs or swap coordinates.',
        zh:'站在镜子前，镜子后面同样远的地方出现你的像。坐标平面上的镜子是x轴、y轴、原点和直线y=x，它们改变坐标的符号或交换坐标。' }
    },
    stages:[
      { tag:{ko:'① 점의 대칭이동',en:'1) Reflecting a point',zh:'① 点的对称变换'},
        head:{ko:'(3,\\ -5)\\to(3,\\ 5),\\ (-3,\\ -5),\\ (-3,\\ 5),\\ (-5,\\ 3)',en:'(3,\\ -5)\\to(3,\\ 5),\\ (-3,\\ -5),\\ (-3,\\ 5),\\ (-5,\\ 3)',zh:'(3,\\ -5)\\to(3,\\ 5),\\ (-3,\\ -5),\\ (-3,\\ 5),\\ (-5,\\ 3)'},
        desc:{ko:'점 (3, −5) 를 x축, y축, 원점, 직선 y=x 에 대하여 대칭이동하면 차례로 <b>(3, 5)</b>, <b>(−3, −5)</b>, <b>(−3, 5)</b>, <b>(−5, 3)</b> 입니다.',
              en:'Reflecting (3, −5) in the x-axis, the y-axis, the origin and y=x gives <b>(3, 5)</b>, <b>(−3, −5)</b>, <b>(−3, 5)</b> and <b>(−5, 3)</b>.',
              zh:'点(3, −5)关于x轴、y轴、原点、直线y=x对称，依次得<b>(3, 5)</b>、<b>(−3, −5)</b>、<b>(−3, 5)</b>、<b>(−5, 3)</b>。'},
        mathSteps:['y=x:\\ (a,\\ b)\\to(b,\\ a)'],
        result:{ko:'부호 바꾸기, 자리 바꾸기!',en:'Flip a sign, or swap!',zh:'变号或交换！'},
        book:{ko:'두 번 대칭이동하면 첫 번째로 옮긴 점을 다시 옮깁니다. 직선 y=−x 대칭은 (x, y)→(−y, −x) 입니다.',
              en:'For two reflections, reflect the first image again. Reflection in y=−x is (x, y)→(−y, −x).',
              zh:'两次对称变换就把第一次得到的点再变换。关于直线y=−x对称是(x, y)→(−y, −x)。'} },

      { tag:{ko:'② 직선의 대칭이동',en:'2) Reflecting a line',zh:'② 直线的对称变换'},
        head:{ko:'y=2x+3\\ \\to\\ -y=2x+3\\ \\Rightarrow\\ y=-2x-3',en:'y=2x+3\\ \\to\\ -y=2x+3\\ \\Rightarrow\\ y=-2x-3',zh:'y=2x+3\\ \\to\\ -y=2x+3\\ \\Rightarrow\\ y=-2x-3'},
        desc:{ko:'직선 y=2x+3 을 x축에 대하여 대칭이동하면 y 대신 −y 를 넣어 <b>y=−2x−3</b> 입니다.',
              en:'Reflecting y=2x+3 in the x-axis: put −y for y to get <b>y=−2x−3</b>.',
              zh:'直线y=2x+3关于x轴对称，用−y代y得<b>y=−2x−3</b>。'},
        mathSteps:['-y=2x+3'],
        result:{ko:'식에 대칭점의 좌표를 넣기!',en:'Substitute the reflected coordinates!',zh:'把对称点的坐标代入方程！'},
        book:{ko:'직선 y=x 에 대하여 대칭이동하면 x 와 y 를 서로 바꿉니다. 3x−2y+1=0 은 3y−2x+1=0, 곧 2x−3y−1=0 이 됩니다.',
              en:'For y=x, swap x and y: 3x−2y+1=0 becomes 3y−2x+1=0, i.e. 2x−3y−1=0.',
              zh:'关于直线y=x对称就交换x与y：3x−2y+1=0变为3y−2x+1=0，即2x−3y−1=0。'} },

      { tag:{ko:'③ 원의 대칭이동',en:'3) Reflecting a circle',zh:'③ 圆的对称变换'},
        head:{ko:'(2,\\ -3)\\ \\xrightarrow{\\ y=x\\ }\\ (-3,\\ 2)',en:'(2,\\ -3)\\ \\xrightarrow{\\ y=x\\ }\\ (-3,\\ 2)',zh:'(2,\\ -3)\\ \\xrightarrow{\\ y=x\\ }\\ (-3,\\ 2)'},
        desc:{ko:'원 (x−2)²+(y+3)²=4 를 직선 y=x 에 대하여 대칭이동하면 중심이 <b>(−3, 2)</b> 로 옮겨지고 반지름 2 는 그대로입니다.',
              en:'Reflecting (x−2)²+(y+3)²=4 in y=x moves the center to <b>(−3, 2)</b>; the radius 2 stays.',
              zh:'圆(x−2)²+(y+3)²=4关于直线y=x对称，圆心移到<b>(−3, 2)</b>，半径2不变。'},
        mathSteps:['(x+3)^2+(y-2)^2=4'],
        result:{ko:'원은 중심만 뒤집기!',en:'A circle: flip only the center!',zh:'圆：只翻折圆心！'},
        book:{ko:'일반형이면 중심을 찾아 대칭이동한 뒤 다시 전개합니다. 상수항은 바뀌지 않습니다.',
              en:'For general form, reflect the center and expand again; the constant term does not change.',
              zh:'一般式先求圆心对称变换后再展开，常数项不变。'} }
    ],
    rule:{ ko:'① x축: (x, −y) · y축: (−x, y) · 원점: (−x, −y) · y=x: (y, x)  ② 도형은 방정식의 x, y 를 같게 바꿉니다  ③ 원은 중심만 대칭이동',
      en:'① x-axis: (x, −y) · y-axis: (−x, y) · origin: (−x, −y) · y=x: (y, x)  ② Figures: change x, y in the equation the same way  ③ Circles: reflect only the center',
      zh:'① x轴：(x, −y)·y轴：(−x, y)·原点：(−x, −y)·y=x：(y, x)  ② 图形：方程中的x、y同样替换  ③ 圆：只变换圆心' }
  },

  check:{
    fills:[
      { tex:{ko:'(4,\\ -7)\\ \\xrightarrow{\\ O\\ }\\ (-4,\\ \\square)',en:'(4,\\ -7)\\ \\xrightarrow{\\ O\\ }\\ (-4,\\ \\square)',zh:'(4,\\ -7)\\ \\xrightarrow{\\ O\\ }\\ (-4,\\ \\square)'}, answer:7,
        hint:{ ko:'원점 대칭은 둘 다 부호를 바꿉니다', en:'The origin flips both signs', zh:'关于原点对称两个都变号' } },
      { tex:{ko:'(2,\\ 5)\\ \\xrightarrow{\\ y=x\\ }\\ (\\square,\\ 2)',en:'(2,\\ 5)\\ \\xrightarrow{\\ y=x\\ }\\ (\\square,\\ 2)',zh:'(2,\\ 5)\\ \\xrightarrow{\\ y=x\\ }\\ (\\square,\\ 2)'}, answer:5,
        hint:{ ko:'x, y 를 바꿉니다', en:'Swap x and y', zh:'交换x、y' } }
    ],
    open:{ ko:'점을 x축에 대하여 대칭이동한 뒤 y축에 대하여 대칭이동한 결과가 원점 대칭과 같은 까닭을 설명해 봅니다.',
      en:'Explain why reflecting in the x-axis and then in the y-axis is the same as reflecting in the origin.',
      zh:'说说先关于x轴对称、再关于y轴对称的结果为什么与关于原点对称相同。' },
    openHint:{ ko:'(x, y)→(x, −y)→(−x, −y) 로 두 좌표의 부호가 모두 바뀝니다.',
      en:'(x, y)→(x, −y)→(−x, −y): both signs change.',
      zh:'(x, y)→(x, −y)→(−x, −y)，两个坐标都变号。' }
  },

  lab:{
    generator:'md121_reflect', level:'main', count:6,
    params:{mode:'line'},
    intro:{
      ko:'직선의 식에서 x, y 를 대칭점의 좌표로 바꾸어 넣고, 보기로 준 꼴에 맞게 정리합니다.',
      en:'Substitute the reflected coordinates for x and y, then rearrange into the form shown.',
      zh:'把直线方程中的x、y换成对称点的坐标，再整理成给定的形式。'
    }
  },

  arena:{
    generator:'md121_reflect', level:'main', count:6, timeLimit:420,
    params:{mode:'circle'},
    rule:{ ko:'7분 안에 대칭이동한 원을 모두 찾습니다!', en:'Find every reflected circle within 7 minutes!', zh:'7分钟内求出所有对称变换后的圆！' }
  },

  stamp:{ label:{ ko:'거울 마법사', en:'Mirror Wizard', zh:'镜子魔法师' }, coins:49 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'거울처럼 딱 맞아! 🪞',en:'A perfect mirror image!',zh:'像镜子一样完美！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'y=0 은 x축이야, y 부호를 바꿔!',en:'y=0 is the x-axis: flip the sign of y!',zh:'y=0是x轴，改变y的符号！'}, {ko:'y=x 면 자리를 바꿔!',en:'For y=x, swap the coordinates!',zh:'y=x就交换坐标！'} ],
    finish:{ ko:'완벽해! 거울 마법사! 🪞✨', en:'Perfect! Mirror Wizard!', zh:'完美！镜子魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
