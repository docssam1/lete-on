// 2022 개정의 학기별 위치와 실제 문항 파일 ID는 별개다.
// 기존 ID를 새 제목으로 바꾸지 않는다. 본문·문항을 검수한 뒤 CONTENT에 명시적으로 연결한다.
// 목차 근거: bank/work/curriculum2022/review-20261017.json (공식 출판사 8권).
const rows = [
  ['3-1', 'BM12060', ['힘과 우리 생활', '동물의 생활', '식물의 생활', '생물의 한살이']],
  ['3-2', 'BM12605', ['물체와 물질', '지구와 바다', '소리의 성질', '감염병과 건강한 생활']],
  ['4-1', 'BM12061', ['자석의 이용', '물의 상태 변화', '땅의 변화', '다양한 생물과 우리 생활']],
  ['4-2', 'BM12606', ['밤하늘 관찰', '생물과 환경', '여러 가지 기체', '기후변화와 우리 생활']],
  ['5-1', 'BM12703', ['지층과 화석', '빛의 성질', '용해와 용액', '우리 몸의 구조와 기능']],
  ['5-2', 'BM13053', ['혼합물의 분리', '열과 우리 생활', '날씨와 우리 생활', '자원과 에너지']],
  ['6-1', 'BM12704', ['산과 염기', '물체의 운동', '식물의 구조와 기능', '지구의 운동']],
  ['6-2', 'BM13054', ['계절의 변화', '물질의 연소', '전기의 이용', '과학과 나의 진로']],
];

export const SEMS_2022 = rows.map(([sem, book, titles]) => ({
  sem,
  source: `https://bookstore.visang.com/BookStore_view_new.asp?CateCode=&b_code=${book}&gotopage=`,
  units: titles.map((title, i) => {
    const position = `s${sem.replace('-', '')}-u${String(i + 1).padStart(2, '0')}`;
    return { key: `2022:${position}`, position, no: i + 1, title };
  }),
}));

// 원문·창작 문항과 해당 화면을 실제로 검증한 연결만 등록한다.
const CONTENT = {
  's52-u04':{contentId:'c22-s52-u04',review:'bank/work/c22s52u04/review-20261019.json'},
  's52-u03':{contentId:'c22-s52-u03',review:'bank/work/c22s52u03/review-20261018.json',lessonReview:'bank/work/c22s52u03/lesson-review-20261018.json'},
  's52-u02':{contentId:'c22-s52-u02',review:'bank/work/c22s52u02/review-20261018.json',lessonReview:'bank/work/c22s52u02/lesson-review-20261018.json'},
  's52-u01':{contentId:'c22-s52-u01',review:'bank/work/c22s52u01/review-20261018.json',lessonReview:'bank/work/c22s52u01/lesson-review-20261018.json'},
  's51-u04':{contentId:'c22-s51-u04',review:'bank/work/c22s51u04/review-20261018.json',lessonReview:'bank/work/c22s51u04/lesson-review-20261018.json'},
  's51-u03':{contentId:'c22-s51-u03',review:'bank/work/c22s51u03/review-20261018.json',lessonReview:'bank/work/c22s51u03/lesson-review-20261018.json'},
  's51-u02': {contentId:'c22-s51-u02',review:'bank/work/c22s51u02/review-20261018.json',lessonReview:'bank/work/c22s51u02/lesson-review-20261018.json'},
  's51-u01': {contentId:'c22-s51-u01',review:'bank/work/c22s51u01/review-20261018.json'},
  's42-u04':{contentId:'c22-s42-u04',review:'bank/work/c22s42u04/review-20261018.json'},
  's42-u03':{contentId:'c22-s42-u03',review:'bank/work/c22s42u03/review-20261018.json'},
  's42-u02':{contentId:'c22-s42-u02',review:'bank/work/c22s42u02/review-20261018.json'},
  's42-u01':{contentId:'c22-s42-u01',review:'bank/work/c22s42u01/review-20261018.json'},
  's41-u04':{contentId:'s41-u04',review:'bank/work/s41u04/review-20261018.json',lessonReview:'bank/work/s41u04/lesson-review-20261018.json'},
  's41-u03': { contentId:'s41-u03', review:'bank/work/s41u03/review-20261018.json', lessonReview:'bank/work/s41u03/lesson-review-20261018.json' },
  's41-u01': { contentId:'s41-u01', review:'bank/work/s41u01/review-20261018.json', lessonReview:'bank/work/s41u01/lesson-review-20261018.json' },
  's32-u04': { contentId: 'c22-s32-u04', review: 'bank/work/c22s32u04/review-20261018.json' },
  's32-u03': { contentId: 'c22-s32-u03', review: 'bank/work/c22s32u03/review-20261017.json' },
  's31-u01': { contentId: 's31-u01', review: 'bank/work/s31u01/review-20261017.json' },
  's31-u02': { contentId: 's31-u02', review: 'bank/work/s31u02/review-20261017.json' },
  's31-u03': { contentId: 's31-u03', review: 'bank/work/s31u03/review-20261017.json' },
  's31-u04': { contentId: 's31-u04', review: 'bank/work/s31u04/review-20261017.json' },
  's32-u02': { contentId: 'c22-s32-u02', review: 'bank/work/c22s32u02/review-20261017.json' },
  's32-u01': { contentId: 'c22-s32-u01', review: 'bank/work/c22s32u01/review-20261017.json' },
  's41-u02': { contentId:'s41-u02', review:'bank/work/s41u02/review-20261018.json', lessonReview:'bank/work/s41u02/lesson-review-20261018.json' },
};

// 2022 자리 → 그 자리를 채우는 내용 id(없으면 null). 이름표는 curriculum-place.js가 이것으로 정한다.
export const contentId2022 = (position) => CONTENT[position]?.contentId || null;

// BANK[position]을 대신 쓰지 않는다. 같은 위치의 기존 단원은 다른 내용일 수 있다.
export function bankFor2022(position, bank) {
  const link = CONTENT[position];
  const resource = link && bank[link.contentId];
  return resource ? { ...resource, contentId: link.contentId } : null;
}

// 학기 평가는 네 단원과 별도로 연결한다. 원자료의 실제 범위를 유지한다.
const ASSESSMENTS = {
  '5-1':[{contentId:'c22-s51-mid',title:'중간평가 · 창작',scope:'지층과 화석 · 빛의 성질 (1~2단원 학습용 구성)',review:'bank/work/c22s51mid/review-20261018.json'},{contentId:'c22-s51-fin',title:'기말평가',scope:'창작: 지층과 화석 · 빛의 성질 · 용해와 용액 · 우리 몸의 구조와 기능 / 옛 원문: 용해와 용액 관련 발췌',review:'bank/work/c22s51fin/review-20261018.json'}],
  '4-2':[{contentId:'c22-s42-mid',title:'중간평가 · 창작',scope:'밤하늘 관찰 · 생물과 환경 (1~2단원 학습용 구성)',review:'bank/work/c22s42mid/review-20261018.json'},{contentId:'c22-s42-fin',title:'기말평가 · 창작',scope:'밤하늘 관찰 · 생물과 환경 · 여러 가지 기체 · 기후변화와 우리 생활 (1~4단원 학습용 구성)',review:'bank/work/c22s42fin/review-20261018.json'}],
  '4-1': [{contentId:'c22-s41-mid',title:'중간평가',scope:'자석의 이용 · 물의 상태 변화 (두 단원 학습용 범위)',review:'bank/work/s41mid/review-20261018.json'},{contentId:'c22-s41-fin',title:'기말평가 · 창작',scope:'자석의 이용 · 물의 상태 변화 · 땅의 변화 · 다양한 생물과 우리 생활 (1~4단원 학습용 구성)',review:'bank/work/c22s41fin/review-20261018.json'}],
  '3-2': [
    { contentId: 'c22-s32-mid', title: '중간평가 · 창작', scope: '물체와 물질 · 지구와 바다 (1~2단원 학습용 구성)', review: 'bank/work/c22s32mid/review-20261018.json' },
    { contentId: 'c22-s32-fin', title: '기말평가 · 창작', scope: '물체와 물질 · 지구와 바다 · 소리의 성질 · 감염병과 건강한 생활 (1~4단원 학습용 구성)', review: 'bank/work/c22s32fin/review-20261018.json' },
  ],
  '3-1': [
    { contentId: 's31-mid', title: '중간평가', scope: '힘과 우리 생활 · 동물의 생활', review: 'bank/work/s31mid/review-20261017.json' },
    { contentId: 's31-fin', title: '기말평가 · 창작', scope: '힘과 우리 생활 · 동물의 생활 · 식물의 생활 · 생물의 한살이', review: 'bank/work/s31fin/review-20261017.json' },
  ],
};
export function assessmentsFor2022(semester, bank) {
  return (ASSESSMENTS[semester] || []).filter((a) => bank[a.contentId]).map((a) => ({ ...bank[a.contentId], ...a }));
}
