// 풀밭 먹이 관계 모형(4-2 Ⅱ 생물과 환경) — 브라우저·Node 테스트 공용, THREE 없음.
// 풀 → 토끼 → 여우 하나의 먹이 사슬만 있는 닫힌 풀밭(바깥에서 새 먹이가 들어오지 않는다고 가정 — 문제은행 b15와 같은 가정).
// 한 가지를 바꾸고 몇 해 지켜보면 먹이 관계로 이어진 생물의 수가 함께 달라진다. 수는 경향을 보여 주려고 정한 모형 값이며 실제 조사값이 아니다.
export const CHANGES = ['그대로', '여우가 사라짐', '토끼가 사라짐', '풀이 줄어듦(가뭄)'];
export const SPECIES = [['grass', '풀'], ['rabbit', '토끼'], ['fox', '여우']];
export const YEARS = 3;
export const BASE = { grass: 60, rabbit: 12, fox: 3 };
// 해마다(0 = 바꾼 직후 ~ 3년 뒤)의 수
const TABLE = {
  '그대로': { grass: [60, 60, 60, 60], rabbit: [12, 12, 12, 12], fox: [3, 3, 3, 3] },
  '여우가 사라짐': { grass: [60, 52, 40, 28], rabbit: [12, 18, 24, 28], fox: [0, 0, 0, 0] },
  '토끼가 사라짐': { grass: [60, 68, 75, 80], rabbit: [0, 0, 0, 0], fox: [3, 2, 1, 1] },
  '풀이 줄어듦(가뭄)': { grass: [36, 34, 32, 30], rabbit: [12, 9, 7, 6], fox: [3, 3, 2, 2] },
};
export function meadowAt(change, year) {
  const t = TABLE[change]; if (!t) throw new RangeError(`unknown change ${change}`);
  const y = Math.max(0, Math.min(YEARS, year)), i = Math.floor(y), f = y - i, at = (a) => (i >= YEARS ? a[YEARS] : a[i] + (a[i + 1] - a[i]) * f);
  return { grass: at(t.grass), rabbit: at(t.rabbit), fox: at(t.fox) };
}
const trend = (k, n, change) => (change === '여우가 사라짐' && k === 'fox') || (change === '토끼가 사라짐' && k === 'rabbit') ? '없음' : n > BASE[k] ? '늘어남' : n < BASE[k] ? '줄어듦' : '그대로';
export function meadowRow(change) {
  const n = meadowAt(change, YEARS), tr = Object.fromEntries(SPECIES.map(([k]) => [k, trend(k, n[k], change)]));
  const moved = SPECIES.filter(([k]) => tr[k] === '늘어남' || tr[k] === '줄어듦').map(([k, name]) => `${name} ${tr[k]}`);
  return { change, grass: n.grass, rabbit: n.rabbit, fox: n.fox, grassT: tr.grass, rabbitT: tr.rabbit, foxT: tr.fox, result: moved.length ? moved.join(' · ') : '풀·토끼·여우 모두 그대로' };
}
