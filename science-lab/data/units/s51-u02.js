export const unit = {
  "id": "s51-u02",
  "course": "5-1",
  "no": 2,
  "title": "온도와 열",
  "domain": "물리",
  "sources": {
    "theory": [
      "4-2-2 이론 교사 PDF Ⅴ 열 전달 (비공개 원본)"
    ],
    "lab": [
      "4-D 실험 교사 PDF 1~16쪽 눈에 보이는 열 · 물과 공기에서의 대류 (비공개 원본)"
    ]
  }
};
export const items = [
  {
    "id": "s51-u02-b01",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 1
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u02",
      "element": "E1",
      "type": "T02",
      "concept": "온도가 다른 물체 사이의 열 이동",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "온도가 다른 두 물체가 맞닿으면 열은 온도가 ( ① ) 곳에서 ( ② ) 곳으로 이동해요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "높은",
          "accepted": [
            "높은"
          ]
        },
        {
          "answer": "낮은",
          "accepted": [
            "낮은"
          ]
        }
      ]
    },
    "explanation": "두 물체의 온도가 같아지면 열은 더 이동하지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-lab-4-D-pages1-16",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u02-b02",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 2
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u02",
      "element": "E2",
      "type": "T03",
      "concept": "고체에서의 열 이동(전도)",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "고체에서 열이 물체를 따라 이동하는 것을 ( ① ), 액체나 기체가 직접 움직이며 열을 옮기는 것을 ( ② )라고 해요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "전도",
          "accepted": [
            "전도"
          ]
        },
        {
          "answer": "대류",
          "accepted": [
            "대류"
          ]
        }
      ]
    },
    "explanation": "시온 스티커 띠는 전도, 빨간 물이 올라간 병은 대류예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-lab-4-D-pages1-16",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u02-b03",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 3
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u02",
      "element": "E1",
      "type": "T01",
      "concept": "온도와 온도계",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "물체가 차갑거나 따뜻한 정도를 숫자로 나타낸 것을 ( ① )라고 하고, 단위는 ℃(섭씨도)를 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "온도",
          "accepted": [
            "온도"
          ]
        }
      ]
    },
    "explanation": "느낌은 사람마다 달라서 온도계로 재요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-lab-4-D-pages1-16",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u02-b04",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 4
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u02",
      "element": "E2",
      "type": "T04",
      "concept": "물질에 따른 열 전달 빠르기와 단열",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "두 물체 사이에서 열이 잘 이동하지 않게 막는 것을 ( ① )이라고 해요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "단열",
          "accepted": [
            "단열"
          ]
        }
      ]
    },
    "explanation": "보온병·아이스박스·겨울옷이 단열을 이용해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-lab-4-D-pages1-16",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u02-b05",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 5
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u02",
      "element": "E2",
      "type": "T04",
      "concept": "물질에 따른 열 전달 빠르기와 단열",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "시온 스티커를 붙인 띠를 뜨거운 물에 함께 담갔을 때, 열이 전달되는 빠르기를 골라 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "table-fill",
    "answerContract": {
      "type": "table-fill",
      "rowHead": "띠",
      "columns": [
        "열이 전달되는 빠르기"
      ],
      "options": {
        "열이 전달되는 빠르기": [
          "가장 빠르다",
          "중간이다",
          "가장 느리다"
        ]
      },
      "rows": [
        {
          "label": "구리 테이프",
          "answer": [
            "가장 빠르다"
          ]
        },
        {
          "label": "알루미늄 테이프",
          "answer": [
            "중간이다"
          ]
        },
        {
          "label": "OHP 필름",
          "answer": [
            "가장 느리다"
          ]
        }
      ]
    },
    "explanation": "구리 → 알루미늄 순으로 색이 위로 올라갔고, OHP 필름은 물에 잠긴 곳만 변했어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-lab-4-D-pages1-16",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u02-b06",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 6
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u02",
      "element": "E2",
      "type": "T03",
      "concept": "고체에서의 열 이동(전도)",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "고체에서 열이 이동하는 방향으로 알맞은 것은?",
    "givens": null,
    "choices": [
      "온도가 낮은 곳에서 높은 곳으로",
      "온도가 높은 곳에서 낮은 곳으로",
      "언제나 위에서 아래로",
      "언제나 아래에서 위로",
      "이동하지 않는다"
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
    "explanation": "열은 언제나 온도가 높은 곳에서 낮은 곳으로 이동해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-lab-4-D-pages1-16",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u02-b07",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 7
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u02",
      "element": "E2",
      "type": "T03",
      "concept": "고체에서의 열 이동(전도)",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "뜨거운 물에 담근 구리 띠의 시온 스티커가 아래 칸부터 차례로 변한 까닭을 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "열이 온도가 높은 물에 잠긴 아래쪽에서 온도가 낮은 위쪽으로 구리 띠를 따라 이동(전도)하기 때문이다.",
      "rubric": {
        "required": [
          "열이 높은 곳에서 낮은 곳으로",
          "띠(고체)를 따라 이동(전도)"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "물에 가까운 칸부터 데워져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-lab-4-D-pages1-16",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u02-b08",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 8
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u02",
      "element": "E2",
      "type": "T04",
      "concept": "물질에 따른 열 전달 빠르기와 단열",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "냄비의 몸체는 금속으로, 손잡이는 플라스틱이나 나무로 만드는 까닭을 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "금속은 열을 빠르게 전달해 음식을 빨리 데우고, 플라스틱이나 나무는 열을 느리게 전달해 손이 뜨겁지 않게 하기 때문이다.",
      "rubric": {
        "required": [
          "금속은 열을 빠르게 전달",
          "플라스틱·나무는 느리게 전달해 손을 보호"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "열이 잘 이동해야 할 곳과 막아야 할 곳의 재료가 달라요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-lab-4-D-pages1-16",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u02-b09",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 9
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u02",
      "element": "E3",
      "type": "T06",
      "concept": "기체의 대류와 생활",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "추운 겨울 교실의 온풍기는 바닥 쪽에 두는 것이 좋은 까닭을 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "데워진 공기는 위로 올라가고 찬 공기는 아래로 내려오며 대류가 일어나 교실 전체가 고르게 따뜻해지기 때문이다.",
      "rubric": {
        "required": [
          "따뜻한 공기는 위로",
          "대류로 전체가 따뜻해짐"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "에어컨은 반대로 위쪽에 달아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-lab-4-D-pages1-16",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u02-b10",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 10
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u02",
      "element": "E1",
      "type": "T01",
      "concept": "온도와 온도계",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "온도를 재는 방법으로 알맞은 것은?",
    "givens": null,
    "choices": [
      "손으로 오래 만져 본 느낌으로 숫자를 정한다",
      "눈으로 보고 대강 어림해서 정한다",
      "알맞은 온도계로 재어 ℃로 나타낸다",
      "냄새를 맡아 보고 정한다",
      "소리를 들어 보고 정한다"
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
    "explanation": "사람의 느낌은 정확하지 않아요. 재는 대상에 맞는 온도계를 써요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-lab-4-D-pages1-16",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u02-b11",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 11
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u02",
      "element": "E3",
      "type": "T05",
      "concept": "액체에서의 열 이동(대류)",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "물이 든 냄비를 아래에서 가열할 때 물의 움직임으로 알맞은 것은?",
    "givens": null,
    "choices": [
      "데워진 물이 위로 올라간다",
      "데워진 물은 바닥으로만 가라앉는다",
      "물은 전혀 움직이지 않는다",
      "찬물만 위로 솟아오른다",
      "위쪽 물부터 먼저 뜨거워진다"
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
    "explanation": "데워진 물은 위로, 위의 찬물은 아래로 — 대류예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-lab-4-D-pages1-16",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u02-b12",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-2",
      "unit": "u05",
      "originalNo": 12
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물리",
      "area": "물리",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u02",
      "element": "E3",
      "type": "T06",
      "concept": "기체의 대류와 생활",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "에어컨을 방의 위쪽에 다는 까닭은?",
    "givens": null,
    "choices": [
      "찬 공기는 위로 올라가기 때문에",
      "에어컨은 무거워서 바닥에 둘 수 없기 때문에",
      "바닥이 더 따뜻하기 때문에",
      "찬 공기가 아래로 내려오기 때문에",
      "위쪽이 더 조용하기 때문에"
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
    "explanation": "위에서 나온 찬 공기가 내려오며 방 전체가 시원해져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-07",
      "gates": [
        "source-lab-4-D-pages1-16",
        "science",
        "answer"
      ]
    }
  }
];
