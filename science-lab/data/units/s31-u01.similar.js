// 3-1 Ⅰ 힘과 우리 생활 — 유사문항 80 (창작). 원문 1문항당 1개, 같은 유형·난이도로 상황과 물체를 바꿨다. of = 짝이 되는 원문 (세트, 번호).
export const similar = [
  {
    "id": "s31-u01-v001",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "멈춰 있던 공이 손으로 밀자 굴러갔어요. 찰흙도 손으로 누르자 납작해졌어요. 두 관찰에서 물체의 움직임이나 모양을 바꾼 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "공의 색",
      "방의 밝기",
      "시계의 소리",
      "물체의 이름",
      "손으로 준 힘"
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
    "explanation": "물체를 밀거나 누르며 힘을 주면 움직임이나 모양이 달라질 수 있어요.",
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
    "id": "s31-u01-v002",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "관찰 기록에서 힘 때문에 모양이 달라진 것을 두 가지 고르세요.",
    "givens": null,
    "choices": [
      "손잡이를 당기니 미닫이문이 열렸다.",
      "말랑한 공을 누르니 움푹 들어갔다.",
      "손으로 미니 수레를 밀어 보냈다.",
      "고무줄을 당기니 길쭉하게 늘어났다.",
      "굴러오는 바퀴를 손으로 멈췄다."
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
    "explanation": "움푹 들어가거나 늘어난 것은 모양 변화이고, 열린 문이나 굴러간 바퀴는 움직임 변화예요.",
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
    "id": "s31-u01-v003",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "무게가 같은 찰흙 덩어리를 같은 무게의 상자에 넣었어요. 내용물을 하나씩 더 넣으며 무게를 비교할 때, 가장 무거운 상자의 기록을 고르세요.",
    "givens": null,
    "choices": [
      "찰흙 한 덩어리",
      "찰흙 두 덩어리",
      "찰흙 세 덩어리",
      "찰흙 네 덩어리",
      "찰흙 다섯 덩어리"
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
    "explanation": "상자가 같고 같은 찰흙 덩어리를 넣으므로 가장 많은 다섯 덩어리를 넣은 상자가 가장 무거워요.",
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
    "id": "s31-u01-v004",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "바퀴와 크기가 같은 수레를 같은 바닥에서 천천히 끌어 출발시키려 해요. (가)에는 빈 바구니만, (나)에는 그 바구니와 모래주머니를 실었어요. 드는 힘을 바르게 비교한 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. (가)가 더 크다.",
        "ㄴ. 두 힘이 같다.",
        "ㄷ. (나)가 더 크다."
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
        "(나)가 더 크다",
        "(나)가 더 커요",
        "(가) < (나)"
      ]
    },
    "explanation": "같은 수레와 바닥에서는 짐을 더 실어 무거워진 (나)를 출발시키는 데 더 큰 힘이 들어요.",
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
    "id": "s31-u01-v005",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 ㉠, ㉡에 들어갈 말을 알맞게 짝 지은 것을 고르세요.",
    "givens": {
      "지문": "• 나무판자가 수평이 되도록 받침대에 올려놓은 것을 ㉠(이)라고 합니다.\n• 나무판자와 받침대가 서로 닿는 부분을 ㉡(이)라고 합니다."
    },
    "choices": [
      "수평대 / 받침점",
      "수평 / 받침점",
      "받침점 / 수평대",
      "무게 / 수평",
      "수평대 / 무게"
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
    "explanation": "나무판자가 수평이 되도록 받침대에 올려놓은 것은 수평대이고, 나무판자와 받침대가 닿는 부분은 받침점이에요.",
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
    "id": "s31-u01-v006",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음에서 설명하는 것은 무엇인지 쓰세요.",
    "givens": {
      "지문": "물체가 어느 한쪽으로도 기울어지지 않고 평평한 상태를 말합니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "수평",
      "accepted": [
        "수평",
        "수평 상태"
      ]
    },
    "explanation": "물체가 어느 한쪽으로 기울어지지 않고 평평한 상태를 수평이라고 해요.",
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
    "id": "s31-u01-v007",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "수평이던 나무판자 오른쪽 3번에 블록을 올렸어요. 같은 블록으로 수평을 회복한 실험 기록을 고르세요. 빈 나무판자는 수평이며, 받침점 양쪽 눈금 간격은 같아요.",
    "givens": null,
    "choices": [
      "왼쪽 1번에 올림",
      "왼쪽 2번에 올림",
      "왼쪽 3번에 올림",
      "왼쪽 4번에 올림",
      "왼쪽 5번에 올림"
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
    "explanation": "무게가 같은 블록은 받침점 양쪽 같은 거리에 놓아야 수평이 돼요.",
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
    "id": "s31-u01-v008",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "나무판자의 왼쪽에는 같은 블록 두 개를, 오른쪽에는 한 개를 놓아요. 두 번의 실험에서 수평이 된 위치 기록을 모두 고르세요. 빈 나무판자는 수평이며, 받침점 양쪽 눈금 간격은 같아요.",
    "givens": null,
    "choices": [
      "왼쪽 1번 / 오른쪽 2번",
      "왼쪽 2번 / 오른쪽 1번",
      "왼쪽 2번 / 오른쪽 4번",
      "왼쪽 3번 / 오른쪽 3번",
      "왼쪽 4번 / 오른쪽 2번"
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
    "explanation": "두 개를 놓는 쪽을 더 가까이 두어야 해요. 제시한 수평 위치는 왼쪽 1번·오른쪽 2번과 왼쪽 2번·오른쪽 4번이에요.",
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
    "id": "s31-u01-v009",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "형과 동생이 시소의 받침점에서 같은 거리에 앉았더니 형 쪽이 내려갔어요. 다음 번에 수평을 잡기 위해 앉는 위치를 어떻게 바꾸면 좋을까요?",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "형이 받침점에 더 가까이 앉거나 동생이 받침점에서 더 멀리 앉아요.",
      "rubric": {
        "required": [
          "형이 가까이 또는 동생이 멀리 앉는다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "같은 거리에서 내려간 형 쪽이 더 무거워요. 형이 받침점 가까이 앉거나 동생이 받침점에서 더 멀리 앉으면 수평을 잡을 수 있어요.",
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
    "id": "s31-u01-v010",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빈 나무판자의 수평을 먼저 맞춘 뒤, 받침점 양쪽 같은 거리에 풀과 가위를 올렸어요. 양쪽의 높이가 같게 멈췄다면 어떤 결론이 맞을까요? 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 풀이 더 무겁다.",
        "ㄴ. 두 물체의 무게가 같다.",
        "ㄷ. 가위가 더 무겁다."
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
        "풀과 가위의 무게가 같다",
        "풀과 가위의 무게가 같다."
      ]
    },
    "explanation": "받침점에서 같은 거리에 놓았을 때 수평이면 두 물체의 무게가 같아요.",
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
    "id": "s31-u01-v011",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "과일 가게에서 사과 한 봉지의 무게를 정확하게 재려고 해요. 이때 쓰는 도구로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "저울",
      "줄자",
      "온도계",
      "돋보기",
      "눈금실린더"
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
    "explanation": "물체의 무게를 정확하게 재는 도구는 저울이에요. 줄자는 길이, 온도계는 온도, 눈금실린더는 액체의 부피를 재요.",
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
    "id": "s31-u01-v012",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T09",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "우리 집이나 동네에서 저울을 사용하는 경우를 두 가지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "빵을 만들 때 밀가루를 정해진 무게만큼 저울로 재요. 우체국에서 소포의 무게를 재서 요금을 정해요.",
      "rubric": {
        "required": [
          "저울을 사용하는 서로 다른 경우 두 가지"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "요리·택배·병원·가게처럼 무게를 정확히 알아야 하는 곳에서 저울을 써요.",
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
    "id": "s31-u01-v013",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "전자저울로 잰 무게 기록에 붙일 수 있는 단위를 두 가지 고르세요.",
    "givens": null,
    "choices": [
      "cm",
      "kg",
      "L",
      "g",
      "km"
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
    "explanation": "초등학교에서 물체의 무게를 비교할 때는 g와 kg을 사용해요. cm·km는 길이, L는 부피 단위예요.",
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
    "id": "s31-u01-v014",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "용수철저울에서 무게를 재려는 물체를 거는 부분의 이름을 고르세요.",
    "givens": null,
    "choices": [
      "고리",
      "용수철",
      "표시 자",
      "눈금",
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
    "explanation": "용수철저울의 맨 아래 고리에 물체를 걸어요. 용수철은 늘어나는 부분, 표시 자는 눈금을 가리키는 부분이에요.",
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
    "id": "s31-u01-v015",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "세 친구가 용수철저울을 사용한 기록이에요. 다시 측정해야 하는 친구의 이름을 쓰세요.",
    "givens": {
      "관찰 기록": [
        "민호: 빈 고리일 때 0인지 확인하고 물체를 걸었다.",
        "서연: 표시 자가 아직 흔들릴 때 바로 눈금을 적었다.",
        "지우: 표시 자가 멈춘 뒤 눈높이를 맞춰 읽었다."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "서연",
      "accepted": [
        "서연"
      ]
    },
    "explanation": "물체를 걸기 전에 표시 자를 0에 맞추고, 멈춘 표시 자와 눈높이를 맞추어 읽어요.",
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
    "id": "s31-u01-v016",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "학생들이 만든 전자저울 기록 카드(모형 값)를 가벼운 순서로 정리해요. 두 번째 자리에 올 카드의 이름을 쓰세요.",
    "givens": {
      "기록": [
        "필통: 120 g",
        "가위: 35 g",
        "풀: 12 g",
        "공책: 48 g"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "가위",
      "accepted": [
        "가위"
      ]
    },
    "explanation": "풀 12 g, 가위 35 g, 공책 48 g, 필통 120 g 순서이므로 두 번째로 가벼운 것은 가위예요.",
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
    "id": "s31-u01-v017",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 물통을 들어 올리는 두 실험의 관찰 기록이에요. 용수철이 더 조금 늘어난 기록의 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 물통을 직접 들 때: 손에 더 큰 힘이 들고 용수철이 많이 늘어났다.",
        "ㄴ. 지레로 들 때: 손에 더 작은 힘이 들고 용수철이 조금 늘어났다."
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
    "explanation": "같은 물통을 지레로 들어 올린 ㄴ에서 손에 드는 힘이 작아 용수철도 더 조금 늘어났어요.",
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
    "id": "s31-u01-v018",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "무거운 짐을 실은 수레를 계단 대신 비스듬하게 놓인 판자를 따라 밀어 올렸어요. 이처럼 비스듬하게 기울어진 면을 이용해 물체를 움직일 수 있게 만든 도구를 무엇이라고 하는지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "빗면",
      "accepted": [
        "빗면",
        "빗 면"
      ]
    },
    "explanation": "비스듬하게 기울어진 면을 이용하는 도구는 빗면이에요. 빗면을 이용하면 직접 들어 올릴 때보다 작은 힘으로 물체를 옮길 수 있어요.",
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
    "id": "s31-u01-v019",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빗면을 이용한 이동 방법을 조사했어요. 조사 내용에 맞지 않아 다른 묶음으로 옮길 기록은 무엇인가요?",
    "givens": null,
    "choices": [
      "판자를 비스듬히 놓아 상자를 올린다.",
      "경사로를 따라 짐수레를 올린다.",
      "비탈길을 따라 손수레를 끌고 오른다.",
      "완만한 연결 통로로 휠체어를 올린다.",
      "병따개로 병뚜껑을 들어 올린다."
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
    "explanation": "손잡이가 있는 막대로 뚜껑을 들어 올리는 병따개는 지레예요. 다른 기록은 비스듬한 면을 따라 오르는 경우예요.",
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
    "id": "s31-u01-v020",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 병의 뚜껑을 손과 병따개로 각각 열어 본 관찰이에요. 지레의 도움을 잘못 설명한 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "병따개는 지레를 이용한 도구이다.",
      "도구를 쓰니 손에 드는 힘이 줄었다.",
      "도구를 쓰니 더 큰 힘이 필요했다.",
      "작은 힘으로 뚜껑을 열 수 있었다.",
      "손으로만 열 때 더 큰 힘이 들었다."
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
    "explanation": "병따개는 뚜껑을 작은 힘으로 열도록 도와줘요. 손으로 직접 열 때보다 더 큰 힘이 필요하다는 설명은 맞지 않아요.",
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
    "id": "s31-u01-v021",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "‘힘’이라는 낱말을 썼지만 물체를 밀거나 당겨 움직임·모양을 바꾼 관찰은 아닌 것을 두 가지 고르세요.",
    "givens": null,
    "choices": [
      "친구의 편지를 읽고 힘이 났다.",
      "손으로 뚜껑을 눌러 닫았다.",
      "끈을 잡아당겨 썰매를 옮겼다.",
      "잠이 부족해서 몸에 힘이 없었다.",
      "반죽을 눌러 얇게 펼쳤다."
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
    "explanation": "응원을 받아 생긴 용기와 몸의 기운을 뜻하는 힘은 이 단원에서 관찰하는 밀기·당기기의 힘과 달라요.",
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
    "id": "s31-u01-v022",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "손으로 당길 때는 ㉡, 손으로 밀 때는 ㉠ 방향으로 물체가 움직인다고 할 때, 세 관찰의 기호를 순서대로 쓰세요.",
    "givens": {
      "기호": [
        "㉠ 나에게서 멀어짐",
        "㉡ 나에게 가까워짐"
      ],
      "관찰": [
        "(1) 책상 앞에서 상자의 끈을 몸 쪽으로 당겼다.",
        "(2) 상자를 두 손으로 앞쪽으로 밀었다.",
        "(3) 다시 상자의 끈을 몸 쪽으로 당겼다."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(1) ㉡ (2) ㉠ (3) ㉡",
      "accepted": [
        "(1) ㉡ (2) ㉠ (3) ㉡",
        "(1)㉡ (2)㉠ (3)㉡",
        "(1) ㉡, (2) ㉠, (3) ㉡",
        "㉡, ㉠, ㉡",
        "㉡ ㉠ ㉡",
        "㉡㉠㉡",
        "(1) ㄴ (2) ㄱ (3) ㄴ",
        "(1)ㄴ (2)ㄱ (3)ㄴ",
        "ㄴ, ㄱ, ㄴ",
        "ㄴ ㄱ ㄴ",
        "ㄴㄱㄴ"
      ]
    },
    "explanation": "손잡이를 당기면 나에게 가까워지고, 밀면 멀어져요.",
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
    "id": "s31-u01-v023",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 바닥에서 같은 나무 상자를 조금씩 밀어 출발시켜요. 무게만 바꾸는 실험에서 더 큰 힘이 필요한 상자의 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 안에 아무것도 넣지 않은 상자",
        "ㄴ. 같은 상자에 모래주머니를 넣은 것"
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
        "모래주머니를 넣은 상자"
      ]
    },
    "explanation": "상자와 바닥 조건이 같으면 무거운 상자를 출발시키는 데 더 큰 힘이 필요해요.",
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
    "id": "s31-u01-v024",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "수레 한 대에 짐을 더 싣기 전과 후를 비교하려고 해요. 같은 바닥에서 실험할 때 알맞은 예상은 무엇인가요?",
    "givens": null,
    "choices": [
      "짐을 더 실으면 작은 힘으로 출발한다.",
      "짐을 빼면 더 큰 힘으로 출발시켜야 한다.",
      "짐을 더 실으면 출발시킬 힘이 커진다.",
      "짐의 무게가 달라도 드는 힘은 늘 같다.",
      "수레가 무거워질수록 미는 힘은 줄어든다."
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
    "explanation": "수레에 짐을 더 실으면 무거워져 출발시키는 데 더 큰 힘이 들어요.",
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
    "id": "s31-u01-v025",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 크기의 두 주머니를 들어 보니 모래가 든 주머니가 솜이 든 것보다 더 무거웠어요. 이렇게 물체의 가볍고 무거운 정도를 나타내는 말을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "무게",
      "accepted": [
        "무게"
      ]
    },
    "explanation": "물체가 가볍고 무거운 정도를 무게라고 해요.",
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
    "id": "s31-u01-v026",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "무거운 상자와 가벼운 상자를 나무판자에 놓았어요. 빈 판자는 수평이에요. 두 상자로 수평을 잡으려면 무거운 상자는 받침점에서 ㉠, 가벼운 상자는 ㉡ 곳에 놓아야 해요. 알맞은 말을 쓰세요.",
    "givens": {
      "고를 말": [
        "가까운",
        "먼"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 가까운, ㉡ 먼",
      "accepted": [
        "㉠ 가까운, ㉡ 먼",
        "㉠가까운, ㉡먼",
        "가까운, 먼",
        "가까운 먼",
        "ㄱ 가까운, ㄴ 먼",
        "ㄱ: 가까운, ㄴ: 먼",
        "㉠: 가까운, ㉡: 먼"
      ]
    },
    "explanation": "무거운 상자는 받침점 가까운 곳에, 가벼운 상자는 먼 곳에 놓아야 수평을 잡을 수 있어요.",
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
    "id": "s31-u01-v027",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "모형 수평대에서 감자를 왼쪽 2번에, 양파를 오른쪽 4번에 놓아 수평을 잡았어요. 더 무거운 물체의 이름을 쓰세요. 빈 나무판자는 수평이며, 받침점 양쪽 눈금 간격은 같아요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "감자",
      "accepted": [
        "감자"
      ]
    },
    "explanation": "수평을 이루고 있을 때 받침점에 더 가까운 쪽의 물체가 더 무거워요. 왼쪽 2번의 감자가 더 무거워요.",
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
    "id": "s31-u01-v028",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "사과와 귤의 무게를 비교하려는데 저울이 없어요. 비어 있을 때 수평인 나무판자와 받침대를 어떻게 이용하면 될까요? 물체를 놓는 위치와 결과를 읽는 방법을 써 보세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "수평대 나무판자 양쪽의 같은 거리에 사과와 귤을 각각 올려놓아요. 나무판자가 수평을 이루면 두 과일의 무게가 같고, 한쪽으로 기울어지면 기울어진 쪽 과일이 더 무거워요.",
      "rubric": {
        "required": [
          "수평 잡기로 두 물체의 무게를 비교하는 방법"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "받침점에서 같은 거리에 놓고 기울기를 봐요. 내려간 쪽이 더 무겁고, 수평이면 두 물체의 무게가 같아요.",
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
    "id": "s31-u01-v029",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "시소가 엄마 쪽으로 기울어진 상태에서 엄마가 받침점에서 더 멀어졌어요. 민지는 움직이지 않았고 두 사람은 그대로 앉아 있어요. 결과를 바르게 예상한 것을 고르세요.",
    "givens": null,
    "choices": [
      "곧바로 양쪽 높이가 같아진다.",
      "더 가벼운 민지 쪽이 아래로 간다.",
      "엄마 쪽이 계속 아래로 기운다.",
      "민지 쪽으로 갔다가 수평이 된다.",
      "아무 조작 없이 계속 오르내린다."
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
    "explanation": "무거운 엄마가 더 멀어지면 수평을 회복하지 못하고 엄마 쪽으로 계속 기울어져요.",
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
    "id": "s31-u01-v030",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두 친구가 같은 봉투 두 개를 손으로 들어 보고 서로 다른 봉투가 더 무겁다고 했어요. 정확히 비교하기 위해 저울을 쓰려는 까닭의 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 봉투 무게가 들 때마다 바뀌어서",
        "ㄴ. 손으로 느끼는 정도가 서로 달라서",
        "ㄷ. 손으로만 재는 것이 가장 정확해서"
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
    "explanation": "손으로 느끼는 무게는 사람마다 다를 수 있으므로 저울로 비교해야 해요.",
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
    "id": "s31-u01-v031",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "식당에서 밀가루를 정해진 g만큼 덜어 봉투에 담으려 해요. 눈대중 대신 어떤 도구로 확인하면 좋을까요?",
    "givens": null,
    "choices": [
      "줄자",
      "저울",
      "시계",
      "온도계",
      "비커"
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
    "explanation": "정해진 무게만큼 재료를 준비할 때는 저울을 사용해요.",
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
    "id": "s31-u01-v032",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "종이에 만든 용수철저울 모형의 큰 눈금은 0, 10, 20, 30 g이에요. 이웃한 큰 눈금 사이를 같은 크기 다섯 칸으로 나눴어요. 큰 눈금 한 칸 / 작은 눈금 한 칸의 값을 고르세요.",
    "givens": null,
    "choices": [
      "10 g / 1 g",
      "10 g / 2 g",
      "10 g / 5 g",
      "5 g / 1 g",
      "50 g / 10 g"
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
    "explanation": "큰 눈금 한 칸은 10 g이고, 이를 같은 크기 다섯 칸으로 나누면 작은 한 칸은 2 g이에요.",
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
    "id": "s31-u01-v033",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "새로 만든 모형 저울의 표시 자가 30 g 선에서 2 g씩 세 칸 더 내려가 멈췄어요. 기록해야 할 무게를 고르세요.",
    "givens": null,
    "choices": [
      "33 g",
      "36 g",
      "38 g",
      "36 kg",
      "60 g"
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
    "explanation": "30 g에서 2 g씩 세 칸을 더 읽으면 36 g이에요.",
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
    "id": "s31-u01-v034",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "전자저울 사용 기록을 살펴보고 잘못된 행동의 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 저울을 평평한 책상 위에 놓았다.",
        "ㄴ. 전원을 켜고 표시가 켜지는지 봤다.",
        "ㄷ. 물체 없이 표시를 0에 맞췄다.",
        "ㄹ. 물체를 저울판 밖으로 걸쳐 놓았다."
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
    "explanation": "전자저울은 평평하게 놓고 0을 맞춘 뒤 물체를 저울판 가운데에 올려 읽어요.",
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
    "id": "s31-u01-v035",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "서로 다른 물체를 같은 전자저울로 재었어요. 둘 중 더 무거운 물체를 고르는 방법으로 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "같은 단위의 숫자가 큰 쪽을 고른다.",
      "같은 단위의 숫자가 작은 쪽을 고른다.",
      "표시판의 글자 색이 진한 쪽을 고른다.",
      "저울판 위에서 소리가 큰 쪽을 고른다.",
      "물체가 차지하는 면적이 큰 쪽을 고른다."
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
    "explanation": "같은 g 단위로 잰 표시판의 숫자가 클수록 무거워요.",
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
    "id": "s31-u01-v036",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "못을 손으로 빼기 어려워 장도리를 쓰자 더 작은 힘으로 뺄 수 있었어요. 이 관찰을 설명한 문장의 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 장도리는 물체의 무게를 재는 저울이다.",
        "ㄴ. 장도리는 지레를 이용해 힘을 덜 들게 한다.",
        "ㄷ. 장도리는 비스듬한 길을 만드는 빗면이다."
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
    "explanation": "장도리는 지레를 이용해 작은 힘으로 못을 빼는 도구예요.",
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
    "id": "s31-u01-v037",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "아이들이 같은 상자를 직접 들 때와 지레로 들 때의 힘을 비교한 모형 기록이에요. 맞는 결론의 기호를 쓰세요.",
    "givens": {
      "관찰 기록": [
        "같은 용수철을 이용해 실험했다.",
        "직접 들어 올리기: 용수철이 많이 늘어남",
        "지레로 들어 올리기: 용수철이 조금 늘어남"
      ],
      "보기": [
        "ㄱ. 지레를 쓰니 드는 힘이 더 커졌다.",
        "ㄴ. 두 방법에서 드는 힘이 같았다.",
        "ㄷ. 지레를 쓰니 드는 힘이 더 작아졌다."
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
    "explanation": "지레를 쓴 뒤 용수철이 더 조금 늘어났으므로 드는 힘이 더 작아졌어요.",
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
    "id": "s31-u01-v038",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 빈칸에 들어갈 알맞은 말을 고르세요.",
    "givens": {
      "지문": "구불구불한 산길은 □을/를 이용한 예로, 산꼭대기까지 곧게 뻗은 가파른 길보다 작은 힘으로 오를 수 있습니다."
    },
    "choices": [
      "지레",
      "저울",
      "수평대",
      "용수철",
      "빗면"
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
    "explanation": "구불구불한 산길은 비스듬한 면을 따라 오르는 빗면의 예예요. 빗면을 이용하면 곧장 오를 때보다 작은 힘이 들어요.",
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
    "id": "s31-u01-v039",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "박물관에서 짐을 옮기는 장치를 조사했어요. 빗면을 이용한 다른 네 기록과 다른 것을 고르세요.",
    "givens": null,
    "choices": [
      "수레를 경사진 통로로 올렸다.",
      "상자를 비스듬한 판자로 올렸다.",
      "비탈길을 따라 손수레를 밀었다.",
      "낮은 곳과 높은 곳을 경사로로 이었다.",
      "장도리 손잡이를 눌러 못을 뺐다."
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
    "explanation": "막대로 못을 들어 빼는 장도리는 지레를 이용해요. 나머지는 비스듬한 면을 따라 짐을 움직여요.",
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
    "id": "s31-u01-v040",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "휠체어가 다니는 경사로를 이용할 때의 좋은 점으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "종이나 천을 작은 힘으로 쉽게 자를 수 있어요.",
      "계단보다 작은 힘으로 높은 곳까지 오를 수 있어요.",
      "올라가는 사람의 몸무게를 정확하게 잴 수 있어요.",
      "나무에 박혀 있는 못을 작은 힘으로 쉽게 뺄 수 있어요.",
      "단단한 철사를 작은 힘으로 끊거나 구부릴 수 있어요."
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
    "explanation": "경사로는 빗면을 이용해 높은 곳으로 오를 때 드는 힘을 줄여 줘요. 종이·못·철사를 다루는 것은 지레를 이용한 도구예요.",
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
    "id": "s31-u01-v041",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "손으로 밀던 장난감 기차가 멈춰 있던 곳에서 앞으로 움직였어요. 이 관찰로 확인한 두 내용을 알맞게 묶은 것을 고르세요.",
    "givens": {
      "보기": [
        "ㄱ. 기차의 무게가 사라졌다.",
        "ㄴ. 기차에 힘을 주었다.",
        "ㄷ. 기차의 움직임이 바뀌었다.",
        "ㄹ. 기차의 색깔이 달라졌다."
      ]
    },
    "choices": [
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄷ",
      "ㄱ, ㄹ",
      "ㄷ, ㄹ"
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
    "explanation": "손으로 힘을 주었고 기차의 움직임이 달라졌다는 두 내용을 관찰할 수 있어요.",
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
    "id": "s31-u01-v042",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "스펀지를 누르니 움푹 들어갔고, 고무판을 당기니 길게 늘어났어요. 두 관찰에 공통으로 맞는 설명을 고르세요.",
    "givens": null,
    "choices": [
      "힘을 주어 모양이 달라졌다.",
      "힘을 주어 무게가 사라졌다.",
      "힘을 주어 색깔이 바뀌었다.",
      "손을 대지 않아도 저절로 변했다.",
      "모양이 같고 위치만 달라졌다."
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
    "explanation": "힘을 주면 물체의 모양이 바뀔 수 있어요.",
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
    "id": "s31-u01-v043",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "나와 상자 사이의 거리가 더 멀어지도록 상자를 움직이려 해요. 상자를 앞쪽으로 밀었을 때 움직이는 방향의 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 나에게 가까워지는 쪽",
        "ㄴ. 나에게서 멀어지는 쪽"
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
        "멀어지는",
        "멀어지는 방향"
      ]
    },
    "explanation": "상자를 앞쪽으로 밀면 상자는 나에게서 멀어지는 방향으로 움직여요.",
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
    "id": "s31-u01-v044",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "수레에 모래주머니를 더 싣기 전과 후, 출발시킬 때 드는 힘을 비교하려 해요. 모래주머니를 싣는 까닭의 기호를 쓰세요.",
    "givens": {
      "실험 조건": "같은 수레를 같은 바닥에서 같은 방향으로 천천히 밀어 출발시킨다.",
      "보기": [
        "ㄱ. 수레의 무게를 다르게 하려고",
        "ㄴ. 수레 바퀴의 모양을 바꾸려고",
        "ㄷ. 수레와 바닥의 온도를 맞추려고"
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
        "두 상자의 무게를 다르게 하려고"
      ]
    },
    "explanation": "짐을 더 싣는 것은 같은 수레의 무게를 다르게 하여 드는 힘을 비교하기 위해서예요.",
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
    "id": "s31-u01-v045",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 상자에 짐을 넣었다 뺐다 하며 출발시킬 때 드는 힘을 비교했어요. 관찰과 맞지 않는 설명을 고르세요.",
    "givens": {
      "실험 조건": "같은 바닥에서 같은 상자를 같은 방향으로 천천히 밀었다."
    },
    "choices": [
      "짐을 넣으면 상자가 무거워진다.",
      "짐을 넣으면 미는 힘이 더 든다.",
      "짐을 빼면 미는 힘이 덜 든다.",
      "짐을 넣어도 미는 힘은 늘 같다.",
      "무게를 바꾸어 힘을 비교할 수 있다."
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
    "explanation": "상자에 짐을 더 넣으면 무거워져 출발시키는 데 더 큰 힘이 들어요.",
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
    "id": "s31-u01-v046",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 바닥에서 끌어 출발시키기 어려운 순서로 썰매를 세우려 해요. 같은 썰매에 무게가 같은 모래주머니를 실었을 때, 두 번째 자리에 올 것을 고르세요.",
    "givens": null,
    "choices": [
      "모래주머니가 없는 썰매",
      "모래주머니 두 개를 실은 썰매",
      "모래주머니 네 개를 실은 썰매",
      "모래주머니 여섯 개를 실은 썰매",
      "모래주머니 일곱 개를 실은 썰매"
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
    "explanation": "가장 많은 일곱 개를 실은 썰매 다음은 여섯 개를 실은 썰매예요. 같은 조건에서는 무거울수록 출발시키는 데 큰 힘이 들어요.",
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
    "id": "s31-u01-v047",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 ㉠, ㉡에 들어갈 알맞은 말을 각각 쓰세요.",
    "givens": {
      "지문": "수평대에서 나무판자와 받침대가 서로 닿는 부분을 [㉠](이)라고 하고, 물체의 가볍고 무거운 정도를 [㉡](이)라고 합니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 받침점, ㉡ 무게",
      "accepted": [
        "㉠ 받침점, ㉡ 무게",
        "받침점, 무게",
        "받침점 무게",
        "㉠-받침점, ㉡-무게",
        "ㄱ 받침점, ㄴ 무게",
        "ㄱ: 받침점, ㄴ: 무게",
        "㉠: 받침점, ㉡: 무게"
      ]
    },
    "explanation": "나무판자와 받침대가 닿는 부분은 받침점이고, 물체의 가볍고 무거운 정도는 무게예요.",
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
    "id": "s31-u01-v048",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "쌍둥이가 시소에 앉았는데 한쪽이 아래로 내려갔어요. 두 사람의 몸무게가 같다면, 다시 수평을 잡기 위해 확인할 방법의 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 형만 받침점에서 더 멀리 앉는다.",
        "ㄴ. 받침점에서 두 사람까지 거리를 같게 한다.",
        "ㄷ. 동생만 받침점에서 더 멀리 앉는다."
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
    "explanation": "몸무게가 같을 때는 받침점에서 같은 거리에 앉아야 수평을 잡아요.",
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
    "id": "s31-u01-v049",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "상자 두 개를 나무판자로 비교하려고 세 친구가 실험을 준비했어요. 무게를 바르게 비교할 준비를 한 친구의 이름을 쓰세요.",
    "givens": {
      "실험 계획": [
        "민호: 빈 판자가 기울어져 있어도 바로 상자를 올린다.",
        "서연: 빈 판자를 수평으로 맞추고 양쪽 같은 거리에 상자를 놓는다.",
        "지우: 두 상자를 받침점의 같은 쪽에 나란히 올린다."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "서연",
      "accepted": [
        "서연"
      ]
    },
    "explanation": "판자가 비어 있을 때 수평을 맞추고, 받침점 양쪽 같은 거리에 물체를 하나씩 놓아야 해요.",
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
    "id": "s31-u01-v050",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "모형 실험에서 무게가 다른 주머니를 받침점 양쪽 같은 거리에 놓아요. 어느 쪽으로 기울어질지 그 까닭과 함께 써 보세요. 빈 나무판자는 수평이며, 받침점 양쪽 눈금 간격은 같아요.",
    "givens": {
      "모형 기록": [
        "왼쪽 주머니: 60 g",
        "오른쪽 주머니: 30 g"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "나무판자가 왼쪽으로 기울어져요. 같은 거리에 놓인 왼쪽 주머니가 더 무겁기 때문이에요.",
      "rubric": {
        "required": [
          "왼쪽으로 기울어진다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "같은 거리에서 더 무거운 쪽이 내려가요. 모형 기록에서 왼쪽이 더 무거우므로 왼쪽으로 기울어져요.",
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
    "id": "s31-u01-v051",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "세 채소를 하나씩 바꾸어 놓으며 수평대의 양쪽 높이를 관찰했어요. 같은 거리에서 비교한 기록을 읽고 가장 가벼운 채소를 쓰세요.",
    "givens": {
      "실험 준비": "물체를 올리기 전에는 나무판자가 수평이었다.",
      "관찰 기록": [
        "오이와 당근을 양쪽 같은 거리에 놓음: 오이 쪽이 내려감",
        "당근과 감자를 양쪽 같은 거리에 놓음: 당근 쪽이 내려감"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "감자",
      "accepted": [
        "감자"
      ]
    },
    "explanation": "오이가 당근보다 무겁고 당근이 감자보다 무거우므로 감자가 가장 가벼워요.",
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
    "id": "s31-u01-v052",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "무게를 재어 정하는 일과 다른 기록을 고르세요.",
    "givens": null,
    "choices": [
      "고기를 g으로 달아 값을 정했다.",
      "소포를 저울로 재어 요금을 정했다.",
      "연필을 자루 수로 세어 값을 정했다.",
      "몸무게를 재어 건강 기록에 적었다.",
      "밀가루를 저울로 재어 반죽을 만들었다."
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
    "explanation": "연필을 한 자루씩 세어 값을 정하는 것은 무게를 재어 값을 정하는 일과 달라요.",
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
    "id": "s31-u01-v053",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "용수철저울에서 '표시 자'의 역할로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "무게를 재려는 물체를 거는 부분이에요.",
      "물체를 매달면 길게 늘어나는 부분이에요.",
      "용수철저울을 스탠드에 걸 때 잡는 부분이에요.",
      "물체의 무게에 해당하는 눈금을 가리키는 부분이에요.",
      "무게를 재기 전 영점을 맞추려고 돌리는 부분이에요."
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
    "explanation": "표시 자는 물체의 무게에 해당하는 눈금을 가리켜요. 물체를 거는 곳은 고리, 늘어나는 곳은 용수철, 돌리는 곳은 영점 조절 나사예요.",
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
    "id": "s31-u01-v054",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "고리에 걸기 어려운 구슬을 지퍼 백에 넣어 용수철저울로 재려 해요. 지퍼 백 무게를 빼고 구슬만 재는 순서를 고르세요.",
    "givens": {
      "보기": [
        "ㄱ. 빈 지퍼 백을 단 상태에서 0을 맞춘다.",
        "ㄴ. 평평한 곳의 스탠드에 저울을 건다.",
        "ㄷ. 지퍼 백에 구슬을 넣고 멈춘 눈금을 읽는다.",
        "ㄹ. 빈 지퍼 백을 고리에 건다."
      ]
    },
    "choices": [
      "ㄱ - ㄴ - ㄹ - ㄷ",
      "ㄴ - ㄱ - ㄹ - ㄷ",
      "ㄴ - ㄹ - ㄱ - ㄷ",
      "ㄹ - ㄴ - ㄱ - ㄷ",
      "ㄴ - ㄹ - ㄷ - ㄱ"
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
    "explanation": "저울을 걸고 빈 지퍼 백을 단 뒤 0을 맞추어야 구슬만의 무게를 읽을 수 있어요.",
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
    "id": "s31-u01-v055",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "전자저울에서 무게를 재기 전에 눌러서 표시판의 숫자를 '0'으로 맞추는 부분을 고르세요.",
    "givens": null,
    "choices": [
      "저울판",
      "표시판",
      "고리",
      "전원 단추",
      "영점 단추"
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
    "explanation": "영점 단추를 누르면 표시판이 0이 돼요. 저울판은 물체를 올리는 곳, 표시판은 무게를 숫자로 보여 주는 곳이에요.",
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
    "id": "s31-u01-v056",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "교실에서 만든 전자저울 카드의 모형 값이에요. 더 가벼운 물체의 무게를 단위와 함께 쓰세요.",
    "givens": {
      "모형 기록": [
        "필통을 올렸을 때: 86 g",
        "풀을 올렸을 때: 25 g"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "25 g",
      "accepted": [
        "25 g",
        "25g",
        "25",
        "25 그램",
        "25그램"
      ]
    },
    "explanation": "두 값 중 25 g이 더 작으므로 더 가벼운 풀의 무게는 25 g이에요.",
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
    "id": "s31-u01-v057",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 물통을 같은 용수철로 들어 올리는 모형 실험이에요. 지레를 썼을 때 힘이 더 작았다는 관찰에 맞는 기록을 고르세요.",
    "givens": {
      "모형 기록": "직접 들어 올리기: 늘어난 길이 7 cm"
    },
    "choices": [
      "4 cm",
      "7 cm",
      "9 cm",
      "11 cm",
      "14 cm"
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
    "explanation": "힘이 작을수록 용수철이 조금 늘어나요. 직접 들 때의 7 cm보다 작은 기록은 4 cm예요.",
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
    "id": "s31-u01-v058",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T12",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "친구가 지레도 무게를 재는 저울이라고 생각해요. 생활 속 지레 도구 한 가지와 그 쓰임을 예로 들어 무엇을 하는 도구인지 알려 주세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "병따개예요. 병따개를 쓰면 손으로 딸 때보다 작은 힘으로 병뚜껑을 딸 수 있어요.",
      "rubric": {
        "required": [
          "지레를 이용하는 도구와 그 도구의 쓰임"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "가위로 종이를 자르거나 장도리로 못을 빼는 것처럼, 지레는 작은 힘으로 일을 하도록 돕는 도구예요.",
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
    "id": "s31-u01-v059",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 구불구불한 산길에 대한 설명이에요. ( ) 안에서 알맞은 말을 골라 쓰세요.",
    "givens": {
      "지문": "구불구불한 산길로 산에 오르면 곧게 뻗은 가파른 길로 오를 때보다 더 ( 큰, 작은 ) 힘으로 오를 수 있습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "작은",
      "accepted": [
        "작은",
        "작은 힘"
      ]
    },
    "explanation": "구불구불한 산길은 빗면을 이용한 예라서 가파른 길로 곧장 오를 때보다 작은 힘으로 오를 수 있어요.",
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
    "id": "s31-u01-v060",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "가위로 두꺼운 종이를 자르자 손으로 찢을 때보다 힘이 덜 들었어요. 기록을 바르게 해석한 사람들을 모두 묶은 것을 고르세요.",
    "givens": {
      "보기": [
        "민호: 지레를 이용한 사례야.",
        "서연: 종이의 무게를 잰 사례야.",
        "지우: 작은 힘으로 자르도록 도움을 받았어.",
        "하준: 도구를 쓰니 종이가 더 무거워졌어."
      ]
    },
    "choices": [
      "민호",
      "서연",
      "민호, 지우",
      "서연, 지우",
      "민호, 지우, 하준"
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
    "explanation": "가위는 지레를 이용하며 종이를 자를 때 드는 힘을 줄여 줘요.",
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
    "id": "s31-u01-v061",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "관찰 일지에서 물체의 모양 변화만 따로 모으려 해요. 그 묶음에 들어갈 기록을 쓴 친구의 이름을 쓰세요.",
    "givens": {
      "관찰 일지": [
        "민호: 닫힌 문을 당기니 문이 열렸다.",
        "서연: 동그란 반죽을 손으로 눌러 납작하게 폈다.",
        "지우: 바닥의 상자를 밀어 벽 쪽으로 옮겼다."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "서연",
      "accepted": [
        "서연"
      ]
    },
    "explanation": "반죽을 눌러 납작하게 편 서연의 기록은 모양 변화예요. 다른 두 기록은 움직임이 달라진 경우예요.",
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
    "id": "s31-u01-v062",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "썰매의 끈을 내 몸 쪽으로 당기자, 처음보다 나와 썰매 사이의 거리가 줄었어요. 썰매가 움직인 방향의 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 나에게서 멀어지는 쪽",
        "ㄴ. 나에게 가까워지는 쪽",
        "ㄷ. 끈과 관계없이 옆으로 가는 쪽"
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
        "나에게 가까워지는 쪽"
      ]
    },
    "explanation": "끈을 내 쪽으로 당기면 썰매는 나에게 가까워지는 방향으로 움직여요.",
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
    "id": "s31-u01-v063",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 바닥에서 같은 물통을 끌어 출발시킬 때 작은 힘이 드는 순서로 기록을 정리하려 해요. 알맞은 순서를 고르세요.",
    "givens": {
      "기록": [
        "ㄱ. 물을 가득 채운 물통",
        "ㄴ. 빈 물통",
        "ㄷ. 물을 반쯤 채운 물통"
      ]
    },
    "choices": [
      "ㄱ - ㄴ - ㄷ",
      "ㄱ - ㄷ - ㄴ",
      "ㄴ - ㄱ - ㄷ",
      "ㄴ - ㄷ - ㄱ",
      "ㄷ - ㄴ - ㄱ"
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
    "explanation": "빈 물통, 반쯤 찬 물통, 가득 찬 물통 순으로 무거워져 드는 힘도 커져요.",
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
    "id": "s31-u01-v064",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 ㉠, ㉡에 들어갈 말을 알맞게 짝 지은 것을 고르세요.",
    "givens": {
      "지문": "나무판자가 [ ㉠ ]이/가 되도록 받침대에 올려놓은 것을 수평대라고 하고, 나무판자와 받침대가 서로 닿는 부분을 [ ㉡ ](이)라고 합니다."
    },
    "choices": [
      "무게 / 수평",
      "수평 / 받침점",
      "수평 / 무게",
      "받침점 / 수평",
      "무게 / 받침점"
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
    "explanation": "나무판자가 수평이 되도록 받침대에 올린 것이 수평대이고, 나무판자와 받침대가 닿는 부분이 받침점이에요.",
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
    "id": "s31-u01-v065",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "주머니 한 개를 오른쪽 4번에 놓자 오른쪽이 내려갔어요. 무게가 같은 다른 주머니를 놓아 수평을 되찾은 기록을 고르세요. 빈 나무판자는 수평이며, 받침점 양쪽 눈금 간격은 같아요.",
    "givens": null,
    "choices": [
      "왼쪽 1번에 놓음",
      "왼쪽 2번에 놓음",
      "왼쪽 3번에 놓음",
      "왼쪽 4번에 놓음",
      "왼쪽 5번에 놓음"
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
    "explanation": "무게가 같은 주머니는 받침점 양쪽 같은 거리에 놓아야 수평이 돼요.",
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
    "id": "s31-u01-v066",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "나무판자 오른쪽 4번에는 주머니 한 개를, 왼쪽에는 같은 주머니 두 개를 겹쳐 놓아요. 수평을 이루는 왼쪽 위치를 고르세요. 빈 나무판자는 수평이며, 받침점 양쪽 눈금 간격은 같아요.",
    "givens": null,
    "choices": [
      "왼쪽 1번",
      "왼쪽 2번",
      "왼쪽 3번",
      "왼쪽 4번",
      "왼쪽 5번"
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
    "explanation": "두 개를 놓은 왼쪽은 한 개를 놓은 오른쪽보다 받침점에 더 가까워야 해요. 오른쪽 4번일 때 왼쪽 2번에서 수평을 이루어요.",
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
    "id": "s31-u01-v067",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "할아버지와 민수가 시소에 앉는 위치를 바꾸며 기록했어요. 처음에는 받침점에서 같은 거리에 앉았고 할아버지 쪽이 내려갔어요. 다음 시도에서 수평을 잡을 방법을 써 보세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "할아버지가 받침점에 더 가까이 옮겨 앉거나 민수가 받침점에서 더 멀리 옮겨 앉아요.",
      "rubric": {
        "required": [
          "할아버지가 가까이 또는 민수가 멀리 앉는다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "더 무거운 할아버지가 받침점 가까이 오거나 민수가 더 멀리 가면 수평을 잡을 수 있어요.",
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
    "id": "s31-u01-v068",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 거리에서 두 과일씩 비교한 관찰이에요. 세 과일 중 가장 무거운 것의 이름을 쓰세요.",
    "givens": {
      "실험 준비": "비어 있을 때 수평인 나무판자 양쪽 같은 거리에 과일을 하나씩 놓았다.",
      "관찰 기록": [
        "배와 감을 올림: 배 쪽이 내려감",
        "감과 귤을 올림: 양쪽 높이가 같음"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "배",
      "accepted": [
        "배"
      ]
    },
    "explanation": "배가 감보다 무겁고 감과 귤의 무게가 같으므로 배가 가장 무거워요.",
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
    "id": "s31-u01-v069",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "감자 한 개의 무게를 정확하게 재는 데 쓰는 도구를 고르세요.",
    "givens": null,
    "choices": [
      "줄자",
      "비커",
      "온도계",
      "돋보기",
      "전자저울"
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
    "explanation": "무게를 정확하게 재려면 저울을 써요. 줄자는 길이, 비커는 액체를 담거나 어림할 때, 온도계는 온도를 잴 때 써요.",
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
    "id": "s31-u01-v070",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "아래 기록 중 결정할 때 저울의 무게 값이 필요하지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "잰 몸무게를 보고 약의 양을 정했다.",
      "잰 소포 무게를 보고 운송료를 정했다.",
      "잰 몸무게로 경기 체급을 정했다.",
      "잰 밀가루 무게로 반죽 양을 맞췄다.",
      "책을 세어 빌릴 권수를 정했다."
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
    "explanation": "빌릴 책의 권수를 정하는 기록은 무게 값을 이용하지 않아요.",
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
    "id": "s31-u01-v071",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "무게를 나타내는 단위와 그 단위를 읽는 방법을 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "kg - 킬로그램",
      "m - 미터",
      "mL - 밀리리터",
      "kg - 킬로미터",
      "L - 리터"
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
    "explanation": "kg은 무게의 단위로 킬로그램이라고 읽어요. m는 길이, mL·L는 부피의 단위예요.",
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
    "id": "s31-u01-v072",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빈 용수철저울의 표시 자가 0보다 아래에 있어요. 물체를 걸기 전에 표시 자를 0에 맞추려면 어느 부분을 조작해야 하나요?",
    "givens": null,
    "choices": [
      "용수철을 손으로 길게 당긴다.",
      "고리에 물체를 걸고 흔든다.",
      "표시 자를 손가락으로 누른다.",
      "영점 조절 나사를 돌린다.",
      "손잡이를 잡고 저울을 흔든다."
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
    "explanation": "영점 조절 나사를 돌려 빈 고리일 때 표시 자가 0을 가리키도록 맞춰요.",
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
    "id": "s31-u01-v073",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "용수철저울로 잰 결과를 다시 확인하려 해요. 바르게 잰 것으로 볼 수 없는 기록을 고르세요.",
    "givens": null,
    "choices": [
      "표시 자와 눈높이를 맞추어 읽었다.",
      "빈 고리에서 0을 가리키는지 확인했다.",
      "멈춘 표시 자가 가리키는 값을 적었다.",
      "표시 자를 위에서 내려다보며 읽었다.",
      "물체를 걸고 흔들림이 멎기를 기다렸다."
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
    "explanation": "물체를 걸고 표시 자가 멈출 때까지 기다린 뒤 표시 자와 눈높이를 맞추어 읽어야 해요.",
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
    "id": "s31-u01-v074",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "수업용 저울 모형을 만들어요. 큰 눈금에 0, 20, 40, 60, 80 g을 차례로 적었다면 이웃한 큰 눈금 사이의 값은 얼마인가요?",
    "givens": null,
    "choices": [
      "2 g",
      "5 g",
      "10 g",
      "20 g",
      "40 g"
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
    "explanation": "이웃한 큰 눈금의 차이는 20 g이므로 큰 눈금 한 칸이 나타내는 무게는 20 g이에요.",
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
    "id": "s31-u01-v075",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "전자저울 사용 안내 카드를 섞어 놓았어요. 측정 준비부터 무게 읽기까지의 순서로 묶은 것을 고르세요.",
    "givens": {
      "보기": [
        "ㄱ. 물체를 가운데에 올리고 값을 읽는다.",
        "ㄴ. 물체 없이 표시를 0에 맞춘다.",
        "ㄷ. 평평한 곳에 놓고 수평을 맞춘다.",
        "ㄹ. 전원을 켜서 표시가 켜지는지 본다."
      ]
    },
    "choices": [
      "ㄷ - ㄹ - ㄴ - ㄱ",
      "ㄹ - ㄷ - ㄱ - ㄴ",
      "ㄷ - ㄴ - ㄹ - ㄱ",
      "ㄹ - ㄴ - ㄷ - ㄱ",
      "ㄴ - ㄷ - ㄹ - ㄱ"
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
    "explanation": "평평한 곳에 놓고 수평을 맞춘 뒤 전원을 켜요. 0을 맞추고 물체를 가운데에 놓아 읽어요.",
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
    "id": "s31-u01-v076",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "전자저울 값으로 만든 모형 카드 네 장이에요. 가장 가벼운 물체부터 줄을 세울 때 맨 앞에 놓일 카드의 이름을 쓰세요.",
    "givens": {
      "모형 기록": [
        "공책: 64 g",
        "가위: 42 g",
        "색연필: 9 g",
        "풀: 18 g"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "색연필",
      "accepted": [
        "색연필"
      ]
    },
    "explanation": "같은 g 단위에서 값이 가장 작은 9 g의 색연필이 가장 가벼워요.",
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
    "id": "s31-u01-v077",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "도구를 쓰기 전에는 물병을 들기 힘들었지만, 받침대에 걸친 막대를 사용하니 손에 드는 힘이 작아졌어요. 관찰에 맞는 설명을 두 가지 고르세요.",
    "givens": null,
    "choices": [
      "물병을 저울로 재는 모습이다.",
      "지레의 도움을 받은 모습이다.",
      "물병을 더 작은 힘으로 들었다.",
      "물병을 더 큰 힘으로 들었다.",
      "도구가 물병의 무게를 없앴다."
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
    "explanation": "받침점이 있는 막대를 쓰는 것은 지레예요. 관찰처럼 작은 힘으로 물체를 들어 올리도록 도와줘요.",
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
    "id": "s31-u01-v078",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T13",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "높은 단에 같은 상자를 올리는 두 방법을 비교해 안내문을 쓰려고 해요. 빗면을 따라 밀어 올릴 때 드는 힘을 직접 들어 올릴 때와 비교해 써 보세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "직접 들어 올릴 때보다 빗면을 따라 밀어 올릴 때 드는 힘이 더 작아요.",
      "rubric": {
        "required": [
          "빗면을 따라 밀 때 힘이 더 작음"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "상자를 직접 들어 올릴 때보다 빗면을 따라 밀어 올릴 때 더 작은 힘이 들어요.",
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
    "id": "s31-u01-v079",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "높은 곳으로 짐을 옮길 때 빗면의 도움을 받은 기록을 모두 묶은 것을 고르세요.",
    "givens": {
      "보기": [
        "ㄱ. 장도리로 박힌 못을 뺐다.",
        "ㄴ. 비스듬한 판자로 짐수레를 올렸다.",
        "ㄷ. 병따개로 뚜껑을 열었다.",
        "ㄹ. 완만한 경사로로 상자를 밀어 올렸다."
      ]
    },
    "choices": [
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄹ",
      "ㄷ, ㄹ",
      "ㄴ, ㄷ, ㄹ"
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
    "explanation": "ㄴ과 ㄹ은 비스듬한 면을 따라 짐을 이동한 예예요. ㄱ과 ㄷ은 지레를 이용한 도구의 쓰임이에요.",
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
    "id": "s31-u01-v080",
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
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "도구를 쓰는 두 관찰이 같은 묶음에 들어갔어요. 그 묶음의 이름을 고르세요.",
    "givens": {
      "관찰": [
        "병따개로 뚜껑을 들어 올려 열었다.",
        "장도리 손잡이를 눌러 못을 뺐다."
      ]
    },
    "choices": [
      "빗면 이용",
      "지레 이용",
      "무게 측정",
      "온도 측정",
      "길이 측정"
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
    "explanation": "병따개와 장도리는 지레를 이용해 작은 힘으로 뚜껑을 열거나 못을 빼는 도구예요.",
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
