// 튀는 물방울 실험실 모형 수치(브라우저·Node 테스트 공용, THREE 없음).
// 『2009 초등학교 과학탐구토론 지도자료』 1부 예시 탐구 「물줄기의 굵기와 높이에 따라 튀는 물」의 측정값(3회 평균, 튄 잉크 방울 수)을 그대로 쓴다.
// 페트병 뚜껑 구멍 1·3·5·7 mm, 떨어뜨리는 높이 15·35 cm. 가는 물줄기는 작은 방울이 이어져 떨어져 수면과 여러 번 부딪히므로 많이 튄다.
export const HOLES = [1, 3, 5, 7];        // 뚜껑 구멍 지름(mm)
export const HEIGHTS = [15, 35];          // 떨어뜨리는 높이(cm)
export const DATA = { 15: { 1: 100.6, 3: 58.7, 5: 25.6, 7: 10.0 }, 35: { 1: 228.3, 3: 195.7, 5: 35.3, 7: 31.7 } };
export const TRIALS = 3;
// 한 조건의 세 번 측정값: 평균이 지도자료 값(소수 첫째 자리 반올림)에 가깝도록, 늘 같은 흔들림(+6% · −5% · 나머지)으로 만든다.
// 같은 조건을 다시 해도 같은 값이 나와야 두 팀 비교·기록 검사가 된다.
export function splashModel(hole, height) {
  if (!HOLES.includes(hole) || !HEIGHTS.includes(height)) throw new RangeError('unknown condition');
  const m = DATA[height][hole], sum = Math.round(m * TRIALS);
  const a = Math.round(m * 1.06), b = Math.round(m * 0.95), c = sum - a - b;
  const trials = [a, b, c], mean = Math.round((sum / TRIALS) * 10) / 10;
  return { trials, mean, source: m, result: `${trials.join(' · ')}개 → 평균 ${mean}개` };
}
// 튄 방울이 낙하점에서 얼마나 멀리 퍼지는지(장면용 0~1): 가는 줄기는 가까이 많이, 굵은 줄기는 적지만 멀리, 높을수록 더 멀리
export function spreadOf(hole, height) { return Math.min(1, (hole === 1 ? 0.45 : 0.6 + hole * 0.04) * (height === 35 ? 1.25 : 1)); }
