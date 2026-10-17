(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory(require("./source-6-2-stack-pattern-models.js"));
  else root.HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_CONTRACTS = factory(root.HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS);
})(typeof window !== "undefined" ? window : globalThis, function (models) {
  "use strict";
  const sourceItemId = "6-2-u3-e2-example-2", sourceItemIds = Object.freeze([sourceItemId]);
  const learner_stage = "초등 6학년 2학기 · 황소 심화 · 공간과 입체";
  const learnerConditions = "모양의 차례와 같은 수의 층을 쌓습니다. 맨 위층은 세 개를 한 줄로 놓고 가운데 앞에 한 개를 붙입니다. 바로 아래층은 윗층의 자리를 모두 채우고 왼쪽·오른쪽·앞쪽 세 갈래 끝에 각각 한 개를 더 붙입니다. 1층까지 같은 방법으로 쌓고 그 밖에는 놓지 않습니다.";
  const easyStages = [3, 2, 1], modes = ["easy", "source", "hard"];
  const easyConditions = "그림에 보이는 첫째, 둘째, 셋째 T자 쌓기나무 모양 중에서 구하시오.";
  const structuralChanges = [
    "원문 첫 세 그림에 이미 보이는 모양 하나의 총개수만 구합니다.",
    "층별 개수를 스스로 구해 총개수와 1층에서 맨 위층의 개수를 뺀 차이를 구합니다.",
    "총개수와 층 차이를 구한 뒤, 맨 위 세 층을 모두 제거했을 때 남은 개수를 구합니다."
  ];
  function freeze(value) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze); Object.freeze(value);
    }
    return value;
  }
  const sourcepolicy = freeze({
    originalSourceReleaseStatus: "locked", originalAnswerDeterminate: false,
    publisherAnswerVerified: false, handwrittenAnswerVerified: false, sourceExact: false,
    sourceFirstThreeOnly: true, firstThreeForceUniqueFuture: false,
    sourceConditionsClarified: true, sourceConditionProvenance: "explicit-learner-given-conditions",
    requestedAnswerUnique: true, uniqueRequestedNumericAnswerUnderConstruction: true,
    answerBasis: "conditional-independent-calculation", constructionConditionApproved: false,
    officialHumanApproval: false, registrationOnly: true, learnerReleaseVerified: false,
    productionLoaded: false, catalogUnlock: false, deployed: false,
    sourceEvidence: {
      reportFile: "independent-pattern-review.md", section: "4. 예제 2-2: T자 세 갈래 계단",
      reportSha256: "8140B3E7AC8200C9F7D15BE163A293AB7272F0C18AF088955A73ACCDAAD541E1",
      cropFile: "example2-2-original.png",
      cropSha256: "FFDD0604850EE125343A37D7879B7BEFD94128BE455A94BE84619E003D2D2ED0",
      pdfPage: 32, printedPage: 34, sourceFirstThreeTotals: [4, 11, 21],
      originalRequestedStage: 25,
      originalQuestionOrder: ["total-cubes", "ground-layer-minus-25th-layer"]
    },
    approvalBoundary: "Bounded local contracts only. The added construction determines the answers, not the original first three pictures. No publisher, handwriting, teacher, construction-adoption or release approval."
  });
  function generate(id, variant, level) {
    if (id !== sourceItemId || !Number.isSafeInteger(variant) || variant < 0 || variant > 2 ||
        !Number.isSafeInteger(level) || level < 0 || level > 2)
      throw new RangeError("Invalid T-pattern example-2 source, variant or difficulty");
    if (!models || typeof models.solve !== "function" || (level === 0 && typeof models.build !== "function"))
      throw new Error("Stack pattern models are required");
    const model = level === 0 ? freeze({ ...models.build(id, { n: easyStages[variant] }), variant }) : models.solve(id, variant);
    const stage = model.n, givenConditions = level === 0 ? easyConditions : learnerConditions;
    // Counts come from the reused voxel model, never its closed-form formula audit.
    const topDown = model.layers.slice().reverse().map(layer => ({ layer: layer.layer, count: layer.cells.length }));
    const counts = topDown.map(layer => layer.count), total = counts.reduce((sum, count) => sum + count, 0);
    const ground = counts.at(-1), top = counts[0], difference = ground - top;
    const solutionEquations = [];
    const math = equation => {
      solutionEquations.push(equation);
      return `<span class="math-inline-expression">${equation}</span>`;
    };
    let promptText = `${learnerConditions} ${stage}번째 모양에 대하여 다음 물음에 답하시오. `;
    const layerCue = null;
    if (level === 0) {
      promptText = `${givenConditions} ${stage}번째 모양의 쌓기나무는 모두 몇 개인지 구하시오.`;
    } else {
      promptText += `\n(1) 쌓기나무는 모두 몇 개인지 구하시오.\n(2) 1층에 놓인 쌓기나무는 ${stage}층에 놓인 쌓기나무보다 몇 개 더 많은지 구하시오.`;
      if (level === 2) promptText += `\n(3) ${stage}층부터 바로 아래의 두 층까지, 맨 위 세 층의 쌓기나무를 모두 제거하면 몇 개가 남는지 구하시오. 나머지 층의 쌓기나무는 그대로 둡니다.`;
    }
    let solution = "맨 위층은 한 줄의 세 개와 가운데 앞의 한 개로 이루어진 T자입니다. ";
    solution += `맨 위층의 개수는 ${math("3+1=4개")}입니다. 한 층 내려갈 때마다 세 갈래에 한 개씩 붙이므로 ${math("1+1+1=3개")}씩 늘어납니다. `;
    if (level === 0) {
      solutionEquations.length = 0;
      solution = `<p>그림에 보이는 ${stage}번째 T자 모양을 층별로 세어 더하면 ${math(`${counts.join("+")}=${total}개`)}입니다.</p>`;
    } else {
      // Pair actual layer counts from opposite ends, with an unpaired middle for odd stages.
      const pairCount = Math.floor(counts.length / 2), pairSum = counts[0] + counts.at(-1);
      solution += "맨 위층과 바닥층, 그 다음 윗층과 그 다음 아랫층을 차례로 짝지어 더합니다. ";
      for (let pair = 0; pair < pairCount; pair++) {
        const first = counts[pair], last = counts[counts.length - 1 - pair];
        if (first + last !== pairSum) throw new Error("T-pattern layer pairs must have equal sums");
        if (pair < 2) solution += `<p>${math(`${first}+${last}=${pairSum}개`)}.</p>`;
      }
      solution += `<p>모든 짝의 합이 ${pairSum}개로 같습니다. ${pairCount}쌍의 합은 ${math(`${pairSum}×${pairCount}=${pairSum * pairCount}개`)}입니다.</p>`;
      if (counts.length % 2) {
        const middle = counts[pairCount];
        solution += `<p>가운데 ${topDown[pairCount].layer}층의 ${middle}개를 더하면 ${math(`${pairSum * pairCount}+${middle}=${total}개`)}입니다.</p>`;
      } else solution += `<p>모든 층이 짝을 이루므로 총 ${total}개입니다.</p>`;
      solution += `<p>1층은 ${ground}개, ${stage}층은 ${top}개이므로 차이는 ${math(`${ground}-${top}=${difference}개`)}입니다.</p>`;
    }
    const answer = level === 0 ? [total] : [total, difference];
    const answerOrder = level === 0 ? ["total-cubes"] : ["total-cubes", "ground-layer-minus-top-layer"];
    let removedTopLayers = null;
    if (level === 2) {
      const rows = topDown.slice(0, 3), removed = rows.reduce((sum, row) => sum + row.count, 0), remaining = total - removed;
      removedTopLayers = { count: 3, rows, removed, remaining };
      solution += `<p>맨 위 세 층은 각각 ${rows.map(row => `${row.layer}층 ${row.count}개`).join(", ")}입니다. 제거하는 개수는 ${math(`${rows.map(row => row.count).join("+")}=${removed}개`)}입니다.</p>`;
      solution += `<p>남은 개수는 ${math(`${total}-${removed}=${remaining}개`)}입니다.</p>`;
      answer.push(remaining); answerOrder.push("remaining-after-removing-top-three-layers");
    }
    return freeze({
      sourceItemId: id, variant, level, model, promptText, answer, answerOrder, solution, solutionEquations,
      resultContract: "ordered", sourcepolicy, learner_stage, learnerConditions: givenConditions, layerCue, removedTopLayers,
      difficultyDesign: { mode: modes[level], structuralChange: structuralChanges[level], empiricallyCalibrated: false },
      learnerFit: {
        id: "learner-fit", learner_stage,
        criteria: ["language", "representations", "prerequisites", "reasoning-load", "response-mode"],
        prerequisites: ["층과 바닥의 구별", "쌓기나무 개수 세기", "자연수의 덧셈·뺄셈·곱셈"],
        reasoningLoad: ["이미 보이는 모양 하나를 세는 한 물음", "층별 개수 찾기와 짝짓기 합, 두 층의 차이", "짝짓기 합과 층 차이, 제거할 세 층 구별과 남은 개수"][level],
        responseMode: "ordered-integer-counts", responseCount: answer.length,
        evidenceFile: "source-6-2-t-pattern-example2-contracts-audit.js", humanReviewPending: true,
        empiricallyCalibrated: false
      },
      sourceRef: model.sourceRef, conditionPolicy: model.patternConditionPolicy,
      requestedAnswerUnique: true, uniqueRequestedNumericAnswerUnderConstruction: true,
      sourceConditionsClarified: true, sourceConditionProvenance: "explicit-learner-given-conditions",
      originalSourceReleaseStatus: "locked", originalAnswerDeterminate: false,
      publisherAnswerVerified: false, handwrittenAnswerVerified: false, sourceExact: false,
      constructionConditionApproved: false, officialHumanApproval: false,
      registrationOnly: true, learnerReleaseVerified: false
    });
  }
  return freeze({ generate, sourceItemIds, learner_stage, learnerConditions, registrationOnly: true, learnerReleaseVerified: false });
});
