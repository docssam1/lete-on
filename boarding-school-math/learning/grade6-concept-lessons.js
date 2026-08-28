(function (root, factory) {
  const registry = typeof module === "object" && module.exports
    ? require("../curriculum/us-k8-content-registry.js")
    : root.GFIELDUSK8ContentRegistry;
  const api = factory(registry);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDGrade6ConceptLessons = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (registry) {
  "use strict";

  if (!registry) throw new Error("GFIELDUSK8ContentRegistry is required");

  const SCHEMA_VERSION = "gfield-grade6-concept-lessons-v1";
  const LEARNING_SEQUENCE = Object.freeze(["concept", "example", "guided-reflection"]);
  const FORBIDDEN_PUBLIC_KEYS = new Set([
    "answer", "answerkey", "correctanswer", "correctoption", "options", "itemid", "slotid", "releaseid",
    "rubric", "scoringspec", "privateanswer", "privatepayload", "awardedpoints", "isgraded"
  ]);

  function fail(message) { throw new Error(message); }
  function isRecord(value) { return !!value && typeof value === "object" && !Array.isArray(value); }
  function requireText(value, field) {
    if (typeof value !== "string" || !value || value !== value.trim()) fail(`${field} must be a non-blank string`);
  }
  function denseArray(value, field, minimum) {
    if (!Array.isArray(value) || value.length < minimum) fail(`${field} must contain at least ${minimum} entries`);
    for (let index = 0; index < value.length; index += 1) {
      if (!Object.prototype.hasOwnProperty.call(value, index)) fail(`${field} must not contain empty slots`);
    }
  }
  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.getOwnPropertyNames(value).forEach(function (key) { deepFreeze(value[key]); });
    return Object.freeze(value);
  }
  function assertNoForbiddenKeys(value, field) {
    if (Array.isArray(value)) return value.forEach(function (entry, index) { assertNoForbiddenKeys(entry, `${field}[${index}]`); });
    if (!isRecord(value)) return;
    Object.keys(value).forEach(function (key) {
      if (FORBIDDEN_PUBLIC_KEYS.has(key.toLowerCase())) fail(`${field}.${key} is forbidden in public concept lessons`);
      assertNoForbiddenKeys(value[key], `${field}.${key}`);
    });
  }
  function integer(value, field) {
    if (!Number.isSafeInteger(value)) fail(`${field} must be a safe integer`);
    return value;
  }
  function gcd(left, right) {
    let a = Math.abs(left);
    let b = Math.abs(right);
    while (b) {
      const next = a % b;
      a = b;
      b = next;
    }
    return a;
  }
  function rational(value, field) {
    if (!isRecord(value)) fail(`${field} must be a rational object`);
    let numerator = integer(value.numerator, `${field}.numerator`);
    let denominator = integer(value.denominator, `${field}.denominator`);
    if (denominator === 0) fail(`${field}.denominator must not be zero`);
    if (denominator < 0) {
      numerator *= -1;
      denominator *= -1;
    }
    const divisor = gcd(numerator, denominator) || 1;
    return { numerator: numerator / divisor, denominator: denominator / divisor };
  }
  function equalRational(left, right) {
    const a = rational(left, "left rational");
    const b = rational(right, "right rational");
    return a.numerator === b.numerator && a.denominator === b.denominator;
  }
  function addRational(left, right) {
    const a = rational(left, "left addend");
    const b = rational(right, "right addend");
    return rational({ numerator: a.numerator * b.denominator + b.numerator * a.denominator, denominator: a.denominator * b.denominator }, "sum");
  }
  function multiplyRational(left, right) {
    const a = rational(left, "left factor");
    const b = rational(right, "right factor");
    return rational({ numerator: a.numerator * b.numerator, denominator: a.denominator * b.denominator }, "product");
  }
  function divideRational(left, right) {
    const a = rational(left, "dividend");
    const b = rational(right, "divisor");
    if (b.numerator === 0) fail("divisor must not be zero");
    return multiplyRational(a, { numerator: b.denominator, denominator: b.numerator });
  }
  function compareRational(left, right) {
    const a = rational(left, "left comparison value");
    const b = rational(right, "right comparison value");
    return Math.sign(a.numerator * b.denominator - b.numerator * a.denominator);
  }
  function mean(values) {
    const total = values.reduce(function (sum, value) { return sum + integer(value, "data value"); }, 0);
    return rational({ numerator: total, denominator: values.length }, "mean");
  }
  function mad(values, center) {
    const normalizedCenter = rational(center, "MAD center");
    const total = values.reduce(function (sum, value) {
      const distanceNumerator = Math.abs(value * normalizedCenter.denominator - normalizedCenter.numerator);
      return addRational(sum, { numerator: distanceNumerator, denominator: normalizedCenter.denominator });
    }, { numerator: 0, denominator: 1 });
    return divideRational(total, { numerator: values.length, denominator: 1 });
  }
  function polygonArea(vertices) {
    denseArray(vertices, "vertices", 3);
    let twiceArea = 0;
    vertices.forEach(function (vertex, index) {
      denseArray(vertex, `vertices[${index}]`, 2);
      if (vertex.length !== 2) fail("every vertex must contain exactly two coordinates");
      const next = vertices[(index + 1) % vertices.length];
      twiceArea += integer(vertex[0], "x coordinate") * integer(next[1], "next y coordinate") -
        integer(next[0], "next x coordinate") * integer(vertex[1], "y coordinate");
    });
    return rational({ numerator: Math.abs(twiceArea), denominator: 2 }, "polygon area");
  }
  function median(values) {
    const sorted = values.slice().sort(function (a, b) { return a - b; });
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2) return rational({ numerator: sorted[middle], denominator: 1 }, "median");
    return rational({ numerator: sorted[middle - 1] + sorted[middle], denominator: 2 }, "median");
  }

  function verifyArithmeticCheck(check) {
    if (!isRecord(check)) return false;
    try {
      if (check.kind === "ratio-scaling") {
        const unitRate = divideRational(check.totalValue, check.sourceQuantity);
        return equalRational(multiplyRational(unitRate, check.targetQuantity), check.expectedValue);
      }
      if (check.kind === "fraction-division") {
        return equalRational(divideRational(check.dividend, check.divisor), check.expectedQuotient);
      }
      if (check.kind === "greatest-common-factor") {
        return gcd(integer(check.left, "left"), integer(check.right, "right")) === integer(check.expectedGcf, "expectedGcf");
      }
      if (check.kind === "rational-comparison") {
        return compareRational(check.left, check.right) === integer(check.expectedSign, "expectedSign");
      }
      if (check.kind === "power-expression") {
        const computed = check.coefficient * (Math.pow(check.base, check.exponent) + check.insideAddend) + check.outsideAddend;
        return Number.isSafeInteger(computed) && computed === check.expectedValue;
      }
      if (check.kind === "linear-equation") {
        return check.coefficient * check.expectedX + check.constant === check.rightSide;
      }
      if (check.kind === "linear-function") {
        return check.slope * check.x + check.intercept === check.expectedY;
      }
      if (check.kind === "polygon-area") {
        return equalRational(polygonArea(check.vertices), check.expectedArea);
      }
      if (check.kind === "mean-mad-comparison") {
        denseArray(check.dataSets, "dataSets", 2);
        const verified = check.dataSets.every(function (set) {
          denseArray(set.values, "dataSet.values", 2);
          const computedMean = mean(set.values);
          return equalRational(computedMean, set.expectedMean) && equalRational(mad(set.values, computedMean), set.expectedMad);
        });
        const ranked = check.dataSets.slice().sort(function (left, right) { return compareRational(right.expectedMad, left.expectedMad); });
        return verified && ranked[0].label === check.expectedMoreVariable;
      }
      if (check.kind === "distribution-summary") {
        denseArray(check.values, "values", 2);
        const range = Math.max(...check.values) - Math.min(...check.values);
        return equalRational(mean(check.values), check.expectedMean) &&
          equalRational(median(check.values), check.expectedMedian) && range === check.expectedRange;
      }
    } catch (_error) {
      return false;
    }
    return false;
  }

  const definitions = [
    {
      clusterId: "6.RP.A",
      titleKo: "비를 같은 배수 관계로 읽기",
      conceptExplanationKo: "비는 두 양의 곱셈 관계를 나타냅니다. 두 양을 같은 수로 곱하거나 나누면 비의 관계는 유지됩니다. 단위율은 둘째 양을 1로 만들었을 때의 첫째 양이며, 표·이중수직선·식은 같은 관계를 서로 다르게 보여 주는 표현입니다.",
      representation: {
        type: "equivalent-ratio-table",
        descriptionKo: "공책 수와 가격을 두 행의 표로 나란히 놓고, 두 행을 같은 배수로 변화시킵니다.",
        visibleFactsKo: ["공책 8권의 가격은 12달러입니다.", "구하려는 공책 수는 14권입니다.", "모든 공책의 한 권당 가격은 같습니다."],
        singleInterpretation: true,
        hiddenInferenceRequired: false
      },
      workedExample: {
        titleKo: "공책 14권의 가격",
        situationKo: "공책 8권이 12달러일 때 같은 가격 체계에서 14권의 가격을 구합니다.",
        arithmeticCheck: { kind: "ratio-scaling", totalValue: { numerator: 12, denominator: 1 }, sourceQuantity: { numerator: 8, denominator: 1 }, targetQuantity: { numerator: 14, denominator: 1 }, expectedValue: { numerator: 21, denominator: 1 } },
        methods: [
          { nameKo: "단위율", stepsKo: ["한 권의 가격은 12 ÷ 8 = 3/2달러입니다.", "14권의 가격은 14 × 3/2 = 21달러입니다."] },
          { nameKo: "같은 비로 나누어 더하기", stepsKo: ["8권 12달러를 반으로 나누면 4권 6달러입니다.", "2권은 3달러이므로 14권 = 8권 + 4권 + 2권의 가격은 12 + 6 + 3 = 21달러입니다."] }
        ],
        conclusionKo: "공책 14권의 가격은 정확히 21달러입니다.",
        verificationKo: "단위율 계산과 같은 비의 분해가 모두 21달러를 줍니다."
      },
      commonMisconceptionKo: "8권에서 14권으로 6권 늘었다고 가격에도 무조건 6을 더하면 안 됩니다. 더해야 하는 것은 공책 수가 아니라 한 권당 가격을 반영한 금액입니다.",
      guidedReflectionKo: "두 방법에서 8:12와 14:21이 같은 비임을 어떻게 확인할 수 있는지 말로 설명해 보세요."
    },
    {
      clusterId: "6.NS.A",
      titleKo: "분수 나눗셈을 같은 단위의 개수로 해석하기",
      conceptExplanationKo: "분수 나눗셈은 한 양 안에 다른 분수 단위가 몇 번 들어가는지 묻는 연산입니다. 두 분수를 같은 단위로 바꾸어 개수를 세거나, 나누는 수의 역수를 곱해 같은 몫을 구할 수 있습니다.",
      representation: {
        type: "fraction-strip",
        descriptionKo: "길이 1인 띠를 8등분하여 3/4과 1/8을 같은 크기의 칸으로 나타냅니다.",
        visibleFactsKo: ["전체 띠의 길이는 1입니다.", "3/4은 6/8과 같습니다.", "묶음 하나의 길이는 1/8입니다."],
        singleInterpretation: true,
        hiddenInferenceRequired: false
      },
      workedExample: {
        titleKo: "3/4 안에 1/8이 몇 번 들어갈까",
        situationKo: "3/4미터의 끈을 1/8미터씩 같은 길이로 자를 때 조각 수를 구합니다.",
        arithmeticCheck: { kind: "fraction-division", dividend: { numerator: 3, denominator: 4 }, divisor: { numerator: 1, denominator: 8 }, expectedQuotient: { numerator: 6, denominator: 1 } },
        methods: [
          { nameKo: "같은 단위로 세기", stepsKo: ["3/4 = 6/8입니다.", "6/8에는 1/8이 6개 있으므로 몫은 6입니다."] },
          { nameKo: "역수를 곱하기", stepsKo: ["3/4 ÷ 1/8 = 3/4 × 8/1입니다.", "24/4 = 6이므로 몫은 6입니다."] }
        ],
        conclusionKo: "1/8미터짜리 끈은 정확히 6개 나옵니다.",
        verificationKo: "6 × 1/8 = 6/8 = 3/4이므로 몫 6이 원래 양을 정확히 되돌립니다."
      },
      commonMisconceptionKo: "분수 나눗셈에서 두 분자의 나눗셈과 두 분모의 나눗셈을 따로 하면 안 됩니다. 나누는 수가 나타내는 단위의 개수를 세어야 합니다.",
      guidedReflectionKo: "역수를 곱하는 계산이 왜 1/8 크기의 조각 수를 세는 것과 같은지 분수 띠를 이용해 설명해 보세요."
    },
    {
      clusterId: "6.NS.B",
      titleKo: "공약수를 구조적으로 찾기",
      conceptExplanationKo: "공약수는 두 수를 모두 나누어떨어지게 하는 수입니다. 최대공약수는 공통인 소인수를 모두 모아 곱하거나, 큰 수를 작은 수로 계속 나누는 과정에서 마지막으로 남는 0이 아닌 나머지로 찾을 수 있습니다.",
      representation: {
        type: "factor-tree-and-division-chain",
        descriptionKo: "84와 60의 소인수 나무와 유클리드 나눗셈 사슬을 나란히 보여 줍니다.",
        visibleFactsKo: ["84와 60을 비교합니다.", "두 수는 모두 100 이하의 양의 정수입니다.", "구하는 값은 최대공약수입니다."],
        singleInterpretation: true,
        hiddenInferenceRequired: false
      },
      workedExample: {
        titleKo: "84와 60의 최대공약수",
        situationKo: "84개와 60개의 물건을 남김없이 같은 수의 묶음으로 나눌 때 만들 수 있는 가장 많은 묶음 수를 구합니다.",
        arithmeticCheck: { kind: "greatest-common-factor", left: 84, right: 60, expectedGcf: 12 },
        methods: [
          { nameKo: "소인수분해", stepsKo: ["84 = 2 × 2 × 3 × 7입니다.", "60 = 2 × 2 × 3 × 5입니다.", "공통인 2 × 2 × 3 = 12입니다."] },
          { nameKo: "나눗셈 사슬", stepsKo: ["84 = 60 × 1 + 24입니다.", "60 = 24 × 2 + 12입니다.", "24 = 12 × 2 + 0이므로 마지막 0이 아닌 나머지 12가 최대공약수입니다."] }
        ],
        conclusionKo: "84와 60의 최대공약수는 정확히 12입니다.",
        verificationKo: "84 ÷ 12 = 7, 60 ÷ 12 = 5이고 7과 5는 서로소이므로 더 큰 공약수는 없습니다."
      },
      commonMisconceptionKo: "두 수에 공통으로 보이는 아무 약수 하나를 찾고 멈추면 최대공약수가 아닐 수 있습니다. 공통 부분을 모두 포함했는지 확인해야 합니다.",
      guidedReflectionKo: "소인수분해의 공통 곱 12와 나눗셈 사슬의 마지막 나머지 12가 같은 이유를 설명해 보세요."
    },
    {
      clusterId: "6.NS.C",
      titleKo: "음의 유리수를 수직선의 위치로 비교하기",
      conceptExplanationKo: "수직선에서는 오른쪽에 있는 수가 더 큽니다. 음수는 절댓값이 클수록 0에서 더 멀리 왼쪽에 있으므로 값은 더 작습니다. 공통분모와 수직선 거리는 같은 순서를 확인하는 두 방법입니다.",
      representation: {
        type: "number-line",
        descriptionKo: "-2부터 0까지를 12등분한 수직선에 -7/4와 -5/3의 위치를 표시합니다.",
        visibleFactsKo: ["수직선의 오른쪽 방향이 증가 방향입니다.", "-7/4 = -21/12입니다.", "-5/3 = -20/12입니다."],
        singleInterpretation: true,
        hiddenInferenceRequired: false
      },
      workedExample: {
        titleKo: "-7/4과 -5/3 비교",
        situationKo: "두 음의 유리수 -7/4과 -5/3 가운데 어느 수가 더 작은지 비교합니다.",
        arithmeticCheck: { kind: "rational-comparison", left: { numerator: -7, denominator: 4 }, right: { numerator: -5, denominator: 3 }, expectedSign: -1 },
        methods: [
          { nameKo: "공통분모", stepsKo: ["-7/4 = -21/12입니다.", "-5/3 = -20/12입니다.", "-21/12은 -20/12보다 작습니다."] },
          { nameKo: "0에서의 거리", stepsKo: ["|-7/4| = 7/4 = 21/12입니다.", "|-5/3| = 5/3 = 20/12입니다.", "음수에서는 0에서 더 멀리 왼쪽인 -7/4이 더 작습니다."] }
        ],
        conclusionKo: "-7/4 < -5/3입니다.",
        verificationKo: "공통분모 비교와 수직선의 위치가 모두 -7/4을 더 작은 수로 보여 줍니다."
      },
      commonMisconceptionKo: "7이 5보다 크다는 이유로 -7/4이 더 크다고 판단하면 안 됩니다. 음수는 수직선의 왼쪽일수록 더 작습니다.",
      guidedReflectionKo: "두 수의 절댓값 비교와 실제 값의 비교에서 부등호 방향이 달라지는 이유를 수직선으로 설명해 보세요."
    },
    {
      clusterId: "6.EE.A",
      titleKo: "연산 순서와 분배법칙으로 식의 값을 확인하기",
      conceptExplanationKo: "대수식은 수와 연산의 구조를 간결하게 나타냅니다. 지수, 괄호, 곱셈, 덧셈 순서를 지키고, 분배법칙으로 식을 다른 모양으로 바꾸어도 값이 같은지 확인할 수 있습니다.",
      representation: {
        type: "expression-structure-tree",
        descriptionKo: "3(2³ + 4) - 5를 바깥 연산에서 안쪽 연산으로 연결한 구조 나무로 나타냅니다.",
        visibleFactsKo: ["지수 2³을 먼저 계산합니다.", "괄호 안의 합에 3을 곱합니다.", "마지막에 5를 뺍니다."],
        singleInterpretation: true,
        hiddenInferenceRequired: false
      },
      workedExample: {
        titleKo: "3(2³ + 4) - 5의 값",
        situationKo: "연산 순서와 분배법칙 두 방법으로 식의 값을 구합니다.",
        arithmeticCheck: { kind: "power-expression", coefficient: 3, base: 2, exponent: 3, insideAddend: 4, outsideAddend: -5, expectedValue: 31 },
        methods: [
          { nameKo: "연산 순서", stepsKo: ["2³ = 8입니다.", "괄호 안은 8 + 4 = 12입니다.", "3 × 12 - 5 = 36 - 5 = 31입니다."] },
          { nameKo: "분배법칙", stepsKo: ["3(2³ + 4) - 5 = 3 × 2³ + 3 × 4 - 5입니다.", "3 × 8 + 12 - 5 = 24 + 12 - 5 = 31입니다."] }
        ],
        conclusionKo: "식의 값은 정확히 31입니다.",
        verificationKo: "원래 구조에 따른 계산과 분배한 식의 계산이 모두 31입니다."
      },
      commonMisconceptionKo: "2³을 2 × 3으로 계산하거나 괄호 앞의 3을 첫 항에만 곱하면 식의 구조가 바뀝니다.",
      guidedReflectionKo: "분배법칙으로 바꾼 식에서 왜 4에도 3을 곱해야 하는지 구조 나무를 이용해 설명해 보세요."
    },
    {
      clusterId: "6.EE.B",
      titleKo: "등식의 균형을 유지하며 방정식 풀기",
      conceptExplanationKo: "방정식의 해는 식을 참으로 만드는 미지수의 값입니다. 등호 양쪽에 같은 연산을 하면 균형이 유지됩니다. 그림 모델과 역연산은 같은 균형 원리를 표현합니다.",
      representation: {
        type: "balance-and-equal-groups",
        descriptionKo: "같은 값의 상자 6개가 42와 균형을 이루는 그림으로 6x = 42를 나타냅니다.",
        visibleFactsKo: ["여섯 상자의 값은 모두 x로 같습니다.", "여섯 상자의 합이 42입니다.", "등호 양쪽은 같은 양입니다."],
        singleInterpretation: true,
        hiddenInferenceRequired: false
      },
      workedExample: {
        titleKo: "6x = 42 풀기",
        situationKo: "등식의 균형과 같은 묶음 모델로 x를 구합니다.",
        arithmeticCheck: { kind: "linear-equation", coefficient: 6, constant: 0, rightSide: 42, expectedX: 7 },
        methods: [
          { nameKo: "등식의 양쪽에 같은 연산", stepsKo: ["양쪽을 6으로 나누면 6x ÷ 6 = 42 ÷ 6입니다.", "왼쪽은 x, 오른쪽은 7이므로 x = 7입니다."] },
          { nameKo: "같은 묶음 모델", stepsKo: ["42를 여섯 상자에 똑같이 나눕니다.", "42 ÷ 6 = 7이므로 한 상자의 값은 7입니다."] }
        ],
        conclusionKo: "방정식의 해는 정확히 x = 7입니다.",
        verificationKo: "x = 7을 대입하면 6 × 7 = 42로 등식이 참입니다."
      },
      commonMisconceptionKo: "6x를 x + 6으로 읽거나 한쪽만 6으로 나누면 등식의 균형이 깨집니다. 양쪽을 같은 수로 나누어야 합니다.",
      guidedReflectionKo: "42를 여섯 상자에 똑같이 나누는 행동이 등식 양쪽을 6으로 나누는 것과 어떻게 연결되는지 설명해 보세요."
    },
    {
      clusterId: "6.EE.C",
      titleKo: "두 변수의 관계를 표와 식으로 연결하기",
      conceptExplanationKo: "독립변수의 값을 정하면 규칙에 따라 종속변수의 값이 결정됩니다. 표는 여러 입력과 출력을 보여 주고, 식은 모든 경우에 적용되는 관계를 한 번에 나타냅니다.",
      representation: {
        type: "input-output-table",
        descriptionKo: "x가 1씩 늘 때 y가 3씩 늘고 시작 보정값이 2인 표와 y = 3x + 2를 나란히 둡니다.",
        visibleFactsKo: ["x는 독립변수입니다.", "y는 x에 의해 정해지는 종속변수입니다.", "관계식은 y = 3x + 2입니다."],
        singleInterpretation: true,
        hiddenInferenceRequired: false
      },
      workedExample: {
        titleKo: "x = 7일 때 y의 값",
        situationKo: "관계식 y = 3x + 2에서 x가 7일 때 y를 구합니다.",
        arithmeticCheck: { kind: "linear-function", slope: 3, intercept: 2, x: 7, expectedY: 23 },
        methods: [
          { nameKo: "식에 대입", stepsKo: ["x 자리에 7을 넣으면 y = 3 × 7 + 2입니다.", "21 + 2 = 23이므로 y = 23입니다."] },
          { nameKo: "표의 일정한 변화", stepsKo: ["x = 0일 때 y = 2입니다.", "x가 1 늘 때마다 y가 3 늘므로 x = 7까지 3을 일곱 번 더합니다.", "2 + 7 × 3 = 23입니다."] }
        ],
        conclusionKo: "x = 7일 때 y는 정확히 23입니다.",
        verificationKo: "직접 대입과 표의 반복 변화가 모두 순서쌍 (7, 23)을 만듭니다."
      },
      commonMisconceptionKo: "3x + 2를 3(x + 2)로 읽으면 다른 관계가 됩니다. 2는 x에 3을 곱한 뒤 더하는 일정한 보정값입니다.",
      guidedReflectionKo: "표에서 y가 3씩 늘어난다는 사실과 식의 계수 3이 어떻게 같은 관계를 나타내는지 설명해 보세요."
    },
    {
      clusterId: "6.G.A",
      titleKo: "보이는 도형을 분해하고 보완해 넓이 구하기",
      conceptExplanationKo: "복합도형의 넓이는 겹치지 않는 익숙한 도형으로 나누어 더하거나, 큰 도형에서 빠진 부분을 빼서 구할 수 있습니다. 두 방법에서 사용한 조각이 정확히 같은 영역을 덮는지 확인해야 합니다.",
      representation: {
        type: "fully-labeled-coordinate-polygon",
        descriptionKo: "꼭짓점 (0,0), (8,0), (8,4), (4,4), (4,6), (0,6)을 순서대로 이은 L자 도형입니다. 모든 변은 좌표축과 평행합니다.",
        visibleFactsKo: ["여섯 꼭짓점의 좌표가 모두 주어집니다.", "숨은 변이나 원근 표현은 없습니다.", "길이의 단위는 1이고 넓이는 제곱단위로 구합니다."],
        singleInterpretation: true,
        hiddenInferenceRequired: false
      },
      workedExample: {
        titleKo: "L자 도형의 넓이",
        situationKo: "주어진 여섯 꼭짓점으로 만든 L자 도형의 넓이를 두 방법으로 구합니다.",
        arithmeticCheck: { kind: "polygon-area", vertices: [[0, 0], [8, 0], [8, 4], [4, 4], [4, 6], [0, 6]], expectedArea: { numerator: 40, denominator: 1 } },
        methods: [
          { nameKo: "두 직사각형으로 분해", stepsKo: ["아래 직사각형의 넓이는 8 × 4 = 32입니다.", "왼쪽 위 직사각형의 넓이는 4 × 2 = 8입니다.", "겹치지 않으므로 32 + 8 = 40입니다."] },
          { nameKo: "큰 직사각형에서 빼기", stepsKo: ["전체 8 × 6 직사각형의 넓이는 48입니다.", "오른쪽 위 빠진 4 × 2 직사각형의 넓이는 8입니다.", "48 - 8 = 40입니다."] }
        ],
        conclusionKo: "L자 도형의 넓이는 정확히 40제곱단위입니다.",
        verificationKo: "분해한 두 부분의 합과 보완한 큰 직사각형의 차가 모두 40입니다."
      },
      commonMisconceptionKo: "오목한 부분을 포함한 8 × 6을 그대로 답으로 쓰거나, 분해한 직사각형을 겹쳐 더하면 실제 영역과 달라집니다.",
      guidedReflectionKo: "두 방법에서 더한 영역과 뺀 영역을 좌표로 짚어 보며 왜 둘 다 같은 L자 영역을 남기는지 설명해 보세요."
    },
    {
      clusterId: "6.SP.A",
      titleKo: "중심이 같아도 변이는 다를 수 있음을 이해하기",
      conceptExplanationKo: "통계적 질문은 여러 값이 나올 것을 예상합니다. 두 자료의 평균이 같아도 값들이 평균에서 떨어진 정도는 다를 수 있습니다. 평균절대편차는 각 값과 평균 사이 거리의 평균입니다.",
      representation: {
        type: "paired-dot-plots",
        descriptionKo: "자료 A와 B를 같은 눈금의 점그래프에 놓고 중심 8에서 각 점까지의 거리를 비교합니다.",
        visibleFactsKo: ["자료 A는 4, 6, 8, 10, 12입니다.", "자료 B는 7, 7, 8, 9, 9입니다.", "두 자료 모두 같은 눈금과 같은 단위를 사용합니다."],
        singleInterpretation: true,
        hiddenInferenceRequired: false
      },
      workedExample: {
        titleKo: "평균이 같은 두 자료의 퍼짐 비교",
        situationKo: "자료 A와 B의 평균과 평균절대편차를 비교합니다.",
        arithmeticCheck: {
          kind: "mean-mad-comparison",
          dataSets: [
            { label: "A", values: [4, 6, 8, 10, 12], expectedMean: { numerator: 8, denominator: 1 }, expectedMad: { numerator: 12, denominator: 5 } },
            { label: "B", values: [7, 7, 8, 9, 9], expectedMean: { numerator: 8, denominator: 1 }, expectedMad: { numerator: 4, denominator: 5 } }
          ],
          expectedMoreVariable: "A"
        },
        methods: [
          { nameKo: "평균에서 거리 직접 계산", stepsKo: ["두 자료의 합은 각각 40이므로 평균은 모두 40/5 = 8입니다.", "A의 거리 합은 4 + 2 + 0 + 2 + 4 = 12이므로 평균절대편차는 12/5입니다.", "B의 거리 합은 1 + 1 + 0 + 1 + 1 = 4이므로 평균절대편차는 4/5입니다."] },
          { nameKo: "대칭쌍으로 확인", stepsKo: ["A는 8에서 4만큼 떨어진 두 점과 2만큼 떨어진 두 점이 있어 총거리가 2×4 + 2×2 = 12입니다.", "B는 8에서 1만큼 떨어진 네 점이 있어 총거리가 4입니다.", "같은 5개 값으로 나누면 A의 퍼짐이 더 큽니다."] }
        ],
        conclusionKo: "두 평균은 8로 같지만 A의 평균절대편차 12/5가 B의 4/5보다 크므로 A가 더 퍼져 있습니다.",
        verificationKo: "직접 거리 합과 대칭쌍 계산이 각각 A는 12/5, B는 4/5를 줍니다."
      },
      commonMisconceptionKo: "평균이 같으면 두 자료가 같다고 볼 수 없습니다. 중심뿐 아니라 값들이 얼마나 퍼져 있는지도 확인해야 합니다.",
      guidedReflectionKo: "두 자료의 평균이 같지만 점그래프의 모양이 다른 이유를 평균절대편차와 연결해 설명해 보세요."
    },
    {
      clusterId: "6.SP.B",
      titleKo: "분포를 중심·변이·맥락으로 함께 요약하기",
      conceptExplanationKo: "자료 분포를 요약할 때는 대표값 하나만 제시하지 않습니다. 평균이나 중앙값으로 중심을, 범위나 평균절대편차로 변이를 나타내고, 어떤 값이 자료의 모양에 영향을 주는지 맥락과 함께 설명합니다.",
      representation: {
        type: "ordered-list-and-dot-plot",
        descriptionKo: "자료 2, 4, 4, 6, 9를 순서대로 놓고 같은 값 위에 점을 쌓은 점그래프로 나타냅니다.",
        visibleFactsKo: ["자료값은 2, 4, 4, 6, 9 다섯 개입니다.", "자료는 이미 작은 값부터 정렬되어 있습니다.", "모든 값의 단위는 같습니다."],
        singleInterpretation: true,
        hiddenInferenceRequired: false
      },
      workedExample: {
        titleKo: "다섯 값의 분포 요약",
        situationKo: "자료 2, 4, 4, 6, 9의 평균, 중앙값, 범위를 구하고 분포를 설명합니다.",
        arithmeticCheck: { kind: "distribution-summary", values: [2, 4, 4, 6, 9], expectedMean: { numerator: 5, denominator: 1 }, expectedMedian: { numerator: 4, denominator: 1 }, expectedRange: 7 },
        methods: [
          { nameKo: "정의로 계산", stepsKo: ["합은 2 + 4 + 4 + 6 + 9 = 25이므로 평균은 25/5 = 5입니다.", "가운데 셋째 값은 4이므로 중앙값은 4입니다.", "범위는 9 - 2 = 7입니다."] },
          { nameKo: "균형과 위치로 확인", stepsKo: ["평균 5를 기준으로 편차는 -3, -1, -1, +1, +4이고 합은 0이므로 평균 5가 맞습니다.", "양쪽에 두 값씩 남는 가운데 값은 4입니다.", "최솟값 2와 최댓값 9 사이 거리는 7입니다."] }
        ],
        conclusionKo: "평균은 5, 중앙값은 4, 범위는 7이며 큰 값 9 때문에 평균이 중앙값보다 오른쪽으로 이동했습니다.",
        verificationKo: "합과 균형 편차, 정렬 위치와 끝값 차이가 세 요약값을 각각 확인합니다."
      },
      commonMisconceptionKo: "평균 하나만 보고 자료 전체가 5 근처에 모였다고 단정하면 안 됩니다. 중앙값, 범위, 점그래프의 모양도 함께 보아야 합니다.",
      guidedReflectionKo: "값 9가 평균과 중앙값에 각각 어떤 영향을 주었는지 두 대표값의 계산 방법을 이용해 설명해 보세요."
    }
  ];

  function buildLesson(definition) {
    const unit = registry.units.find(function (candidate) { return candidate.grade === 6 && candidate.clusterId === definition.clusterId; });
    if (!unit) fail(`${definition.clusterId} is not a registered Grade 6 cluster`);
    const skillId = registry.skillIdForCluster(definition.clusterId);
    registry.resolveLineage({
      courseId: registry.COURSE_ID,
      unitId: unit.unitId,
      skillId,
      levelId: "core",
      testType: "guided-practice",
      resourceType: "concept-workbook",
      audience: "student"
    });
    return deepFreeze({
      schemaVersion: SCHEMA_VERSION,
      lessonId: `g6-concept-${definition.clusterId.toLowerCase().replace(/\./g, "-")}-v1`,
      lessonVersion: 1,
      publicationState: "public-original-learning-content",
      contentOrigin: "original-authored-no-private-assessment-or-workbook-copy",
      lineage: {
        courseId: registry.COURSE_ID,
        grade: 6,
        unitId: unit.unitId,
        clusterId: unit.clusterId,
        standardRange: unit.standardRange,
        skillId,
        domainCode: unit.domainCode,
        levelId: "core",
        testType: "guided-practice",
        resourceType: "concept-workbook",
        audience: "student",
        sessionId: "g6-w1-s2-concept-model"
      },
      titleKo: definition.titleKo,
      conceptExplanationKo: definition.conceptExplanationKo,
      representation: definition.representation,
      workedExample: Object.assign({}, definition.workedExample, {
        isAssessment: false,
        responseRequired: false,
        fullySolved: true,
        containsAllNeededInformation: true
      }),
      commonMisconceptionKo: definition.commonMisconceptionKo,
      learningSequence: LEARNING_SEQUENCE,
      guidedReflection: {
        instructionKo: definition.guidedReflectionKo,
        responseRequired: false,
        scoringEnabled: false,
        purpose: "self-explanation-after-visible-solved-example"
      },
      checkpointMetadata: {
        checkpointId: `g6-checkpoint-${definition.clusterId.toLowerCase().replace(/\./g, "-")}-v1`,
        checkpointState: "metadata-only-no-embedded-item",
        containsPrompt: false,
        responseCapture: false,
        scoringEnabled: false,
        separateReviewedItemRequired: true,
        teacherAssignmentRequired: true,
        automaticPromotion: false,
        nextDecision: "teacher-assignment-required"
      },
      visibility: {
        singleInterpretation: true,
        visibleInformationComplete: true,
        hiddenPartRequired: false,
        canonicalRepresentationRequired: true
      },
      sourcePolicy: {
        publicExampleKind: "original-worked-example",
        privatePlacementItemCopied: false,
        externalWorkbookCopied: false,
        hiddenKeyPresent: false
      }
    });
  }

  function validateLesson(lesson) {
    if (!isRecord(lesson)) fail("lesson must be an object");
    assertNoForbiddenKeys(lesson, "lesson");
    if (lesson.schemaVersion !== SCHEMA_VERSION || lesson.lessonVersion !== 1) fail("lesson schema or version is invalid");
    requireText(lesson.lessonId, "lesson.lessonId");
    requireText(lesson.titleKo, "lesson.titleKo");
    requireText(lesson.conceptExplanationKo, "lesson.conceptExplanationKo");
    requireText(lesson.commonMisconceptionKo, "lesson.commonMisconceptionKo");
    if (lesson.publicationState !== "public-original-learning-content" || lesson.contentOrigin !== "original-authored-no-private-assessment-or-workbook-copy") fail("lesson publication policy is invalid");
    const unit = registry.units.find(function (candidate) { return candidate.grade === 6 && candidate.clusterId === lesson.lineage.clusterId; });
    if (!unit || lesson.lineage.courseId !== registry.COURSE_ID || lesson.lineage.grade !== 6 || lesson.lineage.unitId !== unit.unitId || lesson.lineage.standardRange !== unit.standardRange || lesson.lineage.domainCode !== unit.domainCode) fail("lesson lineage does not match the Grade 6 registry");
    if (lesson.lineage.skillId !== registry.skillIdForCluster(unit.clusterId)) fail("lesson skill lineage is invalid");
    registry.resolveLineage(lesson.lineage);
    if (lesson.lineage.sessionId !== "g6-w1-s2-concept-model") fail("lesson session is invalid");
    if (!isRecord(lesson.representation)) fail("lesson representation is required");
    requireText(lesson.representation.type, "lesson.representation.type");
    requireText(lesson.representation.descriptionKo, "lesson.representation.descriptionKo");
    denseArray(lesson.representation.visibleFactsKo, "lesson.representation.visibleFactsKo", 3);
    if (lesson.representation.singleInterpretation !== true || lesson.representation.hiddenInferenceRequired !== false) fail("lesson representation visibility is invalid");
    if (!isRecord(lesson.workedExample) || lesson.workedExample.isAssessment !== false || lesson.workedExample.responseRequired !== false || lesson.workedExample.fullySolved !== true || lesson.workedExample.containsAllNeededInformation !== true) fail("worked example must be a fully visible non-assessment example");
    denseArray(lesson.workedExample.methods, "lesson.workedExample.methods", 2);
    if (lesson.workedExample.methods.length !== 2) fail("worked example must have exactly two verification methods");
    lesson.workedExample.methods.forEach(function (method, index) {
      requireText(method.nameKo, `lesson.workedExample.methods[${index}].nameKo`);
      denseArray(method.stepsKo, `lesson.workedExample.methods[${index}].stepsKo`, 2);
      method.stepsKo.forEach(function (step, stepIndex) { requireText(step, `lesson.workedExample.methods[${index}].stepsKo[${stepIndex}]`); });
    });
    if (!verifyArithmeticCheck(lesson.workedExample.arithmeticCheck)) fail("worked example arithmetic invariant failed");
    if (JSON.stringify(lesson.learningSequence) !== JSON.stringify(LEARNING_SEQUENCE)) fail("lesson learning sequence is invalid");
    if (lesson.guidedReflection.responseRequired !== false || lesson.guidedReflection.scoringEnabled !== false) fail("guided reflection must remain ungraded");
    requireText(lesson.guidedReflection.instructionKo, "lesson.guidedReflection.instructionKo");
    if (lesson.checkpointMetadata.checkpointState !== "metadata-only-no-embedded-item" || lesson.checkpointMetadata.containsPrompt !== false || lesson.checkpointMetadata.responseCapture !== false || lesson.checkpointMetadata.scoringEnabled !== false || lesson.checkpointMetadata.separateReviewedItemRequired !== true || lesson.checkpointMetadata.teacherAssignmentRequired !== true || lesson.checkpointMetadata.automaticPromotion !== false || lesson.checkpointMetadata.nextDecision !== "teacher-assignment-required") fail("checkpoint policy is invalid");
    if (lesson.visibility.singleInterpretation !== true || lesson.visibility.visibleInformationComplete !== true || lesson.visibility.hiddenPartRequired !== false) fail("lesson visibility contract is invalid");
    if (lesson.sourcePolicy.privatePlacementItemCopied !== false || lesson.sourcePolicy.externalWorkbookCopied !== false || lesson.sourcePolicy.hiddenKeyPresent !== false) fail("lesson source policy is invalid");
    return true;
  }

  const lessons = deepFreeze(definitions.map(buildLesson));

  function validateAllLessons(candidateLessons) {
    denseArray(candidateLessons, "lessons", 10);
    if (candidateLessons.length !== 10) fail("exactly ten Grade 6 concept lessons are required");
    const expectedClusters = registry.units.filter(function (unit) { return unit.grade === 6; }).map(function (unit) { return unit.clusterId; }).sort();
    const actualClusters = candidateLessons.map(function (lesson) { validateLesson(lesson); return lesson.lineage.clusterId; }).sort();
    if (new Set(actualClusters).size !== 10 || JSON.stringify(actualClusters) !== JSON.stringify(expectedClusters)) fail("lessons must cover every Grade 6 cluster exactly once");
    return true;
  }

  validateAllLessons(lessons);

  return deepFreeze({
    SCHEMA_VERSION,
    LEARNING_SEQUENCE,
    lessons,
    verifyArithmeticCheck,
    validateLesson,
    validateAllLessons
  });
});
