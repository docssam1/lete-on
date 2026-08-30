/* Numbers of Magic — 유닛 A-27: 수는 몇 개? (초급 G 챕터2) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};
window.NM_UNITS['A-27'] = {
  id:'A-27', tier:'beginner', level:'A', order:27,
  generator:'countBetween',
  title:{ ko:'수는 몇 개?', en:'How Many Numbers?', zh:'有多少个数？' },
  subtitle:{ ko:'a부터 b까지 정수는 b-a+1개예요', en:'Integers from a to b: there are b−a+1 of them', zh:'从a到b的整数个数是b-a+1' },
  icon:'🔢',

  practice:{
    generator:'countBetween', level:'practice', count:5,
    intro:{ ko:'시작부터 끝까지 정수 개수를 세는 연습이에요!', en:'Practice counting integers from start to end!', zh:'练习从头到尾数整数的个数！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 세어서 확인해봐요', en:'1) Check by counting', zh:'① 数一数验证' },
        head:{ ko:'작은 예시로 공식을 확인해요', en:'Verify the formula with a small example', zh:'用小例子验证公式' },
        desc:{ ko:'3부터 7까지 정수: 3, 4, 5, 6, 7 → 5개. 7-3+1=5! <b>공식이 맞아요</b>.',
               en:'Integers from 3 to 7: 3, 4, 5, 6, 7 → 5 numbers. 7−3+1=5! <b>The formula works</b>.',
               zh:'从3到7的整数：3、4、5、6、7 → 5个。7-3+1=5！<b>公式正确</b>。' },
        mathSteps:[{ko:'3부터 7까지: 3, 4, 5, 6, 7',en:'\\text{from 3 to 7: } 3, 4, 5, 6, 7',zh:'从3到7：3, 4, 5, 6, 7'},{ko:'개수 = 7 - 3 + 1',en:'\\text{count} = 7 - 3 + 1',zh:'个数 = 7 - 3 + 1'},{ko:'= 4 + 1 = 5개',en:'= 4 + 1 = 5 \\text{ numbers}',zh:'= 4 + 1 = 5个'}],
        result:{ ko:'3~7은 5개 ✓', en:'3 to 7: 5 numbers ✓', zh:'3到7共5个 ✓' },
        book:{ ko:'"끝 - 시작 + 1" 공식은 양쪽 끝을 모두 포함해서 세기 때문이에요.', en:'"End − Start + 1" counts both endpoints, that\'s why we add 1.', zh:'"结束-开始+1"是因为两端都要计入，所以要加1。' } },
      { tag:{ ko:'② 큰 수에서도 공식이 편해요', en:'2) Formula works for big ranges too', zh:'② 大范围也能用公式' },
        head:{ ko:'직접 세기 어려울 때 공식을 써요', en:'Use the formula when counting by hand is hard', zh:'数起来麻烦时就用公式' },
        desc:{ ko:'15부터 63까지 정수는 몇 개? 63-15+1=49개! 직접 세면 힘들지요?',
               en:'How many integers from 15 to 63? 63−15+1=49! Counting by hand would be exhausting.',
               zh:'从15到63有多少整数？63-15+1=49个！手工数太累了吧？' },
        mathSteps:[{ko:'15부터 63까지: ?',en:'\\text{from 15 to 63: ?}',zh:'从15到63：？'},{ko:'개수 = 63 - 15 + 1',en:'\\text{count} = 63 - 15 + 1',zh:'个数 = 63 - 15 + 1'},{ko:'= 48 + 1 = 49개',en:'= 48 + 1 = 49 \\text{ numbers}',zh:'= 48 + 1 = 49个'}],
        result:{ ko:'15~63은 49개 ✓', en:'15 to 63: 49 numbers ✓', zh:'15到63共49个 ✓' },
        book:null }
    ],
    rule:{ ko:'① 끝 수 b에서 시작 수 a를 뺀다  ② 거기에 1을 더한다  ③ b - a + 1 = 개수',
      en:'① Subtract start (a) from end (b)  ② Add 1  ③ b − a + 1 = count',
      zh:'①用结束数b减去开始数a ②再加1 ③b-a+1=个数' }
  },

  check:{
    fills:[
      { tex:{ko:'3\\text{부터}~7\\text{까지}: 7-3+\\square=5',en:'3~\\text{to}~7: 7-3+\\square=5',zh:'3\\text{到}7: 7-3+\\square=5'}, answer:1,
        hint:{ ko:'끝-시작에 1을 더해요', en:'End minus start, plus 1', zh:'结束-开始，再+1' } },
      { tex:{ko:'15\\text{부터}~63\\text{까지 개수}: 63-15+1=\\square',en:'\\text{count from }15~\\text{to }63: 63-15+1=\\square',zh:'15\\text{到}63\\text{的个数}: 63-15+1=\\square'}, answer:49,
        hint:{ ko:'63-15=48, 48+1=49', en:'63−15=48, 48+1=49', zh:'63-15=48，48+1=49' } }
    ],
    open:{ ko:'a부터 b까지 정수의 개수가 b-a+1인 이유를 설명해봐요.', en:'Explain why the count of integers from a to b is b−a+1.', zh:'说说为什么从a到b的整数个数是b-a+1。' },
    openHint:{ ko:'b-a는 a에서 b까지의 "간격 수"인데, 시작점 a도 1개로 세야 하니까 +1이 필요해요.', en:'b−a counts the gaps, but you also need to count the starting point a itself — hence +1.', zh:'b-a是a到b的"间隔数"，但起点a本身也算1个，所以要+1。' }
  },

  lab:{ generator:'countBetween', level:'main', count:4,
    intro:{ ko:'"끝 - 시작 + 1" 마법으로 세어봐요!', en:'Count with the "end − start + 1" magic!', zh:'用"结束-开始+1"魔法来计数！' } },

  arena:{ generator:'countBetween', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한! b-a+1을 기억해!', en:'As many as you can! Remember b−a+1!', zh:'5分钟内尽量多做！记住b-a+1！' } },

  stamp:{ label:{ ko:'개수 마법사', en:'Counting Wizard', zh:'计数魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'딱 맞게 셌어! 🔢✨',en:'Counted perfectly!',zh:'数得精准！✨'}, {ko:'끝-시작+1 완성!',en:'End−start+1 nailed!',zh:'结束-开始+1成功！'} ],
    wrong:[ {ko:'끝 수에서 시작 수를 빼고 1을 더해봐!',en:'Subtract start from end, then add 1!',zh:'用结束减开始，再加1！'}, {ko:'b-a+1이야!',en:'Remember: b−a+1!',zh:'是b-a+1！'} ],
    finish:{ ko:'완벽해! 개수 마법사야! 🔢✨', en:"Perfect! You're a counting wizard!", zh:'完美！你是计数魔法师！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
