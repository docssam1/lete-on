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

// 탐구 지도의 정거장 = Drive `과학 단원평가` 폴더의 단원(data/source-toc.md §1). 중간·기말평가는 제외.
// ready: 5E 화면이 있는 단원. 새 단원을 만들면 v2.js UNITS와 여기 ready 둘 다 등록한다.
export const SEMS = [
  { sem: '3-1', units: ['힘과 우리 생활', '동물의 생활', '식물의 생활'] },
  { sem: '3-2', units: ['재미있는 나의 탐구', '동물의 생활', '지표의 변화', '물질의 상태', '소리의 성질'] },
  { sem: '4-1', units: ['자석의 이용', '물의 상태 변화', '땅의 변화'] },
  { sem: '4-2', units: ['식물의 생활', '물의 상태 변화', '그림자와 거울', '화산과 지진', '물의 여행'] },
  { sem: '5-1', units: ['과학자는 어떻게 탐구할까요', '온도와 열', '태양계와 별', '용해와 용액', '다양한 생물과 우리 생활'] },
  { sem: '5-2', units: ['재미있는 나의 탐구', '생물과 환경', '날씨와 우리 생활', '물체의 운동', '산과 염기'] },
  { sem: '6-1', units: ['과학자처럼 탐구해 볼까요', '지구와 달의 운동', '여러 가지 기체', '식물의 구조와 기능', '빛과 렌즈'] },
  { sem: '6-2', units: ['전기의 이용', '계절의 변화', '연소와 소화', '우리 몸의 구조와 기능', '에너지와 생활'] },
].map((s) => ({ ...s, units: s.units.map((title, i) => ({ id: `s${s.sem.replace('-', '')}-u${String(i + 1).padStart(2, '0')}`, no: i + 1, title })) }));

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
