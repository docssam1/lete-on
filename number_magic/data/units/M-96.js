/* Numbers of Magic — 유닛 M-96: 복소수가 서로 같을 조건 (고등 공통수학1 · 과정 40 복소수, 2026-09-29)
   근거: docs/high-build-spec.md MD96. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-96'] = {
  id:'M-96', tier:'highmath1', level:'40', order:96,
  generator:'md96_complexEqual',
  title:{ ko:'복소수가 서로 같을 조건', en:'When Two Complex Numbers Are Equal', zh:'复数相等的条件' },
  subtitle:{ ko:'실수부분끼리, 허수부분끼리 같다고 놓습니다', en:'Set the real parts equal and the imaginary parts equal', zh:'令实部相等、虚部相等' },
  icon:'⚖️',

  practice:{
    generator:'md96_complexEqual', level:'practice', count:6,
    params:{mode:'one'},
    intro:{
      ko:'두 복소수가 같으면 실수부분도 같고 허수부분도 같습니다. 미지수가 있는 쪽을 같다고 놓습니다.',
      en:'If two complex numbers are equal, their real parts are equal and so are their imaginary parts. Set the part with the unknown equal.',
      zh:'两个复数相等，实部相等，虚部也相等。令含未知数的那部分相等。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'(x+1)+(y−2)i=4+3i에서 x, y는 실수입니다. 식은 하나인데 미지수는 둘입니다. 그런데 복소수의 등식은 사실 등식 두 개를 한꺼번에 담고 있습니다.',
        en:'In (x+1)+(y−2)i=4+3i, x and y are real. There is one equation but two unknowns — yet a complex equation actually carries two equations at once.',
        zh:'(x+1)+(y−2)i=4+3i中x、y是实数。只有一个等式却有两个未知数——其实一个复数等式同时包含两个等式。' },
      history:{ ko:'a+bi에서 a와 b가 실수이면 이 둘은 서로 섞이지 않습니다. 실수 a가 허수 bi가 될 수 없으므로, 두 복소수가 같으려면 두 부분이 각각 같아야 합니다.',
        en:'When a and b are real, the two parts of a+bi never mix: a real number cannot become an imaginary bi. So for two complex numbers to be equal, each part must match.',
        zh:'a、b为实数时，a+bi的两部分互不混合：实数a不会变成虚数bi。所以两个复数相等，两部分必须各自相等。' }
    },
    stages:[
      { tag:{ko:'① 등식 하나 = 등식 두 개',en:'1) One equation = two equations',zh:'① 一个等式 = 两个等式'},
        head:{ko:'(x+1)+(y-2)i=4+3i',en:'(x+1)+(y-2)i=4+3i',zh:'(x+1)+(y-2)i=4+3i'},
        desc:{ko:'실수부분에서 <b>x+1=4</b>, 허수부분에서 <b>y−2=3</b>입니다. 따라서 x=3, y=5입니다.',
              en:'The real parts give <b>x+1=4</b> and the imaginary parts give <b>y−2=3</b>, so x=3 and y=5.',
              zh:'实部得<b>x+1=4</b>，虚部得<b>y−2=3</b>，所以x=3、y=5。'},
        mathSteps:['x+1=4,\\quad y-2=3', 'x=3,\\quad y=5'],
        result:{ko:'미지수 두 개도 한 번에 풀립니다!',en:'Two unknowns solved in one go!',zh:'两个未知数一次解出！'},
        book:{ko:'x, y가 실수라는 조건이 꼭 필요합니다. 그래야 x+1이 실수부분, y−2가 허수부분이 됩니다.',
              en:'The condition that x and y are real is essential; only then is x+1 the real part and y−2 the imaginary part.',
              zh:'x、y为实数这个条件必不可少，这样x+1才是实部，y−2才是虚部。'} },

      { tag:{ko:'② 먼저 정리하고 비교',en:'2) Tidy up first, then compare',zh:'② 先整理再比较'},
        head:{ko:'x(1+i)+y(2-i)=5+2i',en:'x(1+i)+y(2-i)=5+2i',zh:'x(1+i)+y(2-i)=5+2i'},
        desc:{ko:'좌변을 펼쳐 모으면 (x+2y)+(x−y)i입니다. <b>x+2y=5, x−y=2</b>를 연립하면 x=3, y=1입니다.',
              en:'Expanding and collecting the left side gives (x+2y)+(x−y)i. Solving <b>x+2y=5 and x−y=2</b> together gives x=3 and y=1.',
              zh:'展开整理左边得(x+2y)+(x−y)i。联立<b>x+2y=5、x−y=2</b>得x=3、y=1。'},
        mathSteps:['(x+2y)+(x-y)i=5+2i', 'x+2y=5,\\quad x-y=2', 'x=3,\\quad y=1'],
        result:{ko:'실수부분·허수부분 꼴로 정리해야 비교할 수 있습니다!',en:'Sort into real and imaginary parts before comparing!',zh:'整理成实部和虚部的形式才能比较！'},
        book:{ko:'연립방정식은 한 식에서 다른 식을 빼면 문자 하나가 사라집니다.',
              en:'In the system, subtracting one equation from the other removes one letter.',
              zh:'方程组中一式减另一式就消去一个字母。'} }
    ],
    rule:{ ko:'a, b, c, d가 실수일 때 a+bi=c+di ⇔ a=c 그리고 b=d — 먼저 실수부분·허수부분 꼴로 정리합니다',
      en:'For real a, b, c, d: a+bi=c+di ⇔ a=c and b=d — first sort into real and imaginary parts',
      zh:'a、b、c、d为实数时，a+bi=c+di ⇔ a=c且b=d——先整理成实部与虚部' }
  },

  check:{
    fills:[
      { tex:'(2x-1)+3i=5+3i \\;\\Rightarrow\\; x=\\square', answer:3,
        hint:{ ko:'2x−1=5', en:'2x−1=5', zh:'2x−1=5' } },
      { tex:'4+(y+6)i=4+2i \\;\\Rightarrow\\; y=\\square', answer:-4,
        hint:{ ko:'y+6=2', en:'y+6=2', zh:'y+6=2' } }
    ],
    open:{ ko:'x, y가 실수일 때 (x+y)+(x−y)i=6+2i를 푸는 과정을 설명해 봅니다.',
      en:'Explain how to solve (x+y)+(x−y)i=6+2i for real x and y.',
      zh:'说说x、y为实数时解(x+y)+(x−y)i=6+2i的过程。' },
    openHint:{ ko:'x+y=6, x−y=2이므로 x=4, y=2입니다.',
      en:'x+y=6 and x−y=2, so x=4 and y=2.',
      zh:'x+y=6、x−y=2，所以x=4、y=2。' }
  },

  lab:{
    generator:'md96_complexEqual', level:'main', count:6,
    params:{mode:'two'},
    intro:{
      ko:'실수부분에서 x, 허수부분에서 y를 따로 구해 두 칸에 씁니다.',
      en:'Find x from the real parts and y from the imaginary parts, and fill in both boxes.',
      zh:'由实部求x、由虚部求y，填入两格。'
    }
  },

  arena:{
    generator:'md96_complexEqual', level:'main', count:6, timeLimit:480,
    params:{mode:'mixed'},
    rule:{ ko:'8분 안에 좌변을 정리하고 연립방정식을 세워 x, y를 모두 구합니다!', en:'Within 8 minutes, tidy up the left side, set up the system and find x and y!', zh:'8分钟内整理左边、列方程组求出x和y！' }
  },

  stamp:{ label:{ ko:'복소수 저울사', en:'Complex Balancer', zh:'复数天平师' }, coins:49 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'두 부분을 딱 맞췄구나! ⚖️',en:'Both parts balanced perfectly!',zh:'两部分对得刚刚好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'실수부분끼리, 허수부분끼리 같다고 놓아 봐!',en:'Set real with real, imaginary with imaginary!',zh:'令实部与实部、虚部与虚部相等！'}, {ko:'좌변을 먼저 a+bi 꼴로 정리해 봐!',en:'First sort the left side into the form a+bi!',zh:'先把左边整理成a+bi的形式！'} ],
    finish:{ ko:'완벽해! 복소수 저울사! ⚖️✨', en:'Perfect! Complex Balancer!', zh:'完美！复数天平师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
