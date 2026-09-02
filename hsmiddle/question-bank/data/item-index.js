(function (root, factory) {
  "use strict";
  const schema = typeof module !== "undefined" && module.exports
    ? require("./schema.js")
    : root.HSMIDDLE_QUESTION_BANK_SCHEMA;
  const api = factory(schema);
  root.HSMIDDLE_QUESTION_ITEM_INDEX = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (schema) {
  "use strict";

  const freeze = Object.freeze;
  const SOURCE_EXAM_ID = "diagnostic-similar";
  const RELEASE_LOCKED_NUMBERS = new Set();
  function hasOfficialAnswerConflict(number, itemNumber) {
    return number === 25 && itemNumber === 3;
  }
  function hasSolutionConflict(number, itemNumber) {
    return hasOfficialAnswerConflict(number, itemNumber) || (number === 39 && itemNumber === 4);
  }
  function itemEvidenceStatus(number, itemNumber) {
    return hasSolutionConflict(number, itemNumber) ? "conflict" : "verified";
  }
  function validationStatus(number, itemNumber) {
    return freeze({
      source: "verified",
      officialAnswer: hasOfficialAnswerConflict(number, itemNumber) ? "conflict" : "verified",
      solution: hasSolutionConflict(number, itemNumber) ? "conflict" : "verified",
      visual: "verified",
      independentMath: "verified",
      uniqueness: "verified",
      learnerFit: "verified",
      sourceBundleCompleteness: "verified"
    });
  }

  function scalar(value, unit) {
    return freeze({ value: String(value), unit: unit || null });
  }

  function set(values, unit) {
    return freeze({ values: freeze(values.map(String)), unit: unit || null, orderMatters: false });
  }

  function ordered(values, unit) {
    return freeze({ values: freeze(values.map(String)), unit: unit || null, orderMatters: true });
  }

  function mixed(whole, numerator, denominator, unit) {
    return freeze({ whole: String(whole), numerator: String(numerator), denominator: String(denominator), unit: unit || null });
  }

  function relation(primary, equivalents) {
    return freeze({
      result: scalar(primary),
      rubric: freeze({
        required: freeze(["두 기호가 나타내는 수의 관계를 식으로 씀", "주어진 모든 대응쌍에서 식이 성립함"]),
        acceptedEquivalent: freeze([primary].concat(equivalents || [])),
        scoring: "공식 답과 같거나 같은 뜻인 식으로 대응 관계를 나타냄"
      })
    });
  }

  function pageId(number, pageNumber) {
    return `diagnostic-similar-q${String(number).padStart(2, "0")}-p${String(pageNumber).padStart(2, "0")}`;
  }

  function learnerFit(sourceLevel, semester, language, representation, prerequisites, reasoningLoad, responseMode) {
    return freeze({
      learnerStage: freeze({
        sourceLevel,
        curriculumReference: semester,
        program: "중등 성취도 진단·선발 대비"
      }),
      learnerFitCriteria: freeze({
        language,
        representation,
        prerequisites: freeze(prerequisites),
        reasoningLoad,
        responseMode
      })
    });
  }

  function item(config) {
    const number = config.diagnosticNumber;
    const itemNumber = config.itemNumber;
    const problemPages = config.problemPages || [config.problemPage];
    const answerPages = config.answerPages || [config.answerPage];
    const solutionPages = config.solutionPages || [config.solutionPage];
    return freeze(Object.assign({
      itemId: `diagnostic-similar-q${String(number).padStart(2, "0")}-i${String(itemNumber).padStart(2, "0")}`,
      sourceExamId: SOURCE_EXAM_ID,
      diagnosticNumber: number,
      itemNumber,
      typeId: `diagnostic-similar-q${String(number).padStart(2, "0")}`,
      sourceLocator: freeze({
        problemAssetId: pageId(number, config.problemPage),
        problemAssetIds: freeze(problemPages.map(function (pageNumber) { return pageId(number, pageNumber); })),
        problemSlot: itemNumber,
        answerAssetId: pageId(number, config.answerPage),
        answerAssetIds: freeze(answerPages.map(function (pageNumber) { return pageId(number, pageNumber); })),
        solutionAssetId: pageId(number, config.solutionPage),
        solutionAssetIds: freeze(solutionPages.map(function (pageNumber) { return pageId(number, pageNumber); }))
      }),
      responseContract: config.responseContract || "single-value",
      canonicalAnswer: config.canonicalAnswer,
      structureSummary: config.structureSummary,
      detailTypeName: config.detailTypeName || null,
      conceptFamilyId: config.conceptFamilyId || null,
      sourceConflict: config.sourceConflict || null,
      evidence: validationStatus(number, itemNumber),
      workStatus: "complete",
      evidenceStatus: itemEvidenceStatus(number, itemNumber),
      releaseStatus: RELEASE_LOCKED_NUMBERS.has(number) ? "locked" : "eligible"
    }, config.learnerFit));
  }

  const q01Fit = learnerFit(
    "초4",
    "4-1",
    "큰 수의 자리값과 범위 조건을 읽고 수 또는 개수로 답하기",
    "큰 수, 자리 숫자, 수의 범위와 비교",
    ["큰 수 읽기", "자리값", "수의 크기 비교", "짝수"],
    "여러 자리 조건을 차례로 적용해 가능한 수를 찾거나 모두 센다.",
    "한글 수 읽기, 한 값, 여러 수 또는 풀이와 결과"
  );
  const q02Fit = learnerFit(
    "초4",
    "4-1",
    "수와 식의 규칙을 읽고 한 자리 또는 여러 자리 수로 답하기",
    "곱셈식 배열과 자릿수 규칙",
    ["곱셈", "자릿값", "규칙 찾기"],
    "배열의 변화를 찾아 다음 수를 계산하거나 설명한다.",
    "한 값 또는 설명과 결과"
  );
  const q03Fit = learnerFit(
    "초4",
    "4-1",
    "나눗셈, 시각, 걸린 시간과 빠르기 조건을 읽고 알맞은 값으로 답하기",
    "나눗셈식, 시각과 시간, 거리와 빠르기",
    ["곱셈과 나눗셈", "시각과 시간", "거리와 빠르기의 뜻"],
    "주어진 양을 되짚어 처음 수를 찾거나 시간과 이동 거리를 차례로 계산한다.",
    "한 값과 알맞은 단위"
  );
  const q04Fit = learnerFit(
    "초4",
    "4-1",
    "수 카드와 몫·나머지 조건을 읽고 알맞은 수나 개수로 답하기",
    "수 카드, 나눗셈식, 몫과 나머지",
    ["세 자리 수", "나눗셈", "몫과 나머지", "수의 크기 비교"],
    "카드로 만들 수 있는 수를 빠짐없이 확인하거나 몫과 나머지의 범위를 거꾸로 계산한다.",
    "한 값, 순서 있는 여러 값 또는 순서 없는 여러 수"
  );
  const q05Fit = learnerFit(
    "초4",
    "4-1",
    "삼각형의 세 각의 크기의 합과 직각·일직선 각을 이용해 모르는 각을 구하기",
    "각이 표시된 삼각형, 겹친 삼각형과 직각삼각형",
    ["각도", "삼각형의 세 각의 크기의 합", "직각", "일직선이 이루는 각"],
    "겹친 도형을 삼각형별로 나누어 각을 계산하고 필요한 각의 관계를 이어 간다.",
    "한 각도 또는 순서가 정해진 두 각도"
  );
  const q06Fit = learnerFit(
    "중1",
    "4-1",
    "도형에서 만나는 선과 각을 세고 쌍의 수로 답하기",
    "한 점에서 만나는 직선과 각 표시",
    ["각", "직선", "도형 세기"],
    "그림 속 각의 관계를 빠짐없이 세어 비교한다.",
    "수와 단위"
  );
  const q07Fit = learnerFit(
    "초5",
    "5-2",
    "분수만큼 빨라지거나 느려지는 시계와 함께 일하는 양을 계산해 시각·시간·날짜로 답하기",
    "대분수, 시간과 시각, 빠르고 느린 시계, 함께 하는 일",
    ["분수의 곱셈", "대분수", "시각과 시간", "하루와 일주일"],
    "한 시간이나 하루의 차이를 분수로 계산한 뒤 지난 시간만큼 곱하고 시각에 더하거나 뺀다.",
    "시각, 시간, 날짜 또는 대분수와 단위"
  );
  const q08Fit = learnerFit(
    "초4",
    "4-2",
    "사람이나 지점의 위치와 여러 거리를 읽고 두 거리의 차를 소수로 답하기",
    "앞뒤 위치를 나타낸 글과 여러 지점을 이은 거리 그림",
    ["소수의 덧셈과 뺄셈", "cm와 m", "거리의 합과 차", "수직선에서의 위치"],
    "겹쳐 주어진 전체 거리에서 필요한 부분 거리를 차례로 구하고 마지막 두 거리를 비교한다.",
    "소수 한 값과 m 또는 km 단위"
  );
  const q09Fit = learnerFit(
    "초5",
    "5-2",
    "분과 초 또는 시간과 분을 소수로 바꾸어 거리·길이·들이를 알맞은 단위로 답하기",
    "빠르기, 시간, 거리, 기차와 터널, 자동차와 사람의 이동 상황",
    ["소수의 곱셈", "시각과 시간", "거리·시간·빠르기", "km와 m", "L"],
    "시간을 소수로 바꾸고 같은 방향은 거리의 차, 반대 방향은 거리의 합을 이용해 여러 단계를 계산한다.",
    "소수 한 값과 km, m, L 또는 시간 단위"
  );
  const q10Fit = learnerFit(
    "초4",
    "4-2",
    "평행한 두 직선과 직각·각의 합·두 배·차 조건을 읽고 모르는 각도를 구하기",
    "평행한 두 직선 사이에서 여러 번 꺾인 선, 각 표시와 필요한 보조선",
    ["각도", "직각", "한 직선이 이루는 각", "사각형의 네 각의 크기의 합", "평행선에서 같은 위치의 각"],
    "꼭짓점을 지나는 평행선이나 수선을 생각해 각을 옮기고, 여러 각의 합과 차를 차례로 계산한다.",
    "한 각도"
  );
  const q11Fit = learnerFit(
    "중1",
    "4-2",
    "평행선의 동위각과 엇각, 식으로 나타낸 각과 각의 비를 읽고 모르는 각도를 구하기",
    "평행한 두 직선 사이에서 여러 번 꺾인 선, 문자로 표시한 각과 보조 평행선",
    ["맞꼭지각", "동위각", "엇각", "한 직선이 이루는 각", "각의 비"],
    "꺾인 점마다 평행선을 그어 각을 같은 위치로 옮기고, 식이나 비 조건을 함께 풀어 한 각 또는 각의 합·차를 구한다.",
    "한 각도 또는 여러 각의 합"
  );
  const q12Fit = learnerFit(
    "초5",
    "5-1",
    "두 수로 나누어떨어지거나 같은 수가 남고 모자라는 조건을 읽어 알맞은 수를 찾기",
    "줄 세우기, 상자에 담기, 모둠 만들기와 나누어 주기 상황",
    ["약수와 배수", "공배수", "최소공배수", "나눗셈의 나머지", "수의 범위"],
    "두 나눗셈 조건을 동시에 만족하는 수를 범위 안에서 빠짐없이 확인해 가장 작거나 큰 수를 고른다.",
    "한 자연수와 사람·개 단위"
  );
  const q13Fit = learnerFit(
    "초5",
    "5-1",
    "수 카드와 배수 조건을 읽고 알맞은 수 또는 개수로 답하기",
    "수 카드, 자릿수, 배수 조건",
    ["약수와 배수", "배수 판정", "자릿값"],
    "카드의 자리와 배수 조건을 함께 적용해 수를 고른다.",
    "한 값, 개수 또는 여러 수"
  );
  const q14Fit = learnerFit(
    "초5",
    "5-1",
    "배열 순서와 도형·점·타일의 수 사이의 규칙을 찾아 값이나 관계를 나타내기",
    "이어 붙인 다각형, 사각형 배열, 점 배열, 두 색 타일 배열과 대응표",
    ["다각형의 변", "도형 배열의 규칙", "수 배열의 규칙", "곱셈", "연속된 수의 합"],
    "처음 배열에서 그대로 남는 부분과 순서가 하나 늘 때마다 더해지는 부분을 나누어 대응 관계를 찾는다.",
    "한 값, 순서대로 쓴 여러 값, 색과 개수 또는 관계 설명"
  );
  const q15Fit = learnerFit(
    "초5",
    "5-1",
    "두 수의 대응쌍이나 기계에 넣고 나온 수를 보고 두 기호 사이의 관계를 식으로 나타내기",
    "순서쌍, 두 수를 묶은 상자, 넣은 수와 나온 수, 서로 다른 모양 기호",
    ["규칙과 대응", "곱셈과 나눗셈", "덧셈과 뺄셈", "계산 순서"],
    "여러 대응쌍에 모두 맞는 계산 규칙을 찾고, 앞의 수와 뒤의 수를 기호로 바꾸어 식으로 쓴다.",
    "공식 답과 같거나 같은 뜻인 대응식"
  );
  const q16Fit = learnerFit(
    "초4",
    "4-1",
    "같은 모양이나 글자는 같은 숫자를 나타내는 나눗셈에서 숨은 숫자를 찾아 순서대로 쓰기",
    "나눗셈 세로셈, 모양 기호, 한글 글자, 같은 숫자가 반복된 수",
    ["곱셈과 나눗셈", "나머지", "자리값", "서로 다른 숫자", "수의 크기 비교"],
    "몫과 곱한 수, 중간 나머지, 마지막 나머지를 차례로 맞추고 합·서로 다름·크기 조건을 함께 확인한다.",
    "문제에 제시된 모양이나 글자 순서대로 여러 숫자"
  );
  const q17Fit = learnerFit(
    "초5",
    "5-1",
    "가려진 자리에 들어갈 수와 배수 조건을 읽고 답하기",
    "빈 자리의 숫자와 배수 조건",
    ["약수와 배수", "배수 판정", "자릿값"],
    "여러 자리의 조건을 차례로 적용해 가능한 수를 찾는다.",
    "한 값, 개수 또는 여러 수"
  );
  const q18Fit = learnerFit(
    "초5",
    "5-1",
    "맞물린 두 톱니바퀴의 톱니 수를 보고 회전 수나 걸린 시간을 구하기",
    "두 톱니바퀴의 톱니 수, 처음 맞물린 위치, 회전 수와 시간",
    ["약수와 배수", "최소공배수", "곱셈과 나눗셈", "시간 단위"],
    "두 톱니 수의 최소공배수를 구하고 각 톱니 수로 나누어 회전 수를 찾는다. 시간이 주어지면 회전 수와 한 바퀴 시간을 곱한다.",
    "한 회전 수, 두 회전 수 또는 몇 분 후"
  );
  const q19Fit = learnerFit(
    "초5",
    "5-2",
    "정육면체와 주사위 전개도를 접었을 때 마주 보는 면과 보이지 않는 면의 수를 구하기",
    "수가 적힌 정육면체 전개도, 여러 정육면체를 붙인 그림, 주사위 전개도",
    ["정육면체의 면", "정육면체의 전개도", "마주 보는 면", "주사위의 마주 보는 두 면"],
    "전개도의 이어진 방향을 따라 면을 접고, 마주 보는 면의 짝을 정한 뒤 보이지 않는 면이나 함께 수직인 면을 찾는다.",
    "전개도의 빈칸에 넣을 여러 수 또는 한 합"
  );
  const q20Fit = learnerFit(
    "초5",
    "5-1",
    "분수와 대분수의 크기를 비교해 정해진 순서의 값이나 조건에 맞는 대상을 찾기",
    "여러 분수와 대분수, 수직선, 음료수 병의 양, 도시별 거리 표",
    ["약분과 통분", "분수의 크기 비교", "대분수와 가분수", "수직선"],
    "분모를 같게 하거나 교차곱으로 크기를 비교하고, 비교 결과를 순위·조건·거리 순서에 연결한다.",
    "한 분수, 한 기호 또는 순서가 있는 여러 이름"
  );
  const q21Fit = learnerFit(
    "초5",
    "5-1",
    "기준 분수와 크기가 같으면서 분자와 분모의 범위를 모두 만족하는 분수의 개수 구하기",
    "기준 분수, 분자 범위, 분모 범위",
    ["약분과 통분", "크기가 같은 분수", "자연수의 곱", "수의 범위"],
    "분자와 분모에 같은 수를 곱한 값을 만들고 두 범위에 함께 들어가는 경우만 센다.",
    "조건을 만족하는 분수의 개수"
  );
  const q22Fit = learnerFit(
    "초5",
    "5-1",
    "분수의 분자와 분모가 변하는 규칙을 찾아 정해진 두 항의 차 구하기",
    "차례로 놓인 분수와 항의 순서",
    ["분수의 덧셈과 뺄셈", "분수의 크기 비교", "규칙 찾기", "통분"],
    "분자와 분모의 변화를 각각 찾아 두 항을 만든 뒤 통분하여 큰 값에서 작은 값을 뺀다.",
    "두 분수의 차"
  );
  const q23Fit = learnerFit(
    "초5",
    "5-1",
    "전체를 1로 보고 여러 부분을 더하거나 빼서 남은 양과 처음 전체를 구하기",
    "날짜별 판매량, 사용한 끈과 리본, 구슬 수, 꽃밭 넓이, 책 수, 읽은 쪽수, 이동 거리",
    ["분수의 덧셈과 뺄셈", "전체와 부분", "단위분수", "길이·넓이·무게 단위"],
    "사용하거나 나눈 부분의 합을 구해 남은 부분을 찾고, 알려진 남은 양과 대응시켜 전체 또는 필요한 부분을 구한다.",
    "개수, 길이, 무게, 넓이, 분수 또는 거리"
  );
  const q24Fit = learnerFit(
    "초5",
    "5-2",
    "분수의 크기와 계산 규칙을 살펴 복잡한 덧셈과 뺄셈을 간단히 계산하기",
    "분수 묶음, 같은 수의 반복 곱셈, 단위분수의 합, 가장 가까운 자연수 약속",
    ["분수의 크기 비교", "분수의 덧셈과 뺄셈", "분수의 곱셈", "대분수"],
    "각 식에 맞는 약속이나 분모의 규칙을 먼저 찾고, 필요한 항만 남겨 정확한 값을 구한다.",
    "분수, 대분수 또는 자연수"
  );
  const q25Fit = learnerFit(
    "초5",
    "5-1",
    "직사각형 모양의 땅에서 가로와 세로로 낸 길의 폭을 빼 남은 부분의 넓이 구하기",
    "직사각형 모양의 땅과 가로·세로 또는 비스듬히 난 같은 폭의 길",
    ["직사각형의 넓이", "길의 폭", "길이의 단위", "도형 잘라 붙이기"],
    "길을 옮겨 모으면 남은 부분이 직사각형이 됨을 찾고, 전체 가로와 세로에서 길의 폭을 각각 빼 넓이를 구한다.",
    "넓이"
  );
  const q26Fit = learnerFit(
    "초5",
    "5-1",
    "넓이가 몇 배인지와 밑변 길이가 몇 배인지 이용해 나누어진 삼각형의 넓이 구하기",
    "정사각형, 삼각형, 평행사변형과 같은 높이를 가진 여러 삼각형",
    ["삼각형의 넓이", "평행사변형의 넓이", "선분의 길이", "배의 뜻"],
    "큰 도형과 작은 삼각형의 넓이 관계를 정리하고, 같은 높이에서 밑변 길이와 넓이가 같은 배로 변하는 성질을 적용한다.",
    "넓이"
  );
  const q27Fit = learnerFit(
    "초5",
    "5-2",
    "하루에 몇 분 몇 초씩 빨라지거나 느려지는 시계가 며칠 뒤 가리키는 시각 구하기",
    "하루에 달라지는 시간, 지난 날짜 수, 정오를 기준으로 한 시각",
    ["분수의 곱셈", "분과 초의 관계", "시각 계산", "대분수"],
    "하루의 분과 초를 분수인 분으로 바꾸고 지난 날짜 수를 곱한 뒤 정오에 더하거나 뺀다.",
    "시각 또는 알맞은 번호"
  );
  const q28Fit = learnerFit(
    "초4",
    "4-1",
    "시계 눈금의 각을 이용해 두 바늘이 이루는 작은 각과 바늘이 움직인 각 구하기",
    "숫자가 있는 시계, 일부 숫자가 지워진 시계, 버스 시간표와 계기판",
    ["각도", "한 바퀴 360도", "시각과 시간", "곱셈과 나눗셈"],
    "큰 눈금 한 칸의 각과 각 바늘이 시간에 따라 움직이는 각을 구해 더하거나 뺀다.",
    "각도, 시각 또는 여러 값"
  );
  const q29Fit = learnerFit(
    "초6",
    "6-2",
    "일정한 시간 동안 나오는 물의 양을 이용해 걸리는 시간이나 물의 양 구하기",
    "욕조와 수조, 한 개 또는 두 개의 수도꼭지, 분과 초",
    ["소수의 나눗셈", "들이의 단위 L", "시간의 단위", "반올림"],
    "1분당 나오는 물의 양을 구하거나 여러 수도꼭지의 양을 더한 뒤 전체 양을 나누어 시간을 구한다.",
    "분, 분과 초, 물의 양 또는 알맞은 수도꼭지"
  );
  const q30Fit = learnerFit(
    "초5",
    "5-2",
    "도형을 이루는 작은 부분과 주어진 길이·등분 조건을 보고 서로 포개어지는 도형의 쌍을 세기",
    "평행선과 대각선으로 나뉜 사각형, 여러 줄로 나뉜 삼각형",
    ["합동의 뜻", "선대칭과 점대칭", "평행사변형", "이등변삼각형", "도형 세기"],
    "작은 도형부터 여러 조각을 합친 도형까지 크기와 모양이 같은 경우를 빠짐없이 짝지어 센다.",
    "합동인 도형의 쌍의 수"
  );
  const q31Fit = learnerFit(
    "초6",
    "6-1",
    "터널 길이와 통과 시간을 읽고 열차가 1초에 가는 거리와 열차의 길이를 m로 답하기",
    "길이가 다른 두 터널과 열차의 통과 상황을 나타낸 글",
    ["비와 비율", "시간에 대한 거리의 비율", "곱셈과 나눗셈"],
    "짧은 터널을 지난 거리와 시간으로 1초 이동 거리를 구하고, 긴 터널을 완전히 지날 때 움직인 거리에서 터널 길이를 뺀다.",
    "한 값과 길이 단위"
  );
  const q32Fit = learnerFit(
    "초6",
    "6-2",
    "잘못한 계산과 바른 계산의 관계를 읽고 어떤 수, 몫 또는 가능한 수의 개수로 답하기",
    "소수의 나눗셈식, 잘못 사용한 연산, 반올림한 몫의 범위",
    ["소수의 곱셈과 나눗셈", "반올림", "자연수 부분과 소수 부분", "수의 범위"],
    "잘못 계산한 식을 먼저 거꾸로 풀고 바른 나눗셈을 하거나, 반올림되는 몫의 범위를 어떤 수의 범위로 바꾸어 확인한다.",
    "한 값, 개수 또는 순서가 정해진 두 몫"
  );
  const q33Fit = learnerFit(
    "초6",
    "6-2",
    "몫과 나머지로 어떤 수를 구한 뒤 다른 소수로 나누거나 반올림한 몫과 나머지를 답하기",
    "서로 이어진 두 소수 나눗셈, 몫과 나머지, 소수 기호 식, 합과 차",
    ["소수의 나눗셈", "몫과 나머지의 관계", "반올림", "수의 범위"],
    "나누어지는 수를 나누는 수와 몫의 곱에 나머지를 더해 구하고, 새 나눗셈의 몫과 나머지 또는 반올림한 값을 확인한다.",
    "한 값 또는 순서가 정해진 몫과 나머지"
  );
  const q34Fit = learnerFit(
    "초6",
    "6-1",
    "참여율과 성공률, 두 조건이 겹치는 비율, 가격의 이익과 할인 조건을 읽고 답하기",
    "인원수와 백분율 표, 두 조건이 겹치는 관계, 원가·정가·할인액·이익의 관계",
    ["백분율", "기준량과 비교하는 양", "두 조건이 겹치는 부분", "원가·정가·할인액·이익"],
    "전체 수에 백분율을 곱해 실제 수를 비교하거나 두 조건이 겹치는 비율을 구한다. 정가와 할인액, 실제 이익을 거꾸로 계산해 원가를 찾는다.",
    "반 이름, 사람 이름, 인원수 또는 금액"
  );
  const q35Fit = learnerFit(
    "초6",
    "6-2",
    "원의 지름과 반지름, 굴러간 횟수, 정사각형과 직사각형의 길이를 읽고 이동 거리나 넓이로 답하기",
    "지름선과 중심점이 표시된 두 원, 도형의 바깥 둘레에 접해 움직이는 원과 방향 화살표",
    ["원의 지름과 반지름", "원주", "원의 넓이", "정사각형과 직사각형", "넓이 더하기"],
    "굴러간 거리는 원주와 횟수를 곱해 비교한다. 원이 지나간 자리는 곧은 띠와 네 모서리의 둥근 부분으로 나누어 넓이를 더한다.",
    "길이 또는 넓이"
  );
  const q36Fit = learnerFit(
    "초6",
    "6-1",
    "수조의 길이와 물 높이, 물을 넣는 빠르기와 시간 그래프를 읽고 높이·시간·부피로 답하기",
    "칸막이나 직육면체 나무토막이 있는 수조 그림, 시간에 따른 물 높이 그래프",
    ["직육면체의 부피", "부피의 단위", "시간과 양의 관계", "소수의 나눗셈"],
    "그래프의 기울기가 달라지는 지점에서 밑면 넓이를 찾거나, 칸막이 양쪽 물의 부피를 더해 칸막이를 없앤 뒤의 높이를 구한다.",
    "한 값 또는 순서가 정해진 두 값"
  );
  const q37Fit = learnerFit(
    "초6",
    "6-1",
    "삼각기둥 옆면을 따라 감은 실이나 가장 짧은 선과 45°를 이용해 각기둥의 높이 구하기",
    "세 옆면이 이어진 삼각기둥과 밑면의 세 변 길이, 옆면을 지나는 45° 선",
    ["각기둥", "각기둥의 높이", "전개도", "삼각기둥의 옆면", "45°"],
    "삼각기둥의 세 옆면을 한 줄로 펼쳐 밑면 세 변의 길이를 더한 뒤, 펼친 띠의 대각선이 45°를 이루므로 가로와 세로 길이가 같음을 이용한다.",
    "길이"
  );
  const q38Fit = learnerFit(
    "중1",
    "6-2",
    "분수를 자연수와 여러 겹의 분수로 차례로 나타내거나 안쪽 분수부터 계산하기",
    "분수선이 여러 겹으로 이어진 식과 자연수 a, b, c, d",
    ["분수의 덧셈과 뺄셈", "분수의 곱셈과 나눗셈", "역수", "유리수의 계산"],
    "나눗셈의 몫과 나머지를 거꾸로 이어 자연수를 찾거나, 가장 안쪽 분수부터 역수와 뺄셈을 차례로 계산한다.",
    "한 자연수 또는 기약분수"
  );
  const q39Fit = learnerFit(
    "초5",
    "5-2",
    "한 자리 소수를 여러 번 곱한 수에서 곱한 횟수와 같은 소수 자리의 숫자 구하기",
    "같은 소수를 거듭 곱한 식과 소수점 아래 끝자리 숫자의 반복",
    ["소수의 곱셈", "소수점 아래 자리", "곱의 일의 자리", "반복되는 규칙"],
    "0.d를 n번 곱한 수의 소수 n번째 자리 숫자가 d를 n번 곱한 자연수의 일의 자리와 같음을 이용하고, 일의 자리의 반복을 찾는다.",
    "0부터 9까지의 숫자 하나"
  );
  const q40Fit = learnerFit(
    "초5",
    "5-2",
    "전자 숫자를 180° 돌렸을 때 같은 모양이 되는 수를 만들고 그 개수 구하기",
    "전자 숫자 카드, 세 자리·네 자리 수, 수의 범위와 점대칭 조건",
    ["합동과 대칭", "180° 돌리기", "자리값", "수의 범위", "빠짐없이 세기"],
    "돌렸을 때 그대로인 숫자와 서로 바뀌는 6·9를 구분하고, 쓸 수 없는 숫자를 뺀 뒤 앞자리와 가운데 자리를 차례로 정해 센다.",
    "한 선택지 또는 수의 개수"
  );

  const items = [
    item({ diagnosticNumber: 1, itemNumber: 1, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar("팔천사백오십육만 구천구백칠십칠"), structureSummary: "자리값과 범위를 함께 보고 가장 작은 수를 찾아 한글로 읽는다.", detailTypeName: "자리값과 범위를 함께 보고 가장 작은 수 읽기", conceptFamilyId: "large-number-condition-search", learnerFit: q01Fit }),
    item({ diagnosticNumber: 1, itemNumber: 2, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(6871203), structureSummary: "주어진 숫자를 한 번씩 써서 범위와 자리 조건에 맞는 수를 만든다.", detailTypeName: "주어진 숫자를 한 번씩 써서 조건에 맞는 수 만들기", conceptFamilyId: "large-number-condition-search", learnerFit: q01Fit }),
    item({ diagnosticNumber: 1, itemNumber: 3, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(56041237), structureSummary: "서로 다른 숫자의 자리 조건을 모두 적용해 가장 작은 수를 만든다.", detailTypeName: "서로 다른 숫자의 자리 조건으로 가장 작은 수 만들기", conceptFamilyId: "large-number-condition-search", learnerFit: q01Fit }),
    item({ diagnosticNumber: 1, itemNumber: 4, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(10431008), structureSummary: "보기의 수를 자리값과 짝수 조건으로 하나씩 확인한다.", detailTypeName: "보기에서 자리값과 짝수 조건을 모두 만족하는 수 찾기", conceptFamilyId: "large-number-condition-search", learnerFit: q01Fit }),
    item({ diagnosticNumber: 1, itemNumber: 5, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(394762581), structureSummary: "서로 다른 숫자의 자리 조건을 모두 적용해 가장 큰 수를 만든다.", detailTypeName: "서로 다른 숫자의 자리 조건으로 가장 큰 수 만들기", conceptFamilyId: "large-number-condition-search", learnerFit: q01Fit }),
    item({ diagnosticNumber: 1, itemNumber: 6, problemPage: 2, answerPage: 4, solutionPage: 5, responseContract: "set", canonicalAnswer: set([3439998, 3439999, 3440000]), structureSummary: "두 수 사이에 있는 모든 자연수를 빠짐없이 찾는다.", detailTypeName: "두 수 사이에 있는 모든 자연수 찾기", conceptFamilyId: "large-number-condition-search", learnerFit: q01Fit }),
    item({ diagnosticNumber: 1, itemNumber: 7, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar("오백칠십사만 구천구백육십육"), structureSummary: "자리 숫자와 범위 조건으로 수를 찾고 한글로 읽는다.", detailTypeName: "자리 숫자와 범위 조건으로 수 읽기", conceptFamilyId: "large-number-condition-search", learnerFit: q01Fit }),
    item({ diagnosticNumber: 1, itemNumber: 8, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(5, "개"), structureSummary: "조건을 만족하는 가장 작은 수를 만든 뒤 0의 개수를 센다.", detailTypeName: "가장 작은 수를 만들고 0의 개수 세기", conceptFamilyId: "large-number-condition-search", learnerFit: q01Fit }),
    item({ diagnosticNumber: 1, itemNumber: 9, problemPage: 3, answerPage: 4, solutionPage: 6, canonicalAnswer: scalar(9846123), structureSummary: "주어진 숫자를 한 번씩 써서 범위와 여러 자리 조건을 모두 맞춘다.", detailTypeName: "주어진 숫자로 범위와 여러 자리 조건 맞추기", conceptFamilyId: "large-number-condition-search", learnerFit: q01Fit }),
    item({ diagnosticNumber: 1, itemNumber: 10, problemPage: 3, answerPage: 4, solutionPage: 6, responseContract: "rubric", canonicalAnswer: freeze({ result: scalar(9, "개"), rubric: freeze({ required: freeze(["자리 조건 정리", "가능한 경우 확인", "결과 제시"]), scoring: "가능한 자리 숫자 쌍을 빠짐없이 확인하고 결과를 제시" }) }), structureSummary: "자리 숫자의 관계와 합으로 가능한 수의 개수를 구하고 풀이를 쓴다.", detailTypeName: "자리 숫자 관계와 합으로 가능한 수의 개수 구하기", conceptFamilyId: "large-number-condition-search", learnerFit: q01Fit }),

    item({ diagnosticNumber: 2, itemNumber: 1, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(9), structureSummary: "자릿수가 늘어나는 곱셈식 배열의 규칙을 찾아 다음 값을 구한다.", learnerFit: q02Fit }),
    item({ diagnosticNumber: 2, itemNumber: 2, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(1777776888889), structureSummary: "곱셈식 배열에서 자릿수의 규칙을 찾아 큰 수를 만든다.", learnerFit: q02Fit }),
    item({ diagnosticNumber: 2, itemNumber: 3, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar("㉡"), structureSummary: "배열의 규칙에 맞는 선택지를 고른다.", learnerFit: q02Fit }),
    item({ diagnosticNumber: 2, itemNumber: 4, problemPage: 1, answerPage: 3, solutionPage: 4, responseContract: "rubric", canonicalAnswer: freeze({ result: scalar(17777688889), rubric: freeze({ required: freeze(["규칙 설명", "결과 제시"]), scoring: "설명과 결과를 함께 확인" }) }), structureSummary: "배열의 규칙을 설명하고 그 규칙으로 만든 수를 구한다.", learnerFit: q02Fit }),
    item({ diagnosticNumber: 2, itemNumber: 5, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(11111), structureSummary: "곱셈식 배열의 규칙으로 알맞은 수를 구한다.", learnerFit: q02Fit }),
    item({ diagnosticNumber: 2, itemNumber: 6, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(777776222223), structureSummary: "자릿수가 변하는 곱셈식 배열의 규칙을 적용한다.", learnerFit: q02Fit }),
    item({ diagnosticNumber: 2, itemNumber: 7, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(999999), structureSummary: "곱셈식 배열의 규칙에서 필요한 수를 찾는다.", learnerFit: q02Fit }),
    item({ diagnosticNumber: 2, itemNumber: 8, problemPage: 2, answerPage: 3, solutionPage: 4, responseContract: "rubric", canonicalAnswer: freeze({ result: scalar(9), rubric: freeze({ required: freeze(["규칙 설명", "결과 제시"]), scoring: "설명과 결과를 함께 확인" }) }), structureSummary: "배열의 규칙을 설명하고 결과를 구한다.", learnerFit: q02Fit }),

    item({ diagnosticNumber: 3, itemNumber: 1, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(83, "타"), structureSummary: "두 반에 나누어 준 연필 수를 합해 처음 연필 수를 구한다.", detailTypeName: "두 번 나누어 준 물건의 처음 수 구하기", conceptFamilyId: "reverse-division-word-problems", learnerFit: q03Fit }),
    item({ diagnosticNumber: 3, itemNumber: 2, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(21, "개"), structureSummary: "전체 수에서 남은 수를 빼고 똑같이 나누어 한 묶음의 수를 구한다.", detailTypeName: "똑같이 나누고 남은 수로 한 묶음의 수 구하기", conceptFamilyId: "reverse-division-word-problems", learnerFit: q03Fit }),
    item({ diagnosticNumber: 3, itemNumber: 3, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(24, "개"), structureSummary: "만든 묶음과 남은 구슬로 전체 구슬 수를 구해 처음 묶음 수를 찾는다.", detailTypeName: "나누어 만들고 남은 수로 처음 묶음 수 구하기", conceptFamilyId: "reverse-division-word-problems", learnerFit: q03Fit }),
    item({ diagnosticNumber: 3, itemNumber: 4, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar("5시 58분"), structureSummary: "분을 시간과 분으로 바꾸어 시작 시각에 더한다.", detailTypeName: "몇 분 뒤의 시각 구하기", conceptFamilyId: "time-calculation", learnerFit: q03Fit }),
    item({ diagnosticNumber: 3, itemNumber: 5, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar("오후 6시 23분"), structureSummary: "걸린 분을 시간과 분으로 바꾸어 시작 시각에 더한다.", detailTypeName: "걸린 시간을 더해 끝난 시각 구하기", conceptFamilyId: "time-calculation", learnerFit: q03Fit }),
    item({ diagnosticNumber: 3, itemNumber: 6, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(45, "개"), structureSummary: "일한 전체 시간을 분으로 바꾸어 한 개 만드는 시간으로 나눈다.", detailTypeName: "쉬지 않고 만드는 물건 수 구하기", conceptFamilyId: "work-time-rate", learnerFit: q03Fit }),
    item({ diagnosticNumber: 3, itemNumber: 7, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(20, "개"), structureSummary: "전체 시간에서 쉬는 시간을 빼고 한 개 만드는 시간으로 나눈다.", detailTypeName: "쉬는 시간을 빼고 만드는 물건 수 구하기", conceptFamilyId: "work-time-rate", learnerFit: q03Fit }),
    item({ diagnosticNumber: 3, itemNumber: 8, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(10, "개"), structureSummary: "일한 시간을 분으로 바꾸어 한 개 만드는 시간으로 나눈다.", detailTypeName: "일정한 시간 동안 만드는 물건 수 구하기", conceptFamilyId: "work-time-rate", learnerFit: q03Fit }),
    item({ diagnosticNumber: 3, itemNumber: 9, problemPage: 3, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(81, "분"), structureSummary: "기차가 간 거리를 구한 뒤 같은 거리를 자동차로 가는 시간을 구한다.", detailTypeName: "같은 거리를 갈 때 느린 탈것의 시간 구하기", conceptFamilyId: "distance-speed-time", learnerFit: q03Fit }),
    item({ diagnosticNumber: 3, itemNumber: 10, problemPage: 3, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(38, "분"), structureSummary: "기차가 간 거리를 구한 뒤 자동차의 빠르기로 나누어 시간을 구한다.", detailTypeName: "같은 거리를 갈 때 빠르기가 다른 탈것의 시간 구하기", conceptFamilyId: "distance-speed-time", learnerFit: q03Fit }),

    item({ diagnosticNumber: 4, itemNumber: 1, problemPage: 1, answerPage: 5, solutionPage: 6, responseContract: "ordered", canonicalAnswer: ordered([699, 23, 30, 9]), structureSummary: "자리 조건으로 만든 두 수를 나누어 몫과 나머지까지 쓴다.", detailTypeName: "조건에 맞는 나눗셈식의 수 모두 쓰기", conceptFamilyId: "division-equation-building", learnerFit: q04Fit }),
    item({ diagnosticNumber: 4, itemNumber: 2, problemPage: 1, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(2, "개"), structureSummary: "수 카드로 만든 세 자리 수 중 몫과 나머지 조건에 맞는 수를 센다.", detailTypeName: "수 카드로 몫과 나머지 조건에 맞는 수의 개수 구하기", conceptFamilyId: "card-division-conditions", learnerFit: q04Fit }),
    item({ diagnosticNumber: 4, itemNumber: 3, problemPage: 1, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(23), structureSummary: "카드로 만든 가장 큰 수와 작은 수를 나누어 나머지를 구한다.", detailTypeName: "수 카드로 만든 가장 큰 수와 가장 작은 수를 나누어 나머지 구하기", conceptFamilyId: "card-division-conditions", learnerFit: q04Fit }),
    item({ diagnosticNumber: 4, itemNumber: 4, problemPage: 1, answerPage: 5, solutionPage: 6, responseContract: "set", canonicalAnswer: set([724, 725, 729, 742, 745]), structureSummary: "카드로 만든 수 중 몫 조건에 맞고 나머지가 있는 수를 모두 찾는다.", detailTypeName: "수 카드로 몫 조건에 맞고 나누어떨어지지 않는 수 모두 찾기", conceptFamilyId: "card-division-conditions", learnerFit: q04Fit }),
    item({ diagnosticNumber: 4, itemNumber: 5, problemPage: 2, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(28), structureSummary: "자리 조건으로 만든 가장 큰 수와 작은 수의 몫을 구한다.", detailTypeName: "수 카드로 만든 두 수의 나눗셈 몫 구하기", conceptFamilyId: "card-division-conditions", learnerFit: q04Fit }),
    item({ diagnosticNumber: 4, itemNumber: 6, problemPage: 2, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(16), structureSummary: "서로 다른 자리 조건으로 만든 두 수의 몫을 구한다.", detailTypeName: "자리 조건으로 만든 두 수의 나눗셈 몫 구하기", conceptFamilyId: "card-division-conditions", learnerFit: q04Fit }),
    item({ diagnosticNumber: 4, itemNumber: 7, problemPage: 2, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(18, "개"), structureSummary: "23으로 나눌 때 몫과 나머지가 같은 세 자리 수를 센다.", detailTypeName: "몫과 나머지가 같은 세 자리 수의 개수 구하기", conceptFamilyId: "equal-quotient-remainder", learnerFit: q04Fit }),
    item({ diagnosticNumber: 4, itemNumber: 8, problemPage: 2, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(16, "개"), structureSummary: "21로 나눌 때 몫과 나머지가 같은 세 자리 수를 센다.", detailTypeName: "몫과 나머지가 같은 수의 개수 구하기", conceptFamilyId: "equal-quotient-remainder", learnerFit: q04Fit }),
    item({ diagnosticNumber: 4, itemNumber: 9, problemPage: 3, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(3, "개"), structureSummary: "수 카드로 만든 세 자리 수 중 몫 조건에 맞는 수를 센다.", detailTypeName: "수 카드로 몫 조건에 맞는 수의 개수 구하기", conceptFamilyId: "card-division-conditions", learnerFit: q04Fit }),
    item({ diagnosticNumber: 4, itemNumber: 10, problemPage: 3, answerPage: 5, solutionPage: 7, responseContract: "set", canonicalAnswer: set([742, 812, 882, 952]), structureSummary: "70으로 나눈 몫이 두 자리이고 나머지가 42인 세 자리 수를 모두 찾는다.", detailTypeName: "몫과 나머지 조건에 맞는 세 자리 수 모두 찾기", conceptFamilyId: "quotient-remainder-range", learnerFit: q04Fit }),
    item({ diagnosticNumber: 4, itemNumber: 11, problemPage: 3, answerPage: 5, solutionPage: 7, responseContract: "ordered", canonicalAnswer: ordered([966, 102]), structureSummary: "몫과 나머지 조건에 맞는 세 자리 수 중 가장 큰 수와 작은 수를 찾는다.", detailTypeName: "몫과 나머지 조건에 맞는 가장 큰 수와 작은 수 찾기", conceptFamilyId: "quotient-remainder-range", learnerFit: q04Fit }),
    item({ diagnosticNumber: 4, itemNumber: 12, problemPage: 3, answerPage: 5, solutionPage: 7, canonicalAnswer: scalar(519), structureSummary: "두 나눗셈 조건과 각 자리 숫자의 합을 모두 만족하는 수를 찾는다.", detailTypeName: "두 나눗셈 조건과 자리 숫자의 합에 맞는 수 찾기", conceptFamilyId: "multiple-division-conditions", learnerFit: q04Fit }),
    item({ diagnosticNumber: 4, itemNumber: 13, problemPage: 4, answerPage: 5, solutionPage: 7, responseContract: "set", canonicalAnswer: set([309, 318]), structureSummary: "두 나눗셈 조건과 각 자리 숫자의 합을 모두 만족하는 수를 찾는다.", detailTypeName: "두 나눗셈 조건과 자리 숫자의 합에 맞는 수 모두 찾기", conceptFamilyId: "multiple-division-conditions", learnerFit: q04Fit }),
    item({ diagnosticNumber: 4, itemNumber: 14, problemPage: 4, answerPage: 5, solutionPage: 7, canonicalAnswer: scalar(3, "개"), structureSummary: "정해진 숫자로 만든 세 자리 수 중 몫 조건에 맞는 수를 센다.", detailTypeName: "수 카드로 몫이 정해진 수의 개수 구하기", conceptFamilyId: "card-division-conditions", learnerFit: q04Fit }),
    item({ diagnosticNumber: 4, itemNumber: 15, problemPage: 4, answerPage: 5, solutionPage: 7, canonicalAnswer: scalar(6, "개"), structureSummary: "정해진 숫자로 만든 세 자리 수 중 몫과 나머지 조건에 맞는 수를 센다.", detailTypeName: "수 카드로 몫과 나머지가 생기는 수의 개수 구하기", conceptFamilyId: "card-division-conditions", learnerFit: q04Fit }),

    item({ diagnosticNumber: 5, itemNumber: 1, problemPage: 1, answerPage: 4, solutionPage: 5, responseContract: "ordered", canonicalAnswer: ordered([25, 20], "도"), structureSummary: "삼각형과 사각형의 각의 합을 차례로 이용해 두 각을 구한다.", detailTypeName: "여러 삼각형과 사각형을 이용해 두 각 구하기", conceptFamilyId: "composite-angle-sum", learnerFit: q05Fit }),
    item({ diagnosticNumber: 5, itemNumber: 2, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(20, "도"), structureSummary: "교차한 두 삼각형의 맞꼭지각과 각의 합으로 돌린 각을 구한다.", detailTypeName: "겹친 두 삼각형의 맞꼭지각으로 돌린 각 구하기", conceptFamilyId: "rotated-overlapping-triangles", learnerFit: q05Fit }),
    item({ diagnosticNumber: 5, itemNumber: 3, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(22, "도"), structureSummary: "맞꼭지각과 바깥쪽 각을 이용해 두 삼각형 사이의 돌린 각을 구한다.", detailTypeName: "맞꼭지각과 바깥쪽 각으로 돌린 각 구하기", conceptFamilyId: "rotated-overlapping-triangles", learnerFit: q05Fit }),
    item({ diagnosticNumber: 5, itemNumber: 4, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(30, "도"), structureSummary: "교차한 두 삼각형에서 맞꼭지각과 나뉜 각을 이용해 돌린 각을 구한다.", detailTypeName: "맞꼭지각과 나뉜 각으로 돌린 각 구하기", conceptFamilyId: "rotated-overlapping-triangles", learnerFit: q05Fit }),
    item({ diagnosticNumber: 5, itemNumber: 5, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(50, "도"), structureSummary: "세로선 양쪽 삼각형의 같은 각을 이용해 가운데 각을 구한다.", detailTypeName: "세로선 양쪽 삼각형의 같은 각으로 가운데 각 구하기", conceptFamilyId: "equal-angle-linked-triangles", learnerFit: q05Fit }),
    item({ diagnosticNumber: 5, itemNumber: 6, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(50, "도"), structureSummary: "이어 붙인 두 이등변삼각형의 밑각을 구해 가운데 각을 구한다.", detailTypeName: "이어 붙인 두 삼각형의 같은 각으로 가운데 각 구하기", conceptFamilyId: "equal-angle-linked-triangles", learnerFit: q05Fit }),
    item({ diagnosticNumber: 5, itemNumber: 7, problemPage: 2, answerPage: 4, solutionPage: 6, canonicalAnswer: scalar(55, "도"), structureSummary: "직각삼각형에서 나뉜 꼭짓각과 밑각의 합을 구한다.", detailTypeName: "직각삼각형에서 나뉜 꼭짓각과 밑각의 합 구하기", conceptFamilyId: "split-right-triangle-angle-sum", learnerFit: q05Fit }),
    item({ diagnosticNumber: 5, itemNumber: 8, problemPage: 2, answerPage: 4, solutionPage: 6, canonicalAnswer: scalar(60, "도"), structureSummary: "직각삼각형의 한 꼭짓각 일부를 알고 나머지 두 표시 각의 합을 구한다.", detailTypeName: "직각삼각형의 꼭짓각 일부로 두 표시 각의 합 구하기", conceptFamilyId: "split-right-triangle-angle-sum", learnerFit: q05Fit }),
    item({ diagnosticNumber: 5, itemNumber: 9, problemPage: 3, answerPage: 4, solutionPage: 6, canonicalAnswer: scalar(70, "도"), structureSummary: "직각삼각형의 나뉜 꼭짓각 한 부분을 빼 두 표시 각의 합을 구한다.", detailTypeName: "직각삼각형의 나뉜 각을 빼 두 표시 각의 합 구하기", conceptFamilyId: "split-right-triangle-angle-sum", learnerFit: q05Fit }),
    item({ diagnosticNumber: 5, itemNumber: 10, problemPage: 3, answerPage: 4, solutionPage: 6, canonicalAnswer: scalar(30, "도"), structureSummary: "큰 직각삼각형과 안쪽 삼각형의 각을 차례로 구해 남은 각을 찾는다.", detailTypeName: "큰 직각삼각형과 안쪽 삼각형으로 남은 각 구하기", conceptFamilyId: "nested-right-triangle", learnerFit: q05Fit }),

    item({ diagnosticNumber: 6, itemNumber: 1, problemPage: 1, answerPage: 2, solutionPage: 3, canonicalAnswer: scalar(90, "쌍"), structureSummary: "한 점에서 만나는 맞꼭지각의 쌍을 센다.", learnerFit: q06Fit }),
    item({ diagnosticNumber: 6, itemNumber: 2, problemPage: 1, answerPage: 2, solutionPage: 3, canonicalAnswer: scalar(2, "쌍"), structureSummary: "그림 속 맞꼭지각의 쌍을 센다.", learnerFit: q06Fit }),
    item({ diagnosticNumber: 6, itemNumber: 3, problemPage: 1, answerPage: 2, solutionPage: 3, canonicalAnswer: scalar(12, "쌍"), structureSummary: "여러 직선이 만날 때 생기는 맞꼭지각의 쌍을 센다.", learnerFit: q06Fit }),
    item({ diagnosticNumber: 6, itemNumber: 4, problemPage: 1, answerPage: 2, solutionPage: 3, canonicalAnswer: scalar(2, "쌍"), structureSummary: "도형에서 맞꼭지각의 쌍을 찾는다.", learnerFit: q06Fit }),

    item({ diagnosticNumber: 7, itemNumber: 1, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar("오후 1시 8분"), structureSummary: "한 시간에 빨라지는 분을 하루 동안 누적해 다음 날 시각을 구한다.", detailTypeName: "한 시간에 빨라지는 시계의 다음 날 시각 구하기", conceptFamilyId: "fractional-clock-drift", learnerFit: q07Fit }),
    item({ diagnosticNumber: 7, itemNumber: 2, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar("11시 42분 30초"), structureSummary: "하루에 느려지는 분을 일주일 동안 누적해 시각과 초를 구한다.", detailTypeName: "하루에 느려지는 시계의 일주일 뒤 시각 구하기", conceptFamilyId: "fractional-clock-drift", learnerFit: q07Fit }),
    item({ diagnosticNumber: 7, itemNumber: 3, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar("1시간 26분"), structureSummary: "두 시계가 한 시간에 벌어지는 차이를 구해 지난 시간만큼 누적한다.", detailTypeName: "느린 시계와 빠른 시계가 가리키는 시각의 차 구하기", conceptFamilyId: "two-clock-difference", learnerFit: q07Fit }),
    item({ diagnosticNumber: 7, itemNumber: 4, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(6, "일"), structureSummary: "두 사람이 하루에 하는 일의 양을 더해 전체 일을 마치는 날짜를 구한다.", detailTypeName: "두 사람이 함께 일할 때 걸리는 날짜 구하기", conceptFamilyId: "fractional-work-rate", learnerFit: q07Fit }),
    item({ diagnosticNumber: 7, itemNumber: 5, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar("6시 38분"), structureSummary: "한 시간에 느려지는 분을 지난 시간만큼 누적해 표시 시각을 구한다.", detailTypeName: "한 시간에 느려지는 시계의 몇 시간 뒤 시각 구하기", conceptFamilyId: "fractional-clock-drift", learnerFit: q07Fit }),
    item({ diagnosticNumber: 7, itemNumber: 6, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar("오전 11시 30분"), structureSummary: "하루에 느려지는 분을 두 주 동안 누적해 표시 시각을 구한다.", detailTypeName: "하루에 느려지는 시계의 여러 주 뒤 시각 구하기", conceptFamilyId: "fractional-clock-drift", learnerFit: q07Fit }),
    item({ diagnosticNumber: 7, itemNumber: 7, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar("1시 15분"), structureSummary: "하루에 빨라지는 분을 여러 날 동안 누적해 표시 시각을 구한다.", detailTypeName: "하루에 빨라지는 시계의 여러 날 뒤 시각 구하기", conceptFamilyId: "fractional-clock-drift", learnerFit: q07Fit }),
    item({ diagnosticNumber: 7, itemNumber: 8, problemPage: 2, answerPage: 4, solutionPage: 6, canonicalAnswer: scalar("오전 10시 42분 30초"), structureSummary: "하루에 느려지는 대분수를 일주일 동안 누적해 시각·분·초를 구한다.", detailTypeName: "하루에 느려지는 시계의 일주일 뒤 시각과 초 구하기", conceptFamilyId: "fractional-clock-drift", learnerFit: q07Fit }),
    item({ diagnosticNumber: 7, itemNumber: 9, problemPage: 3, answerPage: 4, solutionPage: 6, canonicalAnswer: scalar("8시 24분"), structureSummary: "하루에 느려지는 분을 한 달 동안 누적해 표시 시각을 구한다.", detailTypeName: "하루에 느려지는 시계의 한 달 뒤 시각 구하기", conceptFamilyId: "fractional-clock-drift", learnerFit: q07Fit }),
    item({ diagnosticNumber: 7, itemNumber: 10, problemPage: 3, answerPage: 4, solutionPage: 6, canonicalAnswer: mixed(9, 16, 21, "분"), structureSummary: "두 시계가 한 시간에 빨라지는 분의 차를 구해 지난 시간만큼 누적한다.", detailTypeName: "빠른 두 시계가 가리키는 시각의 차를 대분수로 구하기", conceptFamilyId: "two-clock-difference", learnerFit: q07Fit }),

    item({ diagnosticNumber: 8, itemNumber: 1, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar("1.16", "m"), structureSummary: "세 사람의 앞뒤 거리를 같은 단위로 바꾸어 두 거리를 차례로 비교한다.", detailTypeName: "세 사람의 앞뒤 위치로 두 거리의 차 구하기", conceptFamilyId: "decimal-relative-distance", learnerFit: q08Fit }),
    item({ diagnosticNumber: 8, itemNumber: 2, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar("1.61", "m"), structureSummary: "네 사람의 앞뒤 위치를 수직선처럼 놓고 한 사람에서 양쪽 거리의 차를 구한다.", detailTypeName: "네 사람의 앞뒤 위치와 단위 바꾸기로 두 거리의 차 구하기", conceptFamilyId: "decimal-relative-distance", learnerFit: q08Fit }),
    item({ diagnosticNumber: 8, itemNumber: 3, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar("70.03", "km"), structureSummary: "여러 지점 사이의 겹친 전체 거리로 안쪽 구간을 구해 두 구간의 차를 계산한다.", detailTypeName: "겹쳐 나타낸 세 전체 거리로 연이은 두 구간의 차 구하기", conceptFamilyId: "decimal-route-segments", learnerFit: q08Fit }),
    item({ diagnosticNumber: 8, itemNumber: 4, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar("98.35", "km"), structureSummary: "두 끝점 거리와 부분 거리를 이용해 가운데 구간 둘을 구하고 그 차를 계산한다.", detailTypeName: "두 끝점 거리와 두 부분 거리로 가운데 구간의 차 구하기", conceptFamilyId: "decimal-route-segments", learnerFit: q08Fit }),
    item({ diagnosticNumber: 8, itemNumber: 5, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar("0.12", "m"), structureSummary: "네 사람의 앞뒤 거리를 같은 단위로 바꾸어 한 사람에서 양쪽 거리의 차를 구한다.", detailTypeName: "네 사람의 앞뒤 위치로 한 사람에서 두 사람까지 거리 차 구하기", conceptFamilyId: "decimal-relative-distance", learnerFit: q08Fit }),
    item({ diagnosticNumber: 8, itemNumber: 6, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar("104.63", "km"), structureSummary: "다섯 지점의 겹친 거리에서 두 안쪽 구간을 구해 얼마나 더 먼지 계산한다.", detailTypeName: "다섯 지점의 겹친 거리에서 안쪽 두 구간의 차 구하기", conceptFamilyId: "decimal-route-segments", learnerFit: q08Fit }),

    item({ diagnosticNumber: 9, itemNumber: 1, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar("0.435", "km"), structureSummary: "분과 초를 소수인 분으로 바꾸고 같은 방향으로 달린 두 사람의 거리 차를 구한다.", detailTypeName: "같은 방향으로 달리는 두 사람 사이의 거리 구하기", conceptFamilyId: "same-direction-distance-difference", learnerFit: q09Fit }),
    item({ diagnosticNumber: 9, itemNumber: 2, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar("1.685", "km"), structureSummary: "기차가 터널을 완전히 통과한 거리에서 기차 길이를 빼 터널 길이를 구한다.", detailTypeName: "기차가 터널을 완전히 통과할 때 터널 길이 구하기", conceptFamilyId: "train-tunnel-length", learnerFit: q09Fit }),
    item({ diagnosticNumber: 9, itemNumber: 3, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar("412.5", "km"), structureSummary: "출발 시각과 도착 시각의 차를 소수인 시간으로 바꾸어 기차가 간 거리를 구한다.", detailTypeName: "출발·도착 시각과 빠르기로 기차 이동 거리 구하기", conceptFamilyId: "speed-time-distance", learnerFit: q09Fit }),
    item({ diagnosticNumber: 9, itemNumber: 4, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(13, "L"), structureSummary: "달린 시간으로 전체 거리를 구한 뒤 1 km에 필요한 휘발유의 양을 곱한다.", detailTypeName: "빠르기와 시간으로 필요한 휘발유의 양 구하기", conceptFamilyId: "fuel-distance-rate", learnerFit: q09Fit }),
    item({ diagnosticNumber: 9, itemNumber: 5, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(18, "km"), structureSummary: "시간을 소수로 바꾸고 같은 시간 달린 기차와 버스의 거리 차를 구한다.", detailTypeName: "같은 시간 달린 기차와 버스의 거리 차 구하기", conceptFamilyId: "same-direction-distance-difference", learnerFit: q09Fit }),
    item({ diagnosticNumber: 9, itemNumber: 6, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(159, "m"), structureSummary: "시속을 초속으로 바꾸어 트럭이 몇 초 동안 간 거리를 구한다.", detailTypeName: "시속을 초속으로 바꾸어 몇 초 동안 간 거리 구하기", conceptFamilyId: "speed-unit-conversion", learnerFit: q09Fit }),
    item({ diagnosticNumber: 9, itemNumber: 7, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(9, "시간"), structureSummary: "여러 주의 주말 날짜 수를 세고 하루 공부 시간을 곱해 전체 시간을 구한다.", detailTypeName: "주말 수와 하루 공부 시간으로 전체 공부 시간 구하기", conceptFamilyId: "repeated-schedule-time", learnerFit: q09Fit }),
    item({ diagnosticNumber: 9, itemNumber: 8, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar("0.825", "km"), structureSummary: "시간을 소수로 바꾸고 같은 시간 걸은 두 사람의 거리 차를 구한다.", detailTypeName: "같은 시간 걸은 두 사람의 거리 차 구하기", conceptFamilyId: "same-direction-distance-difference", learnerFit: q09Fit }),
    item({ diagnosticNumber: 9, itemNumber: 9, problemPage: 3, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar("9.792", "km"), structureSummary: "분과 초를 소수인 분으로 바꾸고 반대 방향 두 자동차의 거리를 더한다.", detailTypeName: "반대 방향으로 달린 두 자동차 사이의 거리 구하기", conceptFamilyId: "opposite-direction-distance-sum", learnerFit: q09Fit }),
    item({ diagnosticNumber: 9, itemNumber: 10, problemPage: 3, answerPage: 4, solutionPage: 6, canonicalAnswer: scalar("0.84", "km"), structureSummary: "분과 초를 소수인 분으로 바꾸고 같은 방향 두 자동차의 거리 차를 구한다.", detailTypeName: "같은 방향으로 달린 두 자동차 사이의 거리 구하기", conceptFamilyId: "same-direction-distance-difference", learnerFit: q09Fit }),

    item({ diagnosticNumber: 10, itemNumber: 1, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(30, "도"), structureSummary: "직각과 일직선의 각을 먼저 구한 뒤 사각형의 네 각의 합으로 표시한 각을 구한다.", detailTypeName: "직각과 사각형의 네 각을 이용해 표시한 각 구하기", conceptFamilyId: "parallel-right-angle-quadrilateral", learnerFit: q10Fit }),
    item({ diagnosticNumber: 10, itemNumber: 2, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(55, "도"), structureSummary: "윗선의 주어진 각을 안쪽 각으로 바꾸고 사각형의 네 각의 합에서 모르는 각을 구한다.", detailTypeName: "윗선의 각과 사각형의 네 각으로 꺾인 각 구하기", conceptFamilyId: "parallel-right-angle-quadrilateral", learnerFit: q10Fit }),
    item({ diagnosticNumber: 10, itemNumber: 3, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(80, "도"), structureSummary: "꺾인 점을 지나는 평행선을 그어 위아래의 주어진 각을 한곳에 모아 더한다.", detailTypeName: "꺾인 점을 지나는 평행선을 그어 두 각 더하기", conceptFamilyId: "parallel-through-vertex-angle-sum", learnerFit: q10Fit }),
    item({ diagnosticNumber: 10, itemNumber: 4, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(35, "도"), structureSummary: "직각과 일직선의 각을 이용해 사각형의 남은 각을 구한 뒤 직각에서 뺀다.", detailTypeName: "직각과 사각형의 네 각으로 아래쪽 각 구하기", conceptFamilyId: "parallel-right-angle-quadrilateral", learnerFit: q10Fit }),
    item({ diagnosticNumber: 10, itemNumber: 5, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(120, "도"), structureSummary: "꺾인 점을 지나는 평행선을 그어 서로 반대쪽에 있는 두 각을 옮겨 더한다.", detailTypeName: "한 점을 지나는 평행선을 그어 맞은편 두 각 더하기", conceptFamilyId: "parallel-through-vertex-angle-sum", learnerFit: q10Fit }),
    item({ diagnosticNumber: 10, itemNumber: 6, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(35, "도"), structureSummary: "직각을 포함한 사각형의 네 각의 합으로 안쪽 각을 구한 뒤 직각에서 뺀다.", detailTypeName: "직각과 사각형의 네 각으로 남은 작은 각 구하기", conceptFamilyId: "parallel-right-angle-quadrilateral", learnerFit: q10Fit }),
    item({ diagnosticNumber: 10, itemNumber: 7, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(85, "도"), structureSummary: "꺾이는 두 점에 평행선을 그어 위아래 각을 옮기고 가운데 100도에서 필요한 각을 뺀다.", detailTypeName: "두 점에 평행선을 그어 세 번 꺾인 선의 각 구하기", conceptFamilyId: "parallel-zigzag-angle-transfer", learnerFit: q10Fit }),
    item({ diagnosticNumber: 10, itemNumber: 8, problemPage: 2, answerPage: 4, solutionPage: 6, canonicalAnswer: scalar(20, "도"), structureSummary: "위아래 각을 한 점으로 옮기고 한 각이 다른 각의 두 배라는 조건으로 나뉜 각을 구한다.", detailTypeName: "평행선의 두 각과 두 배 조건으로 나뉜 각 구하기", conceptFamilyId: "parallel-angle-multiple-relation", learnerFit: q10Fit }),
    item({ diagnosticNumber: 10, itemNumber: 9, problemPage: 3, answerPage: 4, solutionPage: 6, canonicalAnswer: scalar(30, "도"), structureSummary: "30도와 60도를 한 점으로 옮기고 한 각이 다른 각의 두 배라는 조건을 함께 쓴다.", detailTypeName: "두 주어진 각과 두 배 조건으로 남은 각 구하기", conceptFamilyId: "parallel-angle-multiple-relation", learnerFit: q10Fit }),
    item({ diagnosticNumber: 10, itemNumber: 10, problemPage: 3, answerPage: 4, solutionPage: 6, canonicalAnswer: scalar(30, "도"), structureSummary: "아랫점에서 윗선에 수선을 그어 사각형의 각을 구하고 20도 차 조건을 적용한다.", detailTypeName: "수선을 긋고 20도 차 조건으로 꺾인 각 구하기", conceptFamilyId: "parallel-perpendicular-angle-difference", learnerFit: q10Fit }),

    item({ diagnosticNumber: 11, itemNumber: 1, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(1080, "도"), structureSummary: "꺾인 점마다 보조 평행선을 그어 일곱 각을 같은 방향으로 옮긴 뒤 모두 더한다.", detailTypeName: "평행선 사이의 여러 꺾인 각을 모두 더하기", conceptFamilyId: "parallel-zigzag-angle-sum", learnerFit: q11Fit }),
    item({ diagnosticNumber: 11, itemNumber: 2, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(20, "도"), structureSummary: "꺾인 점을 지나는 평행선을 그어 60도, 50도와 두 식으로 표시한 각의 관계를 세운다.", detailTypeName: "보조 평행선을 그어 식으로 표시한 각 구하기", conceptFamilyId: "parallel-angle-equation", learnerFit: q11Fit }),
    item({ diagnosticNumber: 11, itemNumber: 3, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(20, "도"), structureSummary: "두 꺾인 점을 지나는 평행선을 그어 30도와 70도·20도의 차로 모르는 각을 구한다.", detailTypeName: "두 보조 평행선으로 네 주어진 각 사이의 각 구하기", conceptFamilyId: "parallel-zigzag-angle-transfer", learnerFit: q11Fit }),
    item({ diagnosticNumber: 11, itemNumber: 4, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(15, "도"), structureSummary: "두 보조 평행선으로 65도와 가까이 붙은 15도를 옮겨 안쪽 각의 차를 구한다.", detailTypeName: "두 보조 평행선으로 가까이 붙은 각의 차 구하기", conceptFamilyId: "parallel-zigzag-angle-transfer", learnerFit: q11Fit }),
    item({ diagnosticNumber: 11, itemNumber: 5, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(20, "도"), structureSummary: "꺾인 점마다 보조 평행선을 그어 두 각의 합이 180도임을 찾고 5 대 4의 비로 두 각의 차를 구한다.", detailTypeName: "여러 보조 평행선과 각의 비로 두 각의 차 구하기", conceptFamilyId: "parallel-angle-ratio", learnerFit: q11Fit }),

    item({ diagnosticNumber: 12, itemNumber: 1, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(144, "명"), structureSummary: "120보다 크고 150보다 작은 수 중 5명씩과 7명씩 세울 때 모두 4명이 남는 수를 찾는다.", detailTypeName: "두 줄 세우기에서 같은 수가 남는 학생 수 찾기", conceptFamilyId: "common-multiple-remainder", learnerFit: q12Fit }),
    item({ diagnosticNumber: 12, itemNumber: 2, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(84, "개"), structureSummary: "100보다 작은 수 중 7개씩과 12개씩 모두 남김없이 담을 수 있는 가장 작은 수를 찾는다.", detailTypeName: "상자에 담는 두 방법으로 나누어떨어지는 가장 적은 수 찾기", conceptFamilyId: "least-common-multiple-context", learnerFit: q12Fit }),
    item({ diagnosticNumber: 12, itemNumber: 3, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(128, "명"), structureSummary: "100 이상 180 이하에서 10명씩 하면 8명이 남고 12명씩 하면 4명이 모자라는 수를 찾는다.", detailTypeName: "두 모둠 만들기에서 남거나 모자라는 학생 수 찾기", conceptFamilyId: "common-multiple-remainder", learnerFit: q12Fit }),
    item({ diagnosticNumber: 12, itemNumber: 4, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(42, "명"), structureSummary: "40명과 50명 사이에서 3열과 7열로 모두 남김없이 세울 수 있는 수를 찾는다.", detailTypeName: "두 줄 세우기로 나누어떨어지는 범위의 학생 수 찾기", conceptFamilyId: "common-multiple-range", learnerFit: q12Fit }),
    item({ diagnosticNumber: 12, itemNumber: 5, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(78, "개"), structureSummary: "8개씩과 10개씩 나누어 줄 때 모두 2개가 모자라는 가장 큰 두 자리 수를 찾는다.", detailTypeName: "두 가지씩 나누어 줄 때 모자라는 가장 큰 두 자리 수 찾기", conceptFamilyId: "common-multiple-shortage", learnerFit: q12Fit }),

    item({ diagnosticNumber: 13, itemNumber: 1, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(654), structureSummary: "수 카드를 배열해 배수 조건에 맞는 수를 찾는다.", learnerFit: q13Fit, detailTypeName: "수 카드로 배수를 만들고 조건에 맞는 수 찾기", conceptFamilyId: "multiples-divisibility" }),
    item({ diagnosticNumber: 13, itemNumber: 2, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(13, "개"), structureSummary: "수 카드로 만들 수 있는 배수의 개수를 센다.", learnerFit: q13Fit, detailTypeName: "수 카드로 배수를 만들고 조건에 맞는 수 찾기", conceptFamilyId: "multiples-divisibility" }),
    item({ diagnosticNumber: 13, itemNumber: 3, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(5, "개"), structureSummary: "카드를 한 번씩 써서 만든 수 중 조건에 맞는 수를 센다.", learnerFit: q13Fit, detailTypeName: "수 카드로 배수를 만들고 조건에 맞는 수 찾기", conceptFamilyId: "multiples-divisibility" }),
    item({ diagnosticNumber: 13, itemNumber: 4, problemPage: 1, answerPage: 4, solutionPage: 5, responseContract: "set", canonicalAnswer: set([516, 612]), structureSummary: "수 카드를 배열해 조건에 맞는 모든 수를 찾는다.", learnerFit: q13Fit, detailTypeName: "수 카드로 배수를 만들고 조건에 맞는 수 찾기", conceptFamilyId: "multiples-divisibility" }),
    item({ diagnosticNumber: 13, itemNumber: 5, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(873), structureSummary: "수 카드로 만든 수 중 배수 조건에 맞는 수를 찾는다.", learnerFit: q13Fit, detailTypeName: "수 카드로 배수를 만들고 조건에 맞는 수 찾기", conceptFamilyId: "multiples-divisibility" }),
    item({ diagnosticNumber: 13, itemNumber: 6, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(864), structureSummary: "카드의 자리와 배수 조건을 함께 적용한다.", learnerFit: q13Fit, detailTypeName: "수 카드로 배수를 만들고 조건에 맞는 수 찾기", conceptFamilyId: "multiples-divisibility" }),
    item({ diagnosticNumber: 13, itemNumber: 7, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(664), structureSummary: "수 카드를 이용해 조건에 맞는 세 자리 수를 만든다.", learnerFit: q13Fit, detailTypeName: "수 카드로 배수를 만들고 조건에 맞는 수 찾기", conceptFamilyId: "multiples-divisibility" }),
    item({ diagnosticNumber: 13, itemNumber: 8, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(9516), structureSummary: "수 카드를 배열해 조건에 맞는 네 자리 수를 만든다.", learnerFit: q13Fit, detailTypeName: "수 카드로 배수를 만들고 조건에 맞는 수 찾기", conceptFamilyId: "multiples-divisibility" }),
    item({ diagnosticNumber: 13, itemNumber: 9, problemPage: 3, answerPage: 4, solutionPage: 6, canonicalAnswer: scalar(1824), structureSummary: "여러 수 카드와 배수 조건을 적용해 알맞은 수를 찾는다.", learnerFit: q13Fit, detailTypeName: "수 카드로 배수를 만들고 조건에 맞는 수 찾기", conceptFamilyId: "multiples-divisibility" }),
    item({ diagnosticNumber: 13, itemNumber: 10, problemPage: 3, answerPage: 4, solutionPage: 6, canonicalAnswer: scalar(16, "개"), structureSummary: "수 카드로 만든 수 중 조건에 맞는 수의 개수를 센다.", learnerFit: q13Fit, detailTypeName: "수 카드로 배수를 만들고 조건에 맞는 수 찾기", conceptFamilyId: "multiples-divisibility" }),

    item({ diagnosticNumber: 14, itemNumber: 1, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(146, "개"), structureSummary: "정팔각형을 한 변씩 겹쳐 24개 이어 붙일 때 바깥 둘레에 남는 변의 수를 구한다.", detailTypeName: "이어 붙인 정팔각형의 수로 둘레의 변 수 구하기", conceptFamilyId: "joined-polygon-perimeter", learnerFit: q14Fit }),
    item({ diagnosticNumber: 14, itemNumber: 2, problemPage: 1, answerPage: 4, solutionPage: 5, responseContract: "ordered", canonicalAnswer: ordered([4, 8, 12, 16, 20], "개"), structureSummary: "세로로 네 개씩 놓인 육각형 줄이 배열 순서만큼 늘어나는 대응표를 채운다.", detailTypeName: "세로 네 개짜리 육각형 줄 배열의 순서별 조각 수 쓰기", conceptFamilyId: "repeated-shape-unit-count", learnerFit: q14Fit }),
    item({ diagnosticNumber: 14, itemNumber: 3, problemPage: 1, answerPage: 4, solutionPage: 5, responseContract: "ordered", canonicalAnswer: ordered([4, 5, 6, 7, 8], "개"), structureSummary: "위쪽 사각형 세 개는 그대로 두고 아래쪽 사각형이 순서만큼 늘어나는 대응표를 채운다.", detailTypeName: "위쪽 세 칸이 고정된 T자 배열의 순서별 사각형 수 쓰기", conceptFamilyId: "fixed-plus-growing-shape-count", learnerFit: q14Fit }),
    item({ diagnosticNumber: 14, itemNumber: 4, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(55, "개"), structureSummary: "첫째 줄부터 열째 줄까지 점이 하나씩 늘어나는 삼각형 배열의 점을 모두 더한다.", detailTypeName: "한 줄씩 늘어나는 삼각형 점 배열의 열째 점 수 구하기", conceptFamilyId: "triangular-dot-count", learnerFit: q14Fit }),
    item({ diagnosticNumber: 14, itemNumber: 5, problemPage: 2, answerPage: 4, solutionPage: 5, responseContract: "rubric", canonicalAnswer: freeze({ result: scalar("3개씩 늘어나는 관계가 있습니다."), rubric: freeze({ required: freeze(["첫째 배열의 사각형 수 확인", "다음 배열이 될 때마다 3개씩 늘어남을 설명"]), scoring: "배열 순서가 하나 늘 때 사각형이 3개씩 늘어난다는 관계를 나타냄" }) }), structureSummary: "가로와 아래쪽이 함께 자라는 사각형 배열에서 순서가 하나 늘 때 더해지는 수를 설명한다.", detailTypeName: "가로와 아래쪽이 함께 자라는 사각형 배열의 늘어나는 수 설명하기", conceptFamilyId: "linear-shape-growth-explanation", learnerFit: q14Fit }),
    item({ diagnosticNumber: 14, itemNumber: 6, problemPage: 2, answerPage: 4, solutionPage: 5, responseContract: "ordered", canonicalAnswer: ordered([4, 6, 8, 10, 12], "개"), structureSummary: "왼쪽 사각형 두 개는 그대로 두고 아래쪽에 순서의 두 배만큼 놓는 배열의 대응표를 채운다.", detailTypeName: "왼쪽 두 칸이 고정된 ㄴ자 배열의 순서별 사각형 수 쓰기", conceptFamilyId: "fixed-plus-growing-shape-count", learnerFit: q14Fit }),
    item({ diagnosticNumber: 14, itemNumber: 7, problemPage: 2, answerPage: 4, solutionPage: 5, responseContract: "ordered", canonicalAnswer: ordered([6, 7, 8, 9, 10], "개"), structureSummary: "세로 사각형 다섯 개는 그대로 두고 오른쪽에 순서만큼 놓는 배열의 대응표를 채운다.", detailTypeName: "세로 다섯 칸이 고정된 옆으로 자라는 배열의 사각형 수 쓰기", conceptFamilyId: "fixed-plus-growing-shape-count", learnerFit: q14Fit }),
    item({ diagnosticNumber: 14, itemNumber: 8, problemPage: 2, answerPage: 4, solutionPage: 5, responseContract: "ordered", canonicalAnswer: ordered(["노란색", "249개"]), structureSummary: "홀수째는 초록색, 짝수째는 노란색이고 타일 수가 네 개씩 늘어나는 배열에서 62째를 구한다.", detailTypeName: "색이 번갈아 나타나는 십자 타일 배열의 색과 개수 구하기", conceptFamilyId: "alternating-color-shape-count", learnerFit: q14Fit }),
    item({ diagnosticNumber: 14, itemNumber: 9, problemPage: 3, answerPage: 4, solutionPage: 5, responseContract: "ordered", canonicalAnswer: ordered([2, 4, 6, 8, 10], "개"), structureSummary: "육각형 두 개짜리 묶음이 배열 순서만큼 계단 모양으로 이어지는 대응표를 채운다.", detailTypeName: "두 개씩 계단처럼 이어 붙인 육각형 배열의 순서별 조각 수 쓰기", conceptFamilyId: "repeated-shape-unit-count", learnerFit: q14Fit }),
    item({ diagnosticNumber: 14, itemNumber: 10, problemPage: 3, answerPage: 4, solutionPage: 5, responseContract: "ordered", canonicalAnswer: ordered([3, 6, 9, 12, 15], "개"), structureSummary: "육각형 세 개짜리 세로줄이 배열 순서만큼 맞물려 이어지는 대응표를 채운다.", detailTypeName: "세로 세 개짜리 육각형 줄 배열의 순서별 조각 수 쓰기", conceptFamilyId: "repeated-shape-unit-count", learnerFit: q14Fit }),

    item({ diagnosticNumber: 15, itemNumber: 1, problemPage: 1, answerPage: 4, solutionPage: 5, responseContract: "rubric", canonicalAnswer: relation("△=◇×11", ["◇=△÷11"]), structureSummary: "11→121, 15→165, 17→187에서 뒤의 수가 앞의 수의 11배임을 식으로 쓴다.", detailTypeName: "뒤의 수가 앞의 수의 11배인 대응 관계를 식으로 나타내기", conceptFamilyId: "multiply-add-correspondence", learnerFit: q15Fit }),
    item({ diagnosticNumber: 15, itemNumber: 2, problemPage: 1, answerPage: 4, solutionPage: 5, responseContract: "rubric", canonicalAnswer: relation("△=◇×7+2", ["◇=(△-2)÷7"]), structureSummary: "12→86, 13→93, 17→121에서 7을 곱하고 2를 더하는 규칙을 식으로 쓴다.", detailTypeName: "앞의 수에 7을 곱하고 2를 더한 대응 관계를 식으로 나타내기", conceptFamilyId: "multiply-add-correspondence", learnerFit: q15Fit }),
    item({ diagnosticNumber: 15, itemNumber: 3, problemPage: 1, answerPage: 4, solutionPage: 5, responseContract: "rubric", canonicalAnswer: relation("☆=♡×5-4", ["♡=(☆+4)÷5"]), structureSummary: "기계의 1→1, 2→6, 3→11에서 5를 곱하고 4를 빼는 규칙을 식으로 쓴다.", detailTypeName: "나온 수가 넣은 수의 5배보다 4 작은 대응 관계를 식으로 나타내기", conceptFamilyId: "multiply-add-correspondence", learnerFit: q15Fit }),
    item({ diagnosticNumber: 15, itemNumber: 4, problemPage: 1, answerPage: 4, solutionPage: 5, responseContract: "rubric", canonicalAnswer: relation("☆=◇÷2", ["◇=☆×2"]), structureSummary: "24→12, 32→16, 34→17에서 뒤의 수가 앞의 수를 2로 나눈 값임을 식으로 쓴다.", detailTypeName: "뒤의 수가 앞의 수의 절반인 대응 관계를 식으로 나타내기", conceptFamilyId: "divide-add-correspondence", learnerFit: q15Fit }),
    item({ diagnosticNumber: 15, itemNumber: 5, problemPage: 2, answerPage: 4, solutionPage: 5, responseContract: "rubric", canonicalAnswer: relation("●=(■+2)×(■+2)"), structureSummary: "1→9, 2→16, 3→25에서 앞의 수에 2를 더한 뒤 같은 수끼리 곱하는 규칙을 식으로 쓴다.", detailTypeName: "앞의 수에 2를 더한 뒤 같은 수끼리 곱하는 대응 관계 나타내기", conceptFamilyId: "same-factor-product-correspondence", learnerFit: q15Fit }),
    item({ diagnosticNumber: 15, itemNumber: 6, problemPage: 2, answerPage: 4, solutionPage: 5, responseContract: "rubric", canonicalAnswer: relation("●=(◆-2)÷2"), structureSummary: "26→12, 24→11, 22→10에서 앞의 수에서 2를 빼고 2로 나누는 규칙을 식으로 쓴다.", detailTypeName: "앞의 수에서 2를 빼고 2로 나눈 대응 관계를 식으로 나타내기", conceptFamilyId: "divide-add-correspondence", learnerFit: q15Fit }),
    item({ diagnosticNumber: 15, itemNumber: 7, problemPage: 2, answerPage: 4, solutionPage: 5, responseContract: "rubric", canonicalAnswer: relation("☆=◇÷11+1", ["◇=(☆-1)×11"]), structureSummary: "11→2, 22→3, 33→4에서 앞의 수를 11로 나누고 1을 더하는 규칙을 식으로 쓴다.", detailTypeName: "앞의 수를 11로 나누고 1을 더한 대응 관계를 식으로 나타내기", conceptFamilyId: "divide-add-correspondence", learnerFit: q15Fit }),
    item({ diagnosticNumber: 15, itemNumber: 8, problemPage: 2, answerPage: 4, solutionPage: 5, responseContract: "rubric", canonicalAnswer: relation("■=(♣-1)×(♣-1)"), structureSummary: "3→4, 4→9, 5→16에서 앞의 수에서 1을 뺀 뒤 같은 수끼리 곱하는 규칙을 식으로 쓴다.", detailTypeName: "앞의 수에서 1을 뺀 뒤 같은 수끼리 곱하는 대응 관계 나타내기", conceptFamilyId: "same-factor-product-correspondence", learnerFit: q15Fit }),
    item({ diagnosticNumber: 15, itemNumber: 9, problemPage: 3, answerPage: 4, solutionPage: 6, responseContract: "rubric", canonicalAnswer: relation("△=□+65", ["□=△-65"]), structureSummary: "35→100, 45→110, 55→120에서 나온 수가 넣은 수보다 65 큰 규칙을 식으로 쓴다.", detailTypeName: "나온 수가 넣은 수보다 65 큰 대응 관계를 식으로 나타내기", conceptFamilyId: "add-constant-correspondence", learnerFit: q15Fit }),
    item({ diagnosticNumber: 15, itemNumber: 10, problemPage: 3, answerPage: 4, solutionPage: 6, responseContract: "rubric", canonicalAnswer: relation("◇=♡×5-3", ["♡=(◇+3)÷5"]), structureSummary: "기계의 1→2, 2→7, 3→12에서 5를 곱하고 3을 빼는 규칙을 식으로 쓴다.", detailTypeName: "나온 수가 넣은 수의 5배보다 3 작은 대응 관계를 식으로 나타내기", conceptFamilyId: "multiply-add-correspondence", learnerFit: q15Fit }),
    item({ diagnosticNumber: 15, itemNumber: 11, problemPage: 3, answerPage: 4, solutionPage: 6, responseContract: "rubric", canonicalAnswer: relation("△=○÷19", ["○=△×19"]), structureSummary: "기계의 38→2, 57→3, 76→4에서 나온 수가 넣은 수를 19로 나눈 값임을 식으로 쓴다.", detailTypeName: "나온 수가 넣은 수를 19로 나눈 값인 대응 관계를 식으로 나타내기", conceptFamilyId: "divide-add-correspondence", learnerFit: q15Fit }),

    item({ diagnosticNumber: 16, itemNumber: 1, problemPage: 1, answerPage: 3, solutionPage: 4, responseContract: "ordered", canonicalAnswer: ordered([7, 5, 2]), structureSummary: "같은 모양으로 된 세 자리 수를 두 자리 수로 나눈 몫 14와 나머지 49, 두 숫자의 합 조건을 맞춘다.", detailTypeName: "몫·나머지와 두 모양 숫자의 합으로 숨은 세 숫자 찾기", conceptFamilyId: "division-hidden-digit", learnerFit: q16Fit }),
    item({ diagnosticNumber: 16, itemNumber: 2, problemPage: 1, answerPage: 3, solutionPage: 4, responseContract: "ordered", canonicalAnswer: ordered([1, 2, 8, 9, 3, 6, 4]), structureSummary: "서로 다른 일곱 글자가 있는 나눗셈 세로셈의 중간 곱과 나머지를 차례로 맞춘다.", detailTypeName: "서로 다른 일곱 글자가 있는 나눗셈에서 숨은 숫자 찾기", conceptFamilyId: "division-hidden-digit", learnerFit: q16Fit }),
    item({ diagnosticNumber: 16, itemNumber: 3, problemPage: 1, answerPage: 3, solutionPage: 4, responseContract: "ordered", canonicalAnswer: ordered([4, 5, 1, 6, 2]), structureSummary: "서로 다른 다섯 글자와 두 숫자의 합이 9인 조건을 이용해 몫이 3인 나눗셈을 맞춘다.", detailTypeName: "서로 다른 다섯 글자와 합 조건이 있는 나눗셈 숫자 찾기", conceptFamilyId: "division-hidden-digit", learnerFit: q16Fit }),
    item({ diagnosticNumber: 16, itemNumber: 4, problemPage: 1, answerPage: 3, solutionPage: 4, responseContract: "ordered", canonicalAnswer: ordered([4, 3]), structureSummary: "같은 숫자로 된 두 자리 수로 같은 숫자의 세 자리 수를 나눌 때 나머지 25와 이웃한 숫자 조건을 맞춘다.", detailTypeName: "같은 색 도형으로 만든 두 수와 나머지 조건으로 숫자 찾기", conceptFamilyId: "division-hidden-digit", learnerFit: q16Fit }),
    item({ diagnosticNumber: 16, itemNumber: 5, problemPage: 2, answerPage: 3, solutionPage: 4, responseContract: "ordered", canonicalAnswer: ordered([2, 1, 3, 4]), structureSummary: "네 글자의 합과 크기 조건, 몫 6, 가운데 0이 나타나는 곱을 이용해 숨은 숫자를 찾는다.", detailTypeName: "네 글자의 합·크기 조건이 있는 나눗셈에서 숨은 숫자 찾기", conceptFamilyId: "division-hidden-digit", learnerFit: q16Fit }),

    item({ diagnosticNumber: 17, itemNumber: 1, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(89460), structureSummary: "가려진 자리에 수를 넣어 배수 조건을 만족하는 수를 찾는다.", learnerFit: q17Fit, detailTypeName: "가려진 자리에 수를 넣어 여러 배수 조건 맞추기", conceptFamilyId: "multiples-divisibility" }),
    item({ diagnosticNumber: 17, itemNumber: 2, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(99030), structureSummary: "빈 자리에 알맞은 수를 넣어 조건에 맞는 수를 만든다.", learnerFit: q17Fit, detailTypeName: "가려진 자리에 수를 넣어 여러 배수 조건 맞추기", conceptFamilyId: "multiples-divisibility" }),
    item({ diagnosticNumber: 17, itemNumber: 3, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(99756), structureSummary: "여러 자리의 배수 조건을 적용해 가려진 수를 찾는다.", learnerFit: q17Fit, detailTypeName: "가려진 자리에 수를 넣어 여러 배수 조건 맞추기", conceptFamilyId: "multiples-divisibility" }),
    item({ diagnosticNumber: 17, itemNumber: 4, problemPage: 1, answerPage: 3, solutionPage: 4, responseContract: "set", canonicalAnswer: set([6120, 6624, 6228]), structureSummary: "가려진 자리에 수를 넣어 조건에 맞는 모든 수를 찾는다.", learnerFit: q17Fit, detailTypeName: "가려진 자리에 수를 넣어 여러 배수 조건 맞추기", conceptFamilyId: "multiples-divisibility" }),
    item({ diagnosticNumber: 17, itemNumber: 5, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(6, "개"), structureSummary: "가려진 자리에 넣을 수 있는 수의 개수를 센다.", learnerFit: q17Fit, detailTypeName: "가려진 자리에 수를 넣어 여러 배수 조건 맞추기", conceptFamilyId: "multiples-divisibility" }),
    item({ diagnosticNumber: 17, itemNumber: 6, problemPage: 2, answerPage: 3, solutionPage: 4, responseContract: "set", canonicalAnswer: set([8820, 8325]), structureSummary: "여러 배수 조건을 모두 만족하는 수를 찾는다.", learnerFit: q17Fit, detailTypeName: "가려진 자리에 수를 넣어 여러 배수 조건 맞추기", conceptFamilyId: "multiples-divisibility" }),

    item({ diagnosticNumber: 18, itemNumber: 1, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(6, "바퀴"), structureSummary: "42와 36의 최소공배수를 42로 나누어 첫째 톱니바퀴의 회전 수를 구한다.", detailTypeName: "톱니 수가 주어진 두 톱니바퀴가 처음 다시 만날 때 첫째 바퀴의 회전 수 구하기", conceptFamilyId: "gear-repeat-first-rotations", learnerFit: q18Fit }),
    item({ diagnosticNumber: 18, itemNumber: 2, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(7, "바퀴"), structureSummary: "16과 28의 최소공배수를 16으로 나누어 첫째 톱니바퀴의 회전 수를 구한다.", detailTypeName: "두 톱니 수를 공배수로 맞추어 첫째 바퀴의 회전 수 구하기", conceptFamilyId: "gear-repeat-first-rotations", learnerFit: q18Fit }),
    item({ diagnosticNumber: 18, itemNumber: 3, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(3, "바퀴"), structureSummary: "30과 18의 최소공배수를 30으로 나누어 가 톱니바퀴의 회전 수를 구한다.", detailTypeName: "처음 맞물린 톱니가 다시 만날 때 가 톱니바퀴의 회전 수 구하기", conceptFamilyId: "gear-repeat-first-rotations", learnerFit: q18Fit }),
    item({ diagnosticNumber: 18, itemNumber: 4, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(5, "바퀴"), structureSummary: "그림의 21개와 35개 톱니가 처음 다시 만나는 공통 톱니 수를 구해 작은 바퀴의 회전 수를 찾는다.", detailTypeName: "그림으로 맞물린 두 톱니바퀴가 처음 다시 만날 때 작은 바퀴의 회전 수 구하기", conceptFamilyId: "gear-repeat-first-rotations", learnerFit: q18Fit }),
    item({ diagnosticNumber: 18, itemNumber: 5, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(6, "바퀴"), structureSummary: "36과 30의 최소공배수를 30으로 나누어 나 톱니바퀴의 회전 수를 구한다.", detailTypeName: "처음 맞물린 곳에서 다시 만날 때 나 톱니바퀴의 회전 수 구하기", conceptFamilyId: "gear-repeat-second-rotations", learnerFit: q18Fit }),
    item({ diagnosticNumber: 18, itemNumber: 6, problemPage: 2, answerPage: 4, solutionPage: 5, responseContract: "ordered", canonicalAnswer: ordered([3, 2], "바퀴"), structureSummary: "64와 96의 최소공배수를 각 톱니 수로 나누어 두 바퀴의 최소 회전 수를 차례로 구한다.", detailTypeName: "두 톱니바퀴가 처음 다시 만날 때 각각의 회전 수 구하기", conceptFamilyId: "gear-repeat-both-rotations", learnerFit: q18Fit }),
    item({ diagnosticNumber: 18, itemNumber: 7, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(7, "번"), structureSummary: "64와 112의 최소공배수를 작은 톱니 수로 나누어 작은 톱니바퀴의 회전 횟수를 구한다.", detailTypeName: "크기가 다른 두 톱니바퀴가 같은 위치에서 다시 맞물릴 때 작은 바퀴의 회전 횟수 구하기", conceptFamilyId: "gear-repeat-first-rotations", learnerFit: q18Fit }),
    item({ diagnosticNumber: 18, itemNumber: 8, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(2, "바퀴"), structureSummary: "30과 12의 최소공배수를 30으로 나누어 가 톱니바퀴의 최소 회전 수를 구한다.", detailTypeName: "같은 자리에서 다시 만날 때 가 톱니바퀴의 최소 회전 수 구하기", conceptFamilyId: "gear-repeat-first-rotations", learnerFit: q18Fit }),
    item({ diagnosticNumber: 18, itemNumber: 9, problemPage: 3, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(8, "바퀴"), structureSummary: "12와 32의 최소공배수를 12로 나누어 가 톱니바퀴의 회전 수를 구한다.", detailTypeName: "맞물렸던 톱니가 다시 만날 때 가 톱니바퀴의 회전 수 구하기", conceptFamilyId: "gear-repeat-first-rotations", learnerFit: q18Fit }),
    item({ diagnosticNumber: 18, itemNumber: 10, problemPage: 3, answerPage: 4, solutionPage: 6, canonicalAnswer: scalar("5분 후"), structureSummary: "36과 40의 최소공배수로 회전 수를 구하고 한 바퀴에 30초를 곱해 다시 만나는 시간을 구한다.", detailTypeName: "톱니바퀴가 처음 위치에서 다시 만날 때까지 걸리는 시간 구하기", conceptFamilyId: "gear-repeat-time", learnerFit: q18Fit }),

    item({ diagnosticNumber: 19, itemNumber: 1, problemPage: 1, answerPage: 3, solutionPage: 4, responseContract: "ordered", canonicalAnswer: ordered([5, 4, 6]), structureSummary: "전개도를 접었을 때 마주 보는 면의 수의 합이 7이 되도록 세 빈칸을 차례로 채운다.", detailTypeName: "마주 보는 면의 수의 합이 7인 전개도의 빈칸 채우기", conceptFamilyId: "cube-net-opposite-fill", learnerFit: q19Fit }),
    item({ diagnosticNumber: 19, itemNumber: 2, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(10), structureSummary: "같은 전개도로 만든 정육면체 네 개의 보이는 앞면과 마주 보는 뒤 면의 수를 더한다.", detailTypeName: "같은 전개도로 만든 네 정육면체의 보이지 않는 뒤 면 수의 합 구하기", conceptFamilyId: "cube-net-hidden-back-sum", learnerFit: q19Fit }),
    item({ diagnosticNumber: 19, itemNumber: 3, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(24), structureSummary: "전개도에서 마주 보는 수의 짝을 찾고 붙인 네 정육면체의 뒤 면 수를 더한다.", detailTypeName: "붙인 정육면체 네 개의 보이지 않는 뒤 면 수의 합 구하기", conceptFamilyId: "cube-net-hidden-back-sum", learnerFit: q19Fit }),
    item({ diagnosticNumber: 19, itemNumber: 4, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(58), structureSummary: "전개도의 마주 보는 수를 이용해 4행 4열 정육면체의 뒷면에 적힌 수의 합을 구한다.", detailTypeName: "정육면체 16개의 앞면으로 뒷면 수의 합 구하기", conceptFamilyId: "cube-net-hidden-back-sum", learnerFit: q19Fit }),
    item({ diagnosticNumber: 19, itemNumber: 5, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(29), structureSummary: "전개도에서 마주 보는 수를 짝지어 3행 3열 정육면체의 뒷면 수를 모두 더한다.", detailTypeName: "정육면체 9개의 앞면으로 뒷면 수의 합 구하기", conceptFamilyId: "cube-net-hidden-back-sum", learnerFit: q19Fit }),
    item({ diagnosticNumber: 19, itemNumber: 6, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(16), structureSummary: "전개도에서 8과 9의 맞은편 수를 찾아 세 정육면체의 보이지 않는 뒤 면 수를 더한다.", detailTypeName: "같은 전개도로 만든 세 정육면체의 뒤 면 수의 합 구하기", conceptFamilyId: "cube-net-hidden-back-sum", learnerFit: q19Fit }),
    item({ diagnosticNumber: 19, itemNumber: 7, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(7), structureSummary: "주사위 전개도를 접어 두 면에 함께 수직인 두 면을 찾고 그 두 면의 눈 수를 더한다.", detailTypeName: "주사위 전개도에서 두 면에 함께 수직인 면의 눈 수 합 구하기", conceptFamilyId: "dice-net-common-perpendicular-faces", learnerFit: q19Fit }),

    item({ diagnosticNumber: 20, itemNumber: 1, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar("7/15"), structureSummary: "네 분수를 큰 수부터 정렬해 세 번째 분수를 찾는다.", detailTypeName: "네 분수를 큰 수부터 늘어놓아 세 번째 분수 찾기", conceptFamilyId: "fraction-size-ranking", learnerFit: q20Fit }),
    item({ diagnosticNumber: 20, itemNumber: 2, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar("16/27"), structureSummary: "다섯 분수를 큰 수부터 정렬해 세 번째 분수를 찾는다.", detailTypeName: "다섯 분수를 큰 수부터 늘어놓아 세 번째 분수 찾기", conceptFamilyId: "fraction-size-ranking", learnerFit: q20Fit }),
    item({ diagnosticNumber: 20, itemNumber: 3, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar("10/21"), structureSummary: "네 분수를 큰 수부터 정렬해 두 번째 분수를 찾는다.", detailTypeName: "네 분수를 큰 수부터 늘어놓아 두 번째 분수 찾기", conceptFamilyId: "fraction-size-ranking", learnerFit: q20Fit }),
    item({ diagnosticNumber: 20, itemNumber: 4, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar("㉢"), structureSummary: "음료별 분수의 크기와 사람별 선호 조건을 함께 적용해 알맞은 병을 고른다.", detailTypeName: "음료 양의 분수 크기와 선호 조건으로 알맞은 병 찾기", conceptFamilyId: "fraction-ranking-condition-match", learnerFit: q20Fit }),
    item({ diagnosticNumber: 20, itemNumber: 5, problemPage: 2, answerPage: 3, solutionPage: 4, responseContract: "ordered", canonicalAnswer: ordered(["강릉", "부산", "목포", "대구", "부안"]), structureSummary: "다섯 도시의 대분수 거리를 비교해 먼 곳부터 차례로 쓴다.", detailTypeName: "대분수로 나타낸 다섯 도시의 거리를 먼 곳부터 늘어놓기", conceptFamilyId: "mixed-fraction-distance-ranking", learnerFit: q20Fit }),

    item({ diagnosticNumber: 21, itemNumber: 1, problemPage: 1, answerPage: 2, solutionPage: 3, canonicalAnswer: scalar(3, "개"), structureSummary: "7/15와 같은 분수 중 분모와 분자가 두 범위에 함께 들어가는 경우를 센다.", detailTypeName: "7/15와 같고 분모가 50~100, 분자가 20~60인 분수 개수 구하기", conceptFamilyId: "equivalent-fraction-range-count", learnerFit: q21Fit }),
    item({ diagnosticNumber: 21, itemNumber: 2, problemPage: 1, answerPage: 2, solutionPage: 3, canonicalAnswer: scalar(3, "개"), structureSummary: "9/16과 같은 분수 중 분모와 분자가 두 범위에 함께 들어가는 경우를 센다.", detailTypeName: "9/16과 같고 분모가 40~100, 분자가 30~70인 분수 개수 구하기", conceptFamilyId: "equivalent-fraction-range-count", learnerFit: q21Fit }),
    item({ diagnosticNumber: 21, itemNumber: 3, problemPage: 1, answerPage: 2, solutionPage: 3, canonicalAnswer: scalar(4, "개"), structureSummary: "5/12와 같은 분수 중 분모와 분자가 두 범위에 함께 들어가는 경우를 센다.", detailTypeName: "5/12와 같고 분모가 30~80, 분자가 10~40인 분수 개수 구하기", conceptFamilyId: "equivalent-fraction-range-count", learnerFit: q21Fit }),

    item({ diagnosticNumber: 22, itemNumber: 1, problemPage: 1, answerPage: 2, solutionPage: 3, canonicalAnswer: scalar("1/126"), structureSummary: "분자는 2씩, 분모는 3씩 늘어나는 분수에서 7번째와 6번째의 차를 구한다.", detailTypeName: "분자는 2씩 분모는 3씩 늘어나는 분수의 두 항 차 구하기", conceptFamilyId: "fraction-sequence-term-difference", learnerFit: q22Fit }),
    item({ diagnosticNumber: 22, itemNumber: 2, problemPage: 1, answerPage: 2, solutionPage: 3, canonicalAnswer: scalar("19/512"), structureSummary: "분자는 1씩 늘고 분모는 두 배가 되는 분수에서 7번째와 9번째의 차를 구한다.", detailTypeName: "분자는 1씩 늘고 분모는 두 배가 되는 분수의 두 항 차 구하기", conceptFamilyId: "fraction-sequence-term-difference", learnerFit: q22Fit }),

    item({ diagnosticNumber: 23, itemNumber: 1, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(3000, "개"), structureSummary: "닷새 동안 판 분수의 합을 전체 1에서 빼고 남은 사과 수로 처음 개수를 구한다.", detailTypeName: "닷새 동안 판 분수와 남은 사과 수로 처음 개수 구하기", conceptFamilyId: "whole-from-known-remainder", learnerFit: q23Fit }),
    item({ diagnosticNumber: 23, itemNumber: 2, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(600, "cm"), structureSummary: "책과 종이를 묶는 데 쓴 분수의 합을 빼고 남은 끈 길이로 처음 길이를 구한다.", detailTypeName: "두 용도에 쓴 분수와 남은 끈 길이로 처음 길이 구하기", conceptFamilyId: "whole-from-known-remainder", learnerFit: q23Fit }),
    item({ diagnosticNumber: 23, itemNumber: 3, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(2800, "kg"), structureSummary: "닷새 동안 판 쌀의 분수 합을 빼고 남은 무게로 처음 쌀의 무게를 구한다.", detailTypeName: "닷새 동안 판 분수와 남은 쌀 무게로 처음 무게 구하기", conceptFamilyId: "whole-from-known-remainder", learnerFit: q23Fit }),
    item({ diagnosticNumber: 23, itemNumber: 4, problemPage: 1, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(560, "cm"), structureSummary: "두 번 사용한 끈의 분수를 전체에서 빼고 남은 길이로 처음 길이를 구한다.", detailTypeName: "두 번 쓴 분수와 남은 끈 길이로 처음 길이 구하기", conceptFamilyId: "whole-from-known-remainder", learnerFit: q23Fit }),
    item({ diagnosticNumber: 23, itemNumber: 5, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(150, "cm"), structureSummary: "포장과 꽃을 만드는 데 쓴 리본의 분수를 빼고 남은 길이로 처음 길이를 구한다.", detailTypeName: "두 용도로 쓴 리본 분수와 남은 길이로 처음 길이 구하기", conceptFamilyId: "whole-from-known-remainder", learnerFit: q23Fit }),
    item({ diagnosticNumber: 23, itemNumber: 6, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(7, "개"), structureSummary: "세 사람이 가진 구슬 수를 전체의 분수와 차로 나타내고 남은 21개로 전체와 동생의 수를 구한다.", detailTypeName: "세 사람의 구슬 수와 남은 수로 동생 구슬 수 구하기", conceptFamilyId: "fraction-share-balance", learnerFit: q23Fit }),
    item({ diagnosticNumber: 23, itemNumber: 7, problemPage: 2, answerPage: 4, solutionPage: 5, canonicalAnswer: scalar(18, "m²"), structureSummary: "두 꽃밭이 차지한 분수를 전체에서 빼 꽃을 심지 않은 넓이를 구한다.", detailTypeName: "두 꽃밭의 분수를 빼 꽃을 심지 않은 넓이 구하기", conceptFamilyId: "remaining-part-from-whole", learnerFit: q23Fit }),
    item({ diagnosticNumber: 23, itemNumber: 8, problemPage: 2, answerPage: 4, solutionPage: 6, canonicalAnswer: scalar(24, "권"), structureSummary: "세 종류 책의 분수 합을 전체에서 빼고 만화책 11권으로 전체 권수를 구한다.", detailTypeName: "세 종류 책의 분수와 나머지 권수로 전체 권수 구하기", conceptFamilyId: "whole-from-known-remainder", learnerFit: q23Fit }),
    item({ diagnosticNumber: 23, itemNumber: 9, problemPage: 3, answerPage: 4, solutionPage: 6, canonicalAnswer: scalar("5/24"), structureSummary: "전체 쪽수에서 사흘 동안 읽은 부분을 빼 아직 읽지 않은 부분의 분수를 구한다.", detailTypeName: "전체 쪽수와 날짜별 읽은 양으로 남은 부분의 분수 구하기", conceptFamilyId: "remaining-fraction-from-parts", learnerFit: q23Fit }),
    item({ diagnosticNumber: 23, itemNumber: 10, problemPage: 3, answerPage: 4, solutionPage: 6, canonicalAnswer: scalar(8, "km"), structureSummary: "지하철과 버스로 간 분수를 전체에서 빼 두 걷기 거리로 전체 거리를 구한다.", detailTypeName: "교통수단별 이동 분수와 걸은 거리로 전체 거리 구하기", conceptFamilyId: "whole-from-known-remainder", learnerFit: q23Fit }),

    item({ diagnosticNumber: 24, itemNumber: 1, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: mixed(12, 7, 36), structureSummary: "세 분수 묶음마다 약속에 따라 큰 수를 고른 뒤 더하고 뺀다.", detailTypeName: "세 분수 묶음에서 큰 수를 골라 덧셈과 뺄셈하기", conceptFamilyId: "fraction-max-selection-arithmetic", learnerFit: q24Fit }),
    item({ diagnosticNumber: 24, itemNumber: 2, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(365), structureSummary: "3을 여러 번 곱한 수를 분모로 하는 단위분수의 합을 구하고 분모와 분자의 차를 찾는다.", detailTypeName: "같은 수를 여러 번 곱해 만든 단위분수 합에서 두 수의 차 구하기", conceptFamilyId: "geometric-unit-fraction-sum", learnerFit: q24Fit }),
    item({ diagnosticNumber: 24, itemNumber: 3, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar("4/45"), structureSummary: "연속한 두 자연수의 곱을 분모로 한 네 단위분수를 차의 꼴로 바꾸어 더한다.", detailTypeName: "연속한 두 수의 곱을 분모로 한 단위분수 네 개 더하기", conceptFamilyId: "consecutive-product-unit-fraction-sum", learnerFit: q24Fit }),
    item({ diagnosticNumber: 24, itemNumber: 4, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar("5/66"), structureSummary: "연속한 두 자연수의 곱을 분모로 한 다섯 단위분수를 차의 꼴로 바꾸어 더한다.", detailTypeName: "연속한 두 수의 곱을 분모로 한 단위분수 다섯 개 더하기", conceptFamilyId: "consecutive-product-unit-fraction-sum", learnerFit: q24Fit }),
    item({ diagnosticNumber: 24, itemNumber: 5, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(18), structureSummary: "두 분수 식의 값을 각각 가장 가까운 자연수로 나타낸 뒤 더한다.", detailTypeName: "가장 가까운 자연수 약속으로 두 분수 식 계산하기", conceptFamilyId: "nearest-natural-number-expression", learnerFit: q24Fit }),
    item({ diagnosticNumber: 24, itemNumber: 6, problemPage: 2, answerPage: 3, solutionPage: 5, canonicalAnswer: scalar("4/65"), structureSummary: "두 칸 차이 나는 두 자연수의 곱을 분모로 한 단위분수를 두 분수의 차로 바꾸어 더한다.", detailTypeName: "두 칸 차이 수의 곱을 분모로 한 단위분수 네 개 더하기", conceptFamilyId: "gap-two-product-unit-fraction-sum", learnerFit: q24Fit }),

    item({ diagnosticNumber: 25, itemNumber: 1, problemPage: 1, answerPage: 3, solutionPage: 3, canonicalAnswer: scalar(1400, "m²"), structureSummary: "가로와 세로 방향의 폭 5m인 길을 옮겨 모은 뒤 남은 직사각형의 넓이를 구한다.", detailTypeName: "가로와 세로에 폭 5m인 길을 내고 남은 넓이 구하기", conceptFamilyId: "cut-strips-rearrange-area", learnerFit: q25Fit }),
    item({ diagnosticNumber: 25, itemNumber: 2, problemPage: 1, answerPage: 3, solutionPage: 3, canonicalAnswer: scalar(680, "m²"), structureSummary: "가로 방향과 비스듬한 방향의 폭 3m인 길을 옮겨 남은 직사각형의 넓이를 구한다.", detailTypeName: "가로와 비스듬한 폭 3m인 길을 내고 남은 넓이 구하기", conceptFamilyId: "cut-strips-rearrange-area", learnerFit: q25Fit }),
    item({ diagnosticNumber: 25, itemNumber: 3, problemPage: 1, answerPage: 3, solutionPage: 3, canonicalAnswer: scalar(228, "m²"), structureSummary: "폭 3m인 가로 길과 폭 4m인 비스듬한 길을 옮겨 남은 직사각형의 넓이를 구한다.", detailTypeName: "가로 폭 3m와 비스듬한 폭 4m인 길을 내고 남은 넓이 구하기", conceptFamilyId: "cut-strips-rearrange-area", sourceConflict: freeze({ quickAnswer: scalar(228), solutionPrinted: scalar(228, "cm²"), problemRequestedUnit: "m²", independentAnswer: scalar(228, "m²"), resolutionStatus: "resolved", correctedExplanation: "(27-4-4)×(18-3-3)=19×12=228이고 길이 단위가 m이므로 넓이 단위는 m²이다.", decision: "원본 풀이의 cm²를 단위 오기로 판정하고 228m²로 정정" }), learnerFit: q25Fit }),
    item({ diagnosticNumber: 25, itemNumber: 4, problemPage: 1, answerPage: 3, solutionPage: 3, canonicalAnswer: scalar(666, "m²"), structureSummary: "폭 6m인 가로 길과 폭 5m인 세로 길을 옮겨 남은 직사각형의 넓이를 구한다.", detailTypeName: "가로 폭 6m와 세로 폭 5m인 길을 내고 남은 넓이 구하기", conceptFamilyId: "cut-strips-rearrange-area", learnerFit: q25Fit }),

    item({ diagnosticNumber: 26, itemNumber: 1, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(27, "cm²"), structureSummary: "한 변 6cm인 정사각형의 변을 주어진 길이의 배로 나누고 바깥 삼각형의 밑변과 높이를 구한다.", detailTypeName: "정사각형의 나뉜 변과 바깥 꼭짓점으로 만든 삼각형 넓이 구하기", conceptFamilyId: "square-extended-triangle-area", learnerFit: q26Fit }),
    item({ diagnosticNumber: 26, itemNumber: 2, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(22, "cm²"), structureSummary: "사각형과 안쪽 삼각형의 넓이 관계로 큰 삼각형 넓이를 구하고 밑변 길이의 배로 나눈다.", detailTypeName: "사각형이 삼각형 넓이의 4배일 때 나뉜 밑변의 삼각형 넓이 구하기", conceptFamilyId: "nested-area-and-base-ratio", learnerFit: q26Fit }),
    item({ diagnosticNumber: 26, itemNumber: 3, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(16, "cm²"), structureSummary: "사각형과 안쪽 삼각형의 넓이 관계로 큰 삼각형 넓이를 구하고 밑변 길이의 배로 나눈다.", detailTypeName: "사각형이 삼각형 넓이의 5배일 때 색칠한 삼각형 넓이 구하기", conceptFamilyId: "nested-area-and-base-ratio", learnerFit: q26Fit }),
    item({ diagnosticNumber: 26, itemNumber: 4, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(30, "cm²"), structureSummary: "평행사변형과 같은 밑변·높이 관계를 이용해 두 삼각형의 넓이가 같음을 찾는다.", detailTypeName: "평행사변형 안에서 같은 넓이를 빼 색칠한 삼각형 넓이 구하기", conceptFamilyId: "parallelogram-area-subtraction", learnerFit: q26Fit }),
    item({ diagnosticNumber: 26, itemNumber: 5, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(24, "cm²"), structureSummary: "사각형과 안쪽 삼각형의 넓이 관계로 큰 삼각형 넓이를 구하고 밑변 길이의 배로 나눈다.", detailTypeName: "사각형이 삼각형 넓이의 5배이고 밑변이 6배일 때 색칠한 넓이 구하기", conceptFamilyId: "nested-area-and-base-ratio", learnerFit: q26Fit }),

    item({ diagnosticNumber: 27, itemNumber: 1, problemPage: 1, answerPage: 3, solutionPage: 3, canonicalAnswer: scalar("오후 12시 42분"), structureSummary: "하루에 5분 15초씩 빨라지는 시간을 8일 동안 더해 정오 뒤의 시각을 구한다.", detailTypeName: "하루에 빨라지는 분과 초를 8일 동안 더해 시각 구하기", conceptFamilyId: "fractional-clock-drift", learnerFit: q27Fit }),
    item({ diagnosticNumber: 27, itemNumber: 2, problemPage: 1, answerPage: 3, solutionPage: 3, canonicalAnswer: scalar("③"), structureSummary: "하루에 1분 36초씩 느려지는 시간을 15일 동안 더해 정오 전의 시각을 고른다.", detailTypeName: "하루에 느려지는 분과 초를 15일 동안 더해 알맞은 시각 고르기", conceptFamilyId: "fractional-clock-drift", learnerFit: q27Fit }),
    item({ diagnosticNumber: 27, itemNumber: 3, problemPage: 1, answerPage: 3, solutionPage: 3, canonicalAnswer: scalar("오전 11시 4분"), structureSummary: "하루에 2분 48초씩 느려지는 시간을 20일 동안 더해 정오 전의 시각을 구한다.", detailTypeName: "하루에 느려지는 분과 초를 20일 동안 더해 시각 구하기", conceptFamilyId: "fractional-clock-drift", learnerFit: q27Fit }),
    item({ diagnosticNumber: 27, itemNumber: 4, problemPage: 1, answerPage: 3, solutionPage: 3, canonicalAnswer: scalar("⑤"), structureSummary: "하루에 6분 20초씩 빨라지는 시간을 9일 동안 더해 정오 뒤의 시각을 고른다.", detailTypeName: "하루에 빨라지는 분과 초를 9일 동안 더해 알맞은 시각 고르기", conceptFamilyId: "fractional-clock-drift", learnerFit: q27Fit }),
    item({ diagnosticNumber: 28, itemNumber: 1, problemPage: 1, answerPage: 5, solutionPage: 5, responseContract: "ordered", canonicalAnswer: ordered([120, 15, 135], "도"), structureSummary: "시계의 큰 눈금과 반눈금으로 두 표시 각과 그 합을 차례로 구한다.", detailTypeName: "시계 눈금의 각과 반눈금, 두 각의 합 구하기", conceptFamilyId: "clock-scale-angle-parts", learnerFit: q28Fit }),
    item({ diagnosticNumber: 28, itemNumber: 2, problemPage: 1, answerPage: 5, solutionPage: 5, responseContract: "set", canonicalAnswer: set([2, 10], "시"), structureSummary: "긴바늘이 12를 가리킬 때 두 바늘의 작은 각이 60도인 시각을 모두 찾는다.", detailTypeName: "긴바늘이 12일 때 작은 각이 60도인 시각 모두 찾기", conceptFamilyId: "clock-angle-time-search", learnerFit: q28Fit }),
    item({ diagnosticNumber: 28, itemNumber: 3, problemPage: 1, answerPage: 5, solutionPage: 5, canonicalAnswer: scalar(105, "도"), structureSummary: "9시 30분의 두 바늘 위치를 각도로 나타내 작은 쪽 각을 구한다.", detailTypeName: "9시 30분 두 바늘의 작은 각 구하기", conceptFamilyId: "clock-hand-small-angle", learnerFit: q28Fit }),
    item({ diagnosticNumber: 28, itemNumber: 4, problemPage: 1, answerPage: 5, solutionPage: 5, canonicalAnswer: scalar(75, "도"), structureSummary: "3시 30분의 시침 이동을 포함해 두 바늘이 이루는 작은 각을 구한다.", detailTypeName: "3시 30분 두 바늘의 작은 각 구하기", conceptFamilyId: "clock-hand-small-angle", learnerFit: q28Fit }),
    item({ diagnosticNumber: 28, itemNumber: 5, problemPage: 1, answerPage: 5, solutionPage: 5, canonicalAnswer: scalar("오후 2시"), structureSummary: "30분마다 시작하는 수업 중 두 바늘의 작은 각이 60도인 오후 시작 시각을 찾는다.", detailTypeName: "30분마다 시작하는 수업에서 60도인 시작 시각 찾기", conceptFamilyId: "clock-angle-time-search", learnerFit: q28Fit }),
    item({ diagnosticNumber: 28, itemNumber: 6, problemPage: 2, answerPage: 5, solutionPage: 5, canonicalAnswer: scalar(115, "도"), structureSummary: "1시 50분의 시침 이동과 분침 위치를 함께 반영해 작은 각을 구한다.", detailTypeName: "1시 50분 두 바늘의 작은 각 구하기", conceptFamilyId: "clock-hand-small-angle", learnerFit: q28Fit }),
    item({ diagnosticNumber: 28, itemNumber: 7, problemPage: 2, answerPage: 5, solutionPage: 5, solutionPages: [5, 6], canonicalAnswer: scalar(120, "도"), structureSummary: "4시 정각에 숫자 12와 4 사이의 큰 눈금 수로 작은 각을 구한다.", detailTypeName: "4시 정각 두 바늘의 작은 각 구하기", conceptFamilyId: "clock-hand-small-angle", learnerFit: q28Fit }),
    item({ diagnosticNumber: 28, itemNumber: 8, problemPage: 2, answerPage: 5, solutionPage: 6, responseContract: "ordered", canonicalAnswer: ordered([150, 18, 168], "도"), structureSummary: "그림의 큰 눈금 각과 두 보정각의 합을 구해 실제 두 바늘 사이의 각을 찾는다.", detailTypeName: "그림에 표시한 눈금각과 두 바늘 사이 각을 차례로 구하기", conceptFamilyId: "clock-diagram-angle-parts", learnerFit: q28Fit }),
    item({ diagnosticNumber: 28, itemNumber: 9, problemPage: 2, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(165, "도"), structureSummary: "11시 30분의 시침 이동 15도를 더해 두 바늘의 작은 각을 구한다.", detailTypeName: "11시 30분 두 바늘의 작은 각 구하기", conceptFamilyId: "clock-hand-small-angle", learnerFit: q28Fit }),
    item({ diagnosticNumber: 28, itemNumber: 10, problemPage: 2, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(85, "도"), structureSummary: "버스가 이동한 2시간 50분 동안 짧은바늘이 움직인 각을 구한다.", detailTypeName: "버스 이동 시간 동안 짧은바늘이 움직인 각 구하기", conceptFamilyId: "clock-hour-hand-movement", learnerFit: q28Fit }),
    item({ diagnosticNumber: 28, itemNumber: 11, problemPage: 2, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar("8시 20분"), structureSummary: "7시 40분에서 긴바늘이 240도 움직이는 40분을 더해 시각을 구한다.", detailTypeName: "긴바늘이 240도 움직인 뒤의 시각 구하기", conceptFamilyId: "clock-minute-hand-movement", learnerFit: q28Fit }),
    item({ diagnosticNumber: 28, itemNumber: 12, problemPage: 3, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(50, "도"), structureSummary: "1시부터 2시 40분까지 짧은바늘이 움직인 각을 시간과 분으로 나누어 구한다.", detailTypeName: "운동하는 동안 짧은바늘이 움직인 각 구하기", conceptFamilyId: "clock-hour-hand-movement", learnerFit: q28Fit }),
    item({ diagnosticNumber: 28, itemNumber: 13, problemPage: 3, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(135, "도"), structureSummary: "계기판 바깥쪽 작은 각을 빼 전체 눈금 범위를 구하고 0에서 100까지의 이동각을 구한다.", detailTypeName: "계기판의 눈금 범위와 바늘 이동 값으로 움직인 각 구하기", conceptFamilyId: "gauge-scale-angle", learnerFit: q28Fit }),
    item({ diagnosticNumber: 28, itemNumber: 14, problemPage: 3, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(125, "도"), structureSummary: "5시 50분에 시침이 움직인 25도를 반영해 두 바늘의 작은 각을 구한다.", detailTypeName: "5시 50분 두 바늘의 작은 각 구하기", conceptFamilyId: "clock-hand-small-angle", learnerFit: q28Fit }),
    item({ diagnosticNumber: 28, itemNumber: 15, problemPage: 3, answerPage: 5, solutionPage: 6, solutionPages: [6, 7], responseContract: "ordered", canonicalAnswer: ordered([3, 40], "시·분"), structureSummary: "숫자 12의 위치가 지워진 시계에서 10도 표시와 두 바늘 위치로 시각을 찾는다.", detailTypeName: "숫자가 없는 시계의 바늘 위치와 10도로 시각 구하기", conceptFamilyId: "hidden-clock-number-time", learnerFit: q28Fit }),

    item({ diagnosticNumber: 29, itemNumber: 1, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(12, "분"), structureSummary: "욕조의 들이를 1분 동안 나오는 물의 양으로 나누어 가득 채우는 시간을 구한다.", detailTypeName: "욕조의 들이와 1분당 물의 양으로 채우는 시간 구하기", conceptFamilyId: "decimal-rate-fill-time", learnerFit: q29Fit }),
    item({ diagnosticNumber: 29, itemNumber: 2, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(25, "분"), structureSummary: "욕조의 들이를 1분 동안 나오는 물의 양으로 나누어 가득 채우는 시간을 구한다.", detailTypeName: "소수인 들이와 1분당 물의 양으로 채우는 시간 구하기", conceptFamilyId: "decimal-rate-fill-time", learnerFit: q29Fit }),
    item({ diagnosticNumber: 29, itemNumber: 3, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(47, "분"), structureSummary: "두 수도꼭지에서 1분 동안 나오는 물의 양을 더한 뒤 수조의 들이를 나누어 시간을 구한다.", detailTypeName: "두 수도꼭지의 1분당 물의 양을 더해 채우는 시간 구하기", conceptFamilyId: "combined-decimal-rate-fill-time", learnerFit: q29Fit }),
    item({ diagnosticNumber: 29, itemNumber: 4, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar("㉡ 수도꼭지"), structureSummary: "각 수도꼭지에서 나온 물의 양을 걸린 시간으로 나누어 1분당 양이 더 큰 쪽을 찾는다.", detailTypeName: "서로 다른 시간에 나온 물의 양으로 1분당 양 비교하기", conceptFamilyId: "compare-decimal-unit-rates", learnerFit: q29Fit }),
    item({ diagnosticNumber: 29, itemNumber: 5, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(25, "분"), structureSummary: "몇 분 동안 나온 물의 양으로 1분당 양을 구한 뒤 물통의 들이를 나누어 기다리는 시간을 구한다.", detailTypeName: "몇 분 동안 나온 물의 양으로 1분당 양과 채우는 시간 구하기", conceptFamilyId: "decimal-rate-fill-time", learnerFit: q29Fit }),
    item({ diagnosticNumber: 29, itemNumber: 6, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(107.7, "L"), structureSummary: "1시간 18분을 시간으로 바꾸어 1시간 동안 나오는 물의 양을 구하고 반올림한다.", detailTypeName: "분으로 주어진 시간과 물의 양으로 1시간당 양을 반올림하기", conceptFamilyId: "decimal-rate-volume-rounding", learnerFit: q29Fit }),
    item({ diagnosticNumber: 29, itemNumber: 7, problemPage: 2, answerPage: 3, solutionPage: 4, responseContract: "ordered", canonicalAnswer: ordered([4, 30], "분·초"), structureSummary: "두 수도꼭지의 1분당 물의 양을 각각 구해 더하고 전체 물의 양을 나누어 걸리는 시간을 분과 초로 나타낸다.", detailTypeName: "두 수도꼭지를 함께 틀어 물을 받는 시간을 분과 초로 구하기", conceptFamilyId: "combined-decimal-rate-fill-time", learnerFit: q29Fit }),

    item({ diagnosticNumber: 30, itemNumber: 1, problemPage: 1, answerPage: 5, solutionPage: 5, canonicalAnswer: scalar(2, "쌍"), structureSummary: "정사각형을 두 평행선으로 나누고 양끝 띠의 높이가 같은 조건으로 합동인 사각형을 센다.", detailTypeName: "정사각형을 두 평행선으로 나누어 합동인 사각형 세기", conceptFamilyId: "parallel-cut-congruent-rectangles", learnerFit: q30Fit }),
    item({ diagnosticNumber: 30, itemNumber: 2, problemPage: 1, answerPage: 5, solutionPage: 5, canonicalAnswer: scalar(15, "쌍"), structureSummary: "가로와 세로의 길이가 같은 세 구간으로 나뉜 격자에서 크기가 같은 직사각형을 센다.", detailTypeName: "길이가 다른 격자에서 합동인 직사각형 세기", conceptFamilyId: "mondrian-congruent-rectangles", learnerFit: q30Fit }),
    item({ diagnosticNumber: 30, itemNumber: 3, problemPage: 1, answerPage: 5, solutionPage: 5, canonicalAnswer: scalar(6, "쌍"), structureSummary: "평행사변형의 두 대각선이 나눈 작은 도형과 여러 조각을 합친 도형을 짝지어 센다.", detailTypeName: "평행사변형의 두 대각선으로 생긴 합동인 도형 세기", conceptFamilyId: "parallelogram-central-congruence", learnerFit: q30Fit }),
    item({ diagnosticNumber: 30, itemNumber: 4, problemPage: 1, answerPage: 5, solutionPage: 5, canonicalAnswer: scalar(7, "쌍"), structureSummary: "일부만 이어진 수직선과 평행선으로 나뉜 그림에서 여러 칸을 합친 사각형까지 센다.", detailTypeName: "부분 격자에서 여러 칸을 합친 합동인 사각형 세기", conceptFamilyId: "mondrian-congruent-rectangles", learnerFit: q30Fit }),
    item({ diagnosticNumber: 30, itemNumber: 5, problemPage: 2, answerPage: 5, solutionPage: 5, canonicalAnswer: scalar(9, "쌍"), structureSummary: "평행사변형을 대각선과 가운데 평행선으로 나눈 뒤 삼각형과 사각형을 크기별로 센다.", detailTypeName: "대각선과 가운데 평행선으로 나눈 합동인 삼각형과 사각형 세기", conceptFamilyId: "parallelogram-central-congruence", learnerFit: q30Fit }),
    item({ diagnosticNumber: 30, itemNumber: 6, problemPage: 2, answerPage: 5, solutionPage: 5, solutionPages: [5, 6], canonicalAnswer: scalar(8, "쌍"), structureSummary: "이등변삼각형을 세 갈래와 네 높이로 나눈 뒤 작은 조각부터 큰 삼각형까지 센다.", detailTypeName: "세 갈래와 네 높이로 나눈 이등변삼각형에서 합동인 삼각형 세기", conceptFamilyId: "layered-isosceles-congruence", learnerFit: q30Fit }),
    item({ diagnosticNumber: 30, itemNumber: 7, problemPage: 2, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(15, "쌍"), structureSummary: "평행사변형의 대각선을 5등분하고 두 맞은편 꼭짓점과 이어 만든 삼각형을 크기별로 센다.", detailTypeName: "대각선을 5등분한 평행사변형에서 합동인 삼각형 세기", conceptFamilyId: "divided-diagonal-congruent-triangles", learnerFit: q30Fit }),
    item({ diagnosticNumber: 30, itemNumber: 8, problemPage: 2, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(6, "쌍"), structureSummary: "평행사변형의 대각선을 3등분하고 두 맞은편 꼭짓점과 이어 만든 삼각형을 크기별로 센다.", detailTypeName: "대각선을 3등분한 평행사변형에서 합동인 삼각형 세기", conceptFamilyId: "divided-diagonal-congruent-triangles", learnerFit: q30Fit }),
    item({ diagnosticNumber: 30, itemNumber: 9, problemPage: 2, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(6, "쌍"), structureSummary: "정삼각형의 한 변을 5등분하고 맞은편 꼭짓점과 이어 만든 여러 크기의 삼각형을 센다.", detailTypeName: "한 변을 5등분한 정삼각형에서 합동인 삼각형 세기", conceptFamilyId: "triangle-fan-congruence", learnerFit: q30Fit }),
    item({ diagnosticNumber: 30, itemNumber: 10, problemPage: 3, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(6, "쌍"), structureSummary: "두 이등변삼각형의 밑변을 각각 3등분하고 세 높이로 나뉜 삼각형을 크기별로 센다.", detailTypeName: "세 갈래와 세 높이로 나눈 이등변삼각형에서 합동인 삼각형 세기", conceptFamilyId: "layered-isosceles-congruence", learnerFit: q30Fit }),
    item({ diagnosticNumber: 30, itemNumber: 11, problemPage: 3, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(6, "쌍"), structureSummary: "이등변삼각형의 밑변을 5등분하고 꼭짓점과 이어 만든 여러 크기의 삼각형을 센다.", detailTypeName: "밑변을 5등분한 이등변삼각형에서 합동인 삼각형 세기", conceptFamilyId: "triangle-fan-congruence", learnerFit: q30Fit }),
    item({ diagnosticNumber: 30, itemNumber: 12, problemPage: 3, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(9, "쌍"), structureSummary: "이등변삼각형의 밑변을 6등분하고 꼭짓점과 이어 만든 삼각형을 조각 수별로 모두 센다.", detailTypeName: "밑변을 6등분한 이등변삼각형에서 풀이를 쓰며 합동인 삼각형 세기", conceptFamilyId: "triangle-fan-congruence", learnerFit: q30Fit }),
    item({ diagnosticNumber: 30, itemNumber: 13, problemPage: 3, answerPage: 5, solutionPage: 7, canonicalAnswer: scalar(4, "쌍"), structureSummary: "이등변삼각형의 밑변을 4등분하고 꼭짓점과 이어 만든 여러 크기의 삼각형을 센다.", detailTypeName: "밑변을 4등분한 이등변삼각형에서 합동인 삼각형 세기", conceptFamilyId: "triangle-fan-congruence", learnerFit: q30Fit }),

    item({ diagnosticNumber: 31, itemNumber: 1, problemPage: 1, answerPage: 2, solutionPage: 3, canonicalAnswer: scalar(180, "m"), structureSummary: "짧은 터널 길이를 지난 시간으로 나누어 빠르기를 구하고 긴 터널 완전 통과 거리에서 터널 길이를 뺀다.", detailTypeName: "짧은 터널의 통과 시간으로 빠르기를 구해 열차 길이 찾기", conceptFamilyId: "train-tunnel-length", learnerFit: q31Fit }),
    item({ diagnosticNumber: 31, itemNumber: 2, problemPage: 1, answerPage: 2, solutionPage: 3, canonicalAnswer: scalar(120, "m"), structureSummary: "짧은 터널 길이를 지난 시간으로 나누어 빠르기를 구하고 긴 터널 완전 통과 거리에서 터널 길이를 뺀다.", detailTypeName: "두 터널의 길이와 걸린 시간이 다를 때 열차 길이 찾기", conceptFamilyId: "train-tunnel-length", learnerFit: q31Fit }),

    item({ diagnosticNumber: 32, itemNumber: 1, problemPage: 1, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(6.3), structureSummary: "잘못 구한 몫에 부족한 값을 더해 바른 몫을 만든 뒤 나누는 수를 구한다.", detailTypeName: "잘못 구한 몫이 바른 몫보다 작을 때 나누는 수 구하기", conceptFamilyId: "reverse-decimal-division-error", learnerFit: q32Fit }),
    item({ diagnosticNumber: 32, itemNumber: 2, problemPage: 1, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(31.25), structureSummary: "어떤 수의 자연수 부분과 소수 부분을 식에서 찾고 두 부분의 몫을 구한다.", detailTypeName: "자연수 부분과 소수 부분이 들어간 식에서 두 부분의 몫 구하기", conceptFamilyId: "decimal-part-reconstruction", learnerFit: q32Fit }),
    item({ diagnosticNumber: 32, itemNumber: 3, problemPage: 1, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(7.2), structureSummary: "잘못 구한 몫에서 더 크게 나온 값을 빼 바른 몫을 만든 뒤 나누는 수를 구한다.", detailTypeName: "잘못 구한 몫이 바른 몫보다 클 때 나누는 수 구하기", conceptFamilyId: "reverse-decimal-division-error", learnerFit: q32Fit }),
    item({ diagnosticNumber: 32, itemNumber: 4, problemPage: 1, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(16, "개"), structureSummary: "몫을 소수 첫째 자리에서 반올림해 7이 되는 범위를 어떤 수의 소수 한 자리 범위로 바꾸어 센다.", detailTypeName: "몫을 반올림한 값으로 소수 한 자리 어떤 수의 개수 구하기", conceptFamilyId: "rounded-quotient-dividend-range", learnerFit: q32Fit }),
    item({ diagnosticNumber: 32, itemNumber: 5, problemPage: 2, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(8), structureSummary: "75를 곱할 것을 0.75를 곱해 생긴 두 계산값의 차로 어떤 수를 구한다.", detailTypeName: "75 대신 0.75를 곱해 생긴 차로 어떤 수 구하기", conceptFamilyId: "wrong-decimal-operation", learnerFit: q32Fit }),
    item({ diagnosticNumber: 32, itemNumber: 6, problemPage: 2, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(6.55), structureSummary: "8.3으로 나눌 것을 곱한 결과에서 어떤 수를 찾고 바른 몫을 소수 둘째 자리까지 나타낸다.", detailTypeName: "8.3으로 나눌 것을 곱한 결과로 바른 몫 구하기", conceptFamilyId: "wrong-decimal-operation", learnerFit: q32Fit }),
    item({ diagnosticNumber: 32, itemNumber: 7, problemPage: 2, answerPage: 5, solutionPage: 6, canonicalAnswer: scalar(16), structureSummary: "25를 곱할 것을 0.25를 곱해 생긴 두 계산값의 차로 어떤 수를 구한다.", detailTypeName: "25 대신 0.25를 곱해 생긴 차로 어떤 수 구하기", conceptFamilyId: "wrong-decimal-operation", learnerFit: q32Fit }),
    item({ diagnosticNumber: 32, itemNumber: 8, problemPage: 2, answerPage: 5, solutionPage: 7, canonicalAnswer: scalar(14.84), structureSummary: "0.6으로 나눈 몫을 반올림해 24.7이 되는 어떤 수의 범위에서 가장 큰 소수 두 자리 수를 찾는다.", detailTypeName: "0.6으로 나눈 몫을 반올림한 값으로 가장 큰 소수 두 자리 수 찾기", conceptFamilyId: "rounded-quotient-dividend-range", learnerFit: q32Fit }),
    item({ diagnosticNumber: 32, itemNumber: 9, problemPage: 3, answerPage: 5, solutionPage: 7, canonicalAnswer: scalar(16), structureSummary: "0.5를 곱할 것을 5를 곱해 생긴 두 계산값의 차로 어떤 수를 구한다.", detailTypeName: "0.5 대신 5를 곱해 생긴 차로 어떤 수 구하기", conceptFamilyId: "wrong-decimal-operation", learnerFit: q32Fit }),
    item({ diagnosticNumber: 32, itemNumber: 10, problemPage: 3, answerPage: 5, solutionPage: 7, canonicalAnswer: scalar(9.95), structureSummary: "0.8로 나눈 몫을 반올림해 12.4가 되는 어떤 수의 범위에서 가장 큰 소수 두 자리 수를 찾는다.", detailTypeName: "0.8로 나눈 몫을 반올림한 값으로 가장 큰 소수 두 자리 수 찾기", conceptFamilyId: "rounded-quotient-dividend-range", learnerFit: q32Fit }),
    item({ diagnosticNumber: 32, itemNumber: 11, problemPage: 3, answerPage: 5, solutionPage: 7, canonicalAnswer: scalar(2.4), structureSummary: "7.3으로 나눌 것을 더한 결과에서 어떤 수를 찾고 바른 몫을 소수 첫째 자리까지 반올림한다.", detailTypeName: "7.3으로 나눌 것을 더한 결과로 반올림한 바른 몫 구하기", conceptFamilyId: "wrong-decimal-operation", learnerFit: q32Fit }),
    item({ diagnosticNumber: 32, itemNumber: 12, problemPage: 3, answerPage: 5, solutionPage: 7, responseContract: "ordered", canonicalAnswer: ordered([7.08, 7.1]), structureSummary: "2.4로 나눌 것을 곱한 결과에서 어떤 수를 찾고 몫을 소수 둘째 자리와 반올림한 첫째 자리로 나타낸다.", detailTypeName: "2.4로 나눌 것을 곱한 결과로 두 가지 자리의 몫 구하기", conceptFamilyId: "wrong-decimal-operation", learnerFit: q32Fit }),
    item({ diagnosticNumber: 32, itemNumber: 13, problemPage: 4, answerPage: 5, solutionPage: 7, canonicalAnswer: scalar(3.5), structureSummary: "8.6으로 나눌 것을 뺀 결과에서 어떤 수를 찾고 바른 몫을 소수 첫째 자리까지 반올림한다.", detailTypeName: "8.6으로 나눌 것을 뺀 결과로 반올림한 바른 몫 구하기", conceptFamilyId: "wrong-decimal-operation", learnerFit: q32Fit }),
    item({ diagnosticNumber: 32, itemNumber: 14, problemPage: 4, answerPage: 5, solutionPage: 7, responseContract: "ordered", canonicalAnswer: ordered([14.05, 14.1]), structureSummary: "3.7로 나눌 것을 곱한 결과에서 어떤 수를 찾고 몫을 소수 둘째 자리와 반올림한 첫째 자리로 나타낸다.", detailTypeName: "3.7로 나눌 것을 곱한 결과로 두 가지 자리의 몫 구하기", conceptFamilyId: "wrong-decimal-operation", learnerFit: q32Fit }),
    item({ diagnosticNumber: 32, itemNumber: 15, problemPage: 4, answerPage: 5, solutionPage: 7, responseContract: "ordered", canonicalAnswer: ordered([8.83, 8.8]), structureSummary: "4.3으로 나눌 것을 곱한 결과에서 어떤 수를 찾고 몫을 소수 둘째 자리와 반올림한 첫째 자리로 나타낸다.", detailTypeName: "4.3으로 나눌 것을 곱한 결과로 두 가지 자리의 몫 구하기", conceptFamilyId: "wrong-decimal-operation", learnerFit: q32Fit }),

    item({ diagnosticNumber: 33, itemNumber: 1, problemPage: 1, answerPage: 3, solutionPage: 3, responseContract: "ordered", canonicalAnswer: ordered([6, 5]), structureSummary: "7.8로 나눈 몫과 나머지로 어떤 수를 구하고 더 작은 수 6.2로 나눈 자연수 몫과 자연수 나머지를 찾는다.", detailTypeName: "나누는 수가 작아졌을 때 새 몫과 자연수인 나머지 구하기", conceptFamilyId: "decimal-quotient-remainder-chain", learnerFit: q33Fit }),
    item({ diagnosticNumber: 33, itemNumber: 2, problemPage: 1, answerPage: 3, solutionPage: 3, canonicalAnswer: scalar(0.24), structureSummary: "4.4로 나눈 몫과 나머지로 어떤 수를 구한 뒤 2.9로 나눈 몫을 소수 첫째 자리까지만 구하고 남는 수를 찾는다.", detailTypeName: "몫을 소수 첫째 자리까지만 구했을 때 남는 수 찾기", conceptFamilyId: "decimal-truncated-quotient-remainder", learnerFit: q33Fit }),
    item({ diagnosticNumber: 33, itemNumber: 3, problemPage: 1, answerPage: 3, solutionPage: 3, canonicalAnswer: scalar(3.5), structureSummary: "세 소수의 합, 곱, 차례로 나눈 값에 관한 세 식을 함께 풀어 기호 하나의 값을 찾는다.", detailTypeName: "세 소수의 합·곱·차례로 나누기 조건으로 한 수 찾기", conceptFamilyId: "decimal-symbol-equations", learnerFit: q33Fit }),
    item({ diagnosticNumber: 33, itemNumber: 4, problemPage: 1, answerPage: 3, solutionPage: 3, responseContract: "ordered", canonicalAnswer: ordered([2, 3.3]), structureSummary: "2.4로 나눈 몫과 나머지로 어떤 수를 구하고 더 큰 수 7.7로 나눈 자연수 몫과 소수 나머지를 찾는다.", detailTypeName: "나누는 수가 커졌을 때 새 몫과 소수인 나머지 구하기", conceptFamilyId: "decimal-quotient-remainder-chain", learnerFit: q33Fit }),
    item({ diagnosticNumber: 33, itemNumber: 5, problemPage: 1, answerPage: 3, solutionPage: 3, canonicalAnswer: scalar(4.8), structureSummary: "2.57보다 작은 가장 큰 소수 한 자리 나머지 2.5를 이용해 어떤 수를 만들고 6.37로 나눈 몫을 반올림한다.", detailTypeName: "첫 몫이 11일 때 가장 큰 한 자리 소수 나머지로 새 몫 반올림하기", conceptFamilyId: "largest-decimal-remainder-rounded-quotient", learnerFit: q33Fit }),
    item({ diagnosticNumber: 33, itemNumber: 6, problemPage: 1, answerPage: 3, solutionPage: 3, responseContract: "ordered", canonicalAnswer: ordered([5, 0.4]), structureSummary: "5.4로 나눈 몫과 나머지로 어떤 수를 구하고 더 작은 수 4.6으로 나눈 몫과 1보다 작은 나머지를 찾는다.", detailTypeName: "나누는 수가 작아졌을 때 새 몫과 1보다 작은 나머지 구하기", conceptFamilyId: "decimal-quotient-remainder-chain", learnerFit: q33Fit }),
    item({ diagnosticNumber: 33, itemNumber: 7, problemPage: 2, answerPage: 3, solutionPage: 3, canonicalAnswer: scalar(8.5), structureSummary: "1.39보다 작은 가장 큰 소수 한 자리 나머지 1.3을 이용해 어떤 수를 만들고 5.23으로 나눈 몫을 반올림한다.", detailTypeName: "첫 몫이 31일 때 가장 큰 한 자리 소수 나머지로 새 몫 반올림하기", conceptFamilyId: "largest-decimal-remainder-rounded-quotient", learnerFit: q33Fit }),
    item({ diagnosticNumber: 33, itemNumber: 8, problemPage: 2, answerPage: 3, solutionPage: 3, canonicalAnswer: scalar(2.11), structureSummary: "합이 5.42이고 차가 1.94인 두 수를 구한 뒤 큰 수를 작은 수로 나눈 몫을 소수 둘째 자리까지 반올림한다.", detailTypeName: "두 수의 합과 차로 큰 수와 작은 수를 구해 몫 반올림하기", conceptFamilyId: "sum-difference-decimal-quotient", learnerFit: q33Fit }),
    item({ diagnosticNumber: 33, itemNumber: 9, problemPage: 2, answerPage: 3, solutionPage: 3, canonicalAnswer: scalar(0.04), structureSummary: "41에 선택지의 소수를 하나씩 더해 0.95로 나눈 몫이 소수 첫째 자리에서 끝나는 가장 작은 값을 찾는다.", detailTypeName: "나누어지는 수에 가장 작은 소수를 더해 몫이 소수 첫째 자리에서 끝나게 하기", conceptFamilyId: "terminating-decimal-quotient-adjustment", learnerFit: q33Fit }),
    item({ diagnosticNumber: 33, itemNumber: 10, problemPage: 2, answerPage: 3, solutionPage: 3, solutionPages: [3, 4], canonicalAnswer: scalar(8.2), structureSummary: "3.24보다 작은 가장 큰 소수 한 자리 나머지 3.2를 이용해 어떤 수를 만들고 7.12로 나눈 몫을 반올림한다.", detailTypeName: "첫 몫이 17일 때 가장 큰 한 자리 소수 나머지로 새 몫 반올림하기", conceptFamilyId: "largest-decimal-remainder-rounded-quotient", learnerFit: q33Fit }),
    item({ diagnosticNumber: 33, itemNumber: 11, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(77.3), structureSummary: "두 소수 곱셈식을 각각 거꾸로 풀어 기호에 알맞은 두 수를 구한 뒤 더한다.", detailTypeName: "두 소수 곱셈식에서 숨은 두 수를 구해 합하기", conceptFamilyId: "reverse-decimal-multiplication", learnerFit: q33Fit }),
    item({ diagnosticNumber: 33, itemNumber: 12, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(7.3), structureSummary: "5.7로 나눈 몫과 나머지로 어떤 수를 구하고 8.4로 나눈 자연수 몫 뒤에 남는 수만 찾는다.", detailTypeName: "첫 나눗셈으로 어떤 수를 구해 두 번째 나눗셈의 나머지만 찾기", conceptFamilyId: "decimal-quotient-remainder-chain", learnerFit: q33Fit }),

    item({ diagnosticNumber: 34, itemNumber: 1, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar("햇살반"), structureSummary: "두 반의 학생 수에 참여율을 각각 곱해 실제 참여 학생 수가 더 많은 반을 찾는다.", detailTypeName: "학급 인원수와 참여율로 실제 참여 학생이 더 많은 반 찾기", conceptFamilyId: "percent-rate-count-comparison", learnerFit: q34Fit }),
    item({ diagnosticNumber: 34, itemNumber: 2, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar("유진"), structureSummary: "두 사람의 시도 횟수에 성공률을 각각 곱해 실제 성공 횟수가 더 많은 사람을 찾는다.", detailTypeName: "시도 횟수와 성공률로 실제 성공 횟수가 더 많은 사람 찾기", conceptFamilyId: "percent-rate-count-comparison", learnerFit: q34Fit }),
    item({ diagnosticNumber: 34, itemNumber: 3, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(18, "명"), structureSummary: "두 조건의 비율과 어느 쪽에도 속하지 않는 비율로 두 조건이 겹치는 학생 수를 구한다.", detailTypeName: "두 조건과 어느 쪽에도 속하지 않는 비율로 겹치는 학생 수 구하기", conceptFamilyId: "percent-overlap-count", learnerFit: q34Fit }),
    item({ diagnosticNumber: 34, itemNumber: 4, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(36000, "원"), structureSummary: "원가보다 15% 높인 정가에서 할인한 금액과 실제 이익을 이용해 원가를 거꾸로 구한다.", detailTypeName: "정가를 원가보다 15% 높이고 할인했을 때 실제 이익으로 원가 구하기", conceptFamilyId: "markup-discount-profit-cost", learnerFit: q34Fit }),
    item({ diagnosticNumber: 34, itemNumber: 5, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(20000, "원"), structureSummary: "원가보다 30% 높인 정가에서 할인한 금액과 실제 이익을 이용해 원가를 거꾸로 구한다.", detailTypeName: "정가를 원가보다 30% 높이고 할인했을 때 실제 이익으로 원가 구하기", conceptFamilyId: "markup-discount-profit-cost", learnerFit: q34Fit }),

    item({ diagnosticNumber: 35, itemNumber: 1, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(94.2, "cm"), structureSummary: "지름이 40cm와 30cm인 두 굴렁쇠가 3바퀴 굴러간 거리의 차를 구한다.", detailTypeName: "지름이 다른 두 굴렁쇠가 3바퀴 굴러간 거리의 차 구하기", conceptFamilyId: "rolling-circle-distance-comparison", learnerFit: q35Fit }),
    item({ diagnosticNumber: 35, itemNumber: 2, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(251.2, "cm"), structureSummary: "지름이 10cm와 30cm인 두 바퀴가 4바퀴 굴러간 거리의 차를 구한다.", detailTypeName: "지름이 다른 두 바퀴가 4바퀴 굴러간 거리의 차 구하기", conceptFamilyId: "rolling-circle-distance-comparison", learnerFit: q35Fit }),
    item({ diagnosticNumber: 35, itemNumber: 3, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(840.96, "cm²"), structureSummary: "반지름 4cm인 원이 한 변 20cm인 정사각형 바깥 둘레를 돌며 지나간 자리의 넓이를 구한다.", detailTypeName: "반지름을 아는 원이 정사각형 바깥 둘레를 돌 때 지나간 자리 넓이 구하기", conceptFamilyId: "rolling-circle-swept-area", learnerFit: q35Fit }),
    item({ diagnosticNumber: 35, itemNumber: 4, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(218.24, "cm²"), structureSummary: "지름 4cm인 원이 9cm×12cm 직사각형 바깥 둘레를 돌며 지나간 자리의 넓이를 구한다.", detailTypeName: "지름 4cm인 원이 9cm×12cm 직사각형 둘레를 돌 때 지나간 자리 넓이 구하기", conceptFamilyId: "rolling-circle-swept-area", learnerFit: q35Fit }),
    item({ diagnosticNumber: 35, itemNumber: 5, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(744.96, "cm²"), structureSummary: "지름 8cm인 원이 24cm×10cm 직사각형 바깥 둘레를 돌며 지나간 자리의 넓이를 구한다.", detailTypeName: "지름 8cm인 원이 24cm×10cm 직사각형 둘레를 돌 때 지나간 자리 넓이 구하기", conceptFamilyId: "rolling-circle-swept-area", learnerFit: q35Fit }),

    item({ diagnosticNumber: 36, itemNumber: 1, problemPage: 1, answerPage: 3, solutionPage: 4, responseContract: "ordered", canonicalAnswer: ordered([10, 21]), structureSummary: "분당 1000cm³씩 채울 때 물 높이 그래프의 꺾이는 높이와 수조가 다 차는 시간을 구한다.", detailTypeName: "일정하게 물을 넣은 그래프에서 칸막이 높이와 모두 채우는 시간 구하기", conceptFamilyId: "partitioned-tank-fill-graph", learnerFit: q36Fit }),
    item({ diagnosticNumber: 36, itemNumber: 2, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(80, "m³"), structureSummary: "분당 20m³씩 넣은 물 높이 그래프의 두 구간으로 수조 밑넓이와 나무토막 부피를 구한다.", detailTypeName: "분당 20m³씩 넣은 그래프에서 직육면체 나무토막 부피 구하기", conceptFamilyId: "submerged-prism-volume-from-fill-graph", learnerFit: q36Fit }),
    item({ diagnosticNumber: 36, itemNumber: 3, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(25, "m³"), structureSummary: "분당 10m³씩 넣은 물 높이 그래프의 두 구간으로 수조 밑넓이와 나무토막 부피를 구한다.", detailTypeName: "분당 10m³씩 넣은 그래프에서 직육면체 나무토막 부피 구하기", conceptFamilyId: "submerged-prism-volume-from-fill-graph", learnerFit: q36Fit }),
    item({ diagnosticNumber: 36, itemNumber: 4, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(2.6, "cm"), structureSummary: "두 칸의 밑면 크기와 물 높이로 물의 부피를 더해 칸막이를 없앤 뒤 높이를 구한다.", detailTypeName: "두 칸의 물 높이와 밑면 크기로 칸막이를 없앤 뒤 물 높이 구하기", conceptFamilyId: "partition-water-height-conservation", learnerFit: q36Fit }),
    item({ diagnosticNumber: 36, itemNumber: 5, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(9), structureSummary: "칸막이를 없앤 뒤의 물 높이와 왼쪽 칸의 처음 높이로 오른쪽 칸의 처음 높이를 거꾸로 구한다.", detailTypeName: "합친 물 높이와 한쪽 물 높이로 다른 쪽의 처음 물 높이 구하기", conceptFamilyId: "reverse-partition-water-height", learnerFit: q36Fit }),
    item({ diagnosticNumber: 36, itemNumber: 6, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(3.05, "cm"), structureSummary: "크기가 다른 두 칸의 물 부피를 더해 칸막이를 없앤 뒤의 물 높이를 구한다.", detailTypeName: "크기가 다른 두 칸의 물 높이로 칸막이를 없앤 뒤 물 높이 구하기", conceptFamilyId: "partition-water-height-conservation", learnerFit: q36Fit }),

    item({ diagnosticNumber: 37, itemNumber: 1, problemPage: 1, answerPage: 2, solutionPage: 3, canonicalAnswer: scalar(20, "cm"), structureSummary: "삼각기둥의 세 옆면을 펼쳐 9cm, 6cm, 5cm를 이은 가로 길이를 만들고, 45°로 감긴 실의 경로에서 높이를 구한다.", detailTypeName: "삼각기둥 옆면을 한 바퀴 감은 45° 실로 높이 구하기", conceptFamilyId: "triangular-prism-lateral-strip-height", learnerFit: q37Fit }),
    item({ diagnosticNumber: 37, itemNumber: 2, problemPage: 1, answerPage: 2, solutionPage: 3, canonicalAnswer: scalar(21, "cm"), structureSummary: "삼각기둥의 세 옆면을 펼쳐 8cm, 7cm, 6cm를 이은 가로 길이를 만들고, 45°를 이루는 가장 짧은 선에서 높이를 구한다.", detailTypeName: "삼각기둥 옆면의 두 꼭짓점을 잇는 45°의 가장 짧은 선으로 높이 구하기", conceptFamilyId: "triangular-prism-lateral-strip-height", learnerFit: q37Fit }),

    item({ diagnosticNumber: 38, itemNumber: 1, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(1), structureSummary: "267/32를 자연수와 역수가 이어진 겹분수로 나타내 a, b, c, d를 차례로 구한 뒤 a+b+c-d를 계산한다.", detailTypeName: "267/32를 자연수 네 개가 있는 겹분수로 나타내 합과 차 구하기", conceptFamilyId: "continued-fraction-natural-parts", learnerFit: q38Fit }),
    item({ diagnosticNumber: 38, itemNumber: 2, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(12), structureSummary: "197/90을 맨 안쪽이 1/2인 겹분수로 나타내 네 자연수 a, b, c, d의 합을 구한다.", detailTypeName: "197/90을 맨 안쪽이 1/2인 겹분수로 나타내 네 자연수의 합 구하기", conceptFamilyId: "continued-fraction-natural-parts", learnerFit: q38Fit }),
    item({ diagnosticNumber: 38, itemNumber: 3, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(10), structureSummary: "155/48을 맨 안쪽이 1/3인 겹분수로 나타내 네 자연수 a, b, c, d의 합을 구한다.", detailTypeName: "155/48을 맨 안쪽이 1/3인 겹분수로 나타내 네 자연수의 합 구하기", conceptFamilyId: "continued-fraction-natural-parts", learnerFit: q38Fit }),
    item({ diagnosticNumber: 38, itemNumber: 4, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(3), structureSummary: "1과 1/3으로 이루어진 뺄셈 겹분수를 가장 안쪽부터 계산한다.", detailTypeName: "1에서 세 번 차례로 빼는 겹분수 계산하기", conceptFamilyId: "nested-fraction-subtraction", learnerFit: q38Fit }),
    item({ diagnosticNumber: 38, itemNumber: 5, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar("4/5"), structureSummary: "2와 1/2가 세 겹으로 이어진 뺄셈 분수를 가장 안쪽부터 계산하고 마지막 역수를 구한다.", detailTypeName: "2와 1/2가 이어진 세 겹 뺄셈 분수 계산하기", conceptFamilyId: "nested-fraction-subtraction", learnerFit: q38Fit }),
    item({ diagnosticNumber: 38, itemNumber: 6, problemPage: 2, answerPage: 3, solutionPage: 5, canonicalAnswer: scalar("15/56"), structureSummary: "4와 1/4가 두 겹으로 이어진 뺄셈 분수를 가장 안쪽부터 계산하고 마지막 역수를 구한다.", detailTypeName: "4와 1/4가 이어진 두 겹 뺄셈 분수 계산하기", conceptFamilyId: "nested-fraction-subtraction", learnerFit: q38Fit }),

    item({ diagnosticNumber: 39, itemNumber: 1, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(6), structureSummary: "0.8을 60번 곱한 수의 소수 60번째 자리 숫자를 8의 거듭제곱 일의 자리 반복으로 구한다.", detailTypeName: "0.8을 60번 곱한 수의 소수 60번째 자리 숫자 구하기", conceptFamilyId: "decimal-power-last-digit-cycle", learnerFit: q39Fit }),
    item({ diagnosticNumber: 39, itemNumber: 2, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(9), structureSummary: "0.9를 75번 곱한 수의 소수 75번째 자리 숫자를 9의 거듭제곱 일의 자리 반복으로 구한다.", detailTypeName: "0.9를 75번 곱한 수의 소수 75번째 자리 숫자 구하기", conceptFamilyId: "decimal-power-last-digit-cycle", learnerFit: q39Fit }),
    item({ diagnosticNumber: 39, itemNumber: 3, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(5), structureSummary: "0.5를 100번 곱한 수의 소수 100번째 자리 숫자를 5의 거듭제곱 일의 자리로 구한다.", detailTypeName: "0.5를 100번 곱한 수의 소수 100번째 자리 숫자 구하기", conceptFamilyId: "decimal-power-last-digit-cycle", learnerFit: q39Fit }),
    item({ diagnosticNumber: 39, itemNumber: 4, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(6), structureSummary: "0.4를 80번 곱한 수의 소수 80번째 자리 숫자를 4의 거듭제곱 일의 자리 반복으로 구한다.", detailTypeName: "0.4를 80번 곱한 수의 소수 80번째 자리 숫자 구하기", conceptFamilyId: "decimal-power-last-digit-cycle", sourceConflict: freeze({ solutionPrintedDivision: "80÷4", verifiedCycleLength: 2, independentAnswer: scalar(6), resolutionStatus: "resolved", correctedExplanation: "4의 거듭제곱 일의 자리는 4, 6의 2개 주기로 반복한다. 80÷2=40으로 나머지가 0이므로 80번째 숫자는 6이다.", decision: "원본 풀이의 80÷4를 계산 오기로 판정하고 80÷2로 정정" }), learnerFit: q39Fit }),
    item({ diagnosticNumber: 39, itemNumber: 5, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(7), structureSummary: "0.3을 71번 곱한 수의 소수 71번째 자리 숫자를 3의 거듭제곱 일의 자리 반복으로 구한다.", detailTypeName: "0.3을 71번 곱한 수의 소수 71번째 자리 숫자 구하기", conceptFamilyId: "decimal-power-last-digit-cycle", learnerFit: q39Fit }),
    item({ diagnosticNumber: 39, itemNumber: 6, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(7), structureSummary: "0.7을 65번 곱한 수의 소수 65번째 자리 숫자를 7의 거듭제곱 일의 자리 반복으로 구한다.", detailTypeName: "0.7을 65번 곱한 수의 소수 65번째 자리 숫자 구하기", conceptFamilyId: "decimal-power-last-digit-cycle", learnerFit: q39Fit }),
    item({ diagnosticNumber: 39, itemNumber: 7, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(6), structureSummary: "0.6을 360번 곱한 수의 소수 360번째 자리 숫자를 6의 거듭제곱 일의 자리로 구한다.", detailTypeName: "0.6을 360번 곱한 수의 소수 360번째 자리 숫자 구하기", conceptFamilyId: "decimal-power-last-digit-cycle", learnerFit: q39Fit }),

    item({ diagnosticNumber: 40, itemNumber: 1, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(6, "개"), structureSummary: "0·1·6·8·9를 여러 번 써서 6119보다 작은 점대칭 네 자리 수를 모두 센다.", detailTypeName: "0·1·6·8·9로 6119보다 작은 점대칭 네 자리 수 세기", conceptFamilyId: "rotational-digit-symmetry", learnerFit: q40Fit }),
    item({ diagnosticNumber: 40, itemNumber: 2, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(16, "개"), structureSummary: "0·1·5·6·9를 여러 번 써서 9116보다 작은 점대칭 네 자리 수를 모두 센다.", detailTypeName: "0·1·5·6·9로 9116보다 작은 점대칭 네 자리 수 세기", conceptFamilyId: "rotational-digit-symmetry", learnerFit: q40Fit }),
    item({ diagnosticNumber: 40, itemNumber: 3, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(14, "개"), structureSummary: "0·1·2·5·6·8·9를 여러 번 써서 8000과 9999 사이의 점대칭 네 자리 수를 모두 센다.", detailTypeName: "0·1·2·5·6·8·9로 8000과 9999 사이의 점대칭 네 자리 수 세기", conceptFamilyId: "rotational-digit-symmetry", learnerFit: q40Fit }),
    item({ diagnosticNumber: 40, itemNumber: 4, problemPage: 1, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(12, "개"), structureSummary: "0·1·2·6·7·9 중 돌려도 숫자가 되는 것만 골라 점대칭 세 자리 수를 모두 센다.", detailTypeName: "0·1·2·6·7·9에서 쓸 수 있는 숫자를 골라 점대칭 세 자리 수 세기", conceptFamilyId: "rotational-digit-symmetry", learnerFit: q40Fit }),
    item({ diagnosticNumber: 40, itemNumber: 5, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(12, "개"), structureSummary: "0·4·5·6·8·9 중 돌려도 숫자가 되는 것만 골라 점대칭 세 자리 수를 모두 센다.", detailTypeName: "0·4·5·6·8·9에서 쓸 수 있는 숫자를 골라 점대칭 세 자리 수 세기", conceptFamilyId: "rotational-digit-symmetry", learnerFit: q40Fit }),
    item({ diagnosticNumber: 40, itemNumber: 6, problemPage: 2, answerPage: 3, solutionPage: 4, canonicalAnswer: scalar(20, "개"), structureSummary: "0·1·3·5·6·8·9 중 돌려도 숫자가 되는 것만 골라 점대칭 세 자리 수를 모두 센다.", detailTypeName: "0·1·3·5·6·8·9에서 쓸 수 있는 숫자를 골라 점대칭 세 자리 수 세기", conceptFamilyId: "rotational-digit-symmetry", learnerFit: q40Fit })
  ];

  if (!schema || items.length !== 302) throw new Error("pilot item index is incomplete");
  return freeze({ schemaVersion: schema.SCHEMA_VERSION, sourceExamId: SOURCE_EXAM_ID, items: freeze(items) });
});
