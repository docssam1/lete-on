(() => {
  "use strict";

  const api = window.HSE_GENERATORS;
  if (!api) throw new Error("E2 도형 생성기에는 HSE_GENERATORS가 필요합니다.");
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  const freeze = value => {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze);
      Object.freeze(value);
    }
    return value;
  };
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const rational = (numerator, denominator = 1n) => {
    check(denominator !== 0n, "0으로 나눌 수 없습니다.");
    if (denominator < 0n) { numerator = -numerator; denominator = -denominator; }
    const divisor = gcd(numerator < 0n ? -numerator : numerator, denominator);
    return { n: numerator / divisor, d: denominator / divisor };
  };
  const integer = value => rational(BigInt(value));
  const decimal = text => {
    check(/^\d+(?:\.\d+)?$/.test(String(text)), "유한 소수가 필요합니다.");
    const [whole, fraction = ""] = String(text).split(".");
    return rational(BigInt(whole + fraction), 10n ** BigInt(fraction.length));
  };
  const add = (a, b) => rational(a.n * b.d + b.n * a.d, a.d * b.d);
  const sub = (a, b) => rational(a.n * b.d - b.n * a.d, a.d * b.d);
  const mul = (a, b) => rational(a.n * b.n, a.d * b.d);
  const div = (a, b) => rational(a.n * b.d, a.d * b.n);
  const compare = (a, b) => a.n * b.d - b.n * a.d;
  const equal = (a, b) => compare(a, b) === 0n;
  const positive = (...values) => check(values.every(value => value.n > 0n), "길이와 넓이는 양수여야 합니다.");
  const fmt = value => {
    check(value.n >= 0n, "표시할 값은 음수가 아니어야 합니다.");
    let remainder = value.n % value.d, text = String(value.n / value.d), count = 0;
    if (remainder) text += ".";
    while (remainder) {
      check(count++ < 6, "표시할 답은 소수 여섯 자리 이내로 정확해야 합니다.");
      remainder *= 10n;
      text += String(remainder / value.d);
      remainder %= value.d;
    }
    return text;
  };
  const fractionText = value => `${value.n}/${value.d}`;
  const number = value => Number(value.n) / Number(value.d);
  const point = (x, y) => ({ x, y });
  const minus = (a, b) => point(sub(a.x, b.x), sub(a.y, b.y));
  const cross = (a, b) => sub(mul(a.x, b.y), mul(a.y, b.x));
  const two = integer(2), zero = integer(0);

  function intersection(a, b, c, d) {
    const ab = minus(b, a), cd = minus(d, c), determinant = cross(ab, cd);
    check(determinant.n !== 0n, "교차하는 두 선이 평행합니다.");
    const t = div(cross(minus(c, a), cd), determinant);
    const u = div(cross(minus(c, a), ab), determinant);
    check(compare(t, zero) > 0n && compare(t, integer(1)) < 0n && compare(u, zero) > 0n && compare(u, integer(1)) < 0n, "교점은 두 선분의 안쪽에 있어야 합니다.");
    return point(add(a.x, mul(t, ab.x)), add(a.y, mul(t, ab.y)));
  }
  function area(points, names) {
    let twice = zero;
    names.forEach((name, index) => {
      const a = points[name], b = points[names[(index + 1) % names.length]];
      twice = add(twice, sub(mul(a.x, b.y), mul(a.y, b.x)));
    });
    return div(rational(twice.n < 0n ? -twice.n : twice.n, twice.d), two);
  }
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const math = expression => `<span class="math-inline-expression">${esc(expression)}</span>`;
  const coord = value => Number(value.toFixed(4));
  const vector = (a, b) => ({ x: b.x - a.x, y: b.y - a.y });
  const normalized = v => {
    const length = Math.hypot(v.x, v.y);
    check(length > 0, "방향을 구할 수 없는 선분입니다.");
    return { x: v.x / length, y: v.y / length };
  };
  const normal = (a, b) => { const v = normalized(vector(a, b)); return { x: -v.y, y: v.x }; };

  function project(world, leftName, rightName, topName, bounds) {
    const left = world[leftName].x, right = world[rightName].x, height = world[topName].y;
    positive(sub(right, left), height);
    return Object.fromEntries(Object.entries(world).map(([name, p]) => [name, {
      x: bounds.left + number(div(sub(p.x, left), sub(right, left))) * (bounds.right - bounds.left),
      y: bounds.bottom - number(div(p.y, height)) * (bounds.bottom - bounds.top)
    }]));
  }
  function projectMetric(world, leftName, rightName, topName, bounds) {
    const left = world[leftName].x, bottom = world[leftName].y;
    const width = sub(world[rightName].x, left), height = sub(world[topName].y, bottom);
    positive(width, height);
    const availableWidth = integer(bounds.right - bounds.left), availableHeight = integer(bounds.bottom - bounds.top);
    const sx = div(availableWidth, width), sy = div(availableHeight, height);
    const scale = compare(sx, sy) < 0n ? sx : sy;
    const originX = add(integer(bounds.left), div(sub(availableWidth, mul(width, scale)), two));
    const originY = sub(integer(bounds.bottom), div(sub(availableHeight, mul(height, scale)), two));
    return Object.fromEntries(Object.entries(world).map(([name, p]) => [name, {
      x: number(add(originX, mul(sub(p.x, left), scale))),
      y: number(sub(originY, mul(sub(p.y, bottom), scale)))
    }]));
  }
  const line = (points, from, to, role, extra = "") => `<line data-layout-role="${role}" data-from="${from}" data-to="${to}" x1="${coord(points[from].x)}" y1="${coord(points[from].y)}" x2="${coord(points[to].x)}" y2="${coord(points[to].y)}" ${extra}/>`;
  function rightAngle(points, vertex, first, second, className) {
    const p = points[vertex], u = normalized(vector(p, points[first])), v = normalized(vector(p, points[second])), radius = 10;
    check(Math.abs(u.x * v.x + u.y * v.y) < 1e-10, "직각 표시는 실제 수직인 선에만 붙일 수 있습니다.");
    const a = { x: p.x + u.x * radius, y: p.y + u.y * radius };
    const b = { x: a.x + v.x * radius, y: a.y + v.y * radius };
    const c = { x: p.x + v.x * radius, y: p.y + v.y * radius };
    return `<path class="${className}" data-layout-role="right-angle" data-owner-id="right-angle-${vertex}" data-angle-vertex="${vertex}" data-angle-start="${first}" data-angle-end="${second}" d="M${coord(a.x)},${coord(a.y)} L${coord(b.x)},${coord(b.y)} L${coord(c.x)},${coord(c.y)}"/>`;
  }
  function outward(points, name, previous, next) {
    const u = normalized(vector(points[name], points[previous])), v = normalized(vector(points[name], points[next]));
    return normalized({ x: -u.x - v.x, y: -u.y - v.y });
  }
  const text = (value, p, attributes = "", className = "") => `<text${className ? ` class="${className}"` : ""} x="${coord(p.x)}" y="${coord(p.y)}" dominant-baseline="middle" ${attributes}>${esc(value)}</text>`;
  function pointLabel(points, name, direction, distance = 25) {
    const p = points[name], position = { x: p.x + direction.x * distance, y: p.y + direction.y * distance };
    return text(name, position, `data-label-for="${name}" data-owner-id="point-${name}" data-layout-role="point-label" data-label-normal="${coord(direction.x)},${coord(direction.y)}" data-label-distance="${distance}"`);
  }
  const modelEvidence = (world, svgPoints, polygons, segments, projection = "common-axis-affine") => freeze({
    worldPoints: Object.fromEntries(Object.entries(world).map(([name, p]) => [name, { x: fractionText(p.x), y: fractionText(p.y) }])),
    svgPoints: Object.fromEntries(Object.entries(svgPoints).map(([name, p]) => [name, { x: coord(p.x), y: coord(p.y) }])),
    polygons, segments, projection
  });
  const sourceEvidence = (mission, numbers, answer, reading) => freeze({
    sourceImage: `mission${mission}-source.png`, pdfPage: 19, printedPage: 21,
    originalNumbers: numbers, originalAnswer: answer, originalAnswerStatus: "independently-computed",
    publisherAnswerVerified: false, handwritingReading: reading,
    handwritingStatus: mission === 3 ? "ambiguous" : "legible",
    handwritingReadingConfirmed: mission !== 3, handwrittenAnswerVerified: false,
    handwritingAgreesWithCalculation: mission === 3 ? null : true,
    handwritingConflict: mission === 3 ? null : false
  });

  function mission3(data, level) {
    const [height100, large100, small100] = data;
    const height = rational(BigInt(height100), 100n), large = rational(BigInt(large100), 100n), small = rational(BigInt(small100), 100n);
    const gap = sub(large, small), ratio = div(large, small);
    positive(height, large, small, gap);
    const largeArea = div(mul(height, large), two), smallArea = div(mul(height, small), two), sumArea = add(largeArea, smallArea);
    const world = { "ㄱ": point(zero, height), "ㄴ": point(zero, zero), "ㄷ": point(large, zero), "ㄹ": point(large, height), "ㅁ": point(gap, zero) };
    const points = project(world, "ㄴ", "ㄷ", "ㄱ", { left: 100, right: 380, top: 36, bottom: 184 });
    const crossPoint = intersection(world["ㄱ"], world["ㄷ"], world["ㄹ"], world["ㅁ"]);
    const shadePoints = project({ ...world, cross: crossPoint }, "ㄴ", "ㄷ", "ㄱ", { left: 100, right: 380, top: 36, bottom: 184 });
    check(equal(area(world, ["ㄱ", "ㄴ", "ㄷ"]), largeArea) && equal(area(world, ["ㄹ", "ㅁ", "ㄷ"]), smallArea), "삼각형의 넓이와 모델이 다릅니다.");
    const segments = [["ㄱ", "ㄹ", "equal-height-guide"], ["ㄱ", "ㄴ", "large-height"], ["ㄴ", "ㄷ", "shared-baseline"], ["ㄱ", "ㄷ", "large-sloping-side"], ["ㄹ", "ㄷ", "small-height"], ["ㄹ", "ㅁ", "small-sloping-side"]];
    const labels = pointLabel(points, "ㄱ", outward(points, "ㄱ", "ㄴ", "ㄹ"))
      + pointLabel(points, "ㄴ", outward(points, "ㄴ", "ㄱ", "ㄷ"))
      + pointLabel(points, "ㄷ", outward(points, "ㄷ", "ㄴ", "ㄹ"))
      + pointLabel(points, "ㄹ", outward(points, "ㄹ", "ㄱ", "ㄷ"))
      + pointLabel(points, "ㅁ", normal(points["ㄴ"], points["ㄷ"]));
    const heightMid = { x: points["ㄱ"].x - 66, y: (points["ㄱ"].y + points["ㄴ"].y) / 2 };
    const dimensionX = points["ㄱ"].x - 28;
    const answer = `${fmt(gap)}cm`;
    const diagram = solved => `<svg class="geometry-diagram source62-overlap-triangle-bases" data-renderer="source62-e2-model" viewBox="0 0 460 270" role="img" aria-label="같은 높이의 삼각형 ㄱㄴㄷ과 ㄹㅁㄷ, 점 ㄴ·ㅁ·ㄷ 순서" data-geometry-kind="same-height-overlap-triangles" data-source-item="6-2-u2-e2-mission-3" data-phase="${solved ? "answer" : "problem"}" data-target-segment="ㄴ-ㅁ">
      <polygon class="source62-e2-source-shade" data-layout-role="source-shading" data-owner-id="triangle-union" points="${["ㄱ", "ㄴ", "ㄷ", "ㄹ", "cross"].map(name => `${coord(shadePoints[name].x)},${coord(shadePoints[name].y)}`).join(" ")}"/>
      ${segments.map(([from, to, role]) => line(points, from, to, role, role === "equal-height-guide" ? 'stroke-dasharray="5 4"' : "")).join("")}
      ${rightAngle(points, "ㄴ", "ㄱ", "ㄷ", "source62-triangle-right-angle")}${rightAngle(points, "ㄹ", "ㄱ", "ㄷ", "source62-triangle-right-angle")}${rightAngle(points, "ㄷ", "ㄹ", "ㄴ", "source62-triangle-right-angle")}
      <g data-owner-id="large-height" data-layout-role="dimension"><line class="source62-triangle-measure" x1="${dimensionX}" y1="36" x2="${dimensionX}" y2="184"/><path class="source62-triangle-measure-tick" d="M${dimensionX - 5},36h10 M${dimensionX - 5},184h10"/>${text(`${fmt(height)}cm`, heightMid, 'data-owner-id="large-height" data-layout-role="given-value"', "source62-triangle-height-label")}</g>
      ${labels}${solved ? `${line(points, "ㄴ", "ㅁ", "target-segment", 'class="source62-triangle-target"')}${text(answer, { x: (points["ㄴ"].x + points["ㅁ"].x) / 2, y: points["ㄴ"].y + 62 }, 'data-owner-id="target-segment" data-layout-role="answer-value"', "source62-triangle-answer-label")}` : ""}
    </svg>`;
    const given = level === 0 ? `선분 ㄴㄷ의 길이는 ${fmt(large)}cm입니다.` : level === 1 ? `삼각형 ㄱㄴㄷ의 넓이는 ${fmt(largeArea)}cm²입니다.` : `두 삼각형의 넓이의 합은 ${fmt(sumArea)}cm²입니다.`;
    const areaStep = level === 2 ? `작은 삼각형의 넓이는 ${math(`${fmt(sumArea)}÷${fmt(add(ratio, integer(1)))}=${fmt(smallArea)}`)}cm²입니다. 큰 삼각형의 넓이는 ${math(`${fmt(smallArea)}×${fmt(ratio)}=${fmt(largeArea)}`)}cm²입니다. ` : "";
    const baseStep = level === 0 ? "" : `ㄴㄷ의 길이는 ${math(`${fmt(largeArea)}×2÷${fmt(height)}=${fmt(large)}`)}cm입니다. `;
    return {
      prompt: `그림에서 삼각형 ㄱㄴㄷ의 넓이는 삼각형 ㄹㅁㄷ의 넓이의 ${fmt(ratio)}배입니다. ${given} 선분 ㄴㅁ의 길이는 몇 cm인가요?${diagram(false)}`,
      answer, solution: `${areaStep}${baseStep}두 삼각형의 높이가 같으므로 밑변의 비도 같습니다. ㅁㄷ은 ${math(`${fmt(large)}÷${fmt(ratio)}=${fmt(small)}`)}cm입니다. ㄴㅁ은 ${math(`${fmt(large)}-${fmt(small)}=${fmt(gap)}`)}cm입니다.`,
      answerVisual: diagram(true),
      exactValues: { height: fmt(height), ratio: fmt(ratio), largeBase: fmt(large), smallBase: fmt(small), largeArea: fmt(largeArea), smallArea: fmt(smallArea), sumArea: fmt(sumArea), targetLength: fmt(gap) },
      geometryModel: modelEvidence(world, points, [{ id: "large-triangle", vertices: ["ㄱ", "ㄴ", "ㄷ"], area: fmt(largeArea) }, { id: "small-triangle", vertices: ["ㄹ", "ㅁ", "ㄷ"], area: fmt(smallArea) }], segments),
      intersection: { x: fractionText(crossPoint.x), y: fractionText(crossPoint.y) }
    };
  }

  function mission4(data, level) {
    const [left100, right100, union100, base100] = data;
    const leftArea = rational(BigInt(left100), 100n), rightArea = rational(BigInt(right100), 100n), union = rational(BigInt(union100), 100n), base = rational(BigInt(base100), 100n);
    const sum = add(leftArea, rightArea), overlap = sub(sum, union), outside = sub(sum, mul(two, overlap));
    const height = div(mul(two, overlap), base), leftHeight = mul(height, decimal("1.5")), rightHeight = mul(height, decimal("1.3"));
    const leftBase = div(mul(two, leftArea), leftHeight), rightBase = div(mul(two, rightArea), rightHeight), sx = div(base, two);
    positive(overlap, outside, height, sub(leftBase, base), sub(rightBase, base));
    const world = {
      "ㄴ": point(sub(base, leftBase), zero), "ㅁ": point(zero, zero), "ㄷ": point(base, zero), "ㅂ": point(rightBase, zero),
      "ㄱ": point(add(base, mul(sub(sx, base), div(leftHeight, height))), leftHeight),
      "ㄹ": point(mul(sx, div(rightHeight, height)), rightHeight)
    };
    world["ㅅ"] = intersection(world["ㄱ"], world["ㄷ"], world["ㄹ"], world["ㅁ"]);
    world["ㅇ"] = point(world["ㅅ"].x, zero);
    check(equal(world["ㅅ"].x, sx) && equal(world["ㅅ"].y, height), "실제 교점이 겹친 삼각형의 꼭짓점과 다릅니다.");
    const baseline = ["ㄴ", "ㅁ", "ㅇ", "ㄷ", "ㅂ"];
    check(baseline.every((name, index) => index === 0 || compare(world[baseline[index - 1]].x, world[name].x) < 0n), "밑변은 ㄴ·ㅁ·ㅇ·ㄷ·ㅂ 순서여야 합니다.");
    check(equal(area(world, ["ㄱ", "ㄴ", "ㄷ"]), leftArea) && equal(area(world, ["ㄹ", "ㅁ", "ㅂ"]), rightArea) && equal(area(world, ["ㅅ", "ㅁ", "ㄷ"]), overlap), "원문 넓이와 실제 삼각형의 넓이비가 다릅니다.");
    const points = project(world, "ㄴ", "ㅂ", "ㄱ", { left: 40, right: 460, top: 40, bottom: 330 });
    const segments = [["ㄱ", "ㄴ", "left-outer-side"], ["ㄱ", "ㄷ", "left-crossing-side"], ["ㄴ", "ㄷ", "left-base"], ["ㄹ", "ㅁ", "right-crossing-side"], ["ㄹ", "ㅂ", "right-outer-side"], ["ㅁ", "ㅂ", "right-base"], ["ㅅ", "ㅇ", "target-height"]];
    const down = normal(points["ㄴ"], points["ㅂ"]);
    const su = normalized(vector(points["ㅅ"], points["ㄱ"])), sv = normalized(vector(points["ㅅ"], points["ㅁ"]));
    const crossLabelNormal = normalized({ x: su.x + sv.x, y: su.y + sv.y });
    const labels = pointLabel(points, "ㄱ", outward(points, "ㄱ", "ㄴ", "ㄷ"))
      + pointLabel(points, "ㄹ", outward(points, "ㄹ", "ㅁ", "ㅂ"))
      + pointLabel(points, "ㄴ", outward(points, "ㄴ", "ㄱ", "ㄷ"))
      + pointLabel(points, "ㅂ", outward(points, "ㅂ", "ㄹ", "ㅁ"))
      + ["ㅁ", "ㅇ", "ㄷ"].map(name => pointLabel(points, name, down)).join("")
      + pointLabel(points, "ㅅ", crossLabelNormal, 28);
    const answer = `${fmt(height)}cm`, bracketY = points["ㅇ"].y + 50;
    const viewportTopPadding = 16;
    const diagram = solved => `<svg class="geometry-diagram source62-overlap-height" data-renderer="source62-e2-model" viewBox="0 ${-viewportTopPadding} 500 ${460 + viewportTopPadding}" role="img" aria-label="왼쪽 꼭짓점이 더 높은 두 삼각형의 실제 교점 ㅅ, 겹친 삼각형 ㅅㅁㄷ과 높이 ㅅㅇ" data-geometry-kind="two-overlapping-triangles-height" data-source-item="6-2-u2-e2-mission-4" data-phase="${solved ? "answer" : "problem"}" data-target-segment="ㅅ-ㅇ">
      <polygon class="source62-overlap-region" data-layout-role="overlap-region" data-owner-id="triangle-ㅅㅁㄷ" points="${["ㅅ", "ㅁ", "ㄷ"].map(name => `${coord(points[name].x)},${coord(points[name].y)}`).join(" ")}"/>
      ${segments.map(([from, to, role]) => line(points, from, to, role, role === "target-height" ? 'stroke-dasharray="5 4"' : "")).join("")}
      <circle class="source62-overlap-cross-point" data-owner-id="point-ㅅ" data-layout-role="intersection" cx="${coord(points["ㅅ"].x)}" cy="${coord(points["ㅅ"].y)}" r="1.8"/>
      ${rightAngle(points, "ㅇ", "ㅅ", "ㄷ", "source62-overlap-right-angle")}${labels}
      <path class="source62-overlap-bracket" data-layout-role="dimension" data-owner-id="segment-ㅁㄷ" d="M${coord(points["ㅁ"].x)},${bracketY - 7}v7 H${coord(points["ㄷ"].x)}v-7"/>
      ${text(`${fmt(base)}cm`, { x: points["ㅇ"].x, y: bracketY + 25 }, 'data-owner-id="segment-ㅁㄷ" data-layout-role="given-value"', "source62-overlap-base-label")}
      ${solved ? text(`ㅅㅇ = ${answer}`, { x: points["ㅇ"].x, y: bracketY + 64 }, 'data-owner-id="target-height" data-layout-role="answer-value"', "source62-overlap-result") : ""}
    </svg>`;
    const given = level === 0 ? `겹친 부분의 넓이는 ${fmt(overlap)}cm²입니다.` : level === 1 ? `삼각형 ㄱㄴㄷ의 넓이는 ${fmt(leftArea)}cm², 삼각형 ㄹㅁㅂ의 넓이는 ${fmt(rightArea)}cm²이고 전체 넓이는 ${fmt(union)}cm²입니다.` : `두 삼각형의 넓이의 합은 ${fmt(sum)}cm²이고 겹치지 않은 두 부분의 넓이의 합은 ${fmt(outside)}cm²입니다.`;
    const areaStep = level === 0 ? "" : level === 1 ? `겹친 넓이는 ${math(`${fmt(leftArea)}+${fmt(rightArea)}-${fmt(union)}=${fmt(overlap)}`)}cm²입니다. ` : `두 넓이의 합에서 겹치지 않은 넓이를 빼면 겹친 넓이가 두 번 남습니다. 겹친 넓이는 ${math(`(${fmt(sum)}-${fmt(outside)})÷2=${fmt(overlap)}`)}cm²입니다. `;
    return { prompt: `그림과 같이 두 삼각형을 겹쳐 놓았습니다. ${given} 선분 ㅅㅇ의 길이는 몇 cm인가요?${diagram(false)}`,
      answer, solution: `${areaStep}겹친 삼각형의 밑변 ㅁㄷ은 ${fmt(base)}cm이므로 높이 ㅅㅇ은 ${math(`${fmt(overlap)}×2÷${fmt(base)}=${fmt(height)}`)}cm입니다.`, answerVisual: diagram(true),
      exactValues: { leftArea: fmt(leftArea), rightArea: fmt(rightArea), unionArea: fmt(union), sumArea: fmt(sum), nonoverlapArea: fmt(outside), overlapArea: fmt(overlap), overlapBase: fmt(base), targetHeight: fmt(height) },
      geometryModel: modelEvidence(world, points, [{ id: "left-triangle", vertices: ["ㄱ", "ㄴ", "ㄷ"], area: fmt(leftArea) }, { id: "right-triangle", vertices: ["ㄹ", "ㅁ", "ㅂ"], area: fmt(rightArea) }, { id: "overlap-triangle", vertices: ["ㅅ", "ㅁ", "ㄷ"], area: fmt(overlap) }], segments)
    };
  }

  function mission6(data, level) {
    const [top100, left100, right100, bottomHeightText] = data;
    const topRight = rational(BigInt(top100), 100n), bottomLeft = rational(BigInt(left100), 100n), bottomRight = rational(BigInt(right100), 100n), bottomHeight = decimal(bottomHeightText);
    positive(topRight, bottomLeft, bottomRight, bottomHeight);
    const leftWidth = div(bottomLeft, bottomHeight), rightWidth = div(bottomRight, bottomHeight), topHeight = div(topRight, rightWidth);
    const topLeft = mul(leftWidth, topHeight), totalWidth = add(leftWidth, rightWidth), totalHeight = add(topHeight, bottomHeight), bottomTotal = add(bottomLeft, bottomRight);
    const world = {
      TL: point(zero, totalHeight), TC: point(leftWidth, totalHeight), TR: point(totalWidth, totalHeight),
      ML: point(zero, bottomHeight), C: point(leftWidth, bottomHeight), MR: point(totalWidth, bottomHeight),
      BL: point(zero, zero), BC: point(leftWidth, zero), BR: point(totalWidth, zero)
    };
    const regionData = [
      { id: "top-left", names: ["TL", "TC", "C", "ML"], value: topLeft },
      { id: "top-right", names: ["TC", "TR", "MR", "C"], value: topRight },
      { id: "bottom-left", names: ["ML", "C", "BC", "BL"], value: bottomLeft },
      { id: "bottom-right", names: ["C", "MR", "BR", "BC"], value: bottomRight }
    ];
    check(regionData.every(region => equal(area(world, region.names), region.value)), "네 직사각형의 실제 넓이와 조건이 다릅니다.");
    const points = projectMetric(world, "BL", "BR", "TL", { left: 28, right: 472, top: 30, bottom: 320 });
    const segments = [["TL", "TR", "top-edge"], ["TR", "BR", "right-edge"], ["BR", "BL", "bottom-edge"], ["BL", "TL", "left-edge"], ["TC", "BC", "column-divider"], ["ML", "MR", "row-divider"]];
    const answer = `${fmt(topLeft)}cm²`;
    const diagram = solved => {
      const labels = regionData.map(region => {
        const vertices = region.names.map(name => points[name]);
        const center = { x: vertices.reduce((sum, p) => sum + p.x, 0) / 4, y: vertices.reduce((sum, p) => sum + p.y, 0) / 4 };
        const target = region.id === "top-left", hidden = !solved && level === 2 && region.id === "bottom-right";
        const value = !solved && target ? "㉠" : hidden ? "□" : fmt(region.value);
        check(Math.max(...vertices.map(p => p.x)) - Math.min(...vertices.map(p => p.x)) >= 100, "숫자와 넓이 단위를 한 줄로 읽을 수 있는 칸이 필요합니다.");
        return `<text class="source62-four-rect-label${target ? " is-target" : ""}" x="${coord(center.x)}" y="${coord(center.y)}" dominant-baseline="middle" data-owner-id="${region.id}" data-layout-role="${!solved && (target || hidden) ? "unknown-area" : solved && (target || level === 2 && region.id === "bottom-right") ? "answer-value" : "given-area"}">${esc(value)}<tspan class="source62-four-rect-unit" dx="3">cm²</tspan></text>`;
      }).join("");
      return `<svg class="geometry-diagram source62-four-rect" data-renderer="source62-e2-model" viewBox="0 0 500 350" role="img" aria-label="같은 행과 열의 경계가 이어진 네 직사각형" data-source-item="6-2-u2-e2-mission-6" data-phase="${solved ? "answer" : "problem"}" data-geometry-kind="four-adjacent-rectangles">
        <rect class="source62-four-rect-outline" data-owner-id="outer-rectangle" data-layout-role="outline" x="${coord(points.TL.x)}" y="${coord(points.TL.y)}" width="${coord(coord(points.TR.x) - coord(points.TL.x))}" height="${coord(coord(points.BL.y) - coord(points.TL.y))}"/>
        ${line(points, "TC", "BC", "column-divider", 'class="source62-four-rect-divider"')}${line(points, "ML", "MR", "row-divider", 'class="source62-four-rect-divider"')}${labels}
      </svg>`;
    };
    const condition = level === 0 ? ` 왼쪽 직사각형들의 너비는 ${fmt(leftWidth)}cm이고, 오른쪽 직사각형들의 너비는 ${fmt(rightWidth)}cm입니다.` : level === 2 ? ` 아랫줄 두 직사각형의 넓이의 합은 ${fmt(bottomTotal)}cm²입니다.` : "";
    const reconstruction = level === 2 ? `오른쪽 아래 넓이는 ${math(`${fmt(bottomTotal)}-${fmt(bottomLeft)}=${fmt(bottomRight)}`)}cm²입니다. ` : "";
    const relation = level === 0 ? "" : `아랫줄의 높이가 같으므로 왼쪽과 오른쪽 너비의 비는 ${fmt(bottomLeft)}:${fmt(bottomRight)}입니다. 윗줄도 같은 너비의 비를 가집니다. `;
    const calculation = level === 0 ? `${fmt(topRight)}×${fmt(leftWidth)}÷${fmt(rightWidth)}=${fmt(topLeft)}` : `${fmt(topRight)}×${fmt(bottomLeft)}÷${fmt(bottomRight)}=${fmt(topLeft)}`;
    return { prompt: `그림과 같이 4개의 직사각형을 이어 붙였습니다.${condition} ㉠에 알맞은 넓이를 구하세요.${diagram(false)}`,
      answer, solution: `${reconstruction}${relation}㉠의 넓이는 ${math(calculation)}cm²입니다.`, answerVisual: diagram(true),
      exactValues: { topRightArea: fmt(topRight), bottomLeftArea: fmt(bottomLeft), bottomRightArea: fmt(bottomRight), bottomTotalArea: fmt(bottomTotal), targetArea: fmt(topLeft), leftWidth: fmt(leftWidth), rightWidth: fmt(rightWidth), bottomHeight: fmt(bottomHeight), hiddenBottomRight: level === 2 },
      geometryModel: modelEvidence(world, points, regionData.map(region => ({ id: region.id, vertices: region.names, area: fmt(region.value) })), segments, "equal-metric")
    };
  }

  const definitions = freeze([
    { sourceItemId: "6-2-u2-e2-mission-3", key: "sourceGrade6SecondDecimalDivisionE2Mission3", build: mission3,
      pools: [[390, 480, 384], [420, 600, 500], [480, 750, 600]],
      designs: ["large-base-given", "source-large-area", "sum-of-triangle-areas"], steps: [2, 3, 5],
      source: sourceEvidence(3, { heightCm: "3.9", largeAreaCm2: "9.36", areaRatio: "1.25" }, "0.96cm", "분수에 취소선과 덧쓰기가 있어 최종 답은 판독 불가") },
    { sourceItemId: "6-2-u2-e2-mission-4", key: "sourceGrade6SecondDecimalDivisionE2Mission4", build: mission4,
      pools: [[4680, 3030, 5970, 320], [5640, 4260, 8040, 310], [6120, 3960, 7830, 360]],
      designs: ["overlap-area-given", "source-two-areas-and-union", "area-sum-and-nonoverlap-sum"], steps: [1, 2, 3],
      source: sourceEvidence(4, { leftAreaCm2: "46.8", rightAreaCm2: "30.3", unionAreaCm2: "59.7", overlapBaseCm: "3.2" }, "10.875cm", "10.875") },
    { sourceItemId: "6-2-u2-e2-mission-6", key: "sourceGrade6SecondDecimalDivisionE2Mission6", build: mission6,
      pools: [[600, 925, 555, "2.5"], [480, 720, 600, "2.4"], [735, 1260, 525, "2.5"]],
      designs: ["three-areas-and-column-widths", "source-three-rectangle-areas", "bottom-row-total-with-hidden-bottom-right"], steps: [1, 2, 3],
      source: sourceEvidence(6, { topRightCm2: "6", bottomLeftCm2: "9.25", bottomRightCm2: "5.55" }, "10cm²", "10") }
  ]);
  const byId = new Map(definitions.map(definition => [definition.sourceItemId, definition]));
  const byKey = new Map(definitions.map(definition => [definition.key, definition]));
  const resolve = type => type?.sourceItemId ? byId.get(type.sourceItemId) : byKey.get(type?.generatorKey);
  const originalKey = api.generatorKey, originalGenerate = api.generate;
  api.generatorKey = type => {
    const definition = resolve(type);
    return definition ? type.reviewLocked ? "" : definition.key : originalKey(type);
  };
  api.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => {
    const definition = resolve(type);
    if (!definition) return originalGenerate(type, levelRank, difficultyOffset, seed, variant);
    if (type.reviewLocked) return null;
    check(Number.isSafeInteger(variant) && variant >= 0, "고정 변형 번호는 영 이상의 안전한 정수여야 합니다.");
    const offset = difficultyOffset ?? 0;
    check([-1, 0, 1].includes(offset), "난이도는 -1, 0, +1이어야 합니다.");
    const level = offset + 1, poolIndex = variant % 3, item = definition.build(definition.pools[poolIndex], level);
    const sourceItemId = definition.sourceItemId, difficultyDesign = definition.designs[level];
    return { ...item,
      solution: `<span data-renderer="source62-e2-model">${item.solution}</span>`,
      answerVisual: `<div data-renderer="source62-e2-model" data-answer-source="${sourceItemId}" data-print-weight="compact">${item.answerVisual}</div>`,
      sourceItemId, generator: definition.key, generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex,
      verifiedVariantCount: 3, verifiedVariantTarget: 3, verifiedVariantId: `${sourceItemId}:v${poolIndex}`,
      variantProvenance: poolIndex === 0 && level === 1 ? "source-values" : "source-structure-variant",
      difficultyDesign, difficultyLevel: level, difficultyRank: level, difficultyOffset: offset, levelRank,
      sourceDifficultyRank: 1, reasoningSteps: definition.steps[level], sourceStepCount: definition.steps[1], difficultyStepDelta: definition.steps[level] - definition.steps[1],
      exactValues: freeze(item.exactValues), sourceEvidence: definition.source, sourceAnswer: definition.source.originalAnswer,
      publisherAnswerVerified: false, handwrittenAnswerVerified: false
    };
  };
  if (Array.isArray(api.names)) for (const { key } of definitions) if (!api.names.includes(key)) api.names.push(key);
  const publicApi = freeze({ definitions, registrationOnly: true, renderer: "source62-e2-model" });
  window.HSE_SOURCE_GRADE6_E2_GEOMETRY = publicApi;
  if (typeof module !== "undefined") module.exports = publicApi;
})();
