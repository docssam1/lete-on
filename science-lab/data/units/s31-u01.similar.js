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
    "prompt": "다음 빈칸에 공통으로 들어갈 알맞은 말을 고르세요.",
    "givens": {
      "지문": "• 축구공을 □을/를 주어 차면 공이 굴러갑니다.\n• 찰흙 덩어리를 □을/를 주어 누르면 찰흙이 납작해집니다."
    },
    "choices": [
      "물",
      "빛",
      "바람",
      "소리",
      "힘"
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
    "explanation": "공을 차서 굴러가게 하고 찰흙을 눌러 납작하게 만드는 것은 모두 힘이에요. 힘은 물체의 움직임이나 모양을 바꿀 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "물체에 힘을 주어 물체의 모양이 변한 경우를 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "축구공을 힘을 주어 차서 공이 골대 쪽으로 굴러갔다.",
      "빈 음료수 캔을 힘을 주어 밟아 캔이 납작하게 찌그러졌다.",
      "서랍을 힘을 주어 당겨 닫혀 있던 서랍이 열렸다.",
      "풍선을 두 손으로 힘을 주어 눌러 풍선이 길쭉하게 변했다.",
      "썰매를 힘을 주어 밀어 썰매가 앞으로 미끄러져 갔다."
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
    "explanation": "캔이 찌그러지고 풍선이 길쭉해진 것은 힘 때문에 모양이 변한 경우예요. 공이 굴러가고 서랍이 열린 것은 움직임이 변한 경우예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "가장 무거운 상자는 어느 것인가요? (단, 상자는 모두 같은 상자이고, 귤 한 개의 무게는 모두 같아요.)",
    "givens": null,
    "choices": [
      "귤을 넣지 않은 상자",
      "귤을 세 개 넣은 상자",
      "귤을 여섯 개 넣은 상자",
      "귤을 열 개 넣은 상자",
      "귤을 열두 개 넣은 상자"
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
    "explanation": "같은 상자라면 귤을 많이 넣을수록 더 무거워요. 그래서 귤을 열두 개 넣은 상자가 가장 무거워요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "(가) 빈 수레를 끌 때와 (나) 흙을 가득 실은 수레를 끌 때 드는 힘의 크기를 바르게 비교한 것을 <보기>에서 골라 기호를 쓰세요. (단, 두 수레는 같은 수레예요.)",
    "givens": {
      "보기": [
        "ㄱ. (가) > (나)",
        "ㄴ. (가) = (나)",
        "ㄷ. (가) < (나)"
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
        "(나)가 더 커요"
      ]
    },
    "explanation": "흙을 가득 실은 수레가 더 무거워서 끌 때 더 큰 힘이 들어요. 그래서 (나)에 드는 힘이 더 커요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "수평대 나무판자의 오른쪽 3번에 지우개 한 개를 올려놓았어요. 같은 지우개 한 개를 왼쪽에 올려 나무판자를 수평으로 만들려면 어디에 올려야 하나요? (나무판자에는 받침점을 가운데로 왼쪽과 오른쪽에 1번~5번 눈금이 있어요.)",
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
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "무게가 같은 두 물체는 받침점에서 같은 거리에 놓아야 수평이 돼요. 그래서 오른쪽 3번과 같은 거리인 왼쪽 3번에 올려야 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "수평대 나무판자의 왼쪽에 나무토막 두 개를 겹쳐 올리고, 오른쪽에 같은 나무토막 한 개를 올려 수평을 잡으려고 해요. 수평이 되는 위치를 두 가지 고르세요. (정답 2개, 나무토막의 모양과 무게는 모두 같아요.)",
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
    "explanation": "더 무거운 나무토막 두 개는 받침점 가까이, 가벼운 한 개는 두 배 먼 곳에 놓아야 수평이 돼요. 그래서 왼쪽 1번과 오른쪽 2번, 왼쪽 2번과 오른쪽 4번이 알맞아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "형의 몸무게는 38 kg이고, 동생의 몸무게는 26 kg이에요. 형과 동생이 시소에 앉아 수평을 잡으려면 어떻게 앉아야 하는지 까닭과 함께 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "형이 동생보다 더 무거우므로, 형이 받침점에 더 가까이 앉고 동생은 받침점에서 더 멀리 앉아요.",
      "rubric": {
        "required": [
          "형이 동생보다 더 무겁다",
          "무거운 형이 받침점에 더 가까이(또는 가벼운 동생이 더 멀리) 앉는다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "무게가 다른 두 사람은 무거운 사람이 받침점에 더 가까이, 가벼운 사람이 더 멀리 앉아야 수평이 돼요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "수평대 나무판자 양쪽의 같은 거리에 풀과 가위를 각각 올려놓았더니 나무판자가 수평을 이루었어요. 풀과 가위의 무게를 바르게 비교한 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 풀이 가위보다 무겁다.",
        "ㄴ. 풀과 가위의 무게가 같다.",
        "ㄷ. 가위가 풀보다 무겁다."
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
    "explanation": "받침점에서 같은 거리에 올렸는데 수평을 이루었으니 두 물체의 무게가 같아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
          "저울을 사용하는 경우 한 가지",
          "저울을 사용하는 다른 경우 한 가지"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "요리·택배·병원·가게처럼 무게를 정확히 알아야 하는 곳에서 저울을 써요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "무게를 나타내는 단위를 두 가지 고르세요. (정답 2개)",
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
    "explanation": "무게의 단위는 g(그램)과 kg(킬로그램)이에요. cm·km는 길이, L는 부피의 단위예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "용수철저울로 물체의 무게를 재는 방법을 잘못 말한 사람의 이름을 쓰세요.",
    "givens": {
      "지문": "• 민호: 스탠드를 평평한 곳에 놓고 용수철저울을 걸어요.\n• 서연: 물체를 걸기 전에 표시 자는 아무 눈금에 있어도 괜찮으니 그냥 재요.\n• 지우: 표시 자와 눈높이를 맞추어 눈금을 읽어요."
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
    "explanation": "물체를 걸기 전에 영점 조절 나사를 돌려 표시 자를 눈금 0에 맞춰야 해요. 그래야 물체의 무게를 바르게 읽을 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "다음은 여러 가지 물체를 전자저울의 저울판에 올렸을 때 표시판에 나타난 숫자예요. 두 번째로 가벼운 물체의 이름을 쓰세요.",
    "givens": {
      "표": {
        "단위": [
          "g"
        ],
        "가위": [
          "35"
        ],
        "풀": [
          "12"
        ],
        "공책": [
          "48"
        ],
        "필통": [
          "120"
        ]
      }
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
    "explanation": "전자저울은 표시판의 숫자가 작을수록 가벼워요. 가벼운 순서는 풀(12), 가위(35), 공책(48), 필통(120)이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "같은 물통을 두 가지 방법으로 들어 올렸어요. <보기>에서 용수철이 더 조금 늘어나는 경우를 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 용수철에 물통을 매달아 직접 들어 올릴 때",
        "ㄴ. 받침대에 걸친 막대의 받침대 가까운 쪽에 물통을 올리고, 받침대에서 먼 반대쪽 끝을 용수철로 당겨 들어 올릴 때"
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
    "explanation": "지레를 이용하면 직접 들어 올릴 때보다 작은 힘이 들어서 용수철이 더 조금 늘어나요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "빗면을 이용하는 예가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "경사로",
      "나사못",
      "구불구불한 산길",
      "사다리차",
      "병따개"
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
    "explanation": "병따개는 받침점이 있는 막대를 이용하는 지레예요. 경사로·나사못·사다리차·구불구불한 산길은 빗면을 이용해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "우리 생활에서 지레를 이용하는 예에 대한 설명으로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "병따개를 쓰면 맨손으로 딸 때보다 작은 힘으로 병뚜껑을 딸 수 있어요.",
      "장도리를 쓰면 작은 힘으로 나무에 박힌 못을 쉽게 뺄 수 있어요.",
      "손톱깎이를 쓸 때보다 손으로 손톱을 뜯을 때 힘이 덜 들어요.",
      "펜치를 쓰면 작은 힘으로 단단한 철사를 끊거나 구부릴 수 있어요.",
      "삽을 쓰면 작은 힘으로 흙을 떠서 다른 곳으로 옮길 수 있어요."
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
    "explanation": "손톱깎이는 지레를 이용한 도구라서 손으로 뜯을 때보다 작은 힘으로 손톱을 자를 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "과학에서 말하는 힘 때문에 물체의 움직임이나 모양이 변한 경우가 아닌 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "할머니의 따뜻한 말 한마디가 큰 힘이 되었다.",
      "줄다리기 줄을 힘을 주어 당기자 줄이 우리 쪽으로 끌려왔다.",
      "찰흙 덩어리를 힘을 주어 주무르자 길쭉한 모양이 되었다.",
      "밤새 열이 나서 아침에 몸에 힘이 하나도 없었다.",
      "공을 힘을 주어 차자 공이 멀리 굴러갔다."
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
    "explanation": "과학에서 말하는 힘은 물체의 움직임이나 모양을 바꾸는 것이에요. 응원이나 기운을 뜻하는 일상말의 '힘'은 이와 달라요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "다음 상황에서 물체가 움직이는 방향을 <보기>에서 골라 각각 기호를 쓰세요.",
    "givens": {
      "보기": [
        "㉠ 물체가 나와 멀어지는 방향으로 움직인다.",
        "㉡ 물체가 나와 가까워지는 방향으로 움직인다."
      ],
      "소문항": [
        "(1) 줄다리기에서 줄을 힘껏 당겼습니다.",
        "(2) 그네에 앉은 동생의 등을 밀었습니다.",
        "(3) 서랍 손잡이를 잡고 힘을 주어 당겼습니다."
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
    "explanation": "물체를 당기면 나와 가까워지는 방향으로, 밀면 나와 멀어지는 방향으로 움직여요. 줄과 서랍은 당겼고, 그네는 밀었어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "두 상자를 바닥에서 밀어서 움직일 때 더 큰 힘이 드는 것을 <보기>에서 골라 기호를 쓰세요. (단, 두 상자는 같은 상자예요.)",
    "givens": {
      "보기": [
        "ㄱ. 아무것도 넣지 않은 빈 상자",
        "ㄴ. 그림책을 가득 넣은 상자"
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
        "그림책을 가득 넣은 상자"
      ]
    },
    "explanation": "그림책을 가득 넣은 상자가 더 무거워요. 무거운 물체일수록 밀어서 움직일 때 더 큰 힘이 들어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "물체를 밀거나 당겨서 움직일 때 드는 힘에 대한 설명으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "가벼운 물체일수록 밀어서 움직일 때 더 큰 힘이 들어요.",
      "짐을 가득 실은 수레를 끌 때가 빈 수레를 끌 때보다 작은 힘이 들어요.",
      "형이 탄 썰매를 끌 때가 아기가 탄 썰매를 끌 때보다 큰 힘이 들어요.",
      "물체가 무겁든 가볍든 밀어서 움직일 때 드는 힘의 크기는 똑같아요.",
      "물을 가득 담은 양동이보다 반쯤 담은 양동이를 끌 때 큰 힘이 들어요."
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
    "explanation": "무거운 물체일수록 밀거나 당길 때 더 큰 힘이 들어요. 형은 아기보다 무거우니 형이 탄 썰매를 끌 때 더 큰 힘이 들어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "다음 빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 크기가 같은 두 상자라도 솜을 넣은 상자보다 모래를 넣은 상자의 □이/가 더 큽니다.\n• 물체의 □은/는 지구가 물체를 당기는 힘의 크기와 같습니다."
    },
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
    "explanation": "물체의 가볍고 무거운 정도를 무게라고 해요. 물체의 무게는 지구가 물체를 당기는 힘의 크기와 같아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "다음은 무게가 다른 두 물체로 수평을 잡는 방법이에요. ㉠, ㉡에 들어갈 알맞은 말을 골라 쓰세요.",
    "givens": {
      "지문": "무게가 다른 두 물체로 수평을 잡으려면, 무거운 물체를 받침점으로부터 ㉠ ( 가까운, 먼 ) 곳에 놓고, 가벼운 물체를 받침점으로부터 ㉡ ( 가까운, 먼 ) 곳에 놓아야 합니다."
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
    "explanation": "무게가 다른 두 물체로 수평을 잡으려면 무거운 물체를 받침점에 가까운 곳에, 가벼운 물체를 먼 곳에 놓아야 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "수평대 나무판자의 왼쪽 2번에 감자를, 오른쪽 4번에 양파를 올려놓았더니 나무판자가 수평을 이루었어요. 감자와 양파 중 더 무거운 것은 무엇인지 쓰세요.",
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
    "explanation": "수평을 이룰 때는 무거운 물체가 받침점에 더 가까이 놓여 있어요. 감자가 받침점에 더 가까우니 감자가 더 무거워요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "수평대를 이용하여 사과와 귤 중 어느 것이 더 무거운지 비교하는 방법을 쓰세요.",
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
          "수평대 양쪽의 같은 거리에 사과와 귤을 올린다",
          "수평이면 무게가 같고, 기울어진 쪽이 더 무겁다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "같은 거리에 올려야 무게만 비교할 수 있어요. 기울어진 쪽이 더 무겁고, 수평이면 무게가 같아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "몸무게가 다른 엄마와 민지가 시소의 받침점에서 같은 거리에 앉았더니 시소가 엄마 쪽으로 기울어졌어요. 이때 엄마가 받침점에서 더 먼 곳으로 옮겨 앉으면 시소는 어떻게 될까요?",
    "givens": null,
    "choices": [
      "시소가 곧바로 수평을 잡아요.",
      "시소가 민지 쪽으로 기울어져요.",
      "시소가 계속 엄마 쪽으로 기울어져 있어요.",
      "시소가 민지 쪽으로 기울었다가 수평이 돼요.",
      "시소가 저절로 오르내리기를 되풀이해요."
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
    "explanation": "엄마가 더 무거운데 받침점에서 더 멀어지면 엄마 쪽으로 더 기울어요. 수평을 잡으려면 엄마가 받침점 쪽으로 가까이 와야 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "세 친구가 공책, 가위, 풀을 각각 손으로 들어 어림하여 가장 무거운 것을 골랐더니 고른 물체가 서로 달랐어요. 그 까닭으로 알맞은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 손으로 들어 보면 누구나 무게를 정확하게 알 수 있기 때문이다.",
        "ㄴ. 사람마다 손으로 느끼는 무게가 다를 수 있기 때문이다.",
        "ㄷ. 물체의 무게가 들 때마다 저절로 바뀌기 때문이다."
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
    "explanation": "손으로 들어 느끼는 무게는 사람마다 다를 수 있어요. 그래서 무게를 정확하게 비교하려면 저울을 써야 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "다음 상황에서 공통으로 사용하는 도구를 고르세요.",
    "givens": {
      "지문": "• 병원에서 몸무게에 맞게 약의 양을 정할 때 씁니다.\n• 빵을 만들 때 밀가루를 알맞은 무게만큼 덜어 낼 때 씁니다.\n• 공항에서 여행 가방이 정해진 무게를 넘는지 확인할 때 씁니다."
    },
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
    "explanation": "약의 양을 정하고, 밀가루를 덜고, 가방 무게를 확인하는 일은 모두 무게를 정확하게 재야 해서 저울을 써요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "다음 용수철저울의 큰 눈금 한 칸과 작은 눈금 한 칸이 나타내는 무게를 바르게 짝 지은 것을 고르세요.",
    "givens": {
      "지문": "어떤 용수철저울의 큰 눈금에는 위에서부터 0, 10, 20, 30, 40, 50이 적혀 있고 단위는 g입니다. 큰 눈금 한 칸은 작은 눈금 다섯 칸으로 나뉘어 있습니다."
    },
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
    "explanation": "큰 눈금은 10 g씩 커지고, 큰 눈금 한 칸이 작은 눈금 다섯 칸으로 나뉘어 있어요. 그래서 작은 눈금 한 칸은 10 ÷ 5 = 2 g이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "이 용수철저울에 물체를 걸었더니 표시 자가 30 눈금에서 작은 눈금 세 칸 더 내려간 곳에 멈추었어요. 물체의 무게로 알맞은 것을 고르세요.",
    "givens": {
      "지문": "어떤 용수철저울의 큰 눈금에는 위에서부터 0, 10, 20, 30, 40, 50이 적혀 있고 단위는 g입니다. 큰 눈금 한 칸은 작은 눈금 다섯 칸으로 나뉘어 있습니다."
    },
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
    "explanation": "작은 눈금 한 칸은 2 g이니 세 칸은 6 g이에요. 그래서 30 g에 6 g을 더한 36 g이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "다음 <보기>는 전자저울의 사용 방법을 순서대로 나타낸 거예요. 잘못 나타낸 것을 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 전자저울을 평평한 곳에 놓고 저울의 수평을 맞춘다.",
        "ㄴ. 전원 단추를 눌러 전자저울을 켠다.",
        "ㄷ. 영점 단추를 눌러 표시판의 숫자가 '0'이 되게 한다.",
        "ㄹ. 물체를 저울판의 한쪽 끝에 올려놓고 표시판의 숫자를 읽는다."
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
    "explanation": "물체는 저울판의 한쪽 끝이 아니라 가운데에 올려놓고 표시판의 숫자를 읽어야 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "전자저울로 지우개와 연필의 무게를 비교하는 방법으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "표시판의 숫자가 더 큰 물체가 더 무거워요.",
      "표시판의 숫자가 더 작은 물체가 더 무거워요.",
      "표시 자가 더 많이 내려간 물체가 더 무거워요.",
      "저울판에 올릴 때 소리가 더 큰 물체가 더 무거워요.",
      "공기 방울이 원 가운데서 멀수록 더 무거워요."
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
    "explanation": "전자저울은 표시판의 숫자가 클수록 무거운 물체예요. 표시 자는 용수철저울의 부분이고, 공기 방울은 저울의 수평을 맞출 때 봐요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "다음 <보기>에서 지레에 대한 설명으로 알맞은 것을 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 비스듬하게 기울어진 면을 이용해 물체를 움직이는 도구이다.",
        "ㄴ. 받침점이 있는 막대를 이용해 물체를 움직이는 도구이다.",
        "ㄷ. 지레를 쓰면 물체를 들어 올릴 때 언제나 더 큰 힘이 든다."
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
    "explanation": "지레는 받침점이 있는 막대를 이용해 물체를 움직이는 도구예요. 비스듬하게 기울어진 면을 이용하는 도구는 빗면이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "같은 필통을 용수철에 걸어 직접 들어 올릴 때와 지레를 이용해 들어 올릴 때 용수철이 늘어난 길이를 기록했어요. 이를 통해 알 수 있는 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "표": {
        "직접 들어 올릴 때": [
          "8 cm"
        ],
        "지레를 이용해 들어 올릴 때": [
          "3 cm"
        ]
      },
      "보기": [
        "ㄱ. 지레를 이용할 때 더 큰 힘이 든다.",
        "ㄴ. 두 방법 모두 드는 힘의 크기가 같다.",
        "ㄷ. 지레를 이용할 때 더 작은 힘이 든다."
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
    "explanation": "지레를 이용할 때 용수철이 더 조금 늘어났으니 드는 힘이 더 작아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "나머지 넷과 다른 원리를 이용하는 예를 고르세요.",
    "givens": null,
    "choices": [
      "나사못",
      "경사로",
      "사다리차",
      "구불구불한 산길",
      "병따개"
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
    "explanation": "나사못·경사로·사다리차·구불구불한 산길은 빗면을 이용하고, 병따개는 지레를 이용해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "친구가 그네를 힘을 주어 밀고 있어요. 이에 대한 설명으로 알맞은 것을 <보기>에서 모두 고른 것을 고르세요.",
    "givens": {
      "보기": [
        "ㄱ. 그네의 움직임이 변한다.",
        "ㄴ. 그네의 색깔이 변한다.",
        "ㄷ. 그네에 힘을 주는 모습이다.",
        "ㄹ. 그네의 무게가 변한다."
      ]
    },
    "choices": [
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄴ, ㄹ",
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
    "explanation": "그네를 밀면 그네에 힘을 주는 것이고, 그 힘 때문에 그네의 움직임이 변해요. 그네의 색깔이나 무게는 변하지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "다음 현상들을 통해 알 수 있는 것을 고르세요.",
    "givens": {
      "지문": "• 찰흙을 두 손으로 힘을 주어 주무르면 길쭉해집니다.\n• 스펀지를 손가락으로 힘을 주어 누르면 움푹 들어갑니다."
    },
    "choices": [
      "힘을 주면 물체의 모양이 변하기도 해요.",
      "힘을 주면 물체의 색깔이 변하기도 해요.",
      "힘을 주어도 물체의 모양은 변하지 않아요.",
      "굴러가는 물체에 힘을 주면 멈출 수 있어요.",
      "힘을 주지 않아도 모양이 저절로 변해요."
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
    "explanation": "찰흙이 길쭉해지고 스펀지가 움푹 들어간 것은 힘 때문에 모양이 변한 거예요. 힘은 물체의 모양을 바꿀 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "다음 빈칸에 들어갈 알맞은 말을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "책상 위의 필통을 손으로 힘을 주어 밀면 필통이 나와 [    ] 방향으로 움직입니다.",
      "보기": [
        "ㄱ. 가까워지는",
        "ㄴ. 멀어지는"
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
    "explanation": "물체를 밀면 나와 멀어지는 방향으로, 당기면 나와 가까워지는 방향으로 움직여요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "다음 실험에서 한 상자에만 공책을 가득 넣는 까닭으로 알맞은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[과정]\n(가) 크기와 모양이 같은 빈 상자 두 개를 바닥에 놓고, 한 상자에만 공책을 가득 넣습니다.\n(나) 두 상자를 각각 손으로 끌어 움직일 때 느껴지는 힘의 크기를 비교합니다.\n(다) 두 상자를 각각 손으로 밀어 움직일 때 느껴지는 힘의 크기를 비교합니다.",
      "보기": [
        "ㄱ. 두 상자의 무게를 다르게 하려고",
        "ㄴ. 두 상자의 크기를 다르게 하려고",
        "ㄷ. 두 상자의 무게를 똑같이 맞추려고"
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
    "explanation": "두 상자의 무게를 다르게 해야 무게에 따라 밀거나 당길 때 드는 힘이 어떻게 달라지는지 비교할 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "다음 실험에 대한 설명으로 알맞지 않은 것을 고르세요.",
    "givens": {
      "지문": "[과정]\n(가) 크기와 모양이 같은 빈 상자 두 개를 바닥에 놓고, 한 상자에만 공책을 가득 넣습니다.\n(나) 두 상자를 각각 손으로 끌어 움직일 때 느껴지는 힘의 크기를 비교합니다.\n(다) 두 상자를 각각 손으로 밀어 움직일 때 느껴지는 힘의 크기를 비교합니다."
    },
    "choices": [
      "두 상자는 크기와 모양이 같은 것을 써야 해요.",
      "공책을 가득 넣은 상자를 끌 때 더 큰 힘이 들어요.",
      "빈 상자를 밀 때가 공책을 넣은 상자를 밀 때보다 작은 힘이 들어요.",
      "상자의 무게가 달라도 끌 때 드는 힘의 크기는 같다는 것을 알 수 있어요.",
      "무거운 상자일수록 밀거나 끌 때 더 큰 힘이 든다는 것을 알 수 있어요."
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
    "explanation": "무거운 물체일수록 밀거나 당길 때 더 큰 힘이 들어요. 무게가 달라도 힘이 같다는 설명은 실험 결과와 맞지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "썰매를 끌어서 움직일 때 두 번째로 큰 힘이 드는 것을 고르세요. (단, 썰매는 모두 같은 썰매이고, 모래주머니 한 개의 무게는 모두 같아요.)",
    "givens": null,
    "choices": [
      "빈 썰매",
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
    "explanation": "모래주머니를 많이 실을수록 썰매가 무거워 끌 때 큰 힘이 들어요. 두 번째로 무거운 것은 여섯 개를 실은 썰매예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "몸무게가 같은 쌍둥이 형제가 시소 양쪽에 앉아 수평을 잡으려고 해요. 알맞은 방법을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 형이 동생보다 받침점에서 먼 곳에 앉는다.",
        "ㄴ. 형과 동생이 받침점에서 같은 거리에 앉는다.",
        "ㄷ. 동생이 형보다 받침점에서 먼 곳에 앉는다."
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
    "explanation": "두 사람의 무게가 같으면 받침점에서 같은 거리에 앉아야 수평이 돼요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "수평 잡기로 두 물체의 무게를 비교하는 방법을 바르게 말한 사람의 이름을 쓰세요.",
    "givens": {
      "지문": "• 민호: 한쪽으로 기울어진 나무판자 양쪽에 두 물체를 올려놓고 비교해요.\n• 서연: 수평이 된 나무판자 양쪽의 같은 거리에 두 물체를 각각 올려놓고 비교해요.\n• 지우: 수평이 된 나무판자 한쪽에만 두 물체를 함께 올려놓고 비교해요."
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
    "explanation": "수평이 된 나무판자 양쪽의 같은 거리에 두 물체를 올려야 무게를 비교할 수 있어요. 기울어진 쪽이 더 무거워요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "수평대 나무판자의 왼쪽 3번에 나무토막 두 개를 겹쳐 올리고, 오른쪽 3번에 같은 나무토막 한 개를 올렸어요. 나무판자는 어떻게 되는지 그 까닭과 함께 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "나무판자가 왼쪽으로 기울어져요. 받침점에서 같은 거리에 올렸는데 왼쪽의 나무토막 두 개가 오른쪽의 한 개보다 더 무겁기 때문이에요.",
      "rubric": {
        "required": [
          "나무판자가 왼쪽으로 기울어진다",
          "왼쪽 나무토막 두 개가 한 개보다 더 무겁다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "받침점에서 같은 거리라면 더 무거운 쪽으로 기울어요. 왼쪽 두 개가 오른쪽 한 개보다 무거워요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "다음은 수평 잡기로 세 가지 채소의 무게를 비교한 결과예요. 오이, 당근, 감자 중 가장 가벼운 채소는 무엇인지 쓰세요.",
    "givens": {
      "지문": "• 수평이 된 나무판자 양쪽의 같은 거리에 오이와 당근을 올려놓았더니 오이 쪽으로 기울어졌습니다.\n• 수평이 된 나무판자 양쪽의 같은 거리에 당근과 감자를 올려놓았더니 당근 쪽으로 기울어졌습니다."
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
    "explanation": "기울어진 쪽이 더 무거우니 오이가 당근보다, 당근이 감자보다 무거워요. 그래서 감자가 가장 가벼워요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "우리 생활에서 저울을 사용하는 경우로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "정육점에서 고기의 무게를 재어 값을 정해요.",
      "택배를 보낼 때 상자의 무게를 재어 요금을 정해요.",
      "문구점에서 연필 한 자루의 무게를 재어 값을 정해요.",
      "보건실에서 몸무게를 재어 건강 기록에 적어요.",
      "빵을 만들 때 설탕을 정해진 무게만큼 덜어 내요."
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
    "explanation": "연필은 무게가 아니라 개수로 값을 정해요. 고기·택배·몸무게·요리 재료는 무게를 정확하게 재야 해서 저울을 써요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "구슬 열 개처럼 고리에 바로 걸 수 없는 물체의 무게를 용수철저울로 재려고 해요. <보기>를 순서대로 나열한 것을 고르세요.",
    "givens": {
      "보기": [
        "ㄱ. 영점 조절 나사를 돌려 표시 자를 눈금 '0'에 맞춘다.",
        "ㄴ. 스탠드를 평평한 곳에 놓고 용수철저울을 건다.",
        "ㄷ. 지퍼 백에 구슬을 넣고 표시 자가 가리키는 눈금을 읽는다.",
        "ㄹ. 빈 지퍼 백을 용수철저울의 고리에 건다."
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
    "explanation": "빈 지퍼 백을 먼저 건 다음 영점을 맞춰야 지퍼 백의 무게가 빠지고 구슬의 무게만 잴 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "다음에서 더 가벼운 물체의 무게는 얼마인지 쓰세요.",
    "givens": {
      "지문": "▲ 필통 (전자저울 표시판: 86 g)\n▲ 풀 (전자저울 표시판: 25 g)"
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
    "explanation": "필통은 86 g, 풀은 25 g이에요. 표시판의 숫자가 더 작은 풀이 더 가벼워요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "같은 물통을 용수철에 걸어 직접 들어 올릴 때와 지레를 이용해 들어 올릴 때 용수철이 늘어난 길이를 기록했어요. 빈칸에 들어갈 길이로 알맞은 것을 고르세요.",
    "givens": {
      "표": {
        "구분": [
          "직접 들어 올릴 때",
          "지레를 이용해 들어 올릴 때"
        ],
        "용수철이 늘어난 길이": [
          "7 cm",
          ""
        ]
      }
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
    "explanation": "지레를 이용하면 직접 들어 올릴 때보다 작은 힘이 들어서 용수철이 7 cm보다 조금 늘어나요. 보기 중 7 cm보다 짧은 것은 4 cm뿐이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "부엌이나 교실에서 찾을 수 있는 지레를 이용한 도구를 한 가지 쓰고, 그 도구를 쓰면 무엇을 할 때 힘이 덜 드는지 쓰세요.",
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
          "지레를 이용하는 도구 한 가지를 쓴다",
          "그 도구로 무엇을 작은 힘으로 할 수 있는지 쓴다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "가위·병따개·집게·손톱깎이는 받침점이 있는 막대를 이용하는 지레라서 작은 힘으로 일을 할 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "가위에 대해 바르게 말한 사람을 모두 고른 것을 고르세요.",
    "givens": {
      "지문": "• 민호: 지레를 이용한 도구예요.\n• 서연: 빗면을 이용한 도구예요.\n• 지우: 종이나 천을 작은 힘으로 자를 수 있어요.\n• 하준: 손으로 찢을 때보다 더 큰 힘이 들어요."
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
    "explanation": "가위는 지레를 이용한 도구라서 종이나 천을 작은 힘으로 자를 수 있어요. 빗면이 아니고, 더 큰 힘이 들지도 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "다음에서 물체의 모양을 변하게 한 사람의 이름을 쓰세요.",
    "givens": {
      "지문": "• 민호: 책상을 힘을 주어 밀어서 벽 쪽으로 옮겼어.\n• 서연: 빵 반죽을 힘을 주어 눌러서 납작하게 폈어.\n• 지우: 창문을 힘을 주어 당겨서 닫았어."
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
    "explanation": "빵 반죽을 눌러 납작하게 편 것은 힘 때문에 모양이 변한 경우예요. 책상을 옮기고 창문을 닫은 것은 움직임이 변한 경우예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "동생이 탄 썰매의 끈을 잡고 힘을 주어 당겼어요. 썰매가 움직이는 방향을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 나에게서 멀어지는 쪽",
        "ㄴ. 나에게 가까워지는 쪽",
        "ㄷ. 끈과 상관없이 옆쪽"
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
    "explanation": "물체를 당기면 나와 가까워지는 방향으로 움직여요. 그래서 썰매는 끈을 당긴 내 쪽으로 다가와요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "<보기>의 물통을 각각 끌어서 움직일 때 작은 힘이 드는 것부터 순서대로 나열한 것을 고르세요. (단, 물통은 모두 같은 물통이에요.)",
    "givens": {
      "보기": [
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
    "explanation": "가벼운 물체일수록 끌 때 작은 힘이 들어요. 빈 물통, 반쯤 채운 물통, 가득 채운 물통 순서로 힘이 커져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "수평대 나무판자의 오른쪽 4번에 구슬 주머니 한 개를 올려놓았어요. 같은 구슬 주머니 한 개를 왼쪽에 올려 수평을 잡으려면 어디에 올려야 하나요?",
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
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "무게가 같은 두 물체는 받침점에서 같은 거리에 놓아야 수평이 돼요. 그래서 왼쪽 4번이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "수평대 나무판자의 오른쪽 4번에 구슬 주머니 한 개를 올려놓았어요. 같은 구슬 주머니 두 개를 겹쳐 왼쪽에 올려 수평을 잡으려면 어디에 올려야 하나요?",
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
    "explanation": "두 배 무거운 쪽은 받침점에서 절반 거리에 놓아야 수평이 돼요. 오른쪽 4번의 절반인 왼쪽 2번이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "할아버지와 민수가 시소의 받침점에서 같은 거리에 앉았더니 시소가 할아버지 쪽으로 기울어졌어요. 시소가 수평이 되게 하려면 어떻게 해야 하는지 까닭과 함께 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "할아버지가 민수보다 더 무거우므로, 할아버지가 받침점에 더 가까운 곳으로 옮겨 앉거나 민수가 받침점에서 더 먼 곳으로 옮겨 앉아요.",
      "rubric": {
        "required": [
          "할아버지가 민수보다 더 무겁다",
          "할아버지가 받침점 가까이(또는 민수가 받침점에서 더 멀리) 옮겨 앉는다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "시소가 할아버지 쪽으로 기울었으니 할아버지가 더 무거워요. 무거운 사람이 받침점에 가까이 가거나 가벼운 사람이 멀리 가야 수평이 돼요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "배와 감, 감과 귤을 수평대 양쪽의 같은 거리에 각각 올려놓았더니 다음과 같았어요. 배, 감, 귤 중 가장 무거운 과일은 무엇인지 쓰세요.",
    "givens": {
      "지문": "• 배와 감: 배 쪽으로 기울어짐\n• 감과 귤: 수평을 이룸"
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
    "explanation": "배와 감은 배 쪽으로 기울었으니 배가 감보다 무겁고, 감과 귤은 수평이라 무게가 같아요. 그래서 배가 가장 무거워요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "우리 생활에서 무게를 정확하게 재야 하는 경우로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "약국에서 아기 몸무게에 맞춰 약의 양을 정해요.",
      "우체국에서 소포의 무게에 따라 요금을 정해요.",
      "운동 경기에서 몸무게에 따라 체급을 나눠요.",
      "빵집에서 반죽 재료를 정해진 무게만큼 넣어요.",
      "도서관에서 책 무게와 상관없이 빌릴 권수를 정해요."
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
    "explanation": "도서관에서 빌릴 권수는 책의 무게가 아니라 개수로 정해요. 약·소포·체급·빵 재료는 무게를 정확하게 재야 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "용수철저울 각 부분의 이름과 하는 일을 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "용수철 - 물체의 무게에 해당하는 눈금을 가리켜요.",
      "고리 - 물체를 매달면 길게 늘어나요.",
      "표시 자 - 무게를 재려는 물체를 거는 곳이에요.",
      "영점 조절 나사 - 표시 자를 '0'에 맞춰요.",
      "손잡이 - 물체의 무게를 숫자로 보여 줘요."
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
    "explanation": "영점 조절 나사를 돌려 표시 자를 0에 맞춰요. 눈금을 가리키는 것은 표시 자, 늘어나는 것은 용수철, 물체를 거는 곳은 고리예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "용수철저울에 대한 설명으로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "영점 조절 나사를 돌리면 표시 자의 위치가 바뀌어요.",
      "무거운 물체를 매달수록 용수철이 더 많이 늘어나요.",
      "고리에 걸 수 없는 물체는 지퍼 백에 넣어 무게를 재요.",
      "눈금을 읽을 때는 표시 자보다 눈을 높이 두고 읽어요.",
      "물체를 매달고 표시 자가 멈췄을 때 눈금을 읽어요."
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
    "explanation": "눈금은 표시 자와 눈높이를 맞추어 읽어야 해요. 눈을 높이거나 낮추면 눈금을 잘못 읽게 돼요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "어떤 용수철저울의 큰 눈금에 0, 20, 40, 60, 80이 적혀 있고 단위는 g이에요. 큰 눈금 한 칸이 나타내는 무게를 고르세요.",
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
    "explanation": "큰 눈금의 숫자가 0, 20, 40처럼 20씩 커지니 큰 눈금 한 칸은 20 g이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "다음은 전자저울 사용 방법을 순서 없이 나열한 거예요. 순서대로 나열한 것을 고르세요.",
    "givens": {
      "보기": [
        "ㄱ. 물체를 저울판 가운데에 올리고 표시판의 숫자를 읽는다.",
        "ㄴ. 영점 단추를 눌러 표시판을 '0'으로 맞춘다.",
        "ㄷ. 전자저울을 평평한 곳에 놓고 수평을 맞춘다.",
        "ㄹ. 전원 단추를 눌러 전자저울을 켠다."
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
    "explanation": "평평한 곳에 놓고 수평을 맞춘 뒤, 전원을 켜고, 영점 단추로 0을 맞춘 다음, 물체를 올려 숫자를 읽어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "다음은 여러 가지 물체를 전자저울에 올렸을 때 표시판에 나타난 숫자예요. 가장 가벼운 물체는 무엇인지 쓰세요.",
    "givens": {
      "표": {
        "물체": [
          "숫자"
        ],
        "가위": [
          "42"
        ],
        "풀": [
          "18"
        ],
        "공책": [
          "64"
        ],
        "색연필": [
          "9"
        ]
      }
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
    "explanation": "표시판의 숫자가 작을수록 가벼워요. 색연필(9)이 가장 가볍고, 풀(18), 가위(42), 공책(64) 순서로 무거워요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "받침대 위에 긴 막대를 걸치고, 받침대 가까운 쪽 끝에 물병을 올린 뒤 받침대에서 먼 반대쪽 끝을 눌러 물병을 들어 올렸어요. 이에 대한 설명으로 알맞은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "빗면을 이용해 들어 올린 모습이에요.",
      "지레를 이용해 들어 올린 모습이에요.",
      "물병을 직접 들어 올릴 때보다 작은 힘이 들어요.",
      "물병을 직접 들어 올릴 때보다 큰 힘이 들어요.",
      "물병을 직접 들어 올릴 때와 드는 힘이 같아요."
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
    "explanation": "받침점이 있는 막대로 물체를 들어 올리는 것은 지레예요. 지레를 이용하면 직접 들어 올릴 때보다 작은 힘이 들어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "같은 상자를 트럭 짐칸에 실으려고 해요. 상자를 직접 들어 올릴 때와 비스듬하게 걸친 판자(빗면)를 따라 밀어 올릴 때 드는 힘의 크기를 비교하여 쓰세요.",
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
          "빗면을 따라 밀어 올릴 때 드는 힘이 더 작다",
          "직접 들어 올릴 때와 견주어 쓴다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "빗면을 이용하면 물체의 무게보다 작은 힘으로 물체를 높은 곳에 옮길 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "<보기>에서 빗면을 이용하는 예를 모두 고른 것을 고르세요.",
    "givens": {
      "보기": [
        "ㄱ. 장도리",
        "ㄴ. 구불구불한 산길",
        "ㄷ. 펜치",
        "ㄹ. 휠체어 경사로"
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
    "explanation": "구불구불한 산길과 휠체어 경사로는 빗면을 이용해요. 장도리와 펜치는 지레를 이용해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "다음은 병따개에 대한 설명이에요. 빈칸에 들어갈 알맞은 말을 고르세요.",
    "givens": {
      "지문": "병따개는 [  ]을/를 이용한 도구로, 병뚜껑을 작은 힘으로 쉽게 딸 수 있습니다."
    },
    "choices": [
      "빗면",
      "지레",
      "저울",
      "용수철",
      "수평대"
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
    "explanation": "병따개는 받침점이 있는 막대를 이용하는 지레예요. 그래서 작은 힘으로 병뚜껑을 딸 수 있어요.",
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
