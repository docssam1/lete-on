// 물의 여행 실험실 모형 수치(브라우저·Node 테스트 공용, THREE 없음).
// 원본 6-B 실험 교사 PDF 「컵 속에 내리는 비」(따뜻한 물 + 차가운 뚜껑 → 김 서림 · 이슬 · 비)를 뚜껑 덮은 수조 속 「작은 지구」로 옮겼다.
// 염화암모늄 대신 얼음으로 뚜껑을 차갑게 한다. 전등 = 햇빛(증발을 돕는 열), 뚜껑 얼음 = 하늘 높은 곳의 찬 공기(응결을 돕는 냉기).
export const SUNS = ['약하게', '세게'];
export const LIDS = ['얼음 없음', '얼음 있음'];
export const RAIN = ['뚜껑에 작은 물방울만 맺힘', '물방울이 모여 비가 조금 내림', '물방울이 커져 비가 많이 내림'];
// stage: 0 비 없음 · 1 조금 · 2 많이 — 증발(열)과 응결(냉기) 둘 다 도우면 비가 가장 많다
export function cycleModel(sun, lid) {
  if (!SUNS.includes(sun) || !LIDS.includes(lid)) throw new RangeError('unknown condition');
  const stage = (sun === '세게' ? 1 : 0) + (lid === '얼음 있음' ? 1 : 0);
  const evap = sun === '세게' ? '많이' : '조금';
  return { stage, evap, result: `증발 ${evap} · ${RAIN[stage]}` };
}
