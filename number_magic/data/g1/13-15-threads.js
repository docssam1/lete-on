/* G1-13~15호 스레드 — data/threads.js 뒤에 로드된다(window.NM_THREADS 가 있음).
   기존 스레드·레벨은 건드리지 않고 새 스레드 NL57~NL66 만 추가한다(수 범위는 모두 9 이내, 문구는 창작).
   생성기: engine/threads/g1-13-15.js · 위젯: app/g1/13-15.widgets.js · 인쇄: app/g1/13-15.print.js
   편성(courses.js)은 통합 단계에서 한다 — docs/yua-specs/INTEGRATION-13-15.md 참조. */
(function () {
  'use strict';
  const T = window.NM_THREADS;
  if (!T) return;
  const t3 = (ko, en, zh) => ({ ko, en, zh });

  /* ── G1-13 ─────────────────────────────────────────────── */
  T.NL57 = { name: t3('겹친 도형의 합', 'Overlapping Shape Sums', '重叠图形的和'), gen: 'g13_overlap', prereq: ['NL5'],
    instr: t3('큰 도형 하나 안의 수를 더해 빈 칸을 구하시오.', 'Add the numbers in one big shape to find the blank.', '把一个大图形里的数相加，求出空格。'),
    concept: t3('겹쳐 놓은 도형에서는 큰 네모 하나에 들어 있는 수를 모두 더해요. 겹친 부분은 두 도형에 다 들어 있어요. 합이 8이고 한 도형 안에 3과 빈 칸이 있다면 빈 칸은 5예요.',
      'In overlapping shapes, add every number inside one big shape. A shared part belongs to both shapes. If the total is 8 and one shape holds a 3 and a blank, the blank is 5.',
      '图形重叠时，把一个大方块里的所有数相加。重叠的部分同时属于两个图形。总和是8，一个图形里有3和一个空格，空格就是5。'),
    widgets: ['overlapSum'],
    levels: [
      { id: 1, label: t3('겹친 네모 2개', 'Two overlapping squares', '两个重叠方块'), params: { shape: 'square', n: 2 } },
      { id: 2, label: t3('겹친 네모 3개', 'Three overlapping squares', '三个重叠方块'), params: { shape: 'square', n: 3 } },
      { id: 3, label: t3('겹친 원', 'Overlapping circles', '重叠的圆'), params: { shape: 'circle', n: 0 },
        concept: t3('원도 같아요. 큰 원 하나 안에 있는 수를 모두 더하면 네모 안의 수가 돼요. 원이 겹친 곳은 두 원에 모두 들어가요.',
          'Circles work the same way. The numbers inside one big circle add up to the number in the square. Where circles overlap, the number counts for both.',
          '圆也一样。一个大圆里的数加起来等于方块里的数。圆重叠的地方对两个圆都算。') }
    ] };

  T.NL58 = { name: t3('분동과 양팔저울', 'Weights & Balance', '砝码与天平'), gen: 'g13_weights', prereq: ['NL10'],
    instr: t3('분동을 골라 무게를 만들거나 저울의 빈 분동을 구하시오.', 'Pick weights to make a weight, or find the blank weight.', '选砝码凑出重量，或求出天平上空白的砝码。'),
    concept: t3('여러 분동을 한 접시에 올리면 무게를 더한 값이 돼요. 1g과 4g을 올리면 5g이에요. 1g, 2g, 4g이 있으면 1g부터 7g까지 모두 만들 수 있어요.',
      'Weights on one pan add together. A 1 g and a 4 g make 5 g. With 1 g, 2 g and 4 g you can make every weight from 1 g to 7 g.',
      '把几个砝码放在同一个盘里，重量要相加。1克和4克放在一起是5克。有1克、2克、4克，就能凑出1克到7克的每一种重量。'),
    widgets: ['weightPick', 'balanceEq'],
    levels: [
      { id: 1, label: t3('분동 올리기(쉬움)', 'Weigh it (easy)', '放砝码(简单)'), params: { mode: 'weigh', level: 'practice' } },
      { id: 2, label: t3('1g·2g·4g으로 만들기', 'Make it with 1, 2, 4 g', '用1、2、4克凑'), params: { mode: 'weigh', level: 'main' },
        concept: t3('1g, 2g, 4g을 한 번씩만 써서 3g부터 7g까지 만들어 봐요. 6g은 2g과 4g, 7g은 1g과 2g과 4g이에요.',
          'Use 1 g, 2 g and 4 g once each to make 3 g up to 7 g. 6 g is 2 g and 4 g; 7 g is 1 g, 2 g and 4 g.',
          '1克、2克、4克各用一次，凑出3克到7克。6克是2克加4克，7克是1克加2克加4克。') },
      { id: 3, label: t3('평평한 저울(쉬움)', 'Level scale (easy)', '平衡的天平(简单)'), params: { mode: 'balance', level: 'practice' },
        concept: t3('저울이 평평하면 양쪽 무게가 같아요. 한쪽이 5g이고 반대쪽에 분동 2g과 빈 분동이 있으면 빈 분동은 5−2=3g이에요.',
          'When the scale is level, both sides weigh the same. If one side is 5 g and the other holds a 2 g weight and a blank, the blank is 5 − 2 = 3 g.',
          '天平平衡时，两边一样重。一边是5克，另一边有2克砝码和一个空白砝码，空白砝码就是5−2=3克。') },
      { id: 4, label: t3('평평한 저울(어려움)', 'Level scale (hard)', '平衡的天平(较难)'), params: { mode: 'balance', level: 'main' },
        concept: t3('빈 분동이 물체와 같은 접시에 있어도 양쪽 무게는 같아요. 물체 2g과 빈 분동이 한쪽, 반대쪽이 5g이면 빈 분동은 5−2=3g이에요.',
          'Even when the blank weight sits on the same pan as the object, both sides are equal. A 2 g object plus a blank against 5 g means the blank is 5 − 2 = 3 g.',
          '空白砝码和物体在同一个盘里时，两边也一样重。2克的物体加空白砝码对5克，空白砝码就是5−2=3克。') }
    ] };

  T.NL59 = { name: t3('합이 가장 작은 길', 'Smallest-Sum Path', '和最小的路'), gen: 'g13_pathsum', prereq: ['NL12'],
    instr: t3('출발에서 도착까지 지나는 수의 합이 가장 작은 길을 찾으시오.', 'Find the path whose numbers add up to the smallest total.', '找出经过的数相加最小的路。'),
    concept: t3('길을 따라 지나는 칸의 수를 모두 더해요. 눈에 띄는 작은 수만 따라가면 끝에서 큰 수를 만날 수 있어요. 갈 수 있는 길을 모두 더해 보고 가장 작은 합을 골라요.',
      'Add up every cell you pass along the path. Chasing only the small numbers you see can lead to a big one later, so total each possible path and pick the smallest.',
      '把路上经过的格子里的数全部相加。只追着眼前的小数走，后面可能碰到大数。把每条路都加一加，选出最小的和。'),
    widgets: ['pathSum'],
    levels: [
      { id: 1, label: t3('2×2 칸', '2×2 grid', '2×2格'), params: { rows: 2, cols: 2, moves: 'ru', lo: 1, hi: 4 } },
      { id: 2, label: t3('2×3 칸', '2×3 grid', '2×3格'), params: { rows: 2, cols: 3, moves: 'ru', lo: 1, hi: 4 } },
      { id: 3, label: t3('3×3 칸(오른쪽·위)', '3×3 grid (right, up)', '3×3格(向右、向上)'), params: { rows: 3, cols: 3, moves: 'ru', lo: 1, hi: 3 } },
      { id: 4, label: t3('3×3 칸(오른쪽·아래)', '3×3 grid (right, down)', '3×3格(向右、向下)'), params: { rows: 3, cols: 3, moves: 'dr', lo: 1, hi: 3 } }
    ] };

  T.NL60 = { name: t3('합이 같은 퍼즐', 'Equal-Sum Puzzles', '和相等的谜题'), gen: 'g13_sumpuzzle', prereq: ['NL5', 'NL12'],
    instr: t3('합이 같아지도록 빈 칸에 수를 넣으시오.', 'Fill the blanks so the sums match.', '填空，让几个和相等。'),
    concept: t3('가로줄과 세로줄의 합이 모두 같아지도록 빈 칸을 채워요. 합이 4인 줄에 1과 2가 있으면 빈 칸은 1이에요. 줄마다 합 뱃지가 알려 줘요.',
      'Fill the blanks so every row and every column adds up to the same number. In a row that must total 4 with a 1 and a 2, the blank is 1. The sum badges tell you how you are doing.',
      '填空，让每一行、每一列的和都相同。和是4的一行里有1和2，空格就是1。每行每列的和标签会告诉你填得对不对。'),
    widgets: ['gridSum', 'crossPlace', 'pairUp', 'ringSum'],
    levels: [
      { id: 1, label: t3('가로·세로 합(3×3, 쉬움)', 'Row & column sums (3×3, easy)', '行列和(3×3，简单)'), params: { mode: 'gridsum', n: 3, blanks: [1, 2] } },
      { id: 2, label: t3('가로·세로 합(3×3)', 'Row & column sums (3×3)', '行列和(3×3)'), params: { mode: 'gridsum', n: 3, blanks: [3, 4] } },
      { id: 3, label: t3('가로·세로 합(4×4)', 'Row & column sums (4×4)', '行列和(4×4)'), params: { mode: 'gridsum', n: 4, blanks: [4, 5] } },
      { id: 4, label: t3('십자 합(쉬움)', 'Cross sums (easy)', '十字和(简单)'), params: { mode: 'crossplace', level: 'practice' },
        concept: t3('십자 모양에 1부터 5까지를 한 번씩 넣어요. 가로 세 수의 합과 세로 세 수의 합이 같아야 해요. 가운데 수는 두 줄이 같이 쓰니 먼저 정하면 쉬워요.',
          'Put 1 to 5 once each into the cross so the row of three and the column of three have the same sum. The middle number is shared by both lines, so settle it first.',
          '把1到5各用一次放进十字里，横着三个数的和和竖着三个数的和要相等。中间的数两条线共用，先定它就容易了。') },
      { id: 5, label: t3('십자 합', 'Cross sums', '十字和'), params: { mode: 'crossplace', level: 'main' } },
      { id: 6, label: t3('두 장씩 묶기(카드 4장)', 'Pair the cards (4 cards)', '两张两张配对(4张)'), params: { mode: 'pairs', k: 2 },
        concept: t3('카드를 두 장씩 묶어서 묶음마다 합이 같게 만들어요. 가장 큰 수와 가장 작은 수를 짝지어 보면 실마리가 보여요.',
          'Pair up the cards so every pair has the same sum. Try pairing the biggest number with the smallest to find the clue.',
          '把卡片两张两张配对，让每一对的和相同。试着把最大的数和最小的数配成一对，就能找到线索。') },
      { id: 7, label: t3('두 장씩 묶기(카드 6장)', 'Pair the cards (6 cards)', '两张两张配对(6张)'), params: { mode: 'pairs', k: 3 } },
      { id: 8, label: t3('네 꼭짓점(쉬움)', 'Four corners (easy)', '四个顶点(简单)'), params: { mode: 'ring', level: 'practice' },
        concept: t3('네모의 변 위 수는 양쪽 꼭짓점을 더한 값이에요. 변이 7이고 한쪽 꼭짓점이 3이면 반대쪽 꼭짓점은 4예요.',
          'The number on each side is the sum of the two corners it joins. If a side shows 7 and one corner is 3, the other corner is 4.',
          '每条边上的数是它两端顶点的和。边上是7，一个顶点是3，另一个顶点就是4。') },
      { id: 9, label: t3('네 꼭짓점', 'Four corners', '四个顶点'), params: { mode: 'ring', level: 'main' } }
    ] };

  /* ── G1-14 ─────────────────────────────────────────────── */
  T.NL61 = { name: t3('규칙 표와 숫자 기차', 'Rule Tables & Number Trains', '规律表与数字火车'), gen: 'g14_rules', prereq: ['NL16'],
    instr: t3('규칙을 찾아 빈 칸에 올 수를 구하시오.', 'Find the rule and give the missing number.', '找出规律，求出空格里的数。'),
    concept: t3('표의 윗줄들에서 앞 칸들이 뒤 칸과 어떤 관계인지 찾아요. 3, 2, 5와 4, 4, 8을 보면 앞의 두 수를 더한 값이 셋째 칸이에요.',
      'Look at the finished rows of the table to see how the first columns relate to the last. In 3, 2, 5 and 4, 4, 8 the first two numbers add up to the third.',
      '看表里已经填好的几行，找出前面几列和最后一列的关系。3、2、5和4、4、8里，前两个数相加就是第三个数。'),
    widgets: ['g15RuleTable', 'numberTrain', 'rodNumeral'],
    levels: [
      { id: 1, label: t3('표 규칙(더하기)', 'Table rule (add)', '表格规律(加)'), params: { mode: 'table', level: 1 } },
      { id: 2, label: t3('표 규칙(빼기)', 'Table rule (subtract)', '表格规律(减)'), params: { mode: 'table', level: 2 },
        concept: t3('이번엔 첫째 칸에서 둘째 칸을 뺀 값이 셋째 칸이에요. 7, 3, 4와 9, 5, 4를 보고 규칙을 확인해요.',
          'This time the first number minus the second gives the third. Check the rule on 7, 3, 4 and 9, 5, 4.',
          '这次是第一个数减第二个数得到第三个数。用7、3、4和9、5、4来验证规律。') },
      { id: 3, label: t3('표 규칙(4열)', 'Table rule (4 columns)', '表格规律(4列)'), params: { mode: 'table', level: 3 },
        concept: t3('칸이 넷이면 앞의 세 수를 모두 더한 값이 마지막 칸이에요. 1, 2, 3, 6처럼요.',
          'With four columns, the first three numbers add up to the last. Like 1, 2, 3, 6.',
          '有四列时，前三个数相加就是最后一个数。比如1、2、3、6。') },
      { id: 4, label: t3('숫자 기차(차가 같아요)', 'Number train (same gap)', '数字火车(差相同)'), params: { mode: 'train', level: 1 },
        concept: t3('기차 칸 사이의 동그라미는 이웃한 두 칸의 차예요. 1과 3 사이의 동그라미는 2예요. 동그라미를 보면 빈 칸을, 칸을 보면 빈 동그라미를 찾을 수 있어요.',
          'The circle between two train cars is their difference: between 1 and 3 it is 2. Circles help you find a blank car, and cars help you find a blank circle.',
          '车厢之间的圆圈是相邻两节车厢的差：1和3之间是2。看圆圈能找出空车厢，看车厢能找出空圆圈。') },
      { id: 5, label: t3('숫자 기차(차가 달라요)', 'Number train (changing gap)', '数字火车(差不同)'), params: { mode: 'train', level: 2 } },
      { id: 6, label: t3('막대 기호 읽기', 'Read rod signs', '读棒形符号'), params: { mode: 'rod', level: 'read' },
        concept: t3('막대로 만든 새 숫자 기호를 읽어요. 1~5는 막대의 개수, 6~9는 위에 가로 막대(5)를 얹고 나머지 막대를 더해요. 표를 보며 읽어요.',
          'Read a new number sign made of bars. 1 to 5 are that many bars; 6 to 9 put a top bar (5) over the leftover bars. Use the table to read them.',
          '读用小棒组成的新数字符号。1到5就是几根小棒；6到9是上面一根横棒(5)加上剩下的小棒。对照表来读。') },
      { id: 7, label: t3('막대 기호 덧셈', 'Add rod signs', '棒形符号加法'), params: { mode: 'rod', level: 'add' } }
    ] };

  T.NL62 = { name: t3('약속과 모양수', 'Secret Rules & Picture Numbers', '约定与图形数'), gen: 'g14_symbols', prereq: ['NL11'],
    instr: t3('약속이나 그림이 나타내는 수를 구하시오.', 'Find the rule or the number a picture stands for.', '求出约定或图案代表的数。'),
    concept: t3('기호 ◆는 두 수로 계산하는 약속이에요. 규칙이 보이면 그대로 계산하고, 숨어 있으면 예시에서 앞 수와 뒤 수가 어떻게 결과가 되는지 찾아요.',
      'A sign like ◆ is a rule that uses two numbers. If the rule is shown, just follow it; if it is hidden, look at the examples to see how the two numbers make the result.',
      '像◆这样的符号是用两个数计算的约定。规则写出来时照着算；规则藏起来时，从例子里找出两个数怎样得到结果。'),
    widgets: ['promiseBox', 'shapeEq'],
    levels: [
      { id: 1, label: t3('약속(규칙이 보여요)', 'Secret rule (shown)', '约定(规则可见)'), params: { mode: 'promise', shown: true } },
      { id: 2, label: t3('약속(규칙 찾기)', 'Secret rule (find it)', '约定(找规则)'), params: { mode: 'promise', shown: false },
        concept: t3('규칙이 숨어 있어요. 예시 세 줄에서 앞 수와 뒤 수로 결과가 어떻게 나오는지 찾은 뒤 마지막 식에 써요. 규칙은 모든 예시에 다 맞아야 해요.',
          'The rule is hidden. Find how the front and back numbers make the result in the three examples, then use it on the last line. The rule must fit every example.',
          '规则是藏起来的。先在三个例子里找出前后两个数怎样得到结果，再用到最后一题上。规则必须适合每一个例子。') },
      { id: 3, label: t3('약속(빈 칸 찾기)', 'Secret rule (find the blank)', '约定(求空格)'), params: { mode: 'promise', shown: false, askPos: 'b' } },
      { id: 4, label: t3('같은 그림 = 같은 수', 'Same picture, same number', '相同图案相同数'), params: { mode: 'shapenum', kind: 'obj' },
        concept: t3('같은 그림은 같은 수예요. 🍎 = 3을 알면 🍎 + 🍌 = 7에서 🍌 = 4를 구해요. 아는 것부터 차례로 바꿔 넣어요.',
          'The same picture always stands for the same number. If 🍎 = 3, then 🍎 + 🍌 = 7 gives 🍌 = 4. Swap in what you know, one line at a time.',
          '相同的图案代表相同的数。知道🍎=3，就能从🍎+🍌=7求出🍌=4。从已知的开始，一行一行代进去。') },
      { id: 5, label: t3('같은 모양 = 같은 수', 'Same shape, same number', '相同形状相同数'), params: { mode: 'shapenum', kind: 'shape' } },
      { id: 6, label: t3('두 수 구하기', 'Find two numbers', '求两个数'), params: { mode: 'shapenum', kind: 'pair' },
        concept: t3('합과 차를 알면 두 수를 구할 수 있어요. 합이 7, 차가 1이면 큰 수는 4, 작은 수는 3이에요. 두 식을 함께 만족하는 수예요.',
          'Knowing the sum and the difference gives both numbers. Sum 7 and difference 1 mean the bigger is 4 and the smaller is 3 — they fit both lines.',
          '知道和与差，就能求出两个数。和是7、差是1，大数是4，小数是3，它们同时满足两个算式。') },
      { id: 7, label: t3('합과 차 이야기', 'Sum & difference pictures', '和与差的图案'), params: { mode: 'shapenum', kind: 'sumdiff' } }
    ] };

  T.NL63 = { name: t3('화살표 사슬', 'Arrow Chains', '箭头链'), gen: 'g14_chain', prereq: ['NL11'],
    instr: t3('화살표 규칙대로 빈 원을 채우거나 규칙을 구하시오.', 'Fill the blank circles by the arrow rule, or find the rule.', '按箭头规则填空圆，或求出规则。'),
    concept: t3('원과 원 사이 화살표는 수를 바꾸는 규칙이에요. 실선이 "3 큰 수"이면 4에서 7로, 점선이 "2 작은 수"이면 7에서 5로 가요.',
      'An arrow between circles changes the number. If a solid arrow means 3 more, 4 becomes 7; if a dashed arrow means 2 less, 7 becomes 5.',
      '圆圈之间的箭头会改变数。实线表示多3，4就变成7；虚线表示少2，7就变成5。'),
    widgets: ['arrowChain'],
    levels: [
      { id: 1, label: t3('화살표 한 칸 구하기', 'One blank circle', '求一个空圆'), params: { level: 1 } },
      { id: 2, label: t3('화살표 사슬 채우기', 'Fill the chain', '填满箭头链'), params: { level: 2 } },
      { id: 3, label: t3('숫자 라벨 연쇄 계산', 'Chain with numbers', '带数字的连续计算'), params: { level: 3 },
        concept: t3('이번엔 화살표 위에 +2, −1처럼 수가 적혀 있어요. 시작 수에서 차례로 더하고 빼면 빈 원이 나와요.',
          'Now the arrows carry numbers like +2 or −1. Start at the first circle and add or subtract in order to reach the blank.',
          '这次箭头上写着+2、−1这样的数。从第一个圆开始依次加减，就能得到空圆里的数。') },
      { id: 4, label: t3('화살표 규칙 찾기', 'Find the arrow rule', '找箭头规律'), params: { level: 4 },
        concept: t3('원이 모두 채워져 있어요. 두 원의 차를 보고 실선과 점선이 각각 얼마를 바꾸는지 찾아요. 한 번만 보지 말고 같은 화살표를 한 번 더 확인해요.',
          'Every circle is filled. Compare neighboring circles to find how much the solid and dashed arrows change. Check the same kind of arrow once more.',
          '所有的圆都填好了。比较相邻两个圆的差，找出实线和虚线各改变多少。同一种箭头要再核对一次。') },
      { id: 5, label: t3('돌고 도는 고리', 'Arrow loop', '循环箭头环'), params: { level: 5 },
        concept: t3('화살표가 고리를 이루면 한 바퀴 돌아 처음 수로 돌아와요. 올라간 만큼 내려와요.',
          'When the arrows form a loop, one full trip brings you back to the starting number: what goes up must come down.',
          '箭头围成一个环时，走一圈会回到起点的数。升上去多少，就降下来多少。') }
    ] };

  T.NL64 = { name: t3('모든 가르기와 수열', 'All Splits & Number Patterns', '所有分法与数列'), gen: 'g14_order', prereq: ['NL2', 'NL4'],
    instr: t3('가르는 방법을 모두 찾거나 수열의 빈 칸을 채우시오.', 'Find every way to split, or fill the pattern.', '找出所有分法，或填数列的空格。'),
    concept: t3('6을 두 수로 가르는 방법은 1과 5, 2와 4, 3과 3이에요. 같은 두 수를 순서만 바꾼 것(5와 1)은 같은 방법이에요. 빠짐없이 하나씩 찾아요.',
      'The ways to split 6 into two numbers are 1 and 5, 2 and 4, 3 and 3. The same two numbers in another order (5 and 1) count as the same way. Find them all, one by one.',
      '把6分成两个数有1和5、2和4、3和3三种。同样的两个数只是顺序不同(5和1)算同一种。一种一种找，不要漏。'),
    widgets: ['splitList', 'seqGap', 'pyramid'],
    levels: [
      { id: 1, label: t3('모든 가르기(4~6)', 'All splits (4–6)', '所有分法(4~6)'), params: { mode: 'split', level: 'practice' } },
      { id: 2, label: t3('모든 가르기(7~9)', 'All splits (7–9)', '所有分法(7~9)'), params: { mode: 'split', level: 'main' } },
      { id: 3, label: t3('수열(거꾸로 2씩·짝수·홀수)', 'Patterns (down by 2, even, odd)', '数列(倒数2、双数、单数)'), params: { mode: 'seq', kinds: ['down2', 'even', 'odd'] },
        concept: t3('수가 같은 간격으로 이어져요. 2씩 줄어들거나, 짝수·홀수만 이어 세요. 앞뒤 두 수의 차를 보면 규칙이 보여요.',
          'The numbers keep a steady gap: down by 2, or even numbers only, or odd numbers only. The gap between neighbors shows the rule.',
          '数按固定的间隔排列：每次减2，或只数双数、只数单数。看相邻两个数的差，就能看出规律。') },
      { id: 4, label: t3('수열(점점 커지는 수)', 'Patterns (growing steps)', '数列(越来越大的间隔)'), params: { mode: 'seq', kinds: ['grow'] },
        concept: t3('더하는 수가 1씩 커져요. 0, 1, 3, 6은 +1, +2, +3으로 늘어요.',
          'The number you add grows by 1: 0, 1, 3, 6 goes +1, +2, +3.',
          '每次加的数多1：0、1、3、6是+1、+2、+3。') },
      { id: 5, label: t3('수열 빈칸 2개', 'Patterns with two blanks', '数列两个空格'), params: { mode: 'seq', kinds: ['down2', 'even', 'odd', 'grow'], blanks: 2 } },
      { id: 6, label: t3('수 삼각형', 'Number triangle', '数字三角形'), params: { mode: 'pascal' },
        concept: t3('위의 두 수를 더하면 바로 아래 수가 돼요. 1과 1 아래에는 2가 와요.',
          'Two numbers above add up to the number right below them: under 1 and 1 comes 2.',
          '上面的两个数相加，就是它们正下方的数：1和1的下面是2。') },
      { id: 7, label: t3('더 많이 나누기', 'Share with more', '分得更多'), params: { mode: 'split', level: 'cmp' } },
      { id: 8, label: t3('색이 다른 구슬 꺼내기', 'Pick beads of two colours', '取出两种颜色的珠子'), params: { mode: 'split', level: 'caps' } }
    ] };

  /* ── G1-15 ─────────────────────────────────────────────── */
  T.NL65 = { name: t3('이야기 속 어떤 수', 'The Hidden Number in Stories', '故事里的未知数'), gen: 'g15_unknown', prereq: ['NL13'],
    instr: t3('이야기를 읽고 빈 칸이나 숨은 수를 구하시오.', 'Read the story and find the blank or hidden number.', '读故事，求出空格或藏起来的数。'),
    concept: t3('이야기에 나오는 수를 알맞은 자리에 넣고, 보이지 않는 수는 □로 두고 식을 세워요. 합이 가장 큰 수이고, "더 많다"는 큰 수 쪽이에요.',
      'Put each number in its place in the story, and write the unseen number as □ in an equation. The total is the biggest number, and "more" goes with the bigger number.',
      '把故事里的数放在合适的位置，看不见的数用□表示并列出算式。总数是最大的数，“多”对应较大的数。'),
    widgets: ['storyFill', 'mysteryBox', 'eqChoice'],
    levels: [
      { id: 1, label: t3('이야기에 수 채우기(3칸)', 'Fill the story (3 blanks)', '给故事填数(3空)'), params: { mode: 'fill', level: 'practice' } },
      { id: 2, label: t3('이야기에 수 채우기(4칸)', 'Fill the story (4 blanks)', '给故事填数(4空)'), params: { mode: 'fill', level: 'main' } },
      { id: 3, label: t3('상자 속 숨은 수', 'The number in the box', '盒子里的数'), params: { mode: 'unknown', ops: ['add', 'subL'] },
        concept: t3('상자 안의 수를 모르면 □로 두어요. 상자 + 밖 3개 = 모두 6개이면 □ + 3 = 6이고, □는 6−3=3이에요.',
          'When you do not know the number in the box, call it □. Box + 3 outside = 6 in all means □ + 3 = 6, so □ is 6 − 3 = 3.',
          '不知道盒子里有几个，就用□表示。盒子里的加外面3个一共6个，就是□+3=6，□等于6−3=3。') },
      { id: 4, label: t3('숨은 수와 식', 'Hidden number with equation', '未知数与算式'), params: { mode: 'unknown', ops: ['add', 'subL', 'subR'], eq: true } },
      { id: 5, label: t3('이야기와 식 짝짓기', 'Match story and equation', '故事与算式配对'), params: { mode: 'eqpick' },
        concept: t3('이야기를 식으로, 식을 이야기로 바꿔 봐요. "더 놓았다"는 +, "먹었다·꺼냈다"는 −예요. 모르는 수가 어디에 있는지도 살펴요.',
          'Turn a story into an equation and back. "Put more" is +, "ate" or "took out" is −. Check where the unknown number sits, too.',
          '把故事变成算式，再把算式变回故事。“又放了”是加，“吃了、拿出”是减。还要看清未知数在哪个位置。') },
      { id: 6, label: t3('잘못 계산한 수', 'The wrong calculation', '算错了的数'), params: { mode: 'wrong' },
        concept: t3('먼저 잘못 계산한 식에서 어떤 수를 거꾸로 구해요. 어떤 수에 3을 더해 8이 되었으면 어떤 수는 5예요. 그다음 바른 식으로 다시 계산해요.',
          'First work backwards from the wrong calculation to find the number: if adding 3 gave 8, the number is 5. Then calculate again the right way.',
          '先从算错的算式倒推出那个数：加3得到8，那个数就是5。再用正确的运算重新计算。') }
    ] };

  T.NL66 = { name: t3('그림과 장면 속 수학', 'Math in Pictures & Scenes', '图画与场景里的数学'), gen: 'g15_scene', prereq: ['NL15', 'NL13'],
    instr: t3('그림과 장면을 보고 알맞은 수를 구하시오.', 'Look at the picture and scene and find the number.', '看图和场景，求出合适的数。'),
    concept: t3('그림이 정답을 말해 줘요. 글에 나온 수가 그림과 다르면 그 수가 틀린 거예요. 그림에서 직접 세어 보고 바르게 고쳐요.',
      'The picture tells the truth. If a number in the sentence does not match the picture, that number is wrong: count in the picture and fix it.',
      '图画会说出事实。句子里的数和图不一样，那个数就是错的：在图里数一数，再改正。'),
    widgets: ['tapWrong', 'dartTarget', 'digitBoard', 'stairsGame', 'ageStory', 'sortBasket3'],
    levels: [
      { id: 1, label: t3('틀린 수 고치기', 'Fix the wrong number', '改正错的数'), params: { mode: 'tapwrong' } },
      { id: 2, label: t3('과녁 점수 더하기', 'Add the dart scores', '飞镖得分相加'), params: { mode: 'dart', level: 'sum' },
        concept: t3('과녁은 안쪽 띠일수록 점수가 높아요(3점·2점·1점). 화살이 박힌 띠의 점수를 읽고 모두 더해요.',
          'The closer to the centre, the higher the score (3, 2, 1). Read the band each arrow is in and add the scores.',
          '越靠近中心得分越高(3分、2分、1分)。读出每支箭所在圈的分数，再相加。') },
      { id: 3, label: t3('구름에 가린 화살', 'The arrow in the cloud', '藏在云里的箭'), params: { mode: 'dart', level: 'missing' } },
      { id: 4, label: t3('숫자판 세기(3종)', 'Count the digit board (3 kinds)', '数字板计数(3种)'), params: { mode: 'digits', kinds: 3 },
        concept: t3('숫자판의 칸을 눌러 가며 숫자마다 몇 번 나오는지 세어요. 가장 많은 수와 가장 적은 수를 비교하면 몇 개 차이인지도 알 수 있어요.',
          'Tap the squares to count how many times each digit shows up. Compare the most and the least to see how big the gap is.',
          '点一点格子，数出每个数字出现了几次。比较最多的和最少的，就知道相差几个。') },
      { id: 5, label: t3('숫자판 세기(4종)', 'Count the digit board (4 kinds)', '数字板计数(4种)'), params: { mode: 'digits', kinds: 4 } },
      { id: 6, label: t3('계단 오르기(이긴 횟수)', 'Climb the stairs (wins)', '爬台阶(赢的次数)'), params: { mode: 'game', level: 1 },
        concept: t3('이기면 2칸 올라가요. 3번 이기면 2+2+2=6칸이에요. 땅에서 출발해서 몇 번째 계단인지 세어요.',
          'Each win climbs 2 steps: 3 wins is 2 + 2 + 2 = 6 steps. Start from the ground and count which step you reach.',
          '赢一次上2级。赢3次就是2+2+2=6级。从地面出发，数一数到了第几级。') },
      { id: 7, label: t3('계단 오르내리기(이기고 지기)', 'Up and down the stairs', '上下台阶(赢和输)'), params: { mode: 'game', level: 2 } },
      { id: 8, label: t3('나이 알아보기', 'Working out ages', '算年龄'), params: { mode: 'age' },
        concept: t3('"곰은 토끼보다 2살 많아요"는 곰의 나이가 토끼의 나이에 2를 더한 수라는 뜻이에요. 적다고 하면 빼요.',
          '"The bear is 2 years older than the rabbit" means the bear\'s age is the rabbit\'s age plus 2. "Younger" means subtract.',
          '“小熊比小兔大2岁”表示小熊的年龄是小兔的年龄加2。说“小”就要减。') },
      { id: 9, label: t3('세 바구니 나누기', 'Three baskets', '三个篮子分类'), params: { mode: 'sort3' },
        concept: t3('세 종류를 각각의 바구니에 담아 개수를 세요. 가장 많은 것과 가장 적은 것의 개수를 빼면 차이를 알 수 있어요.',
          'Put each of the three kinds in its own basket and count. Subtract the smallest count from the biggest to find the difference.',
          '把三种东西分别放进各自的篮子数一数。最多的数量减去最少的数量，就是相差的个数。') }
    ] };
})();
