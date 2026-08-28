/* Numbers of Magic — 유닛 M-33: 직선의 방정식 (고등 W12 · 공통수학2 도형의 방정식) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-33'] = {
  id:'M-33', tier:'highmath2', level:'38', order:33,
  generator:'md33_lineEquation',
  title:{ ko:'직선의 방정식', en:'The Equation of a Line', zh:'直线的方程' },
  subtitle:{ ko:'기울기는 y변화÷x변화, y절편은 한 점을 대입해 찾아요', en:'Slope is Δy÷Δx; find the y-intercept by substituting one point', zh:'斜率是Δy÷Δx，代入一点求y轴截距' },
  icon:'📈',

  practice:{
    generator:'md33_lineEquation', level:'practice', count:5,
    params:{mode:'twoPoints'},
    intro:{
      ko:'A(1,3), B(3,7)을 지나는 직선의 기울기는 (7-3)/(3-1)=2. y=2x+b에 (1,3)을 넣으면 3=2+b, b=1 — y=2x+1.',
      en:'Slope of the line through A(1,3), B(3,7): (7-3)/(3-1)=2. Plug (1,3) into y=2x+b: 3=2+b, b=1 — y=2x+1.',
      zh:'过A(1,3)、B(3,7)的直线斜率：(7-3)/(3-1)=2。把(1,3)代入y=2x+b：3=2+b，b=1——y=2x+1。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'좌표평면 위 두 점을 지나는 직선을 y=ax+b 꼴의 식으로 쓰고 싶어요. 두 점만 알면 기울기와 y절편을 다 찾을 수 있을까요?',
        en:'You want to write the line through two points on the coordinate plane as y=ax+b. Can you find both the slope and y-intercept just from the two points?',
        zh:'想把过坐标平面上两点的直线写成y=ax+b的形式。只知道两点，能不能求出斜率和y轴截距？' },
      history:{ ko:'기울기는 "x가 1만큼 늘 때 y가 얼마나 느는가"를 뜻해요. 두 점 사이의 y변화량을 x변화량으로 나누면 이 비율이 그대로 나오고, 거기에 한 점을 대입하면 y절편까지 완성돼요.',
        en:'Slope means "how much y increases when x increases by 1." Dividing the y-change between two points by the x-change gives exactly this ratio, and substituting one point then completes the y-intercept.',
        zh:'斜率的意思是"x每增加1，y增加多少"。把两点间y的变化量除以x的变化量，正好就是这个比例，再代入一点就能求出y轴截距。' }
    },
    stages:[
      { tag:{ko:'① 기울기 = y변화÷x변화',en:'1) Slope = Δy÷Δx',zh:'① 斜率 = y变化÷x变化'},
        head:{ko:'A(1,3), B(3,7) \\;\\Rightarrow\\; a=2',en:'A(1,3), B(3,7) \\;\\Rightarrow\\; a=2',zh:'A(1,3), B(3,7) \\;\\Rightarrow\\; a=2'},
        desc:{ko:'x가 1에서 3으로(변화량 2), y가 3에서 7로(변화량 4) 늘었어요. 기울기 a=4÷2=<b>2</b> — x가 1 늘 때마다 y는 2씩 늘어나요.',
              en:'x goes from 1 to 3 (change 2), y from 3 to 7 (change 4). Slope a=4÷2=<b>2</b> — for every 1 x increases, y increases by 2.',
              zh:'x从1到3(变化2)，y从3到7(变化4)。斜率a=4÷2=<b>2</b>——x每增1，y就增2。'},
        mathSteps:['\\Delta x=3-1=2,\\;\\Delta y=7-3=4', 'a=\\frac{\\Delta y}{\\Delta x}=\\frac{4}{2}', '=2'],
        result:{ko:'기울기는 y의 변화량을 x의 변화량으로 나눈 값이에요!',en:'Slope is the change in y divided by the change in x!',zh:'斜率是y的变化量除以x的变化量！'},
        book:{ko:'a=(y₂-y₁)/(x₂-x₁) — 어느 점을 앞뒤로 놓아도 값은 같아요.',
              en:'a=(y₂-y₁)/(x₂-x₁) — the value is the same regardless of which point you list first.',
              zh:'a=(y₂-y₁)/(x₂-x₁)——不管哪个点在前，值都一样。'} },

      { tag:{ko:'② 일반형 → 기울기절편형',en:'2) General form → slope-intercept form',zh:'② 一般式→斜截式'},
        head:{ko:'2x+y=6 \\;\\Rightarrow\\; y=-2x+6',en:'2x+y=6 \\;\\Rightarrow\\; y=-2x+6',zh:'2x+y=6 \\;\\Rightarrow\\; y=-2x+6'},
        desc:{ko:'y항만 남기고 2x를 우변으로 이항하면 y=<b>-2x+6</b>. 부호가 바뀌는 걸 잊지 마세요 — 이항의 기본 규칙 그대로예요.',
              en:'Isolate the y term by transposing 2x to the other side: y=<b>-2x+6</b>. Don\'t forget the sign flips — the same basic rule as transposition.',
              zh:'把2x移到右边、只留下y项：y=<b>-2x+6</b>。别忘了符号要变——就是移项的基本规则。'},
        mathSteps:['2x+y=6', 'y=6-2x', 'y=-2x+6'],
        result:{ko:'y항만 남기고 나머지를 이항하면 기울기절편형이 돼요!',en:'Isolate the y term and transpose the rest to get slope-intercept form!',zh:'只留y项、移走其余的，就变成斜截式！'},
        book:{ko:'Ax+By=C(B≠0)는 y=(-A/B)x+(C/B)로 바뀌어요 — By만 남기고 나머지를 이항한 뒤 B로 나눈 것과 같아요.',
              en:'Ax+By=C (B≠0) becomes y=(-A/B)x+(C/B) — the same as isolating By, transposing the rest, then dividing by B.',
              zh:'Ax+By=C(B≠0)变成y=(-A/B)x+(C/B)——相当于只留By、移项后再除以B。'} }
    ],
    rule:{ ko:'① 기울기 a=(y₂-y₁)/(x₂-x₁), 한 점을 대입해 b를 찾기  ② Ax+By=C는 y항만 남기고 이항한 뒤 B로 나누면 y=ax+b',
      en:'① Slope a=(y₂-y₁)/(x₂-x₁), then substitute one point to find b  ② Ax+By=C becomes y=ax+b by isolating y and dividing by B',
      zh:'① 斜率a=(y₂-y₁)/(x₂-x₁)，代入一点求b  ② Ax+By=C只留y项、除以B后变成y=ax+b' }
  },

  check:{
    fills:[
      { tex:'A(0,1), \\;\\; B(2,5) \\;\\Rightarrow\\; y = \\square x + \\square', answer:[2,1],
        hint:{ ko:'기울기=(5-1)/(2-0)=2, b=1', en:'slope=(5-1)/(2-0)=2, b=1', zh:'斜率=(5-1)/(2-0)=2，b=1' } },
      { tex:'3x + y = 9 \\;\\Rightarrow\\; y = \\square x + \\square', answer:[-3,9],
        hint:{ ko:'y=9-3x', en:'y=9-3x', zh:'y=9-3x' } }
    ],
    open:{ ko:'A(-1,4), B(2,-2)를 지나는 직선의 방정식을 구하는 과정을 설명해봐요.',
      en:'Explain how to find the equation of the line through A(-1,4), B(2,-2).',
      zh:'说说求过A(-1,4)、B(2,-2)的直线方程的过程。' },
    openHint:{ ko:'기울기=(-2-4)/(2-(-1))=-2, (2,-2) 대입: -2=-4+b, b=2 → y=-2x+2',
      en:'slope=(-2-4)/(2-(-1))=-2, substitute (2,-2): -2=-4+b, b=2 → y=-2x+2',
      zh:'斜率=(-2-4)/(2-(-1))=-2，代入(2,-2)：-2=-4+b，b=2 → y=-2x+2' }
  },

  lab:{
    generator:'md33_lineEquation', level:'main', count:4,
    params:{mode:'standardForm'},
    intro:{
      ko:'이번엔 일반형에서 시작! y항만 남기고 이항한 뒤 나눠봐.',
      en:'Starting from general form this time! Isolate the y term, transpose, and divide.',
      zh:'这次从一般式开始！只留y项，移项后再除。'
    }
  },

  arena:{
    generator:'md33_lineEquation', level:'main', count:8, timeLimit:300,
    params:{mode:'standardFormWide'},
    rule:{ ko:'5분 안에 더 큰 범위의 일반형 변환을 모두 풀어요!', en:'Solve all the wider-range general-form conversions in 5 minutes!', zh:'5分钟内解答所有更大范围的一般式转换！' }
  },

  stamp:{ label:{ ko:'직선 항해사', en:'Line Navigator', zh:'直线航海家' }, coins:48 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'기울기와 절편을 정확히 짚었구나! 📈',en:'You pinpointed the slope and intercept perfectly!',zh:'斜率和截距都对得很准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'기울기는 y의 변화량을 x의 변화량으로 나눈 값이야!',en:'Slope is the change in y divided by the change in x!',zh:'斜率是y的变化量除以x的变化量！'}, {ko:'일반형은 y항만 남기고 이항한 뒤 B로 나눠봐!',en:'For general form, isolate y, transpose, then divide by B!',zh:'一般式只留y项，移项后除以B！'} ],
    finish:{ ko:'완벽해! 직선 항해사! 📈✨', en:'Perfect! Line Navigator!', zh:'完美！直线航海家！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
