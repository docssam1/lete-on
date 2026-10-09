// 병 속에 내리는 눈 실험실 모형 수치(브라우저·Node 테스트 공용, THREE 없음).
// 원본 5-A 실험 교사 PDF 18~21쪽 「흰 눈이 펄펄」: 뜨거운 물 약 10 mL에 염화암모늄을 더 녹지 않을 때까지 녹여(포화 용액)
// 유리병에 넣고 식히면 흰 결정이 눈처럼 내린다. 다시 뜨거운 물에 넣으면 결정이 녹아 투명해진다(재결정).
// 녹는 양은 원본에 실린 염화암모늄의 용해도(물 100 g에 0 ℃ 약 30 g · 20 ℃ 약 37 g · 60 ℃ 55.2 g · 100 ℃ 약 78 g)를 그대로 쓴다.
export const SOL = { 0: 30, 20: 37, 60: 55.2, 100: 78 };   // 물 100 g에 녹는 최대 양(g)
export const WATER = 10;                                  // 물 10 g(약 10 mL)
export const MAKE_T = 60;                                 // 포화 용액을 만든 온도(녹이며 흡열로 식은 뒤)
export const COOLS = ['그대로 두기(60 ℃)', '실온에서 식히기(20 ℃)', '얼음물에 식히기(0 ℃)'];
export const TEMPS = [60, 20, 0];
const SHAPES = ['맑고 투명한 그대로', '흰 눈이 내려 바닥에 쌓임', '눈이 많이 내려 두껍게 쌓임'];
const r1 = (x) => Math.round(x * 10) / 10;
export const dissolvedAt = (T) => r1(SOL[T] * WATER / 100);
export function snowModel(cool) {
  const i = COOLS.indexOf(cool); if (i < 0) throw new RangeError('unknown condition');
  const T = TEMPS[i], snow = r1(dissolvedAt(MAKE_T) - dissolvedAt(T));
  return { temp: T, snow, shape: SHAPES[i], result: `결정 약 ${snow} g · ${SHAPES[i]}` };
}
export const MAX_SNOW = snowModel(COOLS[2]).snow;
