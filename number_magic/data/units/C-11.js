/* Numbers of Magic — 유닛 C-11: 폭포수 곱셈법 (중급 C 챕터3) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-11'] = {
  id:'C-11', tier:'intermediate', level:'C', order:11,
  generator:'ml8_mul2d2d',
  title:{ ko:'폭포수 곱셈법', en:'Waterfall Multiplication', zh:'瀑布乘法' },
  subtitle:{ ko:'위에서 아래로! 부분곱을 폭포처럼 흘려 내려 더해요', en:'Top to bottom! Let partial products cascade down like a waterfall', zh:'从上到下！让部分积像瀑布一样流下来相加' },
  icon:'🌊',

  practice:{
    generator:'ml8_mul2d2d', level:'practice', count:5,
    params:{ easy:true },
    intro:{
      ko:'부분곱을 위에서 아래로 폭포처럼 차례차례 흘려 쓰며 곱하는 방법이야. 순서만 지키면 절대 안 틀려! 준비됐지?',
      en:"Write partial products cascading top to bottom like a waterfall. Keep the order and you'll never slip! Ready?",
      zh:'把部分积像瀑布一样从上到下依次写下来。守住顺序就绝不会错！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 폭포수처럼 흘려 쓰기',en:'1) Cascading like a waterfall',zh:'① 像瀑布一样写下来'},
        head:{ko:'36×24: 부분곱을 한 줄씩 아래로!',en:'36×24: one partial product per line, downward!',zh:'36×24：部分积一行一行往下写！'},
        desc:{ko:'풀풀곱셈(C-10)의 네 조각을 <b>순서대로 한 줄씩 아래로</b> 흘려 써요. 36×24라면: 30×20=600 ↓ 30×4=120 ↓ 6×20=120 ↓ 6×4=24. 위에서 아래로 폭포처럼 쌓인 <b>600, 120, 120, 24</b>를 더하면 864. 줄만 잘 맞추면 조각을 잃어버릴 일이 없어요!',
              en:'Write the four pieces of full-full multiplication (C-10) <b>in order, one line at a time, downward</b>. For 36×24: 30×20=600 ↓ 30×4=120 ↓ 6×20=120 ↓ 6×4=24. The waterfall stack <b>600, 120, 120, 24</b> adds to 864. Keep the lines tidy and no piece ever gets lost!',
              zh:'把全全乘法(C-10)的四块<b>按顺序一行一行往下</b>写。36×24：30×20=600 ↓ 30×4=120 ↓ 6×20=120 ↓ 6×4=24。瀑布般叠好的<b>600、120、120、24</b>相加得864。行对齐了，一块也不会丢！'},
        mathSteps:['30×20 = 600','30×4  = 120','6×20  = 120',{ko:'6×4   = 24  → 합 864',en:'6×4 = 24 → \\text{sum } 864',zh:'6×4 = 24 → 合计864'}],
        result:{ko:'36×24=864! 폭포수 순서: 십×십 → 십×일 → 일×십 → 일×일.',en:'36×24=864! Waterfall order: tens×tens → tens×ones → ones×tens → ones×ones.',zh:'36×24=864！瀑布顺序：十×十→十×个→个×十→个×个。'},
        book:{ko:'폭포수 곱셈은 풀풀곱셈과 조각이 같아요. 차이는 "쓰는 방식" — 세로로 정렬해 쓰기 때문에 받아올림 없이 마지막에 한꺼번에 더해요.',
              en:'Waterfall uses the same pieces as full-full. The difference is the layout — writing them vertically aligned means no mid-way carries; you add everything once at the end.',
              zh:'瀑布乘法和全全乘法的块相同。区别在"写法"——竖着对齐写，中途不用进位，最后一次加完。'} },

      { tag:{ko:'② 항상 같은 순서로',en:'2) Always the same order',zh:'② 永远同一个顺序'},
        head:{ko:'십×십부터 일×일까지, 계단을 내려가듯',en:'From tens×tens down to ones×ones, like descending stairs',zh:'从十×十到个×个，像下楼梯'},
        desc:{ko:'폭포수의 힘은 <b>정해진 순서</b>에 있어요. ①십×십(가장 큰 물줄기) ②십×일 ③일×십 ④일×일(마지막 물방울). 항상 이 순서로 내려가면 어떤 문제든 조각을 빠뜨리거나 두 번 세는 실수가 사라져요.',
              en:'The waterfall\'s power is its <b>fixed order</b>: ①tens×tens (the biggest stream) ②tens×ones ③ones×tens ④ones×ones (the last droplet). Follow this descent every time, and you\'ll never skip or double-count a piece.',
              zh:'瀑布的力量在于<b>固定顺序</b>：①十×十(最大的水流) ②十×个 ③个×十 ④个×个(最后的水滴)。每次都按这个顺序下来，就不会漏块或重复。'},
        mathSteps:[{ko:'① 십×십 (제일 큰 조각)',en:'① \\text{tens×tens (biggest piece)}',zh:'① 十×十（最大的一块）'},{ko:'② 십×일',en:'② \\text{tens×ones}',zh:'② 十×个'},{ko:'③ 일×십',en:'③ \\text{ones×tens}',zh:'③ 个×十'},{ko:'④ 일×일 (제일 작은 조각)',en:'④ \\text{ones×ones (smallest piece)}',zh:'④ 个×个（最小的一块）'}],
        result:{ko:'큰 물줄기부터 작은 물방울까지 — 순서가 정확함을 만들어요!',en:'From the big stream to the last droplet — order creates accuracy!',zh:'从大水流到小水滴——顺序造就准确！'},
        book:{ko:'②와 ③이 같은 크기 단위(십의 자리)라 서로 더하기 좋아요. 36×24에서 120+120=240처럼 가운데 두 줄을 먼저 합쳐도 돼요.',
              en:'Pieces ② and ③ share the same place size (tens), so they combine nicely — in 36×24 you may merge the middle rows first: 120+120=240.',
              zh:'②和③是同一位级(十位)，适合先合并——36×24中可先算中间两行120+120=240。'} },

      { tag:{ko:'③ 마지막 덧셈 요령',en:'3) Finishing the addition',zh:'③ 收尾加法技巧'},
        head:{ko:'600+120+120+24: 위에서부터 차례로',en:'600+120+120+24: from the top, in turn',zh:'600+120+120+24：从上往下依次加'},
        desc:{ko:'폭포 아래 고인 물을 모아요! <b>위에서부터 차례로</b>: 600+120=720 → 720+120=840 → 840+24=864. 이미 큰 순서로 쌓여 있으니 그대로 내려가며 더하면 돼요. 자릿수 예측(C-09)과 비교해 답을 확인하는 것도 잊지 말기!',
              en:'Collect the water pooled below! <b>From the top, in turn</b>: 600+120=720 → 720+120=840 → 840+24=864. The stack is already sorted big-to-small, so just descend and add. Don\'t forget to check against your digit prediction (C-09)!',
              zh:'收集瀑布下积的水！<b>从上往下依次</b>：600+120=720 → 720+120=840 → 840+24=864。已经按从大到小排好，顺着往下加就行。别忘了和位数预测(C-09)对照检查！'},
        mathSteps:['600 + 120 = 720','720 + 120 = 840','840 + 24 = 864'],
        result:{ko:'폭포 아래에서 모두 만나면 864! 예측 자릿수와 맞는지 확인.',en:'Everything meets at the bottom: 864! Verify the digit count.',zh:'瀑布下汇合得864！核对位数是否吻合。'},
        book:null }
    ],
    rule:{ ko:'① 십×십→십×일→일×십→일×일 순서로 한 줄씩  ② 줄을 세로로 가지런히  ③ 위에서부터 차례로 더하기',
      en:'① One line each: tens×tens→tens×ones→ones×tens→ones×ones  ② Keep lines vertically tidy  ③ Add from the top down',
      zh:'① 按十×十→十×个→个×十→个×个一行一行写  ② 竖向对齐  ③ 从上往下依次加' }
  },

  check:{
    fills:[
      { tex:'43 \\times 21 = \\square', answer:903,
        hint:{ ko:'800↓80↓60↓3 → 800+80+60+3=?', en:'800↓80↓60↓3 → 800+80+60+3=?', zh:'800↓80↓60↓3 → 800+80+60+3=？' } },
      { tex:'52 \\times 34 = \\square', answer:1768,
        hint:{ ko:'1500↓200↓60↓8 → 합은?', en:'1500↓200↓60↓8 → the sum?', zh:'1500↓200↓60↓8 → 和是多少？' } }
    ],
    open:{ ko:'폭포수 곱셈과 풀풀곱셈(C-10)의 같은 점과 다른 점을 설명해 봐요.',
      en:'Explain what waterfall multiplication shares with full-full (C-10) and how it differs.',
      zh:'说说瀑布乘法和全全乘法(C-10)的相同点和不同点。' },
    openHint:{ ko:'예) 같은 점: 네 조각(십×십, 십×일, 일×십, 일×일)이 완전히 같아요. 다른 점: 폭포수는 정해진 순서로 세로로 흘려 써서 조각을 잃지 않고 마지막에 한 번에 더해요.',
      en:'e.g. Same: the four pieces are identical. Different: waterfall writes them in a fixed vertical order so nothing is lost, adding once at the end.',
      zh:'例）相同：四块完全一样。不同：瀑布按固定顺序竖着写，不丢块，最后一次加完。' }
  },

  lab:{
    generator:'ml8_mul2d2d', level:'main', count:4,
    params:{ easy:false },
    intro:{
      ko:'폭포수 곱셈 마법! 부분곱을 순서대로 흘려 내려봐.',
      en:'Waterfall magic! Cascade the partial products in order.',
      zh:'瀑布乘法魔法！按顺序流下部分积。'
    }
  },

  arena:{
    generator:'ml8_mul2d2d', level:'main', count:8, timeLimit:360,
    params:{ easy:false },
    rule:{ ko:'6분 안에 폭포수 곱셈 문제를 모두 풀어요!', en:'Solve all waterfall problems in 6 minutes!', zh:'6分钟内解答所有瀑布乘法题！' }
  },

  stamp:{ label:{ ko:'폭포수 마법사', en:'Waterfall Wizard', zh:'瀑布魔法师' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'시원하게 흘렀어! 🌊',en:'Cascading nicely!',zh:'流得漂亮！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'십×십부터 순서대로!',en:'Start from tens×tens, in order!',zh:'从十×十开始按顺序！'}, {ko:'네 줄이 다 있는지 확인해봐!',en:'Check all four lines are there!',zh:'检查四行是否都在！'} ],
    finish:{ ko:'완벽해! 폭포수 마법사! 🌊✨', en:'Perfect! Waterfall Wizard!', zh:'完美！瀑布魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
