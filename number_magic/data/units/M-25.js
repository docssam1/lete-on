/* Numbers of Magic — 유닛 M-25: 인수분해 심화 (고등 W11 · 공통수학1 다항식 · 계보5 '자리의 마법' 연장) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-25'] = {
  id:'M-25', tier:'highmath1', level:'37', order:25,
  lineage:['place-magic'],
  generator:'md25_factorAdvanced',
  title:{ ko:'인수분해 심화', en:'Advanced Factoring', zh:'因式分解进阶' },
  subtitle:{ ko:'곱셈공식을 거꾸로 읽고, 치환으로 낯선 식을 익숙한 모양으로', en:'Read multiplication formulas backward, and substitute to turn unfamiliar shapes familiar', zh:'把乘法公式反着读，用换元把陌生的式子变熟悉' },
  icon:'🧩',

  practice:{
    generator:'md25_factorAdvanced', level:'practice', count:5,
    params:{mode:'sumCube'},
    intro:{
      ko:'x³+27을 인수분해하고 싶다면? 27=3³이니 합의 세제곱 공식 x³+a³=(x+a)(x²-ax+a²)을 거꾸로 쓰면 돼요.',
      en:'Want to factor x³+27? Since 27=3³, just use the sum-of-cubes formula x³+a³=(x+a)(x²-ax+a²) backward.',
      zh:'想因式分解x³+27？因为27=3³，反着用立方和公式x³+a³=(x+a)(x²-ax+a²)就行。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'x²+bx+c 인수분해는 이제 익숙해요. 그런데 x³+27이나 x⁴+5x²+6처럼 차수가 더 높은 식은 어떻게 인수분해할까요? 아는 공식으로 되돌릴 방법이 있을까요?',
        en:'Factoring x²+bx+c is familiar by now. But what about higher-degree expressions like x³+27 or x⁴+5x²+6? Is there a way to turn them back into formulas you already know?',
        zh:'因式分解x²+bx+c你已经很熟悉了。但x³+27或x⁴+5x²+6这种更高次的式子怎么办？有没有办法把它们变回已知的公式？' },
      history:{ ko:'인수분해 심화는 두 가지 무기를 새로 꺼내요. 하나는 곱셈공식을 거꾸로 읽는 것(합·차의 세제곱), 다른 하나는 낯선 문자를 새 문자 t로 바꿔치기하는 것(치환) — 둘 다 "이미 아는 모양으로 바꾸기"라는 같은 전략이에요.',
        en:'Advanced factoring brings out two new tools: reading a multiplication formula backward (sum/difference of cubes), and swapping an unfamiliar expression for a new letter t (substitution) — both share the same strategy of "turning it into a shape you already know."',
        zh:'因式分解进阶要拿出两件新武器：把乘法公式反着读(立方和差)，以及把陌生的式子换成新字母t(换元)——两者都是"变成已知形状"这同一个策略。' }
    },
    stages:[
      { tag:{ko:'① 합의 세제곱 공식을 거꾸로',en:'1) The sum-of-cubes formula, backward',zh:'① 反过来用立方和公式'},
        head:{ko:'x^3+27 = (x+3)(x^2-3x+9)',en:'x^3+27 = (x+3)(x^2-3x+9)',zh:'x^3+27 = (x+3)(x^2-3x+9)'},
        desc:{ko:'27=3³이니 a=3. 공식 x³+a³=(x+a)(x²-ax+a²)에 그대로 넣으면 <b>(x+3)(x²-3x+9)</b>. 전개해서 검산하면 가운데 항들이 다시 사라지고 x³+27로 돌아와요.',
              en:'27=3³, so a=3. Plug directly into x³+a³=(x+a)(x²-ax+a²) to get <b>(x+3)(x²-3x+9)</b>. Expanding back to check, the middle terms cancel again and it returns to x³+27.',
              zh:'27=3³，所以a=3。直接代入x³+a³=(x+a)(x²-ax+a²)得<b>(x+3)(x²-3x+9)</b>。展开验算，中间项再次抵消，回到x³+27。'},
        mathSteps:['27=3^3', 'x^3+3^3=(x+3)(x^2-3x+3^2)', '=(x+3)(x^2-3x+9)'],
        result:{ko:'세제곱수를 찾으면 합·차의 세제곱 공식을 거꾸로 쓸 수 있어요!',en:'Spot the cube, and you can run the sum/difference-of-cubes formula backward!',zh:'找到立方数，就能把立方和差公式反过来用！'},
        book:{ko:'x³+a³=(x+a)(x²-ax+a²), x³-a³=(x-a)(x²+ax+a²) — 곱셈공식(MD22)의 짝꿍 인수분해예요.',
              en:'x³+a³=(x+a)(x²-ax+a²), x³-a³=(x-a)(x²+ax+a²) — the factored counterpart of the multiplication formulas (MD22).',
              zh:'x³+a³=(x+a)(x²-ax+a²)，x³-a³=(x-a)(x²+ax+a²)——是乘法公式(MD22)的因式分解版本。'} },

      { tag:{ko:'② 치환으로 낯선 식을 익숙하게',en:'2) Substitute to make it familiar',zh:'② 用换元变熟悉'},
        head:{ko:'x^4+5x^2+6 = (x^2+2)(x^2+3)',en:'x^4+5x^2+6 = (x^2+2)(x^2+3)',zh:'x^4+5x^2+6 = (x^2+2)(x^2+3)'},
        desc:{ko:'x²를 t로 바꿔 보면 t²+5t+6 — 더해서 5, 곱해서 6인 두 수는 2와 3이에요. t=x²를 다시 대입하면 <b>(x²+2)(x²+3)</b>.',
              en:'Substitute x² as t: t²+5t+6 — two numbers that add to 5 and multiply to 6 are 2 and 3. Substitute t=x² back in to get <b>(x²+2)(x²+3)</b>.',
              zh:'把x²换成t：t²+5t+6——相加得5、相乘得6的两个数是2和3。把t=x²代回去就是<b>(x²+2)(x²+3)</b>。'},
        mathSteps:['t=x^2:\\;t^2+5t+6', '=(t+2)(t+3)', '=(x^2+2)(x^2+3)'],
        result:{ko:'x²를 하나의 문자 t로 보면 이미 아는 인수분해로 돌아가요!',en:'Treat x² as a single letter t, and it turns back into factoring you already know!',zh:'把x²看成一个字母t，就变回你已经会的因式分解！'},
        book:{ko:'복잡한 식은 반복되는 덩어리를 새 문자로 치환하면 낯익은 모양이 되는 경우가 많아요.',
              en:'A complicated expression often turns familiar once you substitute its repeating chunk with a new letter.',
              zh:'复杂的式子只要把重复出现的部分换成新字母，往往就会变得眼熟。'} }
    ],
    rule:{ ko:'① 세제곱수를 찾으면 x³±a³=(x±a)(x²∓ax+a²)  ② x²를 t로 치환해 t²+bt+c로 바꾼 뒤 원래대로 되돌리기',
      en:'① Spot a cube: x³±a³=(x±a)(x²∓ax+a²)  ② Substitute x²=t to get t²+bt+c, then substitute back',
      zh:'① 找到立方数：x³±a³=(x±a)(x²∓ax+a²)  ② 把x²换成t变成t²+bt+c，再换回去' }
  },

  check:{
    fills:[
      { tex:'x^3 - 8 = (x - \\square)(x^2 + \\square x + \\square)', answer:[2,2,4],
        hint:{ ko:'8=2³, a=2', en:'8=2³, a=2', zh:'8=2³，a=2' } },
      { tex:'x^4 + 3x^2 + 2 = (x^2 + \\square)(x^2 + \\square)', answer:[1,2],
        hint:{ ko:'t=x²로 치환: t²+3t+2=(t+1)(t+2)', en:'substitute t=x²: t²+3t+2=(t+1)(t+2)', zh:'令t=x²：t²+3t+2=(t+1)(t+2)' } }
    ],
    open:{ ko:'x⁴+7x²+12을 치환으로 인수분해하는 과정을 설명해봐요.',
      en:'Explain how to factor x⁴+7x²+12 using substitution.',
      zh:'说说用换元法因式分解x⁴+7x²+12的过程。' },
    openHint:{ ko:'t=x²: t²+7t+12=(t+3)(t+4) → (x²+3)(x²+4)',
      en:'t=x²: t²+7t+12=(t+3)(t+4) → (x²+3)(x²+4)',
      zh:'t=x²：t²+7t+12=(t+3)(t+4) → (x²+3)(x²+4)' }
  },

  lab:{
    generator:'md25_factorAdvanced', level:'main', count:4,
    params:{mode:'diffCube'},
    intro:{
      ko:'이번엔 차의 세제곱! x³-a³=(x-a)(x²+ax+a²) 공식을 써봐.',
      en:'Difference of cubes this time! Use x³-a³=(x-a)(x²+ax+a²).',
      zh:'这次是立方差！用x³-a³=(x-a)(x²+ax+a²)公式。'
    }
  },

  arena:{
    generator:'md25_factorAdvanced', level:'main', count:8, timeLimit:300,
    params:{mode:'quarticSub'},
    rule:{ ko:'5분 안에 치환을 이용한 사차식 인수분해를 모두 풀어요!', en:'Solve all the quartic-by-substitution factorings in 5 minutes!', zh:'5分钟内解答所有换元法四次式因式分解！' }
  },

  stamp:{ label:{ ko:'인수분해 마스터', en:'Factoring Master', zh:'因式分解大师' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'낯선 식을 익숙한 모양으로 바꿨구나! 🧩',en:'You turned an unfamiliar shape into a familiar one!',zh:'把陌生的式子变成了熟悉的形状！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'세제곱수를 찾아서 합·차의 세제곱 공식을 써봐!',en:'Spot the cube and use the sum/difference-of-cubes formula!',zh:'找到立方数，用立方和差公式！'}, {ko:'x²를 t로 치환하면 이미 아는 인수분해로 돌아가!',en:'Substitute x² as t and it turns back into familiar factoring!',zh:'把x²换成t就变回熟悉的因式分解！'} ],
    finish:{ ko:'완벽해! 인수분해 마스터! 🧩✨', en:'Perfect! Factoring Master!', zh:'完美！因式分解大师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
