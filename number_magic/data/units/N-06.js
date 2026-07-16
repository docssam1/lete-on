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
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 가르기 나무',en:'1) The split tree',zh:'① 分分树'},
        head:{ko:'하나의 수가 두 갈래로!',en:'One number splits into two branches!',zh:'一个数分成两枝！'},
        desc:{ko:'사탕 🍬 5개를 두 손에 나눠 쥐어요. 1개와 4개, 2개와 3개… 나누는 방법이 여러 가지죠? 이걸 <b>가르기</b>라고 해요. 반대로 두 손의 사탕을 합치는 건 <b>모으기</b> — 갈라도 모아도 <b>전체는 그대로 5개</b>예요! 그리고 한 손에 하나도 없으면? 그게 바로 <b>0</b>! 5는 5와 0으로도 가를 수 있어요.',
          en:'Hold 5 candies 🍬 in two hands: 1 and 4, 2 and 3… many ways! That\'s <b>splitting</b>. Putting them back together is <b>joining</b> — split or join, <b>the total stays 5</b>! And an empty hand? That\'s <b>zero</b>! 5 can split into 5 and 0 too.',
          zh:'把5个糖🍬分到两只手里：1和4、2和3……有好多种分法！这叫<b>分</b>。把两只手的糖放回一起叫<b>合</b>——不管怎么分怎么合，<b>总数还是5</b>！要是一只手空空的呢？那就是<b>0</b>！5也可以分成5和0。'},
        mathSteps:['🍬🍬🍬🍬🍬 = 5','1과 4 · 2와 3 · 5와 0','모으면 다시 5!'],
        result:{ko:'갈라도 모아도 전체는 그대로!',en:'Split or join — the total never changes!',zh:'分也好合也好，总数不变！'},
        book:{ko:'빈 손 = 0이에요. 0도 어엿한 수랍니다!',en:'An empty hand = 0. Zero is a real number too!',zh:'空手＝0。0也是真正的数哦！'} }
    ],
    rule:{ ko:'① 가르기 = 두 갈래로 나누기 ② 모으기 = 다시 합치기 ③ 하나도 없으면 0!',
      en:'① Split = break into two ② Join = put back together ③ Nothing at all = 0!',
      zh:'① 分＝分成两份 ② 合＝放回一起 ③ 一个都没有＝0！' }
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
