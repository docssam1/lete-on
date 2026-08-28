/* Numbers of Magic — 유닛 A-19: 반대로 채우기 (초급 E 챕터3) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};
window.NM_UNITS['A-19'] = {
  id:'A-19', tier:'beginner', level:'A', order:19,
  generator:'fillReverse',
  title:{ ko:'반대로 채우기', en:'Reverse Fill', zh:'反向填空' },
  subtitle:{ ko:'A-B=□ 대신 B+□=A 로 생각해요', en:'Think B + □ = A instead of A - B = □', zh:'把A-B=□想成B+□=A' },
  icon:'🔄',

  practice:{
    generator:'fillReverse', level:'practice', count:5,
    intro:{ ko:'뺄셈을 덧셈으로 뒤집는 연습이에요!', en:'Practice flipping subtraction into addition!', zh:'练习把减法变成加法！' }
  },

  discover:{
    story:{
      hook:{ ko:'지갑에 얼마가 있었는지 모르는데, 돈을 두 배로 늘린 뒤 8000원을 내는 일을 세 번 했더니 딱 0원이 됐어요. 처음에 얼마 있었을까요?',
        en:'You forget what was in your wallet. Three times you doubled it and then paid 8,000 won — and ended at exactly zero. How much did you start with?',
        zh:'忘了钱包里原本有多少。做了三次先翻倍再付8000元，最后正好是0元。一开始有多少？' },
      history:{ ko:'7000원이에요. 끝에서 거꾸로 되짚으면 한 줄로 풀려요. 마지막에 0원이 되기 직전은 8000원, 두 배 하기 전은 4000원, 그 전은 4000+8000=12000원… 이렇게요. 뺄셈을 덧셈으로 뒤집어 생각하는 것과 똑같은 마법입니다.',
        en:'7,000 won. Walk the story backwards and it unravels in one line: before the last payment 8,000, before doubling 4,000, before that 4,000+8,000 = 12,000, and so on. It is the same magic as turning a subtraction into an addition.',
        zh:'7000元。从结尾倒着推，一行就解开了：最后付款前是8000，翻倍前是4000，再往前是4000+8000=12000……这和把减法反过来当加法想是同一个魔法。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 뺄셈을 덧셈으로 뒤집어요', en:'1) Flip subtraction to addition', zh:'① 把减法翻转成加法' },
        head:{ ko:'빼는 대신 더해서 채우기!', en:'Instead of subtracting, fill by adding!', zh:'不用减，用加法来填！' },
        desc:{ ko:'73-48=? 를 "48+□=73"으로 바꾸면, 48에서 73까지 얼마나 더해야 할까? 를 묻는 문제가 돼요. 이게 더 쉬울 때가 많아요!',
               en:'Turn 73-48=? into "48+□=73": how much to add to 48 to get 73? That\'s often easier!',
               zh:'把73-48=？改成"48+□=73"：从48加多少能到73？这样想往往更容易！' },
        mathSteps:['73 - 48 = □','반대로: 48 + □ = 73','48에서 50까지: +2','50에서 73까지: +23','□ = 2 + 23 = 25'],
        result:{ ko:'73-48=25 ✓', en:'73-48=25 ✓', zh:'73-48=25 ✓' },
        book:{ ko:'수직선에서 48에서 73까지 뛰어 올라가는 거리를 구하는 셈이에요.', en:'It\'s like measuring the distance from 48 to 73 on a number line.', zh:'就像在数轴上量从48跳到73的距离。' } },
      { tag:{ ko:'② 언제 반대로 채울까요?', en:'2) When to use reverse fill?', zh:'② 什么时候用反向填空？' },
        head:{ ko:'빼는 수와 빼지는 수가 가까울 때 특히 유용해요', en:'Especially useful when the numbers are close together', zh:'当两个数比较接近时特别好用' },
        desc:{ ko:'91-88=? → 88+□=91 → □=3. 가까운 두 수는 반대로 채우기로 순식간에 풀려요!',
               en:'91-88=? → 88+□=91 → □=3. When numbers are close, reverse fill solves it in a flash!',
               zh:'91-88=？→88+□=91→□=3。两数接近时，反向填空一瞬间就解决了！' },
        mathSteps:['91 - 88 = □','반대로: 88 + □ = 91','□ = 3'],
        result:{ ko:'91-88=3 ✓', en:'91-88=3 ✓', zh:'91-88=3 ✓' },
        book:null }
    ],
    rule:{ ko:'① A-B=□ 를 B+□=A 로 바꾼다  ② B에서 A까지 얼마나 더해야 하는지 생각한다  ③ 그 수가 바로 답!',
      en:'① Turn A-B=□ into B+□=A  ② Think: how much to add to B to reach A?  ③ That amount is the answer!',
      zh:'①把A-B=□改成B+□=A ②想：从B加多少能到A？ ③那个数就是答案！' }
  },

  check:{
    fills:[
      { tex:'73-48=\\square \\;\\Rightarrow\\; 48+\\square=73', answer:25,
        hint:{ ko:'48에서 73까지: 50까지 2, 거기서 23 더 → 25', en:'48→73: +2 to 50, +23 more = 25', zh:'48→73：加2到50，再加23，共25' } },
      { tex:'91-88=\\square', answer:3, hint:{ ko:'88+□=91', en:'88+□=91', zh:'88+□=91' } }
    ],
    open:{ ko:'뺄셈을 덧셈으로 바꾸면 왜 더 쉬울 때가 있는지 설명해봐요.', en:'Explain why converting subtraction to addition can be easier.', zh:'说说为什么把减法变成加法有时候更容易。' },
    openHint:{ ko:'예) 두 수가 가까울 때, 덧셈으로 생각하면 "얼마나 더해야?"라는 간단한 질문이 돼요.', en:'e.g. When numbers are close, addition becomes "how much more?" — a simple question.', zh:'例）两数接近时，加法变成了"再加多少"——很简单的问题。' }
  },

  lab:{ generator:'fillReverse', level:'main', count:4,
    intro:{ ko:'뒤집기 마법! 뺄셈을 덧셈으로 바꿔봐요.', en:'Flip magic! Convert subtraction to addition.', zh:'翻转魔法！把减法变成加法。' } },

  arena:{ generator:'fillReverse', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한! B+□=A 로 생각하면 빠르게!', en:'As many as you can! Think B+□=A for speed!', zh:'5分钟内尽量多做！想B+□=A就能快！' } },

  stamp:{ label:{ ko:'반대로 채우기 마법사', en:'Reverse Filler', zh:'反向填空魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'뒤집기 성공! 🔄✨',en:'Flip success!',zh:'反转成功！'}, {ko:'덧셈으로 쉽게 풀었어!',en:'Solved easily with addition!',zh:'用加法轻松搞定！'} ],
    wrong:[ {ko:'B+□=A 로 바꿔봐!',en:'Try B+□=A !',zh:'改成B+□=A试试！'}, {ko:'두 수 사이 거리를 생각해봐!',en:'Think of the distance between the two numbers!',zh:'想想两数之间的距离！'} ],
    finish:{ ko:'완벽해! 반대로 채우기 마법사야! 🔄✨', en:"Perfect! You're a reverse filler!", zh:'完美！你是反向填空魔法师！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
