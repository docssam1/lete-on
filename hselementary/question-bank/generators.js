(() => {
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
  const gcdMany = values => values.reduce((total, value) => gcd(total, value));
  const lcmMany = values => values.reduce((total, value) => lcm(total, value));
  const factorMap = value => {
    const factors = new Map();
    let remaining = value;
    for (let divisor = 2; divisor * divisor <= remaining; divisor += divisor === 2 ? 1 : 2) {
      while (remaining % divisor === 0) {
        factors.set(divisor, (factors.get(divisor) || 0) + 1);
        remaining /= divisor;
      }
    }
    if (remaining > 1) factors.set(remaining, (factors.get(remaining) || 0) + 1);
    return factors;
  };
  const factorMapProduct = factors => [...factors.entries()].reduce((total, [prime, power]) => total * prime ** power, 1);
  const factorMapText = factors => [...factors.entries()]
    .sort(([left], [right]) => left - right)
    .map(([prime, power]) => power === 1 ? String(prime) : `${prime}^${power}`)
    .join(" × ");
  const factorMapMultiply = (...maps) => maps.reduce((total, factors) => {
    factors.forEach((power, prime) => total.set(prime, (total.get(prime) || 0) + power));
    return total;
  }, new Map());
  const factorMapDivide = (numerator, denominator) => {
    const answer = new Map(numerator);
    denominator.forEach((power, prime) => answer.set(prime, (answer.get(prime) || 0) - power));
    [...answer.entries()].forEach(([prime, power]) => {
      if (power < 0) throw new Error("소인수 지수가 음수가 되었습니다.");
      if (power === 0) answer.delete(prime);
    });
    return answer;
  };
  const allDivisors = value => {
    const output = [];
    for (let divisor = 1; divisor * divisor <= value; divisor += 1) {
      if (value % divisor) continue;
      output.push(divisor);
      if (divisor * divisor !== value) output.push(value / divisor);
    }
    return output.sort((left, right) => left - right);
  };
  const eulerPhi = value => Array.from({ length: value - 1 }, (_, index) => index + 1).filter(numerator => gcd(numerator, value) === 1).length;
  const pick = (rng, values) => values[Math.floor(rng() * values.length)];
  const int = (rng, min, max) => Math.floor(rng() * (max - min + 1)) + min;
  const shuffle = (rng, values) => [...values].sort(() => rng() - 0.5);
  const decimal = (value, places = 2) => Number(value.toFixed(places)).toString();
  const fixedDecimal = (scaled, places) => (scaled / 10 ** places).toFixed(places);
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
  const rationalValue = (numerator, denominator = 1) => {
    if (!denominator) return null;
    const sign = denominator < 0 ? -1 : 1;
    const divisor = gcd(numerator, denominator);
    return { numerator: sign * numerator / divisor, denominator: sign * denominator / divisor };
  };
  const rationalOperation = (left, right, operator) => {
    if (!left || !right) return null;
    if (operator === "+") return rationalValue(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
    if (operator === "-") return rationalValue(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
    if (operator === "×") return rationalValue(left.numerator * right.numerator, left.denominator * right.denominator);
    if (operator === "÷") return right.numerator ? rationalValue(left.numerator * right.denominator, left.denominator * right.numerator) : null;
    return null;
  };
  const flatMixedValue = (numbers, operators) => {
    const terms = [typeof numbers[0] === "number" ? rationalValue(numbers[0]) : numbers[0]];
    const additiveOperators = [];
    for (let index = 0; index < operators.length; index += 1) {
      const value = typeof numbers[index + 1] === "number" ? rationalValue(numbers[index + 1]) : numbers[index + 1];
      const operator = operators[index];
      if (operator === "×" || operator === "÷") {
        terms[terms.length - 1] = rationalOperation(terms[terms.length - 1], value, operator);
      } else {
        additiveOperators.push(operator);
        terms.push(value);
      }
    }
    return terms.slice(1).reduce((total, value, index) => rationalOperation(total, value, additiveOperators[index]), terms[0]);
  };
  const operatorPermutations = (values) => {
    const output = [];
    const visit = (chosen, remaining) => {
      if (!remaining.length) {
        output.push(chosen);
        return;
      }
      remaining.forEach((value, index) => visit([...chosen, value], [...remaining.slice(0, index), ...remaining.slice(index + 1)]));
    };
    visit([], values);
    return output;
  };
  const mixedExpressionText = (numbers, operators, withMiddleParentheses = false) => withMiddleParentheses
    ? `${numbers[0]} ${operators[0]} (${numbers[1]} ${operators[1]} ${numbers[2]}) ${operators[2]} ${numbers[3]} ${operators[3]} ${numbers[4]}`
    : numbers.slice(1).reduce((text, number, index) => `${text} ${operators[index]} ${number}`, String(numbers[0]));
  const mixedExpressionValue = (numbers, operators, withMiddleParentheses = false) => {
    if (!withMiddleParentheses) return flatMixedValue(numbers, operators);
    const middle = rationalOperation(rationalValue(numbers[1]), rationalValue(numbers[2]), operators[1]);
    return flatMixedValue([numbers[0], middle, numbers[3], numbers[4]], [operators[0], operators[2], operators[3]]);
  };
  const uniqueOperatorPuzzle = (rng, level) => {
    const allOperators = ["+", "-", "×", "÷"];
    for (let attempt = 0; attempt < 360; attempt += 1) {
      const numbers = Array.from({ length: 5 }, () => int(rng, 2 + level, 12 + level * 9));
      const withMiddleParentheses = level === 2 && rng() > 0.35;
      const candidates = operatorPermutations(allOperators).map(operators => {
        const value = mixedExpressionValue(numbers, operators, withMiddleParentheses);
        return { operators, value };
      }).filter(candidate => candidate.value && candidate.value.denominator === 1 && candidate.value.numerator > 0 && candidate.value.numerator <= 9000);
      const grouped = new Map();
      candidates.forEach(candidate => {
        const group = grouped.get(candidate.value.numerator) || [];
        group.push(candidate);
        grouped.set(candidate.value.numerator, group);
      });
      const unique = candidates.filter(candidate => grouped.get(candidate.value.numerator).length === 1);
      if (unique.length) {
        const selected = pick(rng, unique);
        return { ...selected, numbers, withMiddleParentheses, target: selected.value.numerator };
      }
    }
    throw new Error("유일한 혼합 계산식 조건을 만들지 못했습니다.");
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
  const fractionEquation = (kind, terms, expected, body) => {
    const termText = terms.map(({ numerator, denominator }) => `${numerator}/${denominator}`).join(";");
    return `<div class="equation" data-fraction-kind="${kind}" data-fraction-terms="${termText}" data-fraction-expected="${expected.numerator}/${expected.denominator}">${body}</div>`;
  };
  const answerEquation = (kind, expected, body) => `<div class="equation" data-fraction-kind="${kind}" data-fraction-answer="${expected}">${body}</div>`;
  const correspondenceTable = rows => `<table class="problem-table"><tbody>${rows.map(([label, ...values]) => `<tr><th>${label}</th>${values.map(value => `<td>${value}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
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
  const regularPolygonPoints = (sides, cx = 120, cy = 84, radius = 58) => Array.from({ length: sides }, (_, index) => polar(cx, cy, radius, index * 360 / sides));
  const pointText = point => point.map(value => value.toFixed(1)).join(",");
  const polygonDiagonalSvg = (sides, mode = "fan") => {
    const points = regularPolygonPoints(sides);
    const outline = points.map(pointText).join(" ");
    const diagonals = [];
    if (mode === "fan") {
      for (let index = 2; index <= sides - 2; index += 1) diagonals.push('<line class="crease" x1="' + points[0][0].toFixed(1) + '" y1="' + points[0][1].toFixed(1) + '" x2="' + points[index][0].toFixed(1) + '" y2="' + points[index][1].toFixed(1) + '"/>');
    } else {
      for (let first = 0; first < sides; first += 1) {
        for (let second = first + 1; second < sides; second += 1) {
          if (second === first + 1 || (first === 0 && second === sides - 1)) continue;
          diagonals.push('<line class="crease" x1="' + points[first][0].toFixed(1) + '" y1="' + points[first][1].toFixed(1) + '" x2="' + points[second][0].toFixed(1) + '" y2="' + points[second][1].toFixed(1) + '"/>');
        }
      }
    }
    const labels = points.map((point, index) => {
      const [x, y] = polar(120, 84, 76, index * 360 / sides);
      return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '">' + String.fromCharCode(65 + index) + '</text>';
    }).join("");
    return '<svg class="geometry-diagram polygon-diagonal" viewBox="0 0 240 168" data-polygon-sides="' + sides + '" data-diagonal-mode="' + mode + '" aria-label="정' + sides + '각형과 대각선"><polygon points="' + outline + '"/>' + diagonals.join("") + labels + '</svg>';
  };
  const regularMeetSvg = (angles, labels) => {
    const cx = 120;
    const cy = 84;
    let current = 0;
    const starts = angles.map(angle => {
      const start = current;
      current += angle;
      return start;
    });
    const lines = angles.map((_, index) => {
      const point = polar(cx, cy, 64, starts[index]);
      return '<line x1="' + cx + '" y1="' + cy + '" x2="' + point[0].toFixed(1) + '" y2="' + point[1].toFixed(1) + '"/>';
    }).join("");
    const texts = labels.map((label, index) => {
      const point = polar(cx, cy, 37, starts[index] + angles[index] / 2);
      return '<text x="' + point[0].toFixed(1) + '" y="' + point[1].toFixed(1) + '">' + label + '</text>';
    }).join("");
    return '<svg class="geometry-diagram regular-meet" viewBox="0 0 240 168" data-angles="' + angles.join(",") + '" aria-label="정다각형을 맞댄 각"><circle cx="' + cx + '" cy="' + cy + '" r="64"/>' + lines + texts + '<circle cx="' + cx + '" cy="' + cy + '" r="3"/></svg>';
  };
  const tileBoardSvg = ({ rows, cols, highlight = "none" }) => {
    const cell = Math.min(34, Math.floor(170 / Math.max(rows, cols)));
    const width = cols * cell;
    const height = rows * cell;
    const left = (240 - width) / 2;
    const top = (164 - height) / 2;
    const cells = Array.from({ length: rows * cols }, (_, index) => {
      const row = Math.floor(index / cols);
      const column = index % cols;
      const selected = highlight === "checker" ? (row + column) % 2 === 0 : highlight === "border" ? row === 0 || column === 0 || row === rows - 1 || column === cols - 1 : false;
      return '<rect x="' + (left + column * cell) + '" y="' + (top + row * cell) + '" width="' + cell + '" height="' + cell + '" style="fill:' + (selected ? "#dceffd" : "#ffffff") + '"/>';
    }).join("");
    return '<svg class="geometry-diagram tile-board" viewBox="0 0 240 164" data-tile-rows="' + rows + '" data-tile-cols="' + cols + '" data-tile-highlight="' + highlight + '" aria-label="' + rows + '행 ' + cols + '열 타일"><g>' + cells + '</g></svg>';
  };
  const normalizeCells = cells => {
    const minX = Math.min(...cells.map(cell => cell[0]));
    const minY = Math.min(...cells.map(cell => cell[1]));
    return cells.map(cell => [cell[0] - minX, cell[1] - minY]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  };
  const shapeKey = cells => normalizeCells(cells).map(cell => cell.join(",")).join(";");
  const shapeRotations = cells => {
    const shapes = new Map();
    let current = cells;
    for (let turn = 0; turn < 4; turn += 1) {
      current = normalizeCells(current);
      shapes.set(shapeKey(current), current);
      current = current.map(cell => [cell[1], -cell[0]]);
    }
    return [...shapes.values()];
  };
  const placementCount = (rows, cols, cells) => shapeRotations(cells).reduce((total, shape) => {
    const width = Math.max(...shape.map(cell => cell[0])) + 1;
    const height = Math.max(...shape.map(cell => cell[1])) + 1;
    return total + Math.max(0, cols - width + 1) * Math.max(0, rows - height + 1);
  }, 0);
  const piecePlacementSvg = ({ rows, cols, cells }) => {
    const cell = 22;
    const leftOrigin = [20, 54];
    const rightOrigin = [118, 20];
    const piece = normalizeCells(cells);
    const miniWidth = Math.max(...piece.map(cellValue => cellValue[0])) + 1;
    const miniHeight = Math.max(...piece.map(cellValue => cellValue[1])) + 1;
    const mini = piece.map(cellValue => '<rect x="' + (leftOrigin[0] + cellValue[0] * cell) + '" y="' + (leftOrigin[1] + (miniHeight - cellValue[1] - 1) * cell) + '" width="' + cell + '" height="' + cell + '" style="fill:#dceffd"/>').join("");
    const board = Array.from({ length: rows * cols }, (_, index) => {
      const row = Math.floor(index / cols);
      const column = index % cols;
      return '<rect x="' + (rightOrigin[0] + column * cell) + '" y="' + (rightOrigin[1] + row * cell) + '" width="' + cell + '" height="' + cell + '"/>';
    }).join("");
    return '<svg class="geometry-diagram piece-placement" viewBox="0 0 240 164" data-piece-rows="' + rows + '" data-piece-cols="' + cols + '" data-piece-cells="' + piece.map(cellValue => cellValue.join(",")).join(";") + '" aria-label="조각과 모눈"><text x="39" y="34">조각</text><text x="164" y="14">모눈</text><g>' + mini + '</g><g>' + board + '</g></svg>';
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
    if (!Number.isFinite(step) || step <= 0) throw new Error("막대그래프 눈금 단위가 올바르지 않습니다.");
    const width = 250;
    const height = 180;
    const left = 34;
    const right = 10;
    const top = 12;
    const bottom = secondValues ? 48 : 34;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const allValues = values.concat(secondValues || []);
    if (allValues.some(value => !Number.isFinite(value) || value < 0 || !Number.isInteger(value / step))) {
      throw new Error("막대그래프 값은 눈금 단위의 배수여야 합니다.");
    }
    const scaleMax = Math.max(step, Math.ceil(Math.max(...allValues) / step) * step);
    const tickCount = scaleMax / step + 1;
    if (tickCount > 10) throw new Error("막대그래프 세로 눈금은 10개 이하여야 합니다.");
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
      let markup = `<rect class="chart-bar" data-chart-value="${values[index]}" x="${firstX.toFixed(1)}" y="${yFor(values[index]).toFixed(1)}" width="${barWidth.toFixed(1)}" height="${firstHeight.toFixed(1)}"/>`;
      if (secondValues) {
        const secondHeight = secondValues[index] / scaleMax * plotHeight;
        markup += `<rect class="chart-bar chart-bar-secondary" data-chart-value="${secondValues[index]}" x="${(center + 1).toFixed(1)}" y="${yFor(secondValues[index]).toFixed(1)}" width="${barWidth.toFixed(1)}" height="${secondHeight.toFixed(1)}"/>`;
      }
      return `${markup}${labelText}`;
    }).join("");
    const legendMarkup = secondValues ? `<g class="chart-legend"><rect x="${left}" y="${height - 16}" width="9" height="9"/><text x="${left + 13}" y="${height - 8}">${legend[0] || "자료 1"}</text><rect class="chart-bar-secondary" x="${left + 78}" y="${height - 16}" width="9" height="9"/><text x="${left + 91}" y="${height - 8}">${legend[1] || "자료 2"}</text></g>` : "";
    return `<div class="graph-figure"><p class="graph-scale-note">세로 눈금 한 칸은 ${step}${unit}입니다.</p><svg class="bar-chart" viewBox="0 0 ${width} ${height}" aria-label="세로 눈금 한 칸이 ${step}${unit}인 막대그래프" data-chart-kind="bar" data-chart-step="${step}" data-chart-scale-max="${scaleMax}" data-chart-tick-count="${tickCount}" data-chart-values="${values.join(",")}"${secondValues ? ` data-chart-second-values="${secondValues.join(",")}"` : ""} data-chart-unit="${unit}" data-chart-top="${top}" data-chart-plot-height="${plotHeight}"><text class="chart-unit" x="4" y="10">(${unit})</text>${grid}<line class="chart-axis" x1="${left}" y1="${top}" x2="${left}" y2="${top + plotHeight}"/><line class="chart-axis" x1="${left}" y1="${top + plotHeight}" x2="${width - right}" y2="${top + plotHeight}"/>${bars}${legendMarkup}</svg></div>`;
  };
  const lineChartSvg = ({ labels, series, step, unit, xAxis = "시간" }) => {
    if (!Number.isFinite(step) || step <= 0 || labels.length < 2 || labels.length > 7 || !series.length || series.length > 2) {
      throw new Error("꺾은선그래프 설정이 올바르지 않습니다.");
    }
    const allValues = series.flatMap(item => item.values);
    if (series.some(item => item.values.length !== labels.length) || allValues.some(value => !Number.isFinite(value) || value < 0 || !Number.isInteger(value / step))) {
      throw new Error("꺾은선그래프 값은 눈금 단위의 배수여야 합니다.");
    }
    const width = 250;
    const height = 196;
    const left = 38;
    const right = 12;
    const top = 14;
    const bottom = series.length > 1 ? 52 : 38;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const scaleMax = Math.max(step, Math.ceil(Math.max(...allValues) / step) * step);
    const tickCount = scaleMax / step + 1;
    if (tickCount > 10) throw new Error("꺾은선그래프 세로 눈금은 10개 이하여야 합니다.");
    const xFor = index => left + plotWidth * index / (labels.length - 1);
    const yFor = value => top + plotHeight - value / scaleMax * plotHeight;
    const horizontalGrid = Array.from({ length: tickCount }, (_, index) => {
      const value = index * step;
      const y = yFor(value);
      return `<line class="chart-grid" x1="${left}" y1="${y.toFixed(1)}" x2="${width - right}" y2="${y.toFixed(1)}"/><text class="chart-tick" x="${left - 5}" y="${(y + 3).toFixed(1)}">${value}</text>`;
    }).join("");
    const verticalGrid = labels.map((_, index) => {
      const x = xFor(index);
      return `<line class="chart-grid chart-grid-vertical" x1="${x.toFixed(1)}" y1="${top}" x2="${x.toFixed(1)}" y2="${top + plotHeight}"/>`;
    }).join("");
    const xLabels = labels.map((label, index) => `<text class="chart-label" x="${xFor(index).toFixed(1)}" y="${top + plotHeight + 17}">${label}</text>`).join("");
    const plottedSeries = series.map((item, seriesIndex) => {
      const points = item.values.map((value, index) => `${xFor(index).toFixed(1)},${yFor(value).toFixed(1)}`).join(" ");
      const markers = item.values.map((value, index) => `<circle class="chart-point chart-line-${seriesIndex}" data-chart-value="${value}" cx="${xFor(index).toFixed(1)}" cy="${yFor(value).toFixed(1)}" r="3"/>`).join("");
      return `<polyline class="chart-line chart-line-${seriesIndex}" points="${points}"/>${markers}`;
    }).join("");
    const legendMarkup = series.length > 1 ? `<g class="chart-legend chart-line-legend">${series.map((item, index) => {
      const x = left + index * 96;
      return `<line class="chart-line chart-line-${index}" x1="${x}" y1="${height - 13}" x2="${x + 16}" y2="${height - 13}"/><text x="${x + 22}" y="${height - 9}">${item.name}</text>`;
    }).join("")}</g>` : "";
    return `<div class="graph-figure"><p class="graph-scale-note">세로 눈금 한 칸은 ${step}${unit}입니다.</p><svg class="line-chart" viewBox="0 0 ${width} ${height}" aria-label="세로 눈금 한 칸이 ${step}${unit}인 꺾은선그래프" data-chart-kind="line" data-chart-step="${step}" data-chart-scale-max="${scaleMax}" data-chart-tick-count="${tickCount}" data-chart-values="${series.map(item => item.values.join(",")).join(";")}" data-chart-unit="${unit}" data-chart-top="${top}" data-chart-plot-height="${plotHeight}"><text class="chart-unit" x="4" y="10">(${unit})</text>${horizontalGrid}${verticalGrid}<line class="chart-axis" x1="${left}" y1="${top}" x2="${left}" y2="${top + plotHeight}"/><line class="chart-axis" x1="${left}" y1="${top + plotHeight}" x2="${width - right}" y2="${top + plotHeight}"/>${plottedSeries}${xLabels}<text class="chart-axis-name" x="${width - right}" y="${height - (series.length > 1 ? 30 : 8)}">${xAxis}</text>${legendMarkup}</svg></div>`;
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
  const decimalLineSvg = ({ start, step, count, hiddenIndex, places }) => {
    const left = 20;
    const right = 220;
    const y = 42;
    const xFor = index => left + (right - left) * index / (count - 1);
    const ticks = Array.from({ length: count }, (_, index) => {
      const x = xFor(index);
      const label = index === hiddenIndex ? "□" : fixedDecimal(start + step * index, places);
      return `<line x1="${x.toFixed(1)}" y1="${y - 7}" x2="${x.toFixed(1)}" y2="${y + 7}"/><text x="${x.toFixed(1)}" y="${y + 24}">${label}</text>`;
    }).join("");
    return `<svg class="geometry-diagram decimal-line" viewBox="0 0 240 88" aria-label="소수 수직선"><line x1="${left}" y1="${y}" x2="${right}" y2="${y}"/>${ticks}</svg>`;
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

  const staircaseSvg = (horizontals, verticals, hiddenIndex = -1) => {
    const startX = 20;
    const startY = 16;
    const hUnit = Math.min(28, 190 / horizontals.reduce((a, b) => a + b, 0));
    const vUnit = Math.min(22, 128 / verticals.reduce((a, b) => a + b, 0));
    let x = startX;
    let y = startY;
    const segments = [];
    const labels = [];
    for (let index = 0; index < verticals.length; index += 1) {
      const x2 = x + horizontals[index] * hUnit;
      segments.push(`<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y.toFixed(1)}"/>`);
      x = x2;
      const y2 = y + verticals[index] * vUnit;
      segments.push(`<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x.toFixed(1)}" y2="${y2.toFixed(1)}"/>`);
      const label = index === hiddenIndex ? "□" : `${verticals[index]}cm`;
      labels.push(`<text x="${(x + 16).toFixed(1)}" y="${((y + y2) / 2).toFixed(1)}">${label}</text>`);
      y = y2;
    }
    const topY = startY;
    const bottomY = y;
    return `<svg class="geometry-diagram staircase-diagram" viewBox="0 0 240 ${(bottomY + 16).toFixed(0)}" aria-label="계단 모양으로 이어진 수직 선분"><line class="original" x1="10" y1="${topY}" x2="${(x + 30).toFixed(1)}" y2="${topY}"/><line class="original" x1="10" y1="${bottomY}" x2="${(x + 30).toFixed(1)}" y2="${bottomY}"/>${segments.join("")}${labels.join("")}</svg>`;
  };

  const parallelTransversalSvg = (count, angle, hiddenAt = -1) => {
    const left = 24;
    const right = 216;
    const top = 20;
    const gap = 34;
    const bottomY = top + (count - 1) * gap;
    const lines = Array.from({ length: count }, (_, index) => {
      const y = top + index * gap;
      return `<line x1="${left}" y1="${y}" x2="${right}" y2="${y}"/>`;
    }).join("");
    const midX = 120;
    const spread = 46;
    const marks = Array.from({ length: count }, (_, index) => {
      const y = top + index * gap;
      const label = index === hiddenAt ? "?" : `${angle}°`;
      return `<text x="${(midX + 22).toFixed(1)}" y="${(y - 8).toFixed(1)}">${label}</text>`;
    }).join("");
    return `<svg class="geometry-diagram parallel-transversal" viewBox="0 0 240 ${(bottomY + 24).toFixed(0)}" aria-label="평행선을 가로지르는 직선"><g>${lines}<line x1="${(midX - spread).toFixed(1)}" y1="${top - 12}" x2="${(midX + spread).toFixed(1)}" y2="${(bottomY + 12).toFixed(1)}"/></g>${marks}</svg>`;
  };

  const triangleVertexSplitSvg = (a, b, c) => {
    const bx = 40;
    const by = 132;
    const cx = 200;
    const cy = 132;
    const rad = a * Math.PI / 180;
    const side = 108;
    const ax = bx + side * Math.cos(rad);
    const ay = by - side * Math.sin(rad);
    return `<svg class="geometry-diagram vertex-split" viewBox="0 0 240 160" aria-label="삼각형과 평행 보조선"><polygon points="${bx},${by} ${cx},${cy} ${ax.toFixed(1)},${ay.toFixed(1)}"/><line class="crease" x1="${bx}" y1="${by}" x2="${(cx + (ax - bx)).toFixed(1)}" y2="${(cy - (by - ay)).toFixed(1)}"/><text x="${bx + 22}" y="${by - 8}">${a}°</text><text x="${cx - 22}" y="${cy - 8}">${c}°</text><text x="${ax.toFixed(1)}" y="${(ay - 10).toFixed(1)}">A</text><text x="${bx - 12}" y="${by + 12}">B</text><text x="${cx + 12}" y="${cy + 12}">C</text></svg>`;
  };

  function buildZigzagChain(rng, bendCount, entryRange = [25, 75], turnRange = [20, 65]) {
    const entry = int(rng, entryRange[0], entryRange[1]);
    let dir = entry;
    const interiorAngles = [];
    const turns = [];
    for (let index = 0; index < bendCount; index += 1) {
      const sign = index % 2 === 0 ? -1 : 1;
      const magnitude = int(rng, turnRange[0], turnRange[1]);
      const turn = sign * magnitude;
      interiorAngles.push(180 - magnitude);
      turns.push(turn);
      dir += turn;
    }
    let exit = ((dir % 360) + 360) % 360;
    if (exit > 180) exit = 360 - exit;
    if (exit < 15) exit += 20;
    return { entry, interiorAngles, turns, exit };
  }

  const zigzagChainSvg = (entry, interiorAngles, exit, hidden) => {
    const left = 20;
    const right = 220;
    const top = 18;
    const bottom = 130;
    const count = interiorAngles.length;
    const xs = Array.from({ length: count + 2 }, (_, index) => left + (right - left) * index / (count + 1));
    const points = xs.map((x, index) => {
      const y = index === 0 ? top : index === xs.length - 1 ? bottom : top + (bottom - top) * (index % 2 === 1 ? 0.35 : 0.65);
      return [x, y];
    });
    const path = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const labels = [];
    labels.push(`<text x="${(points[0][0] + 14).toFixed(1)}" y="${(points[0][1] + 14).toFixed(1)}">${hidden === "entry" ? "?" : `${entry}°`}</text>`);
    interiorAngles.forEach((value, index) => {
      const [x, y] = points[index + 1];
      labels.push(`<text x="${x.toFixed(1)}" y="${(y - 8).toFixed(1)}">${hidden === index ? "?" : `${value}°`}</text>`);
    });
    const last = points[points.length - 1];
    labels.push(`<text x="${(last[0] - 14).toFixed(1)}" y="${(last[1] - 12).toFixed(1)}">${hidden === "exit" ? "?" : `${exit}°`}</text>`);
    return `<svg class="geometry-diagram zigzag-chain" viewBox="0 0 240 148" aria-label="평행선 사이의 꺾인 선"><line x1="10" y1="${top}" x2="230" y2="${top}"/><line x1="10" y1="${bottom}" x2="230" y2="${bottom}"/><polyline points="${path}"/>${labels.join("")}</svg>`;
  };

  const laserMirrorSvg = (theta, bounces) => {
    const left = 20;
    const right = 220;
    const top = 24;
    const bottom = 120;
    const xs = Array.from({ length: bounces + 2 }, (_, index) => left + (right - left) * index / (bounces + 1));
    const points = xs.map((x, index) => [x, index % 2 === 0 ? top : bottom]);
    const path = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const [mx, my] = points[1];
    return `<svg class="geometry-diagram laser-mirror" viewBox="0 0 240 144" aria-label="평행한 두 거울 사이의 레이저"><line x1="10" y1="${top}" x2="230" y2="${top}"/><line x1="10" y1="${bottom}" x2="230" y2="${bottom}"/><polyline points="${path}"/><text x="${(mx + 16).toFixed(1)}" y="${(my - 6).toFixed(1)}">${theta}°</text></svg>`;
  };

  const parallelogramSplitSvg = (angleA, angleADM, labelD = "D") => {
    const ax = 40;
    const ay = 128;
    const dx = 68;
    const dy = 30;
    const width = 132;
    return `<svg class="geometry-diagram parallelogram-split" viewBox="0 0 240 160" aria-label="평행사변형의 각 나누기"><polygon points="${ax},${ay} ${(ax + width).toFixed(1)},${ay} ${(ax + width - (ax - dx)).toFixed(1)},${dy} ${dx},${dy}"/><line x1="${dx}" y1="${dy}" x2="${(ax + 60).toFixed(1)}" y2="${ay}"/><text x="${ax + 20}" y="${ay - 10}">${angleA}°</text><text x="${dx + 26}" y="${dy + 20}">${angleADM}°</text><text x="${ax - 10}" y="${ay + 14}">A</text><text x="${dx - 10}" y="${dy - 6}">${labelD}</text></svg>`;
  };

  const rhombusDiagonalSvg = (p, q) => {
    const cx = 120;
    const cy = 82;
    const halfP = Math.min(90, p * 3.6);
    const halfQ = Math.min(58, q * 3.6);
    return `<svg class="geometry-diagram rhombus-diagonal" viewBox="0 0 240 164" aria-label="마름모의 대각선"><polygon points="${(cx - halfP).toFixed(1)},${cy} ${cx},${(cy - halfQ).toFixed(1)} ${(cx + halfP).toFixed(1)},${cy} ${cx},${(cy + halfQ).toFixed(1)}"/><line class="crease" x1="${(cx - halfP).toFixed(1)}" y1="${cy}" x2="${(cx + halfP).toFixed(1)}" y2="${cy}"/><line class="crease" x1="${cx}" y1="${(cy - halfQ).toFixed(1)}" x2="${cx}" y2="${(cy + halfQ).toFixed(1)}"/></svg>`;
  };

  const shapeChainCards = (shapes) => `<div class="triangle-angle-cards">${shapes.map(shape => `<div><b>${shape.label}</b><span>${shape.icon}</span><small>변 ${shape.sides}개</small></div>`).join("")}</div>`;

  const anglePointSvg = (labels) => angleWheelSvg(labels);

  const paperStackSvg = (side, count) => {
    const shown = Math.min(count, 8);
    const step = Math.min(20, 150 / shown);
    const size = 42;
    const rects = Array.from({ length: shown }, (_, index) => `<rect x="${(16 + index * step).toFixed(1)}" y="30" width="${size}" height="${size}"/>`).join("");
    const more = count > shown ? `<text x="${(16 + shown * step + 6).toFixed(1)}" y="56">…</text>` : "";
    return `<svg class="geometry-diagram paper-stack" viewBox="0 0 240 100" aria-label="겹쳐 붙인 정사각형 색종이"><g>${rects}</g>${more}<text x="18" y="88">한 변 ${side}cm</text></svg>`;
  };

  const nestedSquareSvg = (a, b, c) => {
    const scale = 90 / c;
    const aw = a * scale;
    const bw = b * scale;
    const cw = c * scale;
    const top = 14;
    const left = 20;
    return `<svg class="geometry-diagram nested-square" viewBox="0 0 240 160" aria-label="정사각형을 이어 붙인 도형"><rect x="${left}" y="${top}" width="${aw.toFixed(1)}" height="${aw.toFixed(1)}"/><rect x="${(left + aw).toFixed(1)}" y="${top}" width="${bw.toFixed(1)}" height="${bw.toFixed(1)}"/><rect x="${left}" y="${(top + Math.max(aw, bw)).toFixed(1)}" width="${cw.toFixed(1)}" height="${cw.toFixed(1)}"/><text x="${(left + aw / 2).toFixed(1)}" y="${(top + aw / 2).toFixed(1)}">가</text><text x="${(left + aw + bw / 2).toFixed(1)}" y="${(top + bw / 2).toFixed(1)}">나</text><text x="${(left + cw / 2).toFixed(1)}" y="${(top + Math.max(aw, bw) + cw / 2).toFixed(1)}">다</text></svg>`;
  };

  const gridRectSvg = (m, n, mark = null) => {
    const left = 22;
    const top = 16;
    const cell = Math.min(30, 196 / m, 128 / n);
    const width = m * cell;
    const height = n * cell;
    const verticalLines = Array.from({ length: m + 1 }, (_, index) => `<line x1="${(left + index * cell).toFixed(1)}" y1="${top}" x2="${(left + index * cell).toFixed(1)}" y2="${(top + height).toFixed(1)}"/>`).join("");
    const horizontalLines = Array.from({ length: n + 1 }, (_, index) => `<line x1="${left}" y1="${(top + index * cell).toFixed(1)}" x2="${(left + width).toFixed(1)}" y2="${(top + index * cell).toFixed(1)}"/>`).join("");
    const marker = mark ? `<rect class="folded" x="${(left + (mark[0] - 1) * cell).toFixed(1)}" y="${(top + (mark[1] - 1) * cell).toFixed(1)}" width="${cell.toFixed(1)}" height="${cell.toFixed(1)}"/>` : "";
    return `<svg class="geometry-diagram grid-rect" viewBox="0 0 240 ${(top + height + 14).toFixed(0)}" aria-label="${m} 곱하기 ${n} 격자"><g>${verticalLines}${horizontalLines}</g>${marker}</svg>`;
  };

  const measureSvg = ({ kind, values, expected, aria, body, extra = "", viewBox = "0 0 280 190" }) => `<svg class="geometry-diagram area-diagram" viewBox="${viewBox}" data-measure-kind="${kind}" data-measure-values="${values.join(",")}" data-measure-expected="${expected}" ${extra} aria-label="${aria}">${body}</svg>`;

  const rectilinearPerimeterSvg = ({ width, height, topDepth, bottomDepth, expected }) => {
    const left = 42;
    const top = 24;
    const drawWidth = 194;
    const drawHeight = 122;
    const topLeft = left + drawWidth * 0.25;
    const topRight = left + drawWidth * 0.58;
    const bottomLeft = left + drawWidth * 0.42;
    const bottomRight = left + drawWidth * 0.72;
    const topY = top + Math.min(42, drawHeight * topDepth / height);
    const bottomY = top + drawHeight - Math.min(38, drawHeight * bottomDepth / height);
    const points = [
      [left, top], [topLeft, top], [topLeft, topY], [topRight, topY], [topRight, top], [left + drawWidth, top],
      [left + drawWidth, top + drawHeight], [bottomRight, top + drawHeight], [bottomRight, bottomY], [bottomLeft, bottomY],
      [bottomLeft, top + drawHeight], [left, top + drawHeight]
    ].map(point => point.join(",")).join(" ");
    const body = `<polygon class="shape-fill" points="${points}"/><line class="dimension" x1="${left}" y1="${top + drawHeight + 20}" x2="${left + drawWidth}" y2="${top + drawHeight + 20}"/><text x="${left + drawWidth / 2}" y="${top + drawHeight + 32}">${width}cm</text><line class="dimension" x1="${left - 18}" y1="${top}" x2="${left - 18}" y2="${top + drawHeight}"/><text x="${left - 24}" y="${top + drawHeight / 2}" transform="rotate(-90 ${left - 24} ${top + drawHeight / 2})">${height}cm</text><text x="${(topLeft + topRight) / 2}" y="${topY - 10}">깊이 ${topDepth}cm</text>${bottomDepth ? `<text x="${(bottomLeft + bottomRight) / 2}" y="${bottomY + 12}">깊이 ${bottomDepth}cm</text>` : ""}`;
    return measureSvg({ kind: "rectilinear-perimeter", values: [width, height, topDepth, bottomDepth], expected, aria: "위아래에 홈이 있는 직각 다각형", body });
  };

  const cutStripSvg = ({ widths, height, expected }) => {
    const total = widths.reduce((sum, value) => sum + value, 0);
    const left = 20;
    const top = 30;
    const drawWidth = 240;
    const drawHeight = 70;
    let cursor = left;
    const labels = ["가", "나", "다", "라", "마", "바"];
    const pieces = widths.map((value, index) => {
      const pieceWidth = drawWidth * value / total;
      const output = `<rect class="shape-fill" x="${cursor.toFixed(1)}" y="${top}" width="${pieceWidth.toFixed(1)}" height="${drawHeight}"/><text x="${(cursor + pieceWidth / 2).toFixed(1)}" y="${top + drawHeight / 2}">${labels[index]}</text>`;
      cursor += pieceWidth;
      return output;
    }).join("");
    const body = `${pieces}<line class="dimension" x1="${left}" y1="${top + drawHeight + 20}" x2="${left + drawWidth}" y2="${top + drawHeight + 20}"/><text x="${left + drawWidth / 2}" y="${top + drawHeight + 34}">자르기 전 직사각형</text>`;
    return measureSvg({ kind: "cut-strip-perimeter", values: [total, height, ...widths], expected, aria: "여러 직사각형으로 자른 긴 직사각형", body, viewBox: "0 0 280 155" });
  };

  const sequencePerimeter = order => 2 * order.reduce((sum, value) => sum + value, 0) + order[0] + order[order.length - 1] + order.slice(1).reduce((sum, value, index) => sum + Math.abs(value - order[index]), 0);

  const maximumSquareSequencePerimeter = count => {
    const values = Array.from({ length: count }, (_, index) => index + 1);
    let maximum = 0;
    const visit = (chosen, remaining) => {
      if (!remaining.length) {
        maximum = Math.max(maximum, sequencePerimeter(chosen));
        return;
      }
      remaining.forEach((value, index) => visit([...chosen, value], [...remaining.slice(0, index), ...remaining.slice(index + 1)]));
    };
    visit([], values);
    return maximum;
  };

  const squareSequenceSvg = ({ count, expected }) => {
    const order = Array.from({ length: count }, (_, index) => index % 2 ? count - Math.floor(index / 2) : 1 + Math.floor(index / 2));
    const scale = 13;
    const total = count * (count + 1) / 2;
    const drawScale = Math.min(scale, 232 / total);
    let cursor = 24;
    const baseline = 145;
    const squares = order.map(side => {
      const size = side * drawScale;
      const output = `<rect class="shape-fill" x="${cursor.toFixed(1)}" y="${(baseline - size).toFixed(1)}" width="${size.toFixed(1)}" height="${size.toFixed(1)}"/><text x="${(cursor + size / 2).toFixed(1)}" y="${(baseline - size / 2).toFixed(1)}">${side}</text>`;
      cursor += size;
      return output;
    }).join("");
    return measureSvg({ kind: "square-sequence-max", values: [count], expected, aria: `한 변이 1cm부터 ${count}cm인 정사각형을 이어 붙인 예`, body: `${squares}<text x="140" y="170">붙이는 방법의 예</text>` });
  };

  const partitionAreaSvg = ({ x1, x2, y1, y2, expected }) => {
    const left = 44;
    const top = 24;
    const width = 190;
    const height = 132;
    const splitX = left + width * x1 / (x1 + x2);
    const splitY = top + height * y1 / (y1 + y2);
    const areas = [x1 * y1, x2 * y1, "□", x2 * y2];
    const positions = [[(left + splitX) / 2, (top + splitY) / 2], [(splitX + left + width) / 2, (top + splitY) / 2], [(left + splitX) / 2, (splitY + top + height) / 2], [(splitX + left + width) / 2, (splitY + top + height) / 2]];
    const body = `<rect class="shape-fill" x="${left}" y="${top}" width="${width}" height="${height}"/><line x1="${splitX.toFixed(1)}" y1="${top}" x2="${splitX.toFixed(1)}" y2="${top + height}"/><line x1="${left}" y1="${splitY.toFixed(1)}" x2="${left + width}" y2="${splitY.toFixed(1)}"/>${areas.map((area, index) => `<text x="${positions[index][0].toFixed(1)}" y="${positions[index][1].toFixed(1)}">${area}${area === "□" ? "" : "cm²"}</text>`).join("")}`;
    return measureSvg({ kind: "partition-area", values: [x1, x2, y1, y2], expected, aria: "네 부분으로 나눈 직사각형과 각 부분의 넓이", body });
  };

  const scaledAreaSvg = ({ originalArea, numerator, denominator, expected }) => {
    const body = `<rect class="shape-fill" x="20" y="55" width="82" height="64"/><text x="61" y="87">${originalArea}cm²</text><path class="folded" d="M116 87 H164"/><path class="folded" d="M154 78 L164 87 L154 96"/><polygon class="highlight-fill" points="178,126 256,126 240,48 162,48"/><text x="209" y="84">각 변</text><text x="209" y="101">${numerator}/${denominator}배</text>`;
    return measureSvg({ kind: "scaled-area", values: [originalArea, numerator, denominator], expected, aria: "직사각형의 각 변을 같은 비율로 늘여 만든 평행사변형", body });
  };

  const cutoutAreaSvg = ({ width, height, firstWidth, firstHeight, secondWidth, secondHeight, expected }) => {
    const left = 48;
    const top = 24;
    const drawWidth = 184;
    const drawHeight = 128;
    const firstW = drawWidth * firstWidth / width;
    const firstH = drawHeight * firstHeight / height;
    const secondW = drawWidth * secondWidth / width;
    const secondH = drawHeight * secondHeight / height;
    const body = `<rect class="highlight-fill" x="${left}" y="${top}" width="${drawWidth}" height="${drawHeight}"/><rect class="cutout-fill" x="${(left + drawWidth - firstW).toFixed(1)}" y="${top}" width="${firstW.toFixed(1)}" height="${firstH.toFixed(1)}"/><rect class="cutout-fill" x="${left}" y="${(top + drawHeight - secondH).toFixed(1)}" width="${secondW.toFixed(1)}" height="${secondH.toFixed(1)}"/><text x="${left + drawWidth / 2}" y="${top + drawHeight + 24}">전체 가로 ${width}cm</text><text x="${left - 18}" y="${top + drawHeight / 2}" transform="rotate(-90 ${left - 18} ${top + drawHeight / 2})">전체 세로 ${height}cm</text><text x="${left + drawWidth - firstW / 2}" y="${top + firstH / 2}">${firstWidth}×${firstHeight}</text><text x="${left + secondW / 2}" y="${top + drawHeight - secondH / 2}">${secondWidth}×${secondHeight}</text>`;
    return measureSvg({ kind: "cutout-area", values: [width, height, firstWidth, firstHeight, secondWidth, secondHeight], expected, aria: "직사각형의 두 모서리를 잘라 낸 도형", body });
  };

  const polyominoBoundary = cells => {
    const set = new Set(cells.map(([x, y]) => `${x},${y}`));
    return cells.reduce((total, [x, y]) => total + [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => !set.has(`${x + dx},${y + dy}`)).length, 0);
  };

  const polyominoCellText = cells => cells.map(([x, y]) => `${x}:${y}`).join(";");

  const polyominoSvg = ({ cells, side, expected, kind, lead = "" }) => {
    const minX = Math.min(...cells.map(cell => cell[0]));
    const maxX = Math.max(...cells.map(cell => cell[0]));
    const minY = Math.min(...cells.map(cell => cell[1]));
    const maxY = Math.max(...cells.map(cell => cell[1]));
    const cellSize = Math.min(34, 190 / (maxX - minX + 1), 128 / (maxY - minY + 1));
    const left = (280 - (maxX - minX + 1) * cellSize) / 2;
    const top = 18;
    const body = cells.map(([x, y]) => `<rect class="shape-fill" x="${(left + (x - minX) * cellSize).toFixed(1)}" y="${(top + (y - minY) * cellSize).toFixed(1)}" width="${cellSize.toFixed(1)}" height="${cellSize.toFixed(1)}"/>`).join("") + `<text x="140" y="172">${lead || `한 정사각형의 한 변 ${side}cm`}</text>`;
    return measureSvg({ kind, values: [side, cells.length], expected, aria: "같은 정사각형으로 만든 도형", body, extra: `data-measure-cells="${polyominoCellText(cells)}"` });
  };

  const polyominoPairSvg = ({ cellsA, cellsB, side, expected, areaA }) => {
    const draw = (cells, originX, label) => {
      const minX = Math.min(...cells.map(cell => cell[0]));
      const minY = Math.min(...cells.map(cell => cell[1]));
      const cellSize = 22;
      return cells.map(([x, y]) => `<rect class="shape-fill" x="${originX + (x - minX) * cellSize}" y="${36 + (y - minY) * cellSize}" width="${cellSize}" height="${cellSize}"/>`).join("") + `<text x="${originX + 48}" y="20">도형 ${label}</text>`;
    };
    const body = `${draw(cellsA, 18, "가")}${draw(cellsB, 154, "나")}<text x="70" y="174">넓이 ${areaA}cm²</text><text x="210" y="174">둘레는?</text>`;
    return measureSvg({ kind: "poly-pair", values: [side, cellsA.length, cellsB.length], expected, aria: "같은 정사각형으로 만든 두 도형", body, extra: `data-measure-cells-a="${polyominoCellText(cellsA)}" data-measure-cells-b="${polyominoCellText(cellsB)}"` });
  };

  const equalQuadrilateralAreaSvg = ({ base, height, trapezoidTop, trapezoidBottom, expected }) => {
    const body = `<polygon class="shape-fill" points="18,116 92,116 78,54 4,54"/><line class="crease" x1="4" y1="54" x2="4" y2="116"/><text x="48" y="132">밑변 ${base}cm</text><text x="13" y="84">${height}cm</text><polygon class="shape-fill" points="112,116 190,116 176,54 124,54"/><text x="150" y="132">${trapezoidBottom}cm</text><text x="150" y="45">${trapezoidTop}cm</text><polygon class="highlight-fill" points="234,34 270,84 234,134 198,84"/><line class="crease" x1="198" y1="84" x2="270" y2="84"/><line class="crease" x1="234" y1="34" x2="234" y2="134"/><text x="234" y="22">${2 * height}cm</text><text x="251" y="91">□</text>`;
    return measureSvg({ kind: "equal-quadrilaterals", values: [base, height, trapezoidTop, trapezoidBottom], expected, aria: "넓이가 같은 평행사변형, 사다리꼴, 마름모", body });
  };

  const maximumRectangleSvg = ({ halfPerimeter, expected }) => {
    const body = `<rect class="shape-fill" x="48" y="38" width="184" height="108"/><text x="140" y="164">가로 + 세로 = ${halfPerimeter}cm</text><text x="140" y="92">넓이가 가장 클 때?</text>`;
    return measureSvg({ kind: "maximum-rectangle", values: [halfPerimeter], expected, aria: "둘레가 정해진 직사각형", body });
  };

  const movingPointSvg = ({ base, height, numerator, denominator, speed, expected }) => {
    const left = 42;
    const bottom = 145;
    const width = 196;
    const top = 38;
    const pointX = left + width * 2 * numerator / denominator;
    const body = `<polygon class="shape-fill" points="${left},${bottom} ${left + width},${bottom} ${left + width - 24},${top} ${left - 24},${top}"/><polygon class="highlight-fill" points="${left},${bottom} ${pointX.toFixed(1)},${bottom} ${left - 24},${top}"/><text x="${left - 8}" y="${bottom + 16}">D</text><text x="${left + width + 8}" y="${bottom + 16}">C</text><text x="${pointX.toFixed(1)}" y="${bottom + 16}">P</text><text x="${left + width / 2}" y="${bottom + 32}">${base}cm</text><text x="${left + width / 2}" y="22">P는 D에서 C로 초당 ${speed}cm 이동</text>`;
    return measureSvg({ kind: "moving-point-area", values: [base, height, numerator, denominator, speed], expected, aria: "평행사변형의 밑변을 따라 움직이는 점과 색칠한 삼각형", body });
  };

  const polyominoCases = [
    {
      a: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]],
      b: [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]]
    },
    {
      a: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]],
      b: [[0, 0], [0, 1], [1, 1], [2, 1], [2, 2], [2, 3]]
    },
    {
      a: [[1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [3, 1], [0, 2], [3, 2]],
      b: [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [1, 2], [2, 2], [3, 2]]
    }
  ];

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
        const values = labels.map(() => int(rng, 3 + level, 9) * step);
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
        const second = 16 * int(rng, 1, 2);
        const third = second * 3 / 4;
        const difference = 4 * int(rng, 1, 1 + Math.min(level, 1));
        const fourth = third + difference;
        const values = [4 * int(rng, 4, 7), second, third, fourth, 4 * int(rng, 4, 7), 4 * int(rng, 4, 7)];
        return result(`학년별로 동생이 있는 학생 수를 조사했습니다. 3학년은 2학년의 3/4이고, 4학년은 3학년보다 ${difference}명 더 많습니다. 그래프를 보고 4학년 학생 수를 구하세요.${barChartSvg({ labels, values, step: 4, hidden: [2, 3] })}`, fourth, `2학년은 그래프에서 ${second}명입니다. 3학년은 ${second} × 3/4 = ${third}명이고, 4학년은 ${third} + ${difference} = ${fourth}명입니다.`);
      }
      const labels = ["1", "2", "3", "4", "5", "6"];
      const step = 2;
      const second = 2 * int(rng, 4 + level, 5 + level);
      const difference = 2 * int(rng, 1, 2);
      const third = second + difference;
      const values = [2 * int(rng, 4, 8), second, third, 2 * int(rng, 4, 9), 2 * int(rng, 4, 9), 2 * int(rng, 4, 9)];
      const total = values.reduce((sum, value) => sum + value, 0);
      return result(`주사위를 여러 번 던져 나온 눈의 횟수를 나타낸 그래프입니다. 2의 눈과 3의 눈 막대가 지워졌고, 3의 눈은 2의 눈보다 ${difference}번 더 나왔습니다. 전체 횟수가 ${total}번일 때 3의 눈이 나온 횟수를 구하세요.${barChartSvg({ labels, values, step, hidden: [1, 2], unit: "번" })}`, third, `보이는 네 막대의 합은 ${total - second - third}번이므로 두 빠진 막대의 합은 ${second + third}번입니다. 차가 ${difference}번이므로 2의 눈은 (${second + third} - ${difference}) ÷ 2 = ${second}번, 3의 눈은 ${third}번입니다.`);
    },
    barGraphApplication({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const labels = ["가람", "나래", "다온", "라온", "마루"];
        const speed = pick(rng, [50, 100]);
        const step = pick(rng, [100, 200]);
        const farthest = step * int(rng, 6 + Math.min(level, 1), 9);
        const targetIndex = int(rng, 0, labels.length - 1);
        const values = labels.map((_, index) => index === targetIndex ? farthest : step * int(rng, 3, farthest / step - 1));
        const answer = farthest * 2 / speed;
        return result(`학교에서 집까지의 거리를 조사한 막대그래프입니다. 가장 먼 곳에 사는 학생이 1분에 ${speed}m씩 일정하게 걸어 학교와 집을 왕복할 때 걸리는 시간을 구하세요.${barChartSvg({ labels, values, step, unit: "m" })}`, answer, `가장 먼 거리는 ${farthest}m입니다. 왕복 거리는 ${farthest} × 2 = ${farthest * 2}m이므로 걸리는 시간은 ${farthest * 2} ÷ ${speed} = ${answer}분입니다.`);
      }
      if (variant % 3 === 1) {
        const labels = ["가반", "나반", "다반", "라반"];
        const step = 2;
        const boys = labels.map(() => step * int(rng, 3 + level, 7 + level));
        const girls = labels.map(() => step * int(rng, 3 + level, 7 + level));
        const totals = boys.map((value, index) => value + girls[index]);
        const answer = Math.max(...totals) - Math.min(...totals);
        return result(`반별 남학생과 여학생 수를 나타낸 막대그래프입니다. 전체 학생 수가 가장 많은 반과 가장 적은 반의 학생 수 차를 구하세요.${barChartSvg({ labels, values: boys, secondValues: girls, step, legend: ["남학생", "여학생"] })}`, answer, `각 반의 전체 학생 수는 차례로 ${totals.join(", ")}명입니다. 가장 큰 수 ${Math.max(...totals)}에서 가장 작은 수 ${Math.min(...totals)}을 빼면 ${answer}명입니다.`);
      }
      const labels = ["단팥", "크림", "소보로", "카스텔라"];
      const counts = labels.map(() => 5 * int(rng, 4 + level, 9));
      const prices = [1200 + level * 100, 1500 + level * 100, 1100 + level * 100, 2000 + level * 200];
      const answer = counts.reduce((sum, count, index) => sum + count * prices[index], 0);
      const priceText = labels.map((label, index) => `${label}빵 ${prices[index].toLocaleString()}원`).join(", ");
      return result(`오늘 판매한 빵의 수를 나타낸 막대그래프입니다. 한 개의 가격이 ${priceText}일 때 전체 판매 금액을 구하세요.${barChartSvg({ labels, values: counts, step: 5, unit: "개" })}`, answer, `${counts.map((count, index) => `${count} × ${prices[index].toLocaleString()}`).join(" + ")} = ${answer.toLocaleString()}원이므로 전체 판매 금액은 ${answer.toLocaleString()}원입니다.`);
    },
    lineGraphUnderstanding({ rng, level, variant = 0 }) {
      const labels = ["월", "화", "수", "목", "금"];
      const step = 5;
      const values = [
        int(rng, 3 + level, 4 + level),
        int(rng, 5 + level, 6 + level),
        int(rng, 4 + level, 5 + level),
        int(rng, 6 + level, 7 + level),
        int(rng, 5 + level, 7)
      ].map(value => value * step);
      const chart = lineChartSvg({ labels, series: [{ name: "배출량", values }], step, unit: "kg", xAxis: "요일" });
      if (variant % 3 === 0) {
        const answer = values[3] - values[2];
        return result(`한 반의 요일별 재활용품 배출량을 조사하여 꺾은선그래프로 나타냈습니다. 목요일의 배출량은 수요일보다 몇 kg 더 많습니까?${chart}`, answer, `수요일은 ${values[2]}kg, 목요일은 ${values[3]}kg이므로 ${values[3]} - ${values[2]} = ${answer}kg입니다.`);
      }
      if (variant % 3 === 1) {
        const answer = values.slice(1, 4).reduce((sum, value) => sum + value, 0);
        return result(`한 반의 요일별 재활용품 배출량을 조사하여 꺾은선그래프로 나타냈습니다. 화요일부터 목요일까지 배출량의 합은 몇 kg입니까?${chart}`, answer, `화요일부터 목요일까지의 배출량은 ${values[1]}kg, ${values[2]}kg, ${values[3]}kg입니다. 합은 ${values[1]} + ${values[2]} + ${values[3]} = ${answer}kg입니다.`);
      }
      const answer = Math.max(...values) - Math.min(...values);
      return result(`한 반의 요일별 재활용품 배출량을 조사하여 꺾은선그래프로 나타냈습니다. 배출량이 가장 많은 날과 가장 적은 날의 배출량 차는 몇 kg입니까?${chart}`, answer, `그래프에서 가장 많은 배출량은 ${Math.max(...values)}kg, 가장 적은 배출량은 ${Math.min(...values)}kg입니다. 따라서 차는 ${Math.max(...values)} - ${Math.min(...values)} = ${answer}kg입니다.`);
    },
    lineGraphApplication({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const labels = ["0", "1", "2", "3", "4"];
        const step = 100;
        const fastRate = 200;
        const slowRate = 100;
        const halfHours = pick(rng, [5, 7]);
        const elapsedText = halfHours === 5 ? "2시간 30분" : "3시간 30분";
        const fastFuel = fastRate * halfHours / 2 / 20;
        const slowFuel = slowRate * halfHours / 2 / 25;
        const answer = fastFuel - slowFuel;
        const series = [
          { name: "가 자동차", values: labels.map((_, index) => fastRate * index) },
          { name: "나 자동차", values: labels.map((_, index) => slowRate * index) }
        ];
        return result(`가 자동차와 나 자동차가 일정한 빠르기로 달린 거리를 나타낸 꺾은선그래프입니다. 가 자동차는 1L로 20km, 나 자동차는 1L로 25km를 달릴 수 있습니다. 출발한 지 ${elapsedText} 후 두 자동차가 사용한 휘발유 양의 차는 몇 L입니까?${lineChartSvg({ labels, series, step, unit: "km", xAxis: "시간(시)" })}`, answer, `그래프에서 가 자동차는 1시간에 ${fastRate}km, 나 자동차는 1시간에 ${slowRate}km를 달립니다. ${elapsedText} 동안 가 자동차는 ${fastRate * halfHours / 2}km를 달려 ${fastFuel}L, 나 자동차는 ${slowRate * halfHours / 2}km를 달려 ${slowFuel}L를 사용합니다. 차는 ${fastFuel} - ${slowFuel} = ${answer}L입니다.`);
      }
      if (variant % 3 === 1) {
        const labels = ["0", "5", "10", "15"];
        const step = 40;
        const profile = pick(rng, [
          { start: 320, bothDrain: 120, bDrain: 40 },
          { start: 360, bothDrain: 160, bDrain: 40 }
        ]);
        const { start, bothDrain, bDrain } = profile;
        const values = [start, start - bothDrain, start - bothDrain * 2, start - bothDrain * 2 - bDrain];
        const aDrain = bothDrain - bDrain;
        const firstOnlyMinutes = start / aDrain * 5;
        return result(`물탱크에 물이 들어 있고 가, 나 두 수도꼭지를 함께 틀었습니다. 10분 뒤 가 수도꼭지를 잠그고 나 수도꼭지만 사용했을 때의 물의 양을 나타낸 꺾은선그래프입니다. 처음부터 가 수도꼭지만 사용했다면 물탱크의 물을 모두 사용하는 데 몇 분 걸립니까?${lineChartSvg({ labels, series: [{ name: "남은 물", values }], step, unit: "L", xAxis: "시간(분)" })}`, firstOnlyMinutes, `처음 5분 동안 물은 ${start}L에서 ${values[1]}L로 ${bothDrain}L 줄었습니다. 10분 뒤부터 5분 동안 나 수도꼭지만 사용하여 ${bDrain}L 줄었으므로, 가 수도꼭지는 5분에 ${aDrain}L를 사용합니다. 처음 물 ${start}L를 가 수도꼭지만 사용하면 ${start} ÷ ${aDrain} × 5 = ${firstOnlyMinutes}분 걸립니다.`);
      }
      const labels = ["3월", "5월", "7월", "9월", "11월"];
      const step = 50;
      const iceCream = [5 + level, 6 + level, 7 + level, 7 + level, 6 + level].map(value => value * step);
      const chocolate = [6, 5 + level, 6 + level, 4 + level, 5 + level].map(value => value * step);
      const answer = iceCream[3] * 700 - chocolate[3] * 600;
      const series = [{ name: "아이스크림", values: iceCream }, { name: "초콜릿", values: chocolate }];
      return result(`한 가게의 아이스크림과 초콜릿 판매량을 나타낸 꺾은선그래프입니다. 아이스크림은 한 개에 700원, 초콜릿은 한 개에 600원입니다. 9월의 아이스크림 판매 금액은 초콜릿 판매 금액보다 몇 원 더 많습니까?${lineChartSvg({ labels, series, step, unit: "개", xAxis: "월" })}`, answer, `9월 아이스크림은 ${iceCream[3]}개, 초콜릿은 ${chocolate[3]}개입니다. 판매 금액의 차는 ${iceCream[3]} × 700 - ${chocolate[3]} × 600 = ${answer.toLocaleString()}원입니다.`);
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
    decimalUnderstanding({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const places = level === 2 ? 3 : 2;
        const scale = 10 ** places;
        const start = int(rng, scale / 10, scale / 2);
        const step = int(rng, 2, 5 + level);
        const count = 7;
        const hiddenIndex = int(rng, 1, count - 2);
        const answer = fixedDecimal(start + step * hiddenIndex, places);
        return result(`아래 수직선에서 □ 안에 알맞은 소수를 구하세요.${decimalLineSvg({ start, step, count, hiddenIndex, places })}`, answer, `눈금 한 칸의 크기는 ${fixedDecimal(step, places)}입니다. 시작 수 ${fixedDecimal(start, places)}에서 ${hiddenIndex}칸 이동하면 ${fixedDecimal(start, places)} + ${fixedDecimal(step * hiddenIndex, places)} = ${answer}입니다.`);
      }
      if (variant % 3 === 1) {
        const kg = int(rng, 3, 8 + level);
        const grams = int(rng, 12, 96) * 10;
        const answer = fixedDecimal(kg * 1000 + grams, 3);
        return result(`${kg}kg ${grams}g을 kg 단위의 소수로 나타내세요.`, answer, `1kg은 1000g이므로 ${grams}g은 ${fixedDecimal(grams, 3)}kg입니다. 따라서 ${kg}kg ${grams}g = ${answer}kg입니다.`);
      }
      const values = Array.from({ length: 5 + level }, () => int(rng, 120, 980));
      const target = pick(rng, values);
      const answer = Math.round(target / 10) * 10;
      return result(`다음 소수 중 ${fixedDecimal(target, 2)}에 가장 가까운 일의 자리 수를 구하세요.<div class="sequence">${values.map(value => fixedDecimal(value, 2)).join(", ")}</div>`, answer, `${fixedDecimal(target, 2)}은 일의 자리에서 반올림할 때 소수 첫째 자리 ${Math.floor(target / 10) % 10}을 보고 ${answer}이 됩니다.`);
    },
    decimalAddSubAdvanced({ rng, level, variant = 0 }) {
      const places = level === 2 ? 3 : 2;
      const scale = 10 ** places;
      if (variant % 3 === 0) {
        const first = int(rng, 120, 540 + level * 220);
        const hidden = int(rng, 80, 360 + level * 180);
        const total = first + hidden;
        return result(`□ 안에 알맞은 소수를 구하세요.<div class="equation">${fixedDecimal(first, places)} + □ = ${fixedDecimal(total, places)}</div>`, fixedDecimal(hidden, places), `전체에서 알려진 수를 빼면 □ = ${fixedDecimal(total, places)} - ${fixedDecimal(first, places)} = ${fixedDecimal(hidden, places)}입니다.`);
      }
      if (variant % 3 === 1) {
        const count = int(rng, 8 + level, 12 + level * 3);
        const first = int(rng, 80, 250);
        const difference = int(rng, 11, 37 + level * 8);
        const last = first + difference * (count - 1);
        const total = count * (first + last) / 2;
        return result(`다음 규칙으로 나열한 ${count}개의 소수의 합을 구하세요.<div class="sequence">${fixedDecimal(first, places)}, ${fixedDecimal(first + difference, places)}, ${fixedDecimal(first + difference * 2, places)}, …, ${fixedDecimal(last, places)}</div>`, fixedDecimal(total, places), `첫째 수와 마지막 수의 합은 ${fixedDecimal(first + last, places)}이고, 이를 짝지으면 ${count}개 전체의 합은 ${count} × ${fixedDecimal(first + last, places)} ÷ 2 = ${fixedDecimal(total, places)}입니다.`);
      }
      const a = int(rng, 350, 780 + level * 260);
      const b = int(rng, 90, 260 + level * 110);
      const c = int(rng, 40, 180 + level * 80);
      const answer = a - b + c;
      return result(`소수점을 맞추어 계산하세요.<div class="equation">${fixedDecimal(a, places)} - ${fixedDecimal(b, places)} + ${fixedDecimal(c, places)} = □</div>`, fixedDecimal(answer, places), `${fixedDecimal(a, places)} - ${fixedDecimal(b, places)} = ${fixedDecimal(a - b, places)}이고, 여기에 ${fixedDecimal(c, places)}을 더하면 ${fixedDecimal(answer, places)}입니다.`);
    },
    decimalApplication({ rng, level, variant = 0 }) {
      const scale = 100;
      if (variant % 3 === 0) {
        const weights = [int(rng, 420, 790), int(rng, 480, 860), int(rng, 510, 920)];
        const [a, b, c] = weights;
        const answer = Math.max(...weights) - Math.min(...weights);
        return result(`세 상자 A, B, C의 무게가 있습니다. A와 B의 합은 ${fixedDecimal(a + b, 2)}kg, B와 C의 합은 ${fixedDecimal(b + c, 2)}kg, C와 A의 합은 ${fixedDecimal(c + a, 2)}kg입니다. 가장 무거운 상자와 가장 가벼운 상자의 무게 차를 구하세요.`, fixedDecimal(answer, 2), `A = (${fixedDecimal(a + b, 2)} + ${fixedDecimal(c + a, 2)} - ${fixedDecimal(b + c, 2)}) ÷ 2 = ${fixedDecimal(a, 2)}kg처럼 각각의 무게를 구할 수 있습니다. 세 무게의 최댓값과 최솟값의 차는 ${fixedDecimal(answer, 2)}kg입니다.`);
      }
      if (variant % 3 === 1) {
        const base = int(rng, 540, 920);
        const thickness = int(rng, 18, 37);
        const count = int(rng, 16 + level * 3, 28 + level * 5);
        const answer = base + thickness * count;
        return result(`높이가 ${fixedDecimal(base, 2)}cm인 책상 위에 두께가 ${fixedDecimal(thickness, 2)}cm인 책 ${count}권을 포개어 놓았습니다. 바닥에서 가장 위 책의 윗면까지의 높이를 구하세요.`, fixedDecimal(answer, 2), `책 ${count}권의 높이는 ${fixedDecimal(thickness, 2)} × ${count} = ${fixedDecimal(thickness * count, 2)}cm입니다. 책상 높이를 더하면 ${fixedDecimal(base, 2)} + ${fixedDecimal(thickness * count, 2)} = ${fixedDecimal(answer, 2)}cm입니다.`);
      }
      const ahead = int(rng, 140, 430 + level * 100);
      const behind = int(rng, 90, 350 + level * 100);
      const answer = ahead + behind;
      return result(`직선 도로에서 지수는 현우보다 ${fixedDecimal(ahead, 2)}km 앞에 있고, 상민이는 현우보다 ${fixedDecimal(behind, 2)}km 뒤에 있습니다. 지수와 상민이 사이의 거리를 구하세요.`, fixedDecimal(answer, 2), `현우를 기준으로 한 사람은 앞, 한 사람은 뒤에 있으므로 두 거리를 더합니다. ${fixedDecimal(ahead, 2)} + ${fixedDecimal(behind, 2)} = ${fixedDecimal(answer, 2)}km입니다.`);
    },
    conditionedDecimal({ rng, level, variant = 0 }) {
      if (variant % 2 === 0) {
        let pool = [];
        let candidates = [];
        for (let attempt = 0; attempt < 80; attempt += 1) {
          pool = shuffle(rng, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
          candidates = permutationNumbers(pool).map(value => String(value).split("").map(Number)).filter(digits => digits.length === pool.length).filter(digits => digits[0] + digits[1] === digits[2] + digits[3]);
          if (candidates.length >= 2 && candidates.length <= 8) break;
        }
        const answer = candidates.length;
        return result(`수 카드 ${pool.map(value => `<span class="digit-card">${value}</span>`).join("")}를 한 번씩 모두 사용하여 A.BCD 꼴의 소수를 만듭니다. 일의 자리와 소수 첫째 자리의 합이 소수 둘째 자리와 소수 셋째 자리의 합과 같은 수는 모두 몇 개인지 구하세요.`, answer, `카드의 순서를 정한 뒤 ‘일의 자리 + 소수 첫째 자리 = 소수 둘째 자리 + 소수 셋째 자리’ 조건을 만족하는 경우를 세면 ${answer}개입니다.`);
      }
      let lower = 0;
      let upper = 0;
      let candidates = [];
      for (let attempt = 0; attempt < 80; attempt += 1) {
        lower = int(rng, 210, 320 + level * 70);
        upper = lower + int(rng, 95, 160 + level * 60);
        candidates = [];
        for (let value = lower + 1; value < upper; value += 1) {
          const digits = String(value).padStart(3, "0").split("").map(Number);
          if (new Set(digits).size === 3 && digits[1] + digits[2] === digits[0]) candidates.push(value);
        }
        if (candidates.length >= 2) break;
      }
      return result(`${fixedDecimal(lower, 2)}보다 크고 ${fixedDecimal(upper, 2)}보다 작은 소수 둘째 자리 수 중, 각 자리 숫자가 서로 다르고 소수 첫째 자리 숫자가 일의 자리 숫자와 소수 둘째 자리 숫자의 합인 수는 모두 몇 개인지 구하세요.`, candidates.length, `백분의 일의 자리까지 나타낸 수를 정수 ${lower + 1}부터 ${upper - 1}까지 확인합니다. 세 자리 숫자가 모두 다르고 ‘일의 자리 = 소수 첫째 자리 + 소수 둘째 자리’를 만족하는 수는 ${candidates.length}개입니다.`);
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
    mixedOrderAdvanced({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const quotient = int(rng, 2, 4 + level * 2);
        const divisor = int(rng, 2, 6 + level * 2);
        const dividend = quotient * divisor;
        const multiplier = int(rng, 3, 8 + level * 2);
        const addend = int(rng, 12, 34 + level * 12);
        const outside = int(rng, 2, 5 + level);
        const tail = int(rng, 8, 32 + level * 12);
        const answer = int(rng, 28, 92 + level * 35);
        const inside = addend + multiplier * quotient;
        const head = answer + inside * outside - tail;
        const expression = `${head} - {${addend} + ${multiplier} × (${dividend} ÷ ${divisor})} × ${outside} + ${tail}`;
        return result(`다음 계산을 하세요.<div class="equation" data-mixed-kind="order-calc" data-values="${head},${addend},${multiplier},${dividend},${divisor},${outside},${tail}">${expression} = □</div>`, answer, `괄호 안에서 ${dividend} ÷ ${divisor} = ${quotient}, ${multiplier} × ${quotient} = ${multiplier * quotient}입니다. 중괄호 안은 ${inside}이므로 ${head} - ${inside * outside} + ${tail} = ${answer}입니다.`);
      }
      if (variant % 3 === 1) {
        const blank = int(rng, 2, 8 + level * 4);
        const factor = int(rng, 3, 9 + level * 3);
        const divisor = int(rng, 2, 6 + level * 2);
        const quotient = Math.ceil(factor * blank / divisor) + int(rng, 2, 7 + level * 2);
        const addend = divisor * quotient - factor * blank;
        const answer = int(rng, 20, 75 + level * 30);
        const start = answer + quotient;
        return result(`□ 안에 알맞은 수를 구하세요.<div class="equation" data-mixed-kind="order-blank" data-values="${start},${addend},${factor},${divisor},${answer}">${start} - (${addend} + ${factor} × □) ÷ ${divisor} = ${answer}</div>`, blank, `${start}에서 ${answer}을 빼면 괄호 안을 ${divisor}로 나눈 값은 ${quotient}입니다. 따라서 괄호 안은 ${quotient} × ${divisor} = ${quotient * divisor}이고, ${factor} × □ = ${quotient * divisor - addend}이므로 □는 ${blank}입니다.`);
      }
      const left = int(rng, 12, 28 + level * 10);
      const right = int(rng, 9, 24 + level * 10);
      const divisor = int(rng, 2, 6 + level * 2);
      const ratio = int(rng, 2, 4 + level);
      const multiplier = divisor * ratio;
      const tail = int(rng, 10, 40 + level * 15);
      const answer = int(rng, 35, 110 + level * 35);
      const deducted = (left + right) * ratio;
      const head = answer + deducted - tail;
      const expression = `${head} - (${left} + ${right}) × ${multiplier} ÷ ${divisor} + ${tail}`;
      return result(`괄호, 곱셈과 나눗셈의 순서에 주의하여 계산하세요.<div class="equation" data-mixed-kind="order-sequence" data-values="${head},${left},${right},${multiplier},${divisor},${tail}">${expression} = □</div>`, answer, `먼저 괄호 안은 ${left + right}입니다. ${left + right} × ${multiplier} ÷ ${divisor} = ${deducted}이므로 ${head} - ${deducted} + ${tail} = ${answer}입니다.`);
    },
    oneExpressionAdvanced({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const total = int(rng, 42, 76 + level * 24);
        const boys = int(rng, 14, total - 16);
        const boyCount = int(rng, 3, 6 + level * 2);
        const girlCount = int(rng, 2, 5 + level * 2);
        const answer = boys * boyCount + (total - boys) * girlCount;
        const expression = `${boys} × ${boyCount} + (${total} - ${boys}) × ${girlCount}`;
        return result(`운동회에 쓸 색종이를 남학생에게는 한 명당 ${boyCount}장씩, 여학생에게는 한 명당 ${girlCount}장씩 나누어 줍니다. 전체 학생은 ${total}명이고 남학생은 ${boys}명일 때, 필요한 색종이는 모두 몇 장인지 하나의 식으로 나타내어 계산하세요.<div class="equation" data-mixed-kind="one-expression-people" data-values="${total},${boys},${boyCount},${girlCount}">□</div>`, answer, `여학생은 ${total} - ${boys} = ${total - boys}명입니다. 하나의 식은 ${expression}이고, ${answer}장입니다.`);
      }
      if (variant % 3 === 1) {
        const firstPrice = int(rng, 4, 9 + level * 3) * 100;
        const secondPrice = int(rng, 9, 18 + level * 5) * 100;
        const firstCount = int(rng, 3, 7 + level * 2);
        const secondCount = int(rng, 2, 6 + level * 2);
        const change = int(rng, 15, 45 + level * 20) * 100;
        const paid = firstPrice * firstCount + secondPrice * secondCount + change;
        const expression = `${paid.toLocaleString()} - (${firstPrice.toLocaleString()} × ${firstCount} + ${secondPrice.toLocaleString()} × ${secondCount})`;
        return result(`문구점에서 한 자루에 ${firstPrice.toLocaleString()}원인 연필 ${firstCount}자루와 한 권에 ${secondPrice.toLocaleString()}원인 연습장 ${secondCount}권을 사고 ${paid.toLocaleString()}원을 냈습니다. 거스름돈을 하나의 식으로 나타내어 계산하세요.<div class="equation" data-mixed-kind="one-expression-money" data-values="${paid},${firstPrice},${firstCount},${secondPrice},${secondCount}">□</div>`, change, `물건값을 먼저 묶으면 ${expression} = ${change.toLocaleString()}입니다.`);
      }
      const rows = int(rng, 6, 12 + level * 3);
      const perRow = int(rng, 8, 15 + level * 4);
      const damagedRows = int(rng, 1, Math.max(1, Math.floor(rows / 3)));
      const damagedPerRow = int(rng, 2, Math.min(perRow - 1, 5 + level));
      const answer = rows * perRow - damagedRows * damagedPerRow;
      const expression = `${rows} × ${perRow} - ${damagedRows} × ${damagedPerRow}`;
      return result(`한 상자에 ${perRow}개씩 들어 있는 물건이 ${rows}상자 있습니다. 이 중 ${damagedRows}상자에서는 ${damagedPerRow}개씩 사용할 수 없게 되었습니다. 사용할 수 있는 물건 수를 하나의 식으로 나타내어 계산하세요.<div class="equation" data-mixed-kind="one-expression-stock" data-values="${rows},${perRow},${damagedRows},${damagedPerRow}">□</div>`, answer, `전체 수에서 사용할 수 없는 수를 빼면 됩니다. ${expression} = ${answer}입니다.`);
    },
    mixedWordEquationAdvanced({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const pen = int(rng, 8, 20 + level * 7) * 100;
        const caseExtra = int(rng, 2, 8 + level * 2) * 100;
        const crayonExtra = int(rng, 3, 12 + level * 4) * 100;
        const casePrice = pen + caseExtra;
        const crayonPrice = pen * 3 + crayonExtra;
        const difference = crayonPrice - casePrice;
        return result(`필통의 가격은 연필 한 자루의 가격보다 ${caseExtra.toLocaleString()}원 더 비싸고, 크레파스의 가격은 연필 한 자루의 가격의 3배보다 ${crayonExtra.toLocaleString()}원 더 비쌉니다. 크레파스의 가격은 필통의 가격보다 ${difference.toLocaleString()}원 더 비쌀 때, 크레파스의 가격을 구하세요.<div class="equation" data-mixed-kind="word-price" data-values="${caseExtra},${crayonExtra},${difference}">□</div>`, crayonPrice, `연필 가격을 □원이라 하면 (${3} × □ + ${crayonExtra.toLocaleString()}) - (□ + ${caseExtra.toLocaleString()}) = ${difference.toLocaleString()}입니다. □는 ${pen.toLocaleString()}이므로 크레파스의 가격은 ${crayonPrice.toLocaleString()}원입니다.`);
      }
      if (variant % 3 === 1) {
        const smaller = int(rng, 12, 40 + level * 18);
        const quotient = int(rng, 3, 6 + level * 2);
        const remainder = int(rng, 1, smaller - 1);
        const larger = smaller * quotient + remainder;
        const difference = larger - smaller;
        const answer = larger + smaller;
        return result(`두 자연수의 차는 ${difference}입니다. 큰 수를 작은 수로 나누면 몫은 ${quotient}, 나머지는 ${remainder}일 때, 두 수의 합을 구하세요.<div class="equation" data-mixed-kind="word-quotient" data-values="${difference},${quotient},${remainder}">□</div>`, answer, `작은 수를 □라 하면 큰 수는 ${quotient} × □ + ${remainder}입니다. 두 수의 차가 ${difference}이므로 (${quotient} - 1) × □ + ${remainder} = ${difference}입니다. 작은 수는 ${smaller}, 큰 수는 ${larger}이므로 합은 ${answer}입니다.`);
      }
      const pineNut = int(rng, 14, 42 + level * 14) * 100;
      const difference = int(rng, 1, 6 + level * 2) * 100;
      const peanut = pineNut + difference;
      const boxes = int(rng, 7, 14 + level * 4);
      const total = boxes * 2 * (peanut + pineNut);
      return result(`한 상자에 땅콩 2봉지와 잣 2봉지가 들어 있습니다. 이런 상자 ${boxes}개의 값은 모두 ${total.toLocaleString()}원입니다. 땅콩 한 봉지의 값이 잣 한 봉지의 값보다 ${difference.toLocaleString()}원 더 비쌀 때, 잣 한 봉지의 값을 구하세요.<div class="equation" data-mixed-kind="word-box" data-values="${boxes},${total},${difference}">□</div>`, pineNut, `잣 한 봉지의 값을 □원이라 하면 한 상자의 값은 2 × (□ + □ + ${difference.toLocaleString()})원입니다. ${boxes}상자의 값이 ${total.toLocaleString()}원이므로 □는 ${pineNut.toLocaleString()}원입니다.`);
    },
    mixedExpressionBuildAdvanced({ rng, level }) {
      const puzzle = uniqueOperatorPuzzle(rng, level);
      const expression = mixedExpressionText(puzzle.numbers, puzzle.operators, puzzle.withMiddleParentheses);
      const answer = puzzle.operators.join(", ");
      const parenthesesNotice = puzzle.withMiddleParentheses ? "괄호 안을 먼저 계산한 뒤" : "곱셈과 나눗셈을 먼저 계산한 뒤";
      return result(`□ 안에 +, -, ×, ÷를 각각 한 번씩 넣어 계산 결과가 ${puzzle.target}이 되게 하세요.${puzzle.withMiddleParentheses ? " 괄호 안은 하나의 계산으로 봅니다." : ""}<div class="equation" data-mixed-kind="operator-puzzle" data-mixed-numbers="${puzzle.numbers.join(",")}" data-mixed-parentheses="${puzzle.withMiddleParentheses ? "middle" : "none"}" data-mixed-target="${puzzle.target}">${puzzle.withMiddleParentheses ? `${puzzle.numbers[0]} □ (${puzzle.numbers[1]} □ ${puzzle.numbers[2]}) □ ${puzzle.numbers[3]} □ ${puzzle.numbers[4]}` : `${puzzle.numbers[0]} □ ${puzzle.numbers[1]} □ ${puzzle.numbers[2]} □ ${puzzle.numbers[3]} □ ${puzzle.numbers[4]}`} = ${puzzle.target}</div>`, answer, `왼쪽부터 기호를 ${answer} 순서로 넣습니다. ${parenthesesNotice} ${expression} = ${puzzle.target}가 됩니다.`);
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
    },
    polygonDiagonals({ rng, level, variant = 0 }) {
      const sideChoices = level === 0 ? [4, 5, 6] : level === 1 ? [5, 6, 7, 8] : [6, 7, 8, 9, 10];
      const sides = pick(rng, sideChoices);
      if (variant % 3 === 0) {
        const answer = sides - 3;
        return result('정' + sides + '각형의 한 꼭짓점에서 이웃한 꼭짓점과 자기 자신을 제외한 꼭짓점에 선분을 그었습니다. 그을 수 있는 대각선은 모두 몇 개입니까?' + polygonDiagonalSvg(sides, "fan"), answer, '한 꼭짓점은 자기 자신 1개와 이웃한 꼭짓점 2개에는 대각선을 그을 수 없습니다. 따라서 ' + sides + ' - 3 = ' + answer + '개입니다.');
      }
      if (variant % 3 === 1) {
        const diagonalCount = sides * (sides - 3) / 2;
        return result('모든 대각선을 그었더니 대각선이 ' + diagonalCount + '개인 정다각형이 있습니다. 이 다각형은 몇 각형입니까?' + polygonDiagonalSvg(sides, "all"), sides, '정' + sides + '각형에서는 한 꼭짓점마다 ' + (sides - 3) + '개의 대각선을 그을 수 있습니다. 꼭짓점마다 세면 ' + sides + ' × ' + (sides - 3) + '이고, 같은 대각선을 두 번 세었으므로 2로 나누면 ' + diagonalCount + '개입니다. 따라서 정' + sides + '각형입니다.');
      }
      const other = pick(rng, sideChoices.filter(value => value !== sides));
      const answer = Math.abs(sides * (sides - 3) / 2 - other * (other - 3) / 2);
      return result('정' + sides + '각형과 정' + other + '각형에 그을 수 있는 모든 대각선의 개수 차를 구하세요.' + polygonDiagonalSvg(sides, "all"), answer, '정' + sides + '각형의 대각선은 ' + (sides * (sides - 3) / 2) + '개, 정' + other + '각형의 대각선은 ' + (other * (other - 3) / 2) + '개입니다. 차는 ' + answer + '개입니다.');
    },
    regularPolygonApplication({ rng, level, variant = 0 }) {
      const sideChoices = level === 0 ? [3, 4, 6] : level === 1 ? [3, 4, 5, 6, 8] : [3, 4, 5, 6, 8, 10];
      const sides = pick(rng, sideChoices);
      const exterior = 360 / sides;
      const interior = 180 - exterior;
      if (variant % 3 === 0) {
        return result('한 내각의 크기가 ' + interior + '°인 정' + sides + '각형이 있습니다. 한 외각의 크기를 구하세요.' + polygonSvg(sides, Array(sides).fill("")), exterior, '한 꼭짓점에서 내각과 외각의 합은 180°이므로 180 - ' + interior + ' = ' + exterior + '°입니다.');
      }
      if (variant % 3 === 1) {
        const sideLength = int(rng, 3 + level, 8 + level * 3);
        const answer = sides * sideLength;
        return result('한 변의 길이가 ' + sideLength + 'cm인 정' + sides + '각형의 둘레를 구하세요.' + polygonSvg(sides, Array(sides).fill("")), answer, '정' + sides + '각형은 같은 길이의 변이 ' + sides + '개이므로 ' + sideLength + ' × ' + sides + ' = ' + answer + 'cm입니다.');
      }
      const angleCases = [
        { angles: [90, 90, 60, 120], labels: ["90°", "90°", "60°", "□"], answer: 120 },
        { angles: [120, 90, 60, 90], labels: ["120°", "90°", "60°", "□"], answer: 90 },
        { angles: [120, 120, 60, 60], labels: ["120°", "120°", "60°", "□"], answer: 60 }
      ];
      const selected = pick(rng, angleCases.slice(0, 1 + level * 1 + 1));
      return result('정다각형들을 한 꼭짓점에 맞대어 빈틈없이 붙였습니다. 그림의 □에 알맞은 각도를 구하세요.' + regularMeetSvg(selected.angles, selected.labels), selected.answer, '한 점 둘레의 각의 합은 360°입니다. 알려진 각의 합 ' + (360 - selected.answer) + '°을 360°에서 빼면 □는 ' + selected.answer + '°입니다.');
    },
    tessellationCover({ rng, level, variant = 0 }) {
      const rows = int(rng, 3 + level, 4 + level);
      const cols = int(rng, 4 + level, 6 + level);
      if (variant % 3 === 0) {
        const side = int(rng, 2, 5 + level);
        const answer = rows * cols;
        return result('한 변의 길이가 ' + side + 'cm인 같은 정사각형 타일로 그림과 같은 직사각형 바닥을 빈틈없이 덮었습니다. 사용한 타일은 모두 몇 장입니까?' + tileBoardSvg({ rows, cols }), answer, '가로에 ' + cols + '장, 세로에 ' + rows + '장이므로 ' + cols + ' × ' + rows + ' = ' + answer + '장입니다.');
      }
      if (variant % 3 === 1) {
        const evenRows = rows % 2 === 0 ? rows : rows + 1;
        const answer = Math.ceil(evenRows * cols / 2);
        return result('같은 정사각형 타일을 그림처럼 파랑, 흰색이 번갈아 나타나도록 빈틈없이 붙였습니다. 파란색 타일은 모두 몇 장입니까?' + tileBoardSvg({ rows: evenRows, cols, highlight: "checker" }), answer, '한 줄마다 파란색 타일은 ' + Math.ceil(cols / 2) + '장과 ' + Math.floor(cols / 2) + '장이 번갈아 있습니다. 전체 ' + (evenRows * cols) + '장 중 절반이므로 파란색 타일은 ' + answer + '장입니다.');
      }
      const tileWidth = int(rng, 2, 4 + level);
      const tileHeight = int(rng, 2, 3 + level);
      const answer = rows * cols;
      return result('가로 ' + (cols * tileWidth) + 'cm, 세로 ' + (rows * tileHeight) + 'cm인 직사각형을 가로 ' + tileWidth + 'cm, 세로 ' + tileHeight + 'cm인 같은 직사각형 타일로 덮으려고 합니다. 필요한 타일 수를 구하세요.' + tileBoardSvg({ rows, cols, highlight: "border" }), answer, '가로에는 ' + (cols * tileWidth) + ' ÷ ' + tileWidth + ' = ' + cols + '장, 세로에는 ' + (rows * tileHeight) + ' ÷ ' + tileHeight + ' = ' + rows + '장입니다. 따라서 ' + cols + ' × ' + rows + ' = ' + answer + '장입니다.');
    },
    shapePartitionCompose({ rng, level, variant = 0 }) {
      const cases = [
        { name: "ㄴ자 모양 조각", cells: [[0, 0], [0, 1], [1, 0]], rows: 3 + level, cols: 4 + level },
        { name: "긴 막대 모양 조각", cells: [[0, 0], [1, 0], [2, 0]], rows: 3 + level, cols: 4 + level },
        { name: "ㅜ자 모양 조각", cells: [[0, 0], [1, 0], [2, 0], [1, 1]], rows: 4 + Math.min(level, 1), cols: 5 + level }
      ];
      const selected = cases[variant % cases.length];
      const answer = placementCount(selected.rows, selected.cols, selected.cells);
      return result('왼쪽 ' + selected.name + '을 돌리는 것은 가능하지만 뒤집는 것은 불가능합니다. 오른쪽 ' + selected.rows + '행 ' + selected.cols + '열 모눈 안에 선을 맞추어 완전히 놓을 수 있는 서로 다른 방법은 모두 몇 가지입니까?' + piecePlacementSvg(selected), answer, '조각을 돌려 생기는 서로 다른 방향을 모두 확인하고, 각 방향에서 모눈을 벗어나지 않는 위치를 셉니다. 이 조각은 모두 ' + answer + '가지 위치에 놓을 수 있습니다.');
    },
    quadPerpParallelDistance({ rng, level, variant = 0 }) {
      const segCount = level === 0 ? 3 : level === 2 ? pick(rng, [5, 6]) : pick(rng, [4, 5]);
      const verticals = Array.from({ length: segCount }, () => int(rng, 2, 6 + level * 2));
      const horizontals = Array.from({ length: segCount }, () => int(rng, 2, 7 + level * 2));
      const total = verticals.reduce((sum, value) => sum + value, 0);
      if (level === 2 && variant % 2 === 1) {
        const hiddenIndex = int(rng, 0, segCount - 1);
        const known = verticals.filter((_, index) => index !== hiddenIndex);
        const answer = verticals[hiddenIndex];
        const knownSum = known.reduce((sum, value) => sum + value, 0);
        return result(`아래 그림과 같이 수직인 선분을 계속 이어 그렸습니다. 가장 먼 두 평행선 사이의 거리가 ${total}cm일 때, □ 안에 알맞은 수를 구하세요.${staircaseSvg(horizontals, verticals, hiddenIndex)}`, answer, `가장 먼 평행선 사이의 거리는 수직 구간의 길이의 합과 같습니다. 나머지 구간의 합은 ${known.join(" + ")} = ${knownSum}cm이므로 □ = ${total} - ${knownSum} = ${answer}cm입니다.`);
      }
      return result(`아래 그림과 같이 수직인 선분을 계속 이어 그렸습니다. 가장 먼 두 평행선 사이의 거리를 구하세요.${staircaseSvg(horizontals, verticals)}`, total, `가장 먼 두 평행선 사이의 거리는 같은 방향의 수직 구간의 길이를 모두 더한 값과 같습니다. ${verticals.join(" + ")} = ${total}cm입니다.`);
    },
    quadParallelAngleCondition({ rng, level, variant = 0 }) {
      if (variant % 2 === 0) {
        const count = 3 + level;
        const angle = int(rng, 40, 140);
        const askAlternate = rng() > 0.5;
        const single = askAlternate ? 180 - angle : angle;
        const answer = single * (count - 1);
        return result(`서로 평행한 직선 ${count}개를 한 직선이 가로지릅니다. 맨 위 교점에서 만들어지는 한 각의 크기가 ${angle}°일 때, 나머지 ${count - 1}개의 교점에서 이 각과 ${askAlternate ? "엇각" : "동위각"} 관계에 있는 각의 크기를 모두 더한 값을 구하세요.${parallelTransversalSvg(count, angle)}`, answer, `평행선을 가로지르는 한 직선이 만드는 ${askAlternate ? "엇각" : "동위각"}은 크기가 모두 같습니다. 관계에 있는 각은 한 개당 ${single}°이고 이런 교점이 ${count - 1}개이므로 ${single} × ${count - 1} = ${answer}°입니다.`);
      }
      const a = int(rng, 30, 65 + level * 5);
      const c = int(rng, 30, 65 + level * 5);
      const b = 180 - a - c;
      const answer = a + c;
      return result(`삼각형 ABC에서 ∠A=${a}°, ∠C=${c}°입니다. 꼭짓점 B를 지나고 변 AC에 평행한 직선을 그었을 때 이 직선과 변 BA, 변 BC가 이루는 두 각을 각각 ㉠, ㉡이라고 하면 ㉠+㉡의 크기를 구하세요.${triangleVertexSplitSvg(a, b, c)}`, answer, `평행선에서 엇각은 크기가 같으므로 ㉠=∠A=${a}°, ㉡=∠C=${c}°입니다. 따라서 ㉠+㉡ = ${a} + ${c} = ${answer}°이며, 이는 삼각형의 세 각의 합 180°에서 ∠B(${b}°)를 뺀 값과 같습니다.`);
    },
    quadAngleChainOne({ rng, level, variant = 0 }) {
      const bendCount = level === 0 ? 1 : 2;
      const chain = buildZigzagChain(rng, bendCount);
      if (level === 2 && variant % 2 === 1) {
        const exteriorIndex = int(rng, 0, bendCount - 1);
        const exterior = 180 - chain.interiorAngles[exteriorIndex];
        const shown = chain.interiorAngles.map((value, index) => index === exteriorIndex ? `${exterior}°(바깥쪽에서 잰 각)` : `${value}°`);
        return result(`직선 가와 나는 서로 평행합니다. 그림과 같이 꺾인 선의 각이 ${chain.entry}°, ${shown.join(", ")}일 때 ㉮의 크기를 구하세요.${zigzagChainSvg(chain.entry, chain.interiorAngles, chain.exit, "exit")}`, chain.exit, `바깥쪽에서 잰 각 ${exterior}°는 안쪽 각으로 ${180 - exterior}°입니다. 각 꺾인 점마다 평행선과 평행한 보조선을 그어 엇각으로 나누어 더하면 ㉮ = ${chain.exit}°입니다.`);
      }
      return result(`직선 가와 나는 서로 평행합니다. 그림과 같이 꺾인 선이 있을 때 ㉮의 크기를 구하세요.${zigzagChainSvg(chain.entry, chain.interiorAngles, chain.exit, "exit")}`, chain.exit, `각 꺾인 점마다 평행선과 평행한 보조선을 그으면 엇각으로 나뉩니다. 이를 차례로 계산하면 ㉮ = ${chain.exit}°입니다.`);
    },
    quadAngleChainTwo({ rng, level, variant = 0 }) {
      if (level === 2 && variant % 2 === 1) {
        const theta = int(rng, 25, 70);
        const bounces = int(rng, 3, 5);
        const answer = 180 - 2 * theta;
        return result(`평행한 두 개의 거울 사이에서 레이저가 그림처럼 여러 번 반사되었습니다. 거울과 이루는 각이 ${theta}°로 일정할 때, 반사되는 점에서 두 레이저 사이의 각 ㉠의 크기를 구하세요.${laserMirrorSvg(theta, bounces)}`, answer, `입사각과 반사각이 같으므로 레이저가 거울과 이루는 각은 항상 ${theta}°로 일정합니다. 두 레이저 사이의 각은 180° - ${theta}° - ${theta}° = ${answer}°입니다.`);
      }
      const bendCount = level === 0 ? 3 : 4 + int(rng, 0, 1);
      const chain = buildZigzagChain(rng, bendCount, [25, 75], [18, 60]);
      return result(`직선 ㄱㄴ과 직선 ㄷㄹ은 서로 평행합니다. 그림과 같이 여러 번 꺾인 선이 있을 때 ㉮의 크기를 구하세요.${zigzagChainSvg(chain.entry, chain.interiorAngles, chain.exit, "exit")}`, chain.exit, `각 꺾인 점마다 평행선과 평행한 보조선을 그으면 엇각으로 나뉩니다. 이를 순서대로 계산하면 ㉮ = ${chain.exit}°입니다.`);
    },
    quadPropertyRelations({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const parts = level === 2 ? 3 : 2;
        const k = int(rng, 10 + level * 4, 22 + level * 6);
        const beta = parts * k;
        const angleA = 180 - beta;
        const angleADM = beta / parts;
        const answer = beta - angleADM;
        return result(`평행사변형 ABCD에서 ∠D를 ${parts === 3 ? "삼등분" : "이등분"}하는 선을 그어 변 AB와 만나는 점을 M이라고 하겠습니다. ∠D=${beta}°일 때 ∠AMD의 크기를 구하세요.${parallelogramSplitSvg(angleA, angleADM)}`, answer, `AB와 DC는 평행하므로 ∠A = 180° - ${beta}° = ${angleA}°입니다. ∠ADM은 ∠D를 ${parts}등분한 것 중 하나이므로 ${beta} ÷ ${parts} = ${angleADM}°입니다. 삼각형 ADM에서 ∠AMD = 180° - ${angleA}° - ${angleADM}° = ${answer}°입니다.`);
      }
      if (variant % 3 === 1) {
        const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13]];
        const [legA, legB, hyp] = pick(rng, triples);
        const k = int(rng, 2, 4 + level);
        const half1 = legA * k;
        const half2 = legB * k;
        const side = hyp * k;
        const sum = 2 * (half1 + half2);
        const diff = Math.abs(half1 - half2) * 2;
        const answer = 4 * side;
        return result(`두 대각선의 길이의 합이 ${sum}cm, 차가 ${diff}cm인 마름모가 있습니다. 이 마름모의 두 대각선을 따라 잘라 생기는 4개의 직각삼각형을 겹치지 않게 이어 붙여 직사각형을 만들 때, 네 변의 길이의 합을 구하세요.${rhombusDiagonalSvg(half1, half2)}`, answer, `대각선의 반은 (${sum}+${diff})÷2÷2 = ${half1}cm, (${sum}-${diff})÷2÷2 = ${half2}cm입니다. 직각삼각형의 빗변은 √(${half1}²+${half2}²) = ${side}cm이고, 이 변이 직사각형의 네 변이 되므로 둘레는 ${side} × 4 = ${answer}cm입니다.`);
      }
      const apexAngle = int(rng, 20 + level * 5, 59 + level * 5) * 2;
      const base = (180 - apexAngle) / 2;
      const answer = 90 + apexAngle / 2;
      return result(`꼭지각이 ${apexAngle}°인 이등변삼각형 모양의 종이를 접어서 마름모를 만들었습니다. 새로 생긴 마름모의 한 각(둔각)의 크기를 구하세요.`, answer, `이등변삼각형의 밑각은 (180° - ${apexAngle}°) ÷ 2 = ${base}°입니다. 접어서 만든 마름모의 둔각은 180° - ${base}° = ${answer}°입니다.`);
    },
    quadPropertyApplication({ rng, level, variant = 0 }) {
      if (variant % 2 === 0) {
        const pool = [
          { label: "정삼각형", icon: "△", sides: 3 },
          { label: "정사각형", icon: "□", sides: 4 },
          { label: "마름모", icon: "◇", sides: 4 },
          { label: "정오각형", icon: "⬠", sides: 5 }
        ];
        const count = 3 + level;
        const shapes = Array.from({ length: count }, () => pick(rng, pool));
        const side = int(rng, 3, 6 + level * 2);
        const totalSides = shapes.reduce((sum, shape) => sum + shape.sides, 0);
        const answer = (totalSides - 2 * (count - 1)) * side;
        return result(`한 변의 길이가 ${side}cm인 [${shapes.map(shape => shape.label).join(", ")}]을 이웃한 도형과 변 하나씩 겹치도록 순서대로 이어 붙였습니다. 전체 도형의 둘레를 구하세요.${shapeChainCards(shapes)}`, answer, `도형들의 변의 수를 모두 더하면 ${totalSides}개이고, 겹친 변은 ${count - 1}곳에서 각각 2개씩 사라지므로 남는 변은 ${totalSides} - ${2 * (count - 1)} = ${totalSides - 2 * (count - 1)}개입니다. 둘레는 ${totalSides - 2 * (count - 1)} × ${side} = ${answer}cm입니다.`);
      }
      const pool = [
        { name: "정삼각형", angle: 60 },
        { name: "정사각형", angle: 90 },
        { name: "정육각형", angle: 120 }
      ];
      const targetCount = level === 0 ? 2 : level === 1 ? 3 : 4;
      const cap = 330;
      const chosen = [];
      let sum = 0;
      for (let index = 0; index < targetCount; index += 1) {
        const candidates = pool.filter(shape => sum + shape.angle <= cap);
        if (!candidates.length) break;
        const shape = pick(rng, candidates);
        chosen.push(shape);
        sum += shape.angle;
      }
      const withRhombus = level === 2;
      let rhombusAngle = null;
      if (withRhombus) {
        const maxRhombus = Math.min(110, cap - sum);
        if (maxRhombus >= 60) {
          rhombusAngle = int(rng, 60, maxRhombus);
          sum += rhombusAngle;
        }
      }
      const known = chosen.map(shape => shape.angle).concat(rhombusAngle !== null ? [rhombusAngle] : []);
      const knownSum = sum;
      const answer = 360 - knownSum;
      const labels = known.map(value => `${value}°`).concat(["㉠", "㉡"]);
      const names = chosen.map(shape => shape.name).concat(rhombusAngle !== null ? [`마름모(한 각 ${rhombusAngle}°)`] : []);
      return result(`한 점 주위에 ${names.join(", ")}이 빈틈없이 모여 있고, 남은 자리에 두 각 ㉠, ㉡이 있습니다. ㉠+㉡의 크기를 구하세요.${anglePointSvg(labels)}`, answer, `한 점 주위의 각의 합은 360°입니다. 이미 알고 있는 각의 합은 ${known.join(" + ")} = ${knownSum}°이므로 ㉠+㉡ = 360° - ${knownSum}° = ${answer}°입니다.`);
    },
    quadSquareSpecial({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const side = int(rng, 2, 4 + level);
        const count = int(rng, 8 + level * 5, 16 + level * 6);
        const length = side + (count - 1) * side / 2;
        const answer = 2 * (length + side);
        if (level === 2) {
          const perimeter = answer;
          return result(`한 변의 길이가 ${side}cm인 정사각형 색종이 여러 장을 서로 절반씩 겹쳐서 한 줄로 이어 붙였습니다. 전체 도형의 둘레가 ${perimeter}cm일 때 사용한 색종이는 몇 장인지 구하세요.${paperStackSvg(side, count)}`, count, `색종이를 n장 이어 붙이면 가로 길이는 ${side} + (n-1) × ${side / 2}이고 둘레는 2 × (가로 + ${side})입니다. 둘레 ${perimeter}cm을 이용해 역으로 풀면 n = ${count}장입니다.`);
        }
        return result(`한 변의 길이가 ${side}cm인 정사각형 색종이 ${count}장을 서로 절반씩 겹치지 않는 부분이 생기도록 그림과 같이 한 줄로 이어 붙였습니다. 전체 도형의 둘레를 구하세요.${paperStackSvg(side, count)}`, answer, `이어 붙인 도형의 가로 길이는 ${side} + (${count}-1) × ${side / 2} = ${length}cm이고 세로는 ${side}cm이므로 둘레는 2 × (${length} + ${side}) = ${answer}cm입니다.`);
      }
      if (variant % 3 === 1) {
        const half = int(rng, 15 + level * 8, 40 + level * 10);
        const apexAngle = half * 2;
        const answer = (180 - apexAngle) / 2;
        return result(`정사각형 모양의 종이를 그림과 같이 접었더니 접힌 부분이 이루는 각이 ${apexAngle}°인 이등변삼각형이 생겼습니다. 이 삼각형의 한 밑각의 크기를 구하세요.${foldSvg(half)}`, answer, `접어서 생긴 삼각형은 이등변삼각형이므로 밑각의 크기는 (180° - ${apexAngle}°) ÷ 2 = ${answer}°입니다.`);
      }
      const a = int(rng, 3, 6 + level * 2);
      if (level < 2) {
        const b = int(rng, 2, 5 + level * 2);
        const c = a + b;
        return result(`그림과 같이 정사각형 가, 나, 다를 겹치지 않게 붙였습니다. 정사각형 가의 한 변의 길이가 ${a}cm, 나의 한 변의 길이가 ${b}cm일 때, 정사각형 다의 한 변의 길이를 구하세요.${nestedSquareSvg(a, b, c)}`, c, `정사각형 다의 한 변은 가와 나의 한 변의 길이의 합과 같으므로 ${a} + ${b} = ${c}cm입니다.`);
      }
      const total = int(rng, 12, 20 + level * 4) * 2 + a;
      const b = (total - a) / 2;
      const c = total - b;
      return result(`그림과 같이 정사각형 가, 나, 다를 겹치지 않게 붙였습니다. 정사각형 다의 한 변은 가와 나의 한 변의 길이의 합과 같습니다. 가의 한 변이 ${a}cm이고 나와 다의 한 변의 길이의 합이 ${total}cm일 때, 나의 한 변의 길이를 구하세요.${nestedSquareSvg(a, b, c)}`, b, `다 = 가 + 나 = ${a} + 나이고, 나 + 다 = ${total}이므로 나 + (${a}+나) = ${total}입니다. 2 × 나 = ${total} - ${a} = ${total - a}이므로 나 = ${b}cm입니다.`);
    },
    quadRectangleCount({ rng, level, variant = 0 }) {
      if (level === 2) {
        const m = int(rng, 3, 5);
        const n = int(rng, 3, 4);
        const rectCount = (m * (m + 1) / 2) * (n * (n + 1) / 2);
        let squareCount = 0;
        for (let size = 1; size <= Math.min(m, n); size += 1) squareCount += (m - size + 1) * (n - size + 1);
        return result(`가로로 ${m}칸, 세로로 ${n}칸인 모눈에서 선을 따라 그릴 수 있는 크고 작은 직사각형은 모두 몇 개이고, 그중 정사각형은 몇 개인지 차례로 구하세요.${gridRectSvg(m, n)}`, `${rectCount}, ${squareCount}`, `가로선 중 2개, 세로선 중 2개를 고르면 직사각형 1개가 정해지므로 직사각형의 개수는 (1+2+…+${m}) × (1+2+…+${n}) = ${m * (m + 1) / 2} × ${n * (n + 1) / 2} = ${rectCount}개입니다. 이 중 정사각형은 한 변의 길이별로 세어 더하면 ${squareCount}개입니다.`);
      }
      if (variant % 2 === 0) {
        const m = int(rng, 2 + level, 4 + level);
        const n = int(rng, 2 + level, 4 + level);
        const answer = (m * (m + 1) / 2) * (n * (n + 1) / 2);
        return result(`가로로 ${m}칸, 세로로 ${n}칸인 모눈에서 선을 따라 그릴 수 있는 크고 작은 직사각형은 모두 몇 개인지 구하세요.${gridRectSvg(m, n)}`, answer, `가로선 중 2개를 고르는 방법은 1+2+…+${m} = ${m * (m + 1) / 2}가지, 세로선 중 2개를 고르는 방법은 1+2+…+${n} = ${n * (n + 1) / 2}가지입니다. 두 경우를 곱하면 직사각형의 개수는 ${m * (m + 1) / 2} × ${n * (n + 1) / 2} = ${answer}개입니다.`);
      }
      const m = int(rng, 3 + level, 5 + level);
      const n = int(rng, 3 + level, 5 + level);
      const r = int(rng, 1, m);
      const c = int(rng, 1, n);
      const answer = r * (m - r + 1) * c * (n - c + 1);
      return result(`가로로 ${m}칸, 세로로 ${n}칸인 직사각형 모눈 안에 깃발이 하나 그려져 있습니다. 깃발을 포함한 크고 작은 직사각형은 모두 몇 개인지 구하세요.${gridRectSvg(m, n, [r, c])}`, answer, `깃발이 있는 칸을 포함하려면 왼쪽으로 ${r}가지, 오른쪽으로 ${m - r + 1}가지, 위로 ${c}가지, 아래로 ${n - c + 1}가지 중 하나씩 선택하면 됩니다. ${r} × ${m - r + 1} × ${c} × ${n - c + 1} = ${answer}개입니다.`);
    },
    factorMultipleAdvanced({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const divisor = pick(rng, [7, 9, 11, 13, 17].slice(0, 3 + level));
        const base = int(rng, 320, 960 + level * 480);
        const low = level === 2 ? 1000 : 100;
        const high = low + int(rng, 600, 1800 + level * 1200);
        const count = Math.floor((base + high) / divisor) - Math.floor((base + low - 1) / divisor);
        return result(`${base} + □가 ${divisor}의 배수가 되도록 하는 ${low} 이상 ${high} 이하의 자연수 □는 모두 몇 개인지 구하세요.`, count, `${base}+□가 ${divisor}의 배수이려면 □의 범위 안에서 ${divisor}의 배수가 되는 값을 세면 됩니다. ${low}부터 ${high}까지 조건을 만족하는 수는 ${count}개입니다.`);
      }
      const bases = level === 0 ? [[2, 4], [3, 2], [5, 1]] : level === 1 ? [[2, 5], [3, 3], [5, 2], [7, 1]] : [[2, 6], [3, 4], [5, 2], [7, 2]];
      const factors = new Map(bases);
      const value = factorMapProduct(factors);
      if (variant % 3 === 1) {
        const lower = level === 0 ? 10 : 100;
        const upper = Math.min(value, lower + int(rng, 250, 1100 + level * 900));
        const candidates = allDivisors(value).filter(divisor => divisor >= lower && divisor <= upper);
        const answer = candidates.length ? candidates[candidates.length - 1] : allDivisors(value).filter(divisor => divisor <= upper).at(-1);
        return result(`${value.toLocaleString()}의 약수 중 ${upper.toLocaleString()} 이하인 수 가운데 가장 큰 수를 구하세요.`, answer, `${value.toLocaleString()}을 소인수분해하면 ${factorMapText(factors)}입니다. 이 범위에서 가장 큰 약수는 ${answer.toLocaleString()}입니다.`);
      }
      const divisors = allDivisors(value).filter(divisor => divisor <= Math.sqrt(value));
      const first = divisors[divisors.length - 1];
      const second = value / first;
      return result(`두 자연수의 곱이 ${value.toLocaleString()}일 때, 두 수의 차가 가장 작도록 하는 두 수의 합을 구하세요.`, first + second, `${value.toLocaleString()}의 약수 중 제곱근에 가장 가까운 약수는 ${first.toLocaleString()}입니다. 다른 수는 ${second.toLocaleString()}이므로 합은 ${first.toLocaleString()} + ${second.toLocaleString()} = ${(first + second).toLocaleString()}입니다.`);
    },
    primeFactorBasicAdvanced({ rng, level, variant = 0 }) {
      const primes = level === 0 ? [2, 3, 5] : level === 1 ? [2, 3, 5, 7] : [2, 3, 5, 7, 11];
      const factors = new Map();
      primes.forEach((prime, index) => {
        const power = int(rng, index === 0 ? 1 : 0, 1 + Math.min(2, level));
        if (power) factors.set(prime, power);
      });
      if (factors.size < 2) factors.set(2, 2 + level);
      const value = factorMapProduct(factors);
      if (variant % 3 === 2) {
        const candidates = [value - 1, value, value + 1, value + pick(rng, [2, 4, 6, 8])];
        const primesOnly = candidates.filter(candidate => {
          if (candidate < 2) return false;
          return allDivisors(candidate).length === 2;
        });
        return result(`다음 수 중 소수인 수는 모두 몇 개인지 구하세요.<div class="equation">${candidates.join(", ")}</div>`, primesOnly.length, `각 수를 작은 소수로 나누어 보면 소수는 ${primesOnly.join(", ") || "없고"}, 모두 ${primesOnly.length}개입니다.`);
      }
      return result(`${value.toLocaleString()}을 소인수의 곱으로 나타내세요.`, factorMapText(factors), `${value.toLocaleString()}을 소수로 차례로 나누면 ${factorMapText(factors)}입니다.`);
    },
    primeFactorPowerAdvanced({ rng, level, variant = 0 }) {
      const primes = level === 2 ? [2, 3, 5, 7] : [2, 3, 5];
      const left = new Map(primes.map((prime, index) => [prime, int(rng, 1 + (index === 0 ? 1 : 0), 2 + level)]));
      const right = new Map(primes.map((prime, index) => [prime, int(rng, 0, Math.max(0, (left.get(prime) || 0) - (index === 0 ? 0 : 1)))]).filter(([, power]) => power));
      if (!right.size) right.set(2, 1);
      if (variant % 3 === 0) {
        const answerMap = factorMapMultiply(left, right);
        return result(`다음을 소인수의 곱으로 나타내세요.<div class="equation">(${factorMapText(left)}) × (${factorMapText(right)})</div>`, factorMapText(answerMap), `같은 소인수끼리 지수를 더하면 ${factorMapText(answerMap)}입니다.`);
      }
      if (variant % 3 === 1) {
        const answerMap = factorMapDivide(left, right);
        return result(`다음을 소인수의 곱으로 나타내세요.<div class="equation">(${factorMapText(left)}) ÷ (${factorMapText(right)})</div>`, factorMapText(answerMap), `나눗셈에서는 같은 소인수의 지수를 빼므로 ${factorMapText(answerMap)}입니다.`);
      }
      const target = new Map(left);
      target.set(2, (target.get(2) || 0) + 2);
      target.set(3, (target.get(3) || 0) + 1);
      const answerMap = factorMapDivide(target, left);
      return result(`□에 알맞은 수를 소인수의 곱으로 나타내세요.<div class="equation">(${factorMapText(left)}) × □ = ${factorMapText(target)}</div>`, factorMapText(answerMap), `오른쪽 소인수의 지수에서 왼쪽 소인수의 지수를 빼면 □는 ${factorMapText(answerMap)}입니다.`);
    },
    primeFactorApplicationAdvanced({ rng, level, variant = 0 }) {
      const primes = [2, 3, 5, 7].slice(0, 3 + Math.min(level, 1));
      const factors = new Map(primes.map((prime, index) => [prime, int(rng, 1, 2 + (index === 0 ? level : 1))]));
      const value = factorMapProduct(factors);
      if (variant % 3 === 0) {
        const n = int(rng, 18 + level * 8, 42 + level * 18);
        const answer = Math.floor(n / 5) + Math.floor(n / 25) + Math.floor(n / 125);
        return result(`1부터 ${n}까지의 자연수를 모두 곱한 수의 일의 자리에서부터 연속으로 나타나는 0은 몇 개인지 구하세요.`, answer, `10은 2와 5의 곱이고 2보다 5의 개수가 적습니다. ${n}!에 들어 있는 5의 개수는 ⌊${n}/5⌋ + ⌊${n}/25⌋ + ⌊${n}/125⌋ = ${answer}개이므로 0도 ${answer}개입니다.`);
      }
      if (variant % 3 === 1) {
        const completion = new Map();
        factors.forEach((power, prime) => completion.set(prime, power % 2 ? 1 : 0));
        const answer = factorMapProduct(completion);
        return result(`${value.toLocaleString()}에 가장 작은 자연수를 곱하여 제곱수가 되게 하려고 합니다. 곱해야 하는 자연수를 구하세요.`, answer, `${value.toLocaleString()} = ${factorMapText(factors)}입니다. 모든 지수가 짝수가 되려면 ${factorMapText(completion)}을 더 곱해야 하므로 답은 ${answer}입니다.`);
      }
      const completion = new Map();
      factors.forEach((power, prime) => completion.set(prime, (3 - power % 3) % 3));
      const answer = factorMapProduct(completion);
      return result(`${value.toLocaleString()}에 가장 작은 자연수를 곱하여 세제곱수가 되게 하려고 합니다. 곱해야 하는 자연수를 구하세요.`, answer, `${value.toLocaleString()} = ${factorMapText(factors)}입니다. 모든 지수가 3의 배수가 되도록 ${factorMapText(completion)}을 곱하면 되므로 답은 ${answer}입니다.`);
    },
    commonDivisorAdvanced({ rng, level, variant = 0 }) {
      const common = pick(rng, [6, 8, 10, 12, 15, 18, 21].slice(0, 4 + level));
      const coprimePairs = [[5, 7], [7, 9], [8, 11], [11, 13], [13, 16]];
      const [leftScale, rightScale] = pick(rng, coprimePairs.slice(0, 3 + level));
      const left = common * leftScale;
      const right = common * rightScale;
      if (variant % 2 === 0) {
        const answer = allDivisors(common).length;
        return result(`${left}과 ${right}의 공약수는 모두 몇 개인지 구하세요.`, answer, `${left}과 ${right}의 최대공약수는 ${common}이고 공약수는 ${allDivisors(common).join(", ")}입니다. 따라서 ${answer}개입니다.`);
      }
      return result(`${left}과 ${right}의 최대공약수를 구하고 소인수의 곱으로 나타내세요.`, factorMapText(factorMap(common)), `${left}과 ${right}을 각각 소인수분해했을 때 공통으로 들어 있는 소인수의 지수를 작은 쪽으로 고르면 최대공약수는 ${common} = ${factorMapText(factorMap(common))}입니다.`);
    },
    commonMultipleAdvanced({ rng, level, variant = 0 }) {
      const pairs = level === 0 ? [[12, 18], [14, 20], [15, 24]] : level === 1 ? [[18, 30], [24, 35], [28, 45]] : [[36, 54], [40, 63], [42, 70]];
      const [left, right] = pick(rng, pairs);
      const base = lcm(left, right);
      if (variant % 2 === 0) {
        const target = base * int(rng, 4, 10 + level * 3) + int(rng, 1, Math.floor(base / 3));
        const answer = Math.round(target / base) * base;
        return result(`${left}의 배수이면서 ${right}의 배수인 수 중 ${target.toLocaleString()}에 가장 가까운 수를 구하세요.`, answer, `${left}과 ${right}의 최소공배수는 ${base}입니다. ${base}의 배수 중 ${target.toLocaleString()}에 가장 가까운 수는 ${answer.toLocaleString()}입니다.`);
      }
      const lower = base * int(rng, 2, 4 + level);
      const upper = lower + base * int(rng, 3, 6 + level);
      const answer = Math.floor(upper / base) - Math.floor((lower - 1) / base);
      return result(`${lower.toLocaleString()} 이상 ${upper.toLocaleString()} 이하인 자연수 중 ${left}과 ${right}의 공배수는 모두 몇 개인지 구하세요.`, answer, `${left}과 ${right}의 공배수는 ${base}의 배수입니다. 범위 안의 ${base}의 배수를 세면 ${answer}개입니다.`);
    },
    divisibilityRuleAdvanced({ rng, level, variant = 0 }) {
      const settings = level === 0 ? [[3, 4], [9, 4]] : level === 1 ? [[4, 5], [8, 5], [9, 5]] : [[9, 6], [11, 6], [12, 6]];
      const [divisor, digits] = pick(rng, settings);
      for (let attempt = 0; attempt < 80; attempt += 1) {
        const values = Array.from({ length: digits }, (_, index) => index === 0 ? int(rng, 1, 9) : int(rng, 0, 9));
        const blankIndex = int(rng, 1, digits - 2);
        const candidates = [];
        for (let digit = 0; digit <= 9; digit += 1) {
          values[blankIndex] = digit;
          if (Number(values.join("")) % divisor === 0) candidates.push(digit);
        }
        if (!candidates.length) continue;
        values[blankIndex] = "□";
        const answer = candidates.reduce((total, digit) => total + digit, 0);
        return result(`${values.join("")}이 ${divisor}의 배수가 되도록 하는 □ 안의 숫자를 모두 더한 값을 구하세요.`, answer, `${divisor}의 배수 조건을 적용하여 가능한 숫자는 ${candidates.join(", ")}입니다. 이들의 합은 ${answer}입니다.`);
      }
      throw new Error("배수 판정법 조건을 만들지 못했습니다.");
    },
    threeNumberGcdLcmAdvanced({ rng, level }) {
      const common = pick(rng, [2, 3, 4, 5, 6].slice(0, 3 + level));
      const scales = level === 2 ? [6, 10, 15] : pick(rng, [[2, 3, 5], [3, 4, 5], [4, 5, 7], [6, 7, 10]]);
      const values = scales.map(scale => common * scale);
      const greatest = gcdMany(values);
      const least = lcmMany(values);
      return result(`세 수 ${values.join(", ")}의 최대공약수와 최소공배수를 차례로 구하세요.`, `${greatest}, ${least}`, `세 수에 공통으로 들어 있는 인수는 ${greatest}이고, 필요한 소인수의 가장 큰 지수를 모두 곱하면 최소공배수는 ${least}입니다. 따라서 ${greatest}, ${least}입니다.`);
    },
    divisorCountAdvanced({ rng, level, variant = 0 }) {
      const primes = level === 2 ? [2, 3, 5, 7] : [2, 3, 5];
      const factors = new Map(primes.map((prime, index) => [prime, int(rng, 1, 2 + Math.min(2, level + (index === 0 ? 1 : 0)))]));
      const value = factorMapProduct(factors);
      if (variant % 2 === 0) {
        const answer = [...factors.values()].reduce((total, power) => total * (power + 1), 1);
        return result(`${value.toLocaleString()}의 약수는 모두 몇 개인지 구하세요.`, answer, `${value.toLocaleString()} = ${factorMapText(factors)}입니다. 각 소인수의 지수에 0부터 해당 지수까지를 고를 수 있으므로 약수의 개수는 ${[...factors.values()].map(power => power + 1).join(" × ")} = ${answer}개입니다.`);
      }
      const answer = [...factors.values()].reduce((total, power) => total * (Math.floor(power / 2) + 1), 1);
      return result(`${value.toLocaleString()}의 약수 중 제곱수인 약수는 모두 몇 개인지 구하세요.`, answer, `제곱수인 약수는 각 소인수의 지수가 짝수여야 합니다. ${factorMapText(factors)}에서 가능한 짝수 지수의 선택 수를 곱하면 ${answer}개입니다.`);
    },
    commonDivisorApplicationAdvanced({ rng, level }) {
      const divisor = pick(rng, [7, 8, 9, 11, 12, 13, 15].slice(0, 4 + level));
      const remainders = [int(rng, 1, divisor - 3), int(rng, 1, divisor - 3), int(rng, 1, divisor - 3)];
      const scales = [5, 7, 9 + level * 2];
      const values = scales.map((scale, index) => divisor * scale + remainders[index]);
      return result(`세 수 ${values.join(", ")}을 어떤 자연수로 나누었더니 나머지가 차례로 ${remainders.join(", ")}이었습니다. 이 자연수로 가능한 수 중 가장 큰 수를 구하세요.`, divisor, `각 수에서 나머지를 빼면 ${values.map((value, index) => value - remainders[index]).join(", ")}입니다. 찾는 수는 이 세 수의 공약수이고, 최대공약수는 ${divisor}입니다.`);
    },
    commonMultipleApplicationAdvanced({ rng, level }) {
      const periods = level === 0 ? pick(rng, [[6, 8], [8, 10], [9, 12]]) : level === 1 ? pick(rng, [[12, 18], [14, 20], [15, 24]]) : pick(rng, [[18, 28], [24, 35], [30, 42]]);
      const [first, second] = periods;
      const base = lcm(first, second);
      const after = base * int(rng, 2, 5 + level) + int(rng, 1, base - 1);
      const answer = Math.ceil(after / base) * base;
      return result(`두 신호등은 지금 동시에 켜졌고, 첫째 신호등은 ${first}분마다, 둘째 신호등은 ${second}분마다 켜집니다. ${after}분 뒤 또는 그 이후 처음으로 동시에 켜지는 때는 몇 분 뒤인지 구하세요.`, answer, `두 신호등이 동시에 켜지는 간격은 ${first}과 ${second}의 최소공배수 ${base}분입니다. ${after}분 뒤 또는 그 이후 처음인 ${base}의 배수는 ${answer}입니다.`);
    },
    gcdLcmRelationAdvanced({ rng, level }) {
      const common = pick(rng, [3, 4, 5, 6, 8, 10].slice(0, 3 + level));
      const pairs = level === 2 ? [[7, 11], [8, 15], [9, 14], [11, 16]] : [[2, 5], [3, 7], [4, 9], [5, 8]];
      const [leftScale, rightScale] = pick(rng, pairs);
      const left = common * leftScale;
      const right = common * rightScale;
      const product = left * right;
      const least = lcm(left, right);
      return result(`서로 다른 두 자연수의 곱은 ${product.toLocaleString()}이고 최대공약수는 ${common}입니다. 이 두 수의 최소공배수를 구하세요.`, least, `두 자연수의 곱은 최대공약수와 최소공배수의 곱과 같습니다. 따라서 최소공배수는 ${product.toLocaleString()} ÷ ${common} = ${least.toLocaleString()}입니다.`);
    },
    ruleCorrespondenceAdvanced({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const multiplier = pick(rng, [2, 3, 4, 5].slice(0, 2 + level));
        const addend = int(rng, 4 + level * 2, 12 + level * 5);
        const first = int(rng, 4, 11 + level * 2);
        const inputs = [first, first + 2, first + 5];
        const target = first + int(rng, 8 + level * 2, 15 + level * 4);
        const outputs = inputs.map(value => multiplier * value + addend);
        const answer = multiplier * target + addend;
        return result(`어떤 수를 규칙 상자에 넣었더니 아래와 같이 바뀌었습니다. 규칙을 찾아 ${target}을 넣었을 때 나오는 수를 구하세요.<div class="rule-examples">${inputs.map((value, index) => `<span>${value} → ${outputs[index]}</span>`).join("")}</div>`, answer, `입력이 2씩 늘 때 출력이 ${multiplier * 2}씩 늘므로, 규칙은 ‘${multiplier}배한 뒤 ${addend}을 더하기’입니다. 따라서 ${target}을 넣으면 ${target} × ${multiplier} + ${addend} = ${answer}입니다.`);
      }
      if (variant % 3 === 1) {
        const shift = int(rng, 2, 3 + level);
        const word = pick(rng, ["MATH", "STAR", "CODE", "NOTE", "BOOK"]);
        const cipher = [...word].map(letter => String.fromCharCode((letter.charCodeAt(0) - 65 + shift) % 26 + 65)).join("");
        const first = String.fromCharCode(65 + shift);
        const second = String.fromCharCode(66 + shift);
        return result(`알파벳을 오른쪽으로 같은 칸 수만큼 옮겨 암호를 만듭니다. A → ${first}, B → ${second}, C → ${String.fromCharCode(67 + shift)}일 때, 암호문 ${cipher}를 알파벳을 왼쪽으로 되돌려 해독한 단어를 구하세요.`, word, `A가 ${first}이 되었으므로 각 알파벳을 오른쪽으로 ${shift}칸 옮긴 암호입니다. ${cipher}의 각 글자를 왼쪽으로 ${shift}칸 되돌리면 ${word}입니다.`);
      }
      const sides = [3, 4, 4, 5];
      const position = int(rng, 10 + level * 6, 24 + level * 12);
      const before = Array.from({ length: position - 1 }, (_, index) => sides[index % sides.length]).reduce((sum, value) => sum + value, 0);
      const sideCount = sides[(position - 1) % sides.length];
      const firstNumber = before + 1;
      const lastNumber = before + sideCount;
      const answer = sideCount * (firstNumber + lastNumber) / 2;
      return result(`정삼각형, 정사각형, 마름모, 정오각형을 이 순서대로 반복하여 놓고, 꼭짓점에 1부터 차례로 수를 씁니다. ${position}번째 도형의 꼭짓점에 쓰인 수의 합을 구하세요.<div class="rule-examples"><span>1번째: 3개</span><span>2번째: 4개</span><span>3번째: 4개</span><span>4번째: 5개</span></div>`, answer, `한 묶음의 꼭짓점 수는 3+4+4+5=16개입니다. ${position}번째 도형 앞까지 ${before}개의 수를 썼으므로, ${position}번째 ${sideCount}각형에는 ${firstNumber}부터 ${lastNumber}까지 씁니다. 합은 ${firstNumber}+…+${lastNumber}=${answer}입니다.`);
    },
    correspondenceTableAdvanced({ rng, level, variant = 0 }) {
      const multiplier = pick(rng, [2, 3, 4, 5].slice(0, 2 + level));
      const addend = int(rng, 3, 10 + level * 4);
      const first = int(rng, 3, 8 + level * 2);
      const inputs = [first, first + 2, first + 5];
      if (variant % 2 === 0) {
        const target = first + int(rng, 8 + level * 2, 16 + level * 3);
        const outputs = inputs.map(value => multiplier * value + addend);
        const answer = multiplier * target + addend;
        return result(`다음 대응표에서 ▲와 ■ 사이의 대응 관계를 찾아, ▲가 ${target}일 때 ■의 값을 구하세요.${correspondenceTable([["▲", ...inputs, target], ["■", ...outputs, "□"]])}`, answer, `▲가 ${inputs[0]}에서 ${inputs[1]}로 2만큼 늘 때 ■는 ${outputs[0]}에서 ${outputs[1]}로 ${multiplier * 2}만큼 늘어납니다. 따라서 ■ = ▲ × ${multiplier} + ${addend}입니다. ▲=${target}이면 ■=${target}×${multiplier}+${addend}=${answer}입니다.`);
      }
      const secondMultiplier = pick(rng, [2, 3, 4].slice(0, 2 + Math.min(level, 1)));
      const secondAddend = int(rng, 1, 6 + level * 3);
      const target = first + int(rng, 7 + level * 2, 14 + level * 3);
      const middle = inputs.map(value => multiplier * value + addend);
      const outputs = middle.map(value => secondMultiplier * value + secondAddend);
      const answer = secondMultiplier * (multiplier * target + addend) + secondAddend;
      return result(`다음 대응표에서 ●는 ▲에 먼저 대응하고, ★는 ●에 다시 대응합니다. 표의 규칙을 이용하여 ▲가 ${target}일 때 ★의 값을 구하세요.${correspondenceTable([["▲", ...inputs, target], ["●", ...middle, "□"], ["★", ...outputs, "□"]])}`, answer, `첫째 대응은 ●=▲×${multiplier}+${addend}, 둘째 대응은 ★=●×${secondMultiplier}+${secondAddend}입니다. ▲=${target}이면 ●=${target}×${multiplier}+${addend}=${multiplier * target + addend}, ★=${multiplier * target + addend}×${secondMultiplier}+${secondAddend}=${answer}입니다.`);
    },
    patternCorrespondenceApplicationOne({ rng, level, variant = 0 }) {
      if (variant % 2 === 0) {
        const lineCount = int(rng, 10 + level * 4, 18 + level * 9);
        const answer = lineCount * (lineCount + 1) / 2 + 1;
        return result(`직선들을 어느 세 직선도 한 점에서 만나지 않게 그리고, 서로 평행한 두 직선이 없게 그었습니다. 직선의 수와 나뉜 영역의 최대 개수 사이의 규칙을 이용하여, 직선을 ${lineCount}개 그었을 때 나뉜 영역의 최대 개수를 구하세요.${correspondenceTable([["직선의 수", 1, 2, 3, 4], ["영역의 최대 개수", 2, 4, 7, 11]])}`, answer, `새 직선이 늘어날 때마다 만나는 점의 수만큼 새 영역이 생깁니다. 따라서 n개일 때 영역 수는 1+(1+2+…+n)=n(n+1)÷2+1입니다. n=${lineCount}이면 ${lineCount}×${lineCount + 1}÷2+1=${answer}입니다.`);
      }
      const stage = int(rng, 12 + level * 5, 24 + level * 12);
      const answer = stage * (stage + 1) / 2;
      return result(`아래처럼 첫째 단계에는 1개, 둘째 단계에는 1+2개, 셋째 단계에는 1+2+3개의 정사각형 조각을 계단 모양으로 붙입니다. ${stage}번째 단계의 정사각형 조각 수를 구하세요.${correspondenceTable([["단계", 1, 2, 3, 4], ["조각 수", 1, 3, 6, 10]])}`, answer, `${stage}번째 단계는 1부터 ${stage}까지의 수를 모두 더한 것입니다. 1+2+…+${stage}=${stage}×${stage + 1}÷2=${answer}개입니다.`);
    },
    patternCorrespondenceApplicationTwo({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const spacing = pick(rng, [3, 4, 5, 6].slice(0, 2 + level));
        const half = int(rng, 20 + level * 8, 42 + level * 14);
        const first = int(rng, 2, Math.min(12 + level * 3, half - 2));
        const opposite = first + half;
        const total = half * 2;
        const answer = total * spacing;
        return result(`원 모양 호수 둘레에 ${spacing}m 간격으로 가로등을 세웠습니다. ${first}번째 가로등과 ${opposite}번째 가로등이 서로 마주 보고 있을 때, 호수 둘레의 길이를 구하세요.`, answer, `마주 보는 두 가로등 사이에는 전체 가로등의 절반이 있습니다. ${opposite}-${first}=${half}이므로 전체 가로등 수는 ${half}×2=${total}개입니다. 둘레는 ${total}×${spacing}=${answer}m입니다.`);
      }
      if (variant % 3 === 1) {
        const included = pick(rng, [180, 240, 300, 360].slice(0, 2 + level));
        const baseFee = pick(rng, [18000, 24000, 30000, 36000].slice(0, 2 + level));
        const rate = pick(rng, [2, 3, 4, 5].slice(0, 2 + level));
        const usage = included + int(rng, 180 + level * 90, 540 + level * 180);
        const answer = baseFee + (usage - included) * rate;
        return result(`한 달 통화 요금은 처음 ${included}분까지 ${baseFee.toLocaleString()}원이고, ${included}분을 넘기면 초과한 1분마다 ${rate}원씩 늘어납니다. 이번 달 통화 시간이 ${usage}분일 때 내야 할 요금을 구하세요.`, answer, `기본 요금은 ${baseFee.toLocaleString()}원이고 초과 시간은 ${usage}-${included}=${usage - included}분입니다. 초과 요금은 ${(usage - included).toLocaleString()}×${rate}=${((usage - included) * rate).toLocaleString()}원이므로 모두 ${answer.toLocaleString()}원입니다.`);
      }
      const [fastSpeed, slowSpeed] = pick(rng, level === 2 ? [[60, 45], [72, 54], [84, 63]] : [[36, 27], [45, 30], [54, 42]]);
      const hours = int(rng, 3 + level, 7 + level * 2);
      const remaining = (fastSpeed - slowSpeed) * hours;
      const answer = fastSpeed * hours;
      return result(`형은 한 시간에 ${fastSpeed}km, 동생은 한 시간에 ${slowSpeed}km를 같은 길로 걷습니다. 두 사람이 동시에 출발하여 형이 목적지에 도착했을 때 동생은 ${remaining}km를 더 가야 했습니다. 집에서 목적지까지의 거리를 구하세요.`, answer, `형과 동생의 한 시간 거리 차는 ${fastSpeed}-${slowSpeed}=${fastSpeed - slowSpeed}km입니다. ${remaining}km 차이가 났으므로 걸은 시간은 ${remaining}÷${fastSpeed - slowSpeed}=${hours}시간입니다. 목적지까지 거리는 ${fastSpeed}×${hours}=${answer}km입니다.`);
    },
    equalFractionAdvanced({ rng, level, variant = 0 }) {
      if (variant % 2 === 0) {
        for (let attempt = 0; attempt < 120; attempt += 1) {
          const numerator = int(rng, 14 + level * 5, 34 + level * 12);
          const denominator = numerator + int(rng, 16 + level * 5, 36 + level * 10);
          const add = int(rng, 3, 8 + level * 3);
          const subtract = int(rng, 2, Math.min(7 + level * 2, denominator - numerator - 1));
          const first = fraction(numerator + add, denominator);
          const second = fraction(numerator, denominator - subtract);
          const [r, s] = first.split("/").map(Number);
          const [u, v] = second.split("/").map(Number);
          if (r * v === u * s) continue;
          const answer = denominator - numerator;
          return result(`어떤 진분수의 분자에 ${add}을 더하면 ${first}와 크기가 같아지고, 분모에서 ${subtract}을 빼면 ${second}와 크기가 같아집니다. 처음 분수의 분모와 분자의 차를 구하세요.`, answer, `처음 분수를 a/b라 하면 (a+${add})/b=${first}, a/(b-${subtract})=${second}입니다. 두 등식을 만족하는 a=${numerator}, b=${denominator}이므로 분모와 분자의 차는 ${denominator}-${numerator}=${answer}입니다.`);
        }
      }
      const firstNumerator = int(rng, 8 + level * 3, 22 + level * 6);
      const denominatorStep = 3 + level;
      let firstDenominator = firstNumerator + int(rng, 22 + level * 5, 40 + level * 8);
      if (firstDenominator === firstNumerator * denominatorStep) firstDenominator += 1;
      const position = int(rng, 12 + level * 6, 28 + level * 12);
      const numeratorStep = 1;
      const targetNumerator = firstNumerator + (position - 1) * numeratorStep;
      const targetDenominator = firstDenominator + (position - 1) * denominatorStep;
      const target = fraction(targetNumerator, targetDenominator);
      const examples = Array.from({ length: 4 }, (_, index) => `${firstNumerator + index * numeratorStep}/${firstDenominator + index * denominatorStep}`);
      return result(`분자에는 1씩, 분모에는 ${denominatorStep}씩 더하여 분수를 나열합니다.<div class="sequence">${examples.join(", ")}, …</div>${target}와 크기가 같은 분수가 처음 나오는 것은 몇 번째인지 구하세요.`, position, `분자와 분모가 각각 일정하게 늘어나는 수열입니다. ${position}번째 분수는 (${firstNumerator}+${position - 1})/(${firstDenominator}+${denominatorStep}×${position - 1})=${targetNumerator}/${targetDenominator}=${target}이므로 답은 ${position}번째입니다.`);
    },
    irreducibleFractionAdvanced({ rng, level, variant = 0 }) {
      if (variant % 2 === 0) {
        const baseNumerator = pick(rng, [2, 3, 4, 5, 7].slice(0, 3 + level));
        const baseDenominator = pick(rng, [5, 7, 8, 9, 11, 13].slice(0, 4 + level));
        const limit = baseDenominator * int(rng, 18 + level * 7, 42 + level * 13);
        const answer = Math.floor((limit - 1) / baseDenominator);
        return result(`${baseNumerator}/${baseDenominator}와 크기가 같고 분모가 ${limit}보다 작은 분수는 모두 몇 개인지 구하세요.`, answer, `${baseNumerator}/${baseDenominator}와 같은 분수의 분모는 ${baseDenominator}, ${baseDenominator * 2}, ${baseDenominator * 3}, …입니다. ${limit}보다 작은 배수는 ${answer}개이므로 답은 ${answer}개입니다.`);
      }
      const denominator = pick(rng, level === 2 ? [84, 90, 96, 105, 120] : [36, 40, 45, 48, 54, 60]);
      const answer = eulerPhi(denominator);
      return result(`분모가 ${denominator}인 진분수 중 기약분수는 모두 몇 개인지 구하세요.`, answer, `분자가 1부터 ${denominator - 1}까지인 수 중 ${denominator}와 공약수가 1인 수를 세면 됩니다. 그런 수는 모두 ${answer}개입니다.`);
    },
    commonDenominatorCompareAdvanced({ rng, level, variant = 0 }) {
      const denominators = level === 2 ? [28, 33, 35, 39, 44, 45] : [12, 14, 15, 18, 20, 21];
      const candidates = [];
      while (candidates.length < 3) {
        const denominator = pick(rng, denominators);
        const numerator = int(rng, 2, denominator - 2);
        if (candidates.some(item => item.numerator * denominator === numerator * item.denominator)) continue;
        candidates.push({ numerator, denominator });
      }
      const labels = ["가", "나", "다"];
      const sorted = candidates.map((item, index) => ({ ...item, label: labels[index] })).sort((left, right) => right.numerator * left.denominator - left.numerator * right.denominator);
      const answer = sorted.map(item => item.label).join(", ");
      const text = candidates.map((item, index) => `${labels[index]}: ${item.numerator}/${item.denominator}`).join(", ");
      return result(`다음 세 분수를 큰 수부터 차례로 나열하세요.<div class="equation comparison">${text}</div>`, answer, `분모의 최소공배수로 통분하거나 교차곱하여 비교합니다. 큰 순서는 ${sorted.map(item => `${item.label}(${item.numerator}/${item.denominator})`).join(" > ")}이므로 답은 ${answer}입니다.`);
    },
    conditionalFractionAdvanced({ rng, level, variant = 0 }) {
      if (variant % 2 === 0) {
        const numerator = pick(rng, [13, 17, 19, 23, 29].slice(0, 3 + level));
        const lower = pick(rng, [[2, 5], [3, 7], [4, 9]].slice(0, 2 + level));
        const upper = pick(rng, [[3, 5], [5, 8], [7, 10]].slice(0, 2 + level));
        const [lowerN, lowerD] = lower;
        const [upperN, upperD] = upper;
        const candidates = [];
        const maxDenominator = Math.ceil(numerator * lowerD / lowerN);
        for (let denominator = numerator + 1; denominator <= maxDenominator; denominator += 1) {
          if (!(lowerN * denominator < numerator * lowerD && numerator * upperD < upperN * denominator)) continue;
          if (gcd(numerator, denominator) === 1) candidates.push(denominator);
        }
        return result(`분자가 ${numerator}인 기약분수 중 ${lowerN}/${lowerD}보다 크고 ${upperN}/${upperD}보다 작은 분수는 모두 몇 개인지 구하세요.`, candidates.length, `분모 d에 대하여 ${lowerN}/${lowerD}<${numerator}/d<${upperN}/${upperD}를 만족하는 정수를 찾고, ${numerator}과 서로소인 분모만 고릅니다. 조건을 만족하는 분모는 ${candidates.join(", ")}이므로 모두 ${candidates.length}개입니다.`);
      }
      const numerator = pick(rng, [11, 13, 17, 19, 23].slice(0, 3 + level));
      const target = pick(rng, [[3, 7], [4, 9], [5, 11], [7, 13]].slice(0, 2 + level));
      const [targetN, targetD] = target;
      const candidates = [];
      for (let denominator = numerator + 1; denominator <= 120 + level * 40; denominator += 1) {
        if (gcd(numerator, denominator) !== 1) continue;
        candidates.push({ denominator, gap: Math.abs(numerator * targetD - targetN * denominator), scale: denominator * targetD });
      }
      candidates.sort((left, right) => left.gap * right.scale - right.gap * left.scale || left.denominator - right.denominator);
      const answer = `${numerator}/${candidates[0].denominator}`;
      return result(`분자가 ${numerator}이고 분모가 ${120 + level * 40} 이하인 기약분수 중 ${targetN}/${targetD}에 가장 가까운 분수를 구하세요.`, answer, `${targetN}/${targetD}와의 차는 |${numerator}×${targetD}-${targetN}×d|/(${targetD}×d)로 비교합니다. 조건에 맞는 분모 중 가장 가까운 것은 ${candidates[0].denominator}이므로 답은 ${answer}입니다.`);
    },
    fifthFractionAdditionAdvanced({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const pairs = level === 2 ? [[8, 15], [9, 14], [10, 21], [12, 25]] : [[6, 8], [8, 12], [9, 12], [10, 15]];
        const [firstDenominator, secondDenominator] = pick(rng, pairs);
        const first = rationalValue(firstDenominator * int(rng, 2 + level, 5 + level * 2) + int(rng, 1, firstDenominator - 1), firstDenominator);
        const second = rationalValue(secondDenominator * int(rng, 1 + level, 4 + level * 2) + int(rng, 1, secondDenominator - 1), secondDenominator);
        const total = rationalOperation(first, second, "+");
        const equation = fractionEquation("add", [first, second], total, `${mixedFraction(first.numerator, first.denominator)} + ${mixedFraction(second.numerator, second.denominator)} = □`);
        return result(`다음 계산을 하세요.${equation}`, mixedFraction(total.numerator, total.denominator), `분모의 최소공배수로 통분한 뒤 분자를 더합니다. ${mixedFraction(first.numerator, first.denominator)} + ${mixedFraction(second.numerator, second.denominator)} = ${mixedFraction(total.numerator, total.denominator)}입니다.`);
      }
      if (variant % 3 === 1) {
        const start = 2 + Math.min(level, 1);
        const count = 5 + level;
        const terms = Array.from({ length: count }, (_, index) => rationalValue(start - 1 + index, start + index));
        const total = terms.reduce((sum, term) => rationalOperation(sum, term, "+"), rationalValue(0));
        const equation = fractionEquation("series-add", terms, total, `${terms.map(term => fraction(term.numerator, term.denominator)).join(" + ")} = □`);
        return result(`다음 규칙으로 나열한 분수의 합을 구하세요.${equation}`, mixedFraction(total.numerator, total.denominator), `각 항을 통분하여 더하면 ${mixedFraction(total.numerator, total.denominator)}입니다.`);
      }
      const digits = level === 2 ? [1, 3, 5, 7, 8, 9] : [2, 3, 4, 6, 7, 9];
      const candidates = permutationNumbers(digits).map(value => Math.floor(value / 1000) + value % 1000);
      const answer = Math.max(...candidates);
      const equation = answerEquation("card-max-add", answer, `${digits.map(value => `<span class="digit-card">${value}</span>`).join("")}에서 카드를 한 번씩 사용하여 세 자리 수 2개를 만들 때, 두 수의 합이 가장 크게 되도록 하세요.`);
      return result(`6장의 수 카드를 한 번씩 모두 사용하여 세 자리 자연수 2개를 만들었습니다. 두 수의 합이 가장 크게 될 때의 합을 구하세요.${equation}`, answer, `합을 크게 하려면 큰 숫자를 백의 자리에 놓고, 그다음 큰 숫자를 십의 자리에 놓습니다. 가능한 배치를 비교한 최댓값은 ${answer}입니다.`);
    },
    fifthFractionSubtractionAdvanced({ rng, level, variant = 0 }) {
      if (variant % 3 === 1) {
        const cards = level === 2 ? [[7, 9], [5, 6], [3, 4], [5, 8]] : [[5, 6], [3, 4], [4, 7], [2, 3]];
        const candidates = [];
        for (let a = 0; a < cards.length; a += 1) for (let b = 0; b < cards.length; b += 1) for (let c = 0; c < cards.length; c += 1) {
          if (a === b || a === c || b === c) continue;
          const value = rationalOperation(rationalOperation(rationalValue(cards[a][0], cards[a][1]), rationalValue(cards[b][0], cards[b][1]), "+"), rationalValue(cards[c][0], cards[c][1]), "-");
          if (value) candidates.push(value);
        }
        candidates.sort((left, right) => right.numerator * left.denominator - left.numerator * right.denominator);
        const answer = candidates[0];
        const equation = answerEquation("card-max-subtract", fraction(answer.numerator, answer.denominator), `${cards.map(([numerator, denominator]) => `${numerator}/${denominator}`).join(", ")} 중 세 장을 골라 □ + □ - □가 가장 크게 되도록 하세요.`);
        return result(`다음 분수 중 세 개를 골라 빈칸에 넣고, 계산 결과가 가장 크게 되도록 하세요.${equation}`, fraction(answer.numerator, answer.denominator), `더하는 두 분수는 크게, 빼는 분수는 작게 고르는 모든 순서를 비교하면 최댓값은 ${fraction(answer.numerator, answer.denominator)}입니다.`);
      }
      const pairs = level === 2 ? [[8, 15], [9, 14], [10, 21], [12, 25]] : [[6, 8], [8, 12], [9, 12], [10, 15]];
      const [firstDenominator, secondDenominator] = pick(rng, pairs);
      for (let attempt = 0; attempt < 80; attempt += 1) {
        const first = rationalValue(firstDenominator * int(rng, 4 + level, 8 + level * 2) + int(rng, 1, firstDenominator - 1), firstDenominator);
        const second = rationalValue(secondDenominator * int(rng, 1 + level, 4 + level) + int(rng, 1, secondDenominator - 1), secondDenominator);
        const difference = rationalOperation(first, second, "-");
        if (!difference || difference.numerator <= 0) continue;
        if (variant % 3 === 0) {
          const equation = fractionEquation("subtract", [first, second], difference, `${mixedFraction(first.numerator, first.denominator)} - ${mixedFraction(second.numerator, second.denominator)} = □`);
          return result(`다음 계산을 하세요.${equation}`, mixedFraction(difference.numerator, difference.denominator), `분모의 최소공배수로 통분한 뒤 분자를 뺍니다. ${mixedFraction(first.numerator, first.denominator)} - ${mixedFraction(second.numerator, second.denominator)} = ${mixedFraction(difference.numerator, difference.denominator)}입니다.`);
        }
        if (variant % 3 === 1) {
          const equation = fractionEquation("subtract-blank", [first, second], first, `□ - ${mixedFraction(second.numerator, second.denominator)} = ${mixedFraction(difference.numerator, difference.denominator)}`);
          return result(`빈칸에 알맞은 수를 구하세요.${equation}`, mixedFraction(first.numerator, first.denominator), `차에 빼는 수를 더하면 처음 수가 됩니다. ${mixedFraction(difference.numerator, difference.denominator)} + ${mixedFraction(second.numerator, second.denominator)} = ${mixedFraction(first.numerator, first.denominator)}입니다.`);
        }
        const extra = rationalValue(int(rng, 1, 3 + level), 2 + int(rng, 2, 5 + level));
        const final = rationalOperation(difference, extra, "-");
        if (!final || final.numerator <= 0) continue;
        const equation = fractionEquation("subtract-word", [first, second, extra], final, `${mixedFraction(first.numerator, first.denominator)} - ${mixedFraction(second.numerator, second.denominator)} - ${mixedFraction(extra.numerator, extra.denominator)} = □`);
        return result(`전체 ${mixedFraction(first.numerator, first.denominator)}L에서 ${mixedFraction(second.numerator, second.denominator)}L를 사용하고, 다시 ${mixedFraction(extra.numerator, extra.denominator)}L를 사용했습니다. 남은 양을 구하세요.${equation}`, mixedFraction(final.numerator, final.denominator), `사용한 양을 차례로 빼면 ${mixedFraction(first.numerator, first.denominator)} - ${mixedFraction(second.numerator, second.denominator)} - ${mixedFraction(extra.numerator, extra.denominator)} = ${mixedFraction(final.numerator, final.denominator)}L입니다.`);
      }
      throw new Error("양수인 분수 뺄셈 조건을 만들지 못했습니다.");
    },
    fifthFractionEquationAdvanced({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const denominator = level === 2 ? 20 : 15;
        const offsets = [8, 1, 6, 3, 5, 7, 4, 9, 2];
        const values = offsets.map(offset => rationalValue(offset, denominator));
        const blanks = [0, 8];
        const cells = values.map((value, index) => blanks.includes(index) ? "□" : fraction(value.numerator, value.denominator));
        const table = `<table class="problem-table fraction-magic"><tbody>${[0, 1, 2].map(row => `<tr>${cells.slice(row * 3, row * 3 + 3).map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
        const answer = `${fraction(values[blanks[0]].numerator, values[blanks[0]].denominator)}, ${fraction(values[blanks[1]].numerator, values[blanks[1]].denominator)}`;
        const equation = answerEquation("magic-square", answer, table);
        return result(`다음 9개의 분수를 한 번씩 사용하여 가로, 세로, 대각선의 세 수의 합이 모두 같도록 할 때, 빈칸에 알맞은 수를 각각 구하세요.${equation}<div class="sequence">${values.map(value => fraction(value.numerator, value.denominator)).join(", ")}</div>`, answer, `가운데 수는 ${fraction(values[4].numerator, values[4].denominator)}이고 각 줄의 합을 정한 뒤, 주어진 두 칸과 같은 줄·열·대각선의 합을 비교하면 빈칸은 ${answer}입니다.`);
      }
      if (variant % 3 === 1) {
        const soccer = 18 + level * 9 + int(rng, 0, 2) * 9;
        const basketball = 24 + level * 6 + int(rng, 0, 2) * 6;
        const total = soccer + basketball;
        const condition = rationalOperation(rationalValue(basketball, 2), rationalValue(soccer * 5, 9), "+");
        const answer = `${basketball}명, ${soccer}명`;
        const equation = answerEquation("club-system", answer, `농구부 + 축구부 = ${total}, 농구부의 1/2 + 축구부의 5/9 = ${fraction(condition.numerator, condition.denominator)}`);
        return result(`어느 초등학교의 농구부와 축구부 인원을 더하면 모두 ${total}명입니다. 농구부 인원의 1/2과 축구부 인원의 5/9의 합이 ${fraction(condition.numerator, condition.denominator)}명일 때, 농구부와 축구부 인원을 각각 구하세요.${equation}`, answer, `농구부를 b명, 축구부를 s명이라 하면 b+s=${total}, b/2+5s/9=${fraction(condition.numerator, condition.denominator)}입니다. 두 식을 풀면 농구부 ${basketball}명, 축구부 ${soccer}명입니다.`);
      }
      for (let attempt = 0; attempt < 160; attempt += 1) {
        const a = int(rng, 2, 6);
        const b = int(rng, a + 1, 9);
        const c = int(rng, 2, 6);
        const d = int(rng, c + 1, 9);
        if (a === c && b === d) continue;
        const first = rationalValue(a, b);
        const second = rationalValue(c, d);
        const swappedFirst = rationalValue(b, a);
        const swappedSecond = rationalValue(d, c);
        const leftSum = rationalOperation(swappedFirst, second, "+");
        const rightSum = rationalOperation(first, swappedSecond, "+");
        const difference = rationalOperation(first, second, "-");
        const answer = difference.numerator >= 0 ? difference : rationalValue(-difference.numerator, difference.denominator);
        const equation = answerEquation("swap-equation", fraction(answer.numerator, answer.denominator), `${b}/${a} + ${c}/${d} = ${fraction(leftSum.numerator, leftSum.denominator)}, ${a}/${b} + ${d}/${c} = ${fraction(rightSum.numerator, rightSum.denominator)}`);
        return result(`두 진분수 A, B가 있습니다. A의 분자와 분모를 바꾼 수에 B를 더하면 ${fraction(leftSum.numerator, leftSum.denominator)}가 되고, B의 분자와 분모를 바꾼 수에 A를 더하면 ${fraction(rightSum.numerator, rightSum.denominator)}가 됩니다. A와 B의 차를 구하세요.${equation}`, fraction(answer.numerator, answer.denominator), `조건을 식으로 나타내어 A=${a}/${b}, B=${c}/${d}를 대입하면 차는 ${fraction(answer.numerator, answer.denominator)}입니다.`);
      }
      throw new Error("분수 식 세우기 조건을 만들지 못했습니다.");
    },
    unitPartialFractionAdvanced({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        for (let attempt = 0; attempt < 240; attempt += 1) {
          const a = int(rng, 3, 8);
          const b = int(rng, a + 2, 24);
          const c = int(rng, b + 2, 80);
          const target = rationalOperation(rationalOperation(rationalValue(1, a), rationalValue(1, b), "+"), rationalValue(1, c), "+");
          const candidates = [];
          for (let first = 2; first <= 10; first += 1) for (let second = first + 1; second <= 30; second += 1) for (let third = second + 1; third <= 80; third += 1) {
            const value = rationalOperation(rationalOperation(rationalValue(1, first), rationalValue(1, second), "+"), rationalValue(1, third), "+");
            if (value.numerator === target.numerator && value.denominator === target.denominator) candidates.push([first, second, third]);
          }
          if (candidates.length !== 1) continue;
          const answer = candidates[0].join(", ");
          const equation = answerEquation("unit-three", answer, `${fraction(target.numerator, target.denominator)} = 1/A + 1/B + 1/C, A < B < C, A ≤ 10, B ≤ 30, C ≤ 80`);
          return result(`${fraction(target.numerator, target.denominator)}를 서로 다른 세 단위분수의 합으로 나타내어라. ${equation}`, answer, `A<B<C 조건에서 가능한 분모를 모두 조사하면 A=${answer.split(", ")[0]}, B=${answer.split(", ")[1]}, C=${answer.split(", ")[2]}만 남습니다.`);
        }
        throw new Error("유일한 세 단위분수 분해를 만들지 못했습니다.");
      }
      if (variant % 3 === 1) {
        const count = 4 + level;
        const terms = Array.from({ length: count }, (_, index) => {
          const n = index + 2;
          return rationalValue(1, (2 * n - 1) * (2 * n + 1));
        });
        const total = terms.reduce((sum, term) => rationalOperation(sum, term, "+"), rationalValue(0));
        const equation = fractionEquation("unit-series", terms, total, `${terms.map(term => fraction(term.numerator, term.denominator)).join(" + ")} = □`);
        return result(`다음 단위분수의 합을 계산하세요.${equation}`, fraction(total.numerator, total.denominator), `각 항을 1/2×(1/(2n-1)-1/(2n+1))으로 바꾸면 중간 항이 지워져 ${fraction(total.numerator, total.denominator)}가 됩니다.`);
      }
      for (let attempt = 0; attempt < 240; attempt += 1) {
        const a = int(rng, 3, 12);
        const b = int(rng, 2, a - 1);
        const target = rationalOperation(rationalOperation(rationalValue(1, a), rationalValue(1, b), "+"), rationalValue(1, 15), "+");
        const candidates = [];
        for (let first = 2; first < 50; first += 1) for (let second = first - 1; second >= 2; second -= 1) {
          const value = rationalOperation(rationalOperation(rationalValue(1, first), rationalValue(1, second), "+"), rationalValue(1, 15), "+");
          if (value.numerator === target.numerator && value.denominator === target.denominator) candidates.push([first, second]);
        }
        if (candidates.length !== 1) continue;
        const answer = candidates[0].join(", ");
        const equation = answerEquation("unit-two-solve", answer, `${fraction(target.numerator, target.denominator)} = 1/A + 1/B + 1/15, A > B`);
        return result(`${fraction(target.numerator, target.denominator)} = 1/A + 1/B + 1/15를 만족하는 자연수 A, B를 각각 구하세요. ${equation}`, answer, `A>B, A<50 조건에서 분모를 대입해 확인하면 A=${answer.split(", ")[0]}, B=${answer.split(", ")[1]}입니다.`);
      }
      throw new Error("유일한 두 단위분수 방정식을 만들지 못했습니다.");
    },
    advancedPolygonPerimeter({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const width = int(rng, 22 + level * 4, 34 + level * 8);
        const height = int(rng, 14 + level * 3, 24 + level * 5);
        const topDepth = int(rng, 3 + level, Math.max(4 + level, Math.floor(height / 3)));
        const bottomDepth = level === 0 ? 0 : int(rng, 2 + level, Math.max(3 + level, Math.floor(height / 4)));
        const answer = 2 * (width + height) + 2 * (topDepth + bottomDepth);
        return result(`그림의 모든 각은 직각입니다. 표시되지 않은 변의 길이는 가로·세로 길이의 합이 서로 같다는 성질을 이용하여 구할 수 있습니다. 도형의 둘레를 구하세요.${rectilinearPerimeterSvg({ width, height, topDepth, bottomDepth, expected: answer })}`, answer, `홈이 없다고 생각한 직사각형의 둘레는 2×(${width}+${height})=${2 * (width + height)}cm입니다. 홈 하나가 생길 때마다 둘레는 그 깊이의 2배만큼 늘어나므로 ${2 * (width + height)}+2×(${topDepth}+${bottomDepth})=${answer}cm입니다.`);
      }
      if (variant % 3 === 1) {
        const count = 4 + level;
        const height = int(rng, 4 + level, 7 + level * 2);
        const widths = Array.from({ length: count }, () => int(rng, 3 + level, 8 + level * 2));
        const width = widths.reduce((sum, value) => sum + value, 0);
        const originalPerimeter = 2 * (width + height);
        const piecePerimeters = widths.map(value => 2 * (value + height));
        const labels = ["가", "나", "다", "라", "마", "바"].slice(0, count);
        const answer = width - height;
        const table = correspondenceTable([["조각", ...labels], ["둘레(cm)", ...piecePerimeters]]);
        return result(`가로로 긴 직사각형을 세로로 잘라 ${count}개의 직사각형으로 만들었습니다. 자르기 전 둘레는 ${originalPerimeter}cm이고, 각 조각의 둘레는 표와 같습니다. 자르기 전 직사각형의 가로와 세로의 길이의 차를 구하세요.${cutStripSvg({ widths, height, expected: answer })}${table}`, answer, `각 조각의 둘레의 합에서 자르기 전 둘레를 빼면 새로 생긴 세로 선분 ${2 * (count - 1)}개의 길이입니다. (${piecePerimeters.join("+")})-${originalPerimeter}=${2 * (count - 1) * height}이므로 세로는 ${height}cm, 가로는 ${width}cm입니다. 차는 ${answer}cm입니다.`);
      }
      const count = 4 + level;
      const answer = maximumSquareSequencePerimeter(count);
      return result(`한 변의 길이가 각각 1cm, 2cm, …, ${count}cm인 정사각형 ${count}개를 밑변이 한 직선 위에 놓이도록 빈틈없이 이어 붙입니다. 붙이는 순서를 바꿀 수 있을 때, 만들 수 있는 도형의 둘레 중 가장 긴 것은 몇 cm입니까?${squareSequenceSvg({ count, expected: answer })}`, answer, `모든 순서를 조사합니다. 한 순서 a₁,…,aₙ의 둘레는 위아래 변 2×(1+…+${count})에 양 끝 높이와 이웃한 높이 차를 더한 값입니다. 가능한 순서 중 최댓값은 ${answer}cm입니다.`);
    },
    rectangleRightTriangleAreaAdvanced({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const x1 = int(rng, 3 + level, 7 + level * 2);
        const x2 = int(rng, 4 + level, 9 + level * 2);
        const y1 = int(rng, 2 + level, 6 + level * 2);
        const y2 = int(rng, 4 + level, 10 + level * 2);
        const answer = x1 * y2;
        return result(`직사각형을 가로와 세로에 평행한 두 선분으로 나누었습니다. 표시된 세 부분의 넓이를 이용하여 □ 부분의 넓이를 구하세요.${partitionAreaSvg({ x1, x2, y1, y2, expected: answer })}`, answer, `위의 두 부분은 높이가 같으므로 가로의 비는 ${x1 * y1}:${x2 * y1}=${x1}:${x2}입니다. 아래도 같은 가로의 비이므로 □:${x2 * y2}=${x1}:${x2}이고, □=${answer}cm²입니다.`);
      }
      if (variant % 3 === 1) {
        const ratios = level === 0 ? [[3, 2]] : level === 1 ? [[3, 2], [4, 3]] : [[3, 2], [4, 3], [5, 4]];
        const [numerator, denominator] = pick(rng, ratios);
        const factor = int(rng, 8 + level * 3, 18 + level * 6);
        const originalArea = factor * denominator * denominator;
        const answer = factor * numerator * numerator;
        return result(`넓이가 ${originalArea}cm²인 직사각형의 가로와 세로에 해당하는 두 길이를 각각 ${numerator}/${denominator}배로 늘여 평행사변형을 만들었습니다. 새 평행사변형의 넓이를 구하세요.${scaledAreaSvg({ originalArea, numerator, denominator, expected: answer })}`, answer, `밑변과 높이가 각각 ${numerator}/${denominator}배가 되므로 넓이는 (${numerator}/${denominator})²배입니다. ${originalArea}×${numerator * numerator}/${denominator * denominator}=${answer}cm²입니다.`);
      }
      const width = int(rng, 18 + level * 4, 28 + level * 7);
      const height = int(rng, 14 + level * 3, 22 + level * 5);
      const firstWidth = int(rng, 3 + level, Math.floor(width / 3));
      const firstHeight = int(rng, 3 + level, Math.floor(height / 3));
      const secondWidth = int(rng, 3 + level, Math.floor(width / 3));
      const secondHeight = int(rng, 2 + level, Math.floor(height / 3));
      const answer = width * height - firstWidth * firstHeight - secondWidth * secondHeight;
      return result(`가로 ${width}cm, 세로 ${height}cm인 직사각형에서 그림의 두 흰 직사각형을 잘라 냈습니다. 남은 색칠한 부분의 넓이를 구하세요.${cutoutAreaSvg({ width, height, firstWidth, firstHeight, secondWidth, secondHeight, expected: answer })}`, answer, `전체 넓이에서 잘라 낸 두 부분을 뺍니다. ${width}×${height}-${firstWidth}×${firstHeight}-${secondWidth}×${secondHeight}=${answer}cm²입니다.`);
    },
    perimeterAreaSquareCompositionAdvanced({ rng, level, variant = 0 }) {
      const selected = polyominoCases[level];
      const side = int(rng, 2 + level, 5 + level * 2);
      if (variant % 3 === 0) {
        const area = selected.a.length * side * side;
        const answer = polyominoBoundary(selected.a) * side;
        return result(`크기가 같은 정사각형으로 만든 도형의 넓이가 ${area}cm²입니다. 도형의 둘레를 구하세요.${polyominoSvg({ cells: selected.a, side, expected: answer, kind: "poly-area-to-perimeter", lead: `전체 넓이 ${area}cm²` })}`, answer, `정사각형 한 개의 넓이는 ${area}÷${selected.a.length}=${side * side}cm²이므로 한 변은 ${side}cm입니다. 바깥쪽 변은 ${polyominoBoundary(selected.a)}개이므로 둘레는 ${polyominoBoundary(selected.a)}×${side}=${answer}cm입니다.`);
      }
      if (variant % 3 === 1) {
        const perimeter = polyominoBoundary(selected.b) * side;
        const answer = selected.b.length * side * side;
        return result(`크기가 같은 정사각형으로 만든 도형의 둘레가 ${perimeter}cm입니다. 도형의 넓이를 구하세요.${polyominoSvg({ cells: selected.b, side, expected: answer, kind: "poly-perimeter-to-area", lead: `전체 둘레 ${perimeter}cm` })}`, answer, `바깥쪽 변이 ${polyominoBoundary(selected.b)}개이므로 정사각형 한 변은 ${perimeter}÷${polyominoBoundary(selected.b)}=${side}cm입니다. 정사각형 ${selected.b.length}개의 넓이는 ${selected.b.length}×${side}²=${answer}cm²입니다.`);
      }
      const areaA = selected.a.length * side * side;
      const answer = polyominoBoundary(selected.b) * side;
      return result(`도형 가와 나는 크기가 같은 정사각형으로 만들었습니다. 도형 가의 넓이가 ${areaA}cm²일 때, 도형 나의 둘레를 구하세요.${polyominoPairSvg({ cellsA: selected.a, cellsB: selected.b, side, expected: answer, areaA })}`, answer, `도형 가는 정사각형 ${selected.a.length}개이므로 한 정사각형의 넓이는 ${side * side}cm², 한 변은 ${side}cm입니다. 도형 나의 바깥쪽 변 ${polyominoBoundary(selected.b)}개를 세면 둘레는 ${answer}cm입니다.`);
    },
    quadrilateralAreaAdvanced({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const height = int(rng, 4 + level, 7 + level * 2);
        const base = int(rng, 9 + level * 2, 15 + level * 4);
        const trapezoidTop = int(rng, 4 + level, base - 1);
        const trapezoidBottom = 2 * base - trapezoidTop;
        const answer = base;
        return result(`그림의 평행사변형, 사다리꼴, 마름모의 넓이는 모두 같습니다. 마름모의 가로 대각선 길이를 구하세요.${equalQuadrilateralAreaSvg({ base, height, trapezoidTop, trapezoidBottom, expected: answer })}`, answer, `평행사변형의 넓이는 ${base}×${height}=${base * height}cm²입니다. 마름모의 세로 대각선은 ${2 * height}cm이므로 가로 대각선을 □라 하면 ${2 * height}×□÷2=${base * height}입니다. □=${answer}cm입니다.`);
      }
      if (variant % 3 === 1) {
        const halfPerimeter = int(rng, 15 + level * 4, 25 + level * 7);
        const shorter = Math.floor(halfPerimeter / 2);
        const longer = halfPerimeter - shorter;
        const answer = shorter * longer;
        return result(`가로와 세로가 자연수이고 둘레가 ${2 * halfPerimeter}cm인 직사각형 중 넓이가 가장 큰 직사각형의 넓이를 구하세요.${maximumRectangleSvg({ halfPerimeter, expected: answer })}`, answer, `가로+세로=${halfPerimeter}이고 두 수의 차가 가장 작을 때 곱이 가장 큽니다. ${shorter}×${longer}=${answer}cm²입니다.`);
      }
      const ratioChoices = level === 0 ? [[1, 4], [1, 3]] : level === 1 ? [[1, 4], [1, 3], [3, 8]] : [[1, 3], [3, 8], [2, 5]];
      const [numerator, denominator] = pick(rng, ratioChoices);
      const base = denominator * int(rng, 2 + level, 4 + level * 2);
      const height = int(rng, 6 + level * 2, 12 + level * 3);
      const distance = 2 * base * numerator / denominator;
      const speedChoices = allDivisors(distance).filter(value => value <= 6 + level * 2);
      const speed = pick(rng, speedChoices);
      const answer = distance / speed;
      return result(`점 P가 평행사변형의 밑변 위에서 D를 출발하여 C 쪽으로 초당 ${speed}cm씩 움직입니다. 삼각형 ADP의 넓이가 평행사변형 넓이의 ${numerator}/${denominator}이 되는 것은 출발한 지 몇 초 후입니까?${movingPointSvg({ base, height, numerator, denominator, speed, expected: answer })}`, answer, `DP를 xcm라 하면 삼각형 ADP와 평행사변형의 높이는 같습니다. 넓이의 비는 (x×높이÷2):(${base}×높이)=x:${2 * base}입니다. x=${distance}cm이므로 ${distance}÷${speed}=${answer}초 후입니다.`);
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
    [type => type.id === "4-2-u2-t4", "equilateralTriangle"],
    [type => type.id === "4-2-u3-t1", "decimalUnderstanding"],
    [type => type.id === "4-2-u3-t2", "decimalAddSubAdvanced"],
    [type => type.id === "4-2-u3-t3", "decimalApplication"],
    [type => type.id === "4-2-u3-t4", "conditionedDecimal"],
    [type => type.id === "4-2-u4-t1", "quadPerpParallelDistance"],
    [type => type.id === "4-2-u4-t2", "quadParallelAngleCondition"],
    [type => type.id === "4-2-u4-t3", "quadAngleChainOne"],
    [type => type.id === "4-2-u4-t4", "quadAngleChainTwo"],
    [type => type.id === "4-2-u4-t5", "quadPropertyRelations"],
    [type => type.id === "4-2-u4-t6", "quadPropertyApplication"],
    [type => type.id === "4-2-u4-t7", "quadSquareSpecial"],
    [type => type.id === "4-2-u4-t8", "quadRectangleCount"],
    [type => type.id === "4-2-u5-t1", "lineGraphUnderstanding"],
    [type => type.id === "4-2-u5-t2", "lineGraphApplication"],
    [type => type.id === "4-2-u6-t1", "polygonDiagonals"],
    [type => type.id === "4-2-u6-t2", "regularPolygonApplication"],
    [type => type.id === "4-2-u6-t3", "tessellationCover"],
    [type => type.id === "4-2-u6-t4", "shapePartitionCompose"],
    [type => type.id === "5-1-u1-t1", "mixedOrderAdvanced"],
    [type => type.id === "5-1-u1-t2", "oneExpressionAdvanced"],
    [type => type.id === "5-1-u1-t3", "mixedWordEquationAdvanced"],
    [type => type.id === "5-1-u1-t4", "mixedExpressionBuildAdvanced"],
    [type => type.id === "5-1-u2-t1", "factorMultipleAdvanced"],
    [type => type.id === "5-1-u2-t2", "primeFactorBasicAdvanced"],
    [type => type.id === "5-1-u2-t3", "primeFactorPowerAdvanced"],
    [type => type.id === "5-1-u2-t4", "primeFactorApplicationAdvanced"],
    [type => type.id === "5-1-u2-t5", "commonDivisorAdvanced"],
    [type => type.id === "5-1-u2-t6", "commonMultipleAdvanced"],
    [type => type.id === "5-1-u2-t7", "divisibilityRuleAdvanced"],
    [type => type.id === "5-1-u2-t8", "threeNumberGcdLcmAdvanced"],
    [type => type.id === "5-1-u2-t9", "divisorCountAdvanced"],
    [type => type.id === "5-1-u2-t10", "commonDivisorApplicationAdvanced"],
    [type => type.id === "5-1-u2-t11", "commonMultipleApplicationAdvanced"],
    [type => type.id === "5-1-u2-t12", "gcdLcmRelationAdvanced"],
    [type => type.id === "5-1-u3-t1", "ruleCorrespondenceAdvanced"],
    [type => type.id === "5-1-u3-t2", "correspondenceTableAdvanced"],
    [type => type.id === "5-1-u3-t3", "patternCorrespondenceApplicationOne"],
    [type => type.id === "5-1-u3-t4", "patternCorrespondenceApplicationTwo"],
    [type => type.id === "5-1-u4-t1", "equalFractionAdvanced"],
    [type => type.id === "5-1-u4-t2", "irreducibleFractionAdvanced"],
    [type => type.id === "5-1-u4-t3", "commonDenominatorCompareAdvanced"],
    [type => type.id === "5-1-u4-t4", "conditionalFractionAdvanced"],
    [type => type.id === "5-1-u5-t1", "fifthFractionAdditionAdvanced"],
    [type => type.id === "5-1-u5-t2", "fifthFractionSubtractionAdvanced"],
    [type => type.id === "5-1-u5-t3", "fifthFractionEquationAdvanced"],
    [type => type.id === "5-1-u5-t4", "unitPartialFractionAdvanced"],
    [type => type.id === "5-1-u6-t1", "advancedPolygonPerimeter"],
    [type => type.id === "5-1-u6-t2", "rectangleRightTriangleAreaAdvanced"],
    [type => type.id === "5-1-u6-t3", "perimeterAreaSquareCompositionAdvanced"],
    [type => type.id === "5-1-u6-t4", "quadrilateralAreaAdvanced"]
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
