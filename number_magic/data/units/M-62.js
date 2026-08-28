/* Numbers of Magic — 유닛 M-62: 속도와 거리 활용 (미적분Ⅰ W14 심화, 2026-08-27) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-62'] = {
  id:'M-62', tier:'calculus1', level:'45', order:5,
  generator:'md62_velocityDistance',
  title:{ ko:'속도와 거리 활용', en:'Velocity & Distance Applications', zh:'速度与距离应用' },
  subtitle:{ ko:'위치를 미분하면 속도, 속도를 적분하면 거리', en:'Differentiate position to get velocity; integrate velocity to get distance', zh:'位置求导得速度，速度积分得距离' },
  icon:'🚗',

  practice:{
    generator:'md62_velocityDistance', level:'practice', count:5,
    params:{mode:'velocity'},
    intro:{
      ko:'위치함수 s(t)를 미분하면 속도 s\'(t)가 돼요 — MD44에서 배운 미분을 그대로 "속도"라는 이름으로 써요!',
      en:'Differentiating the position function s(t) gives velocity s\'(t) — the same derivative skill from MD44, now applied under the name "velocity"!',
      zh:'位置函数s(t)求导就是速度s\'(t)——MD44学的求导，换个名字叫"速度"用！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'자동차의 위치를 시간의 함수 s(t)로 나타낼 수 있어요. 그럼 "지금 이 순간의 속도"는 위치가 얼마나 빠르게 변하는지를 뜻하니, 바로 <b>s(t)의 도함수</b> s\'(t)예요! 미분이 "속도계" 역할을 하는 거예요.',
        en:'A car\'s position can be written as a function of time, s(t). Then "the speed right now" means how fast the position is changing — which is exactly <b>the derivative of s(t)</b>, s\'(t)! The derivative acts as a "speedometer".',
        zh:'汽车的位置可以写成时间的函数s(t)。那么"此刻的速度"就是位置变化的快慢——正是<b>s(t)的导数</b>s\'(t)！求导起到了"速度计"的作用。' },
      history:{ ko:'뉴턴이 미분을 발명한 이유가 바로 이거예요 — 행성의 위치가 시시각각 바뀌는데 "그 순간의 속도"를 구하고 싶었어요. 그래서 미적분학은 원래 "운동을 다루는 수학"으로 탄생했어요.',
        en:'This is exactly why Newton invented calculus — he wanted to find "the speed at that instant" as a planet\'s position kept changing moment by moment. So calculus was originally born as "the mathematics of motion".',
        zh:'这正是牛顿发明微积分的原因——行星的位置每时每刻都在变化，他想求出"那一刻的速度"。所以微积分最初正是作为"研究运动的数学"而诞生的。' }
    },
    stages:[
      { tag:{ko:'① 위치를 미분하면 속도',en:'1) Differentiating position gives velocity',zh:'① 位置求导得速度'},
        head:{ko:"s(t)=t^2+3t \\;\\Rightarrow\\; s'(2) = 7",en:"s(t)=t^2+3t \\;\\Rightarrow\\; s'(2) = 7",zh:"s(t)=t^2+3t \\;\\Rightarrow\\; s'(2) = 7"},
        desc:{ko:"s(t)=t²+3t를 미분하면 s'(t)=2t+3이에요. t=2일 때 속도는 2(2)+3=<b>7</b> — 이건 MD44에서 배운 도함수 계산과 똑같아요, 이름만 '속도'로 바뀐 거예요.",
              en:"Differentiating s(t)=t²+3t gives s'(t)=2t+3. At t=2, the velocity is 2(2)+3=<b>7</b> — this is exactly the same derivative calculation from MD44, just relabeled as 'velocity'.",
              zh:"对s(t)=t²+3t求导得s'(t)=2t+3。t=2时速度是2(2)+3=<b>7</b>——这和MD44学的导数计算完全一样，只是改叫'速度'。"},
        mathSteps:["s'(t)=2t+3", '2(2)+3', '=7'],
        result:{ko:'속도 = 위치함수를 미분한 도함수!',en:'Velocity = the derivative of the position function!',zh:'速度 = 位置函数的导数！'},
        book:{ko:'속도가 양수면 앞으로, 음수면 뒤로 움직이고 있다는 뜻이에요.',
              en:'A positive velocity means moving forward; a negative one means moving backward.',
              zh:'速度为正表示向前移动，为负表示向后移动。'} },

      { tag:{ko:'② 속도를 적분하면 이동 거리',en:'2) Integrating velocity gives distance',zh:'② 速度积分得移动距离'},
        head:{ko:'v(t)=4t+2 \\;\\Rightarrow\\; \\int_{0}^{3} v(t)\\,dt = 24',en:'v(t)=4t+2 \\;\\Rightarrow\\; \\int_{0}^{3} v(t)\\,dt = 24',zh:'v(t)=4t+2 \\;\\Rightarrow\\; \\int_{0}^{3} v(t)\\,dt = 24'},
        desc:{ko:'미분의 반대인 <b>적분</b>을 쓰면, 속도로부터 거꾸로 이동 거리를 구할 수 있어요(MD46의 정적분 그대로). 원시함수 S(t)=2t²+2t, S(3)-S(0)=(18+6)-0=24.',
              en:'Using <b>integration</b>, the reverse of differentiation, you can work backward from velocity to find distance traveled (exactly MD46\'s definite integral). Antiderivative S(t)=2t²+2t, S(3)-S(0)=(18+6)-0=24.',
              zh:'用求导的反运算<b>积分</b>，能从速度反推出移动的距离(和MD46的定积分完全一样)。原函数S(t)=2t²+2t，S(3)-S(0)=(18+6)-0=24。'},
        mathSteps:['S(t)=2t^2+2t', 'S(3)=18+6=24', 'S(0)=0'],
        result:{ko:'이동 거리 = 속도를 적분한 값(v(t)가 0 이상일 때)!',en:'Distance traveled = the integral of velocity (when v(t)≥0)!',zh:'移动距离 = 速度的积分(当v(t)≥0时)！'},
        book:{ko:'속도가 도중에 음수가 되면(뒤로 갈 때) "이동 거리"와 "위치 변화량"이 달라져요 — 이 유닛은 속도가 항상 0 이상인 경우만 다뤄요.',
              en:'If velocity turns negative partway (moving backward), "distance traveled" and "change in position" differ — this unit only covers cases where velocity stays nonnegative.',
              zh:'如果速度中途变负(向后移动)，"移动距离"和"位置变化量"就不同了——本单元只处理速度始终不小于0的情形。'} }
    ],
    rule:{ ko:'속도 = 위치함수의 도함수 s\'(t). 이동 거리 = 속도를 적분한 값(v(t)≥0일 때는 위치 변화량과 같아요)!',
      en:'Velocity = the derivative of the position function, s\'(t). Distance traveled = the integral of velocity (equal to the change in position when v(t)≥0)!',
      zh:'速度 = 位置函数的导数s\'(t)。移动距离 = 速度的积分(v(t)≥0时等于位置变化量)！' }
  },

  check:{
    fills:[
      { tex:"s(t)=t^2+5t \\;\\Rightarrow\\; s'(3) = \\square", answer:11,
        hint:{ ko:"s'(t)=2t+5, t=3이면 6+5", en:"s'(t)=2t+5, at t=3 that's 6+5", zh:"s'(t)=2t+5，t=3时是6+5" } },
      { tex:'v(t)=2t+4 \\;\\Rightarrow\\; \\int_{0}^{2} v(t)\\,dt = \\square', answer:12,
        hint:{ ko:'S(t)=t²+4t, S(2)-S(0)=12-0', en:'S(t)=t²+4t, S(2)-S(0)=12-0', zh:'S(t)=t²+4t, S(2)-S(0)=12-0' } }
    ],
    open:{ ko:'v(t)=6t+2일 때 t=0부터 t=3까지 이동 거리를 구하는 과정을 설명해봐요.',
      en:'Explain how to find the distance traveled from t=0 to t=3 when v(t)=6t+2.',
      zh:'说说v(t)=6t+2时，从t=0到t=3移动距离的求法。' },
    openHint:{ ko:'S(t)=3t²+2t, S(3)-S(0)=(27+6)-0=33',
      en:'S(t)=3t²+2t, S(3)-S(0)=(27+6)-0=33',
      zh:'S(t)=3t²+2t，S(3)-S(0)=(27+6)-0=33' }
  },

  lab:{
    generator:'md62_velocityDistance', level:'main', count:4,
    params:{mode:'distance',wide:true},
    intro:{
      ko:'속도를 0부터 T까지 적분하면 이동 거리가 나와요!',
      en:'Integrating velocity from 0 to T gives the distance traveled!',
      zh:'速度从0积分到T就得到移动距离！'
    }
  },

  arena:{
    generator:'md62_velocityDistance', level:'main', count:8, timeLimit:300,
    params:{mode:'wide'},
    rule:{ ko:'5분 안에 구간 [t1,t2]의 이동 거리까지 모두 구해요!', en:'Find the distance over the interval [t1,t2], all within 5 minutes!', zh:'5分钟内求出区间[t1,t2]的移动距离！' }
  },

  stamp:{ label:{ ko:'경로 추적사', en:'Path Tracker', zh:'路径追踪师' }, coins:78 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'속도와 거리를 미분·적분으로 완벽하게 이었구나! 🚗',en:'You connected velocity and distance perfectly with differentiation and integration!',zh:'你用求导·积分完美连接了速度和距离！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:"위치함수를 미분하면 속도야 — s'(t)를 구해봐!",en:"Differentiating position gives velocity — find s'(t)!",zh:"位置函数求导就是速度——求出s'(t)！"}, {ko:'속도를 적분하면 이동 거리야!',en:'Integrating velocity gives the distance traveled!',zh:'速度积分就是移动距离！'} ],
    finish:{ ko:'완벽해! 경로 추적사! 🚗✨', en:'Perfect! Path Tracker!', zh:'完美！路径追踪师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
