// GW_RENDER — pure string-building SVG renderers for the worksheet.
//
// WHY DOM-free string builders: render.js needs to run identically whether
// it is inlined into a printed page or (in principle) unit-tested under
// Node, and the project convention (see games/*) is plain SVG markup, not a
// canvas/three.js scene. Every function here returns an SVG string; app.js
// is the only place that touches innerHTML.
(function (global) {
  "use strict";

  const GEN = global.GW_GEN;

  // Iso projection: classic "diamond" 2:1-ish cabinet projection. Increasing
  // x moves right+down, increasing z moves left+down, increasing y moves up.
  function project(x, y, z, u) {
    return { px: (x - z) * u * 0.87, py: (x + z) * u * 0.5 - y * u };
  }

  function fmt(n) {
    return Math.round(n * 100) / 100;
  }

  function polygon(pts, fill, stroke) {
    const d = pts.map((p) => fmt(p.px) + "," + fmt(p.py)).join(" ");
    return '<polygon points="' + d + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1" stroke-linejoin="round"/>';
  }

  // Cube face palettes. "grey" is the default book-style cube; "white"/
  // "black" are used by the BW checkerboard problem.
  const PALETTES = {
    grey: { top: "#ececec", left: "#d4d4d4", right: "#bcbcbc", stroke: "#6d6d6d" },
    white: { top: "#f8f8f4", left: "#e6e6e0", right: "#cfcfc9", stroke: "#6d6d6d" },
    black: { top: "#565656", left: "#3f3f3f", right: "#2b2b2b", stroke: "#161616" }
  };

  // Three quads that make up one visible unit cube face, reused both for
  // drawing solid cubes and for drawing "opening" quads on a box surface
  // (HL). y-plane = top/bottom, z-plane = front/back, x-plane = left/right.
  function quadY(x, yPlane, z, u) {
    return [project(x, yPlane, z, u), project(x + 1, yPlane, z, u), project(x + 1, yPlane, z + 1, u), project(x, yPlane, z + 1, u)];
  }
  function quadZ(x, y, zPlane, u) {
    return [project(x, y, zPlane, u), project(x + 1, y, zPlane, u), project(x + 1, y + 1, zPlane, u), project(x, y + 1, zPlane, u)];
  }
  function quadX(xPlane, y, z, u) {
    return [project(xPlane, y, z, u), project(xPlane, y, z + 1, u), project(xPlane, y + 1, z + 1, u), project(xPlane, y + 1, z, u)];
  }

  function cubeSvg(x, y, z, u, palette) {
    const top = quadY(x, y + 1, z, u);
    const left = quadZ(x, y, z + 1, u); // front-left visible face
    const right = quadX(x + 1, y, z, u); // front-right visible face
    return polygon(top, palette.top, palette.stroke) + polygon(left, palette.left, palette.stroke) + polygon(right, palette.right, palette.stroke);
  }

  // Analytic bounding box for a width x depth footprint drawn up to height H
  // at unit size u — avoids tracking every polygon point.
  function isoBBox(width, depth, height, u, pad) {
    pad = pad === undefined ? u * 0.6 : pad;
    const xMin = -depth * u * 0.87 - pad;
    const xMax = width * u * 0.87 + pad;
    const yMin = -height * u - pad;
    const yMax = (width + depth) * u * 0.5 + pad;
    return { xMin, yMin, w: xMax - xMin, h: yMax - yMin };
  }

  function wrapSvg(inner, bbox, cssClass) {
    return (
      '<svg viewBox="' + fmt(bbox.xMin) + " " + fmt(bbox.yMin) + " " + fmt(bbox.w) + " " + fmt(bbox.h) + '" ' +
      'class="' + (cssClass || "ws-iso") + '" preserveAspectRatio="xMidYMid meet">' + inner + "</svg>"
    );
  }

  // Painter's algorithm: back (large z) to front (small z), so nearer
  // columns correctly occlude farther ones; within a column, bottom to top
  // so higher cubes paint over the top face of the cube beneath them.
  function renderIso(map, width, depth, options) {
    options = options || {};
    const u = options.u || 20;
    const colorFn = options.colorFn || (() => "grey");
    let svg = "";
    for (let z = depth - 1; z >= 0; z -= 1) {
      for (let x = 0; x < width; x += 1) {
        const h = map[z][x] || 0;
        for (let y = 0; y < h; y += 1) {
          const pal = PALETTES[colorFn(x, y, z)] || PALETTES.grey;
          svg += cubeSvg(x, y, z, u, pal);
        }
      }
    }
    const height = Math.max(1, GEN.maxHeightOf(map));
    return wrapSvg(svg, isoBBox(width, depth, height, u));
  }

  function boxWireframe(width, depth, boxH, u) {
    const c = {};
    [0, 1].forEach((xi) => [0, 1].forEach((yi) => [0, 1].forEach((zi) => {
      c[xi + "" + yi + "" + zi] = project(xi * width, yi * boxH, zi * depth, u);
    })));
    const edges = [
      ["000", "100"], ["010", "110"], ["001", "101"], ["011", "111"],
      ["000", "010"], ["100", "110"], ["001", "011"], ["101", "111"],
      ["000", "001"], ["100", "101"], ["010", "011"], ["110", "111"]
    ];
    return edges.map(([a, b]) => (
      '<line x1="' + fmt(c[a].px) + '" y1="' + fmt(c[a].py) + '" x2="' + fmt(c[b].px) + '" y2="' + fmt(c[b].py) + '" ' +
      'stroke="#8a8a8a" stroke-width="1" stroke-dasharray="4 3"/>'
    )).join("");
  }

  // FB / CU / PN / BW all draw cubes inside a dashed full-box wireframe so
  // the "how many more to fill the box" framing is visible at a glance.
  function renderIsoBox(map, width, depth, boxH, options) {
    options = options || {};
    const u = options.u || 20;
    let colorFn = options.colorFn;
    if (!colorFn && options.checker) {
      const cornerWhite = options.cornerWhite;
      colorFn = (x, y, z) => {
        const parityEven = (x + y + z) % 2 === 0;
        return (cornerWhite ? parityEven : !parityEven) ? "white" : "black";
      };
    }
    if (!colorFn) colorFn = () => "grey";
    let svg = "";
    for (let z = depth - 1; z >= 0; z -= 1) {
      for (let x = 0; x < width; x += 1) {
        const h = map[z][x] || 0;
        for (let y = 0; y < h; y += 1) svg += cubeSvg(x, y, z, u, PALETTES[colorFn(x, y, z)] || PALETTES.grey);
      }
    }
    // The dashed wireframe only carries meaning when the box is NOT full
    // (FB/CU: "how many more to fill"). For a full cube (PN/BW) the outline
    // coincides with the cube edges and just muddies the drawing.
    if (!options.noBox) svg += boxWireframe(width, depth, boxH, u);
    return wrapSvg(svg, isoBBox(width, depth, boxH, u));
  }

  // HL: draw a solid full box, then paint the tunnel entrances white on the
  // three visible faces (top / front z=0 / right x=width). This is a
  // simplified "marked opening" rendering, not true see-through geometry.
  function renderIsoHoles(width, depth, boxH, tunnels, options) {
    options = options || {};
    const u = options.u || 20;
    let svg = "";
    for (let z = depth - 1; z >= 0; z -= 1) {
      for (let x = 0; x < width; x += 1) {
        for (let y = 0; y < boxH; y += 1) svg += cubeSvg(x, y, z, u, PALETTES.grey);
      }
    }
    tunnels.forEach((t) => {
      if (t.axis === "y") {
        // vertical shaft at (x=a, z=b): opening visible from the top face.
        svg += polygon(quadY(t.a, boxH, t.b, u), "#ffffff", "#444");
      } else if (t.axis === "x") {
        // horizontal shaft at (y=a, z=b) along x: reaches the right face x=width.
        svg += polygon(quadX(width, t.a, t.b, u), "#ffffff", "#444");
      } else {
        // shaft at (x=a, y=b) along z: reaches the front face z=0.
        svg += polygon(quadZ(t.a, t.b, 0, u), "#ffffff", "#444");
      }
    });
    return wrapSvg(svg, isoBBox(width, depth, boxH, u));
  }

  // --- 2D view grids -----------------------------------------------------

  // Book-style top-view grid: bold solid grid lines, height numbers centred.
  function renderNumberGrid(grid, width, depth, cellPx) {
    cellPx = cellPx || 34;
    const w = width * cellPx;
    const h = depth * cellPx;
    let s = '<svg viewBox="0 0 ' + w + " " + h + '" class="ws-grid ws-grid-number" preserveAspectRatio="xMidYMid meet">';
    for (let z = 0; z < depth; z += 1) {
      for (let x = 0; x < width; x += 1) {
        s += '<rect x="' + x * cellPx + '" y="' + z * cellPx + '" width="' + cellPx + '" height="' + cellPx + '" fill="#fff" stroke="#333" stroke-width="1"/>';
        const v = grid[z][x];
        if (v) {
          s += '<text x="' + (x * cellPx + cellPx / 2) + '" y="' + (z * cellPx + cellPx / 2 + 1) + '" text-anchor="middle" dominant-baseline="central" font-weight="700" font-size="' + cellPx * 0.42 + '">' + v + "</text>";
        }
      }
    }
    s += '<rect x="0.5" y="0.5" width="' + (w - 1) + '" height="' + (h - 1) + '" fill="none" stroke="#111" stroke-width="2.5"/>';
    s += "</svg>";
    return s;
  }

  // Book-style "본 모양" grid: only filled cells get an outlined unit square.
  function renderViewGrid(grid, cellPx) {
    cellPx = cellPx || 26;
    const rows = grid.length;
    const cols = rows ? grid[0].length : 0;
    const w = Math.max(1, cols) * cellPx;
    const h = Math.max(1, rows) * cellPx;
    let s = '<svg viewBox="0 0 ' + w + " " + h + '" class="ws-grid ws-grid-view" preserveAspectRatio="xMidYMid meet">';
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        if (grid[r][c]) s += '<rect x="' + c * cellPx + '" y="' + r * cellPx + '" width="' + cellPx + '" height="' + cellPx + '" fill="#fff" stroke="#333" stroke-width="1.6"/>';
      }
    }
    s += "</svg>";
    return s;
  }

  // Empty dotted answer grid the student draws into.
  function renderEmptyDottedGrid(rows, cols, cellPx) {
    cellPx = cellPx || 26;
    const w = cols * cellPx;
    const h = rows * cellPx;
    let s = '<svg viewBox="0 0 ' + w + " " + h + '" class="ws-grid ws-grid-empty" preserveAspectRatio="xMidYMid meet">';
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        s += '<rect x="' + c * cellPx + '" y="' + r * cellPx + '" width="' + cellPx + '" height="' + cellPx + '" fill="none" stroke="#aaa" stroke-width="1" stroke-dasharray="3 2"/>';
      }
    }
    s += "</svg>";
    return s;
  }

  // Small filled thumbnail used on the answer sheet.
  function renderMiniFilled(grid, cellPx) {
    cellPx = cellPx || 12;
    const rows = grid.length;
    const cols = rows ? grid[0].length : 0;
    const w = Math.max(1, cols) * cellPx;
    const h = Math.max(1, rows) * cellPx;
    let s = '<svg viewBox="0 0 ' + w + " " + h + '" class="ws-grid ws-grid-mini" preserveAspectRatio="xMidYMid meet">';
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        if (grid[r][c]) s += '<rect x="' + c * cellPx + '" y="' + r * cellPx + '" width="' + cellPx + '" height="' + cellPx + '" fill="#4a4a4a" stroke="#222" stroke-width="0.5"/>';
        else s += '<rect x="' + c * cellPx + '" y="' + r * cellPx + '" width="' + cellPx + '" height="' + cellPx + '" fill="none" stroke="#ddd" stroke-width="0.5"/>';
      }
    }
    s += "</svg>";
    return s;
  }

  global.GW_RENDER = {
    renderIso,
    renderIsoBox,
    renderIsoHoles,
    renderNumberGrid,
    renderViewGrid,
    renderEmptyDottedGrid,
    renderMiniFilled
  };
})(typeof window !== "undefined" ? window : globalThis);
