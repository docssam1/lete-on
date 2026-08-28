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
    story:{
      hook:{ ko:'6을 나누어 떨어지게 하는 수를 모두 찾아 더해 볼까요? 1 + 2 + 3 = ?',
        en:'Find every number that divides 6 evenly, then add them: 1 + 2 + 3 = ?',
        zh:'找出所有能整除6的数，再加起来：1 + 2 + 3 = ?' },
      history:{ ko:'자기 자신을 뺀 약수를 모두 더하면 다시 자기가 되는 수를 완전수라고 해요. 6과 28이 그런 수예요. 우리 조상들도 수에 뜻을 담아 홀수가 겹치는 날을 명절로 삼았어요 — 설(1월 1일), 삼짓날(3월 3일), 단오(5월 5일), 칠석(7월 7일), 중양절(9월 9일).',
        en:'A number whose divisors (not counting itself) add back up to itself is called perfect: 6 and 28 are the first two. Korea gave numbers meaning too, marking holidays where an odd number doubles — Seollal (1/1), Samjinnal (3/3), Dano (5/5), Chilseok (7/7), Jungyangjeol (9/9).',
        zh:'把一个数除本身以外的所有约数相加，又得回它自己，这样的数叫完全数：6和28就是最前面的两个。韩国也给数赋予含义，把奇数相重的日子定为节日——春节(1/1)、三巳节(3/3)、端午(5/5)、七夕(7/7)、重阳(9/9)。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 모으기가 쌓이면 탑!',en:'1) Joins stack into a tower!',zh:'① 合起来叠成塔！'},
        head:{ko:'이웃 두 돌을 모으면 위 돌이 돼요',en:'Two neighbor stones join into the stone above',zh:'相邻两块石头合起来就是上面那块'},
        desc:{ko:'이웃 돌 둘을 모으면 위 돌! 동전은 10, 20, 30!',
          en:'Two neighbor stones make the top one! Coins go 10, 20, 30!',
          zh:'相邻两块合成上面那块！硬币10、20、30！'},
        mathSteps:['바닥: 1, 2, 1','가운데: 1+2=3, 2+1=3','꼭대기: 3+3=6!'],
        result:{ko:'층층이 쌓으면 꼭대기까지!',en:'Stack up to the top!',zh:'一层层叠到塔顶！'} }
    ],
    rule:{ ko:'이웃 두 돌을 모으면 위 돌이에요!',
      en:'Join two neighbors to make the stone above!',
      zh:'相邻两块合起来就是上面那块！' }
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
