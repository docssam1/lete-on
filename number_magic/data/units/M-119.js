/* Numbers of Magic — 유닛 M-119: 원의 접선의 방정식 (고등 공통수학2 · 과정 51 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD119. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-119'] = {
  id:'M-119', tier:'highmath2', level:'51', order:119,
  generator:'md119_tangentLine',
  title:{ ko:'원의 접선의 방정식', en:'Tangent Lines to a Circle', zh:'圆的切线方程' },
  subtitle:{ ko:'접선은 접점에서 반지름에 수직입니다', en:'A tangent is perpendicular to the radius at the point of contact', zh:'切线在切点处垂直于半径' },
  icon:'🎡',

  practice:{
    generator:'md119_tangentLine', level:'practice', count:6,
    params:{mode:'onCircle'},
    intro:{
      ko:'원 x²+y²=r² 위의 점 (x₁, y₁) 에서의 접선은 x₁x+y₁y=r² 입니다. 중심이 원점이 아니면 중심을 기준으로 옮겨 생각합니다.',
      en:'The tangent to x²+y²=r² at (x₁, y₁) is x₁x+y₁y=r². If the center is not the origin, measure from the center instead.',
      zh:'圆x²+y²=r²上点(x₁, y₁)处的切线为x₁x+y₁y=r²。圆心不在原点时，以圆心为基准来想。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'돌리던 줄에서 돌멩이를 놓으면 원을 벗어나 접선 방향으로 날아갑니다. 그 방향은 줄(반지름)과 수직입니다. 접선의 방정식은 모두 이 수직 관계에서 나옵니다.',
        en:'Let go of a stone whirled on a string and it flies off along the tangent, perpendicular to the string (the radius). Every tangent-line formula comes from this right angle.',
        zh:'松开用绳子甩动的石头，它会沿切线方向飞出，与绳子(半径)垂直。切线方程都来自这个垂直关系。' }
    },
    stages:[
      { tag:{ko:'① 원 위의 점에서',en:'1) At a point on the circle',zh:'① 圆上一点处'},
        head:{ko:'x^2+y^2=25,\\ (3,\\ 4)\\ \\Rightarrow\\ 3x+4y=25',en:'x^2+y^2=25,\\ (3,\\ 4)\\ \\Rightarrow\\ 3x+4y=25',zh:'x^2+y^2=25,\\ (3,\\ 4)\\ \\Rightarrow\\ 3x+4y=25'},
        desc:{ko:'원 x²+y²=25 위의 점 (3, 4) 에서의 접선은 <b>3x+4y=25</b> 입니다. 반지름의 기울기 4/3 과 접선의 기울기 −3/4 의 곱이 −1 입니다.',
              en:'The tangent to x²+y²=25 at (3, 4) is <b>3x+4y=25</b>: the radius slope 4/3 times the tangent slope −3/4 is −1.',
              zh:'圆x²+y²=25上点(3, 4)处的切线为<b>3x+4y=25</b>：半径斜率4/3与切线斜率−3/4之积为−1。'},
        mathSteps:['\\dfrac43\\times\\left(-\\dfrac34\\right)=-1'],
        result:{ko:'x₁x+y₁y=r²!',en:'x₁x+y₁y=r²!',zh:'x₁x+y₁y=r²！'},
        book:{ko:'중심이 (a, b) 이면 (x₁−a)(x−a)+(y₁−b)(y−b)=r² 입니다.',
              en:'With center (a, b) it becomes (x₁−a)(x−a)+(y₁−b)(y−b)=r².',
              zh:'圆心为(a, b)时为(x₁−a)(x−a)+(y₁−b)(y−b)=r²。'} },

      { tag:{ko:'② 기울기가 주어질 때',en:'2) Given the slope',zh:'② 已知斜率时'},
        head:{ko:'y=2x\\pm\\sqrt5\\sqrt{2^2+1}=2x\\pm5',en:'y=2x\\pm\\sqrt5\\sqrt{2^2+1}=2x\\pm5',zh:'y=2x\\pm\\sqrt5\\sqrt{2^2+1}=2x\\pm5'},
        desc:{ko:'원 x²+y²=5 에 접하고 기울기가 2 인 직선은 <b>y=2x±5</b> 두 개입니다.',
              en:'The lines with slope 2 tangent to x²+y²=5 are the two lines <b>y=2x±5</b>.',
              zh:'与圆x²+y²=5相切且斜率为2的直线是<b>y=2x±5</b>两条。'},
        mathSteps:['\\sqrt{5\\times5}=5'],
        result:{ko:'y=mx±r√(m²+1)!',en:'y=mx±r√(m²+1)!',zh:'y=mx±r√(m²+1)！'},
        book:{ko:'평행한 직선이 주어지면 같은 기울기, 수직인 직선이 주어지면 기울기의 곱이 −1 인 기울기를 씁니다.',
              en:'Given a parallel line, use its slope; given a perpendicular line, use the slope whose product with it is −1.',
              zh:'给出平行直线就用相同斜率，给出垂直直线就用与之乘积为−1的斜率。'} },

      { tag:{ko:'③ 원 밖의 점에서',en:'3) From an outside point',zh:'③ 从圆外一点'},
        head:{ko:'\\overline{PT}=\\sqrt{5^2-3^2}=4',en:'\\overline{PT}=\\sqrt{5^2-3^2}=4',zh:'\\overline{PT}=\\sqrt{5^2-3^2}=4'},
        desc:{ko:'원 x²+y²=9 밖의 점 P(3, 4) 에서 그은 접선의 길이는 OP=5, r=3 이므로 <b>4</b> 입니다.',
              en:'From P(3, 4) outside x²+y²=9, OP=5 and r=3, so the tangent length is <b>4</b>.',
              zh:'从圆x²+y²=9外的点P(3, 4)引切线，OP=5、r=3，切线长为<b>4</b>。'},
        mathSteps:['25-9=16'],
        result:{ko:'접선의 길이는 직각삼각형!',en:'Tangent length is a right triangle!',zh:'切线长就是直角三角形！'},
        book:{ko:'두 접선의 기울기는 y−q=m(x−p) 가 원에 접할 조건에서 나온 m 의 이차방정식의 두 근입니다.',
              en:'The two tangent slopes are the roots of the quadratic in m from requiring y−q=m(x−p) to touch the circle.',
              zh:'两条切线的斜率是y−q=m(x−p)与圆相切的条件所得关于m的二次方程的两根。'} }
    ],
    rule:{ ko:'① 원 위의 점: x₁x+y₁y=r²  ② 기울기 m: y=mx±r√(m²+1)  ③ 원 밖의 점: PT=√(CP²−r²), 기울기는 판별식·거리 조건',
      en:'① On the circle: x₁x+y₁y=r²  ② Slope m: y=mx±r√(m²+1)  ③ Outside point: PT=√(CP²−r²); slopes from the tangency condition',
      zh:'① 圆上一点：x₁x+y₁y=r²  ② 斜率m：y=mx±r√(m²+1)  ③ 圆外一点：PT=√(CP²−r²)，斜率由相切条件得出' }
  },

  check:{
    fills:[
      { tex:{ko:'x^2+y^2=10,\\ (1,\\ 3)\\ \\Rightarrow\\ x+3y=\\square',en:'x^2+y^2=10,\\ (1,\\ 3)\\ \\Rightarrow\\ x+3y=\\square',zh:'x^2+y^2=10,\\ (1,\\ 3)\\ \\Rightarrow\\ x+3y=\\square'}, answer:10,
        hint:{ ko:'x₁x+y₁y=r²', en:'x₁x+y₁y=r²', zh:'x₁x+y₁y=r²' } },
      { tex:{ko:'x^2+y^2=64,\\ P(6,\\ 8)\\ \\Rightarrow\\ \\overline{PT}=\\square',en:'x^2+y^2=64,\\ P(6,\\ 8)\\ \\Rightarrow\\ \\overline{PT}=\\square',zh:'x^2+y^2=64,\\ P(6,\\ 8)\\ \\Rightarrow\\ \\overline{PT}=\\square'}, answer:6,
        hint:{ ko:'√(100−64)', en:'√(100−64)', zh:'√(100−64)' } }
    ],
    open:{ ko:'원 x²+y²=r² 위의 점 (x₁, y₁) 에서의 접선이 x₁x+y₁y=r² 이 되는 까닭을 수직 조건으로 설명해 봅니다.',
      en:'Using perpendicularity, explain why the tangent at (x₁, y₁) on x²+y²=r² is x₁x+y₁y=r².',
      zh:'用垂直条件说说为什么圆x²+y²=r²上点(x₁, y₁)处的切线是x₁x+y₁y=r²。' },
    openHint:{ ko:'접선 위의 점 (x, y) 에 대해 벡터처럼 (x−x₁, y−y₁) 이 (x₁, y₁) 과 수직이므로 x₁(x−x₁)+y₁(y−y₁)=0 이고, x₁²+y₁²=r² 을 쓰면 됩니다.',
      en:'For (x, y) on the tangent, (x−x₁, y−y₁) is perpendicular to (x₁, y₁), so x₁(x−x₁)+y₁(y−y₁)=0; then use x₁²+y₁²=r².',
      zh:'切线上的点(x, y)满足(x−x₁, y−y₁)与(x₁, y₁)垂直，即x₁(x−x₁)+y₁(y−y₁)=0，再用x₁²+y₁²=r²。' }
  },

  lab:{
    generator:'md119_tangentLine', level:'main', count:6,
    params:{mode:'slope'},
    intro:{
      ko:'기울기를 먼저 정하고 y=mx±r√(m²+1) 에 넣습니다. 조건(양수·음수)으로 절편 하나를 고릅니다.',
      en:'Fix the slope first and use y=mx±r√(m²+1). The condition (positive or negative) picks one intercept.',
      zh:'先确定斜率，代入y=mx±r√(m²+1)，再按条件(正或负)选一个截距。'
    }
  },

  arena:{
    generator:'md119_tangentLine', level:'main', count:6, timeLimit:480,
    params:{mode:'outside'},
    rule:{ ko:'8분 안에 원 밖의 점에서 그은 접선 문제를 모두 풉니다!', en:'Solve every tangent-from-outside problem within 8 minutes!', zh:'8分钟内解完所有从圆外一点引切线的题！' }
  },

  stamp:{ label:{ ko:'접선 사수', en:'Tangent Archer', zh:'切线射手' }, coins:51 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'반지름에 딱 수직이야! 🎡',en:'Exactly perpendicular to the radius!',zh:'正好垂直于半径！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'접선은 반지름에 수직이야!',en:'The tangent is perpendicular to the radius!',zh:'切线垂直于半径！'}, {ko:'± 두 개 중 조건에 맞는 걸 골라!',en:'Pick the ± case that fits!',zh:'在±两个中选符合条件的！'} ],
    finish:{ ko:'완벽해! 접선 사수! 🎡✨', en:'Perfect! Tangent Archer!', zh:'完美！切线射手！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
