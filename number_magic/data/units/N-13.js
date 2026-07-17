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
        desc:{ko:'십자 모양으로 수가 4개 놓여 있어요. <b>위</b>와 <b>아래</b>를 더한 값이, <b>왼쪽</b>과 <b>오른쪽</b>을 더한 값과 <b>똑같아야</b> 해요! 예를 들어 위가 <b>2</b>, 아래가 <b>3</b>이면 위+아래는 <b>5</b>예요. 왼쪽이 <b>2</b>라면, 오른쪽은 5에서 2를 뺀 <b>3</b>이어야 딱 맞아요. 격자 길잇기도 비슷해요 — <b>순서</b>를 잘 보고 다음 칸이 어디인지 <b>추리</b>하는 거예요!',
          en:'Four numbers sit in a cross shape. <b>Top</b> plus <b>bottom</b> must be the <b>same</b> as <b>left</b> plus <b>right</b>! If top is <b>2</b> and bottom is <b>3</b>, top+bottom is <b>5</b>. If left is <b>2</b>, then right must be <b>3</b> (5 minus 2) to make it match. Grid path-connecting is similar — look carefully at the <b>order</b> and <b>reason out</b> where the next spot is!',
          zh:'十字形状里放着4个数。<b>上</b>加<b>下</b>必须和<b>左</b>加<b>右</b><b>相等</b>！如果上是<b>2</b>，下是<b>3</b>，上+下就是<b>5</b>。如果左是<b>2</b>，那右边就要是5减2＝<b>3</b>才对。连格子路也差不多——仔细看<b>顺序</b>，<b>推理</b>出下一个点在哪里！'},
        mathSteps:['위+아래 = 왼쪽+오른쪽','한쪽 합을 구해요','다른 쪽에서 빈칸을 거꾸로 계산!'],
        result:{ko:'퍼즐은 규칙을 찾아 거꾸로 계산하는 마법이에요!',en:'Puzzles are magic for finding rules and working backward!',zh:'谜题是找规律、倒着算的魔法！'},
        book:{ko:'이런 추론은 나중에 방정식 풀이의 첫걸음이 돼요!',en:'This kind of reasoning is a first step toward solving equations!',zh:'这种推理是以后解方程的第一步！'} }
    ],
    rule:{ ko:'① 위+아래 = 왼쪽+오른쪽 ② 아는 쪽 합을 먼저 구해요 ③ 거꾸로 빼서 빈칸을 채워요!',
      en:'① Top+bottom = left+right ② Find the known side\'s sum first ③ Subtract backward to fill the blank!',
      zh:'① 上+下＝左+右 ② 先算出已知的一边 ③ 倒着减，填空格！' }
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
