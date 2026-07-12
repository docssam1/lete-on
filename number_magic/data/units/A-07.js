/* ============================================================
   Numbers of Magic — 유닛 데이터: A-07
   초급 B · 챕터3 "끼리끼리 더해요"
   창의수연 초급 B 실제 교재 내용 기반. generator=splitPlace.
   핵심: 73+62+50+41 → (70+60+50+40)+(3+2+0+1) = 220+6 = 226
   "자리끼리 모아서 따로따로 더해요!"
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-07'] = {
  id:'A-07', tier:'beginner', level:'A', order:7,
  generator:'splitPlace',
  title:{ ko:'끼리끼리 더해요', en:'Add Same Places Together', zh:'同位相加' },
  subtitle:{ ko:'십의 자리끼리, 일의 자리끼리 따로 더해요', en:'Add tens with tens, ones with ones, separately', zh:'十位加十位，个位加个位，分开来加' },
  icon:'🏗️',

  practice:{
    generator:'splitPlace', level:'practice', count:5,
    intro:{
      ko:'준비 운동! 두 자리 수에서 십의 자리 부분이 얼마인지 맞혀봐요.',
      en:"Warm up! For each two-digit number, what is the tens part?",
      zh:'热热身！对于每个两位数，十位部分是多少？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 수를 자리별로 나눠요', en:'1) Split each number by place', zh:'① 按数位拆分每个数' },
        head:{ ko:'두 자리 수 = 십의 자리 + 일의 자리', en:'2-digit number = tens part + ones part', zh:'两位数 = 十位部分 + 个位部分' },
        desc:{ ko:'73은 70+3이에요. 62는 60+2예요. 모든 두 자리 수는 <b>십의 자리 부분</b>과 <b>일의 자리 부분</b>으로 나눌 수 있어요. 이걸 이용하면 덧셈이 훨씬 쉬워져요!',
               en:'73 is 70+3. 62 is 60+2. Every two-digit number can be split into a tens part and ones part. This makes addition much easier!',
               zh:'73就是70+3，62就是60+2。每个两位数都可以拆成十位部分和个位部分。这样加法就容易多了！' },
        mathSteps:['73 = 70 + 3','62 = 60 + 2','50 = 50 + 0','41 = 40 + 1'],
        result:{ ko:'73→(70,3), 62→(60,2), 50→(50,0), 41→(40,1)로 모두 나눌 수 있어요!', en:'73→(70,3), 62→(60,2), 50→(50,0), 41→(40,1) — all split up!', zh:'73→(70,3)，62→(60,2)，50→(50,0)，41→(40,1)，都拆开来了！' },
        book:{ ko:'수를 나누는 것을 "분해"라고 해요. 73을 70과 3으로 분해하면 계산할 때 편해요.',
               en:'Splitting a number is called decomposing. Decomposing 73 into 70 and 3 makes calculation convenient.',
               zh:'把数拆开叫做"分解"。把73分解成70和3，计算时就很方便。' } },

      { tag:{ ko:'② 끼리끼리 모아 더해요', en:'2) Gather same-place digits and add', zh:'② 把同位的数聚在一起相加' },
        head:{ ko:'십의 자리끼리, 일의 자리끼리 따로 모아요', en:'Gather tens with tens, ones with ones', zh:'十位和十位放在一起，个位和个位放在一起' },
        desc:{ ko:'나눈 수들을 자리별로 모아요. 십의 자리끼리 더하고, 일의 자리끼리 더하면 계산이 두 단계로 나뉘어 훨씬 쉬워져요!',
               en:'Group the split parts by place. Adding all tens together and all ones together splits the problem into two easy steps!',
               zh:'把拆分后的数按数位归类。十位都加在一起，个位都加在一起，问题就分成两个简单的步骤了！' },
        mathSteps:['73 + 62 + 50 + 41','= (70+60+50+40) + (3+2+0+1)  ← 끼리끼리!','= 220 + 6','= 226'],
        result:{ ko:'73+62+50+41 = 226! 십의 자리만 더하면 220, 일의 자리만 더하면 6, 합치면 226!', en:'73+62+50+41 = 226! Tens sum: 220, ones sum: 6, together: 226!', zh:'73+62+50+41 = 226！十位之和：220，个位之和：6，合起来：226！' },
        book:{ ko:'24+51+36+43 → (20+50+30+40)+(4+1+6+3) = 140+14 = 154. 자리별로 나누면 큰 수도 쉽게 풀려요.',
               en:'24+51+36+43 → (20+50+30+40)+(4+1+6+3) = 140+14 = 154. Splitting by place makes big sums easy.',
               zh:'24+51+36+43 → (20+50+30+40)+(4+1+6+3) = 140+14 = 154。按数位拆开，大数也容易解了。' } },

      { tag:{ ko:'③ 합치면 끝!', en:'3) Put it all together!', zh:'③ 合并就完成了！' },
        head:{ ko:'두 부분을 합쳐 최종 답을 내요', en:'Combine both parts for the final answer', zh:'把两部分合并，得出最终答案' },
        desc:{ ko:'십의 자리끼리 더한 결과와 일의 자리끼리 더한 결과를 합치면 끝이에요. 두 단계가 각각 훨씬 쉬우니까 실수도 줄어들어요!',
               en:'Add the tens result and the ones result to finish. Each step is simpler, so you\'ll make fewer mistakes!',
               zh:'把十位合计和个位合计相加就完成了。每一步都更简单，出错的机会也少！' },
        mathSteps:['35 + 42 + 13 + 24','십의 자리: 30+40+10+20 = 100','일의 자리: 5+2+3+4 = 14','100 + 14 = 114'],
        result:{ ko:'35+42+13+24 = 114! 두 단계로 깔끔하게!', en:'35+42+13+24 = 114! Clean and clear in two steps!', zh:'35+42+13+24 = 114！两步清清楚楚！' },
        book:null }
    ],
    rule:{ ko:'① 각 수를 십의 자리와 일의 자리로 나눈다  ② 십의 자리끼리, 일의 자리끼리 따로 더한다  ③ 두 결과를 합친다',
      en:'① Split each number into tens and ones  ② Add all tens together; add all ones together  ③ Combine both sums.',
      zh:'①把每个数拆成十位和个位 ②十位都加在一起，个位都加在一起 ③把两个结果合并。' }
  },

  check:{
    fills:[
      { tex:'73 + 62 + 50 + 41 = (70+60+50+40) + (3+2+0+\\square)', answer:1,
        hint:{ ko:'41의 일의 자리는 몇이에요?', en:'What is the ones digit of 41?', zh:'41的个位是多少？' } },
      { tex:'24 + 51 + 36 + 43 = 140 + \\square', answer:14,
        hint:{ ko:'일의 자리끼리: 4+1+6+3=?', en:'Ones together: 4+1+6+3=?', zh:'个位相加：4+1+6+3=？' } }
    ],
    open:{
      ko:'끼리끼리 더하는 방법이 특히 편리한 경우는 어떤 상황일까요?',
      en:'In what kind of situation is the "same-place grouping" method especially convenient?',
      zh:'什么情况下"同位相加"的方法特别方便？'
    },
    openHint:{
      ko:'예) 더해야 할 수가 많을 때, 또는 일의 자리 숫자들이 크거나 올림이 많을 때 자리를 분리하면 머릿속이 덜 복잡해요.',
      en:'e.g. When there are many numbers to add, or when ones digits are large with many carries, splitting places keeps your head clearer.',
      zh:'例）要加的数很多时，或者个位数字大、需要多次进位时，分开数位能让头脑更清晰。'
    }
  },

  lab:{
    generator:'splitPlace', level:'main', count:4,
    intro:{
      ko:'이제 직접 끼리끼리 나눠봐! 십의 자리와 일의 자리를 따로 모아서 계산해봐요.',
      en:"Now group by place yourself! Separate the tens and ones and calculate each part.",
      zh:'现在自己按数位分组！把十位和个位分开，分别计算。'
    }
  },

  arena:{
    generator:'splitPlace', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한 많이! 자리별로 빠르게 나눠서 풀어요!', en:'As many as you can in 5 minutes — split by place and solve fast!', zh:'5分钟内尽量多做！按数位快速分开来解题！' }
  },

  stamp:{ label:{ ko:'자리 마법사', en:'Place Wizard', zh:'数位魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'끼리끼리 성공! 🏗️',en:'Same-place grouping works!',zh:'同位相加成功！'}, {ko:'자리 마법 완성! 🪄',en:'Place magic complete!',zh:'数位魔法完成！'} ],
    wrong:[ {ko:'음~ 십의 자리끼리, 일의 자리끼리 따로 모아봐!',en:'Hmm — try grouping tens with tens and ones with ones!',zh:'嗯，试试把十位和十位、个位和个位分开来加！'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 자리 마법사야 🏗️✨', en:"Perfect! You're a Place Wizard now!", zh:'完美！你现在是数位魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
