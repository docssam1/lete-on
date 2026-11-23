(function (root, factory) {
  let value;
  if (typeof module === "object" && module.exports) {
    require("../../geometry/worksheet/render.js");
    value = factory(globalThis.GW_RENDER);
    module.exports = value;
  } else value = factory(root && root.GW_RENDER);
  if (root) root.GFIELDGrade7NSAUnitWorkbook = value;
})(typeof window !== "undefined" ? window : globalThis, function (sharedRenderer) {
  "use strict";

  if (!sharedRenderer || !sharedRenderer.wrapSvg || !sharedRenderer.fmt) throw new Error("G7_NSA_RENDERER_MISSING");
  function freeze(value) { if (!value || typeof value !== "object" || Object.isFrozen(value)) return value; Object.keys(value).forEach(function (key) { freeze(value[key]); }); return Object.freeze(value); }
  function tr(ko, en, zh) { return freeze({ ko: ko, en: en, "zh-Hans": zh }); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const next = a % b; a = b; b = next; } return a || 1; }
  function q(n, d) { if (!d) throw new Error("G7_NSA_ZERO_DENOMINATOR"); const sign = d < 0 ? -1 : 1, divisor = gcd(n, d); return freeze([sign * n / divisor, Math.abs(d) / divisor]); }
  function qeq(a, b) { return a[0] * b[1] === b[0] * a[1]; }
  function qadd(a, b) { return q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function qsub(a, b) { return q(a[0] * b[1] - b[0] * a[1], a[1] * b[1]); }
  function qmul(a, b) { return q(a[0] * b[0], a[1] * b[1]); }
  function qdiv(a, b) { if (!b[0]) throw new Error("G7_NSA_DIVIDE_BY_ZERO"); return q(a[0] * b[1], a[1] * b[0]); }
  function qabs(a) { return q(Math.abs(a[0]), a[1]); }
  function qtext(a) { const sign=a[0]<0?"−":"",numerator=Math.abs(a[0]);return a[1]===1?sign+numerator:sign+numerator+"/"+a[1]; }
  function overbar(digits) { return String(digits).split("").map(function (digit) { return digit + "\u0305"; }).join(""); }
  function terminatingDecimal(text) { return freeze({ display: text, expansionPrefix: text, repeatBlock: "" }); }
  function repeatingDecimal(prefix, repeatBlock, expansionPrefix) {
    if (!repeatBlock || !/^[-−]?\d+\.\d+$/.test(expansionPrefix) || expansionPrefix.includes("…")) throw new Error("G7_NSA_REPEATING_DECIMAL_INVALID");
    return freeze({ display: prefix + overbar(repeatBlock), expansionPrefix: expansionPrefix, repeatBlock: repeatBlock });
  }
  function local(value, locale) { return value[locale] || value.en || value.ko; }
  function choiceLabel(value) { return typeof value === "string" ? tr(value, value, value) : value; }
  function choices(values, correctIndex) { return freeze(values.map(function (value, index) { return freeze({ id: String.fromCharCode(65 + index), label: choiceLabel(value), correct: index === correctIndex }); })); }
  const ANSWER_SLOTS = freeze({
    workbook: [1,3,0,2,2,0,3,1,3,1,2,0,0,2,1,3,1,0,3,2,2,3,0,1,3,2,1,0,0,1,2,3,1,2,3,0],
    recheck: [2,0,3,1,1,3,0,2]
  });
  function answerSlot(id) {
    const match = /-(w|r)(\d{2})$/.exec(id);
    if (!match) throw new Error("G7_NSA_ANSWER_SLOT_ID_INVALID");
    const slots = match[1] === "w" ? ANSWER_SLOTS.workbook : ANSWER_SLOTS.recheck;
    const index = Number(match[2]) - 1;
    if (index < 0 || index >= slots.length) throw new Error("G7_NSA_ANSWER_SLOT_OUT_OF_RANGE");
    return slots[index];
  }
  function choicesAtBalancedSlot(id, values, correctIndex) {
    if (values.length !== 4 || correctIndex < 0 || correctIndex >= values.length) throw new Error("G7_NSA_BALANCED_CHOICE_INVALID");
    const correctValue = values[correctIndex], reordered = values.filter(function (_value, index) { return index !== correctIndex; }), slot = answerSlot(id);
    reordered.splice(slot, 0, correctValue); return choices(reordered, slot);
  }
  function rationalChoices(id, values, expected, unit) {
    const seen = new Set(values.map(qtext));
    if (values.length !== 4 || seen.size !== 4) throw new Error("G7_NSA_DUPLICATE_CHOICE");
    const correct = values.findIndex(function (value) { return qeq(value, expected); });
    if (correct < 0 || values.filter(function (value) { return qeq(value, expected); }).length !== 1) throw new Error("G7_NSA_CHOICE_CARDINALITY");
    return choicesAtBalancedSlot(id, values.map(function (value) { const text = qtext(value); return unit ? tr(text + " " + unit.ko, text + " " + unit.en, text + " " + unit["zh-Hans"]) : text; }), correct);
  }
  function item(value) { return freeze(value); }
  function operationPrompt(left, symbol, right, suffix) {
    return tr(qtext(left) + " " + symbol + " " + qtext(right) + suffix.ko, qtext(left) + " " + symbol + " " + qtext(right) + suffix.en, qtext(left) + " " + symbol + " " + qtext(right) + suffix["zh-Hans"]);
  }
  function binary(id, section, strand, standardId, level, kind, operation, left, right, optionValues, errorCode, prompt) {
    const expected = operation === "add" ? qadd(left, right) : operation === "subtract" ? qsub(left, right) : operation === "multiply" ? qmul(left, right) : qdiv(left, right);
    const symbols = { add: "+", subtract: "−", multiply: "×", divide: "÷" };
    return item({ id: id, section: section, strand: strand, standardIds: [standardId], level: level, kind: kind, responseFormat: "multiple-choice", structureId: kind + "-" + operation, data: { operation: operation, left: left, right: right, expected: expected }, prompt: prompt || operationPrompt(left, symbols[operation], right, tr("의 값을 고르세요.", ". Choose the value.", "。选择正确的值。")), choices: rationalChoices(id, optionValues, expected), errorCode: errorCode });
  }
  function multiOperation(id, standardId, level, values, operations, optionValues, errorCode, prompt) {
    let expected = values[0];
    operations.forEach(function (operation, index) { expected = operation === "add" ? qadd(expected, values[index + 1]) : qsub(expected, values[index + 1]); });
    return item({ id: id, section: "add-subtract", strand: "operation-properties", standardIds: [standardId], level: level, kind: "rational-multi-operation", responseFormat: "multiple-choice", structureId: "rational-properties-" + operations.join("-"), data: { values: freeze(values.slice()), operations: freeze(operations.slice()), expected: expected }, prompt: prompt, choices: rationalChoices(id, optionValues, expected), errorCode: errorCode });
  }
  function multiplyPropertyItem(id, level, propertyModel, values, optionValues, prompt) {
    let expected;
    if (propertyModel === "commutative-associative-inverses") expected = values.reduce(function (result, value) { return qmul(result, value); }, q(1,1));
    else if (propertyModel === "distributive-common-factor") expected = qmul(values[0], qadd(values[1], values[2]));
    else throw new Error("G7_NSA_MULTIPLY_PROPERTY_MODEL_INVALID");
    return item({ id: id, section: "multiply-divide", strand: "multiply-divide-properties", standardIds: ["7.NS.A.2c"], level: level, kind: "rational-multiply-properties", responseFormat: "multiple-choice", structureId: "multiply-properties-" + propertyModel, data: { propertyModel: propertyModel, values: freeze(values.slice()), expected: expected }, prompt: prompt, choices: rationalChoices(id, optionValues, expected), errorCode: "multiply-operation-properties" });
  }
  function numberLine(id, standardId, level, mode, a, b, optionValues, errorCode, prompt, orientation) {
    const expected = mode === "opposite" ? q(-a[0], a[1]) : mode === "distance" ? qabs(qsub(a, b)) : mode === "add" ? qadd(a, b) : qsub(a, b);
    return item({ id: id, section: "number-line", strand: mode === "opposite" ? "opposites" : mode === "distance" ? "absolute-difference" : "number-line-operation", standardIds: [standardId], level: level, kind: "number-line-reasoning", responseFormat: "multiple-choice", structureId: "number-line-" + mode + "-" + (orientation || "horizontal"), data: { mode: mode, a: a, b: b, expected: expected, orientation: orientation || "horizontal" }, prompt: prompt, choices: rationalChoices(id, optionValues, expected), errorCode: errorCode });
  }
  function decimalItem(id, level, value, notation, classification, optionRecords, correctIndex, errorCode) {
    if (optionRecords.length !== 4 || correctIndex < 0 || correctIndex >= optionRecords.length) throw new Error("G7_NSA_DECIMAL_CHOICE_INVALID");
    ["ko","en","zh-Hans"].forEach(function (locale) {
      const matching = optionRecords.map(function (record, index) { const token=/[−-]?\d+\.(?:\d\u0305?)+/u.exec(record[locale]);return token && token[0] === notation.display ? index : -1; }).filter(function (index) { return index >= 0; });
      if (matching.length !== 1 || matching[0] !== correctIndex) throw new Error("G7_NSA_DECIMAL_CHOICE_CARDINALITY:" + id + ":" + locale + ":" + matching.join(","));
    });
    return item({ id: id, section: "decimal-form", strand: "decimal-form", standardIds: ["7.NS.A.2d"], level: level, kind: "decimal-form", responseFormat: "multiple-choice", structureId: "decimal-" + classification + "-" + value[1], data: { value: value, decimalText: notation.display, decimalExpansionPrefix: notation.expansionPrefix, repeatBlock: notation.repeatBlock, classification: classification }, prompt: tr(qtext(value) + "의 소수 표현으로 알맞은 것을 고르세요.", "Choose the correct decimal form of " + qtext(value) + ".", "选择" + qtext(value) + "的正确小数表示。"), choices: choicesAtBalancedSlot(id, optionRecords, correctIndex), errorCode: errorCode });
  }
  function contextItem(id, level, standardId, model, values, optionValues, unit, errorCode, prompt) {
    let expected = values[0];
    model.forEach(function (operation, index) { expected = operation === "add" ? qadd(expected, values[index + 1]) : operation === "subtract" ? qsub(expected, values[index + 1]) : operation === "multiply" ? qmul(expected, values[index + 1]) : qdiv(expected, values[index + 1]); });
    return item({ id: id, section: "context", strand: "rational-context", standardIds: [standardId], level: level, kind: "rational-context", responseFormat: "multiple-choice", structureId: "context-" + model.join("-"), data: { model: freeze(model.slice()), values: freeze(values.slice()), expected: expected, unit: unit }, prompt: prompt, choices: rationalChoices(id, optionValues, expected, unit), errorCode: errorCode });
  }

  const W = freeze([
    binary("g7nsa-w01","add-subtract","rational-addition","7.NS.A.1d","foundation","rational-add-subtract","add",q(-3,4),q(5,8),[q(-1,8),q(1,8),q(-11,8),q(11,8)],"sign-and-common-denominator"),
    binary("g7nsa-w02","add-subtract","rational-addition","7.NS.A.1b","foundation","rational-add-subtract","add",q(7,10),q(-3,5),[q(1,10),q(-1,10),q(4,15),q(13,10)],"sign-and-common-denominator"),
    binary("g7nsa-w03","add-subtract","rational-subtraction","7.NS.A.1c","foundation","rational-add-subtract","subtract",q(2,3),q(5,6),[q(-1,6),q(1,6),q(-1,3),q(7,6)],"subtract-as-add-opposite"),
    binary("g7nsa-w04","add-subtract","rational-subtraction","7.NS.A.1c","core","rational-add-subtract","subtract",q(-5,12),q(-7,18),[q(-1,36),q(1,36),q(-29,36),q(29,36)],"subtract-as-add-opposite"),
    binary("g7nsa-w05","add-subtract","rational-addition","7.NS.A.1d","core","rational-add-subtract","add",q(-11,6),q(7,9),[q(-19,18),q(19,18),q(-25,54),q(-4,15)],"sign-and-common-denominator"),
    binary("g7nsa-w06","add-subtract","rational-subtraction","7.NS.A.1c","core","rational-add-subtract","subtract",q(13,8),q(-5,4),[q(23,8),q(3,8),q(-23,8),q(18,12)],"subtract-as-add-opposite"),
    binary("g7nsa-w07","add-subtract","rational-addition","7.NS.A.1d","core","rational-add-subtract","add",q(-9,14),q(-5,21),[q(-37,42),q(37,42),q(-2,3),q(-4,35)],"sign-and-common-denominator"),
    binary("g7nsa-w08","add-subtract","rational-subtraction","7.NS.A.1c","advanced","rational-add-subtract","subtract",q(-7,15),q(11,20),[q(-61,60),q(61,60),q(1,12),q(-4,5)],"subtract-as-add-opposite"),
    multiOperation("g7nsa-w09","7.NS.A.1d","advanced",[q(-5,6),q(7,12),q(5,6)],["add","add"],[q(7,12),q(-7,12),q(17,12),q(-5,6)],"operation-properties",tr("결합법칙을 이용하여 (−5/6) + 7/12 + 5/6의 합을 구하세요.","Use the associative property to find (−5/6) + 7/12 + 5/6.","运用结合律求(−5/6) + 7/12 + 5/6的和。")),
    multiOperation("g7nsa-w10","7.NS.A.1d","advanced",[q(3,4),q(5,8),q(3,4)],["subtract","subtract"],[q(-5,8),q(5,8),q(-11,8),q(7,8)],"operation-properties",tr("뺄셈을 반대수의 덧셈으로 바꾸어 3/4 − 5/8 − 3/4의 값을 구하세요.","Rewrite subtraction as addition of opposites to find 3/4 − 5/8 − 3/4.","把减法改写为加上相反数，求3/4 − 5/8 − 3/4的值。")),

    numberLine("g7nsa-w11","7.NS.A.1a","foundation","opposite",q(-5,4),q(0,1),[q(5,4),q(-5,4),q(4,5),q(0,1)],"opposite-versus-absolute",tr("계좌 잔액이 5/4달러 감소했습니다. 두 변화의 합이 0이 되도록 이 감소를 정확히 상쇄하는 잔액 변화를 고르세요.","An account balance decreases by 5/4 dollars. Choose the balance change that exactly cancels this decrease so the two changes sum to 0.","账户余额减少了5/4美元。选择能恰好抵消这次减少、使两次变化之和为0的余额变化。")),
    numberLine("g7nsa-w12","7.NS.A.1c","foundation","distance",q(-3,2),q(3,4),[q(9,4),q(-9,4),q(3,4),q(3,8)],"absolute-difference",tr("수직선에서 −3/2와 3/4 사이의 거리를 고르세요.","Choose the distance between −3/2 and 3/4 on the number line.","选择数轴上−3/2与3/4之间的距离。")),
    numberLine("g7nsa-w13","7.NS.A.1b","core","add",q(-7,6),q(2,3),[q(-1,2),q(1,2),q(-3,2),q(5,6)],"number-line-direction",tr("−7/6에서 시작하여 오른쪽으로 2/3만큼 이동한 위치를 고르세요.","Start at −7/6 and move 2/3 unit to the right. Choose the final position.","从−7/6出发，向右移动2/3个单位。选择终点位置。")),
    numberLine("g7nsa-w14","7.NS.A.1b","core","add",q(5,8),q(-7,4),[q(-9,8),q(9,8),q(-19,8),q(-7,8)],"number-line-direction",tr("5/8에서 시작하여 왼쪽으로 7/4만큼 이동한 위치를 고르세요.","Start at 5/8 and move 7/4 units to the left. Choose the final position.","从5/8出发，向左移动7/4个单位。选择终点位置。")),
    numberLine("g7nsa-w15","7.NS.A.1c","core","subtract",q(-2,5),q(9,10),[q(-13,10),q(13,10),q(1,2),q(-11,15)],"subtract-as-add-opposite",tr("−2/5 − 9/10은 수직선에서 어느 위치인지 고르세요.","Choose the position of −2/5 − 9/10 on the number line.","选择−2/5 − 9/10在数轴上的位置。")),
    numberLine("g7nsa-w16","7.NS.A.1c","advanced","distance",q(-11,6),q(5,3),[q(7,2),q(-7,2),q(1,6),q(21,18)],"absolute-difference",tr("수직선에서 −11/6과 5/3 사이의 거리를 고르세요.","Choose the distance between −11/6 and 5/3 on the number line.","选择数轴上−11/6与5/3之间的距离。")),
    numberLine("g7nsa-w17","7.NS.A.1a","advanced","opposite",q(13,9),q(0,1),[q(-13,9),q(13,9),q(-9,13),q(0,1)],"opposite-versus-absolute",tr("13/9의 덧셈에 대한 역원을 고르세요.","Choose the additive inverse of 13/9.","选择13/9的加法逆元。"),"vertical"),
    numberLine("g7nsa-w18","7.NS.A.1b","advanced","add",q(-5,3),q(7,4),[q(1,12),q(-1,12),q(3,7),q(-41,12)],"number-line-direction",tr("−5/3에서 시작하여 세로 수직선의 위쪽으로 7/4만큼 이동한 위치를 고르세요.","Start at −5/3 and move upward 7/4 units on the vertical number line. Choose the final position.","从−5/3出发，在竖直数轴上向上移动7/4个单位。选择终点位置。"),"vertical"),

    binary("g7nsa-w19","multiply-divide","signed-multiplication","7.NS.A.2a","foundation","signed-multiply-divide","multiply",q(-3,5),q(10,9),[q(-2,3),q(2,3),q(-27,50),q(-6,5)],"product-sign"),
    binary("g7nsa-w20","multiply-divide","signed-division","7.NS.A.2b","foundation","signed-multiply-divide","divide",q(-7,8),q(14,3),[q(-3,16),q(3,16),q(-49,24),q(-7,6)],"divide-by-reciprocal"),
    binary("g7nsa-w21","multiply-divide","signed-multiplication","7.NS.A.2a","foundation","signed-multiply-divide","multiply",q(-11,6),q(-9,22),[q(3,4),q(-3,4),q(11,16),q(2,3)],"product-sign"),
    multiplyPropertyItem("g7nsa-w22","core","commutative-associative-inverses",[q(-3,4),q(5,7),q(-4,3)],[q(5,7),q(-5,7),q(15,28),q(20,21)],tr("교환법칙과 결합법칙을 이용해 서로 역수인 두 인수를 먼저 묶어 (−3/4) × 5/7 × (−4/3)의 값을 구하세요.","Use the commutative and associative properties to group the reciprocal factors first, then find (−3/4) × 5/7 × (−4/3).","运用交换律和结合律，先把互为倒数的两个因数结合，求(−3/4) × 5/7 × (−4/3)的值。")),
    binary("g7nsa-w23","multiply-divide","signed-multiplication","7.NS.A.2a","core","signed-multiply-divide","multiply",q(7,15),q(-25,14),[q(-5,6),q(5,6),q(-5,14),q(-7,6)],"product-sign"),
    binary("g7nsa-w24","multiply-divide","signed-division","7.NS.A.2b","core","signed-multiply-divide","divide",q(-13,9),q(-26,15),[q(5,6),q(-5,6),q(338,135),q(10,13)],"divide-by-reciprocal"),
    binary("g7nsa-w25","multiply-divide","signed-multiplication","7.NS.A.2a","core","signed-multiply-divide","multiply",q(-8,21),q(49,16),[q(-7,6),q(7,6),q(-49,36),q(-2,3)],"product-sign"),
    multiplyPropertyItem("g7nsa-w26","advanced","distributive-common-factor",[q(-5,6),q(9,10),q(3,10)],[q(-1,1),q(1,1),q(-3,4),q(-5,3)],tr("분배법칙을 이용하여 (−5/6) × 9/10 + (−5/6) × 3/10의 값을 구하세요.","Use the distributive property to find (−5/6) × 9/10 + (−5/6) × 3/10.","运用分配律求(−5/6) × 9/10 + (−5/6) × 3/10的值。")),
    binary("g7nsa-w27","multiply-divide","signed-multiplication","7.NS.A.2a","advanced","signed-multiply-divide","multiply",q(-15,28),q(-42,25),[q(9,10),q(-9,10),q(21,25),q(3,5)],"product-sign"),
    binary("g7nsa-w28","multiply-divide","signed-division","7.NS.A.2b","advanced","signed-multiply-divide","divide",q(-22,27),q(11,18),[q(-4,3),q(4,3),q(-242,486),q(-11,9)],"divide-by-reciprocal"),

    decimalItem("g7nsa-w29","foundation",q(3,8),terminatingDecimal("0.375"),"terminating",[tr("0.375에서 끝납니다.","It terminates at 0.375.","在0.375处终止。"),tr("0."+overbar("3")+"이고 3이 반복됩니다.","It is 0."+overbar("3")+", with 3 repeating.","它是0."+overbar("3")+"，其中3循环。"),tr("0.38에서 끝납니다.","It terminates at 0.38.","在0.38处终止。"),tr("0."+overbar("375")+"이고 375가 반복됩니다.","It is 0."+overbar("375")+", with 375 repeating.","它是0."+overbar("375")+"，其中375循环。")],0,"decimal-termination"),
    decimalItem("g7nsa-w30","core",q(5,12),repeatingDecimal("0.41","6","0.416666666666"),"repeating",[tr("0.416에서 끝납니다.","It terminates at 0.416.","在0.416处终止。"),tr("0.41"+overbar("6")+"이고 6이 반복됩니다.","It is 0.41"+overbar("6")+", with 6 repeating.","它是0.41"+overbar("6")+"，其中6循环。"),tr("0.45에서 끝납니다.","It terminates at 0.45.","在0.45处终止。"),tr("0.4"+overbar("12")+"이고 12가 반복됩니다.","It is 0.4"+overbar("12")+", with 12 repeating.","它是0.4"+overbar("12")+"，其中12循环。")],1,"decimal-period"),
    decimalItem("g7nsa-w31","core",q(-7,20),terminatingDecimal("−0.35"),"terminating",[tr("−0.35에서 끝납니다.","It terminates at −0.35.","在−0.35处终止。"),tr("0.35에서 끝납니다.","It terminates at 0.35.","在0.35处终止。"),tr("−0.3"+overbar("5")+"이고 5가 반복됩니다.","It is −0.3"+overbar("5")+", with 5 repeating.","它是−0.3"+overbar("5")+"，其中5循环。"),tr("−0.7에서 끝납니다.","It terminates at −0.7.","在−0.7处终止。")],0,"decimal-sign"),
    decimalItem("g7nsa-w32","advanced",q(7,27),repeatingDecimal("0.","259","0.259259259259"),"repeating",[tr("0.259에서 끝납니다.","It terminates at 0.259.","在0.259处终止。"),tr("0."+overbar("27")+"이고 27이 반복됩니다.","It is 0."+overbar("27")+", with 27 repeating.","它是0."+overbar("27")+"，其中27循环。"),tr("0."+overbar("259")+"이고 259가 반복됩니다.","It is 0."+overbar("259")+", with 259 repeating.","它是0."+overbar("259")+"，其中259循环。"),tr("0."+overbar("25")+"이고 25가 반복됩니다.","It is 0."+overbar("25")+", with 25 repeating.","它是0."+overbar("25")+"，其中25循环。")],2,"decimal-period"),

    contextItem("g7nsa-w33","foundation","7.NS.A.3",["add"],[q(-5,2),q(7,4)],[q(-3,4),q(3,4),q(-17,4),q(9,4)],tr("°C","°C","°C"),"context-direction",tr("기온이 −5/2 °C였습니다. 7/4 °C 올랐을 때의 기온을 고르세요.","The temperature was −5/2 °C and rose by 7/4 °C. Choose the new temperature.","气温原为−5/2°C，升高7/4°C。选择新的气温。")),
    contextItem("g7nsa-w34","core","7.NS.A.3",["subtract"],[q(9,4),q(11,3)],[q(-17,12),q(17,12),q(-5,12),q(47,12)],tr("m","m","米"),"context-direction",tr("드론이 기준 고도보다 9/4 m 높은 지점에서 11/3 m 내려갔습니다. 기준 고도에 대한 새 위치를 고르세요.","A drone is 9/4 m above a reference altitude and descends 11/3 m. Choose its new position relative to the reference.","无人机位于基准高度以上9/4米处，又下降11/3米。选择它相对基准高度的新位置。")),
    contextItem("g7nsa-w35","core","7.NS.A.3",["multiply"],[q(-3,8),q(12,1)],[q(-9,2),q(9,2),q(-18,5),q(-3,20)],tr("점","points","分"),"context-rate",tr("실수 한 번마다 점수가 3/8점 줄어듭니다. 같은 실수를 12번 했을 때의 전체 점수 변화를 고르세요.","Each error changes a score by −3/8 point. Choose the total change after 12 errors.","每次错误使分数减少3/8分。选择12次错误后的总分数变化。")),
    contextItem("g7nsa-w36","advanced","7.NS.A.3",["divide"],[q(-7,3),q(4,1)],[q(-7,12),q(7,12),q(-28,3),q(-7,7)],tr("달러/명","dollars per person","美元/人"),"divide-by-reciprocal",tr("총 잔액 변화가 −7/3달러입니다. 이 변화를 4명에게 똑같이 나누어 기록할 때 한 사람당 잔액 변화를 고르세요.","The total balance change is −7/3 dollars. It is recorded equally for four people. Choose the balance change per person.","总余额变化为−7/3美元。把这一变化平均记在4个人名下，选择每个人的余额变化。"))
  ]);

  const R = freeze([
    binary("g7nsa-r01","recheck","rational-subtraction","7.NS.A.1c","core","rational-add-subtract","subtract",q(5,6),q(-7,9),[q(29,18),q(-29,18),q(1,18),q(13,15)],"subtract-as-add-opposite",tr("5/6에서 −7/9를 뺀 값을 고르세요.","Choose the value of 5/6 minus −7/9.","选择5/6减去−7/9的值。")),
    numberLine("g7nsa-r02","7.NS.A.1b","core","add",q(-7,5),q(4,5),[q(-3,5),q(3,5),q(-11,5),q(11,5)],"number-line-direction",tr("세로 수직선에서 −7/5부터 위쪽으로 4/5만큼 이동한 위치를 고르세요.","On a vertical number line, start at −7/5 and move upward 4/5 unit. Choose the final position.","在竖直数轴上，从−7/5出发，向上移动4/5个单位。选择终点位置。"),"vertical"),
    binary("g7nsa-r03","recheck","signed-multiplication","7.NS.A.2a","core","signed-multiply-divide","multiply",q(-14,15),q(-25,21),[q(10,9),q(-10,9),q(11,9),q(5,9)],"product-sign",tr("곱의 부호와 약분을 확인하여 (−14/15) × (−25/21)의 값을 고르세요.","Use sign rules and reduction to choose (−14/15) × (−25/21).","根据符号法则并约分，选择(−14/15) × (−25/21)的值。")),
    contextItem("g7nsa-r04","core","7.NS.A.3",["divide"],[q(-9,4),q(-3,8)],[q(6,1),q(-6,1),q(27,32),q(3,2)],tr("분","minutes","分钟"),"divide-by-reciprocal",tr("잠수정이 1분마다 3/8 m씩 하강하여 위치 변화가 매분 −3/8 m였습니다. 전체 위치 변화가 −9/4 m일 때 몇 분 동안 하강했는지 고르세요.","A submersible descends 3/8 m each minute, so its signed position change is −3/8 m per minute. Its total position change is −9/4 m. Choose how many minutes it descended.","潜水器每分钟下潜3/8米，因此每分钟的位置变化为−3/8米。总位置变化为−9/4米。选择下潜持续了多少分钟。")),
    decimalItem("g7nsa-r05","core",q(13,40),terminatingDecimal("0.325"),"terminating",[tr("0.325에서 끝납니다.","It terminates at 0.325.","在0.325处终止。"),tr("0.32"+overbar("4")+"이고 4가 반복됩니다.","It is 0.32"+overbar("4")+", with 4 repeating.","它是0.32"+overbar("4")+"，其中4循环。"),tr("0.13에서 끝납니다.","It terminates at 0.13.","在0.13处终止。"),tr("0."+overbar("40")+"이고 40이 반복됩니다.","It is 0."+overbar("40")+", with 40 repeating.","它是0."+overbar("40")+"，其中40循环。")],0,"decimal-termination"),
    binary("g7nsa-r06","recheck","signed-division","7.NS.A.2b","advanced","signed-multiply-divide","divide",q(-5,18),q(10,27),[q(-3,4),q(3,4),q(-25,486),q(-4,3)],"divide-by-reciprocal",tr("부호와 역수를 확인하여 (−5/18) ÷ (10/27)의 값을 고르세요.","Use the sign and reciprocal to choose (−5/18) ÷ (10/27).","根据符号与倒数，选择(−5/18) ÷ (10/27)的值。")),
    multiOperation("g7nsa-r07","7.NS.A.1d","advanced",[q(-3,2),q(5,6),q(3,2)],["add","add"],[q(5,6),q(-5,6),q(7,3),q(-3,2)],"operation-properties",tr("연산 성질을 이용하여 (−3/2) + 5/6 + 3/2의 합을 구하세요.","Use operation properties to find (−3/2) + 5/6 + 3/2.","运用运算律求(−3/2) + 5/6 + 3/2的和。")),
    numberLine("g7nsa-r08","7.NS.A.1a","advanced","opposite",q(-17,12),q(0,1),[q(17,12),q(-17,12),q(12,17),q(0,1)],"opposite-versus-absolute",tr("−17/12와 합이 0이 되는 수를 고르세요.","Choose the number whose sum with −17/12 is 0.","选择与−17/12相加得0的数。"))
  ].map(function (candidate) { return item(Object.assign({}, candidate, { section: "recheck" })); }));

  const STRANDS = freeze({
    "rational-addition": tr("1 · 유리수의 덧셈", "1 · Add rational numbers", "1 · 有理数加法"),
    "rational-subtraction": tr("1 · 유리수의 뺄셈", "1 · Subtract rational numbers", "1 · 有理数减法"),
    "operation-properties": tr("1 · 연산 성질을 이용한 계산", "1 · Use operation properties", "1 · 运用运算律计算"),
    opposites: tr("2 · 반대수와 덧셈에 대한 역원", "2 · Opposites and additive inverses", "2 · 相反数与加法逆元"),
    "absolute-difference": tr("2 · 수직선에서의 거리", "2 · Distance on a number line", "2 · 数轴上的距离"),
    "number-line-operation": tr("2 · 수직선에서 덧셈과 뺄셈", "2 · Add and subtract on a number line", "2 · 数轴上的加减法"),
    "signed-multiplication": tr("3 · 부호 있는 수의 곱셈", "3 · Multiply signed rational numbers", "3 · 有符号有理数乘法"),
    "signed-division": tr("3 · 부호 있는 수의 나눗셈", "3 · Divide signed rational numbers", "3 · 有符号有理数除法"),
    "multiply-divide-properties": tr("3 · 연산 성질을 이용한 곱셈", "3 · Multiply using operation properties", "3 · 运用运算律进行乘法"),
    "decimal-form": tr("4 · 유한소수와 순환소수", "4 · Terminating and repeating decimals", "4 · 有限小数与循环小数"),
    "rational-context": tr("5 · 실제 상황의 유리수 연산", "5 · Rational operations in context", "5 · 情境中的有理数运算")
  });
  const ERROR_GUIDES = freeze({
    "sign-and-common-denominator": tr("분모를 같게 만든 뒤 분자의 부호를 포함해 더하세요.", "Use a common denominator, then add the signed numerators.", "先通分，再连同符号一起相加分子。"),
    "subtract-as-add-opposite": tr("뺄셈을 ‘빼는 수의 반대수를 더하기’로 바꾸세요.", "Rewrite subtraction as adding the opposite.", "把减法改写为加上减数的相反数。"),
    "operation-properties": tr("서로 반대인 수를 먼저 묶거나, 뺄셈을 반대수의 덧셈으로 바꾸어 계산 순서를 단순하게 만드세요.", "Group opposites first or rewrite subtraction as addition of opposites to simplify the order of calculation.", "先把互为相反数的数结合，或把减法改写为加上相反数，以简化计算顺序。"),
    "opposite-versus-absolute": tr("반대수는 0에서 같은 거리의 반대편 수입니다. 절댓값과 뜻을 구분하세요.", "An opposite lies the same distance from 0 on the other side. Distinguish it from absolute value.", "相反数在0的另一侧且距离相同，要与绝对值区分。"),
    "absolute-difference": tr("두 수의 차를 구한 뒤 절댓값을 취해 거리를 확인하세요.", "Subtract the two coordinates and take the absolute value for distance.", "两坐标相减后取绝对值，得到距离。"),
    "number-line-direction": tr("양수는 오른쪽, 음수는 왼쪽으로 이동합니다. 시작점과 이동량을 따로 표시하세요.", "Positive change moves right and negative change moves left. Separate the start and the change.", "正变化向右，负变化向左。分别标出起点与变化量。"),
    "product-sign": tr("먼저 곱의 부호를 정한 뒤 분자와 분모를 약분하세요.", "Determine the product sign first, then reduce numerator and denominator.", "先确定积的符号，再约分分子和分母。"),
    "divide-by-reciprocal": tr("나누는 수가 0이 아닌지 확인하고 그 역수를 곱하세요.", "Confirm the divisor is nonzero, then multiply by its reciprocal.", "确认除数不为0，再乘以它的倒数。"),
    "multiply-operation-properties": tr("교환·결합·분배법칙으로 계산하기 쉬운 수를 먼저 묶으세요. 식의 값은 바뀌지 않습니다.", "Use the commutative, associative, or distributive property to group convenient factors without changing the value.", "运用交换律、结合律或分配律先组合便于计算的因数，式子的值不变。"),
    "decimal-termination": tr("기약분수의 분모에 2와 5만 남으면 유한소수입니다.", "A reduced fraction terminates only when its denominator has no prime factors other than 2 and 5.", "最简分数的分母只有质因数2和5时，化为有限小数。"),
    "decimal-period": tr("나눗셈에서 같은 나머지가 다시 나오면 그때부터 같은 숫자 묶음이 반복됩니다.", "When a remainder repeats in long division, the following digit block repeats.", "长除法中余数再次出现时，后面的数字组开始循环。"),
    "decimal-sign": tr("먼저 결과의 부호를 정하고, 분자와 분모의 절댓값으로 소수 부분을 계산하세요.", "Set the sign first, then divide the absolute values for the decimal part.", "先确定结果符号，再用分子分母的绝对值计算小数部分。"),
    "context-direction": tr("기준보다 위·증가는 양수, 아래·감소는 음수로 식에 나타내세요.", "Represent above/increase as positive and below/decrease as negative.", "高于或增加用正数，低于或减少用负数。"),
    "context-rate": tr("한 번의 변화량에 횟수를 곱하고 부호와 단위를 함께 확인하세요.", "Multiply the change per event by the number of events, keeping sign and unit.", "用每次变化量乘次数，并同时检查符号和单位。"),
    "context-multi-step": tr("상황에 나온 순서대로 하나씩 계산하고 각 단계의 부호를 확인하세요.", "Compute in the stated order and check the sign at each step.", "按情境给出的顺序逐步计算，并检查每一步的符号。"),
    "context-order": tr("반복되는 변화부터 곱셈으로 묶은 뒤 시작값에 더하세요.", "Combine the repeated change with multiplication, then add it to the starting value.", "先用乘法合并重复变化，再加到初始值上。")
  });
  const PACK = freeze({
    schemaVersion: 1, id: "gfield-grade7-ns-a-unit-workbook-v1", clusterId: "7.NS.A", standardRange: "7.NS.A.1-3", learnerStage: "US Grade 7 ages 12-13", completionKey: "gfield-unit-workbook:7.NS.A:v1", conceptDelivery: "embedded", contentOrigin: "gfield-original-authored-public-unit-workbook", rights: { publication: "public", assetRights: "original", containsThirdPartyAssets: false }, sourceReuse: { numberLineRenderer: "geometry/worksheet/render.js GW_RENDER primitives" },
    title: tr("7.NS.A 유리수 연산 단원 워크북", "7.NS.A Rational Number Operations Unit Workbook", "7.NS.A 有理数运算单元练习册"),
    subtitle: tr("수직선에서 유리수의 덧셈과 뺄셈을 해석하고, 부호 있는 곱셈·나눗셈과 유한·순환소수, 실제 상황의 연산까지 연결합니다.", "Interpret rational addition and subtraction on number lines, then connect signed multiplication and division, terminating and repeating decimals, and contextual operations.", "在数轴上理解有理数加减法，再联系有符号数乘除法、有限与循环小数，以及情境运算。"),
    scopeNotice: tr("이 책은 미국 7학년 7.NS.A.1-3의 유리수 사칙연산과 소수 표현을 연습합니다. 자동 채점은 선택한 답의 정확성만 확인합니다. 수직선 모델의 설명, 연산 성질의 정당화, 실제 상황에서 식을 스스로 세우는 과정은 선생님이 별도로 확인하며 이 책만으로 배치·승급을 결정하지 않습니다.", "This book practices rational-number operations and decimal forms in US Grade 7 7.NS.A.1-3. Automatic checks verify only the selected answer. A teacher separately reviews number-line explanations, justification with operation properties, and self-created equations for contexts; this book alone does not determine placement or promotion.", "本练习册练习美国七年级7.NS.A.1-3中的有理数四则运算与小数表示。自动核验只检查所选答案。数轴模型说明、运算性质论证及根据情境独立列式由教师另行查看；不能只凭本练习册决定分班或晋级。"),
    conceptPages: freeze([
      freeze({ title: tr("개념 1 · 뺄셈은 반대수를 더하는 것", "Concept 1 · Subtraction means adding the opposite", "概念1 · 减法就是加上相反数"), body: tr("수직선에서 양수는 오른쪽, 음수는 왼쪽으로 이동합니다. a − b는 a + (−b)로 바꾸면 덧셈의 한 규칙으로 계산할 수 있습니다. 두 점 사이의 거리는 좌표의 차의 절댓값입니다.", "On a number line, positive change moves right and negative change moves left. Rewrite a − b as a + (−b) to use one addition rule. Distance between two points is the absolute value of their coordinate difference.", "数轴上正变化向右，负变化向左。把a − b改写为a + (−b)，即可用同一加法规则计算。两点距离是坐标差的绝对值。"), example: tr("−2/3 − 5/6 = −2/3 + (−5/6) = −3/2입니다.", "−2/3 − 5/6 = −2/3 + (−5/6) = −3/2.", "−2/3 − 5/6 = −2/3 + (−5/6) = −3/2。") }),
      freeze({ title: tr("개념 2 · 부호 규칙과 소수 표현", "Concept 2 · Sign rules and decimal forms", "概念2 · 符号法则与小数表示"), body: tr("곱셈과 나눗셈에서 같은 부호의 결과는 양수이고 다른 부호의 결과는 음수입니다. 나눗셈에서는 0으로 나눌 수 없습니다. 기약분수의 분모가 2와 5만을 소인수로 가지면 유한소수이고, 그 밖의 소인수가 있으면 소수 부분이 반복됩니다.", "For multiplication and division, like signs give a positive result and unlike signs give a negative result. Division by zero is undefined. A reduced fraction terminates when its denominator has only 2 and 5 as prime factors; otherwise its decimal digits repeat.", "乘除法中同号得正、异号得负，且不能除以0。最简分数的分母只有质因数2和5时化为有限小数；若还有其他质因数，小数部分会循环。"), example: tr("(−3/4) ÷ (5/8) = (−3/4) × (8/5) = −6/5이고, −6/5 = −1.2에서 끝납니다.", "(−3/4) ÷ (5/8) = (−3/4) × (8/5) = −6/5, and −6/5 terminates at −1.2.", "(−3/4) ÷ (5/8) = (−3/4) × (8/5) = −6/5，而−6/5化为有限小数−1.2。") })
    ]),
    teacherObservation: tr("학생이 뺄셈을 반대수의 덧셈으로 바꾸는지, 수직선의 방향과 계산 부호가 일치하는지 확인하세요. 곱셈·나눗셈에서는 부호를 먼저 정하고 약분하는지, 소수 표현에서는 기약분수의 분모와 실제 나머지 반복을 함께 설명하는지도 기록하세요.", "Check whether the learner rewrites subtraction as addition of the opposite and keeps number-line direction consistent with the sign. For multiplication and division, record whether the learner decides the sign before reducing; for decimals, whether the learner connects the reduced denominator with the actual remainder cycle.", "检查学生能否把减法改写为加上相反数，并使数轴方向与符号一致。乘除法中记录其是否先判断符号再约分；小数表示中记录其能否把最简分母与实际余数循环联系起来。"),
    reflection: tr("유리수 상황을 식과 수직선으로 설명하기", "Explain a rational context with an equation and number line", "用算式和数轴说明有理数情境"),
    reflectionPrompt: tr("온도·높이·잔액 중 하나를 골라 양수와 음수가 함께 나오는 상황을 만드세요. 식을 세우고 수직선에서 이동 방향을 설명한 뒤 답의 단위를 쓰세요.", "Choose temperature, elevation, or balance and create a context using positive and negative values. Write an equation, explain the movement direction on a number line, and include the unit in your answer.", "从温度、高度或余额中选一个，编写同时含正负数的情境。列式并说明数轴上的移动方向，最后写出答案单位。"),
    printPlan: freeze({ paperSizes: ["A4","Letter"], itemsPerPracticePage: 4, studentPages: 12, teacherEdition: true, answerSheetSeparate: true }),
    ui: freeze({ sectionOrder: ["add-subtract","number-line","multiply-divide","decimal-form","context","recheck"], sectionLabels: { "add-subtract": tr("1 · 유리수 덧셈과 뺄셈", "1 · Add and subtract rational numbers", "1 · 有理数加减法"), "number-line": tr("2 · 수직선, 반대수와 거리", "2 · Number lines, opposites, and distance", "2 · 数轴、相反数与距离"), "multiply-divide": tr("3 · 부호 있는 곱셈과 나눗셈", "3 · Signed multiplication and division", "3 · 有符号数乘除法"), "decimal-form": tr("4 · 유한소수와 순환소수", "4 · Terminating and repeating decimals", "4 · 有限小数与循环小数"), context: tr("5 · 실제 상황의 유리수 연산", "5 · Rational operations in context", "5 · 情境中的有理数运算"), recheck: tr("새 문항 · 8가지 구조 재확인", "New items · Eight-structure recheck", "新题 · 八种结构复测") } }),
    workbookItems: W, recheckItems: R, strands: STRANDS, errorGuides: ERROR_GUIDES
  });

  function answerId(candidate) { const found = candidate.choices.filter(function (choice) { return choice.correct; }); if (found.length !== 1) throw new Error("G7_NSA_CHOICE_CARDINALITY"); return found[0].id; }
  function solveItem(candidate) { return answerId(candidate); }
  function evaluateResponse(candidate, response) { return String(response) === solveItem(candidate); }
  function choiceText(candidate, answer, locale) { const choice = candidate.choices.find(function (entry) { return entry.id === answer; }); return choice ? local(choice.label, locale) : ""; }
  function formatResult(candidate) { return choiceText(candidate, solveItem(candidate), "en"); }
  function hintFor(candidate, locale) { return local(ERROR_GUIDES[candidate.errorCode], locale); }
  function joinedExpression(values, operations) { const symbols={add:"+",subtract:"−",multiply:"×",divide:"÷"};return values.map(function(value,index){return(index?" "+symbols[operations[index-1]]+" ":"")+qtext(value);}).join(""); }
  function solutionFor(candidate, locale) {
    const d = candidate.data, result = d.expected ? qtext(d.expected) : d.decimalText;
    let copy;
    if (candidate.kind === "rational-add-subtract") { const equation=joinedExpression([d.left,d.right],[d.operation])+" = "+result;copy=tr("공통분모와 부호를 확인하면 "+equation+"입니다.","Using a common denominator and the signs gives "+equation+".","通分并检查符号，得到"+equation+"。"); }
    else if (candidate.kind === "rational-multi-operation") { const equation=joinedExpression(d.values,d.operations)+" = "+result;copy=tr("반대수를 먼저 묶고 뺄셈을 덧셈으로 바꾸면 "+equation+"입니다.","Group opposites and rewrite subtraction as addition: "+equation+".","先结合相反数并把减法改写为加法，得到"+equation+"。"); }
    else if (candidate.kind === "number-line-reasoning") {
      if(d.mode==="opposite"){const equation=qtext(d.a)+" + "+result+" = 0";copy=tr("0에서 같은 거리의 반대편 수를 고르면 "+equation+"입니다.","The number on the opposite side of 0 gives "+equation+".","取0另一侧等距的数，得到"+equation+"。");}
      else if(d.mode==="distance"){const equation="|"+qtext(d.a)+" − ("+qtext(d.b)+")| = "+result;copy=tr("두 좌표의 차의 절댓값은 "+equation+"입니다.","The absolute difference of the coordinates is "+equation+".","两坐标差的绝对值为"+equation+"。");}
      else {const equation=joinedExpression([d.a,d.b],[d.mode])+" = "+result;copy=tr("시작점에서 부호가 나타내는 방향으로 이동하면 "+equation+"입니다.","Move from the starting point in the direction given by the sign: "+equation+".","从起点按符号所示方向移动，得到"+equation+"。");}
    }
    else if (candidate.kind === "signed-multiply-divide") { const equation=joinedExpression([d.left,d.right],[d.operation])+" = "+result;copy=tr("부호를 먼저 정하고 약분하면 "+equation+"입니다.","Determine the sign first and reduce: "+equation+".","先确定符号再约分，得到"+equation+"。"); }
    else if (candidate.kind === "rational-multiply-properties") copy = candidate.data.propertyModel === "commutative-associative-inverses"
      ? tr("교환법칙과 결합법칙으로 (−3/4)와 (−4/3)을 먼저 묶으면 곱이 1이므로 결과는 " + result + "입니다.", "Commutativity and associativity group (−3/4) with (−4/3); their product is 1, so the result is " + result + ".", "用交换律和结合律先结合(−3/4)与(−4/3)，它们的积是1，所以结果是" + result + "。")
      : tr("분배법칙으로 공통인수 −5/6을 묶으면 (−5/6) × (9/10 + 3/10)이므로 결과는 " + result + "입니다.", "Factor out −5/6 by the distributive property: (−5/6) × (9/10 + 3/10), so the result is " + result + ".", "运用分配律提取公因数−5/6，得到(−5/6) × (9/10 + 3/10)，所以结果是" + result + "。");
    else if (candidate.kind === "decimal-form") copy = tr(qtext(d.value) + " = " + result + "이며 " + (d.classification === "terminating" ? "유한소수" : "순환소수") + "입니다.", qtext(d.value) + " = " + result + ", a " + (d.classification === "terminating" ? "terminating" : "repeating") + " decimal.", qtext(d.value) + " = " + result + "，它是" + (d.classification === "terminating" ? "有限小数" : "循环小数") + "。");
    else { const equation=joinedExpression(d.values,d.model)+" = "+result;copy = tr("상황의 방향과 순서를 식에 반영하면 " + equation + " " + d.unit.ko + "입니다.", "Represent the direction and order: " + equation + " " + d.unit.en + ".", "按情境方向与顺序列式，得到" + equation + " " + d.unit["zh-Hans"] + "。"); }
    return local(copy, locale);
  }
  function esc(value) { return String(value).replace(/[&<>\"]/g, function (character) { return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;" })[character]; }); }
  function visualLabel(ko, en, zh, locale) { return esc(local(tr(ko, en, zh), locale)); }
  function lineVisual(candidate, locale) {
    const d = candidate.data, values = [d.a[0] / d.a[1]], labels = ["A"];
    if (d.mode === "distance") { values.push(d.b[0] / d.b[1]); labels.push("B"); }
    const maxAbs = Math.max.apply(Math, values.map(Math.abs).concat([2])); const extent = Math.max(2, Math.ceil(maxAbs) + 1); const horizontal = d.orientation !== "vertical"; const axisStart = 28, axisEnd = 292, scale = (axisEnd-axisStart)/(2*extent); const signedChange = d.mode === "subtract" ? -d.b[0] : d.b[0]; const direction = ["add","subtract"].includes(d.mode) ? (horizontal ? (signedChange >= 0 ? "right" : "left") : (signedChange >= 0 ? "up" : "down")) : "none"; let body = "";
    if (horizontal) {
      body += '<line class="g7nsa-axis" x1="28" y1="58" x2="292" y2="58"></line>';
      for (let tick=-extent; tick<=extent; tick+=1) { const x=axisStart+(tick+extent)*scale; body += '<line class="g7nsa-tick" x1="'+sharedRenderer.fmt(x)+'" y1="52" x2="'+sharedRenderer.fmt(x)+'" y2="64"></line>'+(tick===0?'<text class="g7nsa-zero" x="'+sharedRenderer.fmt(x)+'" y="80">0</text>':""); }
      values.forEach(function (value,index) { const x=axisStart+(value+extent)*scale; body += '<circle class="g7nsa-given" cx="'+sharedRenderer.fmt(x)+'" cy="58" r="5"></circle><text class="g7nsa-point-label" x="'+sharedRenderer.fmt(x)+'" y="42">'+labels[index]+'</text>'; });
      if (direction !== "none") { const arrowStart=axisStart+(values[0]+extent)*scale,arrowEnd=direction==="right"?Math.min(arrowStart+34,axisEnd-8):Math.max(arrowStart-34,axisStart+8),startText=sharedRenderer.fmt(arrowStart),endText=sharedRenderer.fmt(arrowEnd);body += '<path class="g7nsa-direction-origin" d="M'+startText+' 58V24"></path><path class="g7nsa-direction" d="M'+startText+' 24H'+endText+'" data-origin-x="'+startText+'" data-origin-y="58" data-start-x="'+startText+'" data-start-y="24" data-end-x="'+endText+'" data-end-y="24"></path><path class="g7nsa-direction-head" d="M'+endText+' 24l'+(direction==="right"?-9:9)+' -6v12z"></path>'; }
      return sharedRenderer.wrapSvg(body,{xMin:0,yMin:0,w:320,h:94},"g7nsa-number-line",' role="img" aria-label="'+visualLabel("문제에 주어진 점만 표시한 가로 수직선","Horizontal number line showing only the given points","只标出题目给定点的横向数轴",locale)+'" data-direction="'+direction+'"');
    }
    body += '<line class="g7nsa-axis" x1="160" y1="18" x2="160" y2="282"></line>';
    for (let tick=-extent; tick<=extent; tick+=1) { const y=282-(tick+extent)*scale; body += '<line class="g7nsa-tick" x1="154" y1="'+sharedRenderer.fmt(y)+'" x2="166" y2="'+sharedRenderer.fmt(y)+'"></line>'+(tick===0?'<text class="g7nsa-zero" x="174" y="'+sharedRenderer.fmt(y+4)+'">0</text>':""); }
    values.forEach(function (value,index) { const y=282-(value+extent)*scale; body += '<circle class="g7nsa-given" cx="160" cy="'+sharedRenderer.fmt(y)+'" r="5"></circle><text class="g7nsa-point-label" x="174" y="'+sharedRenderer.fmt(y-7)+'">'+labels[index]+'</text>'; });
    if (direction !== "none") { const arrowStart=282-(values[0]+extent)*scale,arrowEnd=direction==="up"?Math.max(arrowStart-34,26):Math.min(arrowStart+34,274),startText=sharedRenderer.fmt(arrowStart),endText=sharedRenderer.fmt(arrowEnd);body += '<path class="g7nsa-direction-origin" d="M160 '+startText+'H124"></path><path class="g7nsa-direction" d="M124 '+startText+'V'+endText+'" data-origin-x="160" data-origin-y="'+startText+'" data-start-x="124" data-start-y="'+startText+'" data-end-x="124" data-end-y="'+endText+'"></path><path class="g7nsa-direction-head" d="M124 '+endText+'l-6 '+(direction==="up"?9:-9)+'h12z"></path>'; }
    return sharedRenderer.wrapSvg(body,{xMin:40,yMin:0,w:240,h:300},"g7nsa-number-line is-vertical",' role="img" aria-label="'+visualLabel("문제에 주어진 점만 표시한 세로 수직선","Vertical number line showing only the given points","只标出题目给定点的竖直数轴",locale)+'" data-direction="'+direction+'"');
  }
  function renderVisual(candidate, locale) {
    if (candidate.kind === "number-line-reasoning") return '<div class="g7nsa-line-model">'+lineVisual(candidate, locale)+'<p>'+esc(local(tr("A와 B는 문제에 주어진 점만 표시합니다. 목표 위치는 표시하지 않습니다.","A and B mark only the given points. The target is not marked.","A与B只标出题目给定点，不标出目标位置。"),locale))+'</p></div>';
    const d = candidate.data;
    if (candidate.kind === "decimal-form") return '<div class="g7nsa-decimal-model" role="img" aria-label="'+visualLabel("나머지를 확인하는 소수 판별 모형","Decimal-classification model for checking remainders","用余数判断小数类型的模型",locale)+'"><strong>'+esc(qtext(d.value))+'</strong><b>→</b><span>'+esc(local(tr("나머지 확인","check remainders","检查余数"),locale))+'</span><b>→</b><span>?</span></div>';
    if (candidate.kind === "rational-context") { const symbols={add:"+",subtract:"−",multiply:"×",divide:"÷"},parts=[];d.values.forEach(function(value,index){if(index)parts.push('<b>'+symbols[d.model[index-1]]+'</b>');parts.push('<span>'+esc(qtext(value))+'</span>');});return '<div class="g7nsa-context-model" role="img" aria-label="'+visualLabel("상황의 연산 순서를 나타낸 유리수 모형","Rational-number model showing the operation order in context","表示情境运算顺序的有理数模型",locale)+'">'+parts.join("")+'<b>=</b><span>?</span><i>'+esc(local(tr("방향 · 순서 · 단위","direction · order · unit","方向 · 顺序 · 单位"),locale))+'</i></div>'; }
    if (candidate.kind === "rational-multiply-properties") {
      const values=d.values.map(qtext),parts=d.propertyModel==="commutative-associative-inverses"
        ? ['<span>'+esc(values[0])+'</span><b>×</b><span>'+esc(values[1])+'</span><b>×</b><span>'+esc(values[2])+'</span>']
        : ['<span>'+esc(values[0])+' × '+esc(values[1])+'</span><b>+</b><span>'+esc(values[0])+' × '+esc(values[2])+'</span>'];
      return '<div class="g7nsa-operation-model g7nsa-property-model" role="img" aria-label="'+visualLabel("유리수 곱셈의 연산 성질 모형","Operation-property model for rational multiplication","有理数乘法运算律模型",locale)+'">'+parts.join("")+'<b>=</b><span>?</span></div>';
    }
    if (candidate.kind === "rational-multi-operation") { const symbols={add:"+",subtract:"−"},parts=[];d.values.forEach(function(value,index){if(index)parts.push('<b>'+symbols[d.operations[index-1]]+'</b>');parts.push('<span>'+esc(qtext(value))+'</span>');});return '<div class="g7nsa-operation-model" role="img" aria-label="'+visualLabel("유리수의 연산 성질 모형","Operation-property model for rational numbers","有理数运算律模型",locale)+'">'+parts.join("")+'<b>=</b><span>?</span></div>'; }
    const symbol = { add:"+", subtract:"−", multiply:"×", divide:"÷" }[d.operation];
    return '<div class="g7nsa-operation-model" role="img" aria-label="'+visualLabel("유리수의 정확한 연산 모형","Exact-operation model for rational numbers","有理数精确运算模型",locale)+'"><span>'+esc(qtext(d.left))+'</span><b>'+symbol+'</b><span>'+esc(qtext(d.right))+'</span><b>=</b><span>?</span></div>';
  }
  function validatePack() {
    const all = W.concat(R); if (W.length !== 36 || R.length !== 8 || new Set(all.map(function (candidate) { return candidate.id; })).size !== 44) throw new Error("G7_NSA_COUNT_INVALID");
    const counts = Object.fromEntries(["add-subtract","number-line","multiply-divide","decimal-form","context"].map(function (section) { return [section,W.filter(function (candidate) { return candidate.section === section; }).length]; }));
    if (counts["add-subtract"]!==10 || counts["number-line"]!==8 || counts["multiply-divide"]!==10 || counts["decimal-form"]!==4 || counts.context!==4) throw new Error("G7_NSA_SECTION_COUNT_INVALID");
    const coverage = new Set(all.flatMap(function (candidate) { return candidate.standardIds; })); ["7.NS.A.1a","7.NS.A.1b","7.NS.A.1c","7.NS.A.1d","7.NS.A.2a","7.NS.A.2b","7.NS.A.2c","7.NS.A.2d","7.NS.A.3"].forEach(function (id) { if (!coverage.has(id)) throw new Error("G7_NSA_STANDARD_COVERAGE_INVALID"); });
    const propertyItems=W.filter(function(candidate){return candidate.standardIds[0]==="7.NS.A.2c";});if(propertyItems.length!==2||new Set(propertyItems.map(function(candidate){return candidate.data.propertyModel;})).size!==2||propertyItems.some(function(candidate){return candidate.kind!=="rational-multiply-properties";}))throw new Error("G7_NSA_2C_PROPERTY_COVERAGE_INVALID");
    all.forEach(function (candidate) { if (!/^g7nsa-[wr]\d{2}$/.test(candidate.id) || candidate.choices.length !== 4 || candidate.choices.filter(function (choice) { return choice.correct; }).length !== 1 || !ERROR_GUIDES[candidate.errorCode]) throw new Error("G7_NSA_ITEM_INVALID"); ["ko","en","zh-Hans"].forEach(function (locale) { const labels=candidate.choices.map(function(choice){return choice.label[locale];});if (!candidate.prompt[locale] || labels.some(function(label){return !label;}) || new Set(labels).size !== 4) throw new Error("G7_NSA_LOCALE_INVALID"); }); });
    if (new Set(R.map(function (candidate) { return candidate.structureId; })).size !== 8) throw new Error("G7_NSA_RECHECK_STRUCTURE_INVALID"); return true;
  }
  validatePack();
  return freeze({ pack: PACK, solveItem: solveItem, evaluateResponse: evaluateResponse, formatResult: formatResult, choiceLabel: choiceText, hintFor: hintFor, solutionFor: solutionFor, renderVisual: renderVisual, validatePack: validatePack, arithmetic: freeze({ q: q, add: qadd, subtract: qsub, multiply: qmul, divide: qdiv }) });
});
