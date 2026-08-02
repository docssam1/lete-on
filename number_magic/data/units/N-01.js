/* Numbers of Magic — 유닛 N-01: 수 세기 (수의 나라 · 유아 5~7세)
   tier:'basic' → 경량 플로우: practice → discover(1스테이지) → lab → stamp
   콘텐츠는 전부 창작(이모지 장면) — 라이선스 교재 삽화/지문 미사용 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['N-01'] = {
  id:'N-01', tier:'basic', level:'N', order:1,
  generator:'nl1_count', edu:'유아',
  title:{ ko:'수 세기', en:'Counting', zh:'数数' },
  subtitle:{ ko:'톡톡 짚으며 하나, 둘, 셋!', en:'Tap and count — one, two, three!', zh:'点一点数一数——一、二、三！' },
  icon:'🐤',

  practice:{ generator:'nl1_count', level:'practice', count:4, params:{ mode:'count' },
    intro:{ ko:'누미랑 같이 세어 보자! 톡톡 누르면서 하나, 둘, 셋!',
      en:"Let's count with Numi! Tap along — one, two, three!",
      zh:'和努米一起数数吧！点一点——一、二、三！' } },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 하나씩 짚어요',en:'1) Touch one by one',zh:'① 一个一个点'},
        head:{ko:'짚은 것마다 수 이름 하나!',en:'One number name for each touch!',zh:'点一个说一个数！'},
        desc:{ko:'🐤 하나씩 짚으며 "하나, 둘, 셋!"',
          en:'Touch one by one: "one, two, three!"',
          zh:'一个一个点："一、二、三！"'},
        mathSteps:['🐤 하나','🐤🐤 둘','🐤🐤🐤 셋 → 모두 3!'],
        result:{ko:'마지막 수 = 모두 몇 개!',en:'Last number = how many!',zh:'最后的数＝一共几个！'} }
    ],
    rule:{ ko:'하나씩 짚어요! 마지막 수가 전체 개수예요.',
      en:'Touch one by one! The last number is the total!',
      zh:'一个一个点！最后的数就是总数！' }
  },

  lab:{ generator:'nl1_count', level:'main', count:4, params:{ mode:'make' },
    intro:{ ko:'이번엔 반대로! 누미가 말한 수만큼 톡톡 만들어 봐.',
      en:'Now the other way — tap to make as many as Numi says!',
      zh:'现在反过来——按努米说的数点出来！' } },

  stamp:{ label:{ ko:'수 세기 꼬마 마법사', en:'Little Counting Wizard', zh:'数数小魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'딩동댕! 🎉',en:'Ding-dong!',zh:'叮咚！'}, {ko:'우와, 잘 셌어! 🐤',en:'Wow, great counting!',zh:'哇，数得真棒！'}, {ko:'최고야! ⭐',en:'The best!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 하나씩 세어 볼까?',en:'Hmm, count again one by one?',zh:'嗯，再一个一个数数看？'}, {ko:'천천히 톡, 톡, 톡!',en:'Slowly — tap, tap, tap!',zh:'慢慢来——点、点、点！'} ],
    finish:{ ko:'짝짝짝! 수 세기 꼬마 마법사 탄생! 🐤✨', en:'Clap clap! A Little Counting Wizard is born!', zh:'鼓掌！数数小魔法师诞生了！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
