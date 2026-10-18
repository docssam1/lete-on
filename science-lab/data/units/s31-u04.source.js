// 3-1 Ⅳ 생물의 한살이 — 교재 원문 41문항. 교재별 실제 출처는 각 sourceRef에 보존하며 교사용 정답·해설과 대조했다.
// 그림은 교재에서 잘라 낸 것(assets/bank/s31-u04/). 인쇄 해설과 보충 설명은 [자료 검토] 표시로 구분한다.
export const source = [
  {
    "id": "s31-u04-o1-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 1,
      "page": 24,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "개념 확인",
      "originalNo": "3"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "동물의 자라는 모습과 번식 방식",
      "concept": "동물의 자라는 모습과 번식 방식"
    },
    "prompt": "다음 중 갓 태어난 강아지와 다 자란 개의 특징을 바르게 비교한 것은 어느 것입니까?",
    "givens": {
      "표의 열": [
        "갓 태어난 강아지",
        "다 자란 개"
      ]
    },
    "choices": [
      "눈이 감겨 있음. / 눈으로 볼 수 있음.",
      "먹이를 먹음. / 젖을 먹음.",
      "이빨이 날카로움. / 씹지 못함.",
      "작은 소리도 잘 들음. / 귀가 막혀 있음.",
      "걷거나 달릴 수 있음. / 일어설 수 없음."
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
    "explanation": "갓 태어난 강아지는 눈이 감겨 있고, 귀도 막혀 있으며, 이빨이 없어 씹지 못한다. 또한, 다리에 힘이 없어 일어설 수 없다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "원문의 두 열 표를 각 보기에서 /로 구분했다. 내용과 열의 순서는 그대로다."
    }
  },
  {
    "id": "s31-u04-o1-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 2,
      "page": 24,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "개념 확인",
      "originalNo": "4"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "동물의 자라는 모습과 번식 방식",
      "concept": "동물의 자라는 모습과 번식 방식"
    },
    "prompt": "다음 중 병아리와 닭에 대한 설명으로 바른 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "병아리는 엄마의 젖을 먹고 자란다.",
      "병아리와 닭 모두 암수 구분이 뚜렷하다.",
      "어미닭이 알을 품은 지 30일이 지나면 병아리가 알을 깨고 나온다.",
      "병아리는 이빨이 없지만 자라면서 이빨이 생겨 먹이를 씹을 수 있다.",
      "병아리 몸은 솜털로 덮여 있고, 자라면서 솜털이 깃털로 바뀐다."
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
    "explanation": "병아리는 어미 닭을 따라 다니며 먹이를 찾아 먹고, 암수 구분이 잘 되지 않고, 알을 품은 지 21일이 지나면 알을 깨고 나온다. 닭은 이빨이 없고, 부화 후 30일이 지나면 온몸이 깃털로 덮인다.\n[자료 검토] 원문의 기간은 교재 관찰 사례의 설명이에요. 자라는 속도는 개체와 기르는 조건에 따라 달라질 수 있어요.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "해설의 21일·30일은 원문 표현이다. 자람의 기간은 조건과 개체에 따라 달라지므로 고정 기간 암기 문항으로 확장하지 않는다."
    }
  },
  {
    "id": "s31-u04-o1-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 3,
      "page": 25,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "개념 확인",
      "originalNo": "7"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "동물의 자라는 모습과 번식 방식",
      "concept": "동물의 자라는 모습과 번식 방식"
    },
    "prompt": "개구리의 한살이에 대한 설명으로 바른 것을 모두 고르시오.",
    "givens": null,
    "choices": [
      "올챙이는 허파로 숨을 쉰다.",
      "개구리는 땅 위에 둥지를 짓고 알을 낳는다.",
      "올챙이는 자라면서 뒷다리가 먼저 나온다.",
      "땅 위로 올라온 개구리는 다시 물로 돌아가지 않는다.",
      "다 자란 개구리는 짝짓기를 하고 알을 낳아 번식한다."
    ],
    "figure": "assets/bank/s31-u04/s1-q3.webp",
    "figureNote": "개구리 사진",
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
    "explanation": "올챙이는 아가미로 숨을 쉬고, 개구리는 허파와 피부로 숨을 쉬며 개구리는 물과 땅을 오가며 생활하며 개구리는 투명한 우무질로 쌓인 알을 물속에 낳는다.\n[자료 검토] 교재에서 설명하는 개구리의 한살이 사례로 읽어요. 사진은 개구리의 예시이며 모든 개구리 종의 산란 장소가 같다는 뜻은 아니에요.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "해설의 ‘쌓인’은 인쇄본대로 보존했다. 모든 개구리 종의 산란 장소로 일반화하지 않는다."
    }
  },
  {
    "id": "s31-u04-o1-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 4,
      "page": 25,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "개념 확인",
      "originalNo": "8"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "동물 관찰 계획과 생명 존중",
      "concept": "동물 관찰 계획과 생명 존중"
    },
    "prompt": "동물의 한살이를 관찰하고 기록할 내용으로 적당하지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "짝짓기 할 때의 행동",
      "새끼나 알을 낳는 모습",
      "자라면서 변화되는 모습",
      "시간이 지나면서 자라는 정도",
      "먹이를 먹지 않고 견딜 수 있는 기간"
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
    "explanation": "동물의 한살이를 관찰할 때는 자연 상태에서와 같은 조건을 만들어 주는 것이 중요하다. 의도적으로 괴롭히거나 나쁜 자극을 주는 것은 바람직하지 않다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설"
    }
  },
  {
    "id": "s31-u04-o1-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 5,
      "page": 26,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "개념 응용",
      "originalNo": "1"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "동물의 자라는 모습과 번식 방식",
      "concept": "동물의 자라는 모습과 번식 방식"
    },
    "prompt": "다음에 주어진 동물들을 보고, 이 동물들의 공통점은 무엇인지 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s31-u04/s1-q5.webp",
    "figureNote": "사자·개·토끼 사진과 이름",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "• 몸이 털가죽으로 덮여 있다.\n• 암수가 만나 짝짓기를 하고, 일정 시간이 지나면 새끼를 낳는다.\n• 새끼에게 젖을 먹인다.\n• 새끼와 어미의 모습이 많이 닮아 있다.",
      "rubric": {
        "required": [
          "제시한 동물의 공통 특징 한 가지"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": []
      }
    },
    "explanation": "새끼를 낳는 동물은 젖을 먹여 새끼를 기르고, 새끼와 어미의 모습이 많이 닮아 있다.\n[자료 검토] 제시한 사자·개·토끼의 공통점을 묻는 문제예요. 새끼를 낳는 모든 동물에게 젖먹이기·털이 있다는 뜻으로 넓히지 않아요. 예시 중 타당한 공통점 한 가지를 인정해요.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "예시 답 4개는 인쇄본의 대안 목록이며 4개를 모두 요구하는 공식 배점표가 아니다. 해설은 제시된 사자·개·토끼의 공통점으로 한정해야 하며 모든 태생 동물에 일반화하지 않는다."
    }
  },
  {
    "id": "s31-u04-o1-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 6,
      "page": 29,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "창의사고력",
      "originalNo": "3(1)"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "동물의 자라는 모습과 번식 방식",
      "concept": "동물의 자라는 모습과 번식 방식"
    },
    "prompt": "위 동물들의 공통점을 한살이 과정과 관련지어 쓰시오.",
    "givens": {
      "지문": "다음은 우리 주위에서 볼 수 있는 동물들입니다. 물음에 답하시오."
    },
    "choices": null,
    "figure": "assets/bank/s31-u04/s1-q6.webp",
    "figureNote": "닭·붕어·개구리 사진과 이름",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "알을 낳는다. 알에서 새끼가 태어난다.",
      "rubric": {
        "required": [
          "알을 낳거나 알에서 새끼가 나옴"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": []
      }
    },
    "explanation": "",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "정답만 있고 별도 해설·배점표는 없다. 두 문장은 같은 번식 방식의 대안 표현으로 본다."
    }
  },
  {
    "id": "s31-u04-o1-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 7,
      "page": 47,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "워크북 · 동물의 한살이 (1)",
      "originalNo": "6"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "동물 관찰 계획과 생명 존중",
      "concept": "동물 관찰 계획과 생명 존중"
    },
    "prompt": "다음 중 한살이를 관찰할 동물을 정할 때 생각해야 할 점이 아닌 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "기를 장소",
      "기르는 방법",
      "적당한 먹이",
      "동물을 팔 곳",
      "한살이 기간"
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
    "explanation": "한살이를 관찰할 동물을 정할 때 기를 장소, 기르는 방법, 기르는 비용 등을 생각한다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설"
    }
  },
  {
    "id": "s31-u04-o1-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 8,
      "page": 47,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "워크북 · 동물의 한살이 (1)",
      "originalNo": "8"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "동물의 자라는 모습과 번식 방식",
      "concept": "동물의 자라는 모습과 번식 방식"
    },
    "prompt": "다음은 개구리의 한살이를 나타낸 것입니다. 잘못된 부분의 기호를 쓰고, 올바르게 고치시오.",
    "givens": {
      "보기": [
        "㉠ 우무질에 싸여 있는 알에서 올챙이가 나옵니다.",
        "㉡ 올챙이의 뒷다리가 나오고, 앞다리가 나옵니다.",
        "㉢ 꼬리가 길어지고 허파와 피부로 숨을 쉽니다."
      ]
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "㉢, 꼬리가 짧아지고 허파와 피부로 숨을 쉰다.",
      "rubric": {
        "required": [
          "잘못된 부분 ㉢",
          "꼬리가 짧아지거나 없어짐"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": []
      }
    },
    "explanation": "꼬리가 짧아지면서 없어져 개구리가 된다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "정정 대상은 ㉢의 꼬리 변화다. 이미 제시된 호흡 방식을 다시 쓰는 것을 별도 필수 요소로 요구하지 않는다."
    }
  },
  {
    "id": "s31-u04-o2-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 1,
      "page": 36,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "개념 확인",
      "originalNo": "1"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "배추흰나비의 먹이와 관찰 방법",
      "concept": "배추흰나비의 먹이와 관찰 방법"
    },
    "prompt": "사육 상자에서 배추흰나비를 기를 때 주의할 점이 아닌 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "애벌레를 옮길 때는 손으로 만지지 않는다.",
      "먹이를 줄 때는 표면에 물기를 없애고 준다.",
      "알을 손으로 만졌을 때는 비누로 손을 씻는다.",
      "애벌레가 허물을 벗을 때 핀셋으로 벗겨 준다.",
      "애벌레가 바닥에 떨어졌을 때에는 배추잎을 애벌레 앞에다 놓아 애벌레가 스스로 기어오르도록 한다."
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
    "explanation": "애벌레가 허물을 벗거나 번데기나 나비로 될 때 충격을 주면 죽을 수 있다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설"
    }
  },
  {
    "id": "s31-u04-o2-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 2,
      "page": 36,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "개념 확인",
      "originalNo": "2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "배추흰나비의 먹이와 관찰 방법",
      "concept": "배추흰나비의 먹이와 관찰 방법"
    },
    "prompt": "다음 중 배추흰나비를 기르면서 관찰해야 할 것이 아닌 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "허물을 벗으며 자라는 모습",
      "먹이를 먹고 똥을 누는 모습",
      "알에서 나와 애벌레가 되는 과정",
      "나비가 되어 나오는 모습과 나는 모습",
      "배추흰나비가 새끼에게 젖을 주는 모습"
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
    "explanation": "배추흰나비는 알을 낳는 동물로, 새끼에게 젖을 주지 않는다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설"
    }
  },
  {
    "id": "s31-u04-o2-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 3,
      "page": 37,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "개념 확인",
      "originalNo": "5"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "배추흰나비 각 단계의 관찰 특징",
      "concept": "배추흰나비 각 단계의 관찰 특징"
    },
    "prompt": "다음 중 배추흰나비 번데기의 모습으로 옳지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "길이가 25mm 정도이다.",
      "움직이고 먹이를 먹는다.",
      "초록에서 연한 갈색으로 변한다.",
      "머리, 가슴, 배의 구분은 되지만 뚜렷하지는 않다.",
      "시간이 지나면 표면이 투명해지고, 속의 나비가 보이기 시작한다."
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
    "explanation": "번데기는 움직이지 않고 아무것도 먹지 않는다.\n[자료 검토] 원문의 “움직이지 않는다”는 먹이를 찾아 돌아다니지 않는 모습과 구분해 읽어요. 번데기가 전혀 몸을 움직일 수 없다는 뜻으로 일반화하지 않아요.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "‘움직이지 않는다’는 원문 표현이다. 번데기는 먹이를 찾아 돌아다니지 않지만 자극에 반응해 몸을 움직일 수 있다. 수정 없이 게시하지 말고 원문과 구분한 보충 설명을 붙인다. 길이·색은 관찰 조건과 개체에 따라 달라질 수 있다."
    }
  },
  {
    "id": "s31-u04-o2-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 4,
      "page": 37,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "개념 확인",
      "originalNo": "6"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "배추흰나비 각 단계의 관찰 특징",
      "concept": "배추흰나비 각 단계의 관찰 특징"
    },
    "prompt": "배추흰나비 성충의 생김새에 대한 설명으로 옳은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "가슴에 3쌍의 날개가 있다.",
      "머리에 1쌍의 겹눈이 있다.",
      "머리에 1개의 더듬이가 있다.",
      "배에 4쌍의 다리가 붙어 있다.",
      "몸은 머리와 가슴, 배의 두 부분으로 나뉜다."
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
    "explanation": "배추흰나비 성충은 가슴에 2쌍의 날개, 3쌍의 다리가 붙어 있으며, 머리에는 1쌍의 더듬이가 있고, 몸은 머리, 가슴, 배의 세 부분으로 나뉜다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설"
    }
  },
  {
    "id": "s31-u04-o2-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 5,
      "page": 37,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "개념 확인",
      "originalNo": "7"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "여러 곤충의 한살이 비교",
      "concept": "여러 곤충의 한살이 비교"
    },
    "prompt": "다음 중 배추흰나비의 한살이 과정을 바르게 나타낸 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "알 → 애벌레 → 성충",
      "알 → 번데기 → 성충",
      "알 → 애벌레 → 번데기 → 성충",
      "알 → 번데기 → 애벌레 → 성충",
      "알 → 번데기 → 성충 → 애벌레"
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
    "explanation": "배추흰나비는 완전 탈바꿈을 한다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설"
    }
  },
  {
    "id": "s31-u04-o2-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 6,
      "page": 37,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "개념 확인",
      "originalNo": "8"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "여러 곤충의 한살이 비교",
      "concept": "여러 곤충의 한살이 비교"
    },
    "prompt": "다음과 같은 한살이 과정을 거치는 곤충은 어느 것입니까?",
    "givens": {
      "지문": "알 → 애벌레 → 성충"
    },
    "choices": [
      "모기",
      "파리",
      "풍뎅이",
      "사마귀",
      "사슴벌레"
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
    "explanation": "불완전 탈바꿈을 하는 곤충에는 메뚜기, 사마귀, 매미 등이 있다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설"
    }
  },
  {
    "id": "s31-u04-o2-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 7,
      "page": 38,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "개념 응용",
      "originalNo": "3"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "배추흰나비 각 단계의 관찰 특징",
      "concept": "배추흰나비 각 단계의 관찰 특징"
    },
    "prompt": "다음은 배추흰나비 성충의 모습입니다. 배추흰나비 성충이 애벌레나 번데기와 다른 점을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s31-u04/s2-q7.webp",
    "figureNote": "꽃에 앉은 배추흰나비 성충 사진",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "2쌍의 날개가 있어 날 수 있다. 긴 대롱 모양의 입이 있다. 등",
      "rubric": {
        "required": [
          "성충의 관찰 가능한 특징 한 가지"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": []
      }
    },
    "explanation": "배추흰나비의 성충은 몸이 머리, 가슴, 배의 세 부분으로 구분되고, 더듬이와 날개, 다리 등이 있다.\n[자료 검토] 교사용 Tip은 성충의 특징을 폭넓게 인정하지만 발문은 다른 점을 물어요. 날개·긴 대롱 모양의 입처럼 분명한 차이를 찾아요. 몸이 머리·가슴·배로 나뉘는 것은 애벌레에도 있어 차이를 설명하는 근거가 되지 않아요. 아래 채점 요소는 인쇄 배점표가 아닌 발문에 따른 학습용 기준이에요.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "강의 Tip: ‘성충의 특징을 썼으면 모두 정답으로 인정한다.’ 별도 배점표는 없다. 두 예시를 모두 쓰는 것으로 강화하지 않는다. 몸의 세 부분 구분처럼 애벌레와 공통인 특징은 발문과 긴장이 있어 검수 기록에 남긴다."
    }
  },
  {
    "id": "s31-u04-o2-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 8,
      "page": 48,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "워크북 · 동물의 한살이 (2)",
      "originalNo": "1"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "배추흰나비의 먹이와 관찰 방법",
      "concept": "배추흰나비의 먹이와 관찰 방법"
    },
    "prompt": "다음과 같이 배추흰나비를 기를 사육 상자를 꾸몄습니다. 배춧잎 대신 사용할 수 있는 먹이로 적당한 것을 모두 고르시오.",
    "givens": null,
    "choices": [
      "무",
      "케일",
      "옥수수",
      "뽕나무",
      "산초나무"
    ],
    "figure": "assets/bank/s31-u04/s2-q8.webp",
    "figureNote": "방충망을 씌운 배추흰나비 사육 상자 사진",
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
    "explanation": "배추흰나비 애벌레의 먹이로 적당한 것은 무, 케일, 양배추, 갓, 유채 등이다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설"
    }
  },
  {
    "id": "s31-u04-o2-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 9,
      "page": 48,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "워크북 · 동물의 한살이 (2)",
      "originalNo": "2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "배추흰나비 각 단계의 관찰 특징",
      "concept": "배추흰나비 각 단계의 관찰 특징"
    },
    "prompt": "다음 중 배추흰나비의 알과 애벌레에 대한 설명으로 옳지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "애벌레는 초록색이다.",
      "알은 연한 노란색이다.",
      "알은 줄무늬가 있는 옥수수처럼 생겼다.",
      "알은 4번의 허물의 벗으며 점점 커지다가 애벌레로 나온다.",
      "애벌레의 고리 모양의 마디가 있으며 긴 원통형으로 생겼다."
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
    "explanation": "4번의 허물을 벗는 것은 애벌레이다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "보기④ ‘허물의’, 보기⑤ ‘애벌레의’는 인쇄본 그대로다. 허물벗기 횟수는 원문 관찰 사례이며 곤충 전체에 일반화하지 않는다."
    }
  },
  {
    "id": "s31-u04-o2-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 10,
      "page": 48,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "워크북 · 동물의 한살이 (2)",
      "originalNo": "3"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "배추흰나비 각 단계의 관찰 특징",
      "concept": "배추흰나비 각 단계의 관찰 특징"
    },
    "prompt": "다음 중 배추흰나비 애벌레가 허물을 벗는 이유는 무엇입니까?",
    "givens": null,
    "choices": [
      "잠을 자기 위해",
      "숨을 쉬기 위해",
      "먹이를 먹기 위해",
      "더 크게 자라기 위해",
      "적의 눈에 띄지 않게 하기 위해"
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
    "explanation": "애벌레는 4번 허물을 벗고 약 3cm까지 자라는데, 허물을 벗으면서 애벌레의 크기가 커진다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설"
    }
  },
  {
    "id": "s31-u04-o2-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 11,
      "page": 48,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "워크북 · 동물의 한살이 (2)",
      "originalNo": "4"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "배추흰나비 각 단계의 관찰 특징",
      "concept": "배추흰나비 각 단계의 관찰 특징"
    },
    "prompt": "배추흰나비 애벌레와 번데기에 대한 설명으로 옳지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "번데기 표면은 딱딱하다.",
      "애벌레는 초록색이며 부드럽다.",
      "애벌레는 이곳저곳 자유롭게 움직인다.",
      "애벌레는 몸에 빽빽하게 털이 나 있다.",
      "번데기는 4번의 허물을 벗으며 크게 자란다."
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
    "explanation": "배추흰나비 애벌레는 4번의 허물을 벗으며 크게 자란다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설"
    }
  },
  {
    "id": "s31-u04-o2-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 12,
      "page": 49,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "워크북 · 동물의 한살이 (2)",
      "originalNo": "8"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "여러 곤충의 한살이 비교",
      "concept": "여러 곤충의 한살이 비교"
    },
    "prompt": "한살이 과정에서 번데기 과정을 거치는 곤충을 3가지 이상 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "모기, 풍뎅이, 배추흰나비, 사슴벌레 등",
      "rubric": {
        "required": [
          "번데기를 거치는 서로 다른 곤충 세 가지"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": []
      }
    },
    "explanation": "번데기 과정을 거치는 것을 완전 탈바꿈이라고 한다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "세 가지 이상의 서로 다른 곤충을 요구한다. 예시 네 가지를 모두 요구하지 않으며 같은 곤충의 다른 이름은 중복으로 센다."
    }
  },
  {
    "id": "s31-u04-o2-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 13,
      "page": 39,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "창의사고력",
      "originalNo": "1(1)"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "배추흰나비 각 단계의 관찰 특징",
      "concept": "배추흰나비 각 단계의 관찰 특징"
    },
    "prompt": "(가)와 (나)는 배추흰나비의 한살이 과정에서 볼 수 있는 모습입니다. 각각의 이름을 쓰시오.",
    "givens": {
      "지문": "배추흰나비의 알을 채집하여 기르면서 성장하는 과정을 관찰하였습니다. 배추흰나비를 기르는 사육 상자에서 그림과 같은 모습들을 관찰할 수 있었습니다. 물음에 답하시오."
    },
    "choices": null,
    "figure": "assets/bank/s31-u04/s2-q13.webp",
    "figureNote": "(가) 번데기와 (나) 애벌레의 사진",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(가): 번데기, (나): 애벌레(유충)",
      "accepted": [
        "(가): 번데기, (나): 애벌레(유충)",
        "번데기, 애벌레",
        "번데기, 유충",
        "가 번데기 나 애벌레",
        "가 번데기 나 유충",
        "가: 번데기, 나: 애벌레",
        "가: 번데기, 나: 유충"
      ]
    },
    "explanation": "",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설"
    }
  },
  {
    "id": "s31-u04-o2-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 14,
      "page": 39,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "창의사고력",
      "originalNo": "1(2)"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "배추흰나비 각 단계의 관찰 특징",
      "concept": "배추흰나비 각 단계의 관찰 특징"
    },
    "prompt": "다음 표에 (가)와 (나)의 먹이와 움직임의 차이가 드러나도록 비교하여 쓰시오.",
    "givens": {
      "지문": "배추흰나비의 알을 채집하여 기르면서 성장하는 과정을 관찰하였습니다. 배추흰나비를 기르는 사육 상자에서 그림과 같은 모습들을 관찰할 수 있었습니다. 물음에 답하시오.",
      "표": {
        "머리": [
          "구분",
          "(가)",
          "(나)"
        ],
        "행": [
          [
            "먹이",
            "[ ]",
            "[ ]"
          ],
          [
            "움직임",
            "[ ]",
            "[ ]"
          ]
        ]
      }
    },
    "choices": null,
    "figure": "assets/bank/s31-u04/s2-q13.webp",
    "figureNote": "(가) 번데기와 (나) 애벌레의 사진",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "(가) 먹이: 먹지 않는다. 움직임: 움직이지 않는다.\n(나) 먹이: (배추 잎을) 먹는다. 움직임: 움직인다.",
      "rubric": {
        "required": [
          "번데기는 먹지 않고 애벌레는 먹는 차이",
          "번데기는 한곳에 붙고 애벌레는 움직이는 차이"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": []
      }
    },
    "explanation": "\n[자료 검토] 번데기는 먹이를 먹거나 찾아 돌아다니지 않고 애벌레는 잎을 먹으며 기어 다녀요. 원문의 “움직이지 않는다”를 전혀 몸을 움직일 수 없다는 뜻으로 넓히지 않아요.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "원문의 네 칸 응답을 글로 비교하는 서술형으로 입력받는다. 원문의 ‘번데기는 움직이지 않는다’는 표현을 그대로 보존했다. 돌아다니지 않는 것과 몸을 전혀 움직일 수 없는 것은 구별하여 보충 설명해야 한다. 공식 배점표는 없다."
    }
  },
  {
    "id": "s31-u04-o2-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 15,
      "page": 39,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "창의사고력",
      "originalNo": "1(3)"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "배추흰나비 각 단계의 관찰 특징",
      "concept": "배추흰나비 각 단계의 관찰 특징"
    },
    "prompt": "배추흰나비의 한살이 과정에서 (가)와 (나)의 관계를 쓰시오.",
    "givens": {
      "지문": "배추흰나비의 알을 채집하여 기르면서 성장하는 과정을 관찰하였습니다. 배추흰나비를 기르는 사육 상자에서 그림과 같은 모습들을 관찰할 수 있었습니다. 물음에 답하시오."
    },
    "choices": null,
    "figure": "assets/bank/s31-u04/s2-q13.webp",
    "figureNote": "(가) 번데기와 (나) 애벌레의 사진",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "(나)가 변하여 (가)가 된다.",
      "rubric": {
        "required": [
          "애벌레에서 번데기로 변하는 방향"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": []
      }
    },
    "explanation": "다 자란 애벌레는 먹는 것을 중단하고 몸 색깔이 맑아진다. 안전한 곳을 찾으면 입에서 실을 내어 고정한 후, 약 12시간이 지나면 허물을 벗고 번데기로 변한다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "같은 쪽 공통 사진을 함께 제시한다. 애벌레가 번데기로 변하는 방향만으로 충분하며 12시간이나 실을 내는 과정을 추가 필수로 요구하지 않는다."
    }
  },
  {
    "id": "s31-u04-o2-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 16,
      "page": 40,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "창의사고력",
      "originalNo": "2(1)"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "여러 곤충의 한살이 비교",
      "concept": "여러 곤충의 한살이 비교"
    },
    "prompt": "나비와 같은 쪽에 분류해야 할 동물들을 2가지 쓰시오.",
    "givens": {
      "지문": "다음 동물들을 한살이 과정의 차이에 따라 2종류로 분류하려고 합니다. 물음에 답하시오."
    },
    "choices": null,
    "figure": "assets/bank/s31-u04/s2-q16.webp",
    "figureNote": "개미·나비·매미·사마귀·잠자리·초파리 사진과 이름",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "개미, 초파리",
      "accepted": [
        "개미, 초파리",
        "초파리, 개미",
        "개미와 초파리",
        "초파리와 개미",
        "개미하고 초파리",
        "초파리하고 개미"
      ]
    },
    "explanation": "나비, 개미, 초파리는 완전 탈바꿈을 한다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설"
    }
  },
  {
    "id": "s31-u04-o2-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 17,
      "page": 40,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "창의사고력",
      "originalNo": "2(2)"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "여러 곤충의 한살이 비교",
      "concept": "여러 곤충의 한살이 비교"
    },
    "prompt": "위의 (1)번 문제의 답과 같이 동물들을 2종류로 나눌 수 있는 한살이 과정의 차이점을 구체적으로 쓰시오.",
    "givens": {
      "지문": "다음 동물들을 한살이 과정의 차이에 따라 2종류로 분류하려고 합니다. 물음에 답하시오."
    },
    "choices": null,
    "figure": "assets/bank/s31-u04/s2-q16.webp",
    "figureNote": "개미·나비·매미·사마귀·잠자리·초파리 사진과 이름",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "번데기 단계의 유무(있다 없다), 완전 탈바꿈과 불완전 탈바꿈",
      "rubric": {
        "required": [
          "번데기 단계의 유무"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": []
      }
    },
    "explanation": "",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "같은 쪽 소문항 (1)의 사진을 반복 제시한다. 번데기 단계를 거치는지의 차이를 설명하면 충분하며 두 전문 용어를 모두 쓰는 것을 추가로 요구하지 않는다."
    }
  },
  {
    "id": "s31-u04-o2-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 18,
      "page": 41,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "창의사고력",
      "originalNo": "3(2)"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "배추흰나비의 먹이와 관찰 방법",
      "concept": "배추흰나비의 먹이와 관찰 방법"
    },
    "prompt": "배추흰나비 애벌레를 기르면서 관찰해야 할 것들을 쓰시오.",
    "givens": {
      "지문": "다음과 같은 배추흰나비의 한살이 과정을 관찰할 사육 상자를 만들려고 합니다."
    },
    "choices": null,
    "figure": "assets/bank/s31-u04/s2-q18.webp",
    "figureNote": "배추흰나비 성충 사진",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "• 한살이 과정에 따라 변화되는 모습을 중점적으로 관찰한다.\n• 알에서 나오는 모습을 관찰한다.\n• 먹이를 먹고 똥을 누는 모습을 관찰한다.\n• 허물을 벗으며 자라는 모습을 관찰한다.\n• 번데기로 변하는 모습을 관찰한다.\n• 나비가 되어 나오는 모습과 나는 모습을 관찰한다.\n• 짝짓기를 하고 알을 낳는 모습을 관찰한다.",
      "rubric": {
        "required": [
          "한살이를 알 수 있는 구체적인 관찰 내용 한 가지"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": []
      }
    },
    "explanation": "",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "예시 일곱 개를 모두 쓰라는 수량 지시나 배점표는 없다. 한살이 변화를 알아볼 수 있는 타당한 관찰 내용을 인정한다."
    }
  },
  {
    "id": "s31-u04-o2-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 19,
      "page": 41,
      "sourceId": "gfield-theory-31-2",
      "edition": "3-1-2단계 이론-교사.pdf",
      "course": "초등 3-1",
      "unit": "동물의 한살이",
      "label": "교재 문항",
      "section": "창의사고력",
      "originalNo": "3(3)"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "배추흰나비의 먹이와 관찰 방법",
      "concept": "배추흰나비의 먹이와 관찰 방법"
    },
    "prompt": "사육 상자의 윗부분에 방충망을 씌우고, 고무줄로 고정시키는 이유가 무엇인지 쓰시오.",
    "givens": {
      "지문": "다음과 같은 배추흰나비의 한살이 과정을 관찰할 사육 상자를 만들려고 합니다."
    },
    "choices": null,
    "figure": "assets/bank/s31-u04/s2-q18.webp",
    "figureNote": "배추흰나비 성충 사진",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "기생벌의 침입을 막고, 나비가 되어 날아가는 것을 막기 위해서이다.",
      "rubric": {
        "required": [
          "탈출 또는 해충의 침입을 막음"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": []
      }
    },
    "explanation": "",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "사육 상자와 방충망 기능에 관한 예시 답이며 별도 공식 배점표는 없다. 기생벌의 침입 방지 또는 나비의 탈출 방지라는 타당한 이유를 인정한다. 통풍도 타당한 기능이지만 ‘씌우고 고정’의 이유와 연결하는 채점은 추가 검토한다."
    }
  },
  {
    "id": "s31-u04-o3-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 1,
      "page": 6,
      "sourceId": "gfield-theory-41-2",
      "edition": "4-1-2단계-교사.pdf",
      "course": "초등 4-1",
      "unit": "식물의 한살이",
      "label": "교재 문항",
      "section": "개념 확인",
      "originalNo": "1"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "식물의 한살이와 관찰 자료",
      "concept": "식물의 한살이와 관찰 자료"
    },
    "prompt": "식물의 한살이를 관찰하기에 적합한 식물을 선택할 때 생각해야 할 점으로 옳지 않은 것을 모두 고르시오.",
    "givens": null,
    "choices": [
      "주변에서 쉽게 구할 수 있어야 한다.",
      "크기가 커서 관찰하기 쉬워야 한다.",
      "한살이 기간이 길어야 한다.",
      "식물의 잎, 줄기, 꽃, 열매의 구분이 명확해야 한다.",
      "식물이 잘 자라고, 관리하기에 편리해야 한다."
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
    "explanation": "식물이 너무 크면 기르면서 관찰하기에 어렵다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설"
    }
  },
  {
    "id": "s31-u04-o3-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 2,
      "page": 7,
      "sourceId": "gfield-theory-41-2",
      "edition": "4-1-2단계-교사.pdf",
      "course": "초등 4-1",
      "unit": "식물의 한살이",
      "label": "교재 문항",
      "section": "개념 확인",
      "originalNo": "6"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "공정한 비교 실험 계획",
      "concept": "공정한 비교 실험 계획"
    },
    "prompt": "물이 식물의 자람에 미치는 영향을 알아보는 실험을 할 때, 같게 해야 하는 조건과 다르게 해야 하는 조건으로 옳은 것을 고르시오.",
    "givens": {
      "표의 열": [
        "같게 해야 하는 조건",
        "다르게 해야 하는 조건"
      ]
    },
    "choices": [
      "물 주는 시기, 공기 / 햇빛, 화분의 크기",
      "화분의 크기, 햇빛 / 물의 양",
      "공기, 온도, 물의 양 / 햇빛",
      "물의 양, 햇빛 / 온도",
      "화분의 크기, 온도 / 물 주는 시기"
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
    "explanation": "물의 양만 다르게 하고, 나머지 조건은 모두 같게 해 준다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "원문의 두 열 표를 각 보기에서 /로 구분했다. 내용과 열의 순서는 그대로다."
    }
  },
  {
    "id": "s31-u04-o3-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 3,
      "page": 7,
      "sourceId": "gfield-theory-41-2",
      "edition": "4-1-2단계-교사.pdf",
      "course": "초등 4-1",
      "unit": "식물의 한살이",
      "label": "교재 문항",
      "section": "개념 확인",
      "originalNo": "7"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "싹트기와 자람에 필요한 조건",
      "concept": "싹트기와 자람에 필요한 조건"
    },
    "prompt": "다음 중 강낭콩이 자라는 데 필요한 조건에 대한 설명으로 옳지 않은 것을 고르시오.",
    "givens": null,
    "choices": [
      "햇빛을 받고 자란 강낭콩은 잎이 크고 두껍다.",
      "햇빛을 받지 못한 강낭콩은 잎이 작고 얇다.",
      "햇빛을 받지 못한 강낭콩은 연한 초록색을 띤다.",
      "물을 충분히 준 강낭콩은 싱싱하게 잘 자란다.",
      "물을 주지 않은 강낭콩은 잎과 줄기가 튼튼하다."
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
    "explanation": "식물이 잘 자라려면 햇빛, 물, 양분, 공기 등이 필요하다. 물을 주지 않은 강낭콩은 잎과 줄기가 시들고, 축 늘어진다.\n[자료 검토] 이 단원의 자람 실험에서는 물·햇빛의 영향을 알아봐요. 원문 해설의 공기·양분을 별도 필수 실험 요인으로 요구하지 않아요.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "해설은 원문 그대로다. 2022 개정의 실험 요인은 물·햇빛으로 한정하고 공기·양분을 별도 실험 주제로 확장하지 않는다."
    }
  },
  {
    "id": "s31-u04-o3-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 4,
      "page": 7,
      "sourceId": "gfield-theory-41-2",
      "edition": "4-1-2단계-교사.pdf",
      "course": "초등 4-1",
      "unit": "식물의 한살이",
      "label": "교재 문항",
      "section": "개념 확인",
      "originalNo": "8"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "식물의 한살이와 관찰 자료",
      "concept": "식물의 한살이와 관찰 자료"
    },
    "prompt": "강낭콩이 자라는 것을 알 수 있는 방법으로 옳은 것을 모두 고르시오.",
    "givens": null,
    "choices": [
      "꽃잎의 수 세기",
      "가지의 수 세기",
      "줄기의 길이 재기",
      "줄기의 굵기 재기",
      "꼬투리의 길이 재기"
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
        2,
        3,
        4
      ]
    },
    "explanation": "강낭콩이 자람에 따라 가지의 수가 늘고, 줄기의 굵기와 길이도 커지며 꼬투리도 점점 길어진다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설"
    }
  },
  {
    "id": "s31-u04-o3-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 5,
      "page": 7,
      "sourceId": "gfield-theory-41-2",
      "edition": "4-1-2단계-교사.pdf",
      "course": "초등 4-1",
      "unit": "식물의 한살이",
      "label": "교재 문항",
      "section": "개념 확인",
      "originalNo": "9"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "식물의 한살이와 관찰 자료",
      "concept": "식물의 한살이와 관찰 자료"
    },
    "prompt": "다음 중 강낭콩이 자라면서 생기는 변화에 대한 설명으로 옳은 것을 모두 고르시오.",
    "givens": null,
    "choices": [
      "줄기가 점점 길어지며 굵어진다.",
      "가지의 수는 일정하다.",
      "꼬투리가 많이 생기고, 점점 커진다.",
      "누르스름하던 떡잎이 점점 초록색이 된다.",
      "꽃망울의 개수가 점점 많아진다."
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
        2,
        4
      ]
    },
    "explanation": "초록색이었던 떡잎이 점점 누르스름해진다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설"
    }
  },
  {
    "id": "s31-u04-o3-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 6,
      "page": 7,
      "sourceId": "gfield-theory-41-2",
      "edition": "4-1-2단계-교사.pdf",
      "course": "초등 4-1",
      "unit": "식물의 한살이",
      "label": "교재 문항",
      "section": "개념 확인",
      "originalNo": "10"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "식물의 한살이와 관찰 자료",
      "concept": "식물의 한살이와 관찰 자료"
    },
    "prompt": "다음 중 식물의 한살이에 대한 설명으로 옳은 것을 모두 고르시오.",
    "givens": null,
    "choices": [
      "식물마다 잎의 수와 크기가 비슷하다.",
      "대를 이어 살아가기 위해 씨앗을 만든다.",
      "모든 식물은 같은 한살이 과정을 거친다.",
      "새로 생긴 씨앗은 처음 씨앗과 생김새가 비슷하다.",
      "한살이 과정을 되풀이 하면 전과 다른 새로운 식물이 만들어진다."
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
    "explanation": "모든 식물의 한살이가 모두 같지는 않으나 비슷하다. 식물의 한살이 과정을 통해 대를 잇는 것을 알 수 있고, 처음과 같은 모양의 씨가 많이 생김을 알 수 있다.\n[자료 검토] 강낭콩·봉숭아처럼 교재에서 관찰한 씨앗으로 번식하는 식물의 한살이 비교예요. 모든 식물이 씨앗으로 번식한다는 뜻은 아니에요.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "교재 본문이 다룬 강낭콩·봉숭아 같은 씨앗으로 번식하는 식물의 비교다. 모든 식물이 씨앗으로 번식한다고 확장하지 않는다."
    }
  },
  {
    "id": "s31-u04-o4-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 1,
      "page": 8,
      "sourceId": "gfield-theory-41-2",
      "edition": "4-1-2단계-교사.pdf",
      "course": "초등 4-1",
      "unit": "식물의 한살이",
      "label": "교재 문항",
      "section": "개념 응용",
      "originalNo": "1"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "공정한 비교 실험 계획",
      "concept": "공정한 비교 실험 계획"
    },
    "prompt": "보라는 다음과 같은 조건으로 실험을 준비하였다. 식물이 자라는데 영향을 주는 요인을 알아보기 위해 비교해야 할 실험을 고르고, 그렇게 생각한 이유를 서술하시오.",
    "givens": {
      "표": {
        "머리": [
          "실험",
          "실험 방법"
        ],
        "행": [
          [
            "실험 Ⓐ",
            "햇빛은 잘 받게 하지만 물은 주지 않는다."
          ],
          [
            "실험 Ⓑ",
            "물은 알맞게 주지만 햇빛은 햇빛 가리개로 가린다."
          ],
          [
            "실험 Ⓒ",
            "햇빛은 잘 받게 하고, 물을 알맞게 준다."
          ]
        ]
      }
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "실험Ⓐ와 실험Ⓒ를 비교해 보면 식물이 자라는데 필요한 요인이 물이라는 것을 알 수 있다. 왜냐하면 물의 양을 서로 달리하여 주고 나머지 조건인 햇빛의 양은 서로 같게 해 주어야 하기 때문이다. 실험Ⓑ와 실험Ⓒ를 비교해 보면 식물이 자라는데 필요한 요인이 햇빛의 양이라는 것을 알 수 있다. 왜냐하면 햇빛의 양을 서로 달리하여 주고 나머지 조건인 물의 양은 서로 같게 해 주어야 하기 때문이다.",
      "rubric": {
        "required": [
          "A-C 또는 B-C의 비교쌍",
          "선택한 쌍에 맞는 다르게 한 조건과 같게 한 조건"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": []
      }
    },
    "explanation": "이 실험에서 물이 식물이 자라는데 필요한 조건인지를 알아보기 위해서는 물의 양을 달리해주고 나머지 조건은 같게 해 주어야 한다. 마찬가지로 햇빛이 식물이 자라는데 필요한 조건인지를 알아보기 위해서는 햇빛의 양을 다르게 해 주고 나머지 조건은 같게 해 주어야 한다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "발문에 두 쌍을 모두 쓰라는 수량 지시가 없다. A-C와 물/같은 햇빛 또는 B-C와 햇빛/같은 물의 올바른 연결 한 쌍을 쓴 답을 인정한다. 별도 공식 배점표는 없다."
    }
  },
  {
    "id": "s31-u04-o4-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 2,
      "page": 8,
      "sourceId": "gfield-theory-41-2",
      "edition": "4-1-2단계-교사.pdf",
      "course": "초등 4-1",
      "unit": "식물의 한살이",
      "label": "교재 문항",
      "section": "개념 응용",
      "originalNo": "2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "싹트기와 자람에 필요한 조건",
      "concept": "싹트기와 자람에 필요한 조건"
    },
    "prompt": "다음과 같이 조건을 다르게 하여 강낭콩 씨앗의 변화를 관찰하였다. 강낭콩 씨앗의 싹이 트는 것과 싹이 트지 않는 것을 구분하고, 이 실험을 통해 알 수 있는 사실을 서술하시오.",
    "givens": {
      "표": {
        "머리": [
          "실험",
          "실험 방법"
        ],
        "행": [
          [
            "가",
            "마른 솜 위의 강낭콩"
          ],
          [
            "나",
            "물에 적신 솜 위의 강낭콩"
          ],
          [
            "다",
            "솜을 물에 적신 후 냉장고에 넣은 강낭콩"
          ]
        ]
      }
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "싹이 트는 것: 나, 싹이 트지 않는 것: 가, 다 / 물을 준 강낭콩 씨앗은 싹이 트고, 물을 주지 않은 강낭콩 씨앗은 싹이 트지 않는다. 상온에 둔 강낭콩 씨앗은 싹이 트고, 냉장고에 넣어 둔 강낭콩 씨앗은 싹이 트지 않는다.",
      "rubric": {
        "required": [
          "나는 싹트고 가·다는 싹트지 않는 결과",
          "싹트는 데 필요한 물과 온도"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": []
      }
    },
    "explanation": "물, 온도, 공기(산소) 등의 환경 조건이 알맞아야 씨앗의 싹이 잘 튼다. 물이 없는 마른 솜 위에 놓은 강낭콩과 온도가 낮은 냉장고에 넣어 둔 강낭콩은 싹이 트지 않는다.\n[자료 검토] 가·나는 교재 본문처럼 상온에 둔 경우로 읽어요. 이 문제에서는 물·온도의 두 조건을 비교해요.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "가·나는 상온이라는 조건이 발문 표에는 생략돼 있으나 본문 3쪽과 해설에 있다. 원문 표는 그대로 보존한다. 새 유사문항에는 이 조건을 명시한다. 평가 범위는 물·온도이며 공기를 추가 필수 설명으로 요구하지 않는다."
    }
  },
  {
    "id": "s31-u04-o4-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 3,
      "page": 8,
      "sourceId": "gfield-theory-41-2",
      "edition": "4-1-2단계-교사.pdf",
      "course": "초등 4-1",
      "unit": "식물의 한살이",
      "label": "교재 문항",
      "section": "개념 응용",
      "originalNo": "4"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "식물의 한살이와 관찰 자료",
      "concept": "식물의 한살이와 관찰 자료"
    },
    "prompt": "다음은 강낭콩 줄기의 자람을 측정하여 그 결과를 막대 그래프로 나타낸 것이다. 강낭콩의 줄기가 나오기 시작하면서부터 7일에 한 번씩 종이 테이프를 사용하여 그 길이를 측정하였다. 시간이 지남에 따라 강낭콩 줄기의 길이가 어떻게 달라졌는지 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s31-u04/s4-q3.webp",
    "figureNote": "강낭콩의 자람(줄기의 길이) 막대그래프",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "어느 시기까지는 줄기의 길이가 점점 길어지다가, 그 이후에는 성장 속도가 더디거나 멈추게 된다.",
      "rubric": {
        "required": [
          "처음 증가하다가 뒤에는 더디거나 같은 길이를 유지한 변화"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": []
      }
    },
    "explanation": "싹이 튼 직후에는 양분이 줄기가 계속 자라는데 많이 쓰이지만 꽃이 피고 열매를 맺으면 이제 대부분의 양분들이 열매에게 가서 더 좋은 열매를 맺게 하기 때문에 줄기는 더 이상 자라지 않는다.\n[자료 검토] 이 그래프에 나타난 관찰 기간에는 길이가 늘다가 나중에는 거의 같게 유지돼요. 원문 해설을 “꽃이 피면 모든 식물의 줄기가 더 자라지 않는다”는 법칙으로 넓히지 않아요.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "그래프의 측정 사실과 예시 답은 타당하다. 해설의 ‘꽃이 피면 줄기는 더 이상 자라지 않는다’는 모든 강낭콩·식물에 적용되는 법칙이 아니므로 원문과 구분한 보충 설명 없이는 게시하지 않는다. 그래프의 증가 후 유지되는 길이만 채점하고 양분 분배 이유를 요구하지 않는다."
    }
  },
  {
    "id": "s31-u04-o4-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 4,
      "page": 9,
      "sourceId": "gfield-theory-41-2",
      "edition": "4-1-2단계-교사.pdf",
      "course": "초등 4-1",
      "unit": "식물의 한살이",
      "label": "교재 문항",
      "section": "개념 응용",
      "originalNo": "8"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "식물의 한살이와 관찰 자료",
      "concept": "식물의 한살이와 관찰 자료"
    },
    "prompt": "다음은 봉숭아의 한살이를 나타낸 사진이다. 봉숭아의 한살이 과정을 순서대로 나열하고, 강낭콩 한살이와의 공통점을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s31-u04/s4-q4.webp",
    "figureNote": "가·나·다·라·마로 표시된 봉숭아의 한살이 사진",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "라-가-다-나-마, 씨앗에서 싹이 터서 자라며, 꽃이 피고, 열매를 맺어 대를 잇는다.",
      "rubric": {
        "required": [
          "봉숭아 사진 순서 라-가-다-나-마",
          "두 식물의 공통 한살이 과정 한 가지"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": []
      }
    },
    "explanation": "봉숭아의 한살이는 강낭콩의 한살이와 비슷하다. 봉숭아는 씨앗에서 싹이 트면 떡잎이 나온 후 본잎이 나오고, 잎과 줄기가 자라고 꽃이 핀다. 꽃이 진 자리에 열매(씨앗)가 생긴다.\n[자료 검토] 꽃이 진 뒤 열매가 자라고 그 안에 씨앗이 생겨요. 열매와 씨앗은 같은 부분이 아니에요.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설"
    }
  },
  {
    "id": "s31-u04-o4-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 5,
      "page": 10,
      "sourceId": "gfield-theory-41-2",
      "edition": "4-1-2단계-교사.pdf",
      "course": "초등 4-1",
      "unit": "식물의 한살이",
      "label": "교재 문항",
      "section": "창의사고력",
      "originalNo": "1(1)"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "공정한 비교 실험 계획",
      "concept": "공정한 비교 실험 계획"
    },
    "prompt": "위의 내용을 바탕으로 실험 계획을 세울 때 필요한 가설을 서술하시오.",
    "givens": {
      "지문": "예은이는 식물이 자라는데 필요한 조건을 알아보기 위해 실험 계획을 세우려고 한다.\n알아보고자 하는 것: 강낭콩이 자라는데 햇빛은 어떤 영향을 미칠까?"
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "햇빛을 받은 강낭콩은 받지 못한 강낭콩보다 더욱 잘 자랄 것이다. 햇빛을 받은 강낭콩은 받지 못한 강낭콩보다 잎이 크고 두꺼우며, 줄기가 더 튼튼할 것이다. 등",
      "rubric": {
        "required": [
          "햇빛과 식물의 자람을 연결한 검증 가능한 예상"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": []
      }
    },
    "explanation": "\n[자료 검토] 가설은 검증 가능한 예상이에요. 햇빛과 식물의 자람을 연결했다면 예시와 반대 방향의 예상도 인정해요.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "강의 Tip: ‘가설이기 때문에 꼭 정확할 필요는 없다. 따라서 햇빛과 식물의 관계에 대한 가설을 썼을 경우 정답으로 인정한다.’ 예시 방향과 반대라도 검증 가능한 자람 예측이면 인정해야 한다."
    }
  },
  {
    "id": "s31-u04-o4-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 6,
      "page": 10,
      "sourceId": "gfield-theory-41-2",
      "edition": "4-1-2단계-교사.pdf",
      "course": "초등 4-1",
      "unit": "식물의 한살이",
      "label": "교재 문항",
      "section": "창의사고력",
      "originalNo": "1(2)"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "공정한 비교 실험 계획",
      "concept": "공정한 비교 실험 계획"
    },
    "prompt": "위 가설을 바탕으로 실험을 설계하려고 한다. 같게 해야 할 조건과 다르게 해야 할 조건을 쓰시오.",
    "givens": {
      "지문": "예은이는 식물이 자라는데 필요한 조건을 알아보기 위해 실험 계획을 세우려고 한다.\n알아보고자 하는 것: 강낭콩이 자라는데 햇빛은 어떤 영향을 미칠까?\n가설: 햇빛을 받은 강낭콩은 받지 못한 강낭콩보다 더욱 잘 자랄 것이다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "같게 해야 할 조건: 같은 종류의 흙, 물주는 시기와 양, 화분의 크기 등\n다르게 해야 할 조건: 햇빛",
      "rubric": {
        "required": [
          "햇빛을 다르게 함",
          "다른 타당한 조건 한 가지를 같게 함"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": []
      }
    },
    "explanation": "햇빛만 다르게 해주고, 물을 주는 시기와 양, 화분의 크기, 강낭콩의 크기와 수 등은 같게 해야 한다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "종이의 1(1)에서 직접 쓴 가설을 전제로 한 연속 소문항이다. 독립 문항에서 풀 수 있도록 1(1)의 인쇄 예시 가설을 지문으로 반복했으며, 새로운 원문 문장으로 가장하지 않는다. 반복한 예시의 출처는 같은 10쪽 1(1)이다. 같게 하는 조건은 예시 목록 중 타당한 조건을 인정하며 열거한 조건을 모두 요구하지 않는다."
    }
  },
  {
    "id": "s31-u04-o4-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 7,
      "page": 10,
      "sourceId": "gfield-theory-41-2",
      "edition": "4-1-2단계-교사.pdf",
      "course": "초등 4-1",
      "unit": "식물의 한살이",
      "label": "교재 문항",
      "section": "창의사고력",
      "originalNo": "1(3)"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "공정한 비교 실험 계획",
      "concept": "공정한 비교 실험 계획"
    },
    "prompt": "다음은 예은이가 설계한 실험 과정이다. 예은이의 실험 과정 중에서 잘못 설계된 내용을 찾아 바르게 고치시오.",
    "givens": {
      "지문": "예은이는 식물이 자라는데 필요한 조건을 알아보기 위해 실험 계획을 세우려고 한다.\n알아보고자 하는 것: 강낭콩이 자라는데 햇빛은 어떤 영향을 미칠까?\n강낭콩이 싹터서 자라고 있는 두 개의 화분을 창가에 놓고 한 화분만 햇빛 가리개로 덮은 후, 햇빛 가리개를 덮은 화분에만 물을 주면서 강낭콩의 자람을 관찰한다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "햇빛에 의한 식물의 자람을 알아보기 위한 실험이므로 두 화분 모두 같은 시간에 같은 양의 물을 주어야 한다.",
      "rubric": {
        "required": [
          "두 대상 모두에 물을 같은 양으로 줌"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": []
      }
    },
    "explanation": "햇빛에 따른 강낭콩의 자람을 알아보는 실험이므로, 햇빛 가리개를 이용하여 한 화분만 햇빛의 양을 차단하고, 나머지 조건은 모두 같게 해야 한다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설"
    }
  },
  {
    "id": "s31-u04-o4-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 8,
      "page": 13,
      "sourceId": "gfield-theory-41-2",
      "edition": "4-1-2단계-교사.pdf",
      "course": "초등 4-1",
      "unit": "식물의 한살이",
      "label": "교재 문항",
      "section": "창의사고력",
      "originalNo": "4(1)"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "식물의 한살이와 관찰 자료",
      "concept": "식물의 한살이와 관찰 자료"
    },
    "prompt": "조별로 낸 아이디어에서 강낭콩이 자라는 것을 측정하기 위한 적절한 방법이 아닌 아이디어를 낸 조는 몇 조인지를 모두 쓰고, 적정한 방법이 아닌 이유를 각각 쓰시오.",
    "givens": {
      "지문": "현우네 반에서는 강낭콩이 자라는 것을 측정하고 기록하기 위해 화분에 강낭콩을 심고 조별로 관찰하는 활동을 하고 있다. 강낭콩이 자라고 있다는 것을 다양한 방법으로 측정하기 위해 다음과 같이 조별로 아이디어를 냈다.",
      "표": {
        "머리": [
          "조",
          "조별 아이디어"
        ],
        "행": [
          [
            "1조",
            "다른 포기의 잎과 크기를 비교한다."
          ],
          [
            "2조",
            "잎을 하나씩 따서 관찰일지에 기록한다."
          ],
          [
            "3조",
            "모양을 뜰 잎을 정하고 종이와 연필을 이용하여 잎 모양을 뜬다."
          ],
          [
            "4조",
            "강낭콩 한 포기 전체의 잎의 수를 세어서 기록한다."
          ],
          [
            "5조",
            "다른 화분에서 자라는 강낭콩과의 키 차이를 기록한다."
          ]
        ]
      }
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "1조: 한 포기 안에서도 잎의 크기가 다양하므로 단순히 다른 포기의 잎의 크기를 비교하는 것은 적절하지 않다. 2조: 잎이 자라는 정도를 알 수 없고, 식물의 생장에 좋지 않은 영향을 주므로 적절하지 않다. 5조: 다른 화분에서 자라는 강낭콩은 다른 조건에 자라고 있으므로 비교하기에 알맞은 기준이 아니므로 적절하지 않다.",
      "rubric": {
        "required": [
          "1조와 잎 크기가 다양하여 단순 비교가 안 되는 이유",
          "2조와 계속 관찰할 수 없거나 생장을 해치는 이유",
          "5조와 다른 조건에서 자라 비교 기준이 맞지 않는 이유"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": []
      }
    },
    "explanation": "생물이 점차 자라나는 것을 생장이라고 한다. 식물의 생장은 길이 생장, 부피 생장 등이 있으므로 다양한 방법으로 측정하는 것이 좋다. 1조 - 한 포기 안에서도 잎의 크기는 다양하므로, 단순히 다른 포기의 잎과 크기를 비교하는 것은 얼마나 자랐는지를 재는 데는 적절하지 않다. 2조 - 잎을 따서 붙여버린다면 그 잎이 자라는 정도를 알 수 없고, 식물의 생장에 좋지 않은 영향을 미치게 되므로 잘못된 방법이다. 5조 - 다른 화분에서 자라는 강낭콩은 다른 조건에서 자라고 있으므로, 내가 키우고 있는 강낭콩의 생장 정도를 비교하기에는 알맞은 기준이 되지 못한다. 다른 조사를 위해 비교 관찰하는 것은 가능하다.\n[자료 검토] 같은 한 포기의 시간에 따른 자람을 추적하는 활동이에요. 다른 식물과 비교하는 모든 조사가 잘못이라는 뜻은 아니에요.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-17",
      "gates": [
        "source",
        "answer"
      ],
      "against": "교사용 교재의 정답·해설",
      "note": "발문의 ‘적정한’과 정답의 ‘다른 조건에 자라고’는 인쇄본대로 보존했다. 다른 포기·다른 화분의 비교 자체가 언제나 부적절한 것이 아니라 같은 개체의 시간에 따른 자람을 추적하려는 이 활동의 목적에 한정한다. 별도 배점표는 없다."
    }
  }
];
