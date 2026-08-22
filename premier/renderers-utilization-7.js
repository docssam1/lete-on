(function (global) {
  "use strict";
  const figures = global.PremierFigures;
  if (!figures) throw new Error("PremierFigures가 먼저 로드되어야 합니다.");

  const INK = "#27313c";
  const LINE = "#8d99a6";
  const PALE = "#f3f6f8";
  const GOLD = "#d2ad50";
  const svg = (viewBox, body) => figures.svg(viewBox, `<g stroke-linecap="round" stroke-linejoin="round">${body}</g>`, "wide-svg");
  const text = (x, y, value, extra) => `<text x="${x}" y="${y}" font-family="Pretendard, Noto Sans KR, sans-serif" ${extra || ""}>${value}</text>`;
  const rect = (x, y, w, h, value, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill || "#fff"}" stroke="${LINE}" stroke-width="1.2"/>${value === undefined || value === "" ? "" : text(x + w / 2, y + h * .67, value, `text-anchor="middle" font-size="15" font-weight="800" fill="${INK}"`)}`;
  const circle = (x, y, r, value, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill || "#fff"}" stroke="${LINE}" stroke-width="1.2"/>${value === undefined || value === "" ? "" : text(x, y + 5, value, `text-anchor="middle" font-size="14" font-weight="800" fill="${INK}"`)}`;
  const hexPoints = (cx, cy, radius) => Array.from({ length: 6 }, (_, index) => {
    const angle = Math.PI / 3 * index + Math.PI / 6;
    return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
  }).join(" ");
  function honeycomb(values, offsetX, offsetY, label) {
    const cells = [[52, 28], [104, 28], [26, 73], [78, 73], [130, 73], [52, 118], [104, 118]];
    return `${text(offsetX + 4, offsetY + 10, label, `font-size="12" font-weight="900" fill="${INK}"`)}${cells.map(([x, y], index) => `<polygon points="${hexPoints(offsetX + x, offsetY + y, 29)}" fill="#fff" stroke="#47698d" stroke-width="1.4"/>${text(offsetX + x, offsetY + y + 5, values[index], `text-anchor="middle" font-size="16" font-weight="800" fill="${INK}"`)}`).join("")}`;
  }

  figures.register("u7-q1", () => svg("0 0 540 215", `${honeycomb([7, 6, "−", 4, "=", 6, 8], 4, 18, "(1)")}${honeycomb([8, "+", 3, 9, 4, "=", "−"], 184, 18, "(2)")}${honeycomb([8, 6, "=", "−", 2, 4, 5], 364, 18, "(3)")}${text(270, 205, "식: __________________   식: __________________   식: __________________", `text-anchor="middle" font-size="11" fill="${INK}"`)}`));

  function optionGrid(offsetX, label, mode) {
    const size = 15;
    const icons = [[0, 0], [0, 1], [1, 2], [3, 3], [4, 4]];
    let body = text(offsetX + 37, 12, label, `text-anchor="middle" font-size="12" font-weight="900" fill="${INK}"`);
    for (let y = 0; y < 5; y += 1) for (let x = 0; x < 5; x += 1) body += rect(offsetX + x * size, 20 + y * size, size, size, "", "#fff");
    icons.forEach(([x, y]) => { body += `<circle cx="${offsetX + x * size + 7.5}" cy="${27.5 + y * size}" r="3.2" fill="${GOLD}"/>`; });
    if (mode === "rows") for (let y = 1; y < 5; y += 1) body += `<line x1="${offsetX}" y1="${20 + y * size}" x2="${offsetX + 75}" y2="${20 + y * size}" stroke="${INK}" stroke-width="3"/>`;
    if (mode === "columns") for (let x = 1; x < 5; x += 1) body += `<line x1="${offsetX + x * size}" y1="20" x2="${offsetX + x * size}" y2="95" stroke="${INK}" stroke-width="3"/>`;
    if (mode === "bands") body += `<path d="M${offsetX} 50H${offsetX + 45}V20 M${offsetX + 30} 95V50H${offsetX + 75}" fill="none" stroke="${INK}" stroke-width="3"/>`;
    if (mode === "blocks") body += `<path d="M${offsetX + 30} 20V65H${offsetX} M${offsetX + 45} 95V50H${offsetX + 75} M${offsetX} 80H${offsetX + 45}" fill="none" stroke="${INK}" stroke-width="3"/>`;
    return body;
  }
  figures.register("u7-q4", () => svg("0 0 390 112", optionGrid(8, "①", "rows") + optionGrid(105, "②", "columns") + optionGrid(202, "③", "bands") + optionGrid(299, "④", "blocks")));

  figures.register("u7-q5", () => {
    const cells = [];
    const rows = [[2], [1, 2, 3], [0, 1, 2, 3, 4], [1, 2, 3], [2]];
    rows.forEach((xs, y) => xs.forEach((x) => cells.push(rect(72 + x * 29, 7 + y * 29, 29, 29, "", "#fff"))));
    return svg("0 0 300 160", cells.join(""));
  });

  figures.register("u7-q6", () => svg("0 0 330 82", `${[2, 5, 4, 8].map((value, index) => rect(13 + index * 46, 8, 34, 28, value, PALE)).join("")}${text(165, 68, "□  □   −   □   +   □   =   39", `text-anchor="middle" font-size="22" font-weight="850" fill="${INK}"`)}`));

  function squarePattern(originX, rows) {
    let body = "";
    const unit = 17;
    for (let row = 0; row < rows; row += 1) {
      const count = 2 * (row + 1) - 1;
      const start = originX - count * unit / 2;
      for (let x = 0; x < count; x += 1) body += rect(start + x * unit, 80 - (rows - 1 - row) * unit, unit, unit, "", "#fff");
    }
    return body;
  }
  figures.register("u7-q7", () => svg("0 0 330 105", `${squarePattern(47, 1)}${squarePattern(146, 2)}${squarePattern(265, 3)}${text(47, 101, "첫째", `text-anchor="middle" font-size="10" fill="${INK}"`)}${text(146, 101, "둘째", `text-anchor="middle" font-size="10" fill="${INK}"`)}${text(265, 101, "셋째", `text-anchor="middle" font-size="10" fill="${INK}"`)}`));

  figures.register("u7-q8", () => svg("0 0 390 178", `${[[66,20,"A + G = A"],[195,20,"B + B + B = E"],[324,20,"D + D + D = C"],[66,51,"C + D = A"],[195,51,"B × B × B = F"],[324,51,"C × D = C"]].map(([x,y,value])=>text(x,y,value,`text-anchor="middle" font-size="13" font-weight="750" fill="${INK}"`)).join("")}${["A", "B", "C", "D", "E", "F", "G"].map((value, index) => `${text(23 + (index % 4) * 92, 108 + Math.floor(index / 4) * 48, `${value} =`, `font-size="13" font-weight="800" fill="${INK}"`)}${rect(50 + (index % 4) * 92, 88 + Math.floor(index / 4) * 48, 30, 28)}`).join("")}`));

  figures.register("u7-q11", () => {
    const rows = [
      { y: 12, values: [13], start: 185 },
      { y: 52, values: [3, 5, 5], start: 145 },
      { y: 92, values: [0, 1, 2, 2, 1], start: 105 },
      { y: 132, values: [0, 0, 0, 1, "", 0, ""], start: 65 }
    ];
    return svg("0 0 390 172", rows.map((row) => row.values.map((value, index) => circle(row.start + index * 40, row.y + 16, 16, value, value === "" ? "#fff7dc" : "#fff")).join("")).join(""));
  });

  function triangleSet(originX, originY, rows, strokeWidth) {
    const side = 27;
    const height = 23.4;
    let body = "";
    for (let row = 0; row < rows; row += 1) for (let column = 0; column <= row; column += 1) {
      const x = originX + (column - row / 2) * side;
      const y = originY + row * height;
      body += `<path d="M${x} ${y}L${x - side / 2} ${y + height}L${x + side / 2} ${y + height}Z" fill="none" stroke="${INK}" stroke-width="${strokeWidth || 2}"/>`;
    }
    return body;
  }
  figures.register("u7-q12", () => {
    const single = (x, y) => `<path d="M${x} ${y}L${x - 13.5} ${y + 23.4}L${x + 13.5} ${y + 23.4}Z" fill="none" stroke="${INK}" stroke-width="2"/>`;
    return svg("0 0 390 118", `${text(65, 15, "①", `text-anchor="middle" font-size="11" font-weight="900" fill="${INK}"`)}${triangleSet(65, 27, 2, 2)}${text(195, 15, "②", `text-anchor="middle" font-size="11" font-weight="900" fill="${INK}"`)}${single(170,30)}${single(220,30)}${single(170,72)}${single(220,72)}${text(325, 15, "③", `text-anchor="middle" font-size="11" font-weight="900" fill="${INK}"`)}${single(325,27)}<line x1="325" y1="27" x2="325" y2="74" stroke="${INK}" stroke-width="2"/>`);
  });

  function cube(x, y, size, fill) {
    const h = size * .52;
    return `<polygon points="${x},${y} ${x + size},${y - h} ${x + 2 * size},${y} ${x + size},${y + h}" fill="${fill || "#f1dfb8"}" stroke="${LINE}"/><polygon points="${x},${y} ${x + size},${y + h} ${x + size},${y + h + size} ${x},${y + size}" fill="#e5c994" stroke="${LINE}"/><polygon points="${x + size},${y + h} ${x + 2 * size},${y} ${x + 2 * size},${y + size} ${x + size},${y + h + size}" fill="#d9b77c" stroke="${LINE}"/>`;
  }
  function stackGroup(map, offsetX) {
    const size = 18;
    let body = "";
    for (let y = map.length - 1; y >= 0; y -= 1) for (let x = 0; x < map[y].length; x += 1) for (let z = 0; z < map[y][x]; z += 1) {
      const px = offsetX + (x - y) * size + 54;
      const py = 84 + (x + y) * size * .52 - z * size;
      body += cube(px, py, size);
    }
    body += `<path d="M${offsetX + 54} 84L${offsetX + 108} 56L${offsetX + 162} 84V138L${offsetX + 108} 166L${offsetX + 54} 138Z M${offsetX + 108} 56V110M${offsetX + 54} 84L${offsetX + 108} 110L${offsetX + 162} 84" fill="none" stroke="#77828e" stroke-width="1.1" stroke-dasharray="4 3"/>`;
    return body;
  }
  figures.register("u7-q13", () => svg("0 0 410 190", `${stackGroup([[1, 2, 3], [0, 3, 3], [0, 0, 3]], 8)}${stackGroup([[1, 0, 0], [2, 1, 0], [1, 1, 0]], 205)}${text(105, 183, "①  □개", `text-anchor="middle" font-size="13" font-weight="800" fill="${INK}"`)}${text(302, 183, "②  □개", `text-anchor="middle" font-size="13" font-weight="800" fill="${INK}"`)}`));

  figures.register("u7-q14", () => svg("0 0 330 72", `<rect x="25" y="8" width="280" height="56" fill="#fff" stroke="${LINE}"/>${text(165, 44, "74  >  □5,      3□  <  39", `text-anchor="middle" font-size="23" font-weight="850" fill="${INK}"`)}`));

  figures.register("u7-q15", () => {
    const values = [[1,2,3,4,5,6,7,8],[2,4,6,8,10,12,14,16],[3,6,9,12,15,18,21,24],[4,8,12,16,20,24,28,32]];
    let body = "";
    values.forEach((row, y) => row.forEach((value, x) => { body += rect(5 + x * 28, 5 + y * 23, 28, 23, value, "#fffdf2"); }));
    const steps = [[262,20,"←"],[292,43,"↓"],[322,66,"→"],[352,89,"↓"],[382,112,"→"]];
    steps.forEach(([x,y,arrow], index) => { body += circle(x, y, 14, index + 1, PALE) + text(x, y + 35, arrow, `text-anchor="middle" font-size="19" font-weight="900" fill="${INK}"`); });
    return svg("0 0 410 145", body);
  });

  figures.register("u7-q18", () => {
    const centers = [30, 95, 190, 310];
    return svg("0 0 380 92", `${[1,2,3,4].map((level,index)=>{let body="";for(let row=0;row<level;row+=1){const count=2*row+1;const start=centers[index]-count*8;for(let x=0;x<count;x+=1){const value=row===0?1:Math.min(row+1-Math.abs(x-row),5);body+=rect(start+x*16,7+row*16,16,16,value,"#fff");}}return body;}).join("")}`);
  });

  figures.register("u7-q19", () => {
    const points = [[155,25,1],[235,25,""],[115,95,2],[195,95,4],[275,95,3],[155,160,""],[235,160,""]];
    const edges = [[0,1],[0,3],[1,3],[2,3],[2,5],[3,5],[3,4],[3,6],[4,6]];
    return svg("0 0 390 195", `${edges.map(([a,b])=>`<line x1="${points[a][0]}" y1="${points[a][1]}" x2="${points[b][0]}" y2="${points[b][1]}" stroke="${INK}" stroke-width="1.5"/>`).join("")}${points.map(([x,y,value])=>circle(x,y,19,value,value===""?"#fff7dc":"#fff")).join("")}`);
  });

  figures.register("u7-q20", () => {
    const top = [1,15,9,7,16,14];
    const bottom = [24,7,13,13,11,9,"A"];
    return svg("0 0 390 112", `${top.map((value,index)=>circle(70+index*50,25,17,value,"#e3e7eb")).join("")}${bottom.map((value,index)=>circle(45+index*50,82,17,value,value==="A"?"#fff4cf":"#e3e7eb")).join("")}${top.map((_,index)=>`<path d="M${62+index*50} 40L${53+index*50} 64M${78+index*50} 40L${87+index*50} 64" stroke="#a8b1bb"/>`).join("")}`);
  });
})(window);
