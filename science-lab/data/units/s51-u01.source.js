// 5-1 Ⅰ 과학자는 어떻게 탐구할까요 — 단원평가 원문 15문항(시매쓰DMC 최다빈출 단원평가 세트1). 시험지를 그대로 옮기고 정답 및 풀이와 대조했다.
// 원장 지시(2026-10-09): 원문을 그대로 문제은행에 쓴다. 그림은 시험지에서 잘라 낸 것(assets/bank/s51-u01/).
export const source = [
  {
    "id": "s51-u01-o1-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 1,
      "page": 1,
      "sourceId": "sci-51-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가",
      "course": "초등 5-1",
      "unit": "Ⅰ. 과학자는 어떻게 탐구할까요"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "문제 인식의 뜻",
      "concept": "자연 현상을 관찰해 탐구할 문제를 찾고 명확하게 나타내는 것을 문제 인식이라고 한다."
    },
    "prompt": "다음에서 설명하는 것은 무엇인지 고르세요.",
    "givens": {
      "지문": "우리 주변의 자연 현상을 관찰하고, 탐구할 문제를 찾아 명확하게 나타내는 것을 말합니다."
    },
    "choices": [
      "탐구 문제",
      "변인 통제",
      "문제 인식",
      "탐구 활동",
      "결론 도출"
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
    "explanation": "우리 주변의 자연 현상을 관찰하고, 탐구할 문제를 찾아 명확하게 나타내는 것을 문제 인식이라고 합니다.",
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
    "id": "s51-u01-o1-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 2,
      "page": 1,
      "sourceId": "sci-51-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가",
      "course": "초등 5-1",
      "unit": "Ⅰ. 과학자는 어떻게 탐구할까요"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "다르게 할 조건과 관찰할 것 찾기",
      "concept": "사인펜 색깔에 따른 색소를 알아보는 실험에서는 사인펜의 색깔만 다르게 하고, 점에서 분리된 색소를 관찰한다."
    },
    "prompt": "다음 탐구 문제에 대한 실험을 계획할 때 ㈎다르게 해야 할 조건과 ㈏관찰하거나 측정해야 할 것을 <보기>에서 골라 기호를 각각 쓰세요.",
    "givens": {
      "지문": "사인펜의 색깔에 따라 잉크에 섞여 있는 색소는 같을까?",
      "보기": [
        "ㄱ. 점의 크기",
        "ㄴ. 사인펜의 색깔",
        "ㄷ. 페트리 접시에 부은 물의 높이",
        "ㄹ. 사인펜으로 찍은 점에서 분리된 색소"
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
      "answer": "㈎-ㄴ, ㈏-ㄹ",
      "accepted": [
        "㈎-ㄴ, ㈏-ㄹ",
        "㈎ㄴ ㈏ㄹ",
        "(가)-ㄴ, (나)-ㄹ",
        "가-ㄴ, 나-ㄹ",
        "ㄴ, ㄹ"
      ]
    },
    "explanation": "사인펜의 색깔에 따라 잉크에 섞여 있는 색소를 알아보는 실험을 할 때 다르게 해야 할 조건은 사인펜의 색깔이고, 이외의 다른 조건은 모두 같게 해야 합니다. 실험을 하면서 사인펜으로 찍은 점에서 분리된 색소를 관찰합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「다르게 해야 할 조건」과 「관찰하거나 측정해야 할 것」에 밑줄이 있음. 답란은 「㈎-(  ), ㈏-(  )」 형식."
    }
  },
  {
    "id": "s51-u01-o1-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 3,
      "page": 1,
      "sourceId": "sci-51-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가",
      "course": "초등 5-1",
      "unit": "Ⅰ. 과학자는 어떻게 탐구할까요"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "탐구 문제를 정할 때 생각할 점",
      "concept": "탐구 문제는 스스로 탐구할 수 있고 범위가 좁고 구체적이어야 하며, 간단한 조사로 답을 찾을 수 있는 것은 알맞지 않다."
    },
    "prompt": "탐구 문제를 정할 때 생각할 점으로 알맞은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 스스로 탐구할 수 있어야 합니다.",
        "ㄴ. 탐구 범위가 넓고 추상적이어야 합니다.",
        "ㄷ. 간단한 조사를 통해 쉽게 답을 찾을 수 있어야 합니다."
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
    "explanation": "탐구 문제는 스스로 탐구 할 수 있는 것으로 정합니다. 또한 탐구 범위가 좁고 구체적이어야 하고, 간단한 조사를 통해 쉽게 답을 찾을 수 있는 것은 탐구 문제로 적절하지 않습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설 원문의 「탐구 할 수 있는」 띄어쓰기는 인쇄된 그대로 옮김."
    }
  },
  {
    "id": "s51-u01-o1-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 4,
      "page": 1,
      "sourceId": "sci-51-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가",
      "course": "초등 5-1",
      "unit": "Ⅰ. 과학자는 어떻게 탐구할까요"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "실험 계획을 세울 때 생각할 점",
      "concept": "실험 계획에는 알맞은 실험 방법과 다르게 할 조건·같게 할 조건·관찰하거나 측정할 것을 정하는 일이 들어간다."
    },
    "prompt": "실험 계획을 세울 때 생각할 점에 대해 옳게 말한 사람을 모두 골라 짝 지은 것은?",
    "givens": {
      "지문": "• 단비: 실험하면서 들을 음악이 꼭 필요해.\n• 다래: 탐구 문제를 해결할 수 있는 적절한 실험 방법을 생각해야 해.\n• 은하: 다르게 해야 할 조건, 같게 해야 할 조건, 관찰하거나 측정해야 할 것을 정해야 해."
    },
    "choices": [
      "단비",
      "다래",
      "은하",
      "단비, 다래",
      "다래, 은하"
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
    "explanation": "실험 계획을 세울 때에는 탐구 문제를 해결할 수 있는 적절한 실험 방법과 실험할 때 다르게 해야 할 조건, 같게 해야 할 조건, 관찰하거나 측정해야 할 것을 정합니다. 실험 과정과 실험을 하면서 지켜야 할 안전 수칙을 생각합니다.",
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
    "id": "s51-u01-o1-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 5,
      "page": 1,
      "sourceId": "sci-51-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가",
      "course": "초등 5-1",
      "unit": "Ⅰ. 과학자는 어떻게 탐구할까요"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "변인 통제의 뜻",
      "concept": "실험에서 다르게 할 조건과 같게 할 조건을 확인하고 통제하는 것을 변인 통제라고 한다."
    },
    "prompt": "실험에서 다르게 해야 할 조건과 같게 해야 할 조건을 확인하고 통제하는 것을 무엇이라고 하는지 고르세요.",
    "givens": null,
    "choices": [
      "문제 인식",
      "변인 통제",
      "자료 변환",
      "자료 해석",
      "결론 도출"
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
    "explanation": "실험에서 다르게 해야 할 조건과 같게 해야 할 조건을 확인하고 통제하는 것을 변인 통제라고 합니다.",
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
    "id": "s51-u01-o1-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 6,
      "page": 1,
      "sourceId": "sci-51-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가",
      "course": "초등 5-1",
      "unit": "Ⅰ. 과학자는 어떻게 탐구할까요"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "실험 결과를 기록하는 방법",
      "concept": "실험 결과는 바로, 빠짐없이, 있는 그대로 기록하며 예상과 달라도 고치거나 빼지 않는다."
    },
    "prompt": "실험 결과를 기록하는 방법으로 옳은 것을 <보기>에서 모두 골라 짝 지은 것은?",
    "givens": {
      "보기": [
        "ㄱ. 실험 결과는 바로 기록합니다.",
        "ㄴ. 관찰하거나 측정하려고 했던 내용을 빠짐없이 기록합니다.",
        "ㄷ. 실험 결과가 예상과 다르게 나오더라도 고치거나 빼지 않습니다."
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
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "실험 결과를 기록할 때에는 관찰한 내용을 잊어버리기 전에 바로 기록하고, 관찰하거나 측정하려고 했던 것을 생각하면서 결과를 기록합니다. 실험 결과를 있는 그대로 기록하고, 실험 결과가 예상과 다르더라도 고치거나 빼지 않습니다.",
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
    "id": "s51-u01-o1-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 7,
      "page": 2,
      "sourceId": "sci-51-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가",
      "course": "초등 5-1",
      "unit": "Ⅰ. 과학자는 어떻게 탐구할까요"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "자료 변환의 뜻",
      "concept": "실험 결과를 표나 그래프 형태로 바꾸어 나타내는 것을 자료 변환이라고 한다."
    },
    "prompt": "빈칸에 들어갈 알맞은 말을 고르세요.",
    "givens": {
      "지문": "자료 변환은 [    ](을)를 표나 그래프의 형태로 바꾸어 나타내는 것입니다."
    },
    "choices": [
      "탐구 문제",
      "실험 계획",
      "실험 방법",
      "실험 결과",
      "모둠원의 역할"
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
    "explanation": "자료 변환은 실험 결과를 표나 그래프의 형태로 바꾸어 나타내는 것입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문 속 빈칸은 빈 네모 칸으로 인쇄되어 있어 [    ]로 옮김."
    }
  },
  {
    "id": "s51-u01-o1-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 8,
      "page": 2,
      "sourceId": "sci-51-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가",
      "course": "초등 5-1",
      "unit": "Ⅰ. 과학자는 어떻게 탐구할까요"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "표로 변환하는 순서",
      "concept": "표를 만들 때는 제목, 항목과 줄 수, 첫 줄의 항목을 정한 뒤 마지막에 각 칸에 실험 결과 값을 넣는다."
    },
    "prompt": "실험 결과를 표로 변환할 때 가장 마지막에 할 일을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 표의 제목 정하기",
        "ㄴ. 표의 각 칸에 실험 결과 값 넣기",
        "ㄷ. 표의 첫 번째 가로줄과 세로줄에 항목 쓰기",
        "ㄹ. 표의 가로줄과 세로줄에 적어야 할 항목을 정하고 줄의 개수 정하기"
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
    "explanation": "실험 결과를 표로 나타낼 때에는 표의 제목을 정하고, 표의 가로줄과 세로줄에 적어야 할 항목과 줄의 개수를 정합니다. 그 다음 표의 첫 번째 가로줄과 세로줄에 항목을 쓰고, 마지막으로 표의 각 칸에 실험 결과 값을 넣습니다.",
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
    "id": "s51-u01-o1-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 9,
      "page": 2,
      "sourceId": "sci-51-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가",
      "course": "초등 5-1",
      "unit": "Ⅰ. 과학자는 어떻게 탐구할까요"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "그래프의 특징",
      "concept": "그래프는 자료를 점·선·넓이 등으로 나타내어 분포와 경향을 쉽게 알 수 있게 한다."
    },
    "prompt": "다음에서 설명하는 자료 변환의 형태를 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "자료를 점과 선 또는 넓이 등으로 나타내어 자료의 분포와 경향을 쉽게 알 수 있습니다.",
      "보기": [
        "ㄱ. 표",
        "ㄴ. 그림",
        "ㄷ. 그래프"
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
    "explanation": "자료를 그래프로 나타내면 자료의 분포와 경향을 쉽게 알 수 있습니다.",
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
    "id": "s51-u01-o1-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 10,
      "page": 2,
      "sourceId": "sci-51-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가",
      "course": "초등 5-1",
      "unit": "Ⅰ. 과학자는 어떻게 탐구할까요"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "자료 해석의 뜻",
      "concept": "실험 결과로 알 수 있는 점을 생각하고 자료 사이의 관계나 규칙을 찾는 과정을 자료 해석이라고 한다."
    },
    "prompt": "다음에서 설명하는 것은 무엇인지 고르세요.",
    "givens": {
      "지문": "실험 결과를 통해 알 수 있는 점을 생각하고, 자료 사이의 관계나 규칙을 찾아내는 과정입니다."
    },
    "choices": [
      "문제 인식",
      "변인 통제",
      "자료 변환",
      "자료 해석",
      "결론 도출"
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
    "explanation": "실험 결과를 통해 알 수 있는 점을 생각하고, 자료 사이의 관계나 규칙을 찾아내는 과정을 자료 해석이라고 합니다.",
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
    "id": "s51-u01-o1-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 11,
      "page": 2,
      "sourceId": "sci-51-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가",
      "course": "초등 5-1",
      "unit": "Ⅰ. 과학자는 어떻게 탐구할까요"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "자료 해석할 때 할 일",
      "concept": "자료 해석에서는 다르게 한 조건과 결과의 관계·규칙을 살피고, 규칙에서 벗어난 값도 빼지 않고 까닭을 분석한다."
    },
    "prompt": "자료 해석에 대한 설명으로 옳은 것을 <보기>에서 모두 골라 짝 지은 것은?",
    "givens": {
      "보기": [
        "ㄱ. 실험 결과를 통해 알 수 있는 점을 생각합니다.",
        "ㄴ. 규칙에서 벗어나는 부분은 실험 결과에서 뺍니다.",
        "ㄷ. 실험에서 다르게 한 조건과 실험 결과는 어떤 관계가 있는지 살펴봅니다."
      ]
    },
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
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
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "자료 해석을 할 때에는 실험에서 다르게 한 조건과 실험 결과는 어떤 관계가 있는지 혹은 어떤 규칙이 있는지 등을 살펴봅니다. 규칙에서 벗어나더라도 빼지 않고 그 값이 나온 까닭이 무엇인지 분석합니다.",
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
    "id": "s51-u01-o1-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 12,
      "page": 3,
      "sourceId": "sci-51-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가",
      "course": "초등 5-1",
      "unit": "Ⅰ. 과학자는 어떻게 탐구할까요"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "표의 가로줄·세로줄 항목",
      "concept": "색소 분리 결과표의 가로줄에는 다르게 한 조건인 사인펜의 색깔을, 세로줄에는 분리된 색소를 쓴다."
    },
    "prompt": "위의 ㉠과 ㉡에 들어갈 알맞은 말을 바르게 짝 지은 것을 고르세요.",
    "givens": {
      "지문": "[12~13] 다음은 검은색, 빨간색, 파란색 사인펜의 색소를 분리한 결과를 표로 나타낸 것입니다. 물음에 답하세요.",
      "표": {
        "㉡ \\ ㉠": [
          "보라색",
          "진분홍색",
          "분홍색",
          "하늘색",
          "노란색"
        ],
        "검은색": [
          "○",
          "×",
          "○",
          "○",
          "○"
        ],
        "빨간색": [
          "×",
          "○",
          "○",
          "×",
          "○"
        ],
        "파란색": [
          "○",
          "×",
          "○",
          "○",
          "×"
        ]
      }
    },
    "choices": [
      "분리된 색소 / 사인펜의 색깔",
      "분리된 색소 / 거름종이의 색깔",
      "사인펜의 색깔 / 분리된 색소",
      "사인펜의 색깔 / 거름종이의 색깔",
      "거름종이의 색깔 / 사인펜의 색깔"
    ],
    "figure": "assets/bank/s51-u01/s1-q12.webp",
    "figureNote": "검은색·빨간색·파란색 사인펜(가로줄 머리, ㉠)별로 분리된 색소(세로줄 머리, ㉡: 보라색·진분홍색·분홍색·하늘색·노란색)의 유무를 ○/×로 나타낸 표. 왼쪽 위 대각선 칸의 오른쪽 위에 ㉠, 왼쪽 아래에 ㉡이 적혀 있음.",
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
    "explanation": "검은색, 빨간색, 파란색 사인펜의 색소를 분리한 결과를 나타낸 표에서 가로줄(㉠)에는 실험에서 다르게 한 조건인 사인펜의 색깔을 썼고, 세로줄(㉡)에는 사인펜의 잉크에서 분리된 색소를 썼습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기는 표 형식(열 머리 ㉠ / ㉡)으로 인쇄되어 「① ㉠ / ㉡」 꼴로 옮김. 표는 2쪽 [12~13] 공통 지문 아래에 있음. 표의 ㉠·㉡은 대각선 머리칸 안에 표기됨."
    }
  },
  {
    "id": "s51-u01-o1-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 13,
      "page": 3,
      "sourceId": "sci-51-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가",
      "course": "초등 5-1",
      "unit": "Ⅰ. 과학자는 어떻게 탐구할까요"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E4",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "색소 분리 결과표 해석",
      "concept": "표에서 ○의 개수를 세면 검은색 사인펜에는 네 가지, 빨간색·파란색 사인펜에는 세 가지 색소가 섞여 있음을 알 수 있다."
    },
    "prompt": "위 실험 결과에 대한 설명으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[12~13] 다음은 검은색, 빨간색, 파란색 사인펜의 색소를 분리한 결과를 표로 나타낸 것입니다. 물음에 답하세요.",
      "표": {
        "㉡ \\ ㉠": [
          "보라색",
          "진분홍색",
          "분홍색",
          "하늘색",
          "노란색"
        ],
        "검은색": [
          "○",
          "×",
          "○",
          "○",
          "○"
        ],
        "빨간색": [
          "×",
          "○",
          "○",
          "×",
          "○"
        ],
        "파란색": [
          "○",
          "×",
          "○",
          "○",
          "×"
        ]
      },
      "보기": [
        "가. 빨간색 사인펜의 잉크에는 세 가지 색소가 섞여 있습니다.",
        "나. 검은색 사인펜의 잉크에는 세 가지 색소가 섞여 있습니다.",
        "다. 파란색 사인펜의 잉크에 섞여 있는 색소는 모두 검은색 사인펜의 잉크에 섞여 있습니다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s51-u01/s1-q12.webp",
    "figureNote": "검은색·빨간색·파란색 사인펜(가로줄 머리, ㉠)별로 분리된 색소(세로줄 머리, ㉡: 보라색·진분홍색·분홍색·하늘색·노란색)의 유무를 ○/×로 나타낸 표. 왼쪽 위 대각선 칸의 오른쪽 위에 ㉠, 왼쪽 아래에 ㉡이 적혀 있음.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "나",
      "accepted": [
        "나"
      ]
    },
    "explanation": "빨간색 사인펜의 잉크에는 세 가지 색소가 섞여 있고, 검은색 사인펜의 잉크에는 네 가지 색소가 섞여 있습니다. 파란색 사인펜의 잉크에 섞여 있는 보라색, 분홍색, 하늘색 색소는 모두 검은색 사인펜의 잉크에 섞여 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「않은」에 밑줄. <보기> 기호가 ㄱ/ㄴ/ㄷ이 아니라 가/나/다로 인쇄됨(정답도 「나」)."
    }
  },
  {
    "id": "s51-u01-o1-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 14,
      "page": 3,
      "sourceId": "sci-51-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가",
      "course": "초등 5-1",
      "unit": "Ⅰ. 과학자는 어떻게 탐구할까요"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "다르게 해야 할 조건",
      "concept": "두 색깔 사인펜의 색소 개수를 비교하는 실험에서는 사인펜의 색깔만 다르게 하고 나머지 조건은 같게 한다."
    },
    "prompt": "다음과 같은 탐구 문제를 정하여 실험을 할 때 다르게 해야 할 조건을 고르세요.",
    "givens": {
      "지문": "분홍색 사인펜과 초록색 사인펜의 잉크에 섞여 있는 색소의 개수는 몇 개일까?"
    },
    "choices": [
      "점의 크기",
      "종이의 종류",
      "사인펜의 종류",
      "사인펜의 색깔",
      "점을 찍는 위치"
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
    "explanation": "분홍색 사인펜과 초록색 사인펜의 잉크에 섞여 있는 색소의 개수를 알아보는 실험에서 다르게 해야 할 조건은 사인펜의 색깔입니다. 이외의 모든 조건은 같게 해야 합니다.",
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
    "id": "s51-u01-o1-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 15,
      "page": 3,
      "sourceId": "sci-51-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가",
      "course": "초등 5-1",
      "unit": "Ⅰ. 과학자는 어떻게 탐구할까요"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u01",
      "area": "탐구",
      "element": "E4",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "색소 분리 실험으로 알 수 있는 점",
      "concept": "사인펜 잉크는 여러 색소가 섞인 것이며, 사인펜 색깔마다 섞인 색소의 종류와 개수가 다르다."
    },
    "prompt": "여러 가지 색깔의 사인펜 색소를 분리하는 실험을 통해 알 수 있는 점을 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "사인펜의 색깔에 따라 섞여 있는 색소의 종류와 개수가 다른 것을 알 수 있습니다.",
      "rubric": {
        "required": [
          "사인펜의 색깔에 따라 섞여 있는 색소가 다르다",
          "색소의 종류와 개수가 다르다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "정답: ‘사인펜의 색깔에 따라 섞여 있는 색소의 종류와 개수가 다르다’는 말이 들어가도록 서술한 경우 (100%)",
          "부분 정답: ‘사인펜의 색깔에 따라 섞여 있는 색소가 다르다’ 등과 같이 색소의 종류와 개수에 대한 설명이 부족하게 서술한 경우 (50%)"
        ]
      }
    },
    "explanation": "여러 가지 색깔의 사인펜 색소를 분리한 결과 사인펜 색깔에 따라 잉크에 섞여 있는 색소의 종류와 개수가 다르다는 것을 알 수 있습니다.\n[채점 기준] 정답: ‘사인펜의 색깔에 따라 섞여 있는 색소의 종류와 개수가 다르다’는 말이 들어가도록 서술한 경우 (100%) / 부분 정답: ‘사인펜의 색깔에 따라 섞여 있는 색소가 다르다’ 등과 같이 색소의 종류와 개수에 대한 설명이 부족하게 서술한 경우 (50%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설은 정답 PDF 1쪽 끝(15번 정답)과 2쪽 위(풀이·채점 기준 표)에 걸쳐 있음."
    }
  }
];
