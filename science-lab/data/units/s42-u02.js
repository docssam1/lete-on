export const unit = {
  "id": "s42-u02",
  "course": "4-2",
  "no": 2,
  "title": "물의 상태 변화",
  "domain": "물질",
  "sources": {
    "lab": [
      "4-B 실험 교사 PDF 17–24쪽 (비공개 원본)"
    ],
    "bank": [
      "data/units/s42-u02.source.js"
    ]
  }
};
export const items = [
  {
    "id": "s42-u02-b01",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u02",
      "originalNo": 1
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "element": "E3",
      "type": "T06",
      "concept": "증발",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "액체인 물이 기체인 ( ① )(으)로 변하는 것을 ( ② )(이)라고 해요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "수증기",
          "accepted": [
            "수증기"
          ]
        },
        {
          "answer": "기화",
          "accepted": [
            "기화"
          ]
        }
      ]
    },
    "explanation": "증발과 끓음은 모두 물이 수증기가 되는 기화예요.",
    "evidence": {
      "checkedBy": "Codex",
      "date": "2026-10-03",
      "gates": [
        "source-lab-4B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u02-b02",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u02",
      "originalNo": 2
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "element": "E3",
      "type": "T08",
      "concept": "끓음과 증발 비교",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "물 표면에서 일어나는 변화는 ( ① ), 물속에서도 기포가 생기는 변화는 ( ② )이에요.",
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
        },
        {
          "answer": "끓음",
          "accepted": [
            "끓음"
          ]
        }
      ]
    },
    "explanation": "증발은 끓지 않는 물에서도 일어나요.",
    "evidence": {
      "checkedBy": "Codex",
      "date": "2026-10-03",
      "gates": [
        "source-lab-4B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u02-b03",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u02",
      "originalNo": 3
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "element": "E1",
      "type": "T01",
      "concept": "얼음·물·수증기의 성질",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "눈에 보이지 않는 기체는 ( ① ), 하얗게 보이는 작은 물방울 무리는 ( ② )이에요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "수증기",
          "accepted": [
            "수증기"
          ]
        },
        {
          "answer": "김",
          "accepted": [
            "김"
          ]
        }
      ]
    },
    "explanation": "김은 수증기가 식어 생긴 액체 물방울이에요.",
    "evidence": {
      "checkedBy": "Codex",
      "date": "2026-10-03",
      "gates": [
        "source-lab-4B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u02-b04",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u02",
      "originalNo": 4
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "element": "E4",
      "type": "T09",
      "concept": "응결",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "수증기가 식어 액체인 물로 변하는 것을 ( ① )(이)라고 해요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "응결",
          "accepted": [
            "응결"
          ]
        }
      ]
    },
    "explanation": "컵 밖의 물방울과 풀잎의 이슬은 응결의 예예요.",
    "evidence": {
      "checkedBy": "Codex",
      "date": "2026-10-03",
      "gates": [
        "source-lab-4B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u02-b05",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u02",
      "originalNo": 5
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "element": "E1",
      "type": "T02",
      "concept": "물의 상태 변화와 예",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "다음 현상을 증발·끓음·응결 중 하나로 분류해요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "table-fill",
    "answerContract": {
      "type": "table-fill",
      "rowHead": "현상",
      "columns": [
        "변화"
      ],
      "options": {
        "변화": [
          "증발",
          "끓음",
          "응결"
        ]
      },
      "rows": [
        {
          "label": "젖은 수건이 마름",
          "answer": [
            "증발"
          ]
        },
        {
          "label": "냄비 속 기포가 올라옴",
          "answer": [
            "끓음"
          ]
        },
        {
          "label": "차가운 컵 밖에 물방울",
          "answer": [
            "응결"
          ]
        }
      ]
    },
    "explanation": "물이 수증기가 되는 방향과 수증기가 물이 되는 방향을 나누어 봐요.",
    "evidence": {
      "checkedBy": "Codex",
      "date": "2026-10-03",
      "gates": [
        "source-lab-4B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u02-b06",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u02",
      "originalNo": 6
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "element": "E1",
      "type": "T01",
      "concept": "얼음·물·수증기의 성질",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "가습기 위에서 하얗게 보이는 김은 무엇일까요?",
    "givens": null,
    "choices": [
      "기체 수증기",
      "아주 작은 얼음",
      "작은 물방울",
      "물에서 난 연기",
      "떠다니는 먼지"
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
    "explanation": "김은 액체인 작은 물방울이 모인 모습이에요. 수증기는 눈에 보이지 않아요.",
    "evidence": {
      "checkedBy": "Codex",
      "date": "2026-10-03",
      "gates": [
        "source-lab-4B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u02-b07",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u02",
      "originalNo": 7
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "element": "E4",
      "type": "T09",
      "concept": "응결",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "차가운 컵 바깥의 물방울은 어디에서 왔나요?",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "공기 중의 수증기가 차가운 컵에 닿아 식어서 물방울이 되었다.",
      "rubric": {
        "required": [
          "공기 중 수증기",
          "차가운 컵에서 식어 물이 됨"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "컵 속의 물이 새어 나온 것이 아니에요.",
    "evidence": {
      "checkedBy": "Codex",
      "date": "2026-10-03",
      "gates": [
        "source-lab-4B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u02-b08",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u02",
      "originalNo": 8
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "element": "E5",
      "type": "T12",
      "concept": "공정한 비교",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "판을 식힌 효과를 알아보려면 어떤 조건만 바꾸나요?",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "판의 차가운 정도만 바꾸고 물의 양, 물의 온도, 관찰 시간을 같게 한다.",
      "rubric": {
        "required": [
          "판의 차가운 정도만 바꿈",
          "다른 조건을 같게 함"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "두 조건을 동시에 바꾸면 어느 조건 때문인지 알기 어려워요.",
    "evidence": {
      "checkedBy": "Codex",
      "date": "2026-10-03",
      "gates": [
        "source-lab-4B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u02-b09",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u02",
      "originalNo": 9
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "element": "E5",
      "type": "T11",
      "concept": "생활 속 상태 변화 이용",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "빨래가 마르는 것과 가습기는 어떤 공통점이 있나요?",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "빨래의 물과 가열식 가습기의 물은 모두 수증기로 변한다.",
      "rubric": {
        "required": [
          "물이 수증기로 변함"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "물이 수증기로 변해 공기 중으로 이동해요. 모든 가습기가 가열식인 것은 아니에요.",
    "evidence": {
      "checkedBy": "Codex",
      "date": "2026-10-03",
      "gates": [
        "source-lab-4B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u02-b10",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u02",
      "originalNo": 10
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "element": "E3",
      "type": "T07",
      "concept": "증발의 예",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "끓지 않는 물에서 증발이 일어나는 예는?",
    "givens": null,
    "choices": [
      "젖은 머리가 마름",
      "얼음이 물로 녹음",
      "물방울이 컵에 맺힘",
      "풀잎에 이슬이 생김",
      "물이 얼음으로 변함"
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
    "explanation": "젖은 머리카락의 물이 표면에서 수증기로 변해요.",
    "evidence": {
      "checkedBy": "Codex",
      "date": "2026-10-03",
      "gates": [
        "source-lab-4B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u02-b11",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u02",
      "originalNo": 11
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "element": "E5",
      "type": "T12",
      "concept": "공정한 비교",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "두 팀이 판의 차가운 정도를 비교할 때 같게 할 조건은?",
    "givens": null,
    "choices": [
      "판의 차가운 정도",
      "모둠의 이름과 순서",
      "예상한 결과와 이유",
      "물의 양과 관찰 시간",
      "답을 쓴 글씨의 크기"
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
    "explanation": "같은 양의 같은 온도 물로 같은 시간 관찰해요.",
    "evidence": {
      "checkedBy": "Codex",
      "date": "2026-10-03",
      "gates": [
        "source-lab-4B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u02-b12",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u02",
      "originalNo": 12
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "element": "E4",
      "type": "T09",
      "concept": "응결",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "차가운 판 아래의 물방울을 설명한 것은?",
    "givens": null,
    "choices": [
      "물이 고체로 얼었다",
      "판 자체가 물로 변했다",
      "먼지가 액체로 녹았다",
      "컵의 물이 판으로 샜다",
      "수증기가 식어 물이 됐다"
    ],
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
    "explanation": "기체 수증기가 액체 물로 변하는 응결이에요.",
    "evidence": {
      "checkedBy": "Codex",
      "date": "2026-10-03",
      "gates": [
        "source-lab-4B-pages17-24",
        "science",
        "answer"
      ]
    }
  }
];
