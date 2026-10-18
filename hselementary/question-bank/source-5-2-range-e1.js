(function (root, factory) {
  "use strict";
  const exported = factory();
  if (typeof module === "object" && module.exports) module.exports = exported;
  root.HSE_SOURCE_52_RANGE_E1 = exported;
  exported.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  // These are new numerical conditions, not a transcription of the source answers.
  const freeze = value => {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze);
      Object.freeze(value);
    }
    return value;
  };
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const math = value => `<span class="math-inline-expression">${esc(value)}</span>`;
  const given = (value, role) => `<span class="source52-number" data-given="${role}">${esc(value)}</span>`;
  const steps = lines => `<span class="source52-range-solution">${lines.map((line, index) => `<span class="source52-range-step">${index + 1}. ${line}</span>`).join("")}</span>`;
  const hint = text => `<span class="source52-range-hint">도움말: ${text}</span>`;
  const definitions = freeze([
    {
      sourceItemId: "5-2-u1-e1-exploration", generatorKey: "source52RangeExploration", kind: "continuous-range", resultContract: "rubric", mathematicalContract: "range",
      pools: [{ lower: 14, upper: 21 }, { lower: 37, upper: 45 }, { lower: 58, upper: 64 }],
      difficultyDesigns: ["endpoint-inclusion-hint", "source-range-to-words-and-line", "derive-lower-endpoint-first"], reasoningSteps: [2, 3, 4]
    },
    {
      sourceItemId: "5-2-u1-e1-example-1-1", generatorKey: "source52RangeMaxStart", kind: "maximum-lower-endpoint", resultContract: "single-value",
      pools: [{ count: 428, countBase: 400, countExtra: 28 }, { count: 653, countBase: 600, countExtra: 53 }, { count: 786, countBase: 700, countExtra: 86 }],
      difficultyDesigns: ["endpoint-distance-given", "source-inclusive-count-maximum", "derive-inclusive-count-first"], reasoningSteps: [2, 3, 4]
    },
    {
      sourceItemId: "5-2-u1-e1-example-1-2", generatorKey: "source52RangeSeats", kind: "minimum-seat-intersection", resultContract: "range",
      pools: [{ capacityA: 6, seatsA: 42, capacityB: 8, seatsB: 31 }, { capacityA: 5, seatsA: 48, capacityB: 7, seatsB: 34 }, { capacityA: 7, seatsA: 44, capacityB: 9, seatsB: 34 }],
      difficultyDesigns: ["first-seat-boundaries-given", "source-two-minimum-seat-conditions", "derive-first-seat-count-first"], reasoningSteps: [2, 3, 4]
    },
    {
      sourceItemId: "5-2-u1-e1-example-1-3", generatorKey: "source52RangeOverlap", kind: "two-group-overlap", resultContract: "range",
      pools: [{ total: 45, hats: 31, sunglasses: 26 }, { total: 52, hats: 37, sunglasses: 28 }, { total: 60, hats: 46, sunglasses: 34 }],
      difficultyDesigns: ["complement-count-given", "source-two-group-overlap-range", "derive-hat-count-from-complement"], reasoningSteps: [2, 3, 4]
    },
    {
      sourceItemId: "5-2-u1-e1-example-1-4", generatorKey: "source52RangeBoxes", kind: "bounded-box-allocation", resultContract: "range",
      pools: [{ total: 263, minimum: 25, upperExclusive: 35, totalBase: 260, totalExtra: 3 }, { total: 418, minimum: 29, upperExclusive: 40, totalBase: 400, totalExtra: 18 }, { total: 563, minimum: 38, upperExclusive: 50, totalBase: 500, totalExtra: 63 }],
      difficultyDesigns: ["maximum-per-box-given", "source-bounded-box-count", "derive-total-before-allocation"], reasoningSteps: [3, 4, 5]
    }
  ]);
  const byId = new Map(definitions.map(definition => [definition.sourceItemId, definition]));
  const ownedKeys = new Set(definitions.map(definition => definition.generatorKey));
  const sourceIds = freeze(definitions.map(definition => definition.sourceItemId));

  function numberLine(model, solved) {
    const first = model.lower - 1, last = model.upper + 1;
    const x = value => 30 + (value - first) * 300 / (last - first);
    const round = value => Math.round(value * 1000) / 1000;
    const ticks = Array.from({ length: last - first + 1 }, (_, index) => first + index);
    const marks = ticks.map(value => `<g class="source52-range-tick"><line x1="${round(x(value))}" y1="40" x2="${round(x(value))}" y2="52"/><text x="${round(x(value))}" y="84">${value}</text></g>`).join("");
    const answer = solved ? `<line class="source52-range-interval" data-role="answer-interval" x1="${round(x(model.lower))}" y1="46" x2="${round(x(model.upper))}" y2="46"/><circle class="source52-range-endpoint is-open" data-role="lower-endpoint" cx="${round(x(model.lower))}" cy="46" r="5.5"/><circle class="source52-range-endpoint is-closed" data-role="upper-endpoint" cx="${round(x(model.upper))}" cy="46" r="5.5"/>` : "";
    const title = solved ? `${model.lower} 초과 ${model.upper} 이하를 나타낸 수직선` : "답을 표시할 빈 수직선";
    return `<svg class="source52-range-line" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 108" role="img" aria-label="${esc(title)}" data-phase="${solved ? "answer" : "question"}" data-print-weight="compact"><title>${esc(title)}</title><path class="source52-range-axis" data-role="number-line-axis" d="M18 46 H342 M18 46 L25 42 M18 46 L25 50 M342 46 L335 42 M342 46 L335 50"/>${marks}${answer}</svg>`;
  }

  function buildExploration(pool, level) {
    const { lower, upper } = pool;
    const lowerBase = lower - 3;
    const condition = level === 2
      ? `㉠은 ${given(lowerBase, "lower-base")}보다 ${given(3, "lower-addition")} 큰 수입니다. <span class="math-inline-expression">㉠ &lt; □ ≤ ${given(upper, "upper")}</span>인 수 □에 대하여 답하세요.`
      : `<span class="math-inline-expression">${given(lower, "lower")} &lt; □ ≤ ${given(upper, "upper")}</span>인 수 □에 대하여 답하세요.`;
    const prompt = `${condition}${level === 0 ? hint("왼쪽 끝수는 포함하지 않고, 오른쪽 끝수는 포함합니다.") : ""}<span class="source52-range-parts"><span>(1) □의 범위를 ‘초과’, ‘이하’를 써서 나타내고, 같은 뜻을 다른 말로도 써 보세요.</span><span>(2) 아래 수직선에 □의 범위를 나타내세요.</span></span>${numberLine(pool, false)}`;
    const solution = steps([
      ...(level === 2 ? [`${math(`${lowerBase} + 3 = ${lower}`)}이므로 ㉠은 ${lower}입니다.`] : []),
      `□는 ${lower}보다 크므로 ${lower}는 포함하지 않습니다. ${upper}보다 작거나 같으므로 ${upper}는 포함합니다.`,
      `‘${lower} 초과 ${upper} 이하’ 또는 ‘${lower}보다 크고 ${upper}보다 작거나 같은 수’라고 나타냅니다.`,
      `수직선에서 ${lower}에는 빈 원, ${upper}에는 채운 원을 그리고 사이를 이어 줍니다. 자연수만 고르는 것이 아니므로 두 끝 사이의 소수도 포함합니다.`
    ]);
    return { prompt, answer: `${lower} 초과 ${upper} 이하 · 수직선은 풀이 그림 참조`, solution, answerVisual: numberLine(pool, true), answerKeyVisual: true,
      questionModel: { kind: "continuous-range", lower, upper, lowerIncluded: false, upperIncluded: true, naturalNumbersOnly: false, subquestionCount: 2, ...(level === 2 ? { lowerBase, lowerAddition: 3 } : {}) },
      answerModel: { contract: "rubric", lower, upper, lowerIncluded: false, upperIncluded: true, continuous: true } };
  }

  function buildMaxStart(pool, level) {
    const { count, countBase, countExtra } = pool;
    const distance = count - 1, answer = 999 - distance;
    check(answer >= 100 && answer <= 999, "작은 끝수는 세 자리 자연수여야 합니다.");
    const countText = level === 2
      ? `${given(countBase, "count-base")}개보다 ${given(countExtra, "count-extra")}개 더 많습니다`
      : `${given(count, "inclusive-count")}개입니다`;
    return { prompt: `ㄱ과 ㄴ은 세 자리 자연수이고 ㄱ은 ㄴ보다 작습니다. ㄱ 이상 ㄴ 이하인 자연수는 모두 ${countText}. ㄱ이 될 수 있는 수 중에서 가장 큰 수를 구하세요.${level === 0 ? hint(`ㄱ과 ㄴ의 차는 ${distance}입니다. 세 자리 자연수 중 가장 큰 수를 생각해 보세요.`) : ""}`,
      answer: String(answer), solution: steps([
        ...(level === 2 ? [`포함된 자연수는 ${math(`${countBase} + ${countExtra} = ${count}`)}개입니다.`] : []),
        `양 끝을 모두 세므로 자연수의 개수는 ${math("ㄴ - ㄱ + 1")}입니다. 따라서 두 끝의 차는 ${math(`${count} - 1 = ${distance}`)}입니다.`,
        `차가 같을 때 ㄴ이 클수록 ㄱ도 큽니다. 세 자리 자연수 ㄴ은 가장 크게 ${math(999)}로 정합니다.`,
        `따라서 ㄱ의 최댓값은 ${math(`999 - ${distance} = ${answer}`)}입니다. ${math(`999 - ${answer} + 1 = ${count}`)}로 개수도 맞습니다.`
      ]), questionModel: { kind: "maximum-lower-endpoint", digits: 3, count, lowerIncluded: true, upperIncluded: true, ...(level === 2 ? { countBase, countExtra } : {}) }, answerModel: { value: answer, upperEndpoint: 999, inclusiveCount: count } };
  }

  function buildSeats(pool, level) {
    const { capacityA, seatsA, capacityB, seatsB } = pool;
    const aLow = capacityA * (seatsA - 1) + 1, aHigh = capacityA * seatsA;
    const bLow = capacityB * (seatsB - 1) + 1, bHigh = capacityB * seatsB;
    const lower = Math.max(aLow, bLow), upper = Math.min(aHigh, bHigh);
    check(lower <= upper, "두 최소 의자 수의 공통 범위가 비었습니다.");
    const givenSeats = level === 2
      ? `${given(capacityB, "capacity-b")}명씩 앉히면 긴 의자는 최소 ${given(seatsB, "minimum-seats-b")}개 필요합니다. ${given(capacityA, "capacity-a")}명씩 앉히면 필요한 최소 의자 수는 그보다 ${given(seatsA - seatsB, "seat-difference")}개 더 많습니다.`
      : `${given(capacityA, "capacity-a")}명씩 앉히면 긴 의자는 최소 ${given(seatsA, "minimum-seats-a")}개, ${given(capacityB, "capacity-b")}명씩 앉히면 최소 ${given(seatsB, "minimum-seats-b")}개 필요합니다.`;
    return { prompt: `학생 전원을 긴 의자에 앉히려고 합니다. 한 의자에 앉을 수 있는 인원은 정해져 있습니다. ${givenSeats} 학생 수의 범위를 ‘이상’과 ‘미만’을 써서 나타내세요.${level === 0 ? hint(`${capacityA}명씩 앉힐 때 학생 수는 ${aLow}명 이상 ${aHigh + 1}명 미만입니다.`) : ""}`,
      answer: `${lower}명 이상 ${upper + 1}명 미만`, solution: steps([
        ...(level === 2 ? [`${capacityA}명씩 앉힐 때 필요한 최소 의자 수는 ${math(`${seatsB} + ${seatsA - seatsB} = ${seatsA}`)}개입니다.`] : []),
        `${capacityA}명씩 앉힐 때 ${seatsA - 1}개로는 모자라고 ${seatsA}개면 충분합니다. ${math(`${capacityA} × ${seatsA - 1} = ${aLow - 1}`)}, ${math(`${capacityA} × ${seatsA} = ${aHigh}`)}이므로 ${aLow}명부터 ${aHigh}명까지입니다.`,
        `${capacityB}명씩 앉힐 때도 ${math(`${capacityB} × ${seatsB - 1} = ${bLow - 1}`)}, ${math(`${capacityB} × ${seatsB} = ${bHigh}`)}이므로 ${bLow}명부터 ${bHigh}명까지입니다.`,
        `두 조건에 모두 맞는 학생 수는 ${lower}명부터 ${upper}명까지입니다. 따라서 ${lower}명 이상 ${upper + 1}명 미만입니다.`
      ]), questionModel: { kind: "minimum-seat-intersection", ...pool, integerDomain: true, ...(level === 2 ? { seatDifference: seatsA - seatsB } : {}) },
      answerModel: { lower, upper, displayLower: lower, displayUpper: upper + 1, lowerIncluded: true, upperIncluded: false } };
  }

  function buildOverlap(pool, level) {
    const { total, hats, sunglasses } = pool;
    const noHat = total - hats, lower = Math.max(0, sunglasses - noHat), upper = Math.min(hats, sunglasses);
    const hatText = level === 2
      ? `모자를 쓰지 않은 사람은 ${given(noHat, "no-hat-count")}명`
      : `모자를 쓴 사람은 ${given(hats, "hat-count")}명`;
    return { prompt: `등산을 간 ${given(total, "total-people")}명 중 ${hatText}이고, 선글라스를 낀 사람은 ${given(sunglasses, "sunglasses-count")}명입니다. 모자를 쓰고 선글라스도 낀 사람 수의 범위를 ‘초과’와 ‘이하’를 써서 나타내세요.${level === 0 ? hint(`모자를 쓰지 않은 사람은 ${noHat}명입니다. 이 사람들부터 선글라스를 낀다고 생각해 보세요.`) : ""}`,
      answer: `${lower - 1}명 초과 ${upper}명 이하`, solution: steps([
        ...(level === 2 ? [`모자를 쓴 사람은 ${math(`${total} - ${noHat} = ${hats}`)}명입니다.`] : []),
        `모자를 쓰지 않은 사람은 ${math(`${total} - ${hats} = ${noHat}`)}명입니다. 이 사람들이 모두 선글라스를 끼어도 ${math(`${sunglasses} - ${noHat} = ${lower}`)}명은 모자를 쓴 사람과 겹칩니다.`,
        `선글라스를 낀 ${sunglasses}명 모두가 모자를 쓴 사람에 포함될 수도 있습니다. 따라서 겹치는 사람은 가장 많아야 ${upper}명입니다.`,
        `두 물건을 모두 착용한 사람은 ${lower}명부터 ${upper}명까지 가능합니다. 사람 수는 정수이므로 ${lower - 1}명 초과 ${upper}명 이하라고 나타냅니다.`
      ]), questionModel: { kind: "two-group-overlap", ...pool, integerDomain: true, ...(level === 2 ? { noHat } : {}) },
      answerModel: { lower, upper, displayLower: lower - 1, displayUpper: upper, lowerIncluded: false, upperIncluded: true } };
  }

  function balancedAllocation(total, count) {
    const small = Math.floor(total / count), largeCount = total % count;
    return { count, small, smallCount: count - largeCount, large: small + 1, largeCount };
  }
  function allocationText(allocation) {
    const { small, smallCount, large, largeCount } = allocation;
    return largeCount ? `${small}개씩 ${smallCount}상자와 ${large}개씩 ${largeCount}상자` : `${small}개씩 ${smallCount}상자`;
  }
  function buildBoxes(pool, level) {
    const { total, minimum, upperExclusive, totalBase, totalExtra } = pool;
    const maximum = upperExclusive - 1, lower = Math.ceil(total / maximum), upper = Math.floor(total / minimum);
    check(lower <= upper, "가능한 상자 수 범위가 비었습니다.");
    const witnesses = Array.from({ length: upper - lower + 1 }, (_, index) => balancedAllocation(total, lower + index));
    check(witnesses.every(item => item.small >= minimum && (item.largeCount ? item.large : item.small) <= maximum), "상자별 배분이 개수 조건을 벗어났습니다.");
    const totalText = level === 2
      ? `귤 ${given(totalBase, "total-base")}개에 ${given(totalExtra, "total-extra")}개를 더했습니다.`
      : `귤 ${given(total, "total-items")}개가 있습니다.`;
    return { prompt: `${totalText} 이 귤을 한 상자에 ${given(minimum, "minimum-per-box")}개 이상 ${given(upperExclusive, "upper-exclusive-per-box")}개 미만씩 남김없이 나누어 담으려고 합니다. 사용할 수 있는 상자 수의 범위를 ‘초과’와 ‘미만’을 써서 나타내세요.${level === 0 ? hint(`한 상자에 가장 많이 담을 수 있는 귤은 ${maximum}개입니다.`) : ""}`,
      answer: `${lower - 1}상자 초과 ${upper + 1}상자 미만`, solution: steps([
        ...(level === 2 ? [`귤은 모두 ${math(`${totalBase} + ${totalExtra} = ${total}`)}개입니다.`] : []),
        `${upperExclusive}개 미만이므로 한 상자에는 가장 많아야 ${maximum}개를 담습니다. ${lower - 1}상자에는 최대 ${math(`${maximum} × ${lower - 1} = ${maximum * (lower - 1)}`)}개밖에 담지 못하므로 적어도 ${lower}상자가 필요합니다.`,
        `한 상자에는 적어도 ${minimum}개를 담아야 합니다. ${upper + 1}상자를 쓰려면 적어도 ${math(`${minimum} × ${upper + 1} = ${minimum * (upper + 1)}`)}개가 필요하므로 ${upper}상자까지만 가능합니다.`,
        `${lower}상자는 ${allocationText(witnesses[0])}, ${upper}상자는 ${allocationText(witnesses[witnesses.length - 1])}로 나누면 됩니다. 그 사이의 상자 수도 고르게 나누어 조건에 맞출 수 있습니다.`,
        `따라서 ${lower}상자부터 ${upper}상자까지 가능하므로 ${lower - 1}상자 초과 ${upper + 1}상자 미만입니다.`
      ]), questionModel: { kind: "bounded-box-allocation", ...pool, integerDomain: true },
      answerModel: { lower, upper, displayLower: lower - 1, displayUpper: upper + 1, lowerIncluded: false, upperIncluded: false, witnesses } };
  }

  const builders = { "continuous-range": buildExploration, "maximum-lower-endpoint": buildMaxStart, "minimum-seat-intersection": buildSeats, "two-group-overlap": buildOverlap, "bounded-box-allocation": buildBoxes };

  function getQuestion(sourceItemId, variant = 0, difficultyOffset = 0) {
    const definition = byId.get(sourceItemId);
    check(Boolean(definition), "등록되지 않은 5-2 원문 항목입니다.");
    check(Number.isSafeInteger(variant) && variant >= 0, "고정 변형 번호는 영 이상의 안전한 정수여야 합니다.");
    check([-1, 0, 1].includes(difficultyOffset), "난이도는 -1, 0, 1이어야 합니다.");
    const poolIndex = variant % 3, level = difficultyOffset + 1;
    const item = builders[definition.kind](definition.pools[poolIndex], level);
    const question = `<div class="source52-range-question" data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${difficultyOffset}" data-level="${level}">${item.prompt}</div>`;
    return freeze({ ...item, prompt: question, sourceItemId, generator: definition.generatorKey,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex, verifiedVariantCount: 3, verifiedVariantTarget: 3,
      verifiedVariantId: `${sourceItemId}:v${poolIndex}`, variantProvenance: "source-structure-variant",
      resultContract: definition.resultContract, mathematicalContract: definition.mathematicalContract || definition.resultContract,
      answerVisualRequired: definition.kind === "continuous-range", answerVisualStatus: definition.kind === "continuous-range" ? "verified" : "not-required",
      difficultyDesign: definition.difficultyDesigns[level], difficultyOffset, difficultyLevel: level, difficultyRank: level,
      sourceDifficultyRank: 1, reasoningSteps: definition.reasoningSteps[level], sourceStepCount: definition.reasoningSteps[1], difficultyStepDelta: definition.reasoningSteps[level] - definition.reasoningSteps[1],
      sourceStructurePreserved: true, sourceEvidenceRef: "source-memory:hs-elementary.unit.5-2-1.e1-self-solved-20261018",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-enumeration-user-authorized" });
  }

  function resolve(type) {
    if (!type || typeof type !== "object") return null;
    const definition = byId.get(type.sourceItemId);
    return definition && type.id === definition.sourceItemId && type.generatorKey === definition.generatorKey ? definition : null;
  }
  function belongsToModule(type) {
    return Boolean(type && (byId.has(type.id) || byId.has(type.sourceItemId) || ownedKeys.has(type.generatorKey)));
  }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52RangeE1Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    api.generatorKey = type => {
      if (!belongsToModule(type)) return previousKey(type);
      const definition = resolve(type);
      return definition && type.reviewLocked === false && type.sourceVerified === true ? definition.generatorKey : "";
    };
    api.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => {
      if (!belongsToModule(type)) return previousGenerate(type, levelRank, difficultyOffset, seed, variant);
      const definition = resolve(type);
      if (!definition || type.reviewLocked !== false || type.sourceVerified !== true) return null;
      return getQuestion(definition.sourceItemId, variant, difficultyOffset ?? 0);
    };
    if (Array.isArray(api.names)) for (const definition of definitions) if (!api.names.includes(definition.generatorKey)) api.names.push(definition.generatorKey);
    Object.defineProperty(api, "__source52RangeE1Installed", { value: true });
    return true;
  }

  return freeze({ definitions, sourceItemIds: sourceIds, getQuestion, numberLine, install, registrationOnly: true,
    publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
    answerVerification: "independent-enumeration-user-authorized" });
});
