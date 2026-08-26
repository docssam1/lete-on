/* Numbers of Magic — 유닛 M-34: 두 직선의 평행과 수직 (고등 W12 · 공통수학2 도형의 방정식) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-34'] = {
  id:'M-34', tier:'highmath2', level:'39', order:34,
  generator:'md34_parallelPerp',
  title:{ ko:'두 직선의 평행과 수직', en:'Parallel & Perpendicular Lines', zh:'两直线的平行与垂直' },
  subtitle:{ ko:'평행은 계수 비율이 같고, 수직은 기울기의 곱이 -1이에요', en:'Parallel lines share a coefficient ratio; perpendicular slopes multiply to -1', zh:'平行时系数比相同，垂直时斜率之积为-1' },
  icon:'🧭',

  practice:{
    generator:'md34_parallelPerp', level:'practice', count:5,
    params:{mode:'parallel'},
    intro:{
      ko:'2x+3y+1=0과 4x+ky+5=0이 평행하려면? x,y의 계수 비율이 같아야 해요 — 2:3=4:k이니 k=6.',
      en:'For 2x+3y+1=0 and 4x+ky+5=0 to be parallel? The x,y coefficient ratios must match — 2:3=4:k, so k=6.',
      zh:'2x+3y+1=0与4x+ky+5=0要平行？x、y的系数比必须相同——2:3=4:k，所以k=6。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'두 직선이 평행한지, 수직인지 그림 없이 식만 보고 알 수 있을까요? 계수 안에 그 답이 숨어 있대요.',
        en:'Can you tell whether two lines are parallel or perpendicular just from their equations, without drawing them? The answer is hidden in the coefficients.',
        zh:'不画图，只看方程能不能判断两直线是平行还是垂直？答案就藏在系数里。' },
      history:{ ko:'평행한 직선은 기울기가 완전히 같아요 — 방향이 같으니까요. 수직인 직선은 기울기끼리 곱하면 항상 -1이 돼요 — 90도로 꺾인 두 방향의 관계가 만드는 성질이에요. 이 두 사실만 알면 그림 없이도 판단할 수 있어요.',
        en:'Parallel lines have exactly the same slope — they point in the same direction. Perpendicular lines\' slopes always multiply to -1 — a property that comes from being rotated 90 degrees apart. Knowing just these two facts, you can judge without ever drawing a picture.',
        zh:'平行的直线斜率完全相同——方向一致。垂直的直线斜率之积永远是-1——这是相差90度的两个方向之间的性质。只要知道这两点，不用画图也能判断。' }
    },
    stages:[
      { tag:{ko:'① 평행: 계수 비율이 같다',en:'1) Parallel: matching coefficient ratios',zh:'① 平行：系数比相同'},
        head:{ko:'2x+3y+1=0,\\;4x+ky+5=0 \\;\\Rightarrow\\; k=6',en:'2x+3y+1=0,\\;4x+ky+5=0 \\;\\Rightarrow\\; k=6',zh:'2x+3y+1=0,\\;4x+ky+5=0 \\;\\Rightarrow\\; k=6'},
        desc:{ko:'첫 직선의 x,y 계수 비율은 2:3. 둘째 직선도 같은 비율이어야 하니 4:k=2:3 — 4가 2의 2배이니 k도 3의 2배인 <b>6</b>이에요.',
              en:'The first line\'s x,y ratio is 2:3. The second must match: 4:k=2:3 — since 4 is 2\'s double, k must be 3\'s double, <b>6</b>.',
              zh:'第一条直线x、y的比是2:3。第二条也要相同：4:k=2:3——4是2的2倍，k也要是3的2倍，即<b>6</b>。'},
        mathSteps:['\\frac{2}{3}=\\frac{4}{k}', '2k=12', 'k=6'],
        result:{ko:'평행하려면 x,y의 계수 비율이 완전히 같아야 해요!',en:'For parallel lines, the x,y coefficient ratios must match exactly!',zh:'平行时x、y的系数比必须完全相同！'},
        book:{ko:'Ax+By+C=0과 A′x+B′y+C′=0이 평행 ⟺ A:B=A′:B′(같은 직선이 아닌 경우).',
              en:'Ax+By+C=0 and A′x+B′y+C′=0 are parallel ⟺ A:B=A′:B′ (when they aren\'t the same line).',
              zh:'Ax+By+C=0与A′x+B′y+C′=0平行 ⟺ A:B=A′:B′(不是同一条直线时)。'} },

      { tag:{ko:'② 수직: 계수를 엇갈려 곱해 더하면 0',en:'2) Perpendicular: cross-multiply and sum to 0',zh:'② 垂直：交叉相乘之和为0'},
        head:{ko:'3x+2y+1=0,\\;kx-6y+4=0 \\;\\Rightarrow\\; k=4',en:'3x+2y+1=0,\\;kx-6y+4=0 \\;\\Rightarrow\\; k=4',zh:'3x+2y+1=0,\\;kx-6y+4=0 \\;\\Rightarrow\\; k=4'},
        desc:{ko:'수직 조건은 Ak+BD=0. 여기선 3×k+2×(-6)=0 → 3k=12 → k=<b>4</b>. 기울기로 확인하면 -3/2와 -k/(-6)=k/6의 곱이 -1이 되는 것과 같아요.',
              en:'The perpendicular condition is Ak+BD=0. Here: 3×k+2×(-6)=0 → 3k=12 → k=<b>4</b>. Checking via slopes, this matches -3/2 times k/6 equaling -1.',
              zh:'垂直条件是Ak+BD=0。这里：3×k+2×(-6)=0 → 3k=12 → k=<b>4</b>。用斜率验证，就是-3/2乘以k/6等于-1。'},
        mathSteps:['3k+2\\times(-6)=0', '3k=12', 'k=4'],
        result:{ko:'수직 조건은 계수를 엇갈려 곱해 더하면 0이 되는 것!',en:'The perpendicular condition: cross-multiply the coefficients and the sum is 0!',zh:'垂直条件：系数交叉相乘之和为0！'},
        book:{ko:'Ax+By+C=0과 A′x+B′y+C′=0이 수직 ⟺ AA′+BB′=0 — 기울기의 곱이 -1이라는 것과 같은 뜻이에요.',
              en:'Ax+By+C=0 and A′x+B′y+C′=0 are perpendicular ⟺ AA′+BB′=0 — the same as the slopes multiplying to -1.',
              zh:'Ax+By+C=0与A′x+B′y+C′=0垂直 ⟺ AA′+BB′=0——和斜率之积为-1是同一回事。'} }
    ],
    rule:{ ko:'① 평행: A:B=A′:B′(계수 비율이 같다)  ② 수직: AA′+BB′=0(계수를 엇갈려 곱해 더하면 0)',
      en:'① Parallel: A:B=A′:B′ (matching coefficient ratios)  ② Perpendicular: AA′+BB′=0 (cross-multiplied sum is 0)',
      zh:'① 平行：A:B=A′:B′(系数比相同)  ② 垂直：AA′+BB′=0(交叉相乘之和为0)' }
  },

  check:{
    fills:[
      { tex:'x+2y+3=0, \\;\\; kx+4y+1=0 \\;\\Rightarrow\\; k = \\square', answer:2,
        hint:{ ko:'1:2=k:4', en:'1:2=k:4', zh:'1:2=k:4' } },
      { tex:'2x+y+5=0, \\;\\; kx-4y+2=0 \\;\\Rightarrow\\; k = \\square', answer:2,
        hint:{ ko:'2k+1×(-4)=0', en:'2k+1×(-4)=0', zh:'2k+1×(-4)=0' } }
    ],
    open:{ ko:'3x-y+2=0과 kx+3y-1=0이 평행할 때 k를 구하는 과정을 설명해봐요.',
      en:'Explain how to find k when 3x-y+2=0 and kx+3y-1=0 are parallel.',
      zh:'说说求3x-y+2=0与kx+3y-1=0平行时k的过程。' },
    openHint:{ ko:'3:(-1)=k:3 → 3×3=(-1)×k → k=-9',
      en:'3:(-1)=k:3 → 3×3=(-1)×k → k=-9',
      zh:'3:(-1)=k:3 → 3×3=(-1)×k → k=-9' }
  },

  lab:{
    generator:'md34_parallelPerp', level:'main', count:4,
    params:{mode:'perpendicular'},
    intro:{
      ko:'이번엔 수직! 계수를 엇갈려 곱해서 더하면 0이 되도록 만들어봐.',
      en:'Perpendicular this time! Cross-multiply the coefficients so the sum is 0.',
      zh:'这次是垂直！让系数交叉相乘之和为0。'
    }
  },

  arena:{
    generator:'md34_parallelPerp', level:'main', count:8, timeLimit:300,
    params:{mode:'mixed'},
    rule:{ ko:'5분 안에 평행·수직이 섞인 문제를 모두 풀어요!', en:'Solve all the mixed parallel/perpendicular problems in 5 minutes!', zh:'5分钟内解答所有平行·垂直混合题！' }
  },

  stamp:{ label:{ ko:'방향 감별사', en:'Direction Detective', zh:'方向鉴定师' }, coins:49 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'계수만 보고 방향을 정확히 읽었구나! 🧭',en:'You read the direction perfectly just from the coefficients!',zh:'只看系数就读准了方向！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'평행은 계수 비율이 같아야 해(A:B=A′:B′)!',en:'Parallel needs matching coefficient ratios (A:B=A′:B′)!',zh:'平行要系数比相同(A:B=A′:B′)！'}, {ko:'수직은 계수를 엇갈려 곱해 더하면 0이 돼야 해!',en:'Perpendicular needs the cross-multiplied sum to be 0!',zh:'垂直要交叉相乘之和为0！'} ],
    finish:{ ko:'완벽해! 방향 감별사! 🧭✨', en:'Perfect! Direction Detective!', zh:'完美！方向鉴定师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
