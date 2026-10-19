/* Studied-book scope metadata, not publisher questions or admission criteria.
   See docs/placement-book-provenance.md for evidence and mapping limitations.
   coverage contains existing thread@level TOPIC CANDIDATES, not complete
   equivalences, prerequisites passed, or automatic course assignments.
   Only a step with a verified baselineId can resolve without confirmation. */
(function () {
'use strict';
const W = typeof window !== 'undefined' ? window : globalThis;
const L = (ko, en, zh) => ({ ko, en: en || ko, zh: zh || ko });
const gilbut = code => 'https://school.gilbut.co.kr/book/view?bookcode=' + code;
const somaUrl = 'https://timecnp.com/bbs/board.php?bo_table=s3_3';
const wolliUrl = 'https://1000math.com/archive';
const kumonUrl = 'https://www.kumon.co.kr/Subject/Math';

function pending(id, label, urls) {
  return { id, label, coverage: [], sourceUrls: urls || [],
    verification: 'topic-confirmation', sourceVerification: 'unconfirmed' };
}
function scoped(id, label, code, coverage, baselineId) {
  const out = { id, label, coverage, sourceUrls: [gilbut(code)],
    verification: baselineId ? 'verified' : 'topic-confirmation',
    sourceVerification: 'verified', sourceScope: 'publisher-topic-metadata' };
  if (baselineId) out.baselineId = baselineId;
  return out;
}

const catalog = [];
// Retailer set records establish the publication year, ISBN and printed volume
// numbers. These are bibliographic identifiers, not app-course equivalences.
// "2019 publication" is deliberate: the source does not call it an edition.
const somaSets = {
  P: { count: 8, url: 'https://www.yes24.com/product/goods/75530645', isbn13: '9791158850845',
    older: { url: 'https://www.yes24.com/product/goods/8653849', year: 2013 } },
  K: { count: 8, url: 'https://www.yes24.com/product/goods/75529132', isbn13: '9791158850753' },
  A: { count: 8, url: 'https://www.yes24.com/product/goods/75532218', isbn13: '9791158850944' },
  B: { count: 8, url: 'https://www.yes24.com/product/goods/75533479', isbn13: '9791158851033' },
  C: { count: 8, url: 'https://www.yes24.com/product/goods/75534465', isbn13: '9791158851125' },
  D: { count: 6, url: 'https://www.yes24.com/product/goods/75525550', isbn13: '9791158851217' }
};
// Short topic cues paraphrase each set's public volume summary. They help a
// parent recognize the physical book. A separately reviewed topic generator
// may use them, but these labels alone do not certify actual publisher items.
const somaPTopics = {
  '2019': [
    L('30까지 덧셈·뺄셈 5', 'Add/subtract 5 within 30', '30以内加减5'),
    L('30까지 덧셈·뺄셈 6', 'Add/subtract 6 within 30', '30以内加减6'),
    L('30까지 덧셈·뺄셈 10', 'Add/subtract 10 within 30', '30以内加减10'),
    L('30까지 덧셈·뺄셈 9', 'Add/subtract 9 within 30', '30以内加减9'),
    L('9까지 가르기·모으기', 'Split/combine through 9', '9以内数的分合'),
    L('10 가르기·모으기', 'Split/combine 10', '10的分合'),
    L('10 활용 덧셈', 'Add using 10', '利用10做加法'),
    L('10 활용 뺄셈', 'Subtract using 10', '利用10做减法')
  ],
  '2013': [
    L('50까지 덧셈·뺄셈 4', 'Add/subtract 4 within 50', '50以内加减4'),
    L('50까지 덧셈·뺄셈 6', 'Add/subtract 6 within 50', '50以内加减6'),
    L('50까지 덧셈·뺄셈 9', 'Add/subtract 9 within 50', '50以内加减9'),
    L('100까지 덧셈·뺄셈 9', 'Add/subtract 9 within 100', '100以内加减9'),
    L('7까지 가르기·모으기', 'Split/combine through 7', '7以内数的分合'),
    L('9까지 가르기·모으기', 'Split/combine through 9', '9以内数的分合'),
    L('10 가르기·모으기', 'Split/combine 10', '10的分合'),
    L('10 활용 덧셈·뺄셈', 'Add/subtract using 10', '利用10做加减法')
  ]
};
// These are short recognition cues from the 2019 set tables of contents.
// In K1–K7 the final 1–4 follows the retailer's topic heading; it must not
// be read as a verified operand limit or an app question-generation rule.
const soma2019Topics = {
  k: [
    L('10까지 더하기·빼기 1', 'Add/subtract through 10 (1)', '10以内加减（1）'),
    L('20까지 더하기·빼기 1', 'Add/subtract through 20 (1)', '20以内加减（1）'),
    L('10까지 더하기·빼기 2', 'Add/subtract through 10 (2)', '10以内加减（2）'),
    L('20까지 더하기·빼기 2', 'Add/subtract through 20 (2)', '20以内加减（2）'),
    L('10까지 더하기·빼기 3', 'Add/subtract through 10 (3)', '10以内加减（3）'),
    L('20까지 더하기·빼기 3', 'Add/subtract through 20 (3)', '20以内加减（3）'),
    L('20까지 더하기·빼기 4', 'Add/subtract through 20 (4)', '20以内加减（4）'),
    L('7까지 가르기·모으기', 'Split/combine through 7', '7以内数的分合')
  ],
  a: [
    L('덧셈 기본식', 'Addition facts', '加法基本算式'),
    L('뺄셈 기본식', 'Subtraction facts', '减法基本算式'),
    L('세 수 더하고 빼기', 'Add/subtract three numbers', '三个数的加减'),
    L('빈칸 있는 덧셈·뺄셈', 'Add/subtract with a missing number', '带空格的加减'),
    L('두 자리 수와 한 자리 수 더하기', 'Two-digit plus one-digit', '两位数加一位数'),
    L('두 자리 수에서 한 자리 수 빼기', 'Two-digit minus one-digit', '两位数减一位数'),
    L('두 자리 수끼리 더하고 빼기', 'Add/subtract two-digit numbers', '两位数加减'),
    L('두 자리 덧뺄의 빈칸 찾기', 'Missing number in two-digit operations', '两位数加减填空')
  ],
  b: [
    L('두 자리 수끼리 더하기', 'Add two-digit numbers', '两位数相加'),
    L('두 자리 수끼리 빼기', 'Subtract two-digit numbers', '两位数相减'),
    L('세 자리 수 더하고 빼기', 'Three-digit addition/subtraction', '三位数加减'),
    L('덧셈·뺄셈 활용', 'Applications of addition/subtraction', '加减法应用'),
    L('곱셈 배우기', 'Multiplication', '乘法'),
    L('곱셈구구', 'Multiplication facts', '乘法口诀'),
    L('나눗셈 배우기', 'Division', '除法'),
    L('곱셈·나눗셈 활용', 'Applications of multiplication/division', '乘除法应用')
  ],
  c: [
    L('두 자리 수 곱셈', 'Two-digit multiplication', '两位数乘法'),
    L('두 자리 수 곱셈 활용', 'Applications of two-digit multiplication', '两位数乘法应用'),
    L('두 자리 수 나눗셈', 'Two-digit division', '两位数除法'),
    L('세 자리 수 나눗셈 활용', 'Applications of three-digit division', '三位数除法应用'),
    L('큰 수 곱셈', 'Multiplication of larger numbers', '较大数的乘法'),
    L('큰 수 나눗셈', 'Division of larger numbers', '较大数的除法'),
    L('여러 연산 섞어 계산', 'Mixed operations', '混合运算'),
    L('혼합 계산 활용', 'Applications of mixed operations', '混合运算应用')
  ],
  d: [
    L('같은 분모 분수 덧뺄 1', 'Like-denominator fraction operations (1)', '同分母分数加减（1）'),
    L('같은 분모 분수 덧뺄 2', 'Like-denominator fraction operations (2)', '同分母分数加减（2）'),
    L('소수 더하고 빼기', 'Decimal addition/subtraction', '小数加减'),
    L('약수와 배수', 'Factors and multiples', '约数与倍数'),
    L('다른 분모 분수 덧뺄 1', 'Unlike-denominator fraction operations (1)', '异分母分数加减（1）'),
    L('다른 분모 분수 덧뺄 2', 'Unlike-denominator fraction operations (2)', '异分母分数加减（2）')
  ]
};
Object.entries(somaSets).forEach(([stage, set]) => {
  const urls = [somaUrl, set.url, ...(set.older ? [set.older.url] : [])];
  catalog.push({ id: 'soma-' + stage.toLowerCase(), label: L('소마셈 ' + stage),
    sourceUrls: urls, steps: Array.from({ length: set.count }, (_, index) => {
      const volume = index + 1;
      return pending('v' + volume, L(stage + volume + '권',
        'Volume ' + stage + volume, stage + volume + '册'), urls);
    }) });
});

catalog.push({ id: 'wolli', label: L('원리셈'), sourceUrls: [wolliUrl], steps: [
  pending('kids-56', L('키즈원리셈 5~6세용 — 실제 권·단원 확인'),
    ['https://1000math.com/archive/?bmode=view&idx=144109976']),
  pending('kids-67', L('키즈원리셈 6~7세용 — 실제 권·단원 확인'),
    ['https://1000math.com/archive/?bmode=view&idx=144110594']),
  pending('kids-78', L('키즈원리셈 7~8세용 — 실제 권·단원 확인'),
    ['https://1000math.com/archive/?bmode=view&idx=144111029']),
  ...[1, 2, 3, 4, 5, 6].map(grade => pending('elementary-' + grade,
    L('초등원리셈 ' + grade + '학년용 — 실제 권·단원 확인'), [wolliUrl])),
  pending('other-edition', L('다른 판·옛 단계 표기 — 내용 확인'), [wolliUrl])
] });
catalog.push({ id: 'changui', label: L('창의셈'), sourceUrls: [],
  steps: [pending('contents', L('출판사·판·권·단원을 확인하고 직접 선택',
    'Confirm the publisher, edition, volume and studied topic',
    '确认出版社、版本、册次和已学内容'))] });
// Level bands are recorded in HANDOFF.md from an owner-provided photo. They
// identify the book's printed course ranges, not this app's C courses.
// Keep every band pending until the studied topic is confirmed separately.
catalog.push({id:'dunoro',label:L('두뇌로'),sourceUrls:[],steps:[
  Object.assign(pending('level-1',L('Level 1 · 교재 과정 1~10','Level 1 · book courses 1–10','Level 1 · 教材课程 1～10'),[]),{bookCourseRange:[1,10]}),
  Object.assign(pending('level-2',L('Level 2 · 교재 과정 11~16','Level 2 · book courses 11–16','Level 2 · 教材课程 11～16'),[]),{bookCourseRange:[11,16]}),
  Object.assign(pending('level-3',L('Level 3 · 교재 과정 17~25','Level 3 · book courses 17–25','Level 3 · 教材课程 17～25'),[]),{bookCourseRange:[17,25]}),
  pending('contents',L('다른 레벨·단원 — 교재 표기 확인','Other level or unit — check the book','其他级别或单元 — 核对教材'),[])
]});
catalog.push({ id: 'kumon', label: L('구몬수학'), sourceUrls: [kumonUrl], steps: [
  ...['6A', '5A', '4A', '3A', '2A', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
    'J', 'K', 'L', 'M', 'N', 'O', 'SV', 'SM', 'SP', 'SS'].map(stage =>
      pending('stage-' + stage.toLowerCase(),
        L((['J', 'K', 'L', 'M', 'N', 'O', 'SV', 'SM', 'SP', 'SS'].includes(stage)
          ? '구몬수학 플러스 ' : '구몬수학 ') + stage + ' — 교재 번호·내용 확인'),
        [kumonUrl])),
  pending('other-edition', L('다른 판·단계 — 실제 내용 확인'), [kumonUrl])
] });

// The publisher confirms these edition-specific scopes. A whole volume is
// mixed; its progress percentage does not identify one internal course.
const miracle = [
  scoped('pre-2023-v1', L('예비초등 2023판 1권 — 수·순서·첫 덧뺄'), 'BN003889',
    ['NL1@1', 'NL1@2', 'NL4@1', 'NL7@1', 'AD1@1', 'SB1@1']),
  scoped('pre-2023-v1-order', L('예비초등 2023판 1권 — 수의 순서 단원',
    '기적의 계산법 예비초등 2023 vol. 1 — Number order unit',
    '기적의 계산법 예비초등 2023 第1册 — 数的顺序单元'), 'BN003889',
    ['NL4@1', 'NL7@1'], 'f-order10'),
  scoped('pre-2023-v2', L('예비초등 2023판 2권 — 9까지 모으기·가르기·덧뺄'), 'BN003890',
    ['NL2@2', 'NL2@3', 'AD1@1', 'SB1@1']),
  scoped('pre-2023-v2-bonds', L('예비초등 2023판 2권 — 9까지 모으기·가르기 단원'), 'BN003890',
    ['NL2@2', 'NL2@3']),
  scoped('pre-2023-v3', L('예비초등 2023판 3권 — 10 묶기·십몇·10 이용 덧뺄'), 'BN003891',
    ['NL6@1', 'NS3@2', 'AD2@1', 'SB2@1']),
  scoped('pre-2023-v3-ten', L('예비초등 2023판 3권 — 10의 짝꿍 시작점(단원 일부)',
    '기적의 계산법 예비초등 2023 vol. 3 — Partners to 10 starting point (part of unit)',
    '기적의 계산법 예비초등 2023 第3册 — 凑10起点（单元部分内容）'), 'BN003891',
    ['NL6@1'], 'f-ten10'),
  scoped('pre-2023-v4', L('예비초등 2023판 4권 — 10 넘는 덧뺄'), 'BN003892',
    ['AD2@1', 'SB2@1']),
  scoped('pre-2023-v5', L('예비초등 2023판 5권 — 두 자리 수·덧뺄'), 'BN003893',
    ['AD4@1', 'AD3@1', 'SB3@1']),
  scoped('elem-2021-v1', L('초등 2021판 1권 — 첫 덧뺄·두 자리 기초'), 'BN003275',
    ['NL2@2', 'NL2@3', 'AD1@1', 'SB1@1', 'AD10@1', 'AD3@1', 'SB3@1', 'AD4@1', 'AD5@1', 'SB4@1', 'EL1@4']),
  scoped('elem-2021-v2', L('초등 2021판 2권 — 10 묶기·받아올림·받아내림'), 'BN003276',
    ['NL6@1', 'NS3@2', 'AD10@2', 'AD2@1', 'SB2@1', 'AD3@1', 'AD3@2', 'SB3@1', 'SB3@2', 'EL1@4']),
  scoped('elem-2021-v3', L('초등 2021판 3권 — 두 자리 덧뺄·구구단'), 'BN003277',
    ['AD5@1', 'AD5@2', 'AD5@3', 'AD5@4', 'SB4@1', 'SB4@2', 'ML2@3', 'ML3@3', 'EL1@5']),
  scoped('elem-2021-v4', L('초등 2021판 4권 — 구구단 종합·세 자리 덧뺄'), 'BN003278',
    ['ML4@1', 'SB6@1', 'EL1@5']),
  scoped('elem-2021-v5', L('초등 2021판 5권 — 한 자리 수로 곱하기·첫 나눗셈'), 'BN003279',
    ['ML6@1', 'ML6@2', 'ML6@3', 'ML6@4', 'ML6@5', 'ML6@6', 'ML7@1', 'ML7@2', 'ML7@3', 'DV2@1', 'EL1@6']),
  scoped('elem-2021-v6', L('초등 2021판 6권 — 두 자리 곱셈·한 자리 나눗셈'), 'BN003280',
    ['ML5@2', 'ML8@1', 'ML8@2', 'ML8@3', 'ML8@4', 'ML8@5', 'DV2@1', 'DV2@2', 'DV3@1', 'DV4@1', 'DV4@2', 'EL1@6']),
  scoped('elem-2021-v7', L('초등 2021판 7권 — 큰 자연수 곱셈·두 자리 나눗셈'), 'BN003281',
    ['ML9@1', 'ML9@2', 'ML9@3', 'ML9@4', 'ML9@5', 'DV5@1', 'DV5@2', 'DV5@3', 'DV5@5', 'DV5@6']),
  scoped('elem-2021-v8', L('초등 2021판 8권 — 같은 분모 분수·소수 덧뺄'), 'BN003282',
    ['FR2@1', 'FR1@1', 'FR3@1', 'FR3@2', 'DC1@1', 'DC1@2', 'DC1@3', 'DC1@4', 'EL1@7']),
  scoped('elem-2021-v9', L('초등 2021판 9권 — 약수·배수·약분·통분·분수 덧뺄'), 'BN003283',
    ['DV7@1', 'DV7@2', 'DV7@3', 'FR5@1', 'FR5@2', 'FR4@1', 'FR4@2']),
  scoped('elem-2021-v10', L('초등 2021판 10권 — 혼합계산·분수와 소수 곱셈'), 'BN003284',
    ['MX1@1', 'MX1@2', 'FR6@1', 'FR6@2', 'DC2@1', 'EL1@8']),
  scoped('elem-2021-v11', L('초등 2021판 11권 — 분수와 소수 나눗셈'), 'BN003285',
    ['FR7@1', 'FR7@2', 'FR7@3', 'FR7@4', 'FR7@5', 'DC3@1', 'DC3@2', 'EL1@9']),
  scoped('elem-2021-v12', L('초등 2021판 12권 — 비·비례식·중학 연결'), 'BN003286',
    ['MX3@1', 'MX3@3', 'MX3@4', 'MX3@5', 'EL5@1', 'EL5@2', 'EL5@3']),
  pending('other-edition', L('구판·유아 계산법·다른 판 — 실제 내용 확인'),
    [gilbut('BN000248')])
];
catalog.push({ id: 'miracle', label: L('기적의 계산법'),
  sourceUrls: [gilbut('BN003889'), gilbut('BN003275')], steps: miracle });

const byId = Object.create(null);
catalog.forEach(book => { byId[book.id] = book; });
const clone = value => JSON.parse(JSON.stringify(value));
const progressNames = {
  start: 'start', beginning: 'start', early: 'start',
  middle: 'middle', mid: 'middle',
  complete: 'complete', completed: 'complete', end: 'complete'
};
function getEditions(seriesId) {
  const stage = /^soma-([pkabcd])$/.exec(seriesId || '');
  if (!stage) return [];
  const set = somaSets[stage[1].toUpperCase()];
  const choices = [
    { id: '', label: L('발행본을 모르겠어요', 'Publication year unknown', '不清楚出版年份'),
      sourceUrls: [], sourceVerification: 'unconfirmed' },
    { id: '2019', label: L('2019년 발행본', '2019 publication', '2019年出版'),
      publicationYear: 2019, isbn13: set.isbn13,
      sourceUrls: [set.url], sourceVerification: 'retailer-bibliography' }
  ];
  if (set.older) choices.push({ id: '2013',
    label: L('2013년 발행본', '2013 publication', '2013年出版'),
    publicationYear: set.older.year, sourceUrls: [set.older.url],
    sourceVerification: 'retailer-bibliography' });
  choices.push({ id: 'other', label: L('다른 발행본', 'Other publication', '其他出版年份'),
    sourceUrls: [], sourceVerification: 'unconfirmed' });
  return clone(choices);
}
function getSteps(seriesId, editionId) {
  const book = byId[seriesId];
  if (!book) return [];
  const steps = clone(book.steps);
  const stage = /^soma-([pkabcd])$/.exec(seriesId || '');
  if (!stage || editionId == null || editionId === '' || editionId === 'other') return steps;
  const edition = getEditions(seriesId).find(choice => choice.id === editionId);
  if (!edition) return [];
  const topics = stage[1] === 'p' ? somaPTopics[editionId]
    : editionId === '2019' ? soma2019Topics[stage[1]] : null;
  steps.forEach((step, index) => {
    step.editionId = editionId;
    step.sourceUrls = edition.sourceUrls.slice();
    step.sourceVerification = topics ? 'retailer-topic-summary' : 'retailer-bibliography';
    step.sourceScope = topics ? 'volume-topic-cue' : 'volume-number';
    if (topics) {
      step.topicSummary = clone(topics[index]);
      const volume = stage[1].toUpperCase() + (index + 1);
      step.label = L(
        volume + '권 · ' + topics[index].ko,
        'Volume ' + volume + ' · ' + topics[index].en,
        volume + '册 · ' + topics[index].zh);
    }
  });
  return steps;
}
function getBookCourses(seriesId, stepId) {
  const book = byId[seriesId];
  const step = book && book.steps.find(candidate => candidate.id === stepId);
  const range = step && step.bookCourseRange;
  return range ? Array.from({length:range[1]-range[0]+1},(_,i)=>range[0]+i) : [];
}
function resolve(seriesId, stepId, progress, editionId) {
  const step = getSteps(seriesId, editionId).find(candidate => candidate.id === stepId);
  if (!step) return null;
  // The intake asks for the studied topic, not a progress percentage. The two
  // narrow verified topics have the same starting candidate at every point.
  const usableProgress = progress == null || progress === '' ||
    (typeof progress === 'string' && Object.prototype.hasOwnProperty.call(progressNames, progress));
  const automatic = usableProgress && step.verification === 'verified' && !!step.baselineId;
  return { baselineId: automatic ? step.baselineId : null,
    label: clone(step.label), verification: automatic ? 'verified' : 'topic-confirmation',
    sourceUrls: step.sourceUrls.slice(), needsTopicConfirmation: !automatic };
}
function diagnosticSource(row) {
  if (!row || row.bookStatus !== 'completed') return null;
  if (row.series === 'dunoro') {
    const n = row.bookCourseNumber;
    return Number.isInteger(n) && getBookCourses('dunoro', row.step).includes(n) ? { series: 'dunoro', course: n } : null;
  }
  if (/^soma-[pkabcd]$/.test(row.series) && row.editionId === '2019') {
    const m = /^v(\d+)$/.exec(row.step || '');
    const n = m && Number(m[1]);
    return n && getSteps(row.series, '2019').some(step => step.id === row.step) ? { series: row.series, course: n } : null;
  }
  if (row.series === 'miracle') {
    const m = /^(pre-2023|elem-2021)-v(\d+)$/.exec(row.step || '');
    if (!m || !getSteps('miracle').some(step => step.id === row.step)) return null;
    return { series: 'miracle-' + m[1], course: Number(m[2]) };
  }
  return null;
}
W.NM_PLACEMENT_BOOKS = {
  series: catalog.map(book => ({ id: book.id, label: clone(book.label),
    sourceUrls: book.sourceUrls.slice(), verification: 'topic-confirmation' })),
  getEditions, getSteps, getBookCourses, resolve, diagnosticSource
};
})();
