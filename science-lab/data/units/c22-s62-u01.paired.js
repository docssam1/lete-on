export const unit = {
  "id": "c22-s62-u01",
  "course": "6-2",
  "no": 1,
  "title": "계절의 변화",
  "domain": "지구와 우주",
  "sources": {
    "originalExamAvailable": false,
    "scope": "독립 연습70(핵심68·선택 확장2). 원문과 공식 답은 포함하지 않는다.",
    "guidance": "실측·계산 자료·이상화 모형을 구별하고 날짜·장소·시각·단위를 확인해요."
  }
};
export const items = [
  {
    "key": "1-1",
    "id": "c22-s62-u01-v001",
    "status": "authored",
    "kind": "st",
    "prompt": "측정기 설명판에서 태양 고도를 재는 두 방향을 바르게 고른 기호를 쓰세요.",
    "givens": {
      "비교": {
        "머리": [
          "기호",
          "측정한 두 방향"
        ],
        "행": [
          [
            "ㄱ",
            "수평인 지표면과 햇빛 방향"
          ],
          [
            "ㄴ",
            "수직 막대와 수평 지표면"
          ],
          [
            "ㄷ",
            "수직 막대와 햇빛 방향"
          ]
        ]
      },
      "조건": "수평면에 수직 막대를 세우고 태양을 직접 보지 않는 간접 측정을 한다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "태양 고도는 지표의 수평면을 기준으로 태양 쪽 방향이 얼마나 높은지 나타내는 각이다. 설명판에서 그 두 방향을 함께 제시한 것은 ㄱ이다. 막대와 지표면의 직각이나 막대와 빛 사이의 각을 대신 읽으면 다른 각을 잰다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T01",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set1-questions",
        "set": 1,
        "no": 1
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "태양 고도의 기준",
      "inquirySkill": "수평면·빛 방향과 다른 각 구별",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T01",
      "format": "short-text",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄱ"
        ]
      },
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "1-2",
    "id": "c22-s62-u01-v002",
    "status": "authored",
    "kind": "mc",
    "prompt": "수직 막대와 실 사이의 각만 읽은 친구가 태양 고도를 다시 구하려고 합니다. 태양 고도는 몇 도인가요?",
    "givens": {
      "조건": "막대와 수평 받침은 직각이다. 막대 끝과 그림자 끝을 잇는 실이 막대와 이루는 안쪽 각은 37°이다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0
    },
    "explanation": "막대·그림자·실은 직각삼각형을 만든다. 수직 막대와 실 사이의 37°와 수평면에서 재는 태양 고도를 더하면 90°이다. 따라서 90°−37°=53°이며, 37°를 그대로 답하면 기준 방향을 혼동한 것이다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T01",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set1-questions",
        "set": 1,
        "no": 2
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "complement-angle",
      "verticalAngle": 37,
      "expectedAltitude": 53
    },
    "choices": [
      "53°",
      "37°",
      "90°",
      "127°",
      "143°"
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "태양 고도의 기준",
      "inquirySkill": "수평면·빛 방향과 다른 각 구별",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T01",
      "format": "single-choice",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 0
      },
      "type": "single-choice",
      "answer": 0
    }
  },
  {
    "key": "1-3",
    "id": "c22-s62-u01-v003",
    "status": "authored",
    "kind": "mc",
    "prompt": "같은 장소·같은 순간에 높이가 다른 수직 막대를 세웠습니다. 타당한 비교를 고르세요.",
    "givens": {
      "기록": {
        "머리": [
          "막대",
          "높이"
        ],
        "행": [
          [
            "P",
            "12 cm"
          ],
          [
            "Q",
            "24 cm"
          ]
        ]
      },
      "조건": "두 막대가 같은 수평면에서 받는 햇빛 방향은 같다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
    },
    "explanation": "같은 순간 같은 장소에 도달한 햇빛의 방향은 막대 길이로 바뀌지 않는다. 같은 태양 고도에서 막대 높이가 두 배이면 그림자 길이도 두 배가 되지만, 수평면과 빛 사이의 각은 같다. 그림자의 길이와 각을 따로 비교해야 한다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T02",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set1-questions",
        "set": 1,
        "no": 3
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "scaled-stick",
      "heights": [
        12,
        24
      ],
      "altitude": 40
    },
    "choices": [
      "Q의 그림자와 태양 고도가 모두 두 배가 된다.",
      "Q의 그림자는 더 길지만 태양 고도는 같다.",
      "Q의 그림자는 더 짧고 태양 고도는 더 낮다.",
      "높이가 다르므로 두 태양 고도를 비교할 수 없다.",
      "높은 막대를 쓰면 태양이 더 높은 곳으로 움직인다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "측정기와 측정 조건",
      "inquirySkill": "수평·수직·순서·반복·안전 확인",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T02",
      "format": "single-choice",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 1
      },
      "type": "single-choice",
      "answer": 1
    }
  },
  {
    "key": "1-4",
    "id": "c22-s62-u01-v004",
    "status": "authored",
    "kind": "mc",
    "prompt": "우리나라 운동장에서 같은 날 태양이 남중한 때를 설명한 것을 고르세요.",
    "givens": {
      "조건": "북반구 중위도의 같은 장소·수평면을 기준으로 한다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
    },
    "explanation": "우리나라에서는 태양이 남쪽 하늘의 자오선을 지날 때 그날 가장 높은 고도가 된다. 같은 수직 막대의 그림자는 이때 가장 짧다. 머리 위를 지나거나 기온 최고·낮밤 길이 같음까지 모두 보장하는 것은 아니다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T03",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set1-questions",
        "set": 1,
        "no": 4
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "choices": [
      "태양은 머리 바로 위에 있어 그림자가 늘 사라진다.",
      "태양은 동쪽에서 가장 높고 그림자는 가장 길다.",
      "태양은 남쪽에서 가장 높고 그림자는 가장 짧다.",
      "태양 고도가 가장 높으므로 기온도 반드시 최고다.",
      "태양이 남중하면 그날의 낮과 밤 길이가 같아진다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "하루 고도와 그림자",
      "inquirySkill": "같은 막대의 시간별 관계 비교",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T03",
      "format": "single-choice",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 2
      },
      "type": "single-choice",
      "answer": 2
    }
  },
  {
    "key": "1-5",
    "id": "c22-s62-u01-v005",
    "status": "authored",
    "kind": "st",
    "prompt": "세 기록을 그래프로 옮길 때 공통 가로축으로 쓸 항목의 기호를 쓰세요.",
    "givens": {
      "자료종류": "같은 장소의 단순화 고도·그림자 계산과 기온 연습값. 학생 실측이나 정밀 역서가 아니다.",
      "조건": "수평면의 같은 수직 막대(15 cm). 모형에서 남중은 12:40으로 설정한다. 기온은 통풍 그늘에서 읽는 값에 해당하는 연습값이다.",
      "기록": {
        "머리": [
          "시각",
          "태양 고도(°)",
          "그림자 길이(cm)",
          "기온(℃)"
        ],
        "행": [
          [
            "9:40",
            43,
            16.1,
            16
          ],
          [
            "10:40",
            53.9,
            11,
            18
          ],
          [
            "11:40",
            62.4,
            7.8,
            20
          ],
          [
            "12:40",
            66,
            6.7,
            22
          ],
          [
            "13:40",
            62.4,
            7.8,
            24
          ],
          [
            "14:40",
            53.9,
            11,
            25
          ],
          [
            "15:40",
            43,
            16.1,
            24
          ]
        ]
      },
      "항목": {
        "머리": [
          "기호",
          "내용"
        ],
        "행": [
          [
            "ㄱ",
            "기온(℃)"
          ],
          [
            "ㄴ",
            "측정 시각"
          ],
          [
            "ㄷ",
            "그림자 길이(cm)"
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
    "explanation": "이 자료는 같은 장소에서 시각에 따라 고도·그림자·기온이 어떻게 달라지는지 비교한다. 따라서 세 그래프의 가로축에는 공통으로 측정 시각인 ㄴ을 놓는다. 각 세로축은 해당 양과 단위를 따로 표시한다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T04",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set1-questions",
        "set": 1,
        "no": 5
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "daily",
      "task": "x-axis",
      "model": "daily"
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "표와 그래프 읽기",
      "inquirySkill": "자료의 축·단위·최댓값 범위 해석",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T04",
      "format": "short-text",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄴ"
        ]
      },
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "1-6",
    "id": "c22-s62-u01-v006",
    "status": "authored",
    "kind": "mc",
    "prompt": "9:40에서 11:40으로 바뀐 두 기록을 바르게 설명한 것을 고르세요.",
    "givens": {
      "자료종류": "같은 장소의 단순화 고도·그림자 계산과 기온 연습값. 학생 실측이나 정밀 역서가 아니다.",
      "조건": "수평면의 같은 수직 막대(15 cm). 모형에서 남중은 12:40으로 설정한다. 기온은 통풍 그늘에서 읽는 값에 해당하는 연습값이다.",
      "기록": {
        "머리": [
          "시각",
          "태양 고도(°)",
          "그림자 길이(cm)",
          "기온(℃)"
        ],
        "행": [
          [
            "9:40",
            43,
            16.1,
            16
          ],
          [
            "10:40",
            53.9,
            11,
            18
          ],
          [
            "11:40",
            62.4,
            7.8,
            20
          ],
          [
            "12:40",
            66,
            6.7,
            22
          ],
          [
            "13:40",
            62.4,
            7.8,
            24
          ],
          [
            "14:40",
            53.9,
            11,
            25
          ],
          [
            "15:40",
            43,
            16.1,
            24
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3
    },
    "explanation": "표에서 두 시각의 고도를 비교하면 증가하고 그림자 길이는 감소하며 기온은 증가한다. 고도가 높을수록 같은 막대 그림자는 짧아지는 관계에 맞는다. 기온 증가는 이 연습 기록에서 확인한 것으로 모든 날의 오전 날씨를 보장하지 않는다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T03",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set1-questions",
        "set": 1,
        "no": 6
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "daily",
      "task": "morning",
      "model": "daily"
    },
    "choices": [
      "세 양은 모두 계속 낮아졌다.",
      "태양 고도는 낮아지고 그림자는 짧아졌다.",
      "태양 고도는 높아지고 그림자와 기온은 모두 줄었다.",
      "고도·기온은 증가하고 그림자는 짧아졌다.",
      "기온이 올랐으므로 이 두 시각의 고도는 같았다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "하루 고도와 그림자",
      "inquirySkill": "같은 막대의 시간별 관계 비교",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T03",
      "format": "single-choice",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 3
      },
      "type": "single-choice",
      "answer": 3
    }
  },
  {
    "key": "1-7",
    "id": "c22-s62-u01-v007",
    "status": "authored",
    "kind": "st",
    "prompt": "기록을 바르게 해석한 친구의 기호를 쓰세요.",
    "givens": {
      "자료종류": "같은 장소의 단순화 고도·그림자 계산과 기온 연습값. 학생 실측이나 정밀 역서가 아니다.",
      "조건": "수평면의 같은 수직 막대(15 cm). 모형에서 남중은 12:40으로 설정한다. 기온은 통풍 그늘에서 읽는 값에 해당하는 연습값이다.",
      "기록": {
        "머리": [
          "시각",
          "태양 고도(°)",
          "그림자 길이(cm)",
          "기온(℃)"
        ],
        "행": [
          [
            "9:40",
            43,
            16.1,
            16
          ],
          [
            "10:40",
            53.9,
            11,
            18
          ],
          [
            "11:40",
            62.4,
            7.8,
            20
          ],
          [
            "12:40",
            66,
            6.7,
            22
          ],
          [
            "13:40",
            62.4,
            7.8,
            24
          ],
          [
            "14:40",
            53.9,
            11,
            25
          ],
          [
            "15:40",
            43,
            16.1,
            24
          ]
        ]
      },
      "말": {
        "머리": [
          "기호",
          "설명"
        ],
        "행": [
          [
            "ㄱ",
            "고도 최고와 기온 최고가 서로 다른 시각이다."
          ],
          [
            "ㄴ",
            "고도와 기온의 최고가 같은 시각이다."
          ],
          [
            "ㄷ",
            "기온은 언제나 남중 순간에 내려가기 시작한다."
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "이 자료에서 고도가 가장 높은 기록은 12:40이고 기온이 가장 높은 기록은 14:40이다. 따라서 두 시각이 다르다는 ㄱ이 맞다. 지표와 공기가 데워지는 과정 때문에 기온이 늦게 높아질 수 있지만 시차를 모든 날에 고정하지는 않는다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T05",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set1-questions",
        "set": 1,
        "no": 7
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "daily",
      "task": "peak-lag",
      "model": "daily"
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "기온의 시간차",
      "inquirySkill": "최고 고도와 최고 기온의 시점 구별",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T05",
      "format": "short-text",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄱ"
        ]
      },
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "1-8",
    "id": "c22-s62-u01-v008",
    "status": "authored",
    "kind": "mc",
    "prompt": "같은 장소의 계절별 태양 경로를 비교할 때 바르게 세운 기준을 고르세요.",
    "givens": {
      "조건": "우리나라의 같은 자리에서 주변 방위와 지평선을 같게 두고 서로 다른 계절의 경로를 비교한다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4
    },
    "explanation": "계절 경로 비교는 같은 지평선·방위·장소 조건에서 남중 고도와 낮길이를 확인해야 한다. 태양이 뜨는 방위는 계절에 따라 달라질 수 있다. 장소나 그림 크기의 차이를 계절 효과와 섞으면 타당한 비교가 되지 않는다.",
    "scope": "core",
    "standards": [
      "6과13-02"
    ],
    "type": "T06",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set1-questions",
        "set": 1,
        "no": 8
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "choices": [
      "떠오르는 위치를 매일 정동쪽으로 고정해 그린다.",
      "고도가 다르면 태양 자체의 크기가 달라진다고 쓴다.",
      "그림을 크게 그린 계절의 기온이 항상 최고라고 쓴다.",
      "관찰 장소를 바꿔 얻은 높이 차이를 계절 차이라 쓴다.",
      "남중 고도와 해가 떠 있는 시간을 날짜별로 비교한다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "계절별 남중 고도",
      "inquirySkill": "같은 지역의 계절·경로 관계 분류",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T06",
      "format": "single-choice",
      "standard": "6과13-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 4
      },
      "type": "single-choice",
      "answer": 4
    }
  },
  {
    "key": "1-9",
    "id": "c22-s62-u01-v009",
    "status": "authored",
    "kind": "mc",
    "prompt": "월별 모형 표에서 남중 고도가 가장 높은 달과 낮이 가장 짧은 달을 차례로 고르세요.",
    "givens": {
      "자료종류": "같은 북반구 중위도 장소의 월별 비교 연습 모형. 실제 누리집에서 수집한 관측값이 아니다.",
      "조건": "낮길이는 굴절 없는 태양 중심의 기하학적 모형이다. 월별 기온은 별도의 연습값이다.",
      "기록": {
        "머리": [
          "월",
          "남중 고도(°)",
          "낮의 길이",
          "월평균 기온(℃)"
        ],
        "행": [
          [
            1,
            34.1,
            "9시간 58분",
            1
          ],
          [
            2,
            42.5,
            "10시간 52분",
            4
          ],
          [
            3,
            54,
            "12시간 0분",
            9
          ],
          [
            4,
            65.5,
            "13시간 8분",
            15
          ],
          [
            5,
            73.9,
            "14시간 2분",
            20
          ],
          [
            6,
            77,
            "14시간 24분",
            24
          ],
          [
            7,
            73.9,
            "14시간 2분",
            27
          ],
          [
            8,
            65.5,
            "13시간 8분",
            28
          ],
          [
            9,
            54,
            "12시간 0분",
            23
          ],
          [
            10,
            42.5,
            "10시간 52분",
            17
          ],
          [
            11,
            34.1,
            "9시간 58분",
            10
          ],
          [
            12,
            31,
            "9시간 36분",
            4
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0
    },
    "explanation": "남중 고도 열의 최댓값은 6월에 있고 낮길이 열의 최솟값은 12월에 있다. 월평균 기온의 최댓값을 남중 고도 최대로 대신 읽으면 8월을 고르게 된다. 이 표는 비교 모형이며 실제 절기 날짜를 월별 표본만으로 확정한 것은 아니다.",
    "scope": "core",
    "standards": [
      "6과13-02"
    ],
    "type": "T07",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set1-questions",
        "set": 1,
        "no": 9
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "monthly",
      "task": "alt-max-day-min",
      "model": "monthly"
    },
    "choices": [
      "6월, 12월",
      "8월, 12월",
      "6월, 8월",
      "12월, 6월",
      "3월, 9월"
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "낮길이와 계절 자료",
      "inquirySkill": "날짜별 두 양 비교와 범위 추론",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T07",
      "format": "single-choice",
      "standard": "6과13-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 0
      },
      "type": "single-choice",
      "answer": 0
    }
  },
  {
    "key": "1-10",
    "id": "c22-s62-u01-v010",
    "status": "authored",
    "kind": "st",
    "prompt": "같은 양의 빛이 더 작은 넓이에 모인 쪽의 기호를 쓰세요.",
    "givens": {
      "자료종류": "같은 양의 빛을 같은 시간 비추는 넓이 모형. 에너지 단위는 비교용 연습 단위이며 기온 측정값은 없다.",
      "조건": "광원 밝기·광원에서 종이 중심까지 거리·시간·종이 재질을 같게 한다. 빛과 종이가 이루는 각만 달리한다.",
      "비교": {
        "머리": [
          "기호",
          "받은 에너지(연습 단위)",
          "빛이 퍼진 넓이(같은 크기 칸)"
        ],
        "행": [
          [
            "ㄱ",
            24,
            8
          ],
          [
            "ㄴ",
            24,
            4
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
    "explanation": "두 경우 모두 같은 시간에 받은 총에너지는 24단위이다. ㄴ은 4칸, ㄱ은 8칸에 퍼지므로 ㄴ의 한 칸당 에너지가 더 많다. 같은 빛이 좁게 모이는 경우를 고르는 문제이며 실제 기온을 측정한 결과로 바꾸어 말하지 않는다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T08",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set1-questions",
        "set": 1,
        "no": 10
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "footprint",
      "task": "denser",
      "model": "footprint"
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "빛과 단위면적 에너지",
      "inquirySkill": "같은 양의 빛과 퍼진 넓이 비교",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T08",
      "format": "short-text",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄴ"
        ]
      },
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "1-11",
    "id": "c22-s62-u01-v011",
    "status": "authored",
    "kind": "st",
    "prompt": "빛의 입사각만 바꾸려는 비교에서 다르게 해야 할 조건의 기호를 쓰세요.",
    "givens": {
      "조건": "받침의 재질·비춘 시간·광원 밝기와 광원에서 종이 중심까지 거리는 같다.",
      "항목": {
        "머리": [
          "기호",
          "조건"
        ],
        "행": [
          [
            "ㄱ",
            "광원 밝기"
          ],
          [
            "ㄴ",
            "종이 재질"
          ],
          [
            "ㄷ",
            "빛과 종이가 이루는 각"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "입사각 효과를 알아보려면 바로 그 각인 ㄷ을 조작 변인으로 삼는다. 밝기나 재질까지 함께 바꾸면 어느 조건 때문에 차이가 생겼는지 가릴 수 없다. 광원과 종이 중심의 거리도 고정해야 비교가 분명해진다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T09",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set1-questions",
        "set": 1,
        "no": 11
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "가설과 변인 통제",
      "inquirySkill": "달리할 조건·같게 할 조건 특정",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T09",
      "format": "short-text",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄷ"
        ]
      },
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "1-12",
    "id": "c22-s62-u01-v012",
    "status": "authored",
    "kind": "mc",
    "prompt": "우리나라의 계절별 기온 경향을 설명하는 데 필요한 과학적 연결을 고르세요.",
    "givens": {
      "조건": "한 장소의 계절적 경향을 설명한다. 특정 하루의 날씨를 예측하는 문제는 아니다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
    },
    "explanation": "같은 장소에서 계절에 따라 남중 고도와 낮길이가 달라지면 지표가 받는 태양 에너지에도 차이가 생긴다. 이 차이는 계절의 기온 경향을 설명하는 근거다. 날씨·구름·바람 등의 영향까지 사라지는 것은 아니므로 특정 날의 최고 기온을 강제하지 않는다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T10",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set1-questions",
        "set": 1,
        "no": 12
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "choices": [
      "계절마다 태양 표면 온도가 크게 바뀌어 기온이 달라진다.",
      "고도·낮길이 차이가 받는 에너지 차이를 만든다.",
      "여름이 되면 지구의 크기가 커져 태양과 가까워진다.",
      "지구의 자전축 각도가 해마다 사계절마다 달라져야 한다.",
      "태양이 가장 높은 날은 비가 와도 반드시 가장 덥다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "계절 원인 설명",
      "inquirySkill": "축·공전·고도/낮길이·에너지 연결",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T10",
      "format": "single-choice",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 1
      },
      "type": "single-choice",
      "answer": 1
    }
  },
  {
    "key": "1-13",
    "id": "c22-s62-u01-v013",
    "status": "authored",
    "kind": "st",
    "prompt": "이 표에서 남중 고도가 가장 높은 위치를 우리나라 계절과 연결하면 어느 계절인가요?",
    "givens": {
      "자료종류": "북위 36°의 이상화 계절 비교 모형. 지평선에서 태양 중심이 뜨고 지는 기하학적 낮길이이며 굴절·태양 원반 보정은 없다.",
      "조건": "같은 장소·수평면, 각 날짜의 남중 고도. 표의 두 중간 위치를 봄/가을 중 하나로 단정할 필요는 없다.",
      "기록": {
        "머리": [
          "위치",
          "남중 고도(°)",
          "낮의 길이"
        ],
        "행": [
          [
            "ㄱ",
            54,
            "12시간 0분"
          ],
          [
            "ㄷ",
            77,
            "14시간 24분"
          ],
          [
            "ㄹ",
            54,
            "12시간 0분"
          ],
          [
            "ㄴ",
            31,
            "9시간 36분"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "여름",
        "여름철"
      ]
    },
    "explanation": "같은 장소의 네 위치 중 ㄷ의 남중 고도가 가장 높고 낮도 가장 길다. 우리나라에서 이 관계는 여름에 해당한다. 여름의 높은 남중 고도는 같은 시간 같은 면적이 받는 빛이 많아지는 것과 연결되며, 모든 여름날이 다른 날보다 덥다는 뜻은 아니다.",
    "scope": "core",
    "standards": [
      "6과13-02"
    ],
    "type": "T06",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set1-questions",
        "set": 1,
        "no": 13
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "seasonal",
      "task": "highest-season",
      "model": "seasonal"
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "계절별 남중 고도",
      "inquirySkill": "같은 지역의 계절·경로 관계 분류",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T06",
      "format": "short-text",
      "standard": "6과13-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "여름",
          "여름철"
        ]
      },
      "type": "short-text",
      "answer": "여름",
      "accepted": [
        "여름",
        "여름철"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "1-14",
    "id": "c22-s62-u01-v014",
    "status": "authored",
    "kind": "written",
    "prompt": "우리나라가 겨울인 위치의 기호를 쓰고, 남중 고도와 낮길이 두 자료를 근거로 설명하세요.",
    "givens": {
      "자료종류": "북위 36°의 이상화 계절 비교 모형. 지평선에서 태양 중심이 뜨고 지는 기하학적 낮길이이며 굴절·태양 원반 보정은 없다.",
      "조건": "같은 장소·수평면, 각 날짜의 남중 고도. 표의 두 중간 위치를 봄/가을 중 하나로 단정할 필요는 없다.",
      "기록": {
        "머리": [
          "위치",
          "남중 고도(°)",
          "낮의 길이"
        ],
        "행": [
          [
            "ㄱ",
            54,
            "12시간 0분"
          ],
          [
            "ㄷ",
            77,
            "14시간 24분"
          ],
          [
            "ㄹ",
            54,
            "12시간 0분"
          ],
          [
            "ㄴ",
            31,
            "9시간 36분"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "ㄴ이다. 남중 고도가 31°로 가장 낮고 낮의 길이도 표에서 가장 짧기 때문이다.",
      "required": [
        "위치 ㄴ을 특정한다.",
        "같은 장소의 남중 고도 최저를 근거로 든다.",
        "낮길이 최단 자료도 연결한다."
      ],
      "exactStringScoring": false
    },
    "explanation": "ㄴ은 표에서 남중 고도가 가장 낮고 낮길이도 가장 짧은 위치이다. 우리나라의 겨울 조건과 두 자료가 함께 맞는다. 중간 높이가 같은 두 위치를 굳이 봄·가을로 나누거나 지구와 태양 사이 거리를 이유로 들 필요는 없다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T10",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set1-questions",
        "set": 1,
        "no": 14
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "seasonal",
      "task": "winter-evidence",
      "model": "seasonal"
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "계절 원인 설명",
      "inquirySkill": "축·공전·고도/낮길이·에너지 연결",
      "itemType": "written",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T10",
      "format": "written-explanation",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "ㄴ이다. 남중 고도가 31°로 가장 낮고 낮의 길이도 표에서 가장 짧기 때문이다.",
        "required": [
          "위치 ㄴ을 특정한다.",
          "같은 장소의 남중 고도 최저를 근거로 든다.",
          "낮길이 최단 자료도 연결한다."
        ],
        "exactStringScoring": false
      },
      "type": "written-explanation",
      "sample": "ㄴ이다. 남중 고도가 31°로 가장 낮고 낮의 길이도 표에서 가장 짧기 때문이다.",
      "rubric": {
        "required": [
          "위치 ㄴ을 특정한다.",
          "같은 장소의 남중 고도 최저를 근거로 든다.",
          "낮길이 최단 자료도 연결한다."
        ],
        "pass": "조건·자료와 설명의 연결을 선생님이 확인해요."
      }
    }
  },
  {
    "key": "1-15",
    "id": "c22-s62-u01-v015",
    "status": "authored",
    "kind": "st",
    "prompt": "지구의 북쪽 반구가 태양 쪽으로 기울어 북반구 중위도가 여름일 때, 남반구 중위도는 어느 계절인가요?",
    "givens": {
      "조건": "같은 순간의 두 반구를 비교한다. 지구 자전축 방향은 한 해 동안 거의 같고 지구는 태양 둘레를 공전한다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "겨울",
        "겨울철"
      ]
    },
    "explanation": "같은 순간 북쪽 반구가 태양 쪽으로 기울면 남쪽 반구는 태양 반대쪽으로 기울어진다. 북반구 중위도가 여름 조건일 때 남반구 중위도는 남중 고도가 낮고 낮이 짧은 겨울 조건이 된다. 나라 이름을 외우는 대신 축과 두 반구의 관계로 판단한다.",
    "scope": "support",
    "standards": [
      "6과13-03"
    ],
    "type": "T13",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set1-questions",
        "set": 1,
        "no": 15
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "두 반구의 계절",
      "inquirySkill": "같은 순간의 축 관계로 선택 확장",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T13",
      "format": "short-text",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "겨울",
          "겨울철"
        ]
      },
      "type": "short-text",
      "answer": "겨울",
      "accepted": [
        "겨울",
        "겨울철"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "2-1",
    "id": "c22-s62-u01-v016",
    "status": "authored",
    "kind": "mc",
    "prompt": "태양 고도를 친구에게 설명한 말 중 바른 것을 고르세요.",
    "givens": {
      "조건": "운동장의 수평면을 기준으로 같은 하루의 햇빛 방향을 비교한다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
    },
    "explanation": "태양 고도는 수평인 지표면과 태양 쪽 방향이 이루는 각이다. 기온과는 물리량과 단위의 의미가 다르며 하루 동안 변한다. 같은 순간 막대 길이를 바꾸었다고 햇빛 방향이 변하는 것도 아니다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T01",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set2-questions",
        "set": 2,
        "no": 1
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "choices": [
      "기온계가 나타내는 눈금이며 단위는 도(°)이다.",
      "햇빛과 수직 막대 사이의 각을 그대로 부르는 이름이다.",
      "수평 지표면과 태양 쪽 방향이 이루는 각이다.",
      "하루가 끝날 때까지 태양 고도의 값은 바뀌지 않는다.",
      "그림자 길이가 늘면 같은 순간 태양 고도가 반드시 늘어난다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "태양 고도의 기준",
      "inquirySkill": "수평면·빛 방향과 다른 각 구별",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T01",
      "format": "single-choice",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 2
      },
      "type": "single-choice",
      "answer": 2
    }
  },
  {
    "key": "2-2",
    "id": "c22-s62-u01-v017",
    "status": "authored",
    "kind": "st",
    "prompt": "수평 받침과 수직 막대가 준비되어 있습니다. 태양을 직접 보지 않고 고도를 읽는 세 단계를 순서대로 쓰세요.",
    "givens": {
      "단계": {
        "머리": [
          "기호",
          "할 일"
        ],
        "행": [
          [
            "ㄱ",
            "막대 끝과 표시한 그림자 끝을 실로 잇는다."
          ],
          [
            "ㄴ",
            "실과 수평면 사이의 각을 읽는다."
          ],
          [
            "ㄷ",
            "받침을 안전한 햇빛 드는 곳에 두고 그림자 끝을 표시한다."
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "ordered-label-sequence",
      "teacherRequired": false,
      "sequence": [
        "ㄷ",
        "ㄱ",
        "ㄴ"
      ]
    },
    "explanation": "먼저 안전한 자리에서 그림자 끝을 표시해야 실을 연결할 위치가 생긴다. 다음 막대 끝과 그 점을 잇고, 마지막으로 실과 수평면 사이의 각을 읽는다. 따라서 ㄷ→ㄱ→ㄴ이며 태양을 눈으로 겨냥하는 단계는 필요하지 않다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T02",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set2-questions",
        "set": 2,
        "no": 2
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "측정기와 측정 조건",
      "inquirySkill": "수평·수직·순서·반복·안전 확인",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T02",
      "format": "ordered-label-sequence",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "ordered-label-sequence",
        "teacherRequired": false,
        "sequence": [
          "ㄷ",
          "ㄱ",
          "ㄴ"
        ]
      },
      "type": "short-text",
      "answer": "ㄷ → ㄱ → ㄴ",
      "accepted": [
        "ㄷ → ㄱ → ㄴ"
      ],
      "inputHint": "기호를 화살표나 쉼표로 이어 순서대로 써요."
    }
  },
  {
    "key": "2-3",
    "id": "c22-s62-u01-v018",
    "status": "authored",
    "kind": "st",
    "prompt": "같은 순간의 두 장치를 비교해 태양 고도가 더 큰 쪽의 기호를 쓰세요.",
    "givens": {
      "조건": "모두 수평면의 수직 막대이다. 표는 두 지역에서 동시에 얻은 비교용 각 기록이다.",
      "기록": {
        "머리": [
          "기호",
          "막대와 빛 방향 사이의 각"
        ],
        "행": [
          [
            "ㄱ",
            "28°"
          ],
          [
            "ㄴ",
            "51°"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "수평면에서 재는 태양 고도는 수직 막대와 빛 사이 각의 여각이다. ㄱ은 62°, ㄴ은 39°이므로 고도가 더 큰 쪽은 ㄱ이다. 막대와 빛 사이 각 자체가 더 큰 쪽을 고르면 기준을 거꾸로 적용한 것이다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T01",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set2-questions",
        "set": 2,
        "no": 3
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "complement-comparison",
      "values": [
        28,
        51
      ],
      "labels": [
        "ㄱ",
        "ㄴ"
      ]
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "태양 고도의 기준",
      "inquirySkill": "수평면·빛 방향과 다른 각 구별",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T01",
      "format": "short-text",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄱ"
        ]
      },
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "2-4",
    "id": "c22-s62-u01-v019",
    "status": "authored",
    "kind": "mc",
    "prompt": "기온 연습값 중 가장 높은 값이 기록된 시각을 고르세요.",
    "givens": {
      "자료종류": "같은 장소의 단순화 고도·그림자 계산과 기온 연습값. 학생 실측이나 정밀 역서가 아니다.",
      "조건": "수평면의 같은 수직 막대(15 cm). 모형에서 남중은 12:40으로 설정한다. 기온은 통풍 그늘에서 읽는 값에 해당하는 연습값이다.",
      "기록": {
        "머리": [
          "시각",
          "태양 고도(°)",
          "그림자 길이(cm)",
          "기온(℃)"
        ],
        "행": [
          [
            "9:40",
            43,
            16.1,
            16
          ],
          [
            "10:40",
            53.9,
            11,
            18
          ],
          [
            "11:40",
            62.4,
            7.8,
            20
          ],
          [
            "12:40",
            66,
            6.7,
            22
          ],
          [
            "13:40",
            62.4,
            7.8,
            24
          ],
          [
            "14:40",
            53.9,
            11,
            25
          ],
          [
            "15:40",
            43,
            16.1,
            24
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3
    },
    "explanation": "기온 열에서 가장 큰 값은 25℃이고 그 기록의 시각은 14:40이다. 고도가 가장 높은 시각을 먼저 고르고 기온 최고로 대신 답하면 안 된다. 이는 제공된 기록의 최고이며 어떤 날이나 같은 시각에 최고가 된다는 규칙은 아니다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T05",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set2-questions",
        "set": 2,
        "no": 4
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "daily",
      "task": "temperature-max-time",
      "model": "daily"
    },
    "choices": [
      "10:40",
      "11:40",
      "12:40",
      "14:40",
      "15:40"
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "기온의 시간차",
      "inquirySkill": "최고 고도와 최고 기온의 시점 구별",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T05",
      "format": "single-choice",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 3
      },
      "type": "single-choice",
      "answer": 3
    }
  },
  {
    "key": "2-5",
    "id": "c22-s62-u01-v020",
    "status": "authored",
    "kind": "st",
    "prompt": "이 기록의 10:40~11:40 비교를 바르게 말한 기호를 쓰세요.",
    "givens": {
      "자료종류": "같은 장소의 단순화 고도·그림자 계산과 기온 연습값. 학생 실측이나 정밀 역서가 아니다.",
      "조건": "수평면의 같은 수직 막대(15 cm). 모형에서 남중은 12:40으로 설정한다. 기온은 통풍 그늘에서 읽는 값에 해당하는 연습값이다.",
      "기록": {
        "머리": [
          "시각",
          "태양 고도(°)",
          "그림자 길이(cm)",
          "기온(℃)"
        ],
        "행": [
          [
            "9:40",
            43,
            16.1,
            16
          ],
          [
            "10:40",
            53.9,
            11,
            18
          ],
          [
            "11:40",
            62.4,
            7.8,
            20
          ],
          [
            "12:40",
            66,
            6.7,
            22
          ],
          [
            "13:40",
            62.4,
            7.8,
            24
          ],
          [
            "14:40",
            53.9,
            11,
            25
          ],
          [
            "15:40",
            43,
            16.1,
            24
          ]
        ]
      },
      "말": {
        "머리": [
          "기호",
          "설명"
        ],
        "행": [
          [
            "ㄱ",
            "고도가 올라갔지만 기온은 내려갔다."
          ],
          [
            "ㄴ",
            "고도와 기온이 함께 올라갔다."
          ],
          [
            "ㄷ",
            "기온이 올라갔으므로 두 고도는 같았다."
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
    "explanation": "두 시각의 고도 열과 기온 열을 각각 비교하면 둘 다 증가한다. 따라서 ㄴ이 맞다. 같은 표에서 오후에는 고도가 낮아져도 기온이 더 오르는 구간이 있으므로, 이 오전 두 기록의 관계를 하루 전체의 즉각적인 비례 관계로 바꾸지 않는다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T03",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set2-questions",
        "set": 2,
        "no": 5
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "daily",
      "task": "morning",
      "model": "daily"
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "하루 고도와 그림자",
      "inquirySkill": "같은 막대의 시간별 관계 비교",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T03",
      "format": "short-text",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄴ"
        ]
      },
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "2-6",
    "id": "c22-s62-u01-v021",
    "status": "authored",
    "kind": "written",
    "prompt": "12:40과 14:40의 자료를 이용해 같은 막대의 태양 고도와 그림자 길이 관계를 설명하세요.",
    "givens": {
      "자료종류": "같은 장소의 단순화 고도·그림자 계산과 기온 연습값. 학생 실측이나 정밀 역서가 아니다.",
      "조건": "수평면의 같은 수직 막대(15 cm). 모형에서 남중은 12:40으로 설정한다. 기온은 통풍 그늘에서 읽는 값에 해당하는 연습값이다.",
      "기록": {
        "머리": [
          "시각",
          "태양 고도(°)",
          "그림자 길이(cm)"
        ],
        "행": [
          [
            "9:40",
            43,
            16.1
          ],
          [
            "10:40",
            53.9,
            11
          ],
          [
            "11:40",
            62.4,
            7.8
          ],
          [
            "12:40",
            66,
            6.7
          ],
          [
            "13:40",
            62.4,
            7.8
          ],
          [
            "14:40",
            53.9,
            11
          ],
          [
            "15:40",
            43,
            16.1
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "12:40보다 14:40의 태양 고도가 낮고 그림자가 더 길다. 같은 막대는 태양 고도가 낮아지면 그림자가 길어진다.",
      "required": [
        "두 시각을 바르게 비교한다.",
        "고도 감소와 그림자 증가를 서로 연결한다.",
        "같은 수직 막대·수평면 조건을 유지한다."
      ],
      "exactStringScoring": false
    },
    "explanation": "12:40에서 14:40으로 가면 고도는 66°에서 53.9°로 낮아지고 그림자는 6.7 cm에서 11 cm로 길어진다. 같은 수직 막대의 그림자는 낮은 각도의 빛에서 더 멀리 뻗는다. 기온을 이 고도·길이 관계의 단위나 판정 기준으로 섞지 않는다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T03",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set2-questions",
        "set": 2,
        "no": 6
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "daily",
      "task": "afternoon-shadow",
      "model": "daily"
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "하루 고도와 그림자",
      "inquirySkill": "같은 막대의 시간별 관계 비교",
      "itemType": "written",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T03",
      "format": "written-explanation",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "12:40보다 14:40의 태양 고도가 낮고 그림자가 더 길다. 같은 막대는 태양 고도가 낮아지면 그림자가 길어진다.",
        "required": [
          "두 시각을 바르게 비교한다.",
          "고도 감소와 그림자 증가를 서로 연결한다.",
          "같은 수직 막대·수평면 조건을 유지한다."
        ],
        "exactStringScoring": false
      },
      "type": "written-explanation",
      "sample": "12:40보다 14:40의 태양 고도가 낮고 그림자가 더 길다. 같은 막대는 태양 고도가 낮아지면 그림자가 길어진다.",
      "rubric": {
        "required": [
          "두 시각을 바르게 비교한다.",
          "고도 감소와 그림자 증가를 서로 연결한다.",
          "같은 수직 막대·수평면 조건을 유지한다."
        ],
        "pass": "조건·자료와 설명의 연결을 선생님이 확인해요."
      }
    }
  },
  {
    "key": "2-7",
    "id": "c22-s62-u01-v022",
    "status": "authored",
    "kind": "mc",
    "prompt": "해당 날짜·장소의 자료에 남중 시각이 12:47로 명시되어 있습니다. 우리나라 이 관측점에서 그때의 태양 위치를 바르게 고르세요.",
    "givens": {
      "조건": "같은 날짜의 같은 관측점이다. 12:47은 이 자료에서 제시한 남중 시각이며 한국 어디서나 고정된 시각이라는 뜻은 아니다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4
    },
    "explanation": "남중은 태양이 그 장소의 자오선을 지나 하루 중 가장 높은 고도에 이르는 때이다. 문제에서 해당 남중 시각을 12:47로 주었으므로 그때 남쪽 하늘에서 가장 높다. 남중 시각은 장소와 날짜에 따라 달라져 고정된 시계 정오와 구별한다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T03",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set2-questions",
        "set": 2,
        "no": 7
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "choices": [
      "12:00에 반드시 머리 바로 위를 지나는 위치이다.",
      "12:47에 동쪽 지평선에서 처음 떠오르는 위치이다.",
      "13:47에 남쪽 하늘에서 그날 가장 낮은 고도이다.",
      "14:47에 기온이 최고이므로 남중하는 위치이다.",
      "12:47에 남쪽 하늘에서 그날 가장 높은 고도이다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "하루 고도와 그림자",
      "inquirySkill": "같은 막대의 시간별 관계 비교",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T03",
      "format": "single-choice",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 4
      },
      "type": "single-choice",
      "answer": 4
    }
  },
  {
    "key": "2-8",
    "id": "c22-s62-u01-v023",
    "status": "authored",
    "kind": "st",
    "prompt": "네 계절 비교표가 직접 알려 주는 내용의 기호를 쓰세요.",
    "givens": {
      "자료종류": "북위 36°의 이상화 계절 비교 모형. 지평선에서 태양 중심이 뜨고 지는 기하학적 낮길이이며 굴절·태양 원반 보정은 없다.",
      "조건": "같은 장소·수평면, 각 날짜의 남중 고도. 표의 두 중간 위치를 봄/가을 중 하나로 단정할 필요는 없다.",
      "기록": {
        "머리": [
          "위치",
          "남중 고도(°)",
          "낮의 길이"
        ],
        "행": [
          [
            "ㄱ",
            54,
            "12시간 0분"
          ],
          [
            "ㄷ",
            77,
            "14시간 24분"
          ],
          [
            "ㄹ",
            54,
            "12시간 0분"
          ],
          [
            "ㄴ",
            31,
            "9시간 36분"
          ]
        ]
      },
      "항목": {
        "머리": [
          "기호",
          "내용"
        ],
        "행": [
          [
            "ㄱ",
            "같은 장소의 계절별 남중 고도와 낮길이 차이"
          ],
          [
            "ㄴ",
            "하루 안의 시각별 태양 밝기 변화"
          ],
          [
            "ㄷ",
            "지구의 공전 속도를 직접 잰 결과"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "표의 행은 같은 하루의 시각들이 아니라 서로 다른 계절 위치이다. 각 행에는 남중 고도와 낮길이가 있으므로 ㄱ을 비교할 수 있다. 태양 밝기나 공전 속도는 이 표에 없으며 자료가 말해 주지 않는 양을 측정했다고 할 수 없다.",
    "scope": "core",
    "standards": [
      "6과13-02"
    ],
    "type": "T06",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set2-questions",
        "set": 2,
        "no": 8
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "seasonal",
      "task": "evidence-scope",
      "model": "seasonal"
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "계절별 남중 고도",
      "inquirySkill": "같은 지역의 계절·경로 관계 분류",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T06",
      "format": "short-text",
      "standard": "6과13-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄱ"
        ]
      },
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "2-9",
    "id": "c22-s62-u01-v024",
    "status": "authored",
    "kind": "mc",
    "prompt": "겨울 비교 위치 ㄴ에서 여름 비교 위치 ㄷ으로 바뀔 때 두 양의 변화를 고르세요.",
    "givens": {
      "자료종류": "북위 36°의 이상화 계절 비교 모형. 지평선에서 태양 중심이 뜨고 지는 기하학적 낮길이이며 굴절·태양 원반 보정은 없다.",
      "조건": "같은 장소·수평면, 각 날짜의 남중 고도. 표의 두 중간 위치를 봄/가을 중 하나로 단정할 필요는 없다.",
      "기록": {
        "머리": [
          "위치",
          "남중 고도(°)",
          "낮의 길이"
        ],
        "행": [
          [
            "ㄱ",
            54,
            "12시간 0분"
          ],
          [
            "ㄷ",
            77,
            "14시간 24분"
          ],
          [
            "ㄹ",
            54,
            "12시간 0분"
          ],
          [
            "ㄴ",
            31,
            "9시간 36분"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0
    },
    "explanation": "ㄴ의 남중 고도는 31°, ㄷ은 77°이며 낮길이도 ㄴ보다 ㄷ에서 더 길다. 같은 북반구 중위도 장소의 겨울·여름 비교에 맞는 변화이다. 두 열을 따로 확인해야 한 양만 바르게 읽고 다른 양을 뒤집는 실수를 줄일 수 있다.",
    "scope": "core",
    "standards": [
      "6과13-02"
    ],
    "type": "T07",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set2-questions",
        "set": 2,
        "no": 9
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "seasonal",
      "task": "winter-to-summer",
      "model": "seasonal"
    },
    "choices": [
      "고도는 높아지고 낮은 길어진다.",
      "남중 고도는 높아지지만 낮은 짧아진다.",
      "남중 고도는 낮아지고 낮은 길어진다.",
      "남중 고도와 낮의 길이가 모두 작아진다.",
      "공전 중이므로 두 양 모두 변하지 않는다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "낮길이와 계절 자료",
      "inquirySkill": "날짜별 두 양 비교와 범위 추론",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T07",
      "format": "single-choice",
      "standard": "6과13-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 0
      },
      "type": "single-choice",
      "answer": 0
    }
  },
  {
    "key": "2-10",
    "id": "c22-s62-u01-v025",
    "status": "authored",
    "kind": "mc",
    "prompt": "빛 넓이 모형에서 태양의 고도 차이에 대응하여 바꾸는 조작을 고르세요.",
    "givens": {
      "자료종류": "같은 양의 빛을 같은 시간 비추는 넓이 모형. 에너지 단위는 비교용 연습 단위이며 기온 측정값은 없다.",
      "조건": "광원 밝기·광원에서 종이 중심까지 거리·시간·종이 재질을 같게 한다. 빛과 종이가 이루는 각만 달리한다.",
      "비교": {
        "머리": [
          "기호",
          "받은 에너지(연습 단위)",
          "빛이 퍼진 넓이(같은 크기 칸)"
        ],
        "행": [
          [
            "ㄱ",
            24,
            8
          ],
          [
            "ㄴ",
            24,
            4
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
    },
    "explanation": "태양 고도 차이에 대응하는 것은 수평 지표면으로 들어오는 빛의 각도 차이다. 따라서 같은 광원·거리·재질·시간을 유지하며 빛과 종이 사이 각을 바꾼다. 밝기나 시간을 바꾸면 각도 효과만 비교한 것이 아니다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T09",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set2-questions",
        "set": 2,
        "no": 10
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "footprint",
      "task": "manipulated-variable",
      "model": "footprint"
    },
    "choices": [
      "같은 종이를 색이 다른 재료로 교체한다.",
      "빛과 종이가 이루는 각을 바꾼다.",
      "광원의 밝기를 강한 값과 약한 값으로 바꾼다.",
      "빛을 비추는 시간을 두 배로 늘려 비교한다.",
      "모형의 광원과 종이 중심 거리를 달리한다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "가설과 변인 통제",
      "inquirySkill": "달리할 조건·같게 할 조건 특정",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T09",
      "format": "single-choice",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 1
      },
      "type": "single-choice",
      "answer": 1
    }
  },
  {
    "key": "2-11",
    "id": "c22-s62-u01-v026",
    "status": "authored",
    "kind": "st",
    "prompt": "표의 한 칸이 받는 에너지 양을 비교한 설명 중 맞는 기호를 쓰세요.",
    "givens": {
      "자료종류": "같은 양의 빛을 같은 시간 비추는 넓이 모형. 에너지 단위는 비교용 연습 단위이며 기온 측정값은 없다.",
      "조건": "광원 밝기·광원에서 종이 중심까지 거리·시간·종이 재질을 같게 한다. 빛과 종이가 이루는 각만 달리한다.",
      "비교": {
        "머리": [
          "기호",
          "받은 에너지(연습 단위)",
          "빛이 퍼진 넓이(같은 크기 칸)"
        ],
        "행": [
          [
            "ㄱ",
            24,
            8
          ],
          [
            "ㄴ",
            24,
            4
          ]
        ]
      },
      "말": {
        "머리": [
          "기호",
          "설명"
        ],
        "행": [
          [
            "ㄱ",
            "ㄱ과 ㄴ이 항상 한 칸당 같은 양을 받는다."
          ],
          [
            "ㄴ",
            "더 넓게 퍼진 ㄱ의 한 칸이 더 많이 받는다."
          ],
          [
            "ㄷ",
            "더 좁게 퍼진 ㄴ의 한 칸이 더 많이 받는다."
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "총에너지 24단위를 8칸에 나눈 ㄱ은 한 칸당 3단위, 4칸의 ㄴ은 한 칸당 6단위이다. 같은 크기 한 칸에서 비교하면 ㄴ이 더 많이 받으므로 ㄷ이 맞다. 총에너지 같음과 단위면적 에너지 같음은 다른 뜻이다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T08",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set2-questions",
        "set": 2,
        "no": 11
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "footprint",
      "task": "density-compare",
      "model": "footprint"
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "빛과 단위면적 에너지",
      "inquirySkill": "같은 양의 빛과 퍼진 넓이 비교",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T08",
      "format": "short-text",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄷ"
        ]
      },
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "2-12",
    "id": "c22-s62-u01-v027",
    "status": "authored",
    "kind": "mc",
    "prompt": "태양 고도 차이와 에너지를 연결한 설명 중 타당한 것을 고르세요.",
    "givens": {
      "조건": "같은 양의 햇빛을 같은 시간 같은 재질의 수평면에 비춘다고 단순화한다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
    },
    "explanation": "같은 빛이 높은 각도로 수평면에 닿으면 좁은 넓이에 퍼진다. 따라서 같은 면적이 같은 시간 받는 에너지 양은 커진다. 이 비교는 빛이 퍼지는 방식의 차이이며 태양 온도 변화나 모든 날의 기온 시각을 증명하지 않는다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T08",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set2-questions",
        "set": 2,
        "no": 12
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "choices": [
      "낮은 고도로 들어오는 빛은 좁게 모여 같은 면적이 더 많이 받는다.",
      "높은 고도로 들어오는 빛은 태양 자체가 더 뜨거워진 증거가 된다.",
      "높은 고도의 빛은 좁게 모여 같은 면적에 더 많이 닿는다.",
      "낮은 고도로 들어오는 빛은 지표면 전체에 도달하지 않고 사라진다.",
      "높은 고도로 들어오는 빛이면 매일의 기온 최고 시각도 같아진다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "빛과 단위면적 에너지",
      "inquirySkill": "같은 양의 빛과 퍼진 넓이 비교",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T08",
      "format": "single-choice",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 2
      },
      "type": "single-choice",
      "answer": 2
    }
  },
  {
    "key": "2-13",
    "id": "c22-s62-u01-v028",
    "status": "authored",
    "kind": "written",
    "prompt": "북반구 중위도가 여름일 때 남반구 중위도는 겨울인 까닭을 축의 기울어짐과 연결해 설명하세요.",
    "givens": {
      "조건": "지구가 공전하는 동안 자전축은 같은 방향을 향한다. 같은 순간 두 반구를 비교하며 한 반구만 태양에서 따로 멀어지는 모형은 아니다."
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "북반구가 태양 쪽으로 기울어진 때 남반구는 반대쪽으로 기울어진다. 남반구 중위도는 낮은 남중 고도와 짧은 낮의 조건이 되어 겨울이다.",
      "required": [
        "같은 순간 두 반구가 태양을 향해 기울어진 관계가 반대임을 설명한다.",
        "남반구의 낮은 고도 또는 짧은 낮을 겨울과 연결한다.",
        "지구와 태양 사이 거리만을 원인으로 삼지 않는다."
      ],
      "exactStringScoring": false
    },
    "explanation": "자전축의 고정된 기울기 때문에 같은 순간 두 반구는 태양 쪽으로 기울어진 정도가 반대이다. 북반구 중위도의 여름 때 남반구 중위도는 낮은 고도·짧은 낮 조건을 갖는다. 두 반구가 공유하는 지구와 태양 사이 거리만으로 반대 계절을 설명할 수는 없다.",
    "scope": "support",
    "standards": [
      "6과13-03"
    ],
    "type": "T13",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set2-questions",
        "set": 2,
        "no": 13
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "두 반구의 계절",
      "inquirySkill": "같은 순간의 축 관계로 선택 확장",
      "itemType": "written",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T13",
      "format": "written-explanation",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "북반구가 태양 쪽으로 기울어진 때 남반구는 반대쪽으로 기울어진다. 남반구 중위도는 낮은 남중 고도와 짧은 낮의 조건이 되어 겨울이다.",
        "required": [
          "같은 순간 두 반구가 태양을 향해 기울어진 관계가 반대임을 설명한다.",
          "남반구의 낮은 고도 또는 짧은 낮을 겨울과 연결한다.",
          "지구와 태양 사이 거리만을 원인으로 삼지 않는다."
        ],
        "exactStringScoring": false
      },
      "type": "written-explanation",
      "sample": "북반구가 태양 쪽으로 기울어진 때 남반구는 반대쪽으로 기울어진다. 남반구 중위도는 낮은 남중 고도와 짧은 낮의 조건이 되어 겨울이다.",
      "rubric": {
        "required": [
          "같은 순간 두 반구가 태양을 향해 기울어진 관계가 반대임을 설명한다.",
          "남반구의 낮은 고도 또는 짧은 낮을 겨울과 연결한다.",
          "지구와 태양 사이 거리만을 원인으로 삼지 않는다."
        ],
        "pass": "조건·자료와 설명의 연결을 선생님이 확인해요."
      }
    }
  },
  {
    "key": "2-14",
    "id": "c22-s62-u01-v029",
    "status": "authored",
    "kind": "mc",
    "prompt": "제시한 계절 모형에서 남중 고도가 가장 높은 여름 위치를 바르게 연결한 것을 고르세요.",
    "givens": {
      "자료종류": "북위 36°의 이상화 계절 비교 모형. 지평선에서 태양 중심이 뜨고 지는 기하학적 낮길이이며 굴절·태양 원반 보정은 없다.",
      "조건": "같은 장소·수평면, 각 날짜의 남중 고도. 표의 두 중간 위치를 봄/가을 중 하나로 단정할 필요는 없다.",
      "기록": {
        "머리": [
          "위치",
          "남중 고도(°)",
          "낮의 길이"
        ],
        "행": [
          [
            "ㄱ",
            54,
            "12시간 0분"
          ],
          [
            "ㄷ",
            77,
            "14시간 24분"
          ],
          [
            "ㄹ",
            54,
            "12시간 0분"
          ],
          [
            "ㄴ",
            31,
            "9시간 36분"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3
    },
    "explanation": "표에서 남중 고도 77°인 ㄷ이 가장 높고 낮길이도 가장 길다. 이 같은 북반구 중위도 지점의 여름에 해당하므로 ㄷ—여름이다. ㄱ과 ㄹ의 고도는 같아 표의 높이만으로 둘을 서로 다른 계절로 나눌 수 없다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T06",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set2-questions",
        "set": 2,
        "no": 14
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "seasonal",
      "task": "highest-label",
      "model": "seasonal"
    },
    "choices": [
      "ㄴ — 여름",
      "ㄱ — 겨울",
      "ㄹ — 여름",
      "ㄷ — 여름",
      "ㄷ — 겨울"
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "계절별 남중 고도",
      "inquirySkill": "같은 지역의 계절·경로 관계 분류",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T06",
      "format": "single-choice",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 3
      },
      "type": "single-choice",
      "answer": 3
    }
  },
  {
    "key": "2-15",
    "id": "c22-s62-u01-v030",
    "status": "authored",
    "kind": "mc",
    "prompt": "하루 안에서 같은 막대의 그림자 방향·길이가 달라지는 현상을 먼저 설명하는 지구의 운동은 무엇인가요?",
    "givens": {
      "조건": "같은 장소의 오전·낮·오후를 비교한다. 여러 계절 비교가 아니다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4
    },
    "explanation": "하루 동안 지구가 자전하면서 같은 장소에서 바라본 태양의 방향과 고도가 변한다. 그 결과 같은 막대의 그림자도 달라진다. 공전과 기울어진 축은 여러 계절의 남중 고도 비교를 설명하며, 하루 안의 변화와 시간 범위를 구별해야 한다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T10",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set2-questions",
        "set": 2,
        "no": 15
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "choices": [
      "태양 둘레를 일 년에 한 바퀴 도는 공전",
      "계절마다 반복되는 자전축 각도 변화",
      "하루 동안 지구 크기가 커지는 변화",
      "태양이 지구 둘레를 도는 실제 공전",
      "하루에 한 바퀴 도는 자전"
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "계절 원인 설명",
      "inquirySkill": "축·공전·고도/낮길이·에너지 연결",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T10",
      "format": "single-choice",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 4
      },
      "type": "single-choice",
      "answer": 4
    }
  },
  {
    "key": "3-1",
    "id": "c22-s62-u01-v031",
    "status": "authored",
    "kind": "st",
    "prompt": "막대 끝과 그림자 끝을 잇는 실이 수평 받침과 이루는 각을 읽었습니다. 이 측정으로 구하는 양의 이름을 쓰세요.",
    "givens": {
      "조건": "수평 받침에 막대를 수직으로 세웠다. 태양을 직접 보지 않고 그림자를 이용한다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "태양 고도",
        "태양의 고도"
      ]
    },
    "explanation": "실은 막대 끝에서 그림자 끝으로 향하는 햇빛 방향과 나란하다. 수평 받침과 그 방향 사이 각은 태양 고도에 해당한다. 기온이나 그림자 길이와는 측정한 양이 다르며 그림자 길이 자체를 각도로 읽는 것이 아니다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T01",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set3-questions",
        "set": 3,
        "no": 1
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "태양 고도의 기준",
      "inquirySkill": "수평면·빛 방향과 다른 각 구별",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T01",
      "format": "short-text",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "태양 고도",
          "태양의 고도"
        ]
      },
      "type": "short-text",
      "answer": "태양 고도",
      "accepted": [
        "태양 고도",
        "태양의 고도"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "3-2",
    "id": "c22-s62-u01-v032",
    "status": "authored",
    "kind": "st",
    "prompt": "두 학생이 같은 순간 같은 자리에서 길이만 다른 막대로 재었습니다. 옳은 설명의 기호를 쓰세요.",
    "givens": {
      "조건": "막대 P 높이 9 cm, Q 높이 18 cm. 둘 다 같은 수평면에 수직이며 햇빛 방향은 같다.",
      "말": {
        "머리": [
          "기호",
          "설명"
        ],
        "행": [
          [
            "ㄱ",
            "Q의 고도는 P의 두 배다."
          ],
          [
            "ㄴ",
            "Q의 그림자는 더 길고 고도는 같다."
          ],
          [
            "ㄷ",
            "Q의 그림자는 짧고 고도는 크다."
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
    "explanation": "같은 빛의 방향에서 수직 막대 높이가 두 배이면 그림자 길이도 두 배가 된다. 그러나 태양 고도는 수평면과 햇빛 방향의 각이므로 막대 높이와 관계없이 같다. 두 양을 분리해 비교한 ㄴ이 맞다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T02",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set3-questions",
        "set": 3,
        "no": 2
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "scaled-stick",
      "heights": [
        9,
        18
      ],
      "altitude": 35
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "측정기와 측정 조건",
      "inquirySkill": "수평·수직·순서·반복·안전 확인",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T02",
      "format": "short-text",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄴ"
        ]
      },
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "3-3",
    "id": "c22-s62-u01-v033",
    "status": "authored",
    "kind": "mc",
    "prompt": "우리나라 같은 장소에서 태양이 남중한 때를 바르게 설명한 것을 모두 고르세요. (정답 2개)",
    "givens": {
      "조건": "북반구 중위도, 수평면의 같은 수직 막대를 기준으로 한다."
    },
    "responseContract": {
      "kind": "multi-choice",
      "teacherRequired": false,
      "answers": [
        0,
        2
      ]
    },
    "explanation": "우리나라에서는 태양이 남중할 때 남쪽 하늘에서 하루 중 가장 높으며 같은 막대의 그림자는 가장 짧다. 기온 최고 시각은 늦어질 수 있고 낮길이·머리 위 통과를 함께 뜻하지 않는다. 따라서 남쪽의 최고 고도와 최단 그림자를 고른다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T03",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set3-questions",
        "set": 3,
        "no": 3
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "choices": [
      "태양이 그날 남쪽에서 가장 높은 고도에 있다.",
      "그 순간 기온은 어떤 날이나 반드시 가장 높다.",
      "수직 막대의 그림자가 그날 가장 짧다.",
      "낮의 길이가 그 순간 정확히 12시간이 된다.",
      "태양은 머리 위를 지나 모든 그림자가 사라진다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "하루 고도와 그림자",
      "inquirySkill": "같은 막대의 시간별 관계 비교",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T03",
      "format": "multi-choice",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "multi-choice",
        "teacherRequired": false,
        "answers": [
          0,
          2
        ]
      },
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    }
  },
  {
    "key": "3-4",
    "id": "c22-s62-u01-v034",
    "status": "authored",
    "kind": "st",
    "prompt": "여기 제시한 일곱 기록 중 가장 큰 태양 고도를 숫자와 단위로 쓰세요. 정확한 남중 시각을 찾아내라는 문제는 아닙니다.",
    "givens": {
      "자료종류": "같은 장소의 단순화 고도·그림자 계산과 기온 연습값. 학생 실측이나 정밀 역서가 아니다.",
      "조건": "수평면의 같은 수직 막대(15 cm). 모형에서 남중은 12:40으로 설정한다. 기온은 통풍 그늘에서 읽는 값에 해당하는 연습값이다.",
      "기록": {
        "머리": [
          "시각",
          "태양 고도(°)"
        ],
        "행": [
          [
            "9:40",
            43
          ],
          [
            "10:40",
            53.9
          ],
          [
            "11:40",
            62.4
          ],
          [
            "12:40",
            66
          ],
          [
            "13:40",
            62.4
          ],
          [
            "14:40",
            53.9
          ],
          [
            "15:40",
            43
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "number-unit",
      "teacherRequired": false,
      "value": 66,
      "units": [
        "°",
        "도"
      ],
      "unitRequired": true,
      "tolerance": 0
    },
    "explanation": "고도 열의 일곱 값을 비교하면 최댓값은 66°이다. 표에서 관측한 최댓값을 찾는 과제이므로 66°라고 쓴다. 일반적인 성긴 측정표만으로 관측 사이의 정확한 남중 시각까지 확인했다고 확대해서는 안 된다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T04",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set3-questions",
        "set": 3,
        "no": 4
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "daily",
      "task": "sample-max-altitude",
      "model": "daily"
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "표와 그래프 읽기",
      "inquirySkill": "자료의 축·단위·최댓값 범위 해석",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T04",
      "format": "number-unit",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "number-unit",
        "teacherRequired": false,
        "value": 66,
        "units": [
          "°",
          "도"
        ],
        "unitRequired": true,
        "tolerance": 0
      },
      "type": "short-text",
      "answer": "66°",
      "accepted": [
        "66°"
      ],
      "inputHint": "숫자와 각도 단위(° 또는 도)를 함께 써요."
    }
  },
  {
    "key": "3-5",
    "id": "c22-s62-u01-v035",
    "status": "authored",
    "kind": "mc",
    "prompt": "고도·그림자 기록에 근거한 설명을 고르세요.",
    "givens": {
      "자료종류": "같은 장소의 단순화 고도·그림자 계산과 기온 연습값. 학생 실측이나 정밀 역서가 아니다.",
      "조건": "수평면의 같은 수직 막대(15 cm). 모형에서 남중은 12:40으로 설정한다. 기온은 통풍 그늘에서 읽는 값에 해당하는 연습값이다.",
      "기록": {
        "머리": [
          "시각",
          "태양 고도(°)",
          "그림자 길이(cm)"
        ],
        "행": [
          [
            "9:40",
            43,
            16.1
          ],
          [
            "10:40",
            53.9,
            11
          ],
          [
            "11:40",
            62.4,
            7.8
          ],
          [
            "12:40",
            66,
            6.7
          ],
          [
            "13:40",
            62.4,
            7.8
          ],
          [
            "14:40",
            53.9,
            11
          ],
          [
            "15:40",
            43,
            16.1
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0
    },
    "explanation": "표에서 12:40의 고도는 66°로 가장 크고 그림자는 6.7 cm로 가장 짧다. 이후 고도는 낮아지고 그림자는 다시 길어진다. 같은 막대·수평면에서 고도와 그림자 길이가 반대로 변하는 관계와 맞는 기록이다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T04",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set3-questions",
        "set": 3,
        "no": 5
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "daily",
      "task": "minimum-shadow",
      "model": "daily"
    },
    "choices": [
      "12:40의 고도가 가장 높고 그림자는 기록 중 가장 짧다.",
      "9:40부터 15:40까지 고도가 계속 높아진다.",
      "9:40부터 15:40까지 그림자가 계속 짧아진다.",
      "고도가 같은 두 기록도 같은 막대 그림자는 꼭 달라야 한다.",
      "그림자가 길어지는 모든 구간에서 고도도 반드시 높아진다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "표와 그래프 읽기",
      "inquirySkill": "자료의 축·단위·최댓값 범위 해석",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T04",
      "format": "single-choice",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 0
      },
      "type": "single-choice",
      "answer": 0
    }
  },
  {
    "key": "3-6",
    "id": "c22-s62-u01-v036",
    "status": "authored",
    "kind": "st",
    "prompt": "이 자료에서 기온의 최고 기록이 고도 최고 기록보다 늦은 것을 설명한 기호를 쓰세요.",
    "givens": {
      "자료종류": "같은 장소의 단순화 고도·그림자 계산과 기온 연습값. 학생 실측이나 정밀 역서가 아니다.",
      "조건": "수평면의 같은 수직 막대(15 cm). 모형에서 남중은 12:40으로 설정한다. 기온은 통풍 그늘에서 읽는 값에 해당하는 연습값이다.",
      "기록": {
        "머리": [
          "시각",
          "태양 고도(°)",
          "그림자 길이(cm)",
          "기온(℃)"
        ],
        "행": [
          [
            "9:40",
            43,
            16.1,
            16
          ],
          [
            "10:40",
            53.9,
            11,
            18
          ],
          [
            "11:40",
            62.4,
            7.8,
            20
          ],
          [
            "12:40",
            66,
            6.7,
            22
          ],
          [
            "13:40",
            62.4,
            7.8,
            24
          ],
          [
            "14:40",
            53.9,
            11,
            25
          ],
          [
            "15:40",
            43,
            16.1,
            24
          ]
        ]
      },
      "말": {
        "머리": [
          "기호",
          "설명"
        ],
        "행": [
          [
            "ㄱ",
            "고도와 기온은 어떤 관련도 없다."
          ],
          [
            "ㄴ",
            "고도가 낮아져야 태양 자체가 뜨거워진다."
          ],
          [
            "ㄷ",
            "지표와 공기가 데워지는 과정에 시간이 걸릴 수 있다."
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "지표가 햇빛을 받아 데워지고 그 영향으로 공기가 데워지는 과정에는 시간이 필요하다. 따라서 제공 자료처럼 최고 기온 기록이 고도 최고 뒤에 나타날 수 있어 ㄷ이 타당하다. 구름·바람 등 조건이 다르면 최고 기온 시각도 달라질 수 있다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T05",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set3-questions",
        "set": 3,
        "no": 6
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "daily",
      "task": "lag-cause",
      "model": "daily"
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "기온의 시간차",
      "inquirySkill": "최고 고도와 최고 기온의 시점 구별",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T05",
      "format": "short-text",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄷ"
        ]
      },
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "3-7",
    "id": "c22-s62-u01-v037",
    "status": "authored",
    "kind": "mc",
    "prompt": "13:40과 15:40의 두 기록을 바르게 비교한 것을 고르세요.",
    "givens": {
      "자료종류": "같은 장소의 단순화 고도·그림자 계산과 기온 연습값. 학생 실측이나 정밀 역서가 아니다.",
      "조건": "수평면의 같은 수직 막대(15 cm). 모형에서 남중은 12:40으로 설정한다. 기온은 통풍 그늘에서 읽는 값에 해당하는 연습값이다.",
      "기록": {
        "머리": [
          "시각",
          "태양 고도(°)",
          "그림자 길이(cm)"
        ],
        "행": [
          [
            "9:40",
            43,
            16.1
          ],
          [
            "10:40",
            53.9,
            11
          ],
          [
            "11:40",
            62.4,
            7.8
          ],
          [
            "12:40",
            66,
            6.7
          ],
          [
            "13:40",
            62.4,
            7.8
          ],
          [
            "14:40",
            53.9,
            11
          ],
          [
            "15:40",
            43,
            16.1
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
    },
    "explanation": "표에서 13:40보다 15:40의 태양 고도는 낮고 그림자는 길다. 두 시각이 모두 모형의 남중 뒤이므로 변화 방향도 설명과 맞는다. 특정 시각만 외워 판단하지 않고 실제 표의 두 값을 각각 비교해야 한다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T03",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set3-questions",
        "set": 3,
        "no": 7
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "daily",
      "task": "later-afternoon",
      "model": "daily"
    },
    "choices": [
      "고도와 그림자 길이가 모두 커졌다.",
      "고도는 낮아졌고 같은 막대의 그림자는 길어졌다.",
      "고도와 그림자 길이가 모두 작아졌다.",
      "고도는 같고 그림자만 길어졌다.",
      "그림자가 길어져도 두 시각의 고도는 읽을 수 없다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "하루 고도와 그림자",
      "inquirySkill": "같은 막대의 시간별 관계 비교",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T03",
      "format": "single-choice",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 1
      },
      "type": "single-choice",
      "answer": 1
    }
  },
  {
    "key": "3-8",
    "id": "c22-s62-u01-v038",
    "status": "authored",
    "kind": "mc",
    "prompt": "월별 모형 자료에서 낮의 길이가 가장 긴 달을 고르세요.",
    "givens": {
      "자료종류": "같은 북반구 중위도 장소의 월별 비교 연습 모형. 실제 누리집에서 수집한 관측값이 아니다.",
      "조건": "낮길이는 굴절 없는 태양 중심의 기하학적 모형이다. 월별 기온은 별도의 연습값이다.",
      "기록": {
        "머리": [
          "월",
          "남중 고도(°)",
          "낮의 길이",
          "월평균 기온(℃)"
        ],
        "행": [
          [
            1,
            34.1,
            "9시간 58분",
            1
          ],
          [
            2,
            42.5,
            "10시간 52분",
            4
          ],
          [
            3,
            54,
            "12시간 0분",
            9
          ],
          [
            4,
            65.5,
            "13시간 8분",
            15
          ],
          [
            5,
            73.9,
            "14시간 2분",
            20
          ],
          [
            6,
            77,
            "14시간 24분",
            24
          ],
          [
            7,
            73.9,
            "14시간 2분",
            27
          ],
          [
            8,
            65.5,
            "13시간 8분",
            28
          ],
          [
            9,
            54,
            "12시간 0분",
            23
          ],
          [
            10,
            42.5,
            "10시간 52분",
            17
          ],
          [
            11,
            34.1,
            "9시간 58분",
            10
          ],
          [
            12,
            31,
            "9시간 36분",
            4
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
    },
    "explanation": "낮길이 열에서 가장 큰 값이 있는 행은 6월이다. 기온 최고가 있는 8월과 구별해서 읽어야 한다. 가장 긴 낮과 가장 따뜻한 평균 기온의 시점은 다를 수 있으며 표의 기온으로 낮길이의 최댓값을 대신 판단하지 않는다.",
    "scope": "core",
    "standards": [
      "6과13-02"
    ],
    "type": "T07",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set3-questions",
        "set": 3,
        "no": 8
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "monthly",
      "task": "longest-day-month",
      "model": "monthly"
    },
    "choices": [
      "3월",
      "8월",
      "6월",
      "9월",
      "12월"
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "낮길이와 계절 자료",
      "inquirySkill": "날짜별 두 양 비교와 범위 추론",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T07",
      "format": "single-choice",
      "standard": "6과13-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 2
      },
      "type": "single-choice",
      "answer": 2
    }
  },
  {
    "key": "3-9",
    "id": "c22-s62-u01-v039",
    "status": "authored",
    "kind": "mc",
    "prompt": "9월과 11월의 두 모형 기록을 바르게 비교한 것을 고르세요.",
    "givens": {
      "자료종류": "같은 북반구 중위도 장소의 월별 비교 연습 모형. 실제 누리집에서 수집한 관측값이 아니다.",
      "조건": "낮길이는 굴절 없는 태양 중심의 기하학적 모형이다. 월별 기온은 별도의 연습값이다.",
      "기록": {
        "머리": [
          "월",
          "남중 고도(°)",
          "낮의 길이",
          "월평균 기온(℃)"
        ],
        "행": [
          [
            1,
            34.1,
            "9시간 58분",
            1
          ],
          [
            2,
            42.5,
            "10시간 52분",
            4
          ],
          [
            3,
            54,
            "12시간 0분",
            9
          ],
          [
            4,
            65.5,
            "13시간 8분",
            15
          ],
          [
            5,
            73.9,
            "14시간 2분",
            20
          ],
          [
            6,
            77,
            "14시간 24분",
            24
          ],
          [
            7,
            73.9,
            "14시간 2분",
            27
          ],
          [
            8,
            65.5,
            "13시간 8분",
            28
          ],
          [
            9,
            54,
            "12시간 0분",
            23
          ],
          [
            10,
            42.5,
            "10시간 52분",
            17
          ],
          [
            11,
            34.1,
            "9시간 58분",
            10
          ],
          [
            12,
            31,
            "9시간 36분",
            4
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3
    },
    "explanation": "9월보다 11월의 남중 고도 값은 낮고 낮길이 값도 작다. 같은 장소에서 늦가을로 가는 모형의 두 기록에 해당한다. 두 수치가 같은 눈금으로 한 그래프에 표시되는 것은 아니므로 각 열의 의미와 단위를 지켜 비교한다.",
    "scope": "core",
    "standards": [
      "6과13-02"
    ],
    "type": "T07",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set3-questions",
        "set": 3,
        "no": 9
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "monthly",
      "task": "autumn-change",
      "model": "monthly"
    },
    "choices": [
      "11월에는 남중 고도가 더 높고 낮은 더 길다.",
      "11월에는 남중 고도가 더 낮지만 낮은 더 길다.",
      "두 달의 남중 고도는 같고 기온만 다르다.",
      "남중 고도는 낮아지고 낮도 짧아진다.",
      "두 달의 낮길이는 같고 남중 고도만 다르다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "낮길이와 계절 자료",
      "inquirySkill": "날짜별 두 양 비교와 범위 추론",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T07",
      "format": "single-choice",
      "standard": "6과13-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 3
      },
      "type": "single-choice",
      "answer": 3
    }
  },
  {
    "key": "3-10",
    "id": "c22-s62-u01-v040",
    "status": "authored",
    "kind": "mc",
    "prompt": "남중 고도가 높은 순서로 세 위치 ㄷ·ㄱ·ㄴ을 비교한 뒤 계절을 바르게 연결한 것을 고르세요.",
    "givens": {
      "자료종류": "북위 36°의 이상화 계절 비교 모형. 지평선에서 태양 중심이 뜨고 지는 기하학적 낮길이이며 굴절·태양 원반 보정은 없다.",
      "조건": "같은 장소·수평면, 각 날짜의 남중 고도. 표의 두 중간 위치를 봄/가을 중 하나로 단정할 필요는 없다.",
      "기록": {
        "머리": [
          "위치",
          "남중 고도(°)",
          "낮의 길이"
        ],
        "행": [
          [
            "ㄱ",
            54,
            "12시간 0분"
          ],
          [
            "ㄷ",
            77,
            "14시간 24분"
          ],
          [
            "ㄹ",
            54,
            "12시간 0분"
          ],
          [
            "ㄴ",
            31,
            "9시간 36분"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4
    },
    "explanation": "ㄷ은 고도 최댓값과 가장 긴 낮을 가진 여름 위치이고 ㄴ은 최솟값과 가장 짧은 낮을 가진 겨울 위치이다. ㄱ은 그 사이의 고도이며 높이만으로 봄인지 가을인지 하나로 정할 수 없다. 두 중간 계절의 같은 높이를 구별하는 데는 추가 날짜 정보가 필요하다.",
    "scope": "core",
    "standards": [
      "6과13-02"
    ],
    "type": "T06",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set3-questions",
        "set": 3,
        "no": 10
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "seasonal",
      "task": "season-classification",
      "model": "seasonal"
    },
    "choices": [
      "ㄷ은 겨울, ㄱ은 중간 높이, ㄴ은 여름이다.",
      "ㄷ과 ㄴ은 모두 겨울이며 ㄱ만 여름이다.",
      "ㄷ과 ㄴ은 모두 여름이며 ㄱ만 겨울이다.",
      "ㄷ은 봄·가을이고 ㄱ은 여름, ㄴ은 봄이다.",
      "ㄷ은 여름, ㄱ은 중간 높이, ㄴ은 겨울이다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "계절별 남중 고도",
      "inquirySkill": "같은 지역의 계절·경로 관계 분류",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T06",
      "format": "single-choice",
      "standard": "6과13-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 4
      },
      "type": "single-choice",
      "answer": 4
    }
  },
  {
    "key": "3-11",
    "id": "c22-s62-u01-v041",
    "status": "authored",
    "kind": "mc",
    "prompt": "표에 제시한 네 남중 고도의 크기 관계를 고르세요.",
    "givens": {
      "자료종류": "북위 36°의 이상화 계절 비교 모형. 지평선에서 태양 중심이 뜨고 지는 기하학적 낮길이이며 굴절·태양 원반 보정은 없다.",
      "조건": "같은 장소·수평면, 각 날짜의 남중 고도. 표의 두 중간 위치를 봄/가을 중 하나로 단정할 필요는 없다.",
      "기록": {
        "머리": [
          "위치",
          "남중 고도(°)",
          "낮의 길이"
        ],
        "행": [
          [
            "ㄱ",
            54,
            "12시간 0분"
          ],
          [
            "ㄷ",
            77,
            "14시간 24분"
          ],
          [
            "ㄹ",
            54,
            "12시간 0분"
          ],
          [
            "ㄴ",
            31,
            "9시간 36분"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0
    },
    "explanation": "ㄷ의 77°가 가장 크고 ㄱ과 ㄹ은 54°로 같으며 ㄴ의 31°가 가장 작다. 따라서 ㄷ>ㄱ=ㄹ>ㄴ이다. 기호가 표에 나온 순서나 공전 순서와 고도의 크기 순서를 혼동하지 않아야 한다.",
    "scope": "core",
    "standards": [
      "6과13-02"
    ],
    "type": "T06",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set3-questions",
        "set": 3,
        "no": 11
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "seasonal",
      "task": "order-altitudes",
      "model": "seasonal"
    },
    "choices": [
      "ㄷ > ㄱ = ㄹ > ㄴ",
      "ㄴ > ㄱ = ㄹ > ㄷ",
      "ㄱ > ㄷ > ㄴ = ㄹ",
      "ㄷ = ㄱ > ㄹ = ㄴ",
      "ㄷ > ㄹ > ㄱ > ㄴ"
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "계절별 남중 고도",
      "inquirySkill": "같은 지역의 계절·경로 관계 분류",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T06",
      "format": "single-choice",
      "standard": "6과13-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 0
      },
      "type": "single-choice",
      "answer": 0
    }
  },
  {
    "key": "3-12",
    "id": "c22-s62-u01-v042",
    "status": "authored",
    "kind": "st",
    "prompt": "같은 우리나라 장소의 겨울에서 여름으로 갈 때, 표의 두 양 변화를 각각 쓰세요. (1) 남중 고도: 높아짐/낮아짐 (2) 낮의 길이: 길어짐/짧아짐",
    "givens": {
      "자료종류": "북위 36°의 이상화 계절 비교 모형. 지평선에서 태양 중심이 뜨고 지는 기하학적 낮길이이며 굴절·태양 원반 보정은 없다.",
      "조건": "같은 장소·수평면, 각 날짜의 남중 고도. 표의 두 중간 위치를 봄/가을 중 하나로 단정할 필요는 없다.",
      "기록": {
        "머리": [
          "위치",
          "남중 고도(°)",
          "낮의 길이"
        ],
        "행": [
          [
            "ㄱ",
            54,
            "12시간 0분"
          ],
          [
            "ㄷ",
            77,
            "14시간 24분"
          ],
          [
            "ㄹ",
            54,
            "12시간 0분"
          ],
          [
            "ㄴ",
            31,
            "9시간 36분"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "ordered-term-parts",
      "teacherRequired": false,
      "parts": [
        {
          "label": "(1)",
          "accepted": [
            "높아짐",
            "높아진다",
            "높아져요",
            "높아집니다"
          ]
        },
        {
          "label": "(2)",
          "accepted": [
            "길어짐",
            "길어진다",
            "길어져요",
            "길어집니다"
          ]
        }
      ]
    },
    "explanation": "겨울 위치 ㄴ과 여름 위치 ㄷ을 비교하면 남중 고도가 31°에서 77°로 높아지고 낮길이도 길어진다. 따라서 첫 칸은 높아짐, 둘째 칸은 길어짐이다. 각 답을 해당 양에 연결해야 하며 두 단어의 순서가 바뀌면 같은 설명이 아니다.",
    "scope": "core",
    "standards": [
      "6과13-02"
    ],
    "type": "T07",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set3-questions",
        "set": 3,
        "no": 12
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "seasonal",
      "task": "ordered-changes",
      "model": "seasonal"
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "낮길이와 계절 자료",
      "inquirySkill": "날짜별 두 양 비교와 범위 추론",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T07",
      "format": "ordered-term-parts",
      "standard": "6과13-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "ordered-term-parts",
        "teacherRequired": false,
        "parts": [
          {
            "label": "(1)",
            "accepted": [
              "높아짐",
              "높아진다",
              "높아져요",
              "높아집니다"
            ]
          },
          {
            "label": "(2)",
            "accepted": [
              "길어짐",
              "길어진다",
              "길어져요",
              "길어집니다"
            ]
          }
        ]
      },
      "type": "short-text",
      "answer": "높아짐 / 길어짐",
      "accepted": [
        "높아짐 / 길어짐"
      ],
      "inputHint": "각 부분의 답을 따로 써요."
    }
  },
  {
    "key": "3-13",
    "id": "c22-s62-u01-v043",
    "status": "authored",
    "kind": "st",
    "prompt": "지표면에 빛이 들어오는 각을 비교하는 모형에서 손전등은 실제 자연의 무엇에 대응하나요?",
    "givens": {
      "조건": "손전등은 빛을 보내는 역할이고 같은 재질의 종이는 지표면 역할이다. 탁상 장치의 실제 크기·거리 비율은 재현하지 않는다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "태양"
      ]
    },
    "explanation": "모형에서 빛을 보내는 손전등은 태양에 대응하고 빛을 받는 종이는 지표면에 대응한다. 대응 관계를 알아야 손전등 각도 비교를 태양 고도와 연결할 수 있다. 손전등이 실제 태양의 모든 성질이나 거리 비율까지 재현하는 것은 아니다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T08",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set3-questions",
        "set": 3,
        "no": 13
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "빛과 단위면적 에너지",
      "inquirySkill": "같은 양의 빛과 퍼진 넓이 비교",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T08",
      "format": "short-text",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "태양"
        ]
      },
      "type": "short-text",
      "answer": "태양",
      "accepted": [
        "태양"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "3-14",
    "id": "c22-s62-u01-v044",
    "status": "authored",
    "kind": "mc",
    "prompt": "빛과 종이 사이 각도만의 영향을 비교하려고 합니다. 두 경우에 다르게 해야 할 것을 고르세요.",
    "givens": {
      "자료종류": "같은 양의 빛을 같은 시간 비추는 넓이 모형. 에너지 단위는 비교용 연습 단위이며 기온 측정값은 없다.",
      "조건": "광원 밝기·광원에서 종이 중심까지 거리·시간·종이 재질을 같게 한다. 빛과 종이가 이루는 각만 달리한다.",
      "비교": {
        "머리": [
          "기호",
          "받은 에너지(연습 단위)",
          "빛이 퍼진 넓이(같은 크기 칸)"
        ],
        "행": [
          [
            "ㄱ",
            24,
            8
          ],
          [
            "ㄴ",
            24,
            4
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
    },
    "explanation": "이 실험의 조작 변인은 빛이 들어오는 각이다. 다른 조건까지 함께 바꾸면 빛 넓이 차이가 각도 때문인지 밝기·거리·재질 때문인지 구별하기 어렵다. 같은 중심 거리와 빛의 양·시간을 확인한 뒤 각을 바꿔 비교한다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T09",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set3-questions",
        "set": 3,
        "no": 14
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "footprint",
      "task": "controls",
      "model": "footprint"
    },
    "choices": [
      "광원에서 종이 중심까지 거리",
      "빛과 종이가 이루는 각",
      "광원 밝기와 비춘 시간",
      "종이의 재질과 색깔",
      "주변 조명과 빛받는 종이 크기"
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "가설과 변인 통제",
      "inquirySkill": "달리할 조건·같게 할 조건 특정",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T09",
      "format": "single-choice",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 1
      },
      "type": "single-choice",
      "answer": 1
    }
  },
  {
    "key": "3-15",
    "id": "c22-s62-u01-v045",
    "status": "authored",
    "kind": "mc",
    "prompt": "빛 넓이 모형의 ㄱ과 ㄴ을 같은 크기 한 칸에서 비교한 결과를 고르세요.",
    "givens": {
      "자료종류": "같은 양의 빛을 같은 시간 비추는 넓이 모형. 에너지 단위는 비교용 연습 단위이며 기온 측정값은 없다.",
      "조건": "광원 밝기·광원에서 종이 중심까지 거리·시간·종이 재질을 같게 한다. 빛과 종이가 이루는 각만 달리한다.",
      "비교": {
        "머리": [
          "기호",
          "받은 에너지(연습 단위)",
          "빛이 퍼진 넓이(같은 크기 칸)"
        ],
        "행": [
          [
            "ㄱ",
            24,
            8
          ],
          [
            "ㄴ",
            24,
            4
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
    },
    "explanation": "24단위를 4칸에 나누는 ㄴ은 한 칸당 6단위이고 8칸에 나누는 ㄱ은 한 칸당 3단위이다. 좁게 모이는 경우 단위면적이 더 많이 받는 관계와 맞는다. 이 숫자는 빛 분배 모형의 연습 단위이며 실제 온도 자료로 바뀌지 않는다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T08",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set3-questions",
        "set": 3,
        "no": 15
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "footprint",
      "task": "energy-per-cell",
      "model": "footprint"
    },
    "choices": [
      "ㄴ은 한 칸에 3단위, ㄱ은 한 칸에 6단위를 받는다.",
      "총에너지가 같으므로 둘 다 한 칸에 24단위를 받는다.",
      "ㄴ은 한 칸에 6단위, ㄱ은 한 칸에 3단위를 받는다.",
      "빛이 넓게 퍼질수록 한 칸의 에너지도 더 많아진다.",
      "빛 넓이만 알면 두 경우의 실제 기온도 확정할 수 있다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "빛과 단위면적 에너지",
      "inquirySkill": "같은 양의 빛과 퍼진 넓이 비교",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T08",
      "format": "single-choice",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 2
      },
      "type": "single-choice",
      "answer": 2
    }
  },
  {
    "key": "3-16",
    "id": "c22-s62-u01-v046",
    "status": "authored",
    "kind": "written",
    "prompt": "이 계절 자료와 빛 넓이 모형을 함께 이용해 우리나라 여름이 겨울보다 따뜻한 경향을 설명하세요.",
    "givens": {
      "계절자료": {
        "머리": [
          "위치",
          "남중 고도(°)",
          "낮의 길이"
        ],
        "행": [
          [
            "ㄱ",
            54,
            "12시간 0분"
          ],
          [
            "ㄷ",
            77,
            "14시간 24분"
          ],
          [
            "ㄹ",
            54,
            "12시간 0분"
          ],
          [
            "ㄴ",
            31,
            "9시간 36분"
          ]
        ]
      },
      "빛자료": {
        "머리": [
          "기호",
          "받은 에너지(연습 단위)",
          "빛이 퍼진 넓이(같은 크기 칸)"
        ],
        "행": [
          [
            "ㄱ",
            24,
            8
          ],
          [
            "ㄴ",
            24,
            4
          ]
        ]
      },
      "조건": "한 장소의 계절 경향을 설명한다. 빛 모형은 같은 총에너지·같은 시간의 면적 비교이며 실제 기온 측정은 아니다."
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "여름에는 남중 고도가 높아 같은 면적이 같은 시간 받는 빛이 많고, 낮도 길어 햇빛을 받는 시간이 길다. 그래서 지표가 받는 에너지가 더 많아져 따뜻한 경향이 생긴다.",
      "required": [
        "높은 남중 고도와 단위면적이 받는 빛을 연결한다.",
        "긴 낮과 받는 시간을 연결한다.",
        "계절 경향을 설명하며 모든 하루 기온을 단정하지 않는다."
      ],
      "exactStringScoring": false
    },
    "explanation": "계절 표에서 여름 위치의 고도와 낮길이가 겨울보다 크다. 빛 넓이 모형은 높은 각도로 좁게 모일 때 같은 면적이 같은 시간 더 많이 받는 관계를 보여 준다. 고도와 낮길이의 두 효과를 받은 에너지에 연결하되 실제 날씨의 모든 차이를 이 자료만으로 확정하지 않는다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T10",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set3-questions",
        "set": 3,
        "no": 16
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "seasonal-and-footprint",
      "models": [
        "seasonal",
        "footprint"
      ]
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "계절 원인 설명",
      "inquirySkill": "축·공전·고도/낮길이·에너지 연결",
      "itemType": "written",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T10",
      "format": "written-explanation",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "여름에는 남중 고도가 높아 같은 면적이 같은 시간 받는 빛이 많고, 낮도 길어 햇빛을 받는 시간이 길다. 그래서 지표가 받는 에너지가 더 많아져 따뜻한 경향이 생긴다.",
        "required": [
          "높은 남중 고도와 단위면적이 받는 빛을 연결한다.",
          "긴 낮과 받는 시간을 연결한다.",
          "계절 경향을 설명하며 모든 하루 기온을 단정하지 않는다."
        ],
        "exactStringScoring": false
      },
      "type": "written-explanation",
      "sample": "여름에는 남중 고도가 높아 같은 면적이 같은 시간 받는 빛이 많고, 낮도 길어 햇빛을 받는 시간이 길다. 그래서 지표가 받는 에너지가 더 많아져 따뜻한 경향이 생긴다.",
      "rubric": {
        "required": [
          "높은 남중 고도와 단위면적이 받는 빛을 연결한다.",
          "긴 낮과 받는 시간을 연결한다.",
          "계절 경향을 설명하며 모든 하루 기온을 단정하지 않는다."
        ],
        "pass": "조건·자료와 설명의 연결을 선생님이 확인해요."
      }
    }
  },
  {
    "key": "3-17",
    "id": "c22-s62-u01-v047",
    "status": "authored",
    "kind": "mc",
    "prompt": "수직 축 모형 A와 기울어진 축 모형 B를 비교하여 계절 원인을 알아봅니다. 두 모형에서 달리한 조건을 고르세요.",
    "givens": {
      "자료종류": "같은 지역의 남중 고도를 비교하는 지구의 모형 설계",
      "조건": "광원을 고정하고 같은 반지름의 원궤도 네 위치를 비교한다. 같은 지역 표시를 각 위치에서 자전시켜 남중으로 맞춘다. 축을 기울일 때 공간의 한 방향을 계속 향하게 한다.",
      "두조건": {
        "머리": [
          "조건",
          "자전축",
          "공전 중 축 방향"
        ],
        "행": [
          [
            "A",
            "공전 궤도면에 수직",
            "같게 유지"
          ],
          [
            "B",
            "공전 궤도면의 수직 방향에서 기울임",
            "같게 유지"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3
    },
    "explanation": "두 모형은 같은 광원·같은 원궤도·같은 지역을 유지하고 축의 기울기만 달리한다. 따라서 비교할 조작 변인은 자전축 기울기이다. 수직이라는 기준도 공전 궤도면의 수직 방향임을 밝혀야 바닥이나 그림 가장자리와 혼동하지 않는다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T11",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set3-questions",
        "set": 3,
        "no": 17
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "choices": [
      "모형의 같은 지역 표시를 붙인 위치",
      "광원에서 지구의 중심까지의 거리",
      "빛을 보내는 광원의 밝기와 위치",
      "자전축의 기울기",
      "공전 방향과 네 비교 위치의 간격"
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "자전축 모형 비교",
      "inquirySkill": "방향·같은 지역·남중 조건으로 비교",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T11",
      "format": "single-choice",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 3
      },
      "type": "single-choice",
      "answer": 3
    }
  },
  {
    "key": "3-18",
    "id": "c22-s62-u01-v048",
    "status": "authored",
    "kind": "st",
    "prompt": "이상화 원궤도에서 네 위치의 남중 고도가 달라질 수 있는 조건의 기호를 쓰세요.",
    "givens": {
      "자료종류": "같은 지역의 남중 고도를 비교하는 지구의 모형 설계",
      "조건": "광원을 고정하고 같은 반지름의 원궤도 네 위치를 비교한다. 같은 지역 표시를 각 위치에서 자전시켜 남중으로 맞춘다. 축을 기울일 때 공간의 한 방향을 계속 향하게 한다.",
      "두조건": {
        "머리": [
          "조건",
          "자전축",
          "공전 중 축 방향"
        ],
        "행": [
          [
            "A",
            "공전 궤도면에 수직",
            "같게 유지"
          ],
          [
            "B",
            "공전 궤도면의 수직 방향에서 기울임",
            "같게 유지"
          ]
        ]
      },
      "대응": {
        "머리": [
          "기호",
          "모형"
        ],
        "행": [
          [
            "ㄱ",
            "A: 축 수직"
          ],
          [
            "ㄴ",
            "B: 축 기울기·방향 유지"
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
    "explanation": "축이 수직인 A에서는 같은 지역의 남중 고도가 공전 위치에 따라 바뀌지 않는다. 축이 기울고 방향을 유지한 B에서는 위치에 따라 태양을 향해 기울어진 관계가 달라진다. 따라서 고도 변화를 설명할 조건은 ㄴ이며 각 위치의 같은 지역 남중을 맞춰야 한다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T11",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set3-questions",
        "set": 3,
        "no": 18
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "자전축 모형 비교",
      "inquirySkill": "방향·같은 지역·남중 조건으로 비교",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T11",
      "format": "short-text",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄴ"
        ]
      },
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "3-19",
    "id": "c22-s62-u01-v049",
    "status": "authored",
    "kind": "st",
    "prompt": "계절 원인을 설명하는 두 칸을 순서대로 채우세요. “지구의 (1)이 기울어진 채, 그 방향을 거의 유지하며 태양 둘레를 (2)한다.”",
    "givens": {},
    "responseContract": {
      "kind": "ordered-term-parts",
      "teacherRequired": false,
      "parts": [
        {
          "label": "(1)",
          "accepted": [
            "자전축",
            "지구 자전축"
          ]
        },
        {
          "label": "(2)",
          "accepted": [
            "공전"
          ]
        }
      ]
    },
    "explanation": "기울어진 것은 자전축이고 태양 둘레를 도는 운동은 공전이다. 축이 한 해 거의 같은 방향을 유지하며 공전하므로 같은 지역이 태양을 향해 기울어진 관계가 달라진다. 자전은 하루 낮·밤 변화를 설명하는 운동이므로 두 번째 칸과 구별한다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T10",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set3-questions",
        "set": 3,
        "no": 19
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "계절 원인 설명",
      "inquirySkill": "축·공전·고도/낮길이·에너지 연결",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T10",
      "format": "ordered-term-parts",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "ordered-term-parts",
        "teacherRequired": false,
        "parts": [
          {
            "label": "(1)",
            "accepted": [
              "자전축",
              "지구 자전축"
            ]
          },
          {
            "label": "(2)",
            "accepted": [
              "공전"
            ]
          }
        ]
      },
      "type": "short-text",
      "answer": "자전축 / 공전",
      "accepted": [
        "자전축 / 공전"
      ],
      "inputHint": "각 부분의 답을 따로 써요."
    }
  },
  {
    "key": "3-20",
    "id": "c22-s62-u01-v050",
    "status": "authored",
    "kind": "mc",
    "prompt": "거리·광원 조건을 같게 둔 가상 모형에서 공전 위치를 멈추고 자전만 계속했습니다. 이 모형으로 예상할 수 있는 것을 고르세요.",
    "givens": {
      "조건": "빛의 방향과 세기는 고정한다. 같은 지역이 자전하여 빛 받는 면과 받지 않는 면을 지나며, 실제 모든 기상 현상을 재현하는 모형은 아니다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4
    },
    "explanation": "공전 위치를 고정하면 이 이상화 모형의 계절별 태양 관계는 바뀌지 않는다. 그러나 자전하는 같은 지역은 빛 받는 쪽과 반대쪽을 지나므로 낮과 밤이 반복된다. 모형의 기하 관계만으로 실제 날씨나 모든 지역의 기온 일정까지 결론내리지는 않는다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T10",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set3-questions",
        "set": 3,
        "no": 20
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "choices": [
      "공전을 멈추면 자전해도 한 지역의 낮만 영원히 계속된다.",
      "공전을 멈추면 자전해도 한 지역의 밤만 영원히 계속된다.",
      "공전을 멈추면 자전축이 매일 기울어 사계절이 반복된다.",
      "공전을 멈추면 실제 지구의 매일 기온까지 모두 같아진다.",
      "계절별 고도 변화는 없고 낮·밤은 반복된다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "계절 원인 설명",
      "inquirySkill": "축·공전·고도/낮길이·에너지 연결",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T10",
      "format": "single-choice",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 4
      },
      "type": "single-choice",
      "answer": 4
    }
  },
  {
    "key": "4-1",
    "id": "c22-s62-u01-v051",
    "status": "authored",
    "kind": "st",
    "prompt": "아래 설명판에서 태양 고도를 나타내는 각의 기호를 쓰세요.",
    "givens": {
      "비교": {
        "머리": [
          "기호",
          "측정한 두 방향"
        ],
        "행": [
          [
            "ㄱ",
            "수평인 지표면과 햇빛 방향"
          ],
          [
            "ㄴ",
            "수직 막대와 수평 지표면"
          ],
          [
            "ㄷ",
            "수직 막대와 햇빛 방향"
          ]
        ]
      },
      "조건": "수평면에 수직 막대를 세우고 태양을 직접 보지 않는 간접 측정을 한다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "태양 고도는 수평 지표면과 태양 쪽 방향이 이루는 각이다. 설명판의 ㄱ이 그 두 방향을 연결한다. 막대가 수직인지 확인하는 직각이나 막대와 햇빛 사이 각을 재면 측정 기준이 달라진다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T01",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set4-questions",
        "set": 4,
        "no": 1
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "태양 고도의 기준",
      "inquirySkill": "수평면·빛 방향과 다른 각 구별",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T01",
      "format": "short-text",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄱ"
        ]
      },
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "4-2",
    "id": "c22-s62-u01-v052",
    "status": "authored",
    "kind": "mc",
    "prompt": "측정 오차를 줄이고 안전하게 태양 고도를 읽을 방법을 고르세요.",
    "givens": {
      "조건": "수평 받침·수직 막대·실·각도기를 사용한다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0
    },
    "explanation": "그림자 끝을 표시하고 막대 끝과 이은 실의 수평면 기준 각을 읽으면 직접 태양을 보지 않아도 된다. 받침 수평·막대 수직·끝의 위치가 오차에 영향을 준다. 무조건 긴 막대나 기울어진 장치는 정확도를 보장하지 않는다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T02",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set4-questions",
        "set": 4,
        "no": 2
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "choices": [
      "그림자 끝을 표시하고 실과 수평면의 각을 읽는다.",
      "태양을 맨눈으로 겨냥해 실 끝과 겹쳐 본다.",
      "막대가 조금 기울어도 그림자 끝만 같게 맞춘다.",
      "각도기 중심을 막대 밑에 놓고 언제나 직각을 읽는다.",
      "막대를 무조건 길게 만들어 흔들려도 그대로 읽는다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "측정기와 측정 조건",
      "inquirySkill": "수평·수직·순서·반복·안전 확인",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T02",
      "format": "single-choice",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 0
      },
      "type": "single-choice",
      "answer": 0
    }
  },
  {
    "key": "4-3",
    "id": "c22-s62-u01-v053",
    "status": "authored",
    "kind": "st",
    "prompt": "같은 높이의 막대 두 개를 같은 종류의 수평 받침에 세웠습니다. 고도가 더 낮은 쪽의 기호를 쓰세요.",
    "givens": {
      "자료종류": "서로 다른 두 시점의 비교용 길이 기록",
      "조건": "두 막대는 높이가 같고 수직이다.",
      "기록": {
        "머리": [
          "기호",
          "그림자 길이"
        ],
        "행": [
          [
            "ㄱ",
            "11 cm"
          ],
          [
            "ㄴ",
            "26 cm"
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
    "explanation": "같은 높이의 수직 막대에서 그림자가 길수록 햇빛이 수평면에 더 낮게 들어온다. ㄴ의 그림자가 26 cm로 더 길기 때문에 태양 고도는 ㄴ에서 더 낮다. 막대 높이나 받침 기울기가 다르면 이 길이 비교만으로 결론낼 수 없다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T03",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set4-questions",
        "set": 4,
        "no": 3
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "shadow-comparison",
      "heights": [
        15,
        15
      ],
      "shadows": [
        11,
        26
      ],
      "labels": [
        "ㄱ",
        "ㄴ"
      ]
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "하루 고도와 그림자",
      "inquirySkill": "같은 막대의 시간별 관계 비교",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T03",
      "format": "short-text",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄴ"
        ]
      },
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "4-4",
    "id": "c22-s62-u01-v054",
    "status": "authored",
    "kind": "st",
    "prompt": "아래 세 기록열을 그래프로 그렸을 때, 고도와 반대로 변하는 그림자 길이에 해당하는 열의 기호를 쓰세요.",
    "givens": {
      "자료종류": "같은 장소·같은 막대의 비교 연습값",
      "기록": {
        "머리": [
          "시각",
          "ㄱ",
          "ㄴ",
          "ㄷ"
        ],
        "행": [
          [
            "9:40",
            16,
            16.1,
            43
          ],
          [
            "10:40",
            18,
            11,
            53.9
          ],
          [
            "11:40",
            20,
            7.8,
            62.4
          ],
          [
            "12:40",
            22,
            6.7,
            66
          ],
          [
            "13:40",
            24,
            7.8,
            62.4
          ],
          [
            "14:40",
            25,
            11,
            53.9
          ],
          [
            "15:40",
            24,
            16.1,
            43
          ]
        ]
      },
      "조건": "세 열은 각각 기온·그림자 길이·태양 고도를 한 번씩 나타낸다. 열마다 단위는 다르다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "ㄷ은 낮 무렵 가장 커졌다가 작아지는 고도 열이고 ㄴ은 그때 가장 작아지는 그림자 열이다. ㄱ은 고도 최고보다 늦게 커지는 기온 열이다. 따라서 그림자 길이는 ㄴ이며 서로 다른 양의 숫자를 같은 단위로 비교하지 않는다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T04",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set4-questions",
        "set": 4,
        "no": 4
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "daily",
      "task": "identify-shadow-series",
      "model": "daily"
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "표와 그래프 읽기",
      "inquirySkill": "자료의 축·단위·최댓값 범위 해석",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T04",
      "format": "short-text",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄴ"
        ]
      },
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "4-5",
    "id": "c22-s62-u01-v055",
    "status": "authored",
    "kind": "st",
    "prompt": "우리나라 같은 장소에서 하루 중 태양이 가장 높은 때의 고도를 무엇이라고 하나요?",
    "givens": {
      "조건": "남쪽 하늘에서 태양이 남중하는 때의 각이다. 머리 바로 위의 90°를 뜻하는 말은 아니다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "태양의 남중 고도",
        "태양 남중 고도",
        "남중 고도"
      ]
    },
    "explanation": "태양이 남중할 때 수평면을 기준으로 재는 고도를 태양의 남중 고도라고 한다. 우리나라에서는 그날의 최고 고도에 해당한다. 남중 시각이라는 시간 이름이나 기온 최고라는 다른 양과 구별하여 답한다.",
    "scope": "core",
    "standards": [
      "6과13-01"
    ],
    "type": "T01",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set4-questions",
        "set": 4,
        "no": 5
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "태양 고도의 기준",
      "inquirySkill": "수평면·빛 방향과 다른 각 구별",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E1",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T01",
      "format": "short-text",
      "standard": "6과13-01"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "태양의 남중 고도",
          "태양 남중 고도",
          "남중 고도"
        ]
      },
      "type": "short-text",
      "answer": "태양의 남중 고도",
      "accepted": [
        "태양의 남중 고도",
        "태양 남중 고도",
        "남중 고도"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "4-6",
    "id": "c22-s62-u01-v056",
    "status": "authored",
    "kind": "st",
    "prompt": "남향 창문으로 비친 햇빛을 같은 남중 시점·같은 창 조건에서 비교합니다. 맞는 설명의 기호를 쓰세요.",
    "givens": {
      "조건": "우리나라의 남향 창, 같은 창 높이·처마·바닥을 유지한다. 표는 높은 고도와 낮은 고도의 두 경우이다.",
      "말": {
        "머리": [
          "기호",
          "설명"
        ],
        "행": [
          [
            "ㄱ",
            "고도가 낮으면 햇빛이 실내 바닥 더 깊은 쪽까지 갈 수 있다."
          ],
          [
            "ㄴ",
            "고도가 높아야 같은 창에서 햇빛이 언제나 더 깊게 들어온다."
          ],
          [
            "ㄷ",
            "창의 방향과 처마 조건은 햇빛 깊이와 관계없다."
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "같은 남향 창에서 낮은 각도로 들어온 빛은 바닥 더 안쪽까지 뻗을 수 있다. 높은 고도의 빛은 창 가까운 바닥에 닿기 쉽다. 이 비교는 창 방향·높이·처마와 남중 시점이 같은 조건이므로 성립하며 모든 교실 창에 조건 없이 일반화하지 않는다.",
    "scope": "core",
    "standards": [
      "6과13-02"
    ],
    "type": "T12",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set4-questions",
        "set": 4,
        "no": 6
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "window-ray",
      "windowHeight": 1.5,
      "altitudes": [
        30,
        60
      ]
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "자료의 한계와 생활 적용",
      "inquirySkill": "주어진 근거와 없는 측정 결과 구별",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T12",
      "format": "short-text",
      "standard": "6과13-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄱ"
        ]
      },
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "4-7",
    "id": "c22-s62-u01-v057",
    "status": "authored",
    "kind": "st",
    "prompt": "표에서 우리나라의 겨울 위치를 찾아 두 칸을 채우세요. (1) 계절 이름 (2) 위치 기호",
    "givens": {
      "자료종류": "북위 36°의 이상화 계절 비교 모형. 지평선에서 태양 중심이 뜨고 지는 기하학적 낮길이이며 굴절·태양 원반 보정은 없다.",
      "조건": "같은 장소·수평면, 각 날짜의 남중 고도. 표의 두 중간 위치를 봄/가을 중 하나로 단정할 필요는 없다.",
      "기록": {
        "머리": [
          "위치",
          "남중 고도(°)",
          "낮의 길이"
        ],
        "행": [
          [
            "ㄱ",
            54,
            "12시간 0분"
          ],
          [
            "ㄷ",
            77,
            "14시간 24분"
          ],
          [
            "ㄹ",
            54,
            "12시간 0분"
          ],
          [
            "ㄴ",
            31,
            "9시간 36분"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "ordered-term-parts",
      "teacherRequired": false,
      "parts": [
        {
          "label": "(1)",
          "accepted": [
            "겨울",
            "겨울철"
          ]
        },
        {
          "label": "(2)",
          "accepted": [
            "ㄴ"
          ]
        }
      ]
    },
    "explanation": "겨울은 같은 장소에서 남중 고도가 낮고 낮도 짧은 계절이다. 표에서는 ㄴ이 그 두 조건에 해당하므로 첫 칸은 겨울, 둘째 칸은 ㄴ이다. 기호만 맞거나 계절만 맞은 경우는 두 부분의 응답을 따로 확인한다.",
    "scope": "core",
    "standards": [
      "6과13-02"
    ],
    "type": "T06",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set4-questions",
        "set": 4,
        "no": 7
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "seasonal",
      "task": "winter-parts",
      "model": "seasonal"
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "계절별 남중 고도",
      "inquirySkill": "같은 지역의 계절·경로 관계 분류",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T06",
      "format": "ordered-term-parts",
      "standard": "6과13-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "ordered-term-parts",
        "teacherRequired": false,
        "parts": [
          {
            "label": "(1)",
            "accepted": [
              "겨울",
              "겨울철"
            ]
          },
          {
            "label": "(2)",
            "accepted": [
              "ㄴ"
            ]
          }
        ]
      },
      "type": "short-text",
      "answer": "겨울 / ㄴ",
      "accepted": [
        "겨울 / ㄴ"
      ],
      "inputHint": "각 부분의 답을 따로 써요."
    }
  },
  {
    "key": "4-8",
    "id": "c22-s62-u01-v058",
    "status": "authored",
    "kind": "mc",
    "prompt": "고도가 높은 여름 비교일을 골랐다는 이유만으로 결론낼 수 없는 것을 고르세요.",
    "givens": {
      "자료종류": "북위 36°의 이상화 계절 비교 모형. 지평선에서 태양 중심이 뜨고 지는 기하학적 낮길이이며 굴절·태양 원반 보정은 없다.",
      "조건": "계절의 천문 관계만 담은 모형이다. 그날의 구름·바람·기온 실측값은 제공되지 않았다.",
      "기록": {
        "머리": [
          "위치",
          "남중 고도(°)",
          "낮의 길이"
        ],
        "행": [
          [
            "ㄱ",
            54,
            "12시간 0분"
          ],
          [
            "ㄷ",
            77,
            "14시간 24분"
          ],
          [
            "ㄹ",
            54,
            "12시간 0분"
          ],
          [
            "ㄴ",
            31,
            "9시간 36분"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
    },
    "explanation": "표에는 남중 고도와 낮길이만 있고 실제 그날의 기온은 없다. 계절적 경향을 설명할 근거가 되더라도 구름·바람 등 날씨가 다른 모든 날의 기온 순서를 확정하지 못한다. 제공 자료에 있는 값과 없는 관측 결과를 구별해야 한다.",
    "scope": "core",
    "standards": [
      "6과13-02"
    ],
    "type": "T12",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set4-questions",
        "set": 4,
        "no": 8
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "seasonal",
      "task": "weather-limit",
      "model": "seasonal"
    },
    "choices": [
      "ㄷ의 남중 고도가 ㄴ보다 높다는 것을 확인한다.",
      "그날의 실제 기온이 가장 높다고 확정한다.",
      "ㄷ의 낮의 길이가 ㄴ보다 길다는 것을 확인한다.",
      "같은 장소의 계절별 고도 차이를 자료에서 읽는다.",
      "표에 실제 관측 기온이 없다는 자료 한계를 말한다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "자료의 한계와 생활 적용",
      "inquirySkill": "주어진 근거와 없는 측정 결과 구별",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T12",
      "format": "single-choice",
      "standard": "6과13-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 1
      },
      "type": "single-choice",
      "answer": 1
    }
  },
  {
    "key": "4-9",
    "id": "c22-s62-u01-v059",
    "status": "authored",
    "kind": "mc",
    "prompt": "우리나라 같은 장소에서 하지부터 동지까지의 낮길이 변화를 설명한 것을 고르세요.",
    "givens": {
      "조건": "서로 다른 날의 낮길이를 비교한다. 봄·여름 같은 계절 이름 전체를 증가/감소 구간과 같게 취급하지 않는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
    },
    "explanation": "우리나라에서는 하지 무렵 낮이 가장 길고 동지 무렵 가장 짧다. 따라서 이 두 절기 사이의 전반적인 변화는 짧아지는 방향이다. 계절 이름의 경계와 천문학적 극값 날짜는 같지 않으므로 여름 전체가 계속 증가하는 구간이라고 외우지 않는다.",
    "scope": "core",
    "standards": [
      "6과13-02"
    ],
    "type": "T07",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set4-questions",
        "set": 4,
        "no": 9
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "choices": [
      "가을 내내 가장 짧다가 겨울 첫날 곧바로 가장 길어진다.",
      "하지가 지난 뒤에도 동지까지 계속 길어진다.",
      "하지에서 동지로 갈수록 대체로 짧아진다.",
      "춘분 뒤에는 1년 내내 낮길이가 똑같다.",
      "그날의 기온이 오르면 낮길이도 즉시 길어진다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "낮길이와 계절 자료",
      "inquirySkill": "날짜별 두 양 비교와 범위 추론",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T07",
      "format": "single-choice",
      "standard": "6과13-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 2
      },
      "type": "single-choice",
      "answer": 2
    }
  },
  {
    "key": "4-10",
    "id": "c22-s62-u01-v060",
    "status": "authored",
    "kind": "st",
    "prompt": "손전등 빛을 받는 같은 재질의 종이는 이 모형에서 실제 자연의 무엇을 나타내나요?",
    "givens": {
      "조건": "빛을 보내는 손전등과 빛을 받는 종이로 태양 고도에 따른 빛 넓이를 비교한다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "지표면",
        "지면",
        "땅의 표면"
      ]
    },
    "explanation": "종이는 햇빛을 받는 지표면에 대응하고 손전등은 태양에 대응한다. 따라서 종이의 같은 크기 넓이가 받는 빛을 비교해 지표면의 단위면적 에너지 차이를 생각할 수 있다. 종이 온도가 곧 실제 대기 기온이라고 단정하는 것은 별개의 추론이다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T08",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set4-questions",
        "set": 4,
        "no": 10
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "빛과 단위면적 에너지",
      "inquirySkill": "같은 양의 빛과 퍼진 넓이 비교",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T08",
      "format": "short-text",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "지표면",
          "지면",
          "땅의 표면"
        ]
      },
      "type": "short-text",
      "answer": "지표면",
      "accepted": [
        "지표면",
        "지면",
        "땅의 표면"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "4-11",
    "id": "c22-s62-u01-v061",
    "status": "authored",
    "kind": "written",
    "prompt": "ㄱ과 ㄴ의 총에너지는 같은데 한 칸이 받는 양은 다른 까닭을 설명하고, 이것을 태양 고도와 연결하세요.",
    "givens": {
      "자료종류": "같은 양의 빛을 같은 시간 비추는 넓이 모형. 에너지 단위는 비교용 연습 단위이며 기온 측정값은 없다.",
      "조건": "광원 밝기·광원에서 종이 중심까지 거리·시간·종이 재질을 같게 한다. 빛과 종이가 이루는 각만 달리한다.",
      "비교": {
        "머리": [
          "기호",
          "받은 에너지(연습 단위)",
          "빛이 퍼진 넓이(같은 크기 칸)"
        ],
        "행": [
          [
            "ㄱ",
            24,
            8
          ],
          [
            "ㄴ",
            24,
            4
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "ㄴ은 같은 24단위가 더 좁은 4칸에 모여 한 칸당 더 많이 받는다. 수평 지표면에 높은 고도로 들어오는 빛이 더 좁게 모이는 것과 연결된다.",
      "required": [
        "총에너지가 같은 조건을 확인한다.",
        "받는 면적이 작으면 같은 크기 한 칸이 더 많이 받는다고 설명한다.",
        "높은 태양 고도와 빛이 좁게 모이는 관계를 연결한다."
      ],
      "exactStringScoring": false
    },
    "explanation": "같은 총에너지를 작은 면적에 나누면 단위면적이 받는 양은 많아진다. ㄱ은 8칸, ㄴ은 4칸이므로 ㄴ의 한 칸이 더 많이 받는다. 이를 수평 지표면에 높은 고도로 들어오는 빛과 연결할 수 있지만 모형만으로 실제 공기의 기온을 측정했다고 말하지 않는다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T08",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set4-questions",
        "set": 4,
        "no": 11
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "footprint",
      "task": "density-explanation",
      "model": "footprint"
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "빛과 단위면적 에너지",
      "inquirySkill": "같은 양의 빛과 퍼진 넓이 비교",
      "itemType": "written",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T08",
      "format": "written-explanation",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "ㄴ은 같은 24단위가 더 좁은 4칸에 모여 한 칸당 더 많이 받는다. 수평 지표면에 높은 고도로 들어오는 빛이 더 좁게 모이는 것과 연결된다.",
        "required": [
          "총에너지가 같은 조건을 확인한다.",
          "받는 면적이 작으면 같은 크기 한 칸이 더 많이 받는다고 설명한다.",
          "높은 태양 고도와 빛이 좁게 모이는 관계를 연결한다."
        ],
        "exactStringScoring": false
      },
      "type": "written-explanation",
      "sample": "ㄴ은 같은 24단위가 더 좁은 4칸에 모여 한 칸당 더 많이 받는다. 수평 지표면에 높은 고도로 들어오는 빛이 더 좁게 모이는 것과 연결된다.",
      "rubric": {
        "required": [
          "총에너지가 같은 조건을 확인한다.",
          "받는 면적이 작으면 같은 크기 한 칸이 더 많이 받는다고 설명한다.",
          "높은 태양 고도와 빛이 좁게 모이는 관계를 연결한다."
        ],
        "pass": "조건·자료와 설명의 연결을 선생님이 확인해요."
      }
    }
  },
  {
    "key": "4-12",
    "id": "c22-s62-u01-v062",
    "status": "authored",
    "kind": "mc",
    "prompt": "다음 중 계절 변화와 날씨의 관계를 타당하게 설명한 것을 고르세요.",
    "givens": {
      "조건": "우리나라 같은 장소의 여러 계절을 비교한다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3
    },
    "explanation": "기울어진 축과 공전은 계절별 고도·낮길이를 바꾸고 지표가 받는 에너지의 차이를 만든다. 실제 기온에는 가열의 시간차와 구름·바람 등도 작용한다. 따라서 계절 원인 설명과 특정 날의 날씨를 하나의 고정 법칙으로 합쳐서는 안 된다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T10",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set4-questions",
        "set": 4,
        "no": 12
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "choices": [
      "계절마다 태양의 열이 켜지고 꺼지는 것이 고도 차이를 만든다.",
      "여름 고도가 높으므로 구름·바람은 어떤 날의 기온에도 영향이 없다.",
      "겨울 고도가 낮은 까닭은 추운 공기가 먼저 태양을 아래로 밀기 때문이다.",
      "계절적 에너지 차이와 그날의 날씨가 함께 기온에 작용한다.",
      "고도가 같은 봄·가을 날짜는 실제 평균 기온도 언제나 같아야 한다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "계절 원인 설명",
      "inquirySkill": "축·공전·고도/낮길이·에너지 연결",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T10",
      "format": "single-choice",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 3
      },
      "type": "single-choice",
      "answer": 3
    }
  },
  {
    "key": "4-13",
    "id": "c22-s62-u01-v063",
    "status": "authored",
    "kind": "mc",
    "prompt": "이상화 지구 모형의 같은 북반구 중위도 지점에서 계절에 따라 달라지는 두 양을 고르세요. (정답 2개)",
    "givens": {
      "자료종류": "같은 지역의 남중 고도를 비교하는 지구의 모형 설계",
      "조건": "광원을 고정하고 같은 반지름의 원궤도 네 위치를 비교한다. 같은 지역 표시를 각 위치에서 자전시켜 남중으로 맞춘다. 축을 기울일 때 공간의 한 방향을 계속 향하게 한다.",
      "두조건": {
        "머리": [
          "조건",
          "자전축",
          "공전 중 축 방향"
        ],
        "행": [
          [
            "A",
            "공전 궤도면에 수직",
            "같게 유지"
          ],
          [
            "B",
            "공전 궤도면의 수직 방향에서 기울임",
            "같게 유지"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "multi-choice",
      "teacherRequired": false,
      "answers": [
        0,
        2
      ]
    },
    "explanation": "한 해 동안 축의 기울기와 방향을 유지해도 공전 위치가 달라지면 같은 지역의 태양 관계가 달라진다. 그 결과 남중 고도와 낮길이가 변한다. 축 기울기 자체·유지한 방향·모형 반지름을 계절마다 조작했다고 해석하지 않는다.",
    "scope": "core",
    "standards": [
      "6과13-02",
      "6과13-03"
    ],
    "type": "T11",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set4-questions",
        "set": 4,
        "no": 13
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "choices": [
      "지표면을 기준으로 잰 태양의 남중 고도",
      "공전 궤도면의 수직 방향에 대한 축 기울기 자체",
      "그 장소의 낮의 길이",
      "한 해 동안 유지하도록 한 자전축의 공간 방향",
      "같은 크기로 고정한 지구의의 반지름"
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "자전축 모형 비교",
      "inquirySkill": "방향·같은 지역·남중 조건으로 비교",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T11",
      "format": "multi-choice",
      "standard": "6과13-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "multi-choice",
        "teacherRequired": false,
        "answers": [
          0,
          2
        ]
      },
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    }
  },
  {
    "key": "4-14",
    "id": "c22-s62-u01-v064",
    "status": "authored",
    "kind": "mc",
    "prompt": "계절 원인의 가설을 확인하려고 수직 축과 기울어진 축을 비교합니다. 설계에서 바르게 정한 것을 고르세요.",
    "givens": {
      "자료종류": "같은 지역의 남중 고도를 비교하는 지구의 모형 설계",
      "조건": "광원을 고정하고 같은 반지름의 원궤도 네 위치를 비교한다. 같은 지역 표시를 각 위치에서 자전시켜 남중으로 맞춘다. 축을 기울일 때 공간의 한 방향을 계속 향하게 한다.",
      "두조건": {
        "머리": [
          "조건",
          "자전축",
          "공전 중 축 방향"
        ],
        "행": [
          [
            "A",
            "공전 궤도면에 수직",
            "같게 유지"
          ],
          [
            "B",
            "공전 궤도면의 수직 방향에서 기울임",
            "같게 유지"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4
    },
    "explanation": "가설에서 확인하려는 조건은 축 기울기이므로 다른 조건은 같게 유지해야 한다. 같은 지역의 남중을 각 공전 위치에서 맞추어야 서로 다른 하루 시각을 비교하는 실수도 피할 수 있다. 밝기·크기·위치까지 바꾸면 원인을 하나로 가릴 수 없다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T09",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set4-questions",
        "set": 4,
        "no": 14
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "choices": [
      "축 기울기와 광원의 밝기를 동시에 바꿔 비교한다.",
      "축 기울기와 지구의 크기를 동시에 바꿔 비교한다.",
      "같은 축을 유지하고 우리나라 표시를 적도로 옮겨 비교한다.",
      "겨울 위치에서만 지구의를 광원에 가까이 옮겨 비교한다.",
      "축 기울기만 달리해 같은 지역의 남중을 비교한다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "가설과 변인 통제",
      "inquirySkill": "달리할 조건·같게 할 조건 특정",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T09",
      "format": "single-choice",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "single-choice",
        "teacherRequired": false,
        "answer": 4
      },
      "type": "single-choice",
      "answer": 4
    }
  },
  {
    "key": "4-15",
    "id": "c22-s62-u01-v065",
    "status": "authored",
    "kind": "st",
    "prompt": "준비·첫 측정·위치별 비교의 세 묶음을 올바른 순서로 쓰세요.",
    "givens": {
      "조건": "같은 원궤도와 고정 광원을 사용하는 수직 축 모형이다.",
      "단계": {
        "머리": [
          "기호",
          "활동"
        ],
        "행": [
          [
            "ㄱ",
            "같은 반지름의 나머지 위치로 옮겨 각각 그 지역의 남중을 맞춰 측정한다."
          ],
          [
            "ㄴ",
            "축을 궤도면에 수직으로 맞추고 같은 지역에 측정 장치를 고정한다."
          ],
          [
            "ㄷ",
            "첫 위치에서 광원을 켜고 그 지역의 남중 상태를 맞춰 첫 고도를 읽는다."
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "ordered-label-sequence",
      "teacherRequired": false,
      "sequence": [
        "ㄴ",
        "ㄷ",
        "ㄱ"
      ]
    },
    "explanation": "먼저 축과 측정 장치를 정한 조건으로 고정해야 같은 지역을 비교할 수 있다. 다음 첫 위치에서 남중을 맞춰 읽고, 마지막으로 다른 공전 위치에서도 같은 절차를 반복한다. 따라서 ㄴ→ㄷ→ㄱ이며 공전 위치만 옮긴 채 자전 시각이 다른 상태를 읽지 않는다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T11",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set4-questions",
        "set": 4,
        "no": 15
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "자전축 모형 비교",
      "inquirySkill": "방향·같은 지역·남중 조건으로 비교",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T11",
      "format": "ordered-label-sequence",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "ordered-label-sequence",
        "teacherRequired": false,
        "sequence": [
          "ㄴ",
          "ㄷ",
          "ㄱ"
        ]
      },
      "type": "short-text",
      "answer": "ㄴ → ㄷ → ㄱ",
      "accepted": [
        "ㄴ → ㄷ → ㄱ"
      ],
      "inputHint": "기호를 화살표나 쉼표로 이어 순서대로 써요."
    }
  },
  {
    "key": "4-16",
    "id": "c22-s62-u01-v066",
    "status": "authored",
    "kind": "st",
    "prompt": "축이 수직인 이상화 원궤도 모형입니다. (1) 위치 Q (2) 위치 S의 남중 고도를 단위와 함께 채우세요.",
    "givens": {
      "조건": "북위 36°에 해당하는 같은 지역. 광원 높이·거리·밝기를 같게 하고 네 위치마다 그 지역의 남중을 맞춘다. 각도는 태양 중심·수평면 기준의 모형값이다.",
      "기록": {
        "머리": [
          "위치",
          "남중 고도"
        ],
        "행": [
          [
            "P",
            "54°"
          ],
          [
            "Q",
            "(1)"
          ],
          [
            "R",
            "54°"
          ],
          [
            "S",
            "(2)"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "ordered-term-parts",
      "teacherRequired": false,
      "parts": [
        {
          "label": "(1)",
          "kind": "number-unit",
          "value": 54,
          "units": [
            "°",
            "도"
          ],
          "unitRequired": true,
          "tolerance": 0,
          "accepted": [
            "54°",
            "54도"
          ]
        },
        {
          "label": "(2)",
          "kind": "number-unit",
          "value": 54,
          "units": [
            "°",
            "도"
          ],
          "unitRequired": true,
          "tolerance": 0,
          "accepted": [
            "54°",
            "54도"
          ]
        }
      ]
    },
    "explanation": "축이 궤도면에 수직인 모형에서는 같은 지역과 광원 조건을 유지하고 각 위치의 남중을 비교하면 고도가 같다. 이미 P와 R이 54°이므로 Q와 S도 각각 54°이다. 두 칸은 서로 같은 값이지만 각 위치의 응답을 빠짐없이 작성해야 한다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T11",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set4-questions",
        "set": 4,
        "no": 16
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "upright-axis",
      "latitude": 36,
      "expected": [
        54,
        54
      ]
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "자전축 모형 비교",
      "inquirySkill": "방향·같은 지역·남중 조건으로 비교",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T11",
      "format": "ordered-term-parts",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "ordered-term-parts",
        "teacherRequired": false,
        "parts": [
          {
            "label": "(1)",
            "kind": "number-unit",
            "value": 54,
            "units": [
              "°",
              "도"
            ],
            "unitRequired": true,
            "tolerance": 0,
            "accepted": [
              "54°",
              "54도"
            ]
          },
          {
            "label": "(2)",
            "kind": "number-unit",
            "value": 54,
            "units": [
              "°",
              "도"
            ],
            "unitRequired": true,
            "tolerance": 0,
            "accepted": [
              "54°",
              "54도"
            ]
          }
        ]
      },
      "type": "short-text",
      "answer": "54° / 54°",
      "accepted": [
        "54° / 54°"
      ],
      "inputHint": "각 부분의 답을 따로 써요."
    }
  },
  {
    "key": "4-17",
    "id": "c22-s62-u01-v067",
    "status": "authored",
    "kind": "st",
    "prompt": "이상화 모형의 자료로 타당하게 말할 수 있는 기호를 쓰세요.",
    "givens": {
      "자료종류": "같은 지역의 남중 고도를 비교하는 지구의 모형 설계",
      "조건": "광원을 고정하고 같은 반지름의 원궤도 네 위치를 비교한다. 같은 지역 표시를 각 위치에서 자전시켜 남중으로 맞춘다. 축을 기울일 때 공간의 한 방향을 계속 향하게 한다.",
      "두조건": {
        "머리": [
          "조건",
          "자전축",
          "공전 중 축 방향"
        ],
        "행": [
          [
            "A",
            "공전 궤도면에 수직",
            "같게 유지"
          ],
          [
            "B",
            "공전 궤도면의 수직 방향에서 기울임",
            "같게 유지"
          ]
        ]
      },
      "말": {
        "머리": [
          "기호",
          "설명"
        ],
        "행": [
          [
            "ㄱ",
            "축 기울기·방향을 유지해도 공전 위치에 따라 남중 고도가 변할 수 있다."
          ],
          [
            "ㄴ",
            "공전 위치마다 축을 광원 쪽으로 다시 돌려야 실제 계절과 같다."
          ],
          [
            "ㄷ",
            "공전 방향은 어디서 보더라도 항상 같은 시계 방향으로 보인다."
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "기울어진 축의 방향을 유지한 채 공전하면 같은 지역이 태양을 향한 관계가 달라져 남중 고도도 변할 수 있다. 따라서 ㄱ이 타당하다. 매번 축을 광원 쪽으로 다시 돌리면 다른 모형이 되며 시계 방향 표현에는 바라보는 관점도 필요하다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T11",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set4-questions",
        "set": 4,
        "no": 17
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "자전축 모형 비교",
      "inquirySkill": "방향·같은 지역·남중 조건으로 비교",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T11",
      "format": "short-text",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "ㄱ"
        ]
      },
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "4-18",
    "id": "c22-s62-u01-v068",
    "status": "authored",
    "kind": "st",
    "prompt": "같은 북반구 중위도 장소에서 표의 두 위치가 나타내는 계절을 순서대로 쓰세요. (1) ㄷ (2) ㄴ",
    "givens": {
      "자료종류": "북위 36°의 이상화 계절 비교 모형. 지평선에서 태양 중심이 뜨고 지는 기하학적 낮길이이며 굴절·태양 원반 보정은 없다.",
      "조건": "같은 장소·수평면, 각 날짜의 남중 고도. 표의 두 중간 위치를 봄/가을 중 하나로 단정할 필요는 없다.",
      "기록": {
        "머리": [
          "위치",
          "남중 고도(°)",
          "낮의 길이"
        ],
        "행": [
          [
            "ㄱ",
            54,
            "12시간 0분"
          ],
          [
            "ㄷ",
            77,
            "14시간 24분"
          ],
          [
            "ㄹ",
            54,
            "12시간 0분"
          ],
          [
            "ㄴ",
            31,
            "9시간 36분"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "ordered-term-parts",
      "teacherRequired": false,
      "parts": [
        {
          "label": "(1)",
          "accepted": [
            "여름",
            "여름철"
          ]
        },
        {
          "label": "(2)",
          "accepted": [
            "겨울",
            "겨울철"
          ]
        }
      ]
    },
    "explanation": "ㄷ은 남중 고도가 가장 높고 낮이 가장 긴 여름 위치이며 ㄴ은 고도가 가장 낮고 낮이 가장 짧은 겨울 위치이다. 따라서 ㄷ,ㄴ 순서의 응답은 여름,겨울이다. 두 계절을 모두 쓰더라도 위치 순서가 바뀌면 자료 대응이 달라진다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T06",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set4-questions",
        "set": 4,
        "no": 18
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "verificationModel": {
      "kind": "seasonal",
      "task": "two-seasons",
      "model": "seasonal"
    },
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "계절별 남중 고도",
      "inquirySkill": "같은 지역의 계절·경로 관계 분류",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E2",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T06",
      "format": "ordered-term-parts",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "ordered-term-parts",
        "teacherRequired": false,
        "parts": [
          {
            "label": "(1)",
            "accepted": [
              "여름",
              "여름철"
            ]
          },
          {
            "label": "(2)",
            "accepted": [
              "겨울",
              "겨울철"
            ]
          }
        ]
      },
      "type": "short-text",
      "answer": "여름 / 겨울",
      "accepted": [
        "여름 / 겨울"
      ],
      "inputHint": "각 부분의 답을 따로 써요."
    }
  },
  {
    "key": "4-19",
    "id": "c22-s62-u01-v069",
    "status": "authored",
    "kind": "written",
    "prompt": "“공전하니까 계절이 달라진다”라는 설명에 빠진 조건과 중간 과정을 보완해 쓰세요. 자전축·공전 두 낱말을 모두 사용하세요.",
    "givens": {
      "조건": "같은 지역의 계절 변화를 설명한다. 태양의 밝기 변화나 지구 크기 변화를 가정하지 않는다."
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "지구의 자전축이 기울어진 채 그 방향을 거의 유지하며 공전하므로 같은 지역의 남중 고도와 낮길이가 달라진다. 그에 따라 지표가 받는 태양 에너지가 달라져 계절의 변화가 생긴다.",
      "required": [
        "자전축의 기울기와 한 해 방향 유지를 밝힌다.",
        "공전 위치에 따라 같은 지역의 고도 또는 낮길이가 달라지는 과정을 설명한다.",
        "받는 에너지 차이를 계절 변화와 연결한다."
      ],
      "exactStringScoring": false
    },
    "explanation": "공전만 언급하면 축이 수직인 모형과 기울어진 모형을 구별할 수 없다. 자전축의 기울기·거의 같은 방향 유지와 공전을 함께 설명해야 같은 지역의 남중 고도·낮길이 차이가 생기는 이유를 알 수 있다. 이 차이를 지표가 받는 태양 에너지와 연결하여 설명을 완성한다.",
    "scope": "core",
    "standards": [
      "6과13-03"
    ],
    "type": "T10",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set4-questions",
        "set": 4,
        "no": 19
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "계절 원인 설명",
      "inquirySkill": "축·공전·고도/낮길이·에너지 연결",
      "itemType": "written",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T10",
      "format": "written-explanation",
      "standard": "6과13-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "지구의 자전축이 기울어진 채 그 방향을 거의 유지하며 공전하므로 같은 지역의 남중 고도와 낮길이가 달라진다. 그에 따라 지표가 받는 태양 에너지가 달라져 계절의 변화가 생긴다.",
        "required": [
          "자전축의 기울기와 한 해 방향 유지를 밝힌다.",
          "공전 위치에 따라 같은 지역의 고도 또는 낮길이가 달라지는 과정을 설명한다.",
          "받는 에너지 차이를 계절 변화와 연결한다."
        ],
        "exactStringScoring": false
      },
      "type": "written-explanation",
      "sample": "지구의 자전축이 기울어진 채 그 방향을 거의 유지하며 공전하므로 같은 지역의 남중 고도와 낮길이가 달라진다. 그에 따라 지표가 받는 태양 에너지가 달라져 계절의 변화가 생긴다.",
      "rubric": {
        "required": [
          "자전축의 기울기와 한 해 방향 유지를 밝힌다.",
          "공전 위치에 따라 같은 지역의 고도 또는 낮길이가 달라지는 과정을 설명한다.",
          "받는 에너지 차이를 계절 변화와 연결한다."
        ],
        "pass": "조건·자료와 설명의 연결을 선생님이 확인해요."
      }
    }
  },
  {
    "key": "4-20",
    "id": "c22-s62-u01-v070",
    "status": "authored",
    "kind": "mc",
    "prompt": "같은 북반구 중위도 장소에서 축의 기울기·방향을 유지하며 공전하는 모형에 대한 설명을 모두 고르세요. (정답 2개)",
    "givens": {
      "자료종류": "같은 지역의 남중 고도를 비교하는 지구의 모형 설계",
      "조건": "광원을 고정하고 같은 반지름의 원궤도 네 위치를 비교한다. 같은 지역 표시를 각 위치에서 자전시켜 남중으로 맞춘다. 축을 기울일 때 공간의 한 방향을 계속 향하게 한다.",
      "두조건": {
        "머리": [
          "조건",
          "자전축",
          "공전 중 축 방향"
        ],
        "행": [
          [
            "A",
            "공전 궤도면에 수직",
            "같게 유지"
          ],
          [
            "B",
            "공전 궤도면의 수직 방향에서 기울임",
            "같게 유지"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "multi-choice",
      "teacherRequired": false,
      "answers": [
        1,
        4
      ]
    },
    "explanation": "축의 기울기와 방향은 유지하지만 공전 위치가 바뀌어 같은 지역의 태양 관계는 달라진다. 그 결과 고도·낮길이가 변하고 지표가 받는 에너지 차이를 설명한다. 공전마다 축을 다시 꺾거나 고도가 내내 일정하다고 하면 두 모형의 비교와 맞지 않는다.",
    "scope": "core",
    "standards": [
      "6과13-02",
      "6과13-03"
    ],
    "type": "T11",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-season-set4-questions",
        "set": 4,
        "no": 20
      }
    },
    "sourceAmbiguityInherited": false,
    "originalPromptCopied": false,
    "originalFigureReused": false,
    "evidence": {
      "actualStudentObservation": false,
      "actualEphemerisData": false,
      "dataKind": "authored-model-or-practice-record",
      "scienceReview": "independently-derived; product-render-review-pending"
    },
    "releaseReady": false,
    "choices": [
      "한 해 내내 태양의 남중 고도는 일정하다.",
      "공전 위치에 따라 같은 지역의 남중 고도가 달라진다.",
      "밤낮 길이는 바뀌어도 계절과는 관련이 없다.",
      "계절마다 축을 태양 쪽으로 다시 꺾어야 한다.",
      "남중 고도와 낮길이 변화가 받는 에너지 차이에 연결된다."
    ],
    "taxonomy": {
      "domain": "지구와 우주",
      "topic": "계절의 변화",
      "concept": "자전축 모형 비교",
      "inquirySkill": "방향·같은 지역·남중 조건으로 비교",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "type": "T11",
      "format": "multi-choice",
      "standard": "6과13-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "multi-choice",
        "teacherRequired": false,
        "answers": [
          1,
          4
        ]
      },
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    }
  }
];
