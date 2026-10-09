export const unit = {
  "id": "s51-u04",
  "course": "5-1",
  "no": 4,
  "title": "용해와 용액",
  "domain": "화학",
  "sources": {
    "theory": [
      "5-1-1 이론 교사 PDF Ⅲ 용해와 용액 · Ⅳ 화학 심화 (비공개 원본)"
    ],
    "lab": [
      "5-A 실험 교사 PDF 18~21쪽 흰 눈이 펄펄 (비공개 원본)"
    ]
  }
};
export const items = [
  {
    "id": "s51-u04-b01",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u04",
      "originalNo": 1
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "화학",
      "area": "화학",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "element": "E1",
      "type": "T01",
      "concept": "용해와 용액(용질·용매)",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "설탕이 물에 녹는 것처럼 어떤 물질이 다른 물질에 녹아 골고루 섞이는 현상을 ( ① ), 설탕물처럼 녹아 골고루 섞인 물질을 ( ② )이라고 해요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "용해",
          "accepted": [
            "용해"
          ]
        },
        {
          "answer": "용액",
          "accepted": [
            "용액"
          ]
        }
      ]
    },
    "explanation": "용액은 오래 두어도 가라앉거나 뜨는 것이 없어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-A-pages18-21",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u04-b02",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u04",
      "originalNo": 2
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "화학",
      "area": "화학",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "element": "E1",
      "type": "T01",
      "concept": "용해와 용액(용질·용매)",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "설탕물에서 녹는 물질인 설탕을 ( ① ), 녹이는 물질인 물을 ( ② )라고 해요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "용질",
          "accepted": [
            "용질"
          ]
        },
        {
          "answer": "용매",
          "accepted": [
            "용매"
          ]
        }
      ]
    },
    "explanation": "소금물이라면 소금이 용질, 물이 용매예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-A-pages18-21",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u04-b03",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u04",
      "originalNo": 3
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "화학",
      "area": "화학",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "element": "E2",
      "type": "T04",
      "concept": "물의 온도에 따라 녹는 양",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "물의 양이 같을 때 물의 온도가 높을수록 염화암모늄이 녹는 양이 ( ① ).",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "많아요",
          "accepted": [
            "많아요",
            "많아진다",
            "많다",
            "많아져요",
            "늘어요",
            "늘어난다"
          ]
        }
      ]
    },
    "explanation": "그래서 뜨거운 물에 가득 녹인 용액을 식히면 결정이 나와요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-A-pages18-21",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u04-b04",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u04",
      "originalNo": 4
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "화학",
      "area": "화학",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "element": "E1",
      "type": "T02",
      "concept": "용해 전과 후의 무게",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "각설탕 10 g을 물 100 g에 모두 녹이면 설탕물의 무게는 ( ① ) g이에요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "110",
          "accepted": [
            "110",
            "110g",
            "110 g"
          ]
        }
      ]
    },
    "explanation": "설탕은 녹아도 없어지지 않아 무게가 그대로 더해져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-A-pages18-21",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u04-b05",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u04",
      "originalNo": 5
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "화학",
      "area": "화학",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "element": "E2",
      "type": "T04",
      "concept": "물의 온도에 따라 녹는 양",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "60 ℃에서 염화암모늄을 가득 녹인 용액을 담은 병을 여러 방법으로 두었을 때 생기는 흰 결정의 양을 골라 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "table-fill",
    "answerContract": {
      "type": "table-fill",
      "rowHead": "식히는 방법",
      "columns": [
        "흰 결정(눈)의 양"
      ],
      "options": {
        "흰 결정(눈)의 양": [
          "생기지 않는다",
          "조금 생긴다",
          "가장 많이 생긴다"
        ]
      },
      "rows": [
        {
          "label": "그대로 두기(60 ℃)",
          "answer": [
            "생기지 않는다"
          ]
        },
        {
          "label": "실온에서 식히기(20 ℃)",
          "answer": [
            "조금 생긴다"
          ]
        },
        {
          "label": "얼음물에 식히기(0 ℃)",
          "answer": [
            "가장 많이 생긴다"
          ]
        }
      ]
    },
    "explanation": "온도가 낮을수록 녹을 수 있는 양이 줄어 더 많은 결정이 나와요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-A-pages18-21",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u04-b06",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u04",
      "originalNo": 6
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "화학",
      "area": "화학",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "element": "E3",
      "type": "T05",
      "concept": "용액의 진하기 비교",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "맛을 보지 않고 두 설탕물의 진하기를 비교하는 방법으로 알맞은 것은?",
    "givens": null,
    "choices": [
      "설탕물의 양이 더 많은 쪽이 언제나 더 진하다",
      "방울토마토를 넣어 더 높이 뜨는 쪽이 더 진하다",
      "더 큰 컵에 담긴 쪽이 더 진하다",
      "방울토마토가 더 깊이 가라앉는 쪽이 더 진한 설탕물이다",
      "온도가 더 낮은 설탕물이 언제나 더 진하다"
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
    "explanation": "진한 용액일수록 물체가 더 높이 떠요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-A-pages18-21",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u04-b07",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u04",
      "originalNo": 7
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "화학",
      "area": "화학",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "element": "E2",
      "type": "T04",
      "concept": "물의 온도에 따라 녹는 양",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "염화암모늄 포화 용액을 담은 병을 식혔더니 흰 결정이 눈처럼 생긴 까닭을 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "온도가 낮아지면 물에 녹을 수 있는 염화암모늄의 양이 줄어들어, 더 녹아 있지 못한 염화암모늄이 결정으로 나오기 때문이다.",
      "rubric": {
        "required": [
          "온도가 낮아지면 녹을 수 있는 양이 줄어듦",
          "녹지 못한 만큼 결정으로 나옴"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "얼음이 된 것이 아니라 녹아 있던 염화암모늄이 다시 나온 거예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-A-pages18-21",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u04-b08",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u04",
      "originalNo": 8
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "화학",
      "area": "화학",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "element": "E1",
      "type": "T02",
      "concept": "용해 전과 후의 무게",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "설탕을 물에 녹이면 보이지 않게 되지만 없어진 것은 아니에요. 그 까닭과 근거를 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "설탕이 눈에 보이지 않을 만큼 작게 나뉘어 물에 골고루 섞여 있기 때문이며, 녹이기 전과 후의 무게가 같다는 것이 근거이다.",
      "rubric": {
        "required": [
          "작게 나뉘어 골고루 섞임",
          "녹이기 전과 후의 무게가 같음"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "맛을 보면 단맛도 그대로 나요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-A-pages18-21",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u04-b09",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u04",
      "originalNo": 9
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "화학",
      "area": "화학",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "element": "E3",
      "type": "T05",
      "concept": "용액의 진하기 비교",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "맛을 보면 안 되는 두 용액의 진하기를 비교하는 방법을 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "방울토마토 같은 물체를 넣어 보아 더 높이 떠오르는 쪽이 더 진한 용액이다.",
      "rubric": {
        "required": [
          "물체를 넣어 뜨는 정도를 비교",
          "더 높이 뜨는 쪽이 진함"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "진한 용액일수록 물체를 더 세게 떠받쳐요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-A-pages18-21",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u04-b10",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u04",
      "originalNo": 10
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "화학",
      "area": "화학",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "element": "E2",
      "type": "T03",
      "concept": "용질의 종류에 따라 녹는 양",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "온도와 양이 같은 물에 한 숟가락씩 넣어 저을 때 가장 많이 녹는 것은?",
    "givens": null,
    "choices": [
      "베이킹 소다",
      "소금",
      "설탕",
      "분필 가루",
      "모래"
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
    "explanation": "물질마다 같은 물에 녹는 양이 달라요. 분필 가루와 모래는 거의 녹지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-A-pages18-21",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u04-b11",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u04",
      "originalNo": 11
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "화학",
      "area": "화학",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "element": "E1",
      "type": "T01",
      "concept": "용해와 용액(용질·용매)",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "다음 중 용액이 아닌 것은?",
    "givens": null,
    "choices": [
      "흙탕물",
      "설탕물",
      "소금물",
      "이온 음료",
      "식초"
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
    "explanation": "흙탕물은 오래 두면 흙이 가라앉아 골고루 섞여 있지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-A-pages18-21",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u04-b12",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u04",
      "originalNo": 12
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "화학",
      "area": "화학",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "element": "E3",
      "type": "T06",
      "concept": "결정이 다시 생기는 현상(재결정)",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "흰 결정이 쌓인 병을 뜨거운 물에 다시 넣으면 어떻게 될까요?",
    "givens": null,
    "choices": [
      "결정이 더 많이 생긴다",
      "병 속 용액이 얼어붙는다",
      "결정이 커다란 덩어리로 뭉친다",
      "결정이 녹아 다시 맑아진다",
      "결정이 모두 물 위로 떠오른다"
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
    "explanation": "온도가 높아져 녹을 수 있는 양이 늘었기 때문이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-A-pages18-21",
        "science",
        "answer"
      ]
    }
  }
];
