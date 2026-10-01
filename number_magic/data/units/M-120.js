/* Numbers of Magic — 유닛 M-120: 평행이동 (고등 공통수학2 · 과정 52 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD120. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-120'] = {
  id:'M-120', tier:'highmath2', level:'52', order:120,
  generator:'md120_translate',
  title:{ ko:'평행이동', en:'Translations', zh:'平移' },
  subtitle:{ ko:'점은 더하고, 도형의 방정식에는 빼서 넣습니다', en:'Add to a point; substitute x−a, y−b into a figure', zh:'点加上平移量，图形方程用x−a、y−b代入' },
  icon:'➡️',

  practice:{
    generator:'md120_translate', level:'practice', count:6,
    params:{mode:'point'},
    intro:{
      ko:'(x, y)→(x+a, y+b) 는 x 좌표에 a, y 좌표에 b 를 더합니다. 답은 두 칸에 씁니다.',
      en:'(x, y)→(x+a, y+b) adds a to x and b to y. Enter two boxes.',
      zh:'(x, y)→(x+a, y+b)把x坐标加a，y坐标加b。答案填两格。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'책상 위의 스티커를 돌리거나 뒤집지 않고 오른쪽으로 3 칸, 위로 4 칸 밀면 모양과 크기는 그대로이고 자리만 바뀝니다. 이것이 평행이동입니다.',
        en:'Slide a sticker 3 squares right and 4 up without turning or flipping it: its shape and size stay the same, only its place changes. That is a translation.',
        zh:'把桌上的贴纸不转动、不翻转地向右推3格、向上推4格，形状和大小不变，只有位置改变。这就是平移。' }
    },
    stages:[
      { tag:{ko:'① 점의 평행이동',en:'1) Moving a point',zh:'① 点的平移'},
        head:{ko:'(2,\\ -1)\\ \\to\\ (2+3,\\ -1+4)=(5,\\ 3)',en:'(2,\\ -1)\\ \\to\\ (2+3,\\ -1+4)=(5,\\ 3)',zh:'(2,\\ -1)\\ \\to\\ (2+3,\\ -1+4)=(5,\\ 3)'},
        desc:{ko:'점 (2, −1) 을 (x, y)→(x+3, y+4) 로 옮기면 <b>(5, 3)</b> 입니다.',
              en:'Moving (2, −1) by (x, y)→(x+3, y+4) gives <b>(5, 3)</b>.',
              zh:'把点(2, −1)按(x, y)→(x+3, y+4)平移得<b>(5, 3)</b>。'},
        mathSteps:['2+3=5,\\quad -1+4=3'],
        result:{ko:'점은 그대로 더하기!',en:'Points: just add!',zh:'点：直接相加！'},
        book:{ko:'P 가 P′ 으로 옮겨졌다면 옮긴 양은 P′−P 입니다. 같은 평행이동은 모든 점을 같은 만큼 옮깁니다.',
              en:'If P moves to P′, the shift is P′−P. The same translation moves every point by the same amount.',
              zh:'P移到P′时，平移量是P′−P。同一平移把每个点移动同样的量。'} },

      { tag:{ko:'② 직선의 평행이동',en:'2) Moving a line',zh:'② 直线的平移'},
        head:{ko:'y+2=2(x-3)+1\\ \\Rightarrow\\ y=2x-7',en:'y+2=2(x-3)+1\\ \\Rightarrow\\ y=2x-7',zh:'y+2=2(x-3)+1\\ \\Rightarrow\\ y=2x-7'},
        desc:{ko:'직선 y=2x+1 을 (x, y)→(x+3, y−2) 로 옮기면 x 대신 x−3, y 대신 y+2 를 넣어 <b>y=2x−7</b> 입니다.',
              en:'Moving y=2x+1 by (x, y)→(x+3, y−2): replace x with x−3 and y with y+2 to get <b>y=2x−7</b>.',
              zh:'把直线y=2x+1按(x, y)→(x+3, y−2)平移，用x−3代x、y+2代y，得<b>y=2x−7</b>。'},
        mathSteps:['2x-6+1-2=2x-7'],
        result:{ko:'도형은 반대 부호로 넣기!',en:'Figures: substitute the opposite sign!',zh:'图形：代入相反符号！'},
        book:{ko:'평행이동한 직선은 기울기가 그대로입니다. 바뀌는 것은 절편뿐입니다.',
              en:'A translated line keeps its slope; only the intercept changes.',
              zh:'平移后的直线斜率不变，只有截距改变。'} },

      { tag:{ko:'③ 원의 평행이동',en:'3) Moving a circle',zh:'③ 圆的平移'},
        head:{ko:'(1,\\ -2)\\ \\to\\ (3,\\ 1)',en:'(1,\\ -2)\\ \\to\\ (3,\\ 1)',zh:'(1,\\ -2)\\ \\to\\ (3,\\ 1)'},
        desc:{ko:'원 (x−1)²+(y+2)²=9 를 (x, y)→(x+2, y+3) 으로 옮기면 반지름은 3 그대로이고 중심만 <b>(3, 1)</b> 로 옮겨집니다.',
              en:'Moving (x−1)²+(y+2)²=9 by (x, y)→(x+2, y+3) keeps the radius 3 and moves the center to <b>(3, 1)</b>.',
              zh:'把圆(x−1)²+(y+2)²=9按(x, y)→(x+2, y+3)平移，半径3不变，圆心移到<b>(3, 1)</b>。'},
        mathSteps:['1+2=3,\\quad -2+3=1'],
        result:{ko:'원은 중심만 옮기면 됩니다!',en:'A circle: just move the center!',zh:'圆：只需移动圆心！'},
        book:{ko:'일반형이면 먼저 완전제곱식으로 바꾸어 중심을 찾습니다.',
              en:'For a general-form equation, complete the squares first to find the center.',
              zh:'一般式先配方求出圆心。'} }
    ],
    rule:{ ko:'① 점: (x, y)→(x+a, y+b)  ② 도형의 방정식: x 대신 x−a, y 대신 y−b  ③ 원은 중심만 옮기고 반지름은 그대로',
      en:'① Point: (x, y)→(x+a, y+b)  ② Figure: replace x with x−a, y with y−b  ③ Circle: move the center, keep the radius',
      zh:'① 点：(x, y)→(x+a, y+b)  ② 图形方程：用x−a代x、y−b代y  ③ 圆：只移圆心，半径不变' }
  },

  check:{
    fills:[
      { tex:{ko:'(x,\\ y)\\to(x+5,\\ y-2):\\ (-1,\\ 4)\\to(\\square,\\ 2)',en:'(x,\\ y)\\to(x+5,\\ y-2):\\ (-1,\\ 4)\\to(\\square,\\ 2)',zh:'(x,\\ y)\\to(x+5,\\ y-2):\\ (-1,\\ 4)\\to(\\square,\\ 2)'}, answer:4,
        hint:{ ko:'−1+5', en:'−1+5', zh:'−1+5' } },
      { tex:{ko:'(x,\\ y)\\to(x-1,\\ y+2):\\ \\text{중심 }(2,\\ 3)\\to(1,\\ \\square)',en:'(x,\\ y)\\to(x-1,\\ y+2):\\ \\text{center }(2,\\ 3)\\to(1,\\ \\square)',zh:'(x,\\ y)\\to(x-1,\\ y+2):\\ \\text{圆心}(2,\\ 3)\\to(1,\\ \\square)'}, answer:5,
        hint:{ ko:'3+2', en:'3+2', zh:'3+2' } }
    ],
    open:{ ko:'점을 옮길 때는 a 를 더하는데 도형의 방정식에서는 x 대신 x−a 를 넣는 까닭을 설명해 봅니다.',
      en:'Explain why a point gets +a but a figure’s equation gets x−a in place of x.',
      zh:'说说为什么移动点时加a，而图形方程中却用x−a代x。' },
    openHint:{ ko:'옮긴 도형 위의 점 (x, y) 를 되돌린 점 (x−a, y−b) 가 원래 도형 위에 있어야 하기 때문입니다.',
      en:'A point (x, y) on the moved figure must come from (x−a, y−b) on the original figure.',
      zh:'平移后图形上的点(x, y)反推回去的点(x−a, y−b)必须在原图形上。' }
  },

  lab:{
    generator:'md120_translate', level:'main', count:6,
    params:{mode:'line'},
    intro:{
      ko:'직선의 식에 x 대신 x−a, y 대신 y−b 를 넣고 정리합니다. 기울기는 그대로입니다.',
      en:'Substitute x−a for x and y−b for y and simplify. The slope stays the same.',
      zh:'在直线方程中用x−a代x、y−b代y再整理，斜率不变。'
    }
  },

  arena:{
    generator:'md120_translate', level:'main', count:6, timeLimit:420,
    params:{mode:'circle'},
    rule:{ ko:'7분 안에 옮긴 원의 중심과 평행이동의 양을 모두 찾습니다!', en:'Find every moved center and every shift within 7 minutes!', zh:'7分钟内求出所有平移后的圆心和平移量！' }
  },

  stamp:{ label:{ ko:'미끄럼 조종사', en:'Slide Pilot', zh:'平移驾驶员' }, coins:48 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'딱 그만큼 옮겼어! ➡️',en:'Moved exactly that far!',zh:'正好移动了那么多！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'도형은 x 대신 x−a 를 넣어!',en:'For a figure, put x−a in place of x!',zh:'图形用x−a代x！'}, {ko:'원은 중심만 옮기면 돼!',en:'For a circle, move only the center!',zh:'圆只需移动圆心！'} ],
    finish:{ ko:'완벽해! 미끄럼 조종사! ➡️✨', en:'Perfect! Slide Pilot!', zh:'完美！平移驾驶员！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
