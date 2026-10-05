// 지진 실험실 모형 수치(브라우저·Node 테스트 공용, THREE 없음).
// 원본 4-2-2 이론 24–25쪽 「지층의 휘어짐·끊어짐 모형 실험」: 여러 장의 우드락을 겹쳐 양쪽에서 민다 → 휘어짐(습곡) → 더 세게 밀면 끊어짐(단층) + 떨림(지진).
export const FORCES = ['약하게', '세게', '아주 세게'];
export const HOUSES = ['보통 집', '내진 설계 집'];
// change: 지층의 변화 단계(1 조금 휘어짐 · 2 크게 휘어짐 · 3 끊어짐), damage: 집의 피해(0 없음 · 1 흔들렸다 제자리 · 2 기울어짐)
export function quakeModel(force, house) {
  if (!FORCES.includes(force) || !HOUSES.includes(house)) throw new RangeError('unknown condition');
  const change = FORCES.indexOf(force) + 1, broke = change === 3;
  const damage = !broke ? 0 : house === '내진 설계 집' ? 1 : 2;
  const shape = ['', '조금 휘어짐', '크게 휘어짐', '끊어지며 어긋남'][change];
  const shake = broke ? '떨림 있음(지진)' : '떨림 없음';
  const hurt = ['그대로', '흔들렸다가 제자리', '기울어짐'][damage];
  return { change, damage, shape, shake, result: `${shape} · ${shake} · 집 ${hurt}` };
}
