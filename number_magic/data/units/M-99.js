/* Numbers of Magic — 유닛 M-99: 이차함수의 그래프와 직선의 위치 관계 (고등 공통수학1 · 과정 42 이차방정식과 이차함수, 2026-09-29)
   근거: docs/high-build-spec.md MD99. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-99'] = {
  id:'M-99', tier:'highmath1', level:'42', order:99,
  generator:'md99_graphLine',
  title:{ ko:'이차함수의 그래프와 직선의 위치 관계', en:'A Parabola and a Line: Relative Position', zh:'二次函数图象与直线的位置关系' },
  subtitle:{ ko:'두 식을 같다고 놓은 방정식의 판별식이 답을 알려 줍니다', en:'The discriminant of the equation you get by setting them equal tells all', zh:'令两式相等所得方程的判别式给出答案' },
  icon:'📈',

  practice:{
    generator:'md99_graphLine', level:'practice', count:6,
    params:{mode:'count'},
    intro:{
      ko:'두 식을 같다고 놓아 이차방정식을 만들고, 판별식 D의 부호로 교점의 개수 0, 1, 2 중 하나를 고릅니다.',
      en:'Set the two expressions equal to get a quadratic, then use the sign of D to choose 0, 1 or 2 common points.',
      zh:'令两式相等得二次方程，由判别式D的符号选出交点个数0、1或2。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'포물선 y=x²과 직선 y=2x−1을 그리면 딱 한 점에서 스치듯 만납니다. 그림을 그리지 않고도 이것을 알 수 있을까요? x²=2x−1을 풀어 보면 됩니다.',
        en:'Draw the parabola y=x² and the line y=2x−1 and they just touch at one point. Can we tell without drawing? Solve x²=2x−1.',
        zh:'画出抛物线y=x²和直线y=2x−1，它们恰好在一点相切。不画图能知道吗？解x²=2x−1就行。' },
      history:{ ko:'그래프가 만나는 점에서는 두 식의 y값이 같습니다. 그래서 교점의 x좌표는 두 식을 같다고 놓은 방정식의 실근이고, 교점의 개수는 실근의 개수와 같습니다.',
        en:'Where the graphs meet, the two expressions have the same y-value. So the x-coordinates of the common points are the real roots of the equation formed by setting them equal, and the number of common points equals the number of real roots.',
        zh:'图象相交处两式的y值相同。所以交点的横坐标就是令两式相等所得方程的实根，交点个数等于实根个数。' }
    },
    stages:[
      { tag:{ko:'① 같다고 놓고 판별식',en:'1) Set equal, then the discriminant',zh:'① 令其相等，再看判别式'},
        head:{ko:'x^2=2x-1 \\;\\Rightarrow\\; x^2-2x+1=0',en:'x^2=2x-1 \\;\\Rightarrow\\; x^2-2x+1=0',zh:'x^2=2x-1 \\;\\Rightarrow\\; x^2-2x+1=0'},
        desc:{ko:'D=(−2)²−4×1×1=0이므로 실근이 하나(중근)입니다. 그래서 두 그래프는 <b>한 점에서 접합니다</b>.',
              en:'D=(−2)²−4×1×1=0, so there is one (repeated) real root, and the graphs <b>touch at one point</b>.',
              zh:'D=(−2)²−4×1×1=0，只有一个实根(重根)，所以两图象<b>相切于一点</b>。'},
        mathSteps:['D=(-2)^2-4\\times1\\times1', '=0'],
        result:{ko:'D>0이면 두 점, D=0이면 접함, D<0이면 만나지 않습니다!',en:'D>0: two points, D=0: tangent, D<0: no meeting!',zh:'D>0两个交点，D=0相切，D<0不相交！'},
        book:{ko:'x축은 직선 y=0입니다. 이차함수와 x축의 관계도 y=0으로 놓고 똑같이 판별합니다.',
              en:'The x-axis is the line y=0, so a parabola and the x-axis are judged the same way, by setting y=0.',
              zh:'x轴就是直线y=0，二次函数与x轴的关系也令y=0同样判别。'} },

      { tag:{ko:'② 접할 조건으로 k 구하기',en:'2) Find k from tangency',zh:'② 由相切条件求k'},
        head:{ko:'y=x^2+4x+k,\\ y=0 \\;\\Rightarrow\\; D=16-4k=0',en:'y=x^2+4x+k,\\ y=0 \\;\\Rightarrow\\; D=16-4k=0',zh:'y=x^2+4x+k,\\ y=0 \\;\\Rightarrow\\; D=16-4k=0'},
        desc:{ko:'접하려면 D=0입니다. 16−4k=0에서 <b>k=4</b>입니다.',
              en:'Tangency needs D=0: 16−4k=0, so <b>k=4</b>.',
              zh:'相切需要D=0：16−4k=0，<b>k=4</b>。'},
        mathSteps:['16-4k=0', 'k=4'],
        result:{ko:'조건이 등호 하나면 k도 값 하나로 정해집니다!',en:'One equality condition fixes one value of k!',zh:'一个等式条件确定一个k值！'},
        book:{ko:'직선의 y절편이 k인 문제도 두 식을 같다고 놓은 뒤 D=0으로 풉니다.',
              en:'When the unknown k is the line\'s y-intercept, still set the two equal and solve D=0.',
              zh:'直线的y截距为k时，同样令两式相等，再解D=0。'} },

      { tag:{ko:'③ 두 점에서 만날 k의 범위',en:'3) The range of k for two points',zh:'③ 两个交点时k的范围'},
        head:{ko:'D=16-4k>0 \\;\\Rightarrow\\; k<4',en:'D=16-4k>0 \\;\\Rightarrow\\; k<4',zh:'D=16-4k>0 \\;\\Rightarrow\\; k<4'},
        desc:{ko:'두 점에서 만나려면 D>0입니다. 16−4k>0에서 <b>k<4</b>입니다. 만나지 않으려면 반대로 k>4입니다.',
              en:'Two common points need D>0: 16−4k>0 gives <b>k<4</b>. For no common point it is the other way, k>4.',
              zh:'要有两个交点需D>0：16−4k>0得<b>k<4</b>。不相交则相反，k>4。'},
        mathSteps:['16-4k>0', '-4k>-16', 'k<4'],
        result:{ko:'경계값은 접할 때의 k와 같습니다!',en:'The boundary is exactly the k for tangency!',zh:'边界值正是相切时的k！'},
        book:{ko:'음수로 나누면 부등호 방향이 바뀝니다. −4k>−16에서 k<4가 됩니다.',
              en:'Dividing by a negative flips the inequality: −4k>−16 becomes k<4.',
              zh:'除以负数不等号方向改变：−4k>−16变成k<4。'} }
    ],
    rule:{ ko:'① 두 식을 같다고 놓는다  ② D>0 두 점, D=0 접함, D<0 만나지 않음  ③ 범위의 경계값은 D=0일 때의 값입니다',
      en:'① Set the two expressions equal  ② D>0 two points, D=0 tangent, D<0 none  ③ The boundary of the range is the value where D=0',
      zh:'① 令两式相等  ② D>0两个交点，D=0相切，D<0不相交  ③ 范围的边界值是D=0时的值' }
  },

  check:{
    fills:[
      { tex:'y=x^2-6x+k,\\ y=0:\\ D=0 \\;\\Rightarrow\\; k=\\square', answer:9,
        hint:{ ko:'36−4k=0', en:'36−4k=0', zh:'36−4k=0' } },
      { tex:'y=x^2+3,\\ y=2x:\\ x^2-2x+3=0,\\ D=\\square', answer:-8,
        hint:{ ko:'4−12=−8', en:'4−12=−8', zh:'4−12=−8' } }
    ],
    open:{ ko:'y=x²+2x+k와 x축이 서로 다른 두 점에서 만날 k의 범위를 구하는 과정을 설명해 봅니다.',
      en:'Explain how to find the range of k for which y=x²+2x+k meets the x-axis at two distinct points.',
      zh:'说说求y=x²+2x+k与x轴有两个不同交点时k的范围的过程。' },
    openHint:{ ko:'D=4−4k>0이므로 k<1입니다.',
      en:'D=4−4k>0, so k<1.',
      zh:'D=4−4k>0，所以k<1。' }
  },

  lab:{
    generator:'md99_graphLine', level:'main', count:6,
    params:{mode:'tangent'},
    intro:{
      ko:'접하려면 판별식이 0입니다. D=0을 k에 대해 풉니다.',
      en:'Tangency means the discriminant is 0. Solve D=0 for k.',
      zh:'相切即判别式为0。解关于k的D=0。'
    }
  },

  arena:{
    generator:'md99_graphLine', level:'main', count:6, timeLimit:420,
    params:{mode:'range'},
    rule:{ ko:'7분 안에 k의 범위의 끝값을 모두 구합니다!', en:'Find every endpoint of the range of k within 7 minutes!', zh:'7分钟内求出所有k的范围的端点！' }
  },

  stamp:{ label:{ ko:'교점 탐지기', en:'Crossing Detector', zh:'交点探测器' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'그리지 않고도 만나는 곳을 알아냈구나! 📈',en:'You found where they meet without drawing!',zh:'不画图也知道在哪里相交！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'두 식을 같다고 놓고 한쪽으로 옮겨 봐!',en:'Set them equal and move everything to one side!',zh:'令两式相等，移到一边试试！'}, {ko:'접하면 D=0, 두 점이면 D>0이야!',en:'Tangent means D=0; two points means D>0!',zh:'相切D=0，两个交点D>0！'} ],
    finish:{ ko:'완벽해! 교점 탐지기! 📈✨', en:'Perfect! Crossing Detector!', zh:'完美！交点探测器！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
