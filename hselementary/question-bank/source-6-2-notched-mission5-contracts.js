(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./source-6-2-notched-mission5-models.js"));
  } else root.HSE_SOURCE_GRADE6_NOTCHED_MISSION5_CONTRACTS = factory(root.HSE_SOURCE_GRADE6_NOTCHED_MISSION5_MODELS);
})(typeof window !== "undefined" ? window : globalThis, function (models) {
  "use strict";
  if (!models) throw new Error("Notched Mission5 models must be loaded first");
  function freeze(value) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze); Object.freeze(value);
    }
    return value;
  }
  const sourceItemId = models.sourceItemId;
  const learner_stage = "초등 6학년 2학기 · 황소 심화 · 공간과 입체";
  const learnerFitCriteria = freeze({
    language: "쌓기나무, 층, 앞쪽 모서리, 맞닿은 면, 개수의 차를 사용합니다.",
    representations: "뒤쪽 모서리가 맞는 입체 그림과 층별 배열 및 자연수 계산만 사용합니다.",
    prerequisites: "정사각형의 칸 수, 자연수의 덧셈과 뺄셈, 한 자리 수의 곱셈을 알고 있습니다.",
    "reasoning-load": "하: 보이지 않는 개수 한 가지만, 중: 보이는 개수와 보이지 않는 개수의 차, 상: 모서리를 채운 뒤에도 같은 차를 구합니다.",
    "response-mode": "보이는 개수에서 보이지 않는 개수를 뺀 정수 한 개 또는 정수 두 개를 순서대로 씁니다." });
  const math = value => `<span class="math-inline-expression" style="white-space:nowrap;color:#000">${value}</span>`;
  const sum = numbers => numbers.join("+") || "0";
  function rowsFor(model) {
    return model.layers.map(layer => {
      const hiddenRows = [];
      for (let z = 0; z < layer.side; z++) {
        const count = layer.hiddenCells.filter(cell => cell[1] === z).length;
        if (count) hiddenRows.push(count);
      }
      return { layer: layer.layer, side: layer.side, total: layer.cells.length,
        hidden: layer.hiddenCells.length, visible: layer.visibleCells.length,
        cubeEquation: layer.side === 1 ? "1=1" : `${layer.side}×${layer.side}${model.filled ? "" : "-1"}=${layer.cells.length}`,
        hiddenEquation: `${sum(hiddenRows)}=${layer.hiddenCells.length}` };
    });
  }
  function explain(model, label, hiddenOnly = false) {
    const rows = rowsFor(model);
    const hiddenLayers = rows.filter(row => row.hidden > 0);
    const equations = [...rows.map(row => row.cubeEquation), ...hiddenLayers.map(row => row.hiddenEquation)].map(math);
    const totalEquation = `${sum(rows.map(row => row.total))}=${model.total}`;
    const hiddenEquation = `${sum(hiddenLayers.map(row => row.hidden))}=${model.hidden}`;
    const visibleEquation = `${model.total}-${model.hidden}=${model.visible}`;
    const differenceEquation = `${model.visible}-${model.hidden}=${model.difference}`;
    if (hiddenOnly) return { rows,
      equations: [...hiddenLayers.map(row => row.hiddenEquation), hiddenEquation].map(math),
      text: "<p>여섯 면이 모두 다른 쌓기나무와 맞닿은 쌓기나무만 셉니다. 1층은 바닥에 닿은 면이 보이므로 보이지 않는 쌓기나무가 없습니다.</p>" +
        "<p>" + hiddenLayers.map(row => `${row.layer}층 ${math(row.hiddenEquation)}`).join(", ") +
        `입니다. 보이지 않는 개수는 ${math(hiddenEquation)}입니다.</p>` };
    equations.push(...[totalEquation, hiddenEquation, visibleEquation, differenceEquation].map(math));
    const text = `<p>${label} 층별 전체 개수는 ` + rows.map(row =>
      `${row.layer}층 ${math(row.cubeEquation)}`).join(", ") + "입니다.</p>" +
      "<p>1층은 바닥에 닿은 면이 보이므로 보이지 않는 쌓기나무가 없습니다. 여섯 면이 모두 다른 쌓기나무와 맞닿은 안쪽 쌓기나무만 줄별로 셉니다. " +
      (hiddenLayers.length ? "보이지 않는 개수는 " + hiddenLayers.map(row =>
        `${row.layer}층 ${math(row.hiddenEquation)}`).join(", ") + "입니다. 나머지 층에는 없습니다." : "보이지 않는 쌓기나무는 없습니다.") + "</p>" +
      `<p>전체 개수: ${math(totalEquation)}. 보이지 않는 개수: ${math(hiddenEquation)}.</p>` +
      `<p>보이는 개수: ${math(visibleEquation)}. 따라서 개수의 차는 ${math(differenceEquation)}입니다.</p>`;
    return { rows, equations, text };
  }
  function generate(id, variant, level) {
    if (id !== sourceItemId || !Number.isSafeInteger(variant) || variant < 0 || variant > 2 ||
      !Number.isSafeInteger(level) || level < 0 || level > 2) {
      throw new RangeError("Unsupported notched Mission5 source or difficulty");
    }
    const model = models.solve(variant);
    const givenOmittedBottomLayers = 2;
    const layerLabels = model.layers.slice(givenOmittedBottomLayers).map(layer => layer.layer);
    const givenLayers = model.layers.slice(givenOmittedBottomLayers).map(layer => ({
      layer: layer.layer, y: layer.y, side: layer.side, cells: layer.cells }));
    const givenModel = { cubes: model.cubes.filter(cube => cube[1] >= givenOmittedBottomLayers),
      layers: givenLayers, layerLabels, givenOmittedBottomLayers,
      complete: false, ellipsisBelow: true };
    const layerCue = null;
    const filled = level === 2 ? models.build(model.n, true) : null;
    const originalExplanation = explain(model, "처음 도형의", level === 0);
    const filledExplanation = filled ? explain(filled, "빈 모서리를 채운 도형의") : null;
    const answerOrder = level === 2 ? ["original", "filled"] : ["original"];
    const answer = filled ? [model.difference, filled.difference] : level === 0 ? model.hidden : model.difference;
    let promptText = `쌓기나무를 ${model.n}층까지 쌓았습니다. ${models.constructionText} ${models.visibilityText} `;
    if (givenOmittedBottomLayers) promptText += "그림에서는 아래 두 층을 생략했습니다. ";
    promptText += filled ? "(1) 처음 도형에서 보이는 쌓기나무의 개수에서 보이지 않는 쌓기나무의 개수를 뺀 값을 구하시오. (2) 맨 위층을 제외한 각 층의 비어 있는 가장 앞쪽 모서리에 쌓기나무를 한 개씩 채웠습니다. 채운 뒤 보이는 쌓기나무의 개수에서 보이지 않는 쌓기나무의 개수를 뺀 값을 구하시오." :
      level === 0 ? "보이지 않는 쌓기나무는 모두 몇 개인지 구하시오." : "보이는 쌓기나무의 개수에서 보이지 않는 쌓기나무의 개수를 뺀 값을 구하시오.";
    const sourcepolicy = { ...models.conditionPolicy, ...models.verification,
      originalQuestionScope: "visible minus hidden only", hardQuestionScope: "same difference after filling each non-top front corner",
      sourceSixLayerReferenceVariant: 0, sourceConditionsClarified: true, sourceOnlyFutureAndVisibilityClarified: true };
    const solutionEquations = [...originalExplanation.equations, ...(filledExplanation ? filledExplanation.equations : [])];
    const solutionText = originalExplanation.text + (filledExplanation ? " " + filledExplanation.text : "");
    return freeze({ sourceItemId, variant, level, model, sourceRef: model.sourceRef,
      learner_stage, learnerFitCriteria,
      learnerFitGate: { id: "learner-fit", learner_stage, criteria: learnerFitCriteria,
        status: "pending-human-review", technicalCriteriaRecorded: true, humanApproved: false },
      conditionPolicy: models.conditionPolicy, sourcepolicy,
      learnerConditions: [models.constructionText, models.visibilityText],
      givenOmittedBottomLayers, layerLabels, givenModel, layerCue,
      studentGiven: { promptText, givenModel, layerCue },
      filledModel: filled ? { H: filled.H, cubes: filled.cubes, layers: filled.layers } : null,
      filledRows: filledExplanation ? filledExplanation.rows : null,
      rows: originalExplanation.rows, sourceTotal: model.layers.reduce((total, layer) => total + layer.cells.length, 0),
      answer, answerUnit: "개", answerOrder, resultContract: filled ? "ordered" : "single-value",
      answerContract: { kind: filled ? "ordered" : "single-value", valueType: "integer", order: answerOrder },
      requestedAnswerUnique: true, uniqueRequestedNumericAnswerUnderConstruction: true,
      promptText, solutionText, solutionEquations,
      answerExposurePolicy: "studentGiven only before solving; model, rows, answers and solutions are teacher/solution data",
      difficultyDesign: { mode: ["easy", "source", "hard"][level], sourceReferenceLevel: 1,
        sourceReferenceLayers: 6, full3DGiven: false,
        structuralChange: ["원그림의 생략을 유지하고 보이지 않는 개수만 구합니다. 풀이 단서는 제공하지 않습니다.",
          "원그림처럼 아래 두 층을 생략하여 생각합니다.",
          "빈 앞쪽 모서리를 채운 뒤에도 같은 개수의 차를 구합니다."][level],
        empiricallyCalibrated: false },
      ...models.verification });
  }
  return freeze({ generate, sourceItemId, sourceItemIds: [sourceItemId], learner_stage,
    learnerFitCriteria, definitions: [{ sourceItemId, variantCount: 3, levels: [0, 1, 2] }], ...models.verification });
});
