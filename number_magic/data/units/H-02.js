/* Numbers of Magic — 유닛 H-02: 100(1000) 보수 곱 (고급 A-2·C-2 · 경시의 탑 26 곱셈의 정점) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['H-02'] = {
  id:'H-02', tier:'advanced', level:'26', order:2,
  lineage:['nine-next-door'],
  generator:'adv_comp100',
  title:{ ko:'100 보수 곱', en:'Complement-of-100 Multiplication', zh:'100补数乘法' },
  subtitle:{ ko:'96×93 = 89 | 28: 100에서 모자란 만큼으로 계산해요!', en:'96×93 = 89 | 28: use how far each is from 100!', zh:'96×93 = 89 | 28：用离100还差多少来算！' },
  icon:'💯',

  practice:{
    generator:'adv_comp100', level:'practice', count:5,
    params:{mode:'under',base:100},
    intro:{
      ko:'100보다 조금 작은 두 수를 곱해봐. 100에서 모자란 만큼이 비밀 열쇠야!',
      en:'Multiply two numbers just under 100 — how far each is from 100 is the secret key!',
      zh:'算算两个略小于100的数相乘——离100还差多少就是关键！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 모자란 만큼을 적어요',en:'1) Write down what\'s missing',zh:'① 写下差多少'},
        head:{ko:'96×93 = 89 28 = 8928',en:'96×93 = 89 28 = 8928',zh:'96×93 = 89 28 = 8928'},
        desc:{ko:'96은 100보다 4 모자라고, 93은 100보다 7 모자라요. <b>엇갈려 빼면</b> 96−7=89 (또는 93−4=89, 같아요!) — 이게 <b>앞자리</b>예요. 모자란 두 수를 곱하면 4×7=28 — 이게 <b>뒷자리</b>! 붙이면 <b>8928</b>. 진짜 96×93을 계산해도 8928이 나와요!',
              en:'96 is 4 short of 100, and 93 is 7 short. <b>Cross-subtract</b>: 96−7=89 (same as 93−4=89!) — that\'s the <b>front</b>. Multiply the two shortfalls: 4×7=28 — the <b>back</b>! Put them together: <b>8928</b>. Check it — 96×93 really is 8928!',
              zh:'96比100少4，93比100少7。<b>交叉相减</b>：96−7=89（和93−4=89一样！）——这是<b>前面</b>的数。把两个差相乘：4×7=28——是<b>后面</b>的数！合起来就是<b>8928</b>。真的算96×93也是8928！'},
        mathSteps:['100−96=4, 100−93=7','96−7 = 89 (앞자리)','4×7 = 28 (뒷자리)','89 | 28 = 8928'],
        result:{ko:'96×93=8928! 모자란 만큼끼리 엇갈려 빼고, 곱해서 붙여요.',en:'96×93=8928! Cross-subtract the shortfalls, then multiply and attach.',zh:'96×93=8928！交叉相减差值，再相乘拼接。'},
        book:{ko:'대수로 보면 (100−p)(100−q)=100(100−p−q)+pq — 앞자리는 100−p−q, 뒷자리는 pq예요.',
              en:'Algebraically, (100−p)(100−q)=100(100−p−q)+pq — front is 100−p−q, back is pq.',
              zh:'代数上，(100−p)(100−q)=100(100−p−q)+pq——前面是100−p−q，后面是pq。'} },

      { tag:{ko:'② 100을 넘으면 반대로 빼요',en:'2) Over 100? Subtract instead',zh:'② 超过100就改成减'},
        head:{ko:'103×97 = 103+(−3) → 100−300 = 9991',en:'103×97: add then subtract the cross-product',zh:'103×97：先加后减交叉积'},
        desc:{ko:'103은 100보다 3 <b>많고</b>, 97은 100보다 3 <b>적어요</b>. 이번엔 앞자리를 <b>더해서</b> 만들어요: 103+(−3)=100. 뒷자리는 여전히 두 차이를 곱하지만, 이번엔 <b>빼요</b>: 3×3=9 → 10000−9=9991. 100 미만끼리는 더하고, 하나가 넘으면 뺀다 — 이 차이만 기억하면 돼요!',
              en:'103 is 3 <b>over</b> 100, and 97 is 3 <b>under</b>. This time build the front by <b>adding</b>: 103+(−3)=100. The back is still the product of the two gaps, but now you <b>subtract</b>: 3×3=9 → 10000−9=9991. Both-under adds; one-over subtracts — remember just that one flip!',
              zh:'103比100<b>多</b>3，97比100<b>少</b>3。这次前面用<b>加</b>法：103+(−3)=100。后面还是两个差相乘，但这次要<b>减</b>：3×3=9 → 10000−9=9991。都小于100就用加，有一个超过就改用减——只要记住这一个反转！'},
        mathSteps:['100+3−3=100 (앞자리)','3×3=9 (뒷자리, 빼기)','100×100−9 = 9991'],
        result:{ko:'103×97=9991! 100을 넘으면 뒷자리를 더하지 않고 빼요.',en:'103×97=9991! Over 100 means subtract the back, not add.',zh:'103×97=9991！超过100时后面要减，不是加。'},
        book:{ko:'(100+p)(100−q)=100(100+p−q)−pq — 100 미만끼리의 공식과 딱 부호 하나만 달라요.',
              en:'(100+p)(100−q)=100(100+p−q)−pq — just one sign different from the both-under formula.',
              zh:'(100+p)(100−q)=100(100+p−q)−pq——和都小于100的公式只差一个符号。'} }
    ],
    rule:{ ko:'① 100(1000)과의 차 적기  ② 둘 다 미만이면 더하기, 하나가 넘으면 빼기  ③ 차끼리 곱해 뒷자리',
      en:'① Write each gap from 100(1000)  ② Both under → add; one over → subtract  ③ Multiply the gaps for the back digits',
      zh:'① 写出各自与100(1000)的差  ② 都小于就加，有一个超过就减  ③ 差相乘得到后面的数' }
  },

  check:{
    fills:[
      { tex:'98 \\times 96 = \\square', answer:9408,
        hint:{ ko:'모자란 2와 4: 98−4=94, 2×4=8 → 9408', en:'gaps 2,4: 98−4=94, 2×4=8 → 9408', zh:'差2和4：98−4=94，2×4=8 → 9408' } },
      { tex:'109 \\times 94 = \\square', answer:10246,
        hint:{ ko:'109는 +9, 94는 −6: 109−6=103, 9×6=54 → 10300−54', en:'109 is +9, 94 is −6: 109−6=103, 9×6=54 → 10300−54', zh:'109是+9，94是−6：109−6=103，9×6=54 → 10300−54' } }
    ],
    open:{ ko:'997×996을 1000 보수 곱으로 풀고, 100 기준일 때와 무엇이 같고 다른지 말해 봐요.',
      en:'Solve 997×996 using the 1000-complement method, and describe what stays the same or changes compared to the base-100 version.',
      zh:'用1000补数法算997×996，说说和100为基准时有什么相同和不同。' },
    openHint:{ ko:'예) 997−4=993, 3×4=12 → 993000+12=993012. 기준이 100에서 1000으로 바뀔 뿐 방법은 똑같아요.',
      en:'e.g. 997−4=993, 3×4=12 → 993000+12=993012. Only the anchor changes from 100 to 1000 — the method is identical.',
      zh:'例）997−4=993，3×4=12 → 993000+12=993012。只是基准从100变成1000，方法完全一样。' }
  },

  lab:{
    generator:'adv_comp100', level:'main', count:4,
    params:{mode:'mixed',base:100},
    intro:{
      ko:'하나는 100을 넘고 하나는 안 넘는 경우도 해보자!',
      en:'Let\'s try when one number is over 100 and the other under!',
      zh:'来试试一个超过100、一个不到100的情况！'
    }
  },

  arena:{
    generator:'adv_comp100', level:'main', count:8, timeLimit:300,
    params:{mode:'under',base:1000},
    rule:{ ko:'5분 안에 1000 보수 곱 문제를 모두 풀어요!', en:'Solve all 1000-complement problems in 5 minutes!', zh:'5分钟内解答所有1000补数乘法题！' }
  },

  stamp:{ label:{ ko:'100 보수 마법사', en:'Complement-of-100 Wizard', zh:'100补数魔法师' }, coins:34 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'보수 곱 완벽해! 💯',en:'Perfect complement!',zh:'补数乘法完美！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'100을 넘는지 안 넘는지부터 확인해!',en:'Check whether it\'s over or under 100 first!',zh:'先看看是超过还是不到100！'}, {ko:'뒷자리는 두 차이를 곱하는 거야!',en:'The back digits are the product of the two gaps!',zh:'后面的数字是两个差相乘！'} ],
    finish:{ ko:'완벽해! 100 보수 마법사! 💯✨', en:'Perfect! Complement-of-100 Wizard!', zh:'完美！100补数魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
