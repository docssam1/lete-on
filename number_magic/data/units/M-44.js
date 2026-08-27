/* Numbers of Magic — 유닛 M-44: 미분계수와 도함수 (고등 W14 · 미적분Ⅰ 극한과 미분) — §13 기호 전환: f′, d/dx 첫 등장 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-44'] = {
  id:'M-44', tier:'calculus1', level:'42', order:2,
  generator:'md44_derivative',
  title:{ ko:'미분계수와 도함수', en:'Derivatives', zh:'导数与导函数' },
  subtitle:{ ko:'순간의 기울기를 구하는 새 기호, f′과 d/dx', en:'f′ and d/dx — new symbols for the instantaneous slope', zh:'求瞬时斜率的新符号——f′和d/dx' },
  icon:'⚡',
  symbols:[
    { sym:"f'", read:'프라임', translate:'x가 아주 조금 변할 때 y가 얼마나 변하는지의 비율(도함수)',
      birth:'라그랑주가 프라임 기호(′)로 도함수를 나타냈어요 — 짧고 빠르게 쓰려는 발명이에요.' },
    { sym:'d/dx', read:'디엑스분의디', translate:'x가 아주 조금 변할 때 y가 얼마나 변하는지의 비율(f′과 같은 뜻, 다른 표기)',
      birth:'라이프니츠(1670년대)가 만든 표기예요 — dx는 "아주 작은 x 조각", dy는 "그때 y가 변한 조각"이라는 뜻이에요.' }
  ],

  practice:{
    generator:'md44_derivative', level:'practice', count:5,
    params:{mode:'decode'},
    intro:{
      ko:'아직 계산하지 않아도 돼! f\'(3) 같은 식에서 괄호 안의 수만 읽어봐 — "어디서의 기울기냐"는 뜻이야.',
      en:'No calculation yet! Just read the number inside the parentheses in an expression like f\'(3) — it means "the slope at where?"',
      zh:'先不用计算！只读出像f\'(3)这样式子括号里的数——意思是"在哪里的斜率"。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'평균 속도(전체 거리÷전체 시간)는 알아요. 그런데 "바로 이 순간"의 속도는 어떻게 구할까요? 시간 간격을 점점 0에 가깝게 줄여가면(바로 앞 유닛의 lim!) "순간의 기울기"가 나와요 — 이걸 나타내는 두 가지 기호가 <b>f′</b>와 <b>d/dx</b>예요.',
        en:'You know average speed (total distance ÷ total time). But how do you find the speed at "this exact instant"? Shrinking the time interval closer and closer to 0 (using lim from the last unit!) gives the "instantaneous slope" — and there are two symbols for it, <b>f′</b> and <b>d/dx</b>.',
        zh:'你知道平均速度(总路程÷总时间)。但"这一瞬间"的速度该怎么求呢？把时间间隔不断缩小趋近于0(用上一单元的lim！)就得到了"瞬时斜率"——表示它的有两种符号，<b>f′</b>和<b>d/dx</b>。' },
      history:{ ko:'같은 것을 두 사람이 각자 다른 옷으로 표기했어요. 라이프니츠는 d(아주 작은 차이)로, 라그랑주는 프라임(′)으로 썼어요. 오늘날은 상황에 맞게 두 표기를 섞어 써요 — 같은 뜻, 다른 옷이에요.',
        en:'Two mathematicians dressed the same idea in different clothes. Leibniz wrote it with d (an infinitesimally small difference), and Lagrange with prime (′). Today both are used depending on the situation — same meaning, different outfits.',
        zh:'两位数学家给同一个概念穿上了不同的外衣。莱布尼茨用d(极小的差)来表示，拉格朗日用撇号(′)来表示。今天两种记法都会根据情况使用——同样的含义，不同的外衣。' }
    },
    stages:[
      { tag:{ko:'① 같은 것의 두 표기 — f′(x)와 d/dx',en:'1) Two notations for the same thing — f′(x) and d/dx',zh:'① 同一件事的两种写法——f′(x)和d/dx'},
        head:{ko:"f'(x) \\;\\;=\\;\\; \\dfrac{d}{dx}f(x)",en:"f'(x) \\;\\;=\\;\\; \\dfrac{d}{dx}f(x)",zh:"f'(x) \\;\\;=\\;\\; \\dfrac{d}{dx}f(x)"},
        desc:{ko:'왼쪽 f\'(x)(프라임)와 오른쪽 d/dx·f(x)(디엑스분의디)는 완전히 <b>같은 것</b>을 가리켜요 — "f(x)의 순간 기울기(도함수)"요. 라그랑주는 짧게 프라임(′)을, 라이프니츠는 "아주 작은 변화의 비율"이 보이도록 d/dx를 썼을 뿐이에요.',
              en:'The left side f\'(x) (prime) and the right side d/dx·f(x) (dee-y-dee-x) point to the exact <b>same thing</b> — "the instantaneous slope (derivative) of f(x)." Lagrange just wrote it short with a prime (′), while Leibniz wrote d/dx to make the "ratio of tiny changes" visible.',
              zh:'左边的f\'(x)(撇号)和右边的d/dx·f(x)(d y比d x)指的是完全<b>相同的东西</b>——"f(x)的瞬时斜率(导数)"。拉格朗日只是用撇号(′)简写，莱布尼茨用d/dx是为了让"极小变化的比率"看得见。'},
        mathSteps:["f'(x)", '=\\dfrac{d}{dx}f(x)', '\\text{(같은 뜻, 다른 옷)}'],
        result:{ko:'f′과 d/dx는 같은 뜻, 다른 표기예요!',en:'f′ and d/dx mean the same thing, written differently!',zh:'f′和d/dx意思相同，写法不同！'},
        book:{ko:'f\'(a)처럼 괄호에 숫자가 있으면 "그 점에서의 값"(미분계수), f\'(x)처럼 x가 있으면 "식 전체"(도함수)예요.',
              en:'When the parentheses hold a number, like f\'(a), it\'s "the value at that point" (a derivative value); when it holds x, like f\'(x), it\'s "the whole expression" (the derivative function).',
              zh:'括号里是数字时，如f\'(a)，是"该点的值"(导数值)；括号里是x时，如f\'(x)，是"整个式子"(导函数)。'} },

      { tag:{ko:'② axⁿ의 도함수는 naxⁿ⁻¹',en:'2) The derivative of ax^n is n·a·x^(n-1)',zh:'② ax^n的导数是n·a·x^(n-1)'},
        head:{ko:"f(x)=3x^2 \\;\\Rightarrow\\; f'(x)=6x,\\;\\; f'(2)=12",en:"f(x)=3x^2 \\;\\Rightarrow\\; f'(x)=6x,\\;\\; f'(2)=12",zh:"f(x)=3x^2 \\;\\Rightarrow\\; f'(x)=6x,\\;\\; f'(2)=12"},
        desc:{ko:'3x²을 미분할 땐 지수 2를 <b>앞으로 곱해 내리고</b>, 지수를 1 줄여요: 2×3=6, x²→x¹. 그래서 f\'(x)=6x. 여기에 x=2를 넣으면(미분계수) f\'(2)=12 — "x=2에서 곡선이 얼마나 가파른지"를 뜻해요.',
              en:'To differentiate 3x², bring the exponent 2 down as a <b>multiplier</b> and reduce it by 1: 2×3=6, x²→x¹. So f\'(x)=6x. Plugging in x=2 (a derivative value) gives f\'(2)=12 — "how steep the curve is at x=2."',
              zh:'对3x²求导时，把指数2<b>乘到前面</b>，再把指数减1：2×3=6，x²→x¹。所以f\'(x)=6x。代入x=2(导数值)得到f\'(2)=12——表示"曲线在x=2处有多陡"。'},
        mathSteps:['2\\times3=6', "f'(x)=6x", "f'(2)=6\\times2=12"],
        result:{ko:'지수를 앞으로 곱해 내리고 1 줄이면 도함수!',en:'Multiply the exponent down front, reduce it by 1 — that\'s the derivative!',zh:'把指数乘到前面再减1，就是导数！'},
        book:{ko:'상수항은 미분하면 사라져요(기울기가 0이니까) — f(x)=3x²+5의 도함수도 6x로 똑같아요.',
              en:'A constant term vanishes under differentiation (its slope is 0) — the derivative of f(x)=3x²+5 is still 6x.',
              zh:'常数项求导后会消失(因为它的斜率是0)——f(x)=3x²+5的导数也还是6x。'} }
    ],
    rule:{ ko:"axⁿ의 도함수는 naxⁿ⁻¹(지수를 앞으로 곱해 내리고 1 줄이기). f'(x)와 d/dx는 같은 뜻, 다른 표기예요.",
      en:'The derivative of ax^n is n·a·x^(n-1) — bring the exponent down and reduce it by 1. f\'(x) and d/dx mean the same thing.',
      zh:'ax^n的导数是n·a·x^(n-1)——把指数乘到前面再减1。f\'(x)和d/dx意思相同。' }
  },

  check:{
    fills:[
      { tex:"f(x)=4x^2 \\;\\Rightarrow\\; f'(x) = \\square x", answer:8,
        hint:{ ko:'2×4=8', en:'2×4=8', zh:'2×4=8' } },
      { tex:"f(x)=x^2+3x \\;\\Rightarrow\\; f'(1) = \\square", answer:5,
        hint:{ ko:"f'(x)=2x+3, x=1이면 2+3=5", en:"f'(x)=2x+3, so at x=1: 2+3=5", zh:"f'(x)=2x+3，x=1时2+3=5" } }
    ],
    open:{ ko:"f(x)=2x²-x의 도함수를 구하고, f'(3)의 값을 설명해봐요.",
      en:"Find the derivative of f(x)=2x²-x and explain the value of f'(3).",
      zh:"求f(x)=2x²-x的导数，并说说f'(3)的值。" },
    openHint:{ ko:"f'(x)=4x-1, f'(3)=12-1=11",
      en:"f'(x)=4x-1, f'(3)=12-1=11",
      zh:"f'(x)=4x-1，f'(3)=12-1=11" }
  },

  lab:{
    generator:'md44_derivative', level:'main', count:4,
    params:{mode:'polyPrime',cubic:true},
    intro:{
      ko:'이번엔 삼차함수! 각 항에 규칙을 하나씩 따로 적용해봐(3다칸).',
      en:'A cubic function this time! Apply the rule term by term (3 slots).',
      zh:'这次是三次函数！逐项分别应用法则(3格)。'
    }
  },

  arena:{
    generator:'md44_derivative', level:'main', count:8, timeLimit:300,
    params:{mode:'evalPrime',wide:true},
    rule:{ ko:'5분 안에 미분계수 f\'(x₀) 값을 모두 구해요!', en:'Find all the derivative values f\'(x₀) in 5 minutes!', zh:'5分钟内求出所有导数值f\'(x₀)！' }
  },

  stamp:{ label:{ ko:'순간 기울기 사냥꾼', en:'Instant-Slope Hunter', zh:'瞬时斜率猎手' }, coins:58 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'지수를 앞으로 곱해 내리는 규칙을 정확히 썼구나! ⚡',en:'You applied the "bring the exponent down" rule perfectly!',zh:'你准确运用了"把指数乘到前面"的法则！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'axⁿ의 도함수는 naxⁿ⁻¹이야 — 지수를 앞으로 곱해!',en:'The derivative of ax^n is n·a·x^(n-1) — multiply the exponent to the front!',zh:'ax^n的导数是n·a·x^(n-1)——把指数乘到前面！'}, {ko:'f\'(a)는 도함수를 구한 뒤 x=a를 대입한 값이야!',en:'f\'(a) is the derivative evaluated at x=a!',zh:'f\'(a)是求出导数后代入x=a的值！'} ],
    finish:{ ko:'완벽해! 순간 기울기 사냥꾼! ⚡✨', en:'Perfect! Instant-Slope Hunter!', zh:'完美！瞬时斜率猎手！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
