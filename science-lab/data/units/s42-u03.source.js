// 4-2 Ⅲ 그림자와 거울 — 단원평가 원문 70문항(시매쓰DMC 최다빈출 단원평가 세트1·2·3·4). 시험지를 그대로 옮기고 정답 및 풀이와 대조했다.
// 원장 지시(2026-10-09): 원문을 그대로 문제은행에 쓴다. 그림은 시험지에서 잘라 낸 것(assets/bank/s42-u03/).
export const source = [
  {
    "id": "s42-u03-o1-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 1,
      "page": 1,
      "sourceId": "sci-42-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "그림자의 뜻",
      "concept": "빛이 비치는 곳에 물체가 있으면 물체 뒤쪽에 빛이 닿지 않아 어두운 그림자가 생긴다."
    },
    "prompt": "빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "빛이 비치는 곳에 물체가 있을 때 물체 뒤에 빛이 닿지 않아 생기는 어두운 부분을 □(이)라고 합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "그림자",
      "accepted": [
        "그림자"
      ]
    },
    "explanation": "물체에 빛을 비추면 물체의 뒤쪽에 그림자가 생깁니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 인쇄본에서 빈 네모 상자로 표시됨(□로 옮김)."
    }
  },
  {
    "id": "s42-u03-o1-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 2,
      "page": 1,
      "sourceId": "sci-42-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "그림자가 생기는 조건",
      "concept": "그림자가 생기려면 빛과 물체가 있어야 하고, 빛-물체-스크린 순서로 놓여 물체를 향해 빛을 비추어야 한다."
    },
    "prompt": "그림자가 생기는 조건으로 알맞지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 빛이 있어야 합니다.",
        "ㄴ. 물체가 있어야 합니다.",
        "ㄷ. 그림자는 물체의 뒤쪽에 생깁니다.",
        "ㄹ. 물체-스크린-손전등 순서가 될 때 스크린에 그림자가 생깁니다."
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
        "ㄹ",
        "물체-스크린-손전등 순서가 될 때 스크린에 그림자가 생깁니다."
      ]
    },
    "explanation": "그림자가 생기려면 빛과 물체가 있어야 하고, 물체를 바라보는 방향으로 빛을 비추어야 합니다. 따라서 스크린-물체-손전등의 순서로 놓아야 스크린에 물체의 그림자가 생깁니다.",
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
    "id": "s42-u03-o1-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 3,
      "page": 1,
      "sourceId": "sci-42-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "그림자 위치로 빛의 방향 찾기",
      "concept": "그림자는 빛이 비치는 방향의 반대쪽, 즉 물체의 뒤쪽에 생긴다."
    },
    "prompt": "다음과 같이 공의 그림자가 생겼을 때 ㄱ과 ㄴ 중 빛을 비춘 손전등의 위치를 골라 기호를 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s42-u03/s1-q03.webp",
    "figureNote": "흰 종이 위에 공이 놓여 있고 위쪽 왼편(ㄱ)과 오른편(ㄴ)에서 손전등 두 개가 공을 비추는 그림. 공의 오른쪽 아래에 그림자가 하나 있음.",
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
    "explanation": "물체를 바라보는 방향으로 빛을 비추면 물체의 뒤쪽에 그림자가 생깁니다.",
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
    "id": "s42-u03-o1-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 4,
      "page": 1,
      "sourceId": "sci-42-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "투명한 물체의 그림자",
      "concept": "빛이 잘 통과하는 투명한 물체는 연하고 흐릿한 그림자가 생긴다."
    },
    "prompt": "다음의 유리컵에 빛을 비추었을 때 나타나는 그림자에 대한 설명으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 연하고 흐릿합니다.",
        "ㄴ. 진하고 선명합니다.",
        "ㄷ. 그림자가 생기지 않습니다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s42-u03/s1-q04.webp",
    "figureNote": "투명한 유리컵 사진. 캡션 '▲유리컵'.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ",
        "연하고 흐릿합니다."
      ]
    },
    "explanation": "유리컵은 빛이 잘 통과하기 때문에 그림자가 연하고 흐릿합니다.",
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
    "id": "s42-u03-o1-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 5,
      "page": 1,
      "sourceId": "sci-42-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물체에 따른 그림자 진하기",
      "concept": "빛이 물체를 통과하는 정도에 따라 그림자의 진하기가 달라지며, 투명한 물체는 연한 그림자가 생긴다."
    },
    "prompt": "빛을 비추어 그림자를 만들 때 그림자의 진하기가 나머지 넷과 다른 것을 고르세요.",
    "givens": null,
    "choices": [
      "손",
      "양산",
      "필통",
      "유리창",
      "나무 책상"
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
    "explanation": "빛이 물체를 통과하는 정도에 따라 그림자의 진하기가 달라집니다. 유리창과 같은 투명한 물체에 빛을 비추면 빛이 대부분 통과하여 연한 그림자가 생깁니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '다른'에 밑줄."
    }
  },
  {
    "id": "s42-u03-o1-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 6,
      "page": 1,
      "sourceId": "sci-42-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "빛의 직진과 그림자 모양",
      "concept": "빛은 곧게 나아가므로 물체를 통과하지 못한 빛 때문에 물체와 비슷한 모양의 그림자가 생긴다."
    },
    "prompt": "다음과 같은 원 모양 종이에 손전등 빛을 비췄을 때 스크린에 생긴 그림자의 모양은 어떠한지 빛의 성질과 관련지어 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s42-u03/s1-q06.webp",
    "figureNote": "스크린 앞 받침대에 원 모양 노란 종이가 세워져 있고, 오른쪽 아래 손전등이 비추는 장면. 스크린의 그림자 부분은 그려져 있지 않음.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "손전등 빛이 직진하기 때문에 원 모양 종이와 비슷한 모양의 그림자가 생깁니다.",
      "rubric": {
        "required": [
          "원 모양 종이와 비슷한(원 모양) 그림자가 생긴다",
          "손전등 빛이 직진하기(곧게 나아가기) 때문이다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "정답: 그림자의 모양을 빛의 직진과 관련지어 옳게 쓴 경우 (100%)",
          "부분 정답: 그림자의 모양이 원 모양 종이와 비슷하다고만 쓴 경우 (50%)"
        ]
      }
    },
    "explanation": "빛이 곧게 나아가는 성질을 빛의 직진이라고 합니다. 직진하는 빛이 물체를 통과하지 못하면 물체의 모양과 비슷한 모양의 그림자가 생깁니다.\n[채점 기준] 정답: 그림자의 모양을 빛의 직진과 관련지어 옳게 쓴 경우 (100%) / 부분 정답: 그림자의 모양이 원 모양 종이와 비슷하다고만 쓴 경우 (50%)",
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
    "id": "s42-u03-o1-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 7,
      "page": 2,
      "sourceId": "sci-42-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물체와 그림자 모양의 관계",
      "concept": "같은 물체라도 놓는 방향이나 빛을 비추는 방향에 따라 그림자 모양이 달라질 수 있다."
    },
    "prompt": "물체와 물체의 그림자에 대한 설명으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 빛이 직진하기 때문에 물체 모양과 물체의 그림자 모양이 비슷합니다.",
        "ㄴ. 여러 개의 전등을 비췄을 때는 하나의 물체에 여러 개의 그림자가 생길 수 있습니다.",
        "ㄷ. 그림자는 물체의 모습대로 생기기 때문에 하나의 물체에 한 가지 모양의 그림자만 생깁니다."
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
    "explanation": "빛이 나아가다가 물체를 만나면 빛이 통과하지 못하는 부분에 그림자가 생기기 때문에 물체의 모양과 비슷한 모양의 그림자가 생깁니다. 이때 같은 물체라도 물체를 놓는 방향이나 빛을 비추는 방향에 따라 그림자의 모양이 달라집니다.",
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
    "id": "s42-u03-o1-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 8,
      "page": 2,
      "sourceId": "sci-42-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E4",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "손전등 거리와 그림자 크기",
      "concept": "물체와 스크린을 그대로 두고 손전등을 물체에 가까이 하면 그림자가 커진다."
    },
    "prompt": "위의 실험에 대한 설명입니다. 괄호에 들어갈 알맞은 말을 골라 쓰세요.",
    "givens": {
      "지문": "[08~09] 다음과 같이 손전등, 스크린, 종이 인형을 사용하여 그림자 크기 변화를 관찰하였습니다. 물음에 답하세요. / 스크린과 종이 인형을 그대로 두었을 때 손전등을 종이 인형에 가까이 가져가면 그림자의 크기는 ( 커, 작아 )지고 선명해 집니다."
    },
    "choices": null,
    "figure": "assets/bank/s42-u03/s1-q08.webp",
    "figureNote": "스크린 앞에 종이 인형(강아지 모양)이 받침대에 세워져 있고, 그 뒤쪽에서 받침대 위 손전등이 종이 인형을 비춰 스크린에 강아지 모양 그림자가 생긴 그림. 라벨: 종이 인형, 손전등.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "커",
      "accepted": [
        "커",
        "커진다",
        "커집니다"
      ]
    },
    "explanation": "스크린과 종이 인형을 그대로 두었을 때 손전등을 종이 인형에 가까이 가져가면 그림자의 크기는 커집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문은 [08~09] 공통 발문과 08번 상자 글을 ' / '로 이어 씀. 원문 '선명해 집니다' 띄어쓰기 그대로."
    }
  },
  {
    "id": "s42-u03-o1-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 9,
      "page": 2,
      "sourceId": "sci-42-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E4",
      "type": "T09",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "물체 거리와 그림자 크기",
      "concept": "손전등과 스크린을 그대로 두고 물체를 손전등에 가까이 하면 그림자가 커진다."
    },
    "prompt": "위의 실험에서 스크린과 손전등을 그대로 두고 그림자의 크기를 커지게 하는 방법을 쓰세요.",
    "givens": {
      "지문": "[08~09] 다음과 같이 손전등, 스크린, 종이 인형을 사용하여 그림자 크기 변화를 관찰하였습니다. 물음에 답하세요."
    },
    "choices": null,
    "figure": "assets/bank/s42-u03/s1-q08.webp",
    "figureNote": "스크린 앞에 종이 인형(강아지 모양)이 받침대에 세워져 있고, 그 뒤쪽에서 받침대 위 손전등이 종이 인형을 비춰 스크린에 강아지 모양 그림자가 생긴 그림. 라벨: 종이 인형, 손전등.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "종이 인형을 손전등에 가까이 가져갑니다.",
      "rubric": {
        "required": [
          "종이 인형을 옮긴다",
          "손전등에 가까이 가져간다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "정답: 종이 인형을 손전등에 가까이 가져간다고 쓴 경우 (100%)"
        ]
      }
    },
    "explanation": "스크린과 손전등을 그대로 두었을 때 종이 인형을 손전등에 가깝게 하면 그림자의 크기가 커집니다.\n[채점 기준] 정답: 종이 인형을 손전등에 가까이 가져간다고 쓴 경우 (100%)",
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
    "id": "s42-u03-o1-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 10,
      "page": 2,
      "sourceId": "sci-42-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "거울에 비친 모습의 특징",
      "concept": "거울에 비친 물체는 색깔과 모양은 실제와 같지만 좌우가 바뀌어 보인다."
    },
    "prompt": "거울에 비친 물체의 모습에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "거울에 비친 물체는 왼쪽만 다르게 보입니다.",
      "거울에 비친 물체의 색깔은 실제 물체의 색깔과 다릅니다.",
      "거울에 비친 물체의 모습은 실제 모습이 거꾸로 된 모습입니다.",
      "거울에 비친 물체의 모양은 실제 물체와 상하가 바뀌어 보입니다.",
      "거울에 비친 물체의 모양은 실제 물체와 좌우가 바뀌어 보입니다."
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
    "explanation": "거울에 비친 물체는 실제 물체와 모양과 색깔은 같지만 좌우가 바뀌어 보입니다.",
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
    "id": "s42-u03-o1-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 11,
      "page": 2,
      "sourceId": "sci-42-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E5",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "거울에 비친 글자 읽기",
      "concept": "거울에 비친 글자는 좌우가 바뀌어 보이므로 좌우를 되돌리면 실제 글자가 된다."
    },
    "prompt": "다음은 거울에 비친 글자의 모습입니다. 실제 글자의 모습을 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s42-u03/s1-q11.webp",
    "figureNote": "'희망'을 좌우로 뒤집은 글자 모양.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "희망",
      "accepted": [
        "희망"
      ]
    },
    "explanation": "거울에 비친 글자는 실제 글자와 좌우가 바뀌어 보입니다.",
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
    "id": "s42-u03-o1-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 12,
      "page": 2,
      "sourceId": "sci-42-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "구급차 글자와 거울",
      "concept": "뒷거울에 비치면 글자의 좌우가 바뀌므로 구급차 앞의 글자를 미리 좌우로 바꿔 쓰면 거울 속에서 똑바로 읽힌다."
    },
    "prompt": "다음은 구급차의 앞부분에 글자를 좌우로 바꿔 쓴 까닭입니다. 괄호 ㉠과 ㉡에 들어갈 알맞은 말을 골라 각각 쓰세요.",
    "givens": {
      "지문": "앞서가는 자동차의 운전자가 자동차의 ㉠( 창문, 뒷거울 )(으)로 구급차를 보았을 때 구급차에 쓰여 있는 글자의 ㉡( 상하, 좌우 )가 바뀌어서 똑바로 보이기 때문에 글자를 좌우로 바꾸어 씁니다."
    },
    "choices": null,
    "figure": "assets/bank/s42-u03/s1-q12.webp",
    "figureNote": "앞부분에 좌우가 바뀐 글자가 쓰인 노란색 구급차 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-뒷거울, ㉡-좌우",
      "accepted": [
        "㉠-뒷거울, ㉡-좌우",
        "뒷거울, 좌우",
        "뒷거울,좌우"
      ]
    },
    "explanation": "구급차의 앞부분에는 좌우가 바뀐 글자가 쓰여 있습니다. 앞서가는 자동차의 운전자가 자동차의 뒷거울로 구급차를 보았을 때 구급차에 쓰여 있는 글자의 좌우가 바뀌어서 똑바로 보이기 때문에 글자를 좌우로 바꾸어 씁니다.",
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
    "id": "s42-u03-o1-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 13,
      "page": 3,
      "sourceId": "sci-42-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "빛의 반사",
      "concept": "빛은 거울에 부딪치면 나아가는 방향이 바뀐다(반사)."
    },
    "prompt": "다음과 같이 책상에 흰 종이를 깔고 거울을 수직으로 세운 뒤 거울에 손전등 빛을 비추었습니다. 손전등 빛이 나아가는 모습에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "손전등 빛이 거울을 통과합니다.",
      "손전등 빛이 거울에 흡수됩니다.",
      "손전등 빛이 거울에 부딪쳐 사라집니다.",
      "손전등 빛이 거울에 부딪쳐 더 밝아집니다.",
      "손전등 빛이 거울에 부딪쳐 방향이 바뀝니다."
    ],
    "figure": "assets/bank/s42-u03/s1-q13.webp",
    "figureNote": "책상 위 흰 종이에 거울을 수직으로 세우고 손전등으로 거울을 비추는 그림. 라벨: 손전등, 손전등의 빛을 비추는 방향(빨간 화살표).",
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
    "explanation": "손전등의 빛이 거울에 부딪히면 빛의 방향이 바뀝니다.",
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
    "id": "s42-u03-o1-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 14,
      "page": 3,
      "sourceId": "sci-42-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "거울로 빛의 방향 바꾸기",
      "concept": "거울이 바라보는 방향을 바꾸면 반사된 빛이 나아가는 방향을 바꿀 수 있다."
    },
    "prompt": "다음은 거울을 이용해서 왼쪽 과녁판에 비추고 있던 손전등 빛을 오른쪽 과녁판에 비추는 방법입니다. 빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "손전등 빛이 오른쪽 과녁판에 도달하게 하려면 손전등의 위치나 거울이 바라보는 □(을)를 조절해야 합니다."
    },
    "choices": null,
    "figure": "assets/bank/s42-u03/s1-q14.webp",
    "figureNote": "오른쪽 손전등 빛이 왼쪽 아래 거울에 반사되어 왼쪽 과녁판에 닿고, 오른쪽에 또 하나의 과녁판이 있는 그림. 라벨: 거울.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "방향",
      "accepted": [
        "방향"
      ]
    },
    "explanation": "손전등 빛이 거울에 부딪치면 거울에서 빛의 방향이 바뀝니다. 빛을 다른 방향으로 나아가게 하려면 거울이 바라보는 방향을 바꾸어야 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 인쇄본에서 빈 네모 상자로 표시됨(□로 옮김)."
    }
  },
  {
    "id": "s42-u03-o1-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 15,
      "page": 3,
      "sourceId": "sci-42-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "생활 속 거울의 쓰임",
      "concept": "거울은 쓰임에 따라 세수할 때, 다른 자동차 위치를 볼 때, 좁은 공간을 넓어 보이게 할 때 등에 이용된다."
    },
    "prompt": "다음은 여러 가지 거울입니다. 각 거울과 관련된 내용을 <보기>에서 골라 기호를 각각 쓰세요.",
    "givens": {
      "지문": "㈎ 세면대 거울\n㈏ 자동차 뒷거울\n㈐ 승강기 안 거울",
      "보기": [
        "ㄱ. 좁은 공간이 넓어 보입니다.",
        "ㄴ. 화장실에서 세수할 때 사용합니다.",
        "ㄷ. 다른 자동차의 위치를 볼 때 사용합니다."
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
      "answer": "㈎-ㄴ, ㈏-ㄷ, ㈐-ㄱ",
      "accepted": [
        "㈎-ㄴ, ㈏-ㄷ, ㈐-ㄱ",
        "ㄴ, ㄷ, ㄱ",
        "ㄴㄷㄱ"
      ]
    },
    "explanation": "세면대의 거울은 화장실에서 세수할 때, 자동차 뒷거울은 다른 자동차의 위치를 볼 때, 승강기 안 거울은 자신의 옷과 얼굴을 볼 때 사용할 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설은 승강기 안 거울을 '자신의 옷과 얼굴을 볼 때' 쓴다고 설명하나 정답은 보기 ㄱ(좁은 공간이 넓어 보입니다)으로 표기됨. 해설 첫머리는 '세면대의 거울'(발문은 '세면대 거울')."
    }
  },
  {
    "id": "s42-u03-o2-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 1,
      "page": 1,
      "sourceId": "sci-42-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "그림자가 생기는 조건",
      "concept": "그림자가 생기려면 빛과 그 빛을 가리는 물체가 반드시 있어야 한다."
    },
    "prompt": "그림자가 생기기 위해 반드시 필요한 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "빛",
      "공기",
      "물체",
      "산소",
      "수증기"
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
    "explanation": "그림자가 생기기 위해서는 빛과 물체가 반드시 필요합니다.",
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
    "id": "s42-u03-o2-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 2,
      "page": 1,
      "sourceId": "sci-42-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "그림자가 생기는 조건",
      "concept": "스크린은 그림자를 잘 보이게 할 뿐이며, 스크린이 없어도 빛과 물체만 있으면 그림자는 생긴다."
    },
    "prompt": "그림자와 그림자가 생기는 조건에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "빛과 물체가 있어야 합니다.",
      "스크린이 없으면 그림자가 생기지 않습니다.",
      "물체를 바라보는 방향으로 빛을 비추어야 합니다.",
      "햇빛이 비치는 낮에 물체 주변에 그림자가 생깁니다.",
      "흰 종이와 같은 스크린을 사용하면 그림자를 잘 볼 수 있습니다."
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
    "explanation": "흰 종이와 같은 스크린을 사용하면 그림자를 잘 볼 수 있지만 스크린이 없어도 그림자는 생깁니다.",
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
    "id": "s42-u03-o2-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 3,
      "page": 1,
      "sourceId": "sci-42-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "그림자가 생기는 경우",
      "concept": "그림자는 빛이 물체를 비추고 있을 때 생긴다."
    },
    "prompt": "그림자가 생기는 경우를 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 햇빛이 비치는 날 운동장에 있을 때",
        "ㄴ. 구름이 햇빛을 가린 날 운동장에 있을 때",
        "ㄷ. 햇빛이 비치는 날 나무 그늘 속에 있을 때"
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
    "explanation": "그림자가 생기기 위해서는 빛이 물체를 비추고 있어야 합니다.",
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
    "id": "s42-u03-o2-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 4,
      "page": 1,
      "sourceId": "sci-42-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "투명한 물체와 불투명한 물체의 그림자",
      "concept": "빛이 대부분 통과하는 유리컵은 연하고 흐릿한 그림자를, 빛이 통과하지 못하는 도자기 컵은 진하고 선명한 그림자를 만든다."
    },
    "prompt": "위의 실험 결과에 대한 설명으로 옳은 것을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2 개)",
    "givens": {
      "지문": "[04~05] 다음은 도자기 컵과 유리컵에 생긴 그림자를 관찰하는 모습입니다. 물음에 답하세요.",
      "보기": [
        "ㄱ. 유리컵에 빛을 비추면 진하고 선명한 그림자가 생깁니다.",
        "ㄴ. 유리컵에 빛을 비추면 연하고 흐릿한 그림자가 생깁니다.",
        "ㄷ. 도자기 컵에 빛을 비추면 진하고 선명한 그림자가 생깁니다.",
        "ㄹ. 도자기 컵에 빛을 비추면 연하고 흐릿한 그림자가 생깁니다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s42-u03/s2-q04.webp",
    "figureNote": "▲도자기 컵: 불투명한 흰 도자기 컵 뒤 스크린에 진하고 선명한 컵 모양 그림자. ▲유리컵: 투명한 유리컵 뒤 스크린에 연하고 흐릿한 컵 모양 그림자.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ, ㄷ",
      "accepted": [
        "ㄴ, ㄷ",
        "ㄴ,ㄷ",
        "ㄷ, ㄴ",
        "ㄷ,ㄴ",
        "ㄴㄷ"
      ]
    },
    "explanation": "빛이 물체를 통과하는 정도에 따라 그림자의 진하기가 달라집니다. 유리컵은 빛이 대부분 통과해 연하고 흐릿한 그림자가 생기고, 도자기 컵은 빛이 통과하지 못해 진하고 선명한 그림자가 생깁니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란은 '(    ), (    )' 두 칸."
    }
  },
  {
    "id": "s42-u03-o2-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 5,
      "page": 1,
      "sourceId": "sci-42-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "물체에 따라 빛이 통과하는 정도",
      "concept": "불투명한 물체는 빛이 통과하지 못하고 투명한 물체는 빛이 대부분 통과한다."
    },
    "prompt": "위 실험의 도자기 컵과 유리컵에서 빛이 통과하는 정도를 비교하여 쓰세요.",
    "givens": {
      "지문": "[04~05] 다음은 도자기 컵과 유리컵에 생긴 그림자를 관찰하는 모습입니다. 물음에 답하세요."
    },
    "choices": null,
    "figure": "assets/bank/s42-u03/s2-q04.webp",
    "figureNote": "▲도자기 컵: 불투명한 흰 도자기 컵 뒤 스크린에 진하고 선명한 컵 모양 그림자. ▲유리컵: 투명한 유리컵 뒤 스크린에 연하고 흐릿한 컵 모양 그림자.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "도자기 컵은 빛이 통과하지 못하고, 유리컵은 투명하여 빛이 대부분 통과합니다.",
      "rubric": {
        "required": [
          "도자기 컵은 빛이 통과하지 못한다",
          "유리컵은 투명해서 빛이 대부분 통과한다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "정답: 빛이 도자기 컵과 유리컵을 통과하는 정도를 옳게 비교하여 쓴 경우 (100%)"
        ]
      }
    },
    "explanation": "불투명한 도자기 컵은 빛이 통과하지 못하고, 투명한 유리컵은 빛이 대부분 통과합니다.\n[채점 기준] 정답: 빛이 도자기 컵과 유리컵을 통과하는 정도를 옳게 비교하여 쓴 경우 (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표: 행 머리 '정답', 비율 100% 한 줄뿐."
    }
  },
  {
    "id": "s42-u03-o2-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 6,
      "page": 2,
      "sourceId": "sci-42-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "그림자의 특징",
      "concept": "불투명한 물체는 빛이 통과하지 못해 흐릿한 그림자가 아니라 진하고 선명한 그림자가 생긴다."
    },
    "prompt": "그림자에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "그림자는 물체 뒤쪽에 생깁니다.",
      "물체에 빛을 비춰야 그림자가 생깁니다.",
      "투명한 물체는 연한 그림자가 생깁니다.",
      "불투명한 물체는 흐릿한 그림자가 생깁니다.",
      "빛이 나아가다가 물체를 만나 빛이 통과하지 못하면 그림자가 생깁니다."
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
    "explanation": "투명한 물체는 빛이 대부분 통과하여 연하고 흐릿한 그림자가 생기고, 불투명한 물체는 빛이 통과하지 못하여 진하고 선명한 그림자가 생깁니다.",
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
    "id": "s42-u03-o2-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 7,
      "page": 2,
      "sourceId": "sci-42-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "빛의 직진",
      "concept": "빛이 곧게 나아가는 성질을 빛의 직진이라고 한다."
    },
    "prompt": "빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "빛은 태양이나 전등에서 나와 사방으로 곧게 나아가는데, 이렇게 빛이 곧게 나아가는 성질을 빛의 [    ](이)라고 합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "직진",
      "accepted": [
        "직진",
        "빛의 직진"
      ]
    },
    "explanation": "빛이 곧게 나아가는 성질을 빛의 직진이라고 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 빈칸은 네모 칸으로 인쇄됨([    ]로 표기). 지문은 테두리 상자 안에 있음."
    }
  },
  {
    "id": "s42-u03-o2-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 8,
      "page": 2,
      "sourceId": "sci-42-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물체 모양과 그림자 모양",
      "concept": "물체에 빛을 비추면 빛을 받는 면의 모양과 비슷한 모양의 그림자가 생긴다."
    },
    "prompt": "위의 실험에서 스크린에 생긴 ㄱ자 모양 블록의 그림자 모양으로 알맞은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[08~09] 다음과 같이 스크린, ㄱ자 모양 블록, 손전등을 설치한 후 손전등을 켜고 그림자의 모습을 관찰해 보았습니다. 물음에 답하세요.",
      "보기": [
        "ㄱ. (그림: ㄴ자 모양 회색 도형)",
        "ㄴ. (그림: 가로로 긴 직사각형 회색 도형)",
        "ㄷ. (그림: ㄱ자 모양 회색 도형)",
        "ㄹ. (그림: ┌자 모양 회색 도형)"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s42-u03/s2-q08.webp",
    "figureNote": "<보기> 상자 안 회색 도형 4개: ㄱ. ㄴ자 모양, ㄴ. 가로 직사각형, ㄷ. ㄱ자 모양(위 가로·오른쪽 아래로 세로), ㄹ. ┌자 모양(위 가로·왼쪽 아래로 세로). 실험 장치 그림은 [08~09] 공통 그림(alsoSee).",
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
    "explanation": "ㄱ자 모양 블록에 빛을 비추면 ㄱ자 모양 블록과 비슷한 모양의 그림자가 생깁니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>의 각 항목은 글 없이 그림(회색 도형)만 인쇄됨 — givens.보기는 도형 설명. 실험 장치 공통 그림은 figure.alsoSee에 따로 둠."
    }
  },
  {
    "id": "s42-u03-o2-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 9,
      "page": 2,
      "sourceId": "sci-42-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "그림자 모양이 달라지는 조건",
      "concept": "같은 물체라도 놓는 방향이나 빛을 비추는 방향이 바뀌면 그림자의 모양이 달라진다."
    },
    "prompt": "위의 실험에서 스크린에 생기는 그림자의 모양에 영향을 줄 수 있는 것을 고르세요.",
    "givens": {
      "지문": "[08~09] 다음과 같이 스크린, ㄱ자 모양 블록, 손전등을 설치한 후 손전등을 켜고 그림자의 모습을 관찰해 보았습니다. 물음에 답하세요."
    },
    "choices": [
      "스크린의 크기",
      "손전등 빛의 밝기",
      "손전등 빛의 색깔",
      "ㄱ자 모양 블록의 색깔",
      "ㄱ자 모양 블록을 놓은 방향"
    ],
    "figure": "assets/bank/s42-u03/s2-q09.webp",
    "figureNote": "왼쪽에 스크린, 가운데 받침대 위에 초록색 ㄱ자 모양 블록, 오른쪽에 손전등이 스크린을 향해 놓인 실험 장치 그림.",
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
    "explanation": "같은 물체라도 물체를 놓는 방향이나 빛을 비추는 방향에 따라 그림자의 모양이 달라집니다. 이때 빛을 받는 면의 모양대로 그림자가 생깁니다.",
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
    "id": "s42-u03-o2-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 10,
      "page": 2,
      "sourceId": "sci-42-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "그림자의 크기 변화",
      "concept": "물체와 손전등 사이의 거리가 가까울수록 그림자가 커지고 멀수록 그림자가 작아진다."
    },
    "prompt": "그림자의 크기 변화에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "스크린과 물체를 그대로 두고 손전등을 물체에 가깝게 하면 그림자가 커집니다.",
      "스크린과 물체를 그대로 두고 손전등을 물체에서 멀게 하면 그림자가 작아집니다.",
      "스크린과 손전등을 그대로 두고 물체를 손전등에서 멀게 하면 그림자가 커집니다.",
      "스크린과 손전등을 그대로 두고 물체를 스크린에 멀게 하면 그림자의 크기는 커집니다.",
      "스크린과 손전등을 그대로 두고 물체를 스크린에 가깝게 하면 그림자의 크기는 작아집니다."
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
    "explanation": "스크린과 손전등을 그대로 두고 물체를 손전등에서 멀게 하면 그림자가 작아집니다.",
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
    "id": "s42-u03-o2-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 11,
      "page": 3,
      "sourceId": "sci-42-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "거울에 비친 물체의 모습",
      "concept": "거울에 비친 물체는 색깔과 크기는 실제와 같고 좌우만 바뀌어 보인다."
    },
    "prompt": "거울에 비친 물체의 모습에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "거울에 비친 물체의 색깔은 실제 물체의 색깔과 같습니다.",
      "거울에 비친 물체의 색깔은 실제 물체의 색깔과 다릅니다.",
      "거울에 비친 물체의 모양은 실제 물체의 모양과 좌우가 바뀌어 보입니다.",
      "거울에 비친 물체의 모양은 실제 물체의 모양과 위아래가 바뀌어 보입니다.",
      "거울에 비친 물체의 모양은 실제 물체의 모양과 상하좌우가 바뀌어 보입니다."
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
    "explanation": "거울에 비친 물체의 색깔과 크기는 실제 물체와 같지만 좌우가 바뀌어 보입니다.",
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
    "id": "s42-u03-o2-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 12,
      "page": 3,
      "sourceId": "sci-42-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "거울에 부딪친 빛",
      "concept": "빛이 거울에 부딪치면 통과하지 못하고 방향이 바뀌어 나아간다."
    },
    "prompt": "위의 실험에서 손전등의 빛이 거울에 부딪쳤을 때에 대한 설명으로 옳은 것을 고르세요.",
    "givens": {
      "지문": "[12~13] 다음과 같이 책상에 흰 종이를 깔고 거울을 수직으로 세운 뒤 거울에 손전등 빛을 비추었습니다. 물음에 답하세요."
    },
    "choices": [
      "빛이 사라집니다.",
      "빛이 거울에 부딪쳐 더 밝아집니다.",
      "빛이 거울에 부딪쳐 더 어두워집니다.",
      "빛이 거울을 통과해 곧게 나아갑니다.",
      "빛이 거울에 부딪쳐 거울에서 방향이 바뀝니다."
    ],
    "figure": "assets/bank/s42-u03/s2-q12.webp",
    "figureNote": "책상 위 흰 종이에 거울을 수직으로 세우고, 손전등(왼쪽)에서 거울 쪽으로 빛을 비추는 모습. 라벨: '손전등', '손전등의 빛을 비추는 방향'(빨간 화살표).",
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
    "explanation": "손전등에서 나온 빛이 거울에 부딪치면 빛의 방향이 바뀝니다.",
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
    "id": "s42-u03-o2-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 13,
      "page": 3,
      "sourceId": "sci-42-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "빛의 반사",
      "concept": "빛이 거울에 부딪쳐 방향이 바뀌어 나아가는 성질을 빛의 반사라고 한다."
    },
    "prompt": "위의 실험과 관련된 빛의 성질은 무엇인지 고르세요.",
    "givens": {
      "지문": "[12~13] 다음과 같이 책상에 흰 종이를 깔고 거울을 수직으로 세운 뒤 거울에 손전등 빛을 비추었습니다. 물음에 답하세요."
    },
    "choices": [
      "빛의 직진",
      "빛의 반사",
      "빛의 흡수",
      "빛의 휘어짐",
      "빛의 흩어짐"
    ],
    "figure": "assets/bank/s42-u03/s2-q12.webp",
    "figureNote": "책상 위 흰 종이에 거울을 수직으로 세우고, 손전등(왼쪽)에서 거울 쪽으로 빛을 비추는 모습. 라벨: '손전등', '손전등의 빛을 비추는 방향'(빨간 화살표).",
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
    "explanation": "거울에 빛이 부딪쳐 반사되는 것을 빛의 반사라고 합니다.",
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
    "id": "s42-u03-o2-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 14,
      "page": 3,
      "sourceId": "sci-42-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "생활 속 거울의 이용",
      "concept": "작은 곤충을 자세히 관찰할 때는 거울이 아니라 돋보기를 주로 사용한다."
    },
    "prompt": "우리 생활에서 거울을 이용하는 예로 적절하지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "무용 연습을 할 때",
      "화장실에서 세수를 할 때",
      "자신의 뒷머리 모습을 볼 때",
      "화단에서 개미를 자세히 관찰할 때",
      "옷 가게에서 옷 입은 모습을 볼 때"
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
    "explanation": "화단에서 작은 곤충을 관찰할 때는 주로 돋보기를 사용합니다.",
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
    "id": "s42-u03-o2-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 15,
      "page": 3,
      "sourceId": "sci-42-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "거울을 이용한 장난감",
      "concept": "만화경은 거울에서 빛이 반사하는 성질을 이용해 여러 가지 무늬를 보게 하는 장난감이다."
    },
    "prompt": "다음은 거울을 이용해 여러 가지 모양의 무늬를 볼 수 있게 만든 장난감의 모습입니다. 이 장난감의 이름으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "망원경",
      "만화경",
      "잠망경",
      "무한 거울",
      "착시 거울"
    ],
    "figure": "assets/bank/s42-u03/s2-q15.webp",
    "figureNote": "한쪽 끝 면에 작은 구멍이 뚫린 짙은 초록색 삼각기둥 모양 장난감(만화경) 그림.",
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
    "explanation": "만화경은 거울에 부딪친 빛이 반사하는 성질을 이용해 여러 가지 모양의 무늬를 관찰할 수 있는 장난감입니다.",
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
    "id": "s42-u03-o3-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 1,
      "page": 1,
      "sourceId": "sci-42-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "그림자가 생기는 조건",
      "concept": "그림자가 생기려면 빛과 물체가 있어야 하고, 빛을 물체 쪽으로 비추어야 한다."
    },
    "prompt": "다음은 그림자가 생기는 조건에 대한 설명입니다. 빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 그림자가 생기려면 [ ](와)과 물체가 있어야 합니다.\n• 물체를 바라보는 방향으로 [ ](을)를 비추어야 그림자가 생깁니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "빛",
      "accepted": [
        "빛"
      ]
    },
    "explanation": "그림자가 생기려면 빛과 물체가 있어야 하고, 물체를 바라보는 방향으로 빛을 비추어야 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 [ ]는 인쇄된 빈칸 상자."
    }
  },
  {
    "id": "s42-u03-o3-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 2,
      "page": 1,
      "sourceId": "sci-42-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "흰 종이를 대는 까닭",
      "concept": "물체 뒤에 흰 종이를 대면 그 위에 생긴 그림자를 더 뚜렷하게 볼 수 있다."
    },
    "prompt": "그림자를 만들 때 물체에 빛을 비추면서 물체의 뒤쪽에 흰 종이를 대는 까닭을 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s42-u03/s3-q02.webp",
    "figureNote": "왼쪽부터 세워 둔 흰 종이, 초록색 공, 노란 빛을 내는 손전등이 일렬로 놓인 그림. 그림 속 글자: 흰 종이.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "흰 종이를 대면 그림자를 더 뚜렷하게 관찰할 수 있기 때문입니다.",
      "rubric": {
        "required": [
          "흰 종이에 그림자가 비친다",
          "그림자를 더 뚜렷하게 관찰할 수 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "정답: 흰 종이를 대면 그림자를 더 뚜렷하게 관찰할 수 있다고 쓴 경우 (100%)",
          "부분 정답: 흰 종이를 대면 그림자가 생긴다고만 쓴 경우 (30%)"
        ]
      }
    },
    "explanation": "빛이 직진으로 나아가다 물체가 있으면 물체의 뒤로 그림자가 생깁니다. 흰 종이를 대면 그림자를 더 뚜렷하게 관찰할 수 있습니다.\n[채점 기준] 정답: 흰 종이를 대면 그림자를 더 뚜렷하게 관찰할 수 있다고 쓴 경우 (100%) / 부분 정답: 흰 종이를 대면 그림자가 생긴다고만 쓴 경우 (30%)",
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
    "id": "s42-u03-o3-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 3,
      "page": 1,
      "sourceId": "sci-42-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "투명한 물체의 그림자",
      "concept": "투명한 물체는 빛을 대부분 통과시켜 연하고 흐릿한 그림자를 만든다."
    },
    "prompt": "투명 플라스틱 컵에 손전등 빛을 비췄을 때의 결과로 옳은 것을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "보기": [
        "ㄱ. 빛이 대부분 통과합니다.",
        "ㄴ. 빛이 통과하지 못합니다.",
        "ㄷ. 연하고 흐릿한 그림자가 생깁니다.",
        "ㄹ. 진하고 선명한 그림자가 생깁니다."
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
      "answer": "ㄱ, ㄷ",
      "accepted": [
        "ㄱ, ㄷ",
        "ㄱ,ㄷ",
        "ㄱㄷ",
        "ㄷ, ㄱ",
        "ㄷ,ㄱ"
      ]
    },
    "explanation": "투명 플라스틱 컵에 손전등 빛을 비추면 빛이 대부분 통과하여 연하고 흐릿한 그림자가 생깁니다.",
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
    "id": "s42-u03-o3-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 4,
      "page": 1,
      "sourceId": "sci-42-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "연한 그림자가 생기는 물체",
      "concept": "안경알이나 OHP 필름처럼 투명한 물체는 빛을 대부분 통과시켜 연한 그림자가 생긴다."
    },
    "prompt": "빛을 비췄을 때 연하고 흐릿한 그림자가 생기는 것끼리 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "책, 손",
      "안경알, 그늘막",
      "유리컵, 도자기 컵",
      "안경알, OHP 필름",
      "OHP 필름, 나무 책상"
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
    "explanation": "빛을 비췄을 때 연하고 흐릿한 그림자가 생기는 것은 빛이 대부분 통과하는 투명한 물체입니다.",
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
    "id": "s42-u03-o3-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 5,
      "page": 1,
      "sourceId": "sci-42-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "안경 그림자의 진하기",
      "concept": "불투명한 안경 테는 진한 그림자를, 투명한 안경알은 연한 그림자를 만든다."
    },
    "prompt": "다음은 안경 그림자의 모습입니다. 안경의 테와 안경의 유리 중 더 진한 그림자가 생기는 부분을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 안경의 테",
        "ㄴ. 안경의 유리"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s42-u03/s3-q05.webp",
    "figureNote": "나무 탁자 위에 놓인 검은 테 안경과 그 그림자 사진. 테 부분의 그림자는 진하고 유리 부분의 그림자는 연함.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ",
        "안경의 테"
      ]
    },
    "explanation": "안경의 유리는 투명해서 연한 그림자가 생기고, 안경의 테는 불투명해서 진한 그림자가 생깁니다.",
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
    "id": "s42-u03-o3-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 6,
      "page": 2,
      "sourceId": "sci-42-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "삼각형 종이의 그림자 모양",
      "concept": "그림자는 물체의 모양과 비슷한 모양으로 생긴다."
    },
    "prompt": "위의 실험에서 스크린에 생기는 그림자의 모양으로 옳은 것을 고르세요.",
    "givens": {
      "지문": "[06~07] 다음은 스크린과 손전등 사이에 삼각형 모양 종이를 놓고 그림자를 관찰하는 모습입니다. 물음에 답하세요."
    },
    "choices": [
      "원 모양",
      "별 모양",
      "삼각형 모양",
      "사각형 모양",
      "모양이 일정하지 않다."
    ],
    "figure": "assets/bank/s42-u03/s3-q06.webp",
    "figureNote": "스크린(오른쪽 위에 흰 빛이 비친 세로 판)과 손전등 사이에 받침대에 꽂은 초록색 삼각형 모양 종이를 세워 둔 모습. 손전등은 흰 받침 위에 놓여 스크린 쪽을 비춤.",
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
    "explanation": "그림자는 물체의 모양과 비슷한 모양으로 생깁니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "공통 발문 [06~07]과 그림은 1쪽, 문항은 2쪽에 있음."
    }
  },
  {
    "id": "s42-u03-o3-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 7,
      "page": 2,
      "sourceId": "sci-42-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "그림자가 물체 모양과 비슷한 까닭",
      "concept": "빛이 곧게 나아가기 때문에 물체에 가려진 부분에 물체와 비슷한 모양의 그림자가 생긴다."
    },
    "prompt": "위의 실험 결과가 나타나는 까닭으로 옳은 것을 고르세요.",
    "givens": {
      "지문": "[06~07] 다음은 스크린과 손전등 사이에 삼각형 모양 종이를 놓고 그림자를 관찰하는 모습입니다. 물음에 답하세요."
    },
    "choices": [
      "빛이 직진하기 때문입니다.",
      "빛의 밝기가 어둡기 때문입니다.",
      "빛은 모든 물체를 통과하기 때문입니다.",
      "빛은 모든 물체를 통과하지 못하기 때문입니다.",
      "한 가지 물체는 한 가지 모양의 그림자만 만들 수 있기 때문입니다."
    ],
    "figure": "assets/bank/s42-u03/s3-q06.webp",
    "figureNote": "스크린(오른쪽 위에 흰 빛이 비친 세로 판)과 손전등 사이에 받침대에 꽂은 초록색 삼각형 모양 종이를 세워 둔 모습. 손전등은 흰 받침 위에 놓여 스크린 쪽을 비춤.",
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
    "explanation": "빛이 직진하기 때문에 물체를 통과하지 못한 부분의 그림자가 생깁니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "공통 발문 [06~07]과 그림은 1쪽, 문항은 2쪽에 있음."
    }
  },
  {
    "id": "s42-u03-o3-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 8,
      "page": 2,
      "sourceId": "sci-42-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "ㄱ자 블록 그림자 실험",
      "concept": "빛이 물체를 통과하지 못하고 가려진 부분에 그림자가 생기므로 물체와 비슷한 모양의 그림자가 생긴다."
    },
    "prompt": "다음과 같이 스크린, ㄱ자 모양 블록, 손전등을 설치하고 물체의 모양과 그림자의 모양을 비교하는 실험을 하였습니다. 이 실험에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "스크린-ㄱ자 모양 블록-손전등 순으로 놓아야 합니다.",
      "물체의 모양과 스크린에 생긴 그림자의 모양이 비슷합니다.",
      "ㄱ자 모양 블록의 방향을 바꾸면 그림자의 모양이 달라집니다.",
      "손전등의 빛이 ㄱ자 모양 블록을 통과하여 물체 모양의 그림자가 생깁니다.",
      "스크린에 생긴 그림자와 물체의 모양을 비교하면 물체의 모양과 비슷한 모양의 그림자가 생긴다는 것을 알 수 있습니다."
    ],
    "figure": "assets/bank/s42-u03/s3-q08.webp",
    "figureNote": "왼쪽에 세워 둔 스크린, 가운데 탁자 위에 연두색 ㄱ자 모양 블록(정육면체 3개), 오른쪽 흰 받침 위의 손전등이 스크린 쪽을 비추는 그림.",
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
    "explanation": "빛이 나아가다가 물체를 만나면 빛이 통과하지 못하는 부분에 그림자가 생기기 때문에 물체의 모양과 비슷한 모양의 그림자가 생깁니다.",
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
    "id": "s42-u03-o3-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 9,
      "page": 2,
      "sourceId": "sci-42-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "방향에 따른 그림자 모양",
      "concept": "같은 물체라도 빛을 비추는 방향이 바뀌면 그림자 모양이 달라지며, ㄱ자 블록을 위에서 비추면 직선(긴 직사각형) 모양 그림자가 생긴다."
    },
    "prompt": "다음과 같이 ㄱ자 모양 블록 위쪽에서 손전등을 비추었을 때 생기는 그림자의 모양으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "",
      "",
      "",
      "",
      ""
    ],
    "figure": "assets/bank/s42-u03/s3-q09.webp",
    "figureNote": "위: 손전등이 아래쪽을 향해 빛을 비추고 그 아래에 분홍색 ㄱ자 모양 블록이 있는 그림. 아래: 보기 그림 ①~⑤ — ① 가로로 긴 직사각형, ② 세로로 긴 직사각형, ③ ㄱ자 모양, ④ ㄱ자를 좌우로 뒤집은 모양(Γ), ⑤ ㄴ자 모양.",
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
    "explanation": "ㄱ자 모양 블록의 위쪽에서 보았을 때는 직선 모양의 그림자가 보입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기 ①~⑤가 그림이라 choices에는 번호만 적음. 각 그림의 모양은 figure.note에 묘사."
    }
  },
  {
    "id": "s42-u03-o3-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 10,
      "page": 3,
      "sourceId": "sci-42-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "그림자 크기를 바꾸는 방법",
      "concept": "스크린과 물체를 그대로 두면 손전등과 물체 사이의 거리를 바꾸어 그림자 크기를 바꿀 수 있다."
    },
    "prompt": "위의 실험에서 스크린과 종이 인형을 그대로 두고 그림자의 크기를 변화시키는 방법으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": {
      "지문": "[10~11] 다음은 손전등과 스크린 사이에 종이 인형을 놓아 그림자를 만드는 실험을 하는 모습입니다. 물음에 답하세요."
    },
    "choices": [
      "손전등을 종이 인형에 멀게 합니다.",
      "손전등을 종이 인형에 가깝게 합니다.",
      "손전등을 좌우로 움직이며 빛을 비춥니다.",
      "손전등의 밝기를 더 밝게 하여 빛을 비춥니다.",
      "손전등의 색깔을 다르게 하여 빛을 비춥니다."
    ],
    "figure": "assets/bank/s42-u03/s3-q10.webp",
    "figureNote": "왼쪽에 세워 둔 스크린, 그 앞 받침대에 꽂은 노란 종이 인형(동물 모양), 오른쪽에 스탠드에 끼운 손전등. 그림 속 글자: 스크린, 종이 인형, 손전등.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1
      ]
    },
    "explanation": "스크린과 물체를 그대로 두었을 때 그림자의 크기는 손전등과 물체 사이의 거리에 따라 달라집니다.",
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
    "id": "s42-u03-o3-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 11,
      "page": 3,
      "sourceId": "sci-42-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E4",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "손전등을 멀리할 때 그림자 크기",
      "concept": "손전등을 물체에서 멀리하면 그림자의 크기가 작아진다."
    },
    "prompt": "위의 실험에서 스크린과 종이 인형을 그대로 두고, 손전등을 종이 인형에서 멀게 하면 그림자의 크기는 어떻게 변하는지 쓰세요.",
    "givens": {
      "지문": "[10~11] 다음은 손전등과 스크린 사이에 종이 인형을 놓아 그림자를 만드는 실험을 하는 모습입니다. 물음에 답하세요."
    },
    "choices": null,
    "figure": "assets/bank/s42-u03/s3-q10.webp",
    "figureNote": "왼쪽에 세워 둔 스크린, 그 앞 받침대에 꽂은 노란 종이 인형(동물 모양), 오른쪽에 스탠드에 끼운 손전등. 그림 속 글자: 스크린, 종이 인형, 손전등.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "손전등을 종이 인형에서 멀게 하면 그림자의 크기가 작아집니다.",
      "rubric": {
        "required": [
          "그림자의 크기가 작아진다",
          "손전등이 종이 인형에서 멀어졌기 때문이다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "정답: 그림자의 크기 변화를 옳게 쓴 경우 (100%)"
        ]
      }
    },
    "explanation": "물체와 손전등 사이의 거리가 가까워지면 그림자의 크기가 커지고, 멀어지면 그림자의 크기가 작아집니다.\n[채점 기준] 정답: 그림자의 크기 변화를 옳게 쓴 경우 (100%)",
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
    "id": "s42-u03-o3-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 12,
      "page": 3,
      "sourceId": "sci-42-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "그림자에 대한 설명",
      "concept": "빛이 물체를 통과하는 정도는 그림자의 모양이 아니라 진하기를 바꾼다."
    },
    "prompt": "그림자에 대한 설명으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 빛을 받는 면의 모양대로 그림자가 생깁니다.",
        "ㄴ. 손전등과 물체 사이의 거리에 따라 그림자의 크기가 달라집니다.",
        "ㄷ. 빛이 물체를 통과하는 정도에 따라 그림자의 모양이 달라집니다.",
        "ㄹ. 물체를 놓은 방향이 달라지면 그림자의 모양이 달라지기도 합니다."
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
    "explanation": "빛이 물체를 통과하는 정도에 따라 그림자의 진하기가 달라집니다.",
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
    "id": "s42-u03-o3-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 13,
      "page": 3,
      "sourceId": "sci-42-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E4",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물체를 손전등 쪽으로 옮길 때 그림자 크기",
      "concept": "스크린과 손전등을 그대로 두고 물체를 손전등에 가깝게 하면 그림자가 커진다."
    },
    "prompt": "괄호에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "[13~14] 다음과 같이 손전등과 스크린 사이에 물체를 놓고 손전등 빛을 비추어 그림자가 생기게 하였습니다. 물음에 답하세요.\n위 실험에서 스크린과 손전등을 그대로 두고 물체를 ㈎ 방향으로 움직이면 그림자의 크기는 ( 커, 작아 )집니다."
    },
    "choices": null,
    "figure": "assets/bank/s42-u03/s3-q13.webp",
    "figureNote": "스크린 앞에 받침대에 꽂은 노란 원 모양 물체가 있고, 스크린에 회색 그림자가 생김. 물체 아래에 오른쪽(손전등 쪽)을 가리키는 화살표 (가)가 있음. 오른쪽에 흰 받침 위의 손전등. 그림 속 글자: 스크린, 물체, (가), 손전등.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "커",
      "accepted": [
        "커",
        "커집니다",
        "커진다"
      ]
    },
    "explanation": "스크린과 손전등을 그대로 두었을 때 물체를 손전등에 가깝게 하면 그림자의 크기가 커집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "㈎ 방향은 그림의 화살표로만 표시됨(손전등 쪽). 지문의 ( 커, 작아 )는 둘 중 하나를 고르는 괄호."
    }
  },
  {
    "id": "s42-u03-o3-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 14,
      "page": 3,
      "sourceId": "sci-42-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "그림자를 작게 하는 방법",
      "concept": "손전등과 물체 사이의 거리를 멀게 하면 그림자의 크기가 작아진다."
    },
    "prompt": "위 실험에서 그림자의 크기가 작아지게 하는 방법으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": {
      "지문": "[13~14] 다음과 같이 손전등과 스크린 사이에 물체를 놓고 손전등 빛을 비추어 그림자가 생기게 하였습니다. 물음에 답하세요."
    },
    "choices": [
      "더 밝은 손전등으로 물체를 비춥니다.",
      "물체와 스크린을 그대로 두고 손전등을 물체에 가깝게 합니다.",
      "물체와 스크린을 그대로 두고 손전등을 물체에서 멀게 합니다.",
      "스크린과 손전등을 그대로 두고 물체를 손전등에 가깝게 합니다.",
      "스크린과 손전등을 그대로 두고 물체를 손전등에서 멀게 합니다."
    ],
    "figure": "assets/bank/s42-u03/s3-q13.webp",
    "figureNote": "스크린 앞에 받침대에 꽂은 노란 원 모양 물체가 있고, 스크린에 회색 그림자가 생김. 물체 아래에 오른쪽(손전등 쪽)을 가리키는 화살표 (가)가 있음. 오른쪽에 흰 받침 위의 손전등. 그림 속 글자: 스크린, 물체, (가), 손전등.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        4
      ]
    },
    "explanation": "물체와 스크린을 그대로 두고 손전등을 물체에서 멀게 하거나 스크린과 손전등을 그대로 두고 물체를 손전등에서 멀게 하면 그림자의 크기가 작아집니다.",
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
    "id": "s42-u03-o3-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 15,
      "page": 4,
      "sourceId": "sci-42-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "거울에 비친 글자",
      "concept": "거울에 비친 물체의 모습은 좌우가 바뀌어 보인다."
    },
    "prompt": "다음 글자를 거울에 비췄을 때의 모양으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "",
      "",
      "",
      "",
      ""
    ],
    "figure": "assets/bank/s42-u03/s3-q15.webp",
    "figureNote": "위: 네모 칸 안의 글자 '가'. 아래: 보기 그림 ①~⑤ — ① '가' 그대로, ② '가'의 상하가 뒤집힌 모양, ③ '가'의 좌우가 바뀐 모양(ㅓ 왼쪽, 뒤집힌 ㄱ 오른쪽), ④ '가'를 90° 돌린 모양, ⑤ '가'를 180° 돌린 모양.",
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
    "explanation": "글자를 거울에 비추어 보면 글자의 좌우가 바뀌어 보입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기 ①~⑤가 그림이라 choices에는 번호만 적음. 각 그림의 모양은 figure.note에 묘사."
    }
  },
  {
    "id": "s42-u03-o3-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 16,
      "page": 4,
      "sourceId": "sci-42-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "구급차 글자를 좌우로 바꾼 까닭",
      "concept": "거울은 좌우를 바꾸어 보여 주므로 좌우를 바꾸어 쓴 글자는 뒷거울에서 똑바로 보인다."
    },
    "prompt": "다음과 같이 구급차 앞부분에 글자를 좌우로 바꾸어 쓴 까닭으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 사람들이 못 알아보게 하기 위해서입니다.",
        "ㄴ. 글자를 더 밝게 보이도록 하기 위해서입니다.",
        "ㄷ. 구급차가 하는 일이 중요하다는 것을 알리기 위해서입니다.",
        "ㄹ. 자동차의 뒷거울을 통해 보았을 때 글자가 똑바로 보이게 하기 위해서입니다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s42-u03/s3-q16.webp",
    "figureNote": "노란색·흰색 구급차의 앞부분 그림. 보닛 위에 좌우가 바뀐 글자가 작게 그려져 있음.",
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
    "explanation": "구급차의 앞부분에 글자를 좌우로 바꾸어 쓴 까닭은 자동차의 뒷거울을 통해 보았을 때 글자가 똑바로 보이게 하기 위해서입니다.",
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
    "id": "s42-u03-o3-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 17,
      "page": 4,
      "sourceId": "sci-42-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "빛의 반사",
      "concept": "빛의 반사는 빛이 거울에 부딪쳐 나아가는 방향이 바뀌는 현상이다."
    },
    "prompt": "빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "빛의 반사는 빛이 나아가다가 거울에 부딪쳐 빛의 [ ](이)가 바뀌는 것입니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "방향",
      "accepted": [
        "방향",
        "빛의 방향"
      ]
    },
    "explanation": "빛이 나아가다가 거울에 부딪쳐서 빛의 방향이 바뀌는 현상을 빛의 반사라고 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 [ ]는 인쇄된 빈칸 상자."
    }
  },
  {
    "id": "s42-u03-o3-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 18,
      "page": 4,
      "sourceId": "sci-42-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "버스 거울의 쓰임",
      "concept": "거울은 빛을 반사하므로 뒤를 돌아보지 않고도 뒤쪽의 모습을 볼 수 있게 해 준다."
    },
    "prompt": "버스 운전기사는 뒤를 돌아보지 않고도 승객이 안전하게 내리는지 확인할 수 있습니다. 이에 대한 설명으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 거울을 이용해 빛의 밝기를 바꿀 수 있기 때문입니다.",
        "ㄴ. 거울을 이용해 빛의 색깔을 바꿀 수 있기 때문입니다.",
        "ㄷ. 거울을 이용해 빛이 없어도 물체를 볼 수 있기 때문입니다.",
        "ㄹ. 거울을 이용해 뒤에 있는 승객의 모습을 볼 수 있기 때문입니다."
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
    "explanation": "거울을 사용하면 빛이 반사되는 것을 이용해 뒤를 돌아보지 않고도 승객의 모습을 볼 수 있습니다.",
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
    "id": "s42-u03-o3-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 19,
      "page": 5,
      "sourceId": "sci-42-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "거울의 이용",
      "concept": "거울은 빛의 반사를 이용한 도구로, 모습을 비춰 보거나 장식품·예술품을 만드는 데 쓰인다."
    },
    "prompt": "빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 자신의 모습을 보거나 주변에 있는 다른 모습을 볼 때 [ ](을)를 사용합니다.\n• [ ](은)는 빛의 반사를 이용한 도구입니다.\n• [ ](을)를 이용하여 장식품이나 예술품을 만들기도 합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "거울",
      "accepted": [
        "거울"
      ]
    },
    "explanation": "거울이 빛을 반사하는 성질을 이용하여 자신 또는 주변의 모습을 보거나 장식품이나 예술품을 만드는 등 우리 생활에 거울을 다양하게 이용하고 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 [ ]는 인쇄된 빈칸 상자."
    }
  },
  {
    "id": "s42-u03-o3-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 20,
      "page": 5,
      "sourceId": "sci-42-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "미용실 거울의 쓰임새",
      "concept": "미용실의 거울은 자신의 머리 모양을 보는 데 쓰인다."
    },
    "prompt": "미용실에 있는 거울의 쓰임새로 가장 적절한 것을 고르세요.",
    "givens": null,
    "choices": [
      "세수할 때 얼굴을 보는 데 사용합니다.",
      "옷을 입은 모습을 보는 데 사용합니다.",
      "자신의 머리 모양을 보는 데 사용합니다.",
      "다른 자동차의 위치를 보는 데 사용합니다.",
      "무용하는 자신의 모습을 보는 데 사용합니다."
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
    "explanation": "미용실에서는 자신의 머리 모양을 보는 데 거울을 사용합니다.",
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
    "id": "s42-u03-o4-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 1,
      "page": 1,
      "sourceId": "sci-42-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "그림자가 생기는 조건",
      "concept": "그림자가 생기려면 빛과 그 빛을 가리는 물체가 함께 있어야 한다."
    },
    "prompt": "다음 그림을 보고 그림자가 생기는 조건을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "빛이 있어야 합니다.",
      "물체가 있어야 합니다.",
      "구름이 있어야 합니다.",
      "물체가 움직여야 합니다.",
      "물체 뒤쪽에 거울이 있어야 합니다."
    ],
    "figure": "assets/bank/s42-u03/s4-q01.webp",
    "figureNote": "햇빛이 비치는 운동장에서 아이들과 철봉·나무의 그림자가 땅에 생긴 그림",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1
      ]
    },
    "explanation": "그림자가 생기려면 빛과 물체가 있어야 합니다.",
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
    "id": "s42-u03-o4-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 2,
      "page": 1,
      "sourceId": "sci-42-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "그림자가 생기는 물체의 위치",
      "concept": "물체가 광원과 스크린 사이에 있어 빛을 가려야 스크린에 그림자가 생긴다."
    },
    "prompt": "다음과 같이 흰 종이에 손전등 빛을 비추고 있을 때 공의 그림자가 생기게 하기 위한 공의 위치로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 손전등의 뒤쪽",
        "ㄴ. 흰 종이의 뒤쪽",
        "ㄷ. 손전등과 흰 종이 사이"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s42-u03/s4-q02.webp",
    "figureNote": "왼쪽의 손전등이 오른쪽에 세워 둔 흰 종이를 향해 빛을 비추는 그림",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ",
        "손전등과 흰 종이 사이"
      ]
    },
    "explanation": "그림자가 생기기 위해서는 빛을 가릴 물체가 필요합니다. 손전등과 흰 종이 사이에 공을 놓으면 흰 종이에 공 모양의 그림자가 생깁니다.",
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
    "id": "s42-u03-o4-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 3,
      "page": 1,
      "sourceId": "sci-42-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "손전등 두 개로 비춘 그림자",
      "concept": "서로 다른 방향에서 두 광원이 한 물체를 비추면 서로 다른 위치에 그림자가 두 개 생긴다."
    },
    "prompt": "다음과 같이 물체 하나에 손전등 두 개로 빛을 비추었을 때 흰 종이에 생기는 물체의 그림자에 대한 설명으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 그림자가 사라집니다.",
        "ㄴ. 그림자가 두 개 생깁니다.",
        "ㄷ. 그림자가 네 개 생깁니다.",
        "ㄹ. 그림자가 물체 아래 부분에 한 개 생깁니다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s42-u03/s4-q03.webp",
    "figureNote": "실에 매단 공 하나를 위쪽 양옆의 손전등 두 개가 비스듬히 비추고, 아래에 흰 종이가 놓인 그림",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ",
        "그림자가 두 개 생깁니다."
      ]
    },
    "explanation": "물체 하나에 서로 다른 방향에서 손전등 두 개를 켜서 빛을 비추면 서로 다른 위치에 두 개의 그림자가 생깁니다.",
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
    "id": "s42-u03-o4-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 4,
      "page": 1,
      "sourceId": "sci-42-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "진한 그림자가 생기는 물체",
      "concept": "빛이 통과하지 못하는 불투명한 물체에 빛을 비추면 진한 그림자가 생긴다."
    },
    "prompt": "물체에 빛을 비추었을 때 진한 그림자가 생기는 물체를 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "책",
      "유리컵",
      "무색 비닐",
      "도자기 컵",
      "OHP 필름"
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
    "explanation": "빛이 나아가다가 불투명한 물체를 만나면 빛이 통과하지 못해 진한 그림자가 생깁니다. 책, 도자기 컵은 불투명한 물체이고, 유리컵, 무색 비닐, OHP 필름은 투명한 물체입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "choices printed in two columns (①②/③④/⑤)"
    }
  },
  {
    "id": "s42-u03-o4-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 5,
      "page": 1,
      "sourceId": "sci-42-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "도자기 컵 그림자의 특징",
      "concept": "불투명한 도자기 컵은 빛을 통과시키지 않아 투명한 유리컵보다 진하고 선명한 그림자를 만든다."
    },
    "prompt": "도자기 컵에 손전등의 빛을 비췄을 때 생기는 그림자에 대한 설명으로 옳지 않은 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "그림자 모양은 도자기 컵의 모양과 같습니다.",
      "빛이 도자기 컵을 통과하여 그림자가 생깁니다.",
      "도자기 컵이 불투명한 물체이기 때문에 그림자가 생깁니다.",
      "유리컵에 빛을 비췄을 때보다 연하고 흐릿한 그림자가 생깁니다.",
      "유리컵에 빛을 비췄을 때보다 진하고 선명한 그림자가 생깁니다."
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
    "explanation": "도자기 컵에는 빛이 통과하지 못하여 투명한 유리컵에 빛을 비췄을 때보다 진하고 선명한 그림자가 생깁니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은' is underlined in the prompt."
    }
  },
  {
    "id": "s42-u03-o4-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 6,
      "page": 2,
      "sourceId": "sci-42-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "안경 그림자의 진하기",
      "concept": "투명한 부분은 빛이 많이 통과해 연한 그림자가, 불투명한 부분은 빛이 통과하지 못해 진한 그림자가 생긴다."
    },
    "prompt": "빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 각각 쓰세요.",
    "givens": {
      "지문": "안경의 유리 부분은 [㉠]하기 때문에 연한 그림자가 생기고, 안경의 테 부분은 [㉡]하기 때문에 진한 그림자가 생깁니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-투명, ㉡-불투명",
      "accepted": [
        "㉠-투명, ㉡-불투명",
        "투명, 불투명",
        "㉠ 투명 ㉡ 불투명",
        "투명,불투명"
      ]
    },
    "explanation": "안경의 유리 부분은 투명해서 연한 그림자가 생기고, 안경의 테 부분은 불투명해서 진한 그림자가 생깁니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "[㉠], [㉡] are printed as boxed blanks inside a bordered passage; answer line printed as '㉠-(  ), ㉡-(  )'."
    }
  },
  {
    "id": "s42-u03-o4-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 7,
      "page": 2,
      "sourceId": "sci-42-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "그림자를 이용한 생활 속 예",
      "concept": "모자·양산·천막·색안경은 빛을 가려 그림자를 만드는 성질을 이용하지만, 유리 어항은 빛을 통과시키도록 만든 것이다."
    },
    "prompt": "우리 생활에서 물체의 그림자가 생기는 것을 이용해 생활을 편리하게 한 예가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "모자",
      "양산",
      "천막",
      "색안경",
      "유리 어항"
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
    "explanation": "유리 어항은 빛이 대부분 통과하여 물고기가 잘 살 수 있도록 한 것으로, 물체의 그림자가 생기는 것을 이용한 예가 아닙니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'아닌' is underlined in the prompt; choices printed in two columns."
    }
  },
  {
    "id": "s42-u03-o4-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 8,
      "page": 2,
      "sourceId": "sci-42-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "원 모양 종이의 그림자 모양",
      "concept": "빛이 곧게 나아가므로 물체의 모양과 비슷한 모양의 그림자가 생긴다."
    },
    "prompt": "다음과 같이 스크린, 원 모양 종이, 손전등을 설치하고 손전등을 켰을 때 스크린에 생기는 원 모양 종이의 그림자 모양으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 원 모양",
        "ㄴ. 별 모양",
        "ㄷ. 삼각형 모양",
        "ㄹ. 사각형 모양"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s42-u03/s4-q08.webp",
    "figureNote": "스탠드에 세운 원 모양(노란색) 종이 뒤에 스크린이 있고, 앞쪽 받침 위 손전등이 빛을 비추는 그림",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ",
        "원 모양",
        "원모양"
      ]
    },
    "explanation": "물체의 모양과 비슷한 모양의 그림자가 생깁니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기 printed in two columns (ㄱ ㄴ / ㄷ ㄹ)."
    }
  },
  {
    "id": "s42-u03-o4-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 9,
      "page": 2,
      "sourceId": "sci-42-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "ㄴ자 모양 블록의 그림자 모양",
      "concept": "빛이 곧게 나아가므로 ㄴ자 모양 블록은 ㄴ자 모양의 그림자를 만든다."
    },
    "prompt": "스크린, ㄴ자 모양 블록, 손전등을 순서대로 설치하고 손전등을 켰을 때 스크린에 생기는 ㄴ자 모양 블록의 그림자 모양으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "(ㄱ자 모양 그림)",
      "(ㄴ자 모양 그림)",
      "(꺾쇠(∧) 모양 그림)",
      "(가로로 긴 직사각형 그림)",
      "(세로로 긴 직사각형 그림)"
    ],
    "figure": "assets/bank/s42-u03/s4-q09.webp",
    "figureNote": "보기 ①~⑤가 회색 도형 그림: ① ㄱ자 모양, ② ㄴ자 모양, ③ 꺾쇠(∧) 모양, ④ 가로로 긴 직사각형, ⑤ 세로로 긴 직사각형",
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
    "explanation": "그림자는 물체의 모양과 비슷한 모양으로 생깁니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "Choices are pictures only; choice texts in parentheses are descriptions, not printed text."
    }
  },
  {
    "id": "s42-u03-o4-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 10,
      "page": 2,
      "sourceId": "sci-42-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물체와 그림자 모양이 비슷한 까닭",
      "concept": "빛은 곧게 나아가는 직진 성질이 있어 물체 모양과 비슷한 그림자가 생긴다."
    },
    "prompt": "물체의 모양과 그림자의 모양이 비슷한 까닭으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "빛이 직진하기 때문입니다.",
      "빛이 사방으로 휘어져 나아가기 때문입니다.",
      "빛이 한 방향으로 휘어져 나아가기 때문입니다.",
      "빛이 두 방향으로 휘어져 나아가기 때문입니다.",
      "빛이 여러 방향으로 휘어져 나아가기 때문입니다."
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
    "explanation": "빛이 직진하기 때문에 물체의 모양과 비슷한 모양의 그림자가 생깁니다.",
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
    "id": "s42-u03-o4-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 11,
      "page": 3,
      "sourceId": "sci-42-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E4",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물체 위치에 따른 그림자 크기",
      "concept": "손전등과 스크린이 고정되어 있을 때 물체가 손전등에 가까울수록 그림자가 커지고 멀수록 작아진다."
    },
    "prompt": "다음은 손전등과 스크린을 그대로 두었을 때 물체의 그림자의 크기를 변화시키는 방법에 대한 설명입니다. 괄호 ㉠과 ㉡에 들어갈 알맞은 말을 골라 각각 쓰세요.",
    "givens": {
      "지문": "손전등과 스크린을 그대로 두었을 때 물체를 손전등에 가깝게 하면 그림자의 크기는 ㉠( 커, 작아 )지고, 물체를 손전등에서 멀게 하면 그림자의 크기는 ㉡( 커, 작아 )집니다."
    },
    "choices": null,
    "figure": "assets/bank/s42-u03/s4-q11.webp",
    "figureNote": "스크린 앞 스탠드에 물체(동물 모양)가 있고 오른쪽에 손전등이 놓인 실험 장치 그림, 라벨 '스크린', '물체', '손전등'",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-커, ㉡-작아",
      "accepted": [
        "㉠-커, ㉡-작아",
        "커, 작아",
        "㉠ 커 ㉡ 작아",
        "커,작아"
      ]
    },
    "explanation": "손전등과 스크린을 그대로 두었을 때 물체가 손전등에 가까워지면 그림자의 크기가 커지고, 물체가 손전등에서 멀어지면 그림자의 크기가 작아집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "Passage printed in a bordered box; answer line '㉠-(  ), ㉡-(  )'."
    }
  },
  {
    "id": "s42-u03-o4-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 12,
      "page": 3,
      "sourceId": "sci-42-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E4",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "손전등 위치에 따른 그림자 크기",
      "concept": "물체와 스크린이 고정되어 있을 때 손전등을 물체에서 멀리 할수록 그림자가 작아진다."
    },
    "prompt": "다음과 같이 스크린, 물체, 손전등을 놓고 손전등 빛을 비추어 그림자를 만들었습니다. 그림자의 크기를 작게 만들려면 손전등을 어느 방향으로 움직여야 하는지 기호(ㄱ~ㄴ)를 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s42-u03/s4-q12.webp",
    "figureNote": "스크린 앞에 물체가 있고 그 앞 손전등에 두 화살표가 있음: ㄱ은 물체 쪽(가까워지는 방향), ㄴ은 물체에서 멀어지는 방향",
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
    "explanation": "물체와 스크린을 그대로 두었을 때 손전등이 물체에 가까워질수록 그림자의 크기가 커지고, 물체에서 멀어질수록 그림자의 크기가 작아집니다.",
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
    "id": "s42-u03-o4-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 13,
      "page": 3,
      "sourceId": "sci-42-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "그림자 크기에 영향을 주는 요인",
      "concept": "그림자의 크기는 손전등과 물체 사이의 거리에 따라 달라진다."
    },
    "prompt": "그림자의 크기에 영향을 주는 것을 고르세요.",
    "givens": null,
    "choices": [
      "손전등의 색깔",
      "손전등의 밝기",
      "스크린의 크기",
      "물체의 투명한 정도",
      "손전등과 물체 사이의 거리"
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
    "explanation": "손전등과 물체 사이의 거리에 따라 그림자의 크기가 달라집니다.",
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
    "id": "s42-u03-o4-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 14,
      "page": 3,
      "sourceId": "sci-42-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E5",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "거울에 비친 물체의 모습",
      "concept": "거울에 비친 물체는 색깔과 크기는 실제와 같고 좌우만 바뀌어 보인다."
    },
    "prompt": "거울에 비친 물체의 모습을 설명한 것으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 거울에 비친 물체의 색깔은 실제 물체와 같습니다.",
        "ㄴ. 거울에 물체를 비춰 보면 실제 물체보다 매우 크게 보입니다.",
        "ㄷ. 거울에 비친 물체의 모양은 실제 물체와 좌우가 바뀌어 보입니다."
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
    "explanation": "거울에 물체를 비춰보면 색깔과 크기는 실제 물체와 같게 보이지만 좌우가 바뀌어 보입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은' is underlined in the prompt."
    }
  },
  {
    "id": "s42-u03-o4-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 15,
      "page": 3,
      "sourceId": "sci-42-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "거울에 비친 인형의 모습",
      "concept": "거울에 비친 모습은 실제 모습과 좌우가 바뀌어 보인다."
    },
    "prompt": "다음은 인형의 실제 모습과 거울에 비친 모습입니다. 이에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "색깔이 다릅니다.",
      "위아래가 바뀌어 보입니다.",
      "왼쪽과 오른쪽이 바뀌어 보입니다.",
      "들고 있는 날개의 위치가 같습니다.",
      "거울에 비친 인형의 모습이 실제 모습보다 크게 보입니다."
    ],
    "figure": "assets/bank/s42-u03/s4-q15.webp",
    "figureNote": "모자를 쓴 펭귄 인형 두 개: 왼쪽 '▲실제 모습'은 한쪽 날개를 들고, 오른쪽 '▲거울에 비친 모습'은 반대쪽 날개를 듦",
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
    "explanation": "거울에 비친 물체는 실제 물체와 좌우가 바뀌어 보입니다. 실제 인형은 왼쪽 날개를 올리고 있지만 거울에 비친 인형의 모습은 오른쪽 날개를 올리고 있습니다.",
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
    "id": "s42-u03-o4-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 16,
      "page": 3,
      "sourceId": "sci-42-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E5",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "구급차 앞 글자와 뒷거울",
      "concept": "구급차 앞부분 글자는 좌우를 바꿔 써 두어 앞차의 거울에 비치면 좌우가 다시 바뀌어 똑바로 보인다."
    },
    "prompt": "다음은 구급차의 모습입니다. 구급차의 앞부분에 쓰인 숫자가 앞서가는 자동차의 뒷거울로 볼 때 어떻게 보이는지 쓰고, 그렇게 보이는 까닭을 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s42-u03/s4-q16.webp",
    "figureNote": "노란색·흰색 구급차 그림. 보닛 앞에 좌우가 바뀐 글자 '119'(와 '구급대' 문구)가 거꾸로 쓰여 있음",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "119로 보입니다. 거울은 물체의 좌우가 바뀌어 보이기 때문입니다.",
      "rubric": {
        "required": [
          "119로(바르게) 보인다",
          "거울은 물체의 좌우가 바뀌어 보이기 때문이다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "119로 보인다고 쓰고, 그 까닭을 거울은 물체의 좌우가 바뀌어 보이기 때문이라고 쓴 경우 (100%)",
          "119로 보인다고만 쓴 경우 (30%)"
        ]
      }
    },
    "explanation": "앞서가는 자동차의 운전자가 거울로 뒤에 오는 구급차를 보았을 때 구급차 앞부분 글자의 좌우가 바뀌어 똑바로 보입니다.\n[채점 기준] 119로 보인다고 쓰고, 그 까닭을 거울은 물체의 좌우가 바뀌어 보이기 때문이라고 쓴 경우 (100%) / 119로 보인다고만 쓴 경우 (30%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "Rubric labels: 정답 100%, 부분 정답 30%. The mirrored lettering on the ambulance is small; the large mark reads as mirrored '119'."
    }
  },
  {
    "id": "s42-u03-o4-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 17,
      "page": 4,
      "sourceId": "sci-42-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "거울에 비쳐도 같은 글자",
      "concept": "좌우 대칭인 글자는 거울에 비쳐 좌우가 바뀌어도 원래 모양과 같게 보인다."
    },
    "prompt": "거울에 비친 모양과 실제 모양이 같은 글자를 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "아",
      "몸",
      "나",
      "규",
      "우"
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
    "explanation": "좌우가 같은 글자는 거울에 비쳤을 때 원래 모양과 같은 모양으로 보입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "choices printed in a 3+2 grid."
    }
  },
  {
    "id": "s42-u03-o4-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 18,
      "page": 4,
      "sourceId": "sci-42-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "빛의 반사와 거울",
      "concept": "거울은 빛이 부딪치면 방향이 바뀌는 빛의 반사를 이용해 물체의 모습을 비춘다."
    },
    "prompt": "빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 빛이 나아가다 [  ]에 부딪치면 빛의 방향이 바뀌게 됩니다. 이러한 빛의 성질을 빛의 반사라고 합니다.\n• [  ](은)는 빛의 반사를 이용하여 물체의 모습을 비추는 도구입니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "거울",
      "accepted": [
        "거울"
      ]
    },
    "explanation": "빛을 반사시키는 물체는 거울입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "[  ] are printed as empty boxed blanks inside a bordered passage."
    }
  },
  {
    "id": "s42-u03-o4-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 19,
      "page": 4,
      "sourceId": "sci-42-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T13",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "집에서 거울을 이용하는 예",
      "concept": "집에서는 세수하거나 옷을 확인할 때처럼 자신의 모습을 비춰 보려고 거울을 이용한다."
    },
    "prompt": "집에서 거울을 이용하는 예를 한 가지 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "화장실에서 세수를 할 때, 현관 앞에서 옷을 확인할 때, 옷을 갈아입을 때 등",
      "rubric": {
        "required": [
          "집에서 거울을 쓰는 곳이나 때",
          "거울로 보는 것(얼굴·옷 등)"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "거울을 이용하는 예를 정확하게 쓴 경우 (100%)",
          "거울을 이용하는 예가 정확하지 않은 경우 (30%)"
        ]
      }
    },
    "explanation": "화장실에서 세수를 할 때, 옷을 갈아입을 때에 거울을 봅니다.\n[채점 기준] 거울을 이용하는 예를 정확하게 쓴 경우 (100%) / 거울을 이용하는 예가 정확하지 않은 경우 (30%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "Rubric labels: 정답 100%, 부분 정답 30%. Any one example suffices."
    }
  },
  {
    "id": "s42-u03-o4-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 20,
      "page": 4,
      "sourceId": "sci-42-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅲ. 그림자와 거울"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u03",
      "area": "물리",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "생활 속 거울 이용 예",
      "concept": "거울은 모습을 비춰 보는 데 쓰이고, 방향 확인에는 나침반을 쓴다."
    },
    "prompt": "우리 생활에서 거울을 이용한 예가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "운동장에서 방향을 확인할 때",
      "무용하는 자신의 모습을 볼 때",
      "옷 가게에서 옷 입은 모습을 볼 때",
      "미용실에서 자신의 머리 모양을 볼 때",
      "자동차에서 뒤에 오는 다른 자동차를 볼 때"
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
    "explanation": "운동장에서 방향을 확인할 때는 나침반을 사용합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'아닌' is underlined in the prompt."
    }
  }
];
