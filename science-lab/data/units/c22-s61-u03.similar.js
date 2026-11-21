export const similar = [
  {
    "id": "c22-s61-u03-v001",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 1,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-01",
      "topic": "식물 세포 관찰 자료",
      "concept": "식물 세포 관찰 자료",
      "inquirySkill": "현미경 관찰 그림·기록과 구조 기호 해석"
    },
    "prompt": "양파 표피 관찰 기록에 가장 잘 맞는 기호를 쓰세요. 세포막만 있는 동물 세포 기록과 구별해요.",
    "givens": {
      "관찰 기록": {
        "머리": [
          "관찰 기록"
        ],
        "행": [
          [
            "ㄱ: 세포벽 경계 없이 둥근 세포가 떨어져 있음"
          ],
          [
            "ㄴ: 벽돌처럼 이어진 경계 안쪽에 작은 핵이 보임"
          ],
          [
            "ㄷ: 세포 경계 없이 큰 검은 먼지만 보임"
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "ㄴ"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "ㄴ은 서로 이어진 세포벽 경계와 그 안의 핵을 기록했어요. 핵만 있거나 원 모양이라는 사실만으로 양파 표피라고 판단하지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-1",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v002",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 2,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-01",
      "topic": "세포 개념과 구조 용어",
      "concept": "세포 개념과 구조 용어",
      "inquirySkill": "비교·개념 구별"
    },
    "prompt": "두 표본의 관찰과 세포 구조를 함께 설명한 내용으로 옳은 것을 두 개 고르세요.",
    "givens": {
      "학습 범위": "옛 자료의 확장 참고입니다. 현재 식물 세포 관찰의 필수 용어 범위와 구별해요.",
      "표본": {
        "머리": [
          "표본"
        ],
        "행": [
          [
            "양파 표피: 세포벽·세포막·핵 있음"
          ],
          [
            "볼 안쪽: 세포막·핵 있음, 세포벽 없음"
          ]
        ]
      }
    },
    "choices": [
      "두 세포 모두 세포벽이 있다.",
      "두 세포의 핵은 유전 정보와 관련된다.",
      "동물 세포의 세포막은 핵으로 바뀐다.",
      "식물 세포에는 세포막이 없다.",
      "이 동물 세포에는 세포벽이 없다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "multi-choice",
        "answers": [
          1,
          4
        ],
        "orderSensitive": false,
        "duplicatesAccepted": false
      },
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-reference-extension",
    "explanation": "두 세포의 핵은 유전 정보와 관련되며, 세포벽은 이 동물 세포에 없으므로②와⑤가 맞아요. 동물 세포의 세포막이 핵으로 바뀌는 것은 아니고 식물 세포에도 세포막이 있어요. 두 카드의 공통 구조와 차이를 각각 확인해요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-2",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v003",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 3,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "뿌리 물 흡수 비교 실험",
      "concept": "뿌리 물 흡수 비교 실험",
      "inquirySkill": "비교 조건·관찰 결과·결론"
    },
    "prompt": "다음 비교 기록을 해석한 내용으로 옳은 것을 두 개 고르세요.",
    "givens": {
      "자료표": {
        "머리": [
          "기호",
          "뿌리 상태",
          "처음 물(mL)",
          "3일 뒤 물(mL)"
        ],
        "행": [
          [
            "ㄱ",
            "뿌리 있음",
            80,
            55
          ],
          [
            "ㄴ",
            "뿌리 제거",
            80,
            77
          ]
        ]
      },
      "조건": "크기가 비슷한 양파, 같은 비커·빛·시간. 수면을 덮고 양파 밑부분 상태를 맞춤. 절단은 교사가 준비함. 수치는 연습 자료임."
    },
    "choices": [
      "뿌리 유무가 다르게 한 조건이다.",
      "ㄴ에서 물이25mL 줄어들었다.",
      "두 비커의 처음 물 양이 달랐다.",
      "뿌리가 물을 흡수한다는 근거가 된다.",
      "잎 수에 따른 차이를 비교한 실험이다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "multi-choice",
        "answers": [
          0,
          3
        ],
        "orderSensitive": false,
        "duplicatesAccepted": false
      },
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "같은 환경에서 뿌리 유무를 달리했고 물은 각각25mL와3mL 줄었어요. 이 자료는 뿌리가 물을 흡수하는 기능을 뒷받침하며 잎 수나 장소 차이를 실험 변인으로 삼지 않았어요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-3",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v004",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 4,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "줄기 색소 물 이동",
      "concept": "줄기 색소 물 이동",
      "inquirySkill": "단면/실험 자료에서 이동 경로 추론"
    },
    "prompt": "같은 종류의 백합 두 줄기를 맑은 물과 붉은 색소 물에 각각 넣었습니다. 줄기를 통한 물의 이동을 뒷받침하는 관찰을 말한 사람의 이름을 쓰세요.",
    "givens": {
      "말": {
        "머리": [
          "말"
        ],
        "행": [
          [
            "유진: 맑은 물의 꽃에도 향기가 났어."
          ],
          [
            "하린: 색소 물 쪽에서만 줄기 위쪽 잎맥이 붉어졌어."
          ],
          [
            "준서: 두 줄기의 바깥 굵기는 비슷했어."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "하린"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "하린",
      "accepted": [
        "하린"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "하린은 맑은 물과 비교하여 색소 물을 넣은 줄기 위쪽에 색이 나타난 차이를 근거로 삼았어요. 꽃냄새나 줄기의 바깥 굵기만으로 물의 이동을 알 수 없어요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-4",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v005",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 5,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "광합성 산물 확인 실험",
      "concept": "광합성 산물 확인 실험",
      "inquirySkill": "변인·아이오딘 반응·근거 해석"
    },
    "prompt": "다르게 한 조건과, 녹말 확인 결과에서 알 수 있는 것을 각각 쓰세요. 이 결과를 모든 잎의 양분 생성에 대한 말로 넓히지 마세요.",
    "givens": {
      "조건": "같은 종류·비슷한 크기의 모종. 교사가 시작 전 두 시료의 녹말 불검출을 확인. 빛 외의 물·온도·시간을 같게 함. 가열·알코올·용액 처리는 교사가 함.",
      "제공 결과": {
        "머리": [
          "제공 결과"
        ],
        "행": [
          [
            "빛 있음: 처리한 잎이 청람색"
          ],
          [
            "빛 없음: 처리한 잎이 청람색으로 변하지 않음"
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "plantContract": {
        "teacherRequired": true,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "written-explanation",
        "required": [
          "빛을 받은 유무를 다르게 함",
          "시작 전 불검출과 처리 뒤 두 반응을 연결",
          "이 조건에서의 녹말 생성으로 결론 범위를 한정"
        ],
        "exactStringScoring": false
      },
      "type": "written-explanation",
      "sample": "빛의 유무를 달리했다. 시작 전에 녹말이 검출되지 않았고 빛을 받은 잎에서만 검출되었으므로, 이 조건에서 빛을 받아 잎에 녹말이 생긴 것으로 해석한다.",
      "rubric": {
        "required": [
          "빛을 받은 유무를 다르게 함",
          "시작 전 불검출과 처리 뒤 두 반응을 연결",
          "이 조건에서의 녹말 생성으로 결론 범위를 한정"
        ],
        "pass": "서술 근거를 교사가 확인 · 동등 표현과 타당한 조건 설명 인정"
      }
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "먼저 두 잎의 녹말 불검출 상태를 확인해 이전 녹말의 영향을 줄였어요. 다른 조건을 맞춘 뒤 빛 유무에 따라 반응이 달라졌으므로 이 비교의 조건 안에서 결론을 써요. 실제 학생 관찰값이 아닌 제공 결과를 읽은 것이에요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-5",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v006",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 6,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "잎 유무 비교 실험",
      "concept": "잎 유무 비교 실험",
      "inquirySkill": "같은 조건·다른 조건·증거/결론"
    },
    "prompt": "잎 유무가 봉지 안의 물방울에 영향을 주는지 비교하려고 합니다. 고쳐야 할 과정의 기호를 쓰세요.",
    "givens": {
      "과정": {
        "머리": [
          "과정"
        ],
        "행": [
          [
            "ㄱ: 같은 종류·비슷한 크기의 모종에 잎 유무를 달리한다."
          ],
          [
            "ㄴ: 잎 있는 쪽의 봉지만 물로 헹궈 말리지 않은 채 씌운다."
          ],
          [
            "ㄷ: 두 용기의 입구를 막고 같은 크기 봉지를 씌워 같은 빛·온도·시간에 둔다."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "ㄴ"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "ㄴ에서는 잎 있는 쪽의 봉지에만 처음부터 물이 남아 있어요. 뒤에 보인 물방울이 잎에서 나온 것인지 봉지에 원래 있던 것인지 구별하기 어려워요. 두 쪽 모두 마른 봉지를 써서 처음 봉지 상태도 같게 해야 해요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-6",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v007",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 7,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "꽃의 구조와 꽃가루받이",
      "concept": "꽃의 구조와 꽃가루받이",
      "inquirySkill": "기호·생김새·역할/영향 추론"
    },
    "prompt": "그림의 꽃에서 꽃봉오리일 때 바깥에서 안쪽을 감싸 보호하는 부분의 기호를 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "ㄹ"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "ㄹ",
      "accepted": [
        "ㄹ"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "원그림의 ㄹ은 꽃받침이에요. 꽃받침은 꽃봉오리의 안쪽 부분을 보호하며 꽃가루를 만드는 수술이나 받는 암술과 구별해요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-7",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "figure": "assets/bank/c22-s61-u03/s1-q07.webp",
    "figureNote": "사과꽃의 구조와 기호."
  },
  {
    "id": "c22-s61-u03-v008",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 8,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "꽃의 구조와 꽃가루받이",
      "concept": "꽃의 구조와 꽃가루받이",
      "inquirySkill": "기호·생김새·역할/영향 추론"
    },
    "prompt": "벌이 꽃의 꿀을 먹는 동안 몸의 꽃가루가 다른 꽃의 암술로 옮겨졌습니다. 이 관찰에서 꿀의 역할과 연결되는 내용을 고르세요.",
    "givens": null,
    "choices": [
      "꿀이 씨앗으로 바로 변한다.",
      "꿀이 암술을 수술로 바꾼다.",
      "꽃가루를 옮기는 동물을 유인한다.",
      "꿀이 열매껍질을 터뜨린다.",
      "꿀이 흙속에서 물을 흡수한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 2
      },
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "벌이 꿀을 찾아와 꽃가루를 옮겼으므로 꿀은 꽃가루받이를 돕는 동물을 유인하는 데 관련돼요. 꿀이 씨로 변하거나 꽃가루를 직접 만든다는 뜻은 아니에요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-8",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v009",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 9,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "열매와 씨 퍼뜨림",
      "concept": "열매와 씨 퍼뜨림",
      "inquirySkill": "특징·보호·확산 방법 연결"
    },
    "prompt": "산책 뒤 옷에 붙은 도꼬마리 열매를 관찰했습니다. 관찰 특징과 씨가 퍼지는 방법을 바르게 연결한 것을 고르세요.",
    "givens": {
      "관찰": "작은 갈고리가 천의 올에 걸려 쉽게 떨어지지 않았다."
    },
    "choices": [
      "갈고리 — 옷이나 털에 붙어 이동",
      "갈고리 — 물속으로만 가라앉아 이동",
      "갈고리 — 날개처럼 회전하여 이동",
      "갈고리 — 솜털로 공중에 떠서 이동",
      "갈고리 — 껍질이 터져 씨를 튕겨 이동"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 0
      },
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "관찰한 갈고리는 옷이나 동물 털에 붙어 이동하는 데 도움이 돼요. 관찰하지 않은 날개나 솜털을 이유로 다른 방법을 고르지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-9",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v010",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 10,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "기관 연결과 생활 적용",
      "concept": "기관 연결과 생활 적용",
      "inquirySkill": "기관의 역할·조건·주장 범위"
    },
    "prompt": "식물 기관의 역할극에서 앞사람의 대사를 이어 말한 내용으로 알맞은 것을 고르세요.",
    "givens": {
      "앞 대사": "뿌리: 나는 흙속에서 물을 흡수했어."
    },
    "choices": [
      "열매: 그 물로 꽃가루를 만들게.",
      "꽃: 그 물을 모두 흙으로 버릴게.",
      "잎: 나는 물을 절대로 쓰지 않아.",
      "줄기: 내 통로를 따라 잎으로 옮길게.",
      "씨: 내 뿌리털로 그 물을 받았어."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 3
      },
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "뿌리가 흡수한 물을 다른 기관으로 옮기는 줄기의 역할이 앞 대사와 이어져요. 잎이 물을 뿌리에 돌려보내기만 하거나 열매가 꽃가루를 만든다고 바꾸면 연결이 어긋나요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-10",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v011",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 1,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-01",
      "topic": "세포 개념과 구조 용어",
      "concept": "세포 개념과 구조 용어",
      "inquirySkill": "비교·개념 구별"
    },
    "prompt": "현미경으로 여러 식물의 세포를 관찰했습니다. 기록을 바탕으로 세운 설명 중 고쳐야 할 것을 고르세요.",
    "givens": {
      "기록": {
        "머리": [
          "기록"
        ],
        "행": [
          [
            "양파 표피에서는 길쭉하게 이어진 작은 칸들이 보였다."
          ],
          [
            "다른 식물의 표피에서는 크기와 모양이 다른 칸들이 보였다."
          ]
        ]
      }
    },
    "choices": [
      "기관 안에 여러 세포가 있다.",
      "모든 세포의 모양은 반드시 같다.",
      "세포를 보려고 현미경을 쓸 수 있다.",
      "세포마다 크기가 다를 수 있다.",
      "세포는 생물을 이루는 기본 단위다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 1
      },
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "두 기록은 세포의 모양과 크기가 다양함을 보여요. 그러므로 모든 세포의 모양이 반드시 같다는 설명을 고쳐야 해요. 관찰한 일부 표본만으로 모든 세포를 직접 보았다고 할 수도 없어요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-1",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v012",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 2,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-01",
      "topic": "세포 개념과 구조 용어",
      "concept": "세포 개념과 구조 용어",
      "inquirySkill": "비교·개념 구별"
    },
    "prompt": "두 세포의 구조 카드를 비교했을 때 공통 구조로 묶을 수 있는 것을 고르세요.",
    "givens": {
      "학습 범위": "옛 자료의 확장 참고입니다. 현재 식물 세포 관찰의 필수 용어 범위와 구별해요.",
      "양파 표피 세포": {
        "머리": [
          "양파 표피 세포"
        ],
        "행": [
          [
            "핵"
          ],
          [
            "세포막"
          ],
          [
            "세포벽"
          ]
        ]
      },
      "볼 안쪽 세포": {
        "머리": [
          "볼 안쪽 세포"
        ],
        "행": [
          [
            "핵"
          ],
          [
            "세포막"
          ]
        ]
      }
    },
    "choices": [
      "세포벽",
      "꽃받침",
      "뿌리털",
      "꽃가루",
      "세포막"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 4
      },
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-reference-extension",
    "explanation": "두 카드에 모두 적힌 세포막이 공통 구조예요. 세포벽은 양파 쪽 카드에만 있으므로 모든 세포의 공통 구조로 고르지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-2",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v013",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 3,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "뿌리의 생김새와 역할",
      "concept": "뿌리의 생김새와 역할",
      "inquirySkill": "관찰 특징·기능 연결"
    },
    "prompt": "뿌리 관찰 카드를 읽고 관찰과 맞지 않게 옮겨 쓴 문장의 기호를 쓰세요.",
    "givens": {
      "관찰": "민들레는 굵은 뿌리 주위에 가는 뿌리가 나고, 가까이 보면 표면에 솜털 같은 뿌리털이 보인다.",
      "문장": {
        "머리": [
          "문장"
        ],
        "행": [
          [
            "ㄱ: 뿌리 표면에 매우 가는 털이 보인다."
          ],
          [
            "ㄴ: 굵은 뿌리와 뿌리털은 굵기가 다르다."
          ],
          [
            "ㄷ: 굵은 중심 뿌리 자체의 이름이 뿌리털이다."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "ㄷ"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "관찰 카드는 뿌리 표면에 가는 털이 있음을 말해요. ㄷ처럼 굵은 중심 뿌리 자체를 뿌리털이라고 부르면 관찰 대상과 이름을 혼동해요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-3",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v014",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 4,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "뿌리 물 흡수 비교 실험",
      "concept": "뿌리 물 흡수 비교 실험",
      "inquirySkill": "비교 조건·관찰 결과·결론"
    },
    "prompt": "다른 조건과 직접 증발을 맞춘 두 양파의 비교 기록입니다. 관찰과 맞는 설명을 고르세요.",
    "givens": {
      "자료표": {
        "머리": [
          "양파",
          "처음 물(mL)",
          "뒤의 물(mL)"
        ],
        "행": [
          [
            "가: 뿌리 제거",
            80,
            77
          ],
          [
            "나: 뿌리 있음",
            80,
            58
          ]
        ]
      },
      "자료 구분": "연습 기록, 절단은 교사 준비"
    },
    "choices": [
      "가에서 물이 더 많이 줄었다.",
      "두 양파에 꽃이 핀 기록이다.",
      "나에서 물이 더 많이 줄었다.",
      "남은 물의 양은 두 쪽이 같다.",
      "나는 뿌리로 물을 흡수하지 못했다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 2
      },
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "뿌리를 남긴 나의 물은80→58mL로22mL, 제거한 가는80→77mL로3mL 줄었어요. 따라서 물은 가보다 나에서 더 줄었어요. 양파의 꽃이나 씨에 관한 결과는 이 기록에 없어요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-4",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v015",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 5,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "뿌리의 생김새와 역할",
      "concept": "뿌리의 생김새와 역할",
      "inquirySkill": "관찰 특징·기능 연결"
    },
    "prompt": "당근의 먹는 부분을 조사한 기록입니다. 뿌리가 굵어진 까닭과 가장 관련 있는 기능을 고르세요.",
    "givens": {
      "기록": "땅속의 뿌리가 굵고, 이 부분에 양분이 저장된다."
    },
    "choices": [
      "양분을 보관하는 기능",
      "꽃가루를 받는 기능",
      "씨를 멀리 날리는 기능",
      "잎에서 물을 내보내는 기능",
      "빛을 받아 양분을 만드는 기능"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 0
      },
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "관찰과 조사에서 당근 뿌리에 양분이 쌓인다는 점이 제시됐어요. 이는 저장 기능과 연결되며 물의 통로나 꽃가루받이 기능과 구별해요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-5",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v016",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 6,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "줄기 생김새와 기능",
      "concept": "줄기 생김새와 기능",
      "inquirySkill": "특징·지지/저장 기능 구별"
    },
    "prompt": "줄기 관찰 기록을 생김새에 따라 분류했습니다. 고구마의 줄기를 넣을 묶음을 고르세요.",
    "givens": null,
    "choices": [
      "굵은 나무줄기가 곧게 선 묶음",
      "다른 물체를 감아 올라가는 묶음",
      "곧은 나무줄기의 껍질이 거친 묶음",
      "땅 표면을 따라 기듯 뻗는 묶음",
      "다른 물체에 기대 곧게 자라는 묶음"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 3
      },
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "고구마 줄기는 땅 표면을 따라 기듯 뻗는 묶음에 들어가요. 먹는 고구마 뿌리의 모양과 지상 줄기가 뻗는 모양을 구별해요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-6",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v017",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 7,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "줄기 색소 물 이동",
      "concept": "줄기 색소 물 이동",
      "inquirySkill": "단면/실험 자료에서 이동 경로 추론"
    },
    "prompt": "그림은 붉은 색소 물에 넣었던 줄기의 가로 단면입니다. 맑은 물에 둔 줄기에는 없던 붉은 자국을 이용해 이동을 추적한 것은 무엇인가요?",
    "givens": {
      "보기": {
        "머리": [
          "보기"
        ],
        "행": [
          [
            "꽃가루"
          ],
          [
            "물"
          ],
          [
            "빛"
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "물",
          "수분"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "물",
      "accepted": [
        "물",
        "수분"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "색소를 섞어 둔 물이 지나간 부분에 붉은 자국이 생겼어요. 이 비교로 추적한 것은 물이고 빛이나 꽃가루가 붉어진 것이라고 하지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-7",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "figure": "assets/bank/c22-s61-u03/s2-q07.webp",
    "figureNote": "색소 물에 두었던 줄기의 가로 단면."
  },
  {
    "id": "c22-s61-u03-v018",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 8,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "줄기 생김새와 기능",
      "concept": "줄기 생김새와 기능",
      "inquirySkill": "특징·지지/저장 기능 구별"
    },
    "prompt": "바람이 분 뒤에도 나무줄기는 가지를 받쳤고, 껍질이 벗겨진 부분은 안쪽이 드러났습니다. 줄기의 기능과 관련 있는 설명을 두 개 고르세요.",
    "givens": null,
    "choices": [
      "모든 줄기의 껍질은 거칠다.",
      "줄기는 가지와 잎을 지지한다.",
      "줄기의 껍질은 꽃가루를 만든다.",
      "줄기는 어린 씨를 감싼 열매다.",
      "줄기의 껍질은 내부를 보호한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "multi-choice",
        "answers": [
          1,
          4
        ],
        "orderSensitive": false,
        "duplicatesAccepted": false
      },
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "가지를 받친 모습은 지지 기능, 껍질이 내부를 둘러싼 모습은 보호 기능과 관련돼요. 모든 줄기 껍질이 거칠거나 줄기가 씨를 감싸는 열매라는 결론은 나오지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-8",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v019",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 9,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "잎과 광합성의 개념",
      "concept": "잎과 광합성의 개념",
      "inquirySkill": "재료·산물·구조/기능 연결"
    },
    "prompt": "녹말이 든 시료에 아이오딘 용액을 떨어뜨린 뒤 관찰할 색을 보기에서 골라 쓰세요.",
    "givens": {
      "보기": {
        "머리": [
          "보기"
        ],
        "행": [
          [
            "청람색"
          ],
          [
            "노란색"
          ],
          [
            "흰색"
          ]
        ]
      },
      "시료": "교사가 준비한 녹말풀, 아이오딘-아이오딘화 칼륨 용액 사용"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "청람색",
          "청흑색",
          "검푸른색",
          "푸른 검정색",
          "남청색"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "청람색",
      "accepted": [
        "청람색",
        "청흑색",
        "검푸른색",
        "푸른 검정색",
        "남청색"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "녹말과 아이오딘 용액이 반응하면 청람색 계열로 변해요. 녹말이 있다는 조건을 읽고 색을 연결하며 처음 시료의 겉색과 혼동하지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-9",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v020",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 10,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "광합성 산물 확인 실험",
      "concept": "광합성 산물 확인 실험",
      "inquirySkill": "변인·아이오딘 반응·근거 해석"
    },
    "prompt": "청람색으로 변한 시료의 기호를 모두 쓰고, 그 판단 근거를 설명하세요. 빛을 받은 유무만으로 추측하지 마세요.",
    "givens": {
      "자료표": {
        "머리": [
          "시료",
          "아이오딘 반응"
        ],
        "행": [
          [
            "ㄱ 밥",
            "청람색"
          ],
          [
            "ㄴ 빛을 받은 잎 시료",
            "청람색 반응 없음"
          ],
          [
            "ㄷ 잠시 어둠에 둔 잎 시료",
            "청람색"
          ],
          [
            "ㄹ 물",
            "청람색 반응 없음"
          ]
        ]
      },
      "조건": "교사가 같은 방법으로 처리한 제공 결과이며 실제 학생 실험이 아님"
    },
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "plantContract": {
        "teacherRequired": true,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "written-explanation",
        "required": [
          "ㄱ과 ㄷ 두 기호",
          "실제 제공된 청람색 반응을 근거로 녹말 검출을 설명",
          "어둠 처리만으로 기존 녹말이 없다고 단정하지 않음"
        ],
        "exactStringScoring": false
      },
      "type": "written-explanation",
      "sample": "ㄱ과 ㄷ. 두 시료에서 아이오딘 용액과 반응한 청람색이 나타났으므로 녹말이 검출되었다. ㄷ은 이전 녹말이 남아 있을 수 있다.",
      "rubric": {
        "required": [
          "ㄱ과 ㄷ 두 기호",
          "실제 제공된 청람색 반응을 근거로 녹말 검출을 설명",
          "어둠 처리만으로 기존 녹말이 없다고 단정하지 않음"
        ],
        "pass": "서술 근거를 교사가 확인 · 동등 표현과 타당한 조건 설명 인정"
      }
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "제공 결과에서 ㄱ·ㄷ이 청람색이에요. 어둠에 잠시 둔 잎도 이전 녹말이 남았다면 반응할 수 있어요. ㄴ은 빛을 받았어도 이 제공 결과에서는 반응하지 않았으므로 관찰과 예상은 구별해요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-10",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v021",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 11,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "잎과 광합성의 개념",
      "concept": "잎과 광합성의 개념",
      "inquirySkill": "재료·산물·구조/기능 연결"
    },
    "prompt": "잎이 광합성에 사용하는 물질을 공급 경로와 연결해 빈칸에 각각 쓰세요.",
    "givens": {
      "문장": "광합성에 쓰이는 ㉠은 뿌리에서 줄기를 거쳐 오고, ㉡는 공기에서 잎으로 들어옵니다.",
      "보기": {
        "머리": [
          "보기"
        ],
        "행": [
          [
            "이산화 탄소"
          ],
          [
            "물"
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "ordered-word-parts",
        "parts": [
          {
            "label": "㉠",
            "accepted": [
              "물",
              "수분"
            ]
          },
          {
            "label": "㉡",
            "accepted": [
              "이산화 탄소",
              "이산화탄소",
              "CO2",
              "CO₂"
            ]
          }
        ],
        "orderSensitive": true
      },
      "type": "short-text",
      "answer": "㉠-물, ㉡-이산화 탄소",
      "accepted": [
        "㉠-물, ㉡-이산화 탄소"
      ],
      "inputHint": "㉠, ㉡의 답을 쉼표로 나누어 써요."
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "㉠은 뿌리가 흡수하여 줄기를 거쳐 온 물,㉡은 공기에서 공급되는 이산화 탄소예요. 같은 두 물질이라도 제시한 공급 경로와 빈칸 대응을 뒤집지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-11",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v022",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 12,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "잎과 광합성의 개념",
      "concept": "잎과 광합성의 개념",
      "inquirySkill": "재료·산물·구조/기능 연결"
    },
    "prompt": "기관의 기능에 대한 두 설명을 읽고 (1), (2)에 각각 ○ 또는 ×를 쓰세요.",
    "givens": {
      "설명": {
        "머리": [
          "설명"
        ],
        "행": [
          [
            "(1) 잎에서 만든 양분은 다른 기관에서 쓰일 수 있다."
          ],
          [
            "(2) 광합성과 증산 작용은 같은 과정의 두 이름이다."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "ordered-boolean-parts",
        "answers": [
          true,
          false
        ],
        "labels": [
          "(1)",
          "(2)"
        ],
        "orderSensitive": true
      },
      "type": "short-text",
      "answer": "(1) ○ (2) ×",
      "accepted": [
        "(1) ○ (2) ×"
      ],
      "inputHint": "(1), (2)의 답을 쉼표로 나누어 써요."
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "잎에서 만든 양분은 다른 기관으로 운반되어 쓰이거나 저장될 수 있으므로(1)은○예요. 양분을 만드는 광합성과 물을 내보내는 증산은 다른 과정이므로(2)는×예요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-12",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v023",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 13,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "잎 유무 비교 실험",
      "concept": "잎 유무 비교 실험",
      "inquirySkill": "같은 조건·다른 조건·증거/결론"
    },
    "prompt": "잎의 유무만 달리한 비교 실험의 계획입니다. 두 쪽에서 같게 유지할 조건이 아닌 것의 기호를 쓰세요.",
    "givens": {
      "보기": {
        "머리": [
          "보기"
        ],
        "행": [
          [
            "가: 처음 넣는 물의 양"
          ],
          [
            "나: 사용하는 봉지의 크기"
          ],
          [
            "다: 모종에 잎이 있는지 여부"
          ],
          [
            "라: 실험을 놓아두는 시간"
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "다"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "다",
      "accepted": [
        "다"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "잎 유무를 비교하려는 실험에서는 다를 의도적으로 다르게 해요. 물의 양·봉지 크기·실험 시간을 맞춰 다른 원인이 섞이지 않게 해야 해요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-13",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v024",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 14,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "잎 유무 비교 실험",
      "concept": "잎 유무 비교 실험",
      "inquirySkill": "같은 조건·다른 조건·증거/결론"
    },
    "prompt": "같은 종류 모종과 마른 봉지를 쓰고 용기 입구를 막아 비교한 제공 기록입니다. 결과가 뒷받침하는 설명을 두 개 고르세요.",
    "givens": {
      "자료표": {
        "머리": [
          "잎 상태",
          "물 감소",
          "봉지 안"
        ],
        "행": [
          [
            "있음",
            "더 큼",
            "물방울 많음"
          ],
          [
            "없음",
            "더 작음",
            "거의 없음"
          ]
        ]
      },
      "자료 구분": "같은 빛·시간의 연습 기록"
    },
    "choices": [
      "물이 잎을 통해 밖으로 나감을 뒷받침한다.",
      "모든 식물이 같은 양의 물을 내보낸다.",
      "잎이 있는 쪽의 물이 더 많이 줄었다.",
      "뿌리를 제거한 효과를 직접 비교한 결과다.",
      "잎이 없는 쪽의 물방울이 더 많았다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "multi-choice",
        "answers": [
          0,
          2
        ],
        "orderSensitive": false,
        "duplicatesAccepted": false
      },
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "잎이 있는 쪽은 물이 더 줄고 봉지 안에 물방울이 더 많이 나타났어요. 잎을 통해 물이 밖으로 나간다는 설명을 뒷받침하지만 다른 식물이나 뿌리 제거 효과까지 이 실험으로 확인하지 않았어요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-14",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v025",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 15,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "증산 작용과 기공",
      "concept": "증산 작용과 기공",
      "inquirySkill": "용어·기능·물의 이동"
    },
    "prompt": "잎에서 물이 수증기로 나갈 때 식물의 온도 조절에도 도움이 됩니다. 이 현상에 알맞은 설명을 고르세요.",
    "givens": null,
    "choices": [
      "꽃가루가 암술로 옮겨지는 현상이다.",
      "양분이 뿌리에 저장되는 현상이다.",
      "흙의 물이 뿌리로 들어오는 현상이다.",
      "빛을 이용해 양분을 만드는 현상이다.",
      "잎의 물이 수증기로 나가는 현상이다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 4
      },
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "증산은 잎에 도달한 물의 일부가 수증기로 밖으로 나가는 과정이에요. 꽃가루 이동·양분 저장·뿌리 흡수의 이름과 바꾸지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-15",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v026",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 16,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "꽃의 구조와 꽃가루받이",
      "concept": "꽃의 구조와 꽃가루받이",
      "inquirySkill": "기호·생김새·역할/영향 추론"
    },
    "prompt": "꽃의 구조를 조사한 기록을 읽고, 이 기록과 맞지 않는 결론을 고르세요.",
    "givens": {
      "조사": {
        "머리": [
          "조사"
        ],
        "행": [
          [
            "사과꽃: 암술·수술·꽃잎·꽃받침 있음"
          ],
          [
            "수세미오이 암꽃: 암술·꽃잎·꽃받침 있음, 수술 없음"
          ]
        ]
      }
    },
    "choices": [
      "두 꽃에 암술이 있다.",
      "꽃마다 있는 구조가 다를 수 있다.",
      "모든 꽃에는 반드시 수술이 있다.",
      "사과꽃에는 수술이 있다.",
      "수세미오이 암꽃에는 수술이 없다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 2
      },
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "수세미오이 암꽃에 수술이 없다는 기록이 있으므로 모든 꽃이 수술을 가진다는 결론은 맞지 않아요. 한 꽃의 구조를 모든 꽃으로 일반화하지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-16",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v027",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 17,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "꽃의 구조와 꽃가루받이",
      "concept": "꽃의 구조와 꽃가루받이",
      "inquirySkill": "기호·생김새·역할/영향 추론"
    },
    "prompt": "꽃 표본 카드가 사과꽃을 바르게 소개하도록 고른 내용을 찾으세요.",
    "givens": null,
    "choices": [
      "암술·수술·꽃잎·꽃받침이 함께 있다.",
      "암술만 있고 꽃잎은 전혀 없다.",
      "수술만 있고 암술은 전혀 없다.",
      "성숙한 씨를 감싸는 열매껍질이다.",
      "뿌리털이 모여 이루어진 구조다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 0
      },
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "사과꽃은 제시한 네 구조가 함께 있는 꽃의 예예요. 모든 사과꽃을 암꽃이나 수꽃으로 따로 나누거나 꽃을 열매의 기능으로 소개하지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-17",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v028",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 18,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "꽃의 구조와 꽃가루받이",
      "concept": "꽃의 구조와 꽃가루받이",
      "inquirySkill": "기호·생김새·역할/영향 추론"
    },
    "prompt": "곤충이 꽃가루를 옮기는 식물에서 곤충의 방문이 크게 줄었습니다. 다른 조건이 같을 때 예상의 범위를 알맞게 정한 사람의 이름을 쓰세요.",
    "givens": {
      "예상": {
        "머리": [
          "예상"
        ],
        "행": [
          [
            "서윤: 바람으로 꽃가루받이하는 식물까지 전부 즉시 사라져."
          ],
          [
            "민서: 이 식물이 씨와 열매를 맺는 데 어려움이 생길 수 있어."
          ],
          [
            "지후: 꽃가루가 옮겨지지 않아도 씨는 항상 더 많아져."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "민서"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "민서",
      "accepted": [
        "민서"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "이 식물은 곤충의 도움이 줄면 꽃가루받이와 결실이 줄 수 있어요. 민서는 그 범위를 해당 식물에 한정했고, 다른 식물도 모두 같다고 일반화하지 않았어요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-18",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v029",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 19,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "열매와 씨 퍼뜨림",
      "concept": "열매와 씨 퍼뜨림",
      "inquirySkill": "특징·보호·확산 방법 연결"
    },
    "prompt": "겨우살이 열매를 먹은 새가 다른 곳으로 이동한 뒤 배설물에서 씨가 발견됐습니다. 이 기록과 연결되는 씨의 이동 방법을 고르세요.",
    "givens": null,
    "choices": [
      "솜털에 바람을 받아 이동한다.",
      "열매껍질이 터지면서 튀어나간다.",
      "갈고리가 옷의 올에 걸려 이동한다.",
      "동물에게 먹힌 뒤 배설되어 이동한다.",
      "물에 떠서 물결을 따라 이동한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 3
      },
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "먹힌 열매의 씨가 새의 이동과 배설을 거쳐 옮겨졌다는 기록이에요. 이 자료에서는 동물에게 먹힌 뒤 퍼지는 방법을 고르며 솜털이나 날개를 새로 가정하지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-19",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v030",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 20,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "기관 연결과 생활 적용",
      "concept": "기관 연결과 생활 적용",
      "inquirySkill": "기관의 역할·조건·주장 범위"
    },
    "prompt": "모형 식물의 기관별 설명표를 만들었습니다. 기능을 잘못 연결한 행을 고르세요.",
    "givens": null,
    "choices": [
      "잎 — 빛을 이용해 양분을 만듦",
      "뿌리 — 어린 씨를 둘러싸 보호함",
      "줄기 — 흡수한 물이 지나가는 통로",
      "꽃 — 씨를 만드는 과정과 연결됨",
      "열매 — 씨가 퍼지는 데 도움을 줌"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 1
      },
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "어린 씨를 보호하는 기능은 열매와 연결해야 해요. 뿌리는 물 흡수와 관련되므로 뿌리를 어린 씨 보호로 연결한 행을 고쳐요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-20",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v031",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 1,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-01",
      "topic": "식물 세포 관찰 자료",
      "concept": "식물 세포 관찰 자료",
      "inquirySkill": "현미경 관찰 그림·기록과 구조 기호 해석"
    },
    "prompt": "식물 세포의 구조 모식도입니다. 세포 안쪽에 둥글게 표시한 핵의 기호를 쓰세요.",
    "givens": {
      "학습 범위": "옛 자료의 확장 참고입니다. 현재 식물 세포 관찰의 필수 용어 범위와 구별해요."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "ㄱ"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-reference-extension",
    "explanation": "그림의 ㄱ은 둥글게 표시된 핵,ㄴ은 세포막,ㄷ은 세포벽을 가리켜요. 구조의 위치와 선의 끝을 연결해 ㄱ을 골라요. 이 모식도는 실제 양파 표피를 현미경으로 관찰한 사진이나 학생의 실제 관찰 기록은 아니에요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-1",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "figure": "assets/bank/c22-s61-u03/s3-q01.webp",
    "figureNote": "식물 세포의 구조를 나타낸 모식도."
  },
  {
    "id": "c22-s61-u03-v032",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 2,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-01",
      "topic": "세포 개념과 구조 용어",
      "concept": "세포 개념과 구조 용어",
      "inquirySkill": "비교·개념 구별"
    },
    "prompt": "식물 세포 구조에 관한 기능 카드를 세포막에 붙이려고 합니다. 알맞은 카드를 고르세요.",
    "givens": {
      "학습 범위": "옛 자료의 확장 참고입니다. 현재 식물 세포 관찰의 필수 용어 범위와 구별해요."
    },
    "choices": [
      "꽃에서 씨가 자라도록 한다.",
      "세포의 바깥에서 단단히 지지한다.",
      "유전 정보를 담는 중심 구조다.",
      "세포 안팎 물질의 출입을 조절한다.",
      "기공으로 물이 나가는 현상이다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 3
      },
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-reference-extension",
    "explanation": "세포막은 세포 안팎을 드나드는 물질의 출입을 조절해요. 단단한 세포벽의 보호나 핵의 유전 정보 기능과 구별해요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-2",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v033",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 3,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-01",
      "topic": "식물 세포 관찰 자료",
      "concept": "식물 세포 관찰 자료",
      "inquirySkill": "현미경 관찰 그림·기록과 구조 기호 해석"
    },
    "prompt": "관찰 자료와 구조 확인 기록에서 식물 세포에 해당하는 표본의 기호를 쓰세요.",
    "givens": {
      "학습 범위": "옛 자료의 확장 참고입니다. 현재 식물 세포 관찰의 필수 용어 범위와 구별해요.",
      "자료표": {
        "머리": [
          "표본",
          "기록"
        ],
        "행": [
          [
            "ㄱ",
            "핵·세포막 있음, 세포벽 없음"
          ],
          [
            "ㄴ",
            "불규칙한 먼지만 보임"
          ],
          [
            "ㄷ",
            "이어진 경계가 있고 세포벽·세포막·핵 확인"
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "ㄷ"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-reference-extension",
    "explanation": "ㄷ에는 핵·세포막과 함께 세포벽이 확인됐어요. 핵만 보이는 ㄱ은 동물 세포일 수도 있고 먼지뿐인 ㄴ은 세포로 판정할 근거가 없어요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-3",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v034",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 4,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "뿌리의 생김새와 역할",
      "concept": "뿌리의 생김새와 역할",
      "inquirySkill": "관찰 특징·기능 연결"
    },
    "prompt": "굵기가 비슷한 뿌리가 여러 가닥으로 뻗은 식물을 관찰 기록에서 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "관찰": {
        "머리": [
          "관찰"
        ],
        "행": [
          [
            "ㄱ 민들레: 굵은 뿌리 주위에 가는 뿌리가 있음"
          ],
          [
            "ㄴ 파: 비슷한 굵기의 뿌리가 여러 가닥 있음"
          ],
          [
            "ㄷ 강아지풀: 비슷한 굵기의 뿌리가 수염처럼 남"
          ],
          [
            "ㄹ 고추: 굵고 곧은 뿌리에 가는 뿌리가 남"
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "unordered-label-set",
        "answers": [
          "ㄴ",
          "ㄷ"
        ],
        "orderSensitive": false,
        "duplicatesAccepted": false
      },
      "type": "short-text",
      "answer": "ㄴ, ㄷ",
      "accepted": [
        "ㄴ, ㄷ"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "ㄴ과 ㄷ은 굵기가 비슷한 여러 가닥 뿌리로 기록됐어요. ㄱ·ㄹ의 중심 굵은 뿌리와 구별하며 두 기호를 쓰는 순서는 상관없어요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-4",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v035",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 5,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "뿌리 물 흡수 비교 실험",
      "concept": "뿌리 물 흡수 비교 실험",
      "inquirySkill": "비교 조건·관찰 결과·결론"
    },
    "prompt": "뿌리 유무를 달리하고 다른 조건과 직접 증발을 맞춘 연습 기록입니다. 마지막에 물이 더 많이 남은 용기의 기호를 쓰세요.",
    "givens": {
      "자료표": {
        "머리": [
          "기호",
          "처음 물(mL)",
          "마지막 물(mL)"
        ],
        "행": [
          [
            "ㄱ 뿌리 제거",
            70,
            68
          ],
          [
            "ㄴ 뿌리 있음",
            70,
            44
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "ㄱ"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "ㄱ은68mL,ㄴ은44mL가 남았으므로 더 많이 남은 쪽은 ㄱ이에요. 뿌리 상태를 먼저 읽고 남은 양과 줄어든 양을 뒤집지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-5",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v036",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 6,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "뿌리 물 흡수 비교 실험",
      "concept": "뿌리 물 흡수 비교 실험",
      "inquirySkill": "비교 조건·관찰 결과·결론"
    },
    "prompt": "같은 양파의 뿌리 유무만 달리하여 물의 감소를 비교했습니다. 이 비교에서 가장 직접 확인하려는 기능을 고르세요.",
    "givens": {
      "계획": "같은 환경, 같은 용기·처음 물의 양, 직접 증발을 줄인 조건에서 비교한다. 절단은 교사가 준비한다."
    },
    "choices": [
      "씨를 멀리 퍼뜨리는 기능",
      "빛으로 양분을 만드는 기능",
      "양분을 저장하는 기능",
      "몸을 지지하는 힘의 크기",
      "뿌리가 물을 흡수하는 기능"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 4
      },
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "변인은 뿌리 유무이고 비교할 값은 물의 감소량이므로 물 흡수 기능을 알아보는 설계예요. 저장 양분·지지력·씨의 이동은 측정하지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-6",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v037",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 7,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "줄기 생김새와 기능",
      "concept": "줄기 생김새와 기능",
      "inquirySkill": "특징·지지/저장 기능 구별"
    },
    "prompt": "줄기의 관찰 내용을 옮겨 쓴 분류표입니다. 고쳐야 할 행을 고르세요.",
    "givens": null,
    "choices": [
      "나팔꽃 — 굵고 단단한 나무줄기",
      "고구마 — 땅을 기듯 뻗는 줄기",
      "백합 — 겉이 매끈한 줄기",
      "소나무 — 껍질이 거친 줄기",
      "느티나무 — 굵고 곧게 선 줄기"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 0
      },
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "나팔꽃은 다른 물체를 감는 줄기의 예예요. 굵고 단단한 나무줄기로 분류한 행을 고쳐야 해요. 나머지는 각 식물의 줄기 생김새와 맞아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-7",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v038",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 8,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "줄기 색소 물 이동",
      "concept": "줄기 색소 물 이동",
      "inquirySkill": "단면/실험 자료에서 이동 경로 추론"
    },
    "prompt": "색소 물에 넣기 전에는 붉지 않았던 줄기입니다. 그림의 붉은 부분을 보고 내릴 수 있는 해석의 기호를 쓰세요.",
    "givens": {
      "보기": {
        "머리": [
          "보기"
        ],
        "행": [
          [
            "ㄱ: 줄기의 모든 부분은 처음부터 붉었다."
          ],
          [
            "ㄴ: 붉은 부분은 꽃가루가 모인 곳이다."
          ],
          [
            "ㄷ: 색소를 탄 물이 이 부분을 따라 이동했다."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "ㄷ"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "색소 물을 넣은 뒤 특정 부분에 색이 나타났으므로 그 물이 지나간 경로를 추정할 수 있어요. 줄기 전체가 원래 붉거나 공기의 이동이 표시된 것이라고 하지는 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-8",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "figure": "assets/bank/c22-s61-u03/s3-q08.webp",
    "figureNote": "색소 물에 두었던 줄기 단면."
  },
  {
    "id": "c22-s61-u03-v039",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 9,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "줄기 색소 물 이동",
      "concept": "줄기 색소 물 이동",
      "inquirySkill": "단면/실험 자료에서 이동 경로 추론"
    },
    "prompt": "가로 단면에 따로 보인 붉은 점들이 줄기 길이 방향으로 이어져 있다고 해석했습니다. 이 해석과 맞는 세로 단면 관찰 기록의 기호를 쓰세요.",
    "givens": {
      "조건": "교사가 색소 물에 둔 백합 줄기의 같은 부분을 서로 다른 방향으로 잘라 제공한 관찰 자료",
      "관찰 기록": {
        "머리": [
          "관찰 기록"
        ],
        "행": [
          [
            "ㄱ: 통로가 모두 줄기 밖으로 떨어져 있음"
          ],
          [
            "ㄴ: 줄기 안이 색 차이 없이 한 덩어리로 모두 붉음"
          ],
          [
            "ㄷ: 줄기 길이 방향으로 여러 붉은 선이 이어져 있음"
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "ㄷ"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "가로에서 점처럼 잘린 통로를 길이 방향으로 보면 줄기를 따라 이어진 선처럼 보일 수 있어요. ㄷ이 그 방향 관계와 맞으며 전체가 한 덩어리로 물들었다고 확대하지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-9",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v040",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 10,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "광합성 산물 확인 실험",
      "concept": "광합성 산물 확인 실험",
      "inquirySkill": "변인·아이오딘 반응·근거 해석"
    },
    "prompt": "제공된 색 변화와, 그 결과로 확인한 물질을 함께 쓰세요. 시작 전과 뒤의 차이도 설명하세요.",
    "givens": {
      "조건": "교사가 같은 모종의 시작 전 시료에서 녹말 불검출을 확인하고, 빛을 비춘 뒤 잎을 처리함. 약품·가열은 교사 담당.",
      "관찰": "빛을 비춘 뒤 시료에 아이오딘 용액을 떨어뜨리자 청람색 반응이 나타남."
    },
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "plantContract": {
        "teacherRequired": true,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "written-explanation",
        "required": [
          "청람색 또는 같은 뜻의 색 표현",
          "아이오딘 반응에서 녹말 검출",
          "시작 전 불검출과 이후 반응을 연결하고 결론 범위를 한정"
        ],
        "exactStringScoring": false
      },
      "type": "written-explanation",
      "sample": "청람색으로 변했고 녹말이 검출되었다. 시작 전 불검출이었으므로 이 처리 조건에서 녹말이 생긴 것으로 해석한다.",
      "rubric": {
        "required": [
          "청람색 또는 같은 뜻의 색 표현",
          "아이오딘 반응에서 녹말 검출",
          "시작 전 불검출과 이후 반응을 연결하고 결론 범위를 한정"
        ],
        "pass": "서술 근거를 교사가 확인 · 동등 표현과 타당한 조건 설명 인정"
      }
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "시작 전 녹말 불검출과 빛 처리 뒤 청람색 반응을 연결해 녹말이 생겼음을 해석해요. 다만 이 관찰은 세포 구조나 모든 양분의 종류를 확인한 것은 아니에요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-10",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v041",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 11,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "잎과 광합성의 개념",
      "concept": "잎과 광합성의 개념",
      "inquirySkill": "재료·산물·구조/기능 연결"
    },
    "prompt": "광합성으로 만든 양분의 이용을 설명한 카드로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "만들어진 양분은 모두 즉시 밖으로 버린다.",
      "만들어진 양분은 다른 기관으로 가지 못한다.",
      "다른 기관에서 쓰이거나 저장될 수 있다.",
      "광합성은 양분을 물로만 바꾸는 과정이다.",
      "광합성은 빛 없이 물만 있으면 계속된다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 2
      },
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "잎에서 만들어진 양분은 다른 기관으로 옮겨져 쓰이거나 저장될 수 있어요. 모두 즉시 버려지거나 물로만 바뀐다는 설명은 맞지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-11",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v042",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 12,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "잎과 광합성의 개념",
      "concept": "잎과 광합성의 개념",
      "inquirySkill": "재료·산물·구조/기능 연결"
    },
    "prompt": "햇빛을 받는 넓은 면과 잎의 생김새를 연결했습니다. 괄호에서 알맞은 말을 골라 쓰세요.",
    "givens": {
      "문장": "대부분의 잎은 빛을 받는 넓은 면이 펼쳐지도록 ( 납작, 공 모양 )한 생김새를 갖는다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "납작"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "납작",
      "accepted": [
        "납작"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "잎의 넓은 면이 빛을 받는 데 유리한 생김새를 납작하다고 설명해요. 모든 잎이 똑같다고 주장한 것은 아니고 대부분이라는 범위로 읽어요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-12",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v043",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 13,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "잎 유무 비교 실험",
      "concept": "잎 유무 비교 실험",
      "inquirySkill": "같은 조건·다른 조건·증거/결론"
    },
    "prompt": "봉지를 씌운 잎 유무 비교에서 얻은 제공 결과입니다. 이 설계가 뒷받침하는 결론의 기호를 쓰세요.",
    "givens": {
      "조건": "같은 크기의 모종·마른 봉지, 용기 입구를 막고 같은 빛·시간에 비교",
      "결과": "잎 있는 쪽 봉지에 물방울이 더 많이 생김",
      "보기": {
        "머리": [
          "보기"
        ],
        "행": [
          [
            "ㄱ: 흡수한 물이 잎을 거쳐 밖으로 나갈 수 있다."
          ],
          [
            "ㄴ: 모든 식물에서 물 이동 속도가 똑같다."
          ],
          [
            "ㄷ: 빛을 받지 않는 식물에서 물이 더 많이 나간다."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "ㄱ"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "같은 종류·빛·시간에서 잎 유무를 달리했고 잎 있는 쪽의 물방울이 더 많았어요. 이는 물이 잎을 통해 나감을 뒷받침하며 종류나 빛의 영향을 비교한 결과는 아니에요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-13",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v044",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 14,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "증산 작용과 기공",
      "concept": "증산 작용과 기공",
      "inquirySkill": "용어·기능·물의 이동"
    },
    "prompt": "잎에서 수증기가 나가는 통로를 확인하는 관찰 카드에 넣을 구조 이름을 고르세요.",
    "givens": null,
    "choices": [
      "암술",
      "기공",
      "핵",
      "꽃받침",
      "뿌리털"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 1
      },
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "잎 표면의 작은 구멍인 기공을 통해 물의 일부가 수증기로 나가요. 핵·세포벽 같은 세포 구조나 꽃의 기관 이름으로 바꾸지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-14",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v045",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 15,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "꽃의 구조와 꽃가루받이",
      "concept": "꽃의 구조와 꽃가루받이",
      "inquirySkill": "기호·생김새·역할/영향 추론"
    },
    "prompt": "꽃 구조와 역할을 설명한 내용을 읽었습니다. 꽃가루를 만들어 내는 구조에 맞는 것을 고르세요.",
    "givens": null,
    "choices": [
      "꽃가루가 도착하는 암술",
      "꽃봉오리를 감싸는 꽃받침",
      "꽃에서 동물을 끄는 꿀",
      "씨를 보호하는 열매",
      "꽃가루가 만들어지는 수술"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 4
      },
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "꽃가루를 만드는 구조는 수술이에요. 암술은 꽃가루를 받는 구조와 연결하므로 생산과 전달받음을 구별해요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-15",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v046",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 16,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "꽃의 구조와 꽃가루받이",
      "concept": "꽃의 구조와 꽃가루받이",
      "inquirySkill": "기호·생김새·역할/영향 추론"
    },
    "prompt": "자료에 기록된 꽃가루 이동이 주로 바람에 의한 것인 두 식물을 고르세요.",
    "givens": {
      "자료 구분": "꽃가루 이동의 제공 관찰 기록",
      "기록": {
        "머리": [
          "기록"
        ],
        "행": [
          [
            "소나무: 바람에 날린 꽃가루가 다른 나무의 암꽃에 도달"
          ],
          [
            "연꽃: 방문한 곤충의 몸에서 암술로 꽃가루가 옮겨짐"
          ],
          [
            "사과나무: 방문한 벌이 꽃가루를 옮김"
          ],
          [
            "옥수수: 수꽃에서 흩어진 꽃가루가 공기 중으로 이동"
          ],
          [
            "동백나무: 방문한 새가 꽃가루를 옮김"
          ]
        ]
      }
    },
    "choices": [
      "소나무",
      "연꽃",
      "사과나무",
      "옥수수",
      "동백나무"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "multi-choice",
        "answers": [
          0,
          3
        ],
        "orderSensitive": false,
        "duplicatesAccepted": false
      },
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "곤충이나 새의 접촉 없이 공기 중 이동이 관찰된 소나무와 옥수수를 골라요. 물에서 자란다는 사실만으로 꽃가루의 이동 방법까지 판단하지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-16",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v047",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 17,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "열매와 씨 퍼뜨림",
      "concept": "열매와 씨 퍼뜨림",
      "inquirySkill": "특징·보호·확산 방법 연결"
    },
    "prompt": "열매의 생김새와 역할을 연결한 설명으로 알맞은 것을 두 개 고르세요.",
    "givens": null,
    "choices": [
      "열매 안에서 모든 꽃가루가 만들어진다.",
      "어린 씨를 감싸 보호한다.",
      "모든 열매는 솜털로만 이동한다.",
      "익은 씨가 퍼지는 데 도움을 준다.",
      "모든 열매는 줄기를 대신해 식물을 지지한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "multi-choice",
        "answers": [
          1,
          3
        ],
        "orderSensitive": false,
        "duplicatesAccepted": false
      },
      "type": "multi-choice",
      "answers": [
        1,
        3
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "열매는 자라는 씨를 감싸 보호하고, 성숙한 씨가 퍼지는 데 도움을 줄 수 있어요. 모든 열매가 같은 이동 구조를 가지거나 모든 꽃가루를 만드는 것은 아니에요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-17",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v048",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 18,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "열매와 씨 퍼뜨림",
      "concept": "열매와 씨 퍼뜨림",
      "inquirySkill": "특징·보호·확산 방법 연결"
    },
    "prompt": "씨가 퍼지는 방법을 관찰 기록과 연결했습니다. 잘못 연결한 것을 고르세요.",
    "givens": {
      "기록": {
        "머리": [
          "기록"
        ],
        "행": [
          [
            "ㄱ: 솜털 달린 작은 열매가 공중으로 이동"
          ],
          [
            "ㄴ: 갈고리가 동물 털에 붙어 이동"
          ],
          [
            "ㄷ: 먹은 열매의 씨가 배설물에서 발견"
          ],
          [
            "ㄹ: 마른 열매껍질이 벌어지며 씨가 튐"
          ],
          [
            "ㅁ: 열매가 물 위에 떠서 이동"
          ]
        ]
      }
    },
    "choices": [
      "ㄱ — 바람을 이용함",
      "ㄴ — 털에 붙어 이동함",
      "ㄷ — 동물에게 먹혀 이동함",
      "ㄹ — 동물에게 먹혀 이동함",
      "ㅁ — 물을 따라 이동함"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 3
      },
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "ㄹ의 껍질이 벌어지고 씨가 튀는 관찰은 열매가 터지는 방법이에요. 동물에게 먹힌 뒤 나오는 방법으로 바꾸면 관찰 기록과 어긋나요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-18",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v049",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 19,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "기관 연결과 생활 적용",
      "concept": "기관 연결과 생활 적용",
      "inquirySkill": "기관의 역할·조건·주장 범위"
    },
    "prompt": "잎 역할을 맡은 친구가 사용할 수 있는 대사를 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "대사": {
        "머리": [
          "대사"
        ],
        "행": [
          [
            "ㄱ: 땅속으로 뻗어 물을 흡수했어."
          ],
          [
            "ㄴ: 넓게 펼친 면으로 빛을 받아 양분을 만들었어."
          ],
          [
            "ㄷ: 어린 씨를 감싸 보호하고 있어."
          ],
          [
            "ㄹ: 내 표면의 기공으로 물의 일부가 나가고 있어."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "unordered-label-set",
        "answers": [
          "ㄴ",
          "ㄹ"
        ],
        "orderSensitive": false,
        "duplicatesAccepted": false
      },
      "type": "short-text",
      "answer": "ㄴ, ㄹ",
      "accepted": [
        "ㄴ, ㄹ"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "ㄴ은 빛을 받는 잎의 넓은 면,ㄹ은 잎의 기공으로 물이 나가는 역할과 연결돼요. 땅속 흡수나 어린 씨 보호는 다른 기관에 연결해요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-19",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v050",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 20,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "기관 연결과 생활 적용",
      "concept": "기관 연결과 생활 적용",
      "inquirySkill": "기관의 역할·조건·주장 범위"
    },
    "prompt": "한 화분의 물 부족 전후를 관찰한 기록입니다. 기록과 맞지 않는 해석의 기호를 쓰세요. 다른 식물의 꽃피는 시기까지 일반화하지 마세요.",
    "givens": {
      "기록": "같은 시각에 보니 물이 충분할 때보다 잎이 말리고 늘어졌다. 뿌리털 수와 꽃피는 날짜는 조사하지 않았다.",
      "해석": {
        "머리": [
          "해석"
        ],
        "행": [
          [
            "ㄱ: 이 잎은 이전보다 더 활짝 펼쳐졌다."
          ],
          [
            "ㄴ: 이 기록만으로 뿌리털 수는 알 수 없다."
          ],
          [
            "ㄷ: 이 기록만으로 꽃피는 날짜는 알 수 없다."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "ㄱ"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "이 화분의 잎이 말리고 늘어졌다는 기록을 활짝 펼쳐졌다고 바꾼 ㄱ이 틀려요. 기록하지 않은 뿌리털이나 꽃피는 시기는 이 자료만으로 단정하지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-20",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v051",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 1,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-01",
      "topic": "세포 개념과 구조 용어",
      "concept": "세포 개념과 구조 용어",
      "inquirySkill": "비교·개념 구별"
    },
    "prompt": "기관을 더 작은 단위로 관찰하는 설명의 빈칸에 알맞은 말을 쓰세요.",
    "givens": {
      "문장": "잎의 표피를 현미경으로 보면 작은 기본 단위가 이어져 있습니다. 이 기본 단위를 [ ]라고 합니다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "세포"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "세포",
      "accepted": [
        "세포"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "잎도 생물을 이루는 작은 기본 단위인 세포로 이루어져 있어요. 전체 기관인 잎과 그 안의 작은 단위를 나누어 읽어요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-1",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v052",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 2,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-01",
      "topic": "식물 세포 관찰 자료",
      "concept": "식물 세포 관찰 자료",
      "inquirySkill": "현미경 관찰 그림·기록과 구조 기호 해석"
    },
    "prompt": "그림과 같은 양파 표피 세포를 관찰한 뒤, 관찰 범위를 지켜 말한 친구의 이름을 쓰세요.",
    "givens": {
      "말": {
        "머리": [
          "말"
        ],
        "행": [
          [
            "도윤: 이 그림만으로 모든 생물의 세포 모양이 같다는 걸 알았어."
          ],
          [
            "서아: 경계가 이어져 있고 그 안쪽에 둥근 핵이 보이는구나."
          ],
          [
            "지안: 이 정지 그림에서 세포막의 모든 출입 과정을 직접 봤어."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "서아"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "서아",
      "accepted": [
        "서아"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "서아는 보이는 경계와 둥근 핵이라는 관찰 범위 안에서 설명했어요. 모든 세포가 동일하다거나 경계 색만으로 물질 출입 과정을 보았다고 하지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-2",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "figure": "assets/bank/c22-s61-u03/s4-q02.webp",
    "figureNote": "양파 표피 세포 관찰 그림."
  },
  {
    "id": "c22-s61-u03-v053",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 3,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-01",
      "topic": "세포 개념과 구조 용어",
      "concept": "세포 개념과 구조 용어",
      "inquirySkill": "비교·개념 구별"
    },
    "prompt": "표본 구분 카드의 ㉠과 ㉡에 들어갈 말을 순서대로 쓰세요.",
    "givens": {
      "학습 범위": "옛 자료의 확장 참고입니다. 현재 식물 세포 관찰의 필수 용어 범위와 구별해요.",
      "문장": "이 비교에서 세포벽이 없는 쪽은 ㉠(식물/동물) 세포, 세포벽이 있는 쪽은 ㉡(식물/동물) 세포이다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "ordered-word-parts",
        "parts": [
          {
            "label": "㉠",
            "accepted": [
              "동물",
              "동물 세포"
            ]
          },
          {
            "label": "㉡",
            "accepted": [
              "식물",
              "식물 세포"
            ]
          }
        ],
        "orderSensitive": true
      },
      "type": "short-text",
      "answer": "㉠-동물, ㉡-식물",
      "accepted": [
        "㉠-동물, ㉡-식물"
      ],
      "inputHint": "㉠, ㉡의 답을 쉼표로 나누어 써요."
    },
    "sourceNote": "",
    "curriculumScope": "legacy-reference-extension",
    "explanation": "이 비교의 동물 세포에는 세포벽이 없고 식물 세포에는 있어요. 빈칸 순서가 원문과 달라졌으므로 단어의 존재보다 각 칸의 조건을 읽어요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-3",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v054",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 4,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "뿌리의 생김새와 역할",
      "concept": "뿌리의 생김새와 역할",
      "inquirySkill": "관찰 특징·기능 연결"
    },
    "prompt": "뿌리의 생김새를 자세히 보았을 때 알맞은 설명을 고르세요.",
    "givens": null,
    "choices": [
      "뿌리털은 가장 굵은 중심 뿌리다.",
      "파의 뿌리는 모두 굵은 한 가닥이다.",
      "민들레 뿌리 표면에 가는 뿌리털이 있다.",
      "강아지풀은 굵은 중심 뿌리 하나만 난다.",
      "고추와 파의 뿌리 모양은 언제나 같다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 2
      },
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "가는 뿌리털과 굵은 뿌리는 같은 굵기의 구조가 아니에요. 민들레 뿌리 표면에 솜털처럼 가는 뿌리털이 있을 수 있다는 설명을 골라요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-4",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v055",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 5,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "뿌리 물 흡수 비교 실험",
      "concept": "뿌리 물 흡수 비교 실험",
      "inquirySkill": "비교 조건·관찰 결과·결론"
    },
    "prompt": "처음에 물을90mL씩 담고 직접 증발 등 다른 조건을 맞췄습니다. 연습 기록에서 물이 더 적게 줄어든 쪽의 기호를 쓰세요.",
    "givens": {
      "자료표": {
        "머리": [
          "기호",
          "처음 물(mL)",
          "마지막 물(mL)"
        ],
        "행": [
          [
            "ㄱ 뿌리 있음",
            90,
            58
          ],
          [
            "ㄴ 뿌리 제거",
            90,
            86
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "ㄴ"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "ㄱ은32mL,ㄴ은4mL 줄었으므로 더 적게 줄어든 쪽은 ㄴ이에요. 마지막 물이 더 많이 남은 것과 같은 방향이며 처음 양이 같다는 조건을 함께 읽어요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-5",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v056",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 6,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "뿌리의 생김새와 역할",
      "concept": "뿌리의 생김새와 역할",
      "inquirySkill": "관찰 특징·기능 연결"
    },
    "prompt": "뿌리 관찰과 조사 내용을 역할 카드로 만들었습니다. 뿌리의 대표 기능으로 옮길 수 없는 카드의 기호를 쓰세요.",
    "givens": {
      "카드": {
        "머리": [
          "카드"
        ],
        "행": [
          [
            "ㄱ: 식물이 쓰러지지 않도록 지지함"
          ],
          [
            "ㄴ: 꽃가루가 붙는 암술 역할을 함"
          ],
          [
            "ㄷ: 일부 식물에서 양분을 저장함"
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "ㄴ"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "꽃가루를 암술에 전달받는 기능은 꽃의 암술과 관련돼요. 뿌리의 지지와 저장 기능을 이 꽃의 기능과 구별해요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-6",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v057",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 7,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "뿌리의 생김새와 역할",
      "concept": "뿌리의 생김새와 역할",
      "inquirySkill": "관찰 특징·기능 연결"
    },
    "prompt": "먹는 부분이 뿌리에 양분을 저장한 예인 것을 두 개 고르세요.",
    "givens": null,
    "choices": [
      "감자",
      "감",
      "당근",
      "토란",
      "무"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "multi-choice",
        "answers": [
          2,
          4
        ],
        "orderSensitive": false,
        "duplicatesAccepted": false
      },
      "type": "multi-choice",
      "answers": [
        2,
        4
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "당근과 무는 굵어진 뿌리에 양분을 저장해요. 감자는 줄기,감은 열매,토란은 줄기의 저장 사례와 구별해요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-7",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v058",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 8,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "줄기 색소 물 이동",
      "concept": "줄기 색소 물 이동",
      "inquirySkill": "단면/실험 자료에서 이동 경로 추론"
    },
    "prompt": "교사가 준비한 백합 줄기를 붉은 색소 물에 두었습니다. 맑은 물에 둔 대조 줄기와 비교할 때 물 이동의 근거로 알맞은 변화를 고르세요.",
    "givens": null,
    "choices": [
      "색소가 잎까지 가지 않고 물 높이만 낮아진다.",
      "맑은 물과 색소 물의 잎이 모두 처음부터 붉다.",
      "꽃잎의 향기가 줄어들고 뿌리의 수가 늘어난다.",
      "색소 물의 줄기는 겉면만 묻고 잎맥은 그대로다.",
      "색소 물 쪽 잎맥에 붉은색이 나타난다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 4
      },
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "색소 물 쪽 잎맥에만 붉은 물듦이 나타나면 그 물이 줄기를 거쳐 잎에 도달했음을 뒷받침해요. 물 높이 변화만 있거나 줄기의 겉에만 묻은 결과는 잎까지의 경로를 직접 보여 주지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-8",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v059",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 9,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "줄기 색소 물 이동",
      "concept": "줄기 색소 물 이동",
      "inquirySkill": "단면/실험 자료에서 이동 경로 추론"
    },
    "prompt": "흡수 기관에서 잎까지 물이 이동하는 설명입니다. ㉠과 ㉡에 들어갈 기관 이름을 각각 쓰세요.",
    "givens": {
      "문장": "잎으로 향하는 물은 통로인 ㉠을 지나갑니다. 이 물을 흙속에서 처음 흡수하는 기관은 ㉡입니다.",
      "보기": {
        "머리": [
          "보기"
        ],
        "행": [
          [
            "뿌리"
          ],
          [
            "줄기"
          ],
          [
            "꽃"
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "ordered-word-parts",
        "parts": [
          {
            "label": "㉠",
            "accepted": [
              "줄기"
            ]
          },
          {
            "label": "㉡",
            "accepted": [
              "뿌리"
            ]
          }
        ],
        "orderSensitive": true
      },
      "type": "short-text",
      "answer": "㉠-줄기, ㉡-뿌리",
      "accepted": [
        "㉠-줄기, ㉡-뿌리"
      ],
      "inputHint": "㉠, ㉡의 답을 쉼표로 나누어 써요."
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "뿌리가 물을 흡수하고 줄기가 그 물의 이동 통로가 돼요. 여기서는 통로㉠을 먼저 물었으므로 줄기,흡수 기관㉡은 뿌리로 써요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-9",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v060",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 10,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "줄기 생김새와 기능",
      "concept": "줄기 생김새와 기능",
      "inquirySkill": "특징·지지/저장 기능 구별"
    },
    "prompt": "다음 관찰이 가장 직접 보여 주는 줄기의 기능을 고르세요.",
    "givens": {
      "관찰": "굵은 줄기 위의 여러 가지와 잎이 줄기에 받쳐져 서 있다."
    },
    "choices": [
      "씨를 흙에 묻는 기능",
      "가지와 잎을 지지하는 기능",
      "꽃가루를 암술로 옮기는 기능",
      "어린 씨를 열매껍질로 싸는 기능",
      "뿌리털로 흙의 물을 흡수하는 기능"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 1
      },
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "줄기가 가지와 잎을 받치고 있는 모습은 지지 기능의 직접 근거예요. 물 이동이나 산소 사용도 있을 수 있지만 이 관찰로 직접 비교한 기능은 지지예요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-10",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v061",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 11,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "줄기 생김새와 기능",
      "concept": "줄기 생김새와 기능",
      "inquirySkill": "특징·지지/저장 기능 구별"
    },
    "prompt": "줄기에 양분을 저장하는 식물 전시판에 잘못 붙은 이름을 두 개 고르세요.",
    "givens": {
      "전시판 제목": "줄기에 양분을 저장하는 식물"
    },
    "choices": [
      "무",
      "토란",
      "감자",
      "당근",
      "연꽃"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "multi-choice",
        "answers": [
          0,
          3
        ],
        "orderSensitive": false,
        "duplicatesAccepted": false
      },
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "무와 당근은 뿌리의 양분 저장 사례라 줄기 전시판에서 빼야 해요. 토란·감자·연꽃의 먹는 땅속 부분은 줄기의 사례로 구별해요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-11",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v062",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 12,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "광합성 산물 확인 실험",
      "concept": "광합성 산물 확인 실험",
      "inquirySkill": "변인·아이오딘 반응·근거 해석"
    },
    "prompt": "녹말 검출 비교에서 다르게 처리한 조건을 고르세요.",
    "givens": {
      "계획": "교사가 시작 전 녹말 불검출을 확인한 같은 종류의 모종 두 개를 준비. 하나에는 빛을 주고 다른 하나는 가림. 물·온도·시간과 검출 방법은 같게 함."
    },
    "choices": [
      "모종의 종류",
      "검출 용액의 종류",
      "처음 물의 양",
      "빛을 받은 유무",
      "처리한 시간"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 3
      },
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "시작 전 상태와 물·온도·시간·처리 방법을 맞추고 빛만 달리했어요. 따라서 바꾼 조건은 빛 유무이며 같은 전처리를 다른 조건으로 세지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-12",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v063",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 13,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "광합성 산물 확인 실험",
      "concept": "광합성 산물 확인 실험",
      "inquirySkill": "변인·아이오딘 반응·근거 해석"
    },
    "prompt": "교사가 같은 방법으로 처리한 제공 결과에서 청람색으로 변한 시료의 기호를 쓰세요.",
    "givens": {
      "자료표": {
        "머리": [
          "시료",
          "뒤의 반응"
        ],
        "행": [
          [
            "ㄱ 빛을 받은 잎",
            "청람색"
          ],
          [
            "ㄴ 빛을 가린 잎",
            "청람색 반응 없음"
          ]
        ]
      },
      "자료 구분": "연습 자료, 모든 가열·약품 절차는 교사 담당",
      "처음 상태": "두 시료 모두 녹말 불검출 확인"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "ㄱ"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "시작 전 불검출이었고 제공 결과에서 ㄱ만 청람색으로 반응했어요. 빛 유무만 보고 원래 답의 기호를 외우지 말고 실제 시료 기호와 색 변화의 대응을 읽어요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-13",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v064",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 14,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "광합성 산물 확인 실험",
      "concept": "광합성 산물 확인 실험",
      "inquirySkill": "변인·아이오딘 반응·근거 해석"
    },
    "prompt": "이 녹말 확인 비교에서 근거를 지켜 말한 결론을 두 개 고르세요.",
    "givens": {
      "조건": "시작 전 두 잎의 녹말 불검출을 확인. 같은 종류·물·온도·시간에서 빛만 달리함. 제공 결과에서 빛 받은 잎만 청람색 반응."
    },
    "choices": [
      "어떤 조건에서도 어두운 잎에는 모든 양분이 없다.",
      "이 조건의 빛 받은 잎에서 녹말이 검출됐다.",
      "현미경으로 세포 구조를 직접 확인했다.",
      "모든 식물은 밤에 물을 전혀 쓰지 않는다.",
      "빛 유무가 녹말 생성에 미친 영향을 탐구했다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "multi-choice",
        "answers": [
          1,
          4
        ],
        "orderSensitive": false,
        "duplicatesAccepted": false
      },
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "시작 전 불검출과 처리 뒤 반응을 비교하면 빛을 받은 잎에서 녹말이 검출됐고 빛의 영향을 탐구한 것이라고 말할 수 있어요. 모든 양분·모든 종류의 식물로 넓히거나 세포 구조를 관찰했다고 하지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-14",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v065",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 15,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "잎과 광합성의 개념",
      "concept": "잎과 광합성의 개념",
      "inquirySkill": "재료·산물·구조/기능 연결"
    },
    "prompt": "잎의 납작한 생김새와 기능을 연결한 설명의 기호를 쓰세요.",
    "givens": {
      "보기": {
        "머리": [
          "보기"
        ],
        "행": [
          [
            "ㄱ: 넓은 면이 있어 흙속의 물을 뿌리 대신 흡수한다."
          ],
          [
            "ㄴ: 넓은 면을 펼쳐 양분 생성에 필요한 빛을 받는다."
          ],
          [
            "ㄷ: 넓은 면이 있으므로 모든 잎의 모양은 똑같다."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "ㄴ"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "납작하게 펼친 넓은 면은 빛을 받는 데 유리해요. 이것이 모든 잎이 같은 모양이라거나 잎이 흙속 물을 흡수하는 뿌리라는 뜻은 아니에요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-15",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v066",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 16,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T10",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "잎 유무 비교 실험",
      "concept": "잎 유무 비교 실험",
      "inquirySkill": "같은 조건·다른 조건·증거/결론"
    },
    "prompt": "이 비교 실험에서 확인하려는 가설을 쓰고, 물이 더 많이 줄어든 쪽의 기호와 근거를 함께 쓰세요.",
    "givens": {
      "자료표": {
        "머리": [
          "기호",
          "처음 물(mL)",
          "뒤의 물(mL)",
          "봉지 안"
        ],
        "행": [
          [
            "ㄱ 잎 없음",
            60,
            57,
            "물방울 거의 없음"
          ],
          [
            "ㄴ 잎 있음",
            60,
            35,
            "물방울 많음"
          ]
        ]
      },
      "자료 구분": "제공된 연습 결과, 같은 종류·빛·온도·시간·봉지, 용기 입구를 막고 교사가 준비"
    },
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "plantContract": {
        "teacherRequired": true,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "written-explanation",
        "required": [
          "물의 일부가 잎을 통해 밖으로 나간다는 가설",
          "ㄴ과25mL/3mL 비교 또는 잎 있는 쪽의 더 큰 감소",
          "가설과 물방울·물 감소의 제공 근거 연결"
        ],
        "exactStringScoring": false
      },
      "type": "written-explanation",
      "sample": "잎을 통해 물이 밖으로 나갈 것이다. ㄴ에서 물이25mL 줄었고 ㄱ은3mL 줄었으므로 ㄴ에서 더 많이 줄었다. 봉지 안의 물방울 차이도 가설을 뒷받침한다.",
      "rubric": {
        "required": [
          "물의 일부가 잎을 통해 밖으로 나간다는 가설",
          "ㄴ과25mL/3mL 비교 또는 잎 있는 쪽의 더 큰 감소",
          "가설과 물방울·물 감소의 제공 근거 연결"
        ],
        "pass": "서술 근거를 교사가 확인 · 동등 표현과 타당한 조건 설명 인정"
      }
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "잎 유무 외 조건과 직접 증발을 맞춘 비교예요. ㄴ의 감소25mL가 ㄱ의3mL보다 크고 물방울도 더 많으므로 잎을 통한 물 배출 가설을 뒷받침해요. 가설만 쓰거나 기호만 쓰면 근거 설명이 부족해요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-16",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v067",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 17,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "기관 연결과 생활 적용",
      "concept": "기관 연결과 생활 적용",
      "inquirySkill": "기관의 역할·조건·주장 범위"
    },
    "prompt": "뿌리에서 출발한 물을 잎까지 추적한 뒤 붙인 설명입니다. 고쳐야 할 설명의 기호를 쓰세요.",
    "givens": {
      "설명": {
        "머리": [
          "설명"
        ],
        "행": [
          [
            "ㄱ: 잎에 도달한 물은 전부 씨 속에만 영구히 남는다."
          ],
          [
            "ㄴ: 일부는 양분을 만드는 데 쓰일 수 있다."
          ],
          [
            "ㄷ: 일부는 수증기로 식물 밖으로 나갈 수 있다."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "ㄱ"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "잎에 온 물은 양분 생성에 쓰이거나 일부가 수증기로 나갈 수 있어요. 모두 씨 속에만 남는다는 ㄱ은 다른 경로를 배제해 근거와 맞지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-17",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v068",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 18,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "증산 작용과 기공",
      "concept": "증산 작용과 기공",
      "inquirySkill": "용어·기능·물의 이동"
    },
    "prompt": "증산 작용의 역할을 조사한 카드에서 알맞은 설명의 기호를 쓰세요.",
    "givens": {
      "카드": {
        "머리": [
          "카드"
        ],
        "행": [
          [
            "ㄱ: 물을 모두 잎에서 흙으로만 내린다."
          ],
          [
            "ㄴ: 씨를 동물의 털에 붙이는 작용이다."
          ],
          [
            "ㄷ: 물이 수증기로 나가며 온도 조절을 돕는다."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "ㄷ"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "잎의 물이 수증기로 나가면서 식물의 온도 조절에 도움을 줄 수 있어요. 물이 흙으로만 내려가거나 씨를 직접 옮기는 역할이라고 설명하지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-18",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v069",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 19,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "증산 작용과 기공",
      "concept": "증산 작용과 기공",
      "inquirySkill": "용어·기능·물의 이동"
    },
    "prompt": "다음 관찰·기능 카드의 빈칸에 들어갈 구조 이름을 쓰세요.",
    "givens": {
      "카드": "잎 표면을 확대해 보면 작은 구멍이 있습니다. 잎에 도달한 물의 일부가 주로 이 구멍을 통해 수증기로 나갑니다. 이 구멍의 이름은 [ ]입니다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "기공"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "기공",
      "accepted": [
        "기공"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "잎 표면의 작은 구멍을 기공이라고 해요. 잎의 물이 주로 이를 통해 수증기로 나가며 물을 흡수하는 뿌리털과 구별해요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-19",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v070",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 20,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "꽃의 구조와 꽃가루받이",
      "concept": "꽃의 구조와 꽃가루받이",
      "inquirySkill": "기호·생김새·역할/영향 추론"
    },
    "prompt": "그림의 사과꽃에서 옮겨 온 꽃가루를 받는 구조를 가리키는 기호를 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "ㄱ"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "꽃가루가 옮겨져 도착하는 암술은 원그림에서 ㄱ이에요. 수술ㄴ은 꽃가루를 만드는 구조이므로 받는 역할과 구별해요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-20",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "figure": "assets/bank/c22-s61-u03/s4-q20.webp",
    "figureNote": "사과꽃과 수세미오이 암꽃의 구조 그림.",
    "figureLayout": "tall"
  },
  {
    "id": "c22-s61-u03-v071",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 21,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "꽃의 구조와 꽃가루받이",
      "concept": "꽃의 구조와 꽃가루받이",
      "inquirySkill": "기호·생김새·역할/영향 추론"
    },
    "prompt": "두 꽃의 구조 조사에서 바르게 비교한 내용을 고르세요.",
    "givens": {
      "자료표": {
        "머리": [
          "꽃",
          "암술",
          "수술"
        ],
        "행": [
          [
            "가 사과꽃",
            "있음",
            "있음"
          ],
          [
            "나 수세미오이 암꽃",
            "있음",
            "없음"
          ]
        ]
      }
    },
    "choices": [
      "두 꽃 모두 수술이 없다.",
      "나에는 암술이 없고 수술만 있다.",
      "두 꽃에 암술이 있고 나에는 수술이 없다.",
      "가에는 암술 없이 수술만 있다.",
      "수술이 없는 나는 꽃가루를 받을 수 없다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 2
      },
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "조사표에서 두 꽃 모두 암술이 있고 나에는 수술이 없어요. 수술이 없다는 사실만으로 다른 꽃의 꽃가루를 받아 씨를 만드는 가능성까지 없다고 하지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-21",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v072",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 22,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "꽃의 구조와 꽃가루받이",
      "concept": "꽃의 구조와 꽃가루받이",
      "inquirySkill": "기호·생김새·역할/영향 추론"
    },
    "prompt": "꽃가루받이의 이동과 이후 과정을 설명한 문장입니다. ㉠과 ㉡에 각각 들어갈 말을 쓰세요.",
    "givens": {
      "문장": "수술에서 만들어진 ㉠가 암술로 옮겨지는 과정을 꽃가루받이라고 합니다. 이 과정은 ㉡를 만드는 데 필요합니다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "ordered-word-parts",
        "parts": [
          {
            "label": "㉠",
            "accepted": [
              "꽃가루",
              "화분"
            ]
          },
          {
            "label": "㉡",
            "accepted": [
              "씨",
              "씨앗",
              "종자"
            ]
          }
        ],
        "orderSensitive": true
      },
      "type": "short-text",
      "answer": "㉠-꽃가루, ㉡-씨",
      "accepted": [
        "㉠-꽃가루, ㉡-씨"
      ],
      "inputHint": "㉠, ㉡의 답을 쉼표로 나누어 써요."
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "수술에서 암술로 옮겨지는 것은 꽃가루이며 이후 씨를 만드는 과정과 연결돼요. 여기서는 이동 물질을 먼저 묻고 결과 대상을 나중에 물어요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-22",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v073",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 23,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "열매와 씨 퍼뜨림",
      "concept": "열매와 씨 퍼뜨림",
      "inquirySkill": "특징·보호·확산 방법 연결"
    },
    "prompt": "열매를 조사한 두 문장의 빈칸에 공통으로 들어갈 말을 쓰세요.",
    "givens": {
      "문장": {
        "머리": [
          "문장"
        ],
        "행": [
          [
            "어린 [ ]를 감싸 보호하는 열매가 있습니다."
          ],
          [
            "열매가 익으면 [ ]가 퍼지는 데 도움이 됩니다."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "씨",
          "씨앗",
          "종자"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "씨",
      "accepted": [
        "씨",
        "씨앗",
        "종자"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "열매가 자라는 동안 감싸 보호하고 이후 퍼뜨리는 대상은 씨예요. 꽃가루와 열매껍질은 씨 자체와 구별해요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-23",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v074",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 24,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "열매와 씨 퍼뜨림",
      "concept": "열매와 씨 퍼뜨림",
      "inquirySkill": "특징·보호·확산 방법 연결"
    },
    "prompt": "열매의 역할을 소개한 설명에서 고쳐야 할 문장의 기호를 쓰세요.",
    "givens": {
      "소개": {
        "머리": [
          "소개"
        ],
        "행": [
          [
            "ㄱ: 어린 씨를 둘러싸 보호한다."
          ],
          [
            "ㄴ: 종류마다 모양과 크기가 다양하다."
          ],
          [
            "ㄷ: 씨가 다른 곳으로 퍼지는 데 도움을 준다."
          ],
          [
            "ㄹ: 모든 꽃가루를 열매껍질에서 만든다."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "short-text",
        "accepted": [
          "ㄹ"
        ],
        "match": "whole accepted term with optional finite polite ending; no keyword bag"
      },
      "type": "short-text",
      "answer": "ㄹ",
      "accepted": [
        "ㄹ"
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "열매는 어린 씨를 감싸고 퍼뜨리는 데 도움을 주지만 꽃가루를 만드는 구조는 수술이에요. 열매의 기능으로 잘못 옮긴 ㄹ을 고쳐요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-24",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  },
  {
    "id": "c22-s61-u03-v075",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 25,
        "course": "초등6-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "열매와 씨 퍼뜨림",
      "concept": "열매와 씨 퍼뜨림",
      "inquirySkill": "특징·보호·확산 방법 연결"
    },
    "prompt": "벚나무 열매를 먹은 새가 먼 곳으로 날아간 뒤 배설물에서 씨가 관찰됐습니다. 이 자료에 맞는 퍼뜨림 방법을 고르세요.",
    "givens": null,
    "choices": [
      "동물에게 먹힌 뒤 배설되어 퍼짐",
      "씨 자체의 날개로 날아가 퍼짐",
      "씨의 솜털이 바람을 받아 퍼짐",
      "열매껍질이 터져 씨를 튕겨 퍼짐",
      "열매가 물에 떠서 하류로 퍼짐"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "plantContract": {
        "teacherRequired": false,
        "inputConvention": "choice indices are zero-based; circled choice symbols are accepted as displayed",
        "kind": "single-choice",
        "answer": 0
      },
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "sourceNote": "",
    "curriculumScope": "legacy-current-related-excerpt",
    "explanation": "관찰은 동물이 열매를 먹고 이동한 뒤 씨를 배설해 옮긴 경우예요. 깃털을 가진 새가 이동했다고 씨 자체에 날개가 있다고 설명하지 않아요.",
    "evidence": {
      "date": "2026-10-21",
      "checkedBy": "대응짝75의 자체 조건·표/수치·응답 계약·사적PC 원고 검수",
      "gates": [
        "science",
        "answer"
      ],
      "note": "옛6-1Ⅳ 관련 발췌. 현행6-1Ⅲ 전체 판본 원문/실제 활동 수행 완료가 아님. 실제 앱/A4 검수는 별도."
    },
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-25",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    }
  }
];
