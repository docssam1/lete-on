(function (root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.GMAPAnimatedMathLessons = value;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function tr(en, ko, zh) { return Object.freeze({ en: en, ko: ko, zh: zh }); }
  function beat(id, label, phase, narration, targetIds, visibleIds, action) {
    return Object.freeze({
      id: id, label: label.en, labelI18n: label, phase: phase, durationMs: 3900,
      narration: narration.en, narrationI18n: narration,
      targetIds: Object.freeze(targetIds), visibleIds: Object.freeze(visibleIds),
      actions: Object.freeze([{ type: action || "draw", targetIds: Object.freeze(targetIds) }])
    });
  }
  function common(definition) {
    const beatIds = definition.beats.map(function (item) { return item.id; });
    return Object.freeze(Object.assign({
      rights: Object.freeze({ publication: "public", assetRights: "original", containsThirdPartyAssets: false }),
      audience: "upper-elementary-middle", languages: Object.freeze(["en", "ko", "zh"]),
      deliveryMode: "concept-open",
      unlockPolicy: "open-concept; worked-solutions-require-first-wrong-attempt",
      fullPlayBeatIds: Object.freeze(beatIds), stepByStepBeatIds: Object.freeze(beatIds),
      finalOverview: Object.freeze({ visibleObjectIds: definition.objectIds })
    }, definition));
  }

  const ratioIds = ["ratio-team-a-bar", "ratio-red-value", "ratio-team-b-bar", "ratio-green-value", "ratio-answer"];
  const ratioBeats = [
    beat("ratio-read", tr("Read the structure", "구조 읽기", "读懂结构"), "problem",
      tr("Both teams total twenty tokens, but each ratio divides twenty into a different number of equal parts.", "두 팀은 모두 스무 개이지만, 각 비율은 스무 개를 서로 다른 수의 같은 부분으로 나눕니다.", "两队都是二十枚棋子，但两个比分把二十分成了不同数量的等份。"), [], [], "inspect"),
    beat("ratio-team-a", tr("Build Team A", "A팀 막대 만들기", "画出A队条形图"), "explore",
      tr("Team A has four equal parts. Twenty divided by four makes each part worth five.", "A팀은 같은 부분이 네 개입니다. 이십을 사로 나누면 한 부분은 오입니다.", "A队共有四个等份。二十除以四，所以每份是五。"), ["ratio-team-a-bar"], ["ratio-team-a-bar"]),
    beat("ratio-red", tr("Find the red part", "빨간 부분 찾기", "求红色部分"), "solve",
      tr("Red is one part, so Team A has five red tokens.", "빨간색은 한 부분이므로 A팀의 빨간 토큰은 다섯 개입니다.", "红色占一份，所以A队有五枚红色棋子。"), ["ratio-red-value"], ["ratio-team-a-bar", "ratio-red-value"]),
    beat("ratio-team-b", tr("Build Team B", "B팀 막대 만들기", "画出B队条形图"), "explore",
      tr("Team B has five equal parts. Twenty divided by five makes each part worth four.", "B팀은 같은 부분이 다섯 개입니다. 이십을 오로 나누면 한 부분은 사입니다.", "B队共有五个等份。二十除以五，所以每份是四。"), ["ratio-team-b-bar"], ["ratio-team-a-bar", "ratio-red-value", "ratio-team-b-bar"]),
    beat("ratio-green", tr("Find the green part", "초록 부분 찾기", "求绿色部分"), "solve",
      tr("Green is one part, so Team B has four green tokens.", "초록색은 한 부분이므로 B팀의 초록 토큰은 네 개입니다.", "绿色占一份，所以B队有四枚绿色棋子。"), ["ratio-green-value"], ["ratio-team-a-bar", "ratio-red-value", "ratio-team-b-bar", "ratio-green-value"]),
    beat("ratio-answer", tr("Combine the parts", "두 부분 합하기", "合并两部分"), "answer",
      tr("Five plus four equals nine. There are nine red and green tokens altogether.", "오 더하기 사는 구입니다. 빨간 토큰과 초록 토큰은 모두 아홉 개입니다.", "五加四等于九。红色和绿色棋子一共有九枚。"), ["ratio-answer"], ratioIds),
    beat("ratio-recap", tr("Explain the key idea", "핵심 설명하기", "说明关键方法"), "recap",
      tr("Equal totals do not guarantee equal unit sizes. Count the ratio parts before finding one part.", "전체 수가 같아도 한 부분의 크기는 같지 않을 수 있습니다. 먼저 비율의 부분 수를 세세요.", "总数相同不代表每份相同。先数比分中的总份数，再求一份。"), ["ratio-team-a-bar"], ratioIds, "highlight")
  ];

  const fractionIds = ["frac-whole", "frac-eighth-grid", "frac-three-fourths", "frac-six-groups", "frac-equation", "frac-check", "frac-answer"];
  const fractionBeats = [
    beat("frac-read", tr("Read the quantities", "양 읽기", "读懂数量"), "problem",
      tr("We have three-fourths of a meter and cut pieces that are each one-eighth of a meter.", "4분의 3미터의 끈을 8분의 1미터씩 자릅니다.", "有四分之三米的绳子，每段剪成八分之一米。"), [], [], "inspect"),
    beat("frac-whole", tr("Draw one whole", "전체 1 그리기", "画出一个整体"), "explore",
      tr("Draw one meter as a single strip. The strip is our whole.", "1미터를 하나의 막대로 그립니다. 이 막대가 전체 1입니다.", "把一米画成一条线段，这条线段表示整体一。"), ["frac-whole"], ["frac-whole"]),
    beat("frac-eighths", tr("Partition into eighths", "8등분하기", "八等分"), "explore",
      tr("Partition the whole into eight equal parts. Each small part is one-eighth meter.", "전체를 같은 크기 8칸으로 나눕니다. 한 칸은 8분의 1미터입니다.", "把整体平均分成八份，每一小份是八分之一米。"), ["frac-eighth-grid"], ["frac-whole", "frac-eighth-grid"]),
    beat("frac-three-fourths", tr("Rename three-fourths", "4분의 3 바꾸어 보기", "改写四分之三"), "explore",
      tr("Three-fourths covers six of the eight equal parts, so three-fourths equals six-eighths.", "4분의 3은 8칸 중 6칸이므로 8분의 6과 같습니다.", "四分之三覆盖八份中的六份，所以四分之三等于八分之六。"), ["frac-three-fourths"], ["frac-whole", "frac-eighth-grid", "frac-three-fourths"]),
    beat("frac-count", tr("Count one-eighth groups", "8분의 1씩 세기", "数八分之一的份数"), "solve",
      tr("Count the one-eighth pieces inside six-eighths. There are six equal groups.", "8분의 6 안에서 8분의 1짜리 조각을 세면 같은 조각이 6개입니다.", "在八分之六里数八分之一的小段，一共有六段。"), ["frac-six-groups"], ["frac-whole", "frac-eighth-grid", "frac-three-fourths", "frac-six-groups"]),
    beat("frac-equation", tr("Write the equation", "식으로 나타내기", "写出算式"), "solve",
      tr("The model shows three-fourths divided by one-eighth equals six.", "그림은 4분의 3 나누기 8분의 1이 6임을 보여 줍니다.", "图示说明四分之三除以八分之一等于六。"), ["frac-equation"], ["frac-whole", "frac-eighth-grid", "frac-three-fourths", "frac-six-groups", "frac-equation"]),
    beat("frac-check", tr("Check by multiplication", "곱셈으로 검산하기", "用乘法检验"), "check",
      tr("Check the quotient: six times one-eighth equals six-eighths, which is three-fourths.", "검산하면 6 곱하기 8분의 1은 8분의 6이고, 4분의 3과 같습니다.", "检验：六乘八分之一等于八分之六，也就是四分之三。"), ["frac-check"], ["frac-whole", "frac-eighth-grid", "frac-three-fourths", "frac-six-groups", "frac-equation", "frac-check"]),
    beat("frac-answer", tr("State the answer", "답 말하기", "写出答案"), "answer",
      tr("Six pieces can be cut from the rope.", "끈은 6조각으로 자를 수 있습니다.", "这根绳子可以剪成六段。"), ["frac-answer"], fractionIds),
    beat("frac-recap", tr("Explain the meaning", "뜻 연결하기", "说明含义"), "recap",
      tr("Fraction division asks how many divisor-sized groups fit in the dividend. Rename both quantities with the same unit, then count.", "분수 나눗셈은 나누는 분수 크기의 묶음이 나누어지는 양 안에 몇 개 들어가는지 묻습니다. 같은 단위로 바꾸고 셉니다.", "分数除法是在问被除数里包含多少个与除数同样大小的组。先化成相同单位，再数份数。"), ["frac-six-groups"], fractionIds, "highlight")
  ];

  const gcfIds = ["gcf-values", "gcf-factor-84", "gcf-factor-60", "gcf-common", "gcf-chain", "gcf-check", "gcf-answer"];
  const gcfBeats = [
    beat("gcf-read", tr("Read the two numbers", "두 수 읽기", "读出两个数"), "problem",
      tr("We need the greatest factor shared by eighty-four and sixty.", "84와 60이 공통으로 가지는 약수 중 가장 큰 수를 찾습니다.", "我们要找84和60共有的最大因数。"), [], [], "inspect"),
    beat("gcf-values", tr("Set the target", "목표 세우기", "明确目标"), "explore",
      tr("Place the two numbers side by side so every factor must be checked against both.", "두 수를 나란히 놓고 모든 인수가 양쪽에 공통인지 확인합니다.", "把两个数并排放置，检查每个因数是否两边共有。"), ["gcf-values"], ["gcf-values"]),
    beat("gcf-factor-84", tr("Factor eighty-four", "84 소인수분해", "分解84"), "explore",
      tr("Eighty-four factors as two times two times three times seven.", "84는 2 곱하기 2 곱하기 3 곱하기 7입니다.", "84分解为2乘2乘3乘7。"), ["gcf-factor-84"], ["gcf-values", "gcf-factor-84"]),
    beat("gcf-factor-60", tr("Factor sixty", "60 소인수분해", "分解60"), "explore",
      tr("Sixty factors as two times two times three times five.", "60은 2 곱하기 2 곱하기 3 곱하기 5입니다.", "60分解为2乘2乘3乘5。"), ["gcf-factor-60"], ["gcf-values", "gcf-factor-84", "gcf-factor-60"]),
    beat("gcf-common", tr("Match shared factors", "공통 소인수 짝짓기", "配对公有质因数"), "solve",
      tr("Both factorizations contain two, two, and three. Seven and five are not shared.", "양쪽에 공통인 소인수는 2, 2, 3입니다. 7과 5는 공통이 아닙니다.", "两边共有的质因数是2、2、3；7和5不共有。"), ["gcf-common"], ["gcf-values", "gcf-factor-84", "gcf-factor-60", "gcf-common"]),
    beat("gcf-chain", tr("Confirm with remainders", "나머지로 다시 확인", "用余数再次确认"), "check",
      tr("The Euclidean chain ends at twelve: eighty-four leaves twenty-four after sixty, then sixty leaves twelve after two twenty-fours.", "유클리드 나눗셈은 84=60×1+24, 60=24×2+12, 24=12×2+0으로 끝납니다.", "欧几里得除法为84=60×1+24，60=24×2+12，24=12×2+0。"), ["gcf-chain"], ["gcf-values", "gcf-factor-84", "gcf-factor-60", "gcf-common", "gcf-chain"]),
    beat("gcf-check", tr("Check both divisions", "두 나눗셈 검산", "检验两个除法"), "check",
      tr("Twelve divides both numbers exactly: eighty-four divided by twelve is seven, and sixty divided by twelve is five.", "12는 두 수를 모두 정확히 나눕니다. 84 나누기 12는 7이고, 60 나누기 12는 5입니다.", "12能整除两个数：84除以12等于7，60除以12等于5。"), ["gcf-check"], ["gcf-values", "gcf-factor-84", "gcf-factor-60", "gcf-common", "gcf-chain", "gcf-check"]),
    beat("gcf-answer", tr("State the GCF", "최대공약수 말하기", "写出最大公因数"), "answer",
      tr("Two times two times three is twelve, so the greatest common factor is twelve.", "2 곱하기 2 곱하기 3은 12이므로 최대공약수는 12입니다.", "2乘2乘3等于12，所以最大公因数是12。"), ["gcf-answer"], gcfIds),
    beat("gcf-recap", tr("Explain both proofs", "두 검산 연결하기", "连接两种验证"), "recap",
      tr("Prime-factor matching finds twelve, and the remainder chain independently confirms the same unique greatest common factor.", "공통 소인수의 곱으로 12를 구하고, 나머지 나눗셈으로 같은 최대공약수를 독립적으로 확인했습니다.", "公有质因数的乘积得到12，余数链也独立确认同一个最大公因数。"), ["gcf-common"], gcfIds, "highlight")
  ];

  const signedIds = ["signed-axis", "signed-point-a", "signed-point-b", "signed-common-units", "signed-distance-a", "signed-distance-b", "signed-order", "signed-answer"];
  const signedBeats = [
    beat("signed-read", tr("Read the two values", "두 수 읽기", "读取两个数"), "problem",
      tr("Compare negative seven-fourths and negative five-thirds on the same number line.", "음의 4분의 7과 음의 3분의 5를 같은 수직선에서 비교합니다.", "在同一数轴上比较负四分之七与负三分之五。"), [], [], "inspect"),
    beat("signed-axis", tr("Build the number line", "수직선 만들기", "建立数轴"), "explore",
      tr("Build a number line from negative two to zero. Values increase as we move right.", "-2부터 0까지 수직선을 만들면 오른쪽으로 갈수록 값이 커집니다.", "建立从-2到0的数轴，越向右数值越大。"), ["signed-axis"], ["signed-axis"]),
    beat("signed-point-a", tr("Place negative seven-fourths", "-7/4 표시하기", "标出-7/4"), "explore",
      tr("Negative seven-fourths is negative one and three-fourths, so place it three fourths of a unit left of negative one.", "-7/4은 -1과 -2 사이의 값이므로 -1에서 왼쪽으로 3/4만큼 간 곳에 표시합니다.", "-7/4等于负一又四分之三，因此标在-1左侧四分之三个单位处。"), ["signed-point-a"], ["signed-axis", "signed-point-a"]),
    beat("signed-point-b", tr("Place negative five-thirds", "-5/3 표시하기", "标出-5/3"), "explore",
      tr("Negative five-thirds is negative one and two-thirds. It lies slightly to the right of negative seven-fourths.", "-5/3은 -1과 -2 사이에서 -1의 왼쪽으로 2/3만큼 간 값이며 -7/4보다 조금 오른쪽에 있습니다.", "-5/3等于负一又三分之二，位置比-7/4略靠右。"), ["signed-point-b"], ["signed-axis", "signed-point-a", "signed-point-b"]),
    beat("signed-common", tr("Rename in twelfths", "12분의 몇으로 바꾸기", "化成十二分数"), "solve",
      tr("Use twelfths: negative seven-fourths is negative twenty-one twelfths, and negative five-thirds is negative twenty twelfths.", "공통분모 12를 쓰면 -7/4은 -21/12이고 -5/3은 -20/12입니다.", "化为十二分数：-7/4是-21/12，-5/3是-20/12。"), ["signed-common-units"], ["signed-axis", "signed-point-a", "signed-point-b", "signed-common-units"]),
    beat("signed-distance-a", tr("Measure the first distance", "첫 번째 거리 확인", "测量第一段距离"), "check",
      tr("The distance from zero to negative seven-fourths is twenty-one twelfths.", "0에서 -7/4까지의 거리는 21/12입니다.", "从0到-7/4的距离是21/12。"), ["signed-distance-a"], ["signed-axis", "signed-point-a", "signed-point-b", "signed-common-units", "signed-distance-a"]),
    beat("signed-distance-b", tr("Measure the second distance", "두 번째 거리 확인", "测量第二段距离"), "check",
      tr("The distance from zero to negative five-thirds is twenty twelfths, one twelfth shorter.", "0에서 -5/3까지의 거리는 20/12로 첫 번째보다 1/12 짧습니다.", "从0到-5/3的距离是20/12，比第一段短1/12。"), ["signed-distance-b"], ["signed-axis", "signed-point-a", "signed-point-b", "signed-common-units", "signed-distance-a", "signed-distance-b"]),
    beat("signed-order", tr("Use left-to-right order", "왼쪽과 오른쪽 비교", "按左右位置比较"), "solve",
      tr("Negative seven-fourths is farther left, so it is the smaller number.", "-7/4이 더 왼쪽에 있으므로 더 작은 수입니다.", "-7/4更靠左，所以它是较小的数。"), ["signed-order"], ["signed-axis", "signed-point-a", "signed-point-b", "signed-common-units", "signed-distance-a", "signed-distance-b", "signed-order"]),
    beat("signed-answer", tr("State the comparison", "비교 결과 말하기", "写出比较结果"), "answer",
      tr("Negative seven-fourths is less than negative five-thirds.", "-7/4은 -5/3보다 작습니다.", "-7/4小于-5/3。"), ["signed-answer"], signedIds),
    beat("signed-recap", tr("Connect both checks", "두 확인 방법 연결하기", "连接两种检验"), "recap",
      tr("Common denominators differ by one twelfth, and the number line independently shows the same left-to-right order.", "공통분모에서는 1/12 차이가 나고 수직선에서도 같은 좌우 순서를 독립적으로 확인합니다.", "同分母比较相差1/12，数轴也独立显示相同的左右顺序。"), ["signed-order"], signedIds, "highlight")
  ];

  const expressionIds = ["expr-original", "expr-power", "expr-inside", "expr-product", "expr-subtract", "expr-distribute", "expr-answer"];
  const expressionBeats = [
    beat("expr-read", tr("Read the expression tree", "식의 구조 읽기", "读懂式子结构"), "problem",
      tr("The outer subtraction contains a product, and that product contains a sum with a power.", "가장 바깥에는 뺄셈이 있고, 그 안의 곱셈은 거듭제곱이 들어 있는 합을 포함합니다.", "最外层是减法，其中的乘法又包含一个带有幂的和。"), [], [], "inspect"),
    beat("expr-original", tr("Mark the nested structure", "겹친 구조 표시하기", "标出嵌套结构"), "explore",
      tr("Keep the original expression visible and follow the nesting from the inside out.", "원래 식을 계속 보면서 가장 안쪽부터 바깥쪽으로 따라갑니다.", "保留原式，从最内层向外逐层计算。"), ["expr-original"], ["expr-original"]),
    beat("expr-power", tr("Evaluate the power", "거듭제곱 계산하기", "计算幂"), "solve",
      tr("Two cubed means two times two times two, which equals eight.", "2의 세제곱은 2 곱하기 2 곱하기 2이므로 8입니다.", "2的三次方是2乘2乘2，等于8。"), ["expr-power"], ["expr-original", "expr-power"]),
    beat("expr-inside", tr("Finish the parentheses", "괄호 안 계산하기", "算完括号内"), "solve",
      tr("Replace the power with eight. Eight plus four equals twelve.", "거듭제곱 자리에 8을 넣으면 괄호 안은 8 더하기 4, 즉 12입니다.", "把幂换成8，括号内8加4等于12。"), ["expr-inside"], ["expr-original", "expr-power", "expr-inside"]),
    beat("expr-product", tr("Multiply the grouped value", "괄호의 값 곱하기", "乘括号的值"), "solve",
      tr("Three times twelve equals thirty-six.", "3 곱하기 12는 36입니다.", "3乘12等于36。"), ["expr-product"], ["expr-original", "expr-power", "expr-inside", "expr-product"]),
    beat("expr-subtract", tr("Complete the outer operation", "바깥 연산 마치기", "完成最外层运算"), "solve",
      tr("Subtract five from thirty-six to get thirty-one.", "36에서 5를 빼면 31입니다.", "36减5等于31。"), ["expr-subtract"], ["expr-original", "expr-power", "expr-inside", "expr-product", "expr-subtract"]),
    beat("expr-distribute", tr("Verify by distribution", "분배법칙으로 검산하기", "用分配律检验"), "check",
      tr("Distribute three to both inside terms: three times eight plus three times four minus five also equals thirty-one.", "3을 괄호 안의 두 항에 모두 분배하면 3 곱하기 8 더하기 3 곱하기 4 빼기 5도 31입니다.", "把3分配到括号内两项：3乘8加3乘4减5也等于31。"), ["expr-distribute"], ["expr-original", "expr-power", "expr-inside", "expr-product", "expr-subtract", "expr-distribute"]),
    beat("expr-answer", tr("State the value", "식의 값 말하기", "写出式子的值"), "answer",
      tr("Both calculation paths give the unique value thirty-one.", "두 계산 방법이 모두 하나의 값 31을 줍니다.", "两种计算方法都得到唯一的值31。"), ["expr-answer"], expressionIds),
    beat("expr-recap", tr("Explain the order", "연산 순서 설명하기", "说明运算顺序"), "recap",
      tr("Respect the nested structure: power, parentheses, multiplication, then subtraction. Distribution independently confirms the result.", "겹친 구조에 따라 거듭제곱, 괄호, 곱셈, 뺄셈 순서로 계산하고 분배법칙으로 독립 검산합니다.", "按嵌套结构依次计算幂、括号、乘法、减法，再用分配律独立检验。"), ["expr-original"], expressionIds, "highlight")
  ];

  const geometryIds = ["geo-triangle", "geo-equal-sides", "geo-vertex-angle", "geo-equal-angles", "geo-equation-sum", "geo-equation-divide", "geo-answer"];
  const geometryBeats = [
    beat("geo-read", tr("Read the givens", "조건 읽기", "读取条件"), "problem",
      tr("AB equals AC, and the angle between those equal sides is forty degrees.", "AB와 AC의 길이가 같고, 두 변 사이의 각은 사십 도입니다.", "AB等于AC，两条相等边之间的夹角是四十度。"), [], [], "inspect"),
    beat("geo-triangle", tr("Construct the triangle", "삼각형 구성하기", "构造三角形"), "explore",
      tr("Construct the triangle from its points and segments. A forty-degree vertex angle makes a narrow, symmetric triangle.", "점과 선분으로 삼각형을 구성합니다. 꼭짓각이 사십 도이므로 폭이 좁은 대칭 삼각형이 됩니다.", "用点和线段构造三角形。顶角为四十度，因此得到较窄的对称三角形。"), ["geo-triangle"], ["geo-triangle"]),
    beat("geo-equal-sides", tr("Mark equal sides", "같은 변 표시하기", "标记等边"), "explore",
      tr("Matching tick marks show that AB and AC have equal length.", "같은 눈금 표시가 AB와 AC의 길이가 같다는 뜻입니다.", "相同的刻痕表示AB和AC长度相等。"), ["geo-equal-sides"], ["geo-triangle", "geo-equal-sides"]),
    beat("geo-vertex", tr("Mark the vertex angle", "꼭짓각 표시하기", "标记顶角"), "explore",
      tr("The angle at A is forty degrees.", "A의 각은 사십 도입니다.", "A点的角是四十度。"), ["geo-vertex-angle"], ["geo-triangle", "geo-equal-sides", "geo-vertex-angle"]),
    beat("geo-equal", tr("Match the base angles", "밑각 같게 보기", "找出相等底角"), "explore",
      tr("Equal sides face equal angles, so angle B equals angle C.", "같은 길이의 변과 마주 보는 각은 같으므로 각 B와 각 C가 같습니다.", "等边所对的角相等，所以角B等于角C。"), ["geo-equal-angles"], ["geo-triangle", "geo-equal-sides", "geo-vertex-angle", "geo-equal-angles"]),
    beat("geo-sum", tr("Use the angle sum", "각의 합 사용하기", "使用内角和"), "solve",
      tr("Subtract forty degrees from one hundred eighty degrees. The two base angles total one hundred forty degrees.", "백팔십 도에서 사십 도를 빼면 두 밑각의 합은 백사십 도입니다.", "用一百八十度减去四十度，两个底角的和是一百四十度。"), ["geo-equation-sum"], ["geo-triangle", "geo-equal-sides", "geo-vertex-angle", "geo-equal-angles", "geo-equation-sum"]),
    beat("geo-divide", tr("Share equally", "같게 나누기", "平均分配"), "solve",
      tr("The equal base angles share one hundred forty degrees, so each is seventy degrees.", "서로 같은 두 밑각이 백사십 도를 나누므로 각각 칠십 도입니다.", "两个相等的底角平分一百四十度，所以每个是七十度。"), ["geo-equation-divide"], ["geo-triangle", "geo-equal-sides", "geo-vertex-angle", "geo-equal-angles", "geo-equation-sum", "geo-equation-divide"]),
    beat("geo-answer", tr("State angle B", "각 B 답하기", "写出角B"), "answer",
      tr("Angle B is seventy degrees.", "각 B는 칠십 도입니다.", "所以角B等于七十度。"), ["geo-answer"], geometryIds),
    beat("geo-recap", tr("Explain the chain", "풀이 연결하기", "回顾推理链"), "recap",
      tr("Equal sides give equal opposite angles; then the triangle angle sum determines their value.", "같은 변에서 같은 맞은편 각을 찾고, 삼각형의 내각의 합으로 그 값을 구합니다.", "先由等边得到相等的对角，再用三角形内角和求出角度。"), ["geo-equal-angles"], geometryIds, "highlight")
  ];

  return Object.freeze({ schemaVersion: 5, lessons: Object.freeze([
    common({
      id: "common-total-ratio", type: "bar-model",
      conceptClusterId: "6.RP.A",
      eyebrow: "RATIO · VISUAL MODEL", eyebrowI18n: tr("RATIO · VISUAL MODEL", "비율 · 시각 모델", "比 · 可视化模型"),
      title: "Common totals, different unit sizes", titleI18n: tr("Common totals, different unit sizes", "전체가 같아도 한 부분은 다르다", "总数相同，每份不同"),
      concept: "Part-to-whole ratios", conceptI18n: tr("Part-to-whole ratios", "부분과 전체의 비", "部分与整体的比"),
      problem: "Team A has red and blue tokens in a 1:3 ratio. Team B has green and yellow tokens in a 1:4 ratio. Each team has 20 tokens. How many red and green tokens are there altogether?",
      problemI18n: tr("Team A has red and blue tokens in a 1:3 ratio. Team B has green and yellow tokens in a 1:4 ratio. Each team has 20 tokens. How many red and green tokens are there altogether?", "A팀의 빨간 토큰과 파란 토큰의 비는 1:3이고, B팀의 초록 토큰과 노란 토큰의 비는 1:4입니다. 각 팀의 토큰은 20개입니다. 빨간 토큰과 초록 토큰은 모두 몇 개입니까?", "A队红色与蓝色棋子的比是1:3，B队绿色与黄色棋子的比是1:4。每队共有20枚棋子。红色和绿色棋子一共有多少枚？"),
      verifiedAnswer: "9 tokens", answerBeatId: "ratio-answer", objectIds: Object.freeze(ratioIds), beats: Object.freeze(ratioBeats),
      sceneModel: Object.freeze({ teamA: Object.freeze({ parts: 4, unit: 5 }), teamB: Object.freeze({ parts: 5, unit: 4 }) }),
      mathChecks: Object.freeze([Object.freeze({ method: "unit rate", expression: "20 ÷ 4 + 20 ÷ 5", result: 9, passed: true }), Object.freeze({ method: "substitution", expression: "5 + 15 = 20; 4 + 16 = 20", result: 9, passed: true })]),
      teacherEvidence: Object.freeze({ likelyMisconception: "The student adds ratio numbers without finding the value of one part.", teachingPrompt: "Why is one part worth 5 for Team A but 4 for Team B?", successCheck: "The student finds the total number of parts, the unit value, and the requested part in that order." })
    }),
    common({
      id: "fraction-division-eighths", type: "fraction-strip",
      conceptClusterId: "6.NS.A",
      eyebrow: "FRACTION DIVISION · VISUAL MODEL", eyebrowI18n: tr("FRACTION DIVISION · VISUAL MODEL", "분수 나눗셈 · 시각 모델", "分数除法 · 可视化模型"),
      title: "Count equal-size fraction groups", titleI18n: tr("Count equal-size fraction groups", "같은 크기의 분수 묶음을 세기", "数相同大小的分数组"),
      concept: "Meaning of fraction division", conceptI18n: tr("Meaning of fraction division", "분수 나눗셈의 뜻", "分数除法的意义"),
      problem: "A rope is 3/4 m long. It is cut into pieces that are each 1/8 m long. How many pieces are made?",
      problemI18n: tr("A rope is 3/4 m long. It is cut into pieces that are each 1/8 m long. How many pieces are made?", "3/4 m 길이의 끈을 1/8 m씩 자릅니다. 몇 조각이 됩니까?", "一根绳子长3/4米，每段剪成1/8米，可以剪成多少段？"),
      verifiedAnswer: "6 pieces", answerBeatId: "frac-answer", objectIds: Object.freeze(fractionIds), beats: Object.freeze(fractionBeats),
      sceneModel: Object.freeze({ wholeParts: 8, shadedParts: 6, divisorParts: 1, quotient: 6, dividend: Object.freeze({ n: 3, d: 4 }), divisor: Object.freeze({ n: 1, d: 8 }) }),
      mathChecks: Object.freeze([Object.freeze({ method: "common denominator", expression: "3/4 = 6/8; count 1/8 groups", result: 6, passed: true }), Object.freeze({ method: "inverse multiplication", expression: "3/4 × 8/1", result: 6, passed: true }), Object.freeze({ method: "reverse check", expression: "6 × 1/8", result: "3/4", passed: true })]),
      teacherEvidence: Object.freeze({ likelyMisconception: "The student divides the numerators and denominators separately or inverts the dividend.", teachingPrompt: "How many one-eighth sections are shaded when three-fourths is renamed in eighths?", successCheck: "The student explains the quotient as the number of divisor-sized groups and verifies it by multiplication." })
    }),
    common({
      id: "gcf-factor-chain", type: "factor-chain",
      conceptClusterId: "6.NS.B",
      eyebrow: "GCF · TWO-WAY VERIFICATION", eyebrowI18n: tr("GCF · TWO-WAY VERIFICATION", "최대공약수 · 두 가지 검산", "最大公因数 · 双重验证"),
      title: "Match factors, then verify with remainders", titleI18n: tr("Match factors, then verify with remainders", "공통인수를 찾고 나머지로 검산하기", "配对公因数，再用余数检验"),
      concept: "Greatest common factor", conceptI18n: tr("Greatest common factor", "최대공약수", "最大公因数"),
      problem: "Find the greatest common factor of 84 and 60.", problemI18n: tr("Find the greatest common factor of 84 and 60.", "84와 60의 최대공약수를 구하세요.", "求84和60的最大公因数。"),
      verifiedAnswer: "12", answerBeatId: "gcf-answer", objectIds: Object.freeze(gcfIds), beats: Object.freeze(gcfBeats),
      sceneModel: Object.freeze({ values: Object.freeze([84, 60]), primeFactors: Object.freeze({ 84: Object.freeze([2, 2, 3, 7]), 60: Object.freeze([2, 2, 3, 5]) }), commonFactors: Object.freeze([2, 2, 3]), euclideanChain: Object.freeze([Object.freeze({ dividend: 84, divisor: 60, quotient: 1, remainder: 24 }), Object.freeze({ dividend: 60, divisor: 24, quotient: 2, remainder: 12 }), Object.freeze({ dividend: 24, divisor: 12, quotient: 2, remainder: 0 })]), answer: 12 }),
      mathChecks: Object.freeze([Object.freeze({ method: "prime factorization", expression: "(2×2×3×7) and (2×2×3×5)", result: 12, passed: true }), Object.freeze({ method: "Euclidean algorithm", expression: "84=60×1+24; 60=24×2+12; 24=12×2", result: 12, passed: true }), Object.freeze({ method: "reverse divisibility", expression: "84÷12=7; 60÷12=5", result: 12, passed: true })]),
      teacherEvidence: Object.freeze({ likelyMisconception: "The student lists a common factor but does not prove it is the greatest.", teachingPrompt: "Which prime factors can be paired across both numbers, and how does the remainder chain confirm your result?", successCheck: "The student identifies 2, 2, and 3 as shared, obtains 12, and verifies that 12 divides both numbers." })
    }),
    common({
      id: "signed-rational-number-line", type: "signed-number-line",
      conceptClusterId: "6.NS.C",
      eyebrow: "SIGNED RATIONALS · NUMBER LINE", eyebrowI18n: tr("SIGNED RATIONALS · NUMBER LINE", "음의 유리수 · 수직선", "有理数 · 数轴"),
      title: "Position determines signed-number order", titleI18n: tr("Position determines signed-number order", "위치로 음수의 순서를 판단한다", "用位置判断负数大小"),
      concept: "Comparing signed rational numbers", conceptI18n: tr("Comparing signed rational numbers", "음의 유리수 비교", "比较有理数"),
      problem: "Compare -7/4 and -5/3 using < or >.", problemI18n: tr("Compare -7/4 and -5/3 using < or >.", "-7/4과 -5/3을 < 또는 >로 비교하세요.", "用<或>比较-7/4与-5/3。"),
      verifiedAnswer: "-7/4 < -5/3", answerBeatId: "signed-answer", objectIds: Object.freeze(signedIds), beats: Object.freeze(signedBeats),
      sceneModel: Object.freeze({ domain: Object.freeze({ minNumerator: -2, maxNumerator: 0, denominator: 1 }), tickDenominator: 12, first: Object.freeze({ numerator: -7, denominator: 4, label: "-7/4" }), second: Object.freeze({ numerator: -5, denominator: 3, label: "-5/3" }), commonDenominator: 12 }),
      mathChecks: Object.freeze([Object.freeze({ method: "common denominator", expression: "-7/4 = -21/12; -5/3 = -20/12", result: "-21/12 < -20/12", passed: true }), Object.freeze({ method: "cross multiplication", expression: "(-7)×3 = -21; (-5)×4 = -20", result: "-21 < -20", passed: true }), Object.freeze({ method: "number-line position", expression: "-7/4 lies left of -5/3", result: "-7/4 < -5/3", passed: true })]),
      teacherEvidence: Object.freeze({ likelyMisconception: "The student compares 7 and 5 without accounting for denominators or the direction of negative-number order.", teachingPrompt: "Which point is farther left, and how do -21/12 and -20/12 confirm that position?", successCheck: "The student converts both fractions to twelfths, locates both points, and explains why the farther-left value is smaller." })
    }),
    common({
      id: "expression-structure-order", type: "expression-tree",
      conceptClusterId: "6.EE.A",
      eyebrow: "EXPRESSIONS · STRUCTURE FIRST", eyebrowI18n: tr("EXPRESSIONS · STRUCTURE FIRST", "대수식 · 구조 먼저", "代数式 · 先看结构"),
      title: "Follow the expression from the inside out", titleI18n: tr("Follow the expression from the inside out", "식의 안쪽부터 바깥쪽으로 계산한다", "从式子内部向外计算"),
      concept: "Operation order and equivalent expressions", conceptI18n: tr("Operation order and equivalent expressions", "연산 순서와 동치식", "运算顺序与等价式"),
      problem: "Evaluate 3(2³ + 4) - 5 and verify the value by distribution.", problemI18n: tr("Evaluate 3(2³ + 4) - 5 and verify the value by distribution.", "3(2³ + 4) - 5의 값을 구하고 분배법칙으로 검산하세요.", "计算3(2³ + 4) - 5，并用分配律检验。"),
      verifiedAnswer: "31", answerBeatId: "expr-answer", objectIds: Object.freeze(expressionIds), beats: Object.freeze(expressionBeats),
      sceneModel: Object.freeze({ coefficient: 3, base: 2, exponent: 3, insideAddend: 4, outsideAddend: -5 }),
      mathChecks: Object.freeze([Object.freeze({ method: "nested operation order", expression: "2³=8; 8+4=12; 3×12=36; 36-5", result: 31, passed: true }), Object.freeze({ method: "distribution", expression: "3×8 + 3×4 - 5", result: 31, passed: true }), Object.freeze({ method: "inverse outer check", expression: "31+5=36; 36÷3=12", result: 12, passed: true })]),
      teacherEvidence: Object.freeze({ likelyMisconception: "The student reads 2³ as 2×3 or distributes 3 to only one term.", teachingPrompt: "Which operation is deepest inside the structure, and which two terms receive the outside factor?", successCheck: "The student evaluates the power first, preserves the parentheses, and confirms the same value by distributing to both terms." })
    }),
    common({
      id: "isosceles-angle", type: "geometry-angle",
      conceptClusterId: "competition-geometry",
      eyebrow: "GEOMETRY · ANGLE REASONING", eyebrowI18n: tr("GEOMETRY · ANGLE REASONING", "기하 · 각 추론", "几何 · 角度推理"),
      title: "Equal sides reveal equal angles", titleI18n: tr("Equal sides reveal equal angles", "같은 변에서 같은 각 찾기", "由等边找等角"),
      concept: "Isosceles triangles and angle sum", conceptI18n: tr("Isosceles triangles and angle sum", "이등변삼각형과 내각의 합", "等腰三角形与内角和"),
      problem: "Triangle ABC is isosceles with AB = AC. The vertex angle A is 40°. Find angle B.", problemI18n: tr("Triangle ABC is isosceles with AB = AC. The vertex angle A is 40°. Find angle B.", "삼각형 ABC는 AB = AC인 이등변삼각형입니다. 꼭짓각 A가 40°일 때 각 B를 구하세요.", "三角形ABC是等腰三角形，AB = AC。顶角A为40°，求角B。"),
      verifiedAnswer: "70°", answerBeatId: "geo-answer", objectIds: Object.freeze(geometryIds), beats: Object.freeze(geometryBeats),
      sceneModel: Object.freeze({ vertexAngleDeg: 40, equalSides: Object.freeze(["AB", "AC"]), targetAngle: "B" }),
      mathChecks: Object.freeze([Object.freeze({ method: "angle sum", expression: "(180 - 40) ÷ 2", result: 70, passed: true }), Object.freeze({ method: "substitution", expression: "40 + 70 + 70", result: 180, passed: true })]),
      teacherEvidence: Object.freeze({ likelyMisconception: "The student divides 180 by 2 before removing the vertex angle.", teachingPrompt: "Which angles are opposite the two equal sides?", successCheck: "The student identifies the equal base angles before applying the 180-degree angle sum." })
    })
  ]) });
});
