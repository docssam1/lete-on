/* Numbers of Magic — 유닛 H-08: 제곱·세제곱 계산법 (고급 D-5 · 경시의 탑 28 제곱의 산) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['H-08'] = {
  id:'H-08', tier:'advanced', level:'28', order:2,
  lineage:['place-magic'],
  generator:'adv_sqcube',
  title:{ ko:'제곱·세제곱 계산법', en:'Adjustable-Anchor Squares & Cubes', zh:'平方立方捷算法' },
  subtitle:{ ko:'★를 내가 골라서 어려운 제곱·세제곱도 쉽게!', en:'Pick your own ★ to make tough squares and cubes easy!', zh:'自己挑★，再难的平方立方也变简单！' },
  icon:'⭐',

  practice:{
    generator:'adv_sqcube', level:'practice', count:5,
    params:{mode:'square'},
    intro:{
      ko:'제곱하기 어려운 세 자리 수, ★를 하나 골라서 쉽게 만들어보자!',
      en:'A tricky 3-digit square? Pick a ★ and make it easy!',
      zh:'难算的三位数平方？挑一个★，让它变简单！'
    }
  },

  discover:{
    story:{
      hook:{ ko:'신전 제단의 부피를 두 배로 만들라는 명령. 사람들은 각 변을 두 배로 늘렸어요. 잘한 걸까요?',
        en:'Ordered to double the volume of a stone altar, people doubled every edge. Did that work?',
        zh:'神谕要把石祭坛的体积加倍，人们就把每条边都加长一倍。这样对吗？' },
      history:{ ko:'부피가 여덟 배가 됐어요. 변이 2배면 부피는 2×2×2 = 8배니까요. 그리스 디로스 사람들이 실제로 이 실수를 했다는 이야기가 전해집니다. 부피를 딱 두 배로 만드는 변의 길이는 자와 컴퍼스만으로는 절대 그릴 수 없다는 것이, 2000년이 지난 1837년에 증명됐어요.',
        en:'It became eight times bigger. Double the edge and the volume goes 2 × 2 × 2 = 8. The story says the people of Delos in Greece actually made this mistake. The edge that doubles a cube exactly can never be drawn with straightedge and compass alone — proved in 1837, more than two thousand years later.',
        zh:'体积变成了八倍。边长翻倍，体积就是2 × 2 × 2 = 8倍。传说希腊提洛岛的人真的犯过这个错。而能让立方体体积正好加倍的那条边，用直尺和圆规永远画不出来——这在两千多年后的1837年才被证明。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① ★만큼 벌렸다 좁혔다',en:'1) Spread apart by ★, then close in',zh:'① 用★拉开又收回'},
        head:{ko:'504² = (500×508) + 4²',en:'504² = (500×508) + 4²',zh:'504² = (500×508) + 4²'},
        desc:{ko:'504²을 그냥 곱하면 힘들죠. 대신 ★=4를 골라서, 504보다 4 작은 수(500)와 4 큰 수(508)를 곱하고 ★²를 더해요: 500×508=254000, +4²=16 → <b>254016</b>. 왜 될까요? (원래수+★)×(원래수−★)=원래수²−★²니까, 원래수²=그 곱에 ★²을 더한 거예요!',
              en:'504² directly is hard — instead pick ★=4, multiply the number 4 less (500) by 4 more (508), and add ★²: 500×508=254000, +4²=16 → <b>254016</b>. Why does it work? Since (n+★)(n−★)=n²−★², we get n² by adding ★² back to that product!',
              zh:'直接算504²很难——不如选★=4，把比504小4的数(500)乘以大4的数(508)，再加★²：500×508=254000，+4²=16 → <b>254016</b>。为什么可以这样？因为(n+★)(n−★)=n²−★²，所以n²就是那个积再加上★²！'},
        mathSteps:['500 × 508 = 254000','4² = 16','254000 + 16 = 254016'],
        result:{ko:'504²=254016! ★를 몇백 단위가 되게 골랐더니 계산이 쉬워졌어요.',en:'504²=254016! Choosing ★ to land on a round hundred made it easy.',zh:'504²=254016！选★让数变成整百，计算就简单了。'},
        book:{ko:'★는 504²=500×508+16으로도, 504²=498×510+36(★=6)으로도 풀 수 있어요 — 답은 같지만 몇백 단위로 딱 떨어지는 ★가 훨씬 편해요.',
              en:'You could also use ★=6: 504²=498×510+36 — same answer, but a ★ that lands on a round hundred is much easier.',
              zh:'也可以用★=6：504²=498×510+36——答案一样，但让数落在整百的★算起来方便得多。'} },

      { tag:{ko:'② 세제곱은 한 번 더 곱하기',en:'2) A cube multiplies once more',zh:'② 立方再多乘一次'},
        head:{ko:'제곱 계산법의 결과에 원래 수를 다시 곱해요',en:'Multiply the square trick\'s result by the original number again',zh:'把平方捷算的结果再乘一次原数'},
        desc:{ko:'세제곱 n³은 n²×n이죠. 그래서 (n−★)(n+★)+★²에 n을 한 번 더 곱하면 (n−★)×n×(n+★) + ★²×n이 돼요! 23³을 볼까요: ★=3이면 20×23×26=11960, 3²×23=207 → 11960+207=<b>12167</b>. 제곱 계산법이 그대로 세제곱으로 자연스럽게 이어져요.',
              en:'A cube n³ is n²×n. So multiplying (n−★)(n+★)+★² by n gives (n−★)×n×(n+★) + ★²×n! Try 23³: with ★=3, 20×23×26=11960, and 3²×23=207 → 11960+207=<b>12167</b>. The square trick flows naturally into the cube trick.',
              zh:'立方n³就是n²×n。所以把(n−★)(n+★)+★²再乘n，就得到(n−★)×n×(n+★)+★²×n！试试23³：取★=3，20×23×26=11960，3²×23=207 → 11960+207=<b>12167</b>。平方捷算自然地延伸成了立方捷算。'},
        mathSteps:['20 × 23 × 26 = 11960','3² × 23 = 207','11960 + 207 = 12167'],
        result:{ko:'23³=12167! 제곱법에 원래 수를 한 번 더 곱했을 뿐이에요.',en:'23³=12167! Just multiply the square trick by the original number once more.',zh:'23³=12167！只是把平方捷算再乘一次原数。'},
        book:{ko:'★는 항상 자유롭게 고를 수 있어요 — n의 일의 자리를 지우는 ★가 보통 가장 편해요.',
              en:'You can always choose ★ freely — one that erases the ones digit of n is usually most convenient.',
              zh:'★永远可以自由挑选——通常抹掉n个位数字的那个★最方便。'} }
    ],
    rule:{ ko:'① ★를 편한 값으로 고르기(대개 일의 자리를 지우도록)  ② 제곱: (n−★)(n+★)+★²  ③ 세제곱: 거기에 n을 한 번 더 곱하고 ★²×n을 더하기',
      en:'① Choose ★ conveniently (usually to erase the ones digit)  ② Square: (n−★)(n+★)+★²  ③ Cube: multiply that by n again, adding ★²×n',
      zh:'① 挑一个方便的★（通常抹掉个位）  ② 平方：(n−★)(n+★)+★²  ③ 立方：再乘一次n，加上★²×n' }
  },

  check:{
    fills:[
      { tex:'207^2 = \\square', answer:42849,
        hint:{ ko:'★=7: 200×214+49', en:'★=7: 200×214+49', zh:'★=7：200×214+49' } },
      { tex:'12^3 = \\square', answer:1728,
        hint:{ ko:'★=2: 10×12×14+4×12', en:'★=2: 10×12×14+4×12', zh:'★=2：10×12×14+4×12' } }
    ],
    open:{ ko:'503²을 ★=3과 ★=7 두 가지로 풀어보고, 어느 쪽이 더 편한지 말해 봐요.',
      en:'Solve 503² using ★=3 and ★=7, and say which is easier.',
      zh:'用★=3和★=7两种方式算503²，说说哪种更方便。' },
    openHint:{ ko:'예) ★=3: 500×506+9=253009. ★=7: 496×510+49=253009(같은 답!). ★=3이 500을 만들어 더 편해요.',
      en:'e.g. ★=3: 500×506+9=253009. ★=7: 496×510+49=253009 (same answer!). ★=3 is easier since it makes 500.',
      zh:'例）★=3：500×506+9=253009。★=7：496×510+49=253009（答案一样！）。★=3能凑出500，更方便。' }
  },

  lab:{
    generator:'adv_sqcube', level:'main', count:4,
    params:{mode:'square'},
    intro:{
      ko:'세 자리 수 제곱을 술술 풀어보자!',
      en:'Breeze through 3-digit squares!',
      zh:'轻松搞定三位数的平方！'
    }
  },

  arena:{
    generator:'adv_sqcube', level:'main', count:8, timeLimit:300,
    params:{mode:'cube'},
    rule:{ ko:'5분 안에 세제곱 계산법 문제를 모두 풀어요!', en:'Solve all cube-trick problems in 5 minutes!', zh:'5分钟内解答所有立方捷算题！' }
  },

  stamp:{ label:{ ko:'제곱·세제곱 마법사', en:'Square & Cube Wizard', zh:'平方立方魔法师' }, coins:38 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'★를 딱 잘 골랐어! ⭐',en:'Great ★ choice!',zh:'★选得真好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'★를 더하고 뺀 두 수를 곱했는지 확인해봐!',en:'Check you multiplied the two numbers ★ apart!',zh:'检查一下是否把相差★的两个数相乘了！'}, {ko:'마지막에 ★²(세제곱은 ★²×n)을 더했는지 봐!',en:'Did you add ★² (or ★²×n for cubes) at the end?',zh:'最后加了★²（立方是★²×n）吗？' } ],
    finish:{ ko:'완벽해! 제곱·세제곱 마법사! ⭐✨', en:'Perfect! Square & Cube Wizard!', zh:'完美！平方立方魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
