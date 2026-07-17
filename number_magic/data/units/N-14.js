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
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 세는 것과 규칙 찾기!',en:'1) Counting and finding rules!',zh:'① 数数和找规律！'},
        head:{ko:'묶음으로 세면 빠르고, 화살표는 규칙을 보여줘요',en:'Bundles make counting fast, arrows show the rule',zh:'成捆数得快，箭头能看出规律'},
        desc:{ko:'탤리 막대가 <b>묶음(5개)</b> 하나에 <b>낱개 3개</b>가 더 있으면? 5+3=<b>8</b>이에요! 묶음 수부터 세고 낱개를 더하면 훨씬 빨라요. 그리고 수열에서 화살표를 따라가면 <b>규칙</b>이 보여요 — "1, 2, 3, 4, 5" 처럼 <b>화살표(→)</b>마다 <b>1씩 늘어나거나</b>, 반대로 <b>1씩 줄어들 수도</b> 있어요. 빈 칸을 채울 땐 <b>바로 앞 수</b>에서 규칙을 그대로 적용하면 돼요!',
          en:'Tally marks: one <b>bundle (5)</b> plus <b>3 more single</b> strokes? 5+3=<b>8</b>! Count bundles first, then add the singles — much faster. And following the arrows in a sequence shows the <b>rule</b> — like "1, 2, 3, 4, 5" where each <b>arrow (→)</b> means it <b>grows by 1</b>, or it could <b>shrink by 1</b> instead. To fill a blank, just apply the rule to the <b>number right before it</b>!',
          zh:'计数符号：一<b>捆(5个)</b>加<b>3个</b>单独的？5+3=<b>8</b>！先数捆数，再加单个，快多了！沿着数列的箭头看，就能看出<b>规律</b>——像"1、2、3、4、5"这样，每个<b>箭头(→)</b>表示<b>加1</b>，也可能是<b>减1</b>。填空格时，只要在<b>前一个数</b>上应用规律就行！'},
        mathSteps:['묶음 1개 + 낱개 3개 = 8','1→2→3→4→5 (화살표마다 +1)','앞 수에 규칙을 적용해 빈칸 채우기!'],
        result:{ko:'묶어 세기와 규칙 찾기는 모두 빠른 계산의 비결이에요!',en:'Bundling and rule-finding are both secrets to fast calculation!',zh:'成捆数和找规律都是快速计算的诀窍！'},
        book:{ko:'규칙 찾기는 나중에 수열과 패턴 문제의 기초가 돼요!',en:'Rule-finding is the foundation for sequences and pattern problems later!',zh:'找规律是以后学数列和规律题的基础！'} }
    ],
    rule:{ ko:'① 묶음(5)부터 세고 낱개를 더해요 ② 화살표는 규칙을 보여줘요 ③ 앞 수에 규칙을 적용해요!',
      en:'① Count bundles(5) first, then add singles ② Arrows show the rule ③ Apply the rule to the number before!',
      zh:'① 先数捆(5)再加单个 ② 箭头显示规律 ③ 对前一个数应用规律！' }
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
