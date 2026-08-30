(function (root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.GFIELDGrade6NSCClinicPack = value;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function tr(ko, en, zhHans) { return Object.freeze({ ko: ko, en: en, "zh-Hans": zhHans }); }
  function freeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { freeze(value[key]); });
    return Object.freeze(value);
  }
  function item(value) { return freeze(value); }
  function abs(value) { return value < 0n ? -value : value; }
  function gcd(a, b) { let x = abs(a); let y = abs(b); while (y) { const r = x % y; x = y; y = r; } return x; }
  function rational(n, d) {
    if (d === 0n) throw new Error("NSC_ZERO_DENOMINATOR");
    const sign = d < 0n ? -1n : 1n; const divisor = gcd(n, d);
    return { n: sign * n / divisor, d: abs(d) / divisor };
  }
  function fromPair(numerator, denominator) { return rational(BigInt(numerator), BigInt(denominator)); }
  function compare(left, right) {
    const delta = left.n * right.d - right.n * left.d;
    return delta < 0n ? -1 : (delta > 0n ? 1 : 0);
  }
  function distance(left, right) { return rational(abs(left.n * right.d - right.n * left.d), left.d * right.d); }
  function formatRational(value) { return value.d === 1n ? String(value.n) : value.n + "/" + value.d; }

  const WORKBOOK_ITEMS = [
    item({ id: "nsc-w01", section: "meaning", strand: "opposites-absolute", level: "foundation", kind: "signed-rational-operation", responseFormat: "signed-rational", prompt: tr("-7/4의 반대수를 기약분수 또는 정수로 쓰세요.", "Write the opposite of -7/4 as a reduced fraction or integer.", "把-7/4的相反数写成最简分数或整数。"), data: { operation: "opposite", numerator: -7, denominator: 4 }, unit: tr("", "", ""), errorCode: "opposite-sign" }),
    item({ id: "nsc-w02", section: "meaning", strand: "opposites-absolute", level: "core", kind: "signed-rational-operation", responseFormat: "signed-rational", prompt: tr("5/3의 반대수를 기약분수 또는 정수로 쓰세요.", "Write the opposite of 5/3 as a reduced fraction or integer.", "把5/3的相反数写成最简分数或整数。"), data: { operation: "opposite", numerator: 5, denominator: 3 }, unit: tr("", "", ""), errorCode: "opposite-sign" }),
    item({ id: "nsc-w03", section: "meaning", strand: "opposites-absolute", level: "foundation", kind: "signed-rational-operation", responseFormat: "signed-rational", prompt: tr("|-9/4|를 기약분수 또는 정수로 쓰세요.", "Write |-9/4| as a reduced fraction or integer.", "把|-9/4|写成最简分数或整数。"), data: { operation: "absolute-value", numerator: -9, denominator: 4 }, unit: tr("", "", ""), errorCode: "absolute-distance" }),
    item({ id: "nsc-w04", section: "meaning", strand: "opposites-absolute", level: "core", kind: "signed-rational-operation", responseFormat: "signed-rational", prompt: tr("수직선에서 -7/4과 0 사이의 거리를 구하세요. 기약분수 또는 정수로 쓰세요.", "Find the distance between -7/4 and 0 on a number line. Write a reduced fraction or integer.", "求数轴上-7/4与0之间的距离，写成最简分数或整数。"), data: { operation: "distance", leftNumerator: -7, leftDenominator: 4, rightNumerator: 0, rightDenominator: 1 }, unit: tr("", "", ""), errorCode: "absolute-distance" }),
    item({ id: "nsc-w05", section: "order", strand: "signed-order", level: "foundation", kind: "signed-rational-comparison", responseFormat: "comparison-symbol", prompt: tr("-3/4 __ -2/3의 빈칸에 < 또는 >를 쓰세요.", "Write < or > in -3/4 __ -2/3.", "在-3/4 __ -2/3中填入<或>。"), data: { basis: "signed-value", leftNumerator: -3, leftDenominator: 4, rightNumerator: -2, rightDenominator: 3 }, unit: tr("", "", ""), errorCode: "negative-order" }),
    item({ id: "nsc-w06", section: "order", strand: "signed-order", level: "core", kind: "signed-rational-operation", responseFormat: "signed-rational", prompt: tr("-7/4과 -5/3 중 더 작은 수를 기약분수로 쓰세요.", "Write the smaller of -7/4 and -5/3 as a reduced fraction.", "把-7/4和-5/3中较小的数写成最简分数。"), data: { operation: "minimum", leftNumerator: -7, leftDenominator: 4, rightNumerator: -5, rightDenominator: 3 }, unit: tr("", "", ""), errorCode: "negative-order" }),
    item({ id: "nsc-w07", section: "order", strand: "signed-order", level: "core", kind: "signed-rational-comparison", responseFormat: "comparison-symbol", prompt: tr("|-5/6| __ |2/3|의 빈칸에 < 또는 >를 쓰세요.", "Write < or > in |-5/6| __ |2/3|.", "在|-5/6| __ |2/3|中填入<或>。"), data: { basis: "absolute-magnitude", leftNumerator: -5, leftDenominator: 6, rightNumerator: 2, rightDenominator: 3 }, unit: tr("", "", ""), errorCode: "absolute-versus-value" }),
    item({ id: "nsc-w08", section: "coordinates", strand: "quadrant-classification", level: "foundation", kind: "quadrant-classification", responseFormat: "quadrant-number", prompt: tr("점 (3, 5)가 있는 사분면을 1, 2, 3, 4 중 숫자로 쓰세요.", "Write the quadrant containing (3, 5) as 1, 2, 3, or 4.", "用数字1、2、3或4写出点(3, 5)所在的象限。"), data: { xNumerator: 3, xDenominator: 1, yNumerator: 5, yDenominator: 1 }, unit: tr("사분면", "quadrant", "象限"), errorCode: "quadrant-signs" }),
    item({ id: "nsc-w09", section: "coordinates", strand: "quadrant-classification", level: "foundation", kind: "quadrant-classification", responseFormat: "quadrant-number", prompt: tr("점 (-3, 4)가 있는 사분면을 1, 2, 3, 4 중 숫자로 쓰세요.", "Write the quadrant containing (-3, 4) as 1, 2, 3, or 4.", "用数字1、2、3或4写出点(-3, 4)所在的象限。"), data: { xNumerator: -3, xDenominator: 1, yNumerator: 4, yDenominator: 1 }, unit: tr("사분면", "quadrant", "象限"), errorCode: "quadrant-signs" }),
    item({ id: "nsc-w10", section: "coordinates", strand: "quadrant-classification", level: "core", kind: "quadrant-classification", responseFormat: "quadrant-number", prompt: tr("점 (5, -2)가 있는 사분면을 1, 2, 3, 4 중 숫자로 쓰세요.", "Write the quadrant containing (5, -2) as 1, 2, 3, or 4.", "用数字1、2、3或4写出点(5, -2)所在的象限。"), data: { xNumerator: 5, xDenominator: 1, yNumerator: -2, yDenominator: 1 }, unit: tr("사분면", "quadrant", "象限"), errorCode: "quadrant-signs" }),
    item({ id: "nsc-w11", section: "coordinates", strand: "same-axis-distance", level: "core", kind: "signed-rational-operation", responseFormat: "signed-rational", prompt: tr("점 (-3/4, 1/2)와 (5/4, 1/2) 사이의 수평 거리를 구해 기약분수 또는 정수로 쓰세요.", "Find the horizontal distance between (-3/4, 1/2) and (5/4, 1/2). Write a reduced fraction or integer.", "求点(-3/4, 1/2)与(5/4, 1/2)之间的水平距离，写成最简分数或整数。"), data: { operation: "axis-distance", axis: "horizontal", firstXNumerator: -3, firstXDenominator: 4, firstYNumerator: 1, firstYDenominator: 2, secondXNumerator: 5, secondXDenominator: 4, secondYNumerator: 1, secondYDenominator: 2 }, unit: tr("단위", "units", "个单位"), errorCode: "axis-distance" }),
    item({ id: "nsc-w12", section: "coordinates", strand: "same-axis-distance", level: "advanced", kind: "signed-rational-operation", responseFormat: "signed-rational", prompt: tr("점 (-2/3, -1/6)과 (-2/3, 5/6) 사이의 수직 거리를 구해 기약분수 또는 정수로 쓰세요.", "Find the vertical distance between (-2/3, -1/6) and (-2/3, 5/6). Write a reduced fraction or integer.", "求点(-2/3, -1/6)与(-2/3, 5/6)之间的垂直距离，写成最简分数或整数。"), data: { operation: "axis-distance", axis: "vertical", firstXNumerator: -2, firstXDenominator: 3, firstYNumerator: -1, firstYDenominator: 6, secondXNumerator: -2, secondXDenominator: 3, secondYNumerator: 5, secondYDenominator: 6 }, unit: tr("단위", "units", "个单位"), errorCode: "axis-distance" })
  ];

  const RECHECK_ITEMS = [
    item({ id: "nsc-r01", section: "recheck", strand: "opposites-absolute", level: "core", kind: "signed-rational-operation", responseFormat: "signed-rational", prompt: tr("-11/6의 반대수를 기약분수로 쓰세요.", "Write the opposite of -11/6 as a reduced fraction.", "把-11/6的相反数写成最简分数。"), data: { operation: "opposite", numerator: -11, denominator: 6 }, unit: tr("", "", ""), errorCode: "opposite-sign" }),
    item({ id: "nsc-r02", section: "recheck", strand: "signed-order", level: "core", kind: "signed-rational-comparison", responseFormat: "comparison-symbol", prompt: tr("-5/6 __ -3/4의 빈칸에 < 또는 >를 쓰세요.", "Write < or > in -5/6 __ -3/4.", "在-5/6 __ -3/4中填入<或>。"), data: { basis: "signed-value", leftNumerator: -5, leftDenominator: 6, rightNumerator: -3, rightDenominator: 4 }, unit: tr("", "", ""), errorCode: "negative-order" }),
    item({ id: "nsc-r03", section: "recheck", strand: "quadrant-classification", level: "core", kind: "quadrant-classification", responseFormat: "quadrant-number", prompt: tr("점 (-4, -3)이 있는 사분면을 1, 2, 3, 4 중 숫자로 쓰세요.", "Write the quadrant containing (-4, -3) as 1, 2, 3, or 4.", "用数字1、2、3或4写出点(-4, -3)所在的象限。"), data: { xNumerator: -4, xDenominator: 1, yNumerator: -3, yDenominator: 1 }, unit: tr("사분면", "quadrant", "象限"), errorCode: "quadrant-signs" }),
    item({ id: "nsc-r04", section: "recheck", strand: "same-axis-distance", level: "advanced", kind: "signed-rational-operation", responseFormat: "signed-rational", prompt: tr("점 (1/4, -2)와 (7/4, -2) 사이의 수평 거리를 구해 기약분수 또는 정수로 쓰세요.", "Find the horizontal distance between (1/4, -2) and (7/4, -2). Write a reduced fraction or integer.", "求点(1/4, -2)与(7/4, -2)之间的水平距离，写成最简分数或整数。"), data: { operation: "axis-distance", axis: "horizontal", firstXNumerator: 1, firstXDenominator: 4, firstYNumerator: -2, firstYDenominator: 1, secondXNumerator: 7, secondXDenominator: 4, secondYNumerator: -2, secondYDenominator: 1 }, unit: tr("단위", "units", "个单位"), errorCode: "axis-distance" })
  ];

  const STRANDS = freeze({
    "opposites-absolute": tr("반대수와 절댓값", "Opposites and absolute value", "相反数与绝对值"),
    "signed-order": tr("부호 있는 유리수의 순서", "Order of signed rational numbers", "有理数的大小顺序"),
    "quadrant-classification": tr("사분면 분류", "Quadrant classification", "象限判断"),
    "same-axis-distance": tr("같은 축 위의 거리", "Distance along one axis", "同轴距离")
  });
  const ERROR_GUIDES = freeze({
    "opposite-sign": { label: tr("반대수와 절댓값 혼동", "Confused opposite with absolute value", "混淆相反数与绝对值"), prompt: tr("반대수는 0을 기준으로 같은 거리에 있는 반대편 수인지 확인하게 하세요.", "Ask whether the opposite lies the same distance from zero on the other side.", "让学生确认相反数是否位于0的另一侧且距离相同。") },
    "absolute-distance": { label: tr("절댓값에 음수 부호 사용", "Used a negative absolute value", "把绝对值写成负数"), prompt: tr("절댓값은 0에서의 거리이므로 음수가 될 수 없음을 수직선으로 확인하세요.", "Use the number line to confirm that distance from zero cannot be negative.", "用数轴确认到0的距离不能为负。") },
    "negative-order": { label: tr("음수의 크기 순서 반전 누락", "Did not reverse negative-number order", "没有注意负数的大小顺序"), prompt: tr("공통분모로 바꾼 뒤 더 왼쪽에 있는 수가 더 작다는 것을 말하게 하세요.", "Rename with a common denominator, then ask which value lies farther left.", "化为同分母后，让学生说明哪个数在数轴上更靠左。") },
    "absolute-versus-value": { label: tr("실제 값과 절댓값 비교 혼동", "Confused signed value with magnitude", "混淆数值与绝对值"), prompt: tr("절댓값 기호 안에서는 먼저 0에서의 거리만 비교하게 하세요.", "Inside absolute-value bars, compare only distance from zero first.", "在绝对值符号内，先只比较到0的距离。") },
    "quadrant-signs": { label: tr("x와 y의 부호 순서 혼동", "Reversed the x- and y-sign order", "混淆x与y的符号顺序"), prompt: tr("오른쪽·왼쪽은 x, 위·아래는 y라는 순서로 부호를 읽게 하세요. 실제 점 찍기는 교사가 별도로 관찰합니다.", "Read horizontal x first and vertical y second. Observe actual point plotting separately.", "先读水平方向的x，再读垂直方向的y；实际描点由教师另行观察。") },
    "axis-distance": { label: tr("거리에서 부호를 그대로 유지", "Kept a negative sign in a distance", "距离仍保留负号"), prompt: tr("같은 좌표는 고정하고 달라지는 한 좌표의 차의 절댓값을 구하게 하세요. 좌표평면 해석 설명은 교사가 관찰합니다.", "Hold the shared coordinate fixed and take the absolute difference of the changing coordinate. Observe the coordinate-plane explanation separately.", "固定相同坐标，对变化的坐标求差的绝对值；坐标平面解释由教师观察。") }
  });

  const PACK = freeze({
    schemaVersion: 1, id: "gfield-grade6-ns-c-clinic-v1", clusterId: "6.NS.C", standardRange: "6.NS.C.5-8", learnerStage: "US Grade 6 ages 11-12",
    contentOrigin: "gfield-original-authored-public-clinic", rights: { publication: "public", assetRights: "original", containsThirdPartyAssets: false },
    scopeNotice: tr("이 공개 클리닉은 6.NS.C.5-8의 반대수·절댓값, 수의 순서, 사분면, 같은 축 위 거리에 대한 제한된 자동 근거만 확인합니다. 점을 직접 찍고 상황을 설명하는 능력은 교사가 별도로 관찰하며, 전체 영역 숙달이나 승급을 자동 결정하지 않습니다.", "This public clinic checks limited automatic evidence for opposites, absolute value, order, quadrants, and same-axis distance in 6.NS.C.5-8. A teacher separately observes point plotting and contextual explanation; it does not automatically determine full mastery or promotion.", "本公开练习只检查6.NS.C.5-8中相反数、绝对值、大小顺序、象限和同轴距离的有限自动证据。实际描点与情境说明由教师另行观察，不自动判定全部掌握或晋级。"),
    title: tr("6.NS.C 음수·좌표평면 클리닉", "6.NS.C Signed Numbers and Coordinate Plane Clinic", "6.NS.C 负数与坐标平面专项练习"),
    subtitle: tr("반대수와 절댓값을 이해하고, 음의 유리수를 비교하며, 좌표의 부호와 거리를 정확히 읽습니다.", "Understand opposites and absolute value, compare signed rational numbers, and read coordinate signs and distances accurately.", "理解相反数与绝对值，比较有理数，并准确读取坐标符号与距离。"),
    conceptSummary: tr("수직선에서 오른쪽에 있는 수가 더 큽니다. 반대수는 0에서 같은 거리의 반대편 수이고, 절댓값은 0에서의 거리입니다. 좌표평면에서는 (x, y)의 부호가 사분면을 정하며, 같은 수평선이나 수직선 위 두 점의 거리는 달라지는 좌표의 차의 절댓값입니다.", "A number farther right is greater. Opposites lie the same distance from zero on different sides, and absolute value is distance from zero. In the coordinate plane, the signs of (x, y) determine the quadrant; distance on one horizontal or vertical line is the absolute difference of the changing coordinate.", "数轴上越靠右的数越大。相反数位于0的两侧且距离相同，绝对值表示到0的距离。坐标平面中，(x, y)的符号决定象限；同一水平线或垂直线上两点的距离是变化坐标之差的绝对值。"),
    workedExample: { title: tr("해결 예시 · -7/4과 -5/3 비교", "Worked example · Compare -7/4 and -5/3", "例题 · 比较-7/4与-5/3"), prompt: tr("공통분모와 수직선 위치를 함께 확인하세요.", "Use both a common denominator and number-line position.", "同时用同分母与数轴位置检验。"), steps: [tr("-7/4 = -21/12, -5/3 = -20/12입니다.", "-7/4 = -21/12 and -5/3 = -20/12.", "-7/4 = -21/12，-5/3 = -20/12。"), tr("-21/12은 -20/12보다 수직선에서 왼쪽에 있습니다.", "-21/12 lies to the left of -20/12 on the number line.", "-21/12在数轴上位于-20/12的左侧。"), tr("따라서 -7/4 < -5/3입니다.", "Therefore, -7/4 < -5/3.", "因此，-7/4 < -5/3。") ] },
    ui: { titleLead: tr("음수와 좌표를", "Read signed numbers", "用位置与距离"), titleAccent: tr("위치와 거리로 이해하기.", "through position and distance.", "读懂负数与坐标。"), hero: tr("반대수·절댓값, 음의 유리수 비교, 사분면, 같은 축 위 거리를 세 묶음으로 연습하고 새 문항으로 다시 확인합니다.", "Practice opposites and absolute value, signed-rational order, quadrants, and same-axis distance in three sets, then recheck with new items.", "分三组练习相反数与绝对值、有理数大小、象限和同轴距离，再用新题复测。"), sectionOrder: ["meaning", "order", "coordinates", "recheck"], sectionLabels: { meaning: tr("1 · 반대수와 절댓값", "1 · Opposites and absolute value", "1 · 相反数与绝对值"), order: tr("2 · 음의 유리수 비교", "2 · Compare signed rational numbers", "2 · 比较有理数"), coordinates: tr("3 · 사분면과 같은 축 위 거리", "3 · Quadrants and same-axis distance", "3 · 象限与同轴距离"), recheck: tr("새 문항 · 4영역 재확인", "New items · Four-strand recheck", "新题 · 四领域复测") } },
    workbookItems: WORKBOOK_ITEMS, recheckItems: RECHECK_ITEMS, strands: STRANDS, errorGuides: ERROR_GUIDES
  });

  function valuePair(data, prefix) { return fromPair(data[prefix + "Numerator"], data[prefix + "Denominator"]); }
  function solveItem(candidate) {
    const d = candidate.data;
    if (candidate.kind === "quadrant-classification") {
      const x = fromPair(d.xNumerator, d.xDenominator); const y = fromPair(d.yNumerator, d.yDenominator);
      if (x.n === 0n || y.n === 0n) throw new Error("NSC_AXIS_POINT_UNSUPPORTED");
      return x.n > 0n ? (y.n > 0n ? "1" : "4") : (y.n > 0n ? "2" : "3");
    }
    if (candidate.kind === "signed-rational-comparison") {
      let left = valuePair(d, "left"); let right = valuePair(d, "right");
      if (d.basis === "absolute-magnitude") { left = rational(abs(left.n), left.d); right = rational(abs(right.n), right.d); }
      const order = compare(left, right); if (!order) throw new Error("NSC_EQUAL_COMPARISON_UNSUPPORTED");
      return order < 0 ? "<" : ">";
    }
    if (candidate.kind !== "signed-rational-operation") throw new Error("NSC_KIND_UNSUPPORTED");
    if (["identity", "opposite", "absolute-value"].includes(d.operation)) {
      const value = fromPair(d.numerator, d.denominator);
      if (d.operation === "identity") return value;
      if (d.operation === "opposite") return rational(-value.n, value.d);
      return rational(abs(value.n), value.d);
    }
    if (["minimum", "maximum", "distance"].includes(d.operation)) {
      const left = valuePair(d, "left"); const right = valuePair(d, "right");
      if (d.operation === "distance") return distance(left, right);
      const order = compare(left, right); if (!order) throw new Error("NSC_EQUAL_SELECTION_UNSUPPORTED");
      return d.operation === "minimum" ? (order < 0 ? left : right) : (order > 0 ? left : right);
    }
    if (d.operation === "axis-distance") {
      const firstX = valuePair(d, "firstX"); const firstY = valuePair(d, "firstY"); const secondX = valuePair(d, "secondX"); const secondY = valuePair(d, "secondY");
      if (d.axis === "horizontal") { if (compare(firstY, secondY)) throw new Error("NSC_HORIZONTAL_AXIS_INVALID"); return distance(firstX, secondX); }
      if (d.axis === "vertical") { if (compare(firstX, secondX)) throw new Error("NSC_VERTICAL_AXIS_INVALID"); return distance(firstY, secondY); }
    }
    throw new Error("NSC_OPERATION_UNSUPPORTED");
  }
  function parseReducedRational(value) {
    const text = String(value == null ? "" : value).trim().replace(/[−–—]/g, "-").replace(/\s+/g, "");
    const match = /^([+-]?\d+)(?:\/(\d+))?$/.exec(text); if (!match) return null;
    const n = BigInt(match[1]); const d = BigInt(match[2] || "1"); if (d <= 0n) return null;
    if (match[2] && (gcd(n, d) !== 1n || d === 1n)) return null;
    return { n: n, d: d };
  }
  function evaluateResponse(candidate, response) {
    const expected = solveItem(candidate); const entered = String(response == null ? "" : response).trim();
    if (typeof expected === "string") return entered === expected;
    const actual = parseReducedRational(entered); return Boolean(actual && actual.n * expected.d === expected.n * actual.d);
  }
  function formatResult(candidate) { const value = solveItem(candidate); return typeof value === "string" ? value : formatRational(value); }
  function hintFor(candidate, locale) {
    const key = locale === "zh" ? "zh-Hans" : locale; const guide = ERROR_GUIDES[candidate.errorCode]; return guide.prompt[key] || guide.prompt.en;
  }
  function solutionFor(candidate, locale) {
    const key = locale === "zh" ? "zh-Hans" : locale; const d = candidate.data; const answer = formatResult(candidate); let copy;
    if (candidate.kind === "quadrant-classification") copy = tr("x와 y의 부호를 차례로 읽으면 해당 점은 " + answer + "사분면에 있습니다.", "Reading the signs of x and y in order places the point in Quadrant " + answer + ".", "依次读取x与y的符号，该点位于第" + answer + "象限。");
    else if (candidate.kind === "signed-rational-comparison") copy = tr("공통분모 또는 수직선 위치로 비교하면 부등호는 " + answer + "입니다.", "A common denominator or number-line position gives the symbol " + answer + ".", "用同分母或数轴位置比较，符号是" + answer + "。");
    else if (d.operation === "opposite") copy = tr("0에서 같은 거리를 유지하며 반대편으로 옮기면 " + answer + "입니다.", "Move to the other side of zero while keeping the same distance: " + answer + ".", "保持到0的距离并移到另一侧，得到" + answer + "。");
    else if (d.operation === "absolute-value" || d.operation === "distance") copy = tr("0에서의 거리는 음수가 아니므로 " + answer + "입니다.", "Distance from zero is nonnegative, so the result is " + answer + ".", "到0的距离非负，所以结果是" + answer + "。");
    else if (d.operation === "minimum" || d.operation === "maximum") copy = tr("공통분모로 바꾸고 수직선의 좌우 위치를 비교하면 " + answer + "입니다.", "Rename with a common denominator and compare left-right position: " + answer + ".", "化为同分母并比较数轴上的左右位置，得到" + answer + "。");
    else copy = tr("같은 좌표는 고정하고 달라지는 좌표의 차의 절댓값을 구하면 " + answer + "입니다.", "Keep the shared coordinate fixed and take the absolute difference of the changing coordinates: " + answer + ".", "固定相同坐标，对变化坐标之差取绝对值，得到" + answer + "。");
    return copy[key];
  }
  function validateItem(candidate) {
    const kinds = new Set(["signed-rational-operation", "signed-rational-comparison", "quadrant-classification"]);
    if (!candidate || !/^nsc-[wr]\d{2}$/.test(candidate.id) || !kinds.has(candidate.kind)) throw new Error("NSC_ITEM_INVALID");
    if (!STRANDS[candidate.strand] || !ERROR_GUIDES[candidate.errorCode]) throw new Error("NSC_ALIGNMENT_INVALID");
    ["ko", "en", "zh-Hans"].forEach(function (key) { if (!candidate.prompt[key]) throw new Error("NSC_LOCALE_INVALID"); });
    const result = solveItem(candidate); if (typeof result !== "string" && result.d <= 0n) throw new Error("NSC_RESULT_INVALID");
    return true;
  }
  function validatePack() {
    const all = PACK.workbookItems.concat(PACK.recheckItems);
    if (PACK.workbookItems.length !== 12 || PACK.recheckItems.length !== 4 || new Set(all.map(function (entry) { return entry.id; })).size !== 16) throw new Error("NSC_COUNT_INVALID");
    all.forEach(validateItem);
    const coverage = new Set(PACK.recheckItems.map(function (entry) { return entry.strand; }));
    Object.keys(STRANDS).forEach(function (strand) { if (!coverage.has(strand)) throw new Error("NSC_RECHECK_COVERAGE_INVALID"); });
    return true;
  }
  validatePack();
  return freeze({ schemaVersion: 1, pack: PACK, solveItem: solveItem, evaluateResponse: evaluateResponse, formatResult: formatResult, hintFor: hintFor, solutionFor: solutionFor, validateItem: validateItem, validatePack: validatePack });
});
