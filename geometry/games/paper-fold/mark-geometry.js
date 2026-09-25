// Coordinates are normalized to the unit paper. Parity records whether the
// current orientation differs from the authored mark by an odd reflection.
const EPSILON = 1e-9;
const ROUND_SCALE = 1e12;
const KEY_DIGITS = 9;

export const REFLECTION_AXES = Object.freeze([
  "vertical",
  "horizontal",
  "diag-main",
  "diag-anti"
]);

export const PUNCH_SHAPES = Object.freeze(["circle", "triangle", "square"]);

export const ORIENTATION_PARITY = Object.freeze({
  PRESERVED: "preserved",
  MIRRORED: "mirrored"
});

const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);

function rounded(value) {
  const result = Math.round(value * ROUND_SCALE) / ROUND_SCALE;
  return Object.is(result, -0) ? 0 : result;
}

function frozenPoint(x, y, label = "point") {
  if (!isFiniteNumber(x) || !isFiniteNumber(y)) {
    throw new TypeError(`${label} must contain finite x and y values.`);
  }
  return Object.freeze({ x: rounded(x), y: rounded(y) });
}

function normalizedParity(parity) {
  if (parity !== ORIENTATION_PARITY.PRESERVED && parity !== ORIENTATION_PARITY.MIRRORED) {
    throw new TypeError(`Unknown orientation parity: ${String(parity)}`);
  }
  return parity;
}

function toggledParity(parity) {
  return parity === ORIENTATION_PARITY.PRESERVED
    ? ORIENTATION_PARITY.MIRRORED
    : ORIENTATION_PARITY.PRESERVED;
}

function assertAxis(axis) {
  if (!REFLECTION_AXES.includes(axis)) {
    throw new TypeError(`Unknown reflection axis: ${String(axis)}`);
  }
  return axis;
}

function axisFromFold(fold, index) {
  const axis = typeof fold === "string" ? fold : fold?.axis;
  try {
    return assertAxis(axis);
  } catch (error) {
    throw new TypeError(`Invalid fold at index ${index}: ${error.message}`);
  }
}

function pointsEqual(a, b) {
  return Math.abs(a.x - b.x) <= EPSILON && Math.abs(a.y - b.y) <= EPSILON;
}

function normalizedPolygonPoints(points) {
  if (!Array.isArray(points)) throw new TypeError("Polygon points must be an array.");

  const normalized = [];
  points.forEach((item, index) => {
    const next = frozenPoint(item?.x, item?.y, `polygon point ${index}`);
    if (!normalized.length || !pointsEqual(normalized.at(-1), next)) normalized.push(next);
  });
  if (normalized.length > 1 && pointsEqual(normalized[0], normalized.at(-1))) normalized.pop();
  if (normalized.length < 3) throw new RangeError("A polygon mark needs at least three distinct points.");
  if (Math.abs(polygonSignedArea(normalized)) <= EPSILON) {
    throw new RangeError("A polygon mark must have non-zero area.");
  }
  return Object.freeze(normalized);
}

function normalizedDirection(direction) {
  const x = direction?.x;
  const y = direction?.y;
  if (!isFiniteNumber(x) || !isFiniteNumber(y)) {
    throw new TypeError("Punch direction must contain finite x and y values.");
  }
  const length = Math.hypot(x, y);
  if (length <= EPSILON) throw new RangeError("Punch direction must be non-zero.");
  return frozenPoint(x / length, y / length, "punch direction");
}

function makePunchMark(shape, center, radius, direction, parity) {
  if (!PUNCH_SHAPES.includes(shape)) throw new TypeError(`Unknown punch shape: ${String(shape)}`);
  if (!isFiniteNumber(radius) || radius <= 0) throw new RangeError("Punch radius must be positive.");

  const mark = Object.freeze({
    kind: "punch",
    shape,
    center: frozenPoint(center?.x, center?.y, "punch center"),
    radius: rounded(radius),
    direction: normalizedDirection(direction),
    parity: normalizedParity(parity)
  });
  validateMark(mark);
  return mark;
}

function assertPunchStructure(mark) {
  if (mark?.kind !== "punch") throw new TypeError("Expected a punch mark.");
  if (!PUNCH_SHAPES.includes(mark.shape)) throw new TypeError(`Unknown punch shape: ${String(mark.shape)}`);
  frozenPoint(mark.center?.x, mark.center?.y, "punch center");
  if (!isFiniteNumber(mark.radius) || mark.radius <= 0) throw new RangeError("Punch radius must be positive.");
  normalizedDirection(mark.direction);
  normalizedParity(mark.parity);
}

export function createPolygonMark(points, options = {}) {
  const mark = Object.freeze({
    kind: "polygon",
    points: normalizedPolygonPoints(points),
    parity: normalizedParity(options.parity ?? ORIENTATION_PARITY.PRESERVED)
  });
  validateMark(mark);
  return mark;
}

export function createPunchMark(shape, center, options = {}) {
  const angle = options.angle ?? 0;
  if (!isFiniteNumber(angle)) throw new TypeError("Punch angle must be finite.");
  return makePunchMark(
    shape,
    center,
    options.radius ?? 0.04,
    { x: Math.cos(angle), y: Math.sin(angle) },
    options.parity ?? ORIENTATION_PARITY.PRESERVED
  );
}

export function polygonSignedArea(points) {
  if (!Array.isArray(points) || points.length < 3) return 0;
  let twiceArea = 0;
  points.forEach((point, index) => {
    const next = points[(index + 1) % points.length];
    twiceArea += point.x * next.y - next.x * point.y;
  });
  return twiceArea / 2;
}

export function reflectPoint(source, axis) {
  assertAxis(axis);
  const point = frozenPoint(source?.x, source?.y);
  if (axis === "vertical") return frozenPoint(1 - point.x, point.y);
  if (axis === "horizontal") return frozenPoint(point.x, 1 - point.y);
  if (axis === "diag-main") return frozenPoint(point.y, point.x);
  return frozenPoint(1 - point.y, 1 - point.x);
}

function reflectDirection(source, axis) {
  const direction = normalizedDirection(source);
  if (axis === "vertical") return frozenPoint(-direction.x, direction.y);
  if (axis === "horizontal") return frozenPoint(direction.x, -direction.y);
  if (axis === "diag-main") return frozenPoint(direction.y, direction.x);
  return frozenPoint(-direction.y, -direction.x);
}

function punchFrame(mark) {
  const u = mark.direction;
  const v = mark.parity === ORIENTATION_PARITY.PRESERVED
    ? frozenPoint(-u.y, u.x)
    : frozenPoint(u.y, -u.x);
  return { u, v };
}

function transformedLocalPoint(mark, localX, localY) {
  const { u, v } = punchFrame(mark);
  return frozenPoint(
    mark.center.x + u.x * localX + v.x * localY,
    mark.center.y + u.y * localX + v.y * localY
  );
}

export function punchVertices(mark) {
  assertPunchStructure(mark);
  const radius = mark.radius;
  if (mark.shape === "circle") return Object.freeze([]);

  const localPoints = mark.shape === "triangle"
    ? [
        [0, -radius],
        [Math.sqrt(3) * radius / 2, radius / 2],
        [-Math.sqrt(3) * radius / 2, radius / 2]
      ]
    : (() => {
        const halfSide = radius / Math.sqrt(2);
        return [
          [-halfSide, -halfSide],
          [halfSide, -halfSide],
          [halfSide, halfSide],
          [-halfSide, halfSide]
        ];
      })();

  return Object.freeze(localPoints.map(([x, y]) => transformedLocalPoint(mark, x, y)));
}

export function isMarkInPaper(mark, options = {}) {
  const epsilon = options.epsilon ?? EPSILON;
  if (!isFiniteNumber(epsilon) || epsilon < 0) throw new RangeError("Validation epsilon must be non-negative.");
  const inside = ({ x, y }) => x >= -epsilon && x <= 1 + epsilon && y >= -epsilon && y <= 1 + epsilon;

  try {
    if (mark?.kind === "polygon") return mark.points.every(inside);
    if (mark?.kind !== "punch") return false;
    if (mark.shape === "circle") {
      return mark.center.x - mark.radius >= -epsilon
        && mark.center.x + mark.radius <= 1 + epsilon
        && mark.center.y - mark.radius >= -epsilon
        && mark.center.y + mark.radius <= 1 + epsilon;
    }
    return punchVertices(mark).every(inside);
  } catch {
    return false;
  }
}

export function validateMark(mark, options = {}) {
  if (!mark || typeof mark !== "object") throw new TypeError("A mark must be an object.");
  normalizedParity(mark.parity);

  if (mark.kind === "polygon") {
    normalizedPolygonPoints(mark.points);
  } else if (mark.kind === "punch") {
    assertPunchStructure(mark);
  } else {
    throw new TypeError(`Unknown mark kind: ${String(mark.kind)}`);
  }

  if (!isMarkInPaper(mark, options)) throw new RangeError("Mark must stay within the normalized paper bounds [0, 1].");
  return true;
}

export function validateMarks(marks, options = {}) {
  if (!Array.isArray(marks)) throw new TypeError("Marks must be an array.");
  marks.forEach((mark, index) => {
    try {
      validateMark(mark, options);
    } catch (error) {
      error.message = `Invalid mark at index ${index}: ${error.message}`;
      throw error;
    }
  });
  return true;
}

function normalizedMark(mark) {
  validateMark(mark);
  if (mark.kind === "polygon") return createPolygonMark(mark.points, { parity: mark.parity });
  return makePunchMark(mark.shape, mark.center, mark.radius, mark.direction, mark.parity);
}

export function reflectMark(mark, axis) {
  assertAxis(axis);
  const source = normalizedMark(mark);
  const parity = toggledParity(source.parity);
  if (source.kind === "polygon") {
    return createPolygonMark(source.points.map((point) => reflectPoint(point, axis)), { parity });
  }
  return makePunchMark(
    source.shape,
    reflectPoint(source.center, axis),
    source.radius,
    reflectDirection(source.direction, axis),
    parity
  );
}

function numberKey(value) {
  return rounded(value).toFixed(KEY_DIGITS);
}

function pointKey(point) {
  return `${numberKey(point.x)},${numberKey(point.y)}`;
}

function canonicalCycleKey(points) {
  const values = points.map(pointKey);
  const variants = [];
  for (let offset = 0; offset < values.length; offset += 1) {
    variants.push(values.slice(offset).concat(values.slice(0, offset)).join(";"));
  }
  const reversed = [...values].reverse();
  for (let offset = 0; offset < reversed.length; offset += 1) {
    variants.push(reversed.slice(offset).concat(reversed.slice(0, offset)).join(";"));
  }
  variants.sort();
  return variants[0];
}

export function markGeometryKey(mark) {
  const source = normalizedMark(mark);
  if (source.kind === "polygon") return `polygon:${canonicalCycleKey(source.points)}`;
  if (source.shape === "circle") {
    return `punch:circle:${pointKey(source.center)}:${numberKey(source.radius)}`;
  }
  return `punch:${source.shape}:${canonicalCycleKey(punchVertices(source))}`;
}

function semanticKey(mark) {
  const parityRank = mark.parity === ORIENTATION_PARITY.PRESERVED ? "0" : "1";
  if (mark.kind === "polygon") return `${parityRank}:${mark.points.map(pointKey).join(";")}`;
  return `${parityRank}:${pointKey(mark.direction)}`;
}

export function deduplicateMarks(marks) {
  validateMarks(marks);
  const byGeometry = new Map();

  marks.forEach((mark) => {
    const normalized = normalizedMark(mark);
    const geometryKey = markGeometryKey(normalized);
    const candidate = { mark: normalized, semanticKey: semanticKey(normalized) };
    const current = byGeometry.get(geometryKey);
    if (!current || candidate.semanticKey < current.semanticKey) byGeometry.set(geometryKey, candidate);
  });

  return Object.freeze(
    [...byGeometry.entries()]
      .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
      .map(([, value]) => value.mark)
  );
}

export function unfoldMarkStages(marks, folds) {
  if (!Array.isArray(folds)) throw new TypeError("Folds must be an array.");
  const axes = folds.map(axisFromFold);
  let current = deduplicateMarks(marks);
  const stages = [Object.freeze({ step: 0, foldIndex: null, axis: null, marks: current })];

  for (let foldIndex = axes.length - 1; foldIndex >= 0; foldIndex -= 1) {
    const axis = axes[foldIndex];
    const reflected = current.map((mark) => reflectMark(mark, axis));
    current = deduplicateMarks([...current, ...reflected]);
    validateMarks(current);
    stages.push(Object.freeze({
      step: stages.length,
      foldIndex,
      axis,
      marks: current
    }));
  }

  return Object.freeze(stages);
}

export function unfoldMarks(marks, folds) {
  return unfoldMarkStages(marks, folds).at(-1).marks;
}
