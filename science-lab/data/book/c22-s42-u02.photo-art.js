// 2026-10-28 승인한 실사 스타일. 문항 자료·모형 표와 별도로 관리한다.
const root = '../assets/book/ecology-20261028/';
const photo = (file, alt, caption) => `<figure class="ed-photo" data-ecology-photo="${file}"><img src="${root}${file}.jpg" alt="${alt}" width="1536" height="1024" loading="eager" style="width:100%;height:auto;max-height:94mm;object-fit:contain"><figcaption>${caption}</figcaption></figure>`;
export const photoArt = {
  ecoHabitat: photo('habitat', '나무와 풀이 자라고 물과 흙이 함께 보이는 연못가', '연못가의 나무·풀·물·흙을 함께 살펴보아요.'),
  ecoAnimals: photo('meadow', '풀을 먹는 토끼와 뒤쪽 풀밭에 서 있는 여우', '풀밭의 풀·토끼·여우 · 수 변화는 모형 표로 비교해요.'),
  ecoWaste: photo('water-waste', '물 표면에 떠 있는 플라스틱병과 비닐봉지, 일회용 컵', '물 위에 보이는 쓰레기와 주변 환경을 살펴보아요.'),
  ecoRice: photo('rice', '긴 잎과 알곡이 달린 가지가 늘어진 벼 이삭', '벼의 잎과 알곡이 달린 이삭을 살펴보아요.'),
};
