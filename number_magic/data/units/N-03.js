/* Numbers of Magic — 유닛 N-03: 서수와 크기 비교 (수의 나라 · 유아 5~7세)
   tier:'basic' → 경량 플로우: practice → discover(1스테이지) → lab → stamp
   콘텐츠는 전부 창작(격자 칸 색칠) — 라이선스 교재 삽화/지문 미사용 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['N-03'] = {
  id:'N-03', tier:'basic', level:'N', order:3,
  generator:'nl3_ordinal', edu:'유아',
  title:{ ko:'몇째와 크기 비교', en:'Ordinals & Size', zh:'第几个与大小比较' },
  subtitle:{ ko:'왼쪽에서 몇째? 콕 짚고, 딱 그만큼만 칠해요!', en:'Which one from the left? Tap it, then paint just the right amount!', zh:'从左边数第几个？点一点，再正好涂对数量！' },
  icon:'🥇',

  practice:{ generator:'g13_n3', level:'practice', count:4, params:{ modes:['position','ord','cmp'] },
    intro:{ ko:'줄을 선 칸들 중에서 왼쪽에서 몇째인지 콕 짚어 봐요!',
      en:'Tap the box that is a certain place from the left!',
      zh:'点一点从左边数是第几个的格子！' } },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 몇 개와 몇째는 달라요!',en:'1) How many vs. which one!',zh:'① 几个和第几个不一样！'},
        head:{ko:'개수(몇 개)와 순서(몇째)를 구별해요',en:'Telling apart amount and order',zh:'区分数量和顺序'},
        desc:{ko:'왼쪽에서부터 하나, 둘, 셋… 세어 몇째인지 찾아요!',
          en:'Count from the left: one, two, three… find which one!',
          zh:'从左边数：一、二、三……找出第几个！'},
        mathSteps:[{ko:'몇 개? → 개수를 세요',en:'How many? → Count them',zh:'几个？→ 数一数'},{ko:'몇째? → 방향 정하고 순서로 세요',en:'Which place? → Pick a direction, count in order',zh:'第几个？→ 先定方向再按顺序数'}],
        result:{ko:'몇 개는 "얼마나", 몇째는 "어디"!',en:'How many vs. which one!',zh:'几个是"多少"，第几个是"哪里"！'} },
      { tag:{ko:'② 큰 수와 작은 수',en:'2) Bigger and smaller',zh:'② 大数和小数'},
        head:{ko:'> 와 < 는 큰 쪽으로 벌어져요',en:'> and < open toward the bigger number',zh:'> 和 < 的开口朝向大的数'},
        desc:{ko:'두 수를 견주어 큰 쪽으로 입을 벌려요. 입이 벌어진 쪽이 더 큰 수예요!',
          en:'Compare two numbers and open the mouth toward the bigger one.',
          zh:'比较两个数，把开口朝向大的那一边。'},
        mathSteps:[{ko:'8 > 3 → 8은 3보다 큽니다',en:'8 > 3 → 8 is bigger than 3',zh:'8 > 3 → 8大于3'},{ko:'2 < 6 → 2는 6보다 작습니다',en:'2 < 6 → 2 is smaller than 6',zh:'2 < 6 → 2小于6'}],
        result:{ko:'큰 쪽으로 벌어지면 크다, 좁은 쪽이면 작다!',en:'Wide side = bigger, point side = smaller!',zh:'开口那边大，尖角那边小！'} }
    ],
    rule:{ ko:'방향을 정하고 순서대로 세어요!',
      en:'Pick a direction, then count in order!',
      zh:'先定方向，再按顺序数！' }
  },

  lab:{ generator:'g13_n3', level:'main', count:4, params:{ modes:['paint','order','range','arrowTri'] },
    intro:{ ko:'이번엔 칸을 색칠해요! 정확히 그 개수만큼만 콕콕 칠해 보자',
      en:'Now paint the boxes! Tap exactly the right number of them',
      zh:'这次来涂格子！正好涂对数量哦' } },

  stamp:{ label:{ ko:'서수 탐정', en:'Ordinal Detective', zh:'序数小侦探' }, coins:20 },

  voice:{
    correct:[ {ko:'딩동! 정확해요 🎯',en:'Ding! Exactly right!',zh:'叮！完全正确！'}, {ko:'딱 그 자리! 🥇',en:'Right in that spot!',zh:'正是那个位置！'}, {ko:'개수도 딱 맞췄어! ✨',en:'Perfect count too!',zh:'数量也对啦！'} ],
    wrong:[ {ko:'음~ 어느 쪽에서 시작하는지 다시 봐요',en:'Hmm, check which side to start from',zh:'嗯，再看看从哪边开始'}, {ko:'하나씩 손가락으로 세어 볼까?',en:'Try counting one by one with your finger?',zh:'用手指一个一个数数看？'} ],
    finish:{ ko:'짝짝짝! 서수 탐정 탄생! 🥇✨', en:'Clap clap! An Ordinal Detective is born!', zh:'鼓掌！序数小侦探诞生了！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
