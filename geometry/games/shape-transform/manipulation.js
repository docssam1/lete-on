import { expectedFor, transformPoints } from "./levels.js?v=shape-transform-3";

export const neutralPose = () => ({ dx:0, dy:0, angle:0 });
export const usesManipulation = (problem, index) => index >= 3 && ["translate","rotate"].includes(problem.operation.kind);
export const normalizedAngle = angle => ((angle % 360) + 360) % 360;
export function posedPoints(problem, pose) {
  return transformPoints(problem.target, { ...pose, pivot:problem.operation.pivot || [50,50] });
}

export function setPose(problem, requested) {
  if (problem.operation.kind === "rotate") {
    return { dx:0, dy:0, angle:normalizedAngle(Math.round(requested.angle / 90) * 90) };
  }
  if (problem.operation.kind !== "translate") throw new Error("Unsupported manipulation domain");
  const bounds = axis => {
    const values = problem.target.map(point => point[axis]);
    return [Math.ceil((5 - Math.min(...values)) / 10), Math.floor((95 - Math.max(...values)) / 10)];
  };
  const snap = (value, axis) => {
    const [min,max] = bounds(axis);
    return Math.max(min, Math.min(max, Math.round(value / 10))) * 10;
  };
  return { dx:snap(requested.dx,0), dy:snap(requested.dy,1), angle:0 };
}

export function poseDiagnosis(problem, pose) {
  const actual = posedPoints(problem,pose), expected = expectedFor(problem);
  if (actual.every((point,i) => point.every((value,axis) => Math.abs(value-expected[i][axis]) < .001))) return "correct";
  const op = problem.operation;
  if (op.kind === "rotate") {
    if (!normalizedAngle(pose.angle)) return "unturned";
    if (Math.abs(op.angle) === 90 && normalizedAngle(pose.angle) === normalizedAngle(-op.angle)) return "turnDirection";
    return "turnAmount";
  }
  if (!pose.dx && !pose.dy) return "unmoved";
  if (["dx","dy"].some(key => op[key] && pose[key] && Math.sign(op[key]) !== Math.sign(pose[key]))) return "moveDirection";
  if (["dx","dy"].some(key => !op[key] && pose[key])) return "moveAxis";
  return "moveDistance";
}
