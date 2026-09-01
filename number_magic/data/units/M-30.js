/* Numbers of Magic — 유닛 M-30: 행렬의 덧셈·뺄셈·곱셈 (고등 W11 · 공통수학1 행렬) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-30'] = {
  id:'M-30', tier:'highmath1', level:'37', order:30,
  generator:'md30_matrix2x2',
  title:{ ko:'행렬의 덧셈·뺄셈·곱셈', en:'Matrix Addition, Subtraction & Multiplication', zh:'矩阵的加减乘法' },
  subtitle:{ ko:'같은 자리끼리 더하고, 행과 열을 짝지어 곱해요', en:'Add matching positions, multiply by pairing rows with columns', zh:'相同位置相加，行与列配对相乘' },
  icon:'🔲',

  practice:{
    generator:'md30_matrix2x2', level:'practice', count:5,
    params:{mode:'addSub'},
    intro:{
      ko:'행렬은 수를 네모 칸에 정리해 담은 표예요. 덧셈·뺄셈은 같은 자리(성분)끼리만 계산해요 — 아주 단순해요!',
      en:'A matrix is a table of numbers arranged in a grid. Addition/subtraction works entry by entry, matching position to position — very simple!',
      zh:'矩阵是把数字排列在方格里的表格。加减法只对相同位置(元素)分别运算——非常简单！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'표 두 개를 한꺼번에 더하거나 곱하고 싶을 때가 있어요. 숫자를 네모 칸(2×2)에 정리한 "행렬"이라는 게 있는데, 이걸 어떻게 계산할까요?',
        en:'Sometimes you want to add or multiply two tables of numbers at once. There\'s a way to arrange numbers in a 2×2 grid called a "matrix" — how do you compute with it?',
        zh:'有时候想把两张数字表一起相加或相乘。有一种把数字排成2×2方格的东西叫"矩阵"——该怎么计算？' },
      history:{ ko:'덧셈·뺄셈은 그냥 같은 자리끼리 계산하면 끝이라 직관적이에요. 곱셈은 다른데요 — 행렬곱은 "앞 행렬의 행"과 "뒤 행렬의 열"을 하나씩 짝지어 곱하고 더하는 특별한 규칙을 따라요. 처음엔 낯설어도 규칙만 외우면 기계적으로 계산할 수 있어요.',
        en:'Addition and subtraction are intuitive — just compute entry by entry. Multiplication is different: matrix multiplication follows a special rule of pairing each row of the first matrix with each column of the second, multiplying, and adding. It feels unfamiliar at first, but once you know the rule, it\'s mechanical.',
        zh:'加减法很直观——同位置相算就行。乘法不同——矩阵乘法遵循一个特殊规则：把前一个矩阵的行和后一个矩阵的列逐个配对、相乘再相加。刚开始会觉得陌生，但记住规则后就是机械操作了。' }
    },
    stages:[
      { tag:{ko:'① 덧셈·뺄셈: 같은 자리끼리',en:'1) Addition/subtraction: entry by entry',zh:'① 加减法：相同位置分别运算'},
        head:{ko:'\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix} + \\begin{pmatrix}5&0\\\\1&2\\end{pmatrix} = \\begin{pmatrix}6&2\\\\4&6\\end{pmatrix}',en:'\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix} + \\begin{pmatrix}5&0\\\\1&2\\end{pmatrix} = \\begin{pmatrix}6&2\\\\4&6\\end{pmatrix}',zh:'\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix} + \\begin{pmatrix}5&0\\\\1&2\\end{pmatrix} = \\begin{pmatrix}6&2\\\\4&6\\end{pmatrix}'},
        desc:{ko:'왼쪽 위끼리(1+5=6), 오른쪽 위끼리(2+0=2), 왼쪽 아래끼리(3+1=4), 오른쪽 아래끼리(4+2=6) — 딱 <b>같은 자리끼리만</b> 더해요.',
              en:'Top-left with top-left (1+5=6), top-right with top-right (2+0=2), bottom-left with bottom-left (3+1=4), bottom-right with bottom-right (4+2=6) — <b>only matching positions</b> are added.',
              zh:'左上对左上(1+5=6)，右上对右上(2+0=2)，左下对左下(3+1=4)，右下对右下(4+2=6)——<b>只有相同位置</b>才相加。'},
        mathSteps:['1+5=6,\\;2+0=2', '3+1=4,\\;4+2=6', '\\begin{pmatrix}6&2\\\\4&6\\end{pmatrix}'],
        result:{ko:'행렬의 덧셈·뺄셈은 같은 자리끼리만!',en:'Matrix addition/subtraction only ever touches matching positions!',zh:'矩阵加减法只对相同位置操作！'},
        book:{ko:'두 행렬의 크기(행·열의 수)가 같아야 덧셈·뺄셈이 가능해요.',
              en:'Two matrices must be the same size (same number of rows and columns) to add or subtract.',
              zh:'两个矩阵的大小(行数、列数)相同才能相加减。'} },

      { tag:{ko:'② 행렬곱: 행과 열을 짝지어',en:'2) Matrix multiplication: pair row with column',zh:'② 矩阵乘法：行与列配对'},
        head:{ko:'\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix} \\times \\begin{pmatrix}5&6\\\\7&8\\end{pmatrix} = \\begin{pmatrix}19&22\\\\43&50\\end{pmatrix}',en:'\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix} \\times \\begin{pmatrix}5&6\\\\7&8\\end{pmatrix} = \\begin{pmatrix}19&22\\\\43&50\\end{pmatrix}',zh:'\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix} \\times \\begin{pmatrix}5&6\\\\7&8\\end{pmatrix} = \\begin{pmatrix}19&22\\\\43&50\\end{pmatrix}'},
        desc:{ko:'왼쪽 위 자리는 "앞의 1행"과 "뒤의 1열"을 짝지어요: 1×5+2×7=19. 오른쪽 위는 1행과 2열: 1×6+2×8=22 — 자리마다 짝이 다 달라요.',
              en:'The top-left entry pairs the first matrix\'s row 1 with the second\'s column 1: 1×5+2×7=19. The top-right pairs row 1 with column 2: 1×6+2×8=22 — every position has its own pairing.',
              zh:'左上位置配对"前者第1行"和"后者第1列"：1×5+2×7=19。右上配对第1行和第2列：1×6+2×8=22——每个位置的配对都不同。'},
        mathSteps:['1\\times5+2\\times7=19', '1\\times6+2\\times8=22', {ko:'\\text{(같은 방법으로 아래 두 칸도)}',en:'\\text{(the bottom two cells the same way)}',zh:'\\text{（下面两格同样做）}'}],
        result:{ko:'각 자리는 앞 행과 뒤 열을 짝지어 곱하고 더해요!',en:'Each entry pairs a row from the first with a column from the second, multiplies, and adds!',zh:'每个位置都用前者的行配后者的列，乘完再加！'},
        book:{ko:'i행 j열 성분 = (앞 행렬의 i행)과 (뒤 행렬의 j열)을 순서대로 곱해 더한 값이에요.',
              en:'The entry in row i, column j equals the sum of products pairing the first matrix\'s row i with the second\'s column j, in order.',
              zh:'第i行第j列的元素 = 前者第i行与后者第j列按顺序相乘后求和。'} }
    ],
    rule:{ ko:'① 덧셈·뺄셈은 같은 자리끼리  ② 곱셈은 앞 행렬의 행과 뒤 행렬의 열을 짝지어 곱하고 더하기',
      en:'① Addition/subtraction: matching positions  ② Multiplication: pair rows of the first with columns of the second, multiply and add',
      zh:'① 加减法：相同位置  ② 乘法：前者的行配后者的列，相乘后相加' }
  },

  check:{
    fills:[
      { tex:'\\begin{pmatrix}2&1\\\\0&3\\end{pmatrix} + \\begin{pmatrix}1&4\\\\2&1\\end{pmatrix} = \\begin{pmatrix}\\square&\\square\\\\\\square&\\square\\end{pmatrix}', answer:[3,5,2,4],
        hint:{ ko:'같은 자리끼리 더해요', en:'add matching positions', zh:'相同位置相加' } },
      { tex:'\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix} \\times \\begin{pmatrix}3&2\\\\5&7\\end{pmatrix} = \\begin{pmatrix}\\square&\\square\\\\\\square&\\square\\end{pmatrix}', answer:[3,2,5,7],
        hint:{ ko:'단위행렬을 곱하면 원래 그대로 나와요', en:'multiplying by the identity matrix leaves it unchanged', zh:'乘以单位矩阵结果不变' } }
    ],
    open:{ ko:'\\(\\begin{pmatrix}2&0\\\\1&3\\end{pmatrix}\\times\\begin{pmatrix}1&2\\\\0&1\\end{pmatrix}\\)을 계산하는 과정을 설명해봐요.',
      en:'Explain how to compute \\(\\begin{pmatrix}2&0\\\\1&3\\end{pmatrix}\\times\\begin{pmatrix}1&2\\\\0&1\\end{pmatrix}\\).',
      zh:'说说计算\\(\\begin{pmatrix}2&0\\\\1&3\\end{pmatrix}\\times\\begin{pmatrix}1&2\\\\0&1\\end{pmatrix}\\)的过程。' },
    openHint:{ ko:'2×1+0×0=2, 2×2+0×1=4, 1×1+3×0=1, 1×2+3×1=5 → [[2,4],[1,5]]',
      en:'2×1+0×0=2, 2×2+0×1=4, 1×1+3×0=1, 1×2+3×1=5 → [[2,4],[1,5]]',
      zh:'2×1+0×0=2，2×2+0×1=4，1×1+3×0=1，1×2+3×1=5 → [[2,4],[1,5]]' }
  },

  lab:{
    generator:'md30_matrix2x2', level:'main', count:4,
    params:{mode:'scalarMul'},
    intro:{
      ko:'이번엔 스칼라곱! 행렬 앞에 붙은 수를 모든 성분에 똑같이 곱해봐.',
      en:'Scalar multiplication this time! Multiply every entry by the number in front.',
      zh:'这次是数乘！把前面的数乘到每个元素上。'
    }
  },

  arena:{
    generator:'md30_matrix2x2', level:'main', count:8, timeLimit:300,
    params:{mode:'matMul'},
    rule:{ ko:'5분 안에 행렬곱 문제를 모두 풀어요! 행과 열을 짝짓는 걸 잊지 마요.', en:'Solve all the matrix multiplication problems in 5 minutes! Don\'t forget to pair rows with columns.', zh:'5分钟内解答所有矩阵乘法题！别忘了行配列。' }
  },

  stamp:{ label:{ ko:'행렬 조립가', en:'Matrix Assembler', zh:'矩阵组装师' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'네 칸을 하나도 안 틀렸구나! 🔲',en:'You got all four entries right!',zh:'四个格子一个都没错！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'덧셈·뺄셈은 같은 자리끼리만 계산해!',en:'Addition/subtraction only touches matching positions!',zh:'加减法只对相同位置运算！'}, {ko:'행렬곱은 앞 행과 뒤 열을 짝지어 곱하고 더하는 거야!',en:'Matrix multiplication pairs a row with a column, multiplies, and adds!',zh:'矩阵乘法是行配列，相乘后相加！'} ],
    finish:{ ko:'완벽해! 행렬 조립가! 🔲✨', en:'Perfect! Matrix Assembler!', zh:'完美！矩阵组装师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
