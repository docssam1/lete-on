/* Numbers of Magic — 유닛 A-18: 앞부터 더하기 (초급 E 챕터2) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};
window.NM_UNITS['A-18'] = {
  id:'A-18', tier:'beginner', level:'A', order:18,
  generator:'addFromFront',
  title:{ ko:'앞부터 더하기', en:'Add from the Front', zh:'从前往后相加' },
  subtitle:{ ko:'백의 자리부터 차례로 더해 나가요', en:'Add hundreds first, then tens, then ones', zh:'先加百位，再加十位，最后加个位' },
  icon:'⬅️',

  practice:{
    generator:'addFromFront', level:'practice', count:5,
    intro:{ ko:'먼저 백의 자리끼리만 더하는 연습이에요!', en:'Practice adding just the hundreds first!', zh:'先练习只加百位！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 백의 자리부터 더해요', en:'1) Start with the hundreds', zh:'① 先加百位' },
        head:{ ko:'제일 큰 자리부터 차례로 누적해요', en:'Accumulate from the biggest place down', zh:'从最大数位开始依次累加' },
        desc:{ ko:'357+468: <b>먼저 300+400=700</b>. 그 다음 50+60=110을 더해 810. 마지막에 7+8=15을 더해 825!',
               en:'357+468: <b>First 300+400=700</b>. Then add 50+60=110 to get 810. Finally add 7+8=15 to get 825!',
               zh:'357+468：<b>先算300+400=700</b>。再加50+60=110得810。最后加7+8=15得825！' },
        mathSteps:['357 + 468','300 + 400 = 700','700 + 110 = 810','810 + 15 = 825'],
        result:{ ko:'큰 자리부터 더하면 중간 결과를 바로 확인할 수 있어요!', en:'Adding from the front lets you check partial results right away!', zh:'从前往后加，可以随时确认中间结果！' },
        book:null },
      { tag:{ ko:'② 왜 앞부터 더할까요?', en:'2) Why add from the front?', zh:'② 为什么从前往后加？' },
        head:{ ko:'계산하면서 어림값을 바로 알 수 있어요', en:'You get an estimate as you calculate', zh:'一边算一边就能得到估算值' },
        desc:{ ko:'백의 자리를 먼저 더하면 <b>"대략 700쯤 되겠구나"</b>라는 걸 즉시 알 수 있어요. 이걸 누적해 나가면 정확한 답이 나와요.',
               en:'Adding hundreds first instantly tells you <b>"it\'s around 700"</b>. Keep accumulating to get the exact answer.',
               zh:'先加百位，就立刻知道<b>"大约700左右"</b>。继续累加就能得到精确答案。' },
        mathSteps:['246 + 379','200 + 300 = 500','500 + 40 + 70 = 610','610 + 6 + 9 = 625'],
        result:{ ko:'246+379=625 ✓', en:'246+379=625 ✓', zh:'246+379=625 ✓' },
        book:null }
    ],
    rule:{ ko:'① 백의 자리끼리 더한다  ② 그 합에 십의 자리 합을 더한다  ③ 마지막으로 일의 자리 합을 더한다',
      en:'① Add the hundreds  ② Add the tens to that sum  ③ Finally add the ones',
      zh:'①加百位 ②再加十位 ③最后加个位' }
  },

  check:{
    fills:[
      { tex:'357+468: 300+400=\\square', answer:700, hint:{ ko:'백의 자리끼리 먼저!', en:'Hundreds first!', zh:'先加百位！' } },
      { tex:'700+110+15=\\square', answer:825, hint:{ ko:'700에 110, 그리고 15를 차례로 더해요', en:'Add 110 then 15 to 700', zh:'依次加110再加15' } }
    ],
    open:{ ko:'앞부터 더하기와 세로셈의 차이점을 설명해봐요.', en:'Explain the difference between adding from the front and column addition.', zh:'说说从前往后加和竖式相加的区别。' },
    openHint:{ ko:'앞부터 더하면 큰 자리부터 알고, 세로셈은 작은 자리(일의 자리)부터 올라와요.', en:'Front-to-back gives you big-place info first; column addition works small-to-big.', zh:'从前往后先知道大位的结果，竖式则从小位开始。' }
  },

  lab:{ generator:'addFromFront', level:'main', count:4,
    intro:{ ko:'앞에서부터 차례로 더하는 마법을 써봐요!', en:'Use the magic of adding front to back!', zh:'施展从前往后加的魔法吧！' } },

  arena:{ generator:'addFromFront', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한! 백→십→일 순서로!', en:'As many as you can! Hundreds → Tens → Ones!', zh:'5分钟内尽量多做！百→十→个！' } },

  stamp:{ label:{ ko:'앞부터 더하기 마법사', en:'Front-Adder', zh:'从前往后相加魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'완벽해! ⬅️✨',en:'Perfect!',zh:'完美！'}, {ko:'앞부터 더하기 성공!',en:'Front-add success!',zh:'从前往后加成功！'} ],
    wrong:[ {ko:'백의 자리부터 먼저!',en:'Start with hundreds first!',zh:'先加百位！'}, {ko:'천천히 누적해봐!',en:'Accumulate step by step!',zh:'一步步累加！'} ],
    finish:{ ko:'훌륭해! 앞부터 더하기 마법사야! ⬅️✨', en:"Great! You're a front-adder!", zh:'太棒了！你是从前往后相加魔法师！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
