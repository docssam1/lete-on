/* ============================================================
   Numbers of Magic — 유닛 데이터: A-06
   초급 A · 챕터6 "식의 변형 마법"
   교재 개념 기반(창작 재구성). generator=sb7_transform.
   핵심: 23+15+7+5 → (23+7)+(15+5) = 30+20 = 50
   "같은 끝자리 친구끼리 먼저 모아요!"
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-06'] = {
  id:'A-06', tier:'beginner', level:'A', order:6,
  generator:'sb7_transform',
  title:{ ko:'식의 변형 마법', en:'Expression Transformation', zh:'算式变形魔法' },
  subtitle:{ ko:'같은 끝자리 친구끼리 먼저 모아 10, 20을 만들어요', en:'Group like-ending numbers to make tens first', zh:'把尾数相同的朋友聚在一起，先凑成整十' },
  icon:'🔀',

  /* ── STEP1 프랙티스: sb5_subAdjust 보정 빼기 복습 ── */
  practice:{
    generator:'sb5_subAdjust', level:'practice', count:5,
    intro:{
      ko:'먼저 지난 마법 복습! 보정 빼기로 빠르게 풀어봐요.',
      en:"Let's review compensation subtraction first — solve them quickly!",
      zh:'先复习上次的魔法！用补偿减法快速解题。'
    }
  },

  /* ── STEP2 디스커버: 식의 변형 개념 3단 ── */
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 순서를 바꿔도 답은 같아요', en:"1) Swapping order doesn't change the answer", zh:'① 换顺序答案不变' },
        head:{ ko:'덧셈은 순서를 바꿔도 OK!', en:'Addition is flexible — any order is fine!', zh:'加法顺序随意换，答案不变！' },
        desc:{ ko:'3 + 7 + 2 + 8처럼 더할 때 순서를 바꿔도 답은 같아요. 이걸 <b>교환법칙</b>이라고 해요. 이 법칙 덕분에 우리가 원하는 수끼리 먼저 더할 수 있어요!',
               en:'3 + 7 + 2 + 8 — you can rearrange the numbers and the answer stays the same. This is called the commutative property. Thanks to this rule, we can add in any order we like!',
               zh:'3 + 7 + 2 + 8，无论怎么换顺序答案都一样。这叫做交换律。有了这个规律，我们可以选择最方便的顺序来加！' },
        mathSteps:['3 + 7 + 2 + 8','= 3 + 7 + 2 + 8  (원래 순서)','= (3 + 7) + (2 + 8)  (10 짝끼리!)', '= 10 + 10 = 20'],
        result:{ ko:'3과 7, 2와 8이 각각 짝! → 10 + 10 = 20', en:'3+7 and 2+8 are pairs! → 10 + 10 = 20', zh:'3+7和2+8是配对！→ 10 + 10 = 20' },
        book:{ ko:'덧셈에서 순서를 바꿀 수 있다는 것, 기억해 두세요. 이게 바로 식의 변형의 시작이에요.',
               en:'Remember: order of addition can be changed freely. This is the foundation of expression transformation.',
               zh:'记住：加法可以随意换顺序。这是算式变形的基础。' } },

      { tag:{ ko:'② 같은 끝자리 친구끼리 모아요', en:'2) Group numbers with the same ending digit', zh:'② 把尾数相同的数聚在一起' },
        head:{ ko:'일의 자리가 합해서 10이 되는 수를 찾아요', en:'Look for ones digits that add up to 10', zh:'找个位数相加等于10的数' },
        desc:{ ko:'23+15+7+5를 보세요. 23의 일의 자리는 3, 7의 일의 자리는 7 → 3+7=10! 15의 일의 자리는 5, 5의 일의 자리도 5 → 5+5=10! <b>이 친구들을 먼저 모으면 쉬워져요.</b>',
               en:"Look at 23+15+7+5. The ones of 23 is 3, and 7's ones is 7 → 3+7=10! The ones of 15 is 5, and the next 5 is also 5 → 5+5=10! Group these friends first and it gets easy.",
               zh:'看23+15+7+5：23的个位是3，7的个位是7，3+7=10！15的个位是5，5的个位也是5，5+5=10！先把这些朋友聚在一起就简单了。' },
        mathSteps:['23 + 15 + 7 + 5','= (23 + 7) + (15 + 5)  ← 친구끼리!','= 30 + 20','= 50'],
        result:{ ko:'23+15+7+5 = 50! 친구끼리 모으니 훨씬 빨라요!', en:'23+15+7+5 = 50! Grouping friends makes it so much faster!', zh:'23+15+7+5 = 50！聚在一起速度快多了！' },
        book:{ ko:'일의 자리끼리 더해서 10이 되는 쌍을 찾는 것이 핵심이에요. 두 자리 수도 일의 자리만 보면 돼요.',
               en:"The key is finding pairs where the ones digits sum to 10. For 2-digit numbers, just look at the ones place.",
               zh:'关键是找个位数之和等于10的配对。两位数只看个位就行。' } },

      { tag:{ ko:'③ 5를 모아 10 만들기', en:'3) Group 5s to make tens', zh:'③ 把5凑成10' },
        head:{ ko:'5끼리 모으는 전략도 있어요', en:'Another strategy: group the 5s!', zh:'还有一招：把5聚在一起！' },
        desc:{ ko:'수에 5가 많을 때는 5+5=10을 이용해요. 15+25+5+5처럼 생긴 식도 금방 풀 수 있어요. 5 두 개를 먼저 모으면 10이 되거든요!',
               en:"When there are lots of 5s, use 5+5=10. An expression like 15+25+5+5 can be solved quickly — group two 5s to make 10!",
               zh:'当数里有很多5时，用5+5=10。像15+25+5+5这样的式子，把两个5先凑成10，马上就解了！' },
        mathSteps:['15 + 25 + 5 + 5','= (15 + 5) + (25 + 5)','= 20 + 30','= 50'],
        result:{ ko:'15+25+5+5 = 50! 5 두 개가 10이 되었어요.', en:'15+25+5+5 = 50! Two 5s became one 10.', zh:'15+25+5+5 = 50！两个5变成了10。' },
        book:null }
    ],
    rule:{ ko:'① 일의 자리가 합해서 10이 되는 짝을 찾는다  ② 그 짝을 먼저 더해 10·20·30을 만든다  ③ 나머지를 더한다',
      en:'① Find pairs where ones digits sum to 10  ② Add those pairs first to make 10s  ③ Add the rest.',
      zh:'①找个位数之和为10的配对 ②先加这些配对凑成10、20、30 ③再加其余的数。' }
  },

  /* ── STEP3 핵심체크 ── */
  check:{
    fills:[
      { tex:'23 + 15 + 7 + 5 = (23 + \\square) + (15 + 5)', answer:7,
        hint:{ ko:'23의 일의 자리 3과 짝을 이루는 수는 7이에요! 3+7=10', en:'The ones of 23 is 3 — its pair is 7! Because 3+7=10', zh:'23的个位是3，配对是7！因为3+7=10' } },
      { tex:'14 + 26 + 6 + \\square = (14 + 6) + (26 + 4)', answer:4,
        hint:{ ko:'26의 일의 자리 6과 짝을 이루는 수는 4예요! 6+4=10', en:'The ones of 26 is 6 — its pair is 4! Because 6+4=10', zh:'26的个位是6，配对是4！因为6+4=10' } }
    ],
    open:{
      ko:'만약 더해서 10이 되는 짝이 없다면, 어떻게 식을 변형하면 좋을까요?',
      en:"If there are no pairs that add up to 10, how else might you rearrange the expression?",
      zh:'如果没有凑成10的配对，还可以怎样变形算式呢？'
    },
    openHint:{
      ko:'예) 합이 5가 되는 쌍을 찾거나, 십의 자리끼리 먼저 더해봐요. 또는 큰 수부터 더하는 것도 방법이에요.',
      en:"e.g. Find pairs summing to 5, group the tens first, or add from largest to smallest.",
      zh:'例）找凑成5的配对，或者先把十位数加起来，也可以从大到小来加。'
    }
  },

  /* ── STEP4 매직랩 ── */
  lab:{
    generator:'sb7_transform', level:'main', count:4,
    intro:{
      ko:'이제 직접 친구끼리 모아봐! 짝을 찾아 먼저 묶어서 계산해봐요.',
      en:"Now group the friends yourself! Find the pairs and compute step by step.",
      zh:'现在自己来聚合朋友！找出配对，一步步算出结果。'
    }
  },

  /* ── STEP5 아레나 ── */
  arena:{
    generator:'sb7_transform', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한 많이 풀어요! 짝꿍 먼저 찾기!', en:'Find pairs first and solve as many as you can in 5 minutes!', zh:'先找配对，5分钟内尽量多解题！' }
  },

  stamp:{ label:{ ko:'변형 마법사', en:'Transformer', zh:'变形魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'짝 찾기 성공! 🔀',en:'Found the pair!',zh:'找到配对啦！'}, {ko:'식 변형 완성! 🪄',en:'Transformation complete!',zh:'变形成功！'} ],
    wrong:[ {ko:'음~ 일의 자리가 합해서 10이 되는 짝을 찾아봐!',en:"Hmm — look for ones digits that add up to 10!",zh:'嗯，找个位数之和为10的配对！'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 변형 마법사야 🔀✨', en:"Perfect! You're a Transformation Wizard now!", zh:'完美！你现在是变形魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
