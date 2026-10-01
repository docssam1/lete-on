/* Numbers of Magic — 유닛 M-133: 무리함수 (고등 공통수학2 · 과정 59 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD133. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-133'] = {
  id:'M-133', tier:'highmath2', level:'59', order:133,
  generator:'md133_radFunc',
  title:{ ko:'무리함수', en:'Radical Functions', zh:'无理函数' },
  subtitle:{ ko:'한쪽으로만 뻗어 가는 그래프', en:'Graphs that grow in one direction only', zh:'只向一侧延伸的图像' },
  icon:'🌿',

  practice:{
    generator:'md133_radFunc', level:'practice', count:6,
    params:{mode:'domain'},
    intro:{
      ko:'근호 안이 0 이상인 x 의 범위가 정의역이고, √ 의 값이 0 이상이므로 치역의 끝은 뒤에 더한 수입니다.',
      en:'The domain is where the radicand is at least 0; since √ is at least 0, the end of the range is the number added after it.',
      zh:'根号内不小于0的x的范围是定义域；√的值不小于0，所以值域的端点就是后面加上的数。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'y=√x 의 그래프는 원점에서 출발해 오른쪽 위로만 뻗어 갑니다. 출발점을 옮기면 그래프 전체가 따라 움직이고, 직선과 몇 번 만나는지도 달라집니다.',
        en:'The graph of y=√x starts at the origin and only reaches up and to the right. Move the starting point and the whole graph follows — and so does the number of times it meets a line.',
        zh:'y=√x的图像从原点出发，只向右上方延伸。移动起点，整个图像随之移动，与直线相交的次数也会改变。' }
    },
    stages:[
      { tag:{ko:'① 정의역과 치역',en:'1) Domain and range',zh:'① 定义域与值域'},
        head:{ko:'y=\\sqrt{2x-4}+1:\\ x\\ge 2,\\ y\\ge 1',en:'y=\\sqrt{2x-4}+1:\\ x\\ge 2,\\ y\\ge 1',zh:'y=\\sqrt{2x-4}+1:\\ x\\ge 2,\\ y\\ge 1'},
        desc:{ko:'2x−4≥0 에서 정의역은 x≥<b>2</b>, √ 의 값이 0 이상이므로 치역은 y≥<b>1</b> 입니다.',
              en:'From 2x−4≥0 the domain is x≥<b>2</b>; since √ is at least 0, the range is y≥<b>1</b>.',
              zh:'由2x−4≥0得定义域x≥<b>2</b>；因为√的值不小于0，值域为y≥<b>1</b>。'},
        mathSteps:['2x-4\\ge 0','x\\ge 2'],
        result:{ko:'출발점이 곧 끝값!',en:'The starting point gives both ends!',zh:'起点就是端点！'},
        book:{ko:'x 의 계수가 음수이면 y=√(4−x) 처럼 왼쪽으로 뻗어 정의역이 x≤4 가 됩니다.',
              en:'With a negative x-coefficient, as in y=√(4−x), the graph reaches left and the domain is x≤4.',
              zh:'x的系数为负时，如y=√(4−x)，图像向左延伸，定义域为x≤4。'} },

      { tag:{ko:'② 평행이동',en:'2) Translation',zh:'② 平移'},
        head:{ko:'y=\\sqrt{2x}\\ \\xrightarrow{(3,\\,-1)}\\ y=\\sqrt{2x-6}-1',en:'y=\\sqrt{2x}\\ \\xrightarrow{(3,\\,-1)}\\ y=\\sqrt{2x-6}-1',zh:'y=\\sqrt{2x}\\ \\xrightarrow{(3,\\,-1)}\\ y=\\sqrt{2x-6}-1'},
        desc:{ko:'x 대신 x−3, y 대신 y+1 을 넣으면 y=√(2(x−3))−1=√(2x−6)−1 입니다. 거꾸로 √(2x−6)=√(2(x−3)) 으로 묶으면 이동한 양 <b>3</b> 이 보입니다.',
              en:'Replace x by x−3 and y by y+1: y=√(2(x−3))−1=√(2x−6)−1. Conversely, factoring √(2x−6)=√(2(x−3)) reveals the shift <b>3</b>.',
              zh:'把x换成x−3、y换成y+1，得y=√(2(x−3))−1=√(2x−6)−1。反过来把√(2x−6)提成√(2(x−3))，就能看出平移量<b>3</b>。'},
        mathSteps:['\\sqrt{2(x-3)}-1'],
        result:{ko:'근호 안을 계수로 묶기!',en:'Factor the coefficient out of the radicand!',zh:'把根号内的系数提出来！'},
        book:{ko:'√(2x−6) 을 √(2x)−6 으로 착각하지 않도록 x 의 계수로 먼저 묶습니다.',
              en:'Factor out the x-coefficient first so you do not confuse √(2x−6) with √(2x)−6.',
              zh:'先提出x的系数，免得把√(2x−6)误当成√(2x)−6。'} },

      { tag:{ko:'③ 직선과의 위치 관계',en:'3) Meeting a line',zh:'③ 与直线的位置关系'},
        head:{ko:'y=2\\sqrt{x-1},\\ y=x+k:\\ -1\\le k<0',en:'y=2\\sqrt{x-1},\\ y=x+k:\\ -1\\le k<0',zh:'y=2\\sqrt{x-1},\\ y=x+k:\\ -1\\le k<0'},
        desc:{ko:'직선이 끝점 (1, 0) 을 지나면 k=−1, 그래프에 접하면 w=√(x−1) 로 놓은 w²−2w+1+k=0 의 판별식이 0 이라 k=0 입니다. 두 점에서 만나는 범위는 <b>−1≤k<0</b> 입니다.',
              en:'Through the endpoint (1, 0): k=−1. Tangent: with w=√(x−1), w²−2w+1+k=0 has discriminant 0, so k=0. Two intersection points for <b>−1≤k<0</b>.',
              zh:'直线过端点(1, 0)时k=−1；相切时令w=√(x−1)，w²−2w+1+k=0的判别式为0，k=0。交于两点的范围是<b>−1≤k<0</b>。'},
        mathSteps:['k=-1','k=0'],
        result:{ko:'끝점은 포함, 접점은 제외!',en:'Endpoint in, tangent out!',zh:'端点包含，切点不含！'},
        book:{ko:'k 가 0 보다 크면 직선이 그래프 위로 떠서 만나지 않고, −1 보다 작으면 한 점에서만 만납니다.',
              en:'For k greater than 0 the line floats above the graph and misses it; for k less than −1 it meets the graph at only one point.',
              zh:'k大于0时直线在图像上方，不相交；k小于−1时只交于一点。'} }
    ],
    rule:{ ko:'① 근호 안 ≥0 이 정의역, 치역은 y≥q(또는 y≤q)  ② 근호 안을 계수로 묶어 평행이동을 읽기  ③ 끝점을 지날 때와 접할 때가 경계',
      en:'① Radicand ≥0 gives the domain; the range is y≥q (or y≤q)  ② Factor the radicand to read the translation  ③ Boundaries: through the endpoint, and tangent',
      zh:'① 根号内≥0得定义域，值域为y≥q(或y≤q)  ② 把根号内提出系数读平移  ③ 边界：经过端点时与相切时' }
  },

  check:{
    fills:[
      { tex:{ko:'y=\\sqrt{x+3}-2\\ \\Rightarrow\\ x\\ge\\square',en:'y=\\sqrt{x+3}-2\\ \\Rightarrow\\ x\\ge\\square',zh:'y=\\sqrt{x+3}-2\\ \\Rightarrow\\ x\\ge\\square'}, answer:-3,
        hint:{ ko:'x+3≥0', en:'x+3≥0', zh:'x+3≥0' } },
      { tex:{ko:'y=-\\sqrt{5-x}+4\\ \\Rightarrow\\ y\\le\\square',en:'y=-\\sqrt{5-x}+4\\ \\Rightarrow\\ y\\le\\square',zh:'y=-\\sqrt{5-x}+4\\ \\Rightarrow\\ y\\le\\square'}, answer:4,
        hint:{ ko:'−√ 는 0 이하', en:'−√ is at most 0', zh:'−√不大于0' } }
    ],
    open:{ ko:'y=√(x−1) 과 직선 y=x+k 가 서로 다른 두 점에서 만날 때 k 의 범위의 한쪽 끝이 포함되고 다른 쪽 끝은 포함되지 않는 까닭을 설명해 봅니다.',
      en:'When y=√(x−1) meets y=x+k at two different points, explain why one end of the range of k is included and the other is not.',
      zh:'y=√(x−1)与直线y=x+k交于两个不同点时，说说为什么k的范围一端包含、另一端不包含。' },
    openHint:{ ko:'끝점을 지나는 직선은 끝점과 다른 한 점, 모두 두 점에서 만나 포함됩니다. 접할 때는 한 점에서만 만나므로 빠집니다.',
      en:'The line through the endpoint meets the graph at the endpoint and one more point — two points, so it counts. The tangent line meets it at only one point, so it is excluded.',
      zh:'过端点的直线与图像交于端点和另一点，共两点，所以包含；相切时只交于一点，所以不包含。' }
  },

  lab:{
    generator:'md133_radFunc', level:'main', count:6,
    params:{mode:'shift'},
    intro:{
      ko:'근호 안을 x 의 계수로 묶어 x 방향 이동을, 뒤에 더한 수로 y 방향 이동을 읽습니다.',
      en:'Factor the x-coefficient out of the radicand to read the x-shift, and read the y-shift from the number added afterwards.',
      zh:'把根号内提出x的系数读出x方向的平移，由后面加上的数读出y方向的平移。'
    }
  },

  arena:{
    generator:'md133_radFunc', level:'main', count:6, timeLimit:420,
    params:{mode:'meet'},
    rule:{ ko:'7분 안에 무리함수와 직선이 두 점에서 만나는 k 의 범위를 모두 찾습니다!', en:'Find every range of k for two intersection points within 7 minutes!', zh:'7分钟内求出所有交于两点时k的范围！' }
  },

  stamp:{ label:{ ko:'덩굴 길잡이', en:'Vine Pathfinder', zh:'藤蔓向导' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'출발점을 정확히 찾았어! 🌿',en:'Starting point spot on!',zh:'起点找得很准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'근호 안이 0 이상인 범위를 봐!',en:'Look where the radicand is at least 0!',zh:'看看根号内不小于0的范围！'}, {ko:'끝점과 접점을 따로 따져 봐!',en:'Check the endpoint and the tangent separately!',zh:'把端点和切点分开考虑！'} ],
    finish:{ ko:'완벽해! 덩굴 길잡이! 🌿✨', en:'Perfect! Vine Pathfinder!', zh:'完美！藤蔓向导！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
