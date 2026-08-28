/* Numbers of Magic — 유닛 M-35: 원의 방정식 (고등 W12 · 공통수학2 도형의 방정식) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-35'] = {
  id:'M-35', tier:'highmath2', level:'39', order:35,
  generator:'md35_circleEquation',
  title:{ ko:'원의 방정식', en:'The Equation of a Circle', zh:'圆的方程' },
  subtitle:{ ko:'x항·y항을 완전제곱으로 묶으면 중심과 반지름이 보여요', en:'Complete the square on x and y to reveal the center and radius', zh:'把x、y项配成完全平方，中心和半径就显现出来' },
  icon:'⭕',

  practice:{
    generator:'md35_circleEquation', level:'practice', count:5,
    params:{mode:'basic'},
    intro:{
      ko:'x²+y²-4x-6y+9=0을 (x-2)²+(y-3)²=4로 바꾸면, 중심(2,3)·반지름 2인 원이라는 게 한눈에 보여요.',
      en:'Rewrite x²+y²-4x-6y+9=0 as (x-2)²+(y-3)²=4, and it\'s instantly clear: center (2,3), radius 2.',
      zh:'把x²+y²-4x-6y+9=0改写成(x-2)²+(y-3)²=4，一眼就能看出：中心(2,3)，半径2。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'x²+y²-4x-6y+9=0 같은 식이 원이라는 건 어떻게 알까요? 중심과 반지름은 어디에 숨어 있을까요?',
        en:'How do you know an equation like x²+y²-4x-6y+9=0 is a circle? Where are the center and radius hiding?',
        zh:'像x²+y²-4x-6y+9=0这样的式子，怎么知道它是个圆？中心和半径又藏在哪里？' },
      history:{ ko:'원은 원래 (x-a)²+(y-b)²=r² — 중심에서 거리가 항상 r인 점들의 모임이에요(MD31 거리 공식 그대로). 이걸 전개하면 x²+y²+Ax+By+C=0 꼴이 되니, 거꾸로 완전제곱식으로 묶으면 중심과 반지름이 다시 드러나요.',
        en:'A circle is originally (x-a)²+(y-b)²=r² — the set of points always at distance r from the center (exactly the distance formula from MD31). Expanding it gives x²+y²+Ax+By+C=0, so working backward by completing the square reveals the center and radius again.',
        zh:'圆本来就是(x-a)²+(y-b)²=r²——到中心距离恒为r的点的集合(正是MD31的距离公式)。展开后变成x²+y²+Ax+By+C=0，所以反过来配方就能重新显现出中心和半径。' }
    },
    stages:[
      { tag:{ko:'① x항·y항을 각각 완전제곱으로',en:'1) Complete the square on x and y separately',zh:'① x项、y项分别配成完全平方'},
        head:{ko:'x^2+y^2-4x-6y+9=0 \\;\\Rightarrow\\; (x-2)^2+(y-3)^2=4',en:'x^2+y^2-4x-6y+9=0 \\;\\Rightarrow\\; (x-2)^2+(y-3)^2=4',zh:'x^2+y^2-4x-6y+9=0 \\;\\Rightarrow\\; (x-2)^2+(y-3)^2=4'},
        desc:{ko:'-4x는 -2×2×x니까 (x-2)²=x²-4x+4의 일부. -6y는 -2×3×y니까 (y-3)²=y²-6y+9의 일부. 더해준 4,9와 원래 상수 9를 맞추면 <b>(x-2)²+(y-3)²=4</b>.',
              en:'-4x is -2×2×x, part of (x-2)²=x²-4x+4. -6y is -2×3×y, part of (y-3)²=y²-6y+9. Balancing the added 4, 9 against the original constant 9 gives <b>(x-2)²+(y-3)²=4</b>.',
              zh:'-4x是-2×2×x，是(x-2)²=x²-4x+4的一部分。-6y是-2×3×y，是(y-3)²=y²-6y+9的一部分。把补上的4、9和原常数9配平，得<b>(x-2)²+(y-3)²=4</b>。'},
        mathSteps:['(x^2-4x+4)+(y^2-6y+9)=-9+4+9', '(x-2)^2+(y-3)^2=4'],
        result:{ko:'완전제곱으로 묶으면 중심(2,3), 반지름 2가 바로 보여요!',en:'Complete the square and the center (2,3) and radius 2 appear directly!',zh:'配方后中心(2,3)、半径2直接显现！'},
        book:{ko:'(x-a)²+(y-b)²=r²이 원의 표준형 — 중심(a,b), 반지름 r.',
              en:'(x-a)²+(y-b)²=r² is the standard form — center (a,b), radius r.',
              zh:'(x-a)²+(y-b)²=r²是圆的标准式——中心(a,b)，半径r。'} },

      { tag:{ko:'② 공통계수가 있으면 먼저 나누기',en:'2) Divide out a common coefficient first',zh:'② 有公共系数先除掉'},
        head:{ko:'2x^2+2y^2-8x-12y+18=0 \\;\\Rightarrow\\; (x-2)^2+(y-3)^2=4',en:'2x^2+2y^2-8x-12y+18=0 \\;\\Rightarrow\\; (x-2)^2+(y-3)^2=4',zh:'2x^2+2y^2-8x-12y+18=0 \\;\\Rightarrow\\; (x-2)^2+(y-3)^2=4'},
        desc:{ko:'모든 항이 2의 배수예요. 전체를 2로 나누면 앞서 본 x²+y²-4x-6y+9=0으로 돌아가고, 그 다음은 똑같이 완전제곱으로 묶으면 돼요.',
              en:'Every term is a multiple of 2. Dividing the whole equation by 2 returns exactly to x²+y²-4x-6y+9=0 from before, then complete the square the same way.',
              zh:'每一项都是2的倍数。整式除以2，正好回到前面的x²+y²-4x-6y+9=0，接下来同样配方即可。'},
        mathSteps:['\\div 2:\\;x^2+y^2-4x-6y+9=0', '(x-2)^2+(y-3)^2=4'],
        result:{ko:'x²,y² 앞의 공통계수는 먼저 나눠서 없애요!',en:'Divide out any common coefficient in front of x², y² first!',zh:'先除掉x²、y²前的公共系数！'},
        book:{ko:'x²,y²의 계수가 같은 수 m이면 mx²+my²+Ax+By+C=0을 m으로 나눈 뒤 완전제곱을 진행해요.',
              en:'When x² and y² share coefficient m, divide mx²+my²+Ax+By+C=0 by m first, then complete the square.',
              zh:'x²、y²系数都是m时，先把mx²+my²+Ax+By+C=0除以m，再配方。'} }
    ],
    rule:{ ko:'① x항·y항을 각각 완전제곱으로 묶으면 (x-a)²+(y-b)²=r² — 중심(a,b), 반지름 r  ② 공통계수가 있으면 먼저 나누기',
      en:'① Complete the square on x and y to get (x-a)²+(y-b)²=r² — center (a,b), radius r  ② Divide out any common coefficient first',
      zh:'① x、y项各配成完全平方得(x-a)²+(y-b)²=r²——中心(a,b)，半径r  ② 有公共系数先除掉' }
  },

  check:{
    fills:[
      { tex:'x^2+y^2-6x+2y+6=0 \\;\\Rightarrow\\; (x-\\square)^2+(y-\\square)^2=\\square^2', answer:[3,-1,2],
        hint:{ ko:'중심(3,-1), 9+1-6=4=2²', en:'center (3,-1), 9+1-6=4=2²', zh:'中心(3,-1)，9+1-6=4=2²' } },
      { tex:'x^2+y^2+4x-2y-4=0 \\;\\Rightarrow\\; (x-\\square)^2+(y-\\square)^2=\\square^2', answer:[-2,1,3],
        hint:{ ko:'중심(-2,1), 4+1+4=9=3²', en:'center (-2,1), 4+1+4=9=3²', zh:'中心(-2,1)，4+1+4=9=3²' } }
    ],
    open:{ ko:'x²+y²-2x+4y-4=0을 표준형으로 바꾸는 과정을 설명해봐요.',
      en:'Explain how to rewrite x²+y²-2x+4y-4=0 in standard form.',
      zh:'说说把x²+y²-2x+4y-4=0改写成标准式的过程。' },
    openHint:{ ko:'(x-1)²+(y+2)²=4+1+4=9=3² → 중심(1,-2), 반지름 3',
      en:'(x-1)²+(y+2)²=4+1+4=9=3² → center (1,-2), radius 3',
      zh:'(x-1)²+(y+2)²=4+1+4=9=3² → 中心(1,-2)，半径3' }
  },

  lab:{
    generator:'md35_circleEquation', level:'main', count:4,
    params:{mode:'wide'},
    intro:{
      ko:'이번엔 더 큰 범위! 부호에 주의하며 완전제곱으로 묶어봐.',
      en:'Wider range this time! Watch the signs as you complete the square.',
      zh:'这次范围更大！注意符号，配方要仔细。'
    }
  },

  arena:{
    generator:'md35_circleEquation', level:'main', count:8, timeLimit:300,
    params:{mode:'leadingCoeff'},
    rule:{ ko:'5분 안에 공통계수가 있는 원의 방정식을 모두 풀어요! 먼저 나누는 걸 잊지 마요.', en:'Solve all the circle equations with a common coefficient in 5 minutes! Don\'t forget to divide first.', zh:'5分钟内解答所有带公共系数的圆方程！别忘了先除。' }
  },

  stamp:{ label:{ ko:'원의 설계자', en:'Circle Designer', zh:'圆的设计师' }, coins:51 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'완전제곱으로 정확히 묶었구나! ⭕',en:'You completed the square perfectly!',zh:'配方配得很准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'x항·y항을 각각 완전제곱으로 묶어봐!',en:'Complete the square on the x-terms and y-terms separately!',zh:'把x项、y项分别配成完全平方！'}, {ko:'x²,y² 앞에 공통계수가 있으면 먼저 나눠야 해!',en:'If x², y² share a coefficient, divide it out first!',zh:'x²、y²前有公共系数要先除掉！'} ],
    finish:{ ko:'완벽해! 원의 설계자! ⭕✨', en:'Perfect! Circle Designer!', zh:'完美！圆的设计师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
