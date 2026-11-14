// 독립 집필58문항. 원자료 발문·도판·공식 답안은 포함하지 않는다.
export const unit={
  "id": "c22-s62-u03",
  "course": "6-2",
  "no": 3,
  "title": "전기의 이용",
  "domain": "운동과 에너지",
  "sources": {
    "originalExamAvailable": false,
    "scope": "현행 핵심을 다룬 독립 연습58. 원문과 공식 답안은 공개하지 않는다.",
    "guidance": [
      {
        "title": "교육부 · 과학과 교육과정",
        "url": "https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=141&boardSeq=93458&lev=0&search="
      },
      {
        "title": "National MagLab · 전자석",
        "url": "https://nationalmaglab.org/magnet-academy/plan-a-lesson/electromagnets/"
      }
    ],
    "note": "연습 자료와 실제 관찰을 구별하고 전지·전구·코일의 정격과 비교 조건을 교사와 확인해요."
  }
};
export const items=[
  {
    "key": "1-1",
    "id": "c22-s62-u03-v001",
    "status": "authored",
    "kind": "mc",
    "prompt": "발표판의 제목으로 가장 알맞은 것을 고르세요.",
    "givens": {
      "발표판": "전지·스위치·작은 전구를 전선으로 이었다. 스위치를 닫으면 전구를 거쳐 전지로 돌아오는 끊기지 않은 길이 생긴다.",
      "조건": "교사가 부품 정격을 확인한 저전압 교육용 장치이다. 연결을 바꿀 때는 스위치를 열고, 전지 양극을 전선만으로 직접 잇지 않는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
    },
    "explanation": "이 발표판은 부품 하나의 재료나 겉모양보다 부품을 이어 전기가 흐르는 길을 설명한다. 이런 연결을 전기 회로라고 부른다. 전구를 거쳐 전지로 돌아오는 길이라는 조건이 제목과 맞는다.",
    "scope": "core",
    "type": "T01",
    "standards": [
      "6과15-01"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s1-questions",
        "set": 1,
        "no": 1
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "전지의 보관 상자",
      "전기 회로의 연결",
      "전구 유리의 재료",
      "스위치의 겉모양",
      "전선 피복의 색깔"
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "부품과 용어의 역할 구별",
      "inquirySkill": "부품과 용어의 역할 구별",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "type": "T01",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-01"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 1
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 1
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "1-2",
    "id": "c22-s62-u03-v002",
    "status": "authored",
    "kind": "mc",
    "prompt": "전지를 빼지 않고 전구를 켰다 껐다 하려 합니다. 연결된 길을 여닫는 부품을 고르세요.",
    "givens": {
      "상황": "전구와 전지는 고정해 두고 지정한 부품 하나만 조작한다.",
      "조건": "교사가 부품 정격을 확인한 저전압 교육용 장치이다. 연결을 바꿀 때는 스위치를 열고, 전지 양극을 전선만으로 직접 잇지 않는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4
    },
    "explanation": "스위치를 닫으면 연결된 길이 이어지고 열면 끊어진다. 따라서 전지를 빼지 않고 켜고 끄려는 목적에 맞는다. 끼우개는 부품을 고정하고 접촉시키는 역할이며 이 문제의 조작 부품은 아니다.",
    "scope": "core",
    "type": "T04",
    "standards": [
      "6과15-01"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s1-questions",
        "set": 1,
        "no": 2
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "전구 끼우개",
      "전지 끼우개",
      "전선의 피복",
      "전구의 유리",
      "스위치"
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "스위치 조작과 변화 연결",
      "inquirySkill": "스위치 조작과 변화 연결",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "type": "T04",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-01"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 4
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 4
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "1-3",
    "id": "c22-s62-u03-v003",
    "status": "authored",
    "kind": "st",
    "prompt": "전구가 켜질 수 있는 연결 카드의 기호를 모두 쓰세요. (정답 2개)",
    "givens": {
      "조건": "한 개의 정상 전지와 필라멘트 전구를 쓴다. 전구의 옆 금속과 바닥 금속은 서로 다른 접점이다. 적힌 연결 외에 닿는 곳은 없다.",
      "카드": {
        "머리": [
          "기호",
          "전구의 옆 금속",
          "전구의 바닥 금속"
        ],
        "행": [
          [
            "ㄱ",
            "전지의 +극",
            "전지의 −극"
          ],
          [
            "ㄴ",
            "전지의 +극",
            "연결 안 됨"
          ],
          [
            "ㄷ",
            "전지의 −극",
            "전지의 +극"
          ],
          [
            "ㄹ",
            "전지의 +극",
            "전지의 +극"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "unordered-labels",
      "teacherRequired": false,
      "answers": [
        "ㄱ",
        "ㄷ"
      ]
    },
    "explanation": "ㄱ과 ㄷ은 전지의 서로 다른 두 극이 전구의 서로 다른 접점으로 이어진다. ㄴ은 돌아오는 연결이 없고 ㄹ은 전구 양쪽이 같은 전지 단자에만 연결돼 있다. 필라멘트 전구는 이 조건에서 연결 방향을 바꿔도 켜질 수 있다.",
    "scope": "core",
    "type": "T02",
    "standards": [
      "6과15-01"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s1-questions",
        "set": 1,
        "no": 3
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "verificationModel": {
      "kind": "lamp-contact-cards",
      "cards": [
        {
          "label": "ㄱ",
          "contacts": [
            "+",
            "-"
          ]
        },
        {
          "label": "ㄴ",
          "contacts": [
            "+",
            null
          ]
        },
        {
          "label": "ㄷ",
          "contacts": [
            "-",
            "+"
          ]
        },
        {
          "label": "ㄹ",
          "contacts": [
            "+",
            "+"
          ]
        }
      ],
      "expected": [
        "ㄱ",
        "ㄷ"
      ]
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "접점과 닫힌 연결 판단",
      "inquirySkill": "접점과 닫힌 연결 판단",
      "itemType": "unordered-labels",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "type": "T02",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-01"
    },
    "answerContract": {
      "type": "short-text",
      "preparedStructuredContract": {
        "kind": "unordered-labels",
        "teacherRequired": false,
        "answers": [
          "ㄱ",
          "ㄷ"
        ]
      },
      "kind": "unordered-labels",
      "teacherRequired": false,
      "answers": [
        "ㄱ",
        "ㄷ"
      ],
      "seasonContract": {
        "kind": "unordered-labels",
        "teacherRequired": false,
        "answers": [
          "ㄱ",
          "ㄷ"
        ]
      },
      "answer": "ㄱ, ㄷ",
      "accepted": [
        "ㄱ, ㄷ"
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "1-4",
    "id": "c22-s62-u03-v004",
    "status": "authored",
    "kind": "es",
    "prompt": "전구가 꺼진 까닭을 쓰고, “전지만 반대로 꽂으면 해결된다”는 제안을 검토하세요.",
    "givens": {
      "연결": "전구의 옆 금속과 바닥 금속이 모두 전지 끼우개의 왼쪽 단자에만 이어져 있다. 오른쪽 단자는 어느 전선과도 닿지 않는다.",
      "조건": "정상 필라멘트 전구를 사용한다. 전지를 뒤집어도 전선 두 개의 위치는 그대로이다."
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "전구 양쪽이 같은 전지 단자에만 이어져 꺼져 있다. 전지만 뒤집어도 같은 단자 연결이 남으므로 한 전선을 다른 전지 단자로 옮겨야 한다.",
      "required": [
        "서로 다른 전지 극에 이어지지 않았음을 설명한다.",
        "전지만 뒤집어도 접속 관계가 같음을 판단한다.",
        "다른 단자로의 연결 수정을 제안한다."
      ],
      "exactStringScoring": false
    },
    "explanation": "전선 색이나 전지의 좌우보다 실제 접속 관계를 봐야 한다. 두 전선이 같은 단자에만 있으므로 전구를 거쳐 전지 양극으로 이어지는 길이 아니다. 전지만 뒤집어도 이 관계가 유지되므로 다른 단자로 연결을 고쳐야 한다.",
    "scope": "core",
    "type": "T02",
    "standards": [
      "6과15-01"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s1-questions",
        "set": 1,
        "no": 4
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "접점과 닫힌 연결 판단",
      "inquirySkill": "접점과 닫힌 연결 판단",
      "itemType": "written-explanation",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "type": "T02",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-01"
    },
    "answerContract": {
      "type": "written-explanation",
      "preparedStructuredContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "전구 양쪽이 같은 전지 단자에만 이어져 꺼져 있다. 전지만 뒤집어도 같은 단자 연결이 남으므로 한 전선을 다른 전지 단자로 옮겨야 한다.",
        "required": [
          "서로 다른 전지 극에 이어지지 않았음을 설명한다.",
          "전지만 뒤집어도 접속 관계가 같음을 판단한다.",
          "다른 단자로의 연결 수정을 제안한다."
        ],
        "exactStringScoring": false
      },
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "전구 양쪽이 같은 전지 단자에만 이어져 꺼져 있다. 전지만 뒤집어도 같은 단자 연결이 남으므로 한 전선을 다른 전지 단자로 옮겨야 한다.",
      "required": [
        "서로 다른 전지 극에 이어지지 않았음을 설명한다.",
        "전지만 뒤집어도 접속 관계가 같음을 판단한다.",
        "다른 단자로의 연결 수정을 제안한다."
      ],
      "exactStringScoring": false,
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "전구 양쪽이 같은 전지 단자에만 이어져 꺼져 있다. 전지만 뒤집어도 같은 단자 연결이 남으므로 한 전선을 다른 전지 단자로 옮겨야 한다.",
        "required": [
          "서로 다른 전지 극에 이어지지 않았음을 설명한다.",
          "전지만 뒤집어도 접속 관계가 같음을 판단한다.",
          "다른 단자로의 연결 수정을 제안한다."
        ],
        "exactStringScoring": false
      },
      "answer": "전구 양쪽이 같은 전지 단자에만 이어져 꺼져 있다. 전지만 뒤집어도 같은 단자 연결이 남으므로 한 전선을 다른 전지 단자로 옮겨야 한다.",
      "accepted": [
        "전구 양쪽이 같은 전지 단자에만 이어져 꺼져 있다. 전지만 뒤집어도 같은 단자 연결이 남으므로 한 전선을 다른 전지 단자로 옮겨야 한다."
      ],
      "rubric": {
        "required": [
          "서로 다른 전지 극에 이어지지 않았음을 설명한다.",
          "전지만 뒤집어도 접속 관계가 같음을 판단한다.",
          "다른 단자로의 연결 수정을 제안한다."
        ],
        "teacherRequired": true
      }
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "1-5",
    "id": "c22-s62-u03-v005",
    "status": "authored",
    "kind": "st",
    "prompt": "조건을 맞춘 두 기록에서 더 밝게 켜진 장치의 기호를 쓰세요.",
    "givens": {
      "조건": "같은 종류·상태의 새 전지를 사용한다. 전구 하나·전선·접점 상태는 같으며, 전지 두 개는 서로 다른 극끼리 이어 한 줄로 연결한다. 전구는 두 조건에 모두 알맞은 정격이다. 교사가 부품 정격을 확인한 저전압 교육용 장치이다. 연결을 바꿀 때는 스위치를 열고, 전지 양극을 전선만으로 직접 잇지 않는다.",
      "기록": {
        "머리": [
          "기호",
          "전지 수",
          "관찰 기록"
        ],
        "행": [
          [
            "ㄱ",
            "1개",
            "흐리게 켜짐"
          ],
          [
            "ㄴ",
            "2개",
            "ㄱ보다 밝게 켜짐"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "ㄴ은 ㄱ보다 밝게 켜졌다고 기록되어 있다. 전구·전선 등을 맞추고 전지 한 개와 두 개를 비교한 결과이다. 이 결과를 아무 전구에나 전지를 계속 늘려도 좋다는 뜻으로 확대하지 않는다.",
    "scope": "core",
    "type": "T05",
    "standards": [
      "6과15-02"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s1-questions",
        "set": 1,
        "no": 5
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "전지 한 개와 두 개의 조건 비교",
      "inquirySkill": "전지 한 개와 두 개의 조건 비교",
      "itemType": "short-text",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T05",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-02"
    },
    "answerContract": {
      "type": "short-text",
      "preparedStructuredContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄴ"
        ]
      },
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄴ"
      ],
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄴ"
        ]
      },
      "answer": "ㄴ"
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "1-8",
    "id": "c22-s62-u03-v006",
    "status": "authored",
    "kind": "mc",
    "prompt": "안전 점검 카드에서 바로 고쳐야 할 행동을 고르세요.",
    "givens": {
      "조건": "기구 사용 전의 행동 계획을 읽는다. 학생이 콘센트를 분해하거나 고장 난 기구를 시험하지 않는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
    },
    "explanation": "벗겨진 전선은 그대로 사용하지 않고 어른에게 알려 점검을 받아야 한다. 나머지는 사용 전 안전을 확인하는 행동이다. 겉에 일부 피복이 남아 있다는 사실만으로 손상된 기구가 안전해지는 것은 아니다.",
    "scope": "core",
    "type": "T13",
    "standards": [
      "6과15-04"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s1-questions",
        "set": 1,
        "no": 8
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "젖은 손을 말리고 기구를 만진다.",
      "손상된 전선은 어른에게 알린다.",
      "벗겨진 전선을 계속 사용한다.",
      "전선 대신 플러그 몸체를 잡는다.",
      "사용 설명서의 정격을 확인한다."
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "전기 안전 계획 판단",
      "inquirySkill": "전기 안전 계획 판단",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E8",
      "type": "T13",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-04"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 2
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 2
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "1-9",
    "id": "c22-s62-u03-v007",
    "status": "authored",
    "kind": "mc",
    "prompt": "학급의 전기 절약 계획으로 알맞은 것을 고르세요.",
    "givens": {
      "상황": "창가에 햇빛이 충분하고 그 자리에서 읽기에 불편이 없다. 방에는 다른 사람이 없다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0
    },
    "explanation": "충분히 밝고 사용하지 않는 조명은 끌 수 있다. 필요한 밝기와 사람의 사용 여부를 함께 확인한 계획이다. 절약을 이유로 읽기 어렵거나 위험할 만큼 어둡게 만드는 계획을 뜻하지 않는다.",
    "scope": "core",
    "type": "T14",
    "standards": [
      "6과15-04"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s1-questions",
        "set": 1,
        "no": 9
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "필요 없는 창가 조명을 끈다.",
      "빈 교실의 모든 조명을 켠다.",
      "냉방 중 창문을 계속 열어 둔다.",
      "냉장고 문을 연 채 이야기한다.",
      "쓰지 않는 선풍기를 계속 돌린다."
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "효율적 이용과 실천 점검",
      "inquirySkill": "효율적 이용과 실천 점검",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E8",
      "type": "T14",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-04"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 0
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 0
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "1-10",
    "id": "c22-s62-u03-v008",
    "status": "authored",
    "kind": "mc",
    "prompt": "장치의 특징에 맞는 이름을 고르세요.",
    "givens": {
      "기록": "철심에 절연된 전선을 여러 번 감아 교육용 전지에 연결했다. 스위치를 닫았을 때 철 클립을 끌어당기는 효과가 나타났다.",
      "조건": "교사가 부품 정격을 확인한 저전압 교육용 장치이다. 연결을 바꿀 때는 스위치를 열고, 전지 양극을 전선만으로 직접 잇지 않는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3
    },
    "explanation": "코일에 전기를 흘렸을 때 철심 주위에서 자석처럼 작용하는 장치는 전자석이다. 전구 끼우개나 전기를 만드는 태양 전지와 역할이 다르다. 전류를 끊은 뒤 철심에 약한 자성이 남을 수 있다는 점과 이 장치의 작동을 구별한다.",
    "scope": "core",
    "type": "T08",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s1-questions",
        "set": 1,
        "no": 10
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "유리 막대",
      "전구 끼우개",
      "태양 전지",
      "전자석",
      "종이 스위치"
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "전자석 제작과 접점 준비",
      "inquirySkill": "전자석 제작과 접점 준비",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T08",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 3
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 3
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "1-11",
    "id": "c22-s62-u03-v009",
    "status": "authored",
    "kind": "es",
    "prompt": "표가 뒷받침하는 결론과 이 표만으로 말할 수 없는 결론을 각각 쓰세요.",
    "givens": {
      "조건": "같은 철심·코일·클립·접근 거리·통전 시간을 사용한다. 교사가 허용한 한 개와 두 개의 전지만 비교하며, 두 개는 서로 다른 극끼리 한 줄로 연결한다. 교사가 만든 연습 기록이며 직접 측정한 결과가 아니다.",
      "기록": {
        "머리": [
          "전지 수",
          "1회 클립 수",
          "2회",
          "3회"
        ],
        "행": [
          [
            "1개",
            "4개",
            "5개",
            "4개"
          ],
          [
            "2개",
            "8개",
            "9개",
            "8개"
          ]
        ]
      },
      "주장": "“이 조건에서 두 전지가 더 많이 들었다.” / “전지를 계속 늘릴수록 언제나 안전하고 정확히 두 배씩 든다.”"
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "이 조건에서는 두 전지를 연결한 쪽이 클립을 더 많이 들었다. 전지를 계속 늘려도 안전하다거나 클립 수가 정확히 두 배씩 늘어난다는 결론은 낼 수 없다.",
      "required": [
        "두 조건의 반복 기록을 비교한다.",
        "결론을 제시한 한 개와 두 개 조건 안으로 제한한다.",
        "무제한 증가·정확한 정비례·안전 보장을 인정하지 않는다."
      ],
      "exactStringScoring": false
    },
    "explanation": "한 전지 기록4·5·4개보다 두 전지 기록8·9·8개가 모두 많다. 그러나 가운데 비교는 정확한 두 배가 아니며 세 개 이상의 전지는 시험하지 않았다. 관찰 범위 안의 결론과 시험하지 않은 조건에 대한 단정을 구별한다.",
    "scope": "core",
    "type": "T10",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s1-questions",
        "set": 1,
        "no": 11
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "verificationModel": {
      "kind": "repeated-count-comparison",
      "one": [
        4,
        5,
        4
      ],
      "two": [
        8,
        9,
        8
      ],
      "allTwoGreater": true,
      "exactDouble": false
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "전자석 세기 비교의 근거",
      "inquirySkill": "전자석 세기 비교의 근거",
      "itemType": "written-explanation",
      "track": "교과",
      "level": "기본",
      "element": "E5",
      "type": "T10",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "written-explanation",
      "preparedStructuredContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "이 조건에서는 두 전지를 연결한 쪽이 클립을 더 많이 들었다. 전지를 계속 늘려도 안전하다거나 클립 수가 정확히 두 배씩 늘어난다는 결론은 낼 수 없다.",
        "required": [
          "두 조건의 반복 기록을 비교한다.",
          "결론을 제시한 한 개와 두 개 조건 안으로 제한한다.",
          "무제한 증가·정확한 정비례·안전 보장을 인정하지 않는다."
        ],
        "exactStringScoring": false
      },
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "이 조건에서는 두 전지를 연결한 쪽이 클립을 더 많이 들었다. 전지를 계속 늘려도 안전하다거나 클립 수가 정확히 두 배씩 늘어난다는 결론은 낼 수 없다.",
      "required": [
        "두 조건의 반복 기록을 비교한다.",
        "결론을 제시한 한 개와 두 개 조건 안으로 제한한다.",
        "무제한 증가·정확한 정비례·안전 보장을 인정하지 않는다."
      ],
      "exactStringScoring": false,
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "이 조건에서는 두 전지를 연결한 쪽이 클립을 더 많이 들었다. 전지를 계속 늘려도 안전하다거나 클립 수가 정확히 두 배씩 늘어난다는 결론은 낼 수 없다.",
        "required": [
          "두 조건의 반복 기록을 비교한다.",
          "결론을 제시한 한 개와 두 개 조건 안으로 제한한다.",
          "무제한 증가·정확한 정비례·안전 보장을 인정하지 않는다."
        ],
        "exactStringScoring": false
      },
      "answer": "이 조건에서는 두 전지를 연결한 쪽이 클립을 더 많이 들었다. 전지를 계속 늘려도 안전하다거나 클립 수가 정확히 두 배씩 늘어난다는 결론은 낼 수 없다.",
      "accepted": [
        "이 조건에서는 두 전지를 연결한 쪽이 클립을 더 많이 들었다. 전지를 계속 늘려도 안전하다거나 클립 수가 정확히 두 배씩 늘어난다는 결론은 낼 수 없다."
      ],
      "rubric": {
        "required": [
          "두 조건의 반복 기록을 비교한다.",
          "결론을 제시한 한 개와 두 개 조건 안으로 제한한다.",
          "무제한 증가·정확한 정비례·안전 보장을 인정하지 않는다."
        ],
        "teacherRequired": true
      }
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "1-12",
    "id": "c22-s62-u03-v010",
    "status": "authored",
    "kind": "mc",
    "prompt": "전자석 관찰을 바르게 정리한 문장을 고르세요.",
    "givens": {
      "기록": "스위치를 닫았을 때 철 클립 7개를 들었다. 스위치를 연 뒤에는 1개가 약하게 붙어 있었다.",
      "조건": "같은 철심의 연습 관찰 기록이다. 철심을 가열하거나 두드리는 활동은 하지 않는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
    },
    "explanation": "스위치를 열었어도 클립 한 개가 남았다는 기록이 있다. 철심에는 약한 자성이 남을 수 있으므로 모두 즉시 떨어져야 한다고 단정하지 않는다. 클립이 남았다는 사실만으로 전류가 계속 흐른다고 결론 내릴 수도 없다.",
    "scope": "core",
    "type": "T09",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s1-questions",
        "set": 1,
        "no": 12
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "전류를 끊으면 철심의 물질이 모두 사라진다.",
      "전류를 끊은 뒤 약한 자성이 남을 수 있다.",
      "클립이 남으면 전류가 반드시 계속 흐른다.",
      "한 번 켜진 철심은 늘 같은 세기의 자석이다.",
      "전류를 끊은 뒤에는 자석의 극만 더 세진다."
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "전자석과 영구 자석 비교",
      "inquirySkill": "전자석과 영구 자석 비교",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E6",
      "type": "T09",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 1
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 1
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "1-13",
    "id": "c22-s62-u03-v011",
    "status": "authored",
    "kind": "st",
    "prompt": "분류표에서 두 장치에 공통으로 들어가는 장치 이름을 쓰세요.",
    "givens": {
      "설명": {
        "머리": [
          "장치",
          "확인한 구조"
        ],
        "행": [
          [
            "철 조각 분리 장치",
            "코일에 전기를 흘리면 철 조각을 잡고, 제어하여 놓음"
          ],
          [
            "알림 장치",
            "전기로 켠 코일의 자석 작용으로 작은 철편을 움직임"
          ]
        ]
      },
      "조건": "표에 적힌 구조의 장치만 묻는다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "전자석"
      ]
    },
    "explanation": "두 장치 모두 코일에 전기를 흘릴 때 나타나는 자석 작용을 이용한다. 따라서 공통 장치는 전자석이다. 겉모양이 다르더라도 제어하는 자석 작용이라는 기능으로 묶을 수 있다.",
    "scope": "core",
    "type": "T12",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s1-questions",
        "set": 1,
        "no": 13
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "실제 구조와 용도 연결",
      "inquirySkill": "실제 구조와 용도 연결",
      "itemType": "short-text",
      "track": "교과",
      "level": "기본",
      "element": "E7",
      "type": "T12",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "short-text",
      "preparedStructuredContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "전자석"
        ]
      },
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "전자석"
      ],
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "전자석"
        ]
      },
      "answer": "전자석"
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "1-14",
    "id": "c22-s62-u03-v012",
    "status": "authored",
    "kind": "mc",
    "prompt": "빛을 내는 부품으로 바꿔 볼 수 있는 것을 고르세요.",
    "givens": {
      "상황": "교사가 전지와 전류 제한 부품에 알맞은 교육용 모듈을 준비했다. 모듈의 +·− 연결 표시를 따라 연결한다.",
      "조건": "교사가 부품 정격을 확인한 저전압 교육용 장치이다. 연결을 바꿀 때는 스위치를 열고, 전지 양극을 전선만으로 직접 잇지 않는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4
    },
    "explanation": "발광 다이오드는 전기로 빛을 내는 부품이다. 다만 필라멘트 전구와 달리 연결 방향과 알맞은 전류 제한을 확인해야 한다. 교사가 맞춘 모듈이라는 조건 없이 전지에 아무렇게나 직접 연결하는 활동으로 바꾸지 않는다.",
    "scope": "core",
    "type": "T01",
    "standards": [
      "6과15-01"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s1-questions",
        "set": 1,
        "no": 14
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "전기 스위치 손잡이",
      "절연된 플라스틱 관",
      "종이로 만든 전지함",
      "금속 전선 고정 클립",
      "발광 다이오드 모듈"
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "부품과 용어의 역할 구별",
      "inquirySkill": "부품과 용어의 역할 구별",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "type": "T01",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-01"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 4
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 4
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "1-15",
    "id": "c22-s62-u03-v013",
    "status": "authored",
    "kind": "mc",
    "prompt": "접속 상태를 점검한 뒤 한 가지를 고치려 합니다. 전구가 켜지도록 하는 수정을 고르세요.",
    "givens": {
      "연결": "전지 +극은 전구 옆 금속에 잘 이어져 있다. 전지 −극의 집게는 전구 바닥 금속을 덮은 두꺼운 플라스틱 덮개에만 닿아 있다.",
      "조건": "다른 고장은 없고, 덮개는 전기가 잘 통하지 않는다. 전구와 전지는 정상이다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
    },
    "explanation": "플라스틱 덮개가 금속 접촉을 막고 있으므로 이 접점을 고쳐야 한다. 전구 옆 금속과 바닥 금속이 각각 전지의 다른 극으로 이어지면 길이 연결된다. 전지 두 극을 전선만으로 직접 잇는 것은 해결 방법이 아니다.",
    "scope": "core",
    "type": "T03",
    "standards": [
      "6과15-01"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s1-questions",
        "set": 1,
        "no": 15
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "옆 금속 집게를 전구 유리로 옮긴다.",
      "전지 두 극을 전선 하나로 직접 잇는다.",
      "덮개를 치우고 바닥 금속에 집게를 댄다.",
      "바닥 덮개 위에 종이를 한 겹 더 댄다.",
      "전지의 바깥 상표를 다른 색으로 칠한다."
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "재료의 전도·절연 조건 해석",
      "inquirySkill": "재료의 전도·절연 조건 해석",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "type": "T03",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-01"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 2
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 2
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "2-1",
    "id": "c22-s62-u03-v014",
    "status": "authored",
    "kind": "st",
    "prompt": "카드가 설명하는 용어를 쓰세요.",
    "givens": {
      "카드": "전기가 회로를 따라 흐르는 것을 이 말로 부른다. 흐르는 길인 “전기 회로”와 구별해서 쓴다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "전류"
      ]
    },
    "explanation": "전기가 흐르는 것은 전류라고 부른다. 전기 회로는 부품을 연결한 길을 가리키므로 흐름과 길을 같은 용어로 쓰지 않는다. 이 문항은 전류 주변 자기장의 모양이나 세기 법칙을 묻지 않는다.",
    "scope": "core",
    "type": "T01",
    "standards": [
      "6과15-01"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s2-questions",
        "set": 2,
        "no": 1
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "부품과 용어의 역할 구별",
      "inquirySkill": "부품과 용어의 역할 구별",
      "itemType": "short-text",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "type": "T01",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-01"
    },
    "answerContract": {
      "type": "short-text",
      "preparedStructuredContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "전류"
        ]
      },
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "전류"
      ],
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "전류"
        ]
      },
      "answer": "전류"
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "2-2",
    "id": "c22-s62-u03-v015",
    "status": "authored",
    "kind": "st",
    "prompt": "부품의 재료와 역할을 바르게 연결한 문장을 고르세요. (정답 2개)",
    "givens": {
      "조건": "표준 교육용 집게 전선에서 안쪽은 구리, 바깥쪽은 절연 플라스틱이다."
    },
    "responseContract": {
      "kind": "multi-choice",
      "teacherRequired": false,
      "answers": [
        0,
        4
      ]
    },
    "explanation": "전선 안의 구리는 전기가 잘 통하는 재료이고 바깥 피복은 뜻하지 않은 접촉을 줄인다. 따라서 부품 전체를 도체 한 종류라고 묶지 않는다. 피복이 있다는 이유만으로 손상·정격·사용 환경과 무관하게 안전하다고 보장할 수도 없다.",
    "scope": "core",
    "type": "T03",
    "standards": [
      "6과15-01"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s2-questions",
        "set": 2,
        "no": 2
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "플라스틱 피복은 접촉을 막는 데 쓴다.",
      "피복도 구리처럼 연결 길로 쓴다.",
      "구리 부분은 연결을 끊는 데만 쓴다.",
      "전선 겉과 속은 늘 같은 재료로 만든다.",
      "구리 부분은 전기가 흐를 길로 쓴다."
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "재료의 전도·절연 조건 해석",
      "inquirySkill": "재료의 전도·절연 조건 해석",
      "itemType": "multi-choice",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "type": "T03",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-01"
    },
    "answerContract": {
      "type": "multi-choice",
      "preparedStructuredContract": {
        "kind": "multi-choice",
        "teacherRequired": false,
        "answers": [
          0,
          4
        ]
      },
      "kind": "multi-choice",
      "teacherRequired": false,
      "answers": [
        0,
        4
      ],
      "seasonContract": {
        "kind": "multi-choice",
        "teacherRequired": false,
        "answers": [
          0,
          4
        ]
      },
      "answer": "",
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "2-3",
    "id": "c22-s62-u03-v016",
    "status": "authored",
    "kind": "mc",
    "prompt": "전구 끼우개가 없다는 이유만으로 “켜질 수 없다”고 한 판단을 검토하세요.",
    "givens": {
      "연결": "전구 바닥 금속이 전지 +극에 직접 닿고, 전구 옆 금속은 전선으로 전지 −극에 연결됐다. 다른 곳끼리의 접촉은 없다.",
      "조건": "정상 필라멘트 전구와 알맞은 전지이며 교사가 접점을 고정한 설명 모형이다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0
    },
    "explanation": "직접 닿는 금속 접촉도 연결의 일부이다. 전구 바닥과 옆 접점이 전지의 서로 다른 극에 이어졌으므로 끼우개가 없어도 켜질 수 있다. 전선 개수나 끼우개 유무만 세기보다 실제 연결을 살펴야 한다.",
    "scope": "core",
    "type": "T02",
    "standards": [
      "6과15-01"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s2-questions",
        "set": 2,
        "no": 3
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "서로 다른 두 접점이 양극에 이어져 켜질 수 있다.",
      "끼우개가 없으면 접점이 닿아도 절대로 켜지지 않는다.",
      "전선 한 개이면 직접 금속 접촉도 항상 끊긴 길이다.",
      "전지 한 극에만 닿아도 전구가 계속 밝게 켜진다.",
      "전구의 유리에 닿는 전선만 있어야 켜질 수 있다."
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "접점과 닫힌 연결 판단",
      "inquirySkill": "접점과 닫힌 연결 판단",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "type": "T02",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-01"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 0
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 0
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "2-4",
    "id": "c22-s62-u03-v017",
    "status": "authored",
    "kind": "es",
    "prompt": "열린 회로를 한 군데 고쳐 전구를 켜려 합니다. 어디와 어디를 이어야 하는지 설명하세요.",
    "givens": {
      "연결": "전지 +극→닫힌 스위치→전구 옆 금속은 이어져 있다. 전구 바닥 금속과 전지 −극 사이만 비어 있다.",
      "조건": "전구와 전지는 정상이고 두 접점은 서로 닿지 않는다. 교사가 부품 정격을 확인한 저전압 교육용 장치이다. 연결을 바꿀 때는 스위치를 열고, 전지 양극을 전선만으로 직접 잇지 않는다."
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "전구 바닥 금속과 전지 −극을 전선으로 이어 전구를 거쳐 돌아오는 길을 완성한다.",
      "required": [
        "비어 있는 두 끝을 정확히 지목한다.",
        "전구를 거쳐 전지로 돌아오는 연결을 설명한다.",
        "전구를 건너뛰는 전지 직접 연결은 인정하지 않는다."
      ],
      "exactStringScoring": false
    },
    "explanation": "이미 이어진 곳을 더 연결해도 비어 있는 구간은 남는다. 비어 있는 전구 바닥 금속과 전지 −극 사이를 이어야 전구를 거치는 길이 완성된다. 전구를 건너뛰어 전지 양극만 직접 잇는 방법은 올바른 수정이 아니다.",
    "scope": "core",
    "type": "T02",
    "standards": [
      "6과15-01"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s2-questions",
        "set": 2,
        "no": 4
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "verificationModel": {
      "kind": "open-return-path",
      "nodes": [
        "+",
        "switch",
        "side",
        "bottom",
        "-"
      ],
      "links": [
        [
          "+",
          "switch"
        ],
        [
          "switch",
          "side"
        ],
        [
          "side",
          "bottom"
        ]
      ],
      "missing": [
        "bottom",
        "-"
      ]
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "접점과 닫힌 연결 판단",
      "inquirySkill": "접점과 닫힌 연결 판단",
      "itemType": "written-explanation",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "type": "T02",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-01"
    },
    "answerContract": {
      "type": "written-explanation",
      "preparedStructuredContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "전구 바닥 금속과 전지 −극을 전선으로 이어 전구를 거쳐 돌아오는 길을 완성한다.",
        "required": [
          "비어 있는 두 끝을 정확히 지목한다.",
          "전구를 거쳐 전지로 돌아오는 연결을 설명한다.",
          "전구를 건너뛰는 전지 직접 연결은 인정하지 않는다."
        ],
        "exactStringScoring": false
      },
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "전구 바닥 금속과 전지 −극을 전선으로 이어 전구를 거쳐 돌아오는 길을 완성한다.",
      "required": [
        "비어 있는 두 끝을 정확히 지목한다.",
        "전구를 거쳐 전지로 돌아오는 연결을 설명한다.",
        "전구를 건너뛰는 전지 직접 연결은 인정하지 않는다."
      ],
      "exactStringScoring": false,
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "전구 바닥 금속과 전지 −극을 전선으로 이어 전구를 거쳐 돌아오는 길을 완성한다.",
        "required": [
          "비어 있는 두 끝을 정확히 지목한다.",
          "전구를 거쳐 전지로 돌아오는 연결을 설명한다.",
          "전구를 건너뛰는 전지 직접 연결은 인정하지 않는다."
        ],
        "exactStringScoring": false
      },
      "answer": "전구 바닥 금속과 전지 −극을 전선으로 이어 전구를 거쳐 돌아오는 길을 완성한다.",
      "accepted": [
        "전구 바닥 금속과 전지 −극을 전선으로 이어 전구를 거쳐 돌아오는 길을 완성한다."
      ],
      "rubric": {
        "required": [
          "비어 있는 두 끝을 정확히 지목한다.",
          "전구를 거쳐 전지로 돌아오는 연결을 설명한다.",
          "전구를 건너뛰는 전지 직접 연결은 인정하지 않는다."
        ],
        "teacherRequired": true
      }
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "2-5",
    "id": "c22-s62-u03-v018",
    "status": "authored",
    "kind": "st",
    "prompt": "두 전지가 서로 돕는 한 줄 연결이 되는 카드의 기호를 쓰세요.",
    "givens": {
      "카드": {
        "머리": [
          "기호",
          "가운데에서 이어 준 극"
        ],
        "행": [
          [
            "ㄱ",
            "첫 전지 +극과 둘째 전지 +극"
          ],
          [
            "ㄴ",
            "첫 전지 −극과 둘째 전지 +극"
          ],
          [
            "ㄷ",
            "첫 전지 −극과 둘째 전지 −극"
          ]
        ]
      },
      "조건": "남은 바깥 두 극을 전구 하나의 서로 다른 접점에 잇는 모형이다. 전지의 종류와 상태는 같다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "한 줄로 이어 두 전지가 돕게 하려면 가운데의 서로 다른 극을 잇는다. ㄴ은 첫 전지 −극과 둘째 전지 +극을 잇는다. 전선 색이나 그림의 좌우만으로 판단하지 않고 +·− 표시를 읽는다.",
    "scope": "core",
    "type": "T05",
    "standards": [
      "6과15-02"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s2-questions",
        "set": 2,
        "no": 5
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "전지 한 개와 두 개의 조건 비교",
      "inquirySkill": "전지 한 개와 두 개의 조건 비교",
      "itemType": "short-text",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T05",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-02"
    },
    "answerContract": {
      "type": "short-text",
      "preparedStructuredContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄴ"
        ]
      },
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄴ"
      ],
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄴ"
        ]
      },
      "answer": "ㄴ"
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "2-6",
    "id": "c22-s62-u03-v019",
    "status": "authored",
    "kind": "mc",
    "prompt": "한 개와 두 개의 전지가 밝기에 미치는 영향을 비교하는 계획을 고르세요.",
    "givens": {
      "조건": "같은 종류·상태의 새 전지를 사용한다. 전구 하나·전선·접점 상태는 같으며, 전지 두 개는 서로 다른 극끼리 이어 한 줄로 연결한다. 전구는 두 조건에 모두 알맞은 정격이다. 교사가 부품 정격을 확인한 저전압 교육용 장치이다. 연결을 바꿀 때는 스위치를 열고, 전지 양극을 전선만으로 직접 잇지 않는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3
    },
    "explanation": "전지 수의 영향을 비교하려면 전구 등 다른 중요한 조건을 맞춰야 한다. 같은 종류·상태의 전지 한 개와 두 개만 허용 범위에서 비교하는 계획이 맞다. 여러 조건을 함께 바꾸거나 무조건 전지를 늘리는 계획은 목적에 맞지 않는다.",
    "scope": "core",
    "type": "T05",
    "standards": [
      "6과15-02"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s2-questions",
        "set": 2,
        "no": 6
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "전구와 전지 수를 함께 바꾸어 비교한다.",
      "전지 두 극을 전선만으로 바로 연결한다.",
      "서로 다른 종류의 새 전지와 헌 전지를 섞는다.",
      "같은 전구로 전지 한 개와 두 개를 비교한다.",
      "전지 수를 늘리며 부품 정격은 확인하지 않는다."
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "전지 한 개와 두 개의 조건 비교",
      "inquirySkill": "전지 한 개와 두 개의 조건 비교",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T05",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-02"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 3
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 3
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "2-9",
    "id": "c22-s62-u03-v020",
    "status": "authored",
    "kind": "st",
    "prompt": "어른에게 알려 점검받아야 할 상황의 기호를 쓰세요.",
    "givens": {
      "카드": {
        "머리": [
          "기호",
          "상황"
        ],
        "행": [
          [
            "ㄱ",
            "전선 피복이 찢어져 안쪽 금속이 보임"
          ],
          [
            "ㄴ",
            "기구 설명서를 읽고 사용 전 확인함"
          ],
          [
            "ㄷ",
            "플러그 몸체를 잡고 분리함"
          ]
        ]
      },
      "조건": "실제 손상 기구를 만지거나 켜 보지 않는다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "피복이 찢어진 ㄱ은 사용을 중단하고 어른에게 알려 점검받아야 할 상황이다. 손상 여부를 확인하려고 직접 금속을 만지거나 전원을 켜는 행동으로 이어서는 안 된다. 나머지는 사용 전 확인이나 정상적인 분리 방법이다.",
    "scope": "core",
    "type": "T13",
    "standards": [
      "6과15-04"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s2-questions",
        "set": 2,
        "no": 9
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "전기 안전 계획 판단",
      "inquirySkill": "전기 안전 계획 판단",
      "itemType": "short-text",
      "track": "교과",
      "level": "기본",
      "element": "E8",
      "type": "T13",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-04"
    },
    "answerContract": {
      "type": "short-text",
      "preparedStructuredContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄱ"
        ]
      },
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄱ"
      ],
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄱ"
        ]
      },
      "answer": "ㄱ"
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "2-10",
    "id": "c22-s62-u03-v021",
    "status": "authored",
    "kind": "mc",
    "prompt": "냉장고를 효율적으로 사용하는 계획을 고르세요.",
    "givens": {
      "상황": "식품 한 가지를 꺼내려 한다. 식품 보관과 위생에 필요한 냉장은 계속 유지한다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
    },
    "explanation": "꺼낼 것을 먼저 정하면 불필요하게 문을 열어 두는 시간을 줄일 수 있다. 필요한 냉장은 유지하면서 낭비를 줄이는 계획이다. 절약을 위해 식품 보관에 필요한 기능까지 무조건 끄는 것과 구별한다.",
    "scope": "core",
    "type": "T14",
    "standards": [
      "6과15-04"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s2-questions",
        "set": 2,
        "no": 10
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "고를 동안 문을 계속 열어 둔다.",
      "꺼낼 것을 정한 뒤 문을 짧게 연다.",
      "찬 공기가 나오도록 문을 고정한다.",
      "문을 열어 둔 채 방을 시원하게 한다.",
      "필요한 냉장까지 하루 종일 꺼 둔다."
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "효율적 이용과 실천 점검",
      "inquirySkill": "효율적 이용과 실천 점검",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E8",
      "type": "T14",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-04"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 1
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 1
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "2-11",
    "id": "c22-s62-u03-v022",
    "status": "authored",
    "kind": "st",
    "prompt": "두 칸에 들어갈 말을 보기 “전류·자석”에서 골라 (1)·(2) 순서대로 쓰세요.",
    "givens": {
      "문장": "코일에 (1)이/가 흐를 때 철 클립을 끌어당기는 (2)의 성질이 뚜렷하게 나타났다.",
      "조건": "정상적인 교육용 전자석의 연습 기록이다."
    },
    "responseContract": {
      "kind": "ordered-term-parts",
      "teacherRequired": false,
      "parts": [
        {
          "label": "(1)",
          "kind": "short-text",
          "accepted": [
            "전류"
          ]
        },
        {
          "label": "(2)",
          "kind": "short-text",
          "accepted": [
            "자석"
          ]
        }
      ]
    },
    "explanation": "흐르는 것은 전류이고, 클립을 끌어당기는 특징은 자석의 성질이다. 따라서 전류·자석 순서이다. 두 낱말의 역할과 답칸 순서를 구별한다.",
    "scope": "core",
    "type": "T09",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s2-questions",
        "set": 2,
        "no": 11
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "전자석과 영구 자석 비교",
      "inquirySkill": "전자석과 영구 자석 비교",
      "itemType": "ordered-term-parts",
      "track": "교과",
      "level": "기본",
      "element": "E6",
      "type": "T09",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "short-text",
      "preparedStructuredContract": {
        "kind": "ordered-term-parts",
        "teacherRequired": false,
        "parts": [
          {
            "label": "(1)",
            "kind": "short-text",
            "accepted": [
              "전류"
            ]
          },
          {
            "label": "(2)",
            "kind": "short-text",
            "accepted": [
              "자석"
            ]
          }
        ]
      },
      "kind": "ordered-term-parts",
      "teacherRequired": false,
      "parts": [
        {
          "label": "(1)",
          "kind": "short-text",
          "accepted": [
            "전류"
          ]
        },
        {
          "label": "(2)",
          "kind": "short-text",
          "accepted": [
            "자석"
          ]
        }
      ],
      "seasonContract": {
        "kind": "ordered-term-parts",
        "teacherRequired": false,
        "parts": [
          {
            "label": "(1)",
            "kind": "short-text",
            "accepted": [
              "전류"
            ]
          },
          {
            "label": "(2)",
            "kind": "short-text",
            "accepted": [
              "자석"
            ]
          }
        ]
      },
      "answer": "전류, 자석",
      "accepted": [
        "전류, 자석"
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "2-12",
    "id": "c22-s62-u03-v023",
    "status": "authored",
    "kind": "st",
    "prompt": "나침반의 관찰을 근거로 전자석 왼쪽 끝의 극을 쓰세요.",
    "givens": {
      "기록": "다른 자석을 멀리 두고 나침반 N극을 전자석 왼쪽 끝 가까이에 가져갔더니 서로 밀어냈다.",
      "조건": "N극 표시는 확인돼 있다. 극은 N극 또는 S극으로 쓴다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "N극",
        "N 극",
        "엔극"
      ]
    },
    "explanation": "같은 극끼리는 밀어낸다. N극과 밀어낸 전자석 왼쪽 끝도 N극이다. 전지 연결 그림에서 보이지 않는 감긴 방향을 추정하거나 오른손 법칙을 사용할 필요 없이 관찰로 판단한다.",
    "scope": "core",
    "type": "T11",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s2-questions",
        "set": 2,
        "no": 12
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "나침반 관찰로 극 판단",
      "inquirySkill": "나침반 관찰로 극 판단",
      "itemType": "short-text",
      "track": "교과",
      "level": "기본",
      "element": "E6",
      "type": "T11",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "short-text",
      "preparedStructuredContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "N극",
          "N 극",
          "엔극"
        ]
      },
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "N극",
        "N 극",
        "엔극"
      ],
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "N극",
          "N 극",
          "엔극"
        ]
      },
      "answer": "N극"
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "2-13",
    "id": "c22-s62-u03-v024",
    "status": "authored",
    "kind": "st",
    "prompt": "비교 기록이 뒷받침하는 설명을 고르세요. (정답 2개)",
    "givens": {
      "기록": {
        "머리": [
          "장치",
          "첫 조건",
          "바꾼 조건",
          "결과"
        ],
        "행": [
          [
            "전자석",
            "전지 방향 A",
            "전지 방향 반대",
            "같은 끝의 극이 바뀜"
          ],
          [
            "막대 영구 자석",
            "책상 위",
            "전지와 연결하지 않음",
            "철 클립을 끌어당김"
          ]
        ]
      },
      "조건": "전자석의 코일 감긴 방향은 고정했다."
    },
    "responseContract": {
      "kind": "multi-choice",
      "teacherRequired": false,
      "answers": [
        2,
        3
      ]
    },
    "explanation": "첫 기록은 같은 코일에서 전지 방향을 반대로 하자 극이 바뀌었음을 보여 준다. 둘째 기록은 전지 없이 영구 자석이 작용함을 보여 준다. 세기와 극의 변화, 전류에 의한 제어를 서로 다른 비교 항목으로 구별한다.",
    "scope": "core",
    "type": "T09",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s2-questions",
        "set": 2,
        "no": 13
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "영구 자석은 전류를 켤 때만 작용을 한다.",
      "두 장치는 조건을 바꿔도 늘 같은 작용만 한다.",
      "전자석은 전지 연결 방향으로 극을 바꿀 수 있다.",
      "영구 자석은 전지 없이도 자석 작용을 한다.",
      "전자석은 전지 수를 바꿔야만 극이 바뀐다."
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "전자석과 영구 자석 비교",
      "inquirySkill": "전자석과 영구 자석 비교",
      "itemType": "multi-choice",
      "track": "교과",
      "level": "기본",
      "element": "E6",
      "type": "T09",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "multi-choice",
      "preparedStructuredContract": {
        "kind": "multi-choice",
        "teacherRequired": false,
        "answers": [
          2,
          3
        ]
      },
      "kind": "multi-choice",
      "teacherRequired": false,
      "answers": [
        2,
        3
      ],
      "seasonContract": {
        "kind": "multi-choice",
        "teacherRequired": false,
        "answers": [
          2,
          3
        ]
      },
      "answer": "",
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "2-14",
    "id": "c22-s62-u03-v025",
    "status": "authored",
    "kind": "mc",
    "prompt": "전자석의 켜고 끄는 작용을 이용한 장치를 고르세요.",
    "givens": {
      "구조": {
        "머리": [
          "기호",
          "확인한 구조"
        ],
        "행": [
          [
            "A",
            "전원을 켜면 코일이 철 걸쇠를 끌어당김"
          ],
          [
            "B",
            "전지 없이 막대자석으로 종이를 붙잡음"
          ],
          [
            "C",
            "사람이 종이 부채를 흔듦"
          ],
          [
            "D",
            "톱니를 손잡이로 직접 돌림"
          ],
          [
            "E",
            "고무줄이 수레를 당김"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4
    },
    "explanation": "A는 코일의 전류를 켤 때 철 걸쇠가 움직이므로 전자석을 제어하여 이용한다. B는 전지 없이 영구 자석을 쓰는 장치이다. 겉모양 대신 표에서 확인한 구조와 작동으로 판단한다.",
    "scope": "core",
    "type": "T12",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s2-questions",
        "set": 2,
        "no": 14
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "B",
      "C",
      "D",
      "E",
      "A"
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "실제 구조와 용도 연결",
      "inquirySkill": "실제 구조와 용도 연결",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E7",
      "type": "T12",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 4
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 4
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "2-15",
    "id": "c22-s62-u03-v026",
    "status": "authored",
    "kind": "mc",
    "prompt": "전도성 테이프를 고르는 까닭으로 알맞은 것을 고르세요.",
    "givens": {
      "상황": "종이 위의 교육용 회로에서 두 금속 접점 사이를 전도성 면이 이어지게 붙인다. 일반 투명 테이프는 같은 조건에서 전기가 잘 통하지 않았다.",
      "조건": "교사가 부품 정격을 확인한 저전압 교육용 장치이다. 연결을 바꿀 때는 스위치를 열고, 전지 양극을 전선만으로 직접 잇지 않는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
    },
    "explanation": "전도성 테이프는 이 장치에서 두 접점 사이에 전기가 통하는 길을 만드는 데 쓴다. 전기를 만드는 전지의 역할이나 부품의 재료를 바꾸는 역할이 아니다. 일반 접착테이프와 전기적 성질이 같은 것으로 취급하지 않는다.",
    "scope": "core",
    "type": "T03",
    "standards": [
      "6과15-01"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s2-questions",
        "set": 2,
        "no": 15
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "전지 없이 계속 전기를 새로 만들어 낸다.",
      "전구 유리가 금속이 되도록 재료를 바꾼다.",
      "금속 접점 사이의 전기적 연결을 만든다.",
      "어떤 방향의 발광 다이오드도 켜게 한다.",
      "전지 양극을 직접 이어 열을 내게 한다."
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "재료의 전도·절연 조건 해석",
      "inquirySkill": "재료의 전도·절연 조건 해석",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "type": "T03",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-01"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 2
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 2
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "3-1",
    "id": "c22-s62-u03-v027",
    "status": "authored",
    "kind": "mc",
    "prompt": "전구 끼우개의 역할을 바르게 설명한 것을 고르세요.",
    "givens": {
      "상황": "전구를 끼워 고정하고, 옆 금속과 바닥 금속에 해당하는 단자에 전선을 각각 연결한다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0
    },
    "explanation": "끼우개는 전구를 안정되게 고정하고 두 접점에 연결하기 쉽게 한다. 빛을 내는 전구나 전기를 공급하는 전지의 역할을 대신하지 않는다. 두 단자를 하나로 합쳐 전구를 건너뛰는 연결과도 다르다.",
    "scope": "core",
    "type": "T01",
    "standards": [
      "6과15-01"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s3-questions",
        "set": 3,
        "no": 1
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "전구를 고정하고 접점 연결을 돕는다.",
      "전구 없이도 같은 밝기의 빛을 만든다.",
      "전지 없이도 필요한 전기를 만들어 낸다.",
      "모든 금속 접점을 하나로 합쳐 버린다.",
      "전구의 유리 부분에만 전기를 보낸다."
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "부품과 용어의 역할 구별",
      "inquirySkill": "부품과 용어의 역할 구별",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "type": "T01",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-01"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 0
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 0
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "3-2",
    "id": "c22-s62-u03-v028",
    "status": "authored",
    "kind": "mc",
    "prompt": "“집게 전선의 모든 부분은 전기가 잘 통한다”는 말을 검토하세요.",
    "givens": {
      "관찰": "끝의 금속 집게를 접점에 대면 연결됐지만, 가운데 플라스틱 피복만 접점에 대면 연결되지 않았다.",
      "조건": "같은 정상 집게 전선으로 비교한 교사 제공 연습 기록이다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3
    },
    "explanation": "금속 집게와 플라스틱 피복을 댔을 때 결과가 다르다. 하나의 부품에도 전기가 잘 통하는 부분과 잘 통하지 않는 부분이 있다. 부품 전체의 이름이나 겉 색만으로 재료 성질을 판단하지 않는다.",
    "scope": "core",
    "type": "T03",
    "standards": [
      "6과15-01"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s3-questions",
        "set": 3,
        "no": 2
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "같은 부품이면 모든 재료 성질도 같다.",
      "금속 집게는 피복보다 전기가 덜 통한다.",
      "플라스틱은 어디에 대도 금속과 같다.",
      "금속과 피복은 전기적 성질이 다르다.",
      "전선 색이 다르면 금속도 모두 부도체다."
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "재료의 전도·절연 조건 해석",
      "inquirySkill": "재료의 전도·절연 조건 해석",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "type": "T03",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-01"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 3
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 3
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "3-3",
    "id": "c22-s62-u03-v029",
    "status": "authored",
    "kind": "st",
    "prompt": "정상 필라멘트 전구 하나를 켤 수 있는 조건을 고르세요. (정답 2개)",
    "givens": {
      "조건": "전지와 전구의 정격은 맞고 접점은 정상이다. 두 전지는 같은 종류·상태이며 서로 다른 극끼리 한 줄로 이은 경우만 허용한다."
    },
    "responseContract": {
      "kind": "multi-choice",
      "teacherRequired": false,
      "answers": [
        0,
        1
      ]
    },
    "explanation": "전지 한 개든 허용된 두 개든 전구를 거쳐 전지로 돌아오는 길이 있으면 켜질 수 있다. 같은 단자에만 잇거나 연결이 비거나 유리에만 닿은 경우는 이 조건을 충족하지 않는다. 전지는 반드시 한 개여야 한다는 규칙을 만들지 않는다.",
    "scope": "core",
    "type": "T02",
    "standards": [
      "6과15-01"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s3-questions",
        "set": 3,
        "no": 3
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "전지 한 개의 양극이 전구의 두 접점에 각각 이어진다.",
      "전지 두 개의 바깥 양극이 전구의 두 접점에 이어진다.",
      "전구의 두 접점이 전지의 같은 한 극에만 이어진다.",
      "전선 한쪽 끝이 닿지 않은 채 공중에 떨어져 있다.",
      "전구 바닥 대신 유리에만 전지의 다른 극이 닿는다."
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "접점과 닫힌 연결 판단",
      "inquirySkill": "접점과 닫힌 연결 판단",
      "itemType": "multi-choice",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "type": "T02",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-01"
    },
    "answerContract": {
      "type": "multi-choice",
      "preparedStructuredContract": {
        "kind": "multi-choice",
        "teacherRequired": false,
        "answers": [
          0,
          1
        ]
      },
      "kind": "multi-choice",
      "teacherRequired": false,
      "answers": [
        0,
        1
      ],
      "seasonContract": {
        "kind": "multi-choice",
        "teacherRequired": false,
        "answers": [
          0,
          1
        ]
      },
      "answer": "",
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "3-4",
    "id": "c22-s62-u03-v030",
    "status": "authored",
    "kind": "st",
    "prompt": "켜지지 않는 연결 카드의 기호를 쓰세요.",
    "givens": {
      "카드": {
        "머리": [
          "기호",
          "전구 옆 접점",
          "전구 바닥 접점"
        ],
        "행": [
          [
            "ㄱ",
            "전지 +극",
            "전지 −극"
          ],
          [
            "ㄴ",
            "전지 −극",
            "전지 −극"
          ],
          [
            "ㄷ",
            "전지 −극",
            "전지 +극"
          ]
        ]
      },
      "조건": "정상 필라멘트 전구이며 표에 적힌 연결만 있다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "ㄴ은 전구의 두 접점이 모두 전지 −극 하나에만 이어져 있다. ㄱ과 ㄷ은 서로 다른 전지 극으로 이어지므로 연결 방향은 달라도 켜질 수 있다. 전선 색이나 위치보다 단자를 기준으로 읽는다.",
    "scope": "core",
    "type": "T02",
    "standards": [
      "6과15-01"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s3-questions",
        "set": 3,
        "no": 4
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "verificationModel": {
      "kind": "lamp-contact-cards",
      "cards": [
        {
          "label": "ㄱ",
          "contacts": [
            "+",
            "-"
          ]
        },
        {
          "label": "ㄴ",
          "contacts": [
            "-",
            "-"
          ]
        },
        {
          "label": "ㄷ",
          "contacts": [
            "-",
            "+"
          ]
        }
      ],
      "expected": [
        "ㄱ",
        "ㄷ"
      ],
      "asked": "unlit",
      "answer": "ㄴ"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "접점과 닫힌 연결 판단",
      "inquirySkill": "접점과 닫힌 연결 판단",
      "itemType": "short-text",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "type": "T02",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-01"
    },
    "answerContract": {
      "type": "short-text",
      "preparedStructuredContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄴ"
        ]
      },
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄴ"
      ],
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄴ"
        ]
      },
      "answer": "ㄴ"
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "3-5",
    "id": "c22-s62-u03-v031",
    "status": "authored",
    "kind": "es",
    "prompt": "두 계획 중 전지 두 개가 서로 돕는 한 줄 연결을 고르고, 연결된 극을 근거로 설명하세요.",
    "givens": {
      "계획": {
        "머리": [
          "계획",
          "가운데 연결"
        ],
        "행": [
          [
            "가",
            "첫 전지 +극 ↔ 둘째 전지 −극"
          ],
          [
            "나",
            "첫 전지 +극 ↔ 둘째 전지 +극"
          ]
        ]
      },
      "조건": "남은 바깥 두 극을 같은 전구의 두 접점에 연결한다. 전지 두 개는 같은 종류·상태이다. 교사가 부품 정격을 확인한 저전압 교육용 장치이다. 연결을 바꿀 때는 스위치를 열고, 전지 양극을 전선만으로 직접 잇지 않는다."
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "가가 맞다. 가운데에서 서로 다른 극을 이어 두 전지가 돕는 한 줄 연결이 된다. 나는 같은 극끼리 마주 이어 조건에 맞지 않는다.",
      "required": [
        "가를 고른다.",
        "서로 다른 극의 연결을 근거로 삼는다.",
        "나의 같은 극 연결과 구별한다."
      ],
      "exactStringScoring": false
    },
    "explanation": "가는 가운데에서 +극과 −극을 이어 준다. 나는 +극끼리 이어 같은 상태의 두 전지가 돕는 연결이 아니다. 종이 위에 한 줄로 그렸다는 겉모양과 서로 다른 극끼리 잇는 전기적 조건을 구별한다.",
    "scope": "core",
    "type": "T05",
    "standards": [
      "6과15-02"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s3-questions",
        "set": 3,
        "no": 5
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "전지 한 개와 두 개의 조건 비교",
      "inquirySkill": "전지 한 개와 두 개의 조건 비교",
      "itemType": "written-explanation",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T05",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-02"
    },
    "answerContract": {
      "type": "written-explanation",
      "preparedStructuredContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "가가 맞다. 가운데에서 서로 다른 극을 이어 두 전지가 돕는 한 줄 연결이 된다. 나는 같은 극끼리 마주 이어 조건에 맞지 않는다.",
        "required": [
          "가를 고른다.",
          "서로 다른 극의 연결을 근거로 삼는다.",
          "나의 같은 극 연결과 구별한다."
        ],
        "exactStringScoring": false
      },
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "가가 맞다. 가운데에서 서로 다른 극을 이어 두 전지가 돕는 한 줄 연결이 된다. 나는 같은 극끼리 마주 이어 조건에 맞지 않는다.",
      "required": [
        "가를 고른다.",
        "서로 다른 극의 연결을 근거로 삼는다.",
        "나의 같은 극 연결과 구별한다."
      ],
      "exactStringScoring": false,
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "가가 맞다. 가운데에서 서로 다른 극을 이어 두 전지가 돕는 한 줄 연결이 된다. 나는 같은 극끼리 마주 이어 조건에 맞지 않는다.",
        "required": [
          "가를 고른다.",
          "서로 다른 극의 연결을 근거로 삼는다.",
          "나의 같은 극 연결과 구별한다."
        ],
        "exactStringScoring": false
      },
      "answer": "가가 맞다. 가운데에서 서로 다른 극을 이어 두 전지가 돕는 한 줄 연결이 된다. 나는 같은 극끼리 마주 이어 조건에 맞지 않는다.",
      "accepted": [
        "가가 맞다. 가운데에서 서로 다른 극을 이어 두 전지가 돕는 한 줄 연결이 된다. 나는 같은 극끼리 마주 이어 조건에 맞지 않는다."
      ],
      "rubric": {
        "required": [
          "가를 고른다.",
          "서로 다른 극의 연결을 근거로 삼는다.",
          "나의 같은 극 연결과 구별한다."
        ],
        "teacherRequired": true
      }
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "3-11",
    "id": "c22-s62-u03-v032",
    "status": "authored",
    "kind": "mc",
    "prompt": "사용 전 회의에서 고쳐야 할 제안을 고르세요.",
    "givens": {
      "조건": "멀티탭의 정격과 기구 상태는 어른이 확인한다. 학생은 연결 실험 없이 계획만 읽는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
    },
    "explanation": "멀티탭을 계속 이어 많은 기구를 연결하는 계획은 과부하 위험을 살피지 않은 제안이다. 정격과 사용 환경은 어른이 확인해야 한다. 나머지는 사용 전 위험을 줄이는 점검이다.",
    "scope": "core",
    "type": "T13",
    "standards": [
      "6과15-04"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s3-questions",
        "set": 3,
        "no": 11
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "손상된 기구는 사용을 멈추고 알린다.",
      "멀티탭에 멀티탭을 계속 이어 꽂는다.",
      "전기 기구 주변에 물이 없는지 살핀다.",
      "코드를 통행에 걸리지 않게 정리한다.",
      "정해진 정격과 사용 설명을 확인한다."
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "전기 안전 계획 판단",
      "inquirySkill": "전기 안전 계획 판단",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E8",
      "type": "T13",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-04"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 1
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 1
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "3-12",
    "id": "c22-s62-u03-v033",
    "status": "authored",
    "kind": "es",
    "prompt": "어느 기록이 “계획”, “실행”, “실행 뒤 검토”인지 구별하고, 절약에 도움이 됐는지 더 확인할 자료를 쓰세요.",
    "givens": {
      "기록": {
        "머리": [
          "기호",
          "내용"
        ],
        "행": [
          [
            "ㄱ",
            "점심시간에 빈 교실 조명을 끄기로 정함"
          ],
          [
            "ㄴ",
            "월요일 점심에 조명을 끄고 기록함"
          ],
          [
            "ㄷ",
            "금요일에 빠뜨린 날이 있는지 돌아봄"
          ]
        ]
      },
      "조건": "전기 사용량 자체는 아직 측정하지 않았다."
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "ㄱ은 계획, ㄴ은 실행, ㄷ은 실행 뒤 검토이다. 절약 효과를 수치로 말하려면 비교할 기간의 전기 사용량과 사용 시간·사람 수 같은 조건도 확인해야 한다.",
      "required": [
        "세 단계의 기록을 구별한다.",
        "계획만으로 이미 실천했다고 쓰지 않는다.",
        "전기 사용량과 비교 조건 등 효과를 확인할 자료를 제안한다."
      ],
      "exactStringScoring": false
    },
    "explanation": "하기로 정하는 것과 실제로 한 기록, 실행을 돌아보는 기록은 다르다. ㄱ·ㄴ·ㄷ은 각각 그 단계에 해당한다. 전기 사용량을 재지 않았으므로 계획이나 점검 기록만으로 절약량을 만들어 말할 수 없다.",
    "scope": "core",
    "type": "T14",
    "standards": [
      "6과15-04"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s3-questions",
        "set": 3,
        "no": 12
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "효율적 이용과 실천 점검",
      "inquirySkill": "효율적 이용과 실천 점검",
      "itemType": "written-explanation",
      "track": "교과",
      "level": "기본",
      "element": "E8",
      "type": "T14",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-04"
    },
    "answerContract": {
      "type": "written-explanation",
      "preparedStructuredContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "ㄱ은 계획, ㄴ은 실행, ㄷ은 실행 뒤 검토이다. 절약 효과를 수치로 말하려면 비교할 기간의 전기 사용량과 사용 시간·사람 수 같은 조건도 확인해야 한다.",
        "required": [
          "세 단계의 기록을 구별한다.",
          "계획만으로 이미 실천했다고 쓰지 않는다.",
          "전기 사용량과 비교 조건 등 효과를 확인할 자료를 제안한다."
        ],
        "exactStringScoring": false
      },
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "ㄱ은 계획, ㄴ은 실행, ㄷ은 실행 뒤 검토이다. 절약 효과를 수치로 말하려면 비교할 기간의 전기 사용량과 사용 시간·사람 수 같은 조건도 확인해야 한다.",
      "required": [
        "세 단계의 기록을 구별한다.",
        "계획만으로 이미 실천했다고 쓰지 않는다.",
        "전기 사용량과 비교 조건 등 효과를 확인할 자료를 제안한다."
      ],
      "exactStringScoring": false,
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "ㄱ은 계획, ㄴ은 실행, ㄷ은 실행 뒤 검토이다. 절약 효과를 수치로 말하려면 비교할 기간의 전기 사용량과 사용 시간·사람 수 같은 조건도 확인해야 한다.",
        "required": [
          "세 단계의 기록을 구별한다.",
          "계획만으로 이미 실천했다고 쓰지 않는다.",
          "전기 사용량과 비교 조건 등 효과를 확인할 자료를 제안한다."
        ],
        "exactStringScoring": false
      },
      "answer": "ㄱ은 계획, ㄴ은 실행, ㄷ은 실행 뒤 검토이다. 절약 효과를 수치로 말하려면 비교할 기간의 전기 사용량과 사용 시간·사람 수 같은 조건도 확인해야 한다.",
      "accepted": [
        "ㄱ은 계획, ㄴ은 실행, ㄷ은 실행 뒤 검토이다. 절약 효과를 수치로 말하려면 비교할 기간의 전기 사용량과 사용 시간·사람 수 같은 조건도 확인해야 한다."
      ],
      "rubric": {
        "required": [
          "세 단계의 기록을 구별한다.",
          "계획만으로 이미 실천했다고 쓰지 않는다.",
          "전기 사용량과 비교 조건 등 효과를 확인할 자료를 제안한다."
        ],
        "teacherRequired": true
      }
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "3-13",
    "id": "c22-s62-u03-v034",
    "status": "authored",
    "kind": "st",
    "prompt": "교사가 정한 조립 순서에 맞게 기호를 배열하세요.",
    "givens": {
      "순서기준": "철심 보호→코일 감기→끝의 접점 준비→전원을 끈 상태에서 연결 점검",
      "카드": {
        "머리": [
          "기호",
          "내용"
        ],
        "행": [
          [
            "ㄱ",
            "전원이 꺼진 회로에 코일을 연결하고 점검한다."
          ],
          [
            "ㄴ",
            "미리 정한 두 끝의 절연을 교사가 준비한다."
          ],
          [
            "ㄷ",
            "철심에 보호용 종이테이프를 감는다."
          ],
          [
            "ㄹ",
            "그 위에 절연선을 한 방향으로 감는다."
          ]
        ]
      },
      "조건": "교사가 부품 정격을 확인한 저전압 교육용 장치이다. 연결을 바꿀 때는 스위치를 열고, 전지 양극을 전선만으로 직접 잇지 않는다. 가열하거나 피복을 태우지 않는다."
    },
    "responseContract": {
      "kind": "ordered-label-sequence",
      "teacherRequired": false,
      "sequence": [
        "ㄷ",
        "ㄹ",
        "ㄴ",
        "ㄱ"
      ]
    },
    "explanation": "먼저 철심을 보호하는 ㄷ, 그 위에 감는 ㄹ이 온다. 그다음 교사가 접점을 준비하는 ㄴ을 하고 전원이 꺼진 상태에서 연결하는 ㄱ을 한다. 가능한 모든 조립법을 하나로 단정하는 대신 문제에 제시한 순서 기준을 따른다.",
    "scope": "core",
    "type": "T08",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s3-questions",
        "set": 3,
        "no": 13
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "전자석 제작과 접점 준비",
      "inquirySkill": "전자석 제작과 접점 준비",
      "itemType": "ordered-label-sequence",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T08",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "short-text",
      "preparedStructuredContract": {
        "kind": "ordered-label-sequence",
        "teacherRequired": false,
        "sequence": [
          "ㄷ",
          "ㄹ",
          "ㄴ",
          "ㄱ"
        ]
      },
      "kind": "ordered-label-sequence",
      "teacherRequired": false,
      "sequence": [
        "ㄷ",
        "ㄹ",
        "ㄴ",
        "ㄱ"
      ],
      "seasonContract": {
        "kind": "ordered-label-sequence",
        "teacherRequired": false,
        "sequence": [
          "ㄷ",
          "ㄹ",
          "ㄴ",
          "ㄱ"
        ]
      },
      "answer": "ㄷ → ㄹ → ㄴ → ㄱ",
      "accepted": [
        "ㄷ → ㄹ → ㄴ → ㄱ"
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "3-14",
    "id": "c22-s62-u03-v035",
    "status": "authored",
    "kind": "mc",
    "prompt": "코일 양 끝의 접점만 준비하는 까닭을 고르세요.",
    "givens": {
      "상황": "절연 코일을 다 감은 뒤 교사가 양 끝의 작은 부분만 준비해 금속 집게와 닿게 한다. 감긴 부분의 절연은 유지한다.",
      "조건": "학생은 가열·불꽃·칼로 피복을 제거하지 않는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4
    },
    "explanation": "끝의 금속이 집게와 접촉해야 전기가 코일을 거쳐 흐를 수 있다. 감긴 부분은 절연을 유지해 이웃한 선끼리 뜻하지 않게 이어지지 않도록 한다. 코일 전체 피복 제거와 끝 접점 준비를 구별한다.",
    "scope": "core",
    "type": "T08",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s3-questions",
        "set": 3,
        "no": 14
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "코일 전체의 금속이 서로 닿게 피복을 없앤다.",
      "끝에서도 전기가 통하지 않게 두껍게 덮는다.",
      "철심을 가열해 모든 자석 성질을 없애 둔다.",
      "코일과 무관하게 전지 양극만 직접 잇는다.",
      "끝만 접촉시키고 코일은 절연한다."
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "전자석 제작과 접점 준비",
      "inquirySkill": "전자석 제작과 접점 준비",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T08",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 4
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 4
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "3-15",
    "id": "c22-s62-u03-v036",
    "status": "authored",
    "kind": "st",
    "prompt": "두 전지 조건의 세 번 기록을 합한 클립 수를 단위와 함께 쓰세요.",
    "givens": {
      "조건": "같은 철심·코일·클립·접근 거리·통전 시간을 사용한다. 교사가 허용한 한 개와 두 개의 전지만 비교하며, 두 개는 서로 다른 극끼리 한 줄로 연결한다. 교사 제공 연습 자료이다.",
      "기록": {
        "머리": [
          "전지 수",
          "1회",
          "2회",
          "3회"
        ],
        "행": [
          [
            "1개",
            "3개",
            "4개",
            "3개"
          ],
          [
            "2개",
            "7개",
            "8개",
            "7개"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "number-unit",
      "teacherRequired": false,
      "value": 22,
      "units": [
        "개"
      ],
      "unitRequired": true,
      "tolerance": 0
    },
    "explanation": "묻는 것은 두 전지 조건의 합계이므로7+8+7=22개이다. 한 번에22개를 들었다는 뜻이 아니라 세 번의 기록을 더한 값이다. 클립 수를 정확한 자기력 수치로 바꾸어 말하지 않는다.",
    "scope": "core",
    "type": "T07",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s3-questions",
        "set": 3,
        "no": 15
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "verificationModel": {
      "kind": "count-sum",
      "values": [
        7,
        8,
        7
      ],
      "expected": 22,
      "unit": "개"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "반복 기록과 수치 해석",
      "inquirySkill": "반복 기록과 수치 해석",
      "itemType": "number-unit",
      "track": "교과",
      "level": "기본",
      "element": "E5",
      "type": "T07",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "short-text",
      "preparedStructuredContract": {
        "kind": "number-unit",
        "teacherRequired": false,
        "value": 22,
        "units": [
          "개"
        ],
        "unitRequired": true,
        "tolerance": 0
      },
      "kind": "number-unit",
      "teacherRequired": false,
      "value": 22,
      "units": [
        "개"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "seasonContract": {
        "kind": "number-unit",
        "teacherRequired": false,
        "value": 22,
        "units": [
          "개"
        ],
        "unitRequired": true,
        "tolerance": 0
      },
      "answer": "22 개",
      "accepted": [
        "22 개"
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "3-16",
    "id": "c22-s62-u03-v037",
    "status": "authored",
    "kind": "mc",
    "prompt": "같은 전자석의 극이 바뀐 까닭으로 가장 알맞은 것을 고르세요.",
    "givens": {
      "기록": "철심·코일 감긴 방향·전지 수는 그대로 두었다. 전지의 연결 방향만 반대로 한 뒤 나침반으로 확인하니 같은 끝의 극이 바뀌었다.",
      "조건": "교사가 부품 정격을 확인한 저전압 교육용 장치이다. 연결을 바꿀 때는 스위치를 열고, 전지 양극을 전선만으로 직접 잇지 않는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
    },
    "explanation": "이 기록에서 바꾼 것은 전지 연결 방향이다. 같은 코일에서 전류 방향이 바뀌면 전자석의 극이 바뀔 수 있다. 전지 수나 감은 횟수를 바꿨다고 자료에 없는 원인을 덧붙이지 않는다.",
    "scope": "core",
    "type": "T11",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s3-questions",
        "set": 3,
        "no": 16
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "철심이 갑자기 다른 재료로 바뀌었다.",
      "전지 개수가 저절로 한 개 더 늘었다.",
      "코일에 흐르는 전류의 방향이 바뀌었다.",
      "나침반의 N극 표기를 S극으로 고쳤다.",
      "감긴 코일의 횟수가 저절로 줄어들었다."
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "나침반 관찰로 극 판단",
      "inquirySkill": "나침반 관찰로 극 판단",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E6",
      "type": "T11",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 2
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 2
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "3-17",
    "id": "c22-s62-u03-v038",
    "status": "authored",
    "kind": "es",
    "prompt": "클립 수의 차이를 전지 수 때문이라고 판단하기 전에, 이 계획에서 맞춰야 할 조건을 두 가지 쓰세요.",
    "givens": {
      "계획": {
        "머리": [
          "항목",
          "가",
          "나"
        ],
        "행": [
          [
            "전지 수",
            "1개",
            "2개"
          ],
          [
            "철심",
            "짧고 가는 것",
            "길고 굵은 것"
          ],
          [
            "코일",
            "20회 감음",
            "40회 감음"
          ],
          [
            "클립",
            "같은 종류",
            "같은 종류"
          ]
        ]
      },
      "조건": "전지 한 개와 두 개의 영향만 비교하려 한다. 부품 정격은 교사가 확인했다."
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "같은 철심을 쓰고 코일 감은 횟수도 같게 해야 한다. 지금은 전지 수와 함께 철심·코일도 달라 결과를 전지 수 하나의 영향이라고 정할 수 없다.",
      "required": [
        "철심 조건을 같게 한다.",
        "코일 조건을 같게 한다.",
        "여러 조건이 함께 달라 인과 판단이 어려움을 설명한다."
      ],
      "exactStringScoring": false
    },
    "explanation": "전지 수 외에 철심의 크기와 코일 감은 횟수가 함께 바뀌었다. 전지 수의 영향만 보려면 최소한 이 두 조건을 같게 맞춰야 한다. 클립을 더 들었더라도 현재 계획만으로 전지 수가 유일한 원인이라고 단정할 수 없다.",
    "scope": "core",
    "type": "T06",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s3-questions",
        "set": 3,
        "no": 17
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "변인 통제와 결론 한계 판단",
      "inquirySkill": "변인 통제와 결론 한계 판단",
      "itemType": "written-explanation",
      "track": "교과",
      "level": "기본",
      "element": "E5",
      "type": "T06",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "written-explanation",
      "preparedStructuredContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "같은 철심을 쓰고 코일 감은 횟수도 같게 해야 한다. 지금은 전지 수와 함께 철심·코일도 달라 결과를 전지 수 하나의 영향이라고 정할 수 없다.",
        "required": [
          "철심 조건을 같게 한다.",
          "코일 조건을 같게 한다.",
          "여러 조건이 함께 달라 인과 판단이 어려움을 설명한다."
        ],
        "exactStringScoring": false
      },
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "같은 철심을 쓰고 코일 감은 횟수도 같게 해야 한다. 지금은 전지 수와 함께 철심·코일도 달라 결과를 전지 수 하나의 영향이라고 정할 수 없다.",
      "required": [
        "철심 조건을 같게 한다.",
        "코일 조건을 같게 한다.",
        "여러 조건이 함께 달라 인과 판단이 어려움을 설명한다."
      ],
      "exactStringScoring": false,
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "같은 철심을 쓰고 코일 감은 횟수도 같게 해야 한다. 지금은 전지 수와 함께 철심·코일도 달라 결과를 전지 수 하나의 영향이라고 정할 수 없다.",
        "required": [
          "철심 조건을 같게 한다.",
          "코일 조건을 같게 한다.",
          "여러 조건이 함께 달라 인과 판단이 어려움을 설명한다."
        ],
        "exactStringScoring": false
      },
      "answer": "같은 철심을 쓰고 코일 감은 횟수도 같게 해야 한다. 지금은 전지 수와 함께 철심·코일도 달라 결과를 전지 수 하나의 영향이라고 정할 수 없다.",
      "accepted": [
        "같은 철심을 쓰고 코일 감은 횟수도 같게 해야 한다. 지금은 전지 수와 함께 철심·코일도 달라 결과를 전지 수 하나의 영향이라고 정할 수 없다."
      ],
      "rubric": {
        "required": [
          "철심 조건을 같게 한다.",
          "코일 조건을 같게 한다.",
          "여러 조건이 함께 달라 인과 판단이 어려움을 설명한다."
        ],
        "teacherRequired": true
      }
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "3-18",
    "id": "c22-s62-u03-v039",
    "status": "authored",
    "kind": "st",
    "prompt": "주어진 비교 조건에서 옳은 설명을 고르세요. (정답 2개)",
    "givens": {
      "조건": "전자석은 같은 철심·코일에서 허용된 한 개와 두 개 전지만 비교한다. 영구 자석은 전지에 연결하지 않는다. 약한 잔류 자성의 가능성은 남겨 둔다."
    },
    "responseContract": {
      "kind": "multi-choice",
      "teacherRequired": false,
      "answers": [
        3,
        4
      ]
    },
    "explanation": "전자석의 작용은 전류로 제어할 수 있고 영구 자석은 전지가 없어도 작용한다. 전지 수의 변화에 따른 세기와 연결 방향에 따른 극 변화는 구별한다. 전류를 끊으면 모든 철심의 자성이 반드시0이라는 추가 주장은 하지 않는다.",
    "scope": "core",
    "type": "T09",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s3-questions",
        "set": 3,
        "no": 18
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "전자석은 전류를 꺼도 언제나 같은 세기이다.",
      "전지 수를 늘리면 자석 극이 반드시 뒤집힌다.",
      "영구 자석은 전원을 켜야만 처음 작용한다.",
      "전자석은 전류를 켜고 끄며 작용을 조절한다.",
      "영구 자석은 전지 없이도 철을 끌어당길 수 있다."
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "전자석과 영구 자석 비교",
      "inquirySkill": "전자석과 영구 자석 비교",
      "itemType": "multi-choice",
      "track": "교과",
      "level": "기본",
      "element": "E6",
      "type": "T09",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "multi-choice",
      "preparedStructuredContract": {
        "kind": "multi-choice",
        "teacherRequired": false,
        "answers": [
          3,
          4
        ]
      },
      "kind": "multi-choice",
      "teacherRequired": false,
      "answers": [
        3,
        4
      ],
      "seasonContract": {
        "kind": "multi-choice",
        "teacherRequired": false,
        "answers": [
          3,
          4
        ]
      },
      "answer": "",
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "3-19",
    "id": "c22-s62-u03-v040",
    "status": "authored",
    "kind": "st",
    "prompt": "설명한 장치가 맡은 역할의 기호를 쓰세요.",
    "givens": {
      "구조": "알림 장치의 코일이 철편을 끌어당기고 놓는 동작을 반복하여 작은 종을 두드린다.",
      "역할": {
        "머리": [
          "기호",
          "역할"
        ],
        "행": [
          [
            "ㄱ",
            "철판을 오래 붙잡아 보관함"
          ],
          [
            "ㄴ",
            "종을 두드려 소리를 알림"
          ],
          [
            "ㄷ",
            "햇빛으로 전기를 만듦"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "제시된 철편은 종을 두드리는 역할을 하므로 ㄴ이다. 코일이 움직임을 만든다는 공통점만으로 다른 장치의 운반·보관 기능과 같게 묶지 않는다. 실제 구조가 주어진 알림 장치만 판단한다.",
    "scope": "core",
    "type": "T12",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s3-questions",
        "set": 3,
        "no": 19
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "실제 구조와 용도 연결",
      "inquirySkill": "실제 구조와 용도 연결",
      "itemType": "short-text",
      "track": "교과",
      "level": "기본",
      "element": "E7",
      "type": "T12",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "short-text",
      "preparedStructuredContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄴ"
        ]
      },
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄴ"
      ],
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄴ"
        ]
      },
      "answer": "ㄴ"
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "3-20",
    "id": "c22-s62-u03-v041",
    "status": "authored",
    "kind": "mc",
    "prompt": "전지 없이 자석의 성질을 이용한 물건을 고르세요.",
    "givens": {
      "조건": "각 물건의 실제 구조를 표에 적었다. 모든 종류의 같은 이름 제품으로 확대하지 않는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0
    },
    "explanation": "전지 없는 막대자석 게시판은 영구 자석을 이용한다. 나머지는 제시한 구조에서 코일의 전류로 자석 작용을 제어한다. 물건 이름에 대한 암기보다 실제로 명시된 구조와 전원 조건을 비교한다.",
    "scope": "core",
    "type": "T12",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s3-questions",
        "set": 3,
        "no": 20
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "전지 없는 막대자석 게시판",
      "전기 코일로 철을 드는 모형 기중기",
      "코일과 철편으로 종을 치는 알림기",
      "전기로 켠 코일로 잠그는 걸쇠",
      "전류를 바꿔 작동하는 교육용 전자석"
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "실제 구조와 용도 연결",
      "inquirySkill": "실제 구조와 용도 연결",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E7",
      "type": "T12",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 0
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 0
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "4-1",
    "id": "c22-s62-u03-v042",
    "status": "authored",
    "kind": "st",
    "prompt": "설명에서 부품을 이어 만든 전체 길의 이름을 쓰세요.",
    "givens": {
      "설명": "전지에서 시작해 전구와 스위치를 거쳐 전지로 돌아오는 길을 연결했다. 흐름의 이름인 전류가 아니라 연결된 전체 길의 이름을 묻는다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "전기 회로",
        "전기회로"
      ]
    },
    "explanation": "전지·전구·스위치 등을 이어 만든 길은 전기 회로이다. 전류는 전기가 흐르는 것을 뜻하므로 이 질문의 대상과 다르다. 부품 하나의 이름 대신 연결 전체의 이름을 쓴다.",
    "scope": "core",
    "type": "T01",
    "standards": [
      "6과15-01"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s4-questions",
        "set": 4,
        "no": 1
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "부품과 용어의 역할 구별",
      "inquirySkill": "부품과 용어의 역할 구별",
      "itemType": "short-text",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "type": "T01",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-01"
    },
    "answerContract": {
      "type": "short-text",
      "preparedStructuredContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "전기 회로",
          "전기회로"
        ]
      },
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "전기 회로",
        "전기회로"
      ],
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "전기 회로",
          "전기회로"
        ]
      },
      "answer": "전기 회로"
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "4-2",
    "id": "c22-s62-u03-v043",
    "status": "authored",
    "kind": "st",
    "prompt": "접점 카드를 읽고 켜질 수 있는 기호를 모두 쓰세요. (정답 2개)",
    "givens": {
      "조건": "같은 정상 필라멘트 전구와 전지 한 개이다. 금속은 접촉하고 유리는 전기가 잘 통하지 않는다. 적힌 접촉만 있다.",
      "카드": {
        "머리": [
          "기호",
          "전지 +극 쪽",
          "전지 −극 쪽"
        ],
        "행": [
          [
            "ㄱ",
            "전구 유리",
            "전구 바닥 금속"
          ],
          [
            "ㄴ",
            "전구 옆 금속",
            "전구 바닥 금속"
          ],
          [
            "ㄷ",
            "전구 바닥 금속",
            "연결 안 됨"
          ],
          [
            "ㄹ",
            "전구 바닥 금속",
            "전구 옆 금속"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "unordered-labels",
      "teacherRequired": false,
      "answers": [
        "ㄴ",
        "ㄹ"
      ]
    },
    "explanation": "ㄴ과 ㄹ은 전지 양극이 전구의 서로 다른 두 금속 접점에 이어진다. ㄱ은 유리가 접촉을 막고 ㄷ은 한쪽 연결이 없다. 좌우 방향이 달라도 실제 접점 조건이 같은 두 연결을 함께 고른다.",
    "scope": "core",
    "type": "T02",
    "standards": [
      "6과15-01"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s4-questions",
        "set": 4,
        "no": 2
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "접점과 닫힌 연결 판단",
      "inquirySkill": "접점과 닫힌 연결 판단",
      "itemType": "unordered-labels",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "type": "T02",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-01"
    },
    "answerContract": {
      "type": "short-text",
      "preparedStructuredContract": {
        "kind": "unordered-labels",
        "teacherRequired": false,
        "answers": [
          "ㄴ",
          "ㄹ"
        ]
      },
      "kind": "unordered-labels",
      "teacherRequired": false,
      "answers": [
        "ㄴ",
        "ㄹ"
      ],
      "seasonContract": {
        "kind": "unordered-labels",
        "teacherRequired": false,
        "answers": [
          "ㄴ",
          "ㄹ"
        ]
      },
      "answer": "ㄴ, ㄹ",
      "accepted": [
        "ㄴ, ㄹ"
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "4-3",
    "id": "c22-s62-u03-v044",
    "status": "authored",
    "kind": "mc",
    "prompt": "전구와 전선을 잇는 접점 재료로 알맞은 것을 고르세요.",
    "givens": {
      "상황": "교육용 회로에서 전구의 두 금속 접점을 전선과 연결하려 한다. 연결 자리에는 얇은 재료 조각을 끼운다.",
      "조건": "전지 양극끼리 직접 잇는 실험이 아니며, 전구를 거치는 회로이다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3
    },
    "explanation": "깨끗한 구리는 전기가 잘 통하므로 접점 사이의 연결 재료로 쓸 수 있다. 나머지는 제시한 마른 절연 재료이다. 재료 성질을 이용하되 전지 양극만 직접 연결하는 상황과 구별한다.",
    "scope": "core",
    "type": "T03",
    "standards": [
      "6과15-01"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s4-questions",
        "set": 4,
        "no": 3
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "마른 플라스틱 조각",
      "마른 고무 조각",
      "두꺼운 유리 조각",
      "깨끗한 구리 조각",
      "절연용 비닐 조각"
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "재료의 전도·절연 조건 해석",
      "inquirySkill": "재료의 전도·절연 조건 해석",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "type": "T03",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-01"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 3
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 3
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "4-4",
    "id": "c22-s62-u03-v045",
    "status": "authored",
    "kind": "mc",
    "prompt": "기록의 변화와 직접 연결되는 조작을 고르세요.",
    "givens": {
      "기록": "전지·전구·전선은 그대로 둔 상태에서 길이 끊어졌다가 다시 이어졌고, 전구가 꺼졌다 켜졌다.",
      "조건": "지정한 정상 부품 하나만 조작했다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
    },
    "explanation": "길을 열고 닫는 직접 조작은 스위치를 여닫는 것이다. 전지 방향이나 겉의 청소·판의 위치 변화는 정상 회로에서 이 기록의 연결 변화와 다르다. 전지를 공급 부품으로 유지한 채 회로의 연결 여부를 제어한다.",
    "scope": "core",
    "type": "T04",
    "standards": [
      "6과15-01"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s4-questions",
        "set": 4,
        "no": 4
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "전지의 연결 방향을 반대로 했다.",
      "스위치를 열었다 닫았다.",
      "전구의 유리를 마른 천으로 닦았다.",
      "전선 피복 위의 먼지를 닦았다.",
      "회로를 올린 판의 위치를 옮겼다."
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "스위치 조작과 변화 연결",
      "inquirySkill": "스위치 조작과 변화 연결",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "type": "T04",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-01"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 1
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 1
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "4-5",
    "id": "c22-s62-u03-v046",
    "status": "authored",
    "kind": "mc",
    "prompt": "켜질 조건을 확인하는 점검표에서 고쳐야 할 항목을 고르세요.",
    "givens": {
      "조건": "정상 필라멘트 전구 하나와 알맞은 전지 한 개를 사용한다. 전구의 두 금속 접점은 서로 구별된다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4
    },
    "explanation": "같은 전지 단자에만 전구의 두 접점을 잇는 항목을 고쳐야 한다. 전지의 서로 다른 극이 전구의 서로 다른 접점으로 이어져야 한다. 겉으로 닫힌 모양처럼 보여도 전기적 접속 관계를 확인해야 한다.",
    "scope": "core",
    "type": "T02",
    "standards": [
      "6과15-01"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s4-questions",
        "set": 4,
        "no": 5
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "전구의 옆 금속과 바닥 금속을 구별한다.",
      "전지의 +극과 −극이 어디인지 확인한다.",
      "전구를 거쳐 돌아오는 연결을 확인한다.",
      "집게가 피복 대신 금속에 닿았는지 확인한다.",
      "두 접점을 전지의 같은 극에만 잇는다."
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "접점과 닫힌 연결 판단",
      "inquirySkill": "접점과 닫힌 연결 판단",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "type": "T02",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-01"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 4
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 4
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "4-6",
    "id": "c22-s62-u03-v047",
    "status": "authored",
    "kind": "st",
    "prompt": "두 기록의 밝기 표시 차이를 단위와 함께 쓰세요.",
    "givens": {
      "조건": "같은 종류·상태의 새 전지를 사용한다. 전구 하나·전선·접점 상태는 같으며, 전지 두 개는 서로 다른 극끼리 이어 한 줄로 연결한다. 전구는 두 조건에 모두 알맞은 정격이다. 교사가 만든 밝기 센서 연습 기록이다. 센서 표시를 전구의 소비 전력으로 바꾸어 읽지 않는다.",
      "기록": {
        "머리": [
          "전지 수",
          "같은 위치 센서 표시"
        ],
        "행": [
          [
            "1개",
            "36 lx"
          ],
          [
            "2개",
            "59 lx"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "number-unit",
      "teacherRequired": false,
      "value": 23,
      "units": [
        "lx",
        "럭스"
      ],
      "unitRequired": true,
      "tolerance": 0
    },
    "explanation": "같은 위치의 표시 차이는59−36=23 lx이다. 이 값은 제시한 센서 표시의 차이이며 전구가 정확히 몇 배 밝다는 결론과 다르다. 관측 위치·전구 등 비교 조건을 유지한 연습 자료 안에서 계산한다.",
    "scope": "core",
    "type": "T07",
    "standards": [
      "6과15-02"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s4-questions",
        "set": 4,
        "no": 6
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "verificationModel": {
      "kind": "sensor-difference",
      "before": 36,
      "after": 59,
      "expected": 23,
      "unit": "lx"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "반복 기록과 수치 해석",
      "inquirySkill": "반복 기록과 수치 해석",
      "itemType": "number-unit",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T07",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-02"
    },
    "answerContract": {
      "type": "short-text",
      "preparedStructuredContract": {
        "kind": "number-unit",
        "teacherRequired": false,
        "value": 23,
        "units": [
          "lx",
          "럭스"
        ],
        "unitRequired": true,
        "tolerance": 0
      },
      "kind": "number-unit",
      "teacherRequired": false,
      "value": 23,
      "units": [
        "lx",
        "럭스"
      ],
      "unitRequired": true,
      "tolerance": 0,
      "seasonContract": {
        "kind": "number-unit",
        "teacherRequired": false,
        "value": 23,
        "units": [
          "lx",
          "럭스"
        ],
        "unitRequired": true,
        "tolerance": 0
      },
      "answer": "23 lx",
      "accepted": [
        "23 lx"
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "4-7",
    "id": "c22-s62-u03-v048",
    "status": "authored",
    "kind": "es",
    "prompt": "“전선 길이는 밝기에 절대로 영향을 주지 않는다”는 결론을 이 자료로 낼 수 있는지 설명하세요.",
    "givens": {
      "기록": "전지 한 개와 두 개의 밝기는 비교했지만, 전선 길이는 두 조건에서 같게 두었다.",
      "조건": "매우 짧고 굵기가 같은 연결선을 썼다. 길이가 다른 전선을 따로 비교한 기록은 없다."
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "낼 수 없다. 이 자료에서는 전선 길이를 바꾸지 않았으므로 길이의 영향을 시험하지 않았다. 길이가 다른 조건을 맞추어 따로 비교해야 한다.",
      "required": [
        "길이를 바꾸지 않은 통제 조건을 읽는다.",
        "시험하지 않은 변인의 영향을 없다고 단정하지 않는다.",
        "길이 외의 조건을 맞춘 별도 비교를 제안한다."
      ],
      "exactStringScoring": false
    },
    "explanation": "전선 길이가 같다는 것은 이번 비교에서 통제한 조건이다. 그것이 길이를 바꾸어도 영향이 없다는 검증은 아니다. 특히 길고 가는 전선에서는 영향이 생길 수 있으므로 절대적인 무영향 결론을 정답으로 삼지 않는다.",
    "scope": "core",
    "type": "T06",
    "standards": [
      "6과15-02"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s4-questions",
        "set": 4,
        "no": 7
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "변인 통제와 결론 한계 판단",
      "inquirySkill": "변인 통제와 결론 한계 판단",
      "itemType": "written-explanation",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T06",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-02"
    },
    "answerContract": {
      "type": "written-explanation",
      "preparedStructuredContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "낼 수 없다. 이 자료에서는 전선 길이를 바꾸지 않았으므로 길이의 영향을 시험하지 않았다. 길이가 다른 조건을 맞추어 따로 비교해야 한다.",
        "required": [
          "길이를 바꾸지 않은 통제 조건을 읽는다.",
          "시험하지 않은 변인의 영향을 없다고 단정하지 않는다.",
          "길이 외의 조건을 맞춘 별도 비교를 제안한다."
        ],
        "exactStringScoring": false
      },
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "낼 수 없다. 이 자료에서는 전선 길이를 바꾸지 않았으므로 길이의 영향을 시험하지 않았다. 길이가 다른 조건을 맞추어 따로 비교해야 한다.",
      "required": [
        "길이를 바꾸지 않은 통제 조건을 읽는다.",
        "시험하지 않은 변인의 영향을 없다고 단정하지 않는다.",
        "길이 외의 조건을 맞춘 별도 비교를 제안한다."
      ],
      "exactStringScoring": false,
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "낼 수 없다. 이 자료에서는 전선 길이를 바꾸지 않았으므로 길이의 영향을 시험하지 않았다. 길이가 다른 조건을 맞추어 따로 비교해야 한다.",
        "required": [
          "길이를 바꾸지 않은 통제 조건을 읽는다.",
          "시험하지 않은 변인의 영향을 없다고 단정하지 않는다.",
          "길이 외의 조건을 맞춘 별도 비교를 제안한다."
        ],
        "exactStringScoring": false
      },
      "answer": "낼 수 없다. 이 자료에서는 전선 길이를 바꾸지 않았으므로 길이의 영향을 시험하지 않았다. 길이가 다른 조건을 맞추어 따로 비교해야 한다.",
      "accepted": [
        "낼 수 없다. 이 자료에서는 전선 길이를 바꾸지 않았으므로 길이의 영향을 시험하지 않았다. 길이가 다른 조건을 맞추어 따로 비교해야 한다."
      ],
      "rubric": {
        "required": [
          "길이를 바꾸지 않은 통제 조건을 읽는다.",
          "시험하지 않은 변인의 영향을 없다고 단정하지 않는다.",
          "길이 외의 조건을 맞춘 별도 비교를 제안한다."
        ],
        "teacherRequired": true
      }
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "4-8",
    "id": "c22-s62-u03-v049",
    "status": "authored",
    "kind": "es",
    "prompt": "밝기 비교에서 어느 장치가 더 밝게 관찰됐는지 쓰고, 이 결과를 적용할 조건을 설명하세요.",
    "givens": {
      "조건": "같은 종류·상태의 새 전지를 사용한다. 전구 하나·전선·접점 상태는 같으며, 전지 두 개는 서로 다른 극끼리 이어 한 줄로 연결한다. 전구는 두 조건에 모두 알맞은 정격이다. 두 손전등 모형은 같은 전구와 반사판을 쓴다. 교사가 제공한 연습 관찰이다.",
      "기록": {
        "머리": [
          "장치",
          "전지",
          "밝기 기록"
        ],
        "행": [
          [
            "가",
            "1개",
            "비교 기준"
          ],
          [
            "나",
            "2개를 서로 돕는 한 줄로 연결",
            "가보다 밝음"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "나가 더 밝게 관찰됐다. 같은 전구·반사판과 같은 종류·상태의 전지라는 조건 안의 결과이며, 다른 정격의 손전등이나 전지를 계속 늘리는 경우로 확대할 수 없다.",
      "required": [
        "나를 기록과 연결한다.",
        "전지 연결 방식과 다른 조건의 일치를 사용한다.",
        "다른 정격·무제한 전지 증가로 확대하지 않는다."
      ],
      "exactStringScoring": false
    },
    "explanation": "표에는 나가 가보다 밝다고 적혀 있다. 같은 모형에서 전지 수만 달리하고 두 전지가 서로 돕게 연결했다는 조건을 함께 읽어야 한다. 실제 손전등의 다른 전구·회로·정격까지 같은 결과라고 단정하지 않는다.",
    "scope": "core",
    "type": "T05",
    "standards": [
      "6과15-02"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s4-questions",
        "set": 4,
        "no": 8
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "전지 한 개와 두 개의 조건 비교",
      "inquirySkill": "전지 한 개와 두 개의 조건 비교",
      "itemType": "written-explanation",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T05",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-02"
    },
    "answerContract": {
      "type": "written-explanation",
      "preparedStructuredContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "나가 더 밝게 관찰됐다. 같은 전구·반사판과 같은 종류·상태의 전지라는 조건 안의 결과이며, 다른 정격의 손전등이나 전지를 계속 늘리는 경우로 확대할 수 없다.",
        "required": [
          "나를 기록과 연결한다.",
          "전지 연결 방식과 다른 조건의 일치를 사용한다.",
          "다른 정격·무제한 전지 증가로 확대하지 않는다."
        ],
        "exactStringScoring": false
      },
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "나가 더 밝게 관찰됐다. 같은 전구·반사판과 같은 종류·상태의 전지라는 조건 안의 결과이며, 다른 정격의 손전등이나 전지를 계속 늘리는 경우로 확대할 수 없다.",
      "required": [
        "나를 기록과 연결한다.",
        "전지 연결 방식과 다른 조건의 일치를 사용한다.",
        "다른 정격·무제한 전지 증가로 확대하지 않는다."
      ],
      "exactStringScoring": false,
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "나가 더 밝게 관찰됐다. 같은 전구·반사판과 같은 종류·상태의 전지라는 조건 안의 결과이며, 다른 정격의 손전등이나 전지를 계속 늘리는 경우로 확대할 수 없다.",
        "required": [
          "나를 기록과 연결한다.",
          "전지 연결 방식과 다른 조건의 일치를 사용한다.",
          "다른 정격·무제한 전지 증가로 확대하지 않는다."
        ],
        "exactStringScoring": false
      },
      "answer": "나가 더 밝게 관찰됐다. 같은 전구·반사판과 같은 종류·상태의 전지라는 조건 안의 결과이며, 다른 정격의 손전등이나 전지를 계속 늘리는 경우로 확대할 수 없다.",
      "accepted": [
        "나가 더 밝게 관찰됐다. 같은 전구·반사판과 같은 종류·상태의 전지라는 조건 안의 결과이며, 다른 정격의 손전등이나 전지를 계속 늘리는 경우로 확대할 수 없다."
      ],
      "rubric": {
        "required": [
          "나를 기록과 연결한다.",
          "전지 연결 방식과 다른 조건의 일치를 사용한다.",
          "다른 정격·무제한 전지 증가로 확대하지 않는다."
        ],
        "teacherRequired": true
      }
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "4-12",
    "id": "c22-s62-u03-v050",
    "status": "authored",
    "kind": "mc",
    "prompt": "냉방 중 낭비를 줄이는 계획으로 알맞은 것을 고르세요.",
    "givens": {
      "조건": "사람이 있는 교실에서 필요한 환기는 따로 관리한다. 지금은 냉방을 켠 채 불필요하게 출입문을 오래 열어 둔 상황이다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
    },
    "explanation": "불필요하게 오래 열린 문을 닫으면 냉방된 공기가 계속 나가는 것을 줄일 수 있다. 필요한 환기는 별도로 관리한다는 조건이 있다. 절약을 이유로 환기를 영구적으로 막거나 냉난방을 동시에 켜는 계획과 다르다.",
    "scope": "core",
    "type": "T14",
    "standards": [
      "6과15-04"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s4-questions",
        "set": 4,
        "no": 12
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "찬 공기가 나가도록 문을 계속 고정한다.",
      "냉방과 난방을 같은 자리에서 함께 켠다.",
      "출입 뒤 문을 닫고 냉방 조건을 유지한다.",
      "빈 교실에서도 밤새 같은 냉방을 유지한다.",
      "환기가 필요해도 영원히 문을 봉해 둔다."
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "효율적 이용과 실천 점검",
      "inquirySkill": "효율적 이용과 실천 점검",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E8",
      "type": "T14",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-04"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 2
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 2
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "4-13",
    "id": "c22-s62-u03-v051",
    "status": "authored",
    "kind": "mc",
    "prompt": "이용 단계에서 전기를 직접 쓰지 않는 것을 고르세요.",
    "givens": {
      "조건": "제조 과정의 전기는 세지 않는다. 각 물건은 이름에 적힌 방식으로만 작동한다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0
    },
    "explanation": "종이 부채는 사람이 손으로 흔들어 바람을 만든다. 나머지는 이용 단계에서 전지를 포함한 전기 공급이 필요하다. 물건을 만들 때의 에너지와 사용할 때 직접 쓰는 에너지를 구별한다.",
    "scope": "core",
    "type": "T14",
    "standards": [
      "6과15-04"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s4-questions",
        "set": 4,
        "no": 13
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "손으로 흔드는 종이 부채",
      "콘센트로 쓰는 전기 선풍기",
      "전지를 넣어 켜는 손전등",
      "전원으로 작동하는 냉장고",
      "전기 모터로 도는 세탁기"
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "효율적 이용과 실천 점검",
      "inquirySkill": "효율적 이용과 실천 점검",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E8",
      "type": "T14",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-04"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 0
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 0
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "4-14",
    "id": "c22-s62-u03-v052",
    "status": "authored",
    "kind": "mc",
    "prompt": "플러그를 분리하는 방법으로 알맞은 것을 고르세요.",
    "givens": {
      "조건": "정상 기구를 사용한 뒤 손을 말리고 분리하려 한다. 손상이나 뜨거움이 보이면 만지지 않고 어른에게 알린다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3
    },
    "explanation": "정상 플러그는 전선 대신 몸체를 잡고 분리한다. 전선을 당기거나 금속 핀·콘센트 틈을 만지는 행동은 안전한 방법이 아니다. 손상·열이 보이는 경우는 이 정상 분리 조건에서 제외하고 어른에게 알린다.",
    "scope": "core",
    "type": "T13",
    "standards": [
      "6과15-04"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s4-questions",
        "set": 4,
        "no": 14
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "전선을 세게 당겨 플러그를 뺀다.",
      "금속 핀에 젖은 손을 먼저 댄다.",
      "칼로 콘센트 틈을 벌려 뺀다.",
      "플러그 몸체를 잡고 분리한다.",
      "다른 기구의 코드를 함께 잡아당긴다."
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "전기 안전 계획 판단",
      "inquirySkill": "전기 안전 계획 판단",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E8",
      "type": "T13",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-04"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 3
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 3
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "4-15",
    "id": "c22-s62-u03-v053",
    "status": "authored",
    "kind": "st",
    "prompt": "두 단서를 함께 만족하는 장치 이름을 쓰세요.",
    "givens": {
      "단서": {
        "머리": [
          "단서",
          "내용"
        ],
        "행": [
          [
            "만드는 방법",
            "철심 둘레에 절연 코일을 감아 회로에 연결함"
          ],
          [
            "제어 방법",
            "전류를 켜고 끄거나 연결 방향을 바꾸어 작용을 조절함"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "전자석"
      ]
    },
    "explanation": "철심과 코일을 쓰고 전류로 작용을 조절하는 장치는 전자석이다. 단순히 철을 끌어당긴다는 특징만으로 영구 자석과 같게 분류하지 않는다. 두 단서의 제작 구조와 제어 조건을 함께 확인한다.",
    "scope": "core",
    "type": "T08",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s4-questions",
        "set": 4,
        "no": 15
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "전자석 제작과 접점 준비",
      "inquirySkill": "전자석 제작과 접점 준비",
      "itemType": "short-text",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T08",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "short-text",
      "preparedStructuredContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "전자석"
        ]
      },
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "전자석"
      ],
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "전자석"
        ]
      },
      "answer": "전자석"
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "4-16",
    "id": "c22-s62-u03-v054",
    "status": "authored",
    "kind": "st",
    "prompt": "이미 감아 둔 코일을 점검하는 순서에 맞게 기호를 배열하세요.",
    "givens": {
      "순서기준": "전원 분리 확인→양 끝 접점 확인→회로 연결 점검→교사 확인 뒤 짧게 켜기",
      "카드": {
        "머리": [
          "기호",
          "내용"
        ],
        "행": [
          [
            "ㄱ",
            "전지와 분리돼 있고 스위치가 열린지 본다."
          ],
          [
            "ㄴ",
            "교사 확인 뒤 정해진 시간만 스위치를 닫는다."
          ],
          [
            "ㄷ",
            "양 끝을 올바른 회로 단자에 잇고 연결을 확인한다."
          ],
          [
            "ㄹ",
            "교사가 준비한 두 끝의 금속 접점을 확인한다."
          ]
        ]
      },
      "조건": "교사가 부품 정격을 확인한 저전압 교육용 장치이다. 연결을 바꿀 때는 스위치를 열고, 전지 양극을 전선만으로 직접 잇지 않는다. 감긴 부분의 피복을 벗기거나 철심을 가열하지 않는다."
    },
    "responseContract": {
      "kind": "ordered-label-sequence",
      "teacherRequired": false,
      "sequence": [
        "ㄱ",
        "ㄹ",
        "ㄷ",
        "ㄴ"
      ]
    },
    "explanation": "제시한 기준에 따라 먼저 전원 분리인 ㄱ을 확인한다. 접점 확인 ㄹ, 연결 점검 ㄷ을 거쳐 마지막에 교사 확인 뒤 켜는 ㄴ을 한다. 접점 작업이나 연결을 전원이 켜진 채 수행하는 순서로 바꾸지 않는다.",
    "scope": "core",
    "type": "T08",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s4-questions",
        "set": 4,
        "no": 16
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "전자석 제작과 접점 준비",
      "inquirySkill": "전자석 제작과 접점 준비",
      "itemType": "ordered-label-sequence",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T08",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "short-text",
      "preparedStructuredContract": {
        "kind": "ordered-label-sequence",
        "teacherRequired": false,
        "sequence": [
          "ㄱ",
          "ㄹ",
          "ㄷ",
          "ㄴ"
        ]
      },
      "kind": "ordered-label-sequence",
      "teacherRequired": false,
      "sequence": [
        "ㄱ",
        "ㄹ",
        "ㄷ",
        "ㄴ"
      ],
      "seasonContract": {
        "kind": "ordered-label-sequence",
        "teacherRequired": false,
        "sequence": [
          "ㄱ",
          "ㄹ",
          "ㄷ",
          "ㄴ"
        ]
      },
      "answer": "ㄱ → ㄹ → ㄷ → ㄴ",
      "accepted": [
        "ㄱ → ㄹ → ㄷ → ㄴ"
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "4-17",
    "id": "c22-s62-u03-v055",
    "status": "authored",
    "kind": "es",
    "prompt": "“클립을 더 가까이 댄 결과이므로 전자석 자체가 더 세졌다”는 결론을 검토하고 공정한 비교 방법을 쓰세요.",
    "givens": {
      "기록": {
        "머리": [
          "조건",
          "전지 수",
          "클립까지 거리",
          "붙은 클립"
        ],
        "행": [
          [
            "가",
            "1개",
            "8mm",
            "3개"
          ],
          [
            "나",
            "1개",
            "2mm",
            "6개"
          ]
        ]
      },
      "조건": "같은 철심·코일·클립을 쓴 교사 제공 연습 자료이다. 전지 수는 바꾸지 않았다."
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "거리가 달라졌으므로 전자석 자체의 세기가 증가했다고 단정할 수 없다. 세기를 비교하려면 클립의 접근 거리와 나머지 조건을 같게 두고 비교해야 한다.",
      "required": [
        "접근 거리가 달라졌음을 읽는다.",
        "끌어당긴 수만으로 전자석 자체 변화라고 단정하지 않는다.",
        "같은 거리의 비교 방법을 제안한다."
      ],
      "exactStringScoring": false
    },
    "explanation": "클립 수는3개에서6개로 늘었지만 거리도8mm에서2mm로 가까워졌다. 따라서 더 가까이 가져간 효과와 전자석 자체의 세기 변화를 구별해야 한다. 비교 거리와 클립·시간 등을 맞춘 뒤 판단해야 한다.",
    "scope": "core",
    "type": "T10",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s4-questions",
        "set": 4,
        "no": 17
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "verificationModel": {
      "kind": "confounded-distance",
      "cells": [
        1,
        1
      ],
      "distances": [
        8,
        2
      ],
      "counts": [
        3,
        6
      ],
      "strengthIncreaseProven": false
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "전자석 세기 비교의 근거",
      "inquirySkill": "전자석 세기 비교의 근거",
      "itemType": "written-explanation",
      "track": "교과",
      "level": "기본",
      "element": "E5",
      "type": "T10",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "written-explanation",
      "preparedStructuredContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "거리가 달라졌으므로 전자석 자체의 세기가 증가했다고 단정할 수 없다. 세기를 비교하려면 클립의 접근 거리와 나머지 조건을 같게 두고 비교해야 한다.",
        "required": [
          "접근 거리가 달라졌음을 읽는다.",
          "끌어당긴 수만으로 전자석 자체 변화라고 단정하지 않는다.",
          "같은 거리의 비교 방법을 제안한다."
        ],
        "exactStringScoring": false
      },
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "거리가 달라졌으므로 전자석 자체의 세기가 증가했다고 단정할 수 없다. 세기를 비교하려면 클립의 접근 거리와 나머지 조건을 같게 두고 비교해야 한다.",
      "required": [
        "접근 거리가 달라졌음을 읽는다.",
        "끌어당긴 수만으로 전자석 자체 변화라고 단정하지 않는다.",
        "같은 거리의 비교 방법을 제안한다."
      ],
      "exactStringScoring": false,
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "거리가 달라졌으므로 전자석 자체의 세기가 증가했다고 단정할 수 없다. 세기를 비교하려면 클립의 접근 거리와 나머지 조건을 같게 두고 비교해야 한다.",
        "required": [
          "접근 거리가 달라졌음을 읽는다.",
          "끌어당긴 수만으로 전자석 자체 변화라고 단정하지 않는다.",
          "같은 거리의 비교 방법을 제안한다."
        ],
        "exactStringScoring": false
      },
      "answer": "거리가 달라졌으므로 전자석 자체의 세기가 증가했다고 단정할 수 없다. 세기를 비교하려면 클립의 접근 거리와 나머지 조건을 같게 두고 비교해야 한다.",
      "accepted": [
        "거리가 달라졌으므로 전자석 자체의 세기가 증가했다고 단정할 수 없다. 세기를 비교하려면 클립의 접근 거리와 나머지 조건을 같게 두고 비교해야 한다."
      ],
      "rubric": {
        "required": [
          "접근 거리가 달라졌음을 읽는다.",
          "끌어당긴 수만으로 전자석 자체 변화라고 단정하지 않는다.",
          "같은 거리의 비교 방법을 제안한다."
        ],
        "teacherRequired": true
      }
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "4-18",
    "id": "c22-s62-u03-v056",
    "status": "authored",
    "kind": "es",
    "prompt": "철심·코일·전지 수를 유지하며 같은 끝의 극을 바꾸려 합니다. 방법과 확인할 관찰을 쓰세요.",
    "givens": {
      "조건": "교사가 부품 정격을 확인한 저전압 교육용 장치이다. 연결을 바꿀 때는 스위치를 열고, 전지 양극을 전선만으로 직접 잇지 않는다. 코일을 다시 감지 않는다. 극은 나침반의 확인된 N극과의 끌림·밀림으로 비교한다."
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "스위치를 열고 전지의 연결 방향을 반대로 바꾼 뒤 교사 확인을 받는다. 다시 짧게 켜 같은 끝이 나침반 N극을 끌던 것이 미는지 또는 미는 것이 끄는지 확인한다.",
      "required": [
        "전원 연결을 끈 상태에서 전지 방향을 반대로 바꾼다.",
        "코일·전지 수 등 고정 조건을 유지한다.",
        "같은 끝의 나침반 반응이 반대로 되는 관찰을 제안한다."
      ],
      "exactStringScoring": false
    },
    "explanation": "같은 코일에서 전지 연결 방향을 반대로 하면 전류 방향이 바뀌어 전자석의 극이 바뀐다. 나침반의 같은 N극과 비교해 끌림·밀림이 반대로 되는지 확인할 수 있다. 전지 수를 늘리는 방법을 극 반전과 같은 것으로 인정하지 않는다.",
    "scope": "core",
    "type": "T11",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s4-questions",
        "set": 4,
        "no": 18
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "나침반 관찰로 극 판단",
      "inquirySkill": "나침반 관찰로 극 판단",
      "itemType": "written-explanation",
      "track": "교과",
      "level": "기본",
      "element": "E6",
      "type": "T11",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "written-explanation",
      "preparedStructuredContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "스위치를 열고 전지의 연결 방향을 반대로 바꾼 뒤 교사 확인을 받는다. 다시 짧게 켜 같은 끝이 나침반 N극을 끌던 것이 미는지 또는 미는 것이 끄는지 확인한다.",
        "required": [
          "전원 연결을 끈 상태에서 전지 방향을 반대로 바꾼다.",
          "코일·전지 수 등 고정 조건을 유지한다.",
          "같은 끝의 나침반 반응이 반대로 되는 관찰을 제안한다."
        ],
        "exactStringScoring": false
      },
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "스위치를 열고 전지의 연결 방향을 반대로 바꾼 뒤 교사 확인을 받는다. 다시 짧게 켜 같은 끝이 나침반 N극을 끌던 것이 미는지 또는 미는 것이 끄는지 확인한다.",
      "required": [
        "전원 연결을 끈 상태에서 전지 방향을 반대로 바꾼다.",
        "코일·전지 수 등 고정 조건을 유지한다.",
        "같은 끝의 나침반 반응이 반대로 되는 관찰을 제안한다."
      ],
      "exactStringScoring": false,
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "스위치를 열고 전지의 연결 방향을 반대로 바꾼 뒤 교사 확인을 받는다. 다시 짧게 켜 같은 끝이 나침반 N극을 끌던 것이 미는지 또는 미는 것이 끄는지 확인한다.",
        "required": [
          "전원 연결을 끈 상태에서 전지 방향을 반대로 바꾼다.",
          "코일·전지 수 등 고정 조건을 유지한다.",
          "같은 끝의 나침반 반응이 반대로 되는 관찰을 제안한다."
        ],
        "exactStringScoring": false
      },
      "answer": "스위치를 열고 전지의 연결 방향을 반대로 바꾼 뒤 교사 확인을 받는다. 다시 짧게 켜 같은 끝이 나침반 N극을 끌던 것이 미는지 또는 미는 것이 끄는지 확인한다.",
      "accepted": [
        "스위치를 열고 전지의 연결 방향을 반대로 바꾼 뒤 교사 확인을 받는다. 다시 짧게 켜 같은 끝이 나침반 N극을 끌던 것이 미는지 또는 미는 것이 끄는지 확인한다."
      ],
      "rubric": {
        "required": [
          "전원 연결을 끈 상태에서 전지 방향을 반대로 바꾼다.",
          "코일·전지 수 등 고정 조건을 유지한다.",
          "같은 끝의 나침반 반응이 반대로 되는 관찰을 제안한다."
        ],
        "teacherRequired": true
      }
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "4-19",
    "id": "c22-s62-u03-v057",
    "status": "authored",
    "kind": "st",
    "prompt": "관찰표의 빈칸에 들어갈 극을 (1)·(2) 순서로 쓰세요.",
    "givens": {
      "기록": {
        "머리": [
          "전지 연결",
          "전자석 왼쪽 끝과 나침반 N극 반응",
          "왼쪽 끝의 극"
        ],
        "행": [
          [
            "처음",
            "서로 끌어당김",
            "(1)"
          ],
          [
            "반대로 연결",
            "서로 밀어냄",
            "(2)"
          ]
        ]
      },
      "조건": "같은 전자석의 연습 관찰이며 N극 표시는 확인했다. 코일 감긴 방향과 전지 수는 그대로이다."
    },
    "responseContract": {
      "kind": "ordered-term-parts",
      "teacherRequired": false,
      "parts": [
        {
          "label": "(1)",
          "kind": "short-text",
          "accepted": [
            "S극",
            "S 극",
            "에스극"
          ]
        },
        {
          "label": "(2)",
          "kind": "short-text",
          "accepted": [
            "N극",
            "N 극",
            "엔극"
          ]
        }
      ]
    },
    "explanation": "N극을 끌어당기는 처음 왼쪽 끝은 다른 극인 S극이다. 반대로 연결한 뒤 N극과 밀어내므로 그 끝은 N극이다. 관찰된 두 반응과 답 순서를 맞추며 전지 수 변화로 설명하지 않는다.",
    "scope": "core",
    "type": "T11",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s4-questions",
        "set": 4,
        "no": 19
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "나침반 관찰로 극 판단",
      "inquirySkill": "나침반 관찰로 극 판단",
      "itemType": "ordered-term-parts",
      "track": "교과",
      "level": "기본",
      "element": "E6",
      "type": "T11",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "short-text",
      "preparedStructuredContract": {
        "kind": "ordered-term-parts",
        "teacherRequired": false,
        "parts": [
          {
            "label": "(1)",
            "kind": "short-text",
            "accepted": [
              "S극",
              "S 극",
              "에스극"
            ]
          },
          {
            "label": "(2)",
            "kind": "short-text",
            "accepted": [
              "N극",
              "N 극",
              "엔극"
            ]
          }
        ]
      },
      "kind": "ordered-term-parts",
      "teacherRequired": false,
      "parts": [
        {
          "label": "(1)",
          "kind": "short-text",
          "accepted": [
            "S극",
            "S 극",
            "에스극"
          ]
        },
        {
          "label": "(2)",
          "kind": "short-text",
          "accepted": [
            "N극",
            "N 극",
            "엔극"
          ]
        }
      ],
      "seasonContract": {
        "kind": "ordered-term-parts",
        "teacherRequired": false,
        "parts": [
          {
            "label": "(1)",
            "kind": "short-text",
            "accepted": [
              "S극",
              "S 극",
              "에스극"
            ]
          },
          {
            "label": "(2)",
            "kind": "short-text",
            "accepted": [
              "N극",
              "N 극",
              "엔극"
            ]
          }
        ]
      },
      "answer": "S극, N극",
      "accepted": [
        "S극, N극"
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  },
  {
    "key": "4-20",
    "id": "c22-s62-u03-v058",
    "status": "authored",
    "kind": "mc",
    "prompt": "전기적 제어가 필요한 자석 장치의 용도를 고르세요.",
    "givens": {
      "요구": "철 조각을 들고 이동한 뒤 정해진 곳에서 놓아야 한다. 같은 장치에서 잡는 작용을 켜고 끄는 제어가 필요하다.",
      "조건": "교사가 구조를 확인한 모형 장치의 용도를 판단한다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
    },
    "explanation": "철 조각을 잡고 놓는 작용을 전기로 제어하려면 코일의 전류를 제어하는 전자석 장치가 목적에 맞는다. 영구 자석 게시판이나 다른 방식의 장치는 제시한 전기적 제어 조건과 다르다. 모든 기중기나 모든 운반 장치가 같은 구조라고 확대하지 않는다.",
    "scope": "core",
    "type": "T12",
    "standards": [
      "6과15-03"
    ],
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-electric-s4-questions",
        "set": 4,
        "no": 20
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "releaseReady": false,
    "evidence": {
      "actualStudentObservation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; render-and-runtime-review-pending"
    },
    "choices": [
      "전지 없이 쓰는 자석식 게시판",
      "코일로 철을 드는 운반 장치",
      "손잡이로 여닫는 나무 상자",
      "고무줄로만 움직이는 종이 수레",
      "햇빛으로 물을 데우는 검은 통"
    ],
    "taxonomy": {
      "domain": "운동과 에너지",
      "topic": "전기의 이용",
      "concept": "실제 구조와 용도 연결",
      "inquirySkill": "실제 구조와 용도 연결",
      "itemType": "single-choice",
      "track": "교과",
      "level": "기본",
      "element": "E7",
      "type": "T12",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "standard": "6과15-03"
    },
    "answerContract": {
      "type": "single-choice",
      "preparedStructuredContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 1
      },
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1,
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 1
      },
      "accepted": [
        ""
      ]
    },
    "variantRules": {
      "persisted": true,
      "randomGeneration": false,
      "requiredConditions": [
        "접점과 극 표시를 유지한다.",
        "전지·전구·코일의 정격과 비교 조건을 유지한다.",
        "연습 자료를 실제 학생 관측으로 표기하지 않는다."
      ],
      "sourceScope": "core-only"
    }
  }
];
export const source=[];
export const similar=[];
