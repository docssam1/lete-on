export const unit = {
  "id": "c22-s62-u02",
  "course": "6-2",
  "no": 2,
  "title": "물질의 연소",
  "domain": "물질",
  "sources": {
    "originalExamAvailable": false,
    "scope": "독립 연습70(핵심49·보조21). 원문과 공식 답은 포함하지 않는다.",
    "guidance": "실제 관찰·교사 제공 기록·연습 모형을 구별하고 결론의 범위를 확인해요."
  }
};
export const items = [
  {
    "key": "1-1",
    "id": "c22-s62-u02-v001",
    "status": "authored",
    "kind": "mc",
    "prompt": "관찰 노트에 실제로 확인한 변화만 옮긴 문장을 고르세요.",
    "givens": {
      "기록": {
        "머리": [
          "관찰 시점",
          "초 길이",
          "받침 위 상태"
        ],
        "행": [
          [
            "처음",
            "8.0cm",
            "고체 초가 서 있음"
          ],
          [
            "잠시 뒤",
            "7.6cm",
            "녹은 촛농이 보임"
          ]
        ]
      },
      "조건": "교사 시범을 보고 만든 연습 기록이다. 초의 크기를 같은 방향에서 읽었다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
    },
    "explanation": "노트에서는 길이가8.0cm에서7.6cm로 줄었고 녹은 촛농이 보였다고 했다. 이 두 관찰을 함께 옮긴 문장이 맞다. 물질 전체의 소멸이나 모든 부분의 온도는 이 자료에서 측정하지 않았다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T01",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set1-questions",
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
      "초 속의 물질이 모두 없어졌다.",
      "초가 짧아지고 일부가 녹았다.",
      "촛농은 처음부터 기체였다.",
      "초의 길이가 점점 늘어났다.",
      "초의 모든 부분이 같은 온도였다."
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "촛불 관찰",
      "inquirySkill": "관찰과 추론 구별",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T01",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "1-2",
    "id": "c22-s62-u02-v002",
    "status": "authored",
    "kind": "es",
    "prompt": "이 기록에서 줄어든 것은 무엇인지 설명하고, “물질이 완전히 사라졌다”는 결론을 고쳐 쓰세요.",
    "givens": {
      "기록": {
        "머리": [
          "시점",
          "용기와 남은 연료의 질량"
        ],
        "행": [
          [
            "연소 전",
            "162.4g"
          ],
          [
            "연소 뒤 식힌 후",
            "160.9g"
          ]
        ]
      },
      "조건": "같은 용기를 달았다. 용기는 바깥 공기와 통하며 밖으로 나간 기체는 저울에 함께 올리지 않았다. 교사가 만든 연습 자료이다."
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "용기와 남은 연료의 질량이1.5g 줄었다. 밖으로 나간 기체를 함께 재지 않았으므로 전체 물질이 사라졌다고 할 수 없다.",
      "required": [
        "용기와 남은 연료의 질량을 비교한다.",
        "밖으로 나간 기체를 함께 재지 않았다는 조건을 사용한다.",
        "전체 물질 소멸이라는 단정을 고친다."
      ],
      "exactStringScoring": false
    },
    "explanation": "162.4−160.9=1.5g이다. 이 값은 저울에 올린 용기와 남은 연료에 관한 차이이다. 열린 장치에서 다른 물질로 변해 밖으로 나간 기체까지 합쳐 잰 자료가 아니므로 전체 물질이 없어졌다는 결론은 성립하지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-03"
    ],
    "type": "T12",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set1-questions",
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
    "verificationModel": {
      "kind": "remaining-mass-difference",
      "before": 162.4,
      "after": 160.9,
      "difference": 1.5
    },
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "열린 용기의 알코올 양 비교",
      "inquirySkill": "연소 전후 성질·결론 범위 비교",
      "itemType": "es",
      "track": "교과",
      "level": "기본",
      "element": "E6",
      "type": "T12",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "용기와 남은 연료의 질량이1.5g 줄었다. 밖으로 나간 기체를 함께 재지 않았으므로 전체 물질이 사라졌다고 할 수 없다.",
        "required": [
          "용기와 남은 연료의 질량을 비교한다.",
          "밖으로 나간 기체를 함께 재지 않았다는 조건을 사용한다.",
          "전체 물질 소멸이라는 단정을 고친다."
        ],
        "exactStringScoring": false
      },
      "type": "written-explanation",
      "sample": "용기와 남은 연료의 질량이1.5g 줄었다. 밖으로 나간 기체를 함께 재지 않았으므로 전체 물질이 사라졌다고 할 수 없다.",
      "rubric": {
        "required": [
          "용기와 남은 연료의 질량을 비교한다.",
          "밖으로 나간 기체를 함께 재지 않았다는 조건을 사용한다.",
          "전체 물질 소멸이라는 단정을 고친다."
        ],
        "pass": "자료와 조건을 연결한 설명을 선생님이 확인해요."
      }
    }
  },
  {
    "key": "1-3",
    "id": "c22-s62-u02-v003",
    "status": "authored",
    "kind": "st",
    "prompt": "두 연료의 공통 관찰로 묶을 수 있는 문장을 고르세요. (정답 2개)",
    "givens": {
      "기록": {
        "머리": [
          "관찰 항목",
          "양초",
          "알코올"
        ],
        "행": [
          [
            "주변 밝기",
            "밝아짐",
            "밝아짐"
          ],
          [
            "주변 온도계",
            "처음보다 높음",
            "처음보다 높음"
          ],
          [
            "남은 연료 모양",
            "녹은 촛농이 보임",
            "액체의 양이 줄어듦"
          ]
        ]
      },
      "조건": "안전선 밖에서 교사의 시범을 관찰한 연습 기록이다."
    },
    "responseContract": {
      "kind": "multi-choice",
      "teacherRequired": false,
      "answers": [
        0,
        4
      ]
    },
    "explanation": "두 열에 모두 주변이 밝아지고 온도계 표시가 높아졌다는 기록이 있다. 따라서 빛과 열은 공통으로 묶을 수 있다. 촛농이나 심지의 특징은 모든 연료에 공통이라고 확인하지 않았다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T02",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set1-questions",
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
    "choices": [
      "주변으로 열이 전달된다.",
      "두 연료에 촛농이 흐른다.",
      "두 연료의 모양이 늘 같다.",
      "두 연료에 같은 심지가 보인다.",
      "주변을 밝히는 빛이 나온다."
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "초와 알코올의 공통 현상",
      "inquirySkill": "연소 현상의 공통점 비교",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T02",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "multi-choice",
        "teacherRequired": false,
        "answers": [
          0,
          4
        ]
      },
      "type": "multi-choice",
      "answers": [
        0,
        4
      ]
    }
  },
  {
    "key": "1-4",
    "id": "c22-s62-u02-v004",
    "status": "authored",
    "kind": "mc",
    "prompt": "이동식 조리대에서 연료가 탈 때의 열을 직접 이용하는 장치를 고르세요.",
    "givens": {
      "조건": "각 장치는 이름에 적힌 방식으로만 작동한다. 전기를 만드는 발전소의 과정은 이번 비교 범위에 넣지 않는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4
    },
    "explanation": "숯 화로는 숯이 연소하며 내는 열을 조리에 이용한다. 태양열 조리기는 햇빛을, 나머지 장치는 장치 안에서 전기에너지를 이용하는 방식이다. 전기가 만들어지기 전의 발전 과정과 장치의 직접 작동을 구분한다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T03",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set1-questions",
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
    "choices": [
      "햇빛을 모으는 태양열 조리기",
      "전기로 가열하는 전기 조리기",
      "전기로 켜는 휴대용 작업등",
      "손잡이를 돌려 켜는 발전등",
      "숯을 태우는 작은 화로"
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "연소의 빛과 열 이용",
      "inquirySkill": "장치의 직접 에너지원 분류",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T03",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "1-5",
    "id": "c22-s62-u02-v005",
    "status": "authored",
    "kind": "st",
    "prompt": "덮개 안 공기량의 영향만 비교하려고 합니다. 처음 조건을 알맞게 맞춘 계획의 기호를 쓰세요.",
    "givens": {
      "계획": {
        "머리": [
          "기호",
          "비교할 초",
          "불꽃 상태",
          "바꾸는 조건"
        ],
        "행": [
          [
            "ㄱ",
            "서로 다른 굵기",
            "비슷함",
            "덮개 크기"
          ],
          [
            "ㄴ",
            "같은 종류·굵기",
            "비슷함",
            "덮개 크기"
          ],
          [
            "ㄷ",
            "같은 종류·굵기",
            "하나는 막 켜짐, 하나는 안정됨",
            "덮개 크기"
          ]
        ]
      },
      "조건": "교사가 기구 적합성을 확인한 시범 계획이다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "ㄴ은 초의 종류·굵기와 처음 불꽃을 맞추고 덮개 크기만 바꾼다. ㄱ은 연료 조건이, ㄷ은 시작 상태가 함께 달라진다. 덮개 공기량의 효과를 비교하려면 나머지 중요한 조건을 맞춰야 한다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T04",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set1-questions",
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
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "공기량 비교의 실험 절차",
      "inquirySkill": "비교 실험의 변인 통제",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T04",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "id": "c22-s62-u02-v006",
    "status": "authored",
    "kind": "es",
    "prompt": "어느 덮개에서 연소가 더 오래 이어졌는지 쓰고, 처음 들어 있던 공기와 산소의 양을 연결해 설명하세요.",
    "givens": {
      "조건": "교사가 제공한 연습 기록이다. 직접 실험한 결과가 아니며, 같은 종류·크기의 초와 비슷한 초기 불꽃, 같은 공기 조성·온도를 사용한다. 덮개 틈으로 바깥 공기가 계속 들어오지 않는 비교이다.",
      "기록": {
        "머리": [
          "덮개",
          "내부 공기 부피",
          "불이 이어진 시간"
        ],
        "행": [
          [
            "A",
            "600mL",
            "14초"
          ],
          [
            "B",
            "1200mL",
            "29초"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "B에서 더 오래 이어졌다. 같은 조성의 공기가 더 많이 들어 있어 처음 산소의 양도 더 많았기 때문이다.",
      "required": [
        "B와 더 긴 지속 시간을 연결한다.",
        "같은 공기 조성이라는 비교 조건을 사용한다.",
        "공기 부피가 클수록 처음 산소량도 많다는 관계를 설명한다."
      ],
      "exactStringScoring": false
    },
    "explanation": "B는29초, A는14초이므로 이 기록에서 B가 더 오래 이어졌다. 같은 조성에서 부피가 큰 B에는 처음 산소도 더 많이 들어 있다. 이 표만으로 연소 시간이 부피에 정확히 비례한다거나 산소가0이 되어 꺼졌다고 할 수는 없다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T05",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set1-questions",
        "set": 1,
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
      "kind": "volume-duration-order",
      "volumes": [
        600,
        1200
      ],
      "durations": [
        14,
        29
      ],
      "longerIndex": 1
    },
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "밀폐 덮개 크기와 지속 시간",
      "inquirySkill": "공기 부피와 처음 산소량 비교",
      "itemType": "es",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T05",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "B에서 더 오래 이어졌다. 같은 조성의 공기가 더 많이 들어 있어 처음 산소의 양도 더 많았기 때문이다.",
        "required": [
          "B와 더 긴 지속 시간을 연결한다.",
          "같은 공기 조성이라는 비교 조건을 사용한다.",
          "공기 부피가 클수록 처음 산소량도 많다는 관계를 설명한다."
        ],
        "exactStringScoring": false
      },
      "type": "written-explanation",
      "sample": "B에서 더 오래 이어졌다. 같은 조성의 공기가 더 많이 들어 있어 처음 산소의 양도 더 많았기 때문이다.",
      "rubric": {
        "required": [
          "B와 더 긴 지속 시간을 연결한다.",
          "같은 공기 조성이라는 비교 조건을 사용한다.",
          "공기 부피가 클수록 처음 산소량도 많다는 관계를 설명한다."
        ],
        "pass": "자료와 조건을 연결한 설명을 선생님이 확인해요."
      }
    }
  },
  {
    "key": "1-7",
    "id": "c22-s62-u02-v007",
    "status": "authored",
    "kind": "st",
    "prompt": "보기의 “많다·적다”를 골라 두 칸을 순서대로 채우세요. ㉠은 큰 덮개, ㉡은 작은 덮개의 처음 산소량입니다.",
    "givens": {
      "조건": "두 덮개에 같은 조성·온도의 공기가 들어 있다. 큰 덮개는 작은 덮개보다 내부 부피가 크다. 서로 비교한 말로 쓴다."
    },
    "responseContract": {
      "kind": "ordered-term-parts",
      "teacherRequired": false,
      "parts": [
        {
          "kind": "short-text",
          "accepted": [
            "많다",
            "더 많다",
            "많음"
          ]
        },
        {
          "kind": "short-text",
          "accepted": [
            "적다",
            "더 적다",
            "적음"
          ]
        }
      ]
    },
    "explanation": "같은 조성의 공기에서는 같은 부피마다 포함된 산소의 양이 같다. 따라서 큰 덮개의 처음 산소량은 상대적으로 많고 작은 덮개는 적다. 두 덮개의 산소 비율 자체가 서로 다르다고 바꾸어 쓰지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T05",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set1-questions",
        "set": 1,
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
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "공기량과 산소량에 따른 지속 시간",
      "inquirySkill": "공기 부피와 처음 산소량 비교",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T05",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "ordered-term-parts",
        "teacherRequired": false,
        "parts": [
          {
            "kind": "short-text",
            "accepted": [
              "많다",
              "더 많다",
              "많음"
            ]
          },
          {
            "kind": "short-text",
            "accepted": [
              "적다",
              "더 적다",
              "적음"
            ]
          }
        ]
      },
      "type": "short-text",
      "answer": "많다 / 적다",
      "accepted": [
        "많다 / 적다"
      ],
      "inputHint": "각 부분의 답을 따로 써요."
    }
  },
  {
    "key": "1-8",
    "id": "c22-s62-u02-v008",
    "status": "authored",
    "kind": "mc",
    "prompt": "교사 시범 기록에서 뒷받침되는 설명을 고르세요.",
    "givens": {
      "기록": "금속판 위의 작은 연료 조각은 불꽃에 닿지 않았다. 교사가 판의 아래쪽을 가열하자 잠시 뒤 조각에 불이 붙었다.",
      "조건": "학생은 기록을 읽으며 기구를 가열하지 않는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
    },
    "explanation": "조각은 불꽃과 떨어져 있었지만 금속판을 통해 가열됐다. 이 기록은 온도가 충분히 높아지면 직접 불꽃을 대지 않아도 불이 붙을 수 있음을 보여 준다. 금속판의 연소나 산소만의 작용을 입증한 기록은 아니다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T07",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set1-questions",
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
      "불꽃이 닿지 않으면 온도도 올라갈 수 없다.",
      "조각이 타려면 금속판 자체가 먼저 타야 한다.",
      "불꽃에 직접 닿지 않아도 타기 시작할 수 있다.",
      "가열을 멈춰 온도가 낮아져서 불이 붙었다.",
      "온도가 달라도 산소만 있으면 늘 불이 붙는다."
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "간접 가열과 발화",
      "inquirySkill": "가열·타기 시작하는 조건 해석",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T07",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "1-9",
    "id": "c22-s62-u02-v009",
    "status": "authored",
    "kind": "st",
    "prompt": "다음 설명에서 찾은 온도 기준의 이름을 쓰세요.",
    "givens": {
      "설명": "어떤 물질을 가열했더니 직접 불꽃을 대지 않아도 타기 시작했다. 이처럼 그 물질이 타기 시작할 수 있는 온도 기준을 부르는 말이다.",
      "조건": "물질마다 같은 숫자라고 가정하지 않는다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "발화점"
      ]
    },
    "explanation": "직접 불꽃을 대지 않아도 물질이 타기 시작할 수 있는 온도 기준을 발화점이라고 한다. 액체가 끓는 온도인 끓는점과 구별한다. 제시 자료에는 구체적인 온도 수치가 없으므로 숫자 답을 만들지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T07",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set1-questions",
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
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "발화점의 뜻",
      "inquirySkill": "가열·타기 시작하는 조건 해석",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T07",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "발화점"
        ]
      },
      "type": "short-text",
      "answer": "발화점",
      "accepted": [
        "발화점"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "1-10",
    "id": "c22-s62-u02-v010",
    "status": "authored",
    "kind": "mc",
    "prompt": "설명 카드에 붙일 현상 이름을 고르세요.",
    "givens": {
      "카드": "나무 조각이 산소와 빠르게 반응하면서 빛과 열을 내고, 타기 전과 다른 물질로 변하는 현상이다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0
    },
    "explanation": "카드에는 산소와의 빠른 반응, 빛과 열, 연소 전후의 성질 변화가 함께 있다. 이 현상을 연소라고 한다. 물에 녹는 용해나 상태 변화, 연소를 그치게 하는 소화와 구별된다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T09",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set1-questions",
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
      "연소",
      "응결",
      "용해",
      "증발",
      "소화"
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "연소의 뜻",
      "inquirySkill": "연소와 다른 변화 구별",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T09",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "1-11",
    "id": "c22-s62-u02-v011",
    "status": "authored",
    "kind": "st",
    "prompt": "초가 계속 타는 조건을 바르게 설명한 문장을 고르세요. (정답 2개)",
    "givens": {
      "조건": "일반적인 초의 연소를 비교한다. 교사가 설명용으로 만든 카드이며 학생이 점화하는 활동은 아니다."
    },
    "responseContract": {
      "kind": "multi-choice",
      "teacherRequired": false,
      "answers": [
        2,
        3
      ]
    },
    "explanation": "탈 물질과 산소가 필요하며, 온도도 연소를 지속할 수 있을 만큼 높아야 한다. 발화점 미만의 온도를 유지하거나 산소를 이산화 탄소로 대신하는 설명은 맞지 않는다. 한 조건만으로 언제나 연소가 계속되는 것은 아니다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T08",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set1-questions",
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
    "choices": [
      "산소 대신 이산화 탄소만 공급하면 된다.",
      "탈 물질이 없어도 온도만 높으면 계속 탄다.",
      "탈 물질이 계속 공급되어야 한다.",
      "연소를 도울 산소가 필요하다.",
      "온도는 발화점보다 낮게 유지해야 한다."
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "연소에 필요한 조건",
      "inquirySkill": "연소 조건의 조합 판단",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T08",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "multi-choice",
        "teacherRequired": false,
        "answers": [
          2,
          3
        ]
      },
      "type": "multi-choice",
      "answers": [
        2,
        3
      ]
    }
  },
  {
    "key": "1-12",
    "id": "c22-s62-u02-v012",
    "status": "authored",
    "kind": "mc",
    "prompt": "초를 태운 뒤 모은 기체를 새 석회수와 접촉시킨 결과입니다. 확인하려는 물질을 고르세요.",
    "givens": {
      "기록": {
        "머리": [
          "같은 양의 새 석회수와 접촉한 기체",
          "변화"
        ],
        "행": [
          [
            "초를 태우지 않은 비교 용기의 공기",
            "짧은 비교 시간 동안 맑음"
          ],
          [
            "초를 태운 용기의 기체",
            "뿌옇게 흐려짐"
          ]
        ]
      },
      "조건": "같은 용기·접촉 시간으로 비교한 교사 제공 연습 기록이다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3
    },
    "explanation": "초를 태운 쪽의 기체에서 석회수가 흐려지고 비교 쪽에서는 같은 시간 동안 맑았다. 석회수의 이런 반응은 이산화 탄소를 확인하는 근거이다. 물을 확인하는 시험지의 색 변화와 혼동하지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-03"
    ],
    "type": "T11",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set1-questions",
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
      "물",
      "산소",
      "질소",
      "이산화 탄소",
      "촛농"
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "초 연소 뒤 석회수 반응",
      "inquirySkill": "이산화 탄소 확인의 근거 연결",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E6",
      "type": "T11",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-03"
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
    "key": "1-13",
    "id": "c22-s62-u02-v013",
    "status": "authored",
    "kind": "st",
    "prompt": "초의 연소 뒤 확인할 수 있는 생성물을 고르세요. (정답 2개)",
    "givens": {
      "조건": "파라핀으로 만든 초의 연소를 대상으로 한다. 확인 시험은 교사가 맡으며 모든 물질의 연소를 묻는 문제가 아니다."
    },
    "responseContract": {
      "kind": "multi-choice",
      "teacherRequired": false,
      "answers": [
        0,
        1
      ]
    },
    "explanation": "파라핀 초의 연소에서는 물과 이산화 탄소를 확인할 수 있다. 산소는 연소에 참여하는 물질이고 석회수는 확인 시약이다. 금속판은 이 조건의 생성물이 아니다. 이 결론의 대상을 초에서 모든 연료로 확대하지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-03"
    ],
    "type": "T12",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set1-questions",
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
    "choices": [
      "물",
      "이산화 탄소",
      "석회수",
      "산소",
      "금속판"
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "초 연소 생성물",
      "inquirySkill": "연소 전후 성질·결론 범위 비교",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E6",
      "type": "T12",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "multi-choice",
        "teacherRequired": false,
        "answers": [
          0,
          1
        ]
      },
      "type": "multi-choice",
      "answers": [
        0,
        1
      ]
    }
  },
  {
    "key": "1-14",
    "id": "c22-s62-u02-v014",
    "status": "authored",
    "kind": "st",
    "prompt": "교사 모형에서 바깥 공기의 공급을 제한하는 변화에 해당하는 기호를 쓰세요.",
    "givens": {
      "분류": {
        "머리": [
          "기호",
          "모형에서 바꾸는 조건"
        ],
        "행": [
          [
            "ㄱ",
            "탈 물질을 없앰"
          ],
          [
            "ㄴ",
            "온도만 낮춤"
          ],
          [
            "ㄷ",
            "바깥 공기의 유입을 줄임"
          ]
        ]
      },
      "모형": "초와 받침은 그대로 두고 덮개의 열린 틈을 막는 상황을 카드로 나타냈다. 실제 소화 실습이 아니다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "초와 받침을 그대로 둔 채 바깥 공기가 들어오는 틈을 제한하는 것은 ㄷ이다. 탈 물질을 꺼내는 변화나 온도만 낮춘 변화와 분류가 다르다. 불이 꺼져도 내부 산소가 반드시0이 됐다는 뜻은 아니다.",
    "scope": "support",
    "standards": [
      "6과14-02"
    ],
    "type": "T13",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set1-questions",
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
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "덮개와 소화 조건",
      "inquirySkill": "소화 모형의 작용·해석 한계 구별",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T13",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "1-15",
    "id": "c22-s62-u02-v015",
    "status": "authored",
    "kind": "st",
    "prompt": "불을 사용하지 않는 안전교육에서 카드 네 장을 절차대로 배열하세요. 기호만 쓰세요.",
    "givens": {
      "조건": "훈련받은 성인의 초기 대응을 설명하는 모형 카드이다. 교사가 먼저 “안전한 피난로 확보→기구 사용 준비→분사 방향 준비→기구 조작”의 순서를 정했다. 학생은 카드만 배열한다.",
      "카드": {
        "머리": [
          "기호",
          "카드 내용"
        ],
        "행": [
          [
            "ㄱ",
            "기구의 안전핀을 해제한다."
          ],
          [
            "ㄴ",
            "호스를 목표 방향으로 준비한다."
          ],
          [
            "ㄷ",
            "안전한 피난로를 확보한다."
          ],
          [
            "ㄹ",
            "손잡이를 조작한다."
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
        "ㄴ",
        "ㄹ"
      ]
    },
    "explanation": "제시된 교육 순서의 첫 단계는 피난로 확보이므로 ㄷ이다. 이어 기구 준비인 ㄱ, 방향 준비인 ㄴ, 손잡이 조작인 ㄹ이 된다. 이는 모형 카드의 순서를 읽는 과제이며 실제 화재에서 학생이 직접 진화하라는 지시가 아니다.",
    "scope": "support",
    "standards": [
      "6과14-02"
    ],
    "type": "T14",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set1-questions",
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
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "분말 소화기 사용 순서",
      "inquirySkill": "안전 자료의 조건과 순서 판단",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T14",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "ordered-label-sequence",
        "teacherRequired": false,
        "sequence": [
          "ㄷ",
          "ㄱ",
          "ㄴ",
          "ㄹ"
        ]
      },
      "type": "short-text",
      "answer": "ㄷ → ㄱ → ㄴ → ㄹ",
      "accepted": [
        "ㄷ → ㄱ → ㄴ → ㄹ"
      ],
      "inputHint": "기호를 순서대로 이어요."
    }
  },
  {
    "key": "2-1",
    "id": "c22-s62-u02-v016",
    "status": "authored",
    "kind": "st",
    "prompt": "교사가 만든 위치별 연습 기록입니다. 이 기록에서 온도계 표시가 가장 높은 위치의 기호를 쓰세요.",
    "givens": {
      "기록": {
        "머리": [
          "기호",
          "온도계 위치",
          "표시"
        ],
        "행": [
          [
            "ㄱ",
            "불꽃의 옆쪽",
            "31℃"
          ],
          [
            "ㄴ",
            "불꽃의 위쪽",
            "48℃"
          ],
          [
            "ㄷ",
            "불꽃의 아래쪽",
            "27℃"
          ]
        ]
      },
      "조건": "불꽃 밖의 정해진 세 위치를 비교한 가상 연습 자료이다. 손으로 온도를 시험하지 않는다. 불꽃 내부의 부위별 온도를 잰 자료는 아니다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "세 표시31·48·27℃ 중 가장 큰48℃가 ㄴ에 있다. 따라서 이 기록에서 가장 높은 위치는 ㄴ이다. 불꽃 밖의 세 위치만 비교했으므로 불꽃 내부의 최고 온도나 모든 불꽃의 정확한 온도를 뜻하지 않는다.",
    "scope": "support",
    "standards": [
      "6과14-02"
    ],
    "type": "T01",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set2-questions",
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
    "verificationModel": {
      "kind": "maximum-label",
      "values": [
        31,
        48,
        27
      ],
      "labels": [
        "ㄱ",
        "ㄴ",
        "ㄷ"
      ],
      "expected": "ㄴ"
    },
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "불꽃 주변 뜨거운 위치",
      "inquirySkill": "관찰과 추론 구별",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T01",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "2-2",
    "id": "c22-s62-u02-v017",
    "status": "authored",
    "kind": "mc",
    "prompt": "알코올 시범 노트와 맞지 않는 문장을 고르세요.",
    "givens": {
      "기록": {
        "머리": [
          "항목",
          "처음",
          "잠시 뒤"
        ],
        "행": [
          [
            "남은 알코올의 양",
            "12mL",
            "10mL"
          ],
          [
            "주변 밝기",
            "불을 켜기 전",
            "주변이 밝아짐"
          ]
        ]
      },
      "조건": "교사가 제공한 연습 기록이다. 연료를 추가하지 않았으며 넘친 액체는 없다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
    },
    "explanation": "연료를 추가하지 않은 기록에서12mL가10mL로 줄었다. 따라서 남은 양이 늘었다는 문장은 맞지 않는다. 이2mL 차이를 공기나 생성 기체까지 포함한 전체 물질의 감소라고 해석하지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T01",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set2-questions",
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
      "알코올의 남은 양이 줄었다.",
      "알코올의 남은 양이 늘었다.",
      "시범 중 주변이 밝아졌다.",
      "처음과 나중의 양이 달랐다.",
      "제시한 부피 차이는2mL였다."
    ],
    "verificationModel": {
      "kind": "remaining-volume-difference",
      "before": 12,
      "after": 10,
      "difference": 2,
      "unit": "mL"
    },
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "알코올 연소 관찰",
      "inquirySkill": "관찰과 추론 구별",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T01",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "2-3",
    "id": "c22-s62-u02-v018",
    "status": "authored",
    "kind": "st",
    "prompt": "두 연료의 공통점을 설명하는 데 사용할 수 없는 카드의 기호를 쓰세요.",
    "givens": {
      "기록": "양초와 알코올 모두 주변이 밝아지고, 교사가 놓은 온도계의 표시가 높아졌다.",
      "카드": {
        "머리": [
          "기호",
          "설명"
        ],
        "행": [
          [
            "ㄱ",
            "빛이 나와 주변을 밝힌다."
          ],
          [
            "ㄴ",
            "주변으로 열이 전달된다."
          ],
          [
            "ㄷ",
            "연소하면 주변이 반드시 차가워진다."
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
    "explanation": "두 기록 모두 밝기와 온도계 표시가 높아졌다. ㄷ의 반드시 차가워진다는 설명은 이 기록과 반대이다. 공통점은 두 연료에서 함께 확인한 항목으로 묶어야 한다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T02",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set2-questions",
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
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "초와 알코올의 공통 현상",
      "inquirySkill": "연소 현상의 공통점 비교",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T02",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "2-4",
    "id": "c22-s62-u02-v019",
    "status": "authored",
    "kind": "es",
    "prompt": "“큰 덮개는 더 오래 탔지만 처음 산소의 비율도 더 높았을 것”이라는 설명을 고쳐 쓰세요.",
    "givens": {
      "조건": "교사가 제공한 연습 기록이다. 직접 실험한 결과가 아니며, 같은 종류·크기의 초와 비슷한 초기 불꽃, 같은 공기 조성·온도를 사용한다. 덮개 틈으로 바깥 공기가 계속 들어오지 않는 비교이다.",
      "기록": {
        "머리": [
          "덮개",
          "공기 부피",
          "불이 이어진 시간"
        ],
        "행": [
          [
            "작은 것",
            "750mL",
            "18초"
          ],
          [
            "큰 것",
            "1500mL",
            "35초"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "산소 비율은 같은 공기 조성이므로 같다. 큰 덮개에는 공기가 더 많이 들어 있어 처음 산소의 양이 더 많았다.",
      "required": [
        "같은 공기 조성이므로 처음 산소 비율이 같음을 설명한다.",
        "큰 부피와 처음 산소량을 연결한다.",
        "비율이 더 높아서라는 설명을 고친다."
      ],
      "exactStringScoring": false
    },
    "explanation": "공기 조성이 같으면 산소가 차지하는 비율은 같다. 큰 덮개의 공기 부피가 더 크므로 그 안에 들어 있는 처음 산소의 양이 많다. 이 기록의35초와18초는 정확한 두 배 관계가 아니며 시간의 정비례를 결론 내리지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T05",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set2-questions",
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
      "kind": "volume-duration-order",
      "volumes": [
        750,
        1500
      ],
      "durations": [
        18,
        35
      ],
      "longerIndex": 1
    },
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "덮개 크기별 연소 시간 이유",
      "inquirySkill": "공기 부피와 처음 산소량 비교",
      "itemType": "es",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T05",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "산소 비율은 같은 공기 조성이므로 같다. 큰 덮개에는 공기가 더 많이 들어 있어 처음 산소의 양이 더 많았다.",
        "required": [
          "같은 공기 조성이므로 처음 산소 비율이 같음을 설명한다.",
          "큰 부피와 처음 산소량을 연결한다.",
          "비율이 더 높아서라는 설명을 고친다."
        ],
        "exactStringScoring": false
      },
      "type": "written-explanation",
      "sample": "산소 비율은 같은 공기 조성이므로 같다. 큰 덮개에는 공기가 더 많이 들어 있어 처음 산소의 양이 더 많았다.",
      "rubric": {
        "required": [
          "같은 공기 조성이므로 처음 산소 비율이 같음을 설명한다.",
          "큰 부피와 처음 산소량을 연결한다.",
          "비율이 더 높아서라는 설명을 고친다."
        ],
        "pass": "자료와 조건을 연결한 설명을 선생님이 확인해요."
      }
    }
  },
  {
    "key": "2-5",
    "id": "c22-s62-u02-v020",
    "status": "authored",
    "kind": "st",
    "prompt": "산소 센서의 연습 기록에서 바르게 읽은 문장을 고르세요. (정답 2개)",
    "givens": {
      "기록": {
        "머리": [
          "시점",
          "산소 비율"
        ],
        "행": [
          [
            "연소 전",
            "20.8%"
          ],
          [
            "불이 꺼진 뒤",
            "17.6%"
          ]
        ]
      },
      "조건": "외부 기체가 측정 중 들어오지 않게 관리한 교사 제공 기록이다. 실제 학생 관측값이 아니다."
    },
    "responseContract": {
      "kind": "multi-choice",
      "teacherRequired": false,
      "answers": [
        3,
        4
      ]
    },
    "explanation": "20.8%에서17.6%로 표시가 낮아졌다.17.6%는0%가 아니므로 불이 꺼진 뒤에도 산소가 남아 있다. 따라서 산소를 사용했다는 해석과 산소가 완전히 없어졌다는 해석은 구별해야 한다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T06",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set2-questions",
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
    "choices": [
      "연소 뒤 산소 비율이 더 높아졌다.",
      "산소가 하나도 남지 않아0%이다.",
      "연소 전후 산소 비율이 같았다.",
      "산소 비율이 낮아졌다.",
      "불이 꺼진 뒤에도 산소가 남아 있다."
    ],
    "verificationModel": {
      "kind": "oxygen-fraction-difference",
      "before": 20.8,
      "after": 17.6,
      "difference": 3.2,
      "remainingPositive": true
    },
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "산소 비율 전후 비교",
      "inquirySkill": "산소 비율의 전후 자료 해석",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T06",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "multi-choice",
        "teacherRequired": false,
        "answers": [
          3,
          4
        ]
      },
      "type": "multi-choice",
      "answers": [
        3,
        4
      ]
    }
  },
  {
    "key": "2-6",
    "id": "c22-s62-u02-v021",
    "status": "authored",
    "kind": "st",
    "prompt": "같은 양의 연료를 비교하는 카드에서, 연소를 돕는 공기 중 기체의 이름을 쓰세요.",
    "givens": {
      "카드": "그 기체가 충분히 공급되는 조건에서는 향이 잘 탔다. 같은 장치에서 그 기체의 공급이 줄어들면 향의 연소를 계속 유지하기 어려웠다.",
      "조건": "다른 조건을 맞춘 교사 설명 자료이며, 향을 학생이 점화하지 않는다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "산소"
      ]
    },
    "explanation": "산소는 다른 물질이 타는 것을 돕는 공기 중 기체이다. 공급을 충분히 한 조건과 줄인 조건의 차이를 근거로 삼는다. 공기 전체나 이산화 탄소를 그 기체 이름과 같게 쓰지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T06",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set2-questions",
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
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "연소를 돕는 기체",
      "inquirySkill": "산소 비율의 전후 자료 해석",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T06",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "산소"
        ]
      },
      "type": "short-text",
      "answer": "산소",
      "accepted": [
        "산소"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "2-7",
    "id": "c22-s62-u02-v022",
    "status": "authored",
    "kind": "st",
    "prompt": "같은 조건으로 가열한 두 재료 중 먼저 타기 시작한 재료의 기호를 쓰세요.",
    "givens": {
      "기록": {
        "머리": [
          "기호",
          "재료",
          "불이 붙은 순서"
        ],
        "행": [
          [
            "ㄱ",
            "작은 나무 조각",
            "두 번째"
          ],
          [
            "ㄴ",
            "같은 성냥의 머리 부분",
            "첫 번째"
          ]
        ]
      },
      "조건": "교사가 같은 크기로 준비하고 가열 중심에서 같은 거리에 놓아 비교했다. 직접 점화하거나 가열하는 학생 활동은 아니다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "기록에서 첫 번째로 불이 붙은 것은 ㄴ이다. 가열 조건을 비슷하게 맞춘 비교에서 재료에 따라 타기 시작하는 조건이 다를 수 있음을 읽는다. 표에는 실제 발화점 수치가 없으므로 정확한 온도를 만들어 쓰지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T07",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set2-questions",
        "set": 2,
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
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "성냥 머리와 나무의 발화",
      "inquirySkill": "가열·타기 시작하는 조건 해석",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T07",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "2-8",
    "id": "c22-s62-u02-v023",
    "status": "authored",
    "kind": "mc",
    "prompt": "온도에 관한 두 설명을 비교했습니다. 타기 시작하는 조건을 나타내는 말을 고르세요.",
    "givens": {
      "설명": "한 카드는 물이 끓는 온도를, 다른 카드는 물질을 가열하여 직접 불꽃 없이도 타기 시작할 수 있는 온도를 설명한다. 두 번째 카드의 이름을 묻는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4
    },
    "explanation": "두 번째 카드는 끓거나 녹는 상태 변화를 말하지 않고 타기 시작하는 온도 기준을 설명한다. 그러므로 발화점이다. 어떤 물질이든 같은 발화점이라고 하거나 끓는점과 같은 말로 바꾸지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T07",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set2-questions",
        "set": 2,
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
      "끓는점",
      "녹는점",
      "어는점",
      "현재 기온",
      "발화점"
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "발화점의 뜻",
      "inquirySkill": "가열·타기 시작하는 조건 해석",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T07",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "2-9",
    "id": "c22-s62-u02-v024",
    "status": "authored",
    "kind": "st",
    "prompt": "두 장면 가운데 나무가 산소와 빠르게 반응하며 빛·열을 내는 현상의 이름을 쓰세요.",
    "givens": {
      "장면": {
        "머리": [
          "장면",
          "기록"
        ],
        "행": [
          [
            "A",
            "나무가 타며 빛과 열이 나고 다른 물질로 바뀜"
          ],
          [
            "B",
            "뜨거운 물이 식으며 수증기 양이 줄어듦"
          ]
        ]
      },
      "조건": "장면A의 현상 이름을 쓴다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "연소"
      ]
    },
    "explanation": "A에서는 나무가 산소와 빠르게 반응하며 빛과 열을 내고 다른 물질로 바뀐다. 이 현상은 연소이다. B의 수증기 변화라는 다른 장면을 A의 현상 이름으로 바꾸지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T09",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set2-questions",
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
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "연소의 뜻",
      "inquirySkill": "연소와 다른 변화 구별",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T09",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "연소"
        ]
      },
      "type": "short-text",
      "answer": "연소",
      "accepted": [
        "연소"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "2-10",
    "id": "c22-s62-u02-v025",
    "status": "authored",
    "kind": "st",
    "prompt": "연소를 계속하기 위한 세 조건과 짝이 맞지 않는 카드의 기호를 쓰세요.",
    "givens": {
      "카드": {
        "머리": [
          "기호",
          "조건 카드"
        ],
        "행": [
          [
            "ㄱ",
            "탈 물질을 준비한다."
          ],
          [
            "ㄴ",
            "산소가 공급되게 한다."
          ],
          [
            "ㄷ",
            "온도를 계속 발화점 아래에 둔다."
          ]
        ]
      },
      "조건": "일반적인 초의 연소를 설명하는 모형이다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "초의 연소에는 탈 물질·산소와 충분한 온도가 필요하다. 온도를 계속 발화점 아래에 둔다는 ㄷ은 그 조건과 맞지 않는다. 다른 두 조건이 있다는 사실만으로 온도 조건을 생략할 수는 없다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T08",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set2-questions",
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
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "연소의 세 조건",
      "inquirySkill": "연소 조건의 조합 판단",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T08",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "2-11",
    "id": "c22-s62-u02-v026",
    "status": "authored",
    "kind": "mc",
    "prompt": "교사가 연소 뒤 물을 확인할 시험지를 골랐습니다. 확인 목적에 맞는 것을 고르세요.",
    "givens": {
      "조건": "물에 닿았을 때의 반응을 연소 전후에 비교한다. 산·염기 확인이나 접착 실험을 하는 것은 아니다. 시약은 교사가 취급한다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
    },
    "explanation": "푸른 염화 코발트 종이는 물을 확인하는 반응에 이용할 수 있다. 리트머스 종이는 다른 확인 목적이며 거름종이나 접착테이프가 같은 시험을 대신하지 않는다. 시험지 이름과 그 반응으로 판단한 물질을 구별한다.",
    "scope": "core",
    "standards": [
      "6과14-03"
    ],
    "type": "T10",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set2-questions",
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
    "choices": [
      "붉은 리트머스 종이",
      "푸른 리트머스 종이",
      "푸른 염화 코발트 종이",
      "무늬 없는 거름종이",
      "투명 접착테이프"
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "물을 확인하는 시험지",
      "inquirySkill": "물 확인 시험의 관찰과 추론",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E5",
      "type": "T10",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-03"
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
    "key": "2-12",
    "id": "c22-s62-u02-v027",
    "status": "authored",
    "kind": "st",
    "prompt": "기록과 연결되는 추론 카드의 기호를 쓰세요.",
    "givens": {
      "기록": "같은 시간 비교했을 때 연소 전 공기를 넣은 석회수는 맑았고, 초를 태운 용기의 기체를 넣은 석회수는 흐려졌다.",
      "카드": {
        "머리": [
          "기호",
          "추론"
        ],
        "행": [
          [
            "ㄱ",
            "물이 생겼다는 근거만 확인했다."
          ],
          [
            "ㄴ",
            "이산화 탄소를 확인하는 근거가 있다."
          ],
          [
            "ㄷ",
            "새 석회수 자체가 연소 생성물이다."
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
    "explanation": "석회수가 흐려지는 반응을 이용한 이산화 탄소 확인은 ㄴ과 연결된다. 물은 다른 확인 시험의 근거가 필요하고 석회수 자체가 초에서 만들어졌다는 뜻은 아니다. 관찰과 추론의 연결을 바꾸지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-03"
    ],
    "type": "T11",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set2-questions",
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
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "석회수 관찰과 추론",
      "inquirySkill": "이산화 탄소 확인의 근거 연결",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E6",
      "type": "T11",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-03"
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
    "key": "2-13",
    "id": "c22-s62-u02-v028",
    "status": "authored",
    "kind": "mc",
    "prompt": "조건 카드에서 한 가지 이상을 바꾸어 연소를 그치게 하는 것을 무엇이라고 하나요?",
    "givens": {
      "카드": "탈 물질의 공급을 중단하거나, 바깥 산소 공급을 줄이거나, 알맞은 방법으로 온도를 낮추는 모형이다. 학생의 실제 화재 진화 실습은 아니다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0
    },
    "explanation": "필요한 연소 조건 중 하나 이상을 없애 연소를 그치게 하는 것을 소화라고 한다. 연소는 불이 타는 현상이며, 응결·기화·용해는 여기서 설명한 조건 제거의 명칭과 다르다.",
    "scope": "support",
    "standards": [
      "6과14-02"
    ],
    "type": "T13",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set2-questions",
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
      "소화",
      "연소",
      "응결",
      "용해",
      "기화"
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "소화의 뜻",
      "inquirySkill": "소화 모형의 작용·해석 한계 구별",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T13",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "2-14",
    "id": "c22-s62-u02-v029",
    "status": "authored",
    "kind": "mc",
    "prompt": "교사 시범에서 심지를 집은 뒤 불이 꺼졌습니다. 제시한 모형에서 직접 제한한 흐름을 고르세요.",
    "givens": {
      "모형": "액체 상태의 연료가 심지를 통해 불꽃 쪽으로 이동한다. 교사가 그 이동 통로를 집어 막았다고 단순화한 설명용 모형이다. 다른 작용의 유무를 실제로 측정한 실험은 아니다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3
    },
    "explanation": "제시 모형에서는 심지를 연료가 이동하는 통로로 정하고 그 통로를 막았다. 따라서 직접 제한한 것은 불꽃 쪽으로 가는 연료의 이동이다. 실제 소화의 다른 작용까지 모두 없다는 뜻으로 확대하지 않는다.",
    "scope": "support",
    "standards": [
      "6과14-02"
    ],
    "type": "T13",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set2-questions",
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
      "덮개 밖에서 오는 공기의 이동",
      "방 안의 모든 물체가 받는 빛",
      "금속 받침이 바닥에 닿는 면",
      "불꽃 쪽으로 가는 연료의 이동",
      "불꽃 위쪽에 있는 공기의 부피"
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "심지를 집었을 때의 소화",
      "inquirySkill": "소화 모형의 작용·해석 한계 구별",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T13",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "id": "c22-s62-u02-v030",
    "status": "authored",
    "kind": "mc",
    "prompt": "안전 점검회의에서 피난을 방해하는 계획을 찾아 고르세요.",
    "givens": {
      "조건": "평상시의 점검 계획을 읽는 문제이다. 실제 불을 내거나 소화기를 분사하는 활동은 하지 않는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
    },
    "explanation": "피난 통로의 상자는 이동을 방해할 수 있으므로 안전 점검 목적과 반대다. 나머지는 평소 위치·시설·방해물을 확인하는 계획이다. 소화 기구가 준비돼 있다는 사실이 학생의 직접 진화를 뜻하지는 않는다.",
    "scope": "support",
    "standards": [
      "6과14-02"
    ],
    "type": "T14",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set2-questions",
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
      "피난 안내 표지가 가려졌는지 살핀다.",
      "피난 통로에 남은 상자를 쌓아 둔다.",
      "소방 기구 위치를 안내도에서 찾는다.",
      "감지 시설의 점검 일정을 확인한다.",
      "출입구 주변에 방해물이 있는지 본다."
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "화재 예방과 대비",
      "inquirySkill": "안전 자료의 조건과 순서 판단",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T14",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "3-1",
    "id": "c22-s62-u02-v031",
    "status": "authored",
    "kind": "mc",
    "prompt": "초의 시범 노트만으로 확인했다고 말할 수 없는 내용을 고르세요.",
    "givens": {
      "노트": "초의 길이가 짧아졌다. 받침에 흘러나온 촛농은 식자 굳었다. 불꽃은 흔들렸고 주변이 밝아졌다.",
      "조건": "온도는 측정하지 않았다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4
    },
    "explanation": "온도를 측정하지 않았으므로 모든 부분의 온도가 같았다는 주장은 노트의 근거를 넘어선다. 나머지 네 문장은 실제로 노트에 적힌 관찰을 옮겼다. 관찰하지 않은 양을 다른 관찰에서 단정하지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T01",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set3-questions",
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
      "흘러나온 촛농은 식은 뒤 굳었다.",
      "초의 길이는 처음보다 짧아졌다.",
      "불꽃은 관찰하는 동안 흔들렸다.",
      "시범 중 주변이 처음보다 밝았다.",
      "초의 모든 부분은 같은 온도였다."
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "촛불의 관찰",
      "inquirySkill": "관찰과 추론 구별",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T01",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "3-2",
    "id": "c22-s62-u02-v032",
    "status": "authored",
    "kind": "mc",
    "prompt": "양초용 관찰표를 알코올 시범에 맞게 바꾸려 합니다. 고칠 항목을 바르게 고른 문장은 무엇인가요?",
    "givens": {
      "관찰표": "연료의 남은 양 / 주변 밝기 / 주변 온도계 / 흘러나온 촛농의 모양",
      "조건": "액체 알코올만 연료로 사용한다. 학생은 교사 시범의 기록을 읽는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
    },
    "explanation": "알코올은 액체 연료이므로 양초의 촛농 모양을 그대로 관찰 항목으로 쓰지 않는다. 그 항목을 남은 액체의 모습에 맞게 바꿀 수 있다. 빛·열·남은 연료는 비교하되 양초만의 구조를 모든 연료에 적용하지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T01",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set3-questions",
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
      "밝기 항목을 고체 초의 길이로 고친다.",
      "온도계 항목을 초 심지의 길이로 고친다.",
      "촛농 항목을 남은 액체의 모습으로 고친다.",
      "남은 양 항목을 굳은 촛농의 크기로 고친다.",
      "모든 항목을 초의 불꽃 색만으로 고친다."
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "알코올 연소의 관찰",
      "inquirySkill": "관찰과 추론 구별",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T01",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "3-3",
    "id": "c22-s62-u02-v033",
    "status": "authored",
    "kind": "mc",
    "prompt": "세 연료에서 공통으로 묶을 수 있는 항목을 고르세요.",
    "givens": {
      "기록": {
        "머리": [
          "연료",
          "빛 발생",
          "열 발생",
          "주로 보인 불꽃 색"
        ],
        "행": [
          [
            "초",
            "있음",
            "있음",
            "노란빛"
          ],
          [
            "알코올",
            "있음",
            "있음",
            "푸른빛"
          ],
          [
            "나무",
            "있음",
            "있음",
            "붉은빛"
          ]
        ]
      },
      "조건": "교사가 만든 연습 관찰표이다. 불꽃 색을 정확한 온도로 바꾸어 읽는 자료는 아니다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0
    },
    "explanation": "빛 발생과 열 발생 열은 세 연료 모두에 있음으로 표시됐다. 색은 서로 다르고 심지·액체 모양·지속 시간은 공통으로 확인한 항목이 아니다. 공통점은 자료의 모든 대상에 함께 나타난 특징으로 정한다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T02",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set3-questions",
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
      "빛과 열의 발생",
      "세 연료의 같은 불꽃 색",
      "세 연료의 같은 심지 구조",
      "세 연료의 같은 액체 모양",
      "세 연료의 같은 연소 시간"
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "연소의 공통 현상",
      "inquirySkill": "연소 현상의 공통점 비교",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T02",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "3-4",
    "id": "c22-s62-u02-v034",
    "status": "authored",
    "kind": "st",
    "prompt": "장치 안에서 연료를 직접 태우는 사례의 기호를 모두 쓰세요. (정답2개)",
    "givens": {
      "사례": {
        "머리": [
          "기호",
          "장치의 작동"
        ],
        "행": [
          [
            "ㄱ",
            "나무 조각을 태워 건조실을 덥힌다."
          ],
          [
            "ㄴ",
            "태양 집열판으로 물을 데운다."
          ],
          [
            "ㄷ",
            "바이오가스를 태워 물을 데운다."
          ],
          [
            "ㄹ",
            "손잡이를 돌려 발전등을 켠다."
          ]
        ]
      },
      "조건": "장치의 직접 작동만 비교한다. 재료 생산이나 전기 생산의 앞선 과정은 넣지 않는다."
    },
    "responseContract": {
      "kind": "unordered-labels",
      "teacherRequired": false,
      "answers": [
        "ㄱ",
        "ㄷ"
      ]
    },
    "explanation": "ㄱ은 나무 조각, ㄷ은 바이오가스가 타면서 내는 열을 이용한다. ㄴ은 햇빛을, ㄹ은 손잡이를 돌려 만든 전기를 이용한다. 같은 따뜻함이나 빛을 얻어도 직접 작동의 에너지원이 서로 다를 수 있다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T03",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set3-questions",
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
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "연소의 빛과 열 이용",
      "inquirySkill": "장치의 직접 에너지원 분류",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T03",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "unordered-labels",
        "teacherRequired": false,
        "answers": [
          "ㄱ",
          "ㄷ"
        ]
      },
      "type": "short-text",
      "answer": "ㄱ, ㄷ",
      "accepted": [
        "ㄱ, ㄷ"
      ],
      "inputHint": "해당하는 기호를 모두 써요. 순서는 상관없어요."
    }
  },
  {
    "key": "3-5",
    "id": "c22-s62-u02-v035",
    "status": "authored",
    "kind": "st",
    "prompt": "처음 들어 있는 공기의 양이 더 많은 덮개의 기호를 쓰세요.",
    "givens": {
      "기록": {
        "머리": [
          "기호",
          "내부 공기 부피"
        ],
        "행": [
          [
            "ㄱ",
            "700mL"
          ],
          [
            "ㄴ",
            "1000mL"
          ]
        ]
      },
      "조건": "같은 온도·압력·조성의 공기가 들어 있다. 초가 타기 전의 상태만 비교한다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "같은 온도와 압력에서1000mL는700mL보다 공기가 더 많이 들어 있는 상태이다. 따라서 ㄴ이다. 부피가 큰 쪽에 산소 비율까지 더 높다고 바꾸어 말하지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T05",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set3-questions",
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
    "verificationModel": {
      "kind": "maximum-label",
      "values": [
        700,
        1000
      ],
      "labels": [
        "ㄱ",
        "ㄴ"
      ],
      "expected": "ㄴ"
    },
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "덮개 내부 공기량 비교",
      "inquirySkill": "공기 부피와 처음 산소량 비교",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T05",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "3-6",
    "id": "c22-s62-u02-v036",
    "status": "authored",
    "kind": "mc",
    "prompt": "두 덮개의 연습 기록과 비교 조건을 함께 고려한 설명을 고르세요.",
    "givens": {
      "조건": "교사가 제공한 연습 기록이다. 직접 실험한 결과가 아니며, 같은 종류·크기의 초와 비슷한 초기 불꽃, 같은 공기 조성·온도를 사용한다. 덮개 틈으로 바깥 공기가 계속 들어오지 않는 비교이다.",
      "기록": {
        "머리": [
          "덮개",
          "처음 공기 부피",
          "불이 이어진 시간"
        ],
        "행": [
          [
            "가",
            "700mL",
            "16초"
          ],
          [
            "나",
            "1000mL",
            "24초"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3
    },
    "explanation": "같은 공기 조성에서 나의 부피가 더 크므로 처음 산소량이 더 많다. 표에서도 나가24초로 더 오래 이어졌다. 같은 초라는 조건은 공기량 차이를 없애지 않으며, 서로 다른 공기 부피를 같은 비율의 차이로 바꾸지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T05",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set3-questions",
        "set": 3,
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
      "가의 공기는 처음 산소 비율이 더 높았다.",
      "나의 초는 시간이 지나며 길이가 늘었다.",
      "초 크기가 같으므로 시간도 같아야 한다.",
      "나에는 처음 산소의 양이 더 많았다.",
      "두 덮개는 처음 공기량까지 같았다."
    ],
    "verificationModel": {
      "kind": "volume-duration-order",
      "volumes": [
        700,
        1000
      ],
      "durations": [
        16,
        24
      ],
      "longerIndex": 1
    },
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "공기량과 연소 지속 시간",
      "inquirySkill": "공기 부피와 처음 산소량 비교",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T05",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "3-7",
    "id": "c22-s62-u02-v037",
    "status": "authored",
    "kind": "st",
    "prompt": "전후 기록을 근거로 한 설명의 기호를 쓰세요.",
    "givens": {
      "기록": {
        "머리": [
          "시점",
          "산소 비율"
        ],
        "행": [
          [
            "연소 전",
            "20.9%"
          ],
          [
            "불이 꺼진 뒤",
            "16.8%"
          ]
        ]
      },
      "설명": {
        "머리": [
          "기호",
          "해석"
        ],
        "행": [
          [
            "ㄱ",
            "연소하면서 산소가 새로 생겼다."
          ],
          [
            "ㄴ",
            "연소 과정에서 산소가 사용됐다."
          ],
          [
            "ㄷ",
            "연소 전후 산소 비율은 같았다."
          ]
        ]
      },
      "조건": "교사가 제공한 연습 자료이다. 측정 중 외부 기체가 추가되지 않았다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "20.9%에서16.8%로 산소 비율이 낮아졌으므로 산소가 사용됐다는 ㄴ이 자료와 맞는다. 산소가 생겼거나 전후 비율이 같다는 설명과는 맞지 않는다.16.8%가 남아 있으므로 완전히 없어졌다는 뜻은 아니다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T06",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set3-questions",
        "set": 3,
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
    "verificationModel": {
      "kind": "oxygen-fraction-difference",
      "before": 20.9,
      "after": 16.8,
      "difference": 4.1,
      "remainingPositive": true
    },
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "산소 비율 변화의 까닭",
      "inquirySkill": "산소 비율의 전후 자료 해석",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T06",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "3-8",
    "id": "c22-s62-u02-v038",
    "status": "authored",
    "kind": "mc",
    "prompt": "교사가 기체의 성질 카드 두 장을 제시했습니다. 두 카드에 공통으로 해당하는 기체를 고르세요.",
    "givens": {
      "카드": {
        "머리": [
          "카드",
          "내용"
        ],
        "행": [
          [
            "A",
            "공기 중에 들어 있으며 다른 물질이 타는 것을 돕는다."
          ],
          [
            "B",
            "모은 기체에 향을 넣는 교사 시범에서 연소를 도울 수 있다."
          ]
        ]
      },
      "조건": "학생은 성질을 비교하며 기체 발생·점화를 하지 않는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
    },
    "explanation": "다른 물질의 연소를 돕고 모은 기체에서 향이 잘 타게 하는 성질은 산소와 연결된다. 모든 기체가 이 성질을 갖는 것은 아니다. 이 문제에서는 실제 기체 제조나 학생의 점화를 요구하지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T06",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set3-questions",
        "set": 3,
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
      "질소",
      "산소",
      "이산화 탄소",
      "헬륨",
      "수증기"
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "연소를 돕는 기체",
      "inquirySkill": "산소 비율의 전후 자료 해석",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T06",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "3-9",
    "id": "c22-s62-u02-v039",
    "status": "authored",
    "kind": "mc",
    "prompt": "“나중에 불이 붙은 재료에는 열이 전해지지 않았다”는 말을 검토했습니다. 기록에 맞는 판단을 고르세요.",
    "givens": {
      "기록": "교사가 철판 위 두 재료를 같은 거리에서 가열했다. 온도계는 두 재료 쪽에서 모두 처음보다 높은 값을 보였다. 한 재료가 먼저, 다른 재료가 나중에 타기 시작했다.",
      "조건": "각 재료의 정확한 발화점 숫자는 주어지지 않았다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4
    },
    "explanation": "두 온도계가 모두 처음보다 높았다는 기록은 두 재료 쪽에 열이 전달됐다는 근거이다. 나중에 불이 붙었다는 사실만으로 열을 받지 않았다고 할 수 없다. 실제 온도 숫자가 없어 정확한 발화점도 계산할 수 없다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T07",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set3-questions",
        "set": 3,
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
      "나중 재료 쪽의 온도는 처음과 같았다.",
      "먼저 재료의 발화점 숫자를 계산할 수 있다.",
      "두 재료의 온도계 표시는 계속 내려갔다.",
      "두 재료는 불이 붙는 순간까지 차가웠다.",
      "두 재료 쪽 모두 열을 받은 근거가 있다."
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "간접 가열과 발화점 비교",
      "inquirySkill": "가열·타기 시작하는 조건 해석",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T07",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "3-10",
    "id": "c22-s62-u02-v040",
    "status": "authored",
    "kind": "mc",
    "prompt": "온도 조건을 검사한 모형 자료에서 바르게 연결한 설명을 고르세요.",
    "givens": {
      "자료": "같은 연료와 충분한 산소를 준비했다. 처음 낮은 온도에서는 타기 시작하지 않았고, 온도를 높여 정해진 기준에 이르자 타기 시작했다.",
      "조건": "온도만 바꾼 설명 모형이며 실제 점화 활동이 아니다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
    },
    "explanation": "연료와 산소를 같게 둔 상태에서 온도를 높인 뒤에 타기 시작했다. 따라서 온도도 조건에 포함된다. 이 한 연료의 모형을 모든 물질이 같은 온도에서 타기 시작한다는 말로 확대할 수 없다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T07",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set3-questions",
        "set": 3,
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
      "산소가 있으면 어떤 낮은 온도에서도 탄다.",
      "연료가 있으면 온도 변화는 관계가 없다.",
      "타기 시작하려면 온도 조건도 맞아야 한다.",
      "온도를 낮추어 기준에 이른 뒤 시작했다.",
      "모든 물질이 같은 온도에서 시작한다."
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "발화점의 조건",
      "inquirySkill": "가열·타기 시작하는 조건 해석",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T07",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "3-11",
    "id": "c22-s62-u02-v041",
    "status": "authored",
    "kind": "mc",
    "prompt": "초가 계속 탈 수 있는 조건을 모두 갖춘 모형의 기호를 고르세요.",
    "givens": {
      "모형": {
        "머리": [
          "기호",
          "탈 물질",
          "산소 공급",
          "온도"
        ],
        "행": [
          [
            "가",
            "있음",
            "없음",
            "충분함"
          ],
          [
            "나",
            "없음",
            "있음",
            "충분함"
          ],
          [
            "다",
            "있음",
            "있음",
            "충분함"
          ],
          [
            "라",
            "있음",
            "있음",
            "계속 낮게 유지"
          ],
          [
            "마",
            "없음",
            "없음",
            "계속 낮게 유지"
          ]
        ]
      },
      "조건": "일반적인 초의 연소 조건을 단순화한 모형이다. 충분한 온도는 발화점 이상의 조건을 뜻한다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0
    },
    "explanation": "다는 탈 물질·산소 공급·충분한 온도를 함께 갖춘 모형이다. 다른 모형은 하나 이상이 빠져 있다. 세 조건 중 두 가지만 있다고 초의 연소가 계속된다고 판단하지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T08",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set3-questions",
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
      "다",
      "가",
      "나",
      "라",
      "마"
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "연소의 세 조건",
      "inquirySkill": "연소 조건의 조합 판단",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T08",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "id": "c22-s62-u02-v042",
    "status": "authored",
    "kind": "st",
    "prompt": "확인 시험의 연습 기록으로 뒷받침되는 문장을 고르세요. (정답 2개)",
    "givens": {
      "기록": {
        "머리": [
          "같은 시간 관찰한 용기",
          "처음 시험지",
          "나중 시험지"
        ],
        "행": [
          [
            "초를 태우지 않은 비교 용기",
            "푸른색",
            "푸른색"
          ],
          [
            "초를 태운 용기",
            "푸른색",
            "붉은색"
          ]
        ]
      },
      "조건": "교사가 새 푸른 염화 코발트 종이를 사용하고 처음 습기 조건을 맞춘 연습 자료이다."
    },
    "responseContract": {
      "kind": "multi-choice",
      "teacherRequired": false,
      "answers": [
        1,
        2
      ]
    },
    "explanation": "비교 용기는 푸른색을 유지했고 초를 태운 쪽은 붉은색으로 변했다. 푸른 염화 코발트 종이의 물 확인 반응을 근거로 사용할 수 있다. 시험지 자체가 생성됐거나 이 시험이 이산화 탄소만의 시험이라고 말하지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-03"
    ],
    "type": "T10",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set3-questions",
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
    "choices": [
      "시험지 자체가 초에서 만들어졌다.",
      "연소한 쪽에서 시험지의 색이 변했다.",
      "물 확인 반응을 결론의 근거로 쓸 수 있다.",
      "두 용기의 나중 시험지 색이 같았다.",
      "이 시험지는 이산화 탄소만 확인한다."
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "덮개 속 촛불과 시험지 변화",
      "inquirySkill": "물 확인 시험의 관찰과 추론",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E5",
      "type": "T10",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "multi-choice",
        "teacherRequired": false,
        "answers": [
          1,
          2
        ]
      },
      "type": "multi-choice",
      "answers": [
        1,
        2
      ]
    }
  },
  {
    "key": "3-13",
    "id": "c22-s62-u02-v043",
    "status": "authored",
    "kind": "es",
    "prompt": "시험지 기록에서 관찰한 사실과 그 사실로 판단한 물질을 구분하여 설명하세요.",
    "givens": {
      "기록": {
        "머리": [
          "대상",
          "처음",
          "나중"
        ],
        "행": [
          [
            "초를 태운 용기의 새 시험지",
            "푸른색",
            "붉은색"
          ],
          [
            "태우지 않은 비교 용기의 새 시험지",
            "푸른색",
            "푸른색"
          ]
        ]
      },
      "조건": "시험지는 물을 확인하는 푸른 염화 코발트 종이이다. 교사가 처음 습기 조건과 관찰 시간을 맞춘 연습 자료이다."
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "초를 태운 쪽의 시험지가 푸른색에서 붉은색으로 변한 것은 관찰이다. 비교 용기와 달라진 물 확인 반응을 근거로 초의 연소 뒤 물이 생겼다고 판단한다.",
      "required": [
        "연소한 쪽의 전후 시험지 색 변화를 쓴다.",
        "비교 용기의 결과를 함께 사용한다.",
        "물 확인 반응을 근거로 물 생성이라는 판단을 구분한다."
      ],
      "exactStringScoring": false
    },
    "explanation": "색이 푸른색에서 붉은색으로 변한 것은 눈으로 읽은 관찰이다. 같은 조건의 비교 용기에서는 변하지 않았다. 물 확인 시험의 성질을 적용해 초의 연소 뒤 물이 생겼다고 판단하며, 관찰과 물질 이름의 추론을 나누어 쓴다.",
    "scope": "core",
    "standards": [
      "6과14-03"
    ],
    "type": "T10",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set3-questions",
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
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "시험지 변화에서 물 생성 추론",
      "inquirySkill": "물 확인 시험의 관찰과 추론",
      "itemType": "es",
      "track": "교과",
      "level": "기본",
      "element": "E5",
      "type": "T10",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "초를 태운 쪽의 시험지가 푸른색에서 붉은색으로 변한 것은 관찰이다. 비교 용기와 달라진 물 확인 반응을 근거로 초의 연소 뒤 물이 생겼다고 판단한다.",
        "required": [
          "연소한 쪽의 전후 시험지 색 변화를 쓴다.",
          "비교 용기의 결과를 함께 사용한다.",
          "물 확인 반응을 근거로 물 생성이라는 판단을 구분한다."
        ],
        "exactStringScoring": false
      },
      "type": "written-explanation",
      "sample": "초를 태운 쪽의 시험지가 푸른색에서 붉은색으로 변한 것은 관찰이다. 비교 용기와 달라진 물 확인 반응을 근거로 초의 연소 뒤 물이 생겼다고 판단한다.",
      "rubric": {
        "required": [
          "연소한 쪽의 전후 시험지 색 변화를 쓴다.",
          "비교 용기의 결과를 함께 사용한다.",
          "물 확인 반응을 근거로 물 생성이라는 판단을 구분한다."
        ],
        "pass": "자료와 조건을 연결한 설명을 선생님이 확인해요."
      }
    }
  },
  {
    "key": "3-14",
    "id": "c22-s62-u02-v044",
    "status": "authored",
    "kind": "mc",
    "prompt": "이 시험 기록으로 확인할 수 있는 기체를 고르세요.",
    "givens": {
      "기록": "교사가 새 석회수에 비교 용기의 공기와 초를 태운 용기의 기체를 같은 방법·시간으로 접촉시켰다. 초를 태운 용기의 기체에서 석회수가 뿌옇게 변했다.",
      "조건": "학생이 기체를 입으로 불어 넣는 활동은 하지 않는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3
    },
    "explanation": "석회수를 흐리게 하는 확인 반응을 이용했으므로 이산화 탄소를 판단할 수 있다. 비교 용기와 같은 시간·방법으로 시험했다는 조건도 함께 읽는다. 이 결과를 산소나 물 확인 시험의 결과로 바꾸지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-03"
    ],
    "type": "T11",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set3-questions",
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
      "산소",
      "헬륨",
      "질소",
      "이산화 탄소",
      "수소"
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "석회수 반응 기체",
      "inquirySkill": "이산화 탄소 확인의 근거 연결",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E6",
      "type": "T11",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-03"
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
    "key": "3-15",
    "id": "c22-s62-u02-v045",
    "status": "authored",
    "kind": "mc",
    "prompt": "이 자료로 확인한 결론의 범위를 바르게 쓴 문장을 고르세요.",
    "givens": {
      "기록": {
        "머리": [
          "연료",
          "연소 뒤 물 확인",
          "연소 뒤 이산화 탄소 확인"
        ],
        "행": [
          [
            "초",
            "확인됨",
            "확인됨"
          ],
          [
            "알코올",
            "확인됨",
            "확인됨"
          ]
        ]
      },
      "조건": "두 연료에서 같은 확인 시험과 비교 대조를 사용한 교사 연습 자료이다. 밝기·소모 속도·발화점 숫자는 측정하지 않았다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
    },
    "explanation": "표에서는 초와 알코올 모두 물과 이산화 탄소를 확인했다. 그러므로 이 두 연료에서 같은 종류의 생성물을 확인했다는 결론이 맞다. 발화점·소모 속도·밝기·시간은 측정하지 않았으며 모든 물질의 연소로 범위를 넓히지도 않는다.",
    "scope": "core",
    "standards": [
      "6과14-03"
    ],
    "type": "T12",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set3-questions",
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
    "choices": [
      "두 연료가 타기 시작하는 온도까지 같다.",
      "두 연료에서 같은 종류의 생성물을 확인했다.",
      "두 연료의 단위 시간당 소모량도 같다.",
      "두 연료의 불꽃 밝기가 같은 값으로 측정됐다.",
      "두 연료가 타는 시간이 정확히 같았다."
    ],
    "repair": "원문의 물질 일반 표현을 두 연료의 명시적 비교 자료로 제한함",
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "연소 전후 성질 변화",
      "inquirySkill": "연소 전후 성질·결론 범위 비교",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E6",
      "type": "T12",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-03"
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
    "key": "3-16",
    "id": "c22-s62-u02-v046",
    "status": "authored",
    "kind": "es",
    "prompt": "두 경우 모두 불이 꺼졌다는 기록만으로 같은 원인이라고 결론 내려도 될까요? 근거와 더 필요한 비교를 쓰세요.",
    "givens": {
      "기록": {
        "머리": [
          "경우",
          "바꾼 조건",
          "관찰"
        ],
        "행": [
          [
            "A",
            "교사가 공기 흐름을 강하게 함",
            "불이 꺼짐"
          ],
          [
            "B",
            "교사가 심지의 연료 이동 통로를 집음",
            "불이 꺼짐"
          ]
        ]
      },
      "조건": "열과 연료 기체 흐름을 따로 측정하지 않은 설명용 기록이다. 학생이 불을 불거나 심지를 집는 실습은 아니다."
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "결과가 같다고 같은 원인이라고 할 수 없다. 바꾼 조건이 다르고 열과 연료의 이동을 따로 확인하지 않았기 때문이다. 한 작용을 고정한 비교 자료가 더 필요하다.",
      "required": [
        "두 경우의 결과는 같지만 바꾼 조건이 다름을 쓴다.",
        "같은 결과만으로 원인이 같다고 확정하지 않는다.",
        "열 또는 연료 이동 등을 분리해 볼 추가 비교를 제안한다."
      ],
      "exactStringScoring": false
    },
    "explanation": "A에서는 공기 흐름을, B에서는 심지 통로를 바꿨다. 두 결과가 같아도 실제로 어떤 작용이 얼마나 달라졌는지는 이 기록에 없다. 따라서 한 원인으로 같다고 강제하지 않고 열·연료 이동 등 다른 작용을 통제하거나 확인한 추가 자료를 요청한다.",
    "scope": "support",
    "standards": [
      "6과14-02"
    ],
    "type": "T13",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set3-questions",
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
    "repair": "단일 소화 기작 선택을 근거의 한계에 관한 교사 확인 서술로 바꿈",
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "불어 끄기와 심지 집기 비교",
      "inquirySkill": "소화 모형의 작용·해석 한계 구별",
      "itemType": "es",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T13",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "결과가 같다고 같은 원인이라고 할 수 없다. 바꾼 조건이 다르고 열과 연료의 이동을 따로 확인하지 않았기 때문이다. 한 작용을 고정한 비교 자료가 더 필요하다.",
        "required": [
          "두 경우의 결과는 같지만 바꾼 조건이 다름을 쓴다.",
          "같은 결과만으로 원인이 같다고 확정하지 않는다.",
          "열 또는 연료 이동 등을 분리해 볼 추가 비교를 제안한다."
        ],
        "exactStringScoring": false
      },
      "type": "written-explanation",
      "sample": "결과가 같다고 같은 원인이라고 할 수 없다. 바꾼 조건이 다르고 열과 연료의 이동을 따로 확인하지 않았기 때문이다. 한 작용을 고정한 비교 자료가 더 필요하다.",
      "rubric": {
        "required": [
          "두 경우의 결과는 같지만 바꾼 조건이 다름을 쓴다.",
          "같은 결과만으로 원인이 같다고 확정하지 않는다.",
          "열 또는 연료 이동 등을 분리해 볼 추가 비교를 제안한다."
        ],
        "pass": "자료와 조건을 연결한 설명을 선생님이 확인해요."
      }
    }
  },
  {
    "key": "3-17",
    "id": "c22-s62-u02-v047",
    "status": "authored",
    "kind": "st",
    "prompt": "온도 조건만을 바꾸는 소화 모형의 기호를 쓰세요.",
    "givens": {
      "모형": {
        "머리": [
          "기호",
          "바꾸는 조건"
        ],
        "행": [
          [
            "ㄱ",
            "연료 공급을 멈춤"
          ],
          [
            "ㄴ",
            "바깥 공기 공급을 제한함"
          ],
          [
            "ㄷ",
            "연소를 유지하기 어려울 만큼 열을 빼앗음"
          ]
        ]
      },
      "조건": "세 작용을 분리한 설명 모형이며 실제 화재에서 사용할 물질을 고르는 문제가 아니다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "ㄷ은 열을 빼앗아 온도를 낮추는 작용으로 분리한 모형이다. ㄱ은 연료, ㄴ은 산소 공급에 관한 모형이다. 실제 화재의 여러 작용이나 물 사용 가능 여부를 이 분류표 하나로 정하지 않는다.",
    "scope": "support",
    "standards": [
      "6과14-02"
    ],
    "type": "T13",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set3-questions",
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
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "소화와 온도 조건",
      "inquirySkill": "소화 모형의 작용·해석 한계 구별",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T13",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "3-18",
    "id": "c22-s62-u02-v048",
    "status": "authored",
    "kind": "mc",
    "prompt": "안전교육용 모형 카드에서 다음에 놓을 내용을 고르세요.",
    "givens": {
      "현재": "담당 교사가 정한 순서는 “피난로 확인→안전핀 해제→호스 방향 준비→손잡이 조작”이다. 앞의 두 카드를 놓았다.",
      "조건": "불과 약제가 없는 모형을 읽는 활동이다. 학생이 실제 화재를 진화하는 과제가 아니다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4
    },
    "explanation": "제시한 순서에서 앞의 두 단계 뒤에는 호스 방향 준비가 온다. 방향을 준비하기 전 손잡이 조작으로 건너뛰는 것은 이 카드 순서와 맞지 않는다. 모형의 배열을 실제 학생 진화 수행으로 기록하지 않는다.",
    "scope": "support",
    "standards": [
      "6과14-02"
    ],
    "type": "T14",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set3-questions",
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
      "손잡이를 먼저 누르는 카드를 놓는다.",
      "안전핀을 다시 끼우는 카드를 놓는다.",
      "피난로 확인을 생략하는 카드를 놓는다.",
      "호스 준비 없이 기구를 돌리는 카드를 놓는다.",
      "호스가 향할 방향을 준비한다."
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "소화기 사용 순서",
      "inquirySkill": "안전 자료의 조건과 순서 판단",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T14",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "3-19",
    "id": "c22-s62-u02-v049",
    "status": "authored",
    "kind": "mc",
    "prompt": "상황B에서 안내 취지에 맞는 계획을 고르세요.",
    "givens": {
      "상황": {
        "머리": [
          "상황",
          "설명"
        ],
        "행": [
          [
            "A",
            "자기 집에 화염이 있고 안전한 계단 경로가 확보됨"
          ],
          [
            "B",
            "다른 집에 불이 났지만 자기 집 안으로 화염·연기가 들어오지 않음"
          ]
        ]
      },
      "안내": "아파트의 상황별 피난 안내를 읽는다. 다른 곳에 불이 났다는 이유만으로 연기 있는 경로에 들어가지 않고, 현재 상황을119에 알리며 안내를 따른다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
    },
    "explanation": "B는 자기 집으로 화염·연기가 들어오지 않는 상황이다. 안내의 취지에 따라 현재 상황을 알리고 안내를 따르는 계획이 맞는다. 무조건 높은 곳으로 가거나 연기 있는 경로·엘리베이터로 이동하는 계획을 같은 상황의 정답으로 강제하지 않는다.",
    "scope": "support",
    "standards": [
      "6과14-02"
    ],
    "type": "T14",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set3-questions",
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
    "choices": [
      "다른 곳의 불이므로 신고하지 않고 기다린다.",
      "불이 난 위치와 관계없이 높은 층으로 간다.",
      "집 안의 상황을 살피며119 안내를 따른다.",
      "엘리베이터를 타고 다른 층으로 옮긴다.",
      "상황 확인 없이 연기 있는 복도를 지나간다."
    ],
    "repair": "무조건 높은 곳 대피 표현을 화염·연기 유입 조건이 있는 자료 판단으로 바꿈",
    "referenceIds": [
      "nfa-evacuation-2024",
      "nfa-evacuation-2025"
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "화재 대피 행동",
      "inquirySkill": "안전 자료의 조건과 순서 판단",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T14",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "3-20",
    "id": "c22-s62-u02-v050",
    "status": "authored",
    "kind": "mc",
    "prompt": "피난 통로 점검표에서 개선이 필요한 항목을 고르세요.",
    "givens": {
      "점검": "평소 학교의 피난 통로를 살펴보는 가상 사례이다. 시설을 학생이 분해하거나 실제 연기를 만드는 활동은 없다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0
    },
    "explanation": "계단 문 앞을 상자로 막으면 피난할 때 이동을 방해할 수 있다. 따라서 개선해야 할 항목이다. 평소 위치와 통로·시설을 확인하는 것은 실제 화재의 상황별 판단을 준비하는 일이며 직접 진화를 강요하는 일이 아니다.",
    "scope": "support",
    "standards": [
      "6과14-02"
    ],
    "type": "T14",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set3-questions",
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
      "계단 문 앞을 보관 상자로 막아 두었다.",
      "안내 표지가 보이는지 확인해 두었다.",
      "기구 점검일을 담당자가 확인했다.",
      "피난 통로의 물건을 치워 두었다.",
      "비상구 위치를 안내도에서 살펴봤다."
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "대피 통로의 확보",
      "inquirySkill": "안전 자료의 조건과 순서 판단",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T14",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "4-1",
    "id": "c22-s62-u02-v051",
    "status": "authored",
    "kind": "mc",
    "prompt": "두 측정 기록과 맞지 않는 문장을 고르세요.",
    "givens": {
      "기록": {
        "머리": [
          "관찰 항목",
          "기록"
        ],
        "행": [
          [
            "초 길이",
            "처음보다 짧아짐"
          ],
          [
            "촛농",
            "흘러나온 뒤 식으면 굳음"
          ],
          [
            "불꽃 밖 온도계",
            "위쪽42℃, 옆쪽30℃"
          ]
        ]
      },
      "조건": "교사가 만든 연습 기록이다. 불꽃 내부 온도나 아래쪽 온도는 측정하지 않았다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3
    },
    "explanation": "아래쪽은 측정하지 않았으므로 이 기록만으로 그 온도를 확정할 수 없다. 위쪽42℃와 옆쪽30℃는 불꽃 밖 두 위치의 값이다. 이를 불꽃 내부 부위나 관측하지 않은 위치의 값으로 확대하지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T01",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set4-questions",
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
    "choices": [
      "초 길이는 처음보다 짧아졌다.",
      "식은 촛농은 다시 굳었다.",
      "위쪽 표시는 옆쪽보다 높았다.",
      "아래쪽 온도까지 확인했다.",
      "불꽃 내부의 정확한 온도는 알 수 없다."
    ],
    "verificationModel": {
      "kind": "measured-temperature-difference",
      "upper": 42,
      "side": 30,
      "difference": 12
    },
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "촛불의 관찰",
      "inquirySkill": "관찰과 추론 구별",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T01",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "4-2",
    "id": "c22-s62-u02-v052",
    "status": "authored",
    "kind": "mc",
    "prompt": "두 연료의 시범 기록을 정리할 때, 공통 관찰에 넣지 말아야 할 문장을 고르세요.",
    "givens": {
      "기록": "두 연료 모두 빛과 열을 냈다. 초는 점차 짧아졌고 액체 연료는 남은 부피가 줄었다.",
      "조건": "남은 연료를 비교한 교사 연습 기록이며, 생성 기체까지 모두 모아 무게를 잰 것은 아니다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
    },
    "explanation": "기록에는 초의 길이와 액체 연료의 남은 부피가 모두 줄었다고 했다. 남은 양이 언제나 같다는 문장은 맞지 않는다. 열린 장치의 남은 연료와 생성물을 포함한 전체 물질을 구별하여 읽는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T02",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set4-questions",
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
    "choices": [
      "두 연료에서 주변을 밝히는 빛이 났다.",
      "연소 중 남은 연료의 양은 언제나 같다.",
      "두 연료에서 주변으로 열이 전달됐다.",
      "초는 연소하며 남은 길이가 달라졌다.",
      "액체 연료는 연소하며 남은 양이 달라졌다."
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "연소의 공통 현상",
      "inquirySkill": "연소 현상의 공통점 비교",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T02",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "4-3",
    "id": "c22-s62-u02-v053",
    "status": "authored",
    "kind": "mc",
    "prompt": "직접 작동 방식으로 분류할 때 다른 네 장치와 구별되는 것을 고르세요.",
    "givens": {
      "조건": "각 장치가 켜져 있는 동안 장치 안에서 연료를 직접 태우는지 비교한다. 전기 생산의 앞선 과정은 포함하지 않는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4
    },
    "explanation": "축전지 야영등은 장치 안에서 연료를 직접 연소시키는 나머지 사례와 다르다. 같은 빛이나 열을 얻는다는 사실만으로 직접 작동 방식이 같다고 분류하지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T03",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set4-questions",
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
      "알코올을 태우는 시범 기구",
      "장작을 태우는 난방 기구",
      "바이오가스를 태우는 보일러",
      "숯을 태우는 조리 화로",
      "축전지로 켜는 야영등"
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "연소와 전기 이용 구별",
      "inquirySkill": "장치의 직접 에너지원 분류",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T03",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "4-4",
    "id": "c22-s62-u02-v054",
    "status": "authored",
    "kind": "st",
    "prompt": "덮개의 처음 상태와 연습 기록에서 알 수 있는 내용을 고르세요. (정답 2개)",
    "givens": {
      "조건": "교사가 제공한 연습 기록이다. 직접 실험한 결과가 아니며, 같은 종류·크기의 초와 비슷한 초기 불꽃, 같은 공기 조성·온도를 사용한다. 덮개 틈으로 바깥 공기가 계속 들어오지 않는 비교이다.",
      "기록": {
        "머리": [
          "덮개",
          "처음 공기 부피",
          "불이 이어진 시간"
        ],
        "행": [
          [
            "P",
            "900mL",
            "21초"
          ],
          [
            "Q",
            "1800mL",
            "41초"
          ]
        ]
      }
    },
    "responseContract": {
      "kind": "multi-choice",
      "teacherRequired": false,
      "answers": [
        0,
        4
      ]
    },
    "explanation": "같은 공기 조성에서 Q의 부피가 크므로 처음 산소량도 많다. 지속 시간도41초로21초보다 길다. 산소 비율의 차이나 초의 길이 증가를 이 결과에서 만들어 내지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T05",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set4-questions",
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
      "Q의 기록된 지속 시간이 더 길다.",
      "P의 처음 산소 비율은 더 높다.",
      "P와Q는 처음 공기 부피도 같다.",
      "Q의 초는 연소 중 길이가 늘어난다.",
      "Q에는 처음 산소의 양이 더 많다."
    ],
    "verificationModel": {
      "kind": "volume-duration-order",
      "volumes": [
        900,
        1800
      ],
      "durations": [
        21,
        41
      ],
      "longerIndex": 1
    },
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "덮개 공기량과 연소 시간",
      "inquirySkill": "공기 부피와 처음 산소량 비교",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T05",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "multi-choice",
        "teacherRequired": false,
        "answers": [
          0,
          4
        ]
      },
      "type": "multi-choice",
      "answers": [
        0,
        4
      ]
    }
  },
  {
    "key": "4-5",
    "id": "c22-s62-u02-v055",
    "status": "authored",
    "kind": "mc",
    "prompt": "산소 비율이 달라진 기록을 설명한 문장으로 알맞은 것을 고르세요.",
    "givens": {
      "기록": {
        "머리": [
          "시점",
          "센서 표시"
        ],
        "행": [
          [
            "연소 전",
            "20.7%"
          ],
          [
            "불이 꺼진 뒤",
            "17.2%"
          ]
        ]
      },
      "조건": "교사가 만든 연습 자료이다. 측정 중 외부 기체를 추가하지 않았다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 2
    },
    "explanation": "20.7%에서17.2%로 산소 비율이 줄었다. 이 변화는 연소 중 산소가 사용됐다는 설명과 맞는다.17.2%는0%가 아니므로 산소가 전부 없어진 뒤에만 불이 꺼진다는 말은 맞지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T06",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set4-questions",
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
      "연소 뒤 산소가 전혀 남아 있지 않다.",
      "연소할 때 산소 비율은 높아졌다.",
      "연소에 산소가 사용된 근거가 있다.",
      "센서 표시가 전후에 같은 값이다.",
      "초는 산소와 관계없이 계속 탈 수 있다."
    ],
    "verificationModel": {
      "kind": "oxygen-fraction-difference",
      "before": 20.7,
      "after": 17.2,
      "difference": 3.5,
      "remainingPositive": true
    },
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "산소 비율 감소 이유",
      "inquirySkill": "산소 비율의 전후 자료 해석",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T06",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "4-6",
    "id": "c22-s62-u02-v056",
    "status": "authored",
    "kind": "st",
    "prompt": "설명에서 말하는 기준 온도의 이름을 쓰세요.",
    "givens": {
      "설명": "재료X를 직접 불꽃에 닿지 않게 가열했다. 어느 정도 온도가 높아졌을 때 타기 시작할 수 있었다. 이 기준 온도의 이름을 찾는다.",
      "조건": "재료X의 구체적인 온도 숫자는 제공하지 않는다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "발화점"
      ]
    },
    "explanation": "직접 불꽃이 닿지 않아도 물질이 타기 시작할 수 있는 기준 온도는 발화점이다. X의 수치가 없으므로 임의 온도를 붙이지 않으며, 다른 재료의 발화점도 같은 숫자라고 하지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T07",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set4-questions",
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
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "발화점의 뜻",
      "inquirySkill": "가열·타기 시작하는 조건 해석",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T07",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "발화점"
        ]
      },
      "type": "short-text",
      "answer": "발화점",
      "accepted": [
        "발화점"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "4-7",
    "id": "c22-s62-u02-v057",
    "status": "authored",
    "kind": "st",
    "prompt": "보기의 “이상·미만” 중에서 골라 문장을 완성하세요. 온도 조건은 발화점 (     )입니다.",
    "givens": {
      "조건": "일반적인 연소 모형에서 탈 물질과 산소가 준비되어 있고, 타기 시작하는 온도 조건을 묻는다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "이상"
      ]
    },
    "explanation": "연소가 시작되려면 탈 물질과 산소뿐 아니라 온도도 발화점 이상이어야 한다. 미만은 그 기준에 못 미친다는 뜻이므로 반대이다. 이 모형을 연료·산소가 없어도 온도만으로 탄다는 주장으로 바꾸지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T08",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set4-questions",
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
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "연소의 온도 조건",
      "inquirySkill": "연소 조건의 조합 판단",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T08",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "이상"
        ]
      },
      "type": "short-text",
      "answer": "이상",
      "accepted": [
        "이상"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "4-8",
    "id": "c22-s62-u02-v058",
    "status": "authored",
    "kind": "st",
    "prompt": "세 카드 중 초의 연소를 나타낸 카드의 기호를 쓰세요.",
    "givens": {
      "카드": {
        "머리": [
          "기호",
          "내용"
        ],
        "행": [
          [
            "ㄱ",
            "굳은 촛농이 가열되어 액체가 됨"
          ],
          [
            "ㄴ",
            "초가 산소와 빠르게 반응하며 빛과 열을 냄"
          ],
          [
            "ㄷ",
            "녹은 촛농이 식어 다시 굳음"
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
    "explanation": "ㄴ은 산소와 빠르게 반응하며 빛과 열을 내는 연소이다. ㄱ과 ㄷ은 촛농이 녹거나 굳는 변화이므로 초가 타는 변화와 구별한다. 겉모양이 달라졌다는 사실만으로 세 카드를 같은 변화라고 묶지 않는다.",
    "scope": "core",
    "standards": [
      "6과14-02"
    ],
    "type": "T09",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set4-questions",
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
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "연소의 뜻",
      "inquirySkill": "연소와 다른 변화 구별",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E3",
      "type": "T09",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "4-9",
    "id": "c22-s62-u02-v059",
    "status": "authored",
    "kind": "mc",
    "prompt": "교사의 두 확인 시험 가운데 물을 확인하는 시험을 고르세요.",
    "givens": {
      "조건": "시약의 이름과 반응을 바르게 짝짓는 문제이며 학생이 시약을 직접 다루지 않는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 0
    },
    "explanation": "물 확인에는 푸른 염화 코발트 종이의 색 변화를 이용할 수 있다. 석회수는 이산화 탄소 확인의 근거이고, 길이·밝기·덮개 크기만으로 물의 생성을 확인한 것은 아니다.",
    "scope": "core",
    "standards": [
      "6과14-03"
    ],
    "type": "T10",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set4-questions",
        "set": 4,
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
      "푸른 염화 코발트 종이의 색 변화를 본다.",
      "새 석회수가 흐려지는 반응만 본다.",
      "연료의 남은 길이를 자로 재기만 한다.",
      "불꽃의 밝기를 눈으로 비교하기만 한다.",
      "덮개 크기를 눈금자로 비교하기만 한다."
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "물을 확인하는 시험지",
      "inquirySkill": "물 확인 시험의 관찰과 추론",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E5",
      "type": "T10",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-03"
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
    "key": "4-10",
    "id": "c22-s62-u02-v060",
    "status": "authored",
    "kind": "es",
    "prompt": "비교표를 읽고, 연소 뒤 기체와 석회수에서 관찰한 변화를 정확하게 쓰세요.",
    "givens": {
      "기록": {
        "머리": [
          "시험",
          "넣기 전 석회수",
          "같은 시간 뒤"
        ],
        "행": [
          [
            "연소하지 않은 비교 용기 공기",
            "맑음",
            "맑음"
          ],
          [
            "초를 태운 용기의 기체",
            "맑음",
            "뿌옇게 변함"
          ]
        ]
      },
      "조건": "교사가 새 석회수와 같은 접촉 시간을 사용한 연습 기록이다."
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "초를 태운 용기의 기체와 접촉한 석회수가 맑은 상태에서 뿌옇게 변했다.",
      "required": [
        "초를 태운 용기의 기체를 대상으로 쓴다.",
        "석회수의 맑음→흐림 변화나 같은 뜻의 관찰을 쓴다.",
        "다른 시험지 색 변화나 물 생성이라는 답으로 바꾸지 않는다."
      ],
      "exactStringScoring": false
    },
    "explanation": "비교표의 둘째 줄에서 석회수는 맑은 상태에서 뿌옇게 변했다. 이것이 직접 읽은 관찰이다. 그 반응을 이산화 탄소 확인 근거로 쓸 수 있지만 이 질문은 우선 관찰한 변화를 정확히 쓰게 한다.",
    "scope": "core",
    "standards": [
      "6과14-03"
    ],
    "type": "T11",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set4-questions",
        "set": 4,
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
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "연소 뒤 석회수 관찰",
      "inquirySkill": "이산화 탄소 확인의 근거 연결",
      "itemType": "es",
      "track": "교과",
      "level": "기본",
      "element": "E6",
      "type": "T11",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-03"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "초를 태운 용기의 기체와 접촉한 석회수가 맑은 상태에서 뿌옇게 변했다.",
        "required": [
          "초를 태운 용기의 기체를 대상으로 쓴다.",
          "석회수의 맑음→흐림 변화나 같은 뜻의 관찰을 쓴다.",
          "다른 시험지 색 변화나 물 생성이라는 답으로 바꾸지 않는다."
        ],
        "exactStringScoring": false
      },
      "type": "written-explanation",
      "sample": "초를 태운 용기의 기체와 접촉한 석회수가 맑은 상태에서 뿌옇게 변했다.",
      "rubric": {
        "required": [
          "초를 태운 용기의 기체를 대상으로 쓴다.",
          "석회수의 맑음→흐림 변화나 같은 뜻의 관찰을 쓴다.",
          "다른 시험지 색 변화나 물 생성이라는 답으로 바꾸지 않는다."
        ],
        "pass": "자료와 조건을 연결한 설명을 선생님이 확인해요."
      }
    }
  },
  {
    "key": "4-11",
    "id": "c22-s62-u02-v061",
    "status": "authored",
    "kind": "es",
    "prompt": "“바람을 보냈더니 꺼졌으니 산소가 없어진 것”이라는 해석을 검토하세요. 기록으로 알 수 있는 점과 아직 알 수 없는 점을 나누어 쓰세요.",
    "givens": {
      "기록": "교사가 촛불 쪽 공기 흐름을 바꾸자 불이 꺼졌다. 산소 비율·불꽃 주변 온도·연료 기체의 이동은 따로 측정하지 않았다.",
      "조건": "관찰과 해석을 비교하는 연습 기록이며 학생이 촛불에 바람을 부는 활동이 아니다."
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "알 수 있는 것은 공기 흐름을 바꾼 뒤 꺼졌다는 사실이다. 산소가 없어졌는지는 측정하지 않아 알 수 없다. 온도와 연료 이동 등 다른 조건도 더 확인해야 한다.",
      "required": [
        "공기 흐름 변화와 소화라는 관찰을 쓴다.",
        "산소가 없어졌다고 확정할 근거가 없음을 지적한다.",
        "온도·연료 이동 등 추가 확인할 조건을 제안한다."
      ],
      "exactStringScoring": false
    },
    "explanation": "기록에는 불이 꺼진 결과만 있고 산소 비율의 측정이 없다. 그러므로 산소가 없어졌다고 결론 내릴 수 없다. 같은 결과를 한 원인으로 고정하기 전에 열·연료 이동 등 달라질 수 있는 조건을 분리한 자료가 필요하다.",
    "scope": "support",
    "standards": [
      "6과14-02"
    ],
    "type": "T13",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set4-questions",
        "set": 4,
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
    "repair": "불어 끄기를 한 원인의 자동 정답으로 삼지 않고 관찰/추론 구별로 바꿈",
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "불어 끄기의 까닭",
      "inquirySkill": "소화 모형의 작용·해석 한계 구별",
      "itemType": "es",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T13",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "알 수 있는 것은 공기 흐름을 바꾼 뒤 꺼졌다는 사실이다. 산소가 없어졌는지는 측정하지 않아 알 수 없다. 온도와 연료 이동 등 다른 조건도 더 확인해야 한다.",
        "required": [
          "공기 흐름 변화와 소화라는 관찰을 쓴다.",
          "산소가 없어졌다고 확정할 근거가 없음을 지적한다.",
          "온도·연료 이동 등 추가 확인할 조건을 제안한다."
        ],
        "exactStringScoring": false
      },
      "type": "written-explanation",
      "sample": "알 수 있는 것은 공기 흐름을 바꾼 뒤 꺼졌다는 사실이다. 산소가 없어졌는지는 측정하지 않아 알 수 없다. 온도와 연료 이동 등 다른 조건도 더 확인해야 한다.",
      "rubric": {
        "required": [
          "공기 흐름 변화와 소화라는 관찰을 쓴다.",
          "산소가 없어졌다고 확정할 근거가 없음을 지적한다.",
          "온도·연료 이동 등 추가 확인할 조건을 제안한다."
        ],
        "pass": "자료와 조건을 연결한 설명을 선생님이 확인해요."
      }
    }
  },
  {
    "key": "4-12",
    "id": "c22-s62-u02-v062",
    "status": "authored",
    "kind": "st",
    "prompt": "외부 공기 유입을 제한하는 작용으로 분류할 카드를 고르세요. (정답 2개)",
    "givens": {
      "카드": "ㄱ은 연료 공급관의 공급을 멈추는 모형, ㄴ은 덮개의 틈을 닫는 모형, ㄷ은 외부 공기가 들어오는 입구를 막는 모형, ㄹ은 연료 조각을 꺼내는 모형, ㅁ은 온도만 낮추는 모형이다.",
      "조건": "실제 화재에 물이나 천을 사용하는 실습이 아니라 작용을 나눈 카드 분류이다."
    },
    "responseContract": {
      "kind": "multi-choice",
      "teacherRequired": false,
      "answers": [
        2,
        3
      ]
    },
    "explanation": "ㄴ과 ㄷ은 바깥 공기가 들어오는 통로를 제한한다. ㄱ과 ㄹ은 탈 물질, ㅁ은 온도 조건을 바꾸는 것으로 분리했다. 실제 소화 방법은 여러 작용이 함께 있을 수 있으므로 이 모형을 모든 현장에 그대로 대입하지 않는다.",
    "scope": "support",
    "standards": [
      "6과14-02"
    ],
    "type": "T13",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set4-questions",
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
      "ㄹ 카드",
      "ㅁ 카드",
      "ㄴ 카드",
      "ㄷ 카드",
      "ㄱ 카드"
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "산소 공급 차단의 사례",
      "inquirySkill": "소화 모형의 작용·해석 한계 구별",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T13",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "multi-choice",
        "teacherRequired": false,
        "answers": [
          2,
          3
        ]
      },
      "type": "multi-choice",
      "answers": [
        2,
        3
      ]
    }
  },
  {
    "key": "4-13",
    "id": "c22-s62-u02-v063",
    "status": "authored",
    "kind": "st",
    "prompt": "이 모형이 나타내는 현상의 이름을 쓰세요.",
    "givens": {
      "모형": "타고 있던 연료에 필요한 조건을 하나 이상 충족하지 못하게 하자 연소가 그쳤다. 어떤 조건을 바꿨는지는 별도로 분류한다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "소화"
      ]
    },
    "explanation": "필요한 조건을 하나 이상 없애 연소를 그치게 하는 것을 소화라고 한다. 연소가 멈췄다는 말과 어떤 조건이 바뀌었는지에 대한 설명은 서로 다른 단계이므로 나누어 읽는다.",
    "scope": "support",
    "standards": [
      "6과14-02"
    ],
    "type": "T13",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set4-questions",
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
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "소화의 뜻",
      "inquirySkill": "소화 모형의 작용·해석 한계 구별",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T13",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "short-text",
        "teacherRequired": false,
        "accepted": [
          "소화"
        ]
      },
      "type": "short-text",
      "answer": "소화",
      "accepted": [
        "소화"
      ],
      "inputHint": ""
    }
  },
  {
    "key": "4-14",
    "id": "c22-s62-u02-v064",
    "status": "authored",
    "kind": "mc",
    "prompt": "온도를 낮추는 작용만으로 표현한 설명 모형을 고르세요.",
    "givens": {
      "조건": "실제 화재에서 쓸 물질을 고르는 문제가 아니다. 탈 물질과 산소 공급은 그대로라고 정한 세 조건 모형이다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 3
    },
    "explanation": "이 문제는 연료와 산소를 그대로 둔 설명 모형에서 온도만 바꾸는 경우를 묻는다. 열을 빼앗아 연소 유지에 필요한 온도보다 낮추는 것이 맞다. 이를 모든 실제 화재에 물을 쓰라는 지시로 확대하지 않는다.",
    "scope": "support",
    "standards": [
      "6과14-02"
    ],
    "type": "T13",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set4-questions",
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
      "연료의 이동 통로만 막는다.",
      "외부 공기가 들어오는 틈만 막는다.",
      "탈 물질을 다른 곳으로 꺼낸다.",
      "열을 빼앗아 온도를 낮춘다.",
      "산소 공급량을 더 늘려 준다."
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "온도를 낮추는 소화",
      "inquirySkill": "소화 모형의 작용·해석 한계 구별",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T13",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "4-15",
    "id": "c22-s62-u02-v065",
    "status": "authored",
    "kind": "st",
    "prompt": "두 설명 모형이 주로 바꾸는 조건을 보기 “산소 공급·온도”에서 골라 ㉠·㉡ 순서로 쓰세요.",
    "givens": {
      "모형": {
        "머리": [
          "칸",
          "설명"
        ],
        "행": [
          [
            "㉠",
            "탈 물질은 그대로 두고 외부 공기의 유입 통로를 제한함"
          ],
          [
            "㉡",
            "탈 물질과 공기 유입은 그대로 두고 열을 빼앗음"
          ]
        ]
      },
      "조건": "작용을 분리한 설명 모형이며 실제 소화 실습이 아니다."
    },
    "responseContract": {
      "kind": "ordered-term-parts",
      "teacherRequired": false,
      "parts": [
        {
          "kind": "short-text",
          "accepted": [
            "산소 공급",
            "산소",
            "공기 공급"
          ]
        },
        {
          "kind": "short-text",
          "accepted": [
            "온도"
          ]
        }
      ]
    },
    "explanation": "㉠은 공기 유입을 제한하므로 연소를 돕는 산소의 공급 조건과 연결된다. ㉡은 열을 빼앗는 작용이므로 온도 조건과 연결된다. 두 칸이 나타내는 작용과 답 순서를 바꾸지 않는다.",
    "scope": "support",
    "standards": [
      "6과14-02"
    ],
    "type": "T13",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set4-questions",
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
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "젖은 천의 두 가지 소화 작용",
      "inquirySkill": "소화 모형의 작용·해석 한계 구별",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T13",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "ordered-term-parts",
        "teacherRequired": false,
        "parts": [
          {
            "kind": "short-text",
            "accepted": [
              "산소 공급",
              "산소",
              "공기 공급"
            ]
          },
          {
            "kind": "short-text",
            "accepted": [
              "온도"
            ]
          }
        ]
      },
      "type": "short-text",
      "answer": "산소 공급 / 온도",
      "accepted": [
        "산소 공급 / 온도"
      ],
      "inputHint": "각 부분의 답을 따로 써요."
    }
  },
  {
    "key": "4-16",
    "id": "c22-s62-u02-v066",
    "status": "authored",
    "kind": "st",
    "prompt": "출화 예방과 초기 확산 억제를 구별하지 못한 카드의 기호를 쓰세요.",
    "givens": {
      "카드": {
        "머리": [
          "기호",
          "설명"
        ],
        "행": [
          [
            "ㄱ",
            "불이 나기 전 점화 원인을 줄이는 대비가 필요하다."
          ],
          [
            "ㄴ",
            "소화기만 있으면 모든 불이 처음부터 나지 않는다."
          ],
          [
            "ㄷ",
            "소화기는 적합한 초기 상황에서 확산을 줄이는 데 쓰일 수 있다."
          ]
        ]
      },
      "조건": "실제 화재 진화 방법을 실습하는 문제가 아니다."
    },
    "responseContract": {
      "kind": "short-text",
      "teacherRequired": false,
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "소화기는 모든 출화 자체를 막는 장치가 아니다. 불이 나기 전 원인을 줄이는 예방과, 이미 시작된 불의 확산을 줄이는 초기 대응을 구별해야 한다. ㄴ은 두 역할을 혼동한 카드이다.",
    "scope": "support",
    "standards": [
      "6과14-02"
    ],
    "type": "T14",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set4-questions",
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
    "repair": "예방이라는 모호한 표현을 출화 예방/초기 확산 억제로 구별함",
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "소화기가 필요한 까닭",
      "inquirySkill": "안전 자료의 조건과 순서 판단",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T14",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "4-17",
    "id": "c22-s62-u02-v067",
    "status": "authored",
    "kind": "st",
    "prompt": "분말 소화기의 모형 부품을 설명한 두 카드를 읽고 부품 이름을 ㉠·㉡ 순서대로 쓰세요.",
    "givens": {
      "부품": {
        "머리": [
          "칸",
          "모형 설명"
        ],
        "행": [
          [
            "㉠",
            "손잡이가 뜻하지 않게 눌리지 않도록 끼워 두는 핀"
          ],
          [
            "㉡",
            "기구 몸체와 이어져 분사 방향을 준비하는 고무 관"
          ]
        ]
      },
      "조건": "호스가 달린 분말 소화기의 부품 명칭을 읽는 카드이다. 실제 기구의 핀을 빼거나 분사하지 않는다."
    },
    "responseContract": {
      "kind": "ordered-term-parts",
      "teacherRequired": false,
      "parts": [
        {
          "kind": "short-text",
          "accepted": [
            "안전핀"
          ]
        },
        {
          "kind": "short-text",
          "accepted": [
            "호스",
            "고무 호스",
            "분사 호스"
          ]
        }
      ]
    },
    "explanation": "㉠은 의도하지 않은 조작을 막는 안전핀이고 ㉡은 방향을 준비하는 호스이다. 설명과 부품의 역할을 짝짓고 순서대로 쓴다. 부품 이름을 안다는 사실이 실제 화재에서 학생이 기구를 조작해야 한다는 뜻은 아니다.",
    "scope": "support",
    "standards": [
      "6과14-02"
    ],
    "type": "T14",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set4-questions",
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
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "소화기 조작 용어",
      "inquirySkill": "안전 자료의 조건과 순서 판단",
      "itemType": "st",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T14",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "ordered-term-parts",
        "teacherRequired": false,
        "parts": [
          {
            "kind": "short-text",
            "accepted": [
              "안전핀"
            ]
          },
          {
            "kind": "short-text",
            "accepted": [
              "호스",
              "고무 호스",
              "분사 호스"
            ]
          }
        ]
      },
      "type": "short-text",
      "answer": "안전핀 / 호스",
      "accepted": [
        "안전핀 / 호스"
      ],
      "inputHint": "각 부분의 답을 따로 써요."
    }
  },
  {
    "key": "4-18",
    "id": "c22-s62-u02-v068",
    "status": "authored",
    "kind": "mc",
    "prompt": "상황에 맞지 않는 계획을 고르세요.",
    "givens": {
      "상황": "다른 집에 화재가 났고, 자기 집으로는 아직 화염·연기가 들어오지 않는다. 복도와 계단에는 연기가 보여 안전한 이동 경로가 확인되지 않았다.",
      "조건": "소방청의 상황별 피난 안내를 비교하는 자료 읽기이다. 현재 상황을119에 알리고 안내를 따르는 것이 전제이다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 1
    },
    "explanation": "안전한 이동 경로가 확인되지 않고 계단에 연기가 보이는 상황이다. 무조건 그 계단에 들어가는 계획은 상황별 안내와 맞지 않는다. 불의 위치나 경로 조건과 무관하게 옥상·높은 층으로 가는 단일 답을 만들지 않는다.",
    "scope": "support",
    "standards": [
      "6과14-02"
    ],
    "type": "T14",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set4-questions",
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
    "choices": [
      "자기 집 안의 화염·연기 유입을 살핀다.",
      "연기 있는 계단에 무조건 들어간다.",
      "현재 위치와 상황을119에 알린다.",
      "안내방송과119의 안내를 확인한다.",
      "안전한 경로가 확인됐는지 구별한다."
    ],
    "repair": "조건 없는 승강기/옥상 보기를 상황별 안전 경로 판단으로 재집필",
    "referenceIds": [
      "nfa-evacuation-2024",
      "nfa-evacuation-2025"
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "화재 대피 행동",
      "inquirySkill": "안전 자료의 조건과 순서 판단",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T14",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
    "key": "4-19",
    "id": "c22-s62-u02-v069",
    "status": "authored",
    "kind": "es",
    "prompt": "“수건으로 입을 가리면 연기 속에서도 안전하게 지나갈 수 있다”는 주장을 고쳐 설명하세요.",
    "givens": {
      "자료": "일반 천이나 젖은 천을 코와 입에 댔다고 해서 화재 연기의 유독 기체를 막는 전문 보호구가 되는 것은 아니다. 피난 여부는 화염·연기와 안전한 경로,119 안내를 함께 확인해야 한다.",
      "조건": "자료의 한계를 읽는 문제이다. 실제 연기를 만들거나 그 안을 통과하는 활동은 하지 않는다."
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "수건만으로 유독 기체를 막거나 연기 속 통과가 안전하다고 보장할 수 없다. 화염·연기와 경로를 확인하고119 안내에 따라 판단해야 한다.",
      "required": [
        "수건이 유독 기체를 막는 전문 보호구가 아님을 설명한다.",
        "수건을 사용했다는 사실만으로 안전한 통과를 보장하지 않는다.",
        "화염·연기·경로와 안내를 확인하는 판단을 연결한다."
      ],
      "exactStringScoring": false
    },
    "explanation": "입을 가렸다는 사실과 위험한 기체로부터 보호된다는 보장은 다르다. 일반 천이나 젖은 천은 화재의 위험을 없애는 장비가 아니므로, 그 사실만으로 연기 있는 경로에 들어가도 안전하다는 결론을 낼 수 없다. 상황별 피난 안내와119의 안내를 함께 확인한다.",
    "scope": "support",
    "standards": [
      "6과14-02"
    ],
    "type": "T14",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set4-questions",
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
    "repair": "수건의 유독 기체 차단을 정답 조건으로 삼지 않고 보호 한계와 판단 근거를 분리함",
    "referenceIds": [
      "niosh-cloth-limit",
      "niosh-wildfire-2023",
      "nfa-evacuation-2025"
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "낮은 자세와 수건의 역할",
      "inquirySkill": "안전 자료의 조건과 순서 판단",
      "itemType": "es",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T14",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
    },
    "answerContract": {
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "수건만으로 유독 기체를 막거나 연기 속 통과가 안전하다고 보장할 수 없다. 화염·연기와 경로를 확인하고119 안내에 따라 판단해야 한다.",
        "required": [
          "수건이 유독 기체를 막는 전문 보호구가 아님을 설명한다.",
          "수건을 사용했다는 사실만으로 안전한 통과를 보장하지 않는다.",
          "화염·연기·경로와 안내를 확인하는 판단을 연결한다."
        ],
        "exactStringScoring": false
      },
      "type": "written-explanation",
      "sample": "수건만으로 유독 기체를 막거나 연기 속 통과가 안전하다고 보장할 수 없다. 화염·연기와 경로를 확인하고119 안내에 따라 판단해야 한다.",
      "rubric": {
        "required": [
          "수건이 유독 기체를 막는 전문 보호구가 아님을 설명한다.",
          "수건을 사용했다는 사실만으로 안전한 통과를 보장하지 않는다.",
          "화염·연기·경로와 안내를 확인하는 판단을 연결한다."
        ],
        "pass": "자료와 조건을 연결한 설명을 선생님이 확인해요."
      }
    }
  },
  {
    "key": "4-20",
    "id": "c22-s62-u02-v070",
    "status": "authored",
    "kind": "mc",
    "prompt": "시설 담당자의 평상시 점검 계획으로 알맞은 것을 고르세요.",
    "givens": {
      "조건": "실제 화재 상황이 아닌 평소의 대비 계획이다. 학생이 감지기·소화기를 분해하거나 시설을 바꾸지 않는다."
    },
    "responseContract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "answer": 4
    },
    "explanation": "피난 안내와 시설 점검은 서로 다른 대비 역할을 하므로 함께 확인해야 한다. 기구가 있다는 이유로 통로를 막거나 감지 시설을 꺼 두는 것은 대비 목적과 맞지 않는다. 평소 점검과 실제 화재의 상황별 대응을 구별한다.",
    "scope": "support",
    "standards": [
      "6과14-02"
    ],
    "type": "T14",
    "sourceRef": {
      "type": "authored-pair",
      "of": {
        "sourceId": "legacy-s62-combustion-set4-questions",
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
      "소화기가 있으면 통로 점검은 생략한다.",
      "경보 소리가 싫으므로 감지 시설을 꺼 둔다.",
      "피난 표지를 가리는 위치에 물건을 둔다.",
      "점검 기록이 없을수록 관리가 잘된 것이다.",
      "피난 안내와 시설 점검을 함께 확인한다."
    ],
    "taxonomy": {
      "domain": "물질",
      "topic": "물질의 연소",
      "concept": "화재 피해를 줄이는 시설",
      "inquirySkill": "안전 자료의 조건과 순서 판단",
      "itemType": "mc",
      "track": "교과",
      "level": "기본",
      "element": "E4",
      "type": "T14",
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "standard": "6과14-02"
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
  }
];
export const source = [];
export const similar = [];
