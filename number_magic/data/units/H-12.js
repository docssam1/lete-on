/* Numbers of Magic — 유닛 H-12: 어림하기 곱셈법 (고급 B-2 · 과정 24 보강) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['H-12'] = {
  id:'H-12', tier:'advanced', level:'boost', order:2,
  lineage:['place-magic'],
  generator:'adv_estimate',
  title:{ ko:'어림하기 곱셈법', en:'Estimate-and-Adjust Multiplication', zh:'估算调整乘法' },
  subtitle:{ ko:'52×48: 50에 가까우니 50×48로 어림하고 보정해요!', en:'52×48: estimate 50×48, then adjust!', zh:'52×48：先按50×48估算，再修正！' },
  icon:'📏',

  practice:{
    generator:'adv_estimate', level:'practice', count:5,
    params:{level:'practice'},
    intro:{
      ko:'딱 맞는 수가 아니어도 괜찮아. 가까운 어림수로 먼저 곱해보자!',
      en:'It doesn\'t need to be an exact round number — multiply with a nearby estimate first!',
      zh:'不用凑成正好的数——先用邻近的估算数相乘吧！'
    }
  },

  discover:{
    story:{
      hook:{ ko:'2000년 전, 배도 비행기도 없이 지구 둘레를 알아낸 사람이 있어요. 어떻게?',
        en:'Two thousand years ago, with no ship or plane, someone measured the whole Earth. How?',
        zh:'两千年前，没有船也没有飞机，有人量出了地球一圈有多长。怎么做到的？' },
      history:{ ko:'에라토스테네스는 같은 시각 두 도시에서 해의 기울기가 7.2도 차이 난다는 걸 알았어요. 7.2도는 한 바퀴 360도의 딱 50분의 1이죠. 두 도시 사이가 약 800 km니까 800 × 50 = 40,000 km. 오늘날 측정값은 약 40,075 km예요. 정확한 도구 하나 없이, 어림하고 곱한 것만으로요.',
        en:'Eratosthenes noticed the sun stood 7.2 degrees apart at the same hour in two cities. And 7.2 degrees is exactly one fiftieth of a full 360. The cities were about 800 km apart, so 800 × 50 = 40,000 km. Today we measure about 40,075 km. No precise instrument at all — just an estimate and one multiplication.',
        zh:'埃拉托色尼发现，同一时刻两座城市的太阳角度差7.2度。而7.2度正好是一整圈360度的五十分之一。两城相距约800公里，于是800 × 50 = 40,000公里。今天测得约40,075公里。没有任何精密仪器——只靠一次估算和一次乘法。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 가까운 수 찾고, 부호 판단',en:'1) Find a close number, judge the sign',zh:'① 找邻近数，判断正负'},
        head:{ko:'52×48 = 50×48 + 2×48',en:'52×48 = 50×48 + 2×48',zh:'52×48 = 50×48 + 2×48'},
        desc:{ko:'52는 50보다 계산하기 어렵죠? 52 대신 <b>가까운 어림수 50</b>을 써서 50×48=2400을 먼저 구해요. 그런데 진짜는 52니까 2만큼 <b>더</b> 곱해줘야 해요: 2×48=96. <b>더 곱해졌으니 더해요</b>: 2400+96=<b>2496</b>. 핵심은 매번 "더 곱해졌나, 덜 곱해졌나"를 판단하는 거예요.',
              en:'52 is awkward on its own — use the <b>nearby estimate 50</b> instead: 50×48=2400. But the real number is 52, so we <b>under</b>-multiplied by 2: 2×48=96. Since we multiplied <b>too little</b>, we add it back: 2400+96=<b>2496</b>. The key each time is judging whether you multiplied too much or too little.',
              zh:'52不太好直接算——用<b>邻近的估算数50</b>代替：50×48=2400。但实际是52，我们少乘了2：2×48=96。因为<b>乘少了</b>，就要加回来：2400+96=<b>2496</b>。每次的关键是判断到底是乘多了还是乘少了。'},
        mathSteps:['50 × 48 = 2400','2 × 48 = 96','2400 + 96 = 2496'],
        result:{ko:'52×48=2496! 어림한 다음 부족한(또는 초과한) 만큼을 더하거나 빼요.',en:'52×48=2496! Estimate, then add or subtract the shortfall or excess.',zh:'52×48=2496！先估算，再加上或减去不足或多出的部分。'},
        book:{ko:'52는 50보다 <b>큰</b> 수였으니 <b>더했어요.</b> 만약 48을 어림수로 삼았다면(48은 50보다 2 작으니) 2400에서 2×52=104를 <b>빼야</b> 해요 — 어느 쪽을 어림수로 삼든 결과는 같아요(2496).',
              en:'Since 52 is <b>larger</b> than 50, we <b>added</b>. If instead we anchor on 48 (2 less than 50), we\'d <b>subtract</b> 2×52=104 from 2400 — either way, the result is the same (2496).',
              zh:'因为52<b>比</b>50大，所以要<b>加</b>。如果换成以48为基准（比50少2），就要用2400<b>减去</b>2×52=104——不管选哪个基准，结果都一样（2496）。'} },

      { tag:{ko:'② 큰 수, 비대칭 거리도 문제없어요',en:'2) Big numbers, uneven gaps? No problem',zh:'② 大数、不对称距离也没问题'},
        head:{ko:'298×122: 300으로 어림해도 122는 그대로!',en:'298×122: estimate just 298 as 300, keep 122 as-is',zh:'298×122：只把298估成300，122原样保留'},
        desc:{ko:'298×122를 볼까요. 298만 <b>300으로 어림</b>하면 300×122=36600. 실제 298은 300보다 2 <b>작으니</b> 2×122=244만큼 <b>덜</b> 곱해졌던 거예요 — <b>빼줘요</b>: 36600−244=<b>36356</b>. 두 수 다 어림할 필요 없어요! 122는 그대로 두고 298 하나만 다뤄도 정확한 답이 나와요.',
              en:'Look at 298×122. Estimate only 298 as <b>300</b>: 300×122=36600. Since 298 is 2 <b>less</b> than 300, we over-counted by 2×122=244 — <b>subtract</b> it: 36600−244=<b>36356</b>. No need to round both numbers! Leaving 122 untouched and adjusting just 298 still gives the exact answer.',
              zh:'看看298×122。只把298估成<b>300</b>：300×122=36600。因为298比300<b>少</b>2，所以多算了2×122=244——要<b>减掉</b>：36600−244=<b>36356</b>。不需要把两个数都凑整！122保持不变，只处理298一个数，照样能得到精确答案。'},
        mathSteps:['300 × 122 = 36600','2 × 122 = 244','36600 − 244 = 36356'],
        result:{ko:'298×122=36356! 한쪽만 어림해도 판단만 정확하면 답이 딱 맞아요.',en:'298×122=36356! Rounding just one factor still gives the exact answer, as long as the sign is right.',zh:'298×122=36356！只估算一个数，只要判断对了符号，答案照样精确。'},
        book:{ko:'10배수뿐 아니라 100배수로 어림해도 원리는 같아요 — 어느 쪽으로 어림하는 게 더 편한지 비교해 보는 것도 좋은 훈련이에요.',
              en:'Rounding to a multiple of 100 works the same way as rounding to 10 — comparing which is more convenient is good practice too.',
              zh:'凑成整百和凑成整十原理相同——比较一下哪种更方便，也是很好的练习。'} }
    ],
    rule:{ ko:'① 계산하기 쉬운 가까운 수 찾기  ② 더 곱해졌는지 덜 곱해졌는지 판단하기  ③ 어림값에 더하거나 빼서 최종값 구하기',
      en:'① Find an easy nearby number  ② Judge whether you multiplied too much or too little  ③ Add or subtract from the estimate for the final value',
      zh:'① 找一个好算的邻近数  ② 判断是乘多了还是乘少了  ③ 在估算值上加减，求出最终答案' }
  },

  check:{
    fills:[
      { tex:'62 \\times 39 = \\square', answer:2418,
        hint:{ ko:'60×39=2340, 2×39=78, 더 곱해졌으니 더하기', en:'60×39=2340, 2×39=78, add since 62>60', zh:'60×39=2340，2×39=78，62比60多要加' } },
      { tex:'404 \\times 396 = \\square', answer:159984,
        hint:{ ko:'400×396=158400, 4×396=1584, 더해요', en:'400×396=158400, 4×396=1584, add', zh:'400×396=158400，4×396=1584，要加' } }
    ],
    open:{ ko:'196×304를 어림하기 곱셈법으로 풀고, 어떤 수를 어림했는지·왜 더하거나 뺐는지 설명해 봐요.',
      en:'Solve 196×304 with the estimate-and-adjust method, explaining which number you rounded and why you added or subtracted.',
      zh:'用估算调整法算196×304，说说你估算了哪个数，为什么要加或减。' },
    openHint:{ ko:'예) 196을 200으로 어림: 200×304=60800. 196은 200보다 4 작으니 4×304=1216만큼 덜 곱해졌어요 — 빼기: 60800−1216=59584.',
      en:'e.g. Round 196 to 200: 200×304=60800. Since 196 is 4 less, we over-counted by 4×304=1216 — subtract: 60800−1216=59584.',
      zh:'例）把196估成200：200×304=60800。196比200少4，多算了4×304=1216——要减：60800−1216=59584。' }
  },

  lab:{
    generator:'adv_estimate', level:'practice', count:4,
    params:{level:'practice'},
    intro:{
      ko:'두 자리 곱셈으로 판단력을 더 다져보자!',
      en:'Sharpen your judgment with more 2-digit multiplications!',
      zh:'再用两位数乘法磨练一下判断力！'
    }
  },

  arena:{
    generator:'adv_estimate', level:'main', count:8, timeLimit:300,
    params:{level:'main'},
    rule:{ ko:'5분 안에 세 자리 어림하기 곱셈을 모두 풀어요!', en:'Solve all 3-digit estimate-and-adjust problems in 5 minutes!', zh:'5分钟内解答所有三位数估算调整题！' }
  },

  stamp:{ label:{ ko:'어림하기 곱셈 명인', en:'Estimate-and-Adjust Master', zh:'估算调整乘法大师' }, coins:34 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'판단이 정확했어! 📏',en:'Great judgment!',zh:'判断得真准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'더 곱해졌는지 덜 곱해졌는지 다시 확인해봐!',en:'Recheck whether you over- or under-multiplied!',zh:'再检查一下是乘多了还是乘少了！'}, {ko:'어림수와 실제 수의 차이부터 구해봐!',en:'Start by finding the gap between the estimate and the real number!',zh:'先算出估算数和实际数的差！'} ],
    finish:{ ko:'완벽해! 어림하기 곱셈 명인! 📏✨', en:'Perfect! Estimate-and-Adjust Master!', zh:'完美！估算调整乘法大师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
