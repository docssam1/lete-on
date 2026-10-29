(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CONGRUENCE_PAGE29_M2_CORRECTED = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u3-e3-mission-2";
  const generatorKey = "source52UnequalSquareOverlapSyntheticPage29Mission2";
  const pools = Object.freeze([{side:8, largeSide:12, offset:5}, {side:12, largeSide:18, offset:7}, {side:16, largeSide:22, offset:9}].map(Object.freeze));

  const round = value => Number(value.toFixed(5));
  const fmt = value => Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));

  function model(pool) {
    const {side, largeSide, offset} = pool;
    if (!(side > 0 && largeSide > side && offset > side/2 && offset < side)) throw Error("도형 조건 오류");
    const rotationDegrees = Math.atan((offset - side/2)/(side/2))*180/Math.PI;
    const O = { x: side / 2, y: side / 2 };
    // Screen coordinates: the two vectors are perpendicular. This angle only
    // positions the illustration; it is not a condition in the source item.
    const illustrativeRotation = rotationDegrees * Math.PI / 180;
    const u = { x: -Math.cos(illustrativeRotation), y: Math.sin(illustrativeRotation) };
    const v = { x: Math.sin(illustrativeRotation), y: Math.cos(illustrativeRotation) };
    const add = (a, b, scale = 1) => ({ x: a.x + b.x * scale, y: a.y + b.y * scale });
    const cross = (a, b) => a.x * b.y - a.y * b.x;
    const dot = (a, b) => a.x * b.x + a.y * b.y;
    const square = [
      { x: 0, y: 0 }, { x: side, y: 0 },
      { x: side, y: side }, { x: 0, y: side }
    ];
    const insideWedge = point => {
      const relative = { x: point.x - O.x, y: point.y - O.y };
      return cross(u, relative) <= 1e-9 && cross(relative, v) <= 1e-9;
    };
    const clip = (polygon, signedDistance) => {
      const output = [];
      for (let i = 0; i < polygon.length; i += 1) {
        const current = polygon[i], previous = polygon[(i + polygon.length - 1) % polygon.length];
        const dCurrent = signedDistance(current), dPrevious = signedDistance(previous);
        const currentInside = dCurrent <= 1e-9, previousInside = dPrevious <= 1e-9;
        if (currentInside !== previousInside) {
          const t = dPrevious / (dPrevious - dCurrent);
          output.push({ x: round(previous.x + (current.x - previous.x) * t), y: round(previous.y + (current.y - previous.y) * t) });
        }
        if (currentInside) output.push(current);
      }
      return output;
    };
    const overlap = clip(clip(square, point => cross(u, { x: point.x - O.x, y: point.y - O.y })), point => cross({ x: point.x - O.x, y: point.y - O.y }, v));
    const tilted = [O, add(O, u, largeSide), add(add(O, u, largeSide), v, largeSide), add(O, v, largeSide)];
    const area = polygon => Math.abs(polygon.reduce((sum, point, index) => {
      const next = polygon[(index + 1) % polygon.length];
      return sum + point.x * next.y - next.x * point.y;
    }, 0)) / 2;
    return Object.freeze({
      side, largeSide, offset, area: round(area(overlap)), center: Object.freeze(O),
      square: Object.freeze(square.map(Object.freeze)), tilted: Object.freeze(tilted.map(point => Object.freeze({ x: round(point.x), y: round(point.y) }))),
      overlap: Object.freeze(overlap.map(point => Object.freeze({ x: round(point.x), y: round(point.y) }))),
      sideDot: round(dot(u, v)), radialBound: side / 2 * Math.SQRT2,
      answer: `${side * side / 4}cm²`
    });
  }

  function diagram(shape, solution = false) {
    const bounds = [...shape.square, ...shape.tilted, { x: shape.side * 1.15, y: 0 }, { x: shape.side * 1.15, y: shape.side }];
    const minX = Math.min(...bounds.map(point => point.x)), maxX = Math.max(...bounds.map(point => point.x));
    const minY = Math.min(...bounds.map(point => point.y)), maxY = Math.max(...bounds.map(point => point.y));
    const margin = 36;
    const scale = Math.min((500 - margin * 2) / (maxX - minX), (430 - margin * 2) / (maxY - minY));
    const left = margin - minX * scale, top = margin - minY * scale;
    const project = point => ({ x: round(left + point.x * scale), y: round(top + point.y * scale) });
    const points = poly => poly.map(point => {
      const p = project(point);
      return `${p.x},${p.y}`;
    }).join(" ");
    const line = (a, b, cls = "") => {
      const p = project(a), q = project(b);
      return `<line${cls ? ` class="${cls}"` : ""} x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}"/>`;
    };
    const [q0, q1, q2, q3] = shape.square, O = shape.center;
    const [t0, t1, t2, t3] = shape.tilted;
    const dimX = project({ x: shape.side * 1.12, y: 0 }).x;
    const topY = project(q0).y, bottomY = project(q3).y;
    const center = project(O);
    const leftX = project({x:0,y:0}).x - 14, offsetY = project({x:0,y:shape.offset}).y;
    const offsetMeasure = `<path class="source52-p29m2c-dimension" d="M${leftX} ${topY} v${offsetY-topY} M${leftX-4} ${topY} h8 M${leftX-4} ${offsetY} h8"/><text class="source52-p29m2c-measure" x="${leftX-8}" y="${(topY+offsetY)/2}" text-anchor="end">${shape.offset}cm</text>`;
    const answerFill = solution ? `<polygon class="source52-p29m2c-overlap" points="${points(shape.overlap)}"/>` : "";
    const overlapCenter = shape.overlap.reduce((sum, point) => ({ x: sum.x + point.x / shape.overlap.length, y: sum.y + point.y / shape.overlap.length }), { x: 0, y: 0 });
    const overlapLabel = project(overlapCenter);
    const areaLabel = solution ? `<text class="source52-p29m2c-area-label" x="${overlapLabel.x}" y="${round(overlapLabel.y + 5)}">겹친 부분</text>` : "";
    return `<svg class="source52-p29m2c-diagram" viewBox="0 0 500 430" role="img" aria-label="변이 ${shape.side}cm인 정사각형과 중심에 꼭짓점이 놓인 ${shape.largeSide}cm 정사각형${solution ? ", 겹친 부분을 표시" : ""}" xmlns="http://www.w3.org/2000/svg">
      ${answerFill}
      <polygon class="source52-p29m2c-tilted" points="${points([t0, t1, t2, t3])}"/>
      <rect class="source52-p29m2c-upright" x="${project(q0).x}" y="${project(q0).y}" width="${shape.side * scale}" height="${shape.side * scale}"/>
      ${line(q0, q2, "source52-p29m2c-diagonal")}${line(q1, q3, "source52-p29m2c-diagonal")}
      <path class="source52-p29m2c-dimension" d="M${dimX - 8} ${topY} h8 M${dimX - 8} ${bottomY} h8 M${dimX} ${topY} v${bottomY - topY}"/>
      <text class="source52-p29m2c-measure" x="${dimX + 10}" y="${round((topY + bottomY) / 2 + 6)}">${shape.side}cm</text>
      ${offsetMeasure}
      ${areaLabel}
    </svg>`;
  }

  function makeQuestion(_variant = 0, _difficulty = 0, reviewLocked = false) {
    if (!Number.isSafeInteger(_variant) || _variant < 0) throw Error("변형 오류");
    const index = _variant % pools.length, shape = model(pools[index]), {side, largeSide, offset} = shape, answer = side * side / 4;
    const prompt = `<div class="source52-p29m2c-question"><p>한 변이 ${side}cm인 정사각형과 한 변이 ${largeSide}cm인 정사각형이 그림처럼 겹쳐져 있다. 큰 정사각형의 한 꼭짓점은 작은 정사각형의 중심에 있고, 작은 정사각형의 왼쪽 위 꼭짓점에서 왼쪽 변과 큰 정사각형의 변이 만나는 점까지는 ${offset}cm이다. 두 도형이 겹쳐진 부분의 넓이는 몇 cm²인가?</p>${diagram(shape)}<p class="source52-p29m2c-workspace">풀이:</p></div>`;
    const solution = `<div class="source52-p29m2c-solution" data-source-answer="${sourceItemId}"><p><b>정답: ${answer}cm²</b></p><ol><li>변이 ${side}cm인 정사각형의 넓이는 ${side}×${side}=${side * side}cm²입니다.</li><li>다른 정사각형의 한 꼭짓점이 이 정사각형의 중심에 있습니다. 그 꼭짓점에서 나온 두 변은 서로 직각이므로, 중심에서 정사각형을 90°씩 네 부분으로 나눕니다.</li><li>네 부분은 정사각형을 90° 돌리면 서로 겹치므로 넓이가 같습니다.</li><li>중심에서 정사각형 안의 어느 점까지도 거리는 ${side}cm보다 짧습니다. 가로와 세로로 꺾어 가면 각각 최대 ${side / 2}cm여서 합이 최대 ${side}cm이고, 둘 다 움직일 때 곧장 가는 길은 꺾어 가는 길보다 짧기 때문입니다. 한 방향으로만 움직일 때는 최대 ${side / 2}cm입니다.</li><li>따라서 이 네 부분 중 기울어진 정사각형의 두 변 사이에 있는 부분은 전부 겹칩니다. 그 부분의 한 점에서 두 변에 평행한 선을 그으면, 각 변을 따라 잰 길이는 중심에서 그 점까지의 거리보다 길지 않고 큰 정사각형의 한 변 ${largeSide}cm보다 짧기 때문입니다.</li><li>겹친 넓이는 ${side * side}÷4=<b>${answer}cm²</b>입니다.</li></ol></div>`;
    return Object.freeze({
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${index}">${prompt}</div>`,
      answer: shape.answer, solution, sourceItemId, generator: generatorKey,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: index,
      verifiedVariantCount: 3, verifiedVariantTarget: 3,
      verifiedVariantId: `${sourceItemId}:v${index}`, difficultyOffset: 0,
      difficultyLevel: _difficulty + 1, difficultyRank: _difficulty + 1, variantProvenance: "synthetic-source-structure", sourceValuesExcluded: true, sourceStructurePreserved: true,
      answerVisualRequired: true,
      answerVisualStatus: reviewLocked ? "locked" : "verified-reconstruction",
      answerVisual: diagram(shape, true), publisherKeyVerified: false,
      publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-square-quarter-area-proof",
      answerModel: shape, reviewLocked
    });
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P29M2CorrectedInstalled) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type)
      ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : ""
      : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type)
      ? api.generatorKey(type) ? makeQuestion(variant, difficulty ?? 0, type.reviewLocked !== false) : null
      : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P29M2CorrectedInstalled", { value: true });
    return true;
  }

  return Object.freeze({ sourceItemId, generatorKey, pools, model, diagram, makeQuestion, install });
});
