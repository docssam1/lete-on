(function (global) {
  "use strict";

  const figures = global.PremierFigures;
  if (!figures) throw new Error("PremierFigures가 먼저 로드되어야 합니다.");

  const { register, svg } = figures;
  const INK = "#27313c";
  const GRID = "#aab3bd";
  const NAVY = "#526b9d";
  const PINK = "#ed91b9";
  const YELLOW = "#f2ce57";
  const PEACH = "#e6b97f";

  function wrap(viewBox, body, className) {
    return svg(viewBox, `<g stroke-linecap="round" stroke-linejoin="round">${body}</g>`, className || "wide-svg");
  }

  function txt(x, y, value, attrs) {
    return `<text x="${x}" y="${y}" font-family="Pretendard, Noto Sans KR, sans-serif" ${attrs || ""}>${value}</text>`;
  }

  function polygon(points, attrs) {
    return `<polygon points="${points.map((point) => point.join(",")).join(" ")}" ${attrs || ""}/>`;
  }

  register("u4-q1", function () {
    const x = 92;
    const y = 29;
    const w = 40;
    const h = 31;
    const weeks = [
      ["일", "월", "화", "수", "목", "금", "토"],
      ["1", "2", "3", "4", "5", "6", "7"],
      ["8", "9", "10", "11", "12", "13", "14"],
      ["15", "16", "17", "18", "19", "20", "21"],
      ["22", "23", "24", "25", "26", "27", "28"],
      ["29", "30", "31", "", "", "", ""]
    ];
    let body = txt(232, 17, "&lt;3월&gt;", `text-anchor="middle" font-size="15" font-weight="700" fill="${INK}"`);
    weeks.forEach((week, row) => week.forEach((value, column) => {
      const cx = x + column * w;
      const cy = y + row * h;
      body += `<rect x="${cx}" y="${cy}" width="${w}" height="${h}" fill="#fff" stroke="${INK}" stroke-width="1"/>`;
      if (value) body += txt(cx + w / 2, cy + h * .67, value, `text-anchor="middle" font-size="${row === 0 ? 14 : 15}" font-weight="${row === 0 ? 700 : 500}" fill="${INK}"`);
    }));
    return wrap("0 0 370 225", body);
  });

  register("u4-q3", function () {
    const values = ["1,", "4,", "5,", "1,", "8,", "7,", "1,", "12,", "9,", "1,", "16,", "11,", "1,", "…"];
    const body = `<rect x="10" y="13" width="580" height="76" rx="19" fill="#fff" stroke="${INK}" stroke-width="1.5"/>`
      + values.map((value, index) => txt(51 + index * 39, 57, value, `text-anchor="middle" font-family="Georgia, serif" font-size="21" font-weight="600" fill="${NAVY}"`)).join("");
    return wrap("0 0 600 103", body);
  });

  function symbol(kind, x, y) {
    if (kind === "circle") return `<circle cx="${x}" cy="${y}" r="10" fill="#8394c4"/>`;
    if (kind === "triangle") return polygon([[x, y - 11], [x - 11, y + 9], [x + 11, y + 9]], `fill="${PINK}"`);
    if (kind === "square") return `<rect x="${x - 10}" y="${y - 10}" width="20" height="20" fill="${YELLOW}"/>`;
    return `<rect x="${x - 8}" y="${y - 8}" width="16" height="16" transform="rotate(45 ${x} ${y})" fill="#fff" stroke="${PEACH}" stroke-width="2"/>`;
  }

  register("u4-q4", function () {
    const data = [
      ["circle", "triangle", "triangle", "circle"],
      ["square", "circle", "square", "circle"],
      ["diamond", "circle", "diamond", "diamond"],
      ["diamond", "triangle", "diamond", "diamond"]
    ];
    const cell = 39;
    const ox = 16;
    const oy = 10;
    let body = "";
    data.forEach((row, rowIndex) => row.forEach((kind, columnIndex) => {
      const x = ox + columnIndex * cell;
      const y = oy + rowIndex * cell;
      body += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="#fffef8" stroke="#d8d0a2" stroke-width="1"/>${symbol(kind, x + cell / 2, y + cell / 2)}`;
    }));
    [8, 6, 13, 15].forEach((value, index) => { body += txt(ox + cell * 4 + 24, oy + index * cell + 25, value, `text-anchor="middle" font-size="16" font-weight="750" fill="${INK}"`); });
    ["□", 8, 13, 10].forEach((value, index) => { body += txt(ox + index * cell + cell / 2, oy + cell * 4 + 26, value, `text-anchor="middle" font-size="16" font-weight="750" fill="${index === 0 ? INK : INK}"`); });
    return wrap("0 0 220 205", body);
  });

  function ringMark(kind, x, y) {
    const outer = `<circle cx="${x}" cy="${y}" r="18" fill="#fff" stroke="${INK}" stroke-width="1.25"/>`;
    if (kind === "o") return outer + `<circle cx="${x}" cy="${y}" r="8" fill="none" stroke="${PINK}" stroke-width="2.3"/>`;
    return outer + `<path d="M${x - 7} ${y - 7} L${x + 7} ${y + 7} M${x + 7} ${y - 7} L${x - 7} ${y + 7}" stroke="${PINK}" stroke-width="2.5"/>`;
  }

  register("u4-q5", function () {
    const points = [[115, 22], [165, 58], [146, 117], [84, 117], [65, 58]];
    const kinds = ["o", "x", "o", "o", "o"];
    const body = `<path d="M${points.map((point) => point.join(" ")).join(" L")} Z" fill="none" stroke="${GRID}" stroke-width="2"/>`
      + points.map(([x, y], index) => ringMark(kinds[index], x, y)).join("");
    return wrap("0 0 230 145", body);
  });

  const DIGITS = {
    0: ["a", "b", "c", "d", "e", "f"],
    1: ["b", "c"],
    2: ["a", "b", "g", "e", "d"],
    3: ["a", "b", "c", "d", "g"],
    4: ["f", "g", "b", "c"],
    5: ["a", "f", "g", "c", "d"],
    6: ["a", "f", "g", "e", "c", "d"],
    7: ["a", "b", "c"],
    8: ["a", "b", "c", "d", "e", "f", "g"],
    9: ["a", "b", "c", "d", "f", "g"]
  };

  function sevenSegment(digit, x, y, scale) {
    const s = scale;
    const seg = {
      a: [[4, 0], [25, 0], [29, 4], [25, 8], [4, 8], [0, 4]],
      g: [[4, 30], [25, 30], [29, 34], [25, 38], [4, 38], [0, 34]],
      d: [[4, 60], [25, 60], [29, 64], [25, 68], [4, 68], [0, 64]],
      f: [[0, 5], [4, 9], [4, 29], [0, 33], [-4, 29], [-4, 9]],
      b: [[29, 5], [33, 9], [33, 29], [29, 33], [25, 29], [25, 9]],
      e: [[0, 35], [4, 39], [4, 59], [0, 63], [-4, 59], [-4, 39]],
      c: [[29, 35], [33, 39], [33, 59], [29, 63], [25, 59], [25, 39]]
    };
    return DIGITS[digit].map((name) => polygon(seg[name].map(([px, py]) => [x + px * s, y + py * s]), `fill="#66706e"`)).join("");
  }

  register("u4-q6", function () {
    const body = `<rect x="7" y="8" width="210" height="93" rx="7" fill="#e3e8e9" stroke="#718086" stroke-width="2"/>`
      + `<rect x="15" y="16" width="194" height="77" rx="3" fill="#fbfcf9" stroke="#c3cbcc" stroke-width="1"/>`
      + sevenSegment(0, 31, 22, .78) + sevenSegment(2, 69, 22, .78)
      + `<circle cx="110" cy="45" r="3" fill="#66706e"/><circle cx="110" cy="70" r="3" fill="#66706e"/>`
      + sevenSegment(5, 126, 22, .78) + sevenSegment(2, 164, 22, .78);
    return wrap("0 0 225 110", body);
  });

  function pip(x, y, count, size) {
    const d = size * .23;
    const at = (px, py) => `<circle cx="${x + px * d}" cy="${y + py * d}" r="${Math.max(2, size * .058)}" fill="${INK}"/>`;
    const positions = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
    return (positions[count] || []).map(([px, py]) => at(px, py)).join("");
  }

  function diceNet(cells, ox, oy, size) {
    return cells.map(([column, row, value]) => {
      const x = ox + column * size;
      const y = oy + row * size;
      return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#fff" stroke="${INK}" stroke-width="1.1"/>${value ? pip(x + size / 2, y + size / 2, value, size) : ""}`;
    }).join("");
  }

  register("u4-q7", function () {
    const nets = [
      [[1, 0, 1], [0, 1, 3], [1, 1, 2], [2, 1], [3, 1], [1, 2]],
      [[1, 0, 2], [0, 1], [1, 1, 6], [2, 1, 3], [2, 2], [3, 2]],
      [[2, 0, 4], [1, 1], [2, 1, 6], [0, 2], [1, 2], [0, 3, 2]],
      [[1, 0, 4], [0, 1, 5], [1, 1, 6], [2, 1], [3, 1], [0, 2]]
    ];
    const frames = [[8, 8], [218, 8], [8, 161], [218, 161]];
    const body = frames.map(([x, y]) => `<rect x="${x}" y="${y}" width="178" height="126" rx="12" fill="#fff" stroke="#f0d6c7" stroke-width="1.2"/>`).join("")
      + diceNet(nets[0], 31, 23, 29) + diceNet(nets[1], 250, 25, 29)
      + diceNet(nets[2], 35, 173, 29) + diceNet(nets[3], 245, 181, 29);
    return wrap("0 0 410 300", body);
  });
})(window);
