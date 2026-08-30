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

  return Object.freeze({ schemaVersion: 3, lessons: Object.freeze([
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
