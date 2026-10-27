// 자연관찰 공원 지도(그림 한 장 + 지점 표). 화면에 실제 장소 이름은 쓰지 않는다(원장: 「장소는 말하지 말고 자연관찰대회 정도만」).
// 그림 = Blender 렌더(해변 공원 — 남·동쪽 백사장과 바다, 북·서쪽 차도. 원장 「지도가 끊기는 거 이상해 … 해수욕장 공원」) — tools/blender/park-map.py. 원장 2026-10-26: 「솔은 이 정도 된다는데? … 난 맵을 말하는 거야 먼저」(GPT 조감도에서 교체).
// 그림 = 그 렌더를 맥에서 FLUX.2 [klein] 4B로 실사풍으로 다시 그린 것(2차, 2026-10-27 — 렌더와 대조해 지점·사람 자리 어긋남 0~4px, 해변 한 곳만 모래 무늬로 32px). 배치를 바꾸면 렌더 → park-apply → FLUX를 다시.
// 지도는 대회 날(하루) 현장 관찰만 — 강낭콩 자람·곰팡이 일기처럼 오래 보는 관찰은 사전 탐구보고서라 지도에 두지 않는다(원장 2026-10-25).
// 좌표는 그림 위의 % (왼쪽 위 = 0, 0). 손으로 잡지 않는다: park-map.py가 3D 자리를 카메라로 투영해 park-coords.json을 내고, tools/blender/park-apply.mjs가 여기에 옮겨 적는다.
export const PARK = {
  title: '자연관찰대회', placeholder: false,
  images: { wide: { src: './assets/park/park-wide.webp', w: 2560, h: 1440 } },
  // 두 아이(나래·도윤)가 걷는 길: 입구 → 광장(hub) → 지점마다 path(마지막 점 = 아이들이 서는 자리). 3D 공원의 길 위 점을 투영한 것이다(연못 위를 가로지르지 않게).
  // 여러 지점이 같은 길을 쓰면 좌표를 똑같이 적는다 — 같은 점끼리 이어져 지름길을 찾는다(park.js).
  walk: { entrance: { wide: [[43, 72.7], [43.8, 62.8]] }, hub: { wide: [44.4, 54.5] } },
  // 들어오면 전체 지도 → 여기로 확대(x %, y %, 전체 대비 배율): 대회 본부 천막이 있는 광장
  start: { wide: [40.3, 58.5, 2] },
  // 공원 안의 다른 사람들 — 누가 누구인지는 park-chars3d.js NPC_CAST
  npcs: { doc: { wide: [[46.6, 58.5]] }, elder: { wide: [[41, 49.3]] }, luca: { wide: [[20.8, 46.4]] }, robin: { wide: [[81, 53.6]] }, walkers: { wide: [[9.3, 74.7], [76.8, 79.1]] }, sora: { wide: [[50.3, 86.6]] }, buddies: { wide: [[23.4, 84], [33.5, 86.2]] }, momo: { wide: [[97.2, 40.3], [101.7, 52.8]] }, ranger: { wide: [[61.2, 53.2]] }, lifeguard: { wide: [[65.9, 85.9]] } },
  spots: [
    { id: 'gate', name: '광장 · 대회 안내', short: '안내', icon: '📋', set: null, wide: [40.3, 58.5], path: { wide: [] } },
    { id: 'pond', name: '연못 · 수련', short: '연못', icon: '🪷', set: 'observe-water', wide: [48.9, 44.1], path: { wide: [[48, 53.2], [48.6, 49.5]] } },
    { id: 'meadow', name: '햇빛 드는 풀밭 · 큰 나무 그늘', short: '풀밭', icon: '🦗', set: 'observe-insects', wide: [33, 39.5], path: { wide: [[39.8, 49.4], [35.4, 44.7]] } },
    { id: 'flowers', name: '꽃밭', short: '꽃밭', icon: '🌼', set: 'observe-leaves', wide: [65.4, 42], path: { wide: [[51.4, 54.4], [58.3, 53.8], [63.4, 51.6], [67.5, 48.6], [70.1, 45.6]] } },
    { id: 'litter', name: '숲 바닥 · 낙엽 아래', short: '숲 바닥', icon: '🪱', set: 'observe-litter', wide: [56.6, 31.5], path: { wide: [[39.8, 49.4], [35.4, 44.7], [38, 37.4], [43, 33.8], [47.6, 32.9], [53.6, 32.8], [59.6, 33.9]] } },
    { id: 'leaves', name: '숲길 · 떨어진 잎', short: '떨어진 잎', icon: '🍂', set: 'observe-leafkey', wide: [47.8, 30.1], path: { wide: [[39.8, 49.4], [35.4, 44.7], [38, 37.4], [43, 33.8], [47.6, 32.9]] } },
  ],
};
