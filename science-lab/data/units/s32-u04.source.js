// 3-2 Ⅳ 물질의 상태 — 단원평가 원문 70문항(시매쓰DMC 최다빈출 단원평가 세트1·2·3·4). 시험지를 그대로 옮기고 정답 및 풀이와 대조했다.
// 원장 지시(2026-10-09): 원문을 그대로 문제은행에 쓴다. 그림은 시험지에서 잘라 낸 것(assets/bank/s32-u04/).
export const source = [
  {
    "id": "s32-u04-o1-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 1,
      "page": 1,
      "sourceId": "sci-32-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "고체 찾기",
      "concept": "고체는 손으로 잡을 수 있고 담는 그릇이 바뀌어도 모양이 변하지 않는다."
    },
    "prompt": "손으로 잡을 수 있어 전달하기 쉬우며, 그릇에 담았을 때 모양이 변하지 않는 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 물",
        "ㄴ. 공기",
        "ㄷ. 나무 막대"
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
        "나무 막대",
        "나무막대"
      ]
    },
    "explanation": "손으로 잡을 수 있어 전달하기 쉬우며, 그릇에 담았을 때 모양이 변하지 않는 것은 고체인 나무 막대입니다.",
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
    "id": "s32-u04-o1-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 2,
      "page": 1,
      "sourceId": "sci-32-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "고체와 액체의 공통점",
      "concept": "고체인 나무 막대와 액체인 물은 모두 눈에 보인다는 공통점이 있다."
    },
    "prompt": "나무 막대와 물의 공통점으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "눈에 보입니다.",
      "흐르고 투명합니다.",
      "흔들면 출렁거립니다.",
      "손에 잡히지 않습니다.",
      "만져 보면 딱딱합니다."
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
    "explanation": "나무 막대는 눈에 보이고, 만져 보면 딱딱합니다. 물은 눈에 보이고, 투명하며, 잡으면 흘러내려 손에 잡히지 않습니다.",
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
    "id": "s32-u04-o1-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 3,
      "page": 1,
      "sourceId": "sci-32-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "고체의 모양과 부피",
      "concept": "고체는 담는 그릇이 달라져도 모양과 부피가 변하지 않는다."
    },
    "prompt": "다음은 나무 막대를 여러 가지 모양의 그릇에 넣은 모습입니다. 이를 통해 알 수 있는 내용으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "나무 막대는 매우 차갑습니다.",
      "나무 막대는 투명한 물체입니다.",
      "나무 막대는 담는 그릇에 따라 부피가 변합니다.",
      "나무 막대는 담는 그릇의 모양에 따라 모양이 변합니다.",
      "나무 막대는 여러 가지 모양의 그릇에 옮겨 담아도 모양과 부피가 변하지 않습니다."
    ],
    "figure": "assets/bank/s32-u04/s1-q03.webp",
    "figureNote": "모양이 다른 투명한 그릇 세 개(둥근 어항 모양, 손잡이 달린 술잔 모양, 컵)에 똑같은 나무 막대가 하나씩 들어 있는 그림.",
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
    "explanation": "고체인 나무 막대는 담는 그릇이 달라져도 모양과 부피가 변하지 않습니다.",
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
    "id": "s32-u04-o1-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 4,
      "page": 1,
      "sourceId": "sci-32-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "고체의 성질",
      "concept": "고체는 눈으로 볼 수 있고 손으로 잡을 수 있으며 담는 그릇에 따라 모양과 부피가 변하지 않는다."
    },
    "prompt": "고체의 성질에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "흘러내립니다.",
      "눈으로 볼 수 있습니다.",
      "손으로 잡을 수 없습니다.",
      "담는 그릇에 따라 모양이 변합니다.",
      "담는 그릇에 따라 부피가 변하지 않습니다."
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
    "explanation": "고체는 눈으로 볼 수 있고, 손으로 잡을 수 있으며, 담는 그릇에 따라 모양과 부피가 변하지 않습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'(정답 2 개)'의 숫자와 '개' 사이 띄어쓰기는 인쇄 간격대로 옮김."
    }
  },
  {
    "id": "s32-u04-o1-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 5,
      "page": 1,
      "sourceId": "sci-32-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "액체(물)의 성질",
      "concept": "액체는 담는 그릇에 따라 모양은 변하지만 부피는 변하지 않는다."
    },
    "prompt": "물의 성질에 대한 설명으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 물은 흐르고 눈에 보입니다.",
        "ㄴ. 물은 담는 그릇에 따라 부피가 변합니다.",
        "ㄷ. 물은 담는 그릇에 따라 모양이 변합니다."
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
        "물은 담는 그릇에 따라 부피가 변합니다."
      ]
    },
    "explanation": "물은 담는 그릇에 따라 모양은 변하지만 부피는 변하지 않는 액체입니다.",
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
    "id": "s32-u04-o1-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 6,
      "page": 2,
      "sourceId": "sci-32-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "액체 물질 고르기",
      "concept": "꿀과 식용유처럼 끈끈한 물질도 담는 그릇에 따라 모양만 변하고 부피는 변하지 않으므로 액체이다."
    },
    "prompt": "액체 상태의 물질을 <보기>에서 모두 골라 바르게 짝 지은 것은?",
    "givens": {
      "보기": [
        "ㄱ. ▲바닷물",
        "ㄴ. ▲꿀",
        "ㄷ. ▲식용유"
      ]
    },
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "figure": "assets/bank/s32-u04/s1-q06.webp",
    "figureNote": "<보기> 상자 안 사진 세 장: ㄱ 바다 사진(캡션 ▲바닷물), ㄴ 숟가락에서 흘러내리는 꿀 사진(캡션 ▲꿀), ㄷ 유리 그릇에 따르는 식용유와 올리브 사진(캡션 ▲식용유).",
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
    "explanation": "우리 주변에서 볼 수 있는 액체에는 물, 우유, 간장, 식초, 액상 세제, 바닷물, 물약, 알코올 등이 있습니다.\n꿀이나 식용유는 끈끈한 성질이 있기 때문에 액체가 아니라고 생각할 수 있습니다. 하지만 담는 그릇에 따라 모양은 변하지만 부피는 변하지 않는 액체의 성질을 가지고 있으므로 액체입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 사진과 캡션으로만 되어 있어 캡션 글자를 보기 항목으로 옮김."
    }
  },
  {
    "id": "s32-u04-o1-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 7,
      "page": 2,
      "sourceId": "sci-32-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물속 플라스틱병 누르기",
      "concept": "물속에서 빈 플라스틱병을 누르면 병 속 공기가 공기 방울로 빠져나오며 보글보글 소리가 난다."
    },
    "prompt": "물이 담긴 수조 속에 플라스틱병을 넣고 손으로 눌렀을 때 나타나는 현상으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 보글보글 소리가 납니다.",
        "ㄴ. 수조 속의 물이 흐려집니다.",
        "ㄷ. 플라스틱 병의 입구에서 공기 방울이 나옵니다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u04/s1-q07.webp",
    "figureNote": "물이 담긴 수조 속에 손으로 플라스틱병(이름표 '플라스틱병')을 비스듬히 눌러 넣고 있는 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ",
        "수조 속의 물이 흐려집니다."
      ]
    },
    "explanation": "물속에서 플라스틱병을 누르면 플라스틱병 입구에서 공기 방울이 생겨 위로 올라와 사라지고, 보글보글 소리가 납니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄. 보기 ㄷ은 '플라스틱 병'으로 띄어 인쇄됨(발문은 '플라스틱병')."
    }
  },
  {
    "id": "s32-u04-o1-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 8,
      "page": 2,
      "sourceId": "sci-32-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "공기가 있음을 알 수 있는 예",
      "concept": "부표는 속에 공기가 들어 있어 물 위에 뜨므로 공기가 있음을 보여 준다."
    },
    "prompt": "우리 주변에 공기가 있음을 알 수 있는 예로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "모래",
      "주스",
      "부표",
      "지우개",
      "나무 막대"
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
    "explanation": "부표는 공기가 들어 있어 물 위에 떠 있을 수 있습니다.",
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
    "id": "s32-u04-o1-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 9,
      "page": 3,
      "sourceId": "sci-32-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "구멍 뚫린 컵 실험",
      "concept": "컵 바닥에 구멍이 있으면 컵 속 공기가 빠져나가 물이 컵 안으로 들어오므로 페트병 뚜껑이 내려가지 않는다."
    },
    "prompt": "위 ㄱ과 ㄴ 중 바닥에 구멍이 뚫린 플라스틱 컵을 사용한 것을 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[09~10] 다음은 바닥에 구멍이 뚫린 플라스틱 컵과 구멍이 뚫리지 않은 플라스틱 컵을 뒤집어 물에 띄운 페트병 뚜껑을 각각 덮은 뒤 수조 바닥까지 밀었을 때의 모습입니다. 물음에 답하세요.",
      "그림 설명": [
        "ㄱ. ▲페트병 뚜껑이 내려감.",
        "ㄴ. ▲페트병 뚜껑이 그대로 있음."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u04/s1-q09.webp",
    "figureNote": "수조 그림 두 개. ㄱ: 뒤집은 플라스틱 컵으로 페트병 뚜껑을 덮어 수조 바닥까지 밀자 뚜껑이 바닥까지 내려감(캡션 ▲페트병 뚜껑이 내려감.). ㄴ: 같은 방법으로 밀었으나 뚜껑이 물 위에 그대로 있음(캡션 ▲페트병 뚜껑이 그대로 있음.).",
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
    "explanation": "구멍이 뚫린 플라스틱 컵으로 누르면 구멍으로 공기가 빠져나가 페트병 뚜껑이 물 위에 그대로 있게 됩니다.",
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
    "id": "s32-u04-o1-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 10,
      "page": 3,
      "sourceId": "sci-32-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "컵 안에 든 물질",
      "concept": "구멍 없는 컵 안은 공기가 공간을 차지해 물이 들어오지 못하고, 구멍 난 컵은 공기가 빠져 물이 차오른다."
    },
    "prompt": "위 ㄱ과 ㄴ의 플라스틱 컵 안에 가장 많이 들어 있는 물질을 <보기>에서 골라 각각 기호를 쓰세요.",
    "givens": {
      "지문": "[09~10] 다음은 바닥에 구멍이 뚫린 플라스틱 컵과 구멍이 뚫리지 않은 플라스틱 컵을 뒤집어 물에 띄운 페트병 뚜껑을 각각 덮은 뒤 수조 바닥까지 밀었을 때의 모습입니다. 물음에 답하세요.",
      "그림 설명": [
        "ㄱ. ▲페트병 뚜껑이 내려감.",
        "ㄴ. ▲페트병 뚜껑이 그대로 있음."
      ],
      "보기": [
        "가. 물",
        "나. 공기",
        "다. 페트병 뚜껑"
      ],
      "답란": "ㄱ-(    ), ㄴ-(    )"
    },
    "choices": null,
    "figure": "assets/bank/s32-u04/s1-q09.webp",
    "figureNote": "수조 그림 두 개. ㄱ: 뒤집은 플라스틱 컵으로 페트병 뚜껑을 덮어 수조 바닥까지 밀자 뚜껑이 바닥까지 내려감(캡션 ▲페트병 뚜껑이 내려감.). ㄴ: 같은 방법으로 밀었으나 뚜껑이 물 위에 그대로 있음(캡션 ▲페트병 뚜껑이 그대로 있음.).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ-나, ㄴ-가",
      "accepted": [
        "ㄱ-나, ㄴ-가",
        "ㄱ-나,ㄴ-가",
        "나, 가",
        "나,가",
        "ㄱ-공기, ㄴ-물",
        "ㄱ 나 ㄴ 가",
        "ㄱ 공기, ㄴ 물",
        "공기, 물"
      ]
    },
    "explanation": "구멍이 뚫리지 않은 ㄱ 플라스틱 컵 안에는 공기가 가득 차 있고, 구멍이 뚫린 ㄴ 컵 안에는 공기 일부와 많은 양의 물이 차 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기> 기호가 ㄱ/ㄴ/ㄷ이 아니라 가/나/다로 인쇄됨."
    }
  },
  {
    "id": "s32-u04-o1-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 11,
      "page": 3,
      "sourceId": "sci-32-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E5",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "주사기로 공기 이동시키기",
      "concept": "주사기 피스톤을 밀면 공기가 비닐관을 따라 이동해 반대쪽 피스톤과 스타이로폼 공을 밀어낸다."
    },
    "prompt": "다음과 같이 장치하고 주사기의 피스톤을 밀었을 때의 변화로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 스타이로폼 공이 커집니다.",
        "ㄴ. 스타이로폼 공이 줄어듭니다.",
        "ㄷ. 주사기와 비닐관 안에 들어 있는 공기로 인해 스타이로폼 공이 밖으로 밀려 나갑니다.",
        "ㄹ. 주사기와 비닐관 안에 들어 있는 공기로 인해 스타이로폼 공이 안으로 끌려 들어옵니다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u04/s1-q11.webp",
    "figureNote": "두 주사기를 비닐관(이름표 '비닐관')으로 연결하고, 한쪽 주사기 피스톤 끝에 스타이로폼 공(이름표 '스타이로폼 공')을 붙인 뒤 다른 쪽 주사기를 두 손으로 잡고 있는 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ",
        "주사기와 비닐관 안에 들어 있는 공기로 인해 스타이로폼 공이 밖으로 밀려 나갑니다."
      ]
    },
    "explanation": "주사기 속 공기가 이동하면서 스타이로폼 공이 붙은 주사기의 피스톤을 밀기 때문에 스타이로폼 공이 밖으로 밀려 나갑니다.",
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
    "id": "s32-u04-o1-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 12,
      "page": 3,
      "sourceId": "sci-32-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E5",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "공기의 이동을 이용한 예",
      "concept": "선풍기는 공기를 이동시켜 바람을 만들고, 축구공·공기베개는 공기가 공간을 차지하는 성질을 이용한다."
    },
    "prompt": "공기가 다른 곳으로 이동할 수 있는 성질을 이용한 예로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 선풍기",
        "ㄴ. 축구공",
        "ㄷ. 공기베개",
        "ㄹ. 풍선 놀이 틀"
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
        "선풍기"
      ]
    },
    "explanation": "선풍기를 켜면 공기가 이동하여 바람이 붑니다. 축구공, 공기베개, 풍선 놀이 틀은 공기가 공간을 차지하는 성질을 이용한 예입니다.",
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
    "id": "s32-u04-o1-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 13,
      "page": 3,
      "sourceId": "sci-32-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물질의 상태와 무게",
      "concept": "고체, 액체, 기체는 모두 무게가 있다."
    },
    "prompt": "무게가 있는 물질의 상태를 <보기>에서 모두 골라 바르게 짝 지은 것은?",
    "givens": {
      "보기": [
        "ㄱ. 고체",
        "ㄴ. 액체",
        "ㄷ. 기체"
      ]
    },
    "choices": [
      "ㄱ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
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
    "explanation": "고체, 액체, 기체는 모두 무게가 있습니다.",
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
    "id": "s32-u04-o1-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 14,
      "page": 4,
      "sourceId": "sci-32-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "공기의 성질",
      "concept": "공기의 무게를 느끼지 못하는 것은 몸 안에서도 같은 크기의 힘으로 밀어내기 때문이지 공기가 가벼워서가 아니다."
    },
    "prompt": "공기에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "공기는 이동시킬 수 있습니다.",
      "공기는 손으로 잡을 수 없습니다.",
      "공기는 눈에 잘 보이지 않습니다.",
      "공기는 일정한 부피를 차지합니다.",
      "공기의 무게를 느끼지 못하는 것은 공기가 가볍기 때문입니다."
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
    "explanation": "우리가 공기의 무게를 느끼지 못하는 까닭은 공기가 우리를 누르고 있는 힘만큼 우리 몸 안에서도 똑같은 크기의 힘으로 밀어내고 있기 때문입니다.",
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
    "id": "s32-u04-o1-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 15,
      "page": 4,
      "sourceId": "sci-32-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E5",
      "type": "T09",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "풍선 로켓이 나아가는 까닭",
      "concept": "풍선 속 공기가 입구 밖으로 이동해 빠져나오면서 풍선 로켓을 반대 방향으로 나아가게 한다."
    },
    "prompt": "풍선 로켓 장난감에서 풍선 입구를 잡고 있던 손을 놓으면 풍선 로켓이 앞으로 나아갑니다. 풍선 로켓이 앞으로 나아가는 까닭을 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s32-u04/s1-q15.webp",
    "figureNote": "실에 매단 로켓 모양 장난감 아래에 부푼 풍선을 붙이고, 손으로 풍선 입구를 잡고 있는 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "풍선 속 공기가 이동하여 풍선 밖으로 빠져나오기 때문에 풍선 로켓이 앞으로 나아갑니다.",
      "rubric": {
        "required": [
          "풍선 속 공기 때문에 로켓이 움직인다",
          "풍선 속 공기가 이동해 풍선 밖으로 빠져나온다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "정답: 공기가 이동하기 때문에 풍선 로켓이 앞으로 나아간다고 쓴 경우 (100%)",
          "부분 정답: 공기로 인해 풍선 로켓이 움직이지만 그 내용을 정확하게 쓰지 않은 경우 (30%)"
        ]
      }
    },
    "explanation": "풍선 입구를 쥐고 있던 손을 놓으면 풍선 속 공기가 빠져나오면서 로켓이 실을 따라 움직이게 됩니다.\n[채점 기준] 정답: 공기가 이동하기 때문에 풍선 로켓이 앞으로 나아간다고 쓴 경우 (100%) / 부분 정답: 공기로 인해 풍선 로켓이 움직이지만 그 내용을 정확하게 쓰지 않은 경우 (30%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준표는 정답 및 풀이 2쪽에 있음."
    }
  },
  {
    "id": "s32-u04-o2-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 1,
      "page": 1,
      "sourceId": "sci-32-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "나무 막대 관찰",
      "concept": "나무 막대는 고유의 색과 무늬가 있어 빛이 통과하지 않는 불투명한 고체이다."
    },
    "prompt": "나무 막대를 관찰한 내용으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "딱딱합니다.",
      "투명합니다.",
      "눈에 보입니다.",
      "네모 모양입니다.",
      "손으로 잡을 수 있습니다."
    ],
    "figure": "assets/bank/s32-u04/s2-q01.webp",
    "figureNote": "네모난 나무 막대 그림",
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
    "explanation": "나무 막대는 고유의 색과 무늬가 있어 불투명합니다.",
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
    "id": "s32-u04-o2-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 2,
      "page": 1,
      "sourceId": "sci-32-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "고체·액체·기체를 손으로 전달하기",
      "concept": "물과 같은 액체는 담는 그릇에 따라 모양이 바뀌므로 처음 모양 그대로 담을 수 없다."
    },
    "prompt": "나무 막대, 물, 공기를 손으로 옆 친구에게 전달한 뒤 그릇에 담으려고 합니다. 이에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "물은 손으로 잡으면 흘러내립니다.",
      "공기는 전달하는 느낌이 나지 않습니다.",
      "물은 처음 모양 그대로 그릇에 담을 수 있습니다.",
      "나무 막대는 처음 모양 그대로 그릇에 담을 수 있습니다.",
      "공기는 손에 잡히지 않아 전달한 것인지 알 수 없습니다."
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
    "explanation": "물은 담는 그릇의 모양에 따라 모양이 바뀝니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄이 있음(인쇄본에서 '않/은'으로 줄이 나뉨)."
    }
  },
  {
    "id": "s32-u04-o2-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 3,
      "page": 1,
      "sourceId": "sci-32-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물과 공기의 특징 비교",
      "concept": "물은 눈에 보이고 만질 수 있지만 흘러내려 잡을 수 없고, 공기는 보이지 않고 잡을 수 없다."
    },
    "prompt": "물과 공기의 특징을 바르게 비교한 것을 고르세요.",
    "givens": null,
    "choices": [
      "물은 눈에 보이지 않고, 공기는 눈에 보입니다.",
      "물은 손으로 잡을 수 있고, 공기는 손으로 잡을 수 없습니다.",
      "물은 손으로 잡을 수 없고, 공기는 손으로 잡을 수 있습니다.",
      "물은 흘러서 전달하기 어렵고, 공기는 손으로 잡아 전달할 수 있습니다.",
      "물은 눈에 보이고 만질 수 있지만, 공기는 보이지 않으며 전달하는 느낌이 나지 않습니다."
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
    "explanation": "물은 눈에 보이고 만질 수 있지만 흘러내려서 손으로 잡을 수 없습니다. 공기는 보이지 않으며 손으로 잡을 수 없어 전달하는 느낌이 나지 않습니다.",
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
    "id": "s32-u04-o2-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 4,
      "page": 1,
      "sourceId": "sci-32-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E2",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "고체(플라스틱 막대)의 성질 바로잡기",
      "concept": "고체는 담는 그릇이 바뀌어도 모양과 부피가 모두 변하지 않는다."
    },
    "prompt": "다음은 플라스틱 막대에 대한 설명입니다. 설명이 잘못된 부분의 기호를 쓰고, 바르게 고쳐 쓰세요.",
    "givens": {
      "지문": "플라스틱 막대는 ㉠눈으로 볼 수 있고 ㉡손으로 잡을 수 있으며, ㉢비교적 단단합니다. 또한 여러 가지 모양의 그릇에 넣었을 때 ㉣막대의 모양은 변하지 않고, ㉤부피만 변합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "㉤, 부피도 변하지 않습니다.",
      "rubric": {
        "required": [
          "잘못된 부분(㉤)의 부피를 다룬다",
          "부피도 변하지 않는다로 고친다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "기호와 잘못된 내용을 바르게 수정한 경우 (100%)",
          "잘못된 내용을 수정한 것이 정확하지 않은 경우 (30%)"
        ]
      }
    },
    "explanation": "플라스틱 막대는 나무 막대와 같이 담는 그릇의 모양에 관계없이 모양과 부피가 변하지 않습니다.\n[채점 기준] 기호와 잘못된 내용을 바르게 수정한 경우 (100%) / 잘못된 내용을 수정한 것이 정확하지 않은 경우 (30%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '잘못된'에 밑줄. 지문 상자 안 ㉠~㉤ 뒤 구절(눈으로 볼 수 있고 / 손으로 잡을 수 있으며 / 비교적 단단합니다 / 막대의 모양은 변하지 않고 / 부피만 변합니다)에 각각 밑줄. 채점 기준 표의 행 머리는 '정답'(100%)과 '부분 정답'(30%)."
    }
  },
  {
    "id": "s32-u04-o2-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 5,
      "page": 1,
      "sourceId": "sci-32-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "고체가 아닌 물질 고르기",
      "concept": "알코올은 흐르고 그릇에 따라 모양이 변하는 액체이며, 컵·연필·지우개·유리구슬은 고체이다."
    },
    "prompt": "고체가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "컵",
      "연필",
      "알코올",
      "지우개",
      "유리구슬"
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
    "explanation": "컵, 연필, 지우개, 유리구슬은 고체이고, 알코올은 액체입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '아닌'에 밑줄이 있음. 보기는 2단 배열(①②/③④/⑤)."
    }
  },
  {
    "id": "s32-u04-o2-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 6,
      "page": 1,
      "sourceId": "sci-32-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물과 주스(액체)의 공통점",
      "concept": "물과 주스는 모두 액체로 흐르고 그릇에 따라 모양이 변하지만 부피는 일정하며, 물은 색깔이 없다."
    },
    "prompt": "물과 주스의 공통점으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "눈에 보입니다.",
      "색깔이 있습니다.",
      "흐르는 성질이 있습니다.",
      "담는 그릇에 따라 모양이 변합니다.",
      "담는 그릇이 달라져도 부피는 변하지 않습니다."
    ],
    "figure": "assets/bank/s32-u04/s2-q06.webp",
    "figureNote": "같은 모양의 유리컵 두 개에 각각 물(파란색)과 주스(노란색)가 담긴 그림, 아래에 '▲물', '▲주스' 설명",
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
    "explanation": "물은 무색투명합니다.",
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
    "id": "s32-u04-o2-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 7,
      "page": 2,
      "sourceId": "sci-32-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "꿀과 숟가락의 상태 구분",
      "concept": "흘러내리는 꿀은 액체이고, 모양이 일정한 숟가락은 고체이다."
    },
    "prompt": "다음은 숟가락을 이용하여 꿀을 그릇에 담는 모습입니다. ㉠과 ㉡의 물질의 상태는 무엇인지 각각 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s32-u04/s2-q07.webp",
    "figureNote": "숟가락에서 꿀이 흘러내려 그릇에 담기는 사진. ㉠은 흘러내리는 꿀, ㉡은 숟가락 손잡이를 가리킴",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-액체, ㉡-고체",
      "accepted": [
        "㉠-액체, ㉡-고체",
        "㉠ 액체, ㉡ 고체",
        "액체, 고체",
        "㉠-액체,㉡-고체",
        "액체 고체",
        "액체,고체",
        "ㄱ-액체, ㄴ-고체"
      ]
    },
    "explanation": "꿀은 액체이고, 숟가락은 고체입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란은 '㉠-(      ), ㉡-(      )' 형식으로 인쇄됨."
    }
  },
  {
    "id": "s32-u04-o2-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 8,
      "page": 2,
      "sourceId": "sci-32-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "풍선 속 공기 확인하기",
      "concept": "공기는 눈에 보이지 않지만 풍선에서 빠져나올 때 소리와 피부에 닿는 느낌으로 있음을 알 수 있다."
    },
    "prompt": "공기 주입기를 이용해 부풀린 풍선의 입구를 얼굴에 가까이 대고 풍선의 입구를 잡고 있던 손을 놓았을 때 나타나는 현상으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "풍선이 투명해집니다.",
      "풍선의 크기가 커집니다.",
      "얼굴 주위로 물방울이 튑니다.",
      "얼굴 주변으로 무엇인가 지나가는 느낌이 듭니다.",
      "풍선 속에 있던 공기가 빠져나오는 소리가 들립니다."
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
    "explanation": "풍선 속의 공기가 빠져나오면서 바람 소리가 들리고, 얼굴 주변으로 무엇인가 지나가는 느낌이 듭니다.",
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
    "id": "s32-u04-o2-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 9,
      "page": 2,
      "sourceId": "sci-32-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "축구공에 이용된 공기의 성질",
      "concept": "축구공은 공기가 공간을 차지하는 성질을 이용해 공 모양을 유지한다."
    },
    "prompt": "다음은 축구공의 모습입니다. 축구공은 공기의 어떤 성질을 이용한 것인지 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 색깔이 없습니다.",
        "ㄴ. 잡을 수 없습니다.",
        "ㄷ. 냄새가 나지 않습니다.",
        "ㄹ. 일정한 공간을 차지합니다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u04/s2-q09.webp",
    "figureNote": "잔디 위에 놓인 낡은 흰색 축구공 사진",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄹ",
      "accepted": [
        "ㄹ",
        "일정한 공간을 차지합니다."
      ]
    },
    "explanation": "축구공은 공기가 일정한 공간을 차지하는 성질을 이용한 것입니다.",
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
    "id": "s32-u04-o2-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 10,
      "page": 2,
      "sourceId": "sci-32-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E5",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "주사기로 공기의 이동 확인하기",
      "concept": "왼쪽 주사기를 밀면 그 안의 공기가 비닐관을 따라 이동해 오른쪽 주사기 피스톤을 밀어낸다."
    },
    "prompt": "다음과 같이 두 주사기를 비닐관으로 연결한 뒤 오른쪽 주사기 피스톤 끝에 스타이로폼 공을 붙여 놓았습니다. 왼쪽 주사기의 피스톤을 밀었을 때의 결과로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. (그림) 왼쪽 주사기 피스톤이 밀려 들어가고, 오른쪽 주사기 피스톤이 밖으로 밀려 나와 스타이로폼 공이 올라감",
        "ㄴ. (그림) 왼쪽 주사기 피스톤이 밀려 들어갔으나 오른쪽 주사기 피스톤은 그대로임"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u04/s2-q10.webp",
    "figureNote": "위: 손으로 왼쪽 주사기를 잡고 비닐관으로 오른쪽 주사기와 연결한 그림(라벨 '스타이로폼 공', '비닐관'). 아래 <보기> 상자에 ㄱ·ㄴ 두 그림: ㄱ은 오른쪽 피스톤이 밀려 나온 모습, ㄴ은 오른쪽 피스톤이 그대로인 모습",
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
    "explanation": "왼쪽 주사기의 피스톤을 밀면 주사기 속 공기가 이동하면서 오른쪽 주사기의 피스톤을 밀어냅니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>의 ㄱ·ㄴ은 글 없이 그림만 있음 — givens의 보기 문구는 그림을 설명한 것이지 인쇄된 글이 아님."
    }
  },
  {
    "id": "s32-u04-o2-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 11,
      "page": 2,
      "sourceId": "sci-32-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "공기의 이동을 이용한 예",
      "concept": "비눗방울 불기와 타이어에 공기 채우기는 공기가 다른 곳으로 이동하는 성질을 이용한다."
    },
    "prompt": "다음의 모습들은 공통적으로 공기의 어떤 성질을 이용한 것인지 고르세요.",
    "givens": {
      "지문": "▲비눗방울 불기 ▲자전거 타이어에 공기 채우기"
    },
    "choices": [
      "공기는 무게가 있습니다.",
      "공기는 색깔이 없습니다.",
      "공기는 손으로 잡을 수 있습니다.",
      "공기는 다른 곳으로 이동할 수 있습니다.",
      "공기는 담는 그릇에 따라 모양이 변하지 않습니다."
    ],
    "figure": "assets/bank/s32-u04/s2-q11.webp",
    "figureNote": "아이가 비눗방울을 부는 사진과 공기 주입기로 자전거 타이어에 공기를 채우는 사진, 캡션 '▲비눗방울 불기', '▲자전거 타이어에 공기 채우기'",
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
    "explanation": "바람을 불어 비눗방울을 만드는 것과 공기 주입기를 이용해 자전거 타이어에 공기를 채우는 것은 공기가 다른 곳으로 이동할 수 있는 성질을 이용한 것입니다.",
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
    "id": "s32-u04-o2-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 12,
      "page": 3,
      "sourceId": "sci-32-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "그릇을 가득 채우는 물질의 상태",
      "concept": "기체는 담긴 그릇을 항상 가득 채우며 모양과 부피가 그릇에 따라 변한다."
    },
    "prompt": "고체, 액체, 기체 중 담긴 그릇을 항상 가득 채우는 성질이 있는 물질의 상태를 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "기체",
      "accepted": [
        "기체"
      ]
    },
    "explanation": "담긴 그릇을 항상 가득 채우는 것은 기체입니다.",
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
    "id": "s32-u04-o2-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 13,
      "page": 3,
      "sourceId": "sci-32-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "페트병 무게 늘리기",
      "concept": "공기 주입 마개를 눌러 페트병에 공기를 더 넣으면 무게가 늘어난다."
    },
    "prompt": "페트병의 무게가 늘어나게 하기 위한 방법으로 옳은 것을 고르세요.",
    "givens": {
      "지문": "[13~14] 다음과 같이 페트병에 공기 주입 마개를 끼운 뒤 무게를 측정하였습니다. 물음에 답하세요."
    },
    "choices": [
      "페트병을 냉동실에 넣습니다.",
      "공기 주입 마개를 분리합니다.",
      "페트병을 뜨거운 물에 넣습니다.",
      "페트병의 모양을 찌그러뜨립니다.",
      "공기 주입 마개를 여러 번 누릅니다."
    ],
    "figure": "assets/bank/s32-u04/s2-q13.webp",
    "figureNote": "전자저울 위에 공기 주입 마개(라벨 '공기 주입 마개')를 끼운 빈 페트병이 놓인 그림",
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
    "explanation": "공기 주입 마개를 여러 번 누르면 페트병 안으로 공기가 들어가 페트병의 무게가 늘어납니다.",
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
    "id": "s32-u04-o2-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 14,
      "page": 3,
      "sourceId": "sci-32-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "공기의 무게",
      "concept": "공기를 넣을수록 페트병이 무거워지므로 기체인 공기도 무게가 있다."
    },
    "prompt": "다음은 위 실험의 결과로 알 수 있는 내용입니다. 빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "[13~14] 다음과 같이 페트병에 공기 주입 마개를 끼운 뒤 무게를 측정하였습니다. 물음에 답하세요.\n공기는 [    ](이)가 있음을 알 수 있습니다."
    },
    "choices": null,
    "figure": "assets/bank/s32-u04/s2-q13.webp",
    "figureNote": "전자저울 위에 공기 주입 마개(라벨 '공기 주입 마개')를 끼운 빈 페트병이 놓인 그림",
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
    "explanation": "공기 주입 마개를 여러 번 누르면 페트병 안으로 공기가 들어가 페트병의 무게가 늘어납니다. 이를 통해 기체인 공기는 무게가 있음을 알 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 상자 안의 네모 칸으로 인쇄됨('공기는 □(이)가 있음을 알 수 있습니다.')."
    }
  },
  {
    "id": "s32-u04-o2-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 15,
      "page": 3,
      "sourceId": "sci-32-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "비닐장갑 닭 장난감에 쓰인 물질의 상태",
      "concept": "비닐장갑 닭 장난감은 빨대·비닐장갑·종이컵 같은 고체와 기체인 공기를 함께 이용한다."
    },
    "prompt": "다음은 비닐장갑 닭 장난감의 모습입니다. 비닐장갑 닭 장난감에서 사용한 물질의 상태를 모두 골라 바르게 짝 지은 것은?",
    "givens": null,
    "choices": [
      "고체",
      "액체",
      "고체, 액체",
      "고체, 기체",
      "고체, 액체, 기체"
    ],
    "figure": "assets/bank/s32-u04/s2-q15.webp",
    "figureNote": "닭 모양으로 꾸민 비닐장갑을 종이컵에 씌우고 빨대를 꽂은 장난감 그림",
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
    "explanation": "비닐장갑 닭 장난감은 고체인 빨대, 비닐장갑, 종이컵 등과 기체인 공기를 이용한 장난감입니다.",
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
    "id": "s32-u04-o3-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 1,
      "page": 1,
      "sourceId": "sci-32-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "나무 막대·물·공기의 성질 구별",
      "concept": "물은 눈에 보이고 흐르는 성질이 있어 담는 그릇에 따라 모양이 달라진다."
    },
    "prompt": "다음에서 설명하는 것은 나무 막대, 물, 공기 중 무엇인지 쓰세요.",
    "givens": {
      "지문": "• 투명하며, 담는 그릇에 따라 모양이 달라지며, 흔들면 출렁거립니다.\n• 손으로 전달할 수 있지만, 흐르는 성질이 있어 흘러내립니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "물",
      "accepted": [
        "물"
      ]
    },
    "explanation": "나무 막대는 딱딱하여 손으로 잡을 수 있으며, 담는 그릇에 따라 모양이 달라지지 않습니다. 공기는 눈에 보이지 않고 손에 잡히지 않습니다.",
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
    "id": "s32-u04-o3-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 2,
      "page": 1,
      "sourceId": "sci-32-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "손으로 전달할 때 느낌이 없는 물질",
      "concept": "공기는 눈에 보이지 않고 만지는 느낌이 없어 손으로 전달했는지 알기 어렵다."
    },
    "prompt": "손으로 여러 가지 물체를 친구에게 전달할 때 만지는 느낌이 없어 제대로 전달했는지 알 수 없는 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 물",
        "ㄴ. 공기",
        "ㄷ. 나무 막대"
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
        "공기"
      ]
    },
    "explanation": "공기는 눈으로 볼 수 없고 만지는 느낌이 없어 제대로 전달했는지 알 수 없습니다.",
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
    "id": "s32-u04-o3-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 3,
      "page": 1,
      "sourceId": "sci-32-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "나무 막대·물·공기의 특징 비교",
      "concept": "나무 막대는 눈에 보이고 손으로 잡을 수 있으며, 물은 보이고 만질 수 있지만 공기는 보이지도 잡히지도 않는다."
    },
    "prompt": "나무 막대, 물, 공기에 대한 설명으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 물은 손으로 만질 수 없습니다.",
        "ㄴ. 물과 공기는 눈에 보이지 않습니다.",
        "ㄷ. 나무 막대는 눈에 보이고 손으로 잡을 수 있습니다."
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
        "나무 막대는 눈에 보이고 손으로 잡을 수 있습니다."
      ]
    },
    "explanation": "공기는 손으로 잡을 수 없고 눈에 보이지 않지만, 물은 손으로 만질 수 있고 눈에 보입니다.",
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
    "id": "s32-u04-o3-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 4,
      "page": 1,
      "sourceId": "sci-32-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "고체를 여러 그릇에 넣었을 때의 변화",
      "concept": "고체는 담는 그릇이 바뀌어도 모양과 부피가 변하지 않는다."
    },
    "prompt": "다음은 여러 가지 모양의 투명한 그릇에 나무 막대를 넣은 모습입니다. 나무 막대 대신 플라스틱 막대를 넣었을 때에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "플라스틱 막대는 그릇에 따라 모양이 변합니다.",
      "플라스틱 막대는 그릇의 모양이 달라지면 부피가 커집니다.",
      "나무 막대처럼 그릇의 모양과 관계없이 모양과 부피가 변하지 않습니다.",
      "나무 막대는 그릇에 따라 부피가 변하지 않지만, 플라스틱 막대는 변합니다.",
      "나무 막대는 공간을 차지하지만, 플라스틱 막대는 공간을 차지하지 않습니다."
    ],
    "figure": "assets/bank/s32-u04/s3-q04.webp",
    "figureNote": "모양이 다른 투명한 그릇 세 개(둥근 어항 모양, 손잡이 달린 와인잔 모양, 컵)에 같은 나무 막대가 하나씩 들어 있는 그림",
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
    "explanation": "나무 막대와 같이 플라스틱 막대도 담는 그릇의 모양과 관계없이 모양과 부피가 변하지 않습니다.",
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
    "id": "s32-u04-o3-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 5,
      "page": 1,
      "sourceId": "sci-32-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "고체의 성질",
      "concept": "고체는 눈으로 볼 수 있고 손으로 잡을 수 있으며, 그릇이 바뀌어도 모양과 부피가 일정하다."
    },
    "prompt": "고체에 대한 설명으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 눈으로 볼 수 있습니다.",
        "ㄴ. 손으로 잡을 수 없습니다.",
        "ㄷ. 담는 그릇이 바뀌어도 고체의 모양과 부피는 변하지 않습니다."
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
        "손으로 잡을 수 없습니다."
      ]
    },
    "explanation": "고체는 손으로 잡을 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "문항의 '않은'에 밑줄이 있음."
    }
  },
  {
    "id": "s32-u04-o3-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 6,
      "page": 1,
      "sourceId": "sci-32-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "고체와 액체 분류",
      "concept": "가방·모래·신발·소금은 고체이고 사이다는 액체이다."
    },
    "prompt": "물질의 상태가 나머지와 다른 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 가방",
        "ㄴ. 모래",
        "ㄷ. 신발",
        "ㄹ. 소금",
        "ㅁ. 사이다"
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
      "answer": "ㅁ",
      "accepted": [
        "ㅁ",
        "사이다"
      ]
    },
    "explanation": "가방, 모래, 신발, 소금은 고체이고, 사이다는 액체입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "문항의 '다른'에 밑줄이 있음. <보기>는 두 줄(ㄱ·ㄴ·ㄷ / ㄹ·ㅁ)로 배치됨."
    }
  },
  {
    "id": "s32-u04-o3-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 7,
      "page": 2,
      "sourceId": "sci-32-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "액체를 다른 그릇에 옮겨 담을 때의 모양 변화",
      "concept": "액체는 담는 그릇의 모양에 따라 모양이 변한다."
    },
    "prompt": "위 실험에서 ㈏의 실험 결과가 다음과 같을 때 이를 통해 알 수 있는 내용으로 옳은 것을 고르세요.",
    "givens": {
      "지문": "[07~08] 다음 실험 과정을 보고, 물음에 답하세요.\n<실험 과정>\n㈎ 투명한 그릇에 주스를 넣고 주스의 높이를 표시한 뒤 주스의 모양을 관찰합니다.\n㈏ 주스를 다른 모양의 그릇에 차례대로 옮겨 담으면서 주스의 모양을 관찰합니다.\n㈐ 처음에 사용한 그릇에 주스를 다시 옮겨 담아 주스의 높이를 처음에 표시한 높이와 비교합니다."
    },
    "choices": [
      "주스는 담는 그릇에 따라 색깔이 변합니다.",
      "주스는 담는 그릇이 작아져야 모양이 변합니다.",
      "주스는 담는 그릇의 모양에 따라 모양이 변합니다.",
      "주스는 담는 그릇의 색깔에 따라 모양이 변합니다.",
      "주스는 담는 그릇의 모양이 바뀌어도 모양이 변하지 않습니다."
    ],
    "figure": "assets/bank/s32-u04/s3-q07.webp",
    "figureNote": "둥근 컵 → 손잡이 달린 머그컵 → 길쭉한 원통형 그릇(아래쪽에 표시선)으로 노란 주스를 차례로 옮겨 담은 모습. 주스 모양이 그릇마다 다름",
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
    "explanation": "여러 가지 모양의 그릇에 담았을 때 그릇의 모양에 따라 주스의 모양이 달라지는 것을 알 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "㈎·㈏·㈐는 인쇄본에서 괄호 안 한글(㈎/㈏/㈐) 기호로 표기됨."
    }
  },
  {
    "id": "s32-u04-o3-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 8,
      "page": 2,
      "sourceId": "sci-32-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "옮겨 담은 액체의 부피 변화",
      "concept": "액체는 담는 그릇이 바뀌어도 부피는 변하지 않는다."
    },
    "prompt": "위 실험에서 ㈐의 실험 결과로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[07~08] 다음 실험 과정을 보고, 물음에 답하세요.\n<실험 과정>\n㈎ 투명한 그릇에 주스를 넣고 주스의 높이를 표시한 뒤 주스의 모양을 관찰합니다.\n㈏ 주스를 다른 모양의 그릇에 차례대로 옮겨 담으면서 주스의 모양을 관찰합니다.\n㈐ 처음에 사용한 그릇에 주스를 다시 옮겨 담아 주스의 높이를 처음에 표시한 높이와 비교합니다.",
      "보기": [
        "ㄱ. 주스의 높이가 처음과 같습니다.",
        "ㄴ. 주스의 높이가 처음보다 낮아집니다.",
        "ㄷ. 주스의 높이가 처음보다 높아집니다."
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
        "주스의 높이가 처음과 같습니다."
      ]
    },
    "explanation": "처음에 사용한 그릇으로 다시 옮기면 주스의 높이가 처음과 같습니다.",
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
    "id": "s32-u04-o3-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 9,
      "page": 2,
      "sourceId": "sci-32-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물속에서 주사기 피스톤을 밀 때의 현상",
      "concept": "공기가 든 주사기의 피스톤을 물속에서 밀면 공기가 공기 방울로 빠져나와 위로 올라간다."
    },
    "prompt": "다음과 같이 물속에서 주사기의 피스톤을 밀 때 나타나는 변화로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "주사기의 크기가 커집니다.",
      "주사기의 크기가 작아집니다.",
      "주사기 안으로 물이 들어옵니다.",
      "수조 속의 물의 온도가 낮아집니다.",
      "주사기 끝에서 공기 방울이 생겨 위로 올라갑니다."
    ],
    "figure": "assets/bank/s32-u04/s3-q09.webp",
    "figureNote": "물이 든 수조 속에서 손으로 주사기(라벨 '주사기')의 피스톤을 미는 모습",
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
    "explanation": "주사기의 피스톤을 밀면 주사기 안에 있던 공기가 주사기 끝에서 공기 방울로 나와 위로 올라갑니다.",
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
    "id": "s32-u04-o3-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 10,
      "page": 2,
      "sourceId": "sci-32-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "바람과 공기의 이동",
      "concept": "바람은 공기가 다른 곳으로 이동하기 때문에 생긴다."
    },
    "prompt": "다음은 무엇에 의한 현상인지 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "• 선풍기를 켜면 바람이 붑니다.\n• 바람이 불면 바람개비가 돌아갑니다.\n• 나뭇가지가 흔들리거나 깃발이 휘날립니다.",
      "보기": [
        "ㄱ. 공기는 색깔이 변할 수 있습니다.",
        "ㄴ. 공기는 다른 곳으로 이동할 수 있습니다.",
        "ㄷ. 공기는 담는 그릇을 가득 채울 수 있습니다."
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
        "공기는 다른 곳으로 이동할 수 있습니다."
      ]
    },
    "explanation": "공기가 다른 곳으로 이동하는 성질 때문에 바람이 붑니다.",
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
    "id": "s32-u04-o3-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 11,
      "page": 2,
      "sourceId": "sci-32-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "공기를 넣어 쓰는 물체",
      "concept": "튜브·부표·축구공·풍선 미끄럼틀은 모두 안에 공기를 채워 사용한다."
    },
    "prompt": "다음의 여러 가지 물체 안에 공통으로 들어 있는 물질을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "튜브, 부표, 축구공, 풍선 미끄럼틀",
      "보기": [
        "ㄱ. 물",
        "ㄴ. 돌",
        "ㄷ. 모래",
        "ㄹ. 공기"
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
        "공기"
      ]
    },
    "explanation": "튜브, 부표, 축구공, 풍선 미끄럼틀 안에는 모두 공기가 들어 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 두 줄(ㄱ·ㄴ / ㄷ·ㄹ)로 배치됨."
    }
  },
  {
    "id": "s32-u04-o3-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 12,
      "page": 3,
      "sourceId": "sci-32-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "구멍 뚫린 컵을 물속에 밀어 넣을 때의 현상",
      "concept": "바닥에 구멍이 있는 컵은 공기가 빠져나가 물이 들어오므로 페트병 뚜껑의 높이와 수조의 물 높이가 변하지 않는다."
    },
    "prompt": "위 실험에서 플라스틱 컵을 수조 바닥까지 밀어 넣었을 때 나타나는 현상으로 옳은 것을 고르세요.",
    "givens": {
      "지문": "[12~13] 다음과 같이 바닥에 구멍이 뚫린 투명한 플라스틱 컵을 뒤집어 물 위에 띄워져 있는 페트병 뚜껑을 덮은 뒤 수조 바닥까지 천천히 밀어 넣었습니다. 물음에 답하세요."
    },
    "choices": [
      "컵 안으로 공기가 들어옵니다.",
      "컵 안에서 물이 빠져 나갑니다.",
      "수조 속 물 높이가 점점 낮아집니다.",
      "수조 속 물 높이가 점점 높아집니다.",
      "페트병 뚜껑은 물 위 같은 높이에 계속 떠 있습니다."
    ],
    "figure": "assets/bank/s32-u04/s3-q12.webp",
    "figureNote": "물이 든 수조에서 손으로 뒤집은 투명한 플라스틱 컵을 물 위에 떠 있는 빨간 페트병 뚜껑 위에 덮어 밀어 넣는 모습",
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
    "explanation": "바닥에 구멍이 뚫린 플라스틱 컵을 수조 바닥까지 밀어 넣으면 컵 안의 공기가 구멍으로 빠져나가고 물이 들어옵니다. 페트병 뚜껑은 물 위의 같은 높이에 계속 떠 있고, 수조 속 물 높이는 변화가 없습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "②의 '빠져 나갑니다'는 인쇄본 띄어쓰기 그대로."
    }
  },
  {
    "id": "s32-u04-o3-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 13,
      "page": 3,
      "sourceId": "sci-32-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "공기가 공간을 차지하는 성질(구멍 없는 컵)",
      "concept": "구멍 없는 컵 속 공기는 빠져나가지 못하고 공간을 차지해 물을 밀어내므로 페트병 뚜껑이 바닥으로 내려간다."
    },
    "prompt": "위 실험에서 바닥에 구멍이 뚫리지 않은 플라스틱 컵을 사용하여 같은 실험을 반복하였을 때 나타나는 페트병 뚜껑의 위치 변화를 그 변화가 나타나는 까닭과 함께 쓰세요.",
    "givens": {
      "지문": "[12~13] 다음과 같이 바닥에 구멍이 뚫린 투명한 플라스틱 컵을 뒤집어 물 위에 띄워져 있는 페트병 뚜껑을 덮은 뒤 수조 바닥까지 천천히 밀어 넣었습니다. 물음에 답하세요."
    },
    "choices": null,
    "figure": "assets/bank/s32-u04/s3-q12.webp",
    "figureNote": "물이 든 수조에서 손으로 뒤집은 투명한 플라스틱 컵을 물 위에 떠 있는 빨간 페트병 뚜껑 위에 덮어 밀어 넣는 모습",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "컵 안의 공기가 빠져나가지 않아 물을 밀어 내기 때문에 페트병 뚜껑이 수조 바닥으로 밀려 내려갑니다.",
      "rubric": {
        "required": [
          "페트병 뚜껑이 수조 바닥으로 내려간다",
          "컵 안의 공기가 빠져나가지 못하고 물을 밀어 낸다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "페트병 뚜껑의 변화와 그 까닭을 옳게 쓴 경우 (100%)",
          "페트병 뚜껑의 변화는 옳게 썼으나 그 까닭을 틀리게 쓴 경우 (30%)"
        ]
      }
    },
    "explanation": "바닥에 구멍이 뚫리지 않은 컵을 수조 바닥까지 밀어 넣으면 컵 안의 공기가 빠져나가지 않으므로 페트병 뚜껑이 수조 바닥으로 내려가고, 수조의 물 높이가 약간 높아집니다.\n[채점 기준] 페트병 뚜껑의 변화와 그 까닭을 옳게 쓴 경우 (100%) / 페트병 뚜껑의 변화는 옳게 썼으나 그 까닭을 틀리게 쓴 경우 (30%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "모범 답안의 '밀어 내기'는 인쇄본 띄어쓰기 그대로(빠른 정답과 해설 본문 동일)."
    }
  },
  {
    "id": "s32-u04-o3-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 14,
      "page": 3,
      "sourceId": "sci-32-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E5",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "주사기와 비닐관으로 공기의 이동 확인",
      "concept": "연결된 주사기의 피스톤을 밀고 당기면 공기가 비닐관을 따라 이동해 반대쪽 피스톤과 스타이로폼 공을 움직인다."
    },
    "prompt": "다음과 같이 스타이로폼 공을 붙인 주사기와 다른 주사기를 비닐관으로 연결한 뒤 스타이로폼 공을 붙이지 않은 주사기의 피스톤을 밀었다가 당길 때 나타나는 스타이로폼 공의 변화를 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s32-u04/s3-q14.webp",
    "figureNote": "손에 쥔 주사기(왼쪽)와 끝에 파란 스타이로폼 공을 붙인 주사기(오른쪽 위)가 비닐관으로 연결된 모습. 라벨 '스타이로폼 공', '비닐관'",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "스타이로폼 공을 붙이지 않은 주사기의 피스톤을 밀면 스타이로폼 공이 바깥쪽으로 움직이고, 피스톤을 당기면 스타이로폼 공이 다시 제자리로 돌아옵니다.",
      "rubric": {
        "required": [
          "피스톤을 밀면 스타이로폼 공이 바깥쪽으로 움직인다",
          "피스톤을 당기면 스타이로폼 공이 제자리로 돌아온다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "스타이로폼 공이 움직였다가 다시 제자리로 돌아온다고 쓴 경우 (100%)"
        ]
      }
    },
    "explanation": "주사기의 피스톤을 밀면 주사기 속 공기가 이동하면서 오른쪽 주사기의 피스톤을 밀어내고, 왼쪽 주사기의 피스톤을 당기면 오른쪽 주사기의 피스톤이 제자리로 돌아옵니다. 이때 주사기 끝에 붙어 있는 스타이로폼 공도 같이 움직입니다.\n[채점 기준] 스타이로폼 공이 움직였다가 다시 제자리로 돌아온다고 쓴 경우 (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설은 2쪽 첫머리에 채점 기준표가 이어짐. 해설 중 '오른쪽/왼쪽 주사기'는 해설 인쇄 그대로."
    }
  },
  {
    "id": "s32-u04-o3-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 15,
      "page": 3,
      "sourceId": "sci-32-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "공기의 이동을 이용한 예",
      "concept": "비눗방울·광고 풍선·공기 공급 장치·공기 펌프는 공기가 이동하는 성질을 이용하지만 비눗물 자체는 관련이 없다."
    },
    "prompt": "공기가 다른 곳으로 이동하는 성질을 이용한 예가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "비눗방울",
      "상가 앞에 설치한 광고 풍선",
      "비누를 물에 풀어 만든 비눗물",
      "수족관에 설치한 공기 공급 장치",
      "자전거 타이어에 공기를 주입하는 펌프"
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
    "explanation": "비눗물은 공기가 이동하는 성질과 관련이 없습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "문항의 '아닌'에 밑줄이 있음(줄바꿈으로 '아'/'닌'이 나뉨)."
    }
  },
  {
    "id": "s32-u04-o3-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 16,
      "page": 3,
      "sourceId": "sci-32-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "기체의 성질",
      "concept": "기체는 이동할 수 있고 그릇에 따라 모양과 부피가 변하며 그릇을 항상 가득 채운다."
    },
    "prompt": "다음은 고체, 액체, 기체 중 무엇에 대한 설명인지 쓰세요.",
    "givens": {
      "지문": "• 다른 곳으로 이동할 수 있습니다.\n• 담는 그릇에 따라 모양과 부피가 변합니다.\n• 담긴 그릇을 항상 가득 채우는 성질이 있습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "기체",
      "accepted": [
        "기체"
      ]
    },
    "explanation": "기체는 다른 곳으로 이동할 수 있고 담는 그릇에 따라 모양과 부피가 변합니다. 또한, 담긴 그릇을 항상 가득 채우는 성질이 있습니다.",
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
    "id": "s32-u04-o3-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 17,
      "page": 3,
      "sourceId": "sci-32-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "공기를 채운 페트병의 무게",
      "concept": "공기도 무게가 있으므로 공기를 채운 페트병이 채우기 전보다 무겁다."
    },
    "prompt": "위의 ㄱ과 ㄴ 중 공기 주입 마개를 눌러 공기를 가득 채운 페트병의 무게인 것을 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[17~18] 다음은 페트병의 입구에 공기 주입 마개를 끼운 뒤 페트병 안에 공기를 채우기 전과 공기 주입 마개를 눌러 공기를 가득 채운 뒤 페트병의 무게를 각각 측정한 결과입니다. 물음에 답하세요.",
      "표": {
        "구분": [
          "페트병의 무게(g)"
        ],
        "ㄱ": [
          "52.0"
        ],
        "ㄴ": [
          "51.4"
        ]
      }
    },
    "choices": null,
    "figure": "assets/bank/s32-u04/s3-q17.webp",
    "figureNote": "페트병 입구에 공기 주입 마개(라벨 '공기 주입 마개')를 끼워 전자저울 위에 올린 그림과, 그 아래 무게 표(구분/ㄱ/ㄴ, 페트병의 무게(g) 52.0, 51.4). 표 내용은 givens에 옮김",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ",
        "52.0"
      ]
    },
    "explanation": "공기도 무게가 있기 때문에 공기를 채운 페트병이 공기를 채우기 전의 페트병보다 더 무겁습니다.",
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
    "id": "s32-u04-o3-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 18,
      "page": 4,
      "sourceId": "sci-32-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "공기의 무게",
      "concept": "공기를 채우면 페트병이 무거워지는 것으로 기체인 공기에도 무게가 있음을 알 수 있다."
    },
    "prompt": "다음은 위 실험으로 알 수 있는 것입니다. 괄호 ㉠과 ㉡에 들어갈 알맞은 말을 골라 각각 쓰세요.",
    "givens": {
      "지문": "[17~18] 다음은 페트병의 입구에 공기 주입 마개를 끼운 뒤 페트병 안에 공기를 채우기 전과 공기 주입 마개를 눌러 공기를 가득 채운 뒤 페트병의 무게를 각각 측정한 결과입니다. 물음에 답하세요.\n\n페트병 무게의 변화를 통해 ㉠( 액체, 기체 )인 공기도 ㉡( 무게, 색깔 )(이)가 있음을 알 수 있습니다.",
      "표": {
        "구분": [
          "페트병의 무게(g)"
        ],
        "ㄱ": [
          "52.0"
        ],
        "ㄴ": [
          "51.4"
        ]
      }
    },
    "choices": null,
    "figure": "assets/bank/s32-u04/s3-q17.webp",
    "figureNote": "페트병 입구에 공기 주입 마개(라벨 '공기 주입 마개')를 끼워 전자저울 위에 올린 그림과, 그 아래 무게 표(구분/ㄱ/ㄴ, 페트병의 무게(g) 52.0, 51.4). 표 내용은 givens에 옮김",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-기체, ㉡-무게",
      "accepted": [
        "㉠-기체, ㉡-무게",
        "㉠ 기체, ㉡ 무게",
        "기체, 무게",
        "기체 무게",
        "기체,무게",
        "ㄱ-기체, ㄴ-무게"
      ]
    },
    "explanation": "페트병 무게의 변화를 통해 기체인 공기도 무게가 있음을 알 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답 칸은 '㉠-(    ), ㉡-(    )' 형태로 인쇄됨. 공통 지문·그림·표는 3쪽에 있음."
    }
  },
  {
    "id": "s32-u04-o3-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 19,
      "page": 4,
      "sourceId": "sci-32-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "공기의 무게와 생활",
      "concept": "우리가 공기의 무게를 느끼지 못하는 것은 몸 안에서도 같은 크기의 힘으로 밀어내기 때문이다."
    },
    "prompt": "공기의 무게에 대한 설명으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 공기를 넣은 비치 볼이 공기를 넣지 않은 비치 볼보다 더 무겁습니다.",
        "ㄴ. 축구 경기를 할 때 축구공 안의 공기 양을 조절하여 공의 무게를 일정하게 합니다.",
        "ㄷ. 우리가 공기의 무게를 느끼지 못하는 까닭은 공기가 위쪽으로 계속 올라가고 있기 때문입니다."
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
        "우리가 공기의 무게를 느끼지 못하는 까닭은 공기가 위쪽으로 계속 올라가고 있기 때문입니다."
      ]
    },
    "explanation": "우리가 공기의 무게를 느끼지 못하는 까닭은 공기가 우리를 누르고 있는 힘만큼 우리 몸 안에서도 똑같은 크기의 힘으로 밀어내고 있기 때문입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "문항의 '않은'에 밑줄이 있음."
    }
  },
  {
    "id": "s32-u04-o3-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 20,
      "page": 4,
      "sourceId": "sci-32-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E5",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "풍선 로켓과 공기의 이동",
      "concept": "풍선 속 공기가 입구로 빠져나오며 이동하는 힘으로 풍선 로켓이 실을 따라 움직인다."
    },
    "prompt": "다음은 풍선 로켓 장난감에 대한 설명입니다. 빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "풍선 입구를 쥐고 있던 손을 놓으면 풍선 속 □(이)가 빠져나오면서 로켓이 실을 따라 움직입니다."
    },
    "choices": null,
    "figure": "assets/bank/s32-u04/s3-q20.webp",
    "figureNote": "실에 걸린 주황색 로켓 모형 아래에 부푼 풍선을 붙이고 손으로 풍선 입구를 쥐고 있는 모습",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "공기",
      "accepted": [
        "공기"
      ]
    },
    "explanation": "풍선 입구를 쥐고 있던 손을 놓으면 풍선 속 공기가 빠져나오면서 로켓이 실을 따라 움직입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 인쇄본에서 네모 칸으로 표시됨(□로 옮김)."
    }
  },
  {
    "id": "s32-u04-o4-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 1,
      "page": 1,
      "sourceId": "sci-32-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "공기 관찰 특징",
      "concept": "공기는 눈에 보이지 않고 손으로 잡을 수 없어서 전달하는지 알기 어렵다."
    },
    "prompt": "다음은 나무 막대, 물, 공기 중 무엇을 관찰한 내용인지 쓰세요.",
    "givens": {
      "지문": "• 손으로 잡을 수 없습니다.\n• 친구에게 전달할 때 전달하는 것인지 잘 알 수 없습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "공기",
      "accepted": [
        "공기"
      ]
    },
    "explanation": "손으로 잡을 수 없고 친구에게 전달하는지 알 수 없는 것은 공기입니다.",
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
    "id": "s32-u04-o4-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 2,
      "page": 1,
      "sourceId": "sci-32-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물을 전달할 때의 특징",
      "concept": "물은 눈에 보이고 만질 수 있지만 흘러내려서 손으로 잡아 전달하기 어렵다."
    },
    "prompt": "다음은 나무 막대, 물, 공기를 친구에게 전달하면서 관찰한 특징입니다. 물을 전달할 때 관찰한 특징으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 흘러내려서 전달하기 어렵습니다.",
        "ㄴ. 손으로 잡아 전달할 수 있습니다.",
        "ㄷ. 눈에 보이지 않고 손에 잡히지 않아 전달한 것인지 알 수 없습니다."
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
    "explanation": "물은 눈에 보이고, 손으로 만질 수 있지만, 흘러내려서 전달하기 어렵습니다. 손으로 잡고 전달할 수 있는 것은 나무 막대입니다. 눈에 보이지 않고 손에 잡히지 않아 전달한 것인지 알 수 없는 것은 공기입니다.",
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
    "id": "s32-u04-o4-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 3,
      "page": 1,
      "sourceId": "sci-32-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "고체의 모양과 부피",
      "concept": "고체는 담는 그릇이 바뀌어도 모양과 부피가 변하지 않는다."
    },
    "prompt": "나무 막대를 여러 가지 모양의 그릇에 옮겨 담을 때 모양과 부피 변화에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "나무 막대의 색깔이 변합니다.",
      "나무 막대의 모양과 부피가 모두 변합니다.",
      "나무 막대의 모양과 부피가 모두 변하지 않습니다.",
      "나무 막대의 부피는 변하지만 모양은 변하지 않습니다.",
      "나무 막대의 모양은 변하지만 부피는 변하지 않습니다."
    ],
    "figure": "assets/bank/s32-u04/s4-q03.webp",
    "figureNote": "모양이 다른 투명한 그릇 세 개(둥근 어항 모양, 손잡이 달린 유리잔, 컵)에 같은 나무 막대가 하나씩 담긴 그림.",
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
    "explanation": "나무 막대와 같은 고체는 담는 그릇이 달라져도 모양과 부피가 모두 변하지 않습니다.",
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
    "id": "s32-u04-o4-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 4,
      "page": 1,
      "sourceId": "sci-32-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "고체의 성질",
      "concept": "고체는 비교적 단단하고 손으로 잡을 수 있으며 그릇이 바뀌어도 모양과 부피가 일정하다."
    },
    "prompt": "고체의 성질에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "비교적 단단합니다.",
      "눈으로 볼 수 없습니다.",
      "손으로 잡을 수 있습니다.",
      "담긴 그릇을 항상 가득 채웁니다.",
      "담는 그릇이 바뀌면 부피가 변합니다."
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
    "explanation": "고체는 비교적 단단하며, 손으로 잡을 수 있고, 담는 그릇이 바뀌어도 모양과 부피가 바뀌지 않습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'(정답 2 개)'의 '2'와 '개' 사이 간격은 인쇄된 대로 띄어 적음."
    }
  },
  {
    "id": "s32-u04-o4-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 5,
      "page": 1,
      "sourceId": "sci-32-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "액체인 물체 고르기",
      "concept": "눈에 보이지만 흘러내려 손으로 잡을 수 없는 상태는 액체이며, 식초가 액체이다."
    },
    "prompt": "다음에서 설명하는 상태인 물체를 고르세요.",
    "givens": {
      "지문": "눈으로 볼 수 있지만 흘러내려 손으로 잡을 수 없습니다."
    },
    "choices": [
      "식초",
      "연필",
      "산소",
      "공기",
      "지우개"
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
    "explanation": "눈으로 볼 수 있지만 흘러내려 손으로 잡을 수 없는 것은 액체입니다. 식초는 액체, 연필과 지우개는 고체, 산소와 공기는 기체입니다.",
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
    "id": "s32-u04-o4-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 6,
      "page": 1,
      "sourceId": "sci-32-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물의 모양과 부피 변화",
      "concept": "물(액체)은 담는 그릇에 따라 모양은 변하지만 부피는 변하지 않는다."
    },
    "prompt": "물을 여러 가지 모양의 투명한 그릇에 옮겨 담으면서 물의 모양과 부피 변화를 관찰하였습니다. 이에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "다른 그릇에 옮겨 담기 어렵습니다.",
      "담는 그릇에 따라 물의 부피가 변합니다.",
      "담는 그릇에 따라 물의 모양이 변합니다.",
      "물을 다른 그릇에 옮겨 담으면 그릇의 모양이 변합니다.",
      "담는 그릇이 달라져도 그릇에 담긴 물의 높이는 변하지 않습니다."
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
    "explanation": "물은 담는 그릇에 따라 모양이 변하지만 부피는 변하지 않습니다.",
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
    "id": "s32-u04-o4-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 7,
      "page": 2,
      "sourceId": "sci-32-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "식용유가 액체인 까닭",
      "concept": "식용유는 담는 그릇에 따라 모양은 변하지만 부피는 변하지 않으므로 액체이다."
    },
    "prompt": "식용유를 액체라고 할 수 있는 까닭으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "색깔이 노란색이고 손으로 잡을 수 없습니다.",
      "담는 그릇에 따라 모양과 부피가 모두 변합니다.",
      "담는 그릇과 상관없이 모양과 부피가 변하지 않습니다.",
      "담는 그릇에 따라 부피는 달라지지만 모양은 변하지 않습니다.",
      "담는 그릇에 따라 모양은 달라지지만 부피가 변하지 않습니다."
    ],
    "figure": "assets/bank/s32-u04/s4-q07.webp",
    "figureNote": "병에서 유리 그릇으로 노란 식용유를 따르는 사진(올리브 열매가 곁에 있음).",
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
    "explanation": "액체는 담는 그릇에 따라 모양은 변하지만 부피는 변하지 않는 물질의 상태입니다.",
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
    "id": "s32-u04-o4-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 8,
      "page": 2,
      "sourceId": "sci-32-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "액체가 아닌 물질",
      "concept": "소금은 알갱이가 작아 흘러내리는 것처럼 보여도 각 알갱이의 모양이 일정한 고체이다."
    },
    "prompt": "액체가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "꿀",
      "소금",
      "알코올",
      "바닷물",
      "액상 세제"
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
    "explanation": "액체는 손으로 잡기 어렵고 흘러내리는 성질이 있습니다. 소금은 알갱이의 크기가 작은 고체입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "문항의 '아닌'에 밑줄이 그어져 있음."
    }
  },
  {
    "id": "s32-u04-o4-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 9,
      "page": 2,
      "sourceId": "sci-32-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "상태가 다른 물체",
      "concept": "간장은 액체이고 클립·연필·스펀지·스타이로폼 공은 고체이다."
    },
    "prompt": "물체의 상태가 나머지와 다른 것을 고르세요.",
    "givens": null,
    "choices": [
      "클립",
      "연필",
      "간장",
      "스펀지",
      "스타이로폼 공"
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
    "explanation": "간장은 액체이고, 클립, 연필, 스펀지, 스타이로폼 공은 고체입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "문항의 '다른'에 밑줄이 그어져 있음."
    }
  },
  {
    "id": "s32-u04-o4-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 10,
      "page": 2,
      "sourceId": "sci-32-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "공기가 있음을 아는 방법",
      "concept": "바람을 느끼거나 바람에 물체가 움직이는 것으로 우리 주변에 공기가 있음을 알 수 있다."
    },
    "prompt": "우리 주변에 공기가 있는 것을 알 수 있는 방법으로 옳은 것을 <보기>에서 모두 골라 짝 지은 것은?",
    "givens": {
      "보기": [
        "ㄱ. 부채로 바람을 일으키면 시원합니다.",
        "ㄴ. 선풍기를 켜면 머리카락이 뒤로 날립니다.",
        "ㄷ. 상가 앞에 있는 광고 인형이 바람에 움직입니다."
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
    "explanation": "부채로 만든 바람, 선풍기로 만든 바람, 바람에 의해 움직이는 광고 인형을 통해 우리 주변에 공기가 있다는 것을 알 수 있습니다.",
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
    "id": "s32-u04-o4-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 11,
      "page": 2,
      "sourceId": "sci-32-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "구멍 없는 컵을 밀어 넣었을 때",
      "concept": "구멍이 없는 컵 안의 공기는 빠져나가지 못하고 공간을 차지하므로 페트병 뚜껑이 수조 바닥까지 내려간다."
    },
    "prompt": "플라스틱 컵을 수조 바닥까지 밀어 넣었을 때의 모습으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[11~12] 다음과 같이 바닥에 구멍이 뚫리지 않은 투명한 플라스틱 컵을 뒤집어 물 위에 띄워져 있는 페트병 뚜껑을 덮은 뒤 수조 바닥까지 천천히 밀어 넣었습니다. 물음에 답하세요.",
      "보기": [
        "ㄱ. (그림: 컵을 수조 바닥까지 밀어 넣었는데 페트병 뚜껑이 컵 위쪽, 바깥 물 높이와 같은 높이에 떠 있음)",
        "ㄴ. (그림: 컵을 수조 바닥까지 밀어 넣었을 때 페트병 뚜껑이 컵과 함께 수조 바닥까지 내려가 있음)"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u04/s4-q11.webp",
    "figureNote": "<보기> 상자 안의 그림 두 개. ㄱ: 컵을 바닥까지 눌렀는데 빨간 페트병 뚜껑이 컵 윗부분(바깥 수면 높이)에 있음. ㄴ: 빨간 페트병 뚜껑이 컵 안에서 수조 바닥까지 내려가 있음. [11~12] 공통 실험 그림은 같은 쪽 bbox [358, 377, 505, 483].",
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
    "explanation": "바닥에 구멍이 뚫리지 않은 컵을 수조 바닥까지 밀어 넣으면 컵 안의 공기가 빠져나가지 않으므로 페트병 뚜껑이 수조 바닥으로 내려가고, 수조의 물 높이가 약간 높아집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>가 그림으로만 되어 있어 givens.보기의 ㄱ·ㄴ 설명은 그림을 말로 옮긴 것임(인쇄 문구 아님). [11~12] 공통 실험 그림(bbox [358, 377, 505, 483])도 있으나 figure 칸에는 정답 판단에 필요한 <보기> 그림을 넣음."
    }
  },
  {
    "id": "s32-u04-o4-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 12,
      "page": 3,
      "sourceId": "sci-32-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "컵 실험으로 알 수 있는 공기의 성질",
      "concept": "물속으로 밀어 넣은 컵 안의 공기가 물을 밀어내는 것으로 공기가 공간을 차지함을 알 수 있다."
    },
    "prompt": "위 실험 결과로 알 수 있는 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[11~12] 다음과 같이 바닥에 구멍이 뚫리지 않은 투명한 플라스틱 컵을 뒤집어 물 위에 띄워져 있는 페트병 뚜껑을 덮은 뒤 수조 바닥까지 천천히 밀어 넣었습니다. 물음에 답하세요.",
      "보기": [
        "ㄱ. 공기는 물을 흡수합니다.",
        "ㄴ. 공기는 공간을 차지합니다.",
        "ㄷ. 공기는 물과 만나면 부피가 커집니다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u04/s4-q12.webp",
    "figureNote": "물이 담긴 수조에서 손으로 뒤집은 투명한 플라스틱 컵을 물 위의 빨간 페트병 뚜껑 위에 덮어 누르는 모습.",
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
    "explanation": "페트병 뚜껑과 수조 속 물의 높이 변화를 통해 공기는 공간을 차지한다는 것을 알 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "공통 실험 그림은 2쪽에 있음."
    }
  },
  {
    "id": "s32-u04-o4-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 13,
      "page": 3,
      "sourceId": "sci-32-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "공기베개와 공기의 성질",
      "concept": "공기베개는 공기를 넣어 부풀리므로 공기가 공간을 차지한다는 성질을 이용한다."
    },
    "prompt": "공기베개를 통해 알 수 있는 공기의 성질로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "물에 뜨는 성질",
      "무색투명한 성질",
      "눈에 보이지 않는 성질",
      "온도가 변할 수 있는 성질",
      "일정한 공간을 차지하는 성질"
    ],
    "figure": "assets/bank/s32-u04/s4-q13.webp",
    "figureNote": "공기를 넣어 부풀린 U자 모양의 회색 공기베개 사진.",
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
    "explanation": "공기베개는 공기를 넣어 모양을 잡는 물체입니다. 이를 통해 공기가 일정한 공간을 차지한다는 것을 알 수 있습니다.",
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
    "id": "s32-u04-o4-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 14,
      "page": 3,
      "sourceId": "sci-32-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E5",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "주사기와 비닐관으로 공기 이동",
      "concept": "주사기 피스톤을 밀고 당기면 비닐관을 통해 공기가 이동하여 다른 주사기의 피스톤을 움직인다."
    },
    "prompt": "다음과 같이 스타이로폼 공을 붙인 주사기와 다른 주사기를 비닐관으로 연결한 뒤 왼쪽 주사기의 피스톤을 밀었다가 당기면 스타이로폼 공이 움직입니다. 주사기 안에서 무엇이 이동하기 때문에 스타이로폼 공이 움직이는지 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s32-u04/s4-q14.webp",
    "figureNote": "두 손으로 왼쪽 주사기를 잡고, 비닐관으로 연결된 오른쪽 주사기 피스톤 끝에 파란 공이 붙은 그림. 라벨: '스타이로폼 공', '비닐관'.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "공기",
      "accepted": [
        "공기"
      ]
    },
    "explanation": "왼쪽 주사기의 피스톤을 밀면 주사기 속 공기가 이동하면서 오른쪽 주사기의 피스톤을 밀어내고, 왼쪽 주사기의 피스톤을 당기면 오른쪽 주사기의 피스톤이 제자리로 돌아옵니다. 이때 주사기 끝에 붙어 있는 스타이로폼 공도 같이 움직입니다.",
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
    "id": "s32-u04-o4-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 15,
      "page": 3,
      "sourceId": "sci-32-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "풍선 속 공기의 성질",
      "concept": "기체인 공기는 담긴 그릇(풍선)을 가득 채우며 그릇 모양에 따라 모양이 달라진다."
    },
    "prompt": "풍선 안에 들어 있는 공기에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "눈에 잘 보입니다.",
      "풍선 안을 가득 채웁니다.",
      "손으로 잡을 수 있습니다.",
      "액체와 비슷한 성질을 가집니다.",
      "풍선의 모양에 따라 공기의 모양이 달라집니다."
    ],
    "figure": "assets/bank/s32-u04/s4-q15.webp",
    "figureNote": "여러 색의 부풀린 풍선 사진(가운데 노란 풍선).",
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
    "explanation": "기체인 공기는 담는 그릇을 항상 가득 채우고, 담는 그릇에 따라 모양이나 부피가 변합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'(정답 2 개)'의 '2'와 '개' 사이 간격은 인쇄된 대로 띄어 적음."
    }
  },
  {
    "id": "s32-u04-o4-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 16,
      "page": 4,
      "sourceId": "sci-32-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "공기를 넣은 페트병의 무게",
      "concept": "공기 주입 마개를 누르면 페트병 안의 공기 양이 늘어 무게가 늘어나므로 공기에는 무게가 있다."
    },
    "prompt": "위 실험에서 페트병의 무게가 다른 까닭으로 옳은 것을 고르세요.",
    "givens": {
      "지문": "[16~17] 페트병 입구에 공기 주입 마개를 끼우고, 공기 주입 마개를 누르기 전과 공기 주입 마개를 누른 후의 무게를 각각 측정하였더니 다음과 같았습니다. 물음에 답하세요.",
      "표": {
        "공기 주입 마개를 누르기 전": [
          "46.9 g"
        ],
        "공기 주입 마개를 누른 후": [
          "47.5 g"
        ]
      }
    },
    "choices": [
      "페트병에 물이 들어가기 때문입니다.",
      "페트병의 크기가 달라지기 때문입니다.",
      "압축 마개의 모양이 달라지기 때문입니다.",
      "페트병에 들어 있는 공기의 양이 달라지기 때문입니다.",
      "페트병의 무게를 재는 저울의 종류가 다르기 때문입니다."
    ],
    "figure": "assets/bank/s32-u04/s4-q16.webp",
    "figureNote": "공기 주입 마개(라벨)를 끼운 페트병을 전자저울 위에 올려놓은 그림과, 그 아래 누르기 전·후 무게 표(46.9 g, 47.5 g).",
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
    "explanation": "공기 주입 마개를 누르면 페트병 안으로 공기가 더 많이 들어가 페트병의 무게가 늘어납니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "선택지 ③은 '공기 주입 마개'가 아니라 '압축 마개'로 인쇄되어 있음(그대로 옮김). 공통 그림·표는 3쪽에 있음."
    }
  },
  {
    "id": "s32-u04-o4-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 17,
      "page": 4,
      "sourceId": "sci-32-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "누른 횟수와 페트병 무게",
      "concept": "공기 주입 마개를 많이 누를수록 페트병 안 공기의 양이 많아져 무게가 더 무거워진다."
    },
    "prompt": "공기 주입 마개를 누르는 횟수를 다르게 하였을 때 페트병의 무게가 가장 무거운 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[16~17] 페트병 입구에 공기 주입 마개를 끼우고, 공기 주입 마개를 누르기 전과 공기 주입 마개를 누른 후의 무게를 각각 측정하였더니 다음과 같았습니다. 물음에 답하세요.",
      "표": {
        "공기 주입 마개를 누르기 전": [
          "46.9 g"
        ],
        "공기 주입 마개를 누른 후": [
          "47.5 g"
        ]
      },
      "보기": [
        "ㄱ. 공기 주입 마개를 10 번 눌렀을 때",
        "ㄴ. 공기 주입 마개를 20 번 눌렀을 때",
        "ㄷ. 공기 주입 마개를 30 번 눌렀을 때"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u04/s4-q16.webp",
    "figureNote": "공기 주입 마개(라벨)를 끼운 페트병을 전자저울 위에 올려놓은 그림과, 그 아래 누르기 전·후 무게 표(46.9 g, 47.5 g).",
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
    "explanation": "공기 주입 마개를 누르는 횟수가 늘어날수록 페트병 안 공기의 양이 많아져 무게가 늘어납니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "공통 그림·표는 3쪽에 있음. 해설은 정답 PDF 1쪽 끝(17. ㄷ)에서 2쪽으로 이어짐."
    }
  },
  {
    "id": "s32-u04-o4-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 18,
      "page": 4,
      "sourceId": "sci-32-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물질의 상태 비교",
      "concept": "고체는 그릇이 바뀌어도 모양이 일정하고, 액체와 기체는 그릇에 따라 모양이 변한다."
    },
    "prompt": "물질의 상태에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "액체는 담는 그릇에 따라 부피가 변합니다.",
      "모든 물질은 일정한 모양을 가지고 있습니다.",
      "우리 주변의 대부분의 물질은 부피가 일정합니다.",
      "고체는 담는 그릇이 바뀌어도 모양이 변하지 않습니다.",
      "기체는 담는 그릇에 따라 모양은 변하지만 부피는 변하지 않습니다."
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
    "explanation": "고체는 담는 그릇이 바뀌어도 모양이 변하지 않지만, 액체와 기체는 담는 그릇이 바뀌면 모양이 변합니다.",
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
    "id": "s32-u04-o4-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 19,
      "page": 4,
      "sourceId": "sci-32-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물질을 상태에 따라 분류",
      "concept": "나무는 고체, 물·주스·바닷물은 액체, 공기는 기체이다."
    },
    "prompt": "<보기>의 물질들을 상태에 따라 바르게 분류한 것을 고르세요.",
    "givens": {
      "보기": [
        "ㄱ. 물",
        "ㄴ. 주스",
        "ㄷ. 공기",
        "ㄹ. 나무",
        "ㅁ. 바닷물"
      ]
    },
    "choices": [
      "ㄷ, ㄹ / ㄱ, ㄴ / ㅁ",
      "ㄱ, ㄴ, ㅁ / ㄹ / ㄷ",
      "ㄱ, ㄴ / ㄷ, ㄹ / ㅁ",
      "ㄹ / ㄱ, ㄴ, ㅁ / ㄷ",
      "ㄴ, ㅁ / ㄱ / ㄷ, ㄹ"
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
    "explanation": "나무는 고체, 물, 주스, 바닷물은 액체, 공기는 기체입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "선택지가 표 형식임. 열 머리: 고체 / 액체 / 기체 (각 행을 '고체 / 액체 / 기체' 순으로 적음)."
    }
  },
  {
    "id": "s32-u04-o4-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 20,
      "page": 4,
      "sourceId": "sci-32-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅳ. 물질의 상태"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "장난감 재료의 상태",
      "concept": "빨대와 탁구공은 고체이고 공기는 기체이다."
    },
    "prompt": "괄호 ㉠과 ㉡에 들어갈 알맞은 말을 골라 각각 쓰세요.",
    "givens": {
      "지문": "빨대로 바람을 부는 축구 장난감은 ㉠( 고체, 액체, 기체 )인 빨대와 탁구공, ㉡( 고체, 액체, 기체 )인 공기를 이용하여 만든 장난감입니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-고체, ㉡-기체",
      "accepted": [
        "㉠-고체, ㉡-기체",
        "㉠ 고체, ㉡ 기체",
        "고체, 기체",
        "고체,기체",
        "고체 기체",
        "ㄱ-고체, ㄴ-기체"
      ]
    },
    "explanation": "빨대와 탁구공은 고체, 공기는 기체입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란은 '㉠-(   ), ㉡-(   )' 형식으로 인쇄됨."
    }
  }
];
