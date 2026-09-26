// The source activity reflects one asymmetric line shape in a named mirror.
// New strokes and option orders preserve that action without copying its answers.
export const MIRROR_ROUNDS = Object.freeze([
  { mirror: "right", stroke: [[63, 82], [63, 19], [34, 45]], options: ["none", "vertical", "horizontal", "half"] },
  { mirror: "left", stroke: [[68, 16], [68, 80], [41, 56]], options: ["half", "horizontal", "none", "vertical"] },
  { mirror: "top", stroke: [[29, 78], [29, 20], [56, 46]], options: ["horizontal", "none", "vertical", "half"] },
  { mirror: "bottom", stroke: [[70, 22], [70, 84], [43, 58]], options: ["vertical", "half", "horizontal", "none"] },
  { mirror: "right", stroke: [[34, 18], [34, 79], [60, 53]], options: ["vertical", "none", "half", "horizontal"] }
].map((round) => Object.freeze(round)));

export function reflectedStroke(stroke, operation) {
  return stroke.map(([x, y]) => [operation === "horizontal" || operation === "half" ? 100 - x : x, operation === "vertical" || operation === "half" ? 100 - y : y]);
}

export function mirrorOperation(mirror) {
  return mirror === "left" || mirror === "right" ? "horizontal" : "vertical";
}

const outline = (stroke) => stroke.map(([x, y]) => `${x},${y}`).join(" ");
const strokeSvg = (stroke) => `<svg viewBox="0 0 100 100" aria-hidden="true"><polyline points="${outline(stroke)}"/></svg>`;

export function mirrorShapeScene(round, state) {
  const mirrorName = { right: "오른쪽", left: "왼쪽", top: "위쪽", bottom: "아래쪽" }[round.mirror];
  const answer = reflectedStroke(round.stroke, mirrorOperation(round.mirror));
  const target = state.solved ? strokeSvg(answer) : "?";
  return `<div class="hand-mirror-shape"><div class="hand-mirror-stage mirror-${round.mirror}"><figure><div class="hand-mirror-paper">${strokeSvg(round.stroke)}</div><figcaption>처음 모양</figcaption></figure><span class="hand-mirror-glass" aria-label="${mirrorName} 거울"></span><figure><div class="hand-mirror-paper hand-mirror-target">${target}</div><figcaption>거울에 비친 모양</figcaption></figure></div><div class="hand-mirror-options" role="group" aria-label="거울에 비친 모양 고르기">${round.options.map((operation, index) => `<button type="button" data-hand-action="mirror-choice" data-value="${index}" aria-label="${index + 1}번 모양" aria-pressed="${state.mirrorChoice === index}" ${state.solved ? "disabled" : ""}><span>${index + 1}</span>${strokeSvg(reflectedStroke(round.stroke, operation))}</button>`).join("")}</div></div>`;
}
