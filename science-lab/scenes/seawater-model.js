// 바닷물과 수돗물 증발 접시 모형(3-2 Ⅱ 지구와 바다) 수치 — 브라우저·Node 테스트 공용, THREE 없음.
// 같은 양의 바닷물과 수돗물을 증발 접시에 담아 전열기로 가열해 물을 모두 날려 보내고 남는 것을 비교한다.
// 남는 양은 모형 값이다: 바닷물에는 소금 같은 물질이 약 3.5 %(1 L에 약 35 g) 녹아 있다고 보고 계산했다(실제 바닷물은 장소에 따라 조금씩 다르다).
// 수돗물에 녹아 있는 물질은 아주 적어(1 L에 0.1~0.3 g 정도) 20 mL를 날려도 눈에 띄는 알갱이가 남지 않는다.
export const WATERS = ['바닷물', '수돗물'];
export const AMOUNTS = [10, 20, 40];
const PER_ML = { 바닷물: 0.035, 수돗물: 0 };
export function evapModel(water, ml) {
  if (!WATERS.includes(water) || !AMOUNTS.includes(ml)) throw new RangeError(`unknown ${water}/${ml}`);
  const g = Math.round(PER_ML[water] * ml * 100) / 100;
  return { water, ml, g, look: g > 0 ? `흰 알갱이 약 ${g} g` : '거의 남지 않음' };
}
// 한 번 가열하면 두 접시를 함께 본다 — 표 한 줄
export function evapRow(ml) {
  const s = evapModel('바닷물', ml), t = evapModel('수돗물', ml);
  return { ml, 바닷물: s.look, 수돗물: t.look, seaG: s.g, tapG: t.g };
}
