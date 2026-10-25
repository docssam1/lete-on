// 종이 접기 문제 그림(문제은행 화면 app.js와 연습 공방 drill.js가 함께 쓴다) — app.js에 있던 그리기를 그대로 옮겨 왔다(2026-10-27).
// 접은 색종이 구멍 · 대각선으로 한 번·두 번 접어 자른 수 칸 · 접어 자른 조각, 그리고 함께 쓰는 접기 화살표·도형 도우미.

export function foldGeometryHelpers() {
  const KEEP = {
    v: (p) => 0.5 - p.x,
    h: (p) => 0.5 - p.y,
    vq: (p) => 0.25 - p.x,
    hq: (p) => 0.25 - p.y,
    d1: (p) => p.x - p.y,
    d2: (p) => 1 - p.x - p.y
  };
  const MIRROR = {
    v: (p) => ({ x: 1 - p.x, y: p.y }),
    h: (p) => ({ x: p.x, y: 1 - p.y }),
    vq: (p) => ({ x: 0.5 - p.x, y: p.y }),
    hq: (p) => ({ x: p.x, y: 0.5 - p.y }),
    d1: (p) => ({ x: p.y, y: p.x }),
    d2: (p) => ({ x: 1 - p.y, y: 1 - p.x })
  };
  const clip = (polygon, keep) => {
    const out = [];
    for (let i = 0; i < polygon.length; i += 1) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      const da = keep(a);
      const db = keep(b);
      if (da >= -1e-9) out.push(a);
      if ((da > 1e-9 && db < -1e-9) || (da < -1e-9 && db > 1e-9)) {
        const t = da / (da - db);
        out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      }
    }
    return out;
  };
  const foldLine = (polygon, fold) => {
    const keep = KEEP[fold];
    const points = [];
    for (let i = 0; i < polygon.length; i += 1) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      const da = keep(a);
      const db = keep(b);
      if (Math.abs(da) < 1e-9) points.push(a);
      if ((da > 1e-9 && db < -1e-9) || (da < -1e-9 && db > 1e-9)) {
        const t = da / (da - db);
        points.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      }
    }
    if (points.length < 2) return null;
    let best = null;
    let far = -1;
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const d = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
        if (d > far) { far = d; best = [points[i], points[j]]; }
      }
    }
    return far > 1e-6 ? best : null;
  };
  const foldArrow = (polygon, dir) => {
    const keep = KEEP[dir];
    const mirror = MIRROR[dir];
    const away = clip(polygon, (p) => -keep(p));
    if (away.length < 3) return "";
    const from = { x: away.reduce((t, p) => t + p.x, 0) / away.length, y: away.reduce((t, p) => t + p.y, 0) / away.length };
    const to = mirror(from);
    return { from, to };
  };
  return { KEEP, MIRROR, clip, foldLine, foldArrow };
}

export function foldArrowSvg(from, to, shift, top, size) {
  if (!from) return "";
  const sx = shift + from.x * size;
  const sy = top + from.y * size;
  const ex = shift + to.x * size;
  const ey = top + to.y * size;
  const nx = -(ey - sy);
  const ny = ex - sx;
  const len = Math.hypot(nx, ny) || 1;
  const bulge = Math.min(size * 0.22, 20);
  const cx = (sx + ex) / 2 + (nx / len) * bulge;
  const cy = (sy + ey) / 2 + (ny / len) * bulge;
  const angle = Math.atan2(ey - cy, ex - cx);
  const head = [
    `${(ex + 6 * Math.cos(angle)).toFixed(1)},${(ey + 6 * Math.sin(angle)).toFixed(1)}`,
    `${(ex - 13 * Math.cos(angle - 0.5)).toFixed(1)},${(ey - 13 * Math.sin(angle - 0.5)).toFixed(1)}`,
    `${(ex - 13 * Math.cos(angle + 0.5)).toFixed(1)},${(ey - 13 * Math.sin(angle + 0.5)).toFixed(1)}`
  ].join(" ");
  return `<path d="M${sx.toFixed(1)} ${sy.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="#c0392b" stroke-width="3.2" stroke-linecap="round"/><polygon points="${head}" fill="#c0392b"/>`;
}

export function foldStepArrowSvg(x, y) {
  return `<path d="M${x} ${y} H${x + 30}" stroke="#95a5a6" stroke-width="3"/><polygon points="${x + 30},${y} ${x + 20},${y - 7} ${x + 20},${y + 7}" fill="#95a5a6"/>`;
}

export function foldDiagonalGridMarkup(visual) {
  const N = 4;
  const cell = 34;
  const size = N * cell;
  const top = 6;
  let x = 8;

  let parts = `<rect x="${x}" y="${top}" width="${size}" height="${size}" fill="#fdeeec" stroke="#eec6c1" stroke-width="1" stroke-dasharray="4 3"/>`;
  for (let k = 1; k < N; k += 1) {
    parts += `<line x1="${x + k * cell}" y1="${top}" x2="${x + k * cell}" y2="${top + size}" stroke="#eec6c1" stroke-dasharray="4 3"/>`;
    parts += `<line x1="${x}" y1="${top + k * cell}" x2="${x + size}" y2="${top + k * cell}" stroke="#eec6c1" stroke-dasharray="4 3"/>`;
  }
  const tri = visual.keepLower
    ? [[0, 0], [0, N], [N, N]]
    : [[0, 0], [N, 0], [N, N]];
  const triPoints = tri.map(([px, py]) => `${x + px * cell},${top + py * cell}`).join(" ");
  parts += `<polygon points="${triPoints}" fill="#fbdad6" stroke="#e8968f" stroke-width="2.4"/>`;
  for (const u of visual.region) {
    const cx = x + u.c * cell;
    const cy = top + u.r * cell;
    if (!u.half) {
      parts += `<rect x="${cx}" y="${cy}" width="${cell}" height="${cell}" fill="#b03a5b"/>`;
    } else {
      const points = visual.keepLower
        ? `${cx},${cy} ${cx},${cy + cell} ${cx + cell},${cy + cell}`
        : `${cx},${cy} ${cx + cell},${cy} ${cx + cell},${cy + cell}`;
      parts += `<polygon points="${points}" fill="#b03a5b"/>`;
    }
  }
  parts += `<line x1="${x}" y1="${top}" x2="${x + size}" y2="${top + size}" stroke="#e8968f" stroke-width="1.4" stroke-dasharray="5 4"/>`;

  x += size + 40;
  parts += foldStepArrowSvg(x, top + size / 2);
  x += 44;

  for (let r = 0; r < N; r += 1) for (let c = 0; c < N; c += 1) {
    const cx = x + c * cell;
    const cy = top + r * cell;
    parts += `<rect x="${cx}" y="${cy}" width="${cell}" height="${cell}" fill="#f9c8c4" stroke="#e0aaa4" stroke-width="1"/>`;
    parts += `<text x="${cx + cell / 2}" y="${cy + cell / 2 + 5}" text-anchor="middle" font-size="15" font-weight="600" fill="#333">${visual.grid[r][c]}</text>`;
  }
  for (let k = 1; k < N; k += 1) {
    parts += `<line x1="${x + k * cell}" y1="${top}" x2="${x + k * cell}" y2="${top + size}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 4"/>`;
    parts += `<line x1="${x}" y1="${top + k * cell}" x2="${x + size}" y2="${top + k * cell}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 4"/>`;
  }
  parts = `<rect x="${x - 2}" y="${top - 2}" width="${size + 4}" height="${size + 4}" fill="none" stroke="#e8968f" stroke-width="2.4"/>` + parts;

  return `<svg class="fold-diag-svg" viewBox="0 0 ${x + size + 10} ${size + 16}" role="img" aria-label="대각선 접기 수 색종이 문제">${parts}</svg>`;
}

export function foldCutPiecesMarkup(visual) {
  const { foldLine, foldArrow } = foldGeometryHelpers();
  const n = visual.stages.length;
  const size = n <= 3 ? 100 : 84;
  const gap = 34;
  let shift = 6;
  let parts = "";
  visual.stages.forEach((stage, index) => {
    const points = stage.polygon.map((p) => `${(shift + p.x * size).toFixed(1)},${(6 + p.y * size).toFixed(1)}`).join(" ");
    parts += `<polygon points="${points}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
    if (stage.fold) {
      const segment = foldLine(stage.polygon, stage.fold);
      if (segment) parts += `<line x1="${(shift + segment[0].x * size).toFixed(1)}" y1="${(6 + segment[0].y * size).toFixed(1)}" x2="${(shift + segment[1].x * size).toFixed(1)}" y2="${(6 + segment[1].y * size).toFixed(1)}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 5"/>`;
      const arrow = foldArrow(stage.polygon, stage.fold);
      if (arrow) parts += foldArrowSvg(arrow.from, arrow.to, shift, 6, size);
    } else {
      for (const [a, b] of visual.cuts) {
        parts += `<line x1="${(shift + a.x * size).toFixed(1)}" y1="${(6 + a.y * size).toFixed(1)}" x2="${(shift + b.x * size).toFixed(1)}" y2="${(6 + b.y * size).toFixed(1)}" stroke="#b03a5b" stroke-width="2.6"/>`;
      }
    }
    shift += size + 12;
    if (index < n - 1) { parts += foldStepArrowSvg(shift, 6 + size / 2); shift += gap; }
  });
  return `<svg class="fold-pieces-svg" viewBox="0 0 ${shift + 6} ${size + 16}" role="img" aria-label="색종이 접어 자르기 조각 개수 문제">${parts}</svg>`;
}

export function foldTwoDiagonalGridMarkup(visual) {
  const { clip } = foldGeometryHelpers();
  const keep = {
    d1: (point) => point.x - point.y,
    d2: (point) => 1 - point.x - point.y
  };
  const square = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
  const first = clip(square, keep[visual.directions[0]]);
  const folded = clip(first, keep[visual.directions[1]]);
  const size = 118;
  const top = 7;
  const points = (polygon, shift) => polygon.map((point) => `${(shift + point.x * size).toFixed(1)},${(top + point.y * size).toFixed(1)}`).join(" ");
  let shift = 7;
  let parts = `<rect x="${shift}" y="${top}" width="${size}" height="${size}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
  for (let row = 0; row < 4; row += 1) for (let column = 0; column < 4; column += 1) {
    const x = shift + column * size / 4;
    const y = top + row * size / 4;
    parts += `<rect x="${x}" y="${y}" width="${size / 4}" height="${size / 4}" fill="none" stroke="#d6a09a" stroke-width="1"/>`;
    parts += `<text x="${x + size / 8}" y="${y + size / 8 + 5}" text-anchor="middle" font-size="14" font-weight="700" fill="#333">${visual.grid[row][column]}</text>`;
  }
  const firstLine = visual.directions[0] === "d1" ? [0, 0, 1, 1] : [0, 1, 1, 0];
  parts += `<line x1="${shift + firstLine[0] * size}" y1="${top + firstLine[1] * size}" x2="${shift + firstLine[2] * size}" y2="${top + firstLine[3] * size}" stroke="#d4756c" stroke-width="2" stroke-dasharray="6 4"/>`;
  shift += size + 14;
  parts += foldStepArrowSvg(shift, top + size / 2);
  shift += 42;
  parts += `<polygon points="${points(first, shift)}" fill="#fbdad6" stroke="#e8968f" stroke-width="2"/>`;
  const secondLine = visual.directions[1] === "d1" ? [0, 0, 1, 1] : [0, 1, 1, 0];
  parts += `<line x1="${shift + secondLine[0] * size}" y1="${top + secondLine[1] * size}" x2="${shift + secondLine[2] * size}" y2="${top + secondLine[3] * size}" stroke="#d4756c" stroke-width="2" stroke-dasharray="6 4"/>`;
  shift += size + 14;
  parts += foldStepArrowSvg(shift, top + size / 2);
  shift += 42;
  parts += `<polygon points="${points(folded, shift)}" fill="#fbdad6" stroke="#e8968f" stroke-width="2"/>`;
  parts += `<circle cx="${shift + visual.target.x * size}" cy="${top + visual.target.y * size}" r="8" fill="#b03a5b"/>`;
  return `<svg class="fold-two-diagonal-svg" viewBox="0 0 ${shift + size + 8} ${size + 14}" role="img" aria-label="수가 쓰인 색종이를 대각선으로 두 번 접어 자르기">${parts}</svg>`;
}

export function paperFoldMarkup(visual) {
  const SIZE = visual.stages.length > 3 ? 84 : 100;
  const GAP = 34;
  const KEEP = {
    v: (p) => 0.5 - p.x,
    h: (p) => 0.5 - p.y,
    vq: (p) => 0.25 - p.x,
    hq: (p) => 0.25 - p.y,
    d1: (p) => p.x - p.y,
    d2: (p) => 1 - p.x - p.y
  };
  const MIRROR = {
    v: (p) => ({ x: 1 - p.x, y: p.y }),
    h: (p) => ({ x: p.x, y: 1 - p.y }),
    vq: (p) => ({ x: 0.5 - p.x, y: p.y }),
    hq: (p) => ({ x: p.x, y: 0.5 - p.y }),
    d1: (p) => ({ x: p.y, y: p.x }),
    d2: (p) => ({ x: 1 - p.y, y: 1 - p.x })
  };
  // 접혀 넘어가는 쪽을 잘라내 그 무게중심을 잡는다. 화살표는 거기서 거울점으로 향한다.
  const clip = (polygon, keep) => {
    const out = [];
    for (let i = 0; i < polygon.length; i += 1) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      const da = keep(a);
      const db = keep(b);
      if (da >= -1e-9) out.push(a);
      if ((da > 1e-9 && db < -1e-9) || (da < -1e-9 && db > 1e-9)) {
        const t = da / (da - db);
        out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      }
    }
    return out;
  };
  const foldLine = (polygon, fold) => {
    const keep = KEEP[fold];
    const points = [];
    for (let i = 0; i < polygon.length; i += 1) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      const da = keep(a);
      const db = keep(b);
      if (Math.abs(da) < 1e-9) points.push(a);
      if ((da > 1e-9 && db < -1e-9) || (da < -1e-9 && db > 1e-9)) {
        const t = da / (da - db);
        points.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      }
    }
    if (points.length < 2) return null;
    let best = null;
    let far = -1;
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const d = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
        if (d > far) { far = d; best = [points[i], points[j]]; }
      }
    }
    return far > 1e-6 ? best : null;
  };

  const width = visual.stages.length * SIZE + (visual.stages.length - 1) * GAP + 8;
  let offset = 4;
  const parts = visual.stages.map((stage, index) => {
    const shift = offset;
    offset += SIZE + GAP;
    const points = stage.polygon.map((p) => `${(shift + p.x * SIZE).toFixed(1)},${(4 + p.y * SIZE).toFixed(1)}`).join(" ");
    let piece = `<polygon points="${points}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
    if (stage.fold) {
      const segment = foldLine(stage.polygon, stage.fold);
      if (segment) {
        piece += `<line x1="${(shift + segment[0].x * SIZE).toFixed(1)}" y1="${(4 + segment[0].y * SIZE).toFixed(1)}" x2="${(shift + segment[1].x * SIZE).toFixed(1)}" y2="${(4 + segment[1].y * SIZE).toFixed(1)}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 5"/>`;
      }
      // 접는 방향 화살표 — 어느 쪽이 어디로 넘어가는지 보여준다. 이게 없으면 접는 선만 보인다.
      const away = clip(stage.polygon, (p) => -KEEP[stage.fold](p));
      if (away.length >= 3) {
        const from = { x: away.reduce((t, p) => t + p.x, 0) / away.length, y: away.reduce((t, p) => t + p.y, 0) / away.length };
        const to = MIRROR[stage.fold](from);
        const sx = shift + from.x * SIZE;
        const sy = 4 + from.y * SIZE;
        const ex = shift + to.x * SIZE;
        const ey = 4 + to.y * SIZE;
        const nx = -(ey - sy);
        const ny = ex - sx;
        const length = Math.hypot(nx, ny) || 1;
        const bulge = Math.min(20, SIZE * 0.22);
        const cx = (sx + ex) / 2 + (nx / length) * bulge;
        const cy = (sy + ey) / 2 + (ny / length) * bulge;
        const angle = Math.atan2(ey - cy, ex - cx);
        const head = [
          `${(ex + 3 * Math.cos(angle)).toFixed(1)},${(ey + 3 * Math.sin(angle)).toFixed(1)}`,
          `${(ex - 9 * Math.cos(angle - 0.5)).toFixed(1)},${(ey - 9 * Math.sin(angle - 0.5)).toFixed(1)}`,
          `${(ex - 9 * Math.cos(angle + 0.5)).toFixed(1)},${(ey - 9 * Math.sin(angle + 0.5)).toFixed(1)}`
        ].join(" ");
        piece += `<path d="M${sx.toFixed(1)} ${sy.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="#c0392b" stroke-width="3.2" stroke-linecap="round"/><polygon points="${head}" fill="#c0392b"/>`;
      }
    } else {
      piece += visual.holes.map((hole) => `<circle cx="${(shift + hole.x * SIZE).toFixed(1)}" cy="${(4 + hole.y * SIZE).toFixed(1)}" r="6" fill="#fff" stroke="#c0392b" stroke-width="1.8"/>`).join("");
    }
    if (index < visual.stages.length - 1) {
      const ax = shift + SIZE + 8;
      const ay = 4 + SIZE / 2;
      piece += `<path d="M${ax} ${ay} H${ax + 16}" stroke="#95a5a6" stroke-width="2.5"/><path d="M${ax + 18} ${ay} l-7 -5 v10 z" fill="#95a5a6"/>`;
    }
    return piece;
  }).join("");

  return `<svg class="paper-fold-svg" viewBox="0 0 ${width} ${SIZE + 8}" role="img" aria-label="색종이 접기 문제">${parts}</svg>`;
}
