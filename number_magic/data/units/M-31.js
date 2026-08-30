/* Numbers of Magic — 유닛 M-31: 두 점 사이의 거리 (고등 W12 · 공통수학2 도형의 방정식) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-31'] = {
  id:'M-31', tier:'highmath2', level:'38', order:31,
  generator:'md31_distance',
  title:{ ko:'두 점 사이의 거리', en:'Distance Between Two Points', zh:'两点间的距离' },
  subtitle:{ ko:'가로·세로 차를 제곱해 더하고 제곱근을 씌워요(피타고라스 정리)', en:'Square the horizontal and vertical differences, add, then take the root (Pythagorean theorem)', zh:'横纵坐标差平方后相加再开方(勾股定理)' },
  icon:'📏',

  practice:{
    generator:'md31_distance', level:'practice', count:5,
    params:{mode:'basic'},
    intro:{
      ko:'(0,0)과 (3,4) 사이의 거리는? 가로로 3, 세로로 4 떨어졌으니 3²+4²=25, √25=5 — 직각삼각형의 빗변이에요.',
      en:'Distance between (0,0) and (3,4)? 3 across, 4 up — 3²+4²=25, √25=5, the hypotenuse of a right triangle.',
      zh:'(0,0)和(3,4)之间的距离？横向3、纵向4——3²+4²=25，√25=5，就是直角三角形的斜边。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'좌표평면 위 두 점 사이의 거리를 구하고 싶어요. 자로 재지 않고, 좌표만 알면 계산으로 정확히 구할 방법이 있을까요?',
        en:'You want the distance between two points on the coordinate plane. Without a ruler, is there a way to compute it exactly from just the coordinates?',
        zh:'想求坐标平面上两点间的距离。不用尺子量，只凭坐标能精确算出来吗？' },
      history:{ ko:'두 점을 잇는 선분은 항상 가로 변화량과 세로 변화량으로 만든 직각삼각형의 빗변이에요. 2500년 전부터 알려진 피타고라스 정리(빗변²=밑변²+높이²)를 좌표에 그대로 적용하면 거리 공식이 나와요.',
        en:'The segment joining two points is always the hypotenuse of a right triangle formed by the horizontal and vertical changes. Applying the 2,500-year-old Pythagorean theorem (hypotenuse²=leg²+leg²) directly to coordinates gives the distance formula.',
        zh:'连接两点的线段，永远是横向变化量和纵向变化量构成的直角三角形的斜边。把2500年前就已知的勾股定理(斜边²=直角边²+直角边²)直接套用到坐标上，就得到距离公式。' }
    },
    stages:[
      { tag:{ko:'① 가로·세로 차를 구해 직각삼각형',en:'1) The differences form a right triangle',zh:'① 横纵差构成直角三角形'},
        head:{ko:'A(0,0), B(3,4) \\;\\Rightarrow\\; \\overline{AB}=5',en:'A(0,0), B(3,4) \\;\\Rightarrow\\; \\overline{AB}=5',zh:'A(0,0), B(3,4) \\;\\Rightarrow\\; \\overline{AB}=5'},
        desc:{ko:'가로로 3-0=3, 세로로 4-0=4만큼 떨어져 있어요. 이 3과 4가 직각삼각형의 두 변, AB가 빗변이니 <b>3²+4²=25, √25=5</b>.',
              en:'The horizontal gap is 3-0=3, the vertical gap is 4-0=4. These form the two legs of a right triangle, with AB as the hypotenuse: <b>3²+4²=25, √25=5</b>.',
              zh:'横向差是3-0=3，纵向差是4-0=4。这3和4是直角三角形的两条直角边，AB是斜边：<b>3²+4²=25，√25=5</b>。'},
        mathSteps:['\\Delta x=3-0=3,\\;\\Delta y=4-0=4', '\\overline{AB}^2=3^2+4^2=25', '\\overline{AB}=\\sqrt{25}=5'],
        result:{ko:'가로·세로 차를 제곱해 더한 뒤 제곱근을 씌워요!',en:'Square the differences, add, then take the square root!',zh:'把横纵差平方后相加，再开平方！'},
        book:{ko:'두 점 A(x₁,y₁), B(x₂,y₂) 사이의 거리: √((x₂-x₁)²+(y₂-y₁)²).',
              en:'Distance between A(x₁,y₁), B(x₂,y₂): √((x₂-x₁)²+(y₂-y₁)²).',
              zh:'两点A(x₁,y₁)、B(x₂,y₂)间的距离：√((x₂-x₁)²+(y₂-y₁)²)。'} },

      { tag:{ko:'② 완전제곱수가 아니면 근호 정리',en:'2) Simplify the radical if it isn\'t a perfect square',zh:'② 不是完全平方数就化简根号'},
        head:{ko:'A(0,0), B(1,2) \\;\\Rightarrow\\; \\overline{AB}=\\sqrt5',en:'A(0,0), B(1,2) \\;\\Rightarrow\\; \\overline{AB}=\\sqrt5',zh:'A(0,0), B(1,2) \\;\\Rightarrow\\; \\overline{AB}=\\sqrt5'},
        desc:{ko:'1²+2²=5는 완전제곱수가 아니라 √5 그대로 남아요. 더 큰 수라면 √48=4√3처럼 근호 정리(MD16)로 계수와 근호 안을 나눠 답해요.',
              en:'1²+2²=5 isn\'t a perfect square, so it stays as √5. For bigger numbers, simplify the radical (MD16) as in √48=4√3, splitting into coefficient and radicand.',
              zh:'1²+2²=5不是完全平方数，就保留√5。数更大时用根号化简(MD16)，像√48=4√3那样分出系数和根号内的部分。'},
        mathSteps:['\\overline{AB}^2=1^2+2^2=5', '\\overline{AB}=\\sqrt5', {ko:'\\text{(정리 안 되면 계수 1, 근호안 5)}',en:'\\text{(if it will not simplify: coefficient 1, 5 under the root)}',zh:'\\text{（化简不了就是系数1、根号内5）}'}],
        result:{ko:'답은 [계수,근호안] 두 정수 — 정리가 안 되면 계수는 1이에요!',en:'The answer is [coefficient, radicand] — if it doesn\'t simplify, the coefficient is just 1!',zh:'答案是[系数,根号内]两个整数——不能化简时系数就是1！'},
        book:{ko:'근호 정리 규약을 그대로 재사용해요 — 거리 공식만의 새로운 규약을 만들지 않아요.',
              en:'This reuses the same radical-simplifying convention — no new rule invented just for distance.',
              zh:'沿用根号化简的同一规约——没有为距离公式另外发明新规则。'} }
    ],
    rule:{ ko:'① 거리 = √((x₂-x₁)²+(y₂-y₁)²)  ② 답은 [계수,근호안] — 정리 안 되면 계수 1',
      en:'① Distance = √((x₂-x₁)²+(y₂-y₁)²)  ② Answer is [coefficient, radicand] — coefficient 1 if it doesn\'t simplify',
      zh:'① 距离 = √((x₂-x₁)²+(y₂-y₁)²)  ② 答案是[系数,根号内]——不能化简时系数为1' }
  },

  check:{
    fills:[
      { tex:'A(0,0), \\;\\; B(6,8) \\;\\Rightarrow\\; \\overline{AB} = \\square\\sqrt{\\square}', answer:[10,1],
        hint:{ ko:'6²+8²=100, √100=10', en:'6²+8²=100, √100=10', zh:'6²+8²=100，√100=10' } },
      { tex:'A(1,1), \\;\\; B(4,5) \\;\\Rightarrow\\; \\overline{AB} = \\square\\sqrt{\\square}', answer:[5,1],
        hint:{ ko:'(4-1)²+(5-1)²=9+16=25, √25=5', en:'(4-1)²+(5-1)²=9+16=25, √25=5', zh:'(4-1)²+(5-1)²=9+16=25，√25=5' } }
    ],
    open:{ ko:'A(-1,2), B(2,-2) 사이의 거리를 구하는 과정을 설명해봐요.',
      en:'Explain how to find the distance between A(-1,2) and B(2,-2).',
      zh:'说说求A(-1,2)、B(2,-2)间距离的过程。' },
    openHint:{ ko:'Δx=3, Δy=-4 → 3²+4²=25 → √25=5',
      en:'Δx=3, Δy=-4 → 3²+4²=25 → √25=5',
      zh:'Δx=3，Δy=-4 → 3²+4²=25 → √25=5' }
  },

  lab:{
    generator:'md31_distance', level:'main', count:4,
    params:{mode:'wide'},
    intro:{
      ko:'이번엔 더 큰 좌표! 근호가 안 정리될 수도 있으니 계수·근호안을 잘 살펴봐.',
      en:'Bigger coordinates this time! The radical may not simplify, so check the coefficient and radicand carefully.',
      zh:'这次坐标更大！根号可能化简不了，仔细看系数和根号内。'
    }
  },

  arena:{
    generator:'md31_distance', level:'main', count:8, timeLimit:300,
    params:{mode:'signed'},
    rule:{ ko:'5분 안에 음수 좌표가 섞인 거리 문제를 모두 풀어요!', en:'Solve all the distance problems with negative coordinates in 5 minutes!', zh:'5分钟内解答所有带负坐标的距离题！' }
  },

  stamp:{ label:{ ko:'좌표 측량가', en:'Coordinate Surveyor', zh:'坐标测量师' }, coins:47 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'직각삼각형을 정확히 세웠구나! 📏',en:'You set up the right triangle perfectly!',zh:'直角三角形搭得很准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'가로·세로 차를 각각 제곱해서 더한 뒤 제곱근을 씌워봐!',en:'Square each of the horizontal and vertical differences, add, then take the root!',zh:'把横纵差分别平方相加，再开方！'}, {ko:'완전제곱수가 아니면 근호를 그대로 정리해서 답해야 해!',en:'If it isn\'t a perfect square, simplify the radical properly!',zh:'不是完全平方数就要正确化简根号！'} ],
    finish:{ ko:'완벽해! 좌표 측량가! 📏✨', en:'Perfect! Coordinate Surveyor!', zh:'完美！坐标测量师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
