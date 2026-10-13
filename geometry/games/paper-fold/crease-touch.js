/* 레벨 3 · 접는 방법 거꾸로 찾기의 "접는 선 고르기" 터치 판정 (D3).
   app.js가 이 규칙으로 누른 선을 정하고, 검사(reverse-fold.browsercheck.mjs)도
   같은 규칙을 화면에서 확인한다. */

/* 접는 선 고르기의 터치 판정(D3). 띠 모양 SVG에 맡기면 두 선이 엇갈리는 곳
   근처에서 손가락이 옆 선으로 잡힐 수 있었다. 그래서 누른 점에서 각 선(현)까지의
   거리를 화면 px로 재고 다음 규칙으로 고른다.
   - 가장 가까운 선이 radiusPx보다 멀면 아무 선도 고르지 않는다(miss).
   - 가장 가까운 두 선의 거리 차이가 tiePx보다 작으면 고르지 않는다(tie).
     교차점 근처는 어느 선인지 정할 수 없으므로 점수도 매기지 않는다.
   - 그 밖에는 가장 가까운 선을 고른다(line).
   radiusPx 24는 손가락 폭(지름 약 48px)의 절반이다. */
export const CREASE_TOUCH = Object.freeze({ radiusPx: 24, tiePx: 8 });

export function segmentDistance(point, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length2 = dx * dx + dy * dy;
  const ratio = length2 ? Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / length2)) : 0;
  return Math.hypot(point.x - (a.x + dx * ratio), point.y - (a.y + dy * ratio));
}

/* point와 choices[].chord는 그림 단위(종이 좌표), pxPerUnit은 화면 px / 그림 단위. */
export function pickCrease(point, choices, pxPerUnit, rule = CREASE_TOUCH) {
  const ranked = choices
    .map((choice) => ({ key: choice.key, px: segmentDistance(point, choice.chord[0], choice.chord[1]) * pxPerUnit }))
    .sort((left, right) => left.px - right.px);
  const [first, second] = ranked;
  if (!first || first.px > rule.radiusPx) return { kind: "miss" };
  if (second && second.px <= rule.radiusPx && second.px - first.px < rule.tiePx) return { kind: "tie", keys: [first.key, second.key] };
  return { kind: "line", key: first.key, px: first.px };
}
