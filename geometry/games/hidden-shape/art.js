const line = (x1, y1, x2, y2, cls = "shape-line") => `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;

function fanSvg(problem) {
  const apexX = [88,100,112,96][problem.variant % 4];
  const apexY = 18, baseY = 176, leftX = 18, rightX = 182;
  const endpoints = Array.from({ length: problem.rayCount }, (_, index) => leftX + ((rightX - leftX) * index) / (problem.rayCount - 1));
  const rays = endpoints.map((x) => line(apexX, apexY, x, baseY)).join("");
  const bases = [line(leftX, baseY, rightX, baseY, "shape-line strong")];
  for (let index = 1; index <= problem.horizontalCount; index += 1) {
    const ratio = index / (problem.horizontalCount + 1);
    const y = apexY + (baseY - apexY) * ratio;
    const x1 = apexX + (leftX - apexX) * ratio;
    const x2 = apexX + (rightX - apexX) * ratio;
    bases.push(line(x1, y, x2, y, "shape-line accent"));
  }
  const dots = endpoints.map((x) => `<circle class="shape-dot" cx="${x}" cy="${baseY}" r="2.8" />`).join("");
  return `${rays}${bases.join("")}<circle class="shape-dot apex" cx="${apexX}" cy="${apexY}" r="3.5" />${dots}`;
}

function squareGridSvg(problem) {
  const size = 160, left = 20, top = 20, step = size / problem.order;
  const lines = [];
  for (let i = 0; i <= problem.order; i += 1) {
    const offset = left + i * step;
    lines.push(line(offset, top, offset, top + size, i === 0 || i === problem.order ? "shape-line strong" : "shape-line"));
    lines.push(line(left, offset, left + size, offset, i === 0 || i === problem.order ? "shape-line strong" : "shape-line"));
  }
  return `<rect class="grid-wash wash-${problem.variant || 0}" x="20" y="20" width="160" height="160" />${lines.join("")}`;
}

function irregularSvg(problem) {
  const xs = problem.cells.map(([x]) => x), ys = problem.cells.map(([, y]) => y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const cols = maxX - minX + 1, rows = maxY - minY + 1;
  const step = Math.min(148 / cols, 148 / rows);
  const left = (200 - cols * step) / 2, top = (200 - rows * step) / 2;
  return problem.cells.map(([x, y], index) => `<rect class="joined-cell joined-${index % 3}" x="${left + (x - minX) * step}" y="${top + (y - minY) * step}" width="${step}" height="${step}" />`).join("");
}

function triangleGridSvg(problem) {
  const n = problem.order, unit = 174 / n, height = unit * Math.sqrt(3) / 2;
  const vertex = (row, col) => [100 + (col - row / 2) * unit, 13 + row * height];
  const segments = [];
  for (let row = 0; row <= n; row += 1) {
    for (let col = 0; col < row; col += 1) {
      const [x1,y1] = vertex(row,col), [x2,y2] = vertex(row,col+1);
      segments.push(line(x1,y1,x2,y2));
    }
    if (row < n) for (let col = 0; col <= row; col += 1) {
      const [x1,y1] = vertex(row,col), [x2,y2] = vertex(row+1,col), [x3,y3] = vertex(row+1,col+1);
      segments.push(line(x1,y1,x2,y2));
      segments.push(line(x1,y1,x3,y3));
    }
  }
  return `<polygon class="triangle-wash wash-${problem.variant || 0}" points="100,13 13,${13+n*height} 187,${13+n*height}" />${segments.join("")}`;
}

export function shapeSvg(problem, options = {}) {
  let content = "";
  if (problem.kind === "fan") content = fanSvg(problem);
  if (problem.kind === "square-grid") content = squareGridSvg(problem);
  if (problem.kind === "irregular-grid") content = irregularSvg(problem);
  if (problem.kind === "triangle-grid") content = triangleGridSvg(problem);
  const label = options.label || "도형 세기 문제";
  return `<svg class="shape-svg" viewBox="0 0 200 200" role="img" aria-label="${label}">${content}</svg>`;
}
