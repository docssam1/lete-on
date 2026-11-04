(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_SUPPLY_COST_MISSION4 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u1-e3-mission-4-mat-cost";
  const generatorKey = "source52ApplicationMissionFourSupplyCost";
  const originalId = "5-2-u1-e3-mission-4-mat-cost-original";
  const originalKey = "source52ApplicationMissionFourSupplyCostOriginal";
  // 기존 묶음은 유사문항이며 원문은 별도 고정 문항으로 제공한다.
  const pools = [
    { students: 496, marts: [{ label: "가", pack: 20, price: 10000 }, { label: "나", pack: 30, price: 16500 }] },
    { students: 524, marts: [{ label: "가", pack: 16, price: 9600 }, { label: "나", pack: 25, price: 13800 }] },
    { students: 646, marts: [{ label: "가", pack: 18, price: 8500 }, { label: "나", pack: 21, price: 10500 }] }
  ];
  const studentDeltas = [-4, 0, 4];
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const fmt = value => Number(value).toLocaleString("en-US");

  function build(variant, difficultyOffset, original = false) {
    const itemId = original ? originalId : sourceItemId;
    const source = original ? {students:652,marts:[{label:"가",pack:15,price:9000},{label:"나",pack:24,price:13000}]} : pools[variant];
    const students = source.students + studentDeltas[difficultyOffset + 1];
    const marts = source.marts.map(mart => {
      const bundles = Math.ceil(students / mart.pack);
      const purchased = bundles * mart.pack;
      return { ...mart, bundles, purchased, left: purchased - students, cost: bundles * mart.price };
    });
    const cheapest = Math.min(...marts.map(mart => mart.cost));
    const winners = marts.filter(mart => mart.cost === cheapest);
    const winner = winners.length === 1 ? winners[0] : null;
    const savings = winner ? Math.max(...marts.map(mart => mart.cost)) - winner.cost : 0;
    const tableRows = marts.map(mart => `<tr><th scope="row">(${esc(mart.label)})마트</th><td>${mart.pack}권</td><td>${fmt(mart.price)}원</td></tr>`).join("");
    const hint = difficultyOffset === -1
      ? `<p class="source52-supply-cost-hint">도움말: 필요한 묶음 수를 구할 때 모자라지 않도록 올림하고, 묶음 수에 한 묶음의 가격을 곱하세요.</p>` : "";
    const extra = difficultyOffset === 1
      ? `<p>각 마트에서 나누어 준 뒤 남는 스케치북 수를 비교 과정에 적으세요.</p>` : "";
    const statement = original ? `유미네 학교의 전교생은 ${fmt(students)}명이다. 개교기념일을 맞이하여 전교생에게 스케치북을 한 권씩 선물로 나누어 주려고 한다. (가) 마트와 (나) 마트에서 각각 다음과 같이 스케치북을 판매한다고 할 때, 부족하지 않게 최소의 가격으로 사려면 어느 마트에서 사야 하고 얼마의 비용이 절약되겠는가?` : `유미네 학교 전교생 ${fmt(students)}명에게 스케치북을 한 권씩 나누어 주려고 한다. (가)마트와 (나)마트에서 각각 다음과 같이 스케치북을 판매한다. 한 마트에서만 묶음으로 사서 부족하지 않게 나누어 줄 때, 어느 마트에서 사야 하고 얼마의 비용이 절약되는가?`;
    const prompt = `<div class="source52-supply-cost-question"><p>${statement}</p><table class="source52-supply-cost-table"><caption>마트별 스케치북 묶음 판매</caption><thead><tr><th scope="col">마트</th><th scope="col">한 묶음의 수</th><th scope="col">한 묶음의 가격</th></tr></thead><tbody>${tableRows}</tbody></table>${extra}${hint}</div>`;
    const solution = `<div class="source52-supply-cost-solution"><ol><li>전교생 ${fmt(students)}명에게 한 권씩 나누어 주려면 ${fmt(students)}권이 필요합니다.</li>${marts.map(mart => `<li>(${esc(mart.label)})마트는 ${fmt(students)}÷${mart.pack}를 올림하여 ${fmt(mart.bundles)}묶음을 삽니다. ${fmt(mart.bundles)}×${fmt(mart.pack)}=${fmt(mart.purchased)}권을 사서 ${fmt(mart.left)}권이 남고, 비용은 ${fmt(mart.bundles)}×${fmt(mart.price)}=${fmt(mart.cost)}원입니다.</li>`).join("")}<li>더 싼 곳은 (${esc(winner?.label ?? "?")})마트입니다. ${fmt(Math.max(...marts.map(mart => mart.cost)))}원−${fmt(cheapest)}원=${fmt(savings)}원이므로 ${fmt(savings)}원이 절약됩니다.</li></ol></div>`;
    const answer = winner ? `(${winner.label})마트, ${fmt(savings)}원 절약` : "검수 필요";
    return {
      prompt: `<div data-source-item="${itemId}" data-source-item-id="${itemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}">${prompt}</div>`,
      answer, solution, sourceItemId: itemId, generator: original ? originalKey : generatorKey,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: variant,
      verifiedVariantCount: original ? 1 : pools.length, verifiedVariantTarget: original ? 1 : pools.length,
      verifiedVariantId: `${itemId}:v${variant}`, difficultyOffset,
      difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      difficultyDesign: ["guided-bundle-rounding", "compare-total-cost", "compare-leftovers-and-cost"][difficultyOffset + 1],
      reasoningSteps: 3 + difficultyOffset + 1, sourceStructurePreserved: true,
      answerVisualRequired: false, answerVisualStatus: "not-required", publisherKeyVerified: false,
      publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-calculation-user-authorized",
      questionModel: { students, marts: marts.map(({ label, pack, price }) => ({ label, pack, price })) },
      answerModel: { students, marts, cheapestMart: winner?.label ?? null, savings }
    };
  }

  function getQuestion(variant = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant >= pools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    return Object.freeze(build(variant, difficultyOffset));
  }
  function getOriginal(variant = 0, difficultyOffset = 0) {
    if (variant !== 0 || ![-1,0,1].includes(difficultyOffset)) return null;
    return Object.freeze(build(0,0,true));
  }
  const definition = Object.freeze({ sourceItemId, generatorKey, poolCount: pools.length });
  function resolves(type) { return Boolean(type && ((type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey) || (type.id === originalId && type.sourceItemId === originalId && type.generatorKey === originalKey))); }
  function install(target) {
    const generators = target?.HSE_GENERATORS;
    if (!generators || typeof generators.generatorKey !== "function" || typeof generators.generate !== "function") return false;
    if (generators.__source52ApplicationMissionFourInstalled) return true;
    const previousKey = generators.generatorKey.bind(generators);
    const previousGenerate = generators.generate.bind(generators);
    const belongs = type => Boolean(type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey || type.id === originalId || type.sourceItemId === originalId || type.generatorKey === originalKey));
    generators.generatorKey = type => !belongs(type) ? previousKey(type) : resolves(type) && type.reviewLocked === false && type.sourceVerified === true ? type.generatorKey : "";
    generators.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => !belongs(type) ? previousGenerate(type, levelRank, difficultyOffset, seed, variant) : resolves(type) && type.reviewLocked === false && type.sourceVerified === true ? (type.id === originalId ? getOriginal(variant, difficultyOffset ?? 0) : getQuestion(variant, difficultyOffset ?? 0)) : null;
    if (Array.isArray(generators.names) && !generators.names.includes(generatorKey)) generators.names.push(generatorKey);
    if (Array.isArray(generators.names) && !generators.names.includes(originalKey)) generators.names.push(originalKey);
    Object.defineProperty(generators, "__source52ApplicationMissionFourInstalled", { value: true });
    return true;
  }
  return Object.freeze({ definition, pools, getQuestion, getOriginal, resolves, install, publisherKeyVerified: false });
});
