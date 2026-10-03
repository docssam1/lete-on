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
const confirmLabel = L('판·권·단원 내용을 확인하고 직접 선택',
  'Check the edition, volume and studied topic, then choose a stage',
  '确认版本、册次和已学内容后，自己选择阶段');

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
['P', 'K', 'A', 'B', 'C'].forEach(stage => {
  catalog.push({ id: 'soma-' + stage.toLowerCase(), label: L('소마셈 ' + stage),
    sourceUrls: [somaUrl], steps: [pending('contents', confirmLabel, [somaUrl])] });
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
function getSteps(seriesId) {
  const book = byId[seriesId];
  return book ? clone(book.steps) : [];
}
function resolve(seriesId, stepId, progress) {
  const book = byId[seriesId];
  const step = book && book.steps.find(candidate => candidate.id === stepId);
  if (!step) return null;
  const knownProgress = typeof progress === 'string' &&
    Object.prototype.hasOwnProperty.call(progressNames, progress);
  const automatic = knownProgress && step.verification === 'verified' && !!step.baselineId;
  return { baselineId: automatic ? step.baselineId : null,
    label: clone(step.label), verification: automatic ? 'verified' : 'topic-confirmation',
    sourceUrls: step.sourceUrls.slice(), needsTopicConfirmation: !automatic };
}
W.NM_PLACEMENT_BOOKS = {
  series: catalog.map(book => ({ id: book.id, label: clone(book.label),
    sourceUrls: book.sourceUrls.slice(), verification: 'topic-confirmation' })),
  getSteps, resolve
};
})();
