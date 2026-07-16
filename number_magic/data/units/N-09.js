/* Numbers of Magic — 유닛 N-09: 수 피라미드와 동전 세기 (수의 나라 · 유아 5~7세)
   tier:'basic' → 경량 플로우: practice → discover(1스테이지) → lab → stamp
   콘텐츠는 전부 창작(자체 설계 피라미드 퍼즐·이모지 동전) — 라이선스 교재 삽화/지문 미사용 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['N-09'] = {
  id:'N-09', tier:'basic', level:'N', order:9,
  generator:'nl9_chain', edu:'유아',
  title:{ ko:'수 피라미드와 동전 세기', en:'Number Pyramid & Coin Counting', zh:'数字金字塔与数硬币' },
  subtitle:{ ko:'이웃 돌을 모아 쌓고, 10원씩 폴짝 세고!', en:'Stack neighbor stones and hop-count by tens!', zh:'把邻居石头叠上去，再10元10元地跳着数！' },
  icon:'🗼',

  practice:{ generator:'nl9_chain', level:'practice', count:4, params:{ mode:'coins' },
    intro:{ ko:'반짝반짝 10원 동전! 한 닢 누를 때마다 10, 20, 30… 뛰어세 보자!',
      en:'Shiny ten coins! Each tap counts 10, 20, 30…',
      zh:'亮晶晶的10元硬币！每点一枚就数10、20、30……' } },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 모으기가 쌓이면 탑!',en:'1) Joins stack into a tower!',zh:'① 合起来叠成塔！'},
        head:{ko:'이웃 두 돌을 모으면 위 돌이 돼요',en:'Two neighbor stones join into the stone above',zh:'相邻两块石头合起来就是上面那块'},
        desc:{ko:'가르기 나무를 기억하죠? 수 피라미드는 <b>모으기를 층층이 쌓은 탑</b>이에요! 바닥에 1, 2, 1이 있으면 — 이웃끼리 모아서 <b>1+2=3</b>, <b>2+1=3</b>이 가운데 층, 다시 <b>3+3=6</b>이 꼭대기! 그리고 동전 세기도 모으기의 친구예요. 10원 동전은 한 닢이 <b>10</b>이라서 하나, 둘, 셋이 아니라 <b>10, 20, 30</b>으로 폴짝폴짝 뛰어세요!',
          en:'Remember the split tree? A number pyramid is <b>joins stacked into a tower</b>! With 1, 2, 1 on the bottom — neighbors join: <b>1+2=3</b> and <b>2+1=3</b> in the middle, then <b>3+3=6</b> on top! Coin counting is a friend of joining too: each ten-coin is worth <b>10</b>, so we hop <b>10, 20, 30</b> instead of 1, 2, 3!',
          zh:'还记得分分树吗？数字金字塔就是<b>把"合"一层层叠成塔</b>！底层是1、2、1——邻居合起来：<b>1+2=3</b>、<b>2+1=3</b>是中层，再<b>3+3=6</b>就是塔顶！数硬币也是"合"的朋友：一枚10元硬币是<b>10</b>，所以不数1、2、3，而是<b>10、20、30</b>跳着数！'},
        mathSteps:['바닥: 1, 2, 1','가운데: 1+2=3, 2+1=3','꼭대기: 3+3=6!'],
        result:{ko:'모으기를 쌓으면 피라미드, 10씩 모으면 동전 세기!',en:'Stack joins → pyramid; join tens → coin counting!',zh:'把合叠起来是金字塔，10个10个合是数硬币！'},
        book:{ko:'10, 20, 30… 뛰어세기는 나중에 곱셈의 씨앗이 된답니다!',en:'Hop-counting 10, 20, 30… plants the seed of multiplication!',zh:'10、20、30……跳着数是以后乘法的种子！'} }
    ],
    rule:{ ko:'① 이웃 두 돌의 모으기 = 위 돌 ② 층층이 쌓으면 꼭대기까지 ③ 10원은 10, 20, 30으로 세요!',
      en:'① Join two neighbors = stone above ② Stack layer by layer to the top ③ Count ten-coins 10, 20, 30!',
      zh:'① 相邻两块合起来＝上面那块 ② 一层层叠到塔顶 ③ 10元硬币按10、20、30数！' }
  },

  lab:{ generator:'nl9_chain', level:'main', count:4, params:{ mode:'pyramid' },
    intro:{ ko:'이제 피라미드 탑 쌓기! 빈 돌에 올 수를 골라 봐. 가운데가 비어 있을 수도 있어!',
      en:'Now build the pyramid! Pick the number for the empty stone — it might be in the middle!',
      zh:'现在来叠金字塔！选出空石头上的数——空的可能在中间哦！' } },

  stamp:{ label:{ ko:'피라미드 석공', en:'Pyramid Mason', zh:'金字塔小石匠' }, coins:20 },

  voice:{
    correct:[ {ko:'딩동댕! 🎉',en:'Ding-dong!',zh:'叮咚！'}, {ko:'돌이 딱 맞아! 🗼',en:'The stone fits!',zh:'石头正合适！'}, {ko:'폴짝폴짝 잘 셌어! 🪙',en:'Great hop-counting!',zh:'跳得真棒！'} ],
    wrong:[ {ko:'음~ 이웃 두 돌을 모아 볼까?',en:'Hmm, join the two neighbors?',zh:'嗯，把相邻两块合起来看看？'}, {ko:'10, 20, 30… 다시 폴짝!',en:'10, 20, 30… hop again!',zh:'10、20、30……再跳一次！'} ],
    finish:{ ko:'짝짝짝! 피라미드 석공 탄생! 🗼✨', en:'Clap clap! A Pyramid Mason is born!', zh:'鼓掌！金字塔小石匠诞生了！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
