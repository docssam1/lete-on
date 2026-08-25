/* Numbers of Magic — 유닛 C-35: 분수→소수 변환 (중급 창의전략 8단계 · 계보1 '2와 5는 친구' 완성) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-35'] = {
  id:'C-35', tier:'intermediate', level:'C', order:35,
  generator:'fr8_frDec',
  lineage:['ten-friends'],
  title:{ ko:'분수→소수 변환', en:'Fraction to Decimal', zh:'分数化小数' },
  subtitle:{ ko:'분모 속 2와 5를 찾아 부풀리면 분수가 소수로 변신해요', en:'Find the hidden 2s and 5s and inflate the denominator to turn a fraction into a decimal', zh:'找到分母里的2和5，把它变大，分数就变成小数了' },
  icon:'✨',

  practice:{
    generator:'fr8_frDec', level:'practice', count:5,
    params:{},
    intro:{
      ko:'2와 5는 친구야. 분모 속에 숨은 2와 5를 찾아 짝을 채워 주면, 분수가 소수로 짠! 하고 변신해. 준비됐지?',
      en:'2 and 5 are friends. Find the hidden 2s and 5s in the denominator, fill in the missing partner, and the fraction transforms into a decimal! Ready?',
      zh:'2和5是朋友。找到藏在分母里的2和5，配齐它们的搭档，分数就会变身成小数！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 분모를 부풀리자',en:'1) Inflate the denominator',zh:'① 把分母变大'},
        head:{ko:'1/5 = 2/10 = 0.2',en:'1/5 = 2/10 = 0.2',zh:'1/5 = 2/10 = 0.2'},
        desc:{ko:'<b>분모를 10, 100, 1000으로 부풀리자!</b> 5에 2를 곱하면 10, 25에 4를 곱하면 100 — 분모 속에 숨은 2와 5를 찾아 짝을 채워 주면 분수가 소수로 변신해. <b>1/5 = 2/10 = 0.2</b>, <b>4/25 = 16/100 = 0.16</b>.',
              en:'<b>Inflate the denominator to 10, 100, or 1000!</b> Multiply 5 by 2 to get 10; multiply 25 by 4 to get 100 — find the hidden 2s and 5s in the denominator, fill in the missing partner, and the fraction turns into a decimal. <b>1/5 = 2/10 = 0.2</b>, <b>4/25 = 16/100 = 0.16</b>.',
              zh:'<b>把分母变大到10、100或1000！</b>5乘以2得10，25乘以4得100——找到藏在分母里的2和5，配齐它们的搭档，分数就变成小数了。<b>1/5 = 2/10 = 0.2</b>，<b>4/25 = 16/100 = 0.16</b>。'},
        mathSteps:['1/5','× (2/2)','= 2/10','= 0.2'],
        result:{ko:'분모·분자에 똑같은 수를 곱하면 값은 그대로, 모양만 바뀌어요!',en:'Multiply top and bottom by the same number — the value stays the same, only the look changes!',zh:'分子分母同乘一个数，值不变，样子变了！'},
        book:{ko:'부풀리기 짝: 5→×2(10) · 25→×4(100) · 125→×8(1000) · 2→×5(10) · 4→×25(100) · 8→×125(1000). 전부 2와 5의 짝이에요.',
              en:'Inflation partners: 5→×2(10) · 25→×4(100) · 125→×8(1000) · 2→×5(10) · 4→×25(100) · 8→×125(1000). All are pairs of 2 and 5.',
              zh:'扩大搭档：5→×2(10)·25→×4(100)·125→×8(1000)·2→×5(10)·4→×25(100)·8→×125(1000)。全都是2和5的搭档。'} },

      { tag:{ko:'② 분모가 더 클 때',en:'2) When the denominator is bigger',zh:'② 分母更大时'},
        head:{ko:'3/8 = 375/1000 = 0.375',en:'3/8 = 375/1000 = 0.375',zh:'3/8 = 375/1000 = 0.375'},
        desc:{ko:'8=2×2×2는 2가 세 번! 그래서 1000(=2×2×2×5×5×5)을 만들려면 5를 세 번 곱해야 해요: 8×125=1000. 그래서 3/8 = (3×125)/(8×125) = 375/1000 = <b>0.375</b>.',
              en:'8=2×2×2 has three 2s! To make 1000(=2×2×2×5×5×5) you need to multiply by 5 three times: 8×125=1000. So 3/8 = (3×125)/(8×125) = 375/1000 = <b>0.375</b>.',
              zh:'8=2×2×2有三个2！要凑成1000(=2×2×2×5×5×5)就要乘三次5：8×125=1000。所以3/8 = (3×125)/(8×125) = 375/1000 = <b>0.375</b>。'},
        mathSteps:['3/8','× (125/125)','= 375/1000','= 0.375'],
        result:{ko:'2가 몇 번 숨어 있는지 세면, 몇 배로 부풀려야 할지 바로 알 수 있어요!',en:'Count how many 2s are hidden, and you instantly know how much to inflate by!',zh:'数一数藏了几个2，马上就知道要放大几倍！'},
        book:null },

      { tag:{ko:'③ 이 계보의 끝',en:'3) The end of this lineage',zh:'③ 这条家族的终点'},
        head:{ko:'10 → 100 → 1000, 그리고 소수까지',en:'10 → 100 → 1000, and now decimals',zh:'10 → 100 → 1000，最后到小数'},
        desc:{ko:'2×5=10, 4×25=100, 8×125=1000 — 곱셈의 쌍이었던 게, 이제는 분모를 부풀리는 열쇠가 됐어요. 분모의 소인수가 2와 5뿐이면, 언제나 10·100·1000으로 부풀려서 소수로 바꿀 수 있어요. 이것이 <b>2와 5는 친구</b> 계보의 완성이에요!',
              en:'2×5=10, 4×25=100, 8×125=1000 — the multiplication pairs are now the key to inflating denominators. If a denominator\'s only prime factors are 2 and 5, it can always be inflated to 10, 100, or 1000 and turned into a decimal. This completes the "2 and 5 are friends" lineage!',
              zh:'2×5=10，4×25=100，8×125=1000——曾经的乘法配对，现在变成了扩大分母的钥匙。只要分母的质因数只有2和5，就总能扩大成10、100或1000，变成小数。这就是"2和5是朋友"这条家族的完成！'},
        mathSteps:['2×5=10','4×25=100','8×125=1000','\\Rightarrow 분수 = 소수'],
        result:{ko:'2와 5는 처음부터 끝까지 계속 친구였어요!',en:'2 and 5 were friends from beginning to end!',zh:'2和5从头到尾都是朋友！'},
        book:null }
    ],
    rule:{ ko:'① 분모 속에 숨은 2와 5 찾기  ② 10·100·1000이 되도록 짝 곱하기  ③ 분자에도 똑같이 곱해 소수로 읽기',
      en:'① Find the hidden 2s and 5s in the denominator  ② Multiply by the missing partner to reach 10, 100, or 1000  ③ Multiply the numerator the same way and read it as a decimal',
      zh:'① 找出分母里藏着的2和5  ② 乘上搭档凑成10、100或1000  ③ 分子同样处理，读成小数' }
  },

  check:{
    fills:[
      { tex:'\\frac{3}{4} = \\square \\; (\\times 100 \\text{ 한 값})', answer:75,
        hint:{ ko:'4×25=100. 3×25=?', en:'4×25=100. 3×25=?', zh:'4×25=100。3×25=？' } },
      { tex:'\\frac{7}{20} = \\square \\; (\\times 100 \\text{ 한 값})', answer:35,
        hint:{ ko:'20×5=100. 7×5=?', en:'20×5=100. 7×5=?', zh:'20×5=100。7×5=？' } }
    ],
    open:{ ko:'2/25를 소수로 바꿔 봐요. 분모를 몇 배로 부풀려야 할까요?',
      en:'Convert 2/25 to a decimal. How much do you need to inflate the denominator by?',
      zh:'把2/25化成小数。分母要放大几倍？' },
    openHint:{ ko:'25×4=100이니까 4배! 2/25=(2×4)/(25×4)=8/100=0.08.',
      en:'25×4=100, so ×4! 2/25=(2×4)/(25×4)=8/100=0.08.',
      zh:'25×4=100，所以是×4！2/25=(2×4)/(25×4)=8/100=0.08。' }
  },

  lab:{
    generator:'fr8_frDec', level:'main', count:4,
    params:{},
    intro:{
      ko:'분모 속 2와 5를 찾아서 10·100·1000으로 부풀려봐!',
      en:'Find the 2s and 5s in the denominator and inflate to 10, 100, or 1000!',
      zh:'找到分母里的2和5，扩大成10、100或1000！'
    }
  },

  arena:{
    generator:'fr8_frDec', level:'main', count:8, timeLimit:300,
    params:{},
    rule:{ ko:'5분 안에 분수→소수 변환 문제를 모두 풀어요!', en:'Solve all fraction-to-decimal problems in 5 minutes!', zh:'5分钟内解答所有分数化小数题！' }
  },

  stamp:{ label:{ ko:'분수→소수 달인', en:'Fraction-to-Decimal Master', zh:'分数化小数达人' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'변신 성공! 🔮',en:'Transformation complete!',zh:'变身成功！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'분모 속 2와 5를 찾아봐!',en:'Find the 2s and 5s in the denominator!',zh:'找找分母里的2和5！'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 분수→소수 달인! ✨🔮', en:'Perfect! Fraction-to-Decimal Master!', zh:'完美！分数化小数达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
