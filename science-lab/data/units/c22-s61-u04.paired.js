export const unit = {
  "id": "c22-s61-u04",
  "course": "6-1",
  "no": 4,
  "title": "지구의 운동",
  "domain": "지구와 우주",
  "sources": {
    "originalExamAvailable": false,
    "scope": "현행 범위 독립 연습39. 원문과 공식 답은 이 모듈에 포함하지 않는다.",
    "guidance": "지표 남쪽 관측자와 모형 밖 관점을 구별하고 날짜·시각·방향을 확인해요."
  }
};
export const items = [
  {
    "key": "1-1",
    "id": "c22-s61-u04-v001",
    "status": "authored",
    "kind": "mc",
    "prompt": "같은 날 같은 자리에서 남쪽을 향해 살펴본 태양 위치의 연습 기록입니다. 기록과 지구의 운동을 바르게 연결한 설명을 두 개 고르세요.",
    "givens": {
      "관찰 종류": "실제 학생 관측이 아닌 위치 변화 연습 기록",
      "기록": {
        "머리": [
          "시각",
          "태양 위치"
        ],
        "행": [
          [
            "오전",
            "남쪽을 향했을 때 왼쪽 하늘"
          ],
          [
            "낮",
            "남쪽 하늘"
          ],
          [
            "오후",
            "남쪽을 향했을 때 오른쪽 하늘"
          ]
        ]
      },
      "방위": "남쪽을 볼 때 왼쪽은 동쪽, 오른쪽은 서쪽이다."
    },
    "choices": [
      "오후에는 태양이 서쪽 쪽에 있으므로 지구는 공전을 멈춘다.",
      "태양이 동쪽 쪽에서 서쪽 쪽으로 움직이는 것처럼 보인 기록이다.",
      "태양이 지구 둘레를 하루에 한 바퀴 공전했다는 실측 증거다.",
      "여름에는 이 하루 이동 방향이 반대로 바뀐다.",
      "지구의 서쪽에서 동쪽으로 도는 자전과 연결하여 설명할 수 있다."
    ],
    "responseContract": {
      "kind": "multi-choice",
      "answers": [
        1,
        4
      ]
    },
    "explanation": "기록은 오전에 동쪽 쪽, 낮에 남쪽 쪽, 오후에 서쪽 쪽으로 달라지는 겉보기 위치다. 이 하루 변화는 지구가 서쪽에서 동쪽으로 자전하는 것과 연결된다. 계절에 따라 같은 하루 이동 방향이 뒤집히거나 태양의 지구 둘레 공전을 실측했다고 결론내릴 수는 없다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set1-questions",
        "set": 1,
        "no": 1
      }
    },
    "standards": [
      "6과12-01",
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T01",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "하루 위치 변화와 원인",
      "inquirySkill": "위치 기록의 시간 범위와 원인 추론",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T01",
      "format": "복수 선택",
      "standard": "6과12-01"
    },
    "answerContract": {
      "type": "multi-choice",
      "earthMotionContract": {
        "kind": "multi-choice",
        "answers": [
          1,
          4
        ]
      },
      "answers": [
        1,
        4
      ]
    }
  },
  {
    "key": "1-3",
    "id": "c22-s61-u04-v002",
    "status": "authored",
    "kind": "st",
    "prompt": "불투명한 공에 세 지점을 표시했습니다. 태양에 해당하는 광원이 왼쪽에서만 비출 때 밤의 한가운데를 나타내는 지점의 기호를 쓰세요. 빛과 어둠의 경계는 고르지 않습니다.",
    "givens": {
      "조건": "주변 광원은 없다고 단순화한 모형이다. 왼쪽 광원은 고정한다.",
      "지점": {
        "머리": [
          "기호",
          "공 표면의 위치"
        ],
        "행": [
          [
            "ㄱ",
            "광원 쪽 정면"
          ],
          [
            "ㄴ",
            "광원과 직각 방향의 옆면"
          ],
          [
            "ㄷ",
            "광원 반대쪽 정면"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "short-text",
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "ㄱ은 광원을 향한 왼쪽 면이고 ㄴ은 빛/어둠의 경계에 있다. ㄷ은 광원과 정반대인 오른쪽 표면이므로 빛을 직접 받지 않는다. 밤의 한가운데에 대응하는 지점은 ㄷ이다. 경계인 ㄴ을 밤 한가운데와 구별해야 한다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set1-questions",
        "set": 1,
        "no": 3
      }
    },
    "standards": [
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "illumination",
      "sunVector": [
        -1,
        0,
        0
      ],
      "points": {
        "ㄱ": [
          -1,
          0,
          0
        ],
        "ㄴ": [
          0,
          1,
          0
        ],
        "ㄷ": [
          1,
          0,
          0
        ]
      },
      "task": "night-center",
      "expected": "ㄷ"
    },
    "type": "T02",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "빛 받는 면과 낮·밤",
      "inquirySkill": "표면 위치/빛 관계와 낮밤 원인",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T02",
      "format": "단답형",
      "standard": "6과12-02"
    },
    "answerContract": {
      "type": "short-text",
      "earthMotionContract": {
        "kind": "short-text",
        "accepted": [
          "ㄷ"
        ]
      },
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    }
  },
  {
    "key": "1-4",
    "id": "c22-s61-u04-v003",
    "status": "authored",
    "kind": "sc",
    "prompt": "북극 위에서 지구의 중심을 내려다본다고 정했습니다. 지구의 자전을 올바르게 나타낸 모형 설명을 고르세요.",
    "givens": {},
    "choices": [
      "기울어진 자전축을 중심으로 일 년에 한 바퀴 반시계 방향으로 돌린다.",
      "기울어진 자전축을 중심으로 하루에 한 바퀴 시계 방향으로 돌린다.",
      "기울어진 자전축을 중심으로 하루에 한 바퀴 반시계 방향으로 돌린다.",
      "태양 모형을 중심으로 하루에 한 바퀴 반시계 방향으로 옮긴다.",
      "달 모형을 중심으로 하루에 한 바퀴 시계 방향으로 옮긴다."
    ],
    "responseContract": {
      "kind": "single-choice",
      "answer": 2
    },
    "explanation": "자전은 태양 둘레 이동이 아니라 자전축 중심의 하루 회전이다. 북극 위에서 중심을 내려다본다는 조건에서는 반시계 방향이다. 관찰 방향을 먼저 고정했기 때문에 시계/반시계 표현의 뜻이 모호하지 않다. 축의 기울기는 돌리는 동안 유지한다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set1-questions",
        "set": 1,
        "no": 4
      }
    },
    "standards": [
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T03",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "자전 정의·방향·주기",
      "inquirySkill": "회전 중심·기간·관찰 방향 구별",
      "itemType": "sc",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T03",
      "format": "객관식",
      "standard": "6과12-02"
    },
    "answerContract": {
      "type": "single-choice",
      "earthMotionContract": {
        "kind": "single-choice",
        "answer": 2
      },
      "answer": 2
    }
  },
  {
    "key": "1-5",
    "id": "c22-s61-u04-v004",
    "status": "authored",
    "kind": "sc",
    "prompt": "배치표처럼 모형을 놓았습니다. 지구가 태양 왼쪽에 있을 때 한밤 관측자가 정면으로 보는 카드와 이유를 고르세요.",
    "givens": {
      "모형 조건": "모형판을 위에서 내려다본다. 가운데 태양 모형과 바깥 네 카드는 고정한다. 한밤 관측자의 정면은 태양 반대쪽 바깥을 향하도록 맞춘다. 실제 밤하늘 전체가 한 카드라는 뜻은 아니다.",
      "카드 배치": {
        "머리": [
          "판에서의 위치",
          "카드"
        ],
        "행": [
          [
            "위쪽",
            "ㄱ"
          ],
          [
            "오른쪽",
            "ㄴ"
          ],
          [
            "아래쪽",
            "ㄷ"
          ],
          [
            "왼쪽",
            "ㄹ"
          ]
        ]
      },
      "지구 모형 위치": "태양의 왼쪽"
    },
    "choices": [
      "ㄴ, 태양과 같은 방향인 오른쪽을 보기 때문이다.",
      "ㄱ, 지구 위치와 관계없이 판 위쪽만 보기 때문이다.",
      "ㄷ, 자전할 때 태양도 아래쪽으로 옮기기 때문이다.",
      "ㄴ, 한밤에는 관측자가 반드시 태양을 향하기 때문이다.",
      "ㄹ, 태양을 등지고 왼쪽 바깥을 보기 때문이다."
    ],
    "responseContract": {
      "kind": "single-choice",
      "answer": 4
    },
    "explanation": "지구가 중앙 태양의 왼쪽에 있으면 태양은 지구의 오른쪽에 있다. 한밤 관측자의 정면은 태양 반대쪽인 왼쪽 바깥을 향한다. 배치표의 왼쪽 카드는 ㄹ이다. 한밤 시선과 카드 위치를 함께 읽어야 하며 태양 쪽의 ㄴ을 고르면 낮 방향과 혼동한 것이다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set1-questions",
        "set": 1,
        "no": 5
      }
    },
    "standards": [
      "6과12-03"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "midnight-card",
      "earth": [
        -1,
        0
      ],
      "cards": {
        "ㄱ": [
          0,
          1
        ],
        "ㄴ": [
          1,
          0
        ],
        "ㄷ": [
          0,
          -1
        ],
        "ㄹ": [
          -1,
          0
        ]
      },
      "expected": "ㄹ"
    },
    "type": "T05",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "공전 모형의 한밤 시선",
      "inquirySkill": "공간 배치·태양 반대 방향 해석",
      "itemType": "sc",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T05",
      "format": "객관식",
      "standard": "6과12-03"
    },
    "answerContract": {
      "type": "single-choice",
      "earthMotionContract": {
        "kind": "single-choice",
        "answer": 4
      },
      "answer": 4
    }
  },
  {
    "key": "1-6",
    "id": "c22-s61-u04-v005",
    "status": "authored",
    "kind": "mc",
    "prompt": "먼 별을 나타내는 카드는 제자리에 두고 지구 모형만 중앙 태양 둘레의 네 위치로 옮겼습니다. 각 위치에서 한밤 시선을 맞춰 비교할 때 옳은 설명을 두 개 고르세요.",
    "givens": {
      "조건": "각 위치에서 관측자의 정면은 태양 반대쪽 바깥을 향한다. 카드의 실제 천체 거리·크기는 재현하지 않는다."
    },
    "choices": [
      "태양 둘레의 지구 위치가 달라지면 한밤에 정면으로 보는 카드가 달라질 수 있다.",
      "카드 자체를 한 바퀴 돌렸으므로 계절별 별자리가 달라졌다고 설명한다.",
      "지구 모형의 축 중심 회전 한 바퀴는 일 년의 공전이다.",
      "태양과 같은 방향의 별자리는 낮의 밝기 때문에 관찰하기 어렵다는 설명과 연결한다.",
      "이 모형으로 우리 반 학생이 네 계절 야외 관측을 실제로 마쳤다고 확인한다."
    ],
    "responseContract": {
      "kind": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "이 비교에서 바꾼 것은 태양 둘레의 지구 위치이고 별 카드는 고정했다. 한밤의 시선이 달라지는 것을 계절별 별자리 차이와 연결할 수 있다. 태양 방향의 별은 낮의 밝기 때문에 보기 어렵다. 카드 자체의 공전이나 실제 학생 관측 완료는 이 조작으로 확인한 사실이 아니다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set1-questions",
        "set": 1,
        "no": 6
      }
    },
    "standards": [
      "6과12-03"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T05",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "공전 모형의 한밤 시선",
      "inquirySkill": "공간 배치·태양 반대 방향 해석",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T05",
      "format": "복수 선택",
      "standard": "6과12-03"
    },
    "answerContract": {
      "type": "multi-choice",
      "earthMotionContract": {
        "kind": "multi-choice",
        "answers": [
          0,
          3
        ]
      },
      "answers": [
        0,
        3
      ]
    }
  },
  {
    "key": "2-1",
    "id": "c22-s61-u04-v006",
    "status": "authored",
    "kind": "st",
    "prompt": "모형 A는 중심을 옮기지 않고 기울어진 축 주위로 한 바퀴 돌렸고, 모형 B는 중앙 광원 둘레의 다른 자리로 옮겼습니다. A가 나타내는 지구의 운동 이름을 쓰세요.",
    "givens": {
      "A": "축 중심 한 바퀴를 하루로 대응시킨다.",
      "B": "중앙 광원은 태양에 대응시킨다."
    },
    "responseContract": {
      "kind": "short-text",
      "accepted": [
        "자전",
        "지구의 자전",
        "지구 자전"
      ]
    },
    "explanation": "A는 지구의 중심 위치를 바꾸지 않고 자전축 주위로 회전시킨 조작이다. 이는 자전이다. B처럼 태양 모형 둘레의 위치를 옮기는 공전과 구별한다. 두 모형이 모두 움직인다는 말만으로 같은 운동이라고 할 수 없다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set2-questions",
        "set": 2,
        "no": 1
      }
    },
    "standards": [
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T03",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "자전 정의·방향·주기",
      "inquirySkill": "회전 중심·기간·관찰 방향 구별",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T03",
      "format": "단답형",
      "standard": "6과12-02"
    },
    "answerContract": {
      "type": "short-text",
      "earthMotionContract": {
        "kind": "short-text",
        "accepted": [
          "자전",
          "지구의 자전",
          "지구 자전"
        ]
      },
      "answer": "자전",
      "accepted": [
        "자전",
        "지구의 자전",
        "지구 자전"
      ]
    }
  },
  {
    "key": "2-2",
    "id": "c22-s61-u04-v007",
    "status": "authored",
    "kind": "st",
    "prompt": "지구 모형의 관측자는 남쪽을 향하고 있습니다. 광원은 그대로 두고 지구 모형을 서쪽에서 동쪽으로 돌리면 관측자가 기록할 광원의 겉보기 방향은 무엇인가요? 보기의 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 서쪽에서 동쪽",
        "ㄴ. 북쪽에서 남쪽",
        "ㄷ. 동쪽에서 서쪽"
      ]
    },
    "responseContract": {
      "kind": "short-text",
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "지구 모형과 함께 관측자의 시선은 서쪽에서 동쪽으로 돌아간다. 고정한 광원은 그 관측자에게 반대인 동쪽에서 서쪽으로 위치가 바뀌는 것처럼 보인다. 따라서 ㄷ이다. 교실 바깥 관찰자에게 전등이 정지한 사실과 지구 모형 위 관측자의 기록을 구별한다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set2-questions",
        "set": 2,
        "no": 2
      }
    },
    "standards": [
      "6과12-01",
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T04",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "지표 관측자의 겉보기 운동",
      "inquirySkill": "관측자 시선과 바깥 관점 전환",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T04",
      "format": "단답형",
      "standard": "6과12-01"
    },
    "answerContract": {
      "type": "short-text",
      "earthMotionContract": {
        "kind": "short-text",
        "accepted": [
          "ㄷ"
        ]
      },
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    }
  },
  {
    "key": "2-3",
    "id": "c22-s61-u04-v008",
    "status": "authored",
    "kind": "st",
    "prompt": "관측 자료 설명 카드가 말하는 운동을 보기에서 찾아 기호를 쓰세요.",
    "givens": {
      "설명 카드": "지구가 북극과 남극을 잇는 축을 중심으로 하루에 한 바퀴씩 스스로 돈다.",
      "보기": [
        "ㄱ. 지구의 공전",
        "ㄴ. 지구의 자전",
        "ㄷ. 태양의 공전"
      ]
    },
    "responseContract": {
      "kind": "short-text",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "카드는 지구가 태양 둘레를 옮겨 가는 운동이 아니라 기울어진 자전축을 중심으로 하루에 한 바퀴 도는 운동을 설명한다. 따라서 지구 자전인 ㄴ이다. 회전 중심과 기간을 함께 읽으면 공전과 구별할 수 있다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set2-questions",
        "set": 2,
        "no": 3
      }
    },
    "standards": [
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T03",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "자전 정의·방향·주기",
      "inquirySkill": "회전 중심·기간·관찰 방향 구별",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T03",
      "format": "단답형",
      "standard": "6과12-02"
    },
    "answerContract": {
      "type": "short-text",
      "earthMotionContract": {
        "kind": "short-text",
        "accepted": [
          "ㄴ"
        ]
      },
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    }
  },
  {
    "key": "2-7",
    "id": "c22-s61-u04-v009",
    "status": "authored",
    "kind": "mc",
    "prompt": "자전 모형을 검토한 메모입니다. 옳지 않은 메모 두 개를 고르세요. 관찰 방향은 북극 위에서 지구 중심을 내려다보는 것으로 정했습니다.",
    "givens": {
      "실험 조건": "지구 중심과 태양 모형은 고정하고 축 중심 회전만 한다. 지표 관측자는 우리나라 위치에서 남쪽을 향한다. 시계/반시계 표시는 모형 밖 북극 위 관점이며 지표 관측자의 동서와 구별한다."
    },
    "choices": [
      "기울어진 축을 중심으로 서쪽에서 동쪽으로 회전시키는 것은 자전에 대응한다.",
      "북극 위에서 보면 지구 모형의 자전 방향은 반시계 방향이다.",
      "지표 관측자에게 고정 광원은 동쪽에서 서쪽으로 움직이는 것처럼 보인다.",
      "지구 모형 자체를 축 주위로 돌리는 조작만으로 태양 둘레 공전을 나타냈다.",
      "같은 지표 관측자에게 광원도 지구 자전과 같은 서쪽에서 동쪽 방향으로 움직여 보인다."
    ],
    "responseContract": {
      "kind": "multi-choice",
      "answers": [
        3,
        4
      ]
    },
    "explanation": "축 중심 회전은 자전에 대응하므로 그 조작만을 공전이라고 한 메모가 틀리다. 또 고정 광원의 겉보기 이동은 지표 관측자의 회전 방향과 반대다. 북극 위라는 관점을 명시한 반시계 방향의 설명은 이 조건에서 맞다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set2-questions",
        "set": 2,
        "no": 7
      }
    },
    "standards": [
      "6과12-01",
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T04",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "지표 관측자의 겉보기 운동",
      "inquirySkill": "관측자 시선과 바깥 관점 전환",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T04",
      "format": "복수 선택",
      "standard": "6과12-01"
    },
    "answerContract": {
      "type": "multi-choice",
      "earthMotionContract": {
        "kind": "multi-choice",
        "answers": [
          3,
          4
        ]
      },
      "answers": [
        3,
        4
      ]
    }
  },
  {
    "key": "2-8",
    "id": "c22-s61-u04-v010",
    "status": "authored",
    "kind": "st",
    "prompt": "같은 지역을 나타내는 점이 회전하면서 아래 두 상태를 차례로 지났습니다. ㉠과 ㉡에 해당하는 낮 또는 밤을 각각 쓰세요.",
    "givens": {
      "㉠": "고정 광원의 반대쪽 표면에 있는 상태",
      "㉡": "그 뒤 회전하여 고정 광원을 향한 표면에 있는 상태"
    },
    "responseContract": {
      "kind": "ordered-word-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "밤"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "낮"
          ]
        }
      ]
    },
    "explanation": "㉠은 태양 모형 반대쪽에 있어 빛을 직접 받지 않으므로 밤이다. ㉡은 광원을 향해 빛을 받으므로 낮이다. 따라서 밤·낮의 순서다. 두 낱말이 모두 있어도 각 상태와 반대로 연결하면 맞는 답이 아니다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set2-questions",
        "set": 2,
        "no": 8
      }
    },
    "standards": [
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T02",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "빛 받는 면과 낮·밤",
      "inquirySkill": "표면 위치/빛 관계와 낮밤 원인",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T02",
      "format": "단답형",
      "standard": "6과12-02"
    },
    "answerContract": {
      "type": "short-text",
      "earthMotionContract": {
        "kind": "ordered-word-parts",
        "parts": [
          {
            "label": "㉠",
            "accepted": [
              "밤"
            ]
          },
          {
            "label": "㉡",
            "accepted": [
              "낮"
            ]
          }
        ]
      },
      "answer": "㉠ 밤 / ㉡ 낮",
      "accepted": []
    }
  },
  {
    "key": "2-9",
    "id": "c22-s61-u04-v011",
    "status": "authored",
    "kind": "sc",
    "prompt": "밤이 생긴 까닭에 대한 친구들의 설명 중 지구의 운동과 빛을 올바르게 연결한 것을 고르세요.",
    "givens": {},
    "choices": [
      "자전하여 우리 지역이 태양의 반대쪽을 향하게 되었다.",
      "태양이 저녁마다 빛을 내는 일을 멈췄다.",
      "달이 매일 지구 전체를 가려 햇빛을 막았다.",
      "우리나라가 밤이 되면 지구의 모든 나라가 같은 순간 밤이 된다.",
      "태양 둘레를 한 번 공전하는 동안에만 밤이 한 번 생긴다."
    ],
    "responseContract": {
      "kind": "single-choice",
      "answer": 0
    },
    "explanation": "지구 자전으로 같은 지역이 태양빛을 받는 쪽과 반대쪽을 번갈아 지난다. 빛을 직접 받지 않는 쪽으로 돌아가면 그 지역은 밤이다. 태양이 매일 꺼지거나 달이 지구 전체를 매일 가리는 현상으로 낮밤을 설명하지 않는다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set2-questions",
        "set": 2,
        "no": 9
      }
    },
    "standards": [
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T02",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "빛 받는 면과 낮·밤",
      "inquirySkill": "표면 위치/빛 관계와 낮밤 원인",
      "itemType": "sc",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T02",
      "format": "객관식",
      "standard": "6과12-02"
    },
    "answerContract": {
      "type": "single-choice",
      "earthMotionContract": {
        "kind": "single-choice",
        "answer": 0
      },
      "answer": 0
    }
  },
  {
    "key": "2-10",
    "id": "c22-s61-u04-v012",
    "status": "authored",
    "kind": "sc",
    "prompt": "네 위치에서 한밤 시선을 맞춘 교실 모형 기록을 검토했습니다. 배치표를 근거로 옳은 설명을 고르세요.",
    "givens": {
      "모형 조건": "모형판을 위에서 내려다본다. 가운데 태양 모형과 바깥 네 카드는 고정한다. 한밤 관측자의 정면은 태양 반대쪽 바깥을 향하도록 맞춘다. 실제 밤하늘 전체가 한 카드라는 뜻은 아니다.",
      "카드 배치": {
        "머리": [
          "판에서의 위치",
          "카드"
        ],
        "행": [
          [
            "위쪽",
            "게시판"
          ],
          [
            "오른쪽",
            "창문"
          ],
          [
            "아래쪽",
            "칠판"
          ],
          [
            "왼쪽",
            "서가"
          ]
        ]
      },
      "지구 모형 위치": "태양의 위쪽·오른쪽·아래쪽·왼쪽으로 차례로 이동"
    },
    "choices": [
      "한밤 정면은 항상 태양 쪽이므로 네 위치에서 같은 광원만 보인다.",
      "지구 모형 위치에 따라 한밤에 정면으로 보는 벽이 달라진다.",
      "오른쪽과 왼쪽 위치는 한밤 정면이 같은 벽을 향한다.",
      "위쪽과 아래쪽 위치는 한밤 정면이 같은 벽을 향한다.",
      "벽이 지구 모형 둘레를 실제로 공전했기 때문에 보이는 벽이 달라졌다."
    ],
    "responseContract": {
      "kind": "single-choice",
      "answer": 1
    },
    "explanation": "한밤 관측자의 정면은 중앙 태양 반대쪽이다. 지구 모형이 위·오른쪽·아래·왼쪽으로 옮겨지면 바깥을 향하는 방향도 달라져 각 벽을 보게 된다. 벽이나 광원을 옮긴 것이 아니라 지구의 태양 둘레 위치가 달라진 결과다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set2-questions",
        "set": 2,
        "no": 10
      }
    },
    "standards": [
      "6과12-03"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T05",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "공전 모형의 한밤 시선",
      "inquirySkill": "공간 배치·태양 반대 방향 해석",
      "itemType": "sc",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T05",
      "format": "객관식",
      "standard": "6과12-03"
    },
    "answerContract": {
      "type": "single-choice",
      "earthMotionContract": {
        "kind": "single-choice",
        "answer": 1
      },
      "answer": 1
    }
  },
  {
    "key": "2-11",
    "id": "c22-s61-u04-v013",
    "status": "authored",
    "kind": "sc",
    "prompt": "전등 둘레의 여러 자리에서 한밤 관측자가 보는 교실 벽을 비교했습니다. 이 실험과 가장 직접적으로 연결되는 과학 질문은 무엇인가요?",
    "givens": {
      "공통 조작": "광원·교실 벽은 고정하고 지구 모형의 광원 둘레 위치만 바꾼다. 각 자리에서 관측자의 정면은 광원 반대쪽으로 맞춘다."
    },
    "choices": [
      "태양의 실제 표면 온도는 몇 도일까?",
      "같은 지점에서 낮과 밤은 왜 하루마다 번갈아 생길까?",
      "여러 날 동안 달의 모양은 왜 주기적으로 달라질까?",
      "계절마다 밤에 보기 좋은 별자리는 왜 달라질까?",
      "우리나라의 별자리는 어느 장소에서나 항상 같을까?"
    ],
    "responseContract": {
      "kind": "single-choice",
      "answer": 3
    },
    "explanation": "이 실험은 한밤 상태에서 태양 둘레의 지구 위치를 바꾸는 데 초점이 있다. 밤에 정면으로 보는 교실 방향이 달라지는 결과는 공전과 계절별 별자리 차이에 대응한다. 태양의 온도나 달의 크기, 장소 차이 자체를 측정한 실험은 아니다. 낮밤만 묻는 질문은 축 중심 회전을 따로 비교해야 한다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set2-questions",
        "set": 2,
        "no": 11
      }
    },
    "standards": [
      "6과12-03"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T10",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "모형 대응과 실험 목적",
      "inquirySkill": "조작·관측·현상 대응과 모형 한계",
      "itemType": "sc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T10",
      "format": "객관식",
      "standard": "6과12-03"
    },
    "answerContract": {
      "type": "single-choice",
      "earthMotionContract": {
        "kind": "single-choice",
        "answer": 3
      },
      "answer": 3
    }
  },
  {
    "key": "2-12",
    "id": "c22-s61-u04-v014",
    "status": "authored",
    "kind": "st",
    "prompt": "두 설명이 섞여 버렸습니다. 공전을 설명하는 카드의 빈칸 ㉠과 ㉡에 알맞은 말을 각각 쓰세요.",
    "givens": {
      "공전 카드": "지구는 ㉠을 중심으로 ㉡에 한 바퀴 돈다.",
      "섞인 낱말": [
        "달",
        "태양",
        "자전축",
        "하루",
        "일 년"
      ]
    },
    "responseContract": {
      "kind": "ordered-word-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "태양",
            "해"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "일 년",
            "일년",
            "1년",
            "약1년",
            "약일년"
          ]
        }
      ]
    },
    "explanation": "공전의 회전 중심은 태양이며 지구가 그 둘레를 한 바퀴 도는 기간은 약 일 년이다. 따라서 ㉠은 태양, ㉡은 일 년이다. 기울어진 자전축 중심의 하루 회전은 자전이므로 공전 카드의 기간으로 쓸 수 없다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set2-questions",
        "set": 2,
        "no": 12
      }
    },
    "standards": [
      "6과12-03"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T06",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "공전 중심과 주기",
      "inquirySkill": "자전/공전 중심과 기간 비교",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T06",
      "format": "단답형",
      "standard": "6과12-03"
    },
    "answerContract": {
      "type": "short-text",
      "earthMotionContract": {
        "kind": "ordered-word-parts",
        "parts": [
          {
            "label": "㉠",
            "accepted": [
              "태양",
              "해"
            ]
          },
          {
            "label": "㉡",
            "accepted": [
              "일 년",
              "일년",
              "1년",
              "약1년",
              "약일년"
            ]
          }
        ]
      },
      "answer": "㉠ 태양 / ㉡ 일 년",
      "accepted": []
    }
  },
  {
    "key": "2-13",
    "id": "c22-s61-u04-v015",
    "status": "authored",
    "kind": "wr",
    "prompt": "모형 수업의 비교용 예시 기록입니다. 봄과 가을 중 별무리 P가 남쪽에 나타난 기록의 계절을 쓰고, 두 계절의 별무리 위치가 달라지는 까닭을 지구의 운동으로 설명하세요.",
    "givens": {
      "자료 종류": "실제 학생 관측이나 천체 관측 프로그램 계산값이 아닌 모형 수업의 예시 기록",
      "비교 조건": "같은 국내 지점·오후9시·남쪽 하늘·같은 배율로 비교한다.",
      "기록": {
        "머리": [
          "날짜",
          "별무리 P",
          "별무리 Q"
        ],
        "행": [
          [
            "3월15일",
            "남쪽 비교 범위 밖",
            "남쪽"
          ],
          [
            "9월15일",
            "남쪽",
            "남쪽 비교 범위 밖"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "가을이다. 지구가 태양 둘레를 공전하면서 같은 시각의 밤에 바라보는 우주 방향이 달라지기 때문이다.",
      "required": [
        "9월15일 기록을 가을과 연결",
        "태양 둘레 지구 공전",
        "같은 장소·시각에서 밤의 관측 방향 변화"
      ],
      "actualPerformanceMustNotBeInferred": true
    },
    "explanation": "표에서는 P가 남쪽에 놓인 예시가9월15일이므로 가을 기록이다. 같은 장소·시각을 맞춰도 지구가 태양 둘레에서 다른 위치에 있기 때문에 밤에 보는 방향이 달라진다. 가상 P의 모형 비교 자료이며 실제 천체 관측 계산으로 입증한 자료는 아니다. 특정 대표 별자리가 다른 계절에 절대로 안 보인다는 결론도 내리지 않는다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set2-questions",
        "set": 2,
        "no": 13
      }
    },
    "standards": [
      "6과12-03"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T07",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "별자리 관측 조건과 일반화",
      "inquirySkill": "날짜·시각·장소 통제와 주장 한계",
      "itemType": "wr",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T07",
      "format": "서술형",
      "standard": "6과12-03"
    },
    "answerContract": {
      "type": "written-explanation",
      "earthMotionContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "가을이다. 지구가 태양 둘레를 공전하면서 같은 시각의 밤에 바라보는 우주 방향이 달라지기 때문이다.",
        "required": [
          "9월15일 기록을 가을과 연결",
          "태양 둘레 지구 공전",
          "같은 장소·시각에서 밤의 관측 방향 변화"
        ],
        "actualPerformanceMustNotBeInferred": true
      },
      "sample": "가을이다. 지구가 태양 둘레를 공전하면서 같은 시각의 밤에 바라보는 우주 방향이 달라지기 때문이다.",
      "teacherRequired": true
    }
  },
  {
    "key": "2-14",
    "id": "c22-s61-u04-v016",
    "status": "authored",
    "kind": "sc",
    "prompt": "먼 별을 나타내는 카드가 아니라 지구 모형을 태양 둘레로 옮겨야 하는 까닭을 올바르게 설명한 것을 고르세요.",
    "givens": {
      "조건": "중앙 태양과 바깥 카드는 고정하고 각 위치에서 관측자 정면을 태양 반대쪽으로 맞춘다."
    },
    "choices": [
      "별 카드 자체의 배열이 달라져 계절별 별자리가 바뀌는지를 비교하려는 것이다.",
      "지구의 태양 둘레 위치가 달라져 한밤 시선이 달라지는 현상을 비교하려는 것이다.",
      "지구의 축 중심 회전만으로 하루 동안 태양이 이동해 보이는 방향을 비교하려는 것이다.",
      "태양과 지구의 거리가 달라져 별자리의 밝기가 달라지는지를 비교하려는 것이다.",
      "태양이 고정된 지구 둘레를 도는 것을 계절별 관찰 방향의 원인으로 확인하려는 것이다."
    ],
    "responseContract": {
      "kind": "single-choice",
      "answer": 1
    },
    "explanation": "계절별 별자리 모형의 비교 대상은 태양 둘레 지구 위치와 한밤 시선의 관계다. 카드는 먼 별의 배치를 나타내므로 고정하고 지구 모형을 옮긴다. 모형을 옮기는 것은 실제 사계절 관측의 완료나 지구 공전 속력의 측정과 다르다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set2-questions",
        "set": 2,
        "no": 14
      }
    },
    "standards": [
      "6과12-03"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T10",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "모형 대응과 실험 목적",
      "inquirySkill": "조작·관측·현상 대응과 모형 한계",
      "itemType": "sc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T10",
      "format": "객관식",
      "standard": "6과12-03"
    },
    "answerContract": {
      "type": "single-choice",
      "earthMotionContract": {
        "kind": "single-choice",
        "answer": 1
      },
      "answer": 1
    }
  },
  {
    "key": "2-15",
    "id": "c22-s61-u04-v017",
    "status": "authored",
    "kind": "sc",
    "prompt": "제공 기록에서 같은 별무리를 봄의 한밤과 여름의 새벽에 모두 관찰할 수 있었습니다. 이 기록에 맞는 설명을 고르세요.",
    "givens": {
      "자료 종류": "조건 비교 연습용 제공 기록이며 실제 학생 관측으로 저장하지 않는다.",
      "기록": {
        "머리": [
          "관측 조건",
          "동일 별무리 P의 확인"
        ],
        "행": [
          [
            "봄의 한밤",
            "확인"
          ],
          [
            "여름의 새벽",
            "확인"
          ]
        ]
      }
    },
    "choices": [
      "한 별자리는 오직 한 계절에만 보여야 하므로 두 기록 중 하나는 반드시 거짓이다.",
      "같은 별무리를 두 계절에 봤으므로 지구는 태양 둘레를 돌지 않는다.",
      "한 별무리를 두 계절에 봤으므로 모든 별자리를 매일 같은 시각에 볼 수 있다.",
      "모든 계절의 한밤에는 별자리가 태양과 같은 방향에 있어도 잘 보인다.",
      "대표 계절이 있어도 관측 시각에 따라 다른 계절에 볼 수 있는 별무리가 있다."
    ],
    "responseContract": {
      "kind": "single-choice",
      "answer": 4
    },
    "explanation": "같은 별무리가 서로 다른 계절의 다른 시각에 관찰되었다는 기록을 그대로 읽어야 한다. 대표 계절은 관측이 가능한 유일한 계절이라는 뜻이 아니다. 한 사례로 모든 별자리의 모든 시각 관찰을 일반화하거나 지구 공전이 없다고 결론내릴 수는 없다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set2-questions",
        "set": 2,
        "no": 15
      }
    },
    "standards": [
      "6과12-03"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T07",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "별자리 관측 조건과 일반화",
      "inquirySkill": "날짜·시각·장소 통제와 주장 한계",
      "itemType": "sc",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T07",
      "format": "객관식",
      "standard": "6과12-03"
    },
    "answerContract": {
      "type": "single-choice",
      "earthMotionContract": {
        "kind": "single-choice",
        "answer": 4
      },
      "answer": 4
    }
  },
  {
    "key": "3-1",
    "id": "c22-s61-u04-v018",
    "status": "authored",
    "kind": "st",
    "prompt": "안전한 저발열 광원·지구의·작은 사람 모형으로 낮밤을 비교하려고 합니다. 광원이 대신하는 대상을 보기에서 찾아 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 지구 위 관측자",
        "ㄴ. 지구",
        "ㄷ. 태양"
      ],
      "조건": "광원과 지구의 중심은 고정하고 지구의 축 중심 회전을 비교한다."
    },
    "responseContract": {
      "kind": "short-text",
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "광원은 스스로 빛을 내어 지구를 비추는 태양에 대응한다. 지구의는 지구이고 작은 사람 모형은 지구 위 관측자다. 보기에서 태양은 ㄷ이다. 광원의 실제 크기나 온도가 태양과 같다는 뜻은 아니다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set3-questions",
        "set": 3,
        "no": 1
      }
    },
    "standards": [
      "6과12-01",
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T10",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "모형 대응과 실험 목적",
      "inquirySkill": "조작·관측·현상 대응과 모형 한계",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T10",
      "format": "단답형",
      "standard": "6과12-01"
    },
    "answerContract": {
      "type": "short-text",
      "earthMotionContract": {
        "kind": "short-text",
        "accepted": [
          "ㄷ"
        ]
      },
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    }
  },
  {
    "key": "3-2",
    "id": "c22-s61-u04-v019",
    "status": "authored",
    "kind": "sc",
    "prompt": "관측자가 남쪽을 향하도록 붙인 지구 모형을 서쪽에서 동쪽으로 조금씩 돌렸습니다. 지구 모형 위 관측자의 다음 기록으로 알맞은 것을 고르세요.",
    "givens": {
      "조건": "태양 모형의 위치는 고정하고 기울어진 축 주위 회전만 한다. 모형 밖 관찰자의 시선과 구별한다."
    },
    "choices": [
      "고정 광원이 서쪽 쪽에서 동쪽 쪽으로 움직이는 것처럼 보인다.",
      "고정 광원이 매일 같은 지표 방향에만 멈춰 보인다.",
      "고정 광원이 동쪽 쪽에서 서쪽 쪽으로 움직이는 것처럼 보인다.",
      "지구 모형의 자전이 광원을 지구 둘레로 실제 이동시켰다.",
      "지구 모형의 회전 중심을 옮겨야만 하루 위치 변화가 생긴다."
    ],
    "responseContract": {
      "kind": "single-choice",
      "answer": 2
    },
    "explanation": "관측자와 함께 서쪽에서 동쪽으로 도는 시선에서는 고정 광원이 반대로 움직이는 것처럼 보인다. 따라서 동쪽에서 서쪽으로의 기록이 맞다. 광원을 옮기거나 지구 모형 중심을 공전시킨 상황으로 설명을 바꾸면 주어진 조작과 달라진다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set3-questions",
        "set": 3,
        "no": 2
      }
    },
    "standards": [
      "6과12-01",
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T04",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "지표 관측자의 겉보기 운동",
      "inquirySkill": "관측자 시선과 바깥 관점 전환",
      "itemType": "sc",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T04",
      "format": "객관식",
      "standard": "6과12-01"
    },
    "answerContract": {
      "type": "single-choice",
      "earthMotionContract": {
        "kind": "single-choice",
        "answer": 2
      },
      "answer": 2
    }
  },
  {
    "key": "3-3",
    "id": "c22-s61-u04-v020",
    "status": "authored",
    "kind": "sc",
    "prompt": "같은 밤 남쪽 하늘에서 별무리의 위치가 달라졌습니다. 설명 카드의 세 칸을 올바르게 채운 것을 고르세요.",
    "givens": {
      "설명 카드": "지구가 서쪽에서 동쪽으로 ㉠하여 별무리가 ㉡ 쪽에서 ㉢ 쪽으로 움직이는 것처럼 보인다.",
      "방위": "관측자는 남쪽을 향한다."
    },
    "choices": [
      "㉠자전, ㉡동쪽, ㉢서쪽",
      "㉠공전, ㉡동쪽, ㉢서쪽",
      "㉠자전, ㉡서쪽, ㉢동쪽",
      "㉠공전, ㉡서쪽, ㉢동쪽",
      "㉠자전, ㉡북쪽, ㉢남쪽"
    ],
    "responseContract": {
      "kind": "single-choice",
      "answer": 0
    },
    "explanation": "하루 안에 같은 별무리의 겉보기 위치가 달라지는 현상은 주로 지구 자전과 연결된다. 남쪽 하늘 관측자 관점에서 동쪽 쪽에서 서쪽 쪽으로 이동해 보이므로 세 칸은 자전·동쪽·서쪽이다. 일 년 공전이나 북쪽 하늘의 원운동 설명으로 바꾸지 않는다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set3-questions",
        "set": 3,
        "no": 3
      }
    },
    "standards": [
      "6과12-01",
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T01",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "하루 위치 변화와 원인",
      "inquirySkill": "위치 기록의 시간 범위와 원인 추론",
      "itemType": "sc",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T01",
      "format": "객관식",
      "standard": "6과12-01"
    },
    "answerContract": {
      "type": "single-choice",
      "earthMotionContract": {
        "kind": "single-choice",
        "answer": 0
      },
      "answer": 0
    }
  },
  {
    "key": "3-6",
    "id": "c22-s61-u04-v021",
    "status": "authored",
    "kind": "sc",
    "prompt": "전기가 없는 지역에서도 낮과 밤은 번갈아 찾아옵니다. 이 교대를 일으키는 원인으로 알맞은 것을 고르세요.",
    "givens": {},
    "choices": [
      "태양의 밝기가 하루마다 바뀌어 밤에는 햇빛이 지구에 도달하지 않는다.",
      "달이 매일 태양빛을 가려 같은 지역이 밤마다 달 그림자에 들어간다.",
      "태양 둘레의 공전으로 지구가 매일 멀어져 햇빛을 받지 못한다.",
      "지구가 자전하여 그 지역이 태양빛을 받는 쪽과 반대쪽을 번갈아 지난다.",
      "지역의 전등을 켜거나 끄는 시간이 지구의 낮밤을 만든다."
    ],
    "responseContract": {
      "kind": "single-choice",
      "answer": 3
    },
    "explanation": "전등 사용은 낮밤의 원인이 아니다. 지구가 자전하면서 같은 지역의 태양에 대한 방향이 달라져 빛을 받는 낮과 받지 않는 밤을 번갈아 지난다. 태양이 실제로 꺼지거나 지구 전체가 매일 달의 그림자에 들어가는 것이 아니다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set3-questions",
        "set": 3,
        "no": 6
      }
    },
    "standards": [
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T02",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "빛 받는 면과 낮·밤",
      "inquirySkill": "표면 위치/빛 관계와 낮밤 원인",
      "itemType": "sc",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T02",
      "format": "객관식",
      "standard": "6과12-02"
    },
    "answerContract": {
      "type": "single-choice",
      "earthMotionContract": {
        "kind": "single-choice",
        "answer": 3
      },
      "answer": 3
    }
  },
  {
    "key": "3-7",
    "id": "c22-s61-u04-v022",
    "status": "authored",
    "kind": "sc",
    "prompt": "자전 실험의 기록 중 모형과 실제 지구의 대응이 잘못된 한 가지를 고르세요.",
    "givens": {},
    "choices": [
      "지구의 축 중심 한 바퀴 회전은 실제 지구의 일 년에 대응한다.",
      "고정 광원은 태양에 대응한다.",
      "기울어진 축을 중심으로 도는 지구의는 자전하는 지구에 대응한다.",
      "우리나라 표시는 같은 지역을 계속 살피기 위해 붙인다.",
      "빛을 받는 면과 반대 면은 각각 낮과 밤을 설명하는 데 쓴다."
    ],
    "responseContract": {
      "kind": "single-choice",
      "answer": 0
    },
    "explanation": "축 중심 회전은 자전에 대응하고 실제 지구 자전 한 바퀴는 하루다. 일 년은 태양 둘레 공전 한 바퀴의 기간이다. 따라서 일 년으로 대응한 기록만 잘못이다. 모형을 실제보다 빨리 돌려도 대응시키려는 두 운동의 중심과 기간이 같아지는 것은 아니다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set3-questions",
        "set": 3,
        "no": 7
      }
    },
    "standards": [
      "6과12-01",
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T03",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "자전 정의·방향·주기",
      "inquirySkill": "회전 중심·기간·관찰 방향 구별",
      "itemType": "sc",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T03",
      "format": "객관식",
      "standard": "6과12-01"
    },
    "answerContract": {
      "type": "single-choice",
      "earthMotionContract": {
        "kind": "single-choice",
        "answer": 0
      },
      "answer": 0
    }
  },
  {
    "key": "3-8",
    "id": "c22-s61-u04-v023",
    "status": "authored",
    "kind": "wr",
    "prompt": "같은 순간 A 지역은 태양빛을 받는 쪽, B 지역은 반대쪽에 있었습니다. 시간이 지나 A도 밤이 된 까닭과, 같은 순간 A와 B가 다른 낮밤 상태였던 까닭을 각각 설명하세요.",
    "givens": {
      "자료 종류": "위치 관계를 단순화한 설명용 상황이며 실제 학생 관측값이 아니다.",
      "조건": "A와 B는 지구 표면의 서로 반대쪽 지역이다. 구름·인공조명은 비교하지 않는다."
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "지구가 자전하여 A가 빛을 받지 않는 쪽으로 돌아갔다. 같은 순간에도 두 지역은 지구 위에서 태양을 향한 위치가 달라 한쪽은 낮이고 다른 쪽은 밤이었다.",
      "required": [
        "자전으로 같은 지역의 태양에 대한 방향 변화",
        "A가 직접 빛을 받지 않는 쪽에 이르면 밤",
        "동시에 다른 지역이 태양을 향한 위치 차이"
      ],
      "actualPerformanceMustNotBeInferred": true
    },
    "explanation": "첫 비교는 시간이 흐르는 동안 같은 A의 상태 변화이므로 지구 자전으로 A가 빛 반대쪽으로 돌아간 것을 설명한다. 둘째 비교는 같은 순간 두 지역의 차이이므로 지구 표면에서 태양을 향한 위치가 서로 다름을 설명한다. 두 비교를 섞어 모든 지역이 동시에 밤이 된다고 쓰면 안 된다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set3-questions",
        "set": 3,
        "no": 8
      }
    },
    "standards": [
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T09",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "같은 지역의 교대와 지역 간 차이",
      "inquirySkill": "시간에 따른 변화/같은 순간의 공간 비교",
      "itemType": "wr",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T09",
      "format": "서술형",
      "standard": "6과12-02"
    },
    "answerContract": {
      "type": "written-explanation",
      "earthMotionContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "지구가 자전하여 A가 빛을 받지 않는 쪽으로 돌아갔다. 같은 순간에도 두 지역은 지구 위에서 태양을 향한 위치가 달라 한쪽은 낮이고 다른 쪽은 밤이었다.",
        "required": [
          "자전으로 같은 지역의 태양에 대한 방향 변화",
          "A가 직접 빛을 받지 않는 쪽에 이르면 밤",
          "동시에 다른 지역이 태양을 향한 위치 차이"
        ],
        "actualPerformanceMustNotBeInferred": true
      },
      "sample": "지구가 자전하여 A가 빛을 받지 않는 쪽으로 돌아갔다. 같은 순간에도 두 지역은 지구 위에서 태양을 향한 위치가 달라 한쪽은 낮이고 다른 쪽은 밤이었다.",
      "teacherRequired": true
    }
  },
  {
    "key": "3-9",
    "id": "c22-s61-u04-v024",
    "status": "authored",
    "kind": "st",
    "prompt": "지구 모형이 중앙 태양의 위쪽에 있습니다. 한밤 관측자의 정면에 있는 교실 장면을 보기에서 찾아 기호를 쓰세요.",
    "givens": {
      "모형 조건": "모형판을 위에서 내려다본다. 가운데 태양 모형과 바깥 네 카드는 고정한다. 한밤 관측자의 정면은 태양 반대쪽 바깥을 향하도록 맞춘다. 실제 밤하늘 전체가 한 카드라는 뜻은 아니다.",
      "카드 배치": {
        "머리": [
          "판에서의 위치",
          "카드"
        ],
        "행": [
          [
            "위쪽",
            "게시판과 거울"
          ],
          [
            "오른쪽",
            "창문과 사물함"
          ],
          [
            "아래쪽",
            "칠판과 교탁"
          ],
          [
            "왼쪽",
            "출입문과 신발장"
          ]
        ]
      },
      "지구 모형 위치": "태양의 위쪽",
      "보기": [
        "가. 창문과 사물함",
        "나. 칠판과 교탁",
        "다. 출입문과 신발장",
        "라. 게시판과 거울"
      ]
    },
    "responseContract": {
      "kind": "short-text",
      "accepted": [
        "라"
      ]
    },
    "explanation": "태양은 지구 모형의 아래쪽에 있으므로 한밤의 정면은 태양 반대인 위쪽 바깥을 향한다. 배치표에서 위쪽 장면은 게시판과 거울이며 보기의 라다. 태양 쪽이나 시선의 옆쪽 장면을 선택하면 한밤 정면이라는 조건과 어긋난다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set3-questions",
        "set": 3,
        "no": 9
      }
    },
    "standards": [
      "6과12-03"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "midnight-card",
      "earth": [
        0,
        1
      ],
      "cards": {
        "라": [
          0,
          1
        ],
        "가": [
          1,
          0
        ],
        "나": [
          0,
          -1
        ],
        "다": [
          -1,
          0
        ]
      },
      "expected": "라"
    },
    "type": "T05",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "공전 모형의 한밤 시선",
      "inquirySkill": "공간 배치·태양 반대 방향 해석",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T05",
      "format": "단답형",
      "standard": "6과12-03"
    },
    "answerContract": {
      "type": "short-text",
      "earthMotionContract": {
        "kind": "short-text",
        "accepted": [
          "라"
        ]
      },
      "answer": "라",
      "accepted": [
        "라"
      ]
    }
  },
  {
    "key": "3-10",
    "id": "c22-s61-u04-v025",
    "status": "authored",
    "kind": "sc",
    "prompt": "한밤 시선을 맞춘 지구 모형을 중앙 태양 둘레의 여러 자리로 옮기니 정면 카드가 달라졌습니다. 이 결과로 뒷받침되는 설명을 고르세요.",
    "givens": {
      "조건": "먼 별 카드와 태양 모형은 제자리에 고정했다. 실제 천체 거리와 크기는 재현하지 않는다."
    },
    "choices": [
      "축 중심 자전만으로 일 년 동안의 태양 둘레 위치가 모두 바뀐다.",
      "태양이 지구 주위를 돌았기 때문에 정면 카드가 바뀌었다.",
      "한밤에도 태양과 같은 방향의 별자리가 가장 잘 보여 정면 카드가 달라졌다.",
      "계절별 별자리가 달라지는 것은 모든 별이 지구 가까이로 이동했기 때문이다.",
      "공전으로 지구 위치가 달라지면 밤에 바라보는 우주 방향이 달라질 수 있다."
    ],
    "responseContract": {
      "kind": "single-choice",
      "answer": 4
    },
    "explanation": "조작한 변수는 태양 둘레 지구 위치다. 그에 따라 한밤에 태양 반대쪽을 바라보는 방향이 바뀌므로 계절별로 보기 좋은 별자리가 달라지는 설명을 뒷받침한다. 실제 공전 주기를 초시계로 재거나 별들의 실제 이동을 측정한 것은 아니다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set3-questions",
        "set": 3,
        "no": 10
      }
    },
    "standards": [
      "6과12-03"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T10",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "모형 대응과 실험 목적",
      "inquirySkill": "조작·관측·현상 대응과 모형 한계",
      "itemType": "sc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T10",
      "format": "객관식",
      "standard": "6과12-03"
    },
    "answerContract": {
      "type": "single-choice",
      "earthMotionContract": {
        "kind": "single-choice",
        "answer": 4
      },
      "answer": 4
    }
  },
  {
    "key": "4-1",
    "id": "c22-s61-u04-v026",
    "status": "authored",
    "kind": "st",
    "prompt": "정지해 있던 열차가 앞으로 출발했습니다. 창밖의 가까운 고정 표지판은 열차 안의 관측자에게 어떻게 보일까요? 보기의 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 열차 진행 방향의 반대쪽으로 움직이는 것처럼 보인다.",
        "ㄴ. 열차와 같은 방향으로 같은 빠르기로 움직이는 것처럼 보인다.",
        "ㄷ. 열차 안의 관측자에게도 반드시 같은 창 위치에 멈춰 보인다."
      ],
      "조건": "표지판은 바깥 지면에 고정되어 있고 선로 바로 옆을 바라본다. 관측자가 창의 방향을 바꾸지는 않는다."
    },
    "responseContract": {
      "kind": "short-text",
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "표지판은 지면에 고정되어 있지만 관측자가 탄 열차가 앞으로 이동한다. 그래서 관측자에게 가까운 표지판은 열차 진행 방향의 반대쪽으로 움직이는 것처럼 보인다. 보기의 ㄱ이다. 실제로 표지판이 철길을 따라 이동했다고 해석하지 않는다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set4-questions",
        "set": 4,
        "no": 1
      }
    },
    "standards": [
      "6과12-01",
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T08",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "움직이는 관측자와 고정 물체",
      "inquirySkill": "관찰된 겉보기 이동/실제 이동 구분",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T08",
      "format": "단답형",
      "standard": "6과12-01"
    },
    "answerContract": {
      "type": "short-text",
      "earthMotionContract": {
        "kind": "short-text",
        "accepted": [
          "ㄱ"
        ]
      },
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    }
  },
  {
    "key": "4-2",
    "id": "c22-s61-u04-v027",
    "status": "authored",
    "kind": "mc",
    "prompt": "남쪽을 향한 관측자 모형을 붙이고, 광원을 고정한 채 지구의만 서쪽에서 동쪽으로 돌렸습니다. 모형과 관측자의 기록을 옳게 설명한 두 개를 고르세요.",
    "givens": {
      "조건": "지구의 중심과 광원의 위치는 바꾸지 않는다. 실제 지구/태양의 크기와 거리를 재현하는 실험이 아니다."
    },
    "choices": [
      "고정 광원은 지구에 빛을 비추는 태양에 대응한다.",
      "축 중심 한 바퀴 회전은 실제 지구의 태양 둘레 공전 한 바퀴에 대응한다.",
      "관측자에게 광원은 동쪽에서 서쪽으로 움직이는 것처럼 보인다.",
      "관측자가 회전하더라도 지표 기준 광원 위치는 항상 같다.",
      "광원이 실제로 지구의 둘레를 돌았기 때문에 관측 위치가 달라졌다."
    ],
    "responseContract": {
      "kind": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "태양에 대응하는 것은 고정 광원이며, 지구의와 함께 회전한 관측자는 그 광원을 동쪽에서 서쪽으로 이동하는 것처럼 본다. 축 중심 회전은 자전이므로 태양 둘레 공전과 같지 않다. 겉보기 위치 변화 때문에 광원이 실제로 옮겨졌다고 말하지 않는다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set4-questions",
        "set": 4,
        "no": 2
      }
    },
    "standards": [
      "6과12-01",
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T04",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "지표 관측자의 겉보기 운동",
      "inquirySkill": "관측자 시선과 바깥 관점 전환",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T04",
      "format": "복수 선택",
      "standard": "6과12-01"
    },
    "answerContract": {
      "type": "multi-choice",
      "earthMotionContract": {
        "kind": "multi-choice",
        "answers": [
          0,
          2
        ]
      },
      "answers": [
        0,
        2
      ]
    }
  },
  {
    "key": "4-3",
    "id": "c22-s61-u04-v028",
    "status": "authored",
    "kind": "st",
    "prompt": "별이 하루 동안 움직이는 것처럼 보이는 까닭을 설명하는 문장의 빈칸에 알맞은 운동 이름을 쓰세요.",
    "givens": {
      "문장": "지구가 서쪽에서 동쪽으로 [ ]하기 때문에 남쪽 하늘의 별이 동쪽 쪽에서 서쪽 쪽으로 이동하는 것처럼 보인다."
    },
    "responseContract": {
      "kind": "short-text",
      "accepted": [
        "자전",
        "지구의 자전",
        "지구 자전"
      ]
    },
    "explanation": "같은 밤 남쪽 하늘의 위치 변화는 지구가 축을 중심으로 서쪽에서 동쪽으로 회전하는 자전과 연결된다. 빈칸은 자전이다. 일 년 동안 태양 둘레 위치가 변하는 공전이나 별들이 지구 둘레를 도는 운동으로 바꾸면 관찰의 시간 범위와 원인이 맞지 않는다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set4-questions",
        "set": 4,
        "no": 3
      }
    },
    "standards": [
      "6과12-01",
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T01",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "하루 위치 변화와 원인",
      "inquirySkill": "위치 기록의 시간 범위와 원인 추론",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T01",
      "format": "단답형",
      "standard": "6과12-01"
    },
    "answerContract": {
      "type": "short-text",
      "earthMotionContract": {
        "kind": "short-text",
        "accepted": [
          "자전",
          "지구의 자전",
          "지구 자전"
        ]
      },
      "answer": "자전",
      "accepted": [
        "자전",
        "지구의 자전",
        "지구 자전"
      ]
    }
  },
  {
    "key": "4-4",
    "id": "c22-s61-u04-v029",
    "status": "authored",
    "kind": "st",
    "prompt": "북극 위의 카메라로 지구 모형의 축 중심 회전을 내려다봅니다. 두 메모의 빈칸에 들어갈 말을 각각 쓰세요.",
    "givens": {
      "㉠": "같은 지역의 한밤에서 다음 한밤까지의 자전 한 바퀴는 약 [ ]에 대응한다.",
      "㉡": "카메라에 보이는 지구의 자전은 [ ] 방향이다.",
      "조건": "축 중심 자전만 비교하고 카메라는 북극 위에서 중심을 내려다본다."
    },
    "responseContract": {
      "kind": "ordered-word-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "하루",
            "1일"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "반시계",
            "반시계 방향",
            "시계 반대",
            "시계 반대 방향"
          ]
        }
      ]
    },
    "explanation": "같은 지역이 한밤에서 다음 한밤이 되는 자전 한 바퀴는 약 하루에 대응한다. 북극 위에서 내려다보는 카메라에는 지구의 자전이 반시계 방향으로 보인다. 두 칸은 각각 기간과 관찰 방향에 대응하므로 순서를 바꾸지 않는다. 남극 쪽 카메라라면 시계 표시가 반대가 된다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set4-questions",
        "set": 4,
        "no": 4
      }
    },
    "standards": [
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T03",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "자전 정의·방향·주기",
      "inquirySkill": "회전 중심·기간·관찰 방향 구별",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T03",
      "format": "단답형",
      "standard": "6과12-02"
    },
    "answerContract": {
      "type": "short-text",
      "earthMotionContract": {
        "kind": "ordered-word-parts",
        "parts": [
          {
            "label": "㉠",
            "accepted": [
              "하루",
              "1일"
            ]
          },
          {
            "label": "㉡",
            "accepted": [
              "반시계",
              "반시계 방향",
              "시계 반대",
              "시계 반대 방향"
            ]
          }
        ]
      },
      "answer": "㉠ 하루 / ㉡ 반시계",
      "accepted": []
    }
  },
  {
    "key": "4-7",
    "id": "c22-s61-u04-v030",
    "status": "authored",
    "kind": "sc",
    "prompt": "남쪽을 향한 관측자는 같은 밤 별무리가 왼쪽 쪽에서 오른쪽 쪽으로 위치를 바꾸는 것을 보았습니다. 이 하루 위치 변화를 설명한 것으로 알맞은 것을 고르세요.",
    "givens": {
      "관측 조건": "우리나라의 같은 자리·같은 밤·남쪽 보기에서 같은 별무리를 비교한 설명용 상황이다."
    },
    "choices": [
      "별무리가 매일 지구 둘레를 한 바퀴 공전하여 같은 경로로 지나간다.",
      "지구 자전으로 별이 동쪽에서 서쪽으로 움직여 보인다.",
      "지구가 동쪽에서 서쪽으로 자전하여 별이 동쪽에서 서쪽으로 보인다.",
      "지구가 하루에 태양 둘레를 한 바퀴 공전하여 별이 움직인다.",
      "별 자체의 자전만으로 그 별무리 전체가 지구 하늘을 가로지른다."
    ],
    "responseContract": {
      "kind": "single-choice",
      "answer": 1
    },
    "explanation": "남쪽을 볼 때 왼쪽은 동쪽, 오른쪽은 서쪽이다. 따라서 기록은 별의 동쪽에서 서쪽으로의 겉보기 위치 변화다. 지구가 반대인 서쪽에서 동쪽으로 자전하는 것과 연결된다. 별 자체의 자전과 지구 둘레 실제 공전으로 이 하루 현상을 설명하지 않는다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set4-questions",
        "set": 4,
        "no": 7
      }
    },
    "standards": [
      "6과12-01",
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T01",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "하루 위치 변화와 원인",
      "inquirySkill": "위치 기록의 시간 범위와 원인 추론",
      "itemType": "sc",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T01",
      "format": "객관식",
      "standard": "6과12-01"
    },
    "answerContract": {
      "type": "single-choice",
      "earthMotionContract": {
        "kind": "single-choice",
        "answer": 1
      },
      "answer": 1
    }
  },
  {
    "key": "4-8",
    "id": "c22-s61-u04-v031",
    "status": "authored",
    "kind": "sc",
    "prompt": "우리나라의 보통 낮과 밤을 설명한 기록 중 고쳐야 할 것을 하나 고르세요.",
    "givens": {},
    "choices": [
      "낮에 그늘로 들어가면 주변이 어두워도 낮이라는 사실은 달라지지 않는다.",
      "우리 지역이 태양빛을 직접 받는 쪽이면 낮에 해당한다.",
      "밤에 전등을 켜 밝아져도 지구 운동에서 말하는 낮으로 바뀌지는 않는다.",
      "구름 때문에 어두운 낮은 지구 운동에서 말하는 밤이다.",
      "자전으로 같은 지역의 태양에 대한 방향이 달라지며 낮과 밤이 교대한다."
    ],
    "responseContract": {
      "kind": "single-choice",
      "answer": 3
    },
    "explanation": "구름·그늘·전등은 주변 밝기를 바꾸지만 그 지역이 태양을 향한 위치와 낮밤의 정의를 바꾸지 않는다. 따라서 흐려 어두운 낮을 밤이라고 한 기록을 고쳐야 한다. 이 문항은 국내의 일반적인 낮밤 맥락에서 주변 밝기와 지구 운동의 원인을 구별한다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set4-questions",
        "set": 4,
        "no": 8
      }
    },
    "standards": [
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T02",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "빛 받는 면과 낮·밤",
      "inquirySkill": "표면 위치/빛 관계와 낮밤 원인",
      "itemType": "sc",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T02",
      "format": "객관식",
      "standard": "6과12-02"
    },
    "answerContract": {
      "type": "single-choice",
      "earthMotionContract": {
        "kind": "single-choice",
        "answer": 3
      },
      "answer": 3
    }
  },
  {
    "key": "4-9",
    "id": "c22-s61-u04-v032",
    "status": "authored",
    "kind": "st",
    "prompt": "광원 쪽을 향한 지구 모형의 표면에 우리 지역 표시가 있습니다. 이 상태가 낮과 밤 중 무엇에 해당하는지 쓰세요.",
    "givens": {
      "조건": "왼쪽에 고정 광원이 있고, 우리 지역 표시는 공의 왼쪽 정면에 있다. 주변 조명은 비교하지 않는다."
    },
    "responseContract": {
      "kind": "short-text",
      "accepted": [
        "낮"
      ]
    },
    "explanation": "우리 지역 표시는 태양 모형을 향한 표면에 있어 빛을 직접 받는다. 따라서 낮에 해당한다. 광원 반대편인 경우의 밤과 구별한다. 교실 조명의 밝기나 글자의 색이 아니라 광원과 표면의 위치 관계를 읽어야 한다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set4-questions",
        "set": 4,
        "no": 9
      }
    },
    "standards": [
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "illumination",
      "sunVector": [
        -1,
        0,
        0
      ],
      "points": {
        "우리 지역": [
          -1,
          0,
          0
        ]
      },
      "task": "day-or-night",
      "target": "우리 지역",
      "expected": "낮"
    },
    "type": "T02",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "빛 받는 면과 낮·밤",
      "inquirySkill": "표면 위치/빛 관계와 낮밤 원인",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T02",
      "format": "단답형",
      "standard": "6과12-02"
    },
    "answerContract": {
      "type": "short-text",
      "earthMotionContract": {
        "kind": "short-text",
        "accepted": [
          "낮"
        ]
      },
      "answer": "낮",
      "accepted": [
        "낮"
      ]
    }
  },
  {
    "key": "4-10",
    "id": "c22-s61-u04-v033",
    "status": "authored",
    "kind": "sc",
    "prompt": "처음에는 광원 반대편에 있던 점 P가 지구 모형의 축 중심 반 바퀴 회전 뒤 광원 쪽 정면에 왔습니다. 변화에 대한 설명으로 옳은 것을 고르세요.",
    "givens": {
      "자료 종류": "방위와 축을 단순화한 자전 모형의 상태 비교",
      "조건": "광원의 위치와 지구 중심은 유지한다. 실제 지역의 계절별 낮 길이 계산에는 쓰지 않는다."
    },
    "choices": [
      "지구 모형의 모든 지역이 동시에 빛을 받게 되었다.",
      "이 조작으로 실제 우리나라의 낮 길이가 밤 길이보다 항상 길다는 것을 증명했다.",
      "자전하면서 P가 직접 빛을 받지 않는 쪽에서 빛을 받는 쪽으로 바뀌었다.",
      "고정 광원이 P의 둘레를 실제로 반 바퀴 돌았다.",
      "지구 모형이 태양 둘레를 반 바퀴 공전하여 P가 밝아졌다."
    ],
    "responseContract": {
      "kind": "single-choice",
      "answer": 2
    },
    "explanation": "주어진 조작은 지구 모형의 축 중심 회전이다. 같은 P가 광원 반대편에서 광원 정면으로 와서 빛을 받는 상태로 바뀌었다. 빛을 받는 지역의 변화이지 지구 전체가 동시에 낮이 되거나 태양 둘레 위치가 변한 결과가 아니다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set4-questions",
        "set": 4,
        "no": 10
      }
    },
    "standards": [
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T02",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "빛 받는 면과 낮·밤",
      "inquirySkill": "표면 위치/빛 관계와 낮밤 원인",
      "itemType": "sc",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T02",
      "format": "객관식",
      "standard": "6과12-02"
    },
    "answerContract": {
      "type": "single-choice",
      "earthMotionContract": {
        "kind": "single-choice",
        "answer": 2
      },
      "answer": 2
    }
  },
  {
    "key": "4-11",
    "id": "c22-s61-u04-v034",
    "status": "authored",
    "kind": "sc",
    "prompt": "같은 지역 표시가 빛을 받았다가 받지 않는 상태를 반복했습니다. 광원은 고정되어 있었습니다. 이 관찰과 모형 조작을 연결한 설명을 고르세요.",
    "givens": {
      "실험 조건": "기울어진 지구의의 축 중심 회전만 한다. 달 모형이나 차광판은 사용하지 않는다."
    },
    "choices": [
      "지구 모형의 축 중심 회전은 태양 자체의 자전을 직접 관찰한 것이다.",
      "광원이 고정되어 있었으므로 실제 지구에는 낮밤 교대가 없다.",
      "같은 지역이 어두워진 것은 달 모형이 매일 지구 전체를 가린 결과다.",
      "지구 모형의 축 중심 회전은 실제 지구의 자전과 낮밤 교대를 설명한다.",
      "이 실험만으로 우리나라 사계절의 기온 변화를 모두 설명하고 측정했다."
    ],
    "responseContract": {
      "kind": "single-choice",
      "answer": 3
    },
    "explanation": "지구 모형이 축을 중심으로 돌기 때문에 같은 표면 표시가 광원 쪽과 반대쪽을 번갈아 지난다. 실제로는 지구 자전과 낮밤 교대에 대응한다. 태양 자체 자전이나 사계절 기온 변화를 측정한 실험으로 확대하지 않는다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set4-questions",
        "set": 4,
        "no": 11
      }
    },
    "standards": [
      "6과12-02"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T02",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "빛 받는 면과 낮·밤",
      "inquirySkill": "표면 위치/빛 관계와 낮밤 원인",
      "itemType": "sc",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T02",
      "format": "객관식",
      "standard": "6과12-02"
    },
    "answerContract": {
      "type": "single-choice",
      "earthMotionContract": {
        "kind": "single-choice",
        "answer": 3
      },
      "answer": 3
    }
  },
  {
    "key": "4-12",
    "id": "c22-s61-u04-v035",
    "status": "authored",
    "kind": "sc",
    "prompt": "지구 모형의 갑 위치는 중앙 태양 왼쪽, 을 위치는 오른쪽입니다. 두 자리에서 모두 한밤 시선을 맞췄습니다. 옳은 설명을 고르세요.",
    "givens": {
      "조건": "한밤 관측자 정면은 태양 반대쪽 바깥을 향하도록 정했다. 중앙 태양과 교실 벽은 고정한다."
    },
    "choices": [
      "갑과 을에서 한밤 정면은 모두 중앙 광원을 향한다.",
      "갑과 을에서 관측자의 정면은 서로 반대쪽 바깥을 향한다.",
      "갑과 을에서 한밤 정면은 같은 왼쪽 벽을 향한다.",
      "지구 위치가 달라져도 한밤에 보는 바깥 방향은 언제나 같다.",
      "갑에서 을로 옮긴 것은 지구의 축 중심 자전 한 바퀴와 같은 조작이다."
    ],
    "responseContract": {
      "kind": "single-choice",
      "answer": 1
    },
    "explanation": "갑에서는 태양이 오른쪽에 있으므로 한밤 정면이 왼쪽 바깥을 향한다. 을에서는 반대로 태양이 왼쪽에 있어 오른쪽 바깥을 향한다. 두 관측 방향은 서로 반대다. 태양 둘레의 위치 이동과 축 중심 회전을 같은 조작이라고 할 수 없다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set4-questions",
        "set": 4,
        "no": 12
      }
    },
    "standards": [
      "6과12-03"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "opposite-midnight-views",
      "earthPositions": [
        [
          -1,
          0
        ],
        [
          1,
          0
        ]
      ],
      "expectedRelation": "opposite"
    },
    "type": "T05",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "공전 모형의 한밤 시선",
      "inquirySkill": "공간 배치·태양 반대 방향 해석",
      "itemType": "sc",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T05",
      "format": "객관식",
      "standard": "6과12-03"
    },
    "answerContract": {
      "type": "single-choice",
      "earthMotionContract": {
        "kind": "single-choice",
        "answer": 1
      },
      "answer": 1
    }
  },
  {
    "key": "4-13",
    "id": "c22-s61-u04-v036",
    "status": "authored",
    "kind": "sc",
    "prompt": "두 운동 카드 중 B의 중심과 기간을 올바르게 묶은 것을 고르세요.",
    "givens": {
      "A 카드": "지구가 축을 중심으로 스스로 도는 운동",
      "B 카드": "지구가 태양 둘레를 도는 운동"
    },
    "choices": [
      "자전축 중심·하루에 한 바퀴",
      "달 중심·일 년에 한 바퀴",
      "태양 중심·일 년에 한 바퀴",
      "태양 중심·하루에 한 바퀴",
      "자전축 중심·일 년에 한 바퀴"
    ],
    "responseContract": {
      "kind": "single-choice",
      "answer": 2
    },
    "explanation": "B는 지구 중심을 태양 둘레의 다른 위치로 옮기는 운동인 공전이다. 지구 공전 한 바퀴의 중심은 태양이고 기간은 약 일 년이다. A처럼 자전축 중심 하루 회전과 구별해야 한다. 모형을 옮기는 데 걸린 교실의 몇 초를 실제 공전 기간으로 쓰지 않는다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set4-questions",
        "set": 4,
        "no": 13
      }
    },
    "standards": [
      "6과12-03"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T06",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "공전 중심과 주기",
      "inquirySkill": "자전/공전 중심과 기간 비교",
      "itemType": "sc",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T06",
      "format": "객관식",
      "standard": "6과12-03"
    },
    "answerContract": {
      "type": "single-choice",
      "earthMotionContract": {
        "kind": "single-choice",
        "answer": 2
      },
      "answer": 2
    }
  },
  {
    "key": "4-14",
    "id": "c22-s61-u04-v037",
    "status": "authored",
    "kind": "st",
    "prompt": "자전은 북극 위에서, 공전은 지구 공전 궤도면의 북쪽 위에서 내려다본다고 정했습니다. 두 방향을 모두 바르게 말한 사람의 이름을 쓰세요.",
    "givens": {
      "대화": [
        "준호: 자전은 시계 방향, 공전도 시계 방향이다.",
        "민서: 자전은 반시계 방향, 공전도 반시계 방향이다.",
        "수아: 자전은 반시계 방향, 공전은 시계 방향이다."
      ]
    },
    "responseContract": {
      "kind": "short-text",
      "accepted": [
        "민서"
      ]
    },
    "explanation": "정한 관점에서 지구 자전은 반시계 방향이고 태양 둘레 공전도 반시계 방향이다. 따라서 민서의 설명이 맞다. 원문처럼 관찰 방향을 빠뜨리지 않고 자전과 공전의 관점을 각각 명시했다. 남쪽에서 바라본 시계 표시는 달라지므로 조건을 먼저 읽어야 한다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set4-questions",
        "set": 4,
        "no": 14
      }
    },
    "standards": [
      "6과12-03"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T03",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "자전 정의·방향·주기",
      "inquirySkill": "회전 중심·기간·관찰 방향 구별",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T03",
      "format": "단답형",
      "standard": "6과12-03"
    },
    "answerContract": {
      "type": "short-text",
      "earthMotionContract": {
        "kind": "short-text",
        "accepted": [
          "민서"
        ]
      },
      "answer": "민서",
      "accepted": [
        "민서"
      ]
    }
  },
  {
    "key": "4-16",
    "id": "c22-s61-u04-v038",
    "status": "authored",
    "kind": "wr",
    "prompt": "지구가 태양 아래쪽에 있는 모형입니다. 한밤 관측자가 정면으로 보는 카드의 기호를 쓰고, 광원과 관측자 시선의 관계로 이유를 설명하세요.",
    "givens": {
      "모형 조건": "모형판을 위에서 내려다본다. 가운데 태양 모형과 바깥 네 카드는 고정한다. 한밤 관측자의 정면은 태양 반대쪽 바깥을 향하도록 맞춘다. 실제 밤하늘 전체가 한 카드라는 뜻은 아니다.",
      "카드 배치": {
        "머리": [
          "판에서의 위치",
          "카드"
        ],
        "행": [
          [
            "위쪽",
            "ㄷ"
          ],
          [
            "오른쪽",
            "ㄱ"
          ],
          [
            "아래쪽",
            "ㅁ"
          ],
          [
            "왼쪽",
            "ㄴ"
          ]
        ]
      },
      "지구 모형 위치": "태양의 아래쪽"
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "ㅁ이다. 태양은 지구 모형 위쪽에 있으므로 한밤 관측자는 태양 반대쪽인 아래쪽 바깥을 향하고 그곳에 ㅁ 카드가 있기 때문이다.",
      "required": [
        "정면 카드 ㅁ",
        "태양은 지구 모형 위쪽",
        "한밤 정면은 광원 반대인 아래쪽 바깥"
      ],
      "actualPerformanceMustNotBeInferred": true
    },
    "explanation": "중앙 태양보다 아래에 있는 지구 모형에서는 태양 방향이 위쪽이다. 한밤 지표의 바깥 시선은 그 반대인 아래쪽으로 향한다. 아래쪽 카드는 ㅁ이므로 정면 카드와 이유를 함께 쓴다. 발문은 볼 수 있는 정면 카드를 묻고 있으며 볼 수 없는 태양 쪽 카드를 답으로 바꾸지 않는다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set4-questions",
        "set": 4,
        "no": 16
      }
    },
    "standards": [
      "6과12-03"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "midnight-card",
      "earth": [
        0,
        -1
      ],
      "cards": {
        "ㄷ": [
          0,
          1
        ],
        "ㄱ": [
          1,
          0
        ],
        "ㅁ": [
          0,
          -1
        ],
        "ㄴ": [
          -1,
          0
        ]
      },
      "expected": "ㅁ"
    },
    "type": "T05",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "공전 모형의 한밤 시선",
      "inquirySkill": "공간 배치·태양 반대 방향 해석",
      "itemType": "wr",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T05",
      "format": "서술형",
      "standard": "6과12-03"
    },
    "answerContract": {
      "type": "written-explanation",
      "earthMotionContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "ㅁ이다. 태양은 지구 모형 위쪽에 있으므로 한밤 관측자는 태양 반대쪽인 아래쪽 바깥을 향하고 그곳에 ㅁ 카드가 있기 때문이다.",
        "required": [
          "정면 카드 ㅁ",
          "태양은 지구 모형 위쪽",
          "한밤 정면은 광원 반대인 아래쪽 바깥"
        ],
        "actualPerformanceMustNotBeInferred": true
      },
      "sample": "ㅁ이다. 태양은 지구 모형 위쪽에 있으므로 한밤 관측자는 태양 반대쪽인 아래쪽 바깥을 향하고 그곳에 ㅁ 카드가 있기 때문이다.",
      "teacherRequired": true
    }
  },
  {
    "key": "4-17",
    "id": "c22-s61-u04-v039",
    "status": "authored",
    "kind": "sc",
    "prompt": "같은 장소·같은 밤 시각에 여러 계절의 남쪽 하늘을 비교하니 오래 보기 좋은 별무리가 달랐습니다. 그 까닭을 설명한 것으로 알맞은 것을 고르세요.",
    "givens": {
      "관찰 범위": "남쪽 하늘의 비교이며 대표 별자리가 다른 계절에는 절대로 안 보인다는 뜻은 아니다."
    },
    "choices": [
      "공전으로 밤에 바라보는 우주 방향이 달라지기 때문이다.",
      "지구가 하루마다 태양 둘레를 한 바퀴 공전하기 때문이다.",
      "태양이 매년 지구 둘레를 공전하면서 모든 별자리를 밀어내기 때문이다.",
      "지구의 축 중심 자전 방향이 계절마다 반대로 바뀌기 때문이다.",
      "모든 별이 계절마다 지구 둘레를 같은 방향으로 한 바퀴씩 돌기 때문이다."
    ],
    "responseContract": {
      "kind": "single-choice",
      "answer": 0
    },
    "explanation": "장소와 밤 시각을 맞췄으므로 일 년 동안의 비교에서 지구의 태양 둘레 위치 변화에 주목한다. 공전으로 밤에 바라보는 방향이 달라져 계절별로 보기 좋은 별무리가 달라진다. 하루 자전 방향이 계절마다 뒤집히거나 모든 별이 지구 둘레를 돈다고 설명할 수 없다.",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s61-earth-moon-set4-questions",
        "set": 4,
        "no": 17
      }
    },
    "standards": [
      "6과12-03"
    ],
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualPlanetariumCalculation": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "author-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "type": "T05",
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "지구의 운동",
      "concept": "공전 모형의 한밤 시선",
      "inquirySkill": "공간 배치·태양 반대 방향 해석",
      "itemType": "sc",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "type": "T05",
      "format": "객관식",
      "standard": "6과12-03"
    },
    "answerContract": {
      "type": "single-choice",
      "earthMotionContract": {
        "kind": "single-choice",
        "answer": 0
      },
      "answer": 0
    }
  }
];
export const source=[];
export const similar=[];
