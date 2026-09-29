/* Numbers of Magic — 유닛 M-129: 역함수 (고등 공통수학2 · 과정 57 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD129. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-129'] = {
  id:'M-129', tier:'highmath2', level:'57', order:129,
  generator:'md129_inverse',
  title:{ ko:'역함수', en:'Inverse Functions', zh:'反函数' },
  subtitle:{ ko:'출력에서 입력을 거꾸로 찾아갑니다', en:'Walk back from the output to the input', zh:'由输出倒推输入' },
  icon:'🔄',

  practice:{
    generator:'md129_inverse', level:'practice', count:6,
    params:{mode:'value'},
    intro:{
      ko:'f⁻¹(k) 를 구할 때는 역함수의 식을 만들지 않고 f(a)=k 인 a 를 찾습니다.',
      en:'To find f⁻¹(k), do not build the inverse formula — just find the a with f(a)=k.',
      zh:'求f⁻¹(k)时不必求反函数的式子，只要找出f(a)=k的a。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'암호 기계가 글자를 바꿔 쓰면, 해독 기계는 바뀐 글자를 원래대로 되돌립니다. 역함수는 바로 이 해독 기계입니다. 되돌리려면 서로 다른 입력이 서로 다른 출력으로 가야 합니다(일대일대응).',
        en:'A cipher machine replaces letters; a decoder turns them back. The inverse function is that decoder — and to undo, different inputs must go to different outputs (a one-to-one correspondence).',
        zh:'密码机把字母换掉，解码机再把它们还原。反函数就是这台解码机——要能还原，不同的输入必须得到不同的输出(一一对应)。' }
    },
    stages:[
      { tag:{ko:'① 역함수의 값',en:'1) Values of the inverse',zh:'① 反函数的值'},
        head:{ko:'f^{-1}(9)=a\\ \\Leftrightarrow\\ f(a)=9',en:'f^{-1}(9)=a\\ \\Leftrightarrow\\ f(a)=9',zh:'f^{-1}(9)=a\\ \\Leftrightarrow\\ f(a)=9'},
        desc:{ko:'f(x)=2x+3 이면 f⁻¹(9)=a 에서 2a+3=9 이므로 a=<b>3</b> 입니다.',
              en:'With f(x)=2x+3, f⁻¹(9)=a means 2a+3=9, so a=<b>3</b>.',
              zh:'f(x)=2x+3时，由f⁻¹(9)=a得2a+3=9，所以a=<b>3</b>。'},
        mathSteps:['2a+3=9','a=3'],
        result:{ko:'거꾸로 묻기!',en:'Ask it backwards!',zh:'倒过来问！'},
        book:{ko:'f⁻¹ 의 −1 은 지수가 아닙니다. f⁻¹(x) 는 1/f(x) 와 다릅니다.',
              en:'The −1 in f⁻¹ is not an exponent: f⁻¹(x) is not 1/f(x).',
              zh:'f⁻¹中的−1不是指数：f⁻¹(x)不等于1/f(x)。'} },

      { tag:{ko:'② 합성과 역함수',en:'2) Composites and inverses',zh:'② 复合与反函数'},
        head:{ko:'(f\\circ g)^{-1}=g^{-1}\\circ f^{-1}',en:'(f\\circ g)^{-1}=g^{-1}\\circ f^{-1}',zh:'(f\\circ g)^{-1}=g^{-1}\\circ f^{-1}'},
        desc:{ko:'f(x)=x+1, g(x)=2x 에서 (f∘g)⁻¹(7)=a 이면 f(g(a))=2a+1=7 이므로 a=<b>3</b> 입니다.',
              en:'With f(x)=x+1 and g(x)=2x, (f∘g)⁻¹(7)=a means f(g(a))=2a+1=7, so a=<b>3</b>.',
              zh:'f(x)=x+1、g(x)=2x时，由(f∘g)⁻¹(7)=a得f(g(a))=2a+1=7，所以a=<b>3</b>。'},
        mathSteps:['2a+1=7'],
        result:{ko:'벗을 때는 거꾸로!',en:'Undo in reverse order!',zh:'还原时倒着来！'},
        book:{ko:'양말을 신고 신발을 신었다면 벗을 때는 신발부터 벗습니다. 그래서 순서가 뒤집힙니다.',
              en:'Socks then shoes going on; shoes then socks coming off. That is why the order reverses.',
              zh:'先穿袜子再穿鞋，脱的时候先脱鞋。所以顺序要反过来。'} },

      { tag:{ko:'③ 역함수의 식',en:'3) The inverse formula',zh:'③ 反函数的式子'},
        head:{ko:'x=\\dfrac{y-1}{2}\\ \\Rightarrow\\ y=2x+1',en:'x=\\dfrac{y-1}{2}\\ \\Rightarrow\\ y=2x+1',zh:'x=\\dfrac{y-1}{2}\\ \\Rightarrow\\ y=2x+1'},
        desc:{ko:'f⁻¹(x)=(x−1)/2 이면 x 와 y 를 바꾼 x=(y−1)/2 를 y 에 대하여 풀어 f(x)=2x+1, 즉 a=<b>2</b>, b=<b>1</b> 입니다.',
              en:'If f⁻¹(x)=(x−1)/2, swap x and y and solve x=(y−1)/2 for y: f(x)=2x+1, so a=<b>2</b> and b=<b>1</b>.',
              zh:'若f⁻¹(x)=(x−1)/2，交换x与y，把x=(y−1)/2解成y：f(x)=2x+1，即a=<b>2</b>，b=<b>1</b>。'},
        mathSteps:['2x=y-1','y=2x+1'],
        result:{ko:'x 와 y 를 바꾸고 풀기!',en:'Swap x and y, then solve!',zh:'交换x与y再解！'},
        book:{ko:'y=f(x) 와 y=f⁻¹(x) 의 그래프는 직선 y=x 에 대하여 대칭입니다.',
              en:'The graphs of y=f(x) and y=f⁻¹(x) are symmetric about the line y=x.',
              zh:'y=f(x)与y=f⁻¹(x)的图像关于直线y=x对称。'} }
    ],
    rule:{ ko:'① f⁻¹(k)=a ⇔ f(a)=k  ② (f∘g)⁻¹=g⁻¹∘f⁻¹  ③ x 와 y 를 바꾸어 풀면 역함수',
      en:'① f⁻¹(k)=a ⇔ f(a)=k  ② (f∘g)⁻¹=g⁻¹∘f⁻¹  ③ Swap x and y and solve to get the inverse',
      zh:'① f⁻¹(k)=a ⇔ f(a)=k  ② (f∘g)⁻¹=g⁻¹∘f⁻¹  ③ 交换x与y再解得反函数' }
  },

  check:{
    fills:[
      { tex:{ko:'f(x)=3x-2\\ \\Rightarrow\\ f^{-1}(10)=\\square',en:'f(x)=3x-2\\ \\Rightarrow\\ f^{-1}(10)=\\square',zh:'f(x)=3x-2\\ \\Rightarrow\\ f^{-1}(10)=\\square'}, answer:4,
        hint:{ ko:'3a−2=10', en:'3a−2=10', zh:'3a−2=10' } },
      { tex:{ko:'f(x)=x+5\\ \\Rightarrow\\ (f^{-1}\\circ f)(7)=\\square',en:'f(x)=x+5\\ \\Rightarrow\\ (f^{-1}\\circ f)(7)=\\square',zh:'f(x)=x+5\\ \\Rightarrow\\ (f^{-1}\\circ f)(7)=\\square'}, answer:7,
        hint:{ ko:'f⁻¹∘f 는 제자리로 돌아옵니다', en:'f⁻¹∘f brings you back where you started', zh:'f⁻¹∘f回到原处' } }
    ],
    open:{ ko:'f(x)=x² 은 실수 전체에서 역함수가 없지만 x≥0 으로 정의역을 줄이면 역함수가 생기는 까닭을 설명해 봅니다.',
      en:'Explain why f(x)=x² has no inverse on all real numbers but has one when the domain is restricted to x≥0.',
      zh:'说说为什么f(x)=x²在全体实数上没有反函数，而把定义域缩小到x≥0后就有了。' },
    openHint:{ ko:'실수 전체에서는 f(2)=f(−2)=4 처럼 두 입력이 같은 출력으로 가서 되돌릴 수 없습니다. x≥0 이면 일대일대응이 됩니다.',
      en:'On all reals, f(2)=f(−2)=4: two inputs share an output, so it cannot be undone. With x≥0 it becomes a one-to-one correspondence.',
      zh:'在全体实数上f(2)=f(−2)=4，两个输入对应同一个输出，无法还原。限制x≥0后就成为一一对应。' }
  },

  lab:{
    generator:'md129_inverse', level:'main', count:6,
    params:{mode:'compose'},
    intro:{
      ko:'(f∘g)⁻¹=g⁻¹∘f⁻¹ 과 f∘f⁻¹ 이 제자리라는 사실로 식을 줄인 뒤 값을 구합니다.',
      en:'Use (f∘g)⁻¹=g⁻¹∘f⁻¹ and the fact that f∘f⁻¹ changes nothing to simplify, then evaluate.',
      zh:'利用(f∘g)⁻¹=g⁻¹∘f⁻¹以及f∘f⁻¹不改变任何值来化简，再求值。'
    }
  },

  arena:{
    generator:'md129_inverse', level:'main', count:6, timeLimit:420,
    params:{mode:'coef'},
    rule:{ ko:'7분 안에 역함수의 조건으로 a, b 를 모두 찾습니다!', en:'Find every a and b from inverse-function conditions within 7 minutes!', zh:'7分钟内由反函数条件求出所有a、b！' }
  },

  stamp:{ label:{ ko:'해독 마법사', en:'Decoder Wizard', zh:'解码魔法师' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'거꾸로 완벽하게 찾았어! 🔄',en:'Perfectly traced back!',zh:'倒推得完美！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'f(a)=k 로 바꿔 봐!',en:'Rewrite it as f(a)=k!',zh:'改写成f(a)=k试试！'}, {ko:'벗을 때는 순서를 거꾸로!',en:'Undo in reverse order!',zh:'还原时顺序要反过来！'} ],
    finish:{ ko:'완벽해! 해독 마법사! 🔄✨', en:'Perfect! Decoder Wizard!', zh:'完美！解码魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
