// 효모빵 반죽 실험실 모형 수치(브라우저·Node 테스트 공용, THREE 없음).
// 원본 5-C 실험 교사 PDF 「효모빵 만들기」: 같은 양의 밀가루·설탕·효모에 온도가 다른 물을 넣어 반죽하고(찬물 vs 따뜻한 물 약 40 ℃)
// 따뜻한 곳에 두면 따뜻한 물로 만든 반죽이 더 많이 부푼다 — 효모가 설탕을 먹고 이산화탄소 기체를 내놓기 때문.
// 뜨거운 물(70 ℃)은 원본에 없는 확장 조건: 효모는 약 60 ℃를 넘으면 죽어 기체를 만들지 못한다(일반적인 효모의 성질).
// 부피는 원본 결과의 순서(따뜻한 물 > 찬물)를 따르는 모형 값이다(실제 값은 밀가루·효모의 양과 실내 온도에 따라 다르다).
export const START = 200;                                        // 처음 반죽 부피(mL)
export const MINUTES = 40;                                       // 따뜻한 곳에 두는 시간(분)
export const WATERS = ['찬물(10 ℃)', '따뜻한 물(40 ℃)', '뜨거운 물(70 ℃)'];
export const TEMPS = [10, 40, 70];
const VOL = [240, 400, 200];
const SHAPES = ['조금 부풂 · 구멍이 적음', '두 배로 부풂 · 구멍이 많음', '그대로 · 효모가 죽어 구멍이 거의 없음'];
const smooth = (x) => { const k = Math.max(0, Math.min(1, x)); return k * k * (3 - 2 * k); };
export function breadModel(water) {
  const i = WATERS.indexOf(water); if (i < 0) throw new RangeError('unknown condition');
  const vol = VOL[i], ratio = Math.round(vol / START * 10) / 10;
  return { temp: TEMPS[i], vol, ratio, shape: SHAPES[i], result: `${vol} mL(${ratio === 1 ? '처음과 같음' : `처음의 ${ratio}배`}) · ${SHAPES[i]}` };
}
// 지난 시간(분)에 따른 반죽 부피 — 처음엔 천천히, 중간에 빠르게, 끝에서 멈춘다
export const volAt = (water, min) => { const m = breadModel(water); return START + (m.vol - START) * smooth(min / MINUTES); };
export const MAX_VOL = Math.max(...VOL);
