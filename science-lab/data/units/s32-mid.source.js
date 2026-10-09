// 3-2 Ⅵ 중간평가 — 단원평가 원문 40문항(시매쓰DMC 중간평가 세트1·2). 시험지를 그대로 옮기고 정답 및 풀이와 대조했다.
// 원장 지시(2026-10-09): 원문을 그대로 문제은행에 쓴다. 그림은 시험지에서 잘라 낸 것(assets/bank/s32-mid/).
export const source = [
  {
    "id": "s32-mid-o1-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 1,
      "page": 1,
      "sourceId": "sci-32-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "탐구 계획에 들어갈 내용",
      "concept": "탐구 결과는 탐구를 실행한 뒤에 알게 되므로 탐구 계획 단계에서 정할 수 없다."
    },
    "prompt": "탐구 문제를 해결하기 위해 탐구 계획을 세울 때 정해야 할 것이 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "준비물",
      "탐구 순서",
      "예상되는 결과",
      "탐구 문제를 해결할 방법",
      "탐구를 하여 알게 된 결과"
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
    "explanation": "탐구를 하여 알게 된 결과는 탐구를 실행한 후 알 수 있는 것입니다.",
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
    "id": "s32-mid-o1-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 2,
      "page": 1,
      "sourceId": "sci-32-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "우리 주변에 사는 동물",
      "concept": "화단의 돌 밑에서는 공벌레나 개미를 볼 수 있고, 나비와 잠자리는 날아다니는 곤충이다."
    },
    "prompt": "우리 주변에 사는 동물에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "나무에서 참새, 까치 등을 볼 수 있습니다.",
      "개, 고양이는 집 주변에서 볼 수 있습니다.",
      "화단에서 개미, 꿀벌 등을 볼 수 있습니다.",
      "화단의 돌 밑에서 나비, 잠자리 등을 볼 수 있습니다.",
      "우리 주변에는 여러 가지 동물이 살고, 저마다의 특징을 가지고 있습니다."
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
    "explanation": "화단의 돌 밑에서는 공벌레나 개미 등을 볼 수 있습니다. 나비나 잠자리는 날개가 있어 날아다니는 곤충입니다.",
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
    "id": "s32-mid-o1-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 3,
      "page": 1,
      "sourceId": "sci-32-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "동물 분류 기준",
      "concept": "분류 기준은 누가 판단해도 같은 결과가 나오는 객관적인 것이어야 한다."
    },
    "prompt": "동물을 특징에 따라 분류할 때의 분류 기준으로 적절하지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "알을 낳는가?",
      "다리가 있는가?",
      "몸이 큰 편인가?",
      "더듬이가 있는가?",
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
    "explanation": "몸의 크기가 크거나 작은가? 생김새가 예쁜가? 등은 사람에 따라 다르게 생각할 수 있기 때문에 분류 기준으로 적합하지 않습니다.",
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
    "id": "s32-mid-o1-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 4,
      "page": 1,
      "sourceId": "sci-32-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "분류 기준 찾기",
      "concept": "오리·수달·개구리는 발에 물갈퀴가 있어 물갈퀴가 없는 동물과 나뉜다."
    },
    "prompt": "다음과 같이 동물을 분류하였을 때 분류 기준으로 알맞은 것을 고르세요.",
    "givens": {
      "표": {
        "분류 1": [
          "오리, 수달, 개구리"
        ],
        "분류 2": [
          "까치, 다람쥐, 거미"
        ]
      }
    },
    "choices": [
      "날개가 있는 것과 없는 것",
      "알을 낳는 것과 새끼를 낳는 것",
      "다리가 두 개인 것과 네 개인 것",
      "발에 물갈퀴가 있는 것과 없는 것",
      "몸이 털로 덮인 것과 깃털로 덮인 것"
    ],
    "figure": "assets/bank/s32-mid/s1-q04.webp",
    "figureNote": "두 칸짜리 표: 왼쪽 칸 '오리, 수달, 개구리', 오른쪽 칸 '까치, 다람쥐, 거미' (열 머리 없음).",
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
    "explanation": "오리, 수달, 개구리는 물에서 사는 동물로, 발에 물갈퀴가 있지만, 까치, 토끼, 메뚜기는 발에 물갈퀴가 없습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "표에는 열 머리가 없음('분류 1'/'분류 2'는 임의 이름). 문제지 표의 오른쪽 칸은 '까치, 다람쥐, 거미'이나 해설에는 '까치, 토끼, 메뚜기'로 되어 있어 서로 다름(문제지대로 옮김)."
    }
  },
  {
    "id": "s32-mid-o1-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 5,
      "page": 1,
      "sourceId": "sci-32-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "땅속에서 사는 동물",
      "concept": "두더지와 땅강아지는 앞다리로 땅을 파며 땅속에서 산다."
    },
    "prompt": "땅속에서 사는 동물을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2 개)",
    "givens": {
      "보기": [
        "ㄱ. 소",
        "ㄴ. 토끼",
        "ㄷ. 공벌레",
        "ㄹ. 두더지",
        "ㅁ. 다람쥐",
        "ㅂ. 땅강아지"
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
      "answer": "ㄹ, ㅂ",
      "accepted": [
        "ㄹ, ㅂ",
        "ㄹ,ㅂ",
        "ㄹㅂ",
        "ㅂ, ㄹ",
        "ㅂ,ㄹ",
        "두더지, 땅강아지"
      ]
    },
    "explanation": "소, 토끼, 공벌레, 다람쥐는 땅 위에서 사는 동물이고, 두더지와 땅강아지는 땅속에서 사는 동물입니다. 두더지와 땅강아지는 앞다리로 땅을 쉽게 팔 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 두 열로 인쇄됨(ㄱ·ㄴ / ㄷ·ㄹ / ㅁ·ㅂ). 답란 '(   ), (   )'."
    }
  },
  {
    "id": "s32-mid-o1-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 6,
      "page": 1,
      "sourceId": "sci-32-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "땅에서 사는 동물의 이동 방법",
      "concept": "다리가 없는 뱀은 땅 위를 기어 다니고, 다리가 있는 동물은 걷거나 뛰어다닌다."
    },
    "prompt": "동물의 이동 방법이 나머지 넷과 다른 것을 고르세요.",
    "givens": null,
    "choices": [
      "소",
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
    "explanation": "땅에서 사는 동물 중에서 다리가 있는 동물들은 걷거나 뛰어다닙니다. 뱀이나 달팽이처럼 다리가 없는 동물들은 땅 위를 기어 다닙니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'다른'에 밑줄. 보기는 두 열로 인쇄됨."
    }
  },
  {
    "id": "s32-mid-o1-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 7,
      "page": 2,
      "sourceId": "sci-32-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "고등어와 피라미의 공통점",
      "concept": "고등어는 바다에, 피라미는 강이나 호수에 사는 물고기이다."
    },
    "prompt": "다음 두 동물의 공통점으로 옳지 않은 것을 고르세요.",
    "givens": {
      "지문": "▲고등어 ▲피라미"
    },
    "choices": [
      "아가미로 숨을 쉽니다.",
      "몸이 비늘로 덮여 있습니다.",
      "바닷속에서 헤엄쳐서 이동합니다.",
      "지느러미를 이용하여 헤엄칩니다.",
      "몸의 모양이 부드러운 곡선 형태입니다."
    ],
    "figure": "assets/bank/s32-mid/s1-q07.webp",
    "figureNote": "고등어 사진(▲고등어)과 피라미 사진(▲피라미) 두 장.",
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
    "explanation": "고등어는 바닷속에서 사는 물고기이지만, 피라미는 강이나 호수에서 사는 물고기입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄. 해설은 해설지 1쪽 왼쪽 단 끝에서 오른쪽 단 위로 이어짐."
    }
  },
  {
    "id": "s32-mid-o1-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 8,
      "page": 2,
      "sourceId": "sci-32-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "날아다니는 동물의 공통점",
      "concept": "날아다니는 새와 곤충은 날개가 있고 몸이 비교적 가볍다."
    },
    "prompt": "날아다니는 동물의 공통된 특징을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2 개)",
    "givens": {
      "보기": [
        "ㄱ. 날개가 있습니다.",
        "ㄴ. 몸이 비교적 가볍습니다.",
        "ㄷ. 한 쌍의 다리가 있습니다.",
        "ㄹ. 날다가 공중에서 멈출 수 있습니다."
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
      "answer": "ㄱ, ㄴ",
      "accepted": [
        "ㄱ, ㄴ",
        "ㄱ,ㄴ",
        "ㄱㄴ",
        "ㄴ, ㄱ",
        "ㄴ,ㄱ"
      ]
    },
    "explanation": "날아다니는 새와 곤충은 날개가 있고 몸이 비교적 가볍습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란 '(   ), (   )'."
    }
  },
  {
    "id": "s32-mid-o1-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 9,
      "page": 2,
      "sourceId": "sci-32-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "사막여우의 특징",
      "concept": "두 발씩 번갈아 들어 올려 열을 식히는 것은 사막여우가 아니라 사막 도마뱀의 특징이다."
    },
    "prompt": "사막여우가 사막에서 잘 살 수 있는 특징으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "몸에 비해 귀가 큽니다.",
      "몸속의 열을 잘 내보내 체온 조절을 잘 합니다.",
      "이동할 때 한 번에 두 발씩 번갈아 들어 올립니다.",
      "사막의 모래 색깔과 비슷한 털 색깔을 가지고 있습니다.",
      "귓속에 털이 많아 모래가 귓속으로 잘 들어가지 않습니다."
    ],
    "figure": "assets/bank/s32-mid/s1-q09.webp",
    "figureNote": "바위 사이에 서 있는 사막여우 사진.",
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
    "explanation": "이동할 때 한 번에 두 발씩 번갈아 들어 올려 열을 식히는 것은 사막 도마뱀의 특징입니다.",
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
    "id": "s32-mid-o1-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 10,
      "page": 2,
      "sourceId": "sci-32-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "동물의 특징을 활용한 생활용품",
      "concept": "집게 차는 먹이를 잘 잡고 놓치지 않는 수리의 발을 본떠 만들었다."
    },
    "prompt": "집게 차는 어떤 동물의 특징을 활용한 것인지 고르세요.",
    "givens": null,
    "choices": [
      "뱀",
      "문어",
      "거미",
      "수리",
      "바다거북"
    ],
    "figure": "assets/bank/s32-mid/s1-q10.webp",
    "figureNote": "고철 더미를 집는 초록색 집게 차의 집게 사진.",
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
    "explanation": "수리의 발이 먹이를 잘 잡고 놓치지 않는 특징을 활용해 물건을 집어 옮길 수 있는 집게 차를 만들었습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기는 두 열로 인쇄됨."
    }
  },
  {
    "id": "s32-mid-o1-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 11,
      "page": 2,
      "sourceId": "sci-32-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "바다 탐사 로봇의 기능",
      "concept": "로봇은 생물이 아니어서 숨 쉬는 기능은 필요 없고, 바닷속에서 움직이며 관찰하는 기능이 필요하다."
    },
    "prompt": "바다 탐사 로봇을 만들 때 로봇에 있어야 할 기능으로 적절하지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "헤엄을 잘 칠 수 있어야 합니다.",
      "물속에서 숨을 잘 쉴 수 있어야 합니다.",
      "바다 생물을 잘 피할 수 있어야 합니다.",
      "어두우므로 불빛을 낼 수 있어야 합니다.",
      "바다 속을 잘 걸어 다닐 수 있어야 합니다."
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
    "explanation": "바다 탐사 로봇은 바다 속을 잘 걸어 다니거나 움직이면서 바다 생물이나 지형을 관찰할 수 있어야 합니다. 로봇은 살아있는 생물이 아니므로 숨을 잘 쉴 수 있는 기능은 필요하지 않습니다.",
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
    "id": "s32-mid-o1-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 12,
      "page": 2,
      "sourceId": "sci-32-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물에 뜬 물질의 양 비교",
      "concept": "화단 흙에는 식물의 뿌리나 나뭇잎 조각처럼 물에 뜨는 물질이 운동장 흙보다 많다."
    },
    "prompt": "운동장 흙과 화단 흙을 물이 든 비커에 넣고 유리 막대로 저은 뒤 잠시 놓아두었습니다. 10 분 후 물에 뜬 물질의 양이 더 많은 것은 어느 곳의 흙인지 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "화단 흙",
      "accepted": [
        "화단 흙",
        "화단흙",
        "화단"
      ]
    },
    "explanation": "화단 흙에는 식물의 뿌리, 작은 나뭇가지, 죽은 곤충, 나뭇잎 조각 등 물에 뜨는 물질이 많이 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란이 '(      ) 흙'으로 인쇄됨."
    }
  },
  {
    "id": "s32-mid-o1-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 13,
      "page": 3,
      "sourceId": "sci-32-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "흙의 물 빠짐 차이의 까닭",
      "concept": "운동장 흙은 알갱이가 커서 화단 흙보다 물이 빨리 빠진다."
    },
    "prompt": "운동장 흙과 화단 흙의 물 빠짐을 알아보는 실험 결과 운동장 흙의 물이 더 빠르게 빠졌습니다. 그 까닭과 관련이 있는 관찰 결과를 위의 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[13~14] 다음의 <보기>는 운동장 흙과 화단 흙의 특징을 관찰한 결과입니다. 물음에 답하세요.",
      "보기": [
        "ㄱ. 어두운 갈색입니다.",
        "ㄴ. 물에 뜨는 물질이 많습니다.",
        "ㄷ. 알갱이의 크기가 비교적 큽니다.",
        "ㄹ. 식물의 뿌리나 나뭇잎 조각과 같은 물질들이 많이 섞여 있습니다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-mid/s1-q13.webp",
    "figureNote": "물이 든 비커를 거름종이를 끼운 페트병 위로 붓는 장치 두 개. 왼쪽 '운동장 흙', 오른쪽 '화단 흙' 이름표.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ",
        "알갱이의 크기가 비교적 큽니다."
      ]
    },
    "explanation": "운동장 흙은 화단 흙보다 알갱이의 크기가 더 크기 때문에 운동장 흙에서 물이 더 빨리 빠집니다.",
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
    "id": "s32-mid-o1-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 14,
      "page": 3,
      "sourceId": "sci-32-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "식물이 잘 자라는 흙의 특징",
      "concept": "물에 뜨는 부식물(식물 뿌리·나뭇잎 조각 등)이 많은 흙에서 식물이 잘 자란다."
    },
    "prompt": "위의 <보기>에서 식물이 잘 자라는 흙의 특징에 해당하는 것을 모두 골라 기호를 쓰세요. (정답 2 개)",
    "givens": {
      "지문": "[13~14] 다음의 <보기>는 운동장 흙과 화단 흙의 특징을 관찰한 결과입니다. 물음에 답하세요.",
      "보기": [
        "ㄱ. 어두운 갈색입니다.",
        "ㄴ. 물에 뜨는 물질이 많습니다.",
        "ㄷ. 알갱이의 크기가 비교적 큽니다.",
        "ㄹ. 식물의 뿌리나 나뭇잎 조각과 같은 물질들이 많이 섞여 있습니다."
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
        "ㄴㄹ",
        "ㄹ, ㄴ",
        "ㄹ,ㄴ"
      ]
    },
    "explanation": "흙에 식물의 뿌리나 나뭇잎 조각과 같은 물질들이 많이 섞여 있으면 식물이 잘 자랄 수 있습니다. 이런 식물의 뿌리나 나뭇잎 조각과 같은 물질들은 물에 뜨는 부식물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란 '(   ), (   )'."
    }
  },
  {
    "id": "s32-mid-o1-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 15,
      "page": 3,
      "sourceId": "sci-32-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "바위가 부서지는 과정",
      "concept": "바위는 오랜 시간에 걸쳐 나무뿌리가 자라거나 틈의 물이 얼었다 녹기를 반복하면서 부서진다."
    },
    "prompt": "자연에서 바위가 부서지는 과정과 관련된 내용으로 옳은 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "바위 아래에 동물이 삽니다.",
      "바위가 부서지는 데에는 비교적 짧은 시간이 걸립니다.",
      "바위틈에서 나무뿌리가 자라면서 바위가 부서지기도 합니다.",
      "바위와 생물이 썩어 생긴 물질들이 섞이면 바위가 부서지기도 합니다.",
      "바위틈에서 물이 얼었다 녹기를 반복하면서 바위가 부서지기도 합니다."
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
        4
      ]
    },
    "explanation": "바위가 부서지는 데에는 비교적 긴 시간이 걸립니다. 바위는 흐르는 물이나 바람에 의해 부서지기도 하고 나무뿌리가 자라거나 물이 얼었다 녹기를 반복하면서 부서지기도 합니다.",
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
    "id": "s32-mid-o1-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 16,
      "page": 3,
      "sourceId": "sci-32-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흐르는 물에 의한 색 모래의 이동",
      "concept": "흙 언덕 위쪽의 색 모래는 흐르는 물에 실려 아래쪽으로 옮겨진다."
    },
    "prompt": "위의 흙 언덕 위쪽에서 물을 흘려보냈을 때 색 모래의 변화로 옳은 것을 고르세요.",
    "givens": {
      "지문": "[16~17] 다음은 흙 언덕을 만들고 색 모래를 흙 언덕 위쪽에 뿌린 모습입니다. 물음에 답하세요."
    },
    "choices": [
      "색 모래가 물에 녹습니다.",
      "색 모래는 이동하지 않습니다.",
      "색 모래가 위쪽에서 아래쪽으로 이동합니다.",
      "색 모래가 흙 언덕 전체에 골고루 퍼집니다.",
      "색 모래가 흙 언덕의 중간 부분에 쌓입니다."
    ],
    "figure": "assets/bank/s32-mid/s1-q16.webp",
    "figureNote": "쟁반 위 흙 언덕 그림. 꼭대기에 파란 색 모래가 뿌려져 있고 위쪽 ㄱ, 중간 ㄴ, 아래쪽 ㄷ 표시, 쟁반에 '흙' 이름표.",
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
    "explanation": "위쪽에 뿌린 색 모래는 흐르는 물에 의해 위쪽에서 아래쪽으로 이동합니다.",
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
    "id": "s32-mid-o1-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 17,
      "page": 3,
      "sourceId": "sci-32-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "흙 언덕에서 침식·퇴적이 활발한 곳",
      "concept": "흐르는 물에 의한 침식은 흙 언덕 위쪽에서, 퇴적은 아래쪽에서 가장 활발하다."
    },
    "prompt": "위의 흙 언덕 위쪽에서 물을 흘려보냈을 때 ㄱ~ㄷ 중 침식 작용이 가장 활발하게 일어나는 부분과 퇴적 작용이 가장 활발하게 일어나는 부분을 골라 기호를 각각 쓰세요.",
    "givens": {
      "지문": "[16~17] 다음은 흙 언덕을 만들고 색 모래를 흙 언덕 위쪽에 뿌린 모습입니다. 물음에 답하세요."
    },
    "choices": null,
    "figure": "assets/bank/s32-mid/s1-q16.webp",
    "figureNote": "16번과 같은 흙 언덕 그림(위쪽 ㄱ, 중간 ㄴ, 아래쪽 ㄷ).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "침식 작용-ㄱ, 퇴적 작용-ㄷ",
      "accepted": [
        "침식 작용-ㄱ, 퇴적 작용-ㄷ",
        "ㄱ, ㄷ",
        "ㄱ,ㄷ",
        "침식-ㄱ, 퇴적-ㄷ",
        "침식 작용: ㄱ, 퇴적 작용: ㄷ",
        "침식 ㄱ 퇴적 ㄷ"
      ]
    },
    "explanation": "침식 작용이 가장 활발하게 일어나는 곳은 흙 언덕의 위쪽이고, 퇴적 작용이 가장 활발하게 일어나는 곳은 흙 언덕의 아래쪽입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란이 '침식 작용-(   )', '퇴적 작용-(   )' 두 줄로 인쇄됨. 순서가 있는 두 기호."
    }
  },
  {
    "id": "s32-mid-o1-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 18,
      "page": 3,
      "sourceId": "sci-32-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "강 상류의 모습",
      "concept": "강 상류에는 큰 바위와 돌이 많고, 하류에는 모래·진흙과 넓은 평야가 있다."
    },
    "prompt": "강 상류에서 많이 볼 수 있는 것을 고르세요.",
    "givens": null,
    "choices": [
      "들",
      "모래",
      "진흙",
      "큰 바위",
      "넓은 평야"
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
    "explanation": "강 상류에서는 큰 바위나 돌을 많이 볼 수 있습니다. 강 하류에는 모래나 진흙이 많고, 넓은 평야나 들을 볼 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기는 두 열로 인쇄됨."
    }
  },
  {
    "id": "s32-mid-o1-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 19,
      "page": 4,
      "sourceId": "sci-32-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "바닷물의 침식 지형",
      "concept": "바닷가 절벽(해식 절벽)과 아치 모양 바위(해식 아치)는 바닷물의 침식으로 만들어진다."
    },
    "prompt": "바닷물의 침식 작용으로 만들어진 지형을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2 개)",
    "givens": {
      "보기": [
        "ㄱ. (사진)",
        "ㄴ. (사진)",
        "ㄷ. (사진)",
        "ㄹ. (사진)"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-mid/s1-q19.webp",
    "figureNote": "<보기> 상자 안 사진 네 장: ㄱ. 바닷가의 높은 절벽, ㄴ. 넓은 모래사장, ㄷ. 구멍이 뚫린 아치 모양 바위 절벽, ㄹ. 물결무늬가 있는 갯벌.",
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
    "explanation": "ㄱ과 ㄷ은 바닷물의 침식 작용으로 만들어진 지형이고, ㄴ과 ㄹ은 바닷물의 퇴적 작용으로 만들어진 지형입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 기호와 사진만 있고 글이 없음. 답란 '(   ), (   )'."
    }
  },
  {
    "id": "s32-mid-o1-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 20,
      "page": 4,
      "sourceId": "sci-32-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흙을 보존하는 방법",
      "concept": "나무와 풀을 심거나 흙을 고정하는 시설물을 설치하면 흐르는 물에 흙이 깎여 나가는 것을 막을 수 있다."
    },
    "prompt": "다음과 같은 작업을 하는 까닭으로 알맞은 것을 고르세요.",
    "givens": {
      "지문": "• 산에 나무나 풀을 많이 심습니다.\n• 산에 흙을 고정해 주는 시설물을 설치합니다."
    },
    "choices": [
      "흙을 보존하기 위해서입니다.",
      "하천을 만들기 위해서입니다.",
      "산에 도로를 내기 위해서입니다.",
      "동식물을 보존하기 위해서입니다.",
      "비가 많이 오지 않게 하기 위해서입니다."
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
    "explanation": "산에 나무나 풀을 많이 심고, 흙을 덮어 주거나 고정해 주는 시설물을 설치하면 흐르는 물에 의해 흙이 떠내려가는 것을 막을 수 있습니다.",
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
    "id": "s32-mid-o2-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 1,
      "page": 1,
      "sourceId": "sci-32-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "탐구 계획에서 다르게 해야 할 조건",
      "concept": "탐구 문제에서 알아보려는 조건 한 가지만 다르게 하고 나머지 조건은 모두 같게 해야 한다."
    },
    "prompt": "다음과 같은 탐구 문제를 해결하기 위한 탐구 계획에서 다르게 해야 할 것은 무엇인지 고르세요.",
    "givens": {
      "지문": "막대자석 두 개를 길게 이어 붙이면 막대자석 한 개보다 철 클립이 더 많이 붙을까?"
    },
    "choices": [
      "철 클립의 모양",
      "철 클립의 색깔",
      "막대자석의 크기",
      "막대자석의 개수",
      "막대자석에 붙은 클립의 개수"
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
    "explanation": "막대자석의 개수에 따른 자석의 힘을 비교하기 위한 실험이므로 막대자석의 개수를 다르게 하고 다른 조건은 모두 동일하게 해야 합니다.",
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
    "id": "s32-mid-o2-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 2,
      "page": 1,
      "sourceId": "sci-32-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "우리 주변에 사는 동물의 특징",
      "concept": "거미는 다리가 네 쌍인 동물이다."
    },
    "prompt": "우리 주변에 사는 동물의 특징에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "개와 고양이는 집 주변에서 볼 수 있습니다.",
      "고양이는 두 쌍의 다리가 있고 몸이 털로 덮여 있습니다.",
      "꿀벌은 두 쌍의 날개가 있고, 화단의 꽃에 있는 꿀을 먹습니다.",
      "까치는 한 쌍의 날개가 있고 검은색과 하얀색 깃털로 덮여 있습니다.",
      "거미는 두 쌍의 다리가 있고, 나무, 건물 벽 등에 거미줄을 치고 있습니다."
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
    "explanation": "거미는 네 쌍의 다리가 있습니다.",
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
    "id": "s32-mid-o2-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 3,
      "page": 1,
      "sourceId": "sci-32-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "다리가 없어 기어 다니는 동물",
      "concept": "달팽이는 다리가 없어 땅 위를 기어서 이동한다."
    },
    "prompt": "다리가 없어 기어 다니는 동물을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. ▲거미",
        "ㄴ. ▲꿀벌",
        "ㄷ. ▲달팽이",
        "ㄹ. ▲공벌레"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-mid/s2-q03.webp",
    "figureNote": "<보기> 상자 안 ㄱ~ㄹ 동물 사진 4장: ㄱ 거미(거미줄 위), ㄴ 꿀벌, ㄷ 달팽이, ㄹ 공벌레. 각 사진 아래 ▲이름.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ",
        "달팽이"
      ]
    },
    "explanation": "달팽이는 다리가 없어서 땅 위를 기어 다니는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 글이 아니라 사진 4장과 이름 캡션(▲거미 등)이다. 이름만으로도 풀 수 있다."
    }
  },
  {
    "id": "s32-mid-o2-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 4,
      "page": 2,
      "sourceId": "sci-32-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물에서 사는 동물의 공통점",
      "concept": "피라미, 다슬기, 물방개, 가오리, 오징어, 고등어, 상어, 전복은 모두 물속에서 사는 동물이다."
    },
    "prompt": "다음 동물들의 공통점을 고르세요.",
    "givens": {
      "지문": "피라미, 다슬기, 물방개, 가오리, 오징어, 고등어, 상어, 전복"
    },
    "choices": [
      "새끼를 낳습니다.",
      "더듬이가 있습니다.",
      "세 쌍의 다리가 있습니다.",
      "물속에서 살 수 있습니다.",
      "다른 동물을 먹지 않습니다."
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
    "explanation": "위의 동물들은 물속에서 살 수 있는 동물들입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "상자 안 동물 이름은 두 줄(「피라미, 다슬기, 물방개, 가오리,」/「오징어, 고등어, 상어, 전복」)로 인쇄됨."
    }
  },
  {
    "id": "s32-mid-o2-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 5,
      "page": 2,
      "sourceId": "sci-32-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "동물 분류 기준",
      "concept": "다리가 있는지에 따라 까치·토끼와 뱀·달팽이를 나눌 수 있다."
    },
    "prompt": "다음은 어떤 분류 기준에 따라 동물을 분류한 결과입니다. 빈칸에 들어갈 알맞은 말을 <보기>에서 골라 쓰세요.",
    "givens": {
      "표": {
        "분류 기준": [
          "□(이)가 있는가?"
        ],
        "그렇다.": [
          "까치, 토끼"
        ],
        "그렇지 않다.": [
          "뱀, 달팽이"
        ]
      },
      "보기": [
        "다리, 날개, 더듬이, 지느러미"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-mid/s2-q05.webp",
    "figureNote": "분류표: 맨 윗줄 「분류 기준: [빈칸](이)가 있는가?」, 아래 두 칸 「그렇다.」(까치, 토끼) / 「그렇지 않다.」(뱀, 달팽이).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "다리",
      "accepted": [
        "다리"
      ]
    },
    "explanation": "까치와 토끼는 다리가 있지만 뱀과 달팽이는 다리가 없는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "표의 빈칸은 네모 칸으로 그려져 있어 givens에서는 □로 적음. <보기>는 한 줄 낱말 목록이라 기호 없이 한 원소로 적음."
    }
  },
  {
    "id": "s32-mid-o2-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 6,
      "page": 2,
      "sourceId": "sci-32-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "땅에서 사는 동물의 특징",
      "concept": "다람쥐는 땅 위에 살며 털이 있고, 개미는 다리가 세 쌍이며 몸이 머리·가슴·배로 나뉜다."
    },
    "prompt": "땅에서 사는 동물에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "다리가 없는 동물은 걷거나 뛰어다닙니다.",
      "다람쥐는 땅 위에서 살고, 몸이 털로 덮여 있습니다.",
      "개미는 세 쌍의 다리가 있고, 몸이 머리, 가슴, 배로 구분됩니다.",
      "땅강아지는 두 쌍의 다리와 두 쌍의 날개가 있고, 땅 속을 기어 다닙니다.",
      "달팽이는 화단의 돌 밑에서 볼 수 있고, 몸이 여러 개의 마디로 되어 있습니다."
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
    "explanation": "다리가 있는 동물은 걷거나 뛰어다니고, 다리가 없는 동물은 기어 다닙니다. 땅강아지는 세 쌍의 다리를 가지고 있으며 앞다리를 이용해 땅을 팔 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "⑤ 「여러 개의 마디」가 줄바꿈으로 「여러 개 / 의 마디」로 인쇄됨."
    }
  },
  {
    "id": "s32-mid-o2-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 7,
      "page": 2,
      "sourceId": "sci-32-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물고기가 물속 생활에 알맞은 점",
      "concept": "물고기는 지느러미로 헤엄치고 아가미로 물속에서 숨을 쉰다."
    },
    "prompt": "다음은 금붕어와 같은 물고기가 물속에서 생활하기에 알맞은 점에 대한 설명입니다. 빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 각각 쓰세요.",
    "givens": {
      "지문": "• ㉠ (이)가 있어서 물속에서 헤엄을 잘 칠 수 있습니다.\n• ㉡ (이)가 있어서 물속에서 숨을 쉴 수 있습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-지느러미, ㉡-아가미",
      "accepted": [
        "㉠-지느러미, ㉡-아가미",
        "㉠ 지느러미, ㉡ 아가미",
        "지느러미, 아가미",
        "지느러미,아가미",
        "㉠ 지느러미 ㉡ 아가미",
        "ㄱ 지느러미, ㄴ 아가미"
      ]
    },
    "explanation": "물고기는 지느러미가 있어서 물속에서 헤엄을 잘 칠 수 있으며, 아가미가 있어 물속에서 숨을 쉴 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "㉠·㉡은 네모 빈칸 안에 인쇄됨. 답칸은 「㉠-(  ), ㉡-(  )」."
    }
  },
  {
    "id": "s32-mid-o2-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 8,
      "page": 2,
      "sourceId": "sci-32-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "개구리와 수달의 공통된 특징",
      "concept": "개구리와 수달은 발에 물갈퀴가 있어 물속에서 헤엄을 잘 친다."
    },
    "prompt": "다음의 동물들이 헤엄을 잘 칠 수 있는 까닭과 관련 있는 공통된 특징을 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s32-mid/s2-q08.webp",
    "figureNote": "사진 2장: ▲개구리(나뭇가지 위 초록 개구리), ▲수달(바위 위).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "개구리와 수달은 발에 물갈퀴가 있어 물속에서 헤엄칠 수 있습니다.",
      "rubric": {
        "required": [
          "발에 물갈퀴가 있다(개구리와 수달의 공통된 특징)"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "개구리와 수달의 특징을 정확하게 쓴 경우 (100%)"
        ]
      }
    },
    "explanation": "개구리와 수달은 강이나 호수에서 사는 동물입니다. 개구리는 두 쌍의 다리가 있고, 뒷발에는 물갈퀴가 있어 물속에서 헤엄을 칠 수 있습니다. 수달은 두쌍의 다리가 있고, 발가락에 물갈퀴가 있어 물속에서 헤엄을 칠 수 있습니다.\n[채점 기준] 개구리와 수달의 특징을 정확하게 쓴 경우 (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표의 행 머리는 「정답」. 해설 원문에 「두쌍의」가 띄어 쓰지 않은 채 인쇄됨(그대로 옮김). 동물 이름은 사진 캡션으로만 나온다."
    }
  },
  {
    "id": "s32-mid-o2-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 9,
      "page": 2,
      "sourceId": "sci-32-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "잠자리와 나비의 공통점",
      "concept": "잠자리와 나비는 곤충이라 몸이 머리·가슴·배 세 부분으로 나뉜다."
    },
    "prompt": "잠자리와 나비의 공통점이 아닌 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 날개가 두 쌍 있습니다.",
        "ㄴ. 다리가 세 쌍 있습니다.",
        "ㄷ. 몸이 비교적 가볍습니다.",
        "ㄹ. 몸이 머리와 가슴 두 부분으로 구분됩니다."
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
        "몸이 머리와 가슴 두 부분으로 구분됩니다."
      ]
    },
    "explanation": "잠자리와 나비는 몸이 머리, 가슴, 배의 세 부분으로 구분됩니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「아닌」에 밑줄."
    }
  },
  {
    "id": "s32-mid-o2-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 10,
      "page": 3,
      "sourceId": "sci-32-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "사막에 사는 낙타의 특징",
      "concept": "낙타는 넓은 발바닥, 지방을 저장하는 혹, 여닫는 콧구멍으로 사막에 적응했다."
    },
    "prompt": "낙타의 특징으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "발바닥이 넓습니다.",
      "등에 혹이 있습니다.",
      "긴 다리가 두 쌍 있습니다.",
      "콧구멍을 여닫을 수 있습니다.",
      "몸에 비해 큰 귀를 가지고 있습니다."
    ],
    "figure": "assets/bank/s32-mid/s2-q10.webp",
    "figureNote": "낙타 사진(쌍봉낙타 어미와 새끼).",
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
    "explanation": "낙타는 발바닥이 넓어 모래에 잘 빠지지 않습니다. 등에 있는 혹에는 지방이 저장되어 있어 며칠은 먹이를 먹지 않아도 살 수 있습니다. 콧구멍을 여닫을 수 있어 바람이 불어도 모래가 들어가지 않습니다.",
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
    "id": "s32-mid-o2-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 11,
      "page": 3,
      "sourceId": "sci-32-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "동물의 특징을 활용한 예",
      "concept": "산천어의 부드러운 곡선 몸 모양을 본떠 고속열차의 앞부분을 만들었다."
    },
    "prompt": "우리 주변 동물과 그 동물의 특징을 활용한 예를 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "오리 - 접착제",
      "수리 – 물갈퀴",
      "전복 - 흡착판",
      "두더지 – 수영복",
      "산천어 – 고속열차"
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
    "explanation": "산천어의 몸이 부드러운 곡선 모양으로 물속에서 빨리 헤엄쳐 다닐 수 있는 특징을 활용해 앞부분이 부드러운 곡선 모양인 고속열차를 만들었습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "짝 표시가 섞여 있음: ①·③은 짧은 하이픈(-), ②·④·⑤는 긴 대시(–)로 인쇄됨. 그대로 옮김."
    }
  },
  {
    "id": "s32-mid-o2-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 12,
      "page": 3,
      "sourceId": "sci-32-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "운동장 흙과 화단 흙의 비교",
      "concept": "화단 흙은 운동장 흙보다 색이 어둡고 알갱이 크기가 다양하며 만지면 부드럽다."
    },
    "prompt": "다음은 운동장 흙과 화단 흙을 관찰한 결과를 표로 정리한 것입니다. ㄱ과 ㄴ 중 화단 흙의 특징에 해당하는 것을 골라 기호를 쓰세요.",
    "givens": {
      "표": {
        "구분": [
          "색깔",
          "알갱이의 크기",
          "만졌을 때의 느낌"
        ],
        "ㄱ": [
          "밝은 갈색",
          "비교적 큼.",
          "거칢."
        ],
        "ㄴ": [
          "어두운 갈색",
          "큰 것도 있고, 작은 것도 있음.",
          "약간 부드러움."
        ]
      }
    },
    "choices": null,
    "figure": "assets/bank/s32-mid/s2-q12.webp",
    "figureNote": "관찰 결과 표(구분 / ㄱ / ㄴ × 색깔·알갱이의 크기·만졌을 때의 느낌). 내용은 givens에 옮김.",
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
    "explanation": "화단 흙은 어두운 갈색으로, 알갱이의 크기가 다양합니다. 또한, 만졌을 때는 약간 부드럽습니다.",
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
    "id": "s32-mid-o2-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 13,
      "page": 3,
      "sourceId": "sci-32-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흙의 물에 뜨는 물질 비교 실험의 다르게 할 조건",
      "concept": "운동장 흙과 화단 흙을 비교하는 실험에서는 흙의 종류만 다르게 한다."
    },
    "prompt": "운동장 흙과 화단 흙에 물을 붓고 저은 다음 시간이 지난 후 물에 뜨는 물질을 비교해 보는 실험을 하였습니다. 이 실험에서 다르게 해야 하는 조건을 고르세요.",
    "givens": null,
    "choices": [
      "물의 양",
      "흙의 양",
      "물의 온도",
      "흙의 종류",
      "막대를 젓는 횟수"
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
    "explanation": "흙의 종류에 따른 뜬 물질을 비교하는 실험이므로 흙의 종류만 다르게 하고, 나머지 조건들은 같게 해 주어야 합니다.",
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
    "id": "s32-mid-o2-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 14,
      "page": 3,
      "sourceId": "sci-32-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "흙이 만들어지는 과정",
      "concept": "흙은 바위나 돌이 부서진 알갱이와 생물이 썩어 생긴 부식물이 섞여 만들어진다."
    },
    "prompt": "빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "바위나 돌이 작게 부서진 알갱이와 □(이)가 썩어서 만들어진 부식물이 섞여 흙이 됩니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "생물",
      "accepted": [
        "생물"
      ]
    },
    "explanation": "바위나 돌이 작게 부서진 알갱이와 생물이 썩어 생긴 부식물이 섞여 흙이 됩니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 빈칸은 네모 칸으로 인쇄돼 □로 적음."
    }
  },
  {
    "id": "s32-mid-o2-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 15,
      "page": 3,
      "sourceId": "sci-32-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흙 언덕 실험으로 본 흐르는 물의 작용",
      "concept": "흐르는 물은 높은 곳을 깎고 낮은 곳에 흙을 쌓아 지표를 바꾼다."
    },
    "prompt": "다음은 색 모래를 뿌린 흙 언덕의 위쪽에서 물을 흘려 보낸 결과입니다. 이에 대한 설명으로 옳지 않은 것을 모두 고르세요. (정답 2 개)",
    "givens": {
      "지문": "그림 표시: 흙이 깎인 곳(언덕 위쪽), 흙이 쌓인 곳(언덕 아래쪽)"
    },
    "choices": [
      "흐르는 물은 지표를 변화시킬 수 없음을 알 수 있습니다.",
      "흙 언덕 위쪽에서는 침식 작용이 활발하게 일어났습니다.",
      "흙 언덕 아래쪽에 있는 색 모래는 원래 위쪽에 있던 것입니다.",
      "흐르는 물에 의해 위쪽에 있던 흙이 아래쪽으로 이동하였습니다.",
      "흙 언덕 아래쪽에서는 침식 작용이 가장 활발하게 일어났습니다."
    ],
    "figure": "assets/bank/s32-mid/s2-q15.webp",
    "figureNote": "쟁반 위 흙 언덕에 색 모래(파란색)를 뿌리고 위에서 물을 흘린 결과 그림. 위쪽에 「흙이 깎인 곳」, 아래쪽 물이 고인 곳에 「흙이 쌓인 곳」 표시.",
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
    "explanation": "흐르는 물이 흙 언덕 위쪽을 깎고, 깎인 흙을 흙 언덕 아래쪽으로 운반하여 쌓아놓은 것을 통해 흐르는 물이 지표를 변화시킬 수 있음을 알 수 있습니다. 흙 언덕 아래쪽에서는 퇴적 작용이 가장 활발하게 일어났습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「않은」에 밑줄. givens의 「그림 표시」 줄은 그림 속 라벨을 옮긴 것(인쇄된 문장이 아님)."
    }
  },
  {
    "id": "s32-mid-o2-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 16,
      "page": 4,
      "sourceId": "sci-32-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "경사에 따른 침식과 퇴적",
      "concept": "경사가 급한 곳은 침식 작용이, 완만한 곳은 퇴적 작용이 활발하다."
    },
    "prompt": "흐르는 물에 의한 지표의 변화에 대한 설명으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 침식 작용이 일어나는 곳에서는 퇴적 작용이 일어나지 않습니다.",
        "ㄴ. 경사가 급한 곳에서는 퇴적 작용보다 침식 작용이 활발하게 일어납니다.",
        "ㄷ. 경사가 완만한 곳에서는 운반 작용보다 침식 작용이 활발하게 일어납니다."
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
        "경사가 급한 곳에서는 퇴적 작용보다 침식 작용이 활발하게 일어납니다."
      ]
    },
    "explanation": "경사가 급한 곳에서는 침식 작용이 활발하게 일어나고, 경사가 완만한 곳에서는 퇴적 작용이 활발하게 일어납니다.",
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
    "id": "s32-mid-o2-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 17,
      "page": 4,
      "sourceId": "sci-32-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "계곡을 볼 수 있는 곳(강 상류)",
      "concept": "큰 바위 사이로 물이 빠르게 흐르는 계곡은 강 상류에서 볼 수 있다."
    },
    "prompt": "ㄱ과 ㄴ 중에서 다음과 같은 모습을 많이 볼 수 있는 곳을 골라 기호를 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s32-mid/s2-q17.webp",
    "figureNote": "위: 큰 바위 사이로 물이 흐르는 계곡 사진. 아래: 산에서 바다까지 강이 흐르는 지형 단면 그림, 상류 쪽(바위가 있는 산 위)에 ㄱ, 하류 쪽(바다 근처 굽이진 강)에 ㄴ 표시.",
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
    "explanation": "계곡은 강 상류에서 많이 볼 수 있습니다.",
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
    "id": "s32-mid-o2-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 18,
      "page": 4,
      "sourceId": "sci-32-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "강 상류와 하류의 모습",
      "concept": "강 상류는 하류보다 강폭이 좁고 경사가 급하며 침식 작용이 활발하다."
    },
    "prompt": "강 주변의 모습에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "강 상류가 하류보다 강폭이 넓습니다.",
      "강 상류가 하류보다 강의 경사가 급합니다.",
      "강 상류가 하류보다 퇴적 작용이 활발합니다.",
      "강 상류가 하류보다 모래와 흙의 양이 더 많습니다.",
      "강 하류에서는 주로 큰 바위나 돌을 볼 수 있습니다."
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
    "explanation": "강 상류는 하류보다 강폭이 좁고, 강의 경사가 급합니다. 그리고 강 하류보다 침식 작용이 활발하며, 주로 바위나 큰 돌을 볼 수 있습니다.",
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
    "id": "s32-mid-o2-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 19,
      "page": 4,
      "sourceId": "sci-32-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "바닷물의 침식·퇴적 작용으로 생긴 지형",
      "concept": "바닷물의 침식으로 절벽·동굴·구멍 뚫린 바위가, 퇴적으로 갯벌·모래사장이 생긴다."
    },
    "prompt": "바닷물의 작용과 그 작용에 의해 만들어지는 지형을 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "절벽 / 갯벌",
      "동굴 / 절벽",
      "갯벌 / 동굴",
      "모래사장 / 갯벌",
      "모래사장 / 구멍 뚫린 바위"
    ],
    "figure": "assets/bank/s32-mid/s2-q19.webp",
    "figureNote": "보기 표: 열 머리 「침식 작용」·「퇴적 작용」(밑줄), 행 ①~⑤.",
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
    "explanation": "바닷물의 침식 작용으로 절벽, 동굴, 구멍 뚫린 바위가 만들어지고 퇴적 작용으로 갯벌이나 모래사장이 만들어집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기가 표로 인쇄됨: 열 머리는 「침식 작용」 / 「퇴적 작용」. 각 보기를 「① 침식 / 퇴적」 꼴로 적음."
    }
  },
  {
    "id": "s32-mid-o2-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 20,
      "page": 4,
      "sourceId": "sci-32-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅵ. 중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E3",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "흙이 잘 깎이는 곳",
      "concept": "나무나 풀, 시설물이 덮지 않은 맨땅은 비가 오면 흙이 쉽게 깎여 나간다."
    },
    "prompt": "비가 많이 내리는 날에 흙이 가장 잘 깎이는 곳을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 나무나 풀이 흙을 덮고 있는 곳",
        "ㄴ. 흙을 덮어주는 시설물이 설치된 곳",
        "ㄷ. 벌목으로 나무가 사라져 맨땅이 노출된 곳"
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
        "벌목으로 나무가 사라져 맨땅이 노출된 곳"
      ]
    },
    "explanation": "벌목으로 나무가 사라져서 맨땅이 노출되면 흙이 더 쉽게 떠내려갑니다.",
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
