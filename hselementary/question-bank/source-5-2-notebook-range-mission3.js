(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_NOTEBOOK_RANGE_MISSION3 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u1-e4-mission-3-notebook-range";
  const generatorKey = "source52NotebookRangeMissionThree";
  const pools = Object.freeze([
    Object.freeze({ studentCeilingTarget: 70, notebooksPrepared: 250 }),
    Object.freeze({ studentCeilingTarget: 90, notebooksPrepared: 340 }),
    Object.freeze({ studentCeilingTarget: 110, notebooksPrepared: 430 })
  ]);
  const format = value => Number(value).toLocaleString("ko-KR");

  function getQuestion(variant = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant >= pools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const pool = pools[variant];
    const studentCeilingTarget = pool.studentCeilingTarget + difficultyOffset * 10;
    const notebooksPrepared = pool.notebooksPrepared;
    const notebooksPerStudent = 3;
    const studentRange = [studentCeilingTarget - 9, studentCeilingTarget];
    if (studentRange[0] < 1) return null;
    const leftoverRange = [notebooksPrepared - notebooksPerStudent * studentRange[1], notebooksPrepared - notebooksPerStudent * studentRange[0]];
    if (leftoverRange[0] < 0) return null;
    const attainableLeftovers = [];
    for (let n = studentRange[0]; n <= studentRange[1]; n += 1) attainableLeftovers.push(notebooksPrepared - notebooksPerStudent * n);
    const sortedAttainable = attainableLeftovers.slice().sort((a, b) => a - b);
    const prompt = `한 반 학생 수를 올림하여 십의 자리까지 나타내면 ${format(studentCeilingTarget)}명입니다. 학생들에게 공책을 한 명당 3권씩 나누어 주려고 ${format(notebooksPrepared)}권을 준비했습니다. 나누어 주고 남은 공책 수의 범위를 이상과 이하를 사용하여 나타내세요.`;
    const solution = `<ol><li>십의 자리까지 올림하여 ${format(studentCeilingTarget)}명이 되는 학생 수는 ${format(studentRange[0])}명부터 ${format(studentRange[1])}명까지입니다.</li><li>학생 수를 n명이라 하면 남는 공책은 ${format(notebooksPrepared)}−3×n권입니다.</li><li>학생이 ${format(studentRange[1])}명일 때 가장 적게 남아 ${format(leftoverRange[0])}권이고, ${format(studentRange[0])}명일 때 가장 많이 남아 ${format(leftoverRange[1])}권입니다.</li><li>따라서 남는 공책 수의 범위는 ${format(leftoverRange[0])}권 이상 ${format(leftoverRange[1])}권 이하입니다. 실제 가능한 수는 ${sortedAttainable.map(format).join(", ")}권으로, 3권씩 차이 납니다.</li></ol>`;
    return Object.freeze({
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}"><p>${prompt}</p></div>`,
      answer: `${format(leftoverRange[0])}권 이상 ${format(leftoverRange[1])}권 이하`,
      solution: `<div data-source-answer="${sourceItemId}">${solution}</div>`,
      sourceItemId, generator: generatorKey, generationMode: "fixed-verified-pool",
      verifiedPoolIndex: variant, verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length,
      verifiedVariantId: `${sourceItemId}:v${variant}`, difficultyOffset,
      difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      sourceStructurePreserved: true, answerVisualRequired: false, answerVisualStatus: "not-required",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-calculation-user-authorized",
      questionModel: { studentCeilingTarget, studentRange, notebooksPrepared, notebooksPerStudent },
      answerModel: { leftoverRange, attainableLeftovers: sortedAttainable }
    });
  }

  function install(target) {
    const generators = target?.HSE_GENERATORS;
    if (!generators || typeof generators.generatorKey !== "function" || typeof generators.generate !== "function") return false;
    if (generators.__source52NotebookRangeMission3Installed) return true;
    const previousKey = generators.generatorKey.bind(generators);
    const previousGenerate = generators.generate.bind(generators);
    const isType = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    const resolves = type => type && type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true;
    generators.generatorKey = type => !isType(type) ? previousKey(type) : resolves(type) ? generatorKey : "";
    generators.generate = (type, rank, difficulty, seed, variant = 0) => !isType(type) ? previousGenerate(type, rank, difficulty, seed, variant) : resolves(type) ? getQuestion(variant, difficulty ?? 0) : null;
    if (Array.isArray(generators.names) && !generators.names.includes(generatorKey)) generators.names.push(generatorKey);
    Object.defineProperty(generators, "__source52NotebookRangeMission3Installed", { value: true });
    return true;
  }

  return Object.freeze({ sourceItemId, generatorKey, pools, getQuestion, install, publisherKeyVerified: false });
});
