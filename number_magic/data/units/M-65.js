/* Numbers of Magic — 유닛 M-65: 일차함수의 기울기와 절편 (중2 W9 · 중등 교과 연산 3차 2026-09-20)
   표기 주의: 이 파일의 tex 는 KaTeX 간격 명령으로 `\quad` 만 쓴다(mid9.js 상단 주석 참조). */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-65'] = {
  id:'M-65', tier:'middle2', level:'33', order:17,
  generator:'md65_linearFunction',
  title:{ ko:'일차함수의 기울기와 절편', en:'Slope & Intercept of a Linear Function', zh:'一次函数的斜率与截距' },
  subtitle:{ ko:'두 점만 있으면 직선 하나가 정해져요', en:'Two points are enough to pin down one straight line', zh:'只要两个点，就能确定一条直线' },
  icon:'📈',

  practice:{
    generator:'md65_linearFunction', level:'practice', count:5,
    params:{mode:'slope'},
    intro:{
      ko:'오른쪽으로 갈 때 위로 몇 칸 올라가는지 세어 보세요 — 그게 기울기예요!',
      en:'Count how many steps up you take for the steps you take right — that is the slope!',
      zh:'数一数向右走时向上走了几格——那就是斜率！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'도로의 "경사 8%" 표지판은 100m를 가는 동안 8m 올라간다는 뜻이에요. 8÷100 = 0.08 — 이게 바로 그 도로의 기울기예요. 정비례(y=ax)에서 배운 a가 원점을 떠나 어디서든 출발할 수 있게 된 게 일차함수 y=ax+b예요.',
        en:'A road sign reading "8% grade" means you climb 8 m over every 100 m you travel. 8 divided by 100 is 0.08, and that is the road’s slope. A linear function y=ax+b is just the a you met in direct proportion, now free to start from anywhere instead of the origin.',
        zh:'路牌上的"坡度8%"是说每走100米上升8米。8÷100 = 0.08——这就是那条路的斜率。一次函数y=ax+b，就是你在正比例(y=ax)里认识的a，现在不必从原点出发，可以从任何地方开始。' },
      history:{ ko:'점을 두 수의 짝으로 적는 방법은 1637년 데카르트의 『방법서설』 부록에서 나왔어요. 침대에 누워 천장의 파리 위치를 두 벽에서 잰 거리로 적을 수 있다는 걸 깨달았다는 이야기가 전해져요. 이 덕분에 도형 문제를 식으로, 식을 그래프로 바꿔 볼 수 있게 됐어요.',
        en:'Writing a point as a pair of numbers came from an appendix to the Discourse on the Method by Descartes in 1637. The story goes that, lying in bed, he realised a fly on the ceiling could be pinned down by its distances from two walls. That idea let geometry problems become equations, and equations become graphs.',
        zh:'把一个点写成两个数的一对，出自1637年笛卡儿《方法论》的附录。传说他躺在床上时意识到：天花板上的苍蝇，可以用它到两面墙的距离来确定位置。有了这个想法，几何问题才能变成式子，式子才能变成图象。' }
    },
    stages:[
      { tag:{ko:'① 기울기 = (y의 증가량) ÷ (x의 증가량)',en:'1) Slope is the change in y divided by the change in x',zh:'① 斜率 = (y的增量) ÷ (x的增量)'},
        head:{ko:'(1,\\, 3), \\quad (4,\\, 12) \\quad\\Rightarrow\\quad a = 3',en:'(1,\\, 3), \\quad (4,\\, 12) \\quad\\Rightarrow\\quad a = 3',zh:'(1,\\, 3), \\quad (4,\\, 12) \\quad\\Rightarrow\\quad a = 3'},
        desc:{ko:'x가 1에서 4로 3만큼 갈 동안 y는 3에서 12로 9만큼 올라갔어요. 9÷3=3 — 오른쪽 1칸마다 3칸씩 오른다는 뜻이에요. <b>어느 두 점을 골라도 같은 값</b>이 나오는 게 직선의 성질이에요.',
              en:'While x moves 3 (from 1 to 4), y climbs 9 (from 3 to 12). Nine divided by three is three, meaning three steps up for every step right. The defining property of a straight line is that <b>any two points give the same value</b>.',
              zh:'x从1到4走了3，y从3到12升了9。9÷3=3，就是向右1格上升3格。直线的性质就是<b>取哪两个点算出来都一样</b>。'},
        mathSteps:['12 - 3 = 9', '4 - 1 = 3', 'a = 9 \\div 3 = 3'],
        result:{ko:'기울기는 "얼마나 가파른가"를 수 하나로 적은 거예요!',en:'The slope writes "how steep" as a single number!',zh:'斜率就是把"有多陡"写成一个数！'},
        book:{ko:'기울기가 음수면 오른쪽으로 갈수록 <b>내려가는</b> 직선이에요. 0이면 수평선이고요. 분모가 되는 (x의 증가량)이 0이면 수직선인데, 이건 함수가 아니에요(x 하나에 y가 여럿).',
              en:'A negative slope means the line goes <b>down</b> as you move right; zero means it is horizontal. If the denominator is 0 you get a vertical line — which is not a function, since one x would have many y values.',
              zh:'斜率为负，表示向右走时直线<b>下降</b>；为0就是水平线。若分母(x的增量)为0，就是竖直线——那不是函数，因为一个x对应多个y。'} },

      { tag:{ko:'② y절편 — 한 점을 식에 넣어 구하기',en:'2) The y-intercept — put one point into the equation',zh:'② y截距——把一个点代入式子求出'},
        head:{ko:'a = 3, \\quad (1,\\, 5) \\quad\\Rightarrow\\quad y = 3x + 2',en:'a = 3, \\quad (1,\\, 5) \\quad\\Rightarrow\\quad y = 3x + 2',zh:'a = 3, \\quad (1,\\, 5) \\quad\\Rightarrow\\quad y = 3x + 2'},
        desc:{ko:'점이 그래프 위에 있다는 건 그 좌표를 넣으면 <b>등식이 성립한다</b>는 뜻이에요. y=3x+b에 (1,5)를 넣으면 5=3+b, 그래서 b=2예요.',
              en:'A point being on the graph means its coordinates <b>make the equation true</b>. Putting the point into y=3x+b gives 5=3+b, so b is 2.',
              zh:'点在图象上，就是说把坐标代进去<b>等式成立</b>。把(1,5)代入y=3x+b得5=3+b，所以b=2。'},
        mathSteps:['5 = 3(1) + b', 'b = 5 - 3 = 2', 'y = 3x + 2'],
        result:{ko:'기울기와 점 하나면 직선의 식이 완성돼요!',en:'One slope plus one point completes the equation of the line!',zh:'有了斜率和一个点，直线的式子就完成了！'},
        book:{ko:'y절편 b는 <b>x=0일 때의 y값</b>, 즉 그래프가 y축과 만나는 높이예요. 두 점 중 아무 점을 넣어도 b는 같게 나와요 — 다르게 나왔다면 기울기를 잘못 구한 거예요.',
              en:'The y-intercept is <b>the y value when x is zero</b> — the height at which the graph meets the y-axis. Either of the two points gives the same value; if they disagree, the slope was wrong.',
              zh:'y截距b就是<b>x=0时的y值</b>，也就是图象与y轴相交的高度。用两点中哪一个代入，b都一样；若不一样，说明斜率算错了。'} }
    ],
    rule:{ ko:'기울기는 (y의 증가량)÷(x의 증가량), y절편은 x=0일 때의 높이 — 이 둘이면 직선 하나가 정해져요!',
      en:'Slope is the change in y divided by the change in x, and the y-intercept is the height at x=0 — those two pin down one line!',
      zh:'斜率是(y的增量)÷(x的增量)，y截距是x=0时的高度——有这两个就确定了一条直线！' }
  },

  check:{
    fills:[
      { tex:'(0,\\, 1), \\quad (2,\\, 7) \\quad\\Rightarrow\\quad a = \\square', answer:3,
        hint:{ ko:'(7−1)÷(2−0)', en:'(7−1)÷(2−0)', zh:'(7−1)÷(2−0)' } },
      { tex:'a = 2, \\quad (3,\\, 10) \\quad\\Rightarrow\\quad y = 2x + \\square', answer:4,
        hint:{ ko:'10=6+b', en:'10=6+b', zh:'10=6+b' } }
    ],
    open:{ ko:'(1,5)와 (3,11)을 지나는 직선의 식을 구하는 과정을 말해봐요.',
      en:'Explain how to find the equation of the line through (1,5) and (3,11).',
      zh:'说说怎样求过(1,5)和(3,11)的直线的式子。' },
    openHint:{ ko:'a=3, b=2 → y=3x+2',
      en:'a=3, b=2 → y=3x+2',
      zh:'a=3，b=2 → y=3x+2' }
  },

  lab:{
    generator:'md65_linearFunction', level:'main', count:4,
    params:{mode:'intercept',wide:true},
    intro:{
      ko:'기울기와 점 하나를 식에 넣어 y절편을 구해 보세요!',
      en:'Put the slope and the one point into the equation and solve for the y-intercept!',
      zh:'把斜率和那一个点代入式子，求出y截距！'
    }
  },

  arena:{
    generator:'md65_linearFunction', level:'main', count:8, timeLimit:360,
    params:{mode:'fromPoints',wide:true},
    rule:{ ko:'6분 안에 두 점만 보고 직선의 식을 완성해요!', en:'Within 6 minutes, build the equation of the line from just two points!', zh:'6分钟内仅凭两个点写出直线的式子！' }
  },

  stamp:{ label:{ ko:'경사의 측량사', en:'Surveyor of Slopes', zh:'坡度测量师' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'기울기를 정확히 읽었구나! 📈',en:'You read the slope exactly right!',zh:'你把斜率读得分毫不差！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'분모와 분자를 바꿔 쓰지 않았는지 봐! y가 위야.',en:'Check you did not swap them — the change in y goes on top!',zh:'看看是不是把分子分母写反了！y的增量在上面。'}, {ko:'점의 좌표를 식에 넣으면 b가 나와!',en:'Put the point’s coordinates into the equation to get b!',zh:'把点的坐标代入式子就能求出b！'} ],
    finish:{ ko:'완벽해! 경사의 측량사! 📈✨', en:'Perfect! Surveyor of Slopes!', zh:'完美！坡度测量师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
