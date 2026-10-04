/* Numbers of Magic — 유닛 N-12: 세 수 가르기와 양팔저울 식 (수의 나라 · 유아 5~7세) — 교재 G1-12 대응(2026-10-04)
   tier:'basic' → 경량 플로우: practice → discover(1스테이지) → lab → stamp
   두 부분 가르기(nl4_ladybug)·물건 개수 저울(nl12_scale)은 스레드 NL3·NL10 에 그대로 남아 있다.
   콘텐츠는 전부 창작(무당벌레 점·양팔저울 장면) — 라이선스 교재 삽화/지문 미사용 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['N-12'] = {
  id:'N-12', tier:'basic', level:'N', order:12,
  generator:'nlg12_parts', edu:'유아',
  title:{ ko:'세 수 가르기와 양팔저울 식', en:'Splitting into Three & Scale Equations', zh:'分成三个数与天平算式' },
  subtitle:{ ko:'무당벌레 점을 세 수로 갈라 보고, 저울의 두 식을 똑같게 만들어요!', en:'Split the ladybug spots into three numbers, then make both scale equations equal!', zh:'把瓢虫的点分成三个数，再让天平两边的算式一样！' },
  icon:'🐞',

  practice:{ generator:'nlg12_parts', level:'practice', count:4, params:{ arts:['ladybug','plane'], parts:3, wmin:4, wmax:6, given:1, lv:1 },
    intro:{ ko:'무당벌레 등의 점을 세 칸으로 갈라요! 한 칸은 보여 줬어요. 나머지 두 칸에 수를 써서 모두 합하면 맞아요',
      en:'Split the ladybug\'s spots into three boxes! One box is shown. Write numbers in the other two so everything adds up',
      zh:'把瓢虫背上的点分到三个格子里！有一个格子已经给出。在另外两个格子里写数，合起来正好就对了' } },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 가르는 방법은 여러 가지예요!',en:'1) There are many ways to split!',zh:'① 分法有很多种！'},
        head:{ko:'점 6개는 세 수로도 갈라져요',en:'Six spots can be split into three numbers too',zh:'6个点也能分成三个数'},
        desc:{ko:'🐞 점 6개는 1+2+3, 2+2+2, 1+1+4처럼 여러 가지로 갈라져요. 합이 6이면 모두 맞아요.',
          en:'Six spots split as 1+2+3, 2+2+2, 1+1+4 … Anything that adds up to 6 is right.',
          zh:'🐞 6个点能分成1+2+3、2+2+2、1+1+4……只要合起来是6就都对。'},
        mathSteps:[{ko:'점 6개 = 1+2+3',en:'6 spots = 1+2+3',zh:'6个点 = 1+2+3'},{ko:'저울: 양쪽 식의 값이 같아야 수평',en:'Scale: both sides must have the same value to be level',zh:'天平：两边的值一样才会水平'},{ko:'＋와 －를 바꿔 넣어 확인!',en:'Try + and − to check!',zh:'把＋和－换着填一填来验证！'}],
        result:{ko:'합이 같으면 저울이 수평이에요!',en:'Same total — the scale is level!',zh:'和一样，天平就水平！'} }
    ],
    rule:{ ko:'모두 합해서 같게! 저울은 양쪽 값이 같을 때 수평이에요!',
      en:'Add them all up! The scale is level when both sides have the same value!',
      zh:'全部合起来！两边的值一样时天平才水平！' }
  },

  lab:{ generator:'nlg12_eqscale', level:'main', count:4, params:{ both:false },
    intro:{ ko:'이번엔 양팔저울 식! 접시마다 식이 있어요. ＋ 또는 －를 골라 양쪽 결과를 똑같게 만들어요',
      en:'Now balance-scale equations! Each pan has an equation. Pick + or − so both sides give the same result',
      zh:'这次是天平算式！每个盘子里有一个算式。选＋或－，让两边的结果一样' } },

  stamp:{ label:{ ko:'저울 탐정', en:'Scale Detective', zh:'天平小侦探' }, coins:20 },

  voice:{
    correct:[ {ko:'딩동! 정확해요 🐞',en:'Ding! Exactly right!',zh:'叮！完全正确！'}, {ko:'저울이 딱 수평이에요! ⚖️',en:'The scale is perfectly level!',zh:'天平正好水平！'}, {ko:'합도 딱 맞췄어! ✨',en:'The total is perfect too!',zh:'合起来也对啦！'} ],
    wrong:[ {ko:'음~ 칸의 수를 모두 더해 볼까요?',en:'Hmm, add up all the boxes?',zh:'嗯，把所有格子里的数加起来试试？'}, {ko:'양쪽 식의 값을 하나씩 계산해 봐요',en:'Work out the value of each side',zh:'把两边算式的值一个个算出来'} ],
    finish:{ ko:'짝짝짝! 저울 탐정 탄생! 🐞⚖️', en:'Clap clap! A Scale Detective is born!', zh:'鼓掌！天平小侦探诞生了！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
