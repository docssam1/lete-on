(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_ROUNDED_RANGE_E44 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u1-e4-example-4";
  const generatorKey = "source52RoundedRangeExample44";
  const originalId = "5-2-u1-e4-example-4-original";
  const originalKey = "source52RoundedRangeExample44Original";
  const years = Object.freeze([2005, 2006, 2007, 2008, 2009, 2010]);
  // The chart form follows the printed source; the plotted values are new synthetic data.
  const pools = Object.freeze([
    Object.freeze({ female: Object.freeze([55, 59, 62, 60, 65, 69]), male: Object.freeze([52, 54, 61, 69, 61, 71]) }),
    Object.freeze({ female: Object.freeze([57, 60, 64, 62, 67, 70]), male: Object.freeze([53, 56, 63, 70, 64, 73]) }),
    Object.freeze({ female: Object.freeze([54, 58, 61, 59, 64, 68]), male: Object.freeze([51, 55, 60, 69, 60, 70]) })
  ]);
  const maleDifficultyDelta = Object.freeze([-1, 0, 1]);
  const fmt = value => Number(value).toLocaleString("en-US");
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const svgY = value => 310 - (value - 50) * 9;
  const svgX = index => 138 + index * 76;

  function graphSvg(female, male, highlightYear = null, sourceBased = false) {
    const horizontalGrid = Array.from({ length: 26 }, (_, i) => {
      const value = 50 + i;
      const y = svgY(value);
      const major = value % 5 === 0;
      return `<line x1="100" y1="${y}" x2="594" y2="${y}" class="${major ? "major" : "minor"}"/>${major && value <= 70 ? `<text x="91" y="${y + 5}" text-anchor="end" class="tick">${value}</text>` : ""}`;
    }).join("");
    const verticalGrid = years.map((_, index) => `<line x1="${svgX(index)}" y1="85" x2="${svgX(index)}" y2="310" class="vgrid"/>`).join("");
    const line = values => values.map((value, index) => `${index ? "L" : "M"}${svgX(index)},${svgY(value)}`).join(" ");
    const points = (values, cls) => values.map((value, index) => `<circle class="${cls}-point" cx="${svgX(index)}" cy="${svgY(value)}" r="5"/>`).join("");
    const yearLabels = years.map((year, index) => `<text x="${svgX(index)}" y="${index % 2 ? 386 : 358}" text-anchor="middle" class="year">${year}</text>`).join("");
    const highlightIndex = years.indexOf(highlightYear);
    const highlight = highlightIndex < 0 ? "" : `<rect x="${svgX(highlightIndex) - 17}" y="82" width="34" height="230" class="highlight-band"/><circle cx="${svgX(highlightIndex)}" cy="${svgY(female[highlightIndex])}" r="9" class="highlight-point"/><circle cx="${svgX(highlightIndex)}" cy="${svgY(male[highlightIndex])}" r="9" class="highlight-point"/>`;
    return `<svg class="source52-e44-graph" viewBox="0 0 650 430" role="img" aria-label="${esc(`${sourceBased ? "교재 속" : "가상"} 마을의 남녀 인구 그래프. 백 명 단위, 여자는 실선, 남자는 점선. ${years.map((year, index) => `${year}년 여자 ${female[index]}, 남자 ${male[index]}`).join("; ")}.${highlightYear ? ` 풀이에서는 ${highlightYear}년을 강조합니다.` : ""}`)}"><title>${sourceBased ? "교재 속" : "가상"} 마을의 남녀 인구수</title><desc>세로축은 백 명 단위이며 50부터 75까지 한 칸에 백 명입니다. 여자 인구는 실선, 남자 인구는 점선입니다. 가로축은 2005년부터 2010년까지입니다.${highlightYear ? ` 정답 풀이에서 ${highlightYear}년을 강조했습니다.` : ""}</desc><text x="347" y="30" text-anchor="middle" class="chart-title">${sourceBased ? "교재 속" : "가상"} 마을의 남녀 인구수</text><text x="17" y="196" class="axis-unit">(백 명)</text><path d="M95 83V310 M95 310H600" class="axis"/>${horizontalGrid}${verticalGrid}${highlight}<text x="82" y="410" text-anchor="end" class="tick">0</text><path d="M75 322q10 -9 20 0t20 0 M75 332q10 -9 20 0t20 0" class="break"/><path d="${line(female)}" class="female-line"/>${points(female, "female")}<path d="${line(male)}" class="male-line"/>${points(male, "male")}<text x="112" y="${svgY(female[0]) - 9}" class="series-label">여자</text><text x="112" y="${svgY(male[0]) + 21}" class="series-label">남자</text>${yearLabels}<text x="606" y="360" class="axis-unit">(년)</text><text x="14" y="423" class="axis-unit">인구수·연도</text></svg>`;
  }

  function getQuestion(variant = 0, difficultyOffset = 0, original = false) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant >= (original ? 1 : pools.length) || ![-1, 0, 1].includes(difficultyOffset)) return null;
    if (original) difficultyOffset = 0;
    const itemId = original ? originalId : sourceItemId;
    const female = original ? [56,58,63,61,66,70] : [...pools[variant].female];
    const male = original ? [51,55,62,68,62,72] : pools[variant].male.map(value => value + maleDifficultyDelta[difficultyOffset + 1]);
    const gaps = male.map((value, index) => Math.abs(value - female[index]));
    const maxGap = Math.max(...gaps);
    const maxYears = years.filter((_, index) => gaps[index] === maxGap);
    if (maxYears.length !== 1) return null;
    const yearIndex = years.indexOf(maxYears[0]);
    const maleShown = male[yearIndex] * 100;
    const femaleShown = female[yearIndex] * 100;
    const minimum = maleShown - 50 - (femaleShown + 99);
    const maximum = maleShown + 49 - femaleShown;
    const lowerExclusive = Math.floor((minimum - 1) / 50) * 50;
    const upperExclusive = Math.ceil((maximum + 1) / 50) * 50;
    const answer = `${fmt(lowerExclusive)}명 초과 ${fmt(upperExclusive)}명 미만`;
    const prompt = original ? `어느 마을의 남자 인구수는 반올림하여 백의 자리까지, 여자 인구수는 버림하여 백의 자리까지 꺾은선그래프로 나타낸 것이다. 남녀 인구수의 차가 가장 큰 때의 실제 남녀 인구수의 차는 몇 명 초과 몇 명 미만인가?` : `가상 마을의 남자 인구수는 반올림하여 백의 자리까지, 여자 인구수는 버림하여 백의 자리까지 꺾은선그래프로 나타낸 것입니다. 그래프에 표시된 남녀 인구수의 차가 가장 큰 해의 실제 남녀 인구수 차는 몇 명 초과 몇 명 미만인가요?`;
    const solution = original ? `<ol><li>2008년 남자는 6,800명으로 반올림되므로 실제 인구는 6,750~6,849명이고, 여자는 6,100명으로 버림되므로 6,100~6,199명입니다. 그해 실제 차이는 551~749명입니다.</li><li>다른 해의 가능한 실제 차이의 최댓값은 2005년부터 차례로 649명, 449명, 249명, 2009년 549명, 2010년 249명입니다. 따라서 모든 해 중 가장 큰 실제 차이는 적어도 551명이고 749명을 넘지 않습니다.</li><li>다른 해의 차이를 각 범위의 작은 쪽으로 정하면, 2008년의 차이를 551명부터 749명까지 하나씩 바꿀 수 있습니다. 그때 전체에서 가장 큰 차이도 각각 가능합니다.</li><li>따라서 가장 큰 실제 차이의 범위는 <b>550명 초과 750명 미만</b>입니다. 2005년의 실제 차이가 2008년보다 커질 수도 있으므로 표시값만 보고 실제 인구 차이가 가장 큰 해를 단정하지 않습니다.</li></ol>` : `<ol><li>세로 눈금은 백 명 단위이므로 각 작은 칸은 100명입니다. 실선은 여자, 점선은 남자 인구를 나타냅니다.</li><li>연도별 그래프 값의 차는 ${gaps.map((gap, i) => `${years[i]}년 ${gap}백 명`).join(", ")}입니다. 가장 큰 차는 ${maxYears[0]}년에 나타납니다.</li><li>${maxYears[0]}년 남자 인구는 그래프에서 ${fmt(maleShown)}명으로 반올림한 값이므로 실제 인구는 ${fmt(maleShown - 50)}명 이상 ${fmt(maleShown + 50)}명 미만입니다. 여자 인구는 ${fmt(femaleShown)}명으로 버림한 값이므로 ${fmt(femaleShown)}명 이상 ${fmt(femaleShown + 100)}명 미만입니다.</li><li>실제 남녀 인구 차의 가장 작은 정수는 ${fmt(maleShown - 50)}-${fmt(femaleShown + 99)}=${fmt(minimum)}명이고, 가장 큰 정수는 ${fmt(maleShown + 49)}-${fmt(femaleShown)}=${fmt(maximum)}명입니다. 따라서 ${fmt(lowerExclusive)}명 초과 ${fmt(upperExclusive)}명 미만입니다.</li></ol>`;
    return Object.freeze({
      prompt: `<div data-source-item="${itemId}" data-source-item-id="${itemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}"><p>${prompt}</p>${graphSvg(female, male, null, original)}</div>`,
      answer, solution: `<div data-source-answer="${itemId}">${solution}</div>`, answerVisual: graphSvg(female, male, original ? null : maxYears[0], original), sourceItemId: itemId,
      generator: original ? originalKey : generatorKey, generationMode: "fixed-verified-pool", verifiedPoolIndex: variant,
      verifiedVariantCount: original ? 1 : pools.length, verifiedVariantTarget: original ? 1 : pools.length,
      verifiedVariantId: `${itemId}:v${variant}`, difficultyOffset,
      difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      sourceStructurePreserved: true, answerVisualRequired: true, answerVisualStatus: "verified-reconstruction",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-calculation-user-authorized",
      questionModel: { years, female, male, gaps },
      answerModel: original
        ? { displayedMaxYear: maxYears[0], actualMaxYearUndetermined: true, minimum, maximum, lowerExclusive, upperExclusive }
        : { year: maxYears[0], maleShown, femaleShown, minimum, maximum, lowerExclusive, upperExclusive }
    });
  }
  function getOriginal(variant = 0, difficultyOffset = 0) { return getQuestion(variant, difficultyOffset, true); }
  function install(target) {
    const generators = target?.HSE_GENERATORS;
    if (!generators || typeof generators.generatorKey !== "function" || typeof generators.generate !== "function") return false;
    if (generators.__source52RoundedRangeE44Installed) return true;
    const previousKey = generators.generatorKey.bind(generators), previousGenerate = generators.generate.bind(generators);
    const isType = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey || type.id === originalId || type.sourceItemId === originalId || type.generatorKey === originalKey);
    const resolves = type => type && ((type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey) || (type.id === originalId && type.sourceItemId === originalId && type.generatorKey === originalKey)) && type.reviewLocked === false && type.sourceVerified === true;
    generators.generatorKey = type => !isType(type) ? previousKey(type) : resolves(type) ? type.generatorKey : "";
    generators.generate = (type, rank, difficulty, seed, variant = 0) => !isType(type) ? previousGenerate(type, rank, difficulty, seed, variant) : resolves(type) ? (type.id === originalId ? getOriginal(variant, difficulty ?? 0) : getQuestion(variant, difficulty ?? 0)) : null;
    if (Array.isArray(generators.names) && !generators.names.includes(generatorKey)) generators.names.push(generatorKey);
    if (Array.isArray(generators.names) && !generators.names.includes(originalKey)) generators.names.push(originalKey);
    Object.defineProperty(generators, "__source52RoundedRangeE44Installed", { value: true });
    return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, years, pools, maleDifficultyDelta, getQuestion, getOriginal, graphSvg, install, publisherKeyVerified: false });
});
