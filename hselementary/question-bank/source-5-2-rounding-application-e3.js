(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_ROUNDING_APPLICATION_E3 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const ids = [
    "5-2-u1-e3-exploration-round-up",
    "5-2-u1-e3-exploration-round-down",
    "5-2-u1-e3-exploration-round-nearest"
  ];
  const keys = [
    "source52ApplicationExplorationRoundUp",
    "source52ApplicationExplorationRoundDown",
    "source52ApplicationExplorationRoundNearest"
  ];
  const kinds = ["round-up-to-thousands", "round-down-to-tens", "round-to-nearest-tenth"];
  const difficultyDesigns = [
    ["find-next-thousand", "apply-ceiling", "explain-place-value-ceiling"],
    ["remove-ones", "apply-floor", "explain-place-value-floor"],
    ["inspect-hundredths", "apply-nearest-tenth", "explain-decimal-rounding"]
  ];
  // Values are synthetic source-structure variants; the printed source numbers stay in private QA evidence.
  const pools = [
    [23481, 75813, 99908],
    [578, 2461, 8095],
    [3758, 6424, 8995]
  ];
  const levelDeltas = [13, 7, 3];
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const fmt = value => Number(value).toLocaleString("en-US");
  const formatHundredths = value => `${Math.floor(value / 100)}.${String(value % 100).padStart(2, "0")}`;
  const formatTenths = value => `${Math.floor(value / 100)}.${Math.floor(value / 10) % 10}`;
  const hint = (index, value) => [
    `천의 자리보다 작은 자리의 수가 남아 있으면, 그다음 천 단위로 올립니다. ${fmt(value)}에서 천의 자리 아래를 살펴보세요.`,
    `십의 자리 아래를 없애고, 십의 자리보다 작은 수는 남기지 않습니다.`,
    `소수 첫째 자리까지 반올림할 때는 소수 둘째 자리 숫자를 확인하세요.`
  ][index];
  const equation = value => `<span class="math-inline-expression">${esc(value)}</span>`;
  const item = (kind, prompt, answer, solution, questionModel, answerModel) => ({
    prompt: `<div class="source52-range-question source52-rounding-question" data-source-kind="${kind}">${prompt}</div>`,
    answer,
    solution: `<div class="source52-range-solution source52-rounding-solution">${solution}</div>`,
    questionModel,
    answerModel,
    answerVisualRequired: false,
    answerVisualStatus: "not-required"
  });

  function build(index, poolIndex, level) {
    const sourceValue = pools[index][poolIndex] + level * levelDeltas[index];
    const support = level === 0 ? `<p class="source52-rounding-hint">도움말: ${hint(index, sourceValue)}</p>` : "";
    const explanationRequest = level === 2 ? " 풀이에 어떤 자리를 확인했는지도 적으세요." : "";
    if (index === 0) {
      const answerValue = Math.ceil(sourceValue / 1000) * 1000;
      const remainder = sourceValue % 1000;
      const prompt = `${fmt(sourceValue)}를 올림하여 천의 자리까지 나타내세요.${explanationRequest}${support}`;
      const solution = remainder === 0
        ? `${equation(`${fmt(sourceValue)} ÷ 1,000 = ${sourceValue / 1000}`)}이므로 이미 천의 자리까지 나타낸 수입니다. 올림해도 ${equation(fmt(answerValue))}입니다.`
        : `천의 자리보다 작은 자리에는 ${equation(fmt(remainder))}이 남습니다. 올림하면 다음 천 단위로 가므로 ${equation(`${fmt(sourceValue)} → ${fmt(answerValue)}`)}입니다. 답은 ${equation(fmt(answerValue))}입니다.`;
      return item(kinds[index], prompt, fmt(answerValue), solution,
        { kind: kinds[index], value: sourceValue, unit: 1000, remainder },
        { value: fmt(answerValue), unit: 1000, operation: "ceiling" });
    }
    if (index === 1) {
      const answerValue = Math.floor(sourceValue / 10) * 10;
      const remainder = sourceValue % 10;
      const prompt = `${fmt(sourceValue)}를 버림하여 십의 자리까지 나타내세요.${explanationRequest}${support}`;
      const solution = `일의 자리 숫자 ${remainder}를 버리고 십의 자리 아래를 없앱니다. ${equation(`${fmt(sourceValue)} → ${fmt(answerValue)}`)}이므로 답은 ${equation(fmt(answerValue))}입니다.`;
      return item(kinds[index], prompt, fmt(answerValue), solution,
        { kind: kinds[index], value: sourceValue, unit: 10, remainder },
        { value: fmt(answerValue), unit: 10, operation: "floor" });
    }
    const answerHundredths = Math.floor((sourceValue + 5) / 10) * 10;
    const answerValue = formatTenths(answerHundredths);
    const hundredthsDigit = sourceValue % 10;
    const prompt = `${formatHundredths(sourceValue)}를 반올림하여 소수 첫째 자리까지 나타내세요.${explanationRequest}${support}`;
    const solution = `소수 둘째 자리 숫자는 ${hundredthsDigit}입니다. ${hundredthsDigit >= 5 ? "5 이상이므로 소수 첫째 자리에서 1을 올립니다" : "5보다 작으므로 소수 첫째 자리 숫자를 그대로 둡니다"}. ${equation(`${formatHundredths(sourceValue)} → ${answerValue}`)}이므로 답은 ${equation(answerValue)}입니다.`;
    return item(kinds[index], prompt, answerValue, solution,
      { kind: kinds[index], hundredths: sourceValue, hundredthsDigit },
      { value: answerValue, hundredths: answerHundredths, unit: 0.1, operation: "nearest-half-up" });
  }

  function getQuestion(sourceItemId, variant = 0, difficultyOffset = 0) {
    const index = ids.indexOf(sourceItemId);
    if (index < 0 || !Number.isSafeInteger(variant) || variant < 0 || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const poolIndex = variant % 3, level = difficultyOffset + 1;
    const result = build(index, poolIndex, level);
    return Object.freeze({ ...result,
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${difficultyOffset}" data-level="${level}">${result.prompt}</div>`,
      sourceItemId, generator: keys[index], generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex,
      verifiedVariantCount: 3, verifiedVariantTarget: 3, verifiedVariantId: `${sourceItemId}:v${poolIndex}`,
      variantProvenance: "source-structure-variant", difficultyOffset, difficultyLevel: level, difficultyRank: level,
      sourceDifficultyRank: 1, difficultyDesign: difficultyDesigns[index][level], reasoningSteps: level + 2,
      sourceStepCount: 1, difficultyStepDelta: level - 1,
      sourceStructurePreserved: true, sourceEvidenceRef: "source-memory:hs-elementary.unit.5-2-1.e3-exploration-vision-20261023",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-calculation-user-authorized" });
  }

  const definitions = ids.map((sourceItemId, index) => Object.freeze({ sourceItemId, generatorKey: keys[index], poolCount: 3, kind: kinds[index] }));
  const byId = new Map(definitions.map(definition => [definition.sourceItemId, definition]));
  const ownedKeys = new Set(keys);
  function resolve(type) {
    if (!type || typeof type !== "object") return null;
    const definition = byId.get(type.sourceItemId);
    return definition && type.id === definition.sourceItemId && type.generatorKey === definition.generatorKey ? definition : null;
  }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52ApplicationE3Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const belongs = type => Boolean(type && (byId.has(type.id) || byId.has(type.sourceItemId) || ownedKeys.has(type.generatorKey)));
    api.generatorKey = type => {
      if (!belongs(type)) return previousKey(type);
      const definition = resolve(type);
      return definition && type.reviewLocked === false && type.sourceVerified === true ? definition.generatorKey : "";
    };
    api.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => {
      if (!belongs(type)) return previousGenerate(type, levelRank, difficultyOffset, seed, variant);
      const definition = resolve(type);
      return definition && type.reviewLocked === false && type.sourceVerified === true
        ? getQuestion(definition.sourceItemId, variant, difficultyOffset ?? 0) : null;
    };
    if (Array.isArray(api.names)) for (const key of keys) if (!api.names.includes(key)) api.names.push(key);
    Object.defineProperty(api, "__source52ApplicationE3Installed", { value: true });
    return true;
  }

  return Object.freeze({ ids, keys, kinds, pools, definitions, getQuestion, resolve, install, publisherKeyVerified: false, answerVerification: "independent-calculation-user-authorized" });
});
