/* Numbers of Magic — 유닛 C-27: 9로 끝나는 수의 곱 (중급 창의전략 2단계) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-27'] = {
  id:'C-27', tier:'intermediate', level:'C', order:27,
  lineage:['nine-next-door'],
  generator:'ml_end9',
  title:{ ko:'9로 끝나는 수의 곱', en:'Ending-in-9 Products', zh:'尾数为9的乘法' },
  subtitle:{ ko:'1 크게 만들어 곱하고, 더 곱한 만큼 한 번 빼요', en:'Round up by 1, multiply, then subtract the extra once', zh:'凑成大1的数再乘，最后减掉多乘的部分' },
  icon:'🎯',

  practice:{
    generator:'ml_end9', level:'practice', count:5,
    params:{ level:'practice' },
    intro:{
      ko:'19, 29, 39, 49… 9로 끝나는 수는 1을 더해서 20, 30, 40으로 만들면 곱셈이 훨씬 쉬워져. 그다음 더 곱한 만큼만 빼주면 끝! 준비됐지?',
      en:"Numbers ending in 9 — 19, 29, 39, 49 — get easy once you add 1 to make 20, 30, 40. Then just subtract back the extra you multiplied. Ready?",
      zh:'19、29、39、49……尾数是9的数加1变成20、30、40就好乘多了。乘完再减掉多乘的部分就行！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 1을 더해 깔끔한 수로',en:'1) Add 1 to make it neat',zh:'① 加1变成整齐的数'},
        head:{ko:'49×34: 50×34에서 34 한 번 빼기!',en:'49×34: from 50×34, subtract 34 once!',zh:'49×34：用50×34再减一次34！'},
        desc:{ko:'9로 끝나는 수는 <b>1만 더하면 딱 떨어지는 수</b>(10, 20, 30…)가 돼요. 49×34를 계산할 때 49 대신 <b>50</b>을 곱해요: 50×34=1700. 그런데 49는 50보다 1 작으니까, <b>34를 한 번 더 곱한 셈</b>이에요. 그래서 34를 <b>한 번 빼면</b>: 1700−34=<b>1666</b>. 어려운 49단을 몰라도 50단과 뺄셈만으로 끝!',
              en:'A number ending in 9 becomes a <b>round number</b> (10, 20, 30…) with just +1. To find 49×34, multiply by <b>50</b> instead: 50×34=1700. But 49 is 1 less than 50, so we multiplied <b>one extra 34</b>. So <b>subtract it once</b>: 1700−34=<b>1666</b>. No need to know the "49 times table" — just the 50s and one subtraction!',
              zh:'尾数是9的数只要+1就变成整数(10、20、30…)。算49×34时改乘<b>50</b>：50×34=1700。但49比50少1，相当于<b>多乘了一次34</b>，所以<b>减一次</b>：1700−34=<b>1666</b>。不用会"49的乘法"，只要50的乘法加一次减法！'},
        mathSteps:['50 × 34 = 1700','1700 − 34 = 1666'],
        result:{ko:'49×34=1666! 1 더한 만큼 나중에 한 번 빼요.',en:'49×34=1666! Subtract back the extra you added.',zh:'49×34=1666！加了多少，最后减回来。'},
        book:{ko:'같은 원리로 99, 199처럼 9가 여러 개인 수도 통해요: 199×n = 200×n − n. 9의 개수만큼 0을 더 붙여서 반올림하면 돼요.',
              en:'The same trick works for 99, 199 and other numbers full of 9s: 199×n = 200×n − n. Round up by as many zeros as there are 9s.',
              zh:'同样的技巧对99、199这类多个9的数也适用：199×n = 200×n − n。有几个9就多进几位。'} },

      { tag:{ko:'② 왜 딱 한 번만 빼나요?',en:'2) Why subtract only once?',zh:'② 为什么只减一次？'},
        head:{ko:'29×6: 30×6에서 6 한 번만!',en:'29×6: from 30×6, just one 6!',zh:'29×6：30×6只减一次6！'},
        desc:{ko:'29는 30보다 <b>딱 1 작아요</b>. 30을 6번 더한 것(30×6=180)에는 실제보다 <b>6이 한 번 더</b> 들어 있어요(29를 6번 더한 것과 비교하면 1×6=6만큼 많음). 그래서 <b>6을 딱 한 번</b> 빼면 진짜 답: 180−6=<b>174</b>. "1만큼 작다"가 "빼는 수만큼 한 번"으로 이어지는 게 핵심이에요.',
              en:'29 is <b>exactly 1 less</b> than 30. Adding 30 six times (30×6=180) has <b>one extra 6</b> hidden inside compared to adding 29 six times (the gap is 1×6=6). So subtract <b>that one 6</b> to get the real answer: 180−6=<b>174</b>. The key idea: "1 less" turns into "subtract the multiplier once."',
              zh:'29比30<b>恰好少1</b>。把30加六次(30×6=180)比把29加六次多出<b>一个6</b>(差距是1×6=6)。所以减去<b>那一个6</b>才是真答案：180−6=<b>174</b>。核心是："少1"变成"减一次乘数"。'},
        mathSteps:['30 × 6 = 180','180 − 6 = 174'],
        result:{ko:'29×6=174! "1만큼 작다"가 "한 번 빼기"로.',en:'29×6=174! "1 less" becomes "subtract once."',zh:'29×6=174！"少1"变成"减一次"。'},
        book:{ko:'만약 수가 2만큼 작았다면(예: 28) 두 번 빼야 해요. 이 유닛은 딱 9로 끝나는(1만큼 작은) 경우만 다뤄요.',
              en:'If the number were 2 less (like 28), you\'d subtract twice. This unit only covers the "1 less" case — numbers ending in 9.',
              zh:'如果数少2(比如28)就要减两次。这个单元只讲"少1"的情况——尾数为9。'} },

      { tag:{ko:'③ 큰 수도 똑같이',en:'3) Big numbers, same idea',zh:'③ 大数也一样'},
        head:{ko:'89×18: 90×18에서 18 한 번 빼기',en:'89×18: from 90×18, subtract 18 once',zh:'89×18：90×18减一次18'},
        desc:{ko:'수가 커져도 방법은 똑같아요. 89×18 → 90×18=1620, 1620−18=<b>1602</b>. 199 같은 세 자리 9도 마찬가지예요: 199×23 → 200×23=4600, 4600−23=<b>4577</b>. "9면 무조건 1 더해서 반올림, 곱한 수를 한 번 빼기" — 이 두 단계만 기억하면 돼요!',
              en:'Bigger numbers follow the exact same steps. 89×18 → 90×18=1620, 1620−18=<b>1602</b>. Even a 3-digit 199 works: 199×23 → 200×23=4600, 4600−23=<b>4577</b>. Remember just two steps: "round the 9 up by 1, then subtract the multiplier once."',
              zh:'数变大了方法也一样。89×18 → 90×18=1620，1620−18=<b>1602</b>。三位数199也一样：199×23 → 200×23=4600，4600−23=<b>4577</b>。只记两步："9就+1凑整，再减一次乘数"。'},
        mathSteps:['90 × 18 = 1620','1620 − 18 = 1602'],
        result:{ko:'89×18=1602! 크기가 커져도 두 단계는 그대로.',en:'89×18=1602! Same two steps, any size.',zh:'89×18=1602！数再大也是这两步。'},
        book:null }
    ],
    rule:{ ko:'① 9로 끝나면 1을 더해 딱 떨어지는 수로  ② 반올림해서 곱하기  ③ 곱한 수(승수)를 한 번 빼기',
      en:'① A number ending in 9 becomes round with +1  ② Multiply using the rounded number  ③ Subtract the multiplier once',
      zh:'① 尾数为9就+1凑成整数  ② 用凑整后的数相乘  ③ 减一次乘数' }
  },

  check:{
    fills:[
      { tex:'29 \\times 6 = \\square', answer:174,
        hint:{ ko:'30×6=180, 180−6=?', en:'30×6=180, 180−6=?', zh:'30×6=180，180−6=？' } },
      { tex:'89 \\times 14 = \\square', answer:1246,
        hint:{ ko:'90×14=1260, 1260−14=?', en:'90×14=1260, 1260−14=?', zh:'90×14=1260，1260−14=？' } }
    ],
    open:{ ko:'9로 끝나는 수를 곱할 때 왜 곱한 수(승수)를 "한 번만" 빼면 되는지 설명해 봐요.',
      en:'Explain why subtracting the multiplier "just once" is enough when multiplying a number ending in 9.',
      zh:'解释为什么乘尾数为9的数时，只需要"减一次"乘数就够了。' },
    openHint:{ ko:'예) 9로 끝나는 수는 딱 떨어지는 수보다 1만큼 작아요. 그 수를 n번 더하면 실제보다 1×n=n만큼 많이 더한 셈이니, n을 한 번 빼면 정확해져요.',
      en:'e.g. A number ending in 9 is exactly 1 less than the round number. Adding it n times means you\'ve over-added by 1×n=n, so subtracting n once fixes it exactly.',
      zh:'例）尾数为9的数比整数正好少1。把它加n次就多加了1×n=n，所以减一次n就精确了。' }
  },

  lab:{
    generator:'ml_end9', level:'main', count:4,
    params:{ level:'main' },
    intro:{
      ko:'이번엔 더 큰 수! 1 더해서 곱하고, 곱한 수를 한 번 빼봐.',
      en:'Bigger numbers now! Round up by 1, multiply, then subtract once.',
      zh:'现在是更大的数！加1相乘，再减一次。'
    }
  },

  arena:{
    generator:'ml_end9', level:'main', count:8, timeLimit:300,
    params:{ level:'main' },
    rule:{ ko:'5분 안에 9로 끝나는 수의 곱을 모두 풀어요!', en:'Solve all ending-in-9 products in 5 minutes!', zh:'5分钟内解答所有尾数9的乘法！' }
  },

  stamp:{ label:{ ko:'9단 저격수', en:'Nine-Ender Sniper', zh:'尾9狙击手' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'딱 한 번 빼기 성공! 🎯',en:'One clean subtraction!',zh:'一次减法就搞定！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'1을 더해서 곱해봐!',en:'Round up by 1 first!',zh:'先加1再乘！'}, {ko:'곱한 수를 한 번만 빼봐!',en:'Subtract the multiplier just once!',zh:'只减一次乘数！'} ],
    finish:{ ko:'완벽해! 9단 저격수! 🎯✨', en:'Perfect! Nine-Ender Sniper!', zh:'完美！尾9狙击手！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
