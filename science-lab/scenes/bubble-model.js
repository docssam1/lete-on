// 비눗방울 실험실 모형 수치(브라우저·Node 테스트 공용, THREE 없음).
// 『2009 초등학교 과학탐구토론 지도자료』 1부 29~36쪽 「비눗방울 탐구」: 물비누 1숟가락 + 따뜻한 물 6숟가락으로 만든 비눗물에
// 글리세린 1숟가락 또는 설탕 1숟가락을 섞어 불고 터지기까지 시간을 잰다. 막의 물이 증발해 얇아지면 터지고(약 10초),
// 글리세린·설탕은 증발을 늦춘다. 「아무것도 넣지 않음 ≈ 10초」만 원본 설명이고, 설탕·글리세린 시간은 그 순서를 따르는 모형 값이다.
export const ADDS = ['아무것도 넣지 않음', '설탕 1숟가락', '글리세린 1숟가락'];
export const SHORT = ['그냥 비눗물', '설탕', '글리세린'];
export const TRIALS = 3;
const T = [[9, 11, 10], [24, 27, 24], [56, 62, 59]];   // 세 번 잰 시간(초) — 같은 조건은 늘 같은 값(대결·기록 검사용)
export function bubbleModel(add) {
  const i = ADDS.indexOf(add); if (i < 0) throw new RangeError('unknown condition');
  const trials = T[i].slice(), mean = Math.round(trials.reduce((a, b) => a + b, 0) / TRIALS * 10) / 10;
  return { trials, mean, result: `${trials.join(' · ')}초 → 평균 ${mean}초` };
}
export const MAX_LIFE = Math.max(...T.flat());
