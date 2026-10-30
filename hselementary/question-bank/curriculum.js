if (typeof module !== "undefined" && module.exports && typeof window !== "undefined" && !window.HSE_SOURCE_INVENTORY_42_QUADRILATERAL) {
  require("./source-inventory-4-2-quadrilateral.js");
}

(() => {
  const detailed = (name, generatorKey, labels) => ({
    name,
    types: labels.map((definition, variant) => {
      const type = typeof definition === "string" ? { label: definition } : definition;
      return {
        ...type,
        name: type.name || type.label,
        label: type.label || type.name,
        generatorKey,
        variant: Number.isInteger(type.variant) ? type.variant : variant
      };
    })
  });

  const fixedVerifiedPool = (name, generatorKey, labels, verifiedVariantCount = 3) => detailed(
    name,
    generatorKey,
    labels.map(definition => {
      const type = typeof definition === "string" ? { label: definition } : definition;
      return {
        ...type,
        generationMode: "fixed-verified-pool",
        verifiedVariantCount: type.reviewLocked ? 0 : verifiedVariantCount,
        answerVisualRequired: true,
        answerVisualStatus: type.reviewLocked ? "locked" : "verified"
      };
    })
  );

  const sourced = (label, difficultyBand, sourceTier, sourceEvidence = "4-1 실력 p.4-15 · 심화 p.8-19 · 경시 p.1-12 문제 구조 대조") => ({
    label,
    difficultyBand,
    sourceTier,
    sourceVerified: true,
    sourceEvidence: `${sourceEvidence} · 확인 구조: ${label}`
  });

  const sourcedAngle = (label, difficultyBand, sourceTier) => sourced(label, difficultyBand, sourceTier, "4-1 실력 p.18-31 · 심화 p.21-34 · 경시 p.14-27 문제 구조 대조");
  const sourcedMultiplyDivide = (label, difficultyBand, sourceTier) => sourced(label, difficultyBand, sourceTier, "4-1 실력 p.32-45 · 심화 p.35-48 · 경시 p.28-41 문제 구조 대조");
  const movementEvidence = [
    "4-1 심화 p.50-51 개념탐구 1·Mission · 경시 p.43 대조",
    "4-1 심화 p.52-53 개념탐구 2·Mission · 경시 p.44 대조",
    "4-1 심화 p.54-55 개념탐구 3·Mission · 경시 p.45 대조",
    "4-1 심화 p.56-57 개념탐구 4·Mission · 경시 p.46 대조"
  ];
  const barGraphEvidence = [
    "4-1 심화 p.60-61 개념탐구 1·Mission · 경시 p.49-50 대조",
    "4-1 심화 p.62-63 개념탐구 2·Mission · 경시 p.51-52 대조"
  ];
  const rulesEvidence = [
    "4-1 심화 p.66-67 개념탐구 1·Mission · 경시 p.55-56 대조",
    "4-1 심화 p.68-69 개념탐구 2·Mission · 경시 p.57-58 대조",
    "4-1 심화 p.70-71 개념탐구 3·Mission · 경시 p.59-60 대조",
    "4-1 심화 p.72-73 개념탐구 4·Mission · 경시 p.61-62 대조",
    "4-1 실력 p.70-71 · 심화 p.74-75 개념탐구 5·Mission · 경시 p.63-64 대조",
    "4-1 심화 p.76-77 개념탐구 6·Mission · 경시 p.65-66 대조"
  ];
  const sourcedMovement = (label, difficultyBand, sourceTier, exploration) => sourced(label, difficultyBand, sourceTier, movementEvidence[exploration - 1]);
  const sourcedBarGraph = (label, difficultyBand, sourceTier, exploration) => sourced(label, difficultyBand, sourceTier, barGraphEvidence[exploration - 1]);
  const sourcedRules = (label, difficultyBand, sourceTier, exploration) => sourced(label, difficultyBand, sourceTier, rulesEvidence[exploration - 1]);
  const sourced42 = (label, difficultyBand, sourceEvidence) => sourced(label, difficultyBand, "advanced", sourceEvidence);
  const sourceItem42 = (label, difficultyBand, sourceItemId, pdfPage, printedPage, reviewLocked = false) => ({
    ...sourced42(label, difficultyBand, `4-2 심화 PDF p.${pdfPage} · 교재 p.${printedPage} · ${sourceItemId}`),
    sourceItemId,
    sourceSection: sourceItemId.includes("mission") ? "mission" : sourceItemId.includes("example") ? "example" : "exploration",
    sourcePdfPage: pdfPage,
    sourcePrintedPage: printedPage,
    reviewLocked
  });
  const sourceItem42Ability = (label, difficultyBand, sourceItemId, pdfPage, printedPage, reviewLocked = false) => ({
    ...sourced(label, difficultyBand, "ability", `2026 생각하는 황소 실력 4-2 PDF p.${pdfPage} · 교재 p.${printedPage} · ${sourceItemId}`),
    sourceItemId,
    sourceSection: sourceItemId.includes("mission") ? "mission" : sourceItemId.includes("example") ? "example" : "exploration",
    sourcePdfPage: pdfPage,
    sourcePrintedPage: printedPage,
    reviewLocked
  });
  const sourceItem42ParallelAngle = (label, difficultyBand, sourceItemId, sourceItemLabel, reviewLocked = false, reviewReason = "") => ({
    ...sourceItem42(label, difficultyBand, sourceItemId, sourceItemId.includes("mission") ? 38 : 37, sourceItemId.includes("mission") ? 43 : 42, reviewLocked),
    sourceItemLabel,
    generationMode: reviewLocked ? "review-locked" : "fixed-verified-pool",
    verifiedVariantCount: reviewLocked ? 0 : 3,
    answerVisualRequired: true,
    answerVisualStatus: reviewLocked ? "locked" : "verified",
    reviewReason
  });
  const sourceItemLabel51 = sourceItemId => {
    const exploration = sourceItemId.match(/-e(\d+)-exploration(?:-(\d+))?$/);
    if (exploration) return `개념탐구 ${exploration[1]} 본문${exploration[2] ? ` (${exploration[2]})` : ""}`;
    const example = sourceItemId.match(/-example-(\d+(?:-\d+)*)$/)?.[1];
    if (example) return `예제 ${example}`;
    const mission = sourceItemId.match(/-mission-(\d+(?:-\d+)*)$/)?.[1];
    return mission ? `Mission ${mission}` : "";
  };
  const sourceItem51 = (label, difficultyBand, sourceItemId, pdfPage, printedPage, reviewLocked = false, reviewReason = "") => ({
    ...sourced(label, difficultyBand, "advanced", `5-1 심화 기준본 PDF p.${pdfPage} · 교재 p.${printedPage} · ${sourceItemId}`),
    sourceItemId,
    sourceItemLabel: sourceItemLabel51(sourceItemId),
    sourceSection: sourceItemId.includes("mission") ? "mission" : sourceItemId.includes("example") ? "example" : "exploration",
    sourcePdfPage: pdfPage,
    sourcePrintedPage: printedPage,
    reviewLocked,
    reviewReason
  });
  const factorMultipleLockReasons = {
    "5-1-u2-e5-example-5-4": "세 쌍의 최대공약수만으로 세 수의 최소공배수는 하나로 정해지지 않습니다. 예를 들어 (90, 36, 60)과 (630, 36, 60)은 같은 조건을 만족하지만 최소공배수가 다릅니다.",
    "5-1-u2-e5-mission-6": "공통으로 나누는 수가 정해지지 않아 세 수가 하나로 정해지지 않습니다. 몫이 2, 3, 5인 세 수는 공통 수에 따라 여러 가지가 됩니다.",
    "5-1-u2-e7-example-7-1": "원문 조건에는 학생 수가 7명과 14명인 경우가 모두 들어맞아 답이 하나로 정해지지 않습니다.",
    "5-1-u2-e7-mission-3": "원문 수를 계산하면 학생 수의 공약수는 3뿐이지만, 6개가 남으려면 학생 수가 6보다 커야 하므로 가능한 답이 없습니다.",
    "5-1-u2-e8-mission-6": "원문 조건에는 (가, 나, 다)=(7, 30, 50)과 (21, 10, 150)이 모두 들어맞아 세 수가 하나로 정해지지 않습니다."
  };
  const sourceItem52 = (label, sourceItemId, exploration, reviewLocked = exploration > 4) => {
    const pdfPage = 13 + (exploration - 1) * 2;
    const isMission = sourceItemId.includes("-mission-");
    const reviewedExploration = exploration === 5 || exploration === 7 || exploration === 8;
    const shouldLock = reviewedExploration ? Boolean(factorMultipleLockReasons[sourceItemId]) : exploration === 6 ? false : reviewLocked;
    const reviewReason = factorMultipleLockReasons[sourceItemId]
      ? factorMultipleLockReasons[sourceItemId]
      : "현행 원본 구조는 확인했지만, 항목별 계산과 단일 정답 검산 전에는 공개하지 않습니다.";
    return {
      ...sourceItem51(label, 1, sourceItemId, pdfPage + (isMission ? 1 : 0), pdfPage + 1 + (isMission ? 1 : 0), shouldLock,
        shouldLock ? reviewReason : "현행 원본 구조와 독립 계산 검산 완료"),
      sourceTier: "advanced"
    };
  };
  const correspondenceReadyIds = new Set([
    "5-1-u3-e1-exploration",
    "5-1-u3-e1-example-1-1",
    "5-1-u3-e1-example-1-2",
    "5-1-u3-e1-mission-1",
    "5-1-u3-e1-mission-2",
    "5-1-u3-e1-mission-4",
    "5-1-u3-e1-mission-5",
    "5-1-u3-e2-example-2-1",
    "5-1-u3-e2-example-2-2",
    "5-1-u3-e2-example-2-3",
    "5-1-u3-e2-mission-1",
    "5-1-u3-e2-mission-2",
    "5-1-u3-e2-mission-3",
    "5-1-u3-e2-mission-4",
    "5-1-u3-e2-mission-6",
    "5-1-u3-e3-exploration",
    "5-1-u3-e3-mission-1",
    "5-1-u3-e3-mission-2",
    "5-1-u3-e3-mission-3",
    "5-1-u3-e3-mission-4",
    "5-1-u3-e4-exploration",
    "5-1-u3-e4-example-4-1",
    "5-1-u3-e4-example-4-2",
    "5-1-u3-e4-example-4-3",
    "5-1-u3-e4-mission-1",
    "5-1-u3-e4-mission-2",
    "5-1-u3-e4-mission-3",
    "5-1-u3-e4-mission-4",
    "5-1-u3-e4-mission-5",
    "5-1-u3-e4-mission-6"
  ]);
  const correspondenceE1LockReasons = {
    "5-1-u3-e1-example-1-3": "도형 기호가 나타내는 숫자와 계산 기호의 위치를 원본 그림과 같은 점·선분 모델로 복원하기 전에는 출제하지 않습니다.",
    "5-1-u3-e1-example-1-4": "점과 선의 길이 차이와 날짜 부호를 PC·모바일·A4에서 판독할 수 있게 복원하기 전에는 출제하지 않습니다.",
    "5-1-u3-e1-mission-3": "도형 기호의 방향과 계산판의 연산 위치를 원본과 1:1로 복원하고 독립 계산하기 전에는 출제하지 않습니다.",
    "5-1-u3-e1-mission-6": "색칠한 모눈의 위치 규칙을 원본 격자 좌표로 모델링하고 답 유일성을 확인하기 전에는 출제하지 않습니다."
  };
  const correspondenceE2LockReasons = {
    "5-1-u3-e2-exploration": "두 수직선의 눈금과 연결선을 원본 점·선분 모델로 복원하고 표·관계식·값을 한 답 계약으로 검증하기 전에는 출제하지 않습니다.",
    "5-1-u3-e2-mission-5": "날짜별 표 완성과 대응 관계식 작성을 함께 채점할 수 있는 여러 칸 답 계약을 마련하기 전에는 출제하지 않습니다."
  };
  const correspondenceE3LockReasons = {
    "5-1-u3-e3-example-3-1": "겹쳐 그린 정사각형의 선분을 점·선분 모델로 복원하고, 크기가 다른 삼각형까지 빠짐없이 세는 검산을 마치기 전에는 출제하지 않습니다.",
    "5-1-u3-e3-example-3-2": "수정판 문제의 바둑돌 배열과 현재 답지의 그림이 서로 달라, 흰 돌과 검은 돌을 원문 배열에서 독립 계산하기 전에는 출제하지 않습니다.",
    "5-1-u3-e3-example-3-3": "붙인 정사각형의 행과 열이 늘어나는 규칙과 각 누름못의 위치를 격자 좌표로 복원하기 전에는 출제하지 않습니다.",
    "5-1-u3-e3-mission-5": "나열된 도형에서 크고 작은 삼각형을 점·선분 연결로 전수 열거하고 독립 계산하기 전에는 출제하지 않습니다.",
    "5-1-u3-e3-mission-6": "검은색과 흰색 타일의 위치 규칙을 칸 좌표로 복원하고 두 색의 개수를 독립 계산하기 전에는 출제하지 않습니다."
  };
  const sourceItem53 = (label, sourceItemId, exploration) => {
    const pdfPage = 31 + (exploration - 1) * 2;
    const isMission = sourceItemId.includes("-mission-");
    const ready = correspondenceReadyIds.has(sourceItemId);
    const reviewReason = correspondenceE1LockReasons[sourceItemId]
      || correspondenceE2LockReasons[sourceItemId]
      || correspondenceE3LockReasons[sourceItemId]
      || (ready
        ? "현행 원문 구조와 독립 계산 검산 완료"
        : "원문 문제 구조는 확인했지만, 대응 규칙과 그림·부호 조건을 독립 계산하고 답 하나가 되는지 검산하기 전에는 공개하지 않습니다.");
    return sourceItem51(
      label,
      1,
      sourceItemId,
      pdfPage + (isMission ? 1 : 0),
      pdfPage + 1 + (isMission ? 1 : 0),
      !ready,
      reviewReason
    );
  };
  const factorMultipleGroups = [
    ["약수와 배수", 1, [
      ["exploration-1", "모든 약수를 곱한 값과 원래 수의 관계"], ["exploration-2", "네 자리 수에서 어떤 수의 배수 개수"],
      ["example-1-1", "가장 큰 세 자리 약수"], ["example-1-2", "합이 어떤 수의 배수가 되는 두 자리 수 개수"], ["example-1-3", "나머지가 주어진 나눗셈의 나누는 수 개수"], ["example-1-4", "잘못 나눈 몫과 나머지로 원래 수 찾기"],
      ["mission-1", "한 자리 약수 모두 찾기"], ["mission-2", "기준값에 가장 가까운 배수 찾기"], ["mission-3", "여러 배수 카드를 차례로 빼고 남은 카드 세기"], ["mission-4", "나머지가 주어진 나눗셈의 나누는 수 모두 찾기"], ["mission-5", "곱셈식이 맞는 빈칸 숫자 찾기"], ["mission-6", "두 수로 나누어떨어지지 않는 수의 개수 차"]
    ]],
    ["공약수와 최대공약수", 2, [
      ["exploration", "두 수의 공약수를 직접 모두 찾기"], ["example-2-1-1", "최대공약수로 두 수의 공약수 모두 찾기"], ["example-2-1-2", "곱셈식으로 나타낸 두 수의 공약수 모두 찾기"], ["example-2-2", "최대공약수가 정해진 두 자리 수 모두 찾기"], ["example-2-3", "공약수 조건으로 자연수 찾기"], ["example-2-4", "최대공약수와 배수가 아닌 조건으로 가장 작은 수 찾기"],
      ["mission-1-1", "두 수의 공약수 개수 세기 ①"], ["mission-1-2", "두 수의 공약수 개수 세기 ②"], ["mission-1-3", "두 수의 공약수 개수 세기 ③"], ["mission-2", "어떤 수와 공약수가 1뿐인 수 세기"], ["mission-3", "최대공약수가 정해진 가장 큰 세 자리 수"], ["mission-4", "곱과 최대공약수로 순서 있는 두 수 쌍 세기"], ["mission-5", "남거나 부족한 나눗셈 조건으로 나누는 수 찾기"], ["mission-6", "최대공약수가 정해진 두 자리 수의 합"]
    ]],
    ["공배수와 최소공배수", 3, [
      ["exploration-1", "두 수의 공배수 중 기준값에 가장 가까운 수"], ["exploration-2", "최소공배수가 정해지게 하는 수의 개수"], ["example-3-1", "세 자리 공배수 개수"], ["example-3-2", "두 최대공약수 조건으로 가장 작은 수 찾기"], ["example-3-3", "한 수의 배수이지만 다른 수의 배수가 아닌 수 세기"], ["example-3-4", "연속한 세 수의 합이 배수가 되는 묶음 세기"],
      ["mission-1", "여러 최소공배수 값을 작은 순서로 놓기"], ["mission-2", "세 자리 공배수의 합"], ["mission-3", "한 수의 배수이지만 다른 수의 배수가 아닌 수 세기"], ["mission-4", "추가 나눗셈 조건이 있는 공배수 중 기준값에 가장 가까운 수"], ["mission-5", "최소공배수가 정해질 때 가능한 수 모두 찾기"], ["mission-6", "두 수 어느 것으로도 나누어떨어지지 않는 수 세기"]
    ]],
    ["배수 판정법", 4, [
      ["exploration", "전체 금액의 빈칸 숫자로 한 개 가격 모두 찾기"], ["example-4-1", "큰 합을 9로 나눈 나머지"], ["example-4-2", "7과 0으로만 만든 75의 가장 작은 배수"], ["example-4-3", "수 카드로 만든 세 자리 12의 배수 세기"], ["example-4-4", "되풀이 숫자로 만든 여섯 자리 6의 배수 세기"],
      ["mission-1", "목록에서 36의 배수 찾기"], ["mission-2", "수 카드로 만든 3 또는 4의 배수 세기"], ["mission-3", "네 자리 수가 9의 배수가 되는 빈칸 넣기"], ["mission-4", "되풀이 숫자로 만든 일곱 자리 12의 배수 세기"], ["mission-5", "8과 9로만 만든 수 중 네 번째로 큰 3의 배수"], ["mission-6", "덧셈 결과가 36의 배수가 되는 가장 큰 두 자리 빈칸"]
    ]],
    ["세 수의 최대공약수와 최소공배수", 5, [
      ["exploration", "세 수의 최대공약수와 최소공배수"], ["example-5-1-1", "세 수의 최대공약수와 최소공배수"], ["example-5-1-2", "곱셈식으로 나타낸 세 수의 최대공약수와 최소공배수"], ["example-5-2", "같은 수를 곱한 세 수의 최소공배수로 합 찾기"], ["example-5-3", "여러 수로 나누어떨어지는 여섯 자리 수의 빈칸"], ["example-5-4", "두 수씩의 최대공약수로 세 수의 최소공배수 찾기"],
      ["mission-1-1", "세 수의 최대공약수와 최소공배수"], ["mission-1-2", "세 수의 최대공약수와 최소공배수"], ["mission-1-3", "곱셈식으로 나타낸 세 수의 최대공약수와 최소공배수"], ["mission-2", "여러 수로 나눈 나머지가 같은 수 중 기준값에 가장 가까운 수"], ["mission-3", "세 수의 가장 작은 네 자리 공배수"], ["mission-4", "두 수로 나눈 나머지가 같은 범위 안의 수"], ["mission-5", "여러 수로 나누어떨어지는 여덟 자리 수의 빈칸"], ["mission-6", "몫과 최소공배수 조건으로 세 수 찾기"]
    ]],
    ["공배수의 활용", 6, [
      ["exploration", "서로 다른 주기의 전구가 함께 꺼지는 횟수"], ["example-6-1", "두 기차가 다음에 함께 출발하는 시각"], ["example-6-2", "더하고 뺀 수가 각각 배수가 되는 가장 작은 수"], ["example-6-3", "여러 나눗셈에서 일정하게 부족한 가장 작은 수"], ["example-6-4", "여러 톱니바퀴가 처음 자리에서 다시 만나는 회전 수"],
      ["mission-1", "여러 나머지 조건을 만족하며 기준값에 가장 가까운 수"], ["mission-2", "두 수로 나눈 나머지가 같은 고정 숫자 수의 빈칸"], ["mission-3", "10 큰 수와 10 작은 수가 각각 배수인 세 자리 수"], ["mission-4", "두 화분에 다시 함께 물 주는 요일"], ["mission-5", "톱니 수의 비와 최소공배수로 다시 맞물리는 회전 수"], ["mission-6", "세 기차가 함께 출발하는 횟수"]
    ]],
    ["공약수의 활용", 7, [
      ["exploration", "부족하거나 남는 물건을 똑같이 나눌 학생 수"], ["example-7-1", "남는 개수가 다른 과일을 똑같이 나눌 학생 수"], ["example-7-2", "직사각형 둘레에 가장 넓은 간격으로 심을 나무 수"], ["example-7-3", "직사각형을 채우는 가장 큰 정사각형 타일의 한 변"], ["example-7-4", "보호재를 넣은 상자를 채우는 가장 큰 정육면체의 모서리"],
      ["mission-1", "직선 도로에 같은 간격으로 세울 최소 표지판 수"], ["mission-2", "두 과일을 가장 많은 사람에게 똑같이 나누기"], ["mission-3", "부족하거나 남는 간식을 똑같이 나눌 학생 수"], ["mission-4", "직사각형 둘레에 같은 간격으로 세울 최소 가로등 수"], ["mission-5", "두 번째로 큰 정사각형으로 자른 조각 수"], ["mission-6", "가장 많은 같은 구성의 세트와 한 세트 가격"]
    ]],
    ["최대공약수와 최소공배수의 관계", 8, [
      ["exploration", "곱과 최대공약수로 차가 가장 작은 두 수와 최소공배수 찾기"], ["example-8-1", "최대공약수와 최소공배수로 가능한 두 수의 합 모두 찾기"], ["example-8-2", "곱과 최소공배수로 공약수의 합 찾기"], ["example-8-3", "최대공약수·최소공배수·차로 큰 수 찾기"], ["example-8-4", "여러 최대공약수와 최소공배수 조건으로 세 수 중 하나 찾기"],
      ["mission-1", "한 수와 최대공약수·최소공배수로 다른 수 찾기"], ["mission-2", "가장 큰 정사각형 조각과 가장 작은 정사각형 배열로 다른 변 찾기"], ["mission-3", "최대공약수와 최소공배수로 가능한 두 수의 합 모두 찾기"], ["mission-4", "최대공약수·최소공배수·차로 두 수 찾기"], ["mission-5", "두 쌍의 최대공약수와 최소공배수로 세 수의 합 찾기"], ["mission-6", "곱과 최대공약수·최소공배수로 세 수 찾기"]
    ]]
  ];
  const correspondenceGroups = [
    ["대응의 규칙", 1, [
      ["exploration", "알파벳을 일정한 만큼 옮긴 암호 풀기"], ["example-1-1", "상자 규칙으로 바뀐 수 찾기"], ["example-1-2", "말한 수에 따라 답하는 수의 규칙 찾기"], ["example-1-3", "기호 계산판으로 도형 수식의 값 구하기"], ["example-1-4", "점과 선으로 만든 부호에서 날짜 읽기"],
      ["mission-1", "두 번 바뀌는 상자 규칙으로 나온 수 찾기"], ["mission-2", "대응 규칙으로 큰 수에 짝인 수 찾기"], ["mission-3", "기호 계산판으로 도형식의 값 구하기"], ["mission-4", "계산기를 여러 번 눌러 1이 되는 수의 합 구하기"], ["mission-5", "자음과 모음 암호로 낱말 풀기"], ["mission-6", "색칠한 모눈의 규칙으로 나타낸 수 구하기"]
    ]],
    ["대응표와 대응 관계", 2, [
      ["exploration", "두 수직선의 연결 규칙으로 대응표와 식 완성하기"], ["example-2-1", "대응표의 두 수 관계를 식으로 나타내기"], ["example-2-2", "세 기호 대응표에서 처음 기호와 끝 기호의 관계 나타내기"], ["example-2-3", "가위바위보 이긴 횟수와 계단 수의 관계 나타내기"],
      ["mission-1", "대응표의 두 기호 관계와 큰 값의 짝 구하기"], ["mission-2", "세 기호 대응표에서 두 기호의 관계 나타내기"], ["mission-3", "세 줄 대응표에서 두 값의 합 구하기"], ["mission-4", "철사 길이와 직사각형 가로·세로의 관계 나타내기"], ["mission-5", "날짜와 줄넘기 횟수의 관계 나타내기"], ["mission-6", "깨진 도자기 수와 받은 돈의 관계 나타내기"]
    ]],
    ["규칙과 대응의 활용 ①", 3, [
      ["exploration", "직선 수와 나뉜 영역 수의 최대 관계 구하기"], ["example-3-1", "겹쳐 그린 정사각형 수와 삼각형 수의 관계 구하기"], ["example-3-2", "바둑돌 배열에서 흰 돌과 검은 돌 수의 차 구하기"], ["example-3-3", "붙인 정사각형 수와 나눔쪽 수의 관계 구하기"],
      ["mission-1", "직선 수와 만나는 점 수의 최대 관계 구하기"], ["mission-2", "계단 모양 배열 순서와 사각형 조각 수의 관계 구하기"], ["mission-3", "성냥개비 배열 순서와 가장 작은 정삼각형 수의 관계 구하기"], ["mission-4", "겹쳐 붙인 정사각형 수와 둘레의 관계 구하기"], ["mission-5", "나열된 도형 순서와 큰·작은 삼각형 수의 관계 구하기"], ["mission-6", "바깥쪽 길이와 색 타일 수의 차 구하기"]
    ]],
    ["규칙과 대응의 활용 ②", 4, [
      ["exploration", "지난 시간과 남은 초 길이의 관계로 시각 구하기"], ["example-4-1", "두 사람 나이의 관계로 현재 나이 구하기"], ["example-4-2", "물 넣는 시간과 가득 차는 시간의 관계 구하기"], ["example-4-3", "세 도시 시각의 관계로 전화할 시각 구하기"],
      ["mission-1", "어머니와 아들 나이의 관계로 몇 년 뒤 구하기"], ["mission-2", "탁자 수와 앉을 수 있는 사람 수의 관계 구하기"], ["mission-3", "원형 길과 나무 사이 거리로 둘레 구하기"], ["mission-4", "주차 시간과 요금의 관계 나타내기"], ["mission-5", "기온과 소리의 빠르기로 번개 친 곳까지 거리 구하기"], ["mission-6", "도시 시각과 동전 쌓는 시간으로 다른 도시 시각 구하기"]
    ]]
  ];

  const fractionReductionReadyIds = new Set([
    "5-1-u4-e1-exploration",
    "5-1-u4-e1-example-1-1",
    "5-1-u4-e1-example-1-2",
    "5-1-u4-e1-example-1-3",
    "5-1-u4-e1-example-1-4",
    "5-1-u4-e1-mission-1",
    "5-1-u4-e1-mission-2",
    "5-1-u4-e1-mission-3",
    "5-1-u4-e1-mission-4",
    "5-1-u4-e1-mission-5",
    "5-1-u4-e2-exploration",
    "5-1-u4-e2-example-2-1",
    "5-1-u4-e2-example-2-2",
    "5-1-u4-e2-example-2-3",
    "5-1-u4-e2-example-2-4",
    "5-1-u4-e2-mission-1",
    "5-1-u4-e2-mission-2",
    "5-1-u4-e2-mission-3",
    "5-1-u4-e2-mission-4",
    "5-1-u4-e2-mission-5",
    "5-1-u4-e2-mission-6",
    "5-1-u4-e3-exploration",
    "5-1-u4-e3-example-3-1",
    "5-1-u4-e3-example-3-2",
    "5-1-u4-e3-example-3-3",
    "5-1-u4-e3-example-3-4",
    "5-1-u4-e3-mission-1",
    "5-1-u4-e3-mission-2",
    "5-1-u4-e3-mission-3",
    "5-1-u4-e3-mission-4",
    "5-1-u4-e3-mission-5",
    "5-1-u4-e3-mission-6",
    "5-1-u4-e4-exploration",
    "5-1-u4-e4-example-4-1",
    "5-1-u4-e4-example-4-2",
    "5-1-u4-e4-example-4-3",
    "5-1-u4-e4-example-4-4",
    "5-1-u4-e4-mission-1",
    "5-1-u4-e4-mission-2",
    "5-1-u4-e4-mission-3",
    "5-1-u4-e4-mission-4",
    "5-1-u4-e4-mission-5",
    "5-1-u4-e4-mission-6"
  ]);
  const equalFractionE1LockReasons = {
    "5-1-u4-e1-mission-6": "원문 조건대로 같은 두 자리 자연수를 분자와 분모에서 빼면 그 수는 3이어야 하므로 조건을 만족하는 두 자리 자연수가 없습니다. 원문 또는 공식 답 근거가 바로잡히기 전에는 출제하지 않습니다."
  };
  const sourceItem54 = (label, sourceItemId, exploration) => {
    const pdfPage = 41 + (exploration - 1) * 2;
    const isMission = sourceItemId.includes("-mission-");
    const ready = fractionReductionReadyIds.has(sourceItemId);
    const reviewReason = equalFractionE1LockReasons[sourceItemId]
      || (ready ? "현행 원문 구조와 독립 계산 검산 완료" : "현행 원문을 문제 단위로 대조하고 답이 하나인지 검산하기 전에는 공개하지 않습니다.");
    return sourceItem51(
      label,
      1,
      sourceItemId,
      pdfPage + (isMission ? 1 : 0),
      pdfPage + 1 + (isMission ? 1 : 0),
      !ready,
      reviewReason
    );
  };
  const fractionReductionGroups = [
    ["크기가 같은 분수", 1, [
      ["exploration", "분모와 분자에 두 자리 수를 더해 같은 분수 만들기"],
      ["example-1-1", "두 분수식에서 기호가 나타내는 분수 구하기"],
      ["example-1-2", "같은 크기의 분수가 처음 나오는 자리 찾기"],
      ["example-1-3", "분모를 더하고 뺀 조건으로 처음 분수 구하기"],
      ["example-1-4", "분자와 분모에서 수를 뺀 뒤 크기가 같은 분수 구하기"],
      ["mission-1", "분자와 분모에 같은 수를 더해 목표 분수 만들기"],
      ["mission-2", "분자와 분모의 합과 바꾼 분수로 처음 분수 찾기"],
      ["mission-3", "분모를 더하고 뺀 두 분수 조건으로 처음 분수 찾기"],
      ["mission-4", "두 기호의 곱으로 같은 크기의 분수 만드는 짝 세기"],
      ["mission-5", "분자와 분모가 함께 바뀌는 수열에서 자리 찾기"],
      ["mission-6", "같은 두 자리 수를 분자와 분모에서 빼는 조건 살펴보기"]
    ]],
    ["약분과 기약분수", 2, [
      ["exploration", "약분할 수 있는 수의 개수와 기약분수 만드는 수 구하기"],
      ["example-2-1", "약분한 분자가 1이 되는 원래 분자 세기"],
      ["example-2-2", "분모가 정해진 진분수 중 약분되는 분수 세기"],
      ["example-2-3", "규칙적인 기약분수 수열에서 두 항의 자리 찾기"],
      ["example-2-4", "분모가 정해진 기약분수를 나열해 큰 자리의 수 찾기"],
      ["mission-1", "최대공약수와 최소공배수로 차가 가장 작은 분수 찾기"],
      ["mission-2", "분자와 분모를 바꾸고 약분한 조건으로 처음 분수 찾기"],
      ["mission-3", "분모가 정해진 기약 진분수 세기"],
      ["mission-4", "분모에 같은 수를 곱해 분자를 1로 만드는 수 찾기"],
      ["mission-5", "약분한 분모가 정해진 세 자리 분자 세기"],
      ["mission-6", "합과 약분 뒤 조건으로 처음 가분수 찾기"]
    ]],
    ["통분과 분수의 크기 비교", 3, [
      ["exploration", "분자와 분모의 규칙을 보고 여러 분수의 크기 비교하기"],
      ["example-3-1", "두 분수 사이를 똑같이 나눈 네 분수 찾기"],
      ["example-3-2", "기준 분수에 가까운 순서로 여러 분수 놓기"],
      ["example-3-3", "두 분수의 분자에 곱할 수의 합이 가장 작게 하기"],
      ["example-3-4", "분자와 분모가 규칙적으로 바뀌는 분수 수열 비교하기"],
      ["mission-1", "세 분수를 큰 수부터 차례로 놓기"],
      ["mission-2", "통분하기 전 세 분수의 분모 합 구하기"],
      ["mission-3", "여러 가분수 중 자연수에 가장 가까운 분수 찾기"],
      ["mission-4", "두 분수 사이에 있는 분수의 개수로 분모 찾기"],
      ["mission-5", "분자가 연속하도록 두 분수 사이에 다섯 분수 넣기"],
      ["mission-6", "같은 수가 들어간 분수가 기준보다 커지는 가장 작은 수 찾기"]
    ]],
    ["조건에 맞는 분수 찾기", 4, [
      ["exploration", "두 분수 사이에서 분자가 정해진 분수 모두 찾기"],
      ["example-4-1", "두 분수 사이에서 짝수 분모인 기약분수 모두 찾기"],
      ["example-4-2", "두 분수 사이에서 분자가 정해진 기약분수 세기"],
      ["example-4-3", "분자가 정해진 분수 중 기준에 가장 가까운 분수 찾기"],
      ["example-4-4", "두 소수 사이에서 분모가 정해진 기약분수 세기"],
      ["mission-1", "두 분수 사이에 들어가는 분모의 합 구하기"],
      ["mission-2", "두 분수 사이에서 분모가 정해진 분수 세기"],
      ["mission-3", "차가 가장 크게 되는 두 빈 분모 찾기"],
      ["mission-4", "두 조건 분수 사이에서 분자와 분모 차가 1인 분수 찾기"],
      ["mission-5", "같은 분모인 두 분수 사이에서 분자가 정해진 분수 세기"],
      ["mission-6", "분자가 정해진 분수 중 기준에 가장 가까운 분수 찾기"]
    ]]
  ];

  const fractionAddSubReadyIds = new Set([
    "5-1-u5-e1-exploration-proper-addition",
    "5-1-u5-e1-exploration-mixed-addition",
    "5-1-u5-e1-example-1-1-1",
    "5-1-u5-e1-example-1-1-2",
    "5-1-u5-e1-example-1-1-3",
    "5-1-u5-e1-example-1-2",
    "5-1-u5-e1-example-1-3",
    "5-1-u5-e1-example-1-4",
    "5-1-u5-e1-mission-1-proper-two-term",
    "5-1-u5-e1-mission-1-mixed-two-term",
    "5-1-u5-e1-mission-1-proper-three-term",
    "5-1-u5-e1-mission-2",
    "5-1-u5-e1-mission-3",
    "5-1-u5-e1-mission-4",
    "5-1-u5-e1-mission-5",
    "5-1-u5-e1-mission-6",
    "5-1-u5-e2-exploration-1",
    "5-1-u5-e2-exploration-2",
    "5-1-u5-e2-exploration-3",
    "5-1-u5-e2-exploration-4",
    "5-1-u5-e2-example-2-1",
    "5-1-u5-e2-example-2-2",
    "5-1-u5-e2-example-2-3",
    "5-1-u5-e2-example-2-4",
    "5-1-u5-e2-mission-1-1",
    "5-1-u5-e2-mission-1-2",
    "5-1-u5-e2-mission-1-3-4",
    "5-1-u5-e2-mission-1-5",
    "5-1-u5-e2-mission-2",
    "5-1-u5-e2-mission-3",
    "5-1-u5-e2-mission-4",
    "5-1-u5-e2-mission-5",
    "5-1-u5-e2-mission-6",
    "5-1-u5-e3-exploration",
    "5-1-u5-e3-example-3-1",
    "5-1-u5-e3-example-3-2",
    "5-1-u5-e3-example-3-3",
    "5-1-u5-e3-example-3-4",
    "5-1-u5-e3-mission-1",
    "5-1-u5-e3-mission-2",
    "5-1-u5-e3-mission-3",
    "5-1-u5-e3-mission-4",
    "5-1-u5-e3-mission-5",
    "5-1-u5-e3-mission-6",
    "5-1-u5-e4-exploration-2",
    "5-1-u5-e4-example-4-1",
    "5-1-u5-e4-example-4-2",
    "5-1-u5-e4-example-4-3",
    "5-1-u5-e4-example-4-4",
    "5-1-u5-e4-mission-1",
    "5-1-u5-e4-mission-2",
    "5-1-u5-e4-mission-3",
    "5-1-u5-e4-mission-4",
    "5-1-u5-e4-mission-6"
  ]);
  const fractionAddSubMultipleAnswerReasons = {
    "5-1-u5-e4-exploration-1": "원문 조건을 만족하는 세 단위분수 표현이 여러 개이므로, 답을 하나로 정하는 추가 조건 없이 자동 출제하지 않습니다.",
    "5-1-u5-e4-mission-5": "원문 조건을 만족하는 세 단위분수 표현이 두 개이므로, 답을 하나로 정하는 추가 조건 없이 자동 출제하지 않습니다."
  };
  const sourceItem55 = (label, sourceItemId, pdfPage, printedPage) => {
    const ready = fractionAddSubReadyIds.has(sourceItemId);
    const multipleAnswerReason = fractionAddSubMultipleAnswerReasons[sourceItemId];
    return {
      ...sourceItem51(
        label,
        1,
        sourceItemId,
        pdfPage,
        printedPage,
        !ready,
        multipleAnswerReason || (ready
          ? "현행 원문 구조와 독립 계산 검산 완료"
          : "현행 원문 구조와 답은 확인했지만 전용 생성기와 독립 검산을 연결하기 전에는 공개하지 않습니다.")
      ),
      sourceTier: "advanced"
    };
  };
  const fractionAddSubGroups = [
    ["분수의 덧셈", "fractionAdditionE1", [
      ["5-1-u5-e1-exploration-proper-addition", "분모가 다른 진분수 두 개 더하기", 51, 52],
      ["5-1-u5-e1-exploration-mixed-addition", "분모가 다른 대분수 두 개 더하기", 51, 52],
      ["5-1-u5-e1-example-1-1-1", "여러 분수와 대분수를 통분하여 더하기", 51, 52],
      ["5-1-u5-e1-example-1-1-2", "분모가 같은 항끼리 묶어 더하기", 51, 52],
      ["5-1-u5-e1-example-1-1-3", "분모별 분수 묶음의 규칙을 찾아 더하기", 51, 52],
      ["5-1-u5-e1-example-1-2", "수 카드로 만든 두 대분수의 합을 가장 크게 하기", 51, 52],
      ["5-1-u5-e1-example-1-3", "두 수도꼭지로 일정한 양의 물을 받는 시간 구하기", 51, 52],
      ["5-1-u5-e1-example-1-4", "분모 조건에 맞는 두 기약분수의 덧셈식 세기", 51, 52],
      ["5-1-u5-e1-mission-1-proper-two-term", "분모가 다른 진분수 두 항 더하기", 52, 53],
      ["5-1-u5-e1-mission-1-mixed-two-term", "분모가 다른 대분수 두 항 더하기", 52, 53],
      ["5-1-u5-e1-mission-1-proper-three-term", "분모가 다른 진분수 세 항 더하기", 52, 53],
      ["5-1-u5-e1-mission-2", "두 분수 사이를 열 등분한 양 끝 분수의 합 구하기", 52, 53],
      ["5-1-u5-e1-mission-3", "두 대분수의 합과 사이 자연수의 개수로 빈칸 구하기", 52, 53],
      ["5-1-u5-e1-mission-4", "서로 다른 한 자리 소수로 만든 두 분수의 합을 가장 작게 하기", 52, 53],
      ["5-1-u5-e1-mission-5", "네 기약분수의 합이 가장 작은 자연수가 되게 하기", 52, 53],
      ["5-1-u5-e1-mission-6", "분모별 분수 묶음과 자연수 1을 함께 더하기", 52, 53]
    ]],
    ["분수의 뺄셈", "fractionSubtractionE2", [
      ["5-1-u5-e2-exploration-1", "분모가 다른 진분수 빼기", 53, 54],
      ["5-1-u5-e2-exploration-2", "분모가 다른 진분수 세 항을 차례로 계산하기", 53, 54],
      ["5-1-u5-e2-exploration-3", "대분수에서 대분수 빼기", 53, 54],
      ["5-1-u5-e2-exploration-4", "대분수에서 대분수 두 개를 차례로 빼기", 53, 54],
      ["5-1-u5-e2-example-2-1", "분수를 골라 더하고 뺀 값이 가장 크게 하기", 53, 54],
      ["5-1-u5-e2-example-2-2", "같은 차로 나열된 대분수의 빈칸 채우기", 53, 54],
      ["5-1-u5-e2-example-2-3", "두 가지를 모두 좋아하지 않는 학생의 비율 구하기", 53, 54],
      ["5-1-u5-e2-example-2-4", "구멍이 있는 물통을 두 수도꼭지로 채우기", 53, 54],
      ["5-1-u5-e2-mission-1-1", "분모가 다른 진분수 세 항 계산하기", 54, 55],
      ["5-1-u5-e2-mission-1-2", "자연수에서 대분수를 빼고 진분수 더하기", 54, 55],
      ["5-1-u5-e2-mission-1-3-4", "대분수 세 항을 더하고 빼기", 54, 55],
      ["5-1-u5-e2-mission-1-5", "괄호가 있는 대분수 덧셈과 뺄셈", 54, 55],
      ["5-1-u5-e2-mission-2", "여러 분수 중 가장 큰 수와 가장 작은 수의 차 구하기", 54, 55],
      ["5-1-u5-e2-mission-3", "물을 반 사용한 뒤 빈 물통의 무게 구하기", 54, 55],
      ["5-1-u5-e2-mission-4", "분수 계산식의 빈칸 채우기", 54, 55],
      ["5-1-u5-e2-mission-5", "가로·세로·대각선의 합이 같은 분수 표 풀기", 54, 55],
      ["5-1-u5-e2-mission-6", "수 카드로 만든 두 대분수의 차를 가장 크게 하기", 54, 55]
    ]],
    ["분수의 덧셈과 뺄셈 활용", "fractionApplicationE3", [
      ["5-1-u5-e3-exploration", "정육면체 각 면의 네 수의 합을 같게 만들기", 55, 56],
      ["5-1-u5-e3-example-3-1", "여러 기간을 더해 전체 나이 구하기", 55, 56],
      ["5-1-u5-e3-example-3-2", "차와 합을 이용해 세 수 구하기", 55, 56],
      ["5-1-u5-e3-example-3-3", "팔고 남은 양으로 처음 개수 구하기", 55, 56],
      ["5-1-u5-e3-example-3-4", "막대가 젖은 길이로 연못 깊이 구하기", 55, 56],
      ["5-1-u5-e3-mission-1", "세 사람이 나눈 사탕의 처음 개수 구하기", 56, 57],
      ["5-1-u5-e3-mission-2", "여러 빈칸에 같은 수를 넣어 식 완성하기", 56, 57],
      ["5-1-u5-e3-mission-3", "사과와 배의 수로 전체 과일 구하기", 56, 57],
      ["5-1-u5-e3-mission-4", "걸은 거리와 탄 거리로 전체 거리 구하기", 56, 57],
      ["5-1-u5-e3-mission-5", "두 과목을 좋아하는 학생 수로 전체 구하기", 56, 57],
      ["5-1-u5-e3-mission-6", "서로 다른 숫자로 분수식 완성하기", 56, 57]
    ]],
    ["단위분수와 부분분수", "unitFractionE4", [
      ["5-1-u5-e4-exploration-1", "분수를 서로 다른 세 단위분수의 합으로 나타내기", 57, 58],
      ["5-1-u5-e4-exploration-2", "규칙에 따라 나열한 분수의 합 계산하기", 57, 58],
      ["5-1-u5-e4-example-4-1", "세 분모를 찾아 단위분수 식 완성하기", 57, 58],
      ["5-1-u5-e4-example-4-2", "두 분모의 합이 정해진 단위분수의 합을 가장 작게 하기", 57, 58],
      ["5-1-u5-e4-example-4-3", "짝지은 수의 차를 이용해 단위분수 더하기", 57, 58],
      ["5-1-u5-e4-example-4-4", "분수열의 규칙을 찾아 많은 항 더하기", 57, 58],
      ["5-1-u5-e4-mission-1", "규칙을 찾아 여러 분수 더하기", 58, 59],
      ["5-1-u5-e4-mission-2", "두 분수 사이에 있는 단위분수 세기", 58, 59],
      ["5-1-u5-e4-mission-3", "두 단위분수의 차로 두 분모 찾기", 58, 59],
      ["5-1-u5-e4-mission-4", "범위 안의 두 분모를 찾아 식 완성하기", 58, 59],
      ["5-1-u5-e4-mission-5", "분수를 서로 다른 세 단위분수의 합으로 나타내기", 58, 59],
      ["5-1-u5-e4-mission-6", "여섯 단위분수 중 네 개를 골라 1 만들기", 58, 59]
    ]]
  ];

  const semester = (id, units) => ({
    id,
    grade: Number(id[0]),
    term: Number(id[2]),
    label: `${id[0]}학년 ${id[2]}학기`,
    units: units.map((unit, unitIndex) => {
      let typeNumber = 0;
      return {
        id: `${id}-u${unitIndex + 1}`,
        number: unitIndex + 1,
        name: unit[0],
        subunits: unit.slice(1).map((entry, subunitIndex) => {
          const definition = typeof entry === "string" ? { name: entry } : entry;
          const typeDefinitions = definition.types?.length ? definition.types : [{ name: definition.name, label: "핵심 유형" }];
          return {
            id: `${id}-u${unitIndex + 1}-s${subunitIndex + 1}`,
            number: subunitIndex + 1,
            name: definition.name,
            types: typeDefinitions.map((type, typeIndex) => ({
              id: type.id || `${id}-u${unitIndex + 1}-t${subunitIndex + 1}${typeIndex ? `-${typeIndex + 1}` : ""}`,
              number: typeIndex + 1,
              typeNumber: ++typeNumber,
              name: type.name || type.label || definition.name,
              label: type.label || type.name || "핵심 유형",
              generatorKey: type.generatorKey || "",
              variant: Number.isInteger(type.variant) ? type.variant : undefined,
              difficultyBand: Number.isInteger(type.difficultyBand) ? type.difficultyBand : 0,
              sourceTier: type.sourceTier || "advanced",
              sourceVerified: Boolean(type.sourceVerified),
              ...(type.answerVerification ? { answerVerification: type.answerVerification, publisherKeyVerified: type.publisherKeyVerified } : {}),
              sourceEvidence: type.sourceEvidence || "",
              sourceItemId: type.sourceItemId || "",
              sourceItemLabel: type.sourceItemLabel || "",
              sourceSection: type.sourceSection || "",
              sourcePdfPage: Number.isInteger(type.sourcePdfPage) ? type.sourcePdfPage : undefined,
              sourcePrintedPage: Number.isInteger(type.sourcePrintedPage) ? type.sourcePrintedPage : undefined,
              reviewLocked: Boolean(type.reviewLocked),
              reviewReason: type.reviewReason || type.reviewLockReason || "",
              generationMode: type.generationMode || "",
              implementationStatus: type.implementationStatus || "",
              verifiedVariantTarget: Number.isInteger(type.verifiedVariantTarget) ? type.verifiedVariantTarget : undefined,
              verifiedVariantCount: Number.isInteger(type.verifiedVariantCount) ? type.verifiedVariantCount : undefined,
              verifiedVariantProvenance: Array.isArray(type.verifiedVariantProvenance) ? [...type.verifiedVariantProvenance] : undefined,
              answerVisualRequired: Boolean(type.answerVisualRequired),
              answerVisualStatus: type.answerVisualStatus || "",
              status: type.status || ""
            }))
          };
        })
      };
    })
  });

  const perimeterAreaGenerator51 = new Map([
    ["5-1-u6-e2-example-2-1", "source51RectangleTriangleAreaE2"],
    ["5-1-u6-e3-exploration-3", "source51TriangleAreaInteriorE3"],
    ["5-1-u6-e3-exploration-4", "source51TriangleAreaExteriorE3"],
    ["5-1-u6-e3-example-3-1", "source51OverlappingParallelogramsE3"],
    ["5-1-u6-e3-mission-2", "source51ParallelogramTileArrayE3"],
    ["5-1-u6-e4-exploration-trapezoid", "source51TrapezoidAreaE4"],
    ["5-1-u6-e4-exploration-rhombus", "source51RhombusAreaE4"],
    ["5-1-u6-e4-example-4-1", "source51TrapezoidShadedRatioHeightE4"],
    ["5-1-u6-e4-example-4-3", "source51RhombusRectangleOverlapE4"],
    ["5-1-u6-e4-example-4-4", "source51MovingPointTrapezoidE4"]
  ]);
  const perimeterAreaReadyIds51 = new Set(perimeterAreaGenerator51.keys());

  const lockedPerimeterAreaGroup51 = (name, exploration, firstPdfPage, items) => {
    const group = detailed(name, "", items.map(([suffix, label, sourceItemLabel]) => {
      const sourceItemId = `5-1-u6-e${exploration}-${suffix}`;
      const isMission = suffix.startsWith("mission-");
      const isReady = perimeterAreaReadyIds51.has(sourceItemId);
      return {
        ...sourceItem51(
          label,
          1,
          sourceItemId,
          firstPdfPage + (isMission ? 1 : 0),
          firstPdfPage + 1 + (isMission ? 1 : 0),
          !isReady,
          isReady
            ? "원문 그림 구조와 넓이 관계를 독립 계산으로 확인했습니다."
            : "원문 문항과 유형은 확인했지만, 같은 구조의 문제·정답 그림과 독립 검산기가 모두 갖춰질 때까지 출제하지 않습니다."
        ),
        ...(sourceItemLabel ? { sourceItemLabel } : {}),
        ...(isReady ? {
          generationMode: "fixed-verified-pool",
          verifiedVariantCount: 3,
          answerVisualRequired: true,
          answerVisualStatus: "verified"
        } : {})
      };
    }));
    group.types.forEach(type => {
      if (perimeterAreaReadyIds51.has(type.sourceItemId)) type.generatorKey = perimeterAreaGenerator51.get(type.sourceItemId);
    });
    return group;
  };

  const perimeterAreaPendingGroups51 = [
    lockedPerimeterAreaGroup51("직사각형과 직각삼각형의 넓이", 2, 63, [
      ["exploration-1", "점 네 개로 1cm² 정사각형 그리기", "개념탐구 2 (1)"],
      ["exploration-2", "점 네 개로 2cm² 정사각형 그리기", "개념탐구 2 (2)"],
      ["exploration-3", "점 네 개로 5cm² 정사각형 그리기", "개념탐구 2 (3)"],
      ["exploration-4", "점 네 개로 8cm² 정사각형 그리기", "개념탐구 2 (4)"],
      ["exploration-5", "점 네 개로 10cm² 정사각형 그리기", "개념탐구 2 (5)"],
      ["example-2-1", "넓이가 같도록 나눈 길이 찾기"],
      ["example-2-2", "겹친 색종이의 넓이 비교"],
      ["example-2-3", "가로와 세로를 1.5배 해 넓이 구하기"],
      ["example-2-4", "같은 줄의 넓이 관계로 빈칸 구하기"],
      ["mission-1", "직사각형을 바꿔 만든 정사각형 넓이 구하기"],
      ["mission-2", "블록 무늬로 지갑 넓이 알아보기"],
      ["mission-3", "칸 넓이로 색칠한 도형 넓이 구하기"],
      ["mission-4", "겹친 세 직사각형의 색칠 넓이 찾기"],
      ["mission-5", "주변 칸 넓이로 빈칸 넓이 찾기"],
      ["mission-6", "작은 조각 넓이로 큰 직사각형 넓이 구하기"]
    ]),
    lockedPerimeterAreaGroup51("평행사변형과 삼각형의 넓이", 3, 65, [
      ["exploration-1", "1cm 칸을 세어 평행사변형 넓이 구하기", "개념탐구 3 안내 (1)"],
      ["exploration-2", "1cm 칸을 세어 다른 평행사변형 넓이 구하기", "개념탐구 3 안내 (2)"],
      ["exploration-3", "밑변과 안쪽 높이로 삼각형 넓이 구하기", "개념탐구 3 안내 (3)"],
      ["exploration-4", "바깥으로 내려온 높이로 삼각형 넓이 구하기", "개념탐구 3 안내 (4)"],
      ["example-3-1", "큰 도형에서 색칠한 넓이를 빼서 삼각형 넓이 찾기"],
      ["example-3-2", "평행사변형 둘레와 삼각형 둘레의 차 구하기"],
      ["example-3-3", "두 높이로 변의 길이를 찾고 둘레에서 빼기"],
      ["example-3-4", "조건이 더 필요한 사각형 넓이 문제 확인하기"],
      ["mission-1", "합동인 삼각형이 겹친 색칠 넓이 구하기"],
      ["mission-2", "평행사변형 조각 18개의 전체 넓이 구하기"],
      ["mission-3", "겹친 평행사변형에서 선분 길이 찾기"],
      ["mission-4", "여러 길이를 이용해 사각형 넓이 나누어 구하기"],
      ["mission-5", "두 평행사변형 넓이의 차 구하기"],
      ["mission-6", "두 높이로 한 변을 찾아 삼각형 둘레 완성하기"]
    ]),
    lockedPerimeterAreaGroup51("사다리꼴과 마름모의 넓이", 4, 67, [
      ["exploration-trapezoid", "두 밑변과 높이로 사다리꼴 넓이 구하기", "개념탐구 4 안내 사다리꼴"],
      ["exploration-rhombus", "두 대각선으로 마름모 넓이 구하기", "개념탐구 4 안내 마름모"],
      ["example-4-1", "색칠 넓이 비로 사다리꼴 속 높이 찾기"],
      ["example-4-2", "여러 삼각형으로 나눈 마름모의 색칠 넓이 구하기"],
      ["example-4-3", "겹친 넓이 비로 마름모의 긴 대각선 찾기"],
      ["example-4-4", "움직이는 점으로 사다리꼴 넓이 비율 맞추기"],
      ["mission-1", "가운데점을 이어 반복한 마름모의 색칠 넓이 구하기"],
      ["mission-2", "사다리꼴 위의 점 비율로 삼각형 넓이 구하기"],
      ["mission-3", "사다리꼴 넓이 비로 겹친 마름모 넓이 찾기"],
      ["mission-4", "대각선이 같은 마름모 세 개의 색칠 넓이 구하기"],
      ["mission-5", "정사각형 안 색칠 부분 넓이 구하기"],
      ["mission-6", "움직인 직사각형과 사다리꼴의 겹친 넓이 구하기"]
    ]),
    lockedPerimeterAreaGroup51("복잡한 도형의 넓이", 5, 69, [
      ["exploration", "모눈을 세어 복잡한 도형의 넓이 구하기"],
      ["example-5-1", "네 정사각형 위 대각선 위쪽 넓이 더하기"],
      ["example-5-2", "다섯 칸 중 색칠된 대각선 위쪽 넓이 구하기"],
      ["example-5-3", "닮은 직각삼각형으로 빠진 가로 길이 찾기"],
      ["example-5-4", "삼각형과 사다리꼴 넓이 연결하기"],
      ["mission-1", "모눈 도형에서 흰 구멍을 빼고 넓이 구하기"],
      ["mission-2", "크기가 다른 네 칸의 대각선 위쪽 넓이 더하기"],
      ["mission-3-na", "정사각형 옆 띠 모양의 넓이 구하기", "Mission 3 (나)"],
      ["mission-3-da", "정사각형 꼭짓점 옆 작은 삼각형 넓이 구하기", "Mission 3 (다)"],
      ["mission-4", "붙어 있는 평행사변형과 마름모 넓이 더하기"],
      ["mission-5", "두 대각선 사이 색칠 띠의 넓이 구하기"],
      ["mission-6", "연장선과 교점으로 삼각형 넓이 더하기"]
    ]),
    lockedPerimeterAreaGroup51("넓이의 활용", 6, 71, [
      ["exploration", "폭이 같은 길을 잘라 낸 종이의 남은 넓이"],
      ["example-6-1", "같은 넓이 삼각형으로 직사각형 가로 길이 찾기"],
      ["example-6-2", "네 모서리를 잘라 만든 가운데 정사각형 넓이"],
      ["example-6-3", "꼭짓점과 변의 중점을 이어 가운데 정사각형 넓이 구하기"],
      ["example-6-4", "색칠된 가운데 사각형의 넓이 찾기"],
      ["mission-1", "공원 길을 빼고 색칠된 잔디 넓이 더하기"],
      ["mission-2", "정원 전체에서 길 넓이를 빼기"],
      ["mission-3", "네 모서리 쪽을 잘라 남은 넓이 구하기"],
      ["mission-4", "정사각형에서 네 흰 삼각형을 빼기"],
      ["mission-5", "정사각형 다섯 칸의 넓이 더하기"],
      ["mission-6", "주변 삼각형 넓이로 가운데 색칠 사각형 찾기"]
    ])
  ];

  const semesters = [
    semester("4-1", [
      ["큰 수",
        detailed("큰 수 알아보기", "largeNumberPlaceValue", [
          sourced("자리 숫자가 나타내는 값의 차 구하기", -1, "ability"),
          sourced("큰 수를 합으로 나타낸 식의 빈칸", 0, "advanced"),
          sourced("확대·축소한 수의 자릿값 배수 관계", 1, "advanced-contest-overlap")
        ]),
        detailed("큰 수의 크기 비교", "largeNumberCompare", [
          sourced("두 부등식에 공통으로 들어갈 숫자의 합", 1, "advanced-contest-overlap"),
          sourced("서로 다른 표현의 큰 수 크기 비교", 0, "advanced"),
          sourced("부등식을 만족하는 가장 큰 숫자", -1, "ability")
        ]),
        detailed("큰 수의 규칙성과 뛰어 세기", "largeNumberSkipPattern", [
          sourced("일정하게 뛰어 센 특정 번째 수", 0, "advanced"),
          sourced("같은 간격 수직선의 두 수 구하기", -1, "ability"),
          sourced("잘못 뛰어 센 횟수 바로잡기", 1, "advanced-contest-overlap")
        ]),
        detailed("큰 수의 활용", "largeNumberApplication", [
          sourced("금액을 가장 적은 지폐·수표로 바꾸기", 0, "advanced"),
          sourced("자연수를 이어 쓴 수의 마지막 자리", 1, "advanced-contest-overlap"),
          sourced("같은 물체를 쌓은 높이와 단위 환산", 0, "advanced-contest-overlap")
        ]),
        detailed("조건에 맞는 수 찾기", "conditionedNumber", [
          sourced("범위와 자리 조건을 만족하는 수의 개수", 1, "advanced-contest-overlap"),
          sourced("두 자리를 바꾼 수의 차로 숫자 찾기", 1, "advanced-contest-overlap"),
          sourced("여러 자리 조건을 만족하는 가장 큰 수", 0, "advanced")
        ]),
        detailed("수 카드로 수 만들기", "digitCardNumber", [
          sourced("기준 수에 가장 가까운 수 만들기", 0, "advanced"),
          sourced("중복 수 카드로 몇 번째 큰 수 만들기", 1, "advanced-contest-overlap"),
          sourced("0을 포함한 가장 큰 수와 작은 수의 차", -1, "ability")
        ])
      ],
      ["각도",
        detailed("여러 각도", "multiAngle", [
          sourcedAngle("여러 반직선으로 만들 수 있는 각의 수", 0, "advanced"),
          sourcedAngle("같은 간격 반직선의 예각과 둔각 세기", 1, "advanced-contest-overlap"),
          sourcedAngle("반직선을 더 그었을 때 늘어나는 각", 0, "advanced")
        ]),
        detailed("각도의 계산", "angleCalculation", [
          sourcedAngle("한 직선 위 같은 크기인 두 각", -1, "ability"),
          sourcedAngle("한 점 둘레의 남은 각 구하기", -1, "ability"),
          sourcedAngle("맞꼭지각을 나눈 각 구하기", 0, "advanced")
        ]),
        detailed("다각형의 내각의 합", "polygonInterior", [
          sourcedAngle("다각형의 빠진 한 내각", -1, "ability"),
          sourcedAngle("크기가 같은 두 내각 구하기", 0, "advanced"),
          sourcedAngle("표시한 두 내각의 합 구하기", 0, "advanced")
        ]),
        detailed("다각형의 외각의 성질", "polygonExterior", [
          sourcedAngle("다각형의 빠진 한 외각", -1, "ability"),
          sourcedAngle("크기가 같은 두 외각 구하기", 0, "advanced"),
          sourcedAngle("오각별의 뾰족한 각 구하기", 1, "advanced-contest-overlap")
        ]),
        detailed("내각과 외각의 성질의 활용", "interiorExteriorApplication", [
          sourcedAngle("종이를 접어 생긴 각 구하기", 0, "advanced"),
          sourcedAngle("정사각형을 돌려 생긴 각 구하기", -1, "ability"),
          sourcedAngle("정다각형의 외각으로 내각 구하기", 0, "advanced")
        ]),
        detailed("시침과 분침 사이의 각도", "clockAngle", [
          sourcedAngle("주어진 시각의 시침과 분침 사이 각", 1, "advanced-contest-overlap"),
          sourcedAngle("분침이 움직인 각도로 시간 구하기", -1, "ability"),
          sourcedAngle("같은 시간 동안 두 바늘의 이동각 차", 0, "advanced")
        ])
      ],
      ["곱셈과 나눗셈",
        detailed("곱셈 알아보기", "multiplicationUnderstanding", [
          sourcedMultiplyDivide("전체 수에서 사용한 수 빼기", -1, "ability"),
          sourcedMultiplyDivide("같은 움직임을 여러 번 반복한 거리", -1, "ability"),
          sourcedMultiplyDivide("간격과 개수로 전체 길이 구하기", 0, "advanced")
        ]),
        detailed("곱셈 응용 문제", "multiplicationApplication", [
          sourcedMultiplyDivide("99를 곱하는 식을 분배법칙으로 계산", -1, "ability"),
          sourcedMultiplyDivide("공통인 수를 묶어 계산하기", 0, "advanced"),
          sourcedMultiplyDivide("여러 수를 곱한 결과의 자릿수", 1, "advanced-contest-overlap")
        ]),
        detailed("나눗셈 알아보기", "divisionUnderstanding", [
          sourcedMultiplyDivide("양 끝에 놓인 물체의 개수", 0, "advanced"),
          sourcedMultiplyDivide("묶음 수와 판매 금액으로 단가 구하기", 0, "advanced"),
          sourcedMultiplyDivide("기계 한 대의 작업량으로 전체 구하기", 1, "advanced-contest-overlap")
        ]),
        detailed("나눗셈 응용 문제", "divisionApplication", [
          sourcedMultiplyDivide("나눗셈의 몫의 각 자리 숫자 합", -1, "ability"),
          sourcedMultiplyDivide("값이 같은 두 곱셈식의 빈칸", 0, "advanced"),
          sourcedMultiplyDivide("연속한 자연수의 합으로 큰 수 찾기", 1, "advanced-contest-overlap")
        ]),
        detailed("나눗셈의 나머지", "advancedRemainder", [
          sourcedMultiplyDivide("같은 나머지를 갖는 수의 범위", 0, "advanced"),
          sourcedMultiplyDivide("잘못 나눈 계산의 나머지 바로잡기", 1, "advanced-contest-overlap"),
          sourcedMultiplyDivide("나눗셈식에서 몫과 나머지의 합", -1, "ability")
        ]),
        detailed("곱셈식 완성하기", "multiplicationCompletion", [
          sourcedMultiplyDivide("세로셈에서 곱해지는 수의 빈칸", 0, "advanced"),
          sourcedMultiplyDivide("부분곱으로 곱하는 수의 빈칸", 1, "advanced-contest-overlap"),
          sourcedMultiplyDivide("세로셈 결과의 빈칸 숫자", -1, "ability")
        ])
      ],
      ["평면도형의 이동",
        detailed("평면도형 밀기, 뒤집기, 돌리기", "planeTransform", [
          sourcedMovement("밀기 후 점의 위치 찾기", -1, "ability", 1),
          sourcedMovement("뒤집기 후 점의 위치 찾기", 0, "advanced", 1),
          sourcedMovement("돌리기 후 점의 위치 찾기", 0, "advanced", 1)
        ]),
        detailed("연속 이동", "sequentialTransform", [
          sourcedMovement("돌리기와 좌우 뒤집기를 이어서 하기", 0, "advanced", 2),
          sourcedMovement("돌리기와 위아래 뒤집기를 이어서 하기", 0, "advanced", 2),
          sourcedMovement("묶음 이동을 반복한 뒤 방향 찾기", 1, "advanced-contest-overlap", 2)
        ]),
        detailed("평면도형 이동의 활용 ①", "movementPatternOne", [
          sourcedMovement("반복 무늬의 N번째 모양 찾기", -1, "ability", 3),
          sourcedMovement("반복 무늬에서 특정 모양의 개수 구하기", 0, "advanced", 3),
          sourcedMovement("연속한 두 위치의 모양 찾기", 1, "advanced-contest-overlap", 3)
        ]),
        detailed("평면도형 이동의 활용 ②", "movementPatternTwo", [
          sourcedMovement("전자 숫자 카드를 180° 돌려 읽기", 0, "advanced", 4),
          sourcedMovement("거울에 비친 시계의 실제 시각 찾기", 1, "advanced-contest-overlap", 4),
          sourcedMovement("180° 돌린 수와 처음 수의 차 구하기", 1, "advanced-contest-overlap", 4)
        ])
      ],
      ["막대그래프",
        detailed("막대그래프의 이해", "barGraphUnderstanding", [
          sourcedBarGraph("전체 수로 빠진 막대의 값 구하기", -1, "ability", 1),
          sourcedBarGraph("비율 조건으로 숨은 막대의 값 구하기", 0, "advanced", 1),
          sourcedBarGraph("합과 차로 숨은 두 막대의 값 구하기", 1, "advanced-contest-overlap", 1)
        ]),
        detailed("막대그래프의 활용", "barGraphApplication", [
          sourcedBarGraph("거리 막대그래프로 왕복 시간 구하기", 0, "advanced", 2),
          sourcedBarGraph("두 항목 막대그래프 비교하기", 0, "advanced", 2),
          sourcedBarGraph("막대그래프와 단가로 전체 금액 구하기", 1, "advanced-contest-overlap", 2)
        ])
      ],
      ["규칙 찾기",
        detailed("일렬로 나열한 수에서 규칙 찾기", "advancedLinePattern", [
          sourcedRules("일정하게 커지는 수열의 N번째 수", -1, "ability", 1),
          sourcedRules("두 규칙이 번갈아 나타나는 수열", 0, "advanced", 1),
          sourcedRules("분자와 분모가 각각 변하는 분수 수열", 1, "advanced-contest-overlap", 1)
        ]),
        detailed("여러 가지 배열에서 수들의 규칙", "arrayNumberRules", [
          sourcedRules("뱀 모양 배열의 지정 위치 수", 0, "advanced", 2),
          sourcedRules("삼각 배열에서 N번째 줄의 끝 수", -1, "ability", 2),
          sourcedRules("뱀 모양 배열에서 수의 위치 역산", 1, "advanced-contest-overlap", 2)
        ]),
        detailed("배열된 수들의 합", "advancedArraySum", [
          sourcedRules("일정한 간격으로 나열된 수의 합", 0, "advanced", 3),
          sourcedRules("연속한 홀수의 합에서 가장 큰 수", 1, "advanced-contest-overlap", 3),
          sourcedRules("3×3 연속한 수의 합과 가장 큰 수", 1, "advanced-contest-overlap", 3)
        ]),
        detailed("연산의 규칙", "advancedOperationRule", [
          sourcedRules("한 가지 기호 연산의 규칙", -1, "ability", 4),
          sourcedRules("두 가지 기호 연산을 차례로 계산", 0, "advanced", 4),
          sourcedRules("세 꼭짓점 수와 가운데 수의 규칙", 1, "advanced-contest-overlap", 4)
        ]),
        detailed("나열된 도형에서의 규칙", "advancedShapePattern", [
          sourcedRules("이어 붙인 다각형의 성냥개비 수", -1, "ability", 5),
          sourcedRules("성냥개비 수로 만들 수 있는 도형 수", 0, "advanced", 5),
          sourcedRules("이어 붙인 입체 상자의 성냥개비 수", 1, "advanced-contest-overlap", 5),
          sourcedRules("점과 선으로 커지는 정사각형의 점 수", 0, "advanced", 5),
          sourcedRules("소용돌이 모양 점 배열의 점 수", 1, "advanced-contest-overlap", 5),
          sourcedRules("육각형으로 퍼지는 바둑돌의 수", 1, "advanced-contest-overlap", 5),
          sourcedRules("점으로 이은 정사각형 수 역산", 1, "advanced-contest-overlap", 5),
          sourcedRules("두 종류 동전 배열의 전체 금액", 0, "advanced", 5)
        ]),
        detailed("조건을 만족하는 수의 개수", "conditionedNumberCount", [
          sourcedRules("수 카드로 만든 범위 안의 배수 개수", 1, "advanced-contest-overlap", 6),
          sourcedRules("연속한 수를 쓸 때 특정 숫자의 사용 횟수", 0, "advanced", 6),
          sourcedRules("일정한 배수에서 특정 숫자의 사용 횟수", 1, "advanced-contest-overlap", 6)
        ])
      ]
    ]),
    semester("4-2", [
      ["분수의 덧셈과 뺄셈",
        detailed("분수의 이해", "fractionUnderstanding", [
          sourceItem42("남은 돈으로 처음 가진 돈 거꾸로 구하기", 0, "4-2-fraction-1-exploration", 2, 6),
          sourceItem42("사탕을 차례로 나누어 준 뒤 처음 개수 구하기", 0, "4-2-fraction-1-example-1", 2, 6),
          sourceItem42("분수와 개수 차로 세 사람의 공깃돌 수 구하기", 1, "4-2-fraction-1-example-2", 2, 6),
          sourceItem42("날마다 남은 돈의 일부를 쓴 뒤 사용액 차 구하기", 1, "4-2-fraction-1-example-3", 2, 6),
          sourceItem42("두 막대가 잠긴 길이로 물의 깊이 구하기", 0, "4-2-fraction-1-example-4", 2, 6),
          sourceItem42("언니와 동생의 나이 차를 분수로 나타내기", -1, "4-2-fraction-1-mission-1", 3, 7),
          sourceItem42("전체의 분수보다 더 많은 흰 구슬과 검은 구슬", 0, "4-2-fraction-1-mission-2", 3, 7),
          sourceItem42("돈을 쓰고 받은 과정을 거꾸로 풀어 처음 돈 구하기", 0, "4-2-fraction-1-mission-3", 3, 7),
          sourceItem42("흰 공을 더 넣은 뒤 바뀐 전체 공 수 구하기", 0, "4-2-fraction-1-mission-4", 3, 7),
          sourceItem42("빈 물통과 물의 무게로 물을 채운 물통 무게 구하기", 1, "4-2-fraction-1-mission-5", 3, 7),
          sourceItem42("가진 돈의 분수로 산 같은 샤프의 가격 구하기", 0, "4-2-fraction-1-mission-6", 3, 7)
        ]),
        detailed("분수의 종류와 크기 비교", "advancedFractionCompare", [
          sourceItem42("나눗셈을 분수로 나타내어 3에 가까운 순서 정하기", 0, "4-2-fraction-2-exploration", 4, 8),
          sourceItem42("수 카드 두 장으로 만들 수 있는 가분수 세기", 0, "4-2-fraction-2-example-1", 4, 8),
          sourceItem42("몫과 나머지가 정해진 가장 큰 가분수 찾기", 0, "4-2-fraction-2-example-2", 4, 8),
          sourceItem42("같은 곱을 만드는 세 수의 크기 비교하기", 0, "4-2-fraction-2-example-3", 4, 8),
          sourceItem42("분모가 같은 대분수의 빈칸 경우 세기", 1, "4-2-fraction-2-example-4", 4, 8),
          sourceItem42("수 카드 다섯 장으로 가장 큰·작은 대분수 만들기", 1, "4-2-fraction-2-mission-1", 5, 9),
          sourceItem42("수 카드 세 장으로 8에 가장 가까운 대분수 만들기", 1, "4-2-fraction-2-mission-2", 5, 9),
          sourceItem42("분자와 분모에 수를 곱한 뒤 가분수 되는 분수 찾기", 1, "4-2-fraction-2-mission-3", 5, 9),
          sourceItem42("같은 수가 들어간 대분수를 가분수로 나타내기", 0, "4-2-fraction-2-mission-4", 5, 9),
          sourceItem42("분자 차가 정해진 세 가분수를 대분수로 나타내기", 1, "4-2-fraction-2-mission-5", 5, 9),
          sourceItem42("나머지와 홀짝 조건에 맞는 가분수 세기", 1, "4-2-fraction-2-mission-6", 5, 9)
        ]),
        detailed("분수의 덧셈과 뺄셈 1", "fractionAddSubOneAdvanced", [
          sourceItem42("같은 분모의 여섯 식을 계산해 답 쓰기", 0, "4-2-fraction-3-exploration", 6, 10),
          sourceItem42("두 거리의 합과 차로 사이 거리 구하기", 0, "4-2-fraction-3-example-1", 6, 10),
          sourceItem42("정사각형 철사 남은 길이의 차 구하기", 0, "4-2-fraction-3-example-2", 6, 10),
          sourceItem42("연결된 같은 분모 덧셈의 빈칸 채우기", 0, "4-2-fraction-3-example-3", 6, 10),
          sourceItem42("약속 기호를 두 번 계산한 값 구하기", 1, "4-2-fraction-3-example-4", 6, 10),
          sourceItem42("네 분수 계산 결과를 큰 순서로 정하기", 0, "4-2-fraction-3-mission-1", 7, 11),
          sourceItem42("세 사람의 수영 연습 시간을 모두 더하기", 0, "4-2-fraction-3-mission-2", 7, 11),
          sourceItem42("겹친 거리와 전체 거리로 사이 거리 구하기", 1, "4-2-fraction-3-mission-3", 7, 11),
          sourceItem42("낮의 길이로 밤과 낮의 차 구하기", 0, "4-2-fraction-3-mission-4", 7, 11),
          sourceItem42("수업 시간과 쉬는 시간으로 끝 시각 구하기", 0, "4-2-fraction-3-mission-5", 7, 11),
          sourceItem42("두 약속 계산 결과의 차 구하기", 1, "4-2-fraction-3-mission-6", 7, 11)
        ]),
        detailed("분수의 덧셈과 뺄셈 2", "fractionAddSubTwoAdvanced", [
          sourceItem42("두 규칙으로 늘어나는 대분수 열 개의 합", 1, "4-2-fraction-4-exploration", 8, 12),
          sourceItem42("일직선으로 겹쳐 붙인 테이프의 전체 길이", 0, "4-2-fraction-4-example-1", 8, 12),
          sourceItem42("일정하게 타는 양초의 남은 길이", 0, "4-2-fraction-4-example-2", 8, 12),
          sourceItem42("늦어지는 시계와 빨라지는 시계의 차", 1, "4-2-fraction-4-example-3", 8, 12),
          sourceItem42("양쪽에서 젖은 막대로 연못의 깊이", 1, "4-2-fraction-4-example-4", 8, 12),
          sourceItem42("두 마을 학생과 나머지로 전체 학생 수", 0, "4-2-fraction-4-mission-1", 9, 13),
          sourceItem42("마신 주스의 무게로 빈 병의 무게", 0, "4-2-fraction-4-mission-2", 9, 13),
          sourceItem42("고리로 겹쳐 붙인 테이프의 둘레", 1, "4-2-fraction-4-mission-3", 9, 13),
          sourceItem42("분자 사이 관계와 합으로 분자의 곱", 1, "4-2-fraction-4-mission-4", 9, 13),
          sourceItem42("하루와 열두 시간 기준 두 시계의 차", 1, "4-2-fraction-4-mission-5", 9, 13),
          sourceItem42("홀수째와 짝수째 규칙이 다른 대분수의 합", 1, "4-2-fraction-4-mission-6", 9, 13)
        ]),
        detailed("조건에 맞는 분수 찾기", "conditionedFraction", [
          sourceItem42("묶음이 하나씩 길어지는 분수 수열의 두 항", 1, "4-2-fraction-5-exploration", 10, 14),
          sourceItem42("분자 범위와 차로 뺄셈식의 개수 세기", 0, "4-2-fraction-5-example-1", 10, 14),
          sourceItem42("첫째와 셋째 수로 같은 간격의 여섯째 수", 0, "4-2-fraction-5-example-2", 10, 14),
          sourceItem42("대분수 뺄셈에서 분자 합이 가장 큰 경우", 1, "4-2-fraction-5-example-3", 10, 14),
          sourceItem42("연속한 분자의 합으로 같은 분모 구하기", 1, "4-2-fraction-5-example-4", 10, 14),
          sourceItem42("대분수 부등식의 분자 빈칸 경우 세기", 0, "4-2-fraction-5-mission-1", 11, 15),
          sourceItem42("합이 자연수가 되는 분자 순서쌍 세기", 0, "4-2-fraction-5-mission-2", 11, 15),
          sourceItem42("두 수의 합과 차를 목표 수에 가장 가깝게 만들기", 1, "4-2-fraction-5-mission-3", 11, 15),
          sourceItem42("분자와 분모가 함께 늘어나는 수열의 빈칸", 0, "4-2-fraction-5-mission-4", 11, 15),
          sourceItem42("짝수 분자를 이어 더한 식의 같은 분모", 1, "4-2-fraction-5-mission-5", 11, 15),
          sourceItem42("묶음 안에서 분수가 줄어드는 수열의 두 항 합", 1, "4-2-fraction-5-mission-6", 11, 15)
        ]),
        detailed("식 세워 풀기", "fractionWordEquation", [
          sourceItem42("세 사람의 몸무게 관계로 가운데 사람 몸무게 구하기", 1, "4-2-fraction-6-exploration", 12, 16),
          sourceItem42("괄호가 두 번 있는 분수식의 빈칸 구하기", 0, "4-2-fraction-6-example-1", 12, 16),
          sourceItem42("두 분수의 합과 차로 큰 수와 작은 수 구하기", 0, "4-2-fraction-6-example-2", 12, 16),
          sourceItem42("공을 꺼낸 상자 무게로 공 한 개 든 상자 구하기", 0, "4-2-fraction-6-example-3", 12, 16),
          sourceItem42("세 수의 두 수씩 합으로 세 수 각각 구하기", 1, "4-2-fraction-6-example-4", 12, 16),
          sourceItem42("분모가 다른 합과 차로 두 대분수 구하기", 1, "4-2-fraction-6-mission-1", 13, 17),
          sourceItem42("서로 다르게 잘못 계산한 분수식을 바로잡기", 1, "4-2-fraction-6-mission-2", 13, 17),
          sourceItem42("합과 배수와 차의 관계로 세 분수 구하기", 1, "4-2-fraction-6-mission-3", 13, 17),
          sourceItem42("세 무게의 두 수씩 합으로 몇 배인지 구하기", 1, "4-2-fraction-6-mission-4", 13, 17),
          sourceItem42("같은 기호가 든 두 분수식의 자연수 구하기", 1, "4-2-fraction-6-mission-5", 13, 17),
          sourceItem42("같은 기호로 나눈 선분에서 남은 길이 구하기", 1, "4-2-fraction-6-mission-6", 13, 17)
        ])
      ],
      ["삼각형",
        detailed("삼각형의 개수", "triangleCount", [
          sourceItem42("부채꼴 선 배열의 삼각형 세기", 0, "4-2-triangle-1-mission-1", 16, 21),
          sourceItem42("정사각형 대각선 배열의 삼각형 세기", 0, "4-2-triangle-1-mission-2", 16, 21),
          sourceItem42("표시한 점을 포함하는 삼각형 세기", 0, "4-2-triangle-1-mission-3", 16, 21),
          sourceItem42("분할된 부채꼴의 삼각형 세기", 1, "4-2-triangle-1-mission-4", 16, 21),
          sourceItem42("교차선 도형의 삼각형 세기", 1, "4-2-triangle-1-mission-5", 16, 21),
          sourceItem42("여러 부채꼴이 겹친 삼각형 세기", 1, "4-2-triangle-1-mission-6", 16, 21),
          sourceItem42("불규칙 선 배열의 모든 삼각형", 1, "4-2-triangle-1-exploration", 15, 20),
          sourceItem42("별 모양 삼각 격자의 삼각형 세기", 0, "4-2-triangle-1-example-1", 15, 20),
          sourceItem42("색칠한 삼각형을 포함하는 삼각형", 1, "4-2-triangle-1-example-2", 15, 20),
          sourceItem42("두 선 배열에서 삼각형 각각 세기", 1, "4-2-triangle-1-example-3", 15, 20),
          sourceItem42("큰 삼각형 내부의 모든 삼각형", 1, "4-2-triangle-1-example-4", 15, 20, true)
        ]),
        detailed("예각삼각형, 직각삼각형, 둔각삼각형", "triangleAngleType", [
          sourceItem42("둔각삼각형 개수로 가능한 값 찾기", 0, "4-2-triangle-2-mission-1", 18, 23, true),
          sourceItem42("별 모양의 예각·둔각삼각형 세기", 0, "4-2-triangle-2-mission-2", 18, 23),
          sourceItem42("두 각을 골라 둔각삼각형 만드는 방법", 1, "4-2-triangle-2-mission-3", 18, 23),
          sourceItem42("모눈 도형의 둔각삼각형 세기", 1, "4-2-triangle-2-mission-4", 18, 23),
          sourceItem42("예각과 둔각삼각형 수의 차", 1, "4-2-triangle-2-mission-5", 18, 23),
          sourceItem42("점판에서 직각삼각형 세기", 1, "4-2-triangle-2-mission-6", 18, 23, true),
          sourceItem42("점판에 서로 다른 둔각삼각형 그리기", 0, "4-2-triangle-2-exploration", 17, 22),
          sourceItem42("정삼각형을 나누어 둔각삼각형 만들기", 0, "4-2-triangle-2-example-1", 17, 22, true),
          sourceItem42("선분 도형의 예각·둔각삼각형 세기", 0, "4-2-triangle-2-example-2", 17, 22),
          sourceItem42("직각 표시 도형의 직각삼각형 세기", 0, "4-2-triangle-2-example-3", 17, 22, true),
          sourceItem42("각 두 개를 골라 둔각삼각형 만드는 방법", 1, "4-2-triangle-2-example-4", 17, 22)
        ]),
        detailed("이등변삼각형", "isoscelesTriangle", [
          sourceItem42("맞붙인 이등변삼각형의 둘레", 0, "4-2-triangle-3-mission-1", 20, 25),
          sourceItem42("같은 길이 선분이 있는 각 구하기", 0, "4-2-triangle-3-mission-2", 20, 25, true),
          sourceItem42("여러 이등변삼각형을 이은 둘레", 0, "4-2-triangle-3-mission-3", 20, 25),
          sourceItem42("이등변삼각형을 이어 만든 각", 1, "4-2-triangle-3-mission-4", 20, 25, true),
          sourceItem42("접은 이등변삼각형의 각", 1, "4-2-triangle-3-mission-5", 20, 25, true),
          sourceItem42("원 위 점으로 이등변삼각형 만들기", 1, "4-2-triangle-3-mission-6", 20, 25),
          sourceItem42("직선을 추가해 이등변삼각형 최대로 만들기", 1, "4-2-triangle-3-exploration", 19, 24, true),
          sourceItem42("점판에서 서로 다른 이등변삼각형 세기", 1, "4-2-triangle-3-example-1", 19, 24, true),
          sourceItem42("이등변삼각형 띠의 짧은 변 구하기", 0, "4-2-triangle-3-example-2", 19, 24),
          sourceItem42("연속한 이등변삼각형의 각 구하기", 1, "4-2-triangle-3-example-3", 19, 24, true),
          sourceItem42("접은 이등변삼각형의 각 구하기", 1, "4-2-triangle-3-example-4", 19, 24, true)
        ]),
        detailed("정삼각형", "equilateralTriangle", [
          sourceItem42("정삼각형을 이어 만든 도형의 둘레", 0, "4-2-triangle-4-mission-1", 22, 27),
          sourceItem42("정삼각형 안의 정사각형에서 각 구하기", 0, "4-2-triangle-4-mission-2", 22, 27),
          sourceItem42("정삼각형이 이어진 도형의 각", 1, "4-2-triangle-4-mission-3", 22, 27),
          sourceItem42("정삼각형이 이어진 도형의 길이와 각", 1, "4-2-triangle-4-mission-4", 22, 27),
          sourceItem42("이어진 정삼각형의 선분 길이", 1, "4-2-triangle-4-mission-5", 22, 27),
          sourceItem42("정삼각형과 사다리꼴의 선분 길이", 1, "4-2-triangle-4-mission-6", 22, 27),
          sourceItem42("성냥개비 2개를 옮겨 만든 서로 다른 모양", 1, "4-2-triangle-4-exploration", 21, 26),
          sourceItem42("길이가 같은 세 변을 이용해 각 구하기", 0, "4-2-triangle-4-example-1", 21, 26),
          sourceItem42("길이가 같은 세 선분과 직각을 이용해 각 구하기", 0, "4-2-triangle-4-example-2", 21, 26),
          sourceItem42("이어 붙인 정삼각형에서 색칠된 한 변 구하기", 1, "4-2-triangle-4-example-3", 21, 26),
          sourceItem42("직사각형을 접어 만든 정삼각형의 선분 길이 합", 1, "4-2-triangle-4-example-4", 21, 26)
        ])
      ],
      ["소수의 덧셈과 뺄셈",
        detailed("소수의 이해", "decimalUnderstanding", [
          sourceItem42("기준 수에 가까운 소수 순서", 0, "4-2-decimal-1-mission-1", 26, 31),
          sourceItem42("수직선 두 소수의 자리 숫자 합", 0, "4-2-decimal-1-mission-2", 26, 31),
          sourceItem42("순서가 정해진 소수의 빈 자리 숫자", 1, "4-2-decimal-1-mission-3", 26, 31),
          sourceItem42("그림 사이의 같은 간격 구하기", 0, "4-2-decimal-1-mission-4", 26, 31),
          sourceItem42("일정하게 타는 양초의 남은 시간", 0, "4-2-decimal-1-mission-5", 26, 31),
          sourceItem42("원형 길에서 두 사람이 걸은 거리 차", 1, "4-2-decimal-1-mission-6", 26, 31),
          sourceItem42("기준 무게에서 10배의 몸무게 거꾸로 구하기", 0, "4-2-decimal-1-exploration", 25, 30),
          sourceItem42("복명수와 소수의 단위 환산", -1, "4-2-decimal-1-example-1", 25, 30, true),
          sourceItem42("두 소수 사이의 가장 작은·큰 소수", 0, "4-2-decimal-1-example-2", 25, 30, true),
          sourceItem42("도형을 움직인 수직선의 위치", 0, "4-2-decimal-1-example-3", 25, 30, true),
          sourceItem42("일정하게 타는 양초의 전체 시간", 0, "4-2-decimal-1-example-4", 25, 30, true)
        ]),
        detailed("소수의 덧셈과 뺄셈", "decimalAddSubAdvanced", [
          sourceItem42("겹친 두 선분의 길이", 0, "4-2-decimal-2-mission-1", 28, 33),
          sourceItem42("여러 소수 계산값의 순서", 0, "4-2-decimal-2-mission-2", 28, 33),
          sourceItem42("약속 기호가 있는 소수 계산", 1, "4-2-decimal-2-mission-3", 28, 33),
          sourceItem42("직선 위 네 사람의 거리 관계", 0, "4-2-decimal-2-mission-4", 28, 33),
          sourceItem42("공통 부등식을 만족하는 소수 세기", 1, "4-2-decimal-2-mission-5", 28, 33),
          sourceItem42("겹친 원의 영역별 소수 추론", 1, "4-2-decimal-2-mission-6", 28, 33),
          sourceItem42("서로 다른 빠르기의 달리기 시간 차", 0, "4-2-decimal-2-exploration", 27, 32, true),
          sourceItem42("두 계산식 사이의 소수 한 자리 수", 0, "4-2-decimal-2-example-1", 27, 32, true),
          sourceItem42("가려진 계산식의 가장 작은 소수", 1, "4-2-decimal-2-example-2", 27, 32, true),
          sourceItem42("직선 위 네 사람 사이의 거리", 0, "4-2-decimal-2-example-3", 27, 32, true),
          sourceItem42("규칙에 따라 늘어놓은 소수의 합", 0, "4-2-decimal-2-example-4", 27, 32, true)
        ]),
        detailed("소수의 덧셈과 뺄셈 활용", "decimalApplication", [
          sourceItem42("일정한 규칙의 소수 수열", 0, "4-2-decimal-3-mission-1", 30, 35),
          sourceItem42("소수점을 빠뜨린 계산 바로잡기", 0, "4-2-decimal-3-mission-2", 30, 35),
          sourceItem42("같은 소수를 여러 번 더한 값", 0, "4-2-decimal-3-mission-3", 30, 35),
          sourceItem42("합과 차로 두 소수 구하기", 0, "4-2-decimal-3-mission-4", 30, 35),
          sourceItem42("세 소수의 두 수씩 합", 1, "4-2-decimal-3-mission-5", 30, 35),
          sourceItem42("서로 다른 빠르기로 걸은 거리", 0, "4-2-decimal-3-mission-6", 30, 35),
          sourceItem42("등차 소수 수열의 특정 번째 수", 0, "4-2-decimal-3-exploration", 29, 34, true),
          sourceItem42("세 사람의 두 수씩 합으로 차 구하기", 0, "4-2-decimal-3-example-1", 29, 34, true),
          sourceItem42("같은 두께 책을 쌓은 전체 높이", -1, "4-2-decimal-3-example-2", 29, 34, true),
          sourceItem42("거리표에서 두 지점 사이 거리", 0, "4-2-decimal-3-example-3", 29, 34, true),
          sourceItem42("세 막대의 합과 차로 길이 차 구하기", 1, "4-2-decimal-3-example-4", 29, 34, true)
        ]),
        detailed("조건에 맞는 소수", "conditionedDecimal", [
          sourceItem42("자리값을 바꾼 두 수의 차", 1, "4-2-decimal-4-mission-1", 32, 37),
          sourceItem42("자릿수 합 조건의 소수 세기", 1, "4-2-decimal-4-mission-2", 32, 37),
          sourceItem42("소수 두 자리의 크기 관계", 1, "4-2-decimal-4-mission-3", 32, 37),
          sourceItem42("자리 숫자의 비가 정해진 소수", 1, "4-2-decimal-4-mission-4", 32, 37),
          sourceItem42("수 카드로 만든 소수의 순서", 1, "4-2-decimal-4-mission-5", 32, 37),
          sourceItem42("두 자리 숫자를 바꾼 소수의 범위", 1, "4-2-decimal-4-mission-6", 32, 37),
          sourceItem42("범위 안의 소수 네 자리 수 세기", 0, "4-2-decimal-4-exploration", 31, 36),
          sourceItem42("자리값이 다른 두 수의 차로 자연수 구하기", 1, "4-2-decimal-4-example-1", 31, 36, true),
          sourceItem42("서로 다른 숫자의 소수식 최댓값", 1, "4-2-decimal-4-example-2", 31, 36, true),
          sourceItem42("수 카드로 만든 소수의 순위 차", 1, "4-2-decimal-4-example-3", 31, 36, true),
          sourceItem42("수 카드로 만든 소수의 차 조건", 1, "4-2-decimal-4-example-4", 31, 36, true)
        ])
      ],
      ["사각형",
        detailed("수선과 평행선", "quadPerpParallelDistance", [
          sourceItem42Ability("수직인 두 직선의 쌍 세기", -1, "4-2-quad-1-exploration-1", 38, 40),
          sourceItem42Ability("평행인 두 직선의 쌍 세기", -1, "4-2-quad-1-exploration-3", 38, 40),
          { label: "비로 주어진 평행선 사이 거리", reviewLocked: true },
          sourceItem42Ability("연속한 수선으로 전체 거리 구하기", 0, "4-2-quad-1-example-1-4", 38, 40),
          sourceItem42Ability("전체 거리에서 수선의 빈 길이 구하기", 1, "4-2-quad-1-example-1-3", 38, 40),
          sourceItem42Ability("두 선분을 가고 왼쪽으로 돈 시간", 1, "4-2-quad-1-mission-6", 39, 41),
          sourceItem42Ability("45도 사다리꼴의 평행선 사이 거리", 0, "4-2-quad-1-example-1-2", 38, 40),
          sourceItem42Ability("길이를 늘려 반시계로 그은 두 선분 사이 거리", 1, "4-2-quad-1-mission-3", 39, 41),
          sourceItem42Ability("수직인 두 직선 사이의 두 각 구하기", 0, "4-2-quad-1-mission-1", 39, 41),
          sourceItem42Ability("조건에 맞게 다섯 직선 이름 정하기", 1, "4-2-quad-1-mission-4", 39, 41)
        ]),
        detailed("평행선의 조건과 성질", "quadParallelAngleCondition", [
          sourceItem42ParallelAngle("표시한 두 각의 합 비교하기", -1, "4-2-advanced-quad-2-exploration", "개념탐구 2 본문"),
          sourceItem42ParallelAngle("여러 직선에서 평행한 두 쌍과 표시각 구하기", 1, "4-2-advanced-quad-2-example-2-1", "예제 2-1", true, "원문 (3)·(4)에서 동위각과 엇각을 세는 범위를 공식 답과 대조하기 전에는 한 문제 전체를 출제하지 않습니다."),
          sourceItem42ParallelAngle("같은 크기의 각을 모두 세기", 1, "4-2-advanced-quad-2-example-2-2", "예제 2-2", true, "직선 사의 기울기 조건이 없어 같은 크기의 각 개수가 그림에 따라 달라질 수 있으므로 출제하지 않습니다."),
          sourceItem42Ability("평행선 사이 두 각으로 바깥각 구하기", 0, "4-2-quad-2-example-2-1", 40, 42),
          sourceItem42ParallelAngle("두 평행선에 걸친 네 각의 합 구하기", 0, "4-2-advanced-quad-2-example-2-3", "예제 2-3"),
          sourceItem42ParallelAngle("평행선과 세 빗선에서 두 각의 합 구하기", 0, "4-2-advanced-quad-2-example-2-4", "예제 2-4"),
          sourceItem42ParallelAngle("평행선과 나란한 선분을 이용해 각 구하기", 0, "4-2-advanced-quad-2-mission-1", "Mission 1"),
          sourceItem42ParallelAngle("평행선과 수직선에서 두 각의 차 구하기", 1, "4-2-advanced-quad-2-mission-2", "Mission 2"),
          sourceItem42ParallelAngle("표시된 각을 비교해 평행한 두 직선 찾기", 0, "4-2-advanced-quad-2-mission-3", "Mission 3"),
          sourceItem42ParallelAngle("한 각의 동위각을 모두 찾아 합하기", 1, "4-2-advanced-quad-2-mission-4", "Mission 4"),
          sourceItem42ParallelAngle("두 쌍의 평행선에서 표시각 구하기", 0, "4-2-advanced-quad-2-mission-5", "Mission 5"),
          sourceItem42ParallelAngle("수직선과 평행한 빗선에서 큰 각 구하기", 0, "4-2-advanced-quad-2-mission-6", "Mission 6")
        ]),
        detailed("평행선 사이의 각도 ①", "quadAngleChainOne", [
          sourced42("한 번 꺾인 선의 끝각", -1, "4-2 심화 p.39-40 개념탐구 3·Mission"),
          sourced42("두 번 꺾인 선의 끝각", 0, "4-2 심화 p.39-40 개념탐구 3·Mission"),
          sourced42("바깥각이 섞인 꺾은선", 1, "4-2 심화 p.39-40 개념탐구 3·Mission")
        ]),
        detailed("평행선 사이의 각도 ②", "quadAngleChainTwo", [
          sourced42("여러 번 꺾인 선의 끝각", 1, "4-2 심화 p.41-42 개념탐구 4·Mission"),
          sourced42("평행한 거울 사이 레이저의 각", 1, "4-2 심화 p.41-42 개념탐구 4·Mission")
        ]),
        detailed("사각형의 종류와 성질", "quadPropertyRelations", [
          sourced42("점 배열에서 볼록한 사각형 세기", 1, "4-2 심화 p.43-44 개념탐구 5·Mission"),
          sourced42("평행사변형의 각을 나눈 선", 0, "4-2 심화 p.43-44 개념탐구 5·Mission"),
          { label: "접어 만든 마름모의 각", reviewLocked: true },
          { label: "사다리꼴과 마름모의 복합 각", reviewLocked: true }
        ]),
        detailed("사각형의 성질의 활용", "quadPropertyApplication", [
          sourced42("이어 붙인 여러 도형의 둘레", 0, "4-2 심화 p.45-46 개념탐구 6·Mission"),
          { label: "사각형과 삼각형의 복합 각", reviewLocked: true },
          { label: "평행사변형과 마름모의 길이 관계", reviewLocked: true }
        ]),
        detailed("정사각형", "quadSquareSpecial", [
          sourced42("겹쳐 이어 붙인 정사각형의 둘레", 0, "4-2 심화 p.47-48 개념탐구 7·Mission"),
          sourced42("접은 정사각형에서 생긴 각", 1, "4-2 심화 p.47-48 개념탐구 7·Mission"),
          sourced42("붙여 놓은 정사각형의 변 길이", 0, "4-2 심화 p.47-48 개념탐구 7·Mission"),
          { label: "정사각형 대각선의 복합 각", reviewLocked: true }
        ]),
        detailed("사각형의 개수", "quadRectangleCount", [
          sourced42("직사각형 모눈의 모든 직사각형", -1, "4-2 심화 p.49-50 개념탐구 8·Mission"),
          sourced42("표시한 칸을 포함하는 직사각형", 0, "4-2 심화 p.49-50 개념탐구 8·Mission"),
          sourced42("직사각형과 정사각형을 함께 세기", 0, "4-2 심화 p.49-50 개념탐구 8·Mission"),
          sourced42("계단 모양 모눈의 직사각형", 1, "4-2 심화 p.49-50 개념탐구 8·Mission"),
          { label: "대각선이 있는 모눈의 사각형", reviewLocked: true },
          { label: "동심 직사각형 세기", reviewLocked: true },
          { label: "평행사변형과 사다리꼴 세기", reviewLocked: true }
        ])],
      ["꺾은선그래프",
        detailed("꺾은선그래프의 이해", "lineGraphUnderstanding", [
          sourceItem42("명령을 되풀이한 뒤 물의 양을 그래프로 나타내기", 0, "4-2-u5-e1-exploration", 52, 58),
          sourceItem42("합과 크기 조건으로 빠진 달의 저금액 구하기", 0, "4-2-u5-e1-example-1-1", 52, 58),
          sourceItem42("기록 변화에 따라 모은 붙임딱지 수 구하기", 0, "4-2-u5-e1-example-1-2", 52, 58),
          sourceItem42("막대그래프와 꺾은선그래프에서 입장객 수 구하기", 1, "4-2-u5-e1-example-1-3", 52, 58),
          sourceItem42("세 지역의 해마다 생산량 증가를 비교하기", 1, "4-2-u5-e1-example-1-4", 52, 58),
          sourceItem42("한 주의 합과 이웃한 날의 관계로 빠진 값 채우기", 0, "4-2-u5-e1-mission-1", 53, 59),
          sourceItem42("월별 전체 생산량과 종류별 생산량으로 판매 금액 구하기", 1, "4-2-u5-e1-mission-2", 53, 59),
          sourceItem42("관광객 수와 수입액의 서로 다른 변화를 비교하기", 1, "4-2-u5-e1-mission-4", 53, 59),
          sourceItem42("기록 변화에 따라 다음 날 연습 시간 정하기", 0, "4-2-u5-e1-mission-5", 53, 59),
          sourceItem42("굵은선과 얇은선을 따라 눈금 사이 달의 판매 금액을 비교하기", 1, "4-2-u5-e1-mission-6", 53, 59)
        ]),
        detailed("꺾은선그래프의 활용", "lineGraphApplication", [
          { ...sourceItem42("두 학년의 키를 세로 눈금 사이에서 읽기", 0, "4-2-u5-e2-exploration", 54, 60, true), reviewReason: "그래프를 월별로 보간한 값과 원문 손글씨 값이 서로 맞지 않아 잠급니다." },
          sourceItem42("왕복하는 공의 시간별 위치 구하기", 0, "4-2-u5-e2-example-2-1", 54, 60),
          sourceItem42("판매량 변화에 따라 다음 해 가격 구하기", 1, "4-2-u5-e2-example-2-2", 54, 60),
          sourceItem42("큰 수조와 작은 수조의 물의 양이 같아지는 때 구하기", 1, "4-2-u5-e2-example-2-3", 54, 60),
          { ...sourceItem42("서로 다른 때부터 채운 두 물통의 높이 관계 구하기", 1, "4-2-u5-e2-example-2-4", 54, 60, true), reviewReason: "30분 늦게 시작한 조건을 반영한 계산값과 원문 손글씨 값이 서로 맞지 않아 잠급니다." },
          sourceItem42("두 자동차의 이동 거리로 사용한 휘발유 차 구하기", 1, "4-2-u5-e2-mission-2", 55, 61),
          sourceItem42("걷기와 뛰기를 바꾼 두 사람의 도착 시각 비교하기", 1, "4-2-u5-e2-mission-3", 55, 61),
          sourceItem42("물을 받다 멈춘 뒤 더 세게 받은 전체 물의 양 구하기", 1, "4-2-u5-e2-mission-4", 55, 61),
          sourceItem42("두 수도꼭지를 바꾸어 쓴 뒤 한 수도꼭지의 시간 구하기", 1, "4-2-u5-e2-mission-5", 55, 61),
          sourceItem42("얇은선과 굵은선으로 두 그릇이 가득 차는 시각 차 구하기", 1, "4-2-u5-e2-mission-6", 55, 61)
        ])
      ],
      ["다각형",
        detailed("정다각형과 대각선", "polygonDiagonals", [
          sourceItem42("정십각형의 모든 대각선 수 구하기", 0, "4-2-u6-e1-exploration", 58, 64),
          sourceItem42("대각선 그림으로 정다각형을 찾고 한 변의 길이 구하기", 0, "4-2-u6-e1-example-1-1", 58, 64),
          sourceItem42("한 외각으로 정다각형을 찾고 대각선 수 구하기", 0, "4-2-u6-e1-example-1-2", 58, 64),
          sourceItem42("정사각형과 정육각형 사이 각으로 정다각형의 대각선 수 구하기", 1, "4-2-u6-e1-example-1-3", 58, 64),
          sourceItem42("변의 수 차와 대각선 수 차로 두 정다각형 찾기", 1, "4-2-u6-e1-example-1-4", 58, 64),
          sourceItem42("같은 길이로 꺾어 그린 선분이 출발점으로 돌아오는 개수 구하기", 0, "4-2-u6-e1-mission-1", 59, 65),
          sourceItem42("둘레와 변의 수 차로 정다각형의 대각선 수 구하기", 1, "4-2-u6-e1-mission-2", 59, 65),
          sourceItem42("정육각형의 한 변과 짧은 대각선 관계로 모든 대각선 길이의 합 구하기", 1, "4-2-u6-e1-mission-3", 59, 65),
          sourceItem42("남은 철사의 길이 조건으로 정십이각형의 둘레 구하기", 1, "4-2-u6-e1-mission-4", 59, 65),
          sourceItem42("꼭짓점 수 차와 대각선 수 차로 두 정다각형 찾기", 1, "4-2-u6-e1-mission-5", 59, 65),
          sourceItem42("한 외각과 한 변으로 정다각형의 대각선 수 구하기", 0, "4-2-u6-e1-mission-6", 59, 65)
        ]),
        detailed("정다각형의 활용", "regularPolygonApplication", [
          sourceItem42("정오각형의 대각선으로 만든 별 끝의 각 구하기", 0, "4-2-u6-e2-exploration", 60, 66),
          sourceItem42("이등변사다리꼴을 이어 붙여 둥근 모양을 만드는 장수 구하기", 0, "4-2-u6-e2-example-2-1", 60, 66),
          sourceItem42("이어 붙인 정사각형·정오각형·정육각형의 각과 둘레 구하기", 1, "4-2-u6-e2-example-2-2", 60, 66),
          sourceItem42("한 변을 맞댄 정오각형과 정육각형 사이의 각 구하기", 1, "4-2-u6-e2-example-2-3", 60, 66),
          sourceItem42("정팔각형의 대각선으로 만든 각 구하기", 1, "4-2-u6-e2-example-2-4", 60, 66),
          sourceItem42("정팔각형에 그은 두 대각선 사이의 각 구하기", 0, "4-2-u6-e2-mission-1", 61, 67),
          sourceItem42("축구공의 정오각형과 정육각형 세 조각 둘레 구하기", 0, "4-2-u6-e2-mission-2", 61, 67),
          sourceItem42("이등변사다리꼴을 이어 붙여 둥근 모양을 만드는 개수 구하기", 0, "4-2-u6-e2-mission-3", 61, 67),
          sourceItem42("한 변을 맞댄 정오각형과 정육각형 안의 각 구하기", 1, "4-2-u6-e2-mission-4", 61, 67),
          sourceItem42("정오각형·정사각형·정삼각형을 이어 붙인 각 구하기", 1, "4-2-u6-e2-mission-5", 61, 67),
          sourceItem42("정오각형의 대각선 교점에서 생긴 각 구하기", 1, "4-2-u6-e2-mission-6", 61, 67)
        ]),
        detailed("평면 덮기", "tessellationCover", [
          sourceItem42("빈틈없이 평면을 덮을 수 있는 도형 고르기", 0, "4-2-u6-e3-exploration", 62, 68),
          sourceItem42("사다리꼴로 직사각형을 덮는 데 필요한 조각 수 구하기", 0, "4-2-u6-e3-example-3-1", 62, 68),
          sourceItem42("직각삼각형으로 직사각형을 덮을 때 삼각형의 높이 구하기", 0, "4-2-u6-e3-example-3-2", 62, 68),
          sourceItem42("세 크기의 정사각형으로 직사각형을 덮는 최소 조각 수 구하기", 1, "4-2-u6-e3-example-3-3", 62, 68),
          sourceItem42("같은 직사각형 다섯 조각으로 직사각형을 만드는 방법 세기", 1, "4-2-u6-e3-example-3-4", 62, 68),
          sourceItem42("직각삼각형으로 직사각형을 덮는 데 필요한 조각 수 구하기", 0, "4-2-u6-e3-mission-1", 63, 69),
          sourceItem42("같은 직사각형 조각 수와 한 변으로 다른 변 구하기", 0, "4-2-u6-e3-mission-2", 63, 69),
          sourceItem42("정삼각형으로 덮은 도형의 조각 수·각·둘레 판단하기", 1, "4-2-u6-e3-mission-3", 63, 69),
          sourceItem42("사다리꼴로 평행사변형을 덮는 데 필요한 조각 수 구하기", 1, "4-2-u6-e3-mission-4", 63, 69),
          sourceItem42("ㄴ자 조각으로 테두리 모양을 덮는 데 필요한 조각 수 구하기", 0, "4-2-u6-e3-mission-5", 63, 69),
          sourceItem42("같은 직사각형 여덟 조각으로 직사각형을 만드는 방법 세기", 1, "4-2-u6-e3-mission-6", 63, 69)
        ]),
        detailed("도형 나누기와 만들기", "shapePartitionCompose", [
          { ...sourceItem42("직사각형을 똑같은 두 조각으로 나누어 정사각형 만들기", 0, "4-2-u6-e4-exploration", 64, 70, true), reviewReason: "선을 그리는 답이 여러 가지일 수 있어 허용 답 전체를 정의하기 전에는 출제하지 않습니다." },
          { ...sourceItem42("다섯 도형 조각으로 목표 모양을 만들 때 두 번 쓴 조각 찾기", 1, "4-2-u6-e4-example-4-1", 64, 70, true), reviewReason: "조각의 회전·뒤집기 허용 범위와 모든 배치를 전수 검사해야 합니다." },
          { ...sourceItem42("도형판에서 다섯 조각을 골라 정사각형 만들기", 1, "4-2-u6-e4-example-4-2", 64, 70, true), reviewReason: "그림 답과 여러 조각 선택 답을 모두 정의해야 단일 채점이 가능합니다." },
          { ...sourceItem42("정사각형과 직각삼각형으로 된 도형을 똑같은 두 조각으로 나누기", 1, "4-2-u6-e4-example-4-3", 64, 70, true), reviewReason: "가능한 모든 절단선을 전수 검사해 허용 답을 정의해야 합니다." },
          sourceItem42("같은 마름모 세 조각을 이어 붙여 만들 수 있는 모양 세기", 1, "4-2-u6-e4-example-4-4", 64, 70),
          { ...sourceItem42("도형 조각을 한 번씩 써 목표 모양을 채울 때 남는 조각 찾기", 0, "4-2-u6-e4-mission-1", 65, 71, true), reviewReason: "원본 조각의 정확한 꼭짓점 좌표와 목표 배치를 전수 검사해야 합니다." },
          { ...sourceItem42("세 도형판 조각으로 만들 수 없는 도형 찾기", 1, "4-2-u6-e4-mission-2", 65, 71, true), reviewReason: "여섯 보기 각각의 조합 가능성을 회전·뒤집기 기준과 함께 전수 검사해야 합니다." },
          { ...sourceItem42("도형판 조각 세 개와 네 개로 각각 정사각형 만들기", 1, "4-2-u6-e4-mission-3", 65, 71, true), reviewReason: "그림 답의 모든 허용 조각 조합과 배치를 정의해야 합니다." },
          sourceItem42("ㅜ자 조각 네 개로 만든 정사각형의 둘레 구하기", 0, "4-2-u6-e4-mission-4", 65, 71),
          { ...sourceItem42("모눈 도형을 두 조각으로 나누어 정사각형 만들기", 1, "4-2-u6-e4-mission-5", 65, 71, true), reviewReason: "가능한 절단선과 재배치 방법을 모두 검사해 허용 답을 정해야 합니다." },
          { ...sourceItem42("144칸 직사각형을 똑같은 두 조각으로 나누어 정사각형 만들기", 1, "4-2-u6-e4-mission-6", 65, 71, true), reviewReason: "모눈 절단선의 여러 정답을 모두 열거하고 채점 규칙을 정해야 합니다." }
        ])
      ]
    ]),
    semester("5-1", [
      ["자연수의 혼합 계산",
        detailed("혼합 계산의 순서", "mixedCalculationE1", [
          sourceItem51("혼합 계산의 순서와 하나의 식으로 나타내기", 1, "5-1-u1-e1-exploration", 3, 4),
          sourceItem51("여러 혼합 계산의 결과를 비교하여 작은 것부터 놓기", 1, "5-1-u1-e1-example-1-1", 3, 4),
          sourceItem51("혼합 계산식의 빈칸에 알맞은 수 구하기", 1, "5-1-u1-e1-example-1-2", 3, 4),
          sourceItem51("두 계산 기호의 뜻을 이용해 혼합 계산하기", 1, "5-1-u1-e1-example-1-3", 3, 4),
          sourceItem51("앞 계산의 결과를 이어 쓰는 식의 순서 찾기", 1, "5-1-u1-e1-example-1-4", 3, 4),
          sourceItem51("괄호가 여러 개 있는 자연수 혼합 계산하기", 1, "5-1-u1-e1-mission-1", 4, 5),
          sourceItem51("등식이 맞도록 혼합 계산식의 빈칸 구하기", 1, "5-1-u1-e1-mission-2", 4, 5),
          sourceItem51("부등식을 만족하는 모든 자연수의 합 구하기", 1, "5-1-u1-e1-mission-3", 4, 5),
          sourceItem51("두 가지 계산 약속을 차례로 적용하기", 1, "5-1-u1-e1-mission-4", 4, 5),
          sourceItem51("여러 등식을 하나의 혼합 계산식으로 나타내기", 1, "5-1-u1-e1-mission-5", 4, 5),
          sourceItem51("세 자연수의 조건을 이용해 혼합 계산식의 값 구하기", 1, "5-1-u1-e1-mission-6", 4, 5)
        ]),
        detailed("하나의 식으로 나타내기", "mixedCalculationE2", [
          sourceItem51("남은 수의 절반과 일정량을 연속으로 처리한 상황을 하나의 식으로 나타내기", 1, "5-1-u1-e2-exploration", 5, 6),
          sourceItem51("두 모둠에 물건을 나누어 주고 남은 수 구하기", 1, "5-1-u1-e2-example-2-1", 5, 6),
          sourceItem51("두 활동을 모두 좋아하지 않는 학생 수 구하기", 1, "5-1-u1-e2-example-2-2", 5, 6),
          sourceItem51("두 공장의 단위 생산량으로 같은 인원의 시간당 생산량 비교하기", 1, "5-1-u1-e2-example-2-3", 5, 6),
          sourceItem51("여러 물건의 전체 무게로 배송비 구하기", 1, "5-1-u1-e2-example-2-4", 5, 6),
          sourceItem51("여러 묶음의 물건값을 내고 거스름돈 구하기", 1, "5-1-u1-e2-mission-1", 6, 7),
          sourceItem51("두 상자에서 일부를 버린 뒤 남은 수의 배수 관계 구하기", 1, "5-1-u1-e2-mission-2", 6, 7),
          { ...sourceItem51("가진 돈의 일부를 쓰고 남은 돈으로 처음 돈 구하기", 1, "5-1-u1-e2-mission-3", 6, 7, true), reviewReason: "원문 문장이 두 해석을 허용하여 답 하나를 정할 수 없습니다." },
          sourceItem51("같은 물건을 더 담은 두 무게로 빈 바구니 무게 구하기", 1, "5-1-u1-e2-mission-4", 6, 7),
          sourceItem51("정원과 이용 시간으로 탈것 이용료 구하기", 1, "5-1-u1-e2-mission-5", 6, 7),
          sourceItem51("같은 색 테이프를 겹쳐 붙인 도형의 둘레 구하기", 1, "5-1-u1-e2-mission-6", 6, 7)
        ]),
        detailed("식 세워 풀기", "mixedCalculationE3", [
          sourceItem51("세 물건의 가격 관계로 한 물건의 가격 구하기", 1, "5-1-u1-e3-exploration", 7, 8),
          sourceItem51("두 수의 차와 나눗셈 조건으로 두 수의 합 구하기", 1, "5-1-u1-e3-example-3-1", 7, 8),
          sourceItem51("나이의 합과 배수 관계로 몇 년 후인지 구하기", 1, "5-1-u1-e3-example-3-2", 7, 8),
          sourceItem51("늦게 출발한 사람이 앞사람을 만나는 시간 구하기", 1, "5-1-u1-e3-example-3-3", 7, 8),
          sourceItem51("세 사람의 용돈 관계로 한 사람의 용돈 구하기", 1, "5-1-u1-e3-example-3-4", 7, 8),
          sourceItem51("곱하고 나눈 수와 두 수의 차로 처음 수 구하기", 1, "5-1-u1-e3-mission-1", 8, 9),
          sourceItem51("같은 직사각형 여덟 조각으로 만든 큰 정사각형의 한 변 구하기", 1, "5-1-u1-e3-mission-2", 8, 9),
          sourceItem51("전체 학생 수와 학년·성별 관계로 학생 수 구하기", 1, "5-1-u1-e3-mission-3", 8, 9),
          sourceItem51("기차로 이동한 뒤 남은 거리를 걷는 시간 구하기", 1, "5-1-u1-e3-mission-4", 8, 9),
          sourceItem51("묶음 단가와 이익으로 판매한 사탕 봉지 수 구하기", 1, "5-1-u1-e3-mission-5", 8, 9),
          sourceItem51("구슬을 옮긴 뒤의 배수 관계로 처음 두 수의 곱 구하기", 1, "5-1-u1-e3-mission-6", 8, 9)
        ]),
        detailed("혼합 계산식 만들기", "mixedCalculationE4", [
          sourceItem51("4를 네 번 써서 1부터 10까지 만들기", 1, "5-1-u1-e4-exploration-1", 9, 10),
          sourceItem51("네 기호를 한 번씩 넣어 14 만들기", 1, "5-1-u1-e4-exploration-2", 9, 10),
          sourceItem51("괄호가 있는 식에 네 기호 넣어 23 만들기", 1, "5-1-u1-e4-example-4-1", 9, 10),
          sourceItem51("곱셈·나눗셈과 괄호로 3 만들기", 1, "5-1-u1-e4-example-4-2", 9, 10),
          sourceItem51("네 수 카드로 가장 큰 자연수 만들기", 1, "5-1-u1-e4-example-4-3", 9, 10),
          sourceItem51("수 카드와 네 기호로 가장 큰 자연수 만들기", 1, "5-1-u1-e4-example-4-4", 9, 10),
          sourceItem51("같은 수 다섯 개와 네 기호로 1 만들기", 1, "5-1-u1-e4-mission-1", 10, 11),
          sourceItem51("두 기호를 넣어 12 만들기", 1, "5-1-u1-e4-mission-2", 10, 11),
          sourceItem51("세 식을 괄호로 묶어 맞게 만들기", 1, "5-1-u1-e4-mission-3", 10, 11),
          sourceItem51("다섯 수 카드로 두 자리 수를 만들어 가장 큰 수 만들기", 1, "5-1-u1-e4-mission-4", 10, 11),
          sourceItem51("괄호로 만들 수 없는 수 찾기", 1, "5-1-u1-e4-mission-5", 10, 11),
          sourceItem51("연속한 네 수 카드로 1 만들기", 1, "5-1-u1-e4-mission-6", 10, 11)
        ])
      ],
      ["약수와 배수", ...factorMultipleGroups.map(([name, exploration, items]) => detailed(name, `factorMultipleE${exploration}`, items.map(([suffix, label], variant) => sourceItem52(label, `5-1-u2-e${exploration}-${suffix}`, exploration))))],
      ["규칙과 대응", ...correspondenceGroups.map(([name, exploration, items]) => detailed(name, `correspondenceE${exploration}`, items.map(([suffix, label]) => sourceItem53(label, `5-1-u3-e${exploration}-${suffix}`, exploration))))],
      ["약분과 통분",
        ...fractionReductionGroups.map(([name, exploration, items]) => detailed(name, `equalFractionE${exploration}`, items.map(([suffix, label], variant) => ({ ...sourceItem54(label, `5-1-u4-e${exploration}-${suffix}`, exploration), variant })))),
      ],
      ["분수의 덧셈과 뺄셈", ...fractionAddSubGroups.map(([name, generatorKey, items]) => detailed(name, generatorKey, items.map(([sourceItemId, label, pdfPage, printedPage], variant) => ({ ...sourceItem55(label, sourceItemId, pdfPage, printedPage), variant }))))],
      ["다각형의 둘레와 넓이",
        fixedVerifiedPool("다각형의 둘레", "polygonPerimeterE1", [
          { ...sourceItem51("두 배치에서 색칠한 부분의 둘레 비교", 1, "5-1-u6-e1-exploration", 61, 62), reviewReason: "원문 두 배치와 둘레 차를 독립 계산으로 확인했습니다." },
          { ...sourceItem51("꺾인 도형의 빠진 길이 찾아 둘레 구하기", 1, "5-1-u6-e1-example-1-1", 61, 62), reviewReason: "원문 길이와 m·cm 바꾸기를 독립 계산으로 확인했습니다." },
          { ...sourceItem51("겹친 종이 두 곳의 둘레 더하기", 1, "5-1-u6-e1-example-1-2", 61, 62), reviewReason: "원문 겹침 두 곳의 둘레 합을 독립 계산으로 확인했습니다." },
          { ...sourceItem51("작은 직사각형 12개의 둘레 모두 더하기", 1, "5-1-u6-e1-example-1-3", 61, 62), reviewReason: "원문 3열 4행 나누기와 둘레 합을 독립 계산으로 확인했습니다." },
          { ...sourceItem51("잘라 낸 정삼각형에서 육각형 둘레 구하기", 1, "5-1-u6-e1-example-1-4", 61, 62), reviewReason: "원문 정삼각형을 자른 여섯 변의 길이를 독립 계산으로 확인했습니다." },
          { ...sourceItem51("꺾인 도형에서 빈 길이 찾기", 1, "5-1-u6-e1-mission-1", 62, 63), reviewReason: "원문 홈의 깊이와 전체 둘레를 독립 계산으로 확인했습니다." },
          { ...sourceItem51("정사각형과 직사각형의 길이로 둘레 구하기", 1, "5-1-u6-e1-mission-2", 62, 63), reviewReason: "원문 정사각형과 바깥 직사각형의 세로 길이를 독립 계산으로 확인했습니다." },
          { ...sourceItem51("육각형의 숨은 두 변 길이 찾아 둘레 구하기", 1, "5-1-u6-e1-mission-3", 62, 63), reviewReason: "원문 120도 육각형의 닫힌 선분 조건을 독립 계산으로 확인했습니다." },
          { ...sourceItem51("작은 칸 둘레로 큰 정사각형 둘레 구하기", 1, "5-1-u6-e1-mission-4", 62, 63), reviewReason: "원문 3열 4행과 색칠한 두 칸의 둘레를 독립 계산으로 확인했습니다." },
          { ...sourceItem51("네 직사각형의 둘레로 라의 가로와 세로 구하기", 1, "5-1-u6-e1-mission-5", 62, 63), reviewReason: "원문 2열×2행 배치와 네 직사각형의 둘레를 함께 풀어 라의 가로와 세로를 독립 확인했습니다." },
          sourceItem51("다섯 직사각형의 둘레 관계 살펴보기", 1, "5-1-u6-e1-mission-6", 62, 63, true, "원문 조건을 만족하는 양의 길이 배치가 둘 이상이고 둘레도 서로 달라 답이 하나로 정해지지 않습니다.")
        ]),
        ...perimeterAreaPendingGroups51]
    ]),
    semester("5-2", [
      ["수의 범위와 어림하기",
        detailed("수의 범위", "advancedRange", ["두 범위의 공통 조건과 합집합", "조건에서 새로운 수의 범위 구하기", "나누어 담는 개수의 범위"]),
        detailed("어림하기", "advancedRounding", ["여러 어림 방법의 결과 비교", "어림 조건을 만족하는 수 찾기", "수 카드로 만든 수를 어림하기"]),
        detailed("어림하기의 활용", "roundingApplication", ["묶음 단위와 필요한 금액 구하기", "단위 환산 뒤 묶음 수와 금액 구하기", "구간별 요금 계산하기"]),
        detailed("어림한 수의 범위", "roundedRange", ["여러 어림 조건의 공통 범위", "배수의 어림값으로 수 찾기", "어림한 합에서 실제 합의 범위 찾기"]),
        // Append source records so saved legacy subunit/type IDs retain their meaning.
        // The first five items use user-authorized independent solution verification.
        {
          name: "수의 범위 · 개념탐구 1 원문 분류",
          types: [
            ["exploration", "개념탐구 1", "수의 범위를 말과 수직선으로 나타내기", true],
            ["example-1-1", "예제 1-1", "자연수의 개수로 범위의 시작 수를 가장 크게 하기", false],
            ["example-1-2", "예제 1-2", "앉는 인원과 필요한 의자 수로 전체 인원의 범위 구하기", false],
            ["example-1-3", "예제 1-3", "두 조건을 모두 만족하는 사람 수의 범위 구하기", false],
            ["example-1-4", "예제 1-4", "상자마다 담는 개수로 상자 수의 범위 구하기", false]
          ].map(([suffix, sourceItemLabel, name, answerVisualRequired], index) => ({
            id: `5-2-u1-e1-${suffix}`,
            name,
            sourceItemId: `5-2-u1-e1-${suffix}`,
            sourceItemLabel,
            sourceSection: suffix === "exploration" ? "exploration" : "example",
            sourceTier: "advanced",
            sourcePdfPage: 2,
            sourcePrintedPage: 4,
            sourceEvidence: "source-memory:hs-elementary.unit.5-2-1.e1-self-solved-20261018",
            sourceVerified: true,
            publisherKeyVerified: false,
            answerVerification: "independent-enumeration-user-authorized",
            reviewLocked: false,
            reviewReason: "사용자 승인에 따라 원문을 직접 풀이하고 독립 전수 검산한 유사문항입니다. 출판사 공식 답안 대조 여부는 별도로 유지합니다.",
            generatorKey: ["source52RangeExploration", "source52RangeMaxStart", "source52RangeSeats", "source52RangeOverlap", "source52RangeBoxes"][index],
            generationMode: "fixed-verified-pool",
            verifiedVariantTarget: 3,
            verifiedVariantCount: 3,
            answerVisualRequired,
            answerVisualStatus: answerVisualRequired ? "verified" : "not-required"
          }))
        },
        {
          name: "어림하기 · 개념탐구 2 원문 분류",
          types: [
            ["exploration", "개념탐구 2", "올림·버림·반올림하여 나타내기", "source52RoundingExploration2"],
            ["example-2-1", "예제 2-1", "올림과 반올림의 결과가 같은 수 찾기", "source52RoundingExample21"],
            ["example-2-2", "예제 2-2", "각각 어림한 인구의 합과 실제 합의 어림값 비교하기", "source52RoundingExample22"],
            ["example-2-3", "예제 2-3", "두 자리 어림 조건을 모두 만족하는 수 찾기", "source52RoundingExample23"],
            ["example-2-4", "예제 2-4", "숫자 조건과 반올림 결과로 빈 숫자 구하기", ""]
          ].map(([suffix, sourceItemLabel, name, generatorKey]) => ({
            id: `5-2-u1-e2-${suffix}`,
            name,
            sourceItemId: `5-2-u1-e2-${suffix}`,
            sourceItemLabel,
            sourceSection: suffix === "exploration" ? "exploration" : "example",
            sourceTier: "advanced",
            sourcePdfPage: 4,
            sourcePrintedPage: 6,
            sourceEvidence: "source-memory:hs-elementary.unit.5-2-1.e2-direct-review-20261019",
            sourceVerified: true,
            publisherKeyVerified: false,
            answerVerification: generatorKey ? "independent-calculation-user-authorized" : "ambiguous-source-condition",
            reviewLocked: !generatorKey,
            reviewReason: generatorKey
              ? "원문 조건과 정답을 독립 계산했습니다. 공식 출판사 답안 대조 여부는 별도로 유지합니다."
              : "원문은 숫자 자릿수의 0 허용 여부를 명시하지 않아 둘째 숫자 답이 하나로 정해지지 않습니다. 원문 문구 검토 전까지 잠급니다.",
            ...(generatorKey ? {
              generatorKey,
              generationMode: "fixed-verified-pool",
              verifiedVariantTarget: 3,
              verifiedVariantCount: 3,
              answerVisualRequired: false,
              answerVisualStatus: "not-required"
            } : {})
          }))
        },
        {
          name: "어림하기 · Mission 1–6 원문 연결",
          types: [
            ["1", "각 자리까지 올림하여 표 완성하기", "source52RoundingMissionOne", true],
            ["2", "두 어림값의 차 구하기", "source52RoundingMissionTwo", false],
            ["3", "수 카드로 목표에 가장 가까운 수 만들기", "source52RoundingMissionThree", false],
            ["4", "버림과 반올림의 결과가 같은 숫자 모두 찾기", "source52RoundingMissionFour", false],
            ["5", "세 가지 어림 결과가 같은 수의 개수", "source52RoundingMissionFive", false],
            ["6", "두 가지 어림 조건을 만족하는 수의 개수", "source52RoundingMissionSix", false]
          ].map(([number, name, generatorKey, answerVisualRequired]) => ({
            id: `5-2-u1-e2-mission-${number}`,
            name,
            sourceItemId: `5-2-u1-e2-mission-${number}`,
            sourceItemLabel: `Mission ${number}`,
            sourceSection: "mission",
            sourceTier: "advanced",
            sourcePdfPage: 5,
            sourcePrintedPage: 7,
            sourceEvidence: "source-memory:hs-elementary.unit.5-2-1.e2-direct-review-20261019",
            sourceVerified: true,
            publisherKeyVerified: false,
            answerVerification: "independent-enumeration-user-authorized",
            reviewLocked: false,
            reviewReason: "사용자 요청에 따라 인쇄된 원문 조건을 직접 풀이하고 독립 열거로 검산했습니다. 공식 출판사 답안 대조 여부는 별도로 유지합니다.",
            generatorKey,
            generationMode: "fixed-verified-pool",
            verifiedVariantTarget: 3,
            verifiedVariantCount: 3,
            answerVisualRequired,
            answerVisualStatus: answerVisualRequired ? "verified" : "not-required"
          }))
        },
        {
          name: "수의 범위 · Mission 1–6 원문 연결",
          types: [
            ["1", "겹치는 두 범위에 들어가는 수와 두 수의 합"],
            ["2", "배수의 개수로 빈 끝수 모두 찾기"],
            ["3", "두 자리 끝수로 만드는 순서쌍 세기"],
            ["4", "숫자 카드로 조건에 맞는 소수 세기"],
            ["5", "필요한 최소 버스 수로 학생 수의 범위 구하기"],
            ["6", "상자별 개수로 상자 수의 범위 구하기"]
          ].map(([number, name], index) => ({
            id: `5-2-u1-e1-mission-${number}`,
            name,
            sourceItemId: `5-2-u1-e1-mission-${number}`,
            sourceItemLabel: `Mission ${number}`,
            sourceSection: "mission",
            sourceTier: "advanced",
            sourcePdfPage: 3,
            sourcePrintedPage: 5,
            sourceEvidence: "source-memory:hs-elementary.unit.5-2-1.e1-missions-direct-solutions-20261018",
            sourceVerified: true,
            publisherKeyVerified: false,
            answerVerification: "independent-enumeration-user-authorized",
            reviewLocked: false,
            reviewReason: "사용자 요청에 따라 원문을 직접 풀이하고 독립 열거로 검산한 유사문항입니다. 출판사 정답지 대조 여부는 별도로 유지합니다.",
            generatorKey: ["source52RangeMissionOne", "source52RangeMissionTwo", "source52RangeMissionThree", "source52RangeMissionFour", "source52RangeMissionFive", "source52RangeMissionSix"][index],
            generationMode: "fixed-verified-pool",
            verifiedVariantTarget: 3,
            verifiedVariantCount: 3,
            answerVisualRequired: false,
            answerVisualStatus: "not-required"
          }))
        },
        {
          name: "어림하기의 활용 · 개념탐구 3 원문 연결",
          types: [
            ["exploration-round-up", "올림하여 천의 자리까지 나타내기", "source52ApplicationExplorationRoundUp"],
            ["exploration-round-down", "버림하여 십의 자리까지 나타내기", "source52ApplicationExplorationRoundDown"],
            ["exploration-round-nearest", "반올림하여 소수 첫째 자리까지 나타내기", "source52ApplicationExplorationRoundNearest"]
          ].map(([suffix, name, generatorKey]) => ({
            id: `5-2-u1-e3-${suffix}`,
            name,
            sourceItemId: `5-2-u1-e3-${suffix}`,
            sourceItemLabel: "개념탐구 3",
            sourceSection: "exploration",
            sourceTier: "advanced",
            sourcePdfPage: 6,
            sourcePrintedPage: 8,
            sourceEvidence: "source-memory:hs-elementary.unit.5-2-1.e3-exploration-vision-20261023",
            sourceVerified: true,
            publisherKeyVerified: false,
            answerVerification: "independent-calculation-user-authorized",
            reviewLocked: false,
            reviewReason: "인쇄된 개념탐구 3의 세 어림 방법을 각각 연결했습니다. 원문과 다른 수를 사용해 3개 유한 변형을 만들고 각 자리 계산을 독립 검산했으며, 출판사 정답 대조 여부는 별도로 표시합니다.",
            generatorKey,
            generationMode: "fixed-verified-pool",
            verifiedVariantTarget: 3,
            verifiedVariantCount: 3,
            answerVisualRequired: false,
            answerVisualStatus: "not-required"
          }))
        },
        {
          name: "어림하기의 활용 · Mission 1 원문 연결",
          types: [{
            id: "5-2-u1-e3-mission-1-box-count",
            name: "책의 수와 분수 비율로 필요한 상자 수 구하기",
            sourceItemId: "5-2-u1-e3-mission-1-box-count",
            sourceItemLabel: "Mission 1",
            sourceSection: "mission",
            sourceTier: "advanced",
            sourcePdfPage: 7,
            sourcePrintedPage: 9,
            sourceEvidence: "source-memory:hs-elementary.unit.5-2-1.e3-mission-1-vision-20261023",
            sourceVerified: true,
            publisherKeyVerified: false,
            answerVerification: "independent-calculation-user-authorized",
            reviewLocked: false,
            reviewReason: "원문 구조를 대조하고 창작 유사문항을 독립 검산했습니다. 출판사 정답지는 미대조입니다.",
            generatorKey: "source52ApplicationMissionOneBooks",
            generationMode: "fixed-verified-pool",
            verifiedVariantTarget: 3,
            verifiedVariantCount: 3,
            answerVisualRequired: false,
            answerVisualStatus: "not-required"
          }, {
            id: "5-2-u1-e3-mission-2-perimeter",
            name: "ㄱ자 모양 도형의 둘레를 자연수 cm로 어림하기",
            sourceItemId: "5-2-u1-e3-mission-2-perimeter",
            sourceItemLabel: "Mission 2",
            sourceSection: "mission",
            sourceTier: "advanced",
            sourcePdfPage: 7,
            sourcePrintedPage: 9,
            sourceEvidence: "source-memory:hs-elementary.unit.5-2-1.e3-mission-2-vision-20261023",
            sourceVerified: true,
            publisherKeyVerified: false,
            answerVerification: "independent-calculation-user-authorized",
            reviewLocked: false,
            reviewReason: "원문 구조를 대조하고 창작 유사문항을 독립 검산했습니다. 출판사 정답지는 미대조입니다.",
            generatorKey: "source52ApplicationMissionTwoPerimeter",
            generationMode: "fixed-verified-pool",
            verifiedVariantTarget: 3,
            verifiedVariantCount: 3,
            answerVisualRequired: false,
            answerVisualStatus: "not-required"
          }, {
            id: "5-2-u1-e3-mission-3-cube-box-count",
            name: "창고의 세 방향에 정육면체 상자 넣기",
            sourceItemId: "5-2-u1-e3-mission-3-cube-box-count",
            sourceItemLabel: "Mission 3",
            sourceSection: "mission",
            sourceTier: "advanced",
            sourcePdfPage: 7,
            sourcePrintedPage: 9,
            sourceEvidence: "source-memory:hs-elementary.unit.5-2-1.e3-mission-3-vision-20261023",
            sourceVerified: true,
            publisherKeyVerified: false,
            answerVerification: "independent-calculation-user-authorized",
            reviewLocked: false,
            reviewReason: "원문 구조를 대조하고 창작 유사문항을 독립 검산했습니다. 출판사 정답지는 미대조입니다.",
            generatorKey: "source52ApplicationMissionThreeCubeBoxes",
            generationMode: "fixed-verified-pool",
            verifiedVariantTarget: 3,
            verifiedVariantCount: 3,
            answerVisualRequired: false,
            answerVisualStatus: "not-required"
          }, {
            id: "5-2-u1-e3-mission-4-mat-cost",
            name: "스케치북 묶음 판매처의 필요 비용 비교",
            sourceItemId: "5-2-u1-e3-mission-4-mat-cost",
            sourceItemLabel: "Mission 4",
            sourceSection: "mission",
            sourceTier: "advanced",
            sourcePdfPage: 7,
            sourcePrintedPage: 9,
            sourceEvidence: "source-memory:hs-elementary.unit.5-2-1.e3-mission-4-vision-20261023",
            sourceVerified: true,
            publisherKeyVerified: false,
            answerVerification: "independent-calculation-user-authorized",
            reviewLocked: false,
            reviewReason: "원문 구조를 대조하고 창작 유사문항을 독립 검산했습니다. 출판사 정답지는 미대조입니다.",
            generatorKey: "source52ApplicationMissionFourSupplyCost",
            generationMode: "fixed-verified-pool",
            verifiedVariantTarget: 3,
            verifiedVariantCount: 3,
            answerVisualRequired: false,
            answerVisualStatus: "not-required"
          }, {
            id: "5-2-u1-e3-mission-5-bar-graph-length",
            name: "십만 단위로 반올림한 인구의 막대 길이",
            sourceItemId: "5-2-u1-e3-mission-5-bar-graph-length",
            sourceItemLabel: "Mission 5",
            sourceSection: "mission",
            sourceTier: "advanced",
            sourcePdfPage: 7,
            sourcePrintedPage: 9,
            sourceEvidence: "source-memory:hs-elementary.unit.5-2-1.e3-mission-5-vision-20261023",
            sourceVerified: true,
            publisherKeyVerified: false,
            answerVerification: "independent-calculation-user-authorized",
            reviewLocked: false,
            reviewReason: "원문 구조를 대조하고 창작 유사문항을 독립 검산했습니다. 출판사 정답지는 미대조입니다.",
            generatorKey: "source52ApplicationMissionFivePopulationBarLength",
            generationMode: "fixed-verified-pool",
            verifiedVariantTarget: 3,
            verifiedVariantCount: 3,
            answerVisualRequired: false,
            answerVisualStatus: "not-required"
          }, {
            id: "5-2-u1-e3-mission-6-citrus-sales",
            name: "완성된 감귤 상자의 판매액 구하기",
            sourceItemId: "5-2-u1-e3-mission-6-citrus-sales",
            sourceItemLabel: "Mission 6",
            sourceSection: "mission",
            sourceTier: "advanced",
            sourcePdfPage: 7,
            sourcePrintedPage: 9,
            sourceEvidence: "source-memory:hs-elementary.unit.5-2-1.e3-mission-6-vision-20261023",
            sourceVerified: true,
            publisherKeyVerified: false,
            answerVerification: "independent-calculation-user-authorized",
            reviewLocked: false,
            reviewReason: "원문 구조를 대조하고 창작 유사문항을 독립 검산했습니다. 출판사 정답지는 미대조입니다.",
            generatorKey: "source52ApplicationMissionSixCitrusSales",
            generationMode: "fixed-verified-pool",
            verifiedVariantTarget: 3,
            verifiedVariantCount: 3,
            answerVisualRequired: false,
            answerVisualStatus: "not-required"
          }]
        }, {
          name: "어림한 수의 범위 · 개념탐구 4 및 예제 4-1–4-3",
          types: [{
            id: "5-2-u1-e4-exploration-rounded-range",
            name: "세 어림 조건의 공통 범위",
            sourceItemId: "5-2-u1-e4-exploration-rounded-range",
            sourceItemLabel: "개념탐구 4",
            sourceSection: "exploration",
            sourceTier: "advanced",
            sourcePdfPage: 8,
            sourcePrintedPage: 10,
            sourceEvidence: "source-memory:hs-elementary.unit.5-2-1.e4-exploration-vision-20261023",
            sourceVerified: true,
            publisherKeyVerified: false,
            answerVerification: "independent-calculation-user-authorized",
            reviewLocked: false,
            reviewReason: "원문 구조를 대조하고 창작 유사문항을 독립 검산했습니다. 출판사 정답지는 미대조입니다.",
            generatorKey: "source52RoundedRangeExploration4",
            generationMode: "fixed-verified-pool",
            verifiedVariantTarget: 3,
            verifiedVariantCount: 3,
            answerVisualRequired: false,
            answerVisualStatus: "not-required"
          }, {
            id: "5-2-u1-e4-example-1",
            name: "여러 어림 조건을 만족하는 가장 작은 자연수",
            sourceItemId: "5-2-u1-e4-example-1",
            sourceItemLabel: "예제 4-1",
            sourceSection: "example",
            sourceTier: "advanced",
            sourcePdfPage: 8,
            sourcePrintedPage: 10,
            sourceEvidence: "source-memory:hs-elementary.unit.5-2-1.e4-example-1-vision-20261023",
            sourceVerified: true,
            publisherKeyVerified: false,
            answerVerification: "independent-calculation-user-authorized",
            reviewLocked: false,
            reviewReason: "원문 구조를 대조하고 창작 유사문항을 독립 검산했습니다. 출판사 정답지는 미대조입니다.",
            generatorKey: "source52RoundedRangeExample41",
            generationMode: "fixed-verified-pool",
            verifiedVariantTarget: 3,
            verifiedVariantCount: 3,
            answerVisualRequired: false,
            answerVisualStatus: "not-required"
          }, {
            id: "5-2-u1-e4-example-2",
            name: "두 몫을 어림한 결과로 자연수의 범위 구하기",
            sourceItemId: "5-2-u1-e4-example-2",
            sourceItemLabel: "예제 4-2",
            sourceSection: "example",
            sourceTier: "advanced",
            sourcePdfPage: 8,
            sourcePrintedPage: 10,
            sourceEvidence: "source-memory:hs-elementary.unit.5-2-1.e4-example-2-vision-20261023",
            sourceVerified: true,
            publisherKeyVerified: false,
            answerVerification: "independent-calculation-user-authorized",
            reviewLocked: false,
            reviewReason: "원문 구조를 대조하고 창작 유사문항을 독립 검산했습니다. 출판사 정답지는 미대조입니다.",
            generatorKey: "source52RoundedRangeExample42",
            generationMode: "fixed-verified-pool",
            verifiedVariantTarget: 3,
            verifiedVariantCount: 3,
            answerVisualRequired: false,
            answerVisualStatus: "not-required"
          }, {
            id: "5-2-u1-e4-example-3",
            name: "합과 차를 어림한 결과로 큰 수의 범위 구하기",
            sourceItemId: "5-2-u1-e4-example-3",
            sourceItemLabel: "예제 4-3",
            sourceSection: "example",
            sourceTier: "advanced",
            sourcePdfPage: 8,
            sourcePrintedPage: 10,
            sourceEvidence: "source-memory:hs-elementary.unit.5-2-1.e4-example-3-vision-20261023",
            sourceVerified: true,
            publisherKeyVerified: false,
            answerVerification: "independent-calculation-user-authorized",
            reviewLocked: false,
            reviewReason: "원문 구조를 대조하고 창작 유사문항을 독립 검산했습니다. 출판사 정답지는 미대조입니다.",
            generatorKey: "source52RoundedRangeExample43",
            generationMode: "fixed-verified-pool",
            verifiedVariantTarget: 3,
            verifiedVariantCount: 3,
            answerVisualRequired: false,
            answerVisualStatus: "not-required"
          }, {
            id: "5-2-u1-e4-example-4",
            name: "꺾은선그래프에서 남녀 인구 차의 범위 구하기",
            sourceItemId: "5-2-u1-e4-example-4",
            sourceItemLabel: "예제 4-4",
            sourceSection: "example",
            sourceTier: "advanced",
            sourcePdfPage: 8,
            sourcePrintedPage: 10,
            sourceEvidence: "source-memory:hs-elementary.unit.5-2-1.e4-example-4-vision-20261023",
            sourceVerified: true,
            publisherKeyVerified: false,
            answerVerification: "independent-calculation-user-authorized",
            reviewLocked: false,
            reviewReason: "원문 구조를 대조하고 창작 유사문항을 독립 검산했습니다. 출판사 정답지는 미대조입니다.",
            generatorKey: "source52RoundedRangeExample44",
            generationMode: "fixed-verified-pool",
            verifiedVariantTarget: 3,
            verifiedVariantCount: 3,
            answerVisualRequired: true,
            answerVisualStatus: "verified-reconstruction"
          }, {
            id: "5-2-u1-e4-mission-1-rounded-count",
            name: "두 어림 조건을 함께 만족하는 자연수의 개수",
            sourceItemId: "5-2-u1-e4-mission-1-rounded-count",
            sourceItemLabel: "Mission 1",
            sourceSection: "mission",
            sourceTier: "advanced",
            sourcePdfPage: 9,
            sourcePrintedPage: 11,
            sourceEvidence: "source-memory:hs-elementary.unit.5-2-1.e4-mission-1-vision-20261024",
            sourceVerified: true,
            publisherKeyVerified: false,
            answerVerification: "independent-calculation-user-authorized",
            reviewLocked: false,
            reviewReason: "원문 구조를 대조하고 창작 유사문항을 독립 검산했습니다. 출판사 정답지는 미대조입니다.",
            generatorKey: "source52RoundedCountMission1",
            generationMode: "fixed-verified-pool",
            verifiedVariantTarget: 3,
            verifiedVariantCount: 3,
            answerVisualRequired: false,
            answerVisualStatus: "not-required"
          }]
        }
      ],
      ["분수의 곱셈",
        detailed("분수와 자연수의 곱셈", "fractionNaturalAdvanced", ["전체에서 연속한 분수만큼 구하기", "하루와 시간의 분수량 환산하기", "곱이 자연수가 되는 수의 개수"]),
        detailed("분수끼리의 곱셈", "fractionProductAdvanced", ["규칙적인 분수의 연속 곱", "튀는 공의 이동 거리", "남은 양의 분수 곱 규칙"]),
        detailed("식 세워 풀기", "fractionMultiplicationEquation", ["남은 양으로 처음 전체량 역산하기", "두 양의 분수 관계와 합으로 구하기", "두 부분의 차로 전체량 구하기"]),
        detailed("분수의 곱셈 응용 문제", "fractionMultiplicationApplication", ["곱이 모두 자연수가 되는 가장 작은 분수", "기약분수의 곱 조건을 만족하는 순서쌍", "서로 다른 숫자를 넣은 분수식의 가짓수"])
      ],
      ["합동과 대칭",
        detailed("조건에 맞는 삼각형 그리기", "triangleConstructionAdvanced", ["합동인 삼각형에 필요한 조건 고르기", "주어진 길이로 만들 수 있는 삼각형 세기", "두 각을 골라 만들 수 있는 삼각형 세기"]),
        detailed("삼각형의 결정 조건과 합동 조건", "triangleCongruenceCondition", ["빈 변의 길이가 될 수 있는 자연수", "막대 세 개로 만드는 서로 다른 삼각형", "정다각형을 합동인 조각으로 나누기"]),
        detailed("합동의 활용 ①", "congruenceApplicationOne", ["접은 정사각형의 대응각 구하기", "합동인 이등변삼각형의 각 구하기", "겹친 합동 정사각형의 넓이"]),
        detailed("합동의 활용 ②", "congruenceApplicationTwo", ["합동인 삼각형으로 만든 도형의 넓이", "정삼각형으로 이룬 사다리꼴의 둘레", "합동인 삼각형 부채꼴의 높이"]),
        detailed("선대칭도형", "lineSymmetryAdvanced", ["대칭축에 대한 점의 좌표", "대칭인 두 반직선 사이의 각", "도형의 대칭축 개수"]),
        detailed("선대칭의 활용", "lineSymmetryApplication", ["대칭수의 순서와 값", "여러 번 접은 종이의 남은 넓이", "거울 방에서 반사 횟수 구하기"]),
        detailed("점대칭도형", "pointSymmetryAdvanced", ["대칭의 중심으로 대응점 완성하기", "180도 돌려 같은 기호 배열 세기", "도형과 점대칭 도형의 겹친 넓이"]),
        detailed("점대칭의 활용", "pointSymmetryApplication", ["회전하는 도형이 점대칭이 되는 시각", "점대칭 사다리꼴의 전체 넓이", "중심을 지나는 격자 직선 세기"]),
        {
          name: "합동의 활용 ②",
          types: [
            {
              id: "5-2-u3-e4-example-2",
              name: "정삼각형의 회전으로 각도 구하기",
              sourceItemId: "5-2-u3-e4-example-2",
              sourceItemLabel: "예제 4-2 유사문항",
              sourceSection: "example",
              sourceTier: "advanced",
              sourcePdfPage: 26,
              sourcePrintedPage: 30,
              sourceEvidence: "source-drive:1xxuHRMlch7RGsqBdnlFdOGdvxw0aUPfQ; source-sha256:6c3fde0d51b7e277eee7427de4db1742a42f11ef5113b25a1050aad2fcbe0ce88; clean-page-crop-sha256:527fa6ff8b5e058c58dd948c9a6493152f152e231f44084375018b1a08c59be7; canonical PDF p.26; clean alternate p.25; printed p.30; Apple Vision OCR + visual comparison; sourceItemId:5-2-u3-e4-example-2",
              sourceVerified: true,
              publisherKeyVerified: false,
              answerVerification: "independent-geometry-proof-user-authorized",
              reviewLocked: false,
              reviewReason: "원문 PDF p.26/인쇄 p.30의 두 정삼각형·35°·20°·목표각을 대조하고 독립 풀이 125°를 확인했습니다. 9개 변형의 도형 좌표와 각을 검산하고 PC 1280px·모바일 375px 화면 및 문제·풀이 A4 단일 페이지 출력을 시각 확인했습니다. 출판사 답안표 대조는 하지 않았으며 공개 후보로 연결합니다.",
              generatorKey: "source52EquilateralAngleChaseExample2",
              generationMode: "fixed-verified-pool",
              verifiedVariantTarget: 3,
              verifiedVariantCount: 3,
              answerVisualRequired: true,
              answerVisualStatus: "verified-reconstruction"
            },
            {
              id: "5-2-u3-e4-mission-1",
              name: "정사각형 속 각도 구하기",
              sourceItemId: "5-2-u3-e4-mission-1",
              sourceItemLabel: "Mission 1 유사문항",
              sourceSection: "mission",
              sourceTier: "advanced",
              sourcePdfPage: 27,
              sourcePrintedPage: 31,
              sourceEvidence: "source-memory:hs-elementary.unit.5-2-1.e4-missions-1-3-vision-20261024",
              sourceVerified: true,
              publisherKeyVerified: false,
              answerVerification: "independent-geometry-proof-user-authorized",
              reviewLocked: false,
              reviewReason: "원문 점 ㄴ·ㄹ과 목표각을 재확인하여 독립 계산을 70°로 정정했습니다. 창작 변형은 다른 각 수치를 사용하며 그림과 합동 풀이를 검증했습니다. 출판사 정답은 확인하지 않았습니다.",
              generatorKey: "source52SquareAnglePage31Mission1",
              generationMode: "fixed-verified-pool",
              verifiedVariantTarget: 3,
              verifiedVariantCount: 3,
              answerVisualRequired: true,
              answerVisualStatus: "verified-reconstruction"
            },
            {
              id: "5-2-u3-e4-mission-2",
              name: "반원 속 삼각형의 각 구하기",
              sourceItemId: "5-2-u3-e4-mission-2",
              sourceItemLabel: "Mission 2 유사문항",
              sourceSection: "mission",
              sourceTier: "advanced",
              sourcePdfPage: 27,
              sourcePrintedPage: 31,
              sourceEvidence: "source-memory:hs-elementary.unit.5-2-1.e4-missions-1-3-vision-20261024",
              sourceVerified: true,
              publisherKeyVerified: false,
              answerVerification: "independent-calculation-user-authorized",
              reviewLocked: false,
              reviewReason: "반지름과 세 변이 같은 삼각형의 합동, 이등변삼각형의 밑각으로 독립 계산했습니다. 유사문항은 원문과 다른 수치이며 출판사 정답은 확인하지 않았습니다.",
              generatorKey: "source52SemicircleAnglePage31Mission2",
              generationMode: "fixed-verified-pool",
              verifiedVariantTarget: 3,
              verifiedVariantCount: 3,
              answerVisualRequired: true,
              answerVisualStatus: "verified-reconstruction"
            },
            {
              id: "5-2-u3-e4-mission-3",
              name: "정삼각형 속 회전 각 구하기",
              sourceItemId: "5-2-u3-e4-mission-3",
              sourceItemLabel: "Mission 3 유사문항",
              sourceSection: "mission",
              sourceTier: "advanced",
              sourcePdfPage: 27,
              sourcePrintedPage: 31,
              sourceEvidence: "source-memory:hs-elementary.unit.5-2-1.e4-missions-1-3-vision-20261024",
              sourceVerified: true,
              publisherKeyVerified: false,
              answerVerification: "independent-calculation-user-authorized",
              reviewLocked: false,
              reviewReason: "원문 각 호가 ㄹㄱ과 ㄹㅁ 사이임을 재확인하고, 창작 그림과 풀이를 해당 각으로 고쳐 좌표로 검증했습니다. 원문 출판사 정답은 확인하지 않았습니다.",
              generatorKey: "source52EquilateralRotationPage31Mission3",
              generationMode: "fixed-verified-pool",
              verifiedVariantTarget: 3,
              verifiedVariantCount: 3,
              answerVisualRequired: true,
              answerVisualStatus: "verified-reconstruction"
            },
            {
              id: "5-2-u3-e4-mission-4",
              name: "삼등분점을 이은 작은 정사각형의 넓이",
              sourceItemId: "5-2-u3-e4-mission-4",
              sourceItemLabel: "Mission 4 유사문항",
              sourceSection: "mission",
              sourceTier: "advanced",
              sourcePdfPage: 27,
              sourcePrintedPage: 31,
              sourceEvidence: "source-drive:1BXdJeD7DOnqb78y_E1FNuIqwoOXZ9q-s; source-sha256:d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463; clean-alternate-sha256:6c3fde0d51b7e277eee7427de4db1742a42f11ef5113b25a1050aad2fcbe0ce88; PDF p.26; printed p.31; sourceItemId:5-2-u3-e4-mission-4",
              sourceVerified: true,
              publisherKeyVerified: false,
              answerVerification: "independent-area-subtraction-user-authorized",
              reviewLocked: false,
              reviewReason: "바깥 넓이 225cm²의 한 변은 15cm이고 삼등분 길이는 5cm입니다. 네 모서리 직각삼각형은 각각 5×10÷2=25cm²이므로 안쪽 정사각형은 225−4×25=125cm²입니다. 9개 변형의 그림 좌표·답·풀이와 PC·모바일·A4 출력을 검증했습니다. 출판사 답안표는 확인하지 않았습니다.",
              generatorKey: "source52SquareTrisectionAreaPage31Mission4",
              generationMode: "fixed-verified-pool",
              verifiedVariantTarget: 3,
              verifiedVariantCount: 3,
              answerVisualRequired: true,
              answerVisualStatus: "verified-reconstruction"
            },
            {
              id: "5-2-u3-e4-mission-5",
              name: "합동 삼각형으로 만든 삼각형의 넓이",
              sourceItemId: "5-2-u3-e4-mission-5",
              sourceItemLabel: "Mission 5 유사문항",
              sourceSection: "mission",
              sourceTier: "advanced",
              sourcePdfPage: 27,
              sourcePrintedPage: 31,
              sourceEvidence: "source-drive:1BXdJeD7DOnqb78y_E1FNuIqwoOXZ9q-s; source-sha256:d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463; PDF p.27; printed p.31; sourceItemId:5-2-u3-e4-mission-5",
              sourceVerified: true,
              publisherKeyVerified: false,
              answerVerification: "independent-area-decomposition-user-authorized",
              reviewLocked: false,
              reviewReason: "원문 도형과 합동 대응을 대조하고, 직사각형에서 세 모서리 삼각형을 빼는 풀이를 독립 계산했습니다. 9개 고정 변형의 도형 넓이, 문제·풀이 분리, PC·모바일 렌더와 A4 인쇄를 검증했습니다. 출판사 정답은 확인하지 않았습니다.",
              generatorKey: "source52CongruentTriangleAreaPage31Mission5",
              generationMode: "fixed-verified-pool",
              verifiedVariantTarget: 3,
              verifiedVariantCount: 3,
              answerVisualRequired: true,
              answerVisualStatus: "verified-reconstruction"
            },
            {
              id: "5-2-u3-e4-mission-6",
              name: "사다리꼴의 중점으로 구하는 삼각형의 넓이",
              sourceItemId: "5-2-u3-e4-mission-6",
              sourceItemLabel: "Mission 6 유사문항",
              sourceSection: "mission",
              sourceTier: "advanced",
              sourcePdfPage: 27,
              sourcePrintedPage: 31,
              sourceEvidence: "source-drive:1BXdJeD7DOnqb78y_E1FNuIqwoOXZ9q-s; source-sha256:d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463; PDF p.27; printed p.31; sourceItemId:5-2-u3-e4-mission-6",
              sourceVerified: true,
              publisherKeyVerified: false,
              answerVerification: "independent-equal-area-decomposition-user-authorized",
              reviewLocked: false,
              reviewReason: "원본의 직각 표시, 윗변 10cm·아랫변 8cm·높이 6cm, 변 ㄴㄷ의 중점 ㅁ과 목표 △ㄱㄹㅁ을 직접 대조했습니다. 같은 밑변·높이인 삼각형 넓이를 이용해 목표가 사다리꼴 넓이의 절반임을 독립 계산했습니다. 9개 변형의 그림·답·풀이와 화면·A4 출력을 확인했습니다. 출판사 정답표는 확인하지 않았습니다.",
              generatorKey: "source52TrapezoidMidpointPage31Mission6",
              generationMode: "fixed-verified-pool",
              verifiedVariantTarget: 3,
              verifiedVariantCount: 3,
              answerVisualRequired: true,
              answerVisualStatus: "verified-reconstruction"
            }
          ]
        },
      ],
      ["소수의 곱셈",
        detailed("소수와 자연수의 곱셈", "decimalNaturalAdvanced", ["같은 소수를 여러 번 더한 값", "곱하는 순서를 바꾸어 계산하기", "공통인 수로 묶어 계산하기", "빠진 소수점으로 곱한 자연수 찾기", "반올림한 분수합의 자연수 찾기", "조건을 모두 만족하는 소수 찾기", "소수 수열의 특정 번째 수", "넓이의 차로 직사각형의 변 구하기", "속력과 시간으로 터널 길이 구하기", "곱이 자연수가 되는 두 자리 수의 범위", "반올림한 몫을 만족하는 자연수의 합"]),
        detailed("소수와 소수의 곱셈", "decimalDecimalAdvanced", ["소수 곱의 빠진 숫자 찾기", "반올림한 몫으로 소수의 범위 찾기", "넓이 증가량으로 정사각형의 변 구하기", "서로 다른 숫자의 소수 곱 관계", "곱을 계산하지 않고 자릿수 판단하기", "분배법칙으로 소수식 계산하기", "ㄱ자 모양 도형의 넓이", "잘못 나눈 계산을 바르게 고치기", "두 이동 거리의 차 구하기", "곱셈식의 빈칸 숫자 찾기", "정확히 3장이 겹치는 부분의 넓이"])
      ],
      ["직육면체",
        detailed("직육면체의 성질", "cuboidPropertiesAdvanced", ["격자 직육면체의 작은 정육면체 수", "가장 큰 정육면체로 자른 개수와 모서리 합", "두 방향으로 자른 조각의 모서리 길이 합", "격자에서 만들 수 있는 직육면체 크기 수", "같은 직육면체 조각으로 만드는 직육면체 수"]),
        detailed("직육면체의 전개도", "cuboidNetAdvanced", ["그려진 전개도가 들어가는 종이 찾기", "모서리를 잘라 만든 상자의 모서리 길이 합", "전개도에 필요한 가장 작은 도화지", "전개도를 오리고 남는 종이의 넓이", "한 칸을 붙여 완성하는 위치 모두 찾기"]),
        detailed("직육면체의 전개도와 겨냥도", "cuboidNetViewAdvanced", ["한 꼭짓점에서 만날 수 없는 세 면 찾기", "한 모서리와 평행·수직인 모서리 수", "한 꼭짓점에서 만나는 세 면의 곱", "마주 보는 면의 곱 중 가장 큰 값", "모서리만 따라가는 가장 짧은 거리"]),
        detailed("직육면체의 활용", "cuboidApplicationAdvanced", ["쌓기 모양을 담는 가장 작은 상자", "세 방향으로 두른 끈의 전체 길이", "방향을 바꾸어 넣는 직육면체의 최대 개수", "묶음 상자의 높이 역산하기", "세 끈의 길이로 가장 짧은 모서리 구하기"]),
        detailed("주사위에 관한 문제 ①", "diceArrangementAdvanced", ["회전하여 같은 주사위의 면 배치 수", "주사위 전개도의 빈 면 완성하기", "세 방향의 면 합으로 보이지 않는 면 찾기", "맞닿은 두 면의 합이 일정한 주사위 줄", "쌓은 주사위의 보이는 면의 합"]),
        detailed("주사위에 관한 문제 ②", "diceRollingAdvanced", ["격자 길을 굴린 뒤 윗면 찾기", "굴린 기록으로 마주 보는 면 찾기", "여러 경로를 굴린 주사위의 바닥면 합", "격자 길을 따라 굴린 윗면의 합", "두 경로의 윗면 합으로 면의 수 찾기"])
      ],
      ["평균과 가능성",
        detailed("평균 구하기", "averageCalculationAdvanced", ["자료의 합으로 평균 구하기", "두 사람의 평균 조건으로 빈 점수 찾기", "한 수를 바꾼 뒤 원래 수 찾기", "도수분포표에서 빠진 학생 수 찾기", "겹치는 두 집단의 평균 구하기", "일정하게 변하는 자료의 처음 값 찾기"]),
        detailed("평균의 활용", "averageApplicationAdvanced", ["두 집단의 평균으로 한 집단 평균 찾기", "인원 변화로 공동 비용 역산하기", "작업 시간과 인원으로 평균 작업량 구하기", "전체 평균으로 빠진 수확량 찾기", "배점별 학생 수와 평균으로 빈 도수 찾기", "매일 일정하게 늘어난 거리의 첫날 값"]),
        detailed("사건의 가짓수", "eventCountAdvanced", ["지정한 점을 지나는 최단 경로", "두 조건 중 하나를 만족하는 수", "두 사람이 이웃하는 줄 세우기", "모든 팀이 한 번씩 경기하는 횟수", "원 위의 점으로 선분과 삼각형 만들기", "두 주사위 눈의 차가 조건을 만족하는 경우"]),
        detailed("사건의 가능성", "eventProbabilityAdvanced", ["두 주머니에서 서로 다른 색 뽑기", "특정 사람이 맨 앞에 설 가능성", "여러 번 중 일정 횟수 이상 성공할 가능성", "여러 사람이 같은 선택을 할 가능성", "연속한 두 사건 중 적어도 하나가 일어날 가능성", "당첨 제비를 연속으로 뽑을 가능성"])
      ]
    ]),
    semester("6-1", [
      ["분수의 나눗셈",
        detailed("분수 나눗셈의 이해", "fractionDivisionUnderstandingAdvanced", ["계산값이 자연수가 되는 분자 최댓값", "상자와 물건의 전체 무게로 한 개의 무게 구하기", "규칙적인 분수 나눗셈 중 조건을 만족하는 식의 개수", "같은 계산값을 만드는 네 수의 크기 비교", "과일과 바구니의 무게로 한 개의 무게 구하기", "두 사람의 일률로 혼자 하는 기간 구하기"]),
        detailed("식 세워 풀기", "fractionDivisionEquationAdvanced", ["전체와 차로 두 사람의 양 구하기", "두 제품의 단위 사용량 구하기", "넓이가 같은 두 삼각형의 높이 구하기", "배수 관계인 세 기약분수 구하기", "전체 길이와 배수 관계로 한 사람의 길이 구하기", "도중에 속도가 바뀐 물통의 시간 구하기"])
      ],
      ["각기둥과 각뿔",
        detailed("각기둥의 구성 요소와 전개도", "prismElementsNetAdvanced", ["면·모서리·꼭짓점 관계로 밑면 찾기", "옆면 넓이로 모든 모서리 길이의 합 구하기", "붙인 변에 따른 두 전개도 둘레의 차", "자른 두 각기둥의 구성 요소 수의 합", "옆면 넓이로 밑면 둘레와 모서리 합 구하기", "전개도 치수로 모든 모서리 길이의 합 구하기"]),
        detailed("각기둥의 활용", "prismApplicationAdvanced", ["옆면을 따라 45도로 올라간 각기둥의 높이", "밑면을 나누어 만든 각기둥들의 모서리 수", "옆면을 지나는 선이 거치는 면의 수", "옆면을 펼쳐 구하는 가장 짧은 거리", "모든 꼭짓점을 잘라 낸 각기둥의 구성 요소", "펼친 옆면에 생긴 삼각형의 넓이"]),
        detailed("각뿔의 구성 요소와 전개도", "pyramidElementsNetAdvanced", ["같은 밑면 각기둥과 각뿔의 구성 요소 관계", "붙인 변에 따른 각뿔 전개도 둘레의 차", "각뿔과 각기둥의 모서리 합으로 높이 구하기", "두 전개도의 면·모서리·꼭짓점 수의 합", "모서리에 일정 간격으로 찍는 점의 수", "종이 조각으로 만든 두 입체의 모서리 길이 차"]),
        detailed("각뿔의 활용", "pyramidApplicationAdvanced", ["각기둥과 각뿔을 밑면끼리 붙인 구성 요소", "각뿔 겉면의 중점 경로 길이", "전개도에서 구하는 가장 짧은 겉면 거리", "같은 각뿔 두 개를 밑면끼리 붙인 구성 요소", "바깥 정사각형 안의 사각뿔 전개도 넓이", "정사면체의 모든 면을 지나는 최단거리"])
      ],
      ["소수의 나눗셈",
        detailed("소수와 자연수의 나눗셈", "decimalNaturalDivisionAdvanced", ["목표값에 가까운 몫의 순서", "약속한 소수 나눗셈의 결과 차", "합성도형 넓이로 빠진 길이 구하기", "나눗셈 세로셈의 빠진 숫자", "같은 수를 여러 수로 나눈 몫의 합", "수 카드로 만든 몫의 최댓값과 최솟값 차"]),
        detailed("소수 나눗셈의 활용", "decimalDivisionApplicationAdvanced", ["같은 눈금 수직선의 빠진 값", "일정한 빠르기의 여러 바퀴 시간", "통과 물건의 무게로 새 전체 무게 구하기", "두 이동 수단의 일정 시간 뒤 거리 차", "연비가 다른 두 이동 수단의 연료비 차", "서로 다가오는 두 도형의 겹친 넓이"]),
        detailed("몫이 소수인 자연수의 나눗셈", "naturalDecimalQuotientAdvanced", ["순환소수의 특정 자리 숫자", "범위 안 두 자연수의 반올림한 몫 차", "세 수의 몫 관계로 다른 몫 구하기", "두 나눗셈 부등식을 만족하는 자연수", "반올림 조건을 만족하는 가장 작은 소수", "두 반올림 나눗셈을 모두 만족하는 자연수"]),
        detailed("식 세워 풀기", "decimalDivisionEquationAdvanced", ["일직선 위 다섯 점의 선분 길이", "가로와 세로를 늘린 직사각형의 처음 넓이", "폭이 일정한 직사각형 공원의 둘레", "정삼각형으로 이룬 도형의 한 변", "왕복하는 두 사람의 두 번째 만남", "늦게 출발해 반대 방향으로 만나는 두 사람"])
      ],
      ["비와 비율",
        detailed("비와 비율", "ratioComparisonAdvanced", ["가로·세로의 비와 둘레로 넓이 구하기", "두 수의 차와 비율로 한 수 구하기", "넓이의 비로 사다리꼴의 두 밑변의 비 구하기", "주고받은 뒤의 비율로 준 개수 구하기", "이어진 두 비율로 새로운 비율 구하기", "겹치는 두 집단의 전체 비율 구하기"]),
        detailed("백분율", "percentageAdvanced", ["배수 관계를 백분율로 나타내기", "두 가격의 인상률 비교하기", "예보 결과의 실제 적중률 구하기", "두 집단의 추첨 비율로 당첨자 수 구하기", "덤과 할인 조건의 가격 차 구하기", "겹치는 백분율 조건의 인원 구하기"]),
        detailed("여러 가지 비율", "multipleRatesAdvanced", ["합격률과 최종 합격자 수로 지원자 수 구하기", "무효표와 득표 차로 득표율 구하기", "세 도시의 인구 밀도 비교하기", "생산량이 달라진 뒤 불량률 조건 구하기", "이자와 기간으로 월 이자율 구하기", "엥겔 지수와 소득 비율로 식료품비 구하기"]),
        detailed("가격과 진하기", "priceConcentrationAdvanced", ["정가와 할인가로 할인율 순서 정하기", "덤과 할인 조건의 전체 할인율 구하기", "여러 판매 가격의 전체 이익 구하기", "두 용액을 섞은 뒤의 진하기 구하기", "혼합 용액을 사용한 뒤 남은 용질의 양", "용액을 덜고 물을 보충한 뒤의 진하기"]),
        detailed("식 세워 풀기 1", "ratioEquationOneAdvanced", ["여러 날 먹고 남은 비율로 처음 양 구하기", "가로·세로 변화와 넓이 차로 길이의 비 구하기", "넓이의 비로 사다리꼴의 선분 길이 구하기", "기본 적립과 특별 적립을 구분해 기간 구하기", "연속한 재산 비율로 두 사람의 비 구하기", "용기 속 양과 무게 변화로 남은 무게 구하기"]),
        detailed("식 세워 풀기 2", "ratioEquationTwoAdvanced", ["두 용액을 섞어 목표 진하기 만들기", "증발한 물의 양으로 진하기 맞추기", "용질을 더하고 물을 넣어 목표 진하기 만들기", "정가 할인 뒤 남은 이익률 구하기", "할인율이 다른 두 물건의 정가 구하기", "정가 판매와 할인 판매의 개수 구하기"])
      ],
      ["여러 가지 그래프",
        detailed("그림그래프", "pictureGraphAdvanced", ["평균 조건으로 빠진 그림그래프 완성하기", "평균과 차로 마을별 학생 수 구하기", "기계 한 대당 평균 생산량 비교하기", "그림그래프의 최댓값·최솟값과 평균 구하기", "반올림 그림그래프가 나타내는 수의 최대 차", "이동 전후 그림그래프의 평균 구하기"]),
        detailed("띠그래프", "stripGraphAdvanced", ["학급 비율과 선호도 비율을 함께 계산하기", "두 집단 띠그래프의 실제 인원 차 구하기", "여러 시기의 구간별 비율 차 구하기", "부분 비율 관계로 빠진 띠그래프 구간 구하기", "영역별 정답률로 틀린 문항 수 구하기", "자료표를 띠그래프로 나타낸 넓이 차 구하기"]),
        detailed("원그래프", "pieGraphAdvanced", ["합과 차가 주어진 두 원그래프 구간 구하기", "두 원그래프의 실제 수 비교하기", "전체가 다른 두 원그래프를 합쳐 비율 구하기", "성분 원그래프로 하루 필요량 구하기", "각도와 금액이 섞인 두 원그래프 비교하기", "겹치는 두 원그래프로 합집합 인원 구하기"]),
        detailed("띠그래프와 원그래프", "combinedGraphAdvanced", ["찬반 원그래프와 이유 띠그래프 함께 읽기", "성별 원그래프와 선택 항목 띠그래프 결합하기", "후보별 원그래프와 성별 띠그래프 결합하기", "전체 항목과 하위 항목 그래프 결합하기", "원그래프와 도수표로 평균 구하기", "전체 구성과 하위 비율로 빠진 비율 구하기"])
      ],
      ["직육면체의 부피와 겉넓이",
        detailed("직육면체의 겉넓이", "cubeSurfaceAdvanced", ["연결한 정육면체의 겉넓이 최댓값·최솟값", "바닥 칸별 높이로 쌓은 입체도형의 겉넓이", "정육면체에 낸 관통 구멍의 겉넓이", "작은 정육면체로 자른 뒤 겉넓이의 배수", "표면의 정육면체를 제거한 뒤의 겉넓이", "직육면체 조각들의 겉넓이 합과 원래 겉넓이의 비"]),
        detailed("직육면체의 부피", "cuboidVolumeAdvanced", ["정육면체로 만들 수 있는 서로 다른 직육면체", "높이표로 나타낸 입체도형의 부피와 겉넓이", "높은 흙을 옮겨 두 부분의 높이 같게 만들기", "세 방향의 끈 길이로 직육면체 부피 구하기", "같은 상자를 묶은 끈 길이로 상자 부피 구하기", "18개 조각의 크기로 원래 직육면체 부피 구하기"]),
        detailed("겉넓이와 부피", "surfaceVolumeAdvanced", ["홈이 있는 직육면체의 겉넓이로 부피 구하기", "이어 붙인 정육면체의 부피로 겉넓이 구하기", "서로 이웃한 세 면의 넓이로 부피 구하기", "층층이 쌓은 정육면체의 색칠되지 않은 면 넓이", "위·앞에서 본 직사각형 조건으로 부피 구하기", "계단 모양 쌓기의 겉넓이로 층수 구하기"]),
        detailed("부피의 활용", "volumeApplicationAdvanced", ["용기를 다른 면으로 세운 뒤 물의 높이", "두께가 있는 직육면체 그릇의 들이", "열린 수조를 기울여 쏟아진 물의 양", "잠긴 물체의 부피로 올라간 물높이", "물속에 세운 막대로 달라진 물높이", "칸막이를 뺀 뒤 같아진 물높이"])
      ]
    ]),
    semester("6-2", [
      ["분수의 나눗셈",
        detailed("분수 나눗셈의 이해", "secondFractionDivisionUnderstanding", ["복합 분수 계산식의 빈칸 역산", "정의된 두 연산을 차례로 계산하기", "규칙적인 분수 나눗셈 수열의 항 비교", "나눗셈 결과를 기호로 나타낸 식 계산하기", "두 대분수 사이에 드는 분수의 분자 찾기", "여러 기호가 들어간 분수식의 값 구하기"]),
        detailed("분수 나눗셈의 활용", "secondFractionDivisionApplication", ["넓이의 분수 관계로 색칠한 부분의 넓이 구하기", "물을 넣고 덜어 낸 뒤 처음 양 구하기", "작업과 휴식을 반복한 뒤 끝나는 시각 구하기", "기계 수가 줄어드는 공동 작업 시간 구하기", "좌석 수의 분수 조건으로 등급별 좌석 구하기", "정사각형 넓이와 분할 조건으로 한 변 구하기"]),
        detailed("분수 나눗셈 응용", "secondFractionDivisionChallenge", ["연분수 계산하기", "규칙적인 분수의 합 계산하기", "수 카드로 만든 대분수 나눗셈의 최댓값과 최솟값", "여러 분수로 나누어 자연수가 되는 수 찾기", "연립 분수식에서 자연수 기호값 구하기", "두 나눗셈 조건을 만족하는 자연수의 합 구하기"]),
        detailed("단위량을 구하여 풀기", "secondFractionDivisionUnitRate", ["도형을 여러 번 칠하는 데 필요한 양 구하기", "구간별 속력이 다른 이동 시간 구하기", "일정하게 줄어드는 양의 전체 시간 구하기", "서로 다른 속력으로 이동한 사람의 출발 시각 구하기", "혼자와 함께 일한 시간을 나누어 구하기", "여러 수도관의 시간차와 물통 용량 구하기"]),
        detailed("식을 세워 풀기", "secondFractionDivisionEquation", ["여러 도형을 만들고 남은 막대 길이 구하기", "과목별 점수의 분수 관계로 총점 구하기", "작물별 분수 관계로 전체 수 구하기", "가로와 세로 변화에 따른 원래 넓이 구하기", "평지·오르막·내리막의 거리와 시간 구하기", "물통의 분수 높이 변화로 전체 높이 구하기"]),
        detailed("분수와 소수의 혼합 계산", "secondFractionDecimalMixed", ["분수와 소수가 섞인 복합 계산", "이동 거리와 연료 사용량으로 연비 구하기", "나눗셈 몫의 범위로 자연수 찾기", "두 트랙에서 이동한 거리의 차 구하기", "병과 음료의 무게 변화로 빈 병 무게 구하기", "사다리꼴 넓이와 혼합수 치수로 높이 구하기"])
      ],
      ["소수의 나눗셈",
        detailed("소수 나눗셈의 이해", "secondDecimalDivisionUnderstanding", ["기준 몫보다 큰 나눗셈 모두 찾기", "두 부등식을 함께 만족하는 자연수 개수", "곱의 범위를 만족하는 소수 한 자리 수", "몫의 자리 조건으로 빠진 숫자 찾기", "수 카드로 몫이 가장 큰 나눗셈 만들기", "수 카드와 몫의 범위로 가능한 수 개수"]),
        detailed("소수 나눗셈의 활용", "secondDecimalDivisionApplication", ["양쪽에 일정한 간격으로 놓은 물건 수", "겹쳐 붙인 테이프의 전체 길이", "넓이의 비로 도형의 길이 구하기", "겹친 삼각형의 넓이와 길이", "서로 마주 걷는 두 사람의 만나는 시각", "이어 붙인 직사각형의 빠진 넓이"]),
        detailed("어림하여 몫 구하기", "secondDecimalDivisionRounding", ["서로 다른 자리에서 반올림한 몫의 차", "수 카드로 만든 가장 큰 몫 반올림하기", "반올림 조건을 만족하는 빠진 숫자", "적재 한도에 맞는 최대 상자 수", "반올림한 몫으로 나누는 수 찾기", "상자에 넣을 수 있는 정육면체 개수"]),
        detailed("소수 나눗셈의 나머지", "secondDecimalDivisionRemainder", ["나머지의 크기 비교하기", "몫과 나머지로 나누어지는 수 찾기", "나누는 수를 바꾼 뒤 나머지 구하기", "나누어떨어지게 더할 가장 작은 소수", "같은 수를 다른 수로 나눈 나머지", "몫과 나머지로 원래 수 구하기"]),
        detailed("단위량을 구하여 풀기", "secondDecimalDivisionUnitRate", ["일정한 빠르기로 이동한 시간", "자동차별 연료 효율 비교", "수도관의 분당 양과 물값", "강물의 흐름과 배의 이동 시간", "용기와 내용물의 단위 무게", "일정하게 줄어드는 양의 남은 시간"]),
        detailed("식을 세워 풀기", "secondDecimalDivisionEquation", ["튀어 오르는 공과 계단 높이", "물통의 들이와 남은 높이", "소리의 속력과 기온", "물에 잠긴 막대의 길이", "학생 수의 전년 대비 변화", "두 공의 튀어 오른 높이 관계"])
      ],
      ["공간과 입체",
        detailed("위, 앞, 옆에서 본 그림", "spaceViewsAdvanced", ["높이표에서 앞·옆 투영의 넓이 구하기", "한 개를 빼도 투영이 같은 위치의 수", "세 방향 투영을 만족하는 쌓기의 수", "높이표로 만든 입체의 겉넓이 구하기", "쌓기나무를 뺀 뒤 투영 변화 구하기", "층별 색 규칙이 있는 쌓기의 색 개수"]),
        detailed("쌓기나무의 개수", "stackingCubeCountAdvanced", ["속이 빈 정육면체 규칙의 개수", "세 방향 투영으로 최소·최대 개수 구하기", "구멍이 반복되는 입체의 개수와 겉넓이", "세 방향 투영을 만족하는 방법의 수", "계단 모양에서 보이지 않는 쌓기나무", "바닥 모양과 전체 개수로 쌓는 방법의 수"]),
        detailed("색칠한 쌓기나무의 개수", "paintedStackingCubesAdvanced", ["색칠한 큰 정육면체의 내부 조각 수", "높이표 입체의 색칠 면 개수 분류", "층별 쌓기의 여러 면 색칠 조각 수", "높이표 입체의 색칠한 넓이", "직육면체의 두 면 색칠 조각 수", "복합 쌓기의 색칠 면 개수 분류"]),
        detailed("여러 가지 문제", "spaceCuttingAdvanced", ["한 층을 지나는 절단면의 쌓기나무 수", "서로 수직인 세 절단면이 지나는 개수", "여러 평행 절단면이 지나는 개수", "쌓기나무 한 개를 더한 서로 다른 모양", "색 규칙에 따라 조각을 뺀 뒤의 개수", "쌓기나무를 뺀 뒤 앞에서 본 넓이"])
      ],
      ["비례식과 비례배분", "비의 성질과 비례식", "비례식의 성질", "비례식을 세워 풀기", "연비(이어진 비)", "비례배분", "비례배분의 활용"],
      ["원의 넓이", "원주와 호의 길이", "원과 부채꼴의 넓이", "복잡한 도형의 넓이 ①", "복잡한 도형의 넓이 ②", "자취의 길이와 넓이", "여러 가지 문제"],
      ["원기둥, 원뿔, 구", "원기둥", "원뿔", "여러 가지 회전체", "원기둥과 원뿔의 겉넓이"]
    ])
  ];

  const buildSourceSemester41 = legacySemester => {
    const inventory = window.HSE_SOURCE_INVENTORY_41;
    if (!inventory?.items?.length) return legacySemester;

    const units = [];
    for (const item of inventory.items) {
      let unit = units.find(entry => entry.number === item.unit);
      if (!unit) {
        unit = { number: item.unit, name: item.unitName, groups: [] };
        units.push(unit);
      }
      let group = unit.groups.find(entry => entry.number === item.exploration);
      if (!group) {
        group = { number: item.exploration, name: item.groupTitle, types: [] };
        unit.groups.push(group);
      }
      group.types.push({
        label: item.typeLabel,
        generatorKey: item.generatorKey,
        variant: item.variant,
        difficultyBand: item.difficultyBand,
        sourceTier: item.sourceTier,
        sourceVerified: item.sourceVerified,
        sourceEvidence: `4-1 원문 PDF p.${item.sourcePdfPage} · 교재 p.${item.sourcePrintedPage} · ${item.sourceItemId}`,
        sourceItemId: item.sourceItemId,
        sourceItemLabel: item.sourceItemLabel,
        sourceSection: item.sourceSection,
        sourcePdfPage: item.sourcePdfPage,
        sourcePrintedPage: item.sourcePrintedPage,
        reviewLocked: item.reviewLocked,
        reviewReason: item.reviewReason || item.reviewLockReason || ""
      });
    }

    units.sort((a, b) => a.number - b.number);
    for (const unit of units) unit.groups.sort((a, b) => a.number - b.number);
    return semester("4-1", units.map(unit => [
      unit.name,
      ...unit.groups.map(group => ({ name: group.name, types: group.types }))
    ]));
  };

  const buildSourceSemester42Quadrilateral = legacySemester => {
    const inventory = window.HSE_SOURCE_INVENTORY_42_QUADRILATERAL;
    if (!inventory?.items?.length) return legacySemester;

    const groups = [];
    for (const item of inventory.items) {
      let group = groups.find(entry => entry.number === item.exploration);
      if (!group) {
        group = { number: item.exploration, name: item.groupTitle, types: [] };
        groups.push(group);
      }
      group.types.push({
        id: item.runtimeTypeId || "",
        label: item.typeLabel,
        generatorKey: item.generatorKey,
        variant: item.variant,
        difficultyBand: item.difficultyBand,
        sourceTier: item.sourceTier,
        sourceVerified: item.sourceVerified,
        sourceEvidence: `4-2 심화 PDF p.${item.sourcePdfPage} · 교재 p.${item.sourcePrintedPage} · ${item.sourceItemId}`,
        sourceItemId: item.sourceItemId,
        sourceItemLabel: item.sourceItemLabel,
        sourceSection: item.sourceSection,
        sourcePdfPage: item.sourcePdfPage,
        sourcePrintedPage: item.sourcePrintedPage,
        reviewLocked: item.reviewLocked,
        reviewReason: item.reviewReason,
        generationMode: item.generationMode,
        implementationStatus: item.implementationStatus,
        verifiedVariantTarget: item.verifiedVariantTarget,
        verifiedVariantCount: item.verifiedVariantCount,
        verifiedVariantProvenance: item.reviewLocked ? [] : ["source-values", "source-structure-variant", "source-structure-variant"],
        answerVisualRequired: item.answerVisualRequired,
        answerVisualStatus: item.answerVisualStatus,
        status: item.reviewLocked ? "review-locked" : "verified"
      });
    }

    groups.sort((first, second) => first.number - second.number);
    const rebuiltUnit = semester("4-2", [
      ["자리표시"],
      ["자리표시"],
      ["자리표시"],
      [inventory.unitName, ...groups.map(group => ({ name: group.name, types: group.types }))]
    ]).units[3];

    return {
      ...legacySemester,
      units: legacySemester.units.map(unit => unit.number === inventory.unit ? rebuiltUnit : unit)
    };
  };

  const buildSourceSemesterGrade6 = legacySemester => {
    const inventory = window.HSE_SOURCE_INVENTORY_GRADE6;
    const sourceItems = inventory?.items?.filter(item => item.semester === legacySemester.id) || [];
    if (!sourceItems.length) return legacySemester;

    return {
      ...legacySemester,
      units: legacySemester.units.map(unit => {
        const unitItems = sourceItems.filter(item => item.unit === unit.number);
        if (!unitItems.length) return unit;
        const byExploration = new Map();
        unitItems.forEach(item => {
          const group = byExploration.get(item.exploration) || [];
          group.push(item);
          byExploration.set(item.exploration, group);
        });

        let typeNumber = 0;
        const sourceGroups = [...byExploration.entries()].sort((left, right) => left[0] - right[0]).map(([exploration, items], groupIndex) => ({
          id: `${unit.id}-source-e${exploration}`,
          number: groupIndex + 1,
          name: `개념탐구 ${exploration} 원문 유형`,
          types: items.map((item, index) => ({
            id: item.sourceItemId,
            number: index + 1,
            typeNumber: ++typeNumber,
            name: item.typeLabel,
            label: item.typeLabel,
            generatorKey: item.generatorKey || "",
            variant: Number.isInteger(item.variant) ? item.variant : undefined,
            difficultyBand: item.difficultyBand,
            sourceTier: item.sourceTier,
            sourceVerified: item.sourceVerified,
            sourceEvidence: `황소 초등 심화 원문 직접 확인 · ${item.sourceItemId}`,
            sourceItemId: item.sourceItemId,
            rawSourceItemId: item.rawSourceItemId,
            sourceItemLabel: item.sourceItemLabel,
            sourceSection: item.sourceSection,
            reviewLocked: item.reviewLocked,
            reviewReason: item.reviewReason,
            commonTypeId: item.commonTypeId,
            commonPublicTypeId: item.commonPublicTypeId,
            commonPublicVariant: item.commonPublicVariant,
            sourceRelationship: item.sourceRelationship,
            normalizedTypeId: item.normalizedTypeId,
            problemVisualRequired: item.problemVisualRequired,
            answerVisualRequired: item.answerVisualRequired,
            answerVisualStatus: item.answerVisualStatus,
            generationMode: item.generationMode,
            verifiedVariantTarget: item.verifiedVariantTarget,
            verifiedVariantCount: item.verifiedVariantCount
          }))
        }));

        let legacyNumber = 0;
        const legacyTypes = unit.subunits.flatMap(subunit => subunit.types.map(type => ({
          ...type,
          number: ++legacyNumber,
          typeNumber: ++typeNumber
        })));
        const legacyGroup = {
          id: `${unit.id}-legacy-generated`,
          number: sourceGroups.length + 1,
          name: "기존 생성 문제",
          types: legacyTypes
        };
        return { ...unit, subunits: [...sourceGroups, legacyGroup] };
      })
    };
  };

  semesters[0] = buildSourceSemester41(semesters[0]);
  const semester42Index = semesters.findIndex(item => item.id === "4-2");
  if (semester42Index >= 0) semesters[semester42Index] = buildSourceSemester42Quadrilateral(semesters[semester42Index]);
  for (const semesterId of ["6-1", "6-2"]) {
    const index = semesters.findIndex(item => item.id === semesterId);
    if (index >= 0) semesters[index] = buildSourceSemesterGrade6(semesters[index]);
  }

  const semester42 = semesters.find(item => item.id === "4-2");
  const quadrilateralUnit42 = semester42?.units.find(item => item.number === 4);
  quadrilateralUnit42?.subunits.forEach(subunit => subunit.types.forEach(type => {
    if (type.sourceItemId) return;
    type.sourceVerified = false;
    type.reviewLocked = true;
    type.reviewReason = "현행 심화 원본의 문항 번호와 그림 구조가 연결되지 않아 출제하지 않습니다.";
    type.generationMode = "review-locked";
    type.verifiedVariantCount = 0;
    type.answerVisualStatus = "locked";
  }));

  // Directly reviewed source items; existing locked types remain intact.
  const source52Cuboid = semesters.find(item => item.id === "5-2")?.units.find(unit => unit.id === "5-2-u5");
  const source52CuboidProperties = source52Cuboid?.subunits.find(subunit => subunit.id === "5-2-u5-s1");
  if (source52CuboidProperties) {
    const typeNumber = Math.max(0, ...source52Cuboid.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
    source52CuboidProperties.types.push({
      id: "5-2-u5-e1-mission-4", number: source52CuboidProperties.types.length + 1, typeNumber,
      name: "3×3×3 쌓기나무에서 만들 수 있는 정육면체 수 세기",
      label: "3×3×3 쌓기나무에서 만들 수 있는 정육면체 수 세기",
      difficultyBand: 0, sourceItemId: "5-2-u5-e1-mission-4", sourceItemLabel: "Mission 4",
      sourceSection: "mission", sourceTier: "advanced", sourcePdfPage: 45, sourcePrintedPage: 49,
      sourceVerified: true, publisherKeyVerified: false, reviewLocked: false,
      generatorKey: "source52Cuboid27CubesPage49Mission4", generationMode: "fixed-verified-pool",
      verifiedVariantTarget: 1, verifiedVariantCount: 1, answerVisualRequired: true,
      answerVisualStatus: "verified-reconstruction", implementationStatus: "fixed-verified-pool"
    });
    for (const [ordinal, name, generatorKey] of [
      [2, "앞과 위에서 본 직육면체의 옆면 둘레", "source52CuboidViewsSidePerimeterPage49Mission2"],
      [3, "세 방향으로 묶은 상자의 테이프 길이", "source52CuboidTapeWrapPage49Mission3"],
      [6, "정육면체를 아홉 조각으로 자른 모든 모서리의 길이", "source52CuboidNinePieceEdgeSumPage49Mission6"]
    ]) {
      const id = `5-2-u5-e1-mission-${ordinal}`;
      const typeNumber = Math.max(0, ...source52Cuboid.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
      source52CuboidProperties.types.push({
        id, number: source52CuboidProperties.types.length + 1, typeNumber, name, label: name,
        difficultyBand: 0, sourceItemId: id, sourceItemLabel: `Mission ${ordinal}`,
        sourceSection: "mission", sourceTier: "advanced", sourcePdfPage: 45, sourcePrintedPage: 49,
        sourceVerified: true, publisherKeyVerified: false, reviewLocked: false,
        generatorKey, generationMode: "fixed-verified-pool", verifiedVariantTarget: 1,
        verifiedVariantCount: 1, answerVisualRequired: ordinal === 6,
        answerVisualStatus: ordinal === 6 ? "verified-reconstruction" : "not-required",
        implementationStatus: "fixed-verified-pool"
      });
    }
    for (const [section, ordinal, name, generatorKey, pdfPage, printedPage, answerVisualRequired] of [
      ["example", 2, "위·옆 그림에서 직육면체의 모서리 합", "source52CuboidViewsPage48Example12", 44, 48, false],
      ["example", 3, "직육면체를 네 조각으로 자른 모서리 합", "source52CuboidFourPiecesPage48Example13", 44, 48, false],
      ["mission", 5, "직육면체 8개로 만들 수 있는 서로 다른 모양", "source52CuboidEightBlocksPage49Mission5", 45, 49, true]
    ]) {
      const id = `5-2-u5-e1-${section}-${ordinal}`;
      const typeNumber = Math.max(0, ...source52Cuboid.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
      source52CuboidProperties.types.push({
        id, number: source52CuboidProperties.types.length + 1, typeNumber, name, label: name,
        difficultyBand: 0, sourceItemId: id, sourceItemLabel: section === "example" ? `예제 1-${ordinal}` : `Mission ${ordinal}`,
        sourceSection: section, sourceTier: "advanced", sourcePdfPage: pdfPage, sourcePrintedPage: printedPage,
        sourceVerified: true, publisherKeyVerified: false, reviewLocked: false, generatorKey,
        generationMode: "fixed-verified-pool", verifiedVariantTarget: 1, verifiedVariantCount: 1,
        answerVisualRequired, answerVisualStatus: answerVisualRequired ? "verified-reconstruction" : "not-required",
        implementationStatus: "fixed-verified-pool"
      });
    }
  }

  const source52CuboidNets = source52Cuboid?.subunits.find(subunit => subunit.id === "5-2-u5-s2");
  if (source52CuboidNets) {
    for (const [ordinal, name, generatorKey] of [
      [1, "전개도 색칠 면에서 선분 길이 구하기", "source52CuboidNetSegmentLengthPage50Example21"],
      [2, "정사각형 종이 전개도로 만든 직육면체의 모서리 합", "source52CuboidSquarePaperNetEdgeSumPage50Example22"],
      [3, "정육면체 전개도로 접을 수 있는 면 고르기", "source52CubeNetCandidateFacePage50Example23"],
      [4, "직육면체 전개도의 가장 긴 둘레와 가장 짧은 둘레", "source52CuboidNetPerimeterExtremaPage50Example24"]
    ]) {
      const id = `5-2-u5-e2-example-2-${ordinal}`;
      const typeNumber = Math.max(0, ...source52Cuboid.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
      source52CuboidNets.types.push({
        id, number: source52CuboidNets.types.length + 1, typeNumber, name, label: name,
        difficultyBand: 0, sourceItemId: id, sourceItemLabel: `예제 2-${ordinal}`,
        sourceSection: "example", sourceTier: "advanced", sourcePdfPage: 46, sourcePrintedPage: 50,
        sourceVerified: true, publisherKeyVerified: false, reviewLocked: false, generatorKey,
        generationMode: "fixed-verified-pool", verifiedVariantTarget: 1, verifiedVariantCount: 1,
        answerVisualRequired: true, answerVisualStatus: "verified-reconstruction", implementationStatus: "fixed-verified-pool"
      });
    }
  }


  if (source52CuboidNets) {
    for (const [ordinal, name, generatorKey] of [
      [1, "직육면체 전개도의 둘레 구하기", "source52CuboidNetPaperPerimeterPage51Mission1"],
      [2, "정사각형 종이 전개도로 만든 직육면체의 모서리 합", "source52CuboidNetPaperEdgeSumPage51Mission2"],
      [3, "세 방향에서 본 직육면체 전개도의 가장 짧은 둘레", "source52CuboidNetMinPerimeterPage51Mission3"],
      [4, "두 정육면체 전개도에서 겹치는 면 찾기", "source52TwoCubeNetsOverlapPage51Mission4"],
      [5, "직육면체 전개도의 색칠한 부분 넓이", "source52CuboidShadedNetAreaPage51Mission5"],
      [6, "정육면체 전개도 둘레로 모서리 합 구하기", "source52CuboidNetPerimeterPage51Mission6"]
    ]) {
      const id = `5-2-u5-e2-mission-${ordinal}`;
      const typeNumber = Math.max(0, ...source52Cuboid.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
      source52CuboidNets.types.push({
        id, number: source52CuboidNets.types.length + 1, typeNumber, name, label: name,
        difficultyBand: 0, sourceItemId: id, sourceItemLabel: `Mission ${ordinal}`,
        sourceSection: "mission", sourceTier: "advanced", sourcePdfPage: 47, sourcePrintedPage: 51,
        sourceVerified: true, publisherKeyVerified: false, reviewLocked: false, generatorKey,
        generationMode: "fixed-verified-pool", verifiedVariantTarget: 1, verifiedVariantCount: 1,
        answerVisualRequired: ordinal !== 4 && ordinal !== 6, answerVisualStatus: ordinal !== 4 && ordinal !== 6 ? "verified-reconstruction" : "not-required", implementationStatus: "fixed-verified-pool"
      });
    }
  }


  const source52Dice = source52Cuboid?.subunits.find(subunit => subunit.id === "5-2-u5-s5");
  if (source52Dice) {
    for (const [ordinal, name, generatorKey] of [
      [1, "이어 붙인 주사위의 면에 적힌 수 구하기", "source52CuboidPage54Example41"],
      [2, "세 방향의 주사위 그림으로 마주 보는 면 찾기", "source52CuboidPage54Example42"],
      [3, "붙인 주사위의 바깥 면 눈의 합", "source52CuboidPage54Example43"],
      [4, "주사위 겉면 눈의 합의 최댓값과 최솟값", "source52CuboidPage54Example44"]
    ]) {
      const id = `5-2-u5-e4-example-4-${ordinal}`;
      const typeNumber = Math.max(0, ...source52Cuboid.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
      source52Dice.types.push({
        id, number: source52Dice.types.length + 1, typeNumber, name, label: name,
        difficultyBand: 0, sourceItemId: id, sourceItemLabel: `예제 4-${ordinal}`,
        sourceSection: "example", sourceTier: "advanced", sourcePdfPage: 50, sourcePrintedPage: 54,
        sourceVerified: true, publisherKeyVerified: false, reviewLocked: false, generatorKey,
        generationMode: "fixed-verified-pool", verifiedVariantTarget: 1, verifiedVariantCount: 1,
        answerVisualRequired: true, answerVisualStatus: "verified-reconstruction", implementationStatus: "fixed-verified-pool"
      });
    }
  }


  if (source52Dice) {
    const id = "5-2-u5-e4-exploration-1", name = "전개도로 만든 주사위를 굴린 바닥면의 합";
    const typeNumber = Math.max(0, ...source52Cuboid.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
    source52Dice.types.push({
      id, number: source52Dice.types.length + 1, typeNumber, name, label: name,
      difficultyBand: 0, sourceItemId: id, sourceItemLabel: "개념탐구 4",
      sourceSection: "exploration", sourceTier: "advanced", sourcePdfPage: 50, sourcePrintedPage: 54,
      sourceVerified: true, publisherKeyVerified: false, reviewLocked: false, generatorKey: "source52CuboidRollPage54Exploration4",
      generationMode: "fixed-verified-pool", verifiedVariantTarget: 1, verifiedVariantCount: 1,
      answerVisualRequired: true, answerVisualStatus: "verified-reconstruction", implementationStatus: "fixed-verified-pool"
    });
  }


  if (source52Dice) {
    for (const [ordinal, name, generatorKey] of [
      [1, "다섯 정육면체의 맞붙은 면으로 빈 숫자 찾기", "source52CuboidDiceChainPage55Mission1"],
      [2, "세 방향 그림으로 마주 보는 글자 찾기", "source52CubeThreeViewsOppositesPage55Mission2"],
      [3, "전개도로 쌓은 정육면체의 뒤쪽 수 합", "source52CuboidNetStackBackSumPage55Mission3"],
      [4, "벽에 쌓은 주사위의 보이지 않는 눈의 합", "source52FourDiceWallHiddenPipsPage55Mission4"],
      [5, "90번 굴린 주사위의 보이는 면", "source52CuboidDiceRollNinetiethFacePage55Mission5"],
      [6, "붙인 주사위 겉면 눈의 합 최댓값", "source52FourDiceOuterPipsMaxPage55Mission6"]
    ]) {
      const id = `5-2-u5-e4-mission-${ordinal}`;
      const typeNumber = Math.max(0, ...source52Cuboid.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
      source52Dice.types.push({
        id, number: source52Dice.types.length + 1, typeNumber, name, label: name,
        difficultyBand: 0, sourceItemId: id, sourceItemLabel: `Mission ${ordinal}`,
        sourceSection: "mission", sourceTier: "advanced", sourcePdfPage: 51, sourcePrintedPage: 55,
        sourceVerified: true, publisherKeyVerified: false, reviewLocked: false, generatorKey,
        generationMode: "fixed-verified-pool", verifiedVariantTarget: 1, verifiedVariantCount: 1,
        answerVisualRequired: ordinal >= 5, answerVisualStatus: ordinal === 5 ? "verified-drawing" : ordinal === 6 ? "verified-contact-witnesses" : "not-required", implementationStatus: "fixed-verified-pool"
      });
    }
  }

  const source52Average = semesters.find(semester => semester.id === "5-2")?.units.find(unit => unit.id === "5-2-u6");
  const source52AverageFirst = source52Average?.subunits.find(subunit => subunit.name === "평균 구하기");
  if (source52AverageFirst) {
    const id = "5-2-u6-e1-exploration", name = "키 표를 보고 평균 구하기";
    const typeNumber = Math.max(0, ...source52Average.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
    source52AverageFirst.types.push({
      id, number: source52AverageFirst.types.length + 1, typeNumber, name, label: name,
      difficultyBand: 0, sourceItemId: id, sourceItemLabel: "개념탐구 1", sourceSection: "exploration", sourceTier: "advanced",
      sourcePdfPage: 54, sourcePrintedPage: 58, sourceVerified: true, publisherKeyVerified: false, reviewLocked: false,
      generatorKey: "source52AverageOriginalPage58Exploration1", generationMode: "fixed-verified-pool", verifiedVariantTarget: 3, verifiedVariantCount: 3,
      answerVisualRequired: false, answerVisualStatus: "not-required", implementationStatus: "fixed-verified-pool"
    });
  }

  if (source52AverageFirst) {
    const id = "5-2-u6-e1-example-1", name = "평균과 찢어진 성적표로 점수 구하기";
    const typeNumber = Math.max(0, ...source52Average.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
    source52AverageFirst.types.push({
      id, number: source52AverageFirst.types.length + 1, typeNumber, name, label: name,
      difficultyBand: 0, sourceItemId: id, sourceItemLabel: "예제 1-1", sourceSection: "example", sourceTier: "advanced",
      sourcePdfPage: 54, sourcePrintedPage: 58, sourceVerified: true, publisherKeyVerified: false, reviewLocked: false,
      generatorKey: "source52AverageOriginalPage58Example11", generationMode: "fixed-verified-pool", verifiedVariantTarget: 3, verifiedVariantCount: 3,
      answerVisualRequired: false, answerVisualStatus: "not-required", implementationStatus: "fixed-verified-pool"
    });
  }

  if (source52AverageFirst) {
    const id = "5-2-u6-e1-example-2", name = "겹치는 평균으로 가운데 기록 구하기";
    const typeNumber = Math.max(0, ...source52Average.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
    source52AverageFirst.types.push({
      id, number: source52AverageFirst.types.length + 1, typeNumber, name, label: name,
      difficultyBand: 0, sourceItemId: id, sourceItemLabel: "예제 1-2", sourceSection: "example", sourceTier: "advanced",
      sourcePdfPage: 54, sourcePrintedPage: 58, sourceVerified: true, publisherKeyVerified: false, reviewLocked: false,
      generatorKey: "source52AverageOriginalPage58Example12", generationMode: "fixed-verified-pool", verifiedVariantTarget: 3, verifiedVariantCount: 3,
      answerVisualRequired: false, answerVisualStatus: "not-required", implementationStatus: "fixed-verified-pool"
    });
  }

  if (source52AverageFirst) {
    const id = "5-2-u6-e1-example-3", name = "기온과 수온 그래프에서 평균의 차 구하기";
    const typeNumber = Math.max(0, ...source52Average.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
    source52AverageFirst.types.push({
      id, number: source52AverageFirst.types.length + 1, typeNumber, name, label: name,
      difficultyBand: 0, sourceItemId: id, sourceItemLabel: "예제 1-3", sourceSection: "example", sourceTier: "advanced",
      sourcePdfPage: 54, sourcePrintedPage: 58, sourceVerified: true, publisherKeyVerified: false, reviewLocked: false,
      generatorKey: "source52AverageOriginalPage58Example13", generationMode: "fixed-verified-pool", verifiedVariantTarget: 3, verifiedVariantCount: 3,
      answerVisualRequired: false, answerVisualStatus: "not-required", implementationStatus: "fixed-verified-pool"
    });
  }

  if (source52AverageFirst) {
    const id = "5-2-u6-e1-example-4", name = "두 사람의 시험 평균으로 빈 점수 구하기";
    const typeNumber = Math.max(0, ...source52Average.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
    source52AverageFirst.types.push({
      id, number: source52AverageFirst.types.length + 1, typeNumber, name, label: name,
      difficultyBand: 0, sourceItemId: id, sourceItemLabel: "예제 1-4", sourceSection: "example", sourceTier: "advanced",
      sourcePdfPage: 54, sourcePrintedPage: 58, sourceVerified: true, publisherKeyVerified: false, reviewLocked: false,
      generatorKey: "source52AverageOriginalPage58Example14", generationMode: "fixed-verified-pool", verifiedVariantTarget: 3, verifiedVariantCount: 3,
      answerVisualRequired: false, answerVisualStatus: "not-required", implementationStatus: "fixed-verified-pool"
    });
  }

  if (source52AverageFirst) {
    for (const [ordinal, name, generatorKey] of [
      [1, "평균 기호의 계산식에서 빈 수 구하기", "source52AverageOriginalPage59Mission1"],
      [2, "찢어진 성적표의 두 점수 구하기", "source52AverageOriginalPage59Mission2"]
    ]) {
      const id = `5-2-u6-e1-mission-${ordinal}`;
      const typeNumber = Math.max(0, ...source52Average.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
      source52AverageFirst.types.push({id, number:source52AverageFirst.types.length+1, typeNumber, name, label:name,
        difficultyBand:0, sourceItemId:id, sourceItemLabel:`Mission ${ordinal}`, sourceSection:"mission", sourceTier:"advanced",
        sourcePdfPage:55, sourcePrintedPage:59, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, generatorKey,
        generationMode:"fixed-verified-pool", verifiedVariantTarget:3, verifiedVariantCount:3,
        answerVisualRequired:false, answerVisualStatus:"not-required", implementationStatus:"fixed-verified-pool"});
    }
  }

  if (source52AverageFirst) {
    for (const [ordinal, name, generatorKey] of [
      [3, "독서 평균으로 다섯째 날 구하기", "source52AverageOriginalPage59Mission3"],
      [4, "평균 변화로 고치기 전 자연수 구하기", "source52AverageOriginalPage59Mission4"]
    ]) {
      const id = `5-2-u6-e1-mission-${ordinal}`;
      const typeNumber = Math.max(0, ...source52Average.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
      source52AverageFirst.types.push({id, number:source52AverageFirst.types.length+1, typeNumber, name, label:name,
        difficultyBand:0, sourceItemId:id, sourceItemLabel:`Mission ${ordinal}`, sourceSection:"mission", sourceTier:"advanced",
        sourcePdfPage:55, sourcePrintedPage:59, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, generatorKey,
        generationMode:"fixed-verified-pool", verifiedVariantTarget:3, verifiedVariantCount:3,
        answerVisualRequired:false, answerVisualStatus:"not-required", implementationStatus:"fixed-verified-pool"});
    }
  }

  if (source52AverageFirst) {
    for (const [ordinal, name, generatorKey] of [
      [5, "일곱 수가 각각 커진 뒤의 평균", "source52AverageOriginalPage59Mission5"],
      [6, "최고·최저를 뺀 심판 점수의 평균 비교", "source52AverageOriginalPage59Mission6"]
    ]) {
      const id = `5-2-u6-e1-mission-${ordinal}`;
      const typeNumber = Math.max(0, ...source52Average.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
      source52AverageFirst.types.push({id, number:source52AverageFirst.types.length+1, typeNumber, name, label:name,
        difficultyBand:0, sourceItemId:id, sourceItemLabel:`Mission ${ordinal}`, sourceSection:"mission", sourceTier:"advanced",
        sourcePdfPage:55, sourcePrintedPage:59, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, generatorKey,
        generationMode:"fixed-verified-pool", verifiedVariantTarget:3, verifiedVariantCount:3,
        answerVisualRequired:false, answerVisualStatus:"not-required", implementationStatus:"fixed-verified-pool"});
    }
  }

  const source52AverageApplication = source52Average?.subunits.find(subunit => subunit.name === "평균의 활용");
  if (source52AverageApplication) {
    const id = "5-2-u6-e2-exploration", name = "공 넣기 점수와 평균으로 학생 수 구하기";
    const typeNumber = Math.max(0, ...source52Average.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
    source52AverageApplication.types.push({id, number:source52AverageApplication.types.length+1, typeNumber, name, label:name,
      difficultyBand:0, sourceItemId:id, sourceItemLabel:"개념탐구 2", sourceSection:"exploration", sourceTier:"advanced",
      sourcePdfPage:56, sourcePrintedPage:60, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false,
      generatorKey:"source52AverageOriginalPage60Exploration2", generationMode:"fixed-verified-pool", verifiedVariantTarget:3, verifiedVariantCount:3,
      answerVisualRequired:false, answerVisualStatus:"not-required", implementationStatus:"fixed-verified-pool"});
  }

  if (source52AverageApplication) {
    for (const [ordinal, name, generatorKey] of [
      [1, "한 사람의 시간당 작업 넓이", "source52AverageOriginalPage60Example21"],
      [2, "평균 달리기 거리로 첫날 거리 구하기", "source52AverageOriginalPage60Example22"]
    ]) {
      const id = `5-2-u6-e2-example-${ordinal}`;
      const typeNumber = Math.max(0, ...source52Average.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
      source52AverageApplication.types.push({id, number:source52AverageApplication.types.length+1, typeNumber, name, label:name,
        difficultyBand:0, sourceItemId:id, sourceItemLabel:`예제 2-${ordinal}`, sourceSection:"example", sourceTier:"advanced",
        sourcePdfPage:56, sourcePrintedPage:60, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, generatorKey,
        generationMode:"fixed-verified-pool", verifiedVariantTarget:3, verifiedVariantCount:3,
        answerVisualRequired:false, answerVisualStatus:"not-required", implementationStatus:"fixed-verified-pool"});
    }
  }

  if (source52AverageApplication) {
    const id = "5-2-u6-e2-example-4", name = "어른·어린이의 평균 나이와 인원";
    const typeNumber = Math.max(0, ...source52Average.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
    source52AverageApplication.types.push({id, number:source52AverageApplication.types.length+1, typeNumber, name, label:name,
      difficultyBand:0, sourceItemId:id, sourceItemLabel:"예제 2-4", sourceSection:"example", sourceTier:"advanced",
      sourcePdfPage:56, sourcePrintedPage:60, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false,
      generatorKey:"source52AverageOriginalPage60Example24", generationMode:"fixed-verified-pool", verifiedVariantTarget:3, verifiedVariantCount:3,
      answerVisualRequired:false, answerVisualStatus:"not-required", implementationStatus:"fixed-verified-pool"});
  }

  if (source52AverageApplication) {
    for (const [ordinal, name, generatorKey] of [
      [1, "사람 수에 따른 일하는 날짜 구하기", "source52AverageOriginalPage61Mission1"],
      [2, "평균 변화로 가장 큰 수 구하기", "source52AverageOriginalPage61Mission2"]
    ]) {
      const id = `5-2-u6-e2-mission-${ordinal}`;
      const typeNumber = Math.max(0, ...source52Average.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
      source52AverageApplication.types.push({id, number:source52AverageApplication.types.length+1, typeNumber, name, label:name,
        difficultyBand:0, sourceItemId:id, sourceItemLabel:`Mission ${ordinal}`, sourceSection:"mission", sourceTier:"advanced",
        sourcePdfPage:57, sourcePrintedPage:61, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, generatorKey,
        generationMode:"fixed-verified-pool", verifiedVariantTarget:3, verifiedVariantCount:3,
        answerVisualRequired:false, answerVisualStatus:"not-required", implementationStatus:"fixed-verified-pool"});
    }
  }

  if (source52AverageApplication) {
    const id = "5-2-u6-e2-mission-3", name = "시험 점수 변화와 평균 구하기";
    const typeNumber = Math.max(0, ...source52Average.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
    source52AverageApplication.types.push({id, number:source52AverageApplication.types.length+1, typeNumber, name, label:name,
      difficultyBand:0, sourceItemId:id, sourceItemLabel:"Mission 3", sourceSection:"mission", sourceTier:"advanced",
      sourcePdfPage:57, sourcePrintedPage:61, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false,
      generatorKey:"source52AverageOriginalPage61Mission3", generationMode:"fixed-verified-pool", verifiedVariantTarget:3, verifiedVariantCount:3,
      answerVisualRequired:false, answerVisualStatus:"not-required", implementationStatus:"fixed-verified-pool"});
  }

  if (source52AverageApplication) {
    for (const [n,name] of [[5,"여덟 명의 점수와 평균"],[6,"점수별 학생 수와 맞힌 문제"]]) {
      const id = `5-2-u6-e2-mission-${n}`;
      const typeNumber = Math.max(0, ...source52Average.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0))) + 1;
      source52AverageApplication.types.push({id, number:source52AverageApplication.types.length+1, typeNumber, name, label:name,
        difficultyBand:0, sourceItemId:id, sourceItemLabel:`Mission ${n}`, sourceSection:"mission", sourceTier:"advanced",
        sourcePdfPage:57, sourcePrintedPage:61, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false,
        generatorKey:`source52AverageOriginalPage61Mission${n}`, generationMode:"fixed-verified-pool", verifiedVariantTarget:3, verifiedVariantCount:3,
        answerVisualRequired:false, answerVisualStatus:"not-required", implementationStatus:"fixed-verified-pool"});
    }
  }

  if (source52AverageApplication) {
    const id="5-2-u6-e2-passfail-mean-synthetic", name="합격·불합격 두 집단의 평균 · 연습";
    const typeNumber=Math.max(0,...source52Average.subunits.flatMap(subunit=>subunit.types.map(type=>Number(type.typeNumber)||0)))+1;
    source52AverageApplication.types.push({id,number:source52AverageApplication.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceItemLabel:"예제 2-3·Mission 4 구조 연습",sourceSection:"example",sourceTier:"advanced",sourcePdfPage:56,sourcePrintedPage:60,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:"source52PassFailAverageSynthetic",generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문은 선발 기준 확인 전 잠금이며, 평균의 높은 쪽을 명시한 별도 연습을 독립 검산했습니다."});
  }

  const source52Count = source52Average?.subunits.find(subunit => subunit.name === "사건의 가짓수");
  if (source52Count) for (const [i,name] of ["직육면체 모서리의 길 세기","두 주사위 눈의 합과 배수","경유점을 지나는 격자 최단 경로","여러 갈래 길의 수","한 무리가 이웃하여 줄 서기"].entries()) {
    const id = i ? `5-2-u6-e3-example-${i}` : "5-2-u6-e3-exploration";
    const typeNumber = Math.max(0,...source52Average.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Count.types.push({id,number:source52Count.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,
      sourceItemLabel:i ? `예제 3-${i}` : "개념탐구 3",sourceSection:i ? "example" : "exploration",sourceTier:"advanced",sourcePdfPage:58,sourcePrintedPage:62,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,
      generatorKey:i ? `source52CountPage62Example${i}` : "source52CountPage62Exploration",generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool"});
  }

  if (source52Count) for (const [n,name] of [[1,"자기 자리를 피하는 자리 배치"],[2,"두 주사위의 곱과 기준"],[3,"개수 제한 안에서 동전 조합하기"],[4,"B를 지나는 격자 최단 경로"],[6,"두 사람이 이웃하는 줄 세우기"]]) {
    const id = `5-2-u6-e3-mission-${n}`;
    const typeNumber = Math.max(0,...source52Average.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Count.types.push({id,number:source52Count.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceItemLabel:`Mission ${n}`,sourceSection:"mission",sourceTier:"advanced",sourcePdfPage:59,sourcePrintedPage:63,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:`source52CountPage63Mission${n}`,generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool"});
  }

  if (source52Count) {
    const id="5-2-u6-e3-mission-5-simple-roundtrip-synthetic",name="가게를 한 번 지나는 왕복 경로 · 연습";
    const typeNumber=Math.max(0,...source52Average.subunits.flatMap(subunit=>subunit.types.map(type=>Number(type.typeNumber)||0)))+1;
    source52Count.types.push({id,number:source52Count.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceItemLabel:"Mission 5 구조 연습",sourceSection:"mission",sourceTier:"advanced",sourcePdfPage:59,sourcePrintedPage:63,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:"source52SimpleRoundtripRoutesSynthetic",generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문은 이동 제한 확인 전 잠금이며, 각 구간에서 같은 지점을 다시 지나지 않는 별도 연습을 검산했습니다."});
  }

  const source52Probability = source52Average?.subunits.find(subunit => subunit.name === "사건의 가능성");
  if (source52Probability) for (const [n,name] of [[0,"동전과 주사위의 가능성"],[1,"줄에서 오른쪽에 있을 가능성"],[2,"대표가 모두 여학생일 가능성"],[4,"두 주머니에서 다른 색 공 뽑기"]]) {
    const id = n ? `5-2-u6-e4-example-${n}` : "5-2-u6-e4-exploration";
    const typeNumber = Math.max(0,...source52Average.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Probability.types.push({id,number:source52Probability.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceItemLabel:n?`예제 4-${n}`:"개념탐구 4",sourceSection:n?"example":"exploration",sourceTier:"advanced",sourcePdfPage:60,sourcePrintedPage:64,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:n?`source52ProbabilityPage64Example${n}`:"source52ProbabilityPage64Exploration",generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool"});
  }

  if (source52Probability) {
    const id="5-2-u6-e4-example-3-equal-routes-synthetic",name="다를 지나는 경로의 가능성 · 연습";
    const typeNumber=Math.max(0,...source52Average.subunits.flatMap(subunit=>subunit.types.map(type=>Number(type.typeNumber)||0)))+1;
    source52Probability.types.push({id,number:source52Probability.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceItemLabel:"예제 4-3 구조 연습",sourceSection:"example",sourceTier:"advanced",sourcePdfPage:60,sourcePrintedPage:64,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:"source52EqualRouteProbabilitySynthetic",generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문은 경로 선택 방식 확인 전 잠금이며, 전체 경로를 균등하게 고르는 별도 연습을 독립 검산했습니다."});
  }

  if (source52Probability) for (const [n,name] of [[1,"동전이 모두 같은 면일 가능성"],[2,"카드 중 배수가 있을 가능성"],[3,"세 끈으로 삼각형 만들 가능성"],[4,"모두 자기 책상을 피할 가능성"],[5,"당첨 제비를 연속으로 뽑을 가능성"],[6,"주사위에서 같은 눈이 있을 가능성"]]) {
    const id = `5-2-u6-e4-mission-${n}`;
    const typeNumber = Math.max(0,...source52Average.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Probability.types.push({id,number:source52Probability.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceItemLabel:`Mission ${n}`,sourceSection:"mission",sourceTier:"advanced",sourcePdfPage:61,sourcePrintedPage:65,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:`source52ProbabilityPage65Mission${n}`,generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool"});
  }

  const source52DecimalUnit = semesters.find(s => s.id === "5-2")?.units.find(u => u.id === "5-2-u4");
  const source52DecimalSubunit = source52DecimalUnit?.subunits.find(s => s.name === "소수와 자연수의 곱셈");
  if (source52DecimalSubunit) {
    const index = source52DecimalSubunit.types.findIndex(t => t.id === "5-2-u4-t1");
    if (index >= 0) {
      const previous = source52DecimalSubunit.types[index];
      source52DecimalSubunit.types[index] = {...previous, id:"5-2-u4-e1-exploration", sourceItemId:"5-2-u4-e1-exploration", sourceItemLabel:"개념탐구 1", sourceSection:"exploration", sourcePdfPage:38, sourcePrintedPage:42, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, reviewReason:"원문 구조를 대조하고 서로 다른 창작 수치로 계산을 검산했습니다.", generatorKey:"source52DecimalNaturalRepeatedAdditionPage42Exploration1", variant:0, generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:false, answerVisualStatus:"not-required"};
    }
  }

  if (source52DecimalSubunit) {
    const index = source52DecimalSubunit.types.findIndex(t => t.id === "5-2-u4-t1-2");
    if (index >= 0) {
      const previous = source52DecimalSubunit.types[index], name = "두 소수 곱셈식 계산하기";
      source52DecimalSubunit.types[index] = {...previous, id:"5-2-u4-e1-example-1", name, label:name, sourceItemId:"5-2-u4-e1-example-1", sourceItemLabel:"예제 1-1", sourceSection:"example", sourcePdfPage:38, sourcePrintedPage:42, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, reviewReason:"원문 구조를 대조하고 서로 다른 창작 수치로 두 식을 검산했습니다.", generatorKey:"source52DecimalNaturalProductsPage42Example11", variant:0, generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:false, answerVisualStatus:"not-required"};
    }
  }

  if (source52DecimalSubunit) {
    const index = source52DecimalSubunit.types.findIndex(t => t.id === "5-2-u4-t1-4");
    if (index >= 0) {
      const previous = source52DecimalSubunit.types[index], name = "소수점을 빠뜨린 곱에서 자연수 찾기";
      source52DecimalSubunit.types[index] = {...previous, id:"5-2-u4-e1-example-2", name, label:name, sourceItemId:"5-2-u4-e1-example-2", sourceItemLabel:"예제 1-2", sourceSection:"example", sourcePdfPage:38, sourcePrintedPage:42, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, reviewReason:"원문 구조를 대조하고 소수 자리 조건을 밝힌 창작 수치로 검산했습니다.", generatorKey:"source52DecimalPointOmissionNaturalNumberPage42Example12", variant:0, generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:false, answerVisualStatus:"not-required"};
    }
  }

  if (source52DecimalSubunit) {
    const index = source52DecimalSubunit.types.findIndex(t => t.id === "5-2-u4-t1-6");
    if (index >= 0) {
      const previous = source52DecimalSubunit.types[index], name = "버림과 반올림 조건으로 소수 찾기";
      source52DecimalSubunit.types[index] = {...previous, id:"5-2-u4-e1-example-3", name, label:name, sourceItemId:"5-2-u4-e1-example-3", sourceItemLabel:"예제 1-3", sourceSection:"example", sourcePdfPage:38, sourcePrintedPage:42, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, reviewReason:"원문 구조를 대조하고 창작 수치의 범위와 소수 자리 조건을 검산했습니다.", generatorKey:"source52RoundingTruncationDecimalHundredthsPage42Example13", variant:0, generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:false, answerVisualStatus:"not-required"};
    }
  }

  if (source52DecimalSubunit) {
    const id = "5-2-u4-e1-example-4", name = "상한 과일을 제외하고 이익을 얻는 판매 가격";
    const typeNumber = Math.max(0,...source52DecimalUnit.subunits.flatMap(s => s.types.map(t => Number(t.typeNumber) || 0))) + 1;
    source52DecimalSubunit.types.push({id, number:source52DecimalSubunit.types.length+1, typeNumber, name, label:name, sourceItemId:id, sourceItemLabel:"예제 1-4", sourceSection:"example", sourceTier:"advanced", sourcePdfPage:38, sourcePrintedPage:42, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, generatorKey:"source52SpoiledFruitProfitPricePage42Example14", generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:false, answerVisualStatus:"not-required"});
  }

  if (source52DecimalSubunit) {
    const id = "5-2-u4-e1-mission-1", name = "소수와 자연수의 곱 네 식";
    const typeNumber = Math.max(0,...source52DecimalUnit.subunits.flatMap(s => s.types.map(t => Number(t.typeNumber) || 0))) + 1;
    source52DecimalSubunit.types.push({id, number:source52DecimalSubunit.types.length+1, typeNumber, name, label:name, sourceItemId:id, sourceItemLabel:"Mission 1", sourceSection:"mission", sourceTier:"advanced", sourcePdfPage:39, sourcePrintedPage:43, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, generatorKey:"source52DecimalNaturalProductsPage43Mission1", generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:false, answerVisualStatus:"not-required"});
  }

  if (source52DecimalSubunit) {
    const id = "5-2-u4-e1-mission-2", name = "전체와 남은 밭의 넓이 비교";
    const typeNumber = Math.max(0,...source52DecimalUnit.subunits.flatMap(s => s.types.map(t => Number(t.typeNumber) || 0))) + 1;
    source52DecimalSubunit.types.push({id, number:source52DecimalSubunit.types.length+1, typeNumber, name, label:name, sourceItemId:id, sourceItemLabel:"Mission 2", sourceSection:"mission", sourceTier:"advanced", sourcePdfPage:39, sourcePrintedPage:43, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, generatorKey:"source52FieldCropRemainderAreaDifferencePage43Mission2", generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:false, answerVisualStatus:"not-required"});
  }

  if (source52DecimalSubunit) {
    const id = "5-2-u4-e1-mission-3", name = "소수로 나타낸 날을 시간·분·초로 바꾸기";
    const typeNumber = Math.max(0,...source52DecimalUnit.subunits.flatMap(s => s.types.map(t => Number(t.typeNumber) || 0))) + 1;
    source52DecimalSubunit.types.push({id, number:source52DecimalSubunit.types.length+1, typeNumber, name, label:name, sourceItemId:id, sourceItemLabel:"Mission 3", sourceSection:"mission", sourceTier:"advanced", sourcePdfPage:39, sourcePrintedPage:43, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, generatorKey:"source52DecimalDayToTimePage43Mission3", generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:false, answerVisualStatus:"not-required"});
  }

  if (source52DecimalSubunit) {
    const index = source52DecimalSubunit.types.findIndex(t => t.id === "5-2-u4-t1-7");
    if (index >= 0) {
      const previous = source52DecimalSubunit.types[index], name = "일정하게 커지는 소수 수열";
      source52DecimalSubunit.types[index] = {...previous, id:"5-2-u4-e1-mission-4", name, label:name, sourceItemId:"5-2-u4-e1-mission-4", sourceItemLabel:"Mission 4", sourceSection:"mission", sourcePdfPage:39, sourcePrintedPage:43, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, reviewReason:"원문 구조를 대조하고 창작 수열의 항 번호와 차를 검산했습니다.", generatorKey:"source52DecimalArithmeticSequenceTermPage43Mission4", variant:0, generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:false, answerVisualStatus:"not-required"};
    }
  }

  if (source52DecimalSubunit) {
    const id = "5-2-u4-e1-mission-6", name = "반올림한 몫을 이용해 자연수의 합 구하기";
    const typeNumber = Math.max(0,...source52DecimalUnit.subunits.flatMap(s => s.types.map(t => Number(t.typeNumber) || 0))) + 1;
    source52DecimalSubunit.types.push({id, number:source52DecimalSubunit.types.length+1, typeNumber, name, label:name, sourceItemId:id, sourceItemLabel:"Mission 6", sourceSection:"mission", sourceTier:"advanced", sourcePdfPage:39, sourcePrintedPage:43, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, generatorKey:"source52RoundedQuotientNaturalSumPage43Mission6", generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:false, answerVisualStatus:"not-required"});
  }

  if (source52DecimalSubunit) {
    const id = "5-2-u4-e1-mission-5", name = "겹쳐 붙인 테이프로 고리 만들기";
    const typeNumber = Math.max(0,...source52DecimalUnit.subunits.flatMap(s => s.types.map(t => Number(t.typeNumber) || 0))) + 1;
    source52DecimalSubunit.types.push({id, number:source52DecimalSubunit.types.length+1, typeNumber, name, label:name, sourceItemId:id, sourceItemLabel:"Mission 5", sourceSection:"mission", sourceTier:"advanced", sourcePdfPage:39, sourcePrintedPage:43, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, generatorKey:"source52ClosedTapeRingLengthPage43Mission5", generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:true, answerVisualStatus:"verified-reconstruction"});
  }

  const source52DecimalDecimal = source52DecimalUnit?.subunits.find(s => s.name === "소수와 소수의 곱셈");
  if (source52DecimalDecimal) {
    const index = source52DecimalDecimal.types.findIndex(t => t.name === "소수 곱의 빠진 숫자 찾기");
    if (index >= 0) {
      const previous = source52DecimalDecimal.types[index], id = "5-2-u4-e2-exploration", name = "소수 곱의 빠진 숫자 찾기";
      source52DecimalDecimal.types[index] = {...previous, id, name, label:name, sourceItemId:id, sourceItemLabel:"개념탐구 2", sourceSection:"exploration", sourcePdfPage:40, sourcePrintedPage:44, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, reviewReason:"원문 구조를 대조하고 창작 수치의 곱과 자리값을 검산했습니다.", generatorKey:"source52DecimalProductMissingDigitsPage44Exploration2", variant:0, generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:false, answerVisualStatus:"not-required"};
    }
  }

  if (source52DecimalDecimal) {
    const id = "5-2-u4-e2-example-1", name = "기준 곱으로 소수 곱셈식의 값 찾기";
    const typeNumber = Math.max(0,...source52DecimalUnit.subunits.flatMap(s => s.types.map(t => Number(t.typeNumber) || 0))) + 1;
    source52DecimalDecimal.types.push({id, number:source52DecimalDecimal.types.length+1, typeNumber, name, label:name, sourceItemId:id, sourceItemLabel:"예제 2-1", sourceSection:"example", sourceTier:"advanced", sourcePdfPage:40, sourcePrintedPage:44, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, generatorKey:"source52DecimalPlaceScalingEquationsPage44Example21", generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:false, answerVisualStatus:"not-required"});
  }

  if (source52DecimalDecimal) {
    const index = source52DecimalDecimal.types.findIndex(t => t.name === "반올림한 몫으로 소수의 범위 찾기");
    if (index >= 0) {
      const previous = source52DecimalDecimal.types[index], id = "5-2-u4-e2-example-2", name = "반올림한 몫으로 수의 범위 찾기";
      source52DecimalDecimal.types[index] = {...previous, id, name, label:name, sourceItemId:id, sourceItemLabel:"예제 2-2", sourceSection:"example", sourcePdfPage:40, sourcePrintedPage:44, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, reviewReason:"원문 구조를 대조하고 창작 수치의 반올림 경계와 범위를 검산했습니다.", generatorKey:"source52RoundedQuotientRangePage44Example22", variant:0, generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:false, answerVisualStatus:"not-required"};
    }
  }

  if (source52DecimalDecimal) {
    const id = "5-2-u4-e2-example-3", name = "반복 곱의 끝자리와 소수 자릿수";
    const typeNumber = Math.max(0,...source52DecimalUnit.subunits.flatMap(s => s.types.map(t => Number(t.typeNumber) || 0))) + 1;
    source52DecimalDecimal.types.push({id, number:source52DecimalDecimal.types.length+1, typeNumber, name, label:name, sourceItemId:id, sourceItemLabel:"예제 2-3", sourceSection:"example", sourceTier:"advanced", sourcePdfPage:40, sourcePrintedPage:44, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, generatorKey:"source52RepeatedDecimalProductDigitAndPlacesPage44Example23", generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:false, answerVisualStatus:"not-required"});
  }

  if (source52DecimalDecimal) {
    const index = source52DecimalDecimal.types.findIndex(t => t.name === "넓이 증가량으로 정사각형의 변 구하기");
    if (index >= 0) {
      const previous = source52DecimalDecimal.types[index], id = "5-2-u4-e2-example-4", name = "넓이 증가량으로 정사각형의 변 구하기";
      source52DecimalDecimal.types[index] = {...previous, id, name, label:name, sourceItemId:id, sourceItemLabel:"예제 2-4", sourceSection:"example", sourcePdfPage:40, sourcePrintedPage:44, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, reviewReason:"원문 구조를 대조하고 창작 수치의 늘어난 넓이와 한 변을 검산했습니다.", generatorKey:"source52SquareAreaIncreasePage44Example24", variant:0, generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:true, answerVisualStatus:"verified-reconstruction"};
    }
  }

  if (source52DecimalDecimal) {
    const id = "5-2-u4-e2-mission-1", name = "소수 혼합 계산 네 식";
    const typeNumber = Math.max(0,...source52DecimalUnit.subunits.flatMap(s => s.types.map(t => Number(t.typeNumber) || 0))) + 1;
    source52DecimalDecimal.types.push({id, number:source52DecimalDecimal.types.length+1, typeNumber, name, label:name, sourceItemId:id, sourceItemLabel:"Mission 1", sourceSection:"mission", sourceTier:"advanced", sourcePdfPage:41, sourcePrintedPage:45, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, generatorKey:"source52DecimalMixedOperationsPage45Mission1", generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:false, answerVisualStatus:"not-required"});
  }

  if (source52DecimalDecimal) {
    const id = "5-2-u4-e2-mission-2", name = "두 곱 사이에서 소수 둘째 자리 숫자 세기";
    const typeNumber = Math.max(0,...source52DecimalUnit.subunits.flatMap(s => s.types.map(t => Number(t.typeNumber) || 0))) + 1;
    source52DecimalDecimal.types.push({id, number:source52DecimalDecimal.types.length+1, typeNumber, name, label:name, sourceItemId:id, sourceItemLabel:"Mission 2", sourceSection:"mission", sourceTier:"advanced", sourcePdfPage:41, sourcePrintedPage:45, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, generatorKey:"source52HundredthsDigitBetweenProductsPage45Mission2", generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:false, answerVisualStatus:"not-required"});
  }

  if (source52DecimalDecimal) {
    const id = "5-2-u4-e2-mission-3", name = "잘못 나눈 수를 복원해 바르게 곱하기";
    const typeNumber = Math.max(0,...source52DecimalUnit.subunits.flatMap(s => s.types.map(t => Number(t.typeNumber) || 0))) + 1;
    source52DecimalDecimal.types.push({id, number:source52DecimalDecimal.types.length+1, typeNumber, name, label:name, sourceItemId:id, sourceItemLabel:"Mission 3", sourceSection:"mission", sourceTier:"advanced", sourcePdfPage:41, sourcePrintedPage:45, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, generatorKey:"source52WrongDecimalDivisionRestoreProductPage45Mission3", generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:false, answerVisualStatus:"not-required"});
  }

  if (source52DecimalDecimal) {
    const id = "5-2-u4-e2-mission-4", name = "같은 방향으로 달린 두 차량의 거리 차";
    const typeNumber = Math.max(0,...source52DecimalUnit.subunits.flatMap(s => s.types.map(t => Number(t.typeNumber) || 0))) + 1;
    source52DecimalDecimal.types.push({id, number:source52DecimalDecimal.types.length+1, typeNumber, name, label:name, sourceItemId:id, sourceItemLabel:"Mission 4", sourceSection:"mission", sourceTier:"advanced", sourcePdfPage:41, sourcePrintedPage:45, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, generatorKey:"source52SameDirectionSpeedDistanceGapPage45Mission4", generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:false, answerVisualStatus:"not-required"});
  }

  if (source52DecimalDecimal) {
    const id = "5-2-u4-e2-mission-5", name = "소수점 누락과 합으로 두 수의 곱 찾기";
    const typeNumber = Math.max(0,...source52DecimalUnit.subunits.flatMap(s => s.types.map(t => Number(t.typeNumber) || 0))) + 1;
    source52DecimalDecimal.types.push({id, number:source52DecimalDecimal.types.length+1, typeNumber, name, label:name, sourceItemId:id, sourceItemLabel:"Mission 5", sourceSection:"mission", sourceTier:"advanced", sourcePdfPage:41, sourcePrintedPage:45, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, generatorKey:"source52TwoDecimalsPointOmissionPairProductPage45Mission5", generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:false, answerVisualStatus:"not-required"});
  }

  if (source52DecimalDecimal) {
    const id = "5-2-u4-e2-mission-6", name = "소수 곱의 범위와 자릿수 조건으로 개수 찾기";
    const typeNumber = Math.max(0,...source52DecimalUnit.subunits.flatMap(s => s.types.map(t => Number(t.typeNumber) || 0))) + 1;
    source52DecimalDecimal.types.push({id, number:source52DecimalDecimal.types.length+1, typeNumber, name, label:name, sourceItemId:id, sourceItemLabel:"Mission 6", sourceSection:"mission", sourceTier:"advanced", sourcePdfPage:41, sourcePrintedPage:45, sourceVerified:true, publisherKeyVerified:false, reviewLocked:false, generatorKey:"source52OneDecimalFactorAndProductRangeCountPage45Mission6", generationMode:"fixed-verified-pool", implementationStatus:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3, answerVisualRequired:false, answerVisualStatus:"not-required"});
  }

  const source52CongruenceUnit = semesters.find(s => s.id === "5-2")?.units.find(u => u.id === "5-2-u3");
  const source52SymmetryApplication = source52CongruenceUnit?.subunits.find(s => s.name === "선대칭의 활용");
  if (source52SymmetryApplication && !source52SymmetryApplication.types.some(t => t.id === "5-2-u3-e6-exploration-mirror-synthetic")) {
    const id="5-2-u3-e6-exploration-mirror-synthetic",name="거울에 반사된 빛의 경로와 넓이 · 연습";
    source52SymmetryApplication.types.push({id,number:source52SymmetryApplication.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"개념탐구 6 구조 연습",sourceSection:"exploration",sourcePdfPage:30,sourcePrintedPage:34,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 경로와 넓이를 독립 검증했습니다.",generatorKey:"source52MirrorPathSynthetic",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }
  if (source52SymmetryApplication && !source52SymmetryApplication.types.some(t => t.id === "5-2-u3-e6-example-3-palindrome-synthetic")) {
    const id="5-2-u3-e6-example-3-palindrome-synthetic",name="자리 수별 대칭수의 개수 · 연습";
    source52SymmetryApplication.types.push({id,number:source52SymmetryApplication.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"예제 6-3 구조 연습",sourceSection:"example",sourcePdfPage:30,sourcePrintedPage:34,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 범위의 대칭수를 전수 검사했습니다.",generatorKey:"source52PalindromeSynthetic",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:false,answerVisualStatus:"not-required"});
  }
  const source52PointApplication = source52CongruenceUnit?.subunits.find(s => s.name === "점대칭의 활용");
  if (source52PointApplication && !source52PointApplication.types.some(t => t.id === "5-2-u3-e8-mission-2-half-synthetic")) {
    const id="5-2-u3-e8-mission-2-half-synthetic",name="붙인 도형의 넓이를 반으로 나누기 · 연습";
    source52PointApplication.types.push({id,number:source52PointApplication.types.length+1,name,label:name,sourceItemId:id,sourceParentItemId:"5-2-u3-e8-mission-2",sourceItemLabel:"Mission 2 구조 연습",sourceSection:"mission",sourcePdfPage:35,sourcePrintedPage:39,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"창작 도형의 두 중심을 잇는 넓이 이등분선을 독립 검증했습니다.",generatorKey:"source52CompositeHalfSynthetic",automaticGrading:false,generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }
  if (source52PointApplication && !source52PointApplication.types.some(t => t.id === "5-2-u3-e8-example-4-stone-synthetic")) {
    const id="5-2-u3-e8-example-4-stone-synthetic",name="바둑돌을 왼쪽으로 옮기는 게임 · 연습";
    source52PointApplication.types.push({id,number:source52PointApplication.types.length+1,name,label:name,sourceItemId:id,sourceParentItemId:"5-2-u3-e8-example-4",sourceItemLabel:"예제 8-4 구조 연습",sourceSection:"example",sourcePdfPage:34,sourcePrintedPage:38,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"창작 말판의 모든 첫 수와 승리 전략을 독립 검증했습니다.",generatorKey:"source52StoneGameSynthetic",automaticGrading:false,generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:false,answerVisualStatus:"not-required"});
  }
  if (source52PointApplication && !source52PointApplication.types.some(t => t.id === "5-2-u3-e8-example-2-cut-synthetic")) {
    const id="5-2-u3-e8-example-2-cut-synthetic",name="격자를 합동 두 조각으로 나누기 · 연습";
    source52PointApplication.types.push({id,number:source52PointApplication.types.length+1,name,label:name,sourceItemId:id,sourceParentItemId:"5-2-u3-e8-example-2",sourceItemLabel:"예제 8-2 구조 연습",sourceSection:"example",sourcePdfPage:34,sourcePrintedPage:38,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"창작 격자의 합동 조각과 방법 수를 독립 전수 검증했습니다.",generatorKey:"source52CongruentGridSynthetic",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }
  if (source52PointApplication && !source52PointApplication.types.some(t => t.id === "5-2-u3-e8-mission-1-double-point-synthetic")) {
    const id="5-2-u3-e8-mission-1-double-point-synthetic",name="두 점을 중심으로 차례로 점대칭 그리기 · 연습";
    source52PointApplication.types.push({id,number:source52PointApplication.types.length+1,name,label:name,sourceItemId:id,sourceParentItemId:"5-2-u3-e8-mission-1",sourceItemLabel:"Mission 1 구조 연습",sourceSection:"mission",sourcePdfPage:35,sourcePrintedPage:39,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"창작 삼각형의 두 단계 대응점을 중점과 평행이동으로 독립 검증했습니다.",generatorKey:"source52DoublePointSynthetic",automaticGrading:false,generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }
  if (source52PointApplication && !source52PointApplication.types.some(t => t.id === "5-2-u3-e8-example-3-overlap-synthetic")) {
    const id="5-2-u3-e8-example-3-overlap-synthetic",name="선대칭과 점대칭 도형의 겹친 넓이 · 연습";
    source52PointApplication.types.push({id,number:source52PointApplication.types.length+1,name,label:name,sourceItemId:id,sourceParentItemId:"5-2-u3-e8-example-3",sourceItemLabel:"예제 8-3 구조 연습",sourceSection:"example",sourcePdfPage:34,sourcePrintedPage:38,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"창작 도형의 두 변환과 겹친 영역을 독립 좌표 계산으로 검증했습니다.",generatorKey:"source52DoubleOverlapSynthetic",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }
  if (source52PointApplication && !source52PointApplication.types.some(t => t.id === "5-2-u3-e8-mission-5-rotated-number-synthetic")) {
    const id="5-2-u3-e8-mission-5-rotated-number-synthetic",name="돌려도 같은 수의 개수 · 연습";
    source52PointApplication.types.push({id,number:source52PointApplication.types.length+1,name,label:name,sourceItemId:id,sourceParentItemId:"5-2-u3-e8-mission-5",sourceItemLabel:"Mission 5 구조 연습",sourceSection:"mission",sourcePdfPage:35,sourcePrintedPage:39,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"숫자 회전 대응을 명시한 창작 문제의 경우를 전수 검증했습니다.",generatorKey:"source52RotatedNumberSynthetic",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:false,answerVisualStatus:"not-required"});
  }
  const source52LineSymmetry = source52CongruenceUnit?.subunits.find(s => s.name === "선대칭도형");
  if (source52LineSymmetry && !source52LineSymmetry.types.some(t => t.id === "5-2-u3-e5-example-1-reflection-synthetic")) {
    const id="5-2-u3-e5-example-1-reflection-synthetic",name="기울어진 축에 사각형 반사하기 · 연습";
    source52LineSymmetry.types.push({id,number:source52LineSymmetry.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"예제 5-1 구조 연습",sourceSection:"example",sourcePdfPage:28,sourcePrintedPage:32,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 도형의 대응점을 독립 검증했습니다.",generatorKey:"source52SlantedReflectionSynthetic",automaticGrading:false,generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }
  if (source52LineSymmetry && !source52LineSymmetry.types.some(t => t.id === "5-2-u3-e5-exploration-grid-synthetic")) {
    const id="5-2-u3-e5-exploration-grid-synthetic",name="대칭축이 하나인 색 배열 · 연습";
    source52LineSymmetry.types.push({id,number:source52LineSymmetry.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"개념탐구 5 구조 연습",sourceSection:"exploration",sourcePdfPage:28,sourcePrintedPage:32,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 색 배열을 전수 검사했습니다.",generatorKey:"source52SymmetryGridSynthetic",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }
  const source52CongruenceFirst = source52CongruenceUnit?.subunits.find(s => s.name === "조건에 맞는 삼각형 그리기");
  if (source52CongruenceFirst) {
    const index = source52CongruenceFirst.types.findIndex(t => t.id === "5-2-u3-t1");
    if (index >= 0) {
      const previous=source52CongruenceFirst.types[index], id="5-2-u3-e1-exploration", name="삼각형이 한 가지로 정해지는 조건";
      source52CongruenceFirst.types[index]={...previous,id,name,label:name,sourceItemId:id,sourceItemLabel:"개념탐구 1",sourceSection:"exploration",sourcePdfPage:20,sourcePrintedPage:24,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 조건을 대조하고 창작 조건의 합동 여부와 두 해를 독립 확인했습니다.",generatorKey:"source52U3Page24Exploration1",variant:0,generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:false,answerVisualStatus:"not-required"};
    }
  }

  if (source52CongruenceFirst && !source52CongruenceFirst.types.some(t => t.id === "5-2-u3-e1-example-3")) {
    const id="5-2-u3-e1-example-3",name="삼각형을 정하는 추가 조건";
    source52CongruenceFirst.types.push({id,number:source52CongruenceFirst.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"예제 1-3",sourceSection:"example",sourcePdfPage:20,sourcePrintedPage:24,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 변형의 합동 조건과 두 교점을 확인했습니다.",generatorKey:"source52TriangleExtraConditionSyntheticPage24Example3",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:false,answerVisualStatus:"not-required"});
  }

  if (source52CongruenceFirst && !source52CongruenceFirst.types.some(t => t.id === "5-2-u3-e1-example-4")) {
    const id="5-2-u3-e1-example-4",name="사각형을 정하는 추가 조건";
    source52CongruenceFirst.types.push({id,number:source52CongruenceFirst.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"예제 1-4",sourceSection:"example",sourcePdfPage:20,sourcePrintedPage:24,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 사각형의 유일성과 볼록 반례를 검증했습니다.",generatorKey:"source52QuadrilateralExtraConditionSyntheticPage24Example4",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:false,answerVisualStatus:"not-required"});
  }

  if (source52CongruenceFirst) for (const [n,name,key] of [[2,"삼각형 합동 작도 · 연습","source52TriangleCopySyntheticPage25Mission2"],[3,"사각형 합동 작도 · 연습","source52QuadrilateralCopySyntheticPage25Mission3"]]) {
    const id=`5-2-u3-e1-mission-${n}`;
    if (!source52CongruenceFirst.types.some(t=>t.id===id)) source52CongruenceFirst.types.push({id,number:source52CongruenceFirst.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:`Mission ${n} 유사문항`,sourceSection:"mission",sourcePdfPage:21,sourcePrintedPage:25,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 작도 구조를 대조하고 창작 도형과 작도 풀이를 검증했습니다.",generatorKey:key,generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }

  if (source52CongruenceFirst && !source52CongruenceFirst.types.some(t => t.id === "5-2-u3-e1-example-2")) {
    const id="5-2-u3-e1-example-2",name="사각형을 자와 컴퍼스로 옮겨 그리기";
    source52CongruenceFirst.types.push({id,number:source52CongruenceFirst.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"예제 1-2",sourceSection:"example",sourcePdfPage:20,sourcePrintedPage:24,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 도형의 작도와 풀이 그림을 검증했습니다.",generatorKey:"source52QuadrilateralCopySyntheticPage24Example2",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }

  if (source52CongruenceFirst && !source52CongruenceFirst.types.some(t => t.id === "5-2-u3-e1-mission-1")) {
    const id="5-2-u3-e1-mission-1",name="두 변과 그 사이 각을 이용한 작도 순서";
    source52CongruenceFirst.types.push({id,number:source52CongruenceFirst.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"Mission 1",sourceSection:"mission",sourcePdfPage:21,sourcePrintedPage:25,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 작도 그림의 각도·길이와 순서를 검증했습니다.",generatorKey:"source52TriangleOrderSyntheticPage25Mission1",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }

  if (source52CongruenceFirst && !source52CongruenceFirst.types.some(t => t.id === "5-2-u3-e1-mission-4")) {
    const id="5-2-u3-e1-mission-4",name="자와 컴퍼스로 마름모 그리기";
    source52CongruenceFirst.types.push({id,number:source52CongruenceFirst.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"Mission 4 유사문항",sourceSection:"mission",sourcePdfPage:21,sourcePrintedPage:25,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 마름모의 네 변과 각 및 작도 그림을 검증했습니다.",generatorKey:"source52RhombusConstructionSyntheticPage25Mission4",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }

  if (source52CongruenceFirst && !source52CongruenceFirst.types.some(t => t.id === "5-2-u3-e1-mission-5")) {
    const id="5-2-u3-e1-mission-5",name="두 변에 더해 삼각형을 정하는 조건";
    source52CongruenceFirst.types.push({id,number:source52CongruenceFirst.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"Mission 5 유사문항",sourceSection:"mission",sourcePdfPage:21,sourcePrintedPage:25,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 변형의 합동 조건과 두 교점을 검증했습니다.",generatorKey:"source52TriangleTwoSideConditionSyntheticPage25Mission5",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:false,answerVisualStatus:"not-required"});
  }

  if (source52CongruenceFirst && !source52CongruenceFirst.types.some(t => t.id === "5-2-u3-e1-mission-6")) {
    const id="5-2-u3-e1-mission-6",name="세 변과 한 각으로 사각형을 정하는 조건";
    source52CongruenceFirst.types.push({id,number:source52CongruenceFirst.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"Mission 6 유사문항",sourceSection:"mission",sourcePdfPage:21,sourcePrintedPage:25,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 볼록 사각형의 유일성과 반례을 검증했습니다.",generatorKey:"source52QuadrilateralConditionsSyntheticPage25Mission6",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:false,answerVisualStatus:"not-required"});
  }

  if (source52CongruenceFirst && !source52CongruenceFirst.types.some(t => t.id === "5-2-u3-e2-example-1")) {
    const id="5-2-u3-e2-example-1",name="세 변을 골라 만들 수 있는 삼각형 세기";
    source52CongruenceFirst.types.push({id,number:source52CongruenceFirst.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"예제 2-1 유사문항",sourceSection:"example",sourcePdfPage:22,sourcePrintedPage:26,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 변형의 삼각형 부등식과 조합을 검증했습니다.",generatorKey:"source52TriangleSideTriplesSyntheticPage26Example21",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:false,answerVisualStatus:"not-required"});
  }

  if (source52CongruenceFirst && !source52CongruenceFirst.types.some(t => t.id === "5-2-u3-e2-example-2")) {
    const id="5-2-u3-e2-example-2",name="양 끝각을 골라 만들 수 있는 삼각형 세기";
    source52CongruenceFirst.types.push({id,number:source52CongruenceFirst.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"예제 2-2 유사문항",sourceSection:"example",sourcePdfPage:22,sourcePrintedPage:26,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 변형의 두 각의 합과 순서 없는 조합을 검증했습니다.",generatorKey:"source52TriangleAnglePairsSyntheticPage26Example22",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:false,answerVisualStatus:"not-required"});
  }

  if (source52CongruenceFirst && !source52CongruenceFirst.types.some(t => t.id === "5-2-u3-e2-mission-2")) {
    const id="5-2-u3-e2-mission-2",name="삼각형의 나머지 변이 될 수 있는 길이";
    source52CongruenceFirst.types.push({id,number:source52CongruenceFirst.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"Mission 2 유사문항",sourceSection:"mission",sourcePdfPage:23,sourcePrintedPage:27,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 변형의 삼각형 부등식과 경계값을 검증했습니다.",generatorKey:"source52TriangleMissingSideChoicesSyntheticPage27Mission2",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:false,answerVisualStatus:"not-required"});
  }

  if (source52CongruenceFirst && !source52CongruenceFirst.types.some(t => t.id === "5-2-u3-e2-mission-4")) {
    const id="5-2-u3-e2-mission-4",name="서로 다른 세 변의 자연수 길이 개수";
    source52CongruenceFirst.types.push({id,number:source52CongruenceFirst.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"Mission 4 유사문항",sourceSection:"mission",sourcePdfPage:23,sourcePrintedPage:27,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 변형의 삼각형 부등식과 서로 다른 변 조건을 검증했습니다.",generatorKey:"source52TriangleDistinctNaturalSideSyntheticPage27Mission4",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:false,answerVisualStatus:"not-required"});
  }

  if (source52CongruenceFirst && !source52CongruenceFirst.types.some(t => t.id === "5-2-u3-e2-mission-6")) {
    const id="5-2-u3-e2-mission-6",name="이등변삼각형 안의 작은 삼각형 합동쌍";
    source52CongruenceFirst.types.push({id,number:source52CongruenceFirst.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"Mission 6 유사문항",sourceSection:"mission",sourcePdfPage:23,sourcePrintedPage:27,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 변형의 작은 삼각형의 합동쌍과 집계 범위을 검증했습니다.",generatorKey:"source52IsoscelesSmallTrianglePairsSyntheticPage27Mission6",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:false,answerVisualStatus:"not-required"});
  }

  if (source52CongruenceFirst && !source52CongruenceFirst.types.some(t => t.id === "5-2-u3-e2-mission-1")) {
    const id="5-2-u3-e2-mission-1",name="삼각형의 성립과 유일성 판단";
    source52CongruenceFirst.types.push({id,number:source52CongruenceFirst.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"Mission 1 유사문항",sourceSection:"mission",sourcePdfPage:23,sourcePrintedPage:27,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 변형의 삼각형 성립과 유일성 조건을 검증했습니다.",generatorKey:"source52TriangleNonUniqueConditionsSyntheticPage27Mission1",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:false,answerVisualStatus:"not-required"});
  }

  const source52CongruenceApplicationOne = source52CongruenceUnit?.subunits.find(s => s.name === "합동의 활용 ①");
  if (source52CongruenceApplicationOne && !source52CongruenceApplicationOne.types.some(t => t.id === "5-2-u3-e3-exploration-synthetic")) {
    const id="5-2-u3-e3-exploration-synthetic",name="합동 이등변삼각형과 교차각";
    source52CongruenceApplicationOne.types.push({id,number:source52CongruenceApplicationOne.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"개념탐구 3 유사문항",sourceSection:"exploration",sourcePdfPage:24,sourcePrintedPage:28,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"대응점과 이등변 조건을 명시한 창작 문항을 독립 검산했습니다.",generatorKey:"source52CongruentIsoscelesPage28ExplorationSynthetic",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }

  if (source52CongruenceApplicationOne && !source52CongruenceApplicationOne.types.some(t => t.id === "5-2-u3-e3-example-4-synthetic")) {
    const id="5-2-u3-e3-example-4-synthetic",name="직사각형을 두 번 접은 각";
    source52CongruenceApplicationOne.types.push({id,number:source52CongruenceApplicationOne.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"예제 3-4 유사문항",sourceSection:"example",sourcePdfPage:24,sourcePrintedPage:28,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"두 접는 선과 점의 이동을 명시한 창작 문항을 독립 검산했습니다.",generatorKey:"source52RectangleDoubleFoldPage28Example34Synthetic",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }

  if (source52CongruenceApplicationOne && !source52CongruenceApplicationOne.types.some(t => t.id === "5-2-u3-e3-example-3-synthetic")) {
    const id="5-2-u3-e3-example-3-synthetic",name="빗변 위로 회전한 직각삼각형";
    source52CongruenceApplicationOne.types.push({id,number:source52CongruenceApplicationOne.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"예제 3-3 유사문항",sourceSection:"example",sourcePdfPage:24,sourcePrintedPage:28,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 그림의 빗변 위 점 조건을 명시한 유사문항의 회전과 각을 독립 검산했습니다.",generatorKey:"source52RightTriangleRotationPage28Example33Synthetic",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }

  if (source52CongruenceApplicationOne && !source52CongruenceApplicationOne.types.some(t => t.id === "5-2-u3-e3-example-2")) {
    const id="5-2-u3-e3-example-2",name="겹친 정사각형에서 선분 길이 구하기";
    source52CongruenceApplicationOne.types.push({id,number:source52CongruenceApplicationOne.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"예제 3-2 유사문항",sourceSection:"example",sourcePdfPage:24,sourcePrintedPage:28,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 정사각형의 각과 정삼각형을 검증했습니다.",generatorKey:"source52SquareOverlapSegmentSyntheticPage28Example32",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }

  if (source52CongruenceApplicationOne && !source52CongruenceApplicationOne.types.some(t => t.id === "5-2-u3-e3-example-1")) {
    const id="5-2-u3-e3-example-1",name="중심에서 겹친 정사각형의 넓이";
    source52CongruenceApplicationOne.types.push({id,number:source52CongruenceApplicationOne.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"예제 3-1 유사문항",sourceSection:"example",sourcePdfPage:24,sourcePrintedPage:28,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 도형의 중심 회전 대칭과 넓이를 검증했습니다.",generatorKey:"source52SquareOverlapSyntheticPage28Example31",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }

  if (source52CongruenceApplicationOne && !source52CongruenceApplicationOne.types.some(t => t.id === "5-2-u3-e3-mission-2")) {
    const id="5-2-u3-e3-mission-2",name="크기가 다른 정사각형의 겹친 넓이";
    source52CongruenceApplicationOne.types.push({id,number:source52CongruenceApplicationOne.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"Mission 2 유사문항",sourceSection:"mission",sourcePdfPage:25,sourcePrintedPage:29,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 실제 두 정사각형의 변 길이와 겹친 넓이를 검증했습니다.",generatorKey:"source52UnequalSquareOverlapSyntheticPage29Mission2",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }

  if (source52CongruenceApplicationOne && !source52CongruenceApplicationOne.types.some(t => t.id === "5-2-u3-e3-mission-1")) {
    const id="5-2-u3-e3-mission-1",name="합동인 이등변삼각형의 겹친 각";
    source52CongruenceApplicationOne.types.push({id,number:source52CongruenceApplicationOne.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"Mission 1 유사문항",sourceSection:"mission",sourcePdfPage:25,sourcePrintedPage:29,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 이등변삼각형의 합동과 교점 및 각을 검증했습니다.",generatorKey:"source52CongruentIsoscelesOverlapSyntheticPage29Mission1",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }

  if (source52CongruenceApplicationOne && !source52CongruenceApplicationOne.types.some(t => t.id === "5-2-u3-e3-mission-3")) {
    const id="5-2-u3-e3-mission-3",name="회전한 이등변삼각형의 교차 각";
    source52CongruenceApplicationOne.types.push({id,number:source52CongruenceApplicationOne.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"Mission 3 유사문항",sourceSection:"mission",sourcePdfPage:25,sourcePrintedPage:29,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 삼각형의 회전과 교점, 각도를 검증했습니다.",generatorKey:"source52RotatedIsoscelesSyntheticPage29Mission3",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }

  if (source52CongruenceApplicationOne && !source52CongruenceApplicationOne.types.some(t => t.id === "5-2-u3-e3-mission-4")) {
    const id="5-2-u3-e3-mission-4",name="직사각형을 두 번 접은 각";
    source52CongruenceApplicationOne.types.push({id,number:source52CongruenceApplicationOne.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"Mission 4 유사문항",sourceSection:"mission",sourcePdfPage:25,sourcePrintedPage:29,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 그림의 점 이름을 정정하고 창작 접기 도형의 대응과 각을 검증했습니다.",generatorKey:"source52FoldedRectangleSyntheticPage29Mission4",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }

  if (source52CongruenceApplicationOne && !source52CongruenceApplicationOne.types.some(t => t.id === "5-2-u3-e3-mission-5")) {
    const id="5-2-u3-e3-mission-5",name="같은 거리로 만든 삼각형의 각";
    source52CongruenceApplicationOne.types.push({id,number:source52CongruenceApplicationOne.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"Mission 5 유사문항",sourceSection:"mission",sourcePdfPage:25,sourcePrintedPage:29,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 도형의 같은 거리, 합동과 각도를 검증했습니다.",generatorKey:"source52EqualOffsetEquilateralSyntheticPage29Mission5",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }

  if (source52CongruenceApplicationOne && !source52CongruenceApplicationOne.types.some(t => t.id === "5-2-u3-e3-mission-6")) {
    const id="5-2-u3-e3-mission-6",name="정삼각형에서 교차하는 선의 각";
    source52CongruenceApplicationOne.types.push({id,number:source52CongruenceApplicationOne.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"Mission 6 유사문항",sourceSection:"mission",sourcePdfPage:25,sourcePrintedPage:29,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 조건을 대조하고 창작 도형의 길이, 합동과 교차각을 검증했습니다.",generatorKey:"source52EquilateralCrossingAnglesSyntheticPage29Mission6",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }

  const source52CongruenceApplicationTwo = source52CongruenceUnit?.subunits.find(s => s.name === "합동의 활용 ②");
  if (source52CongruenceApplicationTwo && !source52CongruenceApplicationTwo.types.some(t => t.id === "5-2-u3-e4-example-1")) {
    const id="5-2-u3-e4-example-1",name="원에서 같은 현과 중심각";
    source52CongruenceApplicationTwo.types.push({id,number:source52CongruenceApplicationTwo.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"예제 4-1 유사문항",sourceSection:"example",sourcePdfPage:26,sourcePrintedPage:30,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조를 대조하고 창작 도형의 현, 반지름과 중심각을 검증했습니다.",generatorKey:"source52EqualChordsCenterAnglesSyntheticPage30Example41",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }

  if (source52CongruenceApplicationTwo && !source52CongruenceApplicationTwo.types.some(t => t.id === "5-2-u3-e4-example-3")) {
    const id="5-2-u3-e4-example-3",name="사다리꼴의 중점과 평행선";
    source52CongruenceApplicationTwo.types.push({id,number:source52CongruenceApplicationTwo.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"예제 4-3 유사문항",sourceSection:"example",sourcePdfPage:26,sourcePrintedPage:30,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 조건을 대조하고 창작 도형의 평행선, 중점과 합동을 검증했습니다.",generatorKey:"source52TrapezoidMidpointSyntheticPage30Example43",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }

  if (source52CongruenceApplicationTwo && !source52CongruenceApplicationTwo.types.some(t => t.id === "5-2-u3-e4-example-4")) {
    const id="5-2-u3-e4-example-4",name="정삼각형과 이등변삼각형의 각";
    source52CongruenceApplicationTwo.types.push({id,number:source52CongruenceApplicationTwo.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"예제 4-4 유사문항",sourceSection:"example",sourcePdfPage:26,sourcePrintedPage:30,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 조건을 대조하고 창작 삼각형의 합동과 각도를 검증했습니다.",generatorKey:"source52EquilateralCompositeAnglesSyntheticPage30Example44",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }

  if (source52CongruenceApplicationTwo && !source52CongruenceApplicationTwo.types.some(t => t.id === "5-2-u3-e4-exploration")) {
    const id="5-2-u3-e4-exploration",name="정사각형과 보조점으로 각 찾기";
    source52CongruenceApplicationTwo.types.push({id,number:source52CongruenceApplicationTwo.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:"개념탐구 4 유사문항",sourceSection:"exploration",sourcePdfPage:26,sourcePrintedPage:30,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 조건을 대조하고 창작 정사각형의 보조점과 각도를 검증했습니다.",generatorKey:"source52SquareAuxiliaryAngleSyntheticPage30Exploration4",generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction"});
  }

  const source52Unit1 = semesters.find(semester => semester.id === "5-2")?.units.find(unit => unit.id === "5-2-u1");
  const source52Rounding = source52Unit1?.subunits.find(subunit => subunit.name === "어림하기 · 개념탐구 2 원문 분류");
  if (source52Rounding && !source52Rounding.types.some(type => type.id === "5-2-u1-e2-example-2-4-synthetic")) {
    const id="5-2-u1-e2-example-2-4-synthetic",name="소수의 숫자 조건과 반올림 · 연습";
    const typeNumber=Math.max(0,...source52Unit1.subunits.flatMap(subunit=>subunit.types.map(type=>Number(type.typeNumber)||0)))+1;
    source52Rounding.types.push({id,number:source52Rounding.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceItemLabel:"예제 2-4 유사문항",sourceSection:"example",sourceTier:"advanced",sourcePdfPage:4,sourcePrintedPage:6,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:"source52DecimalRoundingDigitsSynthetic",generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문은 정답 확인 전 잠금이며, 숫자 범위를 명시한 별도 연습을 전수 검산했습니다."});
  }
  const source52RoundRange = source52Unit1?.subunits.find(subunit => subunit.name === "어림한 수의 범위 · 개념탐구 4 및 예제 4-1–4-3");
  if (source52RoundRange) for (const [id,name,key,label] of [
    ["5-2-u1-e4-mission-2-rounded-floor-range","반올림과 버림 조건의 자연수 개수","source52RoundedRangeMissionTwo","Mission 2 유사문항"],
    ["5-2-u1-e4-mission-3-notebook-range","올림한 학생 수로 남은 공책 범위","source52NotebookRangeMissionThree","Mission 3 유사문항"],
    ["5-2-u1-e4-mission-4-rounded-seven-million-range","세 어림 조건을 만족하는 수의 범위","source52RoundedRangeMissionFour","Mission 4 유사문항"],
    ["5-2-u1-e4-mission-5-quotient-range-sum","두 몫의 어림 조건을 만족하는 수의 합","source52QuotientRangeSumMissionFive","Mission 5 유사문항"],
    ["5-2-u1-e4-mission-6-rounded-place-synthetic","반올림 자리별 가능한 수의 개수","source52RoundedCountMission6","Mission 6 유사문항"]
  ]) if (!source52RoundRange.types.some(t => t.id === id)) {
    source52RoundRange.types.push({id,number:source52RoundRange.types.length+1,name,label:name,sourceItemId:id,sourceItemLabel:label,sourceSection:"mission",sourcePdfPage:9,sourcePrintedPage:11,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,reviewReason:"원문 구조와 다른 수치의 창작 문항을 독립 열거로 검산했습니다. 출판사 답안은 미확인입니다.",generatorKey:key,generationMode:"fixed-verified-pool",implementationStatus:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:false,answerVisualStatus:"not-required"});
  }
  const source52Application = source52Unit1?.subunits.find(subunit => subunit.name === "어림하기의 활용 · 개념탐구 3 원문 연결");
  if (source52Application) for (const [n,name] of [[1,"어림한 방법 모두 찾기"],[2,"단위로 파는 리본의 가격"]]) {
    const id = `5-2-u1-e3-example-${n}`;
    const typeNumber = Math.max(0,...source52Unit1.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Application.types.push({id,number:source52Application.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceItemLabel:`예제 3-${n}`,sourceSection:"example",sourceTier:"advanced",sourcePdfPage:6,sourcePrintedPage:8,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:`source52RoundingPage8Example${n}`,generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문 구조를 확인하고 수치를 바꾼 유사문항을 검산했습니다."});
  }

  if (source52Application) for (const [n,name] of [[3,"상자와 묶음 판매액 · 연습"],[4,"택시 요금 계산 · 연습"]]) {
    const id = `5-2-u1-e3-example-${n}-synthetic`;
    const typeNumber = Math.max(0,...source52Unit1.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Application.types.push({id,number:source52Application.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceItemLabel:`예제 3-${n} 구조 연습`,sourceSection:"example",sourceTier:"advanced",sourcePdfPage:6,sourcePrintedPage:8,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:`source52Page8Example${n}Synthetic`,generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문은 조건 확인 전 잠금이며, 조건을 명확히 한 별도 창작 연습을 독립 검산했습니다."});
  }

  if (source52Application) {
    const id="5-2-u1-e3-exploration-life-synthetic",name="어림이 쓰이는 생활 상황 설명하기 · 연습";
    const typeNumber=Math.max(0,...source52Unit1.subunits.flatMap(subunit=>subunit.types.map(type=>Number(type.typeNumber)||0)))+1;
    source52Application.types.push({id,number:source52Application.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceItemLabel:"개념탐구 3 구조 연습",sourceSection:"exploration",sourceTier:"advanced",sourcePdfPage:6,sourcePrintedPage:8,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:"source52RoundingLifeSynthetic",resultContract:"open-response-example",multipleAnswers:true,automaticGrading:false,generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문은 답안 확인 전 잠금이며, 여러 답이 가능한 별도 설명 연습과 예시 풀이를 검산했습니다."});
  }

  const source52Unit2 = semesters.find(semester => semester.id === "5-2")?.units.find(unit => unit.id === "5-2-u2");
  const source52Unit2First = source52Unit2?.subunits.find(subunit => subunit.name === "분수와 자연수의 곱셈");
  if (source52Unit2First) for (const [n,name] of [[1,"두 집단의 분수만큼 더하기"],[2,"같은 방향 자동차 거리 차"]]) {
    const id = `5-2-u2-e1-example-${n}-synthetic`;
    const typeNumber = Math.max(0,...source52Unit2.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Unit2First.types.push({id,number:source52Unit2First.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceParentItemId:`5-2-u2-e1-example-${n}`,sourceItemLabel:`예제 1-${n} 유사문항`,sourceSection:"example",sourceTier:"advanced",sourcePdfPage:10,sourcePrintedPage:14,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:`source52U2Page14Example${n}Synthetic`,generationMode:"fixed-verified-pool",verifiedVariantTarget:1,verifiedVariantCount:1,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문 구조를 확인하고 수치를 바꾼 유사문항을 검산했습니다."});
  }

  if (source52Unit2First) for (const [n,name] of [[3,"두 시계의 빠르기와 느리기"],[4,"기약분수 조건을 만족하는 수"]]) {
    const id = `5-2-u2-e1-example-${n}-synthetic`;
    const typeNumber = Math.max(0,...source52Unit2.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Unit2First.types.push({id,number:source52Unit2First.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceParentItemId:`5-2-u2-e1-example-${n}`,sourceItemLabel:`예제 1-${n} 유사문항`,sourceSection:"example",sourceTier:"advanced",sourcePdfPage:10,sourcePrintedPage:14,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:`source52U2Page14Example${n}Synthetic`,generationMode:"fixed-verified-pool",verifiedVariantTarget:1,verifiedVariantCount:1,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문 구조를 확인하고 수치를 바꾼 유사문항을 검산했습니다."});
  }

  if (source52Unit2First && !source52Unit2First.types.some(type => type.id === "5-2-u2-e1-mission-4-synthetic")) {
    const id="5-2-u2-e1-mission-4-synthetic",name="양수의 분수 곱과 크기 순서 · 연습";
    const typeNumber=Math.max(0,...source52Unit2.subunits.flatMap(subunit=>subunit.types.map(type=>Number(type.typeNumber)||0)))+1;
    source52Unit2First.types.push({id,number:source52Unit2First.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceItemLabel:"Mission 4 유사문항",sourceSection:"mission",sourceTier:"advanced",sourcePdfPage:11,sourcePrintedPage:15,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:"source52PositiveFractionOrderSynthetic",generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문은 부호 확인 전 잠금이며 양수 조건을 명시한 별도 연습을 유리수 비교로 검산했습니다."});
  }
  if (source52Unit2First) {
    const id = "5-2-u2-e1-exploration-1-explanation-synthetic", typeNumber = Math.max(0,...source52Unit2.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Unit2First.types.push({id,number:source52Unit2First.types.length+1,typeNumber,name:"분수의 반복 덧셈과 곱셈 관계 설명",label:"분수의 반복 덧셈과 곱셈 관계 설명",difficultyBand:0,sourceItemId:id,sourceParentItemId:"5-2-u2-e1-exploration",sourceItemLabel:"개념탐구 1 (1) 설명형 유사문항",sourceSection:"exploration",sourceTier:"advanced",sourcePdfPage:10,sourcePrintedPage:14,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:"source52U2Exploration1Explanation",generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"반복 덧셈과 곱셈의 관계를 설명하는 별도 연습문항을 검산했습니다."});
  }
  if (source52Unit2First) for (const [suffix,name,label,page,section,key] of [
    ["exploration-2","분수 조건으로 두 수의 합 찾기","개념탐구 1 (2) 유사문항",14,"exploration","source52U2Concept12Synthetic"],
    ["mission-1","분수와 자연수의 곱 여섯 식","Mission 1 유사문항",15,"mission","source52U2Mission1Synthetic"],
    ["mission-2","분수 조건으로 남은 학생 수","Mission 2 유사문항",15,"mission","source52U2Mission2Synthetic"]]) {
    const id = `5-2-u2-e1-${suffix}-synthetic`, parent = suffix.startsWith("exploration") ? "5-2-u2-e1-exploration" : `5-2-u2-e1-${suffix}`;
    const typeNumber = Math.max(0,...source52Unit2.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Unit2First.types.push({id,number:source52Unit2First.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceParentItemId:parent,sourceItemLabel:label,sourceSection:section,sourceTier:"advanced",sourcePdfPage:page-4,sourcePrintedPage:page,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:key,generationMode:"fixed-verified-pool",verifiedVariantTarget:1,verifiedVariantCount:1,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문 구조를 확인하고 수치를 바꾼 유사문항을 검산했습니다."});
  }

  if (source52Unit2First) for (const [n,name] of [[3,"하루 시계 오차의 누적"],[5,"분수에 곱해 자연수가 되는 수"],[6,"부등식에 맞는 자연수의 합"]]) {
    const id = `5-2-u2-e1-mission-${n}-synthetic`;
    const typeNumber = Math.max(0,...source52Unit2.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Unit2First.types.push({id,number:source52Unit2First.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceParentItemId:`5-2-u2-e1-mission-${n}`,sourceItemLabel:`Mission ${n} 유사문항`,sourceSection:"mission",sourceTier:"advanced",sourcePdfPage:11,sourcePrintedPage:15,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:`source52U2Mission${n}Synthetic`,generationMode:"fixed-verified-pool",verifiedVariantTarget:1,verifiedVariantCount:1,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문 구조를 확인하고 수치를 바꾼 유사문항을 검산했습니다."});
  }

  const source52Unit2Product = source52Unit2?.subunits.find(subunit => subunit.name === "분수끼리의 곱셈");
  if (source52Unit2Product) for (const [suffix,name,label,section,key] of [
    ["exploration-1","전체 용량의 분수만큼 물의 양","개념탐구 2 (1) 유사문항","exploration","source52U2Page16Exploration21"],
    ["exploration-2","두 분수 곱의 합","개념탐구 2 (2) 유사문항","exploration","source52U2Page16Exploration22"],
    ["example-1","연속된 분수의 곱과 약분","예제 2-1 유사문항","example","source52U2Page16Example21"]]) {
    const id = `5-2-u2-e2-${suffix}-synthetic`, parent = section === "exploration" ? "5-2-u2-e2-exploration" : `5-2-u2-e2-${suffix}`;
    const typeNumber = Math.max(0,...source52Unit2.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Unit2Product.types.push({id,number:source52Unit2Product.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceParentItemId:parent,sourceItemLabel:label,sourceSection:section,sourceTier:"advanced",sourcePdfPage:12,sourcePrintedPage:16,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:key,generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문 구조를 확인하고 수치를 바꾼 유사문항을 독립 검산했습니다."});
  }

  if (source52Unit2Product) for (const [n,name,visual] of [[2,"직사각형의 두 부분 넓이 비",true],[3,"두 번째 반동까지 공의 이동 거리",false],[4,"직각이등변삼각형 속 여섯 정사각형",true]]) {
    const id = `5-2-u2-e2-example-${n}-synthetic`;
    const typeNumber = Math.max(0,...source52Unit2.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Unit2Product.types.push({id,number:source52Unit2Product.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceParentItemId:`5-2-u2-e2-example-${n}`,sourceItemLabel:`예제 2-${n} 유사문항`,sourceSection:"example",sourceTier:"advanced",sourcePdfPage:12,sourcePrintedPage:16,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:`source52U2Page16Example2${n}`,generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:visual,answerVisualStatus:visual?"verified-reconstruction":"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문 구조와 그림을 확인하고 수치를 바꾼 유사문항을 독립 검산했습니다."});
  }

  if (source52Unit2Product) {
    const id = "5-2-u2-e2-mission-1-synthetic", typeNumber = Math.max(0,...source52Unit2.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Unit2Product.types.push({id,number:source52Unit2Product.types.length+1,typeNumber,name:"다섯 분수 곱셈 계산",label:"다섯 분수 곱셈 계산",difficultyBand:0,sourceItemId:id,sourceParentItemId:"5-2-u2-e2-mission-1",sourceItemLabel:"Mission 1 유사문항",sourceSection:"mission",sourceTier:"advanced",sourcePdfPage:13,sourcePrintedPage:17,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:"source52U2Page17Mission1Synthetic",generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문 다섯 소문항의 구조를 확인하고 수치를 바꾼 유사문항을 독립 검산했습니다."});
  }

  if (source52Unit2Product) for (const [n,name] of [[2,"연속 배율로 거리 구하기"],[3,"분수 배열의 순서와 곱"],[4,"규칙적인 분수의 연속 곱"],[5,"세 번째 상승까지 공의 이동 거리"]]) {
    const id = `5-2-u2-e2-mission-${n}-synthetic`, typeNumber = Math.max(0,...source52Unit2.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Unit2Product.types.push({id,number:source52Unit2Product.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceParentItemId:`5-2-u2-e2-mission-${n}`,sourceItemLabel:`Mission ${n} 유사문항`,sourceSection:"mission",sourceTier:"advanced",sourcePdfPage:13,sourcePrintedPage:17,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:`source52U2Page17Mission${n}`,generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문 구조를 확인하고 수치를 바꾼 유사문항을 독립 검산했습니다."});
  }

  if (source52Unit2Product) {
    const id = "5-2-u2-e2-mission-6-spacing-synthetic", typeNumber = Math.max(0,...source52Unit2.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Unit2Product.types.push({id,number:source52Unit2Product.types.length+1,typeNumber,name:"중심 간격이 주어진 겹친 원과 직사각형",label:"중심 간격이 주어진 겹친 원과 직사각형",difficultyBand:0,sourceItemId:id,sourceParentItemId:"5-2-u2-e2-mission-6",sourceItemLabel:"Mission 6 조건을 추가한 유사문항",sourceSection:"mission",sourceTier:"advanced",sourcePdfPage:13,sourcePrintedPage:17,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:"source52U2Page17Mission6Spacing",generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문의 미확정 간격을 별도 연습문항에서 명시하고 독립 검산했습니다."});
  }

  const source52Unit2Equation = source52Unit2?.subunits.find(subunit => subunit.name === "식 세워 풀기");
  if (source52Unit2Equation) for (const [suffix,name,label,section,key] of [
    ["exploration","두 막대의 잠긴 길이로 깊이 구하기","개념탐구 3 유사문항","exploration","source52U2Page18Exploration3"],
    ["example-1","반동 높이에서 처음 높이 역산","예제 3-1 유사문항","example","source52U2Page18Example31"],
    ["example-2","부분 인원으로 전체 회원 비율 구하기","예제 3-2 유사문항","example","source52U2Page18Example32"]]) {
    const id = `5-2-u2-e3-${suffix}-synthetic`, typeNumber = Math.max(0,...source52Unit2.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Unit2Equation.types.push({id,number:source52Unit2Equation.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceParentItemId:`5-2-u2-e3-${suffix}`,sourceItemLabel:label,sourceSection:section,sourceTier:"advanced",sourcePdfPage:14,sourcePrintedPage:18,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:key,generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문 구조를 확인하고 수치를 바꾼 유사문항을 독립 검산했습니다."});
  }

  if (source52Unit2Equation) for (const [n,name] of [[3,"연속해서 남은 넓이로 전체 구하기"],[4,"같은 분수값과 합으로 두 금액 구하기"]]) {
    const id = `5-2-u2-e3-example-${n}-synthetic`, typeNumber = Math.max(0,...source52Unit2.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Unit2Equation.types.push({id,number:source52Unit2Equation.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceParentItemId:`5-2-u2-e3-example-${n}`,sourceItemLabel:`예제 3-${n} 유사문항`,sourceSection:"example",sourceTier:"advanced",sourcePdfPage:14,sourcePrintedPage:18,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:`source52U2Page18Example3${n}`,generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문 구조를 확인하고 수치를 바꾼 유사문항을 독립 검산했습니다."});
  }

  if (source52Unit2Equation) for (const [n,name] of [[1,"둘레와 가로세로 비로 넓이 구하기"],[2,"남은 도보 거리로 교통 이동 거리 구하기"],[3,"연속해서 남은 수량으로 처음 종류 구하기"]]) {
    const id = `5-2-u2-e3-mission-${n}-synthetic`, typeNumber = Math.max(0,...source52Unit2.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Unit2Equation.types.push({id,number:source52Unit2Equation.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceParentItemId:`5-2-u2-e3-mission-${n}`,sourceItemLabel:`Mission ${n} 유사문항`,sourceSection:"mission",sourceTier:"advanced",sourcePdfPage:15,sourcePrintedPage:19,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:`source52U2Page19Mission${n}`,generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문 구조를 확인하고 수치를 바꾼 유사문항을 독립 검산했습니다."});
  }

  if (source52Unit2Equation) for (const [n,name] of [[4,"묶음 가격과 배율 차로 한 개 가격 구하기"],[5,"전체의 분수와 추가 수량으로 세 사람의 수 구하기"],[6,"두 번 나눈 양과 남은 양의 배율 비교"]]) {
    const id = `5-2-u2-e3-mission-${n}-synthetic`, typeNumber = Math.max(0,...source52Unit2.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Unit2Equation.types.push({id,number:source52Unit2Equation.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceParentItemId:`5-2-u2-e3-mission-${n}`,sourceItemLabel:`Mission ${n} 유사문항`,sourceSection:"mission",sourceTier:"advanced",sourcePdfPage:15,sourcePrintedPage:19,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:`source52U2Page19Mission${n}`,generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문 구조를 확인하고 수치를 바꾼 유사문항을 독립 검산했습니다."});
  }

  const source52Unit2Application = source52Unit2?.subunits.find(subunit => subunit.name === "분수의 곱셈 응용 문제");
  if (source52Unit2Application) for (const [suffix,name,label,section,key] of [
    ["exploration","세 분수에 곱해 자연수가 되는 가장 작은 분수","개념탐구 4 유사문항","exploration","source52U2Page20Exploration4"],
    ["example-1","부분 넓이로 직사각형 세로 구하기","예제 4-1 유사문항","example","source52U2Page20Example41"],
    ["example-2","대각선과 분할선으로 수직선의 수 구하기","예제 4-2 유사문항","example","source52U2Page20Example42"],
    ["example-3","기약분수 곱의 자연수 조건","예제 4-3 유사문항","example","source52U2Page20Example43"],
    ["example-4","곱이 일정한 기약 진분수 짝의 수","예제 4-4 유사문항","example","source52U2Page20Example44"]]) {
    const id = `5-2-u2-e4-${suffix}-synthetic`, typeNumber = Math.max(0,...source52Unit2.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Unit2Application.types.push({id,number:source52Unit2Application.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceParentItemId:`5-2-u2-e4-${suffix}`,sourceItemLabel:label,sourceSection:section,sourceTier:"advanced",sourcePdfPage:16,sourcePrintedPage:20,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:key,generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문 구조를 확인하고 수치를 바꾼 유사문항을 독립 검산했습니다."});
  }

  if (source52Unit2Application) for (const [n,name] of [[1,"네 분수 배열의 최댓값"],[2,"기약 진분수 곱의 세 분자"],[3,"기약 진분수 곱의 빈칸 합"]]) {
    const id = `5-2-u2-e4-mission-${n}-synthetic`, typeNumber = Math.max(0,...source52Unit2.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Unit2Application.types.push({id,number:source52Unit2Application.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceParentItemId:`5-2-u2-e4-mission-${n}`,sourceItemLabel:`Mission ${n} 유사문항`,sourceSection:"mission",sourceTier:"advanced",sourcePdfPage:17,sourcePrintedPage:21,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:`source52U2Page21Mission${n}`,generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문 구조를 확인하고 수치를 바꾼 유사문항을 독립 검산했습니다."});
  }

  if (source52Unit2Application) for (const [n,name] of [[4,"자연수 결과를 만드는 빈칸의 합"],[5,"같은 간격 수직선의 위치"],[6,"세 곱이 자연수인 분수 중 가까운 값"]]) {
    const id = `5-2-u2-e4-mission-${n}-synthetic`, typeNumber = Math.max(0,...source52Unit2.subunits.flatMap(subunit => subunit.types.map(type => Number(type.typeNumber) || 0)))+1;
    source52Unit2Application.types.push({id,number:source52Unit2Application.types.length+1,typeNumber,name,label:name,difficultyBand:0,sourceItemId:id,sourceParentItemId:`5-2-u2-e4-mission-${n}`,sourceItemLabel:`Mission ${n} 유사문항`,sourceSection:"mission",sourceTier:"advanced",sourcePdfPage:17,sourcePrintedPage:21,sourceVerified:true,publisherKeyVerified:false,reviewLocked:false,generatorKey:`source52U2Page21Mission${n}`,generationMode:"fixed-verified-pool",verifiedVariantTarget:3,verifiedVariantCount:3,answerVisualRequired:false,answerVisualStatus:"not-required",implementationStatus:"fixed-verified-pool",reviewReason:"원문 구조와 그림을 확인하고 수치를 바꾼 유사문항을 독립 검산했습니다."});
  }

  semesters.forEach(semester => semester.units.forEach(unit => unit.subunits.forEach(subunit => subunit.types.forEach(type => {
    if (type.sourceItemId) return;
    type.sourceVerified = false;
    type.reviewLocked = true;
    type.reviewReason = "현행 심화 원본의 개별 문항·그림·정답과 연결되지 않아 출제하지 않습니다.";
    type.generationMode = "review-locked";
    type.verifiedVariantCount = 0;
    type.answerVisualStatus = "locked";
  }))));

  window.HSE_CURRICULUM = {
    version: "2026-09-16a",
    levels: [
      { id: "simwha", label: "심화 기준", rank: 1 }
    ],
    semesters
  };
})();
