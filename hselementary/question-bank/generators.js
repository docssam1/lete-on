(() => {
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
  const pick = (rng, values) => values[Math.floor(rng() * values.length)];
  const int = (rng, min, max) => Math.floor(rng() * (max - min + 1)) + min;
  const shuffle = (rng, values) => [...values].sort(() => rng() - 0.5);
  const decimal = (value, places = 2) => Number(value.toFixed(places)).toString();
  const fraction = (n, d) => {
    const divisor = gcd(n, d);
    n /= divisor;
    d /= divisor;
    return d === 1 ? String(n) : `${n}/${d}`;
  };
  const mixedFraction = (n, d) => {
    const divisor = gcd(n, d);
    n /= divisor;
    d /= divisor;
    const whole = Math.floor(n / d);
    const remainder = n % d;
    if (!remainder) return String(whole);
    if (!whole) return `${remainder}/${d}`;
    return `${whole} ${remainder}/${d}`;
  };
  const permutationNumbers = (digits) => {
    const values = new Set();
    const used = Array(digits.length).fill(false);
    const current = [];
    const visit = () => {
      if (current.length === digits.length) {
        values.add(Number(current.join("")));
        return;
      }
      for (let index = 0; index < digits.length; index += 1) {
        if (used[index] || (current.length === 0 && digits[index] === 0)) continue;
        used[index] = true;
        current.push(digits[index]);
        visit();
        current.pop();
        used[index] = false;
      }
    };
    visit();
    return [...values].sort((a, b) => a - b);
  };
  const result = (prompt, answer, solution) => ({ prompt, answer: String(answer), solution });
  const splitTotal = (rng, count, total, minValue, maxValue, step = 5) => {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const values = [];
      let remaining = total;
      for (let index = 0; index < count - 1; index += 1) {
        const slots = count - index - 1;
        const low = Math.max(minValue, remaining - maxValue * slots);
        const high = Math.min(maxValue, remaining - minValue * slots);
        const lowStep = Math.ceil(low / step);
        const highStep = Math.floor(high / step);
        if (lowStep > highStep) break;
        const value = int(rng, lowStep, highStep) * step;
        values.push(value);
        remaining -= value;
      }
      if (values.length === count - 1 && remaining >= minValue && remaining <= maxValue && remaining % step === 0) return [...values, remaining];
    }
    throw new Error(`합 ${total}을 ${count}개의 각으로 나눌 수 없습니다.`);
  };
  const polar = (cx, cy, radius, degrees) => {
    const radians = (degrees - 90) * Math.PI / 180;
    return [cx + radius * Math.cos(radians), cy + radius * Math.sin(radians)];
  };
  const rayFanSvg = (rayCount, labels = [], span = 144) => {
    const cx = 120;
    const cy = 112;
    const start = -span / 2;
    const end = span / 2;
    const angles = Array.from({ length: rayCount }, (_, index) => start + (end - start) * index / (rayCount - 1));
    const rays = angles.map(angle => {
      const [x, y] = polar(cx, cy, 82, angle);
      return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
    }).join("");
    const texts = labels.map((label, index) => {
      const middle = (angles[index] + angles[index + 1]) / 2;
      const [x, y] = polar(cx, cy, 35, middle);
      return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}">${label}</text>`;
    }).join("");
    return `<svg class="geometry-diagram ray-fan" viewBox="0 0 240 132" aria-label="한 점에서 뻗은 ${rayCount}개의 반직선"><g>${rays}</g>${texts}<circle cx="${cx}" cy="${cy}" r="3"/></svg>`;
  };
  const angleWheelSvg = (labels) => {
    const cx = 100;
    const cy = 88;
    const angles = Array.from({ length: labels.length }, (_, index) => index * 360 / labels.length);
    const rays = angles.map(angle => {
      const [x, y] = polar(cx, cy, 65, angle);
      return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
    }).join("");
    const texts = labels.map((label, index) => {
      const [x, y] = polar(cx, cy, 30, angles[index] + 180 / labels.length);
      return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}">${label}</text>`;
    }).join("");
    return `<svg class="geometry-diagram angle-wheel" viewBox="0 0 200 176" aria-label="한 점 둘레의 각"><g>${rays}</g>${texts}<circle cx="${cx}" cy="${cy}" r="3"/></svg>`;
  };
  const polygonSvg = (sides, labels, star = false) => {
    const cx = 120;
    const cy = 88;
    const radius = 62;
    const points = Array.from({ length: sides }, (_, index) => polar(cx, cy, radius, index * 360 / sides));
    const order = star && sides === 5 ? [0, 2, 4, 1, 3] : Array.from({ length: sides }, (_, index) => index);
    const path = order.map(index => points[index].map(value => value.toFixed(1)).join(",")).join(" ");
    const texts = labels.map((label, index) => {
      const [x, y] = polar(cx, cy, radius - (star ? 11 : 18), index * 360 / sides);
      return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}">${label}</text>`;
    }).join("");
    return `<svg class="geometry-diagram polygon-diagram" viewBox="0 0 240 176" aria-label="${star ? "별 모양" : `${sides}각형`}"><polygon points="${path}"/>${texts}</svg>`;
  };
  const foldSvg = (angle) => {
    const radians = angle * Math.PI / 180;
    const dx = 72 * Math.sin(radians);
    const dy = 72 * Math.cos(radians);
    return `<svg class="geometry-diagram fold-diagram" viewBox="0 0 240 160" aria-label="종이를 접은 각도 그림"><rect x="42" y="24" width="150" height="112"/><line class="crease" x1="117" y1="25" x2="117" y2="136"/><line class="folded" x1="117" y1="105" x2="${(117 + dx).toFixed(1)}" y2="${(105 - dy).toFixed(1)}"/><line class="original" x1="117" y1="105" x2="${(117 - dx).toFixed(1)}" y2="${(105 - dy).toFixed(1)}"/><text x="117" y="67">${angle * 2}°</text></svg>`;
  };
  const rotatedSquareSvg = (angle) => `<svg class="geometry-diagram rotated-square" viewBox="0 0 240 176" aria-label="회전한 정사각형"><rect x="55" y="38" width="92" height="92"/><rect x="55" y="38" width="92" height="92" transform="rotate(${angle} 101 84)"/><path d="M101 84 L101 42 A42 42 0 0 1 ${(101 + 42 * Math.sin(angle * Math.PI / 180)).toFixed(1)} ${(84 - 42 * Math.cos(angle * Math.PI / 180)).toFixed(1)}"/><text x="112" y="53">${angle}°</text></svg>`;
  const clockSvg = (hour, minute) => {
    const minuteAngle = minute * 6;
    const hourAngle = (hour % 12) * 30 + minute * 0.5;
    const [mx, my] = polar(90, 90, 60, minuteAngle);
    const [hx, hy] = polar(90, 90, 43, hourAngle);
    const ticks = Array.from({ length: 12 }, (_, index) => {
      const [x1, y1] = polar(90, 90, 68, index * 30);
      const [x2, y2] = polar(90, 90, 74, index * 30);
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
    }).join("");
    return `<svg class="geometry-diagram clock-diagram" viewBox="0 0 180 180" aria-label="${hour}시 ${String(minute).padStart(2, "0")}분 시계"><circle cx="90" cy="90" r="76"/>${ticks}<line class="hour-hand" x1="90" y1="90" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}"/><line class="minute-hand" x1="90" y1="90" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}"/><circle cx="90" cy="90" r="4"/></svg>`;
  };
  const verticalOperation = (top, bottom, partials, total) => `<div class="long-operation" aria-label="세로 계산"><span>${top}</span><span>× ${bottom}</span><i></i>${partials.map(value => `<span>${value}</span>`).join("")}<i></i><strong>${total}</strong></div>`;
  const gridShapeSvg = (points, size = 8, guide = "") => {
    const margin = 18;
    const cell = 18;
    const extent = size * cell;
    const lines = Array.from({ length: size + 1 }, (_, index) => {
      const offset = margin + index * cell;
      return `<line class="grid-line" x1="${margin}" y1="${offset}" x2="${margin + extent}" y2="${offset}"/><line class="grid-line" x1="${offset}" y1="${margin}" x2="${offset}" y2="${margin + extent}"/>`;
    }).join("");
    const polygon = points.map(([x, y]) => `${margin + x * cell},${margin + (size - y) * cell}`).join(" ");
    const [ax, ay] = points[0];
    const guides = guide === "vertical" ? `<line class="guide-line" x1="${margin + 4 * cell}" y1="${margin}" x2="${margin + 4 * cell}" y2="${margin + extent}"/>` : guide === "horizontal" ? `<line class="guide-line" x1="${margin}" y1="${margin + 4 * cell}" x2="${margin + extent}" y2="${margin + 4 * cell}"/>` : "";
    return `<svg class="movement-grid" viewBox="0 0 ${margin * 2 + extent} ${margin * 2 + extent}" aria-label="격자 위의 도형">${lines}${guides}<polygon points="${polygon}"/><circle cx="${margin + ax * cell}" cy="${margin + (size - ay) * cell}" r="4"/><text x="${margin + ax * cell - 9}" y="${margin + (size - ay) * cell - 8}">A</text></svg>`;
  };
  const directionArrowSvg = (direction) => {
    const turns = ({ "위": 0, "오른쪽": 90, "아래": 180, "왼쪽": 270 })[direction];
    return `<svg class="direction-arrow" viewBox="0 0 120 120" aria-label="${direction}쪽 화살표"><g transform="rotate(${turns} 60 60)"><path d="M60 14 L91 51 H73 V103 H47 V51 H29 Z"/></g></svg>`;
  };
  const tileStrip = (symbols, highlight = -1) => `<div class="tile-strip">${symbols.map((symbol, index) => `<span class="tile-symbol ${index === highlight ? "is-highlight" : ""}">${symbol}</span>`).join("")}</div>`;
  const barChartSvg = ({ labels, values, step, hidden = [], secondValues = null, unit = "명", legend = [] }) => {
    const width = 250;
    const height = 180;
    const left = 34;
    const right = 10;
    const top = 12;
    const bottom = secondValues ? 48 : 34;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const allValues = values.concat(secondValues || []);
    const scaleMax = Math.max(step, Math.ceil(Math.max(...allValues) / step) * step);
    const hiddenSet = new Set(hidden);
    const groupWidth = plotWidth / labels.length;
    const barWidth = secondValues ? Math.min(12, groupWidth * 0.3) : Math.min(24, groupWidth * 0.5);
    const yFor = value => top + plotHeight - value / scaleMax * plotHeight;
    const grid = Array.from({ length: scaleMax / step + 1 }, (_, index) => {
      const value = index * step;
      const y = yFor(value);
      return `<line class="chart-grid" x1="${left}" y1="${y.toFixed(1)}" x2="${width - right}" y2="${y.toFixed(1)}"/><text class="chart-tick" x="${left - 5}" y="${(y + 3).toFixed(1)}">${value}</text>`;
    }).join("");
    const bars = labels.map((label, index) => {
      const center = left + groupWidth * (index + 0.5);
      const labelText = `<text class="chart-label" x="${center.toFixed(1)}" y="${height - bottom + 17}">${label}</text>`;
      if (hiddenSet.has(index)) return `<rect class="chart-unknown" x="${(center - barWidth / 2).toFixed(1)}" y="${top + plotHeight - 27}" width="${barWidth.toFixed(1)}" height="27"/><text class="chart-question" x="${center.toFixed(1)}" y="${top + plotHeight - 9}">?</text>${labelText}`;
      const firstHeight = values[index] / scaleMax * plotHeight;
      const firstX = secondValues ? center - barWidth - 1 : center - barWidth / 2;
      let markup = `<rect class="chart-bar" x="${firstX.toFixed(1)}" y="${yFor(values[index]).toFixed(1)}" width="${barWidth.toFixed(1)}" height="${firstHeight.toFixed(1)}"/>`;
      if (secondValues) {
        const secondHeight = secondValues[index] / scaleMax * plotHeight;
        markup += `<rect class="chart-bar chart-bar-secondary" x="${(center + 1).toFixed(1)}" y="${yFor(secondValues[index]).toFixed(1)}" width="${barWidth.toFixed(1)}" height="${secondHeight.toFixed(1)}"/>`;
      }
      return `${markup}${labelText}`;
    }).join("");
    const legendMarkup = secondValues ? `<g class="chart-legend"><rect x="${left}" y="${height - 16}" width="9" height="9"/><text x="${left + 13}" y="${height - 8}">${legend[0] || "자료 1"}</text><rect class="chart-bar-secondary" x="${left + 78}" y="${height - 16}" width="9" height="9"/><text x="${left + 91}" y="${height - 8}">${legend[1] || "자료 2"}</text></g>` : "";
    return `<svg class="bar-chart" viewBox="0 0 ${width} ${height}" aria-label="막대그래프"><text class="chart-unit" x="4" y="10">(${unit})</text>${grid}<line class="chart-axis" x1="${left}" y1="${top}" x2="${left}" y2="${top + plotHeight}"/><line class="chart-axis" x1="${left}" y1="${top + plotHeight}" x2="${width - right}" y2="${top + plotHeight}"/>${bars}${legendMarkup}</svg>`;
  };
  const triangleLatticeSvg = (side) => {
    const width = 240;
    const top = 14;
    const center = width / 2;
    const unit = Math.min(34, 178 / side);
    const height = unit * Math.sqrt(3) / 2;
    const baseY = top + side * height;
    const horizontal = Array.from({ length: side + 1 }, (_, row) => {
      const y = top + row * height;
      return `<line x1="${(center - row * unit / 2).toFixed(1)}" y1="${y.toFixed(1)}" x2="${(center + row * unit / 2).toFixed(1)}" y2="${y.toFixed(1)}"/>`;
    }).join("");
    const diagonals = Array.from({ length: side + 1 }, (_, index) => {
      const startY = top + index * height;
      const rightX = center + index * unit / 2;
      const leftX = center - index * unit / 2;
      return `<line x1="${rightX.toFixed(1)}" y1="${startY.toFixed(1)}" x2="${(center - (side - 2 * index) * unit / 2).toFixed(1)}" y2="${baseY.toFixed(1)}"/><line x1="${leftX.toFixed(1)}" y1="${startY.toFixed(1)}" x2="${(center + (side - 2 * index) * unit / 2).toFixed(1)}" y2="${baseY.toFixed(1)}"/>`;
    }).join("");
    return `<svg class="geometry-diagram triangle-lattice" viewBox="0 0 240 180" aria-label="한 변을 ${side}등분한 정삼각형 격자"><g>${horizontal}${diagonals}</g></svg>`;
  };
  const triangleFanSvg = (parts) => {
    const left = 22;
    const right = 218;
    const baseY = 136;
    const apexX = 120;
    const apexY = 18;
    const basePoints = Array.from({ length: parts + 1 }, (_, index) => left + (right - left) * index / parts);
    const rays = basePoints.map(x => `<line x1="${apexX}" y1="${apexY}" x2="${x.toFixed(1)}" y2="${baseY}"/>`).join("");
    return `<svg class="geometry-diagram triangle-fan" viewBox="0 0 240 160" aria-label="밑변을 ${parts}등분한 삼각형"><g>${rays}</g></svg>`;
  };
  const triangleAngleCards = (triangles) => `<div class="triangle-angle-cards">${triangles.map((angles, index) => `<div><b>${String.fromCharCode(65 + index)}</b><span>△</span><small>${angles.join("°, ")}°</small></div>`).join("")}</div>`;
  const isoscelesSplitSvg = (vertexAngle) => {
    const unit = 78;
    const height = unit / Math.tan(vertexAngle * Math.PI / 360);
    const baseY = 140;
    const apexY = baseY - height;
    const dUnit = (height ** 2 / unit ** 2 - 1) / 2;
    const dx = 120 + dUnit * unit;
    const markX = (120 + dx) / 2;
    const markY = (apexY + baseY) / 2;
    return `<svg class="geometry-diagram isosceles-split" viewBox="0 0 240 164" aria-label="이등변삼각형의 각 관계"><polygon points="42,${baseY} 198,${baseY} 120,${apexY.toFixed(1)}"/><line x1="120" y1="${apexY.toFixed(1)}" x2="${dx.toFixed(1)}" y2="${baseY}"/><path class="angle-mark" d="M112 ${(apexY + 24).toFixed(1)} A27 27 0 0 1 130 ${(apexY + 24).toFixed(1)}"/><text x="120" y="${(apexY + 42).toFixed(1)}">${vertexAngle}°</text><text x="78" y="${(baseY + 15).toFixed(1)}">B</text><text x="162" y="${(baseY + 15).toFixed(1)}">C</text><text x="${(dx - 5).toFixed(1)}" y="${(baseY + 15).toFixed(1)}">D</text><text x="120" y="${(apexY - 8).toFixed(1)}">A</text><text x="${markX.toFixed(1)}" y="${(markY - 5).toFixed(1)}">=</text><text x="${((42 + dx) / 2).toFixed(1)}" y="${(baseY - 8).toFixed(1)}">=</text></svg>`;
  };
  const equilateralChainSvg = (shown = 4) => {
    const side = 38;
    const height = side * Math.sqrt(3) / 2;
    const points = [[18, 130], [18 + side, 130], [18 + side / 2, 130 - height]];
    const triangles = [`${points[0].join(",")} ${points[1].join(",")} ${points[2].join(",")}`];
    let edge = [points[1], points[2]];
    let prior = points[0];
    for (let index = 1; index < shown; index += 1) {
      const [a, b] = edge;
      const midX = (a[0] + b[0]) / 2;
      const midY = (a[1] + b[1]) / 2;
      const vx = b[0] - a[0];
      const vy = b[1] - a[1];
      const candidates = [[midX - vy * Math.sqrt(3) / 2, midY + vx * Math.sqrt(3) / 2], [midX + vy * Math.sqrt(3) / 2, midY - vx * Math.sqrt(3) / 2]];
      const next = candidates.sort((first, second) => Math.hypot(first[0] - prior[0], first[1] - prior[1]) - Math.hypot(second[0] - prior[0], second[1] - prior[1]))[1];
      triangles.push(`${a.join(",")} ${b.join(",")} ${next.map(value => value.toFixed(1)).join(",")}`);
      prior = a;
      edge = [b, next];
    }
    return `<svg class="geometry-diagram equilateral-chain" viewBox="0 0 240 160" aria-label="이어 붙인 정삼각형"><g>${triangles.map(pointsValue => `<polygon points="${pointsValue}"/>`).join("")}</g><text x="203" y="128">…</text></svg>`;
  };
  const numberGrid = (rows, columns, valueAt) => `<div class="number-grid" style="--grid-columns:${columns}">${Array.from({ length: rows * columns }, (_, index) => `<span>${valueAt(Math.floor(index / columns) + 1, index % columns + 1)}</span>`).join("")}</div>`;
  const numberTriangle = (rows) => `<div class="number-triangle">${Array.from({ length: rows }, (_, rowIndex) => {
    const start = rowIndex * (rowIndex + 1) / 2 + 1;
    return `<div>${Array.from({ length: rowIndex + 1 }, (_, columnIndex) => `<span>${start + columnIndex}</span>`).join("")}</div>`;
  }).join("")}</div>`;
  const shapePatternSvg = (kind) => {
    if (kind === "squares") {
      const groups = [1, 2, 3].map((count, groupIndex) => {
        const startX = 12 + groupIndex * 78;
        const boxes = Array.from({ length: count }, (_, index) => `<rect x="${startX + index * 17}" y="35" width="17" height="17"/>`).join("");
        return `${boxes}<text x="${startX + count * 8.5}" y="72">${count}번째</text>`;
      }).join("");
      return `<svg class="pattern-diagram" viewBox="0 0 250 90" aria-label="정사각형을 이어 붙인 규칙">${groups}</svg>`;
    }
    if (kind === "dots") {
      const groups = [1, 2, 3].map((size, groupIndex) => {
        const startX = 30 + groupIndex * 82;
        const dots = Array.from({ length: size }, (_, row) => Array.from({ length: row + 1 }, (_, column) => `<circle cx="${startX + (column - row / 2) * 13}" cy="${22 + row * 13}" r="3.5"/>`).join("")).join("");
        return `${dots}<text x="${startX}" y="78">${size}번째</text>`;
      }).join("");
      return `<svg class="pattern-diagram" viewBox="0 0 250 90" aria-label="삼각형으로 늘어나는 점의 규칙">${groups}</svg>`;
    }
    const groups = [1, 2, 3].map((stage, groupIndex) => {
      const side = stage * 2 + 1;
      const cell = 5;
      const startX = 16 + groupIndex * 82;
      const startY = 15;
      const cells = Array.from({ length: side * side }, (_, index) => {
        const row = Math.floor(index / side);
        const column = index % side;
        const border = row === 0 || column === 0 || row === side - 1 || column === side - 1;
        return `<rect class="${border ? "pattern-dark" : "pattern-light"}" x="${startX + column * cell}" y="${startY + row * cell}" width="${cell}" height="${cell}"/>`;
      }).join("");
      return `${cells}<text x="${startX + side * cell / 2}" y="78">${stage}번째</text>`;
    }).join("");
    return `<svg class="pattern-diagram" viewBox="0 0 250 90" aria-label="테두리가 늘어나는 타일의 규칙">${groups}</svg>`;
  };
  const digitPlaceCounts = (values, digit) => {
    const counts = [];
    values.forEach(value => [...String(value)].reverse().forEach((item, index) => {
      if (item === String(digit)) counts[index] = (counts[index] || 0) + 1;
    }));
    return counts.map(value => value || 0);
  };
  const rotatePointClockwise = ([x, y], turns, center = 4) => {
    let point = [x, y];
    for (let count = 0; count < ((turns % 4) + 4) % 4; count += 1) point = [center + (point[1] - center), center - (point[0] - center)];
    return point;
  };
  const rotateDigital = (digits) => [...String(digits)].reverse().map(digit => ({ "0": "0", "1": "1", "2": "2", "5": "5", "6": "9", "8": "8", "9": "6" })[digit]).join("");

  function range(level) {
    return {
      small: 12 + level * 8,
      medium: 40 + level * 30,
      large: 1000 * (level + 1)
    };
  }

  const generators = {
    largeNumberPlaceValue({ rng, level, variant = 0 }) {
      const digitCount = 11 + level;
      const makeDigits = () => Array.from({ length: digitCount }, (_, index) => index === 0 ? int(rng, 1, 9) : int(rng, 0, 9));

      if (variant % 3 === 0) {
        const digits = makeDigits();
        const highPlace = int(rng, 5, digitCount - 2);
        const lowPlace = int(rng, 2, highPlace - 2);
        digits[digitCount - highPlace - 1] = int(rng, 2, 9);
        digits[digitCount - lowPlace - 1] = int(rng, 1, 8);
        const value = Number(digits.join(""));
        const highValue = digits[digitCount - highPlace - 1] * 10 ** highPlace;
        const lowValue = digits[digitCount - lowPlace - 1] * 10 ** lowPlace;
        const answer = Math.abs(highValue - lowValue);
        return result(`${value.toLocaleString()}에서 ${(10 ** highPlace).toLocaleString()}의 자리 숫자가 나타내는 값과 ${(10 ** lowPlace).toLocaleString()}의 자리 숫자가 나타내는 값의 차를 구하세요.`, answer, `두 숫자가 나타내는 값은 각각 ${highValue.toLocaleString()}, ${lowValue.toLocaleString()}이므로 차는 ${answer.toLocaleString()}입니다.`);
      }

      if (variant % 3 === 1) {
        const digits = makeDigits();
        const targetIndex = int(rng, 2, digitCount - 3);
        digits[targetIndex] = int(rng, 2, 9);
        const value = Number(digits.join(""));
        const terms = digits.map((digit, index) => ({ digit, place: 10 ** (digitCount - index - 1) })).filter(term => term.digit > 0);
        const target = terms.find(term => term.place === 10 ** (digitCount - targetIndex - 1));
        const expression = terms.map(term => `${term.place.toLocaleString()} × ${term === target ? "□" : term.digit}`).join(" + ");
        return result(`다음 식의 □에 알맞은 수를 구하세요.<div class="equation expanded">${value.toLocaleString()} = ${expression}</div>`, target.digit, `${target.place.toLocaleString()}의 자리 숫자는 ${target.digit}이므로 □는 ${target.digit}입니다.`);
      }

      const digits = makeDigits();
      const lowPlace = int(rng, 0, Math.min(2, digitCount - 6));
      const highPlace = lowPlace + 4;
      const baseDigit = int(rng, 1, 3);
      const multiplier = int(rng, 2, 3);
      const lowDigit = baseDigit * multiplier;
      digits[digitCount - lowPlace - 1] = lowDigit;
      digits[digitCount - highPlace - 1] = baseDigit;
      const value = Number(digits.join(""));
      const multipliedDigitValue = lowDigit * 10 ** (lowPlace + 3);
      const dividedDigitValue = baseDigit * 10 ** (highPlace - 2);
      const answer = multipliedDigitValue / dividedDigitValue;
      return result(`${value.toLocaleString()}을 1000배 한 수에서 숫자 ${lowDigit}가 나타내는 값은, ${value.toLocaleString()}을 100분의 1로 한 수에서 숫자 ${baseDigit}가 나타내는 값의 몇 배인지 구하세요.`, answer, `1000배 한 수에서 숫자 ${lowDigit}의 값은 ${multipliedDigitValue.toLocaleString()}, 100분의 1로 한 수에서 숫자 ${baseDigit}의 값은 ${dividedDigitValue.toLocaleString()}이므로 ${multipliedDigitValue.toLocaleString()} ÷ ${dividedDigitValue.toLocaleString()} = ${answer}배입니다.`);
    },
    largeNumberCompare({ rng, level, variant = 0 }) {
      const blankNumber = (prefix, suffix, place) => {
        const raw = `${prefix}□${String(suffix).padStart(Math.log10(place), "0")}`;
        const grouped = [...raw].map((character, index) => index > 0 && (raw.length - index) % 3 === 0 ? `,${character}` : character).join("");
        return grouped.replace("□", '<span class="blank-digit">□</span>');
      };
      const makeNumber = (prefix, digit, suffix, place) => prefix * place * 10 + digit * place + suffix;
      const place = 10 ** (5 + level);

      if (variant % 3 === 0) {
        const lower = int(rng, 1, 5);
        const upper = int(rng, lower + 2, 9);
        const firstPrefix = int(rng, 21, 78);
        const secondPrefix = int(rng, 21, 78);
        const firstLeft = blankNumber(firstPrefix, place - 1, place);
        const firstRight = makeNumber(firstPrefix, upper, 0, place).toLocaleString();
        const secondLeft = makeNumber(secondPrefix, lower, place - 1, place).toLocaleString();
        const secondRight = blankNumber(secondPrefix, 0, place);
        const candidates = Array.from({ length: upper - lower - 1 }, (_, index) => lower + index + 1);
        const answer = candidates.reduce((sum, value) => sum + value, 0);
        return result(`두 부등식의 □에는 같은 숫자가 들어갑니다. □에 공통으로 들어갈 수 있는 모든 숫자의 합을 구하세요.<div class="equation comparison">${firstLeft} &lt; ${firstRight}<br>${secondLeft} &lt; ${secondRight}</div>`, answer, `첫째 식에서 □는 ${upper}보다 작고, 둘째 식에서 ${lower}보다 커야 합니다. 가능한 숫자는 ${candidates.join(", ")}이므로 합은 ${answer}입니다.`);
      }

      if (variant % 3 === 1) {
        const scale = 10 ** (5 + level);
        const base = int(rng, 210, 780) * scale;
        const increment = int(rng, 12, 89) * scale / 100;
        const multipleBase = int(rng, 2100, 7800) * scale / 1000;
        const placeA = int(rng, 2, 8) * 10 ** (7 + level);
        const placeB = int(rng, 2, 9) * 10 ** (4 + level);
        const placeC = int(rng, 2, 9) * 10 ** (1 + level);
        const plainValue = base + int(rng, -50, 50) * scale / 10;
        const choices = [
          { label: "가", text: `${base.toLocaleString()}보다 ${increment.toLocaleString()} 큰 수`, value: base + increment },
          { label: "나", text: `${multipleBase.toLocaleString()}의 100배인 수`, value: multipleBase * 100 },
          { label: "다", text: `${(10 ** (7 + level)).toLocaleString()}이 ${placeA / 10 ** (7 + level)}개, ${(10 ** (4 + level)).toLocaleString()}이 ${placeB / 10 ** (4 + level)}개, ${(10 ** (1 + level)).toLocaleString()}이 ${placeC / 10 ** (1 + level)}개인 수`, value: placeA + placeB + placeC },
          { label: "라", text: plainValue.toLocaleString(), value: plainValue }
        ];
        const smallest = [...choices].sort((a, b) => a.value - b.value)[0];
        return result(`다음 네 수 중 가장 작은 수를 구하세요.<ol class="choice-list">${choices.map(choice => `<li><b>${choice.label}</b> ${choice.text}</li>`).join("")}</ol>`, smallest.value, `각 수를 숫자로 나타내어 비교하면 가장 작은 것은 ${smallest.label}, ${smallest.value.toLocaleString()}입니다.`);
      }

      const upper = int(rng, 3, 9);
      const prefix = int(rng, 31, 87);
      const left = blankNumber(prefix, place - 1, place);
      const right = makeNumber(prefix, upper, 0, place);
      const answer = upper - 1;
      return result(`부등식이 성립하도록 □에 넣을 수 있는 가장 큰 숫자를 구하세요.<div class="equation comparison">${left} &lt; ${right.toLocaleString()}</div>`, answer, `□가 ${upper}이면 뒤의 자릿수 때문에 부등식이 성립하지 않습니다. 따라서 ${upper}보다 작은 가장 큰 숫자인 ${answer}입니다.`);
    },
    largeNumberSkipPattern({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const step = pick(rng, [[100, 500, 1000], [500, 1000, 5000], [1000, 5000, 10000]][level]);
        const targetIndex = int(rng, [80, 300, 700][level], [240, 900, 1800][level]);
        const start = int(rng, 120, 890) * step;
        const answer = start + step * (targetIndex - 1);
        return result(`${start.toLocaleString()}부터 ${step.toLocaleString()}씩 뛰어 셀 때 ${targetIndex.toLocaleString()}번째 오는 수를 구하세요.`, answer, `첫 수 뒤로 ${targetIndex - 1}번 뛰므로 ${start.toLocaleString()} + ${step.toLocaleString()} × ${(targetIndex - 1).toLocaleString()} = ${answer.toLocaleString()}입니다.`);
      }

      if (variant % 3 === 1) {
        const step = pick(rng, [10000, 50000, 100000, 500000]);
        const start = int(rng, 100, 900) * step;
        const positions = [start, start + step, start + step * 2, start + step * 3, start + step * 4];
        return result(`수직선의 눈금 간격은 모두 같습니다. ㉠과 ㉡의 합을 구하세요.<div class="number-line"><span>${positions[0].toLocaleString()}</span><i></i><b>㉠</b><i></i><span>${positions[2].toLocaleString()}</span><i></i><b>㉡</b><i></i><span>${positions[4].toLocaleString()}</span></div>`, positions[1] + positions[3], `한 눈금은 ${step.toLocaleString()}입니다. ㉠은 ${positions[1].toLocaleString()}, ㉡은 ${positions[3].toLocaleString()}이므로 합은 ${(positions[1] + positions[3]).toLocaleString()}입니다.`);
      }

      const correctStep = pick(rng, [200, 1000, 2000, 10000].slice(level, level + 2));
      const wrongStep = correctStep / 2;
      const correctCount = int(rng, 30 + level * 30, 90 + level * 60) * 2;
      const start = int(rng, 120, 890) * correctStep;
      const target = start + correctStep * correctCount;
      const mistaken = start + wrongStep * correctCount;
      const answer = (target - mistaken) / correctStep;
      return result(`${start.toLocaleString()}부터 ${correctStep.toLocaleString()}씩 ${correctCount}번 뛰어 세어야 하는 것을 잘못하여 ${wrongStep.toLocaleString()}씩 ${correctCount}번 뛰어 세었습니다. 목표 수까지 ${correctStep.toLocaleString()}씩 몇 번 더 뛰어 세어야 하는지 구하세요.`, answer, `목표 수는 ${target.toLocaleString()}, 잘못 센 마지막 수는 ${mistaken.toLocaleString()}입니다. 두 수의 차를 ${correctStep.toLocaleString()}으로 나누면 ${answer}번입니다.`);
    },
    largeNumberApplication({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const lowUnit = pick(rng, [10000, 50000, 100000]);
        const ratio = pick(rng, [10, 20, 100]);
        const highUnit = lowUnit * ratio;
        const highCount = int(rng, 12, 45 + level * 20);
        const lowCount = int(rng, 1, ratio - 1);
        const amount = highUnit * highCount + lowUnit * lowCount;
        const answer = highCount + lowCount;
        return result(`은행에서 ${amount.toLocaleString()}원을 ${highUnit.toLocaleString()}원권과 ${lowUnit.toLocaleString()}원권 수표로 바꾸려고 합니다. 수표의 수가 가장 적도록 바꿀 때 수표는 모두 몇 장인지 구하세요.`, answer, `${highUnit.toLocaleString()}원권 ${highCount}장과 ${lowUnit.toLocaleString()}원권 ${lowCount}장으로 바꾸면 가장 적습니다. 따라서 ${highCount} + ${lowCount} = ${answer}장입니다.`);
      }

      if (variant % 3 === 1) {
        const end = int(rng, [120, 260, 420][level], [240, 480, 780][level]);
        const written = Array.from({ length: end }, (_, index) => String(index + 1)).join("");
        const digitCount = written.length;
        const answer = written.slice(-3);
        return result(`1부터 자연수를 차례로 이어 써서 모두 ${digitCount.toLocaleString()}자리인 수를 만들었습니다. 이 수의 마지막 세 자리 수를 구하세요.`, answer, `1부터 차례로 쓴 숫자의 자리 수를 구간별로 계산하면 마지막에 쓴 자연수는 ${end}입니다. 따라서 마지막 세 자리 수는 ${answer}입니다.`);
      }

      const groupCoins = 100;
      const groupHeight = pick(rng, [12, 15, 18]);
      const groupCount = int(rng, 12 + level * 10, 50 + level * 35) * 100000;
      const coinCount = groupCoins * groupCount;
      const totalCentimeters = groupHeight * groupCount;
      const answer = decimal(totalCentimeters / 100000, 2);
      return result(`같은 동전 ${groupCoins}개를 쌓은 높이는 ${groupHeight} cm입니다. 이 동전 ${coinCount.toLocaleString()}개를 한 줄로 쌓은 높이는 몇 km인지 구하세요.`, answer, `${coinCount.toLocaleString()}개는 ${groupCoins}개씩 ${groupCount.toLocaleString()}묶음입니다. 높이는 ${groupHeight} × ${groupCount.toLocaleString()} = ${totalCentimeters.toLocaleString()} cm이고, 100,000 cm가 1 km이므로 ${answer} km입니다.`);
    },
    conditionedNumber({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const digitCount = 7 + level;
        const firstLow = int(rng, 1, 4);
        const firstHigh = firstLow + int(rng, 2, Math.min(4, 9 - firstLow));
        const low = firstLow * 10 ** (digitCount - 1);
        const high = firstHigh * 10 ** (digitCount - 1);
        const digitSum = int(rng, 7, 14);
        const pairs = [];
        for (let ones = 0; ones <= 9; ones += 2) {
          const tens = digitSum - ones;
          if (tens >= 0 && tens <= 9) pairs.push([tens, ones]);
        }
        const firstDigitCount = firstHigh - firstLow;
        const freeDigitCount = digitCount - 3;
        const answer = firstDigitCount * pairs.length * 10 ** freeDigitCount;
        return result(`${low.toLocaleString()}보다 크고 ${high.toLocaleString()}보다 작은 ${digitCount}자리 자연수 중에서 십의 자리와 일의 자리 숫자의 합이 ${digitSum}이고 일의 자리 숫자가 짝수인 수는 모두 몇 개인지 구하세요.`, answer, `맨 앞자리 숫자는 ${Array.from({ length: firstDigitCount }, (_, index) => firstLow + index).join(", ")} 중 하나입니다. 끝 두 자리 조건은 ${pairs.length}가지이고, 가운데 ${freeDigitCount}자리는 각각 0부터 9까지 가능합니다. 따라서 ${firstDigitCount} × ${pairs.length} × ${10 ** freeDigitCount} = ${answer.toLocaleString()}개입니다.`);
      }

      if (variant % 3 === 1) {
        const highDigit = int(rng, 5, 9);
        const lowDigit = int(rng, 0, highDigit - 2);
        const digitSum = highDigit + lowDigit;
        const difference = (highDigit - lowDigit) * 9 * 1000000;
        const answer = highDigit * 10 + lowDigit;
        return result(`어떤 여덟 자리 수의 천만의 자리 숫자와 백만의 자리 숫자의 합은 ${digitSum}입니다. 두 자리 숫자를 서로 바꾸었더니 처음 수보다 ${difference.toLocaleString()}만큼 작아졌습니다. 처음 수의 천만의 자리와 백만의 자리 숫자를 차례로 이어 쓴 두 자리 수를 구하세요.`, answer, `두 자리를 바꿀 때 생기는 차는 두 숫자의 차 × 9,000,000입니다. 두 숫자의 차는 ${difference.toLocaleString()} ÷ 9,000,000 = ${highDigit - lowDigit}이고 합은 ${digitSum}이므로 두 숫자는 ${highDigit}, ${lowDigit}입니다. 답은 ${answer}입니다.`);
      }

      const digitCount = 7 + level;
      const ones = int(rng, 0, 6);
      let pairSum = int(rng, 9, 15);
      let leadingPair = null;
      while (!leadingPair) {
        for (let first = 9; first >= 1; first -= 1) {
          const second = pairSum - first;
          if (second >= 0 && second <= 9 && second !== first && first !== ones && second !== ones) {
            leadingPair = [first, second];
            break;
          }
        }
        if (!leadingPair) pairSum = int(rng, 9, 15);
      }
      const available = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0].filter(value => !leadingPair.includes(value) && value !== ones);
      const middle = available.slice(0, digitCount - 3);
      const answer = Number([...leadingPair, ...middle, ones].join(""));
      return result(`다음 조건을 모두 만족하는 가장 큰 ${digitCount}자리 자연수를 구하세요.<ul class="condition-list"><li>각 자리 숫자는 모두 다릅니다.</li><li>가장 높은 두 자리 숫자의 합은 ${pairSum}입니다.</li><li>일의 자리 숫자는 ${ones}입니다.</li></ul>`, answer, `가장 높은 자리부터 큰 숫자를 놓되 모든 자리의 숫자가 다르게 되도록 확인하면 ${answer.toLocaleString()}입니다.`);
    },
    digitCardNumber({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const cardCount = 7 + Math.min(level, 1);
        const cards = shuffle(rng, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, cardCount);
        const numbers = permutationNumbers(cards);
        const target = int(rng, 2 * 10 ** (cardCount - 1), 8 * 10 ** (cardCount - 1));
        const answer = numbers.reduce((best, value) => Math.abs(value - target) < Math.abs(best - target) || (Math.abs(value - target) === Math.abs(best - target) && value < best) ? value : best, numbers[0]);
        return result(`수 카드 ${cards.map(value => `<span class="digit-card">${value}</span>`).join("")}를 한 번씩 모두 사용해 만들 수 있는 자연수 중 ${target.toLocaleString()}에 가장 가까운 수를 구하세요.`, answer, `만들 수 있는 수를 큰 자리부터 비교하면 ${target.toLocaleString()}과의 차가 가장 작은 수는 ${answer.toLocaleString()}입니다.`);
      }

      if (variant % 3 === 1) {
        const baseCards = shuffle(rng, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
        const cards = [baseCards[0], baseCards[1], baseCards[1], baseCards[2], baseCards[3], baseCards[3]];
        const numbers = permutationNumbers(cards).sort((a, b) => b - a);
        const rank = int(rng, 3, Math.min(12 + level * 3, numbers.length));
        const answer = numbers[rank - 1];
        return result(`수 카드 ${cards.map(value => `<span class="digit-card">${value}</span>`).join("")}를 모두 사용해 만들 수 있는 여섯 자리 자연수 중 ${rank}번째로 큰 수를 구하세요.`, answer, `같은 숫자의 카드도 구분하지 않고 큰 수부터 차례로 배열하면 ${rank}번째 수는 ${answer.toLocaleString()}입니다.`);
      }

      const cardCount = 7 + Math.min(level, 1);
      const cards = shuffle(rng, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, cardCount);
      if (!cards.includes(0)) cards[0] = 0;
      const numbers = permutationNumbers(cards);
      const smallest = numbers[0];
      const largest = numbers[numbers.length - 1];
      const answer = largest - smallest;
      return result(`수 카드 ${cards.map(value => `<span class="digit-card">${value}</span>`).join("")}를 한 번씩 모두 사용하여 만들 수 있는 가장 큰 수와 가장 작은 수의 차를 구하세요. 단, 0은 맨 앞에 놓을 수 없습니다.`, answer, `가장 큰 수는 ${largest.toLocaleString()}, 가장 작은 수는 ${smallest.toLocaleString()}이므로 차는 ${answer.toLocaleString()}입니다.`);
    },
    largeNumber({ rng, level }) {
      const digits = 6 + level;
      const base = 10 ** (digits - 1);
      const a = int(rng, base, base * 9 - 1);
      const b = int(rng, base, base * 9 - 1);
      const symbol = a > b ? ">" : "<";
      return result(`${a.toLocaleString()}와 ${b.toLocaleString()}의 크기를 비교하여 □ 안에 &gt;, =, &lt; 중 알맞은 기호를 쓰세요.<div class="equation">${a.toLocaleString()} □ ${b.toLocaleString()}</div>`, symbol, `${a.toLocaleString()}와 ${b.toLocaleString()}를 높은 자리부터 비교하면 ${a.toLocaleString()} ${symbol} ${b.toLocaleString()}입니다.`);
    },
    numberPattern({ rng, level }) {
      const step = pick(rng, [10, 100, 1000, 250, 500].slice(0, 3 + level));
      const start = int(rng, 12, 80) * step;
      const missing = int(rng, 1, 3);
      const values = Array.from({ length: 5 }, (_, i) => start + i * step);
      const answer = values[missing];
      const display = values.map((value, index) => index === missing ? "□" : value.toLocaleString()).join(" → ");
      return result(`수의 배열에서 규칙을 찾아 □에 알맞은 수를 쓰세요.<div class="sequence">${display}</div>`, answer, `이웃한 수끼리 ${step.toLocaleString()}씩 커지므로 □는 ${answer.toLocaleString()}입니다.`);
    },
    digitCards({ rng, level }) {
      const count = 4 + Math.min(level, 1);
      const digits = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, count);
      const largest = Number([...digits].sort((a, b) => b - a).join(""));
      const smallest = Number([...digits].sort((a, b) => a - b).join(""));
      return result(`수 카드 ${digits.map(value => `<span class="digit-card">${value}</span>`).join("")}를 한 번씩 모두 사용해 만들 수 있는 가장 큰 수와 가장 작은 수의 차를 구하세요.`, largest - smallest, `가장 큰 수는 ${largest.toLocaleString()}, 가장 작은 수는 ${smallest.toLocaleString()}이므로 차는 ${(largest - smallest).toLocaleString()}입니다.`);
    },
    multiAngle({ rng, level, variant = 0 }) {
      const rayCount = int(rng, 6 + level, 7 + level);
      if (variant % 3 === 0) {
        const answer = rayCount * (rayCount - 1) / 2;
        return result(`한 점에서 뻗은 ${rayCount}개의 반직선 중 두 개를 골라 만들 수 있는 180°보다 작은 각은 모두 몇 개인지 구하세요.${rayFanSvg(rayCount)}`, answer, `각은 서로 다른 반직선 2개를 고르면 하나씩 정해집니다. 따라서 ${rayCount} × ${rayCount - 1} ÷ 2 = ${answer}개입니다.`);
      }
      if (variant % 3 === 1) {
        const step = 144 / (rayCount - 1);
        let acute = 0;
        let obtuse = 0;
        for (let first = 0; first < rayCount; first += 1) {
          for (let second = first + 1; second < rayCount; second += 1) {
            const angle = (second - first) * step;
            if (angle < 90) acute += 1;
            if (angle > 90 && angle < 180) obtuse += 1;
          }
        }
        return result(`그림의 반직선은 같은 간격으로 놓여 있습니다. 만들 수 있는 예각과 둔각은 모두 몇 개인지 구하세요.${rayFanSvg(rayCount)}`, acute + obtuse, `두 반직선 사이의 간격 수를 차례로 확인하면 예각은 ${acute}개, 둔각은 ${obtuse}개이므로 모두 ${acute + obtuse}개입니다.`);
      }
      const before = rayCount * (rayCount - 1) / 2;
      const after = (rayCount + 1) * rayCount / 2;
      return result(`한 점에서 뻗은 ${rayCount}개의 반직선 사이에 반직선 1개를 더 그었습니다. 180°보다 작은 각은 처음보다 몇 개 늘어나는지 구하세요.${rayFanSvg(rayCount + 1)}`, after - before, `처음에는 ${before}개, 한 개를 더 그린 뒤에는 ${after}개이므로 ${after - before}개 늘어납니다.`);
    },
    angleCalculation({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const a = int(rng, 2, 5 + level) * 10;
        const b = int(rng, 2, 5 + level) * 10;
        const answer = (180 - a - b) / 2;
        if (answer <= 0 || !Number.isInteger(answer)) return generators.angleCalculation({ rng, level, variant: variant + 3 });
        return result(`한 직선 위의 네 각 중 가운데 두 각의 크기는 서로 같습니다. □의 각도를 구하세요.${rayFanSvg(5, [`${a}°`, "□", "□", `${b}°`], 180)}`, answer, `직선 위의 각의 합은 180°이므로 가운데 두 각의 합은 180 - ${a} - ${b} = ${answer * 2}°입니다. 두 각이 같으므로 □는 ${answer}°입니다.`);
      }
      if (variant % 3 === 1) {
        const a = int(rng, 4, 10) * 5;
        const b = int(rng, 5, 12) * 5;
        const c = int(rng, 6, 15) * 5;
        const answer = 360 - a - b - c;
        if (answer < 20) return generators.angleCalculation({ rng, level, variant: variant + 3 });
        return result(`한 점 둘레의 네 각을 나타낸 그림입니다. □의 각도를 구하세요.${angleWheelSvg([`${a}°`, `${b}°`, `${c}°`, "□"])}`, answer, `한 점 둘레의 각의 합은 360°이므로 360 - ${a} - ${b} - ${c} = ${answer}°입니다.`);
      }
      const whole = int(rng, 11, 16) * 10;
      const part = int(rng, 3, Math.floor(whole / 10) - 3) * 10;
      const answer = whole - part;
      return result(`맞꼭지각의 크기가 ${whole}°이고, 그 맞은편 각을 두 각으로 나누었더니 한 각이 ${part}°가 되었습니다. 나머지 각 □의 크기를 구하세요.${rayFanSvg(4, [`${part}°`, "□", `${180 - whole}°`], 180)}`, answer, `맞꼭지각의 크기는 서로 같으므로 나뉜 두 각의 합은 ${whole}°입니다. 따라서 □는 ${whole} - ${part} = ${answer}°입니다.`);
    },
    angle({ rng, level }) {
      const total = pick(rng, level > 1 ? [180, 360] : [90, 180]);
      const a = int(rng, 2, Math.floor(total / 10) - 2) * 5;
      const b = int(rng, 2, Math.floor((total - a) / 10) - 1) * 5;
      const answer = total - a - b;
      return result(`한 점 둘레 또는 한 직선 위의 각을 나누어 잰 값입니다. □의 각도를 구하세요.<div class="equation">${a}° + ${b}° + □ = ${total}°</div>`, answer, `${total} - ${a} - ${b} = ${answer}이므로 □는 ${answer}°입니다.`);
    },
    polygonInterior({ rng, level, variant = 0 }) {
      const sides = int(rng, 4 + Math.min(level, 1), 5 + level);
      const total = (sides - 2) * 180;
      if (variant % 3 === 0) {
        const angles = splitTotal(rng, sides, total, 65, 155);
        const unknown = int(rng, 0, sides - 1);
        const answer = angles[unknown];
        const labels = angles.map((value, index) => index === unknown ? "□" : `${value}°`);
        return result(`${sides}각형의 내각을 나타낸 그림입니다. □의 각도를 구하세요.${polygonSvg(sides, labels)}`, answer, `${sides}각형의 내각의 합은 (${sides} - 2) × 180 = ${total}°입니다. 주어진 각의 합을 빼면 □는 ${answer}°입니다.`);
      }
      if (variant % 3 === 1) {
        const knownCount = sides - 2;
        const minimum = Math.max(20, Math.ceil((total - 155 * knownCount) / 10) * 5);
        const maximum = Math.min(155, Math.floor((total - 65 * knownCount) / 10) * 5);
        const answer = int(rng, minimum / 5, maximum / 5) * 5;
        const known = splitTotal(rng, sides - 2, total - answer * 2, 65, 155);
        const labels = [...known, "□", "□"];
        return result(`${sides}각형에서 □로 표시한 두 내각의 크기는 같습니다. □ 한 곳의 각도를 구하세요.${polygonSvg(sides, labels)}`, answer, `내각의 합 ${total}°에서 알려진 각의 합 ${known.reduce((sum, value) => sum + value, 0)}°를 빼면 두 □의 합은 ${answer * 2}°입니다. 따라서 한 각은 ${answer}°입니다.`);
      }
      const angles = splitTotal(rng, sides, total, 65, 155);
      const first = int(rng, 0, sides - 2);
      const second = first + 1;
      const answer = angles[first] + angles[second];
      const labels = angles.map((value, index) => index === first ? "㉠" : index === second ? "㉡" : `${value}°`);
      return result(`${sides}각형에서 ㉠과 ㉡의 각도의 합을 구하세요.${polygonSvg(sides, labels)}`, answer, `내각의 합 ${total}°에서 나머지 내각의 합 ${total - answer}°를 빼면 ㉠ + ㉡ = ${answer}°입니다.`);
    },
    polygonExterior({ rng, level, variant = 0 }) {
      if (variant % 3 === 2) {
        const angles = splitTotal(rng, 5, 180, 20, 55);
        const unknown = int(rng, 0, 4);
        const answer = angles[unknown];
        const labels = angles.map((value, index) => index === unknown ? "□" : `${value}°`);
        return result(`오각별의 다섯 뾰족한 각을 나타낸 그림입니다. □의 각도를 구하세요.${polygonSvg(5, labels, true)}`, answer, `오각별의 다섯 뾰족한 각의 합은 180°입니다. 180°에서 주어진 네 각의 합을 빼면 □는 ${answer}°입니다.`);
      }
      const sides = int(rng, 5, 6 + level);
      if (variant % 3 === 0) {
        const angles = splitTotal(rng, sides, 360, 30, 100);
        const unknown = int(rng, 0, sides - 1);
        const answer = angles[unknown];
        const labels = angles.map((value, index) => index === unknown ? "□" : `${value}°`);
        return result(`${sides}각형의 한 꼭짓점에 하나씩 표시한 외각입니다. □의 각도를 구하세요.${polygonSvg(sides, labels)}`, answer, `다각형의 외각의 합은 360°이므로 주어진 외각의 합을 빼면 □는 ${answer}°입니다.`);
      }
      const answer = int(rng, 6, 11) * 5;
      const known = splitTotal(rng, sides - 2, 360 - answer * 2, 30, 100);
      return result(`${sides}각형에서 □로 표시한 두 외각의 크기는 같습니다. □ 한 곳의 각도를 구하세요.${polygonSvg(sides, [...known, "□", "□"])}`, answer, `외각의 합 360°에서 알려진 외각의 합 ${known.reduce((sum, value) => sum + value, 0)}°를 빼고 2로 나누면 ${answer}°입니다.`);
    },
    interiorExteriorApplication({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const answer = int(rng, 3 + level, 8 + level) * 5;
        return result(`종이를 점선을 따라 접었더니 원래 선과 접힌 선이 이루는 각이 ${answer * 2}°가 되었습니다. 접은 선과 점선이 이루는 각 □를 구하세요.${foldSvg(answer)}`, answer, `접기 전후의 선은 접는 선을 기준으로 대칭이므로 두 작은 각의 크기는 같습니다. ${answer * 2} ÷ 2 = ${answer}°입니다.`);
      }
      if (variant % 3 === 1) {
        const answer = int(rng, 5, 13 + level) * 5;
        return result(`정사각형을 한 꼭짓점을 중심으로 ${answer}°만큼 회전시켰습니다. 회전 전후의 서로 대응하는 두 변이 이루는 작은 각의 크기를 구하세요.${rotatedSquareSvg(answer)}`, answer, `도형의 모든 선분은 회전한 각도만큼 방향이 바뀌므로 대응하는 두 변이 이루는 작은 각은 ${answer}°입니다.`);
      }
      const sides = pick(rng, [[4, 5, 6], [5, 6, 8, 9], [6, 8, 9, 10, 12]][level]);
      const exterior = 360 / sides;
      const interior = 180 - exterior;
      return result(`모든 내각의 크기가 같은 정${sides}각형의 한 외각은 ${exterior}°입니다. 이 다각형의 한 내각의 크기를 구하세요.${polygonSvg(sides, Array(sides).fill(""))}`, interior, `한 꼭짓점의 내각과 외각의 합은 180°이므로 180 - ${exterior} = ${interior}°입니다.`);
    },
    clockAngle({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const hour = int(rng, 1, 11);
        const minute = pick(rng, [10, 16, 20, 24, 30, 40, 48, 50]);
        const difference = Math.abs(hour * 30 + minute * 0.5 - minute * 6);
        const answer = decimal(Math.min(difference, 360 - difference), 1);
        return result(`시계가 ${hour}시 ${minute}분을 가리킬 때 시침과 분침이 이루는 작은 쪽 각의 크기를 구하세요.${clockSvg(hour, minute)}`, answer, `시침은 12에서 ${hour * 30 + minute * 0.5}°, 분침은 12에서 ${minute * 6}°만큼 움직였습니다. 두 값의 차에서 작은 쪽 각을 택하면 ${answer}°입니다.`);
      }
      if (variant % 3 === 1) {
        const minutes = int(rng, 12 + level * 5, 32 + level * 8);
        const moved = minutes * 6;
        return result(`운동을 하는 동안 분침이 ${moved}° 움직였습니다. 운동한 시간은 몇 분인지 구하세요.${clockSvg(12, minutes % 60)}`, minutes, `분침은 1분에 6° 움직이므로 ${moved} ÷ 6 = ${minutes}분입니다.`);
      }
      const startHour = int(rng, 1, 8);
      const startMinute = pick(rng, [0, 10, 20, 30, 40]);
      const duration = int(rng, 5 + level * 3, 12 + level * 4) * 10;
      const endTotal = startHour * 60 + startMinute + duration;
      const endHour = Math.floor(endTotal / 60) % 12;
      const endMinute = endTotal % 60;
      const minuteMove = duration * 6;
      const hourMove = duration * 0.5;
      const answer = decimal(minuteMove - hourMove, 1);
      return result(`${startHour}시 ${String(startMinute).padStart(2, "0")}분부터 ${endHour || 12}시 ${String(endMinute).padStart(2, "0")}분까지 분침이 움직인 각도는 시침이 움직인 각도보다 몇 도 더 큰지 구하세요.<div class="clock-pair">${clockSvg(startHour, startMinute)}${clockSvg(endHour || 12, endMinute)}</div>`, answer, `${duration}분 동안 분침은 ${minuteMove}°, 시침은 ${hourMove}° 움직입니다. 차는 ${minuteMove} - ${hourMove} = ${answer}°입니다.`);
    },
    multiplicationUnderstanding({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const boxCount = int(rng, 12 + level * 3, 25 + level * 5);
        const itemsPerBox = int(rng, 1800 + level * 500, 4800 + level * 900);
        const people = int(rng, 18 + level * 4, 35 + level * 6);
        const itemsPerPerson = int(rng, 12, 28 + level * 4);
        const answer = boxCount * itemsPerBox - people * itemsPerPerson;
        return result(`한 상자에 물건이 ${itemsPerBox.toLocaleString()}개씩 들어 있는 상자 ${boxCount}개가 있습니다. ${people}명이 한 사람당 ${itemsPerPerson}개씩 사용했다면 남은 물건은 몇 개인지 구하세요.`, answer, `처음 물건은 ${itemsPerBox.toLocaleString()} × ${boxCount} = ${(boxCount * itemsPerBox).toLocaleString()}개이고, 사용한 물건은 ${people} × ${itemsPerPerson} = ${(people * itemsPerPerson).toLocaleString()}개입니다. 따라서 ${answer.toLocaleString()}개 남습니다.`);
      }
      if (variant % 3 === 1) {
        const speed = int(rng, 70 + level * 10, 110 + level * 15);
        const seconds = int(rng, 8 + level * 2, 16 + level * 3);
        const laps = int(rng, 8 + level * 2, 15 + level * 3);
        const answer = speed * seconds * laps;
        return result(`1초에 ${speed} m씩 움직이는 장치가 있습니다. 이 장치가 한 번에 ${seconds}초씩 움직이는 일을 ${laps}번 반복하면 모두 몇 m를 움직이는지 구하세요.`, answer, `한 번 움직인 거리는 ${speed} × ${seconds} = ${speed * seconds} m이고, ${laps}번이면 ${speed * seconds} × ${laps} = ${answer.toLocaleString()} m입니다.`);
      }
      const intervals = int(rng, 90 + level * 20, 180 + level * 35);
      const spacing = int(rng, 24 + level * 5, 55 + level * 8);
      const treeCount = intervals + 1;
      const answer = intervals * spacing;
      return result(`길의 한쪽 끝부터 다른 쪽 끝까지 ${spacing} m 간격으로 나무 ${treeCount}그루를 심었습니다. 길의 길이는 몇 m인지 구하세요. 단, 양 끝에 모두 나무를 심었습니다.`, answer, `나무 사이의 간격은 ${treeCount} - 1 = ${intervals}곳입니다. 따라서 길이는 ${spacing} × ${intervals} = ${answer.toLocaleString()} m입니다.`);
    },
    multiplicationApplication({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const value = int(rng, 48 + level * 12, 96 + level * 20);
        const answer = value * 100 - value;
        return result(`분배법칙을 이용하여 ${value} × 99를 계산하세요.`, answer, `${value} × 99 = ${value} × (100 - 1) = ${value * 100} - ${value} = ${answer.toLocaleString()}입니다.`);
      }
      if (variant % 3 === 1) {
        const common = int(rng, 41 + level * 10, 89 + level * 15);
        const a = int(rng, 60, 95);
        const b = int(rng, 20, 50);
        const c = int(rng, 10, Math.min(35, a + b - 1));
        const answer = common * (a + b - c);
        return result(`계산의 성질을 이용하여 다음 식을 계산하세요.<div class="equation expanded">${common} × ${a} + ${common} × ${b} - ${common} × ${c}</div>`, answer, `공통인 ${common}을 묶으면 ${common} × (${a} + ${b} - ${c}) = ${common} × ${a + b - c} = ${answer.toLocaleString()}입니다.`);
      }
      const first = pick(rng, [17, 19, 23, 29]);
      const second = pick(rng, [31, 37, 41, 43]);
      const firstCount = int(rng, 4 + level, 7 + level * 2);
      const secondCount = int(rng, 3 + level, 6 + level * 2);
      const product = BigInt(first) ** BigInt(firstCount) * BigInt(second) ** BigInt(secondCount);
      const answer = product.toString().length;
      return result(`${first}을 ${firstCount}번, ${second}을 ${secondCount}번 곱한 수는 몇 자리 수인지 구하세요.<div class="equation expanded">${Array(firstCount).fill(first).concat(Array(secondCount).fill(second)).join(" × ")}</div>`, answer, `곱을 계산하면 ${product.toLocaleString()}이고, 이 수는 ${answer}자리 수입니다.`);
    },
    divisionUnderstanding({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const spacing = int(rng, 8 + level * 2, 18 + level * 3);
        const intervals = int(rng, 160 + level * 40, 300 + level * 70);
        const length = spacing * intervals;
        const answer = intervals + 1;
        return result(`도로의 양쪽 끝에 처음부터 끝까지 ${spacing} m 간격으로 나무를 심었습니다. 도로의 길이가 ${length.toLocaleString()} m일 때 한쪽에 심은 나무는 몇 그루인지 구하세요.`, answer, `간격은 ${length.toLocaleString()} ÷ ${spacing} = ${intervals}곳이고, 양 끝에 나무가 있으므로 ${intervals} + 1 = ${answer}그루입니다.`);
      }
      if (variant % 3 === 1) {
        const boxes = int(rng, 28 + level * 5, 48 + level * 8);
        const items = int(rng, 18 + level * 3, 32 + level * 5);
        const damaged = int(rng, 5, boxes - 8);
        const sellBoxes = boxes - damaged;
        const price = int(rng, 8 + level * 2, 16 + level * 3) * 1000;
        const totalRevenue = sellBoxes * price;
        const answer = totalRevenue / sellBoxes;
        return result(`상품 ${items * boxes}개를 한 상자에 ${items}개씩 담았습니다. 그중 ${damaged}상자를 제외한 나머지를 모두 같은 값에 팔아 ${totalRevenue.toLocaleString()}원을 받았습니다. 한 상자의 판매 가격을 구하세요.`, answer, `상자는 ${boxes}개이고 판매한 상자는 ${boxes} - ${damaged} = ${sellBoxes}개입니다. ${totalRevenue.toLocaleString()} ÷ ${sellBoxes} = ${answer.toLocaleString()}원입니다.`);
      }
      const machineCount = int(rng, 4 + level, 7 + level * 2);
      const hours = int(rng, 5 + level, 9 + level * 2);
      const perMachineHour = int(rng, 18 + level * 4, 35 + level * 6);
      const total = machineCount * hours * perMachineHour;
      const targetMachines = int(rng, 8 + level * 2, 14 + level * 3);
      const answer = total / machineCount / hours * targetMachines;
      return result(`기계 ${machineCount}대가 ${hours}시간 동안 제품 ${total.toLocaleString()}개를 만들었습니다. 모든 기계의 작업량이 같을 때 기계 ${targetMachines}대가 1시간 동안 만드는 제품은 몇 개인지 구하세요.`, answer, `기계 1대가 1시간에 만드는 수는 ${total.toLocaleString()} ÷ ${machineCount} ÷ ${hours} = ${perMachineHour}개입니다. ${targetMachines}대는 ${perMachineHour} × ${targetMachines} = ${answer}개를 만듭니다.`);
    },
    divisionApplication({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const divisor = int(rng, 12 + level * 3, 24 + level * 5);
        const quotient = int(rng, 108 + level * 30, 280 + level * 60);
        const dividend = divisor * quotient;
        const digits = String(quotient).split("").map(Number);
        const answer = digits.reduce((sum, value) => sum + value, 0);
        return result(`${dividend.toLocaleString()} ÷ ${divisor}의 몫을 구한 뒤, 몫의 각 자리 숫자의 합을 구하세요.`, answer, `${dividend.toLocaleString()} ÷ ${divisor} = ${quotient}이고, 몫의 각 자리 숫자의 합은 ${digits.join(" + ")} = ${answer}입니다.`);
      }
      if (variant % 3 === 1) {
        const rightB = pick(rng, [35, 45, 55, 65, 75]);
        const factor = int(rng, 5 + level, 12 + level * 2);
        const leftA = rightB * factor;
        const leftB = int(rng, 45 + level * 5, 85 + level * 10);
        const product = leftA * leftB;
        const answer = product / rightB;
        return result(`두 곱셈식의 값이 같을 때 □에 알맞은 수를 구하세요.<div class="equation">${leftA} × ${leftB} = □ × ${rightB}</div>`, answer, `왼쪽 곱은 ${product.toLocaleString()}입니다. ${product.toLocaleString()} ÷ ${rightB} = ${answer.toLocaleString()}이므로 □는 ${answer.toLocaleString()}입니다.`);
      }
      const count = int(rng, 6 + level, 9 + level * 2);
      const start = int(rng, 3, 12 + level * 4);
      const sum = count * (start * 2 + count - 1) / 2;
      const answer = start + count - 1;
      return result(`연속한 ${count}개의 자연수의 합이 ${sum}입니다. 이 자연수 중 가장 큰 수를 구하세요.`, answer, `가운데 값을 기준으로 연속한 수를 찾으면 ${Array.from({ length: count }, (_, index) => start + index).join(", ")}입니다. 가장 큰 수는 ${answer}입니다.`);
    },
    advancedRemainder({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const divisor = int(rng, 12 + level * 3, 22 + level * 5);
        const remainder = int(rng, 1, divisor - 1);
        const minimum = 10;
        const maximum = 99;
        const values = [];
        for (let value = minimum; value <= maximum; value += 1) if (value % divisor === remainder) values.push(value);
        const answer = values[values.length - 1] - values[0];
        return result(`${divisor}로 나눌 때 나머지가 ${remainder}인 두 자리 자연수 중 가장 큰 수와 가장 작은 수의 차를 구하세요.`, answer, `조건을 만족하는 두 자리 수는 ${values.join(", ")}입니다. 가장 큰 수와 가장 작은 수의 차는 ${answer}입니다.`);
      }
      if (variant % 3 === 1) {
        const divisor = int(rng, 12 + level * 2, 21 + level * 4);
        const oldQuotient = int(rng, 18 + level * 4, 35 + level * 8);
        const wrongDivisor = divisor + int(rng, 2, 6);
        const remainder = int(rng, 1, divisor - 1);
        const dividend = wrongDivisor * oldQuotient + remainder;
        const answer = dividend % divisor;
        return result(`어떤 수를 ${divisor}로 나누어야 할 것을 잘못하여 ${wrongDivisor}로 나누었더니 몫이 ${oldQuotient}, 나머지가 ${remainder}였습니다. 바르게 나누었을 때의 나머지를 구하세요.`, answer, `어떤 수는 ${wrongDivisor} × ${oldQuotient} + ${remainder} = ${dividend}입니다. ${dividend}을 ${divisor}로 나눈 나머지는 ${answer}입니다.`);
      }
      const divisor = int(rng, 7 + level, 12 + level * 2);
      const quotient = int(rng, 60 + level * 15, 120 + level * 30);
      const remainder = int(rng, 1, divisor - 1);
      const dividend = divisor * quotient + remainder;
      const answer = quotient + remainder;
      return result(`어떤 자연수를 ${divisor}로 나누었더니 ${dividend} = ${divisor} × 몫 + 나머지가 되었습니다. 몫과 나머지의 합을 구하세요.`, answer, `${dividend} = ${divisor} × ${quotient} + ${remainder}이므로 몫은 ${quotient}, 나머지는 ${remainder}입니다. 합은 ${answer}입니다.`);
    },
    multiplicationCompletion({ rng, level, variant = 0 }) {
      const multiplicand = int(rng, 240 + level * 100, 780 + level * 180);
      const multiplier = int(rng, 24 + level * 5, 68 + level * 12);
      const onesPartial = multiplicand * (multiplier % 10);
      const tensPartial = multiplicand * Math.floor(multiplier / 10) * 10;
      const product = multiplicand * multiplier;
      if (variant % 3 === 0) {
        const index = int(rng, 0, String(multiplicand).length - 1);
        const hidden = String(multiplicand)[index];
        const shown = [...String(multiplicand)].map((digit, digitIndex) => digitIndex === index ? "□" : digit).join("");
        return result(`세로셈의 □에 알맞은 숫자를 구하세요.${verticalOperation(shown, multiplier, [onesPartial, tensPartial], product)}`, hidden, `곱을 ${multiplier}로 나누면 곱해지는 수는 ${product.toLocaleString()} ÷ ${multiplier} = ${multiplicand}입니다. 따라서 □는 ${hidden}입니다.`);
      }
      if (variant % 3 === 1) {
        const index = int(rng, 0, String(multiplier).length - 1);
        const hidden = String(multiplier)[index];
        const shown = [...String(multiplier)].map((digit, digitIndex) => digitIndex === index ? "□" : digit).join("");
        return result(`부분곱을 보고 곱하는 수의 □에 알맞은 숫자를 구하세요.${verticalOperation(multiplicand, shown, [onesPartial, tensPartial], product)}`, hidden, `전체 곱 ${product.toLocaleString()}을 ${multiplicand}로 나누면 곱하는 수는 ${multiplier}입니다. 따라서 □는 ${hidden}입니다.`);
      }
      const productText = String(product);
      const index = int(rng, 1, productText.length - 2);
      const hidden = productText[index];
      const shown = [...productText].map((digit, digitIndex) => digitIndex === index ? "□" : digit).join("");
      return result(`세로셈 결과의 □에 알맞은 숫자를 구하세요.${verticalOperation(multiplicand, multiplier, [onesPartial, tensPartial], shown)}`, hidden, `${multiplicand} × ${multiplier} = ${product.toLocaleString()}이므로 □는 ${hidden}입니다.`);
    },
    planeTransform({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const ax = int(rng, 1, 2);
        const ay = int(rng, 1, 2);
        const points = [[ax, ay], [ax + 2, ay], [ax + 1, ay + 2]];
        const dx = int(rng, 1 + level, Math.min(3 + level, 6 - ax));
        const dy = int(rng, 1, Math.min(3, 4 - ay));
        const answer = `${ax + dx}, ${ay + dy}`;
        return result(`격자의 왼쪽 아래 꼭짓점을 (0, 0)으로 봅니다. 도형을 오른쪽으로 ${dx}칸, 위로 ${dy}칸 밀었을 때 점 A의 위치를 순서쌍으로 쓰세요.${gridShapeSvg(points)}`, answer, `밀기는 모든 점을 같은 방향으로 같은 칸 수만큼 옮깁니다. A(${ax}, ${ay})는 (${ax} + ${dx}, ${ay} + ${dy})이므로 (${answer})입니다.`);
      }
      if (variant % 3 === 1) {
        const vertical = rng() > 0.5;
        const ax = vertical ? int(rng, 1, 2) : int(rng, 1, 5);
        const ay = vertical ? int(rng, 1, 5) : int(rng, 1, 2);
        const points = [[ax, ay], [ax + 2, ay], [ax, ay + 2]];
        const final = vertical ? [8 - ax, ay] : [ax, 8 - ay];
        const direction = vertical ? "좌우" : "위아래";
        return result(`점선을 기준으로 도형을 ${direction}로 뒤집었습니다. 뒤집은 뒤 점 A의 위치를 순서쌍으로 쓰세요.${gridShapeSvg(points, 8, vertical ? "vertical" : "horizontal")}`, `${final[0]}, ${final[1]}`, `${vertical ? "세로선 x=4" : "가로선 y=4"}에서 같은 거리만큼 반대쪽으로 옮깁니다. 따라서 A의 위치는 (${final[0]}, ${final[1]})입니다.`);
      }
      const turns = int(rng, 1, Math.min(3, 1 + level));
      const ax = int(rng, 1, 3);
      const ay = int(rng, 1, 3);
      const points = [[ax, ay], [ax + 2, ay], [ax + 1, ay + 2]];
      const final = rotatePointClockwise(points[0], turns);
      return result(`격자의 중심 (4, 4)를 기준으로 도형을 시계 방향으로 90°씩 ${turns}번 돌렸습니다. 돌린 뒤 점 A의 위치를 순서쌍으로 쓰세요.${gridShapeSvg(points)}`, `${final[0]}, ${final[1]}`, `시계 방향 90° 회전을 ${turns}번 적용하면 A(${ax}, ${ay})는 (${final[0]}, ${final[1]})로 이동합니다.`);
    },
    sequentialTransform({ rng, level, variant = 0 }) {
      const directions = ["위", "오른쪽", "아래", "왼쪽"];
      const rotateDirection = (direction, turns) => directions[(directions.indexOf(direction) + turns % 4 + 4) % 4];
      const flipLeftRight = direction => ({ "위": "위", "오른쪽": "왼쪽", "아래": "아래", "왼쪽": "오른쪽" })[direction];
      const flipUpDown = direction => ({ "위": "아래", "오른쪽": "오른쪽", "아래": "위", "왼쪽": "왼쪽" })[direction];
      const start = pick(rng, directions);
      if (variant % 3 === 0) {
        const rotations = int(rng, 5 + level * 3, 15 + level * 7);
        const flips = int(rng, 4 + level * 2, 12 + level * 5);
        let answer = rotateDirection(start, rotations);
        for (let count = 0; count < flips; count += 1) answer = flipLeftRight(answer);
        return result(`화살표를 시계 방향으로 90°씩 ${rotations}번 돌린 뒤, 좌우로 ${flips}번 뒤집었습니다. 마지막 화살표가 가리키는 방향을 쓰세요.${directionArrowSvg(start)}<div class="movement-steps"><span>90° 회전 × ${rotations}</span><span>좌우 뒤집기 × ${flips}</span></div>`, answer, `90° 회전은 4번마다, 뒤집기는 2번마다 처음과 같습니다. 횟수를 각각 4와 2로 나눈 나머지만 적용하면 ${answer}쪽입니다.`);
      }
      if (variant % 3 === 1) {
        const clockwise = int(rng, 7 + level * 3, 18 + level * 6);
        const counter = int(rng, 5 + level * 2, 15 + level * 5);
        let answer = rotateDirection(start, clockwise);
        answer = flipUpDown(answer);
        answer = rotateDirection(answer, -counter);
        return result(`화살표를 시계 방향으로 90°씩 ${clockwise}번 돌리고, 위아래로 한 번 뒤집은 뒤, 시계 반대 방향으로 90°씩 ${counter}번 돌렸습니다. 마지막 방향을 쓰세요.${directionArrowSvg(start)}<div class="movement-steps"><span>시계 방향 × ${clockwise}</span><span>위아래 뒤집기</span><span>반시계 방향 × ${counter}</span></div>`, answer, `회전 횟수는 4로 나눈 나머지를 적용하고 위아래 방향을 바꾸면 마지막 방향은 ${answer}쪽입니다.`);
      }
      const cycle = int(rng, 12 + level * 5, 30 + level * 12);
      let answer = start;
      for (let count = 0; count < cycle; count += 1) {
        answer = rotateDirection(answer, 1);
        answer = flipLeftRight(answer);
      }
      return result(`다음 두 이동을 한 묶음으로 하여 ${cycle}번 반복했습니다. 마지막 방향을 쓰세요.${directionArrowSvg(start)}<div class="movement-steps"><span>① 시계 방향 90°</span><span>② 좌우 뒤집기</span><span>${cycle}회 반복</span></div>`, answer, `한 묶음의 이동을 방향에 차례로 적용하고 반복되는 주기를 찾으면 ${cycle}번째 뒤의 방향은 ${answer}쪽입니다.`);
    },
    movementPatternOne({ rng, level, variant = 0 }) {
      const symbolSets = [["●", "▲", "■", "◆"], ["◢", "◣", "◤", "◥"], ["○", "◎", "◐", "◑", "◒", "◓"]];
      const cycle = pick(rng, symbolSets.slice(0, 2 + Math.min(level, 1)));
      if (variant % 3 === 0) {
        const target = int(rng, 90 + level * 80, 260 + level * 180);
        const answer = cycle[(target - 1) % cycle.length];
        const preview = Array.from({ length: cycle.length * 2 }, (_, index) => cycle[index % cycle.length]);
        return result(`다음 무늬를 같은 규칙으로 이어 붙일 때 ${target}번째 모양을 구하세요.${tileStrip(preview)}`, answer, `무늬는 ${cycle.length}개마다 반복됩니다. ${target}을 ${cycle.length}로 나눈 나머지에 해당하는 모양은 ${answer}입니다.`);
      }
      if (variant % 3 === 1) {
        const total = int(rng, 120 + level * 70, 320 + level * 160);
        const targetSymbol = pick(rng, cycle);
        const targetIndex = cycle.indexOf(targetSymbol);
        const fullCycles = Math.floor(total / cycle.length);
        const extra = total % cycle.length;
        const answer = fullCycles + (targetIndex < extra ? 1 : 0);
        return result(`다음 규칙으로 모양을 ${total}개 이어 붙였습니다. ${targetSymbol} 모양은 모두 몇 개인지 구하세요.${tileStrip(cycle.concat(cycle))}`, answer, `${cycle.length}개짜리 한 묶음이 ${fullCycles}번 있고 남은 모양은 ${extra}개입니다. ${targetSymbol}을 세면 모두 ${answer}개입니다.`);
      }
      const target = int(rng, 150 + level * 100, 420 + level * 220);
      const first = cycle[(target - 1) % cycle.length];
      const second = cycle[target % cycle.length];
      return result(`다음 무늬를 규칙대로 이어 붙일 때 ${target}번째와 ${target + 1}번째 모양을 차례로 쓰세요.${tileStrip(cycle.concat(cycle))}`, `${first}, ${second}`, `${cycle.length}개마다 같은 무늬가 반복됩니다. 나머지를 확인하면 ${target}번째는 ${first}, ${target + 1}번째는 ${second}입니다.`);
    },
    movementPatternTwo({ rng, level, variant = 0 }) {
      const validDigits = [0, 1, 2, 5, 6, 8, 9];
      const makeNumber = (length) => {
        const first = pick(rng, validDigits.filter(value => value !== 0));
        return String(first) + Array.from({ length: length - 1 }, () => pick(rng, validDigits)).join("");
      };
      if (variant % 3 === 0) {
        let original = makeNumber(3 + Math.min(level, 1));
        let answer = rotateDigital(original);
        if (answer === original) {
          original = `6${original.slice(1)}`;
          answer = rotateDigital(original);
        }
        return result(`전자 숫자 카드를 시계 방향으로 180° 돌렸습니다. 돌린 뒤 보이는 수를 쓰세요.<div class="digital-number">${original}</div>`, answer, `카드의 순서를 거꾸로 읽고 6과 9를 서로 바꾸면 ${answer}이 됩니다.`);
      }
      if (variant % 3 === 1) {
        const actualHour = int(rng, 1, 11);
        const actualMinute = pick(rng, [5, 10, 15, 20, 25, 35, 40, 45, 50, 55]);
        const actualTotal = actualHour * 60 + actualMinute;
        const mirrorTotal = (720 - actualTotal) % 720;
        const mirrorHour = Math.floor(mirrorTotal / 60) || 12;
        const mirrorMinute = mirrorTotal % 60;
        const answer = `${actualHour}시 ${actualMinute}분`;
        return result(`거울에 비친 시계가 다음과 같았습니다. 실제 시각을 구하세요.${clockSvg(mirrorHour, mirrorMinute)}`, answer, `거울 시각과 실제 시각의 합은 12시입니다. 거울 시각 ${mirrorHour}시 ${String(mirrorMinute).padStart(2, "0")}분을 12시에서 빼면 ${answer}입니다.`);
      }
      let original = makeNumber(3);
      let rotated = rotateDigital(original);
      if (original === rotated || rotated.startsWith("0")) {
        original = `6${original.slice(1, 2)}2`;
        rotated = rotateDigital(original);
      }
      const answer = Math.abs(Number(original) - Number(rotated));
      return result(`전자 숫자 카드 ${original}을 180° 돌려서 읽은 수와 처음 수의 차를 구하세요.<div class="digital-number">${original}</div>`, answer, `180° 돌리면 카드 순서는 거꾸로 되고 6과 9가 서로 바뀌므로 ${rotated}입니다. 두 수의 차는 ${answer}입니다.`);
    },
    barGraphUnderstanding({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const labels = ["빨강", "노랑", "초록", "파랑", "흰색"];
        const step = level === 0 ? 2 : 5;
        const values = labels.map(() => int(rng, 3 + level, 9 + level * 3) * step);
        const hiddenIndex = int(rng, 1, labels.length - 2);
        const total = values.reduce((sum, value) => sum + value, 0);
        const known = labels.filter((_, index) => index !== hiddenIndex).map((label, index) => {
          const originalIndex = index >= hiddenIndex ? index + 1 : index;
          return `${label} ${values[originalIndex]}명`;
        }).join(", ");
        return result(`학생들이 좋아하는 색을 조사했습니다. 모두 ${total}명이고, 조사 결과는 ${known}입니다. 빠진 ${labels[hiddenIndex]} 막대에 알맞은 학생 수를 구하세요.${barChartSvg({ labels, values, step, hidden: [hiddenIndex] })}`, values[hiddenIndex], `전체 ${total}명에서 알려진 학생 수 ${total - values[hiddenIndex]}명을 빼면 ${labels[hiddenIndex]}을 좋아하는 학생은 ${values[hiddenIndex]}명입니다.`);
      }
      if (variant % 3 === 1) {
        const labels = ["1학년", "2학년", "3학년", "4학년", "5학년", "6학년"];
        const second = 4 * int(rng, 5 + level, 7 + level * 2);
        const third = second * 3 / 4;
        const difference = 4 * int(rng, 1, 1 + level);
        const fourth = third + difference;
        const values = [4 * int(rng, 4, 7), second, third, fourth, 4 * int(rng, 4, 8), 4 * int(rng, 4, 8)];
        return result(`학년별로 동생이 있는 학생 수를 조사했습니다. 3학년은 2학년의 3/4이고, 4학년은 3학년보다 ${difference}명 더 많습니다. 그래프를 보고 4학년 학생 수를 구하세요.${barChartSvg({ labels, values, step: 4, hidden: [2, 3] })}`, fourth, `2학년은 그래프에서 ${second}명입니다. 3학년은 ${second} × 3/4 = ${third}명이고, 4학년은 ${third} + ${difference} = ${fourth}명입니다.`);
      }
      const labels = ["1", "2", "3", "4", "5", "6"];
      const step = 2;
      const second = 2 * int(rng, 5 + level, 9 + level * 2);
      const difference = 2 * int(rng, 1, 2 + level);
      const third = second + difference;
      const values = [2 * int(rng, 4, 8), second, third, 2 * int(rng, 4, 9), 2 * int(rng, 4, 9), 2 * int(rng, 4, 9)];
      const total = values.reduce((sum, value) => sum + value, 0);
      return result(`주사위를 여러 번 던져 나온 눈의 횟수를 나타낸 그래프입니다. 2의 눈과 3의 눈 막대가 지워졌고, 3의 눈은 2의 눈보다 ${difference}번 더 나왔습니다. 전체 횟수가 ${total}번일 때 3의 눈이 나온 횟수를 구하세요.${barChartSvg({ labels, values, step, hidden: [1, 2], unit: "번" })}`, third, `보이는 네 막대의 합은 ${total - second - third}번이므로 두 빠진 막대의 합은 ${second + third}번입니다. 차가 ${difference}번이므로 2의 눈은 (${second + third} - ${difference}) ÷ 2 = ${second}번, 3의 눈은 ${third}번입니다.`);
    },
    barGraphApplication({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const labels = ["가람", "나래", "다온", "라온", "마루"];
        const speed = pick(rng, [50, 100]);
        const farthest = 100 * int(rng, 8 + level * 2, 12 + level * 3);
        const targetIndex = int(rng, 0, labels.length - 1);
        const values = labels.map((_, index) => index === targetIndex ? farthest : 100 * int(rng, 3, farthest / 100 - 1));
        const answer = farthest * 2 / speed;
        return result(`학교에서 집까지의 거리를 조사한 막대그래프입니다. 가장 먼 곳에 사는 학생이 1분에 ${speed}m씩 일정하게 걸어 학교와 집을 왕복할 때 걸리는 시간을 구하세요.${barChartSvg({ labels, values, step: 100, unit: "m" })}`, answer, `가장 먼 거리는 ${farthest}m입니다. 왕복 거리는 ${farthest} × 2 = ${farthest * 2}m이므로 걸리는 시간은 ${farthest * 2} ÷ ${speed} = ${answer}분입니다.`);
      }
      if (variant % 3 === 1) {
        const labels = ["가반", "나반", "다반", "라반"];
        const boys = labels.map(() => int(rng, 6 + level, 11 + level * 2));
        const girls = labels.map(() => int(rng, 6 + level, 11 + level * 2));
        const totals = boys.map((value, index) => value + girls[index]);
        const answer = Math.max(...totals) - Math.min(...totals);
        return result(`반별 남학생과 여학생 수를 나타낸 막대그래프입니다. 전체 학생 수가 가장 많은 반과 가장 적은 반의 학생 수 차를 구하세요.${barChartSvg({ labels, values: boys, secondValues: girls, step: 2, legend: ["남학생", "여학생"] })}`, answer, `각 반의 전체 학생 수는 차례로 ${totals.join(", ")}명입니다. 가장 큰 수 ${Math.max(...totals)}에서 가장 작은 수 ${Math.min(...totals)}을 빼면 ${answer}명입니다.`);
      }
      const labels = ["단팥", "크림", "소보로", "카스텔라"];
      const counts = labels.map(() => 5 * int(rng, 4 + level, 9 + level * 3));
      const prices = [1200 + level * 100, 1500 + level * 100, 1100 + level * 100, 2000 + level * 200];
      const answer = counts.reduce((sum, count, index) => sum + count * prices[index], 0);
      const priceText = labels.map((label, index) => `${label}빵 ${prices[index].toLocaleString()}원`).join(", ");
      return result(`오늘 판매한 빵의 수를 나타낸 막대그래프입니다. 한 개의 가격이 ${priceText}일 때 전체 판매 금액을 구하세요.${barChartSvg({ labels, values: counts, step: 5, unit: "개" })}`, answer, `${counts.map((count, index) => `${count} × ${prices[index].toLocaleString()}`).join(" + ")} = ${answer.toLocaleString()}원이므로 전체 판매 금액은 ${answer.toLocaleString()}원입니다.`);
    },
    advancedLinePattern({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const start = int(rng, 2, 12);
        const step = int(rng, 4 + level, 8 + level * 2);
        const target = int(rng, 35 + level * 15, 65 + level * 25);
        const preview = Array.from({ length: 6 }, (_, index) => start + index * step);
        const answer = start + (target - 1) * step;
        return result(`다음 수열의 ${target}번째 수를 구하세요.<div class="sequence">${preview.join(", ")}, …</div>`, answer, `첫째 수가 ${start}이고 ${step}씩 커지므로 ${target}번째 수는 ${start} + ${step} × ${target - 1} = ${answer}입니다.`);
      }
      if (variant % 3 === 1) {
        const oddStart = int(rng, 2, 8);
        const evenStart = int(rng, 12, 22);
        const oddStep = int(rng, 3 + level, 6 + level);
        const evenStep = int(rng, 4 + level, 8 + level);
        const target = int(rng, 45 + level * 20, 85 + level * 30);
        const valueAt = position => position % 2 === 1 ? oddStart + ((position - 1) / 2) * oddStep : evenStart + (position / 2 - 1) * evenStep;
        const preview = Array.from({ length: 8 }, (_, index) => valueAt(index + 1));
        const answer = valueAt(target);
        const lane = target % 2 === 1 ? "홀수 번째" : "짝수 번째";
        const laneIndex = Math.ceil(target / 2);
        const laneStart = target % 2 === 1 ? oddStart : evenStart;
        const laneStep = target % 2 === 1 ? oddStep : evenStep;
        return result(`두 규칙이 번갈아 나타나는 수열입니다. ${target}번째 수를 구하세요.<div class="sequence">${preview.join(", ")}, …</div>`, answer, `${target}번째는 ${lane} 수열의 ${laneIndex}번째입니다. ${laneStart}에서 ${laneStep}씩 커지므로 답은 ${answer}입니다.`);
      }
      const numeratorStart = int(rng, 1, 5);
      const denominatorStart = int(rng, 40, 90);
      const numeratorStep = int(rng, 2 + level, 5 + level);
      const denominatorStep = int(rng, 3 + level, 7 + level * 2);
      const target = int(rng, 30 + level * 15, 55 + level * 20);
      const terms = Array.from({ length: 5 }, (_, index) => `${numeratorStart + index * numeratorStep}/${denominatorStart + index * denominatorStep}`);
      const numerator = numeratorStart + (target - 1) * numeratorStep;
      const denominator = denominatorStart + (target - 1) * denominatorStep;
      return result(`분자와 분모의 규칙을 각각 찾아 ${target}번째 분수를 구하세요.<div class="sequence">${terms.join(", ")}, …</div>`, `${numerator}/${denominator}`, `분자는 ${numeratorStep}씩, 분모는 ${denominatorStep}씩 커집니다. 따라서 ${target}번째 분수는 ${numerator}/${denominator}입니다.`);
    },
    arrayNumberRules({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const columns = 6 + level;
        const targetRow = int(rng, 9 + level * 4, 18 + level * 8);
        const targetColumn = int(rng, 2, columns - 1);
        const valueAt = (row, column) => (row - 1) * columns + (row % 2 === 1 ? column : columns - column + 1);
        const answer = valueAt(targetRow, targetColumn);
        return result(`자연수를 한 줄에 ${columns}개씩 쓰되, 첫째 줄은 왼쪽에서 오른쪽으로, 둘째 줄은 오른쪽에서 왼쪽으로 번갈아 배열했습니다. ${targetRow}번째 줄의 왼쪽에서 ${targetColumn}번째 수를 구하세요.${numberGrid(5, columns, valueAt)}`, answer, `${targetRow}번째 줄에는 ${(targetRow - 1) * columns + 1}부터 ${targetRow * columns}까지 있습니다. ${targetRow % 2 === 1 ? "왼쪽부터 커지므로" : "왼쪽부터 작아지므로"} 답은 ${answer}입니다.`);
      }
      if (variant % 3 === 1) {
        const targetRow = int(rng, 18 + level * 6, 35 + level * 12);
        const answer = targetRow * (targetRow + 1) / 2;
        return result(`첫째 줄에 1개, 둘째 줄에 2개, 셋째 줄에 3개씩 자연수를 차례로 배열합니다. ${targetRow}번째 줄의 가장 오른쪽 수를 구하세요.${numberTriangle(5)}`, answer, `${targetRow}번째 줄까지 놓인 수의 개수는 1 + 2 + … + ${targetRow} = ${targetRow} × ${targetRow + 1} ÷ 2 = ${answer}이므로 가장 오른쪽 수는 ${answer}입니다.`);
      }
      const columns = 7 + level;
      const target = int(rng, 120 + level * 80, 260 + level * 150);
      const row = Math.ceil(target / columns);
      const offset = target - (row - 1) * columns;
      const column = row % 2 === 1 ? offset : columns - offset + 1;
      const valueAt = (gridRow, gridColumn) => (gridRow - 1) * columns + (gridRow % 2 === 1 ? gridColumn : columns - gridColumn + 1);
      return result(`자연수를 한 줄에 ${columns}개씩 뱀 모양으로 배열했습니다. ${target}은 몇 번째 줄의 왼쪽에서 몇 번째 위치에 있는지 쓰세요.${numberGrid(5, columns, valueAt)}`, `${row}번째 줄, ${column}번째`, `${target}을 ${columns}로 나누어 줄을 찾으면 ${row}번째 줄입니다. ${row % 2 === 1 ? "홀수 줄은 왼쪽부터 커지고" : "짝수 줄은 왼쪽부터 작아지므로"} 왼쪽에서 ${column}번째입니다.`);
    },
    advancedArraySum({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const start = int(rng, 10, 35);
        const step = int(rng, 3 + level, 8 + level * 2);
        const count = int(rng, 24 + level * 8, 45 + level * 15);
        const last = start + (count - 1) * step;
        const answer = count * (start + last) / 2;
        return result(`${start}부터 시작하여 ${step}씩 커지는 수를 ${count}개 나열했습니다. 이 수들의 합을 구하세요.<div class="sequence">${start}, ${start + step}, ${start + step * 2}, …, ${last}</div>`, answer, `처음 수와 끝 수의 합은 ${start + last}이고 수는 ${count}개이므로 합은 (${start} + ${last}) × ${count} ÷ 2 = ${answer}입니다.`);
      }
      if (variant % 3 === 1) {
        const count = int(rng, 18 + level * 8, 36 + level * 15);
        const total = count * count;
        const answer = count * 2 - 1;
        return result(`1부터 시작하는 연속된 홀수를 더했더니 합이 ${total.toLocaleString()}이었습니다. 더한 홀수 중 가장 큰 수를 구하세요.`, answer, `처음 ${count}개 홀수의 합은 ${count}² = ${total.toLocaleString()}입니다. ${count}번째 홀수는 2 × ${count} - 1 = ${answer}입니다.`);
      }
      const first = int(rng, 12 + level * 10, 45 + level * 25);
      const center = first + 4;
      const total = center * 9;
      const answer = first + 8;
      return result(`연속한 자연수 9개를 작은 수부터 가로 3칸, 세로 3칸에 차례로 썼습니다. 아홉 수의 합이 ${total}일 때 가장 큰 수를 구하세요.${numberGrid(3, 3, () => "□")}`, answer, `연속한 9개의 가운데 수는 평균과 같으므로 ${total} ÷ 9 = ${center}입니다. 가장 큰 수는 가운데 수보다 4 큰 ${answer}입니다.`);
    },
    advancedOperationRule({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const a = int(rng, 4, 9 + level * 2);
        const b = int(rng, 3, 8 + level * 2);
        const answer = a * b + b;
        return result(`다음 보기에서 ★의 규칙을 찾아 ${a}★${b}의 값을 구하세요.<div class="rule-examples"><span>2★3 = 9</span><span>4★5 = 25</span><span>6★2 = 14</span></div>`, answer, `앞의 수와 뒤의 수를 곱한 뒤 뒤의 수를 더하는 규칙입니다. ${a} × ${b} + ${b} = ${answer}입니다.`);
      }
      if (variant % 3 === 1) {
        const a = int(rng, 2, 7 + level);
        const b = int(rng, 3, 8 + level);
        const c = int(rng, 2, 6 + level);
        const sum = a + b;
        const answer = sum * c + 1;
        return result(`두 연산의 규칙을 찾아 (${a}○${b})◇${c}의 값을 구하세요.<div class="rule-examples"><span>2○3 = 5, 4○6 = 10</span><span>2◇3 = 7, 4◇5 = 21</span></div>`, answer, `○는 두 수의 합이고 ◇는 두 수의 곱에 1을 더합니다. ${a}○${b} = ${sum}, ${sum}◇${c} = ${sum} × ${c} + 1 = ${answer}입니다.`);
      }
      const topOne = int(rng, 2, 6);
      const leftOne = int(rng, 3, 8);
      const rightOne = int(rng, 4, 9);
      const topTwo = int(rng, 3, 7);
      const leftTwo = int(rng, 4, 9);
      const rightTwo = int(rng, 5, 10);
      const top = int(rng, 4, 8 + level);
      const left = int(rng, 5, 10 + level);
      const right = int(rng, 6, 11 + level);
      const answer = top * (left + right);
      return result(`세 꼭짓점의 수로 가운데 수를 만드는 규칙을 찾아 ?에 알맞은 수를 구하세요.<div class="number-trios"><span>${topOne}<br>${leftOne} · <b>${topOne * (leftOne + rightOne)}</b> · ${rightOne}</span><span>${topTwo}<br>${leftTwo} · <b>${topTwo * (leftTwo + rightTwo)}</b> · ${rightTwo}</span><span>${top}<br>${left} · <b>?</b> · ${right}</span></div>`, answer, `아래 두 수의 합에 위의 수를 곱하는 규칙입니다. (${left} + ${right}) × ${top} = ${answer}입니다.`);
    },
    advancedShapePattern({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const target = int(rng, 14 + level * 5, 28 + level * 10);
        const answer = 3 * target + 1;
        return result(`정사각형을 한 변씩 이어 붙여 한 줄로 늘어놓습니다. ${target}번째 모양에 필요한 성냥개비 수를 구하세요.${shapePatternSvg("squares")}`, answer, `첫 정사각형은 4개가 필요하고 하나를 더 붙일 때마다 3개씩 늘어납니다. 4 + 3 × ${target - 1} = ${answer}개입니다.`);
      }
      if (variant % 3 === 1) {
        const target = int(rng, 12 + level * 4, 22 + level * 8);
        const answer = target * (target + 1) / 2;
        return result(`점을 삼각형 모양으로 한 줄씩 늘려 놓습니다. ${target}번째 모양에 놓이는 점은 모두 몇 개인지 구하세요.${shapePatternSvg("dots")}`, answer, `점의 수는 1 + 2 + … + ${target}이므로 ${target} × ${target + 1} ÷ 2 = ${answer}개입니다.`);
      }
      const target = int(rng, 7 + level * 3, 13 + level * 5);
      const side = target * 2 + 1;
      const dark = 4 * side - 4;
      const light = (side - 2) ** 2;
      return result(`정사각형 타일을 늘려 ${target}번째 모양을 만들었습니다. 테두리는 검은 타일, 안쪽은 흰 타일입니다. 검은 타일과 흰 타일의 수를 차례로 구하세요.${shapePatternSvg("rings")}`, `${dark}, ${light}`, `${target}번째 모양의 한 변은 ${side}칸입니다. 테두리는 4 × ${side} - 4 = ${dark}개이고, 안쪽은 한 변이 ${side - 2}칸인 정사각형이므로 ${light}개입니다.`);
    },
    conditionedNumberCount({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const cardsByLevel = [[0, 1, 2, 3], [0, 1, 2, 4, 5], [0, 1, 2, 4, 8]];
        const cards = shuffle(rng, cardsByLevel[level]);
        const divisor = pick(rng, [2, 3]);
        const numbers = permutationNumbers(cards);
        const place = 10 ** (cards.length - 1);
        const lower = place * 2;
        const upper = place * 8;
        const valid = numbers.filter(value => value > lower && value < upper && value % divisor === 0);
        return result(`수 카드 ${cards.map(value => `<span class="digit-card">${value}</span>`).join("")}를 한 번씩 모두 사용하여 만든 수 중 ${lower.toLocaleString()}보다 크고 ${upper.toLocaleString()}보다 작으며 ${divisor}의 배수인 수는 모두 몇 개인지 구하세요.`, valid.length, `맨 앞자리를 정해 범위를 확인하고, 끝자리 또는 각 자리의 합으로 ${divisor}의 배수를 판별하면 조건을 만족하는 수는 ${valid.length}개입니다.`);
      }
      if (variant % 3 === 1) {
        const start = int(rng, 120 + level * 150, 360 + level * 240);
        const end = start + int(rng, 260 + level * 150, 520 + level * 260);
        const digit = int(rng, 2, 8);
        const values = Array.from({ length: end - start + 1 }, (_, index) => start + index);
        const placeCounts = digitPlaceCounts(values, digit);
        const answer = placeCounts.reduce((sum, value) => sum + value, 0);
        const placeNames = ["일", "십", "백", "천", "만"];
        const detail = placeCounts.map((value, index) => `${placeNames[index]}의 자리 ${value}번`).join(", ");
        return result(`${start.toLocaleString()}부터 ${end.toLocaleString()}까지 자연수를 차례로 쓸 때 숫자 ${digit}가 모두 몇 번 쓰이는지 구하세요.`, answer, `${detail}이므로 숫자 ${digit}가 쓰인 횟수는 모두 ${answer}번입니다.`);
      }
      const step = pick(rng, [5, 7, 9]);
      const count = int(rng, 70 + level * 40, 150 + level * 80);
      const end = step * count;
      const digit = int(rng, 1, 8);
      const values = Array.from({ length: count }, (_, index) => step * (index + 1));
      const placeCounts = digitPlaceCounts(values, digit);
      const answer = placeCounts.reduce((sum, value) => sum + value, 0);
      const placeNames = ["일", "십", "백", "천", "만"];
      const detail = placeCounts.map((value, index) => `${placeNames[index]}의 자리 ${value}번`).join(", ");
      return result(`${step}, ${step * 2}, ${step * 3}, …, ${end.toLocaleString()}을 차례로 썼습니다. 이 수들에 숫자 ${digit}가 쓰인 횟수는 모두 몇 번인지 구하세요.`, answer, `${step}의 배수에서 ${detail}이므로 숫자 ${digit}가 쓰인 횟수는 모두 ${answer}번입니다.`);
    },
    fractionUnderstanding({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const original = 24 * int(rng, 80 + level * 40, 180 + level * 90);
        const afterFirst = original / 2;
        const afterSecond = afterFirst * 2 / 3;
        const final = afterSecond * 3 / 4;
        return result(`처음 가진 돈의 1/2을 쓰고, 남은 돈의 1/3을 쓴 뒤, 다시 남은 돈의 1/4을 썼더니 ${final.toLocaleString()}원이 남았습니다. 처음 가진 돈을 구하세요.`, original, `마지막에는 직전 돈의 3/4이 남았으므로 거꾸로 계산하면 ${final.toLocaleString()} × 4/3 × 3/2 × 2 = ${original.toLocaleString()}원입니다.`);
      }
      if (variant % 3 === 1) {
        const unit = int(rng, 3 + level, 8 + level * 2);
        const afterEating = unit * 15;
        const fixed = int(rng, 4 + level, 9 + level * 2);
        const afterFirstGift = afterEating * 2 / 3;
        const final = afterFirstGift * 3 / 5;
        const original = afterEating + fixed;
        return result(`사탕 ${fixed}개를 먹고 남은 사탕의 1/3을 친구에게 준 다음, 다시 남은 사탕의 2/5를 동생에게 주었더니 ${final}개가 남았습니다. 처음 사탕은 몇 개인지 구하세요.`, original, `${final}개는 동생에게 주기 전의 3/5이므로 그때는 ${final} × 5/3 = ${afterFirstGift}개입니다. 이는 첫 선물 뒤의 수이므로 먹고 남은 사탕은 ${afterFirstGift} × 3/2 = ${afterEating}개, 처음에는 ${afterEating} + ${fixed} = ${original}개입니다.`);
      }
      const unit = int(rng, 18 + level * 8, 40 + level * 15);
      const depth = unit * 3;
      const firstLength = unit * 4;
      const secondLength = unit * 7;
      const total = firstLength + secondLength;
      return result(`길이의 합이 ${total}cm인 두 막대를 수조에 수직으로 세웠습니다. 첫째 막대의 3/4과 둘째 막대의 3/7이 잠겼고 두 막대가 잠긴 깊이는 같습니다. 물의 깊이를 구하세요.`, depth, `잠긴 깊이를 3묶음으로 보면 두 막대의 전체 길이는 각각 4묶음과 7묶음입니다. 11묶음이 ${total}cm이므로 한 묶음은 ${unit}cm, 물의 깊이는 ${unit} × 3 = ${depth}cm입니다.`);
    },
    advancedFractionCompare({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const cardCount = 5 + Math.min(level, 1);
        const cards = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, cardCount).sort((a, b) => a - b);
        let answer = 0;
        cards.forEach(numerator => cards.forEach(denominator => {
          if (numerator < denominator && numerator * 2 > denominator) answer += 1;
        }));
        return result(`수 카드 ${cards.map(value => `<span class="digit-card">${value}</span>`).join("")}에서 두 장을 뽑아 분수를 만듭니다. 1/2보다 크고 1보다 작은 분수는 모두 몇 개인지 구하세요. 단, 한 카드는 한 번만 사용합니다.`, answer, `분자는 분모보다 작고, 분자의 2배는 분모보다 커야 합니다. 두 조건을 만족하는 순서쌍을 세면 ${answer}개입니다.`);
      }
      if (variant % 3 === 1) {
        const quotient = int(rng, 2, 3 + level);
        const remainder = int(rng, 3, 6 + level * 2);
        const maximumDenominator = remainder + int(rng, 8, 14 + level * 4);
        const denominator = remainder + 1;
        const numerator = quotient * denominator + remainder;
        const answer = mixedFraction(numerator, denominator);
        return result(`어떤 가분수의 분자를 분모로 나누면 몫이 ${quotient}, 나머지가 ${remainder}입니다. 분모가 ${maximumDenominator} 이하일 때 만들 수 있는 가분수 중 가장 큰 수를 구하세요.`, answer, `가분수는 ${quotient} + ${remainder}/분모입니다. 나머지는 분모보다 작아야 하므로 가장 작은 분모는 ${denominator}이고, 이때 분수가 가장 큽니다. 따라서 ${numerator}/${denominator} = ${answer}입니다.`);
      }
      const denominator = int(rng, 8 + level, 11 + level * 2);
      const lower = int(rng, 1, 3);
      const candidateCount = int(rng, 4 + level, 6 + level);
      const upper = lower + candidateCount + 1;
      const answer = candidateCount * (candidateCount - 1) * (candidateCount - 2) / 6;
      return result(`분모가 ${denominator}인 서로 다른 세 진분수 A, B, C가 ${lower}/${denominator} &lt; A &lt; B &lt; C &lt; ${upper}/${denominator}를 만족합니다. (A, B, C)가 될 수 있는 경우는 모두 몇 가지인지 구하세요.`, answer, `가능한 분자는 ${lower + 1}부터 ${upper - 1}까지 ${candidateCount}개입니다. 이 중 3개를 고르면 작은 순서대로 A, B, C가 정해지므로 경우의 수는 ${answer}가지입니다.`);
    },
    fractionAddSubOneAdvanced({ rng, level, variant = 0 }) {
      const denominator = pick(rng, [7, 8, 9, 10].slice(0, 3 + Math.min(level, 1)));
      if (variant % 3 === 0) {
        const a = denominator + int(rng, 2, denominator - 1);
        const b = denominator * 2 + int(rng, 1, denominator - 2);
        const c = int(rng, 2, denominator - 1);
        const answerNumerator = a + b + c;
        return result(`□ - ${mixedFraction(a, denominator)} = ${mixedFraction(b, denominator)} + ${c}/${denominator}일 때 □에 알맞은 수를 구하세요.`, mixedFraction(answerNumerator, denominator), `양변에 ${mixedFraction(a, denominator)}을 더하면 □ = ${mixedFraction(a, denominator)} + ${mixedFraction(b, denominator)} + ${c}/${denominator}입니다. 계산하면 ${mixedFraction(answerNumerator, denominator)}입니다.`);
      }
      if (variant % 3 === 1) {
        const total = denominator * int(rng, 8 + level * 2, 14 + level * 4) + int(rng, 1, denominator - 1);
        const first = denominator * int(rng, 2, 4 + level) + int(rng, 1, denominator - 1);
        const second = denominator * int(rng, 2, 4 + level) + int(rng, 1, denominator - 1);
        const answerNumerator = total - first - second;
        if (answerNumerator <= 0) return generators.fractionAddSubOneAdvanced({ rng, level, variant });
        return result(`전체 길이가 ${mixedFraction(total, denominator)}km인 길에서 첫 구간은 ${mixedFraction(first, denominator)}km, 둘째 구간은 ${mixedFraction(second, denominator)}km입니다. 남은 구간의 길이를 구하세요.`, mixedFraction(answerNumerator, denominator), `${mixedFraction(total, denominator)} - ${mixedFraction(first, denominator)} - ${mixedFraction(second, denominator)} = ${mixedFraction(answerNumerator, denominator)}km입니다.`);
      }
      const first = denominator * int(rng, 3, 6 + level) + int(rng, 1, denominator - 1);
      const second = denominator * int(rng, 2, 5 + level) + int(rng, 1, denominator - 1);
      const third = denominator * int(rng, 1, 3 + level) + int(rng, 1, denominator - 1);
      const answerNumerator = first + second - third;
      return result(`<div class="equation">(${mixedFraction(first, denominator)} + ${mixedFraction(second, denominator)}) - ${mixedFraction(third, denominator)} = □</div>`, mixedFraction(answerNumerator, denominator), `대분수를 가분수로 바꾸어 더한 뒤 빼면 ${mixedFraction(answerNumerator, denominator)}입니다.`);
    },
    fractionAddSubTwoAdvanced({ rng, level, variant = 0 }) {
      const denominator = pick(rng, [6, 10, 12]);
      if (variant % 3 === 0) {
        const count = int(rng, 12 + level * 5, 25 + level * 10);
        const remainder = int(rng, 1, denominator - 1);
        const wholeSum = count * (count + 1) / 2;
        const answerNumerator = wholeSum * denominator + count * remainder;
        return result(`다음 규칙으로 나열한 ${count}개의 분수를 모두 더한 값을 구하세요.<div class="sequence">1 ${remainder}/${denominator}, 2 ${remainder}/${denominator}, 3 ${remainder}/${denominator}, …, ${count} ${remainder}/${denominator}</div>`, mixedFraction(answerNumerator, denominator), `자연수 부분의 합은 ${count} × ${count + 1} ÷ 2 = ${wholeSum}이고 분수 부분의 합은 ${count} × ${remainder}/${denominator}입니다. 모두 더하면 ${mixedFraction(answerNumerator, denominator)}입니다.`);
      }
      if (variant % 3 === 1) {
        const count = int(rng, 5 + level, 9 + level * 2);
        const tape = denominator * int(rng, 5, 10 + level * 2) + int(rng, 1, denominator - 1);
        const overlap = int(rng, 1, Math.min(denominator - 1, Math.floor(tape / 3)));
        const answerNumerator = count * tape - (count - 1) * overlap;
        return result(`길이가 각각 ${mixedFraction(tape, denominator)}cm인 색 테이프 ${count}장을 이웃한 두 장끼리 ${overlap}/${denominator}cm씩 겹쳐 한 줄로 이어 붙였습니다. 전체 길이를 구하세요.`, mixedFraction(answerNumerator, denominator), `테이프 길이의 합에서 겹친 ${count - 1}곳을 빼면 ${count} × ${mixedFraction(tape, denominator)} - ${count - 1} × ${overlap}/${denominator} = ${mixedFraction(answerNumerator, denominator)}cm입니다.`);
      }
      const days = int(rng, 5 + level * 2, 12 + level * 4);
      const slow = int(rng, 1, Math.floor(denominator / 3));
      const fast = int(rng, 1, Math.floor(denominator / 3));
      const answer = days * (slow + fast) * 60 / denominator;
      return result(`한 시계는 하루에 ${slow}/${denominator}시간씩 늦어지고 다른 시계는 하루에 ${fast}/${denominator}시간씩 빨라집니다. 두 시계를 같은 시각에 맞춘 뒤 ${days}일 후 두 시계가 가리키는 시각의 차는 몇 분인지 구하세요.`, answer, `하루에 두 시계의 차는 ${slow + fast}/${denominator}시간씩 커집니다. ${days}일 동안의 차를 분으로 바꾸면 ${days} × ${slow + fast}/${denominator} × 60 = ${answer}분입니다.`);
    },
    conditionedFraction({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const target = int(rng, 32 + level * 15, 60 + level * 25);
        let group = 1;
        while (group * (group + 1) / 2 < target) group += 1;
        const previous = (group - 1) * group / 2;
        const position = target - previous;
        const whole = group - position + 1;
        const answer = mixedFraction(whole * group + position, group);
        const preview = ["1"];
        for (let current = 2; preview.length < 10; current += 1) for (let index = 1; index <= current && preview.length < 10; index += 1) preview.push(`${current - index + 1} ${index}/${current}`);
        return result(`다음 규칙으로 분수를 나열할 때 ${target}번째 수를 구하세요.<div class="sequence">${preview.join(", ")}, …</div>`, answer, `${group - 1}번째 묶음까지 ${previous}개이므로 ${target}번째 수는 ${group}번째 묶음의 ${position}번째입니다. 따라서 ${whole} ${position}/${group} = ${answer}입니다.`);
      }
      if (variant % 3 === 1) {
        const denominator = int(rng, 18 + level * 5, 30 + level * 10);
        const difference = int(rng, 2 + level, 6 + level * 2);
        const answer = denominator - 1 - difference;
        return result(`분모가 ${denominator}인 진분수 중 두 분수의 차가 ${difference}/${denominator}가 되도록 작은 분수와 큰 분수를 고르는 방법은 모두 몇 가지인지 구하세요.`, answer, `작은 분자의 범위는 1부터 ${denominator - 1 - difference}까지이고 큰 분자는 각각 ${difference}만큼 크게 정해집니다. 따라서 ${answer}가지입니다.`);
      }
      const denominator = int(rng, 6 + level, 10 + level * 2);
      const add = int(rng, 2, denominator - 1);
      const lower = int(rng, 1, 3 + level);
      const upper = lower + int(rng, 2, 4 + level);
      const valid = [];
      for (let value = 1; value <= upper * denominator; value += 1) if (lower * denominator < value + add && value + add < upper * denominator) valid.push(value);
      return result(`자연수 □가 ${lower} &lt; (□ + ${add})/${denominator} &lt; ${upper}를 만족합니다. □ 안에 들어갈 수 있는 자연수는 모두 몇 개인지 구하세요.`, valid.length, `부등식에 ${denominator}을 곱하면 ${lower * denominator} &lt; □ + ${add} &lt; ${upper * denominator}입니다. 이를 만족하는 자연수를 세면 ${valid.length}개입니다.`);
    },
    fractionWordEquation({ rng, level, variant = 0 }) {
      const denominator = pick(rng, [7, 8, 9, 10].slice(0, 3 + Math.min(level, 1)));
      if (variant % 3 === 0) {
        const a = denominator * int(rng, 1, 3 + level) + int(rng, 1, denominator - 1);
        const b = denominator * int(rng, 1, 3 + level) + int(rng, 1, denominator - 1);
        const c = denominator * int(rng, 1, 3 + level) + int(rng, 1, denominator - 1);
        const ab = a + b;
        const bc = b + c;
        const ac = a + c;
        return result(`세 수 A, B, C가 있습니다. A+B=${mixedFraction(ab, denominator)}, B+C=${mixedFraction(bc, denominator)}, A+C=${mixedFraction(ac, denominator)}일 때 A, B, C를 차례로 구하세요.`, `${mixedFraction(a, denominator)}, ${mixedFraction(b, denominator)}, ${mixedFraction(c, denominator)}`, `세 식을 모두 더하면 A+B+C의 2배입니다. A는 (A+B + A+C - B+C) ÷ 2로 구하고 같은 방법을 적용하면 A=${mixedFraction(a, denominator)}, B=${mixedFraction(b, denominator)}, C=${mixedFraction(c, denominator)}입니다.`);
      }
      if (variant % 3 === 1) {
        const larger = denominator * int(rng, 4, 8 + level) + int(rng, 1, denominator - 1);
        const smaller = denominator * int(rng, 1, 3 + level) + int(rng, 1, denominator - 1);
        const sum = larger + smaller;
        const difference = larger - smaller;
        return result(`두 수의 합이 ${mixedFraction(sum, denominator)}이고 차가 ${mixedFraction(difference, denominator)}입니다. 큰 수와 작은 수를 차례로 구하세요.`, `${mixedFraction(larger, denominator)}, ${mixedFraction(smaller, denominator)}`, `큰 수는 (합 + 차) ÷ 2, 작은 수는 (합 - 차) ÷ 2입니다. 따라서 ${mixedFraction(larger, denominator)}, ${mixedFraction(smaller, denominator)}입니다.`);
      }
      const second = denominator * int(rng, 1, 3 + level) + int(rng, 1, denominator - 1);
      const correct = denominator * int(rng, 1, 4 + level) + int(rng, 1, denominator - 1);
      const first = second + correct;
      const wrong = first + second;
      return result(`어떤 수에서 ${mixedFraction(second, denominator)}을 빼야 할 것을 잘못하여 더했더니 ${mixedFraction(wrong, denominator)}이 되었습니다. 바르게 계산한 값을 구하세요.`, mixedFraction(correct, denominator), `잘못 계산한 값에서 ${mixedFraction(second, denominator)}을 빼면 어떤 수 ${mixedFraction(first, denominator)}을 찾을 수 있습니다. 여기에서 다시 ${mixedFraction(second, denominator)}을 빼면 ${mixedFraction(correct, denominator)}입니다.`);
    },
    triangleCount({ rng, level, variant = 0 }) {
      if (variant % 2 === 0) {
        const side = int(rng, 3 + level, 4 + level);
        const answer = Math.floor(side * (side + 2) * (2 * side + 1) / 8);
        return result(`한 변을 ${side}등분하여 만든 아래 정삼각형 격자에서 크기가 서로 다른 정삼각형은 모두 몇 개인지 구하세요.${triangleLatticeSvg(side)}`, answer, `작은 정삼각형부터 큰 정삼각형까지 같은 방향과 거꾸로 된 방향을 모두 세면 ${answer}개입니다.`);
      }
      const parts = int(rng, 5 + level, 7 + level * 2);
      const answer = parts * (parts + 1) / 2;
      return result(`아래와 같이 꼭짓점에서 밑변의 ${parts}등분점으로 선분을 모두 그었습니다. 만들어진 삼각형은 모두 몇 개인지 구하세요.${triangleFanSvg(parts)}`, answer, `꼭짓점을 공통으로 하는 삼각형은 밑변의 두 점을 고르면 하나가 정해집니다. 따라서 ${parts} + ${parts - 1} + … + 1 = ${answer}개입니다.`);
    },
    triangleAngleType({ rng, level }) {
      const source = {
        acute: [[50, 60, 70], [40, 65, 75], [55, 55, 70], [30, 70, 80], [45, 60, 75]],
        right: [[30, 60, 90], [45, 45, 90], [25, 65, 90]],
        obtuse: [[20, 40, 120], [35, 35, 110], [25, 55, 100], [45, 30, 105], [15, 45, 120]]
      };
      const count = 5 + level;
      const kinds = shuffle(rng, ["acute", "acute", "right", "obtuse", "obtuse", level > 0 ? "acute" : "right", level > 1 ? "obtuse" : "acute"]).slice(0, count);
      const triangles = kinds.map((kind, index) => source[kind][(index + int(rng, 0, source[kind].length - 1)) % source[kind].length]);
      const totals = {
        acute: kinds.filter(kind => kind === "acute").length,
        right: kinds.filter(kind => kind === "right").length,
        obtuse: kinds.filter(kind => kind === "obtuse").length
      };
      return result(`다음 삼각형을 각의 크기에 따라 분류할 때 예각삼각형, 직각삼각형, 둔각삼각형은 각각 몇 개인지 차례로 구하세요.${triangleAngleCards(triangles)}`, `${totals.acute}, ${totals.right}, ${totals.obtuse}`, `한 각이 90°보다 크면 둔각삼각형, 90°이면 직각삼각형, 세 각이 모두 90°보다 작으면 예각삼각형입니다. 따라서 예각 ${totals.acute}개, 직각 ${totals.right}개, 둔각 ${totals.obtuse}개입니다.`);
    },
    isoscelesTriangle({ rng, level }) {
      const vertexAngles = level === 0 ? [80, 90, 100] : level === 1 ? [80, 90, 100, 110] : [70, 80, 100, 110];
      const vertex = pick(rng, vertexAngles);
      const base = (180 - vertex) / 2;
      const answer = vertex - base;
      return result(`이등변삼각형 ABC에서 AB=AC이고 D는 BC 위의 점입니다. AD=BD, ∠BAC=${vertex}°일 때 ∠CAD의 크기를 구하세요.${isoscelesSplitSvg(vertex)}`, answer, `이등변삼각형 ABC의 밑각은 (180 - ${vertex}) ÷ 2 = ${base}°입니다. AD=BD이므로 ∠BAD=∠ABD=${base}°입니다. 따라서 ∠CAD=${vertex} - ${base}=${answer}°입니다.`);
    },
    equilateralTriangle({ rng, level, variant = 0 }) {
      if (variant % 2 === 0) {
        const side = int(rng, 3 + level, 5 + level);
        const count = int(rng, 12 + level * 8, 24 + level * 12);
        const answer = (count + 2) * side;
        return result(`한 변의 길이가 ${side}cm인 정삼각형을 이웃한 도형과 한 변씩 겹치도록 ${count}개 이어 붙였습니다. 전체 둘레의 길이를 구하세요.${equilateralChainSvg()}`, answer, `정삼각형 1개로 시작하면 둘레는 3변이고, 한 개를 더 붙일 때마다 겹친 1변은 사라지고 2변이 새로 생겨 전체 변 수가 1개씩 늘어납니다. 따라서 둘레는 (${count} + 2) × ${side} = ${answer}cm입니다.`);
      }
      const side = int(rng, 5 + level, 7 + level * 2);
      const answer = 3 * side * (side + 1) / 2;
      return result(`길이가 같은 성냥개비로 한 변을 ${side}등분한 정삼각형 격자를 만들었습니다. 사용한 성냥개비는 모두 몇 개인지 구하세요.${triangleLatticeSvg(side)}`, answer, `가로·왼쪽 아래 방향·오른쪽 아래 방향의 성냥개비 수가 각각 1 + 2 + … + ${side} = ${side * (side + 1) / 2}개입니다. 세 방향을 합하면 ${answer}개입니다.`);
    },
    multiply({ rng, level }) {
      const r = range(level);
      const a = int(rng, 12, r.medium);
      const b = int(rng, 4, 9 + level * 7);
      return result(`<div class="equation">${a.toLocaleString()} × ${b} = □</div>`, a * b, `${a.toLocaleString()} × ${b} = ${(a * b).toLocaleString()}입니다.`);
    },
    divide({ rng, level }) {
      const divisor = int(rng, 3, 9 + level * 4);
      const quotient = int(rng, 12, 35 + level * 25);
      const dividend = divisor * quotient;
      return result(`<div class="equation">${dividend.toLocaleString()} ÷ ${divisor} = □</div>`, quotient, `${dividend.toLocaleString()}은 ${divisor}의 ${quotient}배이므로 몫은 ${quotient}입니다.`);
    },
    remainder({ rng, level }) {
      const divisor = int(rng, 4, 9 + level * 3);
      const quotient = int(rng, 8, 20 + level * 15);
      const remainder = int(rng, 1, divisor - 1);
      const dividend = divisor * quotient + remainder;
      return result(`${dividend}을 ${divisor}로 나눈 몫과 나머지를 차례로 쓰세요.`, `${quotient}, ${remainder}`, `${dividend} = ${divisor} × ${quotient} + ${remainder}이므로 몫은 ${quotient}, 나머지는 ${remainder}입니다.`);
    },
    mixedOperation({ rng, level }) {
      const a = int(rng, 8, 18 + level * 8);
      const b = int(rng, 3, 8 + level * 3);
      const c = int(rng, 2, 7);
      const d = int(rng, 5, 20);
      const answer = a + b * c - d;
      return result(`<div class="equation">${a} + ${b} × ${c} - ${d} = □</div>`, answer, `곱셈을 먼저 계산하면 ${b} × ${c} = ${b * c}이고, ${a} + ${b * c} - ${d} = ${answer}입니다.`);
    },
    fractionCompare({ rng, level }) {
      const d = int(rng, 5, 9 + level * 3);
      const a = int(rng, 1, d - 2);
      const b = int(rng, a + 1, d - 1);
      const leftFirst = rng() > 0.5;
      const left = leftFirst ? a : b;
      const right = leftFirst ? b : a;
      const symbol = left > right ? ">" : "<";
      return result(`□ 안에 &gt;, =, &lt; 중 알맞은 기호를 쓰세요.<div class="equation">${left}/${d} □ ${right}/${d}</div>`, symbol, `분모가 같은 분수는 분자가 큰 분수가 더 크므로 ${left}/${d} ${symbol} ${right}/${d}입니다.`);
    },
    fractionAddSub({ rng, level }) {
      const d1 = int(rng, 3, 6 + level * 2);
      const d2 = level ? int(rng, 3, 7 + level * 2) : d1;
      const n1 = int(rng, 1, d1 - 1);
      const n2 = int(rng, 1, d2 - 1);
      const add = rng() > 0.35;
      let numerator = n1 * d2 + (add ? 1 : -1) * n2 * d1;
      if (numerator <= 0) return generators.fractionAddSub({ rng, level });
      const denominator = d1 * d2;
      const answer = fraction(numerator, denominator);
      const common = lcm(d1, d2);
      return result(`<div class="equation">${n1}/${d1} ${add ? "+" : "-"} ${n2}/${d2} = □</div>`, answer, `공통분모 ${common}으로 통분하여 계산하고 약분하면 ${answer}입니다.`);
    },
    decimalAddSub({ rng, level }) {
      const scale = level > 0 ? 100 : 10;
      const a = int(rng, 12, 90 + level * 80) / scale;
      const b = int(rng, 5, Math.max(6, Math.floor(a * scale) - 1)) / scale;
      const add = rng() > 0.4;
      const answer = decimal(add ? a + b : a - b, 3);
      return result(`<div class="equation">${decimal(a, 3)} ${add ? "+" : "-"} ${decimal(b, 3)} = □</div>`, answer, `소수점을 맞추어 계산하면 ${answer}입니다.`);
    },
    factors({ rng, level }) {
      const a = int(rng, 2, 6 + level * 3);
      const b = int(rng, 2, 6 + level * 3);
      const c = int(rng, 2, 5 + level * 2);
      const first = a * c;
      const second = b * c;
      const useLcm = rng() > 0.5;
      const answer = useLcm ? lcm(first, second) : gcd(first, second);
      return result(`${first}과 ${second}의 ${useLcm ? "최소공배수" : "최대공약수"}를 구하세요.`, answer, `${first}과 ${second}의 ${useLcm ? "공배수 중 가장 작은 수" : "공약수 중 가장 큰 수"}는 ${answer}입니다.`);
    },
    primeFactor({ rng, level }) {
      const primes = [2, 3, 5, 7].slice(0, 3 + Math.min(level, 1));
      const chosen = [pick(rng, primes), pick(rng, primes), pick(rng, primes)].sort((a, b) => a - b);
      if (level > 1) chosen.push(pick(rng, primes));
      const value = chosen.reduce((product, item) => product * item, 1);
      return result(`${value}을 소인수의 곱으로 나타내세요.`, chosen.join(" × "), `${value}을 소수로 차례로 나누면 ${chosen.join(" × ")}입니다.`);
    },
    correspondence({ rng, level }) {
      const a = int(rng, 2, 6 + level);
      const b = int(rng, 1, 9);
      const x = int(rng, 5, 12 + level * 5);
      const answer = a * x + b;
      return result(`두 수 x와 y 사이에 <b>y = ${a} × x + ${b}</b>의 대응 관계가 있습니다. x가 ${x}일 때 y를 구하세요.`, answer, `x 자리에 ${x}을 넣으면 y = ${a} × ${x} + ${b} = ${answer}입니다.`);
    },
    rounding({ rng, level }) {
      const unit = pick(rng, [10, 100, 1000].slice(0, 2 + Math.min(level, 1)));
      const value = int(rng, 120, 9800);
      const answer = Math.round(value / unit) * unit;
      return result(`${value.toLocaleString()}을 ${unit.toLocaleString()}의 자리에서 반올림하세요.`, answer, `${unit.toLocaleString()}의 자리 바로 아래 숫자를 보고 반올림하면 ${answer.toLocaleString()}입니다.`);
    },
    fractionMultiply({ rng, level }) {
      const d1 = int(rng, 3, 8 + level * 2);
      const d2 = int(rng, 3, 8 + level * 2);
      const n1 = int(rng, 1, d1 - 1);
      const n2 = int(rng, 1, d2 - 1);
      const answer = fraction(n1 * n2, d1 * d2);
      return result(`<div class="equation">${n1}/${d1} × ${n2}/${d2} = □</div>`, answer, `분자는 ${n1} × ${n2}, 분모는 ${d1} × ${d2}로 계산한 뒤 약분하면 ${answer}입니다.`);
    },
    decimalMultiply({ rng, level }) {
      const a = int(rng, 12, 79) / 10;
      const b = level ? int(rng, 12, 49) / 10 : int(rng, 2, 9);
      const answer = decimal(a * b, 3);
      return result(`<div class="equation">${decimal(a)} × ${decimal(b)} = □</div>`, answer, `자연수처럼 곱한 뒤 두 수의 소수 자릿수만큼 소수점을 옮기면 ${answer}입니다.`);
    },
    average({ rng, level }) {
      const count = 4 + Math.min(level, 1);
      const mean = int(rng, 12, 28 + level * 10);
      const offsets = count === 4 ? [-3, -1, 1, 3] : [-4, -2, 0, 2, 4];
      const values = shuffle(rng, offsets.map(offset => mean + offset));
      return result(`${values.join(", ")}의 평균을 구하세요.`, mean, `합은 ${mean * count}이고 자료는 ${count}개이므로 평균은 ${mean * count} ÷ ${count} = ${mean}입니다.`);
    },
    chance({ rng, level }) {
      const red = int(rng, 2, 5 + level);
      const blue = int(rng, 2, 5 + level);
      const yellow = int(rng, 1, 4 + level);
      const total = red + blue + yellow;
      return result(`주머니에 빨간 공 ${red}개, 파란 공 ${blue}개, 노란 공 ${yellow}개가 있습니다. 공 1개를 꺼낼 때 빨간 공이 나올 가능성을 분수로 나타내세요.`, fraction(red, total), `전체 공은 ${total}개이고 빨간 공은 ${red}개이므로 가능성은 ${red}/${total}, 약분하면 ${fraction(red, total)}입니다.`);
    },
    fractionDivide({ rng, level }) {
      const a = int(rng, 1, 4 + level);
      const b = int(rng, a + 1, 8 + level * 2);
      const c = int(rng, 2, 5 + level);
      const answer = fraction(a, b * c);
      return result(`<div class="equation">${a}/${b} ÷ ${c} = □</div>`, answer, `자연수 ${c}로 나누는 것은 분모에 ${c}를 곱하는 것과 같으므로 ${answer}입니다.`);
    },
    fractionDecimalMixed({ rng, level }) {
      const denominator = pick(rng, [2, 4, 5, 10]);
      const numerator = int(rng, 1, denominator - 1);
      const decimalValue = int(rng, 1, 8 + level) / 10;
      const add = rng() > 0.35;
      const fractionValue = numerator / denominator;
      if (!add && fractionValue <= decimalValue) return generators.fractionDecimalMixed({ rng, level });
      const answer = decimal(add ? fractionValue + decimalValue : fractionValue - decimalValue, 3);
      return result(`<div class="equation">${numerator}/${denominator} ${add ? "+" : "-"} ${decimal(decimalValue)} = □</div>`, answer, `${numerator}/${denominator}을 소수 ${decimal(fractionValue, 3)}로 바꾸어 계산하면 ${answer}입니다.`);
    },
    decimalDivide({ rng, level }) {
      const divisor = int(rng, 2, 8 + level * 2);
      const quotient = int(rng, 12, 45 + level * 20) / 10;
      const dividend = decimal(divisor * quotient, 2);
      return result(`<div class="equation">${dividend} ÷ ${divisor} = □</div>`, decimal(quotient, 2), `${dividend}을 ${divisor}로 나누면 ${decimal(quotient, 2)}입니다.`);
    },
    ratioPercent({ rng, level }) {
      const total = pick(rng, [40, 50, 80, 100, 120].slice(0, 3 + level));
      const percent = pick(rng, [10, 20, 25, 30, 40, 50, 60]);
      const answer = total * percent / 100;
      return result(`${total}의 ${percent}%는 얼마인지 구하세요.`, answer, `${total} × ${percent}/100 = ${answer}입니다.`);
    },
    priceConcentration({ rng, level }) {
      const price = int(rng, 12, 35 + level * 10) * 1000;
      const discount = pick(rng, [10, 15, 20, 25, 30]);
      const answer = price * (100 - discount) / 100;
      return result(`${price.toLocaleString()}원인 물건을 ${discount}% 할인하여 샀습니다. 지불한 금액을 구하세요.`, answer, `할인 후에는 정가의 ${100 - discount}%를 내므로 ${price.toLocaleString()} × ${(100 - discount)}/100 = ${answer.toLocaleString()}원입니다.`);
    },
    prismSurface({ rng, level }) {
      const a = int(rng, 3, 7 + level);
      const b = int(rng, 4, 9 + level);
      const c = int(rng, 5, 11 + level);
      const answer = 2 * (a * b + b * c + c * a);
      return result(`가로 ${a}cm, 세로 ${b}cm, 높이 ${c}cm인 직육면체의 겉넓이를 구하세요.`, answer, `서로 다른 세 면의 넓이의 합에 2를 곱하면 2 × (${a}×${b} + ${b}×${c} + ${c}×${a}) = ${answer}cm²입니다.`);
    },
    prismVolume({ rng, level }) {
      const a = int(rng, 3, 7 + level);
      const b = int(rng, 4, 9 + level);
      const c = int(rng, 5, 11 + level);
      const answer = a * b * c;
      return result(`가로 ${a}cm, 세로 ${b}cm, 높이 ${c}cm인 직육면체의 부피를 구하세요.`, answer, `${a} × ${b} × ${c} = ${answer}cm³입니다.`);
    },
    proportion({ rng, level }) {
      const a = int(rng, 2, 6 + level);
      const b = int(rng, 3, 8 + level);
      const multiplier = int(rng, 2, 5 + level);
      const c = a * multiplier;
      const answer = b * multiplier;
      return result(`비례식에서 □에 알맞은 수를 구하세요.<div class="equation">${a} : ${b} = ${c} : □</div>`, answer, `앞항 ${a}에 ${multiplier}를 곱하여 ${c}이 되었으므로 뒤항에도 ${multiplier}를 곱합니다. ${b} × ${multiplier} = ${answer}입니다.`);
    },
    proportionalDivision({ rng, level }) {
      const a = int(rng, 2, 5 + level);
      const b = int(rng, 2, 6 + level);
      const unit = int(rng, 3, 8 + level);
      const total = (a + b) * unit;
      return result(`${total}을 ${a} : ${b}로 비례배분할 때 큰 수를 구하세요.`, Math.max(a, b) * unit, `전체 비는 ${a + b}이고 한 몫은 ${total} ÷ ${a + b} = ${unit}입니다. 큰 비에 곱하면 ${Math.max(a, b) * unit}입니다.`);
    },
    circle({ rng, level }) {
      const radius = int(rng, 3, 8 + level);
      const askArea = rng() > 0.4;
      const answer = askArea ? decimal(3.14 * radius * radius, 2) : decimal(2 * 3.14 * radius, 2);
      return result(`원주율을 3.14로 할 때 반지름이 ${radius}cm인 원의 ${askArea ? "넓이" : "원주"}를 구하세요.`, answer, askArea ? `원의 넓이는 ${radius} × ${radius} × 3.14 = ${answer}cm²입니다.` : `원주는 ${radius} × 2 × 3.14 = ${answer}cm입니다.`);
    },
    sector({ rng, level }) {
      const radius = int(rng, 4, 8 + level);
      const angle = pick(rng, [60, 90, 120, 180]);
      const answer = decimal(3.14 * radius * radius * angle / 360, 2);
      return result(`원주율을 3.14로 할 때 반지름이 ${radius}cm이고 중심각이 ${angle}°인 부채꼴의 넓이를 구하세요.`, answer, `원 넓이 ${radius} × ${radius} × 3.14에 ${angle}/360을 곱하면 ${answer}cm²입니다.`);
    },
    cylinderSurface({ rng, level }) {
      const radius = int(rng, 2, 5 + level);
      const height = int(rng, 5, 10 + level * 2);
      const cone = rng() > 0.5;
      if (cone) {
        const slant = height + int(rng, 2, 5);
        const answer = decimal(3.14 * radius * radius + 3.14 * radius * slant, 2);
        return result(`원주율을 3.14로 할 때 밑면의 반지름이 ${radius}cm, 모선이 ${slant}cm인 원뿔의 겉넓이를 구하세요.`, answer, `밑면과 옆면의 넓이를 더하면 3.14 × ${radius}² + 3.14 × ${radius} × ${slant} = ${answer}cm²입니다.`);
      }
      const answer = decimal(2 * 3.14 * radius * radius + 2 * 3.14 * radius * height, 2);
      return result(`원주율을 3.14로 할 때 밑면의 반지름이 ${radius}cm, 높이가 ${height}cm인 원기둥의 겉넓이를 구하세요.`, answer, `두 밑면과 옆면의 넓이를 더하면 2 × 3.14 × ${radius}² + 2 × 3.14 × ${radius} × ${height} = ${answer}cm²입니다.`);
    }
  };

  const rules = [
    [/^큰 수 알아보기$/, "largeNumberPlaceValue"],
    [/^큰 수의 크기 비교$/, "largeNumberCompare"],
    [/^큰 수의 규칙성과 뛰어 세기$/, "largeNumberSkipPattern"],
    [/^큰 수의 활용$/, "largeNumberApplication"],
    [/^조건에 맞는 수 찾기$/, "conditionedNumber"],
    [/^수 카드로 수 만들기$/, "digitCardNumber"],
    [/^여러 각도$/, "multiAngle"],
    [/^각도의 계산$/, "angleCalculation"],
    [/^다각형의 내각의 합$/, "polygonInterior"],
    [/^다각형의 외각의 성질$/, "polygonExterior"],
    [/^내각과 외각의 성질의 활용$/, "interiorExteriorApplication"],
    [/^시침과 분침 사이의 각도$/, "clockAngle"],
    [/^곱셈 알아보기$/, "multiplicationUnderstanding"],
    [/^곱셈 응용 문제$/, "multiplicationApplication"],
    [/^나눗셈 알아보기$/, "divisionUnderstanding"],
    [/^나눗셈 응용 문제$/, "divisionApplication"],
    [/^나눗셈의 나머지$/, "advancedRemainder"],
    [/^곱셈식 완성하기$/, "multiplicationCompletion"],
    [/^평면도형 밀기, 뒤집기, 돌리기$/, "planeTransform"],
    [/^연속 이동$/, "sequentialTransform"],
    [/^평면도형 이동의 활용 ①$/, "movementPatternOne"],
    [/^평면도형 이동의 활용 ②$/, "movementPatternTwo"],
    [/^막대그래프의 이해$/, "barGraphUnderstanding"],
    [/^막대그래프의 활용$/, "barGraphApplication"],
    [/^일렬로 나열한 수에서 규칙 찾기$/, "advancedLinePattern"],
    [/^여러 가지 배열에서 수들의 규칙$/, "arrayNumberRules"],
    [/^배열된 수들의 합$/, "advancedArraySum"],
    [/^연산의 규칙$/, "advancedOperationRule"],
    [/^나열된 도형에서의 규칙$/, "advancedShapePattern"],
    [/^조건을 만족하는 수의 개수$/, "conditionedNumberCount"],
    [/^분수의 이해$/, "fractionUnderstanding"],
    [/^분수의 종류와 크기 비교$/, "advancedFractionCompare"],
    [/^분수의 덧셈과 뺄셈 1$/, "fractionAddSubOneAdvanced"],
    [/^분수의 덧셈과 뺄셈 2$/, "fractionAddSubTwoAdvanced"],
    [/일렬로 나열한 수|배열된 수들의 합/, "numberPattern"],
    [/^평행선 사이의 각도/, "angle"],
    [/^혼합 계산의 순서$|^하나의 식으로 나타내기$|^연산의 규칙$|^혼합 계산식 만들기$/, "mixedOperation"],
    [/분수의 종류와 크기 비교|통분과 분수의 크기 비교/, "fractionCompare"],
    [/분수의 덧셈|분수의 뺄셈|분수의 덧셈과 뺄셈/, "fractionAddSub"],
    [/^소수의 덧셈과 뺄셈$/, "decimalAddSub"],
    [/소인수분해/, "primeFactor"],
    [/최대공약수|최소공배수|^공약수의 활용$|^공배수의 활용$/, "factors"],
    [/^규칙과 대응$|^대응표와 대응 관계$/, "correspondence"],
    [/^어림하기$|^어림한 수의 범위$/, "rounding"],
    [/^분수와 자연수의 곱셈$|^분수끼리의 곱셈$/, "fractionMultiply"],
    [/소수와 자연수의 곱셈|소수와 소수의 곱셈/, "decimalMultiply"],
    [/^평균 구하기$/, "average"],
    [/사건의 가능성/, "chance"],
    [/^분수 나눗셈의 이해$/, "fractionDivide"],
    [/^분수와 소수의 혼합 계산$/, "fractionDecimalMixed"],
    [/^소수와 자연수의 나눗셈$|^소수 나눗셈의 이해$|^몫이 소수인 자연수의 나눗셈$/, "decimalDivide"],
    [/가격과 진하기/, "priceConcentration"],
    [/비와 비율|백분율|여러 가지 비율/, "ratioPercent"],
    [/^직육면체의 겉넓이$/, "prismSurface"],
    [/^직육면체의 부피$/, "prismVolume"]
    ,[/비의 성질과 비례식|비례식의 성질|비례식을 세워/, "proportion"]
    ,[/비례배분/, "proportionalDivision"]
    ,[/원주와 호의 길이/, "circle"]
    ,[/원과 부채꼴의 넓이/, "sector"]
    ,[/원기둥과 원뿔의 겉넓이/, "cylinderSurface"]
  ];

  const scopedRules = [
    [type => type.id === "4-2-u1-t5", "conditionedFraction"],
    [type => type.id === "4-2-u1-t6", "fractionWordEquation"],
    [type => type.id === "4-2-u2-t1", "triangleCount"],
    [type => type.id === "4-2-u2-t2", "triangleAngleType"],
    [type => type.id === "4-2-u2-t3", "isoscelesTriangle"],
    [type => type.id === "4-2-u2-t4", "equilateralTriangle"]
  ];

  function generatorKey(typeOrName) {
    const type = typeof typeOrName === "string" ? { name: typeOrName } : typeOrName;
    const scoped = scopedRules.find(([matches]) => matches(type))?.[1];
    if (scoped) return scoped;
    return rules.find(([pattern]) => pattern.test(type.name))?.[1] || "";
  }

  function mulberry32(seed) {
    return () => {
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function generate(type, _levelRank, difficultyOffset, seed, variant = 0) {
    const key = generatorKey(type);
    if (!key) return null;
    const level = Math.max(0, Math.min(2, 1 + difficultyOffset));
    return { ...generators[key]({ rng: mulberry32(seed), level, variant }), generator: key };
  }

  window.HSE_GENERATORS = { generatorKey, generate, names: Object.keys(generators) };
})();
