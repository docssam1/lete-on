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

  practice:{ generator:'nl3_ordinal', level:'practice', count:4, params:{ mode:'position' },
    intro:{ ko:'줄을 선 칸들 중에서 왼쪽에서 몇째인지 콕 짚어 봐요!',
      en:'Tap the box that is a certain place from the left!',
      zh:'点一点从左边数是第几个的格子！' } },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 몇 개와 몇째는 달라요!',en:'1) How many vs. which one!',zh:'① 几个和第几个不一样！'},
        head:{ko:'개수(몇 개)와 순서(몇째)를 구별해요',en:'Telling apart amount and order',zh:'区分数量和顺序'},
        desc:{ko:'"사탕이 <b>3개</b>야"는 <b>개수</b>를 말해요. 그런데 "왼쪽에서 <b>셋째</b> 칸"은 <b>자리(순서)</b>를 말해요 — 완전히 달라요! 몇째를 찾을 땐 <b>어느 쪽에서 시작</b>하는지가 중요해요: 왼쪽에서 세면 👉 방향으로, 오른쪽에서 세면 👈 방향으로 하나, 둘, 셋… 세어가요. 칸을 정확히 몇 개만 칠할 땐 방향은 상관없이 <b>개수</b>만 딱 맞으면 돼요!',
          en:'"There are <b>3</b> candies" tells the <b>amount</b>. But "the <b>third</b> box from the left" tells the <b>position</b> — totally different! To find "which one," it matters <b>which side you start from</b>: count 👉 from the left, or 👈 from the right — one, two, three… When painting an exact amount of boxes, direction does not matter — only the <b>count</b> needs to be right!',
          zh:'"有<b>3个</b>糖果"说的是<b>数量</b>。但"从左边数第<b>三</b>个格子"说的是<b>位置</b>——完全不一样！找"第几个"时，<b>从哪边开始数</b>很重要：从左边数就往👉方向，从右边数就往👈方向，一、二、三……正好涂几格时，方向不重要，只要<b>数量</b>对就行！'},
        mathSteps:['몇 개? → 개수를 세요','몇째? → 방향을 정하고 순서로 세요','정확히 N개 칠하기 → 개수만 확인!'],
        result:{ko:'개수는 "얼마나 많이", 순서는 "어디에"!',en:'Amount is "how many", order is "where"!',zh:'数量是"多少个"，顺序是"在哪里"！'},
        book:{ko:'몇째(서수) 개념은 나중에 등수·날짜·자리 읽기에 쓰여요!',en:'Ordinal numbers are later used for ranks, dates, and seats!',zh:'序数概念以后会用在名次、日期和座位上！'} }
    ],
    rule:{ ko:'① 몇 개 = 개수 ② 몇째 = 방향을 정하고 순서로 세기 ③ 색칠은 개수만 딱 맞으면 OK!',
      en:'① How many = amount ② Which one = pick a direction, count in order ③ Painting only needs the right count!',
      zh:'① 几个＝数量 ② 第几个＝定方向按顺序数 ③ 涂色只要数量对就行！' }
  },

  lab:{ generator:'nl3_ordinal', level:'main', count:4, params:{ mode:'paint' },
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
