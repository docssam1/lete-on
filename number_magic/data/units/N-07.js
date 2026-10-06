/* Numbers of Magic — 유닛 N-07: 더하기와 빼기 ③ — 주사위와 수직선 (수의 나라 · 유아 5~7세, 교재 G1-7)
   tier:'basic' → 경량 플로우: practice → discover(1스테이지) → lab → stamp
   (2026-10 개편: 예전 제목 "수 이웃과 10 짝꿍"은 G1-7 문항집과 주제가 어긋나 교체. 이웃 수·10 짝꿍은 NL6 드릴로 계속 연습한다.)
   콘텐츠는 전부 창작 — 라이선스 교재 삽화/지문 미사용 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['N-07'] = {
  id:'N-07', tier:'basic', level:'N', order:7,
  lineage:['ten-friends'],
  generator:'nl38_scene', edu:'유아',
  title:{ ko:'주사위와 수직선 더하기·빼기', en:'Dice & Number-Line Add and Subtract', zh:'骰子与数轴上的加减' },
  subtitle:{ ko:'주사위를 굴리고, 개구리를 폴짝 뛰게 해요!', en:'Roll the die and make the frog hop!', zh:'掷骰子，让青蛙跳一跳！' },
  icon:'🎲',

  practice:{ generator:'nl38_scene', level:'practice', count:4, params:{ mode:'dice', op:'+', level:'practice' },
    intro:{ ko:'주사위를 눌러 굴려 봐! 나온 눈과 더해서 답을 써요.',
      en:'Tap the die to roll it! Add the number it shows.',
      zh:'点一点骰子来掷！和点数相加，写出得数。' } },

  discover:{
    story:{
      hook:{ ko:'개구리가 0에서 4칸을 뛰고, 또 3칸을 뛰었어요. 지금은 몇 칸에 있을까요?',
        en:'A frog hops 4 steps from 0, then 3 more. Where is it now?',
        zh:'青蛙从0跳了4格，又跳了3格。现在在哪一格？' },
      history:{ ko:'수직선 위에서 앞으로 뛰면 더하기, 되돌아오면 빼기예요. 0에서 4칸 뛰고 3칸 더 뛰면 4+3=7, 7에서 3칸 되돌아오면 7−3=4예요. 주사위의 눈이나 도미노 점도 이렇게 더하고 뺄 수 있어요.',
        en:'Hopping forward on the number line is adding and hopping back is subtracting: 0 → 4 → 7 is 4 + 3 = 7, and 7 back 3 steps is 7 − 3 = 4. Dice dots and domino dots can be added and subtracted the same way.',
        zh:'在数轴上往前跳是加法，往回跳是减法：0→4→7就是4＋3＝7，从7往回跳3格是7－3＝4。骰子和多米诺的点也可以这样加减。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 뛰면 더하기, 되돌아오면 빼기',en:'1) Hop on = add, hop back = subtract',zh:'① 往前跳是加，往回跳是减'},
        head:{ko:'수직선에서 식이 보여요',en:'See the equation on the number line',zh:'在数轴上看见算式'},
        desc:{ko:'4에서 3칸 앞으로 뛰면 7! 7에서 3칸 되돌아오면 4!',
          en:'3 steps on from 4 is 7! 3 steps back from 7 is 4!',
          zh:'从4往前跳3格是7！从7往回跳3格是4！'},
        mathSteps:['4 + 3 = 7','7 ' + '−' + ' 3 = 4'],
        result:{ko:'뛰는 길이 곧 식이에요!',en:'The hops are the equation!',zh:'跳的路线就是算式！'} }
    ],
    rule:{ ko:'앞으로 뛰면 +, 되돌아오면 −예요!',
      en:'Hop forward is +, hop back is −!',
      zh:'往前跳是＋，往回跳是－！' }
  },

  lab:{ generator:'nl41_hop', level:'main', count:4, params:{ mode:'read', dir:'mix' },
    intro:{ ko:'개구리가 뛴 모습이에요. 빈 칸에 알맞은 수를 써 봐!',
      en:'Look at how the frog hopped. Fill the empty box!',
      zh:'看青蛙跳的样子，把空格填出来！' } },

  stamp:{ label:{ ko:'주사위 개구리 박사', en:'Dice & Frog Expert', zh:'骰子青蛙小博士' }, coins:20 },

  voice:{
    correct:[ {ko:'딩동댕! 🎉',en:'Ding-dong!',zh:'叮咚！'}, {ko:'폴짝! 🐸',en:'Hop! 🐸',zh:'跳！🐸'}, {ko:'주사위 박사! 🎲',en:'Dice expert! 🎲',zh:'骰子博士！🎲'} ],
    wrong:[ {ko:'음~ 앞으로 뛰었나, 되돌아왔나?',en:'Hmm, did it hop on or back?',zh:'嗯，是往前跳还是往回跳？'}, {ko:'눈금을 하나씩 세어 볼까?',en:'Count the steps one by one?',zh:'一格一格数一数？'} ],
    finish:{ ko:'짝짝짝! 주사위 개구리 박사 탄생! 🎲🐸', en:'Clap clap! A Dice & Frog Expert is born!', zh:'鼓掌！骰子青蛙小博士诞生了！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
