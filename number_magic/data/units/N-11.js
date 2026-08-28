/* Numbers of Magic — 유닛 N-11: 수 배열·이어 세기 (수의 나라 · 유아 5~7세)
   tier:'basic' → 경량 플로우: practice → discover(1스테이지) → lab → stamp
   콘텐츠는 전부 창작(이모지·점 배열) — 라이선스 교재 삽화/지문 미사용 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['N-11'] = {
  id:'N-11', tier:'basic', level:'N', order:11,
  generator:'nl11_arrange', edu:'유아',
  title:{ ko:'수 배열·이어 세기', en:'Number Arrays & Counting On', zh:'数字排列与接着数' },
  subtitle:{ ko:'빈 칸을 채우고, 수와 점 그림을 이어요!', en:'Fill the blanks and match numbers to dot pictures!', zh:'填空格，连数字与点图！' },
  icon:'🔢',

  practice:{ generator:'nl11_arrange', level:'practice', count:4, params:{ mode:'seq' },
    intro:{ ko:'수가 1씩 커지며 순서대로 줄을 서요! 빈 칸에 올 수를 골라 보자',
      en:'Numbers grow by 1, lining up in order! Pick the missing one',
      zh:'数字一个一个变大，排排队！选出空格里的数' } },

  discover:{
    story:{
      hook:{ ko:'친구 41명이 동그랗게 앉아 셋째마다 한 명씩 빠지는 놀이를 해요. 끝까지 남으려면 몇 번째 자리에 앉아야 할까요?',
        en:'Forty-one friends sit in a circle and every third one drops out. Which seat survives to the end?',
        zh:'41个小朋友围成圈，每数到第三个就出局。想留到最后该坐第几个位子？' },
      history:{ ko:'31번째예요. 세는 규칙이 정해져 있으면 남는 자리도 이미 정해져 있어서, 미리 한 바퀴 세어 보면 알 수 있어요. 아주 오래전부터 전해진 이야기인데, 지금은 자리를 세어 답을 찾는 놀이로 즐긴답니다.',
        en:'Seat 31. When the counting rule is fixed, the surviving seat is fixed too — walk the circle once on paper and it appears. The story is very old; today we play it as a puzzle about counting positions.',
        zh:'第31个。数数的规则一旦定下，留到最后的位子也就定了——在纸上走一圈就能找出来。这个故事流传已久，今天我们把它当作数位置的游戏来玩。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 수와 점은 쌍둥이!',en:'1) Numbers and dots are twins!',zh:'① 数字和点点是双胞胎！'},
        head:{ko:'같은 수를 다르게 보여주는 두 가지 방법',en:'Two ways to show the same amount',zh:'展示同样数量的两种方式'},
        desc:{ko:'빈 칸은 앞 수에 1을 더하면 돼요!',
          en:'For a blank, just add 1 to the number before!',
          zh:'空格就是前面的数加1！'},
        mathSteps:['앞 수 + 1 = 빈 칸','점을 세어요','같은 수끼리 이어요!'],
        result:{ko:'수 4와 점 4개는 쌍둥이!',en:'The number 4 and four dots are twins!',zh:'数字4和4个点是双胞胎！'} }
    ],
    rule:{ ko:'앞 수 +1! 점은 세어서 같은 수와 이어요!',
      en:'Prev +1! Count dots and match the same number!',
      zh:'前一个加1！点数一数，连一样的数！' }
  },

  lab:{ generator:'nl11_arrange', level:'main', count:4, params:{ mode:'match' },
    intro:{ ko:'수와 점 그림을 이어요! 왼쪽 수 카드를 먼저 톡 — 오른쪽 점 그림을 골라 이어요!',
      en:'Match numbers to dot pictures! Tap a number card first, then tap its dots!',
      zh:'连连看！先点左边的数字卡，再点右边的点图！' } },

  stamp:{ label:{ ko:'수 배열사', en:'Array Expert', zh:'数列专家' }, coins:20 },

  voice:{
    correct:[ {ko:'딩동! 딱 맞아요 ✨',en:'Ding! Perfect match!',zh:'叮！配对成功！'},
              {ko:'훌륭해요! 🌟',en:'Excellent!',zh:'太棒了！'},
              {ko:'점을 잘 셌어요! 🎉',en:'Great dot counting!',zh:'点得真准！'} ],
    wrong:[ {ko:'음~ 점을 다시 세어볼까요?',en:'Hmm, count the dots again?',zh:'嗯，再数数点点？'},
            {ko:'앞 수에 1을 더해 봐요!',en:'Add 1 to the number before!',zh:'在前面的数上加1试试！'} ],
    finish:{ ko:'완벽해요! 수 배열 전문가! 🔢✨', en:'Perfect! Number Array Expert!', zh:'太完美了！数列专家诞生！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
