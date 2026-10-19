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
    "prompt": "관찰 카드의 동물을 기록장에 적으려 합니다. 알맞은 이름을 고르시오.",
    "givens": {
      "지문": "관찰 카드: 머리에 더듬이 한 쌍, 다리 세 쌍이 보였다. 몸은 머리·가슴·배로 나뉘었다. 줄지어 이동하는 모습을 보았다."
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
    "explanation": "더듬이와 세 쌍의 다리, 머리·가슴·배를 가진 개미의 관찰 기록이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "물고기의 몸에서 두 기능을 구별했습니다. ㉠에 알맞은 부분 이름을 쓰시오.",
    "givens": {
      "지문": "지느러미: 헤엄칠 때 움직인다.\n㉠: 물속에서 숨을 쉴 때 이용한다."
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
    "explanation": "금붕어는 아가미로 물속에서 숨을 쉬어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "세 관찰 카드에 모두 표시할 수 있는 특징은 무엇입니까?",
    "givens": {
      "지문": "개미 카드 / 나비 카드 / 잠자리 카드\n세 동물의 몸 생김새에서 공통된 특징을 찾는다."
    },
    "choices": [
      "몸이 머리·가슴·배로 나뉜다.",
      "모두 꽃에서 꿀을 빨아 먹는다.",
      "모두 몸이 깃털로 덮여 있다.",
      "모두 다리 없이 기어다닌다.",
      "모두 땅속 굴에서만 생활한다."
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
    "explanation": "개미·나비·잠자리는 머리, 가슴, 배가 구분돼요. 먹이와 생활 장소가 모두 같지는 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "서로 다른 모둠이 같은 동물 사진을 분류하려고 합니다. 판단이 달라지기 쉬운 기준은 무엇입니까?",
    "givens": null,
    "choices": [
      "머리에 더듬이가 보이는가?",
      "몸에 다리 세 쌍이 보이는가?",
      "생김새가 귀엽다고 느끼는가?",
      "몸에 지느러미가 보이는가?",
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
    "explanation": "귀엽다는 느낌은 사람마다 달라 같은 결과를 얻기 어려워요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "분류 상자의 이름표가 떨어졌습니다. 붙일 기준을 고르시오.",
    "givens": {
      "지문": "해당함 상자: 개미·달팽이·나비\n해당하지 않음 상자: 고양이·붕어·참새"
    },
    "choices": [
      "모두 알을 낳는가?",
      "몸에 다리가 있는가?",
      "몸에 날개가 있는가?",
      "더듬이가 있는가?",
      "몸이 깃털로 덮였는가?"
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
    "explanation": "개미·달팽이·나비는 더듬이가 있고, 다른 상자의 세 동물은 더듬이가 없어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "동물 안내판의 빈칸에 넣을 한 쌍을 고르시오.",
    "givens": {
      "지문": "안내판 제목: 땅 위에서 먹이를 찾기도 하고 땅속 집이나 굴도 드나드는 동물"
    },
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
    "explanation": "개미와 뱀은 땅 위와 땅속을 오가며 생활하는 예예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "관찰 기록의 동물 이름표 중 바르게 붙인 것을 고르시오.",
    "givens": {
      "지문": "동물 이름과 그 동물의 이동·몸 특징을 연결했다."
    },
    "choices": [
      "지렁이: 삽 같은 앞발이 있다.",
      "뱀: 몸에 고리 마디가 많다.",
      "두더지: 몸에 비늘이 덮였다.",
      "너구리: 다리로 걷거나 뛴다.",
      "땅강아지: 다리가 전혀 없다."
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
    "explanation": "너구리는 다리로 걷거나 뛰어요. 앞발·마디·비늘은 다른 동물의 특징과 구별해야 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "지렁이 안내문에서 그대로 사용할 수 있는 두 문장을 고르시오.",
    "givens": {
      "보기": [
        "㉠ 다리 세 쌍으로 땅을 걷는다.",
        "㉡ 몸에 고리 모양의 마디가 많다.",
        "㉢ 주로 땅속에서 흙과 썩은 낙엽 등을 먹는다.",
        "㉣ 온몸이 단단한 비늘로 덮여 있다."
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
    "explanation": "지렁이에게는 고리 모양 마디가 많고 다리가 없어요. 비늘로 덮인 동물은 뱀의 예와 구별해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "붕어 안내판에 물속 생활을 돕는 몸의 부분과 그 쓰임을 한 가지 적으시오.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "지느러미를 움직여 물속을 헤엄친다.",
      "rubric": {
        "required": [
          "붕어의 몸 부분과 물속 생활에 도움이 되는 쓰임 한 가지"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "지느러미로 헤엄치거나 아가미로 물속에서 숨 쉬는 특징 중 한 가지를 몸의 부분과 연결해 쓰면 돼요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "헤엄치는 데 지느러미를 쓰는 동물 카드만 남기려고 합니다. 남길 카드는 무엇입니까?",
    "givens": {
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
    "explanation": "붕어와 메기는 지느러미로 헤엄쳐요. 게의 다리와 다슬기의 배발은 다른 특징이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "강·호수 전시실로 보낼 카드 / 바다 전시실로 보낼 카드를 바르게 나눈 것을 고르시오.",
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
    "explanation": "메기·수달은 강이나 호수, 오징어·가오리는 바다에 사는 예예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "잠자리 관찰표에 잘못 적은 내용 하나를 찾아 고르시오.",
    "givens": {
      "지문": "날개·다리·몸을 관찰하여 다음과 같이 기록했다."
    },
    "choices": [
      "머리에 커다란 눈이 있었다.",
      "날개가 두 쌍 있었다.",
      "다리가 세 쌍 있었다.",
      "몸이 깃털로 덮여 있었다.",
      "몸은 머리·가슴·배로 나뉘었다."
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
    "explanation": "잠자리는 깃털로 덮여 있지 않아요. 깃털은 새의 특징이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "나비 카드와 잠자리 카드에 함께 붙일 수 있는 특징을 서로 다르게 두 가지 적으시오.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "날개가 두 쌍 있다. 다리가 세 쌍 있다.",
      "rubric": {
        "required": [
          "나비와 잠자리의 서로 다른 공통 특징 두 가지"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "두 동물에게 모두 맞는 특징을 서로 다르게 두 가지 써요. 같은 특징을 되풀이한 것은 하나로 세어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "서식지 지도에서 다음 탐사 기록에 맞는 장소를 고르시오.",
    "givens": {
      "지문": "물속으로 매우 깊이 내려가니 햇빛이 거의 닿지 않았다. 주변은 어둡고 물은 차가웠다."
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
    "explanation": "햇빛이 거의 닿지 않는 깊은 물속은 깊은 바다의 환경이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "낙타 안내판의 오류를 고쳐 빈칸에 넣을 말을 쓰시오.",
    "givens": {
      "지문": "잘못 쓴 말: 혹에 물을 저장한다.\n고친 말: 혹에 □을 저장한다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "지방",
      "accepted": [
        "지방"
      ]
    },
    "explanation": "낙타의 혹에는 물이 아니라 지방이 저장되어 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "사막 안내 책에 넣을 동물 이름을 고르시오.",
    "givens": {
      "지문": "이 동물은 큰 귀로 몸속의 열을 내보낸다. 건조한 사막에서 살아가는 데 도움이 된다."
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
    "explanation": "사막여우의 큰 귀는 몸속의 열을 내보내는 데 도움이 돼요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "춥고 경사가 급한 높은 산의 동물 전시에 함께 놓을 카드를 고르시오.",
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
    "explanation": "산양과 눈표범은 높은 산에 사는 동물의 예예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "펭귄과 북극곰의 서식지 안내판에 공통으로 쓸 설명을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 비가 거의 내리지 않는 건조한 사막이다.",
        "㉡ 햇빛이 거의 없는 깊은 바다이다.",
        "㉢ 눈과 얼음이 많고 매우 추운 극지방이다."
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
        "다"
      ]
    },
    "explanation": "두 동물은 서로 다른 극지방에 살지만 눈과 얼음이 많고 춥다는 환경 특징을 연결할 수 있어요. 같은 곳에 함께 산다는 뜻은 아니에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "물속 바위에 붙는 새 도구를 설계하려고 합니다. 목표와 가장 관련 있는 홍합의 특징을 고르시오.",
    "givens": {
      "지문": "설계 목표: 물속에서도 바위에서 쉽게 떨어지지 않게 붙인다."
    },
    "choices": [
      "날카로운 발톱으로 먹이를 잡는다.",
      "말랑한 발굽으로 바위에서 버틴다.",
      "세찬 파도에도 바위에 붙어 있다.",
      "피부의 비늘 사이로 물이 흐른다.",
      "곡선 모양 몸으로 빨리 헤엄친다."
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
    "explanation": "홍합이 물속 바위에 붙어 있는 특징을 도구 설계와 연결할 수 있어요. 실제 발명 역사를 묻는 문제는 아니에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "오리 발가락 사이의 막을 본떠 물을 잘 헤치게 하려 합니다. 가장 알맞은 물건을 고르시오.",
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
    "explanation": "발 사이의 넓은 막은 물을 헤치는 데 도움이 되므로 수영용 물갈퀴와 연결해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "나비의 몸을 기록한 두 칸을 순서대로 채우시오. 숫자 대신 한·두로 쓰시오.",
    "givens": {
      "지문": "날개: ㉠ 쌍\n더듬이: ㉡ 쌍"
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "두, 한",
      "accepted": [
        "두, 한",
        "두 한",
        "㉠ 두 ㉡ 한",
        "㉠ 두, ㉡ 한"
      ]
    },
    "explanation": "나비의 날개는 두 쌍, 더듬이는 한 쌍이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "관찰 기록에서 몸의 생김새를 고쳐야 할 동물은 무엇입니까?",
    "givens": {
      "지문": "다음은 우리 주변 동물을 관찰한 기록이다."
    },
    "choices": [
      "참새: 몸에 깃털이 있었다.",
      "개미: 다리 세 쌍이 있었다.",
      "공벌레: 다리가 전혀 없었다.",
      "금붕어: 지느러미가 있었다.",
      "달팽이: 등에 껍데기가 있었다."
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
    "explanation": "공벌레에는 일곱 쌍의 다리가 있어요. 다리가 없다는 기록을 고쳐야 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "관찰 계획 중 동물을 다치게 할 수 있는 계획을 낸 학생의 이름을 쓰시오.",
    "givens": {
      "지문": "서준: 원래 사는 곳에서 거리를 두고 본다.\n하린: 침이 있는 벌에 가까이 가지 않는다.\n도윤: 움직이지 않는 동물을 나뭇가지로 찌른다."
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
    "explanation": "관찰하려고 동물을 찌르거나 괴롭히면 안 돼요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "다리 유무로 카드를 분류했습니다. 다른 상자로 옮겨야 할 동물 하나를 쓰시오.",
    "givens": {
      "지문": "다리 있음: 개미·참새·지렁이\n다리 없음: 뱀·달팽이·붕어"
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
    "explanation": "지렁이는 다리가 없으므로 다리 없음 상자로 옮겨야 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "두 상자의 동물들이 모두 제자리에 있도록 정한 기준을 고르시오.",
    "givens": {
      "지문": "해당함: 참새·까치·닭\n해당하지 않음: 잠자리·고양이·개구리"
    },
    "choices": [
      "모두 알을 낳는 동물인가?",
      "몸에 날개가 있는가?",
      "머리에 더듬이가 있는가?",
      "몸이 털로 덮였는가?",
      "몸이 깃털로 덮였는가?"
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
    "explanation": "첫 상자의 동물은 깃털로 덮여 있고 두 번째 상자의 동물은 그렇지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "땅강아지 안내문에 넣을 주된 생활 장소를 골라 기호를 쓰시오.",
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
        "다"
      ]
    },
    "explanation": "땅강아지는 주로 땅속에 굴을 파고 생활해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "뱀과 두더지 카드를 섞었습니다. 뱀 카드에 붙일 특징을 고르시오.",
    "givens": null,
    "choices": [
      "다리가 없고 비늘로 덮였다.",
      "삽 같은 앞발로 땅을 판다.",
      "몸이 부드러운 털로 덮였다.",
      "세 쌍의 다리로 땅을 걷는다.",
      "몸에 고리 모양 마디가 많다."
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
    "explanation": "뱀은 다리 없이 기어다니며 몸이 비늘로 덮여 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "다리로 걷거나 뛰는 동물만 모으려 합니다. 빼야 할 카드의 기호를 쓰시오.",
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
        "나"
      ]
    },
    "explanation": "지렁이는 다리가 없어 기어다녀요. 다른 세 동물과 이동 방법이 달라요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "고등어와 전복을 한 전시실에 두었습니다. 두 동물의 주된 서식지를 나타낼 이름표를 고르시오.",
    "givens": null,
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
    "explanation": "고등어와 전복은 모두 바닷속에 사는 동물의 예예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "바다 동물 안내 카드를 만드시오. 동물 이름 한 가지와 그 동물의 물속 생활에 도움이 되는 몸의 특징을 연결해 쓰시오.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "고등어는 지느러미로 물속을 헤엄친다.",
      "rubric": {
        "required": [
          "바다 동물 이름과 그 동물에게 맞는 몸의 특징"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "고등어의 지느러미나 전복의 배발처럼 동물과 그 동물에게 맞는 특징을 연결해 써야 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "두 안내 카드 중 이름이 비어 있는 카드에 알맞은 동물을 고르시오.",
    "givens": {
      "지문": "이름 없는 카드: 강이나 계곡의 물속 바위에서 보인다. 딱딱한 껍데기가 있고 배발로 기어다닌다.\n메기 카드: 지느러미로 헤엄친다."
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
    "explanation": "딱딱한 껍데기와 배발은 다슬기의 특징이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "날개가 두 개, 곧 한 쌍인 동물 카드만 묶은 것을 고르시오.",
    "givens": {
      "보기": [
        "㉠ 까치",
        "㉡ 나비",
        "㉢ 갈매기",
        "㉣ 꿀벌"
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
    "explanation": "까치와 갈매기는 날개 한 쌍이에요. 나비와 꿀벌은 두 쌍이에요. 모든 곤충의 날개 수가 같다는 뜻은 아니에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "낙타의 생활 장소를 설명한 카드 하나를 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 눈과 얼음으로 덮인 추운 극지방",
        "㉡ 비가 거의 내리지 않고 낮과 밤의 온도 차이가 큰 사막",
        "㉢ 햇빛이 거의 닿지 않는 깊은 바다"
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
        "나"
      ]
    },
    "explanation": "낙타는 건조한 사막에 사는 동물의 예예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "펭귄 모형 여러 개를 서로 붙여 놓았습니다. 나타내려는 생활 모습을 고르시오.",
    "givens": null,
    "choices": [
      "큰 귀로 몸의 열을 내보낸다.",
      "등의 혹에 지방을 저장한다.",
      "초음파로 어둠 속 먹이를 찾는다.",
      "피부로 물을 흡수하여 마신다.",
      "몸을 맞대어 추위를 견딘다."
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
    "explanation": "펭귄은 여러 마리가 몸을 맞대 추위를 견뎌요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "북극곰 안내판에 적힌 발바닥 돌기의 도움을 완성하시오. 이미 나온 몸의 부분 이름은 되풀이하지 않아도 됩니다.",
    "givens": {
      "지문": "발바닥의 작은 돌기 → 얼음 위에서 (어떤 도움?)"
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "얼음 위에서 미끄러지지 않게 해 준다.",
      "rubric": {
        "required": [
          "얼음 위에서 미끄러지지 않게 하는 도움"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "문제에서 이미 돌기를 제시했으므로 얼음 위에서 미끄러지지 않는다는 도움을 쓰면 돼요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "어두운 동굴 전시의 설명에 맞는 동물을 골라 기호를 쓰시오.",
    "givens": {
      "지문": "쉴 때 거꾸로 매달리고 날개로 날아다닌다. 어두운 곳에서는 초음파를 이용하여 먹이를 찾는다.",
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
        "나"
      ]
    },
    "explanation": "박쥐의 생활 모습과 먹이 찾는 방법이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "동굴 전시에 보낼 카드만 고르시오.",
    "givens": {
      "지문": "이 전시는 햇빛이 거의 들어오지 않는 어두운 동굴에 사는 동물을 소개한다.",
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
    "explanation": "박쥐와 동굴옆새우는 동굴에 사는 동물의 예예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "바위에서 잘 미끄러지지 않는 신발을 설계하려고 합니다. 참고할 몸의 부분을 고르시오.",
    "givens": null,
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
    "explanation": "산양의 말랑한 발굽 바닥은 바위에서 미끄러지지 않는 특징과 연결해 볼 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "삽 같은 두더지 앞발의 쓰임을 본뜨려 합니다. 설계 목표와 가장 가까운 도구를 고르시오.",
    "givens": {
      "지문": "설계 목표: 흙을 파서 땅속에 공간을 만든다."
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
    "explanation": "앞발로 흙을 파는 특징을 굴착기의 쓰임과 연결할 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "공원 풀밭 관찰 목록에 섞인 바다 동물 카드를 찾아 고르시오.",
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
    "explanation": "고등어는 바다에 사는 동물이에요. 풀밭 관찰 대상으로는 알맞지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "관찰 기록 두 개를 함께 읽고 알맞은 동물 이름을 고르시오.",
    "givens": {
      "지문": "기록 1: 몸은 털로 덮여 있고 얼굴에 긴 수염이 보였다.\n기록 2: 다리 네 개로 걷다가 뛰었다."
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
    "explanation": "보기 중 털과 수염, 네 다리를 가진 동물은 고양이예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "같은 사진을 두 모둠이 분류했습니다. 결과가 달라지기 쉬운 기준 하나를 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 무섭게 느껴지는 동물인가?",
        "㉡ 머리에 더듬이가 있는가?",
        "㉢ 몸에 다리가 있는가?"
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
        "ㄱ",
        "가"
      ]
    },
    "explanation": "무섭다는 느낌은 사람마다 달라 분류 결과가 달라질 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "두 상자의 동물을 바꾸지 않고 설명할 수 있는 분류 기준을 고르시오.",
    "givens": {
      "지문": "해당함: 참새·나비\n해당하지 않음: 고양이·달팽이"
    },
    "choices": [
      "알을 낳는 동물인가?",
      "날개가 있는가?",
      "몸에 다리가 있는가?",
      "머리에 더듬이가 있는가?",
      "몸이 털로 덮였는가?"
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
    "explanation": "참새와 나비는 날개가 있고 고양이와 달팽이는 날개가 없어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "잠자리 카드를 어느 상자에 넣어야 합니까? 기호를 쓰시오.",
    "givens": {
      "지문": "분류 기준: 날개가 있는가?\n㉠ 상자: 참새·나비\n㉡ 상자: 개·지렁이"
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
        "ㄱ",
        "가"
      ]
    },
    "explanation": "잠자리는 날개가 있으므로 참새·나비와 같은 상자예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "동물 이름표와 관찰 내용을 다시 맞추려 합니다. 이름표를 잘못 붙인 학생을 쓰시오.",
    "givens": {
      "지문": "민호: 다리 없이 기어다니는 뱀 카드\n수아: 다리로 걷거나 뛰는 너구리 카드\n지우: 단단한 비늘로 덮인 지렁이 카드"
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
    "explanation": "지렁이의 몸은 단단한 비늘로 덮여 있지 않아요. 뱀의 비늘과 구별해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "동물 전시의 안내 문장을 점검했습니다. 고쳐야 하는 문장 하나를 고르시오.",
    "givens": null,
    "choices": [
      "다리로 걷거나 뛰는 동물도 있다.",
      "다리 없이 기어다니는 동물도 있다.",
      "땅속에 굴을 파는 동물도 있다.",
      "땅에 사는 동물은 모두 다리가 네 개다.",
      "땅 위와 땅속을 오가는 동물도 있다."
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
    "explanation": "땅에 사는 동물의 다리 수와 이동 방법은 다양해요. 지렁이처럼 다리가 없는 동물도 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "다 자란 개구리의 물속 생활 안내에 사용할 두 문장을 고르시오.",
    "givens": {
      "보기": [
        "㉠ 뒷다리에 물갈퀴가 있다.",
        "㉡ 지느러미를 움직여 헤엄친다.",
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
    "explanation": "다 자란 개구리는 뒷다리에 물갈퀴가 있고 땅과 물을 오가며 생활해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "수달과 다 자란 개구리의 발을 비교했습니다. 두 동물에게 모두 있는, 헤엄칠 때 도움이 되는 특징 한 가지를 적으시오.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "발에 물갈퀴가 있다.",
      "rubric": {
        "required": [
          "발에 물갈퀴가 있는 공통점"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "두 동물의 발에 모두 있는 물갈퀴를 쓰면 돼요. 이미 제시된 헤엄치는 기능을 되풀이할 필요는 없어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "강·호수 동물 전시에서 사용할 카드만 고르시오.",
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
    "explanation": "메기와 다슬기는 강이나 호수에 사는 동물의 예예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "새와 잠자리를 구별하는 관찰 기록의 빈칸을 채우시오.",
    "givens": {
      "지문": "까치·갈매기의 몸: □로 덮여 있다.\n잠자리의 몸: □로 덮여 있지 않다.\n두 빈칸에는 같은 말이 들어간다."
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
    "explanation": "까치와 갈매기는 깃털로 덮여 있지만 잠자리는 그렇지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "까치의 관찰표에서 잠자리의 특징을 잘못 옮겨 쓴 항목을 고르시오.",
    "givens": null,
    "choices": [
      "다리가 한 쌍 있다.",
      "날개가 두 쌍 있다.",
      "부리로 먹이를 먹는다.",
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
    "explanation": "까치의 날개는 한 쌍이고 잠자리의 날개는 두 쌍이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "추위를 견디는 생활 모습의 주인공을 골라 기호와 이름을 함께 쓰시오.",
    "givens": {
      "지문": "여러 마리가 몸을 맞대어 추위를 견디는 모습을 소개하려고 한다.",
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
      "answer": "㉣, 펭귄",
      "accepted": [
        "㉣, 펭귄",
        "㉣ 펭귄",
        "ㄹ 펭귄",
        "라 펭귄",
        "기호 ㉣ 이름 펭귄",
        "기호: ㉣, 이름: 펭귄"
      ]
    },
    "explanation": "펭귄이 서로 몸을 맞대는 생활 모습이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "사막 전시 카드 / 높은 산 전시 카드의 순서로 바르게 묶은 것을 고르시오.",
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
    "explanation": "낙타·사막여우는 사막, 산양·눈표범은 높은 산의 예예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "깊은 바다 전시에서 초롱아귀의 먹이 잡는 방법을 설명하려 합니다. 빛을 어떻게 이용하는지 쓰시오.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "빛을 내는 촉수로 먹이를 유인해 잡는다.",
      "rubric": {
        "required": [
          "빛으로 먹이를 유인하여 잡음"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "초롱아귀는 빛으로 먹이를 유인해요. 빛을 낸다는 사실만 쓰지 말고 먹이와의 관계를 연결해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "수리의 발을 본떠 물건을 놓치지 않고 움켜잡는 장치를 설계하려 합니다. 쓰임이 가장 가까운 것을 고르시오.",
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
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "수리의 발이 먹이를 잘 잡고 놓치지 않는 특징을 집게 차의 쓰임과 연결할 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "동물의 특징을 본뜨는 설계 메모입니다. 목표와 참고 동물이 어울리지 않는 두 메모를 고르시오.",
    "givens": {
      "보기": [
        "㉠ 오리의 발: 물을 잘 헤치는 물갈퀴를 만든다.",
        "㉡ 문어의 빨판: 물건을 움켜쥐는 집게를 만든다.",
        "㉢ 두더지의 앞발: 흙을 파는 굴착기를 만든다.",
        "㉣ 수리의 발: 벽에 붙이는 흡착판을 만든다."
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
    "explanation": "문어 빨판은 붙는 쓰임, 수리 발은 움켜잡는 쓰임과 연결해요. 두 메모가 서로 바뀌었어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "이름이 가려진 관찰 기록입니다. 기록에 맞는 동물을 고르시오.",
    "givens": {
      "지문": "커다란 눈, 두 쌍의 날개, 가늘고 긴 배가 보였다. 날개를 움직여 날아다녔다."
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
    "explanation": "보기 중 커다란 눈과 가늘고 긴 배, 두 쌍의 날개를 가진 동물은 잠자리예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "두 모둠이 같은 사진을 분류했는데 결과가 달랐습니다. 이 기준이 알맞은지와 결과가 달라진 까닭을 함께 쓰시오.",
    "givens": {
      "지문": "분류 기준: 생김새가 예쁜가?\n각자 느낀 대로 예쁜 동물을 골랐다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "알맞지 않다. 예쁘다고 느끼는 정도가 사람마다 달라 분류 결과가 달라질 수 있다.",
      "rubric": {
        "required": [
          "알맞지 않다는 판단과 사람마다 결과가 달라질 수 있다는 까닭"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "예쁘다는 느낌은 사람마다 달라 모두 같은 결과를 얻는 기준으로 알맞지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "두 상자에 붙일 기준을 찾으시오. 해당함 / 해당하지 않음 순서로 분류했습니다.",
    "givens": {
      "지문": "해당함: 뱀·지렁이·달팽이\n해당하지 않음: 개미·참새·고양이"
    },
    "choices": [
      "모두 알을 낳는가?",
      "몸에 날개가 있는가?",
      "다리가 없는가?",
      "머리에 더듬이가 있는가?",
      "땅속에서만 생활하는가?"
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
    "explanation": "첫 상자의 세 동물은 다리가 없고 두 번째 상자의 동물은 다리가 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "지렁이 전시에 두더지 설명 한 줄이 섞였습니다. 빼야 할 문장을 고르시오.",
    "givens": null,
    "choices": [
      "다리가 없이 몸으로 기어다닌다.",
      "주로 땅속에서 생활한다.",
      "몸에 고리 모양의 마디가 많다.",
      "흙과 썩은 낙엽 등을 먹는다.",
      "삽 같은 앞발로 굴을 파고 산다."
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
    "explanation": "삽 같은 앞발은 두더지의 특징이에요. 지렁이에게 앞발이 있는 것은 아니에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "바다 동물 전시에서 사용할 카드만 남긴 것을 고르시오.",
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
    "explanation": "메기는 강이나 호수에 사는 예이므로 빼고, 나머지 세 바다 동물 카드를 남겨요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "날개 수로 분류할 때 다른 네 카드와 상자가 달라지는 동물을 고르시오.",
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
    "explanation": "잠자리는 날개 두 쌍이고 나머지 네 새는 한 쌍이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "북극곰의 털에 관한 관찰 기록과 추운 환경에서의 도움을 연결해 설명하시오.",
    "givens": {
      "지문": "관찰 기록: 털이 촘촘하게 나 있다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "촘촘한 털이 추위를 막아 따뜻하게 지내는 데 도움이 된다.",
      "rubric": {
        "required": [
          "촘촘한 털이 추위를 막거나 따뜻하게 하는 도움"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "주어진 털의 특징을 추위 막기와 연결하면 돼요. 기록에 없는 피부 특징을 더 요구하지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "건조한 사막 전시로 보낼 동물 카드만 고르시오.",
    "givens": {
      "지문": "전시 안내: 비가 거의 내리지 않고 낮과 밤의 온도 차이가 큰 환경",
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
    "explanation": "낙타와 사막여우가 건조한 사막에 사는 예예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "서식지 지도에 동물 카드를 붙였습니다. 옮겨야 할 카드 하나를 고르시오.",
    "givens": null,
    "choices": [
      "사막 칸에 붙인 낙타",
      "높은 산 칸에 붙인 산양",
      "극지방 칸에 붙인 펭귄",
      "깊은 바다 칸에 붙인 박쥐",
      "깊은 바다 칸에 붙인 초롱아귀"
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
    "explanation": "박쥐는 동굴에 사는 예이므로 깊은 바다 칸에서 옮겨야 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "낙타의 사막 생활 안내에 쓸 수 있는 두 기록을 고르시오.",
    "givens": {
      "보기": [
        "㉠ 등의 혹에 지방이 저장된다.",
        "㉡ 빛나는 촉수로 먹이를 모은다.",
        "㉢ 넓은 발바닥 덕분에 모래에 발이 덜 빠진다.",
        "㉣ 발바닥 돌기로 얼음에서 버틴다."
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
    "explanation": "혹의 지방과 넓은 발바닥을 낙타의 사막 생활에 연결해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "산천어의 곡선 모양 몸을 참고해 앞부분이 매끈한 모형을 설계하려 합니다. 가장 관련 있는 물체를 고르시오.",
    "givens": {
      "지문": "설계 메모: 물고기의 부드러운 곡선 모양을 이동하는 물체의 앞부분에 적용해 본다."
    },
    "choices": [
      "고속열차",
      "흡착판",
      "굴착기",
      "등산화 밑창",
      "물속 접착제"
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
    "explanation": "곡선 모양을 적용할 대상을 묻는 설계 문제예요. 특정 열차가 실제로 어느 동물에서 유래했는지를 묻는 것은 아니에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "헤엄치는 데 쓸 수영복 표면을 설계하려고 합니다. 물이 잘 흐르는 특징을 참고할 부분을 고르시오.",
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
    "explanation": "상어 피부에서 물이 잘 흐르는 특징을 수영복 표면 설계와 연결할 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "문어의 빨판을 본뜬 칫솔걸이를 설계했습니다. 목표한 기능을 바르게 적은 것을 고르시오.",
    "givens": null,
    "choices": [
      "매끄러운 벽에 붙여 물건을 건다.",
      "단단한 땅을 깊이 파서 굴을 만든다.",
      "물속에서 빠르게 헤엄치도록 돕는다.",
      "가파른 바위에서 미끄럼을 막는다.",
      "물건을 움켜잡아 다른 곳에 옮긴다."
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
    "explanation": "문어 빨판의 붙는 특징을 칫솔걸이에 연결한 설계예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  }
];
