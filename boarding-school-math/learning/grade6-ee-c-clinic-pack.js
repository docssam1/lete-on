(function (root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.GFIELDGrade6EECClinicPack = value;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function freeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { freeze(value[key]); });
    return Object.freeze(value);
  }
  function tr(ko, en, zh) { return freeze({ ko: ko, en: en, "zh-Hans": zh }); }
  function q(numerator, denominator) { return freeze({ numerator: numerator, denominator: denominator == null ? 1 : denominator }); }
  function gcd(left, right) {
    let a = left < 0n ? -left : left; let b = right < 0n ? -right : right;
    while (b) { const next = a % b; a = b; b = next; }
    return a || 1n;
  }
  function rational(numerator, denominator) {
    const n = BigInt(numerator); const d = BigInt(denominator == null ? 1 : denominator);
    if (d === 0n) throw new Error("EEC_ZERO_DENOMINATOR");
    const sign = d < 0n ? -1n : 1n; const divisor = gcd(n, d);
    return freeze({ numerator: sign * n / divisor, denominator: (d < 0n ? -d : d) / divisor });
  }
  function asRational(value) { return rational(value.numerator, value.denominator); }
  function add(left, right) { return rational(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator); }
  function subtract(left, right) { return rational(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator); }
  function multiply(left, right) { return rational(left.numerator * right.numerator, left.denominator * right.denominator); }
  function divide(left, right) {
    if (right.numerator === 0n) throw new Error("EEC_DIVIDE_BY_ZERO");
    return rational(left.numerator * right.denominator, left.denominator * right.numerator);
  }
  function equal(left, right) { return left.numerator === right.numerator && left.denominator === right.denominator; }
  function show(value) { return value.denominator === 1n ? String(value.numerator) : value.numerator + "/" + value.denominator; }
  function item(definition) { return freeze(definition); }

  const WORKBOOK_ITEMS = [
    item({ id:"eec-w01", section:"roles", strand:"variable-roles", level:"foundation", kind:"variable-role", responseFormat:"variable-symbol", prompt:tr("택시 요금 c = 3m + 5에서 m은 이동 거리, c는 요금입니다. m에 따라 값이 정해지는 종속변수를 쓰세요.", "In the taxi rule c = 3m + 5, m is distance and c is cost. Write the dependent variable whose value is determined by m.", "在出租车费用关系c = 3m + 5中，m表示路程，c表示费用。写出由m决定的因变量。"), data:{ independent:"m", dependent:"c", relation:"c = 3m + 5", askRole:"dependent" }, unit:tr("", "", ""), errorCode:"role-reversal" }),
    item({ id:"eec-w02", section:"roles", strand:"variable-roles", level:"core", kind:"variable-role", responseFormat:"variable-symbol", prompt:tr("식 h = 2n + 7에서 n은 지난 주 수, h는 식물의 높이입니다. 종속변수를 쓰세요.", "In h = 2n + 7, n is weeks elapsed and h is plant height. Write the dependent variable.", "在h = 2n + 7中，n表示经过的周数，h表示植物高度。写出因变量。"), data:{ independent:"n", dependent:"h", relation:"h = 2n + 7", askRole:"dependent" }, unit:tr("", "", ""), errorCode:"role-reversal" }),
    item({ id:"eec-w03", section:"roles", strand:"variable-roles", level:"core", kind:"variable-role", responseFormat:"variable-symbol", prompt:tr("전체 가격 p = 4b에서 b는 산 공책 수, p는 전체 가격입니다. 먼저 정할 수 있는 독립변수를 쓰세요.", "In the total-cost rule p = 4b, b is the number of notebooks and p is total cost. Write the independent variable that can be chosen first.", "在总价关系p = 4b中，b表示练习本数量，p表示总价。写出可以先确定的自变量。"), data:{ independent:"b", dependent:"p", relation:"p = 4b", askRole:"independent" }, unit:tr("", "", ""), errorCode:"role-reversal" }),

    item({ id:"eec-w04", section:"evaluate", strand:"evaluate-rule", level:"foundation", kind:"evaluate-rule", responseFormat:"rational-exact", prompt:tr("y = 4x + 3에서 x = 5일 때 y를 구하세요.", "For y = 4x + 3, find y when x = 5.", "在y = 4x + 3中，当x = 5时求y。"), data:{ inputSymbol:"x", outputSymbol:"y", rate:q(4), start:q(3), input:q(5) }, unit:tr("", "", ""), errorCode:"substitution-order" }),
    item({ id:"eec-w05", section:"evaluate", strand:"evaluate-rule", level:"core", kind:"evaluate-rule", responseFormat:"rational-exact", prompt:tr("거리 d = (3/2)t에서 t = 8일 때 d를 구하세요.", "For the distance rule d = (3/2)t, find d when t = 8.", "在路程关系d = (3/2)t中，当t = 8时求d。"), data:{ inputSymbol:"t", outputSymbol:"d", rate:q(3,2), start:q(0), input:q(8) }, unit:tr("킬로미터", "kilometers", "千米"), errorCode:"rate-multiplication" }),
    item({ id:"eec-w06", section:"evaluate", strand:"evaluate-rule", level:"core", kind:"evaluate-rule", responseFormat:"rational-exact", prompt:tr("총비용 C = (9/4)n + 4에서 n = 4일 때 C를 구하세요.", "For C = (9/4)n + 4, find C when n = 4.", "在总费用C = (9/4)n + 4中，当n = 4时求C。"), data:{ inputSymbol:"n", outputSymbol:"C", rate:q(9,4), start:q(4), input:q(4) }, unit:tr("달러", "dollars", "美元"), errorCode:"start-value-omitted" }),

    item({ id:"eec-w07", section:"tables", strand:"table-completion", level:"foundation", kind:"table-output", responseFormat:"rational-exact", prompt:tr("y = 2x + 1 표에서 x = 5인 칸의 y를 구하세요.", "In the table for y = 2x + 1, find y in the row where x = 5.", "在y = 2x + 1的表格中，求x = 5这一行的y。"), data:{ inputSymbol:"x", outputSymbol:"y", rate:q(2), start:q(1), shownInputs:[q(0),q(2),q(5)], targetInput:q(5) }, unit:tr("", "", ""), errorCode:"table-row-mismatch" }),
    item({ id:"eec-w08", section:"tables", strand:"table-completion", level:"core", kind:"table-output", responseFormat:"rational-exact", prompt:tr("p = 3n + 2 표에서 n = 4인 칸의 p를 구하세요.", "In the table for p = 3n + 2, find p in the row where n = 4.", "在p = 3n + 2的表格中，求n = 4这一行的p。"), data:{ inputSymbol:"n", outputSymbol:"p", rate:q(3), start:q(2), shownInputs:[q(1),q(3),q(4)], targetInput:q(4) }, unit:tr("", "", ""), errorCode:"table-row-mismatch" }),
    item({ id:"eec-w09", section:"tables", strand:"table-completion", level:"core", kind:"table-input", responseFormat:"rational-exact", prompt:tr("y = 5x - 1 표에서 y = 24인 칸의 x를 구하세요.", "In the table for y = 5x - 1, find x in the row where y = 24.", "在y = 5x - 1的表格中，求y = 24这一行的x。"), data:{ inputSymbol:"x", outputSymbol:"y", rate:q(5), start:q(-1), targetOutput:q(24), shownInputs:[q(1),q(3),null] }, unit:tr("", "", ""), errorCode:"inverse-table-step" }),

    item({ id:"eec-w10", section:"change", strand:"rate-and-change", level:"foundation", kind:"rate-from-points", responseFormat:"rational-exact", prompt:tr("관계의 두 점이 (2, 7), (5, 19)입니다. x가 1 늘 때 y가 늘어나는 양을 구하세요.", "Two points in a relationship are (2, 7) and (5, 19). Find the increase in y for each increase of 1 in x.", "某关系中的两点是(2, 7)和(5, 19)。求x每增加1时y增加多少。"), data:{ first:[q(2),q(7)], second:[q(5),q(19)] }, unit:tr("", "", ""), errorCode:"change-not-divided" }),
    item({ id:"eec-w11", section:"change", strand:"rate-and-change", level:"core", kind:"output-change", responseFormat:"rational-exact", prompt:tr("y = 3x + 2에서 x가 5만큼 늘면 y는 얼마만큼 늘어납니까?", "For y = 3x + 2, how much does y increase when x increases by 5?", "在y = 3x + 2中，当x增加5时，y增加多少？"), data:{ rate:q(3), deltaInput:q(5) }, unit:tr("", "", ""), errorCode:"start-value-in-change" }),
    item({ id:"eec-w12", section:"change", strand:"rate-and-change", level:"core", kind:"start-from-point", responseFormat:"rational-exact", prompt:tr("y = 4x + b가 점 (4, 18)을 지납니다. 시작값 b를 구하세요.", "The relationship y = 4x + b passes through (4, 18). Find the starting value b.", "关系y = 4x + b经过点(4, 18)。求初始值b。"), data:{ rate:q(4), input:q(4), output:q(18) }, unit:tr("", "", ""), errorCode:"start-value-omitted" })
  ];

  const RECHECK_ITEMS = [
    item({ id:"eec-r01", section:"recheck", strand:"variable-roles", level:"core", kind:"variable-role", responseFormat:"variable-symbol", prompt:tr("식 s = 6d + 1에서 d는 날짜 수, s는 저축액입니다. 종속변수를 쓰세요.", "In s = 6d + 1, d is the number of days and s is savings. Write the dependent variable.", "在s = 6d + 1中，d表示天数，s表示储蓄额。写出因变量。"), data:{ independent:"d", dependent:"s", relation:"s = 6d + 1", askRole:"dependent" }, unit:tr("", "", ""), errorCode:"role-reversal" }),
    item({ id:"eec-r02", section:"recheck", strand:"evaluate-rule", level:"advanced", kind:"evaluate-rule", responseFormat:"rational-exact", prompt:tr("v = (5/2)t + 2에서 t = 6일 때 v를 구하세요.", "For v = (5/2)t + 2, find v when t = 6.", "在v = (5/2)t + 2中，当t = 6时求v。"), data:{ inputSymbol:"t", outputSymbol:"v", rate:q(5,2), start:q(2), input:q(6) }, unit:tr("", "", ""), errorCode:"substitution-order" }),
    item({ id:"eec-r03", section:"recheck", strand:"table-completion", level:"advanced", kind:"table-input", responseFormat:"rational-exact", prompt:tr("y = 3x + 4 표에서 y = 25인 칸의 x를 구하세요.", "In the table for y = 3x + 4, find x in the row where y = 25.", "在y = 3x + 4的表格中，求y = 25这一行的x。"), data:{ inputSymbol:"x", outputSymbol:"y", rate:q(3), start:q(4), targetOutput:q(25), shownInputs:[q(0),q(2),null] }, unit:tr("", "", ""), errorCode:"inverse-table-step" }),
    item({ id:"eec-r04", section:"recheck", strand:"rate-and-change", level:"advanced", kind:"rate-from-points", responseFormat:"rational-exact", prompt:tr("관계의 두 점이 (1, 6), (4, 21)입니다. x가 1 늘 때 y가 늘어나는 양을 구하세요.", "Two points in a relationship are (1, 6) and (4, 21). Find the increase in y for each increase of 1 in x.", "某关系中的两点是(1, 6)和(4, 21)。求x每增加1时y增加多少。"), data:{ first:[q(1),q(6)], second:[q(4),q(21)] }, unit:tr("", "", ""), errorCode:"change-not-divided" })
  ];

  const STRANDS = freeze({
    "variable-roles":tr("독립변수와 종속변수", "Independent and dependent variables", "自变量与因变量"),
    "evaluate-rule":tr("식에 값을 대입하기", "Substitute into a rule", "代入关系式"),
    "table-completion":tr("표의 한 칸 완성하기", "Complete one table entry", "完成表格中的一项"),
    "rate-and-change":tr("변화율과 시작값", "Rate of change and starting value", "变化率与初始值")
  });
  const ERROR_GUIDES = freeze({
    "role-reversal":{ label:tr("독립·종속변수를 뒤바꿈", "Reversed independent and dependent variables", "混淆了自变量和因变量"), prompt:tr("먼저 정하거나 조절하는 양과 그에 따라 정해지는 양을 말로 구분하게 하세요.", "Name the quantity chosen first, then the quantity determined by it.", "先说出可以先确定的量，再说出由它决定的量。") },
    "substitution-order":{ label:tr("대입 뒤 연산 순서 오류", "Operation-order error after substitution", "代入后运算顺序错误"), prompt:tr("입력값을 괄호 안에 넣은 뒤 곱셈을 먼저 하고 시작값을 더하게 하세요.", "Put the input in parentheses, multiply first, then add the starting value.", "把输入值放入括号，先乘，再加上初始值。") },
    "rate-multiplication":{ label:tr("입력값과 변화율을 곱하지 않음", "Did not multiply the input by the rate", "没有把输入值乘以变化率"), prompt:tr("입력 1단위마다 출력이 얼마나 변하는지 확인하고 입력 단위 수만큼 묶으세요.", "Identify the output change per input unit, then make that many input-unit groups.", "先确定输入每增加1单位时输出的变化量，再按输入单位数分组。") },
    "start-value-omitted":{ label:tr("시작값을 빠뜨림", "Omitted the starting value", "漏掉了初始值"), prompt:tr("변화량을 계산한 뒤 x = 0일 때 남는 시작값을 따로 더하거나 빼게 하세요.", "After finding the changing part, add or subtract the value that remains when x = 0.", "求出变化部分后，再加上或减去x = 0时保留的初始值。") },
    "table-row-mismatch":{ label:tr("다른 행의 입력과 출력을 연결함", "Matched values from different table rows", "把不同行的输入和输出配对"), prompt:tr("목표 입력이 있는 한 행만 표시하고 같은 행의 출력 칸을 계산하게 하세요.", "Mark only the row containing the target input and compute the output in that same row.", "只标出含目标输入的那一行，并计算同一行的输出。") },
    "inverse-table-step":{ label:tr("출력에서 입력으로 되돌리지 못함", "Could not work backward from output to input", "不能从输出反推输入"), prompt:tr("출력에서 시작값을 먼저 빼고 변화율로 나누어 입력을 되찾게 하세요.", "Subtract the starting value from the output, then divide by the rate to recover the input.", "先从输出中减去初始值，再除以变化率得到输入。") },
    "change-not-divided":{ label:tr("전체 변화량을 입력 변화량으로 나누지 않음", "Did not divide total output change by input change", "没有用输出总变化量除以输入变化量"), prompt:tr("두 점의 y 차이를 x 차이로 나누어 입력 1단위당 변화를 구하게 하세요.", "Divide the change in y by the change in x to find the change per input unit.", "用y的变化量除以x的变化量，求输入每增加1单位时的变化。") },
    "start-value-in-change":{ label:tr("출력 변화량에 시작값을 다시 더함", "Added the starting value to an output change", "在输出变化量中又加了初始值"), prompt:tr("두 출력의 차를 구할 때 같은 시작값은 서로 없어짐을 식으로 확인하게 하세요.", "Show algebraically that the same starting value cancels when two outputs are subtracted.", "用式子说明两个输出相减时相同的初始值会抵消。") }
  });

  const PACK = freeze({
    schemaVersion:1, id:"gfield-grade6-ee-c-clinic-v1", clusterId:"6.EE.C", standardRange:"6.EE.C.9", learnerStage:"US Grade 6 ages 11-12",
    contentOrigin:"gfield-original-authored-public-clinic", rights:{ publication:"public", assetRights:"original", containsThirdPartyAssets:false },
    scopeNotice:tr("이 공개 클리닉은 6.EE.C.9의 독립·종속변수, 식 대입, 표의 한 칸, 일정한 변화율과 시작값을 연습하고 새 문항으로 확인합니다. 실제 상황에서 변수를 처음 정의하고 식·표·그래프를 직접 만드는 설명은 교사가 별도로 관찰합니다. 이 결과는 비공개 진단 근거를 확장하거나 전체 영역 숙달·승급을 자동 결정하지 않습니다.", "This public clinic practices and rechecks independent and dependent variables, substitution, one missing table entry, constant rate, and starting value in 6.EE.C.9. A teacher separately observes defining variables from a real situation and creating an equation, table, and graph from scratch. Results do not expand private diagnostic evidence or automatically determine full mastery or promotion.", "本公开专项练习用于练习并复测6.EE.C.9中的自变量与因变量、代入、表格单个空项、固定变化率和初始值。根据实际情境独立定义变量，并从头建立关系式、表格和图象，由教师另行观察。本结果不扩展非公开诊断证据，也不自动判定全部掌握或晋级。"),
    title:tr("6.EE.C 변수 관계 클리닉", "6.EE.C Variable Relationships Clinic", "6.EE.C 变量关系专项练习"),
    subtitle:tr("두 양의 역할을 구분하고, 식·표·두 점에서 같은 관계를 읽습니다.", "Distinguish the roles of two quantities and read the same relationship in rules, tables, and pairs of points.", "区分两个量的作用，并从关系式、表格和点对中读出同一关系。"),
    conceptSummary:tr("독립변수는 먼저 정하거나 조절하는 입력이고, 종속변수는 그 입력에 따라 정해지는 출력입니다. y = mx + b에서 m은 입력 1단위당 출력 변화량, b는 입력이 0일 때의 시작값입니다.", "The independent variable is the input chosen first; the dependent variable is the output determined by it. In y = mx + b, m is the output change per input unit and b is the starting value when the input is zero.", "自变量是先确定的输入，因变量是由输入决定的输出。在y = mx + b中，m表示输入每增加1单位时输出的变化量，b表示输入为0时的初始值。"),
    workedExample:{ title:tr("해결 예시 · y = 3x + 2", "Worked example · y = 3x + 2", "例题 · y = 3x + 2"), prompt:tr("x = 4인 행의 y를 구하고 관계를 확인하세요.", "Find y in the row where x = 4 and check the relationship.", "求x = 4这一行的y，并检验关系。"), steps:[tr("x는 먼저 정하는 독립변수이고 y는 그에 따라 정해지는 종속변수입니다.", "x is the independent variable chosen first; y is the dependent variable determined by x.", "x是先确定的自变量，y是由x决定的因变量。"), tr("x = 4를 대입하면 y = 3 × 4 + 2 = 14입니다.", "Substitute x = 4: y = 3 × 4 + 2 = 14.", "代入x = 4：y = 3 × 4 + 2 = 14。"), tr("x가 1 늘 때 y는 3 늘고, x = 0일 때 y = 2이므로 식과 표가 일치합니다.", "Each increase of 1 in x raises y by 3, and y = 2 when x = 0, so the rule and table agree.", "x每增加1，y增加3；当x = 0时y = 2，因此关系式与表格一致。") ] },
    ui:{ titleLead:tr("두 양의 관계를", "Connect two changing quantities.", "连接两个变化的量。"), titleAccent:tr("식·표·변화로 읽기.", "Read rules, tables, and change.", "读懂关系式、表格与变化。"), hero:tr("변수 역할, 식 대입, 표 완성, 변화율과 시작값을 네 묶음으로 학습합니다.", "Learn variable roles, substitution, table completion, rate of change, and starting value in four focused sets.", "分四组学习变量作用、代入、补全表格、变化率和初始值。"), sectionOrder:["roles","evaluate","tables","change","recheck"], sectionLabels:{ roles:tr("1 · 두 변수의 역할", "1 · Roles of two variables", "1 · 两个变量的作用"), evaluate:tr("2 · 식에 입력값 대입", "2 · Substitute an input", "2 · 代入输入值"), tables:tr("3 · 표의 한 칸 완성", "3 · Complete one table entry", "3 · 完成表格中的一项"), change:tr("4 · 변화율과 시작값", "4 · Rate and starting value", "4 · 变化率与初始值"), recheck:tr("새 문항 · 4영역 재확인", "New items · Four-strand recheck", "新题 · 四领域复测") } },
    workbookItems:WORKBOOK_ITEMS, recheckItems:RECHECK_ITEMS, strands:STRANDS, errorGuides:ERROR_GUIDES
  });

  function linearValue(data, input) { return add(multiply(asRational(data.rate), input), asRational(data.start)); }
  function solveItem(candidate) {
    const data = candidate.data;
    if (candidate.kind === "variable-role") return data[data.askRole];
    if (candidate.kind === "evaluate-rule") return linearValue(data, asRational(data.input));
    if (candidate.kind === "table-output") return linearValue(data, asRational(data.targetInput));
    if (candidate.kind === "table-input") return divide(subtract(asRational(data.targetOutput), asRational(data.start)), asRational(data.rate));
    if (candidate.kind === "rate-from-points") {
      return divide(subtract(asRational(data.second[1]), asRational(data.first[1])), subtract(asRational(data.second[0]), asRational(data.first[0])));
    }
    if (candidate.kind === "output-change") return multiply(asRational(data.rate), asRational(data.deltaInput));
    if (candidate.kind === "start-from-point") return subtract(asRational(data.output), multiply(asRational(data.rate), asRational(data.input)));
    throw new Error("EEC_KIND_UNSUPPORTED");
  }
  function formatResult(candidate) { const answer = solveItem(candidate); return typeof answer === "string" ? answer : show(answer); }
  function parseNumber(value) {
    const text = String(value == null ? "" : value).trim().replace(/,/g, "").replace(/[−–—]/g, "-");
    let match = text.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);
    try {
      if (match) return rational(match[1], match[2]);
      match = text.match(/^([+-]?\d+)(?:\.(\d+))?$/);
      if (!match) return null;
      const decimals = match[2] || ""; const denominator = 10n ** BigInt(decimals.length); const sign = text.startsWith("-") ? -1n : 1n;
      return rational(sign * (BigInt(match[1].replace(/^[+-]/, "")) * denominator + BigInt(decimals || "0")), denominator);
    } catch (_error) { return null; }
  }
  function evaluateResponse(candidate, response) {
    const expected = solveItem(candidate);
    if (typeof expected === "string") return String(response == null ? "" : response).trim().toLowerCase() === expected.toLowerCase();
    const actual = parseNumber(response);
    if (!actual || !equal(actual, expected)) return false;
    if (candidate.responseFormat === "whole-number") return actual.denominator === 1n;
    return true;
  }
  function localeKey(locale) { return locale === "zh" ? "zh-Hans" : locale; }
  function hintFor(candidate, locale) { return ERROR_GUIDES[candidate.errorCode].prompt[localeKey(locale)]; }
  function solutionFor(candidate, locale) {
    const key = localeKey(locale); const answer = formatResult(candidate); const data = candidate.data; let copy;
    if (candidate.kind === "variable-role") copy = tr("먼저 정하는 양은 " + data.independent + ", 그에 따라 정해지는 양은 " + data.dependent + "이므로 답은 " + answer + "입니다.", "The quantity chosen first is " + data.independent + "; the quantity determined by it is " + data.dependent + ", so the answer is " + answer + ".", "先确定的量是" + data.independent + "，由它决定的量是" + data.dependent + "，所以答案是" + answer + "。");
    else if (candidate.kind === "evaluate-rule" || candidate.kind === "table-output") copy = tr("입력값을 식에 대입해 변화량을 계산하고 시작값을 반영하면 " + answer + "입니다.", "Substitute the input, compute the changing part, and include the starting value to get " + answer + ".", "把输入值代入，计算变化部分并计入初始值，得到" + answer + "。");
    else if (candidate.kind === "table-input") copy = tr("출력에서 시작값을 빼고 변화율로 나누면 입력은 " + answer + "입니다.", "Subtract the starting value from the output and divide by the rate. The input is " + answer + ".", "从输出中减去初始值，再除以变化率，输入是" + answer + "。");
    else if (candidate.kind === "rate-from-points") copy = tr("y의 변화량을 x의 변화량으로 나누면 입력 1단위당 변화는 " + answer + "입니다.", "Divide the change in y by the change in x. The change per input unit is " + answer + ".", "用y的变化量除以x的变化量，每单位输入的变化是" + answer + "。");
    else if (candidate.kind === "output-change") copy = tr("변화율에 입력 변화량을 곱하면 출력 변화량은 " + answer + "입니다. 시작값은 차를 구할 때 없어집니다.", "Multiply the rate by the input change. The output change is " + answer + "; the starting value cancels in a difference.", "变化率乘以输入变化量，输出变化量是" + answer + "；求差时初始值会抵消。");
    else copy = tr("주어진 점의 출력에서 변화 부분을 빼면 시작값은 " + answer + "입니다.", "Subtract the changing part from the given output. The starting value is " + answer + ".", "从给定输出中减去变化部分，初始值是" + answer + "。");
    return copy[key];
  }
  function esc(value) { return String(value).replace(/[&<>\"]/g, function (char) { return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;" })[char]; }); }
  function renderVisual(candidate) {
    const data = candidate.data;
    if (candidate.kind === "variable-role") return '<div class="clinic-relation-rule"><span>' + esc(data.independent) + '</span><strong>→</strong><span>' + esc(data.dependent) + '</span><small>' + esc(data.relation) + '</small></div>';
    if (candidate.kind === "rate-from-points") return '<div class="clinic-point-pair"><span>(' + esc(show(asRational(data.first[0]))) + ', ' + esc(show(asRational(data.first[1]))) + ')</span><strong>→</strong><span>(' + esc(show(asRational(data.second[0]))) + ', ' + esc(show(asRational(data.second[1]))) + ')</span></div>';
    if (candidate.kind === "table-output" || candidate.kind === "table-input") {
      const inputs = data.shownInputs || [data.targetInput];
      const rows = inputs.map(function (input) {
        if (input === null) return '<tr><td>?</td><td>' + esc(show(asRational(data.targetOutput))) + '</td></tr>';
        const output = linearValue(data, asRational(input)); const blank = candidate.kind === "table-output" && equal(asRational(input), asRational(data.targetInput));
        return '<tr><td>' + esc(show(asRational(input))) + '</td><td>' + (blank ? '?' : esc(show(output))) + '</td></tr>';
      }).join("");
      return '<table class="clinic-relation-table"><thead><tr><th>' + esc(data.inputSymbol) + '</th><th>' + esc(data.outputSymbol) + '</th></tr></thead><tbody>' + rows + '</tbody></table>';
    }
    if (candidate.kind === "evaluate-rule") return '<div class="clinic-substitution-rule"><span>' + esc(data.inputSymbol) + ' = ' + esc(show(asRational(data.input))) + '</span><strong>→</strong><span>' + esc(data.outputSymbol) + ' = ?</span></div>';
    return '<div class="clinic-change-rule"><span>Δ input</span><strong>×</strong><span>rate</span><strong>=</strong><span>Δ output</span></div>';
  }
  function validateItem(candidate) {
    const kinds = new Set(["variable-role","evaluate-rule","table-output","table-input","rate-from-points","output-change","start-from-point"]);
    if (!candidate || !/^eec-[wr]\d{2}$/.test(candidate.id) || !kinds.has(candidate.kind)) throw new Error("EEC_ITEM_INVALID");
    if (!STRANDS[candidate.strand] || !ERROR_GUIDES[candidate.errorCode]) throw new Error("EEC_ALIGNMENT_INVALID");
    ["ko","en","zh-Hans"].forEach(function (locale) { if (!candidate.prompt[locale]) throw new Error("EEC_LOCALE_INVALID"); });
    const answer = solveItem(candidate);
    if (typeof answer !== "string" && answer.denominator === 0n) throw new Error("EEC_ANSWER_INVALID");
    if (candidate.kind === "variable-role" && (!/^[A-Za-z]$/.test(answer) || !["independent","dependent"].includes(candidate.data.askRole))) throw new Error("EEC_ROLE_INVALID");
    if (["evaluate-rule","table-output","table-input"].includes(candidate.kind) && asRational(candidate.data.rate).numerator === 0n) throw new Error("EEC_RATE_INVALID");
    if (candidate.kind === "table-output" && candidate.data.shownInputs.filter(function (value) { return value && equal(asRational(value), asRational(candidate.data.targetInput)); }).length !== 1) throw new Error("EEC_TABLE_TARGET_INVALID");
    if (candidate.kind === "table-input" && candidate.data.shownInputs.filter(function (value) { return value === null; }).length !== 1) throw new Error("EEC_TABLE_BLANK_INVALID");
    if (candidate.kind === "rate-from-points" && equal(asRational(candidate.data.first[0]), asRational(candidate.data.second[0]))) throw new Error("EEC_VERTICAL_PAIR_INVALID");
    return true;
  }
  function validatePack() {
    const all = PACK.workbookItems.concat(PACK.recheckItems);
    if (PACK.workbookItems.length !== 12 || PACK.recheckItems.length !== 4 || new Set(all.map(function (entry) { return entry.id; })).size !== 16) throw new Error("EEC_COUNT_INVALID");
    all.forEach(validateItem);
    if (new Set(PACK.recheckItems.map(function (entry) { return entry.strand; })).size !== 4) throw new Error("EEC_RECHECK_COVERAGE_INVALID");
    return true;
  }
  validatePack();
  return freeze({ schemaVersion:1, pack:PACK, rational:rational, solveItem:solveItem, evaluateResponse:evaluateResponse, formatResult:formatResult, hintFor:hintFor, solutionFor:solutionFor, renderVisual:renderVisual, validateItem:validateItem, validatePack:validatePack });
});
