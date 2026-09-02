/* Numbers of Magic — 유닛 N-02: 수의 순서 (수의 나라 · 유아 5~7세)
   tier:'basic' → 경량 플로우: practice → discover(1스테이지) → lab → stamp
   콘텐츠는 전부 창작(수열 칩·오리지널 점 잇기 도형) — 라이선스 교재 삽화/지문 미사용 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['N-02'] = {
  id:'N-02', tier:'basic', level:'N', order:2,
  generator:'nl2_seq', edu:'유아',
  title:{ ko:'수의 순서', en:'Number Order', zh:'数的顺序' },
  subtitle:{ ko:'앞으로, 거꾸로, 폴짝폴짝 뛰어세기!', en:'Forward, backward, and skip-counting hops!', zh:'往前数、倒着数、跳着数！' },
  icon:'🪜',

  practice:{ generator:'nl2_seq', level:'practice', count:4, params:{ mode:'gap' },
    intro:{ ko:'수들이 사다리처럼 줄을 섰어! 빈 칸에 누가 올지 골라 볼까?',
      en:'The numbers lined up like a ladder! Who goes in the blank?',
      zh:'数字像梯子一样排好队啦！空格里该是谁呢？' } },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 수의 줄서기',en:'1) Numbers in line',zh:'① 数字排队'},
        head:{ko:'앞으로도, 거꾸로도, 건너뛰며도!',en:'Forward, backward, and skipping!',zh:'往前、倒着、还能跳着数！'},
        desc:{ko:'1,2,3,4,5… 앞으로! 5,4,3,2,1… 거꾸로!',
          en:'1,2,3,4,5… forward! 5,4,3,2,1… backward!',
          zh:'1、2、3、4、5……往前！5、4、3、2、1……倒着！'},
        mathSteps:[{ko:'1→2→3→4→5 (앞으로)',en:'1→2→3→4→5 (forward)',zh:'1→2→3→4→5（往前数）'},{ko:'5→4→3→2→1 (거꾸로)',en:'5→4→3→2→1 (backward)',zh:'5→4→3→2→1（倒着数）'},{ko:'2→4→6→8→10 (2씩 폴짝!)',en:'2→4→6→8→10 (hop by 2!)',zh:'2→4→6→8→10（两个两个跳！）'}],
        result:{ko:'순서를 알면 다음 수가 보여요!',en:'Know the order — see the next!',zh:'记住顺序，就能猜到下一个！'} }
    ],
    rule:{ ko:'앞으로는 1씩 커지고, 거꾸로는 1씩 작아져요!',
      en:'Forward grows by 1, backward shrinks by 1!',
      zh:'往前每次大1，倒着每次小1！' }
  },

  lab:{ generator:'nl2_seq', level:'main', count:3, params:{ mode:'dots' },
    intro:{ ko:'점 잇기 시간! 1부터 차례대로 점을 톡톡 — 숨은 그림이 나타나!',
      en:'Dot-to-dot time! Tap the dots from 1 in order — a hidden picture appears!',
      zh:'连点时间！从1开始按顺序点——藏着的图案出现啦！' } },

  stamp:{ label:{ ko:'순서 길잡이', en:'Order Pathfinder', zh:'顺序小向导' }, coins:20 },

  voice:{
    correct:[ {ko:'딩동댕! 🎉',en:'Ding-dong!',zh:'叮咚！'}, {ko:'순서 딱딱! 🪜',en:'Right in order!',zh:'顺序对啦！'}, {ko:'다음 수 발견! ⭐',en:'Next number found!',zh:'找到下一个数！'} ],
    wrong:[ {ko:'음~ 몇씩 변하는지 다시 볼까?',en:'Hmm, how much does it change each step?',zh:'嗯，每次变多少？再看看？'}, {ko:'계단을 하나씩 세어 봐!',en:'Count the steps one by one!',zh:'一级一级数楼梯！'} ],
    finish:{ ko:'짝짝짝! 순서 길잡이 탄생! 🪜✨', en:'Clap clap! An Order Pathfinder is born!', zh:'鼓掌！顺序小向导诞生了！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
