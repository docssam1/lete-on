import { createPolygonMark, createPunchMark, markGeometryKey, punchVertices } from "./mark-geometry.js";

export const patternKey = (marks) => marks.map(markGeometryKey).sort().join("|");

function rotatePoint(point, turns, center = { x: .5, y: .5 }) {
  let x = point.x - center.x;
  let y = point.y - center.y;
  for (let index = 0; index < turns; index += 1) [x, y] = [-y, x];
  return { x: center.x + x, y: center.y + y };
}

function rotateMarks(marks, turns, individual = false) {
  return marks.map((mark) => {
    const vertices = mark.kind === "polygon" ? mark.points : punchVertices(mark);
    const center = individual
      ? mark.center || { x: vertices.reduce((sum, p) => sum + p.x, 0) / vertices.length, y: vertices.reduce((sum, p) => sum + p.y, 0) / vertices.length }
      : { x: .5, y: .5 };
    if (mark.shape === "circle") return createPunchMark("circle", rotatePoint(mark.center, turns, center), { radius: mark.radius });
    if (mark.kind === "polygon") return createPolygonMark(vertices.map((p) => rotatePoint(p, turns, center)));
    return { ...mark, center: rotatePoint(mark.center, turns, center), direction: rotatePoint(mark.direction, turns, { x: 0, y: 0 }) };
  });
}

export function buildPatternChoices(marks, answerIndex = 0) {
  const choices = [{ marks, correct: true }];
  const seen = new Set([patternKey(marks)]);
  // A symmetric full-sheet rotation may be identical. Compare actual geometry.
  for (const individual of [false, true]) {
    for (const turns of [1, 2, 3]) {
      let candidate;
      try { candidate = rotateMarks(marks, turns, individual); } catch { continue; }
      const key = patternKey(candidate);
      if (seen.has(key)) continue;
      seen.add(key);
      choices.push({ marks: candidate, correct: false });
      if (choices.length === 3) break;
    }
    if (choices.length === 3) break;
  }
  if (choices.length !== 3) throw new Error("Not enough distinct pattern choices.");
  [choices[0], choices[answerIndex % 3]] = [choices[answerIndex % 3], choices[0]];
  return choices.map((choice, index) => ({ ...choice, key: String.fromCharCode(97 + index) }));
}
