/* Numbers of Magic — 유닛 N-10: 이야기와 자료 정리 (수의 나라 · 유아 5~7세) — 교재 G1-10 대응(2026-10-04)
   tier:'basic' → 경량 플로우: practice → discover(1스테이지) → lab → stamp
   콘텐츠는 전부 창작(분류 장면) — 라이선스 교재 삽화/지문 미사용 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['N-10'] = {
  id:'N-10', tier:'basic', level:'N', order:10,
  generator:'nlg10_text', edu:'유아',
  title:{ ko:'이야기와 자료 정리', en:'Stories & Sorting Data', zh:'故事与整理数据' },
  subtitle:{ ko:'이야기 속 빈칸을 채우고, 그림을 종류별로 세어 표를 만들어요!', en:'Fill the story blanks, then count the pictures into a table!', zh:'填好故事里的空格，再把图画分类数一数做成表！' },
  icon:'🧺',

  practice:{ generator:'nlg10_text', level:'practice', count:4, params:{ mode:'storyfill', lv:1 },
    intro:{ ko:'짧은 이야기를 읽어요! 문장을 끝까지 듣고, 빈칸에 알맞은 수를 골라 넣어요',
      en:'Read a short story! Listen to the whole sentence, then pick the right number for each blank',
      zh:'读一个小故事！把句子听完，再选合适的数填进空格' } },

  discover:{
    story:{
      hook:{ ko:'우리 반에서 넘어진 곳을 세어 보니 교실이 제일 많았어요. 그럼 교실이 제일 위험한 곳일까요?',
        en:'We counted where classmates tripped, and the classroom won by a lot. Does that make the classroom the most dangerous place?',
        zh:'统计了同学们摔倒的地点，教室最多。那教室就是最危险的地方吗？' },
      history:{ ko:'교실에서 보내는 시간이 가장 길어서예요. 수를 셀 때는 얼마나 많이 일어났나와 얼마나 자주 그곳에 있었나를 같이 봐야 해요. 어른들의 통계에도 같은 함정이 있어요 — 교통사고는 집 근처에서 가장 많이 일어나지만, 그건 집 근처를 가장 많이 다니기 때문이에요.',
        en:'Because that is where we spend the most time. When you count, you have to look at how often you were there too, not just how many happened. Grown-up statistics fall into the same trap: most car accidents happen near home, simply because that is where people drive most.',
        zh:'因为我们在教室待的时间最长。数数时不能只看发生了多少次，还要看在那里待了多久。大人的统计也有同样的陷阱：交通事故大多发生在家附近，只是因为人们在家附近开车最多。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 나누면 비교하기 쉬워요!',en:'1) Sorting makes comparing easy!',zh:'① 分类后更容易比较！'},
        head:{ko:'종류별로 나누면 어느 쪽이 많은지 한눈에 보여요',en:'Sort by kind and you can see which has more at a glance',zh:'按种类分开，一眼就能看出谁更多'},
        desc:{ko:'🐶는 🐶끼리, 🐱는 🐱끼리! 나누면 세기 쉬워요.',
          en:'Dogs with dogs, cats with cats! Sorting makes counting easy.',
          zh:'🐶跟🐶一起，🐱跟🐱一起！分开就好数了。'},
        mathSteps:[{ko:'종류별로 나눠요',en:'Sort by kind',zh:'按种类分开'},{ko:'각 바구니를 세어요',en:'Count each basket',zh:'数一数每个篮子'},{ko:'어느 쪽이 많은지 비교!',en:'Compare which has more!',zh:'比一比哪边多！'}],
        result:{ko:'나누면 비교가 쉬워요!',en:'Sorting makes comparing easy!',zh:'分类后比较容易！'} }
    ],
    rule:{ ko:'나눠 담고, 세고, 비교해요!',
      en:'Sort, count, compare!',
      zh:'分一分、数一数、比一比！' }
  },

  lab:{ generator:'nlg10_survey', level:'main', count:4, params:{ mode:'tally3', lv:1 },
    intro:{ ko:'이번엔 조사하기! 그림을 하나씩 짚어 종류별로 세고, 표에 알맞은 수를 써요',
      en:'Now a survey! Point at each picture, count every kind, and write the numbers in the table',
      zh:'这次来调查！把图画一个一个指着按种类数，再把数写进表里' } },

  stamp:{ label:{ ko:'분류 박사', en:'Sorting Expert', zh:'分类博士' }, coins:20 },

  voice:{
    correct:[ {ko:'딩동! 딱 맞아요 🧺',en:'Ding! Exactly right!',zh:'叮！完全正确！'}, {ko:'표도 완벽해요! 📋',en:'The table is perfect too!',zh:'表格也很完美！'}, {ko:'분류를 잘했어요! ✨',en:'Great sorting!',zh:'分类得真好！'} ],
    wrong:[ {ko:'음~ 이야기를 끝까지 다시 들어 볼까요?',en:'Hmm, listen to the whole story again?',zh:'嗯，再把故事听完整好吗？'}, {ko:'하나씩 짚어서 세어 봐요',en:'Point and count one by one',zh:'一个一个指着数'} ],
    finish:{ ko:'짝짝짝! 분류 박사 탄생! 🧺✨', en:'Clap clap! A Sorting Expert is born!', zh:'鼓掌！分类博士诞生了！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
