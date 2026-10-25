// 자연관찰 공원 지도(그림 한 장 + 지점 표). 원장 2026-10-25: 「네모난 지도 안 돼, 거의 실사 느낌」 → GPT가 그린 조감도(한밭수목원 사진 참고, 대회에 나온 아이들 포함).
// 좌표는 그림 위의 % (왼쪽 위 = 0, 0) — 점이 그 자리에 찍히고 말꼬리 표는 점 위에 뜬다. 그림을 바꾸면 spots의 wide/tall 좌표와 start(처음에 확대해 들어갈 곳)를 다시 잡는다.
// 옛 임시 그림(3D 공원 렌더)은 tools/park/render.mjs로 다시 만들 수 있다 — 그때는 placeholder: true.
export const PARK = {
  title: '한밭수목원 자연관찰', placeholder: false,
  images: { wide: { src: './assets/park/park-wide.webp', w: 2560, h: 1440 }, tall: { src: './assets/park/park-tall.webp', w: 1440, h: 2560 } },
  // 들어오면 전체 지도 → 여기로 확대(x %, y %, 전체 대비 배율): 돗자리를 편 아이들이 있는 광장
  start: { wide: [36, 62, 1.6], tall: [34, 62, 1.6] },
  spots: [
    { id: 'gate', name: '광장 · 대회 안내', short: '안내', icon: '📋', set: null, wide: [28, 74], tall: [20, 69] },
    { id: 'pond', name: '연못 · 수련', short: '연못', icon: '🪷', set: 'observe-water', wide: [52, 47], tall: [48, 43] },
    { id: 'meadow', name: '햇빛 드는 풀밭 · 큰 나무 그늘', short: '풀밭', icon: '🦗', set: 'observe-insects', wide: [15, 30], tall: [16, 25] },
    { id: 'flowers', name: '꽃밭 · 장미 정원', short: '꽃밭', icon: '🌼', set: 'observe-leaves', wide: [83, 65], tall: [78, 62] },
    { id: 'leaves', name: '숲길 · 떨어진 잎', short: '떨어진 잎', icon: '🍂', set: 'observe-leafkey', wide: [90, 17], tall: [90, 18] },
    { id: 'garden', name: '텃밭 화분', short: '텃밭', icon: '🌱', set: 'observe-grow', wide: [87, 34], tall: [91, 31] },
    { id: 'picnic', name: '쉼터 탁자 · 남은 도시락', short: '쉼터', icon: '🥪', set: 'observe-mold', wide: [9, 63], tall: [11, 58] },
  ],
};
