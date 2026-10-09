(() => {
  "use strict";

  const api = window.HSE_GENERATORS;
  if (!api) throw new Error("개념탐구 3 생성기에는 HSE_GENERATORS가 필요합니다.");

  const freeze = value => {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze);
      Object.freeze(value);
    }
    return value;
  };
  const math = expression => `<span class="math-inline-expression">${expression}</span>`;
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));

  // All finite lengths and weights use integer thousandths; no binary decimal rounding.
  const units = text => {
    if (!/^\d+(?:\.\d{1,3})?$/.test(String(text))) throw new Error("소수는 세 자리 이내여야 합니다.");
    const [whole, fraction = ""] = String(text).split(".");
    return BigInt(whole) * 1000n + BigInt(fraction.padEnd(3, "0"));
  };
  const decimal = (value, places, trim = false) => {
    const digits = String(value).padStart(places + 1, "0");
    if (!places) return digits;
    const result = `${digits.slice(0, -places)}.${digits.slice(-places)}`;
    return trim ? result.replace(/0+$/, "").replace(/\.$/, "") : result;
  };
  const measure = value => decimal(value, 3, true);
  const positive = (...values) => {
    if (values.some(value => value <= 0n)) throw new Error("길이와 무게는 양수여야 합니다.");
  };
  const longDivision = (numerator, denominator, places) => {
    positive(numerator, denominator);
    let remainder = numerator % denominator;
    const digits = [];
    for (let index = 0; index < places; index += 1) {
      remainder *= 10n;
      digits.push(Number(remainder / denominator));
      remainder %= denominator;
    }
    return { integer: numerator / denominator, digits, remainder };
  };
  const rounded = (numerator, denominator, places) => {
    const division = longDivision(numerator, denominator, places + 1);
    const kept = division.digits.slice(0, places).join("");
    return BigInt(`${division.integer}${kept}`) + (division.digits[places] >= 5 ? 1n : 0n);
  };
  const prefix = (numerator, denominator) => {
    const division = longDivision(numerator, denominator, 3);
    return `${division.integer}.${division.digits.join("")}`;
  };
  const exactShare = (total, count) => {
    positive(total, count);
    if (total % count !== 0n) throw new Error("한 봉지의 무게는 소수 셋째 자리 이내로 정확히 나타나야 합니다.");
    return measure(total / count);
  };
  const repeatingBlock = (numerator, denominator) => {
    let remainder = numerator % denominator;
    const seen = new Map(), digits = [];
    while (remainder && !seen.has(remainder)) {
      if (digits.length >= 100) throw new Error("반복 묶음을 확인하지 못했습니다.");
      seen.set(remainder, digits.length);
      remainder *= 10n;
      digits.push(Number(remainder / denominator));
      remainder %= denominator;
    }
    if (!remainder || seen.get(remainder) !== 0 || digits.length !== 3) throw new Error("세 숫자가 처음부터 반복되어야 합니다.");
    return digits;
  };
  const evidence = (page, numbers, target, answer, handwriting, agrees) => freeze({
    sourceImage: `e3-original-${page === 22 ? "020" : "021"}.png`, printedPage: page,
    originalNumbers: numbers, originalTarget: target, originalAnswer: answer,
    originalAnswerStatus: "independently-computed", publisherAnswerVerified: false,
    handwritingReading: handwriting, handwritingReadingConfirmed: true,
    handwrittenAnswerVerified: false, handwritingAgreesWithCalculation: agrees,
    handwritingConflict: !agrees,
    conflictEvidence: agrees ? null : { calculatedAnswer: answer, handwritingReading: handwriting,
      status: "unresolved-handwriting-conflict", resolution: "do-not-auto-unlock" }
  });

  const roundingDefinition = (number, rows, handwriting, sourceAnswer) => ({
    suffix: `exploration-${number}`, key: `sourceGrade6DecimalE3Exploration${number}`,
    pools: freeze(rows), designs: ["quotient-first-three-digits-given", "source-division-then-round", "reconstruct-dividend-then-round"],
    steps: [1, 2, 3],
    source: evidence(22, { dividend: rows[0][0], divisor: rows[0][1] }, "반올림하여 소수 둘째 자리까지", sourceAnswer, handwriting, number !== 3),
    build([dividend, divisor, added], level) {
      const numerator = units(dividend), denominator = units(divisor), addend = units(added);
      const before = prefix(numerator, denominator);
      const answer = decimal(rounded(numerator, denominator, 2), 2);
      const instruction = "몫을 반올림하여 소수 둘째 자리까지 구하세요.";
      const prompt = level === 0
        ? `${math(`${dividend}÷${divisor}`)}의 몫에서 소수 셋째 자리까지 차례로 적으면 ${math(before)}입니다. ${instruction}`
        : level === 1 ? `${math(`${dividend}÷${divisor}`)}의 ${instruction}`
        : `${measure(numerator + addend)}에서 ${added}를 뺀 수를 ${divisor}로 나누려고 합니다. ${instruction}`;
      const reconstruction = level === 2 ? `나누어지는 수는 ${math(`${measure(numerator + addend)}-${added}=${dividend}`)}입니다. ` : "";
      const division = level === 0 ? "" : `나눗셈의 몫에서 소수 셋째 자리까지 적으면 ${math(before)}입니다. `;
      const third = longDivision(numerator, denominator, 3).digits[2];
      return { prompt, answer, solution: `${reconstruction}${division}소수 셋째 자리 숫자 ${third}을 보고 반올림하면 ${math(answer)}입니다.`,
        rows: [["소수 셋째 자리까지", before], ["답", answer]],
        exactValues: { dividend, divisor, quotientPrefix: before, roundedHundredths: answer } };
    }
  });

  const definitions = [
    roundingDefinition(1, [["21.8", "3.2", "10"], ["18.7", "2.8", "6"], ["32.9", "4.8", "8"]], "6.81", "6.81"),
    roundingDefinition(2, [["20.5", "3.21", "10"], ["19.6", "2.31", "8"], ["26.4", "4.17", "12"]], "6.39", "6.39"),
    roundingDefinition(3, [["27.72", "30.7", "10"], ["36.48", "40.3", "12"], ["18.54", "25.6", "5"]], "0.81", "0.90"),
    {
      suffix: "example-1", key: "sourceGrade6DecimalE3Example1",
      pools: freeze([["4.7", "3.7", "3.2"], ["5.7", "3.7", "2.4"], ["6.7", "3.7", "1.8"]]),
      designs: ["repeating-three-digit-block-given", "source-derive-repeating-block", "reconstruct-dividend-and-derive-block"],
      steps: [4, 5, 6],
      source: evidence(22, { dividend: "4.7", divisor: "3.7", decimalPlaces: 100 }, "소수 100째 자리까지 반올림한 몫의 각 자리 수의 합", "301", "301", true),
      build([dividend, divisor, added], level) {
        const numerator = units(dividend), denominator = units(divisor), addend = units(added);
        const block = repeatingBlock(numerator, denominator), blockText = block.join("");
        const division = longDivision(numerator, denominator, 101);
        const roundedText = String(rounded(numerator, denominator, 100)).padStart(101, "0");
        const integerText = roundedText.slice(0, -100), fraction = roundedText.slice(-100);
        // These pools have no rounding carry into the first 99 digits.
        if (fraction.slice(0, 99) !== blockText.repeat(33)) throw new Error("반올림으로 앞의 반복 묶음이 바뀌었습니다.");
        const last = Number(fraction[99]), blockSum = block.reduce((sum, digit) => sum + digit, 0);
        const integerSum = [...integerText].reduce((sum, digit) => sum + Number(digit), 0);
        const sum = [...roundedText].reduce((total, digit) => total + Number(digit), 0);
        const instruction = "몫을 반올림하여 소수 100째 자리까지 구했을 때, 몫의 각 자리 수의 합을 구하세요.";
        const prompt = level === 0
          ? `${math(`${dividend}÷${divisor}`)}의 몫은 정수 부분이 ${division.integer}이고, 소수 부분에서는 ${blockText}이 처음부터 계속 반복됩니다. ${instruction}`
          : level === 1 ? `${math(`${dividend}÷${divisor}`)}의 ${instruction}`
          : `${measure(numerator + addend)}에서 ${added}를 뺀 수를 ${divisor}로 나눕니다. ${instruction}`;
        const reconstruction = level === 2 ? `나누어지는 수는 ${math(`${measure(numerator + addend)}-${added}=${dividend}`)}입니다. ` : "";
        const repeated = level === 0 ? "" : `나눗셈을 하면 몫은 ${math(`${division.integer}.${blockText}${blockText}...`)}으로, ${blockText}이 반복됩니다. `;
        const answer = String(sum);
        return { prompt, answer,
          solution: `${reconstruction}${repeated}소수 99째 자리까지는 ${blockText}이 33번 반복됩니다. 이 부분의 숫자의 합은 ${math(`(${block.join("+")})×33=${blockSum * 33}`)}입니다. 소수 100째 자리 숫자는 ${division.digits[99]}, 101째 자리 숫자는 ${division.digits[100]}이므로 반올림한 마지막 숫자는 ${last}입니다. 정수 부분의 숫자의 합은 ${integerSum}이므로 모두 더하면 ${math(`${blockSum * 33}+${last}+${integerSum}=${answer}`)}입니다.`,
          rows: [["반복 묶음", `${blockText}, 33번`], ["소수 100째 자리 (반올림 후)", String(last)], ["정수 부분의 숫자의 합", String(integerSum)], ["답", answer]],
          exactValues: { dividend, divisor, decimalPlaces: 100, repeatingBlock: blockText, blockCount: 33,
            roundingDigit: division.digits[100], lastRoundedDigit: last, integerPart: integerText,
            roundedFractionDigits: fraction, digitSum: sum } };
      }
    },
    {
      suffix: "example-4", key: "sourceGrade6DecimalE3Example4",
      pools: freeze([["100.2", "4.22", "40.2"], ["84", "4.3", "32"], ["63", "3.6", "21"]]),
      designs: ["bag-count-given", "source-minimum-bags-and-equal-share", "combine-two-rice-amounts-before-bag-count"],
      steps: [1, 3, 4],
      source: evidence(22, { totalKg: "100.2", capacityKg: "4.22" }, "가장 적은 봉지에 똑같이 나눌 때 한 봉지의 쌀 무게", "4.175kg", "4.175kg", true),
      build([totalText, capacityText, firstText], level) {
        const total = units(totalText), capacity = units(capacityText), first = units(firstText);
        positive(total, capacity, first, total - first);
        const bags = (total + capacity - 1n) / capacity;
        const share = exactShare(total, bags), answer = `${share}kg`;
        if ((bags - 1n) * capacity >= total || bags * capacity < total) throw new Error("최소 봉지 수가 잘못되었습니다.");
        const rice = level === 2 ? `${firstText}kg과 ${measure(total - first)}kg의 쌀을 합하여` : `${totalText}kg의 쌀을`;
        const prompt = level === 0
          ? `${totalText}kg의 쌀을 ${capacityText}kg까지 넣을 수 있는 봉지 ${bags}개에 똑같이 나누어 담으려고 합니다. 한 봉지에 몇 kg씩 담아야 하나요?`
          : `${rice} ${capacityText}kg까지 넣을 수 있는 봉지에 똑같이 나누어 담으려고 합니다. 봉지를 가장 적게 사용했을 때 한 봉지에는 몇 kg씩 담아야 하나요?`;
        const reconstruction = level === 2 ? `쌀의 전체 무게는 ${math(`${firstText}+${measure(total - first)}=${totalText}`)}kg입니다. ` : "";
        const minimum = level === 0 ? "" : `${math(`${totalText}÷${capacityText}=${prefix(total, capacity)}...`)}입니다. ${bags - 1n}개에는 ${math(`${capacityText}×${bags - 1n}=${measure(capacity * (bags - 1n))}`)}kg까지만 넣을 수 있어 부족합니다. ${bags}개에는 ${measure(capacity * bags)}kg까지 넣을 수 있으므로 최소 ${bags}개가 필요합니다. `;
        return { prompt, answer, solution: `${reconstruction}${minimum}한 봉지에 넣을 무게는 ${math(`${totalText}÷${bags}=${share}`)}kg입니다.`,
          rows: [["봉지 수", `${bags}개`], ["답", answer]],
          exactValues: { totalKg: totalText, capacityKg: capacityText, minimumBags: String(bags), shareKg: share } };
      }
    },
    {
      suffix: "mission-1", key: "sourceGrade6DecimalE3Mission1",
      pools: freeze([["6.348", "2.14", "3.2"], ["7.125", "2.4", "3.1"], ["8.256", "3.2", "4.1"]]),
      designs: ["quotient-first-three-digits-given", "source-two-rounded-quotients-and-difference", "reconstruct-dividend-before-two-roundings"],
      steps: [3, 4, 5],
      source: evidence(23, { dividend: "6.348", divisor: "2.14" }, "소수 첫째 자리와 둘째 자리까지 각각 반올림한 몫의 차", "0.03", "0.03 (0.01은 지워짐)", true),
      build([dividend, divisor, added], level) {
        const numerator = units(dividend), denominator = units(divisor), addend = units(added);
        const before = prefix(numerator, denominator);
        const tenths = rounded(numerator, denominator, 1), hundredths = rounded(numerator, denominator, 2);
        const difference = tenths * 10n >= hundredths ? tenths * 10n - hundredths : hundredths - tenths * 10n;
        const first = decimal(tenths, 1), second = decimal(hundredths, 2), answer = decimal(difference, 2);
        const instruction = "몫을 반올림하여 소수 첫째 자리까지 구한 수와 소수 둘째 자리까지 구한 수의 차를 구하세요.";
        const prompt = level === 0
          ? `${math(`${dividend}÷${divisor}`)}의 몫에서 소수 셋째 자리까지 차례로 적으면 ${math(before)}입니다. ${instruction}`
          : level === 1 ? `${math(`${dividend}÷${divisor}`)}의 ${instruction}`
          : `${measure(numerator + addend)}에서 ${added}를 뺀 수를 ${divisor}로 나눕니다. ${instruction}`;
        const reconstruction = level === 2 ? `나누어지는 수는 ${math(`${measure(numerator + addend)}-${added}=${dividend}`)}입니다. ` : "";
        const quotient = level === 0 ? "" : `몫에서 소수 셋째 자리까지 적으면 ${math(before)}입니다. `;
        const ordered = tenths * 10n >= hundredths ? [first, second] : [second, first];
        return { prompt, answer, solution: `${reconstruction}${quotient}반올림하여 소수 첫째 자리까지 구하면 ${math(first)}, 소수 둘째 자리까지 구하면 ${math(second)}입니다. 두 수의 차는 ${math(`${ordered[0]}-${ordered[1]}=${answer}`)}입니다.`,
          rows: [["소수 첫째 자리까지", first], ["소수 둘째 자리까지", second], ["답", answer]],
          exactValues: { dividend, divisor, quotientPrefix: before, roundedTenths: first, roundedHundredths: second, difference: answer } };
      }
    },
    {
      suffix: "mission-3", key: "sourceGrade6DecimalE3Mission3",
      pools: freeze([["2.94", "3.4", "0.86", "0.1"], ["1.98", "2.6", "0.77", "0.1"], ["3.59", "3.8", "0.94", "0.1"]]),
      designs: ["rounding-interval-given", "source-one-missing-dividend-digit", "reconstruct-dividend-with-one-missing-digit"],
      steps: [2, 3, 4],
      source: evidence(23, { dividendTemplate: "2.94□5", divisor: "3.4", roundedHundredths: "0.86", blankCount: 1 }, "반올림한 몫이 0.86일 때 한 칸에 들어갈 숫자", "0", "0", true),
      build([baseText, divisor, targetText, added], level) {
        const base = units(baseText), addend = units(added), denominator = units(divisor) * 10n;
        const target = units(targetText) / 10n;
        if (units(targetText) % 10n) throw new Error("목표 몫은 소수 둘째 자리까지여야 합니다.");
        const lower = target * 10n - 5n, upper = target * 10n + 5n;
        positive(base - addend, lower);
        const candidates = [];
        for (let digit = 0; digit <= 9; digit += 1) {
          const numerator = base * 10n + BigInt(digit) * 10n + 5n;
          if (rounded(numerator, denominator, 2) === target) candidates.push(digit);
        }
        if (candidates.length !== 1) throw new Error("빈칸에 들어갈 숫자는 하나여야 합니다.");
        const answer = String(candidates[0]), template = `${baseText}□5`;
        const expression = level === 2 ? `(${measure(base - addend)}□5+${added})÷${divisor}` : `${template}÷${divisor}`;
        const prompt = `${math(expression)}의 몫을 반올림하여 소수 둘째 자리까지 나타내면 ${targetText}입니다. ${level === 0 ? `반올림하기 전의 몫은 ${decimal(lower, 3)} 이상 ${decimal(upper, 3)} 미만입니다. ` : ""}□ 안에 알맞은 숫자를 구하세요.`;
        const candidateText = `${baseText}${answer}5`;
        const lowerDividend = decimal(lower * units(divisor), 6, true), upperDividend = decimal(upper * units(divisor), 6, true);
        const reconstruction = level === 2 ? `${added}를 더한 뒤 나누어지는 수는 ${template}입니다. ` : "";
        const interval = level === 0 ? "" : `반올림하기 전의 몫은 ${decimal(lower, 3)} 이상 ${decimal(upper, 3)} 미만입니다. `;
        return { prompt, answer, solution: `${reconstruction}${interval}나누어지는 수는 ${math(`${decimal(lower, 3)}×${divisor}=${lowerDividend}`)} 이상, ${math(`${decimal(upper, 3)}×${divisor}=${upperDividend}`)} 미만이어야 합니다. ${template}에서 이 범위에 들어가는 수는 ${candidateText}뿐이므로 □ 안의 숫자는 ${answer}입니다.`,
          rows: [["가능한 수", candidateText], ["답", answer]],
          exactValues: { dividendTemplate: template, inputTemplate: level === 2 ? `${measure(base - addend)}□5` : template,
            added: level === 2 ? added : "0", divisor, roundedHundredths: targetText, candidates,
            lowerQuotientInclusive: decimal(lower, 3), upperQuotientExclusive: decimal(upper, 3),
            lowerDividendInclusive: lowerDividend, upperDividendExclusive: upperDividend, dividend: candidateText } };
      }
    },
    {
      suffix: "mission-4", key: "sourceGrade6DecimalE3Mission4",
      pools: freeze([["16", "2.5", "0.12", "0.5"], ["14", "2.3", "0.15", "0.5"], ["18", "3.1", "0.14", "0.6"]]),
      designs: ["available-box-weight-given", "source-subtract-truck-then-whole-box-count", "combine-truck-and-equipment-before-box-count"],
      steps: [2, 3, 4],
      source: evidence(23, { bridgeLimitT: "16", truckT: "2.5", boxT: "0.12" }, "다리를 지날 수 있는 상자의 최대 개수", "112개", "112개", true),
      build([limitText, truckText, boxText, equipmentText], level) {
        const limit = units(limitText), truck = units(truckText), box = units(boxText), equipment = units(equipmentText);
        const available = limit - truck;
        positive(limit, truck, box, equipment, available, truck - equipment);
        const count = available / box;
        if (truck + count * box > limit || truck + (count + 1n) * box <= limit) throw new Error("상자의 최대 개수가 잘못되었습니다.");
        const prompt = level === 0
          ? `상자를 실을 수 있는 무게가 ${measure(available)}t인 트럭이 있습니다. 한 개의 무게가 ${boxText}t인 상자를 몇 개까지 실을 수 있나요?`
          : level === 1
            ? `지나갈 수 있는 최대 무게가 ${limitText}t인 다리가 있습니다. 무게가 ${truckText}t인 트럭이 이 다리를 지나가려면, 한 개의 무게가 ${boxText}t인 상자를 몇 개까지 실을 수 있나요?`
            : `지나갈 수 있는 최대 무게가 ${limitText}t인 다리가 있습니다. 트럭의 무게는 ${measure(truck - equipment)}t이고, 트럭에 고정된 장비의 무게는 ${equipmentText}t입니다. 트럭과 장비와 상자의 무게를 모두 합하여 다리의 최대 무게를 넘지 않으려면, 한 개의 무게가 ${boxText}t인 상자를 몇 개까지 실을 수 있나요?`;
        const reconstruction = level === 2 ? `트럭과 장비의 무게는 ${math(`${measure(truck - equipment)}+${equipmentText}=${truckText}`)}t입니다. ` : "";
        const payload = level === 0 ? "" : `상자에 쓸 수 있는 무게는 ${math(`${limitText}-${truckText}=${measure(available)}`)}t입니다. `;
        const answer = `${count}개`;
        return { prompt, answer, solution: `${reconstruction}${payload}${math(`${measure(available)}÷${boxText}=${prefix(available, box)}...`)}이므로 상자는 ${count}개까지 실을 수 있습니다. ${count}개의 무게는 ${math(`${boxText}×${count}=${measure(box * count)}`)}t입니다. ${count + 1n}개의 무게는 ${measure(box * (count + 1n))}t로 ${measure(available)}t를 넘으므로 최대 ${answer}입니다.`,
          rows: [["상자에 쓸 수 있는 무게", `${measure(available)}t`], ["답", answer]],
          exactValues: { bridgeLimitT: limitText, truckT: truckText, boxT: boxText, availableT: measure(available),
            maximumBoxes: String(count), lastAllowedBoxesT: measure(box * count), nextBoxesT: measure(box * (count + 1n)) } };
      }
    },
    {
      suffix: "mission-6", key: "sourceGrade6DecimalE3Mission6",
      pools: freeze([["15.05", "19.35", "25.8", "2.15"], ["12.6", "16.8", "21", "2.1"], ["14.4", "21.6", "25.2", "1.8"]]),
      designs: ["axis-counts-given", "source-three-dimension-quotients-and-product", "reserved-width-before-three-axis-counts"],
      steps: [2, 5, 6],
      source: evidence(23, { widthCm: "15.05", depthCm: "19.35", heightCm: "25.8", cubeEdgeCm: "2.15" }, "상자에 넣을 수 있는 정육면체 수, 상자의 두께는 생각하지 않음", "756개", "756개 (693개는 지워짐)", true),
      build([widthText, depthText, heightText, edgeText], level) {
        const dimensions = [widthText, depthText, heightText].map(units), edge = units(edgeText);
        positive(...dimensions, edge);
        if (dimensions.some(dimension => dimension % edge !== 0n)) throw new Error("각 방향의 길이는 정육면체 모서리 길이의 정수 배여야 합니다.");
        const counts = dimensions.map(dimension => dimension / edge);
        const total = counts.reduce((product, count) => product * count, 1n);
        const answer = `${total}개`;
        const size = `가로가 ${level === 2 ? measure(dimensions[0] + edge) : widthText}cm, 세로가 ${depthText}cm, 높이가 ${heightText}cm인 직육면체 모양의 상자가 있습니다.`;
        const prompt = level === 0
          ? `상자에 한 모서리의 길이가 ${edgeText}cm인 정육면체를 빈틈없이 넣었습니다. 가로 방향 한 줄에 ${counts[0]}개, 세로 방향 한 줄에 ${counts[1]}개가 놓이고, 높이 방향으로 ${counts[2]}층이 쌓였습니다. 정육면체는 모두 몇 개인가요?`
          : `${size} 한 모서리의 길이가 ${edgeText}cm인 정육면체를 넣으려고 합니다. ${level === 2 ? `가로 방향으로 폭 ${edgeText}cm인 부분은 상자의 세로와 높이 전체에 걸쳐 비워 두고, 나머지 부분에만 정육면체를 넣습니다. ` : ""}넣을 수 있는 정육면체는 모두 몇 개인가요? 단, 상자의 두께는 생각하지 않습니다.`;
        const reconstruction = level === 2 ? `정육면체를 넣는 부분의 가로 길이는 ${math(`${measure(dimensions[0] + edge)}-${edgeText}=${widthText}`)}cm입니다. ` : "";
        const axes = level === 0 ? "" : `가로 방향에는 ${math(`${widthText}÷${edgeText}=${counts[0]}`)}개, 세로 방향에는 ${math(`${depthText}÷${edgeText}=${counts[1]}`)}개, 높이 방향에는 ${math(`${heightText}÷${edgeText}=${counts[2]}`)}개가 들어갑니다. `;
        const perLayer = counts[0] * counts[1];
        return { prompt, answer, solution: `${reconstruction}${axes}한 층에는 ${math(`${counts[0]}×${counts[1]}=${perLayer}`)}개가 들어갑니다. ${counts[2]}층을 쌓으면 ${math(`${perLayer}×${counts[2]}=${total}`)}개입니다.`,
          rows: [["가로 방향", `${counts[0]}개`], ["세로 방향", `${counts[1]}개`], ["높이 방향", `${counts[2]}층`], ["답", answer]],
          exactValues: { widthCm: widthText, depthCm: depthText, heightCm: heightText, cubeEdgeCm: edgeText,
            outerWidthCm: level === 2 ? measure(dimensions[0] + edge) : widthText,
            reservedWidthCm: level === 2 ? edgeText : "0", cubeCount: String(total) },
          dimensionQuotients: { width: String(counts[0]), depth: String(counts[1]), height: String(counts[2]) },
          axisCounts: { width: Number(counts[0]), depth: Number(counts[1]), height: Number(counts[2]) } };
      }
    }
  ];
  freeze(definitions);

  const byId = new Map(definitions.map(definition => [`6-2-u2-e3-${definition.suffix}`, definition]));
  const byKey = new Map(definitions.map(definition => [definition.key, definition]));
  const centralIds = new Set(["6-2-u2-e3-example-2", "6-2-u2-e3-mission-2"]);
  const centralKeys = new Set(["sourceGrade6SecondDecimalDivisionE3Example2", "sourceGrade6SecondDecimalDivisionE3Mission2"]);
  const resolve = type => type?.sourceItemId ? byId.get(type.sourceItemId) : byKey.get(type?.generatorKey);
  const originalKey = api.generatorKey, originalGenerate = api.generate;
  api.generatorKey = type => {
    const definition = resolve(type);
    return definition ? (type.reviewLocked ? "" : definition.key) : originalKey(type);
  };
  api.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => {
    const definition = resolve(type);
    if (!definition) {
      if (!centralIds.has(type?.sourceItemId) && !centralKeys.has(type?.generatorKey)) return originalGenerate(type, levelRank, difficultyOffset, seed, variant);
      if (type.reviewLocked) return null;
      const offset = difficultyOffset ?? 0;
      if (![-1, 0, 1].includes(offset) || !Number.isSafeInteger(variant) || variant < 0) throw new Error("난이도와 고정 변형 번호가 올바르지 않습니다.");
      return originalGenerate(type, levelRank, offset, seed, variant);
    }
    if (type.reviewLocked) return null;
    if (!Number.isSafeInteger(variant) || variant < 0) throw new Error("고정 변형 번호는 영 이상의 안전한 정수여야 합니다.");
    const offset = difficultyOffset ?? 0;
    if (![-1, 0, 1].includes(offset)) throw new Error("난이도는 -1, 0, +1이어야 합니다.");
    const level = offset + 1, poolIndex = ((variant % 3) + 3) % 3;
    const sourceItemId = `6-2-u2-e3-${definition.suffix}`, difficultyDesign = definition.designs[level];
    const item = definition.build(definition.pools[poolIndex], level);
    const normal = 'style="color:#000;font-weight:400"';
    const rows = item.rows.map(([label, value]) => `<tr><th scope="row" ${normal}>${esc(label)}</th><td ${normal}>${esc(value)}</td></tr>`).join("");
    return {
      prompt: item.prompt, answer: item.answer, solution: item.solution,
      answerVisual: `<table class="problem-table source62-e3-answer-table" data-phase="answer" data-answer-source="${sourceItemId}" data-print-weight="compact" data-verified-pool-index="${poolIndex}" data-difficulty-design="${difficultyDesign}" ${normal}><thead><tr><th scope="col" ${normal}>항목</th><th scope="col" ${normal}>값</th></tr></thead><tbody>${rows}</tbody></table>`,
      sourceItemId, generator: definition.key, generationMode: "fixed-verified-pool",
      verifiedPoolIndex: poolIndex, verifiedVariantCount: 3, verifiedVariantTarget: 3,
      verifiedVariantId: `${sourceItemId}:v${poolIndex}`, variantProvenance: poolIndex === 0 && level === 1 ? "source-values" : "source-structure-variant",
      difficultyDesign, difficultyLevel: level, difficultyRank: level, difficultyOffset: offset, levelRank,
      sourceDifficultyRank: 1, reasoningSteps: definition.steps[level], sourceStepCount: definition.steps[1],
      difficultyStepDelta: definition.steps[level] - definition.steps[1],
      sourceEvidence: definition.source, sourceAnswer: definition.source.originalAnswer,
      publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      exactValues: freeze(item.exactValues),
      ...(item.dimensionQuotients ? { dimensionQuotients: freeze(item.dimensionQuotients), axisCounts: freeze(item.axisCounts) } : {})
    };
  };
  if (Array.isArray(api.names)) for (const { key } of definitions) if (!api.names.includes(key)) api.names.push(key);
})();
