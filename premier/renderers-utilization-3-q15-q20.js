(function (global) {
  "use strict";

  const figures = global.PremierFigures;
  if (!figures) throw new Error("PremierFigures가 먼저 로드되어야 합니다.");

  const { register, svg } = figures;
  const INK = "#1c2734";
  const NAVY = "#173a6b";
  const GOLD = "#c9a34d";
  const GRID = "#8190a2";

  function wrap(viewBox, body, className) {
    return svg(
      viewBox,
      `<g stroke-linecap="round" stroke-linejoin="round">${body}</g>`,
      className || "wide-svg"
    );
  }

  function txt(x, y, value, attrs) {
    return `<text x="${x}" y="${y}" ${attrs || ""}>${value}</text>`;
  }

  function polygon(points, attrs) {
    return `<polygon points="${points.map((point) => point.join(",")).join(" ")}" ${attrs || ""}/>`;
  }

  register("u3-q16", function () {
    const examples = [
      [4, 3, 10, 64, 55],
      [2, 5, 12, 228, 55],
      [20, 9, 38, 64, 99],
      [15, 6, 27, 228, 99]
    ];
    let body = `<rect x="18" y="18" width="324" height="105" rx="8" fill="#fbfcfe" stroke="${GRID}" stroke-width="1.4"/>
      <rect x="30" y="8" width="58" height="22" rx="11" fill="#fff8e7" stroke="${GOLD}" stroke-width="1.2"/>
      ${txt(59, 24, "보기", `text-anchor="middle" font-size="13" font-weight="850" fill="${NAVY}"`)}`;

    examples.forEach(([left, right, result, x, y]) => {
      body += txt(x - 22, y, left, `text-anchor="end" font-size="21" font-weight="800" fill="${INK}"`);
      body += txt(x, y, "★", `text-anchor="middle" font-size="20" font-weight="900" fill="${GOLD}"`);
      body += txt(x + 22, y, right, `text-anchor="start" font-size="21" font-weight="800" fill="${INK}"`);
      body += txt(x + 50, y, "=", `text-anchor="middle" font-size="20" font-weight="700" fill="${INK}"`);
      body += txt(x + 70, y, result, `text-anchor="start" font-size="21" font-weight="800" fill="${NAVY}"`);
    });

    body += txt(130, 158, "28", `text-anchor="end" font-size="24" font-weight="850" fill="${INK}"`);
    body += txt(152, 158, "★", `text-anchor="middle" font-size="22" font-weight="900" fill="${GOLD}"`);
    body += txt(174, 158, "9", `text-anchor="start" font-size="24" font-weight="850" fill="${INK}"`);
    body += txt(204, 158, "=", `text-anchor="middle" font-size="22" font-weight="750" fill="${INK}"`);
    body += `<rect x="226" y="132" width="78" height="36" rx="5" fill="#fff" stroke="${NAVY}" stroke-width="1.5"/>`;
    return wrap("0 0 360 180", body);
  });

  register("u3-q17", function () {
    const cells = [
      [0, 0, "3"], [1, 0, "5"], [2, 0, "7"],
      [2, 1, "14"],
      [0, 2, "17"], [1, 2, "?"], [2, 2, "21"], [3, 2, "?"],
      [1, 3, "26"], [3, 3, "?"], [4, 3, "32"]
    ];
    const size = 42;
    const originX = 18;
    const originY = 7;
    const body = cells.map(([column, row, value]) => {
      const x = originX + column * size;
      const y = originY + row * size;
      const isBlank = value === "?";
      return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${isBlank ? "#fffaf0" : "#fff"}" stroke="${INK}" stroke-width="1.35"/>
        ${txt(x + size / 2, y + 28, value, `text-anchor="middle" font-size="18" font-weight="850" fill="${isBlank ? GOLD : NAVY}"`)}`;
    }).join("");
    return wrap("0 0 250 180", body);
  });

  function numberSymbol(kind, x, y) {
    if (kind === "triangle") {
      return polygon([[x, y - 11], [x - 12, y + 10], [x + 12, y + 10]], `fill="${INK}" stroke="${INK}" stroke-width="1"`);
    }
    if (kind === "striped-circle") {
      return `<g>
        <circle cx="${x}" cy="${y}" r="11" fill="#fff" stroke="${INK}" stroke-width="1.4"/>
        <path d="M${x - 6} ${y - 8} V${y + 8} M${x - 2} ${y - 10} V${y + 10} M${x + 2} ${y - 10} V${y + 10} M${x + 6} ${y - 8} V${y + 8}" fill="none" stroke="${GRID}" stroke-width="1.35"/>
        <circle cx="${x}" cy="${y}" r="11" fill="none" stroke="${INK}" stroke-width="1.4"/>
      </g>`;
    }
    return `<g>
      <rect x="${x - 10}" y="${y - 11}" width="20" height="22" fill="#fff" stroke="${INK}" stroke-width="1.4"/>
      <rect x="${x}" y="${y - 10.3}" width="9.3" height="20.6" fill="${INK}"/>
    </g>`;
  }

  function symbolNumberRow(y) {
    return numberSymbol("triangle", 112, y)
      + numberSymbol("striped-circle", 148, y)
      + numberSymbol("half-rectangle", 184, y);
  }

  register("u3-q18", function () {
    let body = symbolNumberRow(28) + symbolNumberRow(68);
    body += txt(76, 75, "+", `text-anchor="middle" font-size="26" font-weight="750" fill="${INK}"`);
    body += `<line x1="92" y1="91" x2="202" y2="91" stroke="${INK}" stroke-width="2"/>`;
    ["5", "7", "4"].forEach((digit, index) => {
      body += txt(112 + index * 36, 121, digit, `text-anchor="middle" font-size="24" font-weight="850" fill="${NAVY}"`);
    });
    return wrap("0 0 235 138", body);
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
    const edge = `stroke="${INK}" stroke-width="1.2"`;
    return [
      polygon([p010, p110, p111, p011], `fill="#eef2f6" ${edge}`),
      polygon([p100, p110, p111, p101], `fill="#d5dde7" ${edge}`),
      polygon([p001, p101, p111, p011], `fill="#ffffff" ${edge}`)
    ].join("");
  }

  function wallPlanes(project, width, depth, height) {
    const top = height + 0.72;
    const back = polygon(
      [project(0, 0, 0), project(width, 0, 0), project(width, 0, top), project(0, 0, top)],
      `fill="#eaf2fb" stroke="#6f88a3" stroke-width="1.25"`
    );
    const left = polygon(
      [project(0, 0, 0), project(0, depth, 0), project(0, depth, top), project(0, 0, top)],
      `fill="#f7f1e5" stroke="#9a8666" stroke-width="1.25"`
    );
    let grid = "";
    for (let x = 1; x < width; x += 1) {
      const start = project(x, 0, 0);
      const end = project(x, 0, top);
      grid += `<line x1="${start[0]}" y1="${start[1]}" x2="${end[0]}" y2="${end[1]}" stroke="#9aabba" stroke-width=".7" opacity=".55"/>`;
    }
    for (let y = 1; y < depth; y += 1) {
      const start = project(0, y, 0);
      const end = project(0, y, top);
      grid += `<line x1="${start[0]}" y1="${start[1]}" x2="${end[0]}" y2="${end[1]}" stroke="#b3a58b" stroke-width=".7" opacity=".55"/>`;
    }
    for (let z = 1; z <= height; z += 1) {
      const backStart = project(0, 0, z);
      const backEnd = project(width, 0, z);
      const leftEnd = project(0, depth, z);
      grid += `<line x1="${backStart[0]}" y1="${backStart[1]}" x2="${backEnd[0]}" y2="${backEnd[1]}" stroke="#9aabba" stroke-width=".7" opacity=".55"/>`;
      grid += `<line x1="${backStart[0]}" y1="${backStart[1]}" x2="${leftEnd[0]}" y2="${leftEnd[1]}" stroke="#b3a58b" stroke-width=".7" opacity=".55"/>`;
    }
    return back + left + grid;
  }

  function stackFromHeightMap(heightMap, project) {
    const cubes = [];
    heightMap.forEach((row, y) => row.forEach((height, x) => {
      for (let z = 0; z < height; z += 1) cubes.push({ x, y, z });
    }));
    cubes.sort((a, b) => (a.x + a.y) - (b.x + b.y) || a.z - b.z || a.x - b.x);
    return cubes.map((cube) => isoCube(cube.x, cube.y, cube.z, project)).join("");
  }

  function heightGrid(heightMap, originX, originY) {
    const cell = 27;
    const labels = ["뒤", "가운데", "앞"];
    let body = txt(originX + cell * 3, originY - 16, "위에서 본 수 바탕그림", `text-anchor="middle" font-size="12" font-weight="850" fill="${NAVY}"`);
    heightMap.forEach((row, y) => {
      body += txt(originX - 10, originY + y * cell + 18, labels[y], `text-anchor="end" font-size="10" font-weight="750" fill="${GRID}"`);
      row.forEach((height, x) => {
        const px = originX + x * cell;
        const py = originY + y * cell;
        body += `<rect x="${px}" y="${py}" width="${cell}" height="${cell}" fill="${height === 3 ? "#eef4fa" : "#fff"}" stroke="${INK}" stroke-width="1.1"/>`;
        body += txt(px + cell / 2, py + 19, height, `text-anchor="middle" font-size="14" font-weight="850" fill="${height === 3 ? NAVY : INK}"`);
      });
    });
    return body;
  }

  register("u3-q19", function () {
    const heightMap = [
      [3, 3, 3, 3, 3, 3],
      [3, 1, 1, 1, 1, 1],
      [3, 1, 1, 1, 1, 1]
    ];
    const project = projection(160, 145, 27, 13.5, 26);
    const walls = wallPlanes(project, 6, 3, 3);
    const stack = stackFromHeightMap(heightMap, project);
    const labels = `${txt(260, 22, "뒤쪽 벽", `text-anchor="middle" font-size="11" font-weight="800" fill="#5f7690"`)}
      <line x1="260" y1="28" x2="260" y2="48" stroke="#6f88a3" stroke-width="1"/>
      ${txt(39, 72, "왼쪽 벽", `text-anchor="middle" font-size="11" font-weight="800" fill="#8a7759"`)}
      <line x1="67" y1="75" x2="91" y2="91" stroke="#9a8666" stroke-width="1"/>`;
    const grid = heightGrid(heightMap, 406, 66);
    return wrap("0 0 590 280", walls + labels + stack + grid);
  });
})(window);
