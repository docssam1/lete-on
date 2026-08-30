/* Numbers of Magic — 유닛 M-57: 삼각함수의 최대·최소와 주기 (대수 W13 심화, 2026-08-27) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-57'] = {
  id:'M-57', tier:'algebra', level:'44', order:6,
  generator:'md57_trigMaxMinPeriod',
  title:{ ko:'삼각함수의 최대·최소와 주기', en:'Trig Max/Min & Period', zh:'三角函数的最大值·最小值与周期' },
  subtitle:{ ko:'진폭은 위아래로, 주기는 되풀이하는 간격', en:'Amplitude swings up and down; period is the repeating interval', zh:'振幅上下摆动，周期是重复的间隔' },
  icon:'🌊',
  symbols:[{sym:'π', read:'파이', translate:'원둘레와 지름의 비 — 삼각함수의 주기를 잴 때 "한 바퀴"의 단위로 써요', birth:'그리스 문자 π는 "둘레(perimetros)"의 첫 글자에서 왔고, 18세기 오일러가 원주율 기호로 널리 퍼뜨렸다'}],

  practice:{
    generator:'md57_trigMaxMinPeriod', level:'practice', count:5,
    params:{mode:'maxmin'},
    intro:{
      ko:'y=a·sin(bx)+c는 c를 중심으로 위아래로 a만큼 흔들려요 — 최댓값은 a+c, 최솟값은 c-a예요!',
      en:'y=a·sin(bx)+c swings a above and below c — the max is a+c and the min is c-a!',
      zh:'y=a·sin(bx)+c以c为中心上下摆动a——最大值是a+c，最小值是c-a！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'그네를 탈 때 가장 높이 올라갔다가 가장 낮게 내려오는 걸 반복하죠? 이걸 그래프로 그리면 sin·cos 곡선과 똑같은 모양이에요. 얼마나 높이 흔들리는지(진폭)와 한 번 왕복하는 데 얼마나 걸리는지(주기)가 궁금해져요.',
        en:'When you swing, you repeatedly go up to the highest point and down to the lowest, right? Graphing that motion looks exactly like a sin/cos curve. That makes you wonder: how high does it swing (amplitude), and how long is one full back-and-forth (period)?',
        zh:'荡秋千时，会反复荡到最高点又落到最低点，对吧？把这个动作画成图像，就和sin·cos曲线的形状一模一样。于是就会好奇：荡多高(振幅)，来回一次要多久(周期)？' },
      history:{ ko:'π(파이)는 원의 둘레와 지름의 비예요. sin·cos 곡선이 한 바퀴(360°) 돌아 처음 모양으로 되돌아오는 데 걸리는 x의 길이(주기)를 2π로 재는 건, 각도를 "호의 길이"로 재는 라디안 단위 덕분이에요.',
        en:'π (pi) is the ratio of a circle\'s circumference to its diameter. Measuring the sin/cos curve\'s period — the length of x it takes to return to its starting shape after one full turn (360°) — as 2π is thanks to the radian unit, which measures angles as arc length.',
        zh:'π(派)是圆的周长与直径之比。sin·cos曲线转一整圈(360°)回到原来形状所需的x长度(周期)之所以是2π，正是因为弧度制用弧长来量角度。' }
    },
    stages:[
      { tag:{ko:'① 최댓값=a+c, 최솟값=c-a',en:'1) Max = a+c, min = c-a',zh:'① 最大值=a+c，最小值=c-a'},
        head:{ko:'y=3\\sin(2x)+1 \\;\\Rightarrow\\; \\text{최댓값}=4,\\;\\text{최솟값}=-2',en:'y=3\\sin(2x)+1 \\;\\Rightarrow\\; \\text{max}=4,\\;\\text{min}=-2',zh:'y=3\\sin(2x)+1 \\;\\Rightarrow\\; \\text{最大值}=4,\\;\\text{最小值}=-2'},
        desc:{ko:'sin값은 항상 −1과 1 사이를 오가요. 그래서 3sin(2x)는 −3과 3 사이, 여기에 +1을 더하면 <b>중심이 1인 채로 위아래 3만큼</b> 흔들려요: 최댓값 1+3=4, 최솟값 1-3=−2.',
              en:'The sine value always ranges between −1 and 1. So 3sin(2x) ranges between −3 and 3; adding 1 shifts it to <b>swing 3 above and below a center of 1</b>: max is 1+3=4, min is 1-3=−2.',
              zh:'sin值总在−1到1之间。所以3sin(2x)在−3到3之间；加上1后就变成<b>以1为中心上下摆动3</b>：最大值1+3=4，最小值1-3=−2。'},
        mathSteps:['1+3=4', '1-3=-2', ''],
        result:{ko:'최댓값과 최솟값은 진폭(a)만큼 중심(c)에서 위아래로!',en:'The max and min swing above and below the center(c) by the amplitude(a)!',zh:'最大值最小值以振幅(a)在中心(c)上下摆动！'},
        book:{ko:'b(괄호 안 x의 계수)는 최댓값·최솟값에는 영향을 주지 않아요 — b는 오직 주기(속도)만 바꿔요.',
              en:'b (the coefficient of x inside the parentheses) doesn\'t affect the max/min — b only changes the period (the speed).',
              zh:'b(括号内x的系数)不影响最大最小值——b只改变周期(速度)。'} },

      { tag:{ko:'② 주기 = 2π÷b(sin·cos), π÷b(tan)',en:'2) Period = 2π÷b (sin/cos), π÷b (tan)',zh:'② 周期 = 2π÷b(sin·cos)，π÷b(tan)'},
        head:{ko:'y=\\sin(2x) \\;\\Rightarrow\\; \\text{주기}=\\pi',en:'y=\\sin(2x) \\;\\Rightarrow\\; \\text{period}=\\pi',zh:'y=\\sin(2x) \\;\\Rightarrow\\; \\text{周期}=\\pi'},
        desc:{ko:'sin(x)는 한 바퀴 도는 데 x가 2π만큼 필요해요. 그런데 sin(2x)는 x가 <b>2배 빠르게</b> 움직이니, 원래 걸리던 시간의 절반이면 충분해요: 2π÷2=π.',
              en:'sin(x) needs x to travel 2π to complete one cycle. But sin(2x) moves <b>twice as fast</b>, so it only needs half the usual distance: 2π÷2=π.',
              zh:'sin(x)转一圈需要x走2π。而sin(2x)的x<b>快了2倍</b>，只需要原来一半的距离：2π÷2=π。'},
        mathSteps:['2\\pi\\div 2', '=\\pi', ''],
        result:{ko:'b가 클수록 더 빨리 반복해서 주기는 짧아져요(2π÷b)!',en:'A bigger b repeats faster, so the period gets shorter (2π÷b)!',zh:'b越大重复得越快，周期就越短(2π÷b)！'},
        book:{ko:'tan은 sin·cos와 그래프 모양 자체가 달라서 반 바퀴(π)만 돌아도 같은 모양이 반복돼요 — 그래서 주기가 π÷b로, sin·cos의 절반 규칙과 달라요.',
              en:'tan\'s graph shape is fundamentally different from sin/cos, so it repeats after just half a turn (π) — that\'s why its period is π÷b, unlike the sin/cos halving rule.',
              zh:'tan的图像形状和sin·cos根本不同，转半圈(π)就重复了——所以周期是π÷b，和sin·cos的规则不同。'} }
    ],
    rule:{ ko:'최댓값=a+c, 최솟값=c-a(진폭이 중심에서 위아래로). 주기는 sin·cos가 2π÷b, tan은 π÷b — π의 몇 배인지 기약분수로 나타내요!',
      en:'Max = a+c, min = c-a (amplitude swings above/below the center). Period is 2π÷b for sin/cos, but π÷b for tan — express it as a reduced fraction of π!',
      zh:'最大值=a+c，最小值=c-a(振幅在中心上下摆动)。周期sin·cos是2π÷b，tan是π÷b——用最简分数表示是π的几倍！' }
  },

  check:{
    fills:[
      { tex:{ko:'y = 4\\sin(x) + 2 \\;\\Rightarrow\\; \\text{최댓값}=\\square,\\;\\text{최솟값}=\\square',en:'y = 4\\sin(x) + 2 \\;\\Rightarrow\\; \\text{max}=\\square,\\;\\text{min}=\\square',zh:'y = 4\\sin(x) + 2 \\;\\Rightarrow\\; \\text{最大值}=\\square,\\;\\text{最小值}=\\square'}, answer:[6,-2],
        hint:{ ko:'2+4, 2-4', en:'2+4, 2-4', zh:'2+4, 2-4' } },
      { tex:{ko:'y = \\cos(4x) \\;\\Rightarrow\\; \\text{주기} = \\dfrac{\\square}{\\square}\\pi',en:'y = \\cos(4x) \\;\\Rightarrow\\; \\text{period} = \\dfrac{\\square}{\\square}\\pi',zh:'y = \\cos(4x) \\;\\Rightarrow\\; \\text{周期} = \\dfrac{\\square}{\\square}\\pi'}, answer:[1,2],
        hint:{ ko:'2π÷4=(1/2)π', en:'2π÷4=(1/2)π', zh:'2π÷4=(1/2)π' } }
    ],
    open:{ ko:'y=tan(3x)의 주기를 sin·cos의 절반 규칙과 비교해서 설명해봐요.',
      en:'Explain the period of y=tan(3x), comparing it to the sin/cos halving rule.',
      zh:'把y=tan(3x)的周期和sin·cos的减半规则做对比，说说看。' },
    openHint:{ ko:'tan은 π÷3 — sin·cos였다면 2π÷3이었을 것을 절반만 필요해요',
      en:'For tan, it\'s π÷3 — if it were sin/cos, it would be 2π÷3, but tan only needs half',
      zh:'tan是π÷3——如果是sin·cos会是2π÷3，但tan只需要一半' }
  },

  lab:{
    generator:'md57_trigMaxMinPeriod', level:'main', count:4,
    params:{mode:'period',wide:true},
    intro:{
      ko:'주기는 2π를 b로 나눈 값 — 기약분수로 π의 몇 배인지 나타내요!',
      en:'The period is 2π divided by b — express it as a reduced fraction times π!',
      zh:'周期是2π除以b——用最简分数表示是π的几倍！'
    }
  },

  arena:{
    generator:'md57_trigMaxMinPeriod', level:'main', count:8, timeLimit:300,
    params:{mode:'wide'},
    rule:{ ko:'5분 안에 최대최소·주기·tan까지 섞어서 모두 풀어요!', en:'Solve a mix of max/min, period, and tan — all within 5 minutes!', zh:'5分钟内混合解出最大最小值·周期·tan！' }
  },

  stamp:{ label:{ ko:'파동 관측사', en:'Wave Observer', zh:'波动观测师' }, coins:68 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'진폭과 주기를 완벽하게 구분해서 찾았구나! 🌊',en:'You correctly told apart the amplitude and the period!',zh:'你准确分清了振幅和周期！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'최댓값은 a+c, 최솟값은 c-a야!',en:'The max is a+c, the min is c-a!',zh:'最大值是a+c，最小值是c-a！'}, {ko:'tan은 sin·cos와 달리 주기가 π÷b야!',en:'Unlike sin/cos, tan\'s period is π÷b!',zh:'和sin·cos不同，tan的周期是π÷b！'} ],
    finish:{ ko:'완벽해! 파동 관측사! 🌊✨', en:'Perfect! Wave Observer!', zh:'完美！波动观测师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
