/* Numbers of Magic — 유닛 M-46: 다항함수의 적분 (고등 W14 · 미적분Ⅰ 접선과 적분) — §13 기호 전환: ∫ 첫 등장 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-46'] = {
  id:'M-46', tier:'calculus1', level:'43', order:2,
  generator:'md46_polyIntegral',
  title:{ ko:'다항함수의 적분', en:'Integrating Polynomials', zh:'多项式函数的积分' },
  subtitle:{ ko:'미분을 거꾸로 되돌리는 새 기호, ∫', en:'∫ — the symbol that undoes differentiation', zh:'把求导反过来的新符号——∫' },
  icon:'🪣',
  symbols:[
    { sym:'∫', read:'인테그랄', translate:'구간을 잘게 쪼개 다 더해라(미분의 반대 방향)',
      birth:'라이프니츠(1675)가 합(summa)의 첫 글자 S를 길게 늘여 만든 글자예요.' }
  ],

  practice:{
    generator:'md46_polyIntegral', level:'practice', count:5,
    params:{mode:'decode'},
    intro:{
      ko:'아직 계산하지 않아도 돼! ∫[1,4] f(x)dx 같은 식에서 구간의 시작·끝·폭 중 하나만 읽어봐.',
      en:'No calculation yet! Just read the start, end, or width of the interval in an expression like ∫[1,4] f(x)dx.',
      zh:'先不用计算！只读出像∫[1,4] f(x)dx这样式子里区间的起点、终点或宽度中的一个。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'미분은 f(x)에서 f\'(x)를 만들었어요. 그럼 <b>거꾸로</b> f\'(x)만 알 때 원래 f(x)를 되찾을 수 있을까요? 그리고 울퉁불퉁한 곡선 아래 넓이는 어떻게 구할까요 — 답이 같은 기호에서 나와요. 바로 <b>∫</b>예요.',
        en:'Differentiation turns f(x) into f\'(x). Can we go <b>backward</b> — recover f(x) knowing only f\'(x)? And how do we find the area under a bumpy curve? Both answers come from the same symbol: <b>∫</b>.',
        zh:'求导把f(x)变成了f\'(x)。那能不能<b>反过来</b>——只知道f\'(x)就找回原来的f(x)呢？还有，凹凸不平的曲线下方的面积该怎么求？两个答案都来自同一个符号——<b>∫</b>。' },
      history:{ ko:'라이프니츠는 1675년에 "합(summa)"이라는 라틴어의 첫 글자 S를 위아래로 길게 늘여 <b>∫</b> 모양을 만들었어요. "잘게 쪼갠 조각들을 다 더한다"는 뜻을 글자 모양에 그대로 담은 거예요.',
        en:'In 1675, Leibniz stretched the letter S — the first letter of the Latin word "summa" (sum) — into the tall shape <b>∫</b>. The letter\'s shape itself carries the meaning "add up all the tiny pieces."',
        zh:'1675年，莱布尼茨把拉丁语"summa"(总和)的首字母S拉长，做成了细长的<b>∫</b>形状。字母的形状本身就承载着"把细小的碎片全部加起来"的含义。' }
    },
    stages:[
      { tag:{ko:'① ∫는 미분을 거꾸로 — 부정적분',en:'1) ∫ undoes differentiation — the antiderivative',zh:'① ∫是求导的逆过程——不定积分'},
        head:{ko:'\\int 6x\\,dx = 3x^2 + C',en:'\\int 6x\\,dx = 3x^2 + C',zh:'\\int 6x\\,dx = 3x^2 + C'},
        desc:{ko:'앞서 3x²을 미분하면 6x가 됐죠? ∫는 그 <b>반대 방향</b>이에요 — 6x를 적분하면 다시 3x²이 나와요. 그런데 3x²+1, 3x²+7도 미분하면 똑같이 6x가 되니, "어떤 상수인지는 알 수 없다"는 뜻으로 <b>+C</b>(적분상수)를 꼭 붙여요.',
              en:'Earlier, differentiating 3x² gave 6x. ∫ goes the <b>opposite way</b> — integrating 6x gives back 3x². But 3x²+1 and 3x²+7 also differentiate to 6x, so we always attach <b>+C</b> (the constant of integration) to say "we can\'t know which constant it was."',
              zh:'前面对3x²求导得到了6x。∫走的是<b>反方向</b>——对6x积分又得回3x²。但3x²+1和3x²+7求导后也都是6x，所以一定要加上<b>+C</b>(积分常数)，表示"不知道具体是哪个常数"。'},
        mathSteps:['3x^2 \\xrightarrow{\\text{미분}} 6x', '6x \\xrightarrow{\\int} 3x^2+C'],
        result:{ko:'∫는 미분의 반대 — 계수를 (n+1)로 나누고 지수를 하나 늘려요!',en:'∫ reverses differentiation — divide the coefficient by (n+1) and raise the exponent by one!',zh:'∫是求导的逆过程——系数除以(n+1)，指数加1！'},
        book:{ko:'∫axⁿdx = (a÷(n+1))xⁿ⁺¹ + C — 미분 규칙 naxⁿ⁻¹을 거꾸로 뒤집은 것뿐이에요.',
              en:'∫ax^n dx = (a÷(n+1))x^(n+1) + C — simply the differentiation rule n·a·x^(n-1) run in reverse.',
              zh:'∫ax^n dx = (a÷(n+1))x^(n+1) + C——只是把求导法则n·a·x^(n-1)反过来而已。'} },

      { tag:{ko:'② 정적분은 구간의 넓이 — F(끝)-F(처음)',en:'2) A definite integral is an area — F(end)-F(start)',zh:'② 定积分是面积——F(终点)-F(起点)'},
        head:{ko:'\\int_{1}^{3} 6x\\,dx = F(3)-F(1) = 27-3=24',en:'\\int_{1}^{3} 6x\\,dx = F(3)-F(1) = 27-3=24',zh:'\\int_{1}^{3} 6x\\,dx = F(3)-F(1) = 27-3=24'},
        desc:{ko:'∫ 아래 1, 위 3은 "1부터 3까지의 구간"을 뜻해요. 원시함수 F(x)=3x²를 구한 뒤, F(3)-F(1)=27-3=24를 계산해요. +C는 뺄셈에서 저절로 사라지니 정적분에는 붙이지 않아요.',
              en:'The 1 below and 3 above ∫ mean "the interval from 1 to 3." Find the antiderivative F(x)=3x², then compute F(3)-F(1)=27-3=24. The +C cancels itself out in the subtraction, so it\'s never written for a definite integral.',
              zh:'∫下方的1和上方的3表示"从1到3的区间"。求出原函数F(x)=3x²后，计算F(3)-F(1)=27-3=24。+C在相减时会自动消掉，所以定积分不用写+C。'},
        mathSteps:['F(x)=3x^2', 'F(3)=27,\\;F(1)=3', '27-3=24'],
        result:{ko:'정적분은 원시함수 F로 F(끝)-F(처음)을 계산해요!',en:'A definite integral is F(end)-F(start) using the antiderivative F!',zh:'定积分是用原函数F计算F(终点)-F(起点)！'},
        book:{ko:'구간을 무한히 잘게 쪼갠 좁은 직사각형들의 넓이를 다 더한 것이 정적분의 원래 뜻이에요 — ∫라는 글자 모양(길게 늘인 S) 그대로예요.',
              en:'A definite integral is originally the sum of infinitely many, infinitesimally thin rectangles\' areas across the interval — exactly what the stretched-S shape of ∫ suggests.',
              zh:'定积分最初的含义就是把区间无限细分成窄矩形，再把它们的面积全部加起来——正如∫这个拉长的S形状所暗示的那样。'} }
    ],
    rule:{ ko:'∫axⁿdx = (a÷(n+1))xⁿ⁺¹ + C(부정적분, 미분의 반대). 정적분 ∫[p,q]f(x)dx = F(q)-F(p)(구간의 넓이).',
      en:'∫ax^n dx = (a÷(n+1))x^(n+1) + C (an antiderivative, reversing differentiation). A definite integral ∫[p,q]f(x)dx = F(q)-F(p) (an area over the interval).',
      zh:'∫ax^n dx = (a÷(n+1))x^(n+1) + C(不定积分，求导的逆过程)。定积分∫[p,q]f(x)dx = F(q)-F(p)(区间上的面积)。' }
  },

  check:{
    fills:[
      { tex:'\\int 4x\\,dx = \\square x^2 + C', answer:2,
        hint:{ ko:'4÷2=2', en:'4÷2=2', zh:'4÷2=2' } },
      { tex:'\\int_{0}^{2} 3x^2\\,dx = \\square', answer:8,
        hint:{ ko:'F(x)=x³, F(2)-F(0)=8-0=8', en:'F(x)=x³, F(2)-F(0)=8-0=8', zh:'F(x)=x³，F(2)-F(0)=8-0=8' } }
    ],
    open:{ ko:'∫[0,2] 6x dx의 값을 원시함수를 이용해 설명해봐요.',
      en:'Explain the value of ∫[0,2] 6x dx using the antiderivative.',
      zh:'用原函数说说∫[0,2] 6x dx的值。' },
    openHint:{ ko:'F(x)=3x², F(2)-F(0)=12-0=12',
      en:'F(x)=3x², F(2)-F(0)=12-0=12',
      zh:'F(x)=3x²，F(2)-F(0)=12-0=12' }
  },

  lab:{
    generator:'md46_polyIntegral', level:'main', count:4,
    params:{mode:'antiderivative',deg2:true},
    intro:{
      ko:'이번엔 이차식의 부정적분! 계수 3개를 순서대로 구해봐.',
      en:'The antiderivative of a quadratic this time! Find all three coefficients in order.',
      zh:'这次是二次式的不定积分！按顺序求出三个系数。'
    }
  },

  arena:{
    generator:'md46_polyIntegral', level:'main', count:8, timeLimit:300,
    params:{mode:'definiteInt',wide:true},
    rule:{ ko:'5분 안에 정적분 값을 모두 구해요!', en:'Find all the definite integral values in 5 minutes!', zh:'5分钟内求出所有定积分的值！' }
  },

  stamp:{ label:{ ko:'적분 수집가', en:'Integral Collector', zh:'积分收藏家' }, coins:60 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'미분을 거꾸로 되돌리는 걸 정확히 해냈구나! 🪣',en:'You reversed differentiation perfectly!',zh:'你完美地把求导反了过来！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'∫axⁿdx는 계수를 (n+1)로 나누고 지수를 하나 늘려!',en:'For ∫ax^n dx, divide the coefficient by (n+1) and raise the exponent by one!',zh:'∫ax^n dx要把系数除以(n+1)，指数加1！'}, {ko:'정적분은 F(끝값)-F(처음값)이야!',en:'A definite integral is F(end)-F(start)!',zh:'定积分是F(终点)-F(起点)！'} ],
    finish:{ ko:'완벽해! 적분 수집가! 🪣✨', en:'Perfect! Integral Collector!', zh:'完美！积分收藏家！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
