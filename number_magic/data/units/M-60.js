/* Numbers of Magic — 유닛 M-60: 극값(극대·극소) (미적분Ⅰ W14 심화, 2026-08-27) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-60'] = {
  id:'M-60', tier:'calculus1', level:'45', order:3,
  generator:'md60_extrema',
  title:{ ko:'극값(극대·극소)', en:'Extrema (Local Max & Min)', zh:'极值(极大值·极小值)' },
  subtitle:{ ko:"f'(x)=0인 자리가 산꼭대기와 골짜기예요", en:"Where f'(x)=0 are the hilltops and valleys", zh:"f'(x)=0的位置就是山顶和谷底" },
  icon:'⛰️',

  practice:{
    generator:'md60_extrema', level:'practice', count:5,
    params:{mode:'points'},
    intro:{
      ko:"곡선이 올라가다가 잠깐 멈추고(기울기 0) 다시 내려가는 지점 — 그게 극값이에요. f'(x)=0을 풀면 그 자리를 찾을 수 있어요!",
      en:"A curve rises, pauses for a moment (slope 0), then falls again — that's an extremum. Solving f'(x)=0 finds that spot!",
      zh:"曲线上升后短暂停顿(斜率为0)再下降的地方——那就是极值。解f'(x)=0就能找到那个位置！"
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'롤러코스터가 산꼭대기에 도착하는 순간, 아주 잠깐 수평이 돼요(기울기=0) — 그 직후엔 다시 내려가죠. 이 "잠깐 수평이 되는 지점"이 바로 극댓값이에요. 골짜기의 가장 낮은 지점도 마찬가지로 기울기가 0이에요(극솟값).',
        en:'When a roller coaster reaches the top of a hill, for just a moment it becomes level (slope=0) — right after, it goes back down. That "momentarily level spot" is exactly a local max. The bottom of a valley works the same way, with slope 0 too (a local min).',
        zh:'过山车到达山顶的瞬间，会有片刻是水平的(斜率=0)——紧接着又开始下降。这个"瞬间水平的点"正是极大值。山谷最低点也一样，斜率为0(极小值)。' },
      history:{ ko:'"기울기가 0인 곳에서 극값이 생긴다"는 원리는 17세기 페르마가 처음 발견했어요(미분이 발명되기도 전이에요!). 뉴턴과 라이프니츠의 미적분학이 이 원리를 f\'(x)=0이라는 정확한 방정식으로 다듬었어요.',
        en:'The principle that "extrema occur where the slope is 0" was first discovered by Fermat in the 17th century — even before calculus itself was invented! Newton and Leibniz\'s calculus later refined it into the precise equation f\'(x)=0.',
        zh:'"斜率为0处产生极值"这一原理最早由17世纪的费马发现(那时微积分还没被发明！)。牛顿和莱布尼茨的微积分后来把它精炼成f\'(x)=0这个精确的方程。' }
    },
    stages:[
      { tag:{ko:"① f'(x)=0을 풀면 극값의 자리가 나와요",en:"1) Solving f'(x)=0 finds where extrema occur",zh:"① 解f'(x)=0就能找到极值的位置"},
        head:{ko:"f(x)=x^3-3x^2 \\;\\Rightarrow\\; f'(x)=0\\text{의 해}: x=0,\\;2",en:"f(x)=x^3-3x^2 \\;\\Rightarrow\\; f'(x)=0\\text{의 해}: x=0,\\;2",zh:"f(x)=x^3-3x^2 \\;\\Rightarrow\\; f'(x)=0\\text{의 해}: x=0,\\;2"},
        desc:{ko:"먼저 도함수를 구해요: f'(x)=3x²-6x. 이걸 0으로 두면 3x(x-2)=0이니 <b>x=0 또는 x=2</b> — 이 두 자리가 곡선이 잠깐 수평이 되는 지점이에요.",
              en:"First find the derivative: f'(x)=3x²-6x. Setting it to 0 gives 3x(x-2)=0, so <b>x=0 or x=2</b> — these two spots are where the curve momentarily levels out.",
              zh:"先求导数：f'(x)=3x²-6x。令其为0，3x(x-2)=0，得<b>x=0或x=2</b>——这两处正是曲线瞬间变水平的位置。"},
        mathSteps:["f'(x)=3x^2-6x", '3x(x-2)=0', 'x=0,\\;2'],
        result:{ko:"f'(x)=0의 해가 바로 극값을 갖는 x좌표!",en:"The solutions of f'(x)=0 are exactly the x-coordinates of the extrema!",zh:"f'(x)=0的解正是极值的x坐标！"},
        book:{ko:'x=0에서는 부호가 +에서 −로 바뀌어(극대), x=2에서는 −에서 +로 바뀌어요(극소) — 부호가 안 바뀌면 극값이 아니에요.',
              en:'At x=0 the sign flips + to − (a local max), and at x=2 it flips − to + (a local min) — if the sign doesn\'t flip, it\'s not an extremum.',
              zh:'x=0处符号由+变−(极大)，x=2处符号由−变+(极小)——符号不变就不是极值。'} },

      { tag:{ko:'② 그 x를 f(x)에 다시 넣으면 극값(높이)이 나와요',en:'2) Substituting that x back into f(x) gives the extreme value',zh:'② 把那个x代回f(x)就得到极值(高度)'},
        head:{ko:'f(0)=0,\\;f(2)=-4 \\;\\Rightarrow\\; \\text{극댓값}=0,\\;\\text{극솟값}=-4',en:'f(0)=0,\\;f(2)=-4 \\;\\Rightarrow\\; \\text{극댓값}=0,\\;\\text{극솟값}=-4',zh:'f(0)=0,\\;f(2)=-4 \\;\\Rightarrow\\; \\text{극댓값}=0,\\;\\text{극솟값}=-4'},
        desc:{ko:'x=0,2는 "몇 번째 x인지"만 알려줄 뿐, 산의 <b>높이(실제 값)</b>는 원래 함수 f(x)에 다시 대입해야 나와요: f(0)=0³-3(0)²=0, f(2)=2³-3(2)²=8-12=−4.',
              en:'x=0,2 only tell you "which x" — the actual <b>height (value)</b> of the hill needs substituting back into the original f(x): f(0)=0³-3(0)²=0, f(2)=2³-3(2)²=8-12=−4.',
              zh:'x=0,2只告诉你"是哪个x"——山的实际<b>高度(值)</b>要代回原函数f(x)才能得到：f(0)=0³-3(0)²=0，f(2)=2³-3(2)²=8-12=−4。'},
        mathSteps:['f(0)=0', 'f(2)=8-12', '=-4'],
        result:{ko:'극값(높이)을 구하려면 그 x를 원래 함수 f(x)에 대입해요!',en:'To find the extreme value (height), substitute that x back into the original f(x)!',zh:'求极值(高度)要把那个x代回原函数f(x)！'},
        book:{ko:'x가 작은 쪽(x=0)이 극대, 큰 쪽(x=2)이 극소가 된 건 이 함수의 최고차항 계수가 양수(x³)이기 때문이에요.',
              en:'The smaller x (x=0) being the max and the larger x (x=2) being the min happens because this function\'s leading coefficient is positive (x³).',
              zh:'较小的x(x=0)是极大、较大的x(x=2)是极小，是因为这个函数的最高次项系数是正的(x³)。'} }
    ],
    rule:{ ko:"f'(x)=0을 풀어 극값의 x좌표를 찾고, 그 x를 f(x)에 다시 대입하면 극댓값·극솟값(높이)이 나와요!",
      en:"Solve f'(x)=0 to find the x-coordinates of the extrema, then substitute back into f(x) to get the local max/min values!",
      zh:"解f'(x)=0找到极值的x坐标，再代回f(x)就得到极大值·极小值(高度)！" }
  },

  check:{
    fills:[
      { tex:"f(x)=x^3-3x \\;\\Rightarrow\\; f'(x)=0\\text{의 해}: x=\\square,\\;\\square", answer:[-1,1],
        hint:{ ko:"f'(x)=3x^2-3=0", en:"f'(x)=3x^2-3=0", zh:"f'(x)=3x^2-3=0" } },
      { tex:'f(x)=x^3-3x \\;\\Rightarrow\\; \\text{극댓값}=\\square,\\;\\text{극솟값}=\\square', answer:[2,-2],
        hint:{ ko:'f(-1)=-1+3=2, f(1)=1-3=-2', en:'f(-1)=-1+3=2, f(1)=1-3=-2', zh:'f(-1)=-1+3=2, f(1)=1-3=-2' } }
    ],
    open:{ ko:'f(x)=x³-12x의 극값을 구하는 전체 과정을 설명해봐요.',
      en:'Explain the full process of finding the extrema of f(x)=x³-12x.',
      zh:'完整说说求f(x)=x³-12x极值的过程。' },
    openHint:{ ko:"f'(x)=3x²-12=0 → x=±2, f(-2)=16(극대), f(2)=-16(극소)",
      en:"f'(x)=3x²-12=0 → x=±2, f(-2)=16 (max), f(2)=-16 (min)",
      zh:"f'(x)=3x²-12=0 → x=±2，f(-2)=16(极大)，f(2)=-16(极小)" }
  },

  lab:{
    generator:'md60_extrema', level:'main', count:4,
    params:{mode:'values'},
    intro:{
      ko:"f'(x)=0인 x를 찾은 뒤, f(x)에 다시 대입해서 극댓값·극솟값을 구해요!",
      en:"Find where f'(x)=0, then substitute back into f(x) for the local max and min values!",
      zh:"找到f'(x)=0的x后，代回f(x)求极大值·极小值！"
    }
  },

  arena:{
    generator:'md60_extrema', level:'main', count:8, timeLimit:300,
    params:{mode:'wide'},
    rule:{ ko:'5분 안에 더 큰 범위의 극값까지 모두 구해요!', en:'Find every wider-range extremum within 5 minutes!', zh:'5分钟内求出所有更大范围的极值！' }
  },

  stamp:{ label:{ ko:'산봉우리 측정가', en:'Peak Measurer', zh:'山峰测量员' }, coins:74 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:"f'(x)=0부터 극값의 높이까지 완벽하게 구했구나! ⛰️",en:"You found everything from f'(x)=0 to the extreme value's height perfectly!",zh:"你从f'(x)=0到极值的高度都完美求出了！"}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:"먼저 f'(x)=0을 풀어서 x부터 찾아봐!",en:"First solve f'(x)=0 to find x!",zh:"先解f'(x)=0找出x！"}, {ko:'그 x를 원래 함수 f(x)에 다시 대입해야 높이가 나와!',en:'Substitute that x back into the original f(x) to get the height!',zh:'要把那个x代回原函数f(x)才能得到高度！'} ],
    finish:{ ko:'완벽해! 산봉우리 측정가! ⛰️✨', en:'Perfect! Peak Measurer!', zh:'完美！山峰测量员！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
