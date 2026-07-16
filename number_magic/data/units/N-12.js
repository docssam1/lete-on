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
        desc:{ko:'무당벌레 등에 점이 <b>6개</b> 있다고 해요. 왼쪽 날개에 <b>1개</b>, 오른쪽 날개에 <b>5개</b>일 수도 있고, <b>3개</b>와 <b>3개</b>로 딱 반반일 수도 있어요 — 가르기는 <b>정해진 답이 하나가 아니에요</b>! 그리고 양팔저울은 어느 쪽에 <b>더 많이</b> 있는지 눈으로 바로 비교하게 해줘요. 접시에 놓인 걸 세어 보면, 개수가 <b>많은 쪽</b>이 아래로 <b>기울어요</b> — 마치 그 쪽이 더 무거운 것처럼요!',
          en:'Say a ladybug has <b>6</b> spots. The left wing could have <b>1</b> and the right <b>5</b>, or it could be an even <b>3</b> and <b>3</b> — splitting doesn\'t have just <b>one fixed answer</b>! A balance scale lets you compare which side has <b>more</b>, just by looking. Count what\'s on each pan — the side with <b>more</b> tips <b>down</b>, as if it were heavier!',
          zh:'假设瓢虫背上有<b>6个</b>点。左边翅膀可能有<b>1个</b>，右边有<b>5个</b>，也可能刚好<b>3个</b>和<b>3个</b>——分开的方法<b>不止一种</b>！天平能让你一眼比较哪边<b>更多</b>。数一数盘子里的东西，<b>更多</b>的那边会<b>往下沉</b>，就像那边更重一样！'},
        mathSteps:['점 6개 = 1+5 또는 2+4 또는 3+3…','저울: 개수가 많은 쪽이 아래로','비교해서 답해요!'],
        result:{ko:'가르기도, 저울도 — 비교하고 확인하는 마법이에요!',en:'Splitting and scales — both are magic for comparing!',zh:'分开和天平——都是用来比较的魔法！'},
        book:{ko:'양팔저울 비교는 나중에 부등호(< >) 배우기로 이어져요!',en:'Balance-scale comparing later leads to learning < and >!',zh:'天平比较以后会用在学习大于号、小于号上！'} }
    ],
    rule:{ ko:'① 가르기는 답이 여러 가지예요 ② 저울: 개수 많은 쪽이 아래로 기울어요 ③ 잘 보고 비교해요!',
      en:'① Splitting has many right answers ② Scale: the side with more tips down ③ Look carefully and compare!',
      zh:'① 分开的答案不止一种 ② 天平：更多的一边往下沉 ③ 仔细看再比较！' }
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
