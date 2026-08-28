/* Numbers of Magic — 유닛 M-43: 함수의 극한값 계산 (고등 W14 · 미적분Ⅰ 극한과 미분) — §13 기호 전환: lim 첫 등장 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-43'] = {
  id:'M-43', tier:'calculus1', level:'42', order:1,
  generator:'md43_limit',
  title:{ ko:'함수의 극한값 계산', en:'Evaluating Limits', zh:'函数极限值的计算' },
  subtitle:{ ko:'x가 다가갈 때 식이 어디로 향하는지 알아봐요', en:'Find where an expression heads as x approaches a value', zh:'看看当x靠近某个值时式子会趋向哪里' },
  icon:'🧭',
  symbols:[
    { sym:'lim', read:'리미트', translate:'x가 그 값에 한없이 가까워질 때 식이 어디로 다가가는지',
      birth:'"한계(limit)"의 준말이에요. 화살표(→)로 "가까워진다"를 표시하는 지금의 표기는 20세기 초에 정착됐어요.' }
  ],

  practice:{
    generator:'md43_limit', level:'practice', count:5,
    params:{mode:'decode'},
    intro:{
      ko:'아직 계산하지 않아도 돼! lim(x→3) 같은 식에서 화살표 오른쪽 수만 읽어봐.',
      en:'No calculation yet! Just read the number to the right of the arrow in an expression like lim(x→3).',
      zh:'先不用计算！只读出像lim(x→3)这样式子里箭头右边的数字。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'f(x)=(x²-4)/(x-2)에 x=2를 넣으면 0/0이 돼서 계산할 수가 없어요. 그런데 x=1.9, 1.99, 1.999…처럼 2에 아주 가까운 수를 넣으면 어떤 값에 점점 다가갈까요? "딱 그 값은 아니지만 한없이 가까이 갈 때"를 나타내는 기호가 필요해요 — 그게 <b>lim</b>이에요.',
        en:'Plugging x=2 into f(x)=(x²-4)/(x-2) gives 0/0, which can\'t be computed. But if you plug in numbers very close to 2, like x=1.9, 1.99, 1.999…, what value do they approach? We need a symbol for "not exactly that value, but endlessly close to it" — that\'s <b>lim</b>.',
        zh:'把x=2代入f(x)=(x²-4)/(x-2)会得到0/0，无法计算。但如果代入非常接近2的数，比如x=1.9、1.99、1.999…，会越来越靠近哪个值呢？我们需要一个符号来表示"不是那个值本身，但无限接近它"——那就是<b>lim</b>。' },
      history:{ ko:'lim은 "한계(limit)"라는 영어 단어를 줄인 거예요. "가까워진다"는 뜻의 화살표(→) 표기는 여러 수학자들이 조금씩 다듬다가 20세기 초에 지금 모습으로 자리 잡았어요.',
        en:'lim is short for the English word "limit." The arrow (→) notation for "approaches" was refined by several mathematicians and settled into its current form in the early 20th century.',
        zh:'lim是英语单词"limit"(极限)的缩写。表示"趋近于"的箭头(→)记法经过多位数学家的打磨，在20世纪初定型为现在的样子。' }
    },
    stages:[
      { tag:{ko:'① 다항식은 그냥 대입하면 끝',en:'1) For polynomials, just substitute',zh:'① 多项式直接代入就行'},
        head:{ko:'\\lim_{x\\to 3} (2x+1) = 7',en:'\\lim_{x\\to 3} (2x+1) = 7',zh:'\\lim_{x\\to 3} (2x+1) = 7'},
        desc:{ko:'다항식은 <b>끊어지는 지점이 없어요</b>(연속함수). 그래서 x가 3에 가까워질 때 2x+1이 어디로 가는지는, 그냥 x=3을 넣어보면 알 수 있어요: 2×3+1=7. "한없이 가까워지는 값"과 "그 값을 직접 대입한 값"이 다항식에서는 항상 같아요.',
              en:'A polynomial has <b>no breaks</b> (it\'s continuous). So to see where 2x+1 heads as x approaches 3, you can simply plug in x=3: 2×3+1=7. For polynomials, "the value it endlessly approaches" and "the value from direct substitution" are always the same.',
              zh:'多项式<b>没有断点</b>(连续函数)。所以要看当x接近3时2x+1趋向哪里，直接代入x=3即可：2×3+1=7。对多项式来说，"无限接近的值"和"直接代入得到的值"永远相同。'},
        mathSteps:['x\\to3', '2(3)+1', '=7'],
        result:{ko:'다항식은 x=a를 그대로 대입하면 극한값!',en:'For a polynomial, substituting x=a directly gives the limit!',zh:'多项式直接代入x=a就是极限值！'},
        book:{ko:'연속함수는 lim(x→a) f(x) = f(a)가 항상 성립해요 — 극한값과 함숫값이 일치한다는 뜻이에요.',
              en:'For a continuous function, lim(x→a) f(x) = f(a) always holds — the limit equals the function value.',
              zh:'连续函数总有lim(x→a) f(x) = f(a)——极限值和函数值相等。'} },

      { tag:{ko:'② 0/0 꼴은 인수분해로 뚫어요',en:'2) Break through a 0/0 form by factoring',zh:'② 0/0型用因式分解突破'},
        head:{ko:'\\lim_{x\\to 2} \\dfrac{x^2-4}{x-2} = 4',en:'\\lim_{x\\to 2} \\dfrac{x^2-4}{x-2} = 4',zh:'\\lim_{x\\to 2} \\dfrac{x^2-4}{x-2} = 4'},
        desc:{ko:'x=2를 그대로 넣으면 0/0이 돼서 막혀요. 그런데 분자 x²-4=(x-2)(x+2)로 인수분해하면 분모 (x-2)와 <b>약분</b>할 수 있어요. 남는 건 (x+2)뿐이고, 여기에 x=2를 넣으면 4 — 막혔던 길이 뚫려요.',
              en:'Plugging x=2 directly gives 0/0 — a dead end. But factoring the numerator as x²-4=(x-2)(x+2) lets you <b>cancel</b> with the denominator (x-2). What\'s left is just (x+2); plugging in x=2 gives 4 — the blocked path opens up.',
              zh:'直接代入x=2会得到0/0，走不通。但把分子因式分解成x²-4=(x-2)(x+2)后，就能和分母(x-2)<b>约分</b>。剩下的只有(x+2)，代入x=2得到4——堵住的路就通了。'},
        mathSteps:['x^2-4=(x-2)(x+2)', '\\dfrac{(x-2)(x+2)}{x-2}=x+2', '2+2=4'],
        result:{ko:'0/0이면 인수분해해서 같은 인수를 약분해요!',en:'For a 0/0 form, factor and cancel the matching factor!',zh:'0/0型就因式分解，约去相同的因式！'},
        book:{ko:'약분은 x=2 그 자리에서는 원래 정의되지 않지만, "그 근처에서" 무슨 일이 일어나는지는 알려줘요 — 그게 극한의 힘이에요.',
              en:'The cancellation isn\'t defined exactly at x=2, but it tells you what happens "near" that point — that\'s the power of a limit.',
              zh:'约分在x=2这一点本身并没有定义，但它告诉你"附近"发生了什么——这就是极限的力量。'} }
    ],
    rule:{ ko:'lim(x→a) f(x)는 "x가 a에 한없이 가까워질 때 f(x)가 다가가는 값". 다항식은 그대로 대입, 0/0 꼴은 인수분해 후 약분!',
      en:'lim(x→a) f(x) is "the value f(x) approaches as x endlessly nears a." Substitute directly for polynomials; factor and cancel for a 0/0 form!',
      zh:'lim(x→a) f(x)是"当x无限接近a时f(x)趋向的值"。多项式直接代入，0/0型先因式分解再约分！' }
  },

  check:{
    fills:[
      { tex:'\\lim_{x\\to 4} (3x-5) = \\square', answer:7,
        hint:{ ko:'3×4-5=7', en:'3×4-5=7', zh:'3×4-5=7' } },
      { tex:'\\lim_{x\\to 1} \\dfrac{x^2-1}{x-1} = \\square', answer:2,
        hint:{ ko:'x²-1=(x-1)(x+1), 약분하면 x+1, x=1이면 2', en:'x²-1=(x-1)(x+1), cancel to x+1, then x=1 gives 2', zh:'x²-1=(x-1)(x+1)，约分后是x+1，x=1时为2' } }
    ],
    open:{ ko:'lim(x→3) (x²-9)/(x-3)의 값을 인수분해 과정과 함께 설명해봐요.',
      en:'Explain lim(x→3) (x²-9)/(x-3), including the factoring step.',
      zh:'说说lim(x→3) (x²-9)/(x-3)的值，包括因式分解的过程。' },
    openHint:{ ko:'x²-9=(x-3)(x+3), 약분하면 x+3, x=3이면 6',
      en:'x²-9=(x-3)(x+3), cancel to x+3, then x=3 gives 6',
      zh:'x²-9=(x-3)(x+3)，约分后是x+3，x=3时为6' }
  },

  lab:{
    generator:'md43_limit', level:'main', count:4,
    params:{mode:'factorCancel'},
    intro:{
      ko:'0/0 꼴이 나오면 당황하지 말고 인수분해부터! 분모와 같은 인수를 찾아 약분해봐.',
      en:'Don\'t panic at a 0/0 form — factor first! Find the factor matching the denominator and cancel it.',
      zh:'遇到0/0型别慌，先因式分解！找出和分母相同的因式约掉。'
    }
  },

  arena:{
    generator:'md43_limit', level:'main', count:8, timeLimit:300,
    params:{mode:'factorCancel',wide:true},
    rule:{ ko:'5분 안에 더 큰 범위의 극한값을 모두 구해요!', en:'Find all the wider-range limits in 5 minutes!', zh:'5分钟内求出所有更大范围的极限值！' }
  },

  stamp:{ label:{ ko:'극한 항해사', en:'Limit Navigator', zh:'极限航海家' }, coins:56 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'0/0의 막힌 길을 인수분해로 뚫었구나! 🧭',en:'You broke through the 0/0 dead end with factoring!',zh:'你用因式分解打通了0/0的死路！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'다항식은 x=a를 그대로 대입하면 돼!',en:'For polynomials, just substitute x=a directly!',zh:'多项式直接代入x=a就行！'}, {ko:'0/0이면 분자를 인수분해해서 분모와 약분해!',en:'For 0/0, factor the numerator and cancel with the denominator!',zh:'遇到0/0，把分子因式分解后和分母约分！'} ],
    finish:{ ko:'완벽해! 극한 항해사! 🧭✨', en:'Perfect! Limit Navigator!', zh:'完美！极限航海家！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
