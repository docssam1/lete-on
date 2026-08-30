/* Numbers of Magic — 유닛 N-14: 산가지와 규칙 (수의 나라 · 유아 5~7세)
   tier:'basic' → 경량 플로우: practice → discover(1스테이지) → lab → stamp
   콘텐츠는 전부 창작(탤리 도식·수열 칩) — 라이선스 교재 삽화/지문 미사용 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['N-14'] = {
  id:'N-14', tier:'basic', level:'N', order:14,
  generator:'nl14_pattern', edu:'유아',
  title:{ ko:'산가지와 규칙', en:'Tally Marks & Patterns', zh:'计数符号与规律' },
  subtitle:{ ko:'탤리를 세어 읽고, 화살표 규칙도 찾아요!', en:'Read the tally marks, then find the arrow rule!', zh:'数一数计数符号，再找出箭头规律！' },
  icon:'📐',

  practice:{ generator:'nl14_pattern', level:'practice', count:4, params:{ mode:'read' },
    intro:{ ko:'탤리(산가지) 막대를 세어 봐요! 4개는 그대로, 5번째는 사선으로 묶여요',
      en:'Count the tally marks! Up to 4 stay plain, the 5th is bundled with a diagonal',
      zh:'数一数计数符号！4笔以内直接画，第5笔斜着捆一下' } },

  discover:{
    story:{
      hook:{ ko:'연필도 종이도 없던 시절, 사람들은 무엇으로 수를 셌을까요?',
        en:'Before pencils and paper, what did people count with?',
        zh:'还没有铅笔和纸的时候，人们用什么数数？' },
      history:{ ko:'어디서든 처음엔 막대를 늘어놓아 세었어요. 중국은 산가지, 로마는 Ⅰ Ⅱ Ⅲ. 재미있는 건 중국이 붉은 산가지를 더하는 수, 검은 산가지를 빼는 수로 나누어 썼다는 거예요 — 지금의 +와 −를 막대 색으로 한 셈이죠.',
        en:'Everywhere, counting began by laying out sticks: counting rods in China, Ⅰ Ⅱ Ⅲ in Rome. The neat part is that China used red rods for adding and black rods for subtracting — plus and minus, done in colour.',
        zh:'各地最早都是摆小棍来数数：中国用算筹，罗马写Ⅰ Ⅱ Ⅲ。有趣的是中国用红色算筹表示加、黑色算筹表示减——用颜色分出了加号和减号。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 세는 것과 규칙 찾기!',en:'1) Counting and finding rules!',zh:'① 数数和找规律！'},
        head:{ko:'묶음으로 세면 빠르고, 화살표는 규칙을 보여줘요',en:'Bundles make counting fast, arrows show the rule',zh:'成捆数得快，箭头能看出规律'},
        desc:{ko:'묶음 5 + 낱개 3 = 8! 화살표는 1씩 커져요.',
          en:'Bundle 5 + 3 singles = 8! Arrows grow by 1.',
          zh:'一捆5加3个＝8！箭头每次加1。'},
        mathSteps:[{ko:'묶음 5 + 낱개 3 = 8',en:'Bundle of 5 + 3 singles = 8',zh:'一捆5根 + 散的3根 = 8'},{ko:'1→2→3→4→5 (+1씩!)',en:'1→2→3→4→5 (+1 each!)',zh:'1→2→3→4→5（每次+1！）'},{ko:'앞 수에 규칙을 적용!',en:'Apply the rule to the last number!',zh:'把规则用在前一个数上！'}],
        result:{ko:'묶음부터 세면 빨라요!',en:'Count bundles first — faster!',zh:'先数捆，快多了！'} }
    ],
    rule:{ ko:'묶음(5)부터 세고, 화살표 규칙을 따라가요!',
      en:'Count bundles first, then follow the arrow rule!',
      zh:'先数捆(5)，再跟着箭头规律走！' }
  },

  lab:{ generator:'nl14_pattern', level:'main', count:4, params:{ mode:'arrow' },
    intro:{ ko:'이번엔 화살표 규칙 찾기! 1씩 늘거나 줄어드는 빈 칸을 골라요',
      en:'Now find the arrow rule! Pick the blank that grows or shrinks by 1',
      zh:'现在来找箭头规律！选出加1或减1的空格' } },

  stamp:{ label:{ ko:'규칙 탐험가', en:'Pattern Explorer', zh:'规律探险家' }, coins:20 },

  voice:{
    correct:[ {ko:'딩동! 딱 맞아요 📐',en:'Ding! Exactly right!',zh:'叮！完全正确！'}, {ko:'규칙을 찾았어요! 🔍',en:'Found the rule!',zh:'找到规律啦！'}, {ko:'묶어 세기 완벽! ✨',en:'Perfect bundling!',zh:'成捆数得真棒！'} ],
    wrong:[ {ko:'음~ 묶음부터 세어 볼까요?',en:'Hmm, count the bundles first?',zh:'嗯，先数数捆吧？'}, {ko:'화살표 방향을 다시 봐요',en:'Look at the arrow direction again',zh:'再看看箭头方向'} ],
    finish:{ ko:'짝짝짝! 규칙 탐험가 탄생! 📐✨', en:'Clap clap! A Pattern Explorer is born!', zh:'鼓掌！规律探险家诞生了！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
