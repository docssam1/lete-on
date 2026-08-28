/* Numbers of Magic — 유닛 M-17: 제곱근의 곱셈과 나눗셈 (중등 W10 · 중3 제곱근과 실수) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-17'] = {
  id:'M-17', tier:'middle3', level:'35', order:17,
  generator:'md17_sqrtMulDiv',
  title:{ ko:'제곱근의 곱셈과 나눗셈', en:'Multiplying & Dividing Square Roots', zh:'平方根的乘除法' },
  subtitle:{ ko:'근호끼리는 안에 있는 수를 먼저 곱하거나 나눠요', en:'Between two roots, combine what\'s inside first', zh:'两个根号之间，先把里面的数相乘或相除' },
  icon:'💧',

  practice:{
    generator:'md17_sqrtMulDiv', level:'practice', count:5,
    params:{mode:'mul'},
    intro:{
      ko:'√2×√8 = √(2×8) = √16 = 4. 근호 안의 수끼리 먼저 곱하고 나서 정리해요!',
      en:'√2×√8 = √(2×8) = √16 = 4. Multiply what\'s inside the roots first, then simplify!',
      zh:'√2×√8 = √(2×8) = √16 = 4。先把根号内的数相乘，再化简！'
    }
  },

  discover:{
    story:{
      hook:{ ko:'√2 × √3은 √6일까요? 왜 그렇게 되는지 설명할 수 있나요?',
        en:'Is √2 × √3 equal to √6? Can you say why?',
        zh:'√2×√3等于√6吗？你能说出为什么吗？' },
      history:{ ko:'피타고라스 학파는 모든 길이를 분수로 나타낼 수 있다고 믿었어요. 그런데 한 변이 1인 정사각형의 대각선을 제곱하면 2가 되고, 그 길이는 어떤 분수로도 나타낼 수 없었어요. 이 비밀을 밖으로 알린 히파소스가 바다에 던져졌다는 이야기가 전해져요 — 사실인지는 아무도 몰라요.',
        en:'The Pythagoreans believed every length could be written as a fraction. But the diagonal of a unit square squares to 2, and no fraction gives that length. Legend says Hippasus was thrown into the sea for revealing the secret — no one knows whether it really happened.',
        zh:'毕达哥拉斯学派相信一切长度都能写成分数。可是边长为1的正方形，其对角线的平方是2，而这个长度写不成任何分数。传说希帕索斯因泄露这个秘密被投入大海——真假无人知晓。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 곱셈은 안의 수끼리 먼저',en:'1) Multiply what\'s inside first',zh:'① 相乘先合并根号内的数'},
        head:{ko:'\\sqrt{3}\\times\\sqrt{12}=\\sqrt{36}=6',en:'\\sqrt{3}\\times\\sqrt{12}=\\sqrt{36}=6',zh:'\\sqrt{3}\\times\\sqrt{12}=\\sqrt{36}=6'},
        desc:{ko:'근호끼리의 곱셈은 <b>근호 안의 수를 먼저 곱한 뒤</b> 하나의 근호로 합쳐요: √a×√b=√(ab). 3×12=36이고 36은 완전제곱수라 √36=6으로 정리돼요.',
              en:'To multiply two roots, <b>multiply what\'s inside first</b>, then combine into one root: √a×√b=√(ab). 3×12=36, and since 36 is a perfect square, √36 simplifies to 6.',
              zh:'两个根号相乘时，<b>先把根号内的数相乘</b>，再合成一个根号：√a×√b=√(ab)。3×12=36，而36是完全平方数，所以√36化简为6。'},
        mathSteps:['\\sqrt3\\times\\sqrt{12}', '=\\sqrt{3\\times12}=\\sqrt{36}', '=6'],
        result:{ko:'근호끼리의 곱셈은 안의 수부터 합쳐요!',en:'Multiplying roots — combine what\'s inside first!',zh:'根号相乘，先合并根号内的数！'},
        book:{ko:'√a × √b = √(ab) (a,b≥0). 나눗셈도 같은 방식: √a ÷ √b = √(a÷b).',
              en:'√a × √b = √(ab) (a,b≥0). Division works the same way: √a ÷ √b = √(a÷b).',
              zh:'√a × √b = √(ab)(a,b≥0)。除法也是同样方式：√a ÷ √b = √(a÷b)。'} },

      { tag:{ko:'② 완전제곱수가 안 되면 근호 정리로',en:'2) If it\'s not a perfect square, simplify the radical',zh:'② 不是完全平方数就化简根号'},
        head:{ko:'\\sqrt{2}\\times\\sqrt{6}=\\sqrt{12}=2\\sqrt{3}',en:'\\sqrt{2}\\times\\sqrt{6}=\\sqrt{12}=2\\sqrt{3}',zh:'\\sqrt{2}\\times\\sqrt{6}=\\sqrt{12}=2\\sqrt{3}'},
        desc:{ko:'2×6=12는 완전제곱수가 아니에요. 이럴 땐 √12를 그대로 두지 말고, 이전 유닛에서 배운 <b>근호 정리</b>를 이어서 써요: 12=4×3 → √12=2√3.',
              en:'2×6=12 isn\'t a perfect square. In this case, don\'t leave √12 as it is — apply the <b>radical simplification</b> from the previous unit: 12=4×3 → √12=2√3.',
              zh:'2×6=12不是完全平方数。这时不要让√12就那样留着，要接着用上一单元学的<b>根号化简</b>：12=4×3 → √12=2√3。'},
        mathSteps:['\\sqrt2\\times\\sqrt6', '=\\sqrt{12}', '=2\\sqrt3'],
        result:{ko:'곱한 결과가 완전제곱수가 아니면 근호 정리까지 이어서 해요!',en:'If the product isn\'t a perfect square, continue on to simplify the radical!',zh:'相乘的结果不是完全平方数，就接着化简根号！'},
        book:{ko:'제곱근의 곱셈·나눗셈은 "안의 수 계산 → (필요하면) 근호 정리" 두 단계로 완성해요.',
              en:'Multiplying or dividing square roots finishes in two steps: "combine what\'s inside → simplify the radical if needed."',
              zh:'平方根的乘除法分两步完成："先算根号内的数 → (需要时)化简根号"。'} }
    ],
    rule:{ ko:'① 곱셈: √a×√b=√(ab)  ② 나눗셈: √a÷√b=√(a÷b)  ③ 완전제곱수가 아니면 근호 정리까지 이어서',
      en:'① Multiplication: √a×√b=√(ab)  ② Division: √a÷√b=√(a÷b)  ③ If not a perfect square, continue simplifying the radical',
      zh:'① 乘法：√a×√b=√(ab)  ② 除法：√a÷√b=√(a÷b)  ③ 不是完全平方数就接着化简根号' }
  },

  check:{
    fills:[
      { tex:'\\sqrt{5}\\times\\sqrt{5} = \\square', answer:5,
        hint:{ ko:'5×5=25, √25=5', en:'5×5=25, √25=5', zh:'5×5=25，√25=5' } },
      { tex:'\\sqrt{50}\\div\\sqrt{2} = \\square', answer:5,
        hint:{ ko:'50÷2=25, √25=5', en:'50÷2=25, √25=5', zh:'50÷2=25，√25=5' } }
    ],
    open:{ ko:'√6×√10은 어떻게 계산할까요?',
      en:'How do you compute √6×√10?',
      zh:'√6×√10怎么算？' },
    openHint:{ ko:'6×10=60=4×15 → √60=2√15',
      en:'6×10=60=4×15 → √60=2√15',
      zh:'6×10=60=4×15 → √60=2√15' }
  },

  lab:{
    generator:'md17_sqrtMulDiv', level:'main', count:4,
    params:{mode:'div'},
    intro:{
      ko:'나눗셈도 같은 방식! 안의 수를 먼저 나누고 정리해봐.',
      en:'Division works the same way! Divide what\'s inside first, then simplify.',
      zh:'除法也是一样！先把里面的数相除，再化简。'
    }
  },

  arena:{
    generator:'md17_sqrtMulDiv', level:'main', count:8, timeLimit:300,
    params:{mode:'mixed'},
    rule:{ ko:'5분 안에 근호가 남는 곱셈 문제를 모두 풀어요!', en:'Solve all the multiplications that leave a radical in 5 minutes!', zh:'5分钟内解答所有会剩下根号的乘法题！' }
  },

  stamp:{ label:{ ko:'근호 항해사', en:'Radical Navigator', zh:'根号航海家' }, coins:47 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'안의 수부터 계산하는 순서를 정확히 지켰어! 💧',en:'You followed the "inside first" order perfectly!',zh:'先算内部的顺序完全正确！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'근호 안의 수를 먼저 곱하거나 나눠봐!',en:'Multiply or divide what\'s inside the roots first!',zh:'先把根号内的数相乘或相除！'}, {ko:'완전제곱수가 아니면 근호 정리를 이어서 해봐!',en:'If it\'s not a perfect square, keep simplifying the radical!',zh:'不是完全平方数就接着化简根号！'} ],
    finish:{ ko:'완벽해! 근호 항해사! 💧✨', en:'Perfect! Radical Navigator!', zh:'完美！根号航海家！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
