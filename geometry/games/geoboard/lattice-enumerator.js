/* =========================================================================
   Exact dot-board enumeration for the Geoboard Studio.

   A "kind" ignores position, rotation, and reflection. For triangles this is
   the sorted triple of squared side lengths; for squares and equilateral
   triangles it is the squared side length. A "placement" is one actual set of
   pegs on the current board. Keeping these two counts separate prevents an
   item from asking for kinds while grading the number of positions.
   ========================================================================= */

function combinations(items, count, visit, start = 0, chosen = []) {
  if (chosen.length === count) {
    visit(chosen);
    return;
  }
  const remaining = count - chosen.length;
  for (let index = start; index <= items.length - remaining; index += 1) {
    combinations(items, count, visit, index + 1, [...chosen, items[index]]);
  }
}

export function squareBoardPoints(size) {
  const points = [];
  for (let x = 0; x < size; x += 1) {
    for (let y = 0; y < size; y += 1) points.push([x, y]);
  }
  return points;
}

// Axial coordinates on a 60-degree lattice. The visible board is a triangular
// patch with `size` pegs on each outer side.
export function triangularBoardPoints(size) {
  const points = [];
  for (let a = 0; a < size; a += 1) {
    for (let b = 0; b < size - a; b += 1) points.push([a, b]);
  }
  return points;
}

export function squareDistanceSquared(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return dx * dx + dy * dy;
}

// Squared Euclidean length in an axial basis whose unit vectors meet at 60
// degrees. This stays integer, so equality checks never depend on floating point.
export function triangularDistanceSquared(a, b) {
  const da = a[0] - b[0];
  const db = a[1] - b[1];
  return da * da + da * db + db * db;
}

function distances(vertices, metric) {
  const result = [];
  for (let first = 0; first < vertices.length; first += 1) {
    for (let second = first + 1; second < vertices.length; second += 1) {
      result.push(metric(vertices[first], vertices[second]));
    }
  }
  return result.sort((a, b) => a - b);
}

function polygonAreaTwice(vertices) {
  const [a, b, c] = vertices;
  return Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]));
}

export function enumerateTriangles(points, metric = squareDistanceSquared) {
  const found = [];
  combinations(points, 3, (vertices) => {
    // This collinearity test is for square/Cartesian board coordinates. General
    // triangles are only authored on square boards; triangular boards use the
    // exact equilateral test below.
    if (polygonAreaTwice(vertices) === 0) return;
    const sideSquared = distances(vertices, metric);
    found.push({ vertices, sideSquared, typeKey: `triangle:${sideSquared.join("-")}` });
  });
  return found;
}

export function enumerateSquares(points, metric = squareDistanceSquared) {
  const found = [];
  combinations(points, 4, (vertices) => {
    const d = distances(vertices, metric);
    // A non-degenerate square has four equal sides and two equal diagonals,
    // with diagonal squared exactly twice side squared.
    if (d[0] === 0 || d[0] !== d[3] || d[4] !== d[5] || d[4] !== 2 * d[0]) return;
    found.push({ vertices, sideSquared: d[0], typeKey: `square:${d[0]}` });
  });
  return found;
}

export function enumerateEquilateralTriangles(points, metric) {
  const found = [];
  combinations(points, 3, (vertices) => {
    const d = distances(vertices, metric);
    if (d[0] === 0 || d[0] !== d[1] || d[1] !== d[2]) return;
    found.push({ vertices, sideSquared: d[0], typeKey: `equilateral:${d[0]}` });
  });
  return found;
}

export function summarizePlacements(placements) {
  const typeKeys = [...new Set(placements.map((placement) => placement.typeKey))].sort();
  return { placementCount: placements.length, typeCount: typeKeys.length, typeKeys };
}

export function squareBoardSummary(size) {
  const points = squareBoardPoints(size);
  return {
    size,
    triangles: summarizePlacements(enumerateTriangles(points)),
    squares: summarizePlacements(enumerateSquares(points)),
    equilateralTriangles: summarizePlacements(enumerateEquilateralTriangles(points, squareDistanceSquared))
  };
}

export function triangularBoardSummary(size) {
  const points = triangularBoardPoints(size);
  return {
    size,
    equilateralTriangles: summarizePlacements(enumerateEquilateralTriangles(points, triangularDistanceSquared))
  };
}

// Independent, reviewer-readable expected values used by the deterministic test.
// These boards are large enough to show growth without producing an unreadable
// mobile activity. Level authoring may use a subset, but must never change answers.
export const DOT_BOARD_REFERENCE = Object.freeze({
  square: Object.freeze([
    Object.freeze({ size: 3, trianglePlacements: 76, triangleTypes: 8, squarePlacements: 6, squareTypes: 3 }),
    Object.freeze({ size: 4, trianglePlacements: 516, triangleTypes: 29, squarePlacements: 20, squareTypes: 5 }),
    Object.freeze({ size: 5, trianglePlacements: 2148, triangleTypes: 79, squarePlacements: 50, squareTypes: 8 })
  ]),
  triangular: Object.freeze([
    Object.freeze({ size: 3, equilateralPlacements: 5, equilateralTypes: 2 }),
    Object.freeze({ size: 4, equilateralPlacements: 15, equilateralTypes: 4 }),
    Object.freeze({ size: 5, equilateralPlacements: 35, equilateralTypes: 6 })
  ])
});
