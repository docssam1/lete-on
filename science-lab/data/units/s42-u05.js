export const unit = {
  "id": "s42-u05",
  "course": "4-2",
  "no": 5,
  "title": "물의 여행",
  "domain": "지구",
  "sources": {
    "theory": [
      "4-1-2 이론 교사 PDF Ⅶ 물의 순환 (비공개 원본)"
    ],
    "lab": [
      "6-B 실험 교사 PDF 17–24쪽 컵 속에 내리는 비 · 3-C 25–32쪽 우량계 만들기 (비공개 원본)"
    ]
  }
};
export const items = [
  {
    "id": "s42-u05-b01",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 1
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u05",
      "element": "E1",
      "type": "T01",
      "concept": "물이 있는 곳과 물의 상태",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "바다·강·호수의 물은 ( ① ) 상태, 공기 속에 섞인 눈에 보이지 않는 물은 ( ② ) 상태예요. 빙하의 물은 고체 상태예요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "액체",
          "accepted": [
            "액체"
          ]
        },
        {
          "answer": "기체",
          "accepted": [
            "기체",
            "수증기"
          ]
        }
      ]
    },
    "explanation": "물은 있는 곳에 따라 고체·액체·기체로 모습을 바꾸어요. 공기 속 기체 상태의 물이 수증기예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-6-B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u05-b02",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 2
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u05",
      "element": "E2",
      "type": "T03",
      "concept": "증발과 응결",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "바닷물이 햇빛을 받아 수증기로 변하는 것을 ( ① ), 수증기가 차가워져 물방울로 변하는 것을 ( ② )이라고 해요.",
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
          "answer": "응결",
          "accepted": [
            "응결"
          ]
        }
      ]
    },
    "explanation": "수조 모형에서는 전등이 증발을, 차가운 뚜껑이 응결을 도와요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-6-B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u05-b03",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 3
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u05",
      "element": "E1",
      "type": "T02",
      "concept": "물의 순환 과정",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "구름 속 작은 물방울이 모여 커지고 무거워지면 ( ① )나 눈이 되어 땅으로 내려요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "비",
          "accepted": [
            "비"
          ]
        }
      ]
    },
    "explanation": "수조 뚜껑 아래 물방울도 커지면 떨어졌어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-6-B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u05-b04",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 4
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u05",
      "element": "E1",
      "type": "T02",
      "concept": "물의 순환 과정",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "물이 상태를 바꾸며 바다·공기·땅 사이를 끊임없이 돌고 도는 것을 물의 ( ① )이라고 해요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "순환",
          "accepted": [
            "순환"
          ]
        }
      ]
    },
    "explanation": "물은 사라지지 않고 모습과 있는 곳만 바뀌어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-6-B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u05-b05",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 5
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u05",
      "element": "E2",
      "type": "T04",
      "concept": "물의 순환 모형과 실제",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "수조 모형의 각 부분이 실제 지구에서 무엇을 나타내는지 골라 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "table-fill",
    "answerContract": {
      "type": "table-fill",
      "rowHead": "수조 모형",
      "columns": [
        "실제 지구"
      ],
      "options": {
        "실제 지구": [
          "햇빛",
          "하늘 높은 곳의 찬 공기",
          "비"
        ]
      },
      "rows": [
        {
          "label": "전등",
          "answer": [
            "햇빛"
          ]
        },
        {
          "label": "뚜껑 위 얼음",
          "answer": [
            "하늘 높은 곳의 찬 공기"
          ]
        },
        {
          "label": "뚜껑에서 떨어지는 물방울",
          "answer": [
            "비"
          ]
        }
      ]
    },
    "explanation": "전등은 물을 데우는 햇빛, 얼음은 수증기를 식히는 높은 하늘의 찬 공기, 떨어지는 물방울은 비예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-6-B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u05-b06",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 6
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u05",
      "element": "E2",
      "type": "T03",
      "concept": "증발과 응결",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "수조 모형에서 뚜껑 아래에 물방울이 맺힌 까닭은?",
    "givens": null,
    "choices": [
      "바닷물이 뚜껑까지 튀어 올라서",
      "수증기가 차가운 뚜껑에서 식어서",
      "전등에서 물이 새어 나와서",
      "얼음이 녹아 뚜껑을 뚫고 들어와서",
      "나무가 뚜껑에 물을 뿌려서"
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
    "explanation": "증발한 수증기가 차가운 뚜껑 근처에서 식어 물방울로 응결했어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-6-B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u05-b07",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 7
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u05",
      "element": "E2",
      "type": "T04",
      "concept": "물의 순환 모형과 실제",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "수조 모형과 실제 지구의 물의 순환을 비교해 같은 점과 다른 점을 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "둘 다 물이 증발하고 응결해 비가 되어 돌고 돌지만, 실제 지구는 훨씬 넓고 오랜 시간에 걸쳐 일어난다.",
      "rubric": {
        "required": [
          "물이 증발·응결하며 돈다",
          "크기나 시간이 다르다"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "모형은 원리를 보여 줘요. 실제 하늘에는 뚜껑이 없고, 높이 올라갈수록 공기가 차가워져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-6-B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u05-b08",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 8
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u05",
      "element": "E1",
      "type": "T02",
      "concept": "물의 순환 과정",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "바다의 물 한 방울이 다시 바다로 돌아오기까지의 여행을 순서대로 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "바닷물이 증발해 수증기가 되고, 높은 곳에서 응결해 구름이 되었다가 비로 내려 강을 따라 다시 바다로 간다.",
      "rubric": {
        "required": [
          "증발해 수증기가 됨",
          "응결해 구름·비가 됨",
          "강을 따라 바다로 돌아옴"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "땅에 내린 물은 강물이나 지하수가 되어 바다로 가요. 식물을 거쳐 공기로 나가기도 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-6-B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u05-b09",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 9
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u05",
      "element": "E3",
      "type": "T06",
      "concept": "물 부족과 해결 방법",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "물 부족 문제를 해결하기 위해 우리가 할 수 있는 일을 두 가지 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "양치할 때 컵을 쓰는 것처럼 물을 아껴 쓰고, 빗물을 모아 화단에 주는 것처럼 물을 다시 쓴다.",
      "rubric": {
        "required": [
          "물을 아껴 씀",
          "빗물을 모으거나 물을 다시 씀"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "새는 수도꼭지 고치기, 설거지물 받아 쓰기도 좋아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-6-B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u05-b10",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 10
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u05",
      "element": "E1",
      "type": "T01",
      "concept": "물이 있는 곳과 물의 상태",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "지구에 있는 물 중 가장 많은 양이 있는 곳은?",
    "givens": null,
    "choices": [
      "빙하",
      "지하수",
      "바다",
      "강과 호수",
      "구름"
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
    "explanation": "지구 물의 대부분(약 97%)은 짠 바닷물이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-6-B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u05-b11",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 11
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u05",
      "element": "E3",
      "type": "T05",
      "concept": "물의 이용과 중요성",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "물의 순환이 주는 이로움으로 알맞은 것은?",
    "givens": null,
    "choices": [
      "쓸 수 있는 민물이 다시 채워진다",
      "바다의 물이 해마다 조금씩 사라진다",
      "지구의 물의 양이 해마다 늘어난다",
      "구름이 생기지 않게 된다",
      "강물이 한 곳에만 머문다"
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
    "explanation": "바닷물이 증발해 비로 내리면 짜지 않은 민물이 되어 강과 땅을 채워요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-6-B-pages17-24",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u05-b12",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 12
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구",
      "area": "지구",
      "course": "4-2",
      "grade": 4,
      "semester": 2,
      "unit": "u05",
      "element": "E3",
      "type": "T06",
      "concept": "물 부족과 해결 방법",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "물 부족을 해결하는 방법으로 알맞지 않은 것은?",
    "givens": null,
    "choices": [
      "빗물 저금통에 빗물을 모은다",
      "바닷물을 민물로 바꾸어 쓴다",
      "양치할 때 컵에 물을 받아서 쓴다",
      "물을 틀어 둔 채 설거지를 한다",
      "새는 수도꼭지를 고친다"
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
    "explanation": "물을 틀어 둔 채 설거지를 하면 물이 낭비돼요. 받아서 써요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-05",
      "gates": [
        "source-lab-6-B-pages17-24",
        "science",
        "answer"
      ]
    }
  }
];
