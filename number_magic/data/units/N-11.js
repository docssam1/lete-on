/* Numbers of Magic — 유닛 N-11: 식과 숫자 카드 (수의 나라 · 유아 5~7세) — 교재 G1-11 대응(2026-10-04)
   tier:'basic' → 경량 플로우: practice → discover(1스테이지) → lab → stamp
   유아 단계에 식(+ − = □) 표기를 처음 들여오는 유닛. 이어 세기·수-점 매칭은 스레드 NL7 에 그대로 남아 있다(코스 11·17주가 NL7@2·@3 을 부른다).
   콘텐츠는 전부 창작(별·숫자 카드·식) — 라이선스 교재 삽화/지문 미사용 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['N-11'] = {
  id:'N-11', tier:'basic', level:'N', order:11,
  generator:'nlg11_eqvert', edu:'유아',
  title:{ ko:'식과 숫자 카드', en:'Equations & Number Cards', zh:'算式与数字卡片' },
  subtitle:{ ko:'별을 보고 식의 빈칸을 채우고, 숫자 카드로 식을 만들어요!', en:'Look at the stars to fill the equation, then build equations with number cards!', zh:'看星星填算式的空格，再用数字卡片做算式！' },
  icon:'🔢',

  practice:{ generator:'nlg11_eqvert', level:'practice', count:4, params:{ mode:'eq', lv:1 },
    intro:{ ko:'별이 몇 개인지 보고, 식의 빈칸에 알맞은 수를 써요! 별은 전체의 수예요',
      en:'Look at how many stars there are, then write the right number in the blank! The stars show the whole',
      zh:'看看星星有几颗，把合适的数写进算式的空格！星星的数量就是总数' } },

  discover:{
    story:{
      hook:{ ko:'별 5개 중에서 몇 개를 가져갔더니 2개가 남았어요. 가져간 별은 몇 개일까요?',
        en:'There were 5 stars. Some were taken away and 2 are left. How many were taken?',
        zh:'有5颗星星，拿走了几颗，还剩2颗。拿走了几颗呢？' },
      history:{ ko:'3개예요. 이런 문제를 식으로 쓰면 5 − □ = 2 가 돼요. 등호(＝)는 아주 오래전에 한 영국 수학자가 만들었는데, "길이가 같은 두 줄만큼 서로 똑같은 것은 없다"고 생각해서 나란한 두 줄로 나타냈다고 해요.',
        en:'Three. Written as an equation it is 5 − □ = 2. The equals sign (=) was invented long ago by an English mathematician who thought nothing is more alike than two parallel lines of the same length — so he drew two of them.',
        zh:'是3颗。写成算式就是 5 − □ = 2。等号(＝)是很久以前一位英国数学家发明的，他觉得没有什么比两条一样长的平行线更相像了，所以就画了两条。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 식은 수의 이야기!',en:'1) An equation tells a story!',zh:'① 算式是数的故事！'},
        head:{ko:'별의 수는 전체, 식은 부분을 맞춰 줘요',en:'The stars are the whole; the equation fits the parts together',zh:'星星的数量是总数，算式把各部分对起来'},
        desc:{ko:'□가 어디에 있어도 전체와 부분의 관계로 찾을 수 있어요.',
          en:'Wherever the □ is, you can find it from how the whole and parts connect.',
          zh:'□不管在哪里，都能用总数和部分的关系找出来。'},
        mathSteps:[{ko:'별의 수 = 전체',en:'Stars = the whole',zh:'星星的数量 = 总数'},{ko:'더하기: 부분 + 부분 = 전체',en:'Add: part + part = whole',zh:'加法：部分＋部分＝总数'},{ko:'빼기: 전체 − 한 부분 = 다른 부분',en:'Subtract: whole − one part = other part',zh:'减法：总数－一个部分＝另一个部分'}],
        result:{ko:'전체와 부분으로 □를 찾아요!',en:'Find □ from the whole and the parts!',zh:'用总数和部分找出□！'} }
    ],
    rule:{ ko:'더하면 전체! 빼면 나머지 부분! □는 전체와 부분으로 찾아요!',
      en:'Add to get the whole! Subtract to get the other part! Find □ with the whole and parts!',
      zh:'加起来是总数！减掉是另一部分！用总数和部分找□！' }
  },

  lab:{ generator:'nlg11_make', level:'main', count:4, params:{ mode:'cardeq', kind:'target', lv:1 },
    intro:{ ko:'숫자 카드로 식을 만들어요! 카드를 눌러 칸에 넣고, 답이 목표 수가 되는 식을 만들어 봐요',
      en:'Build equations with number cards! Tap cards into the boxes and make equations whose answer is the target',
      zh:'用数字卡片做算式！点卡片放进格子里，做出得数是目标数的算式' } },

  stamp:{ label:{ ko:'식 박사', en:'Equation Expert', zh:'算式专家' }, coins:20 },

  voice:{
    correct:[ {ko:'딩동! 식이 딱 맞아요 ✨',en:'Ding! The equation is exactly right!',zh:'叮！算式完全正确！'},
              {ko:'훌륭해요! 🌟',en:'Excellent!',zh:'太棒了！'},
              {ko:'별을 잘 읽었어요! 🎉',en:'You read the stars well!',zh:'星星读得真准！'} ],
    wrong:[ {ko:'음~ 별의 수를 다시 볼까요?',en:'Hmm, look at the stars again?',zh:'嗯，再看看星星的数量？'},
            {ko:'전체와 부분을 맞춰 봐요!',en:'Fit the whole and the parts together!',zh:'把总数和部分对一对！'} ],
    finish:{ ko:'완벽해요! 식 박사 탄생! 🔢✨', en:'Perfect! An Equation Expert is born!', zh:'太完美了！算式专家诞生！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
