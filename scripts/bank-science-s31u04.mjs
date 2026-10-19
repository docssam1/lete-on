// 자체 교재의 실제 지면에서 옮긴 원문과 같은 유형의 짝 문항을 생성한다.
import { readFileSync } from 'node:fs';
import { importUnit } from './bank-science-lib.mjs';
const dir = process.argv[2];
if (!dir) throw new Error('쓰기: node scripts/bank-science-s31u04.mjs <전사 작업 폴더>');
const read = (name) => JSON.parse(readFileSync(new URL(`../science-lab/bank/work/s31u04/${name}`, import.meta.url), 'utf8'));
const reviewedJudge = read('judge-reviewed.json'), curriculum = read('curriculum.json'), manifest = read('source-manifest.json');
const supplement = read('supplement.json');
await importUnit({
  unit: 's31-u04', no: 4, dir, date: '2026-10-17', unitTitle: '생물의 한살이', title: '3-1 Ⅳ 생물의 한살이',
  grade: 3, semester: 1, uKey: 'u04', area: '생명', course: '초등 3-1', unitLabel: 'Ⅳ. 생물의 한살이',
  sourceId: 'gfield-life-cycle', edition: '지필드 자체 교재', sourceLabel: '교재 문항',
  sourceBooks: Object.fromEntries(manifest.books.map((b) => [b.id, { ...b,
    sourceId: b.id === 'animals' ? 'gfield-theory-31-2' : 'gfield-theory-41-2',
    course: `초등 ${b.course}`, unitLabel: b.id === 'animals' ? '동물의 한살이' : '식물의 한살이',
  }])),
  standards: curriculum.standards, standardsSource: curriculum.standardsSource, standardsNote: curriculum.standardsNote,
  items: supplement, lessonTypes: Object.fromEntries(supplement.map((q) => [q.id.replace('s31-u04-', ''), q.taxonomy.type])),
  lessonMis: read('supplement-mis.json'), lessonJudge: read('supplement-judge.json'), deckJudge: read('deck-judge.json'),
  elements: [
    { id: 'E1', name: '동물의 자람과 관찰 계획' }, { id: 'E2', name: '곤충의 한살이' },
    { id: 'E3', name: '싹트기와 자람 조건 실험' }, { id: 'E4', name: '식물의 한살이와 관찰 자료' },
  ],
  types: {
    T01: { element: 'E1', name: '동물의 자라는 모습과 번식 방식', desc: '제시된 동물의 자라는 모습을 비교하고 알이나 새끼로 대를 잇는 방식을 관찰 자료와 연결한다.' },
    T02: { element: 'E1', name: '동물 관찰 계획과 생명 존중', desc: '기르는 장소·방법·먹이·한살이 기간을 고려하고 동물을 해치지 않으면서 기록할 내용을 정한다.' },
    T03: { element: 'E2', name: '배추흰나비의 먹이와 관찰 방법', desc: '알맞은 먹이·방충망·조용한 환경을 마련하고 한살이 변화를 기록한다.' },
    T04: { element: 'E2', name: '배추흰나비 각 단계의 관찰 특징', desc: '알·애벌레·번데기·성충의 먹이·겉모습·움직임을 비교하고 변화의 방향을 설명한다.' },
    T05: { element: 'E2', name: '여러 곤충의 한살이 비교', desc: '번데기 단계를 거치는 한살이와 거치지 않는 한살이를 자료로 비교한다.' },
    T06: { element: 'E3', name: '싹트기와 자람에 필요한 조건', desc: '싹트기에서는 물·온도, 자람에서는 물·햇빛의 영향을 비교한다.' },
    T07: { element: 'E3', name: '공정한 비교 실험 계획', desc: '알아볼 조건 한 가지만 다르게 하고 다른 조건을 같게 하는 실험을 계획하며 검증 가능한 가설을 세운다.' },
    T08: { element: 'E4', name: '식물의 한살이와 관찰 자료', desc: '같은 식물의 날짜별 기록·그래프·한살이 사진을 읽는다. 씨앗에서 새 씨앗으로 이어지는 과정과 한해살이·여러해살이의 차이를 비교한다.' },
  },
  newMis: {
    M01: { label: '동물의 자람과 알이나 새끼로 대를 잇는 방식을 헷갈려요', element: 'E1', terms: ['새끼', '어미', '한살이'], fix: '같은 동물도 <b>자라면서 모습과 행동이 달라져요</b>. 제시된 동물이 <b>알이나 새끼로 대를 잇는 방식</b>을 각각 살펴봐요.', step: 3 },
    M02: { label: '변화를 보려고 먹이를 끊거나 몸을 만져도 된다고 생각해요', element: 'E1', terms: ['관찰', '먹이', '기록'], fix: '동물에게 <b>알맞은 먹이와 환경</b>을 마련하고 해치지 않으면서 날짜별 변화를 관찰해요.', step: 2 },
    M03: { label: '배추흰나비 애벌레가 아무 잎이나 먹는다고 생각해요', element: 'E2', terms: ['먹이', '배추', '케일'], fix: '배추흰나비 애벌레에게는 <b>배추·케일·무·갓·유채</b>처럼 알맞은 먹이를 준비해요.', step: 2 },
    M04: { label: '알·애벌레·번데기·성충의 특징을 서로 바꾸어 생각해요', element: 'E2', terms: ['애벌레', '번데기', '성충'], fix: '<b>애벌레는 잎을 먹으며 자라고</b>, 번데기는 먹이를 먹지 않아요. 성충은 <b>날개로 날 수 있어요</b>.', step: 3 },
    M05: { label: '모든 곤충이 번데기를 거친다고 생각해요', element: 'E2', terms: ['번데기', '한살이', '곤충'], fix: '나비·모기·개미는 <b>번데기를 거치지만</b>, 메뚜기·잠자리·사마귀는 <b>거치지 않아요</b>.', step: 3 },
    M06: { label: '싹트는 조건과 자라는 조건을 구별하지 못해요', element: 'E3', terms: ['싹트기', '물', '햇빛'], fix: '이 단원에서는 <b>싹트기의 물·온도</b>와 <b>자람의 물·햇빛</b>을 나누어 알아봐요.', step: 3 },
    M07: { label: '실험에서 여러 조건을 한꺼번에 다르게 해도 된다고 생각해요', element: 'E3', terms: ['조건', '비교', '가설'], fix: '알아볼 조건 <b>한 가지만 다르게</b> 하고 다른 조건은 같게 해야 어떤 조건의 영향인지 비교할 수 있어요.', step: 2 },
    M08: { label: '식물의 자람 기록과 한살이 과정을 잘못 해석해요', element: 'E4', terms: ['날짜', '같은 식물', '한살이'], fix: '<b>같은 식물의 날짜별 모습</b>을 비교해요. 씨앗부터 꽃·열매·새 씨앗까지 이어지는 기록을 모아요.', step: 3 },
    M09: { label: '같은 자리에서 새로 난 싹을 같은 개체가 여러 해 산 것으로 생각해요', element: 'E4', terms: ['한해살이', '여러해살이', '같은 개체'], fix: '<b>한해살이</b>는 한 해 안에 한살이를 마쳐요. <b>여러해살이</b>인지 알려면 같은 개체가 여러 해 살아가는지 살펴봐요. 같은 자리의 새 씨앗에서 난 싹과 구별해요.', step: 3 },
  },
  sourceNotes: {
    '1-2': '원문의 기간은 교재 관찰 사례의 설명이에요. 자라는 속도는 개체와 기르는 조건에 따라 달라질 수 있어요.',
    '1-3': '교재에서 설명하는 개구리의 한살이 사례로 읽어요. 사진은 개구리의 예시이며 모든 개구리 종의 산란 장소가 같다는 뜻은 아니에요.',
    '1-5': '제시한 사자·개·토끼의 공통점을 묻는 문제예요. 새끼를 낳는 모든 동물에게 젖먹이기·털이 있다는 뜻으로 넓히지 않아요. 예시 중 타당한 공통점 한 가지를 인정해요.',
    '2-3': '원문의 “움직이지 않는다”는 먹이를 찾아 돌아다니지 않는 모습과 구분해 읽어요. 번데기가 전혀 몸을 움직일 수 없다는 뜻으로 일반화하지 않아요.',
    '2-7': '교사용 Tip은 성충의 특징을 폭넓게 인정하지만 발문은 다른 점을 물어요. 날개·긴 대롱 모양의 입처럼 분명한 차이를 찾아요. 몸이 머리·가슴·배로 나뉘는 것은 애벌레에도 있어 차이를 설명하는 근거가 되지 않아요. 아래 채점 요소는 인쇄 배점표가 아닌 발문에 따른 학습용 기준이에요.',
    '2-14': '번데기는 먹이를 먹거나 찾아 돌아다니지 않고 애벌레는 잎을 먹으며 기어 다녀요. 원문의 “움직이지 않는다”를 전혀 몸을 움직일 수 없다는 뜻으로 넓히지 않아요.',
    '3-3': '이 단원의 자람 실험에서는 물·햇빛의 영향을 알아봐요. 원문 해설의 공기·양분을 별도 필수 실험 요인으로 요구하지 않아요.',
    '3-6': '강낭콩·봉숭아처럼 교재에서 관찰한 씨앗으로 번식하는 식물의 한살이 비교예요. 모든 식물이 씨앗으로 번식한다는 뜻은 아니에요.',
    '4-2': '가·나는 교재 본문처럼 상온에 둔 경우로 읽어요. 이 문제에서는 물·온도의 두 조건을 비교해요.',
    '4-3': '이 그래프에 나타난 관찰 기간에는 길이가 늘다가 나중에는 거의 같게 유지돼요. 원문 해설을 “꽃이 피면 모든 식물의 줄기가 더 자라지 않는다”는 법칙으로 넓히지 않아요.',
    '4-4': '꽃이 진 뒤 열매가 자라고 그 안에 씨앗이 생겨요. 열매와 씨앗은 같은 부분이 아니에요.',
    '4-5': '가설은 검증 가능한 예상이에요. 햇빛과 식물의 자람을 연결했다면 예시와 반대 방향의 예상도 인정해요.',
    '4-8': '같은 한 포기의 시간에 따른 자람을 추적하는 활동이에요. 다른 식물과 비교하는 모든 조사가 잘못이라는 뜻은 아니에요.',
  },
  required: Object.fromEntries(Object.entries(reviewedJudge).filter(([k]) => k.startsWith('src:')).map(([k, v]) => [k, v.need.map((n) => n.t)])),
  judge: reviewedJudge,
});
