/* ============================================================
   Numbers of Magic — 식 안 한국어 설명 번역(2026-11-16)

   생성기가 식(tex)에 한국어 설명을 \text{…}로 넣는다(「52\text{의 약수}」「x=-3\text{일 때}」).
   한국어 학습지는 그대로 두고, 영어·중국어 학습지에서만 engine/tex-tidy.js 의 tidy()가
   그리기 직전에 이 표로 바꾼다. 생성기는 고치지 않는다(한국어 판이 바뀌지 않게).

   - rules: 식 전체에 거는 정규식. 어순이 바뀌는 것(「52의 약수」→「factors of 52」)을 여기서 한다.
            차례대로 걸린다. 바꾼 결과의 \text{…} 안에는 한글이 남지 않아야 한다.
   - text : \text{…} 안 글을 통째로 바꾸는 표(앞뒤 빈칸은 원래대로 둔다).
   표에 없는 글은 한국어 그대로 남는다 — 검사: 영어·중국어로 전 회차를 그려 한글을 센다.
   ============================================================ */
(function () {
  'use strict';
  const HANGUL = /[가-힣]/;

  /* ---- 규칙에서 쓰는 조각 ---- */
  const NUM = String.raw`\d+(?:,\d{3})*`;
  const SUBJ = String.raw`(\\sqrt\{\d+\}|${NUM} \\div ${NUM}|${NUM}(?:,\\,\s*${NUM})*)`;
  const POINT = String.raw`(\\left\([^()]*?\\right\)|\([^()]*?\))`;
  const MID = String.raw`((?:(?!\\text\{)[\s\S])*?)`;
  const rx = (str) => new RegExp(str, 'g');
  const T = (re) => String.raw`\\text\{` + re + String.raw`\}`;
  const ORD = (n) => { n = +n; const m = n % 100; if (m >= 11 && m <= 13) return n + 'th'; return n + (['th', 'st', 'nd', 'rd'][n % 10] || 'th'); };
  const PLACES = '십만|천만|천억|백억|일|십|백|천|만';
  const PLACE_EN = { '일': 'ones', '십': 'tens', '백': 'hundreds', '천': 'thousands', '만': 'ten-thousands', '십만': 'hundred-thousands', '천만': 'ten-millions', '백억': 'ten-billions', '천억': 'hundred-billions' };
  const PLACE_ZH = { '일': '个位', '십': '十位', '백': '百位', '천': '千位', '만': '万位', '십만': '十万位', '천만': '千万位', '백억': '百亿位', '천억': '千亿位' };
  const SIGN_EN = { '음수': 'negative ', '양수': 'positive ' };
  const SIGN_ZH = { '음수': '负数', '양수': '正数' };

  /* 어순이 바뀌는 것. { re: 정규식(g), en: 바꿀 글, zh: 바꿀 글 } — $1 등으로 잡은 조각을 쓴다.
     en 이나 zh 를 빼면 그 언어에서는 이 규칙을 건너뛴다. */
  const RULES = [
    /* 끝자리 — 「N의 배수」 규칙보다 먼저 */
    { re: rx(T('끝자리가 ') + String.raw`\s*(\d+)` + T('의 배수')),
      en: '\\text{last digit} = \\text{a multiple of }$1', zh: '\\text{末位数字} = $1\\text{ 的倍数}' },
    { re: rx(T('끝자리가 ') + String.raw`\s*([\d,\\\s]+?)` + T(' 중 하나')),
      en: '\\text{last digit is one of }$1', zh: '\\text{末位数字是 }$1\\text{ 中的一个}' },
    /* x=4일 때 … → when x=4, … */
    /* 「x=-4,\;y=-3일 때」처럼 여럿이어도 when 은 맨 앞에, 「x = 2 \text{일 때}」처럼 띄어 써도 */
    { re: rx(String.raw`([a-zA-Z]\s*=\s*-?[\d.]+(?:,\\;\s*[a-zA-Z]\s*=\s*-?[\d.]+)*)\s*` + T(String.raw`일 때 ?`)),
      en: '\\text{when }$1\\text{, }', zh: '\\text{当 }$1\\text{ 时，}' },
    /* (x에 대한 항등식) */
    { re: rx(String.raw`\(([a-zA-Z])` + T('에 대한 항등식') + String.raw`\)`),
      en: '(\\text{identity in }$1)', zh: '(\\text{关于 }$1\\text{ 的恒等式})' },
    /* 7의 배수? */
    { re: rx(SUBJ + T(String.raw`의 배수\? `)), en: '\\text{multiple of }$1\\text{? }', zh: '$1\\text{的倍数？}' },
    /* 7은 소인수? */
    { re: rx(SUBJ + T(String.raw`[은는] 소인수\? `)), en: '\\text{Is }$1\\text{ a prime factor? }', zh: '$1\\text{是质因数吗？}' },
    /* 약수·배수 … 의 X */
    { re: rx(SUBJ + T('의 최소공배수')), en: '\\text{LCM of }$1' },
    { re: rx(SUBJ + T('의 최대공약수')), en: '\\text{GCD of }$1' },
    { re: rx(SUBJ + T('의 약수 개수')), en: '\\text{number of factors of }$1' },
    { re: rx(SUBJ + T('의 배수')), en: '\\text{multiples of }$1' },
    { re: rx(SUBJ + T('의 약수')), en: '\\text{factors of }$1' },
    { re: rx(SUBJ + T('의 공약수')), en: '\\text{common factors of }$1' },
    { re: rx(SUBJ + T('의 공배수')), en: '\\text{common multiples of }$1' },
    { re: rx(SUBJ + T('의 정수 부분')), en: '\\text{integer part of }$1' },
    { re: rx(SUBJ + T('의 몫의 일의 자리')), en: '\\text{ones digit of the quotient }$1' },
    /* 74에서 십의 자리 숫자 */
    { re: rx(SUBJ + T(`에서 (${PLACES})의 자리 숫자`)),
      en: (m, n, p) => `\\text{${PLACE_EN[p]} digit of }${n}`,
      zh: (m, n, p) => `${n}\\text{的${PLACE_ZH[p]}数字}` },
    /* 14 = 10이 1개 + 4 */
    { re: rx(T(String.raw`(\d+)이 `) + MID + T('개')), en: '$2 \\times $1', zh: '$2 \\times $1' },
    /* 소수점 아래 N번째 자리 숫자 */
    { re: rx(T(String.raw`(\d+)÷(\d+)의 소수점 아래 (\d+)번째 자리 숫자`)),
      en: (m, a, b, k) => `\\text{the ${ORD(k)} digit after the decimal point of }${a}\\div ${b}`,
      zh: (m, a, b, k) => `\\text{${a}÷${b}的小数点后第${k}位数字}` },
    /* 소인수·소수 */
    { re: rx(T(String.raw`\s*[은는] 소수\s*`)), en: '\\text{ is prime}', zh: '\\text{ 是质数}' },
    { re: rx(T('[은는] 소수이므로 소인수')), en: '\\text{ is prime, so it is a prime factor}', zh: '\\text{ 是质数，所以是质因数}' },
    { re: rx(T(String.raw`은 소수도 합성수도 아님`)), en: '\\text{ is neither prime nor composite}', zh: '\\text{ 既不是质数也不是合数}' },
    { re: rx(T(String.raw`의 약수는 1과 (\d+)뿐 → 소수`)), en: '\\text{ has only the factors 1 and }$1\\text{ → prime}', zh: '\\text{ 只有因数 1 和 }$1\\text{ → 质数}' },
    { re: rx(T(String.raw` → 합성수`)), en: '\\text{ → composite}', zh: '\\text{ → 合数}' },
    /* 큰 수 단위 안 쓰는 말들 */
    { re: rx(T(String.raw`(\d+)까지 거리`)), en: '\\text{distance to }$1', zh: '\\text{到 }$1\\text{ 的距离}' },
    /* y=3x²을 y축 방향으로 -6만큼 */
    { re: rx(T('을 ') + String.raw`\s*([xy])\s*` + T('축 방향으로 ') + String.raw`\s*(-?\d+)\s*` + T('만큼')),
      en: '\\text{ shifted by } $2 \\text{ along the }$1\\text{-axis}', zh: '\\text{ 沿 }$1\\text{ 轴方向平移 } $2 \\text{ 个单位}' },
    { re: rx(T('을 ') + String.raw`\s*x\s*` + T('축으로 ') + String.raw`\s*(-?\d+),\s*\\;\s*y\s*` + T('축으로 ') + String.raw`\s*(-?\d+)`),
      en: '\\text{ shifted } $1 \\text{ along the }x\\text{-axis and } $2 \\text{ along the }y\\text{-axis}',
      zh: '\\text{ 沿 }x\\text{ 轴平移 } $1 \\text{ 个单位，沿 }y\\text{ 轴平移 } $2 \\text{ 个单位}' },
    /* y=5x를 8만큼 위로 */
    { re: rx(T('를 ') + String.raw`\s*(-?\d+)` + T('만큼 (위로|아래로)')),
      en: (m, n, d) => `\\text{ shifted ${d === '위로' ? 'up' : 'down'} by }${n}`,
      zh: (m, n, d) => `\\text{ 向${d === '위로' ? '上' : '下'}平移 }${n}\\text{ 个单位}` },
    /* 점을 지남 */
    { re: rx(String.raw`(,\s*(?:\\;|\\quad)?\s*)` + POINT + String.raw`\s*` + T('를 지남')),
      en: '$1\\text{passes through }$2', zh: '$1\\text{过点 }$2' },
    { re: rx(T('가 ') + String.raw`\s*` + POINT + String.raw`\s*` + T('를 지남')),
      en: '\\text{ passes through }$1', zh: '\\text{ 的图象过点 }$1' },
    { re: rx(POINT + String.raw`\s*` + T('를 지나요')), en: '\\text{passes through }$1', zh: '\\text{过点 }$1' },
    /* 6x-2y-3=0 가 y=3x 와 평행 */
    { re: rx(String.raw`\\quad` + T('가') + String.raw` \\quad (.*?) \\quad` + T('와 평행')),
      en: '\\quad\\text{is parallel to }$1', zh: '\\quad\\text{与 }$1\\text{ 平行}' },
    /* 두 근이 -2, 3이고 x²의 계수가 2 */
    { re: rx(T('두 근이 ') + String.raw`([^\\]*?)` + T('이고 ') + String.raw`\s*(x\^\{?\d+\}?)` + T('의 계수가 ')),
      en: '\\text{roots }$1\\text{; coefficient of }$2\\text{ is }', zh: '\\text{两根为 }$1\\text{；}$2\\text{ 的系数为 }' },
    { re: rx(String.raw`(x\^\{?\d+\}?)\s*` + T('의 계수 ')), en: '$1\\text{ has coefficient }', zh: '$1\\text{ 的系数为 }' },
    /* 접선·미분 */
    { re: rx(String.raw`(x=-?\d+)` + T('에서 접선의 기울기')), en: '\\text{slope of the tangent at }$1', zh: '$1\\text{ 处切线的斜率}' },
    { re: rx(String.raw`(x=-?\d+)` + T('에서 접선')), en: '\\text{tangent at }$1', zh: '$1\\text{ 处的切线}' },
    { re: rx(String.raw`(f'\(x\)=-?\d+)` + T('의 해')), en: '\\text{solutions of }$1', zh: '$1\\text{ 的解}' },
    /* 제 3 사분면 */
    { re: rx(T('제') + String.raw`\s*` + MID + String.raw`\s*` + T('사분면')), en: '\\text{quadrant }$1', zh: '\\text{第 }$1\\text{ 象限}' },
    /* 몫은 1자리 */
    { re: rx(T('몫은 ') + String.raw`\s*` + MID + String.raw`\s*` + T('자리')), en: '\\text{quotient is }$1\\text{-digit}', zh: '\\text{商是 }$1\\text{ 位数}' },
    /* 분수 계산 */
    { re: rx(String.raw`(\d+)` + T('을 빌림')), en: '\\text{borrow }$1', zh: '\\text{借 }$1' },
    { re: rx(String.raw`(\d+)` + T('이 넘으면 올림')), en: '\\text{carry if over }$1', zh: '\\text{超过 }$1\\text{ 就进位}' },
    { re: rx(T(String.raw`\((\d+)자리 제곱법 재사용\)`)), en: '\\text{(reuse the $1-digit squaring method)}', zh: '\\text{(重复使用 $1 位数平方的方法)}' },
    /* 몇 번 나타남 */
    { re: rx(T('이') + T(' 각각 ') + String.raw`(\d+)` + T('번 나타남')), en: '\\text{ each appear }$1\\text{ times}', zh: '\\text{ 各出现 }$1\\text{ 次}' },
    { re: rx(T('[는은이]') + T(' ') + String.raw`(\d+)` + T('번 나타남')), en: '\\text{ appears }$1\\text{ times}', zh: '\\text{ 出现 }$1\\text{ 次}' },
    { re: rx(T('홀수 ') + String.raw`(\d+)` + T('개의 합')), en: '\\text{sum of }$1\\text{ odd numbers}', zh: '$1\\text{个奇数的和}' },
    /* 산점도 */
    { re: rx(T('산점도에서 ') + String.raw`([xy]\\[gl]e [^\\]+?|y>x)(?:` + T('이고 ') + String.raw`([xy]\\[gl]e [^\\]+?))?` + T('인 점은 ') + MID + T('개')),
      en: (m, a, b, n) => `\\text{points on the scatter plot with }${a}${b ? '\\text{ and }' + b : ''}\\text{: }${n}`,
      zh: (m, a, b, n) => `\\text{散点图中 }${a}${b ? '\\text{ 且 }' + b : ''}\\text{ 的点：}${n}\\text{ 个}` },
    { re: rx(String.raw`([xy]\\[gl]e [^\\]+?)(?:` + T('이고 ') + String.raw`([xy]\\[gl]e [^\\]+?))?` + T('인 점을 한 번씩 표시')),
      en: (m, a, b) => `\\text{mark each point with }${a}${b ? '\\text{ and }' + b : ''}\\text{ once}`,
      zh: (m, a, b) => `\\text{把 }${a}${b ? '\\text{ 且 }' + b : ''}\\text{ 的点各标一次}` },
    { re: rx(T('표의 순서쌍마다 ') + POINT + T(' 자리에 점 하나')),
      en: '\\text{one point at }$1\\text{ for each ordered pair in the table}', zh: '\\text{表中每个有序数对在 }$1\\text{ 处画一个点}' },
    { re: rx(String.raw`x` + T('가 커질 때 점들의 전체 방향을 본다')),
      en: '\\text{look at the overall direction of the points as }x\\text{ gets larger}', zh: '\\text{观察 }x\\text{ 增大时各点的整体走向}' },
    { re: rx(T('순서쌍 ') + String.raw`(\d+)` + T('개를 모두 찍고, 찍은 점의 수')),
      en: '\\text{plot all }$1\\text{ ordered pairs; number of points plotted}', zh: '\\text{把 }$1\\text{ 个有序数对全部画出，画出的点数}' },
    { re: rx(T('첫 자리부터 선택지는 ') + String.raw`([^\\]*?)` + T('개')),
      en: '\\text{choices starting from the first place: }$1', zh: '\\text{从第一位起的选择数：}$1' },
    { re: rx(T('고정한 뒤 남은 빈자리 ') + String.raw`(\d+)` + T('개')),
      en: '\\text{empty places left after fixing: }$1', zh: '\\text{固定后剩下的空位：}$1\\text{ 个}' },
    /* 수직선·좌표 */
    { re: rx(T(String.raw`(\d+)에서 `) + String.raw`\s*(?:` + T('(오른쪽|왼쪽)') + String.raw`\s*` + T('으로 ') + String.raw`\s*)?` + MID + String.raw`\s*` + T('칸')),
      en: (m, n, d, k) => `${k} \\text{ ${/^(?:\\color\{#d33\}\{)?\s*1\s*\}?$/.test(k.trim()) ? 'unit' : 'units'} ${d ? 'to the ' + (d === '오른쪽' ? 'right' : 'left') + ' of' : 'from'} }${n}`,
      zh: (m, n, d, k) => `\\text{从 }${n}\\text{ ${d ? '向' + (d === '오른쪽' ? '右' : '左') : '走'} }${k}\\text{ 格}` },
    { re: rx(T(String.raw`오른쪽 (\d+)칸에 세로 `) + MID + T('칸')), en: '\\text{right }$1\\text{, vertical }$2', zh: '\\text{向右 }$1\\text{ 格，纵向 }$2\\text{ 格}' },
    { re: rx(T(String.raw`오른쪽 (\d+)칸`)), en: '\\text{right }$1', zh: '\\text{向右 }$1\\text{ 格}' },
    { re: rx(T('세로 ') + MID + T('칸')), en: '\\text{vertical }$1', zh: '\\text{纵向 }$1\\text{ 格}' },
    { re: rx(T('가장 ') + String.raw`\s*` + T('(낮은|높은)') + String.raw`\s*` + T(' 점의 ')),
      en: (m, d) => `\\text{${d === '낮은' ? 'lowest' : 'highest'} point's }`, zh: (m, d) => `\\text{${d === '낮은' ? '最低' : '最高'}点的 }` },
    /* 상자그림 */
    { re: rx(String.raw`(Q_\d)` + T('부터 ') + String.raw`(Q_\d)` + T('까지 상자를 그림')),
      en: '\\text{draw the box from }$1\\text{ to }$2', zh: '\\text{画出从 }$1\\text{ 到 }$2\\text{ 的箱体}' },
    { re: rx(String.raw`(Q_\d)` + T('에 중앙선, 최솟값과 최댓값까지 수염을 그림')),
      en: '\\text{draw the median line at }$1\\text{, with whiskers out to the minimum and maximum}', zh: '\\text{在 }$1\\text{ 处画中线，须线延伸到最小值和最大值}' },
    /* 양변 연산 문장 */
    { re: rx(T(String.raw`양변(?:에서|에|을) (?:(음수|양수) )?(-?\d+)(?:을|를|으로|로) (곱했|나눴|뺐|더했)으므로, 방향을 (뒤집습니다|그대로 둡니다)\.`)),
      en: (m, sg, n, v, f) => {
        const num = (SIGN_EN[sg] || '') + n;
        const act = { '곱했': `We multiplied both sides by ${num}`, '나눴': `We divided both sides by ${num}`, '뺐': `We subtracted ${num} from both sides`, '더했': `We added ${num} to both sides` }[v];
        return `\\text{${act}, so the inequality sign ${f === '뒤집습니다' ? 'flips' : 'stays the same'}.}`;
      },
      zh: (m, sg, n, v, f) => {
        const num = (SIGN_ZH[sg] || '') + ' ' + n;
        const act = { '곱했': `两边同乘${num}`, '나눴': `两边同除以${num}`, '뺐': `两边同减去${num}`, '더했': `两边同加上${num}` }[v];
        return `\\text{${act}，所以不等号方向${f === '뒤집습니다' ? '改变' : '不变'}。}`;
      } },
  ];

  /* \text{…} 안 글 → { en, zh }. 열쇠는 앞뒤 빈칸을 뺀 한국어. */
  const TEXT = {
    '일 때': { en: 'when', zh: '时' },
    '가': { en: 'A', zh: '甲' },
    '나': { en: 'B', zh: '乙' },
    '차': { en: 'difference', zh: '差' },
    '큰 값': { en: 'larger value', zh: '较大的值' },
    '큰 평균': { en: 'larger mean', zh: '平均数较大的' },
    '더 고름': { en: 'more consistent', zh: '更稳定的' },

    /* 약수·배수·소수 */
    '의 최소공배수': { zh: '的最小公倍数' }, '의 최대공약수': { zh: '的最大公因数' }, '의 약수 개수': { zh: '的因数个数' },
    '의 배수': { zh: '的倍数' }, '의 약수': { zh: '的因数' }, '의 공약수': { zh: '的公因数' }, '의 공배수': { zh: '的公倍数' },
    '의 정수 부분': { zh: '的整数部分' }, '의 몫의 일의 자리': { zh: '的商的个位数字' },
    '최소공배수': { en: 'LCM', zh: '最小公倍数' }, '최대공약수': { en: 'GCD', zh: '最大公因数' },
    '최소공배수:': { en: 'LCM:', zh: '最小公倍数：' },
    '가장 큰 공약수': { en: 'greatest common factor', zh: '最大公因数' },
    '공약수': { en: 'common factors', zh: '公因数' }, '공배수': { en: 'common multiples', zh: '公倍数' },
    '약수의 개수': { en: 'number of factors', zh: '因数的个数' },
    /* 2026-11-25 중1-1 세분화 */
    '의 약수의 개수': { en: ': number of factors', zh: '的因数个数' }, '소인수': { en: 'prime factors', zh: '质因数' },
    '공통인 소인수': { en: 'common prime factors', zh: '公共质因数' }, '모든 소인수': { en: 'all prime factors', zh: '所有质因数' },
    '마지막 몫': { en: 'last quotients', zh: '最后的商' },
    '양의 정수의 개수': { en: 'number of positive integers', zh: '正整数的个数' }, '음의 정수의 개수': { en: 'number of negative integers', zh: '负整数的个数' },
    '정수의 개수': { en: 'number of integers', zh: '整数的个数' }, '정수가 아닌 유리수의 개수': { en: 'number of non-integer rationals', zh: '非整数有理数的个数' },
    '양의 유리수의 개수': { en: 'number of positive rationals', zh: '正有理数的个数' }, '음의 유리수의 개수': { en: 'number of negative rationals', zh: '负有理数的个数' },
    '정수 x의 개수': { en: 'number of integers x', zh: '整数x的个数' }, '없음': { en: 'none', zh: '无' },
    '의 가장 큰 값': { en: ': greatest value', zh: '的最大值' }, '의 가장 작은 값': { en: ': least value', zh: '的最小值' },
    '의 역수': { en: ': reciprocal', zh: '的倒数' },
    '원점에서 거리가 ': { en: 'distance from 0 is ', zh: '到原点的距离为' }, '인 점': { en: '', zh: '的点' },
    '2,5 이외 소인수': { en: 'prime factors other than 2 and 5', zh: '2、5 以外的质因数' },
    '가지': { en: ' ways', zh: '种' },
    '는 짝수': { en: ' is even', zh: '是偶数' },
    '는 2의 배수': { en: ' is a multiple of 2', zh: '是 2 的倍数' },
    '→ 소수 1, 합성수 2, 둘 다 아님 3:': { en: '→ prime 1, composite 2, neither 3:', zh: '→ 质数 1，合数 2，都不是 3：' },
    '유한': { en: 'terminating', zh: '有限' }, '순환': { en: 'repeating', zh: '循环' },
    '반복마디도': { en: 'repeating block is also', zh: '循环节也是' },
    '자리': { en: ' digits', zh: '位数' },
    '기약분수': { en: 'irreducible fraction', zh: '最简分数' },

    /* 통계 */
    '중앙값': { en: 'median', zh: '中位数' }, '최빈값': { en: 'mode', zh: '众数' }, '평균': { en: 'mean', zh: '平均数' },
    '범위': { en: 'range', zh: '极差' }, '사분위수 범위': { en: 'interquartile range', zh: '四分位距' },
    '분산': { en: 'variance', zh: '方差' }, '표준편차': { en: 'standard deviation', zh: '标准差' },
    '편차': { en: 'deviation', zh: '偏差' }, '변량': { en: 'data value', zh: '数据' },
    '편차의 합': { en: 'sum of deviations', zh: '偏差之和' }, '편차 제곱의 합': { en: 'sum of squared deviations', zh: '偏差平方和' },
    '밑줄 친 값의 편차': { en: 'deviation of the underlined value', zh: '画线数值的偏差' },
    '크기순': { en: 'in order of size', zh: '按大小顺序' }, '크기순 한가운데': { en: 'middle in order of size', zh: '按大小顺序排列后正中间的值' },
    '한가운데 값': { en: 'middle value', zh: '正中间的值' }, '가운데 두 값': { en: 'two middle values', zh: '中间两个值' },
    '가장 많이 나타난 값': { en: 'most frequent value', zh: '出现次数最多的值' }, '가장 큰 횟수': { en: 'greatest count', zh: '最大次数' },
    '항목': { en: 'item', zh: '项目' }, '횟수': { en: 'count', zh: '次数' },
    '최빈 항목 번호': { en: 'number of the most frequent item', zh: '出现次数最多的项目编号' },
    '제1사분위수': { en: 'first quartile', zh: '第一四分位数' }, '제3사분위수': { en: 'third quartile', zh: '第三四分位数' },
    '전체 중앙값은 양쪽 절반에서 제외': { en: 'the overall median is left out of both halves', zh: '整体中位数不计入两半' },
    '자료를 같은 수의 두 절반으로 나눔': { en: 'split the data into two halves of equal size', zh: '把数据分成个数相同的两半' },
    '그린 상자그림에서 다시 읽기:': { en: 'Reading it back from the box plot we drew:', zh: '从画出的箱线图中重新读出：' },
    '찍은 점의 수': { en: 'number of points plotted', zh: '画出的点数' },
    '점의 수': { en: 'number of points', zh: '点的个数' },
    '①양의 상관  ②음의 상관  ③없음': { en: '① positive correlation  ② negative correlation  ③ none', zh: '①正相关  ②负相关  ③无相关' },
    '①강한 양  ②약한 양  ③없음': { en: '① strong positive  ② weak positive  ③ none', zh: '①强正相关  ②弱正相关  ③无相关' },
    '④약한 음  ⑤강한 음': { en: '④ weak negative  ⑤ strong negative', zh: '④弱负相关  ⑤强负相关' },
    '상관관계 없음': { en: 'no correlation', zh: '无相关' },
    '약한 음의 상관관계': { en: 'weak negative correlation', zh: '弱负相关' }, '강한 음의 상관관계': { en: 'strong negative correlation', zh: '强负相关' },

    /* 함수·그래프 */
    '최솟값': { en: 'minimum', zh: '最小值' }, '최댓값': { en: 'maximum', zh: '最大值' },
    '극솟값': { en: 'local minimum', zh: '极小值' }, '극댓값': { en: 'local maximum', zh: '极大值' },
    '주기': { en: 'period', zh: '周期' },
    '꼭짓점': { en: 'vertex', zh: '顶点' }, '꼭짓점의': { en: "vertex's", zh: '顶点的' },
    '기울기': { en: 'slope', zh: '斜率' }, 'x절편': { en: 'x-intercept', zh: 'x 截距' }, 'y절편': { en: 'y-intercept', zh: 'y 截距' },
    'x축과': { en: 'meets the x-axis at', zh: '与 x 轴交于' },
    'x축과의 교점': { en: 'intersection with the x-axis', zh: '与 x 轴的交点' }, 'y축과의 교점': { en: 'intersection with the y-axis', zh: '与 y 轴的交点' },
    'x축과 만나는 곳': { en: 'where it meets the x-axis', zh: '与 x 轴相交处' }, 'y축과 만나는 곳': { en: 'where it meets the y-axis', zh: '与 y 轴相交处' },
    'y축과 만나는 높이': { en: 'height where it meets the y-axis', zh: '与 y 轴相交的高度' },
    'x축 대칭': { en: 'reflection over the x-axis', zh: '关于 x 轴对称的点' }, 'y축 대칭': { en: 'reflection over the y-axis', zh: '关于 y 轴对称的点' },
    '원점 대칭': { en: 'reflection through the origin', zh: '关于原点对称的点' },
    'y의 부호만 바뀜': { en: 'only the sign of y changes', zh: '只有 y 的符号改变' }, 'x의 부호만 바뀜': { en: 'only the sign of x changes', zh: '只有 x 的符号改变' },
    '두 부호 모두 바뀜': { en: 'both signs change', zh: '两个符号都改变' },
    '근의 개수': { en: 'number of roots', zh: '根的个数' }, '실근의 개수': { en: 'number of real roots', zh: '实根的个数' },
    '그때': { en: 'then', zh: '这时' }, '그때의': { en: 'then', zh: '此时的' },
    '그래프는': { en: 'the graph is', zh: '图象是' }, '지나는 점': { en: 'point it passes through', zh: '经过的点' },
    '원점에서 거리': { en: 'distance from the origin', zh: '到原点的距离' },
    '위쪽': { en: 'above', zh: '上方' }, '아래쪽': { en: 'below', zh: '下方' },
    '오른쪽': { en: 'right', zh: '右' }, '왼쪽': { en: 'left', zh: '左' }, '오른쪽 수': { en: 'right number', zh: '右边的数' },
    '왼쪽부터': { en: 'from the left:', zh: '从左起：' },
    '가로': { en: 'width', zh: '宽' }, '세로': { en: 'height', zh: '高' },
    '오른쪽 1칸당 세로': { en: 'vertical change per 1 to the right', zh: '向右每 1 格的纵向变化' },
    '높은': { en: 'highest', zh: '最高' }, '낮은': { en: 'lowest', zh: '最低' },
    '점 P': { en: 'point P', zh: '点 P' }, '점 P의 좌표': { en: 'coordinates of point P', zh: '点 P 的坐标' },
    '점 P가 나타내는 수': { en: 'number shown by point P', zh: '点 P 表示的数' },
    '한 칸을': { en: 'Divide one unit into', zh: '把一格' }, '등분': { en: ' equal parts', zh: '等分' },
    '한 변': { en: 'side', zh: '边长' },
    '두 수': { en: 'two numbers', zh: '两个数' }, '작은 수': { en: 'smaller number', zh: '较小的数' },
    '0까지 거리': { en: 'distance to 0', zh: '到 0 的距离' }, '절댓값 차': { en: 'difference of absolute values', zh: '绝对值之差' },
    '음수 개수': { en: 'number of negatives', zh: '负数的个数' },
    '가장 큰 정수': { en: 'greatest integer', zh: '最大整数' }, '가장 작은 정수': { en: 'smallest integer', zh: '最小整数' },
    '가장 큰 숫자': { en: 'largest digit', zh: '最大的数字' },
    '지수': { en: 'exponent', zh: '指数' }, '계수': { en: 'coefficient', zh: '系数' },
    '음수로 나눠 뒤집힘': { en: 'flipped by dividing by a negative', zh: '除以负数，方向改变' },
    '음수로 나눠 방향이 뒤집혔어요': { en: 'the direction flipped because we divided by a negative', zh: '因为除以了负数，方向改变了' },
    '그대로': { en: 'unchanged', zh: '不变' },
    '먼저!': { en: 'do this first!', zh: '先算这个！' },
    '또는': { en: 'or', zh: '或' },
    '답': { en: 'answer', zh: '答案' },
    '선택 번호': { en: 'number chosen', zh: '所选编号' }, '뛴 횟수': { en: 'number of jumps', zh: '跳的次数' },

    /* 자릿값·계산 말 */
    '일:': { en: 'ones:', zh: '个位：' }, '십:': { en: 'tens:', zh: '十位：' }, '백:': { en: 'hundreds:', zh: '百位：' }, '천:': { en: 'thousands:', zh: '千位：' },
    '일의 자리:': { en: 'ones place:', zh: '个位：' }, '십의 자리:': { en: 'tens place:', zh: '十位：' },
    '일의 자리': { en: 'ones place', zh: '个位' }, '십의 자리': { en: 'tens place', zh: '十位' },
    '십분의 자리': { en: 'tenths place', zh: '十分位' }, '백분의 자리': { en: 'hundredths place', zh: '百分位' },
    '십분의 자리 합': { en: 'sum of the tenths place', zh: '十分位之和' },
    '0.1이 몇 개': { en: 'how many 0.1s', zh: '几个0.1' }, '0.01이 몇 개': { en: 'how many 0.01s', zh: '几个0.01' }, '소수 첫째 자리': { en: 'tenths place', zh: '十分位' }, '소수 둘째 자리': { en: 'hundredths place', zh: '百分位' },
    '(일의 자리)': { en: '(ones place)', zh: '(个位)' }, '(십의 자리)': { en: '(tens place)', zh: '(十位)' }, '(가운데 자리)': { en: '(middle place)', zh: '(中间位)' },
    '(일)': { en: '(ones)', zh: '(个位)' }, '(만)': { en: '(ten-thousands)', zh: '(万位)' }, '(천)': { en: '(thousands)', zh: '(千位)' },
    '(백, X)': { en: '(hundreds, cross)', zh: '(百位，交叉)' }, '(십, X)': { en: '(tens, cross)', zh: '(十位，交叉)' }, '(천, X)': { en: '(thousands, cross)', zh: '(千位，交叉)' },
    '(교차)': { en: '(cross)', zh: '(交叉)' }, '(앞 자리 곱)': { en: '(product of the leading digits)', zh: '(前面各位数相乘)' },
    '(피라미드 꼭대기 계수)': { en: '(top coefficient of the pyramid)', zh: '(金字塔顶端的系数)' },
    '0의 개수': { en: 'number of 0s', zh: '0 的个数' }, '빈 자리는 0': { en: 'empty places are 0', zh: '空位补 0' },
    '개수': { en: 'count', zh: '个数' },
    '쌍의 수': { en: 'number of pairs', zh: '对数' },
    '합산': { en: 'add up', zh: '相加' }, '어림 몫': { en: 'estimated quotient', zh: '估算的商' }, '보정': { en: 'correction', zh: '修正' },
    '계산': { en: 'calculation', zh: '的计算' }, '한 값': { en: 'value', zh: '后的值' },
    '정수 곱셈': { en: 'integer multiplication', zh: '整数乘法' },
    '소수점 1자리 ←': { en: '1 decimal place ←', zh: '小数点后 1 位 ←' },
    '소수점 2자리 ←': { en: '2 decimal places ←', zh: '小数点后 2 位 ←' },
    '할': { en: 'tenths', zh: '成' }, '푼': { en: 'hundredths', zh: '分' }, '리': { en: 'thousandths', zh: '厘' },
    '할 (0.1 단위)': { en: 'hal (0.1 place)', zh: '成 (0.1 位)' }, '푼 (0.01 단위)': { en: 'pun (0.01 place)', zh: '分 (0.01 位)' }, '리 (0.001 단위)': { en: 'ri (0.001 place)', zh: '厘 (0.001 位)' },
    '억': { en: 'hundred million', zh: '亿' }, '조': { en: 'trillion', zh: '万亿' }, '단위': { en: 'unit', zh: '单位' },
    '정가': { en: 'list price', zh: '定价' }, '판매가': { en: 'selling price', zh: '售价' },
    '거리': { en: 'distance', zh: '路程' }, '속력': { en: 'speed', zh: '速度' }, '시간': { en: 'time', zh: '时间' },

    /* 분수·괄호 */
    '분수:': { en: 'fraction part:', zh: '分数部分：' }, '자연수:': { en: 'whole number part:', zh: '整数部分：' },
    '분자:': { en: 'numerator:', zh: '分子：' }, '분모:': { en: 'denominator:', zh: '分母：' },
    '분모는 그대로:': { en: 'the denominator stays the same:', zh: '分母不变：' },
    '분자끼리': { en: 'numerator with numerator', zh: '分子与分子' },
    '약분': { en: 'simplify', zh: '约分' }, '통분': { en: 'common denominator', zh: '通分' }, '가분수로': { en: 'as an improper fraction', zh: '化为假分数' },
    '역수를 곱해요': { en: 'multiply by the reciprocal', zh: '乘以倒数' },
    '나누는 수가 분모': { en: 'the divisor becomes the denominator', zh: '除数作分母' },
    '마지막 항': { en: 'last term', zh: '最后一项' }, '가운데는 모두 지워져요': { en: 'all the middle terms cancel', zh: '中间的项全部抵消' },
    '소괄호': { en: 'parentheses', zh: '小括号' }, '괄호 먼저': { en: 'parentheses first', zh: '先算括号' },
    '대괄호': { en: 'square brackets', zh: '中括号' }, '대괄호 먼저': { en: 'square brackets first', zh: '先算中括号' },
    '중괄호 먼저': { en: 'braces first', zh: '先算大括号' },
    '오른쪽 1칸': { en: 'right 1', zh: '向右 1 格' },

    /* 풀이 말 */
    'A 다음 B처럼 두 단계를 모두 거치면 곱한다': { en: 'If something goes through both steps, like A then B, multiply', zh: '像先 A 再 B 这样要经过两个步骤时，用乘法' },
    '겹치지 않는 A 또는 B는 더한다': { en: 'If A or B do not overlap, add', zh: '不重叠的 A 或 B，用加法' },
    '조건에 맞는 결과를 빠짐없이 센다': { en: 'Count every result that fits the condition, leaving none out', zh: '把符合条件的结果一个不漏地数出来' },
  };

  function swapText(s, lang) {
    return s.replace(/\\text\{([^{}]*)\}/g, (all, inner) => {
      if (!HANGUL.test(inner)) return all;
      const m = inner.match(/^(\s*)([\s\S]*?)(\s*)$/);
      const hit = TEXT[m[2]];
      return hit && hit[lang] != null ? '\\text{' + m[1] + hit[lang] + m[3] + '}' : all;
    });
  }
  function apply(tex, lang) {
    if (lang !== 'en' && lang !== 'zh') return tex;
    let s = String(tex);
    for (const r of RULES) if (r[lang] != null) s = s.replace(r.re, r[lang]);
    return swapText(s, lang);
  }

  const api = { apply, RULES, TEXT };
  if (typeof window !== 'undefined') window.NM_TEX_I18N = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
