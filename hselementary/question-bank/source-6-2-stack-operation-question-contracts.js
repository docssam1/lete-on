(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./source-6-2-stack-operations.js"));
  } else if (typeof define === "function" && define.amd) {
    define(["./source-6-2-stack-operations.js"], factory);
  } else {
    root.HSE_SOURCE_GRADE6_STACK_OPERATION_QUESTION_CONTRACTS = factory(root.HSE_SOURCE_GRADE6_STACK_OPERATIONS);
  }
})(typeof window !== "undefined" ? window : globalThis, function (operations) {
  "use strict";
  if (!operations || typeof operations.solve !== "function" || !Array.isArray(operations.definitions)) {
    throw new Error("Stack operations must be loaded before question contracts");
  }
  const clone = value => Array.isArray(value) ? value.map(clone) :
    value && typeof value === "object" ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clone(item)])) : value;
  function freeze(value) {
    if (value && (typeof value === "object" || typeof value === "function") && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze);
      Object.freeze(value);
    }
    return value;
  }
  const sourceIds = ["6-2-u3-e1-example-2", "6-2-u3-e1-mission-5", "6-2-u3-e1-mission-6"];
  const definitions = freeze(sourceIds.map(sourceItemId => {
    const source = operations.definitions.find(item => item.sourceItemId === sourceItemId);
    if (!source || source.pools.length !== 3) throw new Error("Expected three fixed models for each operation source");
    return { sourceItemId, variantCount: 3, levels: [0, 1, 2], sourceStepCount: sourceItemId.endsWith("mission-6") ? 4 : 3,
      sourceRef: clone(source), officialAnswerVerified: false };
  }));
  const labels = Array.from({ length: 7 }, (_, index) => String.fromCodePoint(0x3260 + index));
  const viewConvention = freeze({ heightRows: "back-to-front", heightColumns: "left-to-right",
    cellAxes: ["right", "up", "front"], topRows: "back-to-front", topColumns: "left-to-right",
    frontProfile: "left-to-right", rightProfile: "front-to-back", backProfile: "reverse-front",
    leftProfile: "reverse-right", preserveEmptyRowsAndColumns: true, removalGravity: false });
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const names = { top: "위", front: "앞", right: "오른쪽", back: "뒤", left: "왼쪽" };
  function viewsWithOpposites(views) {
    return { ...clone(views), back: views.front.slice().reverse(), left: views.right.slice().reverse() };
  }
  function heightsOf(cells, heights) {
    const result = heights.map(row => row.map(() => 0));
    for (const [x, y, z] of cells) result[z][x] = Math.max(result[z][x], y + 1);
    return result;
  }
  function generate(sourceItemId, variant, level) {
    const definition = definitions.find(item => item.sourceItemId === sourceItemId);
    if (!definition || !Number.isSafeInteger(variant) || variant < 0 || variant >= definition.variantCount ||
        !Number.isSafeInteger(level) || level < 0 || level > 2) throw new RangeError("Invalid operation source, variant or level");
    const result = operations.solve(sourceItemId, variant), source = definition.sourceRef;
    const before = viewsWithOpposites(result.original);
    const contract = { sourceItemId, variant, level, sourceRef: source, variantCount: 3, viewConvention,
      registrationOnly: true, officialAnswerVerified: false, learnerReleaseVerified: false,
      beforeHeights: clone(result.heights),
      givenSolid: { cells: clone(result.cells), labels: [], markedCells: [] },
      givenViews: {}, givenViewStages: {}, answerViews: {}, requestedViews: [],
      answerLabels: [], secondaryAnswerLabels: [], secondaryRequestedViews: [],
      reasoningSteps: [], sourceStepCount: definition.sourceStepCount };
    function give(name, stage, views) {
      contract.givenViews[name] = clone(views[name]);
      contract.givenViewStages[name] = stage;
    }
    let structuralChange;
    if (sourceItemId === sourceIds[0]) {
      contract.answerKind = "labels";
      contract.operation = { kind: source.operation, independentRemovals: true, removeCountPerTrial: 1 };
      contract.givenSolid.labels = result.trials.map(trial => ({ label: trial.label, cell: clone(trial.target) }));
      contract.requestedViews = ["front", "right"];
      contract.answerViews = { front: clone(before.front), right: clone(before.right) };
      contract.answerLabels = result.answer.slice();
      contract.removalTrials = result.trials.map(trial => {
        const afterCells = result.cells.filter(cell => !same(cell, trial.target));
        return { label: trial.label, removedCell: clone(trial.target), qualifies: trial.qualifies,
          changesTop: !same(before.top, trial.after.top), afterHeights: heightsOf(afterCells, result.heights),
          afterViews: viewsWithOpposites(trial.after) };
      });
      contract.promptText = `${level === 0 ? "쌓기나무로 만든 입체도형과 앞, 오른쪽에서 본 모양입니다." : "쌓기나무로 만든 입체도형입니다."} ${labels.join(", ")}의 쌓기나무를 각각 한 개씩 따로 빼었을 때, 앞과 오른쪽에서 본 모양이 모두 변하지 않는 쌓기나무의 기호를 모두 쓰시오.`;
      const collectStep = `두 모양이 모두 변하지 않는 기호는 ${contract.answerLabels.join(", ")}입니다.`;
      contract.reasoningSteps = level === 0 ?
        ["일곱 기호의 쌓기나무를 각각 한 개씩 따로 뺀 모양을 주어진 앞과 오른쪽 모양과 비교합니다.", collectStep] :
        ["일곱 기호의 쌓기나무를 각각 한 개씩 따로 뺀 모습을 생각합니다.",
          "각각 앞과 오른쪽에서 본 모양을 빼기 전과 비교합니다.", collectStep];
      contract.solutionText = `${contract.answerLabels.join(", ")}을 각각 하나씩 빼면 앞과 오른쪽에서 본 모양이 모두 변하지 않습니다. 나머지 기호의 쌓기나무를 빼면 둘 중 적어도 한 모양이 변합니다.`;
      if (level === 0) { give("front", "before", before); give("right", "before", before); }
      if (level === 2) {
        // TOP is a separate label question, never another condition on the primary answer set.
        contract.secondaryRequestedViews = ["top"];
        contract.secondaryAnswerLabels = contract.removalTrials.filter(trial => trial.qualifies && trial.changesTop).map(trial => trial.label);
        contract.promptText += " 또, 그 기호 중에서 위에서 본 모양이 변하는 쌓기나무의 기호를 모두 쓰시오.";
        const secondaryText = `그중 위에서 본 모양이 변하는 기호는 ${contract.secondaryAnswerLabels.join(", ")}입니다.`;
        contract.reasoningSteps.push(secondaryText);
        contract.solutionText += ` ${secondaryText}`;
      }
      structuralChange = ["빼기 전 앞과 오른쪽에서 본 모양을 함께 제공합니다.", "기호가 표시된 입체도형만 제공합니다.",
        "앞과 오른쪽 모양을 유지하는 기호를 찾은 뒤, 그중 위 모양이 변하는 기호를 따로 찾습니다."][level];
    } else {
      const after = viewsWithOpposites(result.after);
      contract.answerKind = "views";
      contract.afterHeights = heightsOf(result.afterCells, result.heights);
      if (sourceItemId === sourceIds[1]) {
        contract.operation = { kind: source.operation, additions: source.additions.map((addition, index) => ({
          label: labels[index], column: clone(addition.column), count: addition.count })) };
        contract.givenSolid.labels = source.additions.map(({ column: [x, z] }, index) => ({
          label: labels[index], cell: [x, result.heights[z][x] - 1, z] }));
        give("top", "before", before);
        if (level === 0) give("right", "before", before);
        contract.requestedViews = level === 2 ? ["right", "front"] : ["right"];
        contract.promptText = `쌓기나무로 만든 입체도형과 위에서 본 모양${level === 0 ? ", 더 쌓기 전 오른쪽에서 본 모양" : ""}입니다. ${labels[0]} 위에 쌓기나무 2개, ${labels[1]} 위에 쌓기나무 1개를 더 쌓았을 때, ${level === 2 ? "오른쪽과 앞에서 본 모양을 각각" : "오른쪽에서 본 모양을"} 그리시오.`;
        contract.reasoningSteps = level === 0 ?
          [`${labels[0]} 위에 쌓기나무 2개, ${labels[1]} 위에 쌓기나무 1개를 더 쌓습니다.`,
            "주어진 더 쌓기 전 오른쪽 모양에서 달라지는 부분을 확인하여, 더 쌓은 뒤 오른쪽 모양을 그립니다."] :
          [`${labels[0]} 위에 쌓기나무 2개를 더 쌓습니다.`, `${labels[1]} 위에 쌓기나무 1개를 더 쌓습니다.`,
            "더 쌓은 뒤 오른쪽에서 본 모양을 구합니다."];
        if (level === 2) contract.reasoningSteps.push("같은 입체도형을 앞에서 본 모양도 구합니다.");
        structuralChange = ["더 쌓기 전 오른쪽에서 본 모양도 함께 제공합니다.", "입체도형과 위에서 본 모양을 주고, 오른쪽 모양만 묻습니다.",
          "더 쌓는 조건은 그대로 두고 앞에서 본 모양도 묻습니다."][level];
      } else {
        contract.operation = { kind: source.operation, removeAllMarked: true, markedColor: "black" };
        contract.givenSolid.markedCells = clone(source.markedCells);
        contract.totalGiven = result.cells.length;
        contract.requestedViews = level === 0 ? ["front", "right"] : level === 1 ? ["top", "front", "right"] : ["top", "front", "right", "back", "left"];
        if (level === 0) give("top", "after", after);
        contract.promptText = `쌓기나무 ${contract.totalGiven}개로 만든 입체도형입니다. 검은색 쌓기나무 ${source.markedCells.length}개를 모두 빼었을 때, ${level === 0 ? "앞과 오른쪽" : level === 1 ? "위, 앞, 오른쪽" : "위, 앞, 오른쪽, 뒤, 왼쪽"}에서 본 모양을 각각 그리시오.${level === 0 ? " 검은색 쌓기나무를 모두 뺀 뒤 위에서 본 모양이 주어져 있습니다." : ""}`;
        contract.reasoningSteps = ["검은색 쌓기나무를 모두 빼고 남은 쌓기나무를 확인합니다.",
          ...contract.requestedViews.map(name => `${names[name]}에서 본 모양을 구합니다.`)];
        structuralChange = ["모두 뺀 뒤 위에서 본 모양을 주고, 앞과 오른쪽 모양만 묻습니다.", "전체 쌓기나무 수와 색칠된 입체도형을 주고 세 방향 모양을 묻습니다.",
          "빼는 조건은 그대로 두고 뒤와 왼쪽에서 본 모양도 묻습니다."][level];
      }
      contract.answerViews = Object.fromEntries(contract.requestedViews.map(name => [name, clone(after[name])]));
      contract.solutionText = `${contract.reasoningSteps.join(" ")} ${contract.requestedViews.map(name => names[name]).join(", ")}에서 본 모양은 정답 그림과 같습니다.`;
    }
    contract.difficultyDesign = { mode: ["easy", "source", "hard"][level], structuralChange,
      givenViews: Object.keys(contract.givenViews), requestedViews: contract.requestedViews.slice(),
      secondaryRequestedViews: contract.secondaryRequestedViews.slice(), empiricallyCalibrated: false };
    return freeze(contract);
  }
  return freeze({ definitions, generate, variantCount: 3, levels: [0, 1, 2], viewConvention, registrationOnly: true,
    officialAnswerVerified: false, learnerReleaseVerified: false });
});
