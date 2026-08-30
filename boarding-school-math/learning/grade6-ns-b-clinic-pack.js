(function (root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.GFIELDGrade6NSBClinicPack = value;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function tr(ko, en, zhHans) { return Object.freeze({ ko: ko, en: en, "zh-Hans": zhHans }); }
  function freeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { freeze(value[key]); });
    return Object.freeze(value);
  }
  function item(value) { return freeze(value); }
  function gcd(a, b) { let x = a < 0n ? -a : a; let y = b < 0n ? -b : b; while (y) { const r = x % y; x = y; y = r; } return x; }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function decimal(value) {
    const text = String(value);
    const match = text.match(/^([+-]?)(\d+)(?:\.(\d+))?$/);
    if (!match) throw new Error("NSB_DECIMAL_INVALID");
    const scale = 10n ** BigInt((match[3] || "").length);
    const sign = match[1] === "-" ? -1n : 1n;
    return { n: sign * (BigInt(match[2]) * scale + BigInt(match[3] || "0")), d: scale };
  }
  function rational(n, d) {
    if (d === 0n) throw new Error("NSB_ZERO_DENOMINATOR");
    const sign = d < 0n ? -1n : 1n; const divisor = gcd(n, d);
    return { n: sign * n / divisor, d: (d < 0n ? -d : d) / divisor };
  }

  const WORKBOOK_ITEMS = [
    item({ id: "nsb-w01", section: "division", strand: "whole-number-division", level: "foundation", kind: "whole-division", responseFormat: "whole-number", prompt: tr("1,344 ÷ 32를 계산하세요.", "Calculate 1,344 ÷ 32.", "计算1,344 ÷ 32。"), data: { dividend: 1344, divisor: 32 }, unit: tr("", "", ""), errorCode: "division-place-value" }),
    item({ id: "nsb-w02", section: "division", strand: "whole-number-division", level: "core", kind: "whole-division", responseFormat: "whole-number", prompt: tr("8,736 ÷ 24를 계산하세요.", "Calculate 8,736 ÷ 24.", "计算8,736 ÷ 24。"), data: { dividend: 8736, divisor: 24 }, unit: tr("", "", ""), errorCode: "division-place-value" }),
    item({ id: "nsb-w03", section: "division", strand: "whole-number-division", level: "core", kind: "whole-division", responseFormat: "whole-number", prompt: tr("15,625 ÷ 125를 계산하세요.", "Calculate 15,625 ÷ 125.", "计算15,625 ÷ 125。"), data: { dividend: 15625, divisor: 125 }, unit: tr("", "", ""), errorCode: "division-reverse-check" }),
    item({ id: "nsb-w04", section: "division", strand: "whole-number-division", level: "advanced", kind: "whole-division", responseFormat: "whole-number", prompt: tr("27,648 ÷ 72를 계산하세요.", "Calculate 27,648 ÷ 72.", "计算27,648 ÷ 72。"), data: { dividend: 27648, divisor: 72 }, unit: tr("", "", ""), errorCode: "division-reverse-check" }),
    item({ id: "nsb-w05", section: "decimals", strand: "decimal-operations", level: "foundation", kind: "decimal-add", responseFormat: "decimal", prompt: tr("18.75 + 6.408을 계산하세요.", "Calculate 18.75 + 6.408.", "计算18.75 + 6.408。"), data: { left: "18.75", right: "6.408" }, unit: tr("", "", ""), errorCode: "decimal-place-value" }),
    item({ id: "nsb-w06", section: "decimals", strand: "decimal-operations", level: "core", kind: "decimal-subtract", responseFormat: "decimal", prompt: tr("42.6 − 17.845를 계산하세요.", "Calculate 42.6 − 17.845.", "计算42.6 − 17.845。"), data: { left: "42.6", right: "17.845" }, unit: tr("", "", ""), errorCode: "decimal-place-value" }),
    item({ id: "nsb-w07", section: "decimals", strand: "decimal-operations", level: "core", kind: "decimal-multiply", responseFormat: "decimal", prompt: tr("3.75 × 2.4를 계산하세요.", "Calculate 3.75 × 2.4.", "计算3.75 × 2.4。"), data: { left: "3.75", right: "2.4" }, unit: tr("", "", ""), errorCode: "decimal-scale" }),
    item({ id: "nsb-w08", section: "decimals", strand: "decimal-operations", level: "advanced", kind: "decimal-divide", responseFormat: "decimal", prompt: tr("14.875 ÷ 1.25를 계산하세요.", "Calculate 14.875 ÷ 1.25.", "计算14.875 ÷ 1.25。"), data: { left: "14.875", right: "1.25" }, unit: tr("", "", ""), errorCode: "decimal-scale" }),
    item({ id: "nsb-w09", section: "factors", strand: "greatest-common-factor", level: "foundation", kind: "gcf", responseFormat: "whole-number", prompt: tr("84와 60의 최대공약수를 구하세요.", "Find the greatest common factor of 84 and 60.", "求84和60的最大公因数。"), data: { left: 84, right: 60 }, unit: tr("", "", ""), errorCode: "factor-versus-multiple" }),
    item({ id: "nsb-w10", section: "factors", strand: "least-common-multiple", level: "core", kind: "lcm", responseFormat: "whole-number", prompt: tr("8과 12의 최소공배수를 구하세요.", "Find the least common multiple of 8 and 12.", "求8和12的最小公倍数。"), data: { left: 8, right: 12 }, unit: tr("", "", ""), errorCode: "factor-versus-multiple" }),
    item({ id: "nsb-w11", section: "factors", strand: "greatest-common-factor", level: "core", kind: "gcf", responseFormat: "whole-number", prompt: tr("36 + 48 = d(3 + 4)가 되도록 하는 d를 구하세요.", "Find d so that 36 + 48 = d(3 + 4).", "求d，使36 + 48 = d(3 + 4)。"), data: { left: 36, right: 48 }, unit: tr("", "", ""), errorCode: "distribution-justification" }),
    item({ id: "nsb-w12", section: "factors", strand: "greatest-common-factor", level: "advanced", kind: "gcf", responseFormat: "whole-number", prompt: tr("빨간 펜 48자루와 파란 펜 60자루를 남김없이 똑같은 구성의 꾸러미로 최대한 많이 나눕니다. 꾸러미는 몇 개입니까?", "Forty-eight red pens and 60 blue pens are divided into the greatest possible number of identical kits with none left over. How many kits are made?", "把48支红笔和60支蓝笔分成尽可能多且组成相同的套装，不剩余。可以分成多少套？"), data: { left: 48, right: 60 }, unit: tr("개", "kits", "套"), errorCode: "context-justification" })
  ];

  const RECHECK_ITEMS = [
    item({ id: "nsb-r01", section: "recheck", strand: "whole-number-division", level: "core", kind: "whole-division", responseFormat: "whole-number", prompt: tr("19,872 ÷ 48을 계산하세요.", "Calculate 19,872 ÷ 48.", "计算19,872 ÷ 48。"), data: { dividend: 19872, divisor: 48 }, unit: tr("", "", ""), errorCode: "division-reverse-check" }),
    item({ id: "nsb-r02", section: "recheck", strand: "decimal-operations", level: "core", kind: "decimal-multiply", responseFormat: "decimal", prompt: tr("7.56 × 3.5를 계산하세요.", "Calculate 7.56 × 3.5.", "计算7.56 × 3.5。"), data: { left: "7.56", right: "3.5" }, unit: tr("", "", ""), errorCode: "decimal-scale" }),
    item({ id: "nsb-r03", section: "recheck", strand: "greatest-common-factor", level: "core", kind: "gcf", responseFormat: "whole-number", prompt: tr("72와 90의 최대공약수를 구하세요.", "Find the greatest common factor of 72 and 90.", "求72和90的最大公因数。"), data: { left: 72, right: 90 }, unit: tr("", "", ""), errorCode: "factor-versus-multiple" }),
    item({ id: "nsb-r04", section: "recheck", strand: "least-common-multiple", level: "advanced", kind: "lcm", responseFormat: "whole-number", prompt: tr("9와 12의 최소공배수를 구하세요.", "Find the least common multiple of 9 and 12.", "求9和12的最小公倍数。"), data: { left: 9, right: 12 }, unit: tr("", "", ""), errorCode: "factor-versus-multiple" })
  ];

  const STRANDS = freeze({
    "whole-number-division": tr("여러 자리 수 나눗셈", "Multi-digit division", "多位数除法"),
    "decimal-operations": tr("소수 연산", "Decimal operations", "小数运算"),
    "greatest-common-factor": tr("최대공약수", "Greatest common factor", "最大公因数"),
    "least-common-multiple": tr("최소공배수", "Least common multiple", "最小公倍数")
  });
  const ERROR_GUIDES = freeze({
    "division-place-value": { label: tr("몫의 자릿값 누락", "Lost a quotient place value", "遗漏商的数位"), prompt: tr("각 자리에서 곱하고 빼고 내려 쓰는 과정을 말하게 하세요. 표준 알고리즘 설명은 교사가 따로 관찰합니다.", "Ask the student to narrate multiply, subtract, and bring down at each place. Observe the standard-algorithm explanation separately.", "让学生逐位说明乘、减、落下的过程。标准算法的解释需由教师另行观察。") },
    "division-reverse-check": { label: tr("곱셈 검산 누락", "Skipped the multiplication check", "未用乘法检验"), prompt: tr("몫 × 나누는 수가 나누어지는 수와 같은지 확인하게 하세요.", "Check that quotient × divisor equals the dividend.", "检查商乘除数是否等于被除数。") },
    "decimal-place-value": { label: tr("소수점 자릿값 불일치", "Misaligned decimal place values", "小数位没有对齐"), prompt: tr("일의 자리끼리 맞추고 빈 자리는 0으로 채우게 하세요.", "Align ones with ones and use zeros for missing decimal places.", "个位与个位对齐，缺少的小数位用0补齐。") },
    "decimal-scale": { label: tr("소수 자릿수 이동 오류", "Decimal scale error", "小数位移动错误"), prompt: tr("먼저 정수처럼 계산한 뒤 곱셈의 전체 소수 자릿수 또는 나눗셈의 같은 배수 이동을 확인하세요.", "Compute with whole numbers first, then check the total decimal places or the equal scaling used in division.", "先按整数计算，再检查乘法的小数位总数或除法中同时放大的倍数。") },
    "factor-versus-multiple": { label: tr("약수와 배수 혼동", "Confused factors and multiples", "混淆因数与倍数"), prompt: tr("최대공약수는 두 수를 모두 나누고, 최소공배수는 두 수의 배수임을 말하게 하세요.", "Have the student state that a GCF divides both numbers while an LCM is a multiple of both.", "让学生说明最大公因数能整除两个数，而最小公倍数是两个数的倍数。") },
    "distribution-justification": { label: tr("공통인수만 쓰고 분배법칙 설명 누락", "Gave a common factor without justifying distribution", "只写公因数，未说明分配律"), prompt: tr("자동 채점은 d의 값만 확인합니다. 36=12×3, 48=12×4가 왜 12(3+4)가 되는지는 교사가 관찰하세요.", "Automatic checking verifies only d. Observe whether the student explains why 36=12×3 and 48=12×4 combine as 12(3+4).", "自动检查只核对d。教师需观察学生是否能解释36=12×3、48=12×4为何可写成12(3+4)。") },
    "context-justification": { label: tr("최대 묶음의 의미 설명 누락", "Did not justify the greatest number of groups", "未说明为何是最多组数"), prompt: tr("자동 채점은 꾸러미 수만 확인합니다. 두 종류가 남지 않고 각 꾸러미가 같은 구성이 되는 이유는 교사가 관찰하세요.", "Automatic checking verifies only the kit count. Observe the explanation that both quantities divide evenly into identical kits.", "自动检查只核对套数。教师需观察学生是否说明两种数量都能无剩余地分成相同套装。") }
  });

  const PACK = freeze({
    schemaVersion: 1, id: "gfield-grade6-ns-b-clinic-v1", clusterId: "6.NS.B", standardRange: "6.NS.B.2-4", learnerStage: "US Grade 6 ages 11-12",
    contentOrigin: "gfield-original-authored-public-clinic", rights: { publication: "public", assetRights: "original", containsThirdPartyAssets: false },
    scopeNotice: tr("이 공개 클리닉은 6.NS.B.2-4의 제한된 계산 근거를 확인합니다. 표준 알고리즘 설명과 분배법칙 정당화는 교사가 별도로 관찰하며, 전체 영역 숙달이나 승급을 자동 결정하지 않습니다.", "This public clinic checks limited computation evidence for 6.NS.B.2-4. A teacher separately observes standard-algorithm explanations and distributive-property justification; it does not automatically determine full mastery or promotion.", "本公开练习检查6.NS.B.2-4中有限的计算证据。标准算法说明与分配律论证由教师另行观察，不自动判定全部掌握或晋级。"),
    title: tr("6.NS.B 수 체계 계산 클리닉", "6.NS.B Number-System Computation Clinic", "6.NS.B 数系计算专项练习"),
    subtitle: tr("여러 자리 수 나눗셈, 소수 연산, 최대공약수와 최소공배수를 정확히 계산하고 검산합니다.", "Compute and verify multi-digit division, decimal operations, GCF, and LCM.", "准确计算并检验多位数除法、小数运算、最大公因数与最小公倍数。"),
    conceptSummary: tr("긴 나눗셈은 자리마다 나누고 곱하고 빼고 내려 씁니다. 소수 연산은 자릿값과 소수점 이동을 추적합니다. 최대공약수는 공통인수 중 가장 큰 수이고, 최소공배수는 공통배수 중 가장 작은 수입니다.", "In long division, divide, multiply, subtract, and bring down by place. For decimal operations, track place value and decimal scaling. The GCF is the greatest shared factor; the LCM is the least shared multiple.", "竖式除法按数位依次除、乘、减、落下。小数运算要追踪位值与小数点移动。最大公因数是最大的公因数，最小公倍数是最小的公倍数。"),
    workedExample: { title: tr("해결 예시 · 84와 60의 최대공약수", "Worked example · GCF of 84 and 60", "例题 · 84和60的最大公因数"), prompt: tr("두 수를 소인수분해하고 공통인수를 확인하세요.", "Prime-factor both numbers and identify the common factors.", "把两个数分解质因数并找出公因数。"), steps: [tr("84 = 2 × 2 × 3 × 7, 60 = 2 × 2 × 3 × 5입니다.", "84 = 2 × 2 × 3 × 7 and 60 = 2 × 2 × 3 × 5.", "84 = 2 × 2 × 3 × 7，60 = 2 × 2 × 3 × 5。"), tr("공통 소인수는 2, 2, 3입니다.", "The shared prime factors are 2, 2, and 3.", "公有质因数是2、2、3。"), tr("2 × 2 × 3 = 12이고, 84÷12=7, 60÷12=5로 검산합니다.", "2 × 2 × 3 = 12; check 84÷12=7 and 60÷12=5.", "2 × 2 × 3 = 12；检验84÷12=7，60÷12=5。") ] },
    ui: { titleLead: tr("계산 절차를", "Make computation", "让计算过程"), titleAccent: tr("정확히 실행하고 검산하기.", "accurate and verifiable.", "准确且可检验。"), hero: tr("나눗셈·소수 연산·공약수와 공배수를 세 묶음으로 연습하고 새 문항으로 다시 확인합니다.", "Practice division, decimal operations, factors, and multiples in three sets, then recheck with new items.", "分三组练习除法、小数运算、因数与倍数，再用新题复测。"), sectionOrder: ["division", "decimals", "factors", "recheck"], sectionLabels: { division: tr("1 · 여러 자리 수 나눗셈", "1 · Multi-digit division", "1 · 多位数除法"), decimals: tr("2 · 소수의 네 가지 연산", "2 · Four decimal operations", "2 · 小数四则运算"), factors: tr("3 · 최대공약수와 최소공배수", "3 · GCF and LCM", "3 · 最大公因数与最小公倍数"), recheck: tr("새 문항 · 4영역 재확인", "New items · Four-strand recheck", "新题 · 四领域复测") } },
    workbookItems: WORKBOOK_ITEMS, recheckItems: RECHECK_ITEMS, strands: STRANDS, errorGuides: ERROR_GUIDES
  });

  function solveItem(candidate) {
    const d = candidate.data;
    if (candidate.kind === "whole-division") return rational(BigInt(d.dividend), BigInt(d.divisor));
    if (candidate.kind === "gcf") return { n: gcd(BigInt(d.left), BigInt(d.right)), d: 1n };
    if (candidate.kind === "lcm") return { n: lcm(BigInt(d.left), BigInt(d.right)), d: 1n };
    const left = decimal(d.left); const right = decimal(d.right);
    if (candidate.kind === "decimal-add") return rational(left.n * right.d + right.n * left.d, left.d * right.d);
    if (candidate.kind === "decimal-subtract") return rational(left.n * right.d - right.n * left.d, left.d * right.d);
    if (candidate.kind === "decimal-multiply") return rational(left.n * right.n, left.d * right.d);
    if (candidate.kind === "decimal-divide") return rational(left.n * right.d, left.d * right.n);
    throw new Error("NSB_KIND_UNSUPPORTED");
  }
  function parseResponse(value) { try { return decimal(String(value == null ? "" : value).trim().replace(/,/g, "")); } catch (error) { return null; } }
  function evaluateResponse(candidate, response) { const actual = parseResponse(response); const expected = solveItem(candidate); return Boolean(actual && actual.n * expected.d === expected.n * actual.d); }
  function formatRational(value) {
    if (value.d === 1n) return String(value.n);
    let d = value.d; let twos = 0; let fives = 0;
    while (d % 2n === 0n) { d /= 2n; twos += 1; }
    while (d % 5n === 0n) { d /= 5n; fives += 1; }
    if (d !== 1n) return value.n + "/" + value.d;
    const places = Math.max(twos, fives); const scaled = value.n * (10n ** BigInt(places)) / value.d; const sign = scaled < 0n ? "-" : ""; const digits = (scaled < 0n ? -scaled : scaled).toString().padStart(places + 1, "0");
    return places ? sign + digits.slice(0, -places) + "." + digits.slice(-places).replace(/0+$/, "") : sign + digits;
  }
  function formatResult(candidate) { return formatRational(solveItem(candidate)); }
  function hintFor(candidate, locale) { const key = locale === "zh" ? "zh-Hans" : locale; const copy = { "whole-division": tr("각 자리에서 나누고, 곱하고, 빼고, 다음 자리를 내려 쓰세요.", "At each place: divide, multiply, subtract, and bring down.", "每一位依次进行除、乘、减、落下。"), "decimal-add": tr("소수점을 세로로 맞추세요.", "Align the decimal points.", "把小数点对齐。"), "decimal-subtract": tr("소수점을 맞추고 빈 자리는 0으로 채우세요.", "Align decimal points and fill missing places with zeros.", "对齐小数点，缺位补0。"), "decimal-multiply": tr("정수처럼 곱한 뒤 두 수의 소수 자릿수를 합하세요.", "Multiply as whole numbers, then count the total decimal places.", "先按整数相乘，再数两个因数的小数位总数。"), "decimal-divide": tr("나누는 수가 정수가 되도록 두 수의 소수점을 같은 만큼 옮기세요.", "Move both decimal points equally until the divisor is a whole number.", "同时等量移动两个数的小数点，使除数成为整数。"), gcf: tr("두 수를 모두 나누는 인수를 찾으세요.", "Find factors that divide both numbers.", "找出能同时整除两个数的因数。"), lcm: tr("두 수의 배수를 차례로 적어 첫 공통배수를 찾으세요.", "List multiples until the first common multiple appears.", "依次列出倍数，找第一个公倍数。") }[candidate.kind]; return copy[key]; }
  function solutionFor(candidate, locale) {
    const key = locale === "zh" ? "zh-Hans" : locale; const d = candidate.data; const answer = formatResult(candidate); let copy;
    if (candidate.kind === "whole-division") copy = tr(d.dividend + " ÷ " + d.divisor + " = " + answer + ". 검산: " + answer + " × " + d.divisor + " = " + d.dividend + "입니다.", d.dividend + " ÷ " + d.divisor + " = " + answer + ". Check: " + answer + " × " + d.divisor + " = " + d.dividend + ".", d.dividend + " ÷ " + d.divisor + " = " + answer + "。检验：" + answer + " × " + d.divisor + " = " + d.dividend + "。");
    else if (candidate.kind === "gcf") copy = tr(d.left + "와 " + d.right + "를 모두 나누는 가장 큰 수는 " + answer + "입니다.", "The greatest number that divides both " + d.left + " and " + d.right + " is " + answer + ".", "能同时整除" + d.left + "和" + d.right + "的最大数是" + answer + "。");
    else if (candidate.kind === "lcm") copy = tr(d.left + "와 " + d.right + "의 첫 공통배수는 " + answer + "입니다.", "The first common multiple of " + d.left + " and " + d.right + " is " + answer + ".", d.left + "和" + d.right + "的第一个公倍数是" + answer + "。");
    else copy = tr(d.left + " " + ({ "decimal-add": "+", "decimal-subtract": "−", "decimal-multiply": "×", "decimal-divide": "÷" }[candidate.kind]) + " " + d.right + " = " + answer + "입니다. 소수 자릿값을 맞춘 뒤 역연산 또는 어림으로 검산합니다.", d.left + " " + ({ "decimal-add": "+", "decimal-subtract": "−", "decimal-multiply": "×", "decimal-divide": "÷" }[candidate.kind]) + " " + d.right + " = " + answer + ". Check place value and verify with an inverse operation or estimate.", d.left + " " + ({ "decimal-add": "+", "decimal-subtract": "−", "decimal-multiply": "×", "decimal-divide": "÷" }[candidate.kind]) + " " + d.right + " = " + answer + "。检查小数位，并用逆运算或估算检验。");
    return copy[key];
  }
  function validateItem(candidate) {
    const kinds = new Set(["whole-division", "decimal-add", "decimal-subtract", "decimal-multiply", "decimal-divide", "gcf", "lcm"]);
    if (!candidate || !/^nsb-[wr]\d{2}$/.test(candidate.id) || !kinds.has(candidate.kind)) throw new Error("NSB_ITEM_INVALID");
    if (!STRANDS[candidate.strand] || !ERROR_GUIDES[candidate.errorCode]) throw new Error("NSB_ALIGNMENT_INVALID");
    ["ko", "en", "zh-Hans"].forEach(function (key) { if (!candidate.prompt[key]) throw new Error("NSB_LOCALE_INVALID"); });
    const result = solveItem(candidate); if (result.d <= 0n || result.n < 0n) throw new Error("NSB_RESULT_INVALID");
    if (candidate.responseFormat === "whole-number" && result.d !== 1n) throw new Error("NSB_WHOLE_RESULT_INVALID");
    return true;
  }
  function validatePack() {
    const all = PACK.workbookItems.concat(PACK.recheckItems);
    if (PACK.workbookItems.length !== 12 || PACK.recheckItems.length !== 4 || new Set(all.map(function (entry) { return entry.id; })).size !== 16) throw new Error("NSB_COUNT_INVALID");
    all.forEach(validateItem);
    const coverage = new Set(PACK.recheckItems.map(function (entry) { return entry.strand; }));
    ["whole-number-division", "decimal-operations", "greatest-common-factor", "least-common-multiple"].forEach(function (strand) { if (!coverage.has(strand)) throw new Error("NSB_RECHECK_COVERAGE_INVALID"); });
    return true;
  }
  validatePack();
  return freeze({ schemaVersion: 1, pack: PACK, solveItem: solveItem, evaluateResponse: evaluateResponse, formatResult: formatResult, hintFor: hintFor, solutionFor: solutionFor, validateItem: validateItem, validatePack: validatePack });
});
