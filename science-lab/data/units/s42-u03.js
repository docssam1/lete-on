export const unit = {
  "id": "s42-u03",
  "course": "4-2",
  "no": 3,
  "title": "그림자와 거울",
  "domain": "물리",
  "sources": {
    "lab": [
      "3-F 실험 교사 PDF 17–24쪽 그림자 살펴보기 (비공개 원본)",
      "3-F 9–16쪽 바늘구멍 사진기 · 25–32쪽 해시계 만들기(개념 확장)"
    ]
  }
};
export const items = [
  {
    "id": "s42-u03-b01",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u03",
      "originalNo": 1
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "element": "E1",
      "type": "T01",
      "concept": "빛의 직진과 그림자",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "그림자는 ( ① )이 나아가다가 ( ② )에 막혀서 생겨요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "빛",
          "accepted": [
            "빛"
          ]
        },
        {
          "answer": "물체",
          "accepted": [
            "물체"
          ]
        }
      ]
    },
    "explanation": "빛이 지나가는 길에 물체가 있으면 물체 뒤쪽에 빛이 닿지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-3F-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-b02",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u03",
      "originalNo": 2
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "element": "E1",
      "type": "T02",
      "concept": "투명·불투명 물체의 그림자",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "빛이 잘 통과하지 못하는 ( ① ) 물체는 진한 그림자가, 빛이 대부분 통과하는 ( ② ) 물체는 연한 그림자가 생겨요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "불투명",
          "accepted": [
            "불투명"
          ]
        },
        {
          "answer": "투명",
          "accepted": [
            "투명"
          ]
        }
      ]
    },
    "explanation": "빛이 통과하는 정도에 따라 그림자의 진하기가 달라요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-3F-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-b03",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u03",
      "originalNo": 3
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "element": "E2",
      "type": "T03",
      "concept": "거리에 따른 그림자 크기",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "손전등과 스크린은 그대로 두고 물체를 손전등에 가깝게 하면 그림자의 크기가 ( ① ).",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "커진다",
          "accepted": [
            "커진다",
            "커져요",
            "커짐",
            "커진다요"
          ]
        }
      ]
    },
    "explanation": "손전등 빛은 퍼져 나가므로 가까운 물체가 빛을 더 넓게 막아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-3F-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-b04",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u03",
      "originalNo": 4
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "element": "E1",
      "type": "T01",
      "concept": "빛의 직진과 그림자",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "그림자의 모양이 물체의 모양과 비슷한 까닭은 빛이 ( ① ) 나아가기 때문이에요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "곧게",
          "accepted": [
            "곧게",
            "직진하며",
            "똑바로"
          ]
        }
      ]
    },
    "explanation": "빛은 곧게 나아가기 때문에 물체의 테두리를 따라 그림자가 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-3F-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-b05",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u03",
      "originalNo": 5
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "element": "E2",
      "type": "T03",
      "concept": "거리에 따른 그림자 크기",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "그림자의 크기 변화를 「커진다·작아진다·거의 같다」 중 하나로 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "table-fill",
    "answerContract": {
      "type": "table-fill",
      "rowHead": "바꾼 것",
      "columns": [
        "그림자 크기"
      ],
      "options": {
        "그림자 크기": [
          "커진다",
          "작아진다",
          "거의 같다"
        ]
      },
      "rows": [
        {
          "label": "손전등 빛, 물체를 손전등 쪽으로",
          "answer": [
            "커진다"
          ]
        },
        {
          "label": "손전등 빛, 물체를 스크린 쪽으로",
          "answer": [
            "작아진다"
          ]
        },
        {
          "label": "햇빛, 물체를 앞뒤로 옮김",
          "answer": [
            "거의 같다"
          ]
        }
      ]
    },
    "explanation": "손전등 빛은 퍼지고, 햇빛은 거의 나란하게 들어와요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-3F-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-b06",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u03",
      "originalNo": 6
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "element": "E1",
      "type": "T02",
      "concept": "투명·불투명 물체의 그림자",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "손전등 빛을 비추었을 때 가장 진한 그림자가 생기는 물체는?",
    "givens": null,
    "choices": [
      "맑은 유리컵",
      "투명 필름",
      "두꺼운 종이 인형",
      "얇은 기름종이",
      "투명 플라스틱 자"
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
    "explanation": "두꺼운 종이는 빛이 거의 통과하지 못하는 불투명한 물체예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-3F-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-b07",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u03",
      "originalNo": 7
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "element": "E1",
      "type": "T01",
      "concept": "빛의 직진과 그림자",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "빛이 지나가는 길에 물체를 놓았을 때 그림자가 생기는 까닭을 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "빛은 곧게 나아가는데 물체가 빛을 막아 물체 뒤쪽에 빛이 닿지 않아 그림자가 생긴다.",
      "rubric": {
        "required": [
          "빛이 곧게 나아감",
          "물체가 빛을 막음"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "빛이 휘어서 돌아가지 못하므로 막힌 자리가 어두워져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-3F-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-b08",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u03",
      "originalNo": 8
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "element": "E3",
      "type": "T05",
      "concept": "공정한 비교와 관찰",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "물체의 위치에 따른 그림자 크기를 비교할 때 같게 해야 할 조건을 두 가지 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "손전등과 스크린 사이의 거리를 같게 하고, 같은 물체를 쓴다.",
      "rubric": {
        "required": [
          "손전등과 스크린 사이 거리",
          "같은 물체"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "바꿀 조건은 물체의 위치 하나뿐이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-3F-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-b09",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u03",
      "originalNo": 9
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "element": "E3",
      "type": "T06",
      "concept": "거울과 빛의 반사",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "거울에 「R」 글자 카드를 비추어 보면 어떻게 보이는지 쓰고, 생활에서 거울을 쓰는 예를 하나 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "글자의 왼쪽과 오른쪽이 바뀌어 보인다. 자동차 뒷거울로 뒤를 본다.",
      "rubric": {
        "required": [
          "좌우가 바뀜",
          "생활 속 거울의 예"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "거울에 비친 모습은 위아래는 그대로이고 좌우가 바뀌어 보여요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-3F-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-b10",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u03",
      "originalNo": 10
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "element": "E2",
      "type": "T03",
      "concept": "거리에 따른 그림자 크기",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "손전등과 스크린은 그대로 두고 그림자를 더 크게 만들려면 어떻게 할까요?",
    "givens": null,
    "choices": [
      "물체를 스크린 쪽으로 옮긴다",
      "물체를 손전등 쪽으로 옮긴다",
      "손전등을 끈다",
      "투명한 물체로 바꾼다",
      "스크린을 더 하얗게 칠한다"
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
    "explanation": "물체가 손전등에 가까울수록 빛을 넓게 막아 그림자가 커져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-3F-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-b11",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u03",
      "originalNo": 11
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "element": "E3",
      "type": "T05",
      "concept": "공정한 비교와 관찰",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "물체의 위치에 따른 그림자 크기 실험에서 바꿀 조건은?",
    "givens": null,
    "choices": [
      "손전등의 밝기",
      "스크린의 색",
      "물체의 모양",
      "물체의 위치",
      "실험하는 사람"
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
    "explanation": "알아보려는 것이 위치에 따른 변화이므로 물체의 위치(손전등과의 거리)만 바꿔요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-3F-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-b12",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u03",
      "originalNo": 12
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "element": "E3",
      "type": "T06",
      "concept": "거울과 빛의 반사",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "빛이 거울에 부딪혀 나아가는 방향이 바뀌는 성질은?",
    "givens": null,
    "choices": [
      "빛의 반사",
      "빛의 굴절",
      "그림자",
      "빛의 직진",
      "증발"
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
    "explanation": "거울은 빛을 반사해 방향을 바꿔요. 잠망경과 자동차 뒷거울이 이 성질을 이용해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-3F-pages17-24",
        "science",
        "answer"
      ]
    }
  }
];
