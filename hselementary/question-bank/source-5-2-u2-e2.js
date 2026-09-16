(function (root, factory) {
  "use strict";

  const exported = factory(root || {});
  if (typeof module !== "undefined" && module.exports) module.exports = exported;
})(typeof window !== "undefined" ? window : globalThis, function (root) {
  "use strict";

  const api = root.HSE_GENERATORS;
  if (!api) throw new Error("5-2 원문형 생성기를 불러오지 못했습니다.");

  const GENERATOR_KEY = "sourceGrade5Semester2Exploration2";
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
  const mixed = (whole, numerator = 0, denominator = 1) => rational(whole * denominator + numerator, denominator);
  const add = (left, right) => rational(left.n * right.d + right.n * left.d, left.d * right.d);
  const subtract = (left, right) => rational(left.n * right.d - right.n * left.d, left.d * right.d);
  const multiply = (left, right) => rational(left.n * right.n, left.d * right.d);
  const divide = (left, right) => rational(left.n * right.d, left.d * right.n);
  const compare = (left, right) => left.n * right.d - right.n * left.d;
  const integer = value => rational(value, 1);
  const formatFraction = value => {
    const item = rational(value.n, value.d);
    if (item.d === 1) return String(item.n);
    const whole = Math.floor(item.n / item.d);
    const remainder = item.n % item.d;
    return whole > 0 ? `${whole} ${remainder}/${item.d}` : `${item.n}/${item.d}`;
  };
  const poolIndexForSeed = (seed, count) => {
    let hash = 2166136261;
    for (const character of String(seed ?? 0)) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) % count;
  };
  const naturalSum = values => values.reduce((sum, value) => sum + value, 0);
  const uniqueAnswer = (condition, sourceItemId, message) => {
    if (!condition) throw new Error(`${sourceItemId}: ${message}`);
  };
  const fractionProduct = values => values.reduce((total, value) => multiply(total, value), integer(1));
  const answerVisual = (sourceItemId, poolIndex, body) => `<div class="source52-answer-visual" data-answer-source="${sourceItemId}" data-verified-pool-index="${poolIndex}">${body}</div>`;
  const marker = (sourceItemId, poolIndex, difficultyDesign) => `<span hidden data-source52-item="${sourceItemId}" data-source52-pool="${poolIndex}" data-answer-candidate-count="1" data-difficulty-design="${difficultyDesign}"></span>`;
  const figure = (label, body, width = 560, height = 240) => `<svg class="source52-e2-figure" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}" style="display:block;width:min(${width}px,100%);height:auto;margin:14px auto 2px;overflow:visible;font-family:'Times New Roman','Batang',serif;font-variant-numeric:tabular-nums;letter-spacing:0"><g fill="none" stroke="#161616" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke">${body}</g></svg>`;
  const svgText = (x, y, value, options = "") => `<text x="${x}" y="${y}" fill="#161616" stroke="none" font-size="${options.includes("small") ? 14 : 17}" font-weight="400" text-anchor="${options.includes("center") ? "middle" : "start"}">${value}</text>`;
  const svgFractionLabel = (x, y, value, unit = "", anchor = "start") => {
    const item = rational(value.n, value.d);
    if (item.d === 1) return svgText(x, y, `${item.n}${unit}`, anchor === "center" ? "center" : "");
    const whole = Math.floor(item.n / item.d);
    const remainder = item.n % item.d;
    const fractionWidth = Math.max(String(remainder).length, String(item.d).length) * 10 + 8;
    const wholeWidth = whole ? String(whole).length * 10 + 4 : 0;
    const unitWidth = unit.length * 8 + (unit ? 3 : 0);
    const totalWidth = wholeWidth + fractionWidth + unitWidth;
    const left = anchor === "center" ? x - totalWidth / 2 : x;
    const fractionCenter = left + wholeWidth + fractionWidth / 2;
    const unitX = left + wholeWidth + fractionWidth + 3;
    const wholeText = whole ? `<text x="${left}" y="${y + 4}" fill="#161616" stroke="none" font-size="16" font-weight="400">${whole}</text>` : "";
    return `<g fill="#161616" stroke="none">${wholeText}<text x="${fractionCenter}" y="${y - 5}" fill="#161616" stroke="none" font-size="13" font-weight="400" text-anchor="middle">${remainder}</text><line x1="${left + wholeWidth}" y1="${y - 1}" x2="${left + wholeWidth + fractionWidth}" y2="${y - 1}" stroke="#161616" stroke-width="1"/><text x="${fractionCenter}" y="${y + 14}" fill="#161616" stroke="none" font-size="13" font-weight="400" text-anchor="middle">${item.d}</text>${unit ? `<text x="${unitX}" y="${y + 4}" fill="#161616" stroke="none" font-size="14" font-weight="400">${unit}</text>` : ""}</g>`;
  };

  const rectanglePartition = (data, solved = false) => {
    const x = 88;
    const y = 46;
    const width = 350;
    const height = 150;
    const split = x + width * data.leftRatio / (data.leftRatio + data.rightRatio);
    const answerX = (x + split) / 2;
    const answerLabel = solved ? `<g fill="#161616" stroke="none">${svgText(answerX, y + height / 2 + 42, "가의 넓이", "small center")}${svgFractionLabel(answerX, y + height / 2 + 64, data.answer, "cm²", "center")}</g>` : "";
    return figure("가와 나로 나눈 직사각형", `<rect x="${x}" y="${y}" width="${width}" height="${height}"/><line x1="${split}" y1="${y}" x2="${split - 18}" y2="${y + height}"/>${svgText((x + split) / 2 - 10, y + height / 2, "가", "center")}${svgText((split + x + width) / 2 + 8, y + height / 2, "나", "center")}<path d="M${x} ${y - 14}v-12M${x + width} ${y - 14}v-12M${x} ${y - 20}h${width}" stroke-width="1"/>${svgFractionLabel(x + width / 2, y - 28, data.width, "cm", "center")}<path d="M${x + width + 14} ${y}h12M${x + width + 14} ${y + height}h12M${x + width + 20} ${y}v${height}" stroke-width="1"/>${svgFractionLabel(x + width + 31, y + height / 2 + 1, data.height, "cm")}${answerLabel}`, 560, 225);
  };

  const squareStair = (data, solved = false) => {
    const leg = 168;
    const x0 = 168;
    const y0 = 196;
    const right = x0 + leg;
    let squares = "";
    for (let index = 0; index < data.count; index += 1) {
      const side = leg / (2 ** (index + 1));
      const x = right - side;
      const y = y0 - leg * (1 - 1 / (2 ** (index + 1)));
      squares += `<rect data-source52-square-index="${index + 1}" x="${x}" y="${y}" width="${side}" height="${side}"/>`;
    }
    const result = solved ? `<g fill="#161616" stroke="none">${svgText(406, 98, `처음 ${data.count}개의 넓이 합`, "small center")}${svgFractionLabel(406, 122, data.answer, "cm²", "center")}</g>` : "";
    return figure("직각이등변삼각형 안에 차례로 그린 정사각형", `<path d="M${x0} ${y0}H${right}V${y0 - leg}Z"/>${squares}<path d="M${x0} ${y0 + 14}v12M${right} ${y0 + 14}v12M${x0} ${y0 + 20}h${leg}" stroke-width="1"/>${svgText(x0 + leg / 2, y0 + 42, `${data.leg}cm`, "center")}${result}`, 560, 250);
  };

  const bouncingBall = (data, solved = false) => {
    const baseline = 202;
    const startX = 72;
    const step = 105;
    const top = height => baseline - 16 - 118 * ((height.n / height.d) / (data.initial.n / data.initial.d));
    const heights = [data.initial, multiply(data.initial, data.ratio), multiply(multiply(data.initial, data.ratio), data.ratio), multiply(multiply(multiply(data.initial, data.ratio), data.ratio), data.ratio)];
    const arcs = heights.map((height, index) => {
      const from = startX + index * step;
      const to = from + step;
      const peakX = (from + to) / 2;
      const peakY = top(height);
      return `<path d="M${from} ${baseline}Q${peakX} ${peakY} ${to} ${baseline}"/>`;
    }).join("");
    const dots = heights.map((height, index) => `<circle cx="${startX + index * step + step / 2}" cy="${top(height)}" r="4" fill="#fff"/>`).join("");
    const finalText = solved ? `<g fill="#161616" stroke="none">${svgText(445, 80, "움직인 거리", "small center")}${svgFractionLabel(445, 103, data.answer, "m", "center")}</g>` : "";
    return figure("튀어 오르는 공의 이동", `<line x1="46" y1="${baseline}" x2="514" y2="${baseline}"/><line x1="${startX}" y1="${baseline}" x2="${startX}" y2="${top(data.initial)}" stroke-width="1"/><path d="M${startX - 8} ${baseline}h-11M${startX - 8} ${top(data.initial)}h-11M${startX - 14} ${baseline}v${top(data.initial) - baseline}" stroke-width="1"/>${svgFractionLabel(8, (baseline + top(data.initial)) / 2, data.initial, "m")}${arcs}${dots}${svgText(254, 30, "이전 높이의", "center")}${svgFractionLabel(254, 50, data.ratio, "만큼", "center")}${finalText}`, 560, 235);
  };

  const SPECS = new Map();
  const define = (sourceItemId, pools, build, options = {}) => SPECS.set(sourceItemId, { sourceItemId, pools, build, ...options });

  define("5-2-u2-e2-exploration-1", [
    { capacity: rational(4, 7), filled: rational(5, 6) },
    { capacity: rational(5, 8), filled: rational(4, 5) },
    { capacity: rational(7, 9), filled: rational(3, 4) }
  ], data => {
    const answer = multiply(data.capacity, data.filled);
    return {
      prompt: `들이가 ${formatFraction(data.capacity)}L인 물통의 ${formatFraction(data.filled)}만큼 물이 들어 있습니다. 이 물통에 들어 있는 물은 몇 L인가요?`,
      answer: `${formatFraction(answer)}L`,
      solution: `전체 들이의 ${formatFraction(data.filled)}만큼이므로 ${formatFraction(data.capacity)}×${formatFraction(data.filled)}=${formatFraction(answer)}L입니다.`,
      proof: { candidates: [`${answer.n}/${answer.d}`], witness: { capacity: data.capacity, filled: data.filled } }
    };
  });

  define("5-2-u2-e2-exploration-2", [
    { first: [rational(5, 8), rational(7, 9), rational(6, 28)], second: [mixed(1, 4, 7), rational(13, 33), mixed(2, 5, 8)] },
    { first: [rational(4, 9), rational(15, 16), rational(3, 5)], second: [mixed(1, 1, 3), rational(9, 20), mixed(2, 1, 2)] },
    { first: [rational(7, 12), rational(9, 14), rational(8, 3)], second: [mixed(1, 3, 5), rational(15, 28), mixed(2, 1, 3)] }
  ], data => {
    const firstProduct = fractionProduct(data.first);
    const secondProduct = fractionProduct(data.second);
    const answer = add(firstProduct, secondProduct);
    const firstText = data.first.map(formatFraction).join("×");
    const secondText = data.second.map(formatFraction).join("×");
    return {
      prompt: `다음을 계산하세요.<div class="source52-equation source52-equation-wide">${firstText} + ${secondText}</div>`,
      answer: formatFraction(answer),
      solution: `앞의 곱은 ${formatFraction(firstProduct)}, 뒤의 곱은 ${formatFraction(secondProduct)}입니다. 두 수를 더하면 ${formatFraction(answer)}입니다.`,
      proof: { candidates: [`${answer.n}/${answer.d}`], witness: { first: data.first, second: data.second } }
    };
  }, { equation: true });

  define("5-2-u2-e2-example-1", [
    { end: 35 }, { end: 43 }, { end: 55 }
  ], data => {
    const answer = rational((data.end + 1) * (data.end + 2), 12);
    return {
      prompt: `다음을 계산하세요.<div class="source52-equation source52-equation-wide">(1+2/3)×(1+2/4)×(1+2/5)×…×(1+2/${data.end})</div>`,
      answer: formatFraction(answer),
      solution: `각 항은 (분모+2)/분모입니다. 가운데 항이 약분되어 ${(data.end + 1)}×${data.end + 2}÷(3×4)=${formatFraction(answer)}입니다.`,
      proof: { candidates: [`${answer.n}/${answer.d}`], witness: { start: 3, end: data.end } }
    };
  }, { equation: true });

  define("5-2-u2-e2-example-2", [
    { width: mixed(5, 5, 8), height: mixed(2, 5, 12), leftRatio: 4, rightRatio: 5 },
    { width: mixed(5, 1, 6), height: mixed(3, 3, 5), leftRatio: 3, rightRatio: 4 },
    { width: mixed(7, 1, 5), height: mixed(2, 1, 3), leftRatio: 5, rightRatio: 2 }
  ], data => {
    const total = multiply(data.width, data.height);
    const answer = multiply(total, rational(data.leftRatio, data.leftRatio + data.rightRatio));
    const diagramData = { ...data, answer };
    return {
      prompt: `그림과 같이 직사각형을 가, 나 두 부분으로 나누었습니다. 가의 넓이가 나의 넓이의 ${data.leftRatio}/${data.rightRatio}일 때, 가의 넓이를 구하세요.${rectanglePartition(diagramData)}`,
      answer: `${formatFraction(answer)}cm²`,
      solution: `직사각형의 넓이는 ${formatFraction(data.width)}×${formatFraction(data.height)}=${formatFraction(total)}cm²입니다. 가:나는 ${data.leftRatio}:${data.rightRatio}이므로 가는 전체의 ${data.leftRatio}/${data.leftRatio + data.rightRatio}입니다. 따라서 ${formatFraction(answer)}cm²입니다.`,
      answerVisualBody: rectanglePartition(diagramData, true),
      proof: { candidates: [`${answer.n}/${answer.d}`], witness: { width: data.width, height: data.height, leftRatio: data.leftRatio, rightRatio: data.rightRatio } }
    };
  }, { visual: true, answerVisual: true });

  define("5-2-u2-e2-example-3", [
    { initial: mixed(7, 7, 8), ratio: rational(2, 3) },
    { initial: mixed(6, 3, 4), ratio: rational(3, 4) },
    { initial: mixed(9, 5, 8), ratio: rational(3, 5) }
  ], data => {
    const firstRise = multiply(data.initial, data.ratio);
    const secondRise = multiply(firstRise, data.ratio);
    const answer = add(add(data.initial, multiply(integer(2), firstRise)), secondRise);
    return {
      prompt: `${formatFraction(data.initial)}m의 높이에서 공을 떨어뜨렸습니다. 이 공은 떨어진 높이의 ${formatFraction(data.ratio)}만큼 튀어 오릅니다. 두 번째로 튀어 올랐을 때까지 공이 움직인 거리를 모두 구하세요.`,
      answer: `${formatFraction(answer)}m`,
      solution: `처음 내려온 거리는 ${formatFraction(data.initial)}m입니다. 첫째 튀어 오른 높이는 ${formatFraction(firstRise)}m, 둘째 튀어 오른 높이는 ${formatFraction(secondRise)}m입니다. 첫째 높이는 올라가고 내려온 두 번을 더하므로 ${formatFraction(data.initial)}+2×${formatFraction(firstRise)}+${formatFraction(secondRise)}=${formatFraction(answer)}m입니다.`,
      proof: { candidates: [`${answer.n}/${answer.d}`], witness: { initial: data.initial, ratio: data.ratio } }
    };
  });

  define("5-2-u2-e2-example-4", [
    { leg: 8, count: 5 }, { leg: 10, count: 4 }, { leg: 12, count: 6 }
  ], data => {
    const firstArea = rational(data.leg * data.leg, 4);
    const terms = Array.from({ length: data.count }, (_, index) => divide(firstArea, integer(4 ** index)));
    const answer = terms.reduce(add, integer(0));
    const diagramData = { ...data, answer };
    return {
      prompt: `다음 그림은 직각을 이루는 두 변의 길이가 ${data.leg}cm인 직각이등변삼각형 안에 정사각형을 차례로 그린 것입니다. 처음 ${data.count}개의 정사각형의 넓이의 합을 구하세요.${squareStair(diagramData)}`,
      answer: `${formatFraction(answer)}cm²`,
      solution: `첫 정사각형의 한 변은 ${data.leg}÷2=${data.leg / 2}cm이므로 넓이는 ${formatFraction(firstArea)}cm²입니다. 다음 정사각형의 넓이는 앞의 1/4배입니다. ${terms.map(formatFraction).join("+")}=${formatFraction(answer)}cm²입니다.`,
      answerVisualBody: squareStair(diagramData, true),
      proof: { candidates: [`${answer.n}/${answer.d}`], witness: terms }
    };
  }, { visual: true, answerVisual: true });

  const missionOnePools = {
    "5-2-u2-e2-mission-1-1": [
      [rational(7, 8), rational(5, 28), rational(4, 5)],
      [rational(9, 14), rational(7, 15), rational(10, 21)],
      [rational(11, 12), rational(9, 22), rational(8, 9)]
    ],
    "5-2-u2-e2-mission-1-2": [
      [mixed(2, 1, 7), mixed(1, 1, 5), rational(7, 12)],
      [mixed(1, 1, 2), mixed(2, 2, 3), rational(3, 8)],
      [mixed(3, 3, 5), mixed(1, 1, 4), rational(4, 9)]
    ],
    "5-2-u2-e2-mission-1-3": [
      [mixed(1, 1, 5), rational(2, 3), rational(3, 8)],
      [mixed(2, 1, 4), rational(5, 6), rational(1, 2)],
      [mixed(1, 3, 7), rational(4, 7), rational(5, 14)]
    ],
    "5-2-u2-e2-mission-1-4": [
      [mixed(4, 1, 6), mixed(2, 3, 4), rational(6, 7)],
      [mixed(5, 1, 3), mixed(2, 5, 6), rational(3, 5)],
      [mixed(3, 3, 4), mixed(1, 7, 8), rational(8, 9)]
    ],
    "5-2-u2-e2-mission-1-5": [
      [rational(4, 15), rational(5, 6), mixed(2, 4, 7)],
      [rational(7, 18), rational(9, 14), mixed(1, 5, 6)],
      [rational(5, 12), rational(8, 15), mixed(2, 1, 4)]
    ],
    "5-2-u2-e2-mission-1-6": [
      [integer(15), mixed(1, 4, 9)],
      [integer(18), mixed(2, 1, 6)],
      [integer(14), mixed(3, 2, 7)]
    ]
  };
  Object.entries(missionOnePools).forEach(([sourceItemId, pools]) => define(sourceItemId, pools, values => {
    const kind = sourceItemId.at(-1);
    let expression;
    let answer;
    if (kind === "3") {
      answer = multiply(values[0], add(values[1], values[2]));
      expression = `${formatFraction(values[0])}×(${formatFraction(values[1])}+${formatFraction(values[2])})`;
    } else if (kind === "4") {
      answer = multiply(subtract(values[0], values[1]), values[2]);
      expression = `(${formatFraction(values[0])}-${formatFraction(values[1])})×${formatFraction(values[2])}`;
    } else {
      answer = fractionProduct(values);
      expression = values.map(formatFraction).join("×");
    }
    return {
      prompt: `다음을 계산하세요.<div class="source52-equation">${expression}</div>`,
      answer: formatFraction(answer),
      solution: `대분수는 가분수로 바꾸고, 곱셈과 덧셈·뺄셈의 순서에 따라 계산하여 약분하면 ${formatFraction(answer)}입니다.`,
      proof: { candidates: [`${answer.n}/${answer.d}`], witness: values }
    };
  }, { equation: true }));

  define("5-2-u2-e2-mission-2", [
    { school: mixed(4, 4, 5), cityRatio: mixed(2, 1, 2), fireRatio: mixed(2, 2, 3) },
    { school: mixed(3, 3, 4), cityRatio: mixed(1, 3, 5), fireRatio: mixed(3, 1, 3) },
    { school: mixed(5, 1, 4), cityRatio: mixed(2, 2, 7), fireRatio: mixed(1, 5, 6) }
  ], data => {
    const city = multiply(data.school, data.cityRatio);
    const answer = multiply(city, data.fireRatio);
    return {
      prompt: `예리네 집에서 학교까지의 거리는 ${formatFraction(data.school)}km입니다. 집에서 시청까지의 거리는 집에서 학교까지 거리의 ${formatFraction(data.cityRatio)}배이고, 집에서 소방서까지의 거리는 집에서 시청까지 거리의 ${formatFraction(data.fireRatio)}배입니다. 예리네 집에서 소방서까지의 거리를 구하세요.`,
      answer: `${formatFraction(answer)}km`,
      solution: `집에서 시청까지는 ${formatFraction(data.school)}×${formatFraction(data.cityRatio)}=${formatFraction(city)}km입니다. 소방서까지는 ${formatFraction(city)}×${formatFraction(data.fireRatio)}=${formatFraction(answer)}km입니다.`,
      proof: { candidates: [`${answer.n}/${answer.d}`], witness: { school: data.school, cityRatio: data.cityRatio, fireRatio: data.fireRatio } }
    };
  });

  const fractionAt = position => {
    let consumed = 0;
    for (let denominator = 2; denominator <= 200; denominator += 1) {
      const next = consumed + denominator - 1;
      if (position <= next) return rational(position - consumed, denominator);
      consumed = next;
    }
    throw new Error("분수열 위치가 범위를 벗어났습니다.");
  };
  define("5-2-u2-e2-mission-3", [
    { position: 21, multiplier: mixed(4, 2, 3) },
    { position: 28, multiplier: mixed(4, 4, 7) },
    { position: 36, multiplier: mixed(5, 5, 8) }
  ], data => {
    const term = fractionAt(data.position);
    const answer = multiply(term, data.multiplier);
    return {
      prompt: `다음과 같이 분수를 일정한 규칙으로 늘어놓았습니다. ${data.position}째 분수와 ${formatFraction(data.multiplier)}의 곱을 구하세요.<div class="source52-equation source52-equation-wide">1/2, 1/3, 2/3, 1/4, 2/4, 3/4, 1/5, …</div>`,
      answer: formatFraction(answer),
      solution: `분모가 2, 3, …인 분수는 차례로 1개, 2개, …입니다. ${data.position}째 분수는 ${formatFraction(term)}이므로 ${formatFraction(term)}×${formatFraction(data.multiplier)}=${formatFraction(answer)}입니다.`,
      proof: { candidates: [`${answer.n}/${answer.d}`], witness: { position: data.position, multiplier: data.multiplier, term } }
    };
  }, { equation: true });

  define("5-2-u2-e2-mission-4", [
    { start: 5, count: 100 }, { start: 4, count: 80 }, { start: 7, count: 60 }
  ], data => {
    const numeratorLast = data.start + 3 * (data.count - 1);
    const denominatorLast = data.start + 6 + 3 * (data.count - 1);
    const answer = rational(data.start * (data.start + 3), (denominatorLast - 3) * denominatorLast);
    const firstFour = [0, 1, 2, 3].map(index => `${data.start + 3 * index}/${data.start + 6 + 3 * index}`).join(", ");
    return {
      prompt: `일정한 규칙에 따라 나열된 분수들이 있습니다. 처음부터 ${data.count}번째 분수까지의 곱을 구하세요.<div class="source52-equation source52-equation-wide">${firstFour}, …</div>`,
      answer: formatFraction(answer),
      solution: `분모의 앞부분은 두 항 뒤의 분자와 약분됩니다. 따라서 처음 두 분자 ${data.start}, ${data.start + 3}과 마지막 두 분모 ${denominatorLast - 3}, ${denominatorLast}만 남아 ${formatFraction(answer)}입니다.`,
      proof: { candidates: [`${answer.n}/${answer.d}`], witness: { start: data.start, count: data.count, numeratorLast, denominatorLast } }
    };
  }, { equation: true });

  define("5-2-u2-e2-mission-5", [
    { initial: mixed(8, 4, 7), ratio: rational(3, 4) },
    { initial: mixed(5, 5, 8), ratio: rational(2, 3) },
    { initial: mixed(7, 7, 9), ratio: rational(4, 5) }
  ], data => {
    const firstRise = multiply(data.initial, data.ratio);
    const secondRise = multiply(firstRise, data.ratio);
    const thirdRise = multiply(secondRise, data.ratio);
    const answer = add(add(add(data.initial, multiply(integer(2), firstRise)), multiply(integer(2), secondRise)), thirdRise);
    const diagramData = { ...data, answer };
    return {
      prompt: `떨어진 높이의 ${formatFraction(data.ratio)}만큼 튀어 오르는 공이 있습니다. 이 공을 ${formatFraction(data.initial)}m의 높이에서 떨어뜨렸을 때, 세 번째로 튀어 올랐을 때까지 공이 움직인 거리를 모두 구하세요.${bouncingBall(diagramData)}`,
      answer: `${formatFraction(answer)}m`,
      solution: `첫째, 둘째, 셋째 튀어 오른 높이는 각각 ${formatFraction(firstRise)}m, ${formatFraction(secondRise)}m, ${formatFraction(thirdRise)}m입니다. 처음 하강과 첫째·둘째 높이의 왕복, 셋째 상승을 더하면 ${formatFraction(data.initial)}+2×${formatFraction(firstRise)}+2×${formatFraction(secondRise)}+${formatFraction(thirdRise)}=${formatFraction(answer)}m입니다.`,
      answerVisualBody: bouncingBall(diagramData, true),
      proof: { candidates: [`${answer.n}/${answer.d}`], witness: { initial: data.initial, ratio: data.ratio } }
    };
  }, { visual: true, answerVisual: true });

  const generateSource = (sourceItemId, seed, difficultyOffset = 0) => {
    const spec = SPECS.get(sourceItemId);
    if (!spec) return null;
    const poolIndex = poolIndexForSeed(seed, spec.pools.length);
    const built = spec.build(spec.pools[poolIndex]);
    uniqueAnswer(Array.isArray(built.proof?.candidates) && built.proof.candidates.length === 1, sourceItemId, "독립 계산에서 정답 후보가 하나가 아닙니다.");
    const difficultyDesign = Number(difficultyOffset) < 0 ? "guided-source" : Number(difficultyOffset) > 0 ? "independent-source" : "source";
    return {
      prompt: `${built.prompt}${marker(sourceItemId, poolIndex, difficultyDesign)}`,
      answer: built.answer,
      solution: built.solution,
      answerVisual: built.answerVisualBody ? answerVisual(sourceItemId, poolIndex, built.answerVisualBody) : "",
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
      reviewReason: "현행 심화 원문 구조와 독립 계산을 확인한 고정 변형입니다.",
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
