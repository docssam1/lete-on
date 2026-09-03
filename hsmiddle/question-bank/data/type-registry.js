(function (root, factory) {
  "use strict";
  const schema = typeof module !== "undefined" && module.exports
    ? require("./schema.js")
    : root.HSMIDDLE_QUESTION_BANK_SCHEMA;
  const api = factory(schema);
  root.HSMIDDLE_QUESTION_TYPE_REGISTRY = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (schema) {
  "use strict";

  const freeze = Object.freeze;
  const SOURCE_EXAM_ID = "diagnostic-similar";
  const sourceReviewed = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]);
  const learnerFitReviewed = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]);
  const releaseLocked = new Set();
  const sourceBundleConflicts = new Set();
  const evidenceConflicts = new Set([25, 39]);
  const releaseNotes = freeze({});
  const sourceCorrectionNotes = freeze({
    25: "원본 3번 풀이의 단위 cm²는 오기입니다. 문제의 길이 단위가 m이므로 정답은 228m²입니다.",
    39: "원본 4번 풀이의 80÷4는 오기입니다. 일의 자리 4, 6은 2개 주기로 반복하므로 80÷2=40이고 정답은 6입니다."
  });
  const normalizedTitles = freeze({
    3: "나눗셈과 시간·빠르기를 이용한 문제 해결",
    4: "수 카드와 몫·나머지 조건으로 나눗셈식 만들기",
    5: "여러 삼각형의 각의 합을 이용해 모르는 각 구하기",
    7: "분수로 빨라지거나 느려지는 시계의 시각 구하기",
    8: "사람과 지점의 위치를 이용해 두 거리의 차 구하기",
    9: "시간과 빠르기를 이용해 거리·길이·양 구하기",
    10: "평행선 사이에서 꺾인 선의 모르는 각 구하기",
    11: "평행선의 동위각과 엇각으로 여러 각 구하기",
    12: "두 수로 나눌 때의 조건에 맞는 수 찾기",
    6: "한 점에서 만나는 맞꼭지각의 쌍의 개수",
    13: "수 카드로 배수를 만들고 조건에 맞는 수 찾기",
    14: "배열 순서와 도형·점·타일 수의 대응 관계 찾기",
    15: "주어진 대응쌍과 기계의 규칙을 식으로 나타내기",
    16: "같은 모양·글자에 숨은 숫자를 찾는 나눗셈",
    17: "가려진 자리에 수를 넣어 여러 배수 조건 맞추기",
    18: "두 톱니바퀴가 처음 위치에서 다시 만나는 회전 수와 시간 구하기",
    19: "전개도를 접어 마주 보는 면과 보이지 않는 뒤 면의 수 구하기",
    20: "분수와 대분수를 비교해 순서와 조건에 맞는 값 찾기",
    21: "분자와 분모의 범위에 맞는 크기가 같은 분수의 개수 구하기",
    22: "분수의 규칙을 찾아 정해진 두 항의 차 구하기",
    23: "전체를 1로 보고 남은 양과 처음 양 구하기",
    24: "분수의 크기 비교와 계산 규칙을 이용해 식 계산하기",
    25: "가로와 세로에서 길의 폭을 빼 남은 땅의 넓이 구하기",
    26: "넓이의 배와 밑변 길이의 배를 이용해 삼각형 넓이 구하기",
    27: "하루에 빨라지거나 느려지는 시간으로 며칠 뒤 시각 구하기",
    28: "시계의 두 바늘이 이루는 각과 움직인 각 구하기",
    29: "수도꼭지에서 나오는 물의 양과 걸리는 시간 구하기",
    30: "합동인 도형의 수 구하기",
    31: "두 터널의 길이와 통과 시간으로 열차의 길이 구하기",
    32: "잘못 계산한 소수의 나눗셈에서 어떤 수와 몫 구하기",
    33: "소수의 나눗셈에서 몫·나머지와 반올림한 몫 구하기",
    34: "백분율로 실제 수와 겹치는 수, 원가 구하기",
    35: "굴러간 원의 이동 거리와 지나간 자리 넓이 구하기",
    36: "칸막이와 나무토막이 있는 수조의 물 높이와 부피 구하기",
    37: "삼각기둥 옆면을 따라 그은 45° 선으로 높이 구하기",
    38: "분수를 자연수와 겹분수로 나타내고 계산하기",
    39: "한 자리 소수를 여러 번 곱한 수의 특정 소수 자리 숫자 구하기",
    40: "전자 숫자를 180° 돌려도 같은 수가 되는 수의 개수 구하기"
  });
  const entries = [
    [1, "조건을 만족하는 수 중 가장 큰, 작은 수 구하기", "4-1", "수", "상", "1단원 큰수", "single-value"],
    [2, "자릿수가 늘어나는 곱셈식 배열에서 규칙 찾기", "4-1", "규칙찾기", "중", "6단원 규칙찾기", "single-value"],
    [3, "나눗셈의 활용", "4-1", "식의 계산", "하", "3단원 곱셈과 나눗셈", "single-value"],
    [4, "수 카드로 조건에 맞는 나눗셈식 만들기", "4-1", "식의 계산", "하", "3단원 곱셈과 나눗셈", "single-value"],
    [5, "연결된 두 삼각형의 각의 크기 구하기", "4-1", "도형", "중", "2단원 각도", "single-value"],
    [6, "한 점에서 만나는 맞꼭짓각의 개수", "4-1", "도형", "상", "2단원 각도", "single-value"],
    [7, "분수의 곱셈의 활용: 느려지는 시계", "5-2", "식의 계산", "상", "2단원 분수의 곱셈", "single-value"],
    [8, "사람의 위치에 따른 두 거리의 차와 합", "4-2", "식의 계산", "상", "3단원 소수의 덧셈과 뺄셈", "single-value"],
    [9, "두 사람이 동시에 출발할 때 문제 해결하기", "5-2", "식의 계산", "상", "4단원 소수의 곱셈", "single-value"],
    [10, "평행선과 직선이 만날 때 생기는 각도", "4-2", "도형", "최상", "4단원 사각형", "single-value"],
    [11, "엇각과 동위각의 성질", "4-2", "도형", "하", "4단원 사각형", "single-value"],
    [12, "두 수로 나누어떨어지는 수 중 조건을 만족하는 수", "5-1", "수", "중", "2단원 약수와 배수", "set"],
    [13, "배수 판정법", "5-1", "수", "중", "2단원 약수와 배수", "single-value"],
    [14, "배열 순서와 물건 수의 대응 관계", "5-1", "규칙찾기", "상", "3단원 규칙과 대응", "single-value"],
    [15, "수의 대응 관계 찾기", "5-1", "규칙찾기", "최상", "3단원 규칙과 대응", "rubric"],
    [16, "나눗셈 복면산", "4-1", "식의 계산", "상", "3단원 곱셈과 나눗셈", "multi-input"],
    [17, "배수 판정법", "5-1", "수", "하", "2단원 약수와 배수", "single-value"],
    [18, "톱니바퀴 문제", "5-1", "수", "중", "2단원 약수와 배수", "multi-input"],
    [19, "겹친 주사위 눈의 최대, 최소", "5-2", "도형", "상", "5단원 직육면체", "single-value"],
    [20, "세 분수의 크기 비교", "5-1", "수", "최상", "4단원 약분과 통분", "ordered"],
    [21, "조건에 맞는 크기가 같은 분수 만들기", "5-1", "수", "상", "4단원 약분과 통분", "single-value"],
    [22, "일정한 규칙의 분수들의 합", "5-1", "수", "중", "5단원 분수의 덧셈과 뺄셈", "single-value"],
    [23, "전체 1을 이용하는 문제 해결하기", "5-1", "식의 계산", "하", "5단원 분수의 덧셈과 뺄셈", "single-value"],
    [24, "부분분수와 일정한 약속의 분수 계산", "5-2", "식의 계산", "최상", "2단원 분수의 곱셈", "single-value"],
    [25, "폭을 일정하게 잘라 내고 남은 부분의 넓이", "5-1", "도형", "최상", "6단원 다각형의 둘레와 넓이", "single-value"],
    [26, "선분 길이의 비를 이용한 삼각형 넓이", "5-1", "도형", "상", "6단원 다각형의 둘레와 넓이", "single-value"],
    [27, "느리거나 빨리 가는 시계", "5-2", "식의 계산", "하", "2단원 분수의 곱셈", "single-value"],
    [28, "시계에서의 각", "4-1", "도형", "중", "2단원 각도", "single-value"],
    [29, "시간에 따른 들이 문제", "6-2", "식의 계산", "중", "2단원 소수의 나눗셈", "single-value"],
    [30, "합동인 도형의 개수", "5-2", "도형", "하", "3단원 합동과 대칭", "single-value"],
    [31, "터널 통과 시간으로 열차의 길이 구하기", "6-1", "식의 계산", "상", "4단원 비와 비율", "single-value"],
    [32, "몫을 반올림한 어떤 수 구하기", "6-2", "식의 계산", "상", "2단원 소수의 나눗셈", "single-value"],
    [33, "몫을 반올림한 어떤 수 구하기 심화", "6-2", "식의 계산", "최상", "2단원 소수의 나눗셈", "multi-input"],
    [34, "백분율의 활용: 인원수", "6-1", "식의 계산", "상", "4단원 비와 비율", "single-value"],
    [35, "원이 지나간 자리의 둘레", "6-2", "도형", "상", "5단원 원의 넓이", "single-value"],
    [36, "가운데 칸막이를 없앴을 때 물의 높이", "6-1", "도형", "상", "6단원 직육면체의 겉넓이와 부피", "single-value"],
    [37, "각기둥의 높이", "6-1", "도형", "중", "2단원 각기둥과 각뿔", "single-value"],
    [38, "번분수의 활용 규칙", "6-2", "규칙찾기", "상", "4단원 비례식과 비례배분", "single-value"],
    [39, "소수의 자릿수 구하기", "5-2", "식의 계산", "상", "4단원 소수의 곱셈", "single-value"],
    [40, "대칭수와 속력", "5-2", "수", "최상", "3단원 합동과 대칭", "single-value"]
  ].map(function (row) {
    const number = row[0];
    const typeId = `diagnostic-similar-q${String(number).padStart(2, "0")}`;
    const reviewed = sourceReviewed.has(number);
    const learnerFitVerified = learnerFitReviewed.has(number);
    const eligible = !releaseLocked.has(number);
    const title = normalizedTitles[number] || row[1];
    return freeze({
      typeId,
      sourceExamId: SOURCE_EXAM_ID,
      diagnosticNumber: number,
      legacyTitle: row[1],
      title,
      detailTypeName: title,
      conceptFamilyId: number === 13 || number === 17 ? "multiples-divisibility" : number === 7 || number === 27 ? "fractional-clock-drift" : number === 30 ? "congruent-shape-counting" : number === 40 ? "rotational-digit-symmetry" : typeId,
      conceptTags: freeze(number === 13 || number === 17 ? ["배수 판정법"] : number === 7 || number === 27 ? ["빨라지거나 느려지는 시계"] : number === 30 ? ["합동", "도형 세기"] : number === 40 ? ["점대칭", "180° 돌리기", "전자 숫자"] : [row[1]]),
      semester: row[2],
      area: row[3],
      difficulty: row[4],
      unit: row[5],
      defaultResponseContract: row[6],
      responseContractScope: "item",
      representative: true,
      sourceReviewStatus: reviewed ? "verified" : "draft",
      sourceBundleStatus: sourceBundleConflicts.has(number) ? "conflict" : reviewed ? "verified" : "draft",
      releaseNote: releaseNotes[number] || null,
      sourceCorrectionNote: sourceCorrectionNotes[number] || null,
      workStatus: reviewed ? "complete" : "pending",
      evidenceStatus: evidenceConflicts.has(number) ? "conflict" : learnerFitVerified ? "verified" : "draft",
      releaseStatus: eligible ? "eligible" : "locked"
    });
  });

  if (!schema || entries.length !== 40) throw new Error("type registry is incomplete");
  return freeze({ schemaVersion: schema.SCHEMA_VERSION, sourceExamId: SOURCE_EXAM_ID, types: freeze(entries) });
});
