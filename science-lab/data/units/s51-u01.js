export const unit = {
  "id": "s51-u01",
  "course": "5-1",
  "no": 1,
  "title": "과학자는 어떻게 탐구할까요",
  "domain": "탐구",
  "sources": {
    "theory": [
      "2009 초등학교 과학탐구토론 지도자료 1부 3~28쪽 탐구 과정 요소 (비공개 원본)"
    ],
    "lab": [
      "같은 자료 1부 예시 탐구 「물줄기의 굵기와 높이에 따라 튀는 물」 측정값 (비공개 원본)"
    ]
  }
};
export const items = [
  {
    "id": "s51-u01-b01",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 1
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "element": "E2",
      "type": "T03",
      "concept": "다르게 할 조건과 같게 할 조건",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "구멍 지름만 바꾸는 실험에서 구멍 지름은 ( ① ) 할 조건, 높이와 잉크 양은 ( ② ) 할 조건이에요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "다르게",
          "accepted": [
            "다르게"
          ]
        },
        {
          "answer": "같게",
          "accepted": [
            "같게"
          ]
        }
      ]
    },
    "explanation": "바꾸는 조건은 하나뿐이어야 결과가 무엇 때문에 달라졌는지 알 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-guide-2009-part1-pages3-28",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u01-b02",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 2
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "element": "E2",
      "type": "T04",
      "concept": "측정과 반복 실험(평균)",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "같은 조건으로 실험을 여러 번 하여 ( ① )을 구하면 우연한 실수(오차)를 줄일 수 있어요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "평균",
          "accepted": [
            "평균"
          ]
        }
      ]
    },
    "explanation": "평균 = 잰 값을 모두 더해 잰 횟수로 나눈 값이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-guide-2009-part1-pages3-28",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u01-b03",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 3
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "element": "E1",
      "type": "T02",
      "concept": "가설 세우기",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "탐구 문제의 답을 실험하기 전에 미리 생각해 보는 것을 ( ① ) 설정이라고 해요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "가설",
          "accepted": [
            "가설"
          ]
        }
      ]
    },
    "explanation": "가설은 「~할수록 ~할 것이다」처럼 조건과 결과를 이어 써요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-guide-2009-part1-pages3-28",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u01-b04",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 4
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "element": "E3",
      "type": "T06",
      "concept": "결론 도출과 발표",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "실험 결과를 근거로 탐구 문제의 답을 내리는 것을 ( ① ) 도출이라고 해요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "결론",
          "accepted": [
            "결론"
          ]
        }
      ]
    },
    "explanation": "결론은 실험한 결과로만, 번호를 붙여 짧게 써요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-guide-2009-part1-pages3-28",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u01-b05",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 5
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "element": "E2",
      "type": "T03",
      "concept": "다르게 할 조건과 같게 할 조건",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "「구멍 지름에 따라 튄 방울 수가 달라질까?」 실험에서 각 항목을 골라 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "table-fill",
    "answerContract": {
      "type": "table-fill",
      "rowHead": "항목",
      "columns": [
        "실험에서의 역할"
      ],
      "options": {
        "실험에서의 역할": [
          "다르게 할 조건",
          "같게 할 조건",
          "측정할 것"
        ]
      },
      "rows": [
        {
          "label": "뚜껑 구멍의 지름",
          "answer": [
            "다르게 할 조건"
          ]
        },
        {
          "label": "떨어뜨리는 높이",
          "answer": [
            "같게 할 조건"
          ]
        },
        {
          "label": "튄 방울의 수",
          "answer": [
            "측정할 것"
          ]
        }
      ]
    },
    "explanation": "알아보려는 것(구멍 지름)만 다르게, 나머지(높이·잉크 양·종이)는 같게, 결과(튄 방울 수)는 잰다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-guide-2009-part1-pages3-28",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u01-b06",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 6
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "element": "E2",
      "type": "T04",
      "concept": "측정과 반복 실험(평균)",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "세 번 잰 튄 방울 수가 96개, 99개, 102개일 때 평균은?",
    "givens": null,
    "choices": [
      "96개",
      "99개",
      "102개",
      "297개",
      "33개"
    ],
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
    "explanation": "(96 + 99 + 102) ÷ 3 = 99개예요. 297개는 합이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-guide-2009-part1-pages3-28",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u01-b07",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 7
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "element": "E1",
      "type": "T02",
      "concept": "가설 세우기",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "「물줄기의 굵기에 따라 튄 방울 수가 달라질까?」에 대한 가설을 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "물줄기가 가늘수록 튄 방울 수가 많을 것이다.",
      "rubric": {
        "required": [
          "조건(물줄기 굵기·구멍 지름)",
          "예상 결과(튄 방울 수)"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "틀린 예상이어도 조건과 결과를 이으면 가설이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-guide-2009-part1-pages3-28",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u01-b08",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 8
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "element": "E2",
      "type": "T04",
      "concept": "측정과 반복 실험(평균)",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "실험을 한 번만 하지 않고 세 번 하여 평균을 내는 까닭을 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "한 번만 하면 우연한 실수가 섞일 수 있으므로, 여러 번 하여 평균을 내면 더 믿을 만한 결과를 얻을 수 있다.",
      "rubric": {
        "required": [
          "우연한 실수(오차)",
          "믿을 만한 결과"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "세 번 잰 값이 조금씩 다른 것은 자연스러워요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-guide-2009-part1-pages3-28",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u01-b09",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 9
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "element": "E3",
      "type": "T06",
      "concept": "결론 도출과 발표",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "실험 결과가 가설과 달랐을 때 결론을 어떻게 써야 하는지 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "결과를 바꾸지 않고 나온 그대로 쓰고, 가설이 맞지 않았다고 밝힌 뒤 까닭이나 더 알아볼 점을 쓴다.",
      "rubric": {
        "required": [
          "결과를 그대로 씀",
          "가설이 틀렸음을 밝히거나 다시 탐구함"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "가설이 틀린 것도 중요한 발견이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-guide-2009-part1-pages3-28",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u01-b10",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 10
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "element": "E1",
      "type": "T01",
      "concept": "탐구 문제 정하기",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "탐구 문제로 가장 알맞은 것은?",
    "givens": null,
    "choices": [
      "물방울은 왜 아름다울까?",
      "세상에서 가장 좋은 페트병은 무엇일까?",
      "높이에 따라 튄 방울 수가 달라질까?",
      "잉크는 어느 나라에서 처음 만들었을까?",
      "과학자들은 무엇을 가장 좋아할까?"
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "실험으로 조건을 바꾸어 답을 확인할 수 있는 문제가 탐구 문제예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-guide-2009-part1-pages3-28",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u01-b11",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 11
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "element": "E3",
      "type": "T05",
      "concept": "자료 변환과 해석(표·그래프)",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "구멍 지름에 따른 튄 방울 수처럼, 조건에 따라 양이 어떻게 변하는지 한눈에 비교하기 좋은 것은?",
    "givens": null,
    "choices": [
      "막대그래프",
      "사진 한 장",
      "준비물 목록",
      "느낀 점",
      "참고 문헌"
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "막대의 길이로 양을 비교할 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-guide-2009-part1-pages3-28",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u01-b12",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 12
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "element": "E3",
      "type": "T06",
      "concept": "결론 도출과 발표",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "15 cm 높이에서 구멍 지름 1·3·5·7 mm의 평균이 101·59·26·10개였어요. 알맞은 결론은?",
    "givens": null,
    "choices": [
      "구멍이 클수록 많이 튄다",
      "구멍 크기와 튄 양은 관계없다",
      "높이가 높을수록 많이 튄다",
      "구멍이 작을수록 많이 튄다",
      "잉크 양이 많을수록 많이 튄다"
    ],
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
    "explanation": "이 자료는 높이를 바꾸지 않았으니 높이에 대한 결론은 낼 수 없어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-guide-2009-part1-pages3-28",
        "science",
        "answer"
      ]
    }
  }
];
