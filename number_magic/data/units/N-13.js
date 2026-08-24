/* Numbers of Magic — 유닛 N-13: 수 퍼즐과 추론 (수의 나라 · 유아 5~7세)
   tier:'basic' → 경량 플로우: practice → discover(1스테이지) → lab → stamp
   콘텐츠는 전부 창작(격자 길·십자 퍼즐) — 라이선스 교재 삽화/지문 미사용 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['N-13'] = {
  id:'N-13', tier:'basic', level:'N', order:13,
  generator:'nl13_puzzle', edu:'유아',
  title:{ ko:'수 퍼즐과 추론', en:'Number Puzzles & Reasoning', zh:'数字谜题与推理' },
  subtitle:{ ko:'격자 길을 잇고, 십자 퍼즐의 빈칸도 추리해요!', en:'Connect the grid path, then solve the cross puzzle!', zh:'连接格子路，再推理十字谜题的空格！' },
  icon:'🧩',

  practice:{ generator:'nl13_puzzle', level:'practice', count:3, params:{ mode:'path' },
    intro:{ ko:'격자 위에 길이 있어요! 1부터 차례대로 톡톡 이어 봐요',
      en:'There\'s a path on the grid! Tap from 1 in order',
      zh:'格子上有一条路！从1开始按顺序点一点' } },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 십자 퍼즐의 비밀!',en:'1) The secret of the cross puzzle!',zh:'① 十字谜题的秘密！'},
        head:{ko:'위+아래는 왼쪽+오른쪽과 같아요',en:'Top+bottom equals left+right',zh:'上+下等于左+右'},
        desc:{ko:'위 2 + 아래 3 = 5! 왼쪽+오른쪽도 5가 되게!',
          en:'Top 2 + bottom 3 = 5! Left+right must be 5 too!',
          zh:'上2＋下3＝5！左＋右也要是5！'},
        mathSteps:['위+아래 = 왼쪽+오른쪽','한쪽 합을 구해요','빈칸을 거꾸로 계산!'],
        result:{ko:'양쪽 합이 똑같아야 해요!',en:'Both sums must match!',zh:'两边的和要一样！'} }
    ],
    rule:{ ko:'위+아래 = 왼쪽+오른쪽!',
      en:'Top+bottom = left+right!',
      zh:'上＋下＝左＋右！' }
  },

  lab:{ generator:'nl13_puzzle', level:'main', count:4, params:{ mode:'cross' },
    intro:{ ko:'십자 퍼즐 시간! 위+아래와 왼쪽+오른쪽이 같도록 빈 칸의 답을 골라요',
      en:'Cross puzzle time! Pick the answer so top+bottom equals left+right',
      zh:'十字谜题时间！选出答案，让上+下等于左+右' } },

  stamp:{ label:{ ko:'퍼즐 추리왕', en:'Puzzle Reasoner', zh:'谜题推理王' }, coins:20 },

  voice:{
    correct:[ {ko:'딩동! 딱 맞아요 🧩',en:'Ding! Perfect fit!',zh:'叮！完全吻合！'}, {ko:'추리 성공! 🔍',en:'Reasoning success!',zh:'推理成功！'}, {ko:'길을 잘 이었어요! ✨',en:'Great path-connecting!',zh:'路连得真好！'} ],
    wrong:[ {ko:'음~ 위+아래를 먼저 더해 볼까요?',en:'Hmm, add top+bottom first?',zh:'嗯，先加上+下试试？'}, {ko:'순서를 다시 한 번 볼까요?',en:'Let\'s look at the order again?',zh:'再看看顺序吧？'} ],
    finish:{ ko:'짝짝짝! 퍼즐 추리왕 탄생! 🧩✨', en:'Clap clap! A Puzzle Reasoner is born!', zh:'鼓掌！谜题推理王诞生了！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
