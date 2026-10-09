// 4-2 Ⅴ 물의 여행 — 유사문항 45 (창작). 원문 1문항당 1개, 같은 유형·난이도로 상황과 물체를 바꿨다. of = 짝이 되는 원문 (세트, 번호).
export const similar = [
  {
    "id": "s42-u05-v001",
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
      "unit": "u05",
      "area": "지구",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 친구들이 같은 것을 두고 한 말입니다. 친구들이 공통으로 설명하는 것은 무엇인지 쓰세요.",
    "givens": {
      "지문": "• 지아: 바다에서 증발한 물이 하늘로 올라가 구름이 돼.\n• 우진: 구름에서 내린 비는 강을 따라 다시 바다로 가.\n• 소윤: 이렇게 물은 모습을 바꾸며 육지, 바다, 공기, 생명체 사이를 쉬지 않고 오가."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "물의 순환",
      "accepted": [
        "물의 순환",
        "물의순환",
        "물 순환",
        "물순환"
      ]
    },
    "explanation": "물이 상태를 바꾸며 바다·공기·육지·생명체 사이를 끊임없이 돌고 도는 것을 물의 순환이라고 해요.",
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
    "id": "s42-u05-v002",
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
      "unit": "u05",
      "area": "지구",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물의 순환 과정 중 물이 눈에 보이지 않는 기체 상태로 바뀌어 이동하는 경우를 고르세요.",
    "givens": null,
    "choices": [
      "빗물이 땅속으로 스며들어 지하수가 될 때",
      "산에 내린 빗물이 강을 따라 흘러갈 때",
      "젖은 빨래의 물이 마르면서 공기 중으로 퍼질 때",
      "구름 속 물방울이 커져 비가 되어 떨어질 때",
      "식물의 뿌리가 땅속의 물을 빨아들일 때"
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
    "explanation": "빨래가 마를 때 빨래 속 물은 증발해 기체인 수증기가 되어 공기 중으로 이동해요. 지하수·강물·빗물·뿌리로 들어가는 물은 액체예요.",
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
    "id": "s42-u05-v003",
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
      "unit": "u05",
      "area": "지구",
      "element": "E1",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "사람이나 동물을 통해서 일어나는 물의 순환 과정을 두 가지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "동물이 마신 물은 몸속을 돌면서 생명을 유지하는 데 쓰이고, 땀이나 오줌, 숨을 내쉴 때 나오는 수증기로 몸 밖으로 빠져나옵니다.",
      "rubric": {
        "required": [
          "마신 물이 몸속을 돈다",
          "물이 땀·오줌·숨(수증기) 등으로 몸 밖으로 나온다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "동물은 물을 마셔 몸속을 돌게 하고, 쓰고 난 물은 땀·오줌·내쉬는 숨의 수증기로 내보내요. 그래서 동물도 물의 순환에 함께해요.",
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
    "id": "s42-u05-v004",
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
      "unit": "u05",
      "area": "지구",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 물의 순환 과정 중 일부를 나타낸 것입니다. 이 중 응결이 일어나는 과정을 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 바닷물이 햇볕을 받아 수증기가 되어 공기 중으로 올라갑니다.",
        "ㄴ. 구름에서 내린 빗물이 강을 따라 바다로 흘러갑니다.",
        "ㄷ. 빗물이 땅속으로 스며들어 지하수가 됩니다.",
        "ㄹ. 하늘 높이 올라간 수증기가 차가워져 작은 물방울이 되어 구름이 생깁니다."
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
    "explanation": "응결은 수증기가 차가워져 물방울로 변하는 것이에요. 하늘 높이 올라간 수증기가 작은 물방울이 되어 구름이 생기는 ㄹ에서 응결이 일어나요.",
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
    "id": "s42-u05-v005",
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
      "unit": "u05",
      "area": "지구",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 물의 순환 과정 중 일부를 순서대로 정리한 것입니다. 빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 바르게 짝 지은 것을 고르세요.",
    "givens": {
      "지문": "바다 → ㉠ → 구름 → ㉡ → 땅 위의 강 → 바다"
    },
    "choices": [
      "공기 중의 수증기 / 비나 눈",
      "비나 눈 / 공기 중의 수증기",
      "지하수 / 공기 중의 수증기",
      "공기 중의 수증기 / 지하수",
      "얼음 / 공기 중의 수증기"
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
    "explanation": "바다의 물이 증발해 공기 중의 수증기가 되고, 수증기가 응결해 구름이 된 뒤 비나 눈이 되어 땅에 내려 강으로 흘러가요.",
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
    "id": "s42-u05-v006",
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
      "unit": "u05",
      "area": "지구",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지구에서 일어나는 물의 순환을 바르게 설명한 것을 고르세요.",
    "givens": null,
    "choices": [
      "물은 바다에서만 증발하고 강이나 호수에서는 증발하지 않습니다.",
      "물이 순환하는 동안 물은 언제나 액체 상태로만 이동합니다.",
      "구름이 된 물은 다시 땅이나 바다로 돌아오지 못합니다.",
      "물은 상태와 머무는 곳을 바꾸며 쉬지 않고 돌고 돕니다.",
      "물이 순환할수록 지구 전체의 물의 양이 조금씩 늘어납니다."
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
    "explanation": "물은 증발·응결로 상태를 바꾸고 바다·공기·육지를 옮겨 다니며 끊임없이 순환해요. 이때 지구 전체 물의 양은 늘거나 줄지 않아요.",
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
    "id": "s42-u05-v007",
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
      "unit": "u05",
      "area": "지구",
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 물을 어떻게 이용하고 있는 모습인지 고르세요.",
    "givens": {
      "지문": "봄이 되자 농부가 논에 물을 가득 채운 뒤 어린 벼를 심고 있습니다."
    },
    "choices": [
      "무거운 물건을 실어 나릅니다.",
      "농작물을 기릅니다.",
      "불을 끕니다.",
      "몸을 깨끗이 씻습니다.",
      "음식을 차갑게 보관합니다."
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
    "explanation": "논에 물을 대는 것은 벼라는 농작물을 기르는 데 물을 이용하는 모습이에요.",
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
    "id": "s42-u05-v008",
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
      "unit": "u05",
      "area": "지구",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물의 이용에 대해 잘못 말한 것을 고르세요.",
    "givens": null,
    "choices": [
      "물은 음식을 만들거나 그릇을 씻을 때 이용합니다.",
      "사람이 마신 물은 몸속을 돌다가 땀이나 오줌으로 나옵니다.",
      "빨래에 쓴 물은 하수구로 흘러가면 지구에서 영원히 사라집니다.",
      "식물은 뿌리로 흡수한 물을 이용해 자라고 살아갑니다.",
      "높은 곳에서 떨어지는 물을 이용해 전기를 만들 수 있습니다."
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
    "explanation": "쓰고 버린 물도 사라지지 않고 강과 바다로 가거나 증발하며 순환하므로, 시간이 지나면 다시 이용할 수 있어요.",
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
    "id": "s42-u05-v009",
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
      "unit": "u05",
      "area": "지구",
      "element": "E3",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 물을 이용하는 모습입니다. 괄호에 들어갈 알맞은 말을 골라 쓰세요.",
    "givens": {
      "지문": "큰 배는 강이나 바다의 물 위에 떠서 무거운 ( 물건, 전기 )을(를) 먼 곳까지 실어 나릅니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "물건",
      "accepted": [
        "물건"
      ]
    },
    "explanation": "배는 물 위에 떠서 이동할 수 있으므로, 강이나 바다의 물을 이용해 무거운 물건을 실어 나를 수 있어요.",
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
    "id": "s42-u05-v010",
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
      "unit": "u05",
      "area": "지구",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물이 우리에게 중요한 까닭으로 옳은 것을 <보기>에서 모두 골라 짝 지은 것을 고르세요.",
    "givens": {
      "보기": [
        "ㄱ. 사람은 물을 마셔야 생명을 유지할 수 있기 때문입니다.",
        "ㄴ. 물을 이용해 농작물을 기르고 전기를 만들기 때문입니다.",
        "ㄷ. 물은 순환하지 않아서 한 번 쓰면 없어지기 때문입니다."
      ]
    },
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄱ, ㄴ, ㄷ"
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
    "explanation": "사람은 물을 마셔야 살 수 있고, 물로 농작물을 기르고 전기를 만들어요. 물은 순환하므로 한 번 쓴다고 없어지지 않아요.",
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
    "id": "s42-u05-v011",
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
      "unit": "u05",
      "area": "지구",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물 부족 현상이 나타나는 까닭으로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "사람이 많아져 쓰는 물의 양이 늘었기 때문입니다.",
      "공장에서 더러운 물을 흘려보내 강물이 오염되었기 때문입니다.",
      "비가 적게 오는 지역은 쓸 수 있는 물이 적기 때문입니다.",
      "물을 아껴 쓰지 않고 낭비하는 사람이 많기 때문입니다.",
      "물이 순환하면서 지구 전체의 물이 점점 사라지기 때문입니다."
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
    "explanation": "물은 순환하면서 상태와 있는 곳만 바뀔 뿐 지구 전체 물의 양은 변하지 않아요. 물 부족은 쓰는 양이 늘고 물이 오염되고 지역마다 물이 다르기 때문이에요.",
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
    "id": "s42-u05-v012",
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
      "unit": "u05",
      "area": "지구",
      "element": "E4",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지구 겉면의 약 70 %는 물로 덮여 있지만, 마실 물이 부족한 나라가 많습니다. 그 까닭을 지구에 있는 물의 종류와 양과 관련지어 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "지구의 물은 대부분 짜서 바로 마시거나 쓰기 어려운 바닷물이고, 우리가 쉽게 이용할 수 있는 민물은 아주 적기 때문입니다.",
      "rubric": {
        "required": [
          "지구의 물은 대부분 바닷물이다",
          "바닷물은 바로 마시거나 쓰기 어렵다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "지구의 물은 대부분 짠 바닷물이라 그대로 마시거나 쓰기 어려워요. 쉽게 쓸 수 있는 민물은 전체 물의 아주 적은 부분이에요.",
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
    "id": "s42-u05-v013",
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
      "unit": "u05",
      "area": "지구",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물 부족 현상을 해결하기 위해 우리가 할 수 있는 일로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "샤워하는 시간을 줄이고 비누칠할 때는 물을 잠급니다.",
      "세탁기는 빨래를 모아서 한꺼번에 돌리도록 합니다.",
      "쌀을 씻은 물을 모아 두었다가 화분에 물로 줍니다.",
      "물이 새는 수도꼭지는 발견하는 대로 바로 고칩니다.",
      "물이 빨리 순환하도록 세제를 넉넉히 넣어 씻습니다."
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
    "explanation": "세제를 많이 쓰면 물이 오염되어 쓸 수 있는 깨끗한 물이 줄어요. 물을 아끼고 다시 쓰는 것이 물 부족을 줄이는 방법이에요.",
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
    "id": "s42-u05-v014",
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
      "unit": "u05",
      "area": "지구",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 물 부족 현상을 해결하기 위한 장치에 대한 설명입니다. 어떤 장치에 대한 설명인지 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "지붕에 내린 빗물을 통에 모아 두었다가 화장실 청소를 하거나 화단에 물을 줄 때 씁니다.",
      "보기": [
        "ㄱ. 빗물 저금통",
        "ㄴ. 와카워터",
        "ㄷ. 해수 담수화 시설"
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
        "빗물 저금통",
        "빗물저금통"
      ]
    },
    "explanation": "빗물 저금통은 지붕 등에 내린 빗물을 모아 두었다가 청소나 화단에 물 주기 같은 곳에 쓰게 해 주는 장치예요.",
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
    "id": "s42-u05-v015",
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
      "unit": "u05",
      "area": "지구",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 바닷물로 마실 물을 얻는 간단한 장치에 대한 설명입니다. 괄호 ㉠과 ㉡에 들어갈 알맞은 말을 골라 각각 쓰세요.",
    "givens": {
      "지문": "햇볕이 드는 곳에 바닷물을 담은 그릇을 두고 투명한 덮개를 씌웠습니다. 바닷물이 ㉠( 증발, 응결 )하여 생긴 수증기가 덮개 안쪽에 닿아 ㉡( 증발, 응결 )하여 물방울이 되고, 이 물방울을 모으면 짠맛이 없는 물을 얻을 수 있습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-증발, ㉡-응결",
      "accepted": [
        "㉠-증발, ㉡-응결",
        "증발, 응결",
        "㉠ 증발, ㉡ 응결",
        "증발,응결",
        "증발 응결"
      ]
    },
    "explanation": "바닷물이 증발하면 소금은 남고 물만 수증기가 되어 올라가요. 이 수증기가 덮개 안쪽에서 응결하면 소금기 없는 물방울이 돼요.",
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
    "id": "s42-u05-v016",
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
      "unit": "u05",
      "area": "지구",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 물의 순환 과정을 글로 나타낸 것입니다. ㈏ 과정에 해당하는 것을 고르세요.",
    "givens": {
      "지문": "㈎ 바다 위에서 공기 중으로 올라가는 화살표 → 구름 → ㈏ 구름에서 산꼭대기로 내려오는 화살표 → ㈐ 산에서 강을 따라 바다로 흘러가는 화살표"
    },
    "choices": [
      "바다의 물이 증발하여 공기 중으로 올라갑니다.",
      "구름에서 비나 눈이 되어 땅으로 내립니다.",
      "공기 중의 수증기가 응결하여 구름이 됩니다.",
      "땅속으로 스며든 물이 지하수가 되어 흐릅니다.",
      "식물이 땅속의 물을 뿌리로 빨아들입니다."
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
    "explanation": "구름 속 물방울이 커지고 무거워지면 비나 눈이 되어 산과 같은 땅 위로 내려요. ㈏는 구름에서 땅으로 내려오는 과정이에요.",
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
    "id": "s42-u05-v017",
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
      "unit": "u05",
      "area": "지구",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물의 순환에 대해 친구들이 한 말입니다. 잘못 말한 친구를 고르세요.",
    "givens": null,
    "choices": [
      "민지: 바다의 물은 증발해서 공기 중으로 올라가.",
      "준호: 구름에서 내린 비는 강을 따라 바다로 흘러가.",
      "서연: 동물이 마신 물은 몸 밖으로 나오지 않고 없어져.",
      "하율: 땅속으로 스며든 물은 지하수가 되어 흐르기도 해.",
      "도윤: 식물이 흡수한 물은 잎에서 수증기로 나가기도 해."
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
    "explanation": "동물이 마신 물은 몸속을 돌다가 땀·오줌·숨으로 다시 몸 밖으로 나와요. 물은 순환할 뿐 없어지지 않아요.",
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
    "id": "s42-u05-v018",
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
      "unit": "u05",
      "area": "지구",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "바다의 물 한 방울이 공기 중의 수증기 → 구름 → 비 → 강 → 바다로 이동했습니다. 이 과정에서 처음과 똑같이 유지되는 것을 고르세요.",
    "givens": null,
    "choices": [
      "물방울이 머무는 장소와 높이",
      "물방울의 상태(액체·기체)",
      "물방울의 모양과 크기",
      "물방울이 이동하는 빠르기",
      "지구 전체에 있는 물의 양"
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
    "explanation": "물은 순환하면서 상태·모양·있는 곳이 바뀌지만, 지구 전체 물의 양은 늘거나 줄지 않고 그대로예요.",
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
    "id": "s42-u05-v019",
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
      "unit": "u05",
      "area": "지구",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 물의 순환에 대한 설명입니다. 빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 각각 쓰세요.",
    "givens": {
      "지문": "하늘 높이 올라간 수증기는 차가워져 ㉠ 하여 구름이 되고, 구름에서 비가 내립니다. 땅에 내린 빗물은 강과 호수에 모였다가 햇볕을 받아 다시 공기 중으로 ㉡ 합니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-응결, ㉡-증발",
      "accepted": [
        "㉠-응결, ㉡-증발",
        "응결, 증발",
        "㉠ 응결, ㉡ 증발",
        "응결,증발",
        "응결 증발"
      ]
    },
    "explanation": "수증기가 차가워져 물방울이 되는 것은 응결, 물이 수증기로 변해 공기 중으로 가는 것은 증발이에요.",
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
    "id": "s42-u05-v020",
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
      "unit": "u05",
      "area": "지구",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "우리 생활에서 물을 이용하는 모습을 설명한 것으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "불이 났을 때 물로는 불을 끌 수 없습니다.",
      "물을 끓여 국이나 찌개 같은 음식을 만듭니다.",
      "여름에 수영장이나 계곡에서 물놀이를 즐깁니다.",
      "논에 물을 대어 벼와 같은 농작물을 기릅니다.",
      "얼음을 이용해 생선을 차갑고 신선하게 보관합니다."
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
    "explanation": "물은 불을 끄는 데에도 쓰여요. 소방차는 물을 뿌려 불을 꺼요.",
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
    "id": "s42-u05-v021",
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
      "unit": "u05",
      "area": "지구",
      "element": "E3",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흐르는 물이나 물이 만든 경치를 관광 자원으로 이용하는 경우를 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 텃밭의 상추에 물뿌리개로 물을 줍니다.",
        "ㄴ. 많은 사람이 폭포의 멋진 경치를 구경하러 찾아옵니다.",
        "ㄷ. 높은 곳에서 떨어지는 물로 발전기를 돌립니다."
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
    "explanation": "폭포처럼 물이 만든 멋진 경치는 많은 사람이 구경하러 오는 관광 자원이 돼요.",
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
    "id": "s42-u05-v022",
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
      "unit": "u05",
      "area": "지구",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "준서는 '물은 왜 중요할까?'를 주제로 발표하려고 합니다. 발표에 넣기에 알맞은 내용을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 모든 생물은 물이 있어야 생명을 유지할 수 있습니다.",
        "ㄴ. 물은 바다에만 있어서 육지의 생물과는 관계가 없습니다.",
        "ㄷ. 물은 순환하지 않으므로 지구의 물은 점점 줄어듭니다."
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
    "explanation": "모든 생물은 물이 있어야 생명을 유지할 수 있으므로 물이 중요해요. 물은 육지 생물에게도 꼭 필요하고, 순환하므로 점점 줄어들지 않아요.",
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
    "id": "s42-u05-v023",
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
      "unit": "u05",
      "area": "지구",
      "element": "E3",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "우리에게 물이 중요한 까닭을 다음 모습과 관련지어 쓰세요.",
    "givens": {
      "지문": "[모습] 무더운 날, 운동장에서 뛰어논 아이들이 땀을 흘린 뒤 물을 마시고 있습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "사람은 물을 마셔야 생명을 유지할 수 있으므로 물이 꼭 필요합니다.",
      "rubric": {
        "required": [
          "사람은 물을 마신다(몸에 물이 필요하다)",
          "물이 있어야 생명을 유지할 수 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "사람의 몸은 물이 있어야 살아갈 수 있어요. 땀으로 물이 빠져나가면 물을 마셔 채워야 해요.",
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
    "id": "s42-u05-v024",
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
      "unit": "u05",
      "area": "지구",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물의 이용에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "생물이 이용한 물은 다시 자연으로 돌아가지 않습니다.",
      "사람은 물을 이용해 전기나 농작물처럼 필요한 것을 얻습니다.",
      "강에서 끌어다 쓴 물은 그 뒤로 다시는 이용할 수 없습니다.",
      "물은 사람만 이용하고 동물과 식물은 이용하지 않습니다.",
      "공장이 많아질수록 깨끗한 물이 저절로 늘어납니다."
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
    "explanation": "우리는 물로 전기를 만들고 농작물을 기르는 등 필요한 것을 얻어요. 쓴 물도 순환해 다시 이용할 수 있어요.",
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
    "id": "s42-u05-v025",
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
      "unit": "u05",
      "area": "지구",
      "element": "E4",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "여러 나라에서 물 부족 문제가 점점 심해지고 있습니다. 그 까닭으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 사람이 늘고 공장이 많아져 물을 쓰는 양이 많아졌기 때문입니다.",
        "ㄴ. 비가 너무 자주 내려 강물이 넘치기 때문입니다.",
        "ㄷ. 정수장이 늘어나 깨끗한 물이 많아졌기 때문입니다."
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
    "explanation": "사람이 늘고 공장이 많아지면 쓰는 물의 양이 늘어 물이 부족해져요. 정수장이 늘면 오히려 깨끗한 물을 얻기 쉬워져요.",
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
    "id": "s42-u05-v026",
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
      "unit": "u05",
      "area": "지구",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물 부족 현상을 해결하기 위한 방법으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "이를 닦는 동안 물을 계속 틀어 둡니다.",
      "샤워할 때 비누칠하는 동안 물을 잠급니다.",
      "설거지할 때 세제를 많이 넣을수록 좋습니다.",
      "빗물을 받아 두었다가 텃밭에 줍니다.",
      "바닷물을 걸러 내지 않고 바로 마십니다."
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
    "explanation": "쓰지 않을 때 물을 잠그고 빗물을 모아 다시 쓰면 물을 아낄 수 있어요. 세제를 많이 쓰면 물이 오염돼요.",
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
    "id": "s42-u05-v027",
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
      "unit": "u05",
      "area": "지구",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "바닷물에서 소금 성분을 없애 마실 물로 만드는 해수 담수화 시설의 좋은 점을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "비가 적게 오는 바닷가 지역에서도 마실 물을 얻을 수 있습니다.",
      "지구 전체 물의 양을 늘릴 수 있습니다.",
      "바다의 많은 물을 생활에 쓸 수 있는 물로 바꿀 수 있습니다.",
      "물을 아무리 낭비해도 괜찮아집니다.",
      "공장 폐수로 강물이 오염되는 것을 막을 수 있습니다."
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
    "explanation": "해수 담수화 시설은 바로 쓰기 어려운 바닷물을 마실 수 있는 물로 바꿔 줘요. 지구 전체 물의 양이 늘지는 않고, 물을 아껴야 하는 것도 그대로예요.",
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
    "id": "s42-u05-v028",
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
      "unit": "u05",
      "area": "지구",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 나뭇가지에 비닐봉지를 씌워 물을 모으는 방법입니다. 빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 각각 쓰세요.",
    "givens": {
      "지문": "햇볕이 잘 드는 나뭇가지에 투명한 비닐봉지를 씌우고 입구를 묶어 두었습니다. 나무의 잎에서 물이 ㉠ 하여 수증기가 되어 나오고, 이 수증기가 비닐봉지 안쪽에서 ㉡ 하여 물방울로 맺힌 뒤 봉지 아래쪽에 모입니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-증발, ㉡-응결",
      "accepted": [
        "㉠-증발, ㉡-응결",
        "증발, 응결",
        "㉠ 증발, ㉡ 응결",
        "증발,응결",
        "증발 응결"
      ]
    },
    "explanation": "잎에서 물이 증발해 수증기가 나오고, 이 수증기가 비닐봉지 안쪽에 닿아 응결하면 물방울이 맺혀요.",
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
    "id": "s42-u05-v029",
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
      "unit": "u05",
      "area": "지구",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 와카워터로 물을 모으는 과정입니다. 빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 각각 쓰세요.",
    "givens": {
      "지문": "밤이 되어 기온이 내려가면 와카워터의 그물망이 차가워집니다. 공기 중의 눈에 보이지 않는 ㉠ 이(가) 차가운 그물망에 닿아 ㉡ 하여 물방울이 되고, 물방울은 아래로 흘러내려 바닥의 그릇에 모입니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-수증기, ㉡-응결",
      "accepted": [
        "㉠-수증기, ㉡-응결",
        "수증기, 응결",
        "㉠ 수증기, ㉡ 응결",
        "수증기,응결",
        "수증기 응결"
      ]
    },
    "explanation": "밤에 차가워진 그물망에 공기 중의 수증기가 닿으면 응결해 물방울이 되고, 이 물방울이 흘러내려 그릇에 모여요.",
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
    "id": "s42-u05-v030",
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
      "unit": "u05",
      "area": "지구",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "와카워터 같은 물 모으는 장치를 한 마을에 보내려고 합니다. 장치가 가장 필요하고 잘 쓰일 수 있는 마을을 고르세요.",
    "givens": null,
    "choices": [
      "큰 강이 마을 한가운데를 흐르는 마을",
      "일 년 내내 비가 많이 내려 늘 땅이 젖어 있는 마을",
      "수도 시설이 잘 갖추어져 물이 넉넉한 도시",
      "비가 거의 오지 않지만 밤이 되면 공기가 차가워지는 마을",
      "커다란 호수 옆에 있어 호숫물을 걸러 쓰는 마을"
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
    "explanation": "물 모으는 장치는 비가 적어 물이 부족한 곳에 필요하고, 밤에 기온이 내려가야 수증기가 차가운 그물망에서 응결해 물을 모을 수 있어요.",
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
    "id": "s42-u05-v031",
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
      "unit": "u05",
      "area": "지구",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물의 이동에 대한 설명으로 잘못된 것을 고르세요.",
    "givens": null,
    "choices": [
      "물은 반드시 수증기가 되어야만 다른 곳으로 이동할 수 있습니다.",
      "물은 이동하면서 액체가 되었다가 기체가 되기도 합니다.",
      "높은 산꼭대기에서는 물이 얼음이나 눈 상태로 머물기도 합니다.",
      "식물 뿌리로 들어간 물은 줄기를 따라 잎까지 이동합니다.",
      "물은 바다, 강, 땅속, 공기 중 등 여러 곳에 있습니다."
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
    "explanation": "강물이나 지하수처럼 물은 액체 상태로도 이동해요. 수증기가 되어야만 이동하는 것은 아니에요.",
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
    "id": "s42-u05-v032",
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
      "unit": "u05",
      "area": "지구",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "하늘 높이 올라간 수증기가 구름 속 작은 물방울이 될 때 물의 상태 변화로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "액체 → 액체",
      "액체 → 기체",
      "기체 → 액체",
      "고체 → 기체",
      "기체 → 기체"
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
    "explanation": "수증기는 기체이고 물방울은 액체예요. 수증기가 차가워져 물방울이 되는 응결은 기체 → 액체의 변화예요.",
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
    "id": "s42-u05-v033",
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
      "unit": "u05",
      "area": "지구",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 글의 빈칸 □에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "비가 되어 땅에 내린 물은 강을 따라 바다로 가고, 바다에서 증발하여 다시 구름이 됩니다. 이처럼 물이 상태를 바꾸며 끊임없이 돌고 도는 것을 물의 □(이)라고 합니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "순환",
      "accepted": [
        "순환",
        "물의 순환",
        "물의순환"
      ]
    },
    "explanation": "물이 상태를 바꾸며 지구 여러 곳을 끊임없이 돌고 도는 것을 물의 순환이라고 해요.",
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
    "id": "s42-u05-v034",
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
      "unit": "u05",
      "area": "지구",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 물방울 '방울이'의 여행입니다. 방울이가 증발하여 수증기로 상태가 변하며 이동한 과정의 기호를 쓰세요.",
    "givens": {
      "지문": "ㄱ. 구름 속에서 친구들과 모여 무거워진 방울이는 비가 되어 산에 떨어졌어요.\nㄴ. 산에서 강을 따라 흘러 바다에 도착했어요.\nㄷ. 햇볕이 쨍쨍한 날, 방울이는 눈에 보이지 않는 수증기가 되어 바다 위 공기 중으로 올라갔어요.\nㄹ. 하늘 높이 올라가 차가워진 방울이는 다시 작은 물방울이 되었어요."
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
    "explanation": "증발은 물이 수증기로 변하는 것이에요. 햇볕을 받은 바닷물이 수증기가 되어 공기 중으로 올라간 ㄷ이 증발 과정이에요.",
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
    "id": "s42-u05-v035",
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
      "unit": "u05",
      "area": "지구",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물의 순환에 대한 설명으로 옳은 것을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "보기": [
        "ㄱ. 호수의 물은 증발하지 않고 그대로 머뭅니다.",
        "ㄴ. 땅속으로 스며든 물은 지하수가 되어 흐르기도 합니다.",
        "ㄷ. 공기 중의 수증기가 응결하면 구름이 됩니다.",
        "ㄹ. 식물이 빨아들인 물은 식물 몸속에서 사라집니다."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ, ㄷ",
      "accepted": [
        "ㄴ, ㄷ",
        "ㄴ,ㄷ",
        "ㄷ, ㄴ",
        "ㄷ,ㄴ",
        "ㄴㄷ",
        "ㄷㄴ"
      ]
    },
    "explanation": "땅속으로 스며든 물은 지하수가 되어 흐르고, 공기 중의 수증기가 응결하면 구름이 돼요. 호수의 물도 증발하고, 식물이 빨아들인 물도 사라지지 않아요.",
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
    "id": "s42-u05-v036",
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
      "unit": "u05",
      "area": "지구",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물이 순환하는 동안 지구 전체의 물의 양에 대해 바르게 말한 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 비가 많이 내린 해에는 지구 전체 물의 양이 늘어납니다.",
        "ㄴ. 물의 상태와 있는 곳은 바뀌어도 지구 전체 물의 양은 그대로입니다.",
        "ㄷ. 햇볕이 강한 여름에는 증발이 많아 지구 전체 물의 양이 줄어듭니다."
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
    "explanation": "물의 상태와 있는 곳은 바뀌어도 지구 전체 물의 양은 변하지 않아요. 비가 많이 오거나 증발이 많아도 물이 옮겨 다닐 뿐이에요.",
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
    "id": "s42-u05-v037",
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
      "unit": "u05",
      "area": "지구",
      "element": "E3",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 생물이 물을 어떻게 이용하는 예인지 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "선인장은 비가 올 때 줄기에 물을 저장해 두었다가, 비가 오지 않는 동안 그 물을 쓰며 살아갑니다.",
      "보기": [
        "ㄱ. 농작물을 기릅니다.",
        "ㄴ. 생물이 생명을 유지하는 데 씁니다.",
        "ㄷ. 물건을 실어 나릅니다."
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
        "생물이 생명을 유지하는 데 씁니다."
      ]
    },
    "explanation": "선인장은 저장해 둔 물로 살아가요. 생물은 생명을 유지하기 위해 물을 이용해요.",
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
    "id": "s42-u05-v038",
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
      "unit": "u05",
      "area": "지구",
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 물을 어떻게 이용하는 경우인지 고르세요.",
    "givens": {
      "지문": "강을 막아 만든 댐에 물을 가두었다가, 높은 곳의 물을 아래로 흘려보내 발전기를 돌립니다."
    },
    "choices": [
      "몸 씻기",
      "전기 만들기",
      "음식 보관하기",
      "농작물 기르기",
      "물건 운반하기"
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
    "explanation": "댐에 모아 둔 물을 높은 곳에서 흘려보내 발전기를 돌리면 전기를 만들 수 있어요.",
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
    "id": "s42-u05-v039",
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
      "unit": "u05",
      "area": "지구",
      "element": "E4",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "바닷가 마을에 사는 사람이 '바로 앞에 물이 이렇게 많은데 왜 마실 물이 부족하지?'라고 물었습니다. 지구에 있는 물의 분포와 관련지어 답해 주세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "지구에 있는 물은 대부분 바닷물이라 짜서 바로 마시거나 이용하기 어렵고, 쉽게 이용할 수 있는 물은 아주 적기 때문이에요.",
      "rubric": {
        "required": [
          "지구의 물은 대부분 바닷물이다",
          "바닷물은 바로 마시거나 쓰기 어렵다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "바다에 물이 많아도 짠 바닷물은 그대로 마실 수 없어요. 지구 물의 대부분이 바닷물이라 쉽게 쓸 수 있는 물은 아주 적어요.",
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
    "id": "s42-u05-v040",
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
      "unit": "u05",
      "area": "지구",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물 부족 현상의 원인으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "공장이 줄어들어 물을 쓰는 양이 줄었습니다.",
      "생활 하수와 공장 폐수로 강과 호수가 오염되었습니다.",
      "비가 적게 내리고 가뭄이 자주 드는 지역이 있습니다.",
      "지구 전체의 물의 양이 해마다 줄고 있습니다.",
      "한 번 쓴 물은 지구에서 영원히 사라집니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        2
      ]
    },
    "explanation": "물이 오염되면 쓸 수 있는 물이 줄고, 비가 적게 오는 지역은 물이 모자라요. 지구 전체 물의 양은 줄지 않아요.",
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
    "id": "s42-u05-v041",
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
      "unit": "u05",
      "area": "지구",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 물 부족 현상을 해결하기 위한 장치에 대한 설명입니다. 어떤 장치에 대한 설명인지 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "안개가 자주 끼는 높은 언덕에 촘촘한 그물을 세워 두고, 그물에 맺혀 흘러내린 물방울을 아래 물통에 모읍니다.",
      "보기": [
        "ㄱ. 빗물 저금통",
        "ㄴ. 안개 수확기",
        "ㄷ. 해수 담수화 시설"
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
        "안개 수확기",
        "안개수확기"
      ]
    },
    "explanation": "안개 수확기는 안개가 자주 끼는 곳에 촘촘한 그물을 세워, 그물에 맺힌 물방울을 모으는 장치예요.",
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
    "id": "s42-u05-v042",
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
      "unit": "u05",
      "area": "지구",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "학교에서 물을 아끼기 위해 우리가 실천할 수 있는 방법으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "청소할 때 호스로 물을 계속 틀어 놓고 씁니다.",
      "마시고 남은 물통의 물을 화단에 줍니다.",
      "운동장 먼지를 없애려고 하루 종일 물을 뿌립니다.",
      "바닷물을 마실 물로 바꾸는 시설을 학교에 짓습니다.",
      "손을 씻은 뒤 수도꼭지를 꼭 잠갔는지 확인합니다."
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
    "explanation": "남은 물을 다시 쓰고 수도꼭지를 잘 잠그는 것은 우리가 바로 실천할 수 있는 일이에요. 큰 시설을 짓는 것은 우리가 날마다 실천하는 방법이 아니에요.",
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
    "id": "s42-u05-v043",
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
      "unit": "u05",
      "area": "지구",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "비가 거의 오지 않는 지역에서 대나무 같은 가벼운 재료로 높은 탑을 세우고 그물망을 둘러, 공기 중의 수증기를 물방울로 모으는 장치의 이름을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "와카워터",
      "accepted": [
        "와카워터",
        "와카 워터"
      ]
    },
    "explanation": "와카워터는 그물망에서 공기 중의 수증기가 응결해 생긴 물방울을 모으는 장치예요.",
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
    "id": "s42-u05-v044",
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
      "unit": "u05",
      "area": "지구",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 장치에서 물방울이 생기는 것은 어떤 현상을 이용한 것인지 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "사막의 한 마을에서는 밤에 빨리 차가워지는 넓은 금속판을 비스듬히 세워 둡니다. 새벽이 되면 금속판 겉면에 물방울이 맺히고, 이 물방울이 홈을 따라 흘러 통에 모입니다.",
      "보기": [
        "ㄱ. 물이 증발하는 현상",
        "ㄴ. 얼음이 녹는 현상",
        "ㄷ. 수증기가 응결하는 현상",
        "ㄹ. 물이 끓는 현상"
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
        "수증기가 응결하는 현상"
      ]
    },
    "explanation": "밤에 차가워진 금속판에 공기 중의 수증기가 닿아 응결하면 물방울이 맺혀요.",
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
    "id": "s42-u05-v045",
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
      "unit": "u05",
      "area": "지구",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물 모으는 장치를 설계할 때 생각할 점으로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "장치를 만들 재료를 구하기 쉬운지",
      "장치를 세울 곳의 날씨와 기온 변화",
      "물방울이 잘 맺히고 모이는 재료인지",
      "장치의 색깔이 요즘 유행에 맞는지",
      "증발과 응결을 어떻게 이용할지"
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
    "explanation": "물 모으는 장치는 물을 잘 모으는 것이 목적이므로 재료, 세울 곳의 날씨, 증발·응결의 이용을 생각해요. 유행하는 색깔은 물을 모으는 것과 관계없어요.",
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
