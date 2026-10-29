(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_PERIMETER_MISSION2 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u1-e3-mission-2-perimeter";
  const generatorKey = "source52ApplicationMissionTwoPerimeter";
  // Synthetic dimensions preserve the source's overall-height/overall-width perimeter structure.
  const pools = [{ height: 22, width: 40 }, { height: 26, width: 54 }, { height: 30, width: 60 }];
  const offsets = [-2, 0, 2];
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const cmMm = mm => `${Math.floor(mm / 10)}cm${mm % 10 ? ` ${mm % 10}mm` : ""}`;

  function diagram(height, width) {
    return `<svg class="geometry-diagram source52-l-perimeter" data-source52-l-perimeter="true" data-total-height-mm="${height}" data-total-width-mm="${width}" role="img" aria-label="ㄱ자 모양 도형. 전체 세로 ${esc(cmMm(height))}, 전체 가로 ${width}밀리미터" viewBox="0 0 520 290" xmlns="http://www.w3.org/2000/svg"><path d="M105 225V65H205V135H445V225Z" fill="#f8fafc" stroke="#162b46" stroke-width="4" stroke-linejoin="round"/><path d="M78 65V225M78 65h18M78 225h18M105 252h340M105 244v16M445 244v16" fill="none" stroke="#51657f" stroke-width="2" stroke-dasharray="6 5"/><text x="30" y="153" font-size="20" text-anchor="middle" transform="rotate(-90 30 153)">${esc(cmMm(height))}</text><text x="275" y="282" font-size="20" text-anchor="middle">${width}mm</text></svg>`;
  }

  function build(variant, difficultyOffset) {
    const delta = offsets[difficultyOffset + 1];
    const height = pools[variant].height + delta;
    const width = pools[variant].width + 2 * delta;
    const perimeterMm = 2 * (height + width);
    const answerCm = Math.round(perimeterMm / 10);
    const support = difficultyOffset === -1 ? `<p class="source52-perimeter-hint">도움말: 안쪽 선분과 바깥쪽 선분의 길이를 각각 더해 전체 가로·세로와 비교해 보세요.</p>` : "";
    const extra = difficultyOffset === 1 ? `<p>둘레를 mm로 먼저 구한 다음, 자연수 cm로 어림한 방법을 설명하세요.</p>` : "";
    const prompt = `<div class="source52-perimeter-question"><p>아래 그림과 같은 도형의 둘레는 약 몇 cm인지 자연수로 나타내어라.</p>${diagram(height, width)}${extra}${support}</div>`;
    const solution = `<div class="source52-perimeter-solution"><ol><li>ㄱ자 도형의 위쪽과 안쪽 가로 선분을 더하면 아래쪽의 전체 가로 ${width}mm와 같습니다. 오른쪽과 안쪽 세로 선분을 더하면 왼쪽의 전체 세로 ${height}mm와 같습니다.</li><li>둘레는 (${width}+${height})×2 = ${perimeterMm}mm입니다.</li><li>${perimeterMm}mm = ${perimeterMm / 10}cm이므로 가장 가까운 자연수 cm로 나타내면 ${answerCm}cm입니다.</li></ol></div>`;
    return {
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}">${prompt}</div>`,
      answer: `${answerCm}cm`, solution, sourceItemId, generator: generatorKey,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: variant,
      verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length,
      verifiedVariantId: `${sourceItemId}:v${variant}`, difficultyOffset,
      difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      difficultyDesign: ["guided-perimeter", "source-perimeter", "explain-rounding"][difficultyOffset + 1],
      reasoningSteps: 2 + difficultyOffset + 1, sourceStructurePreserved: true,
      answerVisualRequired: false, answerVisualStatus: "not-required", publisherKeyVerified: false,
      publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-calculation-user-authorized",
      questionModel: { totalHeightMm: height, totalWidthMm: width },
      answerModel: { perimeterMm, exactCm: perimeterMm / 10, roundedCm: answerCm }
    };
  }

  function getQuestion(variant = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant >= pools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    return Object.freeze(build(variant, difficultyOffset));
  }
  const definition = Object.freeze({ sourceItemId, generatorKey, poolCount: pools.length });
  function resolves(type) { return Boolean(type && type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey); }
  function install(target) {
    const generators = target?.HSE_GENERATORS;
    if (!generators || typeof generators.generatorKey !== "function" || typeof generators.generate !== "function") return false;
    if (generators.__source52ApplicationMissionTwoInstalled) return true;
    const previousKey = generators.generatorKey.bind(generators);
    const previousGenerate = generators.generate.bind(generators);
    const belongs = type => Boolean(type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey));
    generators.generatorKey = type => !belongs(type) ? previousKey(type) : resolves(type) && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "";
    generators.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => !belongs(type) ? previousGenerate(type, levelRank, difficultyOffset, seed, variant) : resolves(type) && type.reviewLocked === false && type.sourceVerified === true ? getQuestion(variant, difficultyOffset ?? 0) : null;
    if (Array.isArray(generators.names) && !generators.names.includes(generatorKey)) generators.names.push(generatorKey);
    Object.defineProperty(generators, "__source52ApplicationMissionTwoInstalled", { value: true });
    return true;
  }
  return Object.freeze({ definition, pools, offsets, getQuestion, resolves, install, publisherKeyVerified: false });
});
