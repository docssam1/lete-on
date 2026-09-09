export const VIEWPOINT_ID = "southeast-diagonal";

export const BOARD_BASIS = Object.freeze({
  east: Object.freeze([69.282, 40]),
  south: Object.freeze([-69.282, 40])
});

export const DIE_FACE_QUADS = Object.freeze({
  top: Object.freeze([[36, 36], [82, 9.442], [128, 36], [82, 62.558]]),
  front: Object.freeze([[36, 36], [82, 62.558], [82, 120.558], [36, 94]]),
  right: Object.freeze([[82, 62.558], [128, 36], [128, 94], [82, 120.558]])
});

export const DIE_BASE_CENTER = Object.freeze([82, 94]);
export const DIE_ON_BOARD_SCALE = .9;

export function pointOnQuad(quad, u, v) {
  const [a, b, c, d] = quad;
  return [
    (1 - u) * (1 - v) * a[0] + u * (1 - v) * b[0] + u * v * c[0] + (1 - u) * v * d[0],
    (1 - u) * (1 - v) * a[1] + u * (1 - v) * b[1] + u * v * c[1] + (1 - u) * v * d[1]
  ];
}

export function boardFrame(rows, cols) {
  const marginX = 28;
  const marginTop = 80;
  const marginBottom = 18;
  const origin = [marginX + rows * Math.abs(BOARD_BASIS.south[0]), marginTop];
  return {
    origin,
    width: marginX * 2 + (rows + cols) * Math.abs(BOARD_BASIS.east[0]),
    height: marginTop + marginBottom + (rows + cols) * BOARD_BASIS.east[1]
  };
}

export function projectGridPoint(row, col, frame) {
  return [
    frame.origin[0] + col * BOARD_BASIS.east[0] + row * BOARD_BASIS.south[0],
    frame.origin[1] + col * BOARD_BASIS.east[1] + row * BOARD_BASIS.south[1]
  ];
}

export function cellPolygon(row, col, frame) {
  return [
    projectGridPoint(row, col, frame),
    projectGridPoint(row, col + 1, frame),
    projectGridPoint(row + 1, col + 1, frame),
    projectGridPoint(row + 1, col, frame)
  ];
}

export function cellCenter(row, col, frame) {
  return projectGridPoint(row + .5, col + .5, frame);
}

export function pointsAttribute(points) {
  return points.map((item) => item.join(",")).join(" ");
}
