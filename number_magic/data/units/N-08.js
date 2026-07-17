/* Numbers of Magic — 유닛 N-08: 수 기계와 매직 퍼즐 (수의 나라 · 유아 5~7세)
   tier:'basic' → 경량 플로우: practice → discover(1스테이지) → lab → stamp
   콘텐츠는 전부 창작(수 기계 도식) — 라이선스 교재 삽화/지문 미사용 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['N-08'] = {
  id:'N-08', tier:'basic', level:'N', order:8,
  generator:'nl8_machine', edu:'유아',
  title:{ ko:'수 기계와 매직 퍼즐', en:'Number Machine & Magic Puzzle', zh:'数字机器与魔法谜题' },
  subtitle:{ ko:'수를 넣으면 짠! 규칙대로 바뀌어요', en:'Put a number in — poof! It changes by the rule', zh:'放进一个数——变身！按规则变化' },
  icon:'⚙️',

  practice:{ generator:'nl8_machine', level:'practice', count:4, params:{ mode:'apply' },
    intro:{ ko:'수 기계에 수를 넣으면 규칙대로 바뀌어 나와요! 규칙을 보고 답을 구해요',
      en:'Put a number into the machine and it changes by the rule! Look at the rule and find the answer',
      zh:'把数字放进机器，它会按规则变化！看规则算出答案' } },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 수 기계는 규칙대로 바꿔요!',en:'1) The machine changes numbers by a rule!',zh:'① 数字机器按规则变化！'},
        head:{ko:'넣은 수에 규칙을 적용하면 나오는 수가 돼요',en:'Apply the rule to the input and get the output',zh:'把规则用在放入的数上，就得到出来的数'},
        desc:{ko:'수 기계에 <b>5</b>를 넣고 규칙이 <b>"+2"</b>라면? 5에 2를 더해서 <b>7</b>이 나와요! 규칙이 <b>"-1"</b>이라면 5에서 1을 빼서 <b>4</b>가 나오죠. 그런데 어떤 기계는 규칙을 <b>숨기고</b> 있어요! 그럴 땐 미리 나온 예시 두 개를 잘 보고 — "3을 넣으면 5가 나왔네? 2를 넣으면 4가 나왔고? 아하, <b>+2</b>구나!" 하고 <b>비밀 규칙을 추리</b>해야 해요.',
          en:'Put <b>5</b> into the machine with the rule <b>"+2"</b>? Add 2 to 5 and get <b>7</b>! With the rule <b>"-1"</b>, subtract 1 from 5 to get <b>4</b>. But some machines <b>hide</b> the rule! Then look closely at two examples — "3 went in, 5 came out? 2 went in, 4 came out? Aha, it\'s <b>+2</b>!" — and <b>guess the secret rule</b>.',
          zh:'把<b>5</b>放进机器，规则是<b>"+2"</b>？5加2得<b>7</b>！规则是<b>"-1"</b>的话，5减1得<b>4</b>。但有些机器会<b>藏起</b>规则！这时要仔细看两个例子——"放进3，出来5？放进2，出来4？啊哈，是<b>+2</b>！"——<b>猜出秘密规则</b>。'},
        mathSteps:['규칙이 보이면: 입력에 규칙 바로 적용','규칙이 숨으면: 예시 2개로 규칙 추리','추리한 규칙을 새 입력에 적용!'],
        result:{ko:'규칙만 알면 어떤 수가 들어와도 답할 수 있어요!',en:'Know the rule and you can answer for any number!',zh:'只要知道规则，什么数进去都能算出来！'},
        book:{ko:'수 기계는 나중에 함수와 규칙 찾기로 이어지는 첫걸음이에요!',en:'Number machines are a first step toward functions and pattern-finding!',zh:'数字机器是以后学习函数和找规律的第一步！'} }
    ],
    rule:{ ko:'① 규칙이 보이면 바로 계산해요 ② 규칙이 숨으면 예시로 추리해요 ③ 추리한 규칙을 그대로 적용!',
      en:'① If the rule is shown, calculate directly ② If hidden, guess from examples ③ Apply the guessed rule!',
      zh:'① 规则显示就直接算 ② 规则隐藏就靠例子猜 ③ 把猜到的规则用上去！' }
  },

  lab:{ generator:'nl8_machine', level:'main', count:4, params:{ mode:'guess' },
    intro:{ ko:'이번엔 규칙이 숨었어요! 예시 두 개를 보고 비밀 규칙을 추리해서 답해요',
      en:'This time the rule is hidden! Look at two examples and guess the secret rule',
      zh:'这次规则藏起来了！看两个例子，猜出秘密规则' } },

  stamp:{ label:{ ko:'수 기계 조종사', en:'Machine Operator', zh:'数字机器操作员' }, coins:20 },

  voice:{
    correct:[ {ko:'딩동! 규칙을 찾았어요 ⚙️',en:'Ding! You found the rule!',zh:'叮！找到规则啦！'}, {ko:'완벽한 계산! ✨',en:'Perfect calculation!',zh:'计算完美！'}, {ko:'추리력 최고! 🔍',en:'Great detective work!',zh:'推理力满分！'} ],
    wrong:[ {ko:'음~ 예시 두 개를 다시 비교해 볼까요?',en:'Hmm, compare the two examples again?',zh:'嗯，再比较一下两个例子？'}, {ko:'입력과 출력의 차이를 살펴봐요',en:'Look at the difference between input and output',zh:'看看输入和输出的差是多少'} ],
    finish:{ ko:'짝짝짝! 수 기계 조종사 탄생! ⚙️✨', en:'Clap clap! A Machine Operator is born!', zh:'鼓掌！数字机器操作员诞生了！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
