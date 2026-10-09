// 4-2 Ⅲ 그림자와 거울 — 유사문항 70 (창작). 원문 1문항당 1개, 같은 유형·난이도로 상황과 물체를 바꿨다. of = 짝이 되는 원문 (세트, 번호).
export const similar = [
  {
    "id": "s42-u03-v001",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 1
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "밤에 가로등 아래를 걸으면 내 몸이 가로등 빛을 막아서, 몸을 사이에 두고 가로등 반대쪽 땅에 빛이 닿지 않는 어두운 부분이 생겨요. 이 어두운 부분을 무엇이라고 하는지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "그림자",
      "accepted": [
        "그림자",
        "그림자예요",
        "그림자입니다"
      ]
    },
    "explanation": "빛이 나아가다 몸에 막히면 몸 뒤쪽에 빛이 닿지 않아 어두운 그림자가 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v002",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 2
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "그림자가 생기는 조건에 대한 설명으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 빛이 없는 깜깜한 방에서는 그림자가 생기지 않아요.",
        "ㄴ. 빛을 막는 물체가 있어야 그림자가 생겨요.",
        "ㄷ. 그림자는 물체를 사이에 두고 빛의 반대쪽에 생겨요.",
        "ㄹ. 벽-손전등-인형 순서로 놓고 손전등으로 인형을 비추면 벽에 인형의 그림자가 생겨요."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄹ",
      "accepted": [
        "ㄹ"
      ]
    },
    "explanation": "벽-손전등-인형 순서로 놓으면 손전등이 벽을 등지고 인형을 비추므로 그림자는 인형 너머에 생기고 벽에는 생기지 않아요. 벽-인형-손전등 순서여야 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v003",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 3
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "책상 위에 컵을 놓고 손전등으로 비추었더니 컵의 그림자가 컵의 왼쪽에 생겼어요. 손전등은 컵의 어느 쪽에서 빛을 비추었을지 ( 왼쪽, 오른쪽 ) 중에서 골라 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "오른쪽",
      "accepted": [
        "오른쪽",
        "오른쪽에서",
        "오른쪽이요",
        "오른쪽에서 비추었어요"
      ]
    },
    "explanation": "그림자는 물체를 사이에 두고 빛의 반대쪽에 생겨요. 그림자가 왼쪽에 생겼으니 빛은 오른쪽에서 비추었어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v004",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 4
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "주방에서 쓰는 투명한 비닐봉지에 손전등 빛을 비추었을 때 생기는 그림자에 대한 설명으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 진하고 선명한 그림자가 생겨요.",
        "ㄴ. 그림자가 전혀 생기지 않아요.",
        "ㄷ. 연하고 흐릿한 그림자가 생겨요."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ",
        "연하고 흐릿한 그림자가 생겨요"
      ]
    },
    "explanation": "투명한 비닐봉지는 빛이 대부분 통과해서 연하고 흐릿한 그림자가 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v005",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 5
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "손전등 빛을 비추어 그림자를 만들 때 그림자의 진하기가 나머지 넷과 다른 것을 고르세요.",
    "givens": null,
    "choices": [
      "모자",
      "우산",
      "공책",
      "맑은 유리병",
      "나무 의자"
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
    "explanation": "맑은 유리병은 빛이 대부분 통과하는 투명한 물체라서 연한 그림자가 생겨요. 나머지는 빛이 통과하지 못해 진한 그림자가 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v006",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 6
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "별 모양으로 오린 두꺼운 종이를 손전등과 스크린 사이에 세우고 손전등 빛을 비추었어요. 스크린에 생긴 그림자의 모양은 어떠한지 쓰고, 그렇게 생기는 까닭을 빛의 성질과 관련지어 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "별 모양 종이와 비슷한 별 모양의 그림자가 생겨요. 빛이 곧게 나아가다가(빛의 직진) 종이에 막힌 부분에만 빛이 닿지 않기 때문이에요.",
      "rubric": {
        "required": [
          "별 모양 종이와 비슷한 별 모양 그림자가 생긴다",
          "빛이 곧게 나아가기(직진하기) 때문이다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "빛은 곧게 나아가기 때문에 종이에 막힌 부분만 어두워져 물체와 비슷한 모양의 그림자가 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v007",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 7
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물체와 그림자에 대한 설명으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 빛이 곧게 나아가기 때문에 그림자는 물체와 비슷한 모양으로 생겨요.",
        "ㄴ. 같은 컵이라도 옆에서 비출 때와 위에서 비출 때 그림자 모양이 달라요.",
        "ㄷ. 손전등 두 개로 한 물체를 비추면 그림자가 두 개 생길 수 있어요.",
        "ㄹ. 물체 하나는 어느 방향에서 빛을 비추어도 언제나 같은 모양의 그림자만 생겨요."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄹ",
      "accepted": [
        "ㄹ"
      ]
    },
    "explanation": "같은 물체라도 놓는 방향이나 빛을 비추는 방향이 바뀌면 그림자의 모양이 달라질 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v008",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 8
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E4",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "손전등과 스크린 사이에 종이 인형을 세워 그림자를 만들었어요. 인형과 스크린은 그대로 두고 손전등을 인형에서 멀어지게 옮기면 그림자의 크기는 어떻게 될지 ( 커진다, 작아진다 ) 중에서 골라 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "작아진다",
      "accepted": [
        "작아진다",
        "작아져요",
        "작아집니다",
        "작아짐",
        "작아"
      ]
    },
    "explanation": "물체와 스크린을 그대로 둘 때 손전등과 물체 사이의 거리가 멀어지면 그림자가 작아져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v009",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 9
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E4",
      "type": "T09",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "손전등과 스크린 사이에 종이 나비를 세워 그림자를 만들었어요. 손전등과 스크린은 그대로 두고 그림자를 더 작게 만들려면 종이 나비를 어떻게 옮겨야 하는지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "종이 나비를 스크린 쪽으로 옮겨 손전등에서 멀어지게 해요.",
      "rubric": {
        "required": [
          "종이 나비를 옮긴다",
          "스크린 쪽으로(손전등에서 멀어지게) 옮긴다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "손전등과 스크린을 그대로 두고 물체를 손전등에서 멀게(스크린에 가깝게) 하면 그림자가 작아져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v010",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 10
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "벽시계를 거울에 비추어 보았어요. 실제 시계에서 숫자 3은 시계의 오른쪽에 있어요. 거울에 비친 시계에서 숫자 3은 어느 쪽에 보이는지 고르세요.",
    "givens": null,
    "choices": [
      "오른쪽",
      "왼쪽",
      "위쪽",
      "아래쪽",
      "보이지 않음"
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
    "explanation": "거울에 비친 모습은 위아래는 그대로이고 좌우가 바뀌어 보여요. 그래서 오른쪽의 3이 왼쪽에 보여요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v011",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 11
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E5",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "종이에 「우리」라고 쓴 뒤 세워 둔 거울에 비추어 보았어요. 거울에 비친 글자는 실제 글자와 비교해 무엇이 바뀌어 보이는지 ( 위아래, 좌우 ) 중에서 골라 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "좌우",
      "accepted": [
        "좌우",
        "좌우가 바뀌어요",
        "좌우가",
        "왼쪽과 오른쪽",
        "왼쪽 오른쪽"
      ]
    },
    "explanation": "거울에 비친 글자는 위아래는 그대로이고 좌우가 바뀌어 보여요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v012",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 12
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "소방차 앞부분에 「소방」이라는 글자를 좌우로 바꾸어 쓴 까닭이에요. 괄호 ㉠과 ㉡에 들어갈 알맞은 말을 골라 각각 쓰세요.",
    "givens": {
      "지문": "앞에 가는 자동차의 운전자가 ㉠( 앞유리, 뒷거울 )(으)로 소방차를 보면 거울에 비친 글자는 ㉡( 위아래, 좌우 )가 바뀌어 보이므로 글자가 바르게 읽혀요."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-뒷거울, ㉡-좌우",
      "accepted": [
        "㉠-뒷거울, ㉡-좌우",
        "㉠ 뒷거울, ㉡ 좌우",
        "㉠ 뒷거울 ㉡ 좌우",
        "뒷거울, 좌우",
        "뒷거울,좌우",
        "뒷거울 좌우"
      ]
    },
    "explanation": "앞차 운전자가 뒷거울로 소방차를 보면 거울에 비친 글자의 좌우가 바뀌어 보이므로, 미리 좌우를 바꾸어 쓴 글자가 바르게 읽혀요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v013",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 13
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "어두운 방에서 벽에 붙인 거울을 향해 손전등 빛을 비스듬히 비추었더니, 손전등이 비춘 쪽이 아닌 다른 쪽 벽에 밝은 빛이 비쳤어요. 이 까닭으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "빛이 거울을 그대로 통과해 벽 너머로 나아갔기 때문입니다.",
      "빛이 거울에 흡수되어 거울이 스스로 빛을 냈기 때문입니다.",
      "빛이 거울에 부딪쳐 나아가는 방향이 바뀌었기 때문입니다.",
      "거울이 손전등 빛을 훨씬 밝게 만들어 퍼뜨렸기 때문입니다.",
      "빛이 거울에서 사라지고 다른 빛이 새로 생겼기 때문입니다."
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
    "explanation": "빛은 거울을 통과하지 않고 거울에 부딪쳐 방향을 바꾸어 나아가요. 이것을 빛의 반사라고 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v014",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 14
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "손거울로 햇빛을 받아 그늘진 벽에 빛을 비추는 놀이를 했어요. 벽에 비친 밝은 점을 다른 곳으로 옮기려면 손거울을 기울여 거울이 바라보는 □을(를) 바꾸면 돼요."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "방향",
      "accepted": [
        "방향",
        "거울의 방향",
        "각도",
        "기울기"
      ]
    },
    "explanation": "빛은 거울에 부딪쳐 방향이 바뀌므로, 거울이 바라보는 방향을 바꾸면 빛이 닿는 곳도 옮겨 가요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v015",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 15
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 여러 곳에서 쓰는 거울이에요. 각 거울의 쓰임새를 <보기>에서 골라 기호를 각각 쓰세요.",
    "givens": {
      "지문": "㈎ 무용 연습실의 벽 거울\n㈏ 굽은 길 모퉁이에 세운 거울\n㈐ 옷 가게 탈의실의 거울",
      "보기": [
        "ㄱ. 옷을 입어 본 내 모습을 볼 때 써요.",
        "ㄴ. 춤추는 내 동작이 바른지 볼 때 써요.",
        "ㄷ. 모퉁이 너머에서 오는 차나 사람을 볼 때 써요."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㈎-ㄴ, ㈏-ㄷ, ㈐-ㄱ",
      "accepted": [
        "㈎-ㄴ, ㈏-ㄷ, ㈐-ㄱ",
        "㈎ ㄴ, ㈏ ㄷ, ㈐ ㄱ",
        "㈎ㄴ㈏ㄷ㈐ㄱ",
        "ㄴ, ㄷ, ㄱ",
        "ㄴ,ㄷ,ㄱ",
        "ㄴㄷㄱ",
        "ㄴ ㄷ ㄱ"
      ]
    },
    "explanation": "무용 연습실 거울로는 춤추는 동작을, 굽은 길 모퉁이 거울로는 보이지 않는 쪽에서 오는 차를, 탈의실 거울로는 옷 입은 모습을 봐요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v016",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 1
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "어두운 강당에서 그림자 연극을 하려고 해요. 그림자를 만들기 위해 반드시 있어야 하는 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "흰 천으로 만든 큰 무대 막",
      "빛을 내는 조명",
      "음악을 틀 스피커",
      "빛을 막는 인형",
      "관객이 앉을 의자"
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        3
      ]
    },
    "explanation": "그림자가 생기려면 빛과 빛을 막는 물체가 있어야 해요. 흰 막은 그림자를 잘 보이게 할 뿐 꼭 있어야 하는 것은 아니에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v017",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 2
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "그림자에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "그림자를 만들려면 빛과 빛을 막는 물체가 있어야 합니다.",
      "흰 종이를 대지 않으면 그림자는 아예 생기지 않습니다.",
      "흐린 날보다 해가 쨍쨍한 날 그림자가 또렷하게 보입니다.",
      "그림자는 물체를 사이에 두고 빛의 반대쪽에 생깁니다.",
      "흰 벽에 비추면 그림자의 모양을 더 잘 볼 수 있습니다."
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
    "explanation": "흰 종이나 흰 벽은 그림자를 잘 보이게 해 줄 뿐이에요. 흰 종이가 없어도 빛과 물체가 있으면 그림자는 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v018",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 3
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "그림자가 생기는 경우를 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 불을 모두 끈 깜깜한 방에서 손을 흔들 때",
        "ㄴ. 손전등을 켜고 벽 앞에서 손을 비출 때",
        "ㄷ. 해가 비치는 날 큰 건물의 그늘 속에 서 있을 때"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "그림자가 생기려면 빛이 물체를 비추고 있어야 해요. 깜깜한 방이나 커다란 그늘 속에서는 내 몸에 빛이 비치지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v019",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 4
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "나무 블록과 투명한 플라스틱 블록에 각각 손전등 빛을 비추고 스크린에 생긴 그림자를 관찰했어요. 결과로 옳은 것을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "보기": [
        "ㄱ. 나무 블록은 진하고 선명한 그림자가 생겨요.",
        "ㄴ. 나무 블록은 연하고 흐릿한 그림자가 생겨요.",
        "ㄷ. 플라스틱 블록은 진하고 선명한 그림자가 생겨요.",
        "ㄹ. 플라스틱 블록은 연하고 흐릿한 그림자가 생겨요."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ, ㄹ",
      "accepted": [
        "ㄱ, ㄹ",
        "ㄱ,ㄹ",
        "ㄹ, ㄱ",
        "ㄹ,ㄱ",
        "ㄱㄹ",
        "ㄹㄱ",
        "ㄱ ㄹ"
      ]
    },
    "explanation": "나무 블록은 빛이 통과하지 못해 진하고 선명한 그림자가, 투명한 플라스틱 블록은 빛이 대부분 통과해 연하고 흐릿한 그림자가 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v020",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 5
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "공책과 투명 필름에 각각 손전등 빛을 비추었더니 공책은 진한 그림자가, 투명 필름은 연한 그림자가 생겼어요. 두 물체에서 빛이 통과하는 정도를 비교하여 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "공책은 불투명해서 빛이 거의 통과하지 못하고, 투명 필름은 투명해서 빛이 대부분 통과해요.",
      "rubric": {
        "required": [
          "공책은 빛이 (거의) 통과하지 못한다",
          "투명 필름은 빛이 대부분 통과한다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "불투명한 공책은 빛이 거의 통과하지 못해 진한 그림자가, 투명 필름은 빛이 대부분 통과해 연한 그림자가 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v021",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 6
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "그림자의 진하기에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "빛이 물체를 통과하는 정도에 따라 그림자의 진하기가 달라집니다.",
      "투명한 플라스틱 컵은 연하고 흐릿한 그림자가 생깁니다.",
      "두꺼운 나무판은 빛이 통과하지 못해 진한 그림자가 생깁니다.",
      "유리병은 빛을 모두 막아 진하고 선명한 그림자가 생깁니다.",
      "불투명한 물체일수록 그림자를 더 또렷하게 볼 수 있습니다."
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
    "explanation": "투명한 유리병은 빛이 대부분 통과해서 연하고 흐릿한 그림자가 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v022",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 7
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "숲속에서 나뭇잎 사이로 햇빛이 들어올 때 빛줄기가 휘지 않고 곧은 줄처럼 보여요. 이처럼 빛이 곧게 나아가는 성질을 빛의 □(이)라고 해요."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "직진",
      "accepted": [
        "직진",
        "빛의 직진",
        "직진성",
        "직진해요"
      ]
    },
    "explanation": "빛이 휘지 않고 곧게 나아가는 성질을 빛의 직진이라고 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v023",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 8
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "스크린, 「ㅗ」자 모양으로 자른 두꺼운 종이, 손전등을 차례로 놓고 손전등을 켰어요. 스크린에 생기는 그림자의 모양으로 알맞은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 「ㅗ」자 모양",
        "ㄴ. 「ㅜ」자 모양",
        "ㄷ. 「ㅡ」자 모양",
        "ㄹ. 동그라미 모양"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ",
        "ㅗ자 모양",
        "「ㅗ」자 모양"
      ]
    },
    "explanation": "빛이 곧게 나아가다 종이에 막히므로 종이와 비슷한 「ㅗ」자 모양의 그림자가 생겨요. 위아래가 뒤집히지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v024",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 9
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "스크린 앞에 컵을 세워 놓고 손전등으로 비추어 그림자를 만들었어요. 스크린에 생기는 그림자의 모양을 바꿀 수 있는 방법으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "손전등 빛을 더 밝게 합니다.",
      "스크린을 더 큰 것으로 바꿉니다.",
      "컵을 눕혀서 놓는 방향을 바꿉니다.",
      "빨간 셀로판지를 손전등에 붙입니다.",
      "모양이 같은 다른 색 컵으로 바꿉니다."
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
    "explanation": "같은 물체라도 놓는 방향이 바뀌면 빛을 받는 면의 모양이 달라져 그림자 모양도 달라져요. 빛의 밝기나 색깔은 모양을 바꾸지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v025",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 10
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "인형 그림자 놀이를 하면서 친구들이 말한 내용이에요. 그림자의 크기 변화에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "손전등과 스크린을 그대로 두고 인형을 손전등에 가깝게 하면 그림자가 커져요.",
      "손전등과 스크린을 그대로 두고 인형을 스크린에 가깝게 하면 그림자가 작아져요.",
      "인형과 스크린을 그대로 두고 손전등을 인형에서 멀게 하면 그림자가 커져요.",
      "인형과 스크린을 그대로 두고 손전등을 인형에 가깝게 하면 그림자가 커져요.",
      "손전등과 인형 사이의 거리에 따라 그림자의 크기가 달라져요."
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
    "explanation": "손전등을 인형에서 멀게 하면 손전등과 인형 사이의 거리가 멀어져 그림자가 작아져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v026",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 11
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "거울 앞에 빨간 모자를 쓰고 왼손에 연필을 든 동생이 서 있어요. 거울에 비친 동생의 모습에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "모자는 실제와 같은 빨간색으로 보입니다.",
      "모자가 파란색으로 바뀌어 보입니다.",
      "연필을 오른손에 든 것처럼 보입니다.",
      "연필을 왼손에 든 것처럼 보입니다.",
      "머리가 아래쪽에 있는 거꾸로 선 모습으로 보입니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "거울에 비친 모습은 색깔은 실제와 같고 좌우가 바뀌어 보여요. 그래서 왼손이 오른손처럼 보여요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v027",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 12
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흰 종이를 깐 책상 위에 거울을 세우고, 손전등 빛을 거울에 비스듬히 비추었어요. 종이 위에 나타난 빛의 길에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "빛의 길이 거울에서 끊겨 더 이상 보이지 않습니다.",
      "빛의 길이 거울을 지나 거울 뒤쪽으로 이어집니다.",
      "빛의 길이 거울 앞에서 여러 갈래로 흩어집니다.",
      "빛의 길이 거울에 닿기 전에 점점 어두워집니다.",
      "빛의 길이 거울에서 꺾여 다른 방향으로 이어집니다."
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
    "explanation": "빛은 거울에 부딪치면 거울을 통과하지 않고 방향이 바뀌어 다른 쪽으로 나아가요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v028",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 13
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "손거울로 햇빛을 받아 그늘진 화분에 빛을 비추어 주었어요. 이때 손거울에서 일어나는 빛의 성질로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "빛의 직진",
      "빛의 반사",
      "빛의 흡수",
      "빛의 흩어짐",
      "빛의 휘어짐"
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
    "explanation": "빛이 거울에 부딪쳐 방향을 바꾸어 나아가는 것을 빛의 반사라고 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v029",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 14
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "우리 생활에서 거울을 이용하는 예로 적절하지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "이를 닦으며 이 사이를 살펴볼 때",
      "운전자가 뒤에 오는 차를 확인할 때",
      "태권도장에서 발차기 자세를 고칠 때",
      "엘리베이터 안에서 옷차림을 볼 때",
      "나뭇잎의 잎맥을 크게 확대해서 볼 때"
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
    "explanation": "작은 것을 크게 확대해서 볼 때는 주로 돋보기를 써요. 나머지는 거울로 내 모습이나 뒤쪽 모습을 보는 예예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v030",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 15
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "긴 통의 위쪽과 아래쪽에 거울을 비스듬히 붙여, 몸을 숨긴 채 담장 너머를 볼 수 있게 만든 도구의 이름으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "잠망경",
      "망원경",
      "만화경",
      "현미경",
      "돋보기"
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
    "explanation": "잠망경은 위쪽 거울에서 반사된 빛이 아래쪽 거울에서 다시 반사되어 눈에 들어오게 만든 도구예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v031",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 1
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 불을 모두 끈 깜깜한 방에서는 [ ]이(가) 없어서 그림자가 생기지 않아요.\n• 손전등으로 [ ]을(를) 물체에 비추면 물체 뒤쪽에 그림자가 생겨요."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "빛",
      "accepted": [
        "빛",
        "빛이요",
        "빛입니다"
      ]
    },
    "explanation": "그림자가 생기려면 빛이 있어야 해요. 빛을 물체에 비추면 물체 뒤쪽에 그림자가 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v032",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 2
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "그림자를 관찰하는 실험에서 물체 뒤쪽에 검은 종이 대신 흰 종이를 세워 두는 까닭을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "흰 종이를 쓰면 빛이 닿은 밝은 부분과 빛이 닿지 않은 그림자가 잘 구별되어 그림자를 더 뚜렷하게 볼 수 있기 때문이에요.",
      "rubric": {
        "required": [
          "그림자를 더 뚜렷하게(잘) 볼 수 있다",
          "밝은 부분과 어두운 그림자가 잘 구별된다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "흰 종이 위에서는 빛이 닿은 밝은 부분과 어두운 그림자가 잘 구별되어 그림자를 뚜렷하게 관찰할 수 있어요. 흰 종이가 없어도 그림자는 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v033",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 3
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "주방에서 쓰는 투명한 비닐 랩을 펼쳐 손전등 빛을 비추었을 때의 결과로 옳은 것을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "보기": [
        "ㄱ. 빛이 거의 통과하지 못해요.",
        "ㄴ. 빛이 대부분 통과해요.",
        "ㄷ. 진하고 선명한 그림자가 생겨요.",
        "ㄹ. 연하고 흐릿한 그림자가 생겨요."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ, ㄹ",
      "accepted": [
        "ㄴ, ㄹ",
        "ㄴ,ㄹ",
        "ㄹ, ㄴ",
        "ㄹ,ㄴ",
        "ㄴㄹ",
        "ㄹㄴ",
        "ㄴ ㄹ"
      ]
    },
    "explanation": "투명한 비닐 랩은 빛이 대부분 통과하기 때문에 연하고 흐릿한 그림자가 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v034",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 4
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빛을 비추었을 때 연하고 흐릿한 그림자가 생기는 것끼리 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "투명 비닐봉지, 맑은 유리컵",
      "공책, 지우개",
      "돋보기 알, 나무젓가락",
      "투명 필름, 도자기 접시",
      "종이컵, 유리창"
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
    "explanation": "연하고 흐릿한 그림자는 빛이 대부분 통과하는 투명한 물체에서 생겨요. 투명 비닐봉지와 맑은 유리컵은 둘 다 투명해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v035",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 5
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "투명한 플라스틱 물병에 불투명한 종이 상표가 빙 둘러 붙어 있어요. 이 물병에 손전등 빛을 비추었을 때 더 진한 그림자가 생기는 부분을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 투명한 플라스틱 부분",
        "ㄴ. 종이 상표 부분"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ",
        "종이 상표",
        "종이 상표 부분",
        "상표",
        "상표 부분"
      ]
    },
    "explanation": "종이 상표는 불투명해서 빛이 통과하지 못해 진한 그림자가 생기고, 투명한 플라스틱 부분은 연한 그림자가 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v036",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 6
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "스크린과 손전등 사이에 하트 모양으로 오린 두꺼운 종이를 세우고 손전등 빛을 비추었어요. 스크린에 생기는 그림자의 모양으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "원 모양",
      "세모 모양",
      "네모 모양",
      "모양이 정해지지 않은 얼룩",
      "하트 모양"
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
    "explanation": "빛이 곧게 나아가다 종이에 막히므로 그림자는 물체와 비슷한 하트 모양으로 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v037",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 7
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "손전등으로 하트 모양 종이를 비추면 스크린에 하트 모양 그림자가 생겨요. 그 까닭으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "빛이 곧게 나아가다가 종이에 막히기 때문입니다.",
      "빛이 종이를 지나며 하트 모양으로 휘어지기 때문입니다.",
      "종이가 빛을 모아 더 밝게 만들기 때문입니다.",
      "빛은 어떤 물체든 그대로 통과하기 때문입니다.",
      "손전등 빛이 어두워서 종이 모양만 남기 때문입니다."
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
    "explanation": "빛은 곧게 나아가므로 종이에 막힌 부분에만 빛이 닿지 않아 종이와 비슷한 모양의 그림자가 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v038",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 8
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "스크린, 별 모양 블록, 손전등을 차례로 놓고 물체와 그림자의 모양을 비교하는 실험을 했어요. 이 실험에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "손전등 빛은 별 모양 블록을 향해 비추어야 합니다.",
      "스크린에 별 모양과 비슷한 그림자가 생깁니다.",
      "블록을 옆으로 눕히면 그림자의 모양이 달라질 수 있습니다.",
      "빛이 블록을 통과하여 블록 뒤쪽이 더 밝아집니다.",
      "그림자가 물체를 닮는 것은 빛이 곧게 나아가기 때문입니다."
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
    "explanation": "빛은 블록을 통과하지 못해요. 빛이 곧게 나아가다 블록에 막힌 부분에 그림자가 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v039",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 9
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "원기둥 모양의 음료 캔을 세워 두고 옆에서 손전등으로 비추면 직사각형 모양의 그림자가 생겨요. 캔을 그대로 세워 둔 채 바로 위에서 아래로 비추면 바닥에 생기는 그림자의 모양으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "직사각형 모양",
      "원 모양",
      "세모 모양",
      "별 모양",
      "그림자가 생기지 않음"
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
    "explanation": "빛을 받는 면의 모양대로 그림자가 생겨요. 위에서 비추면 캔의 둥근 윗면 모양대로 원 모양 그림자가 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v040",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 10
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "스크린과 장난감 로봇은 그대로 두고, 스크린에 생긴 로봇 그림자의 크기를 바꾸는 방법으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "손전등을 로봇 쪽으로 옮깁니다.",
      "손전등에 색깔 셀로판지를 씌웁니다.",
      "손전등을 로봇에서 멀리 옮깁니다.",
      "건전지를 새것으로 바꾸어 빛을 밝게 합니다.",
      "손전등을 켰다 껐다 반복합니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "스크린과 물체를 그대로 두면 그림자 크기는 손전등과 물체 사이의 거리에 따라 달라져요. 빛의 색깔이나 밝기로는 크기가 바뀌지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v041",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 11
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E4",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "손전등과 스크린 사이에 종이 인형을 세워 그림자를 만들었어요. 손전등과 스크린은 그대로 두고 종이 인형을 손전등 쪽으로 옮기면 그림자의 크기는 어떻게 변하는지 쓰고, 그 까닭을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "그림자의 크기가 커져요. 종이 인형과 손전등 사이의 거리가 가까워졌기 때문이에요.",
      "rubric": {
        "required": [
          "그림자의 크기가 커진다",
          "인형과 손전등 사이의 거리가 가까워졌다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "손전등과 스크린을 그대로 두고 물체를 손전등에 가깝게 하면 물체가 빛을 더 넓게 가려서 그림자가 커져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v042",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 12
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "그림자에 대한 설명으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 같은 물체라도 놓는 방향을 바꾸면 그림자 모양이 달라질 수 있어요.",
        "ㄴ. 빛이 물체를 많이 통과할수록 그림자는 연해져요.",
        "ㄷ. 투명한 물체일수록 그림자의 모양이 물체와 다르게 바뀌어요.",
        "ㄹ. 손전등을 물체에 가깝게 하면 그림자가 커져요."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "빛이 물체를 통과하는 정도는 그림자의 진하기를 바꿔요. 투명한 물체라고 그림자 모양이 물체와 달라지지는 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v043",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 13
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E4",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "손전등과 스크린 사이에 장난감 자동차를 놓고 그림자를 만들었어요. 손전등과 스크린은 그대로 두고 자동차를 스크린 쪽으로 옮겨 손전등에서 멀어지게 하면 그림자의 크기는 ( 커, 작아 )져요. 괄호 안에서 알맞은 말을 골라 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "작아",
      "accepted": [
        "작아",
        "작아져요",
        "작아진다",
        "작아집니다",
        "작아짐"
      ]
    },
    "explanation": "손전등과 스크린을 그대로 두고 물체를 손전등에서 멀게 하면 그림자가 작아져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v044",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 14
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "스크린 앞에 장난감 공룡을 세우고 손전등으로 비추었어요. 그림자의 크기를 크게 만드는 방법으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "공룡과 스크린을 그대로 두고 손전등을 공룡에 가깝게 합니다.",
      "공룡과 스크린을 그대로 두고 손전등을 공룡에서 멀게 합니다.",
      "손전등과 스크린을 그대로 두고 공룡을 손전등에 가깝게 합니다.",
      "손전등과 스크린을 그대로 두고 공룡을 스크린에 가깝게 합니다.",
      "손전등을 더 밝은 것으로 바꾸어 공룡을 비춥니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "손전등과 공룡 사이의 거리가 가까워지면 그림자가 커져요. 손전등을 옮기든 공룡을 옮기든 둘 사이가 가까워지면 돼요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v045",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 15
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "종이에 「ㄱ」을 크게 써서 세워 둔 거울에 비추어 보았어요. 「ㄱ」은 가로선의 오른쪽 끝에서 세로선이 아래로 내려온 모양이에요. 거울에 비친 모습으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "가로선의 오른쪽 끝에서 세로선이 아래로 내려옵니다.",
      "가로선의 오른쪽 끝에서 세로선이 위로 올라갑니다.",
      "가로선의 왼쪽 끝에서 세로선이 아래로 내려옵니다.",
      "가로선의 왼쪽 끝에서 세로선이 위로 올라갑니다.",
      "세로선 없이 가로선 하나만 보입니다."
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
    "explanation": "거울에 비친 글자는 위아래는 그대로이고 좌우만 바뀌어요. 그래서 오른쪽 끝에 있던 세로선이 왼쪽 끝으로 옮겨 가 보여요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v046",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 16
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "구급차 앞부분에 「구급」이라는 글자가 좌우가 바뀐 모양으로 쓰여 있어요. 그 까닭으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 앞차 운전자가 뒷거울로 보았을 때 글자가 바르게 읽히도록 하려고요.",
        "ㄴ. 거울로 보면 글자의 위아래가 바뀌어 보이기 때문이에요.",
        "ㄷ. 거울로 보면 글자가 더 크게 보이기 때문이에요.",
        "ㄹ. 글자 모양을 꾸며서 차를 멋있게 보이게 하려고요."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "앞차 운전자가 뒷거울로 구급차를 보면 거울 때문에 글자의 좌우가 한 번 더 바뀌어 바르게 읽혀요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v047",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 17
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "손전등 빛을 거울에 비추었더니 빛이 거울에 부딪친 뒤 처음과 다른 쪽으로 나아갔어요. 이처럼 빛이 나아가다 거울에 부딪쳐 방향이 바뀌는 성질을 빛의 무엇이라고 하는지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "반사",
      "accepted": [
        "반사",
        "빛의 반사",
        "반사예요",
        "반사입니다"
      ]
    },
    "explanation": "빛이 거울에 부딪쳐 나아가는 방향이 바뀌는 성질을 빛의 반사라고 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v048",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 18
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자동차 운전자는 고개를 돌리지 않고도 옆과 뒤에서 오는 자전거를 볼 수 있어요. 이에 대한 설명으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 옆거울이 빛을 반사해 뒤쪽 모습이 운전자의 눈에 보이기 때문이에요.",
        "ㄴ. 옆거울이 빛을 흡수해 자전거를 더 밝게 만들기 때문이에요.",
        "ㄷ. 옆거울이 있으면 빛이 없어도 물체를 볼 수 있기 때문이에요.",
        "ㄹ. 옆거울이 빛의 색깔을 바꾸어 자전거가 눈에 띄기 때문이에요."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "옆거울은 뒤쪽에서 오는 빛을 반사해 운전자의 눈으로 보내 주어, 뒤를 돌아보지 않아도 뒤쪽 모습을 볼 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v049",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 19
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 무용 연습실 벽에 [ ]을(를) 붙여 춤추는 자기 모습을 봐요.\n• 잠망경 안에는 [ ] 두 개가 비스듬히 들어 있어요.\n• [ ]은(는) 빛을 반사해 물체의 모습을 비추어요."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "거울",
      "accepted": [
        "거울",
        "거울이요",
        "거울입니다"
      ]
    },
    "explanation": "거울은 빛을 반사해 물체의 모습을 비추어 주는 도구라서 무용 연습실이나 잠망경 등에 써요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v050",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 20
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "치과 의사 선생님이 쓰는 손잡이 달린 작은 거울의 쓰임새로 가장 적절한 것을 고르세요.",
    "givens": null,
    "choices": [
      "얼굴에 묻은 것을 닦으며 얼굴 전체를 보는 데 씁니다.",
      "뒤에서 오는 자동차의 위치를 보는 데 씁니다.",
      "춤추는 동작이 바른지 보는 데 씁니다.",
      "입속 깊은 곳 이의 안쪽 면을 살펴보는 데 씁니다.",
      "작은 글씨를 크게 확대해서 읽는 데 씁니다."
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
    "explanation": "치과의 작은 거울은 빛을 반사해 직접 보기 어려운 이의 안쪽 면을 보여 줘요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v051",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 1
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "해가 쨍쨍한 날 놀이터의 미끄럼틀 옆 땅에 미끄럼틀 그림자가 생겼어요. 그림자가 생기는 데 꼭 필요한 조건을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "햇빛이 비쳐야 합니다.",
      "땅이 하얀색이어야 합니다.",
      "빛을 막는 미끄럼틀이 있어야 합니다.",
      "바람이 불어야 합니다.",
      "미끄럼틀이 움직여야 합니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "그림자가 생기려면 빛과 빛을 막는 물체가 있어야 해요. 땅의 색깔이나 바람은 상관없어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v052",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 2
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "손전등으로 벽을 비추고 있어요. 벽에 장난감 곰의 그림자가 생기게 하려면 곰을 어디에 놓아야 하는지 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 손전등과 벽 사이",
        "ㄴ. 손전등의 뒤쪽",
        "ㄷ. 벽의 뒤쪽"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ",
        "손전등과 벽 사이"
      ]
    },
    "explanation": "빛이 나아가는 길을 곰이 막아야 하므로 손전등과 벽 사이에 곰을 놓아야 벽에 그림자가 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v053",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 3
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "무대 위에 서 있는 배우 한 명을 서로 다른 세 방향에서 조명 세 개로 동시에 비추었어요. 무대 바닥에 생기는 배우의 그림자에 대한 설명으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 그림자가 한 개만 생겨요.",
        "ㄴ. 그림자가 세 개 생겨요.",
        "ㄷ. 조명이 많아서 그림자가 모두 사라져요.",
        "ㄹ. 그림자가 여섯 개 생겨요."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ",
        "그림자가 세 개 생겨요"
      ]
    },
    "explanation": "빛이 서로 다른 방향에서 비추면 빛마다 반대쪽에 그림자가 하나씩 생겨서 그림자가 세 개 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v054",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 4
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "손전등 빛을 비추었을 때 진한 그림자가 생기는 물체를 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "투명한 물병",
      "나무 블록",
      "투명 비닐 랩",
      "맑은 유리 접시",
      "가죽 장갑"
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    },
    "explanation": "나무 블록과 가죽 장갑은 빛이 통과하지 못하는 불투명한 물체라서 진한 그림자가 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v055",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 5
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "나무 도마에 손전등 빛을 비추었을 때 생기는 그림자에 대한 설명으로 옳지 않은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "그림자는 도마와 비슷한 모양으로 생깁니다.",
      "도마는 불투명해서 빛이 거의 통과하지 못합니다.",
      "빛이 도마를 통과한 부분에 그림자가 생깁니다.",
      "투명 필름보다 진하고 선명한 그림자가 생깁니다.",
      "투명 필름보다 연하고 흐릿한 그림자가 생깁니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        4
      ]
    },
    "explanation": "나무 도마는 빛이 통과하지 못하므로 빛이 막힌 부분에 그림자가 생기고, 투명 필름보다 진하고 선명한 그림자가 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v056",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 6
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 각각 쓰세요.",
    "givens": {
      "지문": "창문의 유리는 빛이 대부분 통과하는 [㉠]한 물체라서 연한 그림자가 생기고, 창틀은 빛이 통과하지 못하는 [㉡]한 물체라서 진한 그림자가 생겨요."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-투명, ㉡-불투명",
      "accepted": [
        "㉠-투명, ㉡-불투명",
        "㉠ 투명, ㉡ 불투명",
        "㉠ 투명 ㉡ 불투명",
        "㉠투명㉡불투명",
        "투명, 불투명",
        "투명,불투명",
        "투명 불투명"
      ]
    },
    "explanation": "창문 유리는 빛이 대부분 통과하는 투명한 물체라서 연한 그림자가, 창틀은 빛이 통과하지 못하는 불투명한 물체라서 진한 그림자가 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v057",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 7
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물체로 햇빛을 가려 그늘(그림자)을 만들어 생활을 편리하게 한 예가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "창문의 블라인드",
      "운동장의 그늘막",
      "캠핑장의 천막",
      "챙이 넓은 밀짚모자",
      "투명한 비닐하우스 지붕"
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
    "explanation": "투명한 비닐하우스 지붕은 빛이 대부분 통과하게 해서 식물이 햇빛을 받도록 만든 것이에요. 나머지는 빛을 막아 그늘을 만들어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v058",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 8
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "스크린, 세모 모양 종이, 손전등을 차례로 놓고 손전등을 켰을 때 스크린에 생기는 그림자의 모양으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 원 모양",
        "ㄴ. 별 모양",
        "ㄷ. 세모 모양",
        "ㄹ. 네모 모양"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ",
        "세모 모양",
        "세모",
        "삼각형 모양",
        "삼각형"
      ]
    },
    "explanation": "빛이 곧게 나아가다 종이에 막히므로 종이와 비슷한 세모 모양 그림자가 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v059",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 9
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "스크린, 「ㅠ」자 모양으로 자른 두꺼운 종이, 손전등을 차례로 놓고 손전등을 켰어요. 스크린에 생기는 그림자의 모양으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "「ㅠ」자 모양",
      "「ㅛ」자 모양",
      "「ㅡ」자 모양",
      "「ㅜ」자 모양",
      "동그라미 모양"
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
    "explanation": "빛이 곧게 나아가다 종이에 막히므로 그림자는 종이와 비슷한 「ㅠ」자 모양으로 생기고 위아래가 뒤집히지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v060",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 10
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "운동장에 세운 깃대의 그림자가 깃대처럼 길쭉한 모양으로 생겨요. 물체와 그림자의 모양이 비슷한 까닭으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "햇빛이 깃대를 감싸며 휘어 나아가기 때문입니다.",
      "햇빛이 곧게 나아가기 때문입니다.",
      "햇빛이 깃대를 그대로 통과하기 때문입니다.",
      "햇빛이 깃대에 모두 흡수되기 때문입니다.",
      "깃대가 스스로 빛을 내기 때문입니다."
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
    "explanation": "햇빛은 곧게 나아가다 깃대에 막혀요. 그래서 막힌 부분에만 빛이 닿지 않아 깃대와 비슷한 모양의 그림자가 생겨요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v061",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 11
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E4",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 손전등과 스크린을 그대로 두고 물체를 옮길 때 그림자 크기의 변화예요. 괄호 ㉠과 ㉡에 들어갈 알맞은 말을 골라 각각 쓰세요.",
    "givens": {
      "지문": "물체를 스크린 쪽으로 옮겨 손전등에서 멀어지게 하면 그림자의 크기는 ㉠( 커, 작아 )지고, 물체를 다시 손전등 쪽으로 옮기면 그림자의 크기는 ㉡( 커, 작아 )져요."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-작아, ㉡-커",
      "accepted": [
        "㉠-작아, ㉡-커",
        "㉠ 작아, ㉡ 커",
        "㉠ 작아 ㉡ 커",
        "㉠작아㉡커",
        "작아, 커",
        "작아,커",
        "작아 커",
        "작아지고, 커져요"
      ]
    },
    "explanation": "손전등과 스크린을 그대로 둘 때 물체가 손전등에서 멀어지면 그림자가 작아지고, 손전등에 가까워지면 커져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v062",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 12
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E4",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "스크린 앞에 종이 물고기를 세우고 손전등으로 비추었어요. 종이 물고기와 스크린은 그대로 두고 그림자를 크게 만들려면 손전등을 어느 쪽으로 옮겨야 하는지 ( 물고기 쪽, 물고기에서 먼 쪽 ) 중에서 골라 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "물고기 쪽",
      "accepted": [
        "물고기 쪽",
        "물고기 쪽으로",
        "물고기쪽",
        "물고기 가까이",
        "물고기에 가깝게",
        "물고기 쪽으로 옮겨요"
      ]
    },
    "explanation": "물체와 스크린을 그대로 둘 때 손전등이 물체에 가까워질수록 그림자가 커져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v063",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 13
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "손전등과 스크린 사이에 인형을 놓고 그림자를 만들었어요. 그림자의 크기를 달라지게 하는 것을 고르세요.",
    "givens": null,
    "choices": [
      "인형의 색깔",
      "손전등 빛의 색깔",
      "스크린의 색깔",
      "인형과 손전등 사이의 거리",
      "인형이 투명한지 불투명한지"
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
    "explanation": "그림자의 크기는 손전등과 물체 사이의 거리에 따라 달라져요. 색깔은 크기를 바꾸지 않고, 투명한 정도는 진하기를 바꿔요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v064",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 14
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E5",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "거울에 비친 물체의 모습을 설명한 것으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 거울에 비친 물체는 실제 물체와 좌우가 바뀌어 보여요.",
        "ㄴ. 거울에 비친 물체의 색깔은 실제 물체와 같아요.",
        "ㄷ. 거울에 비친 물체는 실제 물체보다 훨씬 작게 보여요."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "거울에 비친 물체는 색깔과 크기가 실제와 같고 좌우만 바뀌어 보여요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v065",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 15
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "오른손으로 공을 든 곰 인형을 거울 앞에 놓았어요. 거울에 비친 곰 인형에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "공을 든 손이 왼손으로 보입니다.",
      "공을 든 손이 오른손 그대로 보입니다.",
      "인형의 머리가 아래쪽으로 보입니다.",
      "공의 색깔이 실제와 다르게 보입니다.",
      "인형이 실제보다 두 배 크게 보입니다."
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
    "explanation": "거울에 비친 모습은 색깔과 크기는 같고 좌우가 바뀌어 보여요. 그래서 오른손이 왼손처럼 보여요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v066",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 16
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E5",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "미용실에서 거울 앞에 앉은 손님 뒤쪽 벽에 「미용실」이라는 글자가 좌우가 바뀐 모양으로 붙어 있어요. 손님이 앞의 거울로 이 글자를 보면 어떻게 보이는지 쓰고, 그렇게 보이는 까닭을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "「미용실」로 바르게 읽혀요. 거울에 비친 모습은 좌우가 바뀌어 보이기 때문에 좌우가 바뀐 글자가 다시 바르게 보여요.",
      "rubric": {
        "required": [
          "글자가 바르게 읽힌다",
          "거울에 비친 모습은 좌우가 바뀌어 보이기 때문이다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "거울에 비친 모습은 좌우가 바뀌어 보이므로, 미리 좌우를 바꾸어 붙인 글자는 거울 속에서 바르게 읽혀요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v067",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 17
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "거울에 비친 모양과 실제 모양이 같은 글자를 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "너",
      "응",
      "라",
      "무",
      "거"
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        3
      ]
    },
    "explanation": "왼쪽과 오른쪽이 똑같이 생긴 글자는 거울에 비쳐 좌우가 바뀌어도 원래 모양과 같아 보여요. 「응」과 「무」가 그래요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v068",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 18
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 매끄럽고 반짝이는 [ ]에 빛이 부딪치면 빛이 통과하지 않고 방향을 바꾸어 나아가요.\n• 미용실에서는 [ ]에 비친 모습으로 머리 모양을 확인해요."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "거울",
      "accepted": [
        "거울",
        "거울이요",
        "거울입니다"
      ]
    },
    "explanation": "빛을 반사해 방향을 바꾸고 물체의 모습을 비추어 주는 도구는 거울이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v069",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 19
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T13",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "학교에서 거울을 이용하는 예를 한 가지 쓰고, 그때 거울로 무엇을 보는지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "화장실 세면대에서 손을 씻고 거울로 내 얼굴을 봐요.",
      "rubric": {
        "required": [
          "학교에서 거울을 쓰는 곳이나 때",
          "거울로 보는 것(자기 모습 등)"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "학교에서도 화장실·체육관·복도 모퉁이 등에서 빛을 반사하는 거울로 내 모습이나 보이지 않는 쪽의 모습을 봐요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u03-v070",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 20
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "우리 생활에서 거울을 이용한 예가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "굽은 길에서 반대쪽 차를 확인할 때",
      "치과에서 이의 안쪽을 살펴볼 때",
      "열이 나는지 몸의 온도를 잴 때",
      "체육관에서 줄넘기 자세를 볼 때",
      "잠망경으로 담장 너머를 볼 때"
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
    "explanation": "몸의 온도를 잴 때는 체온계를 써요. 나머지는 빛의 반사를 이용해 모습을 보는 거울의 예예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  }
];
