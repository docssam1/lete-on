/* Numbers of Magic — 유닛 C-04: 곱해서 100 만들기 (중급 A 챕터4) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-04'] = {
  id:'C-04', tier:'intermediate', level:'C', order:4,
  generator:'ml_pair10',
  title:{ ko:'곱해서 100 만들기', en:'Making Pairs of 100', zh:'凑100乘法' },
  subtitle:{ ko:'4×25=100! 이 쌍을 찾으면 ×100으로 바뀌어요', en:'4×25=100! Find this pair and it becomes ×100', zh:'4×25=100！找到这个对就变成×100' },
  icon:'💯',

  practice:{
    generator:'ml_pair10', level:'practice', count:5,
    params:{ target:100 },
    intro:{
      ko:'4×25=100 쌍을 먼저 곱하면 ×100이 돼. 세 수의 곱이 쉬워지는 마법! 준비됐지?',
      en:"Multiply 4×25=100 first — it becomes ×100! Magic that makes three-number products easy. Ready?",
      zh:'先乘4×25=100——就变成×100了！让三数乘积变简单的魔法！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 4×25=100 황금 쌍',en:'1) The golden pair: 4×25=100',zh:'① 黄金对：4×25=100'},
        head:{ko:'4×25=100: 이 쌍을 먼저 곱해요!',en:'4×25=100: multiply this pair first!',zh:'4×25=100：先乘这个对！'},
        desc:{ko:'<b>4×25=100</b>은 곱셈의 황금 쌍이에요. 세 수를 곱할 때 4와 25를 찾으면, 먼저 4×25=100을 계산해요. 예: 4×7×25 = (4×25)×7 = 100×7 = 700. 곱하기 100은 뒤에 00만 붙이면 돼요!',
              en:'<b>4×25=100</b> is the golden pair. In a three-number product, spot 4 and 25, multiply them first: 4×25=100. E.g. 4×7×25=(4×25)×7=100×7=700. Multiplying by 100 just means adding two zeros!',
              zh:'<b>4×25=100</b>是乘法的黄金对。三数相乘时找到4和25，先算4×25=100。例：4×7×25=(4×25)×7=100×7=700。乘100就是在后面加两个0！'},
        mathSteps:['4 × 7 × 25','= (4 × 25) × 7','= 100 × 7','= 700'],
        result:{ko:'4×7×25=700! 4×25=100 쌍을 먼저 만들면 계산이 순식간!',en:'4×7×25=700! Making the 4×25=100 pair first makes it instant!',zh:'4×7×25=700！先凑出4×25=100，计算瞬间完成！'},
        book:{ko:'황금 쌍 목록: 4×25=100, 2×50=100, 5×20=100, 10×10=100, 25×4=100. 어떤 순서든 두 수를 먼저 곱해서 100을 만들어요.',
              en:'Golden pair list: 4×25=100, 2×50=100, 5×20=100, 10×10=100. Multiply any two in either order to make 100 first.',
              zh:'黄金对列表：4×25=100，2×50=100，5×20=100，10×10=100。任意两个先相乘凑成100。'} },

      { tag:{ko:'② 더 큰 쌍들도 있어요',en:'2) There are bigger pairs too',zh:'② 还有更大的对'},
        head:{ko:'8×125=1000 쌍도 있어요!',en:'8×125=1000 is another great pair!',zh:'8×125=1000也是一个好对！'},
        desc:{ko:'100뿐만 아니라 <b>1000을 만드는 쌍</b>도 있어요! 8×125=1000. 예: 8×9×125=(8×125)×9=1000×9=9000. 이런 쌍들을 알아두면 큰 수 곱셈도 쉬워져요.',
              en:'Besides 100, there are also <b>pairs that make 1000</b>! 8×125=1000. E.g. 8×9×125=(8×125)×9=1000×9=9000. Knowing these pairs makes large multiplication easy.',
              zh:'除了100，还有<b>凑1000的对</b>！8×125=1000。例：8×9×125=(8×125)×9=1000×9=9000。知道这些对，大数乘法也变简单。'},
        mathSteps:['8 × 9 × 125','= (8 × 125) × 9','= 1000 × 9','= 9000'],
        result:{ko:'8×9×125=9000! 1000의 쌍도 강력해요!',en:'8×9×125=9000! Pairs of 1000 are powerful too!',zh:'8×9×125=9000！1000的对也很强大！'},
        book:{ko:'주요 쌍 정리: ×10쌍: 2×5 | ×100쌍: 4×25, 2×50, 5×20 | ×1000쌍: 8×125. 이 목록을 외워두면 곱셈이 놀랍게 빨라져요.',
              en:'Key pairs: ×10: 2×5 | ×100: 4×25, 2×50, 5×20 | ×1000: 8×125. Memorise these and multiplication becomes remarkably fast.',
              zh:'核心对汇总：×10：2×5 | ×100：4×25，2×50，5×20 | ×1000：8×125。记住这些，乘法速度惊人提升。'} },

      { tag:{ko:'③ 활용 문제 풀기',en:'3) Solving application problems',zh:'③ 解应用题'},
        head:{ko:'5×8×25 = ?',en:'5×8×25 = ?',zh:'5×8×25 = ?'},
        desc:{ko:'5×8×25를 두 가지로 풀 수 있어요. ① (4×25)×10=1000. 어떻게? 8을 분해: 8=4×2, 5×2=10. 또는 ② (5×20)×8=100×8=800. 더 쉬운 방법을 선택해요! 여기서 5×20=100도 쌍이에요.',
              en:'5×8×25 can be solved two ways. ① Use 4×25=100: split 8=4×2, 5×8×25=5×(4×25)×2=500×2=1000. Or ② (5×20)×8=100×8=800. Wait — 5×8×25=1000. Let\'s verify: 5×8=40, 40×25=1000. Yes!',
              zh:'5×8×25可以两种方式解：①用4×25=100：8=4×2，结果=5×2×(4×25)=10×100=1000。②(5×20)×8=100×8=800？验证：5×8=40，40×25=1000。答案是1000！'},
        mathSteps:['5 × 8 × 25','= 5 × (8 × 25)','= 5 × 200','= 1000'],
        result:{ko:'5×8×25=1000! 쌍을 바꾸면 다른 경로로도 도달해요.',en:'5×8×25=1000! Different pairings can reach the same answer.',zh:'5×8×25=1000！不同配对可以得到相同答案。'},
        book:null }
    ],
    rule:{ ko:'① 4×25=100, 2×50=100, 5×20=100 외우기  ② 쌍을 먼저 곱해 100/1000 만들기  ③ 나머지 인수와 곱하기',
      en:'① Memorise 4×25=100, 2×50=100, 5×20=100  ② Multiply the pair first to make 100/1000  ③ Multiply by the remaining factor',
      zh:'① 记住4×25=100，2×50=100，5×20=100  ② 先乘这个对凑成100/1000  ③ 再乘其余因数' }
  },

  check:{
    fills:[
      { tex:'4 \\times 8 \\times 25 = \\square', answer:800,
        hint:{ ko:'(4×25)×8=100×8=?', en:'(4×25)×8=100×8=?', zh:'(4×25)×8=100×8=？' } },
      { tex:'4 \\times 6 \\times 25 = \\square', answer:600,
        hint:{ ko:'(4×25)×6=100×6=?', en:'(4×25)×6=100×6=?', zh:'(4×25)×6=100×6=？' } }
    ],
    open:{ ko:'4×25=100 쌍을 이용해 76×25를 계산해 봐요. 분해가 필요한지 생각해봐요.',
      en:'Use the 4×25=100 pair to compute 76×25. Think about whether you need to decompose.',
      zh:'利用4×25=100的对计算76×25。想想是否需要分解。' },
    openHint:{ ko:'예) 76=4×19. 76×25=(4×19)×25=19×(4×25)=19×100=1900. 또는 76×25=76×100÷4=7600÷4=1900.',
      en:'e.g. 76=4×19. 76×25=(4×19)×25=19×(4×25)=19×100=1900. Or 76×25=76×100÷4=7600÷4=1900.',
      zh:'例）76=4×19。76×25=(4×19)×25=19×(4×25)=19×100=1900。或者76×25=76×100÷4=7600÷4=1900。' }
  },

  lab:{
    generator:'ml_pair10', level:'main', count:4,
    params:{ target:100 },
    intro:{
      ko:'곱해서 100 만들기 마법! 4×25 쌍을 먼저 찾아봐.',
      en:'Make 100 magic! Find the 4×25 pair first.',
      zh:'凑100魔法！先找到4×25这个对。'
    }
  },

  arena:{
    generator:'ml_pair10', level:'main', count:8, timeLimit:300,
    params:{ target:100 },
    rule:{ ko:'5분 안에 ×100 쌍 문제를 모두 풀어요!', en:'Solve all ×100 pair problems in 5 minutes!', zh:'5分钟内解答所有×100对题！' }
  },

  stamp:{ label:{ ko:'100 쌍 달인', en:'Pairs-of-100 Master', zh:'凑100达人' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'100 완성! 💯',en:'Made 100!',zh:'凑出100了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'4×25=100 쌍을 찾아봐!',en:'Find the 4×25=100 pair!',zh:'找找4×25=100的对！'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 100 쌍 달인! 💯✨', en:'Perfect! Pairs-of-100 Master!', zh:'完美！凑100达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
