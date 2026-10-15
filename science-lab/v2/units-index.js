import { taxonomy as tx41u01 } from '../data/units/s41-u01.taxonomy.js';
import { taxonomy as tx41u02 } from '../data/units/s41-u02.taxonomy.js';
import { taxonomy as tx41u03 } from '../data/units/s41-u03.taxonomy.js';
import { taxonomy as tx42u02 } from '../data/units/s42-u02.taxonomy.js';
import { taxonomy as tx42u01 } from '../data/units/s42-u01.taxonomy.js';
import { taxonomy as tx42u03 } from '../data/units/s42-u03.taxonomy.js';
import { taxonomy as tx42u04 } from '../data/units/s42-u04.taxonomy.js';
import { taxonomy as tx42u05 } from '../data/units/s42-u05.taxonomy.js';
import { taxonomy as tx51u01 } from '../data/units/s51-u01.taxonomy.js';
import { taxonomy as tx51u02 } from '../data/units/s51-u02.taxonomy.js';
import { taxonomy as tx51u03 } from '../data/units/s51-u03.taxonomy.js';
import { taxonomy as tx51u04 } from '../data/units/s51-u04.taxonomy.js';
import { taxonomy as tx51u05 } from '../data/units/s51-u05.taxonomy.js';
import { taxonomy as tx52u01 } from '../data/units/s52-u01.taxonomy.js';
import { taxonomy as tx31u01 } from '../data/units/s31-u01.taxonomy.js';
import { taxonomy as tx32u01 } from '../data/units/s32-u01.taxonomy.js';
import { taxonomy as tx31u03 } from '../data/units/s31-u03.taxonomy.js';
import { taxonomy as tx31u02 } from '../data/units/s31-u02.taxonomy.js';
import { taxonomy as tx32u02 } from '../data/units/s32-u02.taxonomy.js';
import { taxonomy as tx32u03 } from '../data/units/s32-u03.taxonomy.js';
import { taxonomy as tx32u04 } from '../data/units/s32-u04.taxonomy.js';
import { taxonomy as tx32u05 } from '../data/units/s32-u05.taxonomy.js';

// 탐구 지도의 정거장 = 2022 개정 과학과 교육과정 단원 순서(원장 결정 2026-10-15, science-lab/CURRICULUM-2022.md).
// 3~4학년군 16단원·5~6학년군 16단원을 학기마다 4단원씩: 공식 단원 번호 순서 = 교과서 학기 순서
// (3-1·4-1·5-1·5-2는 교과서 목차, 4-2 첫 단원·6학년 단원 이름은 자료로 확인. 나머지 학기 나눔은 같은 규칙).
// 정거장 id: 그 단원의 수업·문제은행이 이미 있으면 그 id(학습 기록·주소가 그대로 이어진다), 없으면 s<학기>-k<번호>(자리만).
// labs: 이 단원에서 함께 여는 다른 수업 id(예전 2015 교재 단원에서 만든 실험). also: 함께 여는 다른 단원평가 [id, 이름].
const station = (sem, list) => ({ sem, units: list.map(([title, code, id, more], i) => ({
  no: i + 1, sem, title, code, id: id || `s${sem.replace('-', '')}-k${String(i + 1).padStart(2, '0')}`, ...(more || {}) })) });
export const SEMS = [
  station('3-1', [['힘과 우리 생활', '4과01', 's31-u01'], ['동물의 생활', '4과02', 's31-u02', { also: [['s32-u02', '동물의 생활(2015 교재 3-2)']] }],
    ['식물의 생활', '4과03', 's31-u03', { labs: ['s42-u01'] }], ['생물의 한살이', '4과04']]),
  station('3-2', [['물체와 물질', '4과05', 's32-u04'], ['지구와 바다', '4과06'], ['소리의 성질', '4과07', 's32-u05'], ['감염병과 건강한 생활', '4과08']]),
  station('4-1', [['자석의 이용', '4과09', 's41-u01'], ['물의 상태 변화', '4과10', 's41-u02', { labs: ['s42-u02'], also: [['s42-u02', '물의 상태 변화(2015 교재 4-2)']] }],
    ['땅의 변화', '4과11', 's41-u03', { labs: ['s42-u04'], also: [['s42-u04', '화산과 지진(2015 교재 4-2)'], ['s32-u03', '지표의 변화(2015 교재 3-2)']] }],
    ['다양한 생물과 우리 생활', '4과12', 's51-u05']]),
  station('4-2', [['밤하늘 관찰', '4과13', 's51-u03'], ['생물과 환경', '4과14'], ['여러 가지 기체', '4과15'], ['기후변화와 우리 생활', '4과16']]),
  station('5-1', [['지층과 화석', '6과01'], ['빛의 성질', '6과02', 's42-u03'], ['용해와 용액', '6과03', 's51-u04'], ['우리 몸의 구조와 기능', '6과04']]),
  station('5-2', [['혼합물의 분리', '6과05'], ['날씨와 우리 생활', '6과06'], ['열과 우리 생활', '6과07', 's51-u02'], ['자원과 에너지', '6과08']]),
  station('6-1', [['산과 염기', '6과09'], ['물체의 운동', '6과10'], ['식물의 구조와 기능', '6과11'], ['지구의 운동', '6과12']]),
  station('6-2', [['계절의 변화', '6과13'], ['물질의 연소', '6과14'], ['전기의 이용', '6과15'], ['과학과 나의 진로', '6과16']]),
];
// 2022 개정에 같은 단원이 없는 수업(2015 교재 단원) — 학년 끝 「보충 탐구」 칸(원장 결정 2026-10-15)
export const EXTRA = [
  { grade: 3, units: [{ id: 's32-u01', title: '재미있는 나의 탐구' }] },
  { grade: 4, units: [{ id: 's42-u05', title: '물의 여행' }] },
  { grade: 5, units: [{ id: 's51-u01', title: '과학자는 어떻게 탐구할까요' }, { id: 's52-u01', title: '재미있는 나의 탐구' }] },
];
// 중간·기말평가(단원평가 묶음): 2022 학기와 단원이 같은 것은 그 학기, 2015 교재 학기 것은 보충
export const EXAMS = { '3-1': ['s31-mid'], '4-1': ['s41-mid'], extra: ['s32-mid', 's32-fin'] };
// 수업 id → 지도에서의 자리(학기·번호·단원 이름). 보충이면 { extra: true, grade }
export function placeOf(id) {
  for (const s of SEMS) for (const u of s.units) if (u.id === id || (u.labs || []).includes(id) || (id === 's41-u03b' && u.id === 's41-u03')) return u;
  for (const g of EXTRA) for (const u of g.units) if (u.id === id) return { ...u, extra: true, grade: g.grade };
  return null;
}

// subs = 소단원(교육과정 내용 요소). 소단원 화면 #/<단원>/sub/<E>
const subsOf = (tx) => tx.elements.map((e) => ({ ...e, types: tx.types.filter((t) => t.element === e.id).length }));
// lesson:false = 5단계 화면 준비 전(소단원 유형별 문제만 열림)
export const READY = {
  's32-u05': { subs: subsOf(tx32u05), bankOnly: true },
  's32-u04': { subs: subsOf(tx32u04), bankOnly: true },
  's32-u03': { subs: subsOf(tx32u03), bankOnly: true },
  's32-u02': { subs: subsOf(tx32u02), bankOnly: true },
  's31-u02': { subs: subsOf(tx31u02), bankOnly: true },
  's31-u03': { subs: subsOf(tx31u03), bankOnly: true },
  's32-u01': { subs: subsOf(tx32u01), bankOnly: true },
  's31-u01': { subs: subsOf(tx31u01), bankOnly: true },
  's41-u01': { hero: '고리 자석 탑', subs: subsOf(tx41u01) },
  's41-u02': { hero: '얼음 병 저울', subs: subsOf(tx41u02) },
  's41-u03': { hero: '흙 언덕 물길', subs: subsOf(tx41u03),
    labs: [{ id: 's41-u03', hero: '흙 언덕 물길', covers: ['E1', 'E2'] }, { id: 's41-u03b', hero: '화산 실험실', covers: ['E3', 'E4', 'E5', 'E6'] }] },
  's41-u03b': { hero: '화산 실험실', subs: subsOf(tx41u03), hidden: true },   // 땅의 변화의 두 번째 5단계 수업(지도에는 정거장 없음)
  's42-u01': { hero: '부레옥잠 연못', subs: subsOf(tx42u01) },
  's42-u02': { hero: '미니 가습기', subs: subsOf(tx42u02) },
  's42-u03': { hero: '그림자 놀이 상자', subs: subsOf(tx42u03) },
  's42-u04': { hero: '지층 모형 지진 실험실', subs: subsOf(tx42u04),
    labs: [{ id: 's42-u04', hero: '지층 모형 지진 실험실', covers: ['E2', 'E3'] }, { id: 's41-u03b', hero: '화산 실험실', covers: ['E1'] }] },
  's42-u05': { hero: '수조 속 작은 지구', subs: subsOf(tx42u05) },
  's51-u01': { hero: '튀는 물방울 실험실', subs: subsOf(tx51u01) },
  's51-u02': { hero: '시온 스티커 실험실', subs: subsOf(tx51u02) },
  's51-u03': { hero: '떠오르는 태양 실험실', subs: subsOf(tx51u03) },
  's51-u04': { hero: '병 속 눈 실험실', subs: subsOf(tx51u04) },
  's51-u05': { hero: '효모빵 반죽 실험실', subs: subsOf(tx51u05) },
  's52-u01': { hero: '비눗방울 실험실', subs: subsOf(tx52u01) },
};

// 문제은행 = 단원평가 원문(<단원>.source.js) + 유사문항. sets = 세트 번호, n = 원문 수.
// 5단계 수업이 없는 단원도 여기에 있으면 지도에서 열린다(READY에 bankOnly:true로 함께 등록).
export const BANK = {
  's51-u01': { sets: [1], n: 15 },
  's42-u05': { sets: [1,  2,  3], n: 45 },
  's42-u04': { sets: [1,  2,  3,  4], n: 70 },
  's42-u03': { sets: [1,  2,  3,  4], n: 70 },
  's41-mid': { sets: [1,  2], n: 50 },
  's32-fin': { sets: [1,  2], n: 40 },
  's32-mid': { sets: [1,  2], n: 40 },
  's32-u05': { sets: [1,  2,  3,  4], n: 70 },
  's32-u04': { sets: [1,  2,  3,  4], n: 70 },
  's31-mid': { sets: [1,  2], n: 50 },
  's32-u03': { sets: [1,  2,  3,  4], n: 70 },
  's32-u02': { sets: [1,  2,  3,  4], n: 70 },
  's31-u02': { sets: [1,  2,  3,  4], n: 80 },
  's31-u03': { sets: [1,  2,  3,  4], n: 80 },
  's32-u01': { sets: [1], n: 15 },
  's31-u01': { sets: [1, 2, 3, 4], n: 80 },
  's42-u02': { sets: [1, 2, 3, 4], n: 70 },
};

// 실험 교재(data/book/<id>.book.js)가 있는 수업 — 지도의 시트에서 첫 화면(#/<id>/start)으로 들어간다.
export const BOOK_UNITS = new Set(['s41-u01', 's41-u02', 's41-u03', 's41-u03b', 's42-u01', 's42-u02', 's42-u03', 's42-u04', 's42-u05', 's51-u01', 's51-u02', 's51-u03', 's51-u04', 's51-u05', 's52-u01']);
