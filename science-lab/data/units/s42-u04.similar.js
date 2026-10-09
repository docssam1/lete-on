// 4-2 Ⅳ 화산과 지진 — 유사문항 70 (창작). 원문 1문항당 1개, 같은 유형·난이도로 상황과 물체를 바꿨다. of = 짝이 되는 원문 (세트, 번호).
export const similar = [
  {
    "id": "s42-u04-v001",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "민준이가 여행 안내문에서 읽은 설명이에요. 어떤 지형에 대한 설명인지 고르세요.",
    "givens": {
      "지문": "이 산은 아주 오래전 땅속 깊은 곳의 마그마가 지표면 밖으로 뿜어져 나와 만들어졌어요. 꼭대기에는 움푹 파인 곳이 있어요."
    },
    "choices": [
      "화산",
      "용암",
      "마그마",
      "지층",
      "골짜기"
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
    "explanation": "땅속 깊은 곳의 마그마가 지표면 밖으로 뿜어져 나와 만들어진 지형은 화산이에요. 용암과 마그마는 지형이 아니라 화산을 만드는 물질이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v002",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산에 대한 설명으로 옳은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "모든 화산은 높이와 생김새가 서로 똑같습니다.",
      "꼭대기가 뾰족한 화산도 있고 넓고 평평한 화산도 있습니다.",
      "우리나라에는 화산이 하나도 없습니다.",
      "용암이나 화산재가 쌓여 주변 지형보다 높이 솟아 있습니다.",
      "화산 꼭대기에는 반드시 물이 고인 호수가 있습니다."
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
    "explanation": "화산은 크기와 생김새가 다양하고, 용암이나 화산재가 쌓여 주변보다 높아요. 우리나라에도 한라산·백두산 같은 화산이 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v003",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "백두산 꼭대기의 천지는 화산 꼭대기의 움푹 파인 곳에 물이 고여 만들어진 호수예요. 이처럼 화산 꼭대기에 움푹 파인 곳을 무엇이라고 하는지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "분화구",
      "accepted": [
        "분화구"
      ]
    },
    "explanation": "화산 꼭대기에 움푹 파인 곳을 분화구라고 해요. 천지처럼 분화구에 물이 고여 호수가 된 화산도 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v004",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산 활동 모형실험을 하려고 해요. 실험 과정을 순서에 맞게 기호를 나열하세요.",
    "givens": {
      "보기": [
        "ㄱ. 포일로 감싼 마시멜로를 은박 접시에 올리고 가열 장치로 가열합니다.",
        "ㄴ. 가열을 멈춘 뒤 흘러나온 마시멜로가 식어 굳는 모습을 관찰합니다.",
        "ㄷ. 알루미늄 포일로 마시멜로를 감싸고 윗부분을 조금 열어 둡니다.",
        "ㄹ. 알루미늄 포일 위에 마시멜로를 놓고 빨간색 식용 색소를 뿌립니다."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄹ → ㄷ → ㄱ → ㄴ",
      "accepted": [
        "ㄹ → ㄷ → ㄱ → ㄴ",
        "ㄹ→ㄷ→ㄱ→ㄴ",
        "ㄹ-ㄷ-ㄱ-ㄴ",
        "ㄹ, ㄷ, ㄱ, ㄴ",
        "ㄹㄷㄱㄴ"
      ]
    },
    "explanation": "포일 위에 마시멜로를 놓고 색소를 뿌린 뒤 윗부분을 조금 열어 감싸고, 접시에 올려 가열한 다음, 가열을 멈추고 흘러나온 마시멜로가 굳는 모습을 관찰해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v005",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "알루미늄 포일로 감싼 마시멜로를 은박 접시에 올려 가열했어요. 이때 관찰할 수 있는 모습으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "마시멜로는 그대로이고 알루미늄 포일만 녹아 흐릅니다.",
      "녹은 마시멜로가 열어 둔 윗부분으로 흘러나옵니다.",
      "흘러나온 마시멜로가 식으면서 점점 굳습니다.",
      "화산 모형 윗부분에서 연기가 피어오릅니다.",
      "알루미늄 포일이 들썩거리기도 합니다."
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
    "explanation": "가열하면 알루미늄 포일은 녹지 않고, 그 안의 마시멜로가 녹아 열어 둔 윗부분으로 흘러나와요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v006",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산 분출물인 화산 가스, 화산 암석 조각, 용암의 상태를 차례대로 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "기체 / 액체 / 고체",
      "고체 / 기체 / 액체",
      "기체 / 고체 / 액체",
      "액체 / 고체 / 기체",
      "고체 / 액체 / 기체"
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
    "explanation": "화산 가스는 기체, 화산 암석 조각은 고체, 용암은 액체 상태예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v007",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음에서 설명하는 화산 분출물은 무엇인지 고르세요.",
    "givens": {
      "지문": "화산이 폭발할 때 하늘로 튀어 올랐다가 떨어진 돌덩이예요. 주먹만 한 것부터 커다란 바위만 한 것까지 크기가 여러 가지예요."
    },
    "choices": [
      "화산 암석 조각",
      "용암",
      "화산 가스",
      "마그마",
      "화산재"
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
    "explanation": "화산이 분출할 때 튀어 나오는 돌덩이는 화산 암석 조각이에요. 고체 상태이고 크기가 아주 다양해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v008",
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
      "unit": "u04",
      "area": "지구",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "현무암에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "밝은 바탕에 반짝이는 큰 알갱이가 뚜렷하게 보입니다.",
      "대체로 색깔이 어둡습니다.",
      "마그마가 지표 가까이에서 빠르게 식어 만들어졌습니다.",
      "표면에 크고 작은 구멍이 있는 것도 있습니다.",
      "알갱이가 매우 작아 맨눈으로 잘 보이지 않습니다."
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
    "explanation": "밝은 바탕에 큰 알갱이가 보이는 것은 화강암의 특징이에요. 현무암은 어둡고 알갱이가 매우 작아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v009",
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
      "unit": "u04",
      "area": "지구",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "현무암이 화강암보다 알갱이의 크기가 작은 까닭을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 현무암은 땅속 깊은 곳에서 천천히 식어 만들어졌기 때문입니다.",
        "ㄴ. 현무암은 마그마가 지표 가까이에서 빠르게 식어 만들어졌기 때문입니다.",
        "ㄷ. 현무암은 오랜 시간 바람에 깎여 알갱이가 작아졌기 때문입니다."
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
        "ㄴ."
      ]
    },
    "explanation": "현무암은 마그마가 지표 가까이에서 빠르게 식어 만들어져서 알갱이가 자랄 시간이 짧았어요. 그래서 알갱이가 작아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v010",
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
      "unit": "u04",
      "area": "지구",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음에서 설명하는 현상은 무엇인지 고르세요.",
    "givens": {
      "지문": "지구 내부에서 작용하는 힘을 오랫동안 받은 땅이 끊어지면서 땅이 흔들리는 현상"
    },
    "choices": [
      "홍수",
      "산불",
      "지진",
      "황사",
      "태풍"
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
    "explanation": "땅이 지구 내부에서 작용하는 힘을 오랫동안 받다가 끊어지면서 흔들리는 현상은 지진이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v011",
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
      "unit": "u04",
      "area": "지구",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지진에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "지진은 바닷속 땅에서도 일어날 수 있습니다.",
      "지하 동굴이 무너질 때도 지진이 일어날 수 있습니다.",
      "지진이 일어나면 도로가 갈라지기도 합니다.",
      "땅이 오랫동안 힘을 받다가 끊어질 때 지진이 일어납니다.",
      "지진은 바람이 세게 부는 날에만 일어납니다."
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
    "explanation": "지진은 땅이 지구 내부의 힘을 받아 끊어질 때 일어나요. 바람과는 관계가 없고, 바닷속 땅에서도 일어나요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v012",
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
      "unit": "u04",
      "area": "지구",
      "element": "E5",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 은호가 쓴 탐구 노트의 일부예요. 빈칸에 들어갈 알맞은 말을 <보기>에서 골라 쓰세요.",
    "givens": {
      "지문": "지진의 세기는 숫자로 나타낸다. 숫자가 클수록 강한 지진이고, 피해도 커질 수 있다. 지진의 세기를 나타내는 이 숫자를 □(이)라고 한다.",
      "보기": [
        "높이",
        "깊이",
        "규모",
        "온도"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "규모",
      "accepted": [
        "규모"
      ]
    },
    "explanation": "지진의 세기를 숫자로 나타낸 것을 규모라고 해요. 규모의 숫자가 클수록 강한 지진이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v013",
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
      "unit": "u04",
      "area": "지구",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지진에 대비해 집에서 미리 할 일로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "가족과 함께 대피할 장소를 미리 정해 둡니다.",
      "책장처럼 넘어지기 쉬운 가구를 벽에 고정합니다.",
      "무겁고 깨지기 쉬운 물건을 높은 선반에 둡니다.",
      "손전등과 비상식량을 가방에 챙겨 둡니다.",
      "가스 밸브와 전기 차단기가 있는 곳을 알아 둡니다."
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
    "explanation": "무겁거나 깨지기 쉬운 물건은 흔들릴 때 떨어져 다칠 수 있으므로 낮은 곳에 두어야 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v014",
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
      "unit": "u04",
      "area": "지구",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지진이 발생했을 때의 대처 방법으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "백화점에 있을 때는 승강기를 타고 서둘러 1층으로 내려갑니다.",
      "길을 걸을 때는 담장 옆에 바짝 붙어서 흔들림을 피합니다.",
      "바닷가에 있을 때는 지진 해일에 대비해 높은 곳으로 대피합니다.",
      "산에 있을 때는 비탈 바로 아래에 앉아 흔들림이 멈추기를 기다립니다.",
      "집에 있을 때는 흔들리는 동안 현관 밖 계단으로 바로 뛰어나갑니다."
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
    "explanation": "바닷가에서는 지진 해일이 올 수 있어 높은 곳으로 대피해요. 승강기는 멈출 수 있고, 담장·비탈 근처는 무너지거나 산사태가 날 수 있어 위험해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v015",
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
      "unit": "u04",
      "area": "지구",
      "element": "E6",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "집에서 저녁을 먹는 중에 갑자기 집이 심하게 흔들리기 시작했어요. 흔들리는 동안 어떻게 해야 하는지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "튼튼한 식탁 아래로 들어가 식탁 다리를 꼭 잡고 머리와 몸을 보호해요.",
      "rubric": {
        "required": [
          "식탁(탁자) 아래로 들어간다",
          "식탁 다리를 잡고 머리와 몸을 보호한다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "흔들리는 동안 움직이면 떨어지는 물건에 다칠 수 있어요. 튼튼한 식탁 아래에서 다리를 잡고 머리와 몸을 보호해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v016",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음에서 설명하는 것은 무엇인지 고르세요.",
    "givens": {
      "지문": "화산 아래 땅속 깊은 곳에서 암석이 녹아 만들어진 뜨거운 물질로, 이것이 지표면 밖으로 분출하면 화산이 생겨요."
    },
    "choices": [
      "용암",
      "화산재",
      "현무암",
      "화산 가스",
      "마그마"
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
    "explanation": "땅속 깊은 곳에서 암석이 녹아 만들어진 물질은 마그마예요. 마그마가 지표로 나와 기체가 빠져나간 것이 용암이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v017",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "제주도의 한라산에 대한 설명으로 옳은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "북한 지역에 있는 산입니다.",
      "마그마가 분출하여 만들어진 화산입니다.",
      "지금도 산꼭대기에서 용암이 흘러나옵니다.",
      "주변 땅보다 낮게 움푹 꺼진 지형입니다.",
      "산꼭대기의 분화구에 백록담이라는 호수가 있습니다."
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
    "explanation": "한라산은 마그마가 분출해 만들어진 화산이고, 꼭대기의 분화구에 백록담이 있어요. 지금은 용암이 흘러나오지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v018",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산 분출물 중 고체 상태인 것끼리 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "화산재, 화산 암석 조각",
      "화산 가스, 용암",
      "화산 가스, 화산재",
      "용암, 화산재",
      "용암, 화산 암석 조각"
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
    "explanation": "화산재와 화산 암석 조각은 고체, 용암은 액체, 화산 가스는 기체 상태예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v019",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 실험은 실제 자연 현상 중 무엇을 흉내 낸 것인지 고르세요.",
    "givens": {
      "지문": "<실험 과정>\n㉠ 알루미늄 포일 위의 마시멜로에 빨간색 식용 색소를 뿌립니다.\n㉡ 포일로 마시멜로를 감싸고 윗부분을 조금 열어 둡니다.\n㉢ 은박 접시에 올려 가열하면서 피어오르는 연기, 흘러나오는 마시멜로, 굳는 마시멜로를 관찰합니다."
    },
    "choices": [
      "화산이 분출하는 모습",
      "지진이 일어나는 모습",
      "강물이 흐르는 모습",
      "지층이 쌓이는 모습",
      "화석이 만들어지는 모습"
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
    "explanation": "포일 속 마시멜로가 녹아 흘러나오고 연기가 나는 모습은 화산이 분출할 때 나오는 물질을 흉내 낸 거예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v020",
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
      "unit": "u04",
      "area": "지구",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "현무암에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "제주도에서 돌담을 쌓는 데 많이 쓰입니다.",
      "알갱이의 크기가 화강암보다 큽니다.",
      "석굴암을 만들 때 쓰였습니다.",
      "대체로 색깔이 밝습니다.",
      "마그마가 땅속 깊은 곳에서 천천히 식어 만들어졌습니다."
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
    "explanation": "현무암은 어둡고 알갱이가 작으며, 제주도 돌담·돌하르방에 많이 쓰여요. 밝고 알갱이가 큰 화강암은 석굴암에 쓰였어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v021",
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
      "unit": "u04",
      "area": "지구",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음에서 설명하는 암석으로 옳은 것을 <보기>에서 모두 골라 짝 지은 것을 고르세요.",
    "givens": {
      "지문": "• 마그마가 식어 굳어져 만들어진 암석입니다.\n• 마그마가 땅속 깊은 곳에서 천천히 식어서 만들어졌습니다.",
      "보기": [
        "ㄱ. 현무암",
        "ㄴ. 화성암",
        "ㄷ. 화강암"
      ]
    },
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
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
    "explanation": "마그마가 식어 굳은 암석은 화성암이고, 그중 땅속 깊은 곳에서 천천히 식은 것은 화강암이에요. 현무암은 지표 가까이에서 빠르게 식었어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v022",
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
      "unit": "u04",
      "area": "지구",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "제주도 돌하르방을 자세히 보면 표면에 크고 작은 구멍이 보여요. 이 구멍이 생긴 까닭으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "빗물에 오랫동안 조금씩 녹아서 생긴 것입니다.",
      "마그마가 식을 때 화산 가스가 빠져나간 흔적입니다.",
      "마그마가 땅속에서 천천히 식으면서 생긴 것입니다.",
      "얼었다 녹기를 되풀이하며 갈라져서 생긴 것입니다.",
      "작은 벌레들이 오랫동안 갉아 먹어서 생긴 것입니다."
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
    "explanation": "현무암의 구멍은 용암이 식어 굳을 때 그 속의 화산 가스가 빠져나간 흔적이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v023",
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
      "unit": "u04",
      "area": "지구",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산 활동이 우리 생활에 주는 피해로 옳은 것을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "보기": [
        "ㄱ. 화산 주변에 온천이 생겨 사람들이 쉬러 옵니다.",
        "ㄴ. 용암이 흘러내려 산불이 나고 집이 불탑니다.",
        "ㄷ. 화산 주변 땅속의 열로 전기를 만듭니다.",
        "ㄹ. 화산재가 하늘을 뒤덮어 비행기가 뜨지 못합니다."
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
        "ㄴ ㄹ"
      ]
    },
    "explanation": "용암으로 산불이 나는 것과 화산재 때문에 비행기가 뜨지 못하는 것은 피해예요. 온천과 지열 발전은 화산 활동이 주는 이로움이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v024",
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
      "unit": "u04",
      "area": "지구",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산재가 하늘을 넓게 뒤덮었을 때 생길 수 있는 피해로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "땅속의 열로 온천이 생깁니다.",
      "비행기가 다니기 어려워집니다.",
      "화산재가 쌓인 땅이 기름져집니다.",
      "땅이 끊어지면서 흔들립니다.",
      "관광객이 많이 찾아옵니다."
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
    "explanation": "하늘에 퍼진 화산재는 비행기 엔진을 망가뜨릴 수 있어 비행기가 다니기 어려워져요. 땅이 기름져지는 것은 이로운 점이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v025",
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
      "unit": "u04",
      "area": "지구",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산 지역에서 땅속의 높은 열을 이용하는 예로 옳은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "땅속에서 데워진 물을 끌어 올려 건물을 따뜻하게 합니다.",
      "화산재를 섞어 비누와 화장품을 만듭니다.",
      "땅속의 열로 전기를 만드는 발전소를 짓습니다.",
      "현무암을 쌓아 밭 둘레에 돌담을 만듭니다.",
      "특이한 화산 지형을 꾸며 관광지로 씁니다."
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
    "explanation": "땅속의 높은 열은 난방이나 지열 발전에 쓰여요. 비누·돌담·관광지는 열이 아니라 화산재·암석·지형을 이용한 예예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v026",
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
      "unit": "u04",
      "area": "지구",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 지진 발생 모형실험을 한 모습이에요. 이 실험에 대한 설명으로 옳은 것을 <보기>에서 모두 골라 짝 지은 것을 고르세요.",
    "givens": {
      "지문": "겹친 우드록 양 끝을 두 손으로 잡고 가운데 쪽으로 천천히 밀었어요. 처음에는 ㈎ 우드록이 휘어지다가, 계속 밀자 ㈏ 우드록이 소리를 내며 끊어졌어요.",
      "보기": [
        "ㄱ. ㈎는 땅이 힘을 받아 휘어지는 모습을 나타냅니다.",
        "ㄴ. ㈏에서 우드록이 끊어질 때 손에 떨림이 느껴집니다.",
        "ㄷ. ㈏는 화산에서 용암이 흘러나오는 모습을 나타냅니다.",
        "ㄹ. 우드록은 한 번 살짝 밀기만 해도 바로 끊어집니다."
      ]
    },
    "choices": [
      "ㄱ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄹ",
      "ㄱ, ㄴ, ㄷ, ㄹ"
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
    "explanation": "우드록이 휘어지다 끊어지며 떨리는 것은 땅이 휘어지다 끊어지며 흔들리는 지진을 나타내요. 화산과는 관계가 없고, 살짝 밀어서는 끊어지지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v027",
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
      "unit": "u04",
      "area": "지구",
      "element": "E4",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 지진 발생 모형실험과 실제 자연 현상을 비교한 것이에요. 빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 각각 쓰세요.",
    "givens": {
      "표": {
        "지진 발생 모형실험": [
          "우드록",
          "양손으로 미는 힘",
          "우드록이 끊어질 때의 떨림"
        ],
        "실제 자연 현상": [
          "㉠",
          "㉡",
          "지진"
        ]
      }
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-땅, ㉡-지구 내부에서 작용하는 힘",
      "accepted": [
        "㉠-땅, ㉡-지구 내부에서 작용하는 힘",
        "㉠ 땅, ㉡ 지구 내부에서 작용하는 힘",
        "땅, 지구 내부에서 작용하는 힘",
        "땅, 지구 내부의 힘",
        "㉠ 땅, ㉡ 지구 내부의 힘",
        "땅, 지구 내부 힘"
      ]
    },
    "explanation": "우드록은 땅, 우드록을 미는 힘은 지구 내부에서 작용하는 힘, 끊어질 때의 떨림은 지진을 나타내요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v028",
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
      "unit": "u04",
      "area": "지구",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지진이 일어나는 까닭으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "비가 며칠 동안 많이 내려 강물이 둑을 넘어 흐를 때",
      "태풍이 다가와 바람이 세게 불고 큰 나무가 쓰러질 때",
      "바닷물이 하루에 두 번씩 밀려 들어왔다가 빠져나갈 때",
      "여름 햇볕이 강하게 내리쬐어 땅이 뜨겁게 달궈질 때",
      "땅이 지구 내부에서 작용하는 힘을 받아 끊어질 때"
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
    "explanation": "지진은 땅이 지구 내부에서 작용하는 힘을 오랫동안 받다가 끊어질 때 일어나요. 비·바람·햇볕 같은 날씨는 땅을 끊지 못해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v029",
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
      "unit": "u04",
      "area": "지구",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지진에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "우리나라는 지진이 일어나지 않는 곳이라 대비할 필요가 없습니다.",
      "규모 3.0인 지진보다 규모 6.0인 지진이 더 강합니다.",
      "지진이 일어나면 산사태가 나거나 도로가 갈라질 수 있습니다.",
      "규모는 지진의 세기를 숫자로 나타낸 것입니다.",
      "지진이 일어나면 건물이 무너져 사람이 다치기도 합니다."
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
    "explanation": "우리나라에서도 규모 5.0이 넘는 지진이 일어난 적이 있어요. 그래서 우리나라도 지진에 미리 대비해야 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v030",
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
      "unit": "u04",
      "area": "지구",
      "element": "E6",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 지진이 발생했을 때의 대처 방법이에요. 빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 건물 안에서 지진이 발생하면 □(을)를 타지 말고 계단을 이용해 대피합니다.\n• □(은)는 지진으로 전기가 끊기면 멈추어 그 안에 갇힐 수 있습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "승강기",
      "accepted": [
        "승강기",
        "엘리베이터"
      ]
    },
    "explanation": "지진으로 전기가 끊기면 승강기가 멈춰 갇힐 수 있어요. 그래서 승강기 대신 계단으로 대피해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v031",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "여러 화산의 사진을 보고 친구들이 한 말이에요. 옳지 않은 말을 고르세요.",
    "givens": null,
    "choices": [
      "하윤: 꼭대기가 뾰족한 화산도 있고 평평한 화산도 있어.",
      "도윤: 화산마다 높이와 경사가 서로 달라.",
      "서아: 화산은 땅속의 마그마가 분출해서 생긴 지형이야.",
      "지호: 용암과 화산재가 쌓여서 주변보다 높이 솟아 있어.",
      "예린: 모든 화산에서는 지금도 용암이 계속 흘러나와."
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
    "explanation": "화산은 생김새와 높이가 다양하고 주변보다 높아요. 하지만 지금은 용암이 흘러나오지 않는 화산도 많아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v032",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "세계 여러 곳의 화산 사진을 비교했어요. 모든 화산에 공통으로 해당하는 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 주변 땅보다 낮게 꺼진 곳에 있습니다.",
        "ㄴ. 꼭대기에 반드시 물이 고인 호수가 있습니다.",
        "ㄷ. 땅속의 마그마가 지표로 분출하여 생겼습니다."
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
        "ㄷ."
      ]
    },
    "explanation": "화산은 모두 땅속의 마그마가 분출해서 생겼어요. 주변보다 높고, 꼭대기에 분화구가 있는 것도 많아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v033",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산 활동 모형실험에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "포일 윗부분을 꼭 막아야 마시멜로가 잘 흘러나옵니다.",
      "포일 윗부분을 조금 열어 둔 곳은 화산의 분화구를 나타냅니다.",
      "빨간색 식용 색소는 마시멜로를 더 빨리 녹이려고 넣습니다.",
      "가열하면 마시멜로는 그대로이고 포일이 녹아 흐릅니다.",
      "이 실험으로 지진이 일어나는 까닭을 알 수 있습니다."
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
    "explanation": "포일 윗부분을 조금 열어 두면 녹은 마시멜로가 그곳으로 나오는데, 이 부분이 화산의 분화구 역할을 해요. 색소는 용암과 비슷한 색을 내려고 넣어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v034",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 화산 활동 모형과 실제 화산 활동을 비교한 것이에요. 빈칸 ㉠~㉢에 들어갈 말을 바르게 짝 지은 것을 고르세요.",
    "givens": {
      "표": {
        "화산 활동 모형": [
          "굳은 마시멜로",
          "피어오르는 연기",
          "흘러나오는 마시멜로"
        ],
        "실제 화산 활동": [
          "㉠",
          "㉡",
          "㉢"
        ]
      }
    },
    "choices": [
      "㉠ - 화산 가스",
      "㉡ - 용암",
      "㉡ - 화산 가스",
      "㉢ - 화산재",
      "㉢ - 화산 암석 조각"
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
    "explanation": "굳은 마시멜로는 용암이 굳어 만들어진 암석, 피어오르는 연기는 화산 가스, 흘러나오는 마시멜로는 용암을 나타내요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v035",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산 분출물에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "용암은 기체 상태의 분출물입니다.",
      "화산재는 고체 상태의 아주 작은 가루입니다.",
      "화산 가스는 액체 상태의 분출물입니다.",
      "화산 암석 조각은 크기가 모두 똑같습니다.",
      "화산 분출물은 모두 고체 상태입니다."
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
    "explanation": "화산재는 고체 상태의 아주 작은 가루예요. 용암은 액체, 화산 가스는 기체이고, 화산 암석 조각은 크기가 다양해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v036",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음에서 설명하는 것은 무엇인지 고르세요.",
    "givens": {
      "지문": "• 땅속에 있을 때는 마그마라고 불러요.\n• 마그마가 지표 밖으로 나와 기체가 빠져나간 뒤 땅 위를 흘러내리는 액체 상태의 물질이에요."
    },
    "choices": [
      "마그마",
      "용암",
      "화산재",
      "화산 가스",
      "화산 암석 조각"
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
    "explanation": "땅속에 있을 때는 마그마이고, 지표 밖으로 나와 기체가 빠져나간 뒤 흐르는 것은 용암이라고 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v037",
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
      "unit": "u04",
      "area": "지구",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산 단면에서 ㄱ은 땅속 깊은 곳의 마그마가 있는 곳이고, ㄴ은 땅 위로 흘러나온 용암이 식는 곳이에요. 다음과 같은 특징을 가지는 암석이 만들어지는 곳을 ㄱ과 ㄴ 중에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "• 대체로 색깔이 어둡습니다.\n• 알갱이가 매우 작아 맨눈으로 잘 보이지 않습니다."
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
    "explanation": "색깔이 어둡고 알갱이가 매우 작은 암석은 현무암이에요. 현무암은 땅 위로 나온 용암이 빠르게 식어 만들어져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v038",
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
      "unit": "u04",
      "area": "지구",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "(화강암 / 현무암)을 이용한 예를 차례대로 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "제주도 돌담 / 불국사 석탑",
      "돌하르방 / 석굴암 불상",
      "제주도 맷돌 / 돌하르방",
      "불국사 돌계단 / 제주도 돌담",
      "석굴암 불상 / 불국사 돌계단"
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
    "explanation": "화강암은 불국사 돌계단·석굴암·석탑에, 현무암은 돌하르방·제주도 돌담·맷돌에 쓰여요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v039",
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
      "unit": "u04",
      "area": "지구",
      "element": "E2",
      "type": "T05",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화성암 두 개를 비교하려고 해요. ㄱ은 마그마가 땅속 깊은 곳에서 식어 만들어진 암석이고, ㄴ은 마그마가 지표 가까이에서 식어 만들어진 암석이에요. ㄱ과 ㄴ의 알갱이 크기를 비교하고, 그 까닭을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "ㄱ이 ㄴ보다 알갱이의 크기가 커요. ㄱ은 마그마가 땅속 깊은 곳에서 천천히 식었고, ㄴ은 지표 가까이에서 빠르게 식었기 때문이에요.",
      "rubric": {
        "required": [
          "ㄱ의 알갱이가 ㄴ보다 크다",
          "ㄱ은 천천히, ㄴ은 빠르게 식었다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "마그마가 천천히 식을수록 알갱이가 크게 자라요. 땅속 깊은 곳의 ㄱ은 천천히, 지표 가까이의 ㄴ은 빠르게 식었어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v040",
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
      "unit": "u04",
      "area": "지구",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산 활동이 우리 생활에 주는 이로움으로 옳은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "화산재가 쌓인 땅에서 농작물이 잘 자랍니다.",
      "화산 가스 때문에 눈과 목이 따끔거립니다.",
      "화산재가 두껍게 쌓여 집 지붕이 무너집니다.",
      "특이한 화산 지형을 보러 관광객이 찾아옵니다.",
      "용암이 흘러 마을로 가는 길이 막힙니다."
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
    "explanation": "화산재가 쌓인 땅은 기름져 농사에 도움이 되고, 화산 지형은 관광지가 돼요. 나머지는 화산 활동이 주는 피해예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v041",
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
      "unit": "u04",
      "area": "지구",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 화산 활동이 주는 이로움에 대한 설명이에요. 어떤 것에 대한 설명인지 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "화산 주변 땅속의 열로 데워진 따뜻한 물이 솟아나는 곳에서 목욕을 하거나 쉬어요.",
      "보기": [
        "ㄱ. 온천",
        "ㄴ. 지열 발전",
        "ㄷ. 수력 발전"
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
        "ㄱ.",
        "온천",
        "ㄱ. 온천"
      ]
    },
    "explanation": "화산 주변 땅속의 열로 데워진 물이 솟는 곳은 온천이에요. 지열 발전은 그 열로 전기를 만드는 것이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v042",
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
      "unit": "u04",
      "area": "지구",
      "element": "E4",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "□(은)는 땅이 지구 내부의 힘을 받아 끊어지면서 흔들리는 현상으로, 건물이 무너지거나 산사태가 일어나는 피해를 주기도 합니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "지진",
      "accepted": [
        "지진"
      ]
    },
    "explanation": "땅이 흔들리거나 갈라지는 현상은 지진이에요. 지진은 건물을 무너뜨리거나 산사태를 일으키기도 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v043",
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
      "unit": "u04",
      "area": "지구",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "우드록을 양손으로 밀어 보는 지진 발생 모형실험을 했어요. 실험 결과를 정리한 말로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "우드록을 밀면 휘어지지 않고 곧바로 끊어집니다.",
      "우드록이 끊어질 때 아무 소리도 나지 않습니다.",
      "우드록이 끊어지는 모습은 화산이 분출하는 모습입니다.",
      "실제 땅은 우드록보다 훨씬 큰 힘을 오랫동안 받습니다.",
      "우드록을 미는 손의 힘은 실제 바람의 힘을 나타냅니다."
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
    "explanation": "우드록은 휘어지다가 소리를 내며 끊어지고, 그때 떨림은 지진을 나타내요. 실제 땅은 지구 내부의 아주 큰 힘을 오랫동안 받아 끊어져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v044",
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
      "unit": "u04",
      "area": "지구",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지진이 일어날 수 있는 경우가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "화산이 분출할 때",
      "땅속의 빈 동굴이 무너질 때",
      "소나기가 한꺼번에 많이 내릴 때",
      "지표의 약한 부분이 무너질 때",
      "땅이 오랫동안 힘을 받아 끊어질 때"
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
    "explanation": "지진은 땅이 힘을 받아 끊어지거나, 동굴·약한 땅이 무너지거나, 화산이 분출할 때 일어나요. 소나기 같은 날씨로는 지진이 일어나지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v045",
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
      "unit": "u04",
      "area": "지구",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지진 피해 사례 조사 보고서를 쓰려고 해요. 보고서에 들어갈 내용으로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "지진이 일어난 곳",
      "지진의 규모",
      "그날 그 지역의 최고 기온",
      "지진이 일어난 날짜",
      "무너진 건물과 다친 사람의 수"
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
    "explanation": "지진 피해 사례는 언제, 어디서, 얼마나 강한(규모) 지진이 일어나 어떤 피해가 났는지를 조사해요. 기온은 지진과 관계가 없어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v046",
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
      "unit": "u04",
      "area": "지구",
      "element": "E5",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 뉴스에서는 지진의 세기를 '□ 4.8의 지진'처럼 숫자로 알려 줍니다.\n• □의 숫자가 클수록 강한 지진이며, 피해도 커질 수 있습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "규모",
      "accepted": [
        "규모"
      ]
    },
    "explanation": "규모는 지진의 세기를 숫자로 나타낸 것으로, 숫자가 클수록 강한 지진이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v047",
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
      "unit": "u04",
      "area": "지구",
      "element": "E5",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 한 나라에서 일어난 지진을 정리한 가상의 기록이에요. 가장 강한 지진이 일어난 곳을 쓰세요.",
    "givens": {
      "표": {
        "발생 지역": [
          "푸른 마을",
          "바다 마을",
          "산골 마을",
          "들판 마을"
        ],
        "규모": [
          "3.8",
          "5.3",
          "4.4",
          "2.9"
        ]
      }
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "바다 마을",
      "accepted": [
        "바다 마을",
        "바다마을"
      ]
    },
    "explanation": "규모의 숫자가 클수록 강한 지진이에요. 규모 5.3인 바다 마을의 지진이 가장 강해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v048",
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
      "unit": "u04",
      "area": "지구",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 한 나라에서 3년 동안 일어난 큰 지진을 정리한 가상의 기록이에요. 이 기록을 보고 알 수 있는 내용으로 옳지 않은 것을 고르세요.",
    "givens": {
      "표": {
        "발생 시기": [
          "첫째 해",
          "둘째 해",
          "셋째 해"
        ],
        "발생 지역": [
          "가람시",
          "나래군",
          "다솜시"
        ],
        "규모": [
          "4.9",
          "5.6",
          "4.1"
        ],
        "피해 내용": [
          "유리창 깨짐, 부상자 발생",
          "건물 무너짐, 부상자 발생, 이재민 발생",
          "담장 갈라짐"
        ]
      }
    },
    "choices": [
      "규모가 가장 큰 지진은 둘째 해에 일어났습니다.",
      "규모 5.0보다 강한 지진이 일어난 해도 있습니다.",
      "지진으로 다친 사람이 생긴 해가 있습니다.",
      "넷째 해부터는 이 나라에서 지진이 일어나지 않았습니다.",
      "규모가 가장 작은 지진은 셋째 해에 일어났습니다."
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
    "explanation": "기록에는 3년 동안의 지진만 있어서 넷째 해의 일은 알 수 없어요. 기록이 없다고 지진이 일어나지 않았다고 할 수는 없어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v049",
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
      "unit": "u04",
      "area": "지구",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "학교에서 지진이 났을 때 할 행동으로 옳은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "흔들리는 동안 책상 아래로 들어가 책상 다리를 꼭 잡습니다.",
      "흔들리는 동안 창문 옆에 서서 밖의 모습을 살핍니다.",
      "흔들림이 멈추면 승강기를 타고 1층으로 내려갑니다.",
      "흔들림이 멈추면 머리를 보호하며 계단으로 운동장에 나갑니다.",
      "운동장에 나가서는 건물 벽에 바짝 붙어 기다립니다."
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
    "explanation": "흔들리는 동안은 책상 아래에서 몸을 보호하고, 멈추면 머리를 보호하며 계단으로 넓은 곳에 대피해요. 창문·건물 벽 옆은 위험해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v050",
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
      "unit": "u04",
      "area": "지구",
      "element": "E6",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지진이 났을 때 지하철 안에 있다면 어떻게 행동해야 하는지 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 바로 비상문을 열고 선로로 뛰어내립니다.",
        "ㄴ. 손잡이나 기둥을 꼭 잡고, 열차가 멈추면 안내 방송에 따라 행동합니다.",
        "ㄷ. 흔들리는 동안 다른 칸으로 뛰어다니며 빈자리를 찾습니다."
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
        "ㄴ."
      ]
    },
    "explanation": "지하철 안에서는 넘어지지 않게 손잡이나 기둥을 잡고, 열차가 멈추면 안내 방송에 따라 움직여요. 함부로 선로에 내리면 위험해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v051",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "백두산과 한라산은 모두 어떤 지형에 속하는지 고르세요.",
    "givens": null,
    "choices": [
      "사막",
      "갯벌",
      "평야",
      "삼각주",
      "화산"
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
    "explanation": "백두산과 한라산은 모두 땅속의 마그마가 분출하여 생긴 화산이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v052",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "마그마가 분출하여 만들어진 우리나라의 화산으로, 꼭대기에 천지라는 호수가 있는 산을 고르세요.",
    "givens": null,
    "choices": [
      "설악산",
      "지리산",
      "북한산",
      "백두산",
      "태백산"
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
    "explanation": "백두산은 마그마가 분출하여 생긴 화산이고, 꼭대기의 분화구에 천지가 있어요. 설악산·지리산·북한산·태백산은 화산이 아니에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v053",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 화산 활동 모형실험에서 알루미늄 포일 윗부분을 조금 열어 둔 곳은 실제 화산의 □(을)를 나타냅니다.\n• 한라산 꼭대기의 백록담은 □에 물이 고여 만들어진 호수입니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "분화구",
      "accepted": [
        "분화구"
      ]
    },
    "explanation": "화산 꼭대기의 움푹 파인 곳을 분화구라고 해요. 모형실험에서 포일 윗부분을 열어 둔 곳이 분화구 역할을 하고, 백록담은 분화구에 물이 고인 호수예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v054",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산 활동 모형실험에서 ㉠ 포일 밖으로 흘러나오는 마시멜로와 ㉡ 피어오르는 연기는 실제 화산 분출물 중 무엇을 나타내는지 각각 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-용암, ㉡-화산 가스",
      "accepted": [
        "㉠-용암, ㉡-화산 가스",
        "㉠ 용암, ㉡ 화산 가스",
        "용암, 화산 가스",
        "용암, 화산가스",
        "㉠ 용암 ㉡ 화산가스"
      ]
    },
    "explanation": "흘러나오는 마시멜로는 액체인 용암을, 피어오르는 연기는 기체인 화산 가스를 나타내요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v055",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흘러내리다가 식으면 굳어서 암석이 되는 화산 분출물로, 액체 상태인 것을 고르세요.",
    "givens": null,
    "choices": [
      "화산 가스",
      "용암",
      "화산재",
      "화산 암석 조각",
      "수증기"
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
    "explanation": "용암은 액체 상태로 흘러내리다가 식어 굳으면 암석이 돼요. 화산재와 화산 암석 조각은 고체, 화산 가스와 수증기는 기체예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v056",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음에서 설명하는 화산 분출물은 무엇인지 쓰세요.",
    "givens": {
      "지문": "• 고체 상태입니다.\n• 화산이 분출할 때 하늘 높이 올라갔다가 바람을 타고 먼 곳까지 날아가 쌓이는 아주 고운 가루입니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "화산재",
      "accepted": [
        "화산재"
      ]
    },
    "explanation": "화산이 분출할 때 하늘 높이 올라갔다가 넓게 떨어져 쌓이는 고체 가루는 화산재예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v057",
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
      "unit": "u04",
      "area": "지구",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산 가스에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "액체 상태의 분출물입니다.",
      "크기가 2 mm 이하인 고체 가루입니다.",
      "대부분이 수증기로 이루어져 있습니다.",
      "식으면 굳어서 현무암이 됩니다.",
      "사람의 몸에 전혀 해롭지 않습니다."
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
    "explanation": "화산 가스는 기체 상태로, 대부분이 수증기이고 여러 가지 기체가 섞여 있어요. 해로운 기체가 있어 호흡기 질병을 일으키기도 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v058",
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
      "unit": "u04",
      "area": "지구",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "(마그마의 활동으로 만들어진 암석 / 마그마의 활동과 관계없이 만들어진 암석)을 차례대로 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "현무암 / 화강암",
      "이암 / 현무암",
      "사암 / 이암",
      "역암 / 화강암",
      "화강암 / 역암"
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
    "explanation": "화강암과 현무암은 마그마가 식어 만들어진 화성암이고, 이암·사암·역암은 퇴적물이 굳어 만들어진 퇴적암이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v059",
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
      "unit": "u04",
      "area": "지구",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화강암과 현무암에 대해 친구들이 한 말 중 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "화강암은 대체로 밝은 색깔이야.",
      "현무암 중에는 구멍이 없는 것도 있어.",
      "둘 다 마그마가 식어서 만들어진 암석이야.",
      "화강암은 여러 가지 색깔의 알갱이가 섞여 있어.",
      "현무암은 알갱이가 커서 하나하나 잘 보여."
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
    "explanation": "현무암은 빠르게 식어 알갱이가 매우 작아서 맨눈으로 잘 보이지 않아요. 알갱이가 커서 잘 보이는 것은 화강암이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v060",
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
      "unit": "u04",
      "area": "지구",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "괄호 ㉠과 ㉡에 들어갈 알맞은 말을 골라 각각 쓰세요.",
    "givens": {
      "지문": "현무암은 마그마가 지표 가까이에서 ㉠( 빠르게, 천천히 ) 식어서 알갱이가 작고, 화강암은 마그마가 땅속 깊은 곳에서 ㉡( 빠르게, 천천히 ) 식어서 알갱이가 큽니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-빠르게, ㉡-천천히",
      "accepted": [
        "㉠-빠르게, ㉡-천천히",
        "㉠ 빠르게, ㉡ 천천히",
        "빠르게, 천천히",
        "빠르게 천천히"
      ]
    },
    "explanation": "현무암은 마그마가 빠르게 식어 알갱이가 작고, 화강암은 천천히 식어 알갱이가 커요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v061",
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
      "unit": "u04",
      "area": "지구",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산 활동이 우리 생활에 주는 영향으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "화산 가스는 호흡기 질병을 일으킬 수 있습니다.",
      "화산 주변 땅속의 열로 난방을 할 수 있습니다.",
      "화산재가 햇빛을 가려 날씨가 변하기도 합니다.",
      "화산 활동은 피해만 줄 뿐 이로운 점은 없습니다.",
      "화산 지형은 관광지로 이용되기도 합니다."
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
    "explanation": "화산 활동은 피해도 주지만 온천·지열 발전·기름진 땅·관광지 같은 이로운 점도 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v062",
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
      "unit": "u04",
      "area": "지구",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지진 발생 모형실험에서 우드록이 끊어질 때 손에 느껴지는 떨림은 실제 자연에서 무엇을 나타내는지 고르세요.",
    "givens": null,
    "choices": [
      "태풍",
      "산사태",
      "화산 분출",
      "지진",
      "홍수"
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
    "explanation": "우드록은 땅, 미는 힘은 지구 내부에서 작용하는 힘, 끊어질 때의 떨림은 지진을 나타내요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v063",
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
      "unit": "u04",
      "area": "지구",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지진에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "지진은 화산이 있는 곳에서만 일어납니다.",
      "지진은 비가 많이 오는 여름에만 일어납니다.",
      "지진은 땅 위에 부는 강한 바람 때문에 일어납니다.",
      "지진은 땅이 힘을 받아 끊어지면서 흔들리는 것입니다.",
      "지진이 일어나도 땅이 갈라지는 일은 없습니다."
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
    "explanation": "지진은 땅이 지구 내부의 힘을 오랫동안 받다가 끊어지면서 흔들리는 것이에요. 화산이 없는 곳에서도 일어나요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v064",
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
      "unit": "u04",
      "area": "지구",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "가장 약한 지진을 고르세요.",
    "givens": null,
    "choices": [
      "규모 2.4의 지진",
      "규모 3.1의 지진",
      "규모 4.7의 지진",
      "규모 5.0의 지진",
      "규모 6.8의 지진"
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
    "explanation": "규모의 숫자가 작을수록 약한 지진이에요. 그래서 규모 2.4의 지진이 가장 약해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v065",
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
      "unit": "u04",
      "area": "지구",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지진 피해에 대한 설명으로 옳은 것을 <보기>에서 모두 골라 짝 지은 것을 고르세요.",
    "givens": {
      "보기": [
        "ㄱ. 우리나라에서는 지진이 일어난 적이 없어 피해를 걱정할 필요가 없습니다.",
        "ㄴ. 지진이 일어나면 건물이 무너지거나 도로가 갈라질 수 있습니다.",
        "ㄷ. 같은 규모의 지진이라도 미리 대비한 곳은 피해가 더 적을 수 있습니다."
      ]
    },
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
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
    "explanation": "지진은 건물·도로에 피해를 주고, 미리 대비하면 피해를 줄일 수 있어요. 우리나라에서도 지진이 일어난 적이 있어 대비해야 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v066",
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
      "unit": "u04",
      "area": "지구",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지진에 대비해 비상 가방에 넣어 둘 물건으로 알맞은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "손전등",
      "장난감 블록",
      "비상식량",
      "두꺼운 사전",
      "화분"
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
    "explanation": "비상 가방에는 손전등·비상식량·물·구급약·라디오처럼 대피할 때 꼭 필요한 물건을 넣어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v067",
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
      "unit": "u04",
      "area": "지구",
      "element": "E6",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "높은 건물 안에서 지진으로 흔들리다가 흔들림이 멈췄어요. 건물 밖으로 대피할 때 무엇을 이용해야 하는지 쓰고, 승강기를 이용하면 안 되는 까닭을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "계단을 이용해 대피해요. 지진으로 전기가 끊기면 승강기가 멈춰 그 안에 갇힐 수 있기 때문이에요.",
      "rubric": {
        "required": [
          "계단을 이용해 대피한다",
          "전기가 끊기면 승강기가 멈춰 갇힐 수 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "지진이 나면 전기가 끊겨 승강기가 멈출 수 있어요. 그래서 흔들림이 멈추면 계단으로 대피해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v068",
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
      "unit": "u04",
      "area": "지구",
      "element": "E6",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지진이 났을 때 건물 밖에 있다면 건물이나 담장에서 멀리 떨어져 운동장처럼 넓은 곳으로 가야 해요. 그 까닭을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "지진으로 흔들릴 때 건물의 유리창이나 간판이 떨어지거나 담장이 무너져서 다칠 수 있기 때문이에요.",
      "rubric": {
        "required": [
          "건물의 유리창·간판이 떨어지거나 담장이 무너진다",
          "그것에 맞아 다칠 수 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "흔들릴 때 건물에서 떨어지는 유리·간판이나 무너지는 담장에 다칠 수 있어요. 넓은 곳에는 떨어질 것이 없어 안전해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v069",
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
      "unit": "u04",
      "area": "지구",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지진으로 흔들림이 멈춘 뒤에 할 일로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "무너진 건물 안으로 다시 들어가 두고 온 물건을 찾습니다.",
      "라디오나 재난 방송의 안내에 따라 행동합니다.",
      "가스가 새는지 확인하려고 성냥불을 켜 봅니다.",
      "대피할 때는 승강기를 타고 빠르게 내려갑니다.",
      "흔들림이 멈췄으니 대피하지 않고 집 안에 그대로 있습니다."
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
    "explanation": "흔들림이 멈추면 불을 켜지 말고 계단으로 넓은 곳에 대피한 뒤, 라디오나 재난 방송의 안내에 따라 행동해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s42-u04-v070",
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
      "unit": "u04",
      "area": "지구",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지진에 강한 다리 모형을 만들어 시험해 보려고 해요. 모형을 만들 때 생각해야 할 것으로 적절하지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "흔들어도 무너지지 않는 구조는 무엇일까?",
      "모형을 만들기에 튼튼한 재료는 무엇일까?",
      "다리를 받치는 기둥은 어떻게 연결할까?",
      "모형이 흔들림을 잘 견디는지 어떻게 시험할까?",
      "모형을 얼마나 화려한 색으로 칠할까?"
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
    "explanation": "지진에 강한 모형은 흔들림을 견디는 구조·재료·시험 방법을 생각해야 해요. 색깔은 지진을 견디는 것과 관계가 없어요.",
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
