// 4-2 Ⅴ 물의 여행 — 단원평가 원문 45문항(시매쓰DMC 최다빈출 단원평가 세트1·2·3). 시험지를 그대로 옮기고 정답 및 풀이와 대조했다.
// 원장 지시(2026-10-09): 원문을 그대로 문제은행에 쓴다. 그림은 시험지에서 잘라 낸 것(assets/bank/s42-u05/).
export const source = [
  {
    "id": "s42-u05-o1-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 1,
      "page": 1,
      "sourceId": "sci-42-5-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물의 순환의 뜻",
      "concept": "물이 상태를 바꾸며 육지·바다·공기·생명체 사이를 끊임없이 돌고 도는 것을 물의 순환이라고 한다."
    },
    "prompt": "다음에서 설명하는 것이 무엇인지 쓰세요.",
    "givens": {
      "지문": "물이 상태가 변하면서 육지, 바다, 공기, 생명체 사이를 끊임없이 이동하는 것"
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
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
    "explanation": "물은 상태가 변하면서 육지, 바다, 공기, 생명체 사이를 끊임없이 이동하는데, 이것을 물의 순환이라고 합니다.",
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
    "id": "s42-u05-o1-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 2,
      "page": 1,
      "sourceId": "sci-42-5-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "기체 상태로 이동하는 물",
      "concept": "강의 물이 증발하면 기체인 수증기가 되어 공기 중으로 올라간다."
    },
    "prompt": "물의 순환 과정 중 물이 기체 상태로 바뀌어 이동하는 경우를 고르세요.",
    "givens": null,
    "choices": [
      "땅속에서 지하수로 흐를 때",
      "비가 되어 강으로 떨어질 때",
      "강에서 공기 중으로 올라갈 때",
      "식물이 땅속의 물을 빨아들일 때",
      "수도관을 거쳐 사람의 몸속으로 들어갈 때"
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
    "explanation": "강에 있는 물에서 증발한 수증기가 공기 중으로 올라갑니다.",
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
    "id": "s42-u05-o1-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 3,
      "page": 1,
      "sourceId": "sci-42-5-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "식물을 통한 물의 순환",
      "concept": "식물은 뿌리로 땅속의 물을 흡수해 몸속에서 순환시키고, 잎을 통해 수증기로 공기 중에 내보낸다."
    },
    "prompt": "식물을 통해서 일어나는 물의 순환 과정을 두 가지 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s42-u05/s1-q03.webp",
    "figureNote": "들판에 서 있는 큰 나무 한 그루 사진(뒤로 물가가 보임).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "땅속으로 스며든 물을 식물이 빨아들이고, 빨아들인 물은 식물체 내에서 순환합니다. 또한, 식물의 잎에서 수증기가 나옵니다.",
      "rubric": {
        "required": [
          "뿌리로 땅속의 물을 빨아들인다",
          "빨아들인 물이 식물 몸속을 돌거나 잎에서 수증기로 나간다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "정답: 뿌리에서 물의 흡수, 식물체 내에서 순환, 잎에서 수증기 배출 등 두 가지를 쓴 경우 (100%)",
          "부분 정답: 뿌리에서 물의 흡수, 식물체 내에서 순환, 잎에서 수증기 배출 중 한 가지만 쓴 경우 (50%)"
        ]
      }
    },
    "explanation": "식물은 생명을 유지하기 위해서 뿌리를 통해 땅속의 물을 흡수하고, 흡수된 물은 식물체를 순환합니다. 또한, 생명 활동 과정에서 잎을 통해 공기 중으로 수증기를 내보냅니다.\n[채점 기준] 정답: 뿌리에서 물의 흡수, 식물체 내에서 순환, 잎에서 수증기 배출 등 두 가지를 쓴 경우 (100%) / 부분 정답: 뿌리에서 물의 흡수, 식물체 내에서 순환, 잎에서 수증기 배출 중 한 가지만 쓴 경우 (50%)",
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
    "id": "s42-u05-o1-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 4,
      "page": 1,
      "sourceId": "sci-42-5-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물의 순환에서 응결 과정",
      "concept": "공기 중의 수증기가 응결해 작은 물방울이나 얼음 알갱이가 되어 떠 있는 것이 구름이다."
    },
    "prompt": "㈎~㈑ 과정 중 응결이 일어나는 과정을 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[04~05] 다음은 물의 순환 과정을 나타낸 것입니다. 물음에 답하세요."
    },
    "choices": null,
    "figure": "assets/bank/s42-u05/s1-q04.webp",
    "figureNote": "물의 순환 과정 그림: 산, 강·호수, 나무, 구름, 해가 그려져 있음. ㈎ 호수 물에서 붉은 물결 화살표가 위로 올라감(증발), ㈏ 나무 잎에서 붉은 물결 화살표가 위로 올라감, 큰 흰 화살표가 위로 올라가 ㈐ 구름 옆 화살표(구름이 만들어짐)로 이어짐, 산 위 구름에서 비·눈이 내려 흰 화살표로 강·호수로 흘러감, ㈑ 땅속으로 물이 스며드는 아래쪽 화살표. 땅속 지하수 화살표와 나무뿌리 쪽 화살표도 있음. 그림 속 기호는 (가)~(라).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㈐",
      "accepted": [
        "㈐",
        "(다)",
        "다"
      ]
    },
    "explanation": "구름은 공기 중에 작은 물방울이나 얼음 알갱이가 떠 있는 것입니다. 따라서 구름이 만들어지는 ㈐ 과정에서 공기 중의 수증기가 응결합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "그림 속 기호는 (가)~(라)로 인쇄되어 있고 문항 문장은 ㈎~㈑로 인쇄됨."
    }
  },
  {
    "id": "s42-u05-o1-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 5,
      "page": 1,
      "sourceId": "sci-42-5-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물의 순환 과정 순서",
      "concept": "강에서 증발한 수증기가 응결해 구름이 되고, 구름에서 내린 비나 눈이 다시 강으로 흘러간다."
    },
    "prompt": "다음은 물의 순환 과정 중 일부 과정을 정리한 것입니다. 빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 바르게 짝 지은 것을 고르세요.",
    "givens": {
      "지문": "[04~05] 다음은 물의 순환 과정을 나타낸 것입니다. 물음에 답하세요.\n강 → 공기 중의 수증기 → ㉠ → ㉡ → 강"
    },
    "choices": [
      "구름 / 지하수",
      "구름 / 비나 눈",
      "지하수 / 구름",
      "비나 눈 / 구름",
      "비나 눈 / 물고기"
    ],
    "figure": "assets/bank/s42-u05/s1-q04.webp",
    "figureNote": "물의 순환 과정 그림: 산, 강·호수, 나무, 구름, 해가 그려져 있음. ㈎ 호수 물에서 붉은 물결 화살표가 위로 올라감(증발), ㈏ 나무 잎에서 붉은 물결 화살표가 위로 올라감, 큰 흰 화살표가 위로 올라가 ㈐ 구름 옆 화살표(구름이 만들어짐)로 이어짐, 산 위 구름에서 비·눈이 내려 흰 화살표로 강·호수로 흘러감, ㈑ 땅속으로 물이 스며드는 아래쪽 화살표. 땅속 지하수 화살표와 나무뿌리 쪽 화살표도 있음. 그림 속 기호는 (가)~(라).",
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
    "explanation": "강에서 증발한 수증기가 공기 중에서 응결하여 구름이 되고, 구름에서 내리는 비나 눈이 다시 강으로 흘러갑니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기는 표 형식(열 머리: ㉠ / ㉡). 정리 상자는 「강 → 공기 중의 수증기 → [㉠]」 줄바꿈 「→ [㉡] → 강」으로 인쇄됨."
    }
  },
  {
    "id": "s42-u05-o1-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 6,
      "page": 2,
      "sourceId": "sci-42-5-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물의 순환의 특징",
      "concept": "물은 상태와 위치를 바꾸며 끊임없이 순환하고, 그 과정에서 지구 전체 물의 양은 변하지 않는다."
    },
    "prompt": "물의 순환에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "물은 끊임없이 순환합니다.",
      "물의 순환은 육지에서만 일어납니다.",
      "땅속에서는 물이 순환하지 않습니다.",
      "물이 순환할 때는 물의 상태가 변하지 않습니다.",
      "물의 순환으로 지구 전체 물의 양이 점점 줄어듭니다."
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
    "explanation": "물은 끊임없이 상태나 위치가 변하면서 순환합니다. 물의 순환 과정에서 물의 양은 변하지 않으므로 지구 전체 물의 양은 유지됩니다.",
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
    "id": "s42-u05-o1-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 7,
      "page": 2,
      "sourceId": "sci-42-5-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물의 이용 - 음식 보관",
      "concept": "물을 얼린 얼음을 이용하면 생선 같은 음식물을 신선하게 보관할 수 있다."
    },
    "prompt": "다음은 물을 어떻게 이용하고 있는 것인지 고르세요.",
    "givens": null,
    "choices": [
      "식수로 마십니다.",
      "전기를 만듭니다.",
      "농작물을 재배합니다.",
      "관광 자원으로 이용합니다.",
      "음식을 신선하게 보관합니다."
    ],
    "figure": "assets/bank/s42-u05/s1-q07.webp",
    "figureNote": "잘게 간 얼음 위에 놓인 생선 두 마리 사진.",
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
    "explanation": "물을 얼려 만든 얼음으로 음식물을 신선하게 보관할 수 있습니다.",
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
    "id": "s42-u05-o1-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 8,
      "page": 2,
      "sourceId": "sci-42-5-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물의 이용",
      "concept": "물은 끊임없이 순환하므로 한 번 이용한 물도 다시 이용할 수 있다."
    },
    "prompt": "물의 이용에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "물을 이용하여 불을 끌 수 있습니다.",
      "생물이 생명을 유지하기 위해 이용합니다.",
      "한 번 이용한 물은 다시 이용할 수 없습니다.",
      "물건을 운반하는 운송 수단으로 이용합니다.",
      "동물이 마신 물은 동물의 몸속을 순환하고 밖으로 빠져나옵니다."
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
    "explanation": "물은 끊임없이 순환하기 때문에 한 번 이용한 물도 이후에 다시 이용할 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「않은」에 밑줄."
    }
  },
  {
    "id": "s42-u05-o1-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 9,
      "page": 2,
      "sourceId": "sci-42-5-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물의 이용 - 전기 생산",
      "concept": "댐처럼 높은 곳에서 떨어지는 물의 힘을 이용해 전기를 만들 수 있다."
    },
    "prompt": "다음은 물을 이용하는 모습입니다. 괄호에 들어갈 알맞은 말을 골라 쓰세요.",
    "givens": {
      "지문": "높은 곳에서 떨어지는 물을 이용하여 우리 생활에 필요한 ( 전기, 음식 )(을)를 만들 수 있습니다."
    },
    "choices": null,
    "figure": "assets/bank/s42-u05/s1-q09.webp",
    "figureNote": "댐의 수문에서 물이 쏟아져 내려 물보라가 이는 사진.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "전기",
      "accepted": [
        "전기"
      ]
    },
    "explanation": "높은 곳에서 떨어지는 물을 이용하여 우리 생활에 필요한 전기를 만들 수 있습니다.",
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
    "id": "s42-u05-o1-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 10,
      "page": 2,
      "sourceId": "sci-42-5-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물이 중요한 까닭",
      "concept": "물은 모든 생물의 생명 유지에 꼭 필요하고, 사람은 생활 속 여러 곳에서 물을 이용해 필요한 것을 얻는다."
    },
    "prompt": "물이 중요한 까닭으로 옳은 것을 <보기>에서 모두 골라 짝 지은 것은?",
    "givens": {
      "보기": [
        "ㄱ. 식물이 자라는 데 필요하기 때문입니다.",
        "ㄴ. 우리 생활에서 물을 이용해 필요한 것을 얻기 때문입니다.",
        "ㄷ. 동물의 몸속을 순환하면서 생명을 유지시켜 주기 때문입니다."
      ]
    },
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
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
    "explanation": "물은 모든 생물이 생명을 유지하는 데 반드시 필요합니다. 우리는 생활하면서 다양한 곳에 물을 이용하고, 물을 이용해 필요한 것을 얻기도 합니다.",
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
    "id": "s42-u05-o1-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 11,
      "page": 2,
      "sourceId": "sci-42-5-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물 부족 현상의 원인",
      "concept": "물이 순환해도 지구 전체 물의 양은 변하지 않으므로, 물 부족은 전체 물의 양이 줄어서 생기는 것이 아니다."
    },
    "prompt": "물 부족 현상의 원인으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "물을 아껴 쓰지 않기 때문입니다.",
      "인구 증가로 물 이용량이 많아졌기 때문입니다.",
      "산업 발달로 지구 전체 물의 양이 줄어들었기 때문입니다.",
      "물이 오염되어 이용할 수 있는 물의 양이 줄어들었기 때문입니다.",
      "지역이나 기후에 따라 이용할 수 있는 물의 양이 다르기 때문입니다."
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
    "explanation": "물은 순환하면서 위치나 상태는 변하지만 그 양은 변하지 않기 때문에 지구 전체 물의 양은 변하지 않습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「않은」에 밑줄."
    }
  },
  {
    "id": "s42-u05-o1-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 12,
      "page": 3,
      "sourceId": "sci-42-5-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "이용할 수 있는 물이 적은 까닭",
      "concept": "지구의 물은 대부분 바로 쓰기 어려운 바닷물이어서, 쉽게 이용할 수 있는 물은 전체의 1 %도 되지 않는다."
    },
    "prompt": "지구에는 많은 양의 물이 있지만 우리가 이용할 수 있는 물의 양은 많지 않습니다. 그 까닭을 지구에서 물의 분포와 관련지어 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "지구의 물은 대부분 이용하기 어려운 바닷물이 차지하고 있기 때문입니다.",
      "rubric": {
        "required": [
          "지구의 물은 대부분 바닷물이다",
          "바닷물은 이용하기 어렵다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "정답: 대부분의 물이 이용하기 어려운 바닷물이기 때문이라고 쓴 경우 (100%)",
          "부분 정답: 대부분의 물이 이용할 수 없는 형태라고만 쓴 경우 (30%)"
        ]
      }
    },
    "explanation": "지구에는 많은 양의 물이 있지만 대부분 이용하기 어려운 바닷물이 차지하고 있습니다. 지구 전체 물 중에서 우리가 쉽게 이용할 수 있는 물의 양은 1 %도 되지 않습니다.\n[채점 기준] 정답: 대부분의 물이 이용하기 어려운 바닷물이기 때문이라고 쓴 경우 (100%) / 부분 정답: 대부분의 물이 이용할 수 없는 형태라고만 쓴 경우 (30%)",
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
    "id": "s42-u05-o1-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 13,
      "page": 3,
      "sourceId": "sci-42-5-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물 부족 해결 방법",
      "concept": "공장에서 쓴 물을 그대로 흘려보내면 물이 오염되므로, 깨끗하게 처리한 뒤 내보내야 한다."
    },
    "prompt": "물 부족 현상을 해결하기 위한 방법으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "양치할 때 컵을 사용합니다.",
      "빗물을 모아 화단에 물을 줍니다.",
      "기름기가 있는 그릇은 휴지로 닦고 설거지를 합니다.",
      "설거지를 할 때 물을 계속 틀어 놓지 않도록 절수 발판을 설치합니다.",
      "물이 빠르게 순환될 수 있도록 공장에서 사용한 물이 강으로 바로 흘러 들어가게 합니다."
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
    "explanation": "공장에서 사용한 물을 그대로 내보내면 물이 오염되므로 깨끗하게 만든 후 내보내야 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「않은」에 밑줄. 해설은 정답지 1쪽 끝(13. ⑤)에서 2쪽 첫머리로 이어짐."
    }
  },
  {
    "id": "s42-u05-o1-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 14,
      "page": 3,
      "sourceId": "sci-42-5-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "해수 담수화 시설",
      "concept": "바닷물에서 소금 성분을 없애 마실 수 있는 담수로 만드는 것을 해수 담수화라고 한다."
    },
    "prompt": "다음은 물 부족 현상을 해결하기 위한 장치에 대한 설명입니다. 어떤 장치에 대한 설명인지 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "바닷물에서 소금 성분을 제거하여 마실 수 있는 물로 바꿉니다.",
      "보기": [
        "ㄱ. 빗물 저금통",
        "ㄴ. 안개 수확기",
        "ㄷ. 해수 담수화 시설"
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
        "ㄷ",
        "해수 담수화 시설",
        "해수담수화시설"
      ]
    },
    "explanation": "우리 생활에서 바로 이용하기 어려운 해수(바닷물)에서 소금 성분을 제거하여 담수로 만드는 물 처리 과정을 해수 담수화라고 합니다.",
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
    "id": "s42-u05-o1-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 15,
      "page": 3,
      "sourceId": "sci-42-5-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물 모으는 장치의 원리",
      "concept": "흙에서 증발한 수증기가 차가운 비닐 표면에서 응결해 물방울이 되고, 그 물방울이 떨어져 물통에 모인다."
    },
    "prompt": "다음은 물 모으는 장치의 모습입니다. 괄호 ㉠과 ㉡에 들어갈 알맞은 말을 골라 각각 쓰세요.",
    "givens": {
      "지문": "흙에서 ㉠( 증발, 응결 )한 수증기가 투명한 비닐에서 ㉡( 증발, 응결 )하여 물방울로 맺힌 후 아래로 떨어져 물통에 모입니다."
    },
    "choices": null,
    "figure": "assets/bank/s42-u05/s1-q15.webp",
    "figureNote": "땅을 파 만든 구덩이 위에 투명한 비닐을 덮고 가장자리를 돌로 눌렀으며, 비닐 가운데에 돌멩이를 올려 아래로 처지게 하고 그 아래 물통을 둔 물 모으는 장치 그림. 그림 속 글자: 투명한 비닐, 돌멩이, 물통.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-증발, ㉡-응결",
      "accepted": [
        "㉠-증발, ㉡-응결",
        "증발, 응결",
        "㉠ 증발 ㉡ 응결",
        "증발 응결"
      ]
    },
    "explanation": "흙에서 증발한 수증기가 투명한 비닐에서 응결하여 물방울로 맺힌 후 아래로 떨어져 물통에 모이는 장치입니다.",
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
    "id": "s42-u05-o2-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 1,
      "page": 1,
      "sourceId": "sci-42-5-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물의 순환 그림에서 ㈎ 과정",
      "concept": "구름 속 작은 물방울이나 얼음 알갱이가 비나 눈이 되어 땅으로 떨어지는 것도 물의 순환 과정의 하나이다."
    },
    "prompt": "물의 순환 과정 중 ㈎ 과정에 해당하는 것을 고르세요.",
    "givens": null,
    "choices": [
      "바다에서 물이 증발합니다.",
      "비나 눈이 되어 땅으로 내립니다.",
      "물이 수증기 상태로 바뀌어 이동합니다.",
      "땅속으로 스며든 물을 식물이 빨아들입니다.",
      "공기 중의 수증기가 응결하여 구름이 됩니다."
    ],
    "figure": "assets/bank/s42-u05/s2-q01.webp",
    "figureNote": "물의 순환 그림: 구름, 해, 산, 호수, 나무와 뿌리, 땅속 물 흐름을 화살표로 나타냄. 구름 아래 산 쪽으로 내려오는 화살표에 (가) 표시",
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
    "explanation": "구름에 있던 작은 물방울이나 얼음 알갱이가 비나 눈이 되어 땅으로 내리는 과정입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "그림 속 표시는 '(가)', 문항 본문은 '㈎'로 인쇄됨."
    }
  },
  {
    "id": "s42-u05-o2-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 2,
      "page": 1,
      "sourceId": "sci-42-5-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물의 순환에 대한 옳지 않은 설명",
      "concept": "땅속으로 스며든 빗물은 사라지지 않고 지하수가 되어 흐르며 계속 순환한다."
    },
    "prompt": "물의 순환에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "물은 상태가 변하면서 끊임없이 순환합니다.",
      "비로 내려 땅속으로 스며든 물은 사라집니다.",
      "수증기가 하늘 높이 올라가 응결하여 구름이 됩니다.",
      "물은 머무르는 장소나 위치에 따라 상태가 변하기도 합니다.",
      "식물의 뿌리로 흡수된 물은 잎에서 수증기로 나와 공기 중으로 이동합니다."
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
    "explanation": "비로 내려 땅속으로 스며든 물은 지하수가 되어 흐릅니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄."
    }
  },
  {
    "id": "s42-u05-o2-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 3,
      "page": 1,
      "sourceId": "sci-42-5-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물이 순환할 때 변하지 않는 것",
      "concept": "물이 순환하며 상태·모양·쓰임새·머무는 곳은 바뀌어도 지구 전체 물의 양은 일정하다."
    },
    "prompt": "물이 순환할 때 변하지 않는 것을 고르세요.",
    "givens": null,
    "choices": [
      "물의 상태",
      "물의 모양",
      "물의 쓰임새",
      "물이 머무는 장소",
      "지구 전체 물의 양"
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
    "explanation": "물은 머무르는 장소나 위치에 따라 상태와 모양, 쓰임새가 변하지만 지구 전체 물의 양은 변하지 않습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않는'에 밑줄."
    }
  },
  {
    "id": "s42-u05-o2-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 4,
      "page": 1,
      "sourceId": "sci-42-5-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물의 순환에서 증발과 응결",
      "concept": "땅과 물에 있던 물은 증발해 수증기가 되고, 하늘 높이 올라간 수증기는 응결해 구름이 된다."
    },
    "prompt": "다음은 물의 순환에 대한 설명입니다. 빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 각각 쓰세요.",
    "givens": {
      "지문": "땅에 내린 빗물은 호수, 강, 바다, 땅속에 머물다가 공기 중으로 ㉠ 하거나 식물의 뿌리로 흡수되었다가 잎에서 수증기로 나옵니다. 공기 중의 수증기가 하늘 높이 올라가 ㉡ 하면 구름이 되고 다시 비나 눈이 되어 바다나 육지로 내립니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
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
    "explanation": "땅에 내린 빗물은 호수, 강, 바다, 땅속에 머물다가 공기 중으로 증발하거나 식물의 뿌리로 흡수되었다가 잎에서 수증기로 나옵니다. 공기 중의 수증기가 하늘 높이 올라가 응결하면 구름이 되고 다시 비나 눈이 되어 바다나 육지로 내립니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 ㉠·㉡은 네모 빈칸 안에 인쇄됨(빈칸 바로 뒤에 '하거나', '하면'이 붙어 있음). 답 칸은 '㉠-(   ), ㉡-(   )'."
    }
  },
  {
    "id": "s42-u05-o2-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 5,
      "page": 1,
      "sourceId": "sci-42-5-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물의 이용에 대한 옳지 않은 설명",
      "concept": "공장에서 물건을 만들 때는 얼음만이 아니라 여러 상태의 물을 이용한다."
    },
    "prompt": "물의 이용에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "물을 이용해 불을 끕니다.",
      "음식을 만들 때 이용합니다.",
      "몸을 씻거나 그릇을 씻을 때 이용합니다.",
      "강이나 바다에서 배를 움직일 수 있게 해 줍니다.",
      "공장에서 물건을 만들 때에는 얼음만 이용합니다."
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
    "explanation": "공장에서 물건을 만들 때 여러 상태의 물을 이용합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄."
    }
  },
  {
    "id": "s42-u05-o2-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 6,
      "page": 2,
      "sourceId": "sci-42-5-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "흐르는 물이 만든 지형의 이용",
      "concept": "흐르는 물은 지표면의 모양을 바꾸어 다양한 지형을 만들고, 이런 지형은 관광 자원으로 이용된다."
    },
    "prompt": "흐르는 물이 만든 지형을 관광 자원으로 이용하는 경우를 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. (사진) 소방관이 물을 뿌려 불을 끄는 모습",
        "ㄴ. (사진) 비누 거품이 묻은 손을 물로 씻는 모습",
        "ㄷ. (사진) 강물이 굽이쳐 흐르며 만든 지형(물돌이 지형)"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s42-u05/s2-q06.webp",
    "figureNote": "<보기> 상자 안 사진 3장: ㄱ. 소방관이 호스로 물을 뿌려 불을 끄는 모습, ㄴ. 비누 거품 묻은 손을 물로 씻는 모습, ㄷ. 강이 산 사이를 굽이쳐 흐르며 만든 지형",
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
    "explanation": "흐르는 물은 지표면의 모양을 변화시켜 다양한 지형을 만들기 때문에 관광 자원으로 이용할 수 있습니다. ㄱ은 물을 이용해 불을 끄는 모습이고, ㄴ은 물을 이용해 손을 씻는 모습입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 글이 아니라 사진 3장(ㄱ~ㄷ)이라 givens의 보기 설명은 사진 내용을 옮긴 것임."
    }
  },
  {
    "id": "s42-u05-o2-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 7,
      "page": 2,
      "sourceId": "sci-42-5-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물이 중요한 까닭",
      "concept": "물은 식물과 동물의 몸속을 순환하며 모든 생물이 생명을 유지하게 한다."
    },
    "prompt": "단비는 물이 중요한 까닭에 대해 친구들에게 발표하려고 합니다. 어떤 내용을 가지고 설명하면 좋을지 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 물은 달 때문에 끊임없이 순환하면서 날씨를 바꿉니다.",
        "ㄴ. 물은 식물이나 동물의 몸속을 순환하면서 생명을 유지시킵니다.",
        "ㄷ. 빗물은 땅속에 스며들지 않아 지표면의 모양을 변화시키지 못합니다."
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
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "물은 모든 생물이 생명을 유지하는 데 반드시 필요합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "인쇄된 발문에서 '<' 와 '보기>'가 줄바꿈으로 나뉨('… 좋을지 <' / '보기>에서 …')."
    }
  },
  {
    "id": "s42-u05-o2-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 8,
      "page": 2,
      "sourceId": "sci-42-5-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "농작물 재배와 물의 중요성",
      "concept": "식량이 되는 농작물은 물이 있어야 자랄 수 있으므로 물은 우리에게 꼭 필요하다."
    },
    "prompt": "우리에게 물이 중요한 까닭을 다음의 모습과 관련지어 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s42-u05/s2-q08.webp",
    "figureNote": "사진: 밭의 농작물에 스프링클러로 물을 뿌리는 모습",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "우리가 식량으로 이용하는 농작물을 키우기 위해서는 물이 반드시 필요합니다.",
      "rubric": {
        "required": [
          "농작물을 키우기 위해 물이 반드시 필요하다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "농작물을 키우기 위해 물이 필요하다고 쓴 경우 (100%)"
        ]
      }
    },
    "explanation": "우리가 식량으로 이용하는 농작물을 키우기 위해서는 물이 필요합니다. 물이 없다면 농작물이 자라날 수 없습니다.\n[채점 기준] 농작물을 키우기 위해 물이 필요하다고 쓴 경우 (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준표의 구분 칸은 '정답'."
    }
  },
  {
    "id": "s42-u05-o2-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 9,
      "page": 2,
      "sourceId": "sci-42-5-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물의 이용에 대한 옳은 설명",
      "concept": "물은 이용해도 사라지지 않고 순환하며, 우리는 물을 이용해 필요한 것을 얻는다."
    },
    "prompt": "물의 이용에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "물은 한 번 이용하고 나면 사라집니다.",
      "우리는 물을 이용해 필요한 것을 얻기도 합니다.",
      "생물이 마신 물은 생물의 몸속에 계속 저장되어 있습니다.",
      "공장에서 이용한 물은 다른 곳에서 다시 이용할 수 없습니다.",
      "산업의 발달로 생활에 이용할 수 있는 깨끗한 물이 늘어나고 있습니다."
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
    "explanation": "물은 순환하는 과정에서 상태나 위치가 변하지만 그 양은 변하지 않아 지구 전체 물의 양은 변하지 않습니다. 산업의 발달로 생활에 이용할 수 있는 깨끗한 물이 줄어들고 있습니다.",
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
    "id": "s42-u05-o2-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 10,
      "page": 2,
      "sourceId": "sci-42-5-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물 부족 현상의 까닭",
      "concept": "비가 적게 오고 더워서 증발하는 물이 많은 지역에서는 물이 부족해진다."
    },
    "prompt": "물 부족 현상이 나타나는 까닭으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 지구가 차가워져 바닷물이 점점 얼기 때문입니다.",
        "ㄴ. 도시가 발달하면서 하수 처리 시설이 발달했기 때문입니다.",
        "ㄷ. 아프리카와 같은 곳은 비가 적게 내리고 물이 빨리 증발하기 때문에 점점 물이 부족해집니다."
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
    "explanation": "비가 적게 내리고 날씨가 더워서 증발하는 물의 양이 많은 지역은 물이 부족합니다.",
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
    "id": "s42-u05-o2-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 11,
      "page": 3,
      "sourceId": "sci-42-5-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물 부족을 해결하는 생활 습관",
      "concept": "빨래를 모아서 하거나 기름기 있는 그릇을 휴지로 먼저 닦는 것처럼 물을 아끼고 덜 오염시키는 습관이 물 부족 해결에 도움이 된다."
    },
    "prompt": "물 부족 현상을 해결하기 위한 방법으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "세제를 많이 사용합니다.",
      "빨래를 모아서 한꺼번에 합니다.",
      "양치할 때 물을 계속 틀어 놓습니다.",
      "바닷물을 그대로 식수로 이용합니다.",
      "기름기가 있는 그릇은 휴지로 닦고 설거지를 합니다."
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
        4
      ]
    },
    "explanation": "세제를 적당히 사용합니다. 바닷물을 식수로 이용하기 위해서는 소금기를 없애는 과정이 필요합니다. 양치할 때와 세수할 때는 물을 받아 놓고 이용합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문 '(정답 2개)'는 인쇄상 '(정답  2 개)'처럼 간격이 있음."
    }
  },
  {
    "id": "s42-u05-o2-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 12,
      "page": 3,
      "sourceId": "sci-42-5-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "빗물 모으는 장치의 좋은 점",
      "concept": "빗물을 모아 청소나 화단에 물 주기에 쓰면 물을 아낄 수 있다."
    },
    "prompt": "빗물을 모으는 장치를 만들어 사용하면 좋은 점을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "물을 아낄 수 있습니다.",
      "영양가가 풍부한 물을 마실 수 있습니다.",
      "더러워진 물을 깨끗하게 할 수 있습니다.",
      "빗물을 모아 청소할 때 이용할 수 있습니다.",
      "물을 계속 흐르게 하면서 이용할 수 있습니다."
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
        3
      ]
    },
    "explanation": "빗물을 모아 청소할 때나 화단에 물을 줄 때 이용하면 물을 아낄 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문 '(정답 2개)'는 인쇄상 '(정답  2 개)'처럼 간격이 있음."
    }
  },
  {
    "id": "s42-u05-o2-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 13,
      "page": 3,
      "sourceId": "sci-42-5-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "흙 구덩이 물 모으는 장치의 원리",
      "concept": "흙에서 증발한 수증기가 차가운 비닐 표면에서 응결해 물방울이 되어 떨어지면 물을 모을 수 있다."
    },
    "prompt": "다음은 물 모으는 장치에 대한 설명입니다. 빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 각각 쓰세요.",
    "givens": {
      "지문": "흙에서 ㉠ 한 수증기가 투명한 비닐에서 ㉡ 하여 물방울로 맺힌 후 아래로 떨어져 물통에 모입니다.",
      "그림 글자": [
        "투명한 비닐",
        "돌멩이",
        "물통"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s42-u05/s2-q13.webp",
    "figureNote": "구덩이 위를 투명한 비닐로 덮고 가운데에 돌멩이를 올려 놓은 장치 그림. 비닐 아래 물방울이 떨어지는 곳에 물통이 있음. 글자: 투명한 비닐, 돌멩이, 물통",
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
        "증발 응결",
        "㉠ 증발 ㉡ 응결"
      ]
    },
    "explanation": "흙에서 증발한 수증기가 투명한 비닐에서 응결하여 물방울로 맺힌 후 아래로 떨어져 물통에 모입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 ㉠·㉡은 네모 빈칸 안에 인쇄됨(빈칸 뒤에 '한', '하여'가 붙어 있음). 답 칸은 '㉠-(   ), ㉡-(   )'."
    }
  },
  {
    "id": "s42-u05-o2-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 14,
      "page": 3,
      "sourceId": "sci-42-5-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "와카워터로 물을 모으는 원리",
      "concept": "와카워터는 공기 중의 수증기가 그물망에서 응결해 맺힌 물방울을 바닥 그릇에 모으는 장치이다."
    },
    "prompt": "다음은 위 장치로 물을 모으는 방법입니다. 빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 각각 쓰세요.",
    "givens": {
      "지문": "[14~15] 다음은 물의 순환을 이용해 물을 모으는 장치인 와카워터의 모습입니다. 물음에 답하세요. / 공기 중의 ㉠ (이)가 와카워터의 그물망에서 응결하여 ㉡ 방울로 맺힌 후 바닥에 있는 그릇으로 모입니다."
    },
    "choices": null,
    "figure": "assets/bank/s42-u05/s2-q14.webp",
    "figureNote": "와카워터 그림: 그물로 감싼 탑 모양 장치와 바닥의 그릇, 그물망 확대 그림(물방울 맺힘)과 바닥 그릇 확대 그림이 화살표로 연결됨",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-수증기, ㉡-물",
      "accepted": [
        "㉠-수증기, ㉡-물",
        "수증기, 물",
        "㉠ 수증기, ㉡ 물",
        "수증기,물",
        "수증기 물",
        "㉠ 수증기 ㉡ 물"
      ]
    },
    "explanation": "공기 중의 수증기가 와카워터의 그물망에서 응결하여 물방울로 맺힌 후 바닥에 있는 그릇으로 모입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문에 공통 발문([14~15])과 14번 상자 글을 ' / '로 이어 적음. ㉠·㉡은 네모 빈칸 안에 인쇄됨(빈칸 뒤에 '(이)가', '방울로'가 붙어 있음)."
    }
  },
  {
    "id": "s42-u05-o2-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 15,
      "page": 3,
      "sourceId": "sci-42-5-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "와카워터를 설치하기 알맞은 지역",
      "concept": "와카워터는 비가 적어 건조하고 낮과 밤의 기온 차가 커서 수증기가 잘 응결하는 지역에 설치하면 효과적이다."
    },
    "prompt": "와카워터를 설치할 지역과 그 지역의 특성을 설명한 것으로 옳은 것을 고르세요.",
    "givens": {
      "지문": "[14~15] 다음은 물의 순환을 이용해 물을 모으는 장치인 와카워터의 모습입니다. 물음에 답하세요."
    },
    "choices": [
      "나무가 많은 지역",
      "비가 많이 내리는 지역",
      "홍수가 자주 발생한 지역",
      "바람이 많이 불고 온도가 낮은 지역",
      "비가 잘 내리지 않고 낮과 밤의 기온 차가 큰 지역"
    ],
    "figure": "assets/bank/s42-u05/s2-q14.webp",
    "figureNote": "와카워터 그림: 그물로 감싼 탑 모양 장치와 바닥의 그릇, 그물망 확대 그림(물방울 맺힘)과 바닥 그릇 확대 그림이 화살표로 연결됨",
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
    "explanation": "비가 잘 내리지 않아 건조한 지역에 설치하여 물 부족 현상을 해결합니다. 낮과 밤의 기온 차가 큰 지역에서는 수증기가 잘 응결하기 때문에 와카워터를 통해 많은 물을 모을 수 있습니다.",
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
    "id": "s42-u05-o3-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 1,
      "page": 1,
      "sourceId": "sci-42-5-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물의 이동",
      "concept": "물은 고체, 액체, 기체 중 어느 상태로든 변하며 이동하므로 항상 액체에서 기체로만 변하는 것은 아니다."
    },
    "prompt": "물의 이동에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "물은 자유롭게 이동합니다.",
      "물이 이동하면서 상태가 달라지기도 합니다.",
      "물은 머물러 있는 곳에 따라 상태가 달라지기도 합니다.",
      "물은 항상 액체 상태에서 기체 상태로 변하여 이동합니다.",
      "물은 땅 위, 공기 중, 바다나 강, 땅속 등 다양한 곳에서 볼 수 있습니다."
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
    "explanation": "물은 얼음인 고체, 물인 액체, 수증기인 기체 상태로 변하며 이동합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄."
    }
  },
  {
    "id": "s42-u05-o3-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 2,
      "page": 1,
      "sourceId": "sci-42-5-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "식물 잎에서의 물의 상태 변화",
      "concept": "뿌리로 흡수된 액체 상태의 물은 잎에서 기체인 수증기가 되어 공기 중으로 나간다."
    },
    "prompt": "물이 식물의 잎에서 공기 중으로 이동할 때 물의 상태 변화로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "액체 → 액체",
      "액체 → 고체",
      "액체 → 기체",
      "기체 → 액체",
      "기체 → 기체"
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
    "explanation": "식물의 뿌리에서 흡수된 물은 잎에서 기체 상태의 수증기로 증발하여 공기 중으로 이동합니다.",
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
    "id": "s42-u05-o3-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 3,
      "page": 1,
      "sourceId": "sci-42-5-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물의 순환의 뜻",
      "concept": "물이 상태를 바꾸며 육지, 바다, 공기, 생명체 사이를 끊임없이 돌고 도는 것을 물의 순환이라고 한다."
    },
    "prompt": "다음에서 설명하는 것이 무엇인지 쓰세요.",
    "givens": {
      "지문": "물이 상태가 변하면서 육지, 바다, 공기, 생명체 사이를 끊임없이 이동하는 것을 물의 □(이)라고 합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
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
    "explanation": "물이 상태가 변하면서 육지, 바다, 공기, 생명체 사이를 끊임없이 이동하는 것을 물의 순환이라고 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문 상자 안의 빈칸은 네모 칸으로 인쇄됨(□로 옮김)."
    }
  },
  {
    "id": "s42-u05-o3-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 4,
      "page": 1,
      "sourceId": "sci-42-5-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물의 순환 과정에서 증발",
      "concept": "바다, 호수, 강의 물이 증발하면 수증기가 되어 공기 중으로 올라간다."
    },
    "prompt": "다음은 물의 순환 과정을 나타낸 것입니다. 물이 증발하여 수증기로 상태가 변하며 이동하는 과정의 기호(ㄱ~ㄹ)를 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s42-u05/s3-q04.webp",
    "figureNote": "물의 순환 그림: 구름에서 비가 내리는 화살표(ㄱ), 강·호수 위와 나무 옆에서 위로 올라가는 빨간 물결 화살표(ㄴ, 증발), 땅속으로 스며드는 화살표(ㄷ), 강물이 바다로 흐르고 땅속에서 이동하는 화살표(ㄹ), 해와 구름, 산, 나무가 함께 그려짐.",
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
    "explanation": "바다나 호수, 강 등에 있는 물이 증발하여 수증기가 됩니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "그림 속 기호 ㄱ~ㄹ의 각 화살표 대응은 그림으로 판독함."
    }
  },
  {
    "id": "s42-u05-o3-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 5,
      "page": 1,
      "sourceId": "sci-42-5-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물의 순환에 대한 설명",
      "concept": "물은 비나 눈으로 내리고 증발해 수증기로 올라가며, 동물이 마신 물이나 강물도 사라지지 않고 계속 순환한다."
    },
    "prompt": "물의 순환에 대한 설명으로 옳은 것을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "보기": [
        "ㄱ. 동물이 마신 물은 사라집니다.",
        "ㄴ. 구름에서 비나 눈이 육지로 내립니다.",
        "ㄷ. 강에서 흐르는 물은 증발하지 않고 모두 바다로 흘러갑니다.",
        "ㄹ. 바다에서 증발한 물은 수증기로 바뀌어 공기 중으로 이동합니다."
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
      "answer": "ㄴ, ㄹ",
      "accepted": [
        "ㄴ, ㄹ",
        "ㄴ,ㄹ",
        "ㄹ, ㄴ",
        "ㄹ,ㄴ",
        "ㄴㄹ"
      ]
    },
    "explanation": "동물이 마신 물은 몸속을 순환한 후 밖으로 나옵니다. 강에서 흐르는 물이 바다로 흘러가는 중에 수증기로 증발하여 공기 중으로 이동합니다.",
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
    "id": "s42-u05-o3-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 6,
      "page": 1,
      "sourceId": "sci-42-5-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "순환하는 동안 지구 전체 물의 양",
      "concept": "물은 순환하며 상태와 위치만 바뀌므로 지구 전체의 물의 양은 일정하게 유지된다."
    },
    "prompt": "물이 순환하는 동안 지구 전체의 물의 양에는 어떤 변화가 나타나는지 옳게 설명한 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 지구 전체의 물의 양이 계속 늘어납니다.",
        "ㄴ. 지구 전체의 물의 양이 계속 줄어듭니다.",
        "ㄷ. 지구 전체의 물의 양은 변하지 않습니다."
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
        "ㄷ",
        "지구 전체의 물의 양은 변하지 않습니다."
      ]
    },
    "explanation": "물은 순환하는 과정에서 상태나 위치가 변하지만 그 양은 변하지 않으므로 지구 전체 물의 양은 변하지 않습니다.",
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
    "id": "s42-u05-o3-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 7,
      "page": 2,
      "sourceId": "sci-42-5-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "생물이 생명 유지에 물을 이용함",
      "concept": "물은 모든 생물이 생명을 유지하는 데 꼭 필요해서 생물은 물을 마신다."
    },
    "prompt": "다음은 우리 생활에서 물을 어떻게 이용하는 예인지 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 물을 이용해 불을 끕니다.",
        "ㄴ. 청소를 할 때 물을 이용합니다.",
        "ㄷ. 생물이 생명을 유지하기 위해 물을 마십니다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s42-u05/s3-q07.webp",
    "figureNote": "고양이가 수도꼭지에서 흘러나오는 물을 혀로 핥아 마시는 사진.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ",
        "생물이 생명을 유지하기 위해 물을 마십니다."
      ]
    },
    "explanation": "물은 모든 생물이 생명을 유지하는 데 반드시 필요하기 때문에 물을 마셔야 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '<보기>'가 줄바꿈으로 '<'와 '보기>'로 나뉘어 인쇄됨."
    }
  },
  {
    "id": "s42-u05-o3-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 8,
      "page": 2,
      "sourceId": "sci-42-5-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물건 운반에 물을 이용함",
      "concept": "바다나 강의 물 위로 배가 다니며 물건을 실어 나르므로 물은 운송 수단으로 이용된다."
    },
    "prompt": "다음은 물을 어떻게 이용하는 경우인지 고르세요.",
    "givens": null,
    "choices": [
      "불 끄기",
      "전기 만들기",
      "물건 만들기",
      "농작물 기르기",
      "물건 운반하기"
    ],
    "figure": "assets/bank/s42-u05/s3-q08.webp",
    "figureNote": "컨테이너를 가득 실은 큰 화물선이 예인선과 함께 바다 위를 지나가는 사진(뒤로 다리와 항구가 보임).",
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
    "explanation": "물은 물건을 운반하는 운송 수단으로 이용할 수 있습니다.",
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
    "id": "s42-u05-o3-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 9,
      "page": 2,
      "sourceId": "sci-42-5-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "이용할 수 있는 물이 적은 까닭",
      "concept": "지구의 물은 대부분 소금 성분이 많은 바닷물이라 바로 쓰기 어렵고, 이용할 수 있는 호수·하천수·지하수는 아주 적다."
    },
    "prompt": "지구에는 많은 양의 물이 있지만 우리가 이용할 수 있는 물의 양은 극히 적습니다. 그 까닭을 물의 분포와 관련지어 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "지구의 물은 대부분 이용하기 어려운 바닷물이 차지하고 있기 때문입니다.",
      "rubric": {
        "required": [
          "지구의 물은 대부분 바닷물이다",
          "바닷물은 이용하기 어렵다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "지구의 물이 대부분 이용하기 어려운 바닷물이기 때문이라고 쓴 경우 (100%)"
        ]
      }
    },
    "explanation": "지구에는 많은 양의 물이 있지만 그중 대부분은 소금 성분이 많이 들어 있어 이용하기 어려운 바닷물이 차지하고 있습니다. 우리가 이용할 수 있는 호수와 하천수, 지하수는 극히 적은 양을 차지하고 있습니다.\n[채점 기준] 지구의 물이 대부분 이용하기 어려운 바닷물이기 때문이라고 쓴 경우 (100%)",
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
    "id": "s42-u05-o3-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 10,
      "page": 2,
      "sourceId": "sci-42-5-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물 부족 현상의 원인",
      "concept": "인구 증가와 산업 발달로 물 이용량이 늘고, 물이 오염되는 속도가 자연적으로 깨끗해지는 속도보다 빨라 물이 부족해진다."
    },
    "prompt": "물 부족 현상의 원인으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "인구 증가로 물 이용량이 늘어났습니다.",
      "산업 발달로 물 이용량이 줄어들었습니다.",
      "한 번 사용한 물은 다시 사용할 수 없습니다.",
      "하수 처리 시설의 발달로 물의 오염이 줄어들었습니다.",
      "물이 자연적으로 깨끗해지는 속도보다 오염되는 속도가 더 빠릅니다."
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
    "explanation": "물이 부족한 원인은 산업 발달과 인구 증가로 물의 이용량이 늘어나고, 물이 자연적으로 깨끗해지는 속도보다 사람들이 물을 이용하여 오염시키는 속도가 더 빠르기 때문입니다.",
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
    "id": "s42-u05-o3-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 11,
      "page": 2,
      "sourceId": "sci-42-5-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "해수 담수화 시설",
      "concept": "해수 담수화 시설은 바닷물에서 소금 성분을 없애 마실 수 있는 물로 바꾸는 장치이다."
    },
    "prompt": "다음은 물 부족 현상을 해결하기 위한 장치에 대한 설명입니다. 어떤 장치에 대한 설명인지 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "바닷물에서 소금 성분을 제거하여 마실 수 있는 물로 바꿉니다.",
      "보기": [
        "ㄱ. 빗물 저금통",
        "ㄴ. 안개 수확기",
        "ㄷ. 해수 담수화 시설"
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
        "ㄷ",
        "해수 담수화 시설",
        "해수담수화 시설",
        "해수담수화시설"
      ]
    },
    "explanation": "우리 생활에서 바로 이용하기 어려운 해수(바닷물)에서 소금 성분을 제거하여 마실 수 있는 담수로 만드는 물 처리 과정을 해수 담수화라고 합니다.",
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
    "id": "s42-u05-o3-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 12,
      "page": 2,
      "sourceId": "sci-42-5-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "일상생활에서 물 절약 실천",
      "concept": "양치컵을 쓰거나 빨래를 모아 한꺼번에 하는 것처럼 생활 속에서 물을 아껴 쓰면 물 부족 해결에 도움이 된다."
    },
    "prompt": "우리가 일상생활에서 물 부족 현상을 해결하기 위해 실천할 수 있는 방법으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "양치컵 사용하기",
      "샴푸나 세제 많이 사용하기",
      "빨래를 모아서 한꺼번에 하기",
      "인공 강우로 비를 내리게 하기",
      "바닷물을 식수로 만드는 장치 개발하기"
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
    "explanation": "일상생활에서 우리는 양치컵을 사용하거나 빨래를 모아서 한꺼번에 함으로써 물을 절약할 수 있습니다.",
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
    "id": "s42-u05-o3-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 13,
      "page": 3,
      "sourceId": "sci-42-5-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물 모으는 장치 와카워터",
      "concept": "와카워터는 값싼 재료를 그물처럼 엮어 세워 공기 중의 물을 모으는 탑 모양 장치이다."
    },
    "prompt": "위 물 모으는 장치의 이름을 쓰세요.",
    "givens": {
      "지문": "[13~14] 다음의 물 모으는 장치의 모습을 보고, 물음에 답하세요."
    },
    "choices": null,
    "figure": "assets/bank/s42-u05/s3-q13.webp",
    "figureNote": "와카워터 그림: 그물망으로 엮은 호리병 모양의 높은 탑이 여러 줄로 땅에 고정되어 서 있음.",
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
    "explanation": "와카워터는 값싼 재료로 간단히 엮어 세워 두면 물이 모이는 탑입니다.",
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
    "id": "s42-u05-o3-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 14,
      "page": 3,
      "sourceId": "sci-42-5-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "와카워터가 이용하는 현상",
      "concept": "와카워터는 공기 중 수증기가 그물망에서 응결해 물방울이 되는 현상을 이용해 물을 모은다."
    },
    "prompt": "위 장치는 어떤 현상을 이용한 것인지 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[13~14] 다음의 물 모으는 장치의 모습을 보고, 물음에 답하세요.",
      "보기": [
        "ㄱ. 물이 어는 현상",
        "ㄴ. 물이 끓는 현상",
        "ㄷ. 얼음이 녹는 현상",
        "ㄹ. 수증기가 응결하는 현상"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s42-u05/s3-q13.webp",
    "figureNote": "와카워터 그림: 그물망으로 엮은 호리병 모양의 높은 탑이 여러 줄로 땅에 고정되어 서 있음.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄹ",
      "accepted": [
        "ㄹ",
        "수증기가 응결하는 현상"
      ]
    },
    "explanation": "공기 중의 수증기가 와카워터의 그물망에서 응결하여 물방울로 맺힌 후 바닥에 있는 그릇으로 모입니다.",
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
    "id": "s42-u05-o3-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 15,
      "page": 3,
      "sourceId": "sci-42-5-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅴ. 물의 여행"
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
      "track": "교과",
      "topic": "물 모으는 장치 설계 시 고려할 점",
      "concept": "물 모으는 장치를 설계할 때는 필요한 장소와 지역의 특성, 물의 순환을 이용하는 방법, 물을 잘 모으는 재료를 생각한다."
    },
    "prompt": "물을 모으는 장치를 설계하기 위해 생각해야 할 것으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "물 모으는 장치의 가격",
      "물을 잘 모을 수 있는 재료",
      "물 모으는 장치가 필요한 장소",
      "물 모으는 장치가 필요한 지역의 특성",
      "물의 순환 과정을 이용할 수 있는 방법"
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
    "explanation": "물 모으는 장치를 개발할 때는 물 모으는 장치가 필요한 장소와 지역의 특성, 물의 순환 과정을 이용할 수 있는 방법 그리고 물을 잘 모을 수 있는 재료를 생각해야 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄."
    }
  }
];
