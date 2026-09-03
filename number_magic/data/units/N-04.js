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
    story:{
      hook:{ ko:'영어 낱말 tally(탤리)는 셈이라는 뜻인데, 원래는 무슨 뜻이었을까요?',
        en:'The English word tally means a count — but what did it originally mean?',
        zh:'英语单词tally是计数的意思，可它原本是什么意思呢？' },
      history:{ ko:'눈금, 그리고 막대예요. 옛날 사람들은 가축 한 마리마다 나무 막대에 눈금을 하나씩 새겼어요. 그 막대가 곧 통장이었던 셈이죠. 철학자 러셀은 이런 말을 남겼어요 — 인류가 닭 두 마리의 2와 이틀의 2를 같은 것으로 이해하기까지 수천 년이 걸렸다. 우리가 쉽게 세는 하나, 둘, 셋 안에는 그 긴 시간이 담겨 있어요.',
        en:'A notch, and a stick. People cut one notch into a wooden stick for each animal they owned — the stick was their bank book. The philosopher Russell put it this way: it took humanity thousands of years to see that the 2 of two chickens and the 2 of two days are the same 2. All of that time is folded into the one, two, three we count so easily.',
        zh:'是刻痕，是木棍。古人每有一头牲畜，就在木棍上刻一道痕——那根木棍就是他们的存折。哲学家罗素说过：人类花了几千年，才明白两只鸡的2和两天的2是同一个2。我们轻松数出的一、二、三里，藏着那么长的时间。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 같은 수도 여러 모습이 있어요!',en:'1) The same number has many looks!',zh:'① 同一个数有很多种样子！'},
        head:{ko:'숫자 "5"와 탤리 막대는 같은 수예요',en:'The numeral "5" and tally marks are the same number',zh:'数字"5"和计数符号是同一个数'},
        desc:{ko:'막대 4개는 그대로, 5번째는 사선으로 묶어요!',
          en:'Four strokes plain, the 5th bundled with a line!',
          zh:'四笔直接画，第五笔斜着捆一下！'},
        mathSteps:[{ko:'1,2,3,4 (막대 4개)',en:'1,2,3,4 (4 sticks)',zh:'1,2,3,4（4根小棒）'},{ko:'5번째는 사선으로 묶어요',en:'The 5th stick ties the bundle across',zh:'第5根斜着捆起来'},{ko:'6,7,8,9는 옆에 하나씩 더!',en:'6,7,8,9 add one more beside!',zh:'6,7,8,9在旁边再加一根！'}],
        result:{ko:'수는 숫자로도, 막대로도 나타내요!',en:'A number can look like this or that!',zh:'数字可以写成数字，也能画成符号！'} }
    ],
    rule:{ ko:'4개는 그대로, 5번째는 사선으로 묶어요!',
      en:'Four stay plain, the 5th is bundled!',
      zh:'4笔直接画，第5笔捆一下！' }
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
