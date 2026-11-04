(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_POPULATION_BAR_LENGTH = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u1-e3-mission-5-bar-graph-length";
  const generatorKey = "source52ApplicationMissionFivePopulationBarLength";
  const originalId = "5-2-u1-e3-mission-5-bar-graph-length-original";
  const originalKey = "source52ApplicationMissionFivePopulationBarLengthOriginal";
  const cityNames = ["가 도시", "나 도시", "다 도시"];
  // Synthetic values preserve the source's three-city rounding-and-scale task without copying its populations.
  const pools = Object.freeze([
    Object.freeze([2341000, 1958000, 4041000]),
    Object.freeze([3448000, 2951000, 1649000]),
    Object.freeze([4450000, 3550000, 2950000])
  ]);
  const difficultyDeltas = Object.freeze([-1000, 0, 1000]);
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const fmt = value => Number(value).toLocaleString("en-US");
  const fmtLength = value => `${Number.isInteger(value) ? value : value.toFixed(1)}cm`;
  const roundHundredThousand = value => Math.floor(value / 100000 + 0.5) * 100000;

  function build(variant, difficultyOffset, original = false) {
    const itemId = original ? originalId : sourceItemId;
    const names = original ? ["부산광역시", "인천광역시", "대전광역시"] : cityNames;
    const populations = original ? [3434091,2956513,1486647] : pools[variant].map(value => value + difficultyDeltas[difficultyOffset + 1]);
    const cityResults = names.map((city, index) => {
      const population = populations[index];
      const roundedPopulation = roundHundredThousand(population);
      const hundredThousandUnits = roundedPopulation / 100000;
      const lengthMm = hundredThousandUnits * 5;
      return { city, population, roundedPopulation, hundredThousandUnits, lengthMm, lengthCm: lengthMm / 10 };
    });
    const answer = cityResults.map(item => `${item.city} ${fmtLength(item.lengthCm)}`).join(", ");
    const rows = cityResults.map(item => `<tr><th scope="row">${esc(item.city)}</th><td>${fmt(item.population)}명</td></tr>`).join("");
    const hint = difficultyOffset === -1
      ? `<p class="source52-population-bar-hint">도움말: 먼저 인구를 십만 단위로 반올림한 뒤, 십만 명의 개수에 5mm를 곱하세요.</p>` : "";
    const challenge = difficultyOffset === 1
      ? `<p class="source52-population-bar-challenge">계산할 때 반올림한 인구와 mm를 cm로 바꾸는 과정도 적으세요.</p>` : "";
    const originalPrompt = `<div class="source52-population-bar-question"><p>교재에 제시된 작년 1월의 부산광역시 인구는 3434091명, 인천광역시는 2956513명, 대전광역시는 1486647명이었다. 각 도시의 인구를 반올림하여 십만의 자리까지 나타낸 후 10만 명을 5mm로 하여 막대그래프로 나타낸다면 각 도시의 인구는 각각 몇 cm씩 표시되겠는가?</p></div>`;
    const syntheticPrompt = `<div class="source52-population-bar-question"><p>다음 표는 세 도시의 가상 인구 자료입니다. 각 도시의 인구를 십만의 자리까지 반올림한 뒤, 10만 명을 5mm로 하여 막대그래프로 나타낼 때 각 막대의 길이는 각각 몇 cm인가요?</p><table class="source52-population-bar-table"><caption>도시별 가상 인구</caption><thead><tr><th scope="col">도시</th><th scope="col">인구</th></tr></thead><tbody>${rows}</tbody></table><p class="source52-population-bar-scale">축척: 10만 명 → 5mm</p>${challenge}${hint}</div>`;
    const prompt = original ? originalPrompt : syntheticPrompt;
    const solution = `<div class="source52-population-bar-solution"><ol>${cityResults.map(item => `<li>${item.city}의 인구 ${fmt(item.population)}명을 십만의 자리까지 반올림하면 ${fmt(item.roundedPopulation)}명입니다. ${fmt(item.roundedPopulation)}÷100,000=${fmt(item.hundredThousandUnits)}이므로 막대 길이는 ${fmt(item.hundredThousandUnits)}×5mm=${fmt(item.lengthMm)}mm=${fmtLength(item.lengthCm)}입니다.</li>`).join("")}</ol><p>따라서 답은 차례로 ${answer}입니다.</p></div>`;
    return Object.freeze({
      prompt: `<div data-source-item="${itemId}" data-source-item-id="${itemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}">${prompt}</div>`,
      answer,
      solution,
      sourceItemId: itemId,
      generator: original ? originalKey : generatorKey,
      generationMode: "fixed-verified-pool",
      verifiedPoolIndex: variant,
      verifiedVariantCount: original ? 1 : pools.length,
      verifiedVariantTarget: original ? 1 : pools.length,
      verifiedVariantId: `${itemId}:v${variant}`,
      difficultyOffset,
      difficultyLevel: difficultyOffset + 1,
      difficultyRank: difficultyOffset + 1,
      difficultyDesign: ["rounding-and-scale-hint", "direct-round-then-scale", "show-unit-conversion"][difficultyOffset + 1],
      reasoningSteps: 3 + difficultyOffset + 1,
      sourceStructurePreserved: true,
      answerVisualRequired: false,
      answerVisualStatus: "not-required",
      publisherKeyVerified: false,
      publisherAnswerVerified: false,
      handwrittenAnswerVerified: false,
      answerVerification: "independent-calculation-user-authorized",
      questionModel: { cities: cityResults.map(({ city, population }) => ({ city, population })), roundingUnit: 100000, scaleMmPerUnit: 5 },
      answerModel: { cities: cityResults, answer }
    });
  }

  function getQuestion(variant = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant >= pools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    return build(variant, difficultyOffset);
  }
  function getOriginal(variant = 0, difficultyOffset = 0) {
    if (variant !== 0 || ![-1,0,1].includes(difficultyOffset)) return null;
    return build(0,0,true);
  }
  const definition = Object.freeze({ sourceItemId, generatorKey, poolCount: pools.length });
  function resolves(type) { return Boolean(type && ((type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey) || (type.id === originalId && type.sourceItemId === originalId && type.generatorKey === originalKey))); }
  function install(target) {
    const generators = target?.HSE_GENERATORS;
    if (!generators || typeof generators.generatorKey !== "function" || typeof generators.generate !== "function") return false;
    if (generators.__source52PopulationBarLengthInstalled) return true;
    const previousKey = generators.generatorKey.bind(generators);
    const previousGenerate = generators.generate.bind(generators);
    const belongs = type => Boolean(type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey || type.id === originalId || type.sourceItemId === originalId || type.generatorKey === originalKey));
    generators.generatorKey = type => !belongs(type) ? previousKey(type) : resolves(type) && type.reviewLocked === false && type.sourceVerified === true ? type.generatorKey : "";
    generators.generate = (type, rank, difficultyOffset, seed, variant = 0) => !belongs(type) ? previousGenerate(type, rank, difficultyOffset, seed, variant) : resolves(type) && type.reviewLocked === false && type.sourceVerified === true ? (type.id === originalId ? getOriginal(variant, difficultyOffset ?? 0) : getQuestion(variant, difficultyOffset ?? 0)) : null;
    if (Array.isArray(generators.names) && !generators.names.includes(generatorKey)) generators.names.push(generatorKey);
    if (Array.isArray(generators.names) && !generators.names.includes(originalKey)) generators.names.push(originalKey);
    Object.defineProperty(generators, "__source52PopulationBarLengthInstalled", { value: true });
    return true;
  }
  return Object.freeze({ definition, pools, difficultyDeltas, cityNames, getQuestion, getOriginal, resolves, install, roundHundredThousand, publisherKeyVerified: false });
});
