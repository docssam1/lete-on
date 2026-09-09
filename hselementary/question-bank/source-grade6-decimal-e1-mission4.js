(() => {
  "use strict";

  const api = window.HSE_GENERATORS;
  if (!api) throw new Error("6-1 소수의 나눗셈 Mission 4 생성기를 불러오지 못했습니다.");

  const sourceItemId = "6-1-u3-e1-mission-4";
  const generatorKey = "sourceGrade6DecimalDivisionE1Mission4";
  const pools = Object.freeze([
    Object.freeze({ divisor: 8, dividend: 58.8, quotient: 7.35 }),
    Object.freeze({ divisor: 8, dividend: 51.6, quotient: 6.45 }),
    Object.freeze({ divisor: 6, dividend: 52.5, quotient: 8.75 })
  ]);

  const facts = data => {
    const dividendTenths = Math.round(data.dividend * 10);
    const quotientHundredths = Math.round(data.quotient * 100);
    const dividendDigits = [Math.floor(dividendTenths / 100), Math.floor(dividendTenths / 10) % 10, dividendTenths % 10];
    const quotientDigits = [Math.floor(quotientHundredths / 100), Math.floor(quotientHundredths / 10) % 10, quotientHundredths % 10];
    const firstPartial = dividendDigits[0] * 10 + dividendDigits[1];
    const product1 = data.divisor * quotientDigits[0];
    const remainder1 = firstPartial - product1;
    const secondPartial = remainder1 * 10 + dividendDigits[2];
    const product2 = data.divisor * quotientDigits[1];
    const remainder2 = secondPartial - product2;
    const thirdPartial = remainder2 * 10;
    const product3 = data.divisor * quotientDigits[2];
    const remainder3 = thirdPartial - product3;
    const candidates = [];
    for (let hundredths = 1; hundredths <= 999; hundredths += 1) {
      if (data.divisor * hundredths === Math.round(data.dividend * 100)) candidates.push(hundredths / 100);
    }
    return { dividendDigits, quotientDigits, firstPartial, product1, remainder1, secondPartial, product2, remainder2, thirdPartial, product3, remainder3, candidates };
  };

  const digits = value => String(value).padStart(2, "0").split("");
  const poolIndexForSeed = seed => {
    let hash = 2166136261;
    for (const character of String(seed ?? 0)) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) % pools.length;
  };
  const cell = (row, column, value, className = "") => `<span class="source61-division-cell ${className}" style="grid-row:${row};grid-column:${column}">${value}</span>`;
  const line = (row, from, to) => `<span class="source61-division-line" style="grid-row:${row};grid-column:${from}/${to}"></span>`;
  const board = (data, solved, poolIndex) => {
    const f = facts(data);
    const [p1a, p1b] = digits(f.product1);
    const [p2a, p2b] = digits(f.product2);
    const [t3a, t3b] = digits(f.thirdPartial);
    const [p3a, p3b] = digits(f.product3);
    const q = solved ? f.quotientDigits : ["㉠", "㉡", "㉢"];
    const dividend = solved ? f.dividendDigits : ["㉣", "㉤", f.dividendDigits[2]];
    const product1 = solved ? [p1a, p1b] : [p1a, "㉥"];
    const secondPartial = solved ? [String(f.remainder1), String(f.secondPartial % 10)] : [String(f.remainder1), "㉦"];
    const product2 = solved ? [p2a, p2b] : ["㉧", "㉨"];
    const thirdPartial = solved ? [t3a, t3b] : ["㉩", "㉪"];
    const product3 = solved ? [p3a, p3b] : ["㉫", "㉬"];
    const markup = [
      cell(1, 3, q[0], solved ? "is-answer" : "is-symbol"), cell(1, 4, ".", "is-decimal"), cell(1, 5, q[1], solved ? "is-answer" : "is-symbol"), cell(1, 6, q[2], solved ? "is-answer" : "is-symbol"),
      cell(2, 1, data.divisor, "is-divisor"), `<span class="source61-division-bracket" style="grid-row:2;grid-column:2/7"></span>`,
      cell(2, 2, dividend[0], solved ? "" : "is-symbol"), cell(2, 3, dividend[1], solved ? "" : "is-symbol"), cell(2, 4, ".", "is-decimal"), cell(2, 5, dividend[2]),
      cell(3, 2, product1[0]), cell(3, 3, product1[1], solved ? "" : "is-symbol"), line(3, 2, 4),
      cell(4, 3, secondPartial[0]), cell(4, 5, secondPartial[1], solved ? "" : "is-symbol"),
      cell(5, 3, product2[0], solved ? "" : "is-symbol"), cell(5, 5, product2[1], solved ? "" : "is-symbol"), line(5, 3, 6),
      cell(6, 5, thirdPartial[0], solved ? "" : "is-symbol"), cell(6, 6, thirdPartial[1], solved ? "" : "is-symbol"),
      cell(7, 5, product3[0], solved ? "" : "is-symbol"), cell(7, 6, product3[1], solved ? "" : "is-symbol"), line(7, 5, 7),
      cell(8, 6, f.remainder3, "is-remainder")
    ].join("");
    return `<div class="source61-long-division ${solved ? "is-solved" : ""}" role="img" aria-label="${solved ? "숫자를 모두 채운" : "기호로 일부 숫자를 가린"} 소수 나눗셈 세로셈" data-source61-division-model="decimal-long-division-place-grid" data-source61-division-phase="${solved ? "answer" : "problem"}" data-pool="${poolIndex}" data-quotient-symbols="㉠.㉡㉢"><strong>${solved ? "같은 자리에 숫자를 채운 답" : "기호의 자리를 따라 계산하세요"}</strong><div class="source61-division-grid">${markup}</div>${solved ? `<p class="source61-division-result">㉠.㉡㉢ = ${data.quotient.toFixed(2)}</p>` : ""}</div>`;
  };

  const solution = data => {
    const f = facts(data);
    return `${f.firstPartial}÷${data.divisor}의 몫은 ${f.quotientDigits[0]}, 나머지는 ${f.remainder1}이므로 먼저 ${f.product1}을 뺍니다. ${f.secondPartial}÷${data.divisor}의 몫은 ${f.quotientDigits[1]}, 나머지는 ${f.remainder2}이므로 ${f.product2}를 뺍니다. ${f.thirdPartial}÷${data.divisor}=${f.quotientDigits[2]}이므로 몫은 ${data.quotient.toFixed(2)}입니다. ${data.quotient.toFixed(2)}×${data.divisor}=${data.dividend.toFixed(1)}로 다시 확인됩니다.`;
  };

  const markInventory = () => {
    const patch = item => Object.assign(item, {
      generatorKey, reviewLocked: false, reviewReason: "", answerVisualStatus: "verified",
      generationMode: "fixed-verified-pool", verifiedVariantTarget: 3, verifiedVariantCount: 3,
      verifiedVariantProvenance: ["source-values", "source-structure-variant", "source-structure-variant"], variant: 0
    });
    if (Array.isArray(window.HSE_SOURCE_INVENTORY_GRADE6?.items)) window.HSE_SOURCE_INVENTORY_GRADE6.items.filter(item => item.sourceItemId === sourceItemId).forEach(patch);
    const semesters = window.HSE_CURRICULUM?.semesters || [];
    semesters.flatMap(semester => semester.units || []).flatMap(unit => unit.subunits || []).flatMap(subunit => subunit.types || []).filter(type => type.sourceItemId === sourceItemId).forEach(patch);
  };

  const originalKey = api.generatorKey;
  const originalGenerate = api.generate;
  api.generatorKey = type => type?.sourceItemId === sourceItemId || type?.generatorKey === generatorKey ? generatorKey : originalKey(type);
  api.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => {
    if (type?.sourceItemId !== sourceItemId && type?.generatorKey !== generatorKey) return originalGenerate(type, levelRank, difficultyOffset, seed, variant);
    const poolIndex = poolIndexForSeed(seed);
    const data = pools[poolIndex];
    const f = facts(data);
    if (f.remainder3 !== 0 || f.candidates.length !== 1 || f.candidates[0] !== data.quotient) throw new Error(`${sourceItemId}: 단일 정답 검산에 실패했습니다.`);
    const level = Math.max(0, Math.min(2, 1 + Number(difficultyOffset || 0)));
    const extra = level === 0
      ? `<p class="question-step" data-step-evidence="guided">먼저 소수점 앞의 두 자리 수에서 ${data.divisor}를 몇 번 뺄 수 있는지 생각하세요.</p>`
      : level === 2 ? `<p class="question-step source61-challenge" data-step-evidence="independent-reasoning">각 단계의 곱과 나머지를 확인하여 몫이 하나로 정해지는 까닭을 설명해 보세요.</p>` : "";
    const evidence = `<span hidden data-source61-division-kind="masked-decimal-long-division" data-source-item="${sourceItemId}" data-values="${[data.divisor, data.dividend, data.quotient, f.product1, f.secondPartial, f.product2, f.thirdPartial, f.product3].join(",")}" data-difficulty-design="${["guided", "source", "independent-reasoning"][level]}"></span>`;
    return {
      prompt: `다음 나눗셈의 몫인 ㉠.㉡㉢을 구하세요.${board(data, false, poolIndex)}${extra}${evidence}`,
      answer: data.quotient.toFixed(2),
      solution: solution(data),
      answerVisual: `<div class="verified-answer-diagram source61-answer-diagram source61-division-answer" data-answer-source="${sourceItemId}" data-verified-pool-index="${poolIndex}">${board(data, true, poolIndex)}<div class="solution-answer-caption">문제와 같은 세로셈 자리에 숫자를 채워 확인한 답</div></div>`,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex, verifiedVariantCount: 3,
      sourceItemId, generator: generatorKey, variantProvenance: poolIndex === 0 ? "source-values" : "source-structure-variant",
      difficultyDesign: ["guided", "source", "independent-reasoning"][level]
    };
  };
  if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
  markInventory();
})();
