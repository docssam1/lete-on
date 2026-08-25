/* Numbers of Magic — 유닛 H-07: 50·100·1000 근처 수의 제곱 (고급 E-3 · 경시의 탑 28 제곱의 산) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['H-07'] = {
  id:'H-07', tier:'advanced', level:'28', order:1,
  lineage:['place-magic'],
  generator:'adv_nearSquare',
  title:{ ko:'50·100·1000 근처 수의 제곱', en:'Squares Near 50, 100 & 1000', zh:'接近50·100·1000的平方' },
  subtitle:{ ko:'104² = 앞자리(104+4)와 뒷자리(4²)를 이어붙여요!', en:'104² = attach the front (104+4) and back (4²)!', zh:'104² = 把前面(104+4)和后面(4²)拼起来！' },
  icon:'🪞',

  practice:{
    generator:'adv_nearSquare', level:'practice', count:5,
    params:{anchor:50},
    intro:{
      ko:'50에 가까운 수부터 시작해볼까? 앞자리와 뒷자리를 따로 만들어봐!',
      en:'Let\'s start near 50 — build the front and back digits separately!',
      zh:'先从接近50的数开始吧——分别做出前面和后面的数字！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 100 근처: 앞자리+뒷자리',en:'1) Near 100: front + back',zh:'① 接近100：前面+后面'},
        head:{ko:'104² = 108 | 16 = 10816',en:'104² = 108 | 16 = 10816',zh:'104² = 108 | 16 = 10816'},
        desc:{ko:'104는 100보다 4 커요. <b>앞자리</b>는 100에 그 차이를 <b>두 번</b> 더해요: 100+4+4=108(또는 104+4=108). <b>뒷자리</b>는 그 차이를 제곱: 4²=16. 이어붙이면 <b>10816</b>! 96²이라면 96은 100보다 4 작으니, 앞자리는 100−4−4=92, 뒷자리는 여전히 4²=16 → <b>9216</b>. 위/아래 상관없이 뒷자리는 항상 (차이)²예요.',
              en:'104 is 4 more than 100. The <b>front</b> adds that gap <b>twice</b> to 100: 100+4+4=108 (or just 104+4=108). The <b>back</b> is the gap squared: 4²=16. Attach them: <b>10816</b>! For 96², since 96 is 4 less than 100, the front is 100−4−4=92, and the back is still 4²=16 → <b>9216</b>. Up or down, the back is always (gap)².',
              zh:'104比100多4。<b>前面</b>的数是100加两次差：100+4+4=108（或直接104+4=108）。<b>后面</b>是差的平方：4²=16。拼起来就是<b>10816</b>！算96²的话，96比100少4，前面是100−4−4=92，后面还是4²=16 → <b>9216</b>。不管加还是减，后面永远是（差）²。'},
        mathSteps:['104 = 100+4','104+4 = 108 (앞자리)','4² = 16 (뒷자리)','108×100+16 = 10816'],
        result:{ko:'104²=10816! 앞자리는 차이를 두 번 더하고, 뒷자리는 차이를 제곱해요.',en:'104²=10816! Front adds the gap twice; back squares the gap.',zh:'104²=10816！前面加两次差，后面是差的平方。'},
        book:{ko:'(100+a)² = 10000+200a+a² = 100×(100+2a)+a². 100+2a가 바로 앞자리, a²이 뒷자리예요.',
              en:'(100+a)² = 10000+200a+a² = 100×(100+2a)+a². The front is 100+2a, the back is a².',
              zh:'(100+a)² = 10000+200a+a² = 100×(100+2a)+a²。前面是100+2a，后面是a²。'} },

      { tag:{ko:'② 50과 1000 근처는?',en:'2) What about near 50 and 1000?',zh:'② 接近50和1000呢？'},
        head:{ko:'같은 원리, 시작하는 앞자리만 달라요',en:'Same idea, just a different starting front',zh:'原理相同，只是起始的前数不同'},
        desc:{ko:'54²을 볼까요? 54는 50보다 4 커요. 앞자리는 25(=50²÷100)에서 시작해서 4만큼 더해요: 25+4=29. 뒷자리는 여전히 4²=16. 이어붙이면 <b>2916</b>! 1000 근처는 앞자리가 1000(=1000²÷1000)에서 시작하고 <b>세 자리</b> 뒷자리를 붙여요. 기준수가 뭐든 원리는 같아요 — 앞자리 시작값만 다를 뿐이에요.',
              en:'Look at 54²: 54 is 4 more than 50. The front starts at 25 (=50²÷100) and adds 4: 25+4=29. The back is still 4²=16. Attached: <b>2916</b>! Near 1000, the front starts at 1000 (=1000²÷1000) and the back needs <b>three</b> digits. Whatever the anchor, the idea is the same — only the front\'s starting value changes.',
              zh:'看看54²：54比50多4。前面从25（=50²÷100）开始，加4：25+4=29。后面还是4²=16。拼起来是<b>2916</b>！接近1000时，前面从1000（=1000²÷1000）开始，后面要接<b>三位</b>数字。不管基准是什么，原理都一样——只是前面的起始值不同。'},
        mathSteps:['54=50+4','25+4=29 (앞자리)','4²=16 (뒷자리)','29×100+16 = 2916'],
        result:{ko:'54²=2916! 기준수가 바뀌어도 원리는 똑같아요.',en:'54²=2916! The method stays the same no matter the anchor.',zh:'54²=2916！不管基准是多少，方法都一样。'},
        book:{ko:'뒷자리 자릿수는 기준에 따라 달라요 — 50·100 기준은 두 자리, 1000 기준은 세 자리. 실제 덧셈으로 합치면 자리올림도 저절로 맞아요.',
              en:'The number of back digits depends on the anchor — two for 50/100, three for 1000. Combining with real addition automatically handles any carrying.',
              zh:'后面的位数取决于基准——50/100用两位，1000用三位。用真正的加法拼接，进位也会自动处理正确。'} }
    ],
    rule:{ ko:'① 기준수와의 차를 구하기  ② 앞자리 = 기준²÷자리수 + 차(부호 그대로)  ③ 뒷자리 = 차²',
      en:'① Find the gap from the anchor  ② Front = anchor²÷place-scale + gap (with sign)  ③ Back = gap²',
      zh:'① 求与基准数的差  ② 前面 = 基准²÷位数 + 差（带符号）  ③ 后面 = 差²' }
  },

  check:{
    fills:[
      { tex:'107^2 = \\square', answer:11449,
        hint:{ ko:'앞: 100+7+7=114, 뒤: 7²=49 → 11449', en:'front 100+7+7=114, back 7²=49 → 11449', zh:'前100+7+7=114，后7²=49 → 11449' } },
      { tex:'46^2 = \\square', answer:2116,
        hint:{ ko:'46은 50보다 4 작음: 앞 25−4=21, 뒤 4²=16 → 2116', en:'46 is 4 under 50: front 25−4=21, back 16 → 2116', zh:'46比50少4：前25−4=21，后16 → 2116' } }
    ],
    open:{ ko:'998²을 1000 근처 제곱법으로 풀고, 뒷자리가 왜 세 자리로 늘어나는지 설명해 봐요.',
      en:'Solve 998² using the near-1000 method, and explain why the back needs three digits.',
      zh:'用接近1000的方法算998²，说说为什么后面要用三位数。' },
    openHint:{ ko:'예) 앞 1000−2−2=996, 뒤 2²=4→004(세 자리로 채움) → 996004. 뒤가 100보다 커질 수 있는(최대 999²) 기준이라 세 자리가 필요해요.',
      en:'e.g. front 1000−2−2=996, back 2²=4→004 (padded to 3 digits) → 996004. Since the back can grow up to 999², it needs 3 digits.',
      zh:'例）前1000−2−2=996，后2²=4→004（补足三位）→ 996004。后面最大可到999²，所以需要三位。' }
  },

  lab:{
    generator:'adv_nearSquare', level:'main', count:4,
    params:{anchor:100},
    intro:{
      ko:'이번엔 100 근처 제곱! 앞자리·뒷자리를 빠르게 만들어봐.',
      en:'Now near 100 — build the front and back quickly!',
      zh:'这次是接近100！快速做出前后两部分！'
    }
  },

  arena:{
    generator:'adv_nearSquare', level:'main', count:8, timeLimit:300,
    params:{anchor:1000},
    rule:{ ko:'5분 안에 1000 근처 제곱을 모두 풀어요!', en:'Solve all near-1000 squares in 5 minutes!', zh:'5分钟内解答所有接近1000的平方！' }
  },

  stamp:{ label:{ ko:'근처 제곱 마법사', en:'Near-Anchor Square Wizard', zh:'邻近平方魔法师' }, coins:38 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'앞뒤 딱 맞췄어! 🪞',en:'Front and back nailed it!',zh:'前后拼得真准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'앞자리에 차이를 두 번 더했는지 확인해봐!',en:'Check the front added the gap twice!',zh:'检查一下前面是否加了两次差！'}, {ko:'뒷자리는 차이의 제곱이야!',en:'The back is the gap squared!',zh:'后面是差的平方！'} ],
    finish:{ ko:'완벽해! 근처 제곱 마법사! 🪞✨', en:'Perfect! Near-Anchor Square Wizard!', zh:'完美！邻近平方魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
