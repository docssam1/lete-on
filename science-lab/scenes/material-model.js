// 같은 모양 막대 네 개 모형(3-2 Ⅰ 물체와 물질) 결과표 — 브라우저·Node 테스트 공용, THREE 없음.
// 모양·크기(길이 16 cm · 굵기 1 cm 네모 막대)가 같고 물질만 다른 막대 네 개를 같은 방법으로 시험한다.
// 결과는 「이 모형의 막대」 값이다. 같은 이름의 물질이라도 종류·두께에 따라 다를 수 있다
// (플라스틱은 종류에 따라 물에 뜨기도 가라앉기도 한다 — 이 모형의 플라스틱은 투명한 아크릴이라 가라앉는다).
export const MATERIALS = ['금속', '플라스틱', '나무', '고무'];
export const NOTE = { 금속: '철', 플라스틱: '투명한 아크릴', 나무: '소나무', 고무: '천연고무' };
export const TESTS = ['비춰 보기', '눌러 보기', '구부려 보기', '물에 넣기'];
export const ASK = { '비춰 보기': '뒤에 둔 줄무늬가 비쳐 보이나요?', '눌러 보기': '같은 힘으로 누르면 얼마나 들어가나요?', '구부려 보기': '같은 힘으로 가운데를 누르면 얼마나 휘나요?', '물에 넣기': '물에 넣으면 뜨나요, 가라앉나요?' };
// 수치(0~1)는 3D 움직임의 크기, 말은 표에 적는 결과
const R = {
  '비춰 보기': { 금속: [0, '안 비쳐요'], 플라스틱: [1, '비쳐 보여요'], 나무: [0, '안 비쳐요'], 고무: [0, '안 비쳐요'] },
  '눌러 보기': { 금속: [0, '거의 안 들어가요'], 플라스틱: [0.12, '아주 조금 들어가요'], 나무: [0.3, '조금 들어가 자국이 남아요'], 고무: [1, '쑥 들어갔다가 돌아와요'] },
  '구부려 보기': { 금속: [0, '거의 안 휘어요'], 플라스틱: [0.1, '아주 조금 휘어요'], 나무: [0.16, '조금 휘어요'], 고무: [1, '많이 휘었다가 펴져요'] },
  '물에 넣기': { 금속: [0, '가라앉아요'], 플라스틱: [0, '가라앉아요'], 나무: [1, '떠요'], 고무: [0, '가라앉아요'] },
};
export function materialResult(test, m) {
  const r = R[test]?.[m]; if (!r) throw new RangeError(`unknown ${test}/${m}`);
  return { test, material: m, v: r[0], text: r[1] };
}
// 시험 한 가지의 한 줄(표) — { test, 금속, 플라스틱, 나무, 고무 }
export function materialRow(test) {
  if (!R[test]) throw new RangeError(`unknown test ${test}`);
  return { test, ...Object.fromEntries(MATERIALS.map((m) => [m, R[test][m][1]])) };
}
// 「가장 ~한 막대」(단단함 = 눌러 보기가 가장 작은 것, 잘 휘는 것 = 구부려 보기가 가장 큰 것)
export const hardest = () => MATERIALS.reduce((a, b) => (R['눌러 보기'][a][0] <= R['눌러 보기'][b][0] ? a : b));
export const bendiest = () => MATERIALS.reduce((a, b) => (R['구부려 보기'][a][0] >= R['구부려 보기'][b][0] ? a : b));
export const floaters = () => MATERIALS.filter((m) => R['물에 넣기'][m][0] > 0.5);
export const seeThrough = () => MATERIALS.filter((m) => R['비춰 보기'][m][0] > 0.5);
