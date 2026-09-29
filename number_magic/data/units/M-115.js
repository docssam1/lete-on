/* Numbers of Magic — 유닛 M-115: 삼각형의 무게중심 (고등 공통수학2 · 과정 49 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD115. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-115'] = {
  id:'M-115', tier:'highmath2', level:'49', order:115,
  generator:'md115_centroid',
  title:{ ko:'삼각형의 무게중심', en:'The Centroid of a Triangle', zh:'三角形的重心' },
  subtitle:{ ko:'세 꼭짓점의 좌표를 더해 3 으로 나눕니다', en:'Add the three vertices and divide by 3', zh:'三个顶点的坐标相加再除以3' },
  icon:'🔺',

  practice:{
    generator:'md115_centroid', level:'practice', count:6,
    params:{mode:'coord'},
    intro:{
      ko:'x 좌표 셋을 더해 3 으로 나누고, y 좌표 셋을 더해 3 으로 나눕니다. 답은 두 칸에 씁니다.',
      en:'Add the three x-coordinates and divide by 3, then do the same with the y-coordinates. Enter two boxes.',
      zh:'三个x坐标相加除以3，三个y坐标相加除以3。答案填两格。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'삼각형 모양 판자를 손가락 하나로 받쳐 균형을 잡을 수 있는 점이 무게중심입니다. 세 중선이 만나는 점이고, 좌표로는 세 꼭짓점의 평균입니다.',
        en:'The centroid is the point where a triangular board balances on one fingertip. It is where the three medians meet, and in coordinates it is the average of the three vertices.',
        zh:'用一根手指托住三角形木板使它平衡的那一点就是重心。它是三条中线的交点，用坐标表示就是三个顶点的平均。' }
    },
    stages:[
      { tag:{ko:'① 세 꼭짓점의 평균',en:'1) Average of the vertices',zh:'① 三个顶点的平均'},
        head:{ko:'G\\left(\\dfrac{1+4-2}{3},\\ \\dfrac{2-1+5}{3}\\right)=G(1,\\ 2)',en:'G\\left(\\dfrac{1+4-2}{3},\\ \\dfrac{2-1+5}{3}\\right)=G(1,\\ 2)',zh:'G\\left(\\dfrac{1+4-2}{3},\\ \\dfrac{2-1+5}{3}\\right)=G(1,\\ 2)'},
        desc:{ko:'A(1, 2), B(4, −1), C(−2, 5) 이면 x 좌표의 합 3, y 좌표의 합 6 을 각각 3 으로 나누어 무게중심은 <b>(1, 2)</b> 입니다.',
              en:'For A(1, 2), B(4, −1), C(−2, 5), the x-sum 3 and the y-sum 6 divided by 3 give the centroid <b>(1, 2)</b>.',
              zh:'A(1, 2)、B(4, −1)、C(−2, 5)时，x坐标和3、y坐标和6分别除以3，重心是<b>(1, 2)</b>。'},
        mathSteps:['3\\div3=1,\\quad 6\\div3=2'],
        result:{ko:'무게중심 = 좌표의 평균!',en:'Centroid = average of coordinates!',zh:'重心=坐标的平均！'},
        book:{ko:'무게중심은 각 중선을 꼭짓점 쪽에서 2:1 로 내분하는 점이기도 합니다.',
              en:'The centroid also divides each median 2:1 from the vertex.',
              zh:'重心也是把每条中线从顶点起按2:1内分的点。'} },

      { tag:{ko:'② 거꾸로 꼭짓점 찾기',en:'2) Back to a vertex',zh:'② 反求顶点'},
        head:{ko:'x_3=3\\times2-1-3=2',en:'x_3=3\\times2-1-3=2',zh:'x_3=3\\times2-1-3=2'},
        desc:{ko:'A(1, 2), B(3, −1) 이고 무게중심이 G(2, 1) 이면 세 x 좌표의 합은 6 이므로 C 의 x 좌표는 6−1−3=2, 같은 방법으로 y 좌표는 3−2+1=2 입니다. C(<b>2</b>, <b>2</b>).',
              en:'With A(1, 2), B(3, −1) and G(2, 1), the x-sum must be 6, so C has x=6−1−3=2; likewise y=3−2+1=2. C(<b>2</b>, <b>2</b>).',
              zh:'A(1, 2)、B(3, −1)，重心G(2, 1)时，三个x坐标之和为6，所以C的x坐标为6−1−3=2，同理y坐标为3−2+1=2。C(<b>2</b>, <b>2</b>)。'},
        mathSteps:['3\\times1-2-(-1)=2'],
        result:{ko:'합 = 3 × 무게중심!',en:'Sum = 3 × centroid!',zh:'和=3×重心！'},
        book:{ko:'나누기 전의 합을 먼저 떠올리면 계산이 짧아집니다.',
              en:'Think of the sum before dividing, and the work gets shorter.',
              zh:'先想除之前的和，计算就更简短。'} },

      { tag:{ko:'③ 미지수가 있을 때',en:'3) With unknowns',zh:'③ 含未知数时'},
        head:{ko:'\\dfrac{a+2+4}{3}=2,\\quad \\dfrac{1+b+5}{3}=3',en:'\\dfrac{a+2+4}{3}=2,\\quad \\dfrac{1+b+5}{3}=3',zh:'\\dfrac{a+2+4}{3}=2,\\quad \\dfrac{1+b+5}{3}=3'},
        desc:{ko:'A(a, 1), B(2, b), C(4, 5) 의 무게중심이 G(2, 3) 이면 a=0, b=3 이므로 a+b=<b>3</b> 입니다.',
              en:'If A(a, 1), B(2, b), C(4, 5) have centroid G(2, 3), then a=0 and b=3, so a+b=<b>3</b>.',
              zh:'A(a, 1)、B(2, b)、C(4, 5)的重心为G(2, 3)时，a=0、b=3，所以a+b=<b>3</b>。'},
        mathSteps:['a=6-6=0,\\quad b=9-6=3'],
        result:{ko:'x 는 x 끼리, y 는 y 끼리!',en:'x with x, y with y!',zh:'x与x，y与y！'},
        book:{ko:'미지수가 두 개면 x 좌표 식과 y 좌표 식을 하나씩 세웁니다.',
              en:'Two unknowns need two equations: one from x and one from y.',
              zh:'有两个未知数时，由x坐标和y坐标各列一个方程。'} }
    ],
    rule:{ ko:'① G=(x 좌표의 합/3, y 좌표의 합/3)  ② 꼭짓점 = 3G − 나머지 두 꼭짓점  ③ 미지수는 좌표별로 식을 세웁니다',
      en:'① G=(x-sum/3, y-sum/3)  ② Vertex = 3G − the other two  ③ Unknowns: one equation per coordinate',
      zh:'① G=(x坐标和/3, y坐标和/3)  ② 顶点=3G−另两个顶点  ③ 未知数按坐标分别列方程' }
  },

  check:{
    fills:[
      { tex:{ko:'A(0,0),\\ B(6,0),\\ C(0,9)\\ \\Rightarrow\\ G\\text{의 }x\\text{ 좌표}=\\square',en:'A(0,0),\\ B(6,0),\\ C(0,9)\\ \\Rightarrow\\ x\\text{ of }G=\\square',zh:'A(0,0),\\ B(6,0),\\ C(0,9)\\ \\Rightarrow\\ G\\text{的}x\\text{坐标}=\\square'}, answer:2,
        hint:{ ko:'(0+6+0)÷3', en:'(0+6+0)÷3', zh:'(0+6+0)÷3' } },
      { tex:{ko:'A(2,3),\\ B(-1,4),\\ G(1,2)\\ \\Rightarrow\\ C\\text{의 }x\\text{ 좌표}=\\square',en:'A(2,3),\\ B(-1,4),\\ G(1,2)\\ \\Rightarrow\\ x\\text{ of }C=\\square',zh:'A(2,3),\\ B(-1,4),\\ G(1,2)\\ \\Rightarrow\\ C\\text{的}x\\text{坐标}=\\square'}, answer:2,
        hint:{ ko:'3×1−2−(−1)', en:'3×1−2−(−1)', zh:'3×1−2−(−1)' } }
    ],
    open:{ ko:'무게중심의 좌표가 세 꼭짓점 좌표의 평균이 되는 까닭을 중선의 2:1 내분점과 연결해 설명해 봅니다.',
      en:'Explain why the centroid is the average of the vertices, using the point dividing a median 2:1.',
      zh:'结合中线的2:1内分点，说说重心坐标为什么是三个顶点坐标的平均。' },
    openHint:{ ko:'BC 의 중점 M 을 구한 뒤 AM 을 2:1 로 내분하면 (x₁+x₂+x₃)/3 이 나옵니다.',
      en:'Find the midpoint M of BC, then divide AM in the ratio 2:1 to get (x₁+x₂+x₃)/3.',
      zh:'求出BC的中点M，再把AM按2:1内分，就得到(x₁+x₂+x₃)/3。' }
  },

  lab:{
    generator:'md115_centroid', level:'main', count:6,
    params:{mode:'vertex'},
    intro:{
      ko:'무게중심을 알면 세 좌표의 합을 압니다. 합에서 아는 두 꼭짓점을 빼 나머지 꼭짓점을 찾습니다.',
      en:'Knowing the centroid tells you the coordinate sums; subtract the two known vertices to find the third.',
      zh:'知道重心就知道坐标之和；减去已知的两个顶点求第三个。'
    }
  },

  arena:{
    generator:'md115_centroid', level:'main', count:6, timeLimit:420,
    params:{mode:'sum'},
    rule:{ ko:'7분 안에 미지수가 숨은 꼭짓점을 모두 찾습니다!', en:'Find every hidden coordinate within 7 minutes!', zh:'7分钟内找出所有隐藏的坐标！' }
  },

  stamp:{ label:{ ko:'균형점 탐사가', en:'Balance-Point Scout', zh:'平衡点探测员' }, coins:48 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'딱 균형을 찾았어! 🔺',en:'You found the balance point!',zh:'找到平衡点了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'x 끼리 더해서 3 으로 나눠 봐!',en:'Add the x-values and divide by 3!',zh:'把x坐标相加再除以3！'}, {ko:'꼭짓점은 3G 에서 빼면 돼!',en:'Subtract from 3G to get the vertex!',zh:'用3G去减就得到顶点！'} ],
    finish:{ ko:'완벽해! 균형점 탐사가! 🔺✨', en:'Perfect! Balance-Point Scout!', zh:'完美！平衡点探测员！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
