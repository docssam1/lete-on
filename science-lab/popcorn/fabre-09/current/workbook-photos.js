// Original experiment photographs, extracted without retouching from the supplied Unit 3.
export const experimentPhotos = {
  'single-cell': { src: './assets/experiment-photos/single-cell.jpg', alt: '전지 한 개 연결' },
  'series-cells': { src: './assets/experiment-photos/series-cells.jpg', alt: '전지 두 개 직렬 연결' },
  'parallel-cells': { src: './assets/experiment-photos/parallel-cells.jpg', alt: '전지 두 개 병렬 연결' },
  'empty-kit': { src: './assets/experiment-photos/empty-kit.jpg', alt: '전지를 뺀 스탠드 교구와 전선' },
  'stand-off': { src: './assets/experiment-photos/stand-off.jpg', alt: '완성한 2단 밝기 스탠드' },
  'stand-open': { src: './assets/experiment-photos/stand-open.jpg', alt: '앞판을 열어 본 스탠드 내부' },
  'door-lock': { src: './assets/experiment-photos/door-lock.jpg', alt: '도어록의 전지함' },
  'remote-control': { src: './assets/experiment-photos/remote-control.jpg', alt: '리모컨의 전지함' },
};
export function photo(id, caption = '', className = '') {
  const item = experimentPhotos[id];
  if (!item) throw new Error('Unknown experiment photo');
  return `<figure class="wb-photo ${className}"><button type="button" class="wb-photo-open" data-workbook-photo="${id}" aria-label="${item.alt} 사진 크게 보기"><img src="${item.src}" alt="${item.alt}" decoding="async"><span class="wb-photo-hint" aria-hidden="true">사진 크게 보기 ↗</span></button>${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
}
