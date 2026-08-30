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
        desc:{ko:'줄에서도 계단에서도 몇째인지 세어 봐요!',
          en:'Count "which one" in lines and on stairs too!',
          zh:'排队和台阶上也数一数第几个！'},
        mathSteps:[{ko:'줄서기: 방향을 정하고 세어요',en:'Lining up: pick a direction and count',zh:'排队：定好方向再数'},{ko:'계단: 아래에서부터 세어요',en:'Stairs: count from the bottom',zh:'楼梯：从下往上数'},{ko:'답은 숫자로!',en:'Answer with a number!',zh:'用数字回答！'}],
        result:{ko:'생활 속 어디서나 서수를 써요!',en:'Ordinals are everywhere!',zh:'生活中到处都能用序数！'} }
    ],
    rule:{ ko:'줄서기는 방향대로, 계단은 아래에서부터 세어요!',
      en:'Lines: pick a direction. Stairs: count from the bottom!',
      zh:'排队按方向数，台阶从下往上数！' }
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
