(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory(require("./source-6-2-stack-pattern-models.js"));
  else root.HSE_SOURCE_GRADE6_STAIR_MISSION1_CONTRACTS = factory(root.HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS);
})(typeof window !== "undefined" ? window : globalThis, function (models) {
  "use strict";
  const sourceItemId = "6-2-u3-e2-mission-1", sourceItemIds = Object.freeze([sourceItemId]);
  const learner_stage = "초등 6학년 2학기 · 황소 심화 · 공간과 입체";
  const learnerConditions = "첫째 모양은 쌓기나무 한 개입니다. 다음 모양은 앞쪽의 낮은 계단을 그대로 두고 뒤쪽 두 변에 각각 한 줄씩 기둥을 붙여 바닥을 정사각형으로 만듭니다. 새 기둥의 높이는 그 모양의 차례와 같습니다. 각 기둥은 바닥부터 빈틈없이 쌓고 그 밖에는 놓지 않습니다.";
  const stages = [5, 4, 6], modes = ["easy", "source", "hard"];
  const easyStages = [3, 2, 1];
  const easyConditions = "그림에 보이는 첫째, 둘째, 셋째 계단 모양 중에서 구하시오.";
  const structuralChanges = [
    "원문 첫 세 그림에 이미 보이는 모양 하나의 총개수만 구합니다.",
    "층별 개수를 스스로 찾아 총개수만 구합니다.",
    "총개수와 맨 위 두 층을 모두 제거한 뒤 남은 개수를 구합니다. 남은 쌓기나무는 옮기지 않습니다."
  ];
  function freeze(value) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze); Object.freeze(value);
    }
    return value;
  }
  const sum = values => values.reduce((total, value) => total + value, 0);
  const sourcepolicy = freeze({
    sourceExact: false, originalAnswerDeterminate: false, originalSourceReleaseStatus: "locked",
    publisherAnswerVerified: false, handwrittenAnswerVerified: false, officialAnswerVerified: false,
    sourceFirstThreeOnly: true, firstThreeForceUniqueFuture: false,
    sourceConditionsClarified: true, sourceConditionProvenance: "explicit-learner-given-conditions",
    requestedAnswerUniqueUnderExplicitConstruction: true,
    requestedAnswerUnique: true, uniqueRequestedNumericAnswerUnderConstruction: true,
    answerBasis: "conditional-independent-calculation", constructionConditionApproved: false,
    officialHumanApproval: false, registrationOnly: true, learnerReleaseVerified: false,
    productionLoaded: false, catalogUnlock: false, deployed: false,
    sourceEvidence: {
      reportFile: "independent-pattern-review.md", section: "5. Mission 1: 두 방향으로 올라가는 안쪽 계단",
      reportSha256: "8140B3E7AC8200C9F7D15BE163A293AB7272F0C18AF088955A73ACCDAAD541E1",
      cropFile: "mission1-original.png",
      cropSha256: "27910D959229ED790459CA4616EFA08A983AB9E3174BA2C30918EB8375DD437B",
      pdfPage: 33, printedPage: 35,
      sourceFirstThreeHeights: [[[1]], [[2, 2], [2, 1]], [[3, 3, 3], [3, 2, 2], [3, 2, 1]]],
      sourceFirstThreeTotals: [1, 7, 22], originalRequestedStage: 5,
      originalQuestionOrder: ["total-cubes"]
    },
    approvalBoundary: "Bounded local contracts only. Explicit added conditions determine the answers; the original first three pictures do not force a unique future. No publisher, handwritten, official, teacher, construction-adoption or release approval."
  });
  function generate(id, variant, level) {
    if (id !== sourceItemId || !Number.isSafeInteger(variant) || variant < 0 || variant > 2 ||
        !Number.isSafeInteger(level) || level < 0 || level > 2)
      throw new RangeError("Invalid stair mission-1 source, variant or difficulty");
    if (!models || typeof models.solve !== "function" || (level === 0 && typeof models.build !== "function"))
      throw new Error("Stack pattern models are required");
    const stage = level === 0 ? easyStages[variant] : stages[variant];
    const model = level === 0 ? freeze({ ...models.build(id, { n: stage }), variant }) : models.solve(id, variant);
    const givenConditions = level === 0 ? easyConditions : learnerConditions;
    if (model.mode !== "two-direction-stair-total" || model.n !== stage)
      throw new Error("Unexpected stair mission-1 model");
    // Derive all counts from actual cells/voxels, not the model's answer or formula fields.
    const rows = model.layers.map(layer => ({ layer: layer.layer, count: layer.cells.length }));
    const counts = rows.map(row => row.count), total = sum(counts);
    const occupied = new Set(model.cubes.map(cube => cube.join(",")));
    const missingLayers = rows.map(row => {
      const cells = [];
      for (let x = 0; x < stage; x++) for (let z = 0; z < stage; z++) {
        if (!occupied.has([x, row.layer - 1, z].join(","))) cells.push([x, z]);
      }
      return { layer: row.layer, side: row.layer - 1, count: cells.length };
    });
    const missing = sum(missingLayers.map(row => row.count));
    const volumeSubtraction = { fullCubeCount: total + missing, missingLayers, missing, total };
    const layerCue = null;
    let promptText = `${givenConditions} ${stage}번째 모양에 대하여 `;
    if (level === 0) promptText += "쌓기나무는 모두 몇 개인지 구하시오.";
    else if (level === 1) promptText += "쌓기나무는 모두 몇 개인지 구하시오.";
    else promptText += `다음 물음에 답하시오.\n(1) 쌓기나무는 모두 몇 개인지 구하시오.\n(2) ${stage}층과 ${stage - 1}층, 맨 위 두 층의 쌓기나무를 모두 제거하면 몇 개가 남는지 구하시오. 남은 쌓기나무는 옮기지 않습니다.`;
    const solutionEquations = [], alternateSolutionEquations = [];
    const inlineMath = stream => equation => {
      stream.push(equation);
      return `<span class="math-inline-expression">${equation}</span>`;
    };
    const math = inlineMath(solutionEquations), alternateMath = inlineMath(alternateSolutionEquations);
    let solution = "<p>각 층은 정사각형 바닥의 칸에서 앞 모서리 쪽 빈 칸을 빼어 셉니다.</p>";
    rows.forEach(row => {
      const empty = missingLayers[row.layer - 1];
      const expression = empty.count === 0 ? `${stage}×${stage}` : `${stage}×${stage}-${empty.side}×${empty.side}`;
      solution += `<p>${row.layer}층: ${math(`${expression}=${row.count}개`)}.</p>`;
    });
    solution += `<p>모든 층을 더하면 ${math(`${counts.join("+")}=${total}개`)}입니다.</p>`;
    let alternateSolution = `<p>다르게 세면, 빈 곳까지 채운 정육면체는 ${alternateMath(`${stage}×${stage}×${stage}=${volumeSubtraction.fullCubeCount}개`)}입니다.</p>`;
    const holes = missingLayers.filter(row => row.count > 0);
    alternateSolution += holes.length ? `<p>층별 빈 곳은 ${holes.map(row => alternateMath(`${row.side}×${row.side}×1=${row.count}개`)).join(", ")}입니다.</p>` : "<p>빈 곳은 없습니다.</p>";
    alternateSolution += `<p>빈 곳의 합은 ${alternateMath(`${holes.map(row => row.count).join("+") || "0"}=${missing}개`)}이므로 ${alternateMath(`${volumeSubtraction.fullCubeCount}-${missing}=${total}개`)}입니다.</p>`;
    const answer = [total], answerOrder = ["total-cubes"];
    let removedTopLayers = null;
    if (level === 2) {
      const topRows = rows.slice(-2).reverse(), removed = sum(topRows.map(row => row.count));
      const remainingCubes = model.cubes.filter(([, y]) => y < stage - 2);
      const removedCubes = model.cubes.filter(([, y]) => y >= stage - 2);
      const remaining = sum(counts.slice(0, -2));
      removedTopLayers = { count: 2, rows: topRows, removed, remaining, removedCubes, remainingCubes, moves: [] };
      solution += `<p>맨 위 두 층에서 ${math(`${topRows.map(row => row.count).join("+")}=${removed}개`)}를 제거합니다.</p>`;
      solution += `<p>남은 개수는 ${math(`${total}-${removed}=${remaining}개`)}입니다.</p>`;
      answer.push(remaining); answerOrder.push("remaining-after-removing-top-two-layers");
    }
    return freeze({
      sourceItemId: id, variant, level, model, promptText, answer, answerOrder,
      resultContract: "ordered", solution, solutionEquations, alternateSolution, alternateSolutionEquations,
      alternateSolutionAudience: "private-reviewer", volumeSubtraction,
      sourcepolicy, learner_stage, learnerConditions: givenConditions, layerCue, removedTopLayers,
      difficultyDesign: { mode: modes[level], structuralChange: structuralChanges[level], empiricallyCalibrated: false },
      learnerFit: {
        id: "learner-fit", learner_stage,
        criteria: ["language", "representations", "prerequisites", "reasoning-load", "response-mode"],
        prerequisites: ["층과 바닥의 구별", "두 수의 크기 비교", "쌓기나무 개수 세기", "자연수의 덧셈·뺄셈·곱셈"],
        reasoningLoad: ["이미 보이는 모양 하나를 세는 한 물음", "층별 빈 칸을 찾아 전체 개수를 더하는 한 물음", "전체 개수와 제거할 두 층을 구별하여 남은 개수 구하기"][level],
        responseMode: "ordered-integer-counts", responseCount: answer.length,
        evidenceFile: "source-6-2-stair-mission1-contracts-audit.js", humanReviewPending: true,
        empiricallyCalibrated: false
      },
      sourceRef: model.sourceRef, conditionPolicy: model.patternConditionPolicy,
      sourceExact: false, originalAnswerDeterminate: false, originalSourceReleaseStatus: "locked",
      publisherAnswerVerified: false, handwrittenAnswerVerified: false, officialAnswerVerified: false,
      requestedAnswerUniqueUnderExplicitConstruction: true,
      requestedAnswerUnique: true, uniqueRequestedNumericAnswerUnderConstruction: true,
      sourceConditionsClarified: true, sourceConditionProvenance: "explicit-learner-given-conditions",
      constructionConditionApproved: false, officialHumanApproval: false,
      registrationOnly: true, learnerReleaseVerified: false,
      productionLoaded: false, catalogUnlock: false, deployed: false
    });
  }
  return freeze({ generate, sourceItemIds, learner_stage, learnerConditions, registrationOnly: true, learnerReleaseVerified: false });
});
