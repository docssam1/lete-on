(() => {
  "use strict";

  const api = window.HSE_GENERATORS;
  if (!api) throw new Error("개념탐구 4 생성기에는 HSE_GENERATORS가 필요합니다.");
  const freeze = value => {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze);
      Object.freeze(value);
    }
    return value;
  };
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  const S = 1000000n;
  const normal = 'style="color:#000;font-weight:400"';
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const math = expression => `<span class="math-inline-expression" ${normal}>${esc(expression)}</span>`;
  const unit = text => {
    check(/^\d+(?:\.\d{1,6})?$/.test(String(text)), "정확한 소수는 여섯 자리 이내여야 합니다.");
    const [whole, fraction = ""] = String(text).split(".");
    return BigInt(whole) * S + BigInt(fraction.padEnd(6, "0"));
  };
  const decimal = (value, places, trim = false) => {
    check(value >= 0n, "음수는 사용할 수 없습니다.");
    const digits = String(value).padStart(places + 1, "0");
    if (!places) return digits;
    const result = `${digits.slice(0, -places)}.${digits.slice(-places)}`;
    return trim ? result.replace(/0+$/, "").replace(/\.$/, "") : result;
  };
  const fmt = value => decimal(value, 6, true);
  const scale = places => 10n ** BigInt(places);
  const positive = (...values) => check(values.every(value => value > 0n), "나누어지는 수와 나누는 수는 양수여야 합니다.");
  const product = (divisor, quotientTicks, places) => {
    const numerator = divisor * quotientTicks;
    check(numerator % scale(places) === 0n, "곱을 정수 단위로 정확히 나타낼 수 없습니다.");
    return numerator / scale(places);
  };
  const divide = (dividend, divisor, places) => {
    positive(dividend, divisor);
    const ticks = dividend * scale(places) / divisor;
    const remainder = dividend - product(divisor, ticks, places);
    check(remainder >= 0n && remainder * scale(places) < divisor, "몫을 버림한 나머지 범위가 잘못되었습니다.");
    return { ticks, quotient: decimal(ticks, places), remainder, remainderText: fmt(remainder) };
  };
  const round = (dividend, divisor, places) => (2n * dividend * scale(places) + divisor) / (2n * divisor);
  const source = (page, numbers, target, answer, reading, confirmed = true, agrees = true, readings = []) => freeze({
    sourceImage: `source-${page === 24 ? "022" : "023"}.png`, printedPage: page,
    originalNumbers: numbers, originalTarget: target, originalAnswer: answer,
    originalAnswerStatus: "independently-computed", publisherAnswerVerified: false,
    handwritingReading: reading, handwritingReadingConfirmed: Boolean(reading) && confirmed,
    handwrittenAnswerVerified: false, handwritingAgreesWithCalculation: reading && confirmed ? agrees : null,
    handwritingStatus: !reading ? "not-visible" : confirmed ? "legible-single-reading" : "ambiguous",
    handwritingReadings: readings,
    quotientMode: "truncate-at-stated-place", roundingMode: "half-up-only-when-explicitly-stated"
  });
  const splitDivisor = (divisor, part) => {
    const d = unit(divisor), p = unit(part);
    positive(d - p, p);
    return { expression: `(${fmt(d - p)}+${part})`, words: `${fmt(d - p)}와 ${part}를 더한 수`,
      solution: `나누는 수는 ${math(`${fmt(d - p)}+${part}=${divisor}`)}입니다. ` };
  };
  const table = (rows, phase, attributes = "") => `<table class="problem-table source62-e4-${phase}-table" data-phase="${phase}" ${attributes} ${normal}><tbody>${rows.map(([label, value]) => `<tr>${label ? `<th scope="row" ${normal}>${esc(label)}</th>` : ""}<td ${normal}>${value}</td></tr>`).join("")}</tbody></table>`;
  const finalRemainder = (dividend, divisorText, places) => {
    const result = divide(dividend, unit(divisorText), places);
    return { ...result, solution: `몫을 소수 ${places === 1 ? "첫째" : "둘째"} 자리까지 구하면 ${math(result.quotient)}입니다. 나머지는 ${math(`${fmt(dividend)}-${divisorText}×${result.quotient}`)}으로 계산하여 ${math(result.remainderText)}입니다.` };
  };
  const uniqueExtreme = (candidates, chooseMaximum) => {
    check(candidates.length > 0, "조건을 만족하는 후보가 없습니다.");
    const selected = candidates.reduce((best, current) => (chooseMaximum ? current.dividend > best.dividend : current.dividend < best.dividend) ? current : best);
    check(candidates.filter(candidate => candidate.dividend === selected.dividend).length === 1, "최소 또는 최대 후보는 하나여야 합니다.");
    return selected;
  };
  const candidateEvidence = candidates => candidates.map(candidate => ({ quotient: candidate.quotient, dividend: fmt(candidate.dividend) }));

  // The fixed remainder determines the original dividend for each finite quotient tick.
  const roundedCandidates = (divisor, remainder, places, target, roundedPlaces) => {
    positive(divisor, target);
    check(remainder >= 0n && remainder * scale(places) < divisor, "주어진 나머지는 다음 몫 한 칸보다 작아야 합니다.");
    check(places > roundedPlaces, "후보 몫은 반올림 자리보다 더 길어야 합니다.");
    const high = (target + 1n) * scale(places - roundedPlaces);
    const candidates = [];
    for (let ticks = 0n; ticks <= high; ticks += 1n) {
      const dividend = product(divisor, ticks, places) + remainder;
      if (dividend <= 0n || round(dividend, divisor, roundedPlaces) !== target) continue;
      const result = divide(dividend, divisor, places);
      check(result.ticks === ticks && result.remainder === remainder, "후보를 원래 조건에 되넣은 결과가 다릅니다.");
      candidates.push({ dividend, quotient: result.quotient });
    }
    return candidates;
  };

  const additionDefinition = (suffix, places, pools, original) => ({
    suffix, key: `sourceGrade6DecimalE4${suffix === "example-2" ? "Example2" : "Mission4"}`,
    pools, source: original, steps: [2, 3, 4],
    designs: ["next-exact-quotient-given", "source-next-exact-quotient-and-minimum-addition", "reconstruct-dividend-before-minimum-addition"],
    build([dividendText, divisorText, added], level) {
      const dividend = unit(dividendText), divisor = unit(divisorText), addend = unit(added);
      positive(dividend, divisor, addend);
      const first = dividend * scale(places) / divisor, candidates = [];
      // Below this tick the exact dividend is too small; above it additions grow strictly.
      for (let ticks = first; ticks <= first + 1n; ticks += 1n) {
        const exactDividend = product(divisor, ticks, places);
        if (exactDividend >= dividend) candidates.push({ dividend: exactDividend, quotient: decimal(ticks, places) });
      }
      const selected = uniqueExtreme(candidates, false), addition = selected.dividend - dividend;
      const result = divide(selected.dividend, divisor, places);
      check(result.remainder === 0n, "더한 뒤 나머지는 0이어야 합니다.");
      check(selected.dividend - product(divisor, 1n, places) < dividend, "더 작은 양으로도 나누어떨어집니다.");
      const place = places === 1 ? "첫째" : "둘째";
      const expression = `${level === 2 ? `(${fmt(dividend + addend)}-${added})` : dividendText}÷${divisorText}`;
      const prompt = level === 0
        ? `${dividendText}에 어떤 수를 더한 뒤 ${divisorText}로 나누면 몫이 ${selected.quotient}이고 나머지가 없습니다. 더한 수를 구하세요.`
        : `${math(expression)}의 몫이 소수 ${place} 자리에서 나누어떨어지도록 나누어지는 수에 어떤 수를 더하려고 합니다. 더할 수 있는 가장 작은 수를 구하세요.`;
      const reconstruction = level === 2 ? `나누어지는 수는 ${math(`${fmt(dividend + addend)}-${added}=${dividendText}`)}입니다. ` : "";
      const smallest = level === 0 ? "" : `소수 ${place} 자리까지 나누어떨어지는 가장 작은 몫은 ${math(selected.quotient)}입니다. `;
      const answer = fmt(addition);
      return { prompt, answer, solution: `${reconstruction}${smallest}나머지가 없는 나누어지는 수는 ${math(`${divisorText}×${selected.quotient}=${fmt(selected.dividend)}`)}입니다. 더할 수는 ${math(`${fmt(selected.dividend)}-${dividendText}=${answer}`)}입니다.`,
        rows: [["나누어떨어지는 몫", selected.quotient], ["답", answer]],
        exactValues: { dividend: dividendText, divisor: divisorText, decimalPlaces: places,
          nextExactQuotient: selected.quotient, exactDividend: fmt(selected.dividend), addition: answer,
          candidateEnumeration: candidateEvidence(candidates), extremeCandidateCount: 1 } };
    }
  });

  const definitions = [
    {
      suffix: "exploration-1", key: "sourceGrade6DecimalE4Exploration1",
      pools: [["24.64", "3.75", "8"], ["31.82", "4.2", "10"], ["19.57", "2.6", "6"]],
      designs: ["ring-count-given-find-leftover", "source-whole-ring-count-and-leftover", "combine-two-gold-amounts-before-ring-count"], steps: [1, 2, 3],
      source: source(24, { goldG: "24.64", perRingG: "3.75" }, "만들 수 있는 반지의 최대 개수와 남는 금의 무게", "6개, 2.14g", "6개, 2.14g"),
      build([goldText, ringText, otherText], level) {
        const gold = unit(goldText), ring = unit(ringText), other = unit(otherText);
        positive(gold - other, ring, other);
        const result = divide(gold, ring, 0), count = String(result.ticks);
        const prompt = level === 0
          ? `금 ${goldText}g으로 반지 ${count}개를 만들었습니다. 반지 한 개에는 금 ${ringText}g이 들어갑니다. 남는 금은 몇 g인가요?`
          : `금 ${ringText}g으로 반지 한 개를 만듭니다. ${level === 1 ? `금 ${goldText}g으로` : `금 ${fmt(gold - other)}g과 ${otherText}g을 합하여`} 반지를 몇 개까지 만들 수 있나요? 그리고 남는 금은 몇 g인가요?`;
        const reconstruction = level === 2 ? `금의 전체 무게는 ${math(`${fmt(gold - other)}+${otherText}=${goldText}`)}g입니다. ` : "";
        const whole = level === 0 ? "" : `반지를 ${count}개 만들면 금 ${fmt(product(ring, result.ticks, 0))}g을 쓰며, ${result.ticks + 1n}개에는 ${fmt(product(ring, result.ticks + 1n, 0))}g이 필요하여 부족합니다. `;
        const answer = level === 0 ? `${result.remainderText}g` : `${count}개, ${result.remainderText}g`;
        return { prompt, answer, solution: `${reconstruction}${whole}남는 금은 ${math(`${goldText}-${ringText}×${count}`)}으로 계산하여 ${result.remainderText}g입니다.`,
          rows: [...(level === 0 ? [] : [["반지", `${count}개`]]), ["남는 금", `${result.remainderText}g`]],
          exactValues: { goldG: goldText, perRingG: ringText, ringCount: count, remainderG: result.remainderText } };
      }
    },
    {
      suffix: "exploration-2", key: "sourceGrade6DecimalE4Exploration2",
      pools: [["7.13", "2.47", "0.5"], ["5.24", "3.68", "0.4"], ["8.36", "1.59", "0.6"]],
      designs: ["minimum-dividend-given", "source-zero-hundredth-remainder-attains-minimum", "derive-divisor-before-minimum-remainder"], steps: [2, 4, 5],
      source: source(24, { divisor: "7.13", truncatedHundredths: "2.47" }, "몫을 소수 첫째 자리까지 구할 때 가능한 가장 작은 나머지", "0.4991", null, false, null),
      build([divisorText, quotientText, part], level) {
        const divisor = unit(divisorText), quotientTicks = unit(quotientText) / 10000n;
        check(unit(quotientText) % 10000n === 0n, "몫은 소수 둘째 자리까지여야 합니다.");
        const minimumDividend = product(divisor, quotientTicks, 2), split = splitDivisor(divisorText, part);
        const result = finalRemainder(minimumDividend, divisorText, 1);
        const upper = product(divisor, quotientTicks + 1n, 2);
        check(divide(minimumDividend, divisor, 2).remainder === 0n, "최소 나누어지는 수의 둘째 자리 나머지는 0입니다.");
        check(result.ticks === quotientTicks / 10n && upper > minimumDividend, "몫과 최소값의 범위가 잘못되었습니다.");
        const prompt = level === 0
          ? `${fmt(minimumDividend)}를 ${divisorText}로 나누어 몫을 소수 첫째 자리까지 구할 때 나머지를 구하세요.`
          : `어떤 수를 ${level === 2 ? split.words : divisorText}로 나누어 몫을 소수 둘째 자리까지 구하면 ${quotientText}입니다. 몫을 소수 첫째 자리까지 구할 때, 나머지가 될 수 있는 수 중 가장 작은 수를 구하세요.`;
        const minimum = level === 0 ? "" : `소수 둘째 자리까지 구한 나머지가 0일 때 어떤 수가 가장 작습니다. 이때 어떤 수는 ${math(`${divisorText}×${quotientText}=${fmt(minimumDividend)}`)}입니다. 그보다 큰 수는 첫째 자리까지의 몫이 같고 나머지만 더 커집니다. `;
        return { prompt, answer: result.remainderText, solution: `${level === 2 ? split.solution : ""}${minimum}${result.solution}`,
          rows: [["가장 작은 어떤 수", fmt(minimumDividend)], ["답", result.remainderText]],
          exactValues: { divisor: divisorText, truncatedHundredths: quotientText, minimumDividend: fmt(minimumDividend),
            dividendUpperExclusive: fmt(upper), hundredthRemainderAtMinimum: "0", truncatedTenths: result.quotient,
            minimumRemainder: result.remainderText, minimumAttained: true, monotonicRemainder: true } };
      }
    },
    {
      suffix: "example-1", key: "sourceGrade6DecimalE4Example1",
      pools: [[["3685", "368.5", "36.85"], "6.5", "2"], [["2478", "247.8", "24.78"], "4.3", "1"], [["1597", "159.7", "15.97"], "3.2", "1"]],
      designs: ["three-whole-quotients-given", "source-three-whole-quotients-and-remainders", "derive-shared-divisor-before-three-divisions"], steps: [3, 6, 7],
      source: source(24, { dividends: ["3685", "368.5", "36.85"], divisor: "6.5" }, "세 식의 자연수 부분까지의 몫과 나머지", "566, 6; 56, 4.5; 5, 4.35", "첫 식은 희미함; 둘째 56, 4.5; 셋째 5, 4.35", false, null,
        [{ row: 1, reading: "566, 6으로 희미하게 보임", confirmed: false, status: "faint" },
          { row: 2, reading: "56, 4.5", confirmed: true, status: "legible" },
          { row: 3, reading: "5, 4.35", confirmed: true, status: "legible" }]),
      build([dividendTexts, divisorText, part], level) {
        const divisor = unit(divisorText), split = splitDivisor(divisorText, part);
        const results = dividendTexts.map(text => divide(unit(text), divisor, 0));
        const expressions = dividendTexts.map((text, index) => ["", math(`${text}÷${level === 2 ? split.expression : divisorText}=${level === 0 ? results[index].quotient : "□"} … □`)]);
        const prompt = `${level === 2 ? `나누는 수는 ${split.words}입니다. ` : ""}${level === 0 ? '다음 식에서 나머지를 각각 <span class="source62-e4-command">구하세요.</span>' : '다음 나눗셈의 몫을 자연수 부분까지 구하고 나머지를 <span class="source62-e4-command">구하세요.</span>'}${table(expressions, "problem")}`;
        const answer = level === 0 ? results.map(result => result.remainderText).join(", ") : results.map(result => `${result.quotient}, ${result.remainderText}`).join("; ");
        const solution = results.map((result, index) => `${dividendTexts[index]}의 몫은 ${result.quotient}이고, 나머지는 ${math(`${dividendTexts[index]}-${divisorText}×${result.quotient}`)}으로 계산하여 ${result.remainderText}입니다.`).join(" ");
        return { prompt, answer, solution: `${level === 2 ? split.solution : ""}${solution}`,
          rows: results.map((result, index) => [dividendTexts[index], level === 0 ? `나머지 ${result.remainderText}` : `몫 ${result.quotient}, 나머지 ${result.remainderText}`]),
          exactValues: { divisor: divisorText, decimalPlaces: 0, divisions: results.map((result, index) => ({ dividend: dividendTexts[index], quotient: result.quotient, remainder: result.remainderText })) } };
      }
    },
    additionDefinition("example-2", 1, [["4.88", "2.75", "1"], ["5.16", "3.2", "1"], ["7.34", "4.1", "1"]],
      source(24, { dividend: "4.88", divisor: "2.75", exactQuotientPlaces: 1 }, "몫이 소수 첫째 자리에서 나누어떨어지게 더할 가장 작은 수", "0.07", "0.07 또는 0.007; 덧그림 때문에 확정 불가", false, null)),
    {
      suffix: "example-3", key: "sourceGrade6DecimalE4Example3",
      pools: [["2.6", "0.02", "3.5", "1.4", "0.5"], ["3.4", "0.03", "2.8", "1.6", "0.5"], ["4.2", "0.04", "1.9", "1.3", "0.5"]],
      designs: ["minimum-original-dividend-given", "source-smallest-dividend-from-remainder-and-rounding", "derive-first-divisor-before-smallest-dividend"], steps: [2, 5, 6],
      source: source(24, { firstDivisor: "2.6", hundredthRemainder: "0.02", roundedTenths: "3.5", secondDivisor: "1.4" }, "조건을 만족하는 가장 작은 수를 1.4로 나누어 둘째 자리까지 구한 나머지", "0.002", "0.002"),
      build([divisorText, remainderText, roundedText, secondText, part], level) {
        const divisor = unit(divisorText), remainder = unit(remainderText), target = unit(roundedText) / 100000n;
        check(unit(roundedText) % 100000n === 0n, "반올림한 몫은 소수 첫째 자리까지여야 합니다.");
        const candidates = roundedCandidates(divisor, remainder, 2, target, 1), selected = uniqueExtreme(candidates, false);
        const result = finalRemainder(selected.dividend, secondText, 2), split = splitDivisor(divisorText, part);
        const prompt = level === 0
          ? `${fmt(selected.dividend)}를 ${secondText}로 나누어 몫을 소수 둘째 자리까지 구했을 때의 나머지를 구하세요.`
          : `어떤 수를 ${level === 2 ? split.words : divisorText}로 나눈 몫을 소수 둘째 자리까지 구했을 때의 나머지는 ${remainderText}이고, 몫을 반올림하여 소수 첫째 자리까지 나타내면 ${roundedText}가 됩니다. 어떤 수 중 가장 작은 수를 ${secondText}로 나누어 몫을 소수 둘째 자리까지 구했을 때의 나머지를 구하세요.`;
        const minimum = level === 0 ? "" : `반올림하여 ${roundedText}가 되는 몫은 ${decimal(target * 10n - 5n, 2)} 이상 ${decimal(target * 10n + 5n, 2)} 미만입니다. 주어진 나머지를 포함하여 되넣어 확인하면, 조건을 만족하는 둘째 자리까지의 몫은 ${candidates[0].quotient}부터 ${candidates[candidates.length - 1].quotient}까지입니다. 가장 작은 몫은 ${selected.quotient}이므로 가장 작은 어떤 수는 ${math(`${divisorText}×${selected.quotient}+${remainderText}`)}으로 계산하여 ${fmt(selected.dividend)}입니다. `;
        return { prompt, answer: result.remainderText, solution: `${level === 2 ? split.solution : ""}${minimum}${result.solution}`,
          rows: [["가장 작은 어떤 수", fmt(selected.dividend)], ["새 나눗셈의 몫", result.quotient], ["답", result.remainderText]],
          exactValues: { firstDivisor: divisorText, hundredthRemainder: remainderText, roundedTenths: roundedText, secondDivisor: secondText,
            candidateEnumeration: candidateEvidence(candidates), extremeCandidateCount: 1, minimumDividend: fmt(selected.dividend),
            selectedHundredths: selected.quotient, newQuotient: result.quotient, newRemainder: result.remainderText } };
      }
    },
    {
      suffix: "mission-1", key: "sourceGrade6DecimalE4Mission1",
      pools: [
        [["3.5", "2.9"], ["12.28", "0.15"], ["15.01", "5.31"], ["8.8", "6.23"]],
        [["4.2", "3.1"], ["9.7", "0.23"], ["12.4", "4.7"], ["7.6", "5.9"]],
        [["5.94", "4.3"], ["11.29", "0.17"], ["17.08", "6.2"], ["9.1", "6.7"]]
      ],
      designs: ["four-truncated-tenths-quotients-given", "source-four-remainders-and-descending-order", "reconstruct-first-dividend-before-four-remainders"], steps: [5, 9, 10],
      source: source(25, { expressions: [["3.5", "2.9"], ["12.28", "0.15"], ["15.01", "5.31"], ["8.8", "6.23"]], decimalPlaces: 1 }, "소수 첫째 자리까지 구한 나머지가 큰 순서", "ㄷ, ㄹ, ㄱ, ㄴ", "ㄷ, ㄹ, ㄱ, ㄴ"),
      build(pairs, level) {
        const labels = ["ㄱ", "ㄴ", "ㄷ", "ㄹ"], results = pairs.map(([a, d]) => divide(unit(a), unit(d), 1));
        check(new Set(results.map(result => result.remainderText)).size === 4, "나머지가 같으면 순서를 하나로 정할 수 없습니다.");
        const ordered = labels.map((label, index) => ({ label, index, remainder: results[index].remainder })).sort((a, b) => a.remainder > b.remainder ? -1 : 1);
        const expressions = pairs.map(([a, d], index) => [labels[index], math(`${level === 2 && index === 0 ? `(${fmt(unit(a) - unit("0.5"))}+0.5)` : a}÷${d}${level === 0 ? `=${results[index].quotient} … □` : ""}`)]);
        const prompt = `다음 나눗셈의 몫을 소수 첫째 자리까지 구했을 때, 나머지가 큰 순서대로 기호를 쓰세요.${table(expressions, "problem")}`;
        const reconstruction = level === 2 ? `ㄱ의 나누어지는 수는 ${math(`${fmt(unit(pairs[0][0]) - unit("0.5"))}+0.5=${pairs[0][0]}`)}입니다. ` : "";
        const answer = ordered.map(item => item.label).join(", ");
        const calculations = pairs.map(([a, d], index) => `${labels[index]}의 몫은 ${results[index].quotient}이며, 나머지는 ${math(`${a}-${d}×${results[index].quotient}`)}으로 계산하여 ${results[index].remainderText}입니다.`).join(" ");
        return { prompt, answer, solution: `${reconstruction}${calculations}나머지를 큰 순서대로 비교하면 ${answer}입니다.`,
          rows: [...labels.map((label, index) => [label, `나머지 ${results[index].remainderText}`]), ["답", answer]],
          exactValues: { decimalPlaces: 1, divisions: pairs.map(([a, d], index) => ({ label: labels[index], dividend: a, divisor: d, quotient: results[index].quotient, remainder: results[index].remainderText })), descendingLabels: ordered.map(item => item.label), distinctRemainderCount: 4 } };
      }
    },
    {
      suffix: "mission-2", key: "sourceGrade6DecimalE4Mission2",
      pools: [["13.7", "1.26", "0.5"], ["9.4", "2.37", "0.5"], ["11.6", "3.48", "0.6"]],
      designs: ["original-dividend-given", "source-exact-quotient-to-tenths-remainder", "derive-divisor-before-exact-quotient-reconstruction"], steps: [2, 3, 4],
      source: source(25, { divisor: "13.7", exactQuotient: "1.26" }, "몫을 소수 첫째 자리까지 구했을 때의 나머지", "0.822", "0.822와 1.192가 모두 남아 있음", false, null,
        [{ reading: "0.822", confirmed: true, status: "visible" },
          { reading: "1.192", confirmed: true, status: "visible-not-cancelled" }]),
      build([divisorText, quotientText, part], level) {
        const divisor = unit(divisorText), quotientTicks = unit(quotientText) / 10000n;
        const dividend = product(divisor, quotientTicks, 2), result = finalRemainder(dividend, divisorText, 1), split = splitDivisor(divisorText, part);
        check(unit(quotientText) % 10000n === 0n && divide(dividend, divisor, 2).remainder === 0n, "주어진 몫은 정확한 몫이어야 합니다.");
        const prompt = level === 0
          ? `${fmt(dividend)}를 ${divisorText}로 나누어 몫을 소수 첫째 자리까지 구할 때 나머지를 구하세요.`
          : `어떤 수를 ${level === 2 ? split.words : divisorText}로 나눈 몫은 ${quotientText}이고 나머지가 없습니다. 어떤 수를 ${level === 2 ? "처음과 같은 나누는 수" : divisorText}로 나누어 몫을 소수 첫째 자리까지 구할 때 나머지를 구하세요.`;
        const original = level === 0 ? "" : `어떤 수는 ${math(`${divisorText}×${quotientText}=${fmt(dividend)}`)}입니다. `;
        return { prompt, answer: result.remainderText, solution: `${level === 2 ? split.solution : ""}${original}${result.solution}`,
          rows: [["어떤 수", fmt(dividend)], ["답", result.remainderText]],
          exactValues: { divisor: divisorText, exactQuotient: quotientText, dividend: fmt(dividend), truncatedTenths: result.quotient, remainder: result.remainderText } };
      }
    },
    {
      suffix: "mission-3", key: "sourceGrade6DecimalE4Mission3",
      pools: [["2.9", "5", "2.8", "4.2", "0.5"], ["3.6", "4", "2.6", "3.8", "0.5"], ["4.7", "3", "1.9", "2.6", "0.5"]],
      designs: ["original-dividend-given", "source-whole-quotient-and-remainder-reconstruction", "derive-first-divisor-before-reconstruction"], steps: [2, 4, 5],
      source: source(25, { firstDivisor: "2.9", wholeQuotient: "5", wholeRemainder: "2.8", secondDivisor: "4.2" }, "어떤 수를 4.2로 나누어 몫을 소수 첫째 자리까지 구한 나머지", "0.08", "0.08"),
      build([divisorText, wholeText, remainderText, secondText, part], level) {
        check(/^\d+$/.test(wholeText), "자연수 부분의 몫은 정수여야 합니다.");
        const divisor = unit(divisorText), whole = BigInt(wholeText), remainder = unit(remainderText);
        check(remainder >= 0n && remainder < divisor, "자연수 부분까지 구한 나머지는 나누는 수보다 작아야 합니다.");
        const dividend = divisor * whole + remainder, result = finalRemainder(dividend, secondText, 1), split = splitDivisor(divisorText, part);
        const prompt = level === 0
          ? `${fmt(dividend)}를 ${secondText}로 나누어 몫을 소수 첫째 자리까지 구했을 때의 나머지를 구하세요.`
          : `어떤 수를 ${level === 2 ? split.words : divisorText}로 나누어 몫을 자연수 부분까지 구했더니 몫은 ${wholeText}이고 나머지는 ${remainderText}였습니다. 어떤 수를 ${secondText}로 나누어 몫을 소수 첫째 자리까지 구했을 때의 나머지를 구하세요.`;
        const reconstruction = level === 0 ? "" : `어떤 수는 ${math(`${divisorText}×${wholeText}+${remainderText}`)}으로 계산하여 ${fmt(dividend)}입니다. `;
        return { prompt, answer: result.remainderText, solution: `${level === 2 ? split.solution : ""}${reconstruction}${result.solution}`,
          rows: [["어떤 수", fmt(dividend)], ["새 나눗셈의 몫", result.quotient], ["답", result.remainderText]],
          exactValues: { firstDivisor: divisorText, wholeQuotient: wholeText, wholeRemainder: remainderText, secondDivisor: secondText, dividend: fmt(dividend), newQuotient: result.quotient, newRemainder: result.remainderText } };
      }
    },
    additionDefinition("mission-4", 2, [["1.36", "0.75", "0.5"], ["2.16", "1.25", "0.5"], ["3.27", "1.6", "0.4"]],
      source(25, { dividend: "1.36", divisor: "0.75", exactQuotientPlaces: 2 }, "몫이 소수 둘째 자리에서 나누어떨어지게 더한 가장 작은 수", "0.005", "0.005 (위 필기는 지워짐)")),
    {
      suffix: "mission-5", key: "sourceGrade6DecimalE4Mission5",
      pools: [["3", "0.1", "7", "5", "0.5"], ["4", "0.2", "6", "3.4", "0.5"], ["2.5", "0.15", "5", "4.2", "0.5"]],
      designs: ["maximum-original-dividend-given", "source-largest-dividend-from-remainder-and-whole-rounding", "derive-first-divisor-before-largest-dividend"], steps: [2, 5, 6],
      source: source(25, { firstDivisor: "3", tenthRemainder: "0.1", roundedWhole: "7", secondDivisor: "5" }, "조건을 만족하는 가장 큰 수를 5로 나누어 첫째 자리까지 구한 나머지", "0.3", "0.3"),
      build([divisorText, remainderText, wholeText, secondText, part], level) {
        check(/^\d+$/.test(wholeText), "반올림한 자연수는 정수여야 합니다.");
        const divisor = unit(divisorText), remainder = unit(remainderText), target = BigInt(wholeText);
        const candidates = roundedCandidates(divisor, remainder, 1, target, 0), selected = uniqueExtreme(candidates, true);
        const result = finalRemainder(selected.dividend, secondText, 1), split = splitDivisor(divisorText, part);
        const prompt = level === 0
          ? `${fmt(selected.dividend)}를 ${secondText}로 나누어 몫을 소수 첫째 자리까지 구했을 때의 나머지를 구하세요.`
          : `어떤 수를 ${level === 2 ? split.words : divisorText}로 나누어 몫을 소수 첫째 자리까지 구하면 ${remainderText}이 남습니다. 또, 몫을 반올림하여 자연수까지 나타내면 ${wholeText}이 됩니다. 어떤 수 중에서 가장 큰 수를 ${secondText}로 나누어 몫을 소수 첫째 자리까지 구했을 때의 나머지를 구하세요.`;
        const maximum = level === 0 ? "" : `반올림하여 ${wholeText}이 되는 몫은 ${decimal(target * 10n - 5n, 1)} 이상 ${decimal(target * 10n + 5n, 1)} 미만입니다. 주어진 나머지를 포함하여 되넣어 확인하면, 조건을 만족하는 첫째 자리까지의 몫은 ${candidates[0].quotient}부터 ${candidates[candidates.length - 1].quotient}까지입니다. 가장 큰 몫은 ${selected.quotient}이므로 가장 큰 어떤 수는 ${math(`${divisorText}×${selected.quotient}+${remainderText}`)}으로 계산하여 ${fmt(selected.dividend)}입니다. `;
        return { prompt, answer: result.remainderText, solution: `${level === 2 ? split.solution : ""}${maximum}${result.solution}`,
          rows: [["가장 큰 어떤 수", fmt(selected.dividend)], ["새 나눗셈의 몫", result.quotient], ["답", result.remainderText]],
          exactValues: { firstDivisor: divisorText, tenthRemainder: remainderText, roundedWhole: wholeText, secondDivisor: secondText,
            candidateEnumeration: candidateEvidence(candidates), extremeCandidateCount: 1, maximumDividend: fmt(selected.dividend),
            selectedTenths: selected.quotient, newQuotient: result.quotient, newRemainder: result.remainderText } };
      }
    },
    {
      suffix: "mission-6", key: "sourceGrade6DecimalE4Mission6",
      pools: [["2.11", "0.0186", "2.55", "0.5"], ["3.17", "0.0225", "1.84", "0.5"], ["1.83", "0.0124", "3.27", "0.5"]],
      designs: ["truncated-hundredths-quotient-given", "source-truncate-three-then-round-two-to-reconstruct", "derive-divisor-before-two-stage-quotient-inference"], steps: [2, 4, 5],
      source: source(25, { divisor: "2.11", hundredthRemainder: "0.0186", truncatedPlacesBeforeRounding: 3, roundedHundredths: "2.55" }, "둘째 자리 나머지와 셋째 자리 몫의 반올림으로 어떤 수 구하기", "5.378", "5.378 (위 필기는 지워짐)"),
      build([divisorText, remainderText, targetText, part], level) {
        const divisor = unit(divisorText), remainder = unit(remainderText), target = unit(targetText) / 10000n;
        check(unit(targetText) % 10000n === 0n, "반올림한 몫은 소수 둘째 자리까지여야 합니다.");
        check(remainder >= 0n && remainder * 100n < divisor, "둘째 자리까지 구한 나머지 범위가 잘못되었습니다.");
        const candidates = [];
        for (let ticks = 0n; ticks <= target + 1n; ticks += 1n) {
          const dividend = product(divisor, ticks, 2) + remainder;
          if (dividend <= 0n) continue;
          const third = divide(dividend, divisor, 3);
          if ((third.ticks + 5n) / 10n !== target) continue;
          const second = divide(dividend, divisor, 2);
          check(second.ticks === ticks && second.remainder === remainder, "어떤 수를 둘째 자리 조건에 되넣으면 일치해야 합니다.");
          candidates.push({ dividend, quotient: second.quotient, truncatedThousandths: third.quotient });
        }
        check(candidates.length === 1, "두 자리 조건을 모두 만족하는 어떤 수는 하나여야 합니다.");
        const selected = candidates[0], split = splitDivisor(divisorText, part), answer = fmt(selected.dividend);
        const tail = divide(remainder, divisor, 3), carry = (tail.ticks + 5n) / 10n;
        check(unit(selected.quotient) / 10000n + carry === target, "나머지에서 찾은 반올림 변화가 일치하지 않습니다.");
        const prompt = level === 0
          ? `어떤 수를 ${divisorText}로 나누어 몫을 소수 둘째 자리까지 구하면 몫은 ${selected.quotient}이고 나머지는 ${remainderText}입니다. 어떤 수를 구하세요.`
          : `어떤 수를 ${level === 2 ? split.words : divisorText}로 나누어 몫을 소수 둘째 자리까지 구했더니 나머지가 ${remainderText}이었습니다. 소수 셋째 자리까지 구한 몫을 반올림하여 소수 둘째 자리까지 나타냈더니 ${targetText}가 되었습니다. 어떤 수를 구하세요.`;
        const inference = level === 0 ? "" : `둘째 자리 뒤로 이어지는 부분은 ${math(`${remainderText}÷${divisorText}`)}입니다. 이 부분을 소수 셋째 자리까지 구하면 ${tail.quotient}입니다. 소수 셋째 자리 숫자가 ${tail.ticks}이므로 반올림할 때 둘째 자리 숫자가 ${carry === 1n ? "1 커집니다" : "그대로입니다"}. 따라서 둘째 자리까지 구한 몫은 ${math(`${targetText}-${decimal(carry, 2)}=${selected.quotient}`)}이고, 셋째 자리까지의 몫은 ${selected.truncatedThousandths}입니다. `;
        return { prompt, answer, solution: `${level === 2 ? split.solution : ""}${inference}어떤 수는 ${math(`${divisorText}×${selected.quotient}+${remainderText}`)}으로 계산하여 ${answer}입니다.`,
          rows: [["소수 둘째 자리까지의 몫", selected.quotient], ...(level === 0 ? [] : [["소수 셋째 자리까지의 몫", selected.truncatedThousandths]]), ["답", answer]],
          exactValues: { divisor: divisorText, hundredthRemainder: remainderText, roundedHundredths: targetText,
            truncatedHundredths: selected.quotient, truncatedThousandths: selected.truncatedThousandths,
            remainderQuotientThousandths: tail.quotient, roundingCarryHundredths: String(carry),
            candidateEnumeration: candidateEvidence(candidates), candidateCount: 1, dividend: answer } };
      }
    }
  ];

  for (const definition of definitions) {
    check(definition.pools.length === 3 && new Set(definition.pools.map(pool => JSON.stringify(pool))).size === 3, "세 고정 풀의 조건은 서로 달라야 합니다.");
    check(definition.steps[0] < definition.steps[1] && definition.steps[1] < definition.steps[2], "난이도별 풀이 단계 수가 늘어나야 합니다.");
    definition.sourceItemId = `6-2-u2-e4-${definition.suffix}`;
    definition.generatorKey = definition.key;
  }
  freeze(definitions);
  const byId = new Map(definitions.map(definition => [definition.sourceItemId, definition]));
  const byKey = new Map(definitions.map(definition => [definition.key, definition]));
  const resolve = type => type?.sourceItemId ? byId.get(type.sourceItemId) : byKey.get(type?.generatorKey);
  const originalKey = api.generatorKey, originalGenerate = api.generate;
  api.generatorKey = type => {
    const definition = resolve(type);
    return definition ? (type.reviewLocked ? "" : definition.key) : originalKey(type);
  };
  api.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => {
    const definition = resolve(type);
    if (!definition) return originalGenerate(type, levelRank, difficultyOffset, seed, variant);
    if (type.reviewLocked) return null;
    check(Number.isSafeInteger(variant) && variant >= 0, "고정 변형 번호는 영 이상의 안전한 정수여야 합니다.");
    const offset = difficultyOffset ?? 0;
    check([-1, 0, 1].includes(offset), "난이도는 -1, 0, +1이어야 합니다.");
    const level = offset + 1, poolIndex = variant % 3, difficultyDesign = definition.designs[level];
    const item = definition.build(definition.pools[poolIndex], level), sourceItemId = definition.sourceItemId;
    return {
      prompt: item.prompt, answer: item.answer, solution: item.solution,
      answerVisual: table(item.rows.map(([label, value]) => [label, esc(value)]), "answer", `data-answer-source="${sourceItemId}" data-print-weight="compact" data-verified-pool-index="${poolIndex}" data-difficulty-design="${difficultyDesign}"`),
      sourceItemId, generator: definition.key, generationMode: "fixed-verified-pool",
      verifiedPoolIndex: poolIndex, verifiedVariantCount: 3, verifiedVariantTarget: 3,
      verifiedVariantId: `${sourceItemId}:v${poolIndex}`, variantProvenance: poolIndex === 0 && level === 1 ? "source-values" : "source-structure-variant",
      difficultyDesign, difficultyLevel: level, difficultyRank: level, difficultyOffset: offset, levelRank,
      sourceDifficultyRank: 1, reasoningSteps: definition.steps[level], sourceStepCount: definition.steps[1],
      difficultyStepDelta: definition.steps[level] - definition.steps[1],
      sourceEvidence: definition.source, sourceAnswer: definition.source.originalAnswer,
      publisherAnswerVerified: false, handwrittenAnswerVerified: false, exactValues: freeze(item.exactValues)
    };
  };
  if (Array.isArray(api.names)) for (const { key } of definitions) if (!api.names.includes(key)) api.names.push(key);
  window.HSE_SOURCE_GRADE6_DECIMAL_E4 = freeze({ definitions,
    sourceItemIds: definitions.map(definition => definition.sourceItemId),
    excludedSourceItems: [{ sourceItemId: "6-2-u2-e4-example-4", reason: "handwriting-conflict-requires-integrator-review" }],
    registrationOnly: true, publisherAnswerVerified: false });
})();
