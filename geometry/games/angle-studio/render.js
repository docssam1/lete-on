import { renderEstimate, renderRightAngle } from "./basic-render.js?v=angle-1";
import { renderPolygon } from "./polygon.js?v=angle-1";
import { renderParallel } from "./parallel.js?v=angle-1";

export function renderProblem(p, options = {}) {
  if (p.domain === "estimate") return renderEstimate(p, options);
  if (p.domain === "right-angle") return renderRightAngle(p, options);
  if (p.domain === "polygon") return renderPolygon(p, options);
  return renderParallel(p, options);
}
