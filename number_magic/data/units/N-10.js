/* Numbers of Magic — 유닛 N-10: 자료 분류와 표 (수의 나라 · 유아 5~7세)
   tier:'basic' → 경량 플로우: practice → discover(1스테이지) → lab → stamp
   콘텐츠는 전부 창작(분류 장면) — 라이선스 교재 삽화/지문 미사용 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['N-10'] = {
  id:'N-10', tier:'basic', level:'N', order:10,
  generator:'nl10_data', edu:'유아',
  title:{ ko:'자료 분류와 표', en:'Sorting & Simple Data', zh:'分类与数据' },
  subtitle:{ ko:'섞인 걸 나눠 담고, 어느 쪽이 더 많은지 비교해요!', en:'Sort the mix, then compare which has more!', zh:'分类装篮子，再比比谁更多！' },
  icon:'🧺',

  practice:{ generator:'nl10_data', level:'practice', count:4, params:{ mode:'sort' },
    intro:{ ko:'섞여 있는 걸 종류별로 나눠요! 톡톡 눌러서 바구니에 담고 세어 봐요',
      en:'Sort the mixed items by kind! Tap to put them in baskets and count',
      zh:'把混在一起的东西分类！点一点放进篮子，数一数' } },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 나누면 비교하기 쉬워요!',en:'1) Sorting makes comparing easy!',zh:'① 分类后更容易比较！'},
        head:{ko:'종류별로 나누면 어느 쪽이 많은지 한눈에 보여요',en:'Sort by kind and you can see which has more at a glance',zh:'按种类分开，一眼就能看出谁更多'},
        desc:{ko:'강아지와 고양이가 <b>섞여 있으면</b> 세기 어려워요. 그런데 강아지는 강아지 바구니로, 고양이는 고양이 바구니로 <b>나눠 담으면</b> — 각 바구니의 개수를 세어 <b>비교</b>하기 쉬워져요! "강아지 바구니에 <b>5마리</b>, 고양이 바구니에 <b>3마리</b>" — 그럼 강아지가 <b>더 많다</b>는 걸 바로 알 수 있어요. 이렇게 나누어 세는 것을 <b>분류</b>라고 해요!',
          en:'When dogs and cats are <b>mixed together</b>, it\'s hard to count. But sort dogs into the dog basket and cats into the cat basket — then counting each basket makes <b>comparing</b> easy! "5 dogs, 3 cats" — you can instantly tell dogs are <b>more</b>. This kind of sorting is called <b>classification</b>!',
          zh:'小狗和小猫<b>混在一起</b>时很难数。但把小狗分到狗篮子，小猫分到猫篮子——数一数每个篮子，<b>比较</b>就容易多了！"狗篮子5只，猫篮子3只"——马上就知道狗<b>更多</b>。这样分开数叫做<b>分类</b>！'},
        mathSteps:['섞여 있으면 → 종류별로 나눠요','각 바구니를 세어요','개수를 비교해요!'],
        result:{ko:'분류하면 비교가 훨씬 쉬워져요!',en:'Sorting makes comparing much easier!',zh:'分类后比较容易多了！'},
        book:{ko:'분류와 세기는 나중에 그래프와 표 읽기의 기초가 돼요!',en:'Sorting and counting are the foundation for reading graphs and tables later!',zh:'分类和数数是以后读图表的基础！'} }
    ],
    rule:{ ko:'① 섞였으면 종류별로 나눠요 ② 각 바구니를 세어요 ③ 개수를 비교해요!',
      en:'① Mixed? Sort by kind ② Count each basket ③ Compare the amounts!',
      zh:'① 混在一起就分类 ② 数一数每个篮子 ③ 比较数量！' }
  },

  lab:{ generator:'nl10_data', level:'main', count:4, params:{ mode:'compare' },
    intro:{ ko:'이번엔 비교하기! 톡톡 눌러 나눠 담고, 어느 바구니가 더 많은지 콕 짚어요',
      en:'Now let\'s compare! Sort them, then tap the basket with more',
      zh:'现在来比较！点一点分类，再点数量更多的篮子' } },

  stamp:{ label:{ ko:'분류 박사', en:'Sorting Expert', zh:'分类博士' }, coins:20 },

  voice:{
    correct:[ {ko:'딩동! 딱 맞아요 🧺',en:'Ding! Exactly right!',zh:'叮！完全正确！'}, {ko:'비교도 완벽해요! ⚖️',en:'Perfect comparing too!',zh:'比较也很完美！'}, {ko:'분류를 잘했어요! ✨',en:'Great sorting!',zh:'分类得真好！'} ],
    wrong:[ {ko:'음~ 각 바구니를 다시 세어 볼까요?',en:'Hmm, count each basket again?',zh:'嗯，再数数每个篮子？'}, {ko:'하나씩 세어서 비교해봐요',en:'Count one by one and compare',zh:'一个一个数，再比比看'} ],
    finish:{ ko:'짝짝짝! 분류 박사 탄생! 🧺✨', en:'Clap clap! A Sorting Expert is born!', zh:'鼓掌！分类博士诞生了！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
