/* G1-1~3호(N-01~N-03) 스레드 — data/threads.js 뒤에 로드(window.NM_THREADS 가 있음).
   ① 기존 NL1·NL4·NL8 에는 레벨만 4 이상으로 덧붙인다(1~3 불변 — courses.js 의 'NL1@k' 표기 호환).
      덧붙인 레벨은 params.g13 를 갖고, engine/threads/g1-1-3.js 가 원본 생성기를 감싸 이쪽으로 보낸다.
   ② 새 스레드 NL17~NL22 — 생성기 g13_n1 / g13_n2 / g13_n3 (같은 파일). 모든 문구 ko/en/zh. */
(function(){ 'use strict';
var T = window.NM_THREADS; if(!T) return;
function L3(ko, en, zh){ return { ko: ko, en: en, zh: zh }; }
function lv(id, label, params, concept){ var o = { id: id, label: label, params: params }; if(concept) o.concept = concept; return o; }
var G1 = function(modes, level){ return { g13: 'n1', modes: modes, level: level || 'main' }; };
var G2 = function(modes, level){ return { g13: 'n2', modes: modes, level: level || 'main' }; };
var G3 = function(modes, level){ return { g13: 'n3', modes: modes, level: level || 'main' }; };

/* ── 기존 스레드에 레벨 덧붙이기 ── */
if(T.NL1){
  T.NL1.levels.push(
    lv(4, L3('같은 종류 안에서 세기', 'Count within one kind', '同一类里数一数'), G1(['family']),
      L3('공이든 동물이든, 같은 종류 안에서도 하나만 골라 세어요. 축구공, 야구공, 럭비공이 섞여 있어도 야구공만 짚어 가며 세면 돼요.',
        'Even among the same kind of thing, count just one. With soccer balls, baseballs and rugby balls mixed together, point only at the baseballs.',
        '就算是同一类东西，也只数其中一种。足球、棒球、橄榄球混在一起时，只指着棒球数。')),
    lv(5, L3('네모 칸 세기와 칠하기', 'Count and color squares', '数方格和涂方格'), G1(['grid']),
      L3('붙어 있는 네모 칸을 하나씩 짚으며 세고, 말한 수만큼 칸을 칠해요. 몇 칸을 칠했는지가 곧 수예요.',
        'Count touching squares one by one, and color as many as the number says. How many you colored is the number.',
        '一个一个指着数相连的方格，也能按说的数涂出方格。涂了几格，数就是几。')));
}
if(T.NL4){
  T.NL4.levels.push(
    lv(4, L3('큰 수부터 점 잇기', 'Dot-to-dot, biggest first', '从大数开始连点'), G2(['dotsDown', 'dotsPre']),
      L3('점 잇기는 작은 수부터만 하는 게 아니에요. 가장 큰 수에서 시작해 1씩 줄어드는 순서로 이어도 같은 그림이 나와요.',
        'Dot-to-dot does not always start from the smallest number. Start from the biggest and go down by one — the same picture appears.',
        '连点不一定从小数开始。从最大的数开始，每次小1地连，也能连出同一幅图。')),
    lv(5, L3('규칙 찾아 빈칸 채우기', 'Find the pattern', '找规律填空'), G2(['repeat']),
      L3('같은 모양이 되풀이되는 규칙을 찾아요. 1, 2, 3, 4, 1, 2, 3, 4 다음에는 다시 1이 와요.',
        'Find the pattern that repeats. After 1, 2, 3, 4, 1, 2, 3, 4 comes 1 again.',
        '找出一再重复的规律。1、2、3、4、1、2、3、4的后面又是1。')),
    lv(6, L3('두 수 사이의 수', 'The number in between', '两个数中间的数'), G2(['between']),
      L3('5와 7 사이에 있는 수는 5보다 1 크고 7보다 1 작은 6이에요.',
        'The number between 5 and 7 is 6: one more than 5 and one less than 7.',
        '5和7中间的数是6：比5大1，比7小1。')));
}
if(T.NL8){
  T.NL8.levels.push(
    lv(4, L3('개수와 순서 칠하기', 'Color amount and place', '涂数量和顺序'), G3(['ord']),
      L3('"다섯"은 칸이 여러 개이고, "다섯째"는 칸이 딱 하나예요. 같은 수라도 개수를 말하는지 순서를 말하는지 구별해요.',
        '"Five" means several boxes; "the fifth" means exactly one box. The same number can tell how many or which one.',
        '"五个"是好几格，"第五个"只是一格。同一个数，要分清说的是数量还是顺序。')),
    lv(5, L3('오른쪽에서는 몇째?', 'Which place from the other side?', '从另一边数第几'), G3(['ordRow']),
      L3('왼쪽에서 셋째인 칸이 오른쪽에서는 몇째인지는 전체 칸 수에 따라 달라져요. 방향을 바꾸면 세는 순서도 바뀌어요.',
        'A box that is third from the left may be a different place from the right, depending on how many boxes there are. Change the side and the counting changes.',
        '从左边数第三格，从右边数是第几，要看一共有几格。换个方向，数的顺序也变了。')),
    lv(6, L3('양쪽에서 세어 모두 몇 칸', 'Count from both sides', '从两边数一共几格'), G3(['build']),
      L3('왼쪽에서 5째이고 오른쪽에서 4째이면, 겹치는 칸 하나를 빼고 5 + 4 − 1 = 8칸이에요.',
        'If it is 5th from the left and 4th from the right, the shared box is counted twice: 5 + 4 - 1 = 8 boxes.',
        '从左边数第5个、从右边数第4个，中间那一格被数了两次：5 + 4 − 1 = 8格。')));
}

/* ── 새 스레드 ── */
T.NL17 = { name: L3('여러 가지로 나타낸 수', 'One Number, Many Ways', '数的多种表示'), gen: 'g13_n1', prereq: ['NL1'],
  instr: L3('같은 수끼리 이어 보시오.', 'Match the same numbers.', '把相同的数连起来。'),
  concept: L3('같은 수도 여러 모양으로 나타낼 수 있어요. 숫자 5, 점 다섯 개, 10칸 틀에 다섯 칸, 손가락 다섯 개, 그리고 "다섯"이라는 말이 모두 같은 수예요.',
    'One number can look many ways: the digit 5, five dots, five boxes in a ten-frame, five fingers, and the word "five" all mean the same number.',
    '同一个数可以有很多种样子：数字5、五个点、十格框里的五格、五根手指，还有"五"这个字，都是同一个数。'),
  widgets: ['g13Rep', 'g13RepFill'],
  levels: [
    lv(1, L3('같은 수끼리 잇기(5까지)', 'Match the same (to 5)', '连相同的数(到5)'), G1(['rep'], 'practice')),
    lv(2, L3('같은 수끼리 잇기(9까지)', 'Match the same (to 9)', '连相同的数(到9)'), G1(['rep'], 'main'),
      L3('이번엔 손가락과 우리말 수까지 나와요. 한 손은 5까지 나타내고, 6부터는 두 손을 써요.', 'Now fingers and number words appear too. One hand shows up to 5; from 6 you use both hands.', '这次有手指和汉字数词。一只手最多表示5，从6开始要用两只手。')),
    lv(3, L3('표의 빈칸 채우기', 'Fill the empty box', '填表格里的空格'), G1(['repFill'], 'main'),
      L3('표 한 줄은 같은 수를 여러 모양으로 보여 줘요. 빈칸에는 나머지 칸이 가리키는 수를 나타낸 카드를 골라요.', 'One row of the table shows the same number in different ways. Pick the card that shows the number the other boxes show.', '表格的一行用不同的样子表示同一个数。选出表示其他格子所说的那个数的卡片。'))] };

T.NL18 = { name: L3('그림 속 도형·블록·길이', 'Shapes, Blocks & Length', '图中的图形·积木·长度'), gen: 'g13_n1', prereq: ['NL1'],
  instr: L3('그림을 보고 알맞은 수를 쓰시오.', 'Look at the picture and write the number.', '看图，写出合适的数。'),
  concept: L3('그림 속 도형과 쌓기나무, 선의 길이도 하나씩 짚어 가며 셀 수 있어요. 눈에 안 보이는 곳은 쌓인 모양을 생각해서 세요.',
    'Shapes in a picture, stacked blocks and the length of a line can all be counted one by one. For parts you cannot see, think about how the blocks are stacked.',
    '图里的图形、积木和线的长度，也能一个一个数。看不到的地方，要想一想积木是怎么摞的。'),
  widgets: ['g13Count', 'g13CircleCut', 'g13Blocks', 'g13DotLength', 'g13Odd', 'g13Grid'],
  levels: [
    lv(1, L3('도형 세기', 'Count shapes', '数图形'), G1(['shapes'], 'practice')),
    lv(2, L3('날씨 표 세기', 'Count in a weather chart', '数天气表'), G1(['table'], 'main'),
      L3('표는 칸마다 하나씩 들어 있어요. 한 줄씩 훑으며 빠뜨리지 않고 세요.', 'Each box of the chart holds one picture. Scan row by row so you do not skip any.', '表格每一格里有一幅图。一行一行看，不要漏掉。')),
    lv(3, L3('동그라미 나누기', 'Cut a circle', '分圆'), G1(['cut'], 'main'),
      L3('선을 그을 때마다 동그라미는 조각이 더 생겨요. 새 선이 이미 있는 선과 만나면 더 많이 나뉘어요.', 'Every line you draw makes more pieces. A new line that crosses an old one cuts into even more.', '每画一条线，圆就多出几块。新线和旧线相交，分出的块更多。')),
    lv(4, L3('점판에서 선의 길이', 'Length on a dot grid', '点阵上线的长度'), G1(['length'], 'main'),
      L3('점과 점 사이 한 칸이 길이 1이에요. 선이 꺾여도 칸을 하나씩 세면 길이를 알 수 있어요.', 'The gap between two neighboring dots is length 1. Even when the line bends, count the gaps one by one.', '相邻两点之间是长度1。线拐弯了，也一格一格数就知道长度。')),
    lv(5, L3('쌓기나무 개수', 'Count the blocks', '数积木'), G1(['blocks'], 'main'),
      L3('앞에 보이는 것만 세지 말고, 뒤와 아래에 쌓여 있을 나무도 생각해서 모두 세어요.', 'Do not count only what is in front; think about the blocks stacked behind and below.', '不要只数前面看得到的，后面和下面摞着的积木也要想到。')),
    lv(6, L3('칸 수가 다른 모양', 'The odd shape out', '找方格数不同的'), G1(['odd'], 'main')),
    lv(7, L3('한 줄 칸 칠하기', 'Color a row', '涂一行的格子'), G1(['rowpaint', 'grid'], 'main')),
    lv(8, L3('거꾸로 뒤집으면?', 'Turned upside down', '倒过来是什么'), G1(['turn'], 'main'))] };

T.NL19 = { name: L3('화살표 길 채우기', 'Fill the Arrow Path', '填箭头路径'), gen: 'g13_n2', prereq: ['NL4'],
  instr: L3('길을 따라 빈 칸에 알맞은 수를 쓰시오.', 'Follow the path and write the missing numbers.', '沿着路径，在空格里写出合适的数。'),
  concept: L3('길을 따라가며 수가 어떻게 변하는지 보고 빈칸을 채워요. 화살표 끝은 더 큰 수 쪽이고, 화살표가 두 줄이면 2씩 커져요.',
    'Follow the path and see how the numbers change to fill the blanks. The arrow points to the bigger number, and a double arrow means 2 more.',
    '沿着路径看数是怎么变的，再填空。箭头指向较大的数，双箭头表示大2。'),
  widgets: ['g13Path'],
  levels: [
    lv(1, L3('줄과 굽이길(쉬움)', 'Rows and bends (easy)', '直线与弯路(简单)'), G2(['pathRow', 'pathZig'], 'practice')),
    lv(2, L3('굽이길·꺾인 길(2씩·큰 수부터)', 'Bends and turns (by 2, downward)', '弯路与折线(2个2个·从大到小)'), G2(['pathZig', 'pathSnake'], 'main')),
    lv(3, L3('화살표 규칙(1씩·2씩)', 'Arrow rule (by 1 or 2)', '箭头规律(1个或2个)'), G2(['pathRing'], 'main'),
      L3('화살표 모양이 규칙이에요. 한 줄 화살표는 1 큰 수, 두 줄 화살표는 2 큰 수예요. 이미 있는 수에서 거꾸로도 따라가요.', 'The arrow shape is the rule. A single arrow is 1 more, a double arrow is 2 more. You can also follow it backward from a number you know.', '箭头的样子就是规则。单箭头大1，双箭头大2。也可以从已知的数倒着推。')),
    lv(4, L3('되풀이 칸 채우기', 'Repeating squares', '填重复的格子'), G2(['pathGrid'], 'main'),
      L3('칸을 따라가며 같은 수가 차례대로 되풀이돼요. 앞에 보이는 수들이 한 바퀴 돈 모양을 보고 이어 가요.', 'Follow the squares: the same numbers repeat in order. Use the first round you can see to continue.', '顺着格子走，同样的数依次重复。看前面露出的一圈，接着往下填。'))] };

T.NL20 = { name: L3('가까운 수와 표시', 'Near Numbers & Marking', '相近的数与标记'), gen: 'g13_n2', prereq: ['NL4'],
  instr: L3('알맞은 수에 표시하시오.', 'Mark the right numbers.', '在合适的数上做标记。'),
  concept: L3('수는 이웃이 있어요. 기준이 되는 수와 얼마나 떨어져 있는지 보면 가까운 수, 먼 수를 알 수 있어요. 건너뛰며 센 수에 색칠하는 것도 같은 눈으로 봐요.',
    'Numbers have neighbors. Seeing how far a number is from the base number tells you which is near and which is far. Coloring the numbers you hop to uses the same eye.',
    '数也有邻居。看它和基准数差多远，就知道哪个近、哪个远。给跳着数到的数涂色，也是同样的眼光。'),
  widgets: ['g13NumPick', 'g13Count', 'g13Order', 'g13Pinball'],
  levels: [
    lv(1, L3('뛰어 센 수·가까운 수 표시', 'Skip-count and near marks', '跳数与相近的数标记'), G2(['skipPaint', 'nearMark'], 'practice')),
    lv(2, L3('세어서 가장 가까운 수', 'Count, then the nearest number', '数一数再找最近的数'), G2(['nearest'], 'main'),
      L3('먼저 개수를 세고, 그 수가 후보에 없으면 가장 가까운 수를 골라요. 차이가 가장 작은 수가 정답이에요.', 'Count first. If that number is not among the choices, pick the closest one: the smallest difference wins.', '先数数量，如果选项里没有这个数，就选最接近的：差最小的就是答案。')),
    lv(3, L3('가까운 순서대로 놓기', 'Order by nearness', '按远近排顺序'), G2(['nearOrder'], 'main')),
    lv(4, L3('핀볼 길 찾기', 'Pinball path', '弹珠路径'), G2(['pinball'], 'main'),
      L3('1에서 시작해 이웃한 칸을 한 칸씩 지나요. ●는 지날 수 없고, 한 번 지난 칸은 다시 지날 수 없어요.', 'Start at 1 and step to a neighboring box each time. You cannot pass a ● or visit a box twice.', '从1出发，每次走到相邻的格子。不能经过●，走过的格子也不能再走。'))] };

T.NL21 = { name: L3('크기 비교와 정렬', 'Compare & Order', '比较大小与排序'), gen: 'g13_n3', prereq: ['NL8'],
  instr: L3('수의 크기를 비교하여 쓰시오.', 'Compare the numbers and write your answer.', '比较数的大小，写出答案。'),
  concept: L3('두 수를 비교할 때는 큰 쪽이 더 많은 쪽이에요. 부등호는 벌어진 쪽이 큰 수를 향해요. 7 > 6은 "7은 6보다 큽니다"예요.',
    'When you compare two numbers, the bigger one is the one with more. The sign opens toward the bigger number: 7 > 6 reads "7 is bigger than 6".',
    '比较两个数，大的就是多的。符号的开口朝向大的数。7 > 6 读作"7大于6"。'),
  widgets: ['g13Cmp', 'g13NumPick', 'g13Order', 'g13ArrowTri', 'g13Blocks'],
  levels: [
    lv(1, L3('> < 고르기', 'Pick > or <', '选 > 或 <'), G3(['cmp'], 'practice')),
    lv(2, L3('□ 안에 들어갈 수', 'Numbers that fit the box', '能填进□的数'), G3(['range'], 'main'),
      L3('□ > 2 이면 2보다 큰 수가 모두 들어갈 수 있어요. 2는 들어가지 않아요.', 'If □ > 2, every number bigger than 2 fits; 2 itself does not.', '□ > 2 时，比2大的数都能填，2本身不行。')),
    lv(3, L3('작은 수부터·큰 수부터 놓기', 'Order small to big or big to small', '从小到大、从大到小排'), G3(['order'], 'main')),
    lv(4, L3('화살표 상자', 'Arrow triangle', '箭头三角形'), G3(['arrowTri'], 'main'),
      L3('화살표는 큰 수에서 작은 수 쪽으로 향해요. 세 수를 둘씩 짝지어 어느 쪽이 더 큰지 따져 봐요.', 'Arrows go from the bigger number to the smaller one. Pair up the three numbers and ask which is bigger each time.', '箭头从大数指向小数。把三个数两两配对，比一比谁大。')),
    lv(5, L3('가장 큰 수·가장 작은 수', 'Biggest and smallest', '最大的数与最小的数'), G3(['minmax'], 'main')),
    lv(6, L3('쌓기나무 개수 비교', 'Compare block stacks', '比较积木块数'), G3(['blocksCmp'], 'main'))] };

T.NL22 = { name: L3('하나 더와 묶고 남은 수', 'One More & What Is Left', '多一个与剩下的数'), gen: 'g13_n3', prereq: ['NL8'],
  instr: L3('알맞은 수를 쓰시오.', 'Write the right number.', '写出合适的数。'),
  concept: L3('하나 더 많은 수는 바로 다음 수이고, 하나 더 적은 수는 바로 앞 수예요. 묶어 놓은 것을 빼고 남은 것을 세는 것도 수를 가르는 첫걸음이에요.',
    'One more is the very next number, and one less is the one just before. Leaving out the grouped ones and counting what is left is a first step to splitting numbers.',
    '多一个就是后面紧挨着的数，少一个就是前面紧挨着的数。去掉圈起来的，数剩下的，是分数的第一步。'),
  widgets: ['g13Count', 'g13NumPick', 'g13Make'],
  levels: [
    lv(1, L3('묶고 남은 수 세기', 'Count what is left', '数没圈的'), G3(['rest'], 'main')),
    lv(2, L3('하나 더·하나 적게', 'One more, one less', '多一个、少一个'), G3(['candy', 'more'], 'main'))] };
})();
