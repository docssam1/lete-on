/* Numbers of Magic — 유닛 M-32: 중점과 내분점·외분점 (고등 W12 · 공통수학2 도형의 방정식) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-32'] = {
  id:'M-32', tier:'highmath2', level:'38', order:32,
  generator:'md32_midSection',
  title:{ ko:'중점과 내분점·외분점', en:'Midpoints & Division Points', zh:'中点与内分点·外分点' },
  subtitle:{ ko:'두 점을 정해진 비율로 나누는 점의 좌표를 찾아요', en:'Find the coordinates of a point that splits two points in a given ratio', zh:'求按指定比例分割两点的点的坐标' },
  icon:'📍',

  practice:{
    generator:'md32_midSection', level:'practice', count:5,
    params:{mode:'midpoint'},
    intro:{
      ko:'A(2,1), B(6,7)의 중점은? x끼리, y끼리 각각 더해 2로 나누면 ((2+6)/2, (1+7)/2)=(4,4)예요.',
      en:'Midpoint of A(2,1), B(6,7)? Average the x\'s and the y\'s separately: ((2+6)/2, (1+7)/2)=(4,4).',
      zh:'A(2,1)、B(6,7)的中点？x、y分别相加除以2：((2+6)/2, (1+7)/2)=(4,4)。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'두 점을 정확히 반씩 나누는 점(중점)은 이미 알아요. 그런데 절반이 아니라 "2:1"처럼 특정 비율로 나누는 점은 어떻게 찾을까요?',
        en:'You already know the point that splits two points exactly in half (the midpoint). But how do you find a point that divides them in a specific ratio, like 2:1, instead of half-and-half?',
        zh:'把两点正好一分为二的点(中点)你已经会了。但要按"2:1"这样的特定比例来分呢？' },
      history:{ ko:'중점은 "1:1로 나누는 점"의 특별한 경우예요. 내분점 공식은 그걸 일반화해서 m:n 어떤 비율이든 다룰 수 있게 만들어졌어요 — 먼 쪽 점에 가까운 쪽 비율을 곱해서 가중치를 준다는 아이디어예요.',
        en:'The midpoint is really just the special case of "splitting 1:1". The internal division formula generalizes this to handle any ratio m:n — the idea is to weight each point by the ratio on its far side.',
        zh:'中点其实就是"按1:1分割"的特殊情况。内分点公式把它推广到能处理任意比例m:n——思路是给每个点乘以对侧的比例作为权重。' }
    },
    stages:[
      { tag:{ko:'① 중점: 더해서 2로 나누기',en:'1) Midpoint: add and divide by 2',zh:'① 中点：相加除以2'},
        head:{ko:'A(2,1), B(6,7) \\;\\Rightarrow\\; M=(4,4)',en:'A(2,1), B(6,7) \\;\\Rightarrow\\; M=(4,4)',zh:'A(2,1), B(6,7) \\;\\Rightarrow\\; M=(4,4)'},
        desc:{ko:'x좌표끼리 더해 2로: (2+6)/2=<b>4</b>. y좌표끼리 더해 2로: (1+7)/2=<b>4</b>. 두 점의 딱 중간이에요.',
              en:'Average the x-coordinates: (2+6)/2=<b>4</b>. Average the y-coordinates: (1+7)/2=<b>4</b>. Exactly halfway between the two points.',
              zh:'x坐标相加除以2：(2+6)/2=<b>4</b>。y坐标相加除以2：(1+7)/2=<b>4</b>。正好是两点正中间。'},
        mathSteps:['M_x=\\frac{2+6}{2}=4', 'M_y=\\frac{1+7}{2}=4', 'M=(4,4)'],
        result:{ko:'중점은 x끼리, y끼리 각각 평균 내면 돼요!',en:'The midpoint just averages the x\'s and the y\'s separately!',zh:'中点就是x、y各自求平均！'},
        book:{ko:'중점 M=((x₁+x₂)/2, (y₁+y₂)/2) — 1:1로 나누는 가장 단순한 경우예요.',
              en:'Midpoint M=((x₁+x₂)/2, (y₁+y₂)/2) — the simplest case, splitting 1:1.',
              zh:'中点M=((x₁+x₂)/2, (y₁+y₂)/2)——按1:1分割的最简单情况。'} },

      { tag:{ko:'② 내분점: m:n 비율로 가중',en:'2) Internal division: weight by m:n',zh:'② 内分点：按m:n加权'},
        head:{ko:'P=\\left(\\dfrac{nx_1+mx_2}{m+n},\\dfrac{ny_1+my_2}{m+n}\\right)',en:'P=\\left(\\dfrac{nx_1+mx_2}{m+n},\\dfrac{ny_1+my_2}{m+n}\\right)',zh:'P=\\left(\\dfrac{nx_1+mx_2}{m+n},\\dfrac{ny_1+my_2}{m+n}\\right)'},
        desc:{ko:'A(1,1), B(7,4)를 2:1로 내분하면: x=(1×1+2×7)/(2+1)=15/3=<b>5</b>, y=(1×1+2×4)/3=9/3=<b>3</b> → P(5,3). A쪽엔 먼 쪽 비율(n=1), B쪽엔 먼 쪽 비율(m=2)이 곱해져요.',
              en:'Dividing A(1,1), B(7,4) in ratio 2:1: x=(1×1+2×7)/(2+1)=15/3=<b>5</b>, y=(1×1+2×4)/3=9/3=<b>3</b> → P(5,3). A is weighted by the far ratio (n=1), B by the far ratio (m=2).',
              zh:'把A(1,1)、B(7,4)按2:1内分：x=(1×1+2×7)/(2+1)=15/3=<b>5</b>，y=(1×1+2×4)/3=9/3=<b>3</b> → P(5,3)。A乘对侧比例(n=1)，B乘对侧比例(m=2)。'},
        mathSteps:['P_x=\\frac{1\\times1+2\\times7}{2+1}=5', 'P_y=\\frac{1\\times1+2\\times4}{3}=3', 'P=(5,3)'],
        result:{ko:'m:n 내분점은 먼 쪽 점에 가까운 쪽 비율을 곱해 가중치를 줘요!',en:'The internal division point weights each far point by the ratio on its near side!',zh:'m:n内分点是把每个点按对侧比例加权！'},
        book:{ko:'m=n이면 내분점 공식이 정확히 중점 공식으로 돌아가요 — 중점은 1:1 내분의 특수한 경우예요.',
              en:'When m=n, the internal division formula reduces exactly to the midpoint formula — the midpoint is just the special 1:1 case.',
              zh:'m=n时内分点公式正好回到中点公式——中点就是1:1内分的特殊情况。'} }
    ],
    rule:{ ko:'① 중점 M=((x₁+x₂)/2, (y₁+y₂)/2)  ② m:n 내분점은 먼 쪽 비율을 곱해 더한 뒤 (m+n)으로 나누기',
      en:'① Midpoint M=((x₁+x₂)/2, (y₁+y₂)/2)  ② Internal division: weight by the far ratio, sum, divide by (m+n)',
      zh:'① 中点M=((x₁+x₂)/2, (y₁+y₂)/2)  ② m:n内分点：按对侧比例加权求和后除以(m+n)' }
  },

  check:{
    fills:[
      { tex:'A(-2,3), \\;\\; B(4,-1) \\;\\Rightarrow\\; M = (\\square, \\square)', answer:[1,1],
        hint:{ ko:'((-2+4)/2, (3-1)/2)', en:'((-2+4)/2, (3-1)/2)', zh:'((-2+4)/2, (3-1)/2)' } },
      { tex:'A(0,0), \\;\\; B(9,6), \\;\\; 2:1 \\;\\Rightarrow\\; P = (\\square, \\square)', answer:[6,4],
        hint:{ ko:'((1×0+2×9)/3, (1×0+2×6)/3)', en:'((1×0+2×9)/3, (1×0+2×6)/3)', zh:'((1×0+2×9)/3, (1×0+2×6)/3)' } }
    ],
    open:{ ko:'A(1,2), B(7,5)를 1:2로 내분하는 점의 좌표를 구하는 과정을 설명해봐요.',
      en:'Explain how to find the point dividing A(1,2), B(7,5) internally in ratio 1:2.',
      zh:'说说求按1:2内分A(1,2)、B(7,5)的点的坐标的过程。' },
    openHint:{ ko:'x=(2×1+1×7)/3=3, y=(2×2+1×5)/3=3 → (3,3)',
      en:'x=(2×1+1×7)/3=3, y=(2×2+1×5)/3=3 → (3,3)',
      zh:'x=(2×1+1×7)/3=3，y=(2×2+1×5)/3=3 → (3,3)' }
  },

  lab:{
    generator:'md32_midSection', level:'main', count:4,
    params:{mode:'section'},
    intro:{
      ko:'이번엔 m:n 내분점! 먼 쪽 비율을 곱해서 가중치를 주는 걸 잊지 마.',
      en:'Internal division by m:n this time! Don\'t forget to weight by the far ratio.',
      zh:'这次是m:n内分点！别忘了按对侧比例加权。'
    }
  },

  arena:{
    generator:'md32_midSection', level:'main', count:8, timeLimit:300,
    params:{mode:'external'},
    rule:{ ko:'5분 안에 외분점 문제를 모두 풀어요! 분모가 (m-n)으로 바뀐다는 걸 기억해요.', en:'Solve all the external-division problems in 5 minutes! Remember the denominator becomes (m-n).', zh:'5分钟内解答所有外分点题！记住分母变成(m-n)。' }
  },

  stamp:{ label:{ ko:'분할점 안내자', en:'Division Point Guide', zh:'分点向导' }, coins:49 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'비율을 정확히 가중해서 찾았구나! 📍',en:'You weighted the ratio exactly right!',zh:'比例加权得很准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'중점은 x끼리, y끼리 각각 더해 2로 나누면 돼!',en:'The midpoint just averages the x\'s and y\'s!',zh:'中点是x、y各自求平均！'}, {ko:'내분점은 먼 쪽 점에 가까운 쪽 비율을 곱해야 해!',en:'Internal division weights each point by the ratio on its near side!',zh:'内分点要按对侧比例加权！'} ],
    finish:{ ko:'완벽해! 분할점 안내자! 📍✨', en:'Perfect! Division Point Guide!', zh:'完美！分点向导！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
