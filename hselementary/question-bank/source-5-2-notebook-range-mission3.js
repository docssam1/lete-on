(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_NOTEBOOK_RANGE_MISSION3 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u1-e4-mission-3-notebook-range";
  const generatorKey = "source52NotebookRangeMission3";
  const pools = Object.freeze([
    Object.freeze({ ceilingTarget: 80, notebooksPerStudent: 3, totalNotebooks: 320 }),
    Object.freeze({ ceilingTarget: 120, notebooksPerStudent: 3, totalNotebooks: 520 }),
    Object.freeze({ ceilingTarget: 170, notebooksPerStudent: 3, totalNotebooks: 660 })
  ]);
  const offsets = Object.freeze([-10, 0, 10]);
  const format = value => Number(value).toLocaleString("ko-KR");

  function getQuestion(variant = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant >= pools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const pool = pools[variant];
    const ceilingTarget = pool.ceilingTarget + offsets[difficultyOffset + 1];
    const { notebooksPerStudent, totalNotebooks } = pool;
    const studentRange = [ceilingTarget - 9, ceilingTarget];
    const remainderValues = studentRange.map(students => totalNotebooks - notebooksPerStudent * students);
    if (studentRange[0] < 1 || remainderValues.some(value => value < 0)) return null;
    const remainderRange = [Math.min(...remainderValues), Math.max(...remainderValues)];
    const possibleRemainders = Array.from({ length: studentRange[1] - studentRange[0] + 1 }, (_, index) => totalNotebooks - notebooksPerStudent * (studentRange[0] + index));
    const prompt = `어떤 학급의 학생 수를 올림하여 십의 자리까지 나타내면 ${format(ceilingTarget)}명입니다. 학생 한 명에게 공책 3권씩 나누어 주려고 공책 ${format(totalNotebooks)}권을 준비했습니다. 나누어 주고 남는 공책 수의 범위를 이상과 이하를 사용하여 나타내세요.`;
    const solution = `<ol><li>십의 자리까지 올림하여 ${format(ceilingTarget)}명이 되는 학생 수는 ${format(studentRange[0])}명부터 ${format(studentRange[1])}명까지입니다.</li><li>학생이 가장 많을 때 남는 공책은 ${format(totalNotebooks)}−3×${format(studentRange[1])}=${format(remainderRange[0])}권입니다.</li><li>학생이 가장 적을 때 남는 공책은 ${format(totalNotebooks)}−3×${format(studentRange[0])}=${format(remainderRange[1])}권입니다.</li><li>따라서 남는 공책 수의 범위는 ${format(remainderRange[0])}권 이상 ${format(remainderRange[1])}권 이하입니다. 가능한 남은 수는 3권씩 차이 납니다.</li></ol>`;
    return Object.freeze({
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}"><p>${prompt}</p></div>`,
      answer: `${format(remainderRange[0])}권 이상 ${format(remainderRange[1])}권 이하`,
      solution: `<div data-source-answer="${sourceItemId}">${solution}</div>`,
      sourceItemId,
      generator: generatorKey,
      generationMode: "fixed-verified-pool",
      verifiedPoolIndex: variant,
      verifiedVariantCount: pools.length,
      verifiedVariantTarget: pools.length,
      verifiedVariantId: `${sourceItemId}:v${variant}`,
      difficultyOffset,
      difficultyLevel: difficultyOffset + 1,
      difficultyRank: difficultyOffset + 1,
      sourceStructurePreserved: true,
      answerVisualRequired: false,
      answerVisualStatus: "not-required",
      publisherKeyVerified: false,
      publisherAnswerVerified: false,
      handwrittenAnswerVerified: false,
      answerVerification: "independent-calculation-user-authorized",
      questionModel: { ceilingTarget, notebooksPerStudent, totalNotebooks, studentRange, remainderRange, possibleRemainders },
      answerModel: { minimum: remainderRange[0], maximum: remainderRange[1] }
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
  return Object.freeze({ sourceItemId, generatorKey, pools, offsets, getQuestion, install, publisherKeyVerified: false });
});
