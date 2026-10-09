// 3-2 Ⅵ 중간평가 — 유사문항 40 (창작). 원문 1문항당 1개, 같은 유형·난이도로 상황과 물체를 바꿨다. of = 짝이 되는 원문 (세트, 번호).
export const similar = [
  {
    "id": "s32-mid-v001",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지호는 '컵에 담긴 물의 양에 따라 컵을 두드렸을 때 나는 소리가 달라질까?'라는 탐구 문제로 탐구 계획서를 쓰고 있습니다. 탐구 계획서에 미리 적을 수 없는 것을 고르세요.",
    "givens": null,
    "choices": [
      "컵, 물, 나무 막대 같은 준비물",
      "물을 붓고 컵을 두드려 보는 순서",
      "직접 두드려 보고 알게 된 소리의 차이",
      "물이 많을수록 낮은 소리가 날 것이라는 예상",
      "컵마다 물의 양을 다르게 붓는 방법"
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
    "explanation": "직접 두드려 보고 알게 된 소리의 차이는 탐구를 실행한 뒤에야 알 수 있어요. 그래서 계획을 세울 때에는 미리 적을 수 없어요.",
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
    "id": "s32-mid-v002",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "우리 주변의 장소와 그곳에서 볼 수 있는 동물을 잘못 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "나무 위 - 매미, 까치",
      "연못 속 - 붕어, 메뚜기",
      "꽃이 핀 화단 - 나비, 꿀벌",
      "화단의 돌 밑 - 공벌레, 개미",
      "집 주변 - 개, 고양이"
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
    "explanation": "붕어는 연못 속에서 살지만 메뚜기는 풀숲이나 화단에서 볼 수 있어요. 동물마다 먹이와 숨을 곳이 있는 곳에서 살아요.",
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
    "id": "s32-mid-v003",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "동물을 분류할 때 분류 기준으로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "날개가 있는가?",
      "다리가 세 쌍인가?",
      "몸이 털로 덮여 있는가?",
      "땅속에서 살 수 있는가?",
      "털 색깔이 예쁜가?"
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
    "explanation": "예쁜지 아닌지는 사람마다 다르게 생각할 수 있어서 분류 기준이 될 수 없어요. 분류 기준은 누가 분류해도 같은 결과가 나와야 해요.",
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
    "id": "s32-mid-v004",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같이 동물을 두 무리로 분류하였을 때 분류 기준으로 알맞은 것을 고르세요.",
    "givens": {
      "표": {
        "분류 1": [
          "참새, 나비, 잠자리"
        ],
        "분류 2": [
          "다람쥐, 고양이, 달팽이"
        ]
      }
    },
    "choices": [
      "날개가 있는 것과 없는 것",
      "다리가 있는 것과 없는 것",
      "더듬이가 있는 것과 없는 것",
      "알을 낳는 것과 새끼를 낳는 것",
      "몸이 털로 덮인 것과 깃털로 덮인 것"
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
    "explanation": "참새·나비·잠자리는 모두 날개가 있고 다람쥐·고양이·달팽이는 모두 날개가 없어요. 다리나 더듬이는 두 무리 모든 동물에 맞지 않아요.",
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
    "id": "s32-mid-v005",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "땅 위와 땅속을 오가며 사는 동물을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "보기": [
        "ㄱ. 개미",
        "ㄴ. 노루",
        "ㄷ. 두더지",
        "ㄹ. 뱀",
        "ㅁ. 지렁이",
        "ㅂ. 소"
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
        "ㄱㄹ",
        "ㄹ, ㄱ",
        "ㄹ,ㄱ",
        "개미, 뱀"
      ]
    },
    "explanation": "개미와 뱀은 땅 위와 땅속을 오가며 살아요. 두더지와 지렁이는 땅속에서, 노루와 소는 땅 위에서 살아요.",
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
    "id": "s32-mid-v006",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "땅에서 사는 동물 중 이동 방법이 나머지 넷과 다른 것을 고르세요.",
    "givens": null,
    "choices": [
      "개",
      "노루",
      "거미",
      "지렁이",
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
    "explanation": "지렁이는 다리가 없어서 땅에서 기어 다녀요. 개·노루·거미·다람쥐는 다리로 걷거나 뛰어다녀요.",
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
    "id": "s32-mid-v007",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "강이나 호수에서 사는 붕어와 바다에서 사는 상어의 공통점으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "아가미로 숨을 쉽니다.",
      "물속에서 헤엄쳐 이동합니다.",
      "지느러미를 이용해 헤엄칩니다.",
      "몸이 부드러운 곡선 모양입니다.",
      "강이나 호수에서 삽니다."
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
    "explanation": "붕어는 강이나 호수에서 살지만 상어는 바닷속에서 살아요. 둘 다 아가미로 숨을 쉬고 지느러미로 헤엄치는 것은 같아요.",
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
    "id": "s32-mid-v008",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "까치, 참새, 나비, 잠자리의 공통된 특징을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "보기": [
        "ㄱ. 부리가 있습니다.",
        "ㄴ. 날개가 있습니다.",
        "ㄷ. 다리가 세 쌍 있습니다.",
        "ㄹ. 몸이 비교적 가볍습니다."
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
    "explanation": "날아다니는 새와 곤충은 모두 날개가 있고 몸이 비교적 가벼워요. 부리는 새에게만, 세 쌍의 다리는 곤충에게만 있어요.",
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
    "id": "s32-mid-v009",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "낙타가 사막에서 잘 살 수 있는 특징으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "새벽에 몸에 맺힌 이슬을 모아 마십니다.",
      "발바닥이 넓어 모래에 잘 빠지지 않습니다.",
      "등의 혹에 지방을 저장해 둘 수 있습니다.",
      "콧구멍을 여닫아 모래가 들어오지 않게 합니다.",
      "다리가 길어 땅바닥의 열기를 피할 수 있습니다."
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
    "explanation": "새벽에 몸에 맺힌 이슬을 모아 마시는 것은 사막 딱정벌레의 특징이에요. 낙타는 넓은 발바닥, 지방이 든 혹, 여닫는 콧구멍으로 사막에서 살아요.",
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
    "id": "s32-mid-v010",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "잘 미끄러지지 않는 등산화의 밑창은 어떤 동물의 특징을 활용한 것인지 고르세요.",
    "givens": null,
    "choices": [
      "오리",
      "상어",
      "문어",
      "산양",
      "두더지"
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
    "explanation": "산양의 발바닥이 가파른 바위에서도 잘 미끄러지지 않는 특징을 활용해 등산화 밑창을 만들었어요.",
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
    "id": "s32-mid-v011",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두더지의 특징을 본떠 땅속을 살펴보는 탐사 로봇을 만들려고 합니다. 이 로봇에 있어야 할 기능으로 적절하지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "단단한 흙을 잘 파헤칠 수 있어야 합니다.",
      "어두운 땅속을 비출 불빛이 있어야 합니다.",
      "땅속 벌레를 잡아먹고 힘을 낼 수 있어야 합니다.",
      "땅속에서 앞으로 잘 나아갈 수 있어야 합니다.",
      "땅속의 모습을 사진으로 찍을 수 있어야 합니다."
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
    "explanation": "로봇은 살아 있는 생물이 아니라서 먹이를 먹을 필요가 없어요. 땅을 파고, 나아가고, 어두운 곳을 살펴보는 기능이 필요해요.",
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
    "id": "s32-mid-v012",
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
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "학교 운동장의 흙과 화단의 흙을 각각 물이 든 투명한 컵에 넣고 저은 뒤 잠시 놓아두었습니다. 물 위에 뜬 나뭇잎 조각이나 뿌리 같은 물질이 더 적은 것은 어느 곳의 흙인지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "운동장 흙",
      "accepted": [
        "운동장 흙",
        "운동장흙",
        "운동장"
      ]
    },
    "explanation": "운동장 흙에는 식물의 뿌리나 나뭇잎 조각처럼 물에 뜨는 물질이 화단 흙보다 적어요.",
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
    "id": "s32-mid-v013",
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
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "운동장 흙과 화단 흙에 같은 양의 물을 부었더니 운동장 흙에서 물이 더 빨리 빠졌습니다. 그 까닭과 가장 관계가 깊은 운동장 흙의 특징을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 밝은 갈색입니다.",
        "ㄴ. 알갱이의 크기가 비교적 큽니다.",
        "ㄷ. 손으로 쥐어도 잘 뭉쳐지지 않습니다.",
        "ㄹ. 물에 뜨는 물질이 적습니다."
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
        "알갱이의 크기가 비교적 큽니다."
      ]
    },
    "explanation": "알갱이가 큰 흙은 알갱이 사이의 틈이 커서 물이 빨리 빠져요. 흙의 색깔은 물 빠짐과 관계가 없어요.",
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
    "id": "s32-mid-v014",
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
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "식물이 잘 자라는 흙의 특징을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "보기": [
        "ㄱ. 부식물이 많이 들어 있습니다.",
        "ㄴ. 알갱이가 크고 만지면 거칩니다.",
        "ㄷ. 썩은 나뭇잎이나 죽은 곤충 같은 물질이 섞여 있습니다.",
        "ㄹ. 물에 뜨는 물질이 거의 없습니다."
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
        "ㄷ,ㄱ"
      ]
    },
    "explanation": "썩은 나뭇잎이나 죽은 곤충처럼 생물이 썩어 생긴 부식물이 많은 흙에서 식물이 잘 자라요.",
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
    "id": "s32-mid-v015",
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
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자연에서 흙이 만들어지는 과정에 대한 설명으로 옳은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "흙은 몇 달 만에 쉽게 만들어집니다.",
      "흐르는 물이나 바람 때문에 바위가 부서지기도 합니다.",
      "작은 흙 알갱이들이 서로 뭉쳐서 흙이 만들어집니다.",
      "바위는 아주 단단해서 나무뿌리가 자라도 부서지지 않습니다.",
      "부서진 바위 알갱이와 생물이 썩은 물질이 섞여 흙이 됩니다."
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
    "explanation": "바위는 흐르는 물·바람·나무뿌리 등으로 아주 오랜 시간에 걸쳐 부서지고, 그 알갱이와 생물이 썩은 물질이 섞여 흙이 돼요.",
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
    "id": "s32-mid-v016",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 16
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흙 언덕의 중간쯤에 빨간색 모래를 뿌리고 흙 언덕 위쪽에서 물을 흘려보냈습니다. 빨간색 모래의 변화로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "빨간색 모래가 흙 언덕 위쪽으로 올라갑니다.",
      "빨간색 모래가 흙 언덕 아래쪽으로 옮겨집니다.",
      "빨간색 모래가 처음 뿌린 자리에 그대로 있습니다.",
      "빨간색 모래가 물에 모두 녹아 없어집니다.",
      "빨간색 모래가 흙 언덕 꼭대기에 쌓입니다."
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
    "explanation": "흐르는 물은 흙과 모래를 높은 곳에서 낮은 곳으로 옮겨요. 그래서 빨간색 모래는 흙 언덕 아래쪽으로 옮겨져요.",
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
    "id": "s32-mid-v017",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 17
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흙 언덕 위쪽에서 물을 흘려보냈을 때 ㄱ~ㄷ 중 침식 작용이 가장 활발하게 일어나는 부분과 퇴적 작용이 가장 활발하게 일어나는 부분을 골라 기호를 각각 쓰세요.",
    "givens": {
      "지문": "흙 언덕의 아래쪽을 ㄱ, 중간을 ㄴ, 위쪽을 ㄷ이라고 합니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "침식 작용-ㄷ, 퇴적 작용-ㄱ",
      "accepted": [
        "침식 작용-ㄷ, 퇴적 작용-ㄱ",
        "침식-ㄷ, 퇴적-ㄱ",
        "ㄷ, ㄱ",
        "ㄷ,ㄱ",
        "침식 작용: ㄷ, 퇴적 작용: ㄱ"
      ]
    },
    "explanation": "흙 언덕의 위쪽(ㄷ)에서는 흐르는 물이 흙을 깎는 침식 작용이, 아래쪽(ㄱ)에서는 흙을 쌓는 퇴적 작용이 가장 활발해요.",
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
    "id": "s32-mid-v018",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 18
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "강 하류에서 많이 볼 수 있는 것을 고르세요.",
    "givens": null,
    "choices": [
      "폭포",
      "계곡",
      "큰 바위",
      "가파른 골짜기",
      "고운 진흙"
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
    "explanation": "강 하류는 경사가 완만해 퇴적 작용이 활발하므로 고운 모래나 진흙을 많이 볼 수 있어요. 폭포·계곡·큰 바위는 강 상류에서 많이 볼 수 있어요.",
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
    "id": "s32-mid-v019",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 19
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "바닷물의 퇴적 작용으로 만들어진 지형을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "보기": [
        "ㄱ. 갯벌",
        "ㄴ. 바닷가 절벽",
        "ㄷ. 모래사장",
        "ㄹ. 바닷가 동굴"
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
        "갯벌, 모래사장"
      ]
    },
    "explanation": "갯벌과 모래사장은 바닷물이 진흙이나 모래를 쌓아 만든 퇴적 지형이에요. 절벽과 동굴은 바닷물이 바위를 깎아 만든 침식 지형이에요.",
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
    "id": "s32-mid-v020",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 20
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "공사장 비탈에 비가 내리면 흙이 빗물에 쓸려 내려옵니다. 이것을 막는 방법으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "비탈에 난 풀을 모두 뽑아 냅니다.",
      "비탈 위쪽에 흙을 더 높이 쌓습니다.",
      "비탈의 나무를 베어 햇빛이 들게 합니다.",
      "비탈에 그물망을 덮고 풀을 심습니다.",
      "비탈의 흙을 파헤쳐 부드럽게 만듭니다."
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
    "explanation": "풀과 나무의 뿌리, 흙을 덮는 그물망은 흙을 붙잡아 흐르는 물에 흙이 쓸려 가지 않게 막아요.",
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
    "id": "s32-mid-v021",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 탐구 문제를 해결하기 위한 탐구 계획에서 다르게 해야 할 것을 고르세요.",
    "givens": {
      "지문": "공을 떨어뜨리는 높이가 높을수록 공이 더 높이 튀어 오를까?"
    },
    "choices": [
      "공의 종류",
      "공의 크기",
      "바닥의 재질",
      "공을 떨어뜨리는 높이",
      "공이 튀어 오른 높이"
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
    "explanation": "떨어뜨리는 높이에 따라 튀어 오르는 높이를 비교하므로 떨어뜨리는 높이만 다르게 하고 나머지는 같게 해요. 공이 튀어 오른 높이는 결과로 재는 것이에요.",
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
    "id": "s32-mid-v022",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "우리 주변에 사는 동물의 생김새에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "거미는 다리가 세 쌍이고 더듬이가 있습니다.",
      "까치는 날개가 두 쌍이고 깃털로 덮여 있습니다.",
      "잠자리는 날개가 두 쌍이고 다리가 세 쌍입니다.",
      "개미는 다리가 두 쌍이고 몸이 두 부분입니다.",
      "달팽이는 다리가 한 쌍이고 몸이 털로 덮여 있습니다."
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
    "explanation": "잠자리 같은 곤충은 날개가 두 쌍, 다리가 세 쌍이에요. 거미는 다리가 네 쌍이고 더듬이가 없으며, 까치는 날개가 한 쌍이에요.",
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
    "id": "s32-mid-v023",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다리로 걸어 다니는 동물을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 뱀",
        "ㄴ. 지렁이",
        "ㄷ. 노루",
        "ㄹ. 달팽이"
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
        "노루"
      ]
    },
    "explanation": "노루는 네 다리로 걷거나 뛰어다녀요. 뱀·지렁이·달팽이는 다리가 없어 기어 다녀요.",
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
    "id": "s32-mid-v024",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 동물들의 공통점을 고르세요.",
    "givens": {
      "지문": "게, 조개, 갯지렁이, 짱뚱어"
    },
    "choices": [
      "몸이 털로 덮여 있습니다.",
      "갯벌에서 살 수 있습니다.",
      "날개가 있어 날 수 있습니다.",
      "지느러미로 헤엄칩니다.",
      "다리로 걸어 다닙니다."
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
    "explanation": "게·조개·갯지렁이·짱뚱어는 모두 갯벌에서 사는 동물이에요. 이동 방법은 걷기·기어 다니기 등으로 서로 달라요.",
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
    "id": "s32-mid-v025",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 어떤 분류 기준에 따라 동물을 분류한 결과입니다. 빈칸에 들어갈 알맞은 말을 <보기>에서 골라 쓰세요.",
    "givens": {
      "표": {
        "분류 기준": [
          "□(이)가 있는가?"
        ],
        "그렇다.": [
          "개미, 나비"
        ],
        "그렇지 않다.": [
          "참새, 거미"
        ]
      },
      "보기": [
        "깃털, 더듬이, 다리, 날개"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "더듬이",
      "accepted": [
        "더듬이"
      ]
    },
    "explanation": "개미와 나비는 더듬이가 있지만 참새와 거미는 더듬이가 없어요. 날개는 참새에게도 있어서 기준이 될 수 없어요.",
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
    "id": "s32-mid-v026",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "땅에서 사는 동물에 대한 설명으로 옳은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "지렁이는 다리가 세 쌍 있어 땅속을 걸어 다닙니다.",
      "뱀은 다리가 없어 땅 위를 기어 다닙니다.",
      "땅에서 사는 동물은 모두 다리로 걷거나 뛰어다닙니다.",
      "두더지는 앞발로 땅을 파며 땅속에서 삽니다.",
      "노루는 땅속에 굴을 파고 살며 몸이 비늘로 덮여 있습니다."
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
    "explanation": "뱀은 다리가 없어 기어 다니고, 두더지는 앞발로 땅을 파며 땅속에서 살아요. 지렁이는 다리가 없고, 노루는 털로 덮여 땅 위에서 살아요.",
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
    "id": "s32-mid-v027",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 바위에 붙어 사는 전복에 대한 설명입니다. 빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 각각 쓰세요.",
    "givens": {
      "지문": "• ㉠ (으)로 바위에 붙어서 기어 다닙니다.\n• 몸 위쪽이 단단한 ㉡ (으)로 덮여 있습니다."
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
        "㉠ 배발, ㉡ 껍데기",
        "배발, 껍데기",
        "배발,껍데기"
      ]
    },
    "explanation": "전복은 몸 아래쪽의 배발로 바위에 붙어 기어 다니고, 몸 위쪽은 단단한 껍데기로 덮여 있어요.",
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
    "id": "s32-mid-v028",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "붕어와 메기가 물속에서 헤엄을 잘 칠 수 있는 까닭과 관련 있는 공통된 특징을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "붕어와 메기는 지느러미가 있어서 물속에서 헤엄을 잘 칠 수 있어요.",
      "rubric": {
        "required": [
          "지느러미가 있다(붕어와 메기의 공통된 특징)"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "붕어와 메기 같은 물고기는 지느러미가 있어서 물속에서 헤엄을 잘 쳐요. 물갈퀴는 오리·개구리·수달의 발에 있어요.",
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
    "id": "s32-mid-v029",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "참새와 까치의 공통점이 아닌 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 날개가 한 쌍 있습니다.",
        "ㄴ. 몸이 깃털로 덮여 있습니다.",
        "ㄷ. 다리가 세 쌍 있습니다.",
        "ㄹ. 부리가 있습니다."
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
        "다리가 세 쌍 있습니다."
      ]
    },
    "explanation": "참새와 까치 같은 새는 다리가 한 쌍이에요. 다리가 세 쌍인 것은 곤충이에요.",
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
    "id": "s32-mid-v030",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "사막여우의 특징으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "몸에 비해 귀가 큽니다.",
      "귓속에 털이 많습니다.",
      "털이 모래 색과 비슷합니다.",
      "다리가 두 쌍 있습니다.",
      "등에 지방이 든 혹이 있습니다."
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
    "explanation": "등에 지방이 든 혹이 있는 것은 낙타예요. 사막여우는 큰 귀로 몸의 열을 내보내고, 귓속 털이 모래를 막아 줘요.",
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
    "id": "s32-mid-v031",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "동물과 그 동물의 특징을 활용한 예를 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "오리 - 물갈퀴",
      "상어 - 등산화",
      "수리 - 흡착판",
      "산양 - 수영복",
      "문어 - 집게 차"
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
    "explanation": "물갈퀴는 오리 발의 물갈퀴를 본떠 만들었어요. 등산화는 산양, 수영복은 상어, 흡착판은 문어, 집게 차는 수리의 특징을 활용했어요.",
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
    "id": "s32-mid-v032",
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
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 운동장 흙과 화단 흙을 관찰한 결과를 표로 정리한 것입니다. ㄱ과 ㄴ 중 운동장 흙의 특징에 해당하는 것을 골라 기호를 쓰세요.",
    "givens": {
      "표": {
        "구분": [
          "색깔",
          "손으로 쥐었다 폈을 때",
          "물에 넣었을 때 뜬 물질"
        ],
        "ㄱ": [
          "밝은 갈색",
          "잘 뭉쳐지지 않음.",
          "거의 없음."
        ],
        "ㄴ": [
          "어두운 갈색",
          "잘 뭉쳐짐.",
          "많음."
        ]
      }
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
    "explanation": "운동장 흙은 밝은 갈색이고 잘 뭉쳐지지 않으며, 물에 뜨는 물질이 거의 없어요. 화단 흙은 어둡고 잘 뭉쳐지며 부식물이 많아요.",
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
    "id": "s32-mid-v033",
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
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "알갱이의 크기에 따라 물이 빠지는 빠르기가 다른지 알아보려고 굵은 모래와 고운 모래로 실험을 하였습니다. 이 실험에서 다르게 해야 하는 조건을 고르세요.",
    "givens": null,
    "choices": [
      "붓는 물의 양",
      "넣는 모래의 양",
      "모래 알갱이의 크기",
      "깔때기의 크기와 모양",
      "물을 붓기 시작하는 때"
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
    "explanation": "알갱이의 크기에 따른 물 빠짐을 비교하므로 모래 알갱이의 크기만 다르게 하고 나머지 조건은 모두 같게 해요.",
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
    "id": "s32-mid-v034",
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
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "바위틈에서 □(이)가 자라면서 틈이 점점 벌어지고, 오랜 시간이 지나면 바위가 부서집니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "나무뿌리",
      "accepted": [
        "나무뿌리",
        "나무 뿌리",
        "뿌리",
        "식물의 뿌리"
      ]
    },
    "explanation": "바위틈에서 나무뿌리가 자라면 틈이 벌어져 바위가 부서져요. 이렇게 부서진 알갱이가 흙의 재료가 돼요.",
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
    "id": "s32-mid-v035",
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
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흙 언덕의 위쪽에서 물을 흘려보낸 결과에 대한 설명으로 옳지 않은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "흙 언덕 위쪽의 흙이 깎여 나갔습니다.",
      "흐르는 물이 흙을 옮기는 것을 퇴적 작용이라고 합니다.",
      "깎인 흙은 흐르는 물에 실려 아래쪽으로 옮겨졌습니다.",
      "흙 언덕 위쪽에서는 퇴적 작용이 가장 활발했습니다.",
      "흙 언덕 아래쪽에는 흙이 쌓였습니다."
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
    "explanation": "흐르는 물이 흙을 옮기는 것은 운반 작용이에요. 흙 언덕 위쪽에서는 흙이 깎이는 침식 작용이 가장 활발해요.",
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
    "id": "s32-mid-v036",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 16
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흐르는 물에 의한 지표의 변화에 대한 설명으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 경사가 급한 곳에서는 침식 작용보다 퇴적 작용이 활발하게 일어납니다.",
        "ㄴ. 흐르는 물은 흙을 깎기만 하고 다른 곳으로 옮기지는 못합니다.",
        "ㄷ. 경사가 완만한 곳에서는 침식 작용보다 퇴적 작용이 활발하게 일어납니다."
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
        "경사가 완만한 곳에서는 침식 작용보다 퇴적 작용이 활발하게 일어납니다."
      ]
    },
    "explanation": "경사가 완만한 곳에서는 물이 느리게 흘러 흙이 쌓이는 퇴적 작용이 활발해요. 흐르는 물은 흙을 깎고 옮기고 쌓아요.",
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
    "id": "s32-mid-v037",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 17
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "ㄱ과 ㄴ 중에서 다음과 같은 모습을 많이 볼 수 있는 곳을 골라 기호를 쓰세요.",
    "givens": {
      "지문": "모습: 강폭이 넓고 물이 느리게 흐르며, 강가에 고운 모래와 진흙이 넓게 쌓여 있습니다.\nㄱ: 산골짜기와 가까운 곳\nㄴ: 바다와 가까운 곳"
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
    "explanation": "강폭이 넓고 고운 모래와 진흙이 쌓인 모습은 바다와 가까운 강 하류에서 많이 볼 수 있어요.",
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
    "id": "s32-mid-v038",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 18
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "강 하류의 모습에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "강 하류는 상류보다 모래와 진흙이 많습니다.",
      "강 하류는 상류보다 강폭이 좁습니다.",
      "강 하류는 상류보다 경사가 급합니다.",
      "강 하류는 상류보다 침식 작용이 활발합니다.",
      "강 하류에서는 큰 바위를 주로 볼 수 있습니다."
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
    "explanation": "강 하류는 상류보다 강폭이 넓고 경사가 완만해 퇴적 작용이 활발해요. 그래서 모래와 진흙이 많아요.",
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
    "id": "s32-mid-v039",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 19
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "바닷물의 침식 작용으로 만들어진 지형끼리 바르게 묶은 것을 고르세요.",
    "givens": null,
    "choices": [
      "갯벌, 모래사장",
      "절벽, 구멍 뚫린 바위",
      "절벽, 넓은 갯벌",
      "모래사장, 바닷가 동굴",
      "갯벌, 구멍 뚫린 바위"
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
    "explanation": "절벽과 구멍 뚫린 바위는 파도가 바위를 깎아 만든 침식 지형이에요. 갯벌과 모래사장은 바닷물이 쌓아 만든 퇴적 지형이에요.",
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
    "id": "s32-mid-v040",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 20
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "비가 많이 내리는 날에 흙이 가장 덜 깎이는 곳을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 산불로 나무와 풀이 타 버린 비탈",
        "ㄴ. 풀과 나무가 빽빽하게 자란 비탈",
        "ㄷ. 공사로 흙을 파헤쳐 놓은 비탈"
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
        "풀과 나무가 빽빽하게 자란 비탈"
      ]
    },
    "explanation": "풀과 나무의 뿌리가 흙을 붙잡고 잎과 줄기가 흙을 덮어 주어서 흐르는 물에 흙이 덜 깎여요.",
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
