// 3-2 Ⅱ 동물의 생활 — 유사문항 70 (창작). 원문 1문항당 1개, 같은 유형·난이도로 상황과 물체를 바꿨다. of = 짝이 되는 원문 (세트, 번호).
export const similar = [
  {
    "id": "s32-u02-v001",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "우리 주변의 장소와 그곳에서 주로 볼 수 있는 동물을 잘못 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "집 안 - 두더지, 지렁이",
      "나무 위 - 까치, 매미",
      "연못 - 소금쟁이, 개구리",
      "돌 밑 - 공벌레, 지네",
      "화단 - 개미, 나비"
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
    "explanation": "두더지와 지렁이는 땅속에서 사는 동물이라 집 안에서는 볼 수 없어요. 동물마다 먹이와 숨을 곳이 있는 장소에서 주로 살아요.",
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
    "id": "s32-u02-v002",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "괄호 안에서 알맞은 말을 골라 쓰세요.",
    "givens": {
      "지문": "화단은 꽃과 풀이 우거져 있어 동물이 ( 숨기, 눈에 띄기 ) 좋고 먹이도 많아서 여러 동물을 볼 수 있습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "숨기",
      "accepted": [
        "숨기",
        "숨기 좋고"
      ]
    },
    "explanation": "풀과 꽃이 우거진 화단은 다른 동물의 눈에 잘 띄지 않아 숨기 좋고 먹이가 많아서 동물이 많이 살아요.",
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
    "id": "s32-u02-v003",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "<보기>의 동물들을 ‘더듬이가 있는가?’로 분류할 때 ‘그렇다.’로 분류되는 것을 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "보기": [
        "ㄱ. 메뚜기",
        "ㄴ. 참새",
        "ㄷ. 달팽이",
        "ㄹ. 금붕어"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ, ㄷ",
      "accepted": [
        "ㄱ, ㄷ",
        "ㄱ,ㄷ",
        "ㄱㄷ",
        "ㄷ, ㄱ",
        "ㄷ,ㄱ",
        "메뚜기, 달팽이",
        "달팽이, 메뚜기"
      ]
    },
    "explanation": "메뚜기와 달팽이는 머리에 더듬이가 있고, 참새와 금붕어는 더듬이가 없어요.",
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
    "id": "s32-u02-v004",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같이 동물을 분류한 기준으로 알맞은 것을 고르세요.",
    "givens": {
      "표": {
        "분류 1": [
          "참새, 나비"
        ],
        "분류 2": [
          "개구리, 고양이"
        ]
      }
    },
    "choices": [
      "다리가 있는가?",
      "날개가 있는가?",
      "알을 낳는가?",
      "더듬이가 있는가?",
      "물속에서 살 수 있는가?"
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
    "explanation": "참새와 나비는 날개가 있고 개구리와 고양이는 날개가 없어요. 다리는 네 동물 모두 있어서 두 무리를 가르지 못해요.",
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
    "id": "s32-u02-v005",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 동물이 주로 사는 곳을 <보기>에서 골라 기호를 쓰세요. (1) 고등어 (2) 다슬기 (3) 가오리",
    "givens": {
      "보기": [
        "ㄱ. 바다",
        "ㄴ. 강이나 호수"
      ],
      "지문": "(1) 고등어\n(2) 다슬기\n(3) 가오리"
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(1) ㄱ (2) ㄴ (3) ㄱ",
      "accepted": [
        "(1) ㄱ (2) ㄴ (3) ㄱ",
        "ㄱ, ㄴ, ㄱ",
        "ㄱㄴㄱ",
        "ㄱ ㄴ ㄱ",
        "(1) 바다 (2) 강이나 호수 (3) 바다"
      ]
    },
    "explanation": "고등어와 가오리는 바다에서 살고, 다슬기는 강이나 호수의 바위에 붙어 살아요.",
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
    "id": "s32-u02-v006",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "땅에서 기어 다니는 뱀, 지렁이, 달팽이의 공통점을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 날개가 있습니다.",
        "ㄴ. 다리가 없습니다.",
        "ㄷ. 몸이 털로 덮여 있습니다.",
        "ㄹ. 머리에 더듬이가 있습니다."
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
        "다리가 없습니다."
      ]
    },
    "explanation": "뱀, 지렁이, 달팽이는 다리가 없어서 몸을 땅에 대고 기어 다녀요. 더듬이는 달팽이에게만 있어요.",
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
    "id": "s32-u02-v007",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 물에서 사는 동물에 대한 설명입니다. 빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 각각 쓰세요.",
    "givens": {
      "지문": "• 전복은 [ ㉠ ]을(를) 이용해 물속 바위에 붙어서 기어 다닙니다.\n• 조개는 딱딱한 [ ㉡ ](으)로 몸이 둘러싸여 있습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-배발, ㉡-껍데기",
      "accepted": [
        "㉠-배발, ㉡-껍데기",
        "배발, 껍데기",
        "배발 껍데기",
        "㉠ 배발 ㉡ 껍데기",
        "㉠ 배발, ㉡ 껍데기"
      ]
    },
    "explanation": "전복은 지느러미가 없고 배발로 바위에 붙어 기어 다녀요. 조개는 비늘이 아니라 딱딱한 껍데기로 몸을 보호해요.",
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
    "id": "s32-u02-v008",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "강이나 호수의 물속에서 사는 동물을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "보기": [
        "ㄱ. 붕어",
        "ㄴ. 수달",
        "ㄷ. 다슬기",
        "ㄹ. 개구리"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ, ㄷ",
      "accepted": [
        "ㄱ, ㄷ",
        "ㄱ,ㄷ",
        "ㄱㄷ",
        "ㄷ, ㄱ",
        "ㄷ,ㄱ",
        "붕어, 다슬기",
        "다슬기, 붕어"
      ]
    },
    "explanation": "붕어와 다슬기는 물속에서 살아요. 수달과 개구리는 강가나 호숫가에서 땅과 물을 오가며 살아요.",
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
    "id": "s32-u02-v009",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "개미를 관찰한 내용으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "몸이 머리, 가슴, 배로 나뉩니다.",
      "머리에 더듬이가 없습니다.",
      "몸이 깃털로 덮여 있습니다.",
      "다리가 네 쌍 있습니다.",
      "배발을 이용해 바닥을 기어 다닙니다."
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
    "explanation": "개미는 곤충이라서 몸이 머리, 가슴, 배로 나뉘고 다리가 세 쌍, 더듬이가 한 쌍 있어요.",
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
    "id": "s32-u02-v010",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "참새와 비둘기의 공통점으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "부리가 있습니다.",
      "날개가 한 쌍 있습니다.",
      "다리가 한 쌍 있습니다.",
      "몸이 깃털로 덮여 있습니다.",
      "머리에 더듬이가 있습니다."
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
    "explanation": "참새와 비둘기는 새라서 부리와 깃털, 한 쌍의 날개와 한 쌍의 다리가 있어요. 더듬이는 개미나 나비 같은 곤충에게 있어요.",
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
    "id": "s32-u02-v011",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "사막에서 사는 동물이 겪는 어려움으로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "마실 물을 구하기 어렵습니다.",
      "뜨거운 햇볕을 피할 그늘이 적습니다.",
      "모래바람이 불어 모래가 날아듭니다.",
      "낮과 밤의 기온 차이가 매우 큽니다.",
      "밤에도 낮처럼 매우 덥습니다."
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
    "explanation": "사막은 낮에는 매우 덥지만 밤에는 기온이 많이 내려가요. 그래서 낮과 밤의 기온 차이가 커요.",
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
    "id": "s32-u02-v012",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "사막에서 사는 동물과 그 동물이 사막에서 살기에 알맞은 특징을 잘못 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "낙타 - 발바닥이 넓어 모래에 잘 빠지지 않습니다.",
      "사막여우 - 몸에 비해 귀가 커서 열을 내보내기 쉽습니다.",
      "사막 딱정벌레 - 새벽에 몸에 맺힌 이슬을 모아 마십니다.",
      "사막 도마뱀 - 두 발씩 번갈아 들어 올리며 열을 식힙니다.",
      "사막여우 - 등의 혹에 지방을 저장해 두고 지냅니다."
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
    "explanation": "등의 혹에 지방을 저장하는 동물은 사막여우가 아니라 낙타예요. 사막여우는 큰 귀로 몸의 열을 내보내요.",
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
    "id": "s32-u02-v013",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물속에서 빨리 헤엄치는 산천어의 몸 모양을 활용해 만든 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 집게 차",
        "ㄴ. 등산화",
        "ㄷ. 고속열차"
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
        "고속열차"
      ]
    },
    "explanation": "산천어의 앞부분이 부드러운 곡선 모양이라 물속에서 빨리 헤엄치는 것을 활용해, 앞부분이 곡선 모양인 고속열차를 만들었어요.",
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
    "id": "s32-u02-v014",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "우리 생활에서 동물의 특징을 활용한 예가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "집게 차",
      "냉장고",
      "물갈퀴",
      "등산화",
      "고속열차"
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
    "explanation": "집게 차는 수리의 발, 물갈퀴는 오리의 발, 등산화는 산양의 발바닥, 고속열차는 산천어의 몸 모양을 활용했어요. 냉장고는 동물의 특징을 본뜬 것이 아니에요.",
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
    "id": "s32-u02-v015",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "모기의 특징을 활용하여 만들 수 있는 로봇으로 가장 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "좁은 틈으로 기어들어가 살피는 로봇",
      "피를 조금 뽑아 검사하는 의료용 로봇",
      "무거운 물건을 집어 옮기는 로봇",
      "바닷속에서 여러 방향으로 움직이는 로봇",
      "물속 바위에 단단히 붙어 일하는 로봇"
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
    "explanation": "모기는 가늘고 뾰족한 입으로 피를 빨아 먹어요. 이 특징을 활용하면 피를 뽑아 검사하는 의료용 로봇을 만들 수 있어요.",
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
    "id": "s32-u02-v016",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "우리 주변에서 동물을 관찰한 내용으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "연못 물 위에서 소금쟁이를 볼 수 있습니다.",
      "나뭇가지에서 까치를 볼 수 있습니다.",
      "건물 벽에서 거미를 볼 수 있습니다.",
      "화단의 꽃에서 나비를 볼 수 있습니다.",
      "화단의 흙 속에서 붕어를 볼 수 있습니다."
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
    "explanation": "붕어는 아가미로 숨을 쉬는 물고기라서 강이나 호수의 물속에서 살아요. 화단의 흙 속에서는 지렁이나 개미를 볼 수 있어요.",
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
    "id": "s32-u02-v017",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "학교 화단에서 여러 동물을 볼 수 있는 까닭으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 꽃의 꿀이나 풀잎 같은 먹이가 많기 때문입니다.",
        "ㄴ. 흙과 돌 틈에 집을 짓거나 쉴 곳이 있기 때문입니다.",
        "ㄷ. 넓고 탁 트여 있어 동물이 멀리서도 잘 보이기 때문입니다."
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
        "넓고 탁 트여 있어 동물이 멀리서도 잘 보이기 때문입니다."
      ]
    },
    "explanation": "화단에는 먹이와 쉴 곳이 많고, 풀과 꽃에 가려 동물이 눈에 잘 띄지 않아 숨기 좋아요. 잘 보이는 곳은 오히려 숨기 어려워요.",
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
    "id": "s32-u02-v018",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "동물을 분류하는 기준으로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "날개가 있는가?",
      "생김새가 귀여운가?",
      "더듬이가 있는가?",
      "다리가 있는가?",
      "땅속에서 사는가?"
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
    "explanation": "귀여운지는 사람마다 다르게 느끼므로 분류 기준이 될 수 없어요. 누가 분류해도 같은 결과가 나오는 것을 기준으로 정해요.",
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
    "id": "s32-u02-v019",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같이 동물을 분류했을 때의 분류 기준으로 알맞은 것을 고르세요.",
    "givens": {
      "표": {
        "왼쪽 무리": [
          "금붕어, 고등어, 상어, 붕어"
        ],
        "오른쪽 무리": [
          "수달, 다슬기, 오리, 게"
        ]
      }
    },
    "choices": [
      "아가미가 있는가?",
      "다리가 있는가?",
      "날개가 있는가?",
      "물속에서 살 수 있는가?",
      "지느러미가 있는가?"
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
    "explanation": "금붕어, 고등어, 상어, 붕어는 지느러미가 있고 수달, 다슬기, 오리, 게는 지느러미가 없어요. 아가미는 다슬기와 게에게도 있어서 두 무리를 가르지 못해요.",
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
    "id": "s32-u02-v020",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "땅속에서 사는 동물에 대한 설명으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 모두 다리가 세 쌍 있습니다.",
        "ㄴ. 모두 땅 위로는 전혀 나오지 않습니다.",
        "ㄷ. 두더지처럼 앞발로 땅을 파는 동물도 있습니다."
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
        "두더지처럼 앞발로 땅을 파는 동물도 있습니다."
      ]
    },
    "explanation": "땅속에는 다리가 없어 기어 다니는 지렁이도 있고, 크고 단단한 앞발로 땅을 파는 두더지도 있어요.",
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
    "id": "s32-u02-v021",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "강가나 호숫가에서 땅과 물을 오가며 사는 동물을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "붕어",
      "수달",
      "다람쥐",
      "개구리",
      "송사리"
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
    "explanation": "수달과 개구리는 강가나 호숫가에서 땅과 물을 오가며 살아요. 붕어와 송사리는 물속, 다람쥐는 땅 위에서 살아요.",
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
    "id": "s32-u02-v022",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물에서 사는 동물 중에서 사는 곳이 같은 동물끼리 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "상어, 다슬기",
      "게, 수달",
      "붕어, 오징어",
      "고등어, 가오리",
      "개구리, 전복"
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
    "explanation": "고등어와 가오리는 둘 다 바다에서 살아요. 다슬기·붕어는 강이나 호수, 게는 갯벌, 수달·개구리는 강가나 호숫가, 상어·오징어·전복은 바다에서 살아요.",
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
    "id": "s32-u02-v023",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다슬기에 대한 설명으로 옳은 것을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "보기": [
        "ㄱ. 몸이 비늘로 덮여 있습니다.",
        "ㄴ. 강이나 호수에서 삽니다.",
        "ㄷ. 지느러미로 빠르게 헤엄칩니다.",
        "ㄹ. 배발로 바위에 붙어 기어 다닙니다."
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
        "ㄴㄹ",
        "ㄹ, ㄴ",
        "ㄹ,ㄴ"
      ]
    },
    "explanation": "다슬기는 강이나 호수에 살며 단단한 껍데기가 있고, 배발로 바위에 붙어 기어 다녀요. 비늘과 지느러미는 물고기의 특징이에요.",
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
    "id": "s32-u02-v024",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "잠자리에 대한 설명으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 날다가 공중에서 멈출 수 있습니다.",
        "ㄴ. 두 쌍의 날개와 세 쌍의 다리가 있습니다.",
        "ㄷ. 몸이 깃털로 덮여 있습니다."
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
        "몸이 깃털로 덮여 있습니다."
      ]
    },
    "explanation": "잠자리는 곤충이라서 날개가 두 쌍, 다리가 세 쌍 있어요. 몸이 깃털로 덮여 있는 것은 새의 특징이에요.",
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
    "id": "s32-u02-v025",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "참새와 나비가 모두 하늘을 잘 날 수 있는 까닭으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "부리가 있기 때문입니다.",
      "날개가 있기 때문입니다.",
      "깃털이 있기 때문입니다.",
      "다리가 세 쌍이기 때문입니다.",
      "몸이 비교적 가볍기 때문입니다."
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
    "explanation": "날아다니는 동물은 모두 날개가 있고 몸이 비교적 가벼워요. 부리와 깃털은 새에게만, 세 쌍의 다리는 곤충에게만 있어요.",
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
    "id": "s32-u02-v026",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "<보기>에서 날개가 있고 하늘을 날 수 있는 동물을 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 타조",
        "ㄴ. 펭귄",
        "ㄷ. 황조롱이"
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
        "황조롱이"
      ]
    },
    "explanation": "타조와 펭귄은 날개가 있지만 하늘을 날지 못해요. 황조롱이는 날개로 하늘을 날아다니는 새예요.",
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
    "id": "s32-u02-v027",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "사막에서 사는 동물 중 등에 혹이 있는 동물을 <보기>에서 골라 기호와 이름을 쓰고, 이 동물이 혹이 있어서 사막에서 살기에 좋은 점을 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 사막 딱정벌레",
        "ㄴ. 낙타",
        "ㄷ. 전갈"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "ㄴ 낙타예요. 낙타는 등의 혹에 지방이 저장되어 있어서 먹이가 부족한 사막에서 며칠 동안 먹이를 먹지 않고도 지낼 수 있어요.",
      "rubric": {
        "required": [
          "ㄴ 낙타를 고른다",
          "혹에 저장된 지방 덕분에 먹이를 먹지 않고도 며칠 동안 지낼 수 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "낙타의 혹에는 물이 아니라 지방이 저장되어 있어요. 그래서 먹이가 부족한 사막에서도 며칠 동안 먹지 않고 지낼 수 있어요.",
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
    "id": "s32-u02-v028",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음에서 설명하는 동물은 무엇인지 쓰세요.",
    "givens": {
      "지문": "• 사막에서 삽니다.\n• 세 쌍의 다리가 있는 곤충입니다.\n• 새벽에 땅 위로 나와 몸에 맺힌 이슬을 모아 마십니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "사막 딱정벌레",
      "accepted": [
        "사막 딱정벌레",
        "사막딱정벌레",
        "딱정벌레"
      ]
    },
    "explanation": "사막 딱정벌레는 비가 거의 오지 않는 사막에서 새벽에 몸에 맺힌 이슬을 모아 마셔 물을 얻어요.",
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
    "id": "s32-u02-v029",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 우리 생활에서 동물의 특징을 활용한 예입니다. 빈칸에 들어갈 알맞은 말을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "등산화는 가파른 바위에서도 잘 미끄러지지 않는 [      ]의 발바닥을 활용하여 만든 것입니다.",
      "보기": [
        "ㄱ. 오리",
        "ㄴ. 산양",
        "ㄷ. 수리"
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
        "산양"
      ]
    },
    "explanation": "산양의 발바닥이 가파른 바위에서도 잘 미끄러지지 않는 특징을 활용해 등산화를 만들었어요.",
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
    "id": "s32-u02-v030",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "집게 차를 만들 때 활용한 동물과 그 동물의 특징을 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "오리 - 발에 물갈퀴가 있습니다.",
      "산양 - 발바닥이 잘 미끄러지지 않습니다.",
      "홍합 - 바위에 붙으면 잘 떨어지지 않습니다.",
      "상어 - 피부가 물이 잘 흐르게 합니다.",
      "수리 - 발로 먹이를 잡으면 놓치지 않습니다."
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
    "explanation": "수리의 발이 먹이를 잘 잡고 놓치지 않는 특징을 활용해 물건을 집어 옮기는 집게 차를 만들었어요.",
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
    "id": "s32-u02-v031",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "<보기>에서 세 쌍의 다리가 있지만 날개는 없는 동물을 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 참새",
        "ㄴ. 개미",
        "ㄷ. 지렁이",
        "ㄹ. 나비"
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
        "개미",
        "ㄴ. 개미"
      ]
    },
    "explanation": "개미는 곤충이라 다리가 세 쌍 있지만 날개가 없어요. 나비는 날개가 두 쌍, 참새는 날개가 한 쌍 있고, 지렁이는 다리가 없어요.",
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
    "id": "s32-u02-v032",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같은 특징을 가지고 있는 동물을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "• 몸이 깃털로 덮여 있습니다.\n• 부리가 있고 날개가 한 쌍 있습니다.",
      "보기": [
        "ㄱ. 개미",
        "ㄴ. 까치",
        "ㄷ. 거미",
        "ㄹ. 고양이"
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
        "까치",
        "ㄴ. 까치"
      ]
    },
    "explanation": "깃털과 부리, 한 쌍의 날개는 새의 특징이에요. 보기에서 새는 까치뿐이에요.",
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
    "id": "s32-u02-v033",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "숨을 곳과 먹이가 많아서 여러 가지 동물을 관찰하기에 가장 알맞은 곳을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 아파트 엘리베이터 안",
        "ㄴ. 풀과 나무가 우거진 공원 숲",
        "ㄷ. 교실 칠판 앞",
        "ㄹ. 아스팔트 주차장"
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
        "풀과 나무가 우거진 공원 숲",
        "공원 숲",
        "ㄴ. 공원 숲"
      ]
    },
    "explanation": "풀과 나무가 우거진 곳은 먹이가 많고 다른 동물의 눈에 잘 띄지 않아 숨기 좋아서 여러 동물이 살아요.",
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
    "id": "s32-u02-v034",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빈칸에 공통으로 들어갈 알맞은 말을 고르세요.",
    "givens": {
      "지문": "• □(이)가 있는 동물: 참새, 오리\n• □(이)가 없는 동물: 고양이, 개미"
    },
    "choices": [
      "다리",
      "깃털",
      "더듬이",
      "아가미",
      "지느러미"
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
    "explanation": "참새와 오리는 몸이 깃털로 덮여 있고 고양이와 개미는 깃털이 없어요. 다리는 네 동물 모두 있어서 두 무리를 가르지 못해요.",
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
    "id": "s32-u02-v035",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같이 동물을 분류하였을 때 잘못 분류한 동물을 모두 골라 쓰세요. (정답 2개)",
    "givens": {
      "표": {
        "다리가 있는가?": [
          "그렇다.",
          "그렇지 않다."
        ],
        "동물": [
          "개미, 참새, 고양이, 지렁이, 개구리",
          "뱀, 달팽이, 붕어, 메뚜기"
        ]
      }
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "지렁이, 메뚜기",
      "accepted": [
        "지렁이, 메뚜기",
        "지렁이,메뚜기",
        "메뚜기, 지렁이",
        "메뚜기,지렁이",
        "지렁이 메뚜기",
        "메뚜기 지렁이"
      ]
    },
    "explanation": "지렁이는 다리가 없어 ‘그렇지 않다.’에, 메뚜기는 다리가 세 쌍 있어 ‘그렇다.’에 들어가야 해요.",
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
    "id": "s32-u02-v036",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "날개가 있는지에 따라 동물을 분류할 때 날개가 있는 동물끼리 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "개미, 참새, 공벌레",
      "나비, 고양이, 오리",
      "달팽이, 메뚜기, 꿀벌",
      "잠자리, 까치, 매미",
      "타조, 뱀, 비둘기"
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
    "explanation": "잠자리, 까치, 매미는 모두 날개가 있어요. 개미·공벌레·고양이·달팽이·뱀은 날개가 없어요.",
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
    "id": "s32-u02-v037",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음에서 설명하는 동물을 고르세요.",
    "givens": {
      "지문": "• 땅 위와 땅속을 오가며 삽니다.\n• 다리가 없어 배를 땅에 대고 기어 다닙니다.\n• 몸이 길고 비늘로 덮여 있습니다."
    },
    "choices": [
      "뱀",
      "개미",
      "지렁이",
      "두더지",
      "달팽이"
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
    "explanation": "땅 위와 땅속을 오가며 살고, 다리가 없어 배를 땅에 대고 기어 다니며 몸이 비늘로 덮인 동물은 뱀이에요.",
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
    "id": "s32-u02-v038",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "땅에서 사는 동물 중 다리로 걷거나 뛰어서 이동하는 동물을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 지렁이",
        "ㄴ. 달팽이",
        "ㄷ. 노루"
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
        "노루",
        "ㄷ. 노루"
      ]
    },
    "explanation": "노루는 네 다리로 걷거나 뛰어다녀요. 지렁이와 달팽이는 다리가 없어서 기어 다녀요.",
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
    "id": "s32-u02-v039",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "땅에서 사는 동물에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "모두 다리가 있습니다.",
      "땅속에서만 생활합니다.",
      "아가미로 숨을 쉽니다.",
      "다리가 없는 동물은 기어서 이동합니다.",
      "땅 위와 땅속을 오가며 사는 동물도 있습니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        3,
        4
      ]
    },
    "explanation": "땅에서 사는 동물 중 다리가 없는 뱀·지렁이는 기어서 이동하고, 개미처럼 땅 위와 땅속을 오가며 사는 동물도 있어요. 아가미는 물에서 사는 동물에게 있어요.",
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
    "id": "s32-u02-v040",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물에서 사는 동물에 대한 설명으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 고등어는 몸이 비늘로 덮여 있습니다.",
        "ㄴ. 게는 다리로 갯벌을 걸어 다닙니다.",
        "ㄷ. 조개는 지느러미로 헤엄쳐 다닙니다."
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
        "ㄷ. 조개는 지느러미로 헤엄쳐 다닙니다."
      ]
    },
    "explanation": "조개는 지느러미가 없고 딱딱한 껍데기 밖으로 내민 발로 땅을 파고들거나 기어 다녀요.",
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
    "id": "s32-u02-v041",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음에서 설명하는 동물의 이름을 쓰세요.",
    "givens": {
      "지문": "• 바다에서 삽니다.\n• 몸이 납작하고 넓습니다.\n• 지느러미를 물결치듯 움직여 헤엄칩니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "가오리",
      "accepted": [
        "가오리"
      ]
    },
    "explanation": "가오리는 바다에 사는 물고기로 몸이 납작하고 넓으며 지느러미를 움직여 헤엄쳐요.",
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
    "id": "s32-u02-v042",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "게가 이동하는 방법을 고르세요.",
    "givens": null,
    "choices": [
      "날개를 이용하여 날아다닙니다.",
      "지느러미를 이용하여 헤엄쳐 이동합니다.",
      "배발을 이용하여 바위에 붙어 기어 다닙니다.",
      "다리를 이용하여 갯벌을 걸어 다닙니다.",
      "배를 땅에 대고 구불구불 기어 다닙니다."
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
    "explanation": "게는 지느러미가 없고 여러 쌍의 다리로 갯벌을 걸어 다녀요. 배발로 기어 다니는 것은 전복이나 다슬기예요.",
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
    "id": "s32-u02-v043",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음에서 날아다니는 새를 모두 골라 쓰세요. (정답 3개)",
    "givens": {
      "지문": "나비, 비둘기, 매미, 황조롱이, 잠자리, 직박구리"
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "비둘기, 황조롱이, 직박구리",
      "accepted": [
        "비둘기, 황조롱이, 직박구리",
        "비둘기, 직박구리, 황조롱이",
        "황조롱이, 비둘기, 직박구리",
        "황조롱이, 직박구리, 비둘기",
        "직박구리, 비둘기, 황조롱이",
        "직박구리, 황조롱이, 비둘기",
        "비둘기,황조롱이,직박구리",
        "비둘기 황조롱이 직박구리"
      ]
    },
    "explanation": "비둘기, 황조롱이, 직박구리는 부리와 깃털이 있고 날개가 한 쌍인 새예요. 나비, 매미, 잠자리는 날개가 두 쌍인 곤충이에요.",
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
    "id": "s32-u02-v044",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "까치에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "부리가 있습니다.",
      "날개가 한 쌍 있습니다.",
      "몸이 깃털로 덮여 있습니다.",
      "다리가 세 쌍 있습니다.",
      "나무 사이를 날아다닙니다."
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
    "explanation": "까치는 새라서 다리가 한 쌍 있어요. 다리가 세 쌍 있는 것은 곤충의 특징이에요.",
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
    "id": "s32-u02-v045",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 동물들의 공통점을 고르세요.",
    "givens": {
      "지문": "▲참새 ▲잠자리"
    },
    "choices": [
      "부리가 있습니다.",
      "더듬이가 있습니다.",
      "몸이 깃털로 덮여 있습니다.",
      "다리가 세 쌍 있습니다.",
      "날개가 있습니다."
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
    "explanation": "참새와 잠자리는 모두 날개가 있어 날아다녀요. 부리와 깃털은 참새에게만, 더듬이와 세 쌍의 다리는 잠자리에게만 있어요.",
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
    "id": "s32-u02-v046",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같은 특징을 가진 동물들이 주로 사는 곳을 고르세요.",
    "givens": {
      "지문": "• 콧구멍을 여닫을 수 있어 모래바람이 불어도 콧속으로 모래가 잘 들어가지 않습니다.\n• 몸에 비해 귀가 커서 몸의 열을 밖으로 내보내기 쉽습니다."
    },
    "choices": [
      "땅속",
      "갯벌",
      "사막",
      "강가나 호숫가",
      "화단"
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
    "explanation": "모래바람이 불고 매우 더운 곳에서 살기에 알맞은 특징이에요. 이런 동물은 사막에서 살아요.",
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
    "id": "s32-u02-v047",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "사막여우가 사막에서 잘 살 수 있는 특징을 고르세요.",
    "givens": null,
    "choices": [
      "콧구멍을 여닫을 수 있습니다.",
      "앞다리로 땅을 잘 팔 수 있습니다.",
      "몸에 비해 귀가 커서 열을 내보냅니다.",
      "새벽에 몸에 맺힌 이슬을 모아 마십니다.",
      "등에 있는 혹에 지방을 저장합니다."
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
    "explanation": "사막여우는 몸에 비해 큰 귀로 몸의 열을 밖으로 내보내 더운 사막에서 살 수 있어요. 나머지는 낙타, 사막 거북, 사막 딱정벌레의 특징이에요.",
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
    "id": "s32-u02-v048",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음에서 설명하는 특징을 활용해 만든 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "홍합이 세찬 파도에도 바위에서 떨어지지 않고 붙어 있는 특징을 활용한 것입니다.",
      "보기": [
        "ㄱ. 물갈퀴",
        "ㄴ. 물속에서 쓸 수 있는 접착제",
        "ㄷ. 수영복"
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
        "물속에서 쓸 수 있는 접착제",
        "접착제"
      ]
    },
    "explanation": "홍합이 바위에 단단히 붙어 있는 특징을 활용해 물속에서도 쓸 수 있는 접착제를 만들었어요.",
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
    "id": "s32-u02-v049",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "수영복을 만드는 데 활용한 동물의 특징으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "수리의 발",
      "오리의 발",
      "상어의 피부",
      "산천어의 모양",
      "바위에 붙은 홍합"
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
    "explanation": "상어의 피부가 물이 잘 흐르게 하는 특징을 활용해 물속에서 빨리 헤엄칠 수 있는 수영복을 만들었어요.",
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
    "id": "s32-u02-v050",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같은 특징의 탐사 로봇을 만들 때 활용한 동물은 무엇인지 고르세요.",
    "givens": {
      "지문": "• 가늘고 긴 몸을 구불구불 움직이며 좁은 틈으로 기어들어갑니다.\n• 무너진 건물 속처럼 사람이 들어가기 어려운 곳을 살필 수 있습니다."
    },
    "choices": [
      "뱀",
      "매미",
      "모기",
      "오리",
      "수리"
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
    "explanation": "뱀은 가늘고 긴 몸을 구불구불 움직여 좁은 곳으로 기어들어갈 수 있어요. 이 특징을 활용해 무너진 건물 속을 살피는 로봇을 만들 수 있어요.",
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
    "id": "s32-u02-v051",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "연못의 물 위에서 주로 볼 수 있는 동물을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 다람쥐",
        "ㄴ. 소금쟁이",
        "ㄷ. 공벌레"
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
        "소금쟁이"
      ]
    },
    "explanation": "소금쟁이는 연못이나 개울의 물 위에서 살아요. 다람쥐는 산이나 숲, 공벌레는 화단이나 돌 밑에서 볼 수 있어요.",
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
    "id": "s32-u02-v052",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "나비의 특징에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "날아다닙니다.",
      "더듬이가 한 쌍 있습니다.",
      "다리가 세 쌍 있습니다.",
      "꽃에서 꿀을 빨아 먹습니다.",
      "날개가 한 쌍 있습니다."
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
    "explanation": "나비는 곤충이라서 날개가 두 쌍, 다리가 세 쌍 있어요. 날개가 한 쌍인 것은 새예요.",
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
    "id": "s32-u02-v053",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "공원 풀숲에 동물이 많이 사는 까닭으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "숨을 곳이 많기 때문입니다.",
      "먹이를 구하기 쉽기 때문입니다.",
      "바람이 세게 불어 시원하기 때문입니다.",
      "풀잎 사이에서 쉴 수 있기 때문입니다.",
      "알을 낳거나 집을 지을 곳이 있기 때문입니다."
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
    "explanation": "풀숲에는 먹이가 많고, 숨거나 쉬거나 집을 지을 곳이 있어서 동물이 많이 살아요. 바람이 세게 부는 것은 그 까닭이 아니에요.",
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
    "id": "s32-u02-v054",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "땅속에서 사는 동물끼리 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "두더지, 지렁이",
      "참새, 두더지",
      "소금쟁이, 개미",
      "땅강아지, 붕어",
      "다람쥐, 비둘기"
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
    "explanation": "두더지와 지렁이는 땅속에서 살아요. 참새·비둘기는 날아다니고, 소금쟁이는 물 위, 붕어는 물속, 다람쥐는 땅 위에서 살아요.",
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
    "id": "s32-u02-v055",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같이 동물을 분류할 때 분류 기준으로 알맞은 것을 고르세요.",
    "givens": {
      "표": {
        "분류 1": [
          "붕어, 개구리, 나비, 뱀"
        ],
        "분류 2": [
          "고양이, 소, 다람쥐, 수달"
        ]
      }
    },
    "choices": [
      "알을 낳는가?",
      "다리가 있는가?",
      "물속에서 사는가?",
      "날개가 있는가?",
      "더듬이가 있는가?"
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
    "explanation": "붕어, 개구리, 나비, 뱀은 알을 낳고 고양이, 소, 다람쥐, 수달은 새끼를 낳아요. 다리는 개구리·나비에게도 있어서 두 무리를 가르지 못해요.",
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
    "id": "s32-u02-v056",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "동물을 분류하는 기준으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "무섭게 생겼는가?",
      "냄새가 좋은가?",
      "다리가 있는가?",
      "몸집이 큰 편인가?",
      "털 색깔이 멋진가?"
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
    "explanation": "다리가 있는지는 누가 보아도 같은 결과가 나와요. 무섭다, 크다, 멋지다는 사람마다 다르게 느껴서 기준이 될 수 없어요.",
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
    "id": "s32-u02-v057",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "땅 위와 땅속을 오가며 사는 동물을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 소",
        "ㄴ. 개미",
        "ㄷ. 노루"
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
        "개미"
      ]
    },
    "explanation": "개미는 땅속에 집을 짓고 땅 위로 나와 먹이를 구해요. 소와 노루는 땅 위에서 살아요.",
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
    "id": "s32-u02-v058",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두더지와 지렁이의 특징을 바르게 비교한 것을 고르세요. (앞은 두더지, 뒤는 지렁이)",
    "givens": null,
    "choices": [
      "기어 다닙니다. / 걸어 다닙니다.",
      "땅 위에서만 삽니다. / 물속에서만 삽니다.",
      "다리가 세 쌍 있습니다. / 다리가 여러 쌍 있습니다.",
      "앞발로 땅을 팝니다. / 다리 없이 기어 다닙니다.",
      "몸이 깃털로 덮여 있습니다. / 몸이 비늘로 덮여 있습니다."
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
    "explanation": "두더지는 크고 단단한 앞발로 땅을 파며 땅속에서 살고, 지렁이는 다리가 없어 땅속을 기어 다녀요.",
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
    "id": "s32-u02-v059",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "이동하는 방법이 나머지 넷과 다른 것을 고르세요.",
    "givens": null,
    "choices": [
      "소",
      "노루",
      "토끼",
      "달팽이",
      "다람쥐"
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
    "explanation": "소, 노루, 토끼, 다람쥐는 다리로 걷거나 뛰어다니지만 달팽이는 다리가 없어 기어서 이동해요.",
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
    "id": "s32-u02-v060",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음의 동물들이 주로 사는 곳을 고르세요.",
    "givens": {
      "지문": "▲게 ▲조개"
    },
    "choices": [
      "땅속",
      "갯벌",
      "사막",
      "화단",
      "강가나 호숫가"
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
    "explanation": "게와 조개는 바닷물이 드나드는 갯벌에서 주로 살아요. 게는 다리로 걸어 다니고 조개는 갯벌 속을 파고들어요.",
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
    "id": "s32-u02-v061",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "붕어를 관찰한 내용으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "아가미로 숨을 쉽니다.",
      "몸이 털로 덮여 있습니다.",
      "배발로 기어 다닙니다.",
      "지느러미로 헤엄칩니다.",
      "딱딱한 껍데기가 있습니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "붕어는 물고기라서 아가미로 숨을 쉬고 지느러미로 헤엄쳐요. 배발과 딱딱한 껍데기는 다슬기나 전복 같은 동물의 특징이에요.",
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
    "id": "s32-u02-v062",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "고등어가 물속에서 생활하기에 알맞은 점이 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "아가미가 있어 물속에서 숨을 쉴 수 있습니다.",
      "지느러미가 있어 물속에서 헤엄을 잘 칩니다.",
      "몸이 부드러운 곡선 형태라 빨리 헤엄칩니다.",
      "다리가 네 개 있어 물속 바닥을 빠르게 걸어 다닙니다.",
      "몸의 옆에 옆줄이 있어 물의 흐름을 느낄 수 있습니다."
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
    "explanation": "고등어는 다리가 없고 지느러미로 헤엄쳐요. 아가미, 지느러미, 곡선 형태의 몸, 옆줄은 물속 생활에 알맞은 점이에요.",
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
    "id": "s32-u02-v063",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같은 특징이 있는 동물을 고르세요.",
    "givens": {
      "지문": "날개가 두 쌍, 다리가 세 쌍 있고, 머리에 더듬이가 있으며, 꽃의 꿀을 빨아 먹으며 날아다닙니다."
    },
    "choices": [
      "참새",
      "나비",
      "까치",
      "비둘기",
      "타조"
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
    "explanation": "날개가 두 쌍, 다리가 세 쌍이고 더듬이가 있는 동물은 곤충이에요. 보기에서 곤충은 나비뿐이고 나머지는 새예요.",
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
    "id": "s32-u02-v064",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "까치와 매미의 공통점을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 부리가 있습니다.",
        "ㄴ. 날개가 있어 날 수 있습니다.",
        "ㄷ. 다리가 세 쌍 있습니다."
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
        "날개가 있어 날 수 있습니다."
      ]
    },
    "explanation": "까치와 매미는 모두 날개가 있어 날아다녀요. 부리는 새인 까치에게만, 세 쌍의 다리는 곤충인 매미에게만 있어요.",
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
    "id": "s32-u02-v065",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다리의 개수가 나머지와 다른 동물을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 매미",
        "ㄴ. 잠자리",
        "ㄷ. 참새",
        "ㄹ. 나비"
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
        "참새"
      ]
    },
    "explanation": "매미, 잠자리, 나비는 곤충이라 다리가 세 쌍이고, 새인 참새는 다리가 한 쌍이에요.",
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
    "id": "s32-u02-v066",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "바람이 세게 부는 사막에서 낙타가 콧구멍을 닫아 콧속으로 들어오지 않게 막는 것은 무엇인지 고르세요.",
    "givens": null,
    "choices": [
      "물",
      "열",
      "모래",
      "지방",
      "이슬"
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
    "explanation": "낙타는 콧구멍을 여닫을 수 있어서 모래바람이 불어도 콧속으로 모래가 잘 들어가지 않아요.",
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
    "id": "s32-u02-v067",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "사막 도마뱀이 뜨거운 사막의 모래 위에서 잘 살 수 있는 까닭을 발을 움직이는 방법과 관련지어 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "사막 도마뱀은 한 번에 두 발씩 번갈아 들어 올려서 뜨거운 모래에 닿은 발의 열을 식혀요.",
      "rubric": {
        "required": [
          "한 번에 두 발씩 번갈아 들어 올린다",
          "뜨거운 모래에 닿은 발의 열을 식힌다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "사막 도마뱀은 두 발씩 번갈아 들어 올려 뜨거운 모래에 발이 닿는 시간을 줄이고 열을 식혀요.",
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
    "id": "s32-u02-v068",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "오리의 특징을 활용해 만든 것을 고르세요.",
    "givens": null,
    "choices": [
      "물갈퀴",
      "집게 차",
      "고속열차",
      "등산화",
      "수영복"
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
    "explanation": "오리의 발에 있는 물갈퀴가 헤엄을 잘 치게 해 주는 특징을 활용해 물갈퀴를 만들었어요.",
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
    "id": "s32-u02-v069",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "고속열차는 어떤 동물의 특징을 활용해 만든 것인지 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 오리의 발",
        "ㄴ. 산천어의 몸 모양",
        "ㄷ. 상어의 피부",
        "ㄹ. 수리의 발"
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
        "산천어의 몸 모양",
        "산천어"
      ]
    },
    "explanation": "산천어의 몸이 부드러운 곡선 모양이라 물속에서 빨리 헤엄치는 특징을 활용해 고속열차의 앞부분을 만들었어요.",
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
    "id": "s32-u02-v070",
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
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 동물의 특징을 활용해 설계한 로봇에 대한 설명입니다. 빈칸에 들어갈 알맞은 동물을 고르세요.",
    "givens": {
      "지문": "하늘을 날다가 공중에 멈춰 떠 있으면서 사진을 찍어야 하는 비행 로봇은 [    ]의 특징을 활용하였습니다."
    },
    "choices": [
      "뱀",
      "거북",
      "잠자리",
      "오리",
      "홍합"
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
    "explanation": "잠자리는 날다가 공중에서 멈추거나 빨리 날 수 있어요. 이 특징을 활용하면 공중에 멈춰 사진을 찍는 비행 로봇을 만들 수 있어요.",
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
