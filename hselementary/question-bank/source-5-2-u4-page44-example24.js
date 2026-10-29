(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_U4_PAGE44_EXAMPLE24 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u4-e2-example-4";
  const generatorKey = "source52SquareAreaIncreasePage44Example24";
  const pools = Object.freeze([
    Object.freeze({ sideTenths: 54, widthIncreaseTenths: 26, heightIncreaseTenths: 12 }),
    Object.freeze({ sideTenths: 68, widthIncreaseTenths: 18, heightIncreaseTenths: 24 }),
    Object.freeze({ sideTenths: 43, widthIncreaseTenths: 34, heightIncreaseTenths: 16 })
  ]);
  const decimal = (tenths) => {
    const whole = Math.floor(tenths / 10);
    const fraction = tenths % 10;
    return fraction ? `${whole}.${fraction}` : String(whole);
  };
  const areaDecimal = (hundredths) => {
    const whole = Math.floor(hundredths / 100);
    const fraction = String(hundredths % 100).padStart(2, "0").replace(/0+$/, "");
    return fraction ? `${whole}.${fraction}` : String(whole);
  };
  const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);

  function calculate(sideTenths, widthIncreaseTenths, heightIncreaseTenths) {
    for (const value of [sideTenths, widthIncreaseTenths, heightIncreaseTenths]) {
      if (!Number.isSafeInteger(value) || value <= 0) throw new TypeError("양의 길이를 0.1m 단위로 확인해 주세요.");
    }
    const areaIncreaseHundredths = sideTenths * (widthIncreaseTenths + heightIncreaseTenths)
      + widthIncreaseTenths * heightIncreaseTenths;
    if (!Number.isSafeInteger(areaIncreaseHundredths) || areaIncreaseHundredths <= 0) throw new RangeError("넓이 증가량을 정확히 계산할 수 없습니다.");
    const side = decimal(sideTenths);
    const widthIncrease = decimal(widthIncreaseTenths);
    const heightIncrease = decimal(heightIncreaseTenths);
    const areaIncrease = areaDecimal(areaIncreaseHundredths);
    const cornerArea = areaDecimal(widthIncreaseTenths * heightIncreaseTenths);
    const sideSum = decimal(widthIncreaseTenths + heightIncreaseTenths);
    const numerator = areaDecimal(areaIncreaseHundredths - widthIncreaseTenths * heightIncreaseTenths);
    return Object.freeze({ sideTenths, widthIncreaseTenths, heightIncreaseTenths, areaIncreaseHundredths,
      side, widthIncrease, heightIncrease, areaIncrease, cornerArea, sideSum, numerator,
      answer: `${side}m` });
  }

  function diagram(result, suffix = "problem") {
    const label = `정사각형을 직사각형으로 늘린 넓이 모형. 처음 정사각형의 한 변은 x이고, 오른쪽으로 ${result.widthIncrease}미터, 아래로 ${result.heightIncrease}미터 늘렸습니다. 색이 다른 부분이 늘어난 넓이입니다. 실제 길이의 비율과는 다릅니다.`;
    return `<figure class="source52-u4-p44-e24-figure"><svg viewBox="0 0 300 204" role="img" aria-label="${escapeHtml(label)}" data-figure-role="${escapeHtml(suffix)}">
      <rect x="58" y="30" width="158" height="118" class="e24-added" fill="#f5f0e5"/><rect x="58" y="30" width="94" height="94" class="e24-original" fill="#fff"/>
      <path d="M152 30V124M58 124H216" class="e24-line" fill="none"/>
      <text x="104" y="78" text-anchor="middle" class="e24-main-label">처음 x²</text><text x="184" y="76" text-anchor="middle" class="e24-area-label">x×${result.widthIncrease}</text>
      <text x="105" y="142" text-anchor="middle" class="e24-area-label">x×${result.heightIncrease}</text><text x="184" y="137" text-anchor="middle" class="e24-area-label">${result.widthIncrease}×${result.heightIncrease}</text>
      <path d="M58 17H216M58 13V21M216 13V21" class="e24-dim" fill="none"/><text x="137" y="12" text-anchor="middle" class="e24-dim-label">x+${result.widthIncrease}</text>
      <path d="M43 30V148M39 30H47M39 148H47" class="e24-dim" fill="none"/><text x="27" y="93" text-anchor="middle" transform="rotate(-90 27 93)" class="e24-dim-label">x+${result.heightIncrease}</text>
      <text x="105" y="182" text-anchor="middle" class="e24-caption">늘어난 부분의 넓이 = ${result.areaIncrease}m²</text>
    </svg><figcaption>늘어난 넓이는 오른쪽 띠 + 아래 띠 + 모서리 부분입니다. (비율은 실제와 다름)</figcaption></figure>`;
  }

  function getQuestion(poolIndex = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(poolIndex) || poolIndex < 0 || poolIndex >= pools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const pool = pools[poolIndex];
    const result = calculate(pool.sideTenths + difficultyOffset, pool.widthIncreaseTenths, pool.heightIncreaseTenths);
    const prompt = `정사각형의 가로를 ${result.widthIncrease}m, 세로를 ${result.heightIncrease}m 늘려 직사각형으로 만들었더니 넓이가 ${result.areaIncrease}m² 늘었습니다. 처음 정사각형의 한 변의 길이를 구하세요.`;
    const solution = `<div class="source52-u4-p44-e24-solution" data-source-answer="${sourceItemId}" data-pool-index="${poolIndex}"><ol>
        <li>처음 정사각형 한 변을 x m라고 둡니다. 새 직사각형의 변은 각각 x+${result.widthIncrease}m, x+${result.heightIncrease}m입니다.</li>
        <li>넓이 증가량은 새 직사각형에서 처음 정사각형의 넓이를 뺀 값입니다: (x+${result.widthIncrease})(x+${result.heightIncrease})−x²=${result.areaIncrease}.</li>
        <li>곱셈을 전개하면 x²+${result.sideSum}x+${result.cornerArea}−x²=${result.areaIncrease}이므로 ${result.sideSum}x=${result.numerator}입니다.</li>
        <li>x=${result.numerator}÷${result.sideSum}=${result.side}이므로 처음 정사각형의 한 변은 <strong>${result.answer}</strong>입니다.</li>
      </ol></div>`;
    return Object.freeze({
      prompt: `<div class="source52-u4-p44-e24-question" data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}"><p>${escapeHtml(prompt)}</p></div>`,
      answer: result.answer,
      solution,
      sourceItemId,
      generator: generatorKey,
      generationMode: "fixed-verified-pool",
      verifiedPoolIndex: poolIndex,
      verifiedVariantCount: pools.length,
      verifiedVariantTarget: pools.length,
      verifiedVariantId: `${sourceItemId}:v${poolIndex}`,
      variantProvenance: "synthetic-source-structure",
      difficultyOffset,
      difficultyLevel: difficultyOffset + 1,
      difficultyRank: difficultyOffset + 1,
      sourceDifficultyRank: 1,
      difficultyDesign: ["area-strips-guided-model", "expand-and-cancel-square-areas", "derive-linear-difference-independently"][difficultyOffset + 1],
      reasoningSteps: 4,
      sourceStepCount: 1,
      difficultyStepDelta: difficultyOffset,
      solutionPageWeight: 2,
      sourceStructurePreserved: true,
      sourcePdfPage: 40,
      sourcePrintedPage: 44,
      questionModel: result,
      answerModel: result,
      answerVisualRequired: true,
      answerVisualStatus: "verified-reconstruction",
      answerVisual: diagram(result, "answer"),
      publisherKeyVerified: false,
      publisherAnswerVerified: false,
      handwrittenAnswerVerified: false,
      answerVerification: "exact-integer-tenths-area-difference"
    });
  }
  function belongs(type) { return Boolean(type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey)); }
  function resolves(type) { return Boolean(type && type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.sourceVerified === true && type.reviewLocked === false); }
  function generate(type, user, difficultyOffset, seed, variant = 0) {
    if (!belongs(type) || !resolves(type)) return null;
    if (!Number.isSafeInteger(variant) || variant < 0) throw new RangeError("고정 변형 번호는 0 이상의 정수여야 합니다.");
    return getQuestion(variant % pools.length, [-1, 0, 1].includes(difficultyOffset) ? difficultyOffset : 0);
  }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52U4Page44Example24Installed) return true;
    const oldKey = api.generatorKey.bind(api), oldGenerate = api.generate.bind(api);
    api.generatorKey = type => belongs(type) ? (resolves(type) ? generatorKey : "") : oldKey(type);
    api.generate = (type, user, difficulty, seed, variant = 0) => belongs(type) ? generate(type, user, difficulty, seed, variant) : oldGenerate(type, user, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52U4Page44Example24Installed", { value: true });
    return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, pools, calculate, getQuestion, generate, belongs, resolves, install, diagram });
});
