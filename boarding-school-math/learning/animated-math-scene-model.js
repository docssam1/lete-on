(function (root, factory) {
  const value = factory(root && root.GW_RENDER);
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.GMAPAnimatedMathScenes = value;
})(typeof window !== "undefined" ? window : globalThis, function (GW_RENDER) {
  "use strict";

  function renderer() {
    if (!GW_RENDER || !GW_RENDER.fmt || !GW_RENDER.wrapSvg) throw new Error("GW_RENDER is required");
    return GW_RENDER;
  }
  function esc(value) { return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;"); }
  function point(x, y) { return { x: x, y: y }; }
  function add(a, b) { return point(a.x + b.x, a.y + b.y); }
  function subtract(a, b) { return point(a.x - b.x, a.y - b.y); }
  function scale(a, n) { return point(a.x * n, a.y * n); }
  function length(a) { return Math.hypot(a.x, a.y); }
  function unit(a) { const size = length(a) || 1; return scale(a, 1 / size); }
  function midpoint(a, b) { return scale(add(a, b), 0.5); }
  function normal(a) { return point(-a.y, a.x); }
  function attrPoint(a) { return renderer().fmt(a.x) + " " + renderer().fmt(a.y); }
  const ANGLE_FONT_SIZE = 20;
  const POINT_FONT_SIZE = 22;
  const ANGLE_ARC_RADIUS = ANGLE_FONT_SIZE * 2.4;
  const ANGLE_LABEL_GAP = ANGLE_FONT_SIZE * 0.95;

  function segmentMarkup(segment, className) {
    const fmt = renderer().fmt;
    return '<line class="' + className + '" x1="' + fmt(segment.a.x) + '" y1="' + fmt(segment.a.y) + '" x2="' + fmt(segment.b.x) + '" y2="' + fmt(segment.b.y) + '"></line>';
  }
  function textMarkup(position, text, className) {
    const fmt = renderer().fmt;
    return '<text class="' + className + '" x="' + fmt(position.x) + '" y="' + fmt(position.y) + '" text-anchor="middle" dominant-baseline="middle">' + esc(text) + '</text>';
  }
  function angleArc(vertex, from, to, radius) {
    const a = unit(subtract(from, vertex));
    const b = unit(subtract(to, vertex));
    const start = add(vertex, scale(a, radius));
    const end = add(vertex, scale(b, radius));
    const cross = a.x * b.y - a.y * b.x;
    const dot = Math.max(-1, Math.min(1, a.x * b.x + a.y * b.y));
    const bisector = unit(add(a, b));
    return {
      d: "M " + attrPoint(start) + " A " + renderer().fmt(radius) + " " + renderer().fmt(radius) + " 0 0 " + (cross >= 0 ? 1 : 0) + " " + attrPoint(end),
      start: start,
      end: end,
      radius: radius,
      measureDeg: Math.acos(dot) * 180 / Math.PI,
      bisector: bisector,
      label: add(vertex, scale(bisector, radius + ANGLE_LABEL_GAP))
    };
  }
  function tickOn(segment, size) {
    const middle = midpoint(segment.a, segment.b);
    const perpendicular = scale(unit(normal(subtract(segment.b, segment.a))), size / 2);
    return { a: subtract(middle, perpendicular), b: add(middle, perpendicular) };
  }

  function buildIsoscelesModel(sceneModel) {
    const width = 760;
    const height = 390;
    const A = point(width / 2, 42);
    const baseY = height - 66;
    const altitude = baseY - A.y;
    const halfBase = altitude * Math.tan((sceneModel.vertexAngleDeg * Math.PI / 180) / 2);
    const B = point(A.x - halfBase, baseY);
    const C = point(A.x + halfBase, baseY);
    const AB = { a: A, b: B };
    const AC = { a: A, b: C };
    const BC = { a: B, b: C };
    const centroid = scale(add(add(A, B), C), 1 / 3);
    const pointLabelDistance = POINT_FONT_SIZE * 1.35;
    function pointLabel(vertex) {
      return add(vertex, scale(unit(subtract(vertex, centroid)), pointLabelDistance));
    }
    return {
      width: width, height: height,
      points: { A: A, B: B, C: C }, segments: { AB: AB, AC: AC, BC: BC },
      ticks: { AB: tickOn(AB, 24), AC: tickOn(AC, 24) },
      angles: { A: angleArc(A, B, C, ANGLE_ARC_RADIUS), B: angleArc(B, C, A, ANGLE_ARC_RADIUS), C: angleArc(C, A, B, ANGLE_ARC_RADIUS) },
      pointLabels: { A: pointLabel(A), B: pointLabel(B), C: pointLabel(C) },
      sideLengths: { AB: length(subtract(B, A)), AC: length(subtract(C, A)) }
    };
  }

  function geometryScene(lesson) {
    const model = buildIsoscelesModel(lesson.sceneModel);
    const triangle = [model.segments.AB, model.segments.AC, model.segments.BC].map(function (segment) { return segmentMarkup(segment, "geo-line"); }).join("")
      + textMarkup(model.pointLabels.A, "A", "geo-label")
      + textMarkup(model.pointLabels.B, "B", "geo-label")
      + textMarkup(model.pointLabels.C, "C", "geo-label");
    const equalSides = segmentMarkup(model.ticks.AB, "geo-mark") + segmentMarkup(model.ticks.AC, "geo-mark");
    const vertexAngle = '<path class="geo-arc" d="' + model.angles.A.d + '"></path>' + textMarkup(model.angles.A.label, renderer().fmt(lesson.sceneModel.vertexAngleDeg) + "°", "geo-angle-label");
    const equalAngles = '<path class="geo-arc" d="' + model.angles.B.d + '"></path>' + textMarkup(model.angles.B.label, "x", "geo-angle-label")
      + '<path class="geo-arc" d="' + model.angles.C.d + '"></path>' + textMarkup(model.angles.C.label, "x", "geo-angle-label");
    const body = '<g class="scene-object" data-object="geo-triangle">' + triangle + '</g>'
      + '<g class="scene-object" data-object="geo-equal-sides">' + equalSides + '</g>'
      + '<g class="scene-object" data-object="geo-vertex-angle">' + vertexAngle + '</g>'
      + '<g class="scene-object" data-object="geo-equal-angles">' + equalAngles + '</g>';
    const svg = renderer().wrapSvg(body, { xMin: 0, yMin: 0, w: model.width, h: model.height }, "geometry-model-svg", ' role="img" aria-label="Isosceles triangle ABC constructed from a point and segment model"');
    const vertex = lesson.sceneModel.vertexAngleDeg;
    const base = (180 - vertex) / 2;
    const remainder = 180 - vertex;
    return '<div class="geometry-scene">' + svg + '<div class="geo-equations">'
      + '<div class="geo-equation scene-object" data-object="geo-equation-sum">180° − ' + renderer().fmt(vertex) + '° = ' + renderer().fmt(remainder) + '°</div>'
      + '<div class="geo-equation scene-object" data-object="geo-equation-divide">' + renderer().fmt(remainder) + '° ÷ 2 = ' + renderer().fmt(base) + '°</div>'
      + '<div class="geo-answer scene-object" data-object="geo-answer">∠B = ' + renderer().fmt(base) + '°</div></div></div>';
  }

  function bar(parts, unit, firstLabel) {
    return Array.from({ length: parts }, function (_, index) {
      return '<div class="ratio-cell' + (index === 0 ? ' first' : '') + '">' + (index === 0 ? esc(firstLabel) : esc(unit)) + '</div>';
    }).join("");
  }
  function ratioScene(lesson) {
    const model = lesson.sceneModel;
    return '<div class="ratio-scene" role="img" aria-label="Two bar models compare equal totals with different unit sizes">'
      + '<div class="ratio-row scene-object" data-object="ratio-team-a-bar"><div class="ratio-row-label">Team A <span>1 : 3 · total 20</span></div><div class="ratio-bar four">' + bar(model.teamA.parts, model.teamA.unit, "5 red") + '</div></div>'
      + '<div class="ratio-equation scene-object" data-object="ratio-red-value">20 ÷ 4 = 5 red</div>'
      + '<div class="ratio-row scene-object" data-object="ratio-team-b-bar"><div class="ratio-row-label">Team B <span>1 : 4 · total 20</span></div><div class="ratio-bar five">' + bar(model.teamB.parts, model.teamB.unit, "4 green") + '</div></div>'
      + '<div class="ratio-equation scene-object" data-object="ratio-green-value">20 ÷ 5 = 4 green</div>'
      + '<div class="ratio-answer scene-object" data-object="ratio-answer">5 + 4 = 9</div></div>';
  }

  function fractionScene(lesson) {
    const model = lesson.sceneModel;
    const cells = Array.from({ length: model.wholeParts }, function (_, index) {
      const shaded = index < model.shadedParts ? " is-shaded" : "";
      const group = index < model.shadedParts ? '<span class="fraction-group-number">' + (index + 1) + '</span>' : "";
      return '<div class="fraction-cell' + shaded + '"><span>1/8</span>' + group + '</div>';
    }).join("");
    return '<div class="fraction-division-scene" role="img" aria-label="A one-meter strip partitioned into eight equal parts; six eighths represent three-fourths">'
      + '<div class="fraction-whole scene-object" data-object="frac-whole"><span>1 m</span></div>'
      + '<div class="fraction-grid scene-object" data-object="frac-eighth-grid">' + cells + '</div>'
      + '<div class="fraction-bracket scene-object" data-object="frac-three-fourths"><span>3/4 m = 6/8 m</span></div>'
      + '<div class="fraction-groups scene-object" data-object="frac-six-groups"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span></div>'
      + '<div class="fraction-equation scene-object" data-object="frac-equation">3/4 ÷ 1/8 = 6/8 ÷ 1/8</div>'
      + '<div class="fraction-check scene-object" data-object="frac-check">6 × 1/8 = 6/8 = 3/4</div>'
      + '<div class="fraction-answer scene-object" data-object="frac-answer">6 pieces</div></div>';
  }

  function factorTiles(values, sharedCount) {
    return values.map(function (value, index) { return '<span class="factor-tile' + (index < sharedCount ? ' is-shared' : ' is-extra') + '">' + esc(value) + '</span>'; }).join("");
  }
  function factorScene(lesson) {
    const model = lesson.sceneModel;
    const first = model.values[0]; const second = model.values[1];
    const firstFactors = model.primeFactors[first]; const secondFactors = model.primeFactors[second];
    const chain = model.euclideanChain.map(function (step) {
      return '<li>' + esc(step.dividend) + ' = ' + esc(step.divisor) + ' × ' + esc(step.quotient) + ' + ' + esc(step.remainder) + '</li>';
    }).join("");
    return '<div class="factor-chain-scene" role="img" aria-label="Prime-factor and Euclidean-algorithm models show that the greatest common factor of 84 and 60 is 12">'
      + '<div class="gcf-values scene-object" data-object="gcf-values"><span>' + esc(first) + '</span><b>GCF</b><span>' + esc(second) + '</span></div>'
      + '<div class="factor-row scene-object" data-object="gcf-factor-84"><strong>' + esc(first) + '</strong><div>' + factorTiles(firstFactors, model.commonFactors.length) + '</div></div>'
      + '<div class="factor-row scene-object" data-object="gcf-factor-60"><strong>' + esc(second) + '</strong><div>' + factorTiles(secondFactors, model.commonFactors.length) + '</div></div>'
      + '<div class="gcf-common scene-object" data-object="gcf-common"><span>shared</span>' + factorTiles(model.commonFactors, model.commonFactors.length) + '<strong>2 × 2 × 3</strong></div>'
      + '<ol class="gcf-chain scene-object" data-object="gcf-chain">' + chain + '</ol>'
      + '<div class="gcf-check scene-object" data-object="gcf-check"><span>' + esc(first) + ' ÷ ' + esc(model.answer) + ' = ' + esc(first / model.answer) + '</span><span>' + esc(second) + ' ÷ ' + esc(model.answer) + ' = ' + esc(second / model.answer) + '</span></div>'
      + '<div class="gcf-answer scene-object" data-object="gcf-answer">GCF = ' + esc(model.answer) + '</div></div>';
  }

  function buildSignedNumberLineModel(sceneModel) {
    const width = 760; const height = 350; const left = 58; const right = 702; const axisY = 132;
    const tickDenominator = sceneModel.tickDenominator;
    const minUnit = sceneModel.domain.minNumerator * tickDenominator / sceneModel.domain.denominator;
    const maxUnit = sceneModel.domain.maxNumerator * tickDenominator / sceneModel.domain.denominator;
    function exactUnit(value) {
      const scaled = value.numerator * tickDenominator;
      if (scaled % value.denominator !== 0) throw new Error("SIGNED_POINT_NOT_ON_TICK_GRID");
      return scaled / value.denominator;
    }
    function xForUnit(unitValue) {
      if (unitValue < minUnit || unitValue > maxUnit) throw new Error("SIGNED_POINT_OUTSIDE_DOMAIN");
      return left + (unitValue - minUnit) / (maxUnit - minUnit) * (right - left);
    }
    const ticks = [];
    for (let unitValue = minUnit; unitValue <= maxUnit; unitValue += 1) {
      ticks.push({ unit: unitValue, x: xForUnit(unitValue), major: unitValue % tickDenominator === 0, label: unitValue % tickDenominator === 0 ? String(unitValue / tickDenominator) : "" });
    }
    const firstUnit = exactUnit(sceneModel.first); const secondUnit = exactUnit(sceneModel.second);
    return {
      width: width, height: height, left: left, right: right, axisY: axisY, tickDenominator: tickDenominator,
      minUnit: minUnit, maxUnit: maxUnit, ticks: ticks,
      zeroX: xForUnit(0), firstUnit: firstUnit, secondUnit: secondUnit,
      firstX: xForUnit(firstUnit), secondX: xForUnit(secondUnit),
      firstDistanceUnits: Math.abs(firstUnit), secondDistanceUnits: Math.abs(secondUnit)
    };
  }

  function signedNumberLineScene(lesson, locale) {
    const model = buildSignedNumberLineModel(lesson.sceneModel); const fmt = renderer().fmt;
    const language = locale === "zh" || locale === "zh-Hans" ? "zh" : (locale === "ko" ? "ko" : "en");
    const localized = {
      en: { fartherLeft: "farther left", aria: "A model-derived number line from negative two to zero locates negative seven-fourths and negative five-thirds" },
      ko: { fartherLeft: "더 왼쪽", aria: "-2부터 0까지 계산한 수직선에 -7/4과 -5/3의 위치를 표시한 모델" },
      zh: { fartherLeft: "更靠左", aria: "在由模型计算的-2到0数轴上标出-7/4与-5/3" }
    }[language];
    const ticks = model.ticks.map(function (tick) {
      const half = tick.major ? 13 : 6;
      return '<line class="signed-tick' + (tick.major ? ' is-major' : '') + '" x1="' + fmt(tick.x) + '" y1="' + fmt(model.axisY - half) + '" x2="' + fmt(tick.x) + '" y2="' + fmt(model.axisY + half) + '"></line>'
        + (tick.label ? textMarkup(point(tick.x, model.axisY + 31), tick.label, "signed-axis-label") : "");
    }).join("");
    const axis = '<g class="scene-object" data-object="signed-axis"><line class="signed-axis-line" x1="' + fmt(model.left) + '" y1="' + fmt(model.axisY) + '" x2="' + fmt(model.right) + '" y2="' + fmt(model.axisY) + '"></line>' + ticks + '<path class="signed-axis-arrow" d="M ' + fmt(model.right - 12) + ' ' + fmt(model.axisY - 8) + ' L ' + fmt(model.right) + ' ' + fmt(model.axisY) + ' L ' + fmt(model.right - 12) + ' ' + fmt(model.axisY + 8) + '"></path></g>';
    const first = '<g class="scene-object" data-object="signed-point-a"><line class="signed-guide" x1="' + fmt(model.firstX) + '" y1="78" x2="' + fmt(model.firstX) + '" y2="' + fmt(model.axisY) + '"></line><circle class="signed-point is-a" cx="' + fmt(model.firstX) + '" cy="' + fmt(model.axisY) + '" r="9"></circle>' + textMarkup(point(model.firstX - 34, 65), 'A = ' + lesson.sceneModel.first.label, "signed-point-label") + '</g>';
    const second = '<g class="scene-object" data-object="signed-point-b"><line class="signed-guide" x1="' + fmt(model.secondX) + '" y1="' + fmt(model.axisY) + '" x2="' + fmt(model.secondX) + '" y2="204"></line><circle class="signed-point is-b" cx="' + fmt(model.secondX) + '" cy="' + fmt(model.axisY) + '" r="9"></circle>' + textMarkup(point(model.secondX + 36, 218), 'B = ' + lesson.sceneModel.second.label, "signed-point-label") + '</g>';
    function distanceBar(objectId, y, x, units, className) {
      return '<g class="scene-object" data-object="' + objectId + '"><line class="signed-distance ' + className + '" x1="' + fmt(x) + '" y1="' + y + '" x2="' + fmt(model.zeroX) + '" y2="' + y + '"></line><circle class="signed-distance-end" cx="' + fmt(x) + '" cy="' + y + '" r="4"></circle><circle class="signed-distance-end" cx="' + fmt(model.zeroX) + '" cy="' + y + '" r="4"></circle>' + textMarkup(point((x + model.zeroX) / 2, y - 15), units + '/' + model.tickDenominator, "signed-distance-label") + '</g>';
    }
    const body = axis + first + second + distanceBar("signed-distance-a", 260, model.firstX, model.firstDistanceUnits, "is-a") + distanceBar("signed-distance-b", 305, model.secondX, model.secondDistanceUnits, "is-b");
    const svg = renderer().wrapSvg(body, { xMin: 0, yMin: 0, w: model.width, h: model.height }, "signed-number-line-svg", ' role="img" aria-label="' + esc(localized.aria) + '"');
    return '<div class="signed-number-line-scene">' + svg
      + '<div class="signed-common scene-object" data-object="signed-common-units"><span>-7/4 = -21/12</span><span>-5/3 = -20/12</span></div>'
      + '<div class="signed-order scene-object" data-object="signed-order"><span>' + esc(localized.fartherLeft) + '</span><strong>-21/12 &lt; -20/12</strong></div>'
      + '<div class="signed-answer scene-object" data-object="signed-answer">-7/4 &lt; -5/3</div></div>';
  }

  function sceneFor(lesson, locale) {
    if (lesson.type === "bar-model") return ratioScene(lesson);
    if (lesson.type === "fraction-strip") return fractionScene(lesson);
    if (lesson.type === "factor-chain") return factorScene(lesson);
    if (lesson.type === "signed-number-line") return signedNumberLineScene(lesson, locale);
    if (lesson.type === "geometry-angle") return geometryScene(lesson);
    throw new Error("ANIMATED_SCENE_TYPE_UNSUPPORTED");
  }

  return Object.freeze({ buildIsoscelesModel: buildIsoscelesModel, buildSignedNumberLineModel: buildSignedNumberLineModel, geometryScene: geometryScene, ratioScene: ratioScene, fractionScene: fractionScene, factorScene: factorScene, signedNumberLineScene: signedNumberLineScene, sceneFor: sceneFor });
});
