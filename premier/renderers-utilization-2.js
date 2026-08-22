(function (global) {
  "use strict";

  const figures = global.PremierFigures;
  if (!figures) throw new Error("PremierFigures가 먼저 로드되어야 합니다.");

  const { register, svg } = figures;
  const INK = "#1c2734";
  const NAVY = "#173a6b";
  const GOLD = "#c9a34d";
  const PALE = "#eef2f6";
  const GRID = "#8190a2";

  function wrap(viewBox, body, className) {
    return svg(
      viewBox,
      `<g stroke-linecap="round" stroke-linejoin="round">${body}</g>`,
      className || "wide-svg"
    );
  }

  function poly(points, attrs) {
    return `<polygon points="${points.map((p) => p.join(",")).join(" ")}" ${attrs || ""}/>`;
  }

  function txt(x, y, value, attrs) {
    return `<text x="${x}" y="${y}" ${attrs || ""}>${value}</text>`;
  }

  function projection(originX, originY, sx, sy, rise) {
    return (x, y, z) => [originX + (x - y) * sx, originY + (x + y) * sy - z * rise];
  }

  function isoCube(x, y, z, project) {
    const p000 = project(x, y, z);
    const p100 = project(x + 1, y, z);
    const p010 = project(x, y + 1, z);
    const p110 = project(x + 1, y + 1, z);
    const p001 = project(x, y, z + 1);
    const p101 = project(x + 1, y, z + 1);
    const p011 = project(x, y + 1, z + 1);
    const p111 = project(x + 1, y + 1, z + 1);
    const stroke = `stroke="${INK}" stroke-width="1.25"`;
    return [
      poly([p010, p110, p111, p011], `fill="#e9edf2" ${stroke}`),
      poly([p100, p110, p111, p101], `fill="#cfd6df" ${stroke}`),
      poly([p001, p101, p111, p011], `fill="#ffffff" ${stroke}`),
      `<path d="M${p000[0]},${p000[1]} L${p100[0]},${p100[1]} M${p000[0]},${p000[1]} L${p010[0]},${p010[1]}" fill="none" ${stroke}/>`
    ].join("");
  }

  function stackBody(heightMap, originX, originY, options) {
    const opts = Object.assign({ sx: 18, sy: 9, rise: 18 }, options || {});
    const project = projection(originX, originY, opts.sx, opts.sy, opts.rise);
    const cubes = [];
    heightMap.forEach((row, y) => row.forEach((height, x) => {
      for (let z = 0; z < height; z += 1) cubes.push({ x, y, z });
    }));
    cubes.sort((a, b) => (a.x + a.y) - (b.x + b.y) || a.z - b.z || a.x - b.x);
    return cubes.map((cube) => isoCube(cube.x, cube.y, cube.z, project)).join("");
  }

  function isoBox(width, depth, height, originX, originY, options) {
    const opts = Object.assign({ sx: 18, sy: 9, rise: 18 }, options || {});
    const project = projection(originX, originY, opts.sx, opts.sy, opts.rise);
    const corners = [
      [0, 0, 0], [width, 0, 0], [0, depth, 0], [width, depth, 0],
      [0, 0, height], [width, 0, height], [0, depth, height], [width, depth, height]
    ].map((p) => project(p[0], p[1], p[2]));
    const edges = [[0, 1], [0, 2], [1, 3], [2, 3], [4, 5], [4, 6], [5, 7], [6, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
    return edges.map(([a, b]) => `<line x1="${corners[a][0]}" y1="${corners[a][1]}" x2="${corners[b][0]}" y2="${corners[b][1]}" stroke="${NAVY}" stroke-width="1" stroke-dasharray="4 4" opacity=".62"/>`).join("");
  }

  register("u2-q1", function () {
    const map = [
      [1, 2, 1],
      [2, 3, 2],
      [3, 3, 3]
    ];
    const body = `${stackBody(map, 112, 116, { sx: 21, sy: 10.5, rise: 22 })}${isoBox(3, 3, 3, 112, 116, { sx: 21, sy: 10.5, rise: 22 })}`;
    return wrap("0 0 225 190", body);
  });

  function net(cells, ox, oy, size) {
    return cells.map((cell) => {
      const x = ox + cell[0] * size;
      const y = oy + cell[1] * size;
      return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#fff" stroke="${INK}" stroke-width="1.25"/>${cell[2] ? txt(x + size / 2, y + size * .68, cell[2], `text-anchor="middle" font-size="${size * .48}" font-weight="800" fill="${NAVY}"`) : ""}`;
    }).join("");
  }

  register("u2-q2", function () {
    const n1 = [[2, 0], [1, 1, 1], [2, 1], [0, 2, 2], [1, 2, 3], [0, 3]];
    const n2 = [[2, 0], [0, 1, 1], [1, 1, 2], [2, 1], [3, 1], [1, 2, 3]];
    const n3 = [[0, 0, 3], [1, 0, 1], [2, 0], [1, 1, 2], [1, 2], [1, 3]];
    const n4 = [[0, 0, 1], [0, 1, 2], [1, 1, 3], [2, 1], [2, 2], [3, 2]];
    return wrap("0 0 360 220", [net(n1, 10, 4, 24), net(n2, 188, 5, 24), net(n3, 15, 119, 24), net(n4, 198, 118, 24)].join(""));
  });

  register("u2-q3", function () {
    const rows = [["−"], ["×"], ["+"]];
    const body = rows.map((row, i) => {
      const y = 28 + i * 45;
      return `<rect x="22" y="${y - 18}" width="26" height="26" fill="#fff" stroke="${INK}" stroke-width="1.4"/>
        ${txt(71, y + 3, row[0], `text-anchor="middle" font-size="22" font-weight="700" fill="${INK}"`)}
        <rect x="94" y="${y - 18}" width="26" height="26" fill="#fff" stroke="${INK}" stroke-width="1.4"/>
        ${txt(143, y + 3, "=", `text-anchor="middle" font-size="20" font-weight="700" fill="${INK}"`)}
        <rect x="166" y="${y - 18}" width="26" height="26" fill="#fff" stroke="${INK}" stroke-width="1.4"/>`;
    }).join("");
    return wrap("0 0 215 145", body);
  });

  function pip(x, y, r) { return `<circle cx="${x}" cy="${y}" r="${r || 3.6}" fill="${INK}"/>`; }
  function arrow(x1, y1, x2, y2) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const backX = x2 - Math.cos(angle) * 9;
    const backY = y2 - Math.sin(angle) * 9;
    const left = [backX + Math.cos(angle + Math.PI / 2) * 4, backY + Math.sin(angle + Math.PI / 2) * 4];
    const right = [backX + Math.cos(angle - Math.PI / 2) * 4, backY + Math.sin(angle - Math.PI / 2) * 4];
    return `<line x1="${x1}" y1="${y1}" x2="${backX + Math.cos(angle) * 2}" y2="${backY + Math.sin(angle) * 2}" stroke="${INK}" stroke-width="2.2"/>${poly([[x2, y2], left, right], `fill="${INK}"`)}`;
  }

  register("u2-q4", function () {
    const die = `<g transform="translate(4 25)">
      <rect x="0" y="0" width="42" height="42" fill="#fff" stroke="${INK}" stroke-width="1.7"/>
      ${poly([[42, 0], [58, 14], [58, 56], [42, 42]], `fill="#e1e6ec" stroke="${INK}" stroke-width="1.7"`)}
      ${poly([[0, 42], [42, 42], [58, 56], [16, 56]], `fill="#f2f4f7" stroke="${INK}" stroke-width="1.7"`)}
      ${pip(21, 21)}${pip(49, 14, 3)}${pip(49, 29, 3)}${pip(49, 44, 3)}${pip(18, 48, 3)}${pip(42, 50, 3)}
    </g>`;
    const cells = [[1, 0, 2], [2, 0, 3], [0, 1, 4], [1, 1, 5], [2, 1, 6], [0, 2, 7], [1, 2, 8], [2, 2, 9]];
    const grid = cells.map(([cx, cy, value]) => {
      const x = 82 + cx * 46;
      const y = 8 + cy * 46;
      return `<rect x="${x}" y="${y}" width="46" height="46" fill="#fff" stroke="${GRID}" stroke-width="1.25"/>${txt(x + 9, y + 16, value, `font-size="11" font-weight="800" fill="${NAVY}"`)}`;
    }).join("");
    const route = [arrow(65, 31, 110, 31), arrow(123, 31, 176, 31), arrow(197, 34, 197, 78), arrow(191, 77, 145, 77), arrow(137, 77, 95, 77), arrow(105, 84, 105, 123), arrow(112, 123, 154, 123)].join("");
    return wrap("0 0 230 155", die + grid + route);
  });

  register("u2-q5", function () {
    const common = `fill="none" stroke="${INK}" stroke-width="2"`;
    const labels = [txt(15, 18, "a", `font-size="13" font-weight="800" fill="${NAVY}"`), txt(102, 18, "b", `font-size="13" font-weight="800" fill="${NAVY}"`), txt(194, 18, "c", `font-size="13" font-weight="800" fill="${NAVY}"`), txt(281, 18, "d", `font-size="13" font-weight="800" fill="${NAVY}"`)].join("");
    const a = `<g transform="translate(14 20)"><circle cx="35" cy="43" r="31" ${common}/><path d="M35 74 L31 13 M35 74 L61 38" ${common}/><circle cx="35" cy="74" r="2.5" fill="${NAVY}"/><circle cx="31" cy="13" r="2.5" fill="${NAVY}"/><circle cx="61" cy="38" r="2.5" fill="${NAVY}"/></g>`;
    const b = `<g transform="translate(96 20)"><path d="M8 42 L35 7 L62 42 L62 80 L8 80 Z M8 42 H62 M8 42 L62 80 M62 42 L8 80" ${common}/><circle cx="35" cy="61" r="2.5" fill="${NAVY}"/></g>`;
    const c = `<g transform="translate(183 20)"><path d="M5 80 L38 7 L72 80 Z M38 7 V80 M5 80 L55 43" ${common}/><circle cx="38" cy="55" r="2.5" fill="${NAVY}"/><circle cx="55" cy="43" r="2.5" fill="${NAVY}"/><circle cx="38" cy="80" r="2.5" fill="${NAVY}"/></g>`;
    const d = `<g transform="translate(270 17)"><circle cx="42" cy="55" r="29" ${common}/><circle cx="42" cy="55" r="14" ${common}/><path d="M42 41 L42 4 M42 17 C28 7 24 20 31 27 C37 31 42 25 42 17 Z" ${common}/><circle cx="42" cy="41" r="2.5" fill="${NAVY}"/><circle cx="42" cy="26" r="2.5" fill="${NAVY}"/><circle cx="42" cy="17" r="2.5" fill="${NAVY}"/></g>`;
    return wrap("0 0 355 115", labels + a + b + c + d);
  });

  register("u2-q6", function () {
    const cx = 150;
    const cy = 82;
    const rx = 112;
    const ry = 58;
    let body = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${GRID}" stroke-width="1.3" stroke-dasharray="4 5"/>`;
    for (let i = 0; i < 9; i += 1) {
      const angle = (140 + i * 40) * Math.PI / 180;
      const x = cx + rx * Math.cos(angle);
      const y = cy + ry * Math.sin(angle);
      body += `<rect x="${x - 15}" y="${y - 15}" width="30" height="30" rx="3" fill="#fff" stroke="${INK}" stroke-width="1.3"/>${txt(x, y + 5, i + 1, `text-anchor="middle" font-size="15" font-weight="850" fill="${NAVY}"`)}`;
    }
    return wrap("0 0 300 165", body);
  });

  function match(x1, y1, x2, y2) {
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#d5aa79" stroke-width="5"/><circle cx="${x1}" cy="${y1}" r="4" fill="#b84032"/>`;
  }

  register("u2-q7", function () {
    let body = "";
    const tally = (x, count) => Array.from({ length: count }, (_, i) => match(x + i * 12, 18, x + i * 12, 72)).join("");
    body += tally(10, 4);
    body += match(82, 45, 112, 45) + match(97, 30, 97, 60);
    body += tally(130, 3);
    body += match(185, 37, 215, 37) + match(185, 54, 215, 54);
    body += tally(235, 4);
    return wrap("0 0 295 90", body);
  });

  register("u2-q8", function () {
    const shape = `<path d="M20 140 L70 90 V140 H170 V90 L220 140 M70 90 H170 M120 140 V40 H170 V90 M120 40 L170 -10 V40" fill="none" stroke="${INK}" stroke-width="2"/>`;
    const points = [[70, 90], [120, 140], [170, 90], [120, 40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff" stroke="${GOLD}" stroke-width="3"/>`).join("");
    const guide = txt(120, 164, "● 표시한 네 점을 사용하세요", `text-anchor="middle" font-size="10" font-weight="750" fill="${NAVY}"`);
    return wrap("0 -18 240 190", shape + points + guide);
  });

  register("u2-q9", function () {
    const centers = [48, 103, 158, 213, 268];
    const circles = centers.map((cx) => `<circle cx="${cx}" cy="52" r="39" fill="none" stroke="${INK}" stroke-width="1.5"/>`).join("");
    const body = circles + txt(29, 58, "8", `text-anchor="middle" font-size="16" font-weight="800" fill="${NAVY}"`) + txt(131, 58, "1", `text-anchor="middle" font-size="16" font-weight="800" fill="${NAVY}"`) + txt(158, 58, "a", `text-anchor="middle" font-size="16" font-weight="900" fill="#b64032"`) + txt(286, 58, "9", `text-anchor="middle" font-size="16" font-weight="800" fill="${NAVY}"`);
    return wrap("0 0 315 105", body);
  });

  function piece(matrix, ox, oy, cell, label, fill) {
    let body = "";
    matrix.forEach((row, y) => row.split("").forEach((value, x) => {
      if (value === "1") body += `<rect x="${ox + x * cell}" y="${oy + y * cell}" width="${cell}" height="${cell}" fill="${fill}" stroke="#fff" stroke-width="1.4"/>`;
    }));
    const width = Math.max(...matrix.map((row) => row.length)) * cell;
    body += txt(ox + width / 2, oy + matrix.length * cell + 17, label, `text-anchor="middle" font-size="13" font-weight="900" fill="${INK}"`);
    return body;
  }

  register("u2-q10", function () {
    const cell = 15;
    const body = [
      piece(["11", "10", "11"], 7, 5, cell, "U", "#335e8d"),
      piece(["010", "110", "011"], 72, 5, cell, "F", "#567da4"),
      piece(["11", "01", "01", "01"], 142, 5, cell, "L", "#2d5279"),
      piece(["011", "110", "100"], 202, 5, cell, "W", "#6b8ead"),
      piece(["001", "001", "111"], 272, 5, cell, "V", "#416b94")
    ].join("");
    return wrap("0 0 330 92", body);
  });

  function fruit(kind, x, y, scale) {
    const s = scale || 1;
    if (kind === "pear") return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -16 C-7 -12 -9 -5 -7 0 C-14 7 -11 18 0 20 C11 18 14 7 7 0 C9 -5 7 -12 0 -16 Z" fill="#e7b943" stroke="${INK}" stroke-width="1"/><path d="M0 -16 Q4 -23 9 -22" fill="none" stroke="#4c713e" stroke-width="2"/></g>`;
    if (kind === "tomato") return `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="4" r="13" fill="#d95845" stroke="${INK}" stroke-width="1"/><path d="M0 -8 l3 5 6 -2 -4 5 4 4 -7 -2 -4 5 1 -6 -6 -2 6 -1 Z" fill="#4f7c45"/></g>`;
    if (kind === "strawberry") return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 17 C-5 10 -13 4 -11 -5 C-6 -12 6 -12 11 -5 C13 4 5 10 0 17 Z" fill="#dc554d" stroke="${INK}" stroke-width="1"/><path d="M-8 -6 L-2 -11 L0 -6 L5 -11 L9 -5" fill="#52814a" stroke="#52814a" stroke-width="2"/><g fill="#f4d27a"><circle cx="-4" cy="1" r="1"/><circle cx="4" cy="2" r="1"/><circle cx="0" cy="8" r="1"/></g></g>`;
    return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -11 C-13 -13 -17 4 -8 13 C-2 20 8 18 13 9 C19 -1 10 -14 0 -11 Z" fill="#ef9c72" stroke="${INK}" stroke-width="1"/><path d="M1 -10 C5 -18 12 -18 16 -13 C9 -10 6 -8 1 -10 Z" fill="#5e8a50"/></g>`;
  }

  function balance(x, y, leftKinds, rightKinds) {
    const spread = (kinds, center) => kinds.map((kind, i) => fruit(kind, center + (i - (kinds.length - 1) / 2) * 24, y - 17, .72)).join("");
    return `<g>${spread(leftKinds, x + 43)}${spread(rightKinds, x + 143)}<line x1="${x + 10}" y1="${y}" x2="${x + 176}" y2="${y}" stroke="${INK}" stroke-width="2"/><path d="M${x + 43} ${y} v8 h-34 M${x + 143} ${y} v8 h34" fill="none" stroke="${GRID}" stroke-width="1.5"/><path d="M${x + 93} ${y} L${x + 82} ${y + 28} H${x + 104} Z" fill="#d6dce4" stroke="${INK}" stroke-width="1.2"/></g>`;
  }

  register("u2-q11", function () {
    const body = balance(0, 45, ["pear", "pear"], ["tomato", "tomato", "strawberry"]) + balance(187, 45, ["peach", "peach"], ["strawberry", "strawberry", "strawberry"]) + balance(374, 45, ["tomato"], ["peach", "strawberry"]);
    return wrap("0 0 555 82", body);
  });

  register("u2-q14", function () {
    const cx = 110;
    const cy = 76;
    const rx = 72;
    const ry = 61;
    let body = "";
    const points = [];
    for (let i = 0; i < 10; i += 1) {
      const angle = (-90 + i * 36) * Math.PI / 180;
      points.push([cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)]);
    }
    body += poly(points, `fill="none" stroke="${GRID}" stroke-width="2"`);
    points.forEach(([x, y], i) => {
      const fixed = i % 2 === 1;
      body += `<circle cx="${x}" cy="${y}" r="15" fill="#fff" stroke="${fixed ? NAVY : GOLD}" stroke-width="${fixed ? 1.6 : 2.3}"/>`;
      if (fixed) body += txt(x, y + 5, (i + 1) / 2, `text-anchor="middle" font-size="14" font-weight="850" fill="${NAVY}"`);
    });
    return wrap("0 0 220 155", body);
  });

  register("u2-q15", function () {
    return `<div class="rule-box" role="group" aria-label="성씨 찾기 조건">
      <b>조건</b>
      <ul style="margin:2mm 0 0;padding-left:5mm">
        <li>세영이의 외삼촌은 이씨이며, 재명이와 성이 다릅니다.</li>
        <li><b>세영이는 외삼촌과 성이 다릅니다.</b></li>
        <li>재명이의 동생은 김씨입니다.</li>
        <li>지은이는 이씨가 아닙니다.</li>
        <li>지은이의 어머니는 천씨이고, 아버지는 천씨가 아닙니다.</li>
      </ul>
    </div>`;
  });

  function symbol(kind, x, y) {
    if (kind === "circle") return `<circle cx="${x}" cy="${y}" r="9" fill="#5979aa"/>`;
    if (kind === "triangle") return poly([[x, y - 10], [x - 10, y + 9], [x + 10, y + 9]], `fill="#df6885"`);
    if (kind === "square") return `<rect x="${x - 9}" y="${y - 9}" width="18" height="18" fill="#e2b842"/>`;
    return `<rect x="${x - 8}" y="${y - 8}" width="16" height="16" transform="rotate(45 ${x} ${y})" fill="#fff" stroke="#d9985c" stroke-width="2"/>`;
  }

  register("u2-q16", function () {
    const data = [
      ["circle", "triangle", "triangle", "circle"],
      ["square", "circle", "square", "circle"],
      ["diamond", "circle", "diamond", "diamond"],
      ["diamond", "triangle", "diamond", "diamond"]
    ];
    let body = "";
    const ox = 22;
    const oy = 8;
    const size = 38;
    for (let r = 0; r < 4; r += 1) for (let c = 0; c < 4; c += 1) {
      body += `<rect x="${ox + c * size}" y="${oy + r * size}" width="${size}" height="${size}" fill="#fffdf5" stroke="#aab4c0" stroke-width="1"/>`;
      body += symbol(data[r][c], ox + c * size + size / 2, oy + r * size + size / 2);
    }
    [8, 14, 13, 15].forEach((value, i) => { body += txt(ox + 4 * size + 14, oy + i * size + 24, value, `text-anchor="middle" font-size="14" font-weight="850" fill="${INK}"`); });
    ["□", 8, 17, 10].forEach((value, i) => { body += txt(ox + i * size + size / 2, oy + 4 * size + 22, value, `text-anchor="middle" font-size="14" font-weight="850" fill="${i === 0 ? GOLD : INK}"`); });
    return wrap("0 0 210 190", body);
  });

  register("u2-q18", function () {
    const front = [
      [1, 1, 1, 1],
      [1, 2, 2, 1],
      [4, 3, 3, 0]
    ];
    const back = [
      [0, 3, 3, 4],
      [1, 2, 2, 1],
      [1, 1, 1, 1]
    ];
    const body = `${stackBody(front, 105, 108, { sx: 15, sy: 7.5, rise: 16 })}${stackBody(back, 307, 108, { sx: 15, sy: 7.5, rise: 16 })}${txt(105, 142, "앞", `text-anchor="middle" font-size="12" font-weight="850" fill="${NAVY}"`)}${txt(307, 142, "뒤", `text-anchor="middle" font-size="12" font-weight="850" fill="${NAVY}"`)}`;
    return wrap("0 0 410 150", body);
  });

  register("u2-q20", function () {
    let body = "";
    const values = [6, 5, 4, 3, 2, 1];
    values.forEach((value, i) => {
      const x = 20 + i * 50;
      body += txt(x, 42, value, `text-anchor="middle" font-size="22" font-weight="850" fill="${INK}"`);
      if (i < values.length - 1) body += `<circle cx="${x + 25}" cy="35" r="14" fill="#fff" stroke="${NAVY}" stroke-width="1.7"/>`;
    });
    return wrap("0 0 290 70", body);
  });
})(window);
