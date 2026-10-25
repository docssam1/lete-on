// 자연관찰 공원 지도(그림 한 장 + 지점 표). 원장 2026-10-25: 「네모난 지도 안 돼, 거의 실사 느낌」 → GPT가 그릴 조감도(한밭수목원 사진 참고)를 쓴다.
// 그림이 오기 전까지는 3D 공원을 렌더한 임시 그림(tools/park/render.mjs)이다 — placeholder: true.
// 좌표는 그림 위의 % (왼쪽 위 = 0, 0). 그림을 바꾸면 spots의 wide/tall 좌표와 start(처음에 확대해 들어갈 곳)를 다시 잡는다.
export const PARK = {
  title: '한밭수목원 자연관찰', placeholder: true,
  images: { wide: { src: './assets/park/park-wide.jpg', w: 2560, h: 1440 }, tall: { src: './assets/park/park-tall.jpg', w: 1440, h: 2560 } },
  // 들어오면 전체 지도 → 여기로 확대(x %, y %, 전체 대비 배율)
  start: { wide: [53, 46, 1.9], tall: [52, 50, 1.7] },
  spots: [
    { id: 'gate', name: '광장 · 대회 안내', short: '안내', icon: '📋', set: null, wide: [55, 62.6], tall: [55.8, 61.4] },
    { id: 'pond', name: '연못 · 수련', short: '연못', icon: '🪷', set: 'observe-water', wide: [39.4, 32.2], tall: [36.2, 43.7] },
    { id: 'meadow', name: '햇빛 드는 풀밭 · 큰 나무 그늘', short: '풀밭', icon: '🦗', set: 'observe-insects', wide: [68.4, 53.6], tall: [72.1, 56.1] },
    { id: 'flowers', name: '꽃밭 · 장미 정원', short: '꽃밭', icon: '🌼', set: 'observe-leaves', wide: [66.8, 31.9], tall: [73.2, 43.7] },
    { id: 'leaves', name: '숲길 · 떨어진 잎', short: '떨어진 잎', icon: '🍂', set: 'observe-leafkey', wide: [51, 12.3], tall: [52, 33.6] },
    { id: 'garden', name: '텃밭 화분', short: '텃밭', icon: '🌱', set: 'observe-grow', wide: [31.1, 49.6], tall: [28, 54.2] },
    { id: 'picnic', name: '쉼터 탁자 · 남은 도시락', short: '쉼터', icon: '🥪', set: 'observe-mold', wide: [75.3, 39.6], tall: [82.6, 48.9] },
  ],
};
