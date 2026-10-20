// 해안 마을 모형(4-2 Ⅳ 기후변화와 우리 생활) 수치 — 브라우저·Node 테스트 공용, THREE 없음.
// 2022 [4과16] 필수 탐구 「해수면 상승으로 인한 피해 모형실험」: 투명한 통에 점토 육지와 집 표지를 고정하고, 물높이만 바꾸어 물에 닿는 집을 센다.
// 집 다섯 채의 땅 높이(통 바닥에서 cm)는 모형 값이다. 바다와의 거리와 땅의 높이를 일부러 엇갈리게 놓았다:
// A는 바다 바로 옆이지만 언덕 위, B는 바다 가까운 낮은 모래땅, C는 강가의 낮은 땅, D는 안쪽 평지, E는 먼 언덕.
// 방파제(높이 3.5 cm)는 바닷가를 따라 강 하구까지 막는다. 물이 방파제보다 높아지면 넘쳐 안쪽 낮은 땅이 잠긴다.
// 실제 바다의 파도·밀물과 썰물·땅 모양·축척은 없다 — 특정 마을이 언제 얼마나 잠길지 예측하는 모형이 아니다.
export const LEVELS = [1, 2, 3, 4];          // 물높이(cm). 1 cm = 지금의 바다
export const WALL = 3.5;                      // 방파제 높이(cm)
export const HOUSES = [
  { id: 'A', base: 4.5, near: '바다 바로 옆 · 언덕 위' },
  { id: 'B', base: 1.5, near: '바다 가까이 · 낮은 모래땅' },
  { id: 'C', base: 2.5, near: '강가 · 낮은 땅' },
  { id: 'D', base: 3.5, near: '마을 안쪽 · 평지' },
  { id: 'E', base: 6.0, near: '바다에서 멀리 · 높은 언덕' },
];
export const WALLS = ['방파제 없음', '방파제 있음'];

// 방파제 안쪽까지 물이 들어오는가
export const overtops = (level, wall) => !wall || level > WALL;
// 물에 닿은 집(땅 높이 ≤ 물높이, 방파제가 있으면 넘칠 때만)
export function wetHouses(level, wall = false) {
  if (!LEVELS.includes(level)) throw new RangeError('unknown level');
  return overtops(level, wall) ? HOUSES.filter((h) => h.base <= level).map((h) => h.id) : [];
}
export function seaModel(level, wall = false) {
  const wet = wetHouses(level, wall);
  return { level, wall: WALLS[wall ? 1 : 0], wet, n: wet.length, result: wet.length ? `${wet.length}채(${wet.join('·')})` : '0채' };
}
