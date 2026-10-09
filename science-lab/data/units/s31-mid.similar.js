// 3-1 Ⅳ 중간평가 — 유사문항 50 (창작). 원문 1문항당 1개, 같은 유형·난이도로 상황과 물체를 바꿨다. of = 짝이 되는 원문 (세트, 번호).
export const similar = [
  {
    "id": "s31-mid-v001",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 물체의 움직임이 변하는 경우를 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 고무찰흙을 손바닥으로 꾹 누른다.",
        "㉡ 멈춰 있는 축구공을 발로 찬다.",
        "㉢ 풍선을 두 손으로 세게 누른다.",
        "㉣ 멈춰 있는 그네를 뒤에서 힘을 주어 민다."
      ]
    },
    "choices": [
      "㉠",
      "㉡, ㉣",
      "㉠, ㉢",
      "㉡, ㉢, ㉣",
      "㉠, ㉡, ㉢, ㉣"
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
    "explanation": "멈춰 있던 축구공을 차거나 그네를 밀면 움직임이 변하고, 고무찰흙이나 풍선을 누르면 모양이 변해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v002",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "밀어서 움직일 때 가장 작은 힘이 드는 것은 어느 것입니까? (단, 수레와 벽돌 각각의 종류와 무게는 같습니다.)",
    "givens": null,
    "choices": [
      "벽돌을 열 장 실은 수레",
      "벽돌을 일곱 장 실은 수레",
      "벽돌을 다섯 장 실은 수레",
      "벽돌을 세 장 실은 수레",
      "벽돌을 한 장 실은 수레"
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
    "explanation": "벽돌을 적게 실을수록 수레가 가벼워지고, 가벼운 물체일수록 밀어서 움직일 때 작은 힘이 들어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v003",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음에서 설명하는 것으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "나무판자를 받침대 위에 올려 수평을 잡을 수 있게 만든 것입니다."
    },
    "choices": [
      "저울",
      "수평",
      "받침점",
      "수평대",
      "용수철"
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
    "explanation": "나무판자를 받침대 위에 올려 수평을 잡을 수 있게 만든 것은 수평대예요. 나무판자와 받침대가 닿는 곳은 받침점이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v004",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같이 물체를 올려놓았을 때 나무판자가 수평이 되게 하는 방법으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "수평대 나무판자의 왼쪽 3에 풀을, 오른쪽 3에 가위를 올려놓았더니 나무판자가 가위 쪽으로 기울어졌습니다."
    },
    "choices": [
      "가위를 받침점으로부터 더 먼 곳으로 옮긴다.",
      "풀을 받침점으로부터 더 먼 곳으로 옮긴다.",
      "풀을 받침점으로부터 더 가까운 곳으로 옮긴다.",
      "풀과 가위의 위치를 서로 바꾼다.",
      "풀과 가위를 둘 다 한 칸씩 더 바깥으로 옮긴다."
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
    "explanation": "나무판자가 가위 쪽으로 기울었으니 가위가 더 무거워요. 가벼운 풀을 받침점에서 더 먼 곳으로 옮기면 수평을 잡을 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v005",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "민준과 서아 중 더 무거운 사람의 이름을 쓰세요.",
    "givens": {
      "지문": "민준과 서아가 시소 양쪽에 앉아 시소가 수평을 이루었습니다. 민준은 받침점에서 먼 곳에, 서아는 받침점에서 가까운 곳에 앉아 있습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "서아",
      "accepted": [
        "서아"
      ]
    },
    "explanation": "무게가 다른 두 사람이 시소에서 수평을 이루면 받침점에 가까이 앉은 사람이 더 무거워요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v006",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "민준이 받침점에 더 가까운 곳으로 옮겨 앉았을 때 나타나는 현상으로 알맞은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "민준과 서아가 시소 양쪽에 앉아 시소가 수평을 이루었습니다. 민준은 받침점에서 먼 곳에, 서아는 받침점에서 가까운 곳에 앉아 있습니다.",
      "보기": [
        "㉠ 시소가 계속 수평을 이룬다.",
        "㉡ 시소가 민준 쪽으로 기울어진다.",
        "㉢ 시소가 서아 쪽으로 기울어진다."
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
        "시소가 서아 쪽으로 기울어진다."
      ]
    },
    "explanation": "더 가벼운 민준이 받침점 가까이 옮겨 앉으면 더 무거운 서아 쪽으로 시소가 기울어져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v007",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "크기가 서로 다른 택배 상자 세 개의 무게를 정확하게 비교하는 방법으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "상자를 한 개씩 들어 보고 더 무거운 느낌이 나는 것을 고른다.",
      "상자의 길이를 자로 재어 가장 큰 상자가 가장 무겁다고 정한다.",
      "친구 여러 명이 들어 보고 무겁다고 말한 사람이 많은 상자를 고른다.",
      "상자를 바닥에 밀어 보고 더 멀리 미끄러지는 상자를 고른다.",
      "상자를 하나씩 저울에 올려 나타난 무게를 비교한다."
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
    "explanation": "손으로 들어 보는 어림은 사람마다 달라 정확하지 않고, 크기가 크다고 꼭 무거운 것도 아니에요. 저울을 쓰면 무게를 정확하게 비교할 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v008",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음에서 설명하는 용수철저울의 부분으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "무게를 잴 물체를 거는 부분입니다."
    },
    "choices": [
      "고리",
      "눈금",
      "손잡이",
      "표시 자",
      "영점 조절 나사"
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
    "explanation": "용수철저울에서 무게를 잴 물체를 거는 부분은 고리예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v009",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 여러 가지 학용품을 전자저울의 저울판에 각각 올려놓았을 때 표시판에 나타난 숫자입니다. 학용품을 가벼운 순서대로 나열한 것은 어느 것입니까?",
    "givens": {
      "표": {
        "풀": [
          "25 g"
        ],
        "가위": [
          "48 g"
        ],
        "지우개": [
          "16 g"
        ],
        "필통": [
          "130 g"
        ]
      }
    },
    "choices": [
      "필통 - 가위 - 풀 - 지우개",
      "풀 - 지우개 - 필통 - 가위",
      "지우개 - 가위 - 풀 - 필통",
      "지우개 - 풀 - 가위 - 필통",
      "가위 - 풀 - 지우개 - 필통"
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
    "explanation": "전자저울의 표시판 숫자가 작을수록 가벼워요. 16 g인 지우개가 가장 가볍고, 130 g인 필통이 가장 무거워요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v010",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 무거운 물체를 옮길 때 도구를 이용한 모습입니다. 각각 이용한 도구를 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "㉠ 지레",
        "㉡ 빗면"
      ],
      "지문": "(1) 트럭 짐칸에 비스듬히 걸쳐 놓은 판자를 따라 무거운 상자를 밀어 올렸습니다. (    )\n(2) 받침점 위에 걸친 긴 막대의 한쪽 끝에 무거운 돌을 올리고, 반대쪽 끝을 눌러 돌을 들어 올렸습니다. (    )"
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(1) ㉡ (2) ㉠",
      "accepted": [
        "(1) ㉡ (2) ㉠",
        "(1) ㉡, (2) ㉠",
        "㉡, ㉠",
        "ㄴ, ㄱ",
        "(1) 빗면 (2) 지레",
        "빗면, 지레"
      ]
    },
    "explanation": "비스듬하게 기울어진 판자를 따라 밀어 올리는 것은 빗면이고, 받침점 위에 걸친 막대로 돌을 들어 올리는 것은 지레예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v011",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "택배 기사가 무거운 짐수레를 트럭 짐칸에 올릴 때, 직접 들어 올리지 않고 짐칸에 비스듬히 걸쳐 놓은 판자를 따라 밀어 올렸습니다. 이렇게 하면 좋은 점을 힘과 관련지어 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "판자로 만든 빗면을 따라 밀면 무거운 짐수레를 높은 짐칸에 직접 들어 올릴 때보다 더 작은 힘으로 옮길 수 있어요.",
      "rubric": {
        "required": [
          "짐을 높은 곳(짐칸)으로 옮긴다",
          "더 작은 힘이 든다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "비스듬히 걸친 판자는 빗면이에요. 빗면을 이용하면 무거운 물체를 높은 곳으로 옮길 때 직접 들어 올릴 때보다 작은 힘이 들어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v012",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "우리 생활에서 빗면을 이용하는 예로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "경사로",
      "나사못",
      "사다리차",
      "구불구불한 산길",
      "손톱깎이"
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
    "explanation": "경사로·나사못·사다리차·구불구불한 산길은 빗면을 이용하는 예이고, 손톱깎이는 받침점이 있는 지레를 이용하는 예예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v013",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같은 특징을 가진 동물로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 몸이 여러 개의 마디로 되어 있고, 일곱 쌍의 다리가 있습니다.\n• 건드리면 몸을 공처럼 둥글게 오므립니다."
    },
    "choices": [
      "개미",
      "공벌레",
      "지렁이",
      "달팽이",
      "참새"
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
    "explanation": "공벌레는 몸이 여러 마디로 되어 있고 일곱 쌍의 다리가 있으며, 건드리면 몸을 공처럼 둥글게 오므려요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v014",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "동물을 특징에 따라 분류할 때 분류 기준으로 알맞은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "귀엽게 생겼는가?",
      "날개가 있는가?",
      "빠르게 움직이는가?",
      "더듬이가 있는가?",
      "몸집이 큰가?"
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
    "explanation": "분류 기준은 누가 분류해도 같은 결과가 나와야 해요. 귀여운지·빠른지·큰지는 사람마다 판단이 달라 기준이 될 수 없어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v015",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같이 동물을 분류하였을 때 분류 기준으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "표": {
        "그렇다.": [
          "붕어, 고등어"
        ],
        "그렇지 않다.": [
          "개, 참새"
        ]
      }
    },
    "choices": [
      "알을 낳는가?",
      "다리가 있는가?",
      "몸이 털로 덮여 있는가?",
      "지느러미가 있는가?",
      "날개가 있는가?"
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
    "explanation": "붕어와 고등어는 지느러미가 있고, 개와 참새는 지느러미가 없어요. 참새도 알을 낳으므로 ‘알을 낳는가?’로는 이렇게 나눌 수 없어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v016",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "땅에 사는 동물 중 이동하는 방법이 나머지 넷과 다른 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "노루",
      "너구리",
      "개미",
      "토끼",
      "지렁이"
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
    "explanation": "노루·너구리·개미·토끼는 다리로 걷거나 뛰어다니고, 지렁이는 다리가 없어 기어다녀요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v017",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 땅 위와 땅속을 오가며 사는 동물을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 개미",
        "㉡ 노루",
        "㉢ 뱀",
        "㉣ 두더지",
        "㉤ 지렁이",
        "㉥ 너구리"
      ]
    },
    "choices": [
      "㉠, ㉢",
      "㉡, ㉥",
      "㉣, ㉤",
      "㉠, ㉣, ㉤",
      "㉢, ㉤, ㉥"
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
    "explanation": "개미와 뱀은 땅 위와 땅속을 오가며 살아요. 노루·너구리는 땅 위, 두더지·지렁이는 땅속에 살아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v018",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 동물들의 공통적인 특징으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "갯벌에서 볼 수 있는 동물: 게, 조개"
    },
    "choices": [
      "다리로 옆으로 걸어 다닌다.",
      "몸이 단단한 껍데기로 덮여 있다.",
      "배발로 바위에 붙어 기어다닌다.",
      "여러 개의 지느러미로 헤엄쳐 다닌다.",
      "햇빛이 닿지 않는 깊은 바닷속에서만 산다."
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
    "explanation": "게와 조개는 갯벌에 사는 동물로, 둘 다 몸이 단단한 껍데기로 덮여 있어요. 옆으로 걷는 것은 게, 배발로 기는 것은 전복·다슬기의 특징이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v019",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물속에서 지느러미로 헤엄쳐 다니는 동물로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "수달",
      "게",
      "다슬기",
      "붕어",
      "개구리"
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
    "explanation": "붕어는 여러 개의 지느러미로 헤엄쳐요. 수달·개구리는 물갈퀴가 있는 발로 헤엄치고, 다슬기는 배발로, 게는 다리로 기어다녀요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v020",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 동물들의 공통적인 특징을 <보기>에서 모두 고른 것은 어느 것입니까?",
    "givens": {
      "지문": "날 수 있는 동물: 참새, 까치",
      "보기": [
        "㉠ 날개가 한 쌍 있다.",
        "㉡ 몸이 깃털로 덮여 있다.",
        "㉢ 다리가 세 쌍 있다.",
        "㉣ 날개가 얇고 투명하다."
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉣",
      "㉢, ㉣",
      "㉠, ㉡, ㉢"
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
    "explanation": "참새와 까치는 새라서 날개가 한 쌍이고 몸이 깃털로 덮여 있어요. 다리가 세 쌍이거나 날개가 얇고 투명한 것은 곤충의 특징이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v021",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 21
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 ㉠, ㉡에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "사막여우는 [㉠]이/가 커서 몸속의 [㉡]을/를 밖으로 내보내기 좋습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 귀, ㉡ 열",
      "accepted": [
        "㉠ 귀, ㉡ 열",
        "㉠-귀, ㉡-열",
        "㉠: 귀, ㉡: 열",
        "귀, 열",
        "귀 열",
        "㉠ 귀 ㉡ 열"
      ]
    },
    "explanation": "사막여우는 사막에 사는 동물로, 큰 귀로 몸속의 열을 밖으로 내보내 더운 사막에서 살기에 알맞아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v022",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 22
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "박쥐에 대해 바르게 설명한 사람의 이름을 쓰세요.",
    "givens": {
      "지문": "• 서준: 햇빛이 잘 드는 넓은 들판에 삽니다.\n• 하린: 초음파를 내보내 어두운 곳에서도 먹이를 찾습니다.\n• 유나: 등의 혹에 지방을 저장해 물 없이도 오래 삽니다.\n• 지안: 발바닥의 작은 돌기로 얼음 위에서 미끄러지지 않습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "하린",
      "accepted": [
        "하린"
      ]
    },
    "explanation": "박쥐는 어두운 동굴에 살며, 초음파를 내보내 어두운 곳에서도 먹이를 찾아요. 혹에 지방을 저장하는 것은 낙타, 발바닥 돌기는 북극곰의 특징이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v023",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 23
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "<보기>에서 다음과 같은 환경에 주로 사는 동물을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "지문": "• 비가 적게 내려 매우 건조합니다.\n• 모래가 많고 낮에는 매우 덥습니다.",
      "보기": [
        "㉠ 낙타",
        "㉡ 북극곰",
        "㉢ 사막여우",
        "㉣ 눈표범"
      ]
    },
    "choices": [
      "㉡",
      "㉣",
      "㉠, ㉢",
      "㉡, ㉣",
      "㉠, ㉢, ㉣"
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
    "explanation": "물이 적고 건조하며 모래가 많은 사막에 대한 설명이에요. 낙타와 사막여우는 사막에, 북극곰은 극지방에, 눈표범은 높은 산에 살아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v024",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 24
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T12",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "<보기>에서 잠수부가 발에 끼우고 헤엄치는 물갈퀴를 만들 때 이용한 동물을 골라 기호를 쓰고, 이용한 동물의 특징을 쓰세요.",
    "givens": {
      "보기": [
        "㉠ 문어",
        "㉡ 오리",
        "㉢ 수리",
        "㉣ 산천어"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "㉡, 오리는 발가락 사이에 물갈퀴가 있어 물을 잘 밀어 헤엄치는 특징을 이용했어요.",
      "rubric": {
        "required": [
          "㉡(오리)을 고른다",
          "오리 발의 물갈퀴로 물을 밀어 헤엄친다는 특징"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "오리는 발가락 사이에 물갈퀴가 있어 물을 밀어 내며 헤엄쳐요. 이 특징을 본떠 헤엄칠 때 쓰는 물갈퀴를 만들었어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v025",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 25
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같은 동물의 특징을 이용한 예로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "수리는 날카로운 발톱이 있는 발로 먹이를 꽉 움켜잡습니다."
    },
    "choices": [
      "굴착기",
      "흡착판",
      "집게 차",
      "고속열차",
      "전신 수영복"
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
    "explanation": "수리가 날카로운 발톱이 있는 발로 먹이를 움켜잡는 특징을 이용해 물건을 꽉 집어 옮기는 집게 차를 만들었어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v026",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 물체가 나와 가까워지는 방향으로 움직이는 경우를 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "㉠ 그네를 힘을 주어 민다.",
        "㉡ 서랍을 힘을 주어 당긴다.",
        "㉢ 장난감 기차를 힘을 주어 민다."
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
        "서랍을 힘을 주어 당긴다."
      ]
    },
    "explanation": "물체를 당기면 나와 가까워지는 방향으로, 밀면 나와 멀어지는 방향으로 움직여요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v027",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 밀거나 당겨서 움직일 때 더 큰 힘이 드는 것을 골라 기호를 쓰세요. (단, 수레와 물통은 같은 것입니다.)",
    "givens": {
      "보기": [
        "㉠ 물을 가득 채운 물통을 실은 수레",
        "㉡ 물을 반만 채운 물통을 실은 수레"
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
        "물을 가득 채운 물통을 실은 수레"
      ]
    },
    "explanation": "물을 가득 채운 물통을 실은 수레가 더 무거워요. 무거운 물체일수록 밀거나 당길 때 더 큰 힘이 들어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v028",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "시소가 수평을 이루었다는 것은 시소가 어떤 상태라는 뜻인지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "시소가 어느 한쪽으로도 기울어지지 않고 평평한 상태라는 뜻이에요.",
      "rubric": {
        "required": [
          "어느 한쪽으로 기울어지지 않는다",
          "평평한 상태이다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "수평은 물체가 어느 한쪽으로 기울어지지 않고 평평한 상태예요. 몸무게가 달라도 앉는 자리를 바꾸면 수평이 될 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v029",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "수평대에 대해 바르게 설명한 사람의 이름을 쓰세요.",
    "givens": {
      "지문": "• 지호: 나무판자와 받침대가 닿는 곳을 받침점이라고 합니다.\n• 하은: 받침대를 나무판자의 왼쪽 끝 5에 놓아야 나무판자가 수평이 됩니다.\n• 도윤: 나무판자가 한쪽으로 기울어진 상태를 수평이라고 합니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "지호",
      "accepted": [
        "지호"
      ]
    },
    "explanation": "나무판자와 받침대가 닿는 곳이 받침점이에요. 아무것도 올리지 않은 나무판자는 가운데에 받침대를 놓아야 수평이 되고, 수평은 기울지 않은 상태예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v030",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "㉠과 ㉡ 중 더 무거운 것을 골라 기호를 쓰세요.",
    "givens": {
      "지문": "수평대 나무판자의 왼쪽 4에 ㉠ 나무 블록을, 오른쪽 2에 ㉡ 쇠 블록을 올려놓았더니 나무판자가 수평이 되었습니다."
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
        "쇠 블록"
      ]
    },
    "explanation": "수평을 이룰 때 받침점에 더 가까이 놓인 물체가 더 무거워요. ㉡이 받침점에서 2칸, ㉠이 4칸 떨어져 있으니 ㉡이 더 무거워요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v031",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "수평이 된 나무판자 양쪽의 같은 거리에 과일을 올려놓았더니 다음과 같았습니다. 이에 대한 설명으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 귤과 자두를 올렸더니 나무판자가 수평을 이루었습니다.\n• 자두와 키위를 올렸더니 나무판자가 자두 쪽으로 기울어졌습니다."
    },
    "choices": [
      "귤은 자두보다 무겁다.",
      "키위는 귤보다 무겁다.",
      "자두는 귤보다 무겁다.",
      "귤은 키위보다 무겁다.",
      "키위는 자두보다 무겁다."
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
    "explanation": "같은 거리에 올렸을 때 수평이면 무게가 같고, 기울어진 쪽이 더 무거워요. 귤과 자두는 무게가 같고 자두가 키위보다 무거우니 귤도 키위보다 무거워요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v032",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "우리 생활에서 저울을 사용하는 경우로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "달리기를 할 때 걸린 시간을 재기 위해 저울을 사용한다.",
      "어항 속 물이 얼마나 따뜻한지 알아보기 위해 저울을 사용한다.",
      "빵을 만들 때 밀가루의 무게를 정확하게 재기 위해 저울을 사용한다.",
      "교실 칠판의 가로 길이를 재기 위해 저울을 사용한다.",
      "우유갑에 든 우유가 몇 mL인지 알아보기 위해 저울을 사용한다."
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
    "explanation": "저울은 물체의 무게를 잴 때 사용해요. 시간은 시계, 온도는 온도계, 길이는 자로 재요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v033",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "용수철저울에서 고리에 건 물체가 무거울수록 더 많이 늘어나는 부분의 이름을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "용수철",
      "accepted": [
        "용수철"
      ]
    },
    "explanation": "용수철저울은 고리에 건 물체가 무거울수록 용수철이 더 많이 늘어나는 성질을 이용해 무게를 재요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v034",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "구슬 세 개를 넣은 지퍼 백을 용수철저울의 고리에 걸었습니다. 이 지퍼 백에 같은 구슬을 세 개 더 넣었을 때 용수철저울에 나타나는 변화로 알맞은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "용수철이 줄어든다.",
      "용수철이 더 늘어난다.",
      "표시 자가 눈금 ‘0’으로 돌아간다.",
      "표시 자가 가리키는 눈금의 숫자가 작아진다.",
      "표시 자가 가리키는 눈금의 숫자가 커진다."
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
    "explanation": "구슬을 더 넣으면 지퍼 백이 무거워져 용수철이 더 늘어나고, 표시 자가 가리키는 눈금의 숫자가 커져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v035",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "전자저울로 물체의 무게를 잴 때, 물체를 저울판에 올려놓기 바로 전에 해야 하는 일을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "㉠ 전원 단추를 눌러 전자저울을 켠다.",
        "㉡ 전자저울을 평평한 곳에 놓는다.",
        "㉢ 영점 단추를 눌러 표시판의 숫자가 0이 되게 한다.",
        "㉣ 표시판에 나타난 숫자를 읽는다."
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
        "영점 단추를 눌러 표시판의 숫자가 0이 되게 한다."
      ]
    },
    "explanation": "전자저울은 평평한 곳에 놓고, 전원을 켜고, 영점 단추를 눌러 0을 맞춘 뒤에 물체를 저울판 가운데에 올려요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v036",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 벽돌을 두 가지 방법으로 옮기면서 용수철저울로 드는 힘을 재었습니다. <보기>에서 용수철저울의 표시 자가 더 작은 숫자를 가리키는 경우를 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "㉠ 용수철저울에 벽돌을 매달아 직접 들어 올릴 때",
        "㉡ 판자로 만든 빗면 위에서 용수철저울로 벽돌을 끌어 올릴 때"
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
        "빗면을 이용해 끌어 올릴 때"
      ]
    },
    "explanation": "빗면을 이용하면 직접 들어 올릴 때보다 작은 힘이 들어서 용수철저울의 표시 자가 더 작은 숫자를 가리켜요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v037",
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
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "우리 생활에서 지레나 빗면을 이용하는 예를 바르게 짝 지은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "나사못 - 지레",
      "손톱깎이 - 지레",
      "장도리 - 빗면",
      "경사로 - 지레",
      "가위 - 빗면"
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
    "explanation": "손톱깎이·장도리·가위는 받침점이 있는 지레를, 나사못·경사로는 비스듬한 면인 빗면을 이용하는 예예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v038",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "우리 주변에 사는 동물의 특징에 대한 설명으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "금붕어는 지느러미로 헤엄친다.",
      "개미는 두 쌍의 다리가 있다.",
      "달팽이는 세 쌍의 다리로 걷는다.",
      "참새는 몸이 털로 덮여 있다.",
      "공벌레는 더듬이가 없다."
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
    "explanation": "금붕어는 지느러미로 헤엄쳐요. 개미는 다리가 세 쌍, 달팽이는 다리가 없고, 참새는 몸이 깃털로 덮여 있으며, 공벌레는 더듬이가 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v039",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 동물들의 공통적인 특징으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "우리 주변의 동물: 개미, 공벌레"
    },
    "choices": [
      "더듬이가 있다.",
      "날개가 있다.",
      "다리가 없다.",
      "몸이 털로 덮여 있다.",
      "다리가 세 쌍 있다."
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
    "explanation": "개미와 공벌레는 둘 다 더듬이가 있어요. 다리가 세 쌍인 것은 개미뿐이고, 공벌레는 다리가 일곱 쌍이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v040",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 분류 기준과 그 분류 기준에 따라 동물을 분류한 결과입니다. 잘못 분류한 동물을 골라 이름을 쓰세요.",
    "givens": {
      "표": {
        "분류 기준": [
          "다리가 있는가?"
        ],
        "그렇다.": [
          "개, 닭, 지렁이"
        ],
        "그렇지 않다.": [
          "뱀, 달팽이"
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
    "explanation": "개와 닭은 다리가 있고, 지렁이·뱀·달팽이는 다리가 없어요. 그래서 지렁이는 ‘그렇지 않다.’에 들어가야 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v041",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두더지에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "땅속에 굴을 파고 산다.",
      "몸이 털로 덮여 있다.",
      "몸이 고리 모양의 마디로 되어 있다.",
      "눈이 매우 작아 잘 보이지 않는다.",
      "앞발이 크고 넓어 땅을 파기에 알맞다."
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
    "explanation": "두더지는 크고 넓은 앞발로 땅속에 굴을 파고 살아요. 고리 모양의 마디가 많은 것은 지렁이의 특징이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v042",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "주로 땅속에서 사는 동물끼리 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "개미, 노루",
      "뱀, 너구리",
      "노루, 땅강아지",
      "지렁이, 두더지",
      "개미, 너구리"
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
    "explanation": "지렁이와 두더지는 땅속에 살아요. 노루·너구리는 땅 위에 살고, 개미·뱀은 땅 위와 땅속을 오가며 살아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v043",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T09",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음의 동물들이 물속에서 이동하는 방법을 쓰세요.",
    "givens": {
      "지문": "강이나 호수에 사는 동물: 붕어, 메기"
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "붕어와 메기는 지느러미를 움직여 물속을 헤엄쳐 다녀요.",
      "rubric": {
        "required": [
          "지느러미를 이용한다",
          "헤엄쳐 다닌다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "붕어와 메기는 강이나 호수에 사는 물고기예요. 몸에 있는 여러 개의 지느러미를 움직여 헤엄쳐 다녀요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v044",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 강이나 호수에 사는 동물에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 수달은 발가락 사이에 물갈퀴가 있어 헤엄을 잘 친다.",
        "㉡ 다슬기는 지느러미를 움직여 헤엄쳐 다닌다.",
        "㉢ 메기는 아가미가 있어 물속에서 숨을 쉴 수 있다.",
        "㉣ 붕어는 몸이 딱딱한 껍데기로 되어 있다."
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
    "explanation": "수달은 발가락 사이의 물갈퀴로 헤엄치고, 메기는 아가미로 물속에서 숨을 쉬어요. 다슬기는 배발로 기어다니고, 붕어는 몸이 비늘로 덮여 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v045",
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
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "참새나 까치 같은 새는 몸이 □(으)로 덮여 있고, 한 쌍의 날개가 있어 날 수 있습니다."
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
    "explanation": "새는 몸이 깃털로 덮여 있고 한 쌍의 날개가 있어요. 깃털은 가벼워서 나는 데 도움이 돼요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v046",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 21
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "북극곰에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "피부가 두꺼워 추위를 견딘다.",
      "물속을 헤엄쳐 이동하기도 한다.",
      "촘촘하게 난 털이 추위를 막아 준다.",
      "발바닥의 작은 돌기 덕분에 얼음 위에서 잘 미끄러지지 않는다.",
      "등의 혹에 지방을 저장해 물 없이 며칠을 견딘다."
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
    "explanation": "북극곰은 두꺼운 피부와 촘촘한 털로 추위를 막고, 발바닥 돌기로 얼음 위에서 미끄러지지 않아요. 등의 혹에 지방을 저장하는 것은 낙타예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v047",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 22
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같은 특징을 가진 동물로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 눈썹이 길어 모래바람이 불어도 눈에 모래가 잘 들어가지 않습니다.\n• 발바닥이 넓어 모래에 발이 잘 빠지지 않습니다.\n• 물과 먹이가 없어도 며칠 동안 살 수 있습니다."
    },
    "choices": [
      "산양",
      "펭귄",
      "낙타",
      "북극곰",
      "사막여우"
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
    "explanation": "낙타는 사막에 사는 동물로, 눈썹이 길어 모래가 잘 들어가지 않고 발바닥이 넓어 모래에 발이 잘 빠지지 않으며, 혹에 지방을 저장해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v048",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 23
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음과 같은 환경에 주로 사는 동물로 알맞은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "햇빛이 거의 들지 않아 어둡고, 습합니다.",
      "보기": [
        "㉠ 낙타",
        "㉡ 산양",
        "㉢ 박쥐",
        "㉣ 펭귄"
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
        "박쥐"
      ]
    },
    "explanation": "햇빛이 거의 들지 않아 어둡고 습한 곳은 동굴이에요. 박쥐는 동굴에 살고, 낙타는 사막, 산양은 높은 산, 펭귄은 극지방에 살아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v049",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 24
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 상어의 피부를 본떠 만든 것을 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "㉠ 흡착판",
        "㉡ 전신 수영복",
        "㉢ 굴착기"
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
        "전신 수영복"
      ]
    },
    "explanation": "물이 잘 흐르는 상어 피부의 특징을 본떠 물속에서 빠르게 헤엄칠 수 있는 전신 수영복을 만들었어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-mid-v050",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 25
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "굴착기를 만드는 데 이용한 동물의 특징으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "물체에 잘 붙는 문어의 빨판",
      "먹이를 움켜잡는 수리의 발",
      "물갈퀴가 있는 오리의 발",
      "잘 미끄러지지 않는 산양의 발바닥",
      "땅을 잘 파는 두더지의 앞발"
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
    "explanation": "두더지가 크고 단단한 앞발로 땅을 파는 특징을 이용해 단단한 땅을 파는 굴착기를 만들었어요.",
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
