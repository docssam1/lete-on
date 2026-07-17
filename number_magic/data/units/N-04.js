/* Numbers of Magic — 유닛 N-04: 기수법 놀이 (수의 나라 · 유아 5~7세)
   tier:'basic' → 경량 플로우: practice → discover(1스테이지) → lab → stamp
   콘텐츠는 전부 창작(탤리 막대 도식) — 라이선스 교재 삽화/지문 미사용 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['N-04'] = {
  id:'N-04', tier:'basic', level:'N', order:4,
  generator:'nl_tallybuild', edu:'유아',
  title:{ ko:'기수법 놀이', en:'Number Notation Play', zh:'记数法游戏' },
  subtitle:{ ko:'탤리 막대로 수를 만들고, 수와 탤리를 이어요!', en:'Build numbers with tally marks, then match them!', zh:'用计数符号做数字，再连一连！' },
  icon:'🖍️',

  practice:{ generator:'nl_tallybuild', level:'practice', count:4, params:{ mode:'build' },
    intro:{ ko:'탤리(산가지)는 막대로 수를 세는 방법이에요! 판을 톡톡 눌러 목표 수만큼 막대를 만들어요',
      en:'Tally marks are a way to count with strokes! Tap the board to make the target number',
      zh:'计数符号是用一笔一笔数数的方法！点一点板子，做出目标数字' } },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 같은 수도 여러 모습이 있어요!',en:'1) The same number has many looks!',zh:'① 同一个数有很多种样子！'},
        head:{ko:'숫자 "5"와 탤리 막대는 같은 수예요',en:'The numeral "5" and tally marks are the same number',zh:'数字"5"和计数符号是同一个数'},
        desc:{ko:'수 <b>5</b>는 숫자 "5"로 쓸 수도 있고, 막대 <b>||||</b>에 사선 하나를 <b>더 그어서</b> 묶음으로 나타낼 수도 있어요! 왜 사선으로 묶을까요? <b>넷</b>까지 세다가 <b>다섯째</b> 막대를 사선으로 그으면, 나중에 한눈에 <b>5개씩 묶어서</b> 빠르게 셀 수 있거든요. 6, 7, 8, 9는 그 묶음 옆에 막대를 <b>하나씩 더</b> 그으면 돼요. 그리고 수와 탤리 그림을 이을 땐 막대를 <b>하나하나 세어서</b> 같은 수끼리 짝지어요!',
          en:'The number <b>5</b> can be written as "5", or shown as four strokes <b>||||</b> with one more stroke <b>drawn across</b> them as a bundle! Why bundle with a diagonal? Count to <b>four</b>, then draw the <b>fifth</b> stroke across — later you can count fast by <b>groups of 5</b> at a glance. For 6, 7, 8, 9, just draw <b>one more stroke</b> next to the bundle. And to match numbers with tally pictures, <b>count the strokes one by one</b> and pair up the same amount!',
          zh:'数字<b>5</b>可以写成"5"，也可以用四笔<b>||||</b>加一笔<b>斜着划过</b>组成一捆！为什么要斜着捆一下？数到<b>四</b>笔后，把<b>第五</b>笔斜着划过——以后就能一眼按<b>5个一捆</b>快速数数。6、7、8、9只要在捆旁边<b>再加一笔</b>就行。连数字和计数图时，<b>一笔一笔地数</b>，配对相同数量的！'},
        mathSteps:['1,2,3,4 (막대 4개)','5번째는 사선으로 묶어요','6,7,8,9는 옆에 하나씩 더!'],
        result:{ko:'수는 숫자로도, 막대로도 나타낼 수 있어요!',en:'A number can be shown as a numeral or as tally strokes!',zh:'数字既能写成数字，也能画成计数符号！'},
        book:{ko:'탤리 세기는 나중에 통계·그래프 읽기의 기초가 돼요!',en:'Tally counting is a foundation for reading graphs and statistics later!',zh:'计数符号是以后读统计图表的基础！'} }
    ],
    rule:{ ko:'① 막대 4개까지는 그대로 ② 5번째는 사선으로 묶어요 ③ 세어서 같은 수끼리 이어요!',
      en:'① Up to 4 strokes stay plain ② The 5th is bundled with a diagonal ③ Count and match the same amount!',
      zh:'① 4笔以内直接画 ② 第5笔斜着捆一下 ③ 数一数，连相同数量！' }
  },

  lab:{ generator:'nl_tallybuild', level:'main', count:4, params:{ mode:'match' },
    intro:{ ko:'수와 탤리 그림을 이어요! 숫자를 먼저 톡 — 탤리 그림을 골라 이어요!',
      en:'Match numbers to tally marks! Tap a number first, then tap its tally!',
      zh:'连连看！先点数字，再点它的计数符号！' } },

  stamp:{ label:{ ko:'기수법 마법사', en:'Notation Wizard', zh:'记数法魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'딩동! 딱 맞는 수! 🖍️',en:'Ding! The right amount!',zh:'叮！数量正好！'}, {ko:'묶음이 완벽해요! ✨',en:'Perfect bundling!',zh:'捆得真完美！'}, {ko:'연결 성공! 🔗',en:'Great matching!',zh:'连对啦！'} ],
    wrong:[ {ko:'음~ 막대를 하나씩 세어 볼까요?',en:'Hmm, count the strokes one by one?',zh:'嗯，一笔一笔数数看？'}, {ko:'다섯 개마다 사선으로 묶여요',en:'Every five strokes get bundled with a diagonal',zh:'每五笔就用斜线捆一下'} ],
    finish:{ ko:'짝짝짝! 기수법 마법사 탄생! 🖍️✨', en:'Clap clap! A Notation Wizard is born!', zh:'鼓掌！记数法魔法师诞生了！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
