(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_PACKING_MISSION1 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u1-e3-mission-1-box-count";
  const generatorKey = "source52ApplicationMissionOneBooks";
  // Synthetic values preserve the source's quarter/half relationships and 50-book box capacity.
  const storybookPools = [420, 512, 648];
  const difficultyDeltas = [-8, 0, 12];
  const kinds = ["guided-box-count", "source-box-count", "justify-box-count"];
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const fmt = value => Number(value).toLocaleString("en-US");

  function build(variant, difficultyOffset) {
    const level = difficultyOffset + 1;
    const storybooks = storybookPools[variant] + difficultyDeltas[level];
    const scienceBooks = storybooks / 4;
    const biographyBooks = storybooks / 2;
    const totalBooks = storybooks + scienceBooks + biographyBooks;
    const capacity = 50;
    const fullBoxes = Math.floor(totalBooks / capacity);
    const remainder = totalBooks % capacity;
    const answer = Math.ceil(totalBooks / capacity);
    const support = level === 0
      ? `<p class="source52-packing-hint">도움말: 동화책 수를 4로 나누어 과학책 수를, 2로 나누어 위인전 수를 구해 보세요.</p>`
      : "";
    const extra = level === 2
      ? `<p>필요한 상자 수를 구하고, 책이 남는 경우 왜 상자가 하나 더 필요한지도 설명하세요.</p>`
      : "";
    const prompt = `<div class="source52-packing-question" data-source-kind="fractional-book-packing"><p>동화책은 ${fmt(storybooks)}권입니다. 과학책은 동화책의 1/4만큼, 위인전은 동화책의 1/2만큼 가지고 있습니다.</p><p>이 책들을 한 상자에 50권씩 나누어 담으려고 할 때, 적어도 몇 개의 상자가 필요한가요?</p>${extra}${support}</div>`;
    const solution = `<div class="source52-packing-solution"><ol><li>과학책: ${fmt(storybooks)} ÷ 4 = ${fmt(scienceBooks)}권</li><li>위인전: ${fmt(storybooks)} ÷ 2 = ${fmt(biographyBooks)}권</li><li>전체: ${fmt(storybooks)} + ${fmt(scienceBooks)} + ${fmt(biographyBooks)} = ${fmt(totalBooks)}권</li><li>${fmt(totalBooks)}권을 50권씩 담으면 ${fullBoxes}상자에 ${remainder}권${remainder ? "이 남으므로 상자 하나가 더 필요합니다" : "이 남지 않습니다"}.</li></ol><p>따라서 필요한 상자는 ${answer}개입니다.</p></div>`;
    return {
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}" data-level="${level}">${prompt}</div>`,
      answer: `${answer}개`,
      solution,
      sourceItemId,
      generator: generatorKey,
      generationMode: "fixed-verified-pool",
      verifiedPoolIndex: variant,
      verifiedVariantCount: storybookPools.length,
      verifiedVariantTarget: storybookPools.length,
      verifiedVariantId: `${sourceItemId}:v${variant}`,
      difficultyOffset,
      difficultyLevel: level,
      difficultyRank: level,
      difficultyDesign: kinds[level],
      reasoningSteps: 4 + level,
      sourceStructurePreserved: true,
      answerVisualRequired: false,
      answerVisualStatus: "not-required",
      publisherKeyVerified: false,
      publisherAnswerVerified: false,
      handwrittenAnswerVerified: false,
      answerVerification: "independent-calculation-user-authorized",
      questionModel: { storybooks, scienceBooks, biographyBooks, capacity },
      answerModel: { totalBooks, fullBoxes, remainder, boxes: answer }
    };
  }

  function getQuestion(variant = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant >= storybookPools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    return Object.freeze(build(variant, difficultyOffset));
  }

  const definition = Object.freeze({ sourceItemId, generatorKey, poolCount: storybookPools.length });
  function resolves(type) {
    return Boolean(type && type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey);
  }
  function install(target) {
    const generators = target?.HSE_GENERATORS;
    if (!generators || typeof generators.generatorKey !== "function" || typeof generators.generate !== "function") return false;
    if (generators.__source52ApplicationMissionOneInstalled) return true;
    const previousKey = generators.generatorKey.bind(generators);
    const previousGenerate = generators.generate.bind(generators);
    const belongs = type => Boolean(type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey));
    generators.generatorKey = type => {
      if (!belongs(type)) return previousKey(type);
      return resolves(type) && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "";
    };
    generators.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => {
      if (!belongs(type)) return previousGenerate(type, levelRank, difficultyOffset, seed, variant);
      return resolves(type) && type.reviewLocked === false && type.sourceVerified === true
        ? getQuestion(variant, difficultyOffset ?? 0) : null;
    };
    if (Array.isArray(generators.names) && !generators.names.includes(generatorKey)) generators.names.push(generatorKey);
    Object.defineProperty(generators, "__source52ApplicationMissionOneInstalled", { value: true });
    return true;
  }

  return Object.freeze({ definition, storybookPools, difficultyDeltas, getQuestion, resolves, install, publisherKeyVerified: false });
});
