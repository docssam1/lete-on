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
              id: `${id}-u${unitIndex + 1}-t${subunitIndex + 1}${typeIndex ? `-${typeIndex + 1}` : ""}`,
              number: typeIndex + 1,
              typeNumber: ++typeNumber,
              name: type.name || type.label || definition.name,
              label: type.label || type.name || "핵심 유형",
              generatorKey: type.generatorKey || "",
              variant: Number.isInteger(type.variant) ? type.variant : undefined,
              difficultyBand: Number.isInteger(type.difficultyBand) ? type.difficultyBand : 0,
              sourceTier: type.sourceTier || "advanced",
              sourceVerified: Boolean(type.sourceVerified),
              sourceEvidence: type.sourceEvidence || "",
              sourceItemId: type.sourceItemId || "",
              sourceItemLabel: type.sourceItemLabel || "",
              sourceSection: type.sourceSection || "",
              sourcePdfPage: Number.isInteger(type.sourcePdfPage) ? type.sourcePdfPage : undefined,
              sourcePrintedPage: Number.isInteger(type.sourcePrintedPage) ? type.sourcePrintedPage : undefined,
              reviewLocked: Boolean(type.reviewLocked),
              reviewReason: type.reviewReason || type.reviewLockReason || ""
            }))
          };
        })
      };
    })
  });

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
          sourceItem42("불규칙 선 배열의 모든 삼각형", 1, "4-2-triangle-1-exploration", 15, 20, true),
          sourceItem42("별 모양 삼각 격자의 삼각형 세기", 0, "4-2-triangle-1-example-1", 15, 20, true),
          sourceItem42("색칠한 삼각형을 포함하는 삼각형", 1, "4-2-triangle-1-example-2", 15, 20),
          sourceItem42("두 선 배열에서 삼각형 각각 세기", 1, "4-2-triangle-1-example-3", 15, 20),
          sourceItem42("큰 삼각형 내부의 모든 삼각형", 1, "4-2-triangle-1-example-4", 15, 20, true)
        ]),
        detailed("예각삼각형, 직각삼각형, 둔각삼각형", "triangleAngleType", [
          sourceItem42("둔각삼각형 개수로 가능한 값 찾기", 0, "4-2-triangle-2-mission-1", 18, 23, true),
          sourceItem42("별 모양의 예각·둔각삼각형 세기", 0, "4-2-triangle-2-mission-2", 18, 23, true),
          sourceItem42("두 각을 골라 둔각삼각형 만드는 방법", 1, "4-2-triangle-2-mission-3", 18, 23, true),
          sourceItem42("모눈 도형의 둔각삼각형 세기", 1, "4-2-triangle-2-mission-4", 18, 23, true),
          sourceItem42("예각과 둔각삼각형 수의 차", 1, "4-2-triangle-2-mission-5", 18, 23, true),
          sourceItem42("점판에서 직각삼각형 세기", 1, "4-2-triangle-2-mission-6", 18, 23, true),
          sourceItem42("점판에 서로 다른 둔각삼각형 그리기", 0, "4-2-triangle-2-exploration", 17, 22),
          sourceItem42("정삼각형을 나누어 둔각삼각형 만들기", 0, "4-2-triangle-2-example-1", 17, 22, true),
          sourceItem42("선분 도형의 예각·둔각삼각형 세기", 0, "4-2-triangle-2-example-2", 17, 22, true),
          sourceItem42("직각 표시 도형의 직각삼각형 세기", 0, "4-2-triangle-2-example-3", 17, 22, true),
          sourceItem42("각 두 개를 골라 둔각삼각형 만드는 방법", 1, "4-2-triangle-2-example-4", 17, 22, true)
        ]),
        detailed("이등변삼각형", "isoscelesTriangle", [
          sourceItem42("맞붙인 이등변삼각형의 둘레", 0, "4-2-triangle-3-mission-1", 20, 25, true),
          sourceItem42("같은 길이 선분이 있는 각 구하기", 0, "4-2-triangle-3-mission-2", 20, 25, true),
          sourceItem42("여러 이등변삼각형을 이은 둘레", 0, "4-2-triangle-3-mission-3", 20, 25, true),
          sourceItem42("이등변삼각형을 이어 만든 각", 1, "4-2-triangle-3-mission-4", 20, 25, true),
          sourceItem42("접은 이등변삼각형의 각", 1, "4-2-triangle-3-mission-5", 20, 25, true),
          sourceItem42("원 위 점으로 이등변삼각형 만들기", 1, "4-2-triangle-3-mission-6", 20, 25, true),
          sourceItem42("직선을 추가해 이등변삼각형 최대로 만들기", 1, "4-2-triangle-3-exploration", 19, 24, true),
          sourceItem42("점판에서 서로 다른 이등변삼각형 세기", 1, "4-2-triangle-3-example-1", 19, 24, true),
          sourceItem42("이등변삼각형 띠의 짧은 변 구하기", 0, "4-2-triangle-3-example-2", 19, 24, true),
          sourceItem42("연속한 이등변삼각형의 각 구하기", 1, "4-2-triangle-3-example-3", 19, 24, true),
          sourceItem42("접은 이등변삼각형의 각 구하기", 1, "4-2-triangle-3-example-4", 19, 24, true)
        ]),
        detailed("정삼각형", "equilateralTriangle", [
          sourceItem42("정삼각형을 이어 만든 도형의 둘레", 0, "4-2-triangle-4-mission-1", 22, 27),
          sourceItem42("정삼각형과 사각형이 겹친 각", 0, "4-2-triangle-4-mission-2", 22, 27, true),
          sourceItem42("정삼각형이 이어진 도형의 각", 1, "4-2-triangle-4-mission-3", 22, 27, true),
          sourceItem42("정삼각형이 이어진 도형의 길이와 각", 1, "4-2-triangle-4-mission-4", 22, 27, true),
          sourceItem42("정삼각형으로 이룬 육각형의 길이", 1, "4-2-triangle-4-mission-5", 22, 27, true),
          sourceItem42("정삼각형과 사다리꼴의 선분 길이", 1, "4-2-triangle-4-mission-6", 22, 27, true),
          sourceItem42("성냥개비를 옮겨 정삼각형 수 줄이기", 1, "4-2-triangle-4-exploration", 21, 26, true),
          sourceItem42("정삼각형과 마름모에서 각 구하기", 0, "4-2-triangle-4-example-1", 21, 26, true),
          sourceItem42("직각삼각형 속 정삼각형의 각", 0, "4-2-triangle-4-example-2", 21, 26, true),
          sourceItem42("정삼각형을 이어 붙인 색칠 도형의 둘레", 1, "4-2-triangle-4-example-3", 21, 26, true),
          sourceItem42("정사각형과 정삼각형의 선분 길이 합", 1, "4-2-triangle-4-example-4", 21, 26, true)
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
          sourceItem42("기준 무게의 10배 역산", 0, "4-2-decimal-1-exploration", 25, 30, true),
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
          sourceItem42("범위 안의 소수 네 자리 수 세기", 0, "4-2-decimal-4-exploration", 31, 36, true),
          sourceItem42("자리값이 다른 두 수의 차로 자연수 구하기", 1, "4-2-decimal-4-example-1", 31, 36, true),
          sourceItem42("서로 다른 숫자의 소수식 최댓값", 1, "4-2-decimal-4-example-2", 31, 36, true),
          sourceItem42("수 카드로 만든 소수의 순위 차", 1, "4-2-decimal-4-example-3", 31, 36, true),
          sourceItem42("수 카드로 만든 소수의 차 조건", 1, "4-2-decimal-4-example-4", 31, 36, true)
        ])
      ],
      ["사각형",
        detailed("수선과 평행선", "quadPerpParallelDistance", [
          sourced42("수직인 두 직선의 쌍 세기", -1, "4-2 심화 p.35-36 개념탐구 1·Mission"),
          sourced42("평행인 두 직선의 쌍 세기", -1, "4-2 심화 p.35-36 개념탐구 1·Mission"),
          sourced42("비로 주어진 평행선 사이 거리", 0, "4-2 심화 p.35-36 개념탐구 1·Mission"),
          sourced42("연속한 수선으로 전체 거리 구하기", 0, "4-2 심화 p.35-36 개념탐구 1·Mission"),
          sourced42("전체 거리에서 수선의 빈 길이 구하기", 1, "4-2 심화 p.35-36 개념탐구 1·Mission")
        ]),
        detailed("평행선의 조건과 성질", "quadParallelAngleCondition", [
          sourced42("여러 평행선의 동위각 합", -1, "4-2 심화 p.37-38 개념탐구 2·Mission"),
          sourced42("여러 평행선의 엇각 합", 0, "4-2 심화 p.37-38 개념탐구 2·Mission"),
          sourced42("각의 조건으로 평행한 직선 찾기", 1, "4-2 심화 p.37-38 개념탐구 2·Mission")
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
          sourced42("두 날의 자료 값 차 구하기", -1, "4-2 심화 p.52-53 개념탐구 1·Mission"),
          sourced42("연속한 여러 날의 자료 값 합", 0, "4-2 심화 p.52-53 개념탐구 1·Mission"),
          sourced42("가장 큰 값과 가장 작은 값의 차", 0, "4-2 심화 p.52-53 개념탐구 1·Mission")
        ]),
        detailed("꺾은선그래프의 활용", "lineGraphApplication", [
          sourced42("두 이동 그래프와 연료 사용량 비교", 0, "4-2 심화 p.54-55 개념탐구 2·Mission"),
          sourced42("물탱크 그래프에서 한 수도꼭지의 시간 역산", 1, "4-2 심화 p.54-55 개념탐구 2·Mission"),
          sourced42("두 판매 그래프와 단가로 금액 차 구하기", 1, "4-2 심화 p.54-55 개념탐구 2·Mission")
        ])
      ],
      ["다각형",
        detailed("정다각형과 대각선", "polygonDiagonals", [
          sourced42("한 꼭짓점에서 그을 수 있는 대각선 수", -1, "4-2 심화 p.58-59 개념탐구 1·Mission"),
          sourced42("전체 대각선 수로 정다각형 역산", 1, "4-2 심화 p.58-59 개념탐구 1·Mission"),
          sourced42("두 정다각형의 대각선 수 차", 0, "4-2 심화 p.58-59 개념탐구 1·Mission")
        ]),
        detailed("정다각형의 활용", "regularPolygonApplication", [
          sourced42("한 내각으로 한 외각 구하기", -1, "4-2 심화 p.60-61 개념탐구 2·Mission"),
          sourced42("정다각형의 한 변으로 둘레 구하기", -1, "4-2 심화 p.60-61 개념탐구 2·Mission"),
          sourced42("한 점을 채운 정다각형의 빈 각", 0, "4-2 심화 p.60-61 개념탐구 2·Mission")
        ]),
        detailed("평면 덮기", "tessellationCover", [
          sourced42("정사각형 타일로 덮은 바닥의 타일 수", -1, "4-2 심화 p.62-63 개념탐구 3·Mission"),
          sourced42("교차 색칠한 타일 중 한 색의 수", 0, "4-2 심화 p.62-63 개념탐구 3·Mission"),
          sourced42("서로 다른 크기 직사각형의 덮기", 0, "4-2 심화 p.62-63 개념탐구 3·Mission")
        ]),
        detailed("도형 나누기와 만들기", "shapePartitionCompose", [
          sourced42("ㄴ자 조각을 돌려 놓는 방법의 수", 0, "4-2 심화 p.64 개념탐구 4·Mission"),
          sourced42("막대 조각을 돌려 놓는 방법의 수", 0, "4-2 심화 p.64 개념탐구 4·Mission"),
          sourced42("ㅜ자 조각을 돌려 놓는 방법의 수", 1, "4-2 심화 p.64 개념탐구 4·Mission")
        ])
      ]
    ]),
    semester("5-1", [
      ["자연수의 혼합 계산", "혼합 계산의 순서", "하나의 식으로 나타내기", "식 세워 풀기", "혼합 계산식 만들기"],
      ["약수와 배수", "약수와 배수", "소인수분해 1", "소인수분해 2", "소인수분해의 활용", "공약수와 최대공약수", "공배수와 최소공배수", "배수판정법", "세 수의 최대공약수와 최소공배수", "약수의 개수", "공약수의 활용", "공배수의 활용", "최대공약수와 최소공배수의 관계"],
      ["규칙과 대응", "규칙과 대응", "대응표와 대응 관계", "규칙과 대응의 활용 ①", "규칙과 대응의 활용 ②"],
      ["약분과 통분", "크기가 같은 분수", "약분과 기약분수", "통분과 분수의 크기 비교", "조건에 맞는 분수 찾기"],
      ["분수의 덧셈과 뺄셈", "분수의 덧셈", "분수의 뺄셈", "식 세워 풀기", "단위분수와 부분분수"],
      ["다각형의 둘레와 넓이", "다각형의 둘레", "직사각형과 직각삼각형의 넓이", "둘레와 넓이", "여러 가지 사각형의 넓이"]
    ]),
    semester("5-2", [
      ["수의 범위와 어림하기",
        detailed("수의 범위", "advancedRange", ["두 범위의 공통 조건과 합집합", "조건에서 새로운 수의 범위 구하기", "나누어 담는 개수의 범위"]),
        detailed("어림하기", "advancedRounding", ["여러 어림 방법의 결과 비교", "어림 조건을 만족하는 수 찾기", "수 카드로 만든 수를 어림하기"]),
        detailed("어림하기의 활용", "roundingApplication", ["묶음 단위와 필요한 금액 구하기", "단위 환산 뒤 묶음 수와 금액 구하기", "구간별 요금 계산하기"]),
        detailed("어림한 수의 범위", "roundedRange", ["여러 어림 조건의 공통 범위", "배수의 어림값으로 수 찾기", "어림한 합에서 실제 합의 범위 찾기"])
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
        detailed("점대칭의 활용", "pointSymmetryApplication", ["회전하는 도형이 점대칭이 되는 시각", "점대칭 사다리꼴의 전체 넓이", "중심을 지나는 격자 직선 세기"])
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

  semesters[0] = buildSourceSemester41(semesters[0]);

  window.HSE_CURRICULUM = {
    version: "2026-08-29",
    levels: [
      { id: "simwha", label: "심화 기준", rank: 1 }
    ],
    semesters
  };
})();
