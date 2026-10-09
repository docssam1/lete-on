// 3-2 Ⅱ 동물의 생활 — 단원평가 원문 70문항(시매쓰DMC 최다빈출 단원평가 세트1·2·3·4). 시험지를 그대로 옮기고 정답 및 풀이와 대조했다.
// 원장 지시(2026-10-09): 원문을 그대로 문제은행에 쓴다. 그림은 시험지에서 잘라 낸 것(assets/bank/s32-u02/).
export const source = [
  {
    "id": "s32-u02-o1-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 1,
      "page": 1,
      "sourceId": "sci-32-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "우리 주변의 장소와 동물",
      "concept": "뱀과 개구리는 집안이 아니라 연못이나 화단 같은 곳에서 볼 수 있다."
    },
    "prompt": "우리 주변의 장소와 그곳에서 주로 볼 수 있는 동물을 잘못 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "집안 - 뱀, 개구리",
      "집 주변 - 개, 고양이",
      "건물 벽 - 거미, 개미",
      "화단 - 공벌레, 달팽이",
      "공원 - 비둘기, 잠자리"
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
    "explanation": "뱀이나 개구리는 연못이나 화단에서 볼 수 있는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'잘못'에 밑줄."
    }
  },
  {
    "id": "s32-u02-o1-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 2,
      "page": 1,
      "sourceId": "sci-32-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "화단에서 동물을 많이 볼 수 있는 까닭",
      "concept": "화단은 숨을 곳과 먹이가 많아 여러 동물이 산다."
    },
    "prompt": "괄호에 들어갈 알맞은 말을 골라 쓰세요.",
    "givens": {
      "지문": "화단은 눈에 잘 보이지 않아 동물이 숨기 좋은 장소이고 ( 적, 먹이 )(이)가 많아 동물을 많이 볼 수 있습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "먹이",
      "accepted": [
        "먹이"
      ]
    },
    "explanation": "화단은 동물이 숨기에 알맞은 곳과 먹이가 많아 동물을 많이 볼 수 있는 장소입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문은 상자 안에 인쇄됨. 상자 안 줄바꿈('장/소이고', '볼 수/있습니다')은 지면 폭 때문이며 이어 붙였다."
    }
  },
  {
    "id": "s32-u02-o1-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 3,
      "page": 1,
      "sourceId": "sci-32-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "날개가 있는가로 동물 분류하기",
      "concept": "참새와 잠자리는 날개가 있고 개구리·토끼·달팽이·고양이는 날개가 없다."
    },
    "prompt": "<보기>의 동물들을 ‘날개가 있는가?’로 분류할 때 ‘그렇다.’로 분류되는 것을 모두 골라 기호를 쓰세요. (정답 2 개)",
    "givens": {
      "보기": [
        "ㄱ. 참새",
        "ㄴ. 개구리",
        "ㄷ. 잠자리",
        "ㄹ. 토끼",
        "ㅁ. 달팽이",
        "ㅂ. 고양이"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u02/s1-q03.webp",
    "figureNote": "<보기> 상자 안 동물 사진 6장(ㄱ 참새, ㄴ 개구리, ㄷ 잠자리, ㄹ 토끼, ㅁ 달팽이, ㅂ 고양이)과 각 사진 아래 ▲캡션.",
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
        "참새, 잠자리"
      ]
    },
    "explanation": "참새와 잠자리는 날개가 있고, 나머지 동물들은 날개가 없습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기> 항목은 사진+캡션(▲참새 등)으로 인쇄됨. givens의 보기는 기호와 캡션 이름으로 옮김. 답란 '(   ), (   )'."
    }
  },
  {
    "id": "s32-u02-o1-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 4,
      "page": 1,
      "sourceId": "sci-32-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "동물 분류 기준 찾기",
      "concept": "잠자리와 개구리는 다리가 있고 달팽이와 지렁이는 다리가 없으므로 다리 유무로 나눌 수 있다."
    },
    "prompt": "다음과 같이 동물을 분류한 기준으로 알맞은 것을 고르세요.",
    "givens": {
      "표": {
        "분류 1": [
          "잠자리, 개구리"
        ],
        "분류 2": [
          "달팽이, 지렁이"
        ]
      }
    },
    "choices": [
      "알을 낳는가?",
      "날개가 있는가?",
      "다리가 있는가?",
      "더듬이가 있는가?",
      "다른 동물을 먹는가?"
    ],
    "figure": "assets/bank/s32-u02/s1-q04.webp",
    "figureNote": "두 칸짜리 분류 표: 왼쪽 칸 '잠자리, 개구리', 오른쪽 칸 '달팽이, 지렁이'. 칸 제목 없음.",
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
    "explanation": "잠자리와 개구리는 다리가 있지만 달팽이와 지렁이는 다리가 없습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "표에는 열 제목이 없음. givens의 '분류 1'·'분류 2'는 편의상 붙인 이름."
    }
  },
  {
    "id": "s32-u02-o1-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 5,
      "page": 1,
      "sourceId": "sci-32-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "땅속·땅 위에 사는 동물",
      "concept": "지렁이와 땅강아지는 땅속에, 너구리는 땅 위에 산다."
    },
    "prompt": "다음 동물이 주로 사는 곳을 <보기>에서 골라 기호를 쓰세요. (1) 지렁이 (2) 너구리 (3) 땅강아지",
    "givens": {
      "보기": [
        "ㄱ. 땅속",
        "ㄴ. 땅 위"
      ],
      "지문": "(1) 지렁이\n(2) 너구리\n(3) 땅강아지"
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(1) ㄱ (2) ㄴ (3) ㄱ",
      "accepted": [
        "(1) ㄱ (2) ㄴ (3) ㄱ",
        "ㄱ, ㄴ, ㄱ",
        "ㄱㄴㄱ",
        "(1) 땅속 (2) 땅 위 (3) 땅속"
      ]
    },
    "explanation": "지렁이와 땅강아지는 땅속에서 사는 동물이고, 너구리는 땅 위에서 사는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "소문항 (1)~(3)이 각각 답란을 가짐. prompt 끝에 소문항을 이어 적고 givens.지문에도 줄별로 둠."
    }
  },
  {
    "id": "s32-u02-o1-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 6,
      "page": 1,
      "sourceId": "sci-32-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "땅 위에서 걷거나 뛰는 동물의 공통점",
      "concept": "땅 위를 걷거나 뛰어다니는 동물은 다리가 있다."
    },
    "prompt": "땅 위를 걷거나 뛰어다니는 동물의 공통점을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 목이 깁니다.",
        "ㄴ. 알을 낳습니다.",
        "ㄷ. 다리가 있습니다.",
        "ㄹ. 날개가 있습니다."
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
        "다리가 있습니다."
      ]
    },
    "explanation": "땅 위를 걷거나 뛰어다니는 동물은 다리가 있습니다.",
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
    "id": "s32-u02-o1-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 7,
      "page": 2,
      "sourceId": "sci-32-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물고기가 물속에서 사는 데 알맞은 점",
      "concept": "물고기는 아가미로 물속에서 숨을 쉬고 지느러미로 헤엄친다."
    },
    "prompt": "다음은 물고기가 물속에서 생활하기에 알맞은 점에 대한 설명입니다. 빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 각각 쓰세요.",
    "givens": {
      "지문": "• [ ㉠ ](이)가 있어서 물속에서 숨을 쉴 수 있습니다.\n• [ ㉡ ](이)가 있어서 물속에서 헤엄을 잘 칠 수 있습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-아가미, ㉡-지느러미",
      "accepted": [
        "㉠-아가미, ㉡-지느러미",
        "아가미, 지느러미",
        "㉠ 아가미 ㉡ 지느러미",
        "아가미 지느러미",
        "㉠ 아가미, ㉡ 지느러미",
        "ㄱ 아가미 ㄴ 지느러미"
      ]
    },
    "explanation": "물고기는 아가미가 있어서 물속에서 숨을 쉴 수 있고, 지느러미가 있어서 물속에서 헤엄을 잘 칠 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "㉠·㉡은 상자 속 빈칸으로 인쇄됨('[ ㉠ ]'로 옮김). 답란 '㉠-(   ), ㉡-(   )'."
    }
  },
  {
    "id": "s32-u02-o1-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 8,
      "page": 2,
      "sourceId": "sci-32-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "땅과 물을 오가며 사는 동물",
      "concept": "수달과 개구리는 강가나 호숫가에서 땅과 물을 오가며 살고, 붕어와 피라미는 물속에서만 산다."
    },
    "prompt": "강가나 호숫가에서 땅과 물을 오가며 사는 동물을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2 개)",
    "givens": {
      "보기": [
        "ㄱ. 수달",
        "ㄴ. 붕어",
        "ㄷ. 피라미",
        "ㄹ. 개구리"
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
      "answer": "ㄱ, ㄹ",
      "accepted": [
        "ㄱ, ㄹ",
        "ㄱ,ㄹ",
        "ㄱㄹ",
        "ㄹ, ㄱ",
        "수달, 개구리"
      ]
    },
    "explanation": "강가나 호숫가에서 땅과 물을 오가며 사는 동물로는 수달, 개구리, 하마 등이 있습니다.",
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
    "id": "s32-u02-o1-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 9,
      "page": 2,
      "sourceId": "sci-32-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "잠자리의 특징",
      "concept": "잠자리는 몸이 가늘고 길며 날개 두 쌍과 다리 세 쌍이 있고 공중에서 멈추거나 빨리 날 수 있다."
    },
    "prompt": "잠자리를 관찰한 내용으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "몸이 납작합니다.",
      "두 쌍의 다리가 있습니다.",
      "세 쌍의 날개가 있습니다.",
      "물속에서 붕어를 잡아먹습니다.",
      "날다가 공중에서 멈추거나 빨리 날 수 있습니다."
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
    "explanation": "잠자리는 몸이 가늘고 긴 모양입니다. 두 쌍의 날개와 세 쌍의 다리가 있으며 날다가 공중에서 멈추거나 빨리 날 수 있습니다.",
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
    "id": "s32-u02-o1-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 10,
      "page": 2,
      "sourceId": "sci-32-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "새(까치·직박구리)의 공통점",
      "concept": "새는 부리와 깃털, 한 쌍의 날개와 한 쌍의 다리가 있다."
    },
    "prompt": "까치와 직박구리의 공통점으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "부리가 있습니다.",
      "날개가 있습니다.",
      "다리가 두 쌍 있습니다.",
      "몸이 깃털로 덮여 있습니다.",
      "애벌레나 작은 곤충을 먹습니다."
    ],
    "figure": "assets/bank/s32-u02/s1-q10.webp",
    "figureNote": "까치 사진과 직박구리 사진 각 1장, 아래에 ▲까치, ▲직박구리 캡션.",
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
    "explanation": "박새와 직박구리는 한 쌍의 다리와 날개가 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄. 문제는 '까치와 직박구리'인데 해설은 '박새와 직박구리'로 인쇄됨(해설 원문 그대로 옮김)."
    }
  },
  {
    "id": "s32-u02-o1-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 11,
      "page": 2,
      "sourceId": "sci-32-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "사막의 환경",
      "concept": "사막은 낮에는 매우 덥지만 밤에는 기온이 내려가 낮과 밤의 기온 차가 크다."
    },
    "prompt": "사막의 환경에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "그늘이 별로 없습니다.",
      "물과 먹이가 부족합니다.",
      "낮과 밤에 매우 덥습니다.",
      "모래바람이 심하게 붑니다.",
      "비가 거의 내리지 않아 매우 건조합니다."
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
    "explanation": "사막은 낮에는 매우 덥고 밤에는 기온이 내려가 낮과 밤의 기온 차가 심합니다.",
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
    "id": "s32-u02-o1-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 12,
      "page": 2,
      "sourceId": "sci-32-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "사막 동물의 특징",
      "concept": "사막 딱정벌레는 몸에 맺힌 이슬을 모아 마시며, 긴 다리로 땅바닥의 열기를 피하는 것은 낙타의 특징이다."
    },
    "prompt": "사막에서 사는 동물이 사막에서 살기에 알맞은 특징에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "사막여우는 귓속에 털이 많습니다.",
      "낙타는 콧구멍을 여닫을 수 있습니다.",
      "사막 거북은 앞다리로 땅을 잘 팔 수 있습니다.",
      "사막 딱정벌레는 다리가 길어 땅바닥의 열기를 피할 수 있습니다.",
      "사막 도마뱀은 이동할 때 한 번에 두 발씩 번갈아 들어 올리며 열을 식힙니다."
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
    "explanation": "사막 딱정벌레는 새벽에 땅 위로 나와 몸에 맺힌 이슬을 모아 마시는 특징을 가지고 있습니다. 다리가 길어 땅바닥의 열기를 피할 수 있는 것은 낙타의 특징입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄. ④·⑤ 보기는 두 줄로 인쇄됨(이어 붙임)."
    }
  },
  {
    "id": "s32-u02-o1-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 13,
      "page": 3,
      "sourceId": "sci-32-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "오리의 특징을 활용한 물건",
      "concept": "오리 발의 물갈퀴를 본떠 수영을 돕는 물갈퀴(오리발)를 만들었다."
    },
    "prompt": "수영을 잘 하는 오리의 특징을 활용해 만든 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 물갈퀴",
        "ㄴ. 집게 차",
        "ㄷ. 흡착판"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u02/s1-q13.webp",
    "figureNote": "<보기> 상자 안 사진 3장: ㄱ 물갈퀴(오리발과 스노클), ㄴ 집게 차(고철을 집는 집게), ㄷ 흡착판(호랑이 모양 흡착판). 각 사진 아래 ▲캡션.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ",
        "물갈퀴"
      ]
    },
    "explanation": "오리의 발에 물갈퀴가 있어 수영을 잘 하는 특징을 활용해 물속에서 수영하는 것을 도와주는 물갈퀴를 만들었습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'수영을 잘 하는'은 인쇄된 띄어쓰기 그대로. <보기> 항목은 사진+캡션으로 인쇄됨."
    }
  },
  {
    "id": "s32-u02-o1-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 14,
      "page": 3,
      "sourceId": "sci-32-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "동물의 특징을 활용한 예",
      "concept": "등산화(산양)·수영복(상어)·고속열차(산천어)·수중 접착제(홍합)는 동물의 특징을 활용했지만 안경은 그렇지 않다."
    },
    "prompt": "우리 생활에서 동물의 특징을 활용한 예가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "안경",
      "등산화",
      "수영복",
      "고속열차",
      "물속에서 사용할 수 있는 접착제"
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
    "explanation": "등산화는 산양의 발바닥이 절벽에서 잘 미끄러지지 않는 특징을 활용해 만든 것이고, 수영복은 상어의 피부가 물이 잘 흐르게 하는 특징을 활용해 만든 것입니다. 고속열차는 산천어가 물속에서 빨리 헤엄쳐 다닐 수 있는 특징을 활용해 만든 것이고, 물속에서 사용할 수 있는 접착제는 홍합이 세찬 파도에도 바위에서 떨어지지 않고 붙어 있는 특징을 활용해 만든 것입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'아닌'에 밑줄."
    }
  },
  {
    "id": "s32-u02-o1-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 15,
      "page": 3,
      "sourceId": "sci-32-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "뱀의 특징을 활용한 로봇",
      "concept": "뱀은 가늘고 긴 몸으로 좁은 곳에 들어갈 수 있어 좁은 공간을 살피는 로봇에 활용된다."
    },
    "prompt": "뱀의 특징을 활용하여 만들 수 있는 로봇으로 가장 적절한 것을 고르세요.",
    "givens": null,
    "choices": [
      "물체를 잘 고정시키는 로봇",
      "무거운 물체를 들어 옮기는 로봇",
      "물체를 잡으면 놓치지 않는 로봇",
      "좁은 공간을 들어가 살피는 로봇",
      "물속에서 여러 방향으로 움직이는 탐사 로봇"
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
    "explanation": "뱀은 가늘고 긴 몸통을 이용해 좁은 공간을 기어들어갈 수 있습니다.",
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
    "id": "s32-u02-o2-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 1,
      "page": 1,
      "sourceId": "sci-32-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "우리 주변 동물이 사는 곳",
      "concept": "꿀벌은 바닷속이 아니라 꽃이 있는 화단 같은 곳에서 볼 수 있다."
    },
    "prompt": "우리 주변에서 사는 동물에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "나무에서 참새를 볼 수 있습니다.",
      "화단에서 개미를 볼 수 있습니다.",
      "집 주변에서 개를 볼 수 있습니다.",
      "바닷속에서 꿀벌을 볼 수 있습니다.",
      "돌 밑에서 공벌레를 볼 수 있습니다"
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
    "explanation": "꿀벌은 주로 화단에서 볼 수 있는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄이 그어져 있음. 보기 ⑤는 끝에 마침표 없이 인쇄됨(원문 그대로 둠)."
    }
  },
  {
    "id": "s32-u02-o2-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 2,
      "page": 1,
      "sourceId": "sci-32-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "화단에 동물이 많이 사는 까닭",
      "concept": "화단은 먹이가 많고 몸을 숨기기 좋으며 집을 지을 장소가 있어 동물이 많이 산다."
    },
    "prompt": "화단에 동물이 많이 사는 까닭으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 먹이가 많기 때문입니다.",
        "ㄴ. 다른 동물의 눈에 잘 띄기 때문입니다.",
        "ㄷ. 동물이 집을 지을 수 있는 장소를 제공하기 때문입니다."
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
        "ㄴ",
        "다른 동물의 눈에 잘 띄기 때문입니다."
      ]
    },
    "explanation": "화단에서 동물이 많이 사는 것은 먹이가 많고, 다른 동물의 눈에 잘 띄지 않으며, 동물이 집을 지을 수 있는 장소가 있기 때문입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄이 그어져 있음. 발문의 '<'와 '보기>'가 줄바꿈으로 나뉘어 인쇄됨."
    }
  },
  {
    "id": "s32-u02-o2-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 3,
      "page": 1,
      "sourceId": "sci-32-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "동물 분류 기준의 조건",
      "concept": "분류 기준은 누가 분류해도 같은 결과가 나와야 하므로 '크다'처럼 사람마다 판단이 다른 기준은 쓸 수 없다."
    },
    "prompt": "동물을 분류하는 기준으로 적절하지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "알을 낳는가?",
      "다리가 있는가?",
      "크기가 큰 편인가?",
      "지느러미가 있는가?",
      "물속에서 살 수 있는가?"
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
    "explanation": "예쁘다, 아름답다, 크기가 크다, 작다 등은 사람마다 기준이 다르기 때문에 동물을 분류하는 기준이 될 수 없습니다. 누가 분류하더라도 같은 결과가 나오는 것을 분류 기준으로 정해야 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄이 그어져 있음."
    }
  },
  {
    "id": "s32-u02-o2-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 4,
      "page": 1,
      "sourceId": "sci-32-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "분류 결과로 분류 기준 찾기",
      "concept": "잠자리·토끼·참새·소금쟁이·다람쥐는 다리가 있고 지렁이·달팽이·금붕어·송사리는 다리가 없다."
    },
    "prompt": "다음과 같이 동물을 분류했을 때의 분류 기준으로 알맞은 것을 고르세요.",
    "givens": {
      "표": {
        "왼쪽 무리": [
          "잠자리, 토끼, 참새, 소금쟁이, 다람쥐"
        ],
        "오른쪽 무리": [
          "지렁이, 달팽이, 금붕어, 송사리"
        ]
      }
    },
    "choices": [
      "날개가 있는가?",
      "다리가 있는가?",
      "더듬이가 있는가?",
      "새끼를 낳을 수 있는가?",
      "물속에서 살 수 있는가?"
    ],
    "figure": "assets/bank/s32-u02/s2-q04.webp",
    "figureNote": "두 칸으로 된 분류 표. 왼쪽 칸 '잠자리, 토끼, 참새, 소금쟁이, 다람쥐', 오른쪽 칸 '지렁이, 달팽이, 금붕어, 송사리'. 글자는 givens.표에 옮김.",
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
    "explanation": "잠자리, 토끼, 참새, 소금쟁이, 다람쥐는 모두 다리가 있는 동물이고, 지렁이, 달팽이, 금붕어, 송사리는 다리가 없는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "표에 칸 제목이 인쇄되어 있지 않아 '왼쪽 무리'/'오른쪽 무리'는 임의로 붙인 이름. 각 칸은 두 줄로 줄바꿈되어 인쇄됨('잠자리, 토끼, 참새,'/'소금쟁이, 다람쥐', '지렁이, 달팽이,'/'금붕어, 송사리')."
    }
  },
  {
    "id": "s32-u02-o2-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 5,
      "page": 1,
      "sourceId": "sci-32-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "땅에서 사는 동물의 특징",
      "concept": "땅에서 사는 동물 중 다리가 없는 동물은 기어서 이동한다."
    },
    "prompt": "땅에서 사는 동물의 특징으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 모두 다리가 있습니다.",
        "ㄴ. 땅 위에서만 생활합니다.",
        "ㄷ. 다리가 없어 기어 다니기도 합니다."
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
        "다리가 없어 기어 다니기도 합니다."
      ]
    },
    "explanation": "땅에서 사는 동물들은 땅 위, 땅속, 땅 위와 땅속을 오가며 사는 동물들이 있습니다. 다리가 있는 동물들은 걷거나 뛰어 다니고, 다리가 없는 동물들은 기어 다닙니다.",
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
    "id": "s32-u02-o2-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 6,
      "page": 1,
      "sourceId": "sci-32-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "땅 위와 땅속을 오가며 사는 동물",
      "concept": "뱀과 개미는 땅 위와 땅속을 오가며 산다."
    },
    "prompt": "땅 위와 땅속을 오가며 사는 동물을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "뱀",
      "소",
      "개미",
      "다람쥐",
      "딱정벌레"
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
    "explanation": "뱀과 개미는 땅 위와 땅속을 오가며 사는 동물입니다. 소, 다람쥐, 딱정벌레는 땅 위에서 사는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'(정답 2개)'의 숫자 2가 다른 글꼴로 인쇄되어 '2 개'처럼 띄어 보임. 보기는 2단(①②/③④/⑤)으로 배치됨."
    }
  },
  {
    "id": "s32-u02-o2-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 7,
      "page": 2,
      "sourceId": "sci-32-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물에서 사는 동물의 사는 곳",
      "concept": "물방개와 다슬기는 둘 다 강이나 호수에서 산다."
    },
    "prompt": "물에서 사는 동물 중에서 사는 곳이 같은 동물끼리 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "게, 전복",
      "상어, 수달",
      "전복, 다슬기",
      "물방개, 다슬기",
      "개구리, 가오리"
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
    "explanation": "게는 갯벌에서 사는 동물이고, 전복, 상어, 가오리는 바다에서 사는 동물이며, 수달, 다슬기, 물방개, 개구리는 강이나 호수에서 사는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설이 답안 PDF 1쪽 왼쪽 단 끝(07. ④)에서 오른쪽 단 위로 이어져 인쇄됨."
    }
  },
  {
    "id": "s32-u02-o2-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 8,
      "page": 2,
      "sourceId": "sci-32-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "고등어의 특징",
      "concept": "고등어는 몸이 비늘로 덮인 부드러운 곡선 형태이고 아가미로 숨 쉬며 지느러미로 헤엄친다."
    },
    "prompt": "고등어에 대한 설명으로 옳은 것을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "보기": [
        "ㄱ. 몸이 털로 덮여 있습니다.",
        "ㄴ. 몸이 부드러운 곡선 형태입니다.",
        "ㄷ. 아가미를 이용하여 숨을 쉽니다.",
        "ㄹ. 지느러미를 이용하여 바닥을 기어 다닙니다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u02/s2-q08.webp",
    "figureNote": "물속을 헤엄치는 고등어 사진.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ, ㄷ",
      "accepted": [
        "ㄴ, ㄷ",
        "ㄴ,ㄷ",
        "ㄷ, ㄴ"
      ]
    },
    "explanation": "고등어는 몸이 비늘로 덮여 있으며 부드러운 곡선 형태입니다. 아가미를 이용해 숨을 쉬고 지느러미를 이용해 헤엄칩니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'(정답 2개)'의 숫자 2가 다른 글꼴로 인쇄되어 '2 개'처럼 띄어 보임. 답란은 '(    ), (    )' 두 칸."
    }
  },
  {
    "id": "s32-u02-o2-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 9,
      "page": 2,
      "sourceId": "sci-32-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "매미의 특징",
      "concept": "매미는 두 쌍의 날개로 나무 사이를 날아다니며 수컷이 소리를 낸다."
    },
    "prompt": "매미에 대한 설명으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 수컷은 소리를 냅니다.",
        "ㄴ. 나무 사이를 기어서만 다닙니다.",
        "ㄷ. 두 쌍의 날개와 세 쌍의 다리가 있습니다."
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
        "ㄴ",
        "나무 사이를 기어서만 다닙니다."
      ]
    },
    "explanation": "매미는 수컷이 소리를 내고 나무 사이를 날아다닙니다. 두 쌍의 날개와 세 쌍의 다리가 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄이 그어져 있음."
    }
  },
  {
    "id": "s32-u02-o2-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 10,
      "page": 2,
      "sourceId": "sci-32-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "날아다니는 동물이 잘 나는 까닭",
      "concept": "날아다니는 동물은 날개가 있고 몸이 비교적 가벼워 잘 날 수 있다."
    },
    "prompt": "날아다니는 동물이 잘 날 수 있는 특징으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "다리가 없습니다.",
      "날개가 있습니다.",
      "아가미로 숨을 쉽니다.",
      "몸이 비교적 가볍습니다.",
      "몸이 크고 털로 덮여 있습니다."
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
    "explanation": "날아다니는 동물은 날개가 있고 몸이 비교적 가벼워 하늘을 잘 날 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'(정답 2개)'의 숫자 2가 다른 글꼴로 인쇄되어 '2 개'처럼 띄어 보임."
    }
  },
  {
    "id": "s32-u02-o2-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 11,
      "page": 2,
      "sourceId": "sci-32-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "날개가 있지만 날지 못하는 동물",
      "concept": "타조는 날개가 있지만 날지 못하는 새이다."
    },
    "prompt": "날개가 있지만 날지 못하는 동물을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. ▲직박구리",
        "ㄴ. ▲타조",
        "ㄷ. ▲황조롱이"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u02/s2-q11.webp",
    "figureNote": "<보기> 상자 안 사진 3장: ㄱ. 나뭇가지에 앉은 직박구리, ㄴ. 풀밭의 타조(새끼들과 함께), ㄷ. 짚 위의 황조롱이. 각 사진 아래 '▲이름' 캡션.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ",
        "타조"
      ]
    },
    "explanation": "타조는 날개가 있지만 날지 못하는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 기호(ㄱ.~ㄷ.) 오른쪽에 사진이 있고 사진 아래에 '▲직박구리' 식 캡션이 붙은 형태. 캡션 글자를 보기 항목으로 옮김."
    }
  },
  {
    "id": "s32-u02-o2-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 12,
      "page": 3,
      "sourceId": "sci-32-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "사막여우의 큰 귀와 사막 적응",
      "concept": "사막여우의 큰 귀는 몸의 열을 밖으로 내보내 더운 사막에서 체온을 조절하는 데 도움이 된다."
    },
    "prompt": "사막에서 사는 동물 중 몸에 비해 큰 귀를 가지고 있는 동물을 <보기>에서 골라 기호와 이름을 쓰고, 이 동물이 몸에 비해 큰 귀를 가지고 있어 사막에서 살기에 좋은 점을 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s32-u02/s2-q12.webp",
    "figureNote": "<보기> 상자 안 사진 3장(이름 없음): ㄱ. 모래 위의 전갈, ㄴ. 모래 위의 도마뱀(꼬리에 흑백 줄무늬), ㄷ. 바위 사이의 큰 귀를 가진 사막여우.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "ㄷ 사막 여우, 사막여우는 몸에 비해 큰 귀를 가지고 있어 더운 사막에서 몸의 열을 밖으로 내보내기 쉽습니다.",
      "rubric": {
        "required": [
          "ㄷ 사막여우를 고른다",
          "큰 귀로 몸의 열을 밖으로 내보내기 쉽다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "정답: 사막 여우의 이름과 좋은 점을 모두 정확하게 쓴 경우 (100%)",
          "부분 정답: 사막 여우의 이름과 좋음 점을 부족하게 쓴 경우 (50%)"
        ]
      }
    },
    "explanation": "사막 여우는 몸에 비해 큰 귀를 가지고 있어 몸의 열을 밖으로 내보내 체온 조절을 합니다.\n[채점 기준] 정답: 사막 여우의 이름과 좋은 점을 모두 정확하게 쓴 경우 (100%) / 부분 정답: 사막 여우의 이름과 좋음 점을 부족하게 쓴 경우 (50%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 이름 없이 사진만 있음(ㄱ 전갈, ㄴ 도마뱀, ㄷ 사막여우로 보임). 답안의 모범 답은 '사막 여우'와 '사막여우' 띄어쓰기가 섞여 있음(원문 그대로). 채점 기준 부분 정답 칸의 '좋음 점을'은 원문 오타로 보이나 그대로 옮김."
    }
  },
  {
    "id": "s32-u02-o2-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 13,
      "page": 3,
      "sourceId": "sci-32-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "사막에 사는 낙타의 특징",
      "concept": "낙타는 혹의 지방으로 먹지 않고 며칠을 버티고 콧구멍을 여닫아 모래를 막아 사막에 적응해 산다."
    },
    "prompt": "다음에서 설명하는 동물은 무엇인지 쓰세요.",
    "givens": {
      "지문": "• 사막에서 삽니다.\n• 혹에 지방이 있어서 먹이를 먹지 않고 며칠 동안 생활할 수 있습니다.\n• 콧구멍을 여닫을 수 있어서 모래바람이 불어도 콧속으로 모래가 잘 들어가지 않습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "낙타",
      "accepted": [
        "낙타"
      ]
    },
    "explanation": "낙타는 혹에 지방이 있어서 먹이를 먹지 않고 며칠 동안 생활할 수 있고, 콧구멍을 여닫을 수 있어서 모래바람이 불어도 콧속으로 모래가 잘 들어가지 않습니다.",
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
    "id": "s32-u02-o2-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 14,
      "page": 3,
      "sourceId": "sci-32-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "동물의 특징을 활용한 물갈퀴",
      "concept": "물갈퀴는 헤엄을 잘 치는 오리 발의 물갈퀴를 본떠 만들었다."
    },
    "prompt": "다음은 우리 생활에서 동물의 특징을 활용한 예입니다. 빈칸에 들어갈 알맞은 말을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "물갈퀴는 헤엄을 잘 치는 [      ]의 발 모양을 활용하여 만든 것입니다.",
      "보기": [
        "ㄱ. 오리",
        "ㄴ. 가오리",
        "ㄷ. 소금쟁이"
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
        "ㄱ",
        "오리"
      ]
    },
    "explanation": "오리의 발에 물갈퀴가 있어 헤엄을 잘 치는 특징을 활용해 물속에서 헤엄치는 것을 도와주는 물갈퀴를 만들었습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문 상자 안의 빈칸은 네모 칸으로 인쇄됨('[      ]'로 표시)."
    }
  },
  {
    "id": "s32-u02-o2-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 15,
      "page": 3,
      "sourceId": "sci-32-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "동물의 특징을 활용한 수영복",
      "concept": "상어 피부는 물이 잘 흐르게 하는 특징이 있어 이를 본떠 수영복을 만들었다."
    },
    "prompt": "수영복을 만들 때 활용한 동물과 그 동물의 특징을 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "전복 – 껍데기가 단단합니다.",
      "상어 - 피부가 물이 잘 흐르게 합니다.",
      "문어 - 지느러미가 소용돌이를 줄여 줍니다.",
      "물총새 - 부리를 더 빠르게 움직일 수 있습니다.",
      "수리 - 벽에 발바닥을 쉽게 붙이고 떼어 낼 수 있습니다."
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
    "explanation": "상어의 피부가 물이 잘 흐르게 하는 특징을 활용해 수영복을 만들었습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기 ①만 긴 줄표('–')로, ②~⑤는 짧은 하이픈('-')으로 인쇄됨(원문 그대로). ⑤는 '있습니'/'다.'로 줄바꿈됨. 해설은 답안 PDF 2쪽에 이어짐."
    }
  },
  {
    "id": "s32-u02-o3-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 1,
      "page": 1,
      "sourceId": "sci-32-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "날개와 다리의 수로 동물 찾기",
      "concept": "잠자리는 날개 두 쌍과 다리 세 쌍을 가진 곤충이다."
    },
    "prompt": "위의 <보기>에서 두 쌍의 날개와 세 쌍의 다리가 있는 동물을 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[01~02] 다음의 <보기>는 우리 주변에서 사는 여러 동물의 모습입니다. 물음에 답하세요.",
      "보기": [
        "ㄱ. ▲까치",
        "ㄴ. ▲고양이",
        "ㄷ. ▲달팽이",
        "ㄹ. ▲잠자리"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u02/s3-q01.webp",
    "figureNote": "<보기> 사진 4장: ㄱ. 까치, ㄴ. 고양이, ㄷ. 달팽이, ㄹ. 잠자리 (사진 아래 ▲이름 표기)",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄹ",
      "accepted": [
        "ㄹ",
        "잠자리",
        "ㄹ. 잠자리"
      ]
    },
    "explanation": "두 쌍의 날개와 세 쌍의 다리가 있는 동물은 잠자리입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 사진과 ▲이름 캡션으로 되어 있어 캡션을 보기 항목으로 옮김."
    }
  },
  {
    "id": "s32-u02-o3-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 2,
      "page": 1,
      "sourceId": "sci-32-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "더듬이가 있고 다리가 없는 동물",
      "concept": "달팽이는 더듬이가 있고 다리가 없어 배를 이용해 기어 다닌다."
    },
    "prompt": "다음과 같은 특징을 가지고 있는 동물을 위의 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[01~02] 다음의 <보기>는 우리 주변에서 사는 여러 동물의 모습입니다. 물음에 답하세요.\n\n• 더듬이가 있습니다.\n• 다리가 없어 기어 다닙니다.",
      "보기": [
        "ㄱ. ▲까치",
        "ㄴ. ▲고양이",
        "ㄷ. ▲달팽이",
        "ㄹ. ▲잠자리"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u02/s3-q01.webp",
    "figureNote": "<보기> 사진 4장: ㄱ. 까치, ㄴ. 고양이, ㄷ. 달팽이, ㄹ. 잠자리 (사진 아래 ▲이름 표기)",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ",
        "달팽이",
        "ㄷ. 달팽이"
      ]
    },
    "explanation": "더듬이가 있고, 다리가 없어 기어 다니는 동물은 달팽이입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "공통 지문 뒤의 상자(특징 두 줄)를 지문에 이어 붙임. <보기>는 사진과 ▲이름 캡션."
    }
  },
  {
    "id": "s32-u02-o3-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 3,
      "page": 1,
      "sourceId": "sci-32-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "주변 동물을 많이 볼 수 있는 장소",
      "concept": "먹이가 많고 숨기 좋은 화단 같은 곳에서 여러 동물을 많이 볼 수 있다."
    },
    "prompt": "여러 가지 동물을 가장 많이 볼 수 있는 장소를 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 집 안",
        "ㄴ. 나무 위",
        "ㄷ. 건물 벽",
        "ㄹ. 학교 화단"
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
        "학교 화단",
        "학교화단",
        "ㄹ. 학교 화단"
      ]
    },
    "explanation": "먹이가 많고, 눈에 잘 보이지 않아 숨기 좋은 장소에서 동물을 많이 볼 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "문장이 '<보기\\n>'로 줄바뀜되어 인쇄됨."
    }
  },
  {
    "id": "s32-u02-o3-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 4,
      "page": 1,
      "sourceId": "sci-32-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "더듬이 유무에 따른 분류",
      "concept": "꿀벌·메뚜기 같은 곤충은 더듬이가 있고 참새·다람쥐는 더듬이가 없다."
    },
    "prompt": "빈칸에 공통으로 들어갈 알맞은 말을 고르세요.",
    "givens": {
      "지문": "• □(이)가 있는 동물: 꿀벌, 메뚜기\n• □(이)가 없는 동물: 참새, 다람쥐"
    },
    "choices": [
      "다리",
      "깃털",
      "더듬이",
      "아가미",
      "지느러미"
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
    "explanation": "꿀벌과 메뚜기는 더듬이가 있지만 참새와 다람쥐는 더듬이가 없습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 인쇄본에서 빈 네모 칸으로 그려져 있어 □로 표기."
    }
  },
  {
    "id": "s32-u02-o3-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 5,
      "page": 1,
      "sourceId": "sci-32-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "알을 낳는지에 따른 분류 오류 찾기",
      "concept": "송사리와 개구리는 알을 낳는 동물이므로 '그렇다.' 쪽에 분류해야 한다."
    },
    "prompt": "다음과 같이 동물을 분류하였을 때 잘못 분류한 동물을 모두 골라 쓰세요. (정답 2 개)",
    "givens": {
      "표": {
        "알을 낳는가?": [
          "그렇다.",
          "그렇지 않다."
        ],
        "동물": [
          "비둘기, 잠자리, 꿀벌, 메뚜기, 뱀, 달팽이",
          "다람쥐, 송사리, 고양이, 토끼, 개구리"
        ]
      }
    },
    "choices": null,
    "figure": "assets/bank/s32-u02/s3-q05.webp",
    "figureNote": "분류표: 머리 '알을 낳는가?' 아래 '그렇다.'/'그렇지 않다.' 두 칸과 각 칸의 동물 이름",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "송사리, 개구리",
      "accepted": [
        "송사리, 개구리",
        "송사리,개구리",
        "개구리, 송사리",
        "개구리,송사리",
        "송사리 개구리",
        "개구리 송사리"
      ]
    },
    "explanation": "송사리와 개구리는 알을 낳는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'잘못'에 밑줄. 표는 머리칸 '알을 낳는가?' 한 줄, 그 아래 '그렇다.'/'그렇지 않다.' 두 열 구조이며 '동물' 열 이름은 옮기면서 붙인 것."
    }
  },
  {
    "id": "s32-u02-o3-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 6,
      "page": 1,
      "sourceId": "sci-32-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "더듬이가 있는 동물 고르기",
      "concept": "사슴벌레·개미·소금쟁이처럼 곤충은 더듬이가 있다."
    },
    "prompt": "더듬이의 유무에 따라 동물을 분류할 때 더듬이가 있는 동물끼리 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "비둘기, 뱀, 나비",
      "거미, 다람쥐, 개구리",
      "달팽이, 개미, 고양이",
      "잠자리, 달팽이, 송사리",
      "사슴벌레, 개미, 소금쟁이"
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
    "explanation": "더듬이가 있는 동물은 나비, 달팽이, 개미, 잠자리, 사슴벌레, 소금쟁이입니다.",
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
    "id": "s32-u02-o3-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 7,
      "page": 2,
      "sourceId": "sci-32-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "지렁이의 특징",
      "concept": "지렁이는 땅속을 기어 다니며 몸이 길고 원통 모양이고 고리 모양 마디로 되어 있다."
    },
    "prompt": "다음에서 설명하는 동물을 고르세요.",
    "givens": {
      "지문": "• 땅속을 기어 다닙니다.\n• 몸이 길고 원통 모양입니다.\n• 몸이 고리 모양의 마디로 되어 있고, 매끄럽습니다."
    },
    "choices": [
      "뱀",
      "개미",
      "달팽이",
      "지렁이",
      "개구리"
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
    "explanation": "땅속을 기어 다니며 몸이 길고 원통 모양이며, 고리 모양의 마디로 되어 있고 매끄러운 동물은 지렁이입니다.",
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
    "id": "s32-u02-o3-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 8,
      "page": 2,
      "sourceId": "sci-32-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "땅에서 기어서 이동하는 동물",
      "concept": "뱀은 다리가 없어 배를 땅에 대고 기어서 이동한다."
    },
    "prompt": "땅에서 사는 동물 중 기어서 이동하는 동물을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. ▲너구리",
        "ㄴ. ▲두더지",
        "ㄷ. ▲뱀"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u02/s3-q08.webp",
    "figureNote": "<보기> 사진 3장: ㄱ. 너구리, ㄴ. 두더지, ㄷ. 뱀 (사진 아래 ▲이름 표기)",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ",
        "뱀",
        "ㄷ. 뱀"
      ]
    },
    "explanation": "땅에 사는 동물 중 다리가 없는 동물은 땅을 기어 다닙니다. 뱀은 다리가 없으며 배를 땅에 대고 기어 다닙니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 사진과 ▲이름 캡션으로 되어 있어 캡션을 보기 항목으로 옮김."
    }
  },
  {
    "id": "s32-u02-o3-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 9,
      "page": 2,
      "sourceId": "sci-32-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "땅에서 사는 동물의 특징",
      "concept": "땅에서 사는 동물은 다리로 걷거나 뛰며, 땅 위와 땅속을 오가며 사는 동물도 있다."
    },
    "prompt": "땅에서 사는 동물의 특징을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "날개가 없습니다.",
      "지느러미가 있습니다.",
      "아가미로 숨을 쉽니다.",
      "다리가 있는 동물은 걷거나 뛰어다닙니다.",
      "땅 위와 땅속을 오가며 사는 동물도 있습니다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "땅에서 사는 동물 중에는 날개가 있는 것도 있습니다. 지느러미가 있고, 아가미로 숨을 쉬는 동물은 주로 물속에 사는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'(정답 2\\n개)'로 줄바뀜되어 인쇄됨."
    }
  },
  {
    "id": "s32-u02-o3-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 10,
      "page": 2,
      "sourceId": "sci-32-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물에서 사는 동물의 특징",
      "concept": "전복은 비늘이 아니라 구멍이 솟은 딱딱한 껍데기로 덮여 있다."
    },
    "prompt": "물에서 사는 동물에 대한 설명으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 가오리는 몸이 납작하고 넓습니다.",
        "ㄴ. 전복은 몸이 비늘로 덮여 있습니다.",
        "ㄷ. 다슬기는 배발을 이용해 바위에 붙어서 기어 다닙니다."
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
        "ㄴ",
        "ㄴ. 전복은 몸이 비늘로 덮여 있습니다."
      ]
    },
    "explanation": "전복은 몸이 딱딱한 껍데기로 덮여 있고, 껍데기에 구멍이 솟아 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄. 문장이 '<\\n보기>'로 줄바뀜되어 인쇄됨."
    }
  },
  {
    "id": "s32-u02-o3-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 11,
      "page": 2,
      "sourceId": "sci-32-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "수달의 특징",
      "concept": "수달은 강이나 호수에 살며 발가락의 물갈퀴로 헤엄치고 물고기나 개구리를 잡아먹는다."
    },
    "prompt": "다음에서 설명하는 동물의 이름을 쓰세요.",
    "givens": {
      "지문": "• 다리는 두 쌍이 있고 발가락에 물갈퀴가 있어 물속에서 헤엄칠 수 있습니다.\n• 물가에서 물고기나 개구리를 잡아먹습니다."
    },
    "choices": null,
    "figure": "assets/bank/s32-u02/s3-q11.webp",
    "figureNote": "통나무 위에 선 수달 사진(이름 표기 없음)",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "수달",
      "accepted": [
        "수달"
      ]
    },
    "explanation": "수달은 강이나 호수에서 사는 동물입니다. 다리는 두 쌍이 있고 발가락에 물갈퀴가 있어 물속에서 헤엄칠 수 있습니다. 물가에서 물고기나 개구리를 잡아먹습니다.",
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
    "id": "s32-u02-o3-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 12,
      "page": 2,
      "sourceId": "sci-32-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "전복의 이동 방법",
      "concept": "전복은 배발로 물속 바위에 붙어 기어서 이동한다."
    },
    "prompt": "전복이 이동하는 방법을 고르세요.",
    "givens": null,
    "choices": [
      "날개를 이용하여 날아다닙니다.",
      "다리를 이용하여 걸어 다닙니다.",
      "지느러미를 이용하여 헤엄쳐 이동합니다.",
      "물갈퀴가 있는 발을 이용하여 헤엄쳐 이동합니다.",
      "배발을 이용하여 물속 바위에 붙어서 기어 다닙니다."
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
    "explanation": "전복은 배발을 이용해 물속 바위에 붙어서 기어 다닙니다.",
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
    "id": "s32-u02-o3-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 13,
      "page": 3,
      "sourceId": "sci-32-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "날아다니는 곤충 고르기",
      "concept": "잠자리·나비·매미는 날개 두 쌍과 다리 세 쌍이 있는 곤충이고 참새·까치·직박구리는 새이다."
    },
    "prompt": "다음에서 날아다니는 곤충을 모두 골라 쓰세요. (정답 3 개)",
    "givens": {
      "지문": "참새, 잠자리, 나비, 매미, 까치, 직박구리"
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "잠자리, 나비, 매미",
      "accepted": [
        "잠자리, 나비, 매미",
        "잠자리,나비,매미",
        "잠자리 나비 매미",
        "잠자리, 매미, 나비",
        "나비, 잠자리, 매미",
        "나비, 매미, 잠자리",
        "매미, 잠자리, 나비",
        "매미, 나비, 잠자리"
      ]
    },
    "explanation": "날아다니는 곤충은 두 쌍의 날개와 세 쌍의 다리가 있습니다. 잠자리, 나비, 매미는 곤충이고, 참새, 까치, 직박구리는 새입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란이 ( ), ( ), ( ) 세 칸으로 순서 무관하게 채점하는 것으로 보임."
    }
  },
  {
    "id": "s32-u02-o3-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 14,
      "page": 3,
      "sourceId": "sci-32-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "매미의 특징",
      "concept": "매미는 몸이 머리·가슴·배로 나뉜 곤충이며, 몸이 깃털로 덮인 것은 새의 특징이다."
    },
    "prompt": "매미에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "수컷은 소리를 냅니다.",
      "두 쌍의 날개가 있습니다.",
      "세 쌍의 다리가 있습니다.",
      "나무 사이를 날아다닙니다.",
      "몸이 깃털로 덮여 있습니다."
    ],
    "figure": "assets/bank/s32-u02/s3-q14.webp",
    "figureNote": "나뭇가지에 앉은 매미 사진",
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
    "explanation": "매미는 몸이 머리, 가슴, 배 세 부분으로 나누어진 곤충입니다. 몸이 깃털로 덮여 있는 것은 새의 특징입니다.",
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
    "id": "s32-u02-o3-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 15,
      "page": 3,
      "sourceId": "sci-32-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "황새와 나비의 공통점",
      "concept": "황새와 나비는 모두 날개가 있어 날아다니는 동물이다."
    },
    "prompt": "다음 동물들의 공통점을 고르세요.",
    "givens": null,
    "choices": [
      "날개가 있습니다.",
      "다리가 세 쌍 있습니다.",
      "몸이 털로 덮여 있습니다.",
      "몸이 머리, 가슴, 배로 구분됩니다.",
      "날다가 공중에서 멈출 수 있습니다."
    ],
    "figure": "assets/bank/s32-u02/s3-q15.webp",
    "figureNote": "사진 2장: ▲황새, ▲나비",
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
    "explanation": "황새와 나비는 날개가 있어 날아다니는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "문항 대상 동물(황새, 나비)은 사진 캡션으로만 제시됨."
    }
  },
  {
    "id": "s32-u02-o3-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 16,
      "page": 3,
      "sourceId": "sci-32-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "낙타와 사막여우가 사는 곳",
      "concept": "낙타와 사막여우는 주로 사막에서 산다."
    },
    "prompt": "다음의 동물들이 주로 사는 곳을 고르세요.",
    "givens": null,
    "choices": [
      "땅속",
      "물속",
      "사막",
      "갯벌",
      "화단"
    ],
    "figure": "assets/bank/s32-u02/s3-q16.webp",
    "figureNote": "사진 2장: ▲낙타, ▲사막여우",
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
    "explanation": "낙타와 사막여우는 주로 사막에서 사는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "문항 대상 동물(낙타, 사막여우)은 사진 캡션으로만 제시됨."
    }
  },
  {
    "id": "s32-u02-o3-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 17,
      "page": 3,
      "sourceId": "sci-32-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "사막 도마뱀의 사막 적응",
      "concept": "사막 도마뱀은 뜨거운 모래 위에서 두 발씩 번갈아 들어 올려 열을 식힌다."
    },
    "prompt": "사막 도마뱀이 사막에서 잘 살 수 있는 특징을 고르세요.",
    "givens": null,
    "choices": [
      "콧구멍을 여닫을 수 있습니다.",
      "앞다리로 땅을 잘 팔 수 있습니다.",
      "온몸이 딱딱한 껍데기로 덮여 있습니다.",
      "발바닥이 넓어 모래에 빠지지 않습니다.",
      "한 번에 두 발씩 번갈아 들어 올리며 열을 식힙니다."
    ],
    "figure": "assets/bank/s32-u02/s3-q17.webp",
    "figureNote": "모래 위에서 발을 들어 올린 사막 도마뱀 사진",
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
    "explanation": "사막 도마뱀은 한 번에 두 발씩 번갈아 들어 올리며 열을 식힙니다.",
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
    "id": "s32-u02-o3-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 18,
      "page": 4,
      "sourceId": "sci-32-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "수리의 발을 활용한 생활 물건",
      "concept": "먹이를 잘 잡고 놓치지 않는 수리의 발을 본떠 물건을 집어 옮기는 집게 차를 만들었다."
    },
    "prompt": "다음에서 설명하는 특징을 활용해 만든 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "수리의 발이 먹이를 잘 잡고 놓치지 않는 특징을 활용한 것입니다.",
      "보기": [
        "ㄱ. ▲물갈퀴",
        "ㄴ. ▲집게 차",
        "ㄷ. ▲등산화"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u02/s3-q18.webp",
    "figureNote": "설명 상자 안의 수리(독수리) 사진과 <보기> 사진 3장: ㄱ. 물갈퀴, ㄴ. 집게 차, ㄷ. 등산화",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ",
        "집게 차",
        "집게차",
        "ㄴ. 집게 차"
      ]
    },
    "explanation": "수리의 발이 먹이를 잘 잡고 놓치지 않는 특징을 활용해 물건을 집어 옮길 수 있는 집게 차를 만들었습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 사진과 ▲이름 캡션으로 되어 있어 캡션을 보기 항목으로 옮김."
    }
  },
  {
    "id": "s32-u02-o3-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 19,
      "page": 4,
      "sourceId": "sci-32-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "고속열차에 활용한 동물의 특징",
      "concept": "물속에서 빨리 헤엄치는 산천어의 부드러운 곡선 몸 모양을 본떠 고속열차 앞부분을 만들었다."
    },
    "prompt": "고속열차를 만드는 데 활용한 동물의 특징으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "문어의 발",
      "수리의 발",
      "오리의 발",
      "산천어의 모양",
      "바위에 붙은 홍합"
    ],
    "figure": "assets/bank/s32-u02/s3-q19.webp",
    "figureNote": "선로를 달리는 고속열차 사진",
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
    "explanation": "산천어의 몸이 부드러운 곡선 모양으로 물속에서 빨리 헤엄쳐 다닐 수 있는 특징을 활용해 앞부분이 부드러운 곡선 모양인 고속열차를 만들었습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설이 해설지 1쪽 끝(19. ④)에서 2쪽 첫머리로 이어짐."
    }
  },
  {
    "id": "s32-u02-o3-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 20,
      "page": 4,
      "sourceId": "sci-32-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "모기를 활용한 로봇",
      "concept": "혈액을 빨아 먹는 모기의 특징을 본떠 혈액을 뽑거나 약을 넣는 의료용 로봇을 설계할 수 있다."
    },
    "prompt": "다음과 같은 특징의 탐사 로봇을 만들 때 활용한 동물은 무엇인지 고르세요.",
    "givens": {
      "지문": "• 혈액을 빨아 먹는 특징을 활용한 로봇으로, 혈액을 추출하여 분석할 수 있는 의료용 로봇입니다.\n• 십자가 표시가 그려진 통은 분리할 수 있으며 이 통에 물약을 넣어 환자에게 약을 투여할 수도 있습니다."
    },
    "choices": [
      "뱀",
      "매미",
      "모기",
      "거북",
      "공벌레"
    ],
    "figure": "assets/bank/s32-u02/s3-q20.webp",
    "figureNote": "날개·더듬이·주삿바늘 모양 입과 십자가 표시 통을 단 모기 모양 로봇 그림",
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
    "explanation": "모기의 특징을 활용해 설계한 로봇의 특징입니다.",
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
    "id": "s32-u02-o4-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 1,
      "page": 1,
      "sourceId": "sci-32-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "돌 밑에서 볼 수 있는 동물",
      "concept": "공벌레는 화단이나 돌 밑처럼 축축하고 어두운 곳에서 주로 볼 수 있다."
    },
    "prompt": "돌 밑에서 주로 볼 수 있는 동물을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. ▲참새",
        "ㄴ. ▲달팽이",
        "ㄷ. ▲공벌레"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u02/s4-q01.webp",
    "figureNote": "<보기> 상자: ㄱ. 참새(나뭇가지 위) 사진, ㄴ. 달팽이 사진, ㄷ. 공벌레 사진, 각 사진 아래 ▲이름 캡션",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ",
        "ㄷ.",
        "공벌레"
      ]
    },
    "explanation": "참새는 나무 위, 달팽이는 화단, 공벌레는 화단이나 돌 밑에서 주로 관찰할 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 사진 3장과 캡션으로 되어 있어 캡션을 보기 항목으로 옮김."
    }
  },
  {
    "id": "s32-u02-o4-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 2,
      "page": 1,
      "sourceId": "sci-32-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "꿀벌의 특징",
      "concept": "꿀벌은 날개 두 쌍과 다리 세 쌍을 가진 곤충이다."
    },
    "prompt": "꿀벌의 특징에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "날아다닙니다.",
      "날개가 두 쌍이 있습니다.",
      "다리가 두 쌍이 있습니다.",
      "화단에서 볼 수 있습니다.",
      "꽃에 있는 꿀을 먹습니다."
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
    "explanation": "꿀벌은 두 쌍의 날개가 있어 날아다닙니다. 다리는 세 쌍이 있습니다.",
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
    "id": "s32-u02-o4-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 3,
      "page": 1,
      "sourceId": "sci-32-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화단에 동물이 많이 사는 까닭",
      "concept": "화단에는 먹이와 집·쉴 곳, 숨을 곳이 많아 동물이 많이 산다."
    },
    "prompt": "화단에 동물이 많이 사는 까닭으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "먹이가 많기 때문입니다.",
      "햇빛이 잘 비치기 때문입니다.",
      "집을 지을 수 있기 때문입니다.",
      "쉴 수 있는 장소가 많기 때문입니다.",
      "눈에 잘 보이지 않게 숨기 좋기 때문입니다."
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
    "explanation": "화단에서 동물을 많이 볼 수 있는 것은 먹이가 많고, 집을 짓거나 쉴 수 있는 장소가 있으며, 눈에 잘 보이지 않아 숨기 좋기 때문입니다.",
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
    "id": "s32-u02-o4-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 4,
      "page": 1,
      "sourceId": "sci-32-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물속에서 사는 동물",
      "concept": "금붕어와 송사리는 물속에서 사는 동물이다."
    },
    "prompt": "물속에서 사는 동물끼리 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "뱀, 금붕어",
      "금붕어, 송사리",
      "개구리, 달팽이",
      "비둘기, 메뚜기",
      "다람쥐, 사슴벌레"
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
    "explanation": "송사리, 금붕어는 물속에서 사는 동물이고, 뱀, 달팽이, 비둘기, 메뚜기, 다람쥐, 사슴벌레는 땅에서 사는 동물입니다. 개구리는 강가나 호숫가에서 사는 동물로, 물속과 땅위를 오가며 삽니다.",
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
    "id": "s32-u02-o4-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 5,
      "page": 1,
      "sourceId": "sci-32-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "동물 분류 기준 찾기",
      "concept": "다람쥐·고양이·토끼·개는 새끼를 낳고, 비둘기·까치·개구리·거미는 알을 낳으므로 '새끼를 낳는가?'로 나눌 수 있다."
    },
    "prompt": "다음과 같이 동물을 분류할 때 분류 기준으로 알맞은 것을 고르세요.",
    "givens": {
      "표": {
        "분류 1": [
          "다람쥐, 고양이, 토끼, 개"
        ],
        "분류 2": [
          "비둘기, 까치, 개구리, 거미"
        ]
      }
    },
    "choices": [
      "새끼를 낳는가?",
      "날개가 있는가?",
      "다리가 있는가?",
      "더듬이가 있는가?",
      "다른 동물을 먹고 사는가?"
    ],
    "figure": "assets/bank/s32-u02/s4-q05.webp",
    "figureNote": "두 칸 표: 왼쪽 칸 '다람쥐, 고양이, 토끼, 개', 오른쪽 칸 '비둘기, 까치, 개구리, 거미'",
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
    "explanation": "다람쥐, 고양이, 토끼, 개는 새끼를 낳는 동물이고, 비둘기, 까치, 개구리, 거미는 알을 낳는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "표에 열 머리글이 없어 '분류 1', '분류 2'로 임시 이름을 붙임. 칸 안 줄바꿈: '다람쥐, 고양이,/토끼, 개', '비둘기, 까치,/개구리, 거미'."
    }
  },
  {
    "id": "s32-u02-o4-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 6,
      "page": 2,
      "sourceId": "sci-32-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "알맞은 분류 기준",
      "concept": "분류 기준은 누가 분류해도 같은 결과가 나오는 객관적인 특징이어야 한다."
    },
    "prompt": "동물을 분류하는 기준으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "몸이 큰가?",
      "아름다운가?",
      "몸이 작은가?",
      "더듬이가 있는가?",
      "몸의 색이 예쁜가?"
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
    "explanation": "예쁘거나 크기가 크고 작은 것 등은 분류하는 사람에 따라 기준이 다르므로 동물을 분류하는 기준이 될 수 없습니다. 누가 분류하더라도 같은 분류 결과가 나오는 것을 분류 기준으로 정해야 합니다.",
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
    "id": "s32-u02-o4-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 7,
      "page": 2,
      "sourceId": "sci-32-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "땅속에서 사는 동물",
      "concept": "두더지는 땅속에서 살고, 소와 너구리는 땅 위에서 산다."
    },
    "prompt": "땅속에서 사는 동물을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. ▲소",
        "ㄴ. ▲너구리",
        "ㄷ. ▲두더지"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u02/s4-q07.webp",
    "figureNote": "<보기> 상자: ㄱ. 소 사진, ㄴ. 너구리 사진, ㄷ. 두더지(앞발로 흙을 파는 모습) 사진, 각 사진 아래 ▲이름 캡션",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ",
        "ㄷ.",
        "두더지"
      ]
    },
    "explanation": "두더지는 땅속에서 사는 동물이고, 소와 너구리는 땅 위에서 사는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 사진 3장과 캡션으로 되어 있어 캡션을 보기 항목으로 옮김."
    }
  },
  {
    "id": "s32-u02-o4-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 8,
      "page": 2,
      "sourceId": "sci-32-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "개미와 공벌레 비교",
      "concept": "개미는 다리가 세 쌍, 공벌레는 다리가 일곱 쌍이다."
    },
    "prompt": "개미와 공벌레의 특징을 바르게 비교한 것을 고르세요.",
    "givens": null,
    "choices": [
      "기어 다닙니다. / 걸어 다닙니다.",
      "땅속에서만 삽니다. / 땅 위에서만 삽니다.",
      "앞 다리로 땅을 팝니다. / 몸을 둥글게 만듭니다.",
      "세 쌍의 다리가 있습니다. / 일곱 쌍의 다리가 있습니다.",
      "다른 동물을 먹지 않습니다. / 다른 동물을 먹습니다."
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
    "explanation": "개미는 땅 위와 땅속을 오가며 살고, 세 쌍의 다리로 걸어 다닙니다. 공벌레는 땅 위에서 살고, 일곱 쌍의 다리로 걸어 다닙니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기가 표 형식: 열 머리글 '개미'(밑줄) / '공벌레'(밑줄). 각 행을 '개미 칸 / 공벌레 칸'으로 옮김. ③의 '앞 다리'는 인쇄된 띄어쓰기 그대로."
    }
  },
  {
    "id": "s32-u02-o4-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 9,
      "page": 2,
      "sourceId": "sci-32-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "이동 방법이 다른 동물",
      "concept": "땅강아지는 다리 세 쌍으로 걸어 다니고, 뱀·달팽이·지렁이·배추흰나비 애벌레는 기어서 이동한다."
    },
    "prompt": "이동하는 방법이 나머지 넷과 다른 것을 고르세요.",
    "givens": null,
    "choices": [
      "뱀",
      "달팽이",
      "지렁이",
      "땅강아지",
      "배추흰나비 애벌레"
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
    "explanation": "뱀, 달팽이, 지렁이, 배추흰나비 애벌레는 기어서 이동하지만 땅강아지는 세 쌍의 다리가 있어 걸어 다니고, 앞다리를 이용해 땅을 팔 수 있습니다.",
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
    "id": "s32-u02-o4-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 10,
      "page": 2,
      "sourceId": "sci-32-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "수달과 개구리가 사는 곳",
      "concept": "수달과 개구리는 물과 땅을 오가며 강가나 호숫가에서 산다."
    },
    "prompt": "다음의 동물들이 주로 사는 곳을 고르세요.",
    "givens": {
      "지문": "▲수달 ▲개구리"
    },
    "choices": [
      "물속",
      "갯벌",
      "바닷속",
      "강 바닥",
      "강가나 호숫가"
    ],
    "figure": "assets/bank/s32-u02/s4-q10.webp",
    "figureNote": "수달 사진(▲수달)과 개구리 사진(▲개구리) 두 장",
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
    "explanation": "수달과 개구리는 주로 강가나 호숫가에서 사는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "동물 이름은 사진 캡션으로만 주어짐."
    }
  },
  {
    "id": "s32-u02-o4-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 11,
      "page": 3,
      "sourceId": "sci-32-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "조개의 특징",
      "concept": "조개는 아가미로 숨을 쉬고 딱딱한 껍데기로 몸이 둘러싸여 있다."
    },
    "prompt": "조개를 관찰한 내용으로 옳은 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "아가미로 숨을 쉽니다.",
      "지느러미로 헤엄을 칩니다.",
      "딱딱한 껍데기가 있습니다.",
      "집게 다리가 한 쌍 있습니다.",
      "뒷다리가 앞다리보다 더 깁니다."
    ],
    "figure": "assets/bank/s32-u02/s4-q11.webp",
    "figureNote": "모래 위 조개 사진",
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
    "explanation": "조개는 아가미로 숨을 쉬고 딱딱한 껍데기로 몸이 둘러싸여 있습니다. 도끼 모양의 발로 땅을 파고 들어가거나 기어 다닙니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문 '(정답 2 개)'는 인쇄된 띄어쓰기 그대로."
    }
  },
  {
    "id": "s32-u02-o4-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 12,
      "page": 3,
      "sourceId": "sci-32-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "금붕어가 물속 생활에 알맞은 점",
      "concept": "금붕어는 아가미·지느러미·곡선형 몸·옆줄로 물속 생활에 알맞고, 입이 작아 작은 먹이를 먹는다."
    },
    "prompt": "금붕어가 물속에서 생활하기에 알맞은 점이 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "아가미가 있어 물속에서 숨을 쉴 수 있습니다.",
      "지느러미가 있어서 물속에서 헤엄을 잘 칠 수 있습니다.",
      "입이 매우 커서 자기보다 몸집이 매우 큰 동물도 잡아먹을 수 있습니다.",
      "몸이 부드러운 곡선 형태여서 물속에서 빨리 헤엄쳐 이동할 수 있습니다.",
      "몸의 옆에 옆줄이 있어 물의 흐름이나 다른 동물의 움직임을 느낄 수 있습니다."
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
    "explanation": "금붕어는 입이 작아 물속의 작은 먹이들을 먹고 삽니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '아닌'에 밑줄."
    }
  },
  {
    "id": "s32-u02-o4-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 13,
      "page": 3,
      "sourceId": "sci-32-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "깃털로 덮인 날아다니는 동물",
      "concept": "몸이 깃털로 덮여 있고 날개가 있어 하늘을 나는 동물은 새(직박구리)이다."
    },
    "prompt": "다음과 같은 특징이 있는 동물을 고르세요.",
    "givens": {
      "지문": "날개가 있으며, 몸이 깃털로 덮여 있고, 몸이 비교적 가벼워 하늘을 잘 날 수 있습니다."
    },
    "choices": [
      "나방",
      "나비",
      "잠자리",
      "직박구리",
      "소금쟁이"
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
    "explanation": "날개가 있으며, 몸이 깃털로 덮여 있고, 비교적 가벼워 하늘을 잘 날 수 있는 동물은 직박구리와 같이 날아다니는 새입니다.",
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
    "id": "s32-u02-o4-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 14,
      "page": 3,
      "sourceId": "sci-32-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "날아다니는 동물의 공통점",
      "concept": "날아다니는 동물은 모두 날개가 있고 몸이 비교적 가볍다."
    },
    "prompt": "날아다니는 동물의 공통점을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 주로 밤에 활동합니다.",
        "ㄴ. 온몸이 깃털로 덮여 있습니다.",
        "ㄷ. 날개가 있고, 몸이 비교적 가볍습니다."
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
        "ㄷ."
      ]
    },
    "explanation": "날아다니는 동물은 모두 날개가 있고, 몸이 비교적 가볍습니다. 몸이 깃털로 덮여 있는 것은 새의 특징입니다.",
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
    "id": "s32-u02-o4-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 15,
      "page": 3,
      "sourceId": "sci-32-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "날개 개수가 다른 동물",
      "concept": "새는 날개가 한 쌍이고, 곤충인 나비는 날개가 두 쌍이다."
    },
    "prompt": "날개의 개수가 나머지와 다른 동물을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 참새",
        "ㄴ. 나비",
        "ㄷ. 까치",
        "ㄹ. 황조롱이"
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
        "ㄴ",
        "ㄴ.",
        "나비"
      ]
    },
    "explanation": "참새, 까치, 황조롱이는 한 쌍의 날개가 있지만 곤충인 나비는 두 쌍의 날개가 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '다른'에 밑줄. <보기>는 2열 배치(ㄱ·ㄴ / ㄷ·ㄹ)."
    }
  },
  {
    "id": "s32-u02-o4-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 16,
      "page": 3,
      "sourceId": "sci-32-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "낙타 혹에 저장된 것",
      "concept": "낙타 등의 혹에는 지방이 저장되어 있어 며칠 동안 먹지 않아도 살 수 있다."
    },
    "prompt": "낙타 등의 혹에는 무엇이 저장되어 있는지 고르세요.",
    "givens": {
      "지문": "[16~17] 다음은 사막에서 사는 낙타의 모습입니다. 물음에 답하세요."
    },
    "choices": [
      "물",
      "공기",
      "모래",
      "지방",
      "얼음"
    ],
    "figure": "assets/bank/s32-u02/s4-q16.webp",
    "figureNote": "사막에서 사는 쌍봉낙타 어미와 새끼 사진",
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
    "explanation": "낙타 등의 혹에는 지방이 저장되어 있어 며칠 동안 밥을 먹지 않아도 살 수 있습니다.",
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
    "id": "s32-u02-o4-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 17,
      "page": 4,
      "sourceId": "sci-32-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "낙타 발바닥과 사막 생활",
      "concept": "낙타는 발바닥이 넓어 모래에 발이 잘 빠지지 않아 사막에서 걷기에 알맞다."
    },
    "prompt": "낙타가 사막의 환경에서 잘 살 수 있는 까닭을 발바닥의 생김새와 관련지어 쓰세요.",
    "givens": {
      "지문": "[16~17] 다음은 사막에서 사는 낙타의 모습입니다. 물음에 답하세요."
    },
    "choices": null,
    "figure": "assets/bank/s32-u02/s4-q16.webp",
    "figureNote": "사막에서 사는 쌍봉낙타 어미와 새끼 사진([16~17] 공통)",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "낙타는 발바닥이 넓어 모래에 발이 잘 빠지지 않습니다.",
      "rubric": {
        "required": [
          "낙타는 발바닥이 넓다",
          "모래에 발이 잘 빠지지 않는다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "발바닥이 넓어 발이 모래에 잘 빠지지 않는다는 것을 쓴 경우 (100%)",
          "모래에서 잘 걸을 수 있다 등 정확하지 않은 경우 (50%)"
        ]
      }
    },
    "explanation": "낙타는 발바닥이 넓어 모래에 발이 잘 빠지지 않고, 등에 지방을 저장한 혹이 있어 먹이가 없이도 며칠 동안 살 수 있으며, 콧구멍을 여닫을 수 있어 모래바람이 불어도 콧속으로 모래가 잘 들어가지 않습니다. 이처럼 낙타는 사막에서 살기에 알맞은 특징을 가지고 있습니다.\n[채점 기준] 발바닥이 넓어 발이 모래에 잘 빠지지 않는다는 것을 쓴 경우 (100%) / 모래에서 잘 걸을 수 있다 등 정확하지 않은 경우 (50%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "공통 발문과 사진은 3쪽, 17번 문항은 4쪽."
    }
  },
  {
    "id": "s32-u02-o4-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 18,
      "page": 4,
      "sourceId": "sci-32-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "홍합을 활용한 생활용품",
      "concept": "홍합이 파도에도 바위에 단단히 붙어 있는 특징을 활용해 물속 접착제를 만들었다."
    },
    "prompt": "홍합의 특징을 활용해 만든 것을 고르세요.",
    "givens": null,
    "choices": [
      "물갈퀴",
      "방탄복",
      "고속열차",
      "붙임 딱지",
      "물속에서 사용할 수 있는 접착제"
    ],
    "figure": "assets/bank/s32-u02/s4-q18.webp",
    "figureNote": "바위에 붙어 있는 홍합 무리 사진",
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
    "explanation": "홍합이 세찬 파도에도 바위에서 떨어지지 않고 붙어 있는 특징을 활용해 물속에서 사용할 수 있는 접착제를 만들었습니다.",
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
    "id": "s32-u02-o4-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 19,
      "page": 4,
      "sourceId": "sci-32-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "집게 차와 동물의 특징",
      "concept": "집게 차는 먹이를 잘 잡고 놓치지 않는 수리의 발을 본떠 만들었다."
    },
    "prompt": "집게 차는 어떤 동물의 특징을 활용해 만든 것인지 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 수리의 발",
        "ㄴ. 산양의 발바닥",
        "ㄷ. 오리의 발에 있는 물갈퀴",
        "ㄹ. 두더지의 크고 단단한 앞발"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u02/s4-q19.webp",
    "figureNote": "고철 더미를 집어 올리는 집게 차(집게 달린 크레인) 사진",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ",
        "ㄱ.",
        "수리의 발"
      ]
    },
    "explanation": "수리의 발이 먹이를 잘 잡고 놓치지 않는 특징을 활용해 물건을 집어 옮길 수 있는 집게 차를 만들었습니다.",
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
    "id": "s32-u02-o4-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 20,
      "page": 4,
      "sourceId": "sci-32-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "동물을 모방한 로봇",
      "concept": "바다 탐사 로봇은 바닷속에서 여러 방향으로 움직이는 거북의 특징을 활용했다."
    },
    "prompt": "다음은 동물의 특징을 활용해 설계한 로봇에 대한 설명입니다. 빈칸에 들어갈 알맞은 동물을 고르세요.",
    "givens": {
      "지문": "바다 탐사 로봇은 바닷속에서 여러 방향으로 움직일 수 있어야 하므로 [    ]의 특징을 활용하였습니다."
    },
    "choices": [
      "뱀",
      "거미",
      "거북",
      "잠자리",
      "카멜레온"
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
    "explanation": "바다 탐사 로봇은 여러 방향으로 움직일 수 있는 거북의 특징을 활용하였습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 빈칸은 네모 칸으로 인쇄됨."
    }
  }
];
