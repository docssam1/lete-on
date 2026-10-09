// 3-1 Ⅱ 동물의 생활 — 유사문항 80 (창작). 원문 1문항당 1개, 같은 유형·난이도로 상황과 물체를 바꿨다. of = 짝이 되는 원문 (세트, 번호).
export const similar = [
  {
    "id": "s31-u02-v001",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같은 특징을 가진 동물로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 머리에 한 쌍의 더듬이가 있고 세 쌍의 다리가 있습니다.\n• 몸이 머리, 가슴, 배의 세 부분으로 되어 있고, 땅 위와 땅속을 오가며 삽니다."
    },
    "choices": [
      "참새",
      "개미",
      "달팽이",
      "고양이",
      "금붕어"
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
    "explanation": "더듬이와 세 쌍의 다리가 있고 몸이 머리·가슴·배로 나뉘며 땅 위와 땅속을 오가는 동물은 개미예요.",
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
    "id": "s31-u02-v002",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 빈칸에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "금붕어는 □이/가 있어 물속에서 숨을 쉴 수 있습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "아가미",
      "accepted": [
        "아가미"
      ]
    },
    "explanation": "금붕어는 아가미로 물속에서 숨을 쉬고, 지느러미로 헤엄쳐요.",
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
    "id": "s31-u02-v003",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 동물들의 공통점으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "개미, 나비, 잠자리"
    },
    "choices": [
      "몸이 머리, 가슴, 배로 구분된다.",
      "꽃에서 꿀을 빨아 먹고 산다.",
      "머리에 아주 커다란 눈이 있다.",
      "다리가 없어서 몸으로 기어다닌다.",
      "땅속에 굴을 파고 그 안에서 생활한다."
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
    "explanation": "개미·나비·잠자리는 모두 몸이 머리, 가슴, 배의 세 부분으로 나뉘어요. 커다란 눈은 잠자리, 꿀을 빠는 것은 나비만의 특징이에요.",
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
    "id": "s31-u02-v004",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "동물을 분류하는 기준으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "더듬이가 있는가?",
      "다리가 세 쌍인가?",
      "생김새가 귀여운가?",
      "물속에서 사는가?",
      "몸이 깃털로 덮여 있는가?"
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
    "explanation": "‘귀여운가?’는 사람마다 생각이 달라 분류 결과가 달라질 수 있어서 알맞은 분류 기준이 아니에요.",
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
    "id": "s31-u02-v005",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같이 동물을 분류할 수 있는 분류 기준으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "표": {
        "그렇다.": [
          "개미, 달팽이, 나비"
        ],
        "그렇지 않다.": [
          "고양이, 붕어, 참새"
        ]
      }
    },
    "choices": [
      "알을 낳는가?",
      "다리가 있는가?",
      "날개가 있는가?",
      "더듬이가 있는가?",
      "몸이 작고 귀여운가?"
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
    "explanation": "개미·달팽이·나비는 더듬이가 있고 고양이·붕어·참새는 더듬이가 없어요. 달팽이는 다리가 없고, 붕어와 참새도 알을 낳으니 다른 기준은 맞지 않아요.",
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
    "id": "s31-u02-v006",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "땅 위와 땅속을 오가며 생활하는 동물끼리 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "개미, 뱀",
      "노루, 두더지",
      "지렁이, 고양이",
      "땅강아지, 너구리",
      "매미 애벌레, 참새"
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
    "explanation": "개미와 뱀은 땅 위와 땅속을 오가며 살아요. 두더지·지렁이·땅강아지는 주로 땅속, 노루·고양이·너구리는 땅 위에 살아요.",
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
    "id": "s31-u02-v007",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 동물의 이름과 특징을 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "지렁이 - 삽 같은 앞발로 굴을 판다.",
      "뱀 - 몸에 고리 모양의 마디가 많다.",
      "두더지 - 몸이 단단한 비늘로 덮여 있다.",
      "너구리 - 다리로 걷거나 뛰어다닌다.",
      "땅강아지 - 다리 없이 몸을 구부려 기어다닌다."
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
    "explanation": "너구리는 다리가 있어 걷거나 뛰어다녀요. 삽 같은 앞발은 두더지, 고리 모양 마디는 지렁이, 비늘은 뱀의 특징이에요.",
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
    "id": "s31-u02-v008",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 지렁이의 특징에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 세 쌍의 다리가 있다.",
        "㉡ 몸에 고리 모양의 마디가 많다.",
        "㉢ 땅속에서 흙과 썩은 낙엽 등을 먹으며 산다.",
        "㉣ 몸이 단단한 비늘로 덮여 있다."
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉢",
      "㉡, ㉣",
      "㉢, ㉣"
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
    "explanation": "지렁이는 다리가 없고 몸에 고리 모양의 마디가 많으며, 땅속에서 흙과 썩은 낙엽 등을 먹고 살아요. 비늘은 뱀의 특징이에요.",
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
    "id": "s31-u02-v009",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "붕어가 강이나 호수의 물속에서 살아가기에 알맞은 특징을 두 가지 쓰시오.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "지느러미가 있어 물속에서 헤엄쳐 다닐 수 있고, 아가미가 있어 물속에서 숨을 쉴 수 있다.",
      "rubric": {
        "required": [
          "지느러미로 물속을 헤엄쳐 다닌다",
          "아가미로 물속에서 숨을 쉰다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "붕어는 지느러미로 헤엄치고 아가미로 물속에서 숨을 쉬어서 물속에서 살아가기에 알맞아요.",
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
    "id": "s31-u02-v010",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같은 특징이 있는 동물을 <보기>에서 모두 고른 것은 어느 것입니까?",
    "givens": {
      "지문": "지느러미를 움직여 물속을 헤엄쳐 다닙니다.",
      "보기": [
        "㉠ 붕어",
        "㉡ 게",
        "㉢ 메기",
        "㉣ 다슬기"
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉢",
      "㉡, ㉣",
      "㉢, ㉣"
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
    "explanation": "붕어와 메기는 지느러미로 헤엄쳐요. 게는 다리로 걷고, 다슬기는 배발로 바위에 붙어 기어다녀요.",
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
    "id": "s31-u02-v011",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "<보기>의 동물을 강이나 호수에 사는 동물과 바다에 사는 동물로 알맞게 분류한 것은 어느 것입니까? (강이나 호수 / 바다)",
    "givens": {
      "보기": [
        "㉠ 메기",
        "㉡ 오징어",
        "㉢ 수달",
        "㉣ 가오리"
      ]
    },
    "choices": [
      "㉠, ㉡ / ㉢, ㉣",
      "㉠, ㉢ / ㉡, ㉣",
      "㉠, ㉣ / ㉡, ㉢",
      "㉡, ㉢ / ㉠, ㉣",
      "㉢, ㉣ / ㉠, ㉡"
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
    "explanation": "메기와 수달은 강이나 호수에, 오징어와 가오리는 바다에 살아요.",
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
    "id": "s31-u02-v012",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "잠자리의 특징으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "커다란 눈이 있다.",
      "두 쌍의 날개가 있다.",
      "세 쌍의 다리가 있다.",
      "몸이 깃털로 덮여 있다.",
      "몸이 머리, 가슴, 배로 구분된다."
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
    "explanation": "잠자리는 곤충이라 깃털이 없어요. 깃털로 덮인 것은 새예요. 잠자리는 얇은 날개 두 쌍으로 날아요.",
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
    "id": "s31-u02-v013",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "나비와 잠자리의 공통점을 두 가지 쓰시오.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "두 쌍의 날개가 있어 날 수 있다. / 세 쌍의 다리가 있다.",
      "rubric": {
        "required": [
          "공통점 한 가지(예: 두 쌍의 날개가 있다)",
          "공통점 한 가지 더(예: 세 쌍의 다리가 있다)"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "나비와 잠자리는 곤충이라 두 쌍의 날개와 세 쌍의 다리가 있고, 몸이 머리·가슴·배로 나뉘어요.",
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
    "id": "s31-u02-v014",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음에서 설명하는 환경으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 햇빛이 거의 닿지 않아서 어둡습니다.\n• 물이 매우 깊고 차갑습니다."
    },
    "choices": [
      "강",
      "갯벌",
      "사막",
      "높은 산",
      "깊은 바다"
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
    "explanation": "햇빛이 거의 닿지 않아 어둡고 물이 깊고 차가운 곳은 깊은 바다예요.",
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
    "id": "s31-u02-v015",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 빈칸에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "사막 도마뱀은 □와/과 피부로 물을 흡수할 수 있어 물이 귀한 사막에서 살아갈 수 있습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "발바닥",
      "accepted": [
        "발바닥",
        "발"
      ]
    },
    "explanation": "사막 도마뱀은 발바닥과 피부로 물을 흡수할 수 있어서 비가 거의 오지 않는 사막에서도 살 수 있어요.",
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
    "id": "s31-u02-v016",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같은 특징을 가진 동물로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 비가 거의 내리지 않는 사막에 삽니다.\n• 큰 귀로 몸속의 열을 내보내 체온을 조절합니다."
    },
    "choices": [
      "낙타",
      "펭귄",
      "산양",
      "북극곰",
      "사막여우"
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
    "explanation": "사막여우는 큰 귀로 몸속의 열을 내보내 더운 사막에서 체온을 조절해요.",
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
    "id": "s31-u02-v017",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "주로 높은 산에 사는 동물끼리 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "낙타, 박쥐",
      "펭귄, 산양",
      "산양, 눈표범",
      "눈표범, 초롱아귀",
      "사막여우, 동굴옆새우"
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
    "explanation": "산양과 눈표범은 춥고 경사가 급한 높은 산에 살아요. 낙타·사막여우는 사막, 펭귄은 극지방, 박쥐·동굴옆새우는 동굴, 초롱아귀는 깊은 바다에 살아요.",
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
    "id": "s31-u02-v018",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 동물들이 주로 사는 환경에 대한 설명으로 알맞은 것을 <보기>에서 골라 기호를 쓰시오.",
    "givens": {
      "지문": "펭귄, 북극곰",
      "보기": [
        "㉠ 비가 거의 내리지 않아 건조하다.",
        "㉡ 햇빛이 거의 닿지 않아서 어둡다.",
        "㉢ 눈과 얼음으로 덮여 있고 매우 춥다."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉢",
      "accepted": [
        "㉢",
        "ㄷ"
      ]
    },
    "explanation": "펭귄과 북극곰은 눈과 얼음으로 덮여 있고 매우 추운 극지방에 살아요.",
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
    "id": "s31-u02-v019",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물속에서도 사용할 수 있는 접착제를 만드는 데 이용한 홍합의 특징으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "날카로운 발톱으로 먹이를 꽉 움켜잡는 특징",
      "말랑한 발바닥으로 바위에서 잘 미끄러지지 않는 특징",
      "세찬 파도에도 바위에 단단히 붙어 떨어지지 않는 특징",
      "피부에 작은 비늘이 있어 물이 잘 흐르는 특징",
      "몸이 부드러운 곡선 모양이라 물속에서 빨리 헤엄치는 특징"
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
    "explanation": "홍합은 세찬 파도에도 바위에 붙어 떨어지지 않아요. 이 특징을 본떠 물속에서도 붙는 접착제를 만들었어요.",
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
    "id": "s31-u02-v020",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "오리의 발가락 사이에 있는 막으로 물을 잘 헤치는 특징을 이용해 만든 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "물갈퀴",
      "흡착판",
      "집게 차",
      "고속열차",
      "등산화 밑창"
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
    "explanation": "오리 발의 물갈퀴를 본떠 헤엄칠 때 신는 물갈퀴를 만들었어요.",
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
    "id": "s31-u02-v021",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 나비에 대한 설명입니다. ㉠, ㉡에 들어갈 알맞은 말을 골라 쓰시오.",
    "givens": {
      "지문": "나비는 ㉠ ( 한, 두 ) 쌍의 날개가 있고, 머리에 ㉡ ( 한, 두 ) 쌍의 더듬이가 있습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 두, ㉡ 한",
      "accepted": [
        "㉠ 두, ㉡ 한",
        "두, 한",
        "두 한",
        "㉠ 두 ㉡ 한",
        "㉠두, ㉡한"
      ]
    },
    "explanation": "나비는 곤충이라 두 쌍의 날개가 있고, 머리에 한 쌍의 더듬이가 있어요.",
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
    "id": "s31-u02-v022",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "우리 주변에 사는 동물의 특징으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "참새는 몸이 깃털로 덮여 있다.",
      "개미는 세 쌍의 다리가 있다.",
      "공벌레는 다리가 없어 기어다닌다.",
      "금붕어는 지느러미로 헤엄친다.",
      "달팽이는 미끄러지듯이 움직인다."
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
    "explanation": "공벌레는 일곱 쌍의 다리가 있고, 건드리면 몸을 공처럼 둥글게 만들어요. 다리가 없는 것은 달팽이예요.",
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
    "id": "s31-u02-v023",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "우리 주변에 사는 동물을 관찰할 때 주의할 점을 잘못 설명한 사람의 이름을 쓰시오.",
    "givens": {
      "지문": "• 서준: 관찰한 동물은 살던 곳에 다시 놓아줍니다.\n• 하린: 벌처럼 침이 있는 동물에는 가까이 가지 않습니다.\n• 도윤: 동물이 움직이지 않으면 나뭇가지로 쿡쿡 찔러 봅니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "도윤",
      "accepted": [
        "도윤"
      ]
    },
    "explanation": "동물을 나뭇가지로 찌르면 다칠 수 있어요. 생명을 소중히 여기며 건드리지 않고 관찰해요.",
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
    "id": "s31-u02-v024",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 ‘다리가 있는가?’의 기준으로 동물을 분류한 결과입니다. 잘못 분류한 동물의 이름을 쓰시오.",
    "givens": {
      "표": {
        "그렇다.": [
          "개미, 참새, 지렁이"
        ],
        "그렇지 않다.": [
          "뱀, 달팽이, 붕어"
        ]
      }
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "지렁이",
      "accepted": [
        "지렁이"
      ]
    },
    "explanation": "지렁이는 다리가 없어서 ‘그렇지 않다.’ 쪽에 들어가야 해요.",
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
    "id": "s31-u02-v025",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같이 동물을 분류할 수 있는 분류 기준으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "표": {
        "그렇다.": [
          "참새, 까치, 닭"
        ],
        "그렇지 않다.": [
          "잠자리, 고양이, 개구리"
        ]
      }
    },
    "choices": [
      "알을 낳는 동물인가?",
      "날개가 있는 동물인가?",
      "더듬이가 있는 동물인가?",
      "몸이 털로 덮여 있는가?",
      "몸이 깃털로 덮여 있는가?"
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
    "explanation": "참새·까치·닭은 몸이 깃털로 덮여 있어요. 잠자리도 날개가 있고 개구리도 알을 낳으니 다른 기준으로는 이렇게 나뉘지 않아요.",
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
    "id": "s31-u02-v026",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 땅강아지가 주로 생활하는 곳을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 갯벌",
        "㉡ 땅 위",
        "㉢ 땅속",
        "㉣ 나무 위"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉢",
      "accepted": [
        "㉢",
        "ㄷ",
        "땅속"
      ]
    },
    "explanation": "땅강아지는 앞다리로 땅을 파며 주로 땅속에서 생활해요.",
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
    "id": "s31-u02-v027",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "뱀의 특징으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "다리가 없고 몸이 비늘로 덮여 있다.",
      "삽 같은 앞발로 땅속에 굴을 판다.",
      "몸이 부드러운 털로 덮여 있다.",
      "세 쌍의 다리로 걷거나 뛰어다닌다.",
      "몸에 고리 모양의 마디가 많이 있다."
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
    "explanation": "뱀은 다리가 없어 기어다니고 몸이 비늘로 덮여 있어요. 고리 모양 마디는 지렁이의 특징이에요.",
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
    "id": "s31-u02-v028",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 이동 방법이 나머지와 다른 동물을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 노루",
        "㉡ 지렁이",
        "㉢ 고양이",
        "㉣ 너구리"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ",
        "지렁이"
      ]
    },
    "explanation": "노루·고양이·너구리는 다리로 걷거나 뛰어다니고, 지렁이는 다리가 없어 기어다녀요.",
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
    "id": "s31-u02-v029",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 빈칸에 공통으로 들어갈 알맞은 말은 어느 것입니까?",
    "givens": {
      "지문": "• 고등어는 지느러미로 [    ]을/를 헤엄쳐 다닙니다.\n• 전복은 배발을 이용해 [    ]의 바위에 붙어서 기어다닙니다."
    },
    "choices": [
      "갯벌",
      "사막",
      "강이나 호수",
      "높은 산",
      "바닷속"
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
    "explanation": "고등어와 전복은 바닷속에 살아요. 고등어는 지느러미로 헤엄치고, 전복은 배발로 바위에 붙어 기어다녀요.",
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
    "id": "s31-u02-v030",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "바닷속에서 볼 수 있는 동물을 한 가지 쓰고, 그 동물이 바닷속에서 살아가기에 알맞은 특징을 쓰시오.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예) 고등어, 지느러미로 물속을 헤엄쳐 다닌다. / 전복, 배발을 이용해 바위에 붙어서 기어다닌다. / 오징어, 다리를 움직여 물속을 헤엄친다.",
      "rubric": {
        "required": [
          "바닷속에 사는 동물 이름",
          "그 동물이 바닷속에서 살아가기에 알맞은 특징"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "바닷속 동물은 지느러미로 헤엄치거나(고등어·상어), 배발로 바위에 붙어 기어다니는(전복) 등 물속에서 살기에 알맞은 특징이 있어요.",
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
    "id": "s31-u02-v031",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같은 특징을 가진 동물로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 강이나 계곡의 물속 바위에 붙어서 삽니다.\n• 몸이 딱딱한 껍데기로 덮여 있습니다.\n• 배발을 이용해 기어다닙니다."
    },
    "choices": [
      "다슬기",
      "메기",
      "수달",
      "붕어",
      "개구리"
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
    "explanation": "강이나 계곡의 물속 바위에 붙어 배발로 기어다니고, 몸이 딱딱한 껍데기로 덮인 동물은 다슬기예요.",
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
    "id": "s31-u02-v032",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 한 쌍의 날개가 있는 동물을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 까치",
        "㉡ 나비",
        "㉢ 갈매기",
        "㉣ 벌"
      ]
    },
    "choices": [
      "㉠, ㉢",
      "㉠, ㉣",
      "㉡, ㉢",
      "㉡, ㉣",
      "㉢, ㉣"
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
    "explanation": "까치와 갈매기는 새라서 한 쌍의 날개가 있어요. 나비와 벌은 곤충이라 두 쌍의 날개가 있어요.",
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
    "id": "s31-u02-v033",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "까치와 매미의 공통점으로 알맞은 것을 두 가지 고르시오. (정답 2개)",
    "givens": {
      "지문": "까치, 매미"
    },
    "choices": [
      "한 쌍의 날개가 있다.",
      "날개가 있어 날 수 있다.",
      "몸이 깃털로 덮여 있다.",
      "나무 수액을 빨아 먹는다.",
      "몸이 크기에 비해 가볍다."
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
    "explanation": "까치와 매미는 날개가 있어 날 수 있고, 몸이 크기에 비해 가벼워요. 까치는 날개가 한 쌍, 매미는 두 쌍이에요.",
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
    "id": "s31-u02-v034",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 동물이 주로 사는 환경에 대한 설명으로 알맞은 것을 <보기>에서 골라 기호를 쓰시오.",
    "givens": {
      "지문": "낙타",
      "보기": [
        "㉠ 눈과 얼음으로 덮여 있다.",
        "㉡ 비가 거의 내리지 않아 건조하고, 낮과 밤의 온도 차이가 크다.",
        "㉢ 햇빛이 거의 닿지 않아서 어둡다."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ"
      ]
    },
    "explanation": "낙타는 비가 거의 내리지 않아 건조하고 낮과 밤의 온도 차이가 큰 사막에 살아요.",
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
    "id": "s31-u02-v035",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "펭귄은 추운 극지방에서 살아가기에 알맞은 특징을 가지고 있습니다. 그 특징은 무엇입니까?",
    "givens": null,
    "choices": [
      "큰 귀로 몸속의 열을 내보낸다.",
      "등의 혹에 지방을 저장해 둔다.",
      "초음파를 이용해 어두운 곳에서 먹이를 찾는다.",
      "발바닥과 피부로 물을 흡수할 수 있다.",
      "여러 마리가 서로 몸을 맞대어 추위를 견딘다."
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
    "explanation": "펭귄은 여러 마리가 서로 몸을 맞대어 추운 극지방의 추위를 견뎌요. 큰 귀는 사막여우, 혹은 낙타, 초음파는 박쥐의 특징이에요.",
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
    "id": "s31-u02-v036",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "북극곰의 발바닥에는 작은 돌기들이 있습니다. 이 돌기가 극지방에서 살아가는 데 어떤 도움이 되는지 쓰시오.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "발바닥의 작은 돌기 덕분에 얼음 위에서 미끄러지지 않고 걸어 다닐 수 있다.",
      "rubric": {
        "required": [
          "발바닥에 작은 돌기가 있다",
          "얼음 위에서 미끄러지지 않는다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "북극곰은 발바닥의 작은 돌기 덕분에 얼음 위에서 미끄러지지 않아요.",
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
    "id": "s31-u02-v037",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같은 특징을 가진 동물로 알맞은 것을 <보기>에서 골라 기호를 쓰시오.",
    "givens": {
      "지문": "• 날개가 있어 날 수 있고, 쉴 때는 거꾸로 매달려 있습니다.\n• 어두운 곳에서 초음파를 이용해 먹이를 찾습니다.",
      "보기": [
        "㉠ 낙타",
        "㉡ 박쥐",
        "㉢ 동굴옆새우",
        "㉣ 펭귄"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ",
        "박쥐"
      ]
    },
    "explanation": "어두운 동굴에서 초음파를 이용해 먹이를 찾고 거꾸로 매달려 쉬는 동물은 박쥐예요.",
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
    "id": "s31-u02-v038",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같은 환경에 주로 사는 동물을 <보기>에서 모두 고른 것은 어느 것입니까?",
    "givens": {
      "지문": "햇빛이 거의 들어오지 않아 어둡고, 바깥보다 온도 변화가 적습니다.",
      "보기": [
        "㉠ 낙타",
        "㉡ 박쥐",
        "㉢ 동굴옆새우",
        "㉣ 펭귄"
      ]
    },
    "choices": [
      "㉠",
      "㉡",
      "㉠, ㉣",
      "㉡, ㉢",
      "㉢, ㉣"
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
    "explanation": "어둡고 온도 변화가 적은 곳은 동굴이에요. 박쥐와 동굴옆새우가 동굴에 살아요.",
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
    "id": "s31-u02-v039",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빈칸에 들어갈 알맞은 말은 어느 것입니까?",
    "givens": {
      "지문": "등산화 밑창은 [    ]이/가 가파른 바위에서 잘 미끄러지지 않는 특징을 이용해 만든 것입니다."
    },
    "choices": [
      "오리의 발",
      "수리의 발",
      "상어의 피부",
      "문어의 빨판",
      "산양의 발굽"
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
    "explanation": "산양은 발굽 바닥이 말랑해서 바위에서 잘 미끄러지지 않아요. 이를 본떠 등산화 밑창을 만들었어요.",
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
    "id": "s31-u02-v040",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같은 특징을 이용한 예로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "두더지는 삽 같은 앞발로 흙을 파서 땅속에 굴을 만듭니다."
    },
    "choices": [
      "물갈퀴",
      "집게 차",
      "굴착기",
      "흡착판",
      "등산화 밑창"
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
    "explanation": "두더지가 앞발로 땅을 파는 특징을 본떠 땅을 파는 굴착기를 만들었어요.",
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
    "id": "s31-u02-v041",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "공원 풀밭에서 관찰할 수 있는 동물로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "개미",
      "참새",
      "나비",
      "공벌레",
      "고등어"
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
    "explanation": "고등어는 바닷속에 사는 동물이라 공원 풀밭에서는 볼 수 없어요.",
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
    "id": "s31-u02-v042",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같은 특징을 가진 동물로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 몸이 털로 덮여 있습니다.\n• 네 개의 다리로 걷거나 뛰어다닙니다.\n• 얼굴에 긴 수염이 있습니다."
    },
    "choices": [
      "고양이",
      "개미",
      "참새",
      "금붕어",
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
    "explanation": "몸이 털로 덮여 있고 네 다리로 걷거나 뛰며 긴 수염이 있는 동물은 고양이예요.",
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
    "id": "s31-u02-v043",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 동물을 특징에 따라 분류할 때에 대한 설명으로 알맞지 않은 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ ‘무섭게 생겼는가?’는 동물을 분류하는 알맞은 기준이다.",
        "㉡ 분류 기준은 누가 분류해도 같은 결과가 나오도록 정한다.",
        "㉢ ‘다리가 있는가?’는 동물을 분류하는 알맞은 기준이다."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠",
      "accepted": [
        "㉠",
        "ㄱ"
      ]
    },
    "explanation": "‘무섭게 생겼는가?’는 사람마다 생각이 달라 분류 결과가 달라질 수 있어서 알맞은 기준이 아니에요.",
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
    "id": "s31-u02-v044",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "참새와 잠자리의 공통점으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "날개가 있다.",
      "더듬이가 있다.",
      "새끼를 낳는다.",
      "세 쌍의 다리가 있다.",
      "몸이 깃털로 덮여 있다."
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
    "explanation": "참새와 잠자리는 모두 날개가 있어요. 깃털은 참새, 더듬이와 세 쌍의 다리는 잠자리만의 특징이에요.",
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
    "id": "s31-u02-v045",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같이 동물을 분류할 수 있는 분류 기준으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "표": {
        "그렇다.": [
          "참새, 나비"
        ],
        "그렇지 않다.": [
          "고양이, 달팽이"
        ]
      }
    },
    "choices": [
      "알을 낳는가?",
      "날개가 있는가?",
      "다리가 있는가?",
      "더듬이가 있는가?",
      "몸이 털로 덮여 있는가?"
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
    "explanation": "참새와 나비는 날개가 있고 고양이와 달팽이는 날개가 없어요. 달팽이도 알을 낳고, 고양이도 다리가 있으니 다른 기준은 맞지 않아요.",
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
    "id": "s31-u02-v046",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 분류 기준과 그 분류 기준에 따라 여러 가지 동물을 분류한 결과입니다. 잠자리는 ㉠과 ㉡ 중 어디에 해당하는지 골라 기호를 쓰시오.",
    "givens": {
      "표": {
        "분류 기준": [
          "날개가 있는가?"
        ],
        "㉠": [
          "참새, 나비"
        ],
        "㉡": [
          "개, 지렁이"
        ]
      }
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠",
      "accepted": [
        "㉠",
        "ㄱ"
      ]
    },
    "explanation": "잠자리는 두 쌍의 날개가 있으니 날개가 있는 참새·나비와 같은 ㉠에 들어가요.",
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
    "id": "s31-u02-v047",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "주로 땅속에서 생활하는 동물을 두 가지 고르시오. (정답 2개)",
    "givens": null,
    "choices": [
      "개",
      "두더지",
      "노루",
      "지렁이",
      "참새"
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
    "explanation": "두더지와 지렁이는 주로 땅속에서 생활해요. 개와 노루는 땅 위에서 살아요.",
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
    "id": "s31-u02-v048",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "땅에 사는 동물의 특징을 잘못 설명한 사람의 이름을 쓰시오.",
    "givens": {
      "지문": "• 민호: 뱀은 다리가 없어 기어다닙니다.\n• 수아: 너구리는 다리로 걷거나 뛰어다닙니다.\n• 지우: 지렁이는 몸이 단단한 비늘로 덮여 있어 땅속에서도 다치지 않습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "지우",
      "accepted": [
        "지우"
      ]
    },
    "explanation": "지렁이는 비늘이 없고 몸에 고리 모양의 마디가 많아요. 비늘로 덮인 것은 뱀이에요.",
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
    "id": "s31-u02-v049",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "땅에 사는 동물에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "다리로 걷거나 뛰어다니는 동물이 있다.",
      "다리가 없어 기어다니는 동물도 있다.",
      "땅속에 굴을 파고 생활하는 동물도 있다.",
      "땅에 사는 동물은 모두 다리가 네 개이다.",
      "땅 위와 땅속을 오가며 사는 동물도 있다."
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
    "explanation": "땅에 사는 동물 중에는 다리가 없는 뱀·지렁이도 있고, 다리가 세 쌍인 개미도 있어요. 모두 다리가 네 개인 것은 아니에요.",
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
    "id": "s31-u02-v050",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 개구리의 특징에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 뒷다리에 물갈퀴가 있다.",
        "㉡ 지느러미로 물속을 헤엄친다.",
        "㉢ 땅과 물을 오가며 생활한다.",
        "㉣ 배발로 바위에 붙어 기어다닌다."
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉢",
      "㉡, ㉣",
      "㉢, ㉣"
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
    "explanation": "개구리는 뒷다리에 물갈퀴가 있어 헤엄을 잘 치고, 땅과 물을 오가며 살아요. 지느러미나 배발은 없어요.",
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
    "id": "s31-u02-v051",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "수달과 개구리의 공통점을 물에서 살아가기에 알맞은 특징과 관련하여 쓰시오.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "발에 물갈퀴가 있어서 물속에서 헤엄을 잘 친다.",
      "rubric": {
        "required": [
          "발에 물갈퀴가 있다",
          "물속에서 헤엄을 잘 친다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "수달과 개구리는 발에 물갈퀴가 있어 물속에서 헤엄을 잘 쳐요.",
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
    "id": "s31-u02-v052",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 주로 강이나 호수에 사는 동물을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 메기",
        "㉡ 오징어",
        "㉢ 다슬기",
        "㉣ 고등어"
      ]
    },
    "choices": [
      "㉠",
      "㉡",
      "㉠, ㉢",
      "㉡, ㉣",
      "㉢, ㉣"
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
    "explanation": "메기와 다슬기는 강이나 호수에 살고, 오징어와 고등어는 바다에 살아요.",
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
    "id": "s31-u02-v053",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 빈칸에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "까치나 갈매기 같은 새는 몸이 □(으)로 덮여 있고, 한 쌍의 날개가 있어 날 수 있습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "깃털",
      "accepted": [
        "깃털"
      ]
    },
    "explanation": "새는 몸이 깃털로 덮여 있고 한 쌍의 날개가 있으며, 몸이 크기에 비해 가벼워 날 수 있어요.",
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
    "id": "s31-u02-v054",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "까치에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "한 쌍의 다리가 있다.",
      "두 쌍의 날개가 있다.",
      "부리로 먹이를 쪼아 먹는다.",
      "날개가 있어 날 수 있다.",
      "몸이 깃털로 덮여 있다."
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
    "explanation": "까치는 새라서 날개가 한 쌍이에요. 두 쌍의 날개는 잠자리·나비 같은 곤충의 특징이에요.",
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
    "id": "s31-u02-v055",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같은 특징을 가진 동물을 <보기>에서 골라 기호와 이름을 쓰시오.",
    "givens": {
      "지문": "여러 마리가 서로 몸을 맞대어 추운 극지방의 추위를 견딥니다.",
      "보기": [
        "㉠ 낙타",
        "㉡ 박쥐",
        "㉢ 산양",
        "㉣ 펭귄"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "기호: ㉣, 이름: 펭귄",
      "accepted": [
        "기호: ㉣, 이름: 펭귄",
        "㉣, 펭귄",
        "㉣ 펭귄",
        "ㄹ, 펭귄",
        "ㄹ 펭귄"
      ]
    },
    "explanation": "펭귄은 극지방에서 여러 마리가 몸을 맞대어 추위를 견뎌요.",
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
    "id": "s31-u02-v056",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "<보기>의 동물을 사는 곳에 따라 알맞게 분류한 것은 어느 것입니까? (사막 / 높은 산)",
    "givens": {
      "보기": [
        "㉠ 산양",
        "㉡ 낙타",
        "㉢ 눈표범",
        "㉣ 사막여우"
      ]
    },
    "choices": [
      "㉠, ㉡ / ㉢, ㉣",
      "㉠, ㉢ / ㉡, ㉣",
      "㉡, ㉢ / ㉠, ㉣",
      "㉡, ㉣ / ㉠, ㉢",
      "㉢, ㉣ / ㉠, ㉡"
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
    "explanation": "낙타와 사막여우는 사막에, 산양과 눈표범은 높은 산에 살아요.",
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
    "id": "s31-u02-v057",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "바다코끼리가 사는 환경에 대한 설명으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "경사가 급하고 바위가 많습니다.",
      "눈과 얼음으로 덮여 있고 매우 춥습니다.",
      "햇빛이 거의 닿지 않아서 어둡습니다.",
      "비가 거의 내리지 않아 건조합니다.",
      "밀물 때는 물에 잠기고 썰물 때는 드러납니다."
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
    "explanation": "바다코끼리는 눈과 얼음으로 덮여 있고 매우 추운 극지방에 살아요.",
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
    "id": "s31-u02-v058",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "햇빛이 거의 닿지 않는 깊은 바다에서 초롱아귀가 먹이를 잡는 방법을 쓰시오.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "머리에 있는 빛을 내는 촉수로 먹이를 유인해 잡아먹는다.",
      "rubric": {
        "required": [
          "빛을 내는 촉수가 있다",
          "빛으로 먹이를 유인해(꾀어) 잡는다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "초롱아귀는 빛을 내는 촉수로 먹이를 유인한 뒤 큰 입으로 잡아먹어요.",
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
    "id": "s31-u02-v059",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같은 동물의 특징을 이용한 예로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "수리의 발은 먹이를 꽉 움켜잡아 잘 놓치지 않습니다."
    },
    "choices": [
      "물갈퀴",
      "흡착판",
      "집게 차",
      "고속열차",
      "등산화 밑창"
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
    "explanation": "수리의 발이 먹이를 꽉 잡는 특징을 본떠 물건을 집어 옮기는 집게 차를 만들었어요.",
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
    "id": "s31-u02-v060",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 동물과 그 동물의 특징을 이용한 물체를 잘못 짝 지은 것을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 오리 / 물갈퀴",
        "㉡ 문어 / 집게 차",
        "㉢ 산천어 / 고속열차",
        "㉣ 수리 / 흡착판"
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉢",
      "㉡, ㉣",
      "㉢, ㉣"
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
    "explanation": "문어의 빨판은 흡착판, 수리의 발은 집게 차를 만드는 데 이용했어요. 그래서 ㉡과 ㉣이 잘못 짝 지어졌어요.",
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
    "id": "s31-u02-v061",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "달팽이를 관찰한 결과로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "세 쌍의 다리로 걸어 다닌다.",
      "몸이 부드러운 털로 덮여 있다.",
      "지느러미로 헤엄친다.",
      "등에 딱딱한 껍데기가 있다.",
      "두 쌍의 날개가 있다."
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
    "explanation": "달팽이는 다리가 없고, 등에 딱딱한 껍데기가 있으며 미끄러지듯이 움직여요.",
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
    "id": "s31-u02-v062",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 우리 주변에서 볼 수 있는 동물에 대한 설명입니다. 이 동물은 무엇입니까?",
    "givens": {
      "지문": "• 머리에 커다란 눈이 있습니다.\n• 두 쌍의 날개가 있어 날 수 있습니다.\n• 가늘고 긴 배가 있습니다."
    },
    "choices": [
      "개",
      "잠자리",
      "개미",
      "참새",
      "금붕어"
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
    "explanation": "커다란 눈과 두 쌍의 날개, 가늘고 긴 배가 있는 동물은 잠자리예요.",
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
    "id": "s31-u02-v063",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T03",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "수아는 다음의 분류 기준으로 동물을 분류하려고 합니다. 분류 기준으로 알맞은지 알맞지 않은지 쓰고, 그렇게 생각한 까닭을 쓰시오.",
    "givens": {
      "지문": "분류 기준: 생김새가 예쁜가?"
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "알맞은 분류 기준이 아니다. 예쁘다는 것은 사람마다 생각이 달라서 분류하는 사람에 따라 분류 결과가 달라질 수 있기 때문이다.",
      "rubric": {
        "required": [
          "알맞지 않은 분류 기준이다",
          "분류하는 사람에 따라 분류 결과가 달라질 수 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "분류 기준은 누가 분류해도 같은 결과가 나와야 해요. ‘예쁜가?’는 사람마다 생각이 달라 알맞지 않아요.",
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
    "id": "s31-u02-v064",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 어떤 분류 기준으로 동물을 분류한 결과입니다. 분류 기준으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "표": {
        "그렇다.": [
          "뱀, 지렁이, 달팽이"
        ],
        "그렇지 않다.": [
          "개미, 참새, 고양이"
        ]
      }
    },
    "choices": [
      "알을 낳는가?",
      "날개가 있는가?",
      "다리가 없는가?",
      "더듬이가 있는가?",
      "땅속에서만 사는가?"
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
    "explanation": "뱀·지렁이·달팽이는 다리가 없고, 개미·참새·고양이는 다리가 있어요. 달팽이와 개미 모두 더듬이가 있으니 더듬이로는 이렇게 나뉘지 않아요.",
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
    "id": "s31-u02-v065",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 주로 땅 위에서 생활하는 동물을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 노루",
        "㉡ 지렁이",
        "㉢ 너구리"
      ]
    },
    "choices": [
      "㉠",
      "㉡",
      "㉢",
      "㉠, ㉡",
      "㉠, ㉢"
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
    "explanation": "노루와 너구리는 땅 위에서 걷거나 뛰어다니며 살아요. 지렁이는 주로 땅속에 살아요.",
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
    "id": "s31-u02-v066",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두더지와 땅강아지의 공통점으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "땅속에 굴을 파고 생활한다.",
      "세 쌍의 다리가 있다.",
      "몸이 비늘로 덮여 있다.",
      "몸에 고리 모양의 마디가 많다.",
      "다리 없이 몸을 구부려 기어다닌다."
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
    "explanation": "두더지와 땅강아지는 모두 앞발(앞다리)로 땅을 파서 땅속에 굴을 만들고 살아요. 세 쌍의 다리는 땅강아지만 있어요.",
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
    "id": "s31-u02-v067",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지렁이의 특징으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "다리가 없어 기어다닌다.",
      "주로 땅속에서 생활한다.",
      "몸에 고리 모양의 마디가 많이 있다.",
      "흙과 썩은 낙엽 등을 먹으며 산다.",
      "삽 같은 앞발로 굴을 파서 생활한다."
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
    "explanation": "삽 같은 앞발로 굴을 파는 것은 두더지예요. 지렁이는 다리가 없고 몸에 마디가 많아요.",
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
    "id": "s31-u02-v068",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 동물들이 주로 사는 곳은 어디입니까?",
    "givens": {
      "지문": "게, 조개"
    },
    "choices": [
      "들",
      "숲",
      "갯벌",
      "사막",
      "강이나 호수"
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
    "explanation": "게와 조개는 밀물 때 물에 잠기고 썰물 때 드러나는 갯벌에 살아요.",
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
    "id": "s31-u02-v069",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "메기가 물에서 살기에 알맞은 특징은 어느 것입니까?",
    "givens": null,
    "choices": [
      "발에 물갈퀴가 있다.",
      "삽 같은 앞발로 땅을 판다.",
      "몸이 딱딱한 껍데기로 덮여 있다.",
      "배발로 바위에 붙어 기어다닌다.",
      "지느러미로 물속을 헤엄친다."
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
    "explanation": "메기는 지느러미로 물속을 헤엄쳐 다녀요. 물갈퀴는 수달·개구리, 배발은 다슬기·전복의 특징이에요.",
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
    "id": "s31-u02-v070",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 바다에서 사는 동물을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 오징어",
        "㉡ 메기",
        "㉢ 전복",
        "㉣ 고등어"
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉢, ㉣",
      "㉠, ㉡, ㉢",
      "㉠, ㉢, ㉣",
      "㉠, ㉡, ㉢, ㉣"
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
    "explanation": "오징어·전복·고등어는 바다에 살고, 메기는 강이나 호수에 살아요.",
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
    "id": "s31-u02-v071",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "날개의 개수가 나머지 넷과 다른 동물은 무엇입니까?",
    "givens": null,
    "choices": [
      "참새",
      "까치",
      "잠자리",
      "갈매기",
      "왜가리"
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
    "explanation": "참새·까치·갈매기·왜가리는 새라서 날개가 한 쌍이고, 잠자리는 곤충이라 날개가 두 쌍이에요.",
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
    "id": "s31-u02-v072",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "까치, 갈매기, 왜가리처럼 날 수 있는 새들의 공통적인 특징을 두 가지 고르시오. (정답 2개)",
    "givens": null,
    "choices": [
      "몸이 깃털로 덮여 있다.",
      "두 쌍의 날개가 있다.",
      "머리에 더듬이가 있다.",
      "한 쌍의 날개가 있다.",
      "발의 물갈퀴로 헤엄친다."
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
    "explanation": "날 수 있는 새들은 몸이 깃털로 덮여 있고 한 쌍의 날개가 있어요. 두 쌍의 날개와 더듬이는 곤충의 특징이에요.",
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
    "id": "s31-u02-v073",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 빈칸에 들어갈 알맞은 말은 어느 것입니까?",
    "givens": {
      "지문": "산양은 [    ] 바닥이 말랑해서 경사가 급한 바위에서도 잘 미끄러지지 않습니다."
    },
    "choices": [
      "꼬리",
      "부리",
      "날개",
      "발굽",
      "지느러미"
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
    "explanation": "산양은 말랑한 발굽 바닥 덕분에 경사가 급한 바위산에서도 잘 미끄러지지 않아요.",
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
    "id": "s31-u02-v074",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "북극곰이 추운 극지방에서 살기에 알맞은 특징을 피부와 털과 관련하여 쓰시오.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "북극곰은 두꺼운 피부와 촘촘하게 난 털이 있어 추위를 막아 준다. 그래서 추운 극지방에서 살 수 있다.",
      "rubric": {
        "required": [
          "두꺼운 피부와 촘촘한 털이 있다",
          "추위를 막아 준다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "북극곰은 두꺼운 피부와 촘촘한 털이 추위를 막아 주어 추운 극지방에서 살 수 있어요.",
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
    "id": "s31-u02-v075",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같은 특징이 있는 환경에 주로 사는 동물을 <보기>에서 모두 고른 것은 어느 것입니까?",
    "givens": {
      "지문": "• 비가 거의 내리지 않아 건조합니다.\n• 낮과 밤의 온도 차이가 큽니다.",
      "보기": [
        "㉠ 낙타",
        "㉡ 박쥐",
        "㉢ 사막여우",
        "㉣ 바다코끼리"
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉠, ㉣",
      "㉡, ㉢",
      "㉢, ㉣"
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
    "explanation": "건조하고 낮과 밤의 온도 차이가 큰 곳은 사막이에요. 낙타와 사막여우가 사막에 살아요.",
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
    "id": "s31-u02-v076",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "동물과 그 동물이 주로 사는 환경을 잘못 짝 지은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "낙타 - 사막",
      "산양 - 높은 산",
      "펭귄 - 극지방",
      "박쥐 - 깊은 바다",
      "초롱아귀 - 깊은 바다"
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
    "explanation": "박쥐는 어두운 동굴에 살아요. 깊은 바다에 사는 것은 초롱아귀예요.",
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
    "id": "s31-u02-v077",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 낙타가 사막에서 살기에 알맞은 특징을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 등의 혹에 지방을 저장한다.",
        "㉡ 빛을 내는 촉수가 있다.",
        "㉢ 발바닥이 넓어 모래에 발이 잘 빠지지 않는다.",
        "㉣ 발바닥에 작은 돌기가 있어 얼음 위에서 미끄러지지 않는다."
      ]
    },
    "choices": [
      "㉠",
      "㉠, ㉢",
      "㉡, ㉢",
      "㉠, ㉡, ㉢",
      "㉠, ㉢, ㉣"
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
    "explanation": "낙타는 혹에 지방을 저장하고, 발바닥이 넓어 모래에 잘 빠지지 않아요. 빛나는 촉수는 초롱아귀, 발바닥 돌기는 북극곰의 특징이에요.",
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
    "id": "s31-u02-v078",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "산천어의 특징을 이용해 만든 것은 어느 것입니까?",
    "givens": {
      "지문": "산천어는 몸이 부드러운 곡선 모양이어서 물속에서 빠르게 헤엄칠 수 있습니다."
    },
    "choices": [
      "고속열차",
      "흡착판",
      "굴착기",
      "등산화 밑창",
      "물속에서 사용할 수 있는 접착제"
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
    "explanation": "산천어의 부드러운 곡선 모양 몸을 본떠 공기를 잘 가르며 빠르게 달리는 고속열차를 만들었어요.",
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
    "id": "s31-u02-v079",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "전신 수영복을 만들 때 이용한 동물의 특징은 어느 것입니까?",
    "givens": null,
    "choices": [
      "오리의 발",
      "상어의 피부",
      "산양의 발굽",
      "두더지의 앞발",
      "문어의 빨판"
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
    "explanation": "상어의 피부에는 작은 비늘이 있어 물이 잘 흘러요. 이를 본떠 전신 수영복을 만들었어요.",
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
    "id": "s31-u02-v080",
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
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "문어의 빨판이 가진 특징을 이용해 흡착판을 만들었을 때의 좋은 점으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "매끄러운 벽에 잘 붙어 물건을 걸 수 있다.",
      "단단한 땅을 깊이 파서 굴을 만들 수 있다.",
      "물속에서 헤엄을 빠르게 칠 수 있다.",
      "가파른 바위에서 잘 미끄러지지 않는다.",
      "물건을 꽉 잡아 다른 곳으로 옮길 수 있다."
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
    "explanation": "문어의 빨판은 물체에 잘 붙어요. 이를 본뜬 흡착판은 매끄러운 벽에 붙여 칫솔 같은 물건을 걸 수 있어요.",
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
