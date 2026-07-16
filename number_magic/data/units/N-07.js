/* Numbers of Magic — 유닛 N-07: 10까지의 수 관계망 (수의 나라 · 유아 5~7세)
   tier:'basic' → 경량 플로우: practice → discover(1스테이지) → lab → stamp
   콘텐츠는 전부 창작 — 라이선스 교재 삽화/지문 미사용 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['N-07'] = {
  id:'N-07', tier:'basic', level:'N', order:7,
  generator:'nl7_relation', edu:'유아',
  title:{ ko:'수 이웃과 10 짝꿍', en:'Number Neighbors & Partners of 10', zh:'数的邻居与凑十朋友' },
  subtitle:{ ko:'1 큰 수, 1 작은 수, 그리고 10을 채우는 짝!', en:'One more, one less, and partners that fill 10!', zh:'大1的数、小1的数，还有凑满10的好朋友！' },
  icon:'🔟',

  practice:{ generator:'nl7_relation', level:'practice', count:4, params:{ mode:'tenpair' },
    intro:{ ko:'10칸 판을 가득 채워 보자! 몇 칸을 더 채우면 10이 될까?',
      en:"Let's fill the ten-frame! How many more squares make 10?",
      zh:'把十格板填满吧！再填几格就是10？' } },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 수는 이웃이 있어요',en:'1) Numbers have neighbors',zh:'① 数有邻居'},
        head:{ko:'1 큰 수, 1 작은 수 — 그리고 10 짝꿍!',en:'One more, one less — and partners of 10!',zh:'大1、小1——还有凑十朋友！'},
        desc:{ko:'수들은 나란히 줄 서 있는 이웃이에요. 5의 <b>1 큰 수</b>는 6, <b>1 작은 수</b>는 4 — 한 칸 앞뒤 이웃이죠! 그리고 10칸 판(텐프레임)에서 7을 놓으면 빈 칸이 3개 — <b>7과 3은 10을 만드는 짝꿍</b>이에요. 1과 9, 2와 8, 3과 7, 4와 6, 5와 5… 짝꿍을 알면 나중에 덧셈이 훨씬 쉬워져요!',
          en:'Numbers stand in a line like neighbors. One more than 5 is 6, one less is 4 — next-door friends! And on a ten-frame, 7 leaves 3 empty squares — <b>7 and 3 are partners that make 10</b>: 1&9, 2&8, 3&7, 4&6, 5&5… Knowing the partners makes addition much easier later!',
          zh:'数像邻居一样排成一排。比5大1的是6，小1的是4——前后邻居！在十格板上摆7个，空3格——<b>7和3是凑成10的好朋友</b>：1和9、2和8、3和7、4和6、5和5……记住这些朋友，以后加法会容易得多！'},
        mathSteps:['4 ← 5 → 6 (이웃)','7 + □ = 10','짝꿍: 1·9, 2·8, 3·7, 4·6, 5·5'],
        result:{ko:'이웃 수와 10 짝꿍 — 수 사이의 길이 보여요!',en:'Neighbors and partners of 10 — you can see the paths between numbers!',zh:'邻居数和凑十朋友——能看到数与数之间的路！'},
        book:{ko:'10 짝꿍은 받아올림 덧셈(8+5)의 비밀 열쇠가 돼요!',en:'Partners of 10 become the secret key to carrying (like 8+5)!',zh:'凑十朋友是进位加法(比如8+5)的秘密钥匙！'} }
    ],
    rule:{ ko:'① 1 큰 수 = 바로 다음 수 ② 1 작은 수 = 바로 앞 수 ③ 10 짝꿍: 채운 칸 + 빈 칸 = 10',
      en:'① One more = the next number ② One less = the number before ③ Partners: filled + empty = 10',
      zh:'① 大1＝后一个数 ② 小1＝前一个数 ③ 凑十朋友：已填＋空格＝10' }
  },

  lab:{ generator:'nl7_relation', level:'main', count:4, params:{ mode:'oneStep' },
    intro:{ ko:'이번엔 이웃 수 찾기! 먼저 톡톡 세어 보고, 1 큰 수나 1 작은 수를 골라 봐.',
      en:'Now find the neighbors! Count first, then pick one more or one less.',
      zh:'现在找邻居数！先点着数一数，再选大1或小1的数。' } },

  stamp:{ label:{ ko:'10 짝꿍 수호자', en:'Guardian of 10-Partners', zh:'凑十小卫士' }, coins:20 },

  voice:{
    correct:[ {ko:'딩동댕! 🎉',en:'Ding-dong!',zh:'叮咚！'}, {ko:'짝꿍 발견! 🔟',en:'Partner found!',zh:'找到朋友啦！'}, {ko:'이웃 수 박사! ⭐',en:'Neighbor expert!',zh:'邻居数博士！'} ],
    wrong:[ {ko:'음~ 다시 세어 볼까?',en:'Hmm, count again?',zh:'嗯，再数数看？'}, {ko:'한 칸 앞? 한 칸 뒤?',en:'One step forward? One step back?',zh:'往前一格？往后一格？'} ],
    finish:{ ko:'짝짝짝! 10 짝꿍 수호자 탄생! 🔟✨', en:'Clap clap! A Guardian of 10-Partners is born!', zh:'鼓掌！凑十小卫士诞生了！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
