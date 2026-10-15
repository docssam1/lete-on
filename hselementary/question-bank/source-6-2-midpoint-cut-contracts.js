(function(root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory(require("./source-6-2-midpoint-cut-models.js"));
  else root.HSE_SOURCE_GRADE6_MIDPOINT_CUT_CONTRACTS = factory(root.HSE_SOURCE_GRADE6_MIDPOINT_CUT_MODELS);
})(typeof window !== "undefined" ? window : globalThis, function(models) {
  "use strict";
  if (!models || typeof models.solve !== "function") throw new Error("Midpoint-cut models must load first");
  const freeze = value => { if (value && typeof value === "object" && !Object.isFrozen(value)) { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
  const learner_stage = "\uCD08\uB4F1 6\uD559\uB144 2\uD559\uAE30 \u00B7 \uD669\uC18C \uC2EC\uD654 \u00B7 \uACF5\uAC04\uACFC \uC785\uCCB4";
  function generate(id, variant, level) {
    if (!Number.isSafeInteger(level) || level < 0 || level > 2) throw new RangeError("Unsupported midpoint difficulty");
    const model = models.solve(id, variant);
    const requestedLayers = level === 0 ? [model.n] : model.layers.map(layer => layer.layer).reverse();
    const selected = model.layers.filter(layer => requestedLayers.includes(layer.layer));
    const cutCount = selected.reduce((sum, layer) => sum + layer.cutCount, 0);
    const answer = level === 2 ? [cutCount, model.touchCount] : cutCount;
    let promptText = `\uC313\uAE30\uB098\uBB34 ${model.cubes.length}\uAC1C\uB85C \uB9CC\uB4E0 \uC815\uC721\uBA74\uCCB4\uB97C \uADF8\uB9BC\uC758 \uC5EC\uC12F \uBAA8\uC11C\uB9AC\uC758 \uC911\uC810 A, B, C, D, E, F\uB97C \uC9C0\uB098\uB294 \uD3C9\uBA74\uC73C\uB85C \uC790\uB985\uB2C8\uB2E4. `;
    promptText += level === 0 ? "\uB9E8 \uC704\uCE35\uC5D0\uC11C \uC798\uB9B0 \uC313\uAE30\uB098\uBB34\uB294 \uBA87 \uAC1C\uC778\uC9C0 \uAD6C\uD558\uC2DC\uC624." : "\uC798\uB9B0 \uC313\uAE30\uB098\uBB34\uB294 \uBAA8\uB450 \uBA87 \uAC1C\uC778\uC9C0 \uAD6C\uD558\uC2DC\uC624.";
    if (level === 2) promptText += " \uD3C9\uBA74\uC774 \uAF2D\uC9D3\uC810\uC774\uB098 \uBAA8\uC11C\uB9AC\uC5D0 \uB2FF\uAE30\uB9CC \uD558\uB294 \uC313\uAE30\uB098\uBB34\uC758 \uAC1C\uC218\uB3C4 \uAD6C\uD558\uC2DC\uC624.";
    promptText += " (\uC313\uAE30\uB098\uBB34\uC758 \uB0B4\uBD80\uAC00 \uC798\uB9B0 \uACBD\uC6B0\uB9CC \uC798\uB9B0 \uAC83\uC73C\uB85C \uC149\uB2C8\uB2E4.)";
    const cutEquation = `${selected.slice().reverse().map(layer => layer.cutCount).join("+")}=${cutCount}`;
    const touchEquation = `${model.layers.slice().reverse().map(layer => layer.touchCount).join("+")}=${model.touchCount}`;
    const span = expression => `<span class="math-inline-expression" style="white-space:nowrap;color:#000">${expression}</span>`;
    const solutionEquations = [cutEquation, ...(level === 2 ? [touchEquation] : [])].map(span);
    const solutionText = `<p>\uAC01 \uCE35\uC5D0\uC11C \uB0B4\uBD80\uAC00 \uC798\uB9B0 \uC313\uAE30\uB098\uBB34\uB97C \uC138\uBA74 ${solutionEquations[0]}\uAC1C\uC785\uB2C8\uB2E4.</p>` +
      (level === 2 ? `<p>\uB2FF\uAE30\uB9CC \uD55C \uC313\uAE30\uB098\uBB34\uB294 ${solutionEquations[1]}\uAC1C\uC774\uBA70, \uC798\uB9B0 \uAC1C\uC218\uC5D0 \uD3EC\uD568\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.</p>` : "");
    return freeze({ sourceItemId: id, variant, level, model, learner_stage, promptText,
      studentGiven: { promptText, dimensions: model.dimensions, points: model.points, sectionEdges: model.sectionEdges, responseLayers: [] },
      requestedLayers, responseLayers: [], requiresLayerDrawing: false, answer,
      answerOrder: level === 2 ? ["cut", "boundary-touch"] : ["cut"], answerUnit: "\uAC1C",
      answerDrawing: selected.map(layer => ({ layer: layer.layer, cells: layer.cutCells })), solutionEquations, solutionText,
      sourceConditionsClarified: true, conditionScope: "positive-volume-cut-only", requestedAnswerUnique: true, requiresOriginalReview: true,
      originalSourceReleaseStatus: "locked", sourceExact: false, publisherAnswerVerified: false, officialAnswerVerified: false,
      handwrittenAnswerVerified: false, humanApproved: false, learnerReleaseVerified: false, empiricallyCalibrated: false,
      structuralFingerprint: `midpoint-cut:${model.dimensions.join("x")}:A-B-C-D-E-F:${level === 0 ? "top" : "all"}`,
      difficultyDesign: { mode: ["easy", "source", "hard"][level], sourceReferenceLevel: 1, sourceReferenceSize: 3,
        problemView: "full-cube-with-six-midpoints", empiricallyCalibrated: false,
        structuralChange: ["\uB9E8 \uC704\uCE35\uC758 \uC798\uB9B0 \uAC1C\uC218\uB9CC \uC149\uB2C8\uB2E4.",
          "\uAC01 \uCE35\uC744 \uAD6C\uBD84\uD558\uC5EC \uC798\uB9B0 \uAC1C\uC218\uB97C \uBAA8\uB450 \uC149\uB2C8\uB2E4.",
          "\uB0B4\uBD80\uAC00 \uC798\uB9B0 \uAC83\uACFC \uB2FF\uAE30\uB9CC \uD55C \uAC83\uC744 \uB530\uB85C \uAD6C\uD569\uB2C8\uB2E4."][level] } });
  }
  return freeze({ generate, sourceItemId: models.sourceItemId, sourceItemIds: models.sourceItemIds, pool: models.pool });
});
