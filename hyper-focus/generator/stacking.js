// HF Stacking Generators v2 — geometry/worksheet 렌더러 정식 이식
//  q02 상자 채우기(점선 상자) / q03 흑백 교차 / q04 구멍 뚫기(3축 터널 + 층별 풀이)
//  q05 숨은 개수(벽 있음/없음)
// 자유 드로잉 금지 — worksheet/render.js 좌표계·팔레트·페인터 순서를 그대로 사용
(function (global) {
  "use strict";

  // ── seeded RNG ──
  function makeRng(seed) {
    let a = seed >>> 0;
    function next() {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    return {
      next,
      int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
      pick: (arr) => arr[Math.floor(next() * arr.length)],
      bool: () => next() < 0.5,
      shuffle: (arr) => { const a2 = arr.slice(); for (let i = a2.length - 1; i > 0; i -= 1) { const j = Math.floor(next() * (i + 1)); const t = a2[i]; a2[i] = a2[j]; a2[j] = t; } return a2; }
    };
  }

  // ── 좌표계 (worksheet/render.js) ──
  function project(x, y, z, u) { return { px: (x - z) * u * 0.87, py: (x + z) * u * 0.5 - y * u }; }
  function fmt(n) { return Math.round(n * 100) / 100; }
  function polygon(pts, fill, stroke) {
    return '<polygon points="' + pts.map((p) => fmt(p.px) + "," + fmt(p.py)).join(" ")
      + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1" stroke-linejoin="round"/>';
  }
  const PALETTES = {
    grey: { top: "#ececec", left: "#d4d4d4", right: "#bcbcbc", stroke: "#6d6d6d" },
    white: { top: "#f8f8f4", left: "#e6e6e0", right: "#cfcfc9", stroke: "#6d6d6d" },
    black: { top: "#565656", left: "#3f3f3f", right: "#2b2b2b", stroke: "#161616" }
  };
  const WALL_FILL = "#e9ddc4", WALL_EDGE = "#c3ae82";
  const FLOOR_FILL = "#f4eee2", FLOOR_EDGE = "#ddd0b3";
  const HOLE_FILL = "#111", HOLE_EDGE = "#000";

  function quadY(x, yP, z, u) { return [project(x, yP, z, u), project(x + 1, yP, z, u), project(x + 1, yP, z + 1, u), project(x, yP, z + 1, u)]; }
  function quadZ(x, y, zP, u) { return [project(x, y, zP, u), project(x + 1, y, zP, u), project(x + 1, y + 1, zP, u), project(x, y + 1, zP, u)]; }
  function quadX(xP, y, z, u) { return [project(xP, y, z, u), project(xP, y, z + 1, u), project(xP, y + 1, z + 1, u), project(xP, y + 1, z, u)]; }
  function cubeSvg(x, y, z, u, pal) {
    return polygon(quadY(x, y + 1, z, u), pal.top, pal.stroke)
         + polygon(quadZ(x, y, z + 1, u), pal.left, pal.stroke)
         + polygon(quadX(x + 1, y, z, u), pal.right, pal.stroke);
  }
  function mapTotal(map) { let t = 0; for (const r of map) for (const h of r) t += h; return t; }
  function maxHeightOf(map) { let m = 0; for (const r of map) for (const h of r) if (h > m) m = h; return m; }
  function makeEmptyMap(w, d) { const m = []; for (let z = 0; z < d; z += 1) m.push(new Array(w).fill(0)); return m; }
  function isoBBox(width, depth, height, u) {
    const pad = u * 0.6;
    return { xMin: -depth * u * 0.87 - pad, yMin: -height * u - pad,
             w: (width + depth) * u * 0.87 + pad * 2, h: (width + depth) * u * 0.5 + height * u + pad * 2 };
  }
  function wrapSvg(inner, bb) {
    return '<svg viewBox="' + fmt(bb.xMin) + " " + fmt(bb.yMin) + " " + fmt(bb.w) + " " + fmt(bb.h)
      + '" preserveAspectRatio="xMidYMid meet" class="hf-iso">' + inner + "</svg>";
  }
  function renderIso(map, width, depth, opt) {
    opt = opt || {}; const u = opt.u || 20; const colorFn = opt.colorFn;
    let svg = "";
    for (let z = 0; z < depth; z += 1) for (let x = 0; x < width; x += 1)
      for (let y = 0; y < (map[z][x] || 0); y += 1)
        svg += cubeSvg(x, y, z, u, PALETTES[colorFn ? colorFn(x, y, z) : "grey"] || PALETTES.grey);
    return wrapSvg(svg, isoBBox(width, depth, Math.max(1, maxHeightOf(map)), u));
  }

  // ── 벽 있는 렌더 (worksheet renderIsoWalled) ──
  function floorQuad(w, d, u) { return [project(0, 0, 0, u), project(w, 0, 0, u), project(w, 0, d, u), project(0, 0, d, u)]; }
  function backWallQuad(w, d, hh, u) { return [project(0, 0, 0, u), project(w, 0, 0, u), project(w, hh, 0, u), project(0, hh, 0, u)]; }
  function leftWallQuad(d, hh, u) { return [project(0, 0, 0, u), project(0, 0, d, u), project(0, hh, d, u), project(0, hh, 0, u)]; }
  function renderIsoWalled(map, width, depth, opt) {
    opt = opt || {}; const u = opt.u || 20;
    const wallH = Math.max(1, maxHeightOf(map)) + 0.6;
    let svg = polygon(floorQuad(width, depth, u), FLOOR_FILL, FLOOR_EDGE)
      + polygon(backWallQuad(width, depth, wallH, u), WALL_FILL, WALL_EDGE)
      + polygon(leftWallQuad(depth, wallH, u), WALL_FILL, WALL_EDGE);
    for (let z = 0; z < depth; z += 1) for (let x = 0; x < width; x += 1)
      for (let y = 0; y < (map[z][x] || 0); y += 1) svg += cubeSvg(x, y, z, u, PALETTES.grey);
    return wrapSvg(svg, isoBBox(width, depth, wallH, u));
  }

  // ── 점선 상자 (worksheet boxWireframe / renderIsoBox) ──
  function boxWireframe(width, depth, boxH, u) {
    const c = {};
    [0, 1].forEach((xi) => [0, 1].forEach((yi) => [0, 1].forEach((zi) => {
      c[xi + "" + yi + "" + zi] = project(xi * width, yi * boxH, zi * depth, u);
    })));
    const edges = [["000","100"],["010","110"],["001","101"],["011","111"],
                   ["000","010"],["100","110"],["001","011"],["101","111"],
                   ["000","001"],["100","101"],["010","011"],["110","111"]];
    return edges.map(([a, b]) => '<line x1="' + fmt(c[a].px) + '" y1="' + fmt(c[a].py)
      + '" x2="' + fmt(c[b].px) + '" y2="' + fmt(c[b].py)
      + '" stroke="#8a8a8a" stroke-width="1" stroke-dasharray="4 3"/>').join("");
  }
  function renderIsoBox(map, width, depth, boxH, opt) {
    opt = opt || {}; const u = opt.u || 20; const colorFn = opt.colorFn;
    let svg = "";
    for (let z = 0; z < depth; z += 1) for (let x = 0; x < width; x += 1)
      for (let y = 0; y < (map[z][x] || 0); y += 1)
        svg += cubeSvg(x, y, z, u, PALETTES[colorFn ? colorFn(x, y, z) : "grey"] || PALETTES.grey);
    if (!opt.noBox) svg += boxWireframe(width, depth, boxH, u);
    return wrapSvg(svg, isoBBox(width, depth, boxH, u));
  }

  // ── 구멍 (worksheet renderIsoHoles) — tunnel: {axis:'x'|'y'|'z', a, b} ──
  function renderIsoHoles(width, depth, boxH, tunnels, opt) {
    opt = opt || {}; const u = opt.u || 20;
    let svg = "";
    for (let z = 0; z < depth; z += 1) for (let x = 0; x < width; x += 1)
      for (let y = 0; y < boxH; y += 1) svg += cubeSvg(x, y, z, u, PALETTES.grey);
    (tunnels || []).forEach((t) => {
      if (t.axis === "y") svg += polygon(quadY(t.a, boxH, t.b, u), HOLE_FILL, HOLE_EDGE);
      else if (t.axis === "x") svg += polygon(quadX(width, t.a, t.b, u), HOLE_FILL, HOLE_EDGE);
      else svg += polygon(quadZ(t.a, t.b, depth, u), HOLE_FILL, HOLE_EDGE);
    });
    return wrapSvg(svg, isoBBox(width, depth, boxH, u));
  }
  function holeLayers(width, depth, boxH, tunnels) {
    const grids = [];
    for (let y = 0; y < boxH; y += 1) grids.push(makeEmptyMap(width, depth));
    (tunnels || []).forEach((t) => {
      if (t.axis === "x") { for (let x = 0; x < width; x += 1) grids[t.a][t.b][x] = 1; }
      else if (t.axis === "y") { for (let y = 0; y < boxH; y += 1) grids[y][t.b][t.a] = 1; }
      else { for (let z = 0; z < depth; z += 1) grids[t.b][z][t.a] = 1; }
    });
    return grids.map((grid, i) => {
      let removed = 0;
      for (let z = 0; z < depth; z += 1) for (let x = 0; x < width; x += 1) if (grid[z][x]) removed += 1;
      return { floor: i + 1, grid, cells: width * depth, removed, remaining: width * depth - removed };
    });
  }
  function renderHoleLayers(width, depth, boxH, tunnels) {
    const cell = 13;
    const layers = holeLayers(width, depth, boxH, tunnels);
    let total = 0;
    const blocks = layers.map((L) => {
      total += L.remaining;
      const w = width * cell, h = depth * cell;
      let g = '<svg viewBox="0 0 ' + w + " " + h + '" width="' + w + '" height="' + h + '" class="hf-hole-grid">';
      for (let z = 0; z < depth; z += 1) for (let x = 0; x < width; x += 1)
        g += '<rect x="' + x * cell + '" y="' + z * cell + '" width="' + cell + '" height="' + cell
          + '" fill="' + (L.grid[z][x] === 1 ? HOLE_FILL : "#fff") + '" stroke="#333" stroke-width="0.8"/>';
      g += "</svg>";
      return '<span class="hf-hole-layer">' + g + "<small>" + L.floor + "층: " + width + "×" + depth
        + "−" + L.removed + " = " + L.remaining + "개</small></span>";
    }).join("");
    return '<div class="hf-hole-layers">' + blocks
      + '<span class="hf-hole-total">합계: ' + total + "개</span></div>";
  }

  // ── 위에서 본 바탕그림에 수 쓰기 (worksheet renderNumberGrid) ──
  function renderNumberGrid(map, width, depth, cellPx) {
    cellPx = cellPx || 30;
    const w = width * cellPx, h = depth * cellPx;
    let s = '<svg viewBox="0 0 ' + w + " " + h + '" width="' + w + '" height="' + h + '" class="hf-numgrid">';
    for (let z = 0; z < depth; z += 1) for (let x = 0; x < width; x += 1) {
      s += '<rect x="' + x * cellPx + '" y="' + z * cellPx + '" width="' + cellPx + '" height="' + cellPx
        + '" fill="#fff" stroke="#333" stroke-width="1"/>';
      const v = map[z][x];
      if (v) s += '<text x="' + (x * cellPx + cellPx / 2) + '" y="' + (z * cellPx + cellPx / 2 + 1)
        + '" text-anchor="middle" dominant-baseline="central" font-weight="700" font-size="'
        + cellPx * 0.42 + '">' + v + "</text>";
    }
    s += '<rect x="0.5" y="0.5" width="' + (w - 1) + '" height="' + (h - 1)
      + '" fill="none" stroke="#111" stroke-width="2.5"/></svg>';
    return s;
  }

  // ── 은폐 판정 ──
  function countHiddenNoWall(map) {   // 벽 없음: 앞·뒤·좌·우·위 5방향 모두 막힘
    const depth = map.length, width = depth ? map[0].length : 0;
    let hidden = 0;
    for (let z = 0; z < depth; z += 1) for (let x = 0; x < width; x += 1) {
      const h = map[z][x];
      for (let y = 0; y < h; y += 1) {
        if (y >= h - 1) continue;
        let R = false; for (let i = x + 1; i < width; i += 1) if (map[z][i] > y) { R = true; break; } if (!R) continue;
        let L = false; for (let i = x - 1; i >= 0; i -= 1) if (map[z][i] > y) { L = true; break; } if (!L) continue;
        let F = false; for (let i = z + 1; i < depth; i += 1) if (map[i][x] > y) { F = true; break; } if (!F) continue;
        let B = false; for (let i = z - 1; i >= 0; i -= 1) if (map[i][x] > y) { B = true; break; } if (!B) continue;
        hidden += 1;
      }
    }
    return hidden;
  }
  function countHiddenWalled(map) {   // 벽 있음: 위·앞(+z)·오른쪽(+x) 3방향만 판정
    const depth = map.length, width = depth ? map[0].length : 0;
    let hidden = 0;
    for (let z = 0; z < depth; z += 1) for (let x = 0; x < width; x += 1) {
      const h = map[z][x];
      for (let y = 0; y < h; y += 1) {
        if (!(y < h - 1)) continue;
        let F = false; for (let i = z + 1; i < depth; i += 1) if (map[i][x] > y) { F = true; break; } if (!F) continue;
        let R = false; for (let i = x + 1; i < width; i += 1) if (map[z][i] > y) { R = true; break; } if (!R) continue;
        hidden += 1;
      }
    }
    return hidden;
  }

  function cornerStaircase(rng, width, depth, maxH, firstFull) {
    const map = [];
    for (let z = 0; z < depth; z += 1) {
      const row = []; let prev = maxH;
      for (let x = 0; x < width; x += 1) {
        const h = (x === 0 && firstFull) ? maxH : rng.int(0, prev);
        row.push(h); prev = h;
      }
      map.push(row);
    }
    return map;
  }

  /* ═══════════ q02 — 상자 채우기 (점선 상자 경계선) ═══════════ */
  const Q02_DIMS = { easy: [[3, 2, 2], [3, 3, 2]], same: [[3, 3, 3], [4, 3, 2]], hard: [[4, 3, 3], [4, 4, 3]] };
  function generateQ02(difficulty, seed) {
    const rng = makeRng(seed);
    const dims = Q02_DIMS[difficulty] || Q02_DIMS.same;
    for (let t = 0; t < 200; t += 1) {
      const [W, D, H] = rng.pick(dims);
      const total = W * D * H;
      const map = cornerStaircase(rng, W, D, H, true);
      for (let z = 0; z < D; z += 1) map[z][0] = H;
      let placed = mapTotal(map);
      if (placed >= total) { map[D - 1][W - 1] = Math.max(0, H - 1); placed = mapTotal(map); }
      const p = { map, width: W, depth: D, boxH: H, total, placed, need: total - placed, difficulty, seed };
      if (validateQ02(p)) return p;
    }
    const map = [[3, 1, 0], [3, 2, 1], [3, 3, 2]];
    return { map, width: 3, depth: 3, boxH: 3, total: 27, placed: mapTotal(map), need: 27 - mapTotal(map), difficulty, seed: "fallback" };
  }
  function validateQ02(p) {
    if (p.need < 2) return false;
    if (p.placed < p.total * 0.25 || p.placed > p.total * 0.75) return false;
    return maxHeightOf(p.map) === p.boxH;
  }
  function deriveQ02Answer(p) { return p.need; }
  function renderQ02Problem(p) {
    return '<div class="hf-views"><figure><div class="hf-fig">'
      + renderIsoBox(p.map, p.width, p.depth, p.boxH)
      + '</div><figcaption>상자 안에 쌓아 놓은 모양</figcaption></figure></div>';
  }
  function renderQ02Answer(p) {
    return "정답: " + p.need + "개 — 상자를 가득 채우면 " + p.width + "×" + p.depth + "×" + p.boxH + "="
      + p.total + "개입니다. 지금 " + p.placed + "개가 있으니 " + p.total + "−" + p.placed + "=" + p.need + "개가 더 필요합니다.";
  }

  /* ═══════════ q03 — 흑백 교차 (같게: 층 높게 / 어렵게: 층 제각각) ═══════════ */
  const Q03_SPEC = {
    easy: { dims: [[3, 2, 2], [3, 3, 2]], shapes: ["cube"] },
    same: { dims: [[3, 3, 3], [3, 2, 4]], shapes: ["cube", "stair"] },
    hard: { dims: [[4, 3, 4], [3, 3, 4], [4, 4, 3]], shapes: ["stair", "ragged"] }
  };
  function raggedMap(rng, W, D, H) {
    const map = [];
    for (let z = 0; z < D; z += 1) {
      const row = [];
      for (let x = 0; x < W; x += 1) row.push(rng.int(1, H));
      map.push(row);
    }
    map[0][0] = H;
    return map;
  }
  function generateQ03(difficulty, seed) {
    const rng = makeRng(seed);
    const spec = Q03_SPEC[difficulty] || Q03_SPEC.same;
    for (let t = 0; t < 300; t += 1) {
      const [W, D, H] = rng.pick(spec.dims);
      const shape = rng.pick(spec.shapes);
      let map;
      if (shape === "cube") { map = []; for (let z = 0; z < D; z += 1) map.push(new Array(W).fill(H)); }
      else if (shape === "stair") { map = cornerStaircase(rng, W, D, H, true); for (let z = 0; z < D; z += 1) map[z][0] = H; }
      else map = raggedMap(rng, W, D, H);
      const cornerWhite = rng.bool();
      let white = 0, black = 0;
      for (let z = 0; z < D; z += 1) for (let x = 0; x < W; x += 1) for (let y = 0; y < map[z][x]; y += 1) {
        const even = (x + y + z) % 2 === 0;
        if (cornerWhite ? even : !even) white += 1; else black += 1;
      }
      const heights = []; for (const r of map) for (const h of r) if (h > 0) heights.push(h);
      const levelVariety = new Set(heights).size;
      const p = { map, width: W, depth: D, boxH: H, shape, cornerWhite, white, black,
                  maxH: maxHeightOf(map), levelVariety, difficulty, seed };
      if (validateQ03(p)) return p;
    }
    const map = [[2, 2], [2, 2]];
    return { map, width: 2, depth: 2, boxH: 2, shape: "cube", cornerWhite: true,
             white: 4, black: 4, maxH: 2, levelVariety: 1, difficulty, seed: "fallback" };
  }
  function validateQ03(p) {
    const total = p.white + p.black;
    if (total < 8 || total > 48) return false;
    if (p.white === 0 || p.black === 0) return false;
    if (p.difficulty === "same" && p.maxH < 3) return false;
    if (p.difficulty === "hard" && p.levelVariety < 3) return false;
    return true;
  }
  function deriveQ03Answer(p) { return { white: p.white, black: p.black }; }
  function renderQ03Problem(p) {
    const colorFn = (x, y, z) => {
      const even = (x + y + z) % 2 === 0;
      return (p.cornerWhite ? even : !even) ? "white" : "black";
    };
    const cap = p.shape === "cube" ? "직육면체 모양으로 쌓은 모양"
      : (p.shape === "stair" ? "계단 모양으로 쌓은 모양" : "층수가 제각각인 모양");
    return '<div class="hf-views"><figure><div class="hf-fig">'
      + renderIso(p.map, p.width, p.depth, { colorFn })
      + '</div><figcaption>' + cap + "</figcaption></figure></div>";
  }
  function renderQ03Answer(p) {
    return "정답: 흰색 " + p.white + "개, 검은색 " + p.black + "개 — 맞닿은 면은 색이 서로 달라야 하므로 "
      + "한 칸 옮길 때마다 색이 바뀝니다. 전체 " + (p.white + p.black) + "개를 색깔별로 세면 됩니다.";
  }

  /* ═══════════ q04 — 구멍 뚫기 (3축 터널 + 층별 풀이) ═══════════ */
  const Q04_SPEC = {
    easy: { dims: [[3, 3, 3], [3, 3, 2], [3, 2, 3], [4, 3, 2], [3, 4, 2]], axisCount: 1, holes: [1, 2] },
    same: { dims: [[3, 3, 3], [4, 3, 3], [3, 3, 4], [4, 4, 3]], axisCount: 2, holes: [2, 3] },
    hard: { dims: [[4, 4, 3], [4, 4, 4], [4, 3, 4]], axisCount: 3, holes: [3, 4] }
  };
  function tunnelCandidates(axis, W, D, H) {
    const inner = [], edge = [];
    if (axis === "y") {
      for (let x = 0; x < W; x += 1) for (let z = 0; z < D; z += 1)
        ((x > 0 && x < W - 1 && z > 0 && z < D - 1) ? inner : edge).push({ axis, a: x, b: z });
    } else if (axis === "x") {
      for (let y = 0; y < H; y += 1) for (let z = 0; z < D; z += 1)
        ((y > 0 && y < H - 1 && z > 0 && z < D - 1) ? inner : edge).push({ axis, a: y, b: z });
    } else {
      for (let x = 0; x < W; x += 1) for (let y = 0; y < H; y += 1)
        ((x > 0 && x < W - 1 && y > 0 && y < H - 1) ? inner : edge).push({ axis, a: x, b: y });
    }
    return { inner, edge };
  }
  function generateQ04(difficulty, seed) {
    const rng = makeRng(seed);
    const spec = Q04_SPEC[difficulty] || Q04_SPEC.same;
    for (let t = 0; t < 300; t += 1) {
      const [W, D, H] = rng.pick(spec.dims);
      const axes = rng.shuffle(["x", "y", "z"]).slice(0, spec.axisCount);
      const want = rng.int(spec.holes[0], spec.holes[1]);
      const tunnels = [];
      for (let i = 0; i < want; i += 1) {
        const axis = axes[i % axes.length];
        const pool = tunnelCandidates(axis, W, D, H);
        const list = pool.inner.length ? pool.inner : pool.edge;
        const pick = rng.pick(list);
        if (tunnels.some((t2) => t2.axis === pick.axis && t2.a === pick.a && t2.b === pick.b)) continue;
        tunnels.push(pick);
      }
      const removed = new Set();
      tunnels.forEach((t2) => {
        if (t2.axis === "y") { for (let y = 0; y < H; y += 1) removed.add(t2.a + "," + y + "," + t2.b); }
        else if (t2.axis === "x") { for (let x = 0; x < W; x += 1) removed.add(x + "," + t2.a + "," + t2.b); }
        else { for (let z = 0; z < D; z += 1) removed.add(t2.a + "," + t2.b + "," + z); }
      });
      const total = W * D * H;
      const p = { width: W, depth: D, boxH: H, total, tunnels,
                  removedCount: removed.size, remaining: total - removed.size, difficulty, seed };
      if (validateQ04(p)) return p;
    }
    const tunnels = [{ axis: "z", a: 1, b: 1 }];
    return { width: 3, depth: 3, boxH: 3, total: 27, tunnels, removedCount: 3, remaining: 24, difficulty, seed: "fallback" };
  }
  function validateQ04(p) {
    if (!p.tunnels.length) return false;
    if (p.removedCount < 2) return false;
    if (p.remaining <= p.total * 0.5) return false;
    const layers = holeLayers(p.width, p.depth, p.boxH, p.tunnels);
    let sum = 0; layers.forEach((L) => { sum += L.remaining; });
    return sum === p.remaining;
  }
  function deriveQ04Answer(p) { return p.remaining; }
  function renderQ04Problem(p) {
    const AX = { x: "옆에서 옆으로", y: "위에서 아래로", z: "앞에서 뒤로" };
    const words = [];
    p.tunnels.forEach((t) => { const w = AX[t.axis]; if (words.indexOf(w) < 0) words.push(w); });
    return '<div class="hf-views"><figure><div class="hf-fig">'
      + renderIsoHoles(p.width, p.depth, p.boxH, p.tunnels)
      + '</div><figcaption>' + words.join(", ") + " 뚫린 구멍 " + p.tunnels.length + "개</figcaption></figure></div>";
  }
  function renderQ04Answer(p) {
    return "정답: " + p.remaining + "개 — 전체는 " + p.width + "×" + p.depth + "×" + p.boxH + "="
      + p.total + "개입니다. 층마다 빠진 칸을 세어 더하면 " + p.remaining + "개입니다.";
  }
  function renderQ04Solution(p) { return renderHoleLayers(p.width, p.depth, p.boxH, p.tunnels); }

  /* ═══════════ q05 — 숨은 쌓기나무 (벽 있음 / 벽 없음) ═══════════ */
  // 벽 있음(3방향 판정)은 작은 더미에서도 숨은 칸이 생기고,
  // 벽 없음(5방향 판정)은 더 큰 더미가 필요하므로 차원을 따로 잡는다.
  const Q05_SPEC = {
    easy: { walledDims: [[3, 3, 3], [3, 3, 2], [4, 3, 2]], openDims: [[3, 3, 3], [4, 3, 3]],
            walledWant: [1, 4], openWant: [1, 2] },
    same: { walledDims: [[3, 3, 4], [4, 3, 3], [4, 4, 3]], openDims: [[4, 3, 3], [3, 3, 4], [4, 4, 3]],
            walledWant: [4, 9], openWant: [2, 5] },
    hard: { walledDims: [[4, 4, 4], [4, 3, 4], [5, 4, 4]], openDims: [[4, 4, 4], [4, 3, 4], [5, 4, 4]],
            walledWant: [9, 20], openWant: [5, 12] }
  };
  function generateQ05(difficulty, seed) {
    const rng = makeRng(seed);
    const spec = Q05_SPEC[difficulty] || Q05_SPEC.same;
    const walled = rng.bool();
    const dims = walled ? spec.walledDims : spec.openDims;
    const want = walled ? spec.walledWant : spec.openWant;
    for (let t = 0; t < 800; t += 1) {
      const [W, D, H] = rng.pick(dims);
      const map = [];
      for (let z = 0; z < D; z += 1) {
        const row = [];
        for (let x = 0; x < W; x += 1) {
          if (walled) {
            const bias = ((W - 1 - x) + (D - 1 - z) >= (W + D) / 2) ? 1 : 0;
            row.push(Math.min(H, rng.int(1, H - 1) + bias));
          } else {
            const midX = (W - 1) / 2, midZ = (D - 1) / 2;
            const bias = (Math.abs(x - midX) + Math.abs(z - midZ)) < 1.2 ? 1 : 0;
            row.push(Math.min(H, rng.int(1, H - 1) + bias));
          }
        }
        map.push(row);
      }
      const hidden = walled ? countHiddenWalled(map) : countHiddenNoWall(map);
      const total = mapTotal(map);
      const p = { map, width: W, depth: D, walled, hidden, total, visible: total - hidden, difficulty, seed };
      if (hidden < want[0] || hidden > want[1]) continue;
      if (validateQ05(p)) return p;
    }
    const map = [[2, 3, 2], [3, 4, 3], [2, 3, 2]];
    const hidden = countHiddenNoWall(map);
    return { map, width: 3, depth: 3, walled: false, hidden,
             total: mapTotal(map), visible: mapTotal(map) - hidden, difficulty, seed: "fallback" };
  }
  function validateQ05(p) {
    if (p.hidden < 1) return false;
    if (p.total < 10) return false;
    return maxHeightOf(p.map) >= 2;
  }
  function deriveQ05Answer(p) { return p.hidden; }
  function renderQ05Problem(p) {
    const svg = p.walled ? renderIsoWalled(p.map, p.width, p.depth) : renderIso(p.map, p.width, p.depth);
    const cap = p.walled ? "두 벽에 붙여 쌓은 모양 (전체 " + p.total + "개)"
                         : "바닥에 쌓은 모양 (전체 " + p.total + "개)";
    return '<div class="hf-views"><figure><div class="hf-fig">' + svg
      + '</div><figcaption>' + cap + "</figcaption></figure></div>";
  }
  function renderQ05Answer(p) {
    const how = p.walled
      ? "벽에 막혀 있으므로 위·앞·오른쪽 세 방향에서 모두 가려진 것을 셉니다."
      : "벽이 없으므로 위·앞·뒤·왼쪽·오른쪽 다섯 방향에서 모두 가려진 것을 셉니다.";
    return "정답: " + p.hidden + "개 — " + how + " 전체 " + p.total + "개 중 보이는 "
      + p.visible + "개를 빼면 " + p.total + "−" + p.visible + "=" + p.hidden + "개입니다.";
  }

  /* ═══════════ q01 풀이 보조 — 위에서 본 바탕그림에 수 쓰기 ═══════════ */
  function renderTopNumberGrid(map, width, depth) { return renderNumberGrid(map, width, depth, 30); }

  global.HFQ02 = { generateQ02, validateQ02, renderQ02Problem, deriveQ02Answer, renderQ02Answer };
  global.HFQ03 = { generateQ03, validateQ03, renderQ03Problem, deriveQ03Answer, renderQ03Answer };
  global.HFQ04 = { generateQ04, validateQ04, renderQ04Problem, deriveQ04Answer, renderQ04Answer, renderQ04Solution };
  global.HFQ05 = { generateQ05, validateQ05, renderQ05Problem, deriveQ05Answer, renderQ05Answer };
  global.HFSTACK = { renderTopNumberGrid, renderNumberGrid, holeLayers,
                     countHiddenNoWall, countHiddenWalled, renderIso, renderIsoWalled, renderIsoBox, renderIsoHoles };
})(typeof window !== "undefined" ? window : globalThis);
