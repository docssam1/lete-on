(function (global) {
  "use strict";
  const figures = global.PremierFigures;
  if (!figures) throw new Error("PremierFigures가 먼저 로드되어야 합니다.");
  const { register, svg } = figures;
  const INK = "#27313c";
  const GRID = "#98a4b1";
  const NAVY = "#526b9d";
  const PALE = "#eef3f6";

  function wrap(viewBox, body, className) { return svg(viewBox, `<g stroke-linecap="round" stroke-linejoin="round">${body}</g>`, className || "wide-svg"); }
  function text(x, y, value, attrs) { return `<text x="${x}" y="${y}" font-family="Pretendard, Noto Sans KR, sans-serif" ${attrs || ""}>${value}</text>`; }
  function poly(points, attrs) { return `<polygon points="${points.map((point) => point.join(",")).join(" ")}" ${attrs || ""}/>`; }

  register("u5-q15", function () {
    const rows = [[1, "+", 7, "=", 8], [12, "+", 3, "=", 3], [11, "+", 5, "=", 4], [7, "+", 7, "=", ""]];
    const cellW = 44;
    const cellH = 32;
    const ox = 20;
    const oy = 7;
    let body = "";
    rows.forEach((row, rowIndex) => row.forEach((value, column) => {
      const x = ox + column * cellW;
      const y = oy + rowIndex * cellH;
      body += `<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" fill="${value === "" ? "#fff6d9" : "#fff"}" stroke="${GRID}" stroke-width="1.1"/>`;
      if (value !== "") body += text(x + cellW / 2, y + 22, value, `text-anchor="middle" font-size="17" font-weight="800" fill="${INK}"`);
    }));
    return wrap("0 0 250 145", body);
  });

  register("u5-q16", function () {
    const lines = [
      "• A, B는 남자이고, C, D, E는 여자입니다.",
      "• 1, 2층은 남학생의 집이고, 3, 4, 5층은 여학생의 집입니다.",
      "• C는 가장 위층에 살고 있습니다.",
      "• B는 2층에 살고 있으며 E의 바로 아래에 살고 있습니다."
    ];
    let body = `<rect x="8" y="8" width="445" height="113" rx="7" fill="#fbfcfd" stroke="${GRID}" stroke-width="1.2"/>`;
    lines.forEach((line, index) => { body += text(20, 32 + index * 23, line, `font-size="13" font-weight="650" fill="${INK}"`); });
    const x = 150;
    const y = 138;
    for (let floor = 5; floor >= 1; floor -= 1) {
      const top = y + (5 - floor) * 29;
      body += `<rect x="${x}" y="${top}" width="140" height="29" fill="#fff" stroke="${GRID}" stroke-width="1.1"/>${text(x + 12, top + 20, `${floor}층`, `font-size="13" font-weight="750" fill="${NAVY}"`)}`;
    }
    return wrap("0 0 465 292", body);
  });

  function block(x, y, w, h) {
    const d = 10;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#d9dde2" stroke="${INK}" stroke-width="1"/>${poly([[x, y], [x + d, y - d], [x + w + d, y - d], [x + w, y]], `fill="#f6f7f8" stroke="${INK}" stroke-width="1"`)}${poly([[x + w, y], [x + w + d, y - d], [x + w + d, y + h - d], [x + w, y + h]], `fill="#bfc8d1" stroke="${INK}" stroke-width="1"`)}`;
  }

  register("u5-q17", function () {
    let body = `<rect x="20" y="8" width="260" height="68" rx="5" fill="#fafbfc" stroke="${GRID}" stroke-width="1"/>`;
    body += text(34, 29, "보기", `font-size="13" font-weight="800" fill="${NAVY}"`) + block(150, 25, 24, 38);
    body += text(25, 105, "(1)", `font-size="14" font-weight="800" fill="${NAVY}"`);
    body += block(67, 157, 28, 42) + block(102, 176, 28, 42) + block(137, 176, 28, 42) + block(172, 176, 28, 42)
      + block(102, 143, 28, 28) + block(137, 143, 28, 28) + block(172, 143, 28, 28) + block(102, 108, 28, 28) + block(137, 108, 28, 28);
    body += text(190, 105, "(2)", `font-size="14" font-weight="800" fill="${NAVY}"`);
    body += block(224, 154, 28, 48) + block(259, 154, 28, 48) + block(294, 154, 28, 48) + block(329, 154, 28, 48)
      + block(259, 119, 28, 28) + block(294, 119, 28, 28) + block(259, 84, 28, 28) + block(294, 84, 28, 28);
    return wrap("0 0 390 230", body);
  });

  function triangle(x, y, top, left, right, inside) {
    return `<path d="M${x} ${y + 53} L${x + 48} ${y} L${x + 96} ${y + 53} Z" fill="#e2e5e8" stroke="${INK}" stroke-width="1.2"/>`
      + `<circle cx="${x + 48}" cy="${y}" r="14" fill="#fff" stroke="${GRID}" stroke-width="1.1"/>${text(x + 48, y + 6, top, `text-anchor="middle" font-size="13" font-weight="800" fill="${INK}"`)}`
      + `<circle cx="${x}" cy="${y + 53}" r="14" fill="#fff" stroke="${GRID}" stroke-width="1.1"/>${text(x, y + 59, left, `text-anchor="middle" font-size="13" font-weight="800" fill="${INK}"`)}`
      + `<circle cx="${x + 96}" cy="${y + 53}" r="14" fill="#fff" stroke="${GRID}" stroke-width="1.1"/>${right === "" ? "" : text(x + 96, y + 59, right, `text-anchor="middle" font-size="13" font-weight="800" fill="${INK}"`)}`
      + text(x + 48, y + 35, inside, `text-anchor="middle" font-size="14" font-weight="800" fill="${NAVY}"`);
  }

  register("u5-q18", function () {
    const body = triangle(24, 17, 5, 9, 7, 7) + triangle(168, 17, 3, 8, 6, 5) + triangle(24, 108, 8, 1, 3, 6) + triangle(168, 108, 4, 4, "", 5);
    return wrap("0 0 290 184", body);
  });

  function arrow(x1, y1, x2, y2, head) {
    const endX = x2;
    const endY = y2;
    const angle = Math.atan2(endY - y1, endX - x1);
    const bx = endX - Math.cos(angle) * 9;
    const by = endY - Math.sin(angle) * 9;
    const left = [bx + Math.cos(angle + Math.PI / 2) * 4, by + Math.sin(angle + Math.PI / 2) * 4];
    const right = [bx + Math.cos(angle - Math.PI / 2) * 4, by + Math.sin(angle - Math.PI / 2) * 4];
    return `<line x1="${x1}" y1="${y1}" x2="${head ? bx : x2}" y2="${head ? by : y2}" stroke="${INK}" stroke-width="2"/>${head ? poly([[endX, endY], left, right], `fill="${INK}" stroke="none"`) : ""}`;
  }
  function arrowCell(x, y, kind) {
    let drawing = "";
    if (kind === "up") drawing = arrow(x + 36, y + 57, x + 36, y + 18, true);
    if (kind === "right") drawing = arrow(x + 17, y + 37, x + 57, y + 37, true);
    if (kind === "down") drawing = arrow(x + 36, y + 18, x + 36, y + 57, true);
    if (kind === "rise") drawing = arrow(x + 16, y + 57, x + 57, y + 17, false);
    if (kind === "fall") drawing = arrow(x + 16, y + 17, x + 57, y + 57, false);
    if (kind === "downleft") drawing = arrow(x + 57, y + 17, x + 16, y + 57, true);
    if (kind === "upleft") drawing = arrow(x + 57, y + 57, x + 16, y + 17, true);
    if (kind === "horizontal") drawing = arrow(x + 16, y + 37, x + 57, y + 37, false);
    return `<rect x="${x}" y="${y}" width="74" height="74" fill="#fff" stroke="${GRID}" stroke-width="1.1"/>${drawing}`;
  }
  register("u5-q19", function () {
    const kinds = [["up", "rise", "right"], ["downleft", "horizontal", "upleft"], ["up", "fall", ""]];
    let body = "";
    kinds.forEach((row, rowIndex) => row.forEach((kind, column) => { body += arrowCell(8 + column * 86, 8 + rowIndex * 86, kind); }));
    return wrap("0 0 275 265", body);
  });
})(window);
