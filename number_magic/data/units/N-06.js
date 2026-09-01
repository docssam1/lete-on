/* Numbers of Magic — 유닛 N-06: 모으기와 가르기 (수의 나라 · 유아 5~7세)
   tier:'basic' → 경량 플로우: practice → discover(1스테이지) → lab → stamp
   콘텐츠는 전부 창작(이모지 넘버본드 트리) — 라이선스 교재 삽화/지문 미사용 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['N-06'] = {
  id:'N-06', tier:'basic', level:'N', order:6,
  generator:'nl4_bond', edu:'유아',
  title:{ ko:'모으기와 가르기', en:'Join & Split', zh:'合与分' },
  subtitle:{ ko:'두 손에 나눠 쥐고, 다시 모으고!', en:'Split into two hands, then join back!', zh:'分到两只手里，再合起来！' },
  icon:'🍬',

  practice:{ generator:'nl4_bond', level:'practice', count:4, params:{ mode:'join' },
    intro:{ ko:'왼쪽 원과 오른쪽 원을 모으면 위에 몇 개가 될까? 위쪽 원을 톡톡 채워 봐!',
      en:'Join the left and right circles — how many on top? Tap to fill the top circle!',
      zh:'把左边和右边的圆合起来，上面是几个？点一点填满上面的圆！' } },

  discover:{
    story:{
      hook:{ ko:'8을 똑같이 둘로 가르면 얼마일까요? 그럼 8 안에 3은 몇 번 들어갈까요?',
        en:'Split 8 evenly in two — how much is each? And how many 3s fit inside 8?',
        zh:'把8平均分成两份是多少？那8里面能装下几个3呢？' },
      history:{ ko:'둘로 가르면 4와 4예요. 3은 두 번 들어가고 2가 남죠. 척 보고 답하면 틀리기 쉬운 질문이라, 실제로 나눠 보는 게 제일 확실해요. 두 손에 나눠 쥐었다가 다시 모아 보면 눈으로 바로 보인답니다.',
        en:'Two fours. And three fits twice with two left over. These are the questions where a quick guess goes wrong, so actually splitting them is the surest way. Divide them between two hands, then join them back, and you can see it.',
        zh:'分成两份是4和4。3能装两次，还剩2。这类问题一眼猜过去很容易错，所以真的动手分一分最靠谱。分到两只手里再合起来，一眼就看明白了。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 가르기 나무',en:'1) The split tree',zh:'① 分分树'},
        head:{ko:'하나의 수가 두 갈래로!',en:'One number splits into two branches!',zh:'一个数分成两枝！'},
        desc:{ko:'5는 1과 4, 2와 3! 나눠도 합쳐도 5예요.',
          en:'5 is 1&4, or 2&3! Split or joined, still 5!',
          zh:'5是1和4，也是2和3！分开合起来都是5！'},
        mathSteps:['🍬🍬🍬🍬🍬 = 5',{ko:'1과 4 · 2와 3 · 5와 0',en:'1 & 4 · 2 & 3 · 5 & 0',zh:'1和4 · 2和3 · 5和0'},{ko:'모으면 다시 5!',en:'Put together — 5 again!',zh:'合起来又是5！'}],
        result:{ko:'갈라도 모아도 전체는 그대로!',en:'Split or join — still the same!',zh:'分也好合也好，总数不变！'} }
    ],
    rule:{ ko:'가르고 모아도 전체 수는 변하지 않아요!',
      en:'Split or join — the total never changes!',
      zh:'分开合起来，总数都不变！' }
  },

  lab:{ generator:'nl4_bond', level:'main', count:4, params:{ mode:'split' },
    intro:{ ko:'이번엔 가르기! 위의 수를 보고 빈 원에 알맞게 톡톡 채워 봐. 0이 될 수도 있어!',
      en:'Now splitting! Look at the top number and fill the empty circle. It might even be 0!',
      zh:'现在来分！看上面的数，把空圆填对。有可能是0哦！' } },

  stamp:{ label:{ ko:'가르기 요정', en:'Split Fairy', zh:'分分小精灵' }, coins:20 },

  voice:{
    correct:[ {ko:'딩동댕! 🎉',en:'Ding-dong!',zh:'叮咚！'}, {ko:'우와, 딱 맞아! 🍬',en:'Wow, exactly right!',zh:'哇，正好！'}, {ko:'가르기 천재! ⭐',en:'Splitting genius!',zh:'分分小天才！'} ],
    wrong:[ {ko:'음~ 위의 수를 다시 볼까?',en:'Hmm, look at the top number again?',zh:'嗯，再看看上面的数？'}, {ko:'천천히 하나씩 채워 봐!',en:'Fill it slowly, one by one!',zh:'慢慢来，一个一个填！'} ],
    finish:{ ko:'짝짝짝! 가르기 요정 탄생! 🍬✨', en:'Clap clap! A Split Fairy is born!', zh:'鼓掌！分分小精灵诞生了！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
