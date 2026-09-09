(function (root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.GFIELDGrade7RPAUnitWorkbook = value;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function freeze(value) { if (!value || typeof value !== "object" || Object.isFrozen(value)) return value; Object.keys(value).forEach(function (key) { freeze(value[key]); }); return Object.freeze(value); }
  function tr(ko, en, zh) { return freeze({ ko: ko, en: en, "zh-Hans": zh }); }
  function item(value) { return freeze(value); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const next = a % b; a = b; b = next; } return a || 1; }
  function fraction(n, d) { const sign = d < 0 ? -1 : 1, divisor = gcd(n, d); return [sign * n / divisor, Math.abs(d) / divisor]; }
  function fractionText(pair) { return pair[1] === 1 ? String(pair[0]) : pair[0] + "/" + pair[1]; }
  function choices(values, correct) { return freeze(values.map(function (value, index) { return freeze({ id: String.fromCharCode(65 + index), label: typeof value === "string" ? tr(value, value, value) : value, correct: index === correct }); })); }
  function answerId(candidate) { const correct = candidate.choices.filter(function (choice) { return choice.correct; }); if (correct.length !== 1) throw new Error("G7_RPA_CHOICE_CARDINALITY"); return correct[0].id; }
  function rate(id, distance, time, options, correct, level) {
    const expected = fraction(distance[0] * time[1], distance[1] * time[0]);
    return item({ id: id, section: "fraction-rate", strand: "fractional-unit-rate", standardIds: ["7.RP.A.1"], level: level, kind: "fraction-rate", responseFormat: "multiple-choice", data: { distance: distance, time: time, expected: expected, unit: "km/h" }, prompt: tr("한 주자가 " + fractionText(distance) + " km를 " + fractionText(time) + "시간 동안 일정하게 달렸습니다. 단위율은 몇 km/h입니까?", "A runner travels " + fractionText(distance) + " km in " + fractionText(time) + " hour at a constant rate. What is the unit rate in km/h?", "一名跑者以恒定速度在" + fractionText(time) + "小时内跑了" + fractionText(distance) + "千米。单位率是多少千米/小时？"), choices: choices(options.map(function (value) { return value + " km/h"; }), correct), errorCode: "divide-by-fraction-direction" });
  }
  function table(id, pairs, proportional, level) {
    return item({ id: id, section: "relationships", strand: "recognize-proportionality", standardIds: ["7.RP.A.2a"], level: level, kind: "table-proportional", responseFormat: "multiple-choice", data: { pairs: pairs, proportional: proportional }, prompt: tr("표의 x와 y의 관계는 비례관계입니까?", "Is the relationship between x and y in the table proportional?", "表中x和y的关系是正比例关系吗？"), choices: choices([tr("예, y/x가 일정합니다.", "Yes, y/x is constant.", "是，y/x保持不变。"), tr("아니요, y/x가 일정하지 않습니다.", "No, y/x is not constant.", "不是，y/x不保持不变。"), tr("x와 y가 모두 증가하므로 비례입니다.", "Yes, because both x and y increase.", "是，因为x和y都增加。"), tr("표만으로는 판단할 수 없습니다.", "The table gives no information.", "仅凭表格无法判断。")], proportional ? 0 : 1), errorCode: "additive-pattern-for-proportion" });
  }
  function constant(id, pairs, options, correct, level) {
    const expected = fraction(pairs[0][1], pairs[0][0]);
    return item({ id: id, section: "relationships", strand: "constant-of-proportionality", standardIds: ["7.RP.A.2b"], level: level, kind: "table-constant", responseFormat: "multiple-choice", data: { pairs: pairs, expected: expected }, prompt: tr("표가 y = kx인 비례관계를 나타낼 때, 비례상수 k는 무엇입니까?", "The table represents y = kx. What is the constant of proportionality k?", "该表表示y = kx的正比例关系。比例常数k是多少？"), choices: choices(options.map(function (value) { return "k = " + value; }), correct), errorCode: "inverse-rate" });
  }
  function equation(id, k, options, correct, level) {
    return item({ id: id, section: "representation", strand: "equation-from-proportion", standardIds: ["7.RP.A.2c"], level: level, kind: "equation-model", responseFormat: "multiple-choice", data: { k: k }, prompt: tr("원점을 지나고 x가 1만큼 늘 때마다 y가 " + fractionText(k) + "만큼 늘어나는 비례관계를 나타내는 식을 고르세요.", "Choose the equation for a proportional relationship through the origin in which y increases by " + fractionText(k) + " for each increase of 1 in x.", "选择表示一个过原点的正比例关系的方程：x每增加1，y增加" + fractionText(k) + "。"), choices: choices(options, correct), errorCode: "missing-origin-or-constant" });
  }
  function point(id, k, x, options, correct, level) {
    const y = k[0] * x / k[1];
    return item({ id: id, section: "representation", strand: "point-meaning", standardIds: ["7.RP.A.2d"], level: level, kind: "point-meaning", responseFormat: "multiple-choice", data: { k: k, x: x, y: y }, prompt: tr("그래프 y = " + fractionText(k) + "x 위의 점 (" + x + ", " + y + ")의 뜻으로 알맞은 것을 고르세요. x는 시간(시간), y는 거리(km)입니다.", "Choose the meaning of the point (" + x + ", " + y + ") on y = " + fractionText(k) + "x. Here x is time in hours and y is distance in kilometers.", "在图像y = " + fractionText(k) + "x上，点(" + x + "，" + y + ")表示什么？x是时间（小时），y是距离（千米）。"), choices: choices(options, correct), errorCode: "coordinate-order-or-unit" });
  }
  function percent(id, start, first, second, options, correct, level, firstWord, secondWord) {
    const firstMultiplier = firstWord === "discount" ? 100 - first : 100 + first;
    const secondMultiplier = secondWord === "discount" ? 100 - second : 100 + second;
    const expected = fraction(start * firstMultiplier * secondMultiplier, 10000);
    return item({ id: id, section: "multi-step", strand: "multistep-percent", standardIds: ["7.RP.A.3"], level: level, kind: "multi-step-percent", responseFormat: "multiple-choice", data: { start: start, first: first, second: second, firstWord: firstWord, secondWord: secondWord, expected: expected }, prompt: tr("가격이 $" + start + "입니다. 먼저 " + first + "% " + (firstWord === "discount" ? "할인" : "인상") + "한 뒤, 그 새 가격에 " + second + "% " + (secondWord === "discount" ? "할인" : "세금") + "을 적용합니다. 최종 가격은 얼마입니까?", "An item costs $" + start + ". First apply a " + first + "% " + (firstWord === "discount" ? "discount" : "increase") + " and then apply a " + second + "% " + (secondWord === "discount" ? "discount" : "tax") + " to the new price. What is the final price?", "一件商品原价为$" + start + "。先" + (firstWord === "discount" ? "打" : "上调") + first + "% ，再按新价格" + (secondWord === "discount" ? "打" : "加") + second + "% 。最终价格是多少？"), choices: choices(options.map(function (value) { return "$" + value; }), correct), errorCode: "same-base-percent" });
  }

  const WORKBOOK_ITEMS = freeze([
    rate("g7rpa-w01", [3,4], [1,2], ["3/8","3/2","2/3","5/4"], 1, "foundation"),
    rate("g7rpa-w02", [5,6], [1,4], ["5/24","10/3","3/10","20/6"], 1, "foundation"),
    rate("g7rpa-w03", [7,8], [1,2], ["7/16","7/4","4/7","3/2"], 1, "core"),
    rate("g7rpa-w04", [2,3], [1,6], ["1/9","4","1/4","5/2"], 1, "core"),
    rate("g7rpa-w05", [9,10], [3,5], ["3/10","3/2","5/3","27/50"], 1, "core"),
    rate("g7rpa-w06", [4,5], [2,3], ["6/5","8/15","5/6","3/2"], 0, "core"),
    rate("g7rpa-w07", [5,12], [1,3], ["5/4","5/36","4/5","3/4"], 0, "advanced"),
    rate("g7rpa-w08", [7,9], [7,18], ["2","1/2","7/27","18/7"], 0, "advanced"),
    table("g7rpa-w09", [[2,5],[4,10],[6,15]], true, "foundation"),
    table("g7rpa-w10", [[2,6],[4,12],[6,17]], false, "foundation"),
    table("g7rpa-w11", [[3,4],[6,8],[9,12]], true, "core"),
    table("g7rpa-w12", [[1,7],[2,14],[3,20]], false, "core"),
    table("g7rpa-w13", [[4,3],[8,6],[12,9]], true, "core"),
    table("g7rpa-w14", [[5,2],[10,4],[15,7]], false, "advanced"),
    constant("g7rpa-w15", [[2,3],[6,9],[10,15]], ["2/3","3/2","5/3","6"], 1, "foundation"),
    constant("g7rpa-w16", [[4,7],[8,14],[12,21]], ["4/7","7/4","11/4","3/4"], 1, "foundation"),
    constant("g7rpa-w17", [[3,5],[9,15],[12,20]], ["3/5","5/3","8/5","2"], 1, "core"),
    constant("g7rpa-w18", [[6,4],[15,10],[21,14]], ["3/2","2/3","5/2","10/15"], 1, "core"),
    constant("g7rpa-w19", [[8,6],[12,9],[20,15]], ["4/3","3/4","2/3","6/8"], 1, "advanced"),
    constant("g7rpa-w20", [[5,12],[10,24],[15,36]], ["5/12","12/5","7/5","17/5"], 1, "advanced"),
    equation("g7rpa-w21", [3,2], ["y = 3x/2","y = 2x/3","y = 3x/2 + 1","y = x + 3/2"], 0, "foundation"),
    equation("g7rpa-w22", [5,3], ["y = 3x/5","y = 5x/3","y = 5x/3 + 2","y = x + 5/3"], 1, "foundation"),
    equation("g7rpa-w23", [7,4], ["y = 4x/7","y = 7x/4","y = 7x/4 - 1","y = x + 7/4"], 1, "core"),
    equation("g7rpa-w24", [2,5], ["y = 2x/5","y = 5x/2","y = 2x/5 + 5","y = x - 2/5"], 0, "core"),
    point("g7rpa-w25", [3,2], 4, [tr("4시간에 6km를 이동했다.", "In 4 hours, the distance is 6 km.", "4小时行驶6千米。"), tr("6시간에 4km를 이동했다.", "In 6 hours, the distance is 4 km.", "6小时行驶4千米。"), tr("1시간에 4km를 이동했다.", "In 1 hour, the distance is 4 km.", "1小时行驶4千米。"), tr("6시간마다 4km가 늘어난다.", "The distance grows 4 km every 6 hours.", "每6小时增加4千米。")], 0, "core"),
    point("g7rpa-w26", [5,3], 3, [tr("3시간에 5km를 이동했다.", "In 3 hours, the distance is 5 km.", "3小时行驶5千米。"), tr("5시간에 3km를 이동했다.", "In 5 hours, the distance is 3 km.", "5小时行驶3千米。"), tr("1시간에 3km를 이동했다.", "In 1 hour, the distance is 3 km.", "1小时行驶3千米。"), tr("3km마다 5시간이 걸린다.", "Every 3 km takes 5 hours.", "每3千米需要5小时。")], 0, "core"),
    point("g7rpa-w27", [7,4], 8, [tr("8시간에 14km를 이동했다.", "In 8 hours, the distance is 14 km.", "8小时行驶14千米。"), tr("14시간에 8km를 이동했다.", "In 14 hours, the distance is 8 km.", "14小时行驶8千米。"), tr("8시간마다 7km가 늘어난다.", "The distance grows 7 km every 8 hours.", "每8小时增加7千米。"), tr("1시간에 14km를 이동했다.", "In 1 hour, the distance is 14 km.", "1小时行驶14千米。")], 0, "advanced"),
    point("g7rpa-w28", [2,5], 10, [tr("10시간에 4km를 이동했다.", "In 10 hours, the distance is 4 km.", "10小时行驶4千米。"), tr("4시간에 10km를 이동했다.", "In 4 hours, the distance is 10 km.", "4小时行驶10千米。"), tr("1시간에 4km를 이동했다.", "In 1 hour, the distance is 4 km.", "1小时行驶4千米。"), tr("10km마다 4시간이 걸린다.", "Every 10 km takes 4 hours.", "每10千米需要4小时。")], 0, "advanced"),
    percent("g7rpa-w29", 100, 20, 10, ["80","88","90","110"], 1, "foundation", "discount", "tax"),
    percent("g7rpa-w30", 80, 5, 10, ["84","92.4","88","76"], 1, "foundation", "increase", "tax"),
    percent("g7rpa-w31", 120, 25, 20, ["120","115","100","125"], 0, "core", "increase", "discount"),
    percent("g7rpa-w32", 200, 15, 8, ["183.6","186.4","170","216"], 0, "core", "discount", "tax"),
    percent("g7rpa-w33", 150, 10, 10, ["150","148.5","135","165"], 1, "core", "increase", "discount"),
    percent("g7rpa-w34", 75, 20, 5, ["63","60","64","67.5"], 0, "advanced", "discount", "tax"),
    percent("g7rpa-w35", 240, 15, 10, ["248.4","252","216","264"], 0, "advanced", "increase", "discount"),
    percent("g7rpa-w36", 50, 8, 20, ["64.8","60","62.4","58"], 0, "advanced", "increase", "tax")
  ]);

  const RECHECK_ITEMS = freeze([
    rate("g7rpa-r01", [11,12], [1,3], ["11/4","11/36","4/11","3/4"], 0, "core"),
    table("g7rpa-r02", [[3,9],[5,15],[7,21]], true, "core"),
    constant("g7rpa-r03", [[7,6],[14,12],[21,18]], ["6/7","7/6","13/7","2"], 0, "core"),
    equation("g7rpa-r04", [9,5], ["y = 5x/9","y = 9x/5","y = 9x/5 + 1","y = x + 9/5"], 1, "core"),
    point("g7rpa-r05", [4,3], 6, [tr("6시간에 8km를 이동했다.", "In 6 hours, the distance is 8 km.", "6小时行驶8千米。"), tr("8시간에 6km를 이동했다.", "In 8 hours, the distance is 6 km.", "8小时行驶6千米。"), tr("1시간에 8km를 이동했다.", "In 1 hour, the distance is 8 km.", "1小时行驶8千米。"), tr("6km마다 8시간이 걸린다.", "Every 6 km takes 8 hours.", "每6千米需要8小时。")], 0, "core"),
    percent("g7rpa-r06", 160, 25, 5, ["200","210","168","180"], 1, "core", "increase", "tax"),
    percent("g7rpa-r07", 90, 30, 10, ["63","69.3","70","81"], 1, "advanced", "discount", "tax"),
    percent("g7rpa-r08", 125, 20, 20, ["120","125","100","150"], 0, "advanced", "increase", "discount")
  ]);

  const STRANDS = freeze({
    "fractional-unit-rate": tr("1 · 분수의 비율과 단위율", "1 · Fraction ratios and unit rates", "1 · 分数比与单位率"),
    "recognize-proportionality": tr("2 · 표에서 비례관계 판단", "2 · Recognize proportionality in tables", "2 · 从表格判断正比例"),
    "constant-of-proportionality": tr("2 · 비례상수", "2 · Constant of proportionality", "2 · 比例常数"),
    "equation-from-proportion": tr("3 · 비례식", "3 · Proportional equations", "3 · 正比例方程"),
    "point-meaning": tr("3 · 그래프 점의 뜻", "3 · Meaning of graph points", "3 · 图像上点的含义"),
    "multistep-percent": tr("4 · 다단계 비율과 퍼센트", "4 · Multi-step ratios and percent", "4 · 多步骤比率与百分数")
  });
  const PACK = freeze({
    schemaVersion: 1, id: "gfield-grade7-rp-a-unit-workbook-v1", clusterId: "7.RP.A", standardRange: "7.RP.A.1-3", learnerStage: "US Grade 7 ages 12-13", completionKey: "gfield-unit-workbook:7.RP.A:v1", contentOrigin: "gfield-original-authored-public-unit-workbook", rights: { publication: "public", assetRights: "original", containsThirdPartyAssets: false },
    title: tr("7.RP.A 비례관계 단원 워크북", "7.RP.A Proportional Relationships Unit Workbook", "7.RP.A 正比例关系单元练习册"),
    subtitle: tr("분수의 비율을 단위율로 계산하고, 표·그래프·식에서 비례관계를 읽은 뒤 다단계 퍼센트 문제에 적용합니다.", "Compute fractional unit rates, connect proportional relationships across tables, graphs, and equations, then apply them to multi-step percent problems.", "计算分数比的单位率，在表格、图像和方程之间识别正比例关系，再应用到多步骤百分数问题。"),
    scopeNotice: tr("이 책은 미국 7학년 7.RP.A.1-3의 분수 비율 단위율, 비례관계의 표·그래프·식 표현, 다단계 비율·퍼센트 문제를 연습합니다. 자동 채점은 선택한 답의 정확성만 확인합니다. 단위의 선택, 실제 상황의 가정, 표와 그래프를 스스로 만들기, 풀이 설명은 선생님이 별도로 확인하며 이 책만으로 배치·승급을 결정하지 않습니다.", "This book practices fractional unit rates, table-graph-equation representations of proportional relationships, and multi-step ratio and percent problems in US Grade 7 7.RP.A.1-3. Automatic checks verify only the selected answer. A teacher separately reviews unit choices, modeling assumptions, self-created tables or graphs, and explanations; this book alone does not determine placement or promotion.", "本练习册练习美国七年级7.RP.A.1-3中的分数比单位率、正比例关系的表格/图像/方程表示，以及多步骤比率和百分数问题。自动核验只检查所选答案。单位选择、实际情境假设、独立制作表格或图像及解题说明由教师另行查看；不能只凭本练习册决定分班或晋级。"),
    conceptPages: freeze([
      freeze({ title: tr("개념 1 · 단위율은 나눗셈의 결과와 단위", "Concept 1 · A unit rate is a quotient with units", "概念1 · 单位率是带单位的商"), body: tr("분수의 비율에서도 ‘한 단위당’ 값을 구하려면 앞의 양을 뒤의 양으로 나눕니다. 단위는 나눗셈과 함께 정리합니다. 예를 들어 3/4 km를 1/2시간에 갔다면 (3/4) ÷ (1/2) = 3/2 km/h입니다.", "For a fractional ratio, divide one quantity by the other to find a per-one rate, and carry the units through the division. For example, (3/4 km) ÷ (1/2 h) = 3/2 km/h.", "处理分数比时，用一个量除以另一个量求每单位的值，并保留单位。例如，(3/4千米) ÷ (1/2小时) = 3/2千米/小时。"), example: tr("나누는 분수의 역수를 곱하지만, 먼저 ‘거리 ÷ 시간’처럼 단위의 순서를 말해 보세요.", "Multiply by the reciprocal of the divisor, but first name the unit order: distance divided by time.", "除以分数等于乘它的倒数，但先说清单位顺序：距离除以时间。") }),
      freeze({ title: tr("개념 2 · 비례는 표, 그래프, 식에서 같은 뜻", "Concept 2 · Proportionality has one meaning across representations", "概念2 · 正比例在不同表示中含义相同"), body: tr("y = kx에서 k는 비례상수입니다. 표에서는 y/x가 일정한지, 그래프에서는 원점을 지나는 직선인지, 식에서는 y가 x의 일정한 배수인지 확인합니다. (1, k)는 한 단위의 x에 대응하는 y를 보여 줍니다.", "In y = kx, k is the constant of proportionality. In a table, test whether y/x stays constant; in a graph, test whether a line passes through the origin; in an equation, test whether y is a constant multiple of x. The point (1, k) shows y for one unit of x.", "在y = kx中，k是比例常数。表格中检查y/x是否不变；图像中检查直线是否经过原点；方程中检查y是否始终是x的固定倍数。点(1，k)表示x为1时的y。"), example: tr("x=4일 때 y=6이면 k=6/4=3/2입니다. 이 관계가 비례라면 식은 y=(3/2)x입니다.", "If x = 4 gives y = 6, then k = 6/4 = 3/2. If the relationship is proportional, its equation is y = (3/2)x.", "当x=4时y=6，k=6/4=3/2。若该关系为正比例，方程是y=(3/2)x。") })
    ]),
    teacherObservation: tr("학생이 분수로 나눌 때 양과 단위를 함께 읽는지, 단순히 함께 증가한다는 이유가 아니라 일정한 비·원점·식으로 비례를 판단하는지 확인하세요. 다단계 퍼센트에서는 두 퍼센트가 같은 처음 가격이 아니라 순서대로 바뀐 가격에 적용된다는 설명도 기록하세요.", "Check whether the learner reads quantities and units together when dividing fractions and decides proportionality from a constant ratio, origin, or equation rather than merely because both quantities increase. For multi-step percent, record whether the learner explains that each change applies to the updated price, not the original price.", "检查学生在分数相除时能否同时读出量和单位，能否根据固定比、原点或方程而不是仅因两个量都增加来判断正比例。多步骤百分数中，记录学生是否说明每次变化都作用于更新后的价格，而不是原价。"),
    reflection: tr("나만의 비례 모델 만들기", "Create my own proportional model", "建立自己的正比例模型"),
    reflectionPrompt: tr("실제 상황 하나를 골라 x와 y의 단위를 정하고, y = kx가 되는 표 두 줄과 원점을 포함한 그래프 점 세 개를 만드세요. k의 뜻을 한 문장으로 설명하세요.", "Choose one real context, define units for x and y, create two rows of a y = kx table and three graph points including the origin, then explain k in one sentence.", "选择一个真实情境，确定x和y的单位，写出y = kx表格的两行和包含原点的三个图像点，再用一句话说明k的含义。"),
    printPlan: freeze({ paperSizes: ["A4", "Letter"], itemsPerPracticePage: 4, studentPages: 12, teacherEdition: true, answerSheetSeparate: true }),
    ui: freeze({ sectionOrder: ["fraction-rate", "relationships", "representation", "multi-step", "recheck"], sectionLabels: { "fraction-rate": tr("1 · 분수의 비율과 단위율", "1 · Fraction ratios and unit rates", "1 · 分数比与单位率"), relationships: tr("2 · 표에서 비례관계와 비례상수", "2 · Tables: proportionality and constant", "2 · 表格：正比例与比例常数"), representation: tr("3 · 식과 그래프 점의 뜻", "3 · Equations and graph-point meaning", "3 · 方程与图像点的含义"), "multi-step": tr("4 · 다단계 비율과 퍼센트", "4 · Multi-step ratios and percent", "4 · 多步骤比率与百分数"), recheck: tr("새 문항 · 8가지 구조 재확인", "New items · Eight-structure recheck", "新题 · 八种结构复测") } }),
    workbookItems: WORKBOOK_ITEMS, recheckItems: RECHECK_ITEMS, strands: STRANDS
  });
  function local(value, locale) { return value[locale] || value.en || value.ko; }
  function choiceLabel(candidate, answer, locale) { const choice = candidate.choices.find(function (entry) { return entry.id === answer; }); return choice ? local(choice.label, locale) : ""; }
  function solveItem(candidate) { return answerId(candidate); }
  function evaluateResponse(candidate, response) { return String(response) === solveItem(candidate); }
  function formatResult(candidate) { return choiceLabel(candidate, solveItem(candidate), "en"); }
  function hintFor(candidate, locale) {
    const hints = { "fraction-rate": tr("앞의 양을 뒤의 양으로 나누고, 나누는 분수의 역수를 곱하세요.", "Divide the first quantity by the second and multiply by the divisor's reciprocal.", "用前一个量除以后一个量，再乘以除数的倒数。"), "table-proportional": tr("각 행에서 y ÷ x가 같은지 모두 확인하세요.", "Check whether y ÷ x is the same in every row.", "检查每一行的y ÷ x是否相同。"), "table-constant": tr("한 행의 y ÷ x를 구하고 다른 행으로 확인하세요.", "Find y ÷ x in one row, then verify it in another row.", "先求一行的y ÷ x，再用另一行核验。"), "equation-model": tr("비례식은 원점을 지나므로 더하거나 빼는 상수항이 없습니다.", "A proportional equation passes through the origin, so it has no added constant.", "正比例方程经过原点，因此没有额外的常数项。"), "point-meaning": tr("좌표는 (시간, 거리) 순서이고 각 수의 단위를 함께 읽으세요.", "Read coordinates as (time, distance) and include each unit.", "坐标按（时间，距离）的顺序读，并带上单位。"), "multi-step-percent": tr("두 번째 퍼센트는 처음 가격이 아니라 첫 번째 변화 뒤의 가격에 적용합니다.", "The second percent applies to the updated price, not the original price.", "第二个百分数作用于第一次变化后的价格，而不是原价。") };
    return local(hints[candidate.kind], locale);
  }
  function solutionFor(candidate, locale) {
    const data = candidate.data; let text;
    if (candidate.kind === "fraction-rate") text = tr(fractionText(data.distance) + " ÷ " + fractionText(data.time) + " = " + fractionText(data.expected) + " km/h입니다.", fractionText(data.distance) + " ÷ " + fractionText(data.time) + " = " + fractionText(data.expected) + " km/h.", fractionText(data.distance) + " ÷ " + fractionText(data.time) + " = " + fractionText(data.expected) + "千米/小时。");
    else if (candidate.kind === "table-proportional") text = data.proportional ? tr("각 행의 y ÷ x가 같으므로 비례관계입니다.", "Each row has the same y ÷ x, so the relationship is proportional.", "每一行的y ÷ x相同，所以是正比例关系。") : tr("적어도 한 행에서 y ÷ x가 달라지므로 비례관계가 아닙니다.", "At least one row has a different y ÷ x, so the relationship is not proportional.", "至少有一行的y ÷ x不同，所以不是正比例关系。");
    else if (candidate.kind === "table-constant") text = tr("k = y ÷ x = " + fractionText(data.expected) + "이고 다른 행에서도 같습니다.", "k = y ÷ x = " + fractionText(data.expected) + ", and the same value appears in every row.", "k = y ÷ x = " + fractionText(data.expected) + "，其他各行也相同。");
    else if (candidate.kind === "equation-model") text = tr("원점을 지나고 y가 x의 " + fractionText(data.k) + "배이므로 y = " + fractionText(data.k) + "x입니다.", "The graph goes through the origin and y is " + fractionText(data.k) + " times x, so y = " + fractionText(data.k) + "x.", "图像经过原点，且y是x的" + fractionText(data.k) + "倍，所以y = " + fractionText(data.k) + "x。");
    else if (candidate.kind === "point-meaning") text = tr("좌표 (" + data.x + ", " + data.y + ")는 " + data.x + "시간일 때 거리가 " + data.y + "km라는 뜻입니다.", "The point (" + data.x + ", " + data.y + ") means that after " + data.x + " hours, the distance is " + data.y + " km.", "点(" + data.x + "，" + data.y + ")表示经过" + data.x + "小时，距离为" + data.y + "千米。" );
    else text = tr("$" + data.start + "에 첫 변화와 두 번째 변화를 순서대로 적용하면 $" + fractionText(data.expected) + "입니다.", "Apply the first change and then the second change to $" + data.start + " to get $" + fractionText(data.expected) + ".", "对$" + data.start + "依次应用两次变化，得到$" + fractionText(data.expected) + "。" );
    return local(text, locale);
  }
  function renderVisual(candidate, locale) {
    const data = candidate.data; const esc = function (value) { return String(value).replace(/[&<>\"]/g, function (character) { return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;" })[character]; }); };
    if (candidate.kind === "table-proportional" || candidate.kind === "table-constant") return '<table class="g7rpa-table" aria-label="x and y table"><thead><tr><th>x</th>' + data.pairs.map(function (pair) { return '<td>' + pair[0] + '</td>'; }).join("") + '</tr></thead><tbody><tr><th>y</th>' + data.pairs.map(function (pair) { return '<td>' + pair[1] + '</td>'; }).join("") + '</tr></tbody></table>';
    if (candidate.kind === "fraction-rate") return '<div class="g7rpa-rate-model" role="img" aria-label="rate division model"><span>' + fractionText(data.distance) + ' km</span><b>÷</b><span>' + fractionText(data.time) + ' h</span><i>km/h</i></div>';
    if (candidate.kind === "multi-step-percent") return '<div class="g7rpa-percent-flow" role="img" aria-label="two-step percent flow"><span>$' + data.start + '</span><b>→</b><span>' + data.first + '%</span><b>→</b><span>' + data.second + '%</span><i>' + esc(locale === "ko" ? "순서대로 새 가격에 적용" : locale === "zh-Hans" ? "依次作用于新价格" : "apply each step to the new price") + '</i></div>';
    const k = data.k, maxX = Math.max(6, data.x || 0, k[1] * 2), maxY = Math.max(6, data.y || 0, Math.ceil(k[0] * maxX / k[1])); const left = 34, bottom = 150, width = 230, height = 120; const mapX = function (x) { return left + x * width / maxX; }, mapY = function (y) { return bottom - y * height / maxY; }; const endX = maxX, endY = k[0] * endX / k[1]; const point = candidate.kind === "point-meaning" ? '<circle cx="' + mapX(data.x).toFixed(2) + '" cy="' + mapY(data.y).toFixed(2) + '" r="4" class="g7rpa-dot"></circle><text x="' + (mapX(data.x)+6).toFixed(2) + '" y="' + (mapY(data.y)-6).toFixed(2) + '" class="g7rpa-label">(' + data.x + ',' + data.y + ')</text>' : ""; return '<svg class="g7rpa-graph" viewBox="0 0 290 180" role="img" aria-label="coordinate graph built from y equals k times x"><line x1="' + left + '" y1="' + bottom + '" x2="' + (left+width) + '" y2="' + bottom + '" class="g7rpa-axis"></line><line x1="' + left + '" y1="' + bottom + '" x2="' + left + '" y2="30" class="g7rpa-axis"></line><line x1="' + mapX(0).toFixed(2) + '" y1="' + mapY(0).toFixed(2) + '" x2="' + mapX(endX).toFixed(2) + '" y2="' + mapY(endY).toFixed(2) + '" class="g7rpa-line"></line><text x="' + (left+width-4) + '" y="' + (bottom+18) + '" class="g7rpa-label">x</text><text x="' + (left-14) + '" y="38" class="g7rpa-label">y</text>' + point + '</svg>';
  }
  function validatePack() {
    const all = PACK.workbookItems.concat(PACK.recheckItems); if (PACK.workbookItems.length !== 36 || PACK.recheckItems.length !== 8 || new Set(all.map(function (entry) { return entry.id; })).size !== 44) throw new Error("G7_RPA_ITEM_COUNT_INVALID");
    const coverage = new Set(all.flatMap(function (entry) { return entry.standardIds; })); ["7.RP.A.1","7.RP.A.2a","7.RP.A.2b","7.RP.A.2c","7.RP.A.2d","7.RP.A.3"].forEach(function (id) { if (!coverage.has(id)) throw new Error("G7_RPA_STANDARD_COVERAGE_INVALID"); });
    all.forEach(function (candidate) { if (!candidate.prompt.ko || !candidate.prompt.en || !candidate.prompt["zh-Hans"] || candidate.choices.length !== 4 || !solveItem(candidate)) throw new Error("G7_RPA_ITEM_SCHEMA_INVALID"); }); return true;
  }
  validatePack();
  return freeze({ pack: PACK, solveItem: solveItem, evaluateResponse: evaluateResponse, formatResult: formatResult, choiceLabel: choiceLabel, hintFor: hintFor, solutionFor: solutionFor, renderVisual: renderVisual, validatePack: validatePack });
});
