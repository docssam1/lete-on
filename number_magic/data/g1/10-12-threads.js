/* G1-10·11·12호 스레드 — NL47~NL56 (data/threads.js 뒤에 로드된다).
   기존 NL1~NL16 의 레벨 id 는 건드리지 않는다. 생성기는 engine/threads/g1-10-12.js, 화면 위젯은 app/g1/10-12.widgets.js,
   인쇄는 app/g1/10-12.print.js. 스레드 하나 = 생성기 하나, 레벨이 params.mode / params.kind 로 갈라진다.
   ⚠ 과정(data/courses.js) 편성·about 개수는 통합 단계에서 한다 — 여기선 스레드와 레벨만 등록. */
(function () {
  'use strict';
  const TH = window.NM_THREADS;
  if (!TH) return;
  const L3 = (ko, en, zh) => ({ ko, en, zh });
  const lv = (id, label, params, concept) => {
    const o = { id, label, params };
    if (concept) o.concept = concept;
    return o;
  };

  /* ═══ G1-10 — 더하기와 빼기 I (이야기·자료 정리) ═══ */

  TH.NL47 = {
    name: L3('이야기 읽고 풀기', 'Read the Story', '读故事做题'), gen: 'nlg10_text', prereq: ['NL2'],
    instr: L3('이야기를 읽고 알맞은 수를 쓰시오.', 'Read the story and write the right numbers.', '读故事，写出合适的数。'),
    concept: L3('이야기 속 빈칸은 문장을 끝까지 읽고 정해요. "더 많아요", "가장 적어요" 같은 말이 어느 수가 어디에 들어갈지 알려 줘요. 전체는 부분을 모두 합한 수라서 가장 큰 수예요.',
      'Read the whole story to fill each blank. Clues like "more" or "the fewest" tell you where each number goes. The whole is every part put together, so it is the biggest number.',
      '空格要把整个故事读完再填。"更多""最少"这些词会告诉你每个数该放在哪里。总数是把各部分合起来，所以是最大的数。'),
    widgets: ['g10_slotFill', 'g10_factsCard'],
    levels: [
      lv(1, L3('숫자 이야기 빈칸(쉬움)', 'Story blanks (easy)', '故事填空(简单)'), { mode: 'storyfill', lv: 1 }),
      lv(2, L3('숫자 이야기 빈칸(어려움)', 'Story blanks (hard)', '故事填空(较难)'), { mode: 'storyfill', lv: 2 }),
      lv(3, L3('정보 카드 읽기', 'Read the fact cards', '读信息卡片'), { mode: 'facts', lv: 1 },
        L3('이야기를 짧은 카드로 나눠 읽어요. 카드에서 물은 것에 필요한 수를 찾아 그대로 읽거나 더해요.',
          'The story is split into short cards. Find the numbers the question needs and read them off or add them.',
          '故事被分成短卡片。找出问题需要的数，直接读出来或者相加。')),
      lv(4, L3('정보 카드 — 필요 없는 정보 거르기', 'Fact cards with extra info', '信息卡片(含多余信息)'), { mode: 'facts', lv: 2 },
        L3('카드에는 문제와 상관없는 정보도 섞여 있어요. 묻는 것과 같은 종류의 카드만 골라 더하거나 빼요.',
          'Some cards have nothing to do with the question. Pick only the cards of the same kind as the question, then add or subtract.',
          '卡片里混着和问题无关的信息。只选和问题同类的卡片，再相加或相减。'))
    ]
  };

  TH.NL48 = {
    name: L3('틀린 곳 찾기와 식 고르기', 'Find the Mistake · Pick the Equation', '找错与选算式'), gen: 'nlg10_check', prereq: ['NL47'],
    instr: L3('그림을 보고 알맞게 답하시오.', 'Look at the picture and answer.', '看图作答。'),
    concept: L3('그림이 진짜 수를 알려 줘요. 문장의 수를 그림과 하나씩 맞춰 보고, 그림과 다른 곳을 찾아 바르게 고쳐요.',
      'The picture shows the true numbers. Match each number in the sentence with the picture, find the one that is different, and fix it.',
      '图画告诉你真正的数。把句子里的数和图画一个一个对一对，找出不同的地方再改对。'),
    widgets: ['g10_errorFind', 'g10_choiceCards'],
    levels: [
      lv(1, L3('틀린 곳 찾기(쉬움)', 'Find the mistake (easy)', '找错(简单)'), { mode: 'errorfind', lv: 1 }),
      lv(2, L3('틀린 곳 찾기(어려움)', 'Find the mistake (hard)', '找错(较难)'), { mode: 'errorfind', lv: 2 }),
      lv(3, L3('그림에 맞는 식 고르기', 'Pick the equation for the picture', '选和图画相符的算式'), { mode: 'pic2eq', lv: 1 },
        L3('그림에서 모으면 + , 덜어 내면 − 예요. 그림의 수를 식에 그대로 옮겨서, 계산 결과까지 맞는 식을 골라요.',
          'Putting together is +, taking away is −. Copy the numbers from the picture into the equation and pick the one whose answer is right too.',
          '合起来用＋，拿走用－。把图中的数照搬到算式里，选出得数也对的算式。')),
      lv(4, L3('식에 어울리는 이야기 고르기', 'Pick the story for the equation', '选和算式相配的故事'), { mode: 'eq2story', lv: 1 },
        L3('식에 + 가 있으면 더 얻는 이야기, − 가 있으면 먹거나 덜어 내는 이야기예요. 수까지 같은 이야기 카드를 골라요.',
          'A + means getting more; a − means eating or taking away. Pick the story card with the same operation and the same numbers.',
          '算式里有＋就是又得到的故事，有－就是吃掉或拿走的故事。选出运算和数都相同的故事卡片。'))
    ]
  };

  TH.NL49 = {
    name: L3('조사하기와 분류하기', 'Survey & Sort into a Table', '调查与分类'), gen: 'nlg10_survey', prereq: ['NL15'],
    instr: L3('그림을 세어 표를 채우거나 묻는 것에 답하시오.', 'Count the pictures to fill the table, or answer the question.', '数一数图画填表，或回答问题。'),
    concept: L3('여러 종류가 섞여 있으면 종류별로 하나씩 짚어 가며 세어서 표에 써요. 표를 보면 어느 것이 더 많은지, 합은 얼마인지, 차는 얼마인지 알 수 있어요.',
      'When several kinds are mixed, point at each kind one by one, count, and write it in a table. A table shows which has more, the total, and the difference.',
      '好几种东西混在一起时，一种一种地指着数，再写进表里。看表就能知道哪个更多、合起来是多少、相差多少。'),
    widgets: ['g10_surveyGrid'],
    levels: [
      lv(1, L3('세 종류 세어 표 채우기', 'Count 3 kinds into a table', '数三种填表'), { mode: 'tally3', lv: 1 }),
      lv(2, L3('네·다섯 종류 세어 표 채우기', 'Count 4–5 kinds into a table', '数四五种填表'), { mode: 'tally5', lv: 2 },
        L3('종류가 늘어도 방법은 같아요. 센 그림에 ✓ 표시를 하면서 한 종류씩 차례로 세어요.',
          'More kinds, same method: tick each picture you have counted and go one kind at a time.',
          '种类多了方法也一样：数过的图画打个✓，一种一种按顺序数。')),
      lv(3, L3('표 읽고 합·차 구하기', 'Read the table: sum & difference', '读表求和与差'), { mode: 'ask', lv: 3 },
        L3('표에 적힌 수로 물음에 답해요. "모두"는 더하고, "몇 개 더 많은지"는 큰 수에서 작은 수를 빼요.',
          'Answer from the numbers in the table. "In all" means add; "how many more" means big number minus small number.',
          '用表里的数回答问题。"一共"用加法，"多几个"用大数减小数。')),
      lv(4, L3('날씨표 세기', 'Count the weather chart', '数天气表'), { mode: 'weather-tally', lv: 1 },
        L3('맑음·흐림·비 그림을 종류별로 세어 날수를 표에 써요.', 'Count the sunny, cloudy and rainy pictures and write the number of days in the table.', '把晴、阴、雨的图画分别数一数，把天数写进表里。')),
      lv(5, L3('날씨표 읽고 합·차', 'Weather chart: sum & difference', '天气表求和与差'), { mode: 'weather-ask', lv: 1 },
        L3('날씨표에서 날수를 읽어 더하거나 빼요. 흐린 날과 비 온 날을 합치면 맑지 않은 날이에요.',
          'Read the number of days from the chart and add or subtract. Cloudy days plus rainy days are the days that were not sunny.',
          '从天气表读出天数再相加或相减。阴天和雨天合起来就是不是晴天的日子。'))
    ]
  };

  TH.NL50 = {
    name: L3('같게 나누기와 이야기 셈', 'Share Equally & Story Sums', '平均分与故事算术'), gen: 'nlg10_stories', prereq: ['NL47'],
    instr: L3('그림을 보고 답하시오.', 'Look at the picture and answer.', '看图作答。'),
    concept: L3('두 쪽을 똑같게 하려면 많은 쪽에서 적은 쪽으로 옮겨요. 차이의 반만 옮기면 같아져요. 묶음이 여러 개면 한 묶음 수를 여러 번 더해요.',
      'To make two sides equal, move items from the bigger side to the smaller side — just half of the difference. With several equal groups, add the group size again and again.',
      '想让两边一样多，就把多的一边移到少的一边——只要移差的一半。有好几份一样多的，就把一份的数连着加。'),
    widgets: ['g10_moveEqual', 'g10_storyRows'],
    levels: [
      lv(1, L3('같아지게 옮기기', 'Move to make equal', '移成一样多'), { mode: 'move' }),
      lv(2, L3('똑같이 나눠 담기', 'Share equally', '平均分'), { mode: 'share' },
        L3('둘이 똑같이 나누려면 하나씩 번갈아 담아요. 두 접시가 같아지면 한 접시의 수가 답이에요.',
          'To share equally, put one in each plate by turns. When both plates match, the number on one plate is the answer.',
          '要平均分给两个人，就轮流一人放一个。两个盘子一样多时，一个盘子里的数就是答案。')),
      lv(3, L3('따로 두고 나누기', 'Set aside, then split', '先留下再分'), { mode: 'take' },
        L3('전체에서 따로 둔 것을 먼저 빼요. 남은 것에서 한 손에 있는 수를 빼면 다른 손의 수가 나와요.',
          'First take away what was set aside from the whole. Then take the number in one hand from what is left to get the other hand.',
          '先从总数里减去留下的。再用剩下的减去一只手里的数，就是另一只手里的数。')),
      lv(4, L3('더 많다 → 모두 몇 마리', '"More than" then the total', '"比…多"再求一共'), { mode: 'more' },
        L3('"보다 몇 마리 더 많다"면 처음 수에 그만큼을 더해서 그 무리의 수를 먼저 구해요. 그다음 두 무리를 합해요.',
          '"k more than" means add k to the first number to get the second group. Then put both groups together.',
          '"比…多几只"就是先把第一个数加上几，求出第二群的数。然后把两群合起来。')),
      lv(5, L3('두 줄 비교 — 몇 개 더', 'Two rows — how many more', '两排比较——多几个'), { mode: 'pair' },
        L3('두 줄을 짝지어 비교해요. 짝이 없이 남은 그림의 수가 "더 많은 수"예요.',
          'Match the two rows in pairs. The pictures left without a partner show how many more.',
          '把两排一一配对。没有配上对的那些图画，就是"多出来的数"。')),
      lv(6, L3('똑같이 모아 세기', 'Count equal groups', '数一样多的几份'), { mode: 'groups' })
    ]
  };

  /* ═══ G1-11 — 더하기와 빼기 II (식·숫자 카드·세로셈) ═══ */

  TH.NL51 = {
    name: L3('크고 작은 수와 숫자 카드', 'Bigger/Smaller & Number Cards', '大小的数与数字卡片'), gen: 'nlg11_numpick', prereq: ['NL2'],
    instr: L3('조건에 맞는 수를 모두 ○표 하시오.', 'Circle every number that fits.', '把符合条件的数全部圈出来。'),
    concept: L3('식은 먼저 계산해서 값을 알아요. 그 값보다 작은 수, 큰 수, 같은 수를 모두 찾아요. 하나만 고르면 안 되고, 조건에 맞는 수를 전부 골라야 해요.',
      'Work out the equation first to get its value. Then find every number smaller than, bigger than, or equal to that value. Pick all of them, not just one.',
      '先把算式算出来得到值。再找出比它小、比它大或和它相等的所有数。不能只选一个，要全部选出来。'),
    widgets: ['g11_numPick'],
    levels: [
      lv(1, L3('식의 값과 비교(5까지)', 'Compare with a value (to 5)', '和算式的值比大小(5以内)'), { kind: 'cmp', lv: 1 }),
      lv(2, L3('식의 값과 비교(9까지)', 'Compare with a value (to 9)', '和算式的值比大小(9以内)'), { kind: 'cmp', lv: 2 }),
      lv(3, L3('카드 두 장의 합 — 만들 수 있는 수(3장)', 'Sums of two cards — can make (3 cards)', '两张卡片的和——能得到的数(3张)'), { kind: 'cards-can', lv: 1 },
        L3('카드 두 장을 골라 더해 나올 수 있는 수를 모두 찾아요. 같은 카드를 두 번 쓸 수는 없어요. 0 카드를 더해도 돼요.',
          'Find every number you can get by adding two different cards. You cannot use the same card twice. Adding a 0 card is fine.',
          '找出选两张不同的卡片相加能得到的所有数。同一张卡片不能用两次。可以加0的卡片。')),
      lv(4, L3('카드 두 장의 합 — 만들 수 있는 수(4장)', 'Sums of two cards — can make (4 cards)', '两张卡片的和——能得到的数(4张)'), { kind: 'cards-can', lv: 2 }),
      lv(5, L3('카드 두 장의 합 — 만들 수 없는 수', 'Sums of two cards — cannot make', '两张卡片的和——得不到的数'), { kind: 'cards-cannot', lv: 2 },
        L3('이번에는 반대로, 어떤 두 장을 더해도 나오지 않는 수를 모두 찾아요. 가능한 합을 먼저 다 적어 보면 쉬워요.',
          'This time it is the other way round: find every number that no two cards can add up to. Listing all possible sums first makes it easy.',
          '这次反过来：找出任何两张卡片相加都得不到的所有数。先把可能的和全部写出来就容易了。')),
      lv(6, L3('합의 범위로 카드 찾기', 'Find the card from a range', '由和的范围找卡片'), { kind: 'range', lv: 1 },
        L3('두 카드의 합이 어떤 수보다 크고 어떤 수보다 작아요. 첫 카드를 알면 합이 될 수 있는 값을 정해서 둘째 카드를 찾아요.',
          'The sum of two cards is more than one number and less than another. Knowing the first card, work out the possible sums to find the second card.',
          '两张卡片的和比一个数大、比另一个数小。知道第一张后，先定下和的可能值，再找出第二张。')),
      lv(7, L3('합이 맞는 세 장 찾기', 'Find three cards with a given sum', '找和正好是目标的三张'), { kind: 'sumpick', lv: 1 },
        L3('여러 카드 중 세 장을 골라 합이 목표가 되게 해요. 가장 큰 카드부터 시험해 보면 빨리 찾아요.',
          'Pick three of the cards so that they add up to the target. Trying the biggest card first helps you find it quickly.',
          '从几张卡片里选三张，让它们的和正好是目标。先试最大的卡片，找得更快。'))
    ]
  };

  TH.NL52 = {
    name: L3('식 빈칸과 세로셈', 'Equation Blanks & Vertical Sums', '算式空格与竖式'), gen: 'nlg11_eqvert', prereq: ['NL51'],
    instr: L3('빈칸에 알맞은 수를 쓰시오.', 'Write the right number in each blank.', '在空格里写出合适的数。'),
    concept: L3('별의 수는 전체예요. 더하기 식에서는 부분 + 부분 = 전체, 빼기 식에서는 전체 − 한 부분 = 다른 부분이에요. 모르는 칸이 어디에 있어도 이 관계로 찾아요.',
      'The stars show the whole. In an addition, part + part = whole; in a subtraction, whole − one part = the other part. Use this link to find the blank wherever it is.',
      '星星的数量是总数。加法里：部分＋部分＝总数；减法里：总数－一个部分＝另一个部分。空格在哪里，都用这个关系去找。'),
    widgets: ['g11_eqFill', 'g11_vertFill'],
    levels: [
      lv(1, L3('□의 값(6까지)', 'The value of □ (to 6)', '求□的值(6以内)'), { mode: 'eq', lv: 1 }),
      lv(2, L3('□의 값(9까지)', 'The value of □ (to 9)', '求□的值(9以内)'), { mode: 'eq', lv: 2 }),
      lv(3, L3('세로 덧셈(답 구하기)', 'Vertical addition (answer)', '竖式加法(求得数)'), { mode: 'vert', op: '+', lv: 1 },
        L3('세로셈은 같은 자리의 수를 위아래로 맞춰 써요. 더하기는 위 수와 아래 수를 합하고, 합은 선 아래에 써요.',
          'In a vertical sum, line the numbers up one above the other. For addition, add the top and bottom numbers and write the total under the line.',
          '竖式要把数上下对齐。加法就是把上面的数和下面的数相加，和写在横线下面。')),
      lv(4, L3('세로 뺄셈(답 구하기)', 'Vertical subtraction (answer)', '竖式减法(求得数)'), { mode: 'vert', op: '-', lv: 1 },
        L3('빼기는 위 수에서 아래 수를 덜어 내고 남은 수를 선 아래에 써요. 아래 수가 0이면 위 수 그대로예요.',
          'For subtraction, take the bottom number away from the top and write what is left under the line. If the bottom number is 0, the top stays the same.',
          '减法就是从上面的数里拿走下面的数，剩下的写在横线下面。下面是0时，结果还是上面的数。')),
      lv(5, L3('세로 덧셈(빈칸 어디든)', 'Vertical addition (any blank)', '竖式加法(空格在任意位置)'), { mode: 'vert', op: '+', lv: 2 },
        L3('빈칸이 위나 아래에 있으면 거꾸로 생각해요. 합에서 아는 수를 빼면 모르는 수가 나와요.',
          'If the blank is on the top or bottom, think backwards: take the number you know away from the total to find the missing one.',
          '空格在上面或下面时，倒过来想：用和减去已知的数，就得到缺的数。')),
      lv(6, L3('세로 뺄셈(빈칸 어디든)', 'Vertical subtraction (any blank)', '竖式减法(空格在任意位置)'), { mode: 'vert', op: '-', lv: 2 },
        L3('빼어지는 수가 빈칸이면 아래 수와 결과를 더해요. 아래 수가 빈칸이면 위 수에서 결과를 빼요.',
          'If the top number is the blank, add the bottom number and the result. If the bottom is the blank, take the result away from the top.',
          '被减数是空格时，把下面的数和结果相加。减数是空格时，用上面的数减去结果。'))
    ]
  };

  TH.NL53 = {
    name: L3('식 만들기와 동전 합·차', 'Make Equations & Coin Sums', '做算式与硬币的和差'), gen: 'nlg11_make', prereq: ['NL52'],
    instr: L3('카드로 식을 만들거나 동전을 세어 답하시오.', 'Make equations with cards or count coins and answer.', '用卡片做算式，或数硬币作答。'),
    concept: L3('카드를 골라 "수 ＋ 수 = 수"나 "수 － 수 = 수"를 만들어요. 계산이 맞아야 식이 되고, 같은 식을 두 번 세지 않아요. 한 닢이 1원인 동전은 개수가 곧 돈이에요.',
      'Pick cards to make "number + number = number" or "number − number = number". The calculation must be true, and the same equation is not counted twice. With 1-won coins, the number of coins is the amount of money.',
      '选卡片做出"数＋数＝数"或"数－数＝数"。算得对才是算式，同一个算式不重复算。每枚1元的硬币，个数就是钱数。'),
    widgets: ['g11_cardEq', 'g11_purse'],
    levels: [
      lv(1, L3('카드 두 장으로 목표 수 만들기', 'Make a target with two cards', '用两张卡片凑目标数'), { mode: 'cardeq', kind: 'target', lv: 1 }),
      lv(2, L3('1~9 카드로 목표 수 만들기', 'Make a target with cards 1–9', '用1到9的卡片凑目标数'), { mode: 'cardeq', kind: 'target', lv: 2 },
        L3('이번엔 1부터 9까지 카드를 몇 번이든 쓸 수 있어요. 덧셈은 두 수를 바꿔도 같은 식이에요(2+3과 3+2는 하나).',
          'Now you can use cards 1 to 9 as often as you like. Swapping the two numbers in an addition gives the same equation (2+3 and 3+2 count once).',
          '这次1到9的卡片可以用很多次。加法交换两个数还是同一个算式(2＋3和3＋2算一个)。')),
      lv(3, L3('카드 네 장으로 식 만들기', 'Make equations from four cards', '用四张卡片做算式'), { mode: 'cardeq', kind: 'free', lv: 2 },
        L3('카드 네 장 중 서로 다른 세 장으로 식을 만들어요. 큰 카드가 합이나 빼어지는 수 자리에 와요.',
          'Use three different cards out of four. The biggest card goes in the sum spot or the number you subtract from.',
          '用四张里不同的三张做算式。大的卡片放在和的位置或被减数的位置。')),
      lv(4, L3('세 수로 덧셈식 만들기', 'Addition from three numbers', '用三个数做加法算式'), { mode: 'cardeq', kind: 'triple', lv: 1 },
        L3('주머니 속 세 수 중 가장 큰 수는 합이에요. 작은 두 수의 순서를 바꾸면 덧셈식이 두 개 나와요.',
          'The biggest of the three numbers is the sum. Swapping the two smaller numbers gives two addition equations.',
          '三个数里最大的是和。把两个小数的顺序换一换，就得到两个加法算式。')),
      lv(5, L3('세 수로 덧셈식·뺄셈식 4개', 'Four equations from three numbers', '用三个数做4个算式'), { mode: 'cardeq', kind: 'triple', lv: 2 },
        L3('세 수가 하나의 가족이에요. 덧셈식 2개, 그리고 가장 큰 수에서 작은 수를 덜어 내는 뺄셈식 2개를 만들어요.',
          'The three numbers are one family: two addition equations, plus two subtractions that take a small number away from the biggest.',
          '这三个数是一家人：做2个加法算式，再做2个从最大数里减去小数的减法算式。')),
      lv(6, L3('1원 동전 세기', 'Count 1-won coins', '数1元的硬币'), { mode: 'purse', lv: 1 },
        L3('한 닢이 1원이니까 동전을 하나씩 짚어 세면 모두 몇 원인지 알아요.',
          'Each coin is 1 won, so pointing at the coins one by one tells you how many won there are.',
          '每枚硬币1元，一枚一枚指着数，就知道一共多少钱。')),
      lv(7, L3('두 사람의 돈 합하기', 'Add two purses', '把两个人的钱加起来'), { mode: 'purse', lv: 2 }),
      lv(8, L3('두 사람의 돈 — 합과 차', 'Two purses — sum & difference', '两个人的钱——和与差'), { mode: 'purse', lv: 3 },
        L3('합은 두 사람의 돈을 더하고, 차는 많은 쪽에서 적은 쪽을 빼요.',
          'The sum adds the two amounts; the difference takes the smaller amount away from the bigger.',
          '和是把两个人的钱相加，差是用多的减去少的。'))
    ]
  };

  /* ═══ G1-12 — 세 수·네 수 가르기·모으기 · 수 묶기 · 양팔저울 식 ═══ */

  TH.NL54 = {
    name: L3('여러 수로 가르고 모으기', 'Split & Gather into Many Numbers', '分成多个数与合起来'), gen: 'nlg12_parts', prereq: ['NL2'],
    instr: L3('빈 칸에 알맞은 수를 써서 합이 맞게 하시오.', 'Write numbers in the blanks so the total is right.', '在空格里写数，让总数正确。'),
    concept: L3('큰 수는 세 수나 네 수로도 갈라요. 칸마다 1 이상을 쓰고, 모든 칸을 합하면 위(또는 아래)의 수가 되어야 해요. 답은 한 가지가 아니에요.',
      'A bigger number can split into three or four numbers too. Write at least 1 in each space, and all the spaces together must add up to the number shown. There is more than one right answer.',
      '大数也可以分成三个或四个数。每个格里至少写1，所有格合起来要等于给出的数。答案不止一种。'),
    widgets: ['g12_partsFill'],
    levels: [
      lv(1, L3('세 수로 가르기(한 칸 보여 줌)', 'Split into three (one shown)', '分成三个数(给出一个)'), { arts: ['ladybug', 'plane'], parts: 3, wmin: 4, wmax: 6, given: 1 }),
      lv(2, L3('세 수로 가르기(9까지)', 'Split into three (to 9)', '分成三个数(到9)'), { arts: ['ladybug', 'plane', 'tree'], parts: 3, wmin: 5, wmax: 9 }),
      lv(3, L3('세 수 모으기', 'Gather three numbers', '三个数合起来'), { art: 'gather', parts: 3, wmin: 5, wmax: 9 },
        L3('위의 세 칸에 수를 써서 모두 합하면 아래의 수가 되게 해요. 두 칸을 먼저 정하고 남은 칸은 부족한 만큼 써요.',
          'Write numbers in the three top spaces so they add up to the number below. Choose two first, then write whatever is missing in the last one.',
          '在上面三个格里写数，让它们合起来等于下面的数。先定两个，最后一个写还差的数。')),
      lv(4, L3('네 수로 가르고 모으기', 'Split & gather four numbers', '四个数的分与合'), { arts: ['balloons', 'tree'], parts: 4, wmin: 4, wmax: 9 }),
      lv(5, L3('같은 수 모으기', 'Gather equal numbers', '相同的数合起来'), { art: 'balloons', partsAny: [2, 3], equal: true },
        L3('칸마다 같은 수를 써서 합이 되게 해요. 2로 합이 6이면 3+3처럼, 한 칸의 수를 정하면 나머지도 같아요.',
          'Write the same number in every space so they add up to the total. For a total of 6 in two spaces it is 3 + 3: once you choose one, the others match.',
          '每个格写同一个数，让合起来等于总数。两个格合起来是6就是3＋3：定下一个，其他的也一样。')),
      lv(6, L3('삼각형 모으기(한 칸 비움)', 'Triangle gather (one blank)', '三角形合起来(空一个)'), { art: 'triangle', parts: 3, wmin: 4, wmax: 9, given: 2 },
        L3('세 꼭짓점의 수를 모두 더하면 가운데 수가 돼요. 아는 수를 더한 뒤 모자란 만큼을 빈 칸에 써요.',
          'The three corner numbers add up to the middle number. Add the ones you know, then write what is missing in the blank.',
          '三个顶点的数加起来等于中间的数。先把已知的数加起来，再把还差的写进空格。')),
      lv(7, L3('마름모 모으기(한 칸 비움)', 'Diamond gather (one blank)', '菱形合起来(空一个)'), { art: 'diamond', parts: 4, wmin: 4, wmax: 9, given: 3 }),
      lv(8, L3('여러 가지 방법 찾기', 'Find several ways', '找出多种分法'), { arts: ['ladybug', 'tree'], parts: 3, wmin: 5, wmax: 9, distinct: 'all' },
        L3('같은 수를 갈라도 방법이 여러 가지예요. 순서만 바꾼 것은 같은 방법이에요(1,2,3과 3,2,1은 하나).',
          'One number can be split in many ways. Just swapping the order is the same way (1,2,3 and 3,2,1 count once).',
          '同一个数可以有很多种分法。只是换了顺序算同一种(1,2,3和3,2,1算一种)。'))
    ]
  };

  TH.NL55 = {
    name: L3('수 묶기', 'Group the Numbers', '圈数字'), gen: 'nlg12_gridgroup', prereq: ['NL54'],
    instr: L3('이웃한 수를 묶어 합이 목표가 되게 하시오.', 'Group neighbouring numbers so they add up to the target.', '把相邻的数圈起来，让和等于目标。'),
    concept: L3('격자에서 서로 붙어 있는 칸(옆·위아래·비스듬히)만 한 묶음이 될 수 있어요. 묶은 칸의 수를 모두 더해서 목표가 되면 성공이고, 한 칸은 한 묶음에만 써요.',
      'Only squares that touch (sideways, up-down or diagonally) can be in one group. If the numbers in the group add up to the target, it works. Each square can be in only one group.',
      '只有互相挨着的格子(左右、上下、斜着)才能圈成一组。圈起来的数加起来等于目标就成功，一个格子只能用在一组里。'),
    widgets: ['g12_gridGroup'],
    levels: [
      lv(1, L3('4×4 세 수 묶기', '4×4 groups of three', '4×4圈三个数'), { n: 4, size: 3, need: 2, tmin: 7, tmax: 9, zeros: 2, lv: 1 }),
      lv(2, L3('5×5 세 수 묶기', '5×5 groups of three', '5×5圈三个数'), { n: 5, size: 3, need: 3, tmin: 6, tmax: 9, zeros: 2, lv: 2 }),
      lv(3, L3('5×5 네 수 묶기', '5×5 groups of four', '5×5圈四个数'), { n: 5, size: 4, need: 3, tmin: 8, tmax: 9, zeros: 2, lv: 3 })
    ]
  };

  TH.NL56 = {
    name: L3('양팔저울 식', 'Balance-Scale Equations', '天平算式'), gen: 'nlg12_eqscale', prereq: ['NL10', 'NL54'],
    instr: L3('양쪽 접시의 결과가 같아지게 ＋ 또는 －를 쓰시오.', 'Write + or − so both pans give the same result.', '写＋或－，让两边盘子的结果一样。'),
    concept: L3('저울이 수평이 되려면 양쪽 접시의 계산 결과가 같아야 해요. ＋와 －를 바꿔 넣어 보며 양쪽 값이 같아지는 것을 찾아요.',
      'The scale is level only when both pans give the same result. Try + and − in the blanks until both sides have the same value.',
      '天平要保持水平，两边盘子的计算结果必须相同。把＋和－换着填一填，找到两边相等的那种。'),
    widgets: ['g12_eqScale'],
    levels: [
      lv(1, L3('한쪽 식의 ＋/－ 고르기', 'Pick + or − on one side', '选一边的＋/－'), { both: false }),
      lv(2, L3('양쪽 식의 ＋/－ 고르기', 'Pick + or − on both sides', '选两边的＋/－'), { both: true },
        L3('양쪽 모두 빈칸이에요. 네 가지 조합 중 양쪽 값이 같아지는 것은 딱 하나예요.',
          'Both sides have a blank. Of the four combinations, exactly one makes both sides equal.',
          '两边都有空格。四种组合里，只有一种能让两边相等。'))
    ]
  };
})();
