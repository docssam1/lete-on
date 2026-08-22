(function (global) {
  "use strict";

  const figures = global.PremierFigures;
  if (!figures) throw new Error("PremierFigures가 먼저 로드되어야 합니다.");
  const { register, svg } = figures;
  const INK = "#27313c";
  const GRID = "#95a1af";
  const NAVY = "#526b9d";
  const PALE = "#eef3f6";
  const ACCENT = "#d9b45a";

  function wrap(viewBox, body, className) {
    return svg(viewBox, `<g stroke-linecap="round" stroke-linejoin="round">${body}</g>`, className || "wide-svg");
  }
  function text(x, y, value, attrs) {
    return `<text x="${x}" y="${y}" font-family="Pretendard, Noto Sans KR, sans-serif" ${attrs || ""}>${value}</text>`;
  }
  function poly(points, attrs) {
    return `<polygon points="${points.map((point) => point.join(",")).join(" ")}" ${attrs || ""}/>`;
  }
  function tri(x, y, up, attrs) {
    const h = 19;
    return up ? poly([[x, y + h], [x + 11, y], [x + 22, y + h]], attrs) : poly([[x, y], [x + 22, y], [x + 11, y + h]], attrs);
  }

  register("u5-q1", function () {
    const values = [2, 3, 4, 6, 9, 7, 0];
    const body = values.map((value, index) => {
      const x = 15 + index * 48;
      return `<rect x="${x}" y="14" width="38" height="44" rx="4" fill="${index % 2 ? "#f9fafb" : PALE}" stroke="${GRID}" stroke-width="1.3"/>${text(x + 19, 43, value, `text-anchor="middle" font-size="20" font-weight="800" fill="${INK}"`)}`;
    }).join("");
    return wrap("0 0 350 74", body);
  });

  register("u5-q2", function () {
    const headers = ["1회", "2회", "3회", "4회", "5회", "6회", "7회"];
    const rows = [["현정", "○", "×", "×", "○", "○", "○", "×"], ["지연", "×", "○", "○", "×", "×", "×", "○"]];
    const x = 10;
    const y = 12;
    const cell = 39;
    let body = "";
    [0, 1, 2].forEach((row) => {
      for (let column = 0; column < 8; column += 1) {
        body += `<rect x="${x + column * cell}" y="${y + row * 34}" width="${cell}" height="34" fill="${row === 0 || column === 0 ? "#f4f6f8" : "#fff"}" stroke="${GRID}" stroke-width="1"/>`;
      }
    });
    body += text(x + 19, y + 22, "이름", `text-anchor="middle" font-size="12" font-weight="700" fill="${INK}"`);
    headers.forEach((value, index) => { body += text(x + (index + 1) * cell + cell / 2, y + 22, value, `text-anchor="middle" font-size="12" font-weight="700" fill="${INK}"`); });
    rows.forEach((row, rowIndex) => row.forEach((value, column) => {
      body += text(x + column * cell + cell / 2, y + (rowIndex + 1) * 34 + 23, value, `text-anchor="middle" font-size="${column ? 19 : 14}" font-weight="${column ? 800 : 700}" fill="${column ? NAVY : INK}"`);
    }));
    return wrap("0 0 335 124", body);
  });

  function optionShape(originX, originY, cells, label) {
    let body = text(originX, originY - 8, label, `font-size="13" font-weight="800" fill="${NAVY}"`);
    cells.forEach(([column, row, up]) => { body += tri(originX + 14 + column * 22, originY + row * 18, up, `fill="#fff" stroke="${INK}" stroke-width="1.05"`); });
    return body;
  }

  register("u5-q4", function () {
    let body = "";
    const top = [[0, 0, true], [1, 0, false], [2, 0, true], [3, 0, false], [4, 0, true], [5, 0, false], [6, 0, true], [7, 0, false], [8, 0, true], [9, 0, false], [10, 0, true], [11, 0, false]]
      .concat([[0, 1, false], [1, 1, true], [2, 1, false], [3, 1, true], [4, 1, false], [5, 1, true], [6, 1, false], [7, 1, true], [8, 1, false], [9, 1, true], [10, 1, false]]);
    top.concat([[0, 2, true], [0, 3, false], [1, 2, false], [8, 2, true], [8, 3, false], [9, 2, false]]).forEach(([column, row, up]) => { body += tri(32 + column * 20, 12 + row * 17, up, `fill="#fff" stroke="${INK}" stroke-width=".9"`); });
    const choices = [
      [[0, 0, true], [0, 1, false], [1, 1, true], [1, 2, false], [2, 2, true]],
      [[0, 0, true], [0, 1, false], [1, 1, true], [1, 2, false], [1, 3, true]],
      [[0, 0, true], [1, 0, false], [1, 1, true], [2, 1, false], [2, 2, true]],
      [[0, 0, true], [1, 0, false], [2, 0, true], [3, 0, false]],
      [[0, 0, true], [1, 0, false], [2, 0, true], [3, 0, false], [4, 0, true]]
    ];
    [[12, 116], [92, 116], [172, 116], [30, 190], [162, 190]].forEach(([x, y], index) => { body += optionShape(x, y, choices[index], `${index + 1}`); });
    return wrap("0 0 300 240", body);
  });

  register("u5-q6", function () {
    const rows = [[8, 8, 9, 7], [7, 5, 9, 3], [1, 6, 4, 3], [1, 3, 2, ""]];
    const cell = 42;
    const ox = 42;
    const oy = 10;
    let body = "";
    rows.forEach((row, rowIndex) => row.forEach((value, column) => {
      const x = ox + column * cell;
      const y = oy + rowIndex * cell;
      body += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${value === "" ? "#fff6d9" : "#fff"}" stroke="${GRID}" stroke-width="1.2"/>`;
      if (value !== "") body += text(x + cell / 2, y + 27, value, `text-anchor="middle" font-size="18" font-weight="800" fill="${INK}"`);
    }));
    return wrap("0 0 260 190", body);
  });

  function colorGrid(x, y, shaded) {
    let body = "";
    for (let row = 0; row < 3; row += 1) for (let column = 0; column < 3; column += 1) {
      body += `<rect x="${x + column * 20}" y="${y + row * 20}" width="20" height="20" fill="${shaded.some(([a, b]) => a === column && b === row) ? "#9aa6b4" : "#fff"}" stroke="${INK}" stroke-width=".9"/>`;
    }
    return body;
  }

  register("u5-q7", function () {
    const patterns = [
      [[0, 0], [1, 1], [0, 2]], [[2, 0], [0, 1], [1, 2]], [[0, 0], [1, 1], [1, 2]],
      [[2, 0], [1, 1], [2, 1]], [[1, 0], [1, 1], [2, 1]], [[1, 0], [0, 1], [2, 2]]
    ];
    let body = "";
    patterns.forEach((pattern, index) => {
      const column = index % 3;
      const row = Math.floor(index / 3);
      const x = 28 + column * 104;
      const y = 12 + row * 101;
      body += text(x - 15, y + 17, `${index + 1}`, `font-size="14" font-weight="850" fill="${NAVY}"`);
      body += colorGrid(x, y, pattern);
    });
    return wrap("0 0 335 190", body);
  });
})(window);
