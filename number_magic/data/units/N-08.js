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
        desc:{ko:'5를 넣고 규칙이 +2라면? 7이 나와요!',
          en:'Put in 5 with rule +2? Out comes 7!',
          zh:'放进5，规则是+2？出来7！'},
        mathSteps:['5 넣기 → +2 → 7 나오기!','규칙이 숨으면 예시를 봐요','아하, +2구나!'],
        result:{ko:'규칙만 알면 다 맞힐 수 있어요!',en:'Know the rule, know the answer!',zh:'知道规则就都能答对！'} }
    ],
    rule:{ ko:'기계는 규칙대로 수를 바꿔요!',
      en:'The machine changes numbers by its rule!',
      zh:'机器按规则变数字！' }
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
