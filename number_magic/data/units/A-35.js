/* Numbers of Magic — 유닛 A-35: 고대의 수 (로마 수) (초급 I 챕터1) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};
window.NM_UNITS['A-35'] = {
  id:'A-35', tier:'beginner', level:'A', order:35,
  generator:'romanNumerals',
  title:{ ko:'고대의 수 (로마 수)', en:'Ancient Numbers (Roman Numerals)', zh:'古代数字（罗马数字）' },
  subtitle:{ ko:'I=1, V=5, X=10, L=50, C=100으로 수를 나타내요', en:'I=1, V=5, X=10, L=50, C=100 — read them left to right', zh:'I=1,V=5,X=10,L=50,C=100 — 从左到右读' },
  icon:'🏛️',

  practice:{
    generator:'romanNumerals', level:'practice', count:5,
    intro:{ ko:'로마 기호의 값을 읽는 연습이에요!', en:'Practice reading the value of Roman numeral symbols!', zh:'练习读罗马数字符号的值！' }
  },

  discover:{
    story:{
      hook:{ ko:'Ⅷ도 8, 8도 8. 같은 수인데 왜 모양이 다를까요?',
        en:'Ⅷ is 8, and 8 is 8. Same number — so why do they look different?',
        zh:'Ⅷ是8，8也是8。同一个数，为什么长得不一样？' },
      history:{ ko:'수학 기호는 누가 발명했다기보다 사람들의 손버릇이 굳어진 것에 가까워요. +는 라틴어 et(그리고)를 빨리 흘려 쓰다 만들어졌고, 15세기 중엽 독일에서 인쇄술이 퍼지면서 책에 실려 널리 굳어졌어요.',
        en:'Math symbols were less invented than settled into. The + grew out of scribbling the Latin "et" (and) in a hurry, and once printing spread through Germany in the mid-1400s, printed books fixed such shapes for everyone.',
        zh:'数学符号与其说是被发明的，不如说是习惯固定下来的。+源自快写拉丁语"et"(和)，15世纪中叶印刷术在德国普及后，印刷书籍把这些形状固定了下来。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 기본 기호와 값을 외워요', en:'1) Memorize the basic symbols and values', zh:'① 记住基本符号和值' },
        head:{ ko:'I V X L C 다섯 기호로 모든 수를!', en:'Five symbols I V X L C express all numbers!', zh:'I V X L C 五个符号表示所有数！' },
        desc:{ ko:'I=1, V=5, X=10, L=50, C=100. <b>왼쪽부터 큰 순서면 더해요</b>: VIII=5+1+1+1=8!',
               en:'I=1, V=5, X=10, L=50, C=100. <b>Left to right if descending, add</b>: VIII=5+1+1+1=8!',
               zh:'I=1，V=5，X=10，L=50，C=100。<b>从左到右如果从大到小就相加</b>：VIII=5+1+1+1=8！' },
        mathSteps:['I=1, V=5, X=10, L=50, C=100','VIII = V + I + I + I','= 5 + 1 + 1 + 1 = 8'],
        result:{ ko:'VIII = 8 ✓', en:'VIII = 8 ✓', zh:'VIII = 8 ✓' },
        book:{ ko:'로마 수는 왼쪽에서 오른쪽으로 읽어요. 큰 기호가 앞에 오면 더하기!', en:'Read Roman numerals left to right. Bigger symbol first means addition!', zh:'罗马数字从左到右读。大符号在前表示相加！' } },
      { tag:{ ko:'② 빼기 규칙: 작은 것이 앞에 오면 빼요', en:'2) Subtraction rule: smaller before larger means subtract', zh:'② 减法规则：小符号在大符号前表示相减' },
        head:{ ko:'IV=4, IX=9, XL=40, XC=90', en:'IV=4, IX=9, XL=40, XC=90', zh:'IV=4，IX=9，XL=40，XC=90' },
        desc:{ ko:'IV: <b>I(1)이 V(5) 앞에</b> → 5-1=4. IX: I(1)이 X(10) 앞에 → 10-1=9. XIV=X+IV=10+4=14!',
               en:'IV: <b>I(1) before V(5)</b> → 5−1=4. IX: I(1) before X(10) → 10−1=9. XIV=X+IV=10+4=14!',
               zh:'IV：<b>I(1)在V(5)前</b>→5-1=4。IX：I(1)在X(10)前→10-1=9。XIV=X+IV=10+4=14！' },
        mathSteps:['XIV = X + IV','X = 10','IV = 5 - 1 = 4','10 + 4 = 14'],
        result:{ ko:'XIV = 14 ✓', en:'XIV = 14 ✓', zh:'XIV = 14 ✓' },
        book:null }
    ],
    rule:{ ko:'① 기호값 암기: I=1 V=5 X=10 L=50 C=100  ② 왼→오른쪽으로 읽기  ③ 작은 기호가 큰 것 앞에 오면 빼기',
      en:'① Memorize: I=1 V=5 X=10 L=50 C=100  ② Read left to right  ③ Smaller before larger = subtract',
      zh:'①记住：I=1 V=5 X=10 L=50 C=100 ②从左到右读 ③小符号在大符号前=相减' }
  },

  check:{
    fills:[
      { tex:'\\text{VIII} = 5 + 1 + 1 + 1 = \\square', answer:8,
        hint:{ ko:'V=5, I=1, I=1, I=1 → 5+3=8', en:'V=5, I=1+1+1=3: 5+3=8', zh:'V=5，I=1+1+1=3：5+3=8' } },
      { tex:'\\text{XIV} = 10 + (5-1) = \\square', answer:14,
        hint:{ ko:'X=10, IV=4, 10+4=14', en:'X=10, IV=4, 10+4=14', zh:'X=10，IV=4，10+4=14' } }
    ],
    open:{ ko:'로마 수에서 IV가 4이고 VI가 6인 이유를 설명해봐요.', en:'Explain why IV is 4 and VI is 6 in Roman numerals.', zh:'说说为什么罗马数字IV是4，VI是6。' },
    openHint:{ ko:'IV: I(1)이 V(5) 앞에 오면 5-1=4. VI: V(5) 다음에 I(1)이 오면 5+1=6. 순서가 의미를 바꿔요!', en:'IV: I(1) before V(5) means 5−1=4. VI: V(5) then I(1) means 5+1=6. Order changes the meaning!', zh:'IV：I(1)在V(5)前→5-1=4。VI：V(5)后跟I(1)→5+1=6。顺序改变含义！' }
  },

  lab:{ generator:'romanNumerals', level:'main', count:4,
    intro:{ ko:'고대 로마의 수를 읽어봐요!', en:'Read the numbers of ancient Rome!', zh:'读懂古罗马的数字！' } },

  arena:{ generator:'romanNumerals', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한! 로마 수를 아라비아 수로!', en:'As many as you can! Roman to Arabic numerals!', zh:'5分钟内尽量多做！罗马数字转阿拉伯数字！' } },

  stamp:{ label:{ ko:'로마수 마법사', en:'Roman Numeral Wizard', zh:'罗马数字魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'고대 수 해독 성공! 🏛️✨',en:'Ancient numbers decoded!',zh:'古代数字解码成功！✨'}, {ko:'로마 수 완벽!',en:'Roman numerals perfect!',zh:'罗马数字完美！'} ],
    wrong:[ {ko:'I V X L C 값을 기억해봐!',en:'Remember I V X L C values!',zh:'记住I V X L C的值！'}, {ko:'작은 것이 앞에 오면 빼야 해!',en:'Smaller before larger means subtract!',zh:'小符号在大符号前要相减！'} ],
    finish:{ ko:'완벽해! 로마수 마법사야! 🏛️✨', en:"Perfect! You're a Roman numeral wizard!", zh:'完美！你是罗马数字魔法师！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
