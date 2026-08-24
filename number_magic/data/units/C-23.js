/* Numbers of Magic — 유닛 C-23: VEDA 교차 곱셈 (중급 F 챕터1) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-23'] = {
  id:'C-23', tier:'intermediate', level:'C', order:23,
  generator:'ml_veda',
  title:{ ko:'VEDA 교차 곱셈', en:'VEDA Cross Multiplication', zh:'VEDA交叉乘法' },
  subtitle:{ ko:'인도의 옛 수학 마법: 일→교차→십 세 걸음으로!', en:'Ancient Indian maths magic: ones → cross → tens, in three moves!', zh:'古印度数学魔法：个→交叉→十，三步完成！' },
  icon:'🕉️',

  practice:{
    generator:'ml_veda', level:'practice', count:5,
    params:{},
    intro:{
      ko:'인도에서 전해 내려오는 교차 곱셈이야. 일의 자리, 교차 곱, 십의 자리 — 세 걸음이면 어떤 두 자리 곱도 끝나! 준비됐지?',
      en:"Cross multiplication handed down from India: ones digits, cross products, tens digits — three moves finish any two-digit product! Ready?",
      zh:'来自印度的交叉乘法：个位、交叉积、十位——三步搞定任何两位数乘法！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 세로로 놓고 세 걸음',en:'1) Stack and take three moves',zh:'① 竖放三步走'},
        head:{ko:'32×41: 일 → 교차 → 십!',en:'32×41: ones → cross → tens!',zh:'32×41：个→交叉→十！'},
        desc:{ko:'수백 년 전 인도의 수학책에서 전해진 초고속 곱셈이에요! 32와 41을 위아래로 놓고: ①<b>일×일</b>: 2×1=2 ②<b>교차 곱의 합</b>: 3×1+2×4=11 ③<b>십×십</b>: 3×4=12. 오른쪽부터 자리에 놓으면(올림 처리) <b>1312</b>. 엑스맨 곱셈(C-12)의 원조가 바로 이 방법이에요!',
              en:'Handed down from Indian mathematics centuries ago — super-fast multiplication! Stack 32 over 41: ①<b>ones×ones</b>: 2×1=2 ②<b>sum of cross products</b>: 3×1+2×4=11 ③<b>tens×tens</b>: 3×4=12. Place from the right (with carries): <b>1312</b>. The X-cross method (C-12) descends from exactly this!',
              zh:'源自数百年前印度数学的超速乘法！32和41上下放：①<b>个×个</b>：2×1=2 ②<b>交叉积之和</b>：3×1+2×4=11 ③<b>十×十</b>：3×4=12。从右往左放好(处理进位)：<b>1312</b>。X交叉乘法(C-12)的祖先就是它！'},
        mathSteps:['① 일: 2×1=2','② 교차: 3×1+2×4=11','③ 십: 3×4=12','→ 12|11|2 → 1312'],
        result:{ko:'32×41=1312! 일→교차→십, 리듬을 타면 빨라져요.',en:'32×41=1312! Ones→cross→tens — catch the rhythm and speed up.',zh:'32×41=1312！个→交叉→十——抓住节奏就快了。'},
        book:{ko:'"베다(VEDA)"는 인도의 오래된 책 이름이에요. 이런 암산 기법을 정리한 것을 베다 수학이라 부르고, 이 곱셈은 "세로-교차" 기법으로 알려져 있어요.',
              en:'"VEDA" names ancient Indian texts. Mental-math techniques organised under that name are called Vedic mathematics; this one is known as the vertical-and-crosswise method.',
              zh:'"VEDA(吠陀)"是印度古籍之名。以此命名整理的心算技巧称为吠陀数学，这个乘法叫"纵横交叉"法。'} },

      { tag:{ko:'② 올림을 물결처럼',en:'2) Carries flow like a wave',zh:'② 进位如波浪'},
        head:{ko:'12 | 11 | 2 → 자리마다 한 숫자만!',en:'12 | 11 | 2 → one digit per place!',zh:'12 | 11 | 2 →每位只留一个数字！'},
        desc:{ko:'세 걸음의 결과 12|11|2를 자리에 맞춰요. 각 자리엔 <b>숫자 하나만</b> 남길 수 있어요! 오른쪽부터: 일의 자리 2(그대로) → 십의 자리 11은 <b>1 남기고 1 올림</b> → 백의 자리 12+1(올림)=13. 왼쪽부터 읽으면 13-1-2 → <b>1312</b>. 올림이 물결처럼 왼쪽으로 흘러가요!',
              en:'Place the three results 12|11|2. Each place keeps <b>only one digit</b>! From the right: ones stay 2 → tens 11 keeps <b>1, carries 1</b> → hundreds 12+1(carry)=13. Reading from the left: 13-1-2 → <b>1312</b>. Carries flow leftward like a wave!',
              zh:'把三步结果12|11|2放好。每位<b>只能留一个数字</b>！从右开始：个位2(不变)→十位11<b>留1进1</b>→百位12+1(进位)=13。从左读：13-1-2→<b>1312</b>。进位像波浪一样向左流！'},
        mathSteps:['일: 2','십: 11 → 1 (올림 1)','백: 12+1 = 13','→ 1312'],
        result:{ko:'자리마다 한 숫자, 나머지는 왼쪽으로 — 올림의 물결!',en:'One digit per place, the rest flows left — the carry wave!',zh:'每位一个数字，其余向左流——进位波浪！'},
        book:{ko:'검산 팁: 자릿수 예측(C-09)으로 3×4=12 → 4자리 예상. 1312는 4자리 ✓. 예측과 결과를 항상 짝지어요.',
              en:'Check tip: digit prediction (C-09) gives 3×4=12 → expect 4 digits. 1312 has 4 ✓. Always pair prediction with result.',
              zh:'检验技巧：位数预测(C-09)得3×4=12→预计4位。1312是4位✓。预测和结果永远配对。'} },

      { tag:{ko:'③ 종이 없이 도전!',en:'3) Try it without paper!',zh:'③ 挑战不用纸！'},
        head:{ko:'익숙해지면 눈으로만 계산해요',en:'With practice, your eyes alone compute it',zh:'熟练后只用眼睛就能算'},
        desc:{ko:'VEDA 곱셈의 진짜 힘은 <b>암산</b>이에요. 24×32를 눈으로: 일 4×2=8, 교차 2×2+4×3=16, 십 2×3=6 → 6|16|8 → 올림 처리 → <b>768</b>. 처음엔 종이에, 다음엔 손가락으로 짚으며, 마지막엔 눈으로만! 매일 두 문제씩 연습하면 한 달 뒤엔 마법사처럼 계산할 수 있어요.',
              en:'VEDA\'s true power is <b>mental calculation</b>. Try 24×32 by eye: ones 4×2=8, cross 2×2+4×3=16, tens 2×3=6 → 6|16|8 → carry → <b>768</b>. First on paper, then tracing with a finger, finally eyes only! Two problems a day, and in a month you\'ll compute like a wizard.',
              zh:'VEDA的真正威力是<b>心算</b>。用眼睛算24×32：个4×2=8，交叉2×2+4×3=16，十2×3=6→6|16|8→进位→<b>768</b>。先在纸上，再用手指点，最后只用眼睛！每天练两题，一个月后就能像魔法师一样计算。'},
        mathSteps:['24×32: 일 8','교차 4+12=16','십 6 → 6|16|8','= 768'],
        result:{ko:'24×32=768! 종이→손가락→눈, 단계별로 올라가요.',en:'24×32=768! Paper → finger → eyes, level by level.',zh:'24×32=768！纸→手指→眼睛，一级级升。'},
        book:null }
    ],
    rule:{ ko:'① 일×일 → 교차 합 → 십×십 세 걸음  ② 자리마다 한 숫자, 나머지는 올림  ③ 자릿수 예측으로 검산',
      en:'① Three moves: ones×ones → cross sum → tens×tens  ② One digit per place, carry the rest  ③ Verify with digit prediction',
      zh:'① 三步：个×个→交叉和→十×十  ② 每位一个数字其余进位  ③ 用位数预测检验' }
  },

  check:{
    fills:[
      { tex:'21 \\times 34 = \\square', answer:714,
        hint:{ ko:'일:1×4=4, 교차:2×4+1×3=11, 십:2×3=6 → 6|11|4', en:'O:1×4=4, X:2×4+1×3=11, T:2×3=6 → 6|11|4', zh:'个:1×4=4，交叉:2×4+1×3=11，十:2×3=6 → 6|11|4' } },
      { tex:'43 \\times 22 = \\square', answer:946,
        hint:{ ko:'일:3×2=6, 교차:4×2+3×2=14, 십:4×2=8 → 8|14|6', en:'O:3×2=6, X:4×2+3×2=14, T:4×2=8 → 8|14|6', zh:'个:3×2=6，交叉:4×2+3×2=14，十:4×2=8 → 8|14|6' } }
    ],
    open:{ ko:'VEDA 곱셈과 엑스맨 곱셈(C-12)의 관계를 설명해 봐요. 두 방법의 세 조각은 왜 같을까요?',
      en:'Explain how VEDA relates to the X-cross method (C-12). Why are their three pieces identical?',
      zh:'说说VEDA乘法和X交叉乘法(C-12)的关系。为什么两种方法的三块相同？' },
    openHint:{ ko:'예) 둘 다 (10a+b)(10c+d)=100ac+10(ad+bc)+bd에서 나와요. 엑스맨은 X 그림으로, VEDA는 일→교차→십 순서로 같은 세 조각(ac, ad+bc, bd)을 구하는 것 — 표현만 다른 같은 마법이에요.',
      en:'e.g. Both come from (10a+b)(10c+d)=100ac+10(ad+bc)+bd. X-cross draws an X; VEDA sequences ones→cross→tens — the same three pieces (ac, ad+bc, bd) in different clothing.',
      zh:'例）都来自(10a+b)(10c+d)=100ac+10(ad+bc)+bd。X交叉画X图，VEDA按个→交叉→十的顺序——同样的三块(ac、ad+bc、bd)，只是穿着不同的衣服。' }
  },

  lab:{
    generator:'ml_veda', level:'main', count:4,
    params:{},
    intro:{
      ko:'VEDA 마법! 일→교차→십 세 걸음으로 풀어봐.',
      en:'VEDA magic! Solve in three moves: ones→cross→tens.',
      zh:'VEDA魔法！个→交叉→十三步解题。'
    }
  },

  arena:{
    generator:'ml_veda', level:'main', count:8, timeLimit:360,
    params:{},
    rule:{ ko:'6분 안에 VEDA 곱셈 문제를 모두 풀어요!', en:'Solve all VEDA problems in 6 minutes!', zh:'6分钟内解答所有VEDA题！' }
  },

  stamp:{ label:{ ko:'VEDA 마법사', en:'VEDA Wizard', zh:'VEDA魔法师' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'고대의 마법! 🕉️',en:'Ancient magic!',zh:'古老的魔法！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'일→교차→십 순서를 지켜봐!',en:'Keep the order: ones→cross→tens!',zh:'守住顺序：个→交叉→十！'}, {ko:'교차 곱 두 개를 더했어?',en:'Did you add both cross products?',zh:'两个交叉积加了吗？'} ],
    finish:{ ko:'완벽해! VEDA 마법사! 🕉️✨', en:'Perfect! VEDA Wizard!', zh:'完美！VEDA魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
