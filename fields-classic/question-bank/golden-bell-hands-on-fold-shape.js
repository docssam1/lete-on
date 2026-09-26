// Authored one-fold cut silhouettes. Each option is computed from the same cut polygon.
export const FOLD_SHAPE_ROUNDS = Object.freeze([
  { axis: "vertical", shape: "triangle", center: [.78, .31], radius: .08, options: ["horizontal", "vertical", "diagonal", "half"] },
  { axis: "horizontal", shape: "square", center: [.28, .77], radius: .07, options: ["half", "diagonal", "horizontal", "vertical"] },
  { axis: "diagonal", shape: "circle", center: [.76, .32], radius: .065, options: ["vertical", "half", "diagonal", "horizontal"] },
  { axis: "vertical", shape: "circle", center: [.69, .72], radius: .065, options: ["vertical", "half", "horizontal", "diagonal"] },
  { axis: "horizontal", shape: "triangle", center: [.73, .68], radius: .07, options: ["diagonal", "horizontal", "vertical", "half"] }
]);

export function cutPolygon(round) {
  const [x, y] = round.center, r = round.radius;
  if (round.shape === "triangle") return [[x, y - r], [x + r, y + r], [x - r, y + r]];
  if (round.shape === "square") return [[x - r, y - r], [x + r, y - r], [x + r, y + r], [x - r, y + r]];
  return Array.from({ length: 24 }, (_, i) => [x + r * Math.cos(i * Math.PI / 12), y + r * Math.sin(i * Math.PI / 12)]);
}

export function reflectCut(poly, operation) {
  return poly.map(([x, y]) => operation === "vertical" ? [1 - x, y]
    : operation === "horizontal" ? [x, 1 - y]
      : operation === "diagonal" ? [y, x] : [1 - x, 1 - y]);
}

const polygon = (points, cls = "") => `<polygon class="${cls}" points="${points.map(([x, y]) => `${(x * 200).toFixed(2)},${(y * 200).toFixed(2)}`).join(" ")}"/>`;
const foldedPaper = { vertical: [[.5, 0], [1, 0], [1, 1], [.5, 1]], horizontal: [[0, .5], [1, .5], [1, 1], [0, 1]], diagonal: [[0, 0], [1, 0], [1, 1]] };
const crease = { vertical: "M100 0V200", horizontal: "M0 100H200", diagonal: "M0 0L200 200" };

function unfoldedSvg(round, operation, reveal = false) {
  const cut = cutPolygon(round);
  return `<svg viewBox="-4 -4 208 208" aria-hidden="true"><rect class="hand-shape-paper" width="200" height="200"/>${polygon(cut, "hand-shape-hole")}${polygon(reflectCut(cut, operation), "hand-shape-hole")}${reveal ? `<path class="hand-shape-crease" d="${crease[round.axis]}"/>` : ""}</svg>`;
}

export function foldShapeScene(round, state) {
  const cut = cutPolygon(round);
  const stage = state.solved ? unfoldedSvg(round, round.axis, true)
    : `<svg viewBox="-4 -4 208 208" role="img" aria-label="${state.foldStep ? "접은 색종이와 자를 모양" : "접기 전 색종이"}"><rect class="hand-shape-outline" width="200" height="200"/>${state.foldStep ? polygon(foldedPaper[round.axis], "hand-shape-paper") : polygon([[0, 0], [1, 0], [1, 1], [0, 1]], "hand-shape-paper")}<path class="hand-shape-crease" d="${crease[round.axis]}"/>${state.foldStep ? polygon(cut, state.cut ? "hand-shape-hole" : "hand-shape-mark") : ""}</svg>`;
  const choices = round.options.map((operation, index) => `<button type="button" data-hand-action="fold-shape-choice" data-value="${index}" aria-label="펼친 모양 ${index + 1}번" aria-pressed="${state.foldShapeChoice === index}" ${!state.cut || state.solved ? "disabled" : ""}><span>${index + 1}</span>${unfoldedSvg(round, operation)}</button>`).join("");
  return `<div class="hand-fold-shape"><figure class="hand-fold-shape-stage">${stage}<figcaption>${state.solved ? "펼친 뒤" : state.cut ? "자른 뒤" : state.foldStep ? "접은 뒤" : "접기 전"}</figcaption></figure><div class="hand-controls"><button type="button" data-hand-action="fold" ${state.foldStep || state.solved ? "disabled" : ""}>색종이 접기</button><button type="button" data-hand-action="cut" ${!state.foldStep || state.cut || state.solved ? "disabled" : ""}>표시한 모양 자르기</button></div><p class="hand-diagram-label">펼친 모양</p><div class="hand-fold-shape-options" role="group" aria-label="펼친 모양 고르기">${choices}</div></div>`;
}

export function foldShapeFeedback(round, state) {
  if (!state.solved) return "접은 선을 기준으로 잘린 자리가 같은 거리의 반대쪽에도 나타나는지 살펴보세요.";
  return `맞았어요. 접은 선을 따라 펼치면 자른 ${round.shape === "circle" ? "동그라미" : round.shape === "square" ? "네모" : "세모"}가 반대쪽에도 나타납니다.`;
}
