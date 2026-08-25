/* Numbers of Magic — 유닛 H-04: 1001 자릿수 이동법칙 (고급 C-4 · 경시의 탑 27 수의 비밀) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['H-04'] = {
  id:'H-04', tier:'advanced', level:'27', order:2,
  lineage:['nine-next-door'],
  generator:'adv_1001',
  title:{ ko:'1001 자릿수 이동법칙', en:'The 1001 Repeat Rule', zh:'1001重复规律' },
  subtitle:{ ko:'123×1001=123123! 1001은 사실 1000+1이에요.', en:'123×1001=123123! 1001 is secretly 1000+1.', zh:'123×1001=123123！1001其实是1000+1。' },
  icon:'🔁',

  practice:{
    generator:'adv_1001', level:'practice', count:5,
    params:{mode:'mul',level:'practice'},
    intro:{
      ko:'세 자리 수를 생각하고 1001을 곱해봐. 신기한 일이 벌어질 거야!',
      en:'Think of a 3-digit number and multiply by 1001 — something magical happens!',
      zh:'想一个三位数，乘以1001——奇妙的事情发生了！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 숫자 마법 트릭',en:'1) A number magic trick',zh:'① 数字魔术'},
        head:{ko:'세 자리 수를 생각하고 ×7×11×13 해보세요',en:'Think of a 3-digit number, then ×7×11×13',zh:'想一个三位数，然后×7×11×13'},
        desc:{ko:'세 자리 수 하나를 생각해서 적어두세요. 거기에 7을 곱하고, 11을 곱하고, 13을 곱해보세요. 답이 나왔나요? 놀랍게도 <b>여러분이 생각한 세 자리 수가 두 번 반복</b>돼요! 비밀은 7×11×13=<b>1001</b>이라는 거예요. 1001은 1000과 1을 더한 수라서, 어떤 세 자리 수 N에 곱하면 N×1000+N=N이 두 번 이어붙은 수가 돼요.',
              en:'Pick a 3-digit number and write it down. Multiply by 7, then 11, then 13. Look at the answer — amazingly, <b>your original number appears twice in a row</b>! The secret: 7×11×13=<b>1001</b>. Since 1001 is 1000 plus 1, multiplying N by it gives N×1000+N — N written twice back to back.',
              zh:'想一个三位数写下来。先乘7，再乘11，再乘13。看看结果——神奇的是，<b>你想的数会连续出现两次</b>！秘密是7×11×13=<b>1001</b>。因为1001是1000加1，用N乘以它就是N×1000+N——N连续写两次。'},
        mathSteps:['7×11×13 = 1001','123 × 1001','123×1000 = 123000','123000+123 = 123123'],
        result:{ko:'123×1001=123123! 1001을 곱하면 그 수가 통째로 다시 나타나요.',en:'123×1001=123123! Multiplying by 1001 repeats the number.',zh:'123×1001=123123！乘以1001，那个数就再出现一遍。'},
        book:{ko:'1001, 10001, 1001001처럼 특정 위치에 0과 1이 있는 수는 전부 이 원리로 자릿수를 이동시켜요.',
              en:'Numbers with 0s and 1s in special spots, like 1001, 10001, 1001001, all shift digits by this same principle.',
              zh:'像1001、10001、1001001这样在特定位置有0和1的数，都是靠这个原理来移动数位的。'} },

      { tag:{ko:'② 간격이 있을 때, 세 번 반복될 때',en:'2) With a gap, or three times over',zh:'② 带间隔，或重复三次'},
        head:{ko:'10001은 한 칸 띄고, 1001001은 세 번!',en:'10001 leaves a gap; 1001001 repeats three times!',zh:'10001隔一格，1001001重复三次！'},
        desc:{ko:'123×<b>10001</b>은 어떻게 될까요? 10001=10000+1이니까 123×10000+123=1230000+123=<b>1230123</b> — 123 사이에 <b>0이 한 칸</b> 끼어요! 곱하는 수의 자릿수가 곱해지는 수보다 하나 더 많으면 이렇게 간격이 생겨요. 123×<b>1001001</b>은 123이 <b>세 번</b> 그대로: <b>123123123</b>. 나눗셈도 거꾸로 통해요 — 123123÷1001을 하면 다시 123이 나와요!',
              en:'What about 123×<b>10001</b>? Since 10001=10000+1, that\'s 123×10000+123=1230000+123=<b>1230123</b> — a <b>zero gap</b> appears between the two 123s! When the multiplier has one more digit than the number, a gap shows up like this. And 123×<b>1001001</b> repeats 123 <b>three times</b>: <b>123123123</b>. Division works in reverse too — 123123÷1001 gives back 123!',
              zh:'那123×<b>10001</b>会怎样？因为10001=10000+1，就是123×10000+123=1230000+123=<b>1230123</b>——两个123之间出现<b>一个0</b>！当乘数的位数比原数多一位时就会出现这样的间隔。123×<b>1001001</b>会让123原样重复<b>三次</b>：<b>123123123</b>。除法反过来也成立——123123÷1001又会得到123！'},
        mathSteps:['123×10000 = 1230000','1230000+123 = 1230123','123123 ÷ 1001 = 123 (되돌리기)'],
        result:{ko:'10001을 곱하면 사이에 0이 끼고, 1001001을 곱하면 세 번 반복돼요.',en:'×10001 leaves a zero gap; ×1001001 repeats three times.',zh:'乘10001会隔一个0，乘1001001会重复三次。'},
        book:{ko:'경시의 탑에서는 나눗셈(역방향)도 절반만큼 연습해요 — 반복 패턴을 알아채면 나눗셈이 순식간에 끝나요.',
              en:'In the Tower of Challenges, we practice division (the reverse) just as much — spotting the pattern makes dividing instant.',
              zh:'在"竞赛之塔"里，除法（反向）也要练习一半——看出规律，除法瞬间就能算完。'} }
    ],
    rule:{ ko:'① 1001형 수는 10ⁿ+1의 모습  ② 곱하면 원래 수가 그대로(또는 0을 사이에 두고) 반복  ③ 나눗셈은 그 반대',
      en:'① A 1001-type number is 10ⁿ+1  ② Multiplying repeats the original number, with or without a zero gap  ③ Division reverses it',
      zh:'① 1001型数是10ⁿ+1的形式  ② 相乘会让原数重复出现（可能隔0）  ③ 除法则相反' }
  },

  check:{
    fills:[
      { tex:'234 \\times 1001 = \\square', answer:234234,
        hint:{ ko:'234가 그대로 두 번', en:'234 twice in a row', zh:'234原样重复两次' } },
      { tex:'456456 \\div 1001 = \\square', answer:456,
        hint:{ ko:'반복 패턴을 알아채면 바로 답', en:'spot the pattern for the instant answer', zh:'看出规律就能直接得出答案' } }
    ],
    open:{ ko:'317×10001을 계산하고, 왜 317 사이에 0이 끼는지 설명해 봐요.',
      en:'Compute 317×10001, and explain why a zero appears between the two copies of 317.',
      zh:'算出317×10001，并解释为什么两个317之间会有一个0。' },
    openHint:{ ko:'예) 317×10000=3170000, +317=3170317. 곱하는 수의 자릿수(5)가 317의 자릿수(3)보다 2 많아서 그 차이만큼 0이 껴요.',
      en:'e.g. 317×10000=3170000, +317=3170317. 10001 has 2 more digits than 317, so a gap of that size appears.',
      zh:'例）317×10000=3170000，+317=3170317。10001比317多2位，所以差出来那部分就是0。' }
  },

  lab:{
    generator:'adv_1001', level:'main', count:4,
    params:{mode:'mul',level:'main'},
    intro:{
      ko:'네 자리 수, 간격이 낀 경우, 세 번 반복까지 도전!',
      en:'Try 4-digit numbers, gapped patterns, and triple repeats!',
      zh:'挑战四位数、带间隔和三次重复！'
    }
  },

  arena:{
    generator:'adv_1001', level:'main', count:8, timeLimit:300,
    params:{mode:'div',level:'main'},
    rule:{ ko:'5분 안에 1001 나눗셈 문제를 모두 풀어요!', en:'Solve all 1001-division problems in 5 minutes!', zh:'5分钟内解答所有1001除法题！' }
  },

  stamp:{ label:{ ko:'1001의 비밀사자', en:'Keeper of the 1001 Secret', zh:'1001秘密守护者' }, coins:36 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'수가 완벽하게 반복됐어! 🔁',en:'Perfect repeat!',zh:'完美重复！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'간격이 있는지 없는지 자릿수를 세어봐!',en:'Count digits to check for a gap!',zh:'数一数位数，看看有没有间隔！'}, {ko:'1001=1000+1이라는 걸 기억해!',en:'Remember 1001=1000+1!',zh:'记住1001=1000+1！'} ],
    finish:{ ko:'완벽해! 1001의 비밀사자! 🔁✨', en:'Perfect! Keeper of the 1001 Secret!', zh:'完美！1001秘密守护者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
