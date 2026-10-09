export const unit = {
  "id": "s52-u01",
  "course": "5-2",
  "no": 1,
  "title": "재미있는 나의 탐구",
  "domain": "탐구",
  "sources": {
    "lab": [
      "2009 초등학교 과학탐구토론 지도자료 1부 29~36쪽 비눗방울 탐구 (서울특별시과학전시관)"
    ]
  }
};
export const items = [
  {
    "id": "s52-u01-b01",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-2",
      "unit": "u01",
      "originalNo": 1
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E1",
      "type": "T01",
      "concept": "궁금한 점에서 탐구 문제 만들기",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "「비눗방울은 왜 금방 터질까?」 같은 궁금한 점을 「비눗물에 넣는 것에 따라 비눗방울이 터지기까지 시간이 달라질까?」처럼 실험으로 확인할 수 있게 바꾼 것을 ( ① )(이)라고 해요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "탐구 문제",
          "accepted": [
            "탐구 문제",
            "탐구 문제",
            "탐구문제"
          ]
        }
      ]
    },
    "explanation": "탐구 문제는 「~에 따라 ~이 달라질까?」처럼 조건과 결과를 함께 담아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-b02",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-2",
      "unit": "u01",
      "originalNo": 2
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E2",
      "type": "T03",
      "concept": "변인 통제와 반복 측정(평균)",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "넣는 것에 따른 비눗방울 시간을 비교할 때 넣는 것은 ( ① ) 할 조건, 비눗물의 양·고리 크기·부는 세기는 ( ② ) 할 조건이에요.",
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
    "explanation": "다르게 할 조건이 하나뿐이어야 결과가 무엇 때문에 달라졌는지 알 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-b03",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-2",
      "unit": "u01",
      "originalNo": 3
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E2",
      "type": "T04",
      "concept": "비눗방울의 과학(막·증발·첨가물)",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "비눗방울은 막 속의 물이 ( ① )하여 막이 얇아지면 터져요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "증발",
          "accepted": [
            "증발"
          ]
        }
      ]
    },
    "explanation": "글리세린·설탕은 이 증발을 늦춰 방울을 오래 가게 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-b04",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-2",
      "unit": "u01",
      "originalNo": 4
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E2",
      "type": "T03",
      "concept": "변인 통제와 반복 측정(평균)",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "같은 조건으로 세 번 재어 ( ① )을(를) 구하면 우연한 차이를 줄일 수 있어요.",
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
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-b05",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-2",
      "unit": "u01",
      "originalNo": 5
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E3",
      "type": "T05",
      "concept": "결과를 표·그래프로 정리하기",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "세 번 잰 시간의 평균을 골라 표를 완성해요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "table-fill",
    "answerContract": {
      "type": "table-fill",
      "rowHead": "넣은 것(1·2·3회)",
      "columns": [
        "평균"
      ],
      "options": {
        "평균": [
          "10초",
          "25초",
          "59초"
        ]
      },
      "rows": [
        {
          "label": "그냥 비눗물(9·11·10초)",
          "answer": [
            "10초"
          ]
        },
        {
          "label": "설탕(24·27·24초)",
          "answer": [
            "25초"
          ]
        },
        {
          "label": "글리세린(56·62·59초)",
          "answer": [
            "59초"
          ]
        }
      ]
    },
    "explanation": "세 값을 모두 더해 3으로 나눠요. 예: (9 + 11 + 10) ÷ 3 = 10초.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-b06",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-2",
      "unit": "u01",
      "originalNo": 6
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E3",
      "type": "T05",
      "concept": "결과를 표·그래프로 정리하기",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "넣은 것에 따른 평균 시간을 비교하기에 가장 알맞은 그래프는?",
    "givens": null,
    "choices": [
      "꺾은선그래프",
      "막대그래프",
      "원그래프",
      "그림그래프",
      "띠그래프"
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
    "explanation": "넣은 것은 수가 아닌 종류라서, 종류마다 크기를 비교하는 막대그래프가 알맞아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-b07",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-2",
      "unit": "u01",
      "originalNo": 7
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E2",
      "type": "T04",
      "concept": "비눗방울의 과학(막·증발·첨가물)",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "글리세린을 넣은 비눗방울이 더 오래 가는 까닭을 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "글리세린이 막 속의 물을 붙잡아 물이 증발하는 것을 늦추므로, 막이 천천히 얇아져 늦게 터지기 때문이다.",
      "rubric": {
        "required": [
          "물이 증발하는 것을 늦춤",
          "막이 천천히 얇아짐(늦게 터짐)"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "글리세린이 막을 무겁게 하거나 단단하게 굳히는 것이 아니에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-b08",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-2",
      "unit": "u01",
      "originalNo": 8
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E1",
      "type": "T01",
      "concept": "궁금한 점에서 탐구 문제 만들기",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "「비눗방울은 왜 예쁠까?」가 탐구 문제로 알맞지 않은 까닭과, 실험할 수 있는 탐구 문제로 고친 예를 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "「예쁘다」는 사람마다 달라 실험으로 재거나 비교할 수 없기 때문이다. 고친 예: 비눗물에 넣는 것에 따라 비눗방울이 터지기까지 시간이 달라질까?",
      "rubric": {
        "required": [
          "재거나 비교할 수 없음",
          "조건에 따라 달라지는지 묻는 문제로 고침"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "탐구 문제는 조건을 바꾸어 결과를 잴 수 있어야 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-b09",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-2",
      "unit": "u01",
      "originalNo": 9
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E3",
      "type": "T06",
      "concept": "결론 내리고 발표·평가하기",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "실험 결과(그냥 비눗물 10초 · 설탕 25초 · 글리세린 59초, 세 번 평균)로 결론을 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "비눗물에 글리세린을 넣으면 비눗방울이 가장 오래 가고, 설탕을 넣어도 그냥 비눗물보다 오래 간다.",
      "rubric": {
        "required": [
          "글리세린이 가장 오래 감",
          "설탕도 그냥 비눗물보다 오래 감"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "결론은 실험한 결과로만 써요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-b10",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-2",
      "unit": "u01",
      "originalNo": 10
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E1",
      "type": "T02",
      "concept": "탐구 계획 세우기",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "친구가 「설탕을 넣고 빨대도 굵은 것으로 바꾸어 불었더니 더 오래 갔다」고 발표했어요. 이 탐구의 문제점은?",
    "givens": null,
    "choices": [
      "한 번에 두 가지 조건을 바꾸어 무엇 때문인지 알 수 없다",
      "설탕을 너무 조금 넣었다",
      "빨대의 색을 미리 정하지 않았다",
      "결과를 표로 정리하지 않고 막대그래프로만 크게 그려서 나타내어 발표했다",
      "방울을 너무 크게 불었다"
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
    "explanation": "다르게 할 조건은 하나뿐이어야 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-b11",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-2",
      "unit": "u01",
      "originalNo": 11
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E2",
      "type": "T04",
      "concept": "비눗방울의 과학(막·증발·첨가물)",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "비눗방울이 터지는 가장 큰 까닭은?",
    "givens": null,
    "choices": [
      "방울 속 공기가 무거워져 아래로 끌어당기기 때문",
      "막 속의 물이 증발해 막이 얇아지기 때문",
      "비누가 공기와 만나 새로운 기체로 변하기 때문",
      "방울이 위로 떠오르며 점점 커지기 때문",
      "햇빛이 비누를 모두 녹여 없애기 때문"
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
    "explanation": "막이 얇아지면 색이 바뀌다가 터져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-b12",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-2",
      "unit": "u01",
      "originalNo": 12
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E3",
      "type": "T06",
      "concept": "결론 내리고 발표·평가하기",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "발표를 들은 친구의 질문에 답하는 태도로 알맞은 것은?",
    "givens": null,
    "choices": [
      "질문한 친구의 말을 끊고 다음으로 넘어간다",
      "모르는 것도 아는 척하며 지어내어 답한다",
      "결과를 근거로 들어 차분히 설명한다",
      "결과가 가설과 달랐던 것은 숨긴다",
      "가설과 다른 결과는 실험 실수라며 빼고 말한다"
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
    "explanation": "모르는 것은 「더 알아보겠다」고 말해도 좋아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  }
];
