(() => {
  "use strict";

  const api = window.HSE_GENERATORS;
  if (!api) throw new Error("6-1 겉넓이 생성기를 불러오지 못했습니다.");

  const ids = [
    "6-1-u6-e1-exploration", "6-1-u6-e1-example-1", "6-1-u6-e1-example-2",
    "6-1-u6-e1-example-3", "6-1-u6-e1-example-4", "6-1-u6-e1-mission-1",
    "6-1-u6-e1-mission-2", "6-1-u6-e1-mission-3", "6-1-u6-e1-mission-4",
    "6-1-u6-e1-mission-5", "6-1-u6-e1-mission-6"
  ];
  const dirs = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  const key = p => Array.isArray(p) ? p.join(",") : String(p);
  const esc = value => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
  const num = value => Number(value).toLocaleString("ko-KR");
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const fractionText = (n, d) => {
    const g = gcd(n, d);
    const a = n / g;
    const b = d / g;
    return b === 1 ? String(a) : `${a}/${b}`;
  };
  const fractionMarkup = (n, d) => {
    const g = gcd(n, d);
    const a = n / g;
    const b = d / g;
    if (b === 1) return String(a);
    return `<span class="math-fraction" role="img" aria-label="${b}분의 ${a}"><span>${a}</span><span>${b}</span></span>`;
  };

  const surfaceCells = (size, removed = []) => {
    const gone = new Set(removed.map(key));
    let exposed = 0;
    for (let z = 0; z < size; z += 1) for (let y = 0; y < size; y += 1) for (let x = 0; x < size; x += 1) {
      const p = [x, y, z];
      if (gone.has(key(p))) continue;
      for (const [dx, dy, dz] of dirs) {
        const q = [x + dx, y + dy, z + dz];
        if (q.some(value => value < 0 || value >= size) || gone.has(key(q))) exposed += 1;
      }
    }
    return exposed;
  };
  const surfaceSet = cells => {
    const present = new Set(cells.map(key));
    let exposed = 0;
    for (const [x, y, z] of cells) for (const [dx, dy, dz] of dirs) if (!present.has(key([x + dx, y + dy, z + dz]))) exposed += 1;
    return exposed;
  };
  const hasNeighbor = (p, cells) => dirs.some(([dx, dy, dz]) => cells.has(key([p[0] + dx, p[1] + dy, p[2] + dz])));
  const rotate = (cells, turn) => cells.map(([x, y, z]) => {
    if (turn === 1) return [2 - y, x, z];
    if (turn === 2) return [2 - x, 2 - y, z];
    return [x, y, z];
  });

  const box = (x, y, z, w, d, h, role = "solid", divisions = null) => ({ x, y, z, w, d, h, role, divisions });
  const contactArea = (a, b) => {
    const overlap = (a0, a1, b0, b1) => Math.max(0, Math.min(a1, b1) - Math.max(a0, b0));
    if (a.x + a.w === b.x || b.x + b.w === a.x) return overlap(a.y, a.y + a.d, b.y, b.y + b.d) * overlap(a.z, a.z + a.h, b.z, b.z + b.h);
    if (a.y + a.d === b.y || b.y + b.d === a.y) return overlap(a.x, a.x + a.w, b.x, b.x + b.w) * overlap(a.z, a.z + a.h, b.z, b.z + b.h);
    if (a.z + a.h === b.z || b.z + b.h === a.z) return overlap(a.x, a.x + a.w, b.x, b.x + b.w) * overlap(a.y, a.y + a.d, b.y, b.y + b.d);
    return 0;
  };
  const boxesSurface = boxes => {
    const isolated = boxes.reduce((sum, item) => sum + 2 * (item.w * item.d + item.w * item.h + item.d * item.h), 0);
    let contacts = 0;
    for (let i = 0; i < boxes.length; i += 1) for (let j = i + 1; j < boxes.length; j += 1) contacts += contactArea(boxes[i], boxes[j]);
    return { isolated, contacts, surface: isolated - 2 * contacts };
  };
  const triangularBoxes = (s, lowerGap, middleGap = lowerGap) => {
    const bottom = [0, s + lowerGap, 2 * (s + lowerGap)].map(x => box(x, 0, 0, s, s, s, "bottom-cube"));
    const middle = [
      (s + lowerGap) / 2,
      (s + lowerGap) / 2 + s + middleGap
    ].map(x => box(x, 0, s, s, s, s, "middle-cube"));
    const top = box(middle[0].x + (s + middleGap) / 2, 0, 2 * s, s, s, s, "top-cube");
    return [...bottom, ...middle, top];
  };

  const explorationBase = [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 2, 0], [1, 2, 0], [0, 1, 1], [1, 1, 1], [2, 2, 1], [0, 0, 2], [1, 0, 2], [2, 2, 2]];
  const explorationPools = [explorationBase, rotate(explorationBase, 1), rotate(explorationBase, 2)];
  const mission1Pools = [
    {
      maxCells: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0], [4, 0, 0], [5, 0, 0], [6, 0, 0], [7, 0, 0]],
      minCells: [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]]
    },
    {
      maxCells: [[0, 0, 0], [0, 1, 0], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0]],
      minCells: [[0, 0, 0], [0, 1, 0], [1, 0, 0], [1, 1, 0], [0, 0, 1], [0, 1, 1], [1, 0, 1], [1, 1, 1]]
    },
    {
      maxCells: [[0, 0, 0], [0, 0, 1], [0, 0, 2], [0, 0, 3], [0, 0, 4], [0, 0, 5], [0, 0, 6], [0, 0, 7]],
      minCells: [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]]
    }
  ];
  const mission5Base = [[0, 0, 1], [0, 1, 0], [0, 1, 1], [1, 0, 0], [1, 0, 1], [1, 1, 0], [1, 1, 1], [0, 0, 2]];
  const mission5Pools = [
    mission5Base,
    mission5Base.map(([x, y, z]) => [z, y, x]),
    mission5Base.map(([x, y, z]) => [y, z, x])
  ];

  const iso = (b, ox = 50, oy = 190, sx = 10, sy = 7) => {
    const p = (x, y, z) => ({ x: ox + (x - y) * sx, y: oy + (x + y) * sy - z * sy * 1.35 });
    const c = [p(b.x, b.y, b.z + b.h), p(b.x + b.w, b.y, b.z + b.h), p(b.x + b.w, b.y + b.d, b.z + b.h), p(b.x, b.y + b.d, b.z + b.h)];
    const f = [p(b.x, b.y + b.d, b.z), p(b.x + b.w, b.y + b.d, b.z), c[2], c[3]];
    const s = [p(b.x + b.w, b.y, b.z), p(b.x + b.w, b.y + b.d, b.z), c[2], c[1]];
    const poly = values => values.map(v => `${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(" ");
    const cls = `source61-surface-e1-face ${b.role || ""}`;
    const lines = [];
    const divisions = b.divisions;
    if (divisions) {
      const [nx, ny, nz] = divisions;
      for (let i = 1; i < nx; i += 1) {
        const x = b.x + b.w * i / nx;
        lines.push(`<line class="source61-surface-e1-grid-line" x1="${p(x, b.y, b.z + b.h).x.toFixed(1)}" y1="${p(x, b.y, b.z + b.h).y.toFixed(1)}" x2="${p(x, b.y + b.d, b.z + b.h).x.toFixed(1)}" y2="${p(x, b.y + b.d, b.z + b.h).y.toFixed(1)}"/>`);
      }
      for (let j = 1; j < ny; j += 1) {
        const y = b.y + b.d * j / ny;
        lines.push(`<line class="source61-surface-e1-grid-line" x1="${p(b.x, y, b.z + b.h).x.toFixed(1)}" y1="${p(b.x, y, b.z + b.h).y.toFixed(1)}" x2="${p(b.x + b.w, y, b.z + b.h).x.toFixed(1)}" y2="${p(b.x + b.w, y, b.z + b.h).y.toFixed(1)}"/>`);
      }
      for (let i = 1; i < nx; i += 1) {
        const x = b.x + b.w * i / nx;
        lines.push(`<line class="source61-surface-e1-grid-line" x1="${p(x, b.y + b.d, b.z).x.toFixed(1)}" y1="${p(x, b.y + b.d, b.z).y.toFixed(1)}" x2="${p(x, b.y + b.d, b.z + b.h).x.toFixed(1)}" y2="${p(x, b.y + b.d, b.z + b.h).y.toFixed(1)}"/>`);
      }
      for (let k = 1; k < nz; k += 1) {
        const z = b.z + b.h * k / nz;
        lines.push(`<line class="source61-surface-e1-grid-line" x1="${p(b.x, b.y + b.d, z).x.toFixed(1)}" y1="${p(b.x, b.y + b.d, z).y.toFixed(1)}" x2="${p(b.x + b.w, b.y + b.d, z).x.toFixed(1)}" y2="${p(b.x + b.w, b.y + b.d, z).y.toFixed(1)}"/>`);
      }
      for (let j = 1; j < ny; j += 1) {
        const y = b.y + b.d * j / ny;
        lines.push(`<line class="source61-surface-e1-grid-line" x1="${p(b.x + b.w, y, b.z).x.toFixed(1)}" y1="${p(b.x + b.w, y, b.z).y.toFixed(1)}" x2="${p(b.x + b.w, y, b.z + b.h).x.toFixed(1)}" y2="${p(b.x + b.w, y, b.z + b.h).y.toFixed(1)}"/>`);
      }
      for (let k = 1; k < nz; k += 1) {
        const z = b.z + b.h * k / nz;
        lines.push(`<line class="source61-surface-e1-grid-line" x1="${p(b.x + b.w, b.y, z).x.toFixed(1)}" y1="${p(b.x + b.w, b.y, z).y.toFixed(1)}" x2="${p(b.x + b.w, b.y + b.d, z).x.toFixed(1)}" y2="${p(b.x + b.w, b.y + b.d, z).y.toFixed(1)}"/>`);
      }
    }
    return `<polygon class="${cls}" points="${poly(c)}" data-visual-element="top-face"/><polygon class="${cls}" points="${poly(f)}" data-visual-element="front-face"/><polygon class="${cls}" points="${poly(s)}" data-visual-element="side-face"/>${lines.join("")}`;
  };
  const visibleVoxelFaces = (b, present, ox, oy, sx, sy) => {
    const p = (x, y, z) => ({ x: ox + (x - y) * sx, y: oy + (x + y) * sy - z * sy * 1.35 });
    const poly = values => values.map(value => `${value.x.toFixed(1)},${value.y.toFixed(1)}`).join(" ");
    const cls = `source61-surface-e1-face ${b.role || "unit-cube"}`;
    const faces = [];
    if (!present.has(key([b.x, b.y, b.z + 1]))) {
      faces.push(`<polygon class="${cls}" points="${poly([p(b.x, b.y, b.z + 1), p(b.x + 1, b.y, b.z + 1), p(b.x + 1, b.y + 1, b.z + 1), p(b.x, b.y + 1, b.z + 1)])}" data-visual-element="top-face"/>`);
    }
    if (!present.has(key([b.x, b.y + 1, b.z]))) {
      faces.push(`<polygon class="${cls}" points="${poly([p(b.x, b.y + 1, b.z), p(b.x + 1, b.y + 1, b.z), p(b.x + 1, b.y + 1, b.z + 1), p(b.x, b.y + 1, b.z + 1)])}" data-visual-element="front-face"/>`);
    }
    if (!present.has(key([b.x + 1, b.y, b.z]))) {
      faces.push(`<polygon class="${cls}" points="${poly([p(b.x + 1, b.y, b.z), p(b.x + 1, b.y + 1, b.z), p(b.x + 1, b.y + 1, b.z + 1), p(b.x + 1, b.y, b.z + 1)])}" data-visual-element="side-face"/>`);
    }
    return faces.join("");
  };
  const fittedProjection = (boxes, width = 640, height = 360, padding = 30) => {
    const ratio = 9 / 14;
    const projected = [];
    for (const b of boxes) {
      for (const x of [b.x, b.x + b.w]) for (const y of [b.y, b.y + b.d]) for (const z of [b.z, b.z + b.h]) {
        projected.push({ x: x - y, y: (x + y) * ratio - z * ratio * 1.35 });
      }
    }
    if (!projected.length) return { sx: 1, sy: ratio, ox: width / 2, oy: height / 2, width, height };
    const minX = Math.min(...projected.map(point => point.x));
    const maxX = Math.max(...projected.map(point => point.x));
    const minY = Math.min(...projected.map(point => point.y));
    const maxY = Math.max(...projected.map(point => point.y));
    const rawWidth = Math.max(1, maxX - minX);
    const rawHeight = Math.max(1, maxY - minY);
    const scale = Math.min((width - padding * 2) / rawWidth, (height - padding * 2) / rawHeight);
    const geometryWidth = rawWidth * scale;
    const geometryHeight = rawHeight * scale;
    return {
      sx: scale,
      sy: scale * ratio,
      ox: (width - geometryWidth) / 2 - minX * scale,
      oy: (height - geometryHeight) / 2 - minY * scale,
      width,
      height
    };
  };
  const normalizeBoxes = boxes => {
    const minX = Math.min(...boxes.map(b => b.x));
    const minY = Math.min(...boxes.map(b => b.y));
    const minZ = Math.min(...boxes.map(b => b.z));
    return boxes.map(b => ({ ...b, x: b.x - minX, y: b.y - minY, z: b.z - minZ }));
  };
  const viewDepth = b => (b.x + b.w / 2) + (b.y + b.d / 2) + (b.z + b.h / 2);
  const boxSvg = (boxes, solved, answer, note = "") => {
    const normalized = normalizeBoxes(boxes);
    const sorted = [...normalized].sort((a, b) => viewDepth(a) - viewDepth(b));
    const fit = fittedProjection(sorted);
    const all = sorted.map(b => iso({ ...b, role: `${b.role || "solid"}${solved ? " is-solved" : ""}` }, fit.ox, fit.oy, fit.sx, fit.sy)).join("");
    return `<svg class="geometry-diagram source61-surface-e1-diagram" viewBox="0 0 ${fit.width.toFixed(1)} ${fit.height.toFixed(1)}" role="img" aria-label="${esc(note || "직육면체 겉넓이 도형")}" data-model="continuous-boxes">${all}</svg>`;
  };
  const voxelSvg = (size, removed, solved, answer, note, options = {}) => {
    const { presentOverride = null, showRemovedShape = true } = options;
    const cells = [];
    const present = presentOverride || [];
    const selected = present.length ? new Set(present.map(key)) : null;
    for (let z = 0; z < size; z += 1) for (let y = 0; y < size; y += 1) for (let x = 0; x < size; x += 1) {
      const cellKey = key([x, y, z]);
      if (selected ? !selected.has(cellKey) : (solved || showRemovedShape) && removed.has(cellKey)) continue;
      const newlyExposed = solved && [...dirs].some(([dx, dy, dz]) => removed.has(key([x + dx, y + dy, z + dz])));
      cells.push(box(x, y, z, 1, 1, 1, `unit-cube${newlyExposed ? " newly-exposed" : ""}`));
    }
    const normalized = cells.sort((a, b) => viewDepth(a) - viewDepth(b));
    const presentCells = new Set(normalized.map(cell => key([cell.x, cell.y, cell.z])));
    const fit = fittedProjection(normalized, 560, 360, 34);
    const all = normalized.map(b => visibleVoxelFaces({ ...b, role: `${b.role}${solved ? " is-solved" : ""}` }, presentCells, fit.ox, fit.oy, fit.sx, fit.sy)).join("");
    return `<svg class="geometry-diagram source61-surface-e1-diagram" viewBox="0 0 ${fit.width.toFixed(1)} ${fit.height.toFixed(1)}" role="img" aria-label="${esc(note)}" data-model="voxel-grid" data-removed="${esc([...removed].join("|"))}">${all}</svg>`;
  };
  const tunnelSvg = (side, hole, solved, answer, note) => {
    const fit = fittedProjection([box(0, 0, 0, side, side, side)], 600, 380, 48);
    const point = (x, y, z) => ({ x: fit.ox + (x - y) * fit.sx, y: fit.oy + (x + y) * fit.sy - z * fit.sy * 1.35 });
    const points = values => values.map(value => `${value.x.toFixed(1)},${value.y.toFixed(1)}`).join(" ");
    const outer = {
      top: [point(0, 0, side), point(side, 0, side), point(side, side, side), point(0, side, side)],
      front: [point(0, side, 0), point(side, side, 0), point(side, side, side), point(0, side, side)],
      side: [point(side, 0, 0), point(side, side, 0), point(side, side, side), point(side, 0, side)]
    };
    const start = (side - hole) / 2;
    const end = start + hole;
    const openings = {
      top: [point(start, start, side), point(end, start, side), point(end, end, side), point(start, end, side)],
      front: [point(start, side, start), point(end, side, start), point(end, side, end), point(start, side, end)],
      side: [point(side, start, start), point(side, end, start), point(side, end, end), point(side, start, end)]
    };
    const faces = ["front", "side", "top"].map(name => `<polygon class="source61-surface-e1-tunnel-face ${name}" points="${points(outer[name])}"/>`).join("");
    const holes = ["front", "side", "top"].map(name => `<polygon class="source61-surface-e1-hole ${solved ? "is-solved" : ""}" points="${points(openings[name])}" data-visual-element="${name}-center-hole"/>`).join("");
    return `<svg class="geometry-diagram source61-surface-e1-diagram source61-surface-e1-tunnel" viewBox="0 0 ${fit.width} ${fit.height}" role="img" aria-label="${esc(note)}" data-model="continuous-centered-three-tunnels" data-side="${side}" data-hole="${hole}">${faces}${holes}<text class="source61-surface-e1-measure" x="24" y="30">한 모서리 ${esc(side)}cm · 구멍 한 변 ${esc(hole)}cm</text></svg>`;
  };
  const layerMapSvg = (cells, note) => {
    const present = new Set(cells.map(key));
    const cell = 34;
    const starts = [42, 246, 450];
    const labels = ["아래층", "가운데층", "위층"];
    const body = [];
    for (let z = 0; z < 3; z += 1) {
      body.push(`<text class="source61-surface-e1-layer-label" x="${starts[z] + cell * 1.5}" y="30" text-anchor="middle">${labels[z]}</text>`);
      for (let y = 0; y < 3; y += 1) for (let x = 0; x < 3; x += 1) {
        body.push(`<rect class="source61-surface-e1-layer-cell${present.has(key([x, y, z])) ? " is-present" : ""}" x="${starts[z] + x * cell}" y="${48 + y * cell}" width="${cell}" height="${cell}"/>`);
      }
    }
    return `<svg class="geometry-diagram source61-surface-e1-diagram source61-surface-e1-layer-map" viewBox="0 0 594 178" role="img" aria-label="${esc(note)}" data-model="three-layer-map">${body.join("")}</svg>`;
  };
  const comparisonVoxelSvg = (groups, solved, answer, note) => {
    const render = (cells, ox, label) => {
      const boxes = cells.map(([x, y, z]) => box(x, y, z, 1, 1, 1, `unit-cube${solved ? " is-solved" : ""}`));
      const sorted = boxes.sort((a, b) => viewDepth(a) - viewDepth(b));
      const present = new Set(sorted.map(cell => key([cell.x, cell.y, cell.z])));
      return `<text class="source61-surface-e1-label" x="${ox}" y="35" text-anchor="middle">${esc(label)}</text>${sorted.map(b => visibleVoxelFaces(b, present, ox, 235, 12, 8)).join("")}`;
    };
    const body = render(groups[0].cells, 175, groups[0].label) + render(groups[1].cells, 465, groups[1].label);
    return `<svg class="geometry-diagram source61-surface-e1-diagram" viewBox="0 0 640 320" role="img" aria-label="${esc(note)}" data-model="voxel-comparison">${body}</svg>`;
  };
  const looseCubesSvg = (count, note) => {
    const cubes = Array.from({ length: count }, (_, index) => {
      const column = index % 4;
      const row = Math.floor(index / 4);
      return iso(box(0, 0, 0, 1, 1, 1, "unit-cube"), 95 + column * 145, 90 + row * 115, 30, 20);
    }).join("");
    return `<svg class="geometry-diagram source61-surface-e1-diagram" viewBox="0 0 640 250" role="img" aria-label="${esc(note)}" data-model="loose-cubes">${cubes}</svg>`;
  };
  const separateCubeSizesSvg = (scale, note) => boxSvg([
    box(0, 0, 0, scale, scale, scale, "small"),
    box(3 * scale, 0, 0, 2 * scale, 2 * scale, 2 * scale, "middle"),
    box(8 * scale, 0, 0, 3 * scale, 3 * scale, 3 * scale, "large")
  ], false, "", note);
  const result = (prompt, answer, solution, answerVisual, sourceItemId, poolIndex, verifiedVariantCount = 3, meta = {}) => ({ prompt, answer: String(answer), solution, answerVisual, generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex, verifiedVariantCount, sourceItemId, ...meta });

  const generateOne = (kind, p, solved, poolIndex) => {
    if (kind === "exploration") {
      const remaining = new Set(p.map(key));
      const removed = new Set();
      for (let z = 0; z < 3; z += 1) for (let y = 0; y < 3; y += 1) for (let x = 0; x < 3; x += 1) if (!remaining.has(key([x, y, z]))) removed.add(key([x, y, z]));
      const answer = "16개";
      const visual = solved
        ? `<div class="source61-surface-e1-answer">${voxelSvg(3, removed, true, answer, "작은 정육면체 11개가 남은 한 가지 방법", { presentOverride: p })}${layerMapSvg(p, "남은 작은 정육면체 11개의 층별 위치")}</div>`
        : voxelSvg(3, new Set(), false, answer, "작은 정육면체 27개로 만든 3×3×3 정육면체");
      return { answer, visual, prompt: `3×3×3 정육면체를 만들고 일부 정육면체를 덜어 냅니다. 남은 정육면체는 각각 적어도 한 면이 다른 정육면체와 붙어 있고, 새 도형의 겉넓이는 처음과 같습니다. 덜어 낼 수 있는 정육면체는 최대 몇 개인가요? ${visual}`, solution: `10개를 남기면 모든 정육면체에 이웃이 있어야 하므로 맞닿은 면이 적어도 5곳입니다. 이때 겉넓이는 많아도 6×10-2×5=50cm²이고, 더 적게 남기면 50cm²보다 커질 수 없습니다. 답 그림처럼 11개를 남기면 맞닿은 면이 6곳이고 겉넓이는 6×11-2×6=54cm²입니다. 따라서 최대 27-11=${answer}를 덜어 낼 수 있습니다.` };
    }
    if (kind === "example-1") {
      const s = p.scale;
      const maxBoxes = [box(0, 0, 0, s, s, s, "small"), box(-2 * s, -s, -s, 2 * s, 2 * s, 2 * s, "middle"), box(0, -2 * s, s, 3 * s, 3 * s, 3 * s, "large")];
      const minBoxes = [box(0, 0, 0, s, s, s, "small"), box(-2 * s, -s, -s, 2 * s, 2 * s, 2 * s, "middle"), box(-2 * s, -2 * s, s, 3 * s, 3 * s, 3 * s, "large")];
      const max = boxesSurface(maxBoxes).surface;
      const min = boxesSurface(minBoxes).surface;
      const answer = `최대 ${num(max)}cm², 최소 ${num(min)}cm²`;
      const visual = solved
        ? `<div class="source61-surface-e1-comparison"><div><strong>가장 큰 경우</strong>${boxSvg(maxBoxes, true, `${num(max)}cm²`, "가장 큰 겉넓이가 되는 배치")}</div><div><strong>가장 작은 경우</strong>${boxSvg(minBoxes, true, `${num(min)}cm²`, "가장 작은 겉넓이가 되는 배치")}</div></div>`
        : separateCubeSizesSvg(s, "서로 붙이기 전의 크기가 다른 정육면체 세 개");
      return { answer, visual, prompt: `한 모서리의 길이가 ${s}cm, ${2 * s}cm, ${3 * s}cm인 정육면체가 각각 1개씩 있습니다. 면과 면이 맞닿도록 만들 때 겉넓이의 가장 큰 경우와 가장 작은 경우를 구하세요. ${visual}`, solution: `겉넓이의 합에서 맞닿은 면을 두 번씩 뺍니다. 가장 큰 경우는 맞닿은 면의 넓이가 ${s * s}cm²씩 2곳, 가장 작은 경우는 ${s * s}cm²와 ${4 * s * s}cm²가 맞닿습니다. ${answer}입니다.` };
    }
    if (kind === "example-2") {
      const boxes = triangularBoxes(p.side, p.lowerGap, p.middleGap);
      const surface = boxesSurface(boxes).surface;
      const answer = `${num(surface)}cm²`;
      const visual = boxSvg(boxes, solved, answer, "간격이 있는 정육면체 여섯 개");
      return { answer, visual, prompt: `한 모서리의 길이가 ${p.side}cm인 정육면체 6개를 그림과 같이 쌓았습니다. 아래층의 간격은 ${p.lowerGap}cm이고 가운데층의 간격은 ${p.middleGap}cm입니다. 겉넓이를 구하세요. ${visual}`, solution: `정육면체 6개를 따로 놓았을 때의 겉넓이에서 서로 맞닿은 부분을 두 번씩 뺍니다. 아래층과 가운데층은 4곳, 가운데층과 위층은 2곳이 맞닿고, 맞닿은 넓이의 합은 ${boxesSurface(boxes).contacts}cm²입니다. 따라서 겉넓이는 ${answer}입니다.` };
    }
    if (kind === "example-3") {
      const unit = p.side / 3;
      const area = 6 * p.side * p.side + 12 * p.side * unit - 18 * unit * unit;
      const answer = `${num(area)}cm²`;
      const visual = tunnelSvg(p.side, unit, solved, answer, `${p.side}cm 정육면체의 각 면 중심을 세 방향으로 관통한 ${unit}cm 정사각형 구멍`);
      return { answer, visual, prompt: `한 모서리의 길이가 ${p.side}cm인 정육면체의 각 면 중심을 한 변 ${unit}cm인 정사각형 구멍으로 세 방향 관통했습니다. 겉넓이를 구하세요. ${visual}`, solution: `바깥쪽 여섯 면에서 구멍 6개의 넓이를 빼고, 세 구멍의 안쪽 벽 넓이를 더합니다. 세 구멍이 가운데에서 겹치는 부분은 한 번만 세어 정리하면 6×${p.side}²+12×${p.side}×${unit}-18×${unit}²=${answer}입니다.` };
    }
    if (kind === "example-4") {
      const ratio = (p.nx + p.ny + p.nz) / 3;
      const answer = `${ratio}배`;
      const visual = boxSvg([box(0, 0, 0, p.side, p.side, p.side, "partitioned-solid", [p.nx, p.ny, p.nz])], solved, answer, `정육면체를 ${p.nx}·${p.ny}·${p.nz}칸으로 나눈 모습`);
      return { answer, visual, prompt: `정육면체를 가로로 ${p.nx}등분, 세로로 ${p.ny}등분, 높이로 ${p.nz}등분하여 작은 직육면체로 나누었습니다. 작은 직육면체들의 겉넓이의 합은 처음 정육면체의 몇 배인가요? ${visual}`, solution: `가로·세로·높이 방향으로 생기는 면을 각각 세면, 작은 직육면체들의 겉넓이 합과 처음 겉넓이의 비는 (${p.nx}+${p.ny}+${p.nz})÷3=${ratio}입니다. 따라서 ${answer}입니다.` };
    }
    if (kind === "mission-1") {
      const maxCells = p.maxCells;
      const minCells = p.minCells;
      const max = surfaceSet(maxCells);
      const min = surfaceSet(minCells);
      const answer = `최대 ${max}, 최소 ${min}`;
      const visual = solved
        ? comparisonVoxelSvg([{ cells: maxCells, label: "가장 큰 경우" }, { cells: minCells, label: "가장 작은 경우" }], true, answer, "정육면체 8개를 붙여 만든 가장 큰 경우와 가장 작은 경우")
        : looseCubesSvg(8, "서로 붙이기 전의 쌓기나무 8개");
      return { answer, visual, prompt: `한 모서리의 길이가 1cm인 쌓기나무 8개를 모두 사용하여 겉넓이가 가장 큰 경우와 가장 작은 경우를 각각 구하세요. 면과 면은 맞닿아야 합니다. ${visual}`, solution: `가장 큰 경우는 8개를 한 줄로 붙여 맞닿은 면이 7개라서 48-2×7=34cm²입니다. 가장 작은 경우는 2×2×2 정육면체라서 24cm²입니다. ${answer}cm²입니다.` };
    }
    if (kind === "mission-2") {
      const boxes = triangularBoxes(p.side, p.lowerGap, p.middleGap);
      const surface = boxesSurface(boxes).surface;
      const answer = `${num(surface)}cm²`;
      const visual = boxSvg(boxes, solved, answer, "간격과 부분 접촉이 있는 정육면체 여섯 개");
      return { answer, visual, prompt: `한 모서리의 길이가 ${p.side}cm인 정육면체 6개를 그림과 같이 쌓았습니다. 아래층의 두 간격은 각각 ${p.lowerGap}cm, 가운데층의 간격은 ${p.middleGap}cm입니다. 겉넓이를 구하세요. ${visual}`, solution: `아래층과 가운데층이 맞닿은 넓이는 4×((${p.side}-${p.lowerGap})÷2×${p.side})cm²이고, 가운데층과 위층이 맞닿은 넓이는 2×(((${p.side}-${p.middleGap})÷2)×${p.side})cm²입니다. 정육면체 6개의 겉넓이에서 이 넓이를 두 번씩 빼면 ${answer}입니다.` };
    }
    if (kind === "mission-3") {
      const hole = p.side / 4;
      const area = 6 * p.side * p.side + 12 * p.side * hole - 18 * hole * hole;
      const answer = `${num(area)}cm²`;
      const visual = tunnelSvg(p.side, hole, solved, answer, `${p.side}cm 정육면체의 각 면 중심을 세 방향으로 관통한 ${hole}cm 정사각형 구멍`);
      return { answer, visual, prompt: `한 모서리의 길이가 ${p.side}cm인 정육면체의 각 면 중심을 한 변 ${hole}cm인 정사각형 구멍으로 세 방향 관통했습니다. 겉넓이를 구하세요. ${visual}`, solution: `바깥쪽 여섯 면에서 구멍 6개의 넓이를 빼고, 세 구멍의 안쪽 벽 넓이를 더합니다. 세 구멍이 가운데에서 겹치는 부분은 한 번만 세어 정리하면 6×${p.side}²+12×${p.side}×${hole}-18×${hole}²=${answer}입니다.` };
    }
    if (kind === "mission-4") {
      const unitRemoved = [];
      for (let z = 0; z < 3; z += 1) { unitRemoved.push([1, 0, z], [2, 2, z]); }
      const answer = `${num(surfaceCells(3, unitRemoved) * p.unit * p.unit)}cm²`;
      const visual = voxelSvg(3, new Set(unitRemoved.map(key)), solved, answer, `한 변 ${p.unit}cm 단위 3×3×3 정육면체에서 두 기둥을 제거한 모습`);
      return { answer, visual, prompt: `한 모서리의 길이가 ${3 * p.unit}cm인 정육면체에서 가로·세로 ${p.unit}cm, 높이 ${3 * p.unit}cm인 직육면체 모양 기둥 2개를 그림과 같이 잘라 냈습니다. 겉넓이를 구하세요. ${visual}`, solution: `앞면 가운데와 오른쪽 뒤에서 기둥 모양으로 잘라 낸 뒤, 바깥으로 드러난 작은 정사각형을 세면 56개입니다. 작은 정사각형 한 개의 넓이는 ${p.unit}×${p.unit}cm²이므로 56×${p.unit}²=${answer}입니다.` };
    }
    if (kind === "mission-5") {
      const removed = new Set(p.removed.map(key));
      const answer = `${num(surfaceCells(4, [...removed]) * p.unit * p.unit)}cm²`;
      const visual = voxelSvg(4, removed, solved, answer, "색칠한 쌓기나무 8개를 뺀 입체");
      return { answer, visual, prompt: `한 모서리의 길이가 ${p.unit}cm인 정육면체 모양 쌓기나무를 4×4×4로 쌓은 뒤, 그림과 같이 쌓기나무 8개를 빼냈습니다. 남은 입체의 겉넓이를 구하세요. ${visual}`, solution: `그림과 같이 8개를 빼낸 뒤 바깥으로 드러난 작은 정사각형을 모두 세면 ${surfaceCells(4, [...removed])}개입니다. 작은 정사각형 한 개의 넓이는 ${p.unit}×${p.unit}=${p.unit * p.unit}cm²이므로 ${answer}입니다.` };
    }
    const original = 2 * (p.w * p.d + p.d * p.h + p.w * p.h);
    const pieces = 18 * 6 * p.unit * p.unit;
    const answer = fractionText(pieces, original) + "배";
    const visual = boxSvg([box(0, 0, 0, p.w, p.d, p.h, "partitioned-cuboid", [p.w / p.unit, p.d / p.unit, p.h / p.unit])], solved, answer, `${p.w}×${p.d}×${p.h} 직육면체를 18개 정육면체로 나눈 모습`);
    return { answer, visual, prompt: `가로 ${p.w}cm, 세로 ${p.d}cm, 높이 ${p.h}cm인 직육면체를 한 모서리의 길이가 ${p.unit}cm인 정육면체 18개로 나누었습니다. 작은 정육면체들의 겉넓이의 합은 처음 직육면체의 겉넓이의 몇 배인가요? ${visual}`, solution: `작은 정육면체 겉넓이의 합은 18×6×${p.unit}²=${pieces}cm², 처음 직육면체의 겉넓이는 ${original}cm²입니다. 따라서 ${pieces}÷${original}=${fractionText(pieces, original)}배입니다.` };
  };

  const pools = {
    exploration: explorationPools,
    "example-1": [{ scale: 1 }, { scale: 2 }, { scale: 3 }],
    "example-2": [{ side: 3, lowerGap: 2, middleGap: 2 }, { side: 4, lowerGap: 2, middleGap: 3 }, { side: 5, lowerGap: 3, middleGap: 3 }],
    "example-3": [{ side: 9 }, { side: 12 }, { side: 15 }],
    "example-4": [{ side: 12, nx: 4, ny: 3, nz: 5 }, { side: 24, nx: 3, ny: 4, nz: 8 }, { side: 42, nx: 5, ny: 6, nz: 7 }],
    "mission-1": mission1Pools,
    "mission-2": [{ side: 8, lowerGap: 5, middleGap: 6 }, { side: 10, lowerGap: 6, middleGap: 7 }, { side: 12, lowerGap: 7, middleGap: 8 }],
    "mission-3": [{ side: 400 }, { side: 500 }, { side: 600 }],
    "mission-4": [{ unit: 4 }, { unit: 5 }, { unit: 6 }],
    "mission-5": mission5Pools.map(removed => ({ removed, unit: 2 })),
    "mission-6": [{ w: 6, d: 4, h: 6, unit: 2 }, { w: 9, d: 6, h: 9, unit: 3 }, { w: 12, d: 8, h: 12, unit: 4 }]
  };

  const originalKey = api.generatorKey;
  const originalGenerate = api.generate;
  api.generatorKey = type => type?.generatorKey === "sourceGrade6SurfaceE1" ? "sourceGrade6SurfaceE1" : originalKey(type);
  api.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => {
    if (type?.generatorKey !== "sourceGrade6SurfaceE1") return originalGenerate(type, levelRank, difficultyOffset, seed, variant);
    const resolvedVariant = Number.isInteger(variant) ? variant : (Number.isInteger(type?.variant) ? type.variant : 0);
    const kind = ids.indexOf(type.sourceItemId) === 0 ? "exploration" : type.sourceItemId.match(/e1-(example|mission)-(\d+)/)?.[1] ? `${type.sourceItemId.match(/e1-(example|mission)-(\d+)/)[1]}-${type.sourceItemId.match(/e1-(example|mission)-(\d+)/)[2]}` : "exploration";
    const poolIndex = Math.max(0, Math.min(2, resolvedVariant % 3));
    const data = pools[kind][poolIndex];
    const problem = generateOne(kind, data, false, poolIndex);
    const answer = generateOne(kind, data, true, poolIndex);
    const meta = kind === "mission-5" ? {
      coordinatePoolMode: "verified-alternative-coordinate-pool",
      reviewEvidence: "원본 그림의 제거 좌표는 확정하지 못했으므로, 원문 유형을 보존한 명시적 대체 좌표 풀이다. 3개 풀 모두 102개 노출면으로 독립 검산했다."
    } : {};
    return { ...result(problem.prompt, answer.answer, answer.solution, answer.visual, type.sourceItemId, poolIndex, 3, meta), generator: "sourceGrade6SurfaceE1" };
  };
})();
