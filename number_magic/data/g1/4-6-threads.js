/* G1-4·5·6호 스레드 — NL27~NL36 (data/threads.js 뒤에 로드된다). 생성기는 engine/threads/g1-4-6.js.
   기존 NL1~NL16 의 레벨 id 는 건드리지 않는다: 이 호의 활동은 기존 생성기가 못 만드는 모양(열린 그리기·조건 수·고대 숫자 …)이라
   기존 스레드에 레벨을 덧붙이지 않고 새 스레드로 둔다(생성기 하나는 스레드 하나에만 묶인다).
   과정(courses.js) 편성·print-head 는 통합 단계에서 한다 — docs/yua-specs/INTEGRATION-4-6.md 참조. */
(function () {
  'use strict';
  window.NM_THREADS = window.NM_THREADS || {};
  const TH = window.NM_THREADS;
  const T = (ko, en, zh) => ({ ko, en, zh });
  const lv = (id, ko, en, zh, params, concept) => {
    const o = { id, label: T(ko, en, zh), params };
    if (concept) o.concept = concept;
    return o;
  };

  /* ── G1-4 ─────────────────────────────────────────────── */
  TH.NL27 = { name: T('홀짝과 조건에 맞는 수', 'Odd, Even & Number Hunt', '奇偶与找数'), gen: 'g46_numset', prereq: ['NL4'],
    instr: T('조건에 맞는 수를 찾으시오.', 'Find the numbers that fit.', '找出符合条件的数。'),
    concept: T('둘씩 짝을 지어 하나도 안 남으면 짝수, 하나가 남으면 홀수예요. 3보다 큰 홀수처럼 조건이 있으면 그 조건에 맞는 수만 찾아요.',
      'Pair things up two by two: if none is left over the number is even, if one is left over it is odd. A rule like "odd numbers greater than 3" means we pick only the numbers that fit.',
      '两个两个配对：都配上对就是偶数，剩一个就是奇数。像“比3大的奇数”这样的条件，只挑符合条件的数。'),
    widgets: ['pickCard', 'tilePick'],
    levels: [lv(1, '짝수·홀수 이름(5까지)', 'Even or odd (to 5)', '偶数奇数(到5)', { mode: 'parity', level: 'practice' }),
      lv(2, '짝수·홀수 이름(9까지)', 'Even or odd (to 9)', '偶数奇数(到9)', { mode: 'parity', level: 'main' }),
      lv(3, '조건 수 모두 찾기(쉬움)', 'Find all that fit (easy)', '找出所有符合的数(简单)', { mode: 'pick', level: 'practice' },
        T('조건에 맞는 수를 빠짐없이 모두 눌러요. 눌렀다가 다시 누르면 취소돼요.', 'Tap every number that fits the rule — tap again to undo.', '把符合条件的数全部点出来，再点一下可以取消。')),
      lv(4, '조건 수 모두 찾기(어려움)', 'Find all that fit (hard)', '找出所有符合的数(较难)', { mode: 'pick', level: 'main' }),
      lv(5, '조건 수의 개수(쉬움)', 'How many fit (easy)', '符合的数有几个(简单)', { mode: 'count', level: 'practice' },
        T('먼저 조건에 맞는 타일을 눌러 표시하고, 표시한 것이 몇 개인지 세요.', 'Mark the tiles that fit first, then count how many you marked.', '先点出符合条件的方块做记号，再数一数有几个。')),
      lv(6, '조건 수의 개수(어려움)', 'How many fit (hard)', '符合的数有几个(较难)', { mode: 'count', level: 'main' }),
      lv(7, '단서로 비밀 수 찾기', 'Find the secret number', '用线索找秘密数字', { mode: 'who', level: 'main' },
        T('단서를 하나씩 들으면 후보가 줄어들어요. 모든 단서에 맞는 수가 비밀 수예요.', 'Each clue crosses out some numbers. The secret number fits every clue.', '每听一条线索，候选数就少一些。同时符合所有线索的就是秘密数字。')),
      lv(8, '자물쇠 비밀번호', 'Lock code digit', '密码锁的数字', { mode: 'lock', level: 'main' })] };

  TH.NL28 = { name: T('도형수', 'Cell Numbers', '格子数'), gen: 'g46_cellcode', prereq: ['NL2'],
    instr: T('칸의 값을 더해 수를 읽거나 나타내시오.', 'Add the box values to read or show a number.', '把格子的数加起来，读出或表示一个数。'),
    concept: T('칸마다 정해진 수가 있고, ○가 놓인 칸의 수를 모두 더하면 그림이 나타내는 수가 돼요. 같은 수도 여러 가지 방법으로 나타낼 수 있어요.',
      'Each box has its own value. Add the values of the boxes that have a circle to read the number. The same number can be shown in more than one way.',
      '每个格子有自己的数，把有圆圈的格子的数加起来，就是图表示的数。同一个数可以用不同的方法表示。'),
    widgets: ['cellCode'],
    levels: [lv(1, '읽기(값이 보여요)', 'Read (values shown)', '读数(显示格子的数)', { mode: 'read', level: 'practice' }),
      lv(2, '읽기(약속만 보여요)', 'Read (rule only)', '读数(只看约定)', { mode: 'read', level: 'main' }),
      lv(3, '○로 수 나타내기', 'Show a number with circles', '用圆圈表示数', { mode: 'make', level: 'main' }),
      lv(4, '서로 다른 두 가지 방법', 'Two different ways', '两种不同的方法', { mode: 'make2', level: 'main' },
        T('같은 수를 서로 다른 칸 조합으로 두 번 나타내요. 첫 방법과 같으면 안 돼요.', 'Show the same number twice with different boxes — the second way must not match the first.', '用不同的格子组合把同一个数表示两次，第二种不能和第一种一样。')),
      lv(5, '세로 칸 섞어 풀기', 'Tall boxes mix', '竖排格子综合', { mode: 'mixv', level: 'main' }),
      lv(6, '가장 큰 수 고르기', 'Pick the biggest', '选最大的数', { mode: 'pickMax', level: 'main' })] };

  TH.NL29 = { name: T('고대의 숫자', 'Ancient Numbers', '古代的数字'), gen: 'g46_ancient', prereq: ['NL14'],
    instr: T('옛날 숫자 기호를 읽고 만드시오.', 'Read and build the old number symbols.', '读出并做出古代的数字符号。'),
    concept: T('옛날 사람들은 점·막대·쐐기·ㄱ자 같은 모양으로 수를 썼어요. 이집트·마야·로마·그리스·중국·메소포타미아마다 모양은 달라도, 몇 개를 묶어서 쓰는 규칙은 비슷해요.',
      'People long ago wrote numbers with dots, bars, wedges and hooks. Egypt, Maya, Rome, Greece, China and Mesopotamia each drew them differently, but the bundling rules look alike.',
      '古时候的人用点、横线、楔形、钩形来写数。埃及、玛雅、罗马、希腊、中国、美索不达米亚的样子各不相同，但“几个合成一捆”的规则很像。'),
    widgets: ['g46Match', 'pickCard', 'glyphBuild'],
    levels: [lv(1, '수-기호 잇기(5까지)', 'Match symbols (to 5)', '数字符号连线(到5)', { mode: 'match', level: 'practice' }),
      lv(2, '읽기·쌓기 섞기(5까지)', 'Read & build mix (to 5)', '读与拼综合(到5)', { mode: 'mix', level: 'practice' },
        T('예시를 보고 규칙을 알아내요. 점은 1, 막대는 5처럼 기호마다 뜻이 있어요.', 'Look at the examples and find the rule: for example a dot is 1 and a bar is 5.', '看例子找规律：比如点是1，横线是5。')),
      lv(3, '수-기호 잇기(9까지)', 'Match symbols (to 9)', '数字符号连线(到9)', { mode: 'match', level: 'main' }),
      lv(4, '규칙 찾아 읽기', 'Find the rule and read', '找规律读数', { mode: 'read', level: 'main' }),
      lv(5, '기호 쌓아 만들기', 'Build the symbol', '拼出符号', { mode: 'build', level: 'main' }),
      lv(6, '1과 5만 보고 읽기', 'Read from only 1 and 5', '只看1和5来读', { mode: 'read', level: 'main', deep: true }),
      lv(7, '1과 5만 보고 만들기', 'Build from only 1 and 5', '只看1和5来拼', { mode: 'build', level: 'main', deep: true })] };

  TH.NL30 = { name: T('수 채우기', 'Fill the Numbers', '数的填空'), gen: 'g46_seq', prereq: ['NL4'],
    instr: T('규칙을 찾아 빈 칸에 수를 쓰시오.', 'Find the rule and fill the blank.', '找出规律，填上空格。'),
    concept: T('하나씩 건너뛰며 세면 2씩 커지거나 작아져요. 규칙을 찾으면 빈 칸을 채울 수 있고, 달팽이·뱀 모양 길에서도 같은 규칙이 이어져요.',
      'Skip one each time and the numbers change by 2. Once you spot the rule you can fill any blank — even on a snail or snake path.',
      '隔一个数一个，数就每次变2。找到规律就能填空，蜗牛路和蛇路上规律也一样。'),
    widgets: ['g46Seq'],
    levels: [lv(1, '하나 건너 세기(쉬움)', 'Skip counting (easy)', '隔一个数(简单)', { mode: 'hop', level: 'practice' }),
      lv(2, '하나 건너 세기(내림 포함)', 'Skip counting (with down)', '隔一个数(含倒数)', { mode: 'hop', level: 'main' }),
      lv(3, '규칙 빈칸(쉬움)', 'Rule blank (easy)', '规律填空(简单)', { mode: 'rule4', level: 'practice' }),
      lv(4, '규칙 빈칸(어려움)', 'Rule blank (hard)', '规律填空(较难)', { mode: 'rule4', level: 'main' }),
      lv(5, '달팽이·뱀 길', 'Snail & snake path', '蜗牛路和蛇路', { mode: 'path', level: 'main' })] };

  /* ── G1-5 ─────────────────────────────────────────────── */
  TH.NL31 = { name: T('양의 수와 순서수', 'How Many vs Which Place', '数量与序数'), gen: 'g46_ordinal', prereq: ['NL8'],
    instr: T('몇 개인지, 몇째인지 구분하시오.', 'Tell how many from which place.', '分清“有几个”和“第几个”。'),
    concept: T('“모두 5명”처럼 몇 개인지 나타내는 수는 양의 수이고, “앞에서 셋째”처럼 몇째인지 나타내는 수는 순서수예요. 같은 줄에서도 두 가지 수가 함께 나와요.',
      '"Five friends in all" tells how many; "third from the front" tells which place. Both kinds of numbers can show up in the same line.',
      '“一共5个人”说的是有几个，“从前面数第3个”说的是第几个。同一队里，这两种数可以一起出现。'),
    widgets: ['qtyOrd', 'pickCard'],
    levels: [lv(1, '줄 서기 구분(쉬움)', 'Count or place (easy)', '分数量序数(简单)', { mode: 'qtyOrd', level: 'practice', kinds: ['line'] }),
      lv(2, '줄 서기 구분(어려움)', 'Count or place (hard)', '分数量序数(较难)', { mode: 'qtyOrd', level: 'main', kinds: ['line'] }),
      lv(3, '시상대·동전', 'Podium & coins', '领奖台与硬币', { mode: 'qtyOrd', level: 'main', kinds: ['prize', 'coins'] }),
      lv(4, '틀린 말 고치기(줄)', 'Fix the wrong sentence (line)', '改错话(队伍)', { mode: 'fix', level: 'main', kinds: ['frontFromBack'] },
        T('뒤에서 센 것과 앞에서 센 것은 달라요. 줄 전체 수에서 거꾸로 세어 맞는 수를 찾아요.', 'Counting from the back is not the same as counting from the front. Count backwards to find the right place.', '从后面数和从前面数不一样。倒着数，找出对的序号。')),
      lv(5, '틀린 말 고치기(계단·사탕)', 'Fix the wrong sentence (steps, candy)', '改错话(台阶、糖)', { mode: 'fix', level: 'main', kinds: ['floor', 'chainCompare'] })] };

  TH.NL32 = { name: T('자리와 줄', 'Seats & Lines', '座位与队伍'), gen: 'g46_seat', prereq: ['NL9'],
    instr: T('자리와 줄에서 몇째·몇 명인지 쓰시오.', 'Write which place or how many in seats and lines.', '写出座位和队伍里第几、几个人。'),
    concept: T('앞에서 몇째 줄, 왼쪽에서 몇째 칸으로 자리를 짚어요. 줄에서는 내 앞에 몇 명, 내 뒤에 몇 명인지 세고, 앞에서 센 것과 뒤에서 센 것을 서로 바꿀 수 있어요.',
      'A seat is found by "which row from the front" and "which seat from the left". In a line, count who is ahead and who is behind, and switch between counting from the front and from the back.',
      '座位用“前面数第几排、左边数第几个”来找。排队时数一数前面几个人、后面几个人，还能把从前数和从后数互相换算。'),
    widgets: ['seatGrid', 'g46Line', 'g46LineDraw'],
    levels: [lv(1, '자리 짚기(쉬움)', 'Seats (easy)', '找座位(简单)', { mode: 'seat', level: 'practice', kinds: ['find', 'read'] }),
      lv(2, '자리 짚기(어려움)', 'Seats (hard)', '找座位(较难)', { mode: 'seat', level: 'main', kinds: ['find'] }),
      lv(3, '몇째 줄·몇째 칸 읽기', 'Read the row or seat', '读第几排第几个', { mode: 'seat', level: 'main', kinds: ['read'] }),
      lv(4, '매표소 줄 앞뒤 수(쉬움)', 'Ticket line (easy)', '售票处队伍(简单)', { mode: 'around', level: 'practice' }),
      lv(5, '매표소 줄 앞뒤 수(어려움)', 'Ticket line (hard)', '售票处队伍(较难)', { mode: 'around', level: 'main' }),
      lv(6, '내 뒤에 그리기(쉬움)', 'Draw behind me (easy)', '画在我后面(简单)', { mode: 'behind', level: 'practice' }),
      lv(7, '내 뒤에 그리기(어려움)', 'Draw behind me (hard)', '画在我后面(较难)', { mode: 'behind', level: 'main' }),
      lv(8, '뒤에서 → 앞에서(쉬움)', 'Back to front (easy)', '从后数→从前数(简单)', { mode: 'convert', level: 'practice' }),
      lv(9, '뒤에서 → 앞에서(어려움)', 'Back to front (hard)', '从后数→从前数(较难)', { mode: 'convert', level: 'main' })] };

  TH.NL33 = { name: T('순위·그림그래프·규칙', 'Ranks, Graphs & Rules', '名次、图表与规则'), gen: 'g46_rank', prereq: ['NL10'],
    instr: T('단서를 읽고 순위·그래프·규칙을 알아내시오.', 'Use the clues to find ranks, graph facts and rules.', '根据线索找出名次、图表信息和规则。'),
    concept: T('“곰은 호랑이보다 앞에서 달려요” 같은 단서를 모으면 순위가 정해져요. 그림그래프는 쌓인 그림을 세어 읽고, 번호표 규칙은 수의 크기를 비교해서 판단해요.',
      'Clues like "the bear runs ahead of the tiger" fix the order. A picture graph is read by counting the stacked pictures, and a ticket rule is judged by comparing numbers.',
      '“熊跑在老虎前面”这样的线索凑在一起，名次就定下来了。图表要数一数叠起来的图，号码牌的规则要比较数的大小来判断。'),
    widgets: ['rankClue', 'barRead', 'pickCard'],
    levels: [lv(1, '달리기 순위 3마리(쉬움)', 'Race ranks, 3 animals (easy)', '赛跑名次3只(简单)', { mode: 'rank', level: 'practice', n: 3 }),
      lv(2, '달리기 순위 3마리(어려움)', 'Race ranks, 3 animals (hard)', '赛跑名次3只(较难)', { mode: 'rank', level: 'main', n: 3 }),
      lv(3, '달리기 순위 4마리', 'Race ranks, 4 animals', '赛跑名次4只', { mode: 'rank', level: 'main', n: 4 }),
      lv(4, '그림그래프 읽기(쉬움)', 'Picture graph (easy)', '读图表(简单)', { mode: 'graph', level: 'practice', kinds: ['count', 'most'] }),
      lv(5, '그림그래프 읽기', 'Picture graph', '读图表', { mode: 'graph', level: 'main', kinds: ['count', 'most'] }),
      lv(6, '그래프 차이·가장 적은 것', 'Graph: difference & fewest', '图表：差与最少', { mode: 'graph', level: 'main', kinds: ['diff', 'least'] }),
      lv(7, '그래프 둘째·같은 수', 'Graph: second & same', '图表：第二多与相同', { mode: 'graph', level: 'main', kinds: ['rank', 'same'] }),
      lv(8, '가려진 칸 알아내기', 'The hidden column', '被盖住的一列', { mode: 'graph', level: 'main', kinds: ['hidden'] }),
      lv(9, '번호표 규칙(쉬움)', 'Ticket rule (easy)', '号码牌规则(简单)', { mode: 'rule', level: 'practice' }),
      lv(10, '번호표 규칙(어려움)', 'Ticket rule (hard)', '号码牌规则(较难)', { mode: 'rule', level: 'main' })] };

  TH.NL34 = { name: T('수 기계 연쇄와 주고받기', 'Chains & Trading', '连续变化与互相给'), gen: 'g46_machine', prereq: ['NL11'],
    instr: T('차례대로 바뀐 뒤의 수를 쓰시오.', 'Write the number after each change in turn.', '写出依次变化之后的数。'),
    concept: T('수 기계가 여러 개 이어져 있으면 앞의 결과가 다음 기계의 시작이 돼요. 구슬을 주고받으면 주는 쪽은 줄고 받는 쪽은 늘어나요. 두 줄이 같아지려면 차이의 반을 옮겨요.',
      'When several machines are chained, each result is the start of the next one. Giving takes from one side and adds to the other. To make two rows equal, move half of the difference.',
      '好几台数字机器连起来时，前一个结果就是后一台的开始。互相给的时候，给的一边少、收的一边多。要让两行一样多，就移差的一半。'),
    widgets: ['chainMachine', 'tradeScene'],
    levels: [lv(1, '퀴즈 점수(쉬움)', 'Quiz score (easy)', '答题得分(简单)', { mode: 'chain', level: 'practice', theme: 'quiz' }),
      lv(2, '퀴즈 점수(어려움)', 'Quiz score (hard)', '答题得分(较难)', { mode: 'chain', level: 'main', theme: 'quiz' }),
      lv(3, '생일과 나이', 'Birthdays & age', '生日与年龄', { mode: 'chain', level: 'main', theme: 'age' }),
      lv(4, '전깃줄의 새', 'Birds on a wire', '电线上的小鸟', { mode: 'chain', level: 'main', theme: 'birds' }),
      lv(5, '계단 가위바위보', 'Stairs rock-paper-scissors', '台阶猜拳', { mode: 'chain', level: 'main', theme: 'stairs' }),
      lv(6, '주고 난 뒤(쉬움)', 'After giving (easy)', '给了之后(简单)', { mode: 'trade', level: 'practice', interaction: 'after' }),
      lv(7, '주고 난 뒤(어려움)', 'After giving (hard)', '给了之后(较难)', { mode: 'trade', level: 'main', interaction: 'after' }),
      lv(8, '똑같아지게 옮기기(쉬움)', 'Make them equal (easy)', '移到一样多(简单)', { mode: 'trade', level: 'practice', interaction: 'equal' }),
      lv(9, '똑같아지게 옮기기(어려움)', 'Make them equal (hard)', '移到一样多(较难)', { mode: 'trade', level: 'main', interaction: 'equal' })] };

  /* ── G1-6 ─────────────────────────────────────────────── */
  TH.NL35 = { name: T('서로 다르게 가르기', 'Split in Different Ways', '不同的分法'), gen: 'g46_split', prereq: ['NL2'],
    instr: T('합이 같도록 서로 다르게 나누시오.', 'Split the number in different ways.', '把一个数用不同的方法分开。'),
    concept: T('같은 수도 두 부분으로 가르는 방법이 여러 가지예요. 6은 1과 5, 2와 4, 3과 3으로 가를 수 있어요. 두 부분을 합하면 언제나 처음 수가 돼요.',
      'One number can be split into two parts in many ways: 6 is 1 and 5, 2 and 4, or 3 and 3. The two parts always add up to the whole.',
      '同一个数可以用很多种方法分成两部分：6可以分成1和5、2和4、3和3。两部分加起来总是原来的数。'),
    widgets: ['splitDraw'],
    levels: [lv(1, '접시에 가르기(쉬움)', 'Split on plates (easy)', '分到盘子里(简单)', { skin: 'plate', level: 'practice' }),
      lv(2, '접시에 가르기(어려움)', 'Split on plates (hard)', '分到盘子里(较难)', { skin: 'plate', level: 'main' }),
      lv(3, '생일 케이크 양초', 'Birthday cake candles', '生日蛋糕蜡烛', { skin: 'cake', level: 'main', lo: 6, hi: 9 }),
      lv(4, '색칠하며 9·8 가르기', 'Paint and split 9 or 8', '涂色分9和8', { skin: 'paint', level: 'main', lo: 8, hi: 9 }),
      lv(5, '색칠하며 5~8 가르기', 'Paint and split 5 to 8', '涂色分5到8', { skin: 'paint', level: 'main', lo: 5, hi: 8 }),
      lv(6, '막대 나눠 칠하기', 'Color a bar in two', '把横条涂成两色', { skin: 'bar', level: 'main', lo: 5, hi: 7 }),
      lv(7, '동그라미 가르기(쉬움)', 'Split circles (easy)', '分圆圈(简单)', { skin: 'circle', level: 'practice', lo: 4, hi: 5 }),
      lv(8, '동그라미 가르기(어려움)', 'Split circles (hard)', '分圆圈(较难)', { skin: 'circle', level: 'main', lo: 6, hi: 9 })] };

  TH.NL36 = { name: T('가르기 모형·남기기·덧셈식', 'Bond Diagrams, Leaving & Equations', '分合图、留下与加法算式'), gen: 'g46_addsub', prereq: ['NL2'],
    instr: T('모형·그림을 보고 빈칸의 수를 쓰시오.', 'Fill in the number from the diagram or picture.', '看图填出空格里的数。'),
    concept: T('가르기 모형은 위의 수가 아래 두 수로 나뉘고, 아래 두 수를 모으면 위의 수가 돼요. 몇 개를 없애면 얼마가 남는지는 뺄셈의 시작이고, 두 무리를 합하면 덧셈식 3 + 2 = 5가 돼요.',
      'In a bond diagram the top number splits into the two below, and the two below join to make the top. Removing some to leave a number is the start of subtraction, and joining two groups gives an addition like 3 + 2 = 5.',
      '分合图里，上面的数分成下面两个数，下面两个数合起来就是上面的数。去掉几个剩下多少是减法的开始，两群合起来就是加法算式 3 + 2 = 5。'),
    widgets: ['bondNum', 'crossLeave', 'pickCard', 'g46Sum', 'g46Match', 'rabbitGrid'],
    levels: [lv(1, '가르기 모형 빈칸(5까지)', 'Bond diagram blank (to 5)', '分合图填空(到5)', { mode: 'bondNum', level: 'practice' }),
      lv(2, '가르기 모형 빈칸(9까지)', 'Bond diagram blank (to 9)', '分合图填空(到9)', { mode: 'bondNum', level: 'main' }),
      lv(3, '막대 보고 모형 채우기', 'Fill the diagram from a bar', '看横条填分合图', { mode: 'bondNum', level: 'main', bar: true }),
      lv(4, '큰 수 찾기(쉬움)', 'Find the biggest (easy)', '找最大的数(简单)', { mode: 'bondMax', level: 'practice' }),
      lv(5, '큰 수 찾기(어려움)', 'Find the biggest (hard)', '找最大的数(较难)', { mode: 'bondMax', level: 'main' }),
      lv(6, '몇 개 없애야 할까(쉬움)', 'How many to remove (easy)', '要去掉几个(简单)', { mode: 'leave', level: 'practice', skins: ['balloon', 'cookie'] }),
      lv(7, '몇 개 없애야 할까(어려움)', 'How many to remove (hard)', '要去掉几个(较难)', { mode: 'leave', level: 'main', skins: ['balloon', 'cookie'] }),
      lv(8, '막대에서 지우기', 'Erase from a bar', '从横条里擦去', { mode: 'leave', level: 'main', skins: ['bar'], eq: true }),
      lv(9, '덧셈식 고르기(5까지)', 'Pick the equation (to 5)', '选加法算式(到5)', { mode: 'addEq', level: 'practice', input: 'pick' }),
      lv(10, '덧셈식 고르기(9까지)', 'Pick the equation (to 9)', '选加法算式(到9)', { mode: 'addEq', level: 'main', input: 'pick' }),
      lv(11, '합 쓰기', 'Write the sum', '写出和', { mode: 'addEq', level: 'main', input: 'write' }),
      lv(12, '답이 같은 식', 'Same answer', '得数相同的算式', { mode: 'sameSum', level: 'main' }),
      lv(13, '합이 같은 짝 고르기', 'Pick the pair with the sum', '选和相同的一对', { mode: 'pairPick', level: 'main' }),
      lv(14, '합이 되도록 이어요', 'Join to make the sum', '连成指定的和', { mode: 'pairSum', level: 'main' }),
      lv(15, '식과 값 잇기', 'Join expression to value', '算式和得数连线', { mode: 'exprMatch', level: 'main' }),
      lv(16, '수와 그림 잇기', 'Join number to picture', '数字和图连线', { mode: 'objMatch', level: 'main' }),
      lv(17, '토끼 합 칸(쉬움)', 'Rabbit sums (easy)', '兔子和格子(简单)', { mode: 'grid', level: 'practice' }),
      lv(18, '토끼 합 칸(어려움)', 'Rabbit sums (hard)', '兔子和格子(较难)', { mode: 'grid', level: 'main' })] };
})();
