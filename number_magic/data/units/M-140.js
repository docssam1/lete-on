/* Numbers of Magic — 유닛 M-140: 일반각과 호도법 (고등 대수 · 과정 62, 2026-09-29)
   근거: docs/high-build-spec.md MD140. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-140'] = {
  id:'M-140', tier:'algebra', level:'62', order:140,
  generator:'md140_radian',
  title:{ ko:'일반각과 호도법', en:'General Angles & Radians', zh:'任意角与弧度制' },
  subtitle:{ ko:'한 바퀴를 넘어 도는 각, 반지름으로 재는 각', en:'Angles beyond one turn, measured by the radius', zh:'超过一圈的角，用半径度量的角' },
  icon:'🧭',

  practice:{
    generator:'md140_radian', level:'practice', count:6,
    params:{mode:'convert'},
    intro:{
      ko:'180°=π 를 기억합니다. 도에 π/180 을 곱하면 라디안, 라디안에 180°/π 를 곱하면 도가 됩니다.',
      en:'Remember 180°=π. Multiply degrees by π/180 to get radians, and radians by 180°/π to get degrees.',
      zh:'记住180°=π。角度乘π/180得弧度，弧度乘180°/π得角度。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'시곗바늘은 한 바퀴를 돌고도 계속 돕니다. 그래서 각도 360° 를 넘을 수 있고, 거꾸로 돌면 음의 각이 됩니다. 반지름과 같은 길이의 호가 만드는 각을 1 라디안으로 정하면 각을 길이처럼 다룰 수 있습니다.',
        en:'A clock hand keeps turning after a full circle, so angles can go past 360°, and turning backwards gives negative angles. Defining 1 radian as the angle of an arc as long as the radius lets us treat angles like lengths.',
        zh:'钟表指针转完一圈还会继续转，所以角可以超过360°，反向转就是负角。把与半径等长的弧所对的角定为1弧度，就能像处理长度一样处理角。' },
      history:{ ko:'라디안(radian)이라는 이름은 1873년 영국의 제임스 톰슨이 시험 문제에서 처음 쓴 것으로 알려져 있습니다.',
        en:'The name "radian" is known to have first appeared in 1873, in examination questions set by James Thomson in Britain.',
        zh:'"弧度(radian)"这个名称据知于1873年由英国的詹姆斯·汤姆森首先用在考试题中。' }
    },
    stages:[
      { tag:{ko:'① 도 → 라디안',en:'1) Degrees → radians',zh:'① 角度 → 弧度'},
        head:{ko:'150^\\circ=150\\times\\frac{\\pi}{180}=\\frac{5}{6}\\pi',en:'150^\\circ=150\\times\\frac{\\pi}{180}=\\frac{5}{6}\\pi',zh:'150^\\circ=150\\times\\frac{\\pi}{180}=\\frac{5}{6}\\pi'},
        desc:{ko:'150/180 을 약분하면 5/6 이므로 150°=<b>5π/6</b> 입니다. 거꾸로 5π/6×180°/π=150° 입니다.',
              en:'150/180 reduces to 5/6, so 150°=<b>5π/6</b>. Conversely 5π/6×180°/π=150°.',
              zh:'150/180约分得5/6，所以150°=<b>5π/6</b>。反过来5π/6×180°/π=150°。'},
        mathSteps:['\\frac{150}{180}=\\frac{5}{6}','150^\\circ=\\frac{5}{6}\\pi'],
        result:{ko:'180° 와 π 는 같은 크기!',en:'180° and π are the same size!',zh:'180°与π一样大！'},
        book:{ko:'π/6=30°, π/4=45°, π/3=60°, π/2=90° 는 자주 쓰므로 외워 둡니다.',
              en:'π/6=30°, π/4=45°, π/3=60° and π/2=90° come up often, so memorise them.',
              zh:'π/6=30°、π/4=45°、π/3=60°、π/2=90°经常用到，要记住。'} },

      { tag:{ko:'② 일반각과 사분면',en:'2) General angles and quadrants',zh:'② 一般角与象限'},
        head:{ko:'780^\\circ=360^\\circ\\times2+60^\\circ',en:'780^\\circ=360^\\circ\\times2+60^\\circ',zh:'780^\\circ=360^\\circ\\times2+60^\\circ'},
        desc:{ko:'780° 는 두 바퀴를 돌고 60° 더 돈 각이므로 동경은 60° 와 같고 <b>제1사분면</b>에 있습니다.',
              en:'780° is two full turns plus 60°, so its terminal side is that of 60°, in <b>quadrant 1</b>.',
              zh:'780°是转两圈后再转60°，终边与60°相同，在<b>第一象限</b>。'},
        mathSteps:['780=360\\times2+60','0^\\circ<60^\\circ<90^\\circ'],
        result:{ko:'바퀴 수를 빼고 남은 각을 보기!',en:'Remove full turns and look at what is left!',zh:'去掉整圈看剩下的角！'},
        book:{ko:'−300° 는 360°×(−1)+60° 이므로 이것도 제1사분면의 각입니다.',
              en:'−300° is 360°×(−1)+60°, so it is also in quadrant 1.',
              zh:'−300°=360°×(−1)+60°，所以也是第一象限的角。'} },

      { tag:{ko:'③ 동경이 같은 각',en:'3) Same terminal side',zh:'③ 终边相同的角'},
        head:{ko:'-420^\\circ=360^\\circ\\times(-2)+300^\\circ',en:'-420^\\circ=360^\\circ\\times(-2)+300^\\circ',zh:'-420^\\circ=360^\\circ\\times(-2)+300^\\circ'},
        desc:{ko:'α 는 0° 이상 360° 미만이어야 하므로 n=−2, α=<b>300°</b> 입니다. n=−1 로 하면 α=−60° 가 되어 범위를 벗어납니다.',
              en:'α must be at least 0° and less than 360°, so n=−2 and α=<b>300°</b>. Taking n=−1 would give α=−60°, outside the range.',
              zh:'α必须不小于0°且小于360°，所以n=−2，α=<b>300°</b>。若取n=−1，α=−60°，超出范围。'},
        mathSteps:['-420+720=300','\\alpha=300^\\circ'],
        result:{ko:'음의 각은 360° 를 더해 올리기!',en:'Add 360° to lift negative angles!',zh:'负角加360°往上调！'},
        book:{ko:'라디안이면 2π 씩 더하거나 뺍니다. 17π/6=2π+5π/6 이므로 17π/6 과 5π/6 은 동경이 같습니다.',
              en:'In radians add or subtract 2π: 17π/6=2π+5π/6, so 17π/6 and 5π/6 share a terminal side.',
              zh:'弧度制就加减2π：17π/6=2π+5π/6，所以17π/6与5π/6终边相同。'} }
    ],
    rule:{ ko:'① 도×π/180=라디안, 라디안×180°/π=도  ② 360°×n+α 로 고쳐 α 의 사분면 보기  ③ α 는 0° 이상 360° 미만(0 이상 2π 미만)',
      en:'① degrees×π/180=radians, radians×180°/π=degrees  ② Write 360°×n+α and look at the quadrant of α  ③ α is from 0° up to 360° (0 up to 2π)',
      zh:'① 角度×π/180=弧度，弧度×180°/π=角度  ② 写成360°×n+α看α所在象限  ③ α不小于0°且小于360°(0到2π)' }
  },

  check:{
    fills:[
      { tex:{ko:'210^\\circ=\\frac{\\square}{6}\\pi',en:'210^\\circ=\\frac{\\square}{6}\\pi',zh:'210^\\circ=\\frac{\\square}{6}\\pi'}, answer:7,
        hint:{ ko:'210÷30', en:'210÷30', zh:'210÷30' } },
      { tex:{ko:'\\frac{3}{4}\\pi=\\square^\\circ',en:'\\frac{3}{4}\\pi=\\square^\\circ',zh:'\\frac{3}{4}\\pi=\\square^\\circ'}, answer:135,
        hint:{ ko:'3×45°', en:'3×45°', zh:'3×45°' } }
    ],
    open:{ ko:'반지름이 달라도 1 라디안의 크기가 언제나 같은 까닭을 설명해 봅니다.',
      en:'Explain why 1 radian is the same angle whatever the radius.',
      zh:'说说为什么无论半径多大，1弧度的大小总是相同。' },
    openHint:{ ko:'한 원에서 호의 길이는 중심각에 비례합니다. 반지름이 2 배가 되면 둘레도 2 배가 되어, 반지름과 같은 길이의 호가 만드는 중심각은 달라지지 않습니다.',
      en:'In a circle, arc length is proportional to the central angle. Doubling the radius doubles the circumference, so the angle of an arc equal to the radius stays the same.',
      zh:'在同一个圆中，弧长与圆心角成正比。半径变为2倍时周长也变为2倍，所以与半径等长的弧所对的圆心角不变。' }
  },

  lab:{
    generator:'md140_radian', level:'main', count:6,
    params:{mode:'quad'},
    intro:{
      ko:'각을 360°×n+α(라디안이면 2π×n+α) 로 고쳐 α 가 어느 사분면에 있는지 번호로 답합니다.',
      en:'Rewrite the angle as 360°×n+α (2π×n+α in radians) and answer with the number of the quadrant containing α.',
      zh:'把角写成360°×n+α(弧度为2π×n+α)，用序号回答α所在的象限。'
    }
  },

  arena:{
    generator:'md140_radian', level:'main', count:6, timeLimit:420,
    params:{mode:'coterm'},
    rule:{ ko:'7분 안에 동경이 같은 각을 모두 찾습니다!', en:'Find every angle with the same terminal side within 7 minutes!', zh:'7分钟内找出所有终边相同的角！' }
  },

  stamp:{ label:{ ko:'바퀴 셈꾼', en:'Turn Counter', zh:'圈数计算师' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'바퀴 수를 정확히 셌어! 🧭',en:'Turns counted exactly!',zh:'圈数数得很准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'180°=π 를 떠올려 봐!',en:'Remember 180°=π!',zh:'想想180°=π！'}, {ko:'α 는 0° 이상 360° 미만이야!',en:'α is from 0° up to 360°!',zh:'α不小于0°且小于360°！'} ],
    finish:{ ko:'완벽해! 바퀴 셈꾼! 🧭✨', en:'Perfect! Turn Counter!', zh:'完美！圈数计算师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
