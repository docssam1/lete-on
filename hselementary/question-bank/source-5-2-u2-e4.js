(function (root, factory) {
  "use strict";

  const exported = factory(root || {});
  if (typeof module !== "undefined" && module.exports) module.exports = exported;
})(typeof window !== "undefined" ? window : globalThis, function (root) {
  "use strict";

  const api = root.HSE_GENERATORS;
  if (!api) throw new Error("5-2 2단원 개념탐구 4 생성기를 불러오지 못했습니다.");

  const GENERATOR_KEY = "sourceGrade5Semester2Exploration4";
  const gcd = (left, right) => {
    let a = Math.abs(Math.trunc(left));
    let b = Math.abs(Math.trunc(right));
    while (b) [a, b] = [b, a % b];
    return a || 1;
  };
  const rational = (numerator, denominator = 1) => {
    if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator === 0) throw new Error("올바르지 않은 분수입니다.");
    const sign = denominator < 0 ? -1 : 1;
    const divisor = gcd(numerator, denominator);
    return { n: sign * numerator / divisor, d: Math.abs(denominator) / divisor };
  };
  const add = (left, right) => rational(left.n * right.d + right.n * left.d, left.d * right.d);
  const subtract = (left, right) => rational(left.n * right.d - right.n * left.d, left.d * right.d);
  const multiply = (left, right) => rational(left.n * right.n, left.d * right.d);
  const divide = (left, right) => rational(left.n * right.d, left.d * right.n);
  const compare = (left, right) => left.n * right.d - right.n * left.d;
  const mixed = (whole, numerator = 0, denominator = 1) => rational(whole * denominator + numerator, denominator);
  const equal = (left, right) => compare(left, right) === 0;
  const naturalSum = values => values.reduce((total, value) => total + value, 0);
  const integers = (start, end) => Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const poolIndexForSeed = (seed, count) => {
    let hash = 2166136261;
    for (const character of String(seed ?? 0)) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) % count;
  };
  const uniqueAnswer = (condition, sourceItemId, message) => {
    if (!condition) throw new Error(`${sourceItemId}: ${message}`);
  };
  const fractionText = value => {
    const item = rational(value.n, value.d);
    if (item.d === 1) return String(item.n);
    const whole = Math.floor(item.n / item.d);
    const remainder = item.n % item.d;
    return whole > 0 ? `${whole} ${remainder}/${item.d}` : `${item.n}/${item.d}`;
  };
  const fractionMarkup = value => {
    const item = rational(value.n, value.d);
    if (item.d === 1) return String(item.n);
    const whole = Math.floor(item.n / item.d);
    const remainder = item.n % item.d;
    const fraction = `<span class="math-fraction" style="min-width:0" role="img" aria-label="${item.d}분의 ${remainder || item.n}"><span>${remainder || item.n}</span><span>${item.d}</span></span>`;
    return whole > 0 ? `<span class="math-mixed-number" role="img" aria-label="${whole}와 ${item.d}분의 ${remainder}"><span>${whole}</span>${fraction}</span>` : fraction;
  };
  const fractionFrom = (numerator, denominator = 1) => {
    if (Number.isInteger(numerator) && Number.isInteger(denominator)) return fractionMarkup(rational(numerator, denominator));
    return `<span class="math-fraction" style="min-width:0" role="img" aria-label="${escapeHtml(denominator)}분의 ${escapeHtml(numerator)}"><span>${escapeHtml(numerator)}</span><span>${escapeHtml(denominator)}</span></span>`;
  };
  const equation = body => `<div class="source52-equation">${body}</div>`;
  const cards = values => `<div class="source52-card-row" aria-label="분수 카드">${values.map(value => `<span>${fractionMarkup(value)}</span>`).join("")}</div>`;

  const gridNumberLine = ({ start, end, parts, pointIndex, solved, label }) => {
    const width = 560;
    const gridLeft = 58;
    const gridRight = 502;
    const top = 24;
    const bottom = 140;
    const axis = 164;
    const xAt = index => gridLeft + (gridRight - gridLeft) * index / parts;
    const verticals = integers(0, parts).map(index => `<line x1="${xAt(index)}" y1="${top}" x2="${xAt(index)}" y2="${bottom}" stroke="#171717" stroke-width="1" vector-effect="non-scaling-stroke"/>`).join("");
    const horizontals = integers(0, parts).map(index => {
      const y = top + (bottom - top) * index / parts;
      return `<line x1="${gridLeft}" y1="${y}" x2="${gridRight}" y2="${y}" stroke="#171717" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
    }).join("");
    const pointX = xAt(pointIndex);
    const point = solved ? `<circle cx="${pointX}" cy="${axis}" r="4.2" fill="#171717"/><text x="${pointX}" y="${axis + 31}" text-anchor="middle" font-family="Batang, Times New Roman, serif" font-size="16" fill="#171717">가</text>` : `<circle cx="${pointX}" cy="${axis}" r="4.2" fill="#171717"/><text x="${pointX}" y="${axis + 31}" text-anchor="middle" font-family="Batang, Times New Roman, serif" font-size="16" fill="#171717">가</text>`;
    return `<svg class="source52-number-line" viewBox="0 0 ${width} 218" role="img" aria-label="${escapeHtml(label)}" data-grid-parts="${parts}" data-point-index="${pointIndex}" data-start="${start.n}/${start.d}" data-end="${end.n}/${end.d}"><rect x="${gridLeft}" y="${top}" width="${gridRight - gridLeft}" height="${bottom - top}" fill="#fff" stroke="#171717" stroke-width="1.2" vector-effect="non-scaling-stroke"/>${verticals}${horizontals}<line x1="26" y1="${axis}" x2="534" y2="${axis}" stroke="#171717" stroke-width="1.5" vector-effect="non-scaling-stroke"/><path d="M26 ${axis}l9 -5v10zM534 ${axis}l-9 -5v10z" fill="#171717"/><line x1="${gridLeft}" y1="${top}" x2="${gridRight}" y2="${bottom}" stroke="#171717" stroke-width="1.2" vector-effect="non-scaling-stroke"/>${point}</svg><div class="source52-equation source52-equation-wide"><span>왼쪽 끝 ${fractionMarkup(start)}</span><span>&nbsp;&nbsp;&nbsp;오른쪽 끝 ${fractionMarkup(end)}</span></div>`;
  };
  const plainNumberLine = ({ start, end, parts, pointIndex, solved, label }) => {
    const width = 560;
    const left = 48;
    const right = 512;
    const axis = 70;
    const xAt = index => left + (right - left) * index / parts;
    const ticks = integers(0, parts).map(index => `<line x1="${xAt(index)}" y1="${axis - 11}" x2="${xAt(index)}" y2="${axis + 11}" stroke="#171717" stroke-width="1.2" vector-effect="non-scaling-stroke"/>`).join("");
    const equalIntervalArcs = integers(0, parts - 1).map(index => {
      const startX = xAt(index);
      const endX = xAt(index + 1);
      const middleX = (startX + endX) / 2;
      const peakY = axis - 34;
      return `<g data-equal-interval="${index + 1}"><path d="M${startX} ${axis}Q${middleX} ${peakY} ${endX} ${axis}" fill="none" stroke="#171717" stroke-width="1.05" vector-effect="non-scaling-stroke"/><line x1="${middleX - 2.5}" y1="${peakY + 6}" x2="${middleX - 2.5}" y2="${peakY - 2}" stroke="#171717" stroke-width="1" vector-effect="non-scaling-stroke"/><line x1="${middleX + 2.5}" y1="${peakY + 6}" x2="${middleX + 2.5}" y2="${peakY - 2}" stroke="#171717" stroke-width="1" vector-effect="non-scaling-stroke"/></g>`;
    }).join("");
    const x = xAt(pointIndex);
    const marker = `<circle cx="${x}" cy="${axis}" r="4.3" fill="#171717"/><text x="${x}" y="${axis + 29}" text-anchor="middle" font-family="Batang, Times New Roman, serif" font-size="16" fill="#171717">가</text>`;
    const solvedText = solved ? `<div class="source52-equation source52-equation-wide">가 = ${fractionMarkup(add(start, multiply(subtract(end, start), rational(pointIndex, parts))))}</div>` : "";
    return `<svg class="source52-number-line" viewBox="0 0 ${width} 112" role="img" aria-label="${escapeHtml(label)}" data-line-parts="${parts}" data-equal-interval-count="${parts}" data-point-index="${pointIndex}" data-start="${start.n}/${start.d}" data-end="${end.n}/${end.d}"><line x1="24" y1="${axis}" x2="536" y2="${axis}" stroke="#171717" stroke-width="1.5" vector-effect="non-scaling-stroke"/><path d="M24 ${axis}l9 -5v10zM536 ${axis}l-9 -5v10z" fill="#171717"/>${ticks}${equalIntervalArcs}${marker}</svg><div class="source52-equation source52-equation-wide"><span>왼쪽 끝 ${fractionMarkup(start)}</span><span>&nbsp;&nbsp;&nbsp;오른쪽 끝 ${fractionMarkup(end)}</span></div>${solvedText}`;
  };
  const answerVisual = (sourceItemId, body, poolIndex) => `<div class="source52-answer-visual" data-answer-source="${sourceItemId}" data-verified-pool-index="${poolIndex}">${body}</div>`;

  const SPECS = new Map();
  const define = (sourceItemId, pools, build, options = {}) => SPECS.set(sourceItemId, { sourceItemId, pools, build, ...options });

  define("5-2-u2-e4-exploration", [
    { values: [rational(21, 36), rational(35, 48), rational(77, 90)] },
    { values: [rational(2, 3), rational(2, 5), rational(2, 7)] },
    { values: [rational(2, 3), rational(2, 5), rational(2, 9)] }
  ], data => {
    const first = data.values[0];
    let smallest = null;
    for (let multiplier = 1; multiplier <= 30000; multiplier += 1) {
      const candidate = rational(first.d * multiplier, first.n);
      if (data.values.every(value => multiply(candidate, value).d === 1)) {
        smallest = candidate;
        break;
      }
    }
    uniqueAnswer(Boolean(smallest), "5-2-u2-e4-exploration", "가장 작은 분수를 전수로 찾지 못했습니다.");
    const products = data.values.map(value => multiply(smallest, value));
    return {
      prompt: `다음 세 수 중 어느 것에 곱하여도 자연수가 되게 하는 분수 중 가장 작은 양의 분수를 구하세요.${equation(data.values.map(fractionMarkup).join("&nbsp;&nbsp;&nbsp;"))}`,
      answer: fractionText(smallest),
      solution: `세 수를 기약분수로 보고, 첫째 수에 곱해 자연수가 되는 분수를 작은 것부터 확인합니다. 세 수 모두에 곱한 결과가 ${products.map(fractionText).join(", ")}이 되는 가장 작은 분수는 ${fractionText(smallest)}입니다.`,
      proof: { candidates: [`${smallest.n}/${smallest.d}`], witness: { smallest, products } }
    };
  }, { visual: true });

  define("5-2-u2-e4-example-1", [
    { width: mixed(5, 1, 4), part: rational(2, 5), partArea: mixed(7, 1, 2) },
    { width: mixed(4, 1, 4), part: rational(3, 7), partArea: mixed(5, 2, 3) },
    { width: mixed(3, 3, 4), part: rational(5, 8), partArea: mixed(6, 9, 11) }
  ], data => {
    const totalArea = divide(data.partArea, data.part);
    const height = divide(totalArea, data.width);
    uniqueAnswer(height.n > 0 && height.d > 1 && gcd(height.n, height.d) === 1, "5-2-u2-e4-example-1", "세로가 기약분수가 아닙니다.");
    const answer = height.n * height.d;
    return {
      prompt: `가로가 ${fractionMarkup(data.width)} m이고 세로가 ${fractionFrom("가", "나")} m인 직사각형 모양의 꽃밭이 있습니다. ${fractionFrom("가", "나")}는 기약분수입니다. 꽃밭의 ${fractionMarkup(data.part)}가 ${fractionMarkup(data.partArea)} m²일 때, 가×나의 값을 구하세요.${equation(`${fractionMarkup(data.width)} m × ${fractionFrom("가", "나")} m`)}`,
      answer: String(answer),
      solution: `꽃밭 전체 넓이는 ${fractionMarkup(data.partArea)} ÷ ${fractionMarkup(data.part)} = ${fractionMarkup(totalArea)} m²입니다. 세로는 ${fractionMarkup(totalArea)} ÷ ${fractionMarkup(data.width)} = ${fractionMarkup(height)} m이므로 분자와 분모의 곱은 ${height.n}×${height.d}=${answer}입니다.`,
      proof: { candidates: [answer], witness: { totalArea, height } }
    };
  }, { visual: true });

  define("5-2-u2-e4-example-2", [
    { start: mixed(1, 7, 15), end: mixed(5, 1, 10), parts: 8, pointIndex: 5 },
    { start: mixed(1, 1, 6), end: mixed(4, 5, 6), parts: 8, pointIndex: 5 },
    { start: mixed(1, 3, 10), end: mixed(4, 9, 10), parts: 8, pointIndex: 5 }
  ], data => {
    const gap = divide(subtract(data.end, data.start), rational(data.parts));
    const answer = add(data.start, multiply(gap, rational(data.pointIndex)));
    const diagram = gridNumberLine({ ...data, solved: false, label: "직사각형을 같은 크기로 8등분한 수직선 그림" });
    const solved = gridNumberLine({ ...data, solved: true, label: "가의 위치가 표시된 수직선 그림" });
    return {
      prompt: `다음 그림과 같이 수직선 위에 직사각형을 올려놓고 가로 방향으로 ${data.parts}등분했습니다. 대각선과 가의 수직선이 만나는 곳의 수를 구하세요.${diagram}`,
      answer: fractionText(answer),
      solution: `양 끝의 차는 ${fractionMarkup(data.end)}-${fractionMarkup(data.start)}=${fractionMarkup(subtract(data.end, data.start))}이고, 한 칸은 ${fractionMarkup(gap)}입니다. 가는 시작에서 ${data.pointIndex}칸이므로 ${fractionMarkup(data.start)}+${data.pointIndex}×${fractionMarkup(gap)}=${fractionMarkup(answer)}입니다.`,
      answerVisualBody: solved,
      proof: { candidates: [`${answer.n}/${answer.d}`], witness: { gap, answer, pointIndex: data.pointIndex } }
    };
  }, { visual: true, answerVisual: true });

  define("5-2-u2-e4-example-3", [
    { firstDenominator: 7, secondNumerator: 33, multiplier: mixed(3, 9, 11), limit: 20 },
    { firstDenominator: 7, secondNumerator: 33, multiplier: mixed(3, 9, 11), limit: 15 },
    { firstDenominator: 7, secondNumerator: 33, multiplier: mixed(3, 9, 11), limit: 10 }
  ], data => {
    const aValues = integers(1, 80).filter(value => gcd(value, data.firstDenominator) === 1 && multiply(rational(value, data.firstDenominator), data.multiplier).d === 1 && compare(multiply(rational(value, data.firstDenominator), data.multiplier), rational(data.limit)) < 0);
    const bValues = integers(1, 160).filter(value => gcd(data.secondNumerator, value) === 1 && multiply(rational(data.secondNumerator, value), data.multiplier).d === 1 && compare(multiply(rational(data.secondNumerator, value), data.multiplier), rational(data.limit)) < 0);
    uniqueAnswer(aValues.length > 0 && bValues.length > 0, "5-2-u2-e4-example-3", "조건을 만족하는 자연수가 없습니다.");
    const answer = `가: ${aValues.join(", ")}, 나: ${bValues.join(", ")}`;
    return {
      prompt: `두 기약분수 ${fractionFrom("가", data.firstDenominator)}과 ${fractionFrom(data.secondNumerator, "나")}에 각각 ${fractionMarkup(data.multiplier)}을 곱한 결과가 ${data.limit}보다 작은 자연수가 됩니다. 가와 나에 들어갈 자연수를 모두 구하세요.${equation(`${fractionFrom("가", data.firstDenominator)}×${fractionMarkup(data.multiplier)},&nbsp;&nbsp; ${fractionFrom(data.secondNumerator, "나")}×${fractionMarkup(data.multiplier)}`)}`,
      answer,
      solution: `가와 나를 자연수 범위에서 각각 넣어 기약분수이고 곱한 결과가 ${data.limit}보다 작은 자연수인지 전부 확인합니다. 가는 ${aValues.join(", ")}, 나는 ${bValues.join(", ")}입니다.`,
      proof: { candidates: [`${aValues.join(",")}|${bValues.join(",")}`], witness: { aValues, bValues } }
    };
  }, { visual: true });

  define("5-2-u2-e4-example-4", [
    { numbers: [3, 4, 5, 6, 7, 8, 9], target: rational(1, 2) },
    { numbers: [2, 3, 4, 5, 6, 7, 8], target: rational(1, 2) },
    { numbers: [3, 4, 5, 6, 7, 8, 9], target: rational(1, 3) }
  ], data => {
    const fractions = [];
    for (const numerator of data.numbers) for (const denominator of data.numbers) {
      if (numerator >= denominator || gcd(numerator, denominator) !== 1) continue;
      fractions.push(rational(numerator, denominator));
    }
    const pairs = [];
    for (let left = 0; left < fractions.length; left += 1) for (let right = left + 1; right < fractions.length; right += 1) {
      if (equal(multiply(fractions[left], fractions[right]), data.target)) pairs.push([fractions[left], fractions[right]]);
    }
    const displayPairs = pairs.map(pair => `(${fractionText(pair[0])}, ${fractionText(pair[1])})`);
    return {
      prompt: `${data.numbers.join(", ")}의 수 중 두 수를 골라 진분수를 만듭니다. 이렇게 만든 기약분수 중 두 개를 골라 서로 곱합니다. 두 분수 사이에서는 숫자를 다시 사용할 수 있습니다. 곱이 ${fractionMarkup(data.target)}이 되는 두 기약분수의 짝은 모두 몇 쌍인가요?${cards(data.numbers.map(value => rational(value)))}`,
      answer: `${pairs.length}쌍`,
      solution: `만들 수 있는 기약 진분수를 전부 확인한 뒤, 곱이 ${fractionMarkup(data.target)}인 무순서 짝을 찾습니다. ${displayPairs.join(", ")}이므로 ${pairs.length}쌍입니다.`,
      proof: { candidates: [String(pairs.length)], witness: pairs.map(pair => pair.map(value => `${value.n}/${value.d}`)) }
    };
  }, { visual: true });

  define("5-2-u2-e4-mission-1", [
    { denominator: 5, values: [1, 2, 3, 4] },
    { denominator: 6, values: [1, 2, 3, 4] },
    { denominator: 7, values: [1, 2, 3, 4] }
  ], data => {
    const values = data.values.map(value => rational(value, data.denominator));
    const arrangements = [];
    for (const first of values) for (const second of values) for (const third of values) for (const fourth of values) {
      if (new Set([first, second, third, fourth]).size !== 4) continue;
      arrangements.push({ first, second, third, fourth, value: add(subtract(first, multiply(second, third)), fourth) });
    }
    const best = arrangements.reduce((current, item) => compare(item.value, current.value) > 0 ? item : current, arrangements[0]);
    const bestCount = arrangements.filter(item => equal(item.value, best.value)).length;
    uniqueAnswer(bestCount > 0, "5-2-u2-e4-mission-1", "최댓값이 없습니다.");
    return {
      prompt: `다음 네 분수 카드를 한 번씩 모두 사용하여 □-□×□+□을 만들려고 합니다. 만들 수 있는 가장 큰 수를 구하세요. 곱셈을 먼저 계산합니다.${cards(values)}`,
      answer: fractionText(best.value),
      solution: `곱하는 자리에 작은 두 분수를 놓고, 빼는 자리에는 더 큰 분수보다 작은 분수를, 더하는 자리에는 가장 큰 분수를 놓아 비교합니다. ${fractionMarkup(best.first)}-${fractionMarkup(best.second)}×${fractionMarkup(best.third)}+${fractionMarkup(best.fourth)}=${fractionMarkup(best.value)}입니다.`,
      proof: { candidates: [`${best.value.n}/${best.value.d}`], witness: { arrangements: arrangements.length, best } }
    };
  }, { visual: true });

  define("5-2-u2-e4-mission-2", [
    { denominators: [3, 7, 10], target: rational(3, 7) },
    { denominators: [4, 5, 9], target: rational(1, 3) },
    { denominators: [5, 8, 9], target: rational(1, 3) }
  ], data => {
    const triples = [];
    for (const a of integers(1, 9)) for (const b of integers(1, 9)) for (const c of integers(1, 9)) {
      if (a >= data.denominators[0] || b >= data.denominators[1] || c >= data.denominators[2]) continue;
      if (gcd(a, data.denominators[0]) !== 1 || gcd(b, data.denominators[1]) !== 1 || gcd(c, data.denominators[2]) !== 1) continue;
      if (equal(multiply(multiply(rational(a, data.denominators[0]), rational(b, data.denominators[1])), rational(c, data.denominators[2])), data.target)) triples.push([a, b, c]);
    }
    uniqueAnswer(triples.length === 1, "5-2-u2-e4-mission-2", "한 자리 자연수 세 수가 하나로 정해지지 않습니다.");
    const [a, b, c] = triples[0];
    return {
      prompt: `다음은 세 기약 진분수의 곱이 ${fractionMarkup(data.target)}인 것을 나타낸 식입니다. 가, 나, 다가 모두 한 자리 자연수일 때, 100×가+10×나+다를 구하세요.${equation(`${fractionFrom("가", data.denominators[0])}×${fractionFrom("나", data.denominators[1])}×${fractionFrom("다", data.denominators[2])}=${fractionMarkup(data.target)}`)}`,
      answer: String(100 * a + 10 * b + c),
      solution: `가, 나, 다를 한 자리 자연수 범위에서 전부 확인하면 (가, 나, 다)=(${a}, ${b}, ${c}) 한 가지입니다. 따라서 100×${a}+10×${b}+${c}=${100 * a + 10 * b + c}입니다.`,
      proof: { candidates: [triples[0].join(",")], witness: triples }
    };
  }, { visual: true });

  define("5-2-u2-e4-mission-3", [
    { firstDenominator: 39, secondNumerator: 13, target: rational(8, 15) },
    { firstDenominator: 20, secondNumerator: 5, target: rational(3, 8) },
    { firstDenominator: 20, secondNumerator: 4, target: rational(7, 25) }
  ], data => {
    const pairs = [];
    for (const a of integers(1, data.firstDenominator - 1)) for (const b of integers(data.secondNumerator + 1, 99)) {
      if (gcd(a, data.firstDenominator) !== 1 || gcd(data.secondNumerator, b) !== 1) continue;
      if (equal(multiply(rational(a, data.firstDenominator), rational(data.secondNumerator, b)), data.target)) pairs.push([a, b]);
    }
    uniqueAnswer(pairs.length === 1, "5-2-u2-e4-mission-3", "두 빈칸의 값이 하나로 정해지지 않습니다.");
    const [a, b] = pairs[0];
    return {
      prompt: `두 진분수인 기약분수 ${fractionFrom("가", data.firstDenominator)}, ${fractionFrom(data.secondNumerator, "나")}의 곱이 ${fractionMarkup(data.target)}일 때, 가와 나의 합을 구하세요.${equation(`${fractionFrom("가", data.firstDenominator)}×${fractionFrom(data.secondNumerator, "나")}=${fractionMarkup(data.target)}`)}`,
      answer: String(a + b),
      solution: `가와 나가 각각 기약 진분수가 되도록 가능한 자연수를 확인하면 (가, 나)=(${a}, ${b})입니다. 따라서 ${a}+${b}=${a + b}입니다.`,
      proof: { candidates: [`${a},${b}`], witness: pairs }
    };
  }, { visual: true });

  define("5-2-u2-e4-mission-4", [
    { base: 7, factorA: rational(2, 5), factorB: mixed(3, 1, 2), limit: 20 },
    { base: 8, factorA: rational(3, 4), factorB: rational(4), limit: 24 },
    { base: 9, factorA: rational(2, 3), factorB: mixed(4, 1, 2), limit: 20 }
  ], data => {
    const valid = integers(1, data.limit - 1).filter(value => multiply(multiply(add(rational(1), rational(value, data.base)), data.factorA), data.factorB).d === 1);
    uniqueAnswer(valid.length > 0, "5-2-u2-e4-mission-4", "가능한 빈칸 값이 없습니다.");
    const answer = naturalSum(valid);
    return {
      prompt: `다음 식의 계산 결과가 자연수가 됩니다. ${data.limit}보다 작은 자연수 중 □ 안에 들어갈 수 있는 모든 수의 합을 구하세요.${equation(`(1+${fractionFrom("□", data.base)})×${fractionMarkup(data.factorA)}×${fractionMarkup(data.factorB)}`)}`,
      answer: String(answer),
      solution: `□에 1부터 ${data.limit - 1}까지 넣어 계산 결과가 자연수가 되는 값을 확인하면 ${valid.join(", ")}입니다. 합은 ${valid.join("+")}=${answer}입니다.`,
      proof: { candidates: [String(answer)], witness: valid }
    };
  }, { visual: true });

  define("5-2-u2-e4-mission-5", [
    { start: rational(3, 7), end: rational(7, 3), parts: 5, pointIndex: 3 },
    { start: rational(2, 5), end: mixed(2, 3, 5), parts: 5, pointIndex: 3 },
    { start: rational(5, 6), end: mixed(3, 1, 6), parts: 5, pointIndex: 3 }
  ], data => {
    const unit = divide(subtract(data.end, data.start), rational(data.parts));
    const answer = add(data.start, multiply(unit, rational(data.pointIndex)));
    const diagram = plainNumberLine({ ...data, solved: false, label: "같은 간격으로 나눈 수직선" });
    const solved = plainNumberLine({ ...data, solved: true, label: "가의 위치와 값을 나타낸 수직선" });
    return {
      prompt: `다음 수직선은 ${fractionMarkup(data.start)}부터 ${fractionMarkup(data.end)}까지를 같은 간격으로 ${data.parts}등분한 것입니다. 가의 위치에 있는 수를 구하세요.${diagram}`,
      answer: fractionText(answer),
      solution: `한 칸은 (${fractionMarkup(data.end)}-${fractionMarkup(data.start)})÷${data.parts}=${fractionMarkup(unit)}입니다. 가는 시작에서 ${data.pointIndex}칸이므로 ${fractionMarkup(answer)}입니다.`,
      answerVisualBody: solved,
      proof: { candidates: [`${answer.n}/${answer.d}`], witness: { unit, answer } }
    };
  }, { visual: true, answerVisual: true });

  define("5-2-u2-e4-mission-6", [
    { values: [rational(5, 6), mixed(3, 1, 3), mixed(3, 3, 4)], target: rational(9) },
    { values: [rational(2, 3), rational(2, 5), rational(4, 5)], target: rational(9) },
    { values: [rational(3, 4), mixed(2, 1, 3), mixed(2, 1, 2)], target: rational(31) }
  ], data => {
    let step = null;
    for (let denominator = 1; denominator <= 80; denominator += 1) for (let numerator = 1; numerator <= 4000; numerator += 1) {
      if (gcd(numerator, denominator) !== 1) continue;
      const candidate = rational(numerator, denominator);
      if (data.values.every(value => multiply(candidate, value).d === 1) && (!step || compare(candidate, step) < 0)) step = candidate;
    }
    uniqueAnswer(Boolean(step), "5-2-u2-e4-mission-6", "공통으로 곱할 최소 분수를 찾지 못했습니다.");
    const candidates = integers(1, 24).map(multiplier => multiply(step, rational(multiplier)));
    let best = candidates[0];
    for (const candidate of candidates.slice(1)) {
      const currentDistance = Math.abs(candidate.n * data.target.d - data.target.n * candidate.d) / (candidate.d * data.target.d);
      const bestDistance = Math.abs(best.n * data.target.d - data.target.n * best.d) / (best.d * data.target.d);
      if (currentDistance < bestDistance) best = candidate;
    }
    const tied = candidates.filter(candidate => Math.abs(candidate.n * data.target.d - data.target.n * candidate.d) * best.d === Math.abs(best.n * data.target.d - data.target.n * best.d) * candidate.d);
    uniqueAnswer(tied.length === 1, "5-2-u2-e4-mission-6", "가장 가까운 분수가 하나로 정해지지 않습니다.");
    return {
      prompt: `${data.values.map(fractionMarkup).join(", ")}의 세 분수에 어떤 분수를 곱한 결과가 모두 자연수가 되게 하려고 합니다. 그런 분수 중 ${fractionMarkup(data.target)}에 가장 가까운 분수를 구하세요.${equation(data.values.map(value => `${fractionMarkup(value)}×□`).join("&nbsp;&nbsp;&nbsp;"))}`,
      answer: fractionText(best),
      solution: `세 수에 모두 곱해 자연수가 되는 가장 작은 단위는 ${fractionMarkup(step)}입니다. 가능한 분수는 그 배수이고, ${fractionMarkup(data.target)}에 가장 가까운 것은 ${fractionMarkup(best)}입니다.`,
      proof: { candidates: [`${best.n}/${best.d}`], witness: { step, best, tied } }
    };
  }, { visual: true });

  const generateSource = (sourceItemId, seed, difficultyOffset = 0) => {
    const spec = SPECS.get(sourceItemId);
    if (!spec) return null;
    const poolIndex = poolIndexForSeed(seed, spec.pools.length);
    const built = spec.build(spec.pools[poolIndex]);
    uniqueAnswer(Array.isArray(built.proof?.candidates) && built.proof.candidates.length === 1, sourceItemId, "독립 계산에서 정답 후보가 하나가 아닙니다.");
    const difficultyDesign = Number(difficultyOffset) < 0 ? "guided-source" : Number(difficultyOffset) > 0 ? "independent-source" : "source";
    return {
      prompt: `${built.prompt}<span hidden data-source52-item="${sourceItemId}" data-source52-e4-item="${sourceItemId}" data-source52-pool="${poolIndex}" data-answer-candidate-count="1" data-difficulty-design="${difficultyDesign}"></span>`,
      answer: built.answer,
      solution: built.solution,
      answerVisual: built.answerVisualBody ? answerVisual(sourceItemId, built.answerVisualBody, poolIndex) : "",
      generationMode: "fixed-verified-pool",
      verifiedPoolIndex: poolIndex,
      verifiedVariantCount: spec.pools.length,
      variantProvenance: "source-structure-variant",
      sourceItemId,
      generator: GENERATOR_KEY,
      difficultyDesign
    };
  };

  const patchReadyItem = item => {
    const spec = SPECS.get(item?.sourceItemId);
    if (!spec) return;
    Object.assign(item, {
      generatorKey: GENERATOR_KEY,
      reviewLocked: false,
      reviewReason: "개념탐구 4 원문 구조와 독립 전수 계산을 확인한 고정 변형입니다.",
      sourceVerified: true,
      generationMode: "fixed-verified-pool",
      verifiedVariantTarget: spec.pools.length,
      verifiedVariantCount: spec.pools.length,
      problemVisualRequired: Boolean(spec.visual),
      answerVisualRequired: Boolean(spec.answerVisual),
      answerVisualStatus: spec.answerVisual ? "verified" : "not-required"
    });
  };

  if (Array.isArray(root.HSE_SOURCE_INVENTORY_52?.items)) root.HSE_SOURCE_INVENTORY_52.items.forEach(patchReadyItem);
  const curriculumTypes = root.HSE_CURRICULUM?.semesters?.flatMap(semester => semester.units || []).flatMap(unit => unit.subunits || []).flatMap(subunit => subunit.types || []) || [];
  curriculumTypes.forEach(patchReadyItem);

  const originalKey = api.generatorKey;
  const originalGenerate = api.generate;
  api.generatorKey = type => SPECS.has(type?.sourceItemId) ? GENERATOR_KEY : originalKey(type);
  api.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => {
    if (!SPECS.has(type?.sourceItemId)) return originalGenerate(type, levelRank, difficultyOffset, seed, variant);
    return generateSource(type.sourceItemId, seed, difficultyOffset);
  };
  if (Array.isArray(api.names) && !api.names.includes(GENERATOR_KEY)) api.names.push(GENERATOR_KEY);

  return {
    generatorKey: GENERATOR_KEY,
    sourceItemIds: Object.freeze([...SPECS.keys()]),
    generateSource,
    verify(sourceItemId, poolIndex) {
      const spec = SPECS.get(sourceItemId);
      if (!spec || !Number.isInteger(poolIndex) || !spec.pools[poolIndex]) return null;
      const built = spec.build(spec.pools[poolIndex]);
      return { sourceItemId, poolIndex, candidateCount: built.proof?.candidates?.length || 0, proof: built.proof, answer: built.answer };
    }
  };
});
