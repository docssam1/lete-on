// 같은 시각 달 관찰 모형(4-2 Ⅰ 밤하늘과 우리) — 브라우저·Node 테스트 공용, THREE 없음.
// 음력 날짜를 고르면 그날 정해진 시각(초승~보름: 해 진 뒤 저녁 7시쯤 / 하현·그믐: 해 뜨기 전 새벽 6시쯤)에 보이는 달의 이름·모양·방향을 정한다.
// 우리나라(북반구)에서 본 모습이다: 차오르는 달은 오른쪽이, 기우는 달은 왼쪽이 밝다. 날짜·방향은 대표적인 값이며 실제는 날마다·계절마다 조금씩 다르다.
// 밝게 보이는 부분은 해와 달 사이 각(이각)으로 정한다 — 밝은 비율 = (1 − cos 이각) ÷ 2.
export const DAYS = [3, 7, 15, 22, 26];
const NAME = { 3: '초승달', 7: '상현달', 15: '보름달', 22: '하현달', 26: '그믐달' };
const SIDE = { 3: '오른쪽이 가늘게 밝음', 7: '오른쪽 반이 밝음', 15: '둥글게 다 밝음', 22: '왼쪽 반이 밝음', 26: '왼쪽이 가늘게 밝음' };
export const CYCLE = 29.5;
export function moonModel(day) {
  if (!NAME[day]) throw new RangeError(`unknown day ${day}`);
  const e = (day / CYCLE) * 360, evening = e <= 185, elong = Math.min(180, evening ? e : 360 - e);   // 해에서 떨어진 각(0~180)
  const lit = Math.round((1 - Math.cos((elong * Math.PI) / 180)) / 2 * 100);           // 밝게 보이는 비율(%)
  // 하늘 위치: 저녁엔 해가 진 서쪽에서부터, 새벽엔 해가 뜰 동쪽에서부터 이각만큼 떨어져 있다(남쪽 하늘을 지나는 활).
  const fromWest = evening ? elong : 180 - elong;                                       // 0 = 서쪽 지평선, 90 = 남쪽, 180 = 동쪽 지평선
  const dir = fromWest < 55 ? '서쪽' : fromWest < 125 ? '남쪽' : '동쪽';
  return { day, name: NAME[day], time: evening ? '저녁 7시쯤' : '새벽 6시쯤', evening, elong: Math.round(elong), lit, side: SIDE[day], fromWest: Math.round(fromWest), dir, waxing: evening };
}
// pos = 서쪽 지평선에서 떨어진 정도(0 서쪽 ~ 180 동쪽) — 같은 시각(저녁)끼리 「더 동쪽」을 비교할 때 쓴다(두 팀 배틀).
export const moonRow = (day) => { const m = moonModel(day); return { day, time: m.time, name: m.name, dir: m.dir, side: m.side, lit: m.lit, pos: m.fromWest }; };
