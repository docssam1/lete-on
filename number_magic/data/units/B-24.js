/* Numbers of Magic — 유닛 B-24: 나눗셈의 세 얼굴 (중급 · 나눗셈 입문)
   원장 지시(2026-09-17): "나누기 전략이 직접 나누기가 있고 같은 수를 빼서 나누기가 있고
   묶어서 나누기도 있잖아. 양이 적고 너무 단순해. 제대로 생각을 할 수 있도록."
   → 나눗셈을 계산이 아니라 **뜻**으로 먼저 만난다: ① 똑같이 나누기(등분)
     ② 묶어 세기(포함) ③ 같은 수 빼기(반복 뺄셈) ④ 곱셈으로 되돌리기.
   생성기: dv12_share(등분) · dv13_group(묶음, mix면 등분 섞임) · dv14_repsub(반복 뺄셈, steps)
   · dv15_family(곱셈↔나눗셈). 연습은 mix, 매직랩은 반복 뺄셈을 단계 카드로 직접 쓴다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-24'] = {
  id:'B-24', tier:'intermediate', level:'B', order:24,
  generator:'dv13_group',
  title:{ ko:'나눗셈의 세 얼굴', en:'The Three Faces of Division', zh:'除法的三副面孔' },
  subtitle:{ ko:'똑같이 나누기 · 묶어 세기 · 같은 수 빼기 — 12÷3은 세 가지로 볼 수 있어요', en:'Sharing · grouping · repeated subtraction — 12÷3 can be seen three ways', zh:'平均分 · 分组数 · 连续减——12÷3有三种看法' },
  icon:'🍪',

  practice:{
    generator:'dv13_group', level:'practice', count:5,
    params:{ mix:true },
    intro:{
      ko:'나눗셈은 "몇 개씩 나눠 줄까?"도 되고 "몇 묶음이 될까?"도 돼. 이야기를 잘 읽고 큐브를 줄로 놓아 봐. 줄 수를 맞추면 답이 보여!',
      en:'Division can ask "how many each?" or "how many groups?". Read the story, then lay the cubes in rows. Set the right number of rows and the answer appears!',
      zh:'除法可以问"每人几个？"，也可以问"能分几组？"。读好故事，把方块排成行。行数排对了，答案就出来了！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 똑같이 나누기',en:'1) Sharing equally',zh:'① 平均分'},
        head:{ko:'쿠키 12개를 3명이 똑같이 — 한 명에 몇 개?',en:'12 cookies for 3 friends — how many each?',zh:'12块饼干3个人平均分——每人几块？'},
        desc:{ko:'쿠키 12개를 3명이 <b>똑같이</b> 나눠요. 한 개씩 돌아가며 나눠 주면… 한 명에 4개! 이게 12÷3=4의 첫 번째 얼굴이에요. "한 사람 몫이 얼마?"를 묻는 나눗셈이에요.',
              en:'Share 12 cookies <b>equally</b> among 3 friends. Deal them out one at a time… each gets 4! That is the first face of 12÷3=4: it asks "how much for each one?".',
              zh:'12块饼干3个人<b>平均</b>分。一块一块轮流发……每人4块！这是12÷3=4的第一副面孔——问"每人分到多少"。'},
        mathSteps:['12 \\div 3 = \\square',{ko:'3명에게 한 개씩, 또 한 개씩…',en:'\\text{one each to 3 friends, again, again…}',zh:'3个人各一块，再各一块……'},'4+4+4=12','→ 12 \\div 3 = 4 ✓'],
        result:{ko:'12÷3=4 — 한 명에 4개씩! 답의 단위는 "개"예요.',en:'12÷3=4 — 4 cookies each! The answer is measured in cookies.',zh:'12÷3=4——每人4块！答案的单位是"块"。'},
        book:{ko:'똑같이 나누기(등분제)는 전체를 정해진 사람 수(묶음 수)로 나누어 한 묶음의 크기를 구하는 나눗셈이에요. 답에는 "개·장·권"처럼 물건의 단위가 붙어요.',
              en:'Sharing (partitive division) splits a total into a given number of groups to find the size of one group. The answer carries the object unit (cookies, cards, books).',
              zh:'平均分（等分除）是把总数分成给定的组数，求每组多少。答案带物品单位（块、张、本）。'} },

      { tag:{ko:'② 묶어 세기',en:'2) Making groups',zh:'② 分组数'},
        head:{ko:'쿠키 12개를 3개씩 봉지에 — 봉지가 몇 개?',en:'12 cookies, 3 per bag — how many bags?',zh:'12块饼干每袋3块——要几袋？'},
        desc:{ko:'같은 12÷3인데 이번엔 <b>3개씩 묶어요</b>. 3개, 3개, 3개, 3개 — 묶음이 4개! 두 번째 얼굴은 "몇 묶음이 될까?"를 물어요. 답의 단위가 "봉지"로 바뀌는 게 보이죠?',
              en:'Same 12÷3, but now <b>make groups of 3</b>. 3, 3, 3, 3 — that is 4 groups! The second face asks "how many groups?". Notice the unit changed to "bags".',
              zh:'同样是12÷3，这次<b>3块一组</b>。3、3、3、3——一共4组！第二副面孔问"能分几组"。注意单位变成了"袋"。'},
        mathSteps:['12 \\div 3 = \\square',{ko:'3개씩 묶으면: 3, 3, 3, 3',en:'\\text{groups of 3: } 3, 3, 3, 3',zh:'3个一组：3、3、3、3'},'3 \\times 4 = 12','→ 12 \\div 3 = 4 ✓'],
        result:{ko:'12÷3=4 — 봉지 4개! 같은 식인데 묻는 게 달라요.',en:'12÷3=4 — 4 bags! Same equation, different question.',zh:'12÷3=4——4袋！同一个算式，问的不一样。'},
        book:{ko:'묶어 세기(포함제)는 전체에서 정해진 크기의 묶음이 몇 번 들어가는지 구하는 나눗셈이에요. 답에는 "묶음·봉지·상자"처럼 묶음의 단위가 붙어요. 문장제에서 "몇 개씩"이 나오면 이 얼굴이에요.',
              en:'Grouping (quotitive division) finds how many groups of a given size fit in the total. The answer carries the group unit (groups, bags, boxes). When a story says "3 each", this is the face you are looking at.',
              zh:'分组数（包含除）是求总数里含有几个给定大小的组。答案带组的单位（组、袋、盒）。应用题里出现"每几个"时，就是这副面孔。'} },

      { tag:{ko:'③ 같은 수 빼기',en:'3) Subtracting again and again',zh:'③ 连续减'},
        head:{ko:'12에서 3을 계속 빼요 — 몇 번에 0이 될까?',en:'Keep taking 3 from 12 — how many times until 0?',zh:'从12里一直减3——几次变成0？'},
        desc:{ko:'봉지에 3개씩 담을 때마다 쿠키가 3개씩 <b>줄어요</b>. 12−3=9, 9−3=6, 6−3=3, 3−3=0. 네 번 빼니까 0! 뺀 횟수 4가 바로 몫이에요. 세 번째 얼굴은 나눗셈을 <b>뺄셈으로 직접 해 보는</b> 방법이에요.',
              en:'Each bag takes 3 cookies <b>away</b>. 12−3=9, 9−3=6, 6−3=3, 3−3=0. Four subtractions reach 0! The count, 4, is the quotient. The third face lets you <b>do division by subtracting</b>.',
              zh:'每装一袋，饼干就<b>少</b>3块。12−3=9，9−3=6，6−3=3，3−3=0。减了四次到0！减的次数4就是商。第三副面孔是<b>用减法直接做除法</b>。'},
        mathSteps:['12-3=9','9-3=6','6-3=3','3-3=0',{ko:'4번 뺐어요 → 몫 4',en:'\\text{subtracted 4 times → quotient 4}',zh:'减了4次 → 商4'}],
        result:{ko:'12÷3=4 — 4번 빼서 0! 14÷3이면 4번 빼고 2가 남아요. 그게 나머지예요.',en:'12÷3=4 — four subtractions reach 0! For 14÷3, four subtractions leave 2. That leftover is the remainder.',zh:'12÷3=4——减4次到0！如果是14÷3，减4次还剩2，那就是余数。'},
        book:{ko:'반복 뺄셈은 나눗셈의 원리예요. 나누는 수를 0이 될 때까지(또는 더 뺄 수 없을 때까지) 빼면, 뺀 횟수가 몫이고 남은 수가 나머지예요. 나중에 배울 긴 나눗셈도 사실은 "한꺼번에 여러 번 빼기"예요.',
              en:'Repeated subtraction is what division really is. Subtract the divisor until you reach 0 (or cannot subtract any more): the number of subtractions is the quotient, and what is left is the remainder. Long division, which you will meet later, is just "subtracting many at once".',
              zh:'连续减是除法的原理。把除数一直减到0（或减不动为止）：减的次数是商，剩下的是余数。以后学的竖式除法，其实就是"一次减掉好几个"。'} },

      { tag:{ko:'④ 곱셈으로 되돌리기',en:'4) Multiply back',zh:'④ 用乘法倒推'},
        head:{ko:'12÷3=□ ↔ 3×□=12: 구구단이 답을 알아요!',en:'12÷3=□ ↔ 3×□=12: your tables know the answer!',zh:'12÷3=□ ↔ 3×□=12：口诀知道答案！'},
        desc:{ko:'세 얼굴 모두 같은 답이 나오는 이유는 <b>3×4=12</b>이기 때문이에요. 나눗셈 12÷3=□는 "3에 무엇을 곱하면 12?"와 같아요. 뜻을 알고 나면 구구단으로 빠르게 찾아도 돼요. 한 곱셈에서 나눗셈이 두 개 나와요: 12÷3=4, 12÷4=3.',
              en:'All three faces give the same answer because <b>3×4=12</b>. 12÷3=□ is the same as "3 times what makes 12?". Once you understand the meaning, you may find it fast with your tables. One multiplication gives two divisions: 12÷3=4 and 12÷4=3.',
              zh:'三副面孔答案都一样，是因为<b>3×4=12</b>。12÷3=□就是"3乘几等于12"。理解了意思以后，就可以用口诀快速找答案。一个乘法给出两个除法：12÷3=4，12÷4=3。'},
        mathSteps:['3 \\times 4 = 12','12 \\div 3 = 4','12 \\div 4 = 3',{ko:'곱셈 하나 = 나눗셈 둘',en:'\\text{one multiplication = two divisions}',zh:'一个乘法 = 两个除法'}],
        result:{ko:'뜻은 세 가지, 답은 하나! 곱셈을 알면 나눗셈이 따라와요.',en:'Three meanings, one answer! Know the multiplication and the division follows.',zh:'三种意思，一个答案！会了乘法，除法就跟着来了。'},
        book:null }
    ],
    rule:{ ko:'① "한 명에 몇 개?"는 똑같이 나누기  ② "몇 묶음?"은 묶어 세기  ③ 막히면 같은 수를 0까지 빼기 — 뺀 횟수가 몫  ④ 3×□=12로 되돌려 확인!',
      en:'① "How many each?" → share equally  ② "How many groups?" → make groups  ③ Stuck? Subtract the same number until 0 — the count is the quotient  ④ Check by multiplying back: 3×□=12!',
      zh:'① "每人几个？"→平均分  ② "几组？"→分组数  ③ 卡住了就连续减到0——减的次数是商  ④ 用3×□=12倒推检查！' }
  },

  check:{
    fills:[
      { tex:'18 \\div 3 = \\square', answer:6,
        hint:{ ko:'18에서 3을 몇 번 빼면 0이 될까요? 18,15,12,9,6,3,0 — 6번! 또는 3×6=18.', en:'How many 3s do you subtract from 18 to reach 0? 18,15,12,9,6,3,0 — six! Or 3×6=18.', zh:'从18里减几次3变成0？18,15,12,9,6,3,0——6次！或者3×6=18。' } },
      { tex:'20 - 5 - 5 - 5 - 5 = 0 \\;\\Rightarrow\\; 20 \\div 5 = \\square', answer:4,
        hint:{ ko:'5를 몇 번 뺐는지 세어 봐요. 뺀 횟수가 바로 몫이에요.', en:'Count how many times 5 was subtracted. That count is the quotient.', zh:'数一数减了几次5。减的次数就是商。' } }
    ],
    open:{ ko:'"사탕 15개를 5명이 똑같이 나눠요"와 "사탕 15개를 5개씩 봉지에 담아요"는 둘 다 15÷5예요. 답은 같은데 무엇이 다른지 말해 봐요.',
      en:'"15 candies shared equally by 5 friends" and "15 candies packed 5 per bag" are both 15÷5. The answer is the same — what is different?',
      zh:'"15颗糖5个人平均分"和"15颗糖每袋装5颗"都是15÷5。答案一样，哪里不一样？' },
    openHint:{ ko:'예) 답은 둘 다 3이지만, 앞은 "한 명에 3개"(개)이고 뒤는 "봉지 3개"(봉지)예요. 앞은 똑같이 나누기, 뒤는 묶어 세기예요.',
      en:'e.g. Both give 3, but the first means "3 candies each" (candies) and the second means "3 bags" (bags). The first is sharing, the second is grouping.',
      zh:'例）答案都是3，但前面是"每人3颗"（颗），后面是"3袋"（袋）。前面是平均分，后面是分组数。' }
  },

  lab:{
    generator:'dv14_repsub', level:'main', count:4,
    params:{},
    intro:{
      ko:'이번엔 뺄셈으로 나눗셈을 직접 해 보자! 같은 수를 0이 될 때까지 빼고, 몇 번 뺐는지 세어 봐.',
      en:'Now do division by subtracting! Take away the same number until you reach 0, then count how many times.',
      zh:'这次用减法来做除法！把同一个数一直减到0，再数一数减了几次。'
    }
  },

  arena:{
    generator:'dv15_family', level:'main', count:8, timeLimit:300,
    params:{ mode:'facts' },
    rule:{ ko:'5분 안에 곱셈 하나로 나눗셈 두 개를 모두 채워요!', en:'In 5 minutes, fill both divisions from each multiplication!', zh:'5分钟内，由每个乘法填出两个除法！' }
  },

  stamp:{ label:{ ko:'나눗셈 세 얼굴 마스터', en:'Three-Faces Master', zh:'除法三面大师' }, coins:25 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'나눗셈의 뜻을 알았네! 🌟',en:'You get what division means!',zh:'你懂除法的意思了！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 몇 개씩인지 다시 볼까?',en:'Hmm, check how many in each group?',zh:'嗯，再看看每组几个？'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 나눗셈의 세 얼굴을 다 알았어! 🍪✨', en:'Perfect! You know all three faces of division!', zh:'完美！除法的三副面孔你都懂了！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
