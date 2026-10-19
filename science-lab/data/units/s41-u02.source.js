// 4-1 Ⅱ 물의 상태 변화 — 단원평가 원문 80문항(시매쓰DMC 최다빈출 단원평가 세트1·2·3·4). 시험지를 그대로 옮기고 정답 및 풀이와 대조했다.
// 원장 지시(2026-10-09): 원문을 그대로 문제은행에 쓴다(전에는 Supabase에만 있었음). 그림은 시험지에서 잘라 낸 것(assets/bank/s41-u02/).
export const source = [
  {
    "id": "s41-u02-o1-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 1,
      "page": 1,
      "sourceId": "sci-41-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 얼음으로 변하는 상태 변화",
      "concept": "액체인 물을 차갑게 하면 고체인 얼음으로 상태가 변한다."
    },
    "prompt": "다음 ㉠, ㉡에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "물이 담긴 페트리 접시의 뚜껑을 닫은 후 소금을 섞은 얼음 속에 넣으면 액체 상태의 물이 [㉠] 상태의 [㉡](으)로 상태가 변합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 고체, ㉡ 얼음",
      "accepted": [
        "㉠ 고체, ㉡ 얼음",
        "고체, 얼음",
        "고체 얼음",
        "㉠-고체, ㉡-얼음"
      ]
    },
    "explanation": "물이 담긴 페트리 접시의 뚜껑을 닫은 후 소금을 섞은 얼음 속에 넣으면 액체 상태의 물이 고체 상태의 얼음으로 상태가 변합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "㉠, ㉡은 지문 속 네모 칸으로 인쇄됨. 답란은 「㉠ (     ), ㉡ (     )」."
    }
  },
  {
    "id": "s41-u02-o1-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 2,
      "page": 1,
      "sourceId": "sci-41-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음(고체)의 성질",
      "concept": "고체인 얼음은 눈에 보이고 모양이 일정하며 손으로 잡을 수 있다."
    },
    "prompt": "다음 <보기>에서 얼음에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 눈에 보인다.",
        "㉡ 일정한 형태가 있다.",
        "㉢ 흐르는 성질이 있다.",
        "㉣ 손으로 잡을 수 없다."
      ]
    },
    "choices": [
      "㉠",
      "㉡",
      "㉠, ㉡",
      "㉢, ㉣",
      "㉠, ㉡, ㉢"
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
    "explanation": "고체 상태의 얼음은 눈에 보이고, 모양이 일정하여 손으로 잡을 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o1-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 3,
      "page": 1,
      "sourceId": "sci-41-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물의 상태 변화의 뜻",
      "concept": "물은 얼음·물·수증기의 세 가지 상태 사이에서 서로 다른 상태로 변할 수 있다."
    },
    "prompt": "물의 상태 변화에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "얼음은 물로 변할 수 있다.",
      "수증기는 물로 변할 수 있다.",
      "물은 얼음으로 변할 수 있다.",
      "물은 수증기로 변할 수 없다.",
      "물이 다른 상태로 변하는 것이다."
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
    "explanation": "물은 고체인 얼음, 액체인 물, 기체인 수증기의 세 가지 상태로 있으며, 각 상태는 서로 다른 상태로 변할 수 있습니다. 이렇게 물이 다른 상태로 변하는 것을 물의 상태 변화라고 합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「않은」에 밑줄."
    }
  },
  {
    "id": "s41-u02-o1-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 4,
      "page": 1,
      "sourceId": "sci-41-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "페트리 접시의 물이 사라지는 상태 변화",
      "concept": "페트리 접시에 뿌린 물은 시간이 지나면 기체인 수증기로 변해 공기 중으로 흩어진다."
    },
    "prompt": "페트리 접시에서 시간이 지남에 따라 나타나는 물의 상태 변화로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[04~05] 다음과 같이 페트리 접시에 분무기로 물을 뿌린 후 시간이 지남에 따라 페트리 접시의 물이 어떻게 되는지 관찰하였습니다. 물음에 답하시오."
    },
    "choices": [
      "고체 → 액체",
      "고체 → 기체",
      "액체 → 고체",
      "액체 → 기체",
      "기체 → 고체"
    ],
    "figure": "assets/bank/s41-u02/s1-q04.webp",
    "figureNote": "분무기로 뿌린 작은 물방울들이 맺혀 있는 페트리 접시 그림",
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
    "explanation": "페트리 접시의 물(액체)은 시간이 지남에 따라 수증기(기체)로 변하여 공기 중으로 사라집니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o1-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 5,
      "page": 1,
      "sourceId": "sci-41-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 수증기로 변하는 예",
      "concept": "가습기는 물이 수증기로 상태가 변하는 현상을 이용한다."
    },
    "prompt": "위 실험에서 나타나는 물의 상태 변화와 관련된 예로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[04~05] 다음과 같이 페트리 접시에 분무기로 물을 뿌린 후 시간이 지남에 따라 페트리 접시의 물이 어떻게 되는지 관찰하였습니다. 물음에 답하시오."
    },
    "choices": [
      "극지방의 빙하가 녹는다.",
      "스키장에서 인공 눈을 만든다.",
      "얼음과자가 시간이 지나면 녹는다.",
      "날씨가 건조할 때 가습기를 사용한다.",
      "물이나 주스를 얼려 얼음과자를 만든다."
    ],
    "figure": "assets/bank/s41-u02/s1-q04.webp",
    "figureNote": "분무기로 뿌린 작은 물방울들이 맺혀 있는 페트리 접시 그림",
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
    "explanation": "실험의 페트리 접시에서 물이 수증기로 변하는 상태 변화가 나타납니다. 날씨가 건조할 때 가습기를 사용하는 것은 물이 수증기로 상태가 변하는 예입니다. 극지방의 빙하가 녹는 것, 얼음과자가 시간이 자나면 녹는 것은 얼음이 물로 상태가 변하는 예이고, 스키장에서 인공 눈을 만드는 것, 물이나 주스를 얼려 얼음과자를 만드는 것은 물이 얼음으로 상태가 변하는 예입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설에 「시간이 자나면」(지나면의 오기)으로 인쇄됨 — 그대로 옮김."
    }
  },
  {
    "id": "s41-u02-o1-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 6,
      "page": 1,
      "sourceId": "sci-41-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물↔수증기 상태 변화의 예 구분",
      "concept": "제습기는 수증기가 물로 변하는 현상을, 나머지는 물이 수증기로 변하는 현상을 이용한다."
    },
    "prompt": "물의 상태 변화가 나머지 넷과 다른 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "바닷물에서 소금을 만든다.",
      "물을 끓여 수증기로 음식을 찐다.",
      "날씨가 습할 때 제습기를 사용한다.",
      "설거지를 하고 나면 그릇의 물기가 마른다.",
      "물휴지의 뚜껑을 열어 놓으면 물휴지의 물이 마른다."
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
    "explanation": "날씨가 습할 때 제습기를 사용하는 것은 수증기가 물로 상태가 변하는 예입니다. 바닷물에서 소금을 만드는 것, 물을 끓여 수증기로 음식을 찌는 것, 설거지를 하고 나면 그릇의 물기가 마르는 것, 물휴지의 뚜껑을 열어 놓으면 물휴지의 물이 마르는 것은 물이 수증기로 상태가 변하는 예입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o1-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 7,
      "page": 2,
      "sourceId": "sci-41-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 얼 때 부피 변화",
      "concept": "물이 얼어 얼음이 되면 부피가 늘어난다."
    },
    "prompt": "위와 같은 현상이 나타나는 까닭으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[07~08] 다음 내용을 보고, 물음에 답하시오. 물이 가득 담긴 페트병을 냉동실에 넣어 얼리면 페트병이 뚱뚱해집니다."
    },
    "choices": [
      "물이 얼면 부피가 줄어들기 때문이다.",
      "물이 얼면 부피가 늘어나기 때문이다.",
      "물이 얼면 무게가 가벼워지기 때문이다.",
      "물이 얼면 무게가 무거워지기 때문이다.",
      "물이 얼면 기체 상태로 변하기 때문이다."
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
    "explanation": "액체인 물이 얼어 고체인 얼음이 되면 부피가 늘어납니다. 따라서 페트병에 물을 가득 넣어 얼리면 물이 얼면서 부피가 늘어나기 때문에 페트병이 뚱뚱해집니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "공통 지문의 상자 안 문장: 「물이 가득 담긴 페트병을 냉동실에 넣어 얼리면 페트병이 뚱뚱해집니다.」"
    }
  },
  {
    "id": "s41-u02-o1-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 8,
      "page": 2,
      "sourceId": "sci-41-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 얼 때 무게 변화",
      "concept": "물이 얼어도 무게는 변하지 않는다."
    },
    "prompt": "냉동실에 넣기 전 페트병의 무게가 524 g이었을 때 냉동실에 넣어 얼린 후 페트병의 무게로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[07~08] 다음 내용을 보고, 물음에 답하시오. 물이 가득 담긴 페트병을 냉동실에 넣어 얼리면 페트병이 뚱뚱해집니다."
    },
    "choices": [
      "502 g",
      "514 g",
      "524 g",
      "536 g",
      "542 g"
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
    "explanation": "액체인 물이 얼어 고체인 얼음이 될 때 부피는 늘어나지만 무게는 변하지 않습니다. 따라서 냉동실에 넣어 얼린 후 페트병의 무게는 냉동실에 넣기 전 페트병의 무게인 524 g과 같습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o1-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 9,
      "page": 2,
      "sourceId": "sci-41-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음이 녹을 때 부피 변화",
      "concept": "얼음이 녹아 물이 되면 부피가 줄어든다."
    },
    "prompt": "위와 같은 현상이 나타나는 까닭을 물의 상태 변화와 관련지어 쓰시오.",
    "givens": {
      "지문": "[09~10] 다음과 같이 꽁꽁 언 튜브형 얼음과자가 녹으면 튜브 안에 빈 공간이 생깁니다. 물음에 답하시오."
    },
    "choices": null,
    "figure": "assets/bank/s41-u02/s1-q09.webp",
    "figureNote": "꽁꽁 언 튜브형 얼음과자(노란색, 입구까지 가득 참)와 녹은 뒤의 얼음과자(입구 쪽에 빈 공간이 생김)를 화살표로 비교하고, 입구 부분을 원으로 확대한 그림",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "얼음이 녹아 물이 될 때 부피가 줄어들기 때문이다.",
      "rubric": {
        "required": [
          "얼음이 녹을 때 부피가 줄어든다는 내용"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "얼음이 녹아 물이 될 때 부피가 줄어든다는 내용이 포함되어 있으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "고체인 얼음이 녹아 액체인 물이 될 때 부피가 줄어듭니다. 따라서 꽁꽁 언 튜브형 얼음과자가 녹으면 얼음과자의 부피가 줄어들어 빈 공간이 생깁니다.\n[채점 기준] 얼음이 녹아 물이 될 때 부피가 줄어든다는 내용이 포함되어 있으면 정답으로 합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준에 비율(%)이 인쇄되어 있지 않아 ratio를 null로 둠."
    }
  },
  {
    "id": "s41-u02-o1-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 10,
      "page": 2,
      "sourceId": "sci-41-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음이 녹을 때 부피가 줄어드는 예",
      "concept": "얼음이 녹아 물이 되면 부피가 줄어 높이가 낮아진다."
    },
    "prompt": "다음 <보기>에서 위 현상과 관련된 예로 알맞은 것을 골라 기호를 쓰시오.",
    "givens": {
      "지문": "[09~10] 다음과 같이 꽁꽁 언 튜브형 얼음과자가 녹으면 튜브 안에 빈 공간이 생깁니다. 물음에 답하시오.",
      "보기": [
        "㉠ 겨울철 장독에 넣어 둔 물이 얼어 장독이 깨진다.",
        "㉡ 겨울에 바위틈에 있던 물이 얼면서 바위가 쪼개진다.",
        "㉢ 한겨울에 수도관에 설치된 수도 계량기가 얼어서 터진다.",
        "㉣ 얼음 틀 위로 올라와 있던 얼음이 녹으면 높이가 낮아진다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s41-u02/s1-q09.webp",
    "figureNote": "꽁꽁 언 튜브형 얼음과자(노란색, 입구까지 가득 참)와 녹은 뒤의 얼음과자(입구 쪽에 빈 공간이 생김)를 화살표로 비교하고, 입구 부분을 원으로 확대한 그림",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉣",
      "accepted": [
        "㉣",
        "ㄹ",
        "얼음 틀 위로 올라와 있던 얼음이 녹으면 높이가 낮아진다."
      ]
    },
    "explanation": "꽁꽁 언 튜브형 얼음과자가 녹으면 얼음과자의 부피가 줄어들어 빈 공간이 생깁니다. 얼음 틀 위로 올라와 있던 얼음이 녹으면 부피가 줄어들기 때문에 높이가 낮아집니다. 겨울철 장독에 넣어 둔 물이 얼어 장독이 깨지는 것, 겨울에 바위틈에 있던 물이 얼면서 바위가 쪼개지는 것, 한겨울에 수도관에 설치된 수도 계량기가 얼어서 터지는 것은 물이 얼어 얼음이 되면서 부피가 늘어나는 예입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o1-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 11,
      "page": 2,
      "sourceId": "sci-41-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "증발에 의한 물의 높이 변화",
      "concept": "햇볕이 드는 곳에 둔 물은 증발하여 물의 높이가 낮아진다."
    },
    "prompt": "시간이 지남에 따라 나타나는 물의 변화로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[11~12] 물을 반 정도 넣은 비커에 검은색 펜으로 물의 높이를 표시한 후 비커를 햇볕이 잘 드는 곳에 놓아두고 하루 동안 물의 변화를 관찰하였습니다. 물음에 답하시오."
    },
    "choices": [
      "아무 변화가 없다.",
      "물의 높이가 낮아진다.",
      "물의 색깔이 검게 변한다.",
      "물 표면이 울퉁불퉁해진다.",
      "물속에서 큰 기포가 계속 올라온다."
    ],
    "figure": "assets/bank/s41-u02/s1-q11.webp",
    "figureNote": "물이 반 정도 담긴 비커의 수면 위치에 검은색 펜으로 표시한 그림",
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
    "explanation": "햇볕이 잘 드는 곳에 비커를 놓아두면 물 표면에서 물이 수증기로 변해 공기 중으로 날아가 물의 높이가 낮아집니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o1-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 12,
      "page": 2,
      "sourceId": "sci-41-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "증발의 상태 변화",
      "concept": "증발은 물 표면에서 액체인 물이 기체인 수증기로 변하는 현상이다."
    },
    "prompt": "위 실험에서 나타나는 물의 상태 변화로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[11~12] 물을 반 정도 넣은 비커에 검은색 펜으로 물의 높이를 표시한 후 비커를 햇볕이 잘 드는 곳에 놓아두고 하루 동안 물의 변화를 관찰하였습니다. 물음에 답하시오."
    },
    "choices": [
      "고체에서 액체로 상태가 변한다.",
      "고체에서 기체로 상태가 변한다.",
      "액체에서 기체로 상태가 변한다.",
      "액체에서 고체로 상태가 변한다.",
      "기체에서 고체로 상태가 변한다."
    ],
    "figure": "assets/bank/s41-u02/s1-q11.webp",
    "figureNote": "물이 반 정도 담긴 비커의 수면 위치에 검은색 펜으로 표시한 그림",
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
    "explanation": "비커에 담긴 물의 표면에서 액체인 물이 기체인 수증기로 변하는 상태 변화가 나타납니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o1-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 13,
      "page": 3,
      "sourceId": "sci-41-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "증발의 뜻",
      "concept": "증발은 물 표면에서 액체인 물이 기체인 수증기로 변하는 현상이다."
    },
    "prompt": "다음 ㉠~㉢에 들어갈 알맞은 말을 골라 쓰시오.",
    "givens": {
      "지문": "물 ㉠ ( 속, 표면 )에서 액체인 물이 ㉡ ( 고체, 기체 )인 ㉢ ( 얼음, 수증기 )(으)로 변하는 현상을 증발이라고 합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 표면, ㉡ 기체, ㉢ 수증기",
      "accepted": [
        "㉠ 표면, ㉡ 기체, ㉢ 수증기",
        "표면, 기체, 수증기",
        "표면 기체 수증기",
        "㉠-표면, ㉡-기체, ㉢-수증기"
      ]
    },
    "explanation": "물 표면에서 액체인 물이 기체인 수증기로 변하는 현상을 증발이라고 합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o1-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 14,
      "page": 3,
      "sourceId": "sci-41-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "증발과 관련된 예",
      "concept": "염전에서 소금을 얻거나 빨래를 말리는 것은 증발을 이용한 예이다."
    },
    "prompt": "다음 <보기>에서 증발과 관련된 예를 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 염전에서 소금을 만든다.",
        "㉡ 겨울에 호수의 물이 언다.",
        "㉢ 젖은 빨래를 건조대에 널어 말린다.",
        "㉣ 추운 날 버스 안의 유리창이 뿌옇게 변한다."
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉢",
      "㉡, ㉣",
      "㉢, ㉣"
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
    "explanation": "증발은 물 표면에서 액체인 물이 기체인 수증기로 상태가 변하는 현상입니다. 염전에서 소금을 만드는 것, 젖은 빨래를 건조대에 널어 말리는 것은 증발과 관련된 예이고, 겨울에 호수의 물이 어는 것은 물이 얼음으로 상태가 변하는 예, 추운 날 버스 안의 유리창이 뿌옇게 변하는 것은 수증기가 물로 상태가 변하는 예입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o1-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 15,
      "page": 3,
      "sourceId": "sci-41-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "증발과 끓음의 공통점",
      "concept": "증발과 끓음은 모두 물이 수증기로 변하지만, 물속에서도 변하는 것은 끓음뿐이다."
    },
    "prompt": "증발과 끓음의 공통점에 대해 잘못 말한 사람의 이름을 쓰시오.",
    "givens": {
      "지문": "• 단비: 물 표면과 물속에서 물이 수증기로 변합니다.\n• 다래: 액체가 기체로 변하는 상태 변화가 일어납니다.\n• 하늘: 물이 수증기로 상태가 변해 공기 중으로 흩어집니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "단비",
      "accepted": [
        "단비"
      ]
    },
    "explanation": "증발과 끓음은 모두 액체인 물이 기체인 수증기로 상태가 변해 공기 중으로 흩어집니다. 증발은 물 표면에서 물이 수증기로 변하고, 끓음은 물 표면과 물속에서 물이 수증기로 변합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「잘못」에 밑줄. 지문의 이름(단비·다래·하늘)은 굵게 인쇄됨."
    }
  },
  {
    "id": "s41-u02-o1-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 16,
      "page": 3,
      "sourceId": "sci-41-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음이 든 비커 바깥 면의 변화",
      "concept": "얼음이 든 차가운 비커 바깥 면에 공기 중 수증기가 물방울로 맺힌다."
    },
    "prompt": "위 실험에서 관찰할 수 있는 결과로 알맞은 것을 두 가지 고르시오.",
    "givens": {
      "지문": "[16~17] 다음 실험 과정을 보고, 물음에 답하시오.",
      "과정": [
        "(가) 얼음이 든 비커의 입구를 비닐 랩으로 막습니다.",
        "(나) 비커 표면을 깨끗하게 닦은 다음 페트리 접시에 올려놓고 무게를 측정합니다.",
        "(다) 시간이 지남에 따라 비커의 바깥 면에서 일어나는 변화를 관찰합니다.",
        "(라) 10분 후 페트리 접시에 올려놓은 비커의 무게를 측정합니다."
      ]
    },
    "choices": [
      "아무 변화가 없다.",
      "페트리 접시에 물이 고인다.",
      "비닐 랩이 액체 상태로 변한다.",
      "비커의 바깥 면에 물방울이 맺힌다.",
      "페트리 접시에서 얼음이 만들어진다."
    ],
    "figure": "assets/bank/s41-u02/s1-q16.webp",
    "figureNote": "입구를 비닐 랩으로 막은 얼음이 든 비커를 페트리 접시에 올려 전자저울 위에 놓은 그림(<과정> 상자 안)",
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
    "explanation": "시간이 지남에 따라 비커의 바깥 면에 물방울이 맺히고, 물방울이 페트리 접시로 흘러 물이 고입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o1-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 17,
      "page": 3,
      "sourceId": "sci-41-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "응결 전후 비커의 무게 비교",
      "concept": "공기 중 수증기가 비커 표면에 응결해 붙으므로 비커의 무게가 늘어난다."
    },
    "prompt": "다음은 (나)와 (라) 과정에서 측정한 비커의 무게를 비교한 것입니다. (    ) 안에 들어갈 알맞은 말을 골라 쓰시오.",
    "givens": {
      "지문": "[16~17] 다음 실험 과정을 보고, 물음에 답하시오.",
      "과정": [
        "(가) 얼음이 든 비커의 입구를 비닐 랩으로 막습니다.",
        "(나) 비커 표면을 깨끗하게 닦은 다음 페트리 접시에 올려놓고 무게를 측정합니다.",
        "(다) 시간이 지남에 따라 비커의 바깥 면에서 일어나는 변화를 관찰합니다.",
        "(라) 10분 후 페트리 접시에 올려놓은 비커의 무게를 측정합니다."
      ],
      "비교": "각 과정에서 측정한 비커의 무게를 비교하면 (라) 과정에서 측정한 비커의 무게가 (나) 과정에서 측정한 비커의 무게보다 ( 가볍, 무겁 )습니다."
    },
    "choices": null,
    "figure": "assets/bank/s41-u02/s1-q16.webp",
    "figureNote": "입구를 비닐 랩으로 막은 얼음이 든 비커를 페트리 접시에 올려 전자저울 위에 놓은 그림(<과정> 상자 안)",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "무겁",
      "accepted": [
        "무겁",
        "무겁습니다",
        "무겁다"
      ]
    },
    "explanation": "공기 중의 수증기가 차가운 비커 표면에 닿아 액체인 물로 변하여 비커의 바깥 면에 맺히기 때문에 (라) 과정에서 측정한 비커의 무게는 (나) 과정에서 측정한 비커의 무게보다 무겁습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 빈 괄호는 「(       )」로 인쇄됨(공백 길이 임의)."
    }
  },
  {
    "id": "s41-u02-o1-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 18,
      "page": 4,
      "sourceId": "sci-41-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T10",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "이슬이 맺히는 까닭(응결)",
      "concept": "공기 중의 수증기가 차가운 풀잎에 닿아 물로 응결한 것이 이슬이다."
    },
    "prompt": "다음은 이른 아침 풀잎에 이슬이 맺힌 모습입니다. 이슬이 맺히는 까닭을 물의 상태 변화와 관련지어 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-u02/s1-q18.webp",
    "figureNote": "물방울(이슬)이 맺힌 초록색 풀잎 사진",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "공기 중의 수증기가 차가운 풀잎에 닿아 응결해 물로 변하기 때문에 이슬이 맺힌다.",
      "rubric": {
        "required": [
          "수증기가 응결해 이슬이 맺힌다는 내용"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "수증기가 응결해 이슬이 맺힌다는 내용이 포함되어 있으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "공기 중의 수증기가 새벽에 차가워진 풀잎에 닿으면 물로 변하는 응결이 일어납니다.\n[채점 기준] 수증기가 응결해 이슬이 맺힌다는 내용이 포함되어 있으면 정답으로 합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준에 비율(%)이 인쇄되어 있지 않아 ratio를 null로 둠."
    }
  },
  {
    "id": "s41-u02-o1-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 19,
      "page": 4,
      "sourceId": "sci-41-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물의 이용과 물 부족 현상",
      "concept": "환경 오염으로 이용할 수 있는 물의 양이 줄어 물 부족 현상이 나타난다."
    },
    "prompt": "물의 이용과 물 부족 현상에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "불을 끌 때 물을 이용한다.",
      "전기를 만들 때 물을 이용한다.",
      "인구가 증가하면서 물 이용량이 늘고 있다.",
      "동식물의 생명을 유지하는 데 물이 필요하다.",
      "환경이 오염되어도 우리가 이용할 수 있는 물의 양은 줄지 않는다."
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
    "explanation": "환경이 오염되어 우리가 이용할 수 있는 물의 양이 점점 줄어들고 있기 때문에 물 부족 현상이 나타납니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「않은」에 밑줄."
    }
  },
  {
    "id": "s41-u02-o1-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 20,
      "page": 4,
      "sourceId": "sci-41-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "와카워터의 원리(응결)",
      "concept": "와카워터는 공기 중 수증기가 그물망에 응결해 맺힌 물방울을 모아 물을 얻는 장치이다."
    },
    "prompt": "다음은 와카워터에 대한 설명입니다. (    ) 안에 들어갈 알맞은 말을 골라 쓰시오.",
    "givens": {
      "지문": "공기 중의 수증기가 그물망에서 ( 증발, 끓음, 응결 )하여 물방울로 맺힌 후 바닥에 있는 그릇으로 모여 깨끗한 물을 얻을 수 있습니다."
    },
    "choices": null,
    "figure": "assets/bank/s41-u02/s1-q20.webp",
    "figureNote": "들판에 세워진 와카워터(대나무 틀로 된 꽃병 모양 탑 안에 주황색 그물망) 그림",
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
    "explanation": "와카워터는 물 부족 현상을 해결하기 위한 장치입니다. 공기 중의 수증기가 그물망에서 응결하여 물방울로 맺힌 후 바닥에 있는 그릇으로 모여 깨끗한 물을 얻을 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 빈 괄호는 「(       )」로 인쇄됨(공백 길이 임의)."
    }
  },
  {
    "id": "s41-u02-o2-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 1,
      "page": 1,
      "sourceId": "sci-41-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물의 세 가지 상태",
      "concept": "물은 고체인 얼음, 액체인 물, 기체인 수증기의 세 가지 상태로 존재한다."
    },
    "prompt": "다음은 물의 세 가지 상태를 정리한 표입니다. 빈칸 ㉠, ㉡에 들어갈 말을 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": {
      "표": {
        "얼음": [
          "㉠"
        ],
        "물": [
          "액체"
        ],
        "㉡": [
          "기체"
        ]
      }
    },
    "choices": [
      "고체 / 산소",
      "고체 / 수증기",
      "액체 / 산소",
      "액체 / 수증기",
      "기체 / 수증기"
    ],
    "figure": "assets/bank/s41-u02/s2-q01.webp",
    "figureNote": "2행 3열 표: 첫 행 '얼음 | 물 | ㉡', 둘째 행 '㉠ | 액체 | 기체'. 내용은 givens.표에 옮김.",
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
    "explanation": "물은 고체인 얼음, 액체인 물, 기체인 수증기의 세 가지 상태로 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "선택지는 표 형식(열 머리: ㉠, ㉡)으로 인쇄됨. 각 행을 '① ㉠값 / ㉡값'으로 옮김."
    }
  },
  {
    "id": "s41-u02-o2-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 2,
      "page": 1,
      "sourceId": "sci-41-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "액체인 물의 성질",
      "concept": "액체인 물은 눈에 보이지만 일정한 모양이 없어 손으로 잡을 수 없고 흐르는 성질이 있다."
    },
    "prompt": "다음 <보기>에서 액체인 물에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 눈에 보인다.",
        "㉡ 일정한 모양이 있다.",
        "㉢ 흐르는 성질이 있다.",
        "㉣ 손으로 잡을 수 있다."
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉢",
      "㉡, ㉣",
      "㉢, ㉣"
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
    "explanation": "액체인 물은 눈에 보이고, 모양이 일정하지 않아 손으로 잡을 수 없으며, 흐르는 성질이 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기> 항목 기호가 ㄱ/ㄴ이 아니라 ㉠~㉣(원 문자)로 인쇄됨."
    }
  },
  {
    "id": "s41-u02-o2-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 3,
      "page": 1,
      "sourceId": "sci-41-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "페트리 접시 물방울의 변화(증발)",
      "concept": "물은 시간이 지나면 수증기로 변해 공기 중으로 날아가므로 물방울의 크기와 개수가 줄어든다."
    },
    "prompt": "다음과 같이 페트리 접시에 분무기로 물을 뿌렸습니다. 시간이 지남에 따라 페트리 접시의 물에 어떤 변화가 나타나는지 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-u02/s2-q03.webp",
    "figureNote": "물방울이 흩뿌려진 페트리 접시 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "물이 수증기로 변하여 점점 사라지기 때문에 물방울의 크기와 개수가 줄어든다.",
      "rubric": {
        "required": [
          "물이 수증기로 변해 사라진다는 내용"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "수증기로 변해 사라진다는 내용이 포함되어 있으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "페트리 접시의 물은 시간이 지남에 따라 수증기로 상태가 변하여 공기 중으로 사라집니다.\n[채점 기준] 수증기로 변해 사라진다는 내용이 포함되어 있으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표에 배점 비율이 인쇄되어 있지 않음(단일 기준 '정답으로 합니다'). ratio '100%'는 임의 표기."
    }
  },
  {
    "id": "s41-u02-o2-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 4,
      "page": 1,
      "sourceId": "sci-41-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "인공 눈 만들기와 상태 변화",
      "concept": "스키장에서 인공 눈을 만드는 것은 물이 얼어 얼음으로 변하는 상태 변화를 이용한 것이다."
    },
    "prompt": "스키장에서 인공 눈을 만드는 것과 관련 있는 물의 상태 변화로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "얼음 → 물",
      "물 → 얼음",
      "물 → 수증기",
      "수증기 → 물",
      "얼음 → 수증기"
    ],
    "figure": "assets/bank/s41-u02/s2-q04.webp",
    "figureNote": "눈 덮인 스키장 숲 앞에서 인공 눈 제조기가 눈을 뿜는 사진.",
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
    "explanation": "스키장에서 인공 눈을 만드는 것은 물이 얼음으로 상태가 변하는 예입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o2-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 5,
      "page": 1,
      "sourceId": "sci-41-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "응결의 예 찾기(제습기)",
      "concept": "제습기 사용과 차가운 유리창이 뿌옇게 되는 것은 모두 수증기가 물로 변하는 응결의 예이다."
    },
    "prompt": "다음과 같은 상태 변화와 관련 있는 예를 <보기>에서 골라 기호를 쓰시오.",
    "givens": {
      "지문": "날씨가 습할 때 제습기를 사용합니다.",
      "보기": [
        "㉠ 얼음찜질을 하면 얼음이 녹는다.",
        "㉡ 날씨가 건조할 때 가습기를 사용한다.",
        "㉢ 설거지를 하고 나면 그릇의 물기가 마른다.",
        "㉣ 추운 날 버스 안의 유리창이 뿌옇게 변한다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s41-u02/s2-q05.webp",
    "figureNote": "지문 상자 안, 손가락으로 제습기 윗면의 버튼을 누르는 사진.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉣",
      "accepted": [
        "㉣",
        "ㄹ",
        "추운 날 버스 안의 유리창이 뿌옇게 변한다."
      ]
    },
    "explanation": "날씨가 습할 때 제습기를 사용하는 것, 추운 날 버스 안의 유리창이 뿌옇게 변하는 것은 수증기가 물로 상태가 변하는 예입니다. 얼음찜질을 하면 얼음이 녹는 것은 얼음이 물로 상태가 변하는 예이고, 날씨가 건조할 때 가습기를 사용하는 것, 설거지를 하고 나면 그릇의 물기가 마르는 것은 물이 수증기로 상태가 변하는 예입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o2-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 6,
      "page": 2,
      "sourceId": "sci-41-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "상태 변화의 예 분류",
      "concept": "빙하나 얼음과자가 녹는 것은 고체→액체, 물기가 마르거나 바닷물이 증발하는 것은 액체→기체 상태 변화이다."
    },
    "prompt": "다음 <보기>의 예를 물의 상태 변화에 따라 알맞게 분류한 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 극지방의 빙하가 녹는다.",
        "㉡ 얼음과자가 시간이 지나면 녹는다.",
        "㉢ 물휴지의 뚜껑을 열어 놓으면 물휴지의 물이 마른다.",
        "㉣ 바닷물에서 물이 수증기로 변하면 소금이 만들어진다."
      ]
    },
    "choices": [
      "㉠, ㉡ / ㉢, ㉣",
      "㉠, ㉢ / ㉡, ㉣",
      "㉡, ㉢ / ㉠, ㉣",
      "㉡, ㉣ / ㉠, ㉢",
      "㉢, ㉣ / ㉠, ㉡"
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
    "explanation": "극지방의 빙하가 녹는 것, 얼음과자가 시간이 지나면 녹는 것은 얼음(고체)이 물(액체)로 상태가 변하는 예입니다. 물휴지의 뚜껑을 열어 놓으면 물휴지의 물이 마르는 것, 바닷물에서 물이 수증기로 변하면 소금이 만들어지는 것은 물(액체)이, 수증기(기체)로 상태가 변하는 예입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "선택지는 표 형식(열 머리: '고체 → 액체', '액체 → 기체')으로 인쇄됨. 각 행을 '① 고체→액체 / 액체→기체'로 옮김."
    }
  },
  {
    "id": "s41-u02-o2-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 7,
      "page": 2,
      "sourceId": "sci-41-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 얼 때 무게 변화",
      "concept": "물이 얼어 얼음이 되어도 무게는 변하지 않는다."
    },
    "prompt": "다음은 플라스틱병 속 물을 얼리기 전 무게와 얼린 후 무게를 비교한 것입니다. 빈칸에 들어갈 알맞은 등호(=) 또는 부등호(>, <)를 쓰시오.",
    "givens": {
      "지문": "[07~08] 플라스틱병에 물을 반 정도 넣고 마개를 닫은 다음 플라스틱병을 소금을 섞은 얼음에 넣어 플라스틱병 속 물을 얼렸습니다. 물음에 답하시오.\n얼리기 전 무게 [ ] 얼린 후 무게"
    },
    "choices": null,
    "figure": "assets/bank/s41-u02/s2-q07.webp",
    "figureNote": "마개를 닫은 플라스틱병에 물이 반 정도 들어 있고, 물 높이에 검은 표시가 되어 있는 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "=",
      "accepted": [
        "=",
        "＝",
        "같다"
      ]
    },
    "explanation": "물이 얼어 얼음이 되어도 무게는 변하지 않습니다. 따라서 얼리기 전 플라스틱병의 무게와 얼린 후 플라스틱병의 무게는 같습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "[07~08] 공통 지문과 그림은 07번 위(왼쪽 단)에 인쇄됨. 빈칸은 상자 '얼리기 전 무게 □ 얼린 후 무게'의 네모."
    }
  },
  {
    "id": "s41-u02-o2-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 8,
      "page": 2,
      "sourceId": "sci-41-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 얼 때 부피와 무게 변화",
      "concept": "물이 얼어 얼음이 되면 부피는 늘어나지만 무게는 변하지 않는다."
    },
    "prompt": "위 실험을 통해 알 수 있는 내용으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[07~08] 플라스틱병에 물을 반 정도 넣고 마개를 닫은 다음 플라스틱병을 소금을 섞은 얼음에 넣어 플라스틱병 속 물을 얼렸습니다. 물음에 답하시오."
    },
    "choices": [
      "물이 얼어 얼음이 될 때 부피와 무게는 변하지 않는다.",
      "물이 얼어 얼음이 될 때 부피는 늘어나지만 무게는 변하지 않는다.",
      "물이 얼어 얼음이 될 때 부피는 줄어들지만 무게는 변하지 않는다.",
      "물이 얼어 얼음이 될 때 무게는 늘어나지만 부피는 변하지 않는다.",
      "물이 얼어 얼음이 될 때 무게는 줄어들지만 부피는 변하지 않는다."
    ],
    "figure": "assets/bank/s41-u02/s2-q07.webp",
    "figureNote": "마개를 닫은 플라스틱병에 물이 반 정도 들어 있고, 물 높이에 검은 표시가 되어 있는 그림.",
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
    "explanation": "플라스틱병 속 물을 얼리면 처음 물의 높이보다 얼음의 높이가 더 높아지는데, 이를 통해 물이 얼어 얼음이 될 때 부피가 늘어난다는 것을 알 수 있습니다. 또한, 무게 비교를 통해 물이 얼어 얼음이 될 때 무게는 변하지 않는다는 것을 알 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "문항 08은 오른쪽 단에 있고 공통 지문·그림은 왼쪽 단(같은 쪽)에 있음."
    }
  },
  {
    "id": "s41-u02-o2-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 9,
      "page": 2,
      "sourceId": "sci-41-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음이 녹을 때 부피와 무게 변화",
      "concept": "얼음이 녹아 물이 되면 부피는 줄어들지만 무게는 변하지 않는다."
    },
    "prompt": "얼음이 녹아 물이 될 때 나타나는 변화에 대해 바르게 설명한 사람을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "지문": "• 단비: 부피가 늘어납니다.\n• 다래: 부피가 줄어듭니다.\n• 하늘: 무게가 늘어납니다.\n• 노을: 무게가 줄어듭니다.\n• 보라: 무게가 변하지 않습니다."
    },
    "choices": [
      "단비, 하늘",
      "단비, 보라",
      "다래, 하늘",
      "다래, 노을",
      "다래, 보라"
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
    "explanation": "고체인 얼음이 녹아 액체인 물이 될 때 부피는 줄어들지만 무게는 변하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "상자 안 이름(단비·다래·하늘·노을·보라)은 굵은 글씨."
    }
  },
  {
    "id": "s41-u02-o2-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 10,
      "page": 2,
      "sourceId": "sci-41-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "부피 변화의 예 구별",
      "concept": "수도 계량기가 터지는 것은 물이 얼며 부피가 늘어난 예이고, 얼음이 녹으면 부피가 줄어든다."
    },
    "prompt": "물의 부피 변화가 나머지 넷과 다른 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "한겨울에 수도관에 설치된 수도 계량기가 얼어서 터진다.",
      "얼음 틀 위로 올라와 있던 얼음이 녹으면 높이가 낮아진다.",
      "꽁꽁 언 튜브형 얼음과자가 녹으면 튜브 안에 빈 공간이 생긴다.",
      "냉동실에서 꺼낸 언 요구르트의 부피가 시간이 지나면서 줄어든다.",
      "물이 얼어 부푼 페트병을 냉동실에서 꺼내 놓으면 부피가 줄어든다."
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
    "explanation": "①은 물이 얼어 부피가 늘어나는 예이고, ②, ③, ④, ⑤는 얼음이 녹아 부피가 줄어드는 예입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o2-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 11,
      "page": 3,
      "sourceId": "sci-41-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "증발 실험 결과",
      "concept": "햇볕에 둔 물은 표면에서 증발해 양과 높이가 줄어들 뿐, 끓을 때처럼 물속에서 기포가 생기지는 않는다."
    },
    "prompt": "다음 <보기>에서 실험의 결과로 알맞지 않은 것을 골라 기호를 쓰시오.",
    "givens": {
      "지문": "[11~12] 비커에 물을 반 정도 넣고 검은색 펜으로 물의 높이를 표시한 후 하루 동안 비커를 햇볕이 잘 드는 곳에 놓아두고 물의 변화를 관찰하였습니다. 물음에 답하시오.",
      "보기": [
        "㉠ 물의 양이 줄어든다.",
        "㉡ 물이 높이가 낮아진다.",
        "㉢ 물속에서 크고 작은 기포가 계속 올라온다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s41-u02/s2-q11.webp",
    "figureNote": "물이 반 정도 담긴 비커에 물 높이를 검은 선으로 표시한 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉢",
      "accepted": [
        "㉢",
        "ㄷ",
        "물속에서 크고 작은 기포가 계속 올라온다."
      ]
    },
    "explanation": "햇볕이 잘 드는 곳에 하루 동안 비커를 놓아두면 비커에 담긴 물의 표면에서 물이 수증기로 변해 공기 중으로 날아가기 때문에 물의 양이 줄어들면서 물의 높이가 낮아집니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄. <보기> ㉡은 인쇄 그대로 '물이 높이가'(조사 '이')."
    }
  },
  {
    "id": "s41-u02-o2-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 12,
      "page": 3,
      "sourceId": "sci-41-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "증발의 뜻",
      "concept": "물 표면에서 액체인 물이 기체인 수증기로 변하는 현상을 증발이라고 한다."
    },
    "prompt": "다음은 위 실험에 대한 설명입니다. 빈칸에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "[11~12] 비커에 물을 반 정도 넣고 검은색 펜으로 물의 높이를 표시한 후 하루 동안 비커를 햇볕이 잘 드는 곳에 놓아두고 물의 변화를 관찰하였습니다. 물음에 답하시오.\n비커 속 물에 변화가 나타나는 까닭은 물 표면에서 액체인 물이 기체인 수증기로 상태가 변하는 [ ]이/가 일어나기 때문입니다."
    },
    "choices": null,
    "figure": "assets/bank/s41-u02/s2-q11.webp",
    "figureNote": "물이 반 정도 담긴 비커에 물 높이를 검은 선으로 표시한 그림.",
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
    "explanation": "햇볕이 잘 드는 곳에 하루 동안 비커를 놓아두면 비커에 담긴 물의 표면에서 액체인 물이 기체인 수증기로 변하는 증발이 일어납니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o2-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 13,
      "page": 3,
      "sourceId": "sci-41-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 수증기로 변하는 생활 속 예",
      "concept": "감·빨래를 말리거나 물을 끓이는 일에서는 모두 액체인 물이 기체인 수증기로 변한다."
    },
    "prompt": "다음은 <보기>에서 나타나는 공통적인 현상을 정리한 것입니다. 빈칸에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "[13~14] 다음 <보기>를 보고, 물음에 답하시오.\n물이 [ ](으)로 변하는 상태 변화가 일어납니다.",
      "보기": [
        "㉠ ▲ 감 말리기",
        "㉡ ▲ 빨래 말리기",
        "㉢ ▲ 물을 끓여 달걀 삶기"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s41-u02/s2-q13.webp",
    "figureNote": "<보기> 상자 안 사진 3장: ㉠ 처마에 매달아 말리는 감(▲ 감 말리기), ㉡ 빨랫줄에 널린 옷(▲ 빨래 말리기), ㉢ 가스레인지 위 냄비에서 물이 끓는 모습(▲ 물을 끓여 달걀 삶기). 사진 설명 문구는 givens.보기에 옮김.",
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
    "explanation": "감 말리기, 빨래 말리기, 물을 끓여 달걀 삶기에서는 모두 액체인 물이 기체인 수증기로 상태가 변합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 사진 3장과 캡션으로만 이루어짐(같은 쪽 오른쪽 단 위)."
    }
  },
  {
    "id": "s41-u02-o2-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 14,
      "page": 3,
      "sourceId": "sci-41-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "끓을 때 나타나는 변화",
      "concept": "물이 끓을 때는 물 표면뿐 아니라 물속에서도 물이 수증기로 변한다."
    },
    "prompt": "㉢에서 물을 끓일 때 나타나는 변화로 알맞지 않은 것은 어느 것입니까?",
    "givens": {
      "지문": "[13~14] 다음 <보기>를 보고, 물음에 답하시오.",
      "보기": [
        "㉠ ▲ 감 말리기",
        "㉡ ▲ 빨래 말리기",
        "㉢ ▲ 물을 끓여 달걀 삶기"
      ]
    },
    "choices": [
      "보글거리는 소리가 난다.",
      "물속에서 기포가 생긴다.",
      "물속에서만 상태 변화가 일어난다.",
      "시간이 지남에 따라 물의 높이가 낮아진다.",
      "기포가 물 표면으로 올라와 터지면서 물 표면이 울퉁불퉁해진다."
    ],
    "figure": "assets/bank/s41-u02/s2-q13.webp",
    "figureNote": "<보기> 상자 안 사진 3장: ㉠ 처마에 매달아 말리는 감(▲ 감 말리기), ㉡ 빨랫줄에 널린 옷(▲ 빨래 말리기), ㉢ 가스레인지 위 냄비에서 물이 끓는 모습(▲ 물을 끓여 달걀 삶기). 사진 설명 문구는 givens.보기에 옮김.",
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
    "explanation": "물을 끓이면 물의 표면과 물속에서 물이 수증기로 변하는 상태 변화가 일어납니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄."
    }
  },
  {
    "id": "s41-u02-o2-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 15,
      "page": 4,
      "sourceId": "sci-41-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음 비커 바깥 면의 변화(응결)",
      "concept": "공기 중의 수증기가 차가운 비커 표면에 닿으면 물로 변해 바깥 면에 맺힌다."
    },
    "prompt": "10분이 지난 후 비커의 바깥 면을 휴지로 닦아 보았습니다. <보기>에서 이에 대한 설명으로 알맞은 것을 골라 기호를 쓰시오.",
    "givens": {
      "지문": "[15~16] 다음과 같이 비커에 얼음을 넣고 비커의 입구를 비닐 랩으로 막은 후 비커의 바깥 면에서 일어나는 변화를 관찰하였습니다. 물음에 답하시오.",
      "보기": [
        "㉠ 휴지가 따뜻해진다.",
        "㉡ 휴지가 물에 젖는다.",
        "㉢ 휴지가 빨갛게 변한다.",
        "㉣ 휴지에 얼음이 붙어 나온다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s41-u02/s2-q15.webp",
    "figureNote": "얼음이 든 비커의 입구를 비닐 랩으로 덮어 페트리 접시 위에 놓은 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ",
        "휴지가 물에 젖는다."
      ]
    },
    "explanation": "시간이 지남에 따라 공기 중의 수증기가 차가운 비커 표면에 닿아 물로 변해 비커의 바깥 면에 맺힙니다. 따라서 비커의 바깥 면을 휴지로 닦으면 휴지가 물에 젖습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o2-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 16,
      "page": 4,
      "sourceId": "sci-41-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "응결의 뜻",
      "concept": "공기 중의 수증기가 차가운 물체에 닿아 물로 변하는 현상을 응결이라고 한다."
    },
    "prompt": "다음은 위 실험을 통해 알 수 있는 내용입니다. ㉠, ㉡에 들어갈 알맞은 말을 골라 쓰시오.",
    "givens": {
      "지문": "[15~16] 다음과 같이 비커에 얼음을 넣고 비커의 입구를 비닐 랩으로 막은 후 비커의 바깥 면에서 일어나는 변화를 관찰하였습니다. 물음에 답하시오.\n공기 중의 수증기가 ㉠ ( 차가운, 뜨거운 ) 물체에 닿으면 ㉡ ( 물, 얼음 )(으)로 변하는 응결이 일어납니다."
    },
    "choices": null,
    "figure": "assets/bank/s41-u02/s2-q15.webp",
    "figureNote": "얼음이 든 비커의 입구를 비닐 랩으로 덮어 페트리 접시 위에 놓은 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 차가운, ㉡ 물",
      "accepted": [
        "㉠ 차가운, ㉡ 물",
        "㉠차가운, ㉡물",
        "차가운, 물",
        "ㄱ 차가운, ㄴ 물"
      ]
    },
    "explanation": "공기 중의 수증기가 차가운 물체에 닿으면 물로 변하는 응결이 일어납니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o2-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 17,
      "page": 4,
      "sourceId": "sci-41-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T10",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "생활 속 응결의 예",
      "concept": "안개, 이슬, 차가운 거울이나 유리창에 맺히는 물방울은 수증기가 물로 변하는 응결의 예이다."
    },
    "prompt": "우리 생활에서 볼 수 있는 응결의 예를 두 가지 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예) 이른 아침 호수 위에 안개가 낀다. / 맑은 날 새벽 풀잎에 이슬이 맺힌다. / 욕실의 차가운 거울 표면에 물방울이 맺힌다. / 추운 겨울 유리창 안쪽에 물방울이 맺힌다. 등",
      "rubric": {
        "required": [
          "서로 다른 응결의 예 두 가지"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "수증기가 물로 변하는 응결의 예를 두 가지 모두 썼으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "기체인 수증기가 액체인 물로 상태가 변하는 현상을 응결이라고 합니다.\n[채점 기준] 수증기가 물로 변하는 응결의 예를 두 가지 모두 썼으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표에 배점 비율이 인쇄되어 있지 않음(단일 기준 '정답으로 합니다'). ratio '100%'는 임의 표기. 모범 답안은 예시 4개 중 2개를 쓰면 되는 형태."
    }
  },
  {
    "id": "s41-u02-o2-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 18,
      "page": 4,
      "sourceId": "sci-41-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물 부족으로 생기는 일",
      "concept": "물이 부족하면 농작물·동물의 생존과 사람의 위생·건강이 모두 어려워진다."
    },
    "prompt": "우리 생활에서 물이 부족하면 생길 수 있는 일에 대해 잘못 설명한 사람의 이름을 쓰시오.",
    "givens": {
      "지문": "• 단비: 농작물이 잘 자라지 못할 수 있습니다.\n• 다래: 몸을 깨끗이 씻어 건강한 삶을 유지할 수 있습니다.\n• 하늘: 동물이 생명을 유지하는 데 어려움이 생길 수 있습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "다래",
      "accepted": [
        "다래"
      ]
    },
    "explanation": "물이 부족하면 몸을 깨끗이 씻지 못해 건강한 삶을 유지하기 어려울 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '잘못'에 밑줄. 상자 안 이름은 굵은 글씨."
    }
  },
  {
    "id": "s41-u02-o2-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 19,
      "page": 4,
      "sourceId": "sci-41-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "솔라볼의 원리",
      "concept": "솔라볼은 햇빛으로 물을 증발시키고 수증기를 벽면에서 응결시켜 깨끗한 물을 얻으므로 햇빛이 잘 드는 곳에 두어야 한다."
    },
    "prompt": "다음은 물 부족 현상을 해결하기 위한 장치인 솔라볼입니다. <보기>에서 솔라볼에 대한 설명으로 알맞지 않은 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 물의 상태 변화를 이용한 장치이다.",
        "㉡ 수증기가 벽면에서 응결하여 깨끗한 물을 얻을 수 있다.",
        "㉢ 햇빛이 잘 비치는 곳보다 그늘진 곳에 두면 깨끗한 물을 더 빠르게 얻을 수 있다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s41-u02/s2-q19.webp",
    "figureNote": "투명한 공 모양 솔라볼 단면 그림: 아래쪽 절반에 갈색 물, 위쪽 투명한 돔, 양옆 가장자리에 파란 물받이와 위쪽 마개.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉢",
      "accepted": [
        "㉢",
        "ㄷ",
        "햇빛이 잘 비치는 곳보다 그늘진 곳에 두면 깨끗한 물을 더 빠르게 얻을 수 있다."
      ]
    },
    "explanation": "솔라볼에 오염된 물을 넣고 햇빛이 잘 비치는 곳에 놓아두면 물이 수증기로 증발하고 수증기가 벽면에서 응결하여 흘러내린 후 가장자리에 모여 깨끗한 물을 얻을 수 있습니다. 솔라볼은 그늘진 곳보다 햇빛이 잘 비치는 곳에 두어야 증발이 잘 일어나 깨끗한 물을 더 빠르게 얻을 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄."
    }
  },
  {
    "id": "s41-u02-o2-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 20,
      "page": 4,
      "sourceId": "sci-41-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "워터콘의 원리",
      "concept": "워터콘은 젖은 흙에서 증발한 수증기가 벽면에서 응결해 흘러내린 물을 모아 깨끗한 물을 얻는다."
    },
    "prompt": "다음은 물 부족 현상을 해결하기 위한 장치인 워터콘에 대한 설명입니다. ㉠, ㉡에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "젖은 흙 위에 덮으면 흙에서 [㉠]한 물이 벽면에서 [㉡]하여 흘러내린 후 가장자리에 모여 깨끗한 물을 얻을 수 있습니다."
    },
    "choices": null,
    "figure": "assets/bank/s41-u02/s2-q20.webp",
    "figureNote": "젖은 흙 위에 덮어 놓은 투명한 원뿔 모양 워터콘 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 증발, ㉡ 응결",
      "accepted": [
        "㉠ 증발, ㉡ 응결",
        "㉠증발, ㉡응결",
        "증발, 응결",
        "ㄱ 증발, ㄴ 응결"
      ]
    },
    "explanation": "워터콘을 젖은 흙 위에 덮으면 흙에서 증발한 물이 벽면에서 응결하여 흘러내린 후 가장자리에 모여 깨끗한 물을 얻을 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o3-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 1,
      "page": 1,
      "sourceId": "sci-41-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "같은 상태의 물 짝 짓기",
      "concept": "눈과 고드름은 고체인 얼음 상태이고, 이슬과 수돗물은 액체인 물 상태이다."
    },
    "prompt": "같은 상태끼리 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": {
      "지문": "[01~02] 다음 여러 가지 상태의 물의 모습을 보고, 물음에 답하시오."
    },
    "choices": [
      "눈, 이슬",
      "눈, 수돗물",
      "이슬, 수돗물",
      "이슬, 고드름",
      "눈, 이슬, 수돗물"
    ],
    "figure": "assets/bank/s41-u02/s3-q01.webp",
    "figureNote": "사진 4장: 눈 덮인 산(▲ 눈), 잎에 맺힌 물방울(▲ 이슬), 수도꼭지에서 흐르는 물(▲ 수돗물), 고드름(▲ 고드름)",
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
    "explanation": "눈과 고드름은 고체 상태, 이슬과 수돗물은 액체 상태입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o3-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 2,
      "page": 1,
      "sourceId": "sci-41-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "여러 가지 상태의 물의 특징",
      "concept": "고체인 얼음은 모양이 일정해 손으로 잡을 수 있지만, 액체인 물은 흘러서 손으로 잡을 수 없다."
    },
    "prompt": "위 여러 가지 상태의 물의 모습에 대한 설명으로 알맞지 않은 것을 두 가지 고르시오.",
    "givens": {
      "지문": "[01~02] 다음 여러 가지 상태의 물의 모습을 보고, 물음에 답하시오."
    },
    "choices": [
      "눈은 모양이 일정하다.",
      "고드름은 차갑고 단단하다.",
      "이슬은 흐르는 성질이 있다.",
      "수돗물은 손으로 잡을 수 있다.",
      "고드름은 손으로 잡을 수 없다."
    ],
    "figure": "assets/bank/s41-u02/s3-q01.webp",
    "figureNote": "사진 4장: 눈 덮인 산(▲ 눈), 잎에 맺힌 물방울(▲ 이슬), 수도꼭지에서 흐르는 물(▲ 수돗물), 고드름(▲ 고드름)",
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
    "explanation": "액체 상태인 수돗물은 손으로 잡을 수 없고, 고체 상태인 고드름은 손으로 잡을 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「않은」에 밑줄."
    }
  },
  {
    "id": "s41-u02-o3-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 3,
      "page": 1,
      "sourceId": "sci-41-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물의 세 가지 상태와 상태 변화",
      "concept": "물은 고체(얼음)·액체(물)·기체(수증기)로 서로 상태가 바뀔 수 있으며, 이를 물의 상태 변화라고 한다."
    },
    "prompt": "다음 ㉠, ㉡에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "액체 상태의 물은 고체 상태인 얼음, 기체 상태인 ㉠(으)로 변할 수 있습니다. 이렇게 물이 다른 상태로 변하는 것을 물의 ㉡(이)라고 합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 수증기, ㉡ 상태 변화",
      "accepted": [
        "㉠ 수증기, ㉡ 상태 변화",
        "㉠ 수증기, ㉡ 상태변화",
        "수증기, 상태 변화",
        "수증기, 상태변화"
      ]
    },
    "explanation": "액체 상태의 물은 고체 상태인 얼음, 기체 상태인 수증기로 변할 수 있습니다. 물은 서로 다른 상태로 변할 수 있는데, 이렇게 물이 다른 상태로 변하는 것을 물의 상태 변화라고 합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "㉠, ㉡은 지문 속 네모 칸. 답란은 「㉠ (     ), ㉡ (     )」."
    }
  },
  {
    "id": "s41-u02-o3-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 4,
      "page": 1,
      "sourceId": "sci-41-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 수증기로 변하는 예",
      "concept": "유리창이 뿌옇게 흐려지는 것은 증발이 아니라 수증기가 물로 변하는 응결의 예이다."
    },
    "prompt": "물이 수증기로 상태가 변하는 예로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "날씨가 건조할 때 가습기를 사용한다.",
      "설거지를 하고 나면 그릇의 물기가 마른다.",
      "추운 날 버스 안의 유리창이 뿌옇게 변한다.",
      "물휴지의 뚜껑을 열어 놓으면 물휴지의 물이 마른다.",
      "바닷물에서 물이 수증기로 변하면 소금이 만들어진다."
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
    "explanation": "추운 날 버스 안의 유리창이 뿌옇게 변하는 것은 수증기가 물로 상태가 변하는 예입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「않은」에 밑줄."
    }
  },
  {
    "id": "s41-u02-o3-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 5,
      "page": 1,
      "sourceId": "sci-41-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "기체에서 액체로 변하는 예",
      "concept": "제습기는 공기 중의 수증기(기체)를 물(액체)로 바꾸어 모으는 응결을 이용한다."
    },
    "prompt": "기체에서 액체로 상태가 변하는 예로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "겨울에 호수의 물이 언다.",
      "얼음찜질을 하면 얼음이 녹는다.",
      "물을 끓여 수증기로 음식을 찐다.",
      "날씨가 습할 때 제습기를 사용한다.",
      "스키장에서 물을 얼려 인공 눈을 만든다."
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
    "explanation": "겨울에 호수의 물이 어는 것, 스키장에서 물을 얼려 인공 눈을 만드는 것은 물(액체)이 얼음(고체)으로 상태가 변하는 예입니다. 얼음찜질을 하면 얼음이 녹는 것은 얼음(고체)이 물(액체)로 상태가 변하는 예입니다. 물을 끓여 수증기로 음식을 찌는 것은 물(액체)이 수증기(기체)로 상태가 변하는 예입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설은 오답 ①②③⑤만 설명하고 정답 ④(제습기)는 직접 설명하지 않음."
    }
  },
  {
    "id": "s41-u02-o3-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 6,
      "page": 1,
      "sourceId": "sci-41-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "소금을 섞은 얼음을 쓰는 까닭",
      "concept": "얼음에 소금을 섞으면 온도가 더 낮아져 물을 빠르게 얼릴 수 있다."
    },
    "prompt": "위 실험에서 소금을 섞은 얼음이 든 비커에 플라스틱병을 넣는 까닭으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[06~07] 다음 실험 과정을 보고, 물음에 답하시오.\n<과정>\n(가) 플라스틱병에 물을 반 정도 넣고 마개를 닫은 다음 물의 높이를 검은색 펜으로 표시합니다.\n(나) 물이 담긴 플라스틱병의 무게를 측정해 봅니다.\n(다) 소금을 섞은 얼음이 든 비커에 플라스틱병을 넣어 얼립니다.\n(라) 물이 완전히 얼면 플라스틱병을 꺼내 얼음의 높이를 빨간색 펜으로 표시합니다.\n(마) 플라스틱병의 물기를 닦고 무게를 측정해 봅니다."
    },
    "choices": [
      "물이 더 따뜻해지기 때문이다.",
      "물을 빠르게 얼리기 위해서이다.",
      "물을 수증기로 변화시키기 위해서이다.",
      "플라스틱병 안으로 소금을 넣기 위해서이다.",
      "비커에 든 얼음이 녹지 않게 하기 위해서이다."
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
    "explanation": "소금을 섞은 얼음 사이에 물이 든 플라스틱병을 넣으면 그냥 얼음 사이에 넣었을 때보다 더 빠르게 온도가 낮아지기 때문에 물을 빠르게 얼릴 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<과정>은 제목이 붙은 상자 안의 글."
    }
  },
  {
    "id": "s41-u02-o3-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 7,
      "page": 2,
      "sourceId": "sci-41-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 얼 때 부피와 무게 변화",
      "concept": "물이 얼어 얼음이 되면 부피는 늘어나지만 무게는 변하지 않는다."
    },
    "prompt": "위 실험의 결과를 통해 알 수 있는 내용으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[06~07] 다음 실험 과정을 보고, 물음에 답하시오.\n<과정>\n(가) 플라스틱병에 물을 반 정도 넣고 마개를 닫은 다음 물의 높이를 검은색 펜으로 표시합니다.\n(나) 물이 담긴 플라스틱병의 무게를 측정해 봅니다.\n(다) 소금을 섞은 얼음이 든 비커에 플라스틱병을 넣어 얼립니다.\n(라) 물이 완전히 얼면 플라스틱병을 꺼내 얼음의 높이를 빨간색 펜으로 표시합니다.\n(마) 플라스틱병의 물기를 닦고 무게를 측정해 봅니다."
    },
    "choices": [
      "물이 얼면서 부피가 늘어난다.",
      "물이 얼면서 부피가 줄어든다.",
      "물이 얼면서 무게가 무거워진다.",
      "물이 얼면서 무게가 가벼워진다.",
      "물이 얼어도 부피와 무게는 변하지 않는다."
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
    "explanation": "실험에서 얼음의 높이는 처음 물의 높이보다 높아지고, 무게는 변하지 않습니다. 이를 통해 액체인 물이 얼어 고체인 얼음이 될 때 부피는 늘어나지만 무게는 변하지 않는다는 것을 알 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "공통 지문 [06~07]은 1쪽에 있음."
    }
  },
  {
    "id": "s41-u02-o3-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 8,
      "page": 2,
      "sourceId": "sci-41-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음이 녹을 때 무게 변화",
      "concept": "얼음이 녹아 물이 되어도 무게는 변하지 않는다."
    },
    "prompt": "다음은 얼음이 녹을 때의 무게 변화에 대한 설명입니다. <보기>에서 빈칸에 들어갈 알맞은 말을 골라 기호를 쓰시오.",
    "givens": {
      "지문": "고체인 얼음이 녹아 액체인 물이 될 때 무게는 [   ]",
      "보기": [
        "㉠ 줄어듭니다.",
        "㉡ 늘어납니다.",
        "㉢ 변하지 않습니다."
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
      "answer": "㉢",
      "accepted": [
        "㉢",
        "ㄷ",
        "변하지 않습니다.",
        "변하지 않습니다"
      ]
    },
    "explanation": "고체인 얼음이 녹아 액체인 물이 될 때 부피는 줄어들지만 무게는 변하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문 끝 빈칸은 네모 칸으로 인쇄됨([   ]로 표기)."
    }
  },
  {
    "id": "s41-u02-o3-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 9,
      "page": 2,
      "sourceId": "sci-41-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음이 녹을 때 부피 변화(생활 예)",
      "concept": "얼음이 녹아 물이 되면 부피가 줄어들어 높이가 낮아진다."
    },
    "prompt": "다음은 우리 생활에서 볼 수 있는 현상입니다. 이러한 현상이 나타나는 까닭을 물의 상태 변화와 관련지어 쓰시오.",
    "givens": {
      "지문": "얼음 틀 위로 올라와 있던 얼음이 녹으면 높이가 낮아집니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "얼음이 녹아 물이 될 때 부피가 줄어들기 때문이다.",
      "rubric": {
        "required": [
          "얼음이 녹을 때 부피가 줄어든다는 내용"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "얼음이 녹아 물이 될 때 부피가 줄어든다는 내용이 포함되어 있으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "고체인 얼음이 녹아 액체인 물이 될 때 부피가 줄어듭니다. 따라서 얼음 틀 위로 올라와 있던 얼음이 녹으면 부피가 줄어들어 높이가 낮아집니다.\n[채점 기준] 얼음이 녹아 물이 될 때 부피가 줄어든다는 내용이 포함되어 있으면 정답으로 합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준에 비율(%) 표기 없음(단일 기준)."
    }
  },
  {
    "id": "s41-u02-o3-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 10,
      "page": 2,
      "sourceId": "sci-41-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "햇볕에 둔 물의 변화",
      "concept": "햇볕에 둔 물은 표면에서 수증기로 변해 날아가므로 물의 높이가 점점 낮아진다."
    },
    "prompt": "위 실험에서 시간이 지남에 따라 나타나는 변화로 알맞은 것을 두 가지 고르시오.",
    "givens": {
      "지문": "[10~11] 비커에 물을 반 정도 넣고 물의 높이를 표시한 후 비커를 햇볕이 잘 드는 곳에 놓아두었습니다. 물음에 답하시오."
    },
    "choices": [
      "아무 변화 없다.",
      "물의 높이가 점점 낮아진다.",
      "물의 높이가 점점 높아진다.",
      "물이 수증기로 상태가 변한다.",
      "물속에서 큰 기포가 올라온다."
    ],
    "figure": "assets/bank/s41-u02/s3-q10.webp",
    "figureNote": "물이 반 정도 담긴 비커, 물 높이에 검은 표시선",
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
    "explanation": "시간이 지남에 따라 물의 표면에서 물이 수증기로 변해 공기 중으로 날아가 물의 높이가 점점 낮아집니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o3-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 11,
      "page": 2,
      "sourceId": "sci-41-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "증발 확인 실험",
      "concept": "물 표면에서 액체인 물이 기체인 수증기로 변하는 현상을 증발이라고 한다."
    },
    "prompt": "위 실험을 통해 확인할 수 있는 현상으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[10~11] 비커에 물을 반 정도 넣고 물의 높이를 표시한 후 비커를 햇볕이 잘 드는 곳에 놓아두었습니다. 물음에 답하시오."
    },
    "choices": [
      "녹음",
      "얼음",
      "끓음",
      "증발",
      "염전"
    ],
    "figure": "assets/bank/s41-u02/s3-q10.webp",
    "figureNote": "물이 반 정도 담긴 비커, 물 높이에 검은 표시선",
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
    "explanation": "실험을 통해 물 표면에서 액체인 물이 기체인 수증기로 상태가 변하는 증발을 확인할 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기가 3열 2행 배치(①②③ / ④⑤)."
    }
  },
  {
    "id": "s41-u02-o3-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 12,
      "page": 2,
      "sourceId": "sci-41-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 끓을 때 나타나는 변화",
      "concept": "물이 끓으면 표면과 물속에서 수증기로 변해 날아가므로 물의 높이가 처음보다 낮아진다."
    },
    "prompt": "위 실험에서 시간이 지남에 따라 물에 나타나는 변화로 알맞지 않은 것은 어느 것입니까?",
    "givens": {
      "지문": "[12~13] 비커에 물을 반 정도 넣고 물의 높이를 표시한 후 물을 가열 장치를 이용해 끓였습니다. 물음에 답하시오."
    },
    "choices": [
      "보글거리는 소리가 난다.",
      "물 표면이 울퉁불퉁해진다.",
      "기포가 물 표면으로 올라와 터진다.",
      "물속에서 크고 작은 기포가 많이 생긴다.",
      "물이 끓은 후 물의 높이가 처음보다 높아진다."
    ],
    "figure": "assets/bank/s41-u02/s3-q12.webp",
    "figureNote": "가열 장치(검은 원판) 위에 놓인, 물이 반 정도 담기고 높이가 표시된 비커",
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
    "explanation": "물이 끓을 때 물의 표면과 물속에서 물이 수증기로 변해 공기 중으로 날아가기 때문에 물이 끓은 후의 높이는 처음보다 낮아집니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「않은」에 밑줄."
    }
  },
  {
    "id": "s41-u02-o3-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 13,
      "page": 3,
      "sourceId": "sci-41-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "끓음의 뜻",
      "concept": "물 표면과 물속에서 모두 물이 수증기로 변하는 현상을 끓음이라고 한다."
    },
    "prompt": "다음은 위 실험을 통해 알 수 있는 내용입니다. 빈칸에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "[12~13] 비커에 물을 반 정도 넣고 물의 높이를 표시한 후 물을 가열 장치를 이용해 끓였습니다. 물음에 답하시오.\n물을 가열하여 끓이면 물의 표면과 물속에서 물이 수증기로 변합니다. 이렇게 물 표면과 물속에서 모두 액체인 물이 기체인 수증기로 상태가 변하는 현상을 [   ](이)라고 합니다."
    },
    "choices": null,
    "figure": "assets/bank/s41-u02/s3-q12.webp",
    "figureNote": "가열 장치(검은 원판) 위에 놓인, 물이 반 정도 담기고 높이가 표시된 비커",
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
    "explanation": "물 표면과 물속에서 모두 액체인 물이 기체인 수증기로 상태가 변하는 현상을 끓음이라고 합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "공통 지문 [12~13]과 그림은 2쪽에 있음. 지문 속 빈칸은 네모 칸([   ]로 표기)."
    }
  },
  {
    "id": "s41-u02-o3-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 14,
      "page": 3,
      "sourceId": "sci-41-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "증발과 끓음 비교(잘못 고치기)",
      "concept": "빨래가 마르는 것은 끓음이 아니라 증발의 예이며, 끓음은 증발보다 물의 양이 빠르게 줄어든다."
    },
    "prompt": "증발과 끓음에 대해 잘못 설명한 사람의 이름을 쓰고, 해당 내용을 바르게 고쳐 쓰시오.",
    "givens": {
      "지문": "• 단비: 증발과 끓음 모두 물이 수증기로 상태가 변하는 현상입니다.\n• 다래: 젖은 빨래를 건조대에 널어 말리는 것은 끓음과 관련된 예입니다.\n• 하늘: 증발은 물의 양이 천천히 줄어들고, 끓음은 물의 양이 증발할 때보다 빠르게 줄어듭니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "다래, 젖은 빨래를 건조대에 널어 말리는 것은 증발과 관련된 예이다.",
      "rubric": {
        "required": [
          "다래의 설명을 빨래 말리기는 증발이라는 내용으로 고침"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "잘못 설명한 사람은 다래이고, 빨래를 말리는 것은 증발과 관련된 예라는 내용이 포함되어 있으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "증발은 물 표면에서 액체인 물이 기체인 수증기로 상태가 변하는 현상이고, 끓음은 물 표면과 물속에서 모두 액체인 물이 기체인 수증기로 상태가 변하는 현상입니다. 끓음이 일어날 때 증발이 일어날 때보다 물의 양이 빠르게 줄어듭니다.\n[채점 기준] 잘못 설명한 사람은 다래이고, 빨래를 말리는 것은 증발과 관련된 예라는 내용이 포함되어 있으면 정답으로 합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「잘못」에 밑줄. 지문의 이름(단비·다래·하늘)은 굵은 글씨. 채점 기준에 비율(%) 표기 없음."
    }
  },
  {
    "id": "s41-u02-o3-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 15,
      "page": 3,
      "sourceId": "sci-41-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음 비커 바깥 면의 변화",
      "concept": "얼음이 든 비커의 바깥 면은 차가워지고, 공기 중 수증기가 닿아 응결해 투명한 물방울이 맺힌다."
    },
    "prompt": "위 실험에서 시간이 지남에 따라 나타나는 변화로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[15~16] 다음과 같이 비커에 얼음을 넣고 비커의 입구를 비닐 랩으로 막은 후 페트리 접시 위에 올려놓았습니다. 물음에 답하시오."
    },
    "choices": [
      "아무 변화 없다.",
      "페트리 접시가 뜨거워진다.",
      "비커의 바깥 면이 차가워진다.",
      "비커의 바깥 면에 얼음 알갱이가 생긴다.",
      "비커의 바깥 면에 노란색 물방울이 맺힌다."
    ],
    "figure": "assets/bank/s41-u02/s3-q15.webp",
    "figureNote": "얼음이 가득 든 비커의 입구를 비닐 랩으로 막아 페트리 접시 위에 올려놓은 그림",
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
    "explanation": "공기 중의 수증기가 차가운 비커 표면에 닿아 액체인 물로 변하여 비커의 바깥 면에 투명한 물방울로 맺히고, 물방울이 페트리 접시로 흘러 물이 고입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설은 물방울 맺힘을 설명하며, 정답 ③(바깥 면이 차가워짐)을 직접 언급하지는 않음."
    }
  },
  {
    "id": "s41-u02-o3-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 16,
      "page": 3,
      "sourceId": "sci-41-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "응결과 비커의 무게 변화",
      "concept": "공기 중 수증기가 차가운 비커 표면에서 응결해 물방울로 맺히므로 비커의 무게가 무거워진다."
    },
    "prompt": "다음은 위 실험의 결과입니다. ㉠, ㉡에 들어갈 말을 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": {
      "지문": "[15~16] 다음과 같이 비커에 얼음을 넣고 비커의 입구를 비닐 랩으로 막은 후 페트리 접시 위에 올려놓았습니다. 물음에 답하시오.\n비커의 바깥 면에서 ㉠이/가 일어나 물방울이 비커의 바깥 면에 맺히기 때문에 비커의 무게가 ㉡"
    },
    "choices": [
      "증발 / 가벼워집니다.",
      "증발 / 무거워집니다.",
      "응결 / 가벼워집니다.",
      "응결 / 무거워집니다.",
      "응결 / 변하지 않습니다."
    ],
    "figure": "assets/bank/s41-u02/s3-q15.webp",
    "figureNote": "얼음이 가득 든 비커의 입구를 비닐 랩으로 막아 페트리 접시 위에 올려놓은 그림",
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
    "explanation": "기체인 수증기가 액체인 물로 상태가 변하는 현상을 응결이라고 합니다. 공기 중의 수증기가 차가운 비커 표면에 닿아 액체인 물로 변하여 비커의 바깥 면에 맺히기 때문에 비커의 무게가 무거워집니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기는 표(열 머리: ㉠ / ㉡)로 인쇄됨. ㉠, ㉡은 지문 속 네모 칸. 공통 지문 그림은 같은 3쪽 왼쪽 단."
    }
  },
  {
    "id": "s41-u02-o3-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 17,
      "page": 3,
      "sourceId": "sci-41-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "응결과 관련된 자연 현상(이슬, 안개)",
      "concept": "이슬은 차가운 물체 표면에, 안개는 지표면 근처 공기 중에 수증기가 응결해 생긴 작은 물방울이다."
    },
    "prompt": "다음은 응결과 관련된 현상에 대한 설명입니다. ㉠, ㉡에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "• 새벽에 차가워진 나뭇가지나 풀잎 등에 수증기가 응결하여 생긴 작은 물방울을 ㉠(이)라고 합니다.\n• 수증기가 지표면 근처에서 응결하여 공기 중에 작은 물방울 상태로 떠 있는 것을 ㉡(이)라고 합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 이슬, ㉡ 안개",
      "accepted": [
        "㉠ 이슬, ㉡ 안개",
        "이슬, 안개"
      ]
    },
    "explanation": "새벽에 차가워진 나뭇가지나 풀잎 등에 수증기가 응결하여 생긴 작은 물방울을 이슬이라고 하고, 수증기가 지표면 근처에서 응결하여 공기 중에 작은 물방울 상태로 떠 있는 것을 안개라고 합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "㉠, ㉡은 지문 속 네모 칸. 답란은 「㉠ (     ), ㉡ (     )」."
    }
  },
  {
    "id": "s41-u02-o3-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 18,
      "page": 3,
      "sourceId": "sci-41-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물의 이용",
      "concept": "물은 식물과 동물 모두의 생명 유지에 필요하며, 발전·농사·운반·공업 등에 이용된다."
    },
    "prompt": "물의 이용에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "물을 이용해 전기를 만든다.",
      "농사를 지을 때 물을 이용한다.",
      "배로 물건을 운반할 때 물을 이용한다.",
      "공장에서 물건을 만들 때 물을 이용한다.",
      "식물을 키울 때는 물이 필요하지만, 동물을 키울 때는 물이 필요하지 않다."
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
    "explanation": "물은 모든 동식물의 생명을 유지하는 데 필요합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「않은」에 밑줄."
    }
  },
  {
    "id": "s41-u02-o3-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 19,
      "page": 4,
      "sourceId": "sci-41-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물 부족 현상과 해결 장치",
      "concept": "바닷물에서 소금을 없애 깨끗한 물을 얻는 해수 담수화 시설은 이미 개발되어 쓰이고 있다."
    },
    "prompt": "물 부족 현상과 관련된 내용으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "안개 수집기는 물 부족 현상을 해결하기 위한 장치이다.",
      "인구가 증가하면서 물 이용량이 늘어나 물이 부족해지고 있다.",
      "산업이 발달하면서 물 이용량이 늘어나 물이 부족해지고 있다.",
      "환경이 오염되어 우리가 사용할 수 있는 물의 양이 점점 줄어들고 있다.",
      "바닷물을 우리가 사용할 수 있는 깨끗한 물로 만드는 장치가 미래에 개발될 것이다."
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
    "explanation": "바닷물에서 소금 성분이 제거된 깨끗한 물을 얻는 장치를 해수 담수화 시설이라고 합니다. 해수 담수화 시설은 이미 개발되어 물 부족 현상을 해결하기 위해 사용되고 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「않은」에 밑줄."
    }
  },
  {
    "id": "s41-u02-o3-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 20,
      "page": 4,
      "sourceId": "sci-41-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물 부족 해결 장치",
      "concept": "와카워터는 공기 중 수증기가 그물망에서 응결하는 것을 이용하고, 오염된 물을 햇빛으로 정화하는 장치는 솔라볼이다."
    },
    "prompt": "다음 <보기>에서 물 부족 현상을 해결하기 위한 장치에 대한 설명으로 알맞지 않은 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 빗물 저금통: 비가 올 때 빗물을 모아 두는 장치이다.",
        "㉡ 워터콘: 증발과 응결을 이용해 깨끗한 물을 얻을 수 있다.",
        "㉢ 와카워터: 오염된 물을 넣고 햇빛이 비치는 곳에 놓아두면 깨끗한 물을 얻을 수 있다."
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
      "answer": "㉢",
      "accepted": [
        "㉢",
        "ㄷ",
        "와카워터"
      ]
    },
    "explanation": "오염된 물을 넣고 햇빛이 비치는 곳에 놓아 깨끗한 물을 얻는 장치는 솔라볼입니다. 와카워터는 공기 중의 수증기가 그물망에서 응결하는 것을 이용해 깨끗한 물을 얻는 장치입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「않은」에 밑줄."
    }
  },
  {
    "id": "s41-u02-o4-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 1,
      "page": 1,
      "sourceId": "sci-41-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음과 물의 구별",
      "concept": "얼음은 모양이 일정한 고체이고, 물은 일정한 모양이 없어 손으로 잡을 수 없는 액체이다."
    },
    "prompt": "위의 (가), (나)는 얼음과 물 중 무엇에 해당하는지 쓰시오.",
    "givens": {
      "지문": "[01~02] 다음은 얼음과 물을 관찰한 결과를 정리한 것입니다. 물음에 답하시오.",
      "표": {
        "구분": [
          "모양",
          "손으로 만졌을 때의 특징"
        ],
        "(가)": [
          "모양이 일정함.",
          "㉠"
        ],
        "(나)": [
          "일정한 모양이 없음.",
          "손으로 잡을 수 없음."
        ]
      }
    },
    "choices": null,
    "figure": "assets/bank/s41-u02/s4-q01.webp",
    "figureNote": "얼음과 물의 관찰 결과 표: 구분/(가)/(나) 열, 모양·손으로 만졌을 때의 특징 행. (가) 특징 칸은 ㉠.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(가) 얼음, (나) 물",
      "accepted": [
        "(가) 얼음, (나) 물",
        "(가)얼음, (나)물",
        "얼음, 물",
        "얼음/물"
      ]
    },
    "explanation": "얼음은 모양이 일정하고, 물은 모양이 일정하지 않으며 손으로 잡을 수 없습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "표의 열 머리는 '(가)', '(나)'로 괄호 표기되어 인쇄됨."
    }
  },
  {
    "id": "s41-u02-o4-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 2,
      "page": 1,
      "sourceId": "sci-41-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음을 만졌을 때의 특징",
      "concept": "얼음을 손으로 만지면 차갑고 단단하게 느껴진다."
    },
    "prompt": "위의 ㉠에 들어갈 특징으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[01~02] 다음은 얼음과 물을 관찰한 결과를 정리한 것입니다. 물음에 답하시오.",
      "표": {
        "구분": [
          "모양",
          "손으로 만졌을 때의 특징"
        ],
        "(가)": [
          "모양이 일정함.",
          "㉠"
        ],
        "(나)": [
          "일정한 모양이 없음.",
          "손으로 잡을 수 없음."
        ]
      }
    },
    "choices": [
      "차갑고 단단하다.",
      "따뜻하고 단단하다.",
      "손에서 흘러내린다.",
      "손으로 잡을 수 없다.",
      "따뜻하고 물렁물렁하다."
    ],
    "figure": "assets/bank/s41-u02/s4-q01.webp",
    "figureNote": "얼음과 물의 관찰 결과 표: 구분/(가)/(나) 열, 모양·손으로 만졌을 때의 특징 행. (가) 특징 칸은 ㉠.",
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
    "explanation": "얼음을 손으로 만지면 차갑고 단단한 것을 느낄 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o4-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 3,
      "page": 1,
      "sourceId": "sci-41-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "수증기의 성질",
      "concept": "수증기는 눈에 보이지 않고 일정한 모양이 없는 기체 상태의 물이다."
    },
    "prompt": "다음에서 설명하는 것이 무엇인지 <보기>에서 골라 쓰시오.",
    "givens": {
      "지문": "• 눈에 보이지 않습니다.\n• 일정한 모양이 없습니다.",
      "보기": [
        "물",
        "얼음",
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
        "수증기",
        "수 증기"
      ]
    },
    "explanation": "얼음은 눈에 보이며, 일정한 모양이 있습니다. 물은 눈에 보이며, 일정한 모양이 없습니다. 수증기는 눈에 보이지 않으며, 일정한 모양이 없습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o4-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 4,
      "page": 1,
      "sourceId": "sci-41-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "생활 속 물의 상태 변화 구분",
      "concept": "인공 눈 만들기는 물이 얼음으로 변하는 예이고, 가습기·그릇 마르기·물휴지 마르기·소금 만들기는 물이 수증기로 변하는 예이다."
    },
    "prompt": "물의 상태 변화가 나머지 넷과 다른 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "날씨가 건조할 때 가습기를 사용한다.",
      "스키장에서 물을 이용해 인공 눈을 만든다.",
      "설거지를 하고 나면 그릇의 물기가 마른다.",
      "물휴지의 뚜껑을 열어 놓으면 물휴지의 물이 마른다.",
      "바닷물에서 물이 수증기로 변하면 소금이 만들어진다."
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
    "explanation": "스키장에서 물을 이용해 인공 눈을 만드는 것은 물이 얼음으로 변하는 예입니다. ①, ③, ④, ⑤는 물이 수증기로 변하는 예입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o4-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 5,
      "page": 1,
      "sourceId": "sci-41-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "고드름이 녹고 증발하는 변화",
      "concept": "고드름(고체)은 햇빛을 받으면 녹아 물(액체)이 되고, 그 물은 시간이 지나면 수증기(기체)가 되어 공기 중으로 흩어진다."
    },
    "prompt": "다음과 같이 고드름에 햇빛이 비출 때 나타날 수 있는 변화를 물의 상태 변화와 관련지어 두 가지 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-u02/s4-q05.webp",
    "figureNote": "햇빛이 비치는 하늘 아래 길게 매달린 고드름 사진.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "고체인 고드름이 녹아 액체인 물로 변한다. / 고드름에 맺힌 물방울을 바닥으로 떨어진 후 기체인 수증기로 변한다.",
      "rubric": {
        "required": [
          "고드름이 물로, 물이 수증기로 변하는 두 과정을 설명"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "고드름(고체)에서 물(액체), 물(액체)에서 수증기(기체)로 변한다는 내용이 포함되어 있으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "고체인 고드름이 햇빛을 받으면 녹아 액체인 물로 변하고, 물이 땅으로 떨어진 후 시간이 지나면 기체인 수증기로 변해 공기 중으로 흩어집니다.\n[채점 기준] 고드름(고체)에서 물(액체), 물(액체)에서 수증기(기체)로 변한다는 내용이 포함되어 있으면 정답으로 합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준에 비율(%)이 인쇄되어 있지 않아 ratio를 null로 둠. 모범 답안의 '물방울을 바닥으로'는 인쇄된 그대로 옮김(조사 오기로 보임)."
    }
  },
  {
    "id": "s41-u02-o4-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 6,
      "page": 1,
      "sourceId": "sci-41-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 얼 때 부피와 무게",
      "concept": "물이 얼어 얼음이 되면 부피는 늘어나지만 무게는 변하지 않는다."
    },
    "prompt": "다음은 물이 얼 때 부피와 무게의 변화에 대한 설명입니다. ㉠, ㉡에 들어갈 알맞은 말을 골라 쓰시오.",
    "givens": {
      "지문": "물이 얼어 얼음이 될 때 ㉠ ( 부피, 무게 )는 늘어나지만 ㉡ ( 부피, 무게 )는 변하지 않습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 부피, ㉡ 무게",
      "accepted": [
        "㉠ 부피, ㉡ 무게",
        "㉠부피, ㉡무게",
        "부피, 무게",
        "부피/무게"
      ]
    },
    "explanation": "액체인 물이 얼어 고체인 얼음이 될 때 부피는 늘어나지만 무게는 변하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o4-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 7,
      "page": 2,
      "sourceId": "sci-41-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "얼 때 부피 증가의 생활 예",
      "concept": "음료수가 얼면 부피가 늘어나므로 가득 찬 유리병을 냉동실에 넣으면 병이 깨질 수 있다."
    },
    "prompt": "다음 <보기>에서 음료수가 가득 든 유리병을 냉동실에 넣으면 안 되는 까닭으로 알맞은 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 음료수의 맛이 변하기 때문이다.",
        "㉡ 음료수의 양이 줄어들기 때문이다.",
        "㉢ 유리병의 표면에 물방울이 맺히기 때문이다.",
        "㉣ 음료수의 부피가 늘어나 병이 깨질 수 있기 때문이다."
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
      "answer": "㉣",
      "accepted": [
        "㉣",
        "ㄹ",
        "음료수의 부피가 늘어나 병이 깨질 수 있기 때문이다."
      ]
    },
    "explanation": "음료수가 가득 든 유리병을 냉동실에 넣으면 음료수의 부피가 늘어나 유리병이 깨질 수 있어 위험합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o4-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 8,
      "page": 2,
      "sourceId": "sci-41-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "얼음이 녹을 때 무게",
      "concept": "얼음이 녹아 물이 되어도 무게는 변하지 않는다."
    },
    "prompt": "다음 <보기>에서 물이 얼어 있는 플라스틱병을 녹였을 때 플라스틱병의 무게 변화로 알맞은 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 녹기 전의 무게와 녹은 후의 무게는 같다.",
        "㉡ 녹기 전의 무게가 녹은 후의 무게보다 무겁다.",
        "㉢ 녹기 전의 무게가 녹은 후의 무게보다 가볍다."
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
      "answer": "㉠",
      "accepted": [
        "㉠",
        "ㄱ",
        "녹기 전의 무게와 녹은 후의 무게는 같다."
      ]
    },
    "explanation": "얼음이 녹아 물이 될 때 무게는 변하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o4-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 9,
      "page": 2,
      "sourceId": "sci-41-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "얼고 녹을 때 부피 변화",
      "concept": "물이 얼면 부피가 늘어나고, 얼음이 녹아 물이 되면 부피가 줄어든다."
    },
    "prompt": "다음 ㉠, ㉡에 들어갈 알맞은 말을 골라 쓰시오.",
    "givens": {
      "지문": "물이 얼어 얼음이 되면 부피가 ㉠ ( 줄어들, 늘어나 )고, 얼음이 녹아 물이 되면 부피가 ㉡ ( 줄어듭, 늘어납 )니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 늘어나, ㉡ 줄어듭",
      "accepted": [
        "㉠ 늘어나, ㉡ 줄어듭",
        "㉠늘어나, ㉡줄어듭",
        "늘어나, 줄어듭",
        "늘어나/줄어듭",
        "늘어난다, 줄어든다"
      ]
    },
    "explanation": "액체인 물이 얼어 고체인 얼음이 되면 부피가 늘어나고, 고체인 얼음이 녹아 액체인 물이 되면 부피가 줄어듭니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o4-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 10,
      "page": 2,
      "sourceId": "sci-41-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "상태 변화와 무게",
      "concept": "물이 얼거나 얼음이 녹아도 무게는 변하지 않으므로 보기의 예 모두 무게가 변하지 않는다."
    },
    "prompt": "다음 <보기>에서 무게가 변하는 예를 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 페트병에 물을 가득 넣어 얼린다.",
        "㉡ 물이 얼어 있는 페트병을 녹인다.",
        "㉢ 겨울철 장독에 넣어 둔 물이 언다.",
        "㉣ 꽁꽁 언 튜브형 얼음과자를 냉동실에서 꺼내 녹인다."
      ]
    },
    "choices": [
      "없음.",
      "㉠, ㉡",
      "㉢, ㉣",
      "㉠, ㉡, ㉢",
      "㉠, ㉡, ㉢, ㉣"
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
    "explanation": "물이 얼어 얼음이 되거나, 얼음이 녹아 물이 될 때 부피는 변하지만 무게는 변하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "선택지 번호가 인쇄본에 ① ② ④ ⑤ ⑤ 순으로 찍혀 있음(③ 누락, ⑤ 중복). 인쇄된 그대로 옮김. 정답 ①은 영향 없음."
    }
  },
  {
    "id": "s41-u02-o4-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 11,
      "page": 2,
      "sourceId": "sci-41-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "증발로 물의 높이가 낮아지는 까닭",
      "concept": "물 표면의 물이 수증기로 변해 공기 중으로 날아가면 비커 속 물의 높이가 낮아진다."
    },
    "prompt": "물의 높이가 낮아진 까닭으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[11~12] 물을 반 정도 담은 비커를 햇볕이 잘 드는 곳에 하루 동안 놓아두었더니 물의 높이가 낮아졌습니다. 물음에 답하시오."
    },
    "choices": [
      "물이 비커에 흡수되었기 때문이다.",
      "물이 공기로 변해 물속에 녹았기 때문이다.",
      "물이 얼음으로 변해 비커 벽에 붙었기 때문이다.",
      "물이 얼음으로 변해 바닥에 가라앉았기 때문이다.",
      "물이 수증기로 변해 공기 중으로 날아갔기 때문이다."
    ],
    "figure": "assets/bank/s41-u02/s4-q11.webp",
    "figureNote": "물을 반 정도 담은 비커(왼쪽, '물의 높이' 표시)와 하루 뒤 물의 높이가 낮아진 비커(오른쪽, '처음 높이' 표시)를 화살표로 잇는 그림.",
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
    "explanation": "물을 담은 비커를 햇볕이 잘 드는 곳에 하루 동안 놓아두면 물의 높이가 변하는데, 이는 물의 표면에서 물이 수증기로 변해 공기 중으로 날아가기 때문입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o4-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 12,
      "page": 2,
      "sourceId": "sci-41-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "증발과 관련된 생활 예",
      "concept": "염전의 소금, 말린 과일, 빨래 말리기, 생선 말리기는 증발의 예이고, 끓는 물의 수증기로 주름을 펴는 것은 끓음의 예이다."
    },
    "prompt": "위 실험과 관련된 예로 알맞지 않은 것은 어느 것입니까?",
    "givens": {
      "지문": "[11~12] 물을 반 정도 담은 비커를 햇볕이 잘 드는 곳에 하루 동안 놓아두었더니 물의 높이가 낮아졌습니다. 물음에 답하시오."
    },
    "choices": [
      "염전에서 소금을 만든다.",
      "과일을 말려 말린 과일을 만든다.",
      "젖은 빨래를 건조대에 널어 말린다.",
      "오징어, 생선을 햇볕에 말려서 사용한다.",
      "물이 끓어 생긴 수증기로 옷의 주름을 편다."
    ],
    "figure": "assets/bank/s41-u02/s4-q11.webp",
    "figureNote": "물을 반 정도 담은 비커(왼쪽, '물의 높이' 표시)와 하루 뒤 물의 높이가 낮아진 비커(오른쪽, '처음 높이' 표시)를 화살표로 잇는 그림.",
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
    "explanation": "위 실험은 물 표면에서 액체인 물이 기체인 수증기로 상태가 변하는 증발에 대해 알아보는 실험입니다. ①~④는 증발과 관련된 예이고, ⑤는 끓음과 관련된 예입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄이 그어져 있음."
    }
  },
  {
    "id": "s41-u02-o4-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 13,
      "page": 3,
      "sourceId": "sci-41-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 끓을 때의 변화",
      "concept": "물이 끓을 때는 물속에서 기포가 생겨 올라와 터지고, 물 표면과 물속에서 물이 수증기로 변하는 상태 변화가 일어난다."
    },
    "prompt": "물이 끓을 때 나타나는 변화로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "수증기가 만들어진다.",
      "보글거리는 소리가 난다.",
      "물속에서 크고 작은 기포가 생긴다.",
      "물의 상태 변화가 일어나지 않는다.",
      "기포가 물 표면으로 올라와 터진다."
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
    "explanation": "물을 가열하면 물이 끓으면서 물속에서 크고 작은 기포가 많이 생기고, 보글거리는 소리가 납니다. 또한, 기포가 물 표면으로 올라와 터지면서 물 표면이 울퉁불퉁해집니다.\n물이 끓을 때 물 표면과 물속에서 물이 수증기로 변하는 상태 변화가 일어납니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄이 그어져 있음."
    }
  },
  {
    "id": "s41-u02-o4-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 14,
      "page": 3,
      "sourceId": "sci-41-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "끓음의 뜻",
      "concept": "물 표면과 물속에서 모두 물이 수증기로 변하는 현상을 끓음이라 하고, 표면에서만 일어나는 것은 증발이다."
    },
    "prompt": "다음 (      ) 안에 들어갈 알맞은 말을 골라 쓰시오.",
    "givens": {
      "지문": "물 표면과 물속에서 모두 액체인 물이 기체인 수증기로 변하는 현상을 ( 증발, 끓음 )이라고 합니다."
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
        "끓음",
        "끓 음"
      ]
    },
    "explanation": "물 표면과 물속에서 모두 물이 수증기로 변하는 현상을 끓음이라고 합니다. 증발은 물 표면에서 물이 수증기로 변하는 현상입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 빈 괄호는 인쇄본에서 공백이 있는 '(      )'로 표시됨."
    }
  },
  {
    "id": "s41-u02-o4-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 15,
      "page": 3,
      "sourceId": "sci-41-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "응결로 인한 무게 증가",
      "concept": "얼음이 든 차가운 비커 표면에 공기 중 수증기가 응결해 물방울이 맺히므로 비커의 무게가 늘어난다."
    },
    "prompt": "처음 비커의 무게가 220.6 g이었다고 할 때 10분 후 비커의 무게로 적절한 것은 어느 것입니까?",
    "givens": {
      "지문": "[15~16] 얼음이 든 비커의 입구를 비닐 랩으로 막고, 시간이 지남에 따라 비커의 무게를 측정하였습니다. 물음에 답하시오."
    },
    "choices": [
      "204.4 g",
      "216.6 g",
      "218.5 g",
      "220.6 g",
      "222.8 g"
    ],
    "figure": "assets/bank/s41-u02/s4-q15.webp",
    "figureNote": "얼음이 든 비커의 입구를 비닐 랩으로 막아 전자저울 위에 올려 놓은 그림. 이름표: 비닐 랩, 얼음.",
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
    "explanation": "시간이 지남에 따라 비커의 바깥 면에 물방울이 맺히면서 비커의 무게가 무거워집니다. 이는 공기 중의 수증기가 차가운 비커 표면에 닿아 물로 변하기 때문입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o4-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 16,
      "page": 3,
      "sourceId": "sci-41-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T10",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "생활 속 응결의 예",
      "concept": "안개, 이슬, 차가운 거울이나 유리창에 맺히는 물방울은 수증기가 물로 변하는 응결의 예이다."
    },
    "prompt": "위 실험과 관련하여 우리 생활에서 볼 수 있는 예를 두 가지 쓰시오.",
    "givens": {
      "지문": "[15~16] 얼음이 든 비커의 입구를 비닐 랩으로 막고, 시간이 지남에 따라 비커의 무게를 측정하였습니다. 물음에 답하시오."
    },
    "choices": null,
    "figure": "assets/bank/s41-u02/s4-q15.webp",
    "figureNote": "얼음이 든 비커의 입구를 비닐 랩으로 막아 전자저울 위에 올려 놓은 그림. 이름표: 비닐 랩, 얼음.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예) 이른 아침 호수 위에 안개가 낀다. / 맑은 날 새벽 풀잎에 이슬이 맺힌다. / 욕실의 차가운 거울 표면에 물방울이 맺힌다. / 추운 겨울 유리창 안쪽에 물방울이 맺힌다. 등",
      "rubric": {
        "required": [
          "서로 다른 응결의 예 두 가지 이상"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "응결과 관련된 예를 두 가지 이상 쓰면 정답으로 합니다."
        ]
      }
    },
    "explanation": "기체인 수증기가 액체인 물로 상태가 변하는 응결과 관련된 실험입니다.\n[채점 기준] 응결과 관련된 예를 두 가지 이상 쓰면 정답으로 합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준에 비율(%)이 인쇄되어 있지 않아 ratio를 null로 둠."
    }
  },
  {
    "id": "s41-u02-o4-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 17,
      "page": 3,
      "sourceId": "sci-41-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "구름과 응결",
      "concept": "구름은 수증기가 높은 하늘에서 응결해 작은 물방울 상태로 떠 있는 것이다."
    },
    "prompt": "다음은 구름에 대한 설명입니다. 빈칸에 들어갈 알맞은 말은 어느 것입니까?",
    "givens": {
      "지문": "구름은 수증기가 높은 하늘에서 □하여 작은 물방울 상태로 떠 있는 것입니다."
    },
    "choices": [
      "증발",
      "고체",
      "응결",
      "이슬",
      "끓음"
    ],
    "figure": "assets/bank/s41-u02/s4-q17.webp",
    "figureNote": "산 위 하늘에 뭉게뭉게 피어오른 흰 구름 사진.",
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
    "explanation": "기체인 수증기가 액체인 물로 상태가 변하는 현상을 응결이라고 합니다. 구름은 수증기가 높은 하늘에서 응결하여 작은 물방울 상태로 떠 있는 것입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 빈칸은 인쇄본에서 네모 칸으로 그려져 있어 '□'로 표기함."
    }
  },
  {
    "id": "s41-u02-o4-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 18,
      "page": 3,
      "sourceId": "sci-41-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "이슬이 맺힐 때의 상태 변화",
      "concept": "이슬은 수증기(기체)가 차가운 풀잎에서 응결해 물(액체)로 변한 것이다."
    },
    "prompt": "맑은 날 아침 풀잎에 이슬이 맺힐 때 일어나는 물의 상태 변화로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "고체 → 액체",
      "기체 → 액체",
      "액체 → 고체",
      "액체 → 기체",
      "기체 → 고체"
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
    "explanation": "이슬은 새벽에 차가워진 나뭇가지나 풀잎 등에 수증기가 응결하여 생기는 작은 물방울입니다. 응결은 기체인 수증기가 액체인 물로 상태가 변하는 현상입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o4-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 19,
      "page": 4,
      "sourceId": "sci-41-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 중요한 까닭",
      "concept": "물은 생명 유지에 필요하고 물건 제조·운반과 전기 생산에도 쓰여 우리 생활에 매우 중요하다."
    },
    "prompt": "다음 <보기>에서 물이 중요한 까닭을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 전기를 만들 때 이용되기 때문이다.",
        "㉡ 물건을 만들거나 운반할 때 이용되기 때문이다.",
        "㉢ 모든 동식물이 생명을 유지하는 데 필요하기 때문이다."
      ]
    },
    "choices": [
      "㉠",
      "㉡",
      "㉠, ㉡",
      "㉡, ㉢",
      "㉠, ㉡, ㉢"
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
    "explanation": "물은 모든 동식물의 생명을 유지하는 데 필요하며, 물건을 만들거나 운반할 때, 전기를 만들 때 이용됩니다. 물은 우리가 살아가는 데 매우 중요한 역할을 합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u02-o4-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 20,
      "page": 4,
      "sourceId": "sci-41-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅱ. 물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물 부족 해결 장치",
      "concept": "해수 담수화 시설은 바닷물을 끓여 생긴 수증기를 식혀 소금이 없는 깨끗한 물을 얻는 장치이다."
    },
    "prompt": "다음에서 설명하는 장치는 무엇입니까?",
    "givens": {
      "지문": "바닷물을 끓여 얻은 수증기를 식혀 바닷물의 소금 성분이 제거된 깨끗한 물을 얻을 수 있습니다."
    },
    "choices": [
      "워터콘",
      "와카워터",
      "빗물 저금통",
      "안개 수집기",
      "해수 담수화 시설"
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
    "explanation": "해수 담수화 시설은 바닷물을 끓여 얻은 수증기를 식혀 바닷물의 소금 성분이 제거된 깨끗한 물을 얻는 장치입니다. 워터콘은 젖은 흙에서 깨끗한 물을 얻는 장치, 와카워터는 공기 중 수증기를 모아 깨끗한 물을 얻는 장치, 빗물 저금통은 비가 올 때 빗물을 모아 두는 장치, 안개 수집기는 공기 중에 떠 있는 작은 물방울을 모아 깨끗한 물을 얻는 장치입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  }
];
