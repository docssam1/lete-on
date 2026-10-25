// 탐구보고서 모형 — 브라우저·Node 테스트 공용(DOM 없음).
// 양식 2종(초등 A4 1장 · 중등 A4 2~3장), 실험 자료로 미리 채우기, 결과 표 → 그래프 자료, 첨삭 표시(형광펜·고치기·말풍선)의 글자 위치 다시 찾기.
// 저장은 report.js가 localStorage `sciLab.report.<실험 id>`에 한다. 서버로 보내지 않는다.

// 칸(cell) 정의: key · 제목 · 아이에게 보이는 물음 · 미리 채울 곳(from) · 모양(kind: table) · photos(그림·사진 붙이는 칸) · brk(중등 인쇄 때 이 칸 앞에서 쪽 넘김)
// 대회 3종 × 수준 2종 = 양식 6개. 결과 표 칸의 key는 늘 'result'(표·그래프·사진이 붙는 자리).
const INQUIRY = {
  elem: {
    id: 'elem', title: '초등 탐구보고서', pages: 1, note: '한 가지만 바꾸는 공정한 실험. 칸마다 한두 문장이면 충분해요.',
    cells: [
      { key: 'motive', title: '궁금한 점', ask: '무엇이 궁금해서 이 실험을 했나요?', lines: 2 },
      { key: 'question', title: '탐구 문제', ask: '한 문장으로, 「~하면 ~은 어떻게 될까?」', from: 'question', lines: 2 },
      { key: 'predict', title: '나의 예상', ask: '어떤 결과가 나올 것 같나요? 그렇게 생각한 까닭도 써요.', lines: 2 },
      { key: 'vars', title: '바꿀 것 · 같게 할 것 · 잴 것', ask: '바꾸는 조건은 하나뿐인가요?', from: 'vars', lines: 3 },
      { key: 'materials', title: '준비물', from: 'materials', lines: 2 },
      { key: 'steps', title: '실험 순서', ask: '남이 따라 할 수 있게 번호를 붙여요.', from: 'steps', lines: 4 },
      { key: 'result', title: '결과', ask: '표에 숫자로 적고, 사진을 붙여요.', kind: 'table', photos: true, lines: 0 },
      { key: 'learned', title: '알게 된 것', ask: '결과를 보고 알게 된 것을 써요. 예상과 같았나요, 달랐나요?', lines: 3 },
      { key: 'next', title: '더 해 보고 싶은 것', ask: '다음에는 무엇을 바꿔 보고 싶나요?', lines: 2 },
    ],
    checks: ['바꾼 조건이 하나뿐인가요?', '결과를 숫자(개수·cm·분)로 적었나요?', '알게 된 것이 결과 표에서 나왔나요?', '예상과 다른 결과도 그대로 적었나요?'],
  },
  mid: {
    id: 'mid', title: '중등 탐구보고서', pages: 3, note: '반복 측정·평균·그래프로 근거를 세우고, 오차와 한계까지 씁니다.',
    cells: [
      { key: 'motive', title: '탐구 동기와 배경', ask: '어떤 현상이나 질문에서 출발했는지, 관련 개념은 무엇인지 씁니다.', lines: 4 },
      { key: 'question', title: '탐구 문제', ask: '독립 변인과 종속 변인이 드러나게 한 문장으로.', from: 'question', lines: 2 },
      { key: 'hypothesis', title: '가설', ask: '「~이면 ~일 것이다」 + 근거. 틀려도 좋은 가설입니다.', lines: 3 },
      { key: 'vars', title: '변인', ask: '독립 변인(바꾸는 것) · 종속 변인(재는 것) · 통제 변인(같게 하는 것)', from: 'vars', lines: 4 },
      { key: 'materials', title: '준비물', from: 'materials', lines: 2, brk: true },
      { key: 'method', title: '실험 방법', ask: '반복 횟수와 측정 간격까지. 그림이나 사진을 붙여도 좋습니다.', from: 'steps', lines: 6 },
      { key: 'result', title: '결과', ask: '표(회차별 값·평균)와 그래프. 엇갈린 값도 지우지 않습니다.', kind: 'table', photos: true, lines: 0 },
      { key: 'analysis', title: '결과 해석과 오차', ask: '그래프에서 무엇이 보이나요? 값이 퍼진 까닭(측정·조건)은 무엇인가요?', lines: 5, brk: true },
      { key: 'conclusion', title: '결론', ask: '탐구 문제에 대한 답. 가설은 지지되었나요?', lines: 3 },
      { key: 'limits', title: '한계와 후속 탐구', ask: '이 실험으로 말할 수 없는 것과, 다음에 바꿀 설계.', lines: 3 },
      { key: 'refs', title: '참고 자료', ask: '책·사이트·사람. 제목과 어디서 봤는지.', lines: 2 },
    ],
    checks: ['독립·종속·통제 변인을 구별했나요?', '같은 조건을 3회 이상 반복하고 평균을 냈나요?', '결론이 결과 표·그래프에서 나왔나요?', '가설과 다른 결과도 그대로 썼나요?', '이 실험으로 말할 수 없는 것을 적었나요?'],
  },
};
// 자연관찰대회 — 현장에서 생물을 직접 보고 과제를 푼다. 과제는 해마다 바뀌지만 자주 나오는 유형은 같다:
// 채집·기록 표(장소별) · 관찰그림과 설명(전체·위·옆·확대·단면) · 두 장소 환경 비교(잰 방법 → 결과 → 추정) · 분류 나무(그렇다/그렇지 않다) ·
// 벤 다이어그램 · 구조 → 기능 → 살아가는 데 유리한 점 · 더 탐구할 것. 도감·스마트기기는 대회마다 허용이 다르다(과제지 안내를 따른다).
const NATURE = {
  elem: {
    id: 'elem', title: '초등 자연관찰 보고서', pages: 3, note: '대회 과제는 해마다 달라요. 자주 나오는 과제 순서대로 연습해요. 이름을 몰라도 ①②③ 번호로 부르면 돼요.',
    cells: [
      { key: 'target', title: '관찰 장소와 대상', ask: '어디서(장소 1·2의 특징), 무엇을 관찰했나요?', from: 'target', lines: 2 },
      { key: 'result', title: '채집·관찰 기록표', ask: '장소마다 찾은 생물과 개수. 이름을 모르면 번호로.', kind: 'table', chart: false, lines: 0 },
      { key: 'sheet', title: '관찰그림과 설명', ask: '위에서 본 모습·옆에서 본 모습·확대 그림. 부분 이름을 선으로 이어 적고, 본 것·만져 본 것·잰 것을 써요.', kind: 'obs', obs: 4, lines: 4 },
      { key: 'env', title: '두 장소 비교', ask: '눈으로 본 것 · 햇빛 · 바람 · 흙의 물기를 어떻게 확인했는지 → 결과 → 「아마 ~때문인 것 같다」', photos: true, lines: 5, brk: true },
      { key: 'classify', title: '분류 나무', ask: '「그렇다 / 그렇지 않다」로 답할 수 있는 기준으로 두 갈래씩 나눠요.', kind: 'tree', lines: 2 },
      { key: 'venn', title: '같은 점과 다른 점', ask: '가운데에 같은 점, 양쪽에 그것만의 점.', kind: 'venn', lines: 3 },
      { key: 'adapt', title: '생김새와 하는 일', ask: '날개·다리·잎처럼 한 부분을 골라, 생김새 → 하는 일 → 그곳에서 살아가는 데 좋은 점.', photos: true, lines: 4 },
      { key: 'next', title: '더 알아보고 싶은 것', ask: '관찰하다 생긴 「왜?」와, 알아볼 방법.', lines: 2 },
    ],
    checks: ['대상마다 번호를 붙이고 부분 이름을 적었나요?', '눈으로 본 것 말고 만지고·재 본 것도 적었나요?', '장소를 비교할 때 어떻게 확인했는지 방법을 썼나요?', '분류 기준이 누가 해도 같게 나뉘나요?', '「좋은 점」에 생김새라는 근거를 붙였나요?'],
  },
  mid: {
    id: 'mid', title: '중등 자연관찰 탐구 보고서', pages: 4, note: '대회 과제는 해마다 달라 자주 나오는 유형을 모두 연습합니다. 관찰 사실과 추정을 나누고, 분류 → 비교 → 구조와 기능 → 적응을 근거로 잇습니다.',
    cells: [
      { key: 'target', title: '관찰 장소·대상·조건', ask: '장소·날짜·시각·날씨, 고른 대상과 수.', from: 'target', lines: 2 },
      { key: 'sheet', title: '관찰그림과 설명', ask: '대상마다 전체 모습·확대·단면, 부분 이름과 기준선(수면·지면). 설명은 관찰한 사실(본 것·만진 것·잰 값) → 손으로 확인한 것 → 추정(「~로 추정된다」).', kind: 'obs', obs: 6, lines: 5 },
      { key: 'result', title: '측정 기록', ask: '잴 수 있는 것(잎 사이 간격·길이·개수)을 여러 번 재어 평균. 정도는 1~4단계처럼 자기 척도로.', kind: 'table', lines: 0, brk: true },
      { key: 'classify', title: '다양한 기준으로 분류(분류 나무)', ask: '그렇다/그렇지 않다 갈래로 끝까지 나누고, 기준마다 왜 그 기준을 골랐는지 씁니다.', kind: 'tree', lines: 3 },
      { key: 'pick', title: '두 종을 고른 이유와 이미 아는 점', ask: '왜 이 둘을 비교하는지, 관찰 전에 알고 있던 것.', lines: 3, brk: true },
      { key: 'venn', title: '공통점과 차이점(벤 다이어그램)', ask: '가운데에 공통점, 양쪽에 그 종만의 특징. 관찰한 사실로만 채웁니다.', kind: 'venn', lines: 4 },
      { key: 'structure', title: '구조와 기능 비교', ask: '같은 부분(잎·줄기·뿌리 / 날개·다리)을 나란히 놓고, 직접 해 본 확인(눌러 보기·물 떨어뜨리기·자르기·재기)을 근거로 구조와 기능을 잇습니다.', photos: true, lines: 6 },
      { key: 'adapt', title: '특징을 근거로 한 살아가는 데 유리한 점', ask: '관찰한 구조를 근거로, 그 환경에서 살아가는 데 유리한 점을 종마다.', lines: 4 },
      { key: 'more', title: '더 탐구하고 싶은 것', ask: '이번 관찰에서 생긴 의문을 탐구 문제로 바꾸고, 확인할 방법까지.', lines: 3 },
    ],
    checks: ['대상마다 전체·확대·단면 중 두 가지 이상을 그렸나요?', '설명에서 관찰한 사실과 추정을 구별했나요?', '잴 수 있는 것은 여러 번 재어 평균을 냈나요?', '분류 나무의 갈래가 끝까지 하나씩 나뉘었나요?', '구조 → 기능 → 유리한 점이 근거로 이어지나요?'],
  },
};
// 발명대회 — 불편함(문제) → 내 생각 먼저 → 수상작에서 힌트(발명 기법 빌리기) → 고른 아이디어 → 설계 → 만들기 → 시험 → 고치기.
// 원장 2026-10-23: 「발명은 모방에서 온다. 우선 생각하게 하고 아이디어를 얻도록」 — 수상작 보기(gallery)는 내 아이디어 칸(gate)을 쓴 뒤에 열린다.
const INVENT = {
  elem: {
    id: 'elem', title: '초등 발명 설명서', pages: 2, note: '불편한 점을 찾고, 내 생각을 먼저 쓴 뒤 수상작에서 힌트를 얻어 내 것으로 바꿔요. 정말 나아졌는지 시험까지.',
    cells: [
      { key: 'motive', title: '불편했던 점', ask: '언제, 어디서, 누가, 무엇이 불편했나요?', from: 'problem', lines: 2 },
      { key: 'think', title: '내가 먼저 떠올린 아이디어', ask: '수상작을 보기 전에 내 생각부터 3개. 엉뚱해도 좋아요.', gate: true, lines: 3 },
      { key: 'borrow', title: '수상작에서 얻은 힌트', ask: '비슷한 불편을 푼 발명품은 어떤 기법(더하기·빼기·모양 바꾸기·쓰임 바꾸기…)을 썼나요? 무엇을 빌려 와 어떻게 바꿨나요?', gallery: true, lines: 3 },
      { key: 'idea', title: '나의 아이디어', ask: '고른 아이디어 하나와 고른 까닭. 이미 있는 물건과 무엇이 다른가요?', lines: 3 },
      { key: 'design', title: '설계 그림', ask: '그림을 그리고, 부분마다 이름과 하는 일을 지시선으로 적어요.', photos: true, lines: 2 },
      { key: 'materials', title: '준비물', from: 'materials', lines: 2, brk: true },
      { key: 'steps', title: '만들고 시험하는 순서', ask: '번호를 붙여요.', from: 'steps', lines: 4 },
      { key: 'result', title: '시험해 보기', ask: '기존 것과 내 발명품을 같은 방법으로 시험해 숫자로 비교해요.', kind: 'table', photos: true, lines: 0 },
      { key: 'improve', title: '고칠 점', ask: '시험해 보니 아쉬운 점과 고친 방법.', lines: 2 },
      { key: 'use', title: '쓰임새', ask: '누가, 언제 쓰면 좋을까요? 위험한 점은 없나요?', lines: 2 },
    ],
    checks: ['불편했던 점이 구체적인가요?', '수상작을 보기 전에 내 아이디어를 먼저 썼나요?', '빌린 기법을 내 것으로 바꿨나요(그대로 베끼지 않았나요)?', '설계 그림에 부분 이름을 적었나요?', '기존 것과 같은 방법으로 시험했나요?'],
  },
  mid: {
    id: 'mid', title: '중등 발명 보고서', pages: 3, note: '문제 정의와 목표 수치 → 내 발상 → 수상작·특허 조사(빌린 기법과 차별점) → 설계 원리 → 시제품 시험(반복) → 개선의 흐름을 근거로 보입니다.',
    cells: [
      { key: 'motive', title: '발명 동기', ask: '어떤 상황에서 어떤 불편을 발견했는지.', from: 'problem', lines: 3 },
      { key: 'problem', title: '해결할 문제와 목표', ask: '누가·언제·무엇이 문제인지, 성공의 기준을 숫자로(예: 10분 뒤 온도 5℃ 덜 떨어짐).', lines: 3 },
      { key: 'think', title: '나의 첫 발상', ask: '조사하기 전에 떠오른 해결책 3개 이상. 이 칸을 써야 수상작 보기가 열립니다.', gate: true, lines: 4 },
      { key: 'research', title: '선행 조사 — 수상작·특허', ask: '비슷한 수상작·특허(특허정보검색 KIPRIS)를 찾아 쓰인 발명 기법과 원리, 나의 차별점을 씁니다.', gallery: true, lines: 4 },
      { key: 'idea', title: '아이디어 선택', ask: '후보를 기준(효과·안전·비용·만들기 쉬움)으로 비교해 고른 것과 까닭.', lines: 4 },
      { key: 'design', title: '설계와 작동 원리', ask: '설계도(치수 포함)를 붙이고, 어떤 과학 원리로 작동하는지 씁니다.', photos: true, lines: 4, brk: true },
      { key: 'materials', title: '재료', from: 'materials', lines: 2 },
      { key: 'method', title: '시험 방법', ask: '기존 제품과 같은 조건에서, 몇 회 반복해 무엇을 재는지.', from: 'steps', lines: 5 },
      { key: 'result', title: '시험 결과', ask: '회차별 값·평균·그래프. 시제품 1차와 개선판을 나눠 적습니다.', kind: 'table', photos: true, lines: 0, brk: true },
      { key: 'analysis', title: '분석과 개선', ask: '목표에 도달했나요? 모자란 원인과 개선한 설계.', lines: 4 },
      { key: 'conclusion', title: '결론과 기대 효과', ask: '무엇이 얼마나 나아졌는지, 누가 쓰면 좋은지, 남은 한계.', lines: 3 },
      { key: 'refs', title: '참고 자료', ask: '수상작(대회·연도), 특허 번호, 제품명, 사이트(주소와 본 날짜).', lines: 2 },
    ],
    checks: ['성공 기준을 숫자로 정했나요?', '조사 전에 내 발상을 먼저 적었나요?', '참고한 수상작·특허와 나의 차이를 밝혔나요?', '작동 원리를 과학 개념으로 설명했나요?', '기존 것과 같은 조건에서 3회 이상 시험하고 결과로 설계를 고쳤나요?'],
  },
};
export const FORMS = { inquiry: INQUIRY, nature: NATURE, invent: INVENT };
export const TEMPLATES = INQUIRY;   // 예전 이름(과학탐구 양식)
export const CONTEST_IDS = Object.keys(FORMS);
export const formTemplate = (contest, level) => (FORMS[contest] || INQUIRY)[level] || INQUIRY.elem;
export const levelTemplate = (level, contest = 'inquiry') => formTemplate(contest, level);

// 실험 자료(curriculum 단원 + reports.js 설정)로 칸을 미리 채운다. 아이는 빈칸만 자기 말로 다듬는다.
export function prefill(unit, cfg = {}, level = 'elem', contest = 'inquiry') {
  const v = unit.activity?.vars || {};
  const varsText = level === 'mid'
    ? `독립 변인(바꾸는 것): ${(v.diff || []).join(', ')}\n종속 변인(재는 것): ${(v.measure || []).join(', ')}\n통제 변인(같게 하는 것): ${(v.same || []).join(', ')}`
    : `바꿀 것: ${(v.diff || []).join(', ')}\n같게 할 것: ${(v.same || []).join(', ')}\n잴 것: ${(v.measure || []).join(', ')}`;
  const src = {
    question: cfg.question || '',
    target: cfg.target || '',
    problem: cfg.problem || '',
    vars: varsText,
    materials: (unit.activity?.materials || []).join(', '),
    steps: (unit.activity?.steps || []).map((t, i) => `${i + 1}. ${t}`).join('\n'),
  };
  const out = {};
  for (const c of formTemplate(contest, level).cells) {
    if (c.from && src[c.from]) out[c.key] = src[c.from];
    if (c.kind === 'obs') { const labels = cfg.obs || []; out.__obs = labels.length || c.obs || 4; labels.forEach((t, i) => { out[obsKey(c.key, i, 'label')] = t; }); }
  }
  return out;
}

// 관찰그림 칸: 대상 i의 설명 글 = cells['sheet.i'], 이름표 = cells['sheet.i.label'], 그림 = photos 중 cell === 'sheet.i'. 첨삭 표시도 'sheet.i' 칸에 붙는다.
export const obsKey = (key, i, part) => `${key}.${i}${part ? '.' + part : ''}`;
// 양식에 있는 글 칸 key 전부(관찰그림 칸은 대상마다 하나씩) — 그리기·첨삭·검사 공용
export const VENN = ['a', 'both', 'b'];
// 분류 나무: node = { items: ['①','②',…], q: '분류 기준(그렇다/그렇지 않다로 답하는 질문)', yes: node|null, no: node|null }. 보고서의 R.trees[칸 key]에 둔다.
export const treeNode = (items) => ({ items: items.slice(), q: '', yes: null, no: null });
// 대상 목록이 바뀌면(대상 더하기·빼기) 나무를 맞춘다: 없어진 것은 빠지고, 새 것은 「그렇지 않다」 쪽으로 내려간다.
export function syncTree(node, items) {
  node.items = items.slice();
  if (node.yes) { const y = node.yes.items.filter((i) => items.includes(i)); syncTree(node.yes, y); syncTree(node.no, items.filter((i) => !y.includes(i))); }
  return node;
}
// 갈래 나누기: yesItems가 「그렇다」, 나머지가 「그렇지 않다」. 이미 있던 아래 갈래는 그대로 맞춘다.
export function splitTree(node, yesItems) {
  const y = node.items.filter((i) => yesItems.includes(i)), n = node.items.filter((i) => !y.includes(i));
  node.yes = node.yes ? syncTree(node.yes, y) : treeNode(y); node.no = node.no ? syncTree(node.no, n) : treeNode(n);
  return node;
}
export const unsplitTree = (node) => { node.yes = null; node.no = null; return node; };
export const treeAt = (root, path) => path.split('.').slice(1).reduce((n, k) => (n ? (k === 'y' ? n.yes : n.no) : null), root);
export const treeLeaves = (node) => (node.yes ? [...treeLeaves(node.yes), ...treeLeaves(node.no)] : [node.items]);
// 점검: 기준 없이 나뉜 갈래, 한쪽이 빈 갈래, 아직 둘 이상 남은 끝(다 나누지 않음)
export function treeIssues(node, depth = 1, out = []) {
  if (node.yes) {
    if (!node.q.trim()) out.push({ kind: 'noq', depth, items: node.items });
    if (!node.yes.items.length || !node.no.items.length) out.push({ kind: 'empty', depth, items: node.items });
    treeIssues(node.yes, depth + 1, out); treeIssues(node.no, depth + 1, out);
  } else if (node.items.length > 1) out.push({ kind: 'open', depth, items: node.items });
  return out;
}
export function textKeys(T, cells = {}) {
  return T.cells.flatMap((c) => c.kind === 'table' ? [] : c.kind === 'obs' ? Array.from({ length: cells.__obs || c.obs || 4 }, (_, i) => obsKey(c.key, i))
    : c.kind === 'venn' ? VENN.map((v) => `${c.key}.${v}`) : [c.key]);
}
// 결과 표: cfg.table = { columns: ['조건', '1일', '3일', …], rows: ['4℃', …], unit: '개' }. 값은 문자열 2차원 배열.
export const emptyTable = (cfg) => { const cols = cfg?.table?.columns?.slice() || ['조건', '1회', '2회', '3회']; return { columns: cols, rows: (cfg?.table?.rows || ['', '']).map((r) => [r, ...Array(cols.length - 1).fill('')]) }; };
// 표에 아이가 적은 값이 하나라도 있나(첫 열 이름 말고). 양식을 바꿀 때 빈 표만 새 양식 표로 갈아 끼운다.
export const tableTouched = (t) => !!t && t.rows.some((r) => r.slice(1).some((v) => String(v || '').trim()));
const num = (s) => { const n = parseFloat(String(s ?? '').replace(/[^\d.+-]/g, '')); return Number.isFinite(n) ? n : null; };
// 표 → 그래프 자료. 숫자 열이 2개 이상이면 꺾은선(줄 = 선, 열 = x), 1개면 막대.
export function chartData(table) {
  const cols = table.columns.slice(1), rows = table.rows.filter((r) => String(r[0] || '').trim());
  const series = rows.map((r) => ({ name: r[0], values: cols.map((_, j) => num(r[j + 1])) }));
  const numericCols = cols.map((_, j) => series.some((s) => s.values[j] != null));
  const kept = cols.map((c, j) => ({ c, j })).filter(({ j }) => numericCols[j]);
  if (!kept.length || !series.length) return null;
  const vals = series.flatMap((s) => kept.map(({ j }) => s.values[j])).filter((x) => x != null);
  const max = Math.max(...vals, 0), min = Math.min(...vals, 0);
  return { type: kept.length >= 2 ? 'line' : 'bar', x: kept.map(({ c }) => c), series: series.map((s) => ({ name: s.name, values: kept.map(({ j }) => s.values[j]) })), max, min };
}
// 중등: 회차 열(1회·2회·3회… 또는 잎1·잎2…)이 있으면 평균 열을 계산한다
export function withMean(table) {
  const idx = table.columns.map((c, j) => (j && /^(\d+회|잎\s?\d+)$/.test(String(c).trim()) ? j : -1)).filter((j) => j > 0);
  if (idx.length < 2) return table;
  const columns = table.columns.filter((c) => c !== '평균').concat('평균');
  const rows = table.rows.map((r) => { const vals = idx.map((j) => num(r[j])).filter((x) => x != null); const m = vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : ''; const base = r.filter((_, j) => table.columns[j] !== '평균'); return [...base, m === '' ? '' : String(m)]; });
  return { columns, rows };
}

// ── 첨삭 표시 ─────────────────────────────────────────────────────────────
// mark = { id, cell, s, e, t(덮은 글), kind: 'hl' | 'fix' | 'note', text?(고친 말·말풍선 글), done? }
// 오프셋(s·e)은 빠른 길이고 t(덮은 글)가 진짜 닻이다 — 아이가 위를 고쳐 글이 밀려도 같은 낱말을 다시 잡는다(읽기 마을 분석지와 같은 방식).
export function locate(value, m) {
  const v = String(value || ''), t = String(m.t || '');
  if (!t) return null;
  if (v.slice(m.s, m.e) === t) return [m.s, m.e];
  const near = v.indexOf(t, Math.max(0, m.s - 40)); if (near >= 0 && near <= m.s + 40) return [near, near + t.length];
  const any = v.indexOf(t); return any >= 0 ? [any, any + t.length] : null;
}
// 한 칸의 글을 표시 조각으로 쪼갠다: [{ text, marks: [mark…] }]. 겹치면 둘 다 붙는다. 못 찾은 표시는 lost에 모은다.
export function segments(value, marks) {
  const v = String(value || ''), cuts = new Set([0, v.length]), found = [], lost = [];
  for (const m of marks) { const r = locate(v, m); if (r) { found.push({ m, s: r[0], e: r[1] }); cuts.add(r[0]); cuts.add(r[1]); } else lost.push(m); }
  const pts = [...cuts].sort((a, b) => a - b), out = [];
  for (let i = 0; i < pts.length - 1; i++) { const s = pts[i], e = pts[i + 1]; if (e <= s) continue; out.push({ text: v.slice(s, e), s, e, marks: found.filter((f) => f.s <= s && f.e >= e).map((f) => f.m) }); }
  return { parts: out, lost };
}
// 메모(가이드·질문) = { id, cell, kind: 'guide' | 'question', text, done }
// 사진 = { src(data URL), cap, cell? } — cell이 없으면 결과 칸('result')
export const newId = () => Math.random().toString(36).slice(2, 9);
export const STORE = (unitId) => `sciLab.report.${unitId}`;
export const emptyReport = (unit, cfg, level, contest = 'inquiry') => ({ version: 1, unit: unit.id, level, contest, cells: prefill(unit, cfg, level, contest), table: emptyTable(cfg), photos: [], marks: [], notes: [], updatedAt: 0 });
export function validReport(r) {
  return !!r && r.version === 1 && typeof r.unit === 'string' && ['elem', 'mid'].includes(r.level) && (r.contest == null || CONTEST_IDS.includes(r.contest)) && r.cells && typeof r.cells === 'object'
    && r.table && Array.isArray(r.table.columns) && Array.isArray(r.table.rows) && Array.isArray(r.photos) && Array.isArray(r.marks) && Array.isArray(r.notes);
}
