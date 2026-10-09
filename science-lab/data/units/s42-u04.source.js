// 4-2 Ⅳ 화산과 지진 — 단원평가 원문 70문항(시매쓰DMC 최다빈출 단원평가 세트1·2·3·4). 시험지를 그대로 옮기고 정답 및 풀이와 대조했다.
// 원장 지시(2026-10-09): 원문을 그대로 문제은행에 쓴다. 그림은 시험지에서 잘라 낸 것(assets/bank/s42-u04/).
export const source = [
  {
    "id": "s42-u04-o1-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 1,
      "page": 1,
      "sourceId": "sci-42-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화산의 뜻",
      "concept": "화산은 땅속 깊은 곳의 마그마가 지표면으로 분출하여 만들어진 지형이다."
    },
    "prompt": "다음에서 설명하는 지형은 무엇인지 고르세요.",
    "givens": {
      "지문": "땅속 깊은 곳에서 암석이 녹은 마그마가 지표면으로 분출하여 만들어진 지형입니다."
    },
    "choices": [
      "지층",
      "지표",
      "화산",
      "용암",
      "언덕"
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
    "explanation": "화산은 땅속의 마그마가 지표면으로 분출하여 만들어진 지형입니다.",
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
    "id": "s42-u04-o1-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 2,
      "page": 1,
      "sourceId": "sci-42-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화산의 특징",
      "concept": "화산은 크기와 생김새가 다양하고, 용암이나 화산재가 쌓여 주변 지형보다 높다."
    },
    "prompt": "화산에 대한 설명으로 옳지 않은 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "크기가 다양합니다.",
      "생김새가 모두 비슷합니다.",
      "우리나라에도 화산이 있습니다.",
      "마그마가 분출한 흔적이 있습니다.",
      "용암이나 화산재가 쌓이기 때문에 주변 지형보다 낮습니다."
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
    "explanation": "화산은 크기와 생김새가 다양하며, 용암이나 화산재가 쌓여 주변 지형보다 높습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄이 있음. '(정답 2 개)'는 숫자와 '개' 사이가 띄어 인쇄됨."
    }
  },
  {
    "id": "s42-u04-o1-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 3,
      "page": 1,
      "sourceId": "sci-42-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "분화구",
      "concept": "화산 꼭대기에 움푹 파인 곳을 분화구라고 하며, 분화구에 물이 고여 호수가 된 화산도 있다."
    },
    "prompt": "빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 화산 꼭대기에 움푹 파인 곳을 □(이)라고 합니다.\n• 화산 중에는 □에 물이 고여 있는 것도 있습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "분화구",
      "accepted": [
        "분화구",
        "분 화 구"
      ]
    },
    "explanation": "화산 꼭대기에 움푹 파인 곳을 분화구라고 합니다. 화산 중에는 분화구에 물이 고여 있는 것도 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸(네모 상자)은 □로 표기함."
    }
  },
  {
    "id": "s42-u04-o1-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 4,
      "page": 1,
      "sourceId": "sci-42-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화산 분출 모형실험 순서",
      "concept": "화산 분출 모형실험은 마시멜로에 식용 색소를 뿌리고 포일로 감싼 뒤 은박 접시에 올려 가열하는 순서로 한다."
    },
    "prompt": "화산 분출 모형실험 과정을 순서에 맞게 기호를 나열하세요.",
    "givens": {
      "지문": "[04~05] 다음은 화산 분출 모형실험의 과정을 순서 없이 나열한 것입니다. 물음에 답하세요.",
      "보기": [
        "ㄱ. 은박 접시를 알코올램프로 가열합니다.",
        "ㄴ. 알루미늄 포일로 마시멜로를 감싼 뒤 윗부분을 열어 둡니다.",
        "ㄷ. 알루미늄 포일 위에 마시멜로를 놓고 식용 색소를 뿌립니다.",
        "ㄹ. 마시멜로를 감싼 알루미늄 포일을 은박 접시 위에 올려놓습니다."
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
      "answer": "ㄷ → ㄴ → ㄹ → ㄱ",
      "accepted": [
        "ㄷ → ㄴ → ㄹ → ㄱ",
        "ㄷ→ㄴ→ㄹ→ㄱ",
        "ㄷ-ㄴ-ㄹ-ㄱ",
        "ㄷ, ㄴ, ㄹ, ㄱ",
        "ㄷㄴㄹㄱ"
      ]
    },
    "explanation": "알루미늄 포일 위에 마시멜로를 놓고 식용 색소를 뿌린 후 알루미늄 포일을 감싸 알코올램프로 가열합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답 칸은 '(  )→(  )→(  )→(  )' 꼴로 인쇄됨. 공통 상자의 항목(ㄱ~ㄹ)은 〈보기〉 표기가 없는 상자이나 givens.보기에 넣음."
    }
  },
  {
    "id": "s42-u04-o1-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 5,
      "page": 1,
      "sourceId": "sci-42-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화산 분출 모형실험 결과",
      "concept": "화산 분출 모형실험에서 녹아 흘러나오는 것은 마시멜로이고 알루미늄 포일은 녹지 않는다."
    },
    "prompt": "위 화산 분출 모형실험 결과로 옳지 않은 것을 고르세요.",
    "givens": {
      "지문": "[04~05] 다음은 화산 분출 모형실험의 과정을 순서 없이 나열한 것입니다. 물음에 답하세요.",
      "보기": [
        "ㄱ. 은박 접시를 알코올램프로 가열합니다.",
        "ㄴ. 알루미늄 포일로 마시멜로를 감싼 뒤 윗부분을 열어 둡니다.",
        "ㄷ. 알루미늄 포일 위에 마시멜로를 놓고 식용 색소를 뿌립니다.",
        "ㄹ. 마시멜로를 감싼 알루미늄 포일을 은박 접시 위에 올려놓습니다."
      ]
    },
    "choices": [
      "알루미늄 포일이 들썩입니다.",
      "알루미늄 포일이 녹아 흐릅니다.",
      "화산 모형 윗부분에서 연기가 피어오릅니다.",
      "알루미늄 포일 밖으로 흘러나온 마시멜로가 굳습니다.",
      "화산 모형 윗부분에서 녹은 마시멜로가 흘러나옵니다."
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
    "explanation": "알루미늄 포일은 녹지 않고 알루미늄 포일 안의 마시멜로가 녹아 흘러나옵니다.",
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
    "id": "s42-u04-o1-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 6,
      "page": 1,
      "sourceId": "sci-42-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화산 분출물의 상태",
      "concept": "화산 분출물 중 용암은 액체, 화산재는 고체, 화산 가스는 기체 상태이다."
    },
    "prompt": "화산 분출물의 상태를 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "고체 / 액체 / 기체",
      "액체 / 고체 / 기체",
      "액체 / 기체 / 고체",
      "기체 / 고체 / 액체",
      "기체 / 액체 / 고체"
    ],
    "figure": "assets/bank/s42-u04/s1-q06.webp",
    "figureNote": "선택지가 표로 인쇄됨: 열 머리 용암·화산재·화산 가스, 행 ①~⑤. 내용은 choices에 옮겨 적음.",
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
    "explanation": "화산 분출물 중 용암은 액체 상태, 화산재는 고체 상태, 화산 가스는 기체 상태입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "선택지는 표 형식. 열 머리: 용암 / 화산재 / 화산 가스."
    }
  },
  {
    "id": "s42-u04-o1-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 7,
      "page": 2,
      "sourceId": "sci-42-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화산 암석 조각",
      "concept": "화산 암석 조각은 화산이 분출할 때 나오는 고체 돌덩이로 크기가 매우 다양하다."
    },
    "prompt": "다음에서 설명하는 화산 분출물은 무엇인지 고르세요.",
    "givens": {
      "지문": "화산이 분출할 때 나오는 돌덩이로, 고체 상태이며, 크기가 매우 다양합니다."
    },
    "choices": [
      "용암",
      "화산재",
      "마그마",
      "화산 가스",
      "화산 암석 조각"
    ],
    "figure": "assets/bank/s42-u04/s1-q07.webp",
    "figureNote": "구멍이 숭숭 난 적갈색 돌 조각들이 잔뜩 모여 있는 사진(화산 암석 조각).",
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
    "explanation": "화산 암석 조각은 화산 활동이 일어날 때 나오는 돌덩이로, 고체 상태이며, 크기가 매우 다양합니다.",
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
    "id": "s42-u04-o1-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 8,
      "page": 2,
      "sourceId": "sci-42-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화강암의 특징",
      "concept": "화강암은 색이 밝고 반짝이는 알갱이가 보이며, 표면에 구멍이 많은 것은 현무암의 특징이다."
    },
    "prompt": "화강암에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "색깔이 밝습니다.",
      "반짝이는 알갱이가 있습니다.",
      "마그마의 활동으로 만들어졌습니다.",
      "밝은 바탕에 검은색 알갱이가 보입니다.",
      "표면에 크고 작은 구멍이 많이 뚫려 있습니다."
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
    "explanation": "표면에 크고 작은 구멍이 많이 뚫려 있는 것은 현무암의 특징입니다.",
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
    "id": "s42-u04-o1-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 9,
      "page": 2,
      "sourceId": "sci-42-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화강암과 현무암의 알갱이 크기",
      "concept": "화강암은 땅속 깊은 곳에서 마그마가 서서히 식어 알갱이가 크고, 현무암은 지표 가까이에서 빠르게 식어 알갱이가 작다."
    },
    "prompt": "화강암이 현무암보다 알갱이의 크기가 큰 까닭을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 화강암은 화산재가 굳어져 생긴 것이기 때문입니다.",
        "ㄴ. 화강암은 여러 가지 암석이 섞여 만들어졌기 때문입니다.",
        "ㄷ. 화강암은 땅속 깊은 곳에서 서서히 식어 만들어졌기 때문입니다."
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
        "ㄷ.",
        "화강암은 땅속 깊은 곳에서 서서히 식어 만들어졌기 때문입니다."
      ]
    },
    "explanation": "화강암은 땅속 깊은 곳에서 서서히 식어 만들어졌기 때문에 빠르게 식어 만들어진 현무암보다 알갱이의 크기가 큽니다.",
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
    "id": "s42-u04-o1-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 10,
      "page": 2,
      "sourceId": "sci-42-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진의 뜻",
      "concept": "지진은 땅이 끊어지면서 흔들리는 현상이다."
    },
    "prompt": "다음에서 설명하는 것은 무엇인지 고르세요.",
    "givens": {
      "지문": "땅이 끊어지면서 흔들리는 것"
    },
    "choices": [
      "지진",
      "해일",
      "태풍",
      "산사태",
      "화산 활동"
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
    "explanation": "땅이 끊어지면서 흔들리는 것을 지진이라고 합니다.",
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
    "id": "s42-u04-o1-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 11,
      "page": 2,
      "sourceId": "sci-42-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진의 발생",
      "concept": "지진은 육지뿐 아니라 바닷속 땅에서도 지구 내부의 힘을 오랫동안 받아 끊어지면 발생한다."
    },
    "prompt": "지진에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "바닷속 땅에서는 지진이 발생하지 않습니다.",
      "화산 활동에 의해 지진이 발생하기도 합니다.",
      "지진이 발생하면 땅이 흔들리거나 갈라집니다.",
      "지진이 발생하면 산에서 산사태가 발생하기도 합니다.",
      "땅이 지구 내부에서 작용하는 힘을 오랫동안 받아 끊어지면서 지진이 발생합니다."
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
    "explanation": "바닷속 땅도 지구 내부에서 작용하는 힘을 오랫동안 받으면 지진이 발생합니다.",
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
    "id": "s42-u04-o1-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 12,
      "page": 2,
      "sourceId": "sci-42-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진의 규모",
      "concept": "지진의 세기를 숫자로 나타낸 것을 규모라고 하며 숫자가 클수록 강한 지진이다."
    },
    "prompt": "다음은 단비가 쓴 일기의 일부분입니다. 빈칸에 들어갈 알맞은 말을 <보기>에서 골라 쓰세요.",
    "givens": {
      "지문": "오늘은 지진에 대해 배웠다. 2017 년에 이어 2018 년에도 경상북도 포항에서 □ 4.6의 지진이 발생했는데, 이를 통해 우리나라도 지진에 안전한 지역이 아님을 알게 되었다.",
      "보기": [
        "크기",
        "지수",
        "규모",
        "강도"
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
      "answer": "규모",
      "accepted": [
        "규모"
      ]
    },
    "explanation": "지진의 세기를 숫자로 나타낸 것을 규모라고 합니다. 규모의 숫자가 클수록 강한 지진이며, 지진 피해 정도도 커집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸(네모 상자)은 □로 표기함. '2017 년', '2018 년'은 숫자 글꼴 때문에 띄어 보이게 인쇄됨(원문 그대로 띄어 적음)."
    }
  },
  {
    "id": "s42-u04-o1-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 13,
      "page": 3,
      "sourceId": "sci-42-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진 발생 전 대처 방법",
      "concept": "지진에 대비해 비상용품을 준비하고 물건을 고정하며, 불을 쓰는 곳에는 소화기를 준비해 두어야 한다."
    },
    "prompt": "지진 발생 전 대처 방법으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "비상용품을 준비합니다.",
      "흔들리는 물건을 고정합니다.",
      "무거운 물건을 아래쪽에 내려 둡니다.",
      "지진 정보를 얻을 수 있는 방법을 알아 둡니다.",
      "불을 사용하는 장소에는 소화기를 치워 둡니다."
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
    "explanation": "불을 사용하는 장소에는 소화기를 준비해 두어 지진으로 인해 발생할 수 있는 화재에 대비합니다.",
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
    "id": "s42-u04-o1-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 14,
      "page": 3,
      "sourceId": "sci-42-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진 발생 시 대처 방법",
      "concept": "지진이 나면 계단으로 대피하고 전기·가스를 차단하며, 건물에서 떨어진 넓은 곳으로 피해야 한다."
    },
    "prompt": "지진이 발생했을 때의 대처 방법으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "승강기를 이용해 빠르게 대피합니다.",
      "집 안에 있을 때는 전깃불을 모두 켭니다.",
      "야외 활동을 할 때는 건물 옆으로 피합니다.",
      "학교에 있을 때는 운동장처럼 넓은 곳으로 대피합니다.",
      "열차에 있을 때는 문을 열고 뛰어나가 철로로 대피합니다."
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
    "explanation": "지진이 발생하면 승강기 대신 계단을 이용해 빠르게 대피합니다. 화재가 발생할 수 있으므로 전기와 가스를 차단해야 하며, 야외에서는 건물과 거리를 두고 넓은 공간으로 대피합니다. 열차에서는 손잡이나 기둥을 잡아 넘어지지 않도록 하고, 열차가 멈추면 안내 방송에 따라 행동합니다.",
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
    "id": "s42-u04-o1-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 15,
      "page": 3,
      "sourceId": "sci-42-4-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "교실에서 지진 발생 시 행동",
      "concept": "교실에서 지진이 나면 책상 아래로 들어가 책상 다리를 잡고 몸을 보호한 뒤, 흔들림이 멈추면 운동장으로 대피한다."
    },
    "prompt": "다음 그림을 보고, 교실에 있을 때 지진이 발생하면 어떻게 해야 하는지 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s42-u04/s1-q15.webp",
    "figureNote": "흔들리는 교실에서 두 학생이 책상 아래에 들어가 책상 다리를 잡고 웅크린 그림. 책이 떨어져 있음.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "책상 아래로 들어가 책상 다리를 꼭 잡고 몸을 보호합니다.",
      "rubric": {
        "required": [
          "책상 아래로 들어간다",
          "책상 다리를 잡고 몸을 보호한다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "정답: 행동을 정확하게 쓴 경우 (100%)"
        ]
      }
    },
    "explanation": "교실에 있을 때 지진이 발생하면 책상 아래로 들어가 몸을 보호하고, 흔들림이 멈추면 질서 있게 운동장으로 대피합니다.\n[채점 기준] 정답: 행동을 정확하게 쓴 경우 (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표는 '정답 | 행동을 정확하게 쓴 경우 | 100%' 한 줄뿐임."
    }
  },
  {
    "id": "s42-u04-o2-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 1,
      "page": 1,
      "sourceId": "sci-42-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "마그마의 뜻",
      "concept": "마그마는 땅속 깊은 곳에서 암석이 높은 열로 녹아 만들어진 물질이다."
    },
    "prompt": "다음에서 설명하는 것은 무엇인지 고르세요.",
    "givens": {
      "지문": "땅속 깊은 곳에서 암석이 녹은 것"
    },
    "choices": [
      "지진",
      "화강암",
      "마그마",
      "화산 분출물",
      "화산 암석 조각"
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
    "explanation": "땅속 깊은 곳에서 암석이 녹은 것을 마그마라고 합니다.",
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
    "id": "s42-u04-o2-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 2,
      "page": 1,
      "sourceId": "sci-42-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "백두산의 특징",
      "concept": "백두산은 마그마가 분출해 생긴 화산으로, 꼭대기의 분화구에 물이 고인 큰 호수인 천지가 있다."
    },
    "prompt": "백두산에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "산꼭대기가 넓고 편평합니다.",
      "산꼭대기에 분화구가 없습니다.",
      "산꼭대기에 큰 호수가 있습니다.",
      "마그마가 분출하여 생긴 지형입니다.",
      "지금도 용암이 흐르는 모습을 볼 수 있습니다."
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
    "explanation": "백두산은 땅속에서 마그마가 분출하여 생긴 화산으로, 산꼭대기에 움푹 파인 분화구와 큰 호수인 천지가 있습니다.",
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
    "id": "s42-u04-o2-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 3,
      "page": 1,
      "sourceId": "sci-42-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "기체 상태의 화산 분출물",
      "concept": "화산 분출물 가운데 기체 상태인 것은 화산 가스이며, 대부분이 수증기이고 여러 기체가 섞여 있다."
    },
    "prompt": "화산이 분출할 때 나오는 기체 상태의 물질을 고르세요.",
    "givens": null,
    "choices": [
      "용암",
      "마그마",
      "화산재",
      "화산 가스",
      "화산 암석 조각"
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
    "explanation": "화산 분출물 중 화산 가스는 기체 상태의 물질로 대부분 수증기이며, 여러 가지 기체가 섞여 있습니다.",
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
    "id": "s42-u04-o2-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 4,
      "page": 1,
      "sourceId": "sci-42-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화산 활동 모형실험의 목적",
      "concept": "마시멜로를 포일에 싸서 가열하는 모형실험은 화산 활동으로 어떤 물질이 나오는지 알아보기 위한 것이다."
    },
    "prompt": "다음 실험 과정은 무엇을 알아보기 위한 것인지 고르세요.",
    "givens": {
      "지문": "<실험 과정>\n㉠ 알루미늄 포일에 마시멜로와 빨간색 식용 색소를 넣습니다.\n㉡ 알루미늄 포일로 마시멜로를 감싼 뒤 윗부분을 조금 열어 둡니다.\n㉢ 마시멜로를 감싼 알루미늄 포일을 은박 접시 위에 올리고, 알코올램프로 가열합니다."
    },
    "choices": [
      "화산의 모양",
      "화산의 크기",
      "화산재의 색깔",
      "화산 암석 조각의 크기",
      "화산 활동으로 나오는 물질"
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
    "explanation": "알루미늄 포일 안 마시멜로의 변화를 통해 화산 활동으로 나오는 물질에 대해 알아보는 실험입니다.",
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
    "id": "s42-u04-o2-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 5,
      "page": 1,
      "sourceId": "sci-42-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화강암의 특징",
      "concept": "화강암은 색이 밝고 알갱이가 크며 여러 색 알갱이가 섞여 있고, 제주도에서 흔히 보이는 암석은 화강암이 아니라 현무암이다."
    },
    "prompt": "화강암에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "대체로 색깔이 밝습니다.",
      "제주도에서 많이 볼 수 있습니다.",
      "알갱이의 크기가 현무암보다 큽니다.",
      "불국사 돌계단을 만들 때 이용되었습니다.",
      "여러 가지 색깔의 알갱이가 섞여 있습니다."
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
    "explanation": "제주도에서 많이 볼 수 있는 것은 현무암입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「않은」에 밑줄이 그어져 있음."
    }
  },
  {
    "id": "s42-u04-o2-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 6,
      "page": 1,
      "sourceId": "sci-42-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화성암과 현무암",
      "concept": "마그마로 만들어진 암석을 화성암이라 하고, 그중 지표 가까이에서 빠르게 식어 만들어진 것이 현무암이다."
    },
    "prompt": "다음에서 설명하는 암석으로 옳은 것을 <보기>에서 모두 골라 짝 지은 것은?",
    "givens": {
      "지문": "• 마그마의 활동으로 만들어진 암석입니다.\n• 마그마가 지표 가까이에서 빠르게 식어서 만들어졌습니다.",
      "보기": [
        "ㄱ. 화성암",
        "ㄴ. 화강암",
        "ㄷ. 현무암"
      ]
    },
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ"
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
    "explanation": "마그마의 활동으로 만들어진 암석을 화성암이라고 합니다. 화성암 중에서 현무암은 마그마가 지표 가까이에서 빠르게 식어서 만들어진 암석입니다.",
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
    "id": "s42-u04-o2-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 7,
      "page": 2,
      "sourceId": "sci-42-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "현무암 표면의 구멍",
      "concept": "현무암 표면의 구멍은 마그마가 식는 동안 그 속의 화산 가스가 빠져나가며 남긴 자국이다."
    },
    "prompt": "현무암 표면에 있는 크고 작은 구멍에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "바람에 깎여서 생긴 것입니다.",
      "얼었던 물이 녹아서 생긴 것입니다.",
      "마그마가 서서히 식으면서 생긴 것입니다.",
      "마그마가 굳으면서 갈라져 생긴 것입니다.",
      "마그마가 식을 때 화산 가스가 빠져나가 생긴 것입니다."
    ],
    "figure": "assets/bank/s42-u04/s2-q07.webp",
    "figureNote": "표면에 크고 작은 구멍이 많은 어두운 갈색 현무암 두 개의 사진.",
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
    "explanation": "현무암은 마그마가 지표 가까이에서 빠르게 식어 만들어진 암석으로, 표면에 구멍이 있는 것도 있고, 없는 것도 있습니다. 현무암 표면의 구멍은 마그마가 식을 때 화산 가스가 빠져나간 흔적입니다.",
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
    "id": "s42-u04-o2-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 8,
      "page": 2,
      "sourceId": "sci-42-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화산 활동의 피해",
      "concept": "화산 활동은 산사태나 햇빛 차단에 따른 날씨 변화 같은 피해를 주지만, 땅을 기름지게 하거나 관광 자원이 되는 이로움도 준다."
    },
    "prompt": "화산 활동이 우리 생활에 주는 피해로 옳은 것을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "보기": [
        "ㄱ. 화산재가 땅을 기름지게 합니다.",
        "ㄴ. 화산 분출로 산사태가 일어납니다.",
        "ㄷ. 화산재가 햇빛을 가려서 날씨의 변화가 나타납니다.",
        "ㄹ. 화산 활동으로 만들어진 특이한 지형은 관광지로 이용됩니다."
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
      "answer": "ㄴ, ㄷ",
      "accepted": [
        "ㄴ, ㄷ",
        "ㄴ,ㄷ",
        "ㄴㄷ",
        "ㄴ ㄷ"
      ]
    },
    "explanation": "화산재로 땅이 기름져지고, 화산 활동 지형을 관광지로 이용하는 것은 화산 활동이 우리 생활에 주는 이로움입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란이 「(   ), (   )」 두 칸으로 인쇄됨."
    }
  },
  {
    "id": "s42-u04-o2-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 9,
      "page": 2,
      "sourceId": "sci-42-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화산 가스의 피해",
      "concept": "화산 가스에는 해로운 성분이 들어 있어 사람이 들이마시면 호흡기 질병이 생길 수 있다."
    },
    "prompt": "화산 분출물의 영향 중 화산 가스에 의해 생길 수 있는 피해로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "산불이 납니다.",
      "산사태가 납니다.",
      "관광 자원으로 활용됩니다.",
      "호흡기 질병을 일으킵니다.",
      "비행기의 엔진을 망가뜨립니다."
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
    "explanation": "화산이 분출하면서 나오는 화산 가스는 유독한 성분을 포함하고 있기 때문에 이로 인해 호흡기 질병에 걸릴 수 있습니다.",
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
    "id": "s42-u04-o2-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 10,
      "page": 2,
      "sourceId": "sci-42-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "땅속 열의 이용",
      "concept": "화산 주변 땅속의 높은 열은 온천 개발과 지열 발전에 이용된다."
    },
    "prompt": "화산 주변 땅속의 높은 열을 이용하는 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "온천",
      "돌하르방",
      "수력 발전",
      "지열 발전",
      "용암 동굴"
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
    "explanation": "화산 주변 땅속의 높은 열을 이용해 온천을 개발하거나 지열 발전을 통해 전기를 만들 수 있습니다.",
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
    "id": "s42-u04-o2-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 11,
      "page": 2,
      "sourceId": "sci-42-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진 발생 모형실험 관찰",
      "concept": "우드록을 양손으로 계속 밀면 휘어지다가 소리와 떨림을 내며 끊어지는데, 이는 화산 분출이 아니라 지진이 일어나는 모습을 나타낸다."
    },
    "prompt": "위 실험에 대한 설명으로 옳은 것을 <보기>에서 모두 골라 짝 지은 것은?",
    "givens": {
      "지문": "[11~12] 다음은 우드록을 양손으로 밀면서 나타나는 현상을 관찰하는 지진 발생 모형실험을 하는 모습입니다. 물음에 답하세요.",
      "보기": [
        "ㄱ. ㈏에서 우드록이 끊어질 때 소리가 납니다.",
        "ㄴ. ㈎에서 계속 힘을 주면 우드록이 끊어집니다.",
        "ㄷ. ㈏에서 우드록이 끊어질 때 손에 떨림이 느껴집니다.",
        "ㄹ. ㈏에서 우드록이 끊어지는 것은 화산이 분출할 때의 모습을 나타냅니다."
      ]
    },
    "choices": [
      "ㄱ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ, ㄹ"
    ],
    "figure": "assets/bank/s42-u04/s2-q11.webp",
    "figureNote": "실험복을 입은 사람이 우드록을 양손으로 미는 그림 두 장면. ㈎ 우드록이 휘어진 모습, ㈏ 우드록이 가운데에서 끊어져 꺾인 모습.",
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
    "explanation": "우드록이 끊어지는 것은 지진이 일어날 때의 모습을 나타냅니다.",
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
    "id": "s42-u04-o2-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 12,
      "page": 3,
      "sourceId": "sci-42-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진 발생 모형실험과 실제 비교",
      "concept": "지진 모형실험에서 우드록은 땅, 양손으로 미는 힘은 지구 내부에서 작용하는 힘, 우드록이 끊어질 때의 떨림은 지진에 해당한다."
    },
    "prompt": "다음은 지진 발생 모형실험과 실제 자연 현상을 비교한 것입니다. 빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 각각 쓰세요.",
    "givens": {
      "지문": "[11~12] 다음은 우드록을 양손으로 밀면서 나타나는 현상을 관찰하는 지진 발생 모형실험을 하는 모습입니다. 물음에 답하세요.",
      "표": {
        "지진 발생 모형실험": [
          "우드록",
          "양손으로 미는 힘",
          "우드록이 끊어질 때의 떨림"
        ],
        "실제 자연 현상": [
          "땅",
          "㉠ 내부에서 작용하는 힘",
          "㉡"
        ]
      }
    },
    "choices": null,
    "figure": "assets/bank/s42-u04/s2-q12.webp",
    "figureNote": "지진 발생 모형실험과 실제 자연 현상을 비교한 2열 표(㉠은 네모 빈칸, ㉡은 빈칸). extra는 [11~12] 공유 그림(우드록 ㈎ 휘어짐, ㈏ 끊어짐).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-지구, ㉡-지진",
      "accepted": [
        "㉠-지구, ㉡-지진",
        "㉠ 지구, ㉡ 지진",
        "지구, 지진",
        "지구,지진",
        "지구 지진"
      ]
    },
    "explanation": "지진 발생 모형실험에서 우드록은 땅, 양손으로 미는 힘은 지구 내부에서 작용하는 힘, 우드록이 끊어질 때의 떨림은 지진을 나타냅니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "표의 ㉠은 「내부에서」 앞의 네모 빈칸 안에 인쇄됨. 답란이 「㉠-(   ), ㉡-(   )」로 인쇄됨."
    }
  },
  {
    "id": "s42-u04-o2-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 13,
      "page": 3,
      "sourceId": "sci-42-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진이 발생하는 까닭",
      "concept": "지진은 땅이 지구 내부의 힘을 받아 끊어지거나, 지표의 약한 부분·지하 동굴이 무너지거나, 화산 활동이 일어날 때 발생하며 태풍과는 관련이 없다."
    },
    "prompt": "지진이 발생하는 까닭과 가장 관련이 없는 것을 고르세요.",
    "givens": null,
    "choices": [
      "태풍이 이동해 올 때",
      "화산 활동이 일어날 때",
      "지하 동굴이 무너질 때",
      "지표의 약한 부분이 무너질 때",
      "땅이 지구 내부에서 작용하는 힘을 받아 끊어질 때"
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
    "explanation": "땅이 지구 내부에서 작용하는 힘을 오랫동안 받으면 휘어지거나 끊어지면서 지진이 발생합니다. 지표의 약한 부분이나 지하 동굴이 무너지거나, 화산 활동이 일어날 때 지진이 발생하기도 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「없는」에 밑줄이 그어져 있음."
    }
  },
  {
    "id": "s42-u04-o2-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 14,
      "page": 3,
      "sourceId": "sci-42-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진의 규모와 피해",
      "concept": "지진의 세기는 규모라는 숫자로 나타내며 숫자가 클수록 강하고 피해도 크며, 우리나라에서도 규모 5.0 이상의 지진이 일어난 적이 있다."
    },
    "prompt": "지진에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "지진의 세기는 규모로 나타냅니다.",
      "규모의 숫자가 클수록 강한 지진입니다.",
      "규모가 큰 지진이 발생하면 피해 정도가 커집니다.",
      "지진이 발생하면 사람이 다치거나 건물이 무너지기도 합니다.",
      "우리나라에서는 규모 5.0 이상의 지진이 발생하지 않습니다."
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
    "explanation": "규모는 지진의 세기를 숫자로 나타낸 것으로, 규모의 숫자가 클수록 강한 지진이며, 지진 피해 정도도 커집니다. 2016년 경상북도 경주에서 규모 5.8의 지진이, 2017년 경상북도 포항에서 규모 5.4의 지진이 발생하였습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「않은」에 밑줄이 그어져 있음."
    }
  },
  {
    "id": "s42-u04-o2-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 15,
      "page": 3,
      "sourceId": "sci-42-4-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진 발생 시 대처 방법",
      "concept": "지진이 나면 승강기 대신 계단을 이용해 대피해야 하며, 승강기 안이라면 모든 층 버튼을 눌러 먼저 열리는 층에서 내린 뒤 계단으로 나간다."
    },
    "prompt": "다음은 지진이 발생했을 때의 대처 방법입니다. 빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 건물 안에 있을 때 지진이 발생하면 □(을)를 이용하여 신속하게 대피합니다.\n• 승강기 안에 있을 때 지진이 발생하면 모든 층의 버튼을 눌러 가장 먼저 열리는 층에서 내린 후 □(을)를 이용하여 대피합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "계단",
      "accepted": [
        "계단"
      ]
    },
    "explanation": "건물 안에 있을 때 지진이 발생하면 계단을 이용하여 신속하게 대피합니다. 승강기 안에 있을 때 지진이 발생하면 모든 층의 버튼을 눌러 가장 먼저 열리는 층에서 내린 후 계단을 이용하여 대피합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 빈칸은 빈 네모로 인쇄됨(여기서는 □로 표기)."
    }
  },
  {
    "id": "s42-u04-o3-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 1,
      "page": 1,
      "sourceId": "sci-42-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화산의 특징",
      "concept": "화산은 생김새가 다양하며 분화구에 호수가 있는 화산도 있고 없는 화산도 있다."
    },
    "prompt": "화산에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "화산의 생김새는 다양합니다.",
      "화산마다 경사나 높이가 다릅니다.",
      "땅속에서 마그마가 분출하여 생기는 지형입니다.",
      "용암이나 화산재가 쌓여 주변 지형보다 높습니다.",
      "모든 화산 꼭대기에는 물이 고인 커다란 호수가 있습니다."
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
    "explanation": "화산 분화구에 물이 고여 커다란 호수나 물웅덩이가 만들어진 것도 있고, 물이 고이지 않은 것도 있습니다.",
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
    "id": "s42-u04-o3-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 2,
      "page": 1,
      "sourceId": "sci-42-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화산들의 공통점",
      "concept": "여러 화산에는 공통적으로 마그마가 분출한 흔적이 있다."
    },
    "prompt": "여러 화산들의 공통점으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 화산은 경사가 완만합니다.",
        "ㄴ. 마그마가 분출한 흔적이 있습니다.",
        "ㄷ. 용암이나 화산재가 쌓여 주변 지형보다 낮습니다."
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
    "explanation": "화산은 용암이나 화산재가 쌓여 주변 지형보다 높으며, 흘러나온 용암의 성질에 따라 경사가 다양하게 만들어집니다.",
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
    "id": "s42-u04-o3-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 3,
      "page": 1,
      "sourceId": "sci-42-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화산 활동 모형실험",
      "concept": "화산 활동 모형실험에서 알루미늄 포일 윗부분을 약간 열어 두는 것은 분화구 역할을 하게 하기 위해서이다."
    },
    "prompt": "위 실험에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": {
      "지문": "[03~04] 다음과 같이 빨간색 식용 색소를 뿌린 마시멜로를 감싼 알루미늄 포일을 은박 접시 위에 올린 뒤 가열 장치로 가열하면서 나타나는 현상을 관찰하였습니다. 물음에 답하세요."
    },
    "choices": [
      "화산이 분출할 때 나오는 물질을 알아보는 실험입니다.",
      "용암의 색깔과 비교하여 관찰하기 위해 빨간색 식용 색소를 넣습니다.",
      "마시멜로가 쉽게 분출하지 못하도록 알루미늄 포일 윗부분을 막습니다.",
      "마시멜로를 감싼 알루미늄 포일을 가열하면 알루미늄 포일이 들썩거립니다.",
      "마시멜로를 감싼 알루미늄 포일을 가열하면 작은 마시멜로 덩어리가 튀어나오기도 합니다."
    ],
    "figure": "assets/bank/s42-u04/s3-q03.webp",
    "figureNote": "빨간색 식용 색소를 뿌린 마시멜로를 감싼 알루미늄 포일이 은박 접시 위에 놓여 가열 장치 위에 있는 그림. 이름표: '마시멜로를 감싼 알루미늄 포일', '가열 장치'.",
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
    "explanation": "마시멜로가 분출하기 쉽도록 알루미늄 포일의 윗부분을 약간 열어 두는데, 이것은 화산에서 분화구 역할을 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄. 공통 지문 [03~04]와 그림은 1쪽 왼쪽 단 아래, 03번은 오른쪽 단."
    }
  },
  {
    "id": "s42-u04-o3-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 4,
      "page": 1,
      "sourceId": "sci-42-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화산 활동 모형과 실제 화산 활동 비교",
      "concept": "화산 활동 모형의 연기는 화산 가스, 흘러나오는 마시멜로는 용암, 굳은 마시멜로는 용암이 굳은 암석에 해당한다."
    },
    "prompt": "다음은 위의 화산 활동 모형과 실제 화산 활동을 비교한 것입니다. 빈칸 ㉠~㉢에 들어갈 알맞은 말을 바르게 짝 지은 것을 고르세요.",
    "givens": {
      "지문": "[03~04] 다음과 같이 빨간색 식용 색소를 뿌린 마시멜로를 감싼 알루미늄 포일을 은박 접시 위에 올린 뒤 가열 장치로 가열하면서 나타나는 현상을 관찰하였습니다. 물음에 답하세요.",
      "표": {
        "화산 활동 모형": [
          "실제 화산 활동"
        ],
        "연기": [
          "㉠"
        ],
        "흘러나오는 마시멜로": [
          "㉡"
        ],
        "굳은 마시멜로": [
          "㉢"
        ]
      }
    },
    "choices": [
      "㉠ - 용암",
      "㉡ - 화산재",
      "㉡ - 화산 가스",
      "㉢ - 화산 가스",
      "㉢ - 용암이 굳어서 만들어진 암석"
    ],
    "figure": "assets/bank/s42-u04/s3-q04.webp",
    "figureNote": "화산 활동 모형과 실제 화산 활동을 비교한 표(연기/흘러나오는 마시멜로/굳은 마시멜로 ↔ ㉠/㉡/㉢). 내용은 givens.표에 옮김. extra는 [03~04] 공통 실험 그림.",
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
    "explanation": "연기는 화산 가스, 흘러나오는 마시멜로는 용암, 굳은 마시멜로는 용암이 굳어서 만들어진 암석을 나타냅니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "표 머리칸 '흘러 / 나오는 / 마시멜로'가 세 줄로 줄바꿈되어 있어 '흘러나오는'의 띄어쓰기가 불분명함(해설은 '흘러나오는'). 공통 지문 [03~04] 포함."
    }
  },
  {
    "id": "s42-u04-o3-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 5,
      "page": 1,
      "sourceId": "sci-42-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화산 분출물",
      "concept": "화산재는 화산이 분출할 때 나오는 고체 상태의 가루 물질이다."
    },
    "prompt": "화산이 분출할 때 나오는 물질에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "용암은 액체 분출물입니다.",
      "화산재는 기체 분출물입니다.",
      "화산 암석 조각의 크기는 매우 다양합니다.",
      "화산 가스에는 여러 가지 기체가 섞여 있습니다.",
      "화산이 분출할 때 나오는 물질을 화산 분출물이라고 합니다."
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
    "explanation": "화산재는 화산 활동이 일어날 때 나오는 가루 물질로, 고체 상태입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄(두 번째 줄)."
    }
  },
  {
    "id": "s42-u04-o3-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 6,
      "page": 2,
      "sourceId": "sci-42-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "용암의 뜻",
      "concept": "용암은 땅속 마그마가 지표 밖으로 분출하면서 기체 물질이 빠져나간 것이다."
    },
    "prompt": "다음에서 설명하는 것은 무엇인지 고르세요.",
    "givens": {
      "지문": "• 화산 분출물 중 하나입니다.\n• 마그마에서 기체가 빠져나간 것입니다."
    },
    "choices": [
      "용암",
      "수증기",
      "화산재",
      "화산 가스",
      "화산 암석 조각"
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
    "explanation": "땅속 마그마가 지표 밖으로 분출하면서 기체 물질이 빠져나간 것을 용암이라고 합니다.",
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
    "id": "s42-u04-o3-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 7,
      "page": 2,
      "sourceId": "sci-42-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화강암이 만들어지는 곳",
      "concept": "색깔이 밝고 여러 색 알갱이가 섞인 화강암은 마그마가 땅속 깊은 곳에서 천천히 식어 만들어진다."
    },
    "prompt": "다음과 같은 특징을 가지는 암석이 만들어지는 곳을 ㄱ과 ㄴ 중에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[07~09] 다음은 화산이 분출할 때 화강암과 현무암이 만들어지는 장소를 나타낸 것입니다. 물음에 답하세요.\n• 대체로 색깔이 밝습니다.\n• 여러 가지 색깔의 알갱이가 섞여 있습니다."
    },
    "choices": null,
    "figure": "assets/bank/s42-u04/s3-q07.webp",
    "figureNote": "화산 단면 모형 그림. ㄱ은 화산 아래 땅속 깊은 곳 마그마가 지나가는 곳(천천히 식어 화강암이 만들어지는 곳)을, ㄴ은 지표로 흘러나온 용암이 있는 곳(빠르게 식어 현무암이 만들어지는 곳)을 가리킨다.",
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
    "explanation": "대체로 색깔이 밝고, 여러 가지 색깔의 알갱이가 섞여 있는 암석은 화강암입니다. 화강암은 마그마가 땅속 깊은 곳에서 천천히 식어서 만들어집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "givens.지문에 공통 지문 [07~09]와 문항 상자(특징 2가지)를 함께 넣음."
    }
  },
  {
    "id": "s42-u04-o3-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 8,
      "page": 2,
      "sourceId": "sci-42-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화강암과 현무암의 이용",
      "concept": "화강암은 석굴암·불국사 돌계단 등에, 현무암은 돌하르방·맷돌 등에 이용된다."
    },
    "prompt": "위의 ㄱ과 ㄴ에서 만들어진 암석을 이용한 예를 바르게 짝 지은 것을 고르세요.",
    "givens": {
      "지문": "[07~09] 다음은 화산이 분출할 때 화강암과 현무암이 만들어지는 장소를 나타낸 것입니다. 물음에 답하세요."
    },
    "choices": [
      "맷돌 / 석굴암",
      "돌하르방 / 석굴암",
      "돌하르방 / 불국사 돌계단",
      "석굴암 / 돌하르방",
      "석굴암 / 불국사 돌계단"
    ],
    "figure": "assets/bank/s42-u04/s3-q07.webp",
    "figureNote": "화산 단면 모형 그림. ㄱ은 화산 아래 땅속 깊은 곳 마그마가 지나가는 곳(천천히 식어 화강암이 만들어지는 곳)을, ㄴ은 지표로 흘러나온 용암이 있는 곳(빠르게 식어 현무암이 만들어지는 곳)을 가리킨다.",
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
    "explanation": "ㄱ에서는 화강암, ㄴ에서는 현무암이 만들어집니다. 화강암은 석굴암, 불국사 돌계단, 컬링 스톤, 비석, 석탑, 교문 기둥 등에서 볼 수 있고, 현무암은 돌하르방, 제주도 돌담, 맷돌, 화분 등에서 볼 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기가 표 형식: 열 머리 'ㄱ / ㄴ', 각 행을 'ㄱ / ㄴ' 순서로 적음."
    }
  },
  {
    "id": "s42-u04-o3-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 9,
      "page": 2,
      "sourceId": "sci-42-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화강암과 현무암의 알갱이 크기",
      "concept": "마그마가 천천히 식은 화강암은 알갱이가 크고, 빠르게 식은 현무암은 알갱이가 작다."
    },
    "prompt": "위의 ㄱ과 ㄴ에서 만들어진 암석의 알갱이 크기를 비교하고 그 까닭을 쓰세요.",
    "givens": {
      "지문": "[07~09] 다음은 화산이 분출할 때 화강암과 현무암이 만들어지는 장소를 나타낸 것입니다. 물음에 답하세요."
    },
    "choices": null,
    "figure": "assets/bank/s42-u04/s3-q07.webp",
    "figureNote": "화산 단면 모형 그림. ㄱ은 화산 아래 땅속 깊은 곳 마그마가 지나가는 곳(천천히 식어 화강암이 만들어지는 곳)을, ㄴ은 지표로 흘러나온 용암이 있는 곳(빠르게 식어 현무암이 만들어지는 곳)을 가리킨다.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "ㄱ에서 만들어진 화강암이 ㄴ에서 만들어진 현무암보다 알갱이의 크기가 더 큽니다. 화강암은 마그마가 천천히 식어서 만들어졌고, 현무암은 마그마가 빠르게 식어서 만들어졌기 때문에 알갱이의 크기가 다릅니다.",
      "rubric": {
        "required": [
          "ㄱ(화강암)의 알갱이가 ㄴ(현무암)보다 크다",
          "화강암은 천천히, 현무암은 빠르게 식었다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "알갱이의 크기 비교와 그 까닭을 옳게 쓴 경우 (100%)",
          "알갱이의 크기 비교만 옳게 쓴 경우 (30%)"
        ]
      }
    },
    "explanation": "화강암은 마그마가 천천히 식어서 알갱이의 크기가 크고, 현무암은 마그마가 빠르게 식어서 알갱이의 크기가 작습니다.\n[채점 기준] 알갱이의 크기 비교와 그 까닭을 옳게 쓴 경우 (100%) / 알갱이의 크기 비교만 옳게 쓴 경우 (30%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표의 행 이름은 '정답'(100%)과 '부분 정답'(30%)."
    }
  },
  {
    "id": "s42-u04-o3-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 10,
      "page": 2,
      "sourceId": "sci-42-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화산 활동의 피해",
      "concept": "화산재는 항공기 운항을 어렵게 하고 화산 가스는 호흡기 질병을 일으킬 수 있다."
    },
    "prompt": "화산 활동이 우리 생활에 주는 피해로 옳은 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "화산 주변에 온천을 만들 수 있습니다.",
      "화산재의 영향으로 항공기 운항이 어려워집니다.",
      "화산재를 원료로 생활용품을 개발할 수 있습니다.",
      "화산 가스의 영향으로 호흡기 질병에 걸릴 수 있습니다.",
      "화산 활동이 일어난 지역을 관광지로 이용 할 수 있습니다."
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
    "explanation": "온천, 관광지, 생활용품 개발은 화산 활동이 주는 이로움입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "⑤ '이용 할'은 인쇄된 띄어쓰기 그대로. 발문 '(정답 2 개)'도 인쇄 그대로."
    }
  },
  {
    "id": "s42-u04-o3-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 11,
      "page": 2,
      "sourceId": "sci-42-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지열 발전",
      "concept": "화산 주변 땅속의 열을 이용해 전기를 만드는 것을 지열 발전이라고 한다."
    },
    "prompt": "다음은 화산 활동이 주는 이로움에 대한 설명입니다. 어떤 것에 대한 설명인지 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "화산 주변 땅속의 열을 이용해 전기를 만듭니다.",
      "보기": [
        "ㄱ. 풍력 발전",
        "ㄴ. 수력 발전",
        "ㄷ. 지열 발전"
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
    "explanation": "화산 주변 땅속의 열을 이용해 전기를 만드는 것을 지열 발전이라고 합니다. 풍력은 바람을 이용해 전기를 만드는 발전 방식이고, 수력을 물의 높이 차를 이용해 전기를 만드는 발전 방식입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설의 '수력을 물의 높이 차를'은 인쇄 그대로(조사 '은' 대신 '을')."
    }
  },
  {
    "id": "s42-u04-o3-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 12,
      "page": 3,
      "sourceId": "sci-42-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진의 뜻",
      "concept": "지진은 땅이 지구 내부의 힘을 받아 끊어지면서 흔들리는 현상이다."
    },
    "prompt": "빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "땅이 지구 내부에서 작용하는 힘을 받아 끊어지면서 흔들리는 것을 □(이)라고 합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
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
    "explanation": "땅이 지구 내부에서 작용하는 힘을 받아 끊어지면서 흔들리는 것을 지진이라고 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸 네모를 '□'로 적음."
    }
  },
  {
    "id": "s42-u04-o3-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 13,
      "page": 3,
      "sourceId": "sci-42-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진 발생 모형실험",
      "concept": "우드록을 밀어 끊어지게 하는 실험에서 우드록은 땅, 미는 힘은 지구 내부의 힘, 끊어질 때의 떨림은 지진을 나타낸다."
    },
    "prompt": "다음은 우드록을 양손으로 밀면서 나타나는 현상을 관찰하는 지진 발생 모형실험을 하는 모습입니다. 이에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "우드록은 땅을 의미합니다.",
      "우드록을 미는 힘은 지구 내부의 힘을 의미합니다.",
      "우드록을 밀어 우드록이 끊어질 때 손에 떨림이 느껴집니다.",
      "땅이 끊어지면서 흔들리는 현상이 어떻게 생기는지 알아보는 실험입니다.",
      "우드록을 밀면 우드록이 볼록하게 올라오는데, 이 현상은 지진이 일어나기 전 화산 활동을 의미합니다."
    ],
    "figure": "assets/bank/s42-u04/s3-q13.webp",
    "figureNote": "실험복을 입은 사람이 여러 겹의 우드록을 양손으로 잡고 양쪽에서 가운데로(파란 화살표) 미는 모습.",
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
    "explanation": "우드록에 힘을 계속 주어 밀면 우드록이 소리를 내며 끊어지고 손에 떨림이 느껴지는데, 이 현상은 지진을 의미합니다. 지진 발생에 대해 알아보는 실험이므로 화산 활동에 대한 내용은 알 수 없습니다.",
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
    "id": "s42-u04-o3-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 14,
      "page": 3,
      "sourceId": "sci-42-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진 발생의 원인",
      "concept": "지진은 지구 내부의 힘, 지표의 약한 부분이나 지하 동굴의 붕괴, 화산 활동 등으로 발생한다."
    },
    "prompt": "지진 발생의 원인으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "산불이 날 때",
      "화산 활동이 일어날 때",
      "지하 동굴이 무너질 때",
      "지구 내부의 힘이 작용할 때",
      "지표의 약한 부분이 끊어질 때"
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
    "explanation": "지진은 땅이 지구 내부에서 작용하는 힘을 오랫동안 받으면 휘어지거나 끊어지면서 발생합니다. 지표의 약한 부분이나 지하 동굴이 무너지거나, 화산 활동이 일어날 때 지진이 발생하기도 합니다.",
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
    "id": "s42-u04-o3-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 15,
      "page": 3,
      "sourceId": "sci-42-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진 피해 사례 조사 내용",
      "concept": "지진 피해 사례 조사에는 지진의 규모, 발생 날짜와 위치, 피해 정도가 필요하다."
    },
    "prompt": "단비는 지진 피해 사례에 대해 조사하려고 합니다. 조사할 내용으로 적절하지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "지진의 세기",
      "지진 발생 날짜",
      "지진 발생 위치",
      "지진 발생 지역의 습도",
      "지진으로 인한 피해 정도"
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
    "explanation": "지진 피해 사례를 조사하기 위해서는 지진의 세기(규모)와 지진 발생 날짜, 위치를 정확히 알고 지진으로 인한 피해 정도를 조사해야 합니다.",
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
    "id": "s42-u04-o3-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 16,
      "page": 3,
      "sourceId": "sci-42-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진의 규모",
      "concept": "규모는 지진의 세기를 숫자로 나타낸 것으로 숫자가 클수록 강한 지진이다."
    },
    "prompt": "빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• □(은)는 지진의 세기를 숫자로 나타낸 것입니다.\n• □(이)가 나타내는 숫자를 통해 지진 피해 정도를 예상할 수 있습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
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
    "explanation": "규모는 지진의 세기를 숫자로 나타낸 것입니다. 규모가 나타내는 숫자를 통해 지진 피해 정도를 예상할 수 있는데, 규모의 숫자가 클수록 강한 지진이며 지진 피해 정도도 커집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸 네모를 '□'로 적음."
    }
  },
  {
    "id": "s42-u04-o3-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 17,
      "page": 3,
      "sourceId": "sci-42-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "규모로 지진 세기 비교",
      "concept": "규모의 숫자가 작을수록 약한 지진이다."
    },
    "prompt": "위 표를 보고 가장 약한 지진이 일어난 연도를 쓰세요.",
    "givens": {
      "지문": "[17~18] 다음은 우리나라에서 발생한 지진 피해 사례입니다. 물음에 답하세요.",
      "표": {
        "발생 연도": [
          "2016년",
          "2017년",
          "2018년"
        ],
        "발생 지역": [
          "경상북도 경주시",
          "경상북도 포항시",
          "경상북도 포항시"
        ],
        "규모": [
          "5.8",
          "5.4",
          "4.6"
        ],
        "피해 내용": [
          "부상자 발생, 문화재 손상, 건물 무너짐",
          "부상자 발생, 건물 무너짐, 이재민 발생",
          "부상자 발생, 도로 갈라짐"
        ]
      }
    },
    "choices": null,
    "figure": "assets/bank/s42-u04/s3-q17.webp",
    "figureNote": "우리나라 지진 피해 사례 표(발생 연도·발생 지역·규모·피해 내용). 내용은 givens.표에 옮김.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "2018년",
      "accepted": [
        "2018년",
        "2018",
        "2018 년"
      ]
    },
    "explanation": "규모의 숫자가 클수록 강한 지진, 작을수록 약한 지진입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란은 '(     )년' 형식. 표의 연도 칸은 '2016 / 년'처럼 줄바꿈되어 있음."
    }
  },
  {
    "id": "s42-u04-o3-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 18,
      "page": 4,
      "sourceId": "sci-42-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진 피해 사례 표 해석",
      "concept": "표에 없는 연도의 지진 발생 여부는 표로 알 수 없다."
    },
    "prompt": "위 표를 보고 알 수 있는 내용으로 옳지 않은 것을 고르세요.",
    "givens": {
      "지문": "[17~18] 다음은 우리나라에서 발생한 지진 피해 사례입니다. 물음에 답하세요.",
      "표": {
        "발생 연도": [
          "2016년",
          "2017년",
          "2018년"
        ],
        "발생 지역": [
          "경상북도 경주시",
          "경상북도 포항시",
          "경상북도 포항시"
        ],
        "규모": [
          "5.8",
          "5.4",
          "4.6"
        ],
        "피해 내용": [
          "부상자 발생, 문화재 손상, 건물 무너짐",
          "부상자 발생, 건물 무너짐, 이재민 발생",
          "부상자 발생, 도로 갈라짐"
        ]
      }
    },
    "choices": [
      "지진으로 재산 피해를 입었습니다.",
      "지진이 발생해 부상자가 생겼습니다.",
      "2019년부터는 지진이 발생하지 않았습니다.",
      "우리나라는 지진에 안전한 지역이 아닙니다.",
      "우리나라에도 규모 5.0 이상의 강한 지진이 발생하였습니다."
    ],
    "figure": "assets/bank/s42-u04/s3-q17.webp",
    "figureNote": "우리나라 지진 피해 사례 표(발생 연도·발생 지역·규모·피해 내용). 내용은 givens.표에 옮김.",
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
    "explanation": "위 표를 통해서 2019년의 피해 사례를 알 수 없습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄. ③ '2019 년'은 숫자 글꼴 탓에 띄어 보이나 '2019년'으로 적음."
    }
  },
  {
    "id": "s42-u04-o3-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 19,
      "page": 4,
      "sourceId": "sci-42-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진 발생 시 대처 방법",
      "concept": "지진이 나면 책상 밑에서 몸을 보호하고, 흔들림이 멈추면 머리를 보호하며 넓은 공터로 대피한다."
    },
    "prompt": "지진이 발생했을 때 대처하는 방법으로 옳은 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "책상 밑으로 들어가 몸을 보호합니다.",
      "건물 밖으로 나와 건물 벽의 보호를 받으며 대피합니다.",
      "지진이 발생하면 승강기를 이용하여 빠르게 대피합니다.",
      "흔들림이 멈추기 전에 계단을 이용해 건물 밖으로 나옵니다.",
      "머리를 보호하면서 운동장이나 공원 등 넓은 공터로 대피합니다."
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
    "explanation": "건물 벽이 무너질 수 있으므로 건물과 거리를 두고 대피합니다. 승강기가 멈출 수 있으므로 승강기 대신 계단을 이용하여 대피합니다. 지진으로 흔들릴 때 대피하면 다칠 위험이 높으므로 흔들림이 멈추면 질서 있게 대피합니다.",
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
    "id": "s42-u04-o3-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 20,
      "page": 4,
      "sourceId": "sci-42-4-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "승강기 안에서의 지진 대처",
      "concept": "지진 때 승강기 안에 있으면 모든 층 버튼을 눌러 먼저 열리는 층에서 내린 뒤 계단으로 대피한다."
    },
    "prompt": "지진이 발생했을 때 승강기 안에 있다면 어떻게 행동해야 하는지 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 승강기 안에서 나가지 않고 대기합니다.",
        "ㄴ. 가장 높은 층을 눌러 옥상으로 대피합니다.",
        "ㄷ. 모든 층의 버튼을 눌러 가장 먼저 열리는 층에서 내린 후 계단을 이용해 대피합니다."
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
    "explanation": "지진으로 흔들릴 때 승강기 안에 있으면 전기가 차단되어 승강기가 멈출 수 있으므로 모든 층의 버튼을 눌러 가장 먼저 열리는 층에서 내린 후 계단을 이용해 대피해야 합니다.",
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
    "id": "s42-u04-o4-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 1,
      "page": 1,
      "sourceId": "sci-42-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화산의 뜻",
      "concept": "화산은 땅속 깊은 곳의 마그마가 지표 밖으로 분출하여 만들어진 지형이다."
    },
    "prompt": "마그마가 분출하여 생긴 지형을 고르세요.",
    "givens": null,
    "choices": [
      "평야",
      "화산",
      "갯벌",
      "골짜기",
      "모래사장"
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
    "explanation": "화산은 마그마가 분출하여 생긴 지형입니다.",
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
    "id": "s42-u04-o4-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 2,
      "page": 1,
      "sourceId": "sci-42-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "우리나라의 화산",
      "concept": "제주도의 한라산은 우리나라의 대표적인 화산이다."
    },
    "prompt": "우리나라의 대표적인 화산을 고르세요.",
    "givens": null,
    "choices": [
      "지리산",
      "한라산",
      "북한산",
      "설악산",
      "후지산"
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
    "explanation": "제주도의 한라산은 우리나라의 대표적인 화산입니다. 지리산, 북한산, 설악산은 화산이 아니며, 후지산은 일본에 위치한 화산입니다.",
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
    "id": "s42-u04-o4-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 3,
      "page": 1,
      "sourceId": "sci-42-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "분화구",
      "concept": "화산 꼭대기에는 움푹 파인 분화구가 있는 경우가 있고, 여기에 물이 고여 호수가 생기기도 한다."
    },
    "prompt": "다음은 화산에 대한 설명입니다. 빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 화산은 꼭대기에 □(이)가 있는 것도 있습니다.\n• 화산 □에 물이 고여 커다란 호수나 물웅덩이가 만들어지기도 합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
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
    "explanation": "화산은 꼭대기에 분화구가 있는 것도 있습니다. 화산 분화구에 물이 고여 커다란 호수나 물웅덩이가 만들어지기도 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "□는 지문 속 빈 네모 칸(빈칸)을 나타낸 것."
    }
  },
  {
    "id": "s42-u04-o4-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 4,
      "page": 1,
      "sourceId": "sci-42-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화산 활동 모형실험과 실제 화산 비교",
      "concept": "화산 활동 모형실험에서 피어오르는 연기는 화산 가스에, 흘러나오는 마시멜로는 용암에 해당한다."
    },
    "prompt": "다음은 화산 활동 모형실험과 실제 화산 활동을 비교한 것입니다. 빈칸 ㉠과 ㉡에 들어갈 알맞은 화산 분출물을 각각 쓰세요.",
    "givens": {
      "지문": "화산 활동 모형에서 연기는 ㉠(을)를 나타내고, 흘러나오는 마시멜로는 ㉡(을)를 나타냅니다.",
      "그림 이름표": [
        "마시멜로를 감싼 알루미늄 포일",
        "가열 장치"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s42-u04/s4-q04.webp",
    "figureNote": "가열 장치 위 접시에 마시멜로를 감싼 알루미늄 포일로 만든 화산 모형이 놓인 그림. 이름표: '마시멜로를 감싼 알루미늄 포일', '가열 장치'.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-화산 가스, ㉡-용암",
      "accepted": [
        "㉠-화산 가스, ㉡-용암",
        "㉠-화산가스, ㉡-용암",
        "㉠ 화산 가스, ㉡ 용암",
        "화산 가스, 용암",
        "화산가스, 용암",
        "화산가스 용암"
      ]
    },
    "explanation": "화산 활동 모형에서 연기는 화산 가스, 흘러나오는 마시멜로는 용암을 나타냅니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 ㉠, ㉡은 빈 네모 칸 안에 기호가 적힌 형태로 인쇄됨."
    }
  },
  {
    "id": "s42-u04-o4-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 5,
      "page": 1,
      "sourceId": "sci-42-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화산 분출물의 상태",
      "concept": "화산 분출물 중 용암은 액체, 화산재·화산 암석 조각은 고체, 화산 가스는 기체 상태이다."
    },
    "prompt": "화산 분출물 중 액체 상태인 것을 고르세요.",
    "givens": null,
    "choices": [
      "용암",
      "화산재",
      "수증기",
      "화산 가스",
      "화산 암석 조각"
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
    "explanation": "화산 분출물 중 액체 상태인 것은 용암입니다. 화산재와 화산 암석 조각은 고체 상태, 수증기를 포함하는 화산 가스는 기체 상태입니다.",
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
    "id": "s42-u04-o4-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 6,
      "page": 1,
      "sourceId": "sci-42-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화산재의 특징",
      "concept": "화산재는 화산 활동 때 나오는 지름 2 mm 이하의 고체 가루 물질이다."
    },
    "prompt": "다음에서 설명하는 화산 분출물은 무엇인지 쓰세요.",
    "givens": {
      "지문": "• 고체 상태입니다.\n• 화산 활동이 일어날 때 나오는 가루 물질로, 크기가 2 mm 이하로 매우 작습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "화산재",
      "accepted": [
        "화산재",
        "화산 재"
      ]
    },
    "explanation": "화산 활동이 일어날 때 나오는 가루 물질로, 크기가 2 mm 이하로 매우 작은 것은 화산재입니다.",
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
    "id": "s42-u04-o4-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 7,
      "page": 2,
      "sourceId": "sci-42-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화산 가스의 성분",
      "concept": "화산 가스는 여러 기체가 섞인 기체 분출물로, 그 대부분은 수증기이다."
    },
    "prompt": "화산 가스의 대부분을 이루고 있는 물질을 고르세요.",
    "givens": null,
    "choices": [
      "산소",
      "질소",
      "수증기",
      "아황산가스",
      "이산화 탄소"
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
    "explanation": "화산 가스는 기체 상태의 물질로, 대부분 수증기이며, 여러 가지 기체가 섞여 있습니다.",
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
    "id": "s42-u04-o4-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 8,
      "page": 2,
      "sourceId": "sci-42-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화성암의 종류",
      "concept": "마그마가 식어 굳은 화성암에는 화강암과 현무암이 있고, 이암·사암·역암은 퇴적암이다."
    },
    "prompt": "마그마의 활동으로 만들어진 암석끼리 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "이암, 사암",
      "사암, 현무암",
      "화강암, 역암",
      "현무암, 이암",
      "화강암, 현무암"
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
    "explanation": "마그마가 식어서 굳어져 만들어진 암석을 화성암이라고 하며, 대표적인 화성암에는 화강암과 현무암이 있습니다. 이암, 사암, 역암은 퇴적물이 굳어져 만들어진 퇴적암입니다.",
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
    "id": "s42-u04-o4-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 9,
      "page": 2,
      "sourceId": "sci-42-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화강암과 현무암의 특징",
      "concept": "현무암 표면의 구멍은 화산 가스가 빠져나간 흔적이어서 구멍이 없는 현무암도 있다."
    },
    "prompt": "화강암과 현무암에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "현무암은 색깔이 어둡습니다.",
      "화강암과 현무암은 화성암입니다.",
      "모든 현무암은 표면에 구멍이 있습니다.",
      "현무암으로 돌하르방, 맷돌 등을 만듭니다.",
      "화강암은 여러 가지 색깔의 알갱이가 섞여 있습니다."
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
    "explanation": "현무암 표면의 구멍은 현무암이 만들어질 때 화산 가스가 빠져나간 흔적으로, 표면에 구멍이 있는 것도 있고 없는 것도 있습니다.",
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
    "id": "s42-u04-o4-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 10,
      "page": 2,
      "sourceId": "sci-42-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화강암과 현무암의 알갱이 크기",
      "concept": "마그마가 땅속 깊은 곳에서 천천히 식으면 알갱이가 큰 화강암이, 지표 가까이에서 빨리 식으면 알갱이가 작은 현무암이 된다."
    },
    "prompt": "다음은 화강암과 현무암을 이루는 알갱이의 크기를 비교한 것입니다. 괄호 ㉠과 ㉡에 들어갈 알맞은 말을 골라 각각 쓰세요.",
    "givens": {
      "지문": "화강암은 마그마가 땅속 깊은 곳에서 서서히 식어서 알갱이의 크기가 ㉠( 작, 크 )고, 현무암은 마그마가 지표 가까이에서 빠르게 식어서 알갱이의 크기가 ㉡( 작습, 큽 )니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-크, ㉡-작습",
      "accepted": [
        "㉠-크, ㉡-작습",
        "㉠ 크, ㉡ 작습",
        "크, 작습"
      ]
    },
    "explanation": "화강암은 마그마가 땅속 깊은 곳에서 서서히 식어서 알갱이의 크기가 크고, 현무암은 마그마가 지표 가까이에서 빠르게 식어서 알갱이의 크기가 작습니다.",
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
    "id": "s42-u04-o4-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 11,
      "page": 2,
      "sourceId": "sci-42-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "화산 활동이 생활에 주는 영향",
      "concept": "화산재는 땅을 기름지게 하지만 비행기 운항 방해나 호흡기 질병 같은 피해도 준다."
    },
    "prompt": "화산 활동이 우리 생활에 주는 영향으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "화산 주변에서 온천이나 관광지를 개발합니다.",
      "용암이 흘러 산불이 나고 인명 피해가 생깁니다.",
      "화산재는 땅을 기름지게 하는 이로운 영향만 줍니다.",
      "화산 주변의 열을 이용하여 전기를 만들고 난방을 합니다.",
      "화산 활동은 우리 생활에 피해를 주기도 하지만 이로운 점도 있습니다."
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
    "explanation": "화산재는 땅을 기름지게 하는 이로운 영향을 주지만, 비행기의 운항을 어렵게 하거나 호흡기 질병을 일으키게 하는 해로운 영향도 줍니다.",
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
    "id": "s42-u04-o4-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 12,
      "page": 2,
      "sourceId": "sci-42-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진 발생 모형실험",
      "concept": "지진 발생 모형실험에서 우드록을 양쪽에서 미는 손의 힘은 지구 내부에서 작용하는 힘에 해당한다."
    },
    "prompt": "다음은 우드록을 양손으로 밀면서 나타나는 현상을 관찰하는 지진 발생 모형실험을 하는 모습입니다. 우드록을 양손으로 미는 힘은 실제 지진에서 어떤 것을 나타내는 것인지 고르세요.",
    "givens": null,
    "choices": [
      "바람의 힘",
      "암석의 힘",
      "흐르는 물의 힘",
      "흐르는 용암의 힘",
      "지구 내부에서 작용하는 힘"
    ],
    "figure": "assets/bank/s42-u04/s4-q12.webp",
    "figureNote": "실험복을 입은 사람이 장갑 낀 양손으로 여러 겹의 우드록 양 끝을 잡고 가운데 쪽으로 미는 모습(양쪽에서 안쪽을 향한 파란 화살표).",
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
    "explanation": "지진 발생 모형실험에서 우드록을 양손으로 미는 힘은 지구 내부에서 작용하는 힘을 나타냅니다.",
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
    "id": "s42-u04-o4-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 13,
      "page": 3,
      "sourceId": "sci-42-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진의 뜻과 원인",
      "concept": "지진은 땅이 지구 내부의 힘을 오랫동안 받아 휘어지거나 끊어지면서 흔들리는 현상이다."
    },
    "prompt": "지진에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "바람의 힘에 의해 일어납니다.",
      "지진은 화산 주위에서만 발생합니다.",
      "지진은 마그마의 활동에 의해서만 발생합니다.",
      "땅이 힘을 받아 끊어지면서 흔들리는 것입니다.",
      "대부분 짧은 시간 동안 땅에 가해진 힘에 의해 발생합니다."
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
    "explanation": "지진은 땅이 끊어지면서 흔들리는 현상으로, 땅이 지구 내부에서 작용하는 힘을 오랫동안 받으면 휘어지거나 끊어지면서 발생합니다. 또한, 지표의 약한 부분이나 지하 동굴이 무너지거나 화산 활동이 일어날 때 지진이 발생하기도 합니다.",
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
    "id": "s42-u04-o4-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 14,
      "page": 3,
      "sourceId": "sci-42-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진의 규모",
      "concept": "규모는 지진의 세기를 숫자로 나타낸 것으로, 숫자가 클수록 강한 지진이다."
    },
    "prompt": "가장 강한 지진을 고르세요.",
    "givens": null,
    "choices": [
      "규모 4.6 의 지진",
      "규모 5.4 의 지진",
      "규모 5.8 의 지진",
      "규모 6.2 의 지진",
      "규모 7.5 의 지진"
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
    "explanation": "규모는 지진의 세기를 숫자로 나타낸 것입니다. 규모의 숫자가 클수록 강한 지진이며, 지진 피해 정도도 커집니다.",
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
    "id": "s42-u04-o4-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 15,
      "page": 3,
      "sourceId": "sci-42-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진 피해",
      "concept": "지진은 산사태·지진 해일을 일으킬 수 있고 대비 정도에 따라 피해가 달라지며, 우리나라도 지진에 안전하지 않다."
    },
    "prompt": "지진으로 발생할 수 있는 피해에 대한 설명으로 옳은 것을 <보기>에서 모두 골라 짝 지은 것은?",
    "givens": {
      "보기": [
        "ㄱ. 지진에 의해 산사태나 지진 해일이 발생하기도 합니다.",
        "ㄴ. 같은 지진이라도 지진에 대비한 정도에 따라 피해 정도가 달라집니다.",
        "ㄷ. 우리나라는 지진에 안전한 지역이므로 지진으로 인한 피해를 대비하지 않아도 됩니다."
      ]
    },
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄱ, ㄴ, ㄷ"
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
    "explanation": "최근 우리나라에서 규모가 큰 지진이 발생하고 있어 우리나라도 지진에 안전한 지역이 아닙니다. 따라서 지진으로 피해를 입지 않도록 대비해야 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설은 답안 PDF 1쪽 '15. ④' 다음 2쪽 첫머리에 이어짐."
    }
  },
  {
    "id": "s42-u04-o4-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 16,
      "page": 3,
      "sourceId": "sci-42-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진 대비 비상용품",
      "concept": "지진 대비 비상용품으로는 물·구급약·손전등·비상식량·라디오·간단한 옷 등을 준비한다."
    },
    "prompt": "단비는 지진에 대비하기 위해 비상용품을 준비하려고 합니다. 준비해야 하는 비상용품으로 적절하지 않은 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "물",
      "구급약",
      "게임기",
      "라디오",
      "장바구니"
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
    "explanation": "물, 구급약, 손전등, 비상식량, 라디오, 간단한 옷 등을 비상용품으로 준비합니다.",
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
    "id": "s42-u04-o4-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 17,
      "page": 3,
      "sourceId": "sci-42-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "승강기 안에서의 지진 대처",
      "concept": "지진이 나면 정전으로 승강기가 멈출 수 있으므로 가장 가까운 층에서 내려 계단으로 대피한다."
    },
    "prompt": "승강기 안에 있을 때 지진이 발생한다면 어떻게 대처해야 하는지 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "모든 층을 눌러 가장 먼저 열리는 층에서 내린 후 계단을 이용하여 대피합니다.",
      "rubric": {
        "required": [
          "빠르게 승강기에서 내린다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "빠르게 승강기에서 내린다는 내용을 쓴 경우 (100%)"
        ]
      }
    },
    "explanation": "지진이 발생하면 전기가 끊겨 승강기가 멈출 수 있으므로 빠르게 내려야 합니다.\n[채점 기준] 빠르게 승강기에서 내린다는 내용을 쓴 경우 (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준표의 행 머리는 '정답'."
    }
  },
  {
    "id": "s42-u04-o4-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 18,
      "page": 3,
      "sourceId": "sci-42-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진으로 흔들릴 때의 대처",
      "concept": "흔들리는 동안에는 떨어지는 물건에 다치지 않도록 책상이나 탁자 아래에서 몸을 보호한다."
    },
    "prompt": "지진으로 흔들릴 때는 다음과 같이 책상이나 탁자 아래로 들어가 몸을 보호해야 합니다. 그 까닭을 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s42-u04/s4-q18.webp",
    "figureNote": "흔들리는 교실에서 두 학생이 각각 책상 아래로 들어가 책상 다리를 붙잡고 있고, 책상 위·옆으로 책이 떨어지는 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "지진으로 흔들릴 때 떨어지는 물건에 다칠 확률이 높기 때문에 흔들림이 멈출 때까지 책상이나 탁자 밑에서 몸을 보호해야 합니다.",
      "rubric": {
        "required": [
          "흔들릴 때 물건이 떨어진다",
          "떨어지는 물건에 다칠 수 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "떨어지는 물건에 다칠 확률이 높기 때문이라고 쓴 경우 (100%)"
        ]
      }
    },
    "explanation": "지진으로 흔들릴 때 움직여서 대피하면 떨어지는 물건에 다칠 확률이 높습니다. 따라서 흔들림이 멈출 때까지 책상이나 탁자 밑에 몸을 숨기는 것이 안전합니다.\n[채점 기준] 떨어지는 물건에 다칠 확률이 높기 때문이라고 쓴 경우 (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준표의 행 머리는 '정답'."
    }
  },
  {
    "id": "s42-u04-o4-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 19,
      "page": 4,
      "sourceId": "sci-42-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진 발생 후의 대처",
      "concept": "지진 후에는 교실에서 질서 있게 운동장으로 대피하는 등 넓은 곳으로 피하고, 계단을 이용하며 전기·가스를 차단한다."
    },
    "prompt": "지진이 발생한 후의 대처 방법으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "재난 방송은 듣지 않습니다.",
      "밖에 있을 경우 건물 안으로 들어갑니다.",
      "교실 안에 있을 경우 질서 있게 운동장으로 대피합니다.",
      "건물 안에 있을 경우 승강기를 타고 재빠르게 대피합니다.",
      "집안에서 가스에 이상이 없는지 확인하기 위해 가스레인지를 켜 봅니다."
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
    "explanation": "밖에 있을 경우 건물과 거리를 두고 넓은 공간으로 대피합니다. 건물 안에 있을 경우 계단으로 빠르게 대피합니다. 화재가 발생할 수 있으므로 전기와 가스를 차단합니다. 대피 후에 라디오나 공공기관의 재난 방송(안내 방송)에 따라 올바르게 행동합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "⑤의 '가스레인지'는 줄바꿈으로 '가스 / 레인지'로 나뉘어 인쇄됨."
    }
  },
  {
    "id": "s42-u04-o4-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 20,
      "page": 4,
      "sourceId": "sci-42-4-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-2",
      "unit": "Ⅳ. 화산과 지진"
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
      "track": "교과",
      "topic": "지진에 안전한 건물 모형",
      "concept": "지진에 안전한 건물 모형은 겉모양보다 지진을 견디는 형태·구조·재료를 중심으로 설계한다."
    },
    "prompt": "다음과 같이 지진에 안전한 건물 모형을 만들 때 생각해야 할 것으로 적절하지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "지진을 견딜 수 있는 형태인가?",
      "지진에 안전한 건물의 구조는 어떤 것인가?",
      "건물 모형을 만들 재료로 알맞은 것은 무엇인가?",
      "건물 모형을 예쁘게 만들 수 있는 방법은 무엇인가?",
      "건물 모형이 안전하게 만들어졌는지 확인할 수 있는 방법은 무엇인가?"
    ],
    "figure": "assets/bank/s42-u04/s4-q20.webp",
    "figureNote": "막대와 공 모양 연결 부품으로 만든 2층 직육면체 건물 모형. 각 층에 빨간색·파란색 대각선 보강 막대가 있고, 아래에는 용수철로 받친 받침판이 있음.",
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
    "explanation": "지진에 안전한 건물 모형을 만들 때 예쁘게 만드는 것보다 지진을 견딜 수 있는 형태와 구조로 만드는 방법을 생각해야 합니다.",
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
