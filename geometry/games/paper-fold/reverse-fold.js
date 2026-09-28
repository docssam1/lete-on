/* 접는 방법 거꾸로 찾기 (PF-C06 · PF-C07 · PF-C08)의 기하 모델.

   종이는 단순 다각형 P, 접는 선은 직선 L이다.
   접기는 L의 한쪽(움직이는 쪽)을 L에 대해 반사시켜 고정된 쪽에 겹치는 것이다.
   결과 도형 = (P ∩ 고정 반평면) ∪ 반사(P ∩ 움직이는 반평면).

   합집합 다각형은 계산하지 않는다. 두 조각을 그대로 보관하고, 렌더는 같은 색으로
   겹쳐 그려 외곽선이 곧 합집합이 되게 한다. 도형 동일성은 두 해상도의 래스터
   서명이 모두 일치할 때만 같다고 본다. 비교는 회전·위치 불변이 아니라 화면에
   놓인 좌표 그대로 한다. */

const EPS = 1e-9;
export const SIGNATURE_SIZES = [181, 257];

const round6 = (value) => Math.round(value * 1e6) / 1e6;
export const pt = (x, y) => ({ x: round6(x), y: round6(y) });

export function polygonArea(polygon) {
  let sum = 0;
  for (let index = 0; index < polygon.length; index += 1) {
    const a = polygon[index];
    const b = polygon[(index + 1) % polygon.length];
    sum += a.x * b.y - b.x * a.y;
  }
  return Math.abs(sum) / 2;
}

export function polygonCentroid(polygon) {
  let twiceArea = 0;
  let cx = 0;
  let cy = 0;
  for (let index = 0; index < polygon.length; index += 1) {
    const a = polygon[index];
    const b = polygon[(index + 1) % polygon.length];
    const cross = a.x * b.y - b.x * a.y;
    twiceArea += cross;
    cx += (a.x + b.x) * cross;
    cy += (a.y + b.y) * cross;
  }
  if (Math.abs(twiceArea) < EPS) {
    return pt(
      polygon.reduce((sum, item) => sum + item.x, 0) / polygon.length,
      polygon.reduce((sum, item) => sum + item.y, 0) / polygon.length
    );
  }
  return pt(cx / (3 * twiceArea), cy / (3 * twiceArea));
}

export function polygonBox(polygon) {
  return {
    minX: Math.min(...polygon.map((item) => item.x)), maxX: Math.max(...polygon.map((item) => item.x)),
    minY: Math.min(...polygon.map((item) => item.y)), maxY: Math.max(...polygon.map((item) => item.y))
  };
}

export function normalizeLine({ nx, ny, c }) {
  const length = Math.hypot(nx, ny);
  if (length < EPS) throw new Error("REVERSE_FOLD_DEGENERATE_LINE");
  let ux = nx / length;
  let uy = ny / length;
  let offset = c / length;
  if (uy < -EPS || (Math.abs(uy) <= EPS && ux < 0)) {
    ux = -ux;
    uy = -uy;
    offset = -offset;
  }
  return { nx: round6(ux), ny: round6(uy), c: round6(offset) };
}

export const lineThrough = (a, b) => normalizeLine({
  nx: -(b.y - a.y), ny: b.x - a.x, c: -(b.y - a.y) * a.x + (b.x - a.x) * a.y
});

export const signedDistance = (line, point) => line.nx * point.x + line.ny * point.y - line.c;

export const reflectAcross = (line, point) => {
  const distance = signedDistance(line, point);
  return pt(point.x - 2 * distance * line.nx, point.y - 2 * distance * line.ny);
};

/* 두 직선이 같은 직선인지 재는 값. 표본점의 부호 거리를 비교하므로 법선 방향이
   뒤집힌 같은 직선도 0으로 나온다. */
export function lineGap(a, b, samples) {
  let same = 0;
  let flipped = 0;
  for (const sample of samples) {
    const da = signedDistance(a, sample);
    const db = signedDistance(b, sample);
    same = Math.max(same, Math.abs(da - db));
    flipped = Math.max(flipped, Math.abs(da + db));
  }
  return Math.min(same, flipped);
}

export function clipHalfPlane(polygon, line, sign) {
  const value = (point) => sign * signedDistance(line, point);
  const output = [];
  polygon.forEach((current, index) => {
    const previous = polygon[(index + polygon.length - 1) % polygon.length];
    const currentValue = value(current);
    const previousValue = value(previous);
    const currentInside = currentValue >= -EPS;
    const previousInside = previousValue >= -EPS;
    if (currentInside !== previousInside) {
      const ratio = previousValue / (previousValue - currentValue);
      output.push(pt(previous.x + (current.x - previous.x) * ratio, previous.y + (current.y - previous.y) * ratio));
    }
    if (currentInside) output.push(current);
  });
  const cleaned = output.filter((item, index) => index === 0
    || Math.abs(item.x - output[index - 1].x) > 1e-7
    || Math.abs(item.y - output[index - 1].y) > 1e-7);
  while (cleaned.length > 1
    && Math.abs(cleaned[0].x - cleaned.at(-1).x) <= 1e-7
    && Math.abs(cleaned[0].y - cleaned.at(-1).y) <= 1e-7) cleaned.pop();
  return cleaned;
}

/* 한 번 접기. movingSign 쪽이 움직이는 쪽이다. 어느 쪽도 비지 않아야 접기다. */
export function foldOnce(paper, rawLine, movingSign) {
  const line = normalizeLine(rawLine);
  const fixed = clipHalfPlane(paper, line, -movingSign);
  const flap = clipHalfPlane(paper, line, movingSign);
  if (fixed.length < 3 || flap.length < 3) return null;
  const fixedArea = polygonArea(fixed);
  const flapArea = polygonArea(flap);
  if (fixedArea < 1e-7 || flapArea < 1e-7) return null;
  const moved = flap.map((point) => reflectAcross(line, point));
  return { line, movingSign, fixed, flap, moved, fixedArea, flapArea, pieces: [fixed, moved] };
}

/* 작은 쪽을 접어 넘기는 자연스러운 접기. 같으면 법선 양의 쪽을 움직인다. */
export function naturalFold(paper, line) {
  const positive = foldOnce(paper, line, 1);
  const negative = foldOnce(paper, line, -1);
  if (!positive) return negative;
  if (!negative) return positive;
  return positive.flapArea <= negative.flapArea + 1e-9 ? positive : negative;
}

/* 해상도 size의 내부 판정 비트맵을 행 단위 구간으로 훑는다. 픽셀 중심이
   조각 안에 있으면 채운다. 여러 조각의 구간은 합쳐서 한 번만 방문한다. */
export function forEachRowSpan(pieces, size, visit) {
  const starts = [];
  const ends = [];
  const crossings = [];
  for (let row = 0; row < size; row += 1) {
    const y = (row + 0.5) / size;
    let count = 0;
    for (const polygon of pieces) {
      crossings.length = 0;
      for (let index = 0; index < polygon.length; index += 1) {
        const a = polygon[index];
        const b = polygon[(index + 1) % polygon.length];
        if ((a.y <= y) === (b.y <= y)) continue;
        crossings.push(a.x + ((y - a.y) * (b.x - a.x)) / (b.y - a.y));
      }
      if (crossings.length < 2) continue;
      crossings.sort((left, right) => left - right);
      for (let index = 0; index + 1 < crossings.length; index += 2) {
        const first = Math.max(0, Math.ceil(crossings[index] * size - 0.5));
        const last = Math.min(size - 1, Math.floor(crossings[index + 1] * size - 0.5));
        if (first > last) continue;
        starts[count] = first;
        ends[count] = last;
        count += 1;
      }
    }
    if (!count) continue;
    for (let index = 1; index < count; index += 1) {
      const start = starts[index];
      const end = ends[index];
      let slot = index - 1;
      while (slot >= 0 && starts[slot] > start) {
        starts[slot + 1] = starts[slot];
        ends[slot + 1] = ends[slot];
        slot -= 1;
      }
      starts[slot + 1] = start;
      ends[slot + 1] = end;
    }
    let spanStart = starts[0];
    let spanEnd = ends[0];
    for (let index = 1; index < count; index += 1) {
      if (starts[index] <= spanEnd + 1) {
        if (ends[index] > spanEnd) spanEnd = ends[index];
        continue;
      }
      visit(row, spanStart, spanEnd);
      spanStart = starts[index];
      spanEnd = ends[index];
    }
    visit(row, spanStart, spanEnd);
  }
}

export function rasterBitmap(pieces, size) {
  const bits = new Uint8Array(size * size);
  forEachRowSpan(pieces, size, (row, start, end) => bits.fill(1, row * size + start, row * size + end + 1));
  return bits;
}

export function sameBitmap(a, b) {
  if (a.length !== b.length) return false;
  for (let index = 0; index < a.length; index += 1) if (a[index] !== b[index]) return false;
  return true;
}

export function sizeSignature(pieces, size) {
  let fnv = 2166136261 ^ size;
  let djb = 5381 + size;
  forEachRowSpan(pieces, size, (row, start, end) => {
    fnv = Math.imul(fnv ^ (row + 1), 16777619);
    fnv = Math.imul(fnv ^ (start + 1), 16777619);
    fnv = Math.imul(fnv ^ (end + 1), 16777619);
    djb = (Math.imul(djb, 33) + row) | 0;
    djb = (Math.imul(djb, 33) + start) | 0;
    djb = (Math.imul(djb, 33) + end) | 0;
  });
  return `${(fnv >>> 0).toString(36)}.${(djb >>> 0).toString(36)}`;
}

/* 두 해상도의 판정이 모두 같을 때만 같은 서명이 된다. */
export const signatureKey = (pieces) => SIGNATURE_SIZES.map((size) => sizeSignature(pieces, size)).join("/");

/* 래스터 판정을 행별 구간 집합으로 담는다. 픽셀 비트맵과 같은 정보를 가지므로
   두 모양의 대칭 차 픽셀 수를 구간 연산만으로 셀 수 있다. */
const SPAN_STRIDE = 16;

function fillSpanSet(target, pieces) {
  const { size, data, counts } = target;
  counts.fill(0);
  let filled = 0;
  forEachRowSpan(pieces, size, (row, start, end) => {
    const slot = counts[row];
    if (slot * 2 + 1 >= SPAN_STRIDE) throw new Error("REVERSE_FOLD_SPAN_OVERFLOW");
    data[row * SPAN_STRIDE + slot * 2] = start;
    data[row * SPAN_STRIDE + slot * 2 + 1] = end;
    counts[row] = slot + 1;
    filled += end - start + 1;
  });
  target.filled = filled;
  return target;
}

export const createSpanSet = (size) => ({ size, data: new Int32Array(size * SPAN_STRIDE), counts: new Int32Array(size), filled: 0 });

export const spanSetOf = (pieces, size) => fillSpanSet(createSpanSet(size), pieces);

/* 두 행별 구간 집합이 서로 다르게 판정한 픽셀 수. 0이면 그 해상도에서 같은 모양이다. */
export function spanDifference(left, right) {
  if (left.size !== right.size) throw new Error("REVERSE_FOLD_SIZE_MISMATCH");
  let shared = 0;
  for (let row = 0; row < left.size; row += 1) {
    const leftCount = left.counts[row];
    const rightCount = right.counts[row];
    if (!leftCount || !rightCount) continue;
    const leftBase = row * SPAN_STRIDE;
    const rightBase = row * SPAN_STRIDE;
    let leftSlot = 0;
    let rightSlot = 0;
    while (leftSlot < leftCount && rightSlot < rightCount) {
      const leftEnd = left.data[leftBase + leftSlot * 2 + 1];
      const rightEnd = right.data[rightBase + rightSlot * 2 + 1];
      const low = Math.max(left.data[leftBase + leftSlot * 2], right.data[rightBase + rightSlot * 2]);
      const high = Math.min(leftEnd, rightEnd);
      if (high >= low) shared += high - low + 1;
      if (leftEnd < rightEnd) leftSlot += 1;
      else rightSlot += 1;
    }
  }
  return left.filled + right.filled - 2 * shared;
}

/* 각도 θ를 0~179도 1도 간격, 오프셋을 그 각도의 투영 구간(도형 지름을 넘지 않는
   범위)에서 촘촘히 훑어, 한 번 접어 만들 수 있는 모든 모양을 검사 대상과 견준다.
   대상별로 전체 탐색에서 가장 가까웠던 차이 픽셀 수와, 두 해상도 모두에서
   허용 오차 안으로 들어오는 접는 선을 돌려준다. */
export function sweepFolds(paper, targets = [], { angleSteps = 180, offsetSteps = 200, closeRatio = 0.005 } = {}) {
  const prepared = targets.map((target) => ({
    id: target.id,
    spans: SIGNATURE_SIZES.map((size) => spanSetOf(target.pieces, size)),
    tolerance: SIGNATURE_SIZES.map((size) => Math.round(size * size * closeRatio)),
    minDifference: SIGNATURE_SIZES.map(() => Infinity),
    closeLines: []
  }));
  const scratch = SIGNATURE_SIZES.map((size) => createSpanSet(size));
  let lineCount = 0;
  let foldCount = 0;
  for (let angleIndex = 0; angleIndex < angleSteps; angleIndex += 1) {
    const theta = (angleIndex * Math.PI) / angleSteps;
    const nx = Math.cos(theta);
    const ny = Math.sin(theta);
    let low = Infinity;
    let high = -Infinity;
    for (const vertex of paper) {
      const projection = nx * vertex.x + ny * vertex.y;
      if (projection < low) low = projection;
      if (projection > high) high = projection;
    }
    for (let offsetIndex = 0; offsetIndex <= offsetSteps; offsetIndex += 1) {
      const c = low + ((high - low) * offsetIndex) / offsetSteps;
      lineCount += 1;
      for (const sign of [1, -1]) {
        const fold = foldOnce(paper, { nx, ny, c }, sign);
        if (!fold) continue;
        foldCount += 1;
        fillSpanSet(scratch[0], fold.pieces);
        let fineReady = false;
        for (const target of prepared) {
          const coarse = spanDifference(scratch[0], target.spans[0]);
          if (coarse < target.minDifference[0]) target.minDifference[0] = coarse;
          if (coarse > target.tolerance[0]) continue;
          if (!fineReady) {
            fillSpanSet(scratch[1], fold.pieces);
            fineReady = true;
          }
          const fine = spanDifference(scratch[1], target.spans[1]);
          if (fine < target.minDifference[1]) target.minDifference[1] = fine;
          if (fine > target.tolerance[1]) continue;
          target.closeLines.push({ theta, c, sign, line: fold.line, coarse, fine });
        }
      }
    }
  }
  return { targets: prepared, lineCount, foldCount, angleSteps, offsetSteps, closeRatio };
}

/* 직선이 다각형 내부를 지나는 구간(현). 오목한 종이에서도 종이 밖을 지나는
   부분은 빼고 실제로 종이 위에 있는 선분만 남긴다. */
export function chordSegments(polygon, line) {
  const anchor = polygonCentroid(polygon);
  const distance = signedDistance(line, anchor);
  const origin = pt(anchor.x - distance * line.nx, anchor.y - distance * line.ny);
  const ux = -line.ny;
  const uy = line.nx;
  const parameters = [];
  for (let index = 0; index < polygon.length; index += 1) {
    const a = polygon[index];
    const b = polygon[(index + 1) % polygon.length];
    const da = signedDistance(line, a);
    const db = signedDistance(line, b);
    if ((da <= 0) === (db <= 0)) continue;
    const ratio = da / (da - db);
    const x = a.x + (b.x - a.x) * ratio;
    const y = a.y + (b.y - a.y) * ratio;
    parameters.push((x - origin.x) * ux + (y - origin.y) * uy);
  }
  parameters.sort((left, right) => left - right);
  const chords = [];
  for (let index = 0; index + 1 < parameters.length; index += 2) {
    if (parameters[index + 1] - parameters[index] < 1e-6) continue;
    chords.push([
      pt(origin.x + ux * parameters[index], origin.y + uy * parameters[index]),
      pt(origin.x + ux * parameters[index + 1], origin.y + uy * parameters[index + 1])
    ]);
  }
  return chords;
}

const insidePolygon = (polygon, point) => {
  let inside = false;
  for (let index = 0; index < polygon.length; index += 1) {
    const a = polygon[index];
    const b = polygon[(index + 1) % polygon.length];
    if ((a.y <= point.y) === (b.y <= point.y)) continue;
    const x = a.x + ((point.y - a.y) * (b.x - a.x)) / (b.y - a.y);
    if (point.x < x) inside = !inside;
  }
  return inside;
};

export const pointsInside = (polygon, points) => points.every((point) => insidePolygon(polygon, point));

/* 접기 화살표. 현의 가운데에서 움직이는 쪽과 고정된 쪽으로 같은 거리만큼
   들어간 두 점을 잇는다. 화살표 전체가 종이 안에 들어갈 때까지 길이를 줄인다. */
export function foldArrow(paper, chord, line, movingSign) {
  const middle = pt((chord[0].x + chord[1].x) / 2, (chord[0].y + chord[1].y) / 2);
  for (const reach of [0.15, 0.12, 0.1, 0.08, 0.06, 0.045, 0.03]) {
    const from = pt(middle.x + line.nx * movingSign * reach, middle.y + line.ny * movingSign * reach);
    const to = pt(middle.x - line.nx * movingSign * reach, middle.y - line.ny * movingSign * reach);
    const samples = Array.from({ length: 11 }, (_, index) => {
      const ratio = index / 10;
      return pt(from.x + (to.x - from.x) * ratio, from.y + (to.y - from.y) * ratio);
    });
    if (pointsInside(paper, samples)) return { from, to, samples };
  }
  return null;
}

/* 접는 선 후보의 터치 면. 현을 따라 만든 얇은 사각형이므로 아이는 설명 상자가
   아니라 종이 위의 선을 직접 누른다. */
export function chordTouchBand(chord, line, halfWidth = 0.034) {
  const [a, b] = chord;
  const offsetX = line.nx * halfWidth;
  const offsetY = line.ny * halfWidth;
  return [
    pt(a.x + offsetX, a.y + offsetY), pt(b.x + offsetX, b.y + offsetY),
    pt(b.x - offsetX, b.y - offsetY), pt(a.x - offsetX, a.y - offsetY)
  ];
}

export const PAPER_SHAPES = {
  rectangle: {
    id: "rectangle",
    label: { ko: "직사각형 종이", zh: "长方形纸", ja: "長方形の紙", en: "Rectangle paper" },
    polygon: [pt(0.12, 0.22), pt(0.88, 0.22), pt(0.88, 0.78), pt(0.12, 0.78)]
  },
  parallelogram: {
    id: "parallelogram",
    label: { ko: "평행사변형 종이", zh: "平行四边形纸", ja: "平行四辺形の紙", en: "Parallelogram paper" },
    polygon: [pt(0.24, 0.24), pt(0.94, 0.24), pt(0.76, 0.76), pt(0.06, 0.76)]
  },
  pentagon: {
    id: "pentagon",
    label: { ko: "오각형 종이", zh: "五边形纸", ja: "五角形の紙", en: "Pentagon paper" },
    polygon: [pt(0.5, 0.08), pt(0.92, 0.4), pt(0.76, 0.9), pt(0.24, 0.9), pt(0.08, 0.4)]
  },
  lshape: {
    id: "lshape",
    label: { ko: "L자 종이", zh: "L形纸", ja: "L字の紙", en: "L-shaped paper" },
    polygon: [pt(0.16, 0.14), pt(0.58, 0.14), pt(0.58, 0.52), pt(0.88, 0.52), pt(0.88, 0.86), pt(0.16, 0.86)]
  }
};

/* 한 문제의 모든 그림은 같은 정사각 좌표 틀을 쓴다. 비교가 위치·회전 불변이
   아니라 화면에 놓인 그대로여야 하므로 종이와 보기의 축척과 위치가 같아야 한다. */
export function sharedFrame(shapes, padding = 0.04) {
  const flat = shapes.flat();
  const minX = Math.min(...flat.map((item) => item.x)) - padding;
  const maxX = Math.max(...flat.map((item) => item.x)) + padding;
  const minY = Math.min(...flat.map((item) => item.y)) - padding;
  const maxY = Math.max(...flat.map((item) => item.y)) + padding;
  const size = Math.max(maxX - minX, maxY - minY);
  return { x: round6(minX - (size - (maxX - minX)) / 2), y: round6(minY - (size - (maxY - minY)) / 2), size: round6(size) };
}

const shapeSamples = (polygon) => [...polygon, polygonCentroid(polygon)];

const inDrawArea = (pieces) => pieces.every((piece) => piece.every(({ x, y }) => x >= 0.01 && x <= 0.99 && y >= 0.01 && y <= 0.99));

const poolCache = new Map();

/* 후보 접는 선 모음. 꼭짓점·변의 중점·무게중심을 잇는 직선 중 실제로 접을 수
   있고, 현이 하나이며, 결과가 그림 영역 안에 들어오는 것만 남긴다. */
export function foldLinePool(shapeId) {
  if (poolCache.has(shapeId)) return poolCache.get(shapeId);
  const polygon = PAPER_SHAPES[shapeId].polygon;
  const area = polygonArea(polygon);
  const midpoints = polygon.map((a, index) => {
    const b = polygon[(index + 1) % polygon.length];
    return pt((a.x + b.x) / 2, (a.y + b.y) / 2);
  });
  const anchors = [...polygon, ...midpoints, polygonCentroid(polygon)];
  const seen = new Set();
  const pool = [];
  for (let first = 0; first < anchors.length; first += 1) {
    for (let second = first + 1; second < anchors.length; second += 1) {
      const a = anchors[first];
      const b = anchors[second];
      if (Math.hypot(b.x - a.x, b.y - a.y) < 0.14) continue;
      const line = lineThrough(a, b);
      const id = `${line.nx.toFixed(4)}|${line.ny.toFixed(4)}|${line.c.toFixed(4)}`;
      if (seen.has(id)) continue;
      seen.add(id);
      const chords = chordSegments(polygon, line);
      if (chords.length !== 1) continue;
      const fold = naturalFold(polygon, line);
      if (!fold) continue;
      if (fold.flapArea < area * 0.17 || fold.fixedArea < area * 0.25) continue;
      if (!inDrawArea(fold.pieces)) continue;
      const arrow = foldArrow(polygon, chords[0], fold.line, fold.movingSign);
      if (!arrow) continue;
      pool.push({ line: fold.line, movingSign: fold.movingSign, chord: chords[0], arrow, fold, key: signatureKey(fold.pieces) });
    }
  }
  poolCache.set(shapeId, pool);
  return pool;
}

const transformPoint = (point, center, transform) => {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  if (transform.kind === "rotate") {
    const angle = (transform.angle * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return pt(center.x + dx * cos - dy * sin, center.y + dx * sin + dy * cos);
  }
  if (transform.kind === "scale") return pt(center.x + dx * transform.sx, center.y + dy * transform.sy);
  return pt(point.x + transform.dx, point.y + transform.dy);
};

const transformPieces = (pieces, center, transform) => pieces.map((piece) => piece.map((point) => transformPoint(point, center, transform)));

/* 오답 후보를 만드는 변형. 회전은 결과의 모든 변 방향을 바꾸므로 고정된 쪽이
   원래 종이의 변 위에 남을 수 없고, 따라서 한 번 접어서는 만들 수 없다.
   불가능하다는 주장 자체는 selftest의 전수 탐색이 증명한다. */
const WRONG_TRANSFORMS = [
  { kind: "rotate", angle: 23 }, { kind: "rotate", angle: -27 },
  { kind: "rotate", angle: 34 }, { kind: "rotate", angle: -41 },
  { kind: "rotate", angle: 16 }, { kind: "rotate", angle: -19 },
  { kind: "scale", sx: 0.84, sy: 1 }, { kind: "scale", sx: 1, sy: 0.82 },
  { kind: "shift", dx: 0.07, dy: 0.05 }, { kind: "shift", dx: -0.06, dy: 0.06 }
];

const spreadIndex = (pool, variant, step) => (variant * Math.max(1, Math.floor(pool.length / 4)) + step) % pool.length;

/* (A) 접는 선 찾기. 종이와 한 번 접은 결과를 주고, 종이 위 후보 선 중 그 결과를
   만드는 선을 직접 누르게 한다. 다른 후보는 어느 쪽을 접어도 그 결과가 되지
   않는 것만 쓴다. */
export function buildFoldLineProblem(shapeId, variant) {
  const polygon = PAPER_SHAPES[shapeId].polygon;
  const pool = foldLinePool(shapeId);
  const samples = shapeSamples(polygon);
  const answer = pool[spreadIndex(pool, variant, 0)];
  const distractors = [];
  for (let step = 1; step < pool.length && distractors.length < 2; step += 1) {
    const candidate = pool[spreadIndex(pool, variant, step * 3)];
    if (candidate === answer || candidate.key === answer.key) continue;
    if (lineGap(candidate.line, answer.line, samples) < 0.1) continue;
    if (distractors.some((item) => item.key === candidate.key || lineGap(item.line, candidate.line, samples) < 0.1)) continue;
    const reachesAnswer = [1, -1].some((sign) => {
      const fold = foldOnce(polygon, candidate.line, sign);
      return fold && signatureKey(fold.pieces) === answer.key;
    });
    if (reachesAnswer) continue;
    distractors.push(candidate);
  }
  if (distractors.length < 2) throw new Error(`REVERSE_FOLD_NO_DISTRACTOR_LINES:${shapeId}:${variant}`);
  const ordered = [answer, ...distractors].sort((left, right) => {
    const a = left.chord[0].y + left.chord[1].y - (right.chord[0].y + right.chord[1].y);
    if (Math.abs(a) > 1e-6) return a;
    return left.chord[0].x + left.chord[1].x - (right.chord[0].x + right.chord[1].x);
  });
  const lineChoices = ordered.map((item, index) => ({
    key: String.fromCharCode(97 + index),
    chord: item.chord,
    band: chordTouchBand(item.chord, item.line),
    line: item.line,
    movingSign: item.movingSign,
    arrow: item.arrow,
    correct: item === answer
  }));
  return {
    interaction: "fold-line-pick",
    paperId: shapeId,
    paper: polygon,
    paperLabel: PAPER_SHAPES[shapeId].label,
    lineChoices,
    answerKey: lineChoices.find((item) => item.correct).key,
    answerContract: "single",
    resultPieces: answer.fold.pieces,
    resultSignature: answer.key,
    resultCrease: answer.chord,
    frame: sharedFrame([polygon, ...answer.fold.pieces, ...lineChoices.map((item) => item.band)]),
    figureKey: `fold-line|${shapeId}|${answer.key}|${lineChoices.map((item) => item.line.c.toFixed(4)).join(",")}`
  };
}

/* (B) 만들 수 있는 결과 모두 찾기. 정답 2개, 오답 2개. */
export function buildFoldResultProblem(shapeId, variant) {
  const polygon = PAPER_SHAPES[shapeId].polygon;
  const pool = foldLinePool(shapeId);
  const samples = shapeSamples(polygon);
  const center = polygonCentroid(polygon);
  const correct = [];
  for (let step = 0; step < pool.length && correct.length < 2; step += 1) {
    const candidate = pool[spreadIndex(pool, variant, step * 2)];
    if (correct.some((item) => item.key === candidate.key || lineGap(item.line, candidate.line, samples) < 0.1)) continue;
    correct.push(candidate);
  }
  if (correct.length < 2) throw new Error(`REVERSE_FOLD_NO_CORRECT_RESULTS:${shapeId}:${variant}`);
  const used = new Set(correct.map((item) => item.key));
  const wrong = [];
  for (let step = 0; step < pool.length * WRONG_TRANSFORMS.length && wrong.length < 2; step += 1) {
    const base = pool[spreadIndex(pool, variant, (step % pool.length) * 5 + 1)];
    const transform = WRONG_TRANSFORMS[(variant + Math.floor(step / pool.length) + wrong.length) % WRONG_TRANSFORMS.length];
    const pieces = transformPieces(base.fold.pieces, center, transform);
    if (!inDrawArea(pieces)) continue;
    const key = signatureKey(pieces);
    if (used.has(key)) continue;
    used.add(key);
    const crease = base.chord.map((point) => transformPoint(point, center, transform));
    wrong.push({ pieces, key, crease, transform, basis: base.key });
  }
  if (wrong.length < 2) throw new Error(`REVERSE_FOLD_NO_WRONG_RESULTS:${shapeId}:${variant}`);
  const candidates = [
    ...correct.map((item) => ({ pieces: item.fold.pieces, key: item.key, correct: true, line: item.line, chord: item.chord, crease: item.chord, arrow: item.arrow, movingSign: item.movingSign })),
    ...wrong.map((item) => ({ pieces: item.pieces, key: item.key, crease: item.crease, correct: false, transform: item.transform }))
  ].sort((left, right) => (left.key < right.key ? -1 : left.key > right.key ? 1 : 0));
  const resultOptions = candidates.map((item, index) => ({ ...item, key: String.fromCharCode(97 + index), signature: item.key }));
  return {
    interaction: "fold-result-multi",
    paperId: shapeId,
    paper: polygon,
    paperLabel: PAPER_SHAPES[shapeId].label,
    resultOptions,
    answerKeys: resultOptions.filter((item) => item.correct).map((item) => item.key),
    answerContract: "multiple",
    creaseHints: resultOptions.filter((item) => item.correct).map((item) => ({ chord: item.chord, line: item.line, arrow: item.arrow, movingSign: item.movingSign })),
    frame: sharedFrame([polygon, ...resultOptions.flatMap((item) => item.pieces)]),
    figureKey: `fold-result|${shapeId}|${resultOptions.map((item) => item.signature).join(",")}`
  };
}

export const REVERSE_SHAPE_ORDER = ["parallelogram", "pentagon", "rectangle", "lshape"];
export const REVERSE_VARIANTS = 3;
