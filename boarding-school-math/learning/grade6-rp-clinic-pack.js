(function (root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.GFIELDGrade6RPClinicPack = value;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function tr(ko, en, zhHans) { return Object.freeze({ ko: ko, en: en, "zh-Hans": zhHans }); }
  function freeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { freeze(value[key]); });
    return Object.freeze(value);
  }
  function gcd(left, right) {
    let a = Math.abs(left); let b = Math.abs(right);
    while (b) { const next = a % b; a = b; b = next; }
    return a || 1;
  }
  function rational(numerator, denominator) {
    if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator === 0) throw new Error("RP_CLINIC_RATIONAL_INVALID");
    const sign = denominator < 0 ? -1 : 1;
    const divisor = gcd(numerator, denominator);
    return Object.freeze({ kind: "number", numerator: sign * numerator / divisor, denominator: Math.abs(denominator) / divisor });
  }
  function ratio(left, right) {
    if (!Number.isSafeInteger(left) || !Number.isSafeInteger(right) || left <= 0 || right <= 0) throw new Error("RP_CLINIC_RATIO_INVALID");
    const divisor = gcd(left, right);
    return Object.freeze({ kind: "ratio", left: left / divisor, right: right / divisor });
  }
  function item(definition) { return freeze(definition); }

  const WORKBOOK_ITEMS = [
    item({ id: "rp-w01", section: "equivalent", strand: "equivalent-ratio", level: "foundation", kind: "missing-term", responseFormat: "whole-number", prompt: tr("빨간 구슬과 파란 구슬의 비가 3:5입니다. 빨간 구슬이 12개라면 파란 구슬은 몇 개입니까?", "The ratio of red beads to blue beads is 3:5. If there are 12 red beads, how many blue beads are there?", "红珠与蓝珠的比是3:5。如果有12颗红珠，那么有多少颗蓝珠？"), data: { left: 3, right: 5, knownLeft: 12 }, unit: tr("개", "beads", "颗"), errorCode: "additive-thinking" }),
    item({ id: "rp-w02", section: "equivalent", strand: "equivalent-ratio", level: "foundation", kind: "simplify-ratio", responseFormat: "ratio-pair", prompt: tr("18:24를 가장 간단한 자연수의 비로 나타내세요.", "Write 18:24 as a ratio in simplest whole-number form.", "把18:24化成最简整数比。"), data: { left: 18, right: 24 }, unit: tr("비", "ratio", "比"), errorCode: "common-factor-missed" }),
    item({ id: "rp-w03", section: "equivalent", strand: "part-whole", level: "foundation", kind: "part-from-total", responseFormat: "whole-number", prompt: tr("미술 동아리의 붓과 연필의 수의 비는 2:3이고 모두 35개입니다. 붓은 몇 개입니까?", "The ratio of paintbrushes to pencils in an art club is 2:3, and there are 35 items altogether. How many are paintbrushes?", "美术社团中画笔与铅笔的数量比是2:3，共有35件。画笔有多少支？"), data: { left: 2, right: 3, total: 35, target: "left" }, unit: tr("개", "paintbrushes", "支"), errorCode: "part-total-confusion" }),
    item({ id: "rp-w04", section: "equivalent", strand: "equivalent-ratio", level: "core", kind: "missing-term", responseFormat: "whole-number", prompt: tr("7:9와 같은 비가 □:45입니다. □에 들어갈 수를 구하세요.", "A ratio equivalent to 7:9 is □:45. Find the missing number.", "与7:9相等的比是□:45。求□中的数。"), data: { left: 7, right: 9, knownRight: 45 }, unit: tr("", "", ""), errorCode: "unequal-scaling" }),
    item({ id: "rp-w05", section: "rates", strand: "proportional-value", level: "core", kind: "proportional-value", responseFormat: "decimal-or-fraction", prompt: tr("리본 6m의 가격이 15달러입니다. 같은 가격으로 14m를 사면 얼마입니까?", "Six meters of ribbon cost $15. At the same rate, how much do 14 meters cost?", "6米丝带售价15美元。按同样的单价，14米需要多少钱？"), data: { sourceQuantity: 6, sourceValue: 15, targetQuantity: 14 }, unit: tr("달러", "dollars", "美元"), errorCode: "additive-thinking" }),
    item({ id: "rp-w06", section: "rates", strand: "unit-rate", level: "core", kind: "unit-rate", responseFormat: "decimal-or-fraction", prompt: tr("사과 12개의 가격이 9달러입니다. 사과 한 개의 가격은 얼마입니까?", "Twelve apples cost $9. What is the cost of one apple?", "12个苹果售价9美元。每个苹果多少钱？"), data: { totalValue: 9, quantity: 12 }, unit: tr("달러", "dollars", "美元"), errorCode: "unit-rate-omitted" }),
    item({ id: "rp-w07", section: "rates", strand: "proportional-value", level: "core", kind: "proportional-value", responseFormat: "whole-number", prompt: tr("일정한 속도로 5분 동안 1200m를 달렸습니다. 8분 동안에는 몇 m를 달립니까?", "At a constant speed, a runner travels 1,200 m in 5 minutes. How far does the runner travel in 8 minutes?", "以恒定速度跑步，5分钟跑1200米。8分钟跑多少米？"), data: { sourceQuantity: 5, sourceValue: 1200, targetQuantity: 8 }, unit: tr("m", "m", "米"), errorCode: "additive-thinking" }),
    item({ id: "rp-w08", section: "rates", strand: "proportional-value", level: "advanced", kind: "proportional-value", responseFormat: "decimal-or-fraction", prompt: tr("8인분의 밥에 쌀 3컵이 필요합니다. 같은 비율로 14인분을 만들려면 쌀이 몇 컵 필요합니까?", "A recipe uses 3 cups of rice for 8 servings. At the same rate, how many cups are needed for 14 servings?", "8人份米饭需要3杯米。按同样的比率，14人份需要多少杯米？"), data: { sourceQuantity: 8, sourceValue: 3, targetQuantity: 14 }, unit: tr("컵", "cups", "杯"), errorCode: "unequal-scaling" }),
    item({ id: "rp-w09", section: "applications", strand: "percent-conversion", level: "core", kind: "percent-of", responseFormat: "whole-number", prompt: tr("68의 25%는 얼마입니까?", "What is 25% of 68?", "68的25%是多少？"), data: { whole: 68, percent: 25 }, unit: tr("", "", ""), errorCode: "percent-place-value" }),
    item({ id: "rp-w10", section: "applications", strand: "percent-conversion", level: "core", kind: "percentage", responseFormat: "whole-number", prompt: tr("24명 중 18명이 참여했습니다. 참여한 학생은 전체의 몇 %입니까?", "Eighteen out of 24 students participated. What percent of the students participated?", "24名学生中有18名参加。参加者占总人数的百分之几？"), data: { part: 18, whole: 24 }, unit: tr("%", "%", "%"), errorCode: "part-total-confusion" }),
    item({ id: "rp-w11", section: "applications", strand: "percent-conversion", level: "core", kind: "conversion", responseFormat: "whole-number", prompt: tr("3.5시간은 몇 분입니까?", "How many minutes are in 3.5 hours?", "3.5小时是多少分钟？"), data: { valueNumerator: 7, valueDenominator: 2, factor: 60 }, unit: tr("분", "minutes", "分钟"), errorCode: "conversion-direction" }),
    item({ id: "rp-w12", section: "applications", strand: "part-whole", level: "advanced", kind: "part-from-total", responseFormat: "whole-number", prompt: tr("한 팀의 남학생과 여학생 수의 비는 4:7이고 모두 55명입니다. 여학생은 몇 명입니까?", "The ratio of boys to girls on a team is 4:7, and there are 55 students altogether. How many are girls?", "一个队中男生与女生人数比是4:7，共55人。女生有多少人？"), data: { left: 4, right: 7, total: 55, target: "right" }, unit: tr("명", "girls", "名"), errorCode: "part-total-confusion" })
  ];

  const RECHECK_ITEMS = [
    item({ id: "rp-r01", section: "recheck", strand: "equivalent-ratio", level: "core", kind: "missing-term", responseFormat: "whole-number", prompt: tr("5:8과 같은 비가 30:□입니다. □를 구하세요.", "A ratio equivalent to 5:8 is 30:□. Find the missing number.", "与5:8相等的比是30:□。求□。"), data: { left: 5, right: 8, knownLeft: 30 }, unit: tr("", "", ""), errorCode: "unequal-scaling" }),
    item({ id: "rp-r02", section: "recheck", strand: "unit-rate", level: "core", kind: "unit-rate", responseFormat: "decimal-or-fraction", prompt: tr("입장권 7장의 가격이 31.50달러입니다. 한 장의 가격은 얼마입니까?", "Seven tickets cost $31.50. What is the cost of one ticket?", "7张门票售价31.50美元。每张门票多少钱？"), data: { totalValueNumerator: 3150, totalValueDenominator: 100, quantity: 7 }, unit: tr("달러", "dollars", "美元"), errorCode: "unit-rate-omitted" }),
    item({ id: "rp-r03", section: "recheck", strand: "part-whole", level: "core", kind: "part-from-total", responseFormat: "whole-number", prompt: tr("검은 타일과 흰 타일의 수의 비는 3:5이고 모두 64개입니다. 검은 타일은 몇 개입니까?", "The ratio of black tiles to white tiles is 3:5, and there are 64 tiles altogether. How many are black?", "黑色瓷砖与白色瓷砖的数量比是3:5，共64块。黑色瓷砖有多少块？"), data: { left: 3, right: 5, total: 64, target: "left" }, unit: tr("개", "black tiles", "块"), errorCode: "part-total-confusion" }),
    item({ id: "rp-r04", section: "recheck", strand: "percent-conversion", level: "advanced", kind: "percent-of", responseFormat: "whole-number", prompt: tr("240의 35%는 얼마입니까?", "What is 35% of 240?", "240的35%是多少？"), data: { whole: 240, percent: 35 }, unit: tr("", "", ""), errorCode: "percent-place-value" })
  ];

  const STRANDS = freeze({
    "equivalent-ratio": tr("같은 비", "Equivalent ratios", "相等的比"),
    "unit-rate": tr("단위율", "Unit rates", "单位率"),
    "proportional-value": tr("비례값", "Proportional values", "比例值"),
    "part-whole": tr("부분과 전체", "Part and whole", "部分与整体"),
    "percent-conversion": tr("퍼센트와 변환", "Percent and conversion", "百分数与换算")
  });

  const ERROR_GUIDES = freeze({
    "additive-thinking": { label: tr("덧셈 관계로 처리함", "Used additive rather than multiplicative reasoning", "误用加法关系"), prompt: tr("두 양에 같은 배수를 적용했는지 물어보세요.", "Ask whether the same scale factor was applied to both quantities.", "请确认两个量是否使用了相同的倍数。") },
    "common-factor-missed": { label: tr("공약수를 끝까지 나누지 않음", "Did not divide by the greatest common factor", "没有除以最大公因数"), prompt: tr("두 수를 동시에 더 나눌 수 있는 수가 남았는지 확인하세요.", "Check whether both terms can still be divided by the same whole number.", "检查两个数是否还能同时除以同一个整数。") },
    "part-total-confusion": { label: tr("비의 부분 수와 실제 전체를 혼동함", "Confused ratio parts with the actual total", "混淆比的份数与实际总数"), prompt: tr("먼저 비의 전체 부분 수를 구하고 한 부분의 값을 찾게 하세요.", "Have the student find the total ratio parts and then the value of one part.", "先求比的总份数，再求一份的实际数量。") },
    "unequal-scaling": { label: tr("두 항에 다른 배수를 적용함", "Used different scale factors on the two terms", "比的两项使用了不同倍数"), prompt: tr("화살표 두 개에 같은 곱셈 수를 써 보게 하세요.", "Ask the student to write the same multiplier on both ratio arrows.", "让学生在两个比项的箭头上写出相同的乘数。") },
    "unit-rate-omitted": { label: tr("1단위 값을 구하지 않음", "Skipped the value for one unit", "没有先求一单位的值"), prompt: tr("전체 값을 수량으로 나누어 1단위 값을 먼저 말하게 하세요.", "Ask for the value of one unit before scaling to another quantity.", "先用总量除以数量，求出一单位的值。") },
    "percent-place-value": { label: tr("퍼센트를 100분의 수로 바꾸지 않음", "Did not interpret percent as a number out of 100", "没有把百分数理解为百分之几"), prompt: tr("퍼센트를 /100 또는 소수로 먼저 바꾸게 하세요.", "Have the student rewrite the percent as a fraction over 100 or a decimal.", "先把百分数改写成分母为100的分数或小数。") },
    "conversion-direction": { label: tr("단위 변환 방향을 반대로 적용함", "Reversed the unit-conversion direction", "单位换算方向相反"), prompt: tr("큰 단위 하나에 작은 단위가 몇 개 들어가는지 먼저 쓰게 하세요.", "Ask how many smaller units make one larger unit before calculating.", "先写出一个大单位包含多少个小单位。") }
  });

  const PACK = freeze({
    schemaVersion: 1,
    id: "gfield-grade6-rp-a-clinic-v1",
    clusterId: "6.RP.A",
    standardRange: "6.RP.A.1-3",
    learnerStage: "US Grade 6 ages 11-12",
    contentOrigin: "gfield-original-authored-public-clinic",
    rights: { publication: "public", assetRights: "original", containsThirdPartyAssets: false },
    scopeNotice: tr("이 팩은 6.RP.A의 같은 비·단위율·퍼센트·단위 변환을 연습하는 공개 클리닉입니다. 전체 클러스터 숙달이나 승급을 자동 결정하지 않습니다.", "This public clinic practices equivalent ratios, unit rates, percent, and conversions in 6.RP.A. It does not automatically determine full-cluster mastery or promotion.", "本公开练习包用于练习6.RP.A中的相等比、单位率、百分数和单位换算，不自动判定整个学习簇的掌握程度或晋级。"),
    title: tr("6.RP.A 비와 비율 클리닉", "6.RP.A Ratio and Rate Clinic", "6.RP.A 比与比率专项练习"),
    subtitle: tr("같은 배수 관계를 보고, 한 단위의 값을 찾고, 새로운 상황에 옮겨 봅니다.", "See the shared scale factor, find the value of one unit, and transfer the relationship to a new situation.", "识别相同的倍数关系，求一单位的值，并把关系迁移到新情境。"),
    conceptSummary: tr("비의 두 항에는 같은 배수를 적용합니다. 단위율은 둘째 양을 1로 만들었을 때의 첫째 양입니다. 부분과 전체 문제에서는 먼저 비의 전체 부분 수를 구합니다.", "Apply the same scale factor to both terms of a ratio. A unit rate gives the first quantity for one unit of the second. In part-whole problems, first count all ratio parts.", "比的两项要使用相同的倍数。单位率表示第二个量为1时第一个量的值。部分与整体问题中，先求比的总份数。"),
    workedExample: {
      title: tr("해결 예시 · 4잔에 과일 6컵", "Worked example · 6 cups for 4 smoothies", "例题 · 4杯饮品用6杯水果"),
      prompt: tr("스무디 4잔에 과일 6컵이 필요합니다. 10잔에는 몇 컵이 필요할까요?", "Four smoothies need 6 cups of fruit. How many cups are needed for 10 smoothies?", "4杯水果饮品需要6杯水果。10杯需要多少杯水果？"),
      steps: [
        tr("한 잔에 필요한 양은 6 ÷ 4 = 1.5컵입니다.", "One smoothie needs 6 ÷ 4 = 1.5 cups.", "每杯需要6 ÷ 4 = 1.5杯水果。"),
        tr("10잔에는 1.5 × 10 = 15컵이 필요합니다.", "Ten smoothies need 1.5 × 10 = 15 cups.", "10杯需要1.5 × 10 = 15杯水果。"),
        tr("검산: 4:6과 10:15는 모두 2:3으로 같은 비입니다.", "Check: 4:6 and 10:15 both simplify to 2:3.", "检验：4:6和10:15都化简为2:3。")
      ]
    },
    workbookItems: WORKBOOK_ITEMS,
    recheckItems: RECHECK_ITEMS,
    strands: STRANDS,
    errorGuides: ERROR_GUIDES
  });

  function solveItem(candidate) {
    const data = candidate.data;
    if (candidate.kind === "missing-term") {
      if (data.knownLeft != null) return rational(data.knownLeft * data.right, data.left);
      if (data.knownRight != null) return rational(data.knownRight * data.left, data.right);
    }
    if (candidate.kind === "simplify-ratio") return ratio(data.left, data.right);
    if (candidate.kind === "part-from-total") {
      const parts = data.left + data.right;
      return rational(data.total * (data.target === "left" ? data.left : data.right), parts);
    }
    if (candidate.kind === "unit-rate") {
      const numerator = data.totalValueNumerator != null ? data.totalValueNumerator : data.totalValue;
      const denominator = data.totalValueDenominator != null ? data.totalValueDenominator : 1;
      return rational(numerator, denominator * data.quantity);
    }
    if (candidate.kind === "proportional-value") return rational(data.sourceValue * data.targetQuantity, data.sourceQuantity);
    if (candidate.kind === "percent-of") return rational(data.whole * data.percent, 100);
    if (candidate.kind === "percentage") return rational(data.part * 100, data.whole);
    if (candidate.kind === "conversion") return rational(data.valueNumerator * data.factor, data.valueDenominator);
    throw new Error("RP_CLINIC_KIND_UNSUPPORTED");
  }

  function parseNumber(value) {
    const text = String(value == null ? "" : value).trim().replace(/,/g, "");
    let match = text.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);
    if (match) {
      try { return rational(Number(match[1]), Number(match[2])); }
      catch (error) { return null; }
    }
    match = text.match(/^([+-]?\d+)(?:\.(\d+))?$/);
    if (!match) return null;
    const decimals = match[2] || "";
    const denominator = 10 ** decimals.length;
    const sign = text.startsWith("-") ? -1 : 1;
    try { return rational(sign * (Math.abs(Number(match[1])) * denominator + Number(decimals || 0)), denominator); }
    catch (error) { return null; }
  }

  function parseRatio(value) {
    const match = String(value == null ? "" : value).trim().match(/^(\d+)\s*[:：]\s*(\d+)$/);
    if (!match) return null;
    try { return ratio(Number(match[1]), Number(match[2])); }
    catch (error) { return null; }
  }

  function evaluateResponse(candidate, response) {
    const expected = solveItem(candidate);
    const actual = expected.kind === "ratio" ? parseRatio(response) : parseNumber(response);
    if (!actual || actual.kind !== expected.kind) return false;
    if (expected.kind === "ratio") return actual.left === expected.left && actual.right === expected.right;
    return actual.numerator * expected.denominator === expected.numerator * actual.denominator;
  }

  function decimalText(numerator, denominator) {
    const value = numerator / denominator;
    return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(6)));
  }

  function formatResult(candidate) {
    const value = solveItem(candidate);
    if (value.kind === "ratio") return value.left + ":" + value.right;
    return candidate.responseFormat === "decimal-or-fraction"
      ? decimalText(value.numerator, value.denominator)
      : value.denominator === 1 ? String(value.numerator) : value.numerator + "/" + value.denominator;
  }

  function hintFor(candidate, locale) {
    const key = locale === "zh" ? "zh-Hans" : locale;
    const copy = {
      "missing-term": tr("두 비의 같은 위치를 연결하고 같은 배수를 찾으세요.", "Connect matching terms and find one shared scale factor.", "连接比中相同位置的项，找出共同的倍数。"),
      "simplify-ratio": tr("두 항을 동시에 나눌 수 있는 가장 큰 수를 찾으세요.", "Find the greatest whole number that divides both terms.", "找出能同时整除两个比项的最大整数。"),
      "part-from-total": tr("비의 전체 부분 수 → 한 부분의 값 → 목표 부분 순서로 구하세요.", "Find total ratio parts, then one part, then the requested part.", "按总份数、一份的值、目标份数的顺序计算。"),
      "unit-rate": tr("전체 값을 수량으로 나누어 1단위의 값을 구하세요.", "Divide the total value by the quantity to find one unit.", "用总值除以数量，求一单位的值。"),
      "proportional-value": tr("먼저 1단위의 값을 구하거나 두 양에 같은 배수를 적용하세요.", "Find one unit first, or apply the same scale factor to both quantities.", "先求一单位的值，或对两个量使用相同的倍数。"),
      "percent-of": tr("퍼센트를 100분의 수로 바꾸어 전체에 곱하세요.", "Rewrite the percent as a number over 100 and multiply by the whole.", "把百分数写成分母为100的分数，再乘以整体。"),
      "percentage": tr("부분 ÷ 전체 × 100을 계산하세요.", "Calculate part ÷ whole × 100.", "计算部分 ÷ 整体 × 100。"),
      "conversion": tr("1시간이 몇 분인지 먼저 쓰고 곱셈 방향을 확인하세요.", "Write how many minutes are in one hour, then check the multiplication direction.", "先写出1小时有多少分钟，再确认乘法方向。")
    }[candidate.kind];
    return copy[key] || copy.en;
  }

  function solutionFor(candidate, locale) {
    const key = locale === "zh" ? "zh-Hans" : locale;
    const data = candidate.data;
    let copy;
    if (candidate.kind === "missing-term") {
      const scale = data.knownLeft != null ? data.knownLeft / data.left : data.knownRight / data.right;
      copy = tr("같은 배수 " + decimalText(scale, 1) + "를 다른 항에도 적용하면 " + formatResult(candidate) + "입니다.", "Apply the same scale factor, " + decimalText(scale, 1) + ", to the matching term. The result is " + formatResult(candidate) + ".", "把相同的倍数" + decimalText(scale, 1) + "应用到对应项，结果是" + formatResult(candidate) + "。 ");
    } else if (candidate.kind === "simplify-ratio") {
      const divisor = gcd(data.left, data.right);
      copy = tr(data.left + "과 " + data.right + "을 모두 " + divisor + "로 나누면 " + formatResult(candidate) + "입니다.", "Divide both " + data.left + " and " + data.right + " by " + divisor + " to get " + formatResult(candidate) + ".", "把" + data.left + "和" + data.right + "都除以" + divisor + "，得到" + formatResult(candidate) + "。 ");
    } else if (candidate.kind === "part-from-total") {
      const parts = data.left + data.right;
      const unit = data.total / parts;
      const targetParts = data.target === "left" ? data.left : data.right;
      copy = tr("전체 비는 " + parts + "부분이고 한 부분은 " + data.total + " ÷ " + parts + " = " + decimalText(unit, 1) + "입니다. " + targetParts + "부분은 " + formatResult(candidate) + "입니다.", "There are " + parts + " ratio parts, so one part is " + data.total + " ÷ " + parts + " = " + decimalText(unit, 1) + ". The requested " + targetParts + " parts equal " + formatResult(candidate) + ".", "比共有" + parts + "份，一份是" + data.total + " ÷ " + parts + " = " + decimalText(unit, 1) + "。目标" + targetParts + "份是" + formatResult(candidate) + "。 ");
    } else if (candidate.kind === "unit-rate") {
      const total = data.totalValueNumerator != null ? data.totalValueNumerator / data.totalValueDenominator : data.totalValue;
      copy = tr("전체 값 " + total + "을 수량 " + data.quantity + "로 나누면 한 단위는 " + formatResult(candidate) + "입니다.", "Divide the total value, " + total + ", by " + data.quantity + ". One unit is " + formatResult(candidate) + ".", "用总值" + total + "除以数量" + data.quantity + "，一单位是" + formatResult(candidate) + "。 ");
    } else if (candidate.kind === "proportional-value") {
      copy = tr("한 단위는 " + data.sourceValue + " ÷ " + data.sourceQuantity + "이고, 여기에 " + data.targetQuantity + "를 곱하면 " + formatResult(candidate) + "입니다.", "One unit is " + data.sourceValue + " ÷ " + data.sourceQuantity + ". Multiply by " + data.targetQuantity + " to get " + formatResult(candidate) + ".", "一单位是" + data.sourceValue + " ÷ " + data.sourceQuantity + "，再乘以" + data.targetQuantity + "得到" + formatResult(candidate) + "。 ");
    } else if (candidate.kind === "percent-of") {
      copy = tr(data.whole + " × " + data.percent + "/100 = " + formatResult(candidate) + "입니다.", data.whole + " × " + data.percent + "/100 = " + formatResult(candidate) + ".", data.whole + " × " + data.percent + "/100 = " + formatResult(candidate) + "。 ");
    } else if (candidate.kind === "percentage") {
      copy = tr(data.part + " ÷ " + data.whole + " × 100 = " + formatResult(candidate) + "%입니다.", data.part + " ÷ " + data.whole + " × 100 = " + formatResult(candidate) + "%.", data.part + " ÷ " + data.whole + " × 100 = " + formatResult(candidate) + "% 。");
    } else {
      copy = tr(data.valueNumerator + "/" + data.valueDenominator + " × " + data.factor + " = " + formatResult(candidate) + "입니다.", data.valueNumerator + "/" + data.valueDenominator + " × " + data.factor + " = " + formatResult(candidate) + ".", data.valueNumerator + "/" + data.valueDenominator + " × " + data.factor + " = " + formatResult(candidate) + "。 ");
    }
    return (copy[key] || copy.en).trim();
  }

  function validateItem(candidate) {
    const allowedKinds = new Set(["missing-term", "simplify-ratio", "part-from-total", "unit-rate", "proportional-value", "percent-of", "percentage", "conversion"]);
    if (!candidate || !/^rp-[wr]\d{2}$/.test(candidate.id) || !allowedKinds.has(candidate.kind)) throw new Error("RP_CLINIC_ITEM_INVALID");
    if (!STRANDS[candidate.strand] || !ERROR_GUIDES[candidate.errorCode]) throw new Error("RP_CLINIC_ALIGNMENT_INVALID");
    ["ko", "en", "zh-Hans"].forEach(function (locale) { if (!candidate.prompt[locale] || typeof candidate.prompt[locale] !== "string") throw new Error("RP_CLINIC_LOCALE_INVALID"); });
    const result = solveItem(candidate);
    if (result.kind === "number" && (!Number.isSafeInteger(result.numerator) || !Number.isSafeInteger(result.denominator) || result.denominator <= 0)) throw new Error("RP_CLINIC_RESULT_INVALID");
    if (candidate.responseFormat === "ratio-pair" && result.kind !== "ratio") throw new Error("RP_CLINIC_RESPONSE_FORMAT_INVALID");
    if (candidate.responseFormat !== "ratio-pair" && result.kind !== "number") throw new Error("RP_CLINIC_RESPONSE_FORMAT_INVALID");
    if (candidate.responseFormat === "whole-number" && result.denominator !== 1) throw new Error("RP_CLINIC_WHOLE_NUMBER_INVALID");
    return true;
  }

  function validatePack() {
    const all = PACK.workbookItems.concat(PACK.recheckItems);
    if (PACK.workbookItems.length !== 12 || PACK.recheckItems.length !== 4 || new Set(all.map(function (candidate) { return candidate.id; })).size !== 16) throw new Error("RP_CLINIC_COUNT_INVALID");
    all.forEach(validateItem);
    const recheckStrands = new Set(PACK.recheckItems.map(function (candidate) { return candidate.strand; }));
    ["equivalent-ratio", "unit-rate", "part-whole", "percent-conversion"].forEach(function (strand) { if (!recheckStrands.has(strand)) throw new Error("RP_CLINIC_RECHECK_COVERAGE_INVALID"); });
    return true;
  }

  validatePack();
  return freeze({ schemaVersion: 1, pack: PACK, solveItem: solveItem, evaluateResponse: evaluateResponse, formatResult: formatResult, hintFor: hintFor, solutionFor: solutionFor, validateItem: validateItem, validatePack: validatePack });
});
