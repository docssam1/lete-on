const GRID = Array.from({ length: 9 }, (_, index) => (index + 1) * 10);
const cache = new WeakMap();

// Find the closest strictly increasing grid mapping. No corners may collapse;
// the ordering of every horizontal/vertical line and the fixed pivot survives.
function projectAxis(points, axis, operation) {
  const fixed = operation.pivot?.[axis];
  const values = [...new Set([...points.map((point) => point[axis]), ...(fixed === undefined ? [] : [fixed])])].sort((a, b) => a - b);
  const shift = axis === 0 ? operation.dx || 0 : operation.dy || 0;
  const candidates = GRID.filter((value) => {
    if (operation.kind === "enlarge") return value >= 30 && value <= 70;
    if (operation.kind === "reduce") return (value - fixed) % 20 === 0;
    return value + shift >= 10 && value + shift <= 90;
  });
  let best = null;
  let cost = Infinity;
  function visit(index, from, mapped, score) {
    if (index === values.length) {
      if (score < cost) { cost = score; best = [...mapped]; }
      return;
    }
    for (let next = from; next <= candidates.length - (values.length - index); next += 1) {
      if (values[index] === fixed && candidates[next] !== fixed) continue;
      const nextScore = score + (values[index] - candidates[next]) ** 2;
      if (nextScore >= cost) continue;
      visit(index + 1, next + 1, [...mapped, candidates[next]], nextScore);
    }
  }
  visit(0, 0, [], 0);
  if (!best) throw new Error("No whole-grid drawing representation is available.");
  return values.map((value, index) => [value, best[index]]);
}

function drawingAnswer(target, operation) {
  const { kind, pivot = [50, 50], dx = 0, dy = 0 } = operation;
  return target.map(([x, y]) => {
    if (kind === "same-bends") return [x, y];
    if (kind === "translate") return [x + dx, y + dy];
    const u = x - pivot[0], v = y - pivot[1];
    if (kind === "rotate") {
      if (operation.angle === 90) return [pivot[0] - v, pivot[1] + u];
      if (operation.angle === -90) return [pivot[0] + v, pivot[1] - u];
      if (operation.angle === 180) return [pivot[0] - u, pivot[1] - v];
      throw new Error("Unsupported drawing rotation.");
    }
    if (kind === "enlarge") return [pivot[0] + 2 * u, pivot[1] + 2 * v];
    if (kind === "reduce") return [pivot[0] + u / 2, pivot[1] + v / 2];
    throw new Error("Unsupported drawing operation.");
  });
}

export function deriveDrawing(problem) {
  if (cache.has(problem)) return cache.get(problem);
  if (!problem.sourceRef?.startsWith("owner-designed-")) throw new Error("Drawing derivation needs an owner-designed source.");
  const xMap = projectAxis(problem.target, 0, problem.operation);
  const yMap = projectAxis(problem.target, 1, problem.operation);
  const xs = new Map(xMap), ys = new Map(yMap);
  const target = problem.target.map(([x, y]) => [xs.get(x), ys.get(y)]);
  const drawing = {
    id: problem.id,
    level: problem.level,
    closed: problem.closed,
    operation: { ...problem.operation, ...(problem.operation.pivot ? { pivot: [...problem.operation.pivot] } : {}) },
    target,
    answer: drawingAnswer(target, problem.operation),
    derivation: {
      kind: "ordered-whole-grid-v1",
      sourceProblemId: problem.id,
      sourceRef: problem.sourceRef,
      sourceTarget: problem.target.map((point) => [...point]),
      gridStep: 10,
      xMap,
      yMap
    }
  };
  validateDrawing(problem, drawing);
  cache.set(problem, drawing);
  return drawing;
}

export function validateDrawing(source, drawing) {
  const fail = (condition, message) => { if (!condition) throw new Error(`${source.id}: ${message}`); };
  fail(drawing.id === source.id && drawing.closed === source.closed, "Drawing identity changed");
  fail(drawing.derivation.sourceProblemId === source.id && drawing.derivation.sourceRef === source.sourceRef && drawing.derivation.gridStep === 10, "Drawing provenance changed");
  fail(JSON.stringify(drawing.operation) === JSON.stringify(source.operation), "Drawing operation changed");
  fail(drawing.target.length === source.target.length && drawing.answer.length === source.target.length, "Drawing corner count changed");
  fail(JSON.stringify(drawing.derivation.sourceTarget) === JSON.stringify(source.target), "Drawing source snapshot changed");
  for (const [axis, mapping] of [drawing.derivation.xMap, drawing.derivation.yMap].entries()) {
    fail(mapping.every(([value, mapped], index) => index === 0 || value > mapping[index - 1][0] && mapped > mapping[index - 1][1]), "Grid mapping is not strictly ordered");
    source.target.forEach((point, index) => fail(new Map(mapping).get(point[axis]) === drawing.target[index][axis], "Derived coordinates do not match their recorded map"));
    const fixed = source.operation.pivot?.[axis];
    if (fixed !== undefined) fail(new Map(mapping).get(fixed) === fixed, "Pivot moved during derivation");
  }
  for (const points of [drawing.target, drawing.answer]) {
    fail(points.every((point) => point.every((value) => Number.isInteger(value) && value >= 10 && value <= 90 && value % 10 === 0)), "Drawing requires a fractional grid step");
    const edges = points.slice(0, drawing.closed ? points.length : -1).map((point, i) => [point, points[(i + 1) % points.length]]);
    fail(edges.every(([a, b]) => (a[0] === b[0]) !== (a[1] === b[1])), "A drawing edge collapsed or became diagonal");
    for (let i = 0; i < edges.length; i += 1) {
      for (let j = i + 2; j < edges.length; j += 1) {
        if (drawing.closed && i === 0 && j === edges.length - 1) continue;
        const [a, b] = edges[i], [c, d] = edges[j];
        fail(![0, 1].every((axis) => Math.max(Math.min(a[axis], b[axis]), Math.min(c[axis], d[axis])) <= Math.min(Math.max(a[axis], b[axis]), Math.max(c[axis], d[axis]))), "Drawing edges intersect");
      }
    }
  }
  // Independent matrix calculation, separate from the exact quarter-turn rules.
  const { scale = 1, angle = 0, dx = 0, dy = 0, pivot = [50, 50] } = source.operation;
  const theta = angle * Math.PI / 180;
  drawing.target.forEach(([x, y], index) => {
    const u = (x - pivot[0]) * scale, v = (y - pivot[1]) * scale;
    const expected = [pivot[0] + u * Math.cos(theta) - v * Math.sin(theta) + dx, pivot[1] + u * Math.sin(theta) + v * Math.cos(theta) + dy];
    fail(expected.every((value, axis) => Math.abs(value - drawing.answer[index][axis]) < .000001), "Independent drawing answer disagrees");
  });
  return true;
}
