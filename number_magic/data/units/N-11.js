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
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 수와 점은 쌍둥이!',en:'1) Numbers and dots are twins!',zh:'① 数字和点点是双胞胎！'},
        head:{ko:'같은 수를 다르게 보여주는 두 가지 방법',en:'Two ways to show the same amount',zh:'展示同样数量的两种方式'},
        desc:{ko:'수 <b>4</b>는 숫자 "4"로도, 점 네 개 ⠿ 로도 나타낼 수 있어요! 수 배열판에서 수들은 항상 <b>1씩 커지는 순서</b>로 줄을 서요 — 1, 2, 3, 4, 5… 빈 칸이 보이면 <b>앞 수에서 1을 더하면</b> 바로 답이 나와요! 점 그림과 수를 이을 때는 점을 하나하나 세어서 같은 수끼리 짝 지어요.',
          en:'<b>4</b> can be shown as the numeral "4" or as four dots! In a number array, numbers always grow by <b>1 at a time</b> — 1, 2, 3, 4, 5… If you see a blank, just <b>add 1 to the number before it</b>! To match dots and numbers, count the dots one by one and pair them up.',
          zh:'数字<b>4</b>可以写成"4"，也可以画成四个点！数字排列里，数<b>每次加1</b>依次增大——1、2、3、4、5……看到空格，只要<b>在前面的数上加1</b>就是答案！连点图和数字时，一个一个数点，找到一样多的配对。'},
        mathSteps:['앞 수 + 1 = 빈 칸','점을 세어요','같은 수끼리 이어요!'],
        result:{ko:'수와 점 그림은 같은 양을 말하는 쌍둥이예요!',en:'Numbers and dot pictures are twins showing the same amount!',zh:'数字和点图是表示同样数量的双胞胎！'},
        book:{ko:'이어 세기(+1)는 나중에 덧셈의 씨앗이 된답니다!',en:'Counting on (+1) plants the seed of addition!',zh:'接着数（+1）是以后加法的种子！'} }
    ],
    rule:{ ko:'① 이어 세기: 앞 수 +1 = 빈 칸 ② 점 매칭: 점을 세어 같은 수 카드와 이어요',
      en:'① Count on: prev +1 = blank ② Dot match: count dots, connect to the same number card',
      zh:'① 接着数：前一个+1＝空格 ② 点匹配：数点，与相同数量的数字卡连线' }
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
