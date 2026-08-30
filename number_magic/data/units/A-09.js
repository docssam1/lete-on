/* ============================================================
   Numbers of Magic — 유닛 데이터: A-09
   초급 C · 챕터1 "새치기 덧셈"
   창의수연 초급 C 실제 교재 내용 기반. generator=jumpAdd.
   핵심: 37+19+24+33 → (37+33)+(19+24) = 70+43 = 113
         62+15+68+32 → (62+68)+(15+32) = 130+47 = 177
   "더하기 쉬운 짝을 찾아 줄 앞으로 새치기시켜요!"
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-09'] = {
  id:'A-09', tier:'beginner', level:'A', order:9,
  generator:'jumpAdd',
  title:{ ko:'새치기 덧셈', en:'Jump the Queue Addition', zh:'插队加法' },
  subtitle:{ ko:'더하기 쉬운 짝을 찾아 순서를 바꿔 먼저 더해요', en:'Find easy pairs and let them jump to the front', zh:'找出好算的配对，让它们排到前面先加' },
  icon:'⚡',

  practice:{
    generator:'jumpAdd', level:'practice', count:5,
    intro:{
      ko:'준비 운동! 이 수와 더해서 10이 되는 새치기 짝꿍은 무엇일까요?',
      en:"Warm up! Which number jumps the queue to make 10 with this one?",
      zh:'热热身！哪个数和这个数凑成10，可以"插队"？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 순서를 바꿔도 답은 같아요', en:"1) Changing order doesn't change the answer", zh:'① 换顺序答案不变' },
        head:{ ko:'덧셈은 어떤 순서로 더해도 답이 같아요', en:'Addition gives the same answer no matter what order you add', zh:'加法不管用什么顺序，答案都一样' },
        desc:{ ko:'3+5와 5+3은 답이 같아요. 이걸 <b>교환법칙</b>이라고 해요. 여러 수를 더할 때도 순서를 마음대로 바꿀 수 있어요. 이 법칙 덕분에 더하기 쉬운 순서로 바꿔 계산할 수 있어요!',
               en:'3+5 and 5+3 give the same answer. This is called the commutative property. You can freely change the order when adding multiple numbers. This rule lets you pick the easiest order!',
               zh:'3+5和5+3答案相同。这叫做交换律。加多个数时，可以随意改变顺序。利用这个规律，可以选择最简单的顺序来算！' },
        mathSteps:['37 + 19 + 24 + 33',{ko:'순서를 바꿔도 답은 같아요',en:'\\text{Change the order — the answer stays the same}',zh:'换了顺序，答案也一样'},{ko:'= 37 + 33 + 19 + 24  (순서 변경 OK!)',en:'= 37 + 33 + 19 + 24 \\text{ (reorder OK!)}',zh:'= 37 + 33 + 19 + 24（可以换顺序！）'},{ko:'= ... 같은 답',en:'= ... \\text{same answer}',zh:'= ... 一样的答案'}],
        result:{ ko:'덧셈은 순서를 마음대로 바꿀 수 있어요! 이제 가장 쉬운 순서를 찾아봐요.', en:'Addition order can be changed freely! Now let\'s find the easiest order.', zh:'加法顺序可以随意改变！现在来找最简单的顺序。' },
        book:{ ko:'덧셈의 교환법칙: a+b = b+a. 세 수 이상도 마찬가지: a+b+c+d는 어떤 순서로도 같아요.',
               en:'Commutative law of addition: a+b = b+a. Same for 3 or more: a+b+c+d is the same in any order.',
               zh:'加法交换律：a+b = b+a。三个或更多数也一样：a+b+c+d无论什么顺序都相同。' } },

      { tag:{ ko:'② 더하기 쉬운 짝을 새치기시켜요', en:'2) Let easy pairs jump the queue', zh:'② 让好算的配对"插队"' },
        head:{ ko:'합이 10, 20, 30이 되는 짝을 찾아 먼저 더해요', en:'Find pairs that make 10, 20, or 30 — add them first', zh:'找出凑成10、20、30的配对，先加它们' },
        desc:{ ko:'37+19+24+33에서 어떤 짝이 더하기 쉬울까요? 37과 33! 7+3=10이라서 37+33=70이 돼요. 이 짝을 먼저 새치기시켜요!',
               en:'In 37+19+24+33, which pair is easiest to add? 37 and 33! Since 7+3=10, 37+33=70. Let this pair jump to the front!',
               zh:'37+19+24+33里，哪对最好算？37和33！因为7+3=10，所以37+33=70。让这对先"插队"！' },
        mathSteps:['37 + 19 + 24 + 33',{ko:'= (37 + 33) + (19 + 24)  ← 짝이 새치기!',en:'= (37 + 33) + (19 + 24) ← \\text{the pair cuts in line!}',zh:'= (37 + 33) + (19 + 24) ← 配对插队！'},'= 70 + 43','= 113'],
        result:{ ko:'37+19+24+33 = 113! 37과 33을 새치기시켰더니 70이 되어 쉬워졌어요!', en:'37+19+24+33 = 113! Letting 37+33 jump first gave us 70, making it easy!', zh:'37+19+24+33 = 113！让37+33先"插队"得到70，就简单了！' },
        book:{ ko:'62+15+68+32 → (62+68)+(15+32) = 130+47 = 177. 2+8=10이라서 62+68=130, 나머지 15+32=47.',
               en:'62+15+68+32 → (62+68)+(15+32) = 130+47 = 177. Since 2+8=10, 62+68=130; remaining 15+32=47.',
               zh:'62+15+68+32 → (62+68)+(15+32) = 130+47 = 177。因为2+8=10，62+68=130；剩下15+32=47。' } },

      { tag:{ ko:'③ 실전 — 어떤 짝이 새치기 자격?', en:'3) Which pairs deserve to jump?', zh:'③ 哪对配对有资格"插队"？' },
        head:{ ko:'더하면 딱 떨어지는 수가 나오는 짝이 새치기 자격!', en:'Pairs that make round numbers deserve to jump!', zh:'相加得到整数的配对有资格"插队"！' },
        desc:{ ko:'새치기 자격은 더했을 때 계산하기 쉬운 수(10, 20, 30, 40...)가 나오는 짝이에요. 일의 자리를 보고 합이 10이 되면 자격이 있어요. 두 자리 수도 마찬가지!',
               en:'A pair deserves to jump if adding them makes a round number (10, 20, 30, 40...). Check the ones digits: if they sum to 10, that pair qualifies. Same for two-digit numbers!',
               zh:'"插队"资格：相加得到整十数(10、20、30、40...)的配对。看个位之和是否为10——是的话就有资格。两位数也一样！' },
        mathSteps:['23 + 45 + 17 + 35',{ko:'일의 자리: 3+7=10 (23,17 짝 → 새치기!), 5+5=10 (45,35 짝 → 새치기!)',en:'\\text{ones: } 3+7=10 \\text{ (23,17 pair → cut in!)}, 5+5=10 \\text{ (45,35 pair → cut in!)}',zh:'个位：3+7=10（23,17凑对→插队！），5+5=10（45,35凑对→插队！）'},'= (23+17) + (45+35)','= 40 + 80 = 120'],
        result:{ ko:'23+45+17+35 = 120! 두 쌍이 새치기해서 순식간에 풀었어요.', en:'23+45+17+35 = 120! Two pairs jumped and we solved it in a flash.', zh:'23+45+17+35 = 120！两对配对"插队"，一瞬间就解了。' },
        book:null }
    ],
    rule:{ ko:'① 더했을 때 딱 떨어지는 수(10, 20, 30...)가 나오는 짝을 찾는다  ② 그 짝을 먼저 새치기시켜 더한다  ③ 나머지를 더한다',
      en:'① Find pairs that make round numbers (10, 20, 30...)  ② Let those pairs jump to the front and add first  ③ Add the rest.',
      zh:'①找出相加得到整十数(10、20、30...)的配对 ②让这些配对"插队"先加 ③再加其余的数。' }
  },

  check:{
    fills:[
      { tex:'37 + 19 + 24 + 33 = (37 + \\square) + (19 + 24)', answer:33,
        hint:{ ko:'37의 일의 자리는 7. 7+?=10이 되는 일의 자리를 가진 수를 찾아봐요!', en:'Ones of 37 is 7. Find the number whose ones digit makes 7+?=10!', zh:'37的个位是7。找个位让7+?=10的那个数！' } },
      { tex:'62 + 15 + 68 + 32 = 130 + \\square', answer:47,
        hint:{ ko:'(62+68)=130. 남은 15+32=?', en:'(62+68)=130. Remaining: 15+32=?', zh:'(62+68)=130。剩下15+32=？' } }
    ],
    open:{
      ko:'새치기 덧셈이 통하지 않는 경우도 있을까요? 어떤 상황에서는 새치기할 짝이 없을까요?',
      en:'Are there situations where jump-the-queue addition doesn\'t work? When might there be no pairs to jump?',
      zh:'有没有"插队加法"不管用的情况？什么情况下找不到可以"插队"的配对？'
    },
    openHint:{
      ko:'예) 모든 수의 일의 자리가 1, 2, 3처럼 작거나 다 다른 홀수면 합이 10이 되는 짝을 찾기 어려울 수 있어요. 그럴 때는 다른 방법(끼리끼리 더하기 등)을 써요!',
      en:'e.g. If all numbers have small or odd ones digits (1, 2, 3...) with no matching pairs, finding 10-pairs is hard. Then use other methods like place-value grouping!',
      zh:'例）如果所有数的个位都是1、2、3这样的小数或不同的奇数，就很难找到凑十的配对。这时用其他方法（比如同位相加）！'
    }
  },

  lab:{
    generator:'jumpAdd', level:'main', count:4,
    intro:{
      ko:'이제 진짜 마법! 새치기할 짝을 찾아 먼저 더해봐요.',
      en:"Real magic! Find the queue-jumping pairs and add them first.",
      zh:'真正的魔法！找出可以"插队"的配对，先加它们。'
    }
  },

  arena:{
    generator:'jumpAdd', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한 많이! 짝을 새치기시켜 빠르게 풀어요!', en:'As many as you can in 5 minutes — let the pairs jump and solve fast!', zh:'5分钟内尽量多做！让配对"插队"，快速解题！' }
  },

  stamp:{ label:{ ko:'새치기 마법사', en:'Queue Jumper', zh:'插队魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'새치기 성공! ⚡',en:'Queue jump success!',zh:'插队成功！'}, {ko:'순서 변경 마법! 🪄',en:'Reorder magic works!',zh:'换顺序魔法成功！'} ],
    wrong:[ {ko:'음~ 일의 자리가 합해서 10이 되는 짝을 새치기시켜봐!',en:'Hmm — find the pair whose ones digits sum to 10 and let them jump!',zh:'嗯，找个位之和为10的配对，让它们"插队"！'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 새치기 마법사야 ⚡✨', en:"Perfect! You're a Queue Jumper now!", zh:'完美！你现在是插队魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
