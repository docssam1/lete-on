// 온도와 열 실험실 모형 수치(브라우저·Node 테스트 공용, THREE 없음).
// 원본 4-D 실험 교사 PDF 1~5쪽 「눈에 보이는 열」: 구리 테이프·알루미늄 테이프·OHP 필름 띠에 시온 스티커(40 ℃ 아래 파랑 · 40~60 ℃ 주황 · 60 ℃ 이상 노랑)를
// 붙여 뜨거운 물에 함께 담그면 구리 → 알루미늄 순으로 색이 올라가고 OHP 필름은 물에 잠긴 부분만 변한다. 칸 수는 그 결과 순서를 따르는 모형 값이다.
export const MATERIALS = ['구리 테이프', '알루미늄 테이프', 'OHP 필름'];
export const WATERS = ['미지근한 물', '뜨거운 물'];
export const CELLS = 6;                       // 물 위로 나온 스티커 칸 수
// 2분 담근 뒤 물 위 칸 중 색이 변한 칸(40 ℃ 이상)과 그중 노랑(60 ℃ 이상) 칸
const CHANGED = { '뜨거운 물': { '구리 테이프': 5, '알루미늄 테이프': 3, 'OHP 필름': 0 }, '미지근한 물': { '구리 테이프': 2, '알루미늄 테이프': 1, 'OHP 필름': 0 } };
const YELLOW = { '뜨거운 물': { '구리 테이프': 3, '알루미늄 테이프': 1, 'OHP 필름': 0 }, '미지근한 물': { '구리 테이프': 0, '알루미늄 테이프': 0, 'OHP 필름': 0 } };
export function heatModel(material, water) {
  if (!MATERIALS.includes(material) || !WATERS.includes(water)) throw new RangeError('unknown condition');
  const changed = CHANGED[water][material], yellow = YELLOW[water][material];
  const result = changed ? `물 위 ${changed}칸 색이 변함${yellow ? `(노랑 ${yellow}칸)` : ''}` : '물에 잠긴 곳만 색이 변함';
  return { changed, yellow, result };
}
// 칸 i(0 = 물 바로 위)의 색: 0 파랑 · 1 주황 · 2 노랑. p = 담근 뒤 진행(0~1). 아래 칸부터 차례로 바뀐다.
export function cellColor(material, water, i, p = 1) {
  const { changed, yellow } = heatModel(material, water);
  const py = Math.max(0, (p - 0.3) / 0.7);          // 노랑은 주황보다 늦게 올라온다
  if (i < yellow && i < py * yellow + 0.001 * py) return 2;
  if (i < changed && i < p * changed) return 1;
  return 0;
}
// 물에 잠긴 칸의 색(뜨거운 물 노랑 · 미지근한 물 주황)
export const wetColor = (water) => (water === '뜨거운 물' ? 2 : 1);
