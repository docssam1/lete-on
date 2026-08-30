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

  function sceneFor(lesson) {
    if (lesson.type === "bar-model") return ratioScene(lesson);
    if (lesson.type === "fraction-strip") return fractionScene(lesson);
    if (lesson.type === "geometry-angle") return geometryScene(lesson);
    throw new Error("ANIMATED_SCENE_TYPE_UNSUPPORTED");
  }

  return Object.freeze({ buildIsoscelesModel: buildIsoscelesModel, geometryScene: geometryScene, ratioScene: ratioScene, fractionScene: fractionScene, sceneFor: sceneFor });
});
