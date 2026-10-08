// 떠오르는 태양 실험실 모형 수치(브라우저·Node 테스트 공용, THREE 없음).
// 원본 5-D 실험 교사 PDF 17~21쪽 「떠오르는 태양」: 에탄올(비중 약 0.79)에 붉은 식용유(약 0.93)를 넣으면 가라앉고,
// 물(1.0)을 조금씩 떨어뜨리면 식용유 덩어리가 떠올라 가운데쯤에서 둥근 「태양」이 된다. 너무 많이 넣으면 위까지 떠오른다.
// 물방울은 아래로 가라앉아 섞이므로 병 속은 아래가 더 무겁다(밀도 기울기). 식용유는 둘레 밀도가 자기와 같은 높이에 뜬다.
export const WATERS = [0, 10, 20, 30, 40];             // 넣은 물(mL), 에탄올 20 mL 기준
export const OIL = 0.93, ETHANOL = 0.79;
export const SHAPES = ['바닥에 납작하게 깔림', '바닥에서 떠올라 아래쪽에 뜸', '가운데쯤 둥근 공 모양으로 뜸', '위쪽까지 떠오름', '수면까지 떠올라 납작하게 퍼짐'];
export function sunModel(ml) {
  if (!WATERS.includes(ml)) throw new RangeError('unknown condition');
  const top = ETHANOL + 0.004 * ml, bottom = Math.min(1, ETHANOL + 0.02 * ml);   // 위·아래 밀도(모형)
  const f = bottom <= OIL ? 0 : top >= OIL ? 1 : (bottom - OIL) / (bottom - top);   // 0 바닥 ~ 1 수면
  const height = Math.round(f * 10), shape = SHAPES[WATERS.indexOf(ml)];
  return { f, height, shape, result: `눈금 ${height}칸 · ${shape}` };
}
