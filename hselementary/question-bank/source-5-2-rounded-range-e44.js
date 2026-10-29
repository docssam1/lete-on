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

  function graphSvg(female, male, highlightYear = null) {
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
    return `<svg class="source52-e44-graph" viewBox="0 0 650 430" role="img" aria-label="${esc(`가상 마을의 남녀 인구 그래프. 백 명 단위, 여자는 실선, 남자는 점선. ${years.map((year, index) => `${year}년 여자 ${female[index]}, 남자 ${male[index]}`).join("; ")}.${highlightYear ? ` 풀이에서는 ${highlightYear}년을 강조합니다.` : ""}`)}"><title>가상 마을의 남녀 인구수</title><desc>세로축은 백 명 단위이며 50부터 75까지 한 칸에 백 명입니다. 여자 인구는 실선, 남자 인구는 점선입니다. 가로축은 2005년부터 2010년까지입니다.${highlightYear ? ` 정답 풀이에서 ${highlightYear}년을 강조했습니다.` : ""}</desc><text x="347" y="30" text-anchor="middle" class="chart-title">가상 마을의 남녀 인구수</text><text x="17" y="196" class="axis-unit">(백 명)</text><path d="M95 83V310 M95 310H600" class="axis"/>${horizontalGrid}${verticalGrid}${highlight}<text x="82" y="410" text-anchor="end" class="tick">0</text><path d="M75 322q10 -9 20 0t20 0 M75 332q10 -9 20 0t20 0" class="break"/><path d="${line(female)}" class="female-line"/>${points(female, "female")}<path d="${line(male)}" class="male-line"/>${points(male, "male")}<text x="112" y="${svgY(female[0]) - 9}" class="series-label">여자</text><text x="112" y="${svgY(male[0]) + 21}" class="series-label">남자</text>${yearLabels}<text x="606" y="360" class="axis-unit">(년)</text><text x="14" y="423" class="axis-unit">인구수·연도</text></svg>`;
  }

  function getQuestion(variant = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant >= pools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const female = [...pools[variant].female];
    const male = pools[variant].male.map(value => value + maleDifficultyDelta[difficultyOffset + 1]);
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
    const prompt = `가상 마을의 남자 인구수는 반올림하여 백의 자리까지, 여자 인구수는 버림하여 백의 자리까지 꺾은선그래프로 나타낸 것입니다. 그래프에 표시된 남녀 인구수의 차가 가장 큰 해의 실제 남녀 인구수 차는 몇 명 초과 몇 명 미만인가요?`;
    const solution = `<ol><li>세로 눈금은 백 명 단위이므로 각 작은 칸은 100명입니다. 실선은 여자, 점선은 남자 인구를 나타냅니다.</li><li>연도별 그래프 값의 차는 ${gaps.map((gap, i) => `${years[i]}년 ${gap}백 명`).join(", ")}입니다. 가장 큰 차는 ${maxYears[0]}년에 나타납니다.</li><li>${maxYears[0]}년 남자 인구는 그래프에서 ${fmt(maleShown)}명으로 반올림한 값이므로 실제 인구는 ${fmt(maleShown - 50)}명 이상 ${fmt(maleShown + 50)}명 미만입니다. 여자 인구는 ${fmt(femaleShown)}명으로 버림한 값이므로 ${fmt(femaleShown)}명 이상 ${fmt(femaleShown + 100)}명 미만입니다.</li><li>실제 남녀 인구 차의 가장 작은 정수는 ${fmt(maleShown - 50)}-${fmt(femaleShown + 99)}=${fmt(minimum)}명이고, 가장 큰 정수는 ${fmt(maleShown + 49)}-${fmt(femaleShown)}=${fmt(maximum)}명입니다. 따라서 ${fmt(lowerExclusive)}명 초과 ${fmt(upperExclusive)}명 미만입니다.</li></ol>`;
    return Object.freeze({
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}"><p>${prompt}</p>${graphSvg(female, male)}</div>`,
      answer, solution: `<div data-source-answer="${sourceItemId}">${solution}</div>`, answerVisual: graphSvg(female, male, maxYears[0]), sourceItemId,
      generator: generatorKey, generationMode: "fixed-verified-pool", verifiedPoolIndex: variant,
      verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length,
      verifiedVariantId: `${sourceItemId}:v${variant}`, difficultyOffset,
      difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      sourceStructurePreserved: true, answerVisualRequired: true, answerVisualStatus: "verified-reconstruction",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-calculation-user-authorized",
      questionModel: { years, female, male, gaps },
      answerModel: { year: maxYears[0], maleShown, femaleShown, minimum, maximum, lowerExclusive, upperExclusive }
    });
  }
  function install(target) {
    const generators = target?.HSE_GENERATORS;
    if (!generators || typeof generators.generatorKey !== "function" || typeof generators.generate !== "function") return false;
    if (generators.__source52RoundedRangeE44Installed) return true;
    const previousKey = generators.generatorKey.bind(generators), previousGenerate = generators.generate.bind(generators);
    const isType = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    const resolves = type => type && type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true;
    generators.generatorKey = type => !isType(type) ? previousKey(type) : resolves(type) ? generatorKey : "";
    generators.generate = (type, rank, difficulty, seed, variant = 0) => !isType(type) ? previousGenerate(type, rank, difficulty, seed, variant) : resolves(type) ? getQuestion(variant, difficulty ?? 0) : null;
    if (Array.isArray(generators.names) && !generators.names.includes(generatorKey)) generators.names.push(generatorKey);
    Object.defineProperty(generators, "__source52RoundedRangeE44Installed", { value: true });
    return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, years, pools, maleDifficultyDelta, getQuestion, graphSvg, install, publisherKeyVerified: false });
});
