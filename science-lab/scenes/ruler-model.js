// 책상 끝 자 튕기기 모형(3-2 Ⅲ 소리의 성질) — 브라우저·Node 테스트 공용, THREE 없음.
// 같은 플라스틱 자를 책상 밖으로 내민 길이(5·10·15 cm)와 튕기는 세기(약하게·세게)만 바꾼다.
// 높낮이: 내민 길이가 짧을수록 빨리 떨려 높은 소리, 길수록 낮은 소리. 세기: 세게 튕길수록 크게 떨려 큰 소리.
// 들려주는 소리(hz)는 높낮이 차이를 귀로 느끼게 만든 「모형 소리」다 — 실제 자가 내는 소리의 진동수와 같지 않다.
export const LENGTHS = [5, 10, 15];
export const STRENGTHS = ['약하게', '세게'];
const PITCH = { 5: ['높은 소리', 3, 440, 7], 10: ['중간 소리', 2, 262, 4.5], 15: ['낮은 소리', 1, 165, 2.8] };   // [말, 높낮이 순위, 모형 소리 Hz, 화면 떨림 빠르기(번/초)]
export function rulerModel(len, strength) {
  if (!PITCH[len] || !STRENGTHS.includes(strength)) throw new RangeError(`unknown ${len}/${strength}`);
  const [pitch, rank, hz, speed] = PITCH[len], strong = strength === '세게';
  return { len, strength, pitch, rank, hz, speed, loud: strong ? '큰 소리' : '작은 소리', swing: strong ? '크게 떨림' : '작게 떨림', amp: strong ? 1 : 0.35 };
}
export const rulerRow = (len, strength) => { const m = rulerModel(len, strength); return { len, strength, pitch: m.pitch, loud: m.loud, swing: m.swing, rank: m.rank, amp: m.amp }; };
