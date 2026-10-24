(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_ROUNDING_EXAMPLES_E3 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceEvidenceRef = "source-memory:hs-elementary.unit.5-2-1.e3-examples-source-20261024";
  const definitions = Object.freeze([
    Object.freeze({ sourceItemId: "5-2-u1-e3-example-1", generatorKey: "source52ApplicationRoundingExample31", kind: "all-rounding-methods" }),
    Object.freeze({ sourceItemId: "5-2-u1-e3-example-2", generatorKey: "source52ApplicationRoundingExample32", kind: "ribbon-bundle-cost" })
  ]);
  const roundingValues = Object.freeze([48078, 62082, 35096]);
  const ribbonPools = Object.freeze([
    Object.freeze({ redCm: 837, redUnitCm: 25, redPrice: 420, yellowCm: 482, yellowUnitCm: 45, yellowPrice: 360 }),
    Object.freeze({ redCm: 768, redUnitCm: 30, redPrice: 530, yellowCm: 593, yellowUnitCm: 35, yellowPrice: 610 }),
    Object.freeze({ redCm: 1023, redUnitCm: 45, redPrice: 390, yellowCm: 717, yellowUnitCm: 30, yellowPrice: 720 })
  ]);
  const places = Object.freeze([{ name: "십의 자리", unit: 10 }, { name: "백의 자리", unit: 100 }, { name: "천의 자리", unit: 1000 }, { name: "만의 자리", unit: 10000 }]);
  const operations = Object.freeze([
    { name: "올림", calculate: (value, unit) => Math.ceil(value / unit) * unit },
    { name: "버림", calculate: (value, unit) => Math.floor(value / unit) * unit },
    { name: "반올림", calculate: (value, unit) => Math.floor(value / unit + 0.5) * unit }
  ]);
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const fmt = value => Number(value).toLocaleString("en-US");
  const fmtMeters = centimeters => `${Math.floor(centimeters / 100)}.${String(centimeters % 100).padStart(2, "0")}`;
  const ceilDiv = (value, unit) => Math.ceil(value / unit);
  const roundMethods = (value, target) => places.flatMap(place => operations.map(operation => ({
    place: place.name, operation: operation.name, unit: place.unit, value: operation.calculate(value, place.unit), target
  })));

  function buildRoundingExample(variant, difficultyOffset) {
    const value = roundingValues[variant] + difficultyOffset;
    const target = Math.floor(value / 1000) * 1000;
    const methods = roundMethods(value, target);
    const matches = methods.filter(method => method.value === target);
    const expected = ["백의 자리 버림", "천의 자리 버림", "천의 자리 반올림"];
    if (matches.map(method => `${method.place} ${method.operation}`).join("|") !== expected.join("|")) throw new Error("합성 어림 풀이가 고정된 문항 구조와 다릅니다.");
    const rowHtml = places.map(place => {
      const results = operations.map(operation => `${operation.name} ${fmt(operation.calculate(value, place.unit))}`).join(" · ");
      return `<li>${place.name}: ${results}</li>`;
    }).join("");
    const answer = expected.join(" · ");
    const prompt = `<p>${fmt(value)}를 어림하여 ${fmt(target)}이 되었습니다. 어떤 자리까지 어떤 방법으로 어림했는지 모두 쓰세요.</p>${difficultyOffset === -1 ? `<p class="source52-rounding-hint">도움말: 십·백·천·만의 자리에서 올림·버림·반올림을 하나씩 확인하세요.</p>` : ""}${difficultyOffset === 1 ? "<p>빠뜨린 방법이 없도록 각 자리의 결과를 비교하세요.</p>" : ""}`;
    const solution = `<p>각 자리에서 올림·버림·반올림한 결과를 목표값 ${fmt(target)}과 비교합니다.</p><ol>${rowHtml}</ol><p>같은 결과가 되는 방법은 ${esc(answer)}입니다.</p>`;
    return {
      prompt, answer, solution,
      questionModel: { kind: "all-rounding-methods", value, target, places: places.map(place => place.unit), operations: operations.map(operation => operation.name) },
      answerModel: { value, target, methods: matches.map(({ place, operation, unit }) => ({ place, operation, unit })) }
    };
  }

  function buildRibbonExample(variant, difficultyOffset) {
    const source = ribbonPools[variant];
    const redCm = source.redCm + difficultyOffset * 2;
    const yellowCm = source.yellowCm + difficultyOffset * 3;
    const redBundles = ceilDiv(redCm, source.redUnitCm);
    const yellowBundles = ceilDiv(yellowCm, source.yellowUnitCm);
    const redCost = redBundles * source.redPrice;
    const yellowCost = yellowBundles * source.yellowPrice;
    const total = redCost + yellowCost;
    const prompt = `<p>상자 하나를 포장하는 데 빨간색 리본 ${fmtMeters(redCm)}m와 노란색 리본 ${fmtMeters(yellowCm)}m가 필요합니다. 빨간색은 ${source.redUnitCm}cm 단위로, 노란색은 ${source.yellowUnitCm}cm 단위로만 팝니다. 한 묶음 값이 각각 ${fmt(source.redPrice)}원, ${fmt(source.yellowPrice)}원일 때 필요한 리본 값은 모두 얼마인가요?</p>${difficultyOffset === -1 ? "<p class=\"source52-rounding-hint\">도움말: 먼저 두 길이를 cm로 바꾼 다음, 모자라지 않게 살 묶음 수를 구하세요.</p>" : ""}${difficultyOffset === 1 ? "<p>남는 길이가 생기는지 확인하여 묶음 수를 정하세요.</p>" : ""}`;
    const solution = `<ol><li>빨간 리본은 ${fmtMeters(redCm)}m=${fmt(redCm)}cm입니다. ${fmt(redCm)}÷${source.redUnitCm}=${(redCm / source.redUnitCm).toFixed(2)}이므로 ${redBundles}묶음이 필요하고, ${redBundles}×${fmt(source.redPrice)}=${fmt(redCost)}원입니다.</li><li>노란 리본은 ${fmtMeters(yellowCm)}m=${fmt(yellowCm)}cm입니다. ${fmt(yellowCm)}÷${source.yellowUnitCm}=${(yellowCm / source.yellowUnitCm).toFixed(2)}이므로 ${yellowBundles}묶음이 필요하고, ${yellowBundles}×${fmt(source.yellowPrice)}=${fmt(yellowCost)}원입니다.</li><li>모두 ${fmt(redCost)}+${fmt(yellowCost)}=${fmt(total)}원입니다.</li></ol>`;
    return {
      prompt, answer: `${fmt(total)}원`, solution,
      questionModel: { kind: "ribbon-bundle-cost", redCm, redUnitCm: source.redUnitCm, redPrice: source.redPrice, yellowCm, yellowUnitCm: source.yellowUnitCm, yellowPrice: source.yellowPrice },
      answerModel: { redBundles, yellowBundles, redCost, yellowCost, total }
    };
  }

  function getQuestion(sourceItemId, variant = 0, difficultyOffset = 0) {
    const definition = definitions.find(item => item.sourceItemId === sourceItemId);
    if (!definition || !Number.isSafeInteger(variant) || variant < 0 || variant > 2 || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const built = definition.kind === "all-rounding-methods" ? buildRoundingExample(variant, difficultyOffset) : buildRibbonExample(variant, difficultyOffset);
    return Object.freeze({
      ...built,
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}">${built.prompt}</div>`,
      solution: `<div data-source-answer="${sourceItemId}">${built.solution}</div>`,
      sourceItemId, generator: definition.generatorKey,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: variant, verifiedVariantCount: 3, verifiedVariantTarget: 3,
      verifiedVariantId: `${sourceItemId}:v${variant}`, difficultyOffset, difficultyLevel: difficultyOffset + 1,
      difficultyRank: difficultyOffset + 1, sourceStructurePreserved: true, answerVisualRequired: false, answerVisualStatus: "not-required",
      sourceEvidenceRef, publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-calculation-user-authorized"
    });
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52RoundingExamplesE3Installed) return true;
    const previousKey = api.generatorKey.bind(api);
    const previousGenerate = api.generate.bind(api);
    const byId = new Map(definitions.map(definition => [definition.sourceItemId, definition]));
    const ownedKeys = new Set(definitions.map(definition => definition.generatorKey));
    const belongs = type => Boolean(type && (byId.has(type.id) || byId.has(type.sourceItemId) || ownedKeys.has(type.generatorKey)));
    const resolve = type => {
      if (!type || typeof type !== "object") return null;
      const definition = byId.get(type.sourceItemId);
      return definition && type.id === definition.sourceItemId && type.generatorKey === definition.generatorKey ? definition : null;
    };
    api.generatorKey = type => {
      if (!belongs(type)) return previousKey(type);
      const definition = resolve(type);
      return definition && type.reviewLocked === false && type.sourceVerified === true ? definition.generatorKey : "";
    };
    api.generate = (type, rank, difficulty, seed, variant = 0) => {
      if (!belongs(type)) return previousGenerate(type, rank, difficulty, seed, variant);
      const definition = resolve(type);
      return definition && type.reviewLocked === false && type.sourceVerified === true
        ? getQuestion(definition.sourceItemId, variant, difficulty ?? 0) : null;
    };
    if (Array.isArray(api.names)) for (const definition of definitions) if (!api.names.includes(definition.generatorKey)) api.names.push(definition.generatorKey);
    Object.defineProperty(api, "__source52RoundingExamplesE3Installed", { value: true });
    return true;
  }

  return Object.freeze({ definitions, roundingValues, ribbonPools, places, operations, getQuestion, install, sourceEvidenceRef, publisherKeyVerified: false });
});
