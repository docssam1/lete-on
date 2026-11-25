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
  const S = 120;
  const cell = S / N;
  const square = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
  // 왼쪽 위 → 오른쪽 아래 대각선으로 한 번 접는다. keepLower면 왼쪽 아래 삼각형이 남는다.
  const tri = visual.keepLower ? [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }] : [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }];
  const away = visual.keepLower ? { x: 2 / 3, y: 1 / 3 } : { x: 1 / 3, y: 2 / 3 };
  const cut = (x, y) => visual.region.map((u) => {
    const cx = x + u.c * cell;
    const cy = y + u.r * cell;
    if (!u.half) return `<rect x="${cx}" y="${cy}" width="${cell}" height="${cell}" fill="#b03a5b"/>`;
    const points = visual.keepLower ? `${cx},${cy} ${cx},${cy + cell} ${cx + cell},${cy + cell}` : `${cx},${cy} ${cx + cell},${cy} ${cx + cell},${cy + cell}`;
    return `<polygon points="${points}" fill="#b03a5b"/>`;
  }).join("");
  return foldNumberStrip([
    { draw: (x, y) => foldNumberPolygonSvg(square, { shift: x, top: y, S, N, rows: visual.grid }) + foldCreaseSvg(x, y, x + S, y + S), arrow: { from: away, to: { x: away.y, y: away.x } } },
    { draw: (x, y) => foldNumberPolygonSvg(tri, { shift: x, top: y, S, N }) + cut(x, y), extra: "자르기" }
  ], { S, label: "수가 쓰인 색종이를 대각선으로 한 번 접어 색칠한 부분을 자르기", cls: "fold-diag-svg" });
}

// 색종이 한 장이 어느 문항에서나 같은 크기로 보이게(원장 2026-11-16 「색종이 크기도 다르고 이상해」): 폭 = 뷰박스 폭 × 종이 한 변 80px ÷ 그림 속 종이 한 변
export const FOLD_PAPER_PX = 80;
// 크기를 정해 두고(max-width:100%로만 줄임) — 내용 크기로 줄어드는 칸(인쇄 교재의 문제 그림 칸)에서도 같은 크기로 보인다
export const foldWidthStyle = (viewWidth, paperUnits) => `style="width:${Math.round((viewWidth * FOLD_PAPER_PX) / paperUnits)}px;max-width:100%"`;

// ── 장면 이름(원장 2026-11-16 「설명도 없어」) ──
// 겹을 뒤로 비켜 그리던 것은 뺐다(원장 2026-11-17 「말로 안 되는 왜 접은 쪽도 겹치냐 다시 돌려놔」) — 종이는 한 장 모양 그대로.
export function foldStageSvg(polygon, { shift, top, size }) {
  const pts = polygon.map((p) => `${(shift + p.x * size).toFixed(1)},${(top + p.y * size).toFixed(1)}`).join(" ");
  return `<polygon points="${pts}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
}
// 수가 쓰인 색종이는 글자가 읽히게 한 변 128px로 같게(원장 2026-11-21 「색종이 단계 설명이 아니라 화살표잖아 · 우리가 설정한 기준」)
export const FOLD_NUMBER_PAPER_PX = 128;
export const foldNumberWidthStyle = (viewWidth, paperUnits) => `style="width:${Math.round((viewWidth * FOLD_NUMBER_PAPER_PX) / paperUnits)}px;max-width:100%"`;
// 수 칸 색종이 한 장(접은 부분도 같은 칸 크기) — x0·y0·w·h는 칸 단위, rows가 있으면 수를 쓴다
export function foldNumberPaperSvg({ shift, top, cell, x0 = 0, y0 = 0, w, h, rows = null, font = 18 }) {
  const ox = shift + x0 * cell;
  const oy = top + y0 * cell;
  let out = `<rect x="${ox}" y="${oy}" width="${w * cell}" height="${h * cell}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
  for (let k = 1; k < w; k += 1) out += `<line x1="${ox + k * cell}" y1="${oy}" x2="${ox + k * cell}" y2="${oy + h * cell}" stroke="#e0aaa4" stroke-dasharray="3 2"/>`;
  for (let k = 1; k < h; k += 1) out += `<line x1="${ox}" y1="${oy + k * cell}" x2="${ox + w * cell}" y2="${oy + k * cell}" stroke="#e0aaa4" stroke-dasharray="3 2"/>`;
  if (rows) for (let r = 0; r < h; r += 1) for (let c = 0; c < w; c += 1) {
    const value = rows[r]?.[c];
    if (value === undefined || value === null || value === "") continue;
    out += `<text x="${ox + c * cell + cell / 2}" y="${oy + r * cell + cell / 2 + font * 0.34}" text-anchor="middle" font-size="${font}" font-weight="700" fill="#333">${value}</text>`;
  }
  return out;
}
// 수가 쓰인 색종이를 접는 흐름 한 줄(처음 → 1번 접음 → … · 자르기) — 장면 사이 회색 화살표, 접는 장면에 점선과 빨간 굽은 화살표, 아래에 장면 이름.
// 그림 속 글로 「위쪽을 아래로 접어요」를 적지 않는다(원장 2026-11-21 「색종이 단계 설명이 아니라 화살표잖아」).
// stage = { draw(shift, top, S), arrow?: {from,to}(0~1), index?, extra? }
export function foldNumberStrip(stages, { S = 120, W = S, H = S, label = "", cls = "fold-number-svg" } = {}) {
  const top = 6;
  const gap = 34;
  let shift = 6;
  let parts = "";
  stages.forEach((stage, index) => {
    parts += stage.draw(shift, top, S);
    // 화살표 좌표는 0~1(가로 W·세로 H 기준) — 직사각형 종이도 가로 크기 하나로 그린다
    if (stage.arrow) parts += foldArrowSvg({ x: stage.arrow.from.x, y: stage.arrow.from.y * H / W }, { x: stage.arrow.to.x, y: stage.arrow.to.y * H / W }, shift, top, W);
    parts += foldCaptionSvg(shift + W / 2, top + H + 22, stage.index ?? index, stage.extra || "");
    shift += W + 12;
    if (index < stages.length - 1) { parts += foldStepArrowSvg(shift, top + H / 2); shift += gap; }
  });
  const width = shift + 6;
  return `<svg class="${cls}" ${foldNumberWidthStyle(width, Math.max(W, H))} viewBox="0 0 ${width} ${H + 16 + FOLD_CAPTION_SPACE}" role="img" aria-label="${label}">${parts}</svg>`;
}
let foldClipSeq = 0;
// 접힌 모양(다각형, 0~1 좌표) 색종이 — 안쪽에만 칸 점선과 수(rows)를 그린다
export function foldNumberPolygonSvg(polygon, { shift, top, S, N = 4, rows = null, font = 18 }) {
  const id = `fnp${++foldClipSeq}`;
  const pts = polygon.map((p) => `${(shift + p.x * S).toFixed(1)},${(top + p.y * S).toFixed(1)}`).join(" ");
  const cell = S / N;
  let inner = "";
  for (let k = 1; k < N; k += 1) {
    inner += `<line x1="${shift + k * cell}" y1="${top}" x2="${shift + k * cell}" y2="${top + S}" stroke="#e0aaa4" stroke-dasharray="3 2"/>`;
    inner += `<line x1="${shift}" y1="${top + k * cell}" x2="${shift + S}" y2="${top + k * cell}" stroke="#e0aaa4" stroke-dasharray="3 2"/>`;
  }
  if (rows) for (let r = 0; r < N; r += 1) for (let c = 0; c < N; c += 1) {
    inner += `<text x="${shift + c * cell + cell / 2}" y="${top + r * cell + cell / 2 + font * 0.34}" text-anchor="middle" font-size="${font}" font-weight="700" fill="#333">${rows[r][c]}</text>`;
  }
  return `<defs><clipPath id="${id}"><polygon points="${pts}"/></clipPath></defs><polygon points="${pts}" fill="#f9c8c4"/><g clip-path="url(#${id})">${inner}</g><polygon points="${pts}" fill="none" stroke="#e8968f" stroke-width="2"/>`;
}
// 접는 선(점선) — 칸 단위 좌표
export const foldCreaseSvg = (x1, y1, x2, y2) => `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#d4756c" stroke-width="1.8" stroke-dasharray="6 5"/>`;
export const FOLD_CAPTION_SPACE = 24;
export function foldCaptionSvg(cx, y, index, extra = "") {
  const words = index === 0 ? "처음" : `${index}번 접음`;
  return `<text x="${cx.toFixed(1)}" y="${y.toFixed(1)}" font-size="13" font-weight="800" text-anchor="middle" fill="#7a4a44" font-family="'Noto Sans KR',sans-serif">${extra ? `${words} · ${extra}` : words}</text>`;
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
    parts += foldStageSvg(stage.polygon, { shift, top: 6, size, index, fold: stage.fold }) + foldCaptionSvg(shift + size / 2, 6 + size + 22, index, stage.fold ? "" : "자르기");
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
  return `<svg class="fold-pieces-svg" ${foldWidthStyle(shift + 6, size)} viewBox="0 0 ${shift + 6} ${size + 16 + FOLD_CAPTION_SPACE}" role="img" aria-label="색종이 접어 자르기 조각 개수 문제">${parts}</svg>`;
}

export function foldTwoDiagonalGridMarkup(visual) {
  const { clip, foldArrow } = foldGeometryHelpers();
  const keep = { d1: (point) => point.x - point.y, d2: (point) => 1 - point.x - point.y };
  const square = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
  const first = clip(square, keep[visual.directions[0]]);
  const folded = clip(first, keep[visual.directions[1]]);
  const S = 120;
  const { foldLine } = foldGeometryHelpers();
  const line = (dir, x, y, polygon) => { const seg = foldLine(polygon, dir); return seg ? foldCreaseSvg(x + seg[0].x * S, y + seg[0].y * S, x + seg[1].x * S, y + seg[1].y * S) : ""; };
  return foldNumberStrip([
    { draw: (x, y) => foldNumberPolygonSvg(square, { shift: x, top: y, S, rows: visual.grid }) + line(visual.directions[0], x, y, square), arrow: foldArrow(square, visual.directions[0]) || null },
    { draw: (x, y) => foldNumberPolygonSvg(first, { shift: x, top: y, S }) + line(visual.directions[1], x, y, first), arrow: foldArrow(first, visual.directions[1]) || null },
    { draw: (x, y) => foldNumberPolygonSvg(folded, { shift: x, top: y, S }) + `<circle cx="${x + visual.target.x * S}" cy="${y + visual.target.y * S}" r="8" fill="#b03a5b"/>`, extra: "자르기" }
  ], { S, label: "수가 쓰인 색종이를 대각선으로 두 번 접어 자르기", cls: "fold-two-diagonal-svg" });
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
    let piece = foldStageSvg(stage.polygon, { shift, top: 4, size: SIZE, index, fold: stage.fold });
    piece += foldCaptionSvg(shift + SIZE / 2, 4 + SIZE + 20, index, stage.fold ? "" : "구멍");
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

  return `<svg class="paper-fold-svg" ${foldWidthStyle(width, SIZE)} viewBox="0 0 ${width} ${SIZE + 8 + FOLD_CAPTION_SPACE}" role="img" aria-label="색종이 접기 문제">${parts}</svg>`;
}

// ── 말로 정한 접기(「아래로」「왼쪽으로」, 대각선)를 기준 흐름 한 줄로(원장 2026-11-21) ──
// 접는 선은 지금 접힌 모양의 가운데(가로·세로) 또는 대각선, 남는 쪽은 말 그대로. 마지막 장면에 final(shift, top, size, polygon, box)을 더 그린다.
const bboxOf = (poly) => {
  const xs = poly.map((p) => p.x);
  const ys = poly.map((p) => p.y);
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
};
function foldWordLine(word, box) {
  const mx = (box.x0 + box.x1) / 2;
  const my = (box.y0 + box.y1) / 2;
  if (word === "아래로") return { a: { x: box.x0, y: my }, b: { x: box.x1, y: my }, keepPoint: { x: mx, y: box.y1 } };
  if (word === "위로") return { a: { x: box.x0, y: my }, b: { x: box.x1, y: my }, keepPoint: { x: mx, y: box.y0 } };
  if (word === "왼쪽으로") return { a: { x: mx, y: box.y0 }, b: { x: mx, y: box.y1 }, keepPoint: { x: box.x0, y: my } };
  if (word === "오른쪽으로") return { a: { x: mx, y: box.y0 }, b: { x: mx, y: box.y1 }, keepPoint: { x: box.x1, y: my } };
  if (word === "대각선-내림") return { a: { x: box.x0, y: box.y0 }, b: { x: box.x1, y: box.y1 }, keepPoint: { x: box.x0, y: box.y1 } };
  if (word === "대각선-오름") return { a: { x: box.x0, y: box.y1 }, b: { x: box.x1, y: box.y0 }, keepPoint: { x: box.x0, y: box.y0 } };
  return null;
}
const sideOf = (line, p) => (line.b.x - line.a.x) * (p.y - line.a.y) - (line.b.y - line.a.y) * (p.x - line.a.x);
const reflect = (line, p) => {
  const dx = line.b.x - line.a.x;
  const dy = line.b.y - line.a.y;
  const t = ((p.x - line.a.x) * dx + (p.y - line.a.y) * dy) / (dx * dx + dy * dy);
  const fx = line.a.x + t * dx;
  const fy = line.a.y + t * dy;
  return { x: 2 * fx - p.x, y: 2 * fy - p.y };
};
// after: 다 접은 장면 뒤에 회색 화살표 + 한 장면 더(펼친 모양 등) — after(x, top, size)가 그림을, afterCaption이 장면 이름을(2과정 개념 꾸러미, 원장 2026-11-23 「접는 과정을 보여 주던지 화살표로」)
export function foldWordStrip(words, { final = () => "", finalExtra = "", label = "", cls = "fold-pieces-svg", after = null, afterCaption = "" } = {}) {
  const { clip } = foldGeometryHelpers();
  const size = 100;
  const top = 6;
  const gap = 34;
  let poly = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
  let shift = 6;
  let parts = "";
  const at = (p) => `${(shift + p.x * size).toFixed(1)},${(top + p.y * size).toFixed(1)}`;
  words.forEach((word, index) => {
    const line = foldWordLine(word, bboxOf(poly));
    const sign = Math.sign(sideOf(line, line.keepPoint)) || 1;
    const keep = (p) => sign * sideOf(line, p);
    const away = clip(poly, (p) => -keep(p));
    parts += foldStageSvg(poly, { shift, top, size }) + foldCaptionSvg(shift + size / 2, top + size + 22, index);
    // 접는 선: 접는 선이 지금 모양을 가로지르는 두 점
    const hits = [];
    for (let i = 0; i < poly.length; i += 1) {
      const a = poly[i]; const b = poly[(i + 1) % poly.length];
      const da = sideOf(line, a); const db = sideOf(line, b);
      if (Math.abs(da) < 1e-9) hits.push(a);
      if ((da > 1e-9 && db < -1e-9) || (da < -1e-9 && db > 1e-9)) { const t = da / (da - db); hits.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }); }
    }
    if (hits.length >= 2) parts += `<line x1="${at(hits[0]).split(",")[0]}" y1="${at(hits[0]).split(",")[1]}" x2="${at(hits[hits.length - 1]).split(",")[0]}" y2="${at(hits[hits.length - 1]).split(",")[1]}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 5"/>`;
    if (away.length >= 3) {
      const from = { x: away.reduce((t, p) => t + p.x, 0) / away.length, y: away.reduce((t, p) => t + p.y, 0) / away.length };
      parts += foldArrowSvg(from, reflect(line, from), shift, top, size);
    }
    poly = clip(poly, keep);
    shift += size + 12;
    parts += foldStepArrowSvg(shift, top + size / 2);
    shift += gap;
  });
  parts += foldStageSvg(poly, { shift, top, size }) + final(shift, top, size, poly, bboxOf(poly)) + foldCaptionSvg(shift + size / 2, top + size + 22, words.length, finalExtra);
  shift += size + 12;
  if (after) {
    parts += foldStepArrowSvg(shift, top + size / 2);
    shift += gap;
    parts += after(shift, top, size) + `<text x="${(shift + size / 2).toFixed(1)}" y="${(top + size + 22).toFixed(1)}" font-size="13" font-weight="800" text-anchor="middle" fill="#7a4a44" font-family="'Noto Sans KR',sans-serif">${afterCaption}</text>`;
    shift += size + 12;
  }
  return `<svg class="${cls}" ${foldWidthStyle(shift + 6, size)} viewBox="0 0 ${shift + 6} ${size + 16 + FOLD_CAPTION_SPACE}" role="img" aria-label="${label}">${parts}</svg>`;
}
