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
  const roundTo = (value, unit) => Math.round(value / unit) * unit;
  const floorTo = (value, unit) => Math.floor(value / unit) * unit;
  const ceilTo = (value, unit) => Math.ceil(value / unit) * unit;
  const placeName = unit => ({ 1: "일", 10: "십", 100: "백", 1000: "천", 10000: "만" })[unit] || unit.toLocaleString();
  const roundedIntegerRange = (target, unit) => [target - unit / 2, target + unit / 2 - 1];
  const flooredIntegerRange = (target, unit) => [target, target + unit - 1];
  const ceiledIntegerRange = (target, unit) => [target - unit + 1, target];
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
    const body = `<rect class="shape-fill" x="20" y="55" width="82" height="64"/><text x="61" y="87">${originalArea}cm²</text><path class="folded" d="M116 87 H164"/><path class="folded" d="M154 78 L164 87 L154 96"/><polygon class="highlight-fill" points="178,126 256,126 240,48 162,48"/><text x="209" y="84">각 변</text><text x="202" y="96">${numerator}</text><line class="fraction-bar" x1="195" y1="101" x2="209" y2="101"/><text x="202" y="111">${denominator}</text><text x="216" y="105" text-anchor="start">배</text>`;
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

  const triangleSidesSvg = (sides, mark = "") => {
    const [base, leftSide, rightSide] = sides;
    const rawX = (leftSide ** 2 + base ** 2 - rightSide ** 2) / (2 * base);
    const rawY = Math.sqrt(Math.max(1, leftSide ** 2 - rawX ** 2));
    const scale = Math.min(150 / base, 92 / rawY);
    const ax = 42;
    const ay = 136;
    const bx = ax + base * scale;
    const by = ay;
    const cx = ax + rawX * scale;
    const cy = ay - rawY * scale;
    return `<svg class="geometry-diagram triangle-condition" viewBox="0 0 240 166" data-triangle-sides="${sides.join(",")}" aria-label="세 변이 표시된 삼각형"><polygon class="shape-fill" points="${ax},${ay} ${bx.toFixed(1)},${by} ${cx.toFixed(1)},${cy.toFixed(1)}"/><text x="${((ax + bx) / 2).toFixed(1)}" y="${ay + 15}">${base}cm</text><text x="${((ax + cx) / 2 - 9).toFixed(1)}" y="${((ay + cy) / 2).toFixed(1)}">${leftSide}cm</text><text x="${((bx + cx) / 2 + 9).toFixed(1)}" y="${((by + cy) / 2).toFixed(1)}">${rightSide}cm</text>${mark ? `<text x="${cx.toFixed(1)}" y="${(cy - 12).toFixed(1)}">${mark}</text>` : ""}</svg>`;
  };

  const overlapSquaresSvg = (side, dx, dy) => {
    const scale = 82 / side;
    const size = side * scale;
    const offsetX = dx * scale;
    const offsetY = dy * scale;
    return `<svg class="geometry-diagram overlap-squares" viewBox="0 0 240 172" data-square-side="${side}" data-square-offset="${dx},${dy}" aria-label="서로 겹친 합동 정사각형"><rect class="shape-fill" x="44" y="58" width="${size}" height="${size}"/><rect class="highlight-fill" x="${(44 + offsetX).toFixed(1)}" y="${(58 - offsetY).toFixed(1)}" width="${size}" height="${size}"/><text x="85" y="155">한 변 ${side}cm</text><text x="184" y="30">가로 ${dx}cm</text><text x="202" y="48">세로 ${dy}cm 이동</text></svg>`;
  };

  const coordinateSymmetrySvg = ({ point, image, axis, mode = "line" }) => {
    const cell = 18;
    const left = 48;
    const bottom = 142;
    const grid = Array.from({ length: 9 }, (_, index) => `<line class="crease" x1="${left + index * cell}" y1="${bottom - 8 * cell}" x2="${left + index * cell}" y2="${bottom}"/><line class="crease" x1="${left}" y1="${bottom - index * cell}" x2="${left + 8 * cell}" y2="${bottom - index * cell}"/><text x="${left + index * cell}" y="${bottom + 12}">${index}</text><text x="${left - 12}" y="${bottom - index * cell}">${index}</text>`).join("");
    const toPixel = ([x, y]) => [left + x * cell, bottom - y * cell];
    const [px, py] = toPixel(point);
    const [qx, qy] = toPixel(image);
    const axisMarkup = axis === "vertical" ? `<line class="folded" x1="${left + 4 * cell}" y1="${bottom - 8 * cell}" x2="${left + 4 * cell}" y2="${bottom}"/><text x="${left + 4 * cell + 12}" y="12">x=4</text>` : axis === "horizontal" ? `<line class="folded" x1="${left}" y1="${bottom - 4 * cell}" x2="${left + 8 * cell}" y2="${bottom - 4 * cell}"/><text x="208" y="${bottom - 4 * cell - 8}">y=4</text>` : `<line class="folded" x1="${left}" y1="${bottom}" x2="${left + 8 * cell}" y2="${bottom - 8 * cell}"/><text x="202" y="18">y=x</text>`;
    return `<svg class="geometry-diagram symmetry-grid" viewBox="0 0 240 166" data-symmetry-mode="${mode}" data-symmetry-axis="${axis}" data-symmetry-points="${point.join(",")};${image.join(",")}" aria-label="모눈 위 대칭점"><g>${grid}</g>${axisMarkup}<circle class="highlight-fill" cx="${px}" cy="${py}" r="5"/><text x="${px - 10}" y="${py - 10}">P</text><circle cx="${qx}" cy="${qy}" r="5"/><text x="${qx + 10}" y="${qy - 10}">P′</text></svg>`;
  };

  const symmetryShapeSvg = kind => {
    const shapes = {
      square: `<rect class="shape-fill" x="65" y="28" width="110" height="110"/>`,
      rectangle: `<rect class="shape-fill" x="38" y="48" width="164" height="78"/>`,
      hexagon: `<polygon class="shape-fill" points="66,28 174,28 214,83 174,138 66,138 26,83"/>`,
      trapezoid: `<polygon class="shape-fill" points="76,36 164,36 204,132 36,132"/>`
    };
    return `<svg class="geometry-diagram symmetry-shape" viewBox="0 0 240 166" data-symmetry-shape="${kind}" aria-label="대칭축을 찾는 도형">${shapes[kind]}</svg>`;
  };

  const mirrorRoomSvg = (width, height) => `<svg class="geometry-diagram mirror-room" viewBox="0 0 240 166" data-room-size="${width},${height}" aria-label="거울로 된 직사각형 방"><rect class="shape-fill" x="34" y="26" width="172" height="112"/><line class="folded" x1="34" y1="138" x2="118" y2="54"/><text x="120" y="156">가로 ${width}m</text><text x="218" y="82">${height}m</text><text x="58" y="118">45°</text></svg>`;

  const pointSymmetryGridSvg = ({ point, image, center = [4, 4] }) => {
    const base = coordinateSymmetrySvg({ point, image, axis: "vertical", mode: "point" });
    return base.replace(/<line class="folded"[\s\S]*?<\/text>/, "").replace("</svg>", `<circle class="folded" cx="${48 + center[0] * 18}" cy="${142 - center[1] * 18}" r="5"/><text x="${48 + center[0] * 18 + 12}" y="${142 - center[1] * 18 + 12}">O</text></svg>`);
  };

  const pointOverlapSvg = ({ width, height, dx, dy }) => {
    const scale = Math.min(92 / width, 68 / height);
    const w = width * scale;
    const h = height * scale;
    return `<svg class="geometry-diagram point-overlap" viewBox="0 0 240 166" data-rect-size="${width},${height}" data-center-offset="${dx},${dy}" aria-label="직사각형과 점대칭 도형의 겹침"><rect class="shape-fill" x="${(120 - w / 2 + dx * scale).toFixed(1)}" y="${(83 - h / 2 + dy * scale).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}"/><rect class="highlight-fill" x="${(120 - w / 2 - dx * scale).toFixed(1)}" y="${(83 - h / 2 - dy * scale).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}"/><circle cx="120" cy="83" r="4"/><text x="132" y="83">O</text></svg>`;
  };

  const latticeCenterLinesSvg = (width, height) => {
    const cell = Math.min(150 / width, 100 / height);
    const left = 120 - width * cell / 2;
    const top = 82 - height * cell / 2;
    const grid = Array.from({ length: width + 1 }, (_, index) => `<line class="crease" x1="${(left + index * cell).toFixed(1)}" y1="${top.toFixed(1)}" x2="${(left + index * cell).toFixed(1)}" y2="${(top + height * cell).toFixed(1)}"/>`).join("") + Array.from({ length: height + 1 }, (_, index) => `<line class="crease" x1="${left.toFixed(1)}" y1="${(top + index * cell).toFixed(1)}" x2="${(left + width * cell).toFixed(1)}" y2="${(top + index * cell).toFixed(1)}"/>`).join("");
    return `<svg class="geometry-diagram lattice-center" viewBox="0 0 240 166" data-lattice-size="${width},${height}" aria-label="중심이 표시된 직사각형 모눈"><rect x="${left.toFixed(1)}" y="${top.toFixed(1)}" width="${(width * cell).toFixed(1)}" height="${(height * cell).toFixed(1)}"/><g>${grid}</g><circle class="folded" cx="120" cy="82" r="5"/><text x="132" y="82">O</text></svg>`;
  };

  const decimalLShapeSvg = ({ width, height, topWidth, rightHeight }) => {
    const scale = Math.min(150 / width, 104 / height);
    const left = 42;
    const top = 28;
    const w = width * scale;
    const h = height * scale;
    const topW = topWidth * scale;
    const rightH = rightHeight * scale;
    const cutW = w - topW;
    const cutH = h - rightH;
    return `<svg class="geometry-diagram decimal-l-shape" viewBox="0 0 240 166" data-decimal-shape="${width},${height},${topWidth},${rightHeight}" aria-label="전체 가로 ${decimal(width, 2)}cm, 전체 세로 ${decimal(height, 2)}cm, 윗변 ${decimal(topWidth, 2)}cm, 오른쪽 세로변 ${decimal(rightHeight, 2)}cm인 ㄱ자 모양 도형"><path class="shape-fill" d="M${left} ${top} H${left + topW} V${top + cutH} H${left + w} V${top + h} H${left} Z"/><line class="crease" x1="${left + topW}" y1="${top}" x2="${left + topW}" y2="${top + cutH}"/><text x="${left + w / 2 - 16}" y="${top + h + 20}">${decimal(width, 2)}cm</text><text x="${left - 34}" y="${top + h / 2}">${decimal(height, 2)}cm</text><text x="${left + topW / 2 - 16}" y="${top - 10}">${decimal(topWidth, 2)}cm</text><text x="${left + w + 8}" y="${top + cutH + rightH / 2}">${decimal(rightHeight, 2)}cm</text></svg>`;
  };

  const decimalSquareStackSvg = ({ side, count, offset, target }) => {
    const shown = Math.min(count, 6);
    const scale = Math.min(70 / side, 17.5 / offset);
    const size = side * scale;
    const step = offset * scale;
    const startX = 30;
    const startY = 20;
    const squares = Array.from({ length: shown }, (_, index) => `<rect class="shape-fill" x="${(startX + index * step).toFixed(1)}" y="${(startY + index * step).toFixed(1)}" width="${size.toFixed(1)}" height="${size.toFixed(1)}"/>`).join("");
    const continuationX = startX + shown * step;
    const continuationY = startY + shown * step;
    return `<svg class="geometry-diagram decimal-square-stack" viewBox="0 0 260 190" data-square-stack="${side},${count},${offset},${target}" aria-label="한 변이 ${decimal(side, 2)}cm인 정사각형 ${count}장을 가로와 세로로 각각 ${decimal(offset, 2)}cm씩 옮겨 겹쳐 놓은 그림"><g>${squares}</g>${count > shown ? `<line class="crease" x1="${(continuationX - step / 2).toFixed(1)}" y1="${(continuationY - step / 2).toFixed(1)}" x2="${(continuationX + 22).toFixed(1)}" y2="${(continuationY + 22).toFixed(1)}"/><text x="${(continuationX + 42).toFixed(1)}" y="${(continuationY + 28).toFixed(1)}">… ${count}장</text>` : ""}<text x="${(startX + size / 2).toFixed(1)}" y="10">한 변 ${decimal(side, 2)}cm</text><text x="220" y="42">가로·세로</text><text x="220" y="58">${decimal(offset, 2)}cm씩 이동</text></svg>`;
  };

  const decimalEvidence = (kind, values, extra = "") => `<span hidden data-decimal-kind="${kind}" data-values="${values.join(",")}" ${extra}></span>`;

  const cuboidEvidence = (kind, values) => `<span hidden data-cuboid-kind="${kind}" data-values="${values.join(",")}"></span>`;
  const volumeEvidence = (kind, values) => `<span hidden data-volume-kind="${kind}" data-values="${values.join(",")}"></span>`;

  const cuboidSvg = ({ a, b, c, labels = [] }) => {
    const [top = "", front = "", right = ""] = labels;
    return `<svg class="geometry-diagram cuboid-diagram" viewBox="0 0 260 176" data-cuboid-dimensions="${a},${b},${c}" aria-label="가로 ${a}, 세로 ${b}, 높이 ${c}인 직육면체"><polygon class="shape-fill" points="48,62 164,62 214,30 98,30"/><polygon class="highlight-fill" points="48,62 164,62 164,142 48,142"/><polygon class="shape-fill" points="164,62 214,30 214,110 164,142"/><text x="106" y="160">가로 ${a}cm</text><text x="196" y="137">세로 ${b}cm</text><text x="28" y="104">높이 ${c}cm</text>${top ? `<text x="130" y="48">${top}</text>` : ""}${front ? `<text x="106" y="106">${front}</text>` : ""}${right ? `<text x="190" y="88">${right}</text>` : ""}</svg>`;
  };

  const heightMapTable = ({ title, heights }) => {
    const width = Math.max(...heights.map(row => row.length));
    const header = Array.from({ length: width }, (_, index) => `<th>${index + 1}열</th>`).join("");
    const rows = heights.map((row, index) => `<tr><th>${index + 1}행</th>${Array.from({ length: width }, (_, column) => `<td>${row[column] || 0}</td>`).join("")}</tr>`).join("");
    return `<div class="graph-panel height-map" data-height-map="${heights.map(row => row.join(".")).join(";")}"><div class="graph-title">${title}</div><table class="problem-table"><thead><tr><th>바닥 칸</th>${header}</tr></thead><tbody>${rows}</tbody></table><div class="graph-legend">각 수는 그 바닥 칸에 쌓인 정육면체의 높이입니다.</div></div>`;
  };

  const notchedProfileSvg = ({ width, cutWidth, cutHeight }) => `
    <svg class="geometry-diagram area-diagram notched-profile" viewBox="0 0 300 190" data-notch-profile="${width},${cutWidth},${cutHeight}" aria-label="오른쪽 위에 가로 ${cutWidth}cm, 높이 ${cutHeight}cm인 홈이 있는 앞면">
      <polygon class="highlight-fill" points="44,30 190,30 190,76 252,76 252,154 44,154"/>
      <line class="dimension" x1="44" y1="170" x2="252" y2="170"/>
      <line class="dimension" x1="44" y1="160" x2="44" y2="176"/>
      <line class="dimension" x1="252" y1="160" x2="252" y2="176"/>
      <text x="148" y="182">전체 가로 ${width}cm</text>
      <line class="dimension" x1="190" y1="17" x2="252" y2="17"/>
      <line class="dimension" x1="190" y1="12" x2="190" y2="25"/>
      <line class="dimension" x1="252" y1="12" x2="252" y2="70"/>
      <text x="221" y="7">${cutWidth}cm</text>
      <text x="267" y="52">${cutHeight}cm</text>
      <text x="25" y="92">높이 ?</text>
      <text x="148" y="102">앞에서 본 단면</text>
    </svg>`;

  const cellsFromHeights = heights => {
    const cells = [];
    heights.forEach((row, y) => row.forEach((height, x) => {
      for (let z = 0; z < height; z += 1) cells.push([x, y, z]);
    }));
    return cells;
  };

  const voxelSurface = cells => {
    const occupied = new Set(cells.map(cell => cell.join(",")));
    const directions = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
    return cells.reduce((surface, [x, y, z]) => surface + directions.filter(([dx, dy, dz]) => !occupied.has(`${x + dx},${y + dy},${z + dz}`)).length, 0);
  };

  const centeredTunnelCells = ({ size, hole, directions }) => {
    const start = (size - hole) / 2;
    const cells = [];
    for (let x = 0; x < size; x += 1) for (let y = 0; y < size; y += 1) for (let z = 0; z < size; z += 1) {
      const inBand = value => value >= start && value < start + hole;
      const removed = (directions.includes("x") && inBand(y) && inBand(z))
        || (directions.includes("y") && inBand(x) && inBand(z))
        || (directions.includes("z") && inBand(x) && inBand(y));
      if (!removed) cells.push([x, y, z]);
    }
    return cells;
  };

  const tunnelCubeSvg = ({ size, hole, directions }) => {
    const frontHole = directions.includes("y") ? '<rect class="cutout-fill" x="92" y="86" width="32" height="32"/>' : "";
    const rightHole = directions.includes("x") ? '<polygon class="cutout-fill" points="168,82 187,70 187,94 168,106"/>' : "";
    const topHole = directions.includes("z") ? '<polygon class="cutout-fill" points="103,50 126,50 141,40 118,40"/>' : "";
    return `<svg class="geometry-diagram cuboid-diagram" viewBox="0 0 260 176" data-tunnel-cube="${size},${hole},${directions.join(".")}" aria-label="중앙에 관통 구멍을 낸 정육면체"><polygon class="shape-fill" points="48,62 164,62 214,30 98,30"/><polygon class="highlight-fill" points="48,62 164,62 164,142 48,142"/><polygon class="shape-fill" points="164,62 214,30 214,110 164,142"/>${frontHole}${rightHole}${topHole}<text x="106" y="160">한 변 ${size}칸</text><text x="201" y="137">구멍 ${hole}×${hole}칸</text></svg>`;
  };

  const spaceEvidence = (kind, values, extra = "") => `<span hidden data-space-kind="${kind}" data-values="${values.join(",")}" ${extra}></span>`;

  const stackProjections = heights => {
    const rows = heights.length;
    const columns = heights[0].length;
    return {
      top: heights.flat().map(value => value > 0 ? 1 : 0),
      front: Array.from({ length: columns }, (_, x) => Math.max(...heights.map(row => row[x] || 0))),
      right: Array.from({ length: rows }, (_, y) => Math.max(...heights[y]))
    };
  };

  const projectionSquareCount = projections => projections.top.reduce((sum, value) => sum + value, 0)
    + projections.front.reduce((sum, value) => sum + value, 0)
    + projections.right.reduce((sum, value) => sum + value, 0);

  const sameProjection = (left, right) => ["top", "front", "right"].every(key => left[key].join(",") === right[key].join(","));

  const enumerateHeightMaps = ({ top, front, right, maxHeight, total = null }) => {
    const rows = right.length;
    const columns = front.length;
    const occupied = top.map((value, index) => value ? index : -1).filter(index => index >= 0);
    const heights = Array.from({ length: rows }, () => Array(columns).fill(0));
    const output = [];
    const visit = index => {
      if (index === occupied.length) {
        if (total !== null && heights.flat().reduce((sum, value) => sum + value, 0) !== total) return;
        const projections = stackProjections(heights);
        if (projections.front.join(",") === front.join(",") && projections.right.join(",") === right.join(",")) output.push(heights.map(row => [...row]));
        return;
      }
      const position = occupied[index];
      const y = Math.floor(position / columns);
      const x = position % columns;
      const limit = Math.min(maxHeight, front[x], right[y]);
      for (let height = 1; height <= limit; height += 1) {
        heights[y][x] = height;
        visit(index + 1);
      }
      heights[y][x] = 0;
    };
    visit(0);
    return output;
  };

  const projectionViewsSvg = ({ heights, title = "세 방향에서 본 그림" }) => {
    const projections = stackProjections(heights);
    const rows = heights.length;
    const columns = heights[0].length;
    const cell = 18;
    const panel = (label, values, width, offsetX) => {
      const max = Math.max(1, ...values);
      const cells = values.map((height, x) => Array.from({ length: height }, (_, z) => `<rect class="highlight-fill" x="${offsetX + x * cell}" y="${126 - (z + 1) * cell}" width="${cell}" height="${cell}"/>`).join("")).join("");
      const grid = Array.from({ length: width + 1 }, (_, index) => `<line class="crease" x1="${offsetX + index * cell}" y1="${126 - max * cell}" x2="${offsetX + index * cell}" y2="126"/>`).join("")
        + Array.from({ length: max + 1 }, (_, index) => `<line class="crease" x1="${offsetX}" y1="${126 - index * cell}" x2="${offsetX + width * cell}" y2="${126 - index * cell}"/>`).join("");
      return `<g>${cells}${grid}<text x="${offsetX + width * cell / 2}" y="148">${label}</text></g>`;
    };
    const topCells = projections.top.map((value, index) => value ? `<rect class="shape-fill" x="${18 + (index % columns) * cell}" y="${54 + Math.floor(index / columns) * cell}" width="${cell}" height="${cell}"/>` : "").join("");
    const topGrid = Array.from({ length: columns + 1 }, (_, index) => `<line class="crease" x1="${18 + index * cell}" y1="54" x2="${18 + index * cell}" y2="${54 + rows * cell}"/>`).join("")
      + Array.from({ length: rows + 1 }, (_, index) => `<line class="crease" x1="18" y1="${54 + index * cell}" x2="${18 + columns * cell}" y2="${54 + index * cell}"/>`).join("");
    return `<svg class="geometry-diagram stack-projections" viewBox="0 0 300 166" data-projections="${projections.top.join(".")};${projections.front.join(".")};${projections.right.join(".")}" aria-label="${title}"><g>${topCells}${topGrid}<text x="${18 + columns * cell / 2}" y="148">위</text></g>${panel("앞", projections.front, columns, 112)}${panel("오른쪽", projections.right, rows, 218)}</svg>`;
  };

  const isometricStackSvg = (heights, title = "높이표대로 쌓은 정육면체") => {
    const cells = cellsFromHeights(heights).sort((left, right) => (left[0] + left[1] + left[2]) - (right[0] + right[1] + right[2]));
    const cube = ([x, y, z]) => {
      const cx = 126 + (x - y) * 20;
      const cy = 132 - (x + y) * 10 - z * 20;
      return `<g><polygon class="shape-fill" points="${cx},${cy - 10} ${cx + 20},${cy} ${cx},${cy + 10} ${cx - 20},${cy}"/><polygon class="highlight-fill" points="${cx - 20},${cy} ${cx},${cy + 10} ${cx},${cy + 30} ${cx - 20},${cy + 20}"/><polygon class="shape-fill" points="${cx},${cy + 10} ${cx + 20},${cy} ${cx + 20},${cy + 20} ${cx},${cy + 30}"/></g>`;
    };
    return `<svg class="geometry-diagram isometric-stack" viewBox="0 0 280 180" data-stack-heights="${heights.map(row => row.join(".")).join(";")}" aria-label="${title}">${cells.map(cube).join("")}</svg>`;
  };

  const paintedFaceHistogram = cells => {
    const occupied = new Set(cells.map(cell => cell.join(",")));
    const directions = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
    const histogram = Array(7).fill(0);
    cells.forEach(([x, y, z]) => {
      const painted = directions.filter(([dx, dy, dz]) => !occupied.has(`${x + dx},${y + dy},${z + dz}`)).length;
      histogram[painted] += 1;
    });
    return histogram;
  };

  const internalCubeCount = cells => paintedFaceHistogram(cells)[0];

  const rotationTransforms = (() => {
    const permutations = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
    const parity = permutation => permutation.join("") === "012" || permutation.join("") === "120" || permutation.join("") === "201" ? 1 : -1;
    const transforms = [];
    permutations.forEach(permutation => [-1, 1].forEach(sx => [-1, 1].forEach(sy => [-1, 1].forEach(sz => {
      if (parity(permutation) * sx * sy * sz !== 1) return;
      transforms.push(point => [sx * point[permutation[0]], sy * point[permutation[1]], sz * point[permutation[2]]]);
    }))));
    return transforms;
  })();

  const normalizedCellsKey = cells => {
    const minima = [0, 1, 2].map(axis => Math.min(...cells.map(cell => cell[axis])));
    return cells.map(cell => cell.map((value, axis) => value - minima[axis]).join(",")).sort().join(";");
  };

  const canonicalPolycube = cells => rotationTransforms.map(transform => normalizedCellsKey(cells.map(transform))).sort()[0];

  const addedCubeShapeCount = baseCells => {
    const occupied = new Set(baseCells.map(cell => cell.join(",")));
    const directions = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
    const candidates = new Set();
    baseCells.forEach(([x, y, z]) => directions.forEach(([dx, dy, dz]) => {
      const next = [x + dx, y + dy, z + dz];
      if (!occupied.has(next.join(","))) candidates.add(canonicalPolycube([...baseCells, next]));
    }));
    return candidates.size;
  };

  const boundedCompositionCount = (parts, total, maximum) => {
    const memo = new Map();
    const visit = (remainingParts, remainingTotal) => {
      const key = `${remainingParts},${remainingTotal}`;
      if (memo.has(key)) return memo.get(key);
      if (!remainingParts) return remainingTotal === 0 ? 1 : 0;
      let count = 0;
      for (let value = 1; value <= maximum; value += 1) count += visit(remainingParts - 1, remainingTotal - value);
      memo.set(key, count);
      return count;
    };
    return visit(parts, total);
  };

  const polycubeSvg = cells => {
    const normalized = cells.map(cell => [...cell]);
    const cube = ([x, y, z]) => {
      const cx = 126 + (x - y) * 22;
      const cy = 120 - (x + y) * 11 - z * 22;
      return `<g><polygon class="shape-fill" points="${cx},${cy - 11} ${cx + 22},${cy} ${cx},${cy + 11} ${cx - 22},${cy}"/><polygon class="highlight-fill" points="${cx - 22},${cy} ${cx},${cy + 11} ${cx},${cy + 33} ${cx - 22},${cy + 22}"/><polygon class="shape-fill" points="${cx},${cy + 11} ${cx + 22},${cy} ${cx + 22},${cy + 22} ${cx},${cy + 33}"/></g>`;
    };
    return `<svg class="geometry-diagram isometric-stack" viewBox="0 0 280 180" data-polycube="${normalized.map(cell => cell.join(".")).join(";")}" aria-label="회전하여 같은 모양은 하나로 세는 쌓기나무">${normalized.slice().sort((a, b) => a.reduce((s, v) => s + v, 0) - b.reduce((s, v) => s + v, 0)).map(cube).join("")}</svg>`;
  };

  const waterTankSvg = ({ width, depth, height, waterHeight, title = "직육면체 수조" }) => {
    const waterY = 142 - 80 * waterHeight / height;
    return `<svg class="geometry-diagram cuboid-diagram water-tank" viewBox="0 0 260 190" data-water-tank="${width},${depth},${height},${waterHeight}" aria-label="${title}"><polygon class="shape-fill" points="48,62 164,62 214,30 98,30"/><polygon class="highlight-fill" points="48,${waterY.toFixed(1)} 164,${waterY.toFixed(1)} 164,142 48,142"/><polygon class="shape-fill" points="164,${waterY.toFixed(1)} 214,${(waterY - 32).toFixed(1)} 214,110 164,142"/><path d="M48 62V142H164L214 110V30L164 62Z M48 62L98 30H214 M164 62V142"/><text x="106" y="166">가로 ${width}cm</text><text x="202" y="145">세로 ${depth}cm</text><text x="28" y="104">높이 ${height}cm</text><text x="106" y="${Math.max(74, waterY - 10).toFixed(1)}">물 ${waterHeight}cm</text></svg>`;
  };

  const cubeNetSvg = ({ values = ["", "", "", "", "", ""], highlight = -1 }) => {
    const cells = [[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [1, 2]];
    const size = 38;
    return `<svg class="geometry-diagram cube-net" viewBox="0 0 230 170" data-net-values="${values.join(",")}" aria-label="여섯 면의 위치와 수가 표시된 정육면체 전개도"><g>${cells.map(([x, y], index) => `<rect class="${index === highlight ? "highlight-fill" : "shape-fill"}" x="${32 + x * size}" y="${24 + y * size}" width="${size}" height="${size}"/><text x="${51 + x * size}" y="${48 + y * size}">${values[index]}</text>`).join("")}</g></svg>`;
  };

  const diceSvg = ({ top, front, right }) => `<svg class="geometry-diagram dice-diagram" viewBox="0 0 260 176" data-dice-faces="${top},${front},${right}" aria-label="윗면 ${top}, 앞면 ${front}, 오른쪽 면 ${right}인 주사위"><polygon class="shape-fill" points="48,62 164,62 214,30 98,30"/><polygon class="highlight-fill" points="48,62 164,62 164,142 48,142"/><polygon class="shape-fill" points="164,62 214,30 214,110 164,142"/><text x="130" y="47">${top}</text><text x="106" y="106">${front}</text><text x="190" y="88">${right}</text></svg>`;

  const factorTriples = value => {
    const triples = [];
    for (let a = 1; a <= value; a += 1) for (let b = 1; b <= a; b += 1) for (let c = 1; c <= b; c += 1) {
      if (a * b * c === value) triples.push([a, b, c]);
    }
    return triples;
  };

  const rollDice = (orientation, move) => {
    const { top, bottom, north, south, east, west } = orientation;
    if (move === "N") return { top: south, bottom: north, north: top, south: bottom, east, west };
    if (move === "S") return { top: north, bottom: south, north: bottom, south: top, east, west };
    if (move === "E") return { top: west, bottom: east, north, south, east: top, west: bottom };
    return { top: east, bottom: west, north, south, east: bottom, west: top };
  };

  const diceOrientation = (top, front, right) => ({ top, bottom: 7 - top, north: 7 - front, south: front, east: right, west: 7 - right });

  const dicePathSvg = moves => {
    const arrows = { N: "↑", S: "↓", E: "→", W: "←" };
    return `<div class="equation dice-path" data-dice-path="${moves.join("")}">${moves.map(move => arrows[move]).join(" ")}</div>`;
  };

  // The cuboid unit needs its own checked drawings: the older generic net and
  // arrow-only dice helpers are kept for other units.
  const cuboidVectorKey = vector => vector.join(",");
  const cuboidSameVector = (left, right) => left.every((value, index) => value === right[index]);
  const cuboidOppositeVector = vector => vector.map(value => -value);
  const advancedCubeNetCells = [[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [1, 2]];
  const foldCubeNet = cells => {
    const positions = new Map(cells.map(([x, y], index) => [`${x},${y}`, index]));
    const frames = Array(cells.length).fill(null);
    frames[0] = { normal: [0, 0, 1], up: [0, 1, 0], right: [1, 0, 0] };
    const queue = [0];
    const nextFrame = (frame, dx, dy) => {
      if (dx === 1) return { normal: frame.right, up: frame.up, right: cuboidOppositeVector(frame.normal) };
      if (dx === -1) return { normal: cuboidOppositeVector(frame.right), up: frame.up, right: frame.normal };
      if (dy === -1) return { normal: frame.up, up: cuboidOppositeVector(frame.normal), right: frame.right };
      return { normal: cuboidOppositeVector(frame.up), up: frame.normal, right: frame.right };
    };
    while (queue.length) {
      const index = queue.shift();
      const [x, y] = cells[index];
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
        const neighbor = positions.get(`${x + dx},${y + dy}`);
        if (neighbor === undefined) return;
        const frame = nextFrame(frames[index], dx, dy);
        if (frames[neighbor]) {
          if (!cuboidSameVector(frames[neighbor].normal, frame.normal) || !cuboidSameVector(frames[neighbor].up, frame.up)) throw new Error("접을 수 없는 전개도입니다.");
          return;
        }
        frames[neighbor] = frame;
        queue.push(neighbor);
      });
    }
    if (frames.some(frame => !frame) || new Set(frames.map(frame => cuboidVectorKey(frame.normal))).size !== 6) throw new Error("정육면체가 되지 않는 전개도입니다.");
    return frames;
  };
  const advancedCubeNetPairs = cells => {
    const frames = foldCubeNet(cells);
    const pairs = [];
    frames.forEach((frame, index) => {
      const opposite = frames.findIndex(candidate => cuboidSameVector(candidate.normal, cuboidOppositeVector(frame.normal)));
      if (index < opposite) pairs.push([index, opposite]);
    });
    return pairs;
  };
  const advancedCubeNetSvg = ({ cells = advancedCubeNetCells, values = [], highlight = -1, candidates = [] }) => {
    const visibleCells = [...cells, ...candidates];
    const minX = Math.min(...visibleCells.map(([x]) => x));
    const maxX = Math.max(...visibleCells.map(([x]) => x));
    const minY = Math.min(...visibleCells.map(([, y]) => y));
    const maxY = Math.max(...visibleCells.map(([, y]) => y));
    const columns = maxX - minX + 1;
    const rows = maxY - minY + 1;
    const size = Math.min(38, 220 / columns, 132 / rows);
    const left = 130 - (maxX - minX + 1) * size / 2;
    const top = 83 - (maxY - minY + 1) * size / 2;
    const cellHtml = cells.map(([x, y], index) => `<rect class="${index === highlight ? "highlight-fill" : "shape-fill"}" x="${left + (x - minX) * size}" y="${top + (y - minY) * size}" width="${size}" height="${size}"/><text x="${left + (x - minX + .5) * size}" y="${top + (y - minY + .58) * size}" text-anchor="middle">${values[index] ?? ""}</text>`).join("");
    const candidateHtml = candidates.map(([x, y], index) => `<rect class="crease candidate-cell" x="${left + (x - minX) * size}" y="${top + (y - minY) * size}" width="${size}" height="${size}"/><text class="candidate-number" x="${left + (x - minX + .5) * size}" y="${top + (y - minY + .58) * size}" text-anchor="middle">${index + 1}</text>`).join("");
    return `<svg class="geometry-diagram cube-net" viewBox="0 0 260 166" data-advanced-net="${cells.map(cell => cell.join(".")).join(";")}" data-net-candidates="${candidates.map(cell => cell.join(".")).join(";")}" data-net-cell-size="${size.toFixed(2)}" aria-label="정육면체 전개도와 변에 맞닿은 후보 칸">${cellHtml}${candidateHtml}</svg>`;
  };
  const cuboidNetLayout = ({ a, b, c }) => {
    const faces = [
      { x: c, y: c, w: a, h: b }, { x: 0, y: c, w: c, h: b }, { x: c + a, y: c, w: c, h: b },
      { x: c, y: 0, w: a, h: c }, { x: c, y: c + b, w: a, h: c }, { x: c, y: 2 * c + b, w: a, h: b }
    ];
    return { faces, width: a + 2 * c, height: 2 * (b + c) };
  };
  const measuredCuboidNetSvg = ({ a, b, c, sheet = null, title = "직육면체 전개도" }) => {
    const layout = cuboidNetLayout({ a, b, c });
    const scale = Math.min(148 / layout.width, 114 / layout.height);
    const left = 55;
    const top = 26;
    const faces = layout.faces.map((face, index) => `<rect class="${index % 2 ? "highlight-fill" : "shape-fill"}" x="${left + face.x * scale}" y="${top + face.y * scale}" width="${face.w * scale}" height="${face.h * scale}"/>`).join("");
    const sheetBox = sheet ? `<rect class="crease" x="${left - sheet.marginX * scale}" y="${top - sheet.marginY * scale}" width="${sheet.width * scale}" height="${sheet.height * scale}"/><text x="${left + 8}" y="18">종이 ${sheet.width}cm × ${sheet.height}cm</text>` : "";
    return `<svg class="geometry-diagram cuboid-net" viewBox="0 0 260 190" data-cuboid-net-bounds="${layout.width},${layout.height}" aria-label="${title}, 가로 ${layout.width}cm 세로 ${layout.height}cm">${sheetBox}${faces}<text x="55" y="176">전개도 가로 ${layout.width}cm</text><text x="174" y="92">세로 ${layout.height}cm</text></svg>`;
  };
  const cuboidGridSvg = ({ a, b, c, cuts = [] }) => {
    const cell = Math.min(22, 166 / (a + b * .58), 82 / (c + b * .34));
    const depthX = cell * .58, depthY = -cell * .34;
    const x = 36, y = 52 - b * depthY;
    const frontRight = x + a * cell;
    const backX = b * depthX, backY = b * depthY;
    const frontGrid = Array.from({ length: a + 1 }, (_, i) => `<line class="crease" x1="${x + i * cell}" y1="${y}" x2="${x + i * cell}" y2="${y + c * cell}"/>`).join("") + Array.from({ length: c + 1 }, (_, i) => `<line class="crease" x1="${x}" y1="${y + i * cell}" x2="${frontRight}" y2="${y + i * cell}"/>`).join("");
    const topGrid = Array.from({ length: a + 1 }, (_, i) => `<line class="crease" x1="${x + i * cell}" y1="${y}" x2="${x + i * cell + backX}" y2="${y + backY}"/>`).join("") + Array.from({ length: b + 1 }, (_, i) => `<line class="crease" x1="${x + i * depthX}" y1="${y + i * depthY}" x2="${frontRight + i * depthX}" y2="${y + i * depthY}"/>`).join("");
    const sideGrid = Array.from({ length: b + 1 }, (_, i) => `<line class="crease" x1="${frontRight + i * depthX}" y1="${y + i * depthY}" x2="${frontRight + i * depthX}" y2="${y + i * depthY + c * cell}"/>`).join("") + Array.from({ length: c + 1 }, (_, i) => `<line class="crease" x1="${frontRight}" y1="${y + i * cell}" x2="${frontRight + backX}" y2="${y + backY + i * cell}"/>`).join("");
    const cutLines = cuts.map(({ axis, at }) => axis === "a"
      ? `<polyline class="folded cut-plane" points="${x + at * cell},${y + c * cell} ${x + at * cell},${y} ${x + at * cell + backX},${y + backY}"/>`
      : `<polyline class="folded cut-plane" points="${x + at * depthX},${y + at * depthY} ${frontRight + at * depthX},${y + at * depthY} ${frontRight + at * depthX},${y + at * depthY + c * cell}"/>`).join("");
    return `<svg class="geometry-diagram cuboid-grid" viewBox="0 0 260 176" data-cuboid-grid="${a},${b},${c}" data-cuboid-cuts="${cuts.map(cut => `${cut.axis}.${cut.at}`).join(";")}" aria-label="가로 ${a}칸, 세로 ${b}칸, 높이 ${c}칸인 모눈 직육면체"><polygon class="shape-fill" points="${x},${y} ${frontRight},${y} ${frontRight + backX},${y + backY} ${x + backX},${y + backY}"/><polygon class="highlight-fill" points="${x},${y} ${frontRight},${y} ${frontRight},${y + c * cell} ${x},${y + c * cell}"/><polygon class="shape-fill" points="${frontRight},${y} ${frontRight + backX},${y + backY} ${frontRight + backX},${y + backY + c * cell} ${frontRight},${y + c * cell}"/>${frontGrid}${topGrid}${sideGrid}${cutLines}<text x="130" y="164">가로 ${a}칸 · 세로 ${b}칸 · 높이 ${c}칸</text></svg>`;
  };
  const cornerCutBoxSvg = ({ width, height, cut }) => `<svg class="geometry-diagram corner-cut-box" viewBox="0 0 280 170" data-corner-cut="${width},${height},${cut}" aria-label="모서리에서 같은 크기의 정사각형을 잘라 접는 종이"><rect class="shape-fill" x="42" y="27" width="166" height="112"/><g class="cutout-fill">${[[42, 27], [208 - 24, 27], [42, 139 - 24], [208 - 24, 139 - 24]].map(([x, y]) => `<rect x="${x}" y="${y}" width="24" height="24"/>`).join("")}</g><line class="folded" x1="66" y1="27" x2="66" y2="139"/><line class="folded" x1="184" y1="27" x2="184" y2="139"/><line class="folded" x1="42" y1="51" x2="208" y2="51"/><line class="folded" x1="42" y1="115" x2="208" y2="115"/><text x="102" y="162">${width}cm × ${height}cm, 모서리 ${cut}cm</text></svg>`;
  const cuboidEdgeRouteSvg = ({ a, b, c }) => `<svg class="geometry-diagram cuboid-edge-route" viewBox="0 0 260 176" data-edge-route="${a},${b},${c}" aria-label="서로 마주 보는 꼭짓점을 모서리만 따라 잇는 직육면체"><polygon class="shape-fill" points="48,62 164,62 214,30 98,30"/><polygon class="highlight-fill" points="48,62 164,62 164,142 48,142"/><polygon class="shape-fill" points="164,62 214,30 214,110 164,142"/><polyline class="folded" points="48,142 164,142 214,110 214,30"/><circle cx="48" cy="142" r="4"/><text x="33" y="156">A</text><circle cx="214" cy="30" r="4"/><text x="220" y="28">B</text><text x="104" y="160">${a}cm</text><text x="192" y="136">${b}cm</text><text x="218" y="72">${c}cm</text></svg>`;
  const cuboidEdgeRelationSvg = ({ a, b, c }) => `<svg class="geometry-diagram cuboid-edge-relation" viewBox="0 0 260 176" data-edge-relation="${a},${b},${c}" aria-label="한 모서리만 굵게 표시한 직육면체"><polygon class="shape-fill" points="48,62 164,62 214,30 98,30"/><polygon class="highlight-fill" points="48,62 164,62 164,142 48,142"/><polygon class="shape-fill" points="164,62 214,30 214,110 164,142"/><line class="folded" x1="48" y1="142" x2="164" y2="142"/><circle cx="48" cy="142" r="4"/><text x="33" y="156">A</text><circle cx="164" cy="142" r="4"/><text x="168" y="156">B</text><text x="104" y="170">${a}cm</text><text x="198" y="136">${b}cm</text><text x="218" y="72">${c}cm</text></svg>`;
  const loopCuboidSvg = ({ a, b, c, showDimensions = true }) => `<svg class="geometry-diagram cuboid-loops" viewBox="0 0 270 186" data-loop-cuboid="${a},${b},${c}" data-loop-count="3" aria-label="서로 다른 세 방향으로 끈을 두른 직육면체"><polygon class="shape-fill" points="48,66 164,66 214,34 98,34"/><polygon class="highlight-fill" points="48,66 164,66 164,146 48,146"/><polygon class="shape-fill" points="164,66 214,34 214,114 164,146"/><path class="folded" d="M48 104 H164 L214 72 M98 34 V114"/><path class="folded" d="M72 55 L188 55 L188 135 L72 135 Z"/><path class="crease" d="M42 70 L204 70 M42 142 L204 142"/>${showDimensions ? `<text x="105" y="174">가로 ${a}cm · 세로 ${b}cm · 높이 ${c}cm</text>` : `<text x="105" y="174">서로 다른 세 방향의 끈</text>`}<text x="218" y="28">끈</text></svg>`;
  const stackedBoxLoopSvg = ({ width, stack }) => {
    const top = 26;
    const height = 120;
    const rowHeight = height / stack;
    const dividers = Array.from({ length: stack - 1 }, (_, index) => `<line class="crease" x1="68" y1="${top + (index + 1) * rowHeight}" x2="198" y2="${top + (index + 1) * rowHeight}"/>`).join("");
    return `<svg class="geometry-diagram stacked-box-loop" viewBox="0 0 270 186" data-stack-loop="${width},${stack}" data-loop-count="1" aria-label="같은 상자 ${stack}개를 쌓아 한 고리로 묶은 앞모습"><rect class="shape-fill" x="68" y="${top}" width="130" height="${height}"/>${dividers}<rect class="folded" x="61" y="19" width="144" height="134" rx="5"/><text x="133" y="174" text-anchor="middle">고리 안쪽 가로 ${width}cm · 같은 상자 ${stack}개</text></svg>`;
  };
  const diceRowSvg = count => {
    const gap = 6;
    const size = Math.min(44, (244 - gap * (count - 1)) / count);
    const total = count * size + (count - 1) * gap;
    const left = (280 - total) / 2;
    const cubes = Array.from({ length: count }, (_, index) => {
      const x = left + index * (size + gap);
      return `<rect class="${index % 2 ? "highlight-fill" : "shape-fill"}" x="${x}" y="28" width="${size}" height="${size}"/><text x="${x + size / 2}" y="${28 + size / 2}" text-anchor="middle">주사위</text>`;
    }).join("");
    const contacts = Array.from({ length: count - 1 }, (_, index) => `<text x="${left + (index + 1) * size + index * gap + gap / 2}" y="20" text-anchor="middle">7</text>`).join("");
    return `<svg class="geometry-diagram dice-row" viewBox="0 0 280 110" data-dice-row="${count}" aria-label="같은 방향으로 나란히 놓은 주사위">${cubes}${contacts}<text x="140" y="98" text-anchor="middle">맞닿는 두 면의 합은 7입니다.</text></svg>`;
  };
  const stackedDiceSvg = touching => `<svg class="geometry-diagram stacked-dice" viewBox="0 0 240 180" data-stacked-dice="${touching}" aria-label="같은 수가 맞닿도록 쌓은 두 주사위"><rect class="highlight-fill" x="88" y="92" width="64" height="64"/><rect class="shape-fill" x="88" y="28" width="64" height="64"/><line class="folded" x1="88" y1="92" x2="152" y2="92"/><text x="120" y="86" text-anchor="middle">맞닿은 면 ${touching}</text><text x="120" y="18" text-anchor="middle">윗주사위의 윗면 ${7 - touching}</text><text x="120" y="174" text-anchor="middle">바닥면은 보이지 않습니다.</text></svg>`;
  const diceViewSumsSvg = sums => `<svg class="geometry-diagram dice-view-sums" viewBox="0 0 310 142" data-dice-view-sums="${sums.join(",")}" aria-label="같은 주사위를 세로축 둘레로 90도씩 돌려 본 세 모습의 면 합">${sums.map((sum, index) => `<g transform="translate(${14 + index * 100},16)"><polygon class="shape-fill" points="0,24 48,24 68,12 20,12"/><polygon class="highlight-fill" points="0,24 48,24 48,72 0,72"/><polygon class="shape-fill" points="48,24 68,12 68,60 48,72"/><text class="dice-sum-value" x="34" y="91">합 ${sum}</text><text class="dice-turn-label" x="34" y="112">${index ? `${index * 90}° 돌림` : "처음"}</text></g>`).join("")}</svg>`;
  const orientationKey = state => [state.top, state.bottom, state.north, state.south, state.east, state.west].join(",");
  const allDiceOrientations = start => {
    const states = new Map([[orientationKey(start), start]]);
    const queue = [start];
    while (queue.length) {
      const state = queue.shift();
      ["N", "S", "E", "W"].forEach(move => {
        const next = rollDice(state, move);
        const key = orientationKey(next);
        if (!states.has(key)) { states.set(key, next); queue.push(next); }
      });
    }
    return [...states.values()];
  };
  const standardDiceStart = () => ({ top: 1, bottom: 6, north: 2, south: 5, east: 3, west: 4 });
  const allStandardDiceOrientations = () => {
    const mirror = { top: 1, bottom: 6, north: 2, south: 5, east: 4, west: 3 };
    const states = [...allDiceOrientations(standardDiceStart()), ...allDiceOrientations(mirror)];
    return [...new Map(states.map(state => [orientationKey(state), state])).values()];
  };
  const turnDiceVertically = state => ({ top: state.top, bottom: state.bottom, north: state.west, south: state.east, east: state.north, west: state.south });
  const pathCoordinates = moves => moves.reduce((points, move) => {
    const [x, y] = points[points.length - 1];
    const steps = { N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0] };
    points.push([x + steps[move][0], y + steps[move][1]]);
    return points;
  }, [[0, 0]]);
  const diceGridPathSvg = ({ paths, labels = [] }) => {
    const multiple = paths.length > 1;
    const viewWidth = multiple ? 330 : 260;
    const panelWidth = viewWidth / paths.length;
    const panels = paths.map((moves, pathIndex) => {
      const coords = pathCoordinates(moves);
      const minX = Math.min(...coords.map(([x]) => x));
      const maxX = Math.max(...coords.map(([x]) => x));
      const minY = Math.min(...coords.map(([, y]) => y));
      const maxY = Math.max(...coords.map(([, y]) => y));
      const cell = Math.min(multiple ? 19 : 28, (panelWidth - 28) / (maxX - minX + 1), 92 / (maxY - minY + 1));
      const centerX = panelWidth * (pathIndex + .5);
      const centerY = 82;
      const px = x => centerX + (x - (minX + maxX) / 2) * cell;
      const py = y => centerY + (y - (minY + maxY) / 2) * cell;
      const grid = Array.from({ length: maxX - minX + 2 }, (_, i) => `<line class="path-grid" x1="${px(minX + i) - cell / 2}" y1="${py(minY) - cell / 2}" x2="${px(minX + i) - cell / 2}" y2="${py(maxY) + cell / 2}"/>`).join("") + Array.from({ length: maxY - minY + 2 }, (_, i) => `<line class="path-grid" x1="${px(minX) - cell / 2}" y1="${py(minY + i) - cell / 2}" x2="${px(maxX) + cell / 2}" y2="${py(minY + i) - cell / 2}"/>`).join("");
      const start = coords[0], end = coords[coords.length - 1];
      return `${pathIndex ? `<line class="panel-separator" x1="${panelWidth * pathIndex}" y1="18" x2="${panelWidth * pathIndex}" y2="142"/>` : ""}<text class="path-title" x="${centerX}" y="13">${labels[pathIndex] ? `${labels[pathIndex]} 길` : "굴림 경로"}</text>${grid}<polyline class="dice-path path-${pathIndex + 1}" points="${coords.map(([x, y]) => `${px(x)},${py(y)}`).join(" ")}"/><circle class="path-start" cx="${px(start[0])}" cy="${py(start[1])}" r="4"/><circle class="path-end path-${pathIndex + 1}" cx="${px(end[0])}" cy="${py(end[1])}" r="4"/>`;
    }).join("");
    return `<svg class="geometry-diagram dice-grid-path${multiple ? " multi-path" : ""}" viewBox="0 0 ${viewWidth} 166" data-dice-grid-path="${paths.map(path => path.join("")).join(";")}" aria-label="${labels.length ? labels.join(", ") + " " : ""}격자 위의 주사위 굴림 경로">${panels}<text class="path-legend" x="${viewWidth / 2}" y="157">○ 출발　● 도착</text></svg>`;
  };
  const selfAvoidingDicePath = (rng, length) => {
    const candidates = [["E", "N", "E", "E", "S", "E", "N"], ["N", "E", "E", "S", "E", "N", "N"], ["E", "E", "N", "W", "N", "E", "E"], ["N", "N", "E", "S", "E", "E", "N"]];
    return pick(rng, candidates.filter(path => path.length >= length)).slice(0, length);
  };

  const averageProbabilityEvidence = (kind, values) => `<span hidden data-average-probability-kind="${kind}" data-values="${values.join(",")}"></span>`;
  const fractionDivisionEvidence = (kind, values) => `<span hidden data-fraction-division-kind="${kind}" data-values="${values.join(",")}"></span>`;
  const svgMeasurementAria = (value, unit = "cm") => {
    const text = String(value);
    const match = text.match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/);
    if (!match) return `${text}${unit}`;
    const [, whole = "", numerator, denominator] = match;
    return whole ? `${whole}와 ${denominator}분의 ${numerator}${unit}` : `${denominator}분의 ${numerator}${unit}`;
  };
  const svgMeasurementLabel = ({ x, y, value, unit = "cm" }) => {
    const text = String(value);
    const match = text.match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/);
    if (!match) return `<text x="${x}" y="${y}">${text}${unit}</text>`;
    const [, whole = "", numerator, denominator] = match;
    const wholeWidth = whole ? whole.length * 7 + 4 : 0;
    const fractionWidth = Math.max(numerator.length, denominator.length) * 7 + 5;
    const unitWidth = unit.length * 7;
    const start = x - (wholeWidth + fractionWidth + unitWidth) / 2;
    const fractionCenter = start + wholeWidth + fractionWidth / 2;
    const unitStart = start + wholeWidth + fractionWidth + 2;
    return `<g class="svg-measurement" aria-hidden="true">${whole ? `<text class="svg-measure-text" x="${start.toFixed(1)}" y="${y}">${whole}</text>` : ""}<text class="svg-measure-fraction" x="${fractionCenter.toFixed(1)}" y="${y - 6}">${numerator}</text><line class="fraction-bar" x1="${(fractionCenter - fractionWidth / 2 + 1).toFixed(1)}" y1="${y}" x2="${(fractionCenter + fractionWidth / 2 - 1).toFixed(1)}" y2="${y}"/><text class="svg-measure-fraction" x="${fractionCenter.toFixed(1)}" y="${y + 7}">${denominator}</text><text class="svg-measure-text" x="${unitStart.toFixed(1)}" y="${y}">${unit}</text></g>`;
  };
  const fractionTrapezoidSvg = ({ top, bottom, height = "□" }) => `<svg class="geometry-diagram area-diagram fraction-trapezoid" viewBox="0 0 260 176" data-trapezoid="${top},${bottom},${height}" role="img" aria-label="윗변 ${svgMeasurementAria(top)}, 아랫변 ${svgMeasurementAria(bottom)}, 높이 ${svgMeasurementAria(height)}인 사다리꼴"><polygon class="highlight-fill" points="72,38 174,38 224,136 30,136"/><line class="dimension" x1="72" y1="25" x2="174" y2="25"/><line class="dimension" x1="30" y1="151" x2="224" y2="151"/><line class="dimension" x1="52" y1="38" x2="52" y2="136"/>${svgMeasurementLabel({ x: 123, y: 15, value: top })}${svgMeasurementLabel({ x: 127, y: 165, value: bottom })}${svgMeasurementLabel({ x: 24, y: 87, value: height })}</svg>`;
  const equalTriangleSvg = ({ leftBase, leftHeight, rightBase }) => `<svg class="geometry-diagram fraction-division-shape" viewBox="0 0 240 166" data-equal-triangles="${leftBase},${leftHeight},${rightBase}" aria-label="넓이가 같은 두 직각삼각형"><path class="shape-fill" d="M28 128 L28 42 L104 128 Z"/><path class="highlight-fill" d="M132 128 L212 128 L212 54 Z"/><path class="folded" d="M28 42 V128 H104 M132 128 H212 V54"/><text x="48" y="151">${leftBase}cm</text><text x="4" y="88">${leftHeight}cm</text><text x="158" y="151">${rightBase}cm</text><text x="214" y="90">□cm</text><text x="84" y="28">두 색칠한 부분의 넓이는 같습니다.</text></svg>`;
  const angularSolidEvidence = (kind, values) => `<span hidden data-angular-solid-kind="${kind}" data-values="${values.join(",")}"></span>`;
  const angularPrismSvg = ({ sides, side, height }) => {
    const radius = sides > 7 ? 30 : 36;
    const top = regularPolygonPoints(sides, 120, 46, radius);
    const bottom = top.map(([x, y]) => [x, y + 66]);
    const polygon = points => points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const verticals = top.map(([x, y], index) => `<line class="${index > sides / 2 && index < sides - 1 ? "crease" : ""}" x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${bottom[index][0].toFixed(1)}" y2="${bottom[index][1].toFixed(1)}"/>`).join("");
    return `<svg class="geometry-diagram angular-prism" viewBox="0 0 240 166" data-prism="${sides},${side},${height}" aria-label="밑면이 정${sides}각형인 각기둥"><polygon class="shape-fill" points="${polygon(top)}"/><polygon points="${polygon(bottom)}"/>${verticals}<text x="120" y="151">밑면 한 변 ${side}cm</text><text x="198" y="84">높이 ${height}cm</text></svg>`;
  };
  const prismNetStripSvg = ({ sides, side, height, span = 0 }) => {
    const left = 18, top = 52, width = 204, cell = width / sides, bodyHeight = 64;
    const rectangles = Array.from({ length: sides }, (_, index) => `<rect class="${span && index < span ? "highlight-fill" : "shape-fill"}" x="${(left + index * cell).toFixed(1)}" y="${top}" width="${cell.toFixed(1)}" height="${bodyHeight}"/><text x="${(left + (index + 0.5) * cell).toFixed(1)}" y="${top + bodyHeight / 2}">${index + 1}</text>`).join("");
    const route = span ? `<line class="folded" x1="${left}" y1="${top + bodyHeight}" x2="${(left + span * cell).toFixed(1)}" y2="${top}"/>` : "";
    return `<svg class="geometry-diagram prism-net-strip" viewBox="0 0 240 166" data-prism-net="${sides},${side},${height},${span}" aria-label="번호가 표시된 각기둥의 옆면 전개도"><text x="120" y="18">옆면 ${sides}개를 한 줄로 펼침</text>${rectangles}${route}<text x="120" y="140">한 칸 ${side}cm × ${height}cm</text></svg>`;
  };
  const angularPyramidSvg = ({ sides, side, lateral }) => {
    const base = regularPolygonPoints(sides, 120, 112, sides > 6 ? 45 : 52).map(([x, y]) => [x, 92 + (y - 112) * 0.45]);
    const polygon = base.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const apex = [120, 24];
    const edges = base.map(([x, y], index) => `<line class="${index > sides / 2 ? "crease" : ""}" x1="${apex[0]}" y1="${apex[1]}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`).join("");
    return `<svg class="geometry-diagram angular-pyramid" viewBox="0 0 240 166" data-pyramid="${sides},${side},${lateral}" aria-label="밑면이 정${sides}각형인 각뿔"><polygon class="shape-fill" points="${polygon}"/>${edges}<circle class="highlight-fill" cx="120" cy="24" r="3"/><text x="120" y="147">밑면 한 변 ${side}cm</text><text x="194" y="56">옆모서리 ${lateral}cm</text></svg>`;
  };
  const surfaceRouteSvg = ({ faces, width, height, label = "최단 경로" }) => {
    const left = 22, top = 38, drawWidth = 196, drawHeight = 82;
    const lines = Array.from({ length: faces + 1 }, (_, index) => `<line x1="${(left + drawWidth * index / faces).toFixed(1)}" y1="${top}" x2="${(left + drawWidth * index / faces).toFixed(1)}" y2="${top + drawHeight}"/>`).join("");
    return `<svg class="geometry-diagram surface-route" viewBox="0 0 240 166" data-surface-route="${faces},${width},${height}" aria-label="${faces}개 면을 펼친 최단 경로"><rect class="shape-fill" x="${left}" y="${top}" width="${drawWidth}" height="${drawHeight}"/>${lines}<line class="folded" x1="${left}" y1="${top + drawHeight}" x2="${left + drawWidth}" y2="${top}"/><text x="120" y="20">${label}</text><text x="120" y="144">가로 ${width}cm</text><text x="222" y="80">세로 ${height}cm</text></svg>`;
  };
  const pyramidCrossNetSvg = ({ base, outer }) => {
    const left = 50, top = 24, size = 140, centerSize = size * base / outer, centerLeft = 120 - centerSize / 2, centerTop = 94 - centerSize / 2;
    return `<svg class="geometry-diagram pyramid-cross-net" viewBox="0 0 240 166" data-pyramid-cross="${base},${outer}" aria-label="정사각형 안에 그린 사각뿔 전개도"><rect class="original" x="${left}" y="${top}" width="${size}" height="${size}"/><rect class="shape-fill" x="${centerLeft.toFixed(1)}" y="${centerTop.toFixed(1)}" width="${centerSize.toFixed(1)}" height="${centerSize.toFixed(1)}"/><polygon class="highlight-fill" points="${centerLeft.toFixed(1)},${centerTop.toFixed(1)} ${(centerLeft + centerSize).toFixed(1)},${centerTop.toFixed(1)} 120,${top}"/><polygon class="highlight-fill" points="${(centerLeft + centerSize).toFixed(1)},${centerTop.toFixed(1)} ${(centerLeft + centerSize).toFixed(1)},${(centerTop + centerSize).toFixed(1)} ${left + size},94"/><polygon class="highlight-fill" points="${centerLeft.toFixed(1)},${(centerTop + centerSize).toFixed(1)} ${(centerLeft + centerSize).toFixed(1)},${(centerTop + centerSize).toFixed(1)} 120,${top + size}"/><polygon class="highlight-fill" points="${centerLeft.toFixed(1)},${centerTop.toFixed(1)} ${centerLeft.toFixed(1)},${(centerTop + centerSize).toFixed(1)} ${left},94"/><text x="120" y="98">${base}cm</text><text x="120" y="14">바깥 한 변 ${outer}cm</text></svg>`;
  };
  const decimalDivisionEvidence = (kind, values) => `<span hidden data-decimal-division-kind="${kind}" data-values="${values.join(",")}"></span>`;
  const decimalNumberLineSvg = ({ start, end, intervals, targetIndex }) => {
    const left = 24, right = 216, y = 84;
    const ticks = Array.from({ length: intervals + 1 }, (_, index) => {
      const x = left + (right - left) * index / intervals;
      const label = index === 0 ? start : index === intervals ? end : index === targetIndex ? "㉠" : "";
      return `<line x1="${x.toFixed(1)}" y1="${y - 8}" x2="${x.toFixed(1)}" y2="${y + 8}"/><text x="${x.toFixed(1)}" y="${y + 29}">${label}</text>`;
    }).join("");
    return `<svg class="geometry-diagram decimal-number-line" viewBox="0 0 240 150" data-number-line="${start},${end},${intervals},${targetIndex}" aria-label="${start}부터 ${end}까지 ${intervals}등분한 수직선"><line class="folded" x1="${left}" y1="${y}" x2="${right}" y2="${y}"/>${ticks}<text x="120" y="26">눈금은 모두 같은 간격입니다.</text></svg>`;
  };
  const decimalCompositeAreaSvg = ({ base, height, square }) => `<svg class="geometry-diagram decimal-composite-area" viewBox="0 0 240 158" data-composite-area="${base},${height},${square}" aria-label="평행사변형과 정사각형을 이어 붙인 도형"><polygon class="highlight-fill" points="20,118 128,118 164,58 56,58"/><rect class="shape-fill" x="164" y="58" width="60" height="60"/><line class="crease" x1="56" y1="58" x2="56" y2="118"/><text x="82" y="142">밑변 ${base}cm</text><text x="31" y="91">높이 □</text><text x="194" y="92">한 변 ${square}cm</text></svg>`;
  const movingOverlapSvg = ({ leftWidth, rightWidth, height, gap, overlap }) => `<svg class="geometry-diagram moving-overlap" viewBox="0 0 240 146" data-moving-overlap="${leftWidth},${rightWidth},${height},${gap},${overlap}" aria-label="처음에 떨어져 있다가 서로 다가오는 두 직사각형"><rect class="shape-fill" x="18" y="54" width="72" height="58"/><rect class="shape-fill" x="150" y="54" width="72" height="58"/><path class="folded" d="M92 82 H132 M122 72 L132 82 122 92 M148 82 H108 M118 72 L108 82 118 92"/><text x="54" y="136">가로 ${leftWidth}cm</text><text x="186" y="136">가로 ${rightWidth}cm</text><text x="120" y="40">처음 간격 ${gap}cm</text></svg>`;
  const fivePointLineSvg = ({ middle, total, extra }) => {
    const xs = [22, 66, 112, 164, 218];
    return `<svg class="geometry-diagram five-point-line" viewBox="0 0 240 150" data-five-point-line="${middle},${total},${extra}" aria-label="일직선 위에 차례로 놓인 다섯 점"><line class="folded" x1="${xs[0]}" y1="76" x2="${xs[4]}" y2="76"/>${xs.map((x, index) => `<circle class="highlight-fill" cx="${x}" cy="76" r="4"/><text x="${x}" y="102">${["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ"][index]}</text>`).join("")}<text x="115" y="34">ㄴㄹ=${middle}cm</text><text x="120" y="130">ㄱㅁ=${total}cm, ㄹㅁ=ㄱㄴ+${extra}cm</text></svg>`;
  };
  const rectangleBorderSvg = ({ width, height, border }) => `<svg class="geometry-diagram rectangle-border" viewBox="0 0 240 158" data-rectangle-border="${width},${height},${border}" aria-label="폭이 일정한 길로 둘러싸인 직사각형 공원"><rect class="highlight-fill" x="30" y="24" width="180" height="110"/><rect class="shape-fill" x="52" y="46" width="136" height="66"/><text x="120" y="82">공원</text><text x="120" y="150">길의 폭 ${border}m</text></svg>`;
  const equilateralStripSvg = ({ count, total }) => {
    const width = 184 / count;
    const triangles = Array.from({ length: count }, (_, index) => {
      const x = 28 + index * width;
      return `<polygon class="${index % 2 ? "highlight-fill" : "shape-fill"}" points="${x.toFixed(1)},112 ${(x + width / 2).toFixed(1)},40 ${(x + width).toFixed(1)},112"/>`;
    }).join("");
    return `<svg class="geometry-diagram equilateral-strip" viewBox="0 0 240 158" data-equilateral-strip="${count},${total}" aria-label="같은 크기의 정삼각형 ${count}개가 이어진 도형">${triangles}<text x="120" y="28">모두 같은 크기의 정삼각형</text><text x="120" y="142">아랫변 전체 ${total}cm</text></svg>`;
  };
  const ratioEvidence = (kind, values) => `<span hidden data-ratio-kind="${kind}" data-values="${values.join(",")}"></span>`;
  const graphEvidence = (kind, values) => `<span hidden data-advanced-graph-kind="${kind}" data-values="${values.join(",")}"></span>`;
  const circleSolidEvidence = (kind, values) => `<span hidden data-circle-solid-kind="${kind}" data-values="${values.join(",")}"></span>`;
  const circleCompositeSvg = ({ kind, a, b = 0, count = 0 }) => {
    if (kind === "ring") {
      const outer = 62, inner = outer * b / a;
      return `<svg class="geometry-diagram" viewBox="0 0 280 180" data-circle-shape="ring,${a},${b}" aria-label="반지름이 다른 두 동심원"><circle class="shape-fill" cx="140" cy="84" r="${outer}"/><circle cx="140" cy="84" r="${inner}" style="fill:white"/><line x1="140" y1="84" x2="${140 + outer}" y2="84"/><text x="${170 + outer / 2}" y="75">${a}cm</text><line x1="140" y1="84" x2="${140 + inner}" y2="84"/><text x="${148 + inner / 2}" y="105">${b}cm</text></svg>`;
    }
    if (kind === "square-circle") {
      return `<svg class="geometry-diagram" viewBox="0 0 280 180" data-circle-shape="square-circle,${a}" aria-label="정사각형에 꼭 맞는 원"><rect class="shape-fill" x="65" y="20" width="150" height="150"/><circle cx="140" cy="95" r="75" style="fill:white"/><text x="140" y="176">한 변 ${a}cm</text></svg>`;
    }
    if (kind === "rectangle-circles") {
      const circles = Array.from({ length: count }, (_, index) => `<circle cx="${55 + index * 55}" cy="82" r="27" style="fill:white"/>`).join("");
      return `<svg class="geometry-diagram" viewBox="0 0 280 180" data-circle-shape="rectangle-circles,${a},${count}" aria-label="직사각형 안에 나란히 놓인 같은 원"><rect class="shape-fill" x="28" y="55" width="${55 * count}" height="54"/>${circles}<text x="140" y="142">각 원의 반지름 ${a}cm</text></svg>`;
    }
    if (kind === "segment") {
      return `<svg class="geometry-diagram" viewBox="0 0 280 180" data-circle-shape="segment,${a},${b}" aria-label="부채꼴에서 삼각형을 뺀 활꼴"><path class="shape-fill" d="M140 92 L140 24 A68 68 0 0 1 208 92 Z"/><polygon points="140,92 140,24 208,92" style="fill:white"/><text x="176" y="112">${a}cm</text><text x="158" y="56">${b}°</text></svg>`;
    }
    return `<svg class="geometry-diagram" viewBox="0 0 280 180" data-circle-shape="sector-difference,${a},${b}" aria-label="큰 부채꼴에서 작은 부채꼴을 뺀 도형"><path class="shape-fill" d="M140 90 L140 20 A70 70 0 0 1 210 90 Z"/><path d="M140 90 L140 50 A40 40 0 0 1 180 90 Z" style="fill:white"/><text x="184" y="116">큰 반지름 ${a}cm</text><text x="148" y="76">작은 반지름 ${b}cm</text></svg>`;
  };
  const circlePointsSvg = ({ points, gaps = 1 }) => {
    const cx = 140, cy = 88, radius = 62;
    const positions = Array.from({ length: points }, (_, index) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / points;
      return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
    });
    const dots = positions.map(([x, y], index) => `<circle class="${index === 0 || index === gaps ? "highlight-fill" : ""}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4"/>`).join("");
    const [startX, startY] = positions[0], [endX, endY] = positions[gaps];
    return `<svg class="geometry-diagram" viewBox="0 0 280 180" data-circle-points="${points},${gaps}" aria-label="원주를 같은 간격의 점 ${points}개로 나눈 그림"><circle class="shape-fill" cx="${cx}" cy="${cy}" r="${radius}"/><line class="folded" x1="${cx}" y1="${cy}" x2="${startX.toFixed(1)}" y2="${startY.toFixed(1)}"/><line class="folded" x1="${cx}" y1="${cy}" x2="${endX.toFixed(1)}" y2="${endY.toFixed(1)}"/>${dots}<circle class="highlight-fill" cx="${cx}" cy="${cy}" r="3"/><text x="140" y="169">원주를 ${points}등분</text></svg>`;
  };
  const inscribedAngleSvg = ({ angle }) => `<svg class="geometry-diagram" viewBox="0 0 280 180" data-inscribed-angle="${angle}" aria-label="같은 호를 보는 원주각과 중심각"><circle class="shape-fill" cx="140" cy="88" r="62"/><path class="folded" d="M88 122 L140 26 L192 122"/><line class="crease" x1="140" y1="88" x2="88" y2="122"/><line class="crease" x1="140" y1="88" x2="192" y2="122"/><text x="140" y="48">${angle}°</text><text x="140" y="169">같은 호를 보는 두 각</text></svg>`;
  const locusDiagramSvg = ({ kind, a, b, r }) => {
    if (kind === "rectangle") return `<svg class="geometry-diagram" viewBox="0 0 280 180" data-locus="rectangle,${a},${b},${r}" aria-label="직사각형 바깥을 따라 구르는 원"><rect x="70" y="45" width="140" height="90"/><rect class="crease" x="50" y="25" width="180" height="130"/><circle class="highlight-fill" cx="50" cy="25" r="12"/><text x="140" y="156">${a}cm</text><text x="224" y="88">${b}cm</text><text x="42" y="18">r=${r}</text></svg>`;
    if (kind === "pivot") return `<svg class="geometry-diagram" viewBox="0 0 280 180" data-locus="pivot,${a},${b}" aria-label="한 점을 중심으로 회전하는 선분"><line x1="70" y1="132" x2="70" y2="42"/><path class="crease" d="M70 42 A90 90 0 0 1 160 132"/><line class="folded" x1="70" y1="132" x2="160" y2="132"/><text x="54" y="88">${a}cm</text><text x="92" y="122">${b}°</text></svg>`;
    return `<svg class="geometry-diagram" viewBox="0 0 280 180" data-locus="tether,${a},${b},${r}" aria-label="직사각형 우리와 줄에 묶인 동물의 이동 범위"><rect class="shape-fill" x="105" y="58" width="90" height="62"/><path class="crease" d="M105 58 A${r * 5} ${r * 5} 0 0 0 ${105 - r * 5} ${58 + r * 5}"/><text x="150" y="142">${a}m × ${b}m</text><text x="48" y="42">줄 ${r}m</text></svg>`;
  };
  const solidDiagramSvg = ({ kind, a, b, c = 0 }) => {
    if (kind === "cylinder-net") return `<svg class="geometry-diagram" viewBox="0 0 280 180" data-solid="cylinder-net,${a},${b}" aria-label="원기둥 전개도"><rect class="shape-fill" x="45" y="45" width="190" height="90"/><circle cx="80" cy="45" r="28"/><circle cx="200" cy="135" r="28"/><text x="140" y="160">높이 ${b}cm, 반지름 ${a}cm</text></svg>`;
    if (kind === "cylinder-wrap") return `<svg class="geometry-diagram" viewBox="0 0 280 180" data-solid="cylinder-wrap,${a},${b},${c}" aria-label="원기둥 옆면을 감은 선"><ellipse class="shape-fill" cx="140" cy="34" rx="48" ry="15"/><rect class="shape-fill" x="92" y="34" width="96" height="112"/><ellipse cx="140" cy="146" rx="48" ry="15"/><path class="folded" d="M92 132 C118 104 164 78 188 50"/><text x="201" y="91">${b}cm</text><text x="140" y="171">반지름 ${a}cm</text></svg>`;
    if (kind === "cone-net") return `<svg class="geometry-diagram" viewBox="0 0 280 180" data-solid="cone-net,${a},${b}" aria-label="원뿔의 옆면 전개도"><path class="shape-fill" d="M70 142 A100 100 0 0 1 210 142 L140 72 Z"/><circle cx="220" cy="82" r="${Math.max(16, a * 3)}"/><text x="140" y="58">모선 ${b}cm</text><text x="218" y="118">r=${a}cm</text></svg>`;
    if (kind === "profile") {
      const left = 190 - a * 8;
      const profile = c
        ? `<polygon class="shape-fill" points="190,40 ${left},140 190,140"/>`
        : `<rect class="shape-fill" x="${left}" y="40" width="${a * 8}" height="100"/>`;
      return `<svg class="geometry-diagram" viewBox="0 0 280 180" data-solid="profile,${a},${b},${c}" aria-label="회전축이 표시된 ${c ? "직각삼각형" : "직사각형"}"><line class="folded" x1="190" y1="18" x2="190" y2="160"/>${profile}<text x="205" y="90">회전축</text><text x="${Math.max(58, left + a * 4)}" y="154">${a}cm</text><text x="198" y="46">${b}cm</text></svg>`;
    }
    return `<svg class="geometry-diagram" viewBox="0 0 280 180" data-solid="stepped-profile,${a},${b},${c}" aria-label="계단 모양 평면도형과 회전축"><line class="folded" x1="200" y1="18" x2="200" y2="162"/><path class="shape-fill" d="M200 35 H${200-a*7} V90 H${200-c*7} V145 H200 Z"/><text x="207" y="90">회전축</text><text x="86" y="166">높이 ${b}cm</text></svg>`;
  };
  const ratioText = (left, right) => {
    const divisor = gcd(Math.abs(left), Math.abs(right));
    return `${left / divisor}:${right / divisor}`;
  };
  const ratioTrapezoidSvg = ({ top, bottom, diagonal = false, middle = false }) => {
    const diagonalLine = diagonal ? '<line class="folded" x1="78" y1="42" x2="196" y2="122"/>' : "";
    const middleLine = middle ? '<line class="crease" x1="52" y1="82" x2="188" y2="82"/><text x="120" y="72">□</text>' : "";
    const lengthLabel = (name, value) => value === "?" || value == null ? name : `${name} ${value}cm`;
    return `<svg class="geometry-diagram ratio-trapezoid" viewBox="0 0 240 158" data-ratio-trapezoid="${top},${bottom}" aria-label="윗변과 아랫변이 평행한 사다리꼴"><polygon class="shape-fill" points="78,42 162,42 210,122 30,122"/>${diagonalLine}${middleLine}<text x="120" y="25">${lengthLabel("윗변", top)}</text><text x="120" y="143">${lengthLabel("아랫변", bottom)}</text></svg>`;
  };
  const pictographTable = ({ title, labels, values, largeUnit, smallUnit, unitLabel = "명", hiddenIndices = [] }) => {
    const rows = labels.map((label, index) => {
      const large = Math.floor(values[index] / largeUnit);
      const small = (values[index] % largeUnit) / smallUnit;
      if (!Number.isInteger(small)) throw new Error("그림그래프 값이 범례 단위에 맞지 않습니다.");
      const largeIcons = large > 8 ? `■×${large}` : "■".repeat(large);
      const smallIcons = small > 8 ? `●×${small}` : "●".repeat(small);
      const icons = hiddenIndices.includes(index) ? '<span class="missing-graph-value">□</span>' : `<span class="large-icons">${largeIcons}</span><span class="small-icons">${smallIcons}</span>`;
      return `<tr><th>${label}</th><td class="pictograph-icons">${icons}</td></tr>`;
    }).join("");
    return `<div class="graph-panel" data-pictograph-values="${values.join(",")}"><div class="graph-title">${title}</div><table class="problem-table pictograph-table"><tbody>${rows}</tbody></table><div class="graph-legend">■ ${largeUnit.toLocaleString()}${unitLabel}　● ${smallUnit.toLocaleString()}${unitLabel}</div></div>`;
  };
  const graphColors = ["#dcecf5", "#ffe3a3", "#cce8dc", "#e5dcf5", "#f5d4dc", "#d8e0e7"];
  const stripGraphSvg = ({ title, segments }) => {
    const left = 24, width = 252, y = 54, height = 42;
    let cumulative = 0;
    const blocks = segments.map((segment, index) => {
      const x = left + width * cumulative / 100;
      const segmentWidth = width * segment.percent / 100;
      cumulative += segment.percent;
      return `<rect x="${x.toFixed(1)}" y="${y}" width="${segmentWidth.toFixed(1)}" height="${height}" style="fill:${graphColors[index % graphColors.length]}"/><text x="${(x + segmentWidth / 2).toFixed(1)}" y="${y + height / 2}">${segment.label}</text>`;
    }).join("");
    const ticks = Array.from({ length: 11 }, (_, index) => {
      const x = left + width * index / 10;
      return `<line class="grid-line" x1="${x.toFixed(1)}" y1="38" x2="${x.toFixed(1)}" y2="102"/><text class="tick-label" x="${x.toFixed(1)}" y="24">${index * 10}</text>`;
    }).join("");
    const legends = segments.map((segment, index) => `<text class="legend-label" x="${index % 2 ? 220 : 80}" y="${128 + Math.floor(index / 2) * 20}">${segment.label}${segment.showPercent === false ? "" : ` ${segment.percent}%`}</text>`).join("");
    return `<svg class="geometry-diagram graph-chart strip-chart" viewBox="0 0 300 190" data-strip-values="${segments.map(segment => segment.percent).join(",")}" aria-label="${title}"><text class="chart-title" x="150" y="8">${title}</text>${ticks}${blocks}<rect x="${left}" y="${y}" width="${width}" height="${height}"/>${legends}</svg>`;
  };
  const pieGraphSvg = ({ title, segments }) => {
    const cx = 150, cy = 70, radius = 57;
    let cumulative = 0;
    const sectors = segments.map((segment, index) => {
      const start = cumulative * Math.PI * 2 / 100 - Math.PI / 2;
      cumulative += segment.percent;
      const end = cumulative * Math.PI * 2 / 100 - Math.PI / 2;
      const x1 = cx + radius * Math.cos(start), y1 = cy + radius * Math.sin(start);
      const x2 = cx + radius * Math.cos(end), y2 = cy + radius * Math.sin(end);
      const largeArc = segment.percent > 50 ? 1 : 0;
      const path = segment.percent === 100
        ? `<circle cx="${cx}" cy="${cy}" r="${radius}" style="fill:${graphColors[index % graphColors.length]}"/>`
        : `<path d="M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z" style="fill:${graphColors[index % graphColors.length]}"/>`;
      const middle = (start + end) / 2, labelRadius = 34;
      const label = segment.percent >= 12 ? `<text x="${(cx + labelRadius * Math.cos(middle)).toFixed(1)}" y="${(cy + labelRadius * Math.sin(middle)).toFixed(1)}">${segment.percent}%</text>` : "";
      return path + label;
    }).join("");
    const legends = segments.map((segment, index) => `<rect x="${index % 2 ? 160 : 20}" y="${137 + Math.floor(index / 2) * 20}" width="10" height="10" style="fill:${graphColors[index % graphColors.length]}"/><text class="legend-label" x="${index % 2 ? 225 : 85}" y="${142 + Math.floor(index / 2) * 20}">${segment.label}${segment.showPercent === false ? "" : ` ${segment.percent}%`}</text>`).join("");
    return `<svg class="geometry-diagram graph-chart pie-chart" viewBox="0 0 300 210" data-pie-values="${segments.map(segment => segment.percent).join(",")}" aria-label="${title}"><text class="chart-title" x="150" y="8">${title}</text>${sectors}<circle cx="${cx}" cy="${cy}" r="${radius}"/>${legends}</svg>`;
  };
  const graphPair = (left, right) => `<div class="graph-pair">${left}${right}</div>`;
  const durationText = seconds => `${Math.floor(seconds / 60)}분${seconds % 60 ? ` ${seconds % 60}초` : ""}`;
  const decimalDigitAt = (numerator, denominator, position) => {
    let remainder = numerator % denominator;
    let digit = 0;
    for (let index = 0; index < position; index += 1) {
      remainder *= 10;
      digit = Math.floor(remainder / denominator);
      remainder %= denominator;
    }
    return digit;
  };
  const factorial = value => Array.from({ length: value }, (_, index) => index + 1).reduce((total, item) => total * item, 1);
  const combination = (n, r) => {
    r = Math.min(r, n - r);
    let value = 1;
    for (let index = 1; index <= r; index += 1) value = value * (n - r + index) / index;
    return value;
  };
  const valueTable = (headers, row) => `<table class="problem-table"><thead><tr>${headers.map(value => `<th>${value}</th>`).join("")}</tr></thead><tbody><tr>${row.map(value => `<td>${value}</td>`).join("")}</tr></tbody></table>`;

  const decimalDigitRelationCases = (() => {
    const groups = new Map();
    for (let a = 1; a <= 9; a += 1) for (let b = 0; b <= 9; b += 1) for (let c = 1; c <= 9; c += 1) for (let d = 0; d <= 9; d += 1) {
      if (new Set([a, b, c, d]).size !== 4) continue;
      const first = 10 * a + b;
      const second = 10 * c + d;
      if (first >= second) continue;
      const product = first * second;
      const alternate = (10 * a + c) * (10 * b + d);
      const difference = Math.abs(alternate - product);
      const key = `${product},${difference}`;
      const values = groups.get(key) || [];
      values.push({ a, b, c, d, sum: a + b + c + d });
      groups.set(key, values);
    }
    return [...groups.entries()].map(([key, values]) => ({
      key,
      values,
      product: Number(key.split(",")[0]),
      difference: Number(key.split(",")[1]),
      sums: [...new Set(values.map(value => value.sum))]
    })).filter(group => group.sums.length === 1 && group.difference > 0);
  })();

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
    advancedRange({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const aLow = int(rng, 11 + level * 8, 28 + level * 12);
        const aHigh = aLow + int(rng, 9 + level * 2, 15 + level * 3);
        const bLow = aLow + int(rng, 3, 7);
        const bHigh = bLow + int(rng, 9 + level * 2, 16 + level * 3);
        const first = new Set(Array.from({ length: aHigh - aLow }, (_, index) => aLow + index));
        const second = new Set(Array.from({ length: bHigh - bLow }, (_, index) => bLow + index + 1));
        const candidates = new Set([...first, ...second]);
        const common = [...first].filter(value => second.has(value));
        const answer = candidates.size - common.length;
        const evidence = `<span hidden data-range-kind="symmetric" data-a-low="${aLow}" data-a-high="${aHigh}" data-b-low="${bLow}" data-b-high="${bHigh}" data-range-expected="${answer}"></span>`;
        return result(`자연수 n에 대하여 두 조건 <b>${aLow} ≤ n &lt; ${aHigh}</b>, <b>${bLow} &lt; n ≤ ${bHigh}</b>가 있습니다. 두 조건 중 정확히 하나만 만족하는 자연수는 모두 몇 개인지 구하세요.${evidence}`, answer, `첫째 조건의 자연수는 ${first.size}개, 둘째 조건은 ${second.size}개이고 두 조건을 모두 만족하는 수는 ${common.length}개입니다. 한 조건만 만족하는 수는 ${first.size} + ${second.size} - 2 × ${common.length} = ${answer}개입니다.`);
      }
      if (variant % 3 === 1) {
        const sideMin = int(rng, 8 + level * 3, 15 + level * 5);
        const sideMax = sideMin + int(rng, 3 + level, 6 + level * 2);
        const lower = sideMin * 4 - int(rng, 1, 3);
        const upper = sideMax * 4 + int(rng, 1, 3);
        const minArea = sideMin ** 2;
        const maxArea = sideMax ** 2;
        const answer = `${minArea} 이상 ${maxArea} 이하`;
        const evidence = `<span hidden data-range-kind="square" data-lower="${lower}" data-upper="${upper}" data-side-min="${sideMin}" data-side-max="${sideMax}" data-range-expected="${minArea},${maxArea}"></span>`;
        return result(`한 변의 길이가 자연수인 정사각형의 둘레가 <b>${lower}cm 초과 ${upper}cm 미만</b>입니다. 이 정사각형의 넓이가 될 수 있는 수의 범위를 이상과 이하를 사용하여 나타내세요.${evidence}`, answer, `둘레를 4로 나누어 자연수인 한 변의 길이를 찾으면 ${sideMin}cm 이상 ${sideMax}cm 이하입니다. 넓이는 한 변의 길이를 두 번 곱하므로 ${minArea}cm² 이상 ${maxArea}cm² 이하입니다.`);
      }
      let total = 0;
      let minimum = 0;
      let maximum = 0;
      let countMin = 0;
      let countMax = 0;
      for (let attempt = 0; attempt < 100; attempt += 1) {
        total = int(rng, 18 + level * 5, 35 + level * 12) * 20;
        minimum = int(rng, 14 + level * 2, 24 + level * 3);
        maximum = minimum + int(rng, 7, 13 + level * 2);
        countMin = Math.ceil(total / maximum);
        countMax = Math.floor(total / minimum);
        if (countMax - countMin >= 2 && countMax - countMin <= 12) break;
      }
      const answer = `${countMin} 이상 ${countMax} 이하`;
      const evidence = `<span hidden data-range-kind="boxes" data-total="${total}" data-minimum="${minimum}" data-maximum="${maximum}" data-range-expected="${countMin},${countMax}"></span>`;
      return result(`물건 ${total.toLocaleString()}개를 상자에 모두 나누어 담습니다. 상자마다 <b>${minimum}개 이상 ${maximum}개 이하</b>가 되게 할 때 필요한 상자 수의 범위를 이상과 이하를 사용하여 나타내세요.${evidence}`, answer, `상자 수가 가장 적을 때는 한 상자에 최대한 많이 담으므로 ${total} ÷ ${maximum}을 올림한 ${countMin}개입니다. 가장 많을 때는 한 상자에 적어도 ${minimum}개씩 담아야 하므로 ${total} ÷ ${minimum}을 버림한 ${countMax}개입니다.`);
    },
    advancedRounding({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const unit = [10, 100, 1000][level];
        let value = int(rng, 1200, 9800 + level * 42000);
        if (value % unit === 0) value += Math.floor(unit / 3);
        const rounded = roundTo(value, unit);
        const raised = ceilTo(value, unit * 10);
        const dropped = floorTo(value, unit * 10);
        const answer = raised + rounded - dropped;
        const evidence = `<span hidden data-round-kind="methods" data-value="${value}" data-unit="${unit}" data-round-expected="${answer}"></span>`;
        return result(`${value.toLocaleString()}을 ① 올림하여 ${placeName(unit * 10)}의 자리까지 나타낸 수, ② 반올림하여 ${placeName(unit)}의 자리까지 나타낸 수, ③ 버림하여 ${placeName(unit * 10)}의 자리까지 나타낸 수를 차례로 구했습니다. <b>① + ② - ③</b>의 값을 구하세요.${evidence}`, answer, `①은 ${raised.toLocaleString()}, ②는 ${rounded.toLocaleString()}, ③은 ${dropped.toLocaleString()}입니다. 따라서 ${raised.toLocaleString()} + ${rounded.toLocaleString()} - ${dropped.toLocaleString()} = ${answer.toLocaleString()}입니다.`);
      }
      if (variant % 3 === 1) {
        let candidates = [];
        let valid = [];
        for (let attempt = 0; attempt < 100; attempt += 1) {
          const pool = new Set();
          while (pool.size < 7 + level) pool.add(int(rng, 1200, 8900));
          candidates = [...pool];
          valid = candidates.filter(value => ceilTo(value, 100) !== roundTo(value, 100) && floorTo(value, 10) !== roundTo(value, 10));
          if (valid.length >= 2 && valid.length <= candidates.length - 2) break;
        }
        const answer = valid.length;
        const evidence = `<span hidden data-round-kind="conditions" data-candidates="${candidates.join(",")}" data-round-expected="${answer}"></span>`;
        return result(`다음 수 중 두 조건을 모두 만족하는 수는 몇 개인지 구하세요.<div class="sequence">${candidates.map(value => value.toLocaleString()).join(", ")}</div><ul><li>올림하여 백의 자리까지 나타낸 수와 반올림하여 백의 자리까지 나타낸 수가 다릅니다.</li><li>버림하여 십의 자리까지 나타낸 수와 반올림하여 십의 자리까지 나타낸 수가 다릅니다.</li></ul>${evidence}`, answer, `각 수의 백의 자리 아래와 십의 자리 아래를 차례로 확인합니다. 두 결과가 모두 다른 수는 ${valid.map(value => value.toLocaleString()).join(", ")}이므로 ${answer}개입니다.`);
      }
      let digits = [];
      let numbers = [];
      for (let attempt = 0; attempt < 50; attempt += 1) {
        digits = shuffle(rng, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
        numbers = permutationNumbers(digits);
        if (numbers.length >= 18) break;
      }
      const sum = numbers.reduce((total, value) => total + value, 0);
      const unit = level === 2 ? 10000 : 1000;
      const answer = floorTo(sum, unit);
      const evidence = `<span hidden data-round-kind="cards" data-digits="${digits.join(",")}" data-unit="${unit}" data-round-expected="${answer}"></span>`;
      return result(`수 카드 ${digits.map(value => `<span class="digit-card">${value}</span>`).join("")}를 한 번씩 모두 사용하여 만들 수 있는 모든 네 자리 자연수의 합을 구한 뒤, 그 합을 버림하여 ${placeName(unit)}의 자리까지 나타내세요.${evidence}`, answer, `0이 맨 앞에 오는 경우를 제외하고 만들 수 있는 ${numbers.length}개의 수를 모두 더하면 ${sum.toLocaleString()}입니다. 이를 버림하여 ${placeName(unit)}의 자리까지 나타내면 ${answer.toLocaleString()}입니다.`);
    },
    roundingApplication({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const firstUnit = pick(rng, [40, 50, 60]);
        const secondUnit = pick(rng, [30, 40, 50]);
        const firstLength = firstUnit * int(rng, 12 + level * 3, 20 + level * 5) + int(rng, 1, firstUnit - 1);
        const secondLength = secondUnit * int(rng, 10 + level * 3, 18 + level * 5) + int(rng, 1, secondUnit - 1);
        const firstPrice = int(rng, 4, 9 + level * 2) * 100;
        const secondPrice = int(rng, 4, 9 + level * 2) * 100;
        const firstCount = Math.ceil(firstLength / firstUnit);
        const secondCount = Math.ceil(secondLength / secondUnit);
        const answer = firstCount * firstPrice + secondCount * secondPrice;
        const evidence = `<span hidden data-application-kind="package" data-first="${firstLength},${firstUnit},${firstPrice}" data-second="${secondLength},${secondUnit},${secondPrice}" data-application-expected="${answer}"></span>`;
        return result(`빨간 리본 ${firstLength}cm와 노란 리본 ${secondLength}cm가 필요합니다. 빨간 리본은 ${firstUnit}cm 단위로만 팔며 한 묶음에 ${firstPrice.toLocaleString()}원, 노란 리본은 ${secondUnit}cm 단위로만 팔며 한 묶음에 ${secondPrice.toLocaleString()}원입니다. 필요한 리본을 사는 데 드는 최소 금액을 구하세요.${evidence}`, answer, `빨간 리본은 ${firstLength} ÷ ${firstUnit}을 올림한 ${firstCount}묶음, 노란 리본은 ${secondLength} ÷ ${secondUnit}을 올림한 ${secondCount}묶음이 필요합니다. 따라서 ${firstCount} × ${firstPrice.toLocaleString()} + ${secondCount} × ${secondPrice.toLocaleString()} = ${answer.toLocaleString()}원입니다.`);
      }
      if (variant % 3 === 1) {
        const firstUnit = pick(rng, [40, 50, 60]);
        const secondUnit = pick(rng, [30, 40, 50]);
        const firstMeters = int(rng, 4 + level, 8 + level * 2);
        const secondMeters = int(rng, 3 + level, 7 + level * 2);
        const firstCentimeters = int(rng, 11, 89);
        const secondCentimeters = int(rng, 13, 87);
        const firstLength = firstMeters * 100 + firstCentimeters;
        const secondLength = secondMeters * 100 + secondCentimeters;
        const firstPrice = int(rng, 5, 9 + level * 2) * 100;
        const secondPrice = int(rng, 4, 8 + level * 2) * 100;
        const firstCount = Math.ceil(firstLength / firstUnit);
        const secondCount = Math.ceil(secondLength / secondUnit);
        const answer = firstCount * firstPrice + secondCount * secondPrice;
        const evidence = `<span hidden data-application-kind="unit-package" data-first="${firstLength},${firstUnit},${firstPrice}" data-second="${secondLength},${secondUnit},${secondPrice}" data-application-expected="${answer}"></span>`;
        return result(`행사용 장식을 만들기 위해 빨간 리본 ${firstMeters} m ${firstCentimeters} cm와 노란 리본 ${secondMeters} m ${secondCentimeters} cm가 필요합니다. 빨간 리본은 ${firstUnit} cm 단위로만 팔며 한 묶음에 ${firstPrice.toLocaleString()}원, 노란 리본은 ${secondUnit} cm 단위로만 팔며 한 묶음에 ${secondPrice.toLocaleString()}원입니다. 필요한 리본을 사는 데 드는 최소 금액을 구하세요.${evidence}`, answer, `빨간 리본은 ${firstMeters} m ${firstCentimeters} cm = ${firstLength} cm이므로 ${firstLength} ÷ ${firstUnit}을 올림한 ${firstCount}묶음이 필요합니다. 노란 리본은 ${secondMeters} m ${secondCentimeters} cm = ${secondLength} cm이므로 ${secondLength} ÷ ${secondUnit}을 올림한 ${secondCount}묶음이 필요합니다. 따라서 ${firstCount} × ${firstPrice.toLocaleString()} + ${secondCount} × ${secondPrice.toLocaleString()} = ${answer.toLocaleString()}원입니다.`);
      }
      const baseDistance = pick(rng, [800, 1000, 1200]);
      const baseFare = int(rng, 28, 36) * 100;
      const step = pick(rng, [100, 120, 150]);
      const stepFare = int(rng, 12, 24) * 10;
      const targetDistance = baseDistance + step * int(rng, 25 + level * 8, 55 + level * 12) + int(rng, 1, step - 1);
      const additions = Math.ceil((targetDistance - baseDistance) / step);
      const answer = baseFare + additions * stepFare;
      const evidence = `<span hidden data-application-kind="fare" data-base="${baseDistance},${baseFare}" data-step="${step},${stepFare}" data-distance="${targetDistance}" data-application-expected="${answer}"></span>`;
      return result(`택시 요금은 ${baseDistance}m 미만까지 ${baseFare.toLocaleString()}원이고, 그 뒤 ${step}m를 갈 때마다 ${stepFare}원씩 추가됩니다. 이 택시로 ${targetDistance.toLocaleString()}m를 갔을 때 요금을 구하세요.${evidence}`, answer, `${baseDistance}m를 넘은 거리는 ${(targetDistance - baseDistance).toLocaleString()}m입니다. ${(targetDistance - baseDistance).toLocaleString()} ÷ ${step}을 올림한 ${additions}번의 추가 요금이 붙으므로 ${baseFare.toLocaleString()} + ${additions} × ${stepFare} = ${answer.toLocaleString()}원입니다.`);
    },
    roundedRange({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const value = int(rng, 2200 + level * 900, 7800 + level * 4000);
        const roundedTarget = roundTo(value, 1000);
        const flooredTarget = floorTo(value, 100);
        const ceiledTarget = ceilTo(value, 10);
        const ranges = [roundedIntegerRange(roundedTarget, 1000), flooredIntegerRange(flooredTarget, 100), ceiledIntegerRange(ceiledTarget, 10)];
        const lower = Math.max(...ranges.map(range => range[0]));
        const upper = Math.min(...ranges.map(range => range[1]));
        const answer = `${lower} 이상 ${upper} 이하`;
        const evidence = `<span hidden data-rounded-kind="intersection" data-targets="${roundedTarget},${flooredTarget},${ceiledTarget}" data-rounded-expected="${lower},${upper}"></span>`;
        return result(`어떤 자연수에 대하여 다음 세 조건이 모두 성립합니다.<ul><li>반올림하여 천의 자리까지 나타내면 ${roundedTarget.toLocaleString()}입니다.</li><li>버림하여 백의 자리까지 나타내면 ${flooredTarget.toLocaleString()}입니다.</li><li>올림하여 십의 자리까지 나타내면 ${ceiledTarget.toLocaleString()}입니다.</li></ul>이 자연수의 범위를 이상과 이하를 사용하여 나타내세요.${evidence}`, answer, `각 조건에서 원래 수의 범위는 차례로 ${ranges[0][0]}~${ranges[0][1]}, ${ranges[1][0]}~${ranges[1][1]}, ${ranges[2][0]}~${ranges[2][1]}입니다. 세 범위의 공통 부분은 ${lower} 이상 ${upper} 이하입니다.`);
      }
      if (variant % 3 === 1) {
        let first = 0;
        let second = 0;
        let firstTarget = 0;
        let secondTarget = 0;
        let candidates = [];
        for (let attempt = 0; attempt < 180; attempt += 1) {
          const hidden = int(rng, 8 + level * 4, 45 + level * 12);
          first = int(rng, 3, 7 + level);
          second = int(rng, 2, 6 + level);
          if (first === second) continue;
          firstTarget = roundTo(first * hidden, 10);
          secondTarget = roundTo(second * hidden, 10);
          candidates = Array.from({ length: 150 }, (_, index) => index + 1).filter(value => roundTo(first * value, 10) === firstTarget && roundTo(second * value, 10) === secondTarget);
          if (candidates.length >= 2 && candidates.length <= 8) break;
        }
        const answer = candidates.length;
        const evidence = `<span hidden data-rounded-kind="multiples" data-factors="${first},${second}" data-targets="${firstTarget},${secondTarget}" data-rounded-expected="${answer}"></span>`;
        return result(`어떤 자연수 n에 ${first}을 곱한 수를 반올림하여 십의 자리까지 나타내면 ${firstTarget}이고, n에 ${second}을 곱한 수를 반올림하여 십의 자리까지 나타내면 ${secondTarget}입니다. n이 될 수 있는 자연수는 모두 몇 개인지 구하세요.${evidence}`, answer, `${first}n의 범위와 ${second}n의 범위를 각각 구한 뒤 공통으로 만족하는 자연수 n을 찾으면 ${candidates.join(", ")}의 ${answer}개입니다.`);
      }
      const firstUnit = level === 2 ? 1000 : 100;
      const secondUnit = level === 0 ? 10 : 100;
      const firstValue = int(rng, 24, 75 + level * 15) * firstUnit + int(rng, 0, firstUnit - 1);
      const secondValue = int(rng, 18, 64 + level * 12) * secondUnit + int(rng, 0, secondUnit - 1);
      const firstTarget = roundTo(firstValue, firstUnit);
      const secondTarget = floorTo(secondValue, secondUnit);
      const firstRange = roundedIntegerRange(firstTarget, firstUnit);
      const secondRange = flooredIntegerRange(secondTarget, secondUnit);
      const answer = firstRange[1] + secondRange[1];
      const evidence = `<span hidden data-rounded-kind="sum" data-first="${firstTarget},${firstUnit}" data-second="${secondTarget},${secondUnit}" data-rounded-expected="${answer}"></span>`;
      return result(`자연수 A를 반올림하여 ${placeName(firstUnit)}의 자리까지 나타내면 ${firstTarget.toLocaleString()}이고, 자연수 B를 버림하여 ${placeName(secondUnit)}의 자리까지 나타내면 ${secondTarget.toLocaleString()}입니다. A+B가 될 수 있는 가장 큰 수를 구하세요.${evidence}`, answer, `A의 최댓값은 ${firstRange[1].toLocaleString()}, B의 최댓값은 ${secondRange[1].toLocaleString()}입니다. 따라서 A+B의 최댓값은 ${firstRange[1].toLocaleString()} + ${secondRange[1].toLocaleString()} = ${answer.toLocaleString()}입니다.`);
    },
    rounding({ rng, level }) {
      const unit = pick(rng, [10, 100, 1000].slice(0, 2 + Math.min(level, 1)));
      const value = int(rng, 120, 9800);
      const answer = Math.round(value / unit) * unit;
      return result(`${value.toLocaleString()}을 ${placeName(unit)}의 자리에서 반올림하세요.`, answer, `${placeName(unit)}의 자리 바로 아래 숫자를 보고 반올림하면 ${answer.toLocaleString()}입니다.`);
    },
    fractionMultiply({ rng, level }) {
      const d1 = int(rng, 3, 8 + level * 2);
      const d2 = int(rng, 3, 8 + level * 2);
      const n1 = int(rng, 1, d1 - 1);
      const n2 = int(rng, 1, d2 - 1);
      const answer = fraction(n1 * n2, d1 * d2);
      return result(`<div class="equation">${n1}/${d1} × ${n2}/${d2} = □</div>`, answer, `분자는 ${n1} × ${n2}, 분모는 ${d1} × ${d2}로 계산한 뒤 약분하면 ${answer}입니다.`);
    },
    fractionNaturalAdvanced({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const firstDenominator = int(rng, 3, 5 + level);
        const firstNumerator = pick(rng, Array.from({ length: firstDenominator - 1 }, (_, index) => index + 1).filter(value => gcd(value, firstDenominator) === 1));
        const secondDenominator = int(rng, 3, 6 + level);
        const secondNumerator = pick(rng, Array.from({ length: secondDenominator - 1 }, (_, index) => index + 1).filter(value => gcd(value, secondDenominator) === 1));
        const total = firstDenominator * secondDenominator * int(rng, 8 + level * 4, 15 + level * 7);
        const first = total * firstNumerator / firstDenominator;
        const afterFirst = total - first;
        const second = afterFirst * secondNumerator / secondDenominator;
        const answer = afterFirst - second;
        const evidence = `<span hidden data-fmul-kind="sequential-share" data-values="${total},${firstNumerator},${firstDenominator},${secondNumerator},${secondDenominator}"></span>`;
        return result(`어느 학교 학생 ${total}명 중 ${firstNumerator}/${firstDenominator}은 체험 학습 A를 선택했습니다. 남은 학생의 ${secondNumerator}/${secondDenominator}은 체험 학습 B를 선택했습니다. 두 체험 학습을 선택하지 않은 학생은 몇 명인지 구하세요.${evidence}`, answer, `A를 선택한 학생은 ${total} × ${firstNumerator}/${firstDenominator} = ${first}명입니다. 남은 ${afterFirst}명 중 B를 선택하지 않은 비율은 ${secondDenominator - secondNumerator}/${secondDenominator}이므로 ${afterFirst} × ${secondDenominator - secondNumerator}/${secondDenominator} = ${answer}명입니다.`);
      }
      if (variant % 3 === 1) {
        const denominator = pick(rng, [24, 32, 36, 48, 60, 64, 72].slice(0, 4 + level));
        let numerator = int(rng, 2 + level, denominator - 1);
        while (gcd(numerator, denominator) !== 1) numerator = int(rng, 2 + level, denominator - 1);
        const answer = 86400 * numerator / denominator;
        const evidence = `<span hidden data-fmul-kind="day-seconds" data-values="${numerator},${denominator}"></span>`;
        return result(`하루의 ${numerator}/${denominator}만큼인 시간은 몇 초인지 구하세요.${evidence}`, answer, `하루는 24 × 60 × 60 = 86400초입니다. 따라서 86400 × ${numerator}/${denominator} = ${answer.toLocaleString()}초입니다.`);
      }
      let numerator = int(rng, 2, 5 + level);
      let denominator = int(rng, numerator + 2, 9 + level * 3);
      const divisor = gcd(numerator, denominator);
      numerator /= divisor;
      denominator /= divisor;
      const limit = 60 + level * 30;
      const candidates = Array.from({ length: limit }, (_, index) => index + 1).filter(value => {
        const productNumerator = value * numerator;
        return productNumerator % denominator === 0 && productNumerator / denominator >= 10 && productNumerator / denominator <= 99;
      });
      const answer = candidates.length;
      const evidence = `<span hidden data-fmul-kind="natural-count" data-values="${numerator},${denominator},${limit}"></span>`;
      return result(`1 이상 ${limit} 이하인 자연수 n 중에서 n × ${numerator}/${denominator}이 두 자리 자연수가 되는 n은 모두 몇 개인지 구하세요.${evidence}`, answer, `n은 ${denominator}의 배수여야 합니다. 이 가운데 n × ${numerator}/${denominator}이 10 이상 99 이하인 수는 ${candidates.join(", ")}의 ${answer}개입니다.`);
    },
    fractionProductAdvanced({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const start = int(rng, 4, 7 + level);
        const step = pick(rng, Array.from({ length: start - 2 }, (_, index) => index + 2).filter(value => gcd(value, start) === 1));
        const count = int(rng, 7 + level * 3, 11 + level * 4);
        const end = start + step * (count - 1);
        const answer = fraction(end + step, start);
        const evidence = `<span hidden data-fmul-kind="telescoping" data-values="${start},${step},${count}"></span>`;
        return result(`다음 ${count}개 분수의 곱을 구하세요.<div class="sequence">(1+${step}/${start}) × (1+${step}/${start + step}) × (1+${step}/${start + step * 2}) × … × (1+${step}/${end})</div>${evidence}`, answer, `각 항은 차례로 ${start + step}/${start}, ${start + step * 2}/${start + step}, …, ${end + step}/${end}입니다. 이웃한 분자와 분모가 약분되어 ${end + step}/${start} = ${answer}입니다.`);
      }
      if (variant % 3 === 1) {
        const height = int(rng, 6 + level * 2, 12 + level * 4);
        const denominator = int(rng, 3, 5 + level);
        const numerator = pick(rng, Array.from({ length: denominator - 1 }, (_, index) => index + 1).filter(value => gcd(value, denominator) === 1));
        const reboundCount = 2 + level;
        let total = rationalValue(height);
        let power = rationalValue(height * numerator, denominator);
        for (let bounce = 1; bounce <= reboundCount; bounce += 1) {
          total = rationalOperation(total, power, "+");
          if (bounce < reboundCount) total = rationalOperation(total, power, "+");
          power = rationalOperation(power, rationalValue(numerator, denominator), "×");
        }
        const answer = mixedFraction(total.numerator, total.denominator);
        const evidence = `<span hidden data-fmul-kind="bouncing" data-values="${height},${numerator},${denominator},${reboundCount}"></span>`;
        return result(`${height}m 높이에서 공을 떨어뜨렸습니다. 공은 바닥에 닿을 때마다 직전 높이의 ${numerator}/${denominator}만큼 튀어 오릅니다. ${reboundCount}번째로 튀어 올라 최고점에 도착할 때까지 공이 움직인 거리를 구하세요.${evidence}`, answer, `처음 ${height}m를 내려온 뒤, 마지막을 제외한 각 튀어 오름은 올라갔다 내려오므로 두 번 더합니다. ${height} + 2 × (${fraction(height * numerator, denominator)} + ${reboundCount > 2 ? `${fraction(height * numerator ** 2, denominator ** 2)}${reboundCount > 3 ? ` + ${fraction(height * numerator ** 3, denominator ** 3)}` : ""}` : "0"}) + ${fraction(height * numerator ** reboundCount, denominator ** reboundCount)} = ${answer}m입니다.`);
      }
      const lastDivisor = int(rng, 7 + level * 3, 11 + level * 4);
      const factor = int(rng, 8 + level * 3, 18 + level * 5);
      const total = lastDivisor * factor;
      const answer = factor;
      const evidence = `<span hidden data-fmul-kind="remaining-product" data-values="${total},${lastDivisor}"></span>`;
      return result(`${total}에서 처음에는 전체의 1/2을 덜어 내고, 다음에는 남은 양의 1/3, 그다음에는 다시 남은 양의 1/4을 덜어 냅니다. 이와 같이 남은 양의 1/5, 1/6, …, 1/${lastDivisor}을 차례로 덜어 낸 뒤 남은 수를 구하세요.${evidence}`, answer, `남는 비율은 1/2 × 2/3 × 3/4 × … × ${lastDivisor - 1}/${lastDivisor}입니다. 모두 약분하면 1/${lastDivisor}이므로 ${total} × 1/${lastDivisor} = ${answer}입니다.`);
    },
    fractionMultiplicationEquation({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const firstDenominator = int(rng, 3, 5 + level);
        const firstNumerator = pick(rng, Array.from({ length: firstDenominator - 1 }, (_, index) => index + 1).filter(value => gcd(value, firstDenominator) === 1));
        const secondDenominator = int(rng, 3, 6 + level);
        const secondNumerator = pick(rng, Array.from({ length: secondDenominator - 1 }, (_, index) => index + 1).filter(value => gcd(value, secondDenominator) === 1));
        const total = firstDenominator * secondDenominator * int(rng, 7 + level * 3, 14 + level * 5);
        const afterFirst = total * (firstDenominator - firstNumerator) / firstDenominator;
        const remaining = afterFirst * (secondDenominator - secondNumerator) / secondDenominator;
        const evidence = `<span hidden data-fmul-kind="reverse-total" data-values="${remaining},${firstNumerator},${firstDenominator},${secondNumerator},${secondDenominator}"></span>`;
        return result(`어떤 수의 ${firstNumerator}/${firstDenominator}을 덜어 내고, 남은 수의 ${secondNumerator}/${secondDenominator}을 다시 덜어 냈더니 ${remaining}이 남았습니다. 처음 수를 구하세요.${evidence}`, total, `처음 수를 □라 하면 □ × ${firstDenominator - firstNumerator}/${firstDenominator} × ${secondDenominator - secondNumerator}/${secondDenominator} = ${remaining}입니다. 거꾸로 계산하면 □ = ${remaining} × ${secondDenominator}/${secondDenominator - secondNumerator} × ${firstDenominator}/${firstDenominator - firstNumerator} = ${total}입니다.`);
      }
      if (variant % 3 === 1) {
        const firstRatio = int(rng, 5 + level, 11 + level * 2);
        const secondRatio = pick(rng, Array.from({ length: firstRatio - 3 }, (_, index) => index + 3).filter(value => gcd(value, firstRatio) === 1));
        const unit = int(rng, 120 + level * 80, 260 + level * 140);
        const first = firstRatio * unit;
        const second = secondRatio * unit;
        const total = first + second;
        const evidence = `<span hidden data-fmul-kind="ratio-total" data-values="${total},${firstRatio},${secondRatio}"></span>`;
        return result(`두 사람이 가진 돈의 합은 ${total.toLocaleString()}원입니다. 첫째가 가진 돈의 1/${firstRatio}과 둘째가 가진 돈의 1/${secondRatio}이 같을 때, 두 사람이 가진 돈을 차례로 구하세요.${evidence}`, `${first}, ${second}`, `공통으로 같은 금액을 1묶음이라 보면 두 사람의 돈은 ${firstRatio}:${secondRatio}입니다. 한 묶음은 ${total} ÷ (${firstRatio}+${secondRatio}) = ${unit}원이므로 ${first.toLocaleString()}원, ${second.toLocaleString()}원입니다.`);
      }
      const firstDenominator = pick(rng, [5, 7, 8]);
      const secondDenominator = pick(rng, [6, 9, 10].filter(value => value !== firstDenominator));
      const rawFirstNumerator = firstDenominator - 1;
      const rawSecondNumerator = secondDenominator - 2;
      const firstDivisor = gcd(rawFirstNumerator, firstDenominator);
      const secondDivisor = gcd(rawSecondNumerator, secondDenominator);
      const firstNumerator = rawFirstNumerator / firstDivisor;
      const reducedFirstDenominator = firstDenominator / firstDivisor;
      const secondNumerator = rawSecondNumerator / secondDivisor;
      const reducedSecondDenominator = secondDenominator / secondDivisor;
      const common = lcm(reducedFirstDenominator, reducedSecondDenominator);
      const total = common * int(rng, 4 + level * 2, 9 + level * 3);
      const firstLength = total * firstNumerator / reducedFirstDenominator;
      const secondLength = total * secondNumerator / reducedSecondDenominator;
      if (firstLength === secondLength) return generators.fractionMultiplicationEquation({ rng, level, variant });
      const difference = Math.abs(firstLength - secondLength);
      const evidence = `<span hidden data-fmul-kind="part-difference" data-values="${difference},${firstNumerator},${reducedFirstDenominator},${secondNumerator},${reducedSecondDenominator}"></span>`;
      return result(`길이가 서로 다른 두 막대를 같은 길이의 길에 놓았습니다. 긴 막대는 길 전체의 ${Math.max(firstLength, secondLength) === firstLength ? `${firstNumerator}/${reducedFirstDenominator}` : `${secondNumerator}/${reducedSecondDenominator}`}, 짧은 막대는 길 전체의 ${Math.max(firstLength, secondLength) === firstLength ? `${secondNumerator}/${reducedSecondDenominator}` : `${firstNumerator}/${reducedFirstDenominator}`}이고 두 막대의 길이 차는 ${difference}cm입니다. 길 전체는 몇 cm인지 구하세요.${evidence}`, total, `길 전체를 □cm라 하면 두 분수만큼의 차가 ${difference}cm입니다. 따라서 □ = ${difference} ÷ (두 분수의 차) = ${total}cm입니다.`);
    },
    fractionMultiplicationApplication({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const sets = [[6, 8, 12], [8, 10, 20], [9, 12, 18], [10, 12, 15]];
        const denominators = pick(rng, sets.slice(0, 2 + level));
        const numerator = pick(rng, [5, 7, 11].filter(value => denominators.every(denominator => gcd(value, denominator) === 1)));
        const common = lcmMany(denominators);
        const answer = mixedFraction(common, numerator);
        const evidence = `<span hidden data-fmul-kind="least-multiplier" data-values="${numerator},${denominators.join(",")}"></span>`;
        return result(`다음 세 분수 중 어느 것에 곱해도 자연수가 되게 하는 양의 분수 중 가장 작은 분수를 구하세요.<div class="sequence">${denominators.map(denominator => `${numerator}/${denominator}`).join(", ")}</div>${evidence}`, answer, `곱하는 분수를 □라 하면 □ × ${numerator}의 값은 ${denominators.join(", ")}의 공배수여야 합니다. 최소공배수는 ${common}이므로 가장 작은 □는 ${common}/${numerator} = ${answer}입니다.`);
      }
      if (variant % 3 === 1) {
        const firstDenominator = int(rng, 5, 7 + level);
        const secondDenominator = int(rng, 6, 9 + level);
        const firstChoices = Array.from({ length: firstDenominator - 1 }, (_, index) => index + 1).filter(value => gcd(value, firstDenominator) === 1);
        const secondChoices = Array.from({ length: secondDenominator - 1 }, (_, index) => index + 1).filter(value => gcd(value, secondDenominator) === 1);
        const selectedFirst = pick(rng, firstChoices);
        const selectedSecond = pick(rng, secondChoices);
        const target = rationalValue(selectedFirst * selectedSecond, firstDenominator * secondDenominator);
        const maxNumerator = 8 + level * 2;
        const pairs = [];
        for (let a = 1; a <= maxNumerator; a += 1) for (let b = 1; b <= maxNumerator; b += 1) {
          if (gcd(a, firstDenominator) !== 1 || gcd(b, secondDenominator) !== 1) continue;
          const product = rationalValue(a * b, firstDenominator * secondDenominator);
          if (product.numerator === target.numerator && product.denominator === target.denominator) pairs.push([a, b]);
        }
        const evidence = `<span hidden data-fmul-kind="pair-count" data-values="${firstDenominator},${secondDenominator},${target.numerator},${target.denominator},${maxNumerator}"></span>`;
        return result(`1 이상 ${maxNumerator} 이하인 자연수 A, B에 대하여 A/${firstDenominator}과 B/${secondDenominator}은 각각 기약분수입니다. A/${firstDenominator} × B/${secondDenominator} = ${target.numerator}/${target.denominator}을 만족하는 순서쌍 (A, B)는 모두 몇 개인지 구하세요.${evidence}`, pairs.length, `A와 B의 곱 조건과 각각의 최대공약수 조건을 함께 확인하면 ${pairs.map(pair => `(${pair.join(", ")})`).join(", ") || "해당 없음"}이므로 모두 ${pairs.length}개입니다.`);
      }
      const digits = [1, 2, 3, 4, 5, 6 + level];
      const chosen = shuffle(rng, digits);
      const target = rationalValue(chosen[0] * chosen[3] * chosen[4], chosen[1] * chosen[2] * chosen[5]);
      const arrangements = [];
      const visit = (used, remaining) => {
        if (!remaining.length) {
          const value = rationalValue(used[0] * used[3] * used[4], used[1] * used[2] * used[5]);
          if (value.numerator === target.numerator && value.denominator === target.denominator) arrangements.push(used);
          return;
        }
        remaining.forEach((value, index) => visit([...used, value], [...remaining.slice(0, index), ...remaining.slice(index + 1)]));
      };
      visit([], digits);
      const evidence = `<span hidden data-fmul-kind="digit-arrangements" data-values="${digits.join(",")}" data-target="${target.numerator},${target.denominator}"></span>`;
      return result(`서로 다른 여섯 칸에 ${digits.join(", ")}을 한 번씩 넣습니다. (가/나) ÷ (다/라) × (마/바) = ${target.numerator}/${target.denominator}이 되게 하는 (가, 나, 다, 라, 마, 바)의 배열은 모두 몇 가지인지 구하세요.${evidence}`, arrangements.length, `나눗셈을 곱셈으로 바꾸면 (가 × 라 × 마)/(나 × 다 × 바)입니다. 여섯 수를 한 번씩 넣어 약분한 값이 ${target.numerator}/${target.denominator}인 배열을 모두 확인하면 ${arrangements.length}가지입니다.`);
    },
    triangleConstructionAdvanced({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const sideA = int(rng, 6 + level, 10 + level * 2);
        const sideB = int(rng, 5 + level, 9 + level * 2);
        const evidence = `<span hidden data-congruence-kind="required-condition" data-values="3"></span>`;
        return result(`삼각형 ABC와 합동인 삼각형을 두 변과 그 끼인각 조건으로 하나만 그리려고 합니다. 변 AB=${sideA}cm, 변 AC=${sideB}cm를 알고 있을 때 더 알아야 하는 조건을 고르세요.${correspondenceTable([["번호", "①", "②", "③", "④"], ["조건", "∠B의 크기", "∠C의 크기", "∠A의 크기", "삼각형의 넓이"]])}${evidence}`, 3, `변 AB와 변 AC 사이에 끼인각은 ∠A입니다. 따라서 두 변과 그 끼인각 조건을 완성하는 것은 ③입니다.`);
      }
      if (variant % 3 === 1) {
        const start = int(rng, 4, 7 + level);
        const lengths = [start, start + 2, start + 5, start + 8, start + 11, start + 15 + level];
        const triangles = [];
        for (let i = 0; i < lengths.length; i += 1) for (let j = i + 1; j < lengths.length; j += 1) for (let k = j + 1; k < lengths.length; k += 1) {
          if (lengths[i] + lengths[j] > lengths[k]) triangles.push([lengths[i], lengths[j], lengths[k]]);
        }
        const evidence = `<span hidden data-congruence-kind="side-combinations" data-values="${lengths.join(",")}"></span>`;
        return result(`길이가 각각 ${lengths.join("cm, ")}cm인 막대가 한 개씩 있습니다. 이 중 서로 다른 막대 3개를 골라 만들 수 있는 서로 다른 삼각형은 모두 몇 가지인지 구하세요.${triangleSidesSvg(triangles[0] || lengths.slice(0, 3))}${evidence}`, triangles.length, `세 길이를 작은 순서로 a, b, c라 할 때 a+b>c인 조합만 가능합니다. 모든 조합을 확인하면 ${triangles.map(items => `(${items.join(", ")})`).join(", ")}의 ${triangles.length}가지입니다.`);
      }
      const start = int(rng, 20, 30 + level * 5);
      const angles = [start, start + 15, start + 30, start + 50, start + 70];
      const pairs = [];
      for (let i = 0; i < angles.length; i += 1) for (let j = i; j < angles.length; j += 1) if (angles[i] + angles[j] < 180) pairs.push([angles[i], angles[j]]);
      const evidence = `<span hidden data-congruence-kind="angle-pairs" data-values="${angles.join(",")}"></span>`;
      return result(`길이가 8cm인 한 선분의 양 끝에서 다음 보기의 각을 하나씩 골라 삼각형을 완성합니다. 양 끝의 각이 같아도 될 때 만들 수 있는 서로 다른 삼각형은 모두 몇 가지인지 구하세요.<div class="sequence">${angles.map(angle => `${angle}°`).join(", ")}</div>${evidence}`, pairs.length, `삼각형의 두 각의 합은 180°보다 작아야 합니다. 순서를 바꾼 것은 같은 삼각형으로 보고 중복을 제외하면 ${pairs.length}가지입니다.`);
    },
    triangleCongruenceCondition({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const first = int(rng, 7 + level, 12 + level * 2);
        const second = first + int(rng, 5, 9 + level * 2);
        const limit = second + first + int(rng, 3, 7);
        const candidates = Array.from({ length: limit }, (_, index) => index + 1).filter(value => value !== first && value !== second && Math.abs(second - first) < value && value < first + second);
        const evidence = `<span hidden data-congruence-kind="missing-side" data-values="${first},${second},${limit}"></span>`;
        return result(`세 변의 길이가 ${first}cm, ${second}cm, □cm인 삼각형이 있습니다. 세 변의 길이가 모두 다르고 □는 ${limit} 이하인 자연수일 때, □에 들어갈 수 있는 수는 모두 몇 개인지 구하세요.${triangleSidesSvg([first, second, candidates[Math.floor(candidates.length / 2)] || second - 1], "□")}${evidence}`, candidates.length, `삼각형이 되려면 ${second - first}<□<${first + second}입니다. 이 범위에서 ${first}, ${second}는 제외해야 하므로 가능한 자연수는 ${candidates.length}개입니다.`);
      }
      if (variant % 3 === 1) {
        const start = int(rng, 5, 8 + level);
        const sticks = [start, start + 1, start + 4, start + 7, start + 10];
        const valid = [];
        for (let i = 0; i < sticks.length; i += 1) for (let j = i + 1; j < sticks.length; j += 1) for (let k = j + 1; k < sticks.length; k += 1) if (sticks[i] + sticks[j] > sticks[k]) valid.push([sticks[i], sticks[j], sticks[k]]);
        const evidence = `<span hidden data-congruence-kind="stick-triangles" data-values="${sticks.join(",")}"></span>`;
        return result(`길이가 ${sticks.join("cm, ")}cm인 막대가 한 개씩 있습니다. 막대 3개를 골라 삼각형을 만들 때, 합동이 아닌 서로 다른 삼각형은 모두 몇 가지인지 구하세요.${evidence}`, valid.length, `사용한 세 막대의 길이가 같으면 합동인 삼각형입니다. 세 길이의 합 조건을 만족하는 조합을 세면 ${valid.length}가지입니다.`);
      }
      const sides = pick(rng, [6, 8, 10, 12].slice(0, 2 + level));
      const parts = Array.from({ length: sides - 1 }, (_, index) => index + 2).filter(value => sides % value === 0);
      const evidence = `<span hidden data-congruence-kind="regular-parts" data-values="${sides}"></span>`;
      return result(`정${sides}각형의 중심과 모든 꼭짓점을 이어 ${sides}개의 합동인 삼각형으로 나누었습니다. 이 삼각형을 같은 수씩 묶어 서로 합동인 조각으로 다시 나눌 때, 조각의 개수가 될 수 있는 2 이상 ${sides} 이하의 자연수는 모두 몇 개인지 구하세요.${polygonSvg(sides, Array(sides).fill(""))}${evidence}`, parts.length, `조각의 개수는 ${sides}개의 삼각형을 똑같이 나눌 수 있어야 하므로 ${sides}의 약수입니다. 가능한 수는 ${parts.join(", ")}의 ${parts.length}개입니다.`);
    },
    congruenceApplicationOne({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const angle = int(rng, 18 + level * 4, 36 + level * 6);
        const answer = angle * 2;
        const evidence = `<span hidden data-congruence-kind="folded-angle" data-values="${angle}"></span>`;
        return result(`정사각형 종이를 점선을 따라 접었습니다. 접기 전 선분과 접은 뒤 대응하는 선분이 점선과 이루는 각이 각각 ${angle}°일 때, 두 선분 사이의 각을 구하세요.${foldSvg(angle)}${evidence}`, answer, `접은 선을 대칭축으로 하므로 두 대응각의 크기는 같습니다. ${angle}+${angle}=${answer}°입니다.`);
      }
      if (variant % 3 === 1) {
        const vertexAngle = pick(rng, [40, 50, 60, 70, 80].slice(0, 3 + level));
        const answer = (180 - vertexAngle) / 2;
        const evidence = `<span hidden data-congruence-kind="isosceles-angle" data-values="${vertexAngle}"></span>`;
        return result(`합동인 두 이등변삼각형을 붙여 다음 도형을 만들었습니다. 한 이등변삼각형의 꼭지각이 ${vertexAngle}°일 때 밑각 한 곳의 크기를 구하세요.${isoscelesSplitSvg(vertexAngle)}${evidence}`, answer, `이등변삼각형의 두 밑각은 같고 세 각의 합은 180°입니다. (180-${vertexAngle})÷2=${answer}°입니다.`);
      }
      const side = int(rng, 10 + level * 2, 16 + level * 3);
      const dx = int(rng, 2, Math.floor(side / 2));
      const dy = int(rng, 2, Math.floor(side / 2));
      const answer = (side - dx) * (side - dy);
      const evidence = `<span hidden data-congruence-kind="square-overlap" data-values="${side},${dx},${dy}"></span>`;
      return result(`한 변이 ${side}cm인 합동인 두 정사각형을 가로로 ${dx}cm, 세로로 ${dy}cm 어긋나게 겹쳤습니다. 겹친 부분의 넓이를 구하세요.${overlapSquaresSvg(side, dx, dy)}${evidence}`, answer, `겹친 부분은 가로 ${side}-${dx}=${side - dx}cm, 세로 ${side}-${dy}=${side - dy}cm인 직사각형입니다. 넓이는 ${side - dx}×${side - dy}=${answer}cm²입니다.`);
    },
    congruenceApplicationTwo({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const count = 5 + level * 2;
        const eachArea = int(rng, 12 + level * 4, 24 + level * 7);
        const shaded = int(rng, 2, count - 2);
        const answer = eachArea * shaded;
        const evidence = `<span hidden data-congruence-kind="congruent-area" data-values="${count},${eachArea},${shaded}"></span>`;
        return result(`합동인 삼각형 ${count}개로 만든 도형의 전체 넓이가 ${eachArea * count}cm²입니다. 그중 ${shaded}개를 색칠했을 때 색칠한 부분의 넓이를 구하세요.${triangleFanSvg(count)}${evidence}`, answer, `삼각형 한 개의 넓이는 ${eachArea * count}÷${count}=${eachArea}cm²입니다. 따라서 색칠한 넓이는 ${eachArea}×${shaded}=${answer}cm²입니다.`);
      }
      if (variant % 3 === 1) {
        const side = int(rng, 5 + level, 10 + level * 2);
        const answer = side * 5;
        const evidence = `<span hidden data-congruence-kind="equilateral-trapezoid" data-values="${side}"></span>`;
        const svg = `<svg class="geometry-diagram equilateral-trapezoid" viewBox="0 0 240 160" aria-label="정삼각형으로 만든 사다리꼴"><polygon class="shape-fill" points="76,42 164,42 208,130 32,130"/><line class="crease" x1="76" y1="42" x2="120" y2="130"/><line class="crease" x1="164" y1="42" x2="120" y2="130"/><text x="120" y="146">윗변+아랫변=${side * 3}cm</text></svg>`;
        return result(`합동인 정삼각형 3개를 이어 붙여 사다리꼴을 만들었습니다. 사다리꼴의 윗변과 아랫변의 길이 합이 ${side * 3}cm일 때 둘레를 구하세요.${svg}${evidence}`, answer, `윗변을 한 변으로 보면 아랫변은 그 2배이므로 정삼각형 한 변은 ${side * 3}÷3=${side}cm입니다. 둘레는 한 변 길이의 5배이므로 ${answer}cm입니다.`);
      }
      const count = 5 + level;
      const base = int(rng, 6 + level * 2, 11 + level * 2);
      const height = int(rng, 5 + level, 10 + level * 2);
      const totalArea = count * base * height / 2;
      const evidence = `<span hidden data-congruence-kind="fan-height" data-values="${count},${base},${totalArea}"></span>`;
      return result(`밑변의 길이가 ${base}cm인 합동인 삼각형 ${count}개를 부채처럼 이어 붙였습니다. 전체 넓이가 ${totalArea}cm²일 때 삼각형 한 개의 높이를 구하세요.${triangleFanSvg(count)}${evidence}`, height, `삼각형 한 개의 넓이는 ${totalArea}÷${count}=${totalArea / count}cm²입니다. 높이는 ${totalArea / count}×2÷${base}=${height}cm입니다.`);
    },
    lineSymmetryAdvanced({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const axis = pick(rng, ["vertical", "horizontal", "diagonal"].slice(0, 2 + level));
        let point = [int(rng, 1, 3), int(rng, 1, 7)];
        while ((axis === "horizontal" && point[1] === 4) || (axis === "diagonal" && point[0] === point[1])) point = [int(rng, 1, 3), int(rng, 1, 7)];
        const image = axis === "vertical" ? [8 - point[0], point[1]] : axis === "horizontal" ? [point[0], 8 - point[1]] : [point[1], point[0]];
        const evidence = `<span hidden data-congruence-kind="line-point" data-axis="${axis}" data-values="${point.join(",")}"></span>`;
        return result(`모눈에서 점 P를 ${axis === "vertical" ? "직선 x=4" : axis === "horizontal" ? "직선 y=4" : "직선 y=x"}에 대하여 선대칭이동한 점 P′의 좌표를 쓰세요.${coordinateSymmetrySvg({ point, image, axis })}${evidence}`, `${image[0]}, ${image[1]}`, `대칭축에서 같은 거리에 있는 반대쪽 점을 찾으면 P′는 (${image[0]}, ${image[1]})입니다.`);
      }
      if (variant % 3 === 1) {
        const angle = int(rng, 18 + level * 3, 38 + level * 5);
        const answer = angle * 2;
        const evidence = `<span hidden data-congruence-kind="line-rays" data-values="${angle}"></span>`;
        return result(`한 반직선을 직선 가에 대하여 선대칭이동했습니다. 원래 반직선과 대칭축이 이루는 각이 ${angle}°일 때 두 반직선 사이의 작은 각을 구하세요.${foldSvg(angle)}${evidence}`, answer, `대칭축 양쪽의 대응각은 모두 ${angle}°이므로 작은 각은 ${angle}×2=${answer}°입니다.`);
      }
      const cases = [{ kind: "square", axes: 4, name: "정사각형" }, { kind: "rectangle", axes: 2, name: "정사각형이 아닌 직사각형" }, { kind: "hexagon", axes: 6, name: "정육각형" }, { kind: "trapezoid", axes: 1, name: "등변사다리꼴" }];
      const selected = pick(rng, cases.slice(0, 2 + level));
      const evidence = `<span hidden data-congruence-kind="axis-count" data-shape="${selected.kind}" data-values="${selected.axes}"></span>`;
      return result(`다음 ${selected.name}의 대칭축은 모두 몇 개인지 구하세요.${symmetryShapeSvg(selected.kind)}${evidence}`, selected.axes, `${selected.name}을 정확히 포개는 대칭축을 방향별로 세면 ${selected.axes}개입니다.`);
    },
    lineSymmetryApplication({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const rank = int(rng, 18 + level * 18, 45 + level * 20);
        const first = Math.floor((rank - 1) / 10) + 1;
        const middle = (rank - 1) % 10;
        const answer = first * 101 + middle * 10;
        const evidence = `<span hidden data-congruence-kind="palindrome-rank" data-values="${rank}"></span>`;
        return result(`세 자리 자연수 중 바로 읽어도 거꾸로 읽어도 같은 수를 작은 수부터 나열했습니다. ${rank}번째 수를 구하세요.${evidence}`, answer, `백의 자리와 일의 자리가 같은 수가 각 백의 자리마다 10개씩 있습니다. ${rank}번째 수의 백의 자리는 ${first}, 십의 자리는 ${middle}이므로 ${answer}입니다.`);
      }
      if (variant % 3 === 1) {
        const folds = 2 + level;
        const width = 12 + level * 4;
        const height = 8 + level * 4;
        const cutArea = int(rng, 1, Math.max(1, Math.floor(width * height / 2 ** folds / 3)));
        const answer = width * height - cutArea * 2 ** folds;
        const evidence = `<span hidden data-congruence-kind="folded-paper-area" data-values="${width},${height},${folds},${cutArea}"></span>`;
        return result(`가로 ${width}cm, 세로 ${height}cm인 직사각형 종이를 반씩 ${folds}번 접었습니다. 접힌 종이의 가장자리와 닿지 않는 넓이 ${cutArea}cm²의 조각을 잘라 냈을 때, 종이를 완전히 펼친 뒤 남은 넓이를 구하세요.${evidence}`, answer, `접힌 층은 2^${folds}=${2 ** folds}겹이므로 잘려 나간 전체 넓이는 ${cutArea}×${2 ** folds}=${cutArea * 2 ** folds}cm²입니다. 처음 넓이 ${width * height}cm²에서 빼면 ${answer}cm²입니다.`);
      }
      const width = pick(rng, [6, 8, 10, 12].slice(0, 2 + level));
      const height = pick(rng, [4, 6, 8, 9].filter(value => value !== width).slice(0, 2 + level));
      const travel = lcm(width, height);
      const answer = travel / width + travel / height - 2;
      const evidence = `<span hidden data-congruence-kind="mirror-bounces" data-values="${width},${height}"></span>`;
      return result(`가로 ${width}m, 세로 ${height}m인 직사각형 방의 네 벽이 거울입니다. 왼쪽 아래 모서리에서 벽과 45°를 이루도록 빛을 쏘아 어느 모서리에 처음 도착할 때까지 진행시켰습니다. 모서리에 도착하기 전까지 벽에 반사된 횟수를 구하세요.${mirrorRoomSvg(width, height)}${evidence}`, answer, `방을 반사시켜 이어 붙이면 빛은 직선으로 갑니다. 가로와 세로 이동거리가 처음 함께 맞는 길이는 최소공배수 ${travel}m이므로 중간 벽을 지나는 횟수는 ${travel / width - 1}+${travel / height - 1}=${answer}번입니다.`);
    },
    pointSymmetryAdvanced({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const point = [int(rng, 1, 3), int(rng, 1, 7)];
        const image = [8 - point[0], 8 - point[1]];
        const evidence = `<span hidden data-congruence-kind="point-coordinate" data-values="${point.join(",")},4,4"></span>`;
        return result(`점 O(4, 4)를 대칭의 중심으로 하여 점 P(${point[0]}, ${point[1]})와 점대칭인 점 P′의 좌표를 쓰세요.${pointSymmetryGridSvg({ point, image })}${evidence}`, `${image[0]}, ${image[1]}`, `O는 PP′의 중점입니다. x좌표와 y좌표의 합이 각각 8이므로 P′는 (${image[0]}, ${image[1]})입니다.`);
      }
      if (variant % 3 === 1) {
        const symbolSets = [["0", "1", "8", "6", "9"], ["0", "1", "2", "5", "8", "6", "9"]];
        const symbols = symbolSets[Math.min(level, 1)];
        const answer = symbols.filter(symbol => symbol !== "0").length;
        const evidence = `<span hidden data-congruence-kind="rotated-codes" data-symbols="${symbols.join(",")}" data-values="${answer}"></span>`;
        return result(`이 문제에서는 숫자를 180° 돌렸을 때 0→0, 1→1, 2→2, 5→5, 8→8, 6↔9로 읽습니다. ${symbols.join(", ")}만 사용하여 만든 두 자리 수 중 180° 돌려도 처음과 같은 수는 모두 몇 개인지 구하세요.${evidence}`, answer, `십의 자리 숫자를 정하면 일의 자리는 그 숫자를 180° 돌린 숫자로 하나만 정해집니다. 십의 자리에 0은 올 수 없으므로 ${answer}개입니다.`);
      }
      const width = int(rng, 10 + level * 2, 16 + level * 3);
      const height = int(rng, 8 + level, 12 + level * 2);
      const dx = int(rng, 1, Math.floor(width / 3));
      const dy = int(rng, 1, Math.floor(height / 3));
      const answer = (width - 2 * dx) * (height - 2 * dy);
      const evidence = `<span hidden data-congruence-kind="point-overlap" data-values="${width},${height},${dx},${dy}"></span>`;
      return result(`가로 ${width}cm, 세로 ${height}cm인 직사각형과 이 직사각형을 점 O에 대하여 점대칭이동한 도형이 겹쳐 있습니다. 두 직사각형의 중심은 O에서 가로 ${dx}cm, 세로 ${dy}cm씩 반대 방향에 있을 때 겹친 부분의 넓이를 구하세요.${pointOverlapSvg({ width, height, dx, dy })}${evidence}`, answer, `두 중심의 가로 차는 ${2 * dx}cm, 세로 차는 ${2 * dy}cm입니다. 겹친 부분은 가로 ${width - 2 * dx}cm, 세로 ${height - 2 * dy}cm이므로 넓이는 ${answer}cm²입니다.`);
    },
    pointSymmetryApplication({ rng, level, variant = 0 }) {
      if (variant % 3 === 0) {
        const speed = pick(rng, [6, 9, 12, 15, 18].slice(0, 3 + level));
        const answer = 180 / speed * 60;
        const evidence = `<span hidden data-congruence-kind="rotation-time" data-values="${speed}"></span>`;
        const svg = `<svg class="geometry-diagram rotating-triangle" viewBox="0 0 240 166" aria-label="삼각형을 중심 O 둘레로 180도 회전"><polygon class="shape-fill" points="120,82 64,126 92,30"/><polygon class="highlight-fill" points="120,82 176,38 148,134"/><circle cx="120" cy="82" r="4"/><text x="132" y="82">O</text><path class="folded" d="M91 34 A68 68 0 0 1 149 131"/><text x="188" y="82">180°</text></svg>`;
        return result(`삼각형을 한 점 O를 중심으로 1분에 ${speed}°씩 일정하게 회전시킵니다. 처음 도형과 점대칭인 위치에 처음 도착할 때까지 걸리는 시간은 몇 초인지 구하세요.${svg}${evidence}`, answer, `점대칭인 위치는 180° 회전한 위치입니다. ${180 / speed}분이 걸리므로 초로 바꾸면 ${answer}초입니다.`);
      }
      if (variant % 3 === 1) {
        const top = int(rng, 8 + level, 14 + level * 2);
        const bottom = top + int(rng, 3, 7 + level);
        const height = int(rng, 6 + level, 11 + level * 2);
        const total = (top + bottom) * height;
        const evidence = `<span hidden data-congruence-kind="point-trapezoids" data-values="${top},${bottom},${total}"></span>`;
        const svg = `<svg class="geometry-diagram point-trapezoids" viewBox="0 0 240 166" aria-label="점대칭인 두 사다리꼴"><polygon class="shape-fill" points="38,32 112,32 132,78 22,78"/><polygon class="highlight-fill" points="202,134 128,134 108,88 218,88"/><circle cx="120" cy="83" r="4"/><text x="132" y="83">O</text><text x="75" y="20">${top}cm</text><text x="77" y="92">${bottom}cm</text></svg>`;
        return result(`서로 점대칭인 합동인 사다리꼴 두 개의 넓이 합이 ${total}cm²입니다. 한 사다리꼴의 윗변은 ${top}cm, 아랫변은 ${bottom}cm일 때 높이를 구하세요.${svg}${evidence}`, height, `사다리꼴 두 개의 넓이 합은 (윗변+아랫변)×높이입니다. ${total}÷(${top}+${bottom})=${height}cm입니다.`);
      }
      const width = pick(rng, [4, 6, 8].slice(0, 1 + level));
      const height = pick(rng, [4, 6, 8].slice(0, 1 + level));
      const directions = new Set();
      const addDirection = (dx, dy) => {
        if (!dx && !dy) return;
        const divisor = gcd(dx, dy);
        dx /= divisor;
        dy /= divisor;
        if (dx < 0 || (dx === 0 && dy < 0)) { dx *= -1; dy *= -1; }
        directions.add(`${dx},${dy}`);
      };
      for (let x = 0; x <= width; x += 1) { addDirection(x - width / 2, -height / 2); addDirection(x - width / 2, height / 2); }
      for (let y = 1; y < height; y += 1) { addDirection(-width / 2, y - height / 2); addDirection(width / 2, y - height / 2); }
      const evidence = `<span hidden data-congruence-kind="center-lines" data-values="${width},${height}"></span>`;
      return result(`가로 ${width}칸, 세로 ${height}칸인 직사각형 모눈의 중심 O를 지나고, 양 끝이 모눈의 테두리 꼭짓점에 놓이는 서로 다른 직선은 모두 몇 개인지 구하세요.${latticeCenterLinesSvg(width, height)}${evidence}`, directions.size, `중심에서 테두리 꼭짓점으로 향하는 방향을 최대공약수로 나누어 같은 기울기를 하나로 묶습니다. 반대 방향도 같은 직선이므로 중복을 제외하면 ${directions.size}개입니다.`);
    },
    decimalNaturalAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 11;
      if (kind === 0) {
        const valueScale = int(rng, 125, 875 + level * 300);
        const count = int(rng, 8 + level * 4, 24 + level * 12);
        const answerScale = valueScale * count;
        const evidence = decimalEvidence("repeated-sum", [valueScale, count, answerScale]);
        return result(`${fixedDecimal(valueScale, 2)}를 ${count}번 더한 값을 구하세요.${evidence}`, fixedDecimal(answerScale, 2), `같은 수를 ${count}번 더하는 것은 ${fixedDecimal(valueScale, 2)}×${count}입니다. 따라서 ${fixedDecimal(answerScale, 2)}입니다.`);
      }
      if (kind === 1) {
        const valueScale = int(rng, 12 + level * 4, 48 + level * 12);
        const natural = int(rng, 6 + level * 2, 18 + level * 5);
        const pair = pick(rng, [[25, 4], [50, 2], [125, 8]]);
        const pairPlaces = pair[0] === 125 ? 3 : 2;
        const answerScale = valueScale * natural;
        const evidence = decimalEvidence("factor-pair", [valueScale, natural, pair[0], 10 ** pairPlaces, pair[1], answerScale]);
        return result(`곱하는 순서를 바꾸어 계산하세요.<div class="equation">${fixedDecimal(valueScale, 1)} × ${natural} × ${fixedDecimal(pair[0], pairPlaces)} × ${pair[1]}</div>${evidence}`, fixedDecimal(answerScale, 1), `${fixedDecimal(pair[0], pairPlaces)}×${pair[1]}=1이므로 남은 ${fixedDecimal(valueScale, 1)}×${natural}=${fixedDecimal(answerScale, 1)}입니다.`);
      }
      if (kind === 2) {
        const unitScale = int(rng, 12 + level * 3, 28 + level * 8);
        const m = int(rng, 24 + level * 3, 36 + level * 6);
        const n = int(rng, 5, 9 + level);
        const p = int(rng, 18, 28 + level * 3);
        const q = int(rng, 4, 8 + level);
        const coefficient = 3 * m - 4 * n + p - 2 * q;
        const answerScale = unitScale * coefficient;
        const evidence = decimalEvidence("common-factor", [unitScale, m, n, p, q, answerScale]);
        return result(`공통인 수를 묶어 계산하세요.<div class="equation">${fixedDecimal(unitScale * 3, 2)}×${m} - ${fixedDecimal(unitScale * 4, 2)}×${n} + ${fixedDecimal(unitScale, 2)}×${p} - ${fixedDecimal(unitScale * 2, 2)}×${q}</div>${evidence}`, fixedDecimal(answerScale, 2), `${fixedDecimal(unitScale, 2)}을 공통으로 묶으면 ${fixedDecimal(unitScale, 2)}×(3×${m}-4×${n}+${p}-2×${q})=${fixedDecimal(answerScale, 2)}입니다.`);
      }
      if (kind === 3) {
        let valueScale = int(rng, 107, 899 + level * 250);
        if (valueScale % 10 === 0) valueScale += 3;
        const natural = int(rng, 12 + level * 5, 39 + level * 15);
        const written = valueScale * natural;
        const evidence = decimalEvidence("missing-point", [valueScale, natural, written]);
        return result(`${fixedDecimal(valueScale, 2)}에 어떤 자연수를 곱했습니다. 곱을 소수 둘째 자리까지 쓴 뒤 소수점만 빠뜨려 ${written}이라고 적었을 때, 곱한 자연수를 구하세요.${evidence}`, natural, `소수점을 두 자리 왼쪽에 찍으면 실제 곱은 ${fixedDecimal(written, 2)}입니다. ${fixedDecimal(written, 2)}÷${fixedDecimal(valueScale, 2)}=${natural}입니다.`);
      }
      if (kind === 4) {
        const denominators = level === 0 ? [2, 5, 11] : level === 1 ? [3, 7, 13] : [4, 9, 17];
        const groups = new Map();
        for (let a = 1; a < denominators[0]; a += 1) for (let b = 1; b < denominators[1]; b += 1) for (let c = 1; c < denominators[2]; c += 1) {
          const rounded = Math.round((a / denominators[0] + b / denominators[1] + c / denominators[2]) * 100 + 1e-9);
          const values = groups.get(rounded) || [];
          values.push([a, b, c]);
          groups.set(rounded, values);
        }
        const unique = [...groups.entries()].filter(([, values]) => values.length === 1);
        const [target, [[a, b, c]]] = pick(rng, unique);
        const evidence = decimalEvidence("rounded-fraction-sum", [...denominators, target, a, b, c]);
        return result(`자연수 ㄱ, ㄴ, ㄷ은 각각 대응하는 분모보다 작습니다. 다음 값의 소수 셋째 자리에서 반올림한 값이 ${fixedDecimal(target, 2)}일 때 ㄱ, ㄴ, ㄷ을 차례로 쓰세요.<div class="equation">ㄱ/${denominators[0]} + ㄴ/${denominators[1]} + ㄷ/${denominators[2]}</div>${evidence}`, `${a}, ${b}, ${c}`, `가능한 진분수를 모두 대입해 합을 소수 둘째 자리까지 반올림하면 조건을 만족하는 순서쌍은 (${a}, ${b}, ${c}) 하나뿐입니다.`);
      }
      if (kind === 5) {
        const modulus = [7, 9, 11][level];
        for (let attempt = 0; attempt < 200; attempt += 1) {
          const target = int(rng, 123, 987);
          const digits = String(target).split("").map(Number);
          if (digits[0] === 0 || new Set(digits).size !== 3) continue;
          const digitSum = digits.reduce((sum, digit) => sum + digit, 0);
          const remainder = target % modulus;
          const candidates = [];
          for (let value = 100; value <= 999; value += 1) {
            const valueDigits = String(value).split("").map(Number);
            if (new Set(valueDigits).size !== 3 || valueDigits[0] !== digits[0]) continue;
            if (valueDigits.reduce((sum, digit) => sum + digit, 0) === digitSum && value % modulus === remainder) candidates.push(value);
          }
          if (!candidates.length || candidates.length > 4) continue;
          const answerScale = candidates.reduce((sum, value) => sum + value, 0);
          const evidence = decimalEvidence("conditioned-decimal", [digits[0], digitSum, modulus, remainder, answerScale, candidates.length]);
          return result(`0보다 크고 1보다 작은 소수 셋째 자리 수가 다음 조건을 모두 만족합니다. 가능한 수를 모두 더한 값을 구하세요.<div class="conditions"><p>각 자리 숫자는 서로 다릅니다.</p><p>소수 첫째 자리 숫자는 ${digits[0]}이고 세 자리 숫자의 합은 ${digitSum}입니다.</p><p>소수점을 없앤 세 자리 수를 ${modulus}로 나눈 나머지는 ${remainder}입니다.</p></div>${evidence}`, fixedDecimal(answerScale, 3), `조건을 차례로 확인하면 ${candidates.map(value => fixedDecimal(value, 3)).join(", ")}입니다. 모두 더하면 ${fixedDecimal(answerScale, 3)}입니다.`);
        }
        throw new Error("조건에 맞는 소수 후보를 만들지 못했습니다.");
      }
      if (kind === 6) {
        const startScale = int(rng, 1200, 2600 + level * 900);
        const stepScale = int(rng, 137, 380 + level * 120);
        const rank = int(rng, 40 + level * 40, 120 + level * 90);
        const answerScale = startScale + stepScale * (rank - 1);
        const evidence = decimalEvidence("decimal-sequence", [startScale, stepScale, rank, answerScale]);
        return result(`다음 규칙으로 수를 나열할 때 ${rank}번째 수를 구하세요.<div class="sequence">${fixedDecimal(startScale, 2)}, ${fixedDecimal(startScale + stepScale, 2)}, ${fixedDecimal(startScale + stepScale * 2, 2)}, ${fixedDecimal(startScale + stepScale * 3, 2)}, …</div>${evidence}`, fixedDecimal(answerScale, 2), `첫째 수에 공차 ${fixedDecimal(stepScale, 2)}을 ${rank - 1}번 더합니다. ${fixedDecimal(startScale, 2)}+${fixedDecimal(stepScale, 2)}×${rank - 1}=${fixedDecimal(answerScale, 2)}입니다.`);
      }
      if (kind === 7) {
        const firstWidth = int(rng, 14 + level * 3, 24 + level * 5);
        const firstHeightScale = int(rng, 85, 165 + level * 35);
        const secondWidth = int(rng, 8 + level * 2, 13 + level * 3);
        const secondHeightScale = int(rng, firstHeightScale + 20, firstHeightScale + 85 + level * 20);
        const differenceScale = secondWidth * secondHeightScale - firstWidth * firstHeightScale;
        if (differenceScale <= 0) return generators.decimalNaturalAdvanced({ rng, level, variant });
        const evidence = decimalEvidence("rectangle-area-difference", [firstWidth, firstHeightScale, secondWidth, differenceScale, secondHeightScale]);
        return result(`직사각형 가의 가로는 ${firstWidth}cm, 세로는 ${fixedDecimal(firstHeightScale, 2)}cm입니다. 직사각형 나는 가로가 ${secondWidth}cm이고 넓이가 가보다 ${fixedDecimal(differenceScale, 2)}cm² 더 큽니다. 나의 세로를 구하세요.${evidence}`, fixedDecimal(secondHeightScale, 2), `가의 넓이는 ${firstWidth}×${fixedDecimal(firstHeightScale, 2)}=${fixedDecimal(firstWidth * firstHeightScale, 2)}cm²입니다. 나의 넓이는 ${fixedDecimal(secondWidth * secondHeightScale, 2)}cm²이므로 세로는 이를 ${secondWidth}로 나눈 ${fixedDecimal(secondHeightScale, 2)}cm입니다.`);
      }
      if (kind === 8) {
        const locomotive = int(rng, 12, 20 + level * 4);
        const carCount = int(rng, 3 + level, 6 + level * 2);
        const carLength = int(rng, 10, 16 + level * 2);
        const speedScale = pick(rng, [12, 18, 24, 30].slice(0, 2 + level));
        const seconds = pick(rng, [24, 30, 36, 42, 48].slice(level, level + 3));
        const travelMeters = speedScale * 5 * seconds / 3;
        const vehicleLength = locomotive + carCount * carLength;
        const tunnel = travelMeters - vehicleLength;
        if (tunnel <= 20) return generators.decimalNaturalAdvanced({ rng, level, variant });
        const evidence = decimalEvidence("tunnel-length", [locomotive, carCount, carLength, speedScale, seconds, tunnel]);
        return result(`길이 ${locomotive}m인 기관차 1대와 길이 ${carLength}m인 객차 ${carCount}칸이 연결되어 있습니다. 이 기차가 1분에 ${fixedDecimal(speedScale, 1)}km를 가는 속력으로 달려 터널에 들어가기 시작한 뒤 완전히 빠져나오는 데 ${seconds}초가 걸렸습니다. 터널의 길이를 구하세요.${evidence}`, tunnel, `${seconds}초 동안 간 거리는 ${fixedDecimal(speedScale, 1)}×1000×${seconds}/60=${travelMeters}m입니다. 기차 길이 ${vehicleLength}m를 빼면 터널은 ${tunnel}m입니다.`);
      }
      if (kind === 9) {
        const valueScale = pick(rng, [125, 150, 175, 225, 240, 250, 275, 320, 375].slice(level, level + 6));
        const step = 100 / gcd(valueScale, 100);
        const candidates = Array.from({ length: 90 }, (_, index) => index + 10).filter(value => value % step === 0);
        const minimum = candidates[0];
        const maximum = candidates[candidates.length - 1];
        const answer = valueScale * (maximum - minimum) / 100;
        const evidence = decimalEvidence("natural-product-range", [valueScale, step, minimum, maximum, answer]);
        return result(`${fixedDecimal(valueScale, 2)}에 두 자리 자연수를 곱한 값이 자연수가 되게 합니다. 곱한 수가 가장 클 때의 곱과 가장 작을 때의 곱의 차를 구하세요.${evidence}`, answer, `${fixedDecimal(valueScale, 2)}=${valueScale / gcd(valueScale, 100)}/${100 / gcd(valueScale, 100)}이므로 곱한 수는 ${step}의 배수여야 합니다. 두 자리 수 중 가장 작은 값은 ${minimum}, 가장 큰 값은 ${maximum}이므로 곱의 차는 ${fixedDecimal(valueScale, 2)}×(${maximum}-${minimum})=${answer}입니다.`);
      }
      const divisor = int(rng, 37 + level * 6, 63 + level * 10);
      const targetScale = int(rng, 18 + level * 4, 35 + level * 8);
      const candidates = Array.from({ length: divisor * 8 }, (_, index) => index + 1).filter(value => Math.round(value / divisor * 10 + 1e-9) === targetScale);
      if (!candidates.length) return generators.decimalNaturalAdvanced({ rng, level, variant });
      const answer = candidates.reduce((sum, value) => sum + value, 0);
      const evidence = decimalEvidence("rounded-quotient-naturals", [divisor, targetScale, candidates[0], candidates[candidates.length - 1], answer]);
      return result(`자연수들을 ${divisor}로 나눈 몫을 소수 둘째 자리에서 반올림했더니 ${fixedDecimal(targetScale, 1)}가 되었습니다. 가능한 자연수를 모두 더한 값을 구하세요.${evidence}`, answer, `반올림 전 몫은 ${fixedDecimal(targetScale * 10 - 5, 2)} 이상 ${fixedDecimal(targetScale * 10 + 5, 2)} 미만입니다. 자연수를 확인하면 ${candidates.join(", ")}이고 합은 ${answer}입니다.`);
    },
    decimalDecimalAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 11;
      if (kind === 0) {
        const firstScale = int(rng, 125 + level * 20, 875 + level * 80);
        const secondScale = int(rng, 112 + level * 15, 685 + level * 70);
        const productScale = firstScale * secondScale;
        const productText = fixedDecimal(productScale, 4);
        const [whole, fractionPart] = productText.split(".");
        const positions = [0, 3];
        const masked = fractionPart.split("").map((digit, index) => positions.includes(index) ? "□" : digit).join("");
        const answer = positions.map(index => fractionPart[index]).join(", ");
        const evidence = decimalEvidence("missing-product-digits", [firstScale, secondScale, productScale, ...positions]);
        return result(`다음 곱에서 □에 들어갈 숫자를 왼쪽부터 차례로 쓰세요.<div class="equation">${fixedDecimal(firstScale, 2)} × ${fixedDecimal(secondScale, 2)} = ${whole}.${masked}</div>${evidence}`, answer, `자연수 ${firstScale}×${secondScale}=${productScale}을 계산한 뒤 소수점을 네 자리 왼쪽에 찍으면 ${productText}입니다. 따라서 ${answer}입니다.`);
      }
      if (kind === 1) {
        const divisorScale = int(rng, 24 + level * 4, 68 + level * 10);
        const centerScale = int(rng, 900 + level * 350, 2800 + level * 900);
        const targetScale = Math.round(centerScale / divisorScale);
        const candidates = Array.from({ length: 8000 }, (_, index) => index + 1).filter(value => Math.round(value / divisorScale + 1e-9) === targetScale);
        const minimum = candidates[0];
        const maximum = candidates[candidates.length - 1];
        const evidence = decimalEvidence("rounded-decimal-range", [divisorScale, targetScale, minimum, maximum]);
        return result(`소수 둘째 자리 수를 ${fixedDecimal(divisorScale, 1)}로 나눈 몫을 소수 둘째 자리에서 반올림했더니 ${fixedDecimal(targetScale, 1)}가 되었습니다. 가능한 소수 중 가장 작은 수와 가장 큰 수를 차례로 쓰세요.${evidence}`, `${fixedDecimal(minimum, 2)}, ${fixedDecimal(maximum, 2)}`, `조건을 만족하는 백분의 일 단위 수를 확인하면 ${fixedDecimal(minimum, 2)}부터 ${fixedDecimal(maximum, 2)}까지입니다.`);
      }
      if (kind === 2) {
        const sideScale = int(rng, 24 + level * 6, 72 + level * 12);
        const widthAddScale = int(rng, 5, 16 + level * 3);
        const heightAddScale = int(rng, 5, 16 + level * 3);
        const increaseScale = (sideScale + widthAddScale) * (sideScale + heightAddScale) - sideScale * sideScale;
        const evidence = decimalEvidence("square-area-increase", [sideScale, widthAddScale, heightAddScale, increaseScale]);
        return result(`정사각형의 가로를 ${fixedDecimal(widthAddScale, 1)}m, 세로를 ${fixedDecimal(heightAddScale, 1)}m 늘여 직사각형을 만들었더니 넓이가 ${fixedDecimal(increaseScale, 2)}m² 늘어났습니다. 처음 정사각형의 한 변을 구하세요.${evidence}`, fixedDecimal(sideScale, 1), `처음 한 변을 □m라 하면 늘어난 넓이는 (${fixedDecimal(widthAddScale, 1)}+${fixedDecimal(heightAddScale, 1)})×□+${fixedDecimal(widthAddScale * heightAddScale, 2)}입니다. 이를 풀면 □=${fixedDecimal(sideScale, 1)}m입니다.`);
      }
      if (kind === 3) {
        const selected = pick(rng, decimalDigitRelationCases);
        const answer = selected.sums[0];
        const evidence = decimalEvidence("digit-product-relation", [selected.product, selected.difference, answer, selected.values.length]);
        return result(`ㄱ, ㄴ, ㄷ, ㄹ은 서로 다른 한 자리 숫자이고 ㄱ.ㄴ < ㄷ.ㄹ입니다. 다음 두 조건을 모두 만족할 때 ㄱ+ㄴ+ㄷ+ㄹ을 구하세요.<div class="conditions"><p>ㄱ.ㄴ × ㄷ.ㄹ = ${fixedDecimal(selected.product, 2)}</p><p>|ㄱ.ㄷ × ㄴ.ㄹ - ㄱ.ㄴ × ㄷ.ㄹ| = ${fixedDecimal(selected.difference, 2)}</p></div>${evidence}`, answer, `서로 다른 숫자를 조건에 대입해 확인하면 가능한 배열의 숫자 합은 모두 ${answer}입니다.`);
      }
      if (kind === 4) {
        const count = 5 + level;
        const factors = Array.from({ length: count }, (_, index) => int(rng, 501 + index * 20, 680 + level * 80 + index * 25));
        const value = factors.reduce((product, factor) => product * factor / 100, 1);
        const answer = Math.floor(Math.log10(value)) + 1;
        const evidence = decimalEvidence("product-digit-count", [...factors, answer]);
        return result(`다음 곱을 직접 계산하지 않고, 곱의 정수 부분이 몇 자리인지 구하세요.<div class="equation">${factors.map(factor => fixedDecimal(factor, 2)).join(" × ")}</div>${evidence}`, answer, `각 수를 아래위의 간단한 자연수로 어림하여 곱의 범위를 잡으면 ${10 ** (answer - 1)} 이상 ${10 ** answer} 미만입니다. 따라서 정수 부분은 ${answer}자리입니다.`);
      }
      if (kind === 5) {
        const aScale = int(rng, 250, 620 + level * 120);
        const bScale = int(rng, 80, Math.min(aScale - 20, 240 + level * 60));
        const dScale = int(rng, 120, 360 + level * 80);
        const cScale = int(rng, 12, 35 + level * 8);
        const answerScale = (aScale - bScale + dScale) * cScale;
        const evidence = decimalEvidence("decimal-distributive", [aScale, bScale, dScale, cScale, answerScale]);
        return result(`분배법칙을 이용하여 계산하세요.<div class="equation">(${fixedDecimal(aScale, 2)} - ${fixedDecimal(bScale, 2)}) × ${fixedDecimal(cScale, 1)} + ${fixedDecimal(dScale, 2)} × ${fixedDecimal(cScale, 1)}</div>${evidence}`, fixedDecimal(answerScale, 3), `공통인 ${fixedDecimal(cScale, 1)}을 묶으면 (${fixedDecimal(aScale, 2)}-${fixedDecimal(bScale, 2)}+${fixedDecimal(dScale, 2)})×${fixedDecimal(cScale, 1)}=${fixedDecimal(answerScale, 3)}입니다.`);
      }
      if (kind === 6) {
        const widthCandidates = Array.from({ length: 301 + level * 50 }, (_, index) => 640 + level * 80 + index).filter(value => value % 10 !== 0);
        const widthScale = pick(rng, widthCandidates);
        const heightScale = int(rng, 580 + level * 70, 880 + level * 110);
        const topWidthScale = int(rng, Math.ceil(widthScale * 0.42), Math.floor(widthScale * 0.7));
        const rightHeightScale = int(rng, Math.ceil(heightScale * 0.42), Math.floor(heightScale * 0.7));
        const cutWidthScale = widthScale - topWidthScale;
        const cutHeightScale = heightScale - rightHeightScale;
        const answerScale = widthScale * heightScale - cutWidthScale * cutHeightScale;
        const svg = decimalLShapeSvg({ width: widthScale / 100, height: heightScale / 100, topWidth: topWidthScale / 100, rightHeight: rightHeightScale / 100 });
        const evidence = decimalEvidence("decimal-l-area", [widthScale, heightScale, topWidthScale, rightHeightScale, answerScale]);
        const answer = fixedDecimal(answerScale, 4);
        return result(`다음 ㄱ자 모양 도형의 넓이를 구하세요.${svg}${evidence}`, answer, `잘린 직사각형의 가로는 ${fixedDecimal(widthScale, 2)}-${fixedDecimal(topWidthScale, 2)}=${fixedDecimal(cutWidthScale, 2)}cm이고, 세로는 ${fixedDecimal(heightScale, 2)}-${fixedDecimal(rightHeightScale, 2)}=${fixedDecimal(cutHeightScale, 2)}cm입니다. 전체 직사각형 넓이 ${fixedDecimal(widthScale, 2)}×${fixedDecimal(heightScale, 2)}에서 잘린 직사각형 넓이 ${fixedDecimal(cutWidthScale, 2)}×${fixedDecimal(cutHeightScale, 2)}을 빼면 ${answer}cm²입니다.`);
      }
      if (kind === 7) {
        const divisorScale = int(rng, 125 + level * 20, 285 + level * 45);
        const quotientScale = int(rng, 24 + level * 5, 68 + level * 12);
        const remainderScale = int(rng, 5, Math.min(divisorScale * 5, 95 + level * 30));
        const originalScale = divisorScale * quotientScale + remainderScale;
        const correctScale = originalScale * divisorScale;
        const evidence = decimalEvidence("wrong-decimal-operation", [divisorScale, quotientScale, remainderScale, originalScale, correctScale]);
        return result(`어떤 수에 ${fixedDecimal(divisorScale, 1)}를 곱해야 할 것을 잘못하여 ${fixedDecimal(divisorScale, 1)}로 나누었더니 몫이 ${fixedDecimal(quotientScale, 1)}, 나머지가 ${fixedDecimal(remainderScale, 2)}였습니다. 바르게 계산한 값을 구하세요.${evidence}`, fixedDecimal(correctScale, 3), `어떤 수는 ${fixedDecimal(divisorScale, 1)}×${fixedDecimal(quotientScale, 1)}+${fixedDecimal(remainderScale, 2)}=${fixedDecimal(originalScale, 2)}입니다. 여기에 ${fixedDecimal(divisorScale, 1)}를 곱하면 ${fixedDecimal(correctScale, 3)}입니다.`);
      }
      if (kind === 8) {
        const slowScale = int(rng, 180 + level * 25, 360 + level * 60);
        const differenceScale = int(rng, 120 + level * 20, 280 + level * 45);
        const fastScale = slowScale + differenceScale;
        const minutes = pick(rng, [84, 90, 96, 102, 108].slice(level, level + 3));
        const answerScale = differenceScale * minutes / 6;
        const evidence = decimalEvidence("relative-distance", [fastScale, slowScale, minutes, answerScale]);
        return result(`승용차는 1시간에 ${fixedDecimal(fastScale, 1)}km, 버스는 1시간에 ${fixedDecimal(slowScale, 1)}km를 갑니다. 같은 곳에서 같은 방향으로 동시에 출발했을 때 ${Math.floor(minutes / 60)}시간 ${minutes % 60}분 후 두 차 사이의 거리를 구하세요.${evidence}`, fixedDecimal(answerScale, 2), `속력의 차는 ${fixedDecimal(differenceScale, 1)}km/h이고 ${minutes}분은 ${minutes}/60시간입니다. 따라서 거리는 ${fixedDecimal(differenceScale, 1)}×${minutes}/60=${fixedDecimal(answerScale, 2)}km입니다.`);
      }
      if (kind === 9) {
        const a = int(rng, 1, 8);
        const b = int(rng, 0, 9);
        const hidden = int(rng, 0, 9);
        const d = int(rng, 1, 8);
        const e = int(rng, 1, 9);
        const firstScale = 100 * a + 10 * b + hidden;
        const secondScale = 10 * d + e;
        const productScale = firstScale * secondScale;
        const candidates = Array.from({ length: 10 }, (_, digit) => digit).filter(digit => (100 * a + 10 * b + digit) * secondScale === productScale);
        const evidence = decimalEvidence("missing-factor-digit", [a, b, d, e, productScale, hidden]);
        return result(`다음 곱셈식의 □에 들어갈 숫자를 구하세요.<div class="equation">${a}.${b}□ × 0.${d}${e} = ${fixedDecimal(productScale, 4)}</div>${evidence}`, hidden, `□에 0부터 9까지 넣어 곱을 확인하면 조건에 맞는 숫자는 ${candidates.join(", ")}이고, 따라서 ${hidden}입니다.`);
      }
      const target = 3;
      const sideUnits = 4;
      const count = pick(rng, [40, 60, 80, 100, 120].slice(level, level + 3));
      const offsetScale = pick(rng, [10, 15, 20, 25, 30].slice(level, level + 3));
      const sideScale = sideUnits * offsetScale;
      const exactCellCount = 2 * count + 4 * sideUnits - 6 * target;
      const answerScale = exactCellCount * offsetScale * offsetScale;
      const svg = decimalSquareStackSvg({ side: sideScale / 10, count, offset: offsetScale / 10, target });
      const evidence = decimalEvidence("exact-three-overlap-squares", [sideScale, count, offsetScale, target, sideUnits, exactCellCount, answerScale]);
      const sideText = decimal(sideScale / 10, 1);
      const offsetText = decimal(offsetScale / 10, 1);
      const cellAreaText = decimal(offsetScale * offsetScale / 100, 2);
      const answerText = decimal(answerScale / 100, 2);
      return result(`한 변의 길이가 ${sideText}cm인 정사각형 종이 ${count}장을 가로와 세로 방향으로 각각 ${offsetText}cm씩 일정하게 옮겨 겹쳐 놓았습니다. 정확히 ${target}장만 겹쳐지는 부분의 넓이를 모두 더한 값을 구하세요.${svg}${evidence}`, answerText, `한 변을 ${offsetText}cm씩 나누면 가로와 세로가 각각 ${sideUnits}칸입니다. 처음과 마지막에는 정확히 ${target}장이 겹치는 작은 정사각형이 1개씩 있고, 그 사이 ${count - 2}곳에는 2개씩 있으므로 모두 1+2×${count - 2}+1=${exactCellCount}개입니다. 작은 정사각형 한 개의 넓이는 ${offsetText}×${offsetText}=${cellAreaText}cm²이므로 전체 넓이는 ${exactCellCount}×${cellAreaText}=${answerText}cm²입니다.`);
    },
    decimalMultiply({ rng, level }) {
      const a = int(rng, 12, 79) / 10;
      const b = level ? int(rng, 12, 49) / 10 : int(rng, 2, 9);
      const answer = decimal(a * b, 3);
      return result(`<div class="equation">${decimal(a)} × ${decimal(b)} = □</div>`, answer, `자연수처럼 곱한 뒤 두 수의 소수 자릿수만큼 소수점을 옮기면 ${answer}입니다.`);
    },
    cuboidPropertiesAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 5;
      if (kind === 0) {
        const dimensions = [int(rng, 2, 4 + level), int(rng, 2, 5 + level), int(rng, 2, 4 + level)];
        const answer = dimensions.reduce((product, value) => product * value, 1);
        return result(`모눈 한 칸이 작은 정육면체 한 개를 나타냅니다. 그림과 같은 직육면체를 만드는 작은 정육면체는 모두 몇 개인지 구하세요.${cuboidGridSvg({ a: dimensions[0], b: dimensions[1], c: dimensions[2] })}${cuboidEvidence("grid-cube-count", dimensions)}`, answer, `가로 ${dimensions[0]}칸, 세로 ${dimensions[1]}칸, 높이 ${dimensions[2]}칸이므로 ${dimensions.join("×")}=${answer}개입니다.`);
      }
      if (kind === 1) {
        const unit = pick(rng, [2, 3, 4, 5].slice(0, 2 + level));
        const factors = [int(rng, 2, 4 + level), int(rng, 2, 4 + level), int(rng, 2, 3 + level)];
        const dimensions = factors.map(value => value * unit);
        const side = gcdMany(dimensions);
        const counts = dimensions.map(value => value / side);
        const count = counts.reduce((product, value) => product * value, 1);
        const answer = `${count}개, ${12 * side}cm`;
        return result(`가로 ${dimensions[0]}cm, 세로 ${dimensions[1]}cm, 높이 ${dimensions[2]}cm인 직육면체를 가능한 한 큰 같은 정육면체로 남김없이 자릅니다. 자른 정육면체의 개수와 정육면체 한 개의 모든 모서리 길이의 합을 차례로 쓰세요.${cuboidSvg({ a: dimensions[0], b: dimensions[1], c: dimensions[2] })}${cuboidEvidence("max-cube-cut", [...dimensions, side, count, 12 * side])}`, answer, `세 길이를 모두 나누는 가장 큰 길이는 ${side}cm입니다. 각 방향으로 ${counts.join(", ")}개씩 잘리므로 ${count}개이고, 한 개의 모서리 길이의 합은 12×${side}=${12 * side}cm입니다.`);
      }
      if (kind === 2) {
        const partsA = int(rng, 2, 3 + level);
        const partsB = int(rng, 2, 3 + level);
        const unitA = int(rng, 2, 4 + level);
        const unitB = int(rng, 2, 4 + level);
        const height = int(rng, 2, 5 + level);
        const answer = partsA * partsB * 4 * (unitA + unitB + height);
        return result(`그림처럼 가로와 세로 두 방향으로 잘라 모두 같은 크기의 조각을 만들었습니다. 모든 조각의 모서리 길이의 합을 구하세요.${cuboidGridSvg({ a: partsA * unitA, b: partsB * unitB, c: height, cuts: Array.from({ length: partsA - 1 }, (_, index) => ({ axis: "a", at: (index + 1) * unitA })).concat(Array.from({ length: partsB - 1 }, (_, index) => ({ axis: "b", at: (index + 1) * unitB }))) })}${cuboidEvidence("cut-edge-sum-2d", [partsA, partsB, unitA, unitB, height])}`, answer, `조각 하나의 크기는 ${unitA}cm×${unitB}cm×${height}cm입니다. 한 조각의 모서리 길이의 합은 4×(${unitA}+${unitB}+${height})cm이고, 조각은 ${partsA}×${partsB}=${partsA * partsB}개이므로 ${answer}cm입니다.`);
      }
      if (kind === 3) {
        const n = int(rng, 3, 5 + level);
        const types = [];
        for (let a = 1; a <= n; a += 1) for (let b = a; b <= n; b += 1) for (let c = b; c <= n; c += 1) types.push([a, b, c]);
        return result(`한 모서리가 ${n}칸인 정육면체 모눈을 눈금선 따라 잘라 만들 수 있는 직육면체를 셉니다. 돌려서 같은 크기가 되는 것은 한 가지로 셀 때, 서로 다른 크기의 직육면체는 모두 몇 가지인지 구하세요.${cuboidGridSvg({ a: n, b: n, c: n })}${cuboidEvidence("grid-cuboid-types", [n, types.length])}`, types.length, `가로·세로·높이를 작은 수부터 a≤b≤c가 되게 정하면 돌려서 같은 것은 한 번만 셀 수 있습니다. 가능한 세 수를 모두 확인하면 ${types.length}가지입니다.`);
      }
      const brick = [int(rng, 1, 3), int(rng, 2, 4 + level), int(rng, 3, 5 + level)];
      const count = pick(rng, [6, 8, 12, 16, 18, 24].slice(0, 3 + level));
      const dimensions = new Set();
      for (let x = 1; x <= count; x += 1) for (let y = 1; y <= count; y += 1) {
        if (count % (x * y)) continue;
        const z = count / (x * y);
        [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].forEach(permutation => {
          const outer = [x * brick[permutation[0]], y * brick[permutation[1]], z * brick[permutation[2]]].sort((left, right) => left - right);
          dimensions.add(outer.join("×"));
        });
      }
      return result(`크기가 ${brick.join("cm×")}cm인 같은 블록 ${count}개를 모두 같은 방향으로 놓고, 빈틈없이 직육면체가 되게 쌓습니다. 큰 직육면체의 서로 다른 크기는 몇 가지인지 구하세요. 큰 직육면체를 돌려서 같은 크기가 되는 것은 한 가지로 셉니다.${cuboidSvg({ a: brick[0], b: brick[1], c: brick[2] })}${cuboidEvidence("cuboid-assembly-count", [...brick, count, dimensions.size])}`, dimensions.size, `블록의 세 방향을 놓는 방법과 ${count}를 세 수의 곱으로 나타내는 방법을 모두 확인합니다. 바깥 크기를 작은 수부터 정리해 겹치는 경우를 빼면 ${dimensions.size}가지입니다.`);
    },
    cuboidNetAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 5;
      if (kind === 0) {
        const a = int(rng, 5, 8 + level), b = int(rng, 3, 5 + level), c = int(rng, 2, 4 + level);
        const layout = cuboidNetLayout({ a, b, c });
        const papers = shuffle(rng, [[layout.width, layout.height], [layout.height, layout.width], [layout.width - 1, layout.height + 2], [layout.width + 2, layout.height - 1]]);
        const answer = papers.map(([width, height], index) => ((width >= layout.width && height >= layout.height) || (width >= layout.height && height >= layout.width)) ? index + 1 : null).filter(Boolean);
        return result(`그림의 전개도를 자르지 않고 종이 안에 그리려고 합니다. 종이를 90° 돌려도 됩니다. 전개도가 들어가는 종이의 번호를 모두 쓰세요.${measuredCuboidNetSvg({ a, b, c })}<div class="equation">${papers.map(([width, height], index) => `${index + 1}. ${width}cm×${height}cm`).join("　")}</div>${cuboidEvidence("net-paper-fit", [a, b, c, layout.width, layout.height, ...papers.flat(), ...answer])}`, answer.join(", "), `전개도의 가로와 세로는 ${layout.width}cm, ${layout.height}cm입니다. 종이를 돌린 경우까지 비교하면 ${answer.join(", ")}번 종이에 들어갑니다.`);
      }
      if (kind === 1) {
        const cut = int(rng, 2, 4 + level);
        const width = 4 * cut + int(rng, 4, 8 + level);
        const height = 4 * cut + int(rng, 4, 8 + level);
        const baseA = width - 2 * cut, baseB = height - 2 * cut;
        const answer = 4 * (baseA + baseB + cut);
        return result(`직사각형 종이의 네 모서리에서 한 변 ${cut}cm인 정사각형을 잘라 내고, 점선을 따라 접어 뚜껑 없는 상자를 만들었습니다. 만들어진 상자의 모든 모서리 길이의 합을 구하세요.${cornerCutBoxSvg({ width, height, cut })}${cuboidEvidence("corner-cut-edge-sum", [width, height, cut, baseA, baseB])}`, answer, `상자의 가로와 세로는 ${baseA}cm, ${baseB}cm이고 높이는 ${cut}cm입니다. 모든 모서리 길이의 합은 4×(${baseA}+${baseB}+${cut})=${answer}cm입니다.`);
      }
      if (kind === 2) {
        const a = int(rng, 5, 8 + level), b = int(rng, 3, 5 + level), c = int(rng, 2, 4 + level);
        const layout = cuboidNetLayout({ a, b, c });
        const answer = layout.width * layout.height;
        return result(`그림과 똑같은 전개도를 한 장의 직사각형 도화지에 빈틈없이 그립니다. 이 전개도를 담는 가장 작은 직사각형 도화지의 넓이를 구하세요.${measuredCuboidNetSvg({ a, b, c })}${cuboidEvidence("minimum-cuboid-net-paper", [a, b, c, layout.width, layout.height])}`, answer, `그림의 가로는 ${layout.width}cm, 세로는 ${layout.height}cm이므로 필요한 도화지의 넓이는 ${layout.width}×${layout.height}=${answer}cm²입니다.`);
      }
      if (kind === 3) {
        const a = int(rng, 4, 7 + level), b = int(rng, 3, 5 + level), c = int(rng, 2, 4 + level);
        const layout = cuboidNetLayout({ a, b, c });
        const marginX = int(rng, 1, 3), marginY = int(rng, 1, 3);
        const width = layout.width + 2 * marginX, height = layout.height + 2 * marginY;
        const faces = 2 * (a * b + a * c + b * c);
        const answer = width * height - faces;
        return result(`가로 ${width}cm, 세로 ${height}cm인 종이 한가운데에 그림과 같은 직육면체 전개도를 그리고 오렸습니다. 남은 종이의 넓이를 구하세요.${measuredCuboidNetSvg({ a, b, c, sheet: { width, height, marginX, marginY } })}${cuboidEvidence("net-waste", [a, b, c, width, height, faces])}`, answer, `종이의 넓이는 ${width}×${height}=${width * height}cm²이고, 전개도 여섯 면의 넓이는 ${faces}cm²입니다. 남는 넓이는 ${answer}cm²입니다.`);
      }
      const libraries = [
        [[2, 0], [1, 1], [2, 1], [0, 2], [1, 2]],
        [[1, 0], [1, 1], [0, 2], [1, 2], [0, 3]],
        [[1, 0], [0, 1], [1, 1], [1, 2], [2, 2]],
        [[1, 0], [2, 0], [1, 1], [0, 2], [1, 2]],
        [[1, 0], [1, 1], [1, 2], [0, 3], [1, 3]],
        [[2, 0], [0, 1], [1, 1], [2, 1], [2, 2]],
        [[1, 0], [1, 1], [0, 2], [1, 2], [1, 3]],
        [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]
      ];
      const base = pick(rng, libraries);
      const occupied = new Set(base.map(cell => cell.join(",")));
      const candidates = new Map();
      base.forEach(([x, y]) => [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
        const cell = [x + dx, y + dy];
        if (!occupied.has(cell.join(","))) candidates.set(cell.join(","), cell);
      }));
      const candidateCells = [...candidates.values()];
      const validIndexes = candidateCells.map((cell, index) => {
        try { foldCubeNet([...base, cell]); return index + 1; } catch { return null; }
      }).filter(Boolean);
      const answer = validIndexes.join(", ");
      return result(`그림의 다섯 칸에 번호가 붙은 칸 하나를 변이 맞닿게 이어 붙입니다. 정육면체 전개도가 되게 하는 번호를 모두 쓰세요.${advancedCubeNetSvg({ cells: base, candidates: candidateCells })}${cuboidEvidence("cube-net-completion-positions", [...base.flat(), ...candidateCells.flat(), ...validIndexes])}`, answer, `번호가 붙은 위치마다 한 칸을 더해 실제로 접어 봅니다. 여섯 면이 겹치지 않고 정육면체가 되는 번호는 ${answer}입니다.`);
    },
    cuboidNetViewAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 5;
      if (kind === 0) {
        const pairs = advancedCubeNetPairs(advancedCubeNetCells);
        const values = shuffle(rng, [1, 2, 3, 4, 5, 6]);
        const valid = pairs.map(pair => pair.map(index => values[index]));
        const vertex = [pairs[0][0], pairs[1][0], pairs[2][1]].map(index => values[index]);
        const invalid = [...pairs[0].map(index => values[index]), values[pick(rng, pairs[1])]];
        const choices = shuffle(rng, [vertex, valid.map(pair => pair[0]), valid.map(pair => pair[1]), invalid]);
        const answer = choices.findIndex(choice => choice.join(",") === invalid.join(",")) + 1;
        return result(`그림의 전개도를 접었을 때 한 꼭짓점에서 만날 수 없는 세 면의 번호를 고르세요.<div class="equation cuboid-choice-grid">${choices.map((choice, index) => `<span>${index + 1}. ${choice.join(", ")}</span>`).join("")}</div>${advancedCubeNetSvg({ values })}${cuboidEvidence("invalid-vertex-triple", [...values, ...pairs.flat(), answer])}`, answer, `한 꼭짓점에서는 서로 마주 보는 두 면이 함께 만날 수 없습니다. ${answer}번에는 서로 마주 보는 두 면이 있으므로 불가능합니다.`);
      }
      if (kind === 1) {
        const a = int(rng, 4, 7 + level), b = int(rng, 3, 6 + level), c = int(rng, 2, 5 + level);
        return result(`그림에서 굵게 표시한 모서리 AB와 평행한 다른 모서리 수, 그리고 AB와 만나지 않으면서 수직인 모서리 수를 차례로 쓰세요.${cuboidEdgeRelationSvg({ a, b, c })}${cuboidEvidence("edge-relation-count", [a, b, c, 3, 4])}`, "3개, 4개", `AB와 같은 방향의 모서리는 모두 4개이므로 AB를 빼면 3개입니다. AB에 수직인 두 방향의 모서리 중 AB의 양 끝에서 만나지 않는 것은 각각 2개씩이므로 4개입니다.`);
      }
      if (kind === 2) {
        const pairs = advancedCubeNetPairs(advancedCubeNetCells);
        const primes = shuffle(rng, [2, 3, 5, 7, 11, 13]);
        const values = Array(6).fill(0);
        pairs.forEach((pair, index) => { values[pair[0]] = primes[index * 2]; values[pair[1]] = primes[index * 2 + 1]; });
        const products = [];
        for (let first = 0; first < 2; first += 1) for (let second = 0; second < 2; second += 1) for (let third = 0; third < 2; third += 1) products.push(values[pairs[0][first]] * values[pairs[1][second]] * values[pairs[2][third]]);
        products.sort((left, right) => left - right);
        const answer = products[products.length - 2] - products[1];
        return result(`전개도를 접어 생기는 8개 꼭짓점마다 만나는 세 면의 수를 곱합니다. 두 번째로 작은 곱과 두 번째로 큰 곱의 차를 구하세요.${advancedCubeNetSvg({ values })}${cuboidEvidence("vertex-product-rank", [...values, ...products])}`, answer, `각 꼭짓점에서는 서로 마주 보는 세 쌍에서 하나씩 선택됩니다. 여덟 곱을 작은 수부터 정리하면 두 번째 수는 ${products[1]}, 두 번째로 큰 수는 ${products[products.length - 2]}이므로 차는 ${answer}입니다.`);
      }
      if (kind === 3) {
        const pairs = advancedCubeNetPairs(advancedCubeNetCells);
        let values, products;
        do {
          values = shuffle(rng, [1, 2, 3, 4, 5, 6]);
          products = pairs.map(pair => values[pair[0]] * values[pair[1]]);
        } while (products.filter(product => product === Math.max(...products)).length !== 1);
        const answer = Math.max(...products);
        return result(`전개도를 접었을 때 서로 마주 보는 세 쌍의 면에 적힌 수를 각각 곱합니다. 그중 가장 큰 곱을 구하세요.${advancedCubeNetSvg({ values })}${cuboidEvidence("opposite-product-max", [...values, ...products])}`, answer, `마주 보는 세 쌍의 곱은 ${products.join(", ")}입니다. 가장 큰 곱은 ${answer}입니다.`);
      }
      const a = int(rng, 3, 6 + level), b = int(rng, 3, 6 + level), c = int(rng, 3, 6 + level);
      const answer = a + b + c;
      return result(`그림의 A에서 B까지 직육면체의 모서리만 따라 가장 짧게 갑니다. 필요한 길이를 구하세요.${cuboidEdgeRouteSvg({ a, b, c })}${cuboidEvidence("edge-route-shortest", [a, b, c])}`, answer, `A와 B는 서로 마주 보는 꼭짓점입니다. 어느 짧은 길을 택해도 가로, 세로, 높이를 한 번씩 지나므로 ${a}+${b}+${c}=${answer}cm입니다.`);
    },
    cuboidApplicationAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 5;
      if (kind === 0) {
        const maps = [
          [[1, 2, 1], [2, 3, 2]],
          [[2, 1, 3], [1, 2, 2]],
          [[1, 3, 2], [2, 2, 1], [1, 2, 3]]
        ];
        const heights = pick(rng, maps.slice(0, 1 + level));
        const dimensions = [heights[0].length, heights.length, Math.max(...heights.flat())].sort((left, right) => right - left);
        return result(`각 바닥 칸에 쌓인 정육면체의 높이가 표와 같습니다. 이 쌓기나무 전체를 넣는 가장 작은 직육면체 상자의 가로, 세로, 높이를 큰 수부터 쓰세요.${heightMapTable({ title: "바닥 칸별 높이", heights })}${isometricStackSvg(heights)}${cuboidEvidence("minimum-cover-box", [...heights.flat(), ...dimensions])}`, dimensions.join(", "), `바닥의 가로 칸 수, 세로 칸 수, 가장 높은 칸을 확인하면 상자의 세 길이는 ${dimensions.join("cm, ")}cm입니다.`);
      }
      const a = int(rng, 4, 8 + level), b = int(rng, 3, 7 + level), c = int(rng, 2, 6 + level);
      if (kind === 1) {
        const loops = [2 * (a + b), 2 * (b + c), 2 * (c + a)];
        const answer = loops.reduce((sum, value) => sum + value, 0);
        return result(`그림처럼 서로 다른 세 방향으로 끈을 한 바퀴씩 둘렀습니다. 세 끈의 길이를 모두 더한 값을 구하세요.${loopCuboidSvg({ a, b, c })}${cuboidEvidence("three-loops", [a, b, c, ...loops])}`, answer, `세 끈의 길이는 각각 ${loops.map(value => `${value}cm`).join(", ")}입니다. 모두 더하면 ${answer}cm입니다.`);
      }
      if (kind === 2) {
        let small;
        do { small = [int(rng, 2, 4), int(rng, 2, 5), int(rng, 3, 6)]; } while (new Set(small).size !== 3);
        const box = [small[0] * int(rng, 2, 4 + level) + int(rng, 0, small[0] - 1), small[1] * int(rng, 2, 4 + level) + int(rng, 0, small[1] - 1), small[2] * int(rng, 2, 3 + level) + int(rng, 0, small[2] - 1)];
        const orientations = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
        const counts = orientations.map(order => order.map((axis, index) => Math.floor(box[index] / small[axis])).reduce((product, value) => product * value, 1));
        const answer = Math.max(...counts);
        return result(`안쪽 크기가 ${box.join("cm×")}cm인 상자에 크기가 ${small.join("cm×")}cm인 같은 직육면체를 모두 한 방향으로 가지런히 넣습니다. 놓는 방향을 바꾸어 비교할 때 최대 몇 개까지 들어가는지 구하세요.${cuboidSvg({ a: box[0], b: box[1], c: box[2] })}${cuboidEvidence("max-pack-rotations", [...box, ...small, ...counts])}`, answer, `작은 직육면체의 세 방향을 상자의 세 방향에 대응시키는 6가지 방법을 모두 비교합니다. 각 방법의 개수는 ${counts.join(", ")}개이므로 가장 많은 것은 ${answer}개입니다.`);
      }
      if (kind === 3) {
        const stack = int(rng, 3, 5 + level);
        const h = int(rng, 2, 6 + level);
        const knot = pick(rng, [4, 6, 8]);
        const rope = 2 * (a + stack * h) + knot;
        return result(`가로 ${a}cm인 같은 상자 ${stack}개를 세로로 쌓고 그림처럼 한 고리로 묶었습니다. 매듭을 묶는 데 ${knot}cm를 더 써서 끈의 전체 길이가 ${rope}cm였습니다. 상자 한 개의 높이를 구하세요.${stackedBoxLoopSvg({ width: a, stack })}${cuboidEvidence("stack-height", [a, stack, knot, rope, h])}`, h, `매듭 부분을 빼면 고리 길이는 ${rope}-${knot}=${rope - knot}cm입니다. 반으로 나누어 가로 ${a}cm를 빼면 전체 높이는 ${stack * h}cm이므로, 상자 한 개의 높이는 ${stack * h}÷${stack}=${h}cm입니다.`);
      }
      const edges = [int(rng, 6, 10 + level), int(rng, 3, 5 + level), int(rng, 2, 3 + level)].sort((left, right) => right - left);
      const loops = [2 * (edges[0] + edges[1]), 2 * (edges[1] + edges[2]), 2 * (edges[2] + edges[0])].sort((left, right) => left - right);
      return result(`직육면체를 세 방향으로 한 바퀴씩 두른 끈의 길이가 ${loops.map(value => `${value}cm`).join(", ")}입니다. 가장 짧은 모서리의 길이를 구하세요.${loopCuboidSvg({ a: edges[0], b: edges[1], c: edges[2], showDimensions: false })}${cuboidEvidence("edges-from-loops", [...edges, ...loops])}`, edges[2], `각 끈 길이의 반은 두 모서리의 합입니다. 가장 작은 두 합을 더하고 가장 큰 합을 빼면 가장 짧은 모서리의 2배가 되어, 가장 짧은 모서리는 ${edges[2]}cm입니다.`);
    },
    diceArrangementAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 5;
      if (kind === 0) return result(`서로 다른 여섯 글자를 정육면체의 여섯 면에 하나씩 적습니다. 정육면체를 돌려 같은 배치는 한 가지로 셉니다. 서로 다른 배치는 모두 몇 가지인지 구하세요.${diceSvg({ top: "가", front: "나", right: "다" })}${cuboidEvidence("dice-labeling-count", [6, 30])}`, 30, `한 글자를 윗면에 고정해도 됩니다. 맞은편 글자는 5가지이고, 옆면 네 글자는 정육면체를 돌려 같은 배열을 한 번만 세면 3×2×1=6가지입니다. 따라서 5×6=30가지입니다.`);
      if (kind === 1) {
        const pairs = advancedCubeNetPairs(advancedCubeNetCells);
        const values = Array(6).fill(0);
        const pairValues = shuffle(rng, [[1, 6], [2, 5], [3, 4]]);
        pairs.forEach((pair, index) => { values[pair[0]] = pairValues[index][0]; values[pair[1]] = pairValues[index][1]; });
        const blank = pick(rng, [0, 1, 2, 3, 4, 5]);
        const opposite = pairs.find(pair => pair.includes(blank)).find(index => index !== blank);
        const answer = values[blank];
        const displayed = values.map((value, index) => index === blank ? "□" : value);
        return result(`마주 보는 두 면의 합이 7인 주사위 전개도입니다. □에 들어갈 수를 구하세요.${advancedCubeNetSvg({ values: displayed, highlight: blank })}${cuboidEvidence("dice-net-missing", [...values, blank, opposite])}`, answer, `□의 면과 마주 보는 면의 수는 ${values[opposite]}입니다. 두 면의 합이 7이므로 □=${answer}입니다.`);
      }
      if (kind === 2) {
        const states = allStandardDiceOrientations();
        let start, sums, candidates;
        do {
          start = pick(rng, states);
          const views = [start];
          views.push(turnDiceVertically(views[0]));
          views.push(turnDiceVertically(views[1]));
          sums = views.map(state => state.top + state.south + state.east);
          candidates = states.filter(state => {
            const viewsForState = [state, turnDiceVertically(state), turnDiceVertically(turnDiceVertically(state))];
            return viewsForState.every((view, index) => view.top + view.south + view.east === sums[index]);
          });
        } while (candidates.length !== 1);
        return result(`같은 표준 주사위를 세 번 보았습니다. 처음 모습에서 보이는 세 면의 합은 ${sums[0]}이고, 윗면에서 보았을 때 시계 방향으로 90°씩 돌린 뒤의 합은 차례로 ${sums[1]}, ${sums[2]}입니다. 처음 주사위의 아랫면 수를 구하세요.${diceViewSumsSvg(sums)}${cuboidEvidence("dice-view-sums", [start.top, start.south, start.east, ...sums, start.bottom])}`, start.bottom, `시계 방향으로 90°씩 돌린 순서에 맞추어, 마주 보는 두 면의 합이 7인 모든 주사위 방향을 세 합과 대조하면 한 방향만 남습니다. 그때 처음 윗면은 ${start.top}이므로 아랫면은 ${start.bottom}입니다.`);
      }
      if (kind === 3) {
        const count = int(rng, 3, 5 + level);
        const answer = 7 * (count - 1);
        return result(`같은 방향의 표준 주사위 ${count}개를 한 줄로 놓았습니다. 이웃한 두 주사위가 맞닿는 면은 서로 마주 보는 면이므로 두 수의 합은 7입니다. 보이지 않는 모든 맞닿은 면의 수의 합을 구하세요.${diceRowSvg(count)}${cuboidEvidence("dice-contact-sum", [count, count - 1, answer])}`, answer, `맞닿는 곳은 ${count - 1}곳이고, 한 곳마다 보이지 않는 두 면의 합은 7입니다. 따라서 모두 7×${count - 1}=${answer}입니다.`);
      }
      const touching = pick(rng, [1, 2, 3, 4, 5, 6]);
      const floor = 7 - touching;
      const answer = 42 - 2 * touching - floor;
      return result(`같은 수 ${touching}이 적힌 면끼리 맞닿도록 표준 주사위 두 개를 쌓았습니다. 아랫주사위의 바닥면과 두 주사위가 맞닿은 면은 보이지 않습니다. 보이는 모든 면의 수의 합을 구하세요.${stackedDiceSvg(touching)}${cuboidEvidence("dice-visible", [touching, floor, answer])}`, answer, `두 주사위의 모든 면의 수의 합은 42입니다. 맞닿아 숨은 두 면의 수 ${touching}과 ${touching}, 바닥면 ${floor}을 빼면 ${answer}입니다.`);
    },
    diceRollingAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 5;
      if (kind === 0) {
        const start = pick(rng, allStandardDiceOrientations());
        const moves = selfAvoidingDicePath(rng, 3 + level);
        const end = moves.reduce(rollDice, start);
        return result(`그림의 주사위를 격자 길을 따라 한 칸씩 굴렸습니다. 마지막 칸에서의 윗면 수를 구하세요.${diceSvg({ top: start.top, front: start.south, right: start.east })}${diceGridPathSvg({ paths: [moves] })}${cuboidEvidence("dice-roll-top", [start.top, start.bottom, start.north, start.south, start.east, start.west, ...moves.map(move => "NSEW".indexOf(move))])}`, end.top, `격자 길을 따라 한 칸씩 굴리며 윗면을 바꾸어 기록하면 마지막 윗면은 ${end.top}입니다.`);
      }
      if (kind === 1) {
        const labels = shuffle(rng, [1, 2, 3, 4, 5, 6]);
        const start = { top: labels[0], bottom: labels[1], north: labels[2], south: labels[3], east: labels[4], west: labels[5] };
        const end = rollDice(start, "E");
        return result(`1부터 6까지의 수를 한 번씩 임의로 적은 같은 주사위를 동쪽으로 한 칸 굴린 기록입니다. 굴린 뒤 윗면과 마주 보는 면의 수를 구하세요.${diceSvg({ top: start.top, front: start.south, right: start.east })}${diceGridPathSvg({ paths: [["E"]] })}<div class="equation">처음 위 ${start.top}, 처음 오른쪽 ${start.east}　→　굴린 뒤 위 ${end.top}</div>${cuboidEvidence("dice-opposite-record", [start.top, start.bottom, start.north, start.south, start.east, start.west, end.top, end.bottom])}`, end.bottom, `동쪽으로 굴리면 처음 오른쪽 면은 아랫면으로 갑니다. 굴린 뒤 윗면 ${end.top}과 마주 보는 면은 ${end.bottom}입니다.`);
      }
      if (kind === 2) {
        const start = pick(rng, allStandardDiceOrientations());
        const paths = [["E", "N", "E", "E"], ["N", "N", "E", "S"], ["E", "E", "S", "E"]].map(path => path.slice(0, 2 + level));
        const ends = paths.map(path => path.reduce(rollDice, start));
        const answer = ends.reduce((sum, state) => sum + state.bottom, 0);
        return result(`같은 방향으로 놓은 주사위 세 개를 각각 A, B, C 길을 따라 굴렸습니다. 세 주사위의 마지막 바닥면 수의 합을 구하세요.${diceSvg({ top: start.top, front: start.south, right: start.east })}${diceGridPathSvg({ paths, labels: ["A", "B", "C"] })}${cuboidEvidence("rolling-bottom-paths", [start.top, start.bottom, start.north, start.south, start.east, start.west, ...ends.map(state => state.bottom)])}`, answer, `A, B, C 길을 따라 굴린 뒤 바닥면은 차례로 ${ends.map(state => state.bottom).join(", ")}입니다. 합은 ${answer}입니다.`);
      }
      if (kind === 3) {
        const start = pick(rng, allStandardDiceOrientations());
        const moves = selfAvoidingDicePath(rng, 5 + level);
        let state = start;
        let answer = 0;
        moves.forEach(move => { state = rollDice(state, move); answer += state.top; });
        return result(`그림의 주사위를 격자 길을 따라 굴립니다. 매 칸에 도착한 직후의 윗면 수를 모두 더한 값을 구하세요.${diceSvg({ top: start.top, front: start.south, right: start.east })}${diceGridPathSvg({ paths: [moves] })}${cuboidEvidence("dice-path-sum", [start.top, start.bottom, start.north, start.south, start.east, start.west, ...moves.map(move => "NSEW".indexOf(move))])}`, answer, `각 이동 뒤의 윗면을 차례로 기록해 더하면 ${answer}입니다.`);
      }
      const pathA = ["E", "N", "E"];
      const pathB = ["N", "E", "N"];
      const states = allStandardDiceOrientations();
      let start, candidates, sumA, sumB;
      const sumPath = (state, path) => path.reduce((sum, move) => { const next = rollDice(state, move); Object.assign(state, next); return sum + state.top; }, 0);
      do {
        start = pick(rng, states);
        sumA = sumPath({ ...start }, pathA);
        sumB = sumPath({ ...start }, pathB);
        candidates = states.filter(state => state.top === start.top && state.south === start.south && sumPath({ ...state }, pathA) === sumA && sumPath({ ...state }, pathB) === sumB);
      } while (candidates.length !== 1);
      return result(`표준 주사위의 위가 ${start.top}, 앞이 ${start.south}입니다. A와 B의 격자 길을 따라 굴렸을 때 각 칸에 도착한 뒤 윗면의 합이 각각 ${sumA}, ${sumB}였습니다. 처음 오른쪽 면의 수를 구하세요.${diceGridPathSvg({ paths: [pathA, pathB], labels: ["A", "B"] })}${cuboidEvidence("dice-two-paths", [start.top, start.south, sumA, sumB, start.east])}`, start.east, `위와 앞면 조건을 만족하는 오른쪽 면 후보를 두 길에 각각 적용합니다. 두 합을 모두 만족하는 방향은 하나이고, 오른쪽 면은 ${start.east}입니다.`);
    },
    prismElementsNetAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      const sides = int(rng, 5, 7 + level);
      if (kind === 0) {
        const relation = 2 * sides + 2;
        return result(`어떤 각기둥의 모서리 수와 면 수의 합에서 꼭짓점 수를 뺐더니 ${relation}이었습니다. 이 각기둥의 한 밑면은 몇 각형입니까?${angularSolidEvidence("prism-relation", [sides, relation])}`, sides, `한 밑면이 n각형인 각기둥은 꼭짓점 2n개, 모서리 3n개, 면 n+2개입니다. 3n+(n+2)-2n=${relation}이므로 n=${sides}입니다.`);
      }
      if (kind === 1) {
        const side = int(rng, 3, 6 + level);
        const height = int(rng, 7, 12 + level * 2);
        const lateralArea = sides * side * height;
        const answer = 2 * sides * side + sides * height;
        return result(`밑면의 모든 변의 길이가 ${side}cm인 각기둥의 옆넓이는 ${lateralArea}cm²이고 높이는 ${height}cm입니다. 이 각기둥의 모든 모서리 길이의 합을 구하세요.${angularPrismSvg({ sides, side, height })}${angularSolidEvidence("prism-lateral-area", [sides, side, height, lateralArea])}`, answer, `밑면의 둘레는 ${lateralArea}÷${height}=${sides * side}cm이므로 밑면은 ${sides}각형입니다. 두 밑면의 둘레와 옆모서리 ${sides}개의 합은 ${answer}cm입니다.`);
      }
      if (kind === 2) {
        const side = int(rng, 3, 7 + level);
        const height = side + int(rng, 2, 5 + level);
        const joins = sides + 1;
        const tallA = int(rng, 1, Math.max(1, joins - 2));
        let tallB = int(rng, 1, Math.max(1, joins - 1));
        if (tallB === tallA) tallB = tallA === joins - 1 ? tallA - 1 : tallA + 1;
        const joinA = tallA * height + (joins - tallA) * side;
        const joinB = tallB * height + (joins - tallB) * side;
        const answer = 2 * Math.abs(joinA - joinB);
        return result(`밑면이 정${sides}각형이고 높이가 ${height}cm인 각기둥의 전개도 A와 B가 있습니다. 모든 면을 따로 놓았을 때 변 길이의 합은 같고, 전개도에서 서로 붙여 둔 변 길이의 합은 A가 ${joinA}cm, B가 ${joinB}cm입니다. 두 전개도 둘레의 차를 구하세요.${prismNetStripSvg({ sides, side, height })}${angularSolidEvidence("prism-net-perimeter", [sides, side, height, joinA, joinB])}`, answer, `붙인 변은 둘레에서 두 번씩 빠집니다. 따라서 두 전개도 둘레의 차는 2×|${joinA}-${joinB}|=${answer}cm입니다.`);
      }
      if (kind === 3) {
        const total = 12 * sides + 4;
        return result(`한 밑면이 ${sides}각형인 각기둥을 밑면과 평행한 면으로 한 번 잘라 두 각기둥으로 나누었습니다. 두 각기둥의 면, 모서리, 꼭짓점 수를 모두 합한 값을 구하세요.${angularPrismSvg({ sides, side: 4, height: 9 })}${angularSolidEvidence("prism-parallel-cut", [sides])}`, total, `각 ${sides}각기둥은 면 ${sides + 2}개, 모서리 ${3 * sides}개, 꼭짓점 ${2 * sides}개로 합이 ${6 * sides + 2}입니다. 두 개이므로 ${total}입니다.`);
      }
      if (kind === 4) {
        const height = int(rng, 4, 8 + level);
        const widths = Array.from({ length: sides }, () => int(rng, 2, 7 + level));
        const areas = widths.map(width => width * height);
        const perimeter = widths.reduce((sum, value) => sum + value, 0);
        const answer = 2 * perimeter + sides * height;
        return result(`높이가 ${height}cm인 각기둥의 옆면 넓이는 차례로 다음과 같습니다. 이 각기둥의 모든 모서리 길이의 합을 구하세요.${valueTable(areas.map((_, index) => `옆면 ${index + 1}`), areas.map(value => `${value}cm²`))}${angularSolidEvidence("prism-face-areas", [sides, height, ...areas])}`, answer, `각 옆면의 가로 길이는 넓이를 높이 ${height}cm로 나눈 값입니다. 밑면 둘레는 ${perimeter}cm이므로 모든 모서리 길이의 합은 2×${perimeter}+${sides}×${height}=${answer}cm입니다.`);
      }
      const side = int(rng, 3, 7 + level);
      const height = int(rng, 6, 11 + level * 2);
      const perimeter = sides * side;
      const answer = 2 * perimeter + sides * height;
      return result(`옆면 ${sides}개를 한 줄로 펼친 전개도의 가로 길이는 ${perimeter}cm이고 세로 길이는 ${height}cm입니다. 이 각기둥의 모든 모서리 길이의 합을 구하세요.${prismNetStripSvg({ sides, side, height })}${angularSolidEvidence("prism-net-dimensions", [sides, side, height, perimeter])}`, answer, `가로 길이는 밑면의 둘레 ${perimeter}cm입니다. 두 밑면의 모서리와 옆모서리를 합하면 2×${perimeter}+${sides}×${height}=${answer}cm입니다.`);
    },
    prismApplicationAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      const sides = int(rng, 5, 7 + level);
      if (kind === 0) {
        const side = int(rng, 3, 7 + level);
        const span = int(rng, 2, Math.min(sides - 1, 3 + level));
        const height = side * span;
        return result(`밑면의 한 변이 ${side}cm인 각기둥의 옆면을 펼쳤습니다. 선분은 아래 꼭짓점에서 시작하여 옆면 ${span}개를 연속해서 지나며 밑면의 변과 45°를 이룹니다. 선분이 도착한 높이를 구하세요.${prismNetStripSvg({ sides, side, height, span })}${angularSolidEvidence("prism-45-rise", [sides, side, span])}`, height, `펼친 옆면에서 45° 선분의 가로 이동 거리와 세로 이동 거리는 같습니다. 가로로 ${side}×${span}=${height}cm 이동하므로 높이도 ${height}cm입니다.`);
      }
      if (kind === 1) {
        const answer = 9 * sides;
        return result(`밑면이 정${sides}각형인 각기둥의 두 밑면 중심을 각 꼭짓점과 잇고, 그 선을 따라 잘라 서로 떨어진 삼각기둥으로 나누었습니다. 만들어진 모든 삼각기둥의 모서리 수의 합을 구하세요.${angularPrismSvg({ sides, side: 4, height: 8 })}${angularSolidEvidence("prism-radial-split", [sides])}`, answer, `삼각기둥은 ${sides}개 생기고, 삼각기둥 하나의 모서리는 9개입니다. 서로 떨어진 입체의 모서리를 각각 세므로 ${sides}×9=${answer}개입니다.`);
      }
      if (kind === 2) {
        const side = int(rng, 3, 6 + level);
        const span = int(rng, 2, Math.min(sides - 1, 4 + level));
        return result(`각기둥의 옆면에 그은 선을 전개도에 옮기니 1번 옆면의 왼쪽 아래 꼭짓점에서 ${span}번 옆면의 오른쪽 위 꼭짓점까지 곧게 이어졌습니다. 이 선이 지나가는 옆면은 모두 몇 개입니까?${prismNetStripSvg({ sides, side, height: 8, span })}${angularSolidEvidence("prism-crossed-faces", [sides, span])}`, span, `전개도에서 선분은 번호가 연속된 1번부터 ${span}번 옆면까지 지나므로 모두 ${span}개입니다.`);
      }
      if (kind === 3) {
        const triple = pick(rng, [[3, 4, 5], [5, 12, 13], [8, 15, 17]]);
        const scale = int(rng, 1, 1 + level);
        const width = triple[0] * scale, height = triple[1] * scale, answer = triple[2] * scale;
        const faces = int(rng, 2, 3 + Math.min(level, 1));
        return result(`각기둥 겉면의 두 점을 잇기 위해 지나갈 옆면 ${faces}개를 그림처럼 한 평면에 펼쳤습니다. 두 점의 가로 차는 ${width}cm, 세로 차는 ${height}cm입니다. 겉면을 따라가는 가장 짧은 거리를 구하세요.${surfaceRouteSvg({ faces, width, height })}${angularSolidEvidence("prism-shortest-route", [faces, width, height, answer])}`, answer, `펼친 면에서 가장 짧은 길이는 두 점을 잇는 직선입니다. √(${width}²+${height}²)=${answer}cm입니다.`);
      }
      if (kind === 4) {
        const vertices = 6 * sides;
        const edges = 9 * sides;
        const faces = 3 * sides + 2;
        const answer = vertices + edges + faces;
        return result(`한 밑면이 ${sides}각형인 각기둥의 모든 꼭짓점을 각 꼭짓점에 모인 모서리의 같은 길이만큼씩 잘라 냈습니다. 잘라 낸 뒤 남은 입체의 면, 모서리, 꼭짓점 수의 합을 구하세요.${angularPrismSvg({ sides, side: 5, height: 9 })}${angularSolidEvidence("prism-truncated", [sides])}`, answer, `원래 모서리 하나마다 새 꼭짓점이 2개이므로 꼭짓점은 ${vertices}개, 모서리는 원래 모서리 수의 3배인 ${edges}개입니다. 면은 원래 면과 꼭짓점마다 하나씩 늘어 ${faces}개이므로 합은 ${answer}입니다.`);
      }
      const side = int(rng, 3, 7 + level);
      const span = int(rng, 2, Math.min(sides - 1, 4 + level));
      const height = 2 * int(rng, 3, 7 + level);
      const answer = side * span * height / 2;
      return result(`각기둥의 옆면을 펼치니 가로 ${side}cm인 옆면 ${span}개와 높이 ${height}cm를 두 변으로 하는 삼각형이 생겼습니다. 이 삼각형의 넓이를 구하세요.${prismNetStripSvg({ sides, side, height, span })}${angularSolidEvidence("prism-unfolded-triangle", [sides, side, span, height])}`, answer, `삼각형의 밑변은 ${side}×${span}=${side * span}cm이고 높이는 ${height}cm입니다. 넓이는 ${side * span}×${height}÷2=${answer}cm²입니다.`);
    },
    pyramidElementsNetAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      const sides = int(rng, 4, 7 + level);
      if (kind === 0) {
        const faceSum = 2 * sides + 3;
        const answer = 6 * sides * sides;
        return result(`밑면의 모양이 같은 각기둥과 각뿔이 있습니다. 두 입체의 면 수의 합은 ${faceSum}개입니다. 두 입체의 모서리 수의 곱을 구하세요.${angularSolidEvidence("prism-pyramid-face-sum", [sides, faceSum])}`, answer, `밑면을 n각형이라 하면 면 수의 합은 (n+2)+(n+1)=2n+3입니다. n=${sides}이고 모서리 수는 각각 ${3 * sides}, ${2 * sides}이므로 곱은 ${answer}입니다.`);
      }
      if (kind === 1) {
        const side = int(rng, 3, 6 + level);
        const lateral = side + int(rng, 2, 5 + level);
        const totalJoins = sides;
        const lateralA = int(rng, 1, totalJoins - 1);
        let lateralB = int(rng, 1, totalJoins - 1);
        if (lateralB === lateralA) lateralB = lateralA === totalJoins - 1 ? lateralA - 1 : lateralA + 1;
        const joinA = lateralA * lateral + (totalJoins - lateralA) * side;
        const joinB = lateralB * lateral + (totalJoins - lateralB) * side;
        const answer = 2 * Math.abs(joinA - joinB);
        return result(`밑면이 정${sides}각형이고 옆모서리가 ${lateral}cm인 각뿔의 두 전개도 A, B가 있습니다. 모든 면을 따로 놓았을 때 변 길이의 합은 같고, 서로 붙여 둔 변 길이의 합은 A가 ${joinA}cm, B가 ${joinB}cm입니다. 두 전개도 둘레의 차를 구하세요.${angularPyramidSvg({ sides, side, lateral })}${angularSolidEvidence("pyramid-net-perimeter", [sides, side, lateral, joinA, joinB])}`, answer, `붙인 변은 전개도 둘레에서 두 번씩 빠집니다. 따라서 둘레의 차는 2×|${joinA}-${joinB}|=${answer}cm입니다.`);
      }
      if (kind === 2) {
        const side = int(rng, 3, 6 + level);
        const height = 2 * int(rng, 3, 6 + level);
        const lateral = side + height / 2;
        return result(`밑면이 같은 정${sides}각형인 각뿔과 각기둥이 있습니다. 밑면 한 변은 ${side}cm, 각뿔의 옆모서리는 ${lateral}cm이고 두 입체의 모든 모서리 길이의 합이 같습니다. 각기둥의 높이를 구하세요.${angularPyramidSvg({ sides, side, lateral })}${angularSolidEvidence("equal-edge-sums", [sides, side, lateral])}`, height, `각뿔의 모서리 합은 2×${sides}×${lateral}, 각기둥은 2×${sides}×${side}+${sides}×높이입니다. 두 값을 같게 하면 높이는 2×(${lateral}-${side})=${height}cm입니다.`);
      }
      if (kind === 3) {
        const pyramidSides = int(rng, 4, 6 + level);
        const answer = (6 * sides + 2) + (4 * pyramidSides + 2);
        return result(`밑면이 ${sides}각형인 각기둥의 전개도와 밑면이 ${pyramidSides}각형인 각뿔의 전개도가 있습니다. 두 입체의 면, 모서리, 꼭짓점 수를 모두 합한 값을 구하세요.${angularSolidEvidence("two-solid-totals", [sides, pyramidSides])}`, answer, `${sides}각기둥의 합은 6×${sides}+2=${6 * sides + 2}, ${pyramidSides}각뿔의 합은 4×${pyramidSides}+2=${4 * pyramidSides + 2}이므로 모두 ${answer}입니다.`);
      }
      if (kind === 4) {
        const segments = int(rng, 3, 5 + level);
        const answer = (sides + 1) + 2 * sides * (segments - 1);
        return result(`밑면이 ${sides}각형인 각뿔의 모든 모서리를 ${segments}등분하고, 꼭짓점을 포함하여 등분점마다 점을 찍습니다. 서로 겹치는 점을 한 번만 셀 때 모두 몇 개입니까?${angularPyramidSvg({ sides, side: segments, lateral: segments })}${angularSolidEvidence("pyramid-edge-points", [sides, segments])}`, answer, `각뿔의 꼭짓점은 ${sides + 1}개이고 모서리는 ${2 * sides}개입니다. 각 모서리 안쪽에 ${segments - 1}개씩 새 점이 생기므로 ${sides + 1}+${2 * sides}×${segments - 1}=${answer}개입니다.`);
      }
      const side = int(rng, 3, 6 + level);
      const height = int(rng, 5, 9 + level);
      const lateral = int(rng, side + 2, side + 6 + level);
      const prismTotal = 2 * sides * side + sides * height;
      const pyramidTotal = 2 * sides * lateral;
      const answer = Math.abs(prismTotal - pyramidTotal);
      return result(`같은 수의 종이 막대를 사용해 밑면이 정${sides}각형인 각기둥과 각뿔의 모서리 틀을 각각 만들었습니다. 각기둥은 밑면 한 변 ${side}cm, 높이 ${height}cm이고 각뿔의 모든 모서리는 ${lateral}cm입니다. 필요한 종이 막대 길이의 차를 구하세요.${angularSolidEvidence("solid-edge-length-difference", [sides, side, height, lateral])}`, answer, `각기둥은 ${prismTotal}cm, 각뿔은 ${pyramidTotal}cm가 필요하므로 차는 ${answer}cm입니다.`);
    },
    pyramidApplicationAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      const sides = int(rng, 4, 7 + level);
      if (kind === 0) {
        const vertices = 2 * sides + 1;
        const edges = 4 * sides;
        const faces = 2 * sides + 1;
        const answer = vertices + edges + faces;
        return result(`밑면이 같은 ${sides}각기둥과 ${sides}각뿔을 밑면끼리 완전히 붙였습니다. 만들어진 입체의 면, 모서리, 꼭짓점 수의 합을 구하세요.${angularSolidEvidence("glued-prism-pyramid", [sides])}`, answer, `붙인 밑면은 사라집니다. 꼭짓점은 ${vertices}개, 모서리는 ${edges}개, 면은 ${faces}개이므로 합은 ${answer}입니다.`);
      }
      if (kind === 1) {
        const side = 2 * int(rng, 3, 7 + level);
        const answer = side;
        return result(`모든 모서리 길이가 ${side}cm인 정삼각뿔의 서로 이웃한 두 옆면에서, 각 면의 두 변의 중점을 이은 선분을 하나씩 그어 이어 붙였습니다. 두 선분 길이의 합을 구하세요.${angularPyramidSvg({ sides: 3, side, lateral: side })}${angularSolidEvidence("tetra-midpoint-route", [side])}`, answer, `삼각형에서 두 변의 중점을 이은 선분은 나머지 한 변 길이의 절반입니다. 각 선분은 ${side / 2}cm이고 두 개의 합은 ${answer}cm입니다.`);
      }
      if (kind === 2) {
        const triple = pick(rng, [[3, 4, 5], [5, 12, 13], [8, 15, 17]]);
        const scale = int(rng, 1, 1 + level);
        const width = triple[0] * scale, height = triple[1] * scale, answer = triple[2] * scale;
        return result(`사각뿔의 서로 이웃한 옆면 두 개를 그림처럼 펼쳤습니다. 두 점의 가로 차는 ${width}cm, 세로 차는 ${height}cm입니다. 사각뿔의 겉면을 따라 두 점을 잇는 가장 짧은 거리를 구하세요.${surfaceRouteSvg({ faces: 2, width, height, label: "옆면 두 개를 펼친 모습" })}${angularSolidEvidence("pyramid-shortest-route", [2, width, height, answer])}`, answer, `두 옆면을 펼친 평면에서 직선이 가장 짧습니다. √(${width}²+${height}²)=${answer}cm입니다.`);
      }
      if (kind === 3) {
        const vertices = sides + 2;
        const edges = 3 * sides;
        const faces = 2 * sides;
        const answer = vertices + edges + faces;
        return result(`밑면이 같은 ${sides}각뿔 두 개를 밑면끼리 완전히 붙였습니다. 만들어진 입체의 면, 모서리, 꼭짓점 수의 합을 구하세요.${angularSolidEvidence("glued-two-pyramids", [sides])}`, answer, `두 꼭짓점과 공통 밑면의 꼭짓점 ${sides}개로 꼭짓점은 ${vertices}개입니다. 모서리는 ${edges}개, 면은 ${faces}개이므로 합은 ${answer}입니다.`);
      }
      if (kind === 4) {
        const base = 2 * int(rng, 3, 6 + level);
        const outer = base + 2 * int(rng, 3, 7 + level);
        const answer = base * outer;
        return result(`한 변이 ${outer}cm인 정사각형 안에 그림과 같이 밑면 한 변이 ${base}cm인 사각뿔의 전개도를 그렸습니다. 네 옆면의 꼭짓점은 바깥 정사각형의 각 변에 놓입니다. 전개도의 넓이를 구하세요.${pyramidCrossNetSvg({ base, outer })}${angularSolidEvidence("square-pyramid-net-area", [base, outer])}`, answer, `가운데 정사각형 넓이는 ${base}²이고, 네 삼각형 넓이의 합은 ${base}×(${outer}-${base})입니다. 전체는 ${base}²+${base}×(${outer}-${base})=${answer}cm²입니다.`);
      }
      const triple = pick(rng, [[3, 4, 5], [5, 12, 13], [8, 15, 17]]);
      const scale = int(rng, 1, 1 + level);
      const width = triple[0] * scale, height = triple[1] * scale, answer = triple[2] * scale;
      return result(`정사면체의 네 면을 모두 지나도록 두 점을 잇는 경로를 전개도 위에 나타냈습니다. 펼친 전개도에서 두 점의 가로 차는 ${width}cm, 세로 차는 ${height}cm입니다. 가장 짧은 경로의 길이를 구하세요.${surfaceRouteSvg({ faces: 4, width, height, label: "네 면을 모두 지나는 전개도 경로" })}${angularSolidEvidence("tetra-all-face-route", [4, width, height, answer])}`, answer, `전개도에서 네 면을 모두 지나는 범위가 고정되어 있으므로 두 점을 잇는 직선이 가장 짧습니다. 길이는 √(${width}²+${height}²)=${answer}cm입니다.`);
    },
    decimalNaturalDivisionAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const target = int(rng, 4, 6 + level);
        const offsets = shuffle(rng, [-12, -5, 7, 16].slice(0, 3 + Math.min(level, 1)));
        const labels = ["ㄱ", "ㄴ", "ㄷ", "ㄹ"].slice(0, offsets.length);
        const divisors = shuffle(rng, [6, 8, 12, 16]).slice(0, offsets.length);
        const quotients = offsets.map(offset => target + offset / 10);
        const expressions = quotients.map((quotient, index) => `${labels[index]} ${decimal(quotient * divisors[index], 2)}÷${divisors[index]}`);
        const answer = labels.map((label, index) => ({ label, distance: Math.abs(offsets[index]) })).sort((a, b) => a.distance - b.distance).map(item => item.label).join(", ");
        return result(`다음 계산 결과를 ${target}에 가까운 순서대로 기호를 쓰세요.<div class="equation">${expressions.join("　　")}</div>${decimalDivisionEvidence("closest-quotients", [target * 10, ...quotients.map(value => Math.round(value * 10))])}`, answer, `각 몫은 ${quotients.map((value, index) => `${labels[index]}=${decimal(value, 2)}`).join(", ")}입니다. ${target}과의 차가 작은 순서는 ${answer}입니다.`);
      }
      if (kind === 1) {
        const q1 = int(rng, 6, 18 + level * 4), q2 = q1 + int(rng, 3, 8);
        const b1 = int(rng, 4, 9), b2 = int(rng, 4, 9);
        const a1 = b1 * (10 + q1) / 10, a2 = b2 * (10 + q2) / 10;
        const answer = decimal(Math.abs(q2 - q1) / 10, 2);
        return result(`두 수 a, b에 대하여 a★b=(a-b)÷b로 약속합니다. 다음 두 계산 결과의 차를 구하세요.<div class="equation">${decimal(a1, 2)}★${b1}　　${decimal(a2, 2)}★${b2}</div>${decimalDivisionEvidence("defined-operation", [q1, q2])}`, answer, `첫 결과는 ${decimal(q1 / 10, 2)}, 둘째 결과는 ${decimal(q2 / 10, 2)}이므로 차는 ${answer}입니다.`);
      }
      if (kind === 2) {
        const base = int(rng, 8, 15 + level * 2), height = int(rng, 3, 8 + level), square = int(rng, 4, 8 + level);
        const total = base * height + square * square;
        return result(`평행사변형과 정사각형을 겹치지 않게 이어 붙인 도형의 넓이는 ${total}cm²입니다. 평행사변형의 높이 □를 구하세요.${decimalCompositeAreaSvg({ base, height, square })}${decimalDivisionEvidence("composite-missing-height", [base, square, total])}`, height, `정사각형의 넓이 ${square * square}cm²를 빼면 평행사변형의 넓이는 ${base * height}cm²입니다. ${base * height}÷${base}=${height}cm입니다.`);
      }
      if (kind === 3) {
        const divisor = int(rng, 4, 9 + level);
        const quotientScaled = int(rng, 125, 485 + level * 40);
        const dividendScaled = divisor * quotientScaled;
        const original = fixedDecimal(dividendScaled, 2);
        const indexes = [...original].map((value, index) => value !== "." ? index : -1).filter(index => index >= 0);
        const hiddenIndex = pick(rng, indexes.slice(1));
        const answer = Number(original[hiddenIndex]);
        const masked = `${original.slice(0, hiddenIndex)}□${original.slice(hiddenIndex + 1)}`;
        return result(`다음 나눗셈이 맞도록 □에 들어갈 숫자를 구하세요.<div class="equation">${masked} ÷ ${divisor} = ${fixedDecimal(quotientScaled, 2)}</div>${decimalDivisionEvidence("missing-long-division-digit", [divisor, quotientScaled, dividendScaled, hiddenIndex])}`, answer, `${fixedDecimal(quotientScaled, 2)}×${divisor}=${original}이므로 빠진 숫자는 ${answer}입니다.`);
      }
      if (kind === 4) {
        const multiplier = int(rng, 4, 9 + level);
        const originalHundred = 180 * multiplier;
        const addHundred = int(rng, 125, 475);
        const quotientFourHundred = originalHundred / 4;
        const totalHundred = quotientFourHundred + addHundred;
        const answerHundred = 56 * multiplier;
        return result(`어떤 수를 4로 나눈 몫에 ${fixedDecimal(addHundred, 2)}을 더했더니 ${fixedDecimal(totalHundred, 2)}이 되었습니다. 그 수를 5로 나눈 몫과 9로 나눈 몫의 합을 구하세요.${decimalDivisionEvidence("linked-quotient-sum", [originalHundred, addHundred, totalHundred])}`, decimal(answerHundred / 100, 2), `어떤 수는 (${fixedDecimal(totalHundred, 2)}-${fixedDecimal(addHundred, 2)})×4=${fixedDecimal(originalHundred, 2)}입니다. 이를 5와 9로 나눈 몫의 합은 ${decimal(answerHundred / 100, 2)}입니다.`);
      }
      const cards = pick(rng, [[2, 3, 4, 9], [1, 3, 6, 8], [2, 5, 7, 9], [1, 4, 7, 8]]);
      const cases = operatorPermutations(cards).map(order => ({ order, value: (10 * order[0] + order[1] + order[2] / 10) / order[3] }));
      const minimum = Math.min(...cases.map(item => item.value));
      const maximum = Math.max(...cases.map(item => item.value));
      const answer = decimal(maximum - minimum, 3);
      return result(`수 카드 ${cards.join(", ")} 중 3장으로 소수 두 자리 수를 만들고, 남은 카드의 수로 나눕니다. 만들 수 있는 몫의 최댓값과 최솟값의 차를 구하세요.${decimalDivisionEvidence("digit-card-quotient-range", cards)}`, answer, `가능한 카드 순서를 모두 검사하면 가장 큰 몫은 ${decimal(maximum, 3)}, 가장 작은 몫은 ${decimal(minimum, 3)}입니다. 차는 ${answer}입니다.`);
    },
    decimalDivisionApplicationAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const intervals = int(rng, 7, 9 + level), targetIndex = int(rng, 2, intervals - 2);
        const startHundred = int(rng, 8, 25) * 100;
        const stepHundred = pick(rng, [25, 35, 45, 55]);
        const endHundred = startHundred + intervals * stepHundred;
        const answerHundred = startHundred + targetIndex * stepHundred;
        return result(`수직선의 눈금은 모두 같은 간격입니다. ㉠에 알맞은 수를 구하세요.${decimalNumberLineSvg({ start: decimal(startHundred / 100, 2), end: decimal(endHundred / 100, 2), intervals, targetIndex })}${decimalDivisionEvidence("equal-number-line", [startHundred, endHundred, intervals, targetIndex])}`, decimal(answerHundred / 100, 2), `한 눈금은 (${decimal(endHundred / 100, 2)}-${decimal(startHundred / 100, 2)})÷${intervals}=${decimal(stepHundred / 100, 2)}입니다. 처음에서 ${targetIndex}칸 간 값은 ${decimal(answerHundred / 100, 2)}입니다.`);
      }
      if (kind === 1) {
        const firstLaps = 4, secondsPerLap = int(rng, 45, 85 + level * 10), secondLaps = int(rng, 3, 6 + level);
        const firstSeconds = firstLaps * secondsPerLap, answerSeconds = secondLaps * secondsPerLap;
        return result(`일정한 빠르기로 운동장 ${firstLaps}바퀴를 도는 데 ${durationText(firstSeconds)}가 걸렸습니다. 같은 빠르기로 ${secondLaps}바퀴를 도는 데 걸리는 시간을 구하세요.${decimalDivisionEvidence("constant-lap-time", [firstLaps, firstSeconds, secondLaps])}`, durationText(answerSeconds), `한 바퀴에는 ${firstSeconds}÷${firstLaps}=${secondsPerLap}초가 걸립니다. ${secondLaps}바퀴는 ${answerSeconds}초, 즉 ${durationText(answerSeconds)}입니다.`);
      }
      if (kind === 2) {
        const totalCount = int(rng, 10, 14 + level), removed = int(rng, 3, totalCount - 4), newCount = int(rng, 7, 11 + level);
        const itemHundred = int(rng, 65, 145), containerHundred = int(rng, 180, 420);
        const totalHundred = containerHundred + totalCount * itemHundred;
        const remainingHundred = totalHundred - removed * itemHundred;
        const answerHundred = containerHundred + newCount * itemHundred;
        return result(`무게가 같은 연필 ${totalCount}자루가 든 필통의 무게는 ${fixedDecimal(totalHundred, 2)}g입니다. 연필 ${removed}자루를 꺼내니 ${fixedDecimal(remainingHundred, 2)}g이었습니다. 빈 필통에 같은 연필 ${newCount}자루를 넣으면 몇 g입니까?${decimalDivisionEvidence("container-item-mass", [totalCount, removed, newCount, totalHundred, remainingHundred])}`, decimal(answerHundred / 100, 2), `꺼낸 연필 ${removed}자루의 무게 차로 한 자루는 ${fixedDecimal(itemHundred, 2)}g임을 구합니다. 빈 필통은 ${fixedDecimal(containerHundred, 2)}g이므로 새 무게는 ${decimal(answerHundred / 100, 2)}g입니다.`);
      }
      if (kind === 3) {
        const speedA = pick(rng, [36, 42, 48, 54]), speedB = speedA + pick(rng, [18, 24, 30]);
        const sampleMinutesA = pick(rng, [10, 12, 15]), sampleMinutesB = pick(rng, [20, 24, 30]);
        const travelMinutes = pick(rng, [20, 25, 30]);
        const distanceA = speedA * sampleMinutesA / 60, distanceB = speedB * sampleMinutesB / 60;
        const answer = decimal((speedB - speedA) * travelMinutes / 60, 2);
        return result(`가 이동 수단은 ${sampleMinutesA}분에 ${decimal(distanceA, 2)}km, 나 이동 수단은 ${sampleMinutesB}분에 ${decimal(distanceB, 2)}km를 일정하게 갑니다. 같은 곳에서 같은 방향으로 동시에 출발하면 ${travelMinutes}분 뒤 두 이동 수단 사이의 거리는 몇 km입니까?${decimalDivisionEvidence("two-speed-gap", [speedA, speedB, sampleMinutesA, sampleMinutesB, travelMinutes])}`, answer, `시속은 각각 ${speedA}km, ${speedB}km입니다. 빠르기 차 ${speedB - speedA}km/h로 ${travelMinutes}분 동안 벌어지므로 거리는 ${answer}km입니다.`);
      }
      if (kind === 4) {
        const [rateATenth, rateBTenth] = pick(rng, [[124, 180], [128, 192], [135, 225], [144, 216]]);
        const rateA = rateATenth / 10, rateB = rateBTenth / 10;
        const distance = rateA * rateB;
        const price = pick(rng, [1500, 1600, 1700]);
        const answer = Math.round(Math.abs(rateB - rateA) * price);
        return result(`가 자동차는 휘발유 1L로 ${rateA}km, 나 자동차는 1L로 ${rateB}km를 갑니다. 두 자동차가 각각 ${decimal(distance, 2)}km를 갈 때 필요한 휘발유 값의 차를 구하세요. 휘발유는 1L에 ${price.toLocaleString()}원입니다.${decimalDivisionEvidence("fuel-cost-difference", [rateATenth, rateBTenth, Math.round(distance * 100), price])}`, answer, `필요한 기름은 각각 ${decimal(distance / rateA, 2)}L, ${decimal(distance / rateB, 2)}L입니다. 양의 차에 ${price.toLocaleString()}원을 곱하면 ${answer.toLocaleString()}원입니다.`);
      }
      const overlap = int(rng, 2, 5 + level), height = int(rng, 3, 6 + level);
      const leftWidth = overlap + int(rng, 2, 5), rightWidth = overlap + int(rng, 2, 5);
      const seconds = 5, leftSpeedTenth = int(rng, 4, 8), rightSpeedTenth = int(rng, 4, 8);
      const gapTenth = (leftSpeedTenth + rightSpeedTenth) * seconds - overlap * 10;
      if (gapTenth <= 0) return generators.decimalDivisionApplicationAdvanced({ rng, level, variant });
      const answer = overlap * height;
      return result(`높이가 ${height}cm인 두 직사각형이 ${fixedDecimal(gapTenth, 1)}cm 떨어져 있습니다. 왼쪽 도형은 초당 ${fixedDecimal(leftSpeedTenth, 1)}cm, 오른쪽 도형은 초당 ${fixedDecimal(rightSpeedTenth, 1)}cm씩 서로를 향해 움직입니다. ${seconds}초 뒤 겹치는 부분의 넓이를 구하세요.${movingOverlapSvg({ leftWidth, rightWidth, height, gap: fixedDecimal(gapTenth, 1), overlap })}${decimalDivisionEvidence("moving-overlap-area", [leftWidth, rightWidth, height, gapTenth, leftSpeedTenth, rightSpeedTenth, seconds])}`, answer, `두 도형이 줄인 간격은 (${fixedDecimal(leftSpeedTenth, 1)}+${fixedDecimal(rightSpeedTenth, 1)})×${seconds}cm입니다. 처음 간격을 빼면 겹친 가로가 ${overlap}cm이므로 넓이는 ${overlap}×${height}=${answer}cm²입니다.`);
    },
    naturalDecimalQuotientAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const [numerator, denominator] = pick(rng, [[6, 7], [17, 21], [5, 13], [7, 11], [8, 37]]);
        const position = pick(rng, [48, 75, 100, 120 + level * 10]);
        const answer = decimalDigitAt(numerator, denominator, position);
        return result(`${numerator}/${denominator}을 소수로 나타낼 때 소수 ${position}째 자리 숫자를 구하세요.${decimalDivisionEvidence("repeating-decimal-digit", [numerator, denominator, position])}`, answer, `나눗셈의 나머지를 차례로 이어 계산하면 반복 주기를 찾을 수 있습니다. ${position}째 자리의 숫자는 ${answer}입니다.`);
      }
      if (kind === 1) {
        const lowA = int(rng, 11, 15), highA = lowA + int(rng, 1, 3), lowB = int(rng, 5, 7), highB = lowB + int(rng, 1, 3);
        const maximum = Math.round(highA / lowB * 100) / 100;
        const minimum = Math.round(lowA / highB * 100) / 100;
        const answer = decimal(maximum - minimum, 2);
        return result(`가가 ${lowA} 이상 ${highA} 이하의 자연수이고, 나가 ${lowB} 이상 ${highB} 이하의 자연수입니다. 가÷나의 몫을 반올림하여 소수 둘째 자리까지 나타낼 때 가장 큰 값과 가장 작은 값의 차를 구하세요.${decimalDivisionEvidence("rounded-quotient-range", [lowA, highA, lowB, highB])}`, answer, `가장 큰 값은 ${highA}÷${lowB}를 반올림한 ${decimal(maximum, 2)}, 가장 작은 값은 ${lowA}÷${highB}를 반올림한 ${decimal(minimum, 2)}입니다. 차는 ${answer}입니다.`);
      }
      if (kind === 2) {
        const firstTenth = pick(rng, [12, 15, 18, 24]), secondTenth = pick(rng, [8, 12, 16, 25]);
        const answer = decimal(100 / (firstTenth * secondTenth), 3);
        return result(`세 수 가, 나, 다에 대하여 가÷나=${fixedDecimal(firstTenth, 1)}, 나÷다=${fixedDecimal(secondTenth, 1)}입니다. 다÷가의 몫을 반올림하여 소수 셋째 자리까지 나타내세요.${decimalDivisionEvidence("three-number-quotient", [firstTenth, secondTenth])}`, answer, `가/나와 나/다를 곱하면 가/다=${decimal(firstTenth * secondTenth / 100, 3)}입니다. 그 역수인 다/가는 ${answer}입니다.`);
      }
      if (kind === 3) {
        const first = int(rng, 8, 15), count = int(rng, 3, 6 + level), last = first + count - 1;
        const lowHundred = first * 100 - int(rng, 15, 65), highHundred = last * 100 + int(rng, 15, 65);
        const lowDivisor = pick(rng, [4, 5, 8, 10]), highDivisor = pick(rng, [4, 5, 8, 10]);
        const lowDividendHundred = lowHundred * lowDivisor;
        const highDividendHundred = highHundred * highDivisor;
        const candidates = Array.from({ length: count }, (_, index) => first + index);
        const answer = candidates.reduce((sum, value) => sum + value, 0);
        return result(`자연수 n이 ${fixedDecimal(lowDividendHundred, 2)}÷${lowDivisor}<n<${fixedDecimal(highDividendHundred, 2)}÷${highDivisor}를 만족합니다. 가능한 모든 n의 합을 구하세요.${decimalDivisionEvidence("natural-number-interval", [lowDividendHundred, lowDivisor, highDividendHundred, highDivisor])}`, answer, `양쪽 나눗셈을 계산하면 ${fixedDecimal(lowHundred, 2)}<n<${fixedDecimal(highHundred, 2)}입니다. 조건을 만족하는 자연수는 ${candidates.join(", ")}이고 합은 ${answer}입니다.`);
      }
      if (kind === 4) {
        const base = int(rng, 120, 190 + level * 10), divisor = int(rng, 41, 67);
        const groups = new Map();
        for (let addHundred = 1; addHundred <= 999; addHundred += 1) {
          const roundedThousand = Math.round(((base + addHundred / 100) / divisor) * 1000);
          const values = groups.get(roundedThousand) || [];
          values.push(addHundred);
          groups.set(roundedThousand, values);
        }
        const choices = [...groups.entries()].filter(([, values]) => values.length >= 2 && values.length <= 7);
        const [targetThousand, additions] = pick(rng, choices);
        const answerHundred = Math.min(...additions);
        return result(`${base}에 어떤 소수를 더하여 ${divisor}로 나눈 몫을 반올림해 소수 셋째 자리까지 나타냈더니 ${fixedDecimal(targetThousand, 3)}이 되었습니다. 더할 수 있는 소수 중 가장 작은 수를 구하세요.${decimalDivisionEvidence("smallest-rounding-addend", [base, divisor, targetThousand])}`, decimal(answerHundred / 100, 2), `0.01씩 늘려 몫이 ${fixedDecimal(targetThousand, 3)}으로 반올림되는 범위를 확인하면 가장 작은 수는 ${decimal(answerHundred / 100, 2)}입니다.`);
      }
      let selected = null;
      for (let attempt = 0; attempt < 120 && !selected; attempt += 1) {
        const divisorA = int(rng, 3, 8), divisorB = int(rng, 3, 8), center = int(rng, 20, 80);
        const targetA = Math.round(center / divisorA), targetB = Math.round(center / divisorB);
        const candidates = Array.from({ length: 160 }, (_, index) => index + 1).filter(value => Math.round(value / divisorA) === targetA && Math.round(value / divisorB) === targetB);
        if (candidates.length >= 2 && candidates.length <= 5) selected = { divisorA, divisorB, targetA, targetB, candidates };
      }
      if (!selected) selected = { divisorA: 5, divisorB: 3, targetA: 7, targetB: 12, candidates: [35, 36, 37] };
      const answer = selected.candidates.join(", ");
      return result(`어떤 자연수를 ${selected.divisorA}로 나눈 몫을 소수 첫째 자리에서 반올림하면 ${selected.targetA}, 같은 수를 ${selected.divisorB}로 나눈 몫을 소수 첫째 자리에서 반올림하면 ${selected.targetB}가 됩니다. 가능한 자연수를 모두 쓰세요.${decimalDivisionEvidence("two-rounded-quotients", [selected.divisorA, selected.targetA, selected.divisorB, selected.targetB])}`, answer, `각 반올림 범위를 모두 만족하는 자연수를 검사하면 ${answer}입니다.`);
    },
    decimalDivisionEquationAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const middleTenth = int(rng, 620, 930 + level * 50), firstTenth = int(rng, 220, 420), extraTenth = int(rng, 120, 260);
        const lastTenth = firstTenth + extraTenth;
        const totalTenth = firstTenth + middleTenth + lastTenth;
        const answerTenth = firstTenth + middleTenth;
        return result(`일직선 위에 다섯 점 ㄱ, ㄴ, ㄷ, ㄹ, ㅁ이 차례로 있습니다. ㄴㄹ=${fixedDecimal(middleTenth, 1)}cm, ㄱㅁ=${fixedDecimal(totalTenth, 1)}cm이고 ㄹㅁ은 ㄱㄴ보다 ${fixedDecimal(extraTenth, 1)}cm 더 깁니다. ㄱㄹ의 길이를 구하세요.${fivePointLineSvg({ middle: fixedDecimal(middleTenth, 1), total: fixedDecimal(totalTenth, 1), extra: fixedDecimal(extraTenth, 1) })}${decimalDivisionEvidence("five-collinear-points", [middleTenth, totalTenth, extraTenth])}`, decimal(answerTenth / 10, 1), `ㄱㄴ을 x라 하면 x+${fixedDecimal(middleTenth, 1)}+(x+${fixedDecimal(extraTenth, 1)})=${fixedDecimal(totalTenth, 1)}입니다. x=${fixedDecimal(firstTenth, 1)}이므로 ㄱㄹ=${decimal(answerTenth / 10, 1)}cm입니다.`);
      }
      if (kind === 1) {
        const factorXHundred = pick(rng, [125, 150, 200, 250]), factorYHundred = pick(rng, [120, 160, 240, 400]);
        const increaseRatioNumerator = factorXHundred * factorYHundred - 10000;
        const requiredMultiple = 10000 / gcd(increaseRatioNumerator, 10000);
        const originalHundred = requiredMultiple * int(rng, 8, 26 + level * 5);
        const increaseHundred = originalHundred * increaseRatioNumerator / 10000;
        return result(`어떤 직사각형의 가로를 ${decimal(factorXHundred / 100, 2)}배, 세로를 ${decimal(factorYHundred / 100, 2)}배 하여 새 직사각형을 만들었더니 넓이가 처음보다 ${fixedDecimal(increaseHundred, 2)}cm² 늘었습니다. 처음 직사각형의 넓이를 구하세요.${decimalDivisionEvidence("scaled-rectangle-area", [factorXHundred, factorYHundred, increaseHundred])}`, decimal(originalHundred / 100, 2), `넓이는 ${decimal(factorXHundred * factorYHundred / 10000, 3)}배가 됩니다. 늘어난 배수로 ${fixedDecimal(increaseHundred, 2)}를 나누면 처음 넓이는 ${decimal(originalHundred / 100, 2)}cm²입니다.`);
      }
      if (kind === 2) {
        const width = int(rng, 24, 42 + level * 4), height = int(rng, 16, 30 + level * 3), border = int(rng, 2, 5);
        const roadArea = 2 * border * (width + height) + 4 * border * border;
        const answer = 2 * (width + height);
        return result(`직사각형 공원 둘레에 폭이 ${border}m로 일정한 길을 만들었습니다. 길의 넓이는 ${roadArea}m²입니다. 공원의 둘레를 구하세요.${rectangleBorderSvg({ width, height, border })}${decimalDivisionEvidence("rectangular-park-border", [width, height, border, roadArea])}`, answer, `길 넓이에서 네 모서리의 ${border}m×${border}m 부분을 빼고 폭 ${border}m로 나누면 공원 둘레가 됩니다. (${roadArea}-${4 * border * border})÷${border}=${answer}m입니다.`);
      }
      if (kind === 3) {
        const count = int(rng, 4, 6 + level), sideTenth = int(rng, 28, 65 + level * 5), totalTenth = count * sideTenth;
        return result(`같은 크기의 정삼각형 ${count}개를 그림처럼 이어 붙였습니다. 아랫변 전체 길이가 ${fixedDecimal(totalTenth, 1)}cm일 때 정삼각형 한 변의 길이를 구하세요.${equilateralStripSvg({ count, total: fixedDecimal(totalTenth, 1) })}${decimalDivisionEvidence("equilateral-strip-side", [count, totalTenth])}`, decimal(sideTenth / 10, 1), `아랫변은 같은 길이 ${count}개로 이루어졌으므로 ${fixedDecimal(totalTenth, 1)}÷${count}=${decimal(sideTenth / 10, 1)}cm입니다.`);
      }
      if (kind === 4) {
        const speedATenth = pick(rng, [35, 42, 48, 56]), speedBTenth = speedATenth - pick(rng, [6, 8, 12]);
        const factorTenth = pick(rng, [4, 5, 6]);
        const secondMeetingMinutes = 18 * factorTenth;
        const distanceHundred = (speedATenth + speedBTenth) * factorTenth;
        return result(`두 사람이 서로의 집에서 동시에 출발하여 두 집 사이를 같은 빠르기로 계속 왕복합니다. 빠르기는 각각 시속 ${fixedDecimal(speedATenth, 1)}km, ${fixedDecimal(speedBTenth, 1)}km이고 두 번째로 만날 때까지 ${durationText(secondMeetingMinutes * 60)}가 걸렸습니다. 두 집 사이의 거리를 구하세요.${decimalDivisionEvidence("second-meeting-distance", [speedATenth, speedBTenth, secondMeetingMinutes])}`, decimal(distanceHundred / 100, 2), `두 번째 만날 때 두 사람이 간 거리의 합은 집 사이 거리의 3배입니다. (${fixedDecimal(speedATenth, 1)}+${fixedDecimal(speedBTenth, 1)})×${secondMeetingMinutes}/60÷3=${decimal(distanceHundred / 100, 2)}km입니다.`);
      }
      const speedA = pick(rng, [24, 30, 36, 42]), speedB = pick(rng, [30, 36, 42, 48]);
      const delayMinutes = pick(rng, [4, 5, 6]);
      let afterStartMinutes = int(rng, 7, 14 + level);
      while ((speedA * (delayMinutes + afterStartMinutes) + speedB * afterStartMinutes) % 3) afterStartMinutes += 1;
      const circumference = speedA * (delayMinutes + afterStartMinutes) / 60 + speedB * afterStartMinutes / 60;
      return result(`둘레가 ${decimal(circumference, 2)}km인 순환 길에서 가가 시속 ${speedA}km로 먼저 출발하고 ${delayMinutes}분 뒤 나가 같은 곳에서 반대 방향으로 시속 ${speedB}km로 출발했습니다. 나는 출발 몇 분 뒤 가를 처음 만납니까?${decimalDivisionEvidence("delayed-opposite-meeting", [speedA, speedB, delayMinutes, Math.round(circumference * 100)])}`, afterStartMinutes, `나가 출발할 때 가가 앞서 간 거리를 둘레에서 뺀 뒤 두 사람의 빠르기 합으로 나눕니다. 계산하면 ${afterStartMinutes}분입니다.`);
    },
    ratioComparisonAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const [horizontalRatio, verticalRatio] = pick(rng, [[3, 2], [4, 3], [5, 4], [7, 4]]);
        const unit = int(rng, 2, 5 + level), width = horizontalRatio * unit, height = verticalRatio * unit;
        const perimeter = 2 * (width + height), answer = width * height;
        return result(`가로에 대한 세로의 비가 ${verticalRatio}/${horizontalRatio}인 직사각형의 둘레가 ${perimeter}cm입니다. 이 직사각형의 넓이를 구하세요.${ratioEvidence("rectangle-ratio-area", [horizontalRatio, verticalRatio, perimeter])}`, answer, `가로와 세로를 ${horizontalRatio}:${verticalRatio}로 놓으면 한 몫은 ${perimeter}÷2÷${horizontalRatio + verticalRatio}=${unit}cm입니다. 넓이는 ${width}×${height}=${answer}cm²입니다.`);
      }
      if (kind === 1) {
        const [smallRatio, largeRatio] = pick(rng, [[2, 5], [3, 8], [4, 7], [5, 9]]);
        const unit = int(rng, 5, 12 + level * 3), difference = (largeRatio - smallRatio) * unit;
        const answer = smallRatio * unit;
        return result(`두 상자에 든 공의 개수 차는 ${difference}개이고, 많은 상자의 공 수에 대한 적은 상자의 공 수의 비율은 ${decimal(smallRatio / largeRatio, 3)}입니다. 적은 상자에는 공이 몇 개 들어 있습니까?${ratioEvidence("difference-ratio-value", [smallRatio, largeRatio, difference])}`, answer, `두 수의 비는 ${smallRatio}:${largeRatio}이고 차는 ${largeRatio - smallRatio}몫입니다. 한 몫은 ${difference}÷${largeRatio - smallRatio}=${unit}이므로 적은 상자는 ${answer}개입니다.`);
      }
      if (kind === 2) {
        const [top, bottom] = pick(rng, [[4, 7], [5, 8], [7, 11], [8, 13]]);
        const answer = ratioText(top, bottom);
        return result(`사다리꼴을 대각선으로 나눈 두 삼각형 가와 나의 넓이의 비가 ${top}:${bottom}입니다. 사다리꼴의 윗변과 아랫변의 길이의 비를 가장 간단한 자연수의 비로 나타내세요.${ratioTrapezoidSvg({ top: "?", bottom: "?", diagonal: true })}${ratioEvidence("trapezoid-base-ratio", [top, bottom])}`, answer, `두 삼각형은 평행한 두 밑변에 대한 높이가 같습니다. 넓이의 비가 밑변의 비와 같으므로 윗변:아랫변=${answer}입니다.`);
      }
      if (kind === 3) {
        const [afterFirstRatio, afterSecondRatio] = pick(rng, [[4, 3], [5, 4], [7, 5]]);
        const unit = int(rng, 7, 14 + level * 2), transfer = int(rng, 4, Math.max(4, afterSecondRatio * unit - 2));
        const first = afterFirstRatio * unit + transfer, second = afterSecondRatio * unit - transfer;
        return result(`지호는 사탕 ${first}개, 세린이는 ${second}개를 가지고 있습니다. 지호가 세린이에게 사탕을 몇 개 주면 지호와 세린이가 가진 사탕 수의 비가 ${afterFirstRatio}:${afterSecondRatio}가 됩니까?${ratioEvidence("transfer-to-ratio", [first, second, afterFirstRatio, afterSecondRatio])}`, transfer, `전체 ${first + second}개를 ${afterFirstRatio + afterSecondRatio}몫으로 나누면 한 몫은 ${unit}개입니다. 지호는 ${afterFirstRatio * unit}개가 되어야 하므로 ${transfer}개를 주어야 합니다.`);
      }
      if (kind === 4) {
        const [a, b, c, d] = pick(rng, [[4, 5, 5, 8], [3, 7, 7, 10], [5, 6, 3, 4], [7, 9, 9, 14], [3, 5, 4, 9], [7, 8, 5, 7]]);
        const answer = decimal(a * c / (b * d), 3);
        return result(`가에 대한 나의 비율은 ${a}/${b}이고, 나와 다의 비는 ${c}:${d}입니다. 가에 대한 다의 비율을 소수로 나타내세요.${ratioEvidence("chained-ratios", [a, b, c, d])}`, answer, `가/나는 ${a}/${b}, 나/다는 ${c}/${d}이므로 가/다=(${a}/${b})×(${c}/${d})=${answer}입니다.`);
      }
      const [onlyFirstRatio, onlySecondRatio] = pick(rng, [[2, 3], [3, 4], [4, 5]]);
      const unit = int(rng, 5, 10 + level), intersection = int(rng, 4, 10 + level * 2);
      const onlyFirst = onlyFirstRatio * unit, onlySecond = onlySecondRatio * unit, total = onlyFirst + onlySecond + intersection;
      const answer = ratioText(onlyFirst + intersection, onlySecond + intersection);
      return result(`학생 ${total}명은 모두 K팝 또는 힙합을 좋아합니다. 두 음악을 모두 좋아하는 학생은 ${intersection}명이고, K팝만 좋아하는 학생 수와 힙합만 좋아하는 학생 수의 비는 ${onlyFirstRatio}:${onlySecondRatio}입니다. K팝을 좋아하는 학생 수와 힙합을 좋아하는 학생 수의 비를 가장 간단히 나타내세요.${ratioEvidence("overlapping-groups-ratio", [total, intersection, onlyFirstRatio, onlySecondRatio])}`, answer, `한 가지만 좋아하는 ${total - intersection}명을 ${onlyFirstRatio}:${onlySecondRatio}로 나누면 ${onlyFirst}명과 ${onlySecond}명입니다. 두 음악을 모두 좋아하는 학생을 각각 더하면 비는 ${answer}입니다.`);
    },
    percentageAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const [leftMultiplier, rightMultiplier] = pick(rng, [[3, 4], [4, 5], [5, 8], [7, 10]]);
        const answer = decimal(leftMultiplier / rightMultiplier * 100, 1);
        return result(`두 수 가와 나에 대하여 ${leftMultiplier}×가=${rightMultiplier}×나입니다. 가에 대한 나의 비율을 백분율로 나타내세요.${ratioEvidence("coefficient-percent", [leftMultiplier, rightMultiplier])}`, answer, `나/가=${leftMultiplier}/${rightMultiplier}이므로 백분율은 ${answer}%입니다.`);
      }
      if (kind === 1) {
        const oldFirst = pick(rng, [600, 700, 800, 1200]), oldSecond = pick(rng, [1000, 1200, 1500, 2000]);
        const firstPercent = pick(rng, [15, 20, 25, 30]), secondPercent = firstPercent + pick(rng, [-10, -5, 5, 10]);
        const newFirst = oldFirst * (100 + firstPercent) / 100, newSecond = oldSecond * (100 + secondPercent) / 100;
        const winner = firstPercent > secondPercent ? "가" : "나", difference = Math.abs(firstPercent - secondPercent);
        const answer = `${winner}, ${difference}%p`;
        return result(`가 상품은 ${oldFirst.toLocaleString()}원에서 ${newFirst.toLocaleString()}원으로, 나 상품은 ${oldSecond.toLocaleString()}원에서 ${newSecond.toLocaleString()}원으로 올랐습니다. 가격이 더 많이 오른 상품의 기호와 두 인상률의 차를 쓰세요.${ratioEvidence("price-rise-comparison", [oldFirst, newFirst, oldSecond, newSecond])}`, answer, `가와 나의 인상률은 각각 ${firstPercent}%, ${secondPercent}%입니다. 더 많이 오른 것은 ${winner}이고 차는 ${difference}%p입니다.`);
      }
      if (kind === 2) {
        const rainDays = pick(rng, [40, 60, 80]), dryDays = pick(rng, [40, 60, 80]);
        const rainAccuracy = pick(rng, [70, 80, 90]), dryAccuracy = pick(rng, [80, 90, 95]);
        const correct = rainDays * rainAccuracy / 100 + dryDays * dryAccuracy / 100;
        const answer = decimal(correct / (rainDays + dryDays) * 100, 1);
        return result(`비가 온다고 예보한 ${rainDays}일 중 ${rainAccuracy}%에 실제로 비가 왔고, 비가 오지 않는다고 예보한 ${dryDays}일 중 ${dryAccuracy}%에 실제로 비가 오지 않았습니다. 전체 예보의 적중률을 구하세요.${ratioEvidence("forecast-accuracy", [rainDays, rainAccuracy, dryDays, dryAccuracy])}`, answer, `맞은 날은 ${rainDays * rainAccuracy / 100}+${dryDays * dryAccuracy / 100}=${correct}일입니다. 전체 ${rainDays + dryDays}일에 대한 비율은 ${answer}%입니다.`);
      }
      if (kind === 3) {
        const total = 1000 * int(rng, 1, 2 + level), femalePercent = pick(rng, [45, 50, 55]);
        const malePercent = pick(rng, [8, 10, 12]), femaleWinPercent = pick(rng, [5, 8, 10]);
        const female = total * femalePercent / 100, male = total - female;
        const answer = male * malePercent / 100 + female * femaleWinPercent / 100;
        return result(`학생 ${total}명을 대상으로 추첨했더니 남학생의 ${malePercent}%, 여학생의 ${femaleWinPercent}%가 당첨되었습니다. 전체 학생 중 여학생은 ${femalePercent}%일 때 당첨된 학생은 모두 몇 명입니까?${ratioEvidence("group-selection-percent", [total, femalePercent, malePercent, femaleWinPercent])}`, answer, `남학생 ${male}명 중 ${male * malePercent / 100}명, 여학생 ${female}명 중 ${female * femaleWinPercent / 100}명이 당첨되어 모두 ${answer}명입니다.`);
      }
      if (kind === 4) {
        const price = pick(rng, [200, 250, 300, 400]), quantity = 12;
        const free = pick(rng, [2, 3, 4]), discount = pick(rng, [8, 10, 12]);
        const firstCost = (quantity - free) * price, secondCost = quantity * price * (100 - discount) / 100;
        const answer = Math.abs(firstCost - secondCost);
        return result(`연필 한 자루의 정가는 ${price}원입니다. 가 문구점은 ${quantity}자루를 사면 ${free}자루를 덤으로 주고, 나 문구점은 정가에서 ${discount}%를 할인합니다. 연필 ${quantity}자루를 마련할 때 두 문구점의 가격 차는 몇 원입니까?${ratioEvidence("bonus-discount-difference", [price, quantity, free, discount])}`, answer, `가 문구점에서는 ${quantity - free}자루 값인 ${firstCost.toLocaleString()}원, 나 문구점에서는 ${secondCost.toLocaleString()}원입니다. 차는 ${answer.toLocaleString()}원입니다.`);
      }
      const total = pick(rng, [40000, 50000, 60000]), childPercent = pick(rng, [12, 14, 15]), boyPercent = pick(rng, [50, 55, 60]), targetPercent = pick(rng, [30, 40, 50]);
      const answer = total * childPercent / 100 * boyPercent / 100 * targetPercent / 100;
      return result(`인구가 ${total.toLocaleString()}명인 도시에 사는 초등학생은 전체의 ${childPercent}%입니다. 초등학생 중 남학생은 ${boyPercent}%이고, 남학생 중 ${targetPercent}%가 안경을 썼습니다. 안경을 쓴 초등학교 남학생은 몇 명입니까?${ratioEvidence("nested-population-percent", [total, childPercent, boyPercent, targetPercent])}`, answer, `전체에 ${childPercent}%, ${boyPercent}%, ${targetPercent}%를 차례로 곱하면 ${answer}명입니다.`);
    },
    multipleRatesAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const total = pick(rng, [4800, 6400, 8000, 9600]), firstDenominator = pick(rng, [40, 50, 80]), finalPercent = pick(rng, [60, 75, 80]);
        const finalCount = total / firstDenominator * finalPercent / 100;
        return result(`1차 서류 전형 합격률은 1/${firstDenominator}이고, 1차 합격자의 ${finalPercent}%인 ${finalCount}명이 최종 합격했습니다. 처음 지원한 사람은 모두 몇 명입니까?${ratioEvidence("reverse-pass-rate", [firstDenominator, finalPercent, finalCount])}`, total, `1차 합격자는 ${finalCount}÷${finalPercent / 100}=${total / firstDenominator}명이고, 지원자는 그 수의 ${firstDenominator}배인 ${total.toLocaleString()}명입니다.`);
      }
      if (kind === 1) {
        const total = pick(rng, [400, 500, 600]), invalid = pick(rng, [20, 25, 30]), margin = pick(rng, [12, 15, 18]);
        const valid = total - invalid;
        const adjustedMargin = (valid + margin) % 2 ? margin + 1 : margin;
        const winner = (valid + adjustedMargin) / 2;
        const answer = decimal(winner / total * 100, 1);
        return result(`총투표수 ${total}표 중 무효표는 ${invalid}표였습니다. 당선자는 다른 후보보다 ${adjustedMargin}표를 더 얻었습니다. 당선자의 득표수는 총투표수의 몇 %입니까?${ratioEvidence("vote-share", [total, invalid, adjustedMargin])}`, answer, `유효표 ${valid}표를 두 후보가 나누어 갖고 차가 ${adjustedMargin}표이므로 당선자는 ${winner}표입니다. 총투표수에 대한 비율은 ${answer}%입니다.`);
      }
      if (kind === 2) {
        const areas = [pick(rng, [600, 700, 800]), pick(rng, [650, 750, 900]), pick(rng, [700, 820, 950])];
        const densities = shuffle(rng, pick(rng, [[1000, 1400, 1800], [1200, 1500, 1800], [900, 1500, 2100], [1100, 1600, 2200]]));
        const populations = areas.map((area, index) => area * densities[index]);
        const maxDensity = Math.max(...densities), minDensity = Math.min(...densities);
        const answer = `${["가", "나", "다"][densities.indexOf(maxDensity)]}, ${maxDensity - minDensity}명/km²`;
        return result(`세 도시의 넓이와 인구가 다음과 같습니다. 인구 밀도가 가장 높은 도시와 가장 낮은 도시의 인구 밀도 차를 구하세요.${valueTable(["도시", "가", "나", "다"], ["넓이(km²)", ...areas])}${valueTable(["도시", "가", "나", "다"], ["인구(명)", ...populations.map(value => value.toLocaleString())])}${ratioEvidence("city-density", [...areas, ...populations])}`, answer, `인구를 넓이로 나누면 밀도는 각각 ${densities.join(", ")}명/km²입니다. 가장 높은 도시는 ${answer.split(",")[0]}이고 차는 ${maxDensity - minDensity}명/km²입니다.`);
      }
      if (kind === 3) {
        const oldTotal = pick(rng, [1600, 2000, 2400]), oldDefects = pick(rng, [56, 70, 84]), newTotal = oldTotal + pick(rng, [400, 600, 800]);
        const limit = oldDefects * newTotal / oldTotal;
        const answer = Math.ceil(limit) - 1;
        return result(`어제 만든 제품 ${oldTotal}개 중 ${oldDefects}개가 불량품이었습니다. 오늘 ${newTotal}개를 만들 때 어제보다 불량률을 낮추려면 불량품은 몇 개 이하여야 합니까?${ratioEvidence("defect-rate-limit", [oldTotal, oldDefects, newTotal])}`, answer, `어제 불량률과 같은 개수는 ${newTotal}×${oldDefects}/${oldTotal}=${decimal(limit, 2)}개입니다. 이보다 작아야 하므로 최대 ${answer}개입니다.`);
      }
      if (kind === 4) {
        const principalA = pick(rng, [40000, 60000, 80000]), monthsA = pick(rng, [6, 8, 10]), monthlyA = pick(rng, [1, 1.25, 1.5]);
        const principalB = pick(rng, [30000, 50000, 70000]), monthsB = pick(rng, [4, 6, 8]), monthlyB = pick(rng, [1.5, 2, 2.5]);
        const interestA = principalA * monthlyA / 100 * monthsA, interestB = principalB * monthlyB / 100 * monthsB;
        const answer = `${monthlyA}%, ${monthlyB}%`;
        return result(`가 은행에서 ${principalA.toLocaleString()}원을 ${monthsA}개월 빌린 이자는 ${interestA.toLocaleString()}원이고, 나 은행에서 ${principalB.toLocaleString()}원을 ${monthsB}개월 빌린 이자는 ${interestB.toLocaleString()}원입니다. 각 은행의 1개월 이자율을 차례로 구하세요.${ratioEvidence("monthly-interest-rates", [principalA, monthsA, interestA, principalB, monthsB, interestB])}`, answer, `이자÷원금÷기간×100으로 계산하면 가 은행은 ${monthlyA}%, 나 은행은 ${monthlyB}%입니다.`);
      }
      const totalA = 150, foodA = 60, totalB = pick(rng, [300, 400, 500, 600]), totalC = pick(rng, [240, 280, 360, 440]);
      const bNumerator = 1, bDenominator = 2, cNumerator = 5, cDenominator = 4;
      const indexA = foodA / totalA, foodB = totalB * indexA * bNumerator / bDenominator, foodC = totalC * indexA * bNumerator / bDenominator * cNumerator / cDenominator;
      const answer = foodB;
      return result(`가 가구의 총지출액은 ${totalA}만원, 식료품비는 ${foodA}만원입니다. 나 가구의 엥겔 지수는 가 가구의 1/2이고, 다 가구의 엥겔 지수는 나 가구의 1.25배입니다. 나와 다 가구의 총지출액이 각각 ${totalB}만원, ${totalC}만원일 때 소득 수준이 가장 높은 가구의 식료품비는 얼마입니까?${ratioEvidence("engel-households", [totalA, foodA, totalB, totalC, bNumerator, bDenominator, cNumerator, cDenominator])}`, answer, `가 가구의 엥겔 지수는 ${decimal(indexA * 100, 1)}%입니다. 나는 ${decimal(indexA * 50, 1)}%, 다는 ${decimal(indexA * 62.5, 1)}%이므로 소득 수준이 가장 높은 나 가구의 식료품비는 ${answer}만원입니다.`);
    },
    priceConcentrationAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const labels = ["ㄱ", "ㄴ", "ㄷ", "ㄹ"], discounts = shuffle(rng, [10, 12, 15, 20 + level * 5]);
        const prices = labels.map((_, index) => pick(rng, [12000, 16000, 20000, 24000]) + index * 4000);
        const salePrices = prices.map((price, index) => price * (100 - discounts[index]) / 100);
        const answer = labels.map((label, index) => ({ label, discount: discounts[index] })).sort((a, b) => b.discount - a.discount).map(item => item.label).join(", ");
        return result(`다음 표에서 할인율이 높은 상품부터 차례로 기호를 쓰세요.${valueTable(["상품", ...labels], ["정가(원)", ...prices.map(value => value.toLocaleString())])}${valueTable(["상품", ...labels], ["할인가(원)", ...salePrices.map(value => value.toLocaleString())])}${ratioEvidence("discount-order", [...prices, ...salePrices])}`, answer, `각 할인율은 ${discounts.map((value, index) => `${labels[index]} ${value}%`).join(", ")}입니다. 높은 순서는 ${answer}입니다.`);
      }
      if (kind === 1) {
        const price = pick(rng, [800, 1000, 1200]), quantity = 4 * int(rng, 3, 5 + level), discount = pick(rng, [8, 10, 12, 15]);
        const bonusCost = quantity * 3 / 4 * price, discountCost = quantity * price * (100 - discount) / 100;
        const answer = decimal((discountCost - bonusCost) / discountCost * 100, 1);
        return result(`같은 정가 ${price.toLocaleString()}원인 공책 ${quantity}권을 삽니다. 가 문구점은 3권을 사면 1권을 덤으로 주고, 나 문구점은 ${discount}% 할인합니다. 가 문구점의 지불액은 나 문구점보다 몇 % 적습니까?${ratioEvidence("bonus-vs-discount-rate", [price, quantity, discount])}`, answer, `가에서는 ${bonusCost.toLocaleString()}원, 나에서는 ${discountCost.toLocaleString()}원을 냅니다. 나의 지불액에 대한 차의 비율은 ${answer}%입니다.`);
      }
      if (kind === 2) {
        const quantity = pick(rng, [60, 80, 100]), cost = pick(rng, [500, 600, 800]), markup = pick(rng, [50, 60, 75]);
        const fullCount = Math.floor(quantity * 3 / 5), secondCount = Math.floor(quantity / 5), lastCount = quantity - fullCount - secondCount;
        const regular = cost * (100 + markup) / 100;
        const secondPrice = regular * 80 / 100, lastPrice = regular * 50 / 100;
        const revenue = fullCount * regular + secondCount * secondPrice + lastCount * lastPrice;
        const answer = revenue - quantity * cost;
        return result(`과일 ${quantity}개를 한 개에 ${cost}원씩 사서 ${markup}%의 이익을 붙여 정가를 정했습니다. ${fullCount}개는 정가, ${secondCount}개는 정가의 20% 할인, 나머지는 정가의 절반에 팔았습니다. 전체 이익은 얼마입니까?${ratioEvidence("tiered-sale-profit", [quantity, cost, markup, fullCount, secondCount])}`, answer, `정가는 ${regular.toLocaleString()}원입니다. 세 판매 금액의 합에서 원가 ${quantity * cost}원을 빼면 이익은 ${answer.toLocaleString()}원입니다.`);
      }
      if (kind === 3) {
        const firstMass = pick(rng, [150, 200, 250]), firstPercent = pick(rng, [10, 14, 20]);
        const secondMass = pick(rng, [100, 125, 200]), secondPercent = pick(rng, [20, 25, 30]);
        const answer = decimal((firstMass * firstPercent + secondMass * secondPercent) / (firstMass + secondMass), 1);
        return result(`진하기가 ${firstPercent}%인 설탕물 ${firstMass}g과 ${secondPercent}%인 설탕물 ${secondMass}g을 섞었습니다. 새 설탕물의 진하기를 구하세요.${ratioEvidence("mixed-concentration", [firstMass, firstPercent, secondMass, secondPercent])}`, answer, `설탕의 양을 더해 전체 무게로 나누면 (${firstMass}×${firstPercent}%+${secondMass}×${secondPercent}%)÷${firstMass + secondMass}=${answer}%입니다.`);
      }
      if (kind === 4) {
        const firstMass = pick(rng, [150, 200, 250]), firstPercent = pick(rng, [20, 30, 40]);
        const secondMass = pick(rng, [250, 300, 350]), secondPercent = pick(rng, [10, 20, 25]);
        const total = firstMass + secondMass, used = pick(rng, [100, 150, 200]);
        const saltTotal = (firstMass * firstPercent + secondMass * secondPercent) / 100;
        const answer = decimal(saltTotal * (total - used) / total, 2);
        return result(`진하기가 ${firstPercent}%인 소금물 ${firstMass}g과 ${secondPercent}%인 소금물 ${secondMass}g을 섞은 뒤 ${used}g을 사용했습니다. 남은 소금물에 들어 있는 소금은 몇 g입니까?${ratioEvidence("remaining-solute", [firstMass, firstPercent, secondMass, secondPercent, used])}`, answer, `섞은 소금은 ${saltTotal}g이고 전체 ${total}g 중 ${total - used}g이 남았습니다. 같은 진하기이므로 남은 소금은 ${answer}g입니다.`);
      }
      const mass = pick(rng, [400, 500, 600]), percent = pick(rng, [6, 8, 10]), removed = pick(rng, [100, 200, 250]);
      const answer = decimal(percent * (mass - removed) / mass, 2);
      return result(`진하기가 ${percent}%인 소금물 ${mass}g에서 ${removed}g을 덜어 낸 뒤 같은 양의 물을 부었습니다. 새 소금물의 진하기를 구하세요.${ratioEvidence("remove-refill-concentration", [mass, percent, removed])}`, answer, `덜어 낸 뒤 소금은 처음의 ${(mass - removed)}/${mass}만큼 남습니다. 전체 무게는 다시 ${mass}g이므로 진하기는 ${answer}%입니다.`);
    },
    ratioEquationOneAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const scale = int(rng, 1, 3 + level), initialHundred = 1800 * scale, thirdDayHundred = 320 * scale;
        return result(`냄비 가득 곰국을 끓였습니다. 첫날 전체의 14%를 먹고, 둘째 날 남은 양의 4/9를 먹었습니다. 셋째 날 ${fixedDecimal(thirdDayHundred, 2)}L를 먹었더니 처음 양의 30%가 남았습니다. 처음 곰국은 몇 L입니까?${ratioEvidence("sequential-consumption", [14, 4, 9, thirdDayHundred, 30])}`, initialHundred / 100, `처음 양을 xL라 하면 x×86/100×5/9-${fixedDecimal(thirdDayHundred, 2)}=x×30/100입니다. 풀면 x=${initialHundred / 100}L입니다.`);
      }
      if (kind === 1) {
        const width = pick(rng, [30, 40, 50]), height = pick(rng, [20, 25, 30]), reducePercent = pick(rng, [20, 25, 30]);
        const newWidth = width * (100 - reducePercent) / 100, newHeight = height + pick(rng, [3, 4, 5]);
        const signedDifference = newWidth * newHeight - width * height;
        if (!signedDifference) return generators.ratioEquationOneAdvanced({ rng, level, variant });
        const areaDifference = Math.abs(signedDifference), direction = signedDifference > 0 ? "늘었습니다" : "줄었습니다";
        const answer = ratioText(newWidth, newHeight);
        return result(`가로 ${width}cm, 세로 ${height}cm인 직사각형의 가로를 ${reducePercent}% 줄이고 세로를 늘렸더니 넓이가 처음보다 ${areaDifference}cm² ${direction} 새 직사각형의 가로와 세로의 비를 가장 간단히 나타내세요.${ratioEvidence("changed-rectangle-ratio", [width, height, reducePercent, newHeight, signedDifference])}`, answer, `새 가로는 ${newWidth}cm입니다. 넓이가 ${areaDifference}cm² ${direction.replace("습니다", "으므로")} 새 세로는 ${newHeight}cm이고, 가로:세로=${answer}입니다.`);
      }
      if (kind === 2) {
        const [top, bottom] = pick(rng, [[8, 32], [10, 50], [12, 36], [14, 42], [18, 42], [20, 60]]);
        const upper = 3 * top + bottom, lower = top + 3 * bottom;
        const answer = (top + bottom) / 2;
        return result(`사다리꼴의 높이를 똑같이 둘로 나누는 평행선을 그었습니다. 윗부분과 아랫부분의 넓이의 비는 ${ratioText(upper, lower)}이고 윗변은 ${top}cm입니다. 가운데 평행선의 길이를 구하세요.${ratioTrapezoidSvg({ top, bottom: "?", middle: true })}${ratioEvidence("trapezoid-midline-from-area-ratio", [top, upper, lower])}`, answer, `아랫변을 x라 하면 두 부분의 넓이의 비는 (3×${top}+x):(${top}+3x)=${ratioText(upper, lower)}입니다. x=${bottom}이고 가운데 선은 (${top}+${bottom})÷2=${answer}cm입니다.`);
      }
      if (kind === 3) {
        const dailySpend = pick(rng, [4000, 5000, 6000]), basicPercent = pick(rng, [3, 4, 5]), specialDays = int(rng, 6, 15 + level * 2);
        const totalPoints = dailySpend * basicPercent / 100 * (30 + specialDays);
        return result(`한 가게는 구매 금액의 ${basicPercent}%를 포인트로 적립하고, 4월 중 특별 적립일에는 그 두 배를 적립합니다. 4월 30일 동안 매일 ${dailySpend.toLocaleString()}원어치씩 사서 ${totalPoints.toLocaleString()}포인트를 받았다면 특별 적립일은 며칠입니까?${ratioEvidence("special-point-days", [dailySpend, basicPercent, totalPoints, 30])}`, specialDays, `보통 하루 포인트는 ${dailySpend * basicPercent / 100}입니다. 특별한 날은 하루치가 하나 더 생기므로 (${totalPoints}÷${dailySpend * basicPercent / 100})-30=${specialDays}일입니다.`);
      }
      if (kind === 4) {
        const [aPercent, aToCNum, aToCDen] = pick(rng, [[75, 2, 3], [60, 3, 5], [80, 4, 7], [70, 7, 12], [50, 3, 8]]);
        const bToCNum = aToCNum * 100, bToCDen = aToCDen * aPercent;
        const answer = ratioText(bToCNum, bToCDen);
        return result(`유현이가 가진 돈은 성현이가 가진 돈의 ${aPercent}%이고, 유현이가 가진 돈은 대현이가 가진 돈의 ${aToCNum}/${aToCDen}입니다. 성현이가 가진 돈과 대현이가 가진 돈의 비를 가장 간단히 나타내세요.${ratioEvidence("chained-money-ratio", [aPercent, aToCNum, aToCDen])}`, answer, `유현/성현=${aPercent}/100, 유현/대현=${aToCNum}/${aToCDen}이므로 성현/대현=(${aToCNum}/${aToCDen})÷(${aPercent}/100)=${answer}입니다.`);
      }
      const scale = int(rng, 1, 2 + level), fullOil = 12000 * scale, canWeight = 650 * scale;
      const firstNum = 5, firstDen = 12, secondNum = 3, secondDen = 10;
      const dailyUse = pick(rng, [250, 375, 500]) * scale, days = pick(rng, [10, 12, 14]);
      const firstWeight = canWeight + fullOil * firstNum / firstDen, secondWeight = canWeight + fullOil * secondNum / secondDen;
      const answer = (canWeight + fullOil - dailyUse * days) / 10;
      return result(`기름통에 기름이 5/12만큼 있을 때 무게는 ${fixedDecimal(firstWeight, 2)}g이고, 30%만큼 있을 때 무게는 ${fixedDecimal(secondWeight, 2)}g입니다. 통을 가득 채운 뒤 매일 ${decimal(dailyUse / 1000, 3)}kg씩 ${days}일 사용했습니다. 남은 기름통 무게의 100배는 몇 kg입니까?${ratioEvidence("oil-can-weight", [firstWeight, firstNum, firstDen, secondWeight, secondNum, secondDen, dailyUse, days])}`, answer, `두 무게 차로 가득 찬 기름은 ${fullOil / 1000}kg, 빈 통은 ${canWeight / 1000}kg임을 구합니다. 사용 후 전체 무게는 ${(canWeight + fullOil - dailyUse * days) / 1000}kg이므로 100배는 ${answer}kg입니다.`);
    },
    ratioEquationTwoAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const lowPercent = pick(rng, [5, 6, 8]), highPercent = lowPercent + pick(rng, [6, 8, 10]), targetPercent = highPercent - pick(rng, [2, 3]);
        const lowMass = pick(rng, [100, 200, 300]), highMass = lowMass * (targetPercent - lowPercent) / (highPercent - targetPercent);
        return result(`진하기가 ${lowPercent}%인 소금물 ${lowMass}g과 ${highPercent}%인 소금물을 섞어 ${targetPercent}%인 소금물을 만들려고 합니다. ${highPercent}% 소금물은 몇 g 넣어야 합니까?${ratioEvidence("target-mixture-mass", [lowPercent, lowMass, highPercent, targetPercent])}`, highMass, `소금의 양을 같게 놓으면 ${lowMass}×${lowPercent}%+x×${highPercent}%=(${lowMass}+x)×${targetPercent}%입니다. x=${highMass}g입니다.`);
      }
      if (kind === 1) {
        const mass = pick(rng, [400, 500, 600]), firstPercent = pick(rng, [6, 8, 10]), targetPercent = firstPercent + pick(rng, [2, 4, 5]);
        const finalMass = mass * firstPercent / targetPercent, answer = mass - finalMass;
        return result(`진하기가 ${firstPercent}%인 소금물 ${mass}g을 매일 같은 양씩 증발시켰더니 진하기가 ${targetPercent}%가 되었습니다. 증발한 물은 모두 몇 g입니까?${ratioEvidence("evaporated-water", [mass, firstPercent, targetPercent])}`, answer, `소금의 양은 ${mass * firstPercent / 100}g으로 변하지 않습니다. 최종 무게는 ${mass * firstPercent / 100}÷${targetPercent}%=${finalMass}g이므로 ${answer}g이 증발했습니다.`);
      }
      if (kind === 2) {
        const mass = pick(rng, [200, 300, 400]), firstPercent = pick(rng, [4, 5, 6]), addedSalt = pick(rng, [8, 10, 12]), targetPercent = pick(rng, [5, 8, 10]);
        const salt = mass * firstPercent / 100 + addedSalt, finalMass = salt * 100 / targetPercent, answer = finalMass - mass - addedSalt;
        if (answer < 0 || !Number.isInteger(answer)) return generators.ratioEquationTwoAdvanced({ rng, level, variant });
        return result(`진하기가 ${firstPercent}%인 소금물 ${mass}g에 소금 ${addedSalt}g과 물을 더 넣어 진하기가 ${targetPercent}%인 소금물을 만들었습니다. 더 넣은 물은 몇 g입니까?${ratioEvidence("salt-and-water-addition", [mass, firstPercent, addedSalt, targetPercent])}`, answer, `소금은 모두 ${salt}g입니다. 최종 소금물은 ${salt}÷${targetPercent}%=${finalMass}g이므로 물은 ${finalMass}-${mass}-${addedSalt}=${answer}g 넣었습니다.`);
      }
      if (kind === 3) {
        const cost = pick(rng, [12000, 15000, 18000, 20000]), markup = pick(rng, [30, 40, 50]), discount = pick(rng, [1000, 1500, 1800, 2000]);
        const regular = cost * (100 + markup) / 100, sale = regular - discount, answer = decimal((sale - cost) / cost * 100, 1);
        return result(`원가가 ${cost.toLocaleString()}원인 물건에 ${markup}%의 이익을 붙여 정가를 정한 뒤 ${discount.toLocaleString()}원을 할인해 팔았습니다. 원가에 대한 남은 이익의 비율은 몇 %입니까?${ratioEvidence("markup-discount-profit-rate", [cost, markup, discount])}`, answer, `정가는 ${regular.toLocaleString()}원, 판매가는 ${sale.toLocaleString()}원입니다. 이익 ${sale - cost}원은 원가의 ${answer}%입니다.`);
      }
      if (kind === 4) {
        const scale = int(rng, 1, 3 + level), totalRegular = 77000 * scale, paid = 56000 * scale;
        const shoeDiscount = 30, clothesDiscount = 20;
        const shoeRegular = (totalRegular * (100 - clothesDiscount) - paid * 100) / (shoeDiscount - clothesDiscount);
        const clothesRegular = totalRegular - shoeRegular;
        return result(`신발은 정가보다 ${shoeDiscount}% 싸게, 옷은 정가보다 ${clothesDiscount}% 싸게 사서 모두 ${paid.toLocaleString()}원을 냈습니다. 두 물건의 정가 합이 ${totalRegular.toLocaleString()}원일 때 옷의 정가는 얼마입니까?${ratioEvidence("two-item-regular-price", [shoeDiscount, clothesDiscount, paid, totalRegular])}`, clothesRegular, `신발 정가를 x원이라 하면 x×70%+(${totalRegular}-x)×80%=${paid}입니다. 신발 정가는 ${shoeRegular.toLocaleString()}원, 옷 정가는 ${clothesRegular.toLocaleString()}원입니다.`);
      }
      const cost = pick(rng, [10000, 15000, 20000]), markup = pick(rng, [30, 40, 50]), discount = pick(rng, [10, 15, 20]);
      const fullSold = int(rng, 3, 8 + level), count = fullSold + int(rng, 6, 15 + level * 3);
      const regular = cost * (100 + markup) / 100, discounted = regular * (100 - discount) / 100;
      const totalProfit = fullSold * (regular - cost) + (count - fullSold) * (discounted - cost);
      return result(`원가가 ${cost.toLocaleString()}원인 상품에 ${markup}%의 이익을 붙여 정가를 정했습니다. ${fullSold}개는 정가에 팔고 나머지는 정가의 ${discount}%를 할인하여 모두 팔았더니 총이익이 ${totalProfit.toLocaleString()}원이었습니다. 처음 상품은 모두 몇 개였습니까?${ratioEvidence("mixed-sale-count", [cost, markup, discount, fullSold, totalProfit])}`, count, `정가 판매 한 개의 이익과 할인 판매 한 개의 이익을 각각 구해 식을 세우면 전체 상품 수는 ${count}개입니다.`);
    },
    cubeSurfaceAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const count = pick(rng, [8, 12, 18, 27, 36]);
        const rectangular = factorTriples(count);
        const minimum = Math.min(...rectangular.map(([a, b, c]) => 2 * (a * b + b * c + c * a)));
        const maximum = 4 * count + 2;
        return result(`한 모서리가 1cm인 정육면체 ${count}개를 면끼리 붙여 하나의 입체도형을 만듭니다. 모든 정육면체가 연결될 때 겉넓이의 최댓값과 최솟값을 차례로 구하세요.${volumeEvidence("cube-surface-extremes", [count])}`, `${maximum}cm², ${minimum}cm²`, `붙인 면이 최소 ${count - 1}쌍인 사슬 모양의 겉넓이는 6×${count}-2×${count - 1}=${maximum}cm²입니다. 가장 촘촘한 직육면체 배열의 겉넓이는 ${minimum}cm²입니다.`);
      }
      if (kind === 1) {
        const heights = pick(rng, [[[1, 2, 1], [2, 3, 2]], [[2, 1, 2], [3, 2, 1]], [[1, 3, 2], [2, 2, 3]], [[2, 2, 1], [1, 3, 2], [2, 1, 1]]]);
        const side = int(rng, 1, 2 + level), cells = cellsFromHeights(heights);
        const answer = voxelSurface(cells) * side * side;
        return result(`한 모서리 ${side}cm인 정육면체를 바닥 칸별 높이표와 같이 빈틈없이 쌓았습니다. 입체도형의 겉넓이를 구하세요.${heightMapTable({ title: "바닥 칸별 높이", heights })}${volumeEvidence("height-map-surface", [side, ...heights.flat(), heights.length, heights[0].length])}`, answer, `높이표에 따라 모든 정육면체의 이웃한 면을 지우고 바깥에 드러난 면을 세면 ${voxelSurface(cells)}면입니다. 한 면의 넓이가 ${side * side}cm²이므로 겉넓이는 ${answer}cm²입니다.`);
      }
      if (kind === 2) {
        const size = pick(rng, [5, 7]), hole = pick(rng, size === 5 ? [1, 3] : [1, 3]), directions = pick(rng, [["x"], ["x", "y"], ["x", "y", "z"]]);
        const cells = centeredTunnelCells({ size, hole, directions }), answer = voxelSurface(cells);
        const directionText = directions.length === 1 ? "앞뒤" : directions.length === 2 ? "앞뒤와 좌우" : "앞뒤·좌우·위아래";
        return result(`한 모서리가 ${size}cm인 정육면체의 정중앙에 단면이 ${hole}cm×${hole}cm인 구멍을 ${directionText} 방향으로 끝까지 관통시켰습니다. 남은 입체도형의 겉넓이를 구하세요.${tunnelCubeSvg({ size, hole, directions })}${volumeEvidence("centered-tunnel-surface", [size, hole, directions.length])}`, answer, `1cm 정육면체 모형에서 관통 부분을 제거한 뒤 바깥과 구멍 안쪽에 드러난 면을 모두 세면 ${answer}개이므로 겉넓이는 ${answer}cm²입니다.`);
      }
      if (kind === 3) {
        const side = int(rng, 1, 3), counts = pick(rng, [[3, 3, 3], [4, 3, 2], [5, 4, 2], [5, 3, 2]]);
        const count = counts[0] * counts[1] * counts[2];
        const smallTotal = count * 6 * side * side;
        const bigSurface = 2 * side * side * (counts[0] * counts[1] + counts[1] * counts[2] + counts[2] * counts[0]);
        const answer = ratioText(smallTotal, bigSurface);
        return result(`가로 ${counts[0] * side}cm, 세로 ${counts[1] * side}cm, 높이 ${counts[2] * side}cm인 직육면체를 한 모서리 ${side}cm인 정육면체로 모두 잘랐습니다. 작은 정육면체 겉넓이의 합과 원래 직육면체 겉넓이의 비를 가장 간단히 나타내세요.${cuboidSvg({ a: counts[0] * side, b: counts[1] * side, c: counts[2] * side })}${volumeEvidence("cut-cubes-surface-ratio", [side, ...counts])}`, answer, `작은 정육면체 ${count}개의 겉넓이 합은 ${smallTotal}cm², 원래 겉넓이는 ${bigSurface}cm²이므로 비는 ${answer}입니다.`);
      }
      if (kind === 4) {
        const size = pick(rng, [5, 7]), removedCount = int(rng, 1, 6);
        const middle = Math.floor(size / 2), removed = [[middle, middle, size - 1], [middle, middle, 0], [middle, 0, middle], [middle, size - 1, middle], [0, middle, middle], [size - 1, middle, middle]].slice(0, removedCount);
        const removedKeys = new Set(removed.map(cell => cell.join(","))), cells = [];
        for (let x = 0; x < size; x += 1) for (let y = 0; y < size; y += 1) for (let z = 0; z < size; z += 1) if (!removedKeys.has(`${x},${y},${z}`)) cells.push([x, y, z]);
        const answer = voxelSurface(cells);
        const faces = ["윗면", "아랫면", "앞면", "뒷면", "왼쪽 면", "오른쪽 면"].slice(0, removedCount).join(", ");
        return result(`한 모서리 ${size}cm인 정육면체를 1cm 정육면체로 채웠습니다. ${faces}의 정중앙에 있는 정육면체를 각각 1개씩 제거했습니다. 남은 입체도형의 겉넓이를 구하세요.${cuboidSvg({ a: size, b: size, c: size })}${volumeEvidence("removed-face-centers", [size, removedCount])}`, answer, `제거할 위치가 서로 만나지 않으므로 높이 모형에서 해당 정육면체를 뺀 뒤 드러난 면을 세면 ${answer}면입니다. 한 면이 1cm²이므로 겉넓이는 ${answer}cm²입니다.`);
      }
      const side = int(rng, 1, 3), parts = pick(rng, [[3, 3, 2], [4, 3, 2], [5, 2, 2], [3, 4, 3]]);
      const dimensions = parts.map(count => count * side), pieceCount = parts.reduce((total, value) => total * value, 1);
      const piecesSurface = pieceCount * 6 * side * side, originalSurface = 2 * (dimensions[0] * dimensions[1] + dimensions[1] * dimensions[2] + dimensions[2] * dimensions[0]);
      const answer = ratioText(piecesSurface, originalSurface);
      return result(`가로 ${dimensions[0]}cm, 세로 ${dimensions[1]}cm, 높이 ${dimensions[2]}cm인 직육면체를 ${parts.join("×")}등분하여 같은 정육면체 조각으로 잘랐습니다. 모든 조각의 겉넓이 합과 원래 겉넓이의 비를 구하세요.${cuboidSvg({ a: dimensions[0], b: dimensions[1], c: dimensions[2] })}${volumeEvidence("partition-surface-ratio", [...dimensions, ...parts])}`, answer, `조각은 ${pieceCount}개이고 겉넓이 합은 ${piecesSurface}cm²입니다. 원래 겉넓이 ${originalSurface}cm²와의 비는 ${answer}입니다.`);
    },
    cuboidVolumeAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const count = pick(rng, [24, 36, 48, 60, 72, 96]);
        const triples = factorTriples(count);
        return result(`한 모서리 1cm인 정육면체 ${count}개를 모두 사용해 빈틈없는 직육면체를 만듭니다. 돌리거나 뒤집어 같은 크기가 되는 것은 한 가지로 볼 때 서로 다른 직육면체는 몇 가지입니까?${volumeEvidence("factor-cuboids", [count])}`, triples.length, `가로≥세로≥높이로 두고 ${count}의 세 자연수 곱을 찾으면 ${triples.map(values => values.join("×")).join(", ")}로 ${triples.length}가지입니다.`);
      }
      if (kind === 1) {
        const heights = pick(rng, [[[1, 2, 3], [2, 1, 2]], [[2, 3, 1], [1, 2, 2]], [[3, 2], [2, 1], [1, 2]], [[1, 2, 1], [3, 2, 3]]]);
        const side = int(rng, 1, 3), cells = cellsFromHeights(heights);
        const volume = cells.length * side ** 3, surface = voxelSurface(cells) * side ** 2;
        return result(`한 모서리 ${side}cm인 정육면체를 높이표대로 쌓았습니다. 부피와 겉넓이를 차례로 구하세요.${heightMapTable({ title: "바닥 칸별 높이", heights })}${volumeEvidence("height-map-volume-surface", [side, ...heights.flat(), heights.length, heights[0].length])}`, `${volume}cm³, ${surface}cm²`, `정육면체는 ${cells.length}개이므로 부피는 ${volume}cm³입니다. 드러난 면은 ${voxelSurface(cells)}개이므로 겉넓이는 ${surface}cm²입니다.`);
      }
      if (kind === 2) {
        const [areaHigh, areaLow, high, low] = pick(rng, [[12, 20, 20, 8], [15, 25, 22, 10], [18, 30, 24, 9], [20, 30, 18, 8]]);
        const answer = decimal((areaHigh * high + areaLow * low) / (areaHigh + areaLow), 2);
        const table = valueTable(["부분", "높은 부분", "낮은 부분"], ["넓이·높이", `${areaHigh}m² · ${high}m`, `${areaLow}m² · ${low}m`]);
        return result(`두 부분의 흙을 옮겨 표면 높이가 같아지도록 고르게 만들었습니다. 흙의 손실이 없을 때 새 높이를 구하세요.${table}${volumeEvidence("equalized-soil-height", [areaHigh, areaLow, high, low])}`, answer, `전체 흙의 부피는 ${areaHigh * high + areaLow * low}m³이고 전체 밑넓이는 ${areaHigh + areaLow}m²이므로 높이는 ${answer}m입니다.`);
      }
      if (kind === 3) {
        const a = int(rng, 4, 8 + level), b = int(rng, 5, 10 + level), c = int(rng, 6, 12 + level);
        const loops = [2 * (a + b), 2 * (b + c), 2 * (c + a)];
        const answer = a * b * c;
        return result(`직육면체 상자를 서로 수직인 세 방향으로 한 바퀴씩 묶었습니다. 각 방향의 끈 길이가 ${loops.join("cm, ")}cm일 때 상자의 부피를 구하세요.${cuboidSvg({ a: "□", b: "□", c: "□" })}${volumeEvidence("three-loop-volume", [...loops])}`, answer, `세 식 a+b=${a + b}, b+c=${b + c}, c+a=${c + a}를 풀면 세 변은 ${a}, ${b}, ${c}cm입니다. 부피는 ${answer}cm³입니다.`);
      }
      if (kind === 4) {
        const a = int(rng, 3, 7 + level), b = int(rng, 4, 9 + level), c = int(rng, 5, 10 + level);
        const facePerimeters = [2 * (a + b), 2 * (b + c), 2 * (c + a)], answer = a * b * c;
        const table = valueTable(["묶은 면", "가로×세로", "세로×높이", "높이×가로"], ["끈 길이", ...facePerimeters.map(value => `${value}cm`)]);
        return result(`같은 상자를 서로 다른 면이 바닥에 오도록 놓고 각각 한 바퀴씩 묶은 끈 길이가 표와 같습니다. 상자 한 개의 부피를 구하세요.${table}${volumeEvidence("face-perimeter-volume", [...facePerimeters])}`, answer, `세 면의 둘레를 2로 나누어 변의 합을 구하고 연립하면 세 변은 ${a}, ${b}, ${c}cm입니다. 부피는 ${answer}cm³입니다.`);
      }
      const piece = [int(rng, 2, 5), int(rng, 2, 5), int(rng, 2, 5)], partitions = pick(rng, [[3, 3, 2], [3, 2, 3], [2, 3, 3]]);
      const dimensions = piece.map((value, index) => value * partitions[index]), answer = dimensions.reduce((total, value) => total * value, 1);
      return result(`가로 ${piece[0]}cm, 세로 ${piece[1]}cm, 높이 ${piece[2]}cm인 같은 직육면체 조각 18개가 ${partitions.join("×")} 배열로 원래 직육면체를 이룹니다. 원래 직육면체의 부피를 구하세요.${cuboidSvg({ a: dimensions[0], b: dimensions[1], c: dimensions[2] })}${volumeEvidence("eighteen-piece-volume", [...piece, ...partitions])}`, answer, `원래 세 변은 ${dimensions.join(", ")}cm이고 부피는 ${dimensions.join("×")}=${answer}cm³입니다.`);
    },
    surfaceVolumeAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const width = int(rng, 8, 13 + level), depth = int(rng, 4, 8 + level), height = int(rng, 7, 12 + level);
        const cutWidth = int(rng, 2, Math.min(4, width - 3)), cutHeight = int(rng, 2, Math.min(4, height - 2));
        const crossArea = width * height - cutWidth * cutHeight;
        const surface = 2 * crossArea + 2 * (width + height) * depth;
        const answer = crossArea * depth;
        return result(`깊이가 ${depth}cm이고 오른쪽 위로 가로 ${cutWidth}cm, 높이 ${cutHeight}cm인 홈이 끝까지 이어진 직육면체입니다. 전체 가로는 ${width}cm이고 겉넓이가 ${surface}cm²일 때 부피를 구하세요.${notchedProfileSvg({ width, cutWidth, cutHeight })}${volumeEvidence("notched-surface-volume", [width, depth, cutWidth, cutHeight, surface])}`, answer, `전체 높이를 h라 하면 겉넓이는 2(${width}h-${cutWidth}×${cutHeight})+2(${width}+h)×${depth}=${surface}입니다. h=${height}cm이고 부피는 (${width}×${height}-${cutWidth}×${cutHeight})×${depth}=${answer}cm³입니다.`);
      }
      if (kind === 1) {
        const heights = pick(rng, [[[1, 2, 1], [2, 3, 2]], [[2, 1, 2], [1, 3, 1]], [[1, 2, 1], [2, 2, 2], [1, 3, 1]], [[2, 2], [3, 1], [1, 2]]]);
        const cells = cellsFromHeights(heights), side = int(rng, 2, 4 + level);
        const volume = cells.length * side ** 3, answer = voxelSurface(cells) * side ** 2;
        return result(`크기가 같은 정육면체를 높이표대로 이어 붙였습니다. 입체도형의 부피가 ${volume}cm³일 때 겉넓이를 구하세요.${heightMapTable({ title: "정육면체 높이표", heights })}${volumeEvidence("joined-cubes-volume-surface", [volume, cells.length, voxelSurface(cells)])}`, answer, `정육면체 한 개의 부피는 ${volume}÷${cells.length}=${side ** 3}cm³이므로 한 모서리는 ${side}cm입니다. 드러난 면 ${voxelSurface(cells)}개의 넓이 합은 ${answer}cm²입니다.`);
      }
      if (kind === 2) {
        const a = int(rng, 4, 9 + level), b = int(rng, 5, 10 + level), c = int(rng, 6, 12 + level);
        const faces = [a * b, b * c, c * a], answer = a * b * c;
        return result(`직육면체에서 한 꼭짓점에서 만나는 서로 이웃한 세 면의 넓이가 각각 ${faces.join("cm², ")}cm²입니다. 직육면체의 부피를 구하세요.${cuboidSvg({ a: "□", b: "□", c: "□" })}${volumeEvidence("three-face-areas-volume", faces)}`, answer, `세 면의 넓이를 모두 곱하면 (abc)²입니다. √(${faces.join("×")})=${answer}이므로 부피는 ${answer}cm³입니다.`);
      }
      if (kind === 3) {
        const layers = int(rng, 3, 5 + level), side = int(rng, 1, 3);
        const heights = Array.from({ length: layers }, (_, y) => Array.from({ length: layers }, (_, x) => Math.max(0, layers - Math.max(x, y))));
        const cells = cellsFromHeights(heights), exposed = voxelSurface(cells), unpaintedFaces = 6 * cells.length - exposed;
        const answer = unpaintedFaces * side * side;
        return result(`한 모서리 ${side}cm인 정육면체를 높이표와 같이 층층이 쌓고 바깥에 드러난 면을 모두 색칠했습니다. 모든 정육면체 면 중 색칠되지 않은 면의 넓이 합을 구하세요.${heightMapTable({ title: `${layers}층 계단 쌓기 높이표`, heights })}${volumeEvidence("painted-pyramid-unpainted", [side, cells.length, exposed])}`, answer, `전체 면은 6×${cells.length}=${6 * cells.length}개이고 바깥에 드러난 면은 ${exposed}개입니다. 색칠되지 않은 ${unpaintedFaces}면의 넓이는 ${answer}cm²입니다.`);
      }
      if (kind === 4) {
        const width = int(rng, 4, 9 + level), depth = int(rng, 5, 11 + level), height = int(rng, 6, 12 + level);
        const topArea = width * depth, frontArea = width * height, answer = width * depth * height;
        const table = valueTable(["보기", "공통 가로", "직사각형 넓이"], ["위·앞", `${width}cm`, `위 ${topArea}cm² · 앞 ${frontArea}cm²`]);
        return result(`직육면체를 위와 앞에서 보니 두 직사각형의 공통 가로 길이와 넓이가 표와 같았습니다. 직육면체의 부피를 구하세요.${table}${volumeEvidence("top-front-volume", [width, topArea, frontArea])}`, answer, `세로는 ${topArea}÷${width}=${depth}cm, 높이는 ${frontArea}÷${width}=${height}cm입니다. 부피는 ${answer}cm³입니다.`);
      }
      const layers = int(rng, 3, 7 + level), side = int(rng, 1, 3);
      const heights = [Array.from({ length: layers }, (_, index) => layers - index)];
      const targetSurface = voxelSurface(cellsFromHeights(heights)) * side * side;
      const example = [[3, 2, 1]];
      return result(`한 모서리 ${side}cm인 정육면체를 첫째 열 ${layers}층, 다음 열은 한 층씩 낮게 하여 마지막 열이 1층이 되도록 계단 모양으로 쌓았습니다. 겉넓이가 ${targetSurface}cm²일 때 모두 몇 층으로 쌓았는지 구하세요.${heightMapTable({ title: "3층일 때의 규칙 예시", heights: example })}${volumeEvidence("stair-surface-layers", [side, targetSurface])}`, layers, `n층일 때 높이표 [n,n-1,…,1]의 바깥 면을 세어 ${targetSurface}cm²가 되는 n을 찾으면 ${layers}입니다.`);
    },
    volumeApplicationAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const [width, depth, height, waterHeight] = pick(rng, [[20, 15, 30, 18], [24, 16, 32, 20], [30, 18, 36, 24], [28, 20, 35, 25], [32, 18, 40, 30]]);
        const volume = width * depth * waterHeight, newBase = depth * height, answer = decimal(volume / newBase, 2);
        return result(`가로 ${width}cm, 세로 ${depth}cm, 높이 ${height}cm인 직육면체 수조에 물이 ${waterHeight}cm 높이까지 있습니다. 물을 쏟지 않고 세로×높이인 면이 바닥이 되도록 세우면 물의 높이는 몇 cm입니까?${waterTankSvg({ width, depth, height, waterHeight })}${volumeEvidence("reoriented-water-height", [width, depth, height, waterHeight])}`, answer, `물의 부피는 ${width}×${depth}×${waterHeight}=${volume}cm³입니다. 새 밑넓이는 ${depth}×${height}=${newBase}cm²이므로 높이는 ${answer}cm입니다.`);
      }
      if (kind === 1) {
        const outerWidth = pick(rng, [30, 40, 50]), outerDepth = pick(rng, [24, 30, 36]), outerHeight = pick(rng, [20, 24, 30]), thickness = pick(rng, [2, 3, 4]);
        if (outerWidth <= 2 * thickness || outerDepth <= 2 * thickness || outerHeight <= thickness) return generators.volumeApplicationAdvanced({ rng, level, variant });
        const inner = [outerWidth - 2 * thickness, outerDepth - 2 * thickness, outerHeight - thickness];
        const answer = decimal(inner.reduce((total, value) => total * value, 1) / 1000, 3);
        return result(`겉의 가로 ${outerWidth}cm, 세로 ${outerDepth}cm, 높이 ${outerHeight}cm인 뚜껑 없는 직육면체 그릇의 바닥과 옆면 두께는 모두 ${thickness}cm입니다. 그릇에 가득 담을 수 있는 물은 몇 L입니까?${cuboidSvg({ a: outerWidth, b: outerDepth, c: outerHeight })}${volumeEvidence("thick-container-capacity", [outerWidth, outerDepth, outerHeight, thickness])}`, answer, `안쪽 크기는 ${inner.join("×")}cm입니다. 들이는 ${inner.reduce((total, value) => total * value, 1)}cm³=${answer}L입니다.`);
      }
      if (kind === 2) {
        const width = pick(rng, [30, 36, 40]), depth = pick(rng, [20, 24, 30]), initialHeight = pick(rng, [16, 18, 20]), newBase = pick(rng, [600, 720, 800]), maxHeight = pick(rng, [8, 10, 12]);
        const volume = width * depth * initialHeight, capacity = newBase * maxHeight, spilled = Math.max(0, volume - capacity);
        if (!spilled) return generators.volumeApplicationAdvanced({ rng, level, variant });
        return result(`열린 수조에 가로 ${width}cm, 세로 ${depth}cm인 밑면으로 물이 ${initialHeight}cm 높이까지 있습니다. 수조를 기울여 다른 면을 바닥에 놓으면 새 밑넓이는 ${newBase}cm²이고 열린 가장자리까지 높이는 ${maxHeight}cm입니다. 넘쳐 쏟아지는 물의 양을 구하세요.${waterTankSvg({ width, depth, height: Math.max(initialHeight + 4, maxHeight + 4), waterHeight: initialHeight, title: "기울이기 전 수조" })}${volumeEvidence("tilted-spilled-volume", [width, depth, initialHeight, newBase, maxHeight])}`, spilled, `처음 물은 ${volume}cm³이고 새 자세에서 최대 ${capacity}cm³를 담습니다. 차 ${spilled}cm³가 쏟아집니다.`);
      }
      if (kind === 3) {
        const width = pick(rng, [20, 24, 30]), depth = pick(rng, [15, 20, 25]), initialHeight = pick(rng, [8, 10, 12]), rise = pick(rng, [2, 3, 4]);
        const objectVolume = width * depth * rise, answer = initialHeight + rise;
        return result(`밑면이 ${width}cm×${depth}cm인 직육면체 수조에 물이 ${initialHeight}cm 높이까지 있습니다. 부피가 ${objectVolume}cm³인 물체를 완전히 잠기게 넣으면 물의 높이는 몇 cm입니까?${waterTankSvg({ width, depth, height: answer + 6, waterHeight: initialHeight })}${volumeEvidence("submerged-object-height", [width, depth, initialHeight, objectVolume])}`, answer, `물체가 밀어낸 부피만큼 수위가 ${objectVolume}÷(${width}×${depth})=${rise}cm 오르므로 새 높이는 ${answer}cm입니다.`);
      }
      if (kind === 4) {
        const width = pick(rng, [20, 24, 30]), depth = pick(rng, [15, 20, 25]), initialHeight = pick(rng, [8, 10, 12]);
        const rodWidth = pick(rng, [4, 5, 6]), rodDepth = pick(rng, [4, 5, 6]), baseArea = width * depth, rodArea = rodWidth * rodDepth;
        const answer = decimal(baseArea * initialHeight / (baseArea - rodArea), 2);
        return result(`밑면이 ${width}cm×${depth}cm인 수조에 물이 ${initialHeight}cm 높이까지 있습니다. 밑면이 ${rodWidth}cm×${rodDepth}cm이고 물보다 높은 직육면체 막대를 바닥에 수직으로 세우면 물의 높이는 몇 cm입니까?${waterTankSvg({ width, depth, height: Math.ceil(Number(answer)) + 6, waterHeight: initialHeight })}${volumeEvidence("vertical-rod-height", [width, depth, initialHeight, rodWidth, rodDepth])}`, answer, `물의 부피 ${baseArea * initialHeight}cm³는 막대 밖 밑넓이 ${baseArea - rodArea}cm²×새 높이입니다. 새 높이는 ${answer}cm입니다.`);
      }
      const depth = pick(rng, [10, 12, 15]), widthA = pick(rng, [12, 15, 18]), widthB = pick(rng, [18, 20, 24]), heightA = pick(rng, [12, 15, 18]), heightB = pick(rng, [5, 6, 8]);
      const answer = decimal((widthA * heightA + widthB * heightB) / (widthA + widthB), 2);
      const table = valueTable(["구간", "가", "나"], ["가로·물높이", `${widthA}cm · ${heightA}cm`, `${widthB}cm · ${heightB}cm`]);
      return result(`세로가 모두 ${depth}cm인 직육면체 수조를 칸막이로 나눈 두 구간의 가로와 물높이가 표와 같습니다. 칸막이를 빼면 물높이는 몇 cm가 됩니까?${table}${volumeEvidence("partition-final-height", [widthA, widthB, heightA, heightB])}`, answer, `세로는 공통이므로 물의 단면적 합을 전체 가로로 나눕니다. (${widthA}×${heightA}+${widthB}×${heightB})÷(${widthA}+${widthB})=${answer}cm입니다.`);
    },
    pictureGraphAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const average14 = pick(rng, [300, 320, 340, 360]), base = pick(rng, [280, 310, 340]);
        const values = [average14 - 40, base - 20, base + 10, average14 + 40, base + 10, base + 40];
        const chart = pictographTable({ title: "학년별 학생 수", labels: ["1학년", "2학년", "3학년", "4학년", "5학년", "6학년"], values, largeUnit: 100, smallUnit: 10, hiddenIndices: [0, 4] });
        const answer = `${values[0]}명, ${values[4]}명`;
        return result(`1학년과 4학년 학생 수의 평균은 ${average14}명입니다. 5학년 학생 수는 2학년, 3학년, 6학년 학생 수의 평균과 같습니다. 그림그래프에서 빈 두 학년의 학생 수를 차례로 구하세요.${chart}${graphEvidence("picture-missing-grades", values)}`, answer, `1학년은 ${average14}×2-${values[3]}=${values[0]}명입니다. 5학년은 (${values[1]}+${values[2]}+${values[5]})÷3=${values[4]}명입니다.`);
      }
      if (kind === 1) {
        const average = pick(rng, [300, 340, 380, 420]);
        const values = [average - 60, average - 20, average + 20, average + 60];
        const chart = pictographTable({ title: "마을별 학생 수", labels: ["가", "나", "다", "라"], values, largeUnit: 100, smallUnit: 10, hiddenIndices: [0, 3] });
        const answer = `${values[0]}명, ${values[3]}명`;
        return result(`네 마을의 학생 수 평균은 ${average}명이고, 가 마을은 라 마을보다 120명 적습니다. 그림그래프의 빈 두 마을 학생 수를 가, 라 순서로 구하세요.${chart}${graphEvidence("picture-average-difference", values)}`, answer, `네 마을의 합은 ${average * 4}명입니다. 가와 라의 합은 ${values[0] + values[3]}명이고 차가 120명이므로 가=${values[0]}명, 라=${values[3]}명입니다.`);
      }
      if (kind === 2) {
        const machines = [5, 8, 4, 10, 6];
        const perMachine = shuffle(rng, pick(rng, [[3000, 5000, 7000, 9000, 11000], [2000, 5000, 8000, 10000, 14000], [4000, 6000, 9000, 12000, 15000], [3000, 7000, 10000, 13000, 16000]]));
        const production = machines.map((count, index) => count * perMachine[index]);
        const difference = Math.max(...perMachine) - Math.min(...perMachine);
        const chart = pictographTable({ title: "공장별 연필 생산량", labels: ["가", "나", "다", "라", "마"], values: production, largeUnit: 20000, smallUnit: 1000, unitLabel: "자루" });
        const table = valueTable(["공장", "가", "나", "다", "라", "마"], ["기계 수", ...machines]);
        return result(`그림그래프는 다섯 공장의 하루 연필 생산량입니다. 공장별 기계 수가 표와 같을 때, 기계 한 대당 생산량이 가장 많은 공장과 가장 적은 공장의 생산량 차를 구하세요.${chart}${table}${graphEvidence("picture-machine-average", [...machines, ...production])}`, difference, `각 공장의 생산량을 기계 수로 나누면 한 대당 ${perMachine.map(value => value.toLocaleString()).join(", ")}자루입니다. 최댓값과 최솟값의 차는 ${difference.toLocaleString()}자루입니다.`);
      }
      if (kind === 3) {
        const average = pick(rng, [18000, 22000, 26000, 30000]);
        const values = [average - 3000, average - 1000, average + 1000, average + 3000];
        const difference = Math.max(...values) - Math.min(...values);
        const chart = pictographTable({ title: "구별 등록 인구", labels: ["가구", "나구", "다구", "라구"], values, largeUnit: 10000, smallUnit: 1000 });
        const answer = `차 ${difference}명, 평균 ${average}명`;
        return result(`그림그래프를 보고 가장 많은 구와 가장 적은 구의 인구 차, 네 구의 평균을 차례로 구하세요.${chart}${graphEvidence("picture-range-average", values)}`, answer, `최댓값 ${Math.max(...values).toLocaleString()}명과 최솟값 ${Math.min(...values).toLocaleString()}명의 차는 ${difference.toLocaleString()}명이고, 네 구의 평균은 ${average.toLocaleString()}명입니다.`);
      }
      if (kind === 4) {
        const displayA = int(rng, 4, 7) * 10000 + int(rng, 1, 8) * 1000;
        const displayB = int(rng, 1, 3) * 10000 + int(rng, 1, 8) * 1000;
        const values = [displayA, displayB];
        const answer = displayA - displayB + 999;
        const chart = pictographTable({ title: "천의 자리까지 반올림한 인구", labels: ["가 지역", "나 지역"], values, largeUnit: 10000, smallUnit: 1000 });
        return result(`실제 인구를 반올림하여 천의 자리까지 나타낸 그림그래프입니다. 가 지역의 실제 인구가 나 지역보다 많을 수 있는 최대 차를 구하세요.${chart}${graphEvidence("picture-rounded-max-gap", values)}`, answer, `가는 최대 ${displayA + 499}명, 나는 최소 ${displayB - 500}명일 수 있습니다. 최대 차는 ${displayA + 499}-${displayB - 500}=${answer.toLocaleString()}명입니다.`);
      }
      const scale = int(rng, 1, 2 + level);
      const initial = pick(rng, [[2800, 4000, 3200, 3600], [3200, 4800, 3600, 4000], [3600, 4400, 4000, 3200]]).map(value => value * scale);
      const moved = initial[1] / 10;
      const redistributed = [initial[0] + moved, initial[1] - moved * 3, initial[2] + moved, initial[3] + moved];
      const changes = [110, 90, 110, 90];
      const finalValues = redistributed.map((value, index) => value * changes[index] / 100);
      const answer = finalValues.reduce((sum, value) => sum + value, 0) / 4;
      const chart = pictographTable({ title: "이동 전 마을별 인구", labels: ["A", "B", "C", "D"], values: initial, largeUnit: 1000, smallUnit: 100 });
      return result(`그림그래프는 이동 전 네 마을의 인구입니다. B마을 인구의 30%가 A, C, D마을로 똑같이 나누어 이사했습니다. 그 뒤 A와 C는 각각 10% 늘고 B와 D는 각각 10% 줄었다면 네 마을의 최종 인구 평균을 구하세요.${chart}${graphEvidence("picture-move-average", [...initial, ...changes])}`, answer, `B마을에서 각 마을로 ${moved}명씩 이동한 뒤 인구는 ${redistributed.join(", ")}명입니다. 10% 변화를 적용한 최종 인구의 합은 ${finalValues.reduce((sum, value) => sum + value, 0)}명이므로 평균은 ${answer}명입니다.`);
    },
    stripGraphAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const total = pick(rng, [800, 1000, 1200]);
        const classPercent = pick(rng, [20, 25, 30]), fruitPercent = pick(rng, [30, 35, 40]);
        const classSegments = [{ label: "1반", percent: 30 }, { label: "2반", percent: classPercent }, { label: "3반", percent: 25 }, { label: "4반", percent: 45 - classPercent }];
        const fruitSegments = [{ label: "사과", percent: fruitPercent }, { label: "귤", percent: 30 }, { label: "포도", percent: 20 }, { label: "기타", percent: 50 - fruitPercent }];
        const answer = total * classPercent * fruitPercent / 10000;
        return result(`전교생은 ${total}명입니다. 첫 띠그래프는 반별 비율이고, 둘째는 2반 학생들이 좋아하는 과일의 비율입니다. 2반에서 사과를 좋아하는 학생은 몇 명입니까?${graphPair(stripGraphSvg({ title: "반별 학생", segments: classSegments }), stripGraphSvg({ title: "2반의 선호 과일", segments: fruitSegments }))}${graphEvidence("strip-nested-percent", [total, classPercent, fruitPercent])}`, answer, `2반은 ${total}×${classPercent}%=${total * classPercent / 100}명이고, 그중 ${fruitPercent}%는 ${answer}명입니다.`);
      }
      if (kind === 1) {
        const totalA = pick(rng, [600, 800, 1000]), totalB = totalA - pick(rng, [100, 200]);
        const targetA = pick(rng, [20, 25, 30]), targetB = pick(rng, [15, 20, 25]);
        const valuesA = [15, targetA, 20, 15, 15, 35 - targetA];
        const valuesB = [15, targetB, 20, 20, 15, 30 - targetB];
        const countA = totalA * targetA / 100, countB = totalB * targetB / 100;
        const answer = Math.abs(countA - countB);
        const make = (title, values) => stripGraphSvg({ title, segments: values.map((percent, index) => ({ label: `${index + 1}학년`, percent })) });
        return result(`가 학교는 ${totalA}명, 나 학교는 ${totalB}명입니다. 두 띠그래프에서 2학년 학생 수의 차를 구하세요.${graphPair(make("가 학교", valuesA), make("나 학교", valuesB))}${graphEvidence("strip-two-groups", [totalA, totalB, targetA, targetB])}`, answer, `2학년은 각각 ${countA}명, ${countB}명이므로 차는 ${answer}명입니다.`);
      }
      if (kind === 2) {
        const totalA = pick(rng, [800, 1000, 1200]), totalB = pick(rng, [600, 800, 1000]);
        const percentA = pick(rng, [20, 25, 30]), percentB = pick(rng, [30, 35, 40]);
        const make = (title, target) => stripGraphSvg({ title, segments: [{ label: "140 미만", percent: 25 }, { label: "140~150", percent: 30 }, { label: "150~160", percent: target }, { label: "160 이상", percent: 45 - target }] });
        const countA = totalA * percentA / 100, countB = totalB * percentB / 100;
        const answer = Math.abs(countA - countB);
        return result(`두 해에 조사한 학생은 각각 ${totalA}명과 ${totalB}명입니다. 키가 150cm 이상 160cm 미만인 학생 수의 차를 구하세요.${graphPair(make("첫째 해", percentA), make("둘째 해", percentB))}${graphEvidence("strip-period-count-gap", [totalA, totalB, percentA, percentB])}`, answer, `해당 구간의 학생은 각각 ${countA}명과 ${countB}명이므로 차는 ${answer}명입니다.`);
      }
      if (kind === 3) {
        const scale = int(rng, 1, 4 + level), total = 80 * scale;
        const counts = [14, 6, 32, 28].map(value => value * scale);
        const percents = counts.map(value => value * 100 / total);
        const segments = ["봄", "여름", "가을", "겨울"].map((label, index) => ({ label, percent: percents[index], showPercent: index === 1 }));
        return result(`학생 ${total}명의 태어난 계절을 나타낸 띠그래프입니다. 여름은 봄의 3/7이고 겨울은 봄의 2배입니다. 가을에 태어난 학생 수를 구하세요.${stripGraphSvg({ title: "태어난 계절", segments })}${graphEvidence("strip-missing-season", [total, ...counts])}`, counts[2], `봄을 14칸으로 보면 여름은 6칸, 겨울은 28칸입니다. 전체 비를 실제 인원에 맞추면 가을은 ${counts[2]}명입니다.`);
      }
      if (kind === 4) {
        const total = pick(rng, [250, 500]), essayPercent = 20;
        const geometryPercent = pick(rng, [20, 30, 40]);
        const geometryCount = total * essayPercent * geometryPercent / 10000;
        const correct = int(rng, 2, Math.max(2, geometryCount - 1));
        const segments = [{ label: "수와 연산", percent: 35 }, { label: "도형", percent: geometryPercent }, { label: "측정", percent: 15 }, { label: "규칙", percent: 10 }, { label: "자료", percent: 40 - geometryPercent }];
        const answer = geometryCount - correct;
        return result(`문제집은 ${total}문제이고 서술형은 전체의 ${essayPercent}%입니다. 서술형 문제의 영역별 비율이 띠그래프와 같고, 도형 영역 서술형을 ${correct}문제 맞혔다면 틀린 도형 영역 서술형은 몇 문제입니까?${stripGraphSvg({ title: "영역별 서술형 문제", segments })}${graphEvidence("strip-domain-wrong", [total, essayPercent, geometryPercent, correct])}`, answer, `서술형은 ${total * essayPercent / 100}문제이고 도형 영역은 그중 ${geometryPercent}%인 ${geometryCount}문제입니다. ${correct}문제를 맞혔으므로 ${answer}문제를 틀렸습니다.`);
      }
      const percentSets = [[15, 25, 30, 30], [20, 25, 20, 35], [25, 20, 35, 20], [30, 20, 25, 25]];
      const percents = pick(rng, percentSets), total = 400;
      const counts = percents.map(percent => percent * total / 100);
      const dimensions = pick(rng, [[18, 5, 10, 7], [20, 6, 10, 8], [24, 5, 10, 8], [20, 7, 10, 10]]);
      const areaGap = dimensions[0] * dimensions[1] - dimensions[2] * dimensions[3];
      const answer = percents[3] * areaGap / 100;
      const table = valueTable(["학년", "3학년", "4학년", "5학년", "6학년"], ["학생 수", ...counts]);
      const chart = stripGraphSvg({ title: "학년별 학생 비율", segments: percents.map((percent, index) => ({ label: `${index + 3}학년`, percent })) });
      return result(`표의 자료를 가로 ${dimensions[0]}cm, 세로 ${dimensions[1]}cm인 띠그래프와 가로 ${dimensions[2]}cm, 세로 ${dimensions[3]}cm인 띠그래프로 각각 나타냈습니다. 두 띠그래프에서 6학년이 차지하는 넓이의 차를 구하세요.${table}${chart}${graphEvidence("strip-area-gap", [...counts, ...dimensions])}`, answer, `6학년 비율은 ${percents[3]}%입니다. 두 직사각형 넓이의 차 ${areaGap}cm²의 ${percents[3]}%는 ${answer}cm²입니다.`);
    },
    pieGraphAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const [total, fairy, biography, novel, other] = pick(rng, [[1200, 444, 384, 288, 84], [1000, 360, 320, 250, 70], [1500, 540, 480, 360, 120], [2000, 720, 640, 500, 140]]);
        const counts = [fairy, biography, novel, other], labels = ["동화책", "위인전", "소설책", "기타"];
        const segments = counts.map((count, index) => ({ label: labels[index], percent: count * 100 / total, showPercent: index >= 2 }));
        const answer = biography - novel;
        return result(`도서관의 책은 ${total}권입니다. 동화책과 위인전은 전체의 ${(fairy + biography) * 100 / total}%이고 동화책이 위인전보다 ${fairy - biography}권 많습니다. 원그래프를 보고 위인전은 소설책보다 몇 권 더 많은지 구하세요.${pieGraphSvg({ title: "종류별 책", segments })}${graphEvidence("pie-sum-difference", [total, ...counts])}`, answer, `동화책과 위인전은 ${fairy + biography}권이고 차가 ${fairy - biography}권이므로 위인전은 ${biography}권입니다. 소설책 ${novel}권보다 ${answer}권 많습니다.`);
      }
      if (kind === 1) {
        const totalA = pick(rng, [800, 1000, 1200]), totalB = pick(rng, [600, 800, 1000]);
        const cowA = pick(rng, [30, 35]), cowB = pick(rng, [35, 40]);
        const make = (title, cow) => pieGraphSvg({ title, segments: [{ label: "닭", percent: 25 }, { label: "돼지", percent: 20 }, { label: "소", percent: cow }, { label: "기타", percent: 55 - cow }] });
        const countA = totalA * cowA / 100, countB = totalB * cowB / 100;
        const answer = `가 ${countA}마리, 나 ${countB}마리`;
        return result(`가 마을은 가축 ${totalA}마리, 나 마을은 ${totalB}마리를 기릅니다. 두 원그래프를 보고 소의 수를 가, 나 순서로 구하세요.${graphPair(make("가 마을", cowA), make("나 마을", cowB))}${graphEvidence("pie-two-villages", [totalA, totalB, cowA, cowB])}`, answer, `소는 각각 ${totalA}×${cowA}%=${countA}마리, ${totalB}×${cowB}%=${countB}마리입니다.`);
      }
      if (kind === 2) {
        const scale = int(rng, 1, 3 + level), totalA = 200 * scale, totalB = 300 * scale;
        const [beanA, beanB] = pick(rng, [[20, 30], [25, 35], [30, 40], [35, 45]]);
        const make = (title, bean) => pieGraphSvg({ title, segments: [{ label: "쌀", percent: 30 }, { label: "보리", percent: 20 }, { label: "콩", percent: bean }, { label: "기타", percent: 50 - bean }] });
        const beanCount = totalA * beanA / 100 + totalB * beanB / 100;
        const answer = beanCount * 100 / (totalA + totalB);
        return result(`가 마을은 곡물 ${totalA}t, 나 마을은 ${totalB}t을 생산합니다. 두 마을을 합친 전체 곡물 생산량 중 콩은 몇 %입니까?${graphPair(make("가 마을", beanA), make("나 마을", beanB))}${graphEvidence("pie-combined-rate", [totalA, totalB, beanA, beanB])}`, answer, `콩은 모두 ${beanCount}t이고 두 마을 전체는 ${totalA + totalB}t입니다. ${beanCount}÷${totalA + totalB}×100=${answer}%입니다.`);
      }
      if (kind === 3) {
        const [weight, otherPercent, calciumPart, requirement] = pick(rng, [[400, 2, 25, 5], [300, 4, 25, 5], [500, 2, 20, 6], [400, 5, 25, 8], [200, 2, 25, 5], [250, 4, 20, 7]]);
        const calcium = weight * otherPercent / 100 * calciumPart / 100;
        const answer = Math.ceil(requirement / calcium);
        const segments = [{ label: "수분", percent: 100 - otherPercent - 9 }, { label: "탄수화물", percent: 7 }, { label: "단백질", percent: 2 }, { label: "기타", percent: otherPercent }];
        return result(`과일 한 개의 무게는 ${weight}g이고, 기타 성분의 ${calciumPart}%가 칼슘입니다. 칼슘 하루 충분 섭취량이 ${requirement}g일 때 이 과일을 적어도 몇 개 먹어야 합니까?${pieGraphSvg({ title: "과일의 영양 성분", segments })}${graphEvidence("pie-nutrition-ceil", [weight, otherPercent, calciumPart, requirement])}`, answer, `한 개의 칼슘은 ${weight}×${otherPercent}%×${calciumPart}%=${calcium}g입니다. ${requirement}÷${calcium}을 올림하면 ${answer}개입니다.`);
      }
      if (kind === 4) {
        const scale = int(rng, 1, 3 + level), totalA = 2000000 * scale, totalB = 2500000 * scale;
        const percentA = pick(rng, [18, 20, 24]), percentB = pick(rng, [20, 24, 28]);
        const make = (title, percent) => pieGraphSvg({ title, segments: [{ label: "순대", percent }, { label: "떡볶이", percent: 28 }, { label: "김밥", percent: 22 }, { label: "기타", percent: 50 - percent }] });
        const salesA = totalA * percentA / 100, salesB = totalB * percentB / 100;
        const answer = Math.abs(salesA - salesB);
        return result(`가 분식점의 하루 매출은 ${totalA.toLocaleString()}원, 나 분식점은 ${totalB.toLocaleString()}원입니다. 두 원그래프를 보고 순대 매출액의 차를 구하세요.${graphPair(make("가 분식점", percentA), make("나 분식점", percentB))}${graphEvidence("pie-sales-gap", [totalA, totalB, percentA, percentB])}`, answer, `순대 매출은 각각 ${salesA.toLocaleString()}원, ${salesB.toLocaleString()}원이므로 차는 ${answer.toLocaleString()}원입니다.`);
      }
      const total = pick(rng, [1200, 1600, 2000]);
      const [mountain, sea, both] = pick(rng, [[60, 50, 30], [55, 45, 25], [65, 40, 20]]);
      const union = mountain + sea - both;
      const yesNo = (title, yes) => pieGraphSvg({ title, segments: [{ label: "좋아함", percent: yes }, { label: "좋아하지 않음", percent: 100 - yes }] });
      const charts = `${graphPair(yesNo("산", mountain), yesNo("바다", sea))}${yesNo("산과 바다 모두", both)}`;
      const answer = total * union / 100;
      return result(`학생 ${total}명을 조사한 원그래프입니다. 산이나 바다 중 적어도 하나를 좋아하는 학생은 몇 명입니까?${charts}${graphEvidence("pie-union", [total, mountain, sea, both])}`, answer, `적어도 하나를 좋아하는 비율은 ${mountain}+${sea}-${both}=${union}%입니다. 학생 수는 ${total}×${union}%=${answer}명입니다.`);
    },
    combinedGraphAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const total = pick(rng, [4000, 8000]), approve = pick(rng, [70, 75]);
        const approveReasons = [35, 34, 22, 9], opposeReasons = [33, 32, 28, 7];
        const approveCount = total * approve / 100, opposeCount = total - approveCount;
        const maxApprove = approveCount * Math.max(...approveReasons) / 100;
        const maxOppose = opposeCount * Math.max(...opposeReasons) / 100;
        const answer = maxApprove - maxOppose;
        const pie = pieGraphSvg({ title: "찬반 여부", segments: [{ label: "찬성", percent: approve }, { label: "반대", percent: 100 - approve }] });
        const reasonLabels = ["필요성", "활용성", "접근성", "기타"];
        const strips = graphPair(stripGraphSvg({ title: "찬성 이유", segments: approveReasons.map((percent, index) => ({ label: reasonLabels[index], percent })) }), stripGraphSvg({ title: "반대 이유", segments: opposeReasons.map((percent, index) => ({ label: reasonLabels[index], percent })) }));
        return result(`주민 ${total}명을 대상으로 한 찬반 원그래프와 이유별 띠그래프입니다. 가장 많은 찬성 이유의 인원은 가장 많은 반대 이유의 인원보다 몇 명 더 많습니까?${pie}${strips}${graphEvidence("combined-approval-reasons", [total, approve, ...approveReasons, ...opposeReasons])}`, answer, `찬성 ${approveCount}명의 가장 큰 이유는 ${maxApprove}명, 반대 ${opposeCount}명의 가장 큰 이유는 ${maxOppose}명입니다. 차는 ${answer}명입니다.`);
      }
      if (kind === 1) {
        const total = pick(rng, [800, 1200]), malePercent = pick(rng, [55, 60]);
        const male = total * malePercent / 100, female = total - male;
        const labels = ["피아노", "미술", "태권도"];
        const maleRates = pick(rng, [[25, 35, 40], [30, 25, 45]]), femaleRates = pick(rng, [[45, 25, 30], [35, 40, 25]]);
        const counts = labels.map((_, index) => male * maleRates[index] / 100 + female * femaleRates[index] / 100);
        const max = Math.max(...counts), winner = labels[counts.indexOf(max)];
        const pie = pieGraphSvg({ title: "남녀 학생", segments: [{ label: "남학생", percent: malePercent }, { label: "여학생", percent: 100 - malePercent }] });
        const strips = graphPair(stripGraphSvg({ title: "남학생 선택", segments: labels.map((label, index) => ({ label, percent: maleRates[index] })) }), stripGraphSvg({ title: "여학생 선택", segments: labels.map((label, index) => ({ label, percent: femaleRates[index] })) }));
        return result(`학생 ${total}명의 성별 원그래프와 학원 선택 띠그래프입니다. 가장 많은 학생이 선택한 학원과 그 학생 수를 구하세요.${pie}${strips}${graphEvidence("combined-gender-choice", [total, malePercent, ...maleRates, ...femaleRates])}`, `${winner}, ${max}명`, `남학생 ${male}명과 여학생 ${female}명에 각 비율을 적용하면 학원별 학생 수는 ${counts.join(", ")}명입니다. 가장 많은 곳은 ${winner} ${max}명입니다.`);
      }
      if (kind === 2) {
        const scale = int(rng, 1, 5 + level), totals = [600, 500, 400].map(value => value * scale), maleRates = [50, 60, 25];
        const femaleCounts = totals.map((total, index) => total * (100 - maleRates[index]) / 100);
        const femaleTotal = femaleCounts.reduce((sum, value) => sum + value, 0);
        const femalePercents = femaleCounts.map(value => value * 100 / femaleTotal);
        const winnerTotal = Math.max(...totals), winner = ["가", "나", "다"][totals.indexOf(winnerTotal)];
        const pie = pieGraphSvg({ title: "여학생이 얻은 표", segments: femalePercents.map((percent, index) => ({ label: ["가", "나", "다"][index], percent })) });
        const table = valueTable(["후보", "가", "나", "다"], ["남학생 표 비율", ...maleRates.map(value => `${value}%`)]);
        const givenMale = totals.map((total, index) => total * maleRates[index] / 100);
        return result(`후보 가, 나, 다의 남녀 득표 비율과 여학생 표의 원그래프입니다. 남학생에게 얻은 표가 각각 ${givenMale.join(", ")}표일 때 가장 많은 표를 얻은 후보와 득표 수를 구하세요.${pie}${table}${graphEvidence("combined-election", [...totals, ...maleRates])}`, `${winner}, ${winnerTotal}표`, `후보별 전체 표는 남학생 표를 해당 비율로 나누어 ${totals.join(", ")}표입니다. 가장 많은 후보는 ${winner}, ${winnerTotal}표입니다.`);
      }
      if (kind === 3) {
        const [total, toyPercent, robotPercent] = pick(rng, [[400, 25, 45], [600, 30, 40], [800, 20, 50], [1000, 25, 40]]);
        const toyCount = total * toyPercent / 100, robotCount = toyCount * robotPercent / 100;
        const overall = stripGraphSvg({ title: "받고 싶은 선물", segments: [{ label: "전자기기", percent: 30 }, { label: "게임", percent: 20 }, { label: "장난감", percent: toyPercent }, { label: "기타", percent: 50 - toyPercent }] });
        const toy = pieGraphSvg({ title: "장난감 종류", segments: [{ label: "로봇", percent: robotPercent }, { label: "블록", percent: 25 }, { label: "퍼즐", percent: 15 }, { label: "기타", percent: 60 - robotPercent }] });
        return result(`장난감을 받고 싶은 학생 중 로봇을 고른 학생이 ${robotCount}명입니다. 전체 조사 학생 수를 구하세요.${graphPair(overall, toy)}${graphEvidence("combined-subcategory-total", [total, toyPercent, robotPercent, robotCount])}`, total, `로봇은 장난감 선택자의 ${robotPercent}%이므로 장난감 선택자는 ${toyCount}명입니다. 이는 전체의 ${toyPercent}%이므로 전체는 ${total}명입니다.`);
      }
      if (kind === 4) {
        const scores = [0, 6, 8, 12], percents = pick(rng, [[10, 20, 40, 30], [5, 25, 45, 25], [15, 20, 35, 30], [20, 15, 45, 20]]), total = 100;
        const counts = percents.map(percent => total * percent / 100);
        const answer = decimal(scores.reduce((sum, score, index) => sum + score * counts[index], 0) / total, 2);
        const pie = pieGraphSvg({ title: "시험 점수 분포", segments: scores.map((score, index) => ({ label: `${score}점`, percent: percents[index] })) });
        const table = valueTable(["점수", ...scores.map(value => `${value}점`)], ["학생 수", ...counts]);
        return result(`학생 ${total}명의 시험 결과를 원그래프와 표로 나타냈습니다. 평균 점수를 구하세요.${pie}${table}${graphEvidence("combined-score-average", [total, ...scores, ...counts])}`, answer, `점수×학생 수의 합을 전체 ${total}명으로 나누면 (${scores.map((score, index) => `${score}×${counts[index]}`).join("+")})÷${total}=${answer}점입니다.`);
      }
      const total = 1000, malePercent = pick(rng, [50, 55, 60]), femalePercent = 100 - malePercent;
      const maleTargetPercent = pick(rng, [35, 40, 45, 50]), femaleTargetPercent = pick(rng, [20, 25, 30]);
      const male = total * malePercent / 100, female = total - male;
      const targetTotal = male * maleTargetPercent / 100 + female * femaleTargetPercent / 100;
      const gender = pieGraphSvg({ title: "남녀 학생", segments: [{ label: "남학생", percent: malePercent }, { label: "여학생", percent: femalePercent }] });
      const femaleBrands = stripGraphSvg({ title: "여학생 선호 상표", segments: [{ label: "가", percent: femaleTargetPercent }, { label: "나", percent: 25 }, { label: "다", percent: 20 }, { label: "기타", percent: 55 - femaleTargetPercent }] });
      return result(`전체 학생 중 가 상표를 좋아하는 학생은 ${targetTotal}명입니다. 성별 원그래프와 여학생 선호 띠그래프를 보고, 남학생 중 가 상표를 좋아하는 비율을 구하세요.${graphPair(gender, femaleBrands)}${graphEvidence("combined-missing-male-rate", [total, malePercent, maleTargetPercent, femaleTargetPercent, targetTotal])}`, `${maleTargetPercent}%`, `여학생은 ${female}명이고 그중 가 상표는 ${female * femaleTargetPercent / 100}명입니다. 남학생 가 상표는 ${targetTotal}-${female * femaleTargetPercent / 100}=${male * maleTargetPercent / 100}명이므로 남학생 ${male}명의 ${maleTargetPercent}%입니다.`);
    },
    fractionDivisionUnderstandingAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const denominator = pick(rng, [9, 11, 13].slice(0, 2 + level));
        const whole = int(rng, 1, 4 + level);
        const multiplier = 2 * denominator;
        const divisor = pick(rng, [4, 6, 8].slice(0, 2 + level));
        const candidates = Array.from({ length: denominator - 1 }, (_, index) => index + 1).filter(numerator => ((whole * denominator + numerator) * multiplier) % (denominator * divisor) === 0);
        if (!candidates.length) return generators.fractionDivisionUnderstandingAdvanced({ rng, level, variant });
        const answer = Math.max(...candidates);
        return result(`대분수 ${whole} □/${denominator}에서 □는 ${denominator}보다 작은 자연수입니다. 다음 계산 결과가 자연수가 되도록 하는 □ 중 가장 큰 수를 구하세요.<div class="equation">${whole} □/${denominator} × ${multiplier} ÷ ${divisor}</div>${fractionDivisionEvidence("max-natural-numerator", [whole, denominator, multiplier, divisor])}`, answer, `□에 1부터 ${denominator - 1}까지 넣어 약분 조건을 확인하면 가능한 수는 ${candidates.join(", ")}입니다. 그중 가장 큰 수는 ${answer}입니다.`);
      }
      if (kind === 1) {
        const denominator = 8;
        const boxCount = int(rng, 4, 6 + level);
        const countPerBox = int(rng, 18, 30 + level * 4);
        const itemNumerator = int(rng, 3, 11);
        const boxNumerator = int(rng, 2, 7);
        const totalNumerator = boxCount * (countPerBox * itemNumerator + boxNumerator);
        return result(`같은 물건이 한 상자에 ${countPerBox}개씩 들어 있습니다. 같은 상자 ${boxCount}개의 전체 무게가 ${mixedFraction(totalNumerator, denominator)}kg이고 빈 상자 한 개의 무게가 ${fraction(boxNumerator, denominator)}kg일 때, 물건 한 개의 무게를 구하세요.${fractionDivisionEvidence("box-item-mass", [denominator, boxCount, countPerBox, itemNumerator, boxNumerator, totalNumerator])}`, mixedFraction(itemNumerator, denominator), `전체 무게에서 빈 상자 ${boxCount}개의 무게를 빼고 물건 수 ${boxCount * countPerBox}개로 나누면 ${mixedFraction(itemNumerator, denominator)}kg입니다.`);
      }
      if (kind === 2) {
        const threshold = pick(rng, [10, 12, 15, 18, 20].slice(0, 3 + level));
        let answer = 0;
        for (let n = 1; n < threshold * 2; n += 1) if (n * threshold > (n + 1) * (n + 2)) answer += 1;
        return result(`다음과 같은 규칙으로 계산식을 계속 만들 때, 계산한 값이 1/${threshold}보다 큰 식은 모두 몇 개입니까?<div class="equation">1/2÷3,　2/3÷4,　3/4÷5,　4/5÷6,　…</div>${fractionDivisionEvidence("sequence-over-threshold", [threshold])}`, answer, `n번째 값은 n/(n+1)÷(n+2)=n/{(n+1)(n+2)}입니다. n×${threshold}>(n+1)(n+2)를 만족하는 자연수 n을 세면 ${answer}개입니다.`);
      }
      if (kind === 3) {
        const common = 6 * int(rng, 2, 5 + level);
        const values = [8 * common, 2 * common, 5 * common / 2, 8 * common / 3];
        const labels = ["ㄱ", "ㄴ", "ㄷ", "ㄹ"];
        const order = labels.map((label, index) => ({ label, value: values[index] })).sort((a, b) => b.value - a.value).map(item => item.label).join(", ");
        return result(`ㄱ, ㄴ, ㄷ, ㄹ은 0이 아닌 자연수이고 다음 네 식의 계산값은 모두 같습니다. 네 수를 큰 것부터 차례로 쓰세요.<div class="equation">ㄱ÷2÷4　　ㄴ×1 1/2÷3<br>ㄷ÷5×2　　ㄹ×3/4÷2</div>${fractionDivisionEvidence("equal-expression-order", [common, ...values])}`, order, `공통 계산값을 ${common}으로 두면 ㄱ=${values[0]}, ㄴ=${values[1]}, ㄷ=${values[2]}, ㄹ=${values[3]}입니다. 따라서 ${order} 순서입니다.`);
      }
      if (kind === 4) {
        const denominator = 8;
        const appleCount = int(rng, 7, 11 + level);
        const peachCount = int(rng, 3, 6 + level);
        const removed = int(rng, 2, appleCount - 3);
        const appleNumerator = int(rng, 5, 11);
        const peachNumerator = int(rng, 7, 15);
        const basketNumerator = int(rng, 3, 8);
        const totalNumerator = basketNumerator + appleCount * appleNumerator + peachCount * peachNumerator;
        const remainingNumerator = totalNumerator - removed * appleNumerator;
        return result(`무게가 각각 같은 사과 ${appleCount}개와 복숭아 ${peachCount}개가 든 바구니의 무게는 ${mixedFraction(totalNumerator, denominator)}kg입니다. 사과 ${removed}개를 꺼낸 뒤에는 ${mixedFraction(remainingNumerator, denominator)}kg이었습니다. 빈 바구니가 ${mixedFraction(basketNumerator, denominator)}kg일 때 복숭아 한 개의 무게를 구하세요.${fractionDivisionEvidence("fruit-basket", [denominator, appleCount, peachCount, removed, appleNumerator, peachNumerator, basketNumerator, totalNumerator, remainingNumerator])}`, mixedFraction(peachNumerator, denominator), `꺼낸 사과의 무게 차를 ${removed}로 나누면 사과 한 개는 ${mixedFraction(appleNumerator, denominator)}kg입니다. 남은 전체에서 바구니와 사과 무게를 빼고 ${peachCount}으로 나누면 복숭아 한 개는 ${mixedFraction(peachNumerator, denominator)}kg입니다.`);
      }
      const scale = int(rng, 1, 2 + level);
      const firstDays = 14 * scale, secondDays = 21 * scale, togetherDays = 6 * scale;
      const doneNumerator = 5, doneDenominator = 7;
      return result(`어떤 일을 가와 나가 함께 ${togetherDays}일 동안 하여 전체의 ${doneNumerator}/${doneDenominator}를 마쳤습니다. 남은 일을 가가 혼자 ${4 * scale}일 동안 하여 끝냈습니다. 두 사람의 일하는 양이 날마다 일정할 때, 나가 처음부터 혼자 이 일을 하면 며칠 걸리는지 구하세요.${fractionDivisionEvidence("work-rate", [togetherDays, doneNumerator, doneDenominator, 4 * scale, firstDays, secondDays])}`, secondDays, `가는 하루에 (2/${doneDenominator})÷${4 * scale}=1/${firstDays}을 합니다. 두 사람이 함께 하루에 (${doneNumerator}/${doneDenominator})÷${togetherDays}=5/${42 * scale}을 하므로 나는 하루에 1/${secondDays}을 합니다. 따라서 ${secondDays}일 걸립니다.`);
    },
    fractionDivisionEquationAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const denominator = 12;
        const smallerNumerator = int(rng, 13, 25 + level * 3);
        const differenceNumerator = int(rng, 5, 11 + level);
        const largerNumerator = smallerNumerator + differenceNumerator;
        const totalNumerator = smallerNumerator + largerNumerator;
        return result(`두 사람이 ${mixedFraction(totalNumerator, denominator)}kg의 재료를 나누어 가졌습니다. 더 많이 가진 사람은 다른 사람보다 ${mixedFraction(differenceNumerator, denominator)}kg 더 가졌습니다. 적게 가진 사람의 재료는 몇 kg입니까?${fractionDivisionEvidence("split-total-difference", [denominator, smallerNumerator, largerNumerator, differenceNumerator, totalNumerator])}`, mixedFraction(smallerNumerator, denominator), `전체에서 차를 빼면 적게 가진 양의 2배입니다. (${mixedFraction(totalNumerator, denominator)}-${mixedFraction(differenceNumerator, denominator)})÷2=${mixedFraction(smallerNumerator, denominator)}kg입니다.`);
      }
      if (kind === 1) {
        const denominator = pick(rng, [10, 12, 15]);
        const firstNumerator = int(rng, 2, Math.floor(denominator / 2));
        const secondNumerator = int(rng, 2, Math.floor(denominator / 2));
        const count = int(rng, 120, 260 + level * 40);
        const secondTotalNumerator = secondNumerator * count;
        return result(`가 제품 한 개와 나 제품 한 개를 만드는 데 쓰는 우유의 합은 ${fraction(firstNumerator + secondNumerator, denominator)}L입니다. 나 제품 ${count}개를 만드는 데 ${mixedFraction(secondTotalNumerator, denominator)}L를 썼습니다. 가 제품 한 개에 쓰는 우유는 몇 L입니까?${fractionDivisionEvidence("unit-material", [denominator, firstNumerator, secondNumerator, count, secondTotalNumerator])}`, fraction(firstNumerator, denominator), `나 제품 한 개에는 ${mixedFraction(secondTotalNumerator, denominator)}÷${count}=${fraction(secondNumerator, denominator)}L가 듭니다. 두 제품 한 개씩의 합에서 이를 빼면 가 제품 한 개는 ${fraction(firstNumerator, denominator)}L입니다.`);
      }
      if (kind === 2) {
        const leftBase = int(rng, 4, 8 + level);
        const leftHeight = int(rng, 5, 11 + level * 2);
        const divisor = int(rng, 2, 5 + level);
        const rightBase = leftBase * divisor;
        const rightHeightNumerator = leftBase * leftHeight;
        return result(`그림의 색칠한 두 직각삼각형의 넓이가 같습니다. 오른쪽 삼각형의 높이 □를 구하세요.${equalTriangleSvg({ leftBase, leftHeight, rightBase })}${fractionDivisionEvidence("equal-triangle-area", [leftBase, leftHeight, rightBase])}`, fraction(rightHeightNumerator, rightBase), `삼각형 넓이의 1/2은 양쪽에 공통이므로 밑변×높이가 같습니다. □=${leftBase}×${leftHeight}÷${rightBase}=${fraction(rightHeightNumerator, rightBase)}cm입니다.`);
      }
      if (kind === 3) {
        const denominator = pick(rng, [17, 19, 23, 29].slice(0, 2 + level));
        const values = [3, 1, 6];
        return result(`세 기약분수 가, 나, 다가 있습니다. 가는 나의 3배이고 다는 가의 2배입니다. 세 분수의 합이 ${fraction(10, denominator)}일 때 가, 나, 다를 차례로 구하세요.${fractionDivisionEvidence("three-fraction-ratio", [denominator, ...values])}`, `${fraction(3, denominator)}, ${fraction(1, denominator)}, ${fraction(6, denominator)}`, `나를 1몫으로 보면 가는 3몫, 다는 6몫으로 모두 10몫입니다. 한 몫은 1/${denominator}이므로 가=${fraction(3, denominator)}, 나=${fraction(1, denominator)}, 다=${fraction(6, denominator)}입니다.`);
      }
      if (kind === 4) {
        const denominator = 8;
        const secondNumerator = int(rng, 13, 25 + level * 3);
        const differenceNumerator = int(rng, 3, Math.min(11, secondNumerator - 2));
        const firstNumerator = 2 * secondNumerator - differenceNumerator;
        const totalNumerator = firstNumerator + secondNumerator;
        return result(`길이가 ${mixedFraction(totalNumerator, denominator)}m인 테이프를 선우와 지민이가 나누어 가졌습니다. 선우의 테이프는 지민이 테이프 길이의 2배보다 ${mixedFraction(differenceNumerator, denominator)}m 짧습니다. 선우가 가진 테이프의 길이를 구하세요.${fractionDivisionEvidence("tape-relation", [denominator, firstNumerator, secondNumerator, differenceNumerator, totalNumerator])}`, mixedFraction(firstNumerator, denominator), `지민이의 길이를 1몫이라 하면 전체는 3몫에서 ${mixedFraction(differenceNumerator, denominator)}m를 뺀 것입니다. 따라서 지민이는 (${mixedFraction(totalNumerator, denominator)}+${mixedFraction(differenceNumerator, denominator)})÷3=${mixedFraction(secondNumerator, denominator)}m이고 선우는 ${mixedFraction(firstNumerator, denominator)}m입니다.`);
      }
      const firstRate = pick(rng, [4, 6, 8]);
      const secondRate = firstRate + pick(rng, [2, 4]);
      const firstStageSeconds = pick(rng, [150, 210, 270, 330]);
      const secondStageSeconds = pick(rng, [600, 720, 840, 960].slice(0, 2 + level));
      const totalSeconds = firstStageSeconds + secondStageSeconds;
      const capacity = firstRate * firstStageSeconds + secondRate * secondStageSeconds;
      if (capacity % firstRate !== 0) return generators.fractionDivisionEquationAdvanced({ rng, level, variant });
      const firstOnlySeconds = capacity / firstRate;
      const timeText = seconds => `${Math.floor(seconds / 60)}분${seconds % 60 ? ` ${seconds % 60}초` : ""}`;
      return result(`물통에 처음에는 1초에 ${firstRate}dL씩 물을 넣었습니다. 이 속도로만 넣으면 ${timeText(firstOnlySeconds)} 만에 가득 찹니다. 도중부터 1초에 ${secondRate}dL씩 넣었더니 모두 ${timeText(totalSeconds)} 만에 가득 찼습니다. 처음 속도로 물을 넣은 시간은 몇 분 몇 초입니까?${fractionDivisionEvidence("changed-fill-rate", [firstRate, secondRate, firstOnlySeconds, totalSeconds])}`, timeText(firstStageSeconds), `처음 속도로 넣은 시간을 x초라 하면 ${firstRate}x+${secondRate}(${totalSeconds}-x)=${firstRate * firstOnlySeconds}입니다. 풀면 x=${firstStageSeconds}초, 즉 ${timeText(firstStageSeconds)}입니다.`);
    },
    secondFractionDivisionUnderstanding({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const denominator = pick(rng, [8, 10, 12]), whole = int(rng, 2, 4 + level), hidden = int(rng, 1, denominator - 1);
        const multiplier = pick(rng, [2, 3, 4]), divisorNumerator = pick(rng, [3, 5, 7]);
        const targetNumerator = (whole * denominator - hidden) * multiplier;
        return result(`□는 ${denominator}보다 작은 자연수입니다. 다음 식을 만족하는 □를 구하세요.<div class="equation">${multiplier} × (${whole} - □/${denominator}) ÷ ${divisorNumerator}/${denominator} = ${mixedFraction(targetNumerator, divisorNumerator)}</div>${fractionDivisionEvidence("62-inverse-blank", [denominator, whole, multiplier, divisorNumerator, targetNumerator])}`, hidden, `오른쪽 값에 ${divisorNumerator}/${denominator}를 곱하고 ${multiplier}로 나누면 ${whole}-${hidden}/${denominator}입니다. 따라서 □=${hidden}입니다.`);
      }
      if (kind === 1) {
        const [a, b, c, d, e, f, g, h] = pick(rng, [[3, 4, 2, 5, 5, 6, 4, 9], [5, 8, 3, 7, 7, 10, 2, 3], [4, 9, 5, 12, 3, 5, 7, 15], [7, 12, 5, 18, 8, 15, 4, 7]]);
        const left = rationalValue(a * d, b * c), right = rationalValue(e * h, f * g);
        const answerValue = rationalOperation(left, right, "+"), answer = mixedFraction(answerValue.numerator, answerValue.denominator);
        return result(`분수 a, b에 대하여 a ★ b=a÷b, a ● b=a+b로 약속했습니다. 다음 값을 구하세요.<div class="equation">(${a}/${b} ★ ${c}/${d}) ● (${e}/${f} ★ ${g}/${h})</div>${fractionDivisionEvidence("62-defined-operations", [a, b, c, d, e, f, g, h])}`, answer, `★를 먼저 계산하면 ${mixedFraction(left.numerator, left.denominator)}와 ${mixedFraction(right.numerator, right.denominator)}입니다. 두 값을 ●로 더하면 ${answer}입니다.`);
      }
      if (kind === 2) {
        const n = int(rng, 2, 5 + level);
        const first = rationalValue(n * (n + 3), (n + 1) * (n + 2));
        const later = rationalValue((n + 2) * (n + 5), (n + 3) * (n + 4));
        const difference = rationalOperation(later, first, "-");
        return result(`n번째 수를 n/(n+1)÷(n+2)/(n+3)으로 정했습니다. ${n + 2}번째 수와 ${n}번째 수의 차를 구하세요.<div class="equation">1/2÷3/4,　2/3÷4/5,　3/4÷5/6,　…</div>${fractionDivisionEvidence("62-sequence-difference", [n])}`, fraction(difference.numerator, difference.denominator), `${n}번째 수는 ${fraction(first.numerator, first.denominator)}, ${n + 2}번째 수는 ${fraction(later.numerator, later.denominator)}이므로 차는 ${fraction(difference.numerator, difference.denominator)}입니다.`);
      }
      if (kind === 3) {
        const [a, b, c, d, e, f, g, h] = pick(rng, [[3, 4, 2, 5, 5, 6, 10, 9], [5, 7, 3, 8, 4, 9, 2, 3], [7, 10, 5, 12, 3, 8, 9, 16], [4, 11, 2, 7, 5, 12, 3, 10]]);
        const square = rationalValue(a * d, b * c), triangle = rationalValue(e * h, f * g);
        const quotient = rationalOperation(square, triangle, "÷"), answer = mixedFraction(quotient.numerator, quotient.denominator);
        return result(`다음 두 나눗셈의 결과를 각각 ■, ▲로 나타낼 때 ■÷▲를 구하세요.<div class="equation">${a}/${b} ÷ ${c}/${d} = ■<br>${e}/${f} ÷ ${g}/${h} = ▲</div>${fractionDivisionEvidence("62-symbolic-quotient", [a, b, c, d, e, f, g, h])}`, answer, `■=${mixedFraction(square.numerator, square.denominator)}, ▲=${mixedFraction(triangle.numerator, triangle.denominator)}입니다. 따라서 ■÷▲=${answer}입니다.`);
      }
      if (kind === 4) {
        const [whole, denominator, lower, upper, candidateDenominator] = pick(rng, [[10, 5, 1, 4, 12], [8, 7, 2, 6, 15], [12, 8, 1, 7, 18], [6, 9, 2, 8, 20]]);
        const candidates = Array.from({ length: candidateDenominator - 1 }, (_, index) => index + 1).filter(value => value * denominator > lower * candidateDenominator && value * denominator < upper * candidateDenominator);
        const answer = candidates.reduce((sum, value) => sum + value, 0);
        return result(`□는 ${candidateDenominator}보다 작은 자연수입니다. ${whole} ${lower}/${denominator}보다 크고 ${whole} ${upper}/${denominator}보다 작은 ${whole} □/${candidateDenominator}을 만들 수 있는 모든 □의 합을 구하세요.${fractionDivisionEvidence("62-between-mixed", [denominator, lower, upper, candidateDenominator])}`, answer, `${lower}/${denominator}<□/${candidateDenominator}<${upper}/${denominator}을 만족하는 □는 ${candidates.join(", ")}이므로 합은 ${answer}입니다.`);
      }
      const first = pick(rng, [9, 18, 27, 36]), second = first * 4 / 3, third = second * 5 / 6;
      const firstValue = rationalValue(first * 3, 2), secondValue = rationalValue(second * 3, 4), thirdValue = rationalValue(third * 6, 5);
      const answer = first * second * third;
      return result(`ㄱ, ㄴ, ㄷ은 자연수이고 다음 식을 모두 만족합니다. ㄱ×ㄴ×ㄷ을 구하세요.<div class="equation">ㄱ ÷ 2/3 = ${mixedFraction(firstValue.numerator, firstValue.denominator)}<br>ㄴ × 3/4 = ${mixedFraction(secondValue.numerator, secondValue.denominator)}<br>ㄷ ÷ 5/6 = ${mixedFraction(thirdValue.numerator, thirdValue.denominator)}</div>${fractionDivisionEvidence("62-linked-symbols", [firstValue.numerator, firstValue.denominator, secondValue.numerator, secondValue.denominator, thirdValue.numerator, thirdValue.denominator])}`, answer, `첫째 식부터 차례로 풀면 ㄱ=${first}, ㄴ=${second}, ㄷ=${third}입니다. 곱은 ${answer}입니다.`);
    },
    secondFractionDivisionApplication({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const [area, firstN, firstD, secondN, secondD] = pick(rng, [[180, 2, 3, 3, 5], [240, 3, 4, 3, 5], [360, 5, 6, 3, 4], [210, 4, 7, 2, 3]]);
        const answer = area * firstN * secondN / (firstD * secondD);
        return result(`넓이가 ${area}cm²인 직사각형 안의 삼각형 넓이는 직사각형의 ${firstN}/${firstD}이고, 색칠한 부분은 그 삼각형의 ${secondN}/${secondD}입니다. 색칠한 부분의 넓이를 구하세요.<div class="equation">전체 → ${firstN}/${firstD} → ${secondN}/${secondD}</div>${fractionDivisionEvidence("62-area-chain", [area, firstN, firstD, secondN, secondD])}`, answer, `${area}×${firstN}/${firstD}×${secondN}/${secondD}=${answer}이므로 색칠한 넓이는 ${answer}cm²입니다.`);
      }
      if (kind === 1) {
        const [capacity, firstN, firstD, added, removed, finalN, finalD] = pick(rng, [[60, 1, 3, 35, 10, 3, 4], [72, 5, 12, 30, 12, 2, 3], [84, 3, 7, 30, 24, 1, 2], [96, 3, 8, 40, 16, 5, 8]]);
        return result(`빈 물통에 전체 들이의 ${firstN}/${firstD}만큼 물을 넣고 ${added}L를 더 넣은 뒤 ${removed}L를 덜어 냈더니 전체의 ${finalN}/${finalD}가 되었습니다. 물통의 들이는 몇 L입니까?${fractionDivisionEvidence("62-tank-backsolve", [firstN, firstD, added, removed, finalN, finalD])}`, capacity, `전체 들이를 xL라 하면 ${firstN}/${firstD}x+${added}-${removed}=${finalN}/${finalD}x입니다. 풀면 x=${capacity}L입니다.`);
      }
      if (kind === 2) {
        const start = pick(rng, [480, 500, 520, 540]), work = pick(rng, [45, 50, 60, 75]), rest = pick(rng, [10, 15, 20]), cycles = int(rng, 3, 4 + level);
        const finish = start + work * cycles + rest * (cycles - 1);
        const clock = minutes => `${Math.floor(minutes / 60)}시 ${String(minutes % 60).padStart(2, "0")}분`;
        return result(`${clock(start)}부터 같은 작업을 ${cycles}번 합니다. 한 번 작업하는 데 ${mixedFraction(work, 60)}시간, 작업 사이에 쉴 때마다 ${mixedFraction(rest, 60)}시간이 걸립니다. 모두 끝나는 시각을 구하세요.${fractionDivisionEvidence("62-work-rest-clock", [start, work, rest, cycles])}`, clock(finish), `작업 시간은 ${work}×${cycles}=${work * cycles}분, 휴식은 ${rest}×${cycles - 1}=${rest * (cycles - 1)}분입니다. 모두 ${finish - start}분 뒤인 ${clock(finish)}에 끝납니다.`);
      }
      if (kind === 3) {
        const machines = int(rng, 4, 6 + level), denominator = machines * 6, firstHours = 3, broken = int(rng, 1, Math.min(2, machines - 2));
        const remainingN = denominator - machines * firstHours;
        const remainingD = denominator;
        const secondTime = rationalValue(remainingN, machines - broken);
        const totalTime = rationalOperation(rationalValue(firstHours), secondTime, "+");
        const answer = mixedFraction(totalTime.numerator, totalTime.denominator);
        return result(`같은 기계 ${machines}대가 각각 1시간에 전체 일의 1/${denominator}씩 처리합니다. ${firstHours}시간 함께 일한 뒤 ${broken}대가 고장 나고 나머지 기계만 일했습니다. 일을 끝내는 데 걸린 전체 시간을 구하세요.${fractionDivisionEvidence("62-decreasing-machines", [machines, denominator, firstHours, broken])}`, answer, `처음 처리한 양은 ${machines}×${firstHours}/${denominator}=1/2입니다. 남은 1/2을 ${machines - broken}대가 처리하는 시간까지 더하면 ${answer}시간입니다.`);
      }
      if (kind === 4) {
        const [premiumPart, regularPart, unit] = pick(rng, [[3, 5, 18], [2, 3, 24], [5, 7, 16], [4, 9, 14]]);
        const premium = premiumPart * unit, regular = regularPart * unit, total = premium + regular;
        return result(`공연장 좌석은 일반석과 특별석으로만 이루어져 있습니다. 특별석 수는 일반석 수의 ${premiumPart}/${regularPart}이고 전체는 ${total}석입니다. 특별석과 일반석 수를 차례로 구하세요.${fractionDivisionEvidence("62-seat-ratio", [premiumPart, regularPart, total])}`, `${premium}석, ${regular}석`, `전체를 ${premiumPart + regularPart}몫으로 나누면 한 몫은 ${unit}석입니다. 특별석은 ${premium}석, 일반석은 ${regular}석입니다.`);
      }
      const [side, usedN, usedD, beds, bedSide] = pick(rng, [[12, 3, 4, 4, 3], [16, 3, 4, 4, 4], [20, 1, 2, 8, 5], [18, 5, 9, 4, 6], [28, 1, 2, 8, 7]]);
      return result(`한 변이 ${side}m인 정사각형 땅의 ${usedN}/${usedD}를 건물 부지로 쓰고, 남은 땅을 넓이가 같은 정사각형 화단 ${beds}개로 나누었습니다. 화단 한 개의 한 변은 몇 m입니까?${fractionDivisionEvidence("62-square-beds", [side, usedN, usedD, beds])}`, bedSide, `남은 넓이는 ${side ** 2}×(1-${usedN}/${usedD})=${beds * bedSide ** 2}m²입니다. 한 화단은 ${bedSide ** 2}m²이므로 한 변은 ${bedSide}m입니다.`);
    },
    secondFractionDivisionChallenge({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const a = int(rng, 2, 5 + level), b = int(rng, 2, 6), c = int(rng, 2, 8);
        const inner = rationalValue(b * c + 1, c), reciprocal = rationalValue(inner.denominator, inner.numerator);
        const value = rationalOperation(rationalValue(a), reciprocal, "+");
        return result(`다음 연분수의 값을 구하세요.<div class="equation">${a} + 1/(${b} + 1/${c})</div>${fractionDivisionEvidence("62-continued-fraction", [a, b, c])}`, mixedFraction(value.numerator, value.denominator), `${b}+1/${c}=${mixedFraction(inner.numerator, inner.denominator)}이므로 그 역수는 ${fraction(reciprocal.numerator, reciprocal.denominator)}입니다. 따라서 전체는 ${mixedFraction(value.numerator, value.denominator)}입니다.`);
      }
      if (kind === 1) {
        const base = int(rng, 1, 4), denominator = pick(rng, [11, 13, 17, 19]), count = int(rng, 4, 6 + level);
        const numerator = base * denominator + count ** 2 - 2;
        return result(`다음 식을 계산하세요.<div class="equation">${base} - 1/${denominator} + 3/${denominator} + 5/${denominator} + … + ${2 * count - 1}/${denominator}</div>${fractionDivisionEvidence("62-odd-fraction-sum", [base, denominator, count])}`, mixedFraction(numerator, denominator), `1+3+…+${2 * count - 1}=${count ** 2}이므로 분수 부분은 (${count ** 2}-2)/${denominator}입니다. 전체는 ${mixedFraction(numerator, denominator)}입니다.`);
      }
      if (kind === 2) {
        const digits = pick(rng, [[1, 2, 3, 4], [1, 3, 4, 6], [2, 3, 5, 7], [1, 4, 5, 8]]);
        const cases = [];
        for (const whole of digits) for (const numerator of digits) for (const denominator of digits) for (const divisor of digits) {
          if (new Set([whole, numerator, denominator, divisor]).size !== 4 || numerator >= denominator) continue;
          cases.push({ whole, numerator, denominator, divisor, value: rationalValue(whole * denominator + numerator, denominator * divisor) });
        }
        cases.sort((left, right) => left.value.numerator * right.value.denominator - right.value.numerator * left.value.denominator);
        const smallest = cases[0], largest = cases[cases.length - 1], difference = rationalOperation(largest.value, smallest.value, "-");
        return result(`수 카드 ${digits.join(", ")}을 한 번씩 모두 사용해 (대분수)÷(자연수)를 만듭니다. 분수 부분은 진분수일 때 계산값의 최댓값과 최솟값의 차를 구하세요.${fractionDivisionEvidence("62-card-extremes", digits)}`, mixedFraction(difference.numerator, difference.denominator), `최솟값은 ${smallest.whole} ${smallest.numerator}/${smallest.denominator}÷${smallest.divisor}=${mixedFraction(smallest.value.numerator, smallest.value.denominator)}, 최댓값은 ${largest.whole} ${largest.numerator}/${largest.denominator}÷${largest.divisor}=${mixedFraction(largest.value.numerator, largest.value.denominator)}입니다. 차는 ${mixedFraction(difference.numerator, difference.denominator)}입니다.`);
      }
      if (kind === 3) {
        const [a, b, c, d] = pick(rng, [[6, 5, 10, 7], [8, 3, 12, 5], [9, 4, 15, 8], [10, 7, 14, 9]]);
        const answer = lcm(a, c);
        return result(`자연수 □를 ${a}/${b}와 ${c}/${d}로 각각 나누었을 때 두 몫이 모두 자연수가 되게 하려고 합니다. 가장 작은 □를 구하세요.${fractionDivisionEvidence("62-natural-divisions", [a, b, c, d])}`, answer, `기약분수로 나누어 자연수가 되려면 □는 각 분자의 배수여야 합니다. ${a}와 ${c}의 최소공배수는 ${answer}입니다.`);
      }
      if (kind === 4) {
        const first = int(rng, 3, 7 + level), second = int(rng, 4, 9 + level), third = int(rng, 5, 11 + level);
        const left = rationalValue(first * 5, 12), middle = rationalValue(second * 2, 3 * first), right = rationalValue(third * 6, 5 * second);
        const answer = first + second + third;
        return result(`ㄱ, ㄴ, ㄷ은 자연수이고 다음 식을 만족합니다. ㄱ+ㄴ+ㄷ을 구하세요.<div class="equation">ㄱ/4 ÷ 3/5 = ${fraction(left.numerator, left.denominator)}<br>ㄴ/3 ÷ ㄱ/2 = ${fraction(middle.numerator, middle.denominator)}<br>ㄷ/5 ÷ ㄴ/6 = ${fraction(right.numerator, right.denominator)}</div>${fractionDivisionEvidence("62-symbol-system", [left.numerator, left.denominator, middle.numerator, middle.denominator, right.numerator, right.denominator])}`, answer, `첫째 식에서 ㄱ=${first}, 둘째 식에서 ㄴ=${second}, 셋째 식에서 ㄷ=${third}입니다. 합은 ${answer}입니다.`);
      }
      const [numerator, denominator, total, scale, limit] = pick(rng, [[3, 4, 6, 5, 20], [4, 5, 8, 5, 20], [5, 6, 10, 3, 20], [6, 7, 12, 5, 30]]);
      const candidates = Array.from({ length: limit - 1 }, (_, index) => index + 2).filter(value => value % numerator === 0 && total * scale % value === 0);
      const answer = candidates.reduce((sum, value) => sum + value, 0);
      return result(`2 이상 ${limit} 이하의 자연수 □에 대하여 □÷${numerator}/${denominator}와 ${total}÷(□/${scale})의 몫이 모두 자연수가 되게 하려고 합니다. 가능한 모든 □의 합을 구하세요.${fractionDivisionEvidence("62-two-natural-conditions", [numerator, denominator, total, scale, limit])}`, answer, `□는 ${numerator}의 배수이면서 ${total * scale}의 약수여야 합니다. 가능한 수 ${candidates.join(", ")}의 합은 ${answer}입니다.`);
    },
    secondFractionDivisionUnitRate({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const [top, bottom, height, coats, coverN, coverD] = pick(rng, [[6, 10, 5, 2, 1, 4], [8, 14, 6, 3, 1, 6], [9, 15, 8, 2, 1, 5], [12, 18, 7, 3, 1, 7]]);
        const area = (top + bottom) * height / 2, amount = rationalValue(area * coats * coverN, coverD);
        return result(`사다리꼴 모양 벽을 전체에 ${coats}번 칠합니다. 페인트는 1m²를 칠할 때 ${coverN}/${coverD}L가 필요합니다. 필요한 페인트의 양을 구하세요.${fractionTrapezoidSvg({ top, bottom, height })}${fractionDivisionEvidence("62-paint-unit-rate", [top, bottom, height, coats, coverN, coverD])}`, `${mixedFraction(amount.numerator, amount.denominator)}L`, `벽 넓이는 (${top}+${bottom})×${height}÷2=${area}m²입니다. ${coats}번 칠할 양은 ${area}×${coats}×${coverN}/${coverD}=${mixedFraction(amount.numerator, amount.denominator)}L입니다.`);
      }
      if (kind === 1) {
        const [speedA, timeAN, timeAD, speedB, timeBN, timeBD] = pick(rng, [[12, 3, 4, 18, 5, 6], [15, 4, 5, 20, 3, 4], [16, 2, 3, 24, 5, 6], [18, 2, 3, 21, 3, 4]]);
        const distanceA = rationalValue(speedA * timeAN, timeAD), distanceB = rationalValue(speedB * timeBN, timeBD), totalMinutes = timeAN * 60 / timeAD + timeBN * 60 / timeBD;
        return result(`첫 구간 ${mixedFraction(distanceA.numerator, distanceA.denominator)}km는 시속 ${speedA}km로, 다음 구간 ${mixedFraction(distanceB.numerator, distanceB.denominator)}km는 시속 ${speedB}km로 이동했습니다. 전체 이동 시간을 구하세요.${fractionDivisionEvidence("62-two-speed-time", [distanceA.numerator, distanceA.denominator, speedA, distanceB.numerator, distanceB.denominator, speedB])}`, `${totalMinutes}분`, `각 구간의 시간은 거리÷속력이므로 ${mixedFraction(timeAN, timeAD)}시간과 ${mixedFraction(timeBN, timeBD)}시간입니다. 합은 ${totalMinutes}분입니다.`);
      }
      if (kind === 2) {
        const [rateN, rateD, totalHours, observed] = pick(rng, [[5, 4, 16, 3], [7, 6, 18, 5], [9, 8, 20, 4], [11, 10, 24, 6]]);
        const length = rationalValue(rateN * totalHours, rateD), remaining = rationalValue(rateN * (totalHours - observed), rateD);
        return result(`길이가 ${mixedFraction(length.numerator, length.denominator)}cm인 양초가 1시간에 ${fraction(rateN, rateD)}cm씩 일정하게 줄어듭니다. 불을 붙인 지 ${observed}시간 뒤 남은 길이가 ${mixedFraction(remaining.numerator, remaining.denominator)}cm일 때, 처음부터 모두 타는 데 걸리는 시간을 구하세요.${fractionDivisionEvidence("62-candle-unit-rate", [length.numerator, length.denominator, rateN, rateD])}`, `${totalHours}시간`, `전체 길이를 한 시간에 줄어드는 길이로 나누면 ${mixedFraction(length.numerator, length.denominator)}÷${fraction(rateN, rateD)}=${totalHours}시간입니다.`);
      }
      if (kind === 3) {
        const [distance, timeA, timeB, timeC] = pick(rng, [[30, 180, 150, 210], [24, 160, 120, 200], [36, 180, 240, 144], [28, 210, 168, 240]]);
        const arrival = 8 * 60 + timeA, startB = arrival - timeB, startC = arrival - timeC;
        const speedText = minutes => mixedFraction(distance * 60, minutes);
        const clock = minutes => `${Math.floor(minutes / 60)}시 ${String(minutes % 60).padStart(2, "0")}분`;
        return result(`같은 정상까지 거리는 ${distance}km입니다. 가는 ${clock(8 * 60)}에 출발해 시속 ${speedText(timeA)}km로 걷고, 나는 시속 ${speedText(timeB)}km, 다는 시속 ${speedText(timeC)}km로 걸어 세 사람이 동시에 도착했습니다. 나와 다의 출발 시각을 차례로 구하세요.${fractionDivisionEvidence("62-same-arrival", [distance, timeA, timeB, timeC, 480])}`, `${clock(startB)}, ${clock(startC)}`, `가의 도착 시각은 ${clock(arrival)}입니다. 나는 ${timeB}분, 다는 ${timeC}분이 걸리므로 출발 시각은 각각 ${clock(startB)}, ${clock(startC)}입니다.`);
      }
      if (kind === 4) {
        const [firstDays, secondDays, togetherDays] = pick(rng, [[12, 18, 4], [15, 20, 5], [18, 24, 6], [20, 30, 8]]);
        const remaining = rationalValue(firstDays * secondDays - togetherDays * (firstDays + secondDays), firstDays * secondDays);
        const alone = rationalValue(remaining.numerator * firstDays, remaining.denominator), total = rationalOperation(rationalValue(togetherDays), alone, "+");
        return result(`어떤 일을 가 혼자 하면 ${firstDays}일, 나 혼자 하면 ${secondDays}일 걸립니다. 두 사람이 ${togetherDays}일 함께 일한 뒤 나가 그만두고 가가 혼자 마쳤습니다. 일을 끝내는 데 모두 며칠 걸렸습니까?${fractionDivisionEvidence("62-split-work", [firstDays, secondDays, togetherDays])}`, `${mixedFraction(total.numerator, total.denominator)}일`, `함께 한 양을 빼고 남은 일을 가의 하루 일률 1/${firstDays}로 나누면 혼자 일한 기간은 ${mixedFraction(alone.numerator, alone.denominator)}일입니다. 전체는 ${mixedFraction(total.numerator, total.denominator)}일입니다.`);
      }
      const [rateA, rateB, drain, delayB, delayDrain, totalTime] = pick(rng, [[8, 6, 2, 3, 5, 12], [10, 7, 3, 2, 6, 14], [12, 8, 4, 4, 7, 15], [9, 6, 3, 3, 8, 16]]);
      const capacity = rateA * totalTime + rateB * (totalTime - delayB) - drain * (totalTime - delayDrain);
      return result(`빈 물통에 가 수도관은 1분에 ${rateA}L씩 처음부터 물을 넣었습니다. 나 수도관은 ${delayB}분 뒤부터 1분에 ${rateB}L씩 넣고, 배수관은 ${delayDrain}분 뒤부터 1분에 ${drain}L씩 뺐습니다. 처음부터 ${totalTime}분 뒤 가득 찼을 때 물통의 들이를 구하세요.${fractionDivisionEvidence("62-staggered-pipes", [rateA, rateB, drain, delayB, delayDrain, totalTime])}`, `${capacity}L`, `가는 ${rateA * totalTime}L, 나는 ${rateB * (totalTime - delayB)}L를 넣고 배수관은 ${drain * (totalTime - delayDrain)}L를 뺍니다. 들이는 ${capacity}L입니다.`);
    },
    secondFractionDivisionEquation({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const scale = int(rng, 1, 3 + level), triangleSide = 19 * scale, squareSide = 13 * scale, total = 12 * squareSide + 6 * triangleSide;
        return result(`같은 정사각형 3개와 같은 정삼각형 2개를 철사로 각각 만들었습니다. 정사각형 한 변은 정삼각형 한 변의 13/19이고 사용한 철사는 모두 ${total}cm입니다. 정삼각형 한 변의 길이를 구하세요.${fractionDivisionEvidence("62-wire-shapes", [13, 19, 3, 2, total])}`, `${triangleSide}cm`, `정삼각형 한 변을 xcm라 하면 정사각형 한 변은 13/19x입니다. 12×13/19x+6x=${total}을 풀면 x=${triangleSide}cm입니다.`);
      }
      if (kind === 1) {
        const [korean, mathN, mathD, scienceN, scienceD] = pick(rng, [[48, 3, 2, 5, 6], [56, 3, 2, 6, 7], [60, 7, 5, 5, 7], [64, 5, 4, 9, 10]]);
        const math = korean * mathN / mathD, science = math * scienceN / scienceD, total = korean + math + science;
        return result(`국어 점수는 ${korean}점, 수학 점수는 국어의 ${mathN}/${mathD}, 과학 점수는 수학의 ${scienceN}/${scienceD}입니다. 세 과목의 총점을 구하세요.${fractionDivisionEvidence("62-related-scores", [korean, mathN, mathD, scienceN, scienceD])}`, `${total}점`, `수학은 ${math}점, 과학은 ${science}점이므로 총점은 ${korean}+${math}+${science}=${total}점입니다.`);
      }
      if (kind === 2) {
        const [total, firstN, firstD, secondN, secondD] = pick(rng, [[240, 3, 8, 2, 5], [300, 2, 5, 1, 3], [360, 5, 12, 3, 7], [420, 3, 7, 2, 5]]);
        const first = total * firstN / firstD, remainder = total - first, second = remainder * secondN / secondD, last = total - first - second;
        return result(`밭 전체의 ${firstN}/${firstD}에는 감자를 심고, 남은 밭의 ${secondN}/${secondD}에는 고구마를 심었습니다. 나머지 ${last}m²에는 채소를 심었습니다. 밭 전체의 넓이를 구하세요.${fractionDivisionEvidence("62-field-backsolve", [firstN, firstD, secondN, secondD, last])}`, `${total}m²`, `채소밭은 전체의 (1-${firstN}/${firstD})×(1-${secondN}/${secondD})입니다. 이 양이 ${last}m²이므로 전체는 ${total}m²입니다.`);
      }
      if (kind === 3) {
        const [length, ratioN, ratioD, addLength, addWidth] = pick(rng, [[20, 3, 5, 4, 3], [24, 2, 3, 3, 4], [28, 5, 7, 5, 2], [30, 4, 5, 6, 3]]);
        const width = length * ratioN / ratioD, difference = (length + addLength) * (width + addWidth) - length * width, area = length * width;
        return result(`직사각형의 가로는 세로의 ${ratioN}/${ratioD}입니다. 세로를 ${addLength}cm, 가로를 ${addWidth}cm 늘렸더니 넓이가 ${difference}cm² 늘었습니다. 원래 직사각형의 넓이를 구하세요.${fractionDivisionEvidence("62-rectangle-change", [ratioN, ratioD, addLength, addWidth, difference])}`, `${area}cm²`, `세로를 x라 하면 가로는 ${ratioN}/${ratioD}x입니다. (x+${addLength})(${ratioN}/${ratioD}x+${addWidth})-${ratioN}/${ratioD}x²=${difference}에서 x=${length}입니다. 원래 넓이는 ${area}cm²입니다.`);
      }
      if (kind === 4) {
        const [distance, flatN, flatD, upN, upD, speedFlat, speedUp, speedDown] = pick(rng, [[60, 1, 2, 1, 5, 30, 12, 24], [72, 5, 12, 1, 4, 36, 18, 30], [84, 3, 7, 2, 7, 42, 21, 28], [90, 2, 5, 1, 3, 45, 18, 30]]);
        const downN = flatD * upD - flatN * upD - upN * flatD, downD = flatD * upD;
        const time = rationalOperation(rationalOperation(rationalValue(distance * flatN, flatD * speedFlat), rationalValue(distance * upN, upD * speedUp), "+"), rationalValue(distance * downN, downD * speedDown), "+");
        return result(`전체 ${distance}km인 길에서 평지는 전체의 ${flatN}/${flatD}, 오르막은 전체의 ${upN}/${upD}, 나머지는 내리막입니다. 평지·오르막·내리막에서의 속력이 각각 시속 ${speedFlat}km, ${speedUp}km, ${speedDown}km일 때 전체 걸린 시간을 구하세요.${fractionDivisionEvidence("62-three-part-route", [distance, flatN, flatD, upN, upD, speedFlat, speedUp, speedDown])}`, `${mixedFraction(time.numerator, time.denominator)}시간`, `각 구간의 거리÷속력을 더하면 ${mixedFraction(time.numerator, time.denominator)}시간입니다.`);
      }
      const [height, firstN, firstD, secondN, secondD] = pick(rng, [[30, 2, 5, 3, 4], [36, 1, 3, 5, 6], [42, 3, 7, 5, 7], [48, 3, 8, 7, 8]]);
      const rise = rationalValue(height * (secondN * firstD - firstN * secondD), secondD * firstD);
      return result(`직육면체 물통의 물높이가 처음에는 전체 높이의 ${firstN}/${firstD}였습니다. 물을 더 넣었더니 전체 높이의 ${secondN}/${secondD}가 되었고 물높이는 ${mixedFraction(rise.numerator, rise.denominator)}cm 올랐습니다. 물통의 전체 높이를 구하세요.${fractionDivisionEvidence("62-tank-height", [firstN, firstD, secondN, secondD, rise.numerator, rise.denominator])}`, `${height}cm`, `전체 높이를 x라 하면 (${secondN}/${secondD}-${firstN}/${firstD})x=${mixedFraction(rise.numerator, rise.denominator)}입니다. 따라서 x=${height}cm입니다.`);
    },
    secondFractionDecimalMixed({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const [decimalA, fractionN, fractionD, divisorN, divisorD, decimalB] = pick(rng, [[75, 3, 4, 3, 5, 25], [125, 5, 8, 3, 4, 40], [84, 7, 10, 2, 5, 34], [165, 3, 5, 9, 10, 45]]);
        const sum = rationalOperation(rationalValue(decimalA, 100), rationalValue(fractionN, fractionD), "+");
        const divided = rationalOperation(sum, rationalValue(divisorN, divisorD), "÷");
        const value = rationalOperation(divided, rationalValue(decimalB, 100), "-");
        return result(`다음을 계산하세요.<div class="equation">(${(decimalA / 100).toFixed(2)} + ${fractionN}/${fractionD}) ÷ ${divisorN}/${divisorD} - ${(decimalB / 100).toFixed(2)}</div>${fractionDivisionEvidence("62-mixed-calculation", [decimalA, fractionN, fractionD, divisorN, divisorD, decimalB])}`, mixedFraction(value.numerator, value.denominator), `소수를 분수로 바꾸어 차례로 계산하면 ${mixedFraction(value.numerator, value.denominator)}입니다.`);
      }
      if (kind === 1) {
        const [distanceTenths, fuelN, fuelD] = pick(rng, [[434, 7, 2], [576, 24, 5], [625, 25, 4], [693, 11, 2]]);
        const efficiency = rationalValue(distanceTenths * fuelD, 10 * fuelN);
        return result(`자동차가 ${(distanceTenths / 10).toFixed(1)}km를 달리는 데 ${mixedFraction(fuelN, fuelD)}L의 연료를 사용했습니다. 연료 1L로 달린 거리를 구하세요.${fractionDivisionEvidence("62-fuel-efficiency", [distanceTenths, fuelN, fuelD])}`, `${decimal(efficiency.numerator / efficiency.denominator, 2)}km`, `거리÷사용한 연료=${(distanceTenths / 10).toFixed(1)}÷${mixedFraction(fuelN, fuelD)}=${decimal(efficiency.numerator / efficiency.denominator, 2)}km입니다.`);
      }
      if (kind === 2) {
        const [valueN, valueD, lowerN, lowerD, upperN, upperD, limit] = pick(rng, [[25, 3, 1, 2, 2, 1, 30], [42, 5, 2, 3, 3, 1, 30], [63, 8, 3, 5, 2, 1, 35], [55, 6, 1, 3, 5, 2, 40]]);
        const candidates = Array.from({ length: limit }, (_, index) => index + 1).filter(number => valueN * lowerD > lowerN * valueD * number && valueN * upperD < upperN * valueD * number);
        const answer = candidates.reduce((sum, value) => sum + value, 0);
        return result(`자연수 □에 대하여 ${fraction(lowerN, lowerD)}<${mixedFraction(valueN, valueD)}÷□<${fraction(upperN, upperD)}입니다. 가능한 모든 □의 합을 구하세요.${fractionDivisionEvidence("62-quotient-range", [valueN, valueD, lowerN, lowerD, upperN, upperD, limit])}`, answer, `부등식을 만족하는 자연수는 ${candidates.join(", ")}이고 합은 ${answer}입니다.`);
      }
      if (kind === 3) {
        const [firstTenths, firstLaps, secondN, secondD, secondLaps] = pick(rng, [[8, 14, 14, 9, 7], [12, 11, 9, 5, 8], [15, 12, 11, 6, 9], [18, 10, 7, 4, 12]]);
        const firstDistance = rationalValue(firstTenths * firstLaps, 10), secondDistance = rationalValue(secondN * secondLaps, secondD);
        const difference = rationalOperation(firstDistance, secondDistance, firstDistance.numerator * secondDistance.denominator >= secondDistance.numerator * firstDistance.denominator ? "-" : "+");
        const actualDifference = Math.abs(firstDistance.numerator / firstDistance.denominator - secondDistance.numerator / secondDistance.denominator);
        return result(`한 바퀴가 ${(firstTenths / 10).toFixed(1)}km인 트랙을 ${firstLaps}바퀴 돈 거리와, 한 바퀴가 ${mixedFraction(secondN, secondD)}km인 트랙을 ${secondLaps}바퀴 돈 거리의 차를 구하세요.${fractionDivisionEvidence("62-track-difference", [firstTenths, firstLaps, secondN, secondD, secondLaps])}`, `${decimal(actualDifference, 3)}km`, `두 거리는 ${mixedFraction(firstDistance.numerator, firstDistance.denominator)}km와 ${mixedFraction(secondDistance.numerator, secondDistance.denominator)}km입니다. 차는 ${decimal(actualDifference, 3)}km입니다.`);
      }
      if (kind === 4) {
        const [emptyN, emptyD, drinkN, drinkD, consumedN, consumedD] = pick(rng, [[3, 4, 5, 2, 2, 5], [4, 5, 18, 5, 1, 3], [5, 6, 14, 3, 3, 7], [7, 8, 21, 4, 4, 9]]);
        const full = rationalOperation(rationalValue(emptyN, emptyD), rationalValue(drinkN, drinkD), "+");
        const remainingDrink = rationalValue(drinkN * (consumedD - consumedN), drinkD * consumedD);
        const after = rationalOperation(rationalValue(emptyN, emptyD), remainingDrink, "+");
        return result(`음료가 가득 든 병의 무게는 ${mixedFraction(full.numerator, full.denominator)}kg입니다. 음료의 ${consumedN}/${consumedD}를 마신 뒤 병을 재었더니 ${mixedFraction(after.numerator, after.denominator)}kg이었습니다. 빈 병의 무게를 구하세요.${fractionDivisionEvidence("62-bottle-weight", [full.numerator, full.denominator, after.numerator, after.denominator, consumedN, consumedD])}`, `${mixedFraction(emptyN, emptyD)}kg`, `처음과 나중 무게의 차는 마신 음료 ${consumedN}/${consumedD}의 무게입니다. 음료 전체와 빈 병 무게를 역산하면 빈 병은 ${mixedFraction(emptyN, emptyD)}kg입니다.`);
      }
      const [topTenths, bottomN, bottomD, heightN, heightD] = pick(rng, [[25, 9, 2, 8, 1], [32, 24, 5, 15, 2], [45, 11, 2, 6, 1], [56, 32, 5, 25, 4]]);
      const top = rationalValue(topTenths, 10), bottom = rationalValue(bottomN, bottomD), height = rationalValue(heightN, heightD);
      const baseSum = rationalOperation(top, bottom, "+"), area = rationalValue(baseSum.numerator * height.numerator, baseSum.denominator * height.denominator * 2);
      return result(`사다리꼴의 윗변은 ${(topTenths / 10).toFixed(1)}cm, 아랫변은 ${mixedFraction(bottomN, bottomD)}cm이고 넓이는 ${mixedFraction(area.numerator, area.denominator)}cm²입니다. 높이를 구하세요.${fractionTrapezoidSvg({ top: (topTenths / 10).toFixed(1), bottom: mixedFraction(bottomN, bottomD) })}${fractionDivisionEvidence("62-trapezoid-height", [topTenths, bottomN, bottomD, area.numerator, area.denominator])}`, `${mixedFraction(heightN, heightD)}cm`, `높이=넓이×2÷(윗변+아랫변)이므로 ${mixedFraction(heightN, heightD)}cm입니다.`);
    },
    secondDecimalDivisionUnderstanding({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const targetTenth = int(rng, 54, 88 + level * 8);
        const divisorTenth = pick(rng, [12, 14, 16, 25]);
        const quotients = shuffle(rng, [-12, -5, -1, 3, 8, 15].map(offset => targetTenth + offset));
        const labels = ["㉠", "㉡", "㉢", "㉣", "㉤", "㉥"];
        const expressions = quotients.map((quotient, index) => `${labels[index]} ${fixedDecimal(quotient * divisorTenth, 2)}÷${fixedDecimal(divisorTenth, 1)}`);
        const answer = quotients.map((quotient, index) => quotient > targetTenth ? labels[index] : "").filter(Boolean).join(", ");
        return result(`${fixedDecimal(targetTenth, 1)}보다 몫이 큰 것을 모두 찾아 기호를 쓰세요.<div class="equation">${expressions.join("<br>")}</div>${decimalDivisionEvidence("62d-compare-quotients", [targetTenth, ...quotients])}`, answer, `각 식의 몫은 차례로 ${quotients.map(value => fixedDecimal(value, 1)).join(", ")}입니다. ${fixedDecimal(targetTenth, 1)}보다 큰 식은 ${answer}입니다.`);
      }
      if (kind === 1) {
        const lowTenth = int(rng, 42, 72 + level * 6);
        const highTenth = lowTenth + int(rng, 65, 105 + level * 10);
        const divisorA = pick(rng, [12, 14, 16]), divisorB = pick(rng, [15, 18, 25]);
        const candidates = Array.from({ length: 40 }, (_, index) => index + 1).filter(value => lowTenth / 10 < value && value < highTenth / 10);
        return result(`다음 두 부등식의 □ 안에 공통으로 들어갈 수 있는 자연수는 모두 몇 개입니까?<div class="equation">${fixedDecimal(lowTenth * divisorA, 2)}÷${fixedDecimal(divisorA, 1)} &lt; □<br>□ &lt; ${fixedDecimal(highTenth * divisorB, 2)}÷${fixedDecimal(divisorB, 1)}</div>${decimalDivisionEvidence("62d-common-natural-range", [lowTenth, highTenth])}`, candidates.length, `두 나눗셈의 몫은 ${fixedDecimal(lowTenth, 1)}와 ${fixedDecimal(highTenth, 1)}입니다. 그 사이의 자연수는 ${candidates.join(", ")}로 모두 ${candidates.length}개입니다.`);
      }
      if (kind === 2) {
        const multiplierTenth = pick(rng, [12, 14, 16, 18]);
        const firstDigit = int(rng, 2, 4), lastDigit = firstDigit + int(rng, 2, Math.min(4 + level, 9 - firstDigit));
        const lowHundred = (firstDigit - 1) * multiplierTenth + 1;
        const highHundred = (lastDigit + 1) * multiplierTenth - 1;
        const candidates = Array.from({ length: 9 }, (_, index) => index + 1).filter(digit => lowHundred < digit * multiplierTenth && digit * multiplierTenth < highHundred);
        return result(`□가 0이 아닌 소수 한 자리 수일 때 다음을 만족하는 □는 모두 몇 개입니까?<div class="equation">${fixedDecimal(lowHundred, 2)} &lt; □ × ${fixedDecimal(multiplierTenth, 1)} &lt; ${fixedDecimal(highHundred, 2)}</div>${decimalDivisionEvidence("62d-one-decimal-range", [multiplierTenth, lowHundred, highHundred])}`, candidates.length, `□=0.1, 0.2, …, 0.9를 차례로 확인하면 ${candidates.map(value => fixedDecimal(value, 1)).join(", ")}가 조건을 만족하므로 ${candidates.length}개입니다.`);
      }
      if (kind === 3) {
        const divisorTenth = pick(rng, [24, 32, 36, 45]);
        const quotientTenth = int(rng, 24, 79 + level * 12);
        const dividendHundred = divisorTenth * quotientTenth;
        const original = fixedDecimal(dividendHundred, 2);
        const positions = [...original].map((character, index) => /\d/.test(character) ? index : -1).filter(index => index >= 0);
        const hiddenIndex = pick(rng, positions);
        const masked = `${original.slice(0, hiddenIndex)}□${original.slice(hiddenIndex + 1)}`;
        const answer = original[hiddenIndex];
        return result(`다음 나눗셈이 맞도록 □에 들어갈 숫자를 구하세요.<div class="equation">${masked} ÷ ${fixedDecimal(divisorTenth, 1)} = ${fixedDecimal(quotientTenth, 1)}</div>${decimalDivisionEvidence("62d-missing-division-digit", [divisorTenth, quotientTenth, dividendHundred, hiddenIndex])}`, answer, `${fixedDecimal(quotientTenth, 1)}×${fixedDecimal(divisorTenth, 1)}=${original}이므로 빠진 숫자는 ${answer}입니다.`);
      }
      if (kind === 4) {
        const digits = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).sort((a, b) => a - b);
        const cases = [];
        for (const a of digits) for (const b of digits) for (const c of digits) for (const d of digits) {
          if (new Set([a, b, c, d]).size !== 4) continue;
          cases.push({ text: `${a}.${b}÷${c}.${d}`, value: (10 * a + b) / (10 * c + d) });
        }
        cases.sort((left, right) => left.value - right.value);
        const best = cases[cases.length - 1];
        return result(`수 카드 ${digits.join(", ")}을 한 번씩 모두 사용하여 (소수 한 자리 수)÷(소수 한 자리 수)를 만듭니다. 몫이 가장 클 때의 몫을 구하세요.${decimalDivisionEvidence("62d-card-largest-quotient", digits)}`, decimal(best.value, 3), `가능한 배열을 모두 비교하면 ${best.text}일 때 가장 큽니다. 몫은 ${decimal(best.value, 3)}입니다.`);
      }
      const digits = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((a, b) => a - b);
      const factorTenth = pick(rng, [24, 28, 32]), divisorTenth = pick(rng, [15, 20, 25]);
      const values = [];
      for (const a of digits) for (const b of digits) for (const c of digits) {
        if (new Set([a, b, c]).size !== 3) continue;
        const number = (100 * a + 10 * b + c) / 100;
        values.push({ number, transformed: number * factorTenth / divisorTenth });
      }
      values.sort((left, right) => left.transformed - right.transformed);
      const lowIndex = int(rng, 0, 2), highIndex = int(rng, Math.max(lowIndex + 2, 3), 5);
      const lowThousand = Math.round((values[lowIndex].transformed + values[lowIndex + 1].transformed) * 500);
      const highThousand = Math.round((values[highIndex - 1].transformed + values[highIndex].transformed) * 500);
      const candidates = values.filter(item => lowThousand / 1000 < item.transformed && item.transformed < highThousand / 1000);
      return result(`수 카드 ${digits.join(", ")}을 한 번씩 모두 사용하여 소수 두 자리 수 ㉠을 만듭니다. 다음을 만족하는 ㉠은 모두 몇 개입니까?<div class="equation">${fixedDecimal(lowThousand, 3)} &lt; ㉠ × ${fixedDecimal(factorTenth, 1)} ÷ ${fixedDecimal(divisorTenth, 1)} &lt; ${fixedDecimal(highThousand, 3)}</div>${decimalDivisionEvidence("62d-card-range-count", [...digits, factorTenth, divisorTenth, lowThousand, highThousand])}`, candidates.length, `카드의 모든 배열을 검사하면 ${candidates.map(item => item.number.toFixed(2)).join(", ")}가 조건을 만족하므로 ${candidates.length}개입니다.`);
    },
    secondDecimalDivisionApplication({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const gapA = pick(rng, [8, 9, 12, 15]), gapB = pick(rng, [10, 14, 16, 18]);
        const lengthTenth = lcm(gapA, gapB) * int(rng, 3, 5 + level);
        const answer = lengthTenth / gapA + lengthTenth / gapB;
        return result(`길이가 ${fixedDecimal(lengthTenth, 1)}m인 통로의 양쪽에 처음부터 끝까지 각각 ${fixedDecimal(gapA, 1)}m, ${fixedDecimal(gapB, 1)}m 간격으로 표지를 놓습니다. 양 끝의 표지는 양쪽이 함께 사용합니다. 필요한 표지는 모두 몇 개입니까?${decimalDivisionEvidence("62d-two-side-spacing", [lengthTenth, gapA, gapB])}`, answer, `양쪽에서 생기는 간격 수는 ${lengthTenth / gapA}개와 ${lengthTenth / gapB}개입니다. 양 끝을 함께 쓰므로 표지 수는 두 간격 수의 합인 ${answer}개입니다.`);
      }
      if (kind === 1) {
        const count = int(rng, 8, 13 + level * 2), lengthTenth = int(rng, 180, 290), overlapTenth = int(rng, 12, 35);
        const totalTenth = count * lengthTenth - (count - 1) * overlapTenth;
        return result(`길이가 ${fixedDecimal(lengthTenth, 1)}cm인 색 테이프 ${count}장을 이웃한 두 장이 ${fixedDecimal(overlapTenth, 1)}cm씩 겹치도록 일렬로 붙였습니다. 이어 붙인 전체 길이를 구하세요.${decimalDivisionEvidence("62d-overlapped-tape", [count, lengthTenth, overlapTenth])}`, `${fixedDecimal(totalTenth, 1)}cm`, `처음 길이의 합 ${fixedDecimal(count * lengthTenth, 1)}cm에서 겹친 ${count - 1}곳의 길이를 빼면 ${fixedDecimal(totalTenth, 1)}cm입니다.`);
      }
      if (kind === 2) {
        const base = int(rng, 8, 16 + level * 2), height = int(rng, 5, 12 + level), ratioTenth = pick(rng, [12, 15, 18, 20]);
        const triangleArea = base * height / 2, rectangleArea = triangleArea * ratioTenth / 10;
        return result(`어떤 직사각형의 넓이는 밑변이 ${base}cm인 삼각형 넓이의 ${fixedDecimal(ratioTenth, 1)}배이고, 직사각형의 넓이는 ${decimal(rectangleArea, 2)}cm²입니다. 삼각형의 높이를 구하세요.${decimalDivisionEvidence("62d-area-ratio-height", [base, ratioTenth, Math.round(rectangleArea * 100)])}`, `${height}cm`, `삼각형의 넓이는 ${decimal(rectangleArea, 2)}÷${fixedDecimal(ratioTenth, 1)}=${decimal(triangleArea, 2)}cm²입니다. 높이는 넓이×2÷밑변이므로 ${height}cm입니다.`);
      }
      if (kind === 3) {
        const overlapBase = int(rng, 3, 8 + level), overlapHeight = pick(rng, [4, 6, 8, 10]);
        const overlapArea = overlapBase * overlapHeight / 2;
        const areaA = overlapArea + int(rng, 18, 38), areaB = overlapArea + int(rng, 20, 42);
        const unionArea = areaA + areaB - overlapArea;
        return result(`두 삼각형의 넓이는 각각 ${decimal(areaA, 2)}cm², ${decimal(areaB, 2)}cm²이고 겹친 전체 도형의 넓이는 ${decimal(unionArea, 2)}cm²입니다. 겹친 부분이 높이 ${overlapHeight}cm인 삼각형일 때 그 밑변을 구하세요.${decimalDivisionEvidence("62d-overlap-triangle", [areaA * 100, areaB * 100, unionArea * 100, overlapHeight])}`, `${overlapBase}cm`, `겹친 넓이는 ${decimal(areaA, 2)}+${decimal(areaB, 2)}-${decimal(unionArea, 2)}=${decimal(overlapArea, 2)}cm²입니다. 밑변은 넓이×2÷높이=${overlapBase}cm입니다.`);
      }
      if (kind === 4) {
        const speedATenth = pick(rng, [24, 27, 30, 32]), speedBTenth = pick(rng, [28, 31, 34, 36]);
        const minutes = pick(rng, [30, 36, 42, 48, 54, 60].slice(0, 4 + level));
        const distanceHundred = (speedATenth + speedBTenth) * minutes / 6;
        const start = int(rng, 780, 930), finish = start + minutes;
        const clock = value => `${Math.floor(value / 60)}시 ${String(value % 60).padStart(2, "0")}분`;
        return result(`두 사람이 ${fixedDecimal(distanceHundred, 2)}km 떨어진 곳에서 ${clock(start)}에 서로를 향해 동시에 출발했습니다. 두 사람은 1시간에 각각 ${fixedDecimal(speedATenth, 1)}km, ${fixedDecimal(speedBTenth, 1)}km를 걷습니다. 만나는 시각을 구하세요.${decimalDivisionEvidence("62d-opposite-walkers", [distanceHundred, speedATenth, speedBTenth, start])}`, clock(finish), `빠르기의 합은 ${fixedDecimal(speedATenth + speedBTenth, 1)}km/h이고 만날 때까지 ${minutes}분이 걸립니다. 따라서 ${clock(finish)}에 만납니다.`);
      }
      const widthA = int(rng, 2, 6 + level), widthB = int(rng, 3, 8 + level), heightA = int(rng, 2, 7), heightB = int(rng, 3, 9);
      const missing = widthA * heightA, topRight = widthB * heightA, bottomLeft = widthA * heightB, bottomRight = widthB * heightB;
      return result(`가로와 세로의 경계가 곧게 이어진 네 직사각형의 넓이입니다. ㉠의 넓이를 구하세요.${valueTable(["㉠cm²", `${topRight}cm²`], [`${bottomLeft}cm²`, `${bottomRight}cm²`])}${decimalDivisionEvidence("62d-four-rectangles", [widthA, widthB, heightA, heightB])}`, `${missing}cm²`, `같은 열의 가로 길이와 같은 행의 세로 길이를 이용하면 ㉠×${bottomRight}=${topRight}×${bottomLeft}입니다. 따라서 ㉠=${missing}cm²입니다.`);
    },
    secondDecimalDivisionRounding({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const dividendHundred = int(rng, 480, 2480 + level * 800), divisorHundred = int(rng, 113, 387);
        const quotient = dividendHundred / divisorHundred;
        const first = Number(quotient.toFixed(1)), second = Number(quotient.toFixed(2));
        const answer = decimal(Math.abs(first - second), 2);
        if (answer === "0") return generators.secondDecimalDivisionRounding({ rng, level, variant });
        return result(`${fixedDecimal(dividendHundred, 2)}÷${fixedDecimal(divisorHundred, 2)}의 몫을 반올림하여 소수 첫째 자리까지 나타낸 값과 소수 둘째 자리까지 나타낸 값의 차를 구하세요.${decimalDivisionEvidence("62d-rounded-difference", [dividendHundred, divisorHundred])}`, answer, `몫은 ${decimal(quotient, 4)}…이고 반올림한 두 값은 ${first}, ${second}입니다. 차는 ${answer}입니다.`);
      }
      if (kind === 1) {
        const digits = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).sort((a, b) => a - b);
        const values = [];
        for (const a of digits) for (const b of digits) for (const c of digits) for (const d of digits) {
          if (new Set([a, b, c, d]).size !== 4) continue;
          values.push((10 * a + b) / (10 * c + d));
        }
        const maximum = Math.max(...values), answer = decimal(maximum, 2);
        return result(`수 카드 ${digits.join(", ")}을 한 번씩 사용한 (소수 한 자리 수)÷(소수 한 자리 수)의 몫 중 가장 큰 값을 반올림하여 소수 둘째 자리까지 나타내세요.${decimalDivisionEvidence("62d-card-rounded-maximum", digits)}`, answer, `모든 배열을 비교한 가장 큰 몫은 ${decimal(maximum, 5)}…이므로 소수 둘째 자리까지 ${answer}입니다.`);
      }
      if (kind === 2) {
        const divisorTenth = pick(rng, [63, 71, 82, 94]);
        const hidden = int(rng, 1, 8), baseHundred = 1000 + int(rng, 0, 99);
        const dividendHundred = baseHundred + hidden * 100;
        const targetTenth = Math.round(dividendHundred / divisorTenth);
        const candidates = Array.from({ length: 10 }, (_, digit) => digit).filter(digit => Math.round((baseHundred + digit * 100) / divisorTenth) === targetTenth);
        if (candidates.length !== 1) return generators.secondDecimalDivisionRounding({ rng, level, variant });
        const original = fixedDecimal(dividendHundred, 2), masked = `${original[0]}□${original.slice(2)}`;
        return result(`${masked}÷${fixedDecimal(divisorTenth, 1)}의 몫을 반올림하여 소수 첫째 자리까지 나타내면 ${fixedDecimal(targetTenth, 1)}입니다. □에 알맞은 숫자를 구하세요.${decimalDivisionEvidence("62d-rounded-missing-digit", [baseHundred, divisorTenth, targetTenth])}`, hidden, `□에 0부터 9까지 넣어 반올림 조건을 확인하면 ${hidden}만 조건을 만족합니다.`);
      }
      if (kind === 3) {
        const limitTenth = int(rng, 130, 220), truckTenth = int(rng, 18, 42), boxHundred = pick(rng, [9, 11, 12, 15, 18]);
        const count = Math.floor((limitTenth - truckTenth) * 10 / boxHundred);
        return result(`최대 ${fixedDecimal(limitTenth, 1)}t까지 견디는 다리를 무게 ${fixedDecimal(truckTenth, 1)}t인 트럭이 지나갑니다. 한 개가 ${fixedDecimal(boxHundred, 2)}t인 상자를 최대 몇 개 실을 수 있습니까?${decimalDivisionEvidence("62d-bridge-boxes", [limitTenth, truckTenth, boxHundred])}`, count, `실을 수 있는 무게 ${fixedDecimal(limitTenth - truckTenth, 1)}t를 상자 한 개의 무게로 나눈 몫의 자연수 부분은 ${count}이므로 최대 ${count}개입니다.`);
      }
      if (kind === 4) {
        const numeratorHundred = int(rng, 1800, 6200), chosenTenth = int(rng, 12, 75);
        const targetTenth = Math.round(numeratorHundred / chosenTenth);
        const candidates = Array.from({ length: 90 }, (_, index) => index + 10).filter(value => Math.round(numeratorHundred / value) === targetTenth);
        return result(`${fixedDecimal(numeratorHundred, 2)}÷㉠의 몫을 반올림하여 소수 첫째 자리까지 나타내면 ${fixedDecimal(targetTenth, 1)}입니다. ㉠이 1.0 이상 9.9 이하인 소수 한 자리 수일 때 가능한 ㉠은 모두 몇 개입니까?${decimalDivisionEvidence("62d-rounded-divisor-count", [numeratorHundred, targetTenth])}`, candidates.length, `1.0부터 9.9까지 0.1씩 확인하면 조건을 만족하는 값은 ${candidates.map(value => fixedDecimal(value, 1)).join(", ")}로 ${candidates.length}개입니다.`);
      }
      const cubeHundred = pick(rng, [85, 95, 105, 115, 125]);
      const counts = [int(rng, 4, 8 + level), int(rng, 3, 7 + level), int(rng, 3, 6 + level)];
      const margins = [int(rng, 0, cubeHundred - 1), int(rng, 0, cubeHundred - 1), int(rng, 0, cubeHundred - 1)];
      const dimensions = counts.map((count, index) => count * cubeHundred + margins[index]);
      const answer = counts.reduce((total, value) => total * value, 1);
      return result(`가로 ${fixedDecimal(dimensions[0], 2)}cm, 세로 ${fixedDecimal(dimensions[1], 2)}cm, 높이 ${fixedDecimal(dimensions[2], 2)}cm인 상자에 모서리 길이가 ${fixedDecimal(cubeHundred, 2)}cm인 정육면체를 빈틈없이 나란히 넣습니다. 최대 몇 개 넣을 수 있습니까?${decimalDivisionEvidence("62d-cubes-in-box", [cubeHundred, ...dimensions])}`, answer, `각 방향에 들어가는 개수는 몫의 자연수 부분인 ${counts.join(", ")}개입니다. 모두 ${counts.join("×")}=${answer}개입니다.`);
    },
    secondDecimalDivisionRemainder({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const remainders = shuffle(rng, [12, 23, 37, 46].map(value => value + level));
        const divisors = [125, 138, 164, 175], labels = ["㉠", "㉡", "㉢", "㉣"];
        const equations = remainders.map((remainder, index) => `${labels[index]} ${fixedDecimal(divisors[index] * (index + 3) + remainder, 2)}÷${fixedDecimal(divisors[index], 2)}`);
        const order = remainders.map((value, index) => ({ value, label: labels[index] })).sort((a, b) => b.value - a.value).map(item => item.label).join(", ");
        return result(`다음 나눗셈의 몫을 자연수 부분까지 구했을 때 나머지가 큰 순서대로 기호를 쓰세요.<div class="equation">${equations.join("<br>")}</div>${decimalDivisionEvidence("62d-remainder-order", remainders)}`, order, `나머지는 차례로 ${remainders.map(value => fixedDecimal(value, 2)).join(", ")}입니다. 큰 순서는 ${order}입니다.`);
      }
      if (kind === 1) {
        const divisorHundred = pick(rng, [135, 175, 225, 260]), quotient = int(rng, 4, 12 + level), remainderHundred = int(rng, 1, divisorHundred - 1);
        const dividendHundred = divisorHundred * quotient + remainderHundred;
        return result(`어떤 수를 ${fixedDecimal(divisorHundred, 2)}로 나누어 몫을 자연수 부분까지 구했더니 몫이 ${quotient}, 나머지가 ${fixedDecimal(remainderHundred, 2)}였습니다. 어떤 수를 구하세요.${decimalDivisionEvidence("62d-dividend-from-remainder", [divisorHundred, quotient, remainderHundred])}`, fixedDecimal(dividendHundred, 2), `${fixedDecimal(divisorHundred, 2)}×${quotient}+${fixedDecimal(remainderHundred, 2)}=${fixedDecimal(dividendHundred, 2)}입니다.`);
      }
      if (kind === 2) {
        const divisorA = pick(rng, [125, 150, 175, 225]), quotient = int(rng, 5, 13 + level), remainderA = int(rng, 12, divisorA - 1);
        const original = divisorA * quotient + remainderA, divisorB = pick(rng, [80, 95, 110, 130]);
        const remainderB = original % divisorB;
        return result(`어떤 수를 ${fixedDecimal(divisorA, 2)}로 나누어 몫을 자연수 부분까지 구하면 몫이 ${quotient}, 나머지가 ${fixedDecimal(remainderA, 2)}입니다. 이 수를 ${fixedDecimal(divisorB, 2)}로 나눌 때의 나머지를 구하세요.${decimalDivisionEvidence("62d-changed-divisor-remainder", [divisorA, quotient, remainderA, divisorB])}`, fixedDecimal(remainderB, 2), `어떤 수는 ${fixedDecimal(original, 2)}입니다. 이를 ${fixedDecimal(divisorB, 2)}로 나누면 나머지는 ${fixedDecimal(remainderB, 2)}입니다.`);
      }
      if (kind === 3) {
        const divisorHundred = pick(rng, [175, 225, 275, 325]), dividendHundred = int(rng, 600, 2400 + level * 500);
        const remainder = dividendHundred % divisorHundred;
        if (!remainder) return generators.secondDecimalDivisionRemainder({ rng, level, variant });
        const add = divisorHundred - remainder;
        return result(`${fixedDecimal(dividendHundred, 2)}÷${fixedDecimal(divisorHundred, 2)}가 나누어떨어지도록 ${fixedDecimal(dividendHundred, 2)}에 더할 수 있는 가장 작은 소수를 구하세요.${decimalDivisionEvidence("62d-smallest-decimal-addend", [dividendHundred, divisorHundred])}`, fixedDecimal(add, 2), `현재 나머지는 ${fixedDecimal(remainder, 2)}이므로 나누는 수 ${fixedDecimal(divisorHundred, 2)}까지 필요한 ${fixedDecimal(add, 2)}를 더해야 합니다.`);
      }
      if (kind === 4) {
        const divisorA = pick(rng, [210, 260, 310, 360]), quotient = int(rng, 4, 11 + level), remainderA = int(rng, 15, divisorA - 1);
        const original = divisorA * quotient + remainderA, divisorB = pick(rng, [140, 175, 225, 250]);
        const remainderB = original % divisorB;
        return result(`어떤 수를 ${fixedDecimal(divisorA, 2)}로 나누면 몫이 ${quotient}, 나머지가 ${fixedDecimal(remainderA, 2)}입니다. 같은 수를 ${fixedDecimal(divisorB, 2)}로 나누어 몫을 자연수 부분까지 구할 때 나머지를 구하세요.${decimalDivisionEvidence("62d-same-number-new-remainder", [divisorA, quotient, remainderA, divisorB])}`, fixedDecimal(remainderB, 2), `어떤 수는 ${fixedDecimal(original, 2)}이고, ${fixedDecimal(divisorB, 2)}로 다시 나눈 나머지는 ${fixedDecimal(remainderB, 2)}입니다.`);
      }
      const divisorHundred = pick(rng, [211, 237, 263, 289]), quotient = int(rng, 2, 9 + level), remainderHundred = int(rng, 1, divisorHundred - 1);
      const original = divisorHundred * quotient + remainderHundred;
      return result(`어떤 소수를 ${fixedDecimal(divisorHundred, 2)}로 나누어 몫을 자연수 부분까지 구했더니 몫이 ${quotient}, 나머지가 ${fixedDecimal(remainderHundred, 2)}였습니다. 어떤 소수를 구하세요.${decimalDivisionEvidence("62d-original-from-remainder", [divisorHundred, quotient, remainderHundred])}`, fixedDecimal(original, 2), `나누는 수×몫+나머지=${fixedDecimal(divisorHundred, 2)}×${quotient}+${fixedDecimal(remainderHundred, 2)}=${fixedDecimal(original, 2)}입니다.`);
    },
    secondDecimalDivisionUnitRate({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const [speedTenth, distanceTenth] = pick(rng, [[42, 462], [36, 378], [48, 624], [54, 729], [66, 891]]);
        const sampleMinutes = pick(rng, [48, 54, 66, 72, 84]);
        const sampleDistanceHundred = speedTenth * sampleMinutes / 6;
        const minutes = distanceTenth * 60 / speedTenth;
        return result(`일정한 빠르기로 ${sampleMinutes}분 동안 ${fixedDecimal(sampleDistanceHundred, 2)}km를 걸었습니다. 같은 빠르기로 ${fixedDecimal(distanceTenth, 1)}km를 가는 데 걸리는 시간을 반올림하여 소수 첫째 자리까지 나타내세요.${decimalDivisionEvidence("62d-unit-speed-time", [sampleDistanceHundred, sampleMinutes, distanceTenth])}`, `${decimal(minutes / 60, 1)}시간`, `1시간의 거리는 ${fixedDecimal(sampleDistanceHundred, 2)}÷${sampleMinutes}×60=${fixedDecimal(speedTenth, 1)}km입니다. ${fixedDecimal(distanceTenth, 1)}÷${fixedDecimal(speedTenth, 1)}=${decimal(minutes / 60, 1)}시간입니다.`);
      }
      if (kind === 1) {
        const [fuelA, distanceA, fuelB, distanceB] = pick(rng, [[24, 3024, 46, 7245], [32, 4288, 50, 7425], [28, 3696, 42, 6237], [36, 4968, 48, 7344]]);
        const rateA = distanceA / fuelA, rateB = distanceB / fuelB;
        const ratio = rateA / rateB;
        return result(`가 자동차는 휘발유 ${fixedDecimal(fuelA, 1)}L로 ${fixedDecimal(distanceA, 2)}km, 나 자동차는 ${fixedDecimal(fuelB, 1)}L로 ${fixedDecimal(distanceB, 2)}km를 갑니다. 1L당 거리로 비교할 때 가 자동차는 나 자동차의 약 몇 배입니까? 반올림하여 소수 둘째 자리까지 나타내세요.${decimalDivisionEvidence("62d-fuel-efficiency-ratio", [fuelA, distanceA, fuelB, distanceB])}`, decimal(ratio, 2), `1L당 거리는 각각 ${decimal(rateA / 10, 3)}km, ${decimal(rateB / 10, 3)}km입니다. 두 값을 나누면 ${decimal(ratio, 2)}배입니다.`);
      }
      if (kind === 2) {
        const rateA = int(rng, 14, 28 + level * 3), rateB = int(rng, 10, 24 + level * 3), minutes = int(rng, 3, 8), price = pick(rng, [8, 10, 12, 15]);
        const volume = (rateA + rateB) * minutes, cost = volume * price;
        return result(`가 수도관은 1분에 ${rateA}L, 나 수도관은 1분에 ${rateB}L씩 일정하게 물이 나옵니다. 두 수도관을 ${minutes}분 동안 함께 틀 때 물 1L의 값이 ${price}원이라면 물값은 얼마입니까?${decimalDivisionEvidence("62d-two-taps-cost", [rateA, rateB, minutes, price])}`, `${cost.toLocaleString()}원`, `1분에 ${rateA + rateB}L, ${minutes}분에는 ${volume}L가 나옵니다. ${volume}×${price}=${cost.toLocaleString()}원입니다.`);
      }
      if (kind === 3) {
        const stillTenth = pick(rng, [36, 42, 48, 54]), currentTenth = pick(rng, [6, 8, 9, 12]);
        const downHours = int(rng, 2, 5), upHours = int(rng, 2, 5);
        const downDistanceTenth = (stillTenth + currentTenth) * downHours, upDistanceTenth = (stillTenth - currentTenth) * upHours;
        const total = downHours + upHours;
        return result(`고요한 물에서 시속 ${fixedDecimal(stillTenth, 1)}km인 배가 시속 ${fixedDecimal(currentTenth, 1)}km로 흐르는 강에서 아래쪽으로 ${fixedDecimal(downDistanceTenth, 1)}km, 다시 위쪽으로 ${fixedDecimal(upDistanceTenth, 1)}km 이동합니다. 모두 몇 시간이 걸립니까?${decimalDivisionEvidence("62d-river-round-trip", [stillTenth, currentTenth, downDistanceTenth, upDistanceTenth])}`, `${total}시간`, `내려갈 때 속력은 ${fixedDecimal(stillTenth + currentTenth, 1)}km/h, 올라갈 때는 ${fixedDecimal(stillTenth - currentTenth, 1)}km/h입니다. 시간의 합은 ${downHours}+${upHours}=${total}시간입니다.`);
      }
      if (kind === 4) {
        const emptyHundred = int(rng, 45, 125), densityHundred = pick(rng, [82, 95, 108, 124]), fullVolumeTenth = int(rng, 35, 75), usedVolumeTenth = int(rng, 10, fullVolumeTenth - 10);
        const fullMassThousand = emptyHundred * 10 + densityHundred * fullVolumeTenth;
        const afterMassThousand = emptyHundred * 10 + densityHundred * (fullVolumeTenth - usedVolumeTenth);
        return result(`빈 통에 액체 ${fixedDecimal(fullVolumeTenth, 1)}L를 넣은 무게는 ${fixedDecimal(fullMassThousand, 3)}kg입니다. 이 통에서 ${fixedDecimal(usedVolumeTenth, 1)}L를 사용한 뒤의 무게는 ${fixedDecimal(afterMassThousand, 3)}kg입니다. 빈 통의 무게를 구하세요.${decimalDivisionEvidence("62d-container-unit-mass", [fullVolumeTenth, usedVolumeTenth, fullMassThousand, afterMassThousand])}`, `${fixedDecimal(emptyHundred, 2)}kg`, `두 무게의 차를 사용한 양으로 나누어 1L의 무게를 구한 뒤, 처음 무게에서 액체 무게를 빼면 빈 통은 ${fixedDecimal(emptyHundred, 2)}kg입니다.`);
      }
      const initialTenth = int(rng, 180, 320), burnHundred = pick(rng, [18, 22, 24, 25, 28]), elapsed = int(rng, 20, 55 + level * 10);
      const remainingHundred = initialTenth * 10 - burnHundred * elapsed;
      if (remainingHundred <= 0) return generators.secondDecimalDivisionUnitRate({ rng, level, variant });
      return result(`길이가 ${fixedDecimal(initialTenth, 1)}cm인 양초가 1분에 ${fixedDecimal(burnHundred, 2)}cm씩 일정하게 줄어듭니다. 길이가 ${fixedDecimal(remainingHundred, 2)}cm가 될 때까지 몇 분 걸립니까?${decimalDivisionEvidence("62d-candle-time", [initialTenth, burnHundred, remainingHundred])}`, `${elapsed}분`, `줄어든 길이 ${fixedDecimal(initialTenth * 10 - remainingHundred, 2)}cm를 1분에 줄어드는 길이로 나누면 ${elapsed}분입니다.`);
    },
    secondDecimalDivisionEquation({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const initialTenth = int(rng, 80, 180 + level * 30), dropsTenth = [int(rng, 10, 25), int(rng, 12, 30), int(rng, 10, 24)];
        let bounce = 0.8 * initialTenth / 10;
        dropsTenth.forEach(drop => { bounce = 0.8 * (bounce + drop / 10); });
        const finalThousand = Math.round(bounce * 1000);
        return result(`공은 떨어진 높이의 0.8배만큼 튀어 오릅니다. 처음 바닥에서 튄 뒤 차례로 ${dropsTenth.map(value => fixedDecimal(value, 1)).join("m, ")}m 낮은 세 계단으로 떨어졌습니다. 네 번째로 튀어 오른 높이가 ${fixedDecimal(finalThousand, 3)}m일 때 처음 공을 떨어뜨린 높이를 구하세요.${decimalDivisionEvidence("62d-bouncing-stairs", [8, 10, ...dropsTenth, finalThousand])}`, `${fixedDecimal(initialTenth, 1)}m`, `네 번째 높이에서 매 단계마다 ÷0.8을 한 뒤 낮아진 계단 높이를 빼며 거꾸로 계산하면 처음 높이는 ${fixedDecimal(initialTenth, 1)}m입니다.`);
      }
      if (kind === 1) {
        const capacity = pick(rng, [40, 60, 80, 100, 120]), addedHundred = capacity * 15;
        return result(`물통에 전체 들이의 0.2만큼 물이 있습니다. 빈 부분의 5/8만큼을 채우고 ${fixedDecimal(addedHundred, 2)}L를 더 넣었더니 비어 있는 부분이 전체 들이의 15%가 되었습니다. 물통의 들이를 구하세요.${decimalDivisionEvidence("62d-tank-capacity", [addedHundred])}`, `${capacity}L`, `처음 20%에서 빈 부분의 5/8인 50%를 더 채우면 70%입니다. 마지막은 85%이므로 ${fixedDecimal(addedHundred, 2)}L가 전체의 15%입니다. 들이는 ${capacity}L입니다.`);
      }
      if (kind === 2) {
        const temperature = int(rng, 5, 32 + level * 5), seconds = pick(rng, [4, 5, 6]);
        const speedHundred = 33150 + 61 * temperature, distanceHundred = speedHundred * seconds;
        return result(`기온이 0℃일 때 소리는 1초에 331.5m를 이동하고, 기온이 1℃ 높아질 때마다 1초에 0.61m씩 더 이동합니다. 소리가 ${seconds}초 동안 ${fixedDecimal(distanceHundred, 2)}m 이동했다면 기온은 몇 ℃입니까?${decimalDivisionEvidence("62d-sound-temperature", [seconds, distanceHundred])}`, `${temperature}℃`, `1초 이동 거리는 ${fixedDecimal(distanceHundred / seconds, 2)}m이고 331.5m보다 ${fixedDecimal(61 * temperature, 2)}m 빠릅니다. 이를 0.61로 나누면 ${temperature}℃입니다.`);
      }
      if (kind === 3) {
        const length = pick(rng, [120, 160, 180, 200, 240]), firstTenth = pick(rng, [4, 5, 6]), secondTenth = pick(rng, [7, 8, 9]);
        if (secondTenth <= firstTenth) return generators.secondDecimalDivisionEquation({ rng, level, variant });
        const differenceTenth = length * (secondTenth - firstTenth);
        return result(`길이가 같은 두 막대를 물에 세웠습니다. 가 막대는 전체의 ${fixedDecimal(firstTenth, 1)}, 나 막대는 전체의 ${fixedDecimal(secondTenth, 1)}만큼 물에 잠겼고, 물 위로 나온 길이의 차는 ${fixedDecimal(differenceTenth, 1)}cm입니다. 막대 한 개의 길이를 구하세요.${decimalDivisionEvidence("62d-submerged-sticks", [firstTenth, secondTenth, differenceTenth])}`, `${length}cm`, `물 위 길이의 차는 전체 길이의 ${fixedDecimal(secondTenth - firstTenth, 1)}입니다. ${fixedDecimal(differenceTenth, 1)}÷${fixedDecimal(secondTenth - firstTenth, 1)}=${length}cm입니다.`);
      }
      if (kind === 4) {
        const boysLast = (int(rng, 2, 5) + int(rng, 0, 3)) * 50, girlsLast = boysLast * 13 / 10;
        const boysNow = boysLast * 11 / 10, girlsNow = girlsLast * 8 / 10, totalNow = boysNow + girlsNow;
        return result(`작년 남학생 수는 여학생 수의 10/13이었습니다. 올해 남학생은 작년보다 0.1배만큼 늘고 여학생은 작년보다 0.2배만큼 줄어 모두 ${totalNow}명이 되었습니다. 올해 남학생과 여학생 수를 차례로 구하세요.${decimalDivisionEvidence("62d-student-change", [totalNow])}`, `${boysNow}명, ${girlsNow}명`, `작년 남학생을 10몫, 여학생을 13몫으로 두면 올해는 11몫과 10.4몫입니다. 전체 ${totalNow}명에 맞추면 올해 남학생 ${boysNow}명, 여학생 ${girlsNow}명입니다.`);
      }
      const heightHundred = pick(rng, [500, 750, 1000, 1250, 1500]), differenceHundred = Math.round(heightHundred * (0.7 - 0.4 * 0.4));
      return result(`같은 높이에서 두 공을 떨어뜨렸습니다. 가 공은 떨어진 높이의 0.7배씩, 나 공은 0.4배씩 튀어 오릅니다. 가 공이 처음 튀어 오른 높이는 나 공이 두 번째로 튀어 오른 높이보다 ${fixedDecimal(differenceHundred, 2)}m 높았습니다. 처음 떨어뜨린 높이를 구하세요.${decimalDivisionEvidence("62d-two-balls", [differenceHundred])}`, `${fixedDecimal(heightHundred, 2)}m`, `처음 높이를 x라 하면 0.7x-0.4×0.4x=0.54x입니다. 0.54x=${fixedDecimal(differenceHundred, 2)}이므로 x=${fixedDecimal(heightHundred, 2)}m입니다.`);
    },
    spaceViewsAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      const heights = Array.from({ length: 2 + (level === 2 ? 1 : 0) }, () => Array.from({ length: 3 }, () => int(rng, 1, 2 + level)));
      const encoded = heights.map(row => row.join(".")).join(";");
      if (kind === 0) {
        const projections = stackProjections(heights);
        const front = projections.front.reduce((sum, value) => sum + value, 0);
        const right = projections.right.reduce((sum, value) => sum + value, 0);
        return result(`높이표대로 쌓은 모양을 앞과 오른쪽에서 보았습니다. 두 그림에 보이는 정사각형 수의 합을 구하세요.${heightMapTable({ title: "바닥 칸별 높이", heights })}${projectionViewsSvg({ heights })}${spaceEvidence("projection-area-sum", [front, right], `data-heights="${encoded}"`)}`, front + right, `앞에서 본 그림은 열별 최고 높이의 합 ${front}칸이고, 오른쪽에서 본 그림은 행별 최고 높이의 합 ${right}칸입니다. 따라서 ${front}+${right}=${front + right}칸입니다.`);
      }
      if (kind === 1) {
        const original = stackProjections(heights);
        const removable = [];
        heights.forEach((row, y) => row.forEach((height, x) => {
          if (!height) return;
          const changed = heights.map(line => [...line]);
          changed[y][x] -= 1;
          if (sameProjection(original, stackProjections(changed))) removable.push([y, x]);
        }));
        const removableExplanation = removable.length
          ? `세 그림이 모두 같은 위치는 ${removable.map(([y, x]) => `${y + 1}행 ${x + 1}열`).join(", ")}의 ${removable.length}곳입니다.`
          : "세 그림이 모두 같은 위치는 없으므로 0곳입니다.";
        return result(`쌓기나무 한 개를 맨 위에서 빼도 위·앞·오른쪽에서 본 세 그림이 모두 바뀌지 않는 바닥 칸은 몇 군데입니까?${heightMapTable({ title: "바닥 칸별 높이", heights })}${projectionViewsSvg({ heights })}${spaceEvidence("projection-safe-removal", [removable.length], `data-heights="${encoded}"`)}`, removable.length, `각 칸의 맨 위 쌓기나무를 하나씩 빼 보아 세 투영을 다시 계산합니다. ${removableExplanation}`);
      }
      if (kind === 2) {
        const maxHeight = 2 + (level > 0 ? 1 : 0);
        const sample = [[maxHeight, 1], [1, maxHeight]];
        const projections = stackProjections(sample);
        const candidates = enumerateHeightMaps({ ...projections, maxHeight });
        return result(`위·앞·오른쪽에서 본 그림이 다음과 같고, 각 칸에는 ${maxHeight}개 이하를 쌓았습니다. 이 세 그림을 모두 만족하는 쌓기 방법은 몇 가지입니까?${projectionViewsSvg({ heights: sample })}${spaceEvidence("projection-candidate-count", [maxHeight, candidates.length], `data-top="${projections.top.join(".")}" data-front="${projections.front.join(".")}" data-right="${projections.right.join(".")}"`)}`, candidates.length, `위에서 본 네 칸에는 각각 1개 이상 ${maxHeight}개 이하를 놓고, 각 행과 열의 최고 높이가 앞·오른쪽 그림과 같도록 전부 확인하면 ${candidates.length}가지입니다.`);
      }
      if (kind === 3) {
        const cells = cellsFromHeights(heights);
        const surface = voxelSurface(cells);
        return result(`한 모서리가 1cm인 정육면체를 높이표대로 빈틈없이 쌓았습니다. 완성된 입체도형의 겉넓이를 구하세요.${heightMapTable({ title: "바닥 칸별 높이", heights })}${isometricStackSvg(heights)}${spaceEvidence("height-map-surface", [surface], `data-heights="${encoded}"`)}`, `${surface}cm²`, `쌓기나무 ${cells.length}개의 면 중 서로 맞닿은 면을 제외하면 바깥에 드러난 면이 ${surface}개입니다. 한 면이 1cm²이므로 겉넓이는 ${surface}cm²입니다.`);
      }
      if (kind === 4) {
        const candidates = [];
        heights.forEach((row, y) => row.forEach((height, x) => {
          if (height > 0) candidates.push([y, x]);
        }));
        const [y, x] = pick(rng, candidates);
        const changed = heights.map(row => [...row]);
        changed[y][x] -= 1;
        const before = projectionSquareCount(stackProjections(heights));
        const after = projectionSquareCount(stackProjections(changed));
        return result(`높이표의 ${y + 1}행 ${x + 1}열 맨 위 쌓기나무 한 개를 뺐습니다. 위·앞·오른쪽에서 본 세 그림의 정사각형 수는 모두 합하여 몇 칸 줄어듭니까?${heightMapTable({ title: "빼기 전 높이표", heights })}${projectionViewsSvg({ heights })}${spaceEvidence("projection-removal-change", [y, x, before, after], `data-heights="${encoded}"`)}`, before - after, `빼기 전 세 그림의 정사각형 수 합은 ${before}칸, 뺀 뒤에는 ${after}칸입니다. 따라서 ${before}-${after}=${before - after}칸 줄어듭니다.`);
      }
      const blue = heights.flat().reduce((sum, height) => sum + Math.ceil(height / 2), 0);
      const total = heights.flat().reduce((sum, height) => sum + height, 0);
      return result(`높이표대로 쌓되 바닥에서 홀수 번째 층은 파란색, 짝수 번째 층은 노란색 쌓기나무를 사용했습니다. 파란색 쌓기나무는 모두 몇 개입니까?${heightMapTable({ title: "바닥 칸별 높이", heights })}${isometricStackSvg(heights, "층별 색 규칙으로 쌓은 정육면체")}${spaceEvidence("layer-color-count", [blue, total], `data-heights="${encoded}"`)}`, blue, `높이가 h인 칸의 파란색 수는 올림(h÷2)입니다. 모든 칸을 더하면 전체 ${total}개 중 파란색은 ${blue}개입니다.`);
    },
    stackingCubeCountAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const size = int(rng, 4 + level, 6 + level);
        const answer = size ** 3 - (size - 2) ** 3;
        return result(`한 모서리에 작은 정육면체가 ${size}개씩 놓이도록 큰 정육면체를 만들고, 겉면 한 겹만 남겨 속을 모두 비웠습니다. 남은 작은 정육면체는 몇 개입니까?${cuboidSvg({ a: size, b: size, c: size })}${spaceEvidence("hollow-cube-count", [size])}`, answer, `전체 ${size ** 3}개에서 안쪽 정육면체 ${(size - 2) ** 3}개를 빼면 ${answer}개입니다.`);
      }
      if (kind === 1) {
        const maxHeight = 2 + (level > 0 ? 1 : 0);
        const sample = [[maxHeight, 1], [1, maxHeight]];
        const projections = stackProjections(sample);
        const candidates = enumerateHeightMaps({ ...projections, maxHeight });
        const totals = candidates.map(map => map.flat().reduce((sum, value) => sum + value, 0));
        const minimum = Math.min(...totals), maximum = Math.max(...totals);
        return result(`위·앞·오른쪽에서 본 그림이 다음과 같고 한 칸에는 ${maxHeight}개 이하를 쌓았습니다. 가능한 쌓기나무 수의 최솟값과 최댓값을 차례로 쓰세요.${projectionViewsSvg({ heights: sample })}${spaceEvidence("projection-min-max", [maxHeight, minimum, maximum, candidates.length], `data-top="${projections.top.join(".")}" data-front="${projections.front.join(".")}" data-right="${projections.right.join(".")}"`)}`, `${minimum}, ${maximum}`, `세 그림을 만족하는 높이표 ${candidates.length}가지를 전부 확인하면 전체 개수의 최솟값은 ${minimum}개, 최댓값은 ${maximum}개입니다. 정답은 ${minimum}, ${maximum}입니다.`);
      }
      if (kind === 2) {
        const size = pick(rng, level === 0 ? [5] : [5, 7]);
        const directions = level === 2 ? ["x", "y", "z"] : level === 1 ? ["x", "y"] : ["y"];
        const cells = centeredTunnelCells({ size, hole: 1, directions });
        const surface = voxelSurface(cells);
        return result(`한 모서리에 작은 정육면체 ${size}개를 쌓은 큰 정육면체의 한가운데에 폭 1칸인 구멍을 ${directions.length}방향으로 끝까지 뚫었습니다. 남은 정육면체 수와 겉넓이를 차례로 구하세요. 작은 정육면체 한 면은 1cm²입니다.${tunnelCubeSvg({ size, hole: 1, directions })}${spaceEvidence("tunnel-count-surface", [size, directions.length, cells.length, surface])}`, `${cells.length}개, ${surface}cm²`, `좌표로 구멍에 해당하는 칸을 한 번씩만 제거하면 ${cells.length}개가 남습니다. 남은 각 조각의 이웃을 조사해 드러난 면을 세면 ${surface}면이므로 겉넓이는 ${surface}cm²입니다. 정답은 ${cells.length}개, ${surface}cm²입니다.`);
      }
      if (kind === 3) {
        const maxHeight = 2 + (level > 0 ? 1 : 0);
        const sample = level === 2 ? [[maxHeight, 1, maxHeight], [1, maxHeight, 1]] : [[maxHeight, 1], [1, maxHeight]];
        const projections = stackProjections(sample);
        const candidates = enumerateHeightMaps({ ...projections, maxHeight });
        return result(`다음 위·앞·오른쪽 그림과 같은 쌓기를 만들려고 합니다. 한 칸에는 ${maxHeight}개 이하를 쌓을 때 가능한 방법은 몇 가지입니까? 회전한 모양도 바닥 칸의 위치가 다르면 다른 방법입니다.${projectionViewsSvg({ heights: sample })}${spaceEvidence("stack-method-count", [maxHeight, candidates.length], `data-top="${projections.top.join(".")}" data-front="${projections.front.join(".")}" data-right="${projections.right.join(".")}"`)}`, candidates.length, `위에서 보이는 칸을 1부터 ${maxHeight}까지 채우고 앞·오른쪽의 최고 높이를 모두 대조하면 ${candidates.length}가지입니다.`);
      }
      if (kind === 4) {
        const size = 3 + level;
        const heights = Array.from({ length: size }, (_, y) => Array.from({ length: size }, (_, x) => Math.max(1, size - Math.max(x, y))));
        const cells = cellsFromHeights(heights);
        const answer = internalCubeCount(cells);
        return result(`계단 모양의 높이표대로 쌓았습니다. 어떤 바깥 면도 보이지 않아 완전히 안쪽에 있는 쌓기나무는 몇 개입니까?${heightMapTable({ title: "계단 모양 높이표", heights })}${isometricStackSvg(heights)}${spaceEvidence("hidden-interior-count", [answer], `data-heights="${heights.map(row => row.join(".")).join(";")}"`)}`, answer, `각 쌓기나무의 위·아래·앞·뒤·왼쪽·오른쪽 여섯 이웃을 확인합니다. 여섯 면이 모두 다른 쌓기나무와 맞닿은 조각은 ${answer}개입니다.`);
      }
      const cells = 4 + level;
      const maxHeight = 3 + (level > 0 ? 1 : 0);
      const total = cells + int(rng, 2, Math.min(6 + level * 2, cells * (maxHeight - 1)));
      const methods = boundedCompositionCount(cells, total, maxHeight);
      const footprint = [Array(cells).fill(1)];
      return result(`위에서 보이는 바닥 칸이 일렬로 ${cells}칸이고 전체 쌓기나무가 ${total}개입니다. 각 칸에 1개 이상 ${maxHeight}개 이하를 쌓는 방법은 몇 가지입니까?${heightMapTable({ title: "위에서 본 바닥 모양", heights: footprint })}${spaceEvidence("footprint-total-methods", [cells, total, maxHeight, methods])}`, methods, `각 칸의 높이를 1부터 ${maxHeight}까지 두고 합이 ${total}이 되는 순서 있는 경우를 모두 세면 ${methods}가지입니다.`);
    },
    paintedStackingCubesAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const size = int(rng, 4 + level, 6 + level);
        const answer = (size - 2) ** 3;
        return result(`한 모서리에 작은 정육면체가 ${size}개씩 놓인 큰 정육면체의 바깥을 모두 색칠한 뒤 낱개로 나누었습니다. 색칠된 면이 하나도 없는 작은 정육면체는 몇 개입니까?${cuboidSvg({ a: size, b: size, c: size })}${spaceEvidence("painted-solid-interior", [size])}`, answer, `색칠되지 않은 조각은 겉 한 층을 뺀 안쪽 (${size - 2})×(${size - 2})×(${size - 2})개이므로 ${answer}개입니다.`);
      }
      if (kind === 1) {
        const heights = [[2 + level, 1, 2], [1, 2 + level, 1], [2, 1, 2 + level]];
        const cells = cellsFromHeights(heights);
        const histogram = paintedFaceHistogram(cells);
        const choices = histogram.map((count, faces) => ({ count, faces })).filter(item => item.faces >= 1 && item.faces <= 5 && item.count > 0);
        const selected = pick(rng, choices);
        return result(`높이표대로 쌓은 뒤 바닥에 닿은 면을 포함하여 바깥에 드러난 모든 면을 색칠했습니다. 색칠된 면이 정확히 ${selected.faces}개인 쌓기나무는 몇 개입니까?${heightMapTable({ title: "바닥 칸별 높이", heights })}${isometricStackSvg(heights)}${spaceEvidence("painted-height-histogram", [selected.faces, selected.count], `data-heights="${heights.map(row => row.join(".")).join(";")}"`)}`, selected.count, `각 조각의 여섯 이웃 칸을 조사해 비어 있는 방향을 색칠된 면으로 셉니다. 정확히 ${selected.faces}면이 색칠된 조각은 ${selected.count}개입니다.`);
      }
      if (kind === 2) {
        const size = 3 + level;
        const heights = Array.from({ length: size }, (_, y) => Array.from({ length: size }, (_, x) => Math.max(1, Math.ceil(size / 2 - Math.max(Math.abs(x - (size - 1) / 2), Math.abs(y - (size - 1) / 2))))));
        const cells = cellsFromHeights(heights);
        const histogram = paintedFaceHistogram(cells);
        const choices = histogram.map((count, faces) => ({ count, faces })).filter(item => item.faces >= 2 && item.faces <= 5 && item.count > 0);
        const selected = pick(rng, choices);
        return result(`층이 올라갈수록 가운데로 좁아지는 높이표대로 쌓고 바닥을 포함한 바깥 면을 모두 색칠했습니다. 정확히 ${selected.faces}면이 색칠된 조각은 몇 개입니까?${heightMapTable({ title: "층별 쌓기 높이표", heights })}${isometricStackSvg(heights)}${spaceEvidence("painted-layer-histogram", [selected.faces, selected.count], `data-heights="${heights.map(row => row.join(".")).join(";")}"`)}`, selected.count, `모든 조각에서 이웃이 없는 방향을 세어 분류하면 ${selected.faces}면이 색칠된 조각은 ${selected.count}개입니다.`);
      }
      if (kind === 3) {
        const side = 2 + level;
        const heights = [[2 + level, 1, 2], [1, 3, 1], [2, 1, 2 + level]];
        const surface = voxelSurface(cellsFromHeights(heights));
        const answer = surface * side * side;
        return result(`한 모서리 ${side}cm인 정육면체를 높이표대로 쌓고 바닥에 닿은 면을 포함한 바깥 면을 모두 색칠했습니다. 색칠한 넓이는 모두 몇 cm²입니까?${heightMapTable({ title: "바닥 칸별 높이", heights })}${isometricStackSvg(heights)}${spaceEvidence("painted-height-area", [side, surface], `data-heights="${heights.map(row => row.join(".")).join(";")}"`)}`, `${answer}cm²`, `드러난 면은 ${surface}개이고 한 면의 넓이는 ${side}²=${side * side}cm²입니다. 따라서 ${surface}×${side * side}=${answer}cm²입니다.`);
      }
      if (kind === 4) {
        const a = int(rng, 4 + level, 6 + level), b = int(rng, 4, 6 + level), c = int(rng, 4, 5 + level);
        const answer = 4 * ((a - 2) + (b - 2) + (c - 2));
        return result(`가로 ${a}개, 세로 ${b}개, 높이 ${c}개의 작은 정육면체로 직육면체를 만들고 바깥을 모두 색칠했습니다. 색칠된 면이 정확히 2개인 작은 정육면체는 몇 개입니까?${cuboidSvg({ a, b, c })}${spaceEvidence("painted-cuboid-two-faces", [a, b, c])}`, answer, `모서리마다 꼭짓점 조각을 뺀 조각을 셉니다. 4×[(${a}-2)+(${b}-2)+(${c}-2)]=${answer}개입니다.`);
      }
      const heights = [[3, 2 + level, 1], [1, 3, 2], [2 + level, 1, 3]];
      const cells = cellsFromHeights(heights);
      const histogram = paintedFaceHistogram(cells);
      const choices = histogram.map((count, faces) => ({ count, faces })).filter(item => item.faces >= 1 && item.faces <= 5 && item.count > 0);
      const selected = pick(rng, choices);
      return result(`복합 높이표대로 쌓은 뒤 바닥을 포함한 바깥 면을 모두 색칠했습니다. 색칠된 면이 정확히 ${selected.faces}개인 조각의 수를 구하세요.${heightMapTable({ title: "복합 쌓기 높이표", heights })}${isometricStackSvg(heights)}${spaceEvidence("painted-composite-histogram", [selected.faces, selected.count], `data-heights="${heights.map(row => row.join(".")).join(";")}"`)}`, selected.count, `좌표별로 여섯 방향의 이웃 유무를 검사하면 ${selected.faces}면이 색칠된 조각은 ${selected.count}개입니다.`);
    },
    spaceCuttingAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const a = int(rng, 4 + level, 7 + level), b = int(rng, 3 + level, 6 + level), c = int(rng, 4, 7 + level);
        const layer = int(rng, 2, c - 1);
        const answer = a * b;
        return result(`가로 ${a}칸, 세로 ${b}칸, 높이 ${c}칸인 직육면체 쌓기의 바닥에서 ${layer}번째 층 정육면체의 중심을 모두 지나는 수평 절단면을 만들었습니다. 절단면이 지나는 작은 정육면체는 몇 개입니까?${cuboidSvg({ a, b, c, labels: ["수평 절단면", "", ""] })}${spaceEvidence("single-layer-cut", [a, b, c, layer])}`, answer, `한 층에는 가로 ${a}개, 세로 ${b}개가 있으므로 절단면이 지나는 조각은 ${a}×${b}=${answer}개입니다.`);
      }
      if (kind === 1) {
        const size = pick(rng, level === 0 ? [5] : [5, 7]);
        const answer = 3 * size * size - 3 * size + 1;
        return result(`한 모서리에 작은 정육면체가 ${size}개인 큰 정육면체에서 서로 수직인 세 중앙 절단면이 작은 정육면체의 중심을 지나게 했습니다. 세 절단면 중 하나 이상이 지나는 작은 정육면체는 몇 개입니까?${cuboidSvg({ a: size, b: size, c: size, labels: ["중앙 절단", "중앙 절단", "중앙 절단"] })}${spaceEvidence("triple-center-cut", [size])}`, answer, `각 절단면은 ${size * size}개를 지나지만 두 절단면의 공통 줄 ${size}개가 세 번 겹쳐 세 줄을 빼고, 중앙 한 조각을 다시 더합니다. 3×${size * size}-3×${size}+1=${answer}개입니다.`);
      }
      if (kind === 2) {
        const a = int(rng, 5 + level, 8 + level), b = int(rng, 3, 5 + level), c = int(rng, 3, 5 + level);
        const cuts = int(rng, 2, Math.min(a - 1, 3 + level));
        const answer = cuts * b * c;
        return result(`가로 ${a}칸, 세로 ${b}칸, 높이 ${c}칸인 직육면체 쌓기에서 서로 다른 ${cuts}개 세로층의 정육면체 중심을 지나는 평행한 절단면을 만들었습니다. 절단면이 지나는 작은 정육면체는 모두 몇 개입니까?${cuboidSvg({ a, b, c, labels: [`평행 절단 ${cuts}개`, "", ""] })}${spaceEvidence("parallel-layer-cuts", [a, b, c, cuts])}`, answer, `절단면 하나는 세로 ${b}×높이 ${c}=${b * c}개를 지나고 서로 다른 층이라 겹치지 않습니다. ${cuts}×${b * c}=${answer}개입니다.`);
      }
      if (kind === 3) {
        const bases = [
          [[0, 0, 0], [1, 0, 0], [2, 0, 0]],
          [[0, 0, 0], [1, 0, 0], [0, 1, 0]],
          [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]]
        ];
        const base = bases[level];
        const answer = addedCubeShapeCount(base);
        return result(`그림의 쌓기나무에 한 개를 면끼리 붙여 새로운 입체를 만듭니다. 돌려서 같은 모양은 하나로 셀 때 서로 다른 모양은 몇 가지입니까?${polycubeSvg(base)}${spaceEvidence("add-one-polycube", [level, answer], `data-base-cells="${base.map(cell => cell.join(".")).join(";")}"`)}`, answer, `붙일 수 있는 모든 빈 이웃 칸을 만든 뒤 24가지 공간 회전을 적용해 같은 모양을 하나로 묶으면 ${answer}가지입니다.`);
      }
      if (kind === 4) {
        const a = int(rng, 3 + level, 5 + level), b = int(rng, 3, 5 + level), c = int(rng, 3, 5 + level);
        let removed = 0;
        for (let x = 0; x < a; x += 1) for (let y = 0; y < b; y += 1) for (let z = 0; z < c; z += 1) if ((x + y + z) % 2 === 0) removed += 1;
        const answer = a * b * c - removed;
        return result(`가로 ${a}칸, 세로 ${b}칸, 높이 ${c}칸인 직육면체에서 좌표의 합이 짝수인 칸을 파란색으로 정했습니다. 파란색 조각을 모두 빼면 몇 개가 남습니까? 바닥의 왼쪽 앞 아래 칸 좌표를 (0,0,0)으로 합니다.${cuboidSvg({ a, b, c, labels: ["교차 색 규칙", "", ""] })}${spaceEvidence("parity-removal", [a, b, c, removed])}`, answer, `모든 좌표 (x,y,z)를 확인해 x+y+z가 짝수인 ${removed}개를 뺍니다. ${a * b * c}-${removed}=${answer}개가 남습니다.`);
      }
      const heights = [[2 + level, 3, 1], [1, 2 + level, 2], [2, 1, 3]];
      const removals = [[0, 1], [2, 2]].slice(0, 1 + (level > 0 ? 1 : 0));
      const changed = heights.map(row => [...row]);
      removals.forEach(([y, x]) => { changed[y][x] -= 1; });
      const front = stackProjections(changed).front.reduce((sum, value) => sum + value, 0);
      return result(`높이표에서 ${removals.map(([y, x]) => `${y + 1}행 ${x + 1}열`).join(", ")}의 맨 위 쌓기나무를 한 개씩 뺐습니다. 그 뒤 앞에서 본 그림의 정사각형 수를 구하세요.${heightMapTable({ title: "빼기 전 높이표", heights })}${projectionViewsSvg({ heights: changed, title: "빼고 난 뒤 세 방향에서 본 그림" })}${spaceEvidence("remove-then-front", [front], `data-heights-before="${heights.map(row => row.join(".")).join(";")}" data-heights-after="${changed.map(row => row.join(".")).join(";")}"`)}`, front, `지정한 칸의 높이를 1씩 줄인 뒤 열별 최고 높이를 더하면 앞에서 본 정사각형은 ${front}칸입니다.`);
    },
    averageCalculationAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const mean = int(rng, 35, 75 + level * 8);
        const offsets = shuffle(rng, [-8, -4, 0, 4, 8]);
        const data = offsets.map(offset => mean + offset);
        return result(`${data.join(", ")}의 평균을 구하세요.${averageProbabilityEvidence("plain-mean", data)}`, mean, `합은 ${mean * data.length}이고 자료는 ${data.length}개이므로 평균은 ${mean}입니다.`);
      }
      if (kind === 1) {
        const meanA = int(rng, 65, 82 + level * 4);
        const meanB = meanA + int(rng, 2, 6);
        const known = [int(rng, 55, 90), int(rng, 55, 90), int(rng, 55, 90), int(rng, 55, 90)];
        const missing = 5 * meanA - known.reduce((a, b) => a + b, 0);
        if (missing < 40 || missing > 100) return generators.averageCalculationAdvanced({ rng, level, variant });
        return result(`가 학생의 5회 평균은 ${meanA}점이고, 나 학생의 5회 평균은 ${meanB}점입니다. 가 학생의 점수가 ${known.join(", ")}, □일 때 □를 구하세요.${averageProbabilityEvidence("missing-score", [meanA, ...known])}`, missing, `가 학생의 총점은 5×${meanA}=${5 * meanA}점입니다. 알려진 점수의 합을 빼면 ${missing}점입니다.`);
      }
      if (kind === 2) {
        const count = int(rng, 6, 10 + level);
        const beforeMean = int(rng, 35, 70);
        const oldValue = int(rng, 20, 75);
        const newValue = int(rng, oldValue + 5, 95);
        const afterMean = beforeMean + (newValue - oldValue) / count;
        return result(`평균이 ${beforeMean}인 ${count}개의 수에서 한 수를 ${newValue}로 바꾸었더니 평균이 ${decimal(afterMean, 3)}가 되었습니다. 바꾸기 전 수를 구하세요.${averageProbabilityEvidence("replaced-value", [count, beforeMean, newValue, Math.round(afterMean * 1000)])}`, oldValue, `전체 합의 증가량은 ${count}×(${decimal(afterMean, 3)}-${beforeMean})=${newValue - oldValue}입니다. 새 수 ${newValue}에서 증가량을 빼면 ${oldValue}입니다.`);
      }
      if (kind === 3) {
        const scores = [40, 60, 80, 100];
        const counts = [int(rng, 2, 5), int(rng, 3, 7), int(rng, 4, 8), int(rng, 2, 5)];
        const hiddenIndex = int(rng, 0, 3);
        const totalCount = counts.reduce((a, b) => a + b, 0);
        const totalScore = counts.reduce((sum, count, index) => sum + count * scores[index], 0);
        const mean = totalScore / totalCount;
        const candidates = Array.from({ length: 30 }, (_, index) => index + 1).filter(candidate => {
          const next = [...counts];
          next[hiddenIndex] = candidate;
          return decimal(next.reduce((sum, count, index) => sum + count * scores[index], 0) / next.reduce((a, b) => a + b, 0), 2) === decimal(mean, 2);
        });
        if (candidates.length !== 1) return generators.averageCalculationAdvanced({ rng, level, variant });
        const shown = counts.map((count, index) => index === hiddenIndex ? "□" : count);
        return result(`점수별 학생 수를 조사한 표입니다. 전체 평균이 ${decimal(mean, 2)}점일 때 □에 알맞은 학생 수를 구하세요.${valueTable(scores.map(v => `${v}점`), shown)}${averageProbabilityEvidence("frequency-missing", [...scores, ...counts, hiddenIndex])}`, counts[hiddenIndex], `□를 학생 수로 두고 (점수×학생 수)의 합을 전체 학생 수로 나눈 값이 ${decimal(mean, 2)}가 되도록 계산하면 ${counts[hiddenIndex]}명입니다.`);
      }
      if (kind === 4) {
        const a = int(rng, 6, 10 + level), b = int(rng, 6, 10 + level), overlap = int(rng, 2, Math.min(a, b) - 2);
        const meanA = int(rng, 40, 70), meanB = int(rng, 40, 70), meanOverlap = int(rng, 35, 75);
        const answer = (a * meanA + b * meanB - overlap * meanOverlap) / (a + b - overlap);
        return result(`A모둠 ${a}명의 평균은 ${meanA}, B모둠 ${b}명의 평균은 ${meanB}입니다. 두 모둠에 모두 포함된 ${overlap}명의 평균이 ${meanOverlap}일 때, 중복 없이 합친 학생들의 평균을 구하세요.${averageProbabilityEvidence("overlap-mean", [a, meanA, b, meanB, overlap, meanOverlap])}`, decimal(answer, 3), `두 총합을 더하고 중복된 총합을 한 번 빼면 됩니다. 이를 ${a + b - overlap}명으로 나누면 ${decimal(answer, 3)}입니다.`);
      }
      const count = int(rng, 5, 9 + level), difference = int(rng, 2, 6), first = int(rng, 20, 50);
      const mean = first + difference * (count - 1) / 2;
      return result(`${count}개의 수가 작은 수부터 일정하게 ${difference}씩 커집니다. 평균이 ${decimal(mean, 1)}일 때 가장 작은 수를 구하세요.${averageProbabilityEvidence("sequence-first", [count, difference, Math.round(mean * 10)])}`, first, `등차로 늘어나는 자료의 평균은 가운데 값입니다. 평균에서 전체 증가량의 절반 ${difference * (count - 1) / 2}을 빼면 ${first}입니다.`);
    },
    averageApplicationAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const boys = int(rng, 12, 20 + level * 3), girls = int(rng, 12, 20 + level * 3);
        const boysMean = int(rng, 70, 88), girlsMean = int(rng, 65, 85);
        const totalMean = (boys * boysMean + girls * girlsMean) / (boys + girls);
        return result(`남학생 ${boys}명의 평균은 ${boysMean}점이고, 전체 ${boys + girls}명의 평균은 ${decimal(totalMean, 2)}점입니다. 여학생 ${girls}명의 평균을 구하세요.${averageProbabilityEvidence("group-mean", [boys, boysMean, girls, Math.round(totalMean * 100)])}`, girlsMean, `전체 총점에서 남학생 총점을 빼고 ${girls}명으로 나누면 ${girlsMean}점입니다.`);
      }
      if (kind === 1) {
        const people = int(rng, 12, 24), added = int(rng, 3, 8);
        const total = lcm(people, people + added) * int(rng, 300, 700);
        const before = total / people, after = total / (people + added), decrease = before - after;
        return result(`${people}명이 같은 금액을 내어 물건을 빌리려 했습니다. ${added}명이 더 참여하자 한 사람당 ${decrease.toLocaleString()}원씩 덜 내게 되었습니다. 전체 대여료를 구하세요.${averageProbabilityEvidence("shared-cost", [people, added, decrease])}`, total, `처음 1인당 금액과 나중 금액의 차가 ${decrease}원이 되도록 식을 세우면 전체 금액은 ${total.toLocaleString()}원입니다.`);
      }
      if (kind === 2) {
        const workers1 = int(rng, 3, 7), hours1 = int(rng, 4, 8), workers2 = int(rng, 5, 10), hours2 = int(rng, 3, 7);
        const unit = int(rng, 2, 6 + level);
        const total = unit * (workers1 * hours1 + workers2 * hours2);
        return result(`같은 빠르기로 일하는 사람들이 넓이 ${total}m²의 밭을 모두 작업했습니다. 첫날 ${workers1}명이 ${hours1}시간, 둘째 날 ${workers2}명이 ${hours2}시간 일했습니다. 한 사람이 한 시간 동안 작업한 평균 넓이를 구하세요.${averageProbabilityEvidence("work-rate", [total, workers1, hours1, workers2, hours2])}`, unit, `전체 사람·시간은 ${workers1 * hours1}+${workers2 * hours2}=${workers1 * hours1 + workers2 * hours2}이므로 ${total}을 나누면 ${unit}m²입니다.`);
      }
      if (kind === 3) {
        const count = int(rng, 5, 8 + level), mean = int(rng, 20, 45), known = Array.from({ length: count - 1 }, () => int(rng, 12, 50));
        const missing = count * mean - known.reduce((a, b) => a + b, 0);
        if (missing <= 0 || missing > 80) return generators.averageApplicationAdvanced({ rng, level, variant });
        return result(`${count}개 과수원의 평균 수확량은 ${mean}t입니다. 그중 ${count - 1}곳의 수확량이 ${known.join(", ")}t일 때 나머지 한 곳의 수확량을 구하세요.${averageProbabilityEvidence("missing-harvest", [count, mean, ...known])}`, missing, `전체 수확량 ${count * mean}t에서 알려진 수확량의 합을 빼면 ${missing}t입니다.`);
      }
      if (kind === 4) {
        const scores = [10, 20, 30, 40];
        const counts = [int(rng, 1, 5), int(rng, 2, 7), int(rng, 2, 7), int(rng, 1, 5)];
        const hidden = int(rng, 0, 3), total = counts.reduce((a, b) => a + b, 0), mean = counts.reduce((sum, c, i) => sum + c * scores[i], 0) / total;
        const candidates = Array.from({ length: 30 }, (_, index) => index + 1).filter(candidate => {
          const next = [...counts];
          next[hidden] = candidate;
          return decimal(next.reduce((sum, count, index) => sum + count * scores[index], 0) / next.reduce((a, b) => a + b, 0), 2) === decimal(mean, 2);
        });
        if (candidates.length !== 1) return generators.averageApplicationAdvanced({ rng, level, variant });
        return result(`문항별 배점 합계와 학생 수를 나타낸 표입니다. 전체 ${total}명의 평균이 ${decimal(mean, 2)}점일 때 □에 알맞은 학생 수를 구하세요.${valueTable(scores.map(v => `${v}점`), counts.map((c, i) => i === hidden ? "□" : c))}${averageProbabilityEvidence("weighted-frequency", [...scores, ...counts, hidden])}`, counts[hidden], `가중합을 이용해 평균식을 세우면 □는 ${counts[hidden]}명입니다.`);
      }
      const days = int(rng, 7, 12), increase = int(rng, 20, 80), first = int(rng, 600, 1200), mean = first + increase * (days - 1) / 2;
      return result(`${days}일 동안 매일 전날보다 ${increase}m씩 더 달렸더니 하루 평균이 ${decimal(mean, 1)}m였습니다. 첫날 달린 거리를 구하세요.${averageProbabilityEvidence("daily-first", [days, increase, Math.round(mean * 10)])}`, first, `일정하게 늘어난 자료의 평균에서 증가량의 절반을 빼면 ${first}m입니다.`);
    },
    eventCountAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const x = int(rng, 2, 4 + level), y = int(rng, 2, 4 + level), dx = int(rng, 1, x), dy = int(rng, 1, y);
        const answer = combination(dx + dy, dx) * combination(x - dx + y - dy, x - dx);
        return result(`가로 ${x}칸, 세로 ${y}칸인 격자에서 왼쪽 아래에서 오른쪽 위까지 오른쪽 또는 위로만 이동합니다. 가로 ${dx}칸, 세로 ${dy}칸 이동한 지점을 반드시 지나는 최단 경로는 몇 가지입니까?${averageProbabilityEvidence("grid-via", [x, y, dx, dy])}`, answer, `지정점까지 ${combination(dx + dy, dx)}가지, 그 점부터 도착점까지 ${combination(x - dx + y - dy, x - dx)}가지이므로 곱하면 ${answer}가지입니다.`);
      }
      if (kind === 1) {
        const limit = int(rng, 60, 120 + level * 20), a = pick(rng, [2, 3, 4, 5]), b = pick(rng, [3, 5, 6, 7].filter(v => v !== a));
        const answer = Math.floor(limit / a) + Math.floor(limit / b) - Math.floor(limit / lcm(a, b));
        return result(`1부터 ${limit}까지의 자연수 중 ${a}의 배수 또는 ${b}의 배수인 수는 몇 개입니까?${averageProbabilityEvidence("multiple-union", [limit, a, b])}`, answer, `각 배수의 개수를 더하고 공배수를 한 번 빼면 ${answer}개입니다.`);
      }
      if (kind === 2) {
        const people = int(rng, 5, 7 + level);
        const answer = 2 * factorial(people - 1);
        return result(`서로 다른 ${people}명을 한 줄로 세울 때, 특정한 두 사람이 서로 이웃하는 경우는 몇 가지입니까?${averageProbabilityEvidence("adjacent-pair", [people])}`, answer, `두 사람을 한 묶음으로 보면 ${people - 1}개를 배열하는 ${(people - 1)}!가지이고 묶음 안 순서가 2가지이므로 ${answer}가지입니다.`);
      }
      if (kind === 3) {
        const teams = int(rng, 5, 8 + level);
        return result(`${teams}개 팀이 다른 모든 팀과 한 번씩 경기할 때 전체 경기 수를 구하세요.${averageProbabilityEvidence("round-robin", [teams])}`, combination(teams, 2), `경기는 두 팀을 고르는 경우와 같으므로 ${teams}C2=${combination(teams, 2)}번입니다.`);
      }
      if (kind === 4) {
        const points = int(rng, 6, 9 + level);
        const answer = combination(points, 2) + combination(points, 3);
        return result(`원 위에 서로 다른 점 ${points}개가 있습니다. 두 점을 이은 선분의 수와 세 점을 이은 삼각형의 수를 모두 더하면 몇 개입니까?${averageProbabilityEvidence("circle-segments-triangles", [points])}`, answer, `선분은 ${points}C2=${combination(points, 2)}개, 삼각형은 ${points}C3=${combination(points, 3)}개이므로 모두 ${answer}개입니다.`);
      }
      const differences = level === 0 ? [1, 2] : level === 1 ? [2, 3] : [2, 3, 4];
      let answer = 0;
      for (let a = 1; a <= 6; a += 1) for (let b = 1; b <= 6; b += 1) if (differences.includes(Math.abs(a - b))) answer += 1;
      return result(`서로 다른 두 주사위를 동시에 던질 때 나온 눈의 차가 ${differences.join(" 또는 ")}인 경우는 몇 가지입니까?${averageProbabilityEvidence("dice-difference", differences)}`, answer, `순서쌍을 모두 세면 조건을 만족하는 경우는 ${answer}가지입니다.`);
    },
    eventProbabilityAdvanced({ rng, level, variant = 0 }) {
      const kind = variant % 6;
      if (kind === 0) {
        const redA = int(rng, 2, 5), blueA = int(rng, 2, 5), redB = int(rng, 2, 5), blueB = int(rng, 2, 5);
        const numerator = redA * blueB + blueA * redB, denominator = (redA + blueA) * (redB + blueB);
        return result(`가 주머니에는 빨간 공 ${redA}개와 파란 공 ${blueA}개, 나 주머니에는 빨간 공 ${redB}개와 파란 공 ${blueB}개가 있습니다. 각 주머니에서 한 개씩 꺼낼 때 서로 다른 색일 가능성을 분수로 나타내세요.${averageProbabilityEvidence("different-colors", [redA, blueA, redB, blueB])}`, fraction(numerator, denominator), `빨강-파랑 또는 파랑-빨강인 경우를 더하면 ${fraction(numerator, denominator)}입니다.`);
      }
      if (kind === 1) {
        const people = int(rng, 5, 8 + level);
        return result(`서로 다른 ${people}명 중 한 명을 정해 두었습니다. 모두를 임의로 한 줄로 세울 때 정해 둔 사람이 맨 앞에 설 가능성을 분수로 나타내세요.${averageProbabilityEvidence("fixed-front", [people])}`, fraction(1, people), `모든 사람은 맨 앞에 설 가능성이 같으므로 ${fraction(1, people)}입니다.`);
      }
      if (kind === 2) {
        const shots = int(rng, 4, 6 + level), atLeast = int(rng, 2, shots - 1);
        const favorable = Array.from({ length: shots - atLeast + 1 }, (_, i) => combination(shots, atLeast + i)).reduce((a, b) => a + b, 0);
        return result(`한 번 명중할 가능성이 1/2인 사수가 독립적으로 ${shots}발을 쏩니다. ${atLeast}발 이상 명중할 가능성을 분수로 나타내세요.${averageProbabilityEvidence("at-least-hits", [shots, atLeast])}`, fraction(favorable, 2 ** shots), `${shots}번의 성공·실패 배열 ${2 ** shots}가지 중 ${atLeast}번 이상 성공하는 배열을 조합으로 세면 ${favorable}가지이므로 ${fraction(favorable, 2 ** shots)}입니다.`);
      }
      if (kind === 3) {
        const choices = int(rng, 3, 5), people = int(rng, 3, Math.min(choices, 4 + level));
        const allDistinct = factorial(choices) / factorial(choices - people);
        const numerator = choices ** people - allDistinct;
        return result(`${people}명이 각각 ${choices}개의 번호 중 하나를 같은 가능성으로 고릅니다. 적어도 두 명이 같은 번호를 고를 가능성을 분수로 나타내세요.${averageProbabilityEvidence("same-choice", [people, choices])}`, fraction(numerator, choices ** people), `전체 ${choices ** people}가지에서 모두 다른 번호를 고르는 ${allDistinct}가지를 빼면 되므로 ${fraction(numerator, choices ** people)}입니다.`);
      }
      if (kind === 4) {
        const p1n = int(rng, 1, 4), p1d = p1n + int(rng, 2, 5), p2n = int(rng, 1, 4), p2d = p2n + int(rng, 2, 5);
        const numerator = p1d * p2d - (p1d - p1n) * (p2d - p2n), denominator = p1d * p2d;
        return result(`서로 독립인 두 사건 A, B가 일어날 가능성이 각각 ${p1n}/${p1d}, ${p2n}/${p2d}입니다. 적어도 하나가 일어날 가능성을 분수로 나타내세요.${averageProbabilityEvidence("at-least-one", [p1n, p1d, p2n, p2d])}`, fraction(numerator, denominator), `둘 다 일어나지 않을 가능성을 1에서 빼면 ${fraction(numerator, denominator)}입니다.`);
      }
      const total = int(rng, 8, 14 + level * 2), winners = int(rng, 3, Math.min(6, total - 2));
      return result(`${total}개의 제비 중 당첨 제비가 ${winners}개 있습니다. 한 번에 하나씩 되돌려 넣지 않고 2개를 뽑을 때 모두 당첨일 가능성을 분수로 나타내세요.${averageProbabilityEvidence("two-winners", [total, winners])}`, fraction(combination(winners, 2), combination(total, 2)), `전체 2개 조합 ${combination(total, 2)}가지 중 당첨 2개 조합은 ${combination(winners, 2)}가지이므로 ${fraction(combination(winners, 2), combination(total, 2))}입니다.`);
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
    continuedRatioAdvanced({ rng, level }) {
      const [first, middle, last] = pick(rng, [[3, 4, 5], [4, 7, 3], [5, 6, 7], [7, 5, 8], [8, 9, 5]]);
      const leftScale = int(rng, 2, 4 + level), rightScale = int(rng, 2, 5 + level);
      const a = first * leftScale, b = middle * leftScale, c = middle * rightScale, d = last * rightScale;
      const answer = `${first}:${middle}:${last}`;
      return result(`세 수 ㄱ, ㄴ, ㄷ에 대하여 ㄱ:ㄴ=${a}:${b}, ㄴ:ㄷ=${c}:${d}입니다. ㄱ:ㄴ:ㄷ을 가장 간단한 자연수의 연비로 나타내세요.${circleSolidEvidence("continued-ratio", [a, b, c, d, first, middle, last])}`, answer, `두 비의 공통 항 ㄴ을 같게 맞추면 ㄱ:ㄴ:ㄷ=${answer}입니다.`);
    },
    complexCircleAreaOneAdvanced({ rng, level }) {
      const kind = int(rng, 0, 2), pi = pick(rng, [3, 3.14]);
      if (kind === 0) {
        const radius = int(rng, 4, 7 + level), side = radius * 2;
        const answer = decimal(side * side - pi * radius * radius, 2);
        return result(`한 변이 ${side}cm인 정사각형 안에 원을 꼭 맞게 그렸습니다. 원주율을 ${pi}로 할 때 정사각형 안에서 원 밖에 있는 부분의 넓이를 구하세요.${circleCompositeSvg({ kind: "square-circle", a: side })}${circleSolidEvidence("square-minus-circle", [side, radius, pi])}`, answer, `정사각형 넓이 ${side}²에서 원의 넓이 ${pi}×${radius}²을 빼면 ${answer}cm²입니다.`);
      }
      if (kind === 1) {
        const inner = int(rng, 2, 4 + level), outer = inner + int(rng, 2, 4);
        const answer = decimal(pi * (outer * outer - inner * inner), 2);
        return result(`반지름이 ${outer}cm, ${inner}cm인 두 동심원 사이의 색칠한 부분의 넓이를 구하세요. (원주율: ${pi})${circleCompositeSvg({ kind: "ring", a: outer, b: inner })}${circleSolidEvidence("annulus", [outer, inner, pi])}`, answer, `큰 원에서 작은 원을 빼면 ${pi}×(${outer}²-${inner}²)=${answer}cm²입니다.`);
      }
      const radius = int(rng, 2, 4 + level), count = 3;
      const answer = decimal((count * 2 * radius) * (2 * radius) - count * pi * radius * radius, 2);
      return result(`반지름이 ${radius}cm인 같은 원 ${count}개를 직사각형 안에 꼭 맞게 나란히 놓았습니다. 직사각형 안에서 원 밖에 있는 부분의 넓이를 구하세요. (원주율: ${pi})${circleCompositeSvg({ kind: "rectangle-circles", a: radius, count })}${circleSolidEvidence("rectangle-minus-circles", [radius, count, pi])}`, answer, `직사각형 넓이 ${count * 2 * radius}×${2 * radius}에서 원 ${count}개의 넓이를 빼면 ${answer}cm²입니다.`);
    },
    complexCircleAreaTwoAdvanced({ rng, level }) {
      const kind = int(rng, 0, 2), pi = pick(rng, [3, 3.14]);
      if (kind === 0) {
        const radius = int(rng, 4, 8 + level), angle = 90, segmentPi = 3;
        const answer = decimal(segmentPi * radius * radius / 4 - radius * radius / 2, 2);
        return result(`반지름이 ${radius}cm이고 중심각이 ${angle}°인 부채꼴에서 두 반지름을 이은 직각삼각형을 뺐습니다. 남은 활꼴의 넓이를 구하세요. (원주율: ${segmentPi})${circleCompositeSvg({ kind: "segment", a: radius, b: angle })}${circleSolidEvidence("quarter-segment", [radius, angle, segmentPi])}`, answer, `부채꼴 ${segmentPi}×${radius}²÷4에서 직각삼각형 ${radius}×${radius}÷2를 빼면 ${answer}cm²입니다.`);
      }
      if (kind === 1) {
        const inner = int(rng, 2, 4 + level), outer = inner + int(rng, 2, 4), angle = 90, sectorPi = 3;
        const answer = decimal(sectorPi * (outer * outer - inner * inner) * angle / 360, 2);
        return result(`중심각이 ${angle}°이고 반지름이 각각 ${outer}cm, ${inner}cm인 두 부채꼴 사이의 넓이를 구하세요. (원주율: ${sectorPi})${circleCompositeSvg({ kind: "sector-difference", a: outer, b: inner })}${circleSolidEvidence("annular-sector", [outer, inner, angle, sectorPi])}`, answer, `두 원 넓이의 차에 ${angle}/360을 곱하면 ${answer}cm²입니다.`);
      }
      const radius = int(rng, 3, 6 + level), count = 3;
      const outside = (count * 2 * radius) * (2 * radius) - count * pi * radius * radius;
      const answer = decimal(count * pi * radius * radius - outside, 2);
      return result(`반지름이 ${radius}cm인 원 ${count}개가 꼭 맞게 들어간 직사각형이 있습니다. 원 ${count}개의 넓이 합과 원 밖 직사각형 부분의 넓이의 차를 구하세요. (원주율: ${pi})${circleCompositeSvg({ kind: "rectangle-circles", a: radius, count })}${circleSolidEvidence("circle-outside-difference", [radius, count, pi])}`, answer, `원 넓이의 합에서 직사각형 안의 나머지 넓이를 빼면 ${answer}cm²입니다.`);
    },
    locusLengthAreaAdvanced({ rng, level }) {
      const kind = int(rng, 0, 2), pi = pick(rng, [3, 3.14]);
      if (kind === 0) {
        const width = int(rng, 8, 13 + level), height = int(rng, 5, 9 + level), radius = int(rng, 1, 3);
        const answer = decimal(2 * (width + height) + 2 * pi * radius, 2);
        return result(`반지름이 ${radius}cm인 원이 가로 ${width}cm, 세로 ${height}cm인 직사각형의 바깥 변을 따라 미끄러지지 않고 한 바퀴 돕니다. 원의 중심이 움직인 거리를 구하세요. (원주율: ${pi})${locusDiagramSvg({ kind: "rectangle", a: width, b: height, r: radius })}${circleSolidEvidence("rolling-rectangle", [width, height, radius, pi])}`, answer, `직선 구간은 직사각형 둘레 ${2 * (width + height)}cm이고 네 모퉁이의 호를 합하면 반지름 ${radius}cm인 원 한 바퀴입니다. 합은 ${answer}cm입니다.`);
      }
      if (kind === 1) {
        const length = int(rng, 5, 10 + level), angle = pick(rng, [90, 120, 180, 270]);
        const answer = decimal(2 * pi * length * angle / 360, 2);
        return result(`길이가 ${length}cm인 선분을 한 끝점을 중심으로 ${angle}° 회전시켰습니다. 다른 끝점이 움직인 거리를 구하세요. (원주율: ${pi})${locusDiagramSvg({ kind: "pivot", a: length, b: angle, r: 0 })}${circleSolidEvidence("pivot-arc", [length, angle, pi])}`, answer, `반지름 ${length}cm인 원주의 ${angle}/360이므로 이동 거리는 ${answer}cm입니다.`);
      }
      const width = int(rng, 6, 10), height = int(rng, 5, 8), rope = int(rng, 3, Math.min(width, height));
      const answer = decimal(pi * rope * rope * 3 / 4, 2);
      return result(`가로 ${width}m, 세로 ${height}m인 직사각형 우리의 한 꼭짓점 바깥에 동물을 길이 ${rope}m인 줄로 묶었습니다. 우리 안으로 들어갈 수 없을 때 움직일 수 있는 최대 넓이를 구하세요. (원주율: ${pi})${locusDiagramSvg({ kind: "tether", a: width, b: height, r: rope })}${circleSolidEvidence("corner-tether", [width, height, rope, pi])}`, answer, `우리 때문에 원의 1/4은 갈 수 없으므로 반지름 ${rope}m인 원의 3/4인 ${answer}m²입니다.`);
    },
    circleApplicationsAdvanced({ rng, level }) {
      const kind = int(rng, 0, 2);
      if (kind === 0) {
        const points = pick(rng, [8, 10, 12, 15, 18]), gaps = int(rng, 2, Math.min(5, points - 2));
        const answer = decimal(360 * gaps / points, 2);
        return result(`원주를 ${points}등분한 점이 있습니다. 한 점에서 원주를 따라 ${gaps}칸 떨어진 점까지 이은 두 반지름 사이의 작은 중심각은 몇 도입니까?${circlePointsSvg({ points, gaps })}${circleSolidEvidence("equal-points-angle", [points, gaps])}`, answer, `한 칸의 중심각은 360÷${points}°이고 ${gaps}칸이므로 ${answer}°입니다.`);
      }
      if (kind === 1) {
        const inscribed = pick(rng, [25, 30, 35, 40, 45, 50]), answer = inscribed * 2;
        return result(`같은 호를 보는 원주각이 ${inscribed}°입니다. 그 호에 대한 작은 중심각의 크기를 구하세요.${inscribedAngleSvg({ angle: inscribed })}${circleSolidEvidence("inscribed-central", [inscribed])}`, answer, `같은 호를 보는 중심각은 원주각의 2배이므로 ${inscribed}×2=${answer}°입니다.`);
      }
      const sides = pick(rng, [5, 6, 8, 9, 10, 12]), answer = 360 / sides;
      return result(`원의 둘레 위에 같은 간격으로 ${sides}개의 점을 찍고 이웃한 점을 차례로 이었습니다. 만들어진 정다각형의 한 중심각은 몇 도입니까?${circlePointsSvg({ points: sides, gaps: 1 })}${circleSolidEvidence("regular-central", [sides])}`, answer, `원의 중심 둘레 360°를 ${sides}등분하므로 ${answer}°입니다.`);
    },
    cylinderAdvanced({ rng, level }) {
      const kind = int(rng, 0, 2), pi = 3.14;
      if (kind === 0) {
        const radius = int(rng, 2, 5 + level), height = int(rng, 8, 14 + level);
        const answer = decimal(2 * pi * radius * height, 2);
        return result(`반지름이 ${radius}cm, 높이가 ${height}cm인 원기둥의 옆면을 빈틈없이 감싸는 종이의 넓이를 구하세요. (원주율: ${pi})${solidDiagramSvg({ kind: "cylinder-net", a: radius, b: height })}${circleSolidEvidence("cylinder-lateral", [radius, height, pi])}`, answer, `옆면 전개도는 가로 ${2 * pi * radius}cm, 세로 ${height}cm인 직사각형이므로 ${answer}cm²입니다.`);
      }
      if (kind === 1) {
        const radius = int(rng, 2, 5), width = int(rng, 8, 13 + level), turns = int(rng, 3, 7);
        const answer = decimal(2 * pi * radius * width * turns, 2);
        return result(`반지름이 ${radius}cm이고 폭이 ${width}cm인 원기둥 모양 롤러를 ${turns}바퀴 굴렸습니다. 겹치지 않게 칠한 넓이를 구하세요. (원주율: ${pi})${solidDiagramSvg({ kind: "cylinder-wrap", a: radius, b: width, c: turns })}${circleSolidEvidence("roller-area", [radius, width, turns, pi])}`, answer, `한 바퀴에 ${2 * pi * radius}×${width}cm²를 칠하므로 ${turns}바퀴는 ${answer}cm²입니다.`);
      }
      const unit = int(rng, 3, 6 + level), circumference = 3 * unit, height = 4 * unit, path = 5 * unit;
      return result(`원기둥 옆면을 한 바퀴 감아 오른 선을 전개했더니 가로 ${circumference}cm, 세로 ${height}cm인 직사각형의 대각선이 되었습니다. 선의 길이를 구하세요.${solidDiagramSvg({ kind: "cylinder-wrap", a: decimal(circumference / (2 * pi), 2), b: height, c: 1 })}${circleSolidEvidence("cylinder-helix", [circumference, height])}`, path, `전개도에서 ${circumference}-${height}-${path}는 3:4:5인 직각삼각형이므로 선의 길이는 ${path}cm입니다.`);
    },
    coneAdvanced({ rng, level }) {
      const kind = int(rng, 0, 2), pi = 3.14;
      if (kind === 0) {
        const radius = int(rng, 2, 4 + level), multiple = int(rng, 2, 5), slant = radius * multiple, answer = 360 / multiple;
        return result(`밑면의 반지름이 ${radius}cm, 모선이 ${slant}cm인 원뿔의 옆면을 펼쳤습니다. 부채꼴의 중심각을 구하세요.${solidDiagramSvg({ kind: "cone-net", a: radius, b: slant })}${circleSolidEvidence("cone-net-angle", [radius, slant])}`, answer, `부채꼴의 호 ${2 * pi * radius}cm는 반지름 ${slant}cm인 원주의 ${radius}/${slant}이므로 중심각은 ${answer}°입니다.`);
      }
      if (kind === 1) {
        const radius = int(rng, 3, 6 + level), slant = radius + int(rng, 4, 8), ribs = int(rng, 5, 8);
        const answer = decimal(ribs * slant + 2 * pi * radius, 2);
        return result(`원뿔 모양 골조를 만들려고 길이 ${slant}cm인 모선 철사 ${ribs}개와 밑면 둘레 철사 한 개를 사용합니다. 밑면 반지름이 ${radius}cm일 때 필요한 철사의 전체 길이를 구하세요. (원주율: ${pi})${solidDiagramSvg({ kind: "cone-net", a: radius, b: slant })}${circleSolidEvidence("cone-frame", [radius, slant, ribs, pi])}`, answer, `모선은 ${slant}×${ribs}cm, 밑면 둘레는 ${2 * pi * radius}cm이므로 모두 ${answer}cm입니다.`);
      }
      const radius = int(rng, 2, 5), turns = int(rng, 2, 5), slant = radius * turns;
      return result(`밑면의 반지름이 ${radius}cm이고 모선이 ${slant}cm인 원뿔을 옆으로 굴립니다. 꼭짓점을 중심으로 처음 방향으로 돌아올 때까지 원뿔은 몇 바퀴 구릅니까?${solidDiagramSvg({ kind: "cone-net", a: radius, b: slant })}${circleSolidEvidence("cone-roll", [radius, slant])}`, turns, `꼭짓점 둘레의 큰 원주는 밑면 원주의 ${slant}/${radius}=${turns}배이므로 ${turns}바퀴입니다.`);
    },
    solidsOfRevolutionAdvanced({ rng, level }) {
      const kind = int(rng, 0, 2), pi = 3.14;
      if (kind === 0) {
        const radius = int(rng, 3, 7 + level), height = int(rng, 6, 12 + level), answer = radius * 2 + height;
        return result(`가로 ${radius}cm, 세로 ${height}cm인 직사각형을 세로인 한 변을 회전축으로 하여 한 바퀴 돌렸습니다. 생기는 원기둥의 밑면 지름과 높이의 합을 구하세요.${solidDiagramSvg({ kind: "profile", a: radius, b: height, c: 0 })}${circleSolidEvidence("rotate-rectangle", [radius, height])}`, answer, `밑면 반지름은 ${radius}cm, 지름은 ${radius * 2}cm이고 높이는 ${height}cm이므로 합은 ${answer}cm입니다.`);
      }
      if (kind === 1) {
        const radius = int(rng, 3, 7 + level), height = int(rng, 6, 12 + level), answer = radius * 2 + height;
        return result(`밑변 ${radius}cm, 높이 ${height}cm인 직각삼각형을 높이인 변을 회전축으로 한 바퀴 돌렸습니다. 생기는 원뿔의 밑면 지름과 높이의 합을 구하세요.${solidDiagramSvg({ kind: "profile", a: radius, b: height, c: 1 })}${circleSolidEvidence("rotate-triangle", [radius, height])}`, answer, `밑면 반지름은 ${radius}cm이므로 지름은 ${radius * 2}cm, 높이는 ${height}cm입니다. 합은 ${answer}cm입니다.`);
      }
      const outer = int(rng, 5, 8 + level), inner = int(rng, 2, outer - 2), height = int(rng, 8, 14);
      const answer = decimal(pi * outer * outer, 2);
      return result(`계단 모양 평면도형을 오른쪽 세로선을 회전축으로 한 바퀴 돌렸습니다. 회전축에 수직인 단면 가운데 가장 큰 단면의 넓이를 구하세요. (원주율: ${pi})${solidDiagramSvg({ kind: "stepped", a: outer, b: height, c: inner })}${circleSolidEvidence("rotate-stepped", [outer, inner, height, pi])}`, answer, `가장 큰 단면은 반지름 ${outer}cm인 원이므로 넓이는 ${pi}×${outer}²=${answer}cm²입니다.`);
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
    [type => type.id === "5-1-u6-t4", "quadrilateralAreaAdvanced"],
    [type => type.id === "6-2-u4-t4", "continuedRatioAdvanced"],
    [type => type.id === "6-2-u5-t3", "complexCircleAreaOneAdvanced"],
    [type => type.id === "6-2-u5-t4", "complexCircleAreaTwoAdvanced"],
    [type => type.id === "6-2-u5-t5", "locusLengthAreaAdvanced"],
    [type => type.id === "6-2-u5-t6", "circleApplicationsAdvanced"],
    [type => type.id === "6-2-u6-t1", "cylinderAdvanced"],
    [type => type.id === "6-2-u6-t2", "coneAdvanced"],
    [type => type.id === "6-2-u6-t3", "solidsOfRevolutionAdvanced"]
  ];

  function generatorKey(typeOrName) {
    const type = typeof typeOrName === "string" ? { name: typeOrName } : typeOrName;
    if (type.generatorKey && generators[type.generatorKey]) return type.generatorKey;
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
    const resolvedVariant = Number.isInteger(type?.variant) ? type.variant : variant;
    return { ...generators[key]({ rng: mulberry32(seed), level, variant: resolvedVariant }), generator: key };
  }

  window.HSE_GENERATORS = { generatorKey, generate, names: Object.keys(generators) };
})();
