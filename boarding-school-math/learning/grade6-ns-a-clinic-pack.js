(function (root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.GFIELDGrade6NSAClinicPack = value;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function tr(ko, en, zhHans) { return Object.freeze({ ko: ko, en: en, "zh-Hans": zhHans }); }
  function freeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { freeze(value[key]); });
    return Object.freeze(value);
  }
  function gcd(left, right) {
    let a = left < 0n ? -left : left; let b = right < 0n ? -right : right;
    while (b) { const next = a % b; a = b; b = next; }
    return a || 1n;
  }
  function rational(numerator, denominator) {
    const n = BigInt(numerator); const d = BigInt(denominator);
    if (d === 0n) throw new Error("NSA_RATIONAL_ZERO_DENOMINATOR");
    const sign = d < 0n ? -1n : 1n; const divisor = gcd(n, d);
    return Object.freeze({ numerator: sign * n / divisor, denominator: (d < 0n ? -d : d) / divisor });
  }
  function fraction(numerator, denominator) { return Object.freeze({ numerator: numerator, denominator: denominator }); }
  function item(definition) { return freeze(definition); }

  const WORKBOOK_ITEMS = [
    item({ id: "ns-w01", section: "models", strand: "unit-fraction-count", level: "foundation", kind: "groups-in-quantity", responseFormat: "fraction-or-whole", prompt: tr("3/4 안에는 1/8이 몇 개 들어갑니까?", "How many groups of 1/8 are in 3/4?", "3/4里面有多少个1/8？"), data: { dividend: fraction(3, 4), divisor: fraction(1, 8) }, unit: tr("개", "groups", "个"), errorCode: "divisor-meaning-lost" }),
    item({ id: "ns-w02", section: "models", strand: "unit-fraction-count", level: "foundation", kind: "groups-in-quantity", responseFormat: "fraction-or-whole", prompt: tr("2/3 안에는 1/6이 몇 개 들어갑니까?", "How many groups of 1/6 are in 2/3?", "2/3里面有多少个1/6？"), data: { dividend: fraction(2, 3), divisor: fraction(1, 6) }, unit: tr("개", "groups", "个"), errorCode: "divisor-meaning-lost" }),
    item({ id: "ns-w03", section: "models", strand: "unit-fraction-count", level: "core", kind: "groups-in-quantity", responseFormat: "fraction-or-whole", prompt: tr("5/6 안에는 1/12이 몇 개 들어갑니까?", "How many groups of 1/12 are in 5/6?", "5/6里面有多少个1/12？"), data: { dividend: fraction(5, 6), divisor: fraction(1, 12) }, unit: tr("개", "groups", "个"), errorCode: "divisor-meaning-lost" }),
    item({ id: "ns-w04", section: "models", strand: "fraction-computation", level: "advanced", kind: "divide-fractions", responseFormat: "fraction-or-whole", prompt: tr("9/4 ÷ 3/8을 계산하세요.", "Calculate 9/4 ÷ 3/8.", "计算9/4 ÷ 3/8。"), data: { dividend: fraction(9, 4), divisor: fraction(3, 8) }, unit: tr("", "", ""), errorCode: "reciprocal-order" }),
    item({ id: "ns-w05", section: "compute", strand: "fraction-computation", level: "core", kind: "divide-fractions", responseFormat: "simplest-fraction", prompt: tr("5/6 ÷ 2/3을 기약분수로 나타내세요.", "Write 5/6 ÷ 2/3 as a fraction in simplest form.", "把5/6 ÷ 2/3写成最简分数。"), data: { dividend: fraction(5, 6), divisor: fraction(2, 3) }, unit: tr("", "", ""), errorCode: "reciprocal-order" }),
    item({ id: "ns-w06", section: "compute", strand: "fraction-computation", level: "core", kind: "divide-fractions", responseFormat: "simplest-fraction", prompt: tr("7/8 ÷ 14/15를 기약분수로 나타내세요.", "Write 7/8 ÷ 14/15 as a fraction in simplest form.", "把7/8 ÷ 14/15写成最简分数。"), data: { dividend: fraction(7, 8), divisor: fraction(14, 15) }, unit: tr("", "", ""), errorCode: "multiplication-not-simplified" }),
    item({ id: "ns-w07", section: "compute", strand: "mixed-number-division", level: "core", kind: "divide-fractions", responseFormat: "fraction-or-whole", prompt: tr("2와 1/4 ÷ 3/5을 계산하세요.", "Calculate 2 1/4 ÷ 3/5.", "计算2又1/4 ÷ 3/5。"), data: { dividend: fraction(9, 4), divisor: fraction(3, 5) }, unit: tr("", "", ""), errorCode: "mixed-number-not-converted" }),
    item({ id: "ns-w08", section: "compute", strand: "fraction-computation", level: "advanced", kind: "divide-fractions", responseFormat: "simplest-fraction", prompt: tr("4/9 ÷ 2/15를 기약분수로 나타내세요.", "Write 4/9 ÷ 2/15 as a fraction in simplest form.", "把4/9 ÷ 2/15写成最简分数。"), data: { dividend: fraction(4, 9), divisor: fraction(2, 15) }, unit: tr("", "", ""), errorCode: "multiplication-not-simplified" }),
    item({ id: "ns-w09", section: "applications", strand: "measurement-division", level: "core", kind: "quantity-per-group", responseFormat: "fraction-or-whole", prompt: tr("1과 1/2 m의 끈을 3/8 m씩 자르면 같은 길이의 조각이 몇 개 나옵니까?", "A 1 1/2 m rope is cut into pieces that are each 3/8 m long. How many pieces are made?", "把1又1/2米长的绳子每3/8米剪成一段，可以剪成多少段？"), data: { dividend: fraction(3, 2), divisor: fraction(3, 8) }, unit: tr("개", "pieces", "段"), errorCode: "unit-interpretation" }),
    item({ id: "ns-w10", section: "applications", strand: "measurement-division", level: "core", kind: "quantity-per-group", responseFormat: "fraction-or-whole", prompt: tr("3/4 kg의 견과류를 한 봉지에 3/20 kg씩 담습니다. 몇 봉지가 필요합니까?", "Three-fourths of a kilogram of nuts is packed in bags of 3/20 kg each. How many bags are needed?", "把3/4千克坚果按每袋3/20千克分装，需要多少袋？"), data: { dividend: fraction(3, 4), divisor: fraction(3, 20) }, unit: tr("봉지", "bags", "袋"), errorCode: "unit-interpretation" }),
    item({ id: "ns-w11", section: "applications", strand: "measurement-division", level: "advanced", kind: "quantity-per-group", responseFormat: "fraction-or-whole", prompt: tr("밀가루 1과 4/5컵이 있습니다. 한 회분에 2/5컵을 쓴다면 전체 밀가루는 몇 회분에 해당합니까?", "There are 1 4/5 cups of flour. If one batch uses 2/5 cup, how many batches' worth of flour is there?", "有1又4/5杯面粉，每份用2/5杯，这些面粉相当于多少份？"), data: { dividend: fraction(9, 5), divisor: fraction(2, 5) }, unit: tr("회분", "batches' worth", "份"), errorCode: "mixed-number-not-converted" }),
    item({ id: "ns-w12", section: "applications", strand: "fraction-rate", level: "advanced", kind: "rate-from-fractions", responseFormat: "fraction-or-whole", prompt: tr("3/8시간 동안 2와 1/4마일을 이동했습니다. 같은 속도라면 한 시간에 몇 마일을 이동합니까?", "A traveler covers 2 1/4 miles in 3/8 hour. At the same speed, how many miles are covered in one hour?", "3/8小时行进2又1/4英里。按相同速度，一小时行进多少英里？"), data: { dividend: fraction(9, 4), divisor: fraction(3, 8) }, unit: tr("마일/시간", "miles per hour", "英里/小时"), errorCode: "unit-interpretation" })
  ];

  const RECHECK_ITEMS = [
    item({ id: "ns-r01", section: "recheck", strand: "unit-fraction-count", level: "core", kind: "groups-in-quantity", responseFormat: "fraction-or-whole", prompt: tr("7/10 안에는 1/20이 몇 개 들어갑니까?", "How many groups of 1/20 are in 7/10?", "7/10里面有多少个1/20？"), data: { dividend: fraction(7, 10), divisor: fraction(1, 20) }, unit: tr("개", "groups", "个"), errorCode: "divisor-meaning-lost" }),
    item({ id: "ns-r02", section: "recheck", strand: "fraction-computation", level: "core", kind: "divide-fractions", responseFormat: "simplest-fraction", prompt: tr("3/5 ÷ 9/10을 기약분수로 나타내세요.", "Write 3/5 ÷ 9/10 as a fraction in simplest form.", "把3/5 ÷ 9/10写成最简分数。"), data: { dividend: fraction(3, 5), divisor: fraction(9, 10) }, unit: tr("", "", ""), errorCode: "reciprocal-order" }),
    item({ id: "ns-r03", section: "recheck", strand: "measurement-division", level: "core", kind: "quantity-per-group", responseFormat: "fraction-or-whole", prompt: tr("2와 1/2 L의 물을 5/8 L씩 나누어 담으면 몇 통이 됩니까?", "Two and one-half liters of water is poured into containers holding 5/8 L each. How many containers are filled?", "把2又1/2升水按每桶5/8升分装，可以装满几桶？"), data: { dividend: fraction(5, 2), divisor: fraction(5, 8) }, unit: tr("통", "containers", "桶"), errorCode: "mixed-number-not-converted" }),
    item({ id: "ns-r04", section: "recheck", strand: "fraction-rate", level: "advanced", kind: "rate-from-fractions", responseFormat: "fraction-or-whole", prompt: tr("2/5시간 동안 3/4마일을 걸었습니다. 한 시간에 몇 마일을 걷는 속도입니까?", "A walker travels 3/4 mile in 2/5 hour. What is the speed in miles per hour?", "2/5小时走3/4英里。速度是多少英里/小时？"), data: { dividend: fraction(3, 4), divisor: fraction(2, 5) }, unit: tr("마일/시간", "miles per hour", "英里/小时"), errorCode: "unit-interpretation" })
  ];

  const STRANDS = freeze({
    "unit-fraction-count": tr("단위분수의 개수", "Count unit-fraction groups", "数单位分数组"),
    "fraction-computation": tr("분수 나눗셈 계산", "Fraction division", "分数除法计算"),
    "mixed-number-division": tr("대분수 나눗셈", "Mixed-number division", "带分数除法"),
    "measurement-division": tr("측정 나눗셈", "Measurement division", "包含除法"),
    "fraction-rate": tr("분수 단위율", "Fractional unit rate", "分数单位率")
  });
  const ERROR_GUIDES = freeze({
    "divisor-meaning-lost": { label: tr("나누는 분수 크기를 세지 않음", "Did not count groups of the divisor", "没有按除数的大小数份数"), prompt: tr("나누어지는 양을 나누는 분수와 같은 단위로 바꾸어 몇 칸인지 세게 하세요.", "Rename the dividend in the divisor's unit, then count the equal groups.", "把被除数改写成与除数相同的单位，再数等份。") },
    "reciprocal-order": { label: tr("나누어지는 수의 역수를 취함", "Inverted the dividend instead of the divisor", "把被除数颠倒了"), prompt: tr("그대로 두는 수와 뒤집는 수를 말로 먼저 구분하게 하세요.", "Have the student name which fraction stays and which divisor is inverted.", "先让学生说清哪个分数保持不变、哪个除数要取倒数。") },
    "multiplication-not-simplified": { label: tr("곱한 뒤 기약분수로 만들지 않음", "Did not reduce the product", "乘完后没有约分"), prompt: tr("곱하기 전 교차 약분 또는 곱한 뒤 최대공약수 약분을 확인하세요.", "Check cross-cancellation before multiplying or reduce by the greatest common factor afterward.", "乘法前先交叉约分，或乘完后用最大公因数约分。") },
    "mixed-number-not-converted": { label: tr("대분수를 가분수로 바꾸지 않음", "Did not convert the mixed number", "没有把带分数化成假分数"), prompt: tr("대분수를 가분수로 바꾼 뒤 나눗셈을 시작하게 하세요.", "Convert the mixed number to an improper fraction before dividing.", "先把带分数化成假分数，再做除法。") },
    "unit-interpretation": { label: tr("몫의 단위를 상황과 연결하지 못함", "Did not interpret the quotient's unit", "没有解释商的单位"), prompt: tr("전체 양 ÷ 한 묶음의 양이 묶음 수인지, 시간당 양인지 말하게 하세요.", "Ask whether total quantity divided by group size gives a group count or a per-hour rate.", "说明总量除以每份量得到的是份数还是每小时的量。") }
  });

  const PACK = freeze({
    schemaVersion: 1, id: "gfield-grade6-ns-a-clinic-v1", clusterId: "6.NS.A", standardRange: "6.NS.A.1", learnerStage: "US Grade 6 ages 11-12",
    contentOrigin: "gfield-original-authored-public-clinic", rights: { publication: "public", assetRights: "original", containsThirdPartyAssets: false },
    scopeNotice: tr("이 팩은 6.NS.A.1의 분수 나눗셈 의미·계산·문제 해결을 연습하는 공개 클리닉입니다. 전체 영역 숙달이나 승급을 자동 결정하지 않습니다.", "This public clinic practices the meaning, computation, and application of fraction division in 6.NS.A.1. It does not automatically determine full-domain mastery or promotion.", "本公开练习包用于练习6.NS.A.1分数除法的意义、计算与应用，不自动判定整个领域的掌握程度或晋级。"),
    title: tr("6.NS.A 분수 나눗셈 클리닉", "6.NS.A Fraction Division Clinic", "6.NS.A 分数除法专项练习"),
    subtitle: tr("같은 단위의 개수를 세고, 나누는 수의 역수를 곱하고, 몫을 상황의 단위로 설명합니다.", "Count equal-size groups, multiply by the divisor's reciprocal, and interpret the quotient in context.", "数相同单位的份数，乘以除数的倒数，并结合情境解释商。"),
    conceptSummary: tr("a ÷ b는 a 안에 b가 몇 번 들어가는지 묻습니다. 분수끼리 나눌 때는 나누는 수의 역수를 곱합니다. 대분수는 먼저 가분수로 바꾸고, 마지막에는 원래 상황의 단위를 확인합니다.", "The expression a ÷ b asks how many groups of b fit in a. To divide fractions, multiply by the reciprocal of the divisor. Convert mixed numbers first and interpret the final unit.", "a ÷ b表示a中包含多少个b。分数相除时，乘以除数的倒数。先把带分数化成假分数，最后解释答案的单位。"),
    workedExample: { title: tr("해결 예시 · 3/4 ÷ 1/8", "Worked example · 3/4 ÷ 1/8", "例题 · 3/4 ÷ 1/8"), prompt: tr("3/4m의 끈을 1/8m씩 자르면 몇 조각이 됩니까?", "How many 1/8 m pieces can be cut from 3/4 m of rope?", "把3/4米绳子每1/8米剪一段，可以剪成多少段？"), steps: [tr("3/4을 8분의 단위로 바꾸면 6/8입니다.", "Rename 3/4 in eighths: 3/4 = 6/8.", "把3/4改写成八分数：3/4 = 6/8。"), tr("6/8에는 1/8이 6개 있으므로 몫은 6입니다.", "There are six groups of 1/8 in 6/8, so the quotient is 6.", "6/8里面有6个1/8，所以商是6。"), tr("검산: 6 × 1/8 = 6/8 = 3/4입니다.", "Check: 6 × 1/8 = 6/8 = 3/4.", "检验：6 × 1/8 = 6/8 = 3/4。") ] },
    ui: {
      titleLead: tr("분수로 나누는 뜻을", "See what fraction division means.", "看懂分数除法的意义。"), titleAccent: tr("보고, 계산하고, 설명하기.", "Model. Compute. Explain.", "建模、计算、解释。"),
      hero: tr("단위분수의 개수, 분수 나눗셈 계산, 측정 상황과 분수 단위율을 새 문항으로 연결합니다.", "Connect unit-fraction groups, exact fraction division, measurement situations, and fractional unit rates.", "把单位分数组、分数除法、测量情境与分数单位率连接起来。"),
      sectionOrder: ["models", "compute", "applications", "recheck"],
      sectionLabels: { models: tr("1 · 같은 단위로 개수 세기", "1 · Count in the same unit", "1 · 用相同单位数份数"), compute: tr("2 · 역수를 곱해 정확히 계산", "2 · Compute with the reciprocal", "2 · 乘倒数准确计算"), applications: tr("3 · 측정과 단위율에 적용", "3 · Apply to measurement and rates", "3 · 应用于测量与单位率"), recheck: tr("새 문항 · 4영역 재확인", "New items · Four-strand recheck", "新题 · 四领域复测") }
    },
    workbookItems: WORKBOOK_ITEMS, recheckItems: RECHECK_ITEMS, strands: STRANDS, errorGuides: ERROR_GUIDES
  });

  function solveItem(candidate) {
    const dividend = rational(candidate.data.dividend.numerator, candidate.data.dividend.denominator);
    const divisor = rational(candidate.data.divisor.numerator, candidate.data.divisor.denominator);
    if (divisor.numerator === 0n) throw new Error("NSA_DIVISOR_ZERO");
    return rational(dividend.numerator * divisor.denominator, dividend.denominator * divisor.numerator);
  }
  function parseNumber(value) {
    const text = String(value == null ? "" : value).trim().replace(/,/g, "");
    let match = text.match(/^([+-]?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
    try {
      if (match) {
        const whole = BigInt(match[1]); const part = BigInt(match[2]); const denominator = BigInt(match[3]);
        if (part >= denominator || denominator === 0n) return null;
        const sign = whole < 0n ? -1n : 1n;
        return rational(whole * denominator + sign * part, denominator);
      }
      match = text.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);
      if (match) return rational(match[1], match[2]);
      match = text.match(/^([+-]?\d+)(?:\.(\d+))?$/);
      if (!match) return null;
      const decimals = match[2] || ""; const denominator = 10n ** BigInt(decimals.length);
      const sign = text.startsWith("-") ? -1n : 1n;
      return rational(sign * (BigInt(match[1].replace(/^[+-]/, "")) * denominator + BigInt(decimals || "0")), denominator);
    } catch (error) { return null; }
  }
  function evaluateResponse(candidate, response) {
    const expected = solveItem(candidate); const actual = parseNumber(response);
    if (candidate.responseFormat === "simplest-fraction") {
      const match = String(response == null ? "" : response).trim().match(/^([+-]?\d+)\s*\/\s*([+]?[1-9]\d*)$/);
      if (!match || gcd(BigInt(match[1]), BigInt(match[2])) !== 1n) return false;
    }
    return Boolean(actual && actual.numerator === expected.numerator && actual.denominator === expected.denominator);
  }
  function formatResult(candidate) {
    const value = solveItem(candidate);
    return value.denominator === 1n ? String(value.numerator) : value.numerator + "/" + value.denominator;
  }
  function fractionText(value) { return value.numerator + "/" + value.denominator; }
  function hintFor(candidate, locale) {
    const key = locale === "zh" ? "zh-Hans" : locale;
    const map = {
      "groups-in-quantity": tr("나누는 분수와 같은 크기의 칸으로 바꾸어 몇 칸인지 세세요.", "Rename the dividend in the divisor's unit and count the groups.", "把被除数改写成与除数相同的单位，再数份数。"),
      "divide-fractions": tr("첫 분수는 그대로 두고, 두 번째 분수만 뒤집어 곱하세요.", "Keep the first fraction and multiply by the reciprocal of the second.", "第一个分数不变，乘以第二个分数的倒数。"),
      "quantity-per-group": tr("전체 양 ÷ 한 묶음의 양을 식으로 쓰고 단위를 확인하세요.", "Write total quantity ÷ quantity per group, then check the unit.", "写出总量 ÷ 每份量，并检查单位。"),
      "rate-from-fractions": tr("이동한 거리 ÷ 걸린 시간을 계산하면 한 시간당 거리가 됩니다.", "Divide distance by time to find the distance per hour.", "用路程除以时间，求每小时的路程。")
    };
    return (map[candidate.kind] || map["divide-fractions"])[key];
  }
  function solutionFor(candidate, locale) {
    const key = locale === "zh" ? "zh-Hans" : locale; const dividend = candidate.data.dividend; const divisor = candidate.data.divisor;
    const expression = fractionText(dividend) + " ÷ " + fractionText(divisor) + " = " + fractionText(dividend) + " × " + divisor.denominator + "/" + divisor.numerator + " = " + formatResult(candidate);
    const mixedLead = candidate.id === "ns-w07" ? tr("2와 1/4 = 9/4로 바꿉니다. ", "Convert 2 1/4 to 9/4. ", "先把2又1/4化成9/4。") : (candidate.id === "ns-w11" ? tr("1과 4/5 = 9/5로 바꿉니다. ", "Convert 1 4/5 to 9/5. ", "先把1又4/5化成9/5。") : (candidate.id === "ns-r03" ? tr("2와 1/2 = 5/2로 바꿉니다. ", "Convert 2 1/2 to 5/2. ", "先把2又1/2化成5/2。") : tr("", "", "")));
    const copy = tr(mixedLead.ko + expression + "입니다. 곱셈으로 되돌려 원래 양과 같은지 확인합니다.", mixedLead.en + expression + ". Multiply the quotient by the divisor to recover the original quantity.", mixedLead["zh-Hans"] + expression + "。用商乘除数，检查是否回到原来的量。");
    return copy[key];
  }
  function validateItem(candidate) {
    const allowedKinds = new Set(["groups-in-quantity", "divide-fractions", "quantity-per-group", "rate-from-fractions"]);
    if (!candidate || !/^ns-[wr]\d{2}$/.test(candidate.id) || !allowedKinds.has(candidate.kind)) throw new Error("NSA_ITEM_INVALID");
    if (!STRANDS[candidate.strand] || !ERROR_GUIDES[candidate.errorCode]) throw new Error("NSA_ALIGNMENT_INVALID");
    ["ko", "en", "zh-Hans"].forEach(function (locale) { if (!candidate.prompt[locale]) throw new Error("NSA_LOCALE_INVALID"); });
    const result = solveItem(candidate);
    if (result.denominator <= 0n) throw new Error("NSA_RESULT_INVALID");
    return true;
  }
  function validatePack() {
    const all = PACK.workbookItems.concat(PACK.recheckItems);
    if (PACK.workbookItems.length !== 12 || PACK.recheckItems.length !== 4 || new Set(all.map(function (candidate) { return candidate.id; })).size !== 16) throw new Error("NSA_COUNT_INVALID");
    all.forEach(validateItem);
    const recheck = new Set(PACK.recheckItems.map(function (candidate) { return candidate.strand; }));
    ["unit-fraction-count", "fraction-computation", "measurement-division", "fraction-rate"].forEach(function (strand) { if (!recheck.has(strand)) throw new Error("NSA_RECHECK_COVERAGE_INVALID"); });
    return true;
  }

  validatePack();
  return freeze({ schemaVersion: 1, pack: PACK, solveItem: solveItem, evaluateResponse: evaluateResponse, formatResult: formatResult, hintFor: hintFor, solutionFor: solutionFor, validateItem: validateItem, validatePack: validatePack });
});
