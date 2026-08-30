(function (root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.GFIELDGrade6EEAClinicPack = value;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function freeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { freeze(value[key]); });
    return Object.freeze(value);
  }
  function tr(ko, en, zh) { return freeze({ ko: ko, en: en, "zh-Hans": zh }); }
  function item(definition) { return freeze(definition); }
  function pow(base, exponent) {
    let result = 1n; let factor = BigInt(base); let count = Number(exponent);
    if (!Number.isInteger(count) || count < 0) throw new Error("EEA_EXPONENT_INVALID");
    while (count > 0) { if (count % 2 === 1) result *= factor; factor *= factor; count = Math.floor(count / 2); }
    return result;
  }

  const WORKBOOK_ITEMS = [
    item({ id: "eea-w01", section: "structure", strand: "whole-number-powers", level: "foundation", kind: "whole-power", responseFormat: "whole-number", prompt: tr("2⁵의 값을 쓰세요.", "Evaluate 2⁵.", "计算2⁵。"), data: { base: 2, exponent: 5 }, unit: tr("", "", ""), errorCode: "power-as-multiplication" }),
    item({ id: "eea-w02", section: "structure", strand: "whole-number-powers", level: "core", kind: "whole-power", responseFormat: "whole-number", prompt: tr("3⁴의 값을 쓰세요.", "Evaluate 3⁴.", "计算3⁴。"), data: { base: 3, exponent: 4 }, unit: tr("", "", ""), errorCode: "power-as-multiplication" }),
    item({ id: "eea-w03", section: "structure", strand: "whole-number-powers", level: "advanced", kind: "power-combination", responseFormat: "whole-number", prompt: tr("2⁵ + 3²의 값을 쓰세요.", "Evaluate 2⁵ + 3².", "计算2⁵ + 3²。"), data: { left: { base: 2, exponent: 5 }, operator: "+", right: { base: 3, exponent: 2 } }, unit: tr("", "", ""), errorCode: "power-as-multiplication" }),
    item({ id: "eea-w04", section: "structure", strand: "expression-language-substitution", level: "foundation", kind: "expression-part", responseFormat: "whole-number", prompt: tr("식 5x + 2x + 7은 몇 개의 항으로 이루어져 있습니까?", "How many terms are in 5x + 2x + 7?", "式子5x + 2x + 7由几项组成？"), data: { part: "term-count", terms: [{ coefficient: 5, variable: "x", exponent: 1 }, { coefficient: 2, variable: "x", exponent: 1 }, { constant: 7 }] }, unit: tr("개 항", "terms", "项"), errorCode: "term-factor-confusion" }),

    item({ id: "eea-w05", section: "evaluate", strand: "expression-language-substitution", level: "foundation", kind: "expression-part", responseFormat: "whole-number", prompt: tr("식 8n + 3에서 n의 계수를 쓰세요.", "Write the numerical coefficient of n in 8n + 3.", "写出式子8n + 3中n的系数。"), data: { part: "coefficient", coefficient: 8 }, unit: tr("", "", ""), errorCode: "term-factor-confusion" }),
    item({ id: "eea-w06", section: "evaluate", strand: "expression-language-substitution", level: "core", kind: "substitution", responseFormat: "whole-number", prompt: tr("m = 3일 때 2m² + 1의 값을 구하세요.", "Evaluate 2m² + 1 when m = 3.", "当m = 3时，求2m² + 1的值。"), data: { values: { m: 3 }, terms: [{ coefficient: 2, variable: "m", exponent: 2 }, { constant: 1 }] }, unit: tr("", "", ""), errorCode: "substitution-order" }),
    item({ id: "eea-w07", section: "evaluate", strand: "property-equivalent-forms", level: "foundation", kind: "equivalent-blank", responseFormat: "whole-number", prompt: tr("모든 x에 대해 7(x + 3) = 7x + □가 되도록 □에 들어갈 수를 쓰세요.", "Write the number that makes 7(x + 3) = 7x + □ true for every x.", "填写一个数，使7(x + 3) = 7x + □对所有x都成立。"), data: { rule: "constant-after-expansion", outerFactor: 7, insideVariableCoefficient: 1, insideConstant: 3, targetVariableCoefficient: 7 }, unit: tr("", "", ""), errorCode: "partial-distribution" }),
    item({ id: "eea-w08", section: "evaluate", strand: "property-equivalent-forms", level: "core", kind: "equivalent-blank", responseFormat: "whole-number", prompt: tr("모든 y에 대해 4(2y + 5) = □y + 20이 되도록 □에 들어갈 수를 쓰세요.", "Write the number that makes 4(2y + 5) = □y + 20 true for every y.", "填写一个数，使4(2y + 5) = □y + 20对所有y都成立。"), data: { rule: "variable-after-expansion", outerFactor: 4, insideVariableCoefficient: 2, insideConstant: 5, targetConstant: 20 }, unit: tr("", "", ""), errorCode: "partial-distribution" }),

    item({ id: "eea-w09", section: "equivalence", strand: "property-equivalent-forms", level: "advanced", kind: "equivalent-blank", responseFormat: "whole-number", prompt: tr("모든 z에 대해 18z + 12 = 6(□z + 2)가 되도록 □에 들어갈 수를 쓰세요.", "Write the number that makes 18z + 12 = 6(□z + 2) true for every z.", "填写一个数，使18z + 12 = 6(□z + 2)对所有z都成立。"), data: { rule: "variable-inside-factor", expandedVariableCoefficient: 18, expandedConstant: 12, outerFactor: 6, insideConstant: 2 }, unit: tr("", "", ""), errorCode: "common-factor" }),
    item({ id: "eea-w10", section: "equivalence", strand: "equivalence-identification", level: "core", kind: "equivalent-blank", responseFormat: "whole-number", prompt: tr("모든 p에 대해 5(3p + 4) = 15p + □가 되도록 □에 들어갈 수를 쓰세요.", "Write the number that makes 5(3p + 4) = 15p + □ true for every p.", "填写一个数，使5(3p + 4) = 15p + □对所有p都成立。"), data: { rule: "constant-after-expansion", outerFactor: 5, insideVariableCoefficient: 3, insideConstant: 4, targetVariableCoefficient: 15 }, unit: tr("", "", ""), errorCode: "equivalence-check" }),
    item({ id: "eea-w11", section: "equivalence", strand: "equivalence-identification", level: "foundation", kind: "equivalent-blank", responseFormat: "whole-number", prompt: tr("4r + 12와 4(r + 3)이 모든 r에서 동치이면 1, 아니면 0을 쓰세요.", "Write 1 if 4r + 12 and 4(r + 3) are equivalent for every r; otherwise write 0.", "若4r + 12与4(r + 3)对所有r都等价，写1；否则写0。"), data: { rule: "binary-coefficient-pair", leftVariableCoefficient: 4, leftConstant: 12, rightVariableCoefficient: 4, rightConstant: 12 }, unit: tr("", "", ""), errorCode: "equivalence-check" }),
    item({ id: "eea-w12", section: "equivalence", strand: "equivalence-identification", level: "advanced", kind: "equivalent-blank", responseFormat: "whole-number", prompt: tr("모든 t에 대해 □(t + 4) = 7t + 28이 되도록 □에 들어갈 수를 쓰세요.", "Write the number that makes □(t + 4) = 7t + 28 true for every t.", "填写一个数，使□(t + 4) = 7t + 28对所有t都成立。"), data: { rule: "outer-factor-for-pair", insideVariableCoefficient: 1, insideConstant: 4, targetVariableCoefficient: 7, targetConstant: 28 }, unit: tr("", "", ""), errorCode: "equivalence-check" })
  ];

  const RECHECK_ITEMS = [
    item({ id: "eea-r01", section: "recheck", strand: "whole-number-powers", level: "advanced", kind: "power-combination", responseFormat: "whole-number", prompt: tr("5³ - 2⁴의 값을 쓰세요.", "Evaluate 5³ - 2⁴.", "计算5³ - 2⁴。"), data: { left: { base: 5, exponent: 3 }, operator: "-", right: { base: 2, exponent: 4 } }, unit: tr("", "", ""), errorCode: "power-as-multiplication" }),
    item({ id: "eea-r02", section: "recheck", strand: "expression-language-substitution", level: "core", kind: "substitution", responseFormat: "whole-number", prompt: tr("직사각형의 둘레 식 P = 2l + 2w에서 l = 8, w = 3일 때 P를 구하세요.", "In P = 2l + 2w, find P when l = 8 and w = 3.", "在P = 2l + 2w中，当l = 8、w = 3时，求P。"), data: { values: { l: 8, w: 3 }, terms: [{ coefficient: 2, variable: "l", exponent: 1 }, { coefficient: 2, variable: "w", exponent: 1 }] }, unit: tr("단위", "units", "个单位"), errorCode: "formula-substitution" }),
    item({ id: "eea-r03", section: "recheck", strand: "property-equivalent-forms", level: "core", kind: "equivalent-blank", responseFormat: "whole-number", prompt: tr("모든 k에 대해 2(3k + 4) = □k + 8이 되도록 □에 들어갈 수를 쓰세요.", "Write the number that makes 2(3k + 4) = □k + 8 true for every k.", "填写一个数，使2(3k + 4) = □k + 8对所有k都成立。"), data: { rule: "variable-after-expansion", outerFactor: 2, insideVariableCoefficient: 3, insideConstant: 4, targetConstant: 8 }, unit: tr("", "", ""), errorCode: "partial-distribution" }),
    item({ id: "eea-r04", section: "recheck", strand: "equivalence-identification", level: "advanced", kind: "equivalent-blank", responseFormat: "whole-number", prompt: tr("3(2s - 5)와 6s - 12가 모든 s에서 동치이면 1, 아니면 0을 쓰세요.", "Write 1 if 3(2s - 5) and 6s - 12 are equivalent for every s; otherwise write 0.", "若3(2s - 5)与6s - 12对所有s都等价，写1；否则写0。"), data: { rule: "binary-coefficient-pair", leftVariableCoefficient: 6, leftConstant: -15, rightVariableCoefficient: 6, rightConstant: -12 }, unit: tr("", "", ""), errorCode: "equivalence-check" })
  ];

  const STRANDS = freeze({
    "whole-number-powers": tr("양의 정수 거듭제곱", "Positive whole-number powers", "正整数幂"),
    "expression-language-substitution": tr("식의 언어와 대입", "Expression language and substitution", "式子的语言与代入"),
    "property-equivalent-forms": tr("성질로 동치식 만들기", "Create equivalent forms with properties", "用运算性质生成等价式"),
    "equivalence-identification": tr("모든 값에서 동치인지 확인", "Identify equivalence for every value", "判断对所有值是否等价")
  });
  const ERROR_GUIDES = freeze({
    "power-as-multiplication": { label: tr("지수를 곱셈으로 오해", "Read the exponent as multiplication", "把指数误读为乘法"), prompt: tr("밑을 지수의 횟수만큼 반복해 곱했는지 확인하게 하세요.", "Ask whether the base was multiplied by itself the exponent number of times.", "让学生确认是否把底数按指数次数重复相乘。") },
    "term-factor-confusion": { label: tr("항·인수·계수 혼동", "Confused terms, factors, and coefficients", "混淆项、因数与系数"), prompt: tr("덧셈과 뺄셈으로 항을 나누고, 한 항 안에서 곱해지는 수를 계수로 찾게 하세요. 식을 말로 읽는 능력은 별도로 관찰합니다.", "Separate terms at addition or subtraction signs, then identify the numerical factor within a term. Observe verbal reading separately.", "按加减号分项，再找出每项中的数值因数；口头读式需另行观察。") },
    "substitution-order": { label: tr("대입 뒤 연산 순서 누락", "Lost operation order after substitution", "代入后忽略运算顺序"), prompt: tr("문자를 수로 바꾼 뒤 지수, 곱셈, 덧셈·뺄셈 순서로 계산하게 하세요.", "Replace the variable, then evaluate powers, multiplication, and addition or subtraction in order.", "先用数替换字母，再按幂、乘法、加减法的顺序计算。") },
    "formula-substitution": { label: tr("공식의 문자값 일부 누락", "Omitted a value in a formula", "公式代入时遗漏数值"), prompt: tr("공식의 각 문자 아래에 주어진 값을 먼저 적고 계산하게 하세요.", "Write each given value under its variable before calculating.", "先把每个已知数写在对应字母下再计算。") },
    "partial-distribution": { label: tr("한 항에만 분배", "Distributed to only one term", "只分配到一项"), prompt: tr("괄호 밖의 수가 괄호 안의 모든 항에 곱해지는지 색으로 짝지어 보게 하세요.", "Match the outside factor to every term inside the parentheses.", "让学生把括号外的因数与括号内每一项一一配对。") },
    "common-factor": { label: tr("공통인수로 묶을 때 계수 오류", "Incorrect coefficient when factoring", "提取公因数时系数错误"), prompt: tr("바깥 인수를 다시 분배해 원래 두 항이 모두 나오는지 확인하게 하세요.", "Distribute the outside factor again and check that both original terms return.", "再次分配括号外的因数，检查能否还原原来的两项。") },
    "equivalence-check": { label: tr("한 값에서만 같은 식으로 판단", "Checked equivalence at only one value", "只用一个数值判断等价"), prompt: tr("분배법칙으로 두 식의 각 항 계수가 모두 같은지 확인하게 하세요. 동치 이유 설명은 교사가 별도로 관찰합니다.", "Use distribution to compare every coefficient. A teacher separately observes the explanation of why the expressions are equivalent.", "用分配律比较每一项的系数；等价理由由教师另行观察。") }
  });

  const PACK = freeze({
    schemaVersion: 1, id: "gfield-grade6-ee-a-clinic-v1", clusterId: "6.EE.A", standardRange: "6.EE.A.1-4", learnerStage: "US Grade 6 ages 11-12",
    contentOrigin: "gfield-original-authored-public-clinic", rights: { publication: "public", assetRights: "original", containsThirdPartyAssets: false },
    scopeNotice: tr("이 공개 클리닉은 6.EE.A.1-4의 거듭제곱 값, 식의 일부 구조, 대입 계산, 동치식의 제한된 숫자 근거만 확인합니다. 지수 표기를 읽고 쓰기, 상황을 식으로 나타내기, 동치 이유 설명은 교사가 별도로 관찰하며 전체 영역 숙달이나 승급을 자동 결정하지 않습니다.", "This public clinic checks limited numeric evidence for powers, selected expression structure, substitution, and equivalent expressions in 6.EE.A.1-4. A teacher separately observes reading and writing exponent notation, representing situations with expressions, and explaining equivalence; it does not automatically determine full mastery or promotion.", "本公开练习只检查6.EE.A.1-4中幂的值、部分式子结构、代入计算和等价式的有限数值证据。指数记法的读写、用式子表示情境以及说明等价理由由教师另行观察，不自动判定全部掌握或晋级。"),
    title: tr("6.EE.A 식의 구조와 동치식 클리닉", "6.EE.A Expression Structure and Equivalence Clinic", "6.EE.A 式子结构与等价式专项练习"),
    subtitle: tr("거듭제곱을 계산하고, 항과 계수를 읽고, 값을 대입하며, 분배법칙으로 동치식을 확인합니다.", "Evaluate powers, read terms and coefficients, substitute values, and verify equivalent expressions with distribution.", "计算幂，识别项与系数，代入求值，并用分配律检验等价式。"),
    conceptSummary: tr("지수는 같은 밑을 반복해 곱하는 횟수입니다. 식은 항과 인수로 이루어지고, 문자의 값이 주어지면 연산 순서에 따라 계산합니다. 분배법칙은 괄호 밖의 인수를 괄호 안의 모든 항에 곱하므로 식의 모양이 달라도 같은 값을 나타낼 수 있습니다.", "An exponent tells how many times the base is used as a factor. Expressions contain terms and factors; when variable values are given, evaluate in operation order. Distribution multiplies the outside factor by every inside term, so differently written expressions can represent the same value.", "指数表示底数作为因数重复出现的次数。式子由项和因数组成；给定字母值后按运算顺序计算。分配律把括号外的因数乘到括号内每一项，因此不同形式的式子可以表示相同的值。"),
    workedExample: { title: tr("해결 예시 · 3(2³ + 4) - 5", "Worked example · 3(2³ + 4) - 5", "例题 · 3(2³ + 4) - 5"), prompt: tr("식의 구조를 안쪽부터 계산하고 분배법칙으로 다시 확인하세요.", "Evaluate from the inside, then verify by distribution.", "从括号内部开始计算，再用分配律检验。"), steps: [tr("2³ = 2 × 2 × 2 = 8입니다.", "2³ = 2 × 2 × 2 = 8.", "2³ = 2 × 2 × 2 = 8。"), tr("괄호 안은 8 + 4 = 12이고, 3 × 12 - 5 = 31입니다.", "Inside the parentheses, 8 + 4 = 12; then 3 × 12 - 5 = 31.", "括号内8 + 4 = 12，再算3 × 12 - 5 = 31。"), tr("분배하면 3 × 8 + 3 × 4 - 5 = 24 + 12 - 5 = 31로 같습니다.", "Distribution gives 3 × 8 + 3 × 4 - 5 = 24 + 12 - 5 = 31.", "分配后得到3 × 8 + 3 × 4 - 5 = 24 + 12 - 5 = 31。") ] },
    ui: { titleLead: tr("식의 구조를", "See the structure.", "看懂结构，"), titleAccent: tr("읽고 계산하고 확인하기.", "Evaluate and verify.", "计算并验证。"), hero: tr("거듭제곱·항과 계수·대입 계산·동치식을 세 묶음으로 연습하고 새 문항으로 다시 확인합니다.", "Practice powers, terms and coefficients, substitution, and equivalence in three sets, then recheck with new items.", "分三组练习幂、项与系数、代入计算和等价式，再用新题复测。"), sectionOrder: ["structure", "evaluate", "equivalence", "recheck"], sectionLabels: { structure: tr("1 · 거듭제곱과 식의 구조", "1 · Powers and expression structure", "1 · 幂与式子结构"), evaluate: tr("2 · 식 읽기·대입·변환", "2 · Read, substitute, and transform", "2 · 识读、代入与变形"), equivalence: tr("3 · 분배법칙과 동치식", "3 · Distribution and equivalence", "3 · 分配律与等价式"), recheck: tr("새 문항 · 4영역 재확인", "New items · Four-strand recheck", "新题 · 四领域复测") } },
    workbookItems: WORKBOOK_ITEMS, recheckItems: RECHECK_ITEMS, strands: STRANDS, errorGuides: ERROR_GUIDES
  });

  function evaluateTerm(term, values) {
    if (Object.prototype.hasOwnProperty.call(term, "constant")) return BigInt(term.constant);
    let result = BigInt(term.coefficient);
    const variables = term.variables || [{ name: term.variable, exponent: term.exponent || 1 }];
    variables.forEach(function (entry) {
      if (!Object.prototype.hasOwnProperty.call(values, entry.name)) throw new Error("EEA_VARIABLE_VALUE_MISSING");
      result *= pow(values[entry.name], entry.exponent || 1);
    });
    return result;
  }
  function solveItem(candidate) {
    const data = candidate.data;
    if (candidate.kind === "whole-power") return pow(data.base, data.exponent);
    if (candidate.kind === "power-combination") {
      const left = pow(data.left.base, data.left.exponent); const right = pow(data.right.base, data.right.exponent);
      return data.operator === "+" ? left + right : left - right;
    }
    if (candidate.kind === "expression-part") {
      if (data.part === "term-count") return BigInt(data.terms.length);
      if (data.part === "coefficient") return BigInt(data.coefficient);
    }
    if (candidate.kind === "substitution") return data.terms.reduce(function (sum, term) { return sum + evaluateTerm(term, data.values); }, 0n);
    if (candidate.kind === "equivalent-blank") {
      if (data.rule === "constant-after-expansion") {
        if (BigInt(data.outerFactor) * BigInt(data.insideVariableCoefficient) !== BigInt(data.targetVariableCoefficient)) throw new Error("EEA_VARIABLE_PAIR_MISMATCH");
        return BigInt(data.outerFactor) * BigInt(data.insideConstant);
      }
      if (data.rule === "variable-after-expansion") {
        if (BigInt(data.outerFactor) * BigInt(data.insideConstant) !== BigInt(data.targetConstant)) throw new Error("EEA_CONSTANT_PAIR_MISMATCH");
        return BigInt(data.outerFactor) * BigInt(data.insideVariableCoefficient);
      }
      if (data.rule === "variable-inside-factor") {
        const numerator = BigInt(data.expandedVariableCoefficient); const denominator = BigInt(data.outerFactor);
        if (BigInt(data.outerFactor) * BigInt(data.insideConstant) !== BigInt(data.expandedConstant)) throw new Error("EEA_CONSTANT_PAIR_MISMATCH");
        if (numerator % denominator !== 0n) throw new Error("EEA_NONINTEGER_BLANK");
        return numerator / denominator;
      }
      if (data.rule === "binary-coefficient-pair") return data.leftVariableCoefficient === data.rightVariableCoefficient && data.leftConstant === data.rightConstant ? 1n : 0n;
      if (data.rule === "outer-factor-for-pair") {
        const numerator = BigInt(data.targetVariableCoefficient); const denominator = BigInt(data.insideVariableCoefficient);
        if (denominator === 0n || numerator % denominator !== 0n) throw new Error("EEA_NONINTEGER_BLANK");
        const answer = numerator / denominator;
        if (answer * denominator !== numerator) throw new Error("EEA_VARIABLE_PAIR_MISMATCH");
        if (answer * BigInt(data.insideConstant) !== BigInt(data.targetConstant)) throw new Error("EEA_PAIR_NOT_EQUIVALENT");
        return answer;
      }
    }
    throw new Error("EEA_KIND_UNSUPPORTED");
  }
  function parseWhole(value) {
    const text = String(value == null ? "" : value).trim().replace(/[−–—]/g, "-");
    return /^-?\d+$/.test(text) ? BigInt(text) : null;
  }
  function evaluateResponse(candidate, response) { const actual = parseWhole(response); return actual !== null && actual === solveItem(candidate); }
  function formatResult(candidate) { return String(solveItem(candidate)); }
  function hintFor(candidate, locale) { const key = locale === "zh" ? "zh-Hans" : locale; const guide = ERROR_GUIDES[candidate.errorCode]; return guide.prompt[key] || guide.prompt.en; }
  function solutionFor(candidate, locale) {
    const key = locale === "zh" ? "zh-Hans" : locale; const d = candidate.data; const answer = formatResult(candidate); let copy;
    if (candidate.kind === "whole-power") copy = tr(d.base + "을(를) " + d.exponent + "번 반복해 곱하면 " + answer + "입니다.", "Multiply " + d.base + " by itself " + d.exponent + " times to get " + answer + ".", "把" + d.base + "连续相乘" + d.exponent + "次，得到" + answer + "。");
    else if (candidate.kind === "power-combination") copy = tr("각 거듭제곱을 먼저 계산한 뒤 " + d.operator + " 연산을 하면 " + answer + "입니다.", "Evaluate each power first, then apply " + d.operator + " to get " + answer + ".", "先分别计算两个幂，再进行" + d.operator + "运算，得到" + answer + "。");
    else if (candidate.kind === "expression-part") copy = d.part === "term-count" ? tr("덧셈이나 뺄셈 기호를 경계로 항을 나누면 " + answer + "개입니다.", "Separate at addition or subtraction signs: there are " + answer + " terms.", "按加减号分项，共有" + answer + "项。") : tr("문자 n에 곱해진 수는 " + answer + "입니다.", "The numerical factor multiplying n is " + answer + ".", "与n相乘的数是" + answer + "。");
    else if (candidate.kind === "substitution") copy = tr("주어진 값을 문자 자리에 넣고 지수와 곱셈을 먼저 계산하면 " + answer + "입니다.", "Substitute the given value, then evaluate powers and multiplication first: " + answer + ".", "把已知数代入字母，再先算幂和乘法，得到" + answer + "。");
    else if (d.rule === "binary-coefficient-pair") copy = answer === "1" ? tr("분배한 뒤 변수의 계수와 상수항이 각각 같으므로 두 식은 모든 값에서 동치입니다.", "After distribution, both the variable coefficient and constant term match, so the expressions are equivalent for every value.", "分配后，字母的系数和常数项分别相同，所以两个式子对所有值都等价。") : tr("분배한 뒤 상수항이 서로 다르므로 두 식은 모든 값에서 동치가 아닙니다.", "After distribution, the constant terms differ, so the expressions are not equivalent for every value.", "分配后常数项不同，所以两个式子并非对所有值都等价。");
    else copy = tr("분배법칙으로 괄호 안의 모든 항에 바깥 인수를 곱하면 빈칸은 " + answer + "입니다.", "Distribute the outside factor to every inside term; the blank is " + answer + ".", "把括号外的因数乘到括号内每一项，空格是" + answer + "。");
    return copy[key];
  }
  function validateItem(candidate) {
    const kinds = new Set(["whole-power", "power-combination", "expression-part", "substitution", "equivalent-blank"]);
    if (!candidate || !/^eea-[wr]\d{2}$/.test(candidate.id) || !kinds.has(candidate.kind)) throw new Error("EEA_ITEM_INVALID");
    if (!STRANDS[candidate.strand] || !ERROR_GUIDES[candidate.errorCode]) throw new Error("EEA_ALIGNMENT_INVALID");
    ["ko", "en", "zh-Hans"].forEach(function (key) { if (!candidate.prompt[key]) throw new Error("EEA_LOCALE_INVALID"); });
    const answer = solveItem(candidate); if (answer < 0n) throw new Error("EEA_RESULT_INVALID");
    return true;
  }
  function validatePack() {
    const all = PACK.workbookItems.concat(PACK.recheckItems);
    if (PACK.workbookItems.length !== 12 || PACK.recheckItems.length !== 4 || new Set(all.map(function (entry) { return entry.id; })).size !== 16) throw new Error("EEA_COUNT_INVALID");
    all.forEach(validateItem);
    const coverage = new Set(PACK.recheckItems.map(function (entry) { return entry.strand; }));
    Object.keys(STRANDS).forEach(function (strand) { if (!coverage.has(strand)) throw new Error("EEA_RECHECK_COVERAGE_INVALID"); });
    return true;
  }
  validatePack();
  return freeze({ schemaVersion: 1, pack: PACK, solveItem: solveItem, evaluateResponse: evaluateResponse, formatResult: formatResult, hintFor: hintFor, solutionFor: solutionFor, validateItem: validateItem, validatePack: validatePack });
});
