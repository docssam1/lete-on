/* Numbers of Magic — 유닛 C-10: 풀풀곱셈법 (중급 C 챕터2) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-10'] = {
  id:'C-10', tier:'intermediate', level:'C', order:10,
  generator:'ml8_mul2d2d',
  title:{ ko:'풀풀곱셈법', en:'Full-Full Multiplication', zh:'全全乘法' },
  subtitle:{ ko:'두 자리×두 자리를 네 조각으로 모두 풀어 곱해요', en:'Fully expand a 2-digit × 2-digit product into four pieces', zh:'把两位数×两位数完全展开成四块相乘' },
  icon:'🌸',

  practice:{
    generator:'ml8_mul2d2d', level:'practice', count:5,
    params:{ easy:true },
    intro:{
      ko:'두 자리 수 곱셈을 조각조각 모두 풀어서 곱하는 풀풀곱셈이야. 먼저 쉬운 수로 연습하자! 준비됐지?',
      en:"Full-full multiplication expands a two-digit product into all its pieces. Let's start with easy numbers! Ready?",
      zh:'全全乘法把两位数乘法完全展开成小块。先用简单的数练习！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 네 조각으로 풀기',en:'1) Expanding into four pieces',zh:'① 展开成四块'},
        head:{ko:'23×45 = (20+3)×(40+5) → 조각 4개!',en:'23×45 = (20+3)×(40+5) → four pieces!',zh:'23×45 = (20+3)×(40+5)→四块！'},
        desc:{ko:'두 수를 <b>모두 풀어서(full)</b> 곱해요. 23×45 = (20+3)×(40+5). 각각 서로 곱하면 조각이 4개: <b>20×40=800, 20×5=100, 3×40=120, 3×5=15</b>. 모두 더하면 800+100+120+15=1035. 이렇게 하나도 빠짐없이 짝을 지어 곱하는 게 풀풀곱셈이에요!',
              en:'We <b>fully expand</b> both numbers. 23×45 = (20+3)×(40+5). Cross-multiplying gives four pieces: <b>20×40=800, 20×5=100, 3×40=120, 3×5=15</b>. Adding them all: 800+100+120+15=1035. Pairing every piece with every piece — that\'s full-full multiplication!',
              zh:'把两个数<b>完全展开</b>相乘。23×45 = (20+3)×(40+5)。互相交叉相乘得四块：<b>20×40=800，20×5=100，3×40=120，3×5=15</b>。全部相加：800+100+120+15=1035。每块和每块都配对相乘——这就是全全乘法！'},
        mathSteps:['(20+3) × (40+5)','= 800 + 100 + 120 + 15','= 1035'],
        result:{ko:'23×45=1035! 4조각을 모두 곱하고 더하면 돼요.',en:'23×45=1035! Multiply all four pieces and add.',zh:'23×45=1035！四块全乘再相加。'},
        book:{ko:'원리: (a+b)(c+d) = ac+ad+bc+bd. 분배법칙을 두 번 쓴 것이에요. 조각을 하나라도 빠뜨리면 답이 틀려요 — 4개인지 꼭 세어봐요!',
              en:'Principle: (a+b)(c+d) = ac+ad+bc+bd — the distributive law applied twice. Missing even one piece breaks the answer, so always count four!',
              zh:'原理：(a+b)(c+d) = ac+ad+bc+bd——分配律用两次。漏掉任何一块答案就错——一定要数够四块！'} },

      { tag:{ko:'② 격자 그림으로 보기',en:'2) Seeing it as a grid',zh:'② 用格子图理解'},
        head:{ko:'사각형을 넷으로 자른 넓이예요',en:'It\'s the area of a rectangle cut in four',zh:'就是切成四块的长方形面积'},
        desc:{ko:'가로 23, 세로 45인 직사각형을 상상해요. 가로를 20|3, 세로를 40|5로 자르면 <b>방이 4개</b> 생겨요: 20×40, 20×5, 3×40, 3×5. 전체 넓이 = 네 방의 넓이 합. 곱셈이 <b>넓이 그림</b>으로 보이면 절대 잊어버리지 않아요!',
              en:'Picture a 23-by-45 rectangle. Cutting the width into 20|3 and the height into 40|5 makes <b>four rooms</b>: 20×40, 20×5, 3×40, 3×5. Total area = sum of the four rooms. Once you see multiplication as an <b>area picture</b>, you never forget it!',
              zh:'想象一个23×45的长方形。宽切成20|3，高切成40|5，就有<b>四个房间</b>：20×40、20×5、3×40、3×5。总面积=四个房间面积之和。把乘法看成<b>面积图</b>就永远不会忘！'},
        mathSteps:['방1: 20×40=800','방2: 20×5=100','방3: 3×40=120','방4: 3×5=15 → 합 1035'],
        result:{ko:'곱셈 = 넓이! 네 방을 모두 더하면 전체 넓이.',en:'Multiplication = area! Add all four rooms for the total.',zh:'乘法=面积！四个房间加起来就是总面积。'},
        book:{ko:'이 격자 그림은 세로셈의 원리이기도 해요. 세로셈의 각 줄이 사실은 격자의 방들을 묶어 계산한 거예요.',
              en:'This grid is also why column multiplication works — each row of the column method groups some of these rooms.',
              zh:'这个格子图也是竖式乘法的原理——竖式的每一行其实就是把这些房间分组计算。'} },

      { tag:{ko:'③ 빠르게: 큰 조각부터',en:'3) Speed: biggest piece first',zh:'③ 提速：从大块开始'},
        head:{ko:'800 → 100 → 120 → 15 순서로 더해요',en:'Add in order: 800 → 100 → 120 → 15',zh:'按800→100→120→15的顺序加'},
        desc:{ko:'네 조각을 더할 때는 <b>큰 것부터</b>: 800+100=900, 900+120=1020, 1020+15=1035. 큰 조각부터 더하면 답의 크기가 일찍 보여서 자릿수 예측(C-09)과도 딱 맞는지 확인할 수 있어요.',
              en:'When adding the four pieces, go <b>biggest first</b>: 800+100=900, 900+120=1020, 1020+15=1035. Starting big reveals the answer\'s size early — and you can check it against your digit prediction (C-09)!',
              zh:'加四块时<b>从大到小</b>：800+100=900，900+120=1020，1020+15=1035。先加大块能早看出答案大小——还能和位数预测(C-09)对照检查！'},
        mathSteps:['800 + 100 = 900','900 + 120 = 1020','1020 + 15 = 1035'],
        result:{ko:'큰 조각부터 차곡차곡! 예측한 자릿수와 맞는지 확인.',en:'Stack from the biggest! Check against your predicted digits.',zh:'从大块开始叠加！和预测的位数核对。'},
        book:null }
    ],
    rule:{ ko:'① 두 수를 십+일로 모두 풀기  ② 조각 4개를 빠짐없이 곱하기  ③ 큰 조각부터 더하기',
      en:'① Fully expand both numbers into tens+ones  ② Multiply all four pieces — miss none  ③ Add from the biggest piece',
      zh:'① 两个数都拆成十位+个位  ② 四块一个不漏地相乘  ③ 从大块开始加' }
  },

  check:{
    fills:[
      { tex:'32 \\times 41 = \\square', answer:1312,
        hint:{ ko:'30×40+30×1+2×40+2×1 = 1200+30+80+2=?', en:'30×40+30×1+2×40+2×1 = 1200+30+80+2=?', zh:'30×40+30×1+2×40+2×1 = 1200+30+80+2=？' } },
      { tex:'24 \\times 13 = \\square', answer:312,
        hint:{ ko:'20×10+20×3+4×10+4×3 = 200+60+40+12=?', en:'20×10+20×3+4×10+4×3 = 200+60+40+12=?', zh:'20×10+20×3+4×10+4×3 = 200+60+40+12=？' } }
    ],
    open:{ ko:'21×34를 격자 그림으로 그려서 네 방의 넓이를 각각 구하고 합쳐 봐요.',
      en:'Draw 21×34 as a grid, find each of the four rooms\' areas, and add them.',
      zh:'把21×34画成格子图，分别求四个房间的面积再相加。' },
    openHint:{ ko:'예) 20×30=600, 20×4=80, 1×30=30, 1×4=4. 합계 600+80+30+4=714.',
      en:'e.g. 20×30=600, 20×4=80, 1×30=30, 1×4=4. Total 600+80+30+4=714.',
      zh:'例）20×30=600，20×4=80，1×30=30，1×4=4。合计600+80+30+4=714。' }
  },

  lab:{
    generator:'ml8_mul2d2d', level:'main', count:4,
    params:{ easy:false },
    intro:{
      ko:'풀풀곱셈 마법! 네 조각을 빠짐없이 곱하고 더해봐.',
      en:'Full-full magic! Multiply all four pieces and add.',
      zh:'全全乘法魔法！四块一个不漏地乘再加。'
    }
  },

  arena:{
    generator:'ml8_mul2d2d', level:'main', count:8, timeLimit:360,
    params:{ easy:false },
    rule:{ ko:'6분 안에 풀풀곱셈 문제를 모두 풀어요!', en:'Solve all full-full problems in 6 minutes!', zh:'6分钟内解答所有全全乘法题！' }
  },

  stamp:{ label:{ ko:'풀풀 마법사', en:'Full-Full Wizard', zh:'全全魔法师' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'네 조각 완성! 🌸',en:'All four pieces!',zh:'四块齐了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'조각이 4개 다 있는지 세어봐!',en:'Count — do you have all four pieces?',zh:'数一数，四块都有吗？'}, {ko:'큰 조각부터 더해봐!',en:'Add from the biggest piece!',zh:'从大块开始加！'} ],
    finish:{ ko:'완벽해! 풀풀 마법사! 🌸✨', en:'Perfect! Full-Full Wizard!', zh:'完美！全全魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
