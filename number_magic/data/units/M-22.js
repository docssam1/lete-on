/* Numbers of Magic — 유닛 M-22: 곱셈공식의 확장 (고등 W11 · 공통수학1 다항식 · 계보5 '자리의 마법' 연장) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-22'] = {
  id:'M-22', tier:'highmath1', level:'36', order:22,
  lineage:['place-magic'],
  generator:'md22_cubeFormula',
  title:{ ko:'곱셈공식의 확장', en:'Expanding Multiplication Formulas', zh:'乘法公式的展开' },
  subtitle:{ ko:'(x+a)³ = x³+3ax²+3a²x+a³ — 가운데는 3배, 끝은 세제곱', en:'(x+a)³ = x³+3ax²+3a²x+a³ — the middle terms triple, the last one cubes', zh:'(x+a)³ = x³+3ax²+3a²x+a³——中间乘3，末尾立方' },
  icon:'🧊',

  practice:{
    generator:'md22_cubeFormula', level:'practice', count:5,
    params:{mode:'basic'},
    intro:{
      ko:'(x+2)³을 하나하나 세 번 곱하지 않아도, 계수 패턴 3a, 3a², a³만 알면 바로 답이 나와요!',
      en:'You don\'t need to multiply (x+2)³ out three times — just know the pattern 3a, 3a², a³ and the answer comes right away!',
      zh:'不用把(x+2)³一项项乘三次——只要知道3a、3a²、a³这个系数规律，答案马上就出来！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'(x+2)²는 x²+4x+4로 이미 알아요. 그럼 한 번 더 곱한 (x+2)³은요? 매번 괄호를 세 번 곱해 펼치기엔 너무 번거로워요 — 패턴이 있지 않을까요?',
        en:'You already know (x+2)²=x²+4x+4. But what about one more multiplication, (x+2)³? Expanding three brackets every time is tedious — isn\'t there a pattern?',
        zh:'(x+2)²=x²+4x+4你已经知道了。那再乘一次的(x+2)³呢？每次都展开三个括号太麻烦——难道没有规律吗？' },
      history:{ ko:'세제곱 공식은 이차식 곱셈공식의 자연스러운 확장이에요. 괄호를 하나씩 분배해서 곱하는 원리 자체는 변하지 않고, 계수만 "1, 3, 3, 1"이라는 규칙적인 패턴으로 나타나요.',
        en:'The cube formula is a natural extension of the quadratic multiplication formulas. The underlying principle — distributing each bracket — never changes; only the coefficients settle into the regular pattern "1, 3, 3, 1".',
        zh:'立方公式是二次乘法公式的自然延伸。逐个分配括号相乘的原理没有变，只是系数呈现出"1、3、3、1"这样规律的模式。' }
    },
    stages:[
      { tag:{ko:'① (x+a)³ = x³+3ax²+3a²x+a³',en:'1) (x+a)³ = x³+3ax²+3a²x+a³',zh:'① (x+a)³ = x³+3ax²+3a²x+a³'},
        head:{ko:'(x+2)^3 = x^3+6x^2+12x+8',en:'(x+2)^3 = x^3+6x^2+12x+8',zh:'(x+2)^3 = x^3+6x^2+12x+8'},
        desc:{ko:'a=2일 때 3a=6, 3a²=12, a³=8 — 계수 자리에 그대로 넣으면 <b>x³+6x²+12x+8</b>이 돼요. (x+2)²=x²+4x+4에 (x+2)를 한 번 더 곱해도 같은 결과가 나와요.',
              en:'With a=2: 3a=6, 3a²=12, a³=8 — plug them right into the coefficient slots to get <b>x³+6x²+12x+8</b>. Multiplying (x+2)²=x²+4x+4 by (x+2) once more gives the same result.',
              zh:'a=2时：3a=6，3a²=12，a³=8——直接代入系数位置得<b>x³+6x²+12x+8</b>。把(x+2)²=x²+4x+4再乘一次(x+2)，结果一样。'},
        mathSteps:['(x+2)^3=(x+2)^2(x+2)', '=(x^2+4x+4)(x+2)', '=x^3+6x^2+12x+8'],
        result:{ko:'가운데 두 항은 3배, 마지막 항은 세제곱!',en:'The two middle terms triple, the last term cubes!',zh:'中间两项乘3，最后一项立方！'},
        book:{ko:'(x+a)³=x³+3ax²+3a²x+a³, (x-a)³=x³-3ax²+3a²x-a³ — a의 부호를 그대로 대입하면 둘 다 같은 공식이에요.',
              en:'(x+a)³=x³+3ax²+3a²x+a³ and (x-a)³=x³-3ax²+3a²x-a³ — substitute a\'s sign as-is and both come from one formula.',
              zh:'(x+a)³=x³+3ax²+3a²x+a³，(x-a)³=x³-3ax²+3a²x-a³——原样代入a的符号，两者其实是同一个公式。'} },

      { tag:{ko:'② 합·차의 세제곱 공식',en:'2) Sum/difference of cubes',zh:'② 立方和差公式'},
        head:{ko:'x^3+8 = (x+2)(x^2-2x+4)',en:'x^3+8 = (x+2)(x^2-2x+4)',zh:'x^3+8 = (x+2)(x^2-2x+4)'},
        desc:{ko:'(x+2)(x²-2x+4)를 직접 펼쳐 보면 가운데 항들이 모두 사라지고 <b>x³+8</b>만 남아요. x³-a³도 부호만 바뀐 짝꿍 공식이에요.',
              en:'Expand (x+2)(x²-2x+4) directly and all the middle terms cancel, leaving only <b>x³+8</b>. x³-a³ is the sign-flipped sibling formula.',
              zh:'直接展开(x+2)(x²-2x+4)，中间项全部抵消，只剩下<b>x³+8</b>。x³-a³是符号相反的姊妹公式。'},
        mathSteps:['(x+2)(x^2-2x+4)', '=x^3-2x^2+4x+2x^2-4x+8', '=x^3+8'],
        result:{ko:'세제곱의 합·차는 이 짝꿍 인수분해로 정리돼요!',en:'A sum or difference of cubes always resolves into this factored pair!',zh:'立方和或立方差总能化成这一对因式！'},
        book:{ko:'x³+a³=(x+a)(x²-ax+a²), x³-a³=(x-a)(x²+ax+a²) — 부호가 앞뒤로 엇갈려요.',
              en:'x³+a³=(x+a)(x²-ax+a²) and x³-a³=(x-a)(x²+ax+a²) — the signs alternate front to back.',
              zh:'x³+a³=(x+a)(x²-ax+a²)，x³-a³=(x-a)(x²+ax+a²)——符号前后交替。'} }
    ],
    rule:{ ko:'① (x+a)³=x³+3ax²+3a²x+a³(가운데 3배, 끝 세제곱)  ② x³±a³=(x±a)(x²∓ax+a²)(합·차의 세제곱)',
      en:'① (x+a)³=x³+3ax²+3a²x+a³ (middle terms triple, last cubes)  ② x³±a³=(x±a)(x²∓ax+a²) (sum/difference of cubes)',
      zh:'① (x+a)³=x³+3ax²+3a²x+a³(中间乘3，末尾立方)  ② x³±a³=(x±a)(x²∓ax+a²)(立方和差)' }
  },

  check:{
    fills:[
      { tex:'(x+1)^3 = x^3 + \\square x^2 + \\square x + \\square', answer:[3,3,1],
        hint:{ ko:'a=1: 3a=3, 3a²=3, a³=1', en:'a=1: 3a=3, 3a²=3, a³=1', zh:'a=1：3a=3，3a²=3，a³=1' } },
      { tex:'x^3 - 1 = (x - \\square)(x^2 + \\square x + \\square)', answer:[1,1,1],
        hint:{ ko:'a=1: x³-a³=(x-a)(x²+ax+a²)', en:'a=1: x³-a³=(x-a)(x²+ax+a²)', zh:'a=1：x³-a³=(x-a)(x²+ax+a²)' } }
    ],
    open:{ ko:'(x-3)³을 전개하는 과정을 설명해봐요.',
      en:'Explain how to expand (x-3)³.',
      zh:'说说展开(x-3)³的过程。' },
    openHint:{ ko:'a=-3: 3a=-9, 3a²=27, a³=-27 → x³-9x²+27x-27',
      en:'a=-3: 3a=-9, 3a²=27, a³=-27 → x³-9x²+27x-27',
      zh:'a=-3：3a=-9，3a²=27，a³=-27 → x³-9x²+27x-27' }
  },

  lab:{
    generator:'md22_cubeFormula', level:'main', count:4,
    params:{mode:'signed'},
    intro:{
      ko:'이번엔 a가 음수일 수도 있어! 부호까지 그대로 공식에 대입해봐.',
      en:'This time a can be negative! Substitute the sign right into the formula.',
      zh:'这次a也可能是负数！把符号原样代入公式。'
    }
  },

  arena:{
    generator:'md22_cubeFormula', level:'main', count:8, timeLimit:300,
    params:{mode:'sumCubeFormula'},
    rule:{ ko:'5분 안에 합·차의 세제곱 공식을 모두 확인해요!', en:'Confirm all the sum/difference-of-cubes formulas in 5 minutes!', zh:'5分钟内确认所有立方和差公式！' }
  },

  stamp:{ label:{ ko:'세제곱 공식가', en:'Cube Formula Master', zh:'立方公式大师' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'1, 3, 3, 1 패턴을 정확히 봤구나! 🧊',en:'You spotted the 1, 3, 3, 1 pattern perfectly!',zh:'精准看出了1、3、3、1的规律！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'가운데 두 항은 3배, 마지막 항은 세제곱이야!',en:'The two middle terms triple, the last term cubes!',zh:'中间两项乘3，最后一项立方！'}, {ko:'a의 부호까지 그대로 공식에 넣어야 해!',en:'Substitute the sign of a exactly as it is!',zh:'要把a的符号原样代入公式！'} ],
    finish:{ ko:'완벽해! 세제곱 공식가! 🧊✨', en:'Perfect! Cube Formula Master!', zh:'完美！立方公式大师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
