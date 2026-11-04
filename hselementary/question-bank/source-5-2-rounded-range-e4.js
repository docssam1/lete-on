(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_ROUNDED_RANGE_E4 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const explorationId = "5-2-u1-e4-exploration-rounded-range";
  const exampleId = "5-2-u1-e4-example-1";
  const explorationKey = "source52RoundedRangeExploration4";
  const exampleKey = "source52RoundedRangeExample41";
  const explorationOriginalId = "5-2-u1-e4-exploration-rounded-range-original";
  const exampleOriginalId = "5-2-u1-e4-example-1-original";
  const explorationOriginalKey = "source52RoundedRangeExploration4Original";
  const exampleOriginalKey = "source52RoundedRangeExample41Original";
  // Synthetic targets deliberately exclude the source values 4400, 4500, and 7000.
  const explorationTargets = [3200, 6800, 9200];
  const thousandTargets = [9000, 13000, 17000];
  const fmt = value => Number(value).toLocaleString("en-US");

  function getQuestion(sourceItemId, variant = 0, difficultyOffset = 0) {
    const original = sourceItemId === explorationOriginalId || sourceItemId === exampleOriginalId;
    if (!Number.isSafeInteger(variant) || variant < 0 || variant > (original ? 0 : 2) || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const exploration = sourceItemId === explorationId || sourceItemId === explorationOriginalId;
    if (!exploration && sourceItemId !== exampleId && sourceItemId !== exampleOriginalId) return null;
    const key = original ? (exploration ? explorationOriginalKey : exampleOriginalKey) : (exploration ? explorationKey : exampleKey);
    const data = original ? (exploration ? 4500 : 7000) : (exploration ? explorationTargets[variant] : thousandTargets[variant]);
    if (original) difficultyOffset = 0;
    const value = data + (difficultyOffset * (exploration ? 100 : 1000));
    let prompt;
    let answer;
    let solution;
    let answerModel;
    if (exploration) {
      const ceil = value;
      const floor = value - 100;
      const round = value;
      const low = value - 50;
      const high = value - 1;
      answer = "50개";
      prompt = `어떤 자연수를 올림하여 백의 자리까지 나타내면 ${fmt(ceil)}, 버림하여 백의 자리까지 나타내면 ${fmt(floor)}, 반올림하여 백의 자리까지 나타내면 ${fmt(round)}이다. 어떤 수가 될 수 있는 수는 모두 몇 개인가?`;
      solution = `<ol><li>올림 결과가 ${fmt(ceil)}이면 수는 ${fmt(ceil - 99)}부터 ${fmt(ceil)}까지입니다.</li><li>버림 결과가 ${fmt(floor)}이면 수는 ${fmt(floor)}부터 ${fmt(floor + 99)}까지입니다.</li><li>반올림 결과가 ${fmt(round)}이면 수는 ${fmt(round - 50)}부터 ${fmt(round + 49)}까지입니다.</li><li>세 범위의 공통 부분은 ${fmt(low)}부터 ${fmt(high)}까지이므로 ${fmt(high)}−${fmt(low)}+1=50개입니다.</li></ol>`;
      answerModel = { ceil, floor, round, intersectionStart: low, intersectionEnd: high, count: 50 };
    } else {
      const target = value;
      const minimum = target - 500;
      const max = target + 499;
      answer = fmt(minimum);
      prompt = `다음 조건을 모두 만족하는 가장 작은 자연수를 구하여라. 반올림하여 천의 자리까지 나타내면 ${fmt(target)}이 된다. 버림하거나 반올림하여 백의 자리까지 나타낸 어림수는 같다. 올림하거나 반올림하여 십의 자리까지 나타낸 어림수는 같다.`;
      solution = `<ol><li>천의 자리까지 반올림해 ${fmt(target)}이 되는 자연수의 범위는 ${fmt(minimum)}부터 ${fmt(max)}까지입니다.</li><li>가장 작은 후보인 ${fmt(minimum)}에서 백의 자리 버림과 반올림은 모두 ${fmt(minimum)}입니다.</li><li>십의 자리 올림과 반올림도 모두 ${fmt(minimum)}이므로 세 조건을 만족하는 최솟값은 ${fmt(minimum)}입니다.</li></ol>`;
      answerModel = { target, minimum, maximum: max, hundredFloor: minimum, hundredRound: minimum, tenCeil: minimum, tenRound: minimum };
    }
    const promptContent = original && !exploration
      ? `<p>다음 조건을 모두 만족하는 가장 작은 자연수를 구하여라.</p><ul><li>반올림하여 천의 자리까지 나타내면 ${fmt(value)}이 된다.</li><li>버림하거나 반올림하여 백의 자리까지 나타낸 어림수는 같다.</li><li>올림하거나 반올림하여 십의 자리까지 나타낸 어림수는 같다.</li></ul>`
      : `<p>${prompt}</p>`;
    return Object.freeze({
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}">${promptContent}</div>`,
      answer, solution: `<div data-source-answer="${sourceItemId}">${solution}</div>`, sourceItemId, generator: key,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: variant, verifiedVariantCount: original ? 1 : 3, verifiedVariantTarget: original ? 1 : 3,
      verifiedVariantId: `${sourceItemId}:v${variant}`, difficultyOffset, difficultyLevel: difficultyOffset + 1,
      difficultyRank: difficultyOffset + 1, sourceStructurePreserved: true, answerVisualRequired: false, answerVisualStatus: "not-required",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-calculation-user-authorized", answerModel
    });
  }
  const definitions = Object.freeze([
    Object.freeze({ sourceItemId: explorationId, generatorKey: explorationKey }),
    Object.freeze({ sourceItemId: exampleId, generatorKey: exampleKey }),
    Object.freeze({ sourceItemId: explorationOriginalId, generatorKey: explorationOriginalKey }),
    Object.freeze({ sourceItemId: exampleOriginalId, generatorKey: exampleOriginalKey })
  ]);
  const keyFor = id => definitions.find(def => def.sourceItemId === id)?.generatorKey || "";
  function install(target) {
    const generators = target?.HSE_GENERATORS;
    if (!generators || typeof generators.generatorKey !== "function" || typeof generators.generate !== "function") return false;
    if (generators.__source52RoundedRangeE4Installed) return true;
    const previousKey = generators.generatorKey.bind(generators);
    const previousGenerate = generators.generate.bind(generators);
    const related = type => definitions.find(def => type && (type.id === def.sourceItemId || type.sourceItemId === def.sourceItemId || type.generatorKey === def.generatorKey));
    generators.generatorKey = type => {
      const def = related(type);
      return !def ? previousKey(type) : type.id === def.sourceItemId && type.sourceItemId === def.sourceItemId && type.generatorKey === def.generatorKey && type.reviewLocked === false && type.sourceVerified === true ? def.generatorKey : "";
    };
    generators.generate = (type, rank, difficulty, seed, variant = 0) => {
      const def = related(type);
      return !def ? previousGenerate(type, rank, difficulty, seed, variant) : generators.generatorKey(type) ? getQuestion(def.sourceItemId, variant, difficulty ?? 0) : null;
    };
    for (const def of definitions) if (Array.isArray(generators.names) && !generators.names.includes(def.generatorKey)) generators.names.push(def.generatorKey);
    Object.defineProperty(generators, "__source52RoundedRangeE4Installed", { value: true });
    return true;
  }
  return Object.freeze({ definitions, getQuestion, keyFor, install, publisherKeyVerified: false });
});
