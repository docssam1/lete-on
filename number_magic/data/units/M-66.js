/* Numbers of Magic — 유닛 M-66: 이차방정식 풀이 (중3 W10 · 중등 교과 연산 3차 2026-09-20)
   표기 주의: 이 파일의 tex 는 KaTeX 간격 명령으로 `\quad` 만 쓴다(mid9.js 상단 주석 참조). */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-66'] = {
  id:'M-66', tier:'middle3', level:'36', order:7,
  generator:'md66_quadEquation',
  title:{ ko:'이차방정식 풀이', en:'Solving Quadratic Equations', zh:'一元二次方程的解法' },
  subtitle:{ ko:'곱해서 0이 되려면 둘 중 하나는 0이어야 해요', en:'For a product to be zero, one of the factors must be zero', zh:'乘积要等于0，两个因式中必有一个是0' },
  icon:'🎯',

  practice:{
    generator:'md66_quadEquation', level:'practice', count:5,
    params:{mode:'factor'},
    intro:{
      ko:'인수분해한 다음, 각 괄호를 0으로 만드는 x를 찾으면 돼요 — 작은 수부터 적어요!',
      en:'Factor it, then find the x that makes each bracket zero — write the smaller one first!',
      zh:'先因式分解，再找出使每个括号为0的x——先写较小的那个！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'두 수를 곱해서 0이 나왔어요. 그럼 두 수 중 적어도 하나는 반드시 0이에요 — 5×7도, 0.001×0.001도 절대 0이 될 수 없으니까요. 너무 당연해 보이는 이 사실 하나가 이차방정식을 푸는 열쇠예요.',
        en:'Two numbers multiply to zero. Then at least one of them must be zero — five times seven cannot give zero, and neither can a tiny decimal times a tiny decimal. This fact looks too obvious to matter, and yet it is the whole key to solving quadratics.',
        zh:'两个数相乘得0，那么其中至少有一个必定是0——5×7不可能是0，0.001×0.001也不可能。这个看起来理所当然的事实，正是解一元二次方程的钥匙。' },
      history:{ ko:'이차방정식은 4000년 전 바빌로니아 점토판에도 있어요. 다만 그때는 음수를 수로 치지 않아 답이 하나뿐이었고, 문제도 "넓이가 이만큼인 밭의 변의 길이"처럼 늘 양수로 나오게 만들어져 있었어요. 두 근을 모두 인정하게 된 건 훨씬 나중 일이에요.',
        en:'Quadratic equations appear on Babylonian clay tablets four thousand years ago. Back then negatives were not counted as numbers, so each problem had a single answer, and the problems themselves — the side of a field with a given area — were always built to come out positive. Accepting both roots came much later.',
        zh:'一元二次方程4000年前就出现在巴比伦的泥板上。不过那时负数还不算数，所以每题只有一个答案，题目("面积为多少的田地的边长")也总是设计成得正数。承认两个根是很久以后的事。' }
    },
    stages:[
      { tag:{ko:'① 곱해서 0이면 둘 중 하나가 0',en:'1) A product of zero means one factor is zero',zh:'① 乘积为0就有一个因式为0'},
        head:{ko:'x^2 - 5x + 6 = 0 \\quad\\Rightarrow\\quad x = 2, \\; 3',en:'x^2 - 5x + 6 = 0 \\quad\\Rightarrow\\quad x = 2, \\; 3',zh:'x^2 - 5x + 6 = 0 \\quad\\Rightarrow\\quad x = 2, \\; 3'},
        desc:{ko:'더해서 −5, 곱해서 6이 되는 두 수는 −2와 −3이에요. 그래서 (x−2)(x−3)=0. 두 괄호의 곱이 0이니 <b>둘 중 하나는 0</b>이고, 그때의 x가 2와 3이에요.',
              en:'The two numbers that add to −5 and multiply to 6 are −2 and −3, so the equation factors into two brackets. Since their product is zero, <b>one of them must be zero</b> — which happens at x=2 and x=3.',
              zh:'相加得−5、相乘得6的两个数是−2和−3，所以式子是(x−2)(x−3)=0。两个括号的乘积为0，<b>其中必有一个为0</b>，对应的x就是2和3。'},
        mathSteps:['(x - 2)(x - 3) = 0',
                   {ko:'x - 2 = 0 \\quad\\text{또는}\\quad x - 3 = 0',en:'x - 2 = 0 \\quad\\text{or}\\quad x - 3 = 0',zh:'x - 2 = 0 \\quad\\text{或}\\quad x - 3 = 0'},
                   {ko:'x = 2 \\quad\\text{또는}\\quad x = 3',en:'x = 2 \\quad\\text{or}\\quad x = 3',zh:'x = 2 \\quad\\text{或}\\quad x = 3'}],
        result:{ko:'이차방정식의 근은 보통 두 개예요!',en:'A quadratic usually has two roots!',zh:'一元二次方程通常有两个根！'},
        book:{ko:'인수분해에서 식을 쪼개는 것까지 했다면, 여기서는 그 쪼갠 식을 <b>=0으로 놓고 읽는</b> 한 걸음만 더 가는 거예요. 두 근이 같아질 때(중근)도 있어요 — (x−3)²=0이면 근은 3 하나뿐이에요.',
              en:'Factoring got you as far as splitting the expression; here you take one more step and <b>read it with the equation set to zero</b>. The two roots can coincide: a perfect square has just one repeated root.',
              zh:'因式分解做到了把式子拆开，这里只多走一步——<b>令它等于0再读出来</b>。两根也可能相同：(x−3)²=0只有一个根3(重根)。'} },

      { tag:{ko:'② 인수분해가 안 되면 완전제곱꼴로',en:'2) When it will not factor, complete the square',zh:'② 不能因式分解时就配方'},
        head:{ko:'x^2 + 6x + 2 = 0 \\quad\\Rightarrow\\quad (x + 3)^2 = 7',en:'x^2 + 6x + 2 = 0 \\quad\\Rightarrow\\quad (x + 3)^2 = 7',zh:'x^2 + 6x + 2 = 0 \\quad\\Rightarrow\\quad (x + 3)^2 = 7'},
        desc:{ko:'더해서 6, 곱해서 2가 되는 정수는 없어요. 그럴 땐 x의 계수 6의 <b>절반인 3을 제곱</b>해 9를 더하고 다시 빼요. x²+6x+9는 (x+3)²이니 (x+3)²=9−2=7이 돼요.',
              en:'No pair of integers adds to 6 and multiplies to 2. So take <b>half of six and square it</b> to get nine, then add and subtract it. The first three terms become a perfect square, and the equation turns into a square equal to 7.',
              zh:'没有整数相加得6、相乘得2。这时就把x的系数6<b>取一半再平方</b>得9，加上又减去。因为x²+6x+9就是(x+3)²，式子变成(x+3)²=9−2=7。'},
        mathSteps:['x^2 + 6x + 9 = 9 - 2', '(x + 3)^2 = 7', 'x = -3 \\pm \\sqrt{7}'],
        result:{ko:'제곱꼴로 만들면 제곱근으로 바로 풀려요!',en:'Once it is a perfect square, a square root finishes it!',zh:'变成平方的形式后，开平方就能解出来！'},
        book:{ko:'이 방법을 ax²+bx+c=0에 그대로 해 보면 바로 <b>근의 공식</b>이 나와요. 근의 공식은 외워야 하는 새 규칙이 아니라, 완전제곱을 문자로 한 번 해 둔 결과예요.',
              en:'Run this same method on the general form and out comes the <b>quadratic formula</b>. The formula is not a new rule to memorise — it is completing the square, done once with letters.',
              zh:'把这个方法原样用在一般的ax²+bx+c=0上，就直接得出<b>求根公式</b>。公式不是要背的新规则，而是用字母把配方做了一遍的结果。'} }
    ],
    rule:{ ko:'곱해서 0이면 둘 중 하나가 0 — 인수분해해서 근을 읽고, 안 되면 완전제곱꼴로 고쳐요!',
      en:'A product of zero means one factor is zero — factor and read off the roots, or complete the square when it will not factor!',
      zh:'乘积为0就说明有一个因式为0——因式分解后读出根，不能分解就配方！' }
  },

  check:{
    fills:[
      { tex:{ko:'(x - 4)(x + 1) = 0 \\quad\\Rightarrow\\quad \\text{큰 근 } x = \\square',
             en:'(x - 4)(x + 1) = 0 \\quad\\Rightarrow\\quad \\text{larger root } x = \\square',
             zh:'(x - 4)(x + 1) = 0 \\quad\\Rightarrow\\quad \\text{较大的根 } x = \\square'}, answer:4,
        hint:{ ko:'각 괄호를 0으로 만드는 x는 4와 −1', en:'The brackets are zero at x=4 and x=−1', zh:'使括号为0的x是4和−1' } },
      { tex:{ko:'x^2 - 7x + 12 = 0 \\quad\\Rightarrow\\quad \\text{작은 근 } x = \\square',
             en:'x^2 - 7x + 12 = 0 \\quad\\Rightarrow\\quad \\text{smaller root } x = \\square',
             zh:'x^2 - 7x + 12 = 0 \\quad\\Rightarrow\\quad \\text{较小的根 } x = \\square'}, answer:3,
        hint:{ ko:'더해서 7, 곱해서 12인 두 수는 3과 4', en:'3 and 4 add to 7 and multiply to 12', zh:'相加得7、相乘得12的是3和4' } }
    ],
    open:{ ko:'x²+2x−8=0을 인수분해로 푸는 과정을 말해봐요.',
      en:'Explain how to solve x²+2x−8=0 by factoring.',
      zh:'说说怎样用因式分解解x²+2x−8=0。' },
    openHint:{ ko:'(x+4)(x−2)=0 → x=−4 또는 2',
      en:'(x+4)(x−2)=0 → x=−4 or 2',
      zh:'(x+4)(x−2)=0 → x=−4或2' }
  },

  lab:{
    generator:'md66_quadEquation', level:'main', count:4,
    params:{mode:'completeSquare',wide:true},
    intro:{
      ko:'x의 계수의 절반을 제곱해서 더하고 빼면 (x+□)²=□ 꼴이 돼요!',
      en:'Halve the coefficient of x, square it, add and subtract — and you reach a square equal to a number!',
      zh:'把x的系数取一半再平方，加上又减去，就变成(x+□)²=□的形式！'
    }
  },

  arena:{
    generator:'md66_quadEquation', level:'main', count:8, timeLimit:360,
    params:{mode:'leadCoef',wide:true},
    rule:{ ko:'6분 안에 공통인수를 묶어내고 두 근을 모두 찾아요!', en:'Within 6 minutes, pull out the common factor and find both roots!', zh:'6分钟内提取公因数并找出两个根！' }
  },

  stamp:{ label:{ ko:'두 근의 사냥꾼', en:'Hunter of Two Roots', zh:'双根猎手' }, coins:54 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'두 근을 모두 정확히 찾았어! 🎯',en:'You found both roots exactly!',zh:'两个根都找得准准的！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'괄호가 (x−2)면 근은 −2가 아니라 2야!',en:'If the bracket is (x−2) the root is 2, not −2!',zh:'括号是(x−2)时，根是2而不是−2！'}, {ko:'더해서 b, 곱해서 c가 되는 두 수를 찾아봐!',en:'Look for two numbers that add to b and multiply to c!',zh:'找相加得b、相乘得c的两个数！'} ],
    finish:{ ko:'완벽해! 두 근의 사냥꾼! 🎯✨', en:'Perfect! Hunter of Two Roots!', zh:'完美！双根猎手！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
