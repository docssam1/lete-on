/* Numbers of Magic — 유닛 C-12: 엑스맨 곱셈 (중급 C 챕터4) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-12'] = {
  id:'C-12', tier:'intermediate', level:'C', order:12,
  lineage:['place-magic'],
  generator:'ml8_mul2d2d',
  title:{ ko:'엑스맨 곱셈', en:'X-Cross Multiplication', zh:'X交叉乘法' },
  subtitle:{ ko:'X자로 교차해서 곱해요: 가운데 조각 두 개를 한 번에!', en:'Cross-multiply in an X: catch both middle pieces at once!', zh:'画X交叉相乘：一次抓住中间两块！' },
  icon:'❌',

  practice:{
    generator:'ml8_mul2d2d', level:'practice', count:5,
    params:{ easy:true },
    intro:{
      ko:'두 수를 위아래로 쓰고 X자를 그리며 교차로 곱하는 방법이야. 가운데 조각 둘을 한 번에 잡아! 준비됐지?',
      en:"Write the two numbers stacked, draw an X, and cross-multiply. Catch both middle pieces in one go! Ready?",
      zh:'把两个数上下写好，画个X交叉相乘。中间两块一次抓住！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① X자 긋기',en:'1) Drawing the X',zh:'① 画X'},
        head:{ko:'34×26: 위아래로 쓰고 X로 교차!',en:'34×26: stack them and cross with an X!',zh:'34×26：上下写好，画X交叉！'},
        desc:{ko:'34를 위에, 26을 아래에 써요. 이제 <b>X자로 교차해서 곱해요</b>: 3(십)×6(일)=18, 4(일)×2(십)=8. 교차곱의 합 18+8=<b>26</b> — 이것이 십의 자리 조각이에요! 세로줄끼리는 3×2=6(백의 조각), 4×6=24(일의 조각).',
              en:'Write 34 on top, 26 below. Now <b>cross-multiply along the X</b>: 3(tens)×6(ones)=18 and 4(ones)×2(tens)=8. The cross sum 18+8=<b>26</b> — that\'s the tens piece! Straight down the columns: 3×2=6 (hundreds piece) and 4×6=24 (ones piece).',
              zh:'34写上面，26写下面。现在<b>沿着X交叉相乘</b>：3(十位)×6(个位)=18，4(个位)×2(十位)=8。交叉和18+8=<b>26</b>——这就是十位块！竖列直乘：3×2=6(百位块)，4×6=24(个位块)。'},
        mathSteps:[{ko:'세로: 3×2=6 (백)',en:'\\text{vertical: } 3×2=6 \\text{ (hundreds)}',zh:'竖：3×2=6（百位）'},{ko:'X: 3×6+4×2=26 (십)',en:'X: 3×6+4×2=26 \\text{ (tens)}',zh:'X：3×6+4×2=26（十位）'},{ko:'세로: 4×6=24 (일)',en:'\\text{vertical: } 4×6=24 \\text{ (ones)}',zh:'竖：4×6=24（个位）'}],
        result:{ko:'세 조각: 백=6, 십=26, 일=24. 이제 자리에 맞춰 합쳐요!',en:'Three pieces: hundreds=6, tens=26, ones=24. Now place and combine!',zh:'三块：百=6，十=26，个=24。接下来按位合并！'},
        book:{ko:'원리: (10a+b)(10c+d) = 100ac + 10(ad+bc) + bd. 가운데 항 (ad+bc)가 바로 X자 교차곱이에요. 풀풀곱셈의 가운데 두 조각을 하나로 묶은 거예요.',
              en:'Principle: (10a+b)(10c+d) = 100ac + 10(ad+bc) + bd. The middle term (ad+bc) is exactly the X cross-product — the two middle pieces of full-full multiplication bundled into one.',
              zh:'原理：(10a+b)(10c+d) = 100ac + 10(ad+bc) + bd。中间项(ad+bc)正是X交叉积——全全乘法的中间两块合成一块。'} },

      { tag:{ko:'② 자리에 맞춰 합치기',en:'2) Placing and combining',zh:'② 按位合并'},
        head:{ko:'6 | 26 | 24 → 600+260+24 = 884',en:'6 | 26 | 24 → 600+260+24 = 884',zh:'6 | 26 | 24 → 600+260+24 = 884'},
        desc:{ko:'세 조각을 <b>자리값을 살려</b> 더해요. 백의 조각 6은 600, 십의 조각 26은 260, 일의 조각은 24. 600+260+24=<b>884</b>. 십·일 조각이 10을 넘으면 윗자리로 올려주는 것만 조심하면 돼요!',
              en:'Add the three pieces <b>with their place values</b>. Hundreds piece 6 means 600, tens piece 26 means 260, ones piece is 24. 600+260+24=<b>884</b>. Just mind the carry when a piece exceeds 10!',
              zh:'三块要<b>带着位值</b>相加。百位块6是600，十位块26是260，个位块是24。600+260+24=<b>884</b>。只需注意块超过10时要向上进位！'},
        mathSteps:[{ko:'백: 6 → 600',en:'\\text{hundreds: } 6 → 600',zh:'百位：6 → 600'},{ko:'십: 26 → 260',en:'\\text{tens: } 26 → 260',zh:'十位：26 → 260'},{ko:'일: 24',en:'\\text{ones: } 24',zh:'个位：24'},'600+260+24 = 884'],
        result:{ko:'34×26=884! 조각×자리값을 더하면 완성.',en:'34×26=884! Add piece × place value and it\'s done.',zh:'34×26=884！块×位值相加即完成。'},
        book:{ko:'검산: 자릿수 예측(C-09)으로 3×2=6 → 30×20=600 근처, 3자리 예상. 884는 3자리 ✓.',
              en:'Check: digit prediction (C-09) gives 3×2=6 → near 30×20=600, expecting 3 digits. 884 is 3 digits ✓.',
              zh:'检验：位数预测(C-09)得3×2=6→接近30×20=600，预计3位。884是3位✓。'} },

      { tag:{ko:'③ 왜 엑스맨이 빠를까?',en:'3) Why is the X method fast?',zh:'③ 为什么X法快？'},
        head:{ko:'네 조각이 세 조각으로 줄어요',en:'Four pieces shrink to three',zh:'四块缩成三块'},
        desc:{ko:'풀풀곱셈(C-10)은 조각이 4개지만, 엑스맨은 가운데 둘을 X로 <b>동시에 잡아</b> 3개로 줄여요. 익숙해지면 종이에 X만 그려도 답이 보여요. 순서 암기: <b>세로(오른쪽)→X→세로(왼쪽)</b>, 즉 일→십→백 순서로 쓰는 것이 정통 방식이에요.',
              en:'Full-full (C-10) has four pieces, but the X method <b>catches the middle two at once</b>, reducing to three. With practice, drawing the X alone reveals the answer. Classic order: <b>right column → X → left column</b>, i.e. ones → tens → hundreds.',
              zh:'全全乘法(C-10)有四块，X法把中间两块<b>一次抓住</b>，缩成三块。熟练后光画X就能看出答案。经典顺序：<b>右列→X→左列</b>，即个位→十位→百位。'},
        mathSteps:[{ko:'풀풀: 4조각',en:'\\text{four-piece way: 4 pieces}',zh:'四块法：4块'},{ko:'엑스맨: 세로+X+세로 = 3조각',en:'\\text{X-man: vertical+X+vertical = 3 pieces}',zh:'X侠：竖+X+竖 = 3块'},{ko:'가운데를 한 번에!',en:'\\text{the middle in one go!}',zh:'中间一次算完！'}],
        result:{ko:'조각이 적을수록 빨라요! X 하나로 가운데를 통째로.',en:'Fewer pieces, more speed! One X captures the whole middle.',zh:'块越少越快！一个X包揽整个中间。'},
        book:{ko:'고급 과정에서는 세 자리×두 자리, 세 자리×세 자리로 확장돼요. X가 하나 더 생겨 조각이 늘어나지만 원리는 똑같아요 — 자리를 하나씩 옮겨가며 쌓기만 하면 돼요.',
              en:'The advanced course extends this to 3-digit×2-digit and 3-digit×3-digit — one more X appears and there are more pieces, but the same idea still works: stack them place by place.',
              zh:'高级课程会扩展到三位数×两位数、三位数×三位数——多一个X、多几块，但原理不变：一位一位错开叠加即可。'} }
    ],
    rule:{ ko:'① 세로끼리: 십×십(백), 일×일(일)  ② X 교차곱의 합 = 십의 조각  ③ 자리값 살려 더하기(올림 조심)',
      en:'① Columns: tens×tens (hundreds), ones×ones (ones)  ② Sum of X cross-products = tens piece  ③ Add with place values (mind carries)',
      zh:'① 竖列：十×十(百位)，个×个(个位)  ② X交叉积之和=十位块  ③ 带位值相加(注意进位)' }
  },

  check:{
    fills:[
      { tex:'23 \\times 32 = \\square', answer:736,
        hint:{ ko:'백:2×3=6, X:2×2+3×3=13, 일:3×2=6 → 600+130+6=?', en:'H:2×3=6, X:2×2+3×3=13, O:3×2=6 → 600+130+6=?', zh:'百:2×3=6，X:2×2+3×3=13，个:3×2=6 → 600+130+6=？' } },
      { tex:'41 \\times 52 = \\square', answer:2132,
        hint:{ ko:'백:4×5=20, X:4×2+1×5=13, 일:1×2=2 → 2000+130+2=?', en:'H:4×5=20, X:4×2+1×5=13, O:1×2=2 → 2000+130+2=?', zh:'百:4×5=20，X:4×2+1×5=13，个:1×2=2 → 2000+130+2=？' } }
    ],
    open:{ ko:'엑스맨 곱셈의 X 교차곱이 왜 십의 자리 조각이 되는지 (10a+b)(10c+d)를 펼쳐서 설명해 봐요.',
      en:'Expand (10a+b)(10c+d) to explain why the X cross-product forms the tens piece.',
      zh:'展开(10a+b)(10c+d)，解释为什么X交叉积是十位块。' },
    openHint:{ ko:'예) (10a+b)(10c+d)=100ac+10ad+10bc+bd. 10ad+10bc=10(ad+bc)이므로 교차곱 ad+bc에 10이 붙어요 → 십의 자리 조각!',
      en:'e.g. (10a+b)(10c+d)=100ac+10ad+10bc+bd. Since 10ad+10bc=10(ad+bc), the cross-product ad+bc carries a factor of 10 → the tens piece!',
      zh:'例）(10a+b)(10c+d)=100ac+10ad+10bc+bd。10ad+10bc=10(ad+bc)，交叉积ad+bc带着10→十位块！' }
  },

  lab:{
    generator:'ml8_mul2d2d', level:'main', count:4,
    params:{ easy:false },
    intro:{
      ko:'엑스맨 곱셈 마법! X자를 그리며 교차로 곱해봐.',
      en:'X-cross magic! Draw the X and cross-multiply.',
      zh:'X交叉魔法！画X交叉相乘。'
    }
  },

  arena:{
    generator:'ml8_mul2d2d', level:'main', count:8, timeLimit:360,
    params:{ easy:false },
    rule:{ ko:'6분 안에 엑스맨 곱셈 문제를 모두 풀어요!', en:'Solve all X-cross problems in 6 minutes!', zh:'6分钟内解答所有X交叉题！' }
  },

  stamp:{ label:{ ko:'엑스맨 마법사', en:'X-Cross Wizard', zh:'X交叉魔法师' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'X 적중! ❌',en:'X marks the spot!',zh:'X命中！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'X 교차곱 두 개를 더했어?',en:'Did you add both cross-products?',zh:'两个交叉积加了吗？'}, {ko:'자리값을 살려서 더해봐!',en:'Add with place values!',zh:'带着位值加！'} ],
    finish:{ ko:'완벽해! 엑스맨 마법사! ❌✨', en:'Perfect! X-Cross Wizard!', zh:'完美！X交叉魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
