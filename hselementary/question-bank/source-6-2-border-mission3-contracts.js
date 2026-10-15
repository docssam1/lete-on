(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory(require("./source-6-2-stack-pattern-models.js"));
  else root.HSE_SOURCE_GRADE6_BORDER_MISSION3_CONTRACTS = factory(root.HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS);
})(typeof window !== "undefined" ? window : globalThis, function (models) {
  "use strict";
  const sourceItemId = "6-2-u3-e2-mission-3", sourceItemIds = Object.freeze([sourceItemId]);
  const stages = [10, 8, 12], modes = ["easy", "source", "hard"];
  const learner_stage = "초등 6학년 2학기 · 황소 심화 · 공간과 입체";
  const learnerConditions = "첫째 도형은 가로와 세로가 각각 3칸입니다. 다음 도형은 각 변이 2칸씩 늘어난 정사각형입니다. 각 도형의 테두리에 쌓기나무를 한 개씩 놓고, 안쪽은 왼쪽 위 칸을 빈칸으로 하여 가로와 세로 방향으로 빈칸과 쌓기나무 한 개가 번갈아 놓이도록 다시 만듭니다. 쌓기나무의 한 모서리 길이는 1 cm이며 그 밖에는 놓지 않습니다.";
  const faceDefinition = "면의 넓이는 쌓기나무끼리 맞닿지 않은 모든 면의 넓이입니다. 구멍을 향한 안쪽 옆면과 그림에서 가려진 옆면도 포함하고, 바닥에 닿은 밑면은 모두 제외합니다.";
  const structuralChanges = [
    "쌓기나무 수와 안쪽 빈칸 수를 제공하고 면의 넓이와 수의 차이를 구합니다.",
    "쌓기나무 수와 안쪽 빈칸 수를 스스로 찾아 원래 수의 차이만 구합니다.",
    "원래 수의 차이와 안쪽 빈칸을 모두 한 개씩 채운 뒤의 수의 차이를 차례대로 구합니다."
  ];
  function freeze(value) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze); Object.freeze(value);
    }
    return value;
  }
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
      reportFile: "independent-pattern-review.md", section: "6. Mission 3: 테두리와 내부 0·1 격자",
      reportSha256: "8140B3E7AC8200C9F7D15BE163A293AB7272F0C18AF088955A73ACCDAAD541E1",
      cropFile: "mission3-original.png",
      cropSha256: "606FFE5D17DFFEDED10AC6C9F59B69FD33F4974C2050506755515CC756AB5A12",
      pdfSha256: "69035C63AD62DED1308E490D7073C7CE01F7D9887CFE338F3D88AAC10B9A6FAE",
      pdfPage: 33, printedPage: 35,
      sourceFirstThreeHeights: [
        [[1,1,1],[1,0,1],[1,1,1]],
        [[1,1,1,1,1],[1,0,1,0,1],[1,1,0,1,1],[1,0,1,0,1],[1,1,1,1,1]],
        [[1,1,1,1,1,1,1],[1,0,1,0,1,0,1],[1,1,0,1,0,1,1],[1,0,1,0,1,0,1],
          [1,1,0,1,0,1,1],[1,0,1,0,1,0,1],[1,1,1,1,1,1,1]]
      ],
      sourceFirstThreeTotals: [8,20,36], sourceFirstThreeEmptyInteriorCounts: [1,5,13],
      originalRequestedStage: 10, originalQuestionOrder: ["original-numeric-difference"]
    },
    approvalBoundary: "Parent source interpretation is the boundary. Explicit added conditions determine these conditional answers; the original first three grids do not force a unique future. No publisher, handwritten, official, human, construction-adoption or learner-release approval."
  });
  const directions = [
    ["positiveX",1,0,0], ["negativeX",-1,0,0], ["positiveY",0,1,0],
    ["negativeY",0,-1,0], ["positiveZ",0,0,1], ["negativeZ",0,0,-1]
  ];
  // Keep each face tied to its voxel, including excluded ground and contact faces.
  function measure(H, cubes) {
    const side = H.length, occupied = new Set(cubes.map(cube => cube.join(",")));
    const components = Object.fromEntries(["top", "outerSides", "innerHoleSides", "groundBottoms", "contacts"]
      .map(name => [name, { count: 0, faces: [] }]));
    const emptyInteriorCells = [], rowHoleCounts = [];
    for (let z = 1; z < side - 1; z++) {
      let empty = 0;
      for (let x = 1; x < side - 1; x++) if (H[z][x] === 0) {
        emptyInteriorCells.push([x,z]); empty++;
      }
      rowHoleCounts.push(empty);
    }
    for (const cube of cubes) {
      const [x,y,z] = cube;
      for (const [direction,dx,dy,dz] of directions) {
        const neighbor = [x+dx,y+dy,z+dz];
        const category = occupied.has(neighbor.join(",")) ? "contacts" :
          dy === -1 ? "groundBottoms" : dy === 1 ? "top" :
          neighbor[0] < 0 || neighbor[0] >= side || neighbor[2] < 0 || neighbor[2] >= side ? "outerSides" : "innerHoleSides";
        components[category].faces.push({ cube: cube.slice(), direction, neighbor });
        components[category].count++;
      }
    }
    const count = cubes.length;
    const areaCm2 = components.top.count + components.outerSides.count + components.innerHoleSides.count;
    return {
      H, cubes, side, highest: 1, count, cubeCount: count, cubeEdgeLengthCm: 1,
      emptyInteriorCells, emptyInteriorCount: emptyInteriorCells.length, rowHoleCounts, components,
      areaCm2, surfaceAreaExcludingAllBottomCm2: areaCm2, exposedFacesExcludingAllBottom: areaCm2,
      groundBottomFaces: components.groundBottoms.count,
      allExposedFaces: areaCm2 + components.groundBottoms.count,
      sharedFacePairs: components.contacts.count / 2, numericDifference: areaCm2 - count
    };
  }
  function validateGeometry(model, stage) {
    let side = 3;
    for (let next = 1; next < stage; next++) side += 2;
    if (model.mode !== "border-checker-surface-minus-count" || model.n !== stage ||
        model.xOrigin !== 0 || model.zOrigin !== 0 || !Array.isArray(model.H) || model.H.length !== side ||
        !Array.isArray(model.cubes)) throw new Error("Unexpected border mission-3 model");
    const cells = [];
    for (let z = 0; z < side; z++) {
      if (!Array.isArray(model.H[z]) || model.H[z].length !== side) throw new Error("Invalid height grid");
      for (let x = 0; x < side; x++) {
        const expected = x === 0 || z === 0 || x === side - 1 || z === side - 1 || (x+z)%2 === 1 ? 1 : 0;
        if (model.H[z][x] !== expected) throw new Error("Height grid violates explicit construction");
        if (expected) cells.push([x,z]);
      }
    }
    const keys = new Set();
    for (const cube of model.cubes) {
      if (!Array.isArray(cube) || cube.length !== 3 || !cube.every(Number.isSafeInteger)) throw new Error("Invalid voxel");
      const [x,y,z] = cube, key = cube.join(",");
      if (x < 0 || x >= side || z < 0 || z >= side || y !== 0 || model.H[z][x] !== 1 || keys.has(key))
        throw new Error("Voxel does not match single-layer cells");
      keys.add(key);
    }
    if (cells.length !== keys.size || !Array.isArray(model.layers) || model.layers.length !== 1 ||
        model.layers[0].layer !== 1 || !Array.isArray(model.layers[0].cells) || model.layers[0].cells.length !== cells.length)
      throw new Error("Incomplete single-layer cells");
    const layerKeys = new Set(model.layers[0].cells.map(cell => {
      if (!Array.isArray(cell) || cell.length !== 2 || !cell.every(Number.isSafeInteger) ||
          !keys.has([cell[0],0,cell[1]].join(","))) throw new Error("Layer cell mismatch");
      return cell.join(",");
    }));
    if (layerKeys.size !== cells.length) throw new Error("Duplicate layer cell");
  }
  function generate(id, variant, level) {
    if (id !== sourceItemId || !Number.isSafeInteger(variant) || variant < 0 || variant > 2 ||
        !Number.isSafeInteger(level) || level < 0 || level > 2)
      throw new RangeError("Invalid border mission-3 source, variant or difficulty");
    if (!models || typeof models.solve !== "function") throw new Error("Stack pattern models are required");
    const stage = stages[variant], model = models.solve(id, variant);
    if (!model || typeof model !== "object") throw new Error("Missing border model");
    validateGeometry(model, stage);
    const surface = measure(model.H, model.cubes), side = surface.side;
    const countCue = level === 0 ? { cubeCount: surface.count, emptyInteriorCount: surface.emptyInteriorCount } : null;
    const question = `쌓기나무의 수를 ㄱ개, 밑면을 제외한 면의 넓이를 ㄴ cm²라고 할 때, 두 수의 차이 ㄴ-ㄱ의 값을 구하시오.`;
    let promptText = `${learnerConditions} ${faceDefinition} ${stage}번째 도형에 대하여 `;
    if (level === 0) promptText += `쌓기나무는 ${countCue.cubeCount}개이고 안쪽 빈칸은 ${countCue.emptyInteriorCount}칸입니다. ${question}`;
    else if (level === 1) promptText += question;
    else promptText += `다음 물음에 답하시오.\n(1) ${question}\n(2) 원래 도형의 안쪽 빈칸을 모두 쌓기나무 한 개씩으로 채웁니다. 다른 쌓기나무는 옮기지 않고 한 층으로 만듭니다. 채운 뒤에도 같은 방법으로 정한 두 수의 차이 ㄴ-ㄱ의 값을 구하시오.`;
    const solutionEquations = [];
    const math = equation => {
      solutionEquations.push(equation);
      return `<span class="math-inline-expression" style="color:#000">${equation}</span>`;
    };
    let solution = `<p>각 변은 2칸씩 ${stage - 1}번 늘어납니다. 늘어난 칸은 ${math(`2×${stage - 1}=${side - 3}`)}칸, 한 변은 ${math(`3+${side - 3}=${side}`)}칸입니다.</p>`;
    const fullCount = surface.count + surface.emptyInteriorCount;
    solution += `<p>정사각형 전체는 ${math(`${side}×${side}=${fullCount}`)}칸입니다.</p>`;
    const rowGroups = new Map();
    surface.rowHoleCounts.forEach(empty => rowGroups.set(empty, (rowGroups.get(empty) || 0) + 1));
    const groupTotals = [];
    for (const [empty, rows] of rowGroups) {
      groupTotals.push(empty * rows);
      solution += `<p>빈칸 ${empty}개인 줄은 ${rows}줄이므로 ${math(`${empty}×${rows}=${empty * rows}`)}칸입니다.</p>`;
    }
    solution += `<p>안쪽 빈칸은 ${math(`${groupTotals.join("+")}=${surface.emptyInteriorCount}`)}칸, 쌓기나무 수 ㄱ은 ${math(`${fullCount}-${surface.emptyInteriorCount}=${surface.count}`)}입니다.</p>`;
    solution += `<p>윗면은 쌓기나무마다 하나씩 ${surface.components.top.count}개입니다. 바깥 옆면은 ${math(`${side}×4=${surface.components.outerSides.count}`)}개입니다.</p>`;
    solution += `<p>빈칸마다 안쪽 옆면이 네 개씩 있으므로 ${math(`${surface.emptyInteriorCount}×4=${surface.components.innerHoleSides.count}`)}개입니다. 바닥에 닿은 밑면은 세지 않습니다.</p>`;
    solution += `<p>한 면의 넓이는 1 cm<sup>2</sup>이므로 면의 넓이는 ${math(`${surface.components.top.count}+${surface.components.outerSides.count}+${surface.components.innerHoleSides.count}=${surface.areaCm2}`)} cm<sup>2</sup>입니다.</p>`;
    solution += `<p>ㄴ과 ㄱ의 수치만 빼면 ${math(`${surface.areaCm2}-${surface.count}=${surface.numericDifference}`)}입니다.</p>`;
    const answer = level === 2 ? [surface.numericDifference] : surface.numericDifference;
    const answerOrder = ["original-numeric-difference"];
    let filledPattern = null;
    if (level === 2) {
      const H = model.H.map(row => row.slice());
      const addedCubes = surface.emptyInteriorCells.map(([x,z]) => { H[z][x] = 1; return [x,0,z]; });
      filledPattern = { ...measure(H, [...model.cubes, ...addedCubes]), n: stage, xOrigin: 0, zOrigin: 0, addedCubes, moves: [] };
      solution += `<p>빈칸을 모두 채우면 쌓기나무는 ${math(`${surface.count}+${addedCubes.length}=${filledPattern.count}`)}개입니다. 윗면도 ${filledPattern.components.top.count}개이고 구멍 안쪽 옆면은 없어집니다.</p>`;
      solution += `<p>바깥 옆면은 그대로 ${filledPattern.components.outerSides.count}개이므로 면의 넓이는 ${math(`${filledPattern.components.top.count}+${filledPattern.components.outerSides.count}=${filledPattern.areaCm2}`)} cm<sup>2</sup>입니다.</p>`;
      solution += `<p>채운 뒤 두 수의 차이는 ${math(`${filledPattern.areaCm2}-${filledPattern.count}=${filledPattern.numericDifference}`)}입니다.</p>`;
      answer.push(filledPattern.numericDifference); answerOrder.push("filled-numeric-difference");
    }
    return freeze({
      sourceItemId: id, variant, level, stage, model, promptText, learnerConditions, faceDefinition,
      answer, answerOrder, resultContract: level === 2 ? "ordered" : "single-value", solution, solutionEquations,
      surface, surfaceComponents: surface.components, count: surface.count, areaCm2: surface.areaCm2,
      numericDifference: surface.numericDifference, countCue, easyCue: countCue, filledPattern, filledModel: filledPattern,
      sourcepolicy, learner_stage,
      difficultyDesign: { mode: modes[level], structuralChange: structuralChanges[level], empiricallyCalibrated: false },
      learnerFit: {
        id: "learner-fit", learner_stage,
        criteria: ["language", "representations", "prerequisites", "reasoning-load", "response-mode"],
        language: "일상적인 한국어 구성 조건과 두 수의 차이. 면적 단위는 수치의 뺄셈과 구별합니다.",
        representations: "원본의 위에서 본 0과 1의 높이표와 짧은 자연수 계산식. 새 투시도는 사용하지 않습니다.",
        prerequisites: ["위에서 본 높이표 읽기", "정사각형의 칸 세기", "윗면·옆면·밑면 구별", "자연수의 덧셈·뺄셈·곱셈", "단위 정사각형의 넓이"],
        reasoningLoad: ["제공된 개수에서 윗면·바깥 옆면·안쪽 옆면을 구별하여 한 차이 구하기", "격자의 빈칸과 쌓기나무를 세고 세 종류의 면을 더하여 한 차이 구하기", "원래 모양과 빈칸을 채운 한 층 모양의 면을 구별하여 두 차이를 순서대로 구하기"][level],
        responseMode: level === 2 ? "ordered-integer-numeric-differences" : "integer-numeric-difference", responseCount: level === 2 ? 2 : 1,
        evidenceFile: "source-6-2-border-mission3-contracts-audit.js", humanReviewPending: true, empiricallyCalibrated: false
      },
      sourceRef: model.sourceRef, conditionPolicy: model.patternConditionPolicy,
      sourceExact: false, originalAnswerDeterminate: false, originalSourceReleaseStatus: "locked",
      publisherAnswerVerified: false, handwrittenAnswerVerified: false, officialAnswerVerified: false,
      requestedAnswerUniqueUnderExplicitConstruction: true,
      requestedAnswerUnique: true, uniqueRequestedNumericAnswerUnderConstruction: true,
      sourceConditionsClarified: true, sourceConditionProvenance: "explicit-learner-given-conditions",
      constructionConditionApproved: false, officialHumanApproval: false,
      registrationOnly: true, learnerReleaseVerified: false, productionLoaded: false, catalogUnlock: false, deployed: false
    });
  }
  return freeze({ generate, sourceItemIds, learner_stage, learnerConditions, faceDefinition,
    registrationOnly: true, learnerReleaseVerified: false });
});
