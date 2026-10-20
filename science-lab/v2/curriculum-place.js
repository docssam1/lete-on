// 단원 id → 「어느 교육과정의 몇 학년 몇 학기 몇 단원」. 홈·시작 화면·수업 표지가 모두 이 한 곳에서 이름을 읽는다.
// 같은 「4-2 Ⅳ」라도 2022 개정(c22-s42-u04 기후변화)과 2015 교재(s42-u04 화산과 지진)는 다른 단원이다.
// 2022 자리 → 내용 id 는 curriculum-2022.js CONTENT 가 정한다. 3-1·4-1처럼 예전 id를 2022 내용으로 쓰는 단원도 있어서 2022를 먼저 찾는다.
import { SEMS_2022, contentId2022 } from './curriculum-2022.js';
import { SEMS } from './units-index.js';

const ROMAN = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ'];
const semText = (sem) => sem.replace('-', '학년 ') + '학기';

// 2015 교재 단원이 2022에서는 어디로 갔는지(근거: science-lab/CURRICULUM-2022.md 성취기준 대조). null = 2022에 같은 단원 없음.
export const LEGACY_TO_2022 = {
  's32-u01': { to: null, note: '2022에는 따로 없는 탐구 단원이에요. 탐구 과정은 각 단원 안에서 배워요.' },
  's32-u02': { to: 's31-u02' },
  's32-u03': { to: 's41-u03' },
  's32-u04': { to: 's32-u01' },
  's32-u05': { to: 's32-u03' },
  's42-u01': { to: 's31-u03' },
  's42-u02': { to: 's41-u02' },
  's42-u03': { to: 's51-u02' },
  's42-u04': { to: 's41-u03' },
  's42-u05': { to: null, note: '2022에는 따로 없어요. 물의 상태 변화(4-1 Ⅱ)와 날씨와 우리 생활(5-2 Ⅲ)에서 이어서 배워요.' },
  's51-u01': { to: null, note: '2022에는 따로 없는 탐구 단원이에요. 탐구 과정은 각 단원 안에서 배워요.' },
  's51-u02': { to: 's52-u02' },
  's51-u03': { to: 's42-u01' },
  's51-u04': { to: 's51-u03' },
  's51-u05': { to: 's41-u04' },
  's52-u01': { to: null, note: '2022에는 따로 없는 탐구 단원이에요. 탐구 과정은 각 단원 안에서 배워요.' },
};
// 한 2022 단원에 딸린 별도 실험 수업(같은 단원, 다른 id)
const EXTRA_OF = { 's41-u03b': 's41-u03' };

const POS = new Map();
for (const s of SEMS_2022) for (const u of s.units) POS.set(u.position, { ...u, sem: s.sem });
const CONTENT_POS = new Map();
for (const p of POS.values()) { const id = contentId2022(p.position); if (id) CONTENT_POS.set(id, p.position); }
const OLD = new Map();
for (const s of SEMS) for (const u of s.units) OLD.set(u.id, { ...u, sem: s.sem });

const at2022 = (position) => { const p = POS.get(position); return p && { era: '2022', sem: p.sem, no: p.no, title: p.title, position }; };

// { era:'2022'|'2015', sem, no, title, now? } 또는 null
export function placeOf(id) {
  const own = CONTENT_POS.get(id) || CONTENT_POS.get(EXTRA_OF[id]);
  if (own) return at2022(own);
  const old = OLD.get(id);
  if (!old) return null;
  const m = LEGACY_TO_2022[id];
  return { era: '2015', sem: old.sem, no: old.no, title: old.title, now: m?.to ? at2022(m.to) : null, note: m?.note || '' };
}

export const placeShort = (p) => p ? `${semText(p.sem)} ${ROMAN[p.no - 1]}. ${p.title}` : '';
// 「2022 개정 · 4학년 2학기 Ⅳ. 기후변화와 우리 생활」 / 「2015 교재 · 4학년 2학기 Ⅳ. 화산과 지진」
export function placeLabel(id) {
  const p = placeOf(id);
  if (!p) return '';
  return `${p.era === '2022' ? '2022 개정' : '2015 교재'} · ${placeShort(p)}`;
}
// 2015 단원이면 「지금 교과서에서는 …」 한 줄
export function placeNow(id) {
  const p = placeOf(id);
  if (!p || p.era !== '2015') return '';
  return p.now ? `지금 교과서(2022)에서는 ${placeShort(p.now)}` : p.note;
}
// 2022 자리 하나에 딸린 2015 교재 자료 id 목록
export const legacyFor = (position) => Object.entries(LEGACY_TO_2022).filter(([, m]) => m.to === position).map(([id]) => id);
