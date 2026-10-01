/* Numbers of Magic — 유닛 M-149: 여러 가지 수열의 합 (고등 대수 · 과정 68, 2026-09-29)
   근거: docs/high-build-spec.md MD149. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-149'] = {
  id:'M-149', tier:'algebra', level:'68', order:149,
  generator:'md149_seriesSum',
  title:{ ko:'여러 가지 수열의 합', en:'Sums of Special Sequences', zh:'各种数列的求和' },
  subtitle:{ ko:'가운데가 지워지는 합', en:'Sums whose middles vanish', zh:'中间会消去的和' },
  icon:'🧩',

  practice:{
    generator:'md149_seriesSum', level:'practice', count:6,
    params:{mode:'frac'},
    intro:{
      ko:'한 항을 두 분수의 차로 나누면 가운데 항이 지워집니다. 약분한 합의 분모가 보이면 분자를, n 을 묻으면 n 을 답합니다.',
      en:'Split each term into a difference of two fractions so the middle terms cancel. If the reduced denominator is shown, give the numerator; if n is asked, give n.',
      zh:'把每项拆成两个分数之差，中间的项消去。若给出约分后的分母就答分子，问n就答n。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'1/(1·2)+1/(2·3)+…+1/(9·10) 을 하나씩 통분하면 끝이 없습니다. 그런데 각 항을 1/k−1/(k+1) 로 나누면 앞뒤가 차례로 지워지고 1−1/10 만 남습니다. 지워지는 모양을 만드는 세 가지 방법을 익힙니다.',
        en:'Adding 1/(1·2)+1/(2·3)+…+1/(9·10) with common denominators takes forever. But writing each term as 1/k−1/(k+1), neighbours cancel and only 1−1/10 remains. We learn three ways to make terms cancel.',
        zh:'1/(1·2)+1/(2·3)+…+1/(9·10)逐个通分没完没了。但把每项写成1/k−1/(k+1)，前后依次消去，只剩1−1/10。我们来学三种让项相消的方法。' }
    },
    stages:[
      { tag:{ko:'① 부분분수',en:'1) Partial fractions',zh:'① 拆项'},
        head:{ko:'\\sum_{k=1}^{9}\\frac{1}{k(k+1)}=1-\\frac{1}{10}=\\frac{9}{10}',en:'\\sum_{k=1}^{9}\\frac{1}{k(k+1)}=1-\\frac{1}{10}=\\frac{9}{10}',zh:'\\sum_{k=1}^{9}\\frac{1}{k(k+1)}=1-\\frac{1}{10}=\\frac{9}{10}'},
        desc:{ko:'(1−½)+(½−⅓)+…+(1/9−1/10) 에서 가운데가 모두 지워져 <b>9/10</b> 입니다.',en:'In (1−½)+(½−⅓)+…+(1/9−1/10), everything in the middle cancels, leaving <b>9/10</b>.',zh:'(1−½)+(½−⅓)+…+(1/9−1/10)中间全部消去，得<b>9/10</b>。'},
        mathSteps:['\\frac{1}{k(k+1)}=\\frac{1}{k}-\\frac{1}{k+1}','1-\\frac{1}{10}'],
        result:{ko:'처음과 끝만 남는다!',en:'Only the first and last remain!',zh:'只剩首尾！'},
        book:{ko:'1/((2k−1)(2k+1)) 처럼 두 인수의 차가 2 이면 ½(1/(2k−1)−1/(2k+1)) 로 ½ 이 붙습니다.',en:'When the factors differ by 2, as in 1/((2k−1)(2k+1)), it becomes ½(1/(2k−1)−1/(2k+1)), with a ½.',zh:'像1/((2k−1)(2k+1))那样两因式相差2时，化为½(1/(2k−1)−1/(2k+1))，带一个½。'} },

      { tag:{ko:'② 분모의 유리화',en:'2) Rationalizing',zh:'② 分母有理化'},
        head:{ko:'\\sum_{k=1}^{24}\\frac{1}{\\sqrt{k+1}+\\sqrt{k}}=\\sqrt{25}-1=4',en:'\\sum_{k=1}^{24}\\frac{1}{\\sqrt{k+1}+\\sqrt{k}}=\\sqrt{25}-1=4',zh:'\\sum_{k=1}^{24}\\frac{1}{\\sqrt{k+1}+\\sqrt{k}}=\\sqrt{25}-1=4'},
        desc:{ko:'유리화하면 √(k+1)−√k 이므로 (√2−1)+(√3−√2)+…+(√25−√24)=<b>4</b> 입니다.',en:'Rationalized, each term is √(k+1)−√k, so (√2−1)+(√3−√2)+…+(√25−√24)=<b>4</b>.',zh:'有理化后每项为√(k+1)−√k，所以(√2−1)+(√3−√2)+…+(√25−√24)=<b>4</b>。'},
        mathSteps:['\\frac{1}{\\sqrt{k+1}+\\sqrt{k}}=\\sqrt{k+1}-\\sqrt{k}','\\sqrt{25}-\\sqrt{1}'],
        result:{ko:'근호도 차례로 지워진다!',en:'Square roots cancel in turn too!',zh:'根号也依次消去！'},
        book:{ko:'끝이 제곱수(25)가 되도록 항의 개수를 잡으면 답이 자연수가 됩니다.',en:'Choosing the number of terms so the end is a perfect square (25) makes the answer a whole number.',zh:'选取项数使末端为平方数(25)，答案就是自然数。'} },

      { tag:{ko:'③ (등차)×(등비)',en:'3) (Arithmetic)×(geometric)',zh:'③ (等差)×(等比)'},
        head:{ko:'S=\\sum_{k=1}^{5}k\\cdot2^{k}:\\ S-2S=(2+2^2+\\cdots+2^5)-5\\cdot2^{6}=-258',en:'S=\\sum_{k=1}^{5}k\\cdot2^{k}:\\ S-2S=(2+2^2+\\cdots+2^5)-5\\cdot2^{6}=-258',zh:'S=\\sum_{k=1}^{5}k\\cdot2^{k}:\\ S-2S=(2+2^2+\\cdots+2^5)-5\\cdot2^{6}=-258'},
        desc:{ko:'2S 를 한 칸 밀어 빼면 62−320=−258 이므로 S=<b>258</b> 입니다.',en:'Subtracting 2S shifted one place gives 62−320=−258, so S=<b>258</b>.',zh:'错开一位减去2S，得62−320=−258，所以S=<b>258</b>。'},
        mathSteps:['S-2S=2+2^2+\\cdots+2^5-5\\cdot2^6','S=258'],
        result:{ko:'공비를 곱해 한 칸 밀기!',en:'Multiply by the ratio and shift one place!',zh:'乘公比再错开一位！'},
        book:{ko:'공비가 3 이면 3S 를 밀어 뺍니다. 빼고 나면 가운데는 언제나 등비수열입니다.',en:'With ratio 3, subtract 3S shifted. After subtracting, the middle is always a geometric series.',zh:'公比为3时错开减去3S。相减后中间总是等比数列。'} }
    ],
    rule:{ ko:'① 1/(AB)=(1/(B−A))(1/A−1/B)  ② 1/(√(k+1)+√k)=√(k+1)−√k  ③ S−rS 로 등비수열의 합',
      en:'① 1/(AB)=(1/(B−A))(1/A−1/B)  ② 1/(√(k+1)+√k)=√(k+1)−√k  ③ Use S−rS to get a geometric sum',
      zh:'① 1/(AB)=(1/(B−A))(1/A−1/B)  ② 1/(√(k+1)+√k)=√(k+1)−√k  ③ 用S−rS化成等比数列的和' }
  },

  check:{
    fills:[
      { tex:{ko:'\\sum_{k=1}^{4}\\frac{1}{k(k+1)}=\\frac{\\square}{5}',en:'\\sum_{k=1}^{4}\\frac{1}{k(k+1)}=\\frac{\\square}{5}',zh:'\\sum_{k=1}^{4}\\frac{1}{k(k+1)}=\\frac{\\square}{5}'}, answer:4,
        hint:{ko:'1−1/5',en:'1−1/5',zh:'1−1/5'} },
      { tex:{ko:'\\sum_{k=1}^{8}\\frac{1}{\\sqrt{k+1}+\\sqrt{k}}=\\square',en:'\\sum_{k=1}^{8}\\frac{1}{\\sqrt{k+1}+\\sqrt{k}}=\\square',zh:'\\sum_{k=1}^{8}\\frac{1}{\\sqrt{k+1}+\\sqrt{k}}=\\square'}, answer:2,
        hint:{ko:'√9−1',en:'√9−1',zh:'√9−1'} }
    ],
    open:{ ko:'부분분수로 나눈 합에서 처음과 끝만 남는 까닭을 설명해 봅니다.',
      en:'Explain why only the first and last parts remain in a partial-fraction sum.',
      zh:'说说为什么拆项求和时只剩首尾。' },
    openHint:{ ko:'k 번째 항의 −1/(k+1) 과 (k+1) 번째 항의 +1/(k+1) 이 서로 지워집니다. 짝이 없는 것은 맨 앞의 1/1 과 맨 뒤의 −1/(n+1) 뿐입니다.',
      en:'The −1/(k+1) of the kth term cancels the +1/(k+1) of the (k+1)th. Only the very first 1/1 and the very last −1/(n+1) have no partner.',
      zh:'第k项的−1/(k+1)与第(k+1)项的+1/(k+1)相消。没有配对的只有最前面的1/1和最后面的−1/(n+1)。' }
  },

  lab:{
    generator:'md149_seriesSum', level:'main', count:6,
    params:{mode:'root'},
    intro:{
      ko:'분모에 근호가 있는 항은 유리화해 √(k+1)−√k 꼴로 바꾸고, 합이 주어지면 거꾸로 n 을 구합니다.',
      en:'Rationalize terms with roots in the denominator into √(k+1)−√k; given the sum, work back to n.',
      zh:'分母含根号的项有理化成√(k+1)−√k的形式；给出和时反求n。'
    }
  },

  arena:{
    generator:'md149_seriesSum', level:'main', count:6, timeLimit:420,
    params:{mode:'ag'},
    rule:{ ko:'7분 안에 (등차)×(등비) 꼴의 합을 모두 구합니다!', en:'Find every (arithmetic)×(geometric) sum within 7 minutes!', zh:'7分钟内求出所有(等差)×(等比)型的和！' }
  },

  stamp:{ label:{ ko:'소거 마법사', en:'Cancellation Wizard', zh:'消项魔法师' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'가운데가 싹 지워졌어! 🧩',en:'The middle vanished completely!',zh:'中间全消掉了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'앞 항의 뒷부분과 뒤 항의 앞부분을 짝지어 봐!',en:'Pair the end of each term with the start of the next!',zh:'把前项的后半与后项的前半配对！'}, {ko:'두 인수의 차로 나눴는지 봐!',en:'Did you divide by the difference of the factors?',zh:'除以两因式的差了吗？'} ],
    finish:{ ko:'완벽해! 소거 마법사! 🧩✨', en:'Perfect! Cancellation Wizard!', zh:'完美！消项魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
