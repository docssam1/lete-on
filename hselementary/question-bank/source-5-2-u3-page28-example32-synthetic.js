(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CONGRUENCE_PAGE28_EXAMPLE32 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u3-e3-example-2";
  const generatorKey = "source52SquareOverlapSegmentSyntheticPage28Example32";
  const pools = Object.freeze([8, 10, 14]);
  const round = value => Number(value.toFixed(6));

  function model(side) {
    const A = { x: 0, y: 0 }, B = { x: side, y: 0 }, C = { x: side, y: side }, D = { x: 0, y: side };
    const T = { x: side / 2, y: side - side * Math.sin(Math.PI / 3) };
    const E = { x: T.x + side * Math.cos(Math.PI / 6), y: T.y + side * Math.sin(Math.PI / 6) };
    const F = { x: D.x + E.x - T.x, y: D.y + E.y - T.y };
    const distance = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
    const vector = (p, q) => ({ x: q.x - p.x, y: q.y - p.y });
    const angle = (u, v) => Math.acos(Math.max(-1, Math.min(1, (u.x * v.x + u.y * v.y) / (Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y))))) * 180 / Math.PI;
    const innerAngle = angle(vector(D, T), vector(D, C));
    const markedSideAngle = angle(vector(T, E), { x: 0, y: 1 });
    return Object.freeze({
      side,
      points: Object.freeze(Object.fromEntries(Object.entries({ A, B, C, D, T, E, F }).map(([key, p]) => [key, Object.freeze({ x: round(p.x), y: round(p.y) })]))),
      uprightSide: round(distance(D, C)), tiltedSide: round(distance(D, T)),
      targetLength: round(distance(T, C)), includedAngle: round(innerAngle), markedAngle: round(markedSideAngle),
      answer: `${side}cm`
    });
  }

  function diagram(shape, solution = false) {
    const width = 560, height = 440, scale = 216 / shape.side;
    const left = 110, top = 50;
    const project = p => ({ x: round(left + p.x * scale), y: round(top + p.y * scale) });
    const p = Object.fromEntries(Object.entries(shape.points).map(([key, point]) => [key, project(point)]));
    const line = (a, b, cls = "") => "<line" + (cls ? " class=\"" + cls + "\"" : "") + " x1=\"" + p[a].x + "\" y1=\"" + p[a].y + "\" x2=\"" + p[b].x + "\" y2=\"" + p[b].y + "\"/>";
    const text = (x, y, value, cls = "") => "<text" + (cls ? " class=\"" + cls + "\"" : "") + " x=\"" + round(x) + "\" y=\"" + round(y) + "\">" + value + "</text>";
    const squareA = [p.A, p.B, p.C, p.D].map(point => point.x + "," + point.y).join(" ");
    const squareB = [p.D, p.T, p.E, p.F].map(point => point.x + "," + point.y).join(" ");
    const crossX = p.B.x;
    const crossY = p.T.y + (crossX - p.T.x) * (p.E.y - p.T.y) / (p.E.x - p.T.x);
    const dimensionTop = "<path class=\"source52-p28e32-dimension\" d=\"M" + p.A.x + " " + (p.A.y - 13) + " v13 M" + p.B.x + " " + (p.B.y - 13) + " v13 M" + p.A.x + " " + (p.A.y - 10) + " h" + (p.B.x - p.A.x) + "\"/>";
    const dimensionLeft = "<path class=\"source52-p28e32-dimension\" d=\"M" + (p.A.x - 20) + " " + p.A.y + " h20 M" + (p.D.x - 20) + " " + p.D.y + " h20 M" + (p.A.x - 17) + " " + p.A.y + " v" + (p.D.y - p.A.y) + "\"/>";
    const angleMark = "<path class=\"source52-p28e32-angle\" d=\"M" + round(crossX + 9 * Math.sqrt(3)) + " " + round(crossY + 9) + " A18 18 0 0 1 " + round(crossX) + " " + round(crossY + 18) + "\"/>";
    const answer = solution
      ? "<polygon class=\"source52-p28e32-answer-area\" points=\"" + p.D.x + "," + p.D.y + " " + p.T.x + "," + p.T.y + " " + p.C.x + "," + p.C.y + "\"/>"
        + text((p.D.x + p.T.x + p.C.x) / 3, (p.D.y + p.T.y + p.C.y) / 3 + 5, shape.answer, "source52-p28e32-answer-label")
        + text((p.D.x + p.T.x) / 2 - 18, (p.D.y + p.T.y) / 2, shape.answer, "source52-p28e32-known-label")
        + text((p.D.x + p.C.x) / 2, p.D.y + 24, shape.answer, "source52-p28e32-known-label")
      : "";
    return "<svg class=\"source52-p28e32-diagram\" viewBox=\"0 0 " + width + " " + height + "\" role=\"img\" aria-label=\"변 " + shape.side + "cm인 두 정사각형이 겹친 그림, 변 사이의 각 60도, 선분 ㄱㄴ" + (solution ? ", 답 " + shape.answer + " 표시" : "") + "\" xmlns=\"http://www.w3.org/2000/svg\">"
      + answer + "<polygon class=\"source52-p28e32-tilted\" points=\"" + squareB + "\"/><polygon class=\"source52-p28e32-upright\" points=\"" + squareA + "\"/>"
      + line("D", "T") + line("T", "C", solution ? "source52-p28e32-target" : "")
      + dimensionTop + dimensionLeft + angleMark
      + text((p.A.x + p.B.x) / 2, p.A.y - 17, shape.answer, "source52-p28e32-measure")
      + text(p.A.x - 29, (p.A.y + p.D.y) / 2 + 5, shape.answer, "source52-p28e32-measure")
      + text(crossX + 21, crossY + 36, "60°", "source52-p28e32-angle-label")
      + text(p.D.x - 20, p.D.y + 20, "ㄷ", "source52-p28e32-point-label") + text(p.T.x - 17, p.T.y - 8, "ㄱ", "source52-p28e32-point-label") + text(p.C.x + 8, p.C.y + 17, "ㄴ", "source52-p28e32-point-label") + "</svg>";
  }

  function makeQuestion(_variant = 0, difficultyOffset = 0, reviewLocked = false) {
    if (!Number.isSafeInteger(_variant) || _variant < 0) throw Error("변형 오류");
    const index = _variant % pools.length, shape = model(pools[index]), side = shape.side;
    const prompt = "<div class=\"source52-p28e32-question\"><p>한 변의 길이가 " + side + "cm인 두 정사각형을 그림과 같이 겹쳤을 때, 선분 ㄱㄴ의 길이는 몇 cm인가?</p>"
      + diagram(shape) + "<p class=\"source52-p28e32-workspace\">풀이:</p></div>";
    const solution = "<div class=\"source52-p28e32-solution\" data-source-answer=\"" + sourceItemId + "\"><p><b>정답: " + side + "cm</b></p><ol>"
      + "<li>겹친 그림에서 밑변 ㄷㄴ은 정사각형의 한 변이므로 " + side + "cm입니다. 왼쪽 변 ㄷㄱ도 기울어진 정사각형의 한 변이므로 " + side + "cm입니다.</li>"
      + "<li>기울어진 정사각형에서 ㄷㄱ과 60°가 표시된 변은 서로 수직입니다. 바깥 정사각형의 밑변 ㄷㄴ과 세로변도 수직이므로, 두 수직 관계로 만든 예각이 같아 ∠ㄱㄷㄴ은 60°입니다.</li>"
      + "<li>두 변의 길이가 " + side + "cm이고 그 끼인각이 60°인 삼각형은 정삼각형입니다. 따라서 선분 ㄱㄴ의 길이도 <b>" + side + "cm</b>입니다.</li></ol></div>";
    return Object.freeze({
      prompt: "<div data-source-item=\"" + sourceItemId + "\" data-source-item-id=\"" + sourceItemId + "\" data-pool-index=\"" + index + "\">" + prompt + "</div>",
      answer: shape.answer, solution, sourceItemId, generator: generatorKey,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: index,
      verifiedVariantCount: 3, verifiedVariantTarget: 3,
      verifiedVariantId: sourceItemId + ":v" + index, difficultyOffset: 0,
      difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      variantProvenance: "synthetic-source-structure", sourceValuesExcluded: true, sourceStructurePreserved: true, answerVisualRequired: true,
      answerVisualStatus: reviewLocked ? "locked" : "verified-reconstruction",
      answerVisual: diagram(shape, true), publisherKeyVerified: false,
      publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-equilateral-triangle-proof",
      answerModel: shape, reviewLocked
    });
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P28E32Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type)
      ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : ""
      : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type)
      ? api.generatorKey(type) ? makeQuestion(variant, difficulty ?? 0, type.reviewLocked !== false) : null
      : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P28E32Installed", { value: true });
    return true;
  }

  return Object.freeze({ sourceItemId, generatorKey, pools, model, diagram, makeQuestion, install });
});
