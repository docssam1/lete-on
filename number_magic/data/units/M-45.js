/* Numbers of Magic — 유닛 M-45: 접선의 기울기와 방정식 (고등 W14 · 미적분Ⅰ 접선과 적분) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-45'] = {
  id:'M-45', tier:'calculus1', level:'43', order:1,
  generator:'md45_tangentLine',
  title:{ ko:'접선의 기울기와 방정식', en:'Tangent Line Slope & Equation', zh:'切线的斜率与方程' },
  subtitle:{ ko:'곡선에 살짝 닿는 직선의 기울기는 도함수예요', en:'The slope of a line just touching a curve is its derivative', zh:'轻轻碰到曲线的直线，其斜率就是导数' },
  icon:'📏',

  practice:{
    generator:'md45_tangentLine', level:'practice', count:5,
    params:{mode:'slope'},
    intro:{
      ko:'곡선 위 한 점에서 그 곡선에 살짝 닿는 직선(접선)의 기울기는, 바로 그 점에서의 미분계수 f\'(x₀)예요!',
      en:'The slope of the line that just touches a curve at one point (a tangent line) is exactly the derivative f\'(x₀) at that point!',
      zh:'在曲线上某一点轻轻碰到曲线的直线(切线)，其斜率正是该点的导数f\'(x₀)！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 접선의 기울기 = 미분계수',en:'1) Tangent slope = derivative value',zh:'① 切线斜率=导数值'},
        head:{ko:"f(x)=x^2 \\;\\Rightarrow\\; x=3\\text{에서 접선의 기울기}=6",en:"f(x)=x^2 \\;\\Rightarrow\\; x=3\\text{에서 접선의 기울기}=6",zh:"f(x)=x^2 \\;\\Rightarrow\\; x=3\\text{에서 접선의 기울기}=6"},
        desc:{ko:'앞 유닛에서 배운 미분계수 f\'(x₀)는 사실 "곡선 위 그 점에서 접선이 얼마나 가파른가"였어요. f(x)=x²의 도함수는 f\'(x)=2x이니, x=3에서는 f\'(3)=6 — 그 점에 살짝 닿는 직선의 기울기가 바로 6이에요.',
              en:'The derivative value f\'(x₀) from the previous unit was actually "how steep the tangent line is at that point on the curve." For f(x)=x², the derivative is f\'(x)=2x, so at x=3, f\'(3)=6 — the slope of the line just touching that point is exactly 6.',
              zh:'上一单元学的导数值f\'(x₀)其实就是"曲线上该点切线有多陡"。f(x)=x²的导数是f\'(x)=2x，所以在x=3处f\'(3)=6——轻触该点的直线斜率正是6。'},
        mathSteps:["f'(x)=2x", "f'(3)=2\\times3", '=6'],
        result:{ko:'접선의 기울기를 구하는 건 곧 미분계수를 구하는 거예요!',en:'Finding a tangent slope is exactly finding a derivative value!',zh:'求切线斜率其实就是求导数值！'},
        book:{ko:'접선은 그 점 근처에서 곡선과 거의 겹쳐 보일 만큼 딱 맞게 스치는 직선이에요.',
              en:'A tangent line hugs the curve so closely near that point that they almost overlap.',
              zh:'切线在该点附近紧贴曲线，几乎重合。'} },

      { tag:{ko:'② 접선의 방정식 y=mx+n',en:'2) The tangent line equation y=mx+n',zh:'② 切线方程y=mx+n'},
        head:{ko:'f(x)=x^2,\\;x_0=3 \\;\\Rightarrow\\; y=6x-9',en:'f(x)=x^2,\\;x_0=3 \\;\\Rightarrow\\; y=6x-9',zh:'f(x)=x^2,\\;x_0=3 \\;\\Rightarrow\\; y=6x-9'},
        desc:{ko:'접선의 기울기 m=f\'(x₀)=6을 구했으면, 그 점의 y좌표 f(3)=9를 이용해 y=m(x-x₀)+f(x₀)에 대입해요: y=6(x-3)+9=6x-18+9=6x-9. 정리하면 y=mx+n 꼴에서 n=f(x₀)-m·x₀예요.',
              en:'Once you have the slope m=f\'(x₀)=6, use the point\'s y-value f(3)=9 in y=m(x-x₀)+f(x₀): y=6(x-3)+9=6x-18+9=6x-9. Rearranged into y=mx+n form, n=f(x₀)-m·x₀.',
              zh:'求出斜率m=f\'(x₀)=6后，用该点的y值f(3)=9代入y=m(x-x₀)+f(x₀)：y=6(x-3)+9=6x-18+9=6x-9。整理成y=mx+n的形式，n=f(x₀)-m·x₀。'},
        mathSteps:['m=6,\\;f(3)=9', 'y=6(x-3)+9', '=6x-9'],
        result:{ko:'m=f\'(x₀), n=f(x₀)-m·x₀ — 두 단계면 접선의 방정식 완성!',en:'m=f\'(x₀), n=f(x₀)-m·x₀ — two steps and the tangent line is done!',zh:'m=f\'(x₀)，n=f(x₀)-m·x₀——两步就写出切线方程！'},
        book:{ko:'접선의 방정식은 "그 점을 지나는 직선 중 기울기가 f\'(x₀)인 것"이라는 뜻이에요 — 두 조건(점, 기울기)만 있으면 직선이 하나로 정해져요.',
              en:'The tangent line equation means "the line through that point with slope f\'(x₀)" — a line is uniquely determined by one point and one slope.',
              zh:'切线方程的意思是"过该点、斜率为f\'(x₀)的直线"——只要有一点和一个斜率，直线就唯一确定了。'} }
    ],
    rule:{ ko:'접선의 기울기 m=f\'(x₀). 접선의 방정식 y=mx+n에서 n=f(x₀)-m·x₀.',
      en:'The tangent slope m=f\'(x₀). For the tangent line y=mx+n, n=f(x₀)-m·x₀.',
      zh:'切线斜率m=f\'(x₀)。切线方程y=mx+n中，n=f(x₀)-m·x₀。' }
  },

  check:{
    fills:[
      { tex:'f(x)=x^2+1,\\;x_0=2 \\;\\Rightarrow\\; \\text{기울기}=\\square', answer:4,
        hint:{ ko:"f'(x)=2x, f'(2)=4", en:"f'(x)=2x, f'(2)=4", zh:"f'(x)=2x，f'(2)=4" } },
      { tex:'f(x)=x^2,\\;x_0=1 \\;\\Rightarrow\\; y=\\square x + \\square', answer:[2,-1],
        hint:{ ko:'m=2, f(1)=1, n=1-2×1=-1', en:'m=2, f(1)=1, n=1-2×1=-1', zh:'m=2，f(1)=1，n=1-2×1=-1' } }
    ],
    open:{ ko:'f(x)=x²-2x, x₀=2에서 접선의 방정식을 구하는 과정을 설명해봐요.',
      en:'Explain how to find the tangent line equation for f(x)=x²-2x at x₀=2.',
      zh:'说说f(x)=x²-2x在x₀=2处切线方程的求法。' },
    openHint:{ ko:"f'(x)=2x-2, f'(2)=2, f(2)=0 → y=2(x-2)+0=2x-4",
      en:"f'(x)=2x-2, f'(2)=2, f(2)=0 → y=2(x-2)+0=2x-4",
      zh:"f'(x)=2x-2，f'(2)=2，f(2)=0 → y=2(x-2)+0=2x-4" }
  },

  lab:{
    generator:'md45_tangentLine', level:'main', count:4,
    params:{mode:'lineEq'},
    intro:{
      ko:'이번엔 접선의 방정식까지! m과 n을 순서대로 구해봐.',
      en:'The full tangent equation this time! Find m and n in order.',
      zh:'这次要求出完整的切线方程！按顺序求出m和n。'
    }
  },

  arena:{
    generator:'md45_tangentLine', level:'main', count:8, timeLimit:300,
    params:{mode:'lineEq',wide:true},
    rule:{ ko:'5분 안에 더 큰 범위의 접선의 방정식을 모두 구해요!', en:'Find all the wider-range tangent line equations in 5 minutes!', zh:'5分钟内求出所有更大范围的切线方程！' }
  },

  stamp:{ label:{ ko:'접선 설계사', en:'Tangent-Line Architect', zh:'切线设计师' }, coins:56 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'곡선에 딱 맞게 스치는 직선을 정확히 그려냈구나! 📏',en:'You drew the line that hugs the curve just right!',zh:'你准确画出了紧贴曲线的直线！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'접선의 기울기는 그 점에서의 미분계수 f\'(x₀)야!',en:'The tangent slope is the derivative value f\'(x₀) at that point!',zh:'切线斜率就是该点的导数值f\'(x₀)！'}, {ko:'n=f(x₀)-m·x₀ 순서로 구해!',en:'Find n as f(x₀)-m·x₀!',zh:'按n=f(x₀)-m·x₀求出n！'} ],
    finish:{ ko:'완벽해! 접선 설계사! 📏✨', en:'Perfect! Tangent-Line Architect!', zh:'完美！切线设计师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
