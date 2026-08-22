(function (global) {
  "use strict";

  const figures = global.PremierFigures;
  if (!figures) throw new Error("PremierFigures가 먼저 로드되어야 합니다.");

  const { register, svg } = figures;
  const INK = "#1c2734";
  const NAVY = "#173a6b";
  const GOLD = "#c9a34d";
  const PALE = "#eef2f6";
  const GRID = "#7c8998";
  const RED = "#b64032";

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

  register("u3-q8", function () {
    const people = ["갑", "을", "병", "정"];
    const shops = ["아이스크림", "과일", "생선", "빵"];
    const x = 8;
    const y = 8;
    const firstWidth = 54;
    const columnWidth = 76;
    const headerHeight = 34;
    const rowHeight = 31;
    let body = `<rect x="${x}" y="${y}" width="${firstWidth + columnWidth * 4}" height="${headerHeight + rowHeight * 4}" fill="#fff" stroke="${INK}" stroke-width="1.7"/>`;

    body += `<rect x="${x}" y="${y}" width="${firstWidth}" height="${headerHeight}" fill="${PALE}" stroke="${INK}" stroke-width="1.15"/>`;
    shops.forEach((shop, index) => {
      const cellX = x + firstWidth + index * columnWidth;
      body += `<rect x="${cellX}" y="${y}" width="${columnWidth}" height="${headerHeight}" fill="${PALE}" stroke="${INK}" stroke-width="1.15"/>`;
      body += txt(cellX + columnWidth / 2, y + headerHeight / 2 + 1, shop, `text-anchor="middle" dominant-baseline="middle" font-size="${shop === "아이스크림" ? 10.3 : 12}" font-weight="800" fill="${NAVY}"`);
    });

    people.forEach((person, row) => {
      const cellY = y + headerHeight + row * rowHeight;
      body += `<rect x="${x}" y="${cellY}" width="${firstWidth}" height="${rowHeight}" fill="#fafbfd" stroke="${INK}" stroke-width="1.15"/>`;
      body += txt(x + firstWidth / 2, cellY + rowHeight / 2 + 1, person, `text-anchor="middle" dominant-baseline="middle" font-size="13" font-weight="850" fill="${INK}"`);
      for (let column = 0; column < 4; column += 1) {
        body += `<rect x="${x + firstWidth + column * columnWidth}" y="${cellY}" width="${columnWidth}" height="${rowHeight}" fill="#fff" stroke="${GRID}" stroke-width="1.05"/>`;
      }
    });

    return wrap("0 0 372 175", body);
  });

  function starPoints(cx, cy, outerRadius, innerRadius) {
    const points = [];
    for (let index = 0; index < 10; index += 1) {
      const angle = (-90 + index * 36) * Math.PI / 180;
      const radius = index % 2 === 0 ? outerRadius : innerRadius;
      points.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
    }
    return points;
  }

  function sumSymbol(kind, cx, cy) {
    const common = `stroke="${INK}" stroke-width="1.7"`;
    if (kind === "square") return `<rect data-symbol="square" x="${cx - 10}" y="${cy - 10}" width="20" height="20" rx="1" fill="#78a94f" ${common}/>`;
    if (kind === "triangle") return poly([[cx, cy - 12], [cx - 11, cy + 9], [cx + 11, cy + 9]], `data-symbol="triangle" fill="#59a5d8" ${common}`);
    if (kind === "star") return poly(starPoints(cx, cy, 12, 5.4), `data-symbol="star" fill="#ee8a3d" ${common}`);
    return `<circle data-symbol="circle" cx="${cx}" cy="${cy}" r="10" fill="#efa08c" ${common}/>`;
  }

  register("u3-q9", function () {
    const data = [
      ["square", "triangle", "triangle", "square"],
      ["square", "triangle", "star", "star"],
      ["square", "circle", "circle", "circle"],
      ["square", "triangle", "square", "star"]
    ];
    const rowSums = [36, 24, 13, 31];
    const columnSums = ["40", "25", "", "17"];
    const ox = 22;
    const oy = 10;
    const size = 40;
    let body = "";

    for (let row = 0; row < 4; row += 1) {
      for (let column = 0; column < 4; column += 1) {
        const x = ox + column * size;
        const y = oy + row * size;
        body += `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#fff" stroke="${INK}" stroke-width="1.25"/>`;
        body += sumSymbol(data[row][column], x + size / 2, y + size / 2);
      }
      body += txt(ox + size * 4 + 22, oy + row * size + 26, rowSums[row], `text-anchor="middle" font-size="16" font-weight="850" fill="${INK}"`);
    }

    columnSums.forEach((value, column) => {
      const centerX = ox + column * size + size / 2;
      if (column === 2) {
        body += `<rect x="${ox + column * size}" y="${oy + size * 4}" width="${size}" height="34" fill="#fff" stroke="${INK}" stroke-width="1.45"/>`;
      } else {
        body += txt(centerX, oy + size * 4 + 26, value, `text-anchor="middle" font-size="16" font-weight="850" fill="${INK}"`);
      }
    });

    return wrap("0 0 225 210", body);
  });

  register("u3-q11", function () {
    const nodes = [
      [150, 22, "1"],
      [110, 72, ""],
      [70, 127, ""],
      [30, 186, ""],
      [110, 186, ""],
      [190, 186, ""],
      [270, 186, ""],
      [230, 127, ""],
      [190, 72, ""]
    ];
    let body = `<path d="M150 22 L110 72 L70 127 L30 186 L110 186 L190 186 L270 186 L230 127 L190 72 Z" fill="none" stroke="${NAVY}" stroke-width="2.4"/>`;
    body += txt(150, 125, "20", `text-anchor="middle" font-size="29" font-weight="700" fill="${INK}"`);
    nodes.forEach(([cx, cy, value]) => {
      body += `<circle cx="${cx}" cy="${cy}" r="17" fill="#fff" stroke="${NAVY}" stroke-width="2.2"/>`;
      if (value) body += txt(cx, cy + 6, value, `text-anchor="middle" font-size="20" font-weight="850" fill="${INK}"`);
    });
    return wrap("0 0 300 210", body);
  });

  function transitionArrow(x1, y1, x2, y2) {
    return `<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="${GRID}" stroke-width="2" marker-end="url(#u3-step-arrow)"/>`;
  }

  function foldArrow(path) {
    return `<path d="${path}" fill="none" stroke="${RED}" stroke-width="3.4" marker-end="url(#u3-fold-arrow)"/>`;
  }

  function foldPanel(x, y, width, height, crease) {
    let body = `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="1" fill="#fbf7e7" stroke="${INK}" stroke-width="1.7"/>`;
    if (crease === "vertical") body += `<line x1="${x + width / 2}" y1="${y + 2}" x2="${x + width / 2}" y2="${y + height - 2}" stroke="${GOLD}" stroke-width="1.8" stroke-dasharray="4 3"/>`;
    if (crease === "horizontal") body += `<line x1="${x + 2}" y1="${y + height / 2}" x2="${x + width - 2}" y2="${y + height / 2}" stroke="${GOLD}" stroke-width="1.8" stroke-dasharray="4 3"/>`;
    return body;
  }

  register("u3-q12", function () {
    const values = Array.from({ length: 4 }, (_, row) => Array.from({ length: 8 }, (_, column) => (row + 1) * (column + 1)));
    const gridX = 174;
    const gridY = 7;
    const cellWidth = 30;
    const cellHeight = 23;
    let body = `<defs>
      <marker id="u3-fold-arrow" viewBox="0 0 10 10" refX="9.3" refY="5" markerWidth="8" markerHeight="8" orient="auto">
        <path d="M0 0 L10 5 L0 10 Z" fill="${RED}"/>
      </marker>
      <marker id="u3-step-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L10 5 L0 10 Z" fill="${GRID}"/>
      </marker>
    </defs>`;

    values.forEach((row, rowIndex) => row.forEach((value, columnIndex) => {
      const x = gridX + columnIndex * cellWidth;
      const y = gridY + rowIndex * cellHeight;
      body += `<rect x="${x}" y="${y}" width="${cellWidth}" height="${cellHeight}" fill="#fff" stroke="${GRID}" stroke-width="1.15"/>`;
      body += txt(x + cellWidth / 2, y + 16, value, `text-anchor="middle" font-size="10.5" font-weight="750" fill="${INK}"`);
    }));

    body += foldPanel(10, 150, 108, 52, "vertical");
    body += foldArrow("M101 168 Q66 137 27 171");
    body += transitionArrow(123, 176, 141, 176);

    body += foldPanel(147, 150, 52, 52, "horizontal");
    body += foldArrow("M171 158 Q193 177 171 195");
    body += transitionArrow(204, 176, 222, 176);

    body += foldPanel(228, 150, 108, 52, "vertical");
    body += foldArrow("M245 170 Q280 137 321 171");
    body += transitionArrow(341, 176, 359, 176);

    body += foldPanel(365, 150, 52, 52, "horizontal");
    body += foldArrow("M391 195 Q413 176 391 157");
    body += transitionArrow(422, 176, 440, 176);

    body += foldPanel(446, 157, 76, 40, "vertical");
    body += foldArrow("M457 178 Q484 150 511 178");
    body += transitionArrow(527, 176, 545, 176);
    body += foldPanel(551, 158, 40, 40, null);

    [64, 173, 282, 391, 484].forEach((centerX, index) => {
      body += `<circle cx="${centerX}" cy="222" r="10" fill="#fff" stroke="${NAVY}" stroke-width="1.4"/>`;
      body += txt(centerX, 226, index + 1, `text-anchor="middle" font-size="11" font-weight="850" fill="${NAVY}"`);
    });

    return wrap("0 0 602 238", body);
  });

  function weightShape(kind, x, y) {
    const common = `stroke="${INK}" stroke-width="1.45"`;
    if (kind === "square") return `<rect x="${x - 8}" y="${y - 8}" width="16" height="16" fill="#f4e8b9" ${common}/>`;
    if (kind === "circle") return `<circle cx="${x}" cy="${y}" r="8" fill="#eadba2" ${common}/>`;
    return poly([[x, y - 9], [x - 8.5, y + 7], [x + 8.5, y + 7]], `fill="#f0cf6f" ${common}`);
  }

  function balanceScale(offsetX, leftItems, rightItems) {
    const centerX = offsetX + 95;
    const leftX = offsetX + 39;
    const rightX = offsetX + 151;
    let body = `<line x1="${offsetX + 18}" y1="79" x2="${offsetX + 172}" y2="79" stroke="${INK}" stroke-width="2.1"/>`;
    body += `<path d="M${centerX} 79 L${centerX - 12} 109 H${centerX + 12} Z" fill="#dbe1e8" stroke="${INK}" stroke-width="1.4"/>`;
    body += `<path d="M${leftX - 35} 61 Q${leftX} 73 ${leftX + 35} 61 M${leftX - 35} 61 H${leftX + 35}" fill="none" stroke="${INK}" stroke-width="1.5"/>`;
    body += `<path d="M${rightX - 35} 61 Q${rightX} 73 ${rightX + 35} 61 M${rightX - 35} 61 H${rightX + 35}" fill="none" stroke="${INK}" stroke-width="1.5"/>`;
    body += `<line x1="${leftX}" y1="69" x2="${offsetX + 18}" y2="79" stroke="${GRID}" stroke-width="1.2"/>`;
    body += `<line x1="${rightX}" y1="69" x2="${offsetX + 172}" y2="79" stroke="${GRID}" stroke-width="1.2"/>`;
    leftItems.forEach((item) => { body += weightShape(item.kind, leftX + item.dx, item.y); });
    rightItems.forEach((item) => { body += weightShape(item.kind, rightX + item.dx, item.y); });
    return body;
  }

  register("u3-q13", function () {
    const firstLeft = [
      { kind: "square", dx: -24, y: 50 },
      { kind: "square", dx: -8, y: 50 },
      { kind: "triangle", dx: 9, y: 51 },
      { kind: "triangle", dx: 25, y: 51 }
    ];
    const firstRight = [
      { kind: "circle", dx: -10, y: 50 },
      { kind: "circle", dx: 10, y: 50 }
    ];
    const secondLeft = [
      { kind: "square", dx: -17, y: 50 },
      { kind: "square", dx: 0, y: 50 },
      { kind: "square", dx: 17, y: 50 }
    ];
    const secondRight = [
      { kind: "triangle", dx: -18, y: 52 },
      { kind: "triangle", dx: 0, y: 52 },
      { kind: "triangle", dx: 18, y: 52 },
      { kind: "circle", dx: 0, y: 29 }
    ];
    const thirdLeft = [
      { kind: "square", dx: -10, y: 50 },
      { kind: "circle", dx: 11, y: 50 }
    ];
    const body = balanceScale(0, firstLeft, firstRight)
      + balanceScale(198, secondLeft, secondRight)
      + balanceScale(396, thirdLeft, []);
    return wrap("0 0 586 116", body);
  });

  register("u3-q14", function () {
    const values = [6, 5, 4, 3, 2, 1];
    let body = "";
    values.forEach((value, index) => {
      const x = 30 + index * 58;
      body += txt(x, 47, value, `text-anchor="middle" font-size="25" font-weight="850" fill="${INK}"`);
      if (index < values.length - 1) {
        body += `<circle cx="${x + 29}" cy="39" r="15" fill="#fff" stroke="${NAVY}" stroke-width="2.1"/>`;
      }
    });
    return wrap("0 0 350 78", body);
  });
})(window);
