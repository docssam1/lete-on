(function (global) {
  "use strict";

  const figures = global.PremierFigures;
  if (!figures) throw new Error("PremierFigures가 먼저 로드되어야 합니다.");

  const { register, svg } = figures;
  const INK = "#1c2734";
  const NAVY = "#173a6b";
  const GOLD = "#c9a34d";
  const GRID = "#8190a2";
  const PINK = "#df6c9c";
  const LIGHT_PINK = "#efbdd0";
  const PURPLE = "#ce84c9";
  const SKY = "#55aee4";

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

  function poly(points, attrs) {
    return `<polygon points="${points.map((point) => point.join(",")).join(" ")}" ${attrs || ""}/>`;
  }

  function coin(cx, cy, value, radius) {
    const r = radius || 22;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff8df" stroke="${GOLD}" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy}" r="${r - 5}" fill="none" stroke="${GOLD}" stroke-width="1.1" opacity=".65"/>
      ${txt(cx, cy + 5, `${value}원`, `text-anchor="middle" font-size="12" font-weight="850" fill="${INK}"`)}`;
  }

  register("u4-q15", function () {
    const body = `<rect x="28" y="24" width="116" height="72" rx="6" fill="#fff" stroke="${INK}" stroke-width="1.5"/>
      ${txt(86, 53, "지우개", `text-anchor="middle" font-size="18" font-weight="850" fill="${INK}"`)}
      ${txt(86, 80, "200원", `text-anchor="middle" font-size="18" font-weight="900" fill="${NAVY}"`)}
      ${coin(226, 60, 10)}
      ${coin(296, 60, 50)}
      ${txt(261, 110, "사용할 수 있는 동전", `text-anchor="middle" font-size="13" font-weight="800" fill="${GRID}"`)}`;
    return wrap("0 0 360 128", body);
  });

  register("u4-q16", function () {
    return `<div class="rule-box" role="group" aria-label="키 비교 조건">
      <p style="margin:0 0 .4em">연두 : 나는 작년에 1m 29cm였는데, 6cm가 더 컸습니다.</p>
      <p style="margin:.2em 0">주홍 : 나는 연두보다 9cm가 더 작고, 윤수보다 5cm가 더 큽니다.</p>
      <p style="margin:.4em 0 0">보라 : 나는 윤수보다 15cm가 더 큽니다.</p>
    </div>`;
  });

  function mirrorTile(x, y, size, fills) {
    const cx = x + size / 2;
    const cy = y + size / 2;
    const top = [[x, y], [x + size, y], [cx, cy]];
    const right = [[x + size, y], [x + size, y + size], [cx, cy]];
    const bottom = [[x + size, y + size], [x, y + size], [cx, cy]];
    const left = [[x, y + size], [x, y], [cx, cy]];
    const color = (name) => fills[name] || "#fff";
    return `${poly(top, `fill="${color("top")}" stroke="none"`)}
      ${poly(right, `fill="${color("right")}" stroke="none"`)}
      ${poly(bottom, `fill="${color("bottom")}" stroke="none"`)}
      ${poly(left, `fill="${color("left")}" stroke="none"`)}
      <rect x="${x}" y="${y}" width="${size}" height="${size}" fill="none" stroke="${INK}" stroke-width="1.8"/>
      <line x1="${x}" y1="${y}" x2="${x + size}" y2="${y + size}" stroke="${INK}" stroke-width="1.8"/>
      <line x1="${x + size}" y1="${y}" x2="${x}" y2="${y + size}" stroke="${INK}" stroke-width="1.8"/>`;
  }

  function choiceLabel(x, y, value) {
    return txt(x, y, value, `text-anchor="middle" font-size="16" font-weight="850" fill="${NAVY}"`);
  }

  register("u4-q17", function () {
    const source = mirrorTile(18, 18, 78, { right: LIGHT_PINK, bottom: PINK });
    const one = mirrorTile(60, 128, 44, { right: LIGHT_PINK, bottom: PINK });
    const two = mirrorTile(198, 128, 44, { right: LIGHT_PINK, bottom: PINK })
      + mirrorTile(245, 128, 44, { left: LIGHT_PINK, bottom: PINK });
    const three = mirrorTile(375, 128, 44, { top: PINK, right: LIGHT_PINK, bottom: PINK });
    const four = mirrorTile(512, 128, 44, { right: LIGHT_PINK, bottom: PINK })
      + mirrorTile(556, 172, 44, { top: PINK, left: LIGHT_PINK });
    const body = `${source}
      ${choiceLabel(37, 155, "①")}${one}
      ${choiceLabel(177, 155, "②")}${two}
      ${choiceLabel(354, 155, "③")}${three}
      ${choiceLabel(491, 155, "④")}${four}`;
    return wrap("0 0 630 230", body);
  });

  function arrowShape(x, y, direction) {
    if (direction === "down") return `<path d="M${x} ${y} v25" stroke="${SKY}" stroke-width="11"/><path d="M${x - 16} ${y + 20} l16 21 l16 -21 Z" fill="${SKY}" stroke="none"/>`;
    if (direction === "up") return `<path d="M${x} ${y + 41} v-25" stroke="${SKY}" stroke-width="11"/><path d="M${x - 16} ${y + 21} l16 -21 l16 21 Z" fill="${SKY}" stroke="none"/>`;
    if (direction === "right") return `<path d="M${x} ${y} h25" stroke="${SKY}" stroke-width="11"/><path d="M${x + 20} ${y - 16} l21 16 l-21 16 Z" fill="${SKY}" stroke="none"/>`;
    return `<path d="M${x + 41} ${y} h-25" stroke="${SKY}" stroke-width="11"/><path d="M${x + 21} ${y - 16} l-21 16 l21 16 Z" fill="${SKY}" stroke="none"/>`;
  }

  function childIcon(x, y) {
    return `<circle cx="${x}" cy="${y - 20}" r="9" fill="#f3d1b3" stroke="${INK}" stroke-width=".8"/>
      <path d="M${x - 10} ${y - 22} q10 -14 20 0" fill="none" stroke="#6d5947" stroke-width="3"/>
      <rect x="${x - 7}" y="${y - 10}" width="14" height="22" rx="5" fill="#e46e4e" stroke="${INK}" stroke-width=".8"/>
      <line x1="${x - 5}" y1="${y + 12}" x2="${x - 8}" y2="${y + 22}" stroke="${INK}" stroke-width=".8"/>
      <line x1="${x + 5}" y1="${y + 12}" x2="${x + 8}" y2="${y + 22}" stroke="${INK}" stroke-width=".8"/>`;
  }

  function sheep(x, y, scale) {
    const s = scale || 1;
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <ellipse cx="0" cy="2" rx="13" ry="9" fill="#ffe08a" stroke="#caa24d" stroke-width="1"/>
      <circle cx="10" cy="-2" r="5.5" fill="#fff" stroke="#caa24d" stroke-width="1"/>
      <circle cx="12" cy="-3" r="1" fill="${INK}" stroke="none"/>
      <path d="M-6 10 v5 M4 10 v5" stroke="#9d7b34" stroke-width="1.4"/>
    </g>`;
  }

  function pen(x, y, count, row, column) {
    const spots = {
      1: [[0, 3]],
      2: [[-11, 2], [11, -5]],
      3: [[-14, 5], [4, -5], [16, 6]]
    };
    let body = `<g data-sheep-count="${count}" data-row="${row}" data-column="${column}">
      <rect x="${x}" y="${y}" width="74" height="66" rx="5" fill="#fff0cf" stroke="#e6c08d" stroke-width="1.2"/>
      <ellipse cx="${x + 37}" cy="${y + 33}" rx="28" ry="23" fill="#fff9ee" stroke="#c98a4b" stroke-width="2" stroke-dasharray="4 4"/>`;
    (spots[count] || []).forEach(([dx, dy]) => {
      body += sheep(x + 37 + dx, y + 34 + dy, .9);
    });
    return `${body}</g>`;
  }

  register("u4-q18", function () {
    const counts = [
      [2, 3, 0],
      [2, 0, 3],
      [1, 2, 2]
    ];
    const ox = 94;
    const oy = 70;
    const cellW = 74;
    const cellH = 66;
    let body = "";
    counts.forEach((row, rowIndex) => row.forEach((count, columnIndex) => {
      body += pen(ox + columnIndex * cellW, oy + rowIndex * cellH, count, rowIndex, columnIndex);
    }));
    for (let c = 1; c < 3; c += 1) {
      const x = ox + c * cellW;
      body += `<rect x="${x - 4}" y="${oy - 14}" width="8" height="${cellH * 3 + 28}" rx="4" fill="${PURPLE}" stroke="#b869b3" stroke-width="1.2"/>`;
    }
    for (let r = 1; r < 3; r += 1) {
      const y = oy + r * cellH;
      body += `<rect x="${ox - 12}" y="${y - 4}" width="${cellW * 3 + 24}" height="8" rx="4" fill="${PURPLE}" stroke="#b869b3" stroke-width="1.2"/>`;
    }
    body += childIcon(205, 34) + arrowShape(205, 50, "down");
    body += childIcon(205, 324) + arrowShape(205, 282, "up");
    body += childIcon(41, 198) + arrowShape(56, 186, "right");
    body += childIcon(370, 198) + arrowShape(330, 186, "left");
    return wrap("0 0 415 355", body);
  });

  function stepArrow(x1, y1, x2, y2) {
    return `<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="${INK}" stroke-width="4" marker-end="url(#u4-q19-step)"/>`;
  }

  function foldPanel(x, y, width, height, crease) {
    let body = `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#fff" stroke="${INK}" stroke-width="1.3"/>`;
    if (crease === "vertical") body += `<line x1="${x + width / 2}" y1="${y}" x2="${x + width / 2}" y2="${y + height}" stroke="${INK}" stroke-width="1" stroke-dasharray="4 4"/>`;
    if (crease === "horizontal") body += `<line x1="${x}" y1="${y + height / 2}" x2="${x + width}" y2="${y + height / 2}" stroke="${INK}" stroke-width="1" stroke-dasharray="4 4"/>`;
    return body;
  }

  function foldArrow(path) {
    return `<path d="${path}" fill="none" stroke="${INK}" stroke-width="2" marker-end="url(#u4-q19-fold)"/>`;
  }

  function numberGrid(matrix, x, y) {
    const cell = 38;
    let body = "";
    matrix.forEach((row, rowIndex) => row.forEach((value, columnIndex) => {
      const px = x + columnIndex * cell;
      const py = y + rowIndex * cell;
      body += `<rect x="${px}" y="${py}" width="${cell}" height="${cell}" fill="#fff" stroke="${INK}" stroke-width="1.1"/>
        ${txt(px + cell / 2, py + 25, value, `text-anchor="middle" font-size="18" font-family="serif" font-weight="700" fill="${INK}"`)}`;
    }));
    return body;
  }

  register("u4-q19", function () {
    const grid = [
      [2, 1, 3, 1, 6, 7, 8, 9],
      [5, 7, 4, 9, 2, 3, 5, 4],
      [4, 7, 5, 1, 6, 9, 1, 7],
      [1, 2, 3, 5, 5, 5, 3, 2]
    ];
    const body = `<defs>
      <marker id="u4-q19-fold" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L10 5 L0 10 Z" fill="${INK}"/>
      </marker>
      <marker id="u4-q19-step" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L10 5 L0 10 Z" fill="${INK}"/>
      </marker>
    </defs>
      ${foldPanel(10, 16, 112, 56, "vertical")}
      ${foldArrow("M79 41 Q68 54 55 35")}
      ${stepArrow(134, 44, 155, 44)}
      ${foldPanel(170, 16, 56, 56, "horizontal")}
      ${foldArrow("M200 31 Q186 42 205 56")}
      ${stepArrow(238, 44, 259, 44)}
      ${foldPanel(274, 25, 84, 38, "vertical")}
      ${foldArrow("M315 41 Q299 53 332 34")}
      ${stepArrow(370, 44, 391, 44)}
      ${foldPanel(406, 16, 56, 56, "horizontal")}
      ${foldArrow("M434 58 Q445 38 421 29")}
      ${stepArrow(474, 44, 495, 44)}
      ${foldPanel(510, 32, 56, 24, "vertical")}
      ${foldArrow("M547 43 Q531 31 519 47")}
      ${stepArrow(578, 44, 599, 44)}
      ${foldPanel(614, 32, 24, 24, null)}
      ${numberGrid(grid, 178, 104)}`;
    return wrap("0 0 660 275", body);
  });

  function rod(x, y, length) {
    return `<rect x="${x}" y="${y}" width="${length}" height="8" fill="#d8d8d8" stroke="${INK}" stroke-width=".9"/>`;
  }

  function overlapMark(x, y) {
    return `<path d="M${x} ${y - 2} q-5 6 0 12 M${x + 5} ${y - 2} q-5 6 0 12 M${x + 10} ${y - 2} q-5 6 0 12" fill="none" stroke="${INK}" stroke-width="1.2"/>`;
  }

  register("u4-q20", function () {
    const y = 52;
    const length = 120;
    const overlap = 16;
    const starts = [38, 38 + length - overlap, 38 + (length - overlap) * 2, 38 + (length - overlap) * 3];
    let body = starts.map((x) => rod(x, y, length)).join("");
    starts.slice(1).forEach((x) => {
      body += overlapMark(x, y);
    });
    const x1 = starts[1];
    const x2 = starts[1] + overlap;
    body += `<line x1="${x1}" y1="${y + 24}" x2="${x2}" y2="${y + 24}" stroke="${INK}" stroke-width="1.2"/>
      <path d="M${x1} ${y + 24} l8 -4 M${x1} ${y + 24} l8 4 M${x2} ${y + 24} l-8 -4 M${x2} ${y + 24} l-8 4" fill="none" stroke="${INK}" stroke-width="1.2"/>
      <line x1="${x1}" y1="${y + 10}" x2="${x1}" y2="${y + 29}" stroke="${INK}" stroke-width=".9"/>
      <line x1="${x2}" y1="${y + 10}" x2="${x2}" y2="${y + 29}" stroke="${INK}" stroke-width=".9"/>
      ${txt((x1 + x2) / 2, y + 43, "4cm", `text-anchor="middle" font-size="13" font-family="serif" fill="${INK}"`)}
      ${txt(starts[starts.length - 1] + length + 22, y + 8, "…", `font-size="18" font-weight="850" fill="${INK}"`)}`;
    return wrap("0 0 500 120", body);
  });
})(window);
