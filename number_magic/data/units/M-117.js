/* Numbers of Magic — 유닛 M-117: 좌표축에 접하는 원 (고등 공통수학2 · 과정 51 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD117. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-117'] = {
  id:'M-117', tier:'highmath2', level:'51', order:117,
  generator:'md117_circleAxis',
  title:{ ko:'좌표축에 접하는 원', en:'Circles Tangent to the Axes', zh:'与坐标轴相切的圆' },
  subtitle:{ ko:'x축에 접하면 r=|b|, y축에 접하면 r=|a|', en:'Touching the x-axis: r=|b|; the y-axis: r=|a|', zh:'与x轴相切r=|b|，与y轴相切r=|a|' },
  icon:'⭕',

  practice:{
    generator:'md117_circleAxis', level:'practice', count:6,
    params:{mode:'xAxis'},
    intro:{
      ko:'x축에 접하는 원은 중심에서 x축까지의 거리, 곧 중심의 y 좌표의 절댓값이 반지름입니다.',
      en:'For a circle touching the x-axis, the radius is the distance from the center to the x-axis: the absolute value of the center’s y-coordinate.',
      zh:'与x轴相切的圆，半径就是圆心到x轴的距离，即圆心y坐标的绝对值。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'바닥에 놓인 공은 바닥에 딱 한 점에서 닿습니다. 공의 중심 높이가 곧 반지름입니다. 좌표평면에서 x축이 바닥이면, 중심의 y 좌표가 반지름을 알려 줍니다.',
        en:'A ball resting on the floor touches it at exactly one point, and the height of its center is the radius. If the x-axis is the floor, the center’s y-coordinate tells you the radius.',
        zh:'放在地面上的球只在一点接触地面，球心的高度就是半径。若x轴是地面，圆心的y坐标就告诉你半径。' }
    },
    stages:[
      { tag:{ko:'① x축에 접하는 원',en:'1) Touching the x-axis',zh:'① 与x轴相切的圆'},
        head:{ko:'(x-3)^2+(y+2)^2=2^2',en:'(x-3)^2+(y+2)^2=2^2',zh:'(x-3)^2+(y+2)^2=2^2'},
        desc:{ko:'중심이 (3, −2) 이고 x축에 접하면 반지름은 |−2|=<b>2</b> 입니다.',
              en:'Center (3, −2) touching the x-axis has radius |−2|=<b>2</b>.',
              zh:'圆心为(3, −2)且与x轴相切时，半径为|−2|=<b>2</b>。'},
        mathSteps:['r=|-2|=2'],
        result:{ko:'x축 → y 좌표!',en:'x-axis → y-coordinate!',zh:'x轴→y坐标！'},
        book:{ko:'y축에 접하면 거꾸로 중심의 x 좌표의 절댓값이 반지름입니다.',
              en:'For the y-axis it is the other way round: the absolute value of the x-coordinate.',
              zh:'与y轴相切时反过来，半径是圆心x坐标的绝对值。'} },

      { tag:{ko:'② 두 축에 모두 접하는 원',en:'2) Touching both axes',zh:'② 与两轴都相切'},
        head:{ko:'(2-r)^2+(1-r)^2=r^2\\ \\Rightarrow\\ r=1,\\ 5',en:'(2-r)^2+(1-r)^2=r^2\\ \\Rightarrow\\ r=1,\\ 5',zh:'(2-r)^2+(1-r)^2=r^2\\ \\Rightarrow\\ r=1,\\ 5'},
        desc:{ko:'점 (2, 1) 을 지나고 두 축에 접하는 원의 중심은 (r, r) 입니다. r²−6r+5=0 이므로 원은 반지름 <b>1</b>, <b>5</b> 인 두 개입니다.',
              en:'A circle through (2, 1) touching both axes has center (r, r). Then r²−6r+5=0, so there are two circles, of radius <b>1</b> and <b>5</b>.',
              zh:'经过点(2, 1)且与两轴都相切的圆，圆心为(r, r)。r²−6r+5=0，所以有半径为<b>1</b>和<b>5</b>的两个圆。'},
        mathSteps:['r^2-6r+5=(r-1)(r-5)=0'],
        result:{ko:'중심은 (r, r)!',en:'Center (r, r)!',zh:'圆心(r, r)！'},
        book:{ko:'점이 있는 사분면에 따라 중심은 (±r, ±r) 로 부호만 바뀝니다.',
              en:'Depending on the quadrant, the center is (±r, ±r) — only the signs change.',
              zh:'随点所在象限不同，圆心为(±r, ±r)，只是符号改变。'} },

      { tag:{ko:'③ 일반형과 미정계수',en:'3) General form with an unknown',zh:'③ 一般式与待定常数'},
        head:{ko:'(x-3)^2+(y+2)^2=13-k=3^2',en:'(x-3)^2+(y+2)^2=13-k=3^2',zh:'(x-3)^2+(y+2)^2=13-k=3^2'},
        desc:{ko:'원 x²+y²−6x+4y+k=0 이 y축에 접하면 반지름은 |3|=3 이므로 13−k=9, k=<b>4</b> 입니다.',
              en:'If x²+y²−6x+4y+k=0 touches the y-axis, the radius is |3|=3, so 13−k=9 and k=<b>4</b>.',
              zh:'圆x²+y²−6x+4y+k=0与y轴相切时，半径为|3|=3，所以13−k=9，k=<b>4</b>。'},
        mathSteps:['13-k=9\\ \\Rightarrow\\ k=4'],
        result:{ko:'표준형으로 바꾸면 보입니다!',en:'Standard form makes it visible!',zh:'化成标准式就看清了！'},
        book:{ko:'완전제곱식으로 묶어 중심과 r² 을 먼저 찾습니다.',
              en:'Complete the squares to find the center and r² first.',
              zh:'先配方求出圆心和r²。'} }
    ],
    rule:{ ko:'① x축에 접하면 r=|b|  ② y축에 접하면 r=|a|  ③ 두 축에 모두 접하면 |a|=|b|=r',
      en:'① Touching the x-axis: r=|b|  ② the y-axis: r=|a|  ③ both axes: |a|=|b|=r',
      zh:'① 与x轴相切r=|b|  ② 与y轴相切r=|a|  ③ 与两轴都相切|a|=|b|=r' }
  },

  check:{
    fills:[
      { tex:{ko:'\\text{중심 }(-4,\\ 5),\\ x\\text{축에 접함}\\ \\Rightarrow\\ r=\\square',en:'\\text{center }(-4,\\ 5),\\ \\text{tangent to the }x\\text{-axis}\\ \\Rightarrow\\ r=\\square',zh:'\\text{圆心}(-4,\\ 5),\\ \\text{与}x\\text{轴相切}\\ \\Rightarrow\\ r=\\square'}, answer:5,
        hint:{ ko:'|5|', en:'|5|', zh:'|5|' } },
      { tex:{ko:'\\text{중심 }(2,\\ -6),\\ y\\text{축에 접함}\\ \\Rightarrow\\ r=\\square',en:'\\text{center }(2,\\ -6),\\ \\text{tangent to the }y\\text{-axis}\\ \\Rightarrow\\ r=\\square',zh:'\\text{圆心}(2,\\ -6),\\ \\text{与}y\\text{轴相切}\\ \\Rightarrow\\ r=\\square'}, answer:2,
        hint:{ ko:'|2|', en:'|2|', zh:'|2|' } }
    ],
    open:{ ko:'한 점을 지나고 두 축에 모두 접하는 원이 보통 두 개 생기는 까닭을 설명해 봅니다.',
      en:'Explain why there are usually two circles through a point that touch both axes.',
      zh:'说说为什么经过一点且与两轴都相切的圆通常有两个。' },
    openHint:{ ko:'중심을 (r, r) 로 놓으면 r 에 대한 이차방정식이 되어 근이 두 개 나옵니다.',
      en:'With center (r, r) you get a quadratic in r, which has two roots.',
      zh:'设圆心为(r, r)，得到关于r的二次方程，有两个根。' }
  },

  lab:{
    generator:'md117_circleAxis', level:'main', count:6,
    params:{mode:'both'},
    intro:{
      ko:'두 축에 모두 접하는 원은 중심이 (±r, ±r) 입니다. 사분면을 보고 부호를 정한 뒤 조건으로 r 을 구합니다.',
      en:'A circle touching both axes has center (±r, ±r). Fix the signs from the quadrant, then use the condition to find r.',
      zh:'与两轴都相切的圆，圆心为(±r, ±r)。先按象限定符号，再用条件求r。'
    }
  },

  arena:{
    generator:'md117_circleAxis', level:'main', count:6, timeLimit:480,
    params:{mode:'unknown'},
    rule:{ ko:'8분 안에 접하는 조건으로 k 를 모두 찾습니다!', en:'Find every k from the tangency condition within 8 minutes!', zh:'8分钟内用相切条件求出所有k！' }
  },

  stamp:{ label:{ ko:'축 굴리기 달인', en:'Axis Roller', zh:'坐标轴滚圆高手' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'축에 딱 붙였어! ⭕',en:'Right up against the axis!',zh:'正好贴住坐标轴！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'x축에 접하면 y 좌표를 봐!',en:'Touching the x-axis? Look at y!',zh:'与x轴相切就看y坐标！'}, {ko:'표준형으로 바꿔 봐!',en:'Try the standard form!',zh:'化成标准式试试！'} ],
    finish:{ ko:'완벽해! 축 굴리기 달인! ⭕✨', en:'Perfect! Axis Roller!', zh:'完美！坐标轴滚圆高手！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
