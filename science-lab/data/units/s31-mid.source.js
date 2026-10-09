// 3-1 Ⅳ 중간평가 — 단원평가 원문 50문항(시매쓰DMC 중간평가 세트1·2). 시험지를 그대로 옮기고 정답 및 풀이와 대조했다.
// 원장 지시(2026-10-09): 원문을 그대로 문제은행에 쓴다. 그림은 시험지에서 잘라 낸 것(assets/bank/s31-mid/).
export const source = [
  {
    "id": "s31-mid-o1-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 1,
      "page": 1,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "물체의 모양이 변하는 현상",
      "concept": "물체에 힘을 주면 모양이 변하기도 하고 움직임이 변하기도 하며, 누르는 힘은 페트병이나 반죽의 모양을 바꾼다."
    },
    "prompt": "다음 <보기>에서 물체의 모양이 변하는 현상을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 카트를 힘을 주어 민다.",
        "㉡ 의자를 힘을 주어 당긴다.",
        "㉢ 페트병을 힘을 주어 누른다.",
        "㉣ 두꺼운 밀가루 반죽을 힘을 주어 누른다."
      ]
    },
    "choices": [
      "㉢",
      "㉠, ㉡",
      "㉢, ㉣",
      "㉠, ㉡, ㉣",
      "㉡, ㉢, ㉣"
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
    "explanation": "페트병을 힘을 주어 누르면 납작하게 찌그러지고, 두꺼운 밀가루 반죽을 힘을 주어 누르면 반죽이 얇게 펴집니다. 카트를 힘을 주어 밀거나 의자를 힘을 주어 당기면 카트와 의자의 움직임이 변합니다.",
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
    "id": "s31-mid-o1-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 2,
      "page": 1,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "무게와 움직이는 데 드는 힘",
      "concept": "물체가 무거울수록 밀거나 당겨서 움직이는 데 더 큰 힘이 든다."
    },
    "prompt": "밀거나 당겨서 움직일 때 가장 큰 힘이 드는 물체는 어느 것입니까? (단, 책과 바구니 각각의 종류와 무게는 같습니다.)",
    "givens": null,
    "choices": [
      "빈 바구니",
      "책을 한 권 넣은 바구니",
      "책을 두 권 넣은 바구니",
      "책을 다섯 권 넣은 바구니",
      "책을 아홉 권 넣은 바구니"
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
    "explanation": "바구니에 책을 많이 넣을수록 무거워지고, 무거운 물체일수록 밀거나 당겨서 움직일 때 더 큰 힘이 듭니다.",
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
    "id": "s31-mid-o1-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 3,
      "page": 1,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "무게의 뜻",
      "concept": "물체의 가볍고 무거운 정도를 무게라고 한다."
    },
    "prompt": "다음에서 설명하는 것으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "물체의 가볍고 무거운 정도를 말합니다."
    },
    "choices": [
      "길이",
      "무게",
      "부피",
      "크기",
      "수평"
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
    "explanation": "물체의 가볍고 무거운 정도를 무게라고 합니다.",
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
    "id": "s31-mid-o1-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 4,
      "page": 1,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "수평 잡기",
      "concept": "무게가 다른 두 물체로 수평을 잡으려면 무거운 물체를 받침점에 더 가깝게 놓는다."
    },
    "prompt": "다음은 수평대의 나무판자 양쪽 같은 위치에 집게와 지우개를 올려놓은 모습입니다. 나무판자가 수평이 되게 하는 방법으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "집게를 나무판자 아래로 내린다.",
      "지우개를 나무판자 아래로 내린다.",
      "집게와 지우개의 위치를 서로 바꾼다.",
      "집게를 받침점으로부터 가까운 곳으로 옮긴다.",
      "지우개를 받침점으로부터 가까운 곳으로 옮긴다."
    ],
    "figure": "assets/bank/s31-mid/s1-q04.webp",
    "figureNote": "눈금(4 3 2 1 0 1 2 3 4)이 있는 수평대 나무판자의 왼쪽 끝 4에 집게, 오른쪽 끝 4에 지우개가 놓여 있고 나무판자가 집게 쪽(왼쪽)으로 기울어 있다. 라벨 '집게', '지우개'.",
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
    "explanation": "무게가 다른 두 물체를 수평대의 나무판자 양쪽 같은 위치에 올려놓으면 더 무거운 물체 쪽으로 기울어집니다. 이때 더 무거운 물체를 받침점으로부터 가까운 곳에 놓거나 가벼운 물체를 받침점으로부터 먼 곳에 놓으면 나무판자가 수평이 됩니다.\n집게가 지우개보다 무겁기 때문에 집게를 받침점으로부터 가까운 곳으로 옮기면 나무판자가 수평이 되게 할 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "그림에서 나무판자가 집게 쪽으로 기울어 있다는 정보가 집게가 더 무겁다는 근거이다."
    }
  },
  {
    "id": "s31-mid-o1-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 5,
      "page": 1,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "시소에서 무게 비교",
      "concept": "수평을 이룬 시소에서는 받침점에서 먼 곳에 앉은 사람이 더 가볍다."
    },
    "prompt": "단비와 다래 중 더 가벼운 사람의 이름을 쓰시오.",
    "givens": {
      "지문": "[05~06] 다음은 단비와 다래가 시소 양쪽에 각각 앉아 수평이 된 모습입니다. 물음에 답하시오."
    },
    "choices": null,
    "figure": "assets/bank/s31-mid/s1-q05.webp",
    "figureNote": "시소 양쪽에 단비(왼쪽)와 다래(오른쪽)가 앉아 수평을 이룬 그림. 단비는 받침점에 가까운 곳, 다래는 받침점에서 먼 곳에 앉아 있다.",
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
    "explanation": "무게가 다른 두 사람이 수평을 이루었을 때 받침점에서 가까운 곳에 앉은 사람이 받침점에서 먼 곳에 앉은 사람보다 무겁습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "그림상 단비가 받침점에 더 가깝게 앉아 있는 것으로 보임(정답 '다래'와 일치). 위치 판단은 그림에 의존."
    }
  },
  {
    "id": "s31-mid-o1-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 6,
      "page": 1,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "받침점에서 거리 바꾸기",
      "concept": "무거운 사람이 받침점에서 더 먼 곳으로 옮기면 시소는 그 사람 쪽으로 기운다."
    },
    "prompt": "다음 <보기>에서 단비가 시소의 받침점에서 더 먼 곳으로 옮겨 앉았을 때 나타나는 현상으로 알맞은 것을 골라 기호를 쓰시오.",
    "givens": {
      "지문": "[05~06] 다음은 단비와 다래가 시소 양쪽에 각각 앉아 수평이 된 모습입니다. 물음에 답하시오.",
      "보기": [
        "㉠ 시소가 계속 수평을 이룬다.",
        "㉡ 시소가 단비 쪽으로 기울어진다.",
        "㉢ 시소가 다래 쪽으로 기울어진다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s31-mid/s1-q05.webp",
    "figureNote": "시소 양쪽에 단비(왼쪽)와 다래(오른쪽)가 앉아 수평을 이룬 그림. 단비는 받침점에 가까운 곳, 다래는 받침점에서 먼 곳에 앉아 있다.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ",
        "시소가 단비 쪽으로 기울어진다."
      ]
    },
    "explanation": "무게가 다른 두 사람이 시소의 같은 위치에 앉으면 시소가 더 무거운 사람 쪽으로 기울어집니다. 단비가 다래보다 무겁기 때문에 시소가 단비 쪽으로 기울어집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설은 '같은 위치에 앉으면'으로 설명하나 발문은 '더 먼 곳으로 옮겨 앉았을 때'를 묻는다. 정답 ㉡은 어느 쪽으로도 맞음. 해설은 인쇄된 그대로 옮김."
    }
  },
  {
    "id": "s31-mid-o1-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 7,
      "page": 2,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "무게를 정확하게 비교하는 방법",
      "concept": "손으로 어림하는 것보다 저울로 측정해야 무게를 정확하게 비교할 수 있다."
    },
    "prompt": "여러 가지 물체의 무게를 정확하게 비교하는 방법으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "물체를 반복해서 손으로 들어 본다.",
      "물체를 오랜 시간동안 손으로 들어 본다.",
      "저울을 사용해 무게를 측정하여 비교한다.",
      "여러 가지 물체를 한꺼번에 손으로 들어 본다.",
      "물체를 바닥에 떨어뜨렸을 때 나는 소리를 비교한다."
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
    "explanation": "손으로 물체를 들어 물체의 무게를 어림할 수 있지만 여러 물체의 무게를 어림하여 비교하는 것은 정확하지 않습니다. 저울을 사용하면 여러 가지 물체의 무게를 정확하게 비교할 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "② '시간동안'은 붙여 쓴 그대로 옮김."
    }
  },
  {
    "id": "s31-mid-o1-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 8,
      "page": 2,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "용수철저울의 구조",
      "concept": "용수철저울의 영점 조절 나사는 무게를 재기 전에 표시 자를 0에 맞추는 부분이다."
    },
    "prompt": "다음에서 설명하는 용수철저울의 부분으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "무게를 재기 전 표시 자가 눈금 ‘0’을 가리키도록 조절하는 부분입니다."
    },
    "choices": [
      "고리",
      "눈금",
      "용수철",
      "표시 자",
      "영점 조절 나사"
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
    "explanation": "용수철저울에서 무게를 재기 전 표시 자가 눈금 ‘0’을 가리키도록 조절하는 나사는 영점 조절 나사입니다.",
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
    "id": "s31-mid-o1-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 9,
      "page": 2,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "전자저울로 무게 비교",
      "concept": "전자저울 표시판의 숫자가 클수록 더 무거운 물체이다."
    },
    "prompt": "다음은 여러 가지 과일의 무게를 전자저울의 저울판에 각각 올려놓았을 때 표시판에 나타난 숫자를 나타낸 것입니다. 과일을 무거운 순서대로 나열한 것은 어느 것입니까?",
    "givens": {
      "표": {
        "귤": [
          "15 g"
        ],
        "배": [
          "53 g"
        ],
        "사과": [
          "28 g"
        ],
        "망고": [
          "150 g"
        ]
      }
    },
    "choices": [
      "귤 - 배 - 사과 - 망고",
      "배 - 망고 - 귤 - 사과",
      "사과 - 귤 - 배 - 망고",
      "망고 - 사과 - 배 - 귤",
      "망고 - 배 - 사과 - 귤"
    ],
    "figure": "assets/bank/s31-mid/s1-q09.webp",
    "figureNote": "과일 이름(귤·배·사과·망고)과 무게(15 g·53 g·28 g·150 g)를 적은 표. 내용은 givens에 옮김.",
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
    "explanation": "전자저울로 물체의 무게를 측정하였을 때 표시판에 나타나는 숫자가 클수록 더 무거운 물체입니다. 따라서 가장 무거운 과일은 망고이고, 가장 가벼운 과일은 귤입니다.",
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
    "id": "s31-mid-o1-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 10,
      "page": 2,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "지레와 빗면 구분",
      "concept": "받침점이 있는 막대로 물체를 움직이는 도구는 지레, 비스듬히 기울어진 면을 이용하는 도구는 빗면이다."
    },
    "prompt": "다음 <보기>에서 장난감 자동차를 들어 올리는 데 이용한 도구를 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 빗면",
        "㉡ 지레"
      ],
      "지문": "(1) (그림) (    )\n(2) (그림) (    )"
    },
    "choices": null,
    "figure": "assets/bank/s31-mid/s1-q10.webp",
    "figureNote": "(1) 책상 위 받침점에 걸친 긴 막대 한쪽 끝에 장난감 자동차가 있고, 반대쪽 끝을 용수철저울로 당겨 내리는 모습(지레). (2) 상자에 걸쳐 비스듬히 놓인 판자 위의 장난감 자동차를 용수철저울로 끌어 올리는 모습(빗면).",
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
        "(1) 지레 (2) 빗면",
        "지레, 빗면"
      ]
    },
    "explanation": "받침점이 있는 막대를 이용해 물체를 움직일 수 있게 만든 도구를 지레라고 하고, 비스듬하게 기울어진 면을 이용해 물체를 움직일 수 있게 만든 도구를 빗면이라고 합니다.",
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
    "id": "s31-mid-o1-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 11,
      "page": 2,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "빗면을 이용한 사다리차",
      "concept": "사다리차는 빗면을 이용해 무거운 짐을 높은 곳으로 더 작은 힘으로 옮기게 해 준다."
    },
    "prompt": "이사를 할 때 사다리차를 이용하면 좋은 점을 힘과 관련지어 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s31-mid/s1-q11.webp",
    "figureNote": "아파트 벽면을 따라 비스듬히 세워진 사다리차와 짐을 싣는 운반대 사진.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "사다리차를 이용하면 무거운 짐을 높은 곳으로 옮길 때 더 작은 힘으로 옮길 수 있다.",
      "rubric": {
        "required": [
          "무거운 짐을 높은 곳으로 옮긴다",
          "더 작은 힘으로 옮길 수 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "짐을 높은 곳으로 옮길 때 더 작은 힘으로 옮길 수 있다는 내용이 포함되어 있으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "사다리차는 빗면을 이용하는 예로, 사다리차를 이용하면 무거운 짐을 높은 곳으로 옮길 때 더 작은 힘으로 옮길 수 있습니다.\n[채점 기준] 짐을 높은 곳으로 옮길 때 더 작은 힘으로 옮길 수 있다는 내용이 포함되어 있으면 정답으로 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표에 비율(%)이 인쇄되어 있지 않아 ratio를 null로 둠."
    }
  },
  {
    "id": "s31-mid-o1-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 12,
      "page": 3,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "생활 속 지레의 예",
      "concept": "삽·가위·장도리·손톱깎이는 지레를, 나사못은 빗면을 이용한 도구이다."
    },
    "prompt": "우리 생활에서 지레를 이용하는 예로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "삽",
      "가위",
      "장도리",
      "나사못",
      "손톱깎이"
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
    "explanation": "삽, 가위, 장도리, 손톱깎이는 지레를 이용하는 예이고, 나사못은 빗면을 이용하는 예입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄이 있음."
    }
  },
  {
    "id": "s31-mid-o1-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 13,
      "page": 3,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "달팽이의 특징",
      "concept": "달팽이는 등에 딱딱한 껍데기가 있고 다리 없이 미끄러지듯 움직인다."
    },
    "prompt": "다음과 같은 특징을 가진 동물로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 등에 딱딱한 껍데기가 있습니다.\n• 다리가 없고 미끄러지듯이 움직입니다."
    },
    "choices": [
      "금붕어",
      "달팽이",
      "잠자리",
      "딱따구리",
      "무당벌레"
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
    "explanation": "달팽이는 등에 딱딱한 껍데기가 있고, 다리가 없으며, 미끄러지듯이 움직입니다.",
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
    "id": "s31-mid-o1-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 14,
      "page": 3,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "동물 분류 기준",
      "concept": "분류 기준은 누가 분류해도 같은 결과가 나오는 객관적인 기준이어야 한다."
    },
    "prompt": "동물을 특징에 따라 분류할 때 분류 기준으로 알맞지 않은 것을 두 가지 고르시오.",
    "givens": null,
    "choices": [
      "다리가 있는가?",
      "새끼를 낳는가?",
      "무섭게 생겼는가?",
      "몸의 길이가 긴가?",
      "지느러미가 있는가?"
    ],
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        3
      ]
    },
    "explanation": "동물을 특징에 따라 분류할 때 누가 분류하더라도 같은 결과가 나오는 분류 기준을 정해야 합니다. ‘무섭게 생겼는가?’와 ‘몸의 길이가 긴가?’는 분류하는 사람에 따라 분류 결과가 달라질 수 있으므로 분류 기준으로 알맞지 않습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄이 있음."
    }
  },
  {
    "id": "s31-mid-o1-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 15,
      "page": 3,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "분류 기준 찾기",
      "concept": "닭과 참새는 다리가 두 개, 개미와 꿀벌은 다리가 여섯 개라 다리 수로 나눌 수 있다."
    },
    "prompt": "다음과 같이 동물을 분류하였을 때 분류 기준으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "표": {
        "그렇다.": [
          "닭, 참새"
        ],
        "그렇지 않다.": [
          "개미, 꿀벌"
        ]
      }
    },
    "choices": [
      "알을 낳는가?",
      "날개가 있는가?",
      "더듬이가 있는가?",
      "다리가 두 개인가?",
      "발에 물갈퀴가 있는가?"
    ],
    "figure": "assets/bank/s31-mid/s1-q15.webp",
    "figureNote": "분류 결과 표: '그렇다.' 칸에 닭, 참새 / '그렇지 않다.' 칸에 개미, 꿀벌. 내용은 givens에 옮김.",
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
    "explanation": "닭과 참새는 다리가 두 개이고, 개미와 꿀벌은 다리가 여섯 개입니다.",
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
    "id": "s31-mid-o1-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 16,
      "page": 3,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "땅에 사는 동물의 이동 방법",
      "concept": "개·개미·고양이·공벌레는 다리로 걷거나 뛰고, 뱀은 다리가 없어 기어서 이동한다."
    },
    "prompt": "동물이 이동하는 방법이 나머지 넷과 다른 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "개",
      "뱀",
      "개미",
      "고양이",
      "공벌레"
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
    "explanation": "땅에 사는 동물 중에는 다리가 있어 땅 위를 걷거나 뛰어다니는 동물도 있고, 다리가 없어 기어다니는 동물도 있습니다. 개, 개미, 고양이, 공벌레는 다리로 걷거나 뛰어다니고, 뱀은 다리가 없어 기어다닙니다.",
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
    "id": "s31-mid-o1-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 17,
      "page": 3,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "땅속에 사는 동물",
      "concept": "두더지·땅강아지·매미 애벌레는 주로 땅속에 산다."
    },
    "prompt": "다음 <보기>에서 주로 땅속에 사는 동물을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 수달",
        "㉡ 너구리",
        "㉢ 다슬기",
        "㉣ 두더지",
        "㉤ 땅강아지",
        "㉥ 매미 애벌레"
      ]
    },
    "choices": [
      "㉠, ㉡, ㉢",
      "㉡, ㉣, ㉥",
      "㉢, ㉣, ㉤",
      "㉢, ㉤, ㉥",
      "㉣, ㉤, ㉥"
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
    "explanation": "두더지, 땅강아지, 매미 애벌레는 땅속에 사는 동물입니다. 수달과 다슬기는 강이나 호수에 사는 동물이고, 너구리는 땅 위에 사는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 2열 배치(㉠ 수달 | ㉡ 너구리 / ㉢ 다슬기 | ㉣ 두더지 / ㉤ 땅강아지 | ㉥ 매미 애벌레)로 인쇄됨."
    }
  },
  {
    "id": "s31-mid-o1-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 18,
      "page": 4,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "물에 사는 동물의 공통점",
      "concept": "고등어와 피라미는 아가미·지느러미·곡선형 몸을 공통으로 가지지만 피라미는 바다가 아닌 강이나 호수에 산다."
    },
    "prompt": "다음 동물들의 공통적인 특징으로 알맞지 않은 것은 어느 것입니까?",
    "givens": {
      "그림": [
        "▲ 고등어",
        "▲ 피라미"
      ]
    },
    "choices": [
      "아가미가 있다.",
      "바닷속을 헤엄쳐 다닌다.",
      "물속에서 숨을 쉴 수 있다.",
      "여러 개의 지느러미가 있다.",
      "몸의 모양이 부드러운 곡선 형태이다."
    ],
    "figure": "assets/bank/s31-mid/s1-q18.webp",
    "figureNote": "고등어 떼 사진(▲ 고등어)과 피라미 사진(▲ 피라미). 동물 이름은 사진 아래 캡션으로 인쇄되어 givens에 옮김.",
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
    "explanation": "고등어는 바다에 사는 동물이고, 피라미는 강이나 호수에 사는 동물입니다. 고등어와 피라미 모두 아가미가 있어 물속에서 숨을 쉴 수 있고, 여러 개의 지느러미로 헤엄쳐 다니며, 몸이 부드러운 곡선 형태입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄이 있음."
    }
  },
  {
    "id": "s31-mid-o1-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 19,
      "page": 4,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "물갈퀴로 헤엄치는 동물",
      "concept": "개구리는 뒷다리 발가락 사이의 물갈퀴로 물속에서 헤엄친다."
    },
    "prompt": "물속에서 물갈퀴가 있는 발로 헤엄쳐 다니는 동물로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "메기",
      "조개",
      "전복",
      "개구리",
      "돌고래"
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
    "explanation": "개구리는 뒷다리의 발가락 사이에 물갈퀴가 있고, 물속에서 물갈퀴가 있는 발로 헤엄쳐 다닙니다.",
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
    "id": "s31-mid-o1-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 20,
      "page": 4,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "날 수 있는 곤충의 공통점",
      "concept": "나비와 잠자리는 날개가 있고 몸이 머리·가슴·배로 구분되는 곤충이다."
    },
    "prompt": "다음 동물들의 공통적인 특징을 <보기>에서 모두 고른 것은 어느 것입니까?",
    "givens": {
      "그림": [
        "▲ 나비",
        "▲ 잠자리"
      ],
      "보기": [
        "㉠ 날개가 있다.",
        "㉡ 한 쌍의 다리가 있다.",
        "㉢ 날개가 아주 얇아 빨리 날 수 있다.",
        "㉣ 몸이 머리, 가슴, 배의 세 부분으로 구분된다."
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉠, ㉣",
      "㉡, ㉢",
      "㉢, ㉣"
    ],
    "figure": "assets/bank/s31-mid/s1-q20.webp",
    "figureNote": "꽃에 앉은 나비 사진(▲ 나비)과 풀줄기에 앉은 잠자리 사진(▲ 잠자리). 이름은 캡션으로 인쇄되어 givens에 옮김.",
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
    "explanation": "나비와 잠자리는 날 수 있는 곤충으로, 두 쌍의 날개와 세 쌍의 다리가 있습니다. 또한 몸이 머리, 가슴, 배의 세 부분으로 구분됩니다. 날개가 아주 얇아 빨리 날 수 있는 것은 잠자리의 특징입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문 '<보기>에서   모두' 사이 공백이 넓게 인쇄됨(정렬로 인한 것으로 보아 한 칸으로 옮김)."
    }
  },
  {
    "id": "s31-mid-o1-21",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 21,
      "page": 4,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "사막에 사는 낙타",
      "concept": "낙타는 등의 혹에 지방을 저장해 물과 먹이 없이도 며칠을 견딘다."
    },
    "prompt": "다음 ㉠, ㉡에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "낙타는 등의 [㉠]에 [㉡]을/를 저장해 물과 먹이가 없어도 며칠 동안 살 수 있습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 혹, ㉡ 지방",
      "accepted": [
        "㉠ 혹, ㉡ 지방",
        "㉠-혹, ㉡-지방",
        "㉠: 혹, ㉡: 지방",
        "혹, 지방",
        "㉠ 혹 ㉡ 지방",
        "혹 지방",
        "ㄱ 혹, ㄴ 지방"
      ]
    },
    "explanation": "낙타는 사막에 사는 동물로, 등의 혹에 지방을 저장해 물과 먹이가 없어도 며칠 동안 살 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "㉠, ㉡은 지문 안 네모 빈칸으로 인쇄됨([㉠], [㉡]로 표기)."
    }
  },
  {
    "id": "s31-mid-o1-22",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 22,
      "page": 4,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "깊은 바다에 사는 초롱아귀",
      "concept": "초롱아귀는 깊은 바다에 살며 빛을 내는 촉수로 먹이를 유인해 잡아먹는다."
    },
    "prompt": "초롱아귀에 대해 바르게 설명한 사람의 이름을 쓰시오.",
    "givens": {
      "지문": "• 단비: 얕은 바닷속에 사는 동물입니다.\n• 다래: 눈이 없지만 긴 꼬리로 먹이를 찾을 수 있습니다.\n• 하늘: 길고 두꺼운 털로 덮여 있어 추위를 견딜 수 있습니다.\n• 노을: 빛을 내는 촉수가 있어 빛으로 먹이를 유인해 잡아먹습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "노을",
      "accepted": [
        "노을"
      ]
    },
    "explanation": "초롱아귀는 깊은 바닷속에 사는 동물로, 빛을 내는 촉수가 있어 빛으로 먹이를 유인해 잡아먹고, 큰 입과 날카로운 이빨을 가지고 있어 먹이를 한 번 물면 놓치지 않습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "이름(단비·다래·하늘·노을)은 굵은 글씨로 인쇄됨."
    }
  },
  {
    "id": "s31-mid-o1-23",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 23,
      "page": 4,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "극지방에 사는 동물",
      "concept": "눈과 얼음으로 덮이고 매우 추운 극지방에는 펭귄과 바다코끼리가 산다."
    },
    "prompt": "<보기>에서 다음과 같은 환경에 주로 사는 동물을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "지문": "[23~24] 다음 <보기>의 여러 가지 동물을 보고, 물음에 답하시오.\n• 눈과 얼음으로 덮여 있습니다.\n• 바람이 강하게 불며 매우 춥습니다.",
      "보기": [
        "㉠ 펭귄",
        "㉡ 박쥐",
        "㉢ 산양",
        "㉣ 바다코끼리"
      ]
    },
    "choices": [
      "㉡",
      "㉢",
      "㉠, ㉣",
      "㉡, ㉢",
      "㉠, ㉢, ㉣"
    ],
    "figure": "assets/bank/s31-mid/s1-q23.webp",
    "figureNote": "<보기> 상자 속 동물 사진 4장: ㉠ 펭귄 무리, ㉡ 동굴 천장에 매달린 박쥐, ㉢ 바위 비탈의 산양, ㉣ 얼음 위의 바다코끼리. 이름은 캡션으로 인쇄되어 givens 보기에 옮김.",
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
    "explanation": "펭귄과 바다코끼리가 사는 극지방에 대한 설명입니다. 박쥐는 동굴에 사는 동물이고, 산양은 높은 산에 사는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "환경 설명 두 줄은 발문 아래 상자로 인쇄됨; 공통 지문과 합쳐 '지문'에 넣음."
    }
  },
  {
    "id": "s31-mid-o1-24",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 24,
      "page": 5,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "동물의 특징을 이용한 등산화",
      "concept": "절벽에서도 잘 미끄러지지 않는 산양 발바닥의 특징을 본떠 등산화 밑창을 만들었다."
    },
    "prompt": "<보기>에서 잘 미끄러지지 않는 등산화 밑창을 만들 때 이용한 동물을 골라 기호를 쓰고, 이용한 동물의 특징을 쓰시오.",
    "givens": {
      "지문": "[23~24] 다음 <보기>의 여러 가지 동물을 보고, 물음에 답하시오.",
      "보기": [
        "㉠ 펭귄",
        "㉡ 박쥐",
        "㉢ 산양",
        "㉣ 바다코끼리"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s31-mid/s1-q24.webp",
    "figureNote": "산길을 오르는 사람의 등산화 밑창이 보이는 사진(5쪽). <보기>의 동물 사진은 4쪽에 있음(extra 참조).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "㉢, 산양의 발바닥이 절벽에서 잘 미끄러지지 않는 특징을 이용해 잘 미끄러지지 않는 등산화를 만들었다.",
      "rubric": {
        "required": [
          "㉢(산양)을 고른다",
          "산양의 발바닥이 절벽에서 잘 미끄러지지 않는 특징"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "㉢과 산양의 발바닥이 절벽에서 잘 미끄러지지 않는 특징을 이용했다는 내용이 포함되어 있으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "산양은 높은 산에 사는 동물로, 발바닥이 가파른 곳에서 잘 미끄러지지 않습니다. 이러한 특징을 이용해 잘 미끄러지지 않는 등산화 밑창을 만들었습니다.\n[채점 기준] ㉢과 산양의 발바닥이 절벽에서 잘 미끄러지지 않는 특징을 이용했다는 내용이 포함되어 있으면 정답으로 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "문항은 5쪽, 공통 <보기>(사진)는 4쪽에 있음. figure.extra에 4쪽 bbox를 추가함. 채점 기준 표에 비율(%)이 인쇄되어 있지 않아 ratio를 null로 둠."
    }
  },
  {
    "id": "s31-mid-o1-25",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 25,
      "page": 5,
      "sourceId": "sci-31-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "동물의 특징을 생활에 이용한 예",
      "concept": "물체에 잘 붙는 문어 빨판의 특징을 이용해 흡착판을 만들었다."
    },
    "prompt": "다음과 같은 동물의 특징을 이용한 예로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "문어는 빨판이 있어 물체에 잘 붙습니다."
    },
    "choices": [
      "굴착기",
      "물갈퀴",
      "흡착판",
      "집게 차",
      "전신 수영복"
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
    "explanation": "문어의 빨판이 물체에 잘 붙는 특징을 이용해 물체에 잘 붙는 흡착판을 만들었습니다.",
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
    "id": "s31-mid-o2-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 1,
      "page": 1,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "미는 힘과 움직이는 방향",
      "concept": "물체를 밀면 나에게서 멀어지는 쪽으로, 당기면 나에게 가까워지는 쪽으로 움직인다."
    },
    "prompt": "다음 <보기>에서 물체가 나와 멀어지는 방향으로 움직이는 경우를 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 문을 힘을 주어 당긴다.",
        "㉡ 카트를 힘을 주어 당긴다.",
        "㉢ 유아차를 힘을 주어 민다."
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
        "유아차를 힘을 주어 민다."
      ]
    },
    "explanation": "물체를 밀면 물체가 나와 멀어지는 방향으로 움직이고, 물체를 당기면 물체가 나와 가까워지는 방향으로 움직입니다.",
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
    "id": "s31-mid-o2-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 2,
      "page": 1,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "무게와 밀고 당기는 힘의 크기",
      "concept": "같은 상자라도 가벼울수록 밀거나 당겨 움직이는 데 드는 힘이 작다."
    },
    "prompt": "다음 <보기>에서 밀거나 당겨서 움직일 때 더 작은 힘이 드는 것을 골라 기호를 쓰시오. (단, 상자는 같은 상자입니다.)",
    "givens": {
      "보기": [
        "㉠",
        "㉡"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s31-mid/s2-q02.webp",
    "figureNote": "<보기> 상자 안 그림 두 개: ㉠ 장난감(곰 인형·공·자동차 등)이 가득 든 노란 상자, ㉡ 빈 노란 상자.",
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
    "explanation": "물체를 밀거나 당겨서 움직일 때 가벼운 물체일수록 더 작은 힘이 들고, 무거운 물체일수록 더 큰 힘이 듭니다. 따라서 더 가벼운 ㉡을 당길 때 더 작은 힘이 듭니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 글 없이 그림 ㉠·㉡뿐이다."
    }
  },
  {
    "id": "s31-mid-o2-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 3,
      "page": 1,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "수평의 뜻",
      "concept": "수평은 물체가 어느 쪽으로도 기울지 않고 평평한 상태이다."
    },
    "prompt": "수평이란 무엇인지 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "물체가 어느 한쪽으로 기울어지지 않고 평평한 상태를 말한다.",
      "rubric": {
        "required": [
          "어느 한쪽으로 기울어지지 않은(평평한) 상태"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "수평에 대해 바르게 썼으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "수평은 물체가 어느 한쪽으로 기울어지지 않고 평평한 상태를 말합니다.\n[채점 기준] 수평에 대해 바르게 썼으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표에 비율(%)이 인쇄되어 있지 않아 100%로 적었다."
    }
  },
  {
    "id": "s31-mid-o2-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 4,
      "page": 1,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "나무판자 수평 잡기",
      "concept": "받침대를 나무판자의 한가운데에 놓으면 나무판자가 수평이 된다."
    },
    "prompt": "다음의 나무판자를 받침대에 올려 수평을 잡는 방법에 대해 바르게 설명한 사람의 이름을 쓰시오.",
    "givens": {
      "지문": "• 단비: 나무판자의 0을 받침대에 올려놓으면 나무판자가 수평이 됩니다.\n• 다래: 나무판자의 왼쪽 3에 받침대를 올려놓으면 나무판자가 수평이 됩니다.\n• 하늘: 나무판자의 오른쪽 2에 받침대를 올려놓으면 나무판자가 수평이 됩니다."
    },
    "choices": null,
    "figure": "assets/bank/s31-mid/s2-q04.webp",
    "figureNote": "눈금 나무판자 그림: 왼쪽 5 4 3 2 1 0 1 2 3 4 5 오른쪽.",
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
    "explanation": "나무판자의 가운데에 받침대를 놓으면 나무판자가 수평이 됩니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "이름 뒤 '단비:', '다래:', '하늘:'은 굵게 인쇄되어 있다."
    }
  },
  {
    "id": "s31-mid-o2-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 5,
      "page": 1,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "수평 잡기로 무게 비교",
      "concept": "수평을 이룰 때 받침점에서 더 먼 곳에 놓인 물체가 더 가볍다."
    },
    "prompt": "다음은 수평대의 나무판자 양쪽에 서로 다른 물체를 올려 나무판자가 수평이 된 모습입니다. ㉠과 ㉡ 중 더 가벼운 것을 골라 기호를 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s31-mid/s2-q05.webp",
    "figureNote": "수평대(5 4 3 2 1 0 1 2 3 4 5 눈금) 위에 ㉠ 주황 정육면체가 왼쪽 2 자리, ㉡ 초록 육각기둥이 오른쪽 1 자리에 놓여 수평을 이룸.",
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
    "explanation": "두 물체의 무게가 다를 때 무거운 물체를 받침점으로부터 가까운 곳에 놓고, 가벼운 물체를 받침점으로부터 먼 곳에 놓아야 수평을 만들 수 있습니다. ㉠이 ㉡보다 받침점에서 더 먼 곳에 있을 때 수평이 되었기 때문에 ㉠이 ㉡보다 더 가볍습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설은 답안지 왼쪽 단 아래 '05. ㉠' 뒤 오른쪽 단 맨 위로 이어진다."
    }
  },
  {
    "id": "s31-mid-o2-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 6,
      "page": 2,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "나무판자 기울기로 무게 비교",
      "concept": "같은 거리에 올렸을 때 나무판자가 기울어진 쪽 물체가 더 무겁고, 수평이면 두 물체의 무게가 같다."
    },
    "prompt": "다음은 배와 사과, 사과와 포도를 수평이 된 나무판자 양쪽의 같은 거리에 각각 올려놓은 모습입니다. 이에 대한 설명으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "배는 사과보다 무겁다.",
      "배는 포도보다 무겁다.",
      "포도는 배보다 무겁다.",
      "사과는 배보다 무겁다.",
      "사과는 포도보다 무겁다."
    ],
    "figure": "assets/bank/s31-mid/s2-q06.webp",
    "figureNote": "위: 배와 사과를 올린 나무판자가 수평. 아래: 사과와 포도를 올린 나무판자가 포도 쪽으로 기울어짐. 그림 글자: 배, 사과 / 사과, 포도.",
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
    "explanation": "수평이 된 나무판자 양쪽의 같은 거리에 두 물체를 각각 올려놓았을 때 나무판자가 수평을 이루면 두 물체의 무게가 같고, 한쪽으로 기울어지면 기울어진 쪽에 있는 물체의 무게가 더 무겁습니다. 배는 사과와 무게가 같고, 포도는 사과보다 무겁기 때문에 포도는 배보다 무겁습니다.",
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
    "id": "s31-mid-o2-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 7,
      "page": 2,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "생활 속 저울의 쓰임",
      "concept": "저울은 물체의 무게를 알기 위해 쓰고, 온도는 온도계로 잰다."
    },
    "prompt": "우리 생활에서 저울을 사용하는 경우로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "체육관에서 몸무게에 따라 체급을 나누기 위해 저울을 사용한다.",
      "새우튀김을 만들 때 기름의 온도를 측정하기 위해 저울을 사용한다.",
      "택배 상자의 무게에 따라 알맞은 요금을 내기 위해 저울을 사용한다.",
      "화물차가 싣고 있는 짐의 무게가 적합한지 확인하기 위해 저울을 사용한다.",
      "공항에서 비행기에 가방을 들고 탈 수 있는 무게인지 확인하기 위해 저울을 사용한다."
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
    "explanation": "우리 생활에서 물체의 무게를 알기 위해 저울을 사용합니다. 온도를 측정할 때는 온도계를 사용합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄이 있다."
    }
  },
  {
    "id": "s31-mid-o2-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 8,
      "page": 2,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "용수철저울의 구조",
      "concept": "용수철저울에서 무게 눈금을 가리키는 부분은 표시 자이다."
    },
    "prompt": "용수철저울에서 물체의 무게에 해당하는 숫자의 눈금을 가리키는 부분의 기호와 이름을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s31-mid/s2-q08.webp",
    "figureNote": "용수철저울 그림, 위에서부터 ㉠~㉥ 지시선(손잡이·영점 조절 나사·용수철·표시 자·눈금·고리 위치).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "기호: ㉣, 이름: 표시 자",
      "accepted": [
        "기호: ㉣, 이름: 표시 자",
        "㉣, 표시 자",
        "㉣ 표시 자",
        "ㄹ, 표시 자",
        "㉣, 표시자",
        "ㄹ 표시자",
        "ㄹ 표시 자",
        "표시 자 ㉣"
      ]
    },
    "explanation": "㉠은 손잡이, ㉡은 영점 조절 나사, ㉢은 용수철, ㉣은 표시 자, ㉤은 눈금, ㉥은 고리입니다. 용수철저울에서 물체의 무게에 해당하는 숫자의 눈금을 가리키는 부분은 표시 자입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란 형식: '기호: (   ), 이름: (   )'."
    }
  },
  {
    "id": "s31-mid-o2-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 9,
      "page": 2,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "무게 변화와 용수철저울",
      "concept": "고리에 건 물체가 가벼워지면 용수철이 줄어들고 표시 자가 가리키는 숫자가 작아진다."
    },
    "prompt": "동전 다섯 개를 넣은 지퍼 백을 용수철저울의 고리에 걸었습니다. 이후에 지퍼 백에서 동전 두 개를 뺐을 때 용수철저울에 나타나는 변화로 알맞은 것을 두 가지 고르시오.",
    "givens": null,
    "choices": [
      "용수철이 늘어난다.",
      "용수철이 줄어든다.",
      "아무런 변화도 나타나지 않는다.",
      "표시 자가 가리키는 눈금의 숫자가 커진다.",
      "표시 자가 가리키는 눈금의 숫자가 작아진다."
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
    "explanation": "용수철저울의 고리에 건 물체의 무게가 무거울수록 용수철이 더 많이 늘어나 표시 자가 가리키는 눈금의 숫자가 커집니다. 용수철저울의 고리에 건 지퍼 백에서 동전을 빼면 물체의 무게가 가벼워지기 때문에 용수철이 줄어들고, 표시 자가 가리키는 눈금의 숫자가 작아집니다.",
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
    "id": "s31-mid-o2-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 10,
      "page": 2,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "전자저울 사용 순서",
      "concept": "전자저울은 평평한 곳에 놓고 수평을 맞추는 일부터 한다."
    },
    "prompt": "다음 <보기>에서 전자저울로 물체의 무게를 측정할 때 가장 먼저 해야 하는 일을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 영점 단추를 눌러 영점을 맞춘다.",
        "㉡ 전원 단추를 눌러 전자저울을 작동한다.",
        "㉢ 전자저울을 평평한 곳에 놓고 저울의 수평을 맞춘다.",
        "㉣ 물체를 저울판 가운데에 올려놓고 표시판의 숫자를 읽는다."
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
        "전자저울을 평평한 곳에 놓고 저울의 수평을 맞춘다."
      ]
    },
    "explanation": "전자저울을 사용할 때 먼저 평평한 곳에 놓고 저울의 수평을 맞춰야 합니다. 그리고 전원 단추를 눌러 전자저울을 작동하고, 영점 단추를 눌러 영점을 맞춘 후 물체를 저울판 가운데에 올려놓고 표시판의 숫자를 읽습니다.",
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
    "id": "s31-mid-o2-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 11,
      "page": 3,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "도구를 쓸 때 드는 힘",
      "concept": "빗면이나 지레를 쓰면 직접 들어 올릴 때보다 작은 힘으로 물체를 들어 올릴 수 있다."
    },
    "prompt": "다음과 같이 용수철로 장난감 자동차를 들어 올렸습니다. <보기>에서 용수철의 길이가 가장 많이 늘어나는 경우로 알맞은 것을 골라 기호를 쓰시오. (단, 장난감 자동차는 모두 같은 것입니다.)",
    "givens": {
      "보기": [
        "㉠ ▲ 직접 들어 올릴 때",
        "㉡ ▲ 빗면을 이용해 들어 올릴 때",
        "㉢ ▲ 지레를 이용해 들어 올릴 때"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s31-mid/s2-q11.webp",
    "figureNote": "<보기> 그림 세 개: ㉠ 용수철에 자동차를 매달아 직접 들어 올림(용수철이 길게 늘어남), ㉡ 빗면 위 자동차를 용수철로 끌어 올림, ㉢ 지레 한쪽 끝의 자동차를 반대쪽에서 용수철로 당겨 들어 올림. 각 그림 아래 캡션.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠",
      "accepted": [
        "㉠",
        "ㄱ",
        "직접 들어 올릴 때"
      ]
    },
    "explanation": "장난감 자동차를 직접 들어 올릴 때가 빗면이나 지레와 같은 도구를 이용해 들어 올릴 때보다 더 큰 힘이 들기 때문에 용수철의 길이가 가장 많이 늘어납니다.",
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
    "id": "s31-mid-o2-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 12,
      "page": 3,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "지레와 빗면의 이용 예",
      "concept": "가위·병따개·장도리는 지레를, 경사로·구불구불한 산길은 빗면을 이용한다."
    },
    "prompt": "우리 생활에서 지레나 빗면을 이용하는 예를 잘못 짝 지은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "가위 - 지레",
      "경사로 - 빗면",
      "병따개 - 빗면",
      "장도리 - 지레",
      "구불구불한 산길 - 빗면"
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
    "explanation": "가위, 병따개, 장도리는 지레를 이용하는 예이고, 경사로와 구불구불한 산길은 빗면을 이용하는 예입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'잘못'에 밑줄이 있다."
    }
  },
  {
    "id": "s31-mid-o2-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 13,
      "page": 3,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "주변 동물의 특징",
      "concept": "참새는 깃털과 한 쌍의 날개가 있고, 얇고 투명한 두 쌍의 날개는 잠자리의 특징이다."
    },
    "prompt": "우리 주변에 사는 동물의 특징에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "개는 몸이 털로 덮여 있다.",
      "고양이는 두 쌍의 다리가 있다.",
      "달팽이는 미끄러지듯이 움직인다.",
      "참새는 얇고 투명한 두 쌍의 날개가 있다.",
      "금붕어는 아가미가 있어 물속에서 숨을 쉴 수 있다."
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
    "explanation": "참새는 몸이 깃털로 덮여 있고, 한 쌍의 날개가 있습니다. 얇고 투명한 두 쌍의 날개가 있는 것은 잠자리입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄이 있다."
    }
  },
  {
    "id": "s31-mid-o2-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 14,
      "page": 3,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "다리가 없는 동물",
      "concept": "뱀과 상어는 둘 다 다리가 없는 동물이다."
    },
    "prompt": "다음 동물들의 공통적인 특징으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "그림 캡션": [
        "▲ 뱀",
        "▲ 상어"
      ]
    },
    "choices": [
      "날개가 있다.",
      "다리가 없다.",
      "새끼를 낳는다.",
      "더듬이가 있다.",
      "몸이 털로 덮여 있다."
    ],
    "figure": "assets/bank/s31-mid/s2-q14.webp",
    "figureNote": "사진 두 장: 뱀(코브라)과 상어, 아래에 '▲ 뱀', '▲ 상어' 캡션.",
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
    "explanation": "뱀과 상어는 다리가 없는 동물입니다. 뱀은 기어다니고, 상어는 지느러미로 물속을 헤엄쳐 다닙니다.",
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
    "id": "s31-mid-o2-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 15,
      "page": 3,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "더듬이 유무로 동물 분류",
      "concept": "개미·꿀벌은 더듬이가 있고 토끼·닭·문어는 더듬이가 없다."
    },
    "prompt": "다음은 분류 기준과 그 분류 기준에 따라 동물을 분류한 결과입니다. 잘못 분류한 동물을 골라 이름을 쓰시오.",
    "givens": {
      "표": {
        "분류 기준": [
          "더듬이가 있는가?"
        ],
        "그렇다.": [
          "개미, 꿀벌, 토끼"
        ],
        "그렇지 않다.": [
          "닭, 문어"
        ]
      }
    },
    "choices": null,
    "figure": "assets/bank/s31-mid/s2-q15.webp",
    "figureNote": "분류 표: 위 칸 '분류 기준 / 더듬이가 있는가?', 아래 칸 '그렇다. / 그렇지 않다.' 두 열(내용은 givens.표에 옮김).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "토끼",
      "accepted": [
        "토끼"
      ]
    },
    "explanation": "개미와 꿀벌은 더듬이가 있는 동물이고, 토끼, 닭, 문어는 더듬이가 없는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'잘못'에 밑줄이 있다. 표는 위아래 두 개로 나뉘어 인쇄되어 있다."
    }
  },
  {
    "id": "s31-mid-o2-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 16,
      "page": 4,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "지렁이의 특징",
      "concept": "지렁이는 다리 없이 기어다니며 땅속에서 흙과 썩은 낙엽을 먹고, 큰턱으로 집을 짓는 것은 개미이다."
    },
    "prompt": "지렁이에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "다리가 없어 기어다닌다.",
      "고리 모양의 마디가 많다.",
      "몸이 가늘고 긴 원통 모양이다.",
      "큰턱으로 땅을 파서 땅속에 집을 짓는다.",
      "땅속에서 생활하며 흙과 썩은 낙엽 등을 먹는다."
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
    "explanation": "지렁이는 땅속에서 생활하며 흙과 썩은 낙엽 등을 먹습니다. 큰턱으로 땅을 파서 땅속에 집을 짓는 것은 개미의 특징입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄이 있다."
    }
  },
  {
    "id": "s31-mid-o2-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 17,
      "page": 4,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "땅 위에 사는 동물",
      "concept": "너구리와 딱따구리는 땅 위에 살고, 개미는 땅 위와 땅속을 오가며, 두더지·땅강아지·매미 애벌레는 땅속에 산다."
    },
    "prompt": "주로 땅 위에서만 사는 동물끼리 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "개미, 너구리",
      "개미, 딱따구리",
      "두더지, 땅강아지",
      "너구리, 딱따구리",
      "땅강아지, 매미 애벌레"
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
    "explanation": "너구리와 딱따구리는 땅 위에 사는 동물입니다. 개미는 땅 위와 땅속을 오가며 사는 동물이고, 두더지, 땅강아지, 매미 애벌레는 땅속에 사는 동물입니다.",
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
    "id": "s31-mid-o2-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 18,
      "page": 4,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "강·호수 동물의 이동 방법",
      "concept": "개구리와 수달은 발가락 사이의 물갈퀴로 물속에서 헤엄친다."
    },
    "prompt": "다음의 동물들이 물속에서 이동하는 방법을 쓰시오.",
    "givens": {
      "그림 캡션": [
        "▲ 개구리",
        "▲ 수달"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s31-mid/s2-q18.webp",
    "figureNote": "사진 두 장: 개구리(청개구리)와 수달, 아래에 '▲ 개구리', '▲ 수달' 캡션.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "개구리와 수달은 물속에서 물갈퀴가 있는 발로 헤엄쳐 다닌다.",
      "rubric": {
        "required": [
          "물갈퀴가 있는 발을 이용한다",
          "헤엄쳐 다닌다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "물갈퀴가 있는 발로 헤엄쳐 다닌다는 내용이 포함되어 있으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "개구리와 수달은 강이나 호수에 사는 동물입니다. 개구리는 두 쌍의 다리가 있고, 뒷다리와 발가락 사이에 물갈퀴가 있어 물속에서 물갈퀴가 있는 발로 헤엄쳐 다닙니다. 수달은 두 쌍의 다리가 있고, 발가락 사이에 물갈퀴가 있어 물속에서 물갈퀴로 헤엄쳐 다닙니다.\n[채점 기준] 물갈퀴가 있는 발로 헤엄쳐 다닌다는 내용이 포함되어 있으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표에 비율(%)이 인쇄되어 있지 않아 100%로 적었다."
    }
  },
  {
    "id": "s31-mid-o2-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 19,
      "page": 4,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "갯벌·바다 동물의 특징",
      "concept": "조개는 딱딱한 껍데기로, 전복은 배발로 바위에 붙어 기어다니며, 게는 껍데기로 덮이고 고등어는 지느러미로 헤엄친다."
    },
    "prompt": "다음 <보기>에서 갯벌이나 바다에 사는 동물에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 게는 몸이 비늘로 덮여 있다.",
        "㉡ 조개는 몸이 딱딱한 껍데기로 되어 있다.",
        "㉢ 고등어는 두 쌍의 다리로 바닷속을 걸어 다닌다.",
        "㉣ 전복은 배발을 이용해 물속 바위에 붙어서 기어다닌다."
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
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "게는 몸이 단단한 껍데기로 덮여 있고, 고등어는 지느러미로 바닥속을 헤엄쳐 다닙니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설의 '바닥속'은 인쇄 그대로이다('바닷속'의 오기로 보임)."
    }
  },
  {
    "id": "s31-mid-o2-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 20,
      "page": 4,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "날 수 있는 동물의 특징",
      "concept": "날 수 있는 동물은 대부분 날개가 있고 몸집에 비해 가볍다."
    },
    "prompt": "다음 빈칸에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "날 수 있는 동물은 대부분 □이/가 있고, 몸이 크기에 비해 가볍습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "날개",
      "accepted": [
        "날개"
      ]
    },
    "explanation": "새나 곤충 등 날 수 있는 동물은 대부분 날개가 있고, 몸이 크기에 비해 가볍습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 네모 칸으로 인쇄되어 있어 □로 적었다."
    }
  },
  {
    "id": "s31-mid-o2-21",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 21,
      "page": 4,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "낙타의 특징",
      "concept": "낙타는 혹에 지방을 저장하고 긴 눈썹·귀 털과 넓은 발바닥으로 사막에 적응했으며, 큰 귀로 열을 내보내는 것은 사막여우이다."
    },
    "prompt": "낙타에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "눈썹이 길다.",
      "발바닥이 넓다.",
      "귀 주위의 털이 길다.",
      "등의 혹에 지방을 저장한다.",
      "큰 귀로 몸속의 열을 내보낸다."
    ],
    "figure": "assets/bank/s31-mid/s2-q21.webp",
    "figureNote": "쌍봉낙타 어미와 새끼 사진.",
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
    "explanation": "낙타는 등의 혹에 지방을 저장하여 물과 먹이가 없어도 며칠 동안 살 수 있고, 눈썹과 귀 주위의 털이 길어 모래가 잘 들어가지 않습니다. 또한 발바닥이 넓어 모래에 발이 잘 빠지지 않습니다. 큰 귀로 몸속의 열을 내보내는 것은 사막여우의 특징입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄이 있다."
    }
  },
  {
    "id": "s31-mid-o2-22",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 22,
      "page": 5,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "극지방 동물의 특징",
      "concept": "북극곰은 두꺼운 피부와 촘촘한 털로 추위를 막고 발바닥 돌기로 얼음 위에서 미끄러지지 않는다."
    },
    "prompt": "다음과 같은 특징을 가진 동물로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 두꺼운 피부와 촘촘하게 난 털이 추위를 막아 줍니다.\n• 발바닥에 작은 돌기들이 있어 얼음 위에서 미끄러지지 않습니다.\n• 걷거나 뛰어서 이동하고 물속을 헤엄쳐 이동하기도 합니다."
    },
    "choices": [
      "펭귄",
      "북극곰",
      "북극여우",
      "바다코끼리",
      "얼룩무늬물범"
    ],
    "figure": "assets/bank/s31-mid/s2-q22.webp",
    "figureNote": "선택지가 사진 다섯 장(①~⑤)이며 각 사진 아래 '▲ 이름' 캡션: 펭귄, 북극곰, 북극여우, 바다코끼리, 얼룩무늬물범.",
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
    "explanation": "북극곰은 극지방에 사는 동물로, 두꺼운 피부와 촘촘하게 난 털이 추위를 막아 주고, 발바닥에 작은 돌기들이 있어 얼음 위에서 미끄러지지 않습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "선택지는 사진+캡션('▲ 펭귄' 등)으로 인쇄되어 있어 캡션 이름을 선택지 글로 적었다."
    }
  },
  {
    "id": "s31-mid-o2-23",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 23,
      "page": 5,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "높은 산에 사는 동물",
      "concept": "춥고 바람이 많고 경사가 급한 높은 산에는 눈표범이 산다."
    },
    "prompt": "다음과 같은 환경에 주로 사는 동물로 알맞은 것을 <보기>에서 골라 기호를 쓰시오.",
    "givens": {
      "지문": "춥고 바람이 많이 불며, 경사가 급합니다.",
      "보기": [
        "㉠ ▲ 박쥐",
        "㉡ ▲ 눈표범",
        "㉢ ▲ 초롱아귀",
        "㉣ ▲ 동굴옆새우"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s31-mid/s2-q23.webp",
    "figureNote": "<보기> 그림 네 개(㉠~㉣)와 캡션: 박쥐, 눈표범, 초롱아귀, 동굴옆새우.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ",
        "눈표범"
      ]
    },
    "explanation": "눈표범이 사는 높은 산에 대한 설명입니다. 박쥐와 동굴옆새우는 동굴에 사는 동물이고, 초롱아귀는 깊은 바닷속에 사는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '<'와 '보기>'가 줄바꿈으로 나뉘어 인쇄되어 있다."
    }
  },
  {
    "id": "s31-mid-o2-24",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 24,
      "page": 5,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "동물의 특징을 이용한 생활용품",
      "concept": "굴착기는 두더지가 크고 단단한 앞발로 굴을 파는 특징을 본떠 만들었다."
    },
    "prompt": "다음 <보기>에서 두더지의 특징을 이용해 만든 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ ▲ 굴착기",
        "㉡ ▲ 물갈퀴",
        "㉢ ▲ 집게 차"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s31-mid/s2-q24.webp",
    "figureNote": "<보기> 사진 세 장(㉠~㉢)과 캡션: 굴착기, 물갈퀴, 집게 차.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠",
      "accepted": [
        "㉠",
        "ㄱ",
        "굴착기"
      ]
    },
    "explanation": "두더지가 땅속에서 크고 단단한 앞발로 굴을 파는 특징을 이용해 단단한 땅을 파는 굴착기를 만들었습니다.",
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
    "id": "s31-mid-o2-25",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 25,
      "page": 5,
      "sourceId": "sci-31-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "동물의 특징을 이용한 고속열차",
      "concept": "고속열차의 앞부분은 빠르게 헤엄치는 산천어의 부드러운 곡선 몸 모양을 본떴다."
    },
    "prompt": "고속열차를 만드는 데 이용한 동물의 특징으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "물체에 잘 붙는 문어의 빨판",
      "물이 잘 흐르는 상어의 피부",
      "부드러운 곡선 모양인 산천어의 몸 모양",
      "절벽에서 잘 미끄러지지 않는 산양의 발바닥",
      "세찬 파도에도 바위에서 떨어지지 않고 붙어 있는 홍합"
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
    "explanation": "산천어의 몸이 부드러운 곡선 모양으로 되어 있어 물속에서 빠르게 헤엄칠 수 있는 특징을 이용해 앞부분이 부드러운 곡선 모양인 고속열차를 만들었습니다.",
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
