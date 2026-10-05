/* G1-7·8·9호 스레드 — data/threads.js 뒤에 로드된다(window.NM_THREADS 가 있음).
   기존 스레드·레벨 id 는 건드리지 않고 새 스레드 NL37~NL43 만 더한다(내 번호 구간 NL37~NL46).
   레벨 id 는 한 번 정하면 바꾸지 않는다 — courses.js 의 `NLxx@n` 이 이 번호를 가리킨다. */
(function () {
  'use strict';
  const T = window.NM_THREADS; if (!T) return;
  const L = (id, ko, en, zh, params, concept) => Object.assign({ id, label: { ko, en, zh }, params }, concept ? { concept } : {});
  const C = (ko, en, zh) => ({ ko, en, zh });

  /* ── NL37 식 채우기 — 값 같은 식 고르기 · 가르기식 · ±1 ±2 · 부호 찾기 ── */
  T.NL37 = { name: { ko: '식 채우기와 고르기', en: 'Fill & Pick Equations', zh: '算式填空与选择' }, gen: 'nl37_eqplay', prereq: ['NL2'],
    instr: { ko: '식을 보고 알맞은 것을 고르거나 빈 칸을 채우시오.', en: 'Pick the right one or fill the blank.', zh: '看算式，选出合适的或填空。' },
    concept: C('식이 달라도 값이 같을 수 있어요. 8−1도 4+3도 7이에요. 더하기와 빼기 기호도 값을 보고 찾을 수 있어요.',
      'Different equations can have the same value: 8 − 1 and 4 + 3 are both 7. You can also find a hidden + or − by checking the values.',
      '算式不同，得数也可能相同：8−1和4+3都是7。也可以通过得数找出被遮住的＋或－。'),
    widgets: ['valuePick', 'eqFill'],
    levels: [
      L(1, '값이 같은 식 고르기', 'Pick equal expressions', '选出得数相同的算式', { mode: 'same', of: 'expr', target: [5, 6, 7, 8, 9] }),
      L(2, '합이 같은 짝 고르기', 'Pick pairs with the same sum', '选出和相同的一组', { mode: 'same', of: 'sum', target: [5, 6, 7, 8, 9] },
        C('두 수를 더한 합이 같은 짝을 골라요. (2, 5)와 (3, 4)는 합이 모두 7이에요.', 'Pick the pairs that add up to the same sum: (2, 5) and (3, 4) both make 7.', '选出相加后和相同的两个数：(2, 5)和(3, 4)的和都是7。')),
      L(3, '차가 같은 짝 고르기', 'Pick pairs with the same difference', '选出差相同的一组', { mode: 'same', of: 'diff', target: [1, 2, 3, 4] },
        C('큰 수에서 작은 수를 뺀 차가 같은 짝을 골라요. (5, 2)와 (7, 4)는 차가 모두 3이에요.', 'Pick the pairs with the same difference: (5, 2) and (7, 4) both differ by 3.', '选出大数减小数后差相同的一组：(5, 2)和(7, 4)的差都是3。')),
      L(4, '합이 다른 하나 찾기', 'Find the odd sum out', '找出和不一样的一个', { mode: 'pick', kind: 'odd' }),
      L(5, '합이 가장 큰 짝', 'Pair with the biggest sum', '和最大的一组', { mode: 'pick', kind: 'max' }),
      L(6, '합이 사이에 오는 짝', 'Sum in between', '和在两个数之间的一组', { mode: 'pick', kind: 'between' }),
      L(7, '가르기 식 빈칸', 'Splitting equations', '分解算式填空', { mode: 'blank', wholes: [3, 4, 5, 6, 7, 8, 9], twin: true, twinPct: 25 },
        C('큰 수를 두 수로 가르면 가른 두 수를 더한 값이 처음 수예요. 4는 1과 3으로 가를 수 있어요.', 'Splitting a number into two parts means the parts add back to it: 4 = 1 + 3.', '把一个数分成两个数，两个数相加就是原来的数：4＝1＋3。')),
      L(8, '+1, −1', 'Add 1 / subtract 1', '加1、减1', { mode: 'pm', d: 1, op: 'mix', blank: 'mix' },
        C('1을 더하면 바로 다음 수, 1을 빼면 바로 앞의 수가 돼요. 5+1=6, 5−1=4예요.', 'Adding 1 gives the next number and subtracting 1 gives the one before: 5 + 1 = 6, 5 − 1 = 4.', '加1得到后一个数，减1得到前一个数：5＋1＝6，5－1＝4。')),
      L(9, '+2, −2', 'Add 2 / subtract 2', '加2、减2', { mode: 'pm', d: 2, op: 'mix', blank: 'mix' },
        C('2를 더하면 두 칸 앞으로, 2를 빼면 두 칸 뒤로 가요. 5+2=7, 5−2=3이에요.', 'Adding 2 moves two steps on and subtracting 2 moves two steps back: 5 + 2 = 7, 5 − 2 = 3.', '加2往后走两格，减2往前走两格：5＋2＝7，5－2＝3。')),
      L(10, '부호 찾기', 'Find the sign', '找符号', { mode: 'sign' },
        C('식이 맞으려면 더해야 하는지 빼야 하는지 따져 봐요. 3 □ 2 = 5 에는 +가 들어가요.', 'Check whether you need to add or subtract: in 3 □ 2 = 5 the sign is +.', '看看要加还是要减才能让算式成立：3 □ 2＝5里是＋。')),
      L(11, '틀린 식 찾기', 'Spot the wrong equation', '找出不成立的算式', { mode: 'wrong' },
        C('+도 −도 안 맞는 식도 있어요. 3 □ 2 = 7 은 3+2=5, 3−2=1 이라 어느 쪽도 안 돼요.', 'Sometimes neither sign works: 3 □ 2 = 7, since 3 + 2 = 5 and 3 − 2 = 1.', '有的算式＋和－都不行：3 □ 2＝7，3＋2＝5，3－2＝1。')),
      L(12, '합이 큰 차례', 'Order by sum', '按和的大小排', { mode: 'order' }),
      L(13, '합이 큰 짝의 개수', 'Count the big sums', '数一数和大的一组', { mode: 'count', value: [3, 4, 5, 6] })
    ] };

  /* ── NL38 그림으로 식 — 주사위·물건 사기·도미노·동전 ── */
  T.NL38 = { name: { ko: '그림으로 식 만들기', en: 'Equations from Pictures', zh: '看图写算式' }, gen: 'nl38_scene', prereq: ['NL2'],
    instr: { ko: '그림을 보고 식의 빈 칸을 채우시오.', en: 'Look at the picture and fill the blank.', zh: '看图，填出算式的空格。' },
    concept: C('주사위 눈, 도미노 점, 동전, 물건처럼 그림 속에 식이 숨어 있어요. 세어 보면 더하기와 빼기가 보여요.',
      'Equations hide in pictures — dice dots, dominoes, coins and shopping. Count what you see and the adding or taking away shows up.',
      '算式藏在图里——骰子、多米诺、硬币和买东西。数一数，加法和减法就出现了。'),
    widgets: ['eqFill'],
    levels: [
      L(1, '주사위 더하기(쉬움)', 'Dice sums (easy)', '骰子加法(简单)', { mode: 'dice', op: '+', level: 'practice' }),
      L(2, '주사위 더하기·빼기', 'Dice sums and differences', '骰子加减', { mode: 'dice', op: 'mix', level: 'main' }),
      L(3, '물건 사기(쉬움)', 'Shopping (easy)', '买东西(简单)', { mode: 'price', max: 4 }),
      L(4, '물건 사기', 'Shopping', '买东西', { mode: 'price', max: 8 }),
      L(5, '도미노 점 세기', 'Count the domino dots', '数多米诺的点', { mode: 'domino', kind: 'sum' }),
      L(6, '도미노 빈 쪽 구하기', 'Missing half of the domino', '求多米诺空的一边', { mode: 'domino', kind: 'missing' }),
      L(7, '그림 숫자 계산', 'Picture number sums', '图案数字计算', { mode: 'symbols' },
        C('그림마다 정해진 수가 있어요. 그림을 수로 바꿔서 계산해요.', 'Each picture stands for a number: swap the pictures for numbers, then calculate.', '每个图案代表一个数：把图案换成数再计算。')),
      L(8, '○ 더 놓기', 'Add more circles', '再放○', { mode: 'dots' }),
      L(9, '동전 던지기', 'Coin toss', '扔硬币', { mode: 'coins', toss: true }),
      L(10, '동전 보고 □ 구하기', 'Find □ from coins', '看硬币求□', { mode: 'coins', toss: false }),
      L(11, '두 무리 그림으로 식', 'Two groups', '两堆图画算式', { mode: 'group2' }),
      L(12, '식 바꿔 쓰기', 'Turn an equation around', '算式换着写', { mode: 'invert', dir: 'mix' },
        C('덧셈식은 뺄셈식으로, 뺄셈식은 덧셈식으로 바꿔 쓸 수 있어요. 3+1=4 이면 4−1=3 이에요.', 'An addition can be turned into a subtraction and back: 3 + 1 = 4 means 4 − 1 = 3.', '加法算式可以改写成减法算式，反过来也行：3＋1＝4，所以4－1＝3。'))
    ] };

  /* ── NL39 짝 찾기 — 합·차가 같은 두 수 ── */
  T.NL39 = { name: { ko: '합·차가 같은 짝 찾기', en: 'Find Pairs by Sum or Difference', zh: '按和与差找一对数' }, gen: 'nl39_pairfind', prereq: ['NL2'],
    instr: { ko: '합이나 차가 알맞은 두 수를 찾아 이으시오.', en: 'Join the two numbers with the right sum or difference.', zh: '找出和或差合适的两个数，连起来。' },
    concept: C('두 수를 더하거나 빼서 알맞은 값이 되는 짝을 찾아요. 합이 9라면 1과 8, 2와 7처럼 서로 짝이에요.',
      'Look for two numbers that add or subtract to the right value. For a sum of 9: 1 and 8 are partners, and so are 2 and 7.',
      '找出相加或相减后得到合适数的一对数。和是9时，1和8、2和7都是一对。'),
    widgets: ['pairFind'],
    levels: [
      L(1, '둘레의 수, 합이 같은 짝(2쌍)', 'Ring: matching sums (2 pairs)', '圈上的数，和相同(2对)', { layout: 'ring', op: 'sum', pairs: 2 }),
      L(2, '둘레의 수, 합이 같은 짝(3쌍)', 'Ring: matching sums (3 pairs)', '圈上的数，和相同(3对)', { layout: 'ring', op: 'sum', pairs: 3, targets: [5, 6, 7, 8, 9] }),
      L(3, '둘레의 수, 차가 같은 짝', 'Ring: matching differences', '圈上的数，差相同', { layout: 'ring', op: 'diff', pairs: 3 }),
      L(4, '2×2 격자, 차가 같은 두 수', '2×2 grid: same difference', '2×2方格，差相同的两个数', { layout: 'grid', size: 2, op: 'diff' }),
      L(5, '2×2 격자, 합이 같은 두 수', '2×2 grid: same sum', '2×2方格，和相同的两个数', { layout: 'grid', size: 2, op: 'sum' }),
      L(6, '흩어진 수, 합 잇기(6개)', 'Scattered sums (6)', '散落的数，连和(6个)', { layout: 'scatter', n: 6, targets: [6, 7, 8, 9], kMin: 2, kMax: 2 }),
      L(7, '흩어진 수, 합 잇기(8개)', 'Scattered sums (8)', '散落的数，连和(8个)', { layout: 'scatter', n: 8, targets: [6, 7, 8, 9], kMin: 2, kMax: 3 }),
      L(8, '흩어진 수, 합 잇기(0~9)', 'Scattered sums (0–9)', '散落的数，连和(0~9)', { layout: 'scatter', n: 10, targets: [6, 7, 8, 9] }),
      L(9, '한 줄에서 이웃한 차(쉬움)', 'Neighbour difference (easy)', '一行里相邻的差(简单)', { layout: 'row', n: 8, need: 1 }),
      L(10, '한 줄에서 이웃한 차', 'Neighbour difference', '一行里相邻的差', { layout: 'row', n: 11, need: 2 }),
      L(11, '4×4 판에서 이웃한 차', 'Neighbour difference on a 4×4 board', '4×4方格里相邻的差', { layout: 'grid', size: 4, op: 'diff' }),
      L(12, '동그랗게 놓인 8개, 합 9', 'Circle of eight, sum 9', '围成圆的8个数，和是9', { layout: 'ring', op: 'sum', pairs: 4, shape: 'circle', targets: [9] }),
      L(13, '숫자 카드에서 합 하나', 'Cards: one pair that adds up', '数字卡片，找一对和', { layout: 'cards', kind: 'one', n: 7 }),
      L(14, '숫자 카드, 합이 같은 짝 모두', 'Cards: every pair with the sum', '数字卡片，找出所有和相同的一对', { layout: 'cards', kind: 'all', kMin: 2, kMax: 3 }),
      L(15, '숫자 카드 0~9, 차가 같은 3쌍', 'Cards 0–9: three pairs by difference', '数字卡片0~9，差相同的3对', { layout: 'cards', kind: 'diff3' }),
      L(16, '숫자 카드로 뺄셈식 만들기', 'Make a subtraction from cards', '用数字卡片列减法', { layout: 'cards', kind: 'any' })
    ] };

  /* ── NL40 수나무·꼭지점·바퀴 ── */
  T.NL40 = { name: { ko: '수나무·꼭지점·바퀴', en: 'Number Trees, Corners & Wheels', zh: '数树、顶点与圆盘' }, gen: 'nl40_diagram', prereq: ['NL5'],
    instr: { ko: '규칙에 맞게 빈 곳에 알맞은 수를 쓰시오.', en: 'Write the right number in each empty spot.', zh: '按规则在空处填上合适的数。' },
    concept: C('그림 속 칸들은 더하기로 이어져 있어요. 수나무는 부모 = 두 자식의 합, 꼭지점 도형은 변 위의 수 = 양쪽 꼭지점의 합이에요.',
      'The spots in these pictures are linked by adding: a tree circle is the sum of its two branches, and a number on a side is the sum of the two corners beside it.',
      '图里的格子靠加法连在一起：数树里的圆等于它分出的两个圆之和，边上的数等于两端顶点之和。'),
    widgets: ['treeFill', 'vertexSum', 'wheelFill', 'opGrid'],
    levels: [
      L(1, '수나무(대칭, 합쳐지기)', 'Number tree (even, merging)', '数树(对称，合起来)', { mode: 'tree', shape: 'sym4', flow: 'merge', kMin: 1, kMax: 2 }),
      L(2, '수나무(가지가 갈라지기)', 'Number tree (splitting)', '数树(往下分开)', { mode: 'tree', shape: 'asym', flow: 'split', kMin: 2, kMax: 4 }),
      L(3, '수나무(한쪽이 더 깊은 나무)', 'Number tree (uneven)', '数树(一边更深)', { mode: 'tree', shape: 'asym', flow: 'merge', kMin: 3, kMax: 4 }),
      L(4, '꼭지점 합(삼각형)', 'Corner sums (triangle)', '顶点和(三角形)', { mode: 'vertex', shape: 'tri' }),
      L(5, '꼭지점 합(삼각형, 거꾸로)', 'Corner sums (triangle, backwards)', '顶点和(三角形，倒推)', { mode: 'vertex', shape: 'tri', reverse: true }),
      L(6, '꼭지점 합(사각형)', 'Corner sums (square)', '顶点和(四边形)', { mode: 'vertex', shape: 'quad' }),
      L(7, '꼭지점 합(사각형, 거꾸로)', 'Corner sums (square, backwards)', '顶点和(四边形，倒推)', { mode: 'vertex', shape: 'quad', reverse: true }),
      L(8, '마주 보는 수의 합', 'Opposite numbers', '相对数的和', { mode: 'wheel', wheel: 'opposite' }),
      L(9, '가운데 수 바퀴', 'Wheel to the centre number', '凑成中间数的圆盘', { mode: 'wheel', wheel: 'sectors' }),
      L(10, '가로 더하기·세로 빼기 표', 'Add across, subtract down', '横加竖减表', { mode: 'opgrid', blanks: 3 })
    ] };

  /* ── NL41 수직선 뛰기 ── */
  T.NL41 = { name: { ko: '수직선에서 뛰기', en: 'Hopping on the Number Line', zh: '数轴上跳一跳' }, gen: 'nl41_hop', prereq: ['NL2', 'NL4'],
    instr: { ko: '수직선의 뛴 모습을 보고 빈 칸을 채우시오.', en: 'Look at the hops and fill the blank.', zh: '看数轴上的跳法，填空。' },
    concept: C('수직선에서 앞으로 뛰면 더하기, 되돌아오면 빼기예요. 4에서 3칸 앞으로 뛰면 7이에요.',
      'Hopping forward on the number line is adding and hopping back is subtracting: 3 hops forward from 4 lands on 7.',
      '在数轴上往前跳是加法，往回跳是减法。从4往前跳3格就到7。'),
    widgets: ['hopLine'],
    levels: [
      L(1, '뛴 모습 읽기(앞으로)', 'Read the hops (forward)', '读跳法(往前)', { mode: 'read', dir: '+' }),
      L(2, '뛴 모습 읽기(되돌아오기도)', 'Read the hops (forward and back)', '读跳法(往前也往回)', { mode: 'read', dir: 'mix' }),
      L(3, '눈금에 호 그리기', 'Draw the hops', '在数轴上画跳法', { mode: 'draw', dir: 'mix', blanks: ['a', 'b', 'c'] }),
      L(4, '눈금에서 마음대로 뛰기', 'Hop anywhere that works', '想怎么跳都行', { mode: 'draw', dir: 'mix', free: true })
    ] };

  /* ── NL42 규칙표와 수 상자 ── */
  T.NL42 = { name: { ko: '규칙표와 수 상자', en: 'Rule Tables & Number Boxes', zh: '规则表与数字盒' }, gen: 'nl42_rules', prereq: ['NL11'],
    instr: { ko: '규칙을 찾아 빈 칸을 채우시오.', en: 'Find the rule and fill the blanks.', zh: '找出规则，填空。' },
    concept: C('규칙대로 수가 바뀌어요. +2 규칙이면 3은 5가 되고, 5는 7이 돼요. 규칙이 안 보이면 이미 채워진 두 칸을 비교해서 찾아요.',
      'Numbers change by a rule: with +2, 3 becomes 5 and 5 becomes 7. If the rule is hidden, compare two filled columns to find it.',
      '数按规则变化：规则是＋2时，3变成5，5变成7。规则看不见时，比较已填好的两列就能找到。'),
    widgets: ['ruleTable', 'machineBox'],
    levels: [
      L(1, '지붕 규칙(더하기)', 'Roof rule (adding)', '屋顶规则(加)', { mode: 'house', plusOnly: true }),
      L(2, '지붕 규칙(더하기·빼기)', 'Roof rule (adding and subtracting)', '屋顶规则(加减)', { mode: 'house', mixIn: true }),
      L(3, '숨은 규칙 표', 'Hidden-rule table', '隐藏规则表', { mode: 'strip', rule: 'delta' }),
      L(4, '위아래 합이 같은 표', 'Same top-plus-bottom table', '上下和相同的表', { mode: 'strip', rule: 'colsum' }),
      L(5, '두 번 바뀌는 표', 'Two-step table', '变两次的表', { mode: 'chain' }),
      L(6, '수 상자 규칙(출구 구하기)', 'Number box (find the output)', '数字盒(求出口)', { mode: 'box', ask: 'out', plusOnly: true }),
      L(7, '수 상자 규칙(입구도 구하기)', 'Number box (find the input too)', '数字盒(也求入口)', { mode: 'box', ask: 'mix' },
        C('나온 수에서 거꾸로 생각하면 처음 넣은 수도 알 수 있어요. 규칙이 +3이고 7이 나왔다면 4를 넣은 거예요.', 'Work backwards from the output to find what went in: with the rule +3 and 7 coming out, 4 went in.', '从出来的数倒着想，就能知道放进去的数。规则是＋3、出来7，放进去的是4。')),
      L(8, '두 수를 넣는 수 상자', 'Two-input number box', '放两个数的盒子', { mode: 'sum2', ask: 'mix' })
    ] };

  /* ── NL43 숨은 구슬·암호·합 잇기 ── */
  T.NL43 = { name: { ko: '숨은 구슬·그림 암호·합 잇기', en: 'Hidden Beads, Codes & Sum Match', zh: '藏起来的珠子·图案密码·连和' }, gen: 'nl43_hidden', prereq: ['NL2'],
    instr: { ko: '그림을 보고 알맞은 수를 쓰거나 이으시오.', en: 'Look at the picture and write or join.', zh: '看图，写出合适的数或连线。' },
    concept: C('보이지 않는 부분은 전체에서 보이는 부분을 빼면 알 수 있어요. 구슬이 모두 8개인데 5개가 보이면 상자에는 3개 있어요.',
      'You can find the hidden part by taking the part you can see away from the whole: 8 beads in all and 5 showing means 3 are in the box.',
      '看不见的部分，可以用总数减去看得见的部分得到：一共8颗，看到5颗，盒子里就有3颗。'),
    widgets: ['hiddenBeads', 'numberBond', 'codeBreak', 'sumMatch', 'pyramid4'],
    levels: [
      L(1, '숨은 구슬 개수', 'How many beads are hidden', '藏起来几颗珠子', { mode: 'beads', ask: 'hidden' }),
      L(2, '숨은 구슬·전체 구슬', 'Hidden and total beads', '藏起来的珠子与总数', { mode: 'beads', ask: 'mix' }),
      L(3, '바둑돌 두 손에 나누기', 'Stones in two hands', '两只手里的棋子', { mode: 'hands' }),
      L(4, '그림 암호 풀기', 'Crack the picture code', '破解图案密码', { mode: 'code' }),
      L(5, '합이 같은 짝 잇기', 'Join pairs with equal sums', '连和相同的两组', { mode: 'sumMatch' }),
      L(6, '4줄 거꾸로 피라미드', 'Four-row upside-down pyramid', '四层倒金字塔', { mode: 'pyramid4' })
    ] };
})();
