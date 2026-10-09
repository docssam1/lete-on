// 4-2 Ⅱ 물의 상태 변화 — 단원평가 원문 70문항(시매쓰DMC 최다빈출 단원평가 세트1·2·3·4). 시험지를 그대로 옮기고 정답 및 풀이와 대조했다.
// 원장 지시(2026-10-09): 원문을 그대로 문제은행에 쓴다. 그림은 시험지에서 잘라 낸 것(assets/bank/s42-u02/).
export const source = [
  {
    "id": "s42-u02-o1-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 1,
      "page": 1,
      "sourceId": "sci-42-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "액체 상태인 물의 성질 고르기",
      "concept": "물은 액체로 눈에 보이고 흐르며 모양이 일정하지 않아 손으로 잡을 수 없다."
    },
    "prompt": "물에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "단단합니다.",
      "흐르지 않습니다.",
      "모양이 일정합니다.",
      "눈에 보이지 않습니다.",
      "손으로 잡을 수 없습니다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "물은 눈에 보이지만 모양이 일정하지 않고, 흐르는 성질이 있어 손으로 잡을 수 없습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o1-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 2,
      "page": 1,
      "sourceId": "sci-42-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "고체 상태인 얼음의 성질 두 가지 고르기",
      "concept": "얼음은 고체로 차갑고 단단하며 모양이 일정해 손으로 잡을 수 있다."
    },
    "prompt": "얼음에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "차갑고 단단합니다.",
      "눈에 보이지 않습니다.",
      "일정한 모양이 없습니다.",
      "흐르는 성질이 있습니다.",
      "손으로 잡을 수 있습니다."
    ],
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        4
      ]
    },
    "explanation": "얼음은 고체 상태로, 모양이 일정하고 단단하며, 손으로 잡을 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o1-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 3,
      "page": 1,
      "sourceId": "sci-42-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물·얼음·수증기와 세 가지 상태 짝짓기",
      "concept": "물은 액체, 얼음은 고체, 수증기는 기체 상태이다."
    },
    "prompt": "물의 세 가지 상태를 바르게 짝 지은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 물 - 고체",
        "ㄴ. 얼음 - 액체",
        "ㄷ. 수증기 - 기체"
      ]
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
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
    "explanation": "물은 액체, 얼음은 고체, 수증기는 기체 상태입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o1-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 4,
      "page": 1,
      "sourceId": "sci-42-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물을 얼리는 시험관 실험의 목적 고르기",
      "concept": "물이 얼기 전과 후의 높이를 비교하면 물이 얼 때의 부피 변화를 알 수 있다."
    },
    "prompt": "위의 실험은 무엇을 알아보기 위한 것인지 고르세요.",
    "givens": {
      "지문": "다음 실험 과정을 보고, 물음에 답하세요. <실험 과정> 1. 플라스틱 시험관에 물을 반 정도 붓고 마개를 막은 뒤 검은색 유성 펜으로 물의 높이를 표시합니다. 2. 잘게 부순 얼음에 소금을 넣고 유리 막대로 잘 섞은 뒤 비커의 가운데에 플라스틱 시험관을 꽂아 물을 얼립니다. 3. 물이 완전히 얼면 플라스틱 시험관을 꺼내 물의 높이를 빨간색 유성 펜으로 표시합니다."
    },
    "choices": [
      "물이 어는 데 걸리는 시간",
      "소금이 녹는 데 걸리는 시간",
      "물이 얼기 전과 언 후의 무게 변화",
      "물이 얼기 전과 언 후의 부피 변화",
      "얼음이 녹기 전과 녹은 후의 부피 변화"
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "물이 얼기 전의 높이와 얼고 난 후의 높이를 비교한 것으로 물이 얼 때의 부피 변화를 확인하는 실험입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o1-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 5,
      "page": 1,
      "sourceId": "sci-42-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 얼 때 부피 변화 실험 설명 고르기",
      "concept": "물이 얼면 높이가 높아져 부피가 늘어나며, 시험관에 표시한 높이는 부피를 나타낸다."
    },
    "prompt": "위의 실험에 대한 설명으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "다음 실험 과정을 보고, 물음에 답하세요. <실험 과정> 1. 플라스틱 시험관에 물을 반 정도 붓고 마개를 막은 뒤 검은색 유성 펜으로 물의 높이를 표시합니다. 2. 잘게 부순 얼음에 소금을 넣고 유리 막대로 잘 섞은 뒤 비커의 가운데에 플라스틱 시험관을 꽂아 물을 얼립니다. 3. 물이 완전히 얼면 플라스틱 시험관을 꺼내 물의 높이를 빨간색 유성 펜으로 표시합니다.",
      "보기": [
        "ㄱ. 물이 얼면 무게가 줄어드는 것을 알 수 있습니다.",
        "ㄴ. 물이 얼기 전보다 물이 언 후 물의 높이가 낮아졌습니다.",
        "ㄷ. 플라스틱 시험관에 표시한 높이는 물의 부피를 나타냅니다."
      ]
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
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
    "explanation": "플라스틱 시험관에 표시한 물의 높이는 부피를 나타내며 물이 얼면 물의 높이가 높아지는 것으로 물의 부피가 늘어난 것을 알 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "ㄱ의 '알 수   있습니다'는 양쪽 정렬로 '수'와 '있' 사이 간격이 넓게 인쇄됨(단일 띄어쓰기로 옮김)."
    }
  },
  {
    "id": "s42-u02-o1-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 6,
      "page": 2,
      "sourceId": "sci-42-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음이 녹을 때 부피와 무게 변화 짝짓기",
      "concept": "얼음이 녹아 물이 되면 부피는 줄어들지만 무게는 변하지 않는다."
    },
    "prompt": "얼음이 녹을 때의 부피와 무게 변화를 바르게 짝 지은 것을 고르세요.",
    "givens": {
      "표": {
        "부피": [
          "줄어듦.",
          "줄어듦.",
          "늘어남.",
          "늘어남.",
          "변화 없음."
        ],
        "무게": [
          "늘어남.",
          "변화 없음.",
          "줄어듦.",
          "변화 없음.",
          "변화 없음."
        ]
      }
    },
    "choices": [
      "줄어듦. / 늘어남.",
      "줄어듦. / 변화 없음.",
      "늘어남. / 줄어듦.",
      "늘어남. / 변화 없음.",
      "변화 없음. / 변화 없음."
    ],
    "figure": null,
    "figureNote": "선택지가 '부피'·'무게' 두 열의 표로 인쇄됨(각 행 ①~⑤). choices에는 '부피 / 무게' 순으로 옮김.",
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
    "explanation": "얼음이 녹을 때 부피는 줄어들지만 무게는 변화가 없습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o1-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 7,
      "page": 2,
      "sourceId": "sci-42-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물을 얼렸다 녹인 뒤 시험관 무게 고르기",
      "concept": "물이 얼었다가 다시 녹아도 무게는 처음과 같다."
    },
    "prompt": "물이 들어 있는 시험관의 무게를 측정하였더니 17 g 이었습니다. 이 시험관을 냉동실에 넣어 물을 얼렸다가 다시 꺼내어 녹인 후 무게를 측정하였을 때 시험관의 무게로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "13 g",
      "14 g",
      "15 g",
      "16 g",
      "17 g"
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "물을 얼렸다가 다시 녹여도 무게는 변하지 않습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o1-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 8,
      "page": 2,
      "sourceId": "sci-42-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물 표면에서 수증기로 변하는 현상 이름",
      "concept": "물의 표면에서 액체인 물이 기체인 수증기로 변하는 현상을 증발이라고 한다."
    },
    "prompt": "물의 표면에서 액체인 물이 기체인 수증기로 상태가 변하는 현상을 무엇이라고 하는지 고르세요.",
    "givens": null,
    "choices": [
      "끓음",
      "마름",
      "얼음",
      "증발",
      "흡수"
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "물의 표면에서 액체인 물이 기체인 수증기로 변하는 현상을 증발이라고 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o1-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 9,
      "page": 2,
      "sourceId": "sci-42-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물을 가열할 때 나타나는 변화 두 가지",
      "concept": "물을 가열하면 끓으면서 물속에서 기포가 많이 생기고 끓은 뒤 물의 양이 줄어든다."
    },
    "prompt": "물을 가열할 때 나타나는 변화를 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "물이 끓습니다.",
      "아무런 변화가 없습니다.",
      "물이 끓은 후 물의 양이 줄어듭니다.",
      "물이 끓은 후 물의 양이 늘어납니다.",
      "물이 끓기 전에 물속에 큰 기포가 많이 생깁니다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "물을 가열하면 물이 끓고, 물이 끓은 후에는 물속에서 기포가 많이 생기며, 끓기 전보다 물의 양이 줄어듭니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o1-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 10,
      "page": 2,
      "sourceId": "sci-42-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "증발과 끓음의 공통점 고르기",
      "concept": "증발과 끓음은 모두 액체인 물이 기체인 수증기로 변하는 현상이다."
    },
    "prompt": "증발과 끓음의 공통점으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "수증기가 물로 상태가 변합니다.",
      "물이 수증기로 상태가 변합니다.",
      "물의 양이 매우 천천히 줄어듭니다.",
      "물 표면에서만 물의 상태가 변합니다.",
      "물 표면과 물속에서 물의 상태가 변합니다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "증발과 끓음은 모두 물이 수증기로 상태가 변하는 과정입니다. 증발은 물의 표면에서 액체인 물이 기체인 수증기로 상태가 변하는 것으로, 물의 양이 매우 천천히 줄어들고, 끓음은 물의 표면뿐만 아니라 물속에서도 액체인 물이 기체인 수증기로 상태가 변하는 현상으로, 물의 양이 매우 빠르게 줄어듭니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o1-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 11,
      "page": 2,
      "sourceId": "sci-42-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "차가운 컵 표면에 나타나는 변화 고르기",
      "concept": "차가운 컵 표면에 공기 중 수증기가 응결해 물방울이 맺히고 흘러내려 접시에 고인다."
    },
    "prompt": "위의 실험에서 시간이 지남에 따라 나타나는 변화를 모두 고르세요. (정답 2 개)",
    "givens": {
      "지문": "다음과 같이 플라스틱 컵에 주스와 얼음을 넣고 뚜껑을 덮은 후 은박 접시에 올려놓고 전자저울로 무게를 측정하였습니다. 물음에 답하세요."
    },
    "choices": [
      "은박 접시에 물이 고입니다.",
      "은박 접시에 주스가 고입니다.",
      "컵 안의 주스가 얼음으로 변합니다.",
      "컵 표면에 작은 물방울이 맺힙니다.",
      "컵 안의 주스가 새어 나와 컵 표면에 맺힙니다."
    ],
    "figure": "assets/bank/s42-u02/s1-q11.webp",
    "figureNote": "뚜껑 덮은 플라스틱 컵(주스와 얼음)을 은박 접시에 올려 전자저울 위에 놓은 그림. 실험 장치를 보여 줄 뿐 답을 고르는 데 필수는 아님.",
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
    "explanation": "플라스틱 컵에 주스와 얼음을 담고 관찰하면 시간이 지남에 따라 컵 표면에 물방울이 맺히고, 물방울이 은박 접시 위로 흘러 물이 고입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o1-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 12,
      "page": 3,
      "sourceId": "sci-42-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "응결 실험 전후 무게 비교",
      "concept": "공기 중 수증기가 컵 표면에 응결해 물방울로 맺히므로 나중 무게가 처음보다 늘어난다."
    },
    "prompt": "위의 실험 결과 처음 무게와 시간이 지난 뒤의 나중 무게를 비교한 것으로 옳은 것을 <보기>에서 골라 쓰세요.",
    "givens": {
      "지문": "다음과 같이 플라스틱 컵에 주스와 얼음을 넣고 뚜껑을 덮은 후 은박 접시에 올려놓고 전자저울로 무게를 측정하였습니다. 물음에 답하세요.",
      "보기": [
        "ㄱ. 처음 무게 > 나중 무게",
        "ㄴ. 처음 무게 < 나중 무게",
        "ㄷ. 처음 무게 = 나중 무게"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s42-u02/s1-q11.webp",
    "figureNote": "뚜껑 덮은 플라스틱 컵(주스와 얼음)을 은박 접시에 올려 전자저울 위에 놓은 그림. 실험 장치를 보여 줄 뿐 답을 고르는 데 필수는 아님.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ",
        "처음 무게 < 나중 무게"
      ]
    },
    "explanation": "시간이 지나면서 공기 중에 있던 수증기가 컵 표면에 달라붙어 물방울로 맺히기 때문에 무게가 늘어납니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o1-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 13,
      "page": 3,
      "sourceId": "sci-42-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "응결이 아닌 물방울 고르기",
      "concept": "고드름 끝 물방울은 얼음이 녹은 것이고, 풀잎·거미줄·유리창·냄비 뚜껑의 물방울은 수증기가 응결한 것이다."
    },
    "prompt": "물의 상태 변화가 나머지 넷과 다른 것을 고르세요.",
    "givens": null,
    "choices": [
      "풀잎에 맺힌 물방울",
      "거미줄에 맺힌 물방울",
      "유리창 안쪽에 맺힌 물방울",
      "냄비 뚜껑 안쪽에 맺힌 물방울",
      "처마의 고드름 끝에 맺힌 물방울"
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "처마의 고드름 끝에 맺힌 물방울은 고드름이 녹은 물입니다. ①~④는 수증기가 응결하여 생긴 작은 물방울이 맺힌 것입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '다른'에 밑줄이 그어져 있음(부정·예외 발문 강조)."
    }
  },
  {
    "id": "s42-u02-o1-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 14,
      "page": 3,
      "sourceId": "sci-42-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "음식을 찔 때 이용하는 물의 상태 변화",
      "concept": "음식을 찌는 것은 물이 끓어 수증기로 변하는 상태 변화를 이용한 것이다."
    },
    "prompt": "다음은 우리 생활에서 물의 상태 변화를 이용한 경우에 대한 설명입니다. 빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "음식을 찌는 것은 물이 [  ](으)로 변하는 상태 변화를 이용한 것입니다."
    },
    "choices": null,
    "figure": "assets/bank/s42-u02/s1-q14.webp",
    "figureNote": "김이 나는 찜기(뚜껑 덮인 큰 찜솥) 사진과 그 아래 빈칸 문장 상자. 사진은 상황 제시용이며 빈칸 문장만으로 답할 수 있음.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "수증기",
      "accepted": [
        "수증기"
      ]
    },
    "explanation": "음식을 찌는 것은 물이 수증기로 변하는 상태 변화를 이용한 것입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o1-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 15,
      "page": 3,
      "sourceId": "sci-42-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 얼음으로 변하는 현상 이용 예",
      "concept": "인공 눈은 물이 빠르게 얼어 얼음 알갱이가 되는 상태 변화를 이용한다."
    },
    "prompt": "물이 얼음으로 변하는 상태 변화를 이용한 예를 고르세요.",
    "givens": null,
    "choices": [
      "고추를 말립니다.",
      "인공 눈을 만듭니다.",
      "제습기를 사용합니다.",
      "스팀다리미로 다림질을 합니다.",
      "얼음주머니로 체온을 낮춥니다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "인공 눈은 물이 빠르게 얼어 얼음 알갱이가 되는 상태 변화를 이용한 것입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o2-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 1,
      "page": 1,
      "sourceId": "sci-42-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음과 물을 관찰한 결과 중 옳지 않은 것 찾기",
      "concept": "얼음은 고체로 단단하고 모양이 일정하며, 물은 액체로 눈에 보이지만 모양이 일정하지 않고 손에 잡히지 않는다."
    },
    "prompt": "얼음과 물을 관찰한 결과로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "얼음은 단단합니다.",
      "얼음은 차갑습니다.",
      "물은 손에 잡히지 않습니다.",
      "물은 눈에 보이지 않습니다.",
      "얼음은 일정한 모양이 있습니다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "얼음은 고체 상태로 단단하고 차가우며 일정한 모양이 있어 손으로 잡을 수 있습니다. 물은 액체 상태로 눈에 보이지만 일정한 모양이 없고 손에 잡히지 않습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o2-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 2,
      "page": 1,
      "sourceId": "sci-42-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "손바닥 위 얼음이 시간이 지나며 변하는 모습",
      "concept": "얼음은 손의 열을 받으면 녹아 액체인 물로 변한다."
    },
    "prompt": "얼음을 손바닥에 올려놓은 후 시간이 지나면서 관찰할 수 있는 모습을 고르세요.",
    "givens": null,
    "choices": [
      "얼음이 커집니다.",
      "얼음이 단단해집니다.",
      "아무런 변화가 없습니다.",
      "얼음이 녹아 물로 변합니다.",
      "얼음의 색깔이 검게 변합니다."
    ],
    "figure": "assets/bank/s42-u02/s2-q02.webp",
    "figureNote": "손바닥 위에 얼음 조각을 올려놓은 그림과 얼음을 확대한 원. 풀이에 필수는 아님.",
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
    "explanation": "얼음을 손바닥에 올려놓으면 손의 열에 의해 녹아 얼음의 크기가 점점 작아지고 액체인 물이 됩니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o2-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 3,
      "page": 1,
      "sourceId": "sci-42-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 액체에서 고체로 변한 예 고르기",
      "concept": "물이 얼면 액체에서 고체(얼음)로 상태가 변하고, 얼음이 녹으면 고체에서 액체로 변한다."
    },
    "prompt": "물이 액체 상태에서 고체 상태로 변한 경우를 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 컵에 담은 얼음이 녹아 물이 되었습니다.",
        "ㄴ. 운동장에 만든 눈사람이 녹아 물이 되었습니다.",
        "ㄷ. 얼음 틀에 넣은 물을 냉동실에 넣어 얼렸습니다."
      ]
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
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
    "explanation": "얼음이 녹아 물이 되는 것과 눈사람이 녹아 물이 되는 것은 물이 고체 상태에서 액체 상태로 변하는 것이고, 물이 어는 것은 물이 액체 상태에서 고체 상태로 변하는 것입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o2-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 4,
      "page": 1,
      "sourceId": "sci-42-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "시험관 물이 얼기 전후 높이 변화로 알 수 있는 사실",
      "concept": "물이 얼어 얼음이 되면 부피가 늘어난다."
    },
    "prompt": "위의 실험 결과를 통해 알 수 있는 내용을 고르세요.",
    "givens": {
      "지문": "다음은 시험관에 들어 있는 물이 얼기 전과 완전히 언 후의 높이를 나타낸 것입니다. 물음에 답하세요."
    },
    "choices": [
      "물이 얼면 부피가 줄어듭니다.",
      "물이 얼면 무게가 줄어듭니다.",
      "물이 얼면 부피가 늘어납니다.",
      "물이 얼면 무게가 늘어납니다.",
      "물이 얼어도 부피와 무게가 변하지 않습니다."
    ],
    "figure": "assets/bank/s42-u02/s2-q04.webp",
    "figureNote": "시험관 두 개 그림: '물이 얼기 전'(얼기 전 높이 표시)과 '물이 언 후'(얼기 전 높이 검은 선보다 위에 언 후 높이 빨간 선). 언 후 높이가 더 높다는 것을 그림에서 읽어야 함.",
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
    "explanation": "얼기 전과 얼고 난 후 물의 높이 변화로 물이 얼어 얼음이 되면 부피가 늘어나는 것을 알 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o2-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 5,
      "page": 1,
      "sourceId": "sci-42-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 얼 때 부피가 늘어나는 현상이 아닌 예 고르기",
      "concept": "바위가 쪼개지거나 페트병이 부푸는 것은 물이 얼 때 부피가 늘어나서이고, 얼음이 녹아 높이가 낮아지는 것은 얼음이 녹는 변화이다."
    },
    "prompt": "위의 실험 결과와 같은 원인으로 일어나는 현상이 아닌 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "다음은 시험관에 들어 있는 물이 얼기 전과 완전히 언 후의 높이를 나타낸 것입니다. 물음에 답하세요.",
      "보기": [
        "ㄱ. 겨울에 바위틈에 있던 물이 얼면 바위가 쪼개집니다.",
        "ㄴ. 페트병에 물을 가득 넣어 얼리면 페트병이 부풀어 오릅니다.",
        "ㄷ. 얼음 틀 위로 튀어나와 있던 얼음이 녹으면 높이가 낮아집니다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s42-u02/s2-q04.webp",
    "figureNote": "시험관 두 개 그림: '물이 얼기 전'(얼기 전 높이 표시)과 '물이 언 후'(얼기 전 높이 검은 선보다 위에 언 후 높이 빨간 선). 언 후 높이가 더 높다는 것을 그림에서 읽어야 함.",
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
    "explanation": "얼음 틀 위로 튀어나와 있던 얼음이 녹으면 높이가 낮아지는 것은 고체인 얼음이 액체인 물로 변하는 상태 변화입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o2-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 6,
      "page": 2,
      "sourceId": "sci-42-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음과자가 녹을 때 줄어든 부피와 같은 것",
      "concept": "물이 얼 때 늘어난 부피만큼 얼음이 녹을 때 부피가 줄어든다."
    },
    "prompt": "꽁꽁 언 튜브형 얼음과자를 녹였더니 부피가 줄어들어 빈 공간이 생겼습니다. 얼음과자가 녹을 때 줄어든 부피와 같은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 얼음과자가 얼 때 늘어난 부피",
        "ㄴ. 얼음과자가 얼 때 늘어난 무게",
        "ㄷ. 얼음과자가 얼 때 줄어든 부피",
        "ㄹ. 얼음과자가 얼 때 줄어든 무게"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s42-u02/s2-q06.webp",
    "figureNote": "튜브형 얼음과자가 얼어 있을 때(윗부분까지 가득)와 녹은 후(윗부분에 빈 공간) 그림과 확대 원. 문제 글로도 풀이 가능.",
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
    "explanation": "얼음과자가 얼어 얼음이 될 때 늘어난 부피와 녹을 때 줄어든 부피는 같습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o2-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 7,
      "page": 2,
      "sourceId": "sci-42-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음이 녹기 전과 녹은 후의 무게 비교",
      "concept": "얼음이 녹아 물이 되어도 무게는 변하지 않는다."
    },
    "prompt": "물이 얼어 있는 플라스틱 시험관을 따뜻한 물이 든 비커에 넣어 녹였을 때 ㈎얼음이 녹기 전과 ㈏얼음이 완전히 녹은 후의 무게를 비교한 것으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. ㈎ > ㈏",
        "ㄴ. ㈎ < ㈏",
        "ㄷ. ㈎ = ㈏"
      ]
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
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
    "explanation": "얼음이 녹기 전과 얼음이 완전히 녹은 후의 무게는 같습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "㈎·㈏는 PDF에서 괄호 안 가·나 기호(㈎㈏)로 인쇄됨; 프롬프트에서 '얼음이 녹기 전', '얼음이 완전히 녹은 후'에 밑줄이 있음."
    }
  },
  {
    "id": "s42-u02-o2-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 8,
      "page": 2,
      "sourceId": "sci-42-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "식품 건조기로 말린 과일 조각의 변화",
      "concept": "과일 속 물이 증발하면 크기가 작아지고 단맛이 강해지며 표면이 쭈글쭈글해진다."
    },
    "prompt": "식품 건조기에 넣어 말린 과일 조각의 변화를 설명한 것으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "물이 마릅니다.",
      "크기가 작아집니다.",
      "단맛이 더 강해집니다.",
      "표면이 더 촉촉해집니다.",
      "표면이 쭈글쭈글해집니다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "식품 건조기에 과일을 넣어 말리면 물이 증발하면서 크기가 작아지고 단맛이 더 강해지며 표면은 쭈글쭈글하게 변합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o2-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 9,
      "page": 2,
      "sourceId": "sci-42-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "증발과 관련된 예가 아닌 것 고르기",
      "concept": "풀잎에 물방울이 맺히는 것은 수증기가 물로 변하는 응결이고, 빨래·땀·젖은 길이 마르는 것은 증발이다."
    },
    "prompt": "증발과 관련된 예가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "빨래가 마릅니다.",
      "어항 속의 물이 조금씩 줄어듭니다.",
      "맑은 날 아침 풀잎에 물방울이 맺힙니다.",
      "운동 후 흘린 땀이 시간이 지나면 마릅니다.",
      "비가 온 뒤 젖어 있던 길이 시간이 지나면 마릅니다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "맑은 날 아침 풀잎에 물방울이 맺히는 것은 기체인 수증기가 액체인 물로 상태가 변하는 응결의 예입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o2-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 10,
      "page": 2,
      "sourceId": "sci-42-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물을 가열할 때 물속에 생기는 것의 이름",
      "concept": "물을 가열하면 물이 수증기로 변하면서 기포가 생기고, 끓으면 큰 기포가 많이 생긴다."
    },
    "prompt": "다음은 물이 든 비커를 가열하였을 때 나타나는 변화에 대한 설명입니다. 빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 물이 끓기 전에는 물속에 매우 작은 [    ](이)가 조금씩 생깁니다. • 물이 끓으면 큰 [    ](이)가 매우 많이 생깁니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "기포",
      "accepted": [
        "기포"
      ]
    },
    "explanation": "물이 끓기 전에는 물속에 매우 작은 기포가 생기다가 물이 끓으면 큰 기포가 매우 많이 생깁니다. 기포는 액체인 물이 기체인 수증기로 변하기 때문에 생기는 것입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "givens.지문의 [    ]는 PDF의 빈 네모 칸을 나타낸 것임."
    }
  },
  {
    "id": "s42-u02-o2-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 11,
      "page": 2,
      "sourceId": "sci-42-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "증발과 끓음에 대한 설명 중 옳지 않은 것",
      "concept": "증발과 끓음은 모두 물이 수증기로 변하는 현상이며, 증발은 표면에서 천천히, 끓음은 표면과 속에서 빠르게 일어난다."
    },
    "prompt": "증발과 끓음에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "끓음은 증발보다 빠르게 일어납니다.",
      "증발은 물의 표면에서만 상태가 변합니다.",
      "끓음은 물의 표면과 물속에서 상태가 변합니다.",
      "증발은 수증기가 물로 상태가 변하는 현상입니다.",
      "증발은 가열하지 않아도 상태 변화가 일어납니다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "증발과 끓음은 모두 액체인 물이 기체인 수증기로 상태가 변하는 현상입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o2-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 12,
      "page": 3,
      "sourceId": "sci-42-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음 주스 컵 표면 물방울 관찰 설명 중 틀린 것",
      "concept": "차가운 컵 표면에 맺히는 물방울은 공기 중 수증기가 응결한 것이며, 그만큼 무게가 늘어난다."
    },
    "prompt": "다음과 같이 플라스틱 컵에 주스와 얼음을 담고 시간이 지남에 따라 나타나는 변화를 관찰하였습니다. 이에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "컵 표면에 물방울이 맺힙니다.",
      "컵 표면의 물은 공기 중의 수증기가 변한 것입니다.",
      "시간이 지나면 컵의 무게가 처음보다 더 무거워집니다.",
      "표면에 맺힌 물방울이 흘러 은박 접시에 물이 고입니다.",
      "주스의 표면에서 물이 증발하여 컵 바깥쪽에 물방울이 맺힙니다."
    ],
    "figure": "assets/bank/s42-u02/s2-q12.webp",
    "figureNote": "은박 접시 위에 얼음과 주스를 담은 뚜껑 덮인 플라스틱 컵을 전자저울에 올려놓은 그림. 실험 장치 이해용, 풀이에 필수는 아님.",
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
    "explanation": "플라스틱 컵에 주스와 얼음을 담고 관찰하면 시간이 지남에 따라 컵 표면에 물방울이 맺히고, 물방울이 은박 접시 위로 흘러 물이 고입니다. 이로 인해 컵의 무게가 처음보다 더 무거워집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o2-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 13,
      "page": 3,
      "sourceId": "sci-42-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "거미줄에 맺힌 이슬이 생기는 까닭과 관련된 현상",
      "concept": "이슬은 공기 중의 수증기가 차가운 물체 표면에서 물방울로 응결한 것이다."
    },
    "prompt": "다음은 맑은 날 아침 거미줄에 맺힌 이슬의 모습입니다. 이와 같은 이슬이 생기는 까닭과 관련된 현상을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 증발",
        "ㄴ. 끓음",
        "ㄷ. 응결"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s42-u02/s2-q13.webp",
    "figureNote": "거미줄에 물방울(이슬)이 맺힌 사진. 문제 글로도 풀이 가능.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ",
        "응결"
      ]
    },
    "explanation": "이슬은 새벽에 차가워진 나뭇가지나 풀잎, 거미줄 등에 수증기가 작은 물방울로 변해 맺히는 것으로, 응결에 의한 현상입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o2-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 14,
      "page": 3,
      "sourceId": "sci-42-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 얼음으로 변하는 현상을 이용하지 않은 예",
      "concept": "얼음과자와 인공 눈은 물이 얼음이 되는 것을, 스팀청소기는 물이 수증기가 되는 것을 이용한다."
    },
    "prompt": "우리 생활에서 물이 얼음으로 상태가 변하는 현상을 이용한 예가 아닌 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. ▲얼음과자",
        "ㄴ. ▲스팀청소기",
        "ㄷ. ▲인공 눈"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s42-u02/s2-q14.webp",
    "figureNote": "<보기> 상자 안에 사진 3장: ㄱ 얼음과자, ㄴ 스팀청소기, ㄷ 인공 눈(제설기). 각 사진 아래 이름 캡션이 있어 캡션만으로 풀이 가능.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ",
        "스팀청소기"
      ]
    },
    "explanation": "스팀청소기는 물이 수증기로 상태가 변하는 것을 이용하는 예입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 사진 3장과 캡션(▲얼음과자, ▲스팀청소기, ▲인공 눈)으로 되어 있어 캡션 텍스트로 옮김."
    }
  },
  {
    "id": "s42-u02-o2-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 15,
      "page": 4,
      "sourceId": "sci-42-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "제습기가 이용하는 물의 상태 변화",
      "concept": "제습기는 공기 중 수증기를 물로 응결시켜 습기를 없앤다."
    },
    "prompt": "다음은 날씨가 습할 때 제습기를 이용하는 모습입니다. 제습기에서 이용하는 물의 상태 변화를 고르세요.",
    "givens": null,
    "choices": [
      "물 → 얼음",
      "얼음 → 물",
      "물 → 수증기",
      "수증기 → 물",
      "얼음 → 수증기"
    ],
    "figure": "assets/bank/s42-u02/s2-q15.webp",
    "figureNote": "손가락으로 제습기 상단 버튼을 누르는 사진. 풀이에 필수는 아님.",
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
    "explanation": "제습기는 공기 중의 수증기를 물로 변화시켜 습기를 제거하는 장치입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o3-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 1,
      "page": 1,
      "sourceId": "sci-42-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물과 얼음의 성질 중 옳지 않은 설명 고르기",
      "concept": "얼음은 모양이 일정하지만 물은 담는 그릇에 따라 모양이 변한다."
    },
    "prompt": "물과 얼음에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "얼음은 차갑습니다.",
      "얼음은 단단합니다.",
      "물은 손에 잡히지 않습니다.",
      "물은 일정한 모양이 없습니다.",
      "얼음은 담는 그릇에 따라 모양이 변합니다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "얼음은 단단하고, 모양이 있으며, 담는 그릇에 따라 모양이 변하지 않습니다. 물은 일정한 모양이 없어 담는 그릇에 따라 모양이 변합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o3-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 2,
      "page": 1,
      "sourceId": "sci-42-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "손바닥 위 얼음의 변화 중 옳지 않은 것",
      "concept": "손바닥 위 얼음은 녹아 물이 되고, 그 물은 시간이 지나면 증발해 사라진다."
    },
    "prompt": "얼음을 손바닥에 올려놓았을 때 나타나는 변화를 설명한 것으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 얼음이 녹아 물이 됩니다.",
        "ㄴ. 얼음을 올려놓은 손바닥이 차갑게 느껴집니다.",
        "ㄷ. 얼음이 녹아 손에 묻은 물은 시간이 지나도 그대로 있습니다."
      ]
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
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
    "explanation": "얼음을 손바닥에 올려놓으면 녹아서 물이 됩니다. 시간이 지나면 손에 묻은 물이 증발하여 손에서 사라집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o3-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 3,
      "page": 1,
      "sourceId": "sci-42-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물의 세 가지 상태에 대한 옳지 않은 설명",
      "concept": "물은 액체이지만 고체인 얼음이나 기체인 수증기로 상태가 변할 수 있다."
    },
    "prompt": "물의 상태에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "물은 액체입니다.",
      "물은 고체인 얼음이 되기도 합니다.",
      "물은 기체인 수증기가 되기도 합니다.",
      "물과 수증기는 일정한 모양이 없습니다.",
      "물은 서로 다른 상태로 변할 수 없습니다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "물은 액체 상태이지만 고체 상태인 얼음, 기체 상태인 수증기로 변할 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o3-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 4,
      "page": 1,
      "sourceId": "sci-42-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "고드름의 상태와 녹을 때의 변화",
      "concept": "고드름은 고체인 얼음이며 녹으면 액체인 물이 된다."
    },
    "prompt": "고드름에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "기체 상태입니다.",
      "고체 상태입니다.",
      "액체 상태입니다.",
      "고드름이 햇볕을 받아 녹으면 물이 됩니다.",
      "고드름이 햇볕을 받으면 길이가 길어집니다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "고드름은 물이 얼어 얼음이 된 것으로, 고체 상태입니다. 고드름은 햇볕을 받아 녹으면 물이 됩니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "문항 끝 '(정답 2개)'가 인쇄본에서 '(정 / 답 2개)'로 줄바꿈되어 있음."
    }
  },
  {
    "id": "s42-u02-o3-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 5,
      "page": 1,
      "sourceId": "sci-42-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 얼었을 때 시험관 속 높이 변화",
      "concept": "물이 얼어 얼음이 되면 부피가 늘어나 높이가 높아진다."
    },
    "prompt": "다음은 시험관에 물을 넣은 후 물의 높이를 표시한 것입니다. ㄱ과 ㄴ 중 얼음이 된 후의 높이로 알맞은 것을 골라 기호를 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s42-u02/s3-q05.webp",
    "figureNote": "물이 든 시험관 그림. 물 표면 높이에 검은 표시선이 있고, 그보다 위에 빨간 점선 ㄱ, 아래에 빨간 점선 ㄴ이 있음. ㄱ·ㄴ이 처음 물 높이의 위/아래 어느 쪽인지 알아야 답할 수 있으므로 필요함.",
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
    "explanation": "물이 얼어 얼음이 되면 부피가 늘어나므로 물의 높이가 높아집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o3-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 6,
      "page": 1,
      "sourceId": "sci-42-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "겨울철 수도관·수도 계량기가 터지는 까닭",
      "concept": "물이 얼면 부피가 늘어나 수도관이나 계량기를 터뜨릴 수 있다."
    },
    "prompt": "겨울철에 수도관이나 수도 계량기가 얼어서 터지는 까닭으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 수도관 안의 물이 증발하기 때문입니다.",
        "ㄴ. 수도관 안으로 물이 너무 빠르게 흐르기 때문입니다.",
        "ㄷ. 수도관 안으로 물이 너무 천천히 흐르기 때문입니다.",
        "ㄹ. 수도관을 지나던 물이 얼면서 부피가 늘어났기 때문입니다."
      ]
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
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
    "explanation": "겨울철에 기온이 내려가면서 수도관을 지나던 물이 얼어 부피가 늘어나면 수도관이나 수도 계량기가 터지기도 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o3-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 7,
      "page": 2,
      "sourceId": "sci-42-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음이 녹기 전후 높이 관찰 실험으로 알 수 있는 것",
      "concept": "얼음이 녹아 물이 되면 부피가 줄어든다."
    },
    "prompt": "물이 얼어 있는 플라스틱 시험관을 따뜻한 물에 넣어 얼음을 녹일 때 얼음이 녹기 전과 얼음이 완전히 녹은 후 물의 높이 변화를 관찰하였습니다. 이 실험으로 알 수 있는 내용을 고르세요.",
    "givens": null,
    "choices": [
      "얼음이 녹은 후 물의 높이가 높아집니다.",
      "얼음이 녹아도 물의 높이는 변하지 않습니다.",
      "얼음이 녹을 때의 색깔 변화를 알 수 있습니다.",
      "얼음이 녹을 때의 무게 변화를 알 수 있습니다.",
      "얼음이 녹을 때의 부피 변화를 알 수 있습니다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "얼음이 녹기 전과 얼음이 녹은 후의 부피 변화를 알아보는 실험으로 얼음이 녹아 물이 되면 부피가 줄어드는 것을 알 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o3-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 8,
      "page": 2,
      "sourceId": "sci-42-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음이 녹기 전 시험관의 무게 추론",
      "concept": "얼음이 녹아 물이 되어도 무게는 변하지 않는다."
    },
    "prompt": "물이 얼어 있는 플라스틱 시험관 안의 얼음이 완전히 녹은 후 시험관의 무게를 측정하였더니 15 g이었습니다. 얼음이 녹기 전 플라스틱 시험관의 무게에 대한 설명으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 15 g 입니다.",
        "ㄴ. 15 g 보다 가볍습니다.",
        "ㄷ. 15 g 보다 무겁습니다."
      ]
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
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
    "explanation": "얼음이 녹아 물로 상태가 변하여도 무게는 변하지 않습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'15 g'은 PDF에서 이미지로 조판되어 있음(띄어쓰기는 인쇄 모양대로: 프롬프트 '15 g이었습니다', 보기 '15 g 입니다' 등)."
    }
  },
  {
    "id": "s42-u02-o3-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 9,
      "page": 2,
      "sourceId": "sci-42-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "생활 속 부피 변화 예 중 나머지와 다른 것",
      "concept": "물이 얼면 부피가 늘고 얼음이 녹으면 부피가 줄어든다."
    },
    "prompt": "<보기>에서 물의 부피 변화가 나머지와 다른 것을 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 겨울철에 물을 담아 둔 장독 안의 물이 얼어 장독이 깨집니다.",
        "ㄴ. 꽁꽁 언 튜브형 얼음과자가 녹으면 용기 안에 공간이 생깁니다.",
        "ㄷ. 얼음 틀 안에 들어 있던 얼음을 바깥에 꺼내 놓으면 크기가 작아집니다.",
        "ㄹ. 물이 얼어 부푼 페트병을 냉동실에서 꺼내 놓으면 크기가 점점 작아집니다."
      ]
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
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
    "explanation": "장독 안의 물이 얼어 장독이 깨지는 것은 물이 얼어 부피가 늘어나는 예입니다. ㄴ, ㄷ, ㄹ은 얼음이 녹아 부피가 줄어드는 예입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o3-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 10,
      "page": 2,
      "sourceId": "sci-42-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "밀봉한 사과와 건조기에 말린 사과의 맛 비교와 까닭",
      "concept": "말린 사과는 속의 물이 증발해 수증기로 빠져나가 더 단맛이 난다."
    },
    "prompt": "다음과 같이 비슷한 크기로 얇게 썬 사과 조각의 반은 지퍼 백에 넣어 밀봉하고, 나머지 반은 식품 건조기에 넣어 말렸습니다. 두 사과 조각의 맛을 비교하여 쓰고, 그렇게 생각한 까닭을 물의 상태 변화와 관련지어 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s42-u02/s3-q10.webp",
    "figureNote": "▲지퍼 백에 넣은 사과 조각 / ▲식품 건조기에 말린 사과 조각 사진 두 장. 실험 상황 설명은 문항 글에 있어 그림 없이도 답할 수 있음.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "지퍼 백에 넣은 사과 조각보다 식품 건조기에 말린 사과 조각이 더 답니다. 그 까닭은 사과에 들어 있던 물이 수증기로 변해 공기 중으로 흩어졌기 때문입니다.",
      "rubric": {
        "required": [
          "말린 사과 조각이 더 달다",
          "사과 속 물이 수증기로 변해 공기 중으로 흩어졌다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "정답: 두 사과 조각의 맛을 비교하고, 그 까닭을 옳게 쓴 경우 (100%)",
          "부분 정답: 두 사과 조각의 맛만 옳게 비교하여 쓴 경우 (30%)"
        ]
      }
    },
    "explanation": "지퍼 백에 넣은 사과 조각은 마르지 않지만, 식품 건조기에서 말린 사과 조각은 물이 증발한 것입니다. 물이 증발한 사과가 더 답니다.\n[채점 기준] 정답: 두 사과 조각의 맛을 비교하고, 그 까닭을 옳게 쓴 경우 (100%) / 부분 정답: 두 사과 조각의 맛만 옳게 비교하여 쓴 경우 (30%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o3-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 11,
      "page": 2,
      "sourceId": "sci-42-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "수증기가 물로 변하는 현상의 이름",
      "concept": "기체인 수증기가 액체인 물로 변하는 현상을 응결이라고 한다."
    },
    "prompt": "다음에서 설명하는 것은 무엇인지 쓰세요.",
    "givens": {
      "지문": "기체인 수증기가 액체인 물로 상태가 변하는 현상"
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "응결",
      "accepted": [
        "응결"
      ]
    },
    "explanation": "기체인 수증기가 액체인 물로 상태가 변하는 현상을 응결이라고 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o3-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 12,
      "page": 2,
      "sourceId": "sci-42-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 끓을 때 나타나는 변화 고르기",
      "concept": "물이 끓으면 크고 작은 기포가 많이 생기고 기포가 터지며 물 표면이 울퉁불퉁해진다."
    },
    "prompt": "물이 든 비커를 가열하여 물이 끓을 때의 변화로 옳은 것을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "보기": [
        "ㄱ. 변화가 거의 없습니다.",
        "ㄴ. 매우 작은 기포가 조금씩 생깁니다.",
        "ㄷ. 크고 작은 기포가 연속해서 매우 많이 생깁니다.",
        "ㄹ. 물속의 기포가 올라와 터지면서 물 표면이 울퉁불퉁해집니다."
      ]
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ, ㄹ",
      "accepted": [
        "ㄷ, ㄹ",
        "ㄷ,ㄹ",
        "ㄷ ㄹ",
        "ㄹ, ㄷ"
      ]
    },
    "explanation": "물이 든 비커를 가열하면 처음부터 물이 끓기 전까지는 거의 변화가 없다가 시간이 지나면서 작은 기포가 조금씩 생깁니다. 물이 끓기 시작하면 크고 작은 기포가 계속 많이 생기고 물속의 기포가 올라와 터지면서 물 표면이 울퉁불퉁해집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o3-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 13,
      "page": 3,
      "sourceId": "sci-42-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물 표면과 물속에서 수증기로 변하는 현상의 이름",
      "concept": "물의 표면과 물속에서 물이 수증기로 변하는 현상을 끓음이라고 한다."
    },
    "prompt": "빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "물의 표면과 물속에서 액체인 물이 기체 수증기로 상태가 변하는 현상을 □(이)라고 합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "끓음",
      "accepted": [
        "끓음"
      ]
    },
    "explanation": "물의 표면과 물속에서 액체인 물이 기체인 수증기로 변하는 것을 끓음이라고 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "□는 인쇄본의 빈칸 상자. 문항 지문은 '기체 수증기로'(해설은 '기체인 수증기로')로 인쇄되어 있어 그대로 둠."
    }
  },
  {
    "id": "s42-u02-o3-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 14,
      "page": 3,
      "sourceId": "sci-42-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "증발과 끓음의 공통점과 차이점 중 옳지 않은 것",
      "concept": "끓을 때가 증발할 때보다 물의 양이 더 빠르게 줄어든다."
    },
    "prompt": "증발과 끓음에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "액체인 물이 기체인 수증기로 상태가 변하는 현상입니다.",
      "증발은 가열하지 않아도 물이 수증기로 변하는 현상입니다.",
      "증발은 물 표면에서 물이 수증기로 상태가 변하는 것입니다.",
      "물이 끓을 때에는 물이 수증기로 변한 기포가 많이 생깁니다.",
      "물이 증발할 때가 끓을 때보다 물의 양이 더 빠르게 줄어듭니다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "증발과 끓음은 물이 수증기로 변해 공기 중으로 흩어지는 현상입니다. 증발은 물 표면에서 물이 수증기로 변하는 현상이고, 끓음은 물 표면과 물속에서 물이 수증기로 변하는 현상입니다. 증발할 때보다 끓을 때 물의 양이 더 빠르게 줄어듭니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o3-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 15,
      "page": 3,
      "sourceId": "sci-42-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음 주스 컵의 무게가 늘어난 까닭이 되는 현상",
      "concept": "공기 중 수증기가 차가운 컵 표면에 응결해 물방울로 붙어 무게가 늘어난다."
    },
    "prompt": "다음과 같이 플라스틱 컵에 주스와 얼음을 넣고 뚜껑을 닫은 후 무게를 재었더니 처음 무게보다 시간이 지난 뒤의 무게가 늘어났습니다. 이와 관련된 현상을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 얼음이 녹아서 물로 상태가 변합니다.",
        "ㄴ. 물이 증발해서 수증기로 상태가 변합니다.",
        "ㄷ. 공기 중의 수증기가 응결해서 물로 상태가 변합니다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s42-u02/s3-q15.webp",
    "figureNote": "뚜껑 덮인 플라스틱 컵에 주스와 얼음이 들어 있고 전자저울 위에 놓인 그림. 상황은 문항 글에 설명되어 있어 그림 없이도 답할 수 있음.",
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
    "explanation": "공기 중의 수증기가 차가운 컵의 표면에서 응결하여 물로 상태가 변합니다. 이로 인해 컵의 무게가 더 무거워집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o3-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 16,
      "page": 3,
      "sourceId": "sci-42-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음 작품에서 물로 얼음 조각을 붙일 때의 상태 변화",
      "concept": "물이 얼어 얼음이 되면서 두 얼음 조각을 붙인다."
    },
    "prompt": "다음에서 이용한 물의 상태 변화는 무엇인지 고르세요.",
    "givens": {
      "지문": "얼음 작품을 만들 때 주사기에 든 물로 두 얼음 조각을 붙입니다."
    },
    "choices": [
      "물 → 얼음",
      "얼음 → 물",
      "물 → 수증기",
      "얼음 → 수증기",
      "수증기 → 얼음"
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "물이 얼면서 얼음 조각을 붙일 수 있게 됩니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o3-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 17,
      "page": 3,
      "sourceId": "sci-42-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "안경알이 뿌옇게 흐려질 때의 상태 변화",
      "concept": "공기 중 수증기가 차가운 안경알에 응결해 기체에서 액체로 변한다."
    },
    "prompt": "겨울철에 추운 곳에 있다가 따뜻한 실내로 들어가면 안경알 표면이 뿌옇게 흐려집니다. 이때 일어나는 물의 상태 변화로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "고체 → 액체",
      "액체 → 고체",
      "액체 → 기체",
      "기체 → 고체",
      "기체 → 액체"
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "겨울철에 추운 곳에 있다가 따뜻한 실내로 들어오면 차가운 안경알 표면에 작은 물방울이 맺혀 뿌옇게 흐려집니다. 이는 공기 중의 수증기(기체)가 차가운 안경의 표면에 응결해 물(액체)로 변한 것입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o3-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 18,
      "page": 4,
      "sourceId": "sci-42-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 얼음으로 변하는 것을 이용한 예가 아닌 것",
      "concept": "음식을 찌는 것은 물이 끓어 수증기가 되는 것을 이용한다."
    },
    "prompt": "물이 얼음으로 상태가 변하는 것을 이용한 예가 아닌 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. ▲음식을 찔 때",
        "ㄴ. ▲이글루를 만들 때",
        "ㄷ. ▲인공 눈을 만들 때"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s42-u02/s3-q18.webp",
    "figureNote": "<보기> 상자 안 사진 세 장: ㄱ. ▲음식을 찔 때(김이 나는 찜솥), ㄴ. ▲이글루를 만들 때, ㄷ. ▲인공 눈을 만들 때(제설기). 보기 내용은 캡션으로 전달되며 사진은 보조.",
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
    "explanation": "음식을 찌는 것은 물이 끓으면서 수증기로 상태가 변하는 것을 이용하는 예입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o3-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 19,
      "page": 4,
      "sourceId": "sci-42-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "가습기와 스팀청소기의 공통점",
      "concept": "가습기와 스팀청소기는 물이 수증기로 변하는 상태 변화를 이용한다."
    },
    "prompt": "다음은 우리 생활에서 물의 상태 변화를 이용한 예를 나타낸 것입니다. 두 도구의 공통점으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "바닥을 닦을 때 이용합니다.",
      "옷의 주름을 펼 때 이용합니다.",
      "물이 얼음으로 변하는 상태 변화를 이용한 것입니다.",
      "물이 수증기로 변하는 상태 변화를 이용한 것입니다.",
      "수증기가 물로 변하는 상태 변화를 이용한 것입니다."
    ],
    "figure": "assets/bank/s42-u02/s3-q19.webp",
    "figureNote": "▲가습기 / ▲스팀청소기 사진 두 장. 도구 이름이 그림 설명(캡션)에만 있으므로 캡션이 필요함(사진 자체는 보조).",
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
    "explanation": "가습기와 스팀청소기는 물이 수증기로 변하는 상태 변화를 이용한 것입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o3-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 20,
      "page": 4,
      "sourceId": "sci-42-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "공기 중 수증기를 물로 바꿔 습기를 없애는 도구",
      "concept": "제습기는 수증기를 물로 응결시켜 습기를 제거한다."
    },
    "prompt": "다음은 우리 생활에서 물의 상태 변화를 이용한 예에 대한 설명입니다. 빈칸에 들어갈 알맞은 말을 고르세요.",
    "givens": {
      "지문": "집 안이 습할 때 □(을)를 이용하면 공기 중의 수증기를 물로 변화시켜 습기를 제거할 수 있습니다."
    },
    "choices": [
      "부채",
      "가습기",
      "선풍기",
      "제습기",
      "공기청정기"
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "제습기는 공기 중의 수증기를 물로 변화시켜 습기를 제거하는 장치입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "□는 인쇄본의 빈칸 상자."
    }
  },
  {
    "id": "s42-u02-o4-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 1,
      "page": 1,
      "sourceId": "sci-42-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "모양과 촉감으로 얼음과 물 구별하기",
      "concept": "얼음(고체)은 모양이 일정하고, 물(액체)은 모양이 일정하지 않아 손으로 잡을 수 없다."
    },
    "prompt": "위의 ㈎와 ㈏는 얼음과 물 중 무엇에 해당하는지 각각 쓰세요. ㈎-( ), ㈏-( )",
    "givens": {
      "지문": "[01~02] 다음은 페트리 접시에 얼음과 물을 각각 담고 관찰한 결과를 표로 나타낸 것입니다. 물음에 답하세요.",
      "표": {
        "구분": [
          "모양",
          "손으로 만졌을 때의 특징"
        ],
        "㈎": [
          "모양이 일정함.",
          "㉠"
        ],
        "㈏": [
          "일정한 모양이 없음.",
          "손으로 잡을 수 없음."
        ]
      }
    },
    "choices": null,
    "figure": "assets/bank/s42-u02/s4-q01.webp",
    "figureNote": "[01~02] 공통 표: ㈎·㈏의 모양과 손으로 만졌을 때의 특징(㉠ 빈칸). 표 내용은 givens.표에 전사함. 답하는 데 필요.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㈎-얼음, ㈏-물",
      "accepted": [
        "㈎-얼음, ㈏-물",
        "(가)-얼음, (나)-물",
        "가-얼음, 나-물",
        "얼음, 물",
        "얼음 물",
        "㈎ 얼음, ㈏ 물"
      ]
    },
    "explanation": "얼음은 모양이 일정하고, 물은 모양이 일정하지 않으며 손으로 잡을 수 없습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o4-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 2,
      "page": 1,
      "sourceId": "sci-42-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음을 손으로 만졌을 때의 특징",
      "concept": "얼음은 손으로 만지면 차갑고 단단하다."
    },
    "prompt": "위의 빈칸 ㉠에 들어갈 특징으로 알맞은 것을 고르세요.",
    "givens": {
      "지문": "[01~02] 다음은 페트리 접시에 얼음과 물을 각각 담고 관찰한 결과를 표로 나타낸 것입니다. 물음에 답하세요.",
      "표": {
        "구분": [
          "모양",
          "손으로 만졌을 때의 특징"
        ],
        "㈎": [
          "모양이 일정함.",
          "㉠"
        ],
        "㈏": [
          "일정한 모양이 없음.",
          "손으로 잡을 수 없음."
        ]
      }
    },
    "choices": [
      "차갑고 단단합니다.",
      "따뜻하고 단단합니다.",
      "손에서 흘러내립니다.",
      "손에 잡히지 않습니다.",
      "따뜻하고 물렁물렁합니다."
    ],
    "figure": "assets/bank/s42-u02/s4-q01.webp",
    "figureNote": "[01~02] 공통 표: ㈎·㈏의 모양과 손으로 만졌을 때의 특징(㉠ 빈칸). 표 내용은 givens.표에 전사함. 답하는 데 필요.",
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
    "explanation": "얼음은 손으로 만지면 차갑고 단단한 것을 느낄 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o4-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 3,
      "page": 1,
      "sourceId": "sci-42-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "고드름이 녹고 떨어진 물방울이 마를 때의 상태 변화",
      "concept": "고체인 얼음은 녹아 액체인 물이 되고, 액체인 물은 증발하여 기체인 수증기가 된다."
    },
    "prompt": "고드름 끝에 물방울이 맺히고, 고드름에서 땅으로 떨어진 물방울이 시간이 지나면서 마를 때 일어나는 물의 상태 변화를 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "고체 상태인 고드름이 녹아 액체 상태인 물방울이 되고, 이 물방울이 땅에 떨어져 시간이 지나면 액체인 물이 기체인 수증기로 변해 공기 중으로 흩어집니다.",
      "rubric": {
        "required": [
          "고드름이 녹아 물방울이 된다",
          "땅에 떨어진 물이 수증기가 되어 흩어진다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "정답: 고드름이 녹아 물방울이 된 것과 땅에 떨어진 물이 수증기가 되는 것을 모두 옳게 쓴 경우 (100%)",
          "부분 정답: 고드름이 녹아 물방울이 된 것과 땅에 떨어진 물이 수증기가 되는 것 중 한 가지만 옳게 쓴 경우 (50%)"
        ]
      }
    },
    "explanation": "고체인 고드름이 녹아 액체인 물방울이 맺히고, 고드름에서 땅으로 떨어진 물은 시간이 지나면서 기체인 수증기로 변해 공기 중으로 흩어집니다.\n[채점 기준] 정답: 고드름이 녹아 물방울이 된 것과 땅에 떨어진 물이 수증기가 되는 것을 모두 옳게 쓴 경우 (100%) / 부분 정답: 고드름이 녹아 물방울이 된 것과 땅에 떨어진 물이 수증기가 되는 것 중 한 가지만 옳게 쓴 경우 (50%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o4-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 4,
      "page": 1,
      "sourceId": "sci-42-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "눈에 보이지 않고 모양이 없는 물의 상태",
      "concept": "기체인 수증기는 눈에 보이지 않고 일정한 모양이 없다."
    },
    "prompt": "다음에서 설명하는 것은 무엇인지 <보기>에서 골라 쓰세요.",
    "givens": {
      "지문": "• 눈에 보이지 않습니다. • 일정한 모양이 없습니다.",
      "보기": [
        "얼음",
        "물",
        "수증기"
      ]
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "수증기",
      "accepted": [
        "수증기"
      ]
    },
    "explanation": "수증기는 일정한 모양이 없고, 눈에 보이지 않습니다. 얼음과 물은 눈에 보입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o4-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 5,
      "page": 1,
      "sourceId": "sci-42-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 얼 때 부피와 무게의 변화",
      "concept": "물이 얼어 얼음이 되면 부피는 늘어나고 무게는 변하지 않는다."
    },
    "prompt": "다음은 물이 얼 때 부피와 무게 변화에 대한 설명입니다. 괄호 ㉠과 ㉡에 들어갈 알맞은 말을 골라 각각 쓰세요. ㉠-( ), ㉡-( )",
    "givens": {
      "지문": "물이 얼어 얼음이 되면 ㉠( 부피, 무게 )는 늘어나지만 ㉡( 부피, 무게 )는 변하지 않습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-부피, ㉡-무게",
      "accepted": [
        "㉠-부피, ㉡-무게",
        "㉠ 부피, ㉡ 무게",
        "부피, 무게",
        "부피 무게",
        "㉠ 부피 ㉡ 무게"
      ]
    },
    "explanation": "물이 얼어 얼음이 되면 부피는 늘어나지만 무게는 변하지 않습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o4-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 6,
      "page": 1,
      "sourceId": "sci-42-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "음료수가 가득 든 유리병을 얼리면 안 되는 까닭",
      "concept": "액체가 얼면 부피가 늘어나 가득 찬 유리병이 깨질 수 있다."
    },
    "prompt": "음료수가 가득 든 유리병을 냉동실에 넣으면 안 되는 까닭을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 음료수의 맛이 변하기 때문입니다.",
        "ㄴ. 음료수의 양이 줄어들기 때문입니다.",
        "ㄷ. 유리병 표면에 물방울이 맺히기 때문입니다.",
        "ㄹ. 음료수의 부피가 늘어나 병이 깨질 수 있기 때문입니다."
      ]
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
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
    "explanation": "음료수가 가득 든 유리병을 냉동실에 넣으면 음료수의 부피가 늘어나 유리병이 깨질 수 있기 때문에 음료수가 가득 든 유리병을 냉동실에 넣으면 안 됩니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o4-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 7,
      "page": 2,
      "sourceId": "sci-42-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음이 녹기 전과 후의 무게 비교",
      "concept": "얼음이 녹아 물이 되어도 무게는 변하지 않는다."
    },
    "prompt": "물이 얼어 있는 플라스틱 시험관을 따뜻한 물이 든 비커에 넣어 녹였을 때 시험관의 무게 변화를 옳게 설명한 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 얼음이 녹기 전의 무게와 얼음이 녹은 후의 무게는 같습니다.",
        "ㄴ. 얼음이 녹기 전의 무게가 얼음이 녹은 후의 무게보다 무겁습니다.",
        "ㄷ. 얼음이 녹은 후의 무게가 얼음이 녹기 전의 무게보다 무겁습니다."
      ]
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
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
    "explanation": "얼음이 녹기 전과 녹은 후의 무게는 변화가 없습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o4-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 8,
      "page": 2,
      "sourceId": "sci-42-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음이 녹아 부피가 줄어드는 생활 속 예",
      "concept": "얼음이 녹아 물이 되면 부피가 줄어든다."
    },
    "prompt": "얼음이 녹아 부피가 줄어드는 예로 적절한 것을 고르세요.",
    "givens": null,
    "choices": [
      "마당에 뿌린 물이 말랐습니다.",
      "새벽녘 풀잎에 이슬이 맺혔습니다.",
      "페트병의 물을 얼렸더니 페트병이 커졌습니다.",
      "주전자의 물을 가열하였더니 물속에서 기포가 생겼습니다.",
      "냉동실에서 꺼낸 얼음과자의 부피가 시간이 지나면서 줄어들었습니다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "냉동실에서 얼음과자를 꺼내놓으면 얼음과자가 녹아 부피가 줄어들기 때문에 튜브 안에 빈 공간이 생깁니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설의 '튜브 안에 빈 공간이 생깁니다'는 문항 ⑤ 보기('얼음과자의 부피가 … 줄어들었습니다')에 튜브 언급이 없어 문항과 표현이 조금 어긋남(원문 그대로 전사)."
    }
  },
  {
    "id": "s42-u02-o4-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 9,
      "page": 2,
      "sourceId": "sci-42-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "말린 사과 조각의 크기 변화와 증발",
      "concept": "사과 속 물이 증발하여 수증기로 흩어지므로 말린 사과 조각은 크기가 작아진다."
    },
    "prompt": "식품 건조기에 넣어 말린 사과 조각의 크기 변화를 물의 상태 변화와 관련지어 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "사과에 들어 있던 물이 수증기로 변해 공기 중으로 흩어졌기 때문에 식품 건조기로 말린 사과 조각의 크기가 작아집니다.",
      "rubric": {
        "required": [
          "사과 조각의 크기가 작아진다",
          "사과 속 물이 수증기로 변해 공기 중으로 흩어졌다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "정답: 사과 조각의 크기 변화와 사과 조각의 크기가 변한 까닭을 모두 옳게 쓴 경우 (100%)",
          "부분 정답: 사과 조각의 크기 변화와 사과 조각의 크기가 변한 까닭 중 한 가지만 옳게 쓴 경우 (50%)"
        ]
      }
    },
    "explanation": "식품 건조기에 말린 사과 조각은 마르기 전 사과 조각보다 크기가 작아집니다. 사과에 들어 있던 물이 수증기로 변해 공기 중으로 흩어졌기 때문입니다.\n[채점 기준] 정답: 사과 조각의 크기 변화와 사과 조각의 크기가 변한 까닭을 모두 옳게 쓴 경우 (100%) / 부분 정답: 사과 조각의 크기 변화와 사과 조각의 크기가 변한 까닭 중 한 가지만 옳게 쓴 경우 (50%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o4-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 10,
      "page": 2,
      "sourceId": "sci-42-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "생활 속 증발의 예 고르기",
      "concept": "증발은 액체인 물이 표면에서 기체인 수증기로 변하는 현상이다."
    },
    "prompt": "증발의 예로 옳은 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "냄비에 찌개를 끓입니다.",
      "고추를 말려서 보관합니다.",
      "젖은 머리카락이 마릅니다.",
      "얼음주머니에 물방울이 맺힙니다.",
      "손바닥에 올려놓은 얼음이 녹습니다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "증발은 액체인 물이 표면에서 기체인 수증기로 상태가 변하는 것으로, 고추를 말리거나 머리카락을 말리는 것은 증발의 예입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o4-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 11,
      "page": 2,
      "sourceId": "sci-42-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물을 가열할 때 나타나는 변화",
      "concept": "물을 가열하면 처음에는 표면에서 증발하다가 끓으면 물속에서도 수증기로 변한다."
    },
    "prompt": "물을 가열하였을 때의 변화로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "물이 수증기로 상태가 변합니다.",
      "처음에는 표면의 물이 천천히 증발합니다.",
      "물이 끓으면 물속에서도 물이 수증기로 변합니다.",
      "물을 계속 가열하면 물속에 큰 기포가 생깁니다.",
      "물이 끓을 때 물의 상태 변화는 나타나지 않습니다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "물이 끓으면 수증기로 상태가 변합니다. 처음에는 표면의 물이 천천히 증발하지만 계속 가열하면 큰 기포가 생기며 물속에서도 물이 수증기로 변합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o4-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 12,
      "page": 2,
      "sourceId": "sci-42-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "끓음의 뜻",
      "concept": "끓음은 물의 표면과 물속에서 모두 물이 수증기로 변하는 현상이다."
    },
    "prompt": "괄호에 들어갈 알맞은 말을 골라 쓰세요.",
    "givens": {
      "지문": "물의 표면뿐만 아니라 물속에서도 액체인 물이 기체인 수증기로 상태가 변하는 현상을 ( 증발, 끓음 )이라고 합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "끓음",
      "accepted": [
        "끓음"
      ]
    },
    "explanation": "끓음은 물의 표면뿐만 아니라 물속에서도 액체인 물이 기체인 수증기로 변하는 현상을 말합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o4-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 13,
      "page": 3,
      "sourceId": "sci-42-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음 주스 컵 표면의 변화 관찰",
      "concept": "공기 중의 수증기가 차가운 컵 표면에 닿으면 응결하여 물방울이 맺힌다."
    },
    "prompt": "다음과 같이 주스와 얼음을 넣은 플라스틱 컵에 나타나는 변화를 관찰한 결과로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "컵 안의 주스가 끓어오릅니다.",
      "컵 안의 주스가 꽁꽁 얼어붙습니다.",
      "플라스틱 컵 표면에 물방울이 맺힙니다.",
      "플라스틱 컵 표면에서 검은 연기가 납니다.",
      "컵 안 주스의 색깔이 푸른색으로 변합니다."
    ],
    "figure": "assets/bank/s42-u02/s4-q13.webp",
    "figureNote": "뚜껑 덮인 플라스틱 컵에 주황색 주스와 얼음이 들어 있고 받침 위에 놓인 그림. 문장에 상황이 설명되어 있어 답하는 데 꼭 필요하지는 않음.",
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
    "explanation": "공기 중의 수증기가 차가운 플라스틱 컵 표면에 닿아 응결하여 컵 표면에 물방울이 맺힙니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o4-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 14,
      "page": 3,
      "sourceId": "sci-42-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "응결의 뜻",
      "concept": "응결은 기체인 수증기가 액체인 물로 변하는 현상이다."
    },
    "prompt": "기체인 수증기가 액체인 물로 상태가 변하는 현상을 무엇이라고 하는지 고르세요.",
    "givens": null,
    "choices": [
      "고체",
      "끓음",
      "응결",
      "얼음",
      "증발"
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "기체인 수증기가 액체인 물로 상태가 변하는 현상을 응결이라고 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o4-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 15,
      "page": 3,
      "sourceId": "sci-42-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "응결과 관련 없는 현상 고르기",
      "concept": "물이 끓을 때 기포가 올라오는 것은 끓음이고, 차가운 표면에 물방울이 맺히는 것은 응결이다."
    },
    "prompt": "응결과 관련된 현상으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "새벽에 풀잎에 물방울이 맺힙니다.",
      "이른 아침 호수 위에 안개가 낍니다.",
      "추운 겨울 유리창 안쪽에 물방울이 맺힙니다.",
      "욕실의 차가운 거울 표면에 물방울이 맺힙니다.",
      "냄비 안의 물이 끓을 때 물속의 기포가 위로 올라옵니다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "냄비 안의 물이 끓을 때 물속에서 기포가 생기고 기포가 위로 올라오는 것은 끓음에 의한 현상입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o4-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 16,
      "page": 3,
      "sourceId": "sci-42-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "거미줄에 물방울이 맺힐 때의 상태 변화",
      "concept": "거미줄에 맺힌 물방울은 공기 중의 수증기가 물로 응결한 것이다."
    },
    "prompt": "맑은 날 아침 거미줄에 물방울이 맺힐 때 일어나는 물의 상태 변화를 고르세요.",
    "givens": null,
    "choices": [
      "물 → 얼음",
      "얼음 → 물",
      "물 → 수증기",
      "수증기 → 물",
      "얼음 → 수증기"
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "맑은 날 아침 거미줄에 물방울이 맺히는 것은 응결에 의한 현상으로, 응결은 공기 중의 수증기가 물로 상태가 변하는 것입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o4-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 17,
      "page": 3,
      "sourceId": "sci-42-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물의 상태 변화 이용 예 중 다른 하나 고르기",
      "concept": "얼음 작품은 물이 얼음으로 변하는 것을, 찜·가습기·스팀 기구는 물이 수증기로 변하는 것을 이용한다."
    },
    "prompt": "물의 상태 변화를 이용한 예가 나머지 넷과 다른 것을 고르세요.",
    "givens": null,
    "choices": [
      "만두를 찝니다.",
      "가습기를 사용합니다.",
      "스팀청소기로 바닥을 닦습니다.",
      "물을 얼려서 얼음 작품을 만듭니다.",
      "스팀다리미를 이용해 옷의 주름을 폅니다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "물을 얼려 얼음 작품을 만드는 것은 액체인 물이 고체인 얼음으로 변하는 것을 이용한 예입니다. ①, ②, ③, ⑤는 액체인 물이 기체인 수증기로 변하는 것을 이용한 예입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o4-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 18,
      "page": 3,
      "sourceId": "sci-42-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "스팀다리미가 이용하는 물의 상태 변화",
      "concept": "스팀다리미는 물이 수증기로 변하는 것을 이용한다."
    },
    "prompt": "빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "스팀다리미는 우리 생활에서 물이 [ ](으)로 변하는 것을 이용한 예입니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "수증기",
      "accepted": [
        "수증기"
      ]
    },
    "explanation": "스팀다리미는 우리 생활에서 물이 수증기로 변하는 것을 이용한 예입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o4-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 19,
      "page": 4,
      "sourceId": "sci-42-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음주머니로 체온을 낮출 때 이용하는 상태 변화",
      "concept": "얼음이 녹아 물이 될 때 주변의 열을 빼앗아 체온을 낮춘다."
    },
    "prompt": "열이 날 때 얼음주머니로 체온을 낮추는 것은 물의 어떤 상태 변화를 이용하는 것인지 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 얼음이 물로 변하는 상태 변화를 이용합니다.",
        "ㄴ. 물이 수증기로 변하는 상태 변화를 이용합니다.",
        "ㄷ. 수증기가 물로 변하는 상태 변화를 이용합니다.",
        "ㄹ. 물의 온도를 낮추면 물이 얼게 되는 성질을 이용합니다."
      ]
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
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
    "explanation": "얼음이 물로 상태 변화하면서 열을 빼앗기 때문에 높았던 체온이 내려갑니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s42-u02-o4-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 20,
      "page": 4,
      "sourceId": "sci-42-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "나만의 가습기 재료의 조건",
      "concept": "가습기 재료는 물을 잘 흡수하고 그 물을 잘 증발시켜야 한다."
    },
    "prompt": "다음은 나만의 가습기 만들기에 대한 설명입니다. 괄호에 들어갈 알맞은 말을 골라 쓰세요.",
    "givens": {
      "지문": "가습기를 만들 때는 물을 잘 흡수하고 ( 끓음, 증발, 응결 )(이)가 잘 되는 재료를 사용합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "증발",
      "accepted": [
        "증발"
      ]
    },
    "explanation": "가습기를 만들 때는 물을 잘 흡수하고, 흡수한 물을 잘 증발시키는 재료를 사용해야 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  }
];
