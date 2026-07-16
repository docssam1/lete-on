/* Numbers of Magic — 유닛 N-05: 생활 서수 문장제 (수의 나라 · 유아 5~7세)
   tier:'basic' → 경량 플로우: practice → discover(1스테이지) → lab → stamp
   콘텐츠는 전부 창작(줄서기·계단 이모지 장면 + 문장) — 라이선스 교재 삽화/지문 미사용 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['N-05'] = {
  id:'N-05', tier:'basic', level:'N', order:5,
  generator:'nl5_story', edu:'유아',
  title:{ ko:'생활 서수 문장제', en:'Ordinals in Everyday Life', zh:'生活中的序数应用题' },
  subtitle:{ ko:'줄 선 친구를 콕! 계단 번호도 척!', en:'Tap the friend in line — read the step too!', zh:'点一点排队的朋友，读出台阶的数字！' },
  icon:'🚏',

  practice:{ generator:'nl5_story', level:'practice', count:4, params:{ mode:'lineup' },
    intro:{ ko:'친구들이 줄을 섰어요! 이야기를 듣고 콕 짚어 봐요. 🔊 버튼을 누르면 다시 들을 수 있어요',
      en:'Friends are lining up! Listen to the story and tap. Press 🔊 to hear it again',
      zh:'朋友们排好队啦！听故事再点一点。按🔊可以再听一次' } },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 생활 속의 몇째!',en:'1) Ordinals in daily life!',zh:'① 生活中的第几个！'},
        head:{ko:'줄서기와 계단에서도 몇째를 써요',en:'We use ordinals in lines and on stairs too',zh:'排队和台阶上也会用到第几个'},
        desc:{ko:'놀이터에서 줄을 설 때 "나는 앞에서 <b>넷째</b>야!"라고 말하죠? 이게 바로 <b>서수</b>예요. 버스 정류장, 매표소 어디서나 줄을 서면 몇째인지 셀 수 있어요. 계단이나 건물의 층도 마찬가지예요 — 다람쥐가 <b>아래에서부터 세 번째 계단</b>에 있다면, 손가락으로 하나씩 짚으며 세어서 <b>숫자 3</b>을 답으로 써요. 이야기가 길면 <b>🔊 버튼</b>을 눌러 다시 들어도 괜찮아요!',
          en:'When lining up at the playground, you might say "I\'m <b>fourth</b> from the front!" That\'s an <b>ordinal number</b>. At bus stops, ticket booths — anywhere there\'s a line — you can count your place. Stairs and building floors work the same way — if a squirrel is on the <b>3rd step from the bottom</b>, count with your finger step by step and answer with the <b>number 3</b>. If the story is long, it\'s okay to press <b>🔊</b> and listen again!',
          zh:'在游乐场排队时，你可能会说"我是从前面数第<b>四</b>个！"这就是<b>序数</b>。公交站、售票口——只要排队，就能数出自己的位置。台阶和楼层也一样——如果松鼠在<b>从下面数第3级</b>台阶上，就用手指一个一个数，答案写<b>数字3</b>。如果故事有点长，按<b>🔊</b>再听一次也没关系！'},
        mathSteps:['줄서기: 방향을 정하고 몇째인지 세요','계단: 아래에서부터 하나씩 세요','답은 숫자로!'],
        result:{ko:'생활 속 어디서나 서수를 쓸 수 있어요!',en:'Ordinals show up everywhere in daily life!',zh:'生活中到处都能用到序数！'},
        book:{ko:'서수 읽기는 나중에 순위표·달력·건물 안내판 읽기로 이어져요!',en:'Reading ordinals later helps with rankings, calendars, and building signs!',zh:'读序数以后会用在排行榜、日历和楼层指示牌上！'} }
    ],
    rule:{ ko:'① 줄서기 = 방향을 정하고 순서로 세기 ② 계단 = 아래에서부터 세기 ③ 답은 숫자로 써요!',
      en:'① Lines = pick a direction, count in order ② Stairs = count from the bottom ③ Answer with a number!',
      zh:'① 排队＝定方向按顺序数 ② 台阶＝从下往上数 ③ 用数字回答！' }
  },

  lab:{ generator:'nl5_story', level:'main', count:4, params:{ mode:'stairs' },
    intro:{ ko:'이번엔 계단이에요! 동물 친구가 아래에서 몇째 계단에 있는지 숫자로 답해요',
      en:'Now it\'s stairs! Type which step the animal friend is on, counting from the bottom',
      zh:'这次是台阶！数一数动物朋友在从下面数第几级台阶上，写出数字' } },

  stamp:{ label:{ ko:'생활 서수 박사', en:'Ordinal Life Expert', zh:'生活序数博士' }, coins:20 },

  voice:{
    correct:[ {ko:'딩동! 정확해요 🎯',en:'Ding! Exactly right!',zh:'叮！完全正确！'}, {ko:'딱 그 친구! 🚏',en:'That\'s the one!',zh:'就是那个朋友！'}, {ko:'계단 숫자도 딱 맞췄어! ✨',en:'Perfect step count too!',zh:'台阶数字也对啦！'} ],
    wrong:[ {ko:'음~ 🔊 버튼으로 다시 들어볼까요?',en:'Hmm, want to listen again with 🔊?',zh:'嗯，按🔊再听一次吧？'}, {ko:'손가락으로 하나씩 세어 봐요',en:'Try counting one by one with your finger',zh:'用手指一个一个数数看'} ],
    finish:{ ko:'짝짝짝! 생활 서수 박사 탄생! 🚏✨', en:'Clap clap! An Ordinal Life Expert is born!', zh:'鼓掌！生活序数博士诞生了！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
