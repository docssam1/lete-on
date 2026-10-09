export const unit = {
  "id": "s42-u04",
  "course": "4-2",
  "no": 4,
  "title": "화산과 지진",
  "domain": "지구",
  "sources": {
    "theory": [
      "4-2-2 이론 교사 PDF 21–26쪽 화산과 지진 (비공개 원본)"
    ],
    "lab": [
      "4-D 실험 교사 PDF 마그마의 분출 · 현무암 (비공개 원본)"
    ],
    "bank": [
      "data/units/s42-u04.source.js"
    ]
  }
};
export const items = [
  {
    "id": "s42-u04-b01",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u04",
      "originalNo": 1
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "element": "E1",
      "type": "T03",
      "concept": "화산 분출물과 그 상태",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "화산이 분출할 때 나오는 물질 중 기체는 ( ① ), 액체는 ( ② )이에요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "화산 가스",
          "accepted": [
            "화산 가스",
            "화산가스"
          ]
        },
        {
          "answer": "용암",
          "accepted": [
            "용암"
          ]
        }
      ]
    },
    "explanation": "화산 가스는 대부분 수증기이고, 화산재와 화산 암석 조각은 고체예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-theory-4-2-2-pages21-26",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-b02",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u04",
      "originalNo": 2
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "element": "E2",
      "type": "T05",
      "concept": "화성암이 만들어지는 곳과 알갱이 크기",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "마그마가 땅 위에서 빨리 식으면 알갱이가 작은 ( ① ), 땅속에서 천천히 식으면 알갱이가 큰 ( ② )이 돼요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "현무암",
          "accepted": [
            "현무암"
          ]
        },
        {
          "answer": "화강암",
          "accepted": [
            "화강암"
          ]
        }
      ]
    },
    "explanation": "식는 빠르기에 따라 알갱이 크기가 달라져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-theory-4-2-2-pages21-26",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-b03",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u04",
      "originalNo": 3
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "element": "E4",
      "type": "T07",
      "concept": "지진 발생 모형실험",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "지층이 양쪽에서 미는 힘을 받아 물결처럼 휘어진 것을 ( ① ), 끊어져 어긋난 것을 ( ② )이라고 해요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "습곡",
          "accepted": [
            "습곡"
          ]
        },
        {
          "answer": "단층",
          "accepted": [
            "단층"
          ]
        }
      ]
    },
    "explanation": "우드락 모형에서도 휘어짐과 끊어짐을 볼 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-theory-4-2-2-pages21-26",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-b04",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u04",
      "originalNo": 4
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "element": "E4",
      "type": "T08",
      "concept": "지진의 뜻과 일어나는 까닭",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "땅속 지층이 큰 힘을 받아 끊어지면서 땅이 흔들리는 것을 ( ① )이라고 해요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "지진",
          "accepted": [
            "지진"
          ]
        }
      ]
    },
    "explanation": "지층에 쌓인 힘이 한꺼번에 풀리며 땅이 흔들려요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-theory-4-2-2-pages21-26",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-b05",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u04",
      "originalNo": 5
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "element": "E4",
      "type": "T07",
      "concept": "지진 발생 모형실험",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "겹친 우드락을 미는 힘에 따른 변화를 골라 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "table-fill",
    "answerContract": {
      "type": "table-fill",
      "rowHead": "미는 힘",
      "columns": [
        "우드락의 변화"
      ],
      "options": {
        "우드락의 변화": [
          "조금 휘어진다",
          "크게 휘어진다",
          "끊어지며 떨린다"
        ]
      },
      "rows": [
        {
          "label": "약하게 민다",
          "answer": [
            "조금 휘어진다"
          ]
        },
        {
          "label": "세게 민다",
          "answer": [
            "크게 휘어진다"
          ]
        },
        {
          "label": "끊어질 때까지 민다",
          "answer": [
            "끊어지며 떨린다"
          ]
        }
      ]
    },
    "explanation": "처음에는 휘어지다가 더 세게 밀면 끊어지면서 떨려요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-theory-4-2-2-pages21-26",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-b06",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u04",
      "originalNo": 6
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "element": "E5",
      "type": "T09",
      "concept": "지진의 세기(규모)와 피해",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "지진의 세기를 숫자로 나타낸 것으로, 숫자가 클수록 강한 지진인 것은?",
    "givens": null,
    "choices": [
      "진도",
      "규모",
      "지진대",
      "습곡",
      "단층"
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
    "explanation": "규모는 지진의 세기, 진도는 어느 곳의 피해 정도를 나타내요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-theory-4-2-2-pages21-26",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-b07",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u04",
      "originalNo": 7
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "element": "E4",
      "type": "T07",
      "concept": "지진 발생 모형실험",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "우드락이 끊어질 때 손에 떨림이 느껴진 것과 실제 지진을 비교해 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "우드락이 끊어질 때 손이 떨리는 것처럼, 땅속 지층이 큰 힘을 받아 끊어지면 땅이 흔들려 지진이 일어난다.",
      "rubric": {
        "required": [
          "지층이 힘을 받아 끊어짐",
          "땅이 흔들림(지진)"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "쌓였던 힘이 끊어지는 순간 한꺼번에 풀려요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-theory-4-2-2-pages21-26",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-b08",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u04",
      "originalNo": 8
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "element": "E4",
      "type": "T07",
      "concept": "지진 발생 모형실험",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "우드락 모형과 실제 지층의 다른 점을 두 가지 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "우드락은 손의 작은 힘을 짧은 시간 받지만, 실제 지층은 지구 내부의 큰 힘을 오랜 시간 받는다.",
      "rubric": {
        "required": [
          "힘의 크기",
          "힘을 받는 시간"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "모형은 원리만 보여 줘요. 실제 지층은 단단한 암석이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-theory-4-2-2-pages21-26",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-b09",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u04",
      "originalNo": 9
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "element": "E6",
      "type": "T11",
      "concept": "지진이 났을 때와 난 뒤의 대처",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "지진이 났을 때 교실에서 해야 할 일을 두 가지 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "책상 아래로 들어가 머리를 보호하고, 흔들림이 멈추면 계단으로 운동장처럼 넓은 곳에 대피한다.",
      "rubric": {
        "required": [
          "머리 보호",
          "흔들림이 멈춘 뒤 넓은 곳으로 대피"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "흔들릴 때 밖으로 뛰어나가거나 엘리베이터를 타지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-theory-4-2-2-pages21-26",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-b10",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u04",
      "originalNo": 10
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "element": "E2",
      "type": "T04",
      "concept": "화강암과 현무암의 특징과 쓰임",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "현무암의 특징으로 알맞은 것은?",
    "givens": null,
    "choices": [
      "알갱이가 커서 눈으로 잘 보인다",
      "밝은 색이고 반짝이는 알갱이가 많다",
      "어두운 색이고 알갱이가 매우 작다",
      "땅속 깊은 곳에서 천천히 식었다",
      "물에 잘 녹아 없어진다"
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
    "explanation": "현무암은 땅 위에서 빨리 식어 알갱이가 작고 색이 어두워요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-theory-4-2-2-pages21-26",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-b11",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u04",
      "originalNo": 11
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "element": "E4",
      "type": "T08",
      "concept": "지진의 뜻과 일어나는 까닭",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "태평양 둘레를 따라 띠 모양으로 나타나며 지진이 가장 많이 일어나는 곳은?",
    "givens": null,
    "choices": [
      "환태평양 지진대",
      "알프스-히말라야 지진대",
      "중앙 해령 지진대",
      "한반도 지진대",
      "남극 지진대"
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
    "explanation": "세계 지진의 대부분이 환태평양 지진대에서 일어나요. 화산대와도 거의 겹쳐요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-theory-4-2-2-pages21-26",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-b12",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u04",
      "originalNo": 12
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "element": "E6",
      "type": "T10",
      "concept": "지진에 미리 대비하기",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "지진 피해를 줄이는 방법으로 알맞지 않은 것은?",
    "givens": null,
    "choices": [
      "내진 설계로 건물을 짓는다",
      "무거운 물건은 아래쪽에 둔다",
      "비상식량을 미리 준비한다",
      "흔들릴 때 엘리베이터를 탄다",
      "넓은 대피 장소를 미리 알아 둔다"
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
    "explanation": "흔들릴 때 엘리베이터는 멈출 수 있어 위험해요. 계단을 이용해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-theory-4-2-2-pages21-26",
        "science",
        "answer"
      ]
    }
  }
];
