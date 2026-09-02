(function (root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.GFIELDGrade6EEBClinicPack = value;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function freeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { freeze(value[key]); });
    return Object.freeze(value);
  }
  function tr(ko, en, zh) { return freeze({ ko: ko, en: en, "zh-Hans": zh }); }
  function gcd(left, right) {
    let a = left < 0n ? -left : left; let b = right < 0n ? -right : right;
    while (b) { const next = a % b; a = b; b = next; }
    return a || 1n;
  }
  function rational(numerator, denominator) {
    const n = BigInt(numerator); const d = BigInt(denominator == null ? 1 : denominator);
    if (d === 0n) throw new Error("EEB_ZERO_DENOMINATOR");
    const sign = d < 0n ? -1n : 1n; const divisor = gcd(n, d);
    return freeze({ numerator: sign * n / divisor, denominator: (d < 0n ? -d : d) / divisor });
  }
  function q(numerator, denominator) { return freeze({ numerator: numerator, denominator: denominator == null ? 1 : denominator }); }
  function item(definition) { return freeze(definition); }
  function asRational(value) { return rational(value.numerator, value.denominator); }
  function add(left, right) { return rational(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator); }
  function subtract(left, right) { return rational(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator); }
  function multiply(left, right) { return rational(left.numerator * right.numerator, left.denominator * right.denominator); }
  function divide(left, right) {
    if (right.numerator === 0n) throw new Error("EEB_DIVIDE_BY_ZERO");
    return rational(left.numerator * right.denominator, left.denominator * right.numerator);
  }
  function equal(left, right) { return left.numerator === right.numerator && left.denominator === right.denominator; }
  function compare(left, right) { return left.numerator * right.denominator < right.numerator * left.denominator ? -1 : (equal(left, right) ? 0 : 1); }
  function show(value) { return value.denominator === 1n ? String(value.numerator) : value.numerator + "/" + value.denominator; }

  const WORKBOOK_ITEMS = [
    item({ id: "eeb-w01", section: "truth", strand: "substitution-truth", level: "foundation", kind: "substitution-truth", responseFormat: "binary-whole", prompt: tr("집합 {2, 4, 6}에서 x = 4를 x + 3 = 7에 대입합니다. 등식이 참이면 1, 아니면 0을 쓰세요.", "In the set {2, 4, 6}, substitute x = 4 into x + 3 = 7. Write 1 if the equation is true or 0 if it is false.", "在集合{2, 4, 6}中，把x = 4代入x + 3 = 7。若等式成立写1，否则写0。"), data: { form: "add", candidateSet: [q(2), q(4), q(6)], candidate: q(4), p: q(3), total: q(7) }, unit: tr("", "", ""), errorCode: "substitution-not-checked" }),
    item({ id: "eeb-w02", section: "truth", strand: "substitution-truth", level: "core", kind: "substitution-truth", responseFormat: "binary-whole", prompt: tr("집합 {1/2, 3/2, 5/2}에서 x = 3/2를 2x = 3에 대입합니다. 참이면 1, 아니면 0을 쓰세요.", "In the set {1/2, 3/2, 5/2}, substitute x = 3/2 into 2x = 3. Write 1 if true or 0 if false.", "在集合{1/2, 3/2, 5/2}中，把x = 3/2代入2x = 3。若等式成立写1，否则写0。"), data: { form: "multiply", candidateSet: [q(1, 2), q(3, 2), q(5, 2)], candidate: q(3, 2), p: q(2), total: q(3) }, unit: tr("", "", ""), errorCode: "substitution-not-checked" }),
    item({ id: "eeb-w03", section: "truth", strand: "substitution-truth", level: "core", kind: "substitution-truth", responseFormat: "binary-whole", prompt: tr("집합 {1, 2, 3}에서 x = 2를 x + 4 = 7에 대입합니다. 참이면 1, 아니면 0을 쓰세요.", "In the set {1, 2, 3}, substitute x = 2 into x + 4 = 7. Write 1 if true or 0 if false.", "在集合{1, 2, 3}中，把x = 2代入x + 4 = 7。若等式成立写1，否则写0。"), data: { form: "add", candidateSet: [q(1), q(2), q(3)], candidate: q(2), p: q(4), total: q(7) }, unit: tr("", "", ""), errorCode: "substitution-not-checked" }),

    item({ id: "eeb-w04", section: "additive", strand: "additive-equation", level: "foundation", kind: "add-equation", responseFormat: "rational-exact", prompt: tr("x + 5 = 13을 풀어 x의 값을 쓰세요.", "Solve x + 5 = 13. Write the value of x.", "解方程x + 5 = 13，写出x的值。"), data: { p: q(5), total: q(13) }, unit: tr("", "", ""), errorCode: "inverse-operation" }),
    item({ id: "eeb-w05", section: "additive", strand: "additive-equation", level: "core", kind: "add-equation", responseFormat: "simplest-fraction", prompt: tr("x + 3/4 = 2를 풀어 x를 기약분수로 쓰세요.", "Solve x + 3/4 = 2. Write x as a fraction in simplest form.", "解方程x + 3/4 = 2，把x写成最简分数。"), data: { p: q(3, 4), total: q(2) }, unit: tr("", "", ""), errorCode: "rational-operation" }),
    item({ id: "eeb-w06", section: "additive", strand: "additive-equation", level: "core", kind: "add-equation", responseFormat: "rational-exact", prompt: tr("민지는 책을 12쪽 읽었고 오늘까지 모두 35쪽을 읽으려 합니다. 더 읽을 쪽수를 p라 할 때 p + 12 = 35입니다. p를 구하세요.", "Minji has read 12 pages and plans to have read 35 pages in all. If p is the number of pages still to read, p + 12 = 35. Find p.", "敏智已经读了12页，计划一共读35页。若p表示还要读的页数，则p + 12 = 35。求p。"), data: { p: q(12), total: q(35) }, unit: tr("쪽", "pages", "页"), errorCode: "context-equation" }),

    item({ id: "eeb-w07", section: "multiplicative", strand: "multiplicative-equation", level: "foundation", kind: "multiply-equation", responseFormat: "rational-exact", prompt: tr("8x = 72를 풀어 x의 값을 쓰세요.", "Solve 8x = 72. Write the value of x.", "解方程8x = 72，写出x的值。"), data: { coefficient: q(8), total: q(72) }, unit: tr("", "", ""), errorCode: "coefficient-meaning" }),
    item({ id: "eeb-w08", section: "multiplicative", strand: "multiplicative-equation", level: "core", kind: "multiply-equation", responseFormat: "rational-exact", prompt: tr("(3/4)x = 9를 풀어 x의 값을 쓰세요.", "Solve (3/4)x = 9. Write the value of x.", "解方程(3/4)x = 9，写出x的值。"), data: { coefficient: q(3, 4), total: q(9) }, unit: tr("", "", ""), errorCode: "rational-operation" }),
    item({ id: "eeb-w09", section: "multiplicative", strand: "multiplicative-equation", level: "core", kind: "multiply-equation", responseFormat: "rational-exact", prompt: tr("공책 한 권의 가격이 2.5달러이고 전체 가격이 15달러입니다. 공책 수를 n이라 할 때 2.5n = 15입니다. n을 구하세요.", "Each notebook costs $2.50 and the total is $15. If n is the number of notebooks, 2.5n = 15. Find n.", "每本练习本2.5美元，总价15美元。若n表示本数，则2.5n = 15。求n。"), data: { coefficient: q(5, 2), total: q(15) }, unit: tr("권", "notebooks", "本"), errorCode: "context-equation" }),

    item({ id: "eeb-w10", section: "inequalities", strand: "inequality-constraint", level: "foundation", kind: "inequality-boundary", responseFormat: "rational-exact", prompt: tr("놀이기구를 타려면 키 h가 48인치보다 커야 합니다. h > c로 나타낼 때 경계값 c를 쓰세요.", "A rider's height h must be greater than 48 inches. In h > c, write the boundary value c.", "乘坐该游乐设施时，身高h必须大于48英寸。写成h > c时，写出边界值c。"), data: { relation: ">", boundary: q(48) }, unit: tr("인치", "inches", "英寸"), errorCode: "boundary-direction" }),
    item({ id: "eeb-w11", section: "inequalities", strand: "inequality-constraint", level: "core", kind: "inequality-set-count", responseFormat: "whole-number", prompt: tr("집합 {2, 5, 7, 9}에서 x < 7을 만족하는 값은 몇 개입니까?", "How many values in {2, 5, 7, 9} satisfy x < 7?", "集合{2, 5, 7, 9}中有多少个数满足x < 7？"), data: { relation: "<", boundary: q(7), candidates: [q(2), q(5), q(7), q(9)] }, unit: tr("개", "values", "个"), errorCode: "strict-boundary" }),
    item({ id: "eeb-w12", section: "inequalities", strand: "inequality-constraint", level: "core", kind: "inequality-direction", responseFormat: "binary-whole", prompt: tr("수직선에서 x > 3의 해는 3의 오른쪽으로 뻗습니다. 오른쪽이면 1, 왼쪽이면 0을 쓰세요.", "On a number line, the solutions of x > 3 extend to the right of 3. Write 1 for right or 0 for left.", "在数轴上，x > 3的解从3向右延伸。向右写1，向左写0。"), data: { relation: ">", boundary: q(3) }, unit: tr("", "", ""), errorCode: "boundary-direction" })
  ];

  const RECHECK_ITEMS = [
    item({ id: "eeb-r01", section: "recheck", strand: "substitution-truth", level: "core", kind: "substitution-truth", responseFormat: "binary-whole", prompt: tr("집합 {3/2, 5/2, 7/2}에서 x = 5/2를 x + 1/2 = 3에 대입합니다. 참이면 1, 아니면 0을 쓰세요.", "In the set {3/2, 5/2, 7/2}, substitute x = 5/2 into x + 1/2 = 3. Write 1 if true or 0 if false.", "在集合{3/2, 5/2, 7/2}中，把x = 5/2代入x + 1/2 = 3。若等式成立写1，否则写0。"), data: { form: "add", candidateSet: [q(3, 2), q(5, 2), q(7, 2)], candidate: q(5, 2), p: q(1, 2), total: q(3) }, unit: tr("", "", ""), errorCode: "substitution-not-checked" }),
    item({ id: "eeb-r02", section: "recheck", strand: "additive-equation", level: "advanced", kind: "add-equation", responseFormat: "simplest-fraction", prompt: tr("x + 7/5 = 4를 풀어 x를 기약분수로 쓰세요.", "Solve x + 7/5 = 4. Write x as a fraction in simplest form.", "解方程x + 7/5 = 4，把x写成最简分数。"), data: { p: q(7, 5), total: q(4) }, unit: tr("", "", ""), errorCode: "rational-operation" }),
    item({ id: "eeb-r03", section: "recheck", strand: "multiplicative-equation", level: "advanced", kind: "multiply-equation", responseFormat: "rational-exact", prompt: tr("(5/6)x = 10을 풀어 x의 값을 쓰세요.", "Solve (5/6)x = 10. Write the value of x.", "解方程(5/6)x = 10，写出x的值。"), data: { coefficient: q(5, 6), total: q(10) }, unit: tr("", "", ""), errorCode: "rational-operation" }),
    item({ id: "eeb-r04", section: "recheck", strand: "inequality-constraint", level: "core", kind: "inequality-set-count", responseFormat: "whole-number", prompt: tr("집합 {1, 4, 6, 8, 10}에서 x > 6을 만족하는 값은 몇 개입니까?", "How many values in {1, 4, 6, 8, 10} satisfy x > 6?", "集合{1, 4, 6, 8, 10}中有多少个数满足x > 6？"), data: { relation: ">", boundary: q(6), candidates: [q(1), q(4), q(6), q(8), q(10)] }, unit: tr("개", "values", "个"), errorCode: "strict-boundary" })
  ];

  const STRANDS = freeze({
    "substitution-truth": tr("대입으로 참 판정", "Test truth by substitution", "代入判断真假"),
    "additive-equation": tr("x + p = q 방정식", "Equations of the form x + p = q", "x + p = q型方程"),
    "multiplicative-equation": tr("px = q 방정식", "Equations of the form px = q", "px = q型方程"),
    "inequality-constraint": tr("부등식의 경계와 해", "Inequality boundaries and solutions", "不等式的边界与解")
  });
  const ERROR_GUIDES = freeze({
    "substitution-not-checked": { label: tr("대입 뒤 양쪽을 확인하지 않음", "Did not check both sides after substitution", "代入后没有检验等式两边"), prompt: tr("후보값을 x 자리에 넣고 왼쪽과 오른쪽을 각각 계산하게 하세요.", "Substitute the candidate for x and calculate each side separately.", "把候选值代入x，分别计算等式两边。") },
    "inverse-operation": { label: tr("같은 수를 빼지 않음", "Did not undo addition", "没有用减法消去加数"), prompt: tr("등호 양쪽에서 같은 수를 빼면 균형이 유지된다는 점을 말하게 하세요.", "Ask why subtracting the same number from both sides preserves equality.", "让学生说明为什么等式两边减去同一个数仍保持相等。") },
    "rational-operation": { label: tr("유리수 역연산 오류", "Rational inverse-operation error", "有理数逆运算错误"), prompt: tr("분수와 소수를 정확한 분수로 바꾸고 역연산 뒤 원래 식에 대입해 확인하게 하세요.", "Use exact fractions for the inverse operation, then substitute into the original equation.", "把分数或小数化为准确分数，做逆运算后代回原方程检验。") },
    "context-equation": { label: tr("상황의 수와 변수를 연결하지 못함", "Did not connect the variable to the context", "没有把变量与情境中的数量对应起来"), prompt: tr("변수가 무엇을 뜻하는지 단위와 함께 말한 뒤 식의 각 수를 상황과 짝지으세요.", "State what the variable represents, including its unit, then match each number to the context.", "先说明变量及其单位，再把方程中的每个数与情境对应。") },
    "coefficient-meaning": { label: tr("6x를 x + 6으로 읽음", "Read 6x as x + 6", "把6x误读成x + 6"), prompt: tr("6x는 같은 x가 6묶음이라는 뜻임을 상자 모델로 확인하게 하세요.", "Use equal boxes to show that 6x means six equal groups of x.", "用相同方框说明6x表示6个相等的x。") },
    "boundary-direction": { label: tr("경계값 또는 방향을 반대로 읽음", "Reversed the boundary or direction", "把边界值或方向读反了"), prompt: tr("경계값에는 빈 점을 두고, 큰 값은 오른쪽·작은 값은 왼쪽임을 수직선에서 확인하세요.", "Use an open point at the boundary; greater values extend right and lesser values extend left.", "在边界处画空心点；较大的数向右，较小的数向左。") },
    "strict-boundary": { label: tr("경계값을 해에 포함함", "Included the strict boundary", "把严格边界也算作解"), prompt: tr("<와 >에는 등호가 없으므로 경계값 자체는 해가 아님을 대입으로 확인하세요.", "Because < and > do not include equality, substitute the boundary and verify that it is not a solution.", "因为<和>不含等号，把边界值代入可确认它不是解。") }
  });

  const PACK = freeze({
    schemaVersion: 1, id: "gfield-grade6-ee-b-clinic-v1", clusterId: "6.EE.B", standardRange: "6.EE.B.5-8", learnerStage: "US Grade 6 ages 11-12",
    contentOrigin: "gfield-original-authored-public-clinic", rights: { publication: "public", assetRights: "original", containsThirdPartyAssets: false },
    scopeNotice: tr("이 공개 클리닉은 6.EE.B.5-8의 대입 참 판정, 한 단계 방정식의 정확한 해, 부등식의 경계·후보 해·수직선 방향을 연습하고 확인합니다. 상황을 처음부터 변수와 식으로 쓰기, 부등식의 무한히 많은 해 설명, 실제 수직선 그리기는 교사가 별도로 관찰합니다. 이 결과는 비공개 진단 근거를 확장하지 않습니다. 또한 전체 영역 숙달이나 승급을 자동 결정하지 않습니다.", "This public clinic practices and checks substitution truth, exact solutions of one-step equations, and inequality boundaries, candidate solutions, and number-line direction in 6.EE.B.5-8. A teacher separately observes writing variables and expressions from scratch, explaining infinitely many inequality solutions, and drawing number lines. These results do not expand the private diagnostic evidence contract. They do not automatically determine full mastery or promotion.", "本公开专项练习用于练习并检查6.EE.B.5-8中的代入判断、一元一步方程的准确解，以及不等式的边界、候选解和数轴方向。根据情境独立设变量并列式、说明不等式有无数个解、实际画数轴，由教师另行观察。本结果不扩展非公开诊断的证据范围，也不自动判定全部掌握或晋级。"),
    title: tr("6.EE.B 방정식과 부등식 클리닉", "6.EE.B Equations and Inequalities Clinic", "6.EE.B 方程与不等式专项练习"),
    subtitle: tr("후보값을 대입하고, 등식의 균형을 유지해 x를 구하며, 부등식의 경계와 방향을 연결합니다.", "Substitute candidate values, preserve equality while finding x, and connect inequality boundaries to direction.", "代入候选值，在保持等式平衡的同时求x，并把不等式边界与方向联系起来。"),
    conceptSummary: tr("방정식의 해는 식을 참으로 만드는 값입니다. x + p = q에서는 양쪽에서 p를 빼고, px = q에서는 양쪽을 p로 나눕니다. 부등식 x > c와 x < c는 하나의 답이 아니라 경계 c의 한쪽에 있는 무한히 많은 해를 나타냅니다.", "A solution makes an equation true. For x + p = q, subtract p from both sides; for px = q, divide both sides by p. An inequality x > c or x < c describes infinitely many solutions on one side of boundary c, not one answer.", "方程的解使等式成立。解x + p = q时两边同时减p；解px = q时两边同时除以p。不等式x > c或x < c表示边界c一侧的无数个解，而不是一个答案。"),
    workedExample: { title: tr("해결 예시 · 6x = 42", "Worked example · 6x = 42", "例题 · 6x = 42"), prompt: tr("같은 값의 상자 6개와 42의 균형을 유지하며 x를 구하세요.", "Keep six equal x-boxes balanced with 42 while finding x.", "保持6个相等的x方框与42平衡，求x。"), steps: [tr("6x는 같은 값 x가 6묶음이라는 뜻입니다.", "6x means six equal groups of x.", "6x表示6个相等的x。"), tr("등호 양쪽을 6으로 나누면 x = 7입니다.", "Divide both sides by 6 to get x = 7.", "等式两边同时除以6，得到x = 7。"), tr("검산: 6 × 7 = 42이므로 해가 정확합니다.", "Check: 6 × 7 = 42, so the solution is exact.", "检验：6 × 7 = 42，所以解正确。") ] },
    ui: { titleLead: tr("등식의 균형을", "Keep equations balanced.", "保持等式平衡。"), titleAccent: tr("대입하고, 풀고, 검산하기.", "Substitute. Solve. Verify.", "代入、求解、检验。"), hero: tr("대입 참 판정, 덧셈 방정식, 곱셈 방정식, 부등식의 경계와 방향을 네 묶음으로 학습합니다.", "Learn substitution truth, additive equations, multiplicative equations, and inequality boundaries and direction in four focused sets.", "分四组学习代入判断、加法方程、乘法方程，以及不等式的边界和方向。"), sectionOrder: ["truth", "additive", "multiplicative", "inequalities", "recheck"], sectionLabels: { truth: tr("1 · 대입으로 참인지 확인", "1 · Test truth by substitution", "1 · 代入判断真假"), additive: tr("2 · x + p = q 풀기", "2 · Solve x + p = q", "2 · 解x + p = q"), multiplicative: tr("3 · px = q 풀기", "3 · Solve px = q", "3 · 解px = q"), inequalities: tr("4 · 부등식의 경계와 방향", "4 · Inequality boundaries and direction", "4 · 不等式的边界与方向"), recheck: tr("새 문항 · 4영역 재확인", "New items · Four-strand recheck", "新题 · 四领域复测") } },
    workbookItems: WORKBOOK_ITEMS, recheckItems: RECHECK_ITEMS, strands: STRANDS, errorGuides: ERROR_GUIDES
  });

  function equationValue(candidate) {
    const data = candidate.data;
    if (candidate.kind === "substitution-truth") {
      const x = asRational(data.candidate); const p = asRational(data.p); const total = asRational(data.total);
      return rational((data.form === "add" ? equal(add(x, p), total) : equal(multiply(p, x), total)) ? 1 : 0);
    }
    if (candidate.kind === "add-equation") return subtract(asRational(data.total), asRational(data.p));
    if (candidate.kind === "multiply-equation") return divide(asRational(data.total), asRational(data.coefficient));
    if (candidate.kind === "inequality-boundary") return asRational(data.boundary);
    if (candidate.kind === "inequality-set-count") {
      const boundary = asRational(data.boundary);
      const count = data.candidates.filter(function (value) { const order = compare(asRational(value), boundary); return data.relation === ">" ? order > 0 : order < 0; }).length;
      return rational(count);
    }
    if (candidate.kind === "inequality-direction") return rational(data.relation === ">" ? 1 : 0);
    throw new Error("EEB_KIND_UNSUPPORTED");
  }
  function parseNumber(value) {
    const text = String(value == null ? "" : value).trim().replace(/,/g, "").replace(/[−–—]/g, "-");
    let match = text.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);
    try {
      if (match) return rational(match[1], match[2]);
      match = text.match(/^([+-]?\d+)(?:\.(\d+))?$/);
      if (!match) return null;
      const decimals = match[2] || ""; const denominator = 10n ** BigInt(decimals.length);
      const sign = text.startsWith("-") ? -1n : 1n;
      return rational(sign * (BigInt(match[1].replace(/^[+-]/, "")) * denominator + BigInt(decimals || "0")), denominator);
    } catch (error) { return null; }
  }
  function solveItem(candidate) { const value = equationValue(candidate); if (value.numerator < 0n) throw new Error("EEB_NEGATIVE_RESULT"); return value; }
  function formatResult(candidate) { return show(solveItem(candidate)); }
  function evaluateResponse(candidate, response) {
    const actual = parseNumber(response); const expected = solveItem(candidate);
    if (!actual || !equal(actual, expected)) return false;
    if (candidate.responseFormat === "binary-whole") return actual.denominator === 1n && (actual.numerator === 0n || actual.numerator === 1n);
    if (candidate.responseFormat === "whole-number") return actual.denominator === 1n;
    if (candidate.responseFormat === "simplest-fraction") {
      const match = String(response == null ? "" : response).trim().match(/^([+-]?\d+)\s*\/\s*([+]?[1-9]\d*)$/);
      if (!match || gcd(BigInt(match[1]), BigInt(match[2])) !== 1n) return false;
    } else if (candidate.responseFormat === "rational-exact" && String(response).includes("/")) {
      const match = String(response).trim().match(/^([+-]?\d+)\s*\/\s*([+]?[1-9]\d*)$/);
      if (!match || gcd(BigInt(match[1]), BigInt(match[2])) !== 1n) return false;
    }
    return true;
  }
  function hintFor(candidate, locale) { const key = locale === "zh" ? "zh-Hans" : locale; return ERROR_GUIDES[candidate.errorCode].prompt[key]; }
  function solutionFor(candidate, locale) {
    const key = locale === "zh" ? "zh-Hans" : locale; const answer = formatResult(candidate); const data = candidate.data; let copy;
    if (candidate.kind === "substitution-truth") copy = tr("후보값을 x에 대입해 양쪽을 계산하면 결과는 " + (answer === "1" ? "참" : "거짓") + "이므로 " + answer + "입니다.", "Substitute the candidate and calculate both sides. The statement is " + (answer === "1" ? "true" : "false") + ", so enter " + answer + ".", "把候选值代入并计算两边。等式" + (answer === "1" ? "成立" : "不成立") + "，所以写" + answer + "。");
    else if (candidate.kind === "add-equation") copy = tr("등호 양쪽에서 " + show(asRational(data.p)) + "을 빼면 x = " + answer + "입니다. 원래 식에 대입해 검산하세요.", "Subtract " + show(asRational(data.p)) + " from both sides to get x = " + answer + ". Substitute back to check.", "等式两边同时减去" + show(asRational(data.p)) + "，得到x = " + answer + "。代回原方程检验。");
    else if (candidate.kind === "multiply-equation") copy = tr("등호 양쪽을 " + show(asRational(data.coefficient)) + "로 나누면 x = " + answer + "입니다. 계수와 다시 곱해 검산하세요.", "Divide both sides by " + show(asRational(data.coefficient)) + " to get x = " + answer + ". Multiply by the coefficient to check.", "等式两边同时除以" + show(asRational(data.coefficient)) + "，得到x = " + answer + "。再乘系数检验。");
    else if (candidate.kind === "inequality-boundary") copy = tr("비교 기준이 되는 수가 경계값이므로 c = " + answer + "입니다.", "The comparison number is the boundary, so c = " + answer + ".", "比较所依据的数就是边界值，所以c = " + answer + "。");
    else if (candidate.kind === "inequality-set-count") copy = tr("각 후보를 경계와 비교하되 경계 자체는 제외하면 " + answer + "개입니다.", "Compare each candidate with the boundary and exclude the boundary itself. There are " + answer + " values.", "逐个与边界比较，并排除边界本身，共有" + answer + "个。");
    else copy = tr("큰 값은 수직선의 오른쪽에 있으므로 x > c의 해는 오른쪽, 즉 1입니다.", "Greater values lie to the right, so x > c extends right: enter 1.", "较大的数在数轴右侧，所以x > c的解向右延伸，写1。");
    return copy[key];
  }
  function validateItem(candidate) {
    const kinds = new Set(["substitution-truth", "add-equation", "multiply-equation", "inequality-boundary", "inequality-set-count", "inequality-direction"]);
    if (!candidate || !/^eeb-[wr]\d{2}$/.test(candidate.id) || !kinds.has(candidate.kind)) throw new Error("EEB_ITEM_INVALID");
    if (!STRANDS[candidate.strand] || !ERROR_GUIDES[candidate.errorCode]) throw new Error("EEB_ALIGNMENT_INVALID");
    ["ko", "en", "zh-Hans"].forEach(function (locale) { if (!candidate.prompt[locale]) throw new Error("EEB_LOCALE_INVALID"); });
    const answer = solveItem(candidate);
    if (candidate.kind === "substitution-truth") {
      if (!Array.isArray(candidate.data.candidateSet) || candidate.data.candidateSet.length < 3) throw new Error("EEB_CANDIDATE_SET_INVALID");
      if (!candidate.data.candidateSet.some(function (value) { return equal(asRational(value), asRational(candidate.data.candidate)); })) throw new Error("EEB_CANDIDATE_MISSING");
      if (answer.denominator !== 1n || ![0n, 1n].includes(answer.numerator)) throw new Error("EEB_TRUTH_RESULT_INVALID");
    }
    if (candidate.kind === "multiply-equation" && asRational(candidate.data.coefficient).numerator === 0n) throw new Error("EEB_ZERO_COEFFICIENT");
    if (["inequality-boundary", "inequality-set-count", "inequality-direction"].includes(candidate.kind) && !["<", ">"].includes(candidate.data.relation)) throw new Error("EEB_RELATION_INVALID");
    return true;
  }
  function validatePack() {
    const all = PACK.workbookItems.concat(PACK.recheckItems);
    if (PACK.workbookItems.length !== 12 || PACK.recheckItems.length !== 4 || new Set(all.map(function (entry) { return entry.id; })).size !== 16) throw new Error("EEB_COUNT_INVALID");
    all.forEach(validateItem);
    if (new Set(PACK.recheckItems.map(function (entry) { return entry.strand; })).size !== 4) throw new Error("EEB_RECHECK_COVERAGE_INVALID");
    if (!PACK.workbookItems.some(function (entry) { return entry.kind === "substitution-truth" && formatResult(entry) === "0"; })) throw new Error("EEB_FALSE_CONTROL_MISSING");
    return true;
  }
  validatePack();
  return freeze({ schemaVersion: 1, pack: PACK, rational: rational, solveItem: solveItem, evaluateResponse: evaluateResponse, formatResult: formatResult, hintFor: hintFor, solutionFor: solutionFor, validateItem: validateItem, validatePack: validatePack });
});
