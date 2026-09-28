/* 장면 움직임 공용 함수 — 한 바퀴 안 위치 p(0~1)로 움직임을 짠다. */
export const ease = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
export const seg = (p, a, b) => ease((p - a) / (b - a));          /* p 가 a→b 를 지나는 동안 0→1 */
export const cyc = (t, P) => (t % P) / P;                          /* 한 바퀴 P 초 안의 위치 0~1 */
export const hop = (p, a, b) => Math.sin(Math.PI * Math.min(1, Math.max(0, (p - a) / (b - a))));  /* a~b 동안 한 번 뛰었다 내려옴 */
