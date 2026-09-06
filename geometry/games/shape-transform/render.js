const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
export const pathData = (points, closed) => points.map(([x,y], index) => `${index ? "L" : "M"}${x} ${y}`).join(" ") + (closed ? " Z" : "");

export function shapeMarkup(points, closed, className = "shape-line") {
  return `<path class="${className} ${closed ? "filled" : ""}" d="${pathData(points, closed)}"/>`;
}

export function referenceMarkup(problem, points) {
  if (problem.operation.kind === "same-bends") return "";
  const point = points[problem.operation.kind === "rotate" ? 1 : 0];
  return `<circle class="reference-point" cx="${point[0]}" cy="${point[1]}" r="2.1"/>`;
}

export function boardSvg(problem, points, { label = "", ghost = null, mark = true, guide = false, review = false, differences = [] } = {}) {
  const pivot = problem.operation.pivot || [50,50];
  const kind = problem.operation.kind;
  const tracked = kind === "rotate" ? points[1] : points[0];
  let lines = "";
  for (let pos = 10; pos <= 90; pos += 10) lines += `M${pos} 5V95 M5 ${pos}H95 `;
  const hasPivot = ["rotate","enlarge","reduce"].includes(kind);
  const pivotMark = hasPivot
    ? `<g class="pivot"><circle cx="${pivot[0]}" cy="${pivot[1]}" r="2.4"/><path d="M${pivot[0]-4} ${pivot[1]}h8 M${pivot[0]} ${pivot[1]-4}v8"/></g>` : "";
  const pivotLabel = hasPivot ? `<text class="pivot-label" x="${pivot[0]+5}" y="${pivot[1]+8}">O</text>` : "";
  const marker = mark ? referenceMarkup(problem, points) : "";
  const help = guide && kind === "translate" ? `<path class="motion-guide" d="M${points[0].join(" ")}h${problem.operation.dx || 0}v${problem.operation.dy || 0}"/>` : "";
  const radius = guide && kind === "rotate" ? `<path class="motion-guide" d="M${pivot.join(" ")}L${tracked.join(" ")}"/>` : "";
  const cornerDots = guide && kind === "same-bends" ? points.map(([x,y]) => `<circle class="corner-guide" cx="${x}" cy="${y}" r="2"/>`).join("") : "";
  const edge = guide && ["enlarge","reduce"].includes(kind) ? `<path class="motion-guide" d="M${points[0].join(" ")}L${points[1].join(" ")}L${points[2].join(" ")}"/>` : "";
  const difference = differences.map(([x,y]) => `<circle class="difference-ring" cx="${x}" cy="${y}" r="4.5"/>`).join("");
  return `<svg class="shape-svg ${problem.closed ? "plane-shape" : ""}" viewBox="0 0 100 100" role="img" aria-label="${escape(label)}">
    <path class="grid" d="${lines}"/>${ghost ? shapeMarkup(ghost, problem.closed, "ghost-shape") : ""}
    <g ${review ? 'id="movingShape"' : ""}>${shapeMarkup(points, problem.closed)}${marker}</g>
    ${pivotMark}${help}${radius}${cornerDots}${edge}${difference}${pivotLabel}</svg>`;
}
