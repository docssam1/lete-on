// 옛 교사용 교재의 현행 범위 발췌. 인쇄 답과 독립 검토 요지를 구별한다.
export const sourceRegistration={
  "schemaVersion": "science-reviewed-source-registration/v1",
  "unit": "c22-s51-u01",
  "items": 17,
  "teacherReview": 12,
  "audience": "all-science-app-students",
  "loginRequired": false,
  "transport": "static-files",
  "sourceScope": "legacy-textbook-current-core-extract",
  "wholeCurrentEdition": false,
  "runtimeRegistered": true,
  "currentTaxonomyBound": true,
  "pairedItemsBound": 17,
  "reviewedContentSha256": "4bf68e3af61fa4b8fa61516d44f8a789c1ea0151ca261e94772be4555bb64a41",
  "sourcePdfSha256": "5f54ce7a1e7435d9ac897e86085afe087190a80aaad550a9b020cc272154d23e",
  "sourcePages": [
    26,
    27,
    28,
    29,
    30,
    33
  ]
};
export const source=[
  {
    "key": "1-1",
    "id": "c22-s51-u01-o1-01",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
      "type": "original",
      "sourceId": "gfield-theory-42-1",
      "set": 1,
      "no": 1,
      "originalNo": 1,
      "page": 26,
      "edition": "4-2-1단계-교사.pdf",
      "course": "교재 지면 표기 초4-1",
      "unit": "지층과 화석",
      "targetUnit": "c22-s51-u01",
      "label": "이론 개념 확인",
      "reviewOnly": false
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T01",
      "format": "복수선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과01-01",
      "topic": "지층의 층·경계·색과 두께",
      "concept": "지층의 층·경계·색과 두께",
      "inquirySkill": "여러 근거 비교"
    },
    "sourceTaxonomy": {
      "section": "이론 개념 확인",
      "page": 26,
      "originalNo": 1
    },
    "prompt": "다음 중 지층에 대한 설명으로 옳은 것을 모두 고르시오.",
    "choices": [
      "모든 층의 색깔이 같다.",
      "암석이 층으로 쌓여 있다.",
      "하나의 암석으로 되어 있다.",
      "샌드위치와 비슷한 모양이다.",
      "지층을 이루는 알갱이의 크기는 모두 비슷하다."
    ],
    "sourceContextBlocks": [],
    "sourceMaterialBlocks": [],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        3
      ],
      "accepted": [
        [
          1,
          3
        ]
      ]
    },
    "printedAnswerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        3
      ],
      "accepted": [
        [
          1,
          3
        ]
      ]
    },
    "printedExplanation": "지층은 암석이 층으로 쌓여 있는 것을 말하며 샌드위치, 시루떡 등과 비슷한 모양이다.",
    "explanation": "지층은 암석이 층으로 쌓여 있는 것을 말하며 샌드위치, 시루떡 등과 비슷한 모양이다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
      "itemId": "c22-s51-u01-b006",
      "sourceId": "gfield-theory-42-1",
      "set": 1,
      "no": 1
    },
    "evidence": {
      "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
      "date": "2026-11-15",
      "gates": [
        "source",
        "answer",
        "curriculum"
      ],
      "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
      "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    }
  },
  {
    "key": "1-2",
    "id": "c22-s51-u01-o1-02",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
      "type": "original",
      "sourceId": "gfield-theory-42-1",
      "set": 1,
      "no": 2,
      "originalNo": 2,
      "page": 26,
      "edition": "4-2-1단계-교사.pdf",
      "course": "교재 지면 표기 초4-1",
      "unit": "지층과 화석",
      "targetUnit": "c22-s51-u01",
      "label": "이론 개념 확인",
      "reviewOnly": true
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T04",
      "format": "복수선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과01-01",
      "topic": "지층 형성 모형과 한계",
      "concept": "지층 형성 모형과 한계",
      "inquirySkill": "관찰 근거·조건 판단"
    },
    "sourceTaxonomy": {
      "section": "이론 개념 확인",
      "page": 26,
      "originalNo": 2
    },
    "prompt": "오른쪽 사진과 같이 고무찰흙으로 만든 지층 모형과 실제 지층의 다른 점을 모두 고르시오.",
    "choices": [
      "층의 두께",
      "층이 쌓이는 순서",
      "바깥쪽 면과 안쪽 면의 모양",
      "층이 쌓이는 데 걸리는 시간",
      "층을 이루는 알갱이의 크기와 종류"
    ],
    "sourceContextBlocks": [],
    "sourceMaterialBlocks": [
      {
        "type": "figure",
        "src": "assets/bank/c22-s51-u01/p26-clay-model.png",
        "alt": "교재 원본의 여러 색 점토를 층으로 쌓은 지층 모형 사진"
      }
    ],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3,
        4
      ],
      "accepted": [
        [
          0,
          3,
          4
        ]
      ],
      "sourceResponseContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "쓴 답과 까닭을 확인해요.",
        "required": [
          "모형 사진만 있고 비교할 실제 지층의 관찰 자료가 없다. 두께·바깥과 안쪽 모양이 언제나 같거나 다르다고 단정하지 않고 재료·시간·관찰 범위를 확인한다."
        ],
        "exactStringScoring": false
      },
      "reviewRequired": true
    },
    "printedAnswerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3,
        4
      ],
      "accepted": [
        [
          0,
          3,
          4
        ]
      ]
    },
    "printedExplanation": "실제 지층과 지층 모형은 층이 쌓이는 순서와 바깥쪽 면과 안쪽 면의 모양이 같다.",
    "explanation": "모형 사진만 있고 비교할 실제 지층의 관찰 자료가 없다. 두께·바깥과 안쪽 모양이 언제나 같거나 다르다고 단정하지 않고 재료·시간·관찰 범위를 확인한다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
      "itemId": "c22-s51-u01-b028",
      "sourceId": "gfield-theory-42-1",
      "set": 1,
      "no": 2
    },
    "evidence": {
      "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
      "date": "2026-11-15",
      "gates": [
        "source",
        "answer",
        "curriculum"
      ],
      "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
      "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    },
    "reviewSummary": "모형 사진만 있고 비교할 실제 지층의 관찰 자료가 없다. 두께·바깥과 안쪽 모양이 언제나 같거나 다르다고 단정하지 않고 재료·시간·관찰 범위를 확인한다.",
    "legacyAutomaticAnswerHold": true,
    "sourceAmbiguity": true,
    "sourceReviewSources": []
  },
  {
    "key": "1-3",
    "id": "c22-s51-u01-o1-03",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
      "type": "original",
      "sourceId": "gfield-theory-42-1",
      "set": 1,
      "no": 3,
      "originalNo": 3,
      "page": 26,
      "edition": "4-2-1단계-교사.pdf",
      "course": "교재 지면 표기 초4-1",
      "unit": "지층과 화석",
      "targetUnit": "c22-s51-u01",
      "label": "이론 개념 확인",
      "reviewOnly": false
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과01-02",
      "topic": "퇴적물과 퇴적암의 관계",
      "concept": "퇴적물과 퇴적암의 관계",
      "inquirySkill": "관찰 근거·조건 판단"
    },
    "sourceTaxonomy": {
      "section": "이론 개념 확인",
      "page": 26,
      "originalNo": 3
    },
    "prompt": "다음 <보기>는 지층이 만들어지는 과정을 순서 없이 나타낸 것이다. 지층이 만들어지는 과정을 순서대로 바르게 나열한 것은?",
    "choices": [
      "㉠ - ㉡ - ㉢ - ㉣",
      "㉠ - ㉡ - ㉣ - ㉢",
      "㉠ - ㉢ - ㉡ - ㉣",
      "㉡ - ㉠ - ㉢ - ㉣",
      "㉢ - ㉡ - ㉠ - ㉣"
    ],
    "sourceContextBlocks": [],
    "sourceMaterialBlocks": [
      {
        "type": "list",
        "items": [
          "㉠ 진흙, 모래, 자갈 등이 운반된다.",
          "㉡ 진흙, 모래, 자갈 등이 강이나 바다 밑에 쌓인다.",
          "㉢ 오랜 시간이 지나 단단한 지층이 만들어진다.",
          "㉣ 진흙, 모래, 자갈 등이 계속 쌓이고, 먼저 쌓인 지층이 눌린다."
        ]
      }
    ],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "printedAnswerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "printedExplanation": "퇴적물이 운반되고 쌓인 후 다져지면 지층이 된다.",
    "explanation": "퇴적물이 운반되고 쌓인 후 다져지면 지층이 된다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
      "itemId": "c22-s51-u01-b033",
      "sourceId": "gfield-theory-42-1",
      "set": 1,
      "no": 3
    },
    "evidence": {
      "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
      "date": "2026-11-15",
      "gates": [
        "source",
        "answer",
        "curriculum"
      ],
      "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
      "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    }
  },
  {
    "key": "1-4",
    "id": "c22-s51-u01-o1-04",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
      "type": "original",
      "sourceId": "gfield-theory-42-1",
      "set": 1,
      "no": 4,
      "originalNo": 4,
      "page": 26,
      "edition": "4-2-1단계-교사.pdf",
      "course": "교재 지면 표기 초4-1",
      "unit": "지층과 화석",
      "targetUnit": "c22-s51-u01",
      "label": "이론 개념 확인",
      "reviewOnly": false
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과01-02",
      "topic": "퇴적물과 퇴적암의 관계",
      "concept": "퇴적물과 퇴적암의 관계",
      "inquirySkill": "관찰 근거·조건 판단"
    },
    "sourceTaxonomy": {
      "section": "이론 개념 확인",
      "page": 26,
      "originalNo": 4
    },
    "prompt": "위 실험 과정에서 풀을 넣는 이유로 옳은 것은?",
    "choices": [
      "자갈을 단단하게 만들기 위해",
      "모래를 쉽게 부서지기 하기 위해",
      "모래와 자갈을 더럽게 하기 위해",
      "모래와 자갈을 잘 굳게 하기 위해",
      "모래와 자갈이 잘 붙지 않게 하기 위해"
    ],
    "sourceContextBlocks": [
      {
        "type": "text",
        "text": "[4~5] 다음은 모래와 자갈을 굳히는 실험 과정이다. 물음에 답하시오."
      },
      {
        "type": "list",
        "items": [
          "㉠ 반으로 자른 페트병에 모래와 자갈을 넣는다.",
          "㉡ 모래와 자갈을 섞은 후 물풀을 넣는다.",
          "㉢ 손으로 잘 누른다.",
          "㉣ 1~2일 동안 굳힌다."
        ]
      },
      {
        "type": "figure",
        "src": "assets/bank/c22-s51-u01/p26-sand-gravel-model.png",
        "alt": "교재에 제시된 모래·자갈과 물풀을 넣고 누르는 모형 실험 사진 세 장"
      }
    ],
    "sourceMaterialBlocks": [],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "printedAnswerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "printedExplanation": "실험 과정에서 물풀은 모래와 자갈을 잘 굳게 하기 위해 넣으며, 실제 강물이나 바닷물속에는 물풀과 같은 역할을 하는 물질이 녹아있다.",
    "explanation": "실험 과정에서 물풀은 모래와 자갈을 잘 굳게 하기 위해 넣으며, 실제 강물이나 바닷물속에는 물풀과 같은 역할을 하는 물질이 녹아있다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
      "itemId": "c22-s51-u01-b036",
      "sourceId": "gfield-theory-42-1",
      "set": 1,
      "no": 4
    },
    "evidence": {
      "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
      "date": "2026-11-15",
      "gates": [
        "source",
        "answer",
        "curriculum"
      ],
      "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
      "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    }
  },
  {
    "key": "1-5",
    "id": "c22-s51-u01-o1-05",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
      "type": "original",
      "sourceId": "gfield-theory-42-1",
      "set": 1,
      "no": 5,
      "originalNo": 5,
      "page": 26,
      "edition": "4-2-1단계-교사.pdf",
      "course": "교재 지면 표기 초4-1",
      "unit": "지층과 화석",
      "targetUnit": "c22-s51-u01",
      "label": "이론 개념 확인",
      "reviewOnly": false
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과01-02",
      "topic": "퇴적물과 퇴적암의 관계",
      "concept": "퇴적물과 퇴적암의 관계",
      "inquirySkill": "근거 설명·모형·수행 구별"
    },
    "sourceTaxonomy": {
      "section": "이론 개념 확인",
      "page": 26,
      "originalNo": 5
    },
    "prompt": "위 실험을 통해 알아보려고 하는 것은?",
    "choices": [
      "모래가 생성되는 과정",
      "땅이 편평하게 되는 과정",
      "지층에 층이 생기는 까닭",
      "지층이 단단하게 굳는 까닭",
      "지층을 이루는 알갱이의 크기가 다른 까닭"
    ],
    "sourceContextBlocks": [
      {
        "type": "text",
        "text": "[4~5] 다음은 모래와 자갈을 굳히는 실험 과정이다. 물음에 답하시오."
      },
      {
        "type": "list",
        "items": [
          "㉠ 반으로 자른 페트병에 모래와 자갈을 넣는다.",
          "㉡ 모래와 자갈을 섞은 후 물풀을 넣는다.",
          "㉢ 손으로 잘 누른다.",
          "㉣ 1~2일 동안 굳힌다."
        ]
      },
      {
        "type": "figure",
        "src": "assets/bank/c22-s51-u01/p26-sand-gravel-model.png",
        "alt": "교재에 제시된 모래·자갈과 물풀을 넣고 누르는 모형 실험 사진 세 장"
      }
    ],
    "sourceMaterialBlocks": [],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "printedAnswerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "printedExplanation": "이 실험은 모래와 자갈이 굳어 단단한 지층이 되는 것을 알아보는 모형 실험이다.",
    "explanation": "이 실험은 모래와 자갈이 굳어 단단한 지층이 되는 것을 알아보는 모형 실험이다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
      "itemId": "c22-s51-u01-b040",
      "sourceId": "gfield-theory-42-1",
      "set": 1,
      "no": 5
    },
    "evidence": {
      "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
      "date": "2026-11-15",
      "gates": [
        "source",
        "answer",
        "curriculum"
      ],
      "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
      "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    }
  },
  {
    "key": "1-6",
    "id": "c22-s51-u01-o1-06",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
      "type": "original",
      "sourceId": "gfield-theory-42-1",
      "set": 1,
      "no": 6,
      "originalNo": 6,
      "page": 27,
      "edition": "4-2-1단계-교사.pdf",
      "course": "교재 지면 표기 초4-1",
      "unit": "지층과 화석",
      "targetUnit": "c22-s51-u01",
      "label": "이론 개념 확인",
      "reviewOnly": false
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과01-02",
      "topic": "이암·사암·역암 분류",
      "concept": "이암·사암·역암 분류",
      "inquirySkill": "관찰 근거·조건 판단"
    },
    "sourceTaxonomy": {
      "section": "이론 개념 확인",
      "page": 27,
      "originalNo": 6
    },
    "prompt": "지층을 이루고 있는 암석을 다음과 같이 이암, 사암, 역암으로 구분하는 기준은 무엇인가?",
    "choices": [
      "암석의 모양",
      "암석의 색깔",
      "암석의 크기",
      "암석이 만들어진 시기",
      "암석을 이루는 알갱이의 크기"
    ],
    "sourceContextBlocks": [],
    "sourceMaterialBlocks": [
      {
        "type": "figure",
        "src": "assets/bank/c22-s51-u01/p27-three-sedimentary-rocks.png",
        "alt": "교재 원본 표본 사진과 이름: 이암, 사암, 역암"
      }
    ],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "printedAnswerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "printedExplanation": "지층을 이루는 암석을 퇴적암이라고 하며 알갱이의 크기에 따라 이암, 사암, 역암으로 구분한다.",
    "explanation": "지층을 이루는 암석을 퇴적암이라고 하며 알갱이의 크기에 따라 이암, 사암, 역암으로 구분한다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
      "itemId": "c22-s51-u01-b052",
      "sourceId": "gfield-theory-42-1",
      "set": 1,
      "no": 6
    },
    "evidence": {
      "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
      "date": "2026-11-15",
      "gates": [
        "source",
        "answer",
        "curriculum"
      ],
      "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
      "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    }
  },
  {
    "key": "1-7",
    "id": "c22-s51-u01-o1-07",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
      "type": "original",
      "sourceId": "gfield-theory-42-1",
      "set": 1,
      "no": 7,
      "originalNo": 7,
      "page": 27,
      "edition": "4-2-1단계-교사.pdf",
      "course": "교재 지면 표기 초4-1",
      "unit": "지층과 화석",
      "targetUnit": "c22-s51-u01",
      "label": "이론 개념 확인",
      "reviewOnly": true
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "복수선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과01-03",
      "topic": "동물·식물·활동 흔적 화석",
      "concept": "동물·식물·활동 흔적 화석",
      "inquirySkill": "관찰 근거·조건 판단"
    },
    "sourceTaxonomy": {
      "section": "이론 개념 확인",
      "page": 27,
      "originalNo": 7
    },
    "prompt": "다음 중 화석이 아닌 것을 모두 고르시오.",
    "choices": [
      "고인돌",
      "조개 무덤",
      "진흙에 난 신발 자국",
      "동물의 발자국이 남은 암석",
      "물고기의 흔적이 남은 암석"
    ],
    "sourceContextBlocks": [],
    "sourceMaterialBlocks": [],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1,
        2
      ],
      "accepted": [
        [
          0,
          1,
          2
        ]
      ],
      "sourceResponseContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "쓴 답과 까닭을 확인해요.",
        "required": [
          "유물과 화석은 생물의 증거와 보존 맥락으로 구별한다. 동물 발자국이 남은 암석이라는 표현만으로 보존 시기와 맥락이 모두 확인되지는 않는다. 화석을 죽은 몸이나 지층 속 증거만으로 제한하지 않는다."
        ],
        "exactStringScoring": false
      },
      "reviewRequired": true
    },
    "printedAnswerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1,
        2
      ],
      "accepted": [
        [
          0,
          1,
          2
        ]
      ]
    },
    "printedExplanation": "화석은 지질시대에 살았던 동물이나 식물이 죽어서 유해나 그 흔적이 지층 속에 남아 있는 것으로 고인돌, 조개 무덤, 진흙에 난 신발 자국 등은 화석이 아니다.",
    "explanation": "유물과 화석은 생물의 증거와 보존 맥락으로 구별한다. 동물 발자국이 남은 암석이라는 표현만으로 보존 시기와 맥락이 모두 확인되지는 않는다. 화석을 죽은 몸이나 지층 속 증거만으로 제한하지 않는다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
      "itemId": "c22-s51-u01-b069",
      "sourceId": "gfield-theory-42-1",
      "set": 1,
      "no": 7
    },
    "evidence": {
      "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
      "date": "2026-11-15",
      "gates": [
        "source",
        "answer",
        "curriculum"
      ],
      "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
      "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    },
    "reviewSummary": "유물과 화석은 생물의 증거와 보존 맥락으로 구별한다. 동물 발자국이 남은 암석이라는 표현만으로 보존 시기와 맥락이 모두 확인되지는 않는다. 화석을 죽은 몸이나 지층 속 증거만으로 제한하지 않는다.",
    "legacyAutomaticAnswerHold": true,
    "sourceAmbiguity": true,
    "sourceReviewSources": [
      "https://www.nps.gov/subjects/fossils/what-is-a-fossil.htm",
      "https://www.nps.gov/fobu/planyourvisit/visitorcenterexhibits.htm"
    ]
  },
  {
    "key": "1-8",
    "id": "c22-s51-u01-o1-08",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
      "type": "original",
      "sourceId": "gfield-theory-42-1",
      "set": 1,
      "no": 8,
      "originalNo": 8,
      "page": 27,
      "edition": "4-2-1단계-교사.pdf",
      "course": "교재 지면 표기 초4-1",
      "unit": "지층과 화석",
      "targetUnit": "c22-s51-u01",
      "label": "이론 개념 확인",
      "reviewOnly": true
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T10",
      "format": "복수선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과01-03",
      "topic": "화석 생성 모형과 실제",
      "concept": "화석 생성 모형과 실제",
      "inquirySkill": "여러 근거 비교"
    },
    "sourceTaxonomy": {
      "section": "이론 개념 확인",
      "page": 27,
      "originalNo": 8
    },
    "prompt": "다음 중 실제 화석과 화석 모형에 대한 설명으로 옳은 것을 모두 고르시오.",
    "choices": [
      "화석 모형은 단단하지만 실제 화석은 무르다.",
      "화석 모형은 모두 볼록하고, 실제 화석은 모두 오목하다.",
      "실제 화석보다 화석 모형이 만들어지는 데 오랜 시간이 걸린다.",
      "실제 화석과 화석 모형은 실제 생물과 크기와 모양이 비슷하다.",
      "실제 화석과 화석 모형 모두 생물의 겉모습이 뚜렷하게 나타난다."
    ],
    "sourceContextBlocks": [],
    "sourceMaterialBlocks": [],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        3,
        4
      ],
      "accepted": [
        [
          3,
          4
        ]
      ],
      "sourceResponseContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "쓴 답과 까닭을 확인해요.",
        "required": [
          "특정 표본과 모형 재료가 제시되지 않았다. 실제 화석의 단단함·크기·겉모습과 형성 시간을 모든 모형과 같게 일반화하지 않고 비교 대상을 확인한다."
        ],
        "exactStringScoring": false
      },
      "reviewRequired": true
    },
    "printedAnswerContract": {
      "type": "multi-choice",
      "answers": [
        3,
        4
      ],
      "accepted": [
        [
          3,
          4
        ]
      ]
    },
    "printedExplanation": "실제 화석이 화석 모형보다 단단하며, 모두 오목한 화석과 볼록한 화석이 있다. 실제 화석이 화석 모형보다 만들어지는데 오랜 시간이 걸린다.",
    "explanation": "특정 표본과 모형 재료가 제시되지 않았다. 실제 화석의 단단함·크기·겉모습과 형성 시간을 모든 모형과 같게 일반화하지 않고 비교 대상을 확인한다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
      "itemId": "c22-s51-u01-b078",
      "sourceId": "gfield-theory-42-1",
      "set": 1,
      "no": 8
    },
    "evidence": {
      "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
      "date": "2026-11-15",
      "gates": [
        "source",
        "answer",
        "curriculum"
      ],
      "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
      "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    },
    "reviewSummary": "특정 표본과 모형 재료가 제시되지 않았다. 실제 화석의 단단함·크기·겉모습과 형성 시간을 모든 모형과 같게 일반화하지 않고 비교 대상을 확인한다.",
    "legacyAutomaticAnswerHold": true,
    "sourceAmbiguity": true,
    "sourceReviewSources": [
      "https://www.nps.gov/subjects/fossils/what-is-a-fossil.htm",
      "https://www.nps.gov/fobu/planyourvisit/visitorcenterexhibits.htm"
    ]
  },
  {
    "key": "1-9",
    "id": "c22-s51-u01-o1-09",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
      "type": "original",
      "sourceId": "gfield-theory-42-1",
      "set": 1,
      "no": 9,
      "originalNo": 9,
      "page": 27,
      "edition": "4-2-1단계-교사.pdf",
      "course": "교재 지면 표기 초4-1",
      "unit": "지층과 화석",
      "targetUnit": "c22-s51-u01",
      "label": "이론 개념 확인",
      "reviewOnly": true
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과01-03",
      "topic": "화석으로 과거 환경 추리",
      "concept": "화석으로 과거 환경 추리",
      "inquirySkill": "관찰 근거·조건 판단"
    },
    "sourceTaxonomy": {
      "section": "이론 개념 확인",
      "page": 27,
      "originalNo": 9
    },
    "prompt": "다음 사진과 같은 화석이 산에서 발견 되었다. 이를 통해 알 수 있는 점으로 옳은 것은?",
    "choices": [
      "과거 이 지역은 산이었다.",
      "과거 이 지역은 바다였다.",
      "짧은 시간에 만들어진 화석이다.",
      "과거에는 산에서도 조개가 살았다.",
      "크기가 작기 때문에 화석이 만들어져 보존 되었다."
    ],
    "sourceContextBlocks": [],
    "sourceMaterialBlocks": [
      {
        "type": "figure",
        "src": "assets/bank/c22-s51-u01/p27-shell-fossil.png",
        "alt": "교재 원본의 조개 모양 화석 사진"
      }
    ],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ],
      "sourceResponseContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": 1,
        "required": [
          "사진과 산에서 발견되었다는 정보만으로 바다에서 살던 종인지 확정하지 않는다. 생물의 종류·살던 곳·발견 맥락을 추가로 확인하고 과거 바다였다는 답 하나를 강제하지 않는다."
        ],
        "exactStringScoring": false
      },
      "reviewRequired": true
    },
    "printedAnswerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "printedExplanation": "위 화석은 조개 화석이다. 조개 화석이 산에서도 발견되는 이유는 물가나 물속에서 만들어진 화석이 땅이 솟아올라 산이 되면서 깎여 드러났기 때문이다.",
    "explanation": "사진과 산에서 발견되었다는 정보만으로 바다에서 살던 종인지 확정하지 않는다. 생물의 종류·살던 곳·발견 맥락을 추가로 확인하고 과거 바다였다는 답 하나를 강제하지 않는다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
      "itemId": "c22-s51-u01-b083",
      "sourceId": "gfield-theory-42-1",
      "set": 1,
      "no": 9
    },
    "evidence": {
      "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
      "date": "2026-11-15",
      "gates": [
        "source",
        "answer",
        "curriculum"
      ],
      "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
      "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    },
    "reviewSummary": "사진과 산에서 발견되었다는 정보만으로 바다에서 살던 종인지 확정하지 않는다. 생물의 종류·살던 곳·발견 맥락을 추가로 확인하고 과거 바다였다는 답 하나를 강제하지 않는다.",
    "legacyAutomaticAnswerHold": true,
    "sourceAmbiguity": true,
    "sourceReviewSources": [
      "https://www.nps.gov/subjects/fossils/what-is-a-fossil.htm",
      "https://www.nps.gov/fobu/planyourvisit/visitorcenterexhibits.htm"
    ]
  },
  {
    "key": "1-10",
    "id": "c22-s51-u01-o1-10",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
      "type": "original",
      "sourceId": "gfield-theory-42-1",
      "set": 1,
      "no": 10,
      "originalNo": 10,
      "page": 27,
      "edition": "4-2-1단계-교사.pdf",
      "course": "교재 지면 표기 초4-1",
      "unit": "지층과 화석",
      "targetUnit": "c22-s51-u01",
      "label": "이론 개념 확인",
      "reviewOnly": true
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T12",
      "format": "복수선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과01-03",
      "topic": "화석의 가치·보전·설명",
      "concept": "화석의 가치·보전·설명",
      "inquirySkill": "관찰 근거·조건 판단"
    },
    "sourceTaxonomy": {
      "section": "이론 개념 확인",
      "page": 27,
      "originalNo": 10
    },
    "prompt": "다음 중 화석을 통해 알 수 있는 점을 모두 고르시오.",
    "choices": [
      "과거 그 지역의 자연 환경",
      "현재 살고 있는 생물의 모습",
      "과거에 살았던 생물들의 생활 모습",
      "현재 살고 있는 생물들의 생활 모습",
      "과거에 살았던 생물의 먹고 먹히는 관계"
    ],
    "sourceContextBlocks": [],
    "sourceMaterialBlocks": [],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ],
      "accepted": [
        [
          0,
          2
        ]
      ],
      "sourceResponseContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "쓴 답과 까닭을 확인해요.",
        "required": [
          "삼켜진 생물이나 이빨 자국 등이 보존된 특정 화석에서는 먹이 관계를 추리할 수 있다. ⑤를 언제나 알 수 없는 내용으로 배제하지 않고 어떤 증거가 필요한지 확인한다."
        ],
        "exactStringScoring": false
      },
      "reviewRequired": true
    },
    "printedAnswerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ],
      "accepted": [
        [
          0,
          2
        ]
      ]
    },
    "printedExplanation": "화석을 통해 과거에 살았던 생물의 모습이나 생물의 생활 모습, 과거 그 지역의 자연 환경 등을 알 수 있다.",
    "explanation": "삼켜진 생물이나 이빨 자국 등이 보존된 특정 화석에서는 먹이 관계를 추리할 수 있다. ⑤를 언제나 알 수 없는 내용으로 배제하지 않고 어떤 증거가 필요한지 확인한다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
      "itemId": "c22-s51-u01-b089",
      "sourceId": "gfield-theory-42-1",
      "set": 1,
      "no": 10
    },
    "evidence": {
      "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
      "date": "2026-11-15",
      "gates": [
        "source",
        "answer",
        "curriculum"
      ],
      "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
      "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    },
    "reviewSummary": "삼켜진 생물이나 이빨 자국 등이 보존된 특정 화석에서는 먹이 관계를 추리할 수 있다. ⑤를 언제나 알 수 없는 내용으로 배제하지 않고 어떤 증거가 필요한지 확인한다.",
    "legacyAutomaticAnswerHold": true,
    "sourceAmbiguity": true,
    "sourceReviewSources": [
      "https://www.nps.gov/subjects/fossils/what-is-a-fossil.htm",
      "https://www.nps.gov/fobu/planyourvisit/visitorcenterexhibits.htm"
    ]
  },
  {
    "key": "2-1",
    "id": "c22-s51-u01-o2-01",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
      "type": "original",
      "sourceId": "gfield-theory-42-1",
      "set": 2,
      "no": 1,
      "originalNo": 1,
      "page": 28,
      "edition": "4-2-1단계-교사.pdf",
      "course": "교재 지면 표기 초4-1",
      "unit": "지층과 화석",
      "targetUnit": "c22-s51-u01",
      "label": "이론 개념 응용",
      "reviewOnly": false
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T01",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과01-01",
      "topic": "지층의 층·경계·색과 두께",
      "concept": "지층의 층·경계·색과 두께",
      "inquirySkill": "관찰 근거·조건 판단"
    },
    "sourceTaxonomy": {
      "section": "이론 개념 응용",
      "page": 28,
      "originalNo": 1
    },
    "prompt": "다음 사진들을 지층인 것과 지층이 아닌 것으로 분류하고 분류한 기준은 무엇인지 서술하시오.",
    "choices": null,
    "sourceContextBlocks": [],
    "sourceMaterialBlocks": [
      {
        "type": "figure",
        "src": "assets/bank/c22-s51-u01/p28-four-rock-photos.png",
        "alt": "교재 원본 가·나·다·라 네 암석 사진: 지층 분류 자료"
      }
    ],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "지층인 것: 가, 나 / 지층이 아닌 것: 다, 라. 분류 기준: 여러 개의 층으로 이루어져 있는 것은 지층이며, 층을 이루지 않은 것은 지층이 아니다.",
      "rubric": {
        "required": [
          "가·나와 다·라를 사진의 암석 층 관찰에 근거해 구별한다.",
          "단순한 줄무늬나 사진에서 안 보이는 부분으로 내부 전체를 단정하지 않는다."
        ]
      },
      "sourceResponseContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "지층인 것: 가, 나 / 지층이 아닌 것: 다, 라. 분류 기준: 여러 개의 층으로 이루어져 있는 것은 지층이며, 층을 이루지 않은 것은 지층이 아니다.",
        "required": [
          "가·나와 다·라를 사진의 암석 층 관찰에 근거해 구별한다.",
          "단순한 줄무늬나 사진에서 안 보이는 부분으로 내부 전체를 단정하지 않는다."
        ],
        "exactStringScoring": false
      },
      "reviewRequired": true
    },
    "printedAnswerContract": {
      "type": "written-explanation",
      "sample": "지층인 것: 가, 나 / 지층이 아닌 것: 다, 라. 분류 기준: 여러 개의 층으로 이루어져 있는 것은 지층이며, 층을 이루지 않은 것은 지층이 아니다.",
      "rubric": {
        "required": [
          "가·나와 다·라를 사진의 암석 층 관찰에 근거해 구별한다.",
          "단순한 줄무늬나 사진에서 안 보이는 부분으로 내부 전체를 단정하지 않는다."
        ]
      }
    },
    "printedExplanation": "지층이란 암석이 층으로 쌓여 있는 것을 말한다.",
    "explanation": "지층이란 암석이 층으로 쌓여 있는 것을 말한다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
      "itemId": "c22-s51-u01-b004",
      "sourceId": "gfield-theory-42-1",
      "set": 2,
      "no": 1
    },
    "evidence": {
      "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
      "date": "2026-11-15",
      "gates": [
        "source",
        "answer",
        "curriculum"
      ],
      "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
      "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    }
  },
  {
    "key": "2-2",
    "id": "c22-s51-u01-o2-02",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
      "type": "original",
      "sourceId": "gfield-theory-42-1",
      "set": 2,
      "no": 2,
      "originalNo": 5,
      "page": 29,
      "edition": "4-2-1단계-교사.pdf",
      "course": "교재 지면 표기 초4-1",
      "unit": "지층과 화석",
      "targetUnit": "c22-s51-u01",
      "label": "이론 개념 응용",
      "reviewOnly": false
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과01-03",
      "topic": "화석으로 과거 환경 추리",
      "concept": "화석으로 과거 환경 추리",
      "inquirySkill": "여러 근거 비교"
    },
    "sourceTaxonomy": {
      "section": "이론 개념 응용",
      "page": 29,
      "originalNo": 5
    },
    "prompt": "다음은 과거에 살았던 물고기와 고사리의 흔적이 암석에 남아있는 화석의 모습이다. 우리는 이와 같은 화석을 통해 다양한 정보를 얻을 수 있는데 화석을 통해 알 수 있는 정보를 세 가지 이상 서술하시오.",
    "choices": null,
    "sourceContextBlocks": [],
    "sourceMaterialBlocks": [
      {
        "type": "figure",
        "src": "assets/bank/c22-s51-u01/p29-fish-fern-fossils.png",
        "alt": "교재 원본의 물고기 화석과 고사리 화석 사진"
      }
    ],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "과거에 살았던 생물의 종류 / 과거에 살았던 생물의 모습 / 과거에 살았던 생물들의 생활 모습 / 과거 그 지역의 자연 환경(화석이 발견된 지역) 등",
      "rubric": {
        "required": [
          "보이는 생물 특징과 관련 조사 자료를 근거로 타당한 정보를 제시한다.",
          "사진만으로 정확한 기온·생물수나 바다 환경을 확정하지 않는다."
        ]
      },
      "sourceResponseContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "과거에 살았던 생물의 종류 / 과거에 살았던 생물의 모습 / 과거에 살았던 생물들의 생활 모습 / 과거 그 지역의 자연 환경(화석이 발견된 지역) 등",
        "required": [
          "보이는 생물 특징과 관련 조사 자료를 근거로 타당한 정보를 제시한다.",
          "사진만으로 정확한 기온·생물수나 바다 환경을 확정하지 않는다."
        ],
        "exactStringScoring": false
      },
      "reviewRequired": true
    },
    "printedAnswerContract": {
      "type": "written-explanation",
      "sample": "과거에 살았던 생물의 종류 / 과거에 살았던 생물의 모습 / 과거에 살았던 생물들의 생활 모습 / 과거 그 지역의 자연 환경(화석이 발견된 지역) 등",
      "rubric": {
        "required": [
          "보이는 생물 특징과 관련 조사 자료를 근거로 타당한 정보를 제시한다.",
          "사진만으로 정확한 기온·생물수나 바다 환경을 확정하지 않는다."
        ]
      }
    },
    "printedExplanation": "과거에 살았던 생물의 종류, 모습, 생활 모습과 과거 그 지역의 자연 환경 등을 알 수 있다.",
    "explanation": "과거에 살았던 생물의 종류, 모습, 생활 모습과 과거 그 지역의 자연 환경 등을 알 수 있다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
      "itemId": "c22-s51-u01-b086",
      "sourceId": "gfield-theory-42-1",
      "set": 2,
      "no": 5
    },
    "evidence": {
      "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
      "date": "2026-11-15",
      "gates": [
        "source",
        "answer",
        "curriculum"
      ],
      "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
      "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    }
  },
  {
    "key": "2-3",
    "id": "c22-s51-u01-o2-03",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
      "type": "original",
      "sourceId": "gfield-theory-42-1",
      "set": 2,
      "no": 3,
      "originalNo": 7,
      "page": 29,
      "edition": "4-2-1단계-교사.pdf",
      "course": "교재 지면 표기 초4-1",
      "unit": "지층과 화석",
      "targetUnit": "c22-s51-u01",
      "label": "이론 개념 응용",
      "reviewOnly": true
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T10",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과01-03",
      "topic": "화석 생성 모형과 실제",
      "concept": "화석 생성 모형과 실제",
      "inquirySkill": "관찰 근거·조건 판단"
    },
    "sourceTaxonomy": {
      "section": "이론 개념 응용",
      "page": 29,
      "originalNo": 7
    },
    "prompt": "퇴적암의 특징 중 하나는 화석이 발견되는 것이다. 역암과 이암 중 화석이 발견될 확률이 더 높은 암석은 무엇인지 고르고, 그렇게 생각한 이유를 서술하시오.",
    "choices": null,
    "sourceContextBlocks": [],
    "sourceMaterialBlocks": [
      {
        "type": "figure",
        "src": "assets/bank/c22-s51-u01/p29-conglomerate-mudstone.png",
        "alt": "교재에 역암과 이암으로 제시된 두 표본 사진"
      }
    ],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "이암. 역암은 주로 자갈로 이루어져 있으며, 이암은 주로 진흙으로 이루어져 있다. 진흙은 자갈에 비해 알갱이의 크기가 작고 부드러워 화석이 될 생물체가 매몰되었을 경우 생물체의 손상이 덜하다. 또, 흔적이 찍히는 경우에도 입자가 곱기 때문에 전체적인 형태가 남기 쉽다.",
      "rubric": {
        "required": [
          "고운 퇴적물에 흔적이 남을 수 있는 까닭을 비교한다.",
          "입자 크기만으로 실제 발견 확률이나 보존 여부가 언제나 정해진다고 하지 않는다."
        ]
      },
      "sourceResponseContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "이암. 역암은 주로 자갈로 이루어져 있으며, 이암은 주로 진흙으로 이루어져 있다. 진흙은 자갈에 비해 알갱이의 크기가 작고 부드러워 화석이 될 생물체가 매몰되었을 경우 생물체의 손상이 덜하다. 또, 흔적이 찍히는 경우에도 입자가 곱기 때문에 전체적인 형태가 남기 쉽다.",
        "required": [
          "고운 퇴적물에 흔적이 남을 수 있는 까닭을 비교한다.",
          "입자 크기만으로 실제 발견 확률이나 보존 여부가 언제나 정해진다고 하지 않는다."
        ],
        "exactStringScoring": false
      },
      "reviewRequired": true
    },
    "printedAnswerContract": {
      "type": "written-explanation",
      "sample": "이암. 역암은 주로 자갈로 이루어져 있으며, 이암은 주로 진흙으로 이루어져 있다. 진흙은 자갈에 비해 알갱이의 크기가 작고 부드러워 화석이 될 생물체가 매몰되었을 경우 생물체의 손상이 덜하다. 또, 흔적이 찍히는 경우에도 입자가 곱기 때문에 전체적인 형태가 남기 쉽다.",
      "rubric": {
        "required": [
          "고운 퇴적물에 흔적이 남을 수 있는 까닭을 비교한다.",
          "입자 크기만으로 실제 발견 확률이나 보존 여부가 언제나 정해진다고 하지 않는다."
        ]
      }
    },
    "printedExplanation": "진흙은 자갈에 비해 알갱이가 작고 부드러워 생물체가 묻힐 때 손상이 덜하고 흔적이 남기 쉽다.",
    "explanation": "비교한 암석 이름만으로 실제 발견 확률을 정할 수 없다. 고운 퇴적물에 흔적이 남기 쉬운 조건을 설명하되 생물·매몰·보존·노출 조건도 함께 확인한다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
      "itemId": "c22-s51-u01-b075",
      "sourceId": "gfield-theory-42-1",
      "set": 2,
      "no": 7
    },
    "evidence": {
      "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
      "date": "2026-11-15",
      "gates": [
        "source",
        "answer",
        "curriculum"
      ],
      "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
      "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    },
    "reviewSummary": "비교한 암석 이름만으로 실제 발견 확률을 정할 수 없다. 고운 퇴적물에 흔적이 남기 쉬운 조건을 설명하되 생물·매몰·보존·노출 조건도 함께 확인한다.",
    "legacyAutomaticAnswerHold": true,
    "sourceAmbiguity": true,
    "sourceReviewSources": []
  },
  {
    "key": "2-4",
    "id": "c22-s51-u01-o2-04",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
      "type": "original",
      "sourceId": "gfield-theory-42-1",
      "set": 2,
      "no": 4,
      "originalNo": 8,
      "page": 29,
      "edition": "4-2-1단계-교사.pdf",
      "course": "교재 지면 표기 초4-1",
      "unit": "지층과 화석",
      "targetUnit": "c22-s51-u01",
      "label": "이론 개념 응용",
      "reviewOnly": false
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과01-03",
      "topic": "화석 생성 모형과 실제",
      "concept": "화석 생성 모형과 실제",
      "inquirySkill": "근거 설명·모형·수행 구별"
    },
    "sourceTaxonomy": {
      "section": "이론 개념 응용",
      "page": 29,
      "originalNo": 8
    },
    "prompt": "다음 그림은 생물이 화석이 되는 과정을 순서 없이 나열한 것이다. 화석이 만들어져 발견되는 과정을 순서에 맞게 나열하시오.",
    "choices": null,
    "sourceContextBlocks": [],
    "sourceMaterialBlocks": [
      {
        "type": "figure",
        "src": "assets/bank/c22-s51-u01/p29-fossil-sequence.png",
        "alt": "교재 원본 가·나·다·라·마·바 여섯 장면: 생물, 퇴적, 지층의 융기와 깎임"
      }
    ],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "마 - 다 - 나 - 라 - 바 - 가",
      "accepted": [
        "마 - 다 - 나 - 라 - 바 - 가"
      ],
      "sourceResponseContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "마 - 다 - 나 - 라 - 바 - 가",
        "required": [
          "제시된 여섯 그림의 순서를 확인한다. 이 사례를 모든 화석의 필수 생성 과정으로 일반화하지 않는다."
        ],
        "exactStringScoring": false
      },
      "reviewRequired": true
    },
    "printedAnswerContract": {
      "type": "short-text",
      "answer": "마 - 다 - 나 - 라 - 바 - 가",
      "accepted": [
        "마 - 다 - 나 - 라 - 바 - 가"
      ]
    },
    "printedExplanation": "마: 물속에 조개나 물고기와 같은 생물이 살고 있다. 다: 생물이 죽고, 그 위에 퇴적물이 계속 쌓인다. 나: 물속에서 퇴적물이 계속 쌓여 지층이 만들어진다. 라: 지층이 물 위로 올라간다. 바: 지층이 깎이기 시작한다. 가: 지층이 더 많이 깎여 화석이 드러난다.",
    "explanation": "마: 물속에 조개나 물고기와 같은 생물이 살고 있다. 다: 생물이 죽고, 그 위에 퇴적물이 계속 쌓인다. 나: 물속에서 퇴적물이 계속 쌓여 지층이 만들어진다. 라: 지층이 물 위로 올라간다. 바: 지층이 깎이기 시작한다. 가: 지층이 더 많이 깎여 화석이 드러난다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
      "itemId": "c22-s51-u01-b080",
      "sourceId": "gfield-theory-42-1",
      "set": 2,
      "no": 8
    },
    "evidence": {
      "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
      "date": "2026-11-15",
      "gates": [
        "source",
        "answer",
        "curriculum"
      ],
      "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
      "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    }
  },
  {
    "key": "3-1",
    "id": "c22-s51-u01-o3-01",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
      "type": "original",
      "sourceId": "gfield-theory-42-1",
      "set": 3,
      "no": 1,
      "originalNo": "1(1)",
      "page": 30,
      "edition": "4-2-1단계-교사.pdf",
      "course": "교재 지면 표기 초4-1",
      "unit": "지층과 화석",
      "targetUnit": "c22-s51-u01",
      "label": "이론 자료 읽기",
      "reviewOnly": true
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과01-03",
      "topic": "화석으로 과거 환경 추리",
      "concept": "화석으로 과거 환경 추리",
      "inquirySkill": "관찰 근거·조건 판단"
    },
    "sourceTaxonomy": {
      "section": "이론 자료 읽기",
      "page": 30,
      "originalNo": "1(1)"
    },
    "prompt": "재범이가 두 지역이 과거에 바다였을 것이라고 생각한 이유는 무엇인지 서술하시오.",
    "choices": null,
    "sourceContextBlocks": [
      {
        "type": "text",
        "text": "재범이네 반 친구들은 멀리 떨어지지 않은 두 지층 (가)와 (나)를 관찰하였다. 다음은 재범이네 반 친구들이 두 지층에 대해 이야기한 것이다. 물음에 답하시오.(단, 지각 변동은 없었다고 가정한다.)"
      },
      {
        "type": "figure",
        "src": "assets/bank/c22-s51-u01/p30-two-strata.png",
        "alt": "교재 원본 두 지층 단면과 A·B·C·D 및 물고기뼈·조개 모양 기호"
      },
      {
        "type": "list",
        "items": [
          "재범 : (가)와 (나) 두 지역은 과거에 바다였을 거야.",
          "선영 : B와 C는 서로 같은 시기에 생성된 것 같아.",
          "나영 : A는 B보다 먼저 생성된 것 같아.",
          "지연 : D는 A보다 나중에 생성되었을 거야."
        ]
      }
    ],
    "sourceMaterialBlocks": [],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "(가)와 (나) 지층에 물고기뼈와 조개 화석이 발견되었기 때문이다.",
      "rubric": {
        "required": [
          "재범이 제시한 증거가 물고기뼈·조개 화석임을 읽어 낸다.",
          "물고기와 조개에 민물 종도 있음을 고려해 바다였다는 결론의 추가 근거를 요구한 답도 인정한다."
        ]
      },
      "sourceResponseContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "(가)와 (나) 지층에 물고기뼈와 조개 화석이 발견되었기 때문이다.",
        "required": [
          "재범이 제시한 증거가 물고기뼈·조개 화석임을 읽어 낸다.",
          "물고기와 조개에 민물 종도 있음을 고려해 바다였다는 결론의 추가 근거를 요구한 답도 인정한다."
        ],
        "exactStringScoring": false
      },
      "reviewRequired": true
    },
    "printedAnswerContract": {
      "type": "written-explanation",
      "sample": "(가)와 (나) 지층에 물고기뼈와 조개 화석이 발견되었기 때문이다.",
      "rubric": {
        "required": [
          "재범이 제시한 증거가 물고기뼈·조개 화석임을 읽어 낸다.",
          "물고기와 조개에 민물 종도 있음을 고려해 바다였다는 결론의 추가 근거를 요구한 답도 인정한다."
        ]
      }
    },
    "printedExplanation": "현재 물고기와 조개 등은 바다(또는 바닷가)에 살고 있는 생물이므로 과거에도 바다에서 살았을 것이라고 추측할 수 있다. 때문에 이러한 화석이 발견되는 것은 두 지역이 과거에 바다였다는 것을 알 수 있다.",
    "explanation": "인쇄 해설은 물고기와 조개를 모두 바다 생물로 일반화한다. 재범이 든 근거를 읽는 것과 그 근거가 바다를 확정하는 충분한 증거인지 판단하는 것을 구별한다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
      "itemId": "c22-s51-u01-b084",
      "sourceId": "gfield-theory-42-1",
      "set": 3,
      "no": "1(1)"
    },
    "evidence": {
      "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
      "date": "2026-11-15",
      "gates": [
        "source",
        "answer",
        "curriculum"
      ],
      "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
      "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    },
    "reviewSummary": "인쇄 해설은 물고기와 조개를 모두 바다 생물로 일반화한다. 재범이 든 근거를 읽는 것과 그 근거가 바다를 확정하는 충분한 증거인지 판단하는 것을 구별한다.",
    "legacyAutomaticAnswerHold": true,
    "sourceAmbiguity": true,
    "sourceReviewSources": [
      "https://www.nps.gov/subjects/fossils/what-is-a-fossil.htm",
      "https://www.nps.gov/fobu/planyourvisit/visitorcenterexhibits.htm"
    ]
  },
  {
    "key": "4-1",
    "id": "c22-s51-u01-o4-01",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
      "type": "original",
      "sourceId": "gfield-theory-42-1",
      "set": 4,
      "no": 1,
      "originalNo": "4(1)",
      "page": 33,
      "edition": "4-2-1단계-교사.pdf",
      "course": "교재 지면 표기 초4-1",
      "unit": "지층과 화석",
      "targetUnit": "c22-s51-u01",
      "label": "이론 굳어짐 그림 해석",
      "reviewOnly": false
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T05",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과01-02",
      "topic": "퇴적물과 퇴적암의 관계",
      "concept": "퇴적물과 퇴적암의 관계",
      "inquirySkill": "여러 근거 비교"
    },
    "sourceTaxonomy": {
      "section": "이론 굳어짐 그림 해석",
      "page": 33,
      "originalNo": "4(1)"
    },
    "prompt": "위 그림 (가)는 퇴적물이 퇴적암으로 굳어지는 과정 중 어느 과정을 나타낸 것인지 서술하시오.",
    "choices": null,
    "sourceContextBlocks": [
      {
        "type": "text",
        "text": "다음은 퇴적물이 퇴적암으로 굳어지는 과정을 그림으로 나타낸 것이다. 물음에 답하시오."
      },
      {
        "type": "figure",
        "src": "assets/bank/c22-s51-u01/p33-compaction-cementation.png",
        "alt": "교재 원본 퇴적물이 굳어지는 과정 (가)와 (나) 그림"
      }
    ],
    "sourceMaterialBlocks": [],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "퇴적물이 계속 쌓이면 위에 쌓인 퇴적물의 무게에 의하여 압축되는 과정을 나타낸 것이다.",
      "rubric": {
        "required": [
          "위에 쌓인 퇴적물의 무게로 아래 퇴적물이 눌리고 빈틈이 줄어드는 모습을 설명한다.",
          "압축 작용이라는 전문 용어를 필수로 요구하지 않는다."
        ]
      },
      "sourceResponseContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "퇴적물이 계속 쌓이면 위에 쌓인 퇴적물의 무게에 의하여 압축되는 과정을 나타낸 것이다.",
        "required": [
          "위에 쌓인 퇴적물의 무게로 아래 퇴적물이 눌리고 빈틈이 줄어드는 모습을 설명한다.",
          "압축 작용이라는 전문 용어를 필수로 요구하지 않는다."
        ],
        "exactStringScoring": false
      },
      "reviewRequired": true
    },
    "printedAnswerContract": {
      "type": "written-explanation",
      "sample": "퇴적물이 계속 쌓이면 위에 쌓인 퇴적물의 무게에 의하여 압축되는 과정을 나타낸 것이다.",
      "rubric": {
        "required": [
          "위에 쌓인 퇴적물의 무게로 아래 퇴적물이 눌리고 빈틈이 줄어드는 모습을 설명한다.",
          "압축 작용이라는 전문 용어를 필수로 요구하지 않는다."
        ]
      }
    },
    "printedExplanation": "퇴적물은 압축 작용과 교결 작용에 의하여 퇴적암이 된다. 그림 (가)는 압축 작용을 나타낸 것으로 압축 작용이란 퇴적물 사이의 빈틈이 줄어드는 현상이다. 위에 쌓인 퇴적물의 무게에 의해 퇴적물이 다져지고 압축되면서 빈틈에 다른 작은 퇴적물 입자가 채워진다.",
    "explanation": "퇴적물은 압축 작용과 교결 작용에 의하여 퇴적암이 된다. 그림 (가)는 압축 작용을 나타낸 것으로 압축 작용이란 퇴적물 사이의 빈틈이 줄어드는 현상이다. 위에 쌓인 퇴적물의 무게에 의해 퇴적물이 다져지고 압축되면서 빈틈에 다른 작은 퇴적물 입자가 채워진다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
      "itemId": "c22-s51-u01-b038",
      "sourceId": "gfield-theory-42-1",
      "set": 4,
      "no": "4(1)"
    },
    "evidence": {
      "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
      "date": "2026-11-15",
      "gates": [
        "source",
        "answer",
        "curriculum"
      ],
      "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
      "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    }
  },
  {
    "key": "4-2",
    "id": "c22-s51-u01-o4-02",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
      "type": "original",
      "sourceId": "gfield-theory-42-1",
      "set": 4,
      "no": 2,
      "originalNo": "4(2)",
      "page": 33,
      "edition": "4-2-1단계-교사.pdf",
      "course": "교재 지면 표기 초4-1",
      "unit": "지층과 화석",
      "targetUnit": "c22-s51-u01",
      "label": "이론 굳어짐 그림 해석",
      "reviewOnly": false
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T05",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과01-02",
      "topic": "퇴적물과 퇴적암의 관계",
      "concept": "퇴적물과 퇴적암의 관계",
      "inquirySkill": "관찰 근거·조건 판단"
    },
    "sourceTaxonomy": {
      "section": "이론 굳어짐 그림 해석",
      "page": 33,
      "originalNo": "4(2)"
    },
    "prompt": "위 그림 (나)는 퇴적물이 퇴적암으로 굳어지는 과정 중 어느 과정을 나타낸 것인지 서술하시오.",
    "choices": null,
    "sourceContextBlocks": [
      {
        "type": "text",
        "text": "다음은 퇴적물이 퇴적암으로 굳어지는 과정을 그림으로 나타낸 것이다. 물음에 답하시오."
      },
      {
        "type": "figure",
        "src": "assets/bank/c22-s51-u01/p33-compaction-cementation.png",
        "alt": "교재 원본 퇴적물이 굳어지는 과정 (가)와 (나) 그림"
      }
    ],
    "sourceMaterialBlocks": [],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "압축된 퇴적물이 물속에 녹아 있는 물질에 의해 접착되어 굳어지는 작용을 나타낸 것이다.",
      "rubric": {
        "required": [
          "퇴적물 알갱이들이 다른 물질에 의해 붙어 굳어지는 과정을 설명한다.",
          "교결 작용이나 교결 광물의 이름을 필수로 요구하지 않는다."
        ]
      },
      "sourceResponseContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "압축된 퇴적물이 물속에 녹아 있는 물질에 의해 접착되어 굳어지는 작용을 나타낸 것이다.",
        "required": [
          "퇴적물 알갱이들이 다른 물질에 의해 붙어 굳어지는 과정을 설명한다.",
          "교결 작용이나 교결 광물의 이름을 필수로 요구하지 않는다."
        ],
        "exactStringScoring": false
      },
      "reviewRequired": true
    },
    "printedAnswerContract": {
      "type": "written-explanation",
      "sample": "압축된 퇴적물이 물속에 녹아 있는 물질에 의해 접착되어 굳어지는 작용을 나타낸 것이다.",
      "rubric": {
        "required": [
          "퇴적물 알갱이들이 다른 물질에 의해 붙어 굳어지는 과정을 설명한다.",
          "교결 작용이나 교결 광물의 이름을 필수로 요구하지 않는다."
        ]
      }
    },
    "printedExplanation": "퇴적물은 압축 작용과 교결 작용에 의하여 퇴적암이 된다. 그림 (나)는 교결 작용을 나타낸 것으로 교결 작용이란 물에 녹아 있던 여러 가지 침전물이 퇴적물의 빈틈에 들어가 퇴적물 입자들을 단단하게 굳히는 현상을 말한다.",
    "explanation": "퇴적물은 압축 작용과 교결 작용에 의하여 퇴적암이 된다. 그림 (나)는 교결 작용을 나타낸 것으로 교결 작용이란 물에 녹아 있던 여러 가지 침전물이 퇴적물의 빈틈에 들어가 퇴적물 입자들을 단단하게 굳히는 현상을 말한다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
      "itemId": "c22-s51-u01-b034",
      "sourceId": "gfield-theory-42-1",
      "set": 4,
      "no": "4(2)"
    },
    "evidence": {
      "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
      "date": "2026-11-15",
      "gates": [
        "source",
        "answer",
        "curriculum"
      ],
      "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
      "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    }
  }
];
