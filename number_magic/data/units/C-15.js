/* Numbers of Magic — 유닛 C-15: 자리이동 곱셈 (중급 D 챕터1) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-15'] = {
  id:'C-15', tier:'intermediate', level:'C', order:15,
  lineage:['place-magic'],
  generator:'ml_placeshift',
  title:{ ko:'자리이동 곱셈', en:'Place-Shift Multiplication', zh:'移位乘法' },
  subtitle:{ ko:'23×44: 23×4를 구한 뒤 한 칸 밀어 자기와 더해요!', en:'23×44: find 23×4, shift it one place, add to itself!', zh:'23×44：先算23×4，错开一位加自己！' },
  icon:'↔️',

  practice:{
    generator:'ml_placeshift', level:'practice', count:5,
    params:{},
    intro:{
      ko:'22, 33, 44처럼 같은 숫자가 반복되는 수를 곱할 때는 한 번만 곱하고 자리를 밀어서 더하면 돼! 준비됐지?',
      en:"When multiplying by repeated-digit numbers like 22, 33, 44 — multiply once, shift the place, and add! Ready?",
      zh:'乘22、33、44这种数字重复的数时，只乘一次，移位再相加就行！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 반복 숫자의 비밀',en:'1) The secret of repeated digits',zh:'① 重复数字的秘密'},
        head:{ko:'44 = 4×11 = 40+4',en:'44 = 4×11 = 40+4',zh:'44 = 4×11 = 40+4'},
        desc:{ko:'44, 33, 22 같은 수는 <b>같은 숫자가 두 자리에 반복</b>돼요. 그래서 23×44는 곱을 두 번 할 필요가 없어요! <b>23×4=92 한 번만</b> 구하면, 십의 자리 몫은 92를 한 칸 민 920. 즉 23×44 = 920+92 = <b>1012</b>.',
              en:'Numbers like 44, 33, 22 have <b>the same digit in both places</b>. So 23×44 doesn\'t need two different multiplications! Find <b>23×4=92 just once</b>; the tens part is 92 shifted one place: 920. So 23×44 = 920+92 = <b>1012</b>.',
              zh:'44、33、22这类数<b>两个数位是同一个数字</b>。所以23×44不需要乘两次！只算<b>一次23×4=92</b>，十位部分就是92移一位的920。所以23×44 = 920+92 = <b>1012</b>。'},
        mathSteps:['23 × 44','23×4 = 92 (한 번만!)','92×10 + 92 = 920+92','= 1012'],
        result:{ko:'23×44=1012! 한 번 곱하고, 밀고, 더하면 끝.',en:'23×44=1012! Multiply once, shift, add — done.',zh:'23×44=1012！乘一次、移位、相加，完成。'},
        book:{ko:'원리: a×44 = a×4×11 = (a×4)×10 + (a×4). 반복 숫자 수는 "숫자×11"이라서 ×11 마법(C-13)의 자리이동과 똑같은 구조예요.',
              en:'Principle: a×44 = a×4×11 = (a×4)×10 + (a×4). Repeated-digit numbers are "digit×11", the same shift-and-add structure as the ×11 magic (C-13).',
              zh:'原理：a×44 = a×4×11 = (a×4)×10 + (a×4)。重复数字数就是"数字×11"，和×11魔法(C-13)的移位结构一样。'} },

      { tag:{ko:'② 밀어서 더하는 기술',en:'2) The shift-and-add technique',zh:'② 移位相加技术'},
        head:{ko:'92 + 920: 자리를 맞춰 더해요',en:'92 + 920: add with places aligned',zh:'92 + 920：对齐数位相加'},
        desc:{ko:'"한 칸 밀기"는 <b>×10</b>이에요. 92를 한 칸 밀면 920. 이제 <b>920+92</b>만 남았어요: 920+90=1010, 1010+2=1012. 밀어서 더할 때 자리를 잘 맞추는 게 핵심 — 십은 십끼리, 일은 일끼리!',
              en:'"Shifting one place" means <b>×10</b>. Shift 92 to get 920. Now just <b>920+92</b>: 920+90=1010, 1010+2=1012. The key is keeping places aligned — tens with tens, ones with ones!',
              zh:'"移一位"就是<b>×10</b>。92移位得920。剩下<b>920+92</b>：920+90=1010，1010+2=1012。关键是对齐数位——十位对十位，个位对个位！'},
        mathSteps:['  9 2 0','+   9 2','= 1 0 1 2'],
        result:{ko:'자리만 잘 맞추면 덧셈 한 번! ×11 마법과 같은 원리예요.',en:'Align the places and it\'s one addition — same idea as the ×11 magic!',zh:'对齐数位就是一次加法——和×11魔法同一原理！'},
        book:{ko:'세 자리 반복(222, 333…)도 같아요: a×333 = (a×3)×100 + (a×3)×10 + (a×3). 두 번 밀어서 세 번 더하면 돼요.',
              en:'Three-digit repeats (222, 333…) work too: a×333 = (a×3)×100 + (a×3)×10 + (a×3) — shift twice, add three copies.',
              zh:'三位重复(222、333…)也一样：a×333 = (a×3)×100 + (a×3)×10 + (a×3)——移两次，加三份。'} },

      { tag:{ko:'③ 언제 이 마법을 쓸까?',en:'3) When to use this magic',zh:'③ 什么时候用这个魔法？'},
        head:{ko:'22·33·44·55·66·77·88·99가 보이면!',en:'Whenever you spot 22·33·44·55·66·77·88·99!',zh:'看到22·33·44·55·66·77·88·99就用！'},
        desc:{ko:'문제에서 <b>반복 숫자 수</b>를 발견하는 눈을 길러요. 31×55? → 31×5=155, 1550+155=1705. 12×77? → 12×7=84, 840+84=924. 일반 세로셈보다 곱셈 횟수가 절반! 어떤 도구를 언제 꺼내 쓸지 아는 것이 진짜 마법사예요.',
              en:'Train your eye to spot <b>repeated-digit numbers</b>. 31×55? → 31×5=155, then 1550+155=1705. 12×77? → 12×7=84, then 840+84=924. Half the multiplications of the column method! Knowing which tool to draw and when — that\'s a true wizard.',
              zh:'练出发现<b>重复数字数</b>的眼力。31×55？→ 31×5=155，1550+155=1705。12×77？→ 12×7=84，840+84=924。乘法次数是竖式的一半！知道何时用哪个工具，才是真正的魔法师。'},
        mathSteps:['31×55: 31×5=155','1550 + 155','= 1705'],
        result:{ko:'반복 숫자를 보면 자리이동! 곱셈이 절반으로 줄어요.',en:'See repeated digits → place-shift! Half the multiplying.',zh:'看到重复数字→移位！乘法减半。'},
        book:{ko:'고급 과정에서는 11×11, 111×111처럼 반복 숫자끼리 곱하면 파스칼의 삼각형을 닮은 피라미드 모양 숫자가 나온다는 걸 배워요.',
              en:'In the advanced course you\'ll see that multiplying two repeated-digit numbers (11×11, 111×111…) makes a pyramid-shaped number that mirrors Pascal\'s triangle.',
              zh:'在高级课程中会学到，两个重复数字的数相乘（11×11、111×111……）会出现像帕斯卡三角形一样的金字塔形数字。'} }
    ],
    rule:{ ko:'① 반복 숫자 수(22~99)인지 확인  ② 숫자 하나로 한 번만 곱하기  ③ 한 칸 밀어(×10) 원래 곱과 더하기',
      en:'① Spot a repeated-digit number (22–99)  ② Multiply by the single digit just once  ③ Shift one place (×10) and add the original',
      zh:'① 确认是重复数字数(22~99)  ② 只用单个数字乘一次  ③ 移一位(×10)加原积' }
  },

  check:{
    fills:[
      { tex:'21 \\times 33 = \\square', answer:693,
        hint:{ ko:'21×3=63 → 630+63=?', en:'21×3=63 → 630+63=?', zh:'21×3=63 → 630+63=？' } },
      { tex:'14 \\times 66 = \\square', answer:924,
        hint:{ ko:'14×6=84 → 840+84=?', en:'14×6=84 → 840+84=?', zh:'14×6=84 → 840+84=？' } }
    ],
    open:{ ko:'25×88을 자리이동 곱셈으로 풀고, 왜 곱셈을 한 번만 해도 되는지 설명해 봐요.',
      en:'Solve 25×88 by place-shift and explain why one multiplication suffices.',
      zh:'用移位乘法算25×88，并解释为什么只乘一次就够。' },
    openHint:{ ko:'예) 25×8=200. 88=80+8이니까 25×88 = 2000+200 = 2200. 십의 자리 8과 일의 자리 8이 같은 숫자라 25×8 하나로 두 조각을 다 만들 수 있어요.',
      en:'e.g. 25×8=200. Since 88=80+8, 25×88 = 2000+200 = 2200. Both digits are 8, so the single product 25×8 builds both pieces.',
      zh:'例）25×8=200。因为88=80+8，25×88 = 2000+200 = 2200。两个数位都是8，一个积25×8就能做出两块。' }
  },

  lab:{
    generator:'ml_placeshift', level:'main', count:4,
    params:{},
    intro:{
      ko:'자리이동 마법! 한 번 곱하고 밀어서 더해봐.',
      en:'Place-shift magic! Multiply once, shift, and add.',
      zh:'移位魔法！乘一次，移位，相加。'
    }
  },

  arena:{
    generator:'ml_placeshift', level:'main', count:8, timeLimit:300,
    params:{},
    rule:{ ko:'5분 안에 자리이동 문제를 모두 풀어요!', en:'Solve all place-shift problems in 5 minutes!', zh:'5分钟内解答所有移位题！' }
  },

  stamp:{ label:{ ko:'자리이동 달인', en:'Place-Shift Master', zh:'移位达人' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'스마트한 이동! ↔️',en:'Smart shift!',zh:'聪明的移位！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'한 자리 숫자로 먼저 곱해봐!',en:'Multiply by the single digit first!',zh:'先用单个数字乘！'}, {ko:'한 칸 민 것과 원래 것을 더해!',en:'Add the shifted and the original!',zh:'移位的和原来的相加！'} ],
    finish:{ ko:'완벽해! 자리이동 달인! ↔️✨', en:'Perfect! Place-Shift Master!', zh:'完美！移位达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
