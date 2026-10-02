/* Numbers of Magic — 유닛 N-07: 10까지의 수 관계망 (수의 나라 · 유아 5~7세)
   tier:'basic' → 경량 플로우: practice → discover(1스테이지) → lab → stamp
   콘텐츠는 전부 창작 — 라이선스 교재 삽화/지문 미사용 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['N-07'] = {
  id:'N-07', tier:'basic', level:'N', order:7,
  lineage:['ten-friends'],
  generator:'nl7_relation', edu:'유아',
  title:{ ko:'수 이웃과 10 짝꿍', en:'Number Neighbors & Partners of 10', zh:'数的邻居与凑十朋友' },
  subtitle:{ ko:'1 큰 수, 1 작은 수, 그리고 10을 채우는 짝!', en:'One more, one less, and partners that fill 10!', zh:'大1的数、小1的数，还有凑满10的好朋友！' },
  icon:'🔟',

  practice:{ generator:'nl7_relation', level:'practice', count:4, params:{ mode:'tenpair' },
    intro:{ ko:'10칸 판을 가득 채워 보자! 몇 칸을 더 채우면 10이 될까?',
      en:"Let's fill the ten-frame! How many more squares make 10?",
      zh:'把十格板填满吧！再填几格就是10？' } },

  discover:{
    story:{
      hook:{ ko:'구슬 8개가 있어요. 몇 개를 더 놓으면 10칸이 가득 찰까요?',
        en:'There are 8 beads. How many more will fill all 10 spaces?',
        zh:'已经有8颗珠子了。再放几颗，才能填满10个格子呢？' },
      history:{ ko:'10칸 판에 구슬 8개를 놓으면 빈 칸은 2개예요. 빈 칸을 채우면 8과 2가 모여 10이 되지요. 구슬이 9개면 1개, 7개면 3개가 더 필요해요. 채운 칸과 빈 칸을 함께 보면 10 짝꿍을 찾을 수 있어요.',
        en:'Place 8 beads in a ten-frame and 2 spaces stay empty. Fill them: 8 and 2 make 10. With 9 beads you need 1 more; with 7 you need 3 more. Look at the filled and empty spaces together to find partners of 10.',
        zh:'在十格板上放8颗珠子，就会空出2格。填满它们，8和2合起来就是10。有9颗时还需要1颗，有7颗时还需要3颗。把已填的格子和空格一起看，就能找到凑十朋友。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 수는 이웃이 있어요',en:'1) Numbers have neighbors',zh:'① 数有邻居'},
        head:{ko:'1 큰 수, 1 작은 수 — 그리고 10 짝꿍!',en:'One more, one less — and partners of 10!',zh:'大1、小1——还有凑十朋友！'},
        desc:{ko:'5의 1 큰 수는 6, 1 작은 수는 4예요!',
          en:'One more than 5 is 6, one less is 4!',
          zh:'比5大1是6，小1是4！'},
        mathSteps:[{ko:'4 ← 5 → 6 (이웃)',en:'4 ← 5 → 6 (neighbors)',zh:'4 ← 5 → 6（邻居）'},'7 + □ = 10',{ko:'짝꿍: 1·9, 2·8, 3·7, 4·6, 5·5',en:'Partners: 1·9, 2·8, 3·7, 4·6, 5·5',zh:'好朋友：1·9, 2·8, 3·7, 4·6, 5·5'}],
        result:{ko:'이웃 수와 10 짝꿍을 찾아봐요!',en:'Find neighbors and partners of 10!',zh:'找找邻居数和凑十朋友！'} }
    ],
    rule:{ ko:'채운 칸 + 빈 칸 = 10이에요!',
      en:'Filled + empty = 10!',
      zh:'已填的加空的等于10！' }
  },

  lab:{ generator:'nl7_relation', level:'main', count:4, params:{ mode:'oneStep' },
    intro:{ ko:'이번엔 이웃 수 찾기! 먼저 톡톡 세어 보고, 1 큰 수나 1 작은 수를 골라 봐.',
      en:'Now find the neighbors! Count first, then pick one more or one less.',
      zh:'现在找邻居数！先点着数一数，再选大1或小1的数。' } },

  stamp:{ label:{ ko:'10 짝꿍 수호자', en:'Guardian of 10-Partners', zh:'凑十小卫士' }, coins:20 },

  voice:{
    correct:[ {ko:'딩동댕! 🎉',en:'Ding-dong!',zh:'叮咚！'}, {ko:'짝꿍 발견! 🔟',en:'Partner found!',zh:'找到朋友啦！'}, {ko:'이웃 수 박사! ⭐',en:'Neighbor expert!',zh:'邻居数博士！'} ],
    wrong:[ {ko:'음~ 다시 세어 볼까?',en:'Hmm, count again?',zh:'嗯，再数数看？'}, {ko:'한 칸 앞? 한 칸 뒤?',en:'One step forward? One step back?',zh:'往前一格？往后一格？'} ],
    finish:{ ko:'짝짝짝! 10 짝꿍 수호자 탄생! 🔟✨', en:'Clap clap! A Guardian of 10-Partners is born!', zh:'鼓掌！凑十小卫士诞生了！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
