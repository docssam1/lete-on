/* Numbers of Magic — 유닛 M-118: 원과 직선의 위치 관계 (고등 공통수학2 · 과정 51 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD118. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-118'] = {
  id:'M-118', tier:'highmath2', level:'51', order:118,
  generator:'md118_circleLine',
  title:{ ko:'원과 직선의 위치 관계', en:'A Circle and a Line', zh:'圆与直线的位置关系' },
  subtitle:{ ko:'중심과 직선 사이의 거리 d 와 반지름 r 을 비교합니다', en:'Compare the center-to-line distance d with the radius r', zh:'比较圆心到直线的距离d与半径r' },
  icon:'🪐',

  practice:{
    generator:'md118_circleLine', level:'practice', count:6,
    params:{mode:'count'},
    intro:{
      ko:'d<r 이면 2 개, d=r 이면 1 개, d>r 이면 0 개입니다. 연립한 이차방정식의 판별식으로 판정해도 됩니다.',
      en:'d<r: 2 points, d=r: 1, d>r: 0. The discriminant of the combined quadratic works too.',
      zh:'d<r有2个，d=r有1个，d>r有0个。也可以用联立所得二次方程的判别式判断。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'바퀴 옆으로 막대를 대 보면, 막대가 바퀴를 가로지르거나, 살짝 스치거나, 닿지 않습니다. 이 세 경우는 바퀴의 중심에서 막대까지의 거리와 반지름을 비교하면 바로 갈립니다.',
        en:'Hold a stick next to a wheel: it cuts across, just grazes, or misses. The three cases split at once when you compare the distance from the center to the stick with the radius.',
        zh:'把一根棍子靠近车轮：它可能穿过车轮、轻轻擦过或碰不到。比较车轮中心到棍子的距离与半径，三种情况立刻分清。' }
    },
    stages:[
      { tag:{ko:'① 교점의 개수',en:'1) Number of common points',zh:'① 交点的个数'},
        head:{ko:'d=\\dfrac{|-10|}{5}=2<5',en:'d=\\dfrac{|-10|}{5}=2<5',zh:'d=\\dfrac{|-10|}{5}=2<5'},
        desc:{ko:'원 x²+y²=25 와 직선 3x+4y−10=0 은 d=2, r=5 이므로 서로 다른 <b>두 점</b>에서 만납니다.',
              en:'For x²+y²=25 and 3x+4y−10=0, d=2 and r=5, so they meet at <b>two</b> points.',
              zh:'圆x²+y²=25与直线3x+4y−10=0，d=2、r=5，所以交于<b>两个</b>点。'},
        mathSteps:['d<r\\ \\Rightarrow\\ 2'],
        result:{ko:'d 와 r 을 비교!',en:'Compare d and r!',zh:'比较d与r！'},
        book:{ko:'y=mx+n 을 원의 식에 넣은 이차방정식의 판별식 D 로도 같은 결론이 나옵니다.',
              en:'Substituting y=mx+n into the circle and checking the discriminant D gives the same result.',
              zh:'把y=mx+n代入圆的方程，看所得二次方程的判别式D，结论相同。'} },

      { tag:{ko:'② 접할 조건',en:'2) Tangency',zh:'② 相切的条件'},
        head:{ko:'\\dfrac{|k|}{\\sqrt5}=\\sqrt5\\ \\Rightarrow\\ k=\\pm5',en:'\\dfrac{|k|}{\\sqrt5}=\\sqrt5\\ \\Rightarrow\\ k=\\pm5',zh:'\\dfrac{|k|}{\\sqrt5}=\\sqrt5\\ \\Rightarrow\\ k=\\pm5'},
        desc:{ko:'원 x²+y²=5 와 직선 y=2x+k 가 접하려면 원점과 2x−y+k=0 사이의 거리가 √5 이어야 합니다. k>0 이면 k=<b>5</b> 입니다.',
              en:'For y=2x+k to touch x²+y²=5, the distance from the origin to 2x−y+k=0 must be √5. With k>0, k=<b>5</b>.',
              zh:'直线y=2x+k与圆x²+y²=5相切时，原点到2x−y+k=0的距离须为√5。k>0时k=<b>5</b>。'},
        mathSteps:['|k|=5'],
        result:{ko:'접하면 d=r!',en:'Tangent means d=r!',zh:'相切即d=r！'},
        book:{ko:'절댓값 때문에 k 가 두 개 나오므로 조건으로 하나를 고릅니다.',
              en:'The absolute value gives two values of k; the condition picks one.',
              zh:'因为有绝对值，k有两个值，用条件选一个。'} },

      { tag:{ko:'③ 두 점에서 만날 범위',en:'3) Range for two points',zh:'③ 交于两点的范围'},
        head:{ko:'|k|<10\\ \\Rightarrow\\ -10<k<10',en:'|k|<10\\ \\Rightarrow\\ -10<k<10',zh:'|k|<10\\ \\Rightarrow\\ -10<k<10'},
        desc:{ko:'원 x²+y²=10 과 직선 y=3x+k 가 두 점에서 만나려면 |k|/√10<√10, 곧 <b>−10<k<10</b> 입니다.',
              en:'For y=3x+k to meet x²+y²=10 at two points, |k|/√10<√10, i.e. <b>−10<k<10</b>.',
              zh:'直线y=3x+k与圆x²+y²=10交于两点时，|k|/√10<√10，即<b>−10<k<10</b>。'},
        mathSteps:['|k|<10'],
        result:{ko:'두 점이면 d<r!',en:'Two points means d<r!',zh:'交于两点即d<r！'},
        book:{ko:'만나지 않을 조건은 반대로 d>r 이라 범위의 바깥쪽입니다.',
              en:'For no common point it is d>r instead — the outside of that range.',
              zh:'没有交点的条件则是d>r，即范围的外侧。'} }
    ],
    rule:{ ko:'① d<r: 두 점, d=r: 접함, d>r: 만나지 않음  ② 접할 조건은 d=r  ③ 두 점에서 만날 조건은 d<r',
      en:'① d<r: two points, d=r: tangent, d>r: none  ② Tangency: d=r  ③ Two points: d<r',
      zh:'① d<r交于两点，d=r相切，d>r不相交  ② 相切：d=r  ③ 交于两点：d<r' }
  },

  check:{
    fills:[
      { tex:{ko:'x^2+y^2=4,\\ x=3\\ \\Rightarrow\\ \\text{교점의 개수}=\\square',en:'x^2+y^2=4,\\ x=3\\ \\Rightarrow\\ \\text{common points}=\\square',zh:'x^2+y^2=4,\\ x=3\\ \\Rightarrow\\ \\text{交点个数}=\\square'}, answer:0,
        hint:{ ko:'d=3>2', en:'d=3>2', zh:'d=3>2' } },
      { tex:{ko:'x^2+y^2=9,\\ 4x+3y-15=0\\ \\Rightarrow\\ \\text{교점의 개수}=\\square',en:'x^2+y^2=9,\\ 4x+3y-15=0\\ \\Rightarrow\\ \\text{common points}=\\square',zh:'x^2+y^2=9,\\ 4x+3y-15=0\\ \\Rightarrow\\ \\text{交点个数}=\\square'}, answer:1,
        hint:{ ko:'d=15÷5=3=r', en:'d=15÷5=3=r', zh:'d=15÷5=3=r' } }
    ],
    open:{ ko:'거리로 판정하는 방법과 판별식으로 판정하는 방법이 같은 결론을 내는 까닭을 설명해 봅니다.',
      en:'Explain why the distance test and the discriminant test always agree.',
      zh:'说说用距离判断和用判别式判断为什么结论总是相同。' },
    openHint:{ ko:'교점의 개수는 연립방정식의 실근의 개수이고, 그것은 직선이 원 안을 지나는지(d<r)와 같은 말입니다.',
      en:'The number of common points is the number of real solutions of the system, which is the same as asking whether the line passes inside the circle (d<r).',
      zh:'交点个数就是方程组实数解的个数，这与直线是否穿过圆内(d<r)是一回事。' }
  },

  lab:{
    generator:'md118_circleLine', level:'main', count:6,
    params:{mode:'tangent'},
    intro:{
      ko:'접할 조건 d=r 을 세우면 절댓값 방정식이 되고 k 가 두 개 나옵니다. 조건에 맞는 하나를 고릅니다.',
      en:'Setting d=r gives an absolute-value equation with two values of k; choose the one that fits the condition.',
      zh:'列出相切条件d=r得到绝对值方程，k有两个值，选符合条件的那个。'
    }
  },

  arena:{
    generator:'md118_circleLine', level:'main', count:6, timeLimit:480,
    params:{mode:'range'},
    rule:{ ko:'8분 안에 두 점에서 만날 k 의 범위를 모두 구합니다!', en:'Find every range of k for two common points within 8 minutes!', zh:'8分钟内求出所有交于两点时k的范围！' }
  },

  stamp:{ label:{ ko:'궤도 판정관', en:'Orbit Judge', zh:'轨道裁判' }, coins:51 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'거리와 반지름, 완벽한 비교야! 🪐',en:'Distance vs radius — perfect!',zh:'距离与半径，比较得完美！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'중심과 직선 사이의 거리부터!',en:'Start with the center-to-line distance!',zh:'先求圆心到直线的距离！'}, {ko:'두 점이면 d<r 이야!',en:'Two points means d<r!',zh:'交于两点就是d<r！'} ],
    finish:{ ko:'완벽해! 궤도 판정관! 🪐✨', en:'Perfect! Orbit Judge!', zh:'完美！轨道裁判！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
