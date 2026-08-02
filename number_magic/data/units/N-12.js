/* Numbers of Magic — 유닛 N-12: 무당벌레 가르기와 저울 (수의 나라 · 유아 5~7세)
   tier:'basic' → 경량 플로우: practice → discover(1스테이지) → lab → stamp
   콘텐츠는 전부 창작(무당벌레 점·양팔저울 장면) — 라이선스 교재 삽화/지문 미사용 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['N-12'] = {
  id:'N-12', tier:'basic', level:'N', order:12,
  generator:'nl4_ladybug', edu:'유아',
  title:{ ko:'무당벌레 가르기와 저울', en:"Ladybug Splits & Balance Scale", zh:'瓢虫分点与天平' },
  subtitle:{ ko:'날개의 점을 갈라 보고, 저울로 무게도 비교해요!', en:'Split the wing spots, then compare weight on a scale!', zh:'分一分翅膀上的点，再用天平比比重量！' },
  icon:'🐞',

  practice:{ generator:'nl4_ladybug', level:'practice', count:4,
    intro:{ ko:'무당벌레 등에 점이 있어요! 한쪽 날개를 보고 다른 쪽 날개의 점 수를 맞혀요',
      en:'The ladybug has spots on its back! Look at one wing and find the other wing\'s count',
      zh:'瓢虫背上有点点！看一边翅膀，猜猜另一边翅膀有几个点' } },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 가르기는 늘 반반이 아니에요!',en:'1) Splitting isn\'t always even!',zh:'① 分开不总是一半一半！'},
        head:{ko:'무당벌레 날개는 다양하게 나뉘어요',en:'Ladybug wings split in many different ways',zh:'瓢虫的翅膀有很多种分法'},
        desc:{ko:'🐞 점 6개는 1과 5, 3과 3! 여러 가지로 갈라져요.',
          en:'Six spots can split 1&5 or 3&3 — many ways!',
          zh:'🐞 6个点能分成1和5，也能3和3！'},
        mathSteps:['점 6개 = 1+5 또는 3+3','저울: 많은 쪽이 아래로','비교해서 답해요!'],
        result:{ko:'많은 쪽이 아래로 기울어요!',en:'The side with more tips down!',zh:'多的那边往下沉！'} }
    ],
    rule:{ ko:'저울은 많은 쪽이 아래로 기울어요!',
      en:'The scale tips down on the side with more!',
      zh:'天平往多的那边沉！' }
  },

  lab:{ generator:'nl12_scale', level:'main', count:4,
    intro:{ ko:'이번엔 양팔저울! 접시 위 친구들을 세어 보고, 무겁거나 가벼운 쪽을 콕 짚어요',
      en:'Now the balance scale! Count what\'s on each pan and tap the heavier or lighter side',
      zh:'现在是天平！数一数盘子里的东西，点一点更重或更轻的那边' } },

  stamp:{ label:{ ko:'저울 탐정', en:'Scale Detective', zh:'天平小侦探' }, coins:20 },

  voice:{
    correct:[ {ko:'딩동! 정확해요 🐞',en:'Ding! Exactly right!',zh:'叮！完全正确！'}, {ko:'저울이 알려준 대로! ⚖️',en:'Just like the scale showed!',zh:'天平说得没错！'}, {ko:'점 개수도 딱 맞췄어! ✨',en:'Perfect spot count too!',zh:'点数也对啦！'} ],
    wrong:[ {ko:'음~ 점을 하나씩 세어 볼까요?',en:'Hmm, count the spots one by one?',zh:'嗯，一个一个数数看？'}, {ko:'접시 위를 다시 세어 봐요',en:'Count what\'s on the pans again',zh:'再数一数盘子上的东西'} ],
    finish:{ ko:'짝짝짝! 저울 탐정 탄생! 🐞⚖️', en:'Clap clap! A Scale Detective is born!', zh:'鼓掌！天平小侦探诞生了！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
