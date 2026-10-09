// 5-1 Ⅰ 과학자는 어떻게 탐구할까요 — 유사문항 15 (창작). 원문 1문항당 1개, 같은 유형·난이도로 상황과 물체를 바꿨다. of = 짝이 되는 원문 (세트, 번호).
export const similar = [
  {
    "id": "s51-u01-v001",
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
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같이 한 탐구 과정은 무엇인지 고르세요.",
    "givens": {
      "지문": "그늘에 있는 물웅덩이가 햇빛이 비치는 곳의 물웅덩이보다 늦게 마르는 것을 보고, 「햇빛을 받는 정도에 따라 물이 마르는 빠르기가 달라질까?」처럼 알아볼 문제를 분명하게 정했습니다."
    },
    "choices": [
      "가설 설정",
      "문제 인식",
      "변인 통제",
      "자료 해석",
      "결론 도출"
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
    "explanation": "주변의 자연 현상을 관찰하고 탐구할 문제를 찾아 분명하게 나타내는 것은 문제 인식이에요. 가설 설정은 그 문제의 답을 미리 생각해 보는 것이에요.",
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
    "id": "s51-u01-v002",
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
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 탐구 문제를 해결하려고 실험을 계획합니다. ㈎실험에서 바꾸어야 할 조건과 ㈏재어야 할 것을 <보기>에서 각각 골라 기호를 쓰세요.",
    "givens": {
      "지문": "바람의 세기에 따라 젖은 손수건이 다 마르는 데 걸리는 시간은 달라질까?",
      "보기": [
        "ㄱ. 손수건이 다 마르는 데 걸린 시간",
        "ㄴ. 손수건의 크기",
        "ㄷ. 선풍기 바람의 세기",
        "ㄹ. 손수건에 적신 물의 양"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㈎-ㄷ, ㈏-ㄱ",
      "accepted": [
        "㈎-ㄷ, ㈏-ㄱ",
        "㈎ㄷ ㈏ㄱ",
        "(가)-ㄷ, (나)-ㄱ",
        "가-ㄷ, 나-ㄱ",
        "ㄷ, ㄱ"
      ]
    },
    "explanation": "알아보려는 것이 바람의 세기이므로 바람의 세기만 다르게 하고, 손수건의 크기와 물의 양은 같게 해요. 그리고 손수건이 다 마르는 데 걸린 시간을 재요.",
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
    "id": "s51-u01-v003",
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
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 친구들이 탐구 문제를 정하면서 한 말입니다. 탐구 문제를 바르게 정한 친구의 말을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 인터넷에서 한 번만 찾아보면 답이 바로 나오는 문제로 정할래.",
        "ㄴ. 「식물은 어떻게 살아갈까?」처럼 넓은 문제로 정해야 알아볼 것이 많아.",
        "ㄷ. 내가 가진 준비물로 직접 실험해서 답을 확인할 수 있는 문제로 정할래."
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
    "explanation": "탐구 문제는 스스로 실험해 확인할 수 있고 범위가 좁고 구체적이어야 해요. 찾아보면 바로 답이 나오거나 너무 넓은 문제는 알맞지 않아요.",
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
    "id": "s51-u01-v004",
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
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "모둠 친구들이 실험 계획을 세우면서 한 말입니다. 실험 계획을 바르게 세운 친구를 모두 고른 것은?",
    "givens": {
      "지문": "• 지호: 실험할 때 지켜야 할 안전 수칙도 계획에 적어 두자.\n• 서윤: 결과 표는 실험하기 전에 예상한 값으로 미리 다 채워 두자.\n• 민재: 무엇을 다르게 하고 무엇을 같게 할지, 무엇을 측정할지 정하자."
    },
    "choices": [
      "지호",
      "민재",
      "지호, 민재",
      "서윤, 민재",
      "지호, 서윤, 민재"
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
    "explanation": "실험 계획에는 실험 방법, 다르게 할 조건·같게 할 조건·측정할 것, 안전 수칙을 정해요. 결과는 실험을 한 뒤에 나온 그대로 적어야 하니 미리 채우면 안 돼요.",
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
    "id": "s51-u01-v005",
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
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같이 실험하는 것을 무엇이라고 하는지 고르세요.",
    "givens": {
      "지문": "고무줄을 감은 횟수만 다르게 하고, 자동차의 종류·출발선·바닥의 상태는 모두 같게 하여 고무 동력 자동차가 움직인 거리를 재었습니다."
    },
    "choices": [
      "문제 인식",
      "자료 변환",
      "가설 설정",
      "결론 도출",
      "변인 통제"
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
    "explanation": "실험에서 다르게 할 조건과 같게 할 조건을 확인하고 지키는 것을 변인 통제라고 해요. 그래야 결과가 무엇 때문에 달라졌는지 알 수 있어요.",
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
    "id": "s51-u01-v006",
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
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 강낭콩 싹을 관찰하는 실험에서 결과를 기록한 방법입니다. 바르게 기록한 것을 모두 고른 것은?",
    "givens": {
      "보기": [
        "ㄱ. 같은 싹의 길이를 세 번 재어 세 값을 모두 적고 평균도 구해 적었습니다.",
        "ㄴ. 한 싹이 예상보다 짧게 자라서 예상에 맞는 길이로 고쳐 적었습니다.",
        "ㄷ. 싹의 색깔과 잎의 수를 잊어버리기 전에 그 자리에서 바로 적었습니다."
      ]
    },
    "choices": [
      "ㄱ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ",
      "ㄱ, ㄴ, ㄷ"
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
    "explanation": "결과는 여러 번 잰 값과 평균을 빠짐없이, 관찰한 즉시 적어요. 예상과 달라도 고치지 않고 있는 그대로 적어야 해요.",
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
    "id": "s51-u01-v007",
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
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "[    ]에 들어갈 말로 가장 알맞은 것을 고르세요.",
    "givens": {
      "지문": "자료 변환은 실험 결과를 [    ]의 형태로 바꾸어 나타내는 것으로, 자료의 특징을 한눈에 비교하기 쉽게 해 줍니다."
    },
    "choices": [
      "가설이나 예상",
      "준비물과 실험 과정",
      "표나 그래프",
      "안전 수칙과 주의할 점",
      "모둠원의 이름과 역할"
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
    "explanation": "자료 변환은 실험 결과를 표나 그래프로 바꾸어 나타내는 것이에요. 그러면 많은 자료도 한눈에 비교할 수 있어요.",
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
    "id": "s51-u01-v008",
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
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "실험 결과를 표로 나타내는 과정에서 세 번째로 할 일을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 맨 위 가로줄과 맨 왼쪽 세로줄에 항목 이름 적기",
        "ㄴ. 무엇에 대한 표인지 제목 붙이기",
        "ㄷ. 측정한 값을 알맞은 칸에 채워 넣기",
        "ㄹ. 어떤 항목을 가로줄과 세로줄에 놓을지, 줄을 몇 개 그을지 정하기"
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
    "explanation": "표는 제목 붙이기(ㄴ) → 항목과 줄 수 정하기(ㄹ) → 첫 줄에 항목 이름 적기(ㄱ) → 결과 값 채우기(ㄷ) 순서로 만들어요. 그래서 세 번째는 ㄱ이에요.",
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
    "id": "s51-u01-v009",
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
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 실험 결과를 나타내는 방법으로 가장 알맞은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "따뜻한 물을 그릇에 담아 두고 5분마다 물의 온도를 재었습니다. 시간이 지남에 따라 온도가 어떻게 변하는지 그 경향을 한눈에 알아보고 싶습니다.",
      "보기": [
        "ㄱ. 측정한 온도를 문장으로 이어 쓴 글",
        "ㄴ. 꺾은선그래프",
        "ㄷ. 실험 장치를 그린 그림"
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
        "꺾은선그래프",
        "꺾은선 그래프"
      ]
    },
    "explanation": "그래프는 자료를 점과 선으로 나타내어 변화의 경향을 한눈에 보여 줘요. 시간에 따라 변하는 온도는 꺾은선그래프로 나타내면 좋아요.",
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
    "id": "s51-u01-v010",
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
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 어떤 탐구 과정에 대한 설명인지 고르세요.",
    "givens": {
      "지문": "공을 떨어뜨린 높이와 튀어 오른 높이를 정리한 그래프를 살펴보고, 떨어뜨린 높이가 높을수록 공이 더 높이 튀어 오르는 규칙을 찾아냈습니다."
    },
    "choices": [
      "문제 인식",
      "가설 설정",
      "변인 통제",
      "자료 변환",
      "자료 해석"
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
    "explanation": "정리한 자료를 보고 다르게 한 조건과 결과 사이의 관계나 규칙을 찾는 것은 자료 해석이에요. 그래프를 만드는 것까지가 자료 변환이에요.",
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
    "id": "s51-u01-v011",
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
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 실험 결과를 해석하는 친구들의 생각입니다. 자료 해석을 바르게 한 것을 모두 고른 것은?",
    "givens": {
      "보기": [
        "ㄱ. 규칙에서 벗어난 값이 나와도 빼지 않고, 그 값이 나온 까닭을 생각해 봅니다.",
        "ㄴ. 다르게 한 조건에 따라 결과가 어떻게 달라졌는지 살펴봅니다.",
        "ㄷ. 가설과 다른 결과가 나오면 잘못된 결과이므로 해석할 때 뺍니다."
      ]
    },
    "choices": [
      "ㄱ, ㄴ",
      "ㄴ",
      "ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
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
    "explanation": "자료 해석에서는 다르게 한 조건과 결과의 관계를 살피고, 규칙에서 벗어난 값이나 가설과 다른 결과도 빼지 않고 그 까닭을 생각해요.",
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
    "id": "s51-u01-v012",
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
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "「물질의 종류에 따라 물에 넣었을 때의 모습은 달라질까?」를 알아보려고 소금, 설탕, 모래를 각각 물에 넣고 저은 뒤 관찰한 결과를 표로 나타냈습니다. 표의 ㉠과 ㉡에 들어갈 말을 순서대로 짝 지은 것을 고르세요.",
    "givens": {
      "표": {
        "㉡ \\ ㉠": [
          "물에 녹아 보이지 않게 됨",
          "저은 뒤 컵 바닥에 가라앉음"
        ],
        "소금": [
          "○",
          "×"
        ],
        "설탕": [
          "○",
          "×"
        ],
        "모래": [
          "×",
          "○"
        ]
      }
    },
    "choices": [
      "관찰한 모습 / 물질의 종류",
      "물질의 종류 / 물의 온도",
      "물의 양 / 관찰한 모습",
      "물질의 종류 / 관찰한 모습",
      "물의 온도 / 물질의 종류"
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
    "explanation": "맨 위 가로줄(㉠)에는 다르게 한 조건인 물질의 종류(소금·설탕·모래)를, 맨 왼쪽 세로줄(㉡)에는 관찰한 모습을 썼어요.",
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
    "id": "s51-u01-v013",
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
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E4",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 세 가지 검은색 수성 펜(펜 A, 펜 B, 펜 C)의 잉크에서 색소를 분리한 결과를 표로 나타낸 것입니다. 이 결과에 대한 설명으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "표": {
        "분리된 색소 \\ 펜": [
          "노란색",
          "빨간색",
          "파란색",
          "초록색"
        ],
        "펜 A": [
          "○",
          "○",
          "○",
          "×"
        ],
        "펜 B": [
          "×",
          "○",
          "○",
          "○"
        ],
        "펜 C": [
          "○",
          "○",
          "○",
          "○"
        ]
      },
      "보기": [
        "ㄱ. 펜 A와 펜 B의 잉크에 섞여 있는 색소의 개수는 같습니다.",
        "ㄴ. 펜 C의 잉크에는 네 가지 색소가 섞여 있습니다.",
        "ㄷ. 세 펜의 잉크에 모두 노란색 색소가 섞여 있습니다."
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
    "explanation": "○를 세어 보면 펜 A와 펜 B는 세 가지, 펜 C는 네 가지 색소가 섞여 있어요. 펜 B에는 노란색 색소가 없으므로 ㄷ이 옳지 않아요.",
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
    "id": "s51-u01-v014",
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
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 탐구 문제를 해결하는 실험에서 한 가지만 바꾸어야 할 조건은 무엇인가요?",
    "givens": {
      "지문": "종이 헬리콥터의 날개 길이에 따라 바닥까지 떨어지는 데 걸리는 시간은 달라질까?"
    },
    "choices": [
      "날개의 길이",
      "떨어뜨리는 높이",
      "종이의 종류",
      "떨어지는 데 걸린 시간",
      "아래에 끼운 클립의 개수"
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
    "explanation": "알아보려는 것이 날개의 길이이므로 날개의 길이만 다르게 하고, 높이·종이·클립 수는 같게 해요. 떨어지는 데 걸린 시간은 재어야 할 결과예요.",
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
    "id": "s51-u01-v015",
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
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E4",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 물의 온도를 다르게 하여 각설탕 한 개가 다 녹는 데 걸린 시간을 세 번씩 재어 평균을 낸 결과입니다. 이 실험 결과로 알 수 있는 점을 쓰세요.",
    "givens": {
      "표": {
        "물의 온도": [
          "20 ℃",
          "40 ℃",
          "60 ℃"
        ],
        "다 녹는 데 걸린 시간(평균)": [
          "180초",
          "120초",
          "65초"
        ]
      }
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "물의 온도에 따라 각설탕이 다 녹는 데 걸리는 시간이 달라지며, 물의 온도가 높을수록 각설탕이 다 녹는 데 걸리는 시간이 짧아진다는 것을 알 수 있습니다.",
      "rubric": {
        "required": [
          "물의 온도에 따라 각설탕이 녹는 데 걸리는 시간이 달라진다",
          "물의 온도가 높을수록 걸리는 시간이 짧아진다(빨리 녹는다)"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "물의 온도가 20 ℃ → 40 ℃ → 60 ℃로 높아질수록 평균 시간이 180초 → 120초 → 65초로 줄었어요. 그래서 물의 온도가 높을수록 각설탕이 빨리 녹는다는 결론을 내릴 수 있어요.",
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
