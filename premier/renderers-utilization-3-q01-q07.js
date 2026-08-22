(function (global) {
  "use strict";

  const figures = global.PremierFigures;
  if (!figures) throw new Error("PremierFigures가 먼저 로드되어야 합니다.");

  const { register, svg } = figures;
  const INK = "#1c2734";
  const NAVY = "#173a6b";
  const MUTED = "#728091";
  const GRID = "#aab4bf";
  const PALE = "#edf1f5";
  const CUBE_LEFT = "#e5e9ee";
  const CUBE_RIGHT = "#cbd3dc";

  function wrap(viewBox, body, className) {
    return svg(
      viewBox,
      `<g stroke-linecap="round" stroke-linejoin="round">${body}</g>`,
      className || "wide-svg"
    );
  }

  function txt(x, y, value, attrs) {
    return `<text x="${x}" y="${y}" font-family="Pretendard, Noto Sans KR, sans-serif" ${attrs || ""}>${value}</text>`;
  }

  function poly(points, attrs) {
    return `<polygon points="${points.map((point) => point.join(",")).join(" ")}" ${attrs || ""}/>`;
  }

  function dotBoard(x, y, width, height, triangle, showTag) {
    const padX = 18;
    const padY = 16;
    const dx = (width - padX * 2) / 2;
    const dy = (height - padY * 2) / 2;
    const points = [];
    for (let row = 0; row < 3; row += 1) {
      for (let column = 0; column < 3; column += 1) {
        points.push([x + padX + column * dx, y + padY + row * dy]);
      }
    }
    const triangleMarkup = triangle
      ? poly(triangle.map((index) => points[index]), `fill="none" stroke="${INK}" stroke-width="2"`)
      : "";
    const dots = points.map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="2.5" fill="${INK}"/>`).join("");
    const tag = showTag
      ? `<rect x="${x + width / 2 - 23}" y="${y - 9}" width="46" height="18" rx="8" fill="#fff" stroke="${GRID}" stroke-width="1"/>${txt(x + width / 2, y + 4, "보기", `text-anchor="middle" font-size="11" font-weight="850" fill="${NAVY}"`)}`
      : "";
    return `<g><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="9" fill="#fff" stroke="${GRID}" stroke-width="1.25"/>${triangleMarkup}${dots}${tag}</g>`;
  }

  register("u3-q1", function () {
    const blanks = [
      [24, 116], [157, 116], [290, 116], [423, 116],
      [90, 207], [223, 207], [356, 207]
    ].map(([x, y]) => dotBoard(x, y, 108, 76)).join("");
    return wrap("0 0 555 292", dotBoard(225, 15, 105, 75, [1, 6, 8], true) + blanks);
  });

  function numberedGrid(values, x, y, cell, options) {
    const opts = Object.assign({ dashedHorizontal: null, dashedVertical: null }, options || {});
    const rows = values.length;
    const columns = values[0].length;
    let body = `<rect x="${x}" y="${y}" width="${columns * cell}" height="${rows * cell}" fill="#fff" stroke="${INK}" stroke-width="1.35"/>`;
    for (let column = 1; column < columns; column += 1) {
      const px = x + column * cell;
      body += `<line x1="${px}" y1="${y}" x2="${px}" y2="${y + rows * cell}" stroke="${opts.dashedVertical === column ? MUTED : GRID}" stroke-width="1.1" ${opts.dashedVertical === column ? "stroke-dasharray=\"4 3\"" : ""}/>`;
    }
    for (let row = 1; row < rows; row += 1) {
      const py = y + row * cell;
      body += `<line x1="${x}" y1="${py}" x2="${x + columns * cell}" y2="${py}" stroke="${opts.dashedHorizontal === row ? MUTED : GRID}" stroke-width="1.1" ${opts.dashedHorizontal === row ? "stroke-dasharray=\"4 3\"" : ""}/>`;
    }
    values.forEach((row, rowIndex) => row.forEach((value, columnIndex) => {
      body += txt(
        x + columnIndex * cell + cell / 2,
        y + rowIndex * cell + cell * .67,
        value,
        `text-anchor="middle" font-size="${Math.max(12, cell * .42)}" font-weight="800" fill="${INK}"`
      );
    }));
    return body;
  }

  register("u3-q2", function () {
    const original = [[2, 1, 1, 2], [1, 2, 2, 1], [2, 3, 3, 2], [3, 1, 1, 3]];
    const firstFold = [[2, 1, 1, 2], [1, 2, 2, 1]];
    const finalFold = [[1, 2], [2, 1]];
    const marker = `<defs><marker id="u3q2-fold-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="${NAVY}"/></marker></defs>`;
    const firstArrow = `<path d="M17 134 C-2 121 -2 89 18 75" fill="none" stroke="${NAVY}" stroke-width="2" marker-end="url(#u3q2-fold-arrow)"/>`;
    const secondArrow = `<path d="M220 22 C231 4 264 4 275 22" fill="none" stroke="${NAVY}" stroke-width="2" marker-end="url(#u3q2-fold-arrow)"/>`;
    const body = `${marker}
      ${numberedGrid(original, 24, 28, 30, { dashedHorizontal: 2 })}
      ${firstArrow}
      ${txt(165, 98, "→", `text-anchor="middle" font-size="25" font-weight="800" fill="${MUTED}"`)}
      ${numberedGrid(firstFold, 194, 40, 30, { dashedVertical: 2 })}
      ${secondArrow}
      ${txt(338, 98, "→", `text-anchor="middle" font-size="25" font-weight="800" fill="${MUTED}"`)}
      ${numberedGrid(finalFold, 375, 40, 30)}
      ${numberedGrid(finalFold, 246, 172, 42)}`;
    return wrap("0 0 470 270", body);
  });

  register("u3-q3", function () {
    const marker = `<defs><marker id="u3q3-fold-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="${NAVY}"/></marker></defs>`;
    const stepArrow = (x) => txt(x, 81, "→", `text-anchor="middle" font-size="24" font-weight="850" fill="${MUTED}"`);
    return wrap("0 0 610 150", `${marker}
      <g fill="#fff" stroke="${INK}" stroke-width="1.5">
        <rect x="18" y="22" width="92" height="104"/>
        <line x1="64" y1="22" x2="64" y2="126" stroke="${MUTED}" stroke-dasharray="5 4"/>
        <path d="M45 65 C51 82 80 82 88 61" fill="none" stroke="${NAVY}" stroke-width="2" marker-end="url(#u3q3-fold-arrow)"/>
        <rect x="171" y="22" width="52" height="104"/>
        <line x1="171" y1="74" x2="223" y2="74" stroke="${MUTED}" stroke-dasharray="5 4"/>
        <path d="M189 103 C174 91 175 72 191 62" fill="none" stroke="${NAVY}" stroke-width="2" marker-end="url(#u3q3-fold-arrow)"/>
        <rect x="292" y="48" width="57" height="57"/>
        <line x1="292" y1="48" x2="349" y2="105" stroke="${MUTED}" stroke-dasharray="5 4"/>
        <path d="M309 41 C322 25 348 35 345 57" fill="none" stroke="${NAVY}" stroke-width="2" marker-end="url(#u3q3-fold-arrow)"/>
        <polygon points="459,51 551,51 551,126" fill="${PALE}"/>
      </g>
      <circle cx="523" cy="73" r="6" fill="#fff" stroke="${NAVY}" stroke-width="1.5"/>
      ${stepArrow(140)}${stepArrow(258)}${stepArrow(405)}`);
  });

  function relationTriangle(cx, top, lowerLeft, lowerRight, middle) {
    const apexY = 31;
    const baseY = 127;
    const half = 48;
    return `<g fill="#fff" stroke="${INK}" stroke-width="1.35">
      <path d="M${cx} ${apexY} L${cx - half} ${baseY} H${cx + half} Z"/>
      <line x1="${cx - 12}" y1="55" x2="${cx + 12}" y2="55"/>
      <line x1="${cx - 34}" y1="99" x2="${cx - 13}" y2="127"/>
      <line x1="${cx + 34}" y1="99" x2="${cx + 13}" y2="127"/>
      ${txt(cx, 49, top, `text-anchor="middle" stroke="none" font-size="15" font-weight="850" fill="${NAVY}"`)}
      ${txt(cx - 31, 119, lowerLeft, `text-anchor="middle" stroke="none" font-size="15" font-weight="850" fill="${NAVY}"`)}
      ${txt(cx + 31, 119, lowerRight, `text-anchor="middle" stroke="none" font-size="15" font-weight="850" fill="${NAVY}"`)}
      ${middle === "" ? "" : txt(cx, 91, middle, `text-anchor="middle" stroke="none" font-size="19" font-weight="900" fill="${INK}"`)}
    </g>`;
  }

  register("u3-q4", function () {
    const examples = relationTriangle(92, 5, 4, 7, 97)
      + relationTriangle(225, 1, 3, 2, 42)
      + relationTriangle(358, 3, 2, 3, 53);
    const frame = `<rect x="20" y="12" width="410" height="132" rx="10" fill="#fff" stroke="${GRID}" stroke-width="1.3"/>`;
    const tag = `<rect x="195" y="3" width="60" height="19" rx="9" fill="#fff" stroke="${GRID}" stroke-width="1"/>${txt(225, 17, "보기", `text-anchor="middle" font-size="11" font-weight="850" fill="${NAVY}"`)}`;
    return wrap("0 0 575 155", frame + tag + examples + relationTriangle(510, 2, 3, 5, ""));
  });

  function projection(originX, originY, sx, sy, rise) {
    return (x, y, z) => [originX + (x - y) * sx, originY + (x + y) * sy - z * rise];
  }

  function isoCube(x, y, z, project) {
    const p100 = project(x + 1, y, z);
    const p010 = project(x, y + 1, z);
    const p110 = project(x + 1, y + 1, z);
    const p001 = project(x, y, z + 1);
    const p101 = project(x + 1, y, z + 1);
    const p011 = project(x, y + 1, z + 1);
    const p111 = project(x + 1, y + 1, z + 1);
    const stroke = `stroke="${INK}" stroke-width="1.15" vector-effect="non-scaling-stroke"`;
    return poly([p010, p110, p111, p011], `fill="${CUBE_LEFT}" ${stroke}`)
      + poly([p100, p110, p111, p101], `fill="${CUBE_RIGHT}" ${stroke}`)
      + poly([p001, p101, p111, p011], `fill="#fff" ${stroke}`);
  }

  function stackBody(heightMap, project) {
    const cubes = [];
    heightMap.forEach((row, y) => row.forEach((height, x) => {
      for (let z = 0; z < height; z += 1) cubes.push({ x, y, z });
    }));
    cubes.sort((a, b) => (a.x + a.y) - (b.x + b.y) || a.z - b.z || a.x - b.x);
    return cubes.map((cube) => isoCube(cube.x, cube.y, cube.z, project)).join("");
  }

  function boxLattice(project) {
    const line = (a, b, attrs) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" ${attrs}/>`;
    const faint = `stroke="${NAVY}" stroke-width=".9" opacity=".42" stroke-dasharray="4 4" vector-effect="non-scaling-stroke"`;
    const edge = `stroke="${NAVY}" stroke-width="1.25" opacity=".78" fill="none" vector-effect="non-scaling-stroke"`;
    let behind = "";
    for (let index = 0; index <= 3; index += 1) {
      behind += line(project(index, 0, 3), project(index, 3, 3), faint);
      behind += line(project(0, index, 3), project(3, index, 3), faint);
      behind += line(project(index, 0, 0), project(index, 3, 0), faint);
      behind += line(project(0, index, 0), project(3, index, 0), faint);
      behind += line(project(index, 0, 0), project(index, 0, 3), faint);
      behind += line(project(0, index, 0), project(0, index, 3), faint);
    }
    for (let level = 1; level < 3; level += 1) {
      behind += line(project(0, 0, level), project(3, 0, level), faint);
      behind += line(project(0, 0, level), project(0, 3, level), faint);
    }
    const corners = [
      project(0, 0, 0), project(3, 0, 0), project(0, 3, 0), project(3, 3, 0),
      project(0, 0, 3), project(3, 0, 3), project(0, 3, 3), project(3, 3, 3)
    ];
    const edges = [[0, 1], [0, 2], [1, 3], [2, 3], [4, 5], [4, 6], [5, 7], [6, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
    const outline = edges.map(([a, b]) => line(corners[a], corners[b], edge)).join("");
    return { behind, outline };
  }

  register("u3-q5", function () {
    const heightMap = [[3, 3, 2], [2, 0, 0], [1, 0, 0]];
    const project = projection(155, 148, 27, 13.5, 29);
    const lattice = boxLattice(project);
    return wrap("0 0 310 240", lattice.behind + stackBody(heightMap, project) + lattice.outline);
  });

  register("u3-q6", function () {
    const ox = 44;
    const oy = 16;
    const unit = 42;
    const point = (x, y) => [ox + x * unit, oy + y * unit];
    const path = (a, b) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${INK}" stroke-width="1.55" vector-effect="non-scaling-stroke"/>`;
    let body = "";
    [0, 1, 3, 4].forEach((y) => { body += path(point(0, y), point(4, y)); });
    body += path(point(0, 2), point(1, 2)) + path(point(3, 2), point(4, 2));
    [0, 1, 3, 4].forEach((x) => { body += path(point(x, 0), point(x, 4)); });
    body += path(point(2, 0), point(2, 1)) + path(point(2, 3), point(2, 4));
    body += poly([point(2, 1), point(3, 2), point(2, 3), point(1, 2)], `fill="none" stroke="${INK}" stroke-width="1.55" vector-effect="non-scaling-stroke"`);
    body += `<rect x="${ox + 1.5 * unit}" y="${oy + 1.5 * unit}" width="${unit}" height="${unit}" fill="#fff" stroke="${INK}" stroke-width="1.55" vector-effect="non-scaling-stroke"/>`;
    return wrap("0 0 255 205", body);
  });

  register("u3-q7", function () {
    const cx = 138;
    const cy = 111;
    const diamond = (radius) => poly(
      [[cx, cy - radius], [cx + radius, cy], [cx, cy + radius], [cx - radius, cy]],
      `fill="none" stroke="${INK}" stroke-width="1.55" vector-effect="non-scaling-stroke"`
    );
    const square = (half) => `<rect x="${cx - half}" y="${cy - half}" width="${half * 2}" height="${half * 2}" fill="none" stroke="${INK}" stroke-width="1.55" vector-effect="non-scaling-stroke"/>`;
    return wrap("0 0 276 222", diamond(105) + square(61) + diamond(61) + square(31));
  });
})(window);
