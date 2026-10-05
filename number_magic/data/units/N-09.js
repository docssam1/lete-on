/* Numbers of Magic — 유닛 N-09: 동전 던지기와 수나무 (수의 나라 · 유아 5~7세, 교재 G1-9; 2026-10 개편 — 피라미드·10원 세기는 NL5 드릴로 계속)
   tier:'basic' → 경량 플로우: practice → discover(1스테이지) → lab → stamp
   콘텐츠는 전부 창작(자체 설계 피라미드 퍼즐·이모지 동전) — 라이선스 교재 삽화/지문 미사용 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['N-09'] = {
  id:'N-09', tier:'basic', level:'N', order:9,
  generator:'nl38_scene', edu:'유아',
  title:{ ko:'동전 던지기와 수나무', en:'Coin Toss & Number Trees', zh:'扔硬币与数树' },
  subtitle:{ ko:'동전을 던져 식을 만들고, 가지를 더해 수나무를 채워요!', en:'Toss coins to make equations and add branches to fill the tree!', zh:'扔硬币列算式，把枝杈加起来填满数树！' },
  icon:'🌳',

  practice:{ generator:'nl38_scene', level:'practice', count:4, params:{ mode:'coins', toss:true },
    intro:{ ko:'동전을 던져 볼까? 별무늬와 달무늬가 몇 개 나오는지 보고 식을 채워요!',
      en:'Toss the coins! See how many stars and moons show up, then fill the equation.',
      zh:'来扔硬币！看看星星面和月亮面各有几个，再填算式。' } },

  discover:{
    story:{
      hook:{ ko:'동전 6개를 던졌더니 별무늬 2개, 달무늬 4개! 식으로 쓰면 어떻게 될까요?',
        en:'You toss 6 coins: 2 stars and 4 moons! How do you write that as an equation?',
        zh:'扔了6枚硬币：2个星星面、4个月亮面！写成算式是什么？' },
      history:{ ko:'동전을 던지면 별무늬와 달무늬가 나뉘어요. 6개를 던져 2개가 별이면 2+4=6, 6−2=4예요. 수나무는 이 가르기를 가지로 그린 거예요 — 위 원의 수는 아래 두 원을 더한 값이에요.',
        en:'Tossed coins split into stars and moons: 6 coins with 2 stars give 2 + 4 = 6 and 6 − 2 = 4. A number tree draws that split as branches — a circle is the sum of the two circles under it.',
        zh:'硬币扔出来分成星星面和月亮面：6枚里有2枚星星面，就是2＋4＝6、6－2＝4。数树把这种分解画成枝杈——每个圆等于它下面两个圆之和。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 가르면 가지가 돼요',en:'1) A split becomes branches',zh:'① 分开就成了枝杈'},
        head:{ko:'두 가지를 더하면 위 원이에요',en:'Two branches add up to the circle',zh:'两根枝杈相加就是上面的圆'},
        desc:{ko:'2와 3을 더하면 5! 5와 1을 더하면 6!',
          en:'2 and 3 make 5! 5 and 1 make 6!',
          zh:'2和3是5！5和1是6！'},
        mathSteps:['2 + 3 = 5','5 + 1 = 6'],
        result:{ko:'가지를 더해 나무를 채워요!',en:'Add the branches to fill the tree!',zh:'把枝杈加起来填满数树！'} }
    ],
    rule:{ ko:'가지 두 개를 더하면 원 하나예요!',
      en:'Two branches add up to one circle!',
      zh:'两根枝杈相加就是一个圆！' }
  },

  lab:{ generator:'nl40_diagram', level:'main', count:4, params:{ mode:'tree', shape:'sym4', flow:'merge', kMin:1, kMax:2 },
    intro:{ ko:'이제 수나무! 위 두 원을 더한 값이 아래 원이에요. 빈 원을 채워 봐!',
      en:'Now the number tree! The circle below is the sum of the two above. Fill the empty circle!',
      zh:'现在是数树！下面的圆等于上面两个圆之和。把空圆圈填出来！' } },

  stamp:{ label:{ ko:'수나무 정원사', en:'Number Tree Gardener', zh:'数树小园丁' }, coins:20 },

  voice:{
    correct:[ {ko:'딩동댕! 🎉',en:'Ding-dong!',zh:'叮咚！'}, {ko:'가지가 딱 맞아! 🌳',en:'The branches fit!',zh:'枝杈正合适！'}, {ko:'동전 박사! 🪙',en:'Coin expert!',zh:'硬币博士！'} ],
    wrong:[ {ko:'음~ 두 가지를 더해 볼까?',en:'Hmm, add the two branches?',zh:'嗯，把两根枝杈加起来看看？'}, {ko:'별무늬와 달무늬를 다시 세어 볼까?',en:'Count the stars and moons again?',zh:'再数数星星面和月亮面？'} ],
    finish:{ ko:'짝짝짝! 수나무 정원사 탄생! 🌳✨', en:'Clap clap! A Number Tree Gardener is born!', zh:'鼓掌！数树小园丁诞生了！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
