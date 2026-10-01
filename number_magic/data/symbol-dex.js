/* ============================================================
   Numbers of Magic — 기호 도감 확장 (2026-10-01, 원장 "기호 도감 더 업데이트해야지, 너무 적어")
   기존에는 중등 9개 유닛(M-01·10·15·37·42~46·57)만 기호 카드를 갖고 있어, 초등 아이는 도감에서
   아무것도 모을 수 없었고 도감 틀(SYMBOL_DEX_CANON 10칸) 중 5칸은 어느 유닛에도 연결되지 않아
   영원히 빈칸이었다. 여기서 **유닛마다 기호를 붙인다** — 그 유닛을 마치면 카드가 열린다.
   · 형식은 기존과 같다: {sym, read, translate, birth} — read·translate·birth 는 {ko,en,zh}.
   · 이미 같은 기호를 가진 유닛이 있으면(예 −) 중복해서 붙이지 않는다(도감은 기호로 센다).
   · 유래(birth)는 널리 알려진 것만 쓰고, 불확실한 건 "전해져요"로 둔다. 교재 문장은 쓰지 않았다.
   ============================================================ */
(function(){
'use strict';
const T = (ko, en, zh) => ({ ko, en, zh });
/* [유닛, 기호, 읽기, 뜻, 유래] */
const ROWS = [
  ['N-01', '0', T('영','Zero','零'), T('아무것도 없다는 뜻, 그리고 자리를 지키는 수','Means "nothing", and it also holds a place','表示“什么也没有”，也用来占位'),
    T('인도에서 점(•)으로 쓰던 것이 동그라미 0이 되었다고 해요. 7세기 인도의 브라마굽타가 0을 넣은 계산 규칙을 적었어요.','In India a dot became the round 0. Brahmagupta wrote down rules for calculating with zero in the 7th century.','印度人最初用点（•）表示，后来变成圆圈0。7世纪的婆罗摩笈多写下了含0的运算规则。')],
  ['N-06', '=', T('같다(이퀄)','Equals','等号'), T('양쪽이 똑같다는 약속','Both sides are the same','两边一样多'),
    T('1557년 영국의 로버트 레코드가 "두 평행선만큼 똑같은 것은 없다"며 처음 썼어요.','In 1557 Robert Recorde of England first used it, saying nothing is more alike than two parallel lines.','1557年英国的罗伯特·雷科德首次使用，他说“没有什么比两条平行线更相等”。')],
  ['A-01', '+', T('더하기(플러스)','Plus','加号'), T('더해서 합친다는 표시','Put together, add up','合在一起相加'),
    T('라틴어 et(그리고)를 빨리 쓰다가 십자(+) 모양이 되었다고 전해져요. 1489년 독일 책에 인쇄되어 퍼졌어요.','It is said to come from writing the Latin "et" (and) quickly. A German book printed it in 1489 and it spread.','据说由拉丁文“et”（和）快速书写演变而来。1489年德国的书印出它后传开了。')],
  ['N-03', '<', T('작다','Less than','小于'), T('왼쪽이 더 작다는 표시 — 뾰족한 쪽이 작은 수','The pointed side is the smaller number','尖的一头是较小的数'),
    T('영국의 토머스 해리엇이 만들었고, 1631년 그의 책에서 처음 나왔어요. 큰 수 쪽으로 입을 벌린 모양이에요.','Thomas Harriot of England made it; it first appeared in his book in 1631. The mouth opens toward the bigger number.','由英国的托马斯·哈里奥特创造，1631年首次出现在他的书中。开口朝向较大的数。')],
  ['N-03', '>', T('크다','Greater than','大于'), T('왼쪽이 더 크다는 표시 — 벌어진 쪽이 큰 수','The open side is the bigger number','开口的一头是较大的数'),
    T('< 와 같은 사람이 만든 짝꿍이에요. 악어 입이 큰 수를 먹으러 간다고 외우면 쉬워요.','It is the partner of < from the same inventor. Think of a crocodile mouth going for the bigger number.','与<是同一个人创造的一对。想象鳄鱼嘴去吃较大的数就好记。')],
  ['B-04', '×', T('곱하기','Times','乘号'), T('같은 수를 여러 번 더한다는 표시','Adding the same number many times','把同一个数加很多次'),
    T('1631년 영국의 윌리엄 오트레드가 + 를 비스듬히 눕혀 만들었다고 해요.','William Oughtred of England made it in 1631 by tilting the + sign.','1631年英国的威廉·奥特雷德把+斜过来创造了它。')],
  ['B-24', '÷', T('나누기','Divided by','除号'), T('똑같이 나눈다는 표시 — 점 둘이 나눈 조각이에요','Share equally — the dots are the pieces','平均分——两个点是分出的部分'),
    T('1659년 스위스의 요한 란이 책에서 쓰면서 영어권에 퍼졌어요. 분수 막대 위아래에 점을 찍은 모양이에요.','Johann Rahn of Switzerland used it in a 1659 book. It looks like a fraction bar with dots above and below.','1659年瑞士的约翰·拉恩在书中使用，之后在英语地区流行。像分数线上下各加一个点。')],
  ['B-17', '□', T('빈칸(네모)','Empty box','方框'), T('아직 모르는 수가 들어갈 자리','A spot for a number we do not know yet','还不知道的数的位置'),
    T('나중에 x 같은 문자로 바뀌어요. 모르는 수를 "잠깐 비워 두는" 첫 번째 방법이에요.','Later it becomes letters like x. It is the first way to "leave a gap" for the unknown.','以后会变成x之类的字母。这是给未知数“先留个空”的第一种办法。')],
  ['A-35', 'Ⅹ', T('로마 숫자 열','Roman ten','罗马数字十'), T('로마 사람들이 쓰던 10','The Romans\' ten','罗马人用的10'),
    T('손가락 한 손을 Ⅴ로, 두 손을 겹친 모양을 Ⅹ로 나타냈다고 전해져요.','One hand is said to be Ⅴ and two hands crossed make Ⅹ.','据说一只手是Ⅴ，两只手交叉就是Ⅹ。')],
  ['A-36', '.', T('소수점','Decimal point','小数点'), T('자연수와 1보다 작은 부분을 나누는 점','Separates whole numbers from the part smaller than 1','分开整数和小于1的部分'),
    T('스코틀랜드의 네이피어가 1617년 책에서 점으로 소수를 쓰는 방법을 널리 알렸어요.','John Napier of Scotland popularized the dot for decimals in a 1617 book.','苏格兰的纳皮尔在1617年的书中推广了用点表示小数。')],
  ['C-01', '²', T('제곱','Squared','平方'), T('같은 수를 두 번 곱한다는 뜻','Multiply a number by itself','同一个数乘两次'),
    T('한 변이 3인 정사각형의 넓이가 3×3이라서 "제곱(square)"이라고 불러요.','A square with side 3 has area 3×3, so we say "squared".','边长为3的正方形面积是3×3，所以叫“平方”。')],
  ['C-21', '½', T('이분의 일','One half','二分之一'), T('전체를 똑같이 둘로 나눈 한 조각','One of two equal parts','平均分成两份中的一份'),
    T('위는 몇 개, 아래는 몇 조각으로 나눴는지 — 가운데 막대는 아랍의 수학자들이 쓰기 시작했어요.','Top: how many pieces; bottom: how many parts. The middle bar came from Arab mathematicians.','上面是几份，下面是分成几份——中间的线最早由阿拉伯数学家使用。')],
  ['C-35', '%', T('퍼센트','Percent','百分号'), T('전체를 100으로 봤을 때의 몫','Parts out of 100','把整体看成100时的份数'),
    T('이탈리아어 "per cento(백 당)"를 흘려 쓰다가 0이 둘 달린 모양이 되었다고 전해져요.','It is said to come from scribbling the Italian "per cento" (per hundred) until two zeros were left.','据说由意大利语“per cento”（每一百）连笔书写，变成了带两个0的样子。')],
  ['H-12', '≈', T('약(거의 같다)','About equal','约等于'), T('정확히는 아니지만 거의 같다는 표시','Not exact, but very close','不完全相等，但非常接近'),
    T('물결 두 줄 — 어림한 값은 "출렁이는" 값이라는 뜻이에요. 19세기 말부터 쓰였어요.','Two wavy lines — an estimate "wobbles" a little. It has been used since the late 1800s.','两条波浪线——估算的值会有点“摇晃”。19世纪末开始使用。')],
  ['M-47', 'x', T('엑스','x','x'), T('아직 모르는 수를 대신하는 문자','A letter for a number we do not know yet','代替未知数的字母'),
    T('아라비아어 "무엇(shay)"에서 왔다는 이야기가 전해져요. 17세기 데카르트가 모르는 수는 x·y·z로 쓰자고 했어요.','A story says it comes from the Arabic "shay" (thing). In the 1600s Descartes chose x, y, z for unknowns.','据说来自阿拉伯语“shay”（某物）。17世纪笛卡尔提出用x、y、z表示未知数。')],
  ['M-64', '≤', T('작거나 같다','Less than or equal','小于等于'), T('< 에 = 가 더해진 표시 — 같은 것도 포함해요','< with = — it includes "equal" too','在<上加了=，同样包括“相等”'),
    T('1734년 프랑스의 부게가 작은 것 아래에 줄을 그어 만들었다고 해요.','Pierre Bouguer of France is said to have made it in 1734 by drawing a line under <.','据说1734年法国的布盖在<下面加一条线创造了它。')],
  ['M-68', '(x, y)', T('좌표','Coordinates','坐标'), T('평면 위 한 점의 주소 — 가로, 세로 순서','The address of a point — across, then up','平面上一点的地址——先横后纵'),
    T('데카르트가 하늘의 파리가 앉은 자리를 설명하려다 만들었다는 이야기가 전해져요.','A tale says Descartes invented it while trying to describe where a fly sat on the ceiling.','传说笛卡尔为了描述天花板上苍蝇的位置而发明了坐标。')],
  ['M-73', 'f(x)', T('에프 엑스','f of x','f(x)'), T('x를 넣으면 값이 하나 나오는 기계의 이름','A machine: put x in, get one value out','输入x，输出一个值的机器'),
    T('18세기 오일러가 "함수 f에 x를 넣는다"는 뜻으로 써서 널리 퍼졌어요.','In the 1700s Euler used it to mean "function f applied to x", and it spread.','18世纪欧拉用它表示“把x代入函数f”，从此广泛流传。')],
  ['M-50', '∴', T('그러므로','Therefore','所以'), T('"그래서 이렇게 된다"고 결론을 알리는 점 세 개','Three dots that announce a conclusion','宣布结论的三个点'),
    T('요한 란이 1659년 책에서 썼어요. 점 셋이 삼각형으로 모여 "그러므로"를 말해요.','Johann Rahn used it in 1659. Three dots in a triangle say "therefore".','约翰·拉恩1659年在书中使用。三个点排成三角形，表示“所以”。')],
  ['M-26', 'D', T('판별식','Discriminant','判别式'), T('이차방정식의 근이 몇 개인지 알려 주는 값','Tells how many roots a quadratic has','告诉二次方程有几个根的值'),
    T('"구별해 주는 것(discriminant)"의 첫 글자예요. D의 부호만 보면 실근의 개수를 알아요.','It is the first letter of "discriminant" — its sign alone tells the number of real roots.','它是“discriminant（判别）”的首字母。只看D的符号就知道实根的个数。')],
  ['M-27', 'αβ', T('알파 베타','Alpha, beta','阿尔法 贝塔'), T('방정식의 두 근을 부르는 이름','Names for the two roots of an equation','方程两个根的名字'),
    T('그리스 문자의 첫째·둘째 글자예요. "첫째 근, 둘째 근"이라는 뜻으로 써요.','The first and second Greek letters — "first root, second root".','希腊字母的第一、第二个。表示“第一个根，第二个根”。')],
  ['M-34', '⊥', T('수직','Perpendicular','垂直'), T('두 직선이 직각으로 만난다는 표시','Two lines meet at a right angle','两条直线成直角相交'),
    T('땅 위에 곧게 선 기둥 모양이에요. 17세기 프랑스의 에리곤이 썼다고 해요.','It looks like a pillar standing straight on the ground. Hérigone of France is said to have used it in the 1600s.','像笔直立在地上的柱子。据说17世纪法国的埃里戈纳使用过。')],
  ['M-34', '∥', T('평행','Parallel','平行'), T('아무리 늘려도 만나지 않는 두 직선','Two lines that never meet','怎么延长也不相交的两条直线'),
    T('나란한 두 줄 그대로를 그린 기호예요.','It simply draws two lines side by side.','就是把并排的两条线画下来。')],
  ['M-36', 'ⁿ√', T('n제곱근','nth root','n次方根'), T('n번 곱해서 처음 수가 되는 수','The number that gives the original after n multiplications','乘n次得到原数的那个数'),
    T('√ 에 작은 n을 달아 "몇 번 곱한 것의 뿌리인가"를 알려요.','A little n on √ says which power the root undoes.','在√上加一个小n，表示是几次方的根。')],
  ['M-44', "f'", T('에프 프라임','f prime','f撇'), T('순간 변화율, 곡선의 기울기를 알려 주는 새 함수','A new function giving the instant rate of change','给出瞬时变化率的新函数'),
    T('프랑스의 라그랑주가 18세기에 함수 위에 작은 점 하나(프라임)를 찍어 썼어요.','Lagrange of France wrote a small prime mark on the function in the 1700s.','18世纪法国的拉格朗日在函数上加一撇来表示。')],
  ['M-84', 'x̄', T('엑스 바','x bar','x拔'), T('자료의 평균','The mean of the data','数据的平均数'),
    T('모든 값을 한 줄로 눌러 평평하게 만든 값이라서 위에 줄(바)을 그어요.','Flatten all values into one — that is why there is a bar on top.','把所有数值压平成一个值，所以上面加一条横线。')],
  ['M-85', 'σ', T('시그마(표준편차)','Sigma (std. dev.)','西格玛（标准差）'), T('자료가 평균에서 얼마나 흩어졌는지','How spread out the data is from the mean','数据离平均数有多分散'),
    T('그리스 문자 σ는 영어 s에 해당해요. 표준편차(standard deviation)를 이 글자로 썼어요.','Greek σ matches the English s, used here for standard deviation.','希腊字母σ对应英文s，用来表示标准差。')],
  ['M-95', 'i', T('허수 단위 아이','Imaginary unit','虚数单位'), T('제곱하면 −1이 되는, 상상 속의 수','The imagined number whose square is −1','平方后等于−1的“想象中的数”'),
    T('18세기 오일러가 "imaginary(상상의)"의 첫 글자 i를 쓰기 시작했어요.','In the 1700s Euler began using i, the first letter of "imaginary".','18世纪欧拉开始用“imaginary（想象的）”的首字母i。')],
  ['M-108', '|x|', T('절댓값','Absolute value','绝对值'), T('0에서 x까지의 거리 — 부호를 떼요','Distance from 0 to x — drop the sign','从0到x的距离——去掉符号'),
    T('1841년 독일의 바이어슈트라스가 양옆에 세로 막대를 세워 쓰기 시작했어요.','Karl Weierstrass of Germany began putting vertical bars on both sides in 1841.','1841年德国的魏尔斯特拉斯开始在两边各画一条竖线。')],
  ['M-111', '!', T('팩토리얼','Factorial','阶乘'), T('1부터 그 수까지 모두 곱한다는 표시','Multiply all numbers from 1 up to it','从1乘到这个数'),
    T('1808년 프랑스의 크람프가 만들었어요. 놀란 것처럼 느낌표를 달았어요.','Christian Kramp made it in 1808. An exclamation mark, as if surprised how fast it grows.','1808年克拉姆普创造。用感叹号，好像在惊叹增长之快。')],
  ['M-113', 'ₙCᵣ', T('조합','Combination','组合'), T('순서를 따지지 않고 r개를 뽑는 방법의 수','Ways to pick r without caring about order','不管顺序，选出r个的方法数'),
    T('조합을 뜻하는 영어 Combination의 C예요.','The C is for "Combination".','C是“Combination（组合）”的首字母。')],
  ['M-122', '∈', T('속한다','Belongs to','属于'), T('어떤 모임(집합)의 한 식구라는 표시','"Is a member of" a group (set)','是某个集合中的一员'),
    T('1889년 이탈리아의 페아노가 그리스어 "~이다(ἐστί)"의 첫 글자 ε를 변형해 썼어요.','In 1889 Peano of Italy bent the Greek ε from "ἐστί" (is) into this sign.','1889年意大利的皮亚诺把希腊语“ἐστί（是）”的首字母ε变形而成。')],
  ['M-123', '∪', T('합집합','Union','并集'), T('두 모임을 모두 합친 것','Everything in either group','两个集合合在一起'),
    T('컵(cup) 모양이라 "모아 담는다"고 외워요. 페아노가 만들었어요.','Shaped like a cup that gathers things. Made by Peano.','形状像杯子（cup），能“装进所有东西”。由皮亚诺创造。')],
  ['M-123', '∩', T('교집합','Intersection','交集'), T('두 모임에 모두 들어 있는 것','What is in both groups','同时属于两个集合的部分'),
    T('모자(cap) 모양이에요. 두 모임이 겹친 부분만 덮어요.','Shaped like a cap that covers just the overlap.','形状像帽子（cap），只盖住两个集合重叠的部分。')],
  ['M-129', 'f⁻¹', T('역함수','Inverse function','反函数'), T('f가 한 일을 거꾸로 되돌리는 함수','Undoes what f did','把f所做的事倒回去的函数'),
    T('−1을 올려 쓴 건 "거꾸로"의 뜻이에요. 거듭제곱의 −1과 닮은 점이 있어요.','The raised −1 means "backwards", like the −1 power.','右上角的−1表示“倒过来”，和−1次幂有相似之处。')],
  ['M-136', 'e', T('이(오일러 수)','e (Euler\'s number)','e（欧拉数）'), T('약 2.718…, 자연스럽게 커지는 것의 밑','About 2.718… the base of natural growth','约2.718…，自然增长的底数'),
    T('이자를 잘게 쪼개 계산하다 발견된 수예요. 18세기 오일러가 e로 부르기 시작했어요.','Found while splitting interest into tiny pieces. Euler began calling it e in the 1700s.','在把利息分得越来越细的计算中发现。18世纪欧拉开始称它为e。')],
  ['M-140', '°', T('도','Degree','度'), T('원 한 바퀴를 360으로 나눈 각의 단위','One 360th of a full turn','把圆周分成360份的角度单位'),
    T('고대 바빌로니아 사람들이 60진법을 썼고 1년을 약 360일로 보았다는 데서 왔다고 해요.','Said to come from the ancient Babylonians, who used base 60 and counted a year as about 360 days.','据说源自古巴比伦人用六十进制、把一年看成约360天。')],
  ['M-140', 'θ', T('세타','Theta','西塔'), T('각을 나타내는 문자','A letter used for angles','表示角的字母'),
    T('그리스 문자예요. 수학자들이 각의 크기에 θ를 쓰기로 약속했어요.','A Greek letter that mathematicians agreed to use for angle sizes.','希腊字母，数学家们约定用它表示角的大小。')],
  ['M-142', 'sin', T('사인','Sine','正弦'), T('직각삼각형에서 높이와 빗변의 비','Ratio of opposite side to hypotenuse','直角三角形中对边与斜边的比'),
    T('아랍어 "지바"를 라틴어 "사이누스(만(灣))"로 잘못 옮기면서 sin이 되었다고 전해져요.','An Arabic word was mistranslated into the Latin "sinus" (bay), giving us sin.','据说阿拉伯语“jiba”被误译成拉丁语“sinus（海湾）”，才有了sin。')],
  ['M-135', '∞', T('무한대','Infinity','无穷大'), T('끝없이 커진다는 표시','Grows without end','无限变大'),
    T('1655년 영국의 존 월리스가 눕힌 8 모양으로 쓰기 시작했어요.','John Wallis of England started using the sideways 8 in 1655.','1655年英国的约翰·沃利斯开始用横着的8。')]
];
function merge(){
  const U = window.NM_UNITS; if(!U) return;
  const have = new Set();
  Object.keys(U).forEach(id => (U[id].symbols || []).forEach(s => have.add(s.sym)));
  ROWS.forEach(r => {
    const u = U[r[0]]; if(!u || have.has(r[1])) return;
    (u.symbols = u.symbols || []).push({ sym: r[1], read: r[2], translate: r[3], birth: r[4] });
    have.add(r[1]);
  });
}
window.NM_SYMBOL_ROWS = ROWS;
merge();
})();
