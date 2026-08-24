(function (global) {
  "use strict";
  const figures = global.PremierFigures;
  if (!figures) throw new Error("PremierFigures가 먼저 로드되어야 합니다.");
  const { register, svg } = figures;
  const INK = "#27313c";
  const GRID = "#9aa5b0";
  const NAVY = "#526b9d";
  const PALE = "#eef3f6";

  function wrap(viewBox, body, className) { return svg(viewBox, `<g stroke-linecap="round" stroke-linejoin="round">${body}</g>`, className || "wide-svg"); }
  function text(x, y, value, attrs) { return `<text x="${x}" y="${y}" font-family="Pretendard, Noto Sans KR, sans-serif" ${attrs || ""}>${value}</text>`; }

  register("u5-q8", function () {
    const values = [[1, 2, 1, 0, 1], ["", "", "", "", ""], [1, 1, 1, "", 1], [0, 1, "", "", 2], [1, 0, 1, "", 1]];
    const cell = 37;
    const ox = 20;
    const oy = 9;
    let body = "";
    values.forEach((row, rowIndex) => row.forEach((value, column) => {
      const x = ox + column * cell;
      const y = oy + rowIndex * cell;
      const marked = rowIndex === 3 && column === 2;
      body += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${marked ? "#e6c771" : (value === "" ? "#fff" : PALE)}" stroke="${GRID}" stroke-width="1.1"/>`;
      if (value !== "") body += text(x + cell / 2, y + 24, value, `text-anchor="middle" font-size="17" font-weight="800" fill="${INK}"`);
    }));
    return wrap("0 0 240 205", body);
  });

  register("u5-q10", function () {
    const rows = [[3, 4, 1, 2, 1, 9], [2, 7, 4, 3, 4, 7], [6, 1, 5, 5, "", ""]];
    const cell = 37;
    const ox = 12;
    const oy = 8;
    let body = "";
    rows.forEach((row, rowIndex) => row.forEach((value, column) => {
      const x = ox + column * cell;
      const y = oy + rowIndex * cell;
      body += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${value === "" ? "#fff6d9" : "#fff"}" stroke="${GRID}" stroke-width="1.1"/>`;
      if (value !== "") body += text(x + cell / 2, y + 25, value, `text-anchor="middle" font-size="17" font-weight="800" fill="${INK}"`);
    }));
    return wrap("0 0 250 126", body);
  });

  function numberPyramid(x, y, levels) {
    const cell = 22;
    let body = "";
    for (let row = 1; row <= levels; row += 1) {
      const start = x + (levels - row) * cell / 2;
      for (let column = 0; column < row * 2 - 1; column += 1) {
        const value = Math.min(column + 1, row * 2 - 1 - column);
        body += `<rect x="${start + column * cell}" y="${y + (levels - row) * cell}" width="${cell}" height="${cell}" fill="#fff" stroke="${GRID}" stroke-width=".9"/>`;
        body += text(start + column * cell + cell / 2, y + (levels - row) * cell + 15, value, `text-anchor="middle" font-size="12" font-weight="750" fill="${INK}"`);
      }
    }
    return body;
  }

  register("u5-q12", function () {
    const body = numberPyramid(16, 47, 1) + numberPyramid(98, 25, 2) + numberPyramid(212, 3, 3)
      + text(27, 86, "1번째", `text-anchor="middle" font-size="12" font-weight="700" fill="${NAVY}"`)
      + text(131, 86, "2번째", `text-anchor="middle" font-size="12" font-weight="700" fill="${NAVY}"`)
      + text(266, 86, "3번째", `text-anchor="middle" font-size="12" font-weight="700" fill="${NAVY}"`);
    return wrap("0 0 340 98", body);
  });

  register("u5-q14", function () {
    const rows = [[4], [6, 2], [9, 3, 1], [19, 10, 7, ""]];
    const cell = 39;
    const ox = 52;
    const oy = 8;
    let body = "";
    rows.forEach((row, rowIndex) => row.forEach((value, column) => {
      const x = ox + column * cell;
      const y = oy + rowIndex * cell;
      body += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${value === "" ? "#fff6d9" : "#fff"}" stroke="${GRID}" stroke-width="1.1"/>`;
      if (value !== "") body += text(x + cell / 2, y + 25, value, `text-anchor="middle" font-size="16" font-weight="800" fill="${INK}"`);
    }));
    return wrap("0 0 235 174", body);
  });
})(window);
