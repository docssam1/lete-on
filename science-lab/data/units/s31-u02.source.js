// 3-1 Ⅱ 동물의 생활 — 단원평가 원문 80문항(시매쓰DMC 최다빈출 단원평가 세트1·2·3·4). 시험지를 그대로 옮기고 정답 및 풀이와 대조했다.
// 원장 지시(2026-10-09): 원문을 그대로 문제은행에 쓴다. 그림은 시험지에서 잘라 낸 것(assets/bank/s31-u02/).
export const source = [
  {
    "id": "s31-u02-o1-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 1,
      "page": 1,
      "sourceId": "sci-31-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "공벌레의 특징",
      "concept": "공벌레는 머리에 더듬이와 일곱 쌍의 다리가 있고, 건드리면 몸을 공처럼 둥글게 만든다."
    },
    "prompt": "다음과 같은 특징을 가진 동물로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 머리에 더듬이가 있고 일곱 쌍의 다리가 있습니다.\n• 건드리면 몸을 공처럼 둥글게 만듭니다."
    },
    "choices": [
      "참새",
      "고양이",
      "공벌레",
      "달팽이",
      "잠자리"
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
    "explanation": "머리에 더듬이가 있고 일곱 쌍의 다리가 있으며 건드리면 몸을 공처럼 둥글게 만드는 것은 공벌레입니다.",
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
    "id": "s31-u02-o1-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 2,
      "page": 1,
      "sourceId": "sci-31-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "금붕어가 헤엄치는 데 쓰는 몸의 부분",
      "concept": "금붕어는 지느러미로 헤엄치고 아가미로 물속에서 숨을 쉰다."
    },
    "prompt": "다음 빈칸에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "금붕어는 여러 개의 □을/를 이용하여 헤엄칩니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "지느러미",
      "accepted": [
        "지느러미"
      ]
    },
    "explanation": "금붕어는 여러 개의 지느러미를 이용하여 헤엄치고, 아가미가 있어 물속에서 숨을 쉴 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 지문 안에 네모 칸으로 인쇄됨(□로 표기). 답란은 ( ) 괄호."
    }
  },
  {
    "id": "s31-u02-o1-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 3,
      "page": 1,
      "sourceId": "sci-31-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "개미·꿀벌·달팽이의 공통점",
      "concept": "개미, 꿀벌, 달팽이는 모두 머리에 더듬이가 있다."
    },
    "prompt": "다음 동물들의 공통점으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "개미, 꿀벌, 달팽이"
    },
    "choices": [
      "다리가 있다.",
      "날개가 있다.",
      "더듬이가 있다.",
      "지느러미가 있다.",
      "몸이 털로 덮여 있다."
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
    "explanation": "개미, 꿀벌, 달팽이는 모두 더듬이가 있습니다.",
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
    "id": "s31-u02-o1-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 4,
      "page": 1,
      "sourceId": "sci-31-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "알맞은 분류 기준",
      "concept": "분류 기준은 누가 분류해도 같은 결과가 나오도록 객관적이어야 하며, '긴가'처럼 사람마다 판단이 다른 기준은 쓸 수 없다."
    },
    "prompt": "동물을 분류하는 기준으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "알을 낳는가?",
      "다리가 두 개인가?",
      "몸의 길이가 긴가?",
      "지느러미가 있는가?",
      "한 쌍의 날개가 있는가?"
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
    "explanation": "동물을 분류할 때는 누가 분류하더라도 같은 결과가 나오는 분류 기준을 정해야 합니다. ‘몸의 길이가 긴가?’는 분류하는 사람에 따라 분류 결과가 달라질 수 있으므로 분류 기준으로 알맞지 않습니다.",
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
    "id": "s31-u02-o1-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 5,
      "page": 1,
      "sourceId": "sci-31-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "분류 결과에 맞는 분류 기준 찾기",
      "concept": "닭·참새·잠자리는 날개가 있고 뱀·문어·고양이는 날개가 없으므로 '날개가 있는가?'로 나눌 수 있다."
    },
    "prompt": "다음과 같이 동물을 분류할 수 있는 분류 기준으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "표": {
        "그렇다.": [
          "닭, 참새, 잠자리"
        ],
        "그렇지 않다.": [
          "뱀, 문어, 고양이"
        ]
      }
    },
    "choices": [
      "알을 낳는가?",
      "날개가 있는가?",
      "깃털이 멋진가?",
      "더듬이가 있는가?",
      "몸이 털로 덮여 있는가?"
    ],
    "figure": "assets/bank/s31-u02/s1-q05.webp",
    "figureNote": "그렇다./그렇지 않다. 두 칸 분류표(내용은 givens.표에 옮김).",
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
    "explanation": "닭, 참새, 잠자리는 날개가 있는 동물이고, 뱀, 문어, 고양이는 날개가 없는 동물입니다.",
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
    "id": "s31-u02-o1-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 6,
      "page": 1,
      "sourceId": "sci-31-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "땅속에 사는 동물",
      "concept": "두더지, 지렁이, 땅강아지, 매미 애벌레는 주로 땅속에 산다."
    },
    "prompt": "주로 땅속에 사는 동물끼리 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "게, 조개, 두더지",
      "너구리, 뱀, 개미",
      "개구리, 뱀, 두더지",
      "지렁이, 두더지, 땅강아지",
      "피라미, 매미 애벌레, 개미"
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
    "explanation": "두더지, 지렁이, 땅강아지, 매미 애벌레는 주로 땅속에 사는 동물입니다. 너구리는 땅 위에, 뱀과 개미는 땅 위와 땅속을 오가며 사는 동물입니다.",
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
    "id": "s31-u02-o1-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 7,
      "page": 2,
      "sourceId": "sci-31-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "딱따구리의 이름과 특징",
      "concept": "딱따구리는 깃털로 덮인 몸과 날개가 있고, 곧고 날카로운 부리로 나무에 구멍을 내어 먹이를 잡아먹는다."
    },
    "prompt": "다음 동물의 이름과 특징을 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "뱀 - 몸이 길쭉하고 비늘로 덮여 있다.",
      "두더지 - 주로 밤에 먹이를 찾아다닌다.",
      "두더지 - 두 쌍의 다리로 걷거나 뛰어다닌다.",
      "딱따구리 - 삽 같은 앞발로 땅속에 굴을 파서 생활한다.",
      "딱따구리 - 곧고 날카로운 부리로 나무에 구멍을 내어 먹이를 잡아먹는다."
    ],
    "figure": "assets/bank/s31-u02/s1-q07.webp",
    "figureNote": "나무줄기에 붙어 있는 딱따구리(오색딱따구리) 사진. 이름 캡션 없음.",
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
    "explanation": "딱따구리의 모습입니다. 딱따구리는 몸이 깃털로 덮여 있고, 날개를 이용해 날아다닙니다. 또한 곧고 날카로운 부리로 나무에 구멍을 내어 먹이를 잡아먹습니다.",
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
    "id": "s31-u02-o1-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 8,
      "page": 2,
      "sourceId": "sci-31-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "개미의 특징",
      "concept": "개미는 몸이 머리·가슴·배로 나뉘고 세 쌍의 다리가 있으며, 땅 위와 땅속을 오가며 생활한다."
    },
    "prompt": "다음 <보기>에서 개미의 특징에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 두 쌍의 다리가 있다.",
        "㉡ 땅 위와 땅속을 오가며 생활한다.",
        "㉢ 몸이 머리, 가슴, 배의 세 부분으로 구분된다.",
        "㉣ 삽 모양의 앞발로 땅속에 굴을 파서 생활한다."
      ]
    },
    "choices": [
      "㉠, ㉢",
      "㉠, ㉣",
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
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "개미는 세 쌍의 다리가 있고, 큰턱으로 땅을 파서 땅속에 집을 짓습니다.",
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
    "id": "s31-u02-o1-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 9,
      "page": 2,
      "sourceId": "sci-31-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "수달이 물에서 살기에 알맞은 특징",
      "concept": "수달은 발가락 사이의 물갈퀴로 물속에서 헤엄칠 수 있어 강이나 호수에서 살기에 알맞다."
    },
    "prompt": "수달이 강이나 호수에서 살아가기에 알맞은 특징을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s31-u02/s1-q09.webp",
    "figureNote": "나무 위에 서 있는 수달 사진.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예) 발가락 사이에 물갈퀴가 있어 물속에서 헤엄쳐 다닐 수 있다. 등",
      "rubric": {
        "required": [
          "발에 물갈퀴가 있다",
          "물속에서 헤엄쳐 다닐 수 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "물갈퀴가 있는 발로 헤엄쳐 다닌다는 내용과 같이 강이나 호수에서 살아가기에 알맞은 특징이 포함되어 있으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "수달은 강이나 호수에서 땅과 물을 오가며 생활하는 동물입니다. 발가락 사이에 물갈퀴가 있으며, 물속에서는 물갈퀴가 있는 발로 헤엄쳐 다닙니다.\n[채점 기준] 물갈퀴가 있는 발로 헤엄쳐 다닌다는 내용과 같이 강이나 호수에서 살아가기에 알맞은 특징이 포함되어 있으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준에 비율 표기가 없어 ratio를 100%로 둠."
    }
  },
  {
    "id": "s31-u02-o1-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 10,
      "page": 2,
      "sourceId": "sci-31-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "배발로 기어다니는 물에 사는 동물",
      "concept": "전복과 다슬기는 배발로 물속 바위에 붙어 기어다닌다."
    },
    "prompt": "다음과 같은 특징이 있는 동물을 <보기>에서 모두 고른 것은 어느 것입니까?",
    "givens": {
      "지문": "[10~11] 다음 <보기>의 여러 가지 동물을 보고, 물음에 답하시오.\n배발을 이용해 물속 바위에 붙어서 기어다닙니다.",
      "보기": [
        "㉠ 전복",
        "㉡ 개구리",
        "㉢ 다슬기",
        "㉣ 고등어"
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉢",
      "㉡, ㉣",
      "㉢, ㉣"
    ],
    "figure": "assets/bank/s31-u02/s1-q10.webp",
    "figureNote": "<보기> 상자: ㉠ 전복, ㉡ 개구리, ㉢ 다슬기, ㉣ 고등어 사진(각 사진 아래 ▲ 이름 캡션).",
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
    "explanation": "전복과 다슬기는 배발을 이용해 물속 바위에 붙어서 기어다닙니다. 개구리는 땅에서 다리로 뛰어 다니고, 물속에서는 물갈퀴가 있는 발로 헤엄쳐 다닙니다. 고등어는 물속에서 지느러미로 헤엄쳐 다닙니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "공통 발문 [10~11]과 <보기>(사진+캡션)를 지문·보기에 넣었고, 특징 문장('배발을 이용해 …')은 별도 상자로 인쇄됨."
    }
  },
  {
    "id": "s31-u02-o1-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 11,
      "page": 2,
      "sourceId": "sci-31-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "사는 곳에 따른 동물 분류",
      "concept": "개구리와 다슬기는 강이나 호수에, 전복과 고등어는 갯벌이나 바다에 산다."
    },
    "prompt": "<보기>의 동물을 사는 곳에 따라 알맞게 분류한 것은 어느 것입니까?",
    "givens": {
      "지문": "[10~11] 다음 <보기>의 여러 가지 동물을 보고, 물음에 답하시오.",
      "보기": [
        "㉠ 전복",
        "㉡ 개구리",
        "㉢ 다슬기",
        "㉣ 고등어"
      ]
    },
    "choices": [
      "㉠, ㉡ / ㉢, ㉣",
      "㉠, ㉣ / ㉡, ㉢",
      "㉡, ㉢ / ㉠, ㉣",
      "㉡, ㉣ / ㉠, ㉢",
      "㉢, ㉣ / ㉠, ㉡"
    ],
    "figure": "assets/bank/s31-u02/s1-q10.webp",
    "figureNote": "<보기> 상자: ㉠ 전복, ㉡ 개구리, ㉢ 다슬기, ㉣ 고등어 사진(각 사진 아래 ▲ 이름 캡션).",
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
    "explanation": "개구리와 다슬기는 강이나 호수에 사는 동물이고, 전복과 고등어는 갯벌이나 바다에 사는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기가 표 형식: 열 머리 '강이나 호수' / '갯벌이나 바다'."
    }
  },
  {
    "id": "s31-u02-o1-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 12,
      "page": 2,
      "sourceId": "sci-31-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "매미의 특징",
      "concept": "매미는 얇은 막 같은 날개 두 쌍으로 나무 사이를 날아다니며 나무 수액을 먹고, 수컷이 소리를 낸다."
    },
    "prompt": "매미의 특징으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "수컷이 소리를 낸다.",
      "나무 수액을 먹는다.",
      "날개가 얇아 날 수 없다.",
      "얇은 막처럼 생긴 날개 두 쌍이 있다.",
      "몸이 머리, 가슴, 배의 세 부분으로 구분된다."
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
    "explanation": "매미는 몸이 머리, 가슴, 배의 세 부분으로 구분되고, 얇은 막처럼 생긴 날개 두 쌍이 있습니다. 나무 수액을 먹고 나무 사이를 날아다니며, 수컷이 소리를 냅니다.",
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
    "id": "s31-u02-o1-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 13,
      "page": 3,
      "sourceId": "sci-31-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "까치와 왜가리의 공통점",
      "concept": "까치와 왜가리는 날 수 있는 새로, 한 쌍의 날개와 다리가 있고 몸이 깃털로 덮여 있다."
    },
    "prompt": "까치와 왜가리의 공통점을 두 가지 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s31-u02/s1-q13.webp",
    "figureNote": "까치 사진(▲ 까치)과 물가의 왜가리 사진(▲ 왜가리).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예) 한 쌍의 날개가 있다. / 한 쌍의 다리가 있다. / 몸이 깃털로 덮여 있다. / 날 수 있다. / 몸이 크기에 비해 가볍다. 등",
      "rubric": {
        "required": [
          "날 수 있는 새의 공통점 한 가지(예: 한 쌍의 날개가 있다)",
          "공통점 한 가지 더(예: 몸이 깃털로 덮여 있다)"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "날 수 있는 새의 특징 두 가지를 바르게 썼으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "까치와 왜가리는 날 수 있는 새로, 한 쌍의 날개와 다리가 있고, 몸이 깃털로 덮여 있습니다.\n[채점 기준] 날 수 있는 새의 특징 두 가지를 바르게 썼으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준에 비율 표기가 없어 ratio를 100%로 둠."
    }
  },
  {
    "id": "s31-u02-o1-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 14,
      "page": 3,
      "sourceId": "sci-31-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "사막 환경의 특징",
      "concept": "사막은 비가 거의 내리지 않아 건조하고 낮과 밤의 온도 차이가 크다."
    },
    "prompt": "다음에서 설명하는 환경으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 비가 거의 내리지 않아 건조합니다.\n• 낮과 밤의 온도 차이가 큽니다."
    },
    "choices": [
      "강",
      "들",
      "산",
      "사막",
      "극지방"
    ],
    "figure": "assets/bank/s31-u02/s1-q14.webp",
    "figureNote": "보기가 사진 5장: ① 강, ② 들, ③ 산, ④ 사막, ⑤ 극지방(각 사진 아래 ▲ 캡션).",
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
    "explanation": "사막은 비가 거의 내리지 않아 건조하고 낮과 밤의 온도 차이가 큽니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기는 사진+캡션으로 인쇄됨. choices에는 캡션 글자만 옮김."
    }
  },
  {
    "id": "s31-u02-o1-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 15,
      "page": 3,
      "sourceId": "sci-31-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "낙타의 혹",
      "concept": "사막에 사는 낙타는 등의 혹에 지방을 저장해 물과 먹이 없이도 며칠을 버틴다."
    },
    "prompt": "다음 빈칸에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "낙타는 등의 혹에 □을/를 저장하여 물과 먹이가 없어도 며칠 동안 살 수 있습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "지방",
      "accepted": [
        "지방"
      ]
    },
    "explanation": "낙타는 사막에 사는 동물로, 등의 혹에 지방을 저장하여 물과 먹이가 없어도 며칠 동안 살 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 지문 안에 네모 칸으로 인쇄됨(□로 표기)."
    }
  },
  {
    "id": "s31-u02-o1-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 16,
      "page": 3,
      "sourceId": "sci-31-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "북극곰의 특징",
      "concept": "북극곰은 두꺼운 피부와 촘촘한 털로 추위를 견디고, 발바닥 돌기로 얼음 위에서 미끄러지지 않는다."
    },
    "prompt": "다음과 같은 특징을 가진 동물로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 두꺼운 피부와 촘촘하게 난 털이 추위를 막아 줍니다.\n• 발바닥에 작은 돌기들이 있어 얼음 위에서 미끄러지지 않습니다."
    },
    "choices": [
      "펭귄",
      "북극곰",
      "흰고래",
      "북극여우",
      "바다코끼리"
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
    "explanation": "북극곰은 극지방에 사는 동물로, 두꺼운 피부와 촘촘하게 난 털이 추위를 막아 주고, 발바닥에 작은 돌기들이 있어 얼음 위에서 미끄러지지 않습니다.",
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
    "id": "s31-u02-o1-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 17,
      "page": 3,
      "sourceId": "sci-31-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "동굴에 사는 동물",
      "concept": "박쥐와 동굴옆새우는 동굴에 사는 동물이다."
    },
    "prompt": "주로 동굴에 사는 동물끼리 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "메기, 물방개",
      "박쥐, 물방개",
      "메기, 초롱아귀",
      "박쥐, 동굴옆새우",
      "초롱아귀, 동굴옆새우"
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
    "explanation": "박쥐와 동굴옆새우는 동굴에 사는 동물입니다. 메기와 물방개는 강이나 호수, 초롱아귀는 깊은 바닷속에 사는 동물입니다.",
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
    "id": "s31-u02-o1-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 18,
      "page": 3,
      "sourceId": "sci-31-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "높은 산 환경의 특징",
      "concept": "산양과 눈표범이 사는 높은 산은 춥고 바람이 많이 불며 경사가 급하다."
    },
    "prompt": "다음 동물들이 주로 사는 환경에 대한 설명으로 알맞은 것을 <보기>에서 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 춥고 바람이 많이 분다.",
        "㉡ 햇빛이 거의 닿지 않아서 어둡다.",
        "㉢ 밀물 때는 물에 잠기고 썰물 때는 물 밖으로 땅이 드러난다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s31-u02/s1-q18.webp",
    "figureNote": "바위산 위의 산양 그림(▲ 산양)과 눈 위의 눈표범 그림(▲ 눈표범).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠",
      "accepted": [
        "㉠",
        "ㄱ",
        "㉠ 춥고 바람이 많이 분다.",
        "춥고 바람이 많이 분다."
      ]
    },
    "explanation": "산양과 눈표범은 높은 산에 사는 동물입니다. 높은 산은 춥고 바람이 많이 불며, 경사가 급합니다.",
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
    "id": "s31-u02-o1-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 19,
      "page": 4,
      "sourceId": "sci-31-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "상어를 모방한 전신 수영복",
      "concept": "전신 수영복은 비늘이 있어 물이 잘 흐르는 상어 피부의 특징을 본떠 물속에서 빨리 헤엄치도록 만든 것이다."
    },
    "prompt": "전신 수영복을 만드는 데 이용한 상어의 특징으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "다른 물체에 잘 붙는 특징",
      "절벽에서 잘 미끄러지지 않는 특징",
      "크고 단단한 앞발로 굴을 파는 특징",
      "피부에 비늘이 있어 물이 잘 흐르는 특징",
      "세찬 파도에도 바위에서 떨어지지 않는 특징"
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
    "explanation": "상어의 피부에 비늘이 있어 물이 잘 흐르는 특징을 이용해 물속에서 빠르게 헤엄칠 수 있도록 돕는 전신 수영복을 만들었습니다.",
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
    "id": "s31-u02-o1-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 20,
      "page": 4,
      "sourceId": "sci-31-2-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "수리 발을 모방한 생활용품",
      "concept": "집게 차는 먹이를 잘 잡고 놓치지 않는 수리 발의 특징을 본떠 물건을 잡아 옮기도록 만든 것이다."
    },
    "prompt": "수리의 발이 먹이를 잘 잡고 놓치지 않는 특징을 이용해 만든 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "물갈퀴",
      "흡착판",
      "집게 차",
      "고속열차",
      "등산화 밑창"
    ],
    "figure": "assets/bank/s31-u02/s1-q20.webp",
    "figureNote": "날개를 펴고 발을 내민 흰머리수리 사진.",
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
    "explanation": "수리의 발이 먹이를 잘 잡고 놓치지 않는 특징을 이용해 물건을 잡아 옮길 수 있는 집게 차를 만들었습니다.",
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
    "id": "s31-u02-o2-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 1,
      "page": 1,
      "sourceId": "sci-31-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "참새의 생김새",
      "concept": "참새는 몸이 깃털로 덮여 있고 날개와 다리가 각각 한 쌍씩 있다."
    },
    "prompt": "다음은 참새에 대한 설명입니다. ㉠, ㉡에 들어갈 알맞은 말을 골라 쓰시오.",
    "givens": {
      "지문": "몸이 ㉠ ( 털, 깃털 )로 덮여 있고 ㉡ ( 한, 두 ) 쌍의 날개와 다리가 있습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 깃털, ㉡ 한",
      "accepted": [
        "㉠ 깃털, ㉡ 한",
        "㉠깃털, ㉡한",
        "깃털, 한",
        "깃털 한",
        "㉠ 깃털 ㉡ 한"
      ]
    },
    "explanation": "참새는 몸이 깃털로 덮여 있고 한 쌍의 날개와 다리가 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란은 「㉠ (        ), ㉡ (        )」 형태."
    }
  },
  {
    "id": "s31-u02-o2-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 2,
      "page": 1,
      "sourceId": "sci-31-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "주변 동물의 특징",
      "concept": "달팽이는 다리가 없어 배를 이용해 미끄러지듯이 움직인다."
    },
    "prompt": "우리 주변에 사는 동물의 특징으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "고양이는 몸이 털로 덮여 있다.",
      "달팽이는 두 쌍의 다리가 있다.",
      "잠자리는 커다란 눈과 두 쌍의 날개가 있다.",
      "공벌레는 건드리면 몸을 공처럼 둥글게 만든다.",
      "금붕어는 아가미가 있어 물속에서 숨을 쉴 수 있다."
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
    "explanation": "달팽이는 다리가 없고 미끄러지듯이 움직입니다.",
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
    "id": "s31-u02-o2-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 3,
      "page": 1,
      "sourceId": "sci-31-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "동물 관찰 시 주의할 점",
      "concept": "동물을 관찰할 때는 함부로 만지지 말고 작은 동물은 돋보기 같은 도구로 관찰한다."
    },
    "prompt": "우리 주변에 사는 동물을 관찰할 때 주의할 점을 잘못 설명한 사람의 이름을 쓰시오.",
    "givens": {
      "지문": "• 단비: 풀밭에 함부로 앉거나 엎드리지 않습니다.\n• 다래: 생명을 소중히 여기는 마음으로 동물을 관찰합니다.\n• 하늘: 크기가 작은 동물은 손으로 들어 올려서 관찰합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "하늘",
      "accepted": [
        "하늘"
      ]
    },
    "explanation": "동물을 관찰할 때 동물을 함부로 만지지 않도록 주의합니다. 크기가 작은 동물은 돋보기와 같은 관찰 도구를 이용하여 관찰합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「잘못」에 밑줄. 지문 속 이름(단비·다래·하늘)과 콜론은 굵은 글씨."
    }
  },
  {
    "id": "s31-u02-o2-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 4,
      "page": 1,
      "sourceId": "sci-31-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "알을 낳는가에 따른 분류",
      "concept": "토끼는 새끼를 낳는 동물이므로 알을 낳지 않는 무리로 분류해야 한다."
    },
    "prompt": "다음은 ‘알을 낳는가?’의 기준으로 동물을 분류한 결과입니다. 잘못 분류한 동물의 이름을 쓰시오.",
    "givens": {
      "표": {
        "그렇다.": [
          "닭, 토끼, 개미"
        ],
        "그렇지 않다.": [
          "개, 소, 말"
        ]
      }
    },
    "choices": null,
    "figure": "assets/bank/s31-u02/s2-q04.webp",
    "figureNote": "‘그렇다.’/‘그렇지 않다.’ 두 칸 분류표(내용은 givens에 옮김)",
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
    "explanation": "토끼는 새끼를 낳는 동물이기 때문에 ‘그렇지 않다.’로 분류되어야 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「잘못」에 밑줄."
    }
  },
  {
    "id": "s31-u02-o2-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 5,
      "page": 1,
      "sourceId": "sci-31-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "동물 분류 기준 찾기",
      "concept": "상어·금붕어·메기는 지느러미가 있고 뱀·달팽이·꿀벌은 지느러미가 없으므로 ‘지느러미가 있는가?’로 나눌 수 있다."
    },
    "prompt": "다음과 같이 동물을 분류할 수 있는 분류 기준으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "표": {
        "그렇다.": [
          "상어, 금붕어, 메기"
        ],
        "그렇지 않다.": [
          "뱀, 달팽이, 꿀벌"
        ]
      }
    },
    "choices": [
      "새끼를 낳는가?",
      "날개가 있는가?",
      "더듬이가 있는가?",
      "지느러미가 있는가?",
      "몸이 깃털로 덮여 있는가?"
    ],
    "figure": "assets/bank/s31-u02/s2-q05.webp",
    "figureNote": "‘그렇다.’/‘그렇지 않다.’ 두 칸 분류표(내용은 givens에 옮김)",
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
    "explanation": "상어, 금붕어, 메기는 지느러미가 있는 동물이고, 뱀, 달팽이, 꿀벌은 지느러미가 없는 동물입니다.",
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
    "id": "s31-u02-o2-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 6,
      "page": 1,
      "sourceId": "sci-31-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "매미 애벌레가 사는 곳",
      "concept": "매미 애벌레는 땅속에서 나무뿌리의 수액을 먹으며 살다가 다 자라면 땅 위로 올라와 매미가 된다."
    },
    "prompt": "다음 <보기>에서 매미 애벌레가 주로 생활하는 곳을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 사막",
        "㉡ 땅속",
        "㉢ 땅 위",
        "㉣ 바닷속"
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
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ",
        "땅속"
      ]
    },
    "explanation": "매미 애벌레는 앞다리로 땅속에 굴을 파고 나무뿌리의 수액을 빨아 먹으며 생활합니다. 다 자라면 땅 위로 올라와 나무에서 껍질을 벗고 매미가 됩니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 2열 배치(㉠ 사막, ㉡ 땅속 / ㉢ 땅 위, ㉣ 바닷속)."
    }
  },
  {
    "id": "s31-u02-o2-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 7,
      "page": 2,
      "sourceId": "sci-31-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "두더지의 특징",
      "concept": "두더지는 털로 덮인 몸과 삽 같은 앞발을 가지고 땅속에 굴을 파서 생활한다."
    },
    "prompt": "두더지의 특징으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "몸이 깃털로 덮여 있다.",
      "땅과 물을 오가며 생활한다.",
      "세 쌍의 다리와 커다란 눈이 있다.",
      "여러 개의 지느러미를 이용하여 헤엄친다.",
      "삽 같은 앞발로 땅속에 굴을 파서 생활한다."
    ],
    "figure": "assets/bank/s31-u02/s2-q07.webp",
    "figureNote": "흙을 헤치고 나온 두더지 사진",
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
    "explanation": "두더지는 몸 윗면이 털로 덮여 있고, 짧은 꼬리가 있으며, 삽 같은 앞발로 땅속에 굴을 파서 생활합니다.",
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
    "id": "s31-u02-o2-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 8,
      "page": 2,
      "sourceId": "sci-31-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "땅에서 사는 동물의 이동 방법",
      "concept": "뱀·지렁이·달팽이는 다리 없이 기어서 이동하고 너구리는 다리로 걷거나 뛰어서 이동한다."
    },
    "prompt": "다음 <보기>에서 이동 방법이 나머지와 다른 동물을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 뱀",
        "㉡ 너구리",
        "㉢ 지렁이",
        "㉣ 달팽이"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s31-u02/s2-q08.webp",
    "figureNote": "<보기> 사진 4장: ㉠ 뱀, ㉡ 너구리, ㉢ 지렁이, ㉣ 달팽이(각 사진 아래 ‘▲ 이름’ 표기, 이름은 givens에 옮김)",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ",
        "너구리"
      ]
    },
    "explanation": "뱀, 지렁이, 달팽이는 다리가 없어 기어다니고, 너구리는 다리로 걷거나 뛰어 다닙니다.",
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
    "id": "s31-u02-o2-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 9,
      "page": 2,
      "sourceId": "sci-31-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "갯벌에 사는 동물",
      "concept": "조개와 게는 갯벌에 살며 조개는 도끼 모양의 발로, 게는 다리로 갯벌에서 이동한다."
    },
    "prompt": "다음 빈칸에 공통으로 들어갈 알맞은 말은 어느 것입니까?",
    "givens": {
      "지문": "• 조개는 도끼 모양의 발로 땅을 파고 들어가거나 [    ]을/를 기어다닙니다.\n• 게는 몸이 단단한 껍데기로 덮여 있고, 다리로 [    ]을/를 걸어 다닙니다."
    },
    "choices": [
      "들",
      "산",
      "숲",
      "갯벌",
      "사막"
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
    "explanation": "조개와 게는 갯벌이나 바다에 사는 동물입니다. 조개는 도끼 모양의 발로 갯벌을 기어다니고, 게는 다리로 갯벌을 걸어 다닙니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 인쇄본에서 빈 네모 칸이며 [    ]로 옮김. 보기 ①~⑤는 3열 배치."
    }
  },
  {
    "id": "s31-u02-o2-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 10,
      "page": 2,
      "sourceId": "sci-31-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "강이나 호수에 사는 동물의 특징",
      "concept": "강이나 호수에 사는 동물은 물갈퀴·지느러미 등 물에서 살아가기에 알맞은 특징을 가지고 있다."
    },
    "prompt": "강이나 호수에서 볼 수 있는 동물을 한 가지 쓰고, 그 동물이 강이나 호수에서 살아가기에 알맞은 특징을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예) 수달, 물속에서 물갈퀴가 있는 발로 헤엄쳐 다닌다. / 메기, 지느러미로 물속을 헤엄쳐 다닌다. / 다슬기, 배발을 이용해 물속 바위에 붙어서 기어다닌다. 등",
      "rubric": {
        "required": [
          "강이나 호수에 사는 동물 이름",
          "그 동물이 강이나 호수에서 살아가기에 알맞은 특징"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "강이나 호수에 사는 동물과 그 동물의 특징을 바르게 썼으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "강이나 호수에 사는 동물에는 수달, 개구리, 메기, 다슬기, 물방개, 피라미 등이 있습니다. 강이나 호수에 사는 동물은 강이나 호수에서 살아가기에 알맞은 특징을 가지고 있습니다.\n[채점 기준] 강이나 호수에 사는 동물과 그 동물의 특징을 바르게 썼으면 정답으로 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준에 비율(%) 표기가 없어 ratio는 null. 모범 답안의 「배발」은 인쇄된 그대로."
    }
  },
  {
    "id": "s31-u02-o2-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 11,
      "page": 2,
      "sourceId": "sci-31-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "바다에 사는 동물(고등어)",
      "concept": "고등어는 바다에 살며 몸이 부드러운 곡선 모양이고 지느러미로 헤엄친다."
    },
    "prompt": "다음과 같은 특징을 가진 동물로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 새우나 작은 물고기 등을 먹습니다.\n• 몸이 부드러운 곡선 모양입니다.\n• 등이 푸른색이고, 지느러미로 헤엄쳐 다닙니다."
    },
    "choices": [
      "수달",
      "개구리",
      "다슬기",
      "고등어",
      "물방개"
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
    "explanation": "고등어는 바다에 사는 동물로, 몸이 부드러운 곡선 모양이고, 지느러미로 헤엄쳐 다니며, 새우나 작은 물고기 등을 먹습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기 ①~⑤는 2열 배치."
    }
  },
  {
    "id": "s31-u02-o2-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 12,
      "page": 2,
      "sourceId": "sci-31-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "날개의 수",
      "concept": "곤충인 매미와 잠자리는 날개가 두 쌍이고 새인 왜가리와 직박구리는 날개가 한 쌍이다."
    },
    "prompt": "다음 <보기>에서 두 쌍의 날개가 있는 동물을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 매미",
        "㉡ 왜가리",
        "㉢ 잠자리",
        "㉣ 직박구리"
      ]
    },
    "choices": [
      "㉠, ㉢",
      "㉠, ㉣",
      "㉡, ㉢",
      "㉡, ㉣",
      "㉢, ㉣"
    ],
    "figure": "assets/bank/s31-u02/s2-q12.webp",
    "figureNote": "<보기> 사진 4장: ㉠ 매미, ㉡ 왜가리, ㉢ 잠자리, ㉣ 직박구리(이름은 givens에 옮김)",
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
    "explanation": "매미와 잠자리는 두 쌍의 날개가 있고, 왜가리와 직박구리는 한 쌍의 날개가 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기 ①~⑤는 3열 배치."
    }
  },
  {
    "id": "s31-u02-o2-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 13,
      "page": 3,
      "sourceId": "sci-31-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "날아다니는 동물의 공통점",
      "concept": "날 수 있는 동물은 날개가 있고 몸이 크기에 비해 가볍다."
    },
    "prompt": "다음 동물들의 공통점으로 알맞은 것을 두 가지 고르시오.",
    "givens": {
      "지문": "▲ 갈매기  ▲ 나비"
    },
    "choices": [
      "날개가 있다.",
      "더듬이 한 쌍이 있다.",
      "꽃에서 꿀을 빨아먹는다.",
      "몸이 크기에 비해 가볍다.",
      "발의 물갈퀴로 헤엄쳐 다닐 수 있다."
    ],
    "figure": "assets/bank/s31-u02/s2-q13.webp",
    "figureNote": "사진 2장: 바위 위의 갈매기, 꽃에 앉은 나비(아래에 ‘▲ 갈매기’, ‘▲ 나비’)",
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
    "explanation": "갈매기와 나비는 날 수 있는 동물로, 날개가 있고 몸이 크기에 비해 가볍습니다.",
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
    "id": "s31-u02-o2-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 14,
      "page": 3,
      "sourceId": "sci-31-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "극지방의 환경",
      "concept": "북극여우가 사는 극지방은 눈과 얼음으로 덮여 있고 바람이 강하며 매우 춥다."
    },
    "prompt": "다음 동물이 주로 사는 환경에 대한 설명으로 알맞은 것을 <보기>에서 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 눈과 얼음으로 덮여 있다.",
        "㉡ 낮에는 매우 덥고 건조하다.",
        "㉢ 나무나 풀 등의 식물이 빽빽하게 자라 있다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s31-u02/s2-q14.webp",
    "figureNote": "눈밭에 서 있는 흰 북극여우 사진(동물 이름 표기 없음)",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠",
      "accepted": [
        "㉠",
        "ㄱ",
        "눈과 얼음으로 덮여 있다."
      ]
    },
    "explanation": "주로 극지방에 사는 북극여우의 모습입니다. 극지방은 눈과 얼음으로 덮여 있고 바람이 강하게 불며 매우 춥습니다.",
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
    "id": "s31-u02-o2-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 15,
      "page": 3,
      "sourceId": "sci-31-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "사막 도마뱀의 특징",
      "concept": "사막 도마뱀은 발바닥과 피부로 물을 흡수하고 두 발씩 번갈아 들어 열을 식혀 사막에서 살아간다."
    },
    "prompt": "사막 도마뱀은 사막에서 살아가기에 알맞은 특징을 가지고 있습니다. 그 특징은 무엇입니까?",
    "givens": null,
    "choices": [
      "날개가 있다.",
      "발바닥과 피부로 물을 흡수할 수 있다.",
      "새벽에 등의 돌기에 맺힌 물을 모아서 마신다.",
      "두꺼운 피부와 촘촘하게 난 털이 더위를 막아 준다.",
      "자는 동안 긴 송곳니를 모래에 박아 몸이 미끄러지지 않게 고정한다."
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
    "explanation": "사막 도마뱀은 몸이 비늘로 덮여 있어 체온을 잘 조절할 수 있고, 발바닥과 피부로 물을 흡수할 수 있습니다. 또한 서 있거나 이동할 때 한 번에 두 발씩 번갈아 들어 올리며 열을 식힙니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설이 답안 1쪽 끝에서 2쪽으로 이어짐."
    }
  },
  {
    "id": "s31-u02-o2-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 16,
      "page": 3,
      "sourceId": "sci-31-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "펭귄이 몸을 맞대는 까닭",
      "concept": "펭귄은 추운 극지방에서 여러 마리가 몸을 맞대어 추위를 견딘다."
    },
    "prompt": "주로 극지방에 사는 펭귄은 여러 마리가 서로 몸을 맞대며 생활합니다. 펭귄이 몸을 맞대며 생활하는 까닭을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s31-u02/s2-q16.webp",
    "figureNote": "서로 붙어 서 있는 황제펭귄 무리와 새끼 펭귄 사진",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "추운 극지방에서 추위를 견디기 위해 여러 마리가 서로 몸을 맞댄다.",
      "rubric": {
        "required": [
          "극지방이 매우 춥다",
          "몸을 맞대어 추위를 견딘다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "추위를 견디기 위해서라는 내용이 포함되어 있으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "펭귄은 주로 극지방에 사는 동물로, 몸이 물에 젖지 않는 깃털로 덮여 있고, 여러 마리가 서로 몸을 맞대 추위를 견딥니다.\n[채점 기준] 추위를 견디기 위해서라는 내용이 포함되어 있으면 정답으로 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준에 비율(%) 표기가 없어 ratio는 null."
    }
  },
  {
    "id": "s31-u02-o2-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 17,
      "page": 3,
      "sourceId": "sci-31-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "깊은 바다에 사는 동물(초롱아귀)",
      "concept": "초롱아귀는 깊은 바닷속에 살며 빛을 내는 촉수로 먹이를 유인해 잡아먹는다."
    },
    "prompt": "다음과 같은 특징을 가진 동물로 알맞은 것을 <보기>에서 골라 기호를 쓰시오.",
    "givens": {
      "지문": "[17~18] 다음 <보기>의 여러 가지 동물을 보고, 물음에 답하시오.\n• 빛을 내는 촉수가 있어 빛으로 먹이를 유인해 잡아먹습니다.\n• 큰 입과 날카로운 이빨을 가지고 있어 먹이를 한 번 물면 놓치지 않습니다.",
      "보기": [
        "㉠ 산양",
        "㉡ 박쥐",
        "㉢ 눈표범",
        "㉣ 초롱아귀"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s31-u02/s2-q17.webp",
    "figureNote": "[17~18] 공통 <보기> 그림 4장: ㉠ 산양(바위산), ㉡ 박쥐(동굴 벽에 매달림), ㉢ 눈표범(눈 덮인 곳), ㉣ 초롱아귀(깊은 바다, 머리에 빛나는 촉수)(이름은 givens에 옮김)",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉣",
      "accepted": [
        "㉣",
        "ㄹ",
        "초롱아귀"
      ]
    },
    "explanation": "초롱아귀는 깊은 바닷속에 사는 동물로, 빛을 내는 촉수가 있어 빛으로 먹이를 유인해 잡아먹습니다. 또한 큰 입과 날카로운 이빨을 가지고 있어 먹이를 한 번 물면 놓치지 않습니다.",
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
    "id": "s31-u02-o2-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 18,
      "page": 4,
      "sourceId": "sci-31-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "높은 산에 사는 동물",
      "concept": "춥고 바람이 많이 불며 경사가 급한 높은 산에는 산양과 눈표범이 산다."
    },
    "prompt": "다음과 같은 환경에 주로 사는 동물을 <보기>에서 모두 고른 것은 어느 것입니까?",
    "givens": {
      "지문": "[17~18] 다음 <보기>의 여러 가지 동물을 보고, 물음에 답하시오.\n춥고 바람이 많이 불며, 경사가 급합니다.",
      "보기": [
        "㉠ 산양",
        "㉡ 박쥐",
        "㉢ 눈표범",
        "㉣ 초롱아귀"
      ]
    },
    "choices": [
      "㉡",
      "㉣",
      "㉠, ㉢",
      "㉡, ㉢",
      "㉢, ㉣"
    ],
    "figure": "assets/bank/s31-u02/s2-q17.webp",
    "figureNote": "[17~18] 공통 <보기> 그림 4장: ㉠ 산양(바위산), ㉡ 박쥐(동굴 벽에 매달림), ㉢ 눈표범(눈 덮인 곳), ㉣ 초롱아귀(깊은 바다, 머리에 빛나는 촉수)(이름은 givens에 옮김)",
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
    "explanation": "높은 산에 대한 설명으로, 높은 산에 사는 동물은 산양과 눈표범입니다. 박쥐는 동굴에, 초롱아귀는 깊은 바닷속에 사는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "공통 <보기> 그림은 3쪽(17번 위)에 있음 — figure.page=3. 보기 ①~⑤는 3열 배치."
    }
  },
  {
    "id": "s31-u02-o2-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 19,
      "page": 4,
      "sourceId": "sci-31-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "동물의 특징을 모방한 생활용품(흡착판)",
      "concept": "흡착판은 문어의 빨판이 물체에 잘 붙는 특징을 본떠 만든 것이다."
    },
    "prompt": "빈칸에 들어갈 알맞은 말은 어느 것입니까?",
    "givens": {
      "지문": "칫솔걸이에 사용하는 흡착판은 [    ]이/가 물체에 잘 붙는 특징을 이용해 만든 것입니다."
    },
    "choices": [
      "오리의 발",
      "수리의 발",
      "상어의 피부",
      "문어의 빨판",
      "산양의 발바닥"
    ],
    "figure": "assets/bank/s31-u02/s2-q19.webp",
    "figureNote": "호랑이 모양 칫솔걸이가 흡착판으로 벽(유리)에 붙어 있는 사진",
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
    "explanation": "문어의 빨판이 물체에 잘 붙는 특징을 이용해 물체에 잘 붙는 흡착판을 만들었습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 인쇄본에서 빈 네모 칸이며 [    ]로 옮김."
    }
  },
  {
    "id": "s31-u02-o2-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 20,
      "page": 4,
      "sourceId": "sci-31-2-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "동물의 특징을 모방한 예(고속열차)",
      "concept": "고속열차의 앞부분은 산천어의 부드러운 곡선 몸 모양을 본떠 빠르게 달릴 수 있게 만들었다."
    },
    "prompt": "다음과 같은 특징을 이용한 예로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "산천어의 몸은 부드러운 곡선 모양으로 되어 있어 물속에서 빠르게 헤엄칠 수 있습니다."
    },
    "choices": [
      "물갈퀴",
      "집게 차",
      "고속열차",
      "등산화 밑창",
      "물속에서도 사용할 수 있는 접착제"
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
  },
  {
    "id": "s31-u02-o3-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 1,
      "page": 1,
      "sourceId": "sci-31-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "학교 화단에서 볼 수 있는 동물",
      "concept": "가오리는 바다에 사는 동물이어서 학교 화단에서는 볼 수 없다."
    },
    "prompt": "학교 화단에서 관찰할 수 있는 동물로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "잠자리",
      "고양이",
      "공벌레",
      "달팽이",
      "가오리"
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
    "explanation": "학교 화단에서 잠자리, 고양이, 공벌레, 달팽이 등 여러 가지 동물을 관찰할 수 있습니다. 가오리는 바다에 사는 동물로, 학교 화단에서 관찰할 수 없습니다.",
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
    "id": "s31-u02-o3-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 2,
      "page": 1,
      "sourceId": "sci-31-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "특징으로 동물 찾기(참새)",
      "concept": "참새는 몸이 깃털로 덮여 있고 한 쌍의 날개와 다리가 있는 새이다."
    },
    "prompt": "다음과 같은 특징을 가진 동물로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 몸이 깃털로 덮여 있습니다.\n• 한 쌍의 날개와 다리가 있습니다.\n• 짧은 부리가 있고 얼굴에 검은 무늬가 있습니다."
    },
    "choices": [
      "개",
      "참새",
      "금붕어",
      "무당벌레",
      "배추흰나비"
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
    "explanation": "참새는 몸이 깃털로 덮여 있고 한 쌍의 날개와 다리가 있습니다.",
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
    "id": "s31-u02-o3-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 3,
      "page": 1,
      "sourceId": "sci-31-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "동물 분류 기준의 조건",
      "concept": "분류 기준은 누가 분류하더라도 같은 결과가 나오도록 정해야 한다."
    },
    "prompt": "다음 <보기>에서 동물을 특징에 따라 분류할 때에 대한 설명으로 알맞지 않은 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 동물은 특징에 따라 여러 가지 분류 기준을 정해 분류할 수 있다.",
        "㉡ 여러 가지 동물을 특징에 따라 분류하면 동물을 이해하는 데 도움이 된다.",
        "㉢ 동물을 특징에 따라 분류할 때 분류 기준은 분류하는 사람에 따라 다른 결과가 나오는 것으로 정한다."
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
        "c"
      ]
    },
    "explanation": "동물은 특징에 따라 여러 가지 분류 기준을 정해 분류할 수 있는데, 누가 분류하더라도 같은 결과가 나오는 분류 기준을 정해야 합니다. 여러 가지 동물을 특징에 따라 분류하면 동물을 이해하는 데 도움이 됩니다.",
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
    "id": "s31-u02-o3-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 4,
      "page": 1,
      "sourceId": "sci-31-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "금붕어와 상어의 공통점",
      "concept": "금붕어와 상어는 물에 살며 지느러미로 헤엄치는 동물이다."
    },
    "prompt": "금붕어와 상어의 공통점으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "날개가 있다.",
      "다리가 있다.",
      "새끼를 낳는다.",
      "지느러미가 있다.",
      "땅과 물을 오가며 생활한다."
    ],
    "figure": "assets/bank/s31-u02/s3-q04.webp",
    "figureNote": "금붕어 사진(▲ 금붕어)과 상어 사진(▲ 상어)이 나란히 있음.",
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
    "explanation": "금붕어와 상어는 물에 사는 동물로, 여러 개의 지느러미로 헤엄쳐 다닙니다.",
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
    "id": "s31-u02-o3-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 5,
      "page": 1,
      "sourceId": "sci-31-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "분류 기준 찾기(다리의 유무)",
      "concept": "닭과 문어는 다리가 있고 달팽이와 지렁이는 다리가 없으므로 '다리가 있는가?'로 나눌 수 있다."
    },
    "prompt": "다음과 같이 동물을 분류할 수 있는 분류 기준으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "표": {
        "그렇다.": [
          "닭, 문어"
        ],
        "그렇지 않다.": [
          "달팽이, 지렁이"
        ]
      }
    },
    "choices": [
      "알을 낳는가?",
      "날개가 있는가?",
      "다리가 있는가?",
      "더듬이가 있는가?",
      "몸이 털로 덮여 있는가?"
    ],
    "figure": "assets/bank/s31-u02/s3-q05.webp",
    "figureNote": "분류 결과 표(그렇다.: 닭, 문어 / 그렇지 않다.: 달팽이, 지렁이). 표 내용은 givens에 옮김.",
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
    "explanation": "개미, 꿀벌, 문어는 다리가 있는 동물이고, 달팽이와 지렁이는 다리가 없는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설은 '개미, 꿀벌, 문어는 다리가 있는 동물'이라고 썼으나 문제 표의 '그렇다.' 칸은 '닭, 문어'임(해설이 다른 세트의 표를 따른 듯). 정답 ③은 두 경우 모두 성립."
    }
  },
  {
    "id": "s31-u02-o3-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 6,
      "page": 1,
      "sourceId": "sci-31-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "더듬이 유무로 분류하기",
      "concept": "달팽이는 더듬이가 있으므로 더듬이가 있는 개미·꿀벌과 같은 무리에 들어간다."
    },
    "prompt": "다음은 분류 기준과 그 분류 기준에 따라 여러 가지 동물을 분류한 결과입니다. 달팽이는 ㉠과 ㉡ 중 어디에 해당하는지 골라 기호를 쓰시오.",
    "givens": {
      "표": {
        "분류 기준": [
          "더듬이가 있는가?"
        ],
        "㉠": [
          "토끼, 뱀"
        ],
        "㉡": [
          "개미, 꿀벌"
        ]
      }
    },
    "choices": null,
    "figure": "assets/bank/s31-u02/s3-q06.webp",
    "figureNote": "분류 기준 '더듬이가 있는가?' 아래 ㉠(토끼, 뱀)·㉡(개미, 꿀벌) 두 칸 표. 표 내용은 givens에 옮김.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ",
        "b"
      ]
    },
    "explanation": "개미와 꿀벌은 더듬이가 있는 동물이고, 토끼와 뱀은 더듬이가 없는 동물입니다. 따라서 ㉠은 ‘그렇지 않다.’ ㉡은 ‘그렇다.’입니다. 달팽이는 더듬이가 있는 동물이기 때문에 ‘그렇다.’인 ㉡에 해당합니다.",
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
    "id": "s31-u02-o3-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 7,
      "page": 2,
      "sourceId": "sci-31-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "땅 위와 땅속을 오가며 사는 동물",
      "concept": "뱀과 개미는 땅 위와 땅속을 오가며 생활한다."
    },
    "prompt": "땅 위와 땅속을 오가며 생활하는 동물을 두 가지 고르시오.",
    "givens": null,
    "choices": [
      "개",
      "뱀",
      "개미",
      "너구리",
      "땅강아지"
    ],
    "figure": "assets/bank/s31-u02/s3-q07.webp",
    "figureNote": "선택지 ①~⑤가 각각 사진(▲ 개, ▲ 뱀, ▲ 개미, ▲ 너구리, ▲ 땅강아지)으로 제시됨.",
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
    "explanation": "뱀과 개미는 땅 위와 땅속을 오가며 생활하는 동물입니다. 개와 너구리는 땅 위에서, 땅강아지는 땅속에서 생활하는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "선택지는 사진+캡션(▲ 개 등) 형태로 인쇄됨; 캡션 글자를 선택지 텍스트로 옮김."
    }
  },
  {
    "id": "s31-u02-o3-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 8,
      "page": 2,
      "sourceId": "sci-31-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "땅속에 사는 동물의 특징",
      "concept": "매미 애벌레는 땅속에서 나무뿌리 수액을 먹고 살다가 다 자라면 땅 위로 올라와 나무에서 매미가 된다."
    },
    "prompt": "땅속에 사는 동물의 특징을 잘못 설명한 사람의 이름을 쓰시오.",
    "givens": {
      "지문": "• 단비: 두더지는 삽 같은 앞발로 땅속에 굴을 파서 생활합니다.\n• 다래: 지렁이는 땅속에서 생활하며 흙과 썩은 낙엽 등을 먹습니다.\n• 하늘: 매미 애벌레는 나무에서 생활하다 다 자라면 땅속에 굴을 파고 들어가 매미가 됩니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "하늘",
      "accepted": [
        "하늘"
      ]
    },
    "explanation": "매미 애벌레는 앞다리로 땅속에 굴을 파고 나무뿌리의 수액을 빨아 먹으며 생활합니다. 다 자라면 땅 위로 올라와 나무에서 껍질을 벗고 매미가 됩니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '잘못'에 밑줄이 있음. 지문 속 이름(단비, 다래, 하늘)과 콜론은 굵게 인쇄됨."
    }
  },
  {
    "id": "s31-u02-o3-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 9,
      "page": 2,
      "sourceId": "sci-31-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "땅에 사는 동물의 특징",
      "concept": "땅에 사는 동물 중 날개가 있는 동물은 날아다니기도 한다."
    },
    "prompt": "땅에 사는 동물에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "땅속에서 흙을 파며 생활하는 동물도 있다.",
      "땅에 사는 동물은 날개가 있어도 날지 못한다.",
      "땅에 사는 동물 중에는 다리가 없어 기어다니는 동물도 있다.",
      "땅에 사는 동물 중에는 다리가 있어 걷거나 뛰어다니는 동물도 있다.",
      "땅에 사는 동물은 땅에서 살아가기에 알맞은 특징을 가지고 있다."
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
    "explanation": "땅에 사는 동물 중에는 다리가 있어 땅 위를 걷거나 뛰어다니는 동물도 있고, 다리가 없어 기어다니는 동물도 있으며, 날개가 있는 동물은 날아다니기도 합니다.",
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
    "id": "s31-u02-o3-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 10,
      "page": 2,
      "sourceId": "sci-31-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "메기의 특징",
      "concept": "메기는 몸이 끈끈한 점액으로 덮여 있고 지느러미로 물속을 헤엄친다."
    },
    "prompt": "다음 <보기>에서 메기의 특징에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 날개가 있어 날 수 있다.",
        "㉡ 물 위에서 숨을 쉬며 살아간다.",
        "㉢ 몸은 끈끈한 점액으로 덮여 있다.",
        "㉣ 지느러미로 물속을 헤엄쳐 다닌다."
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
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "메기는 강이나 호수의 바닥에서 생활하는 동물로, 몸은 끈끈한 점액으로 덮여 있고, 지느러미로 물속을 헤엄쳐 다닙니다.",
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
    "id": "s31-u02-o3-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 11,
      "page": 2,
      "sourceId": "sci-31-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "다슬기와 전복의 공통점",
      "concept": "다슬기와 전복은 딱딱한 껍데기가 있고 배발로 물속 바위에 붙어 기어다닌다."
    },
    "prompt": "다슬기와 전복의 공통점을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s31-u02/s3-q11.webp",
    "figureNote": "다슬기 사진(▲ 다슬기)과 전복 사진(▲ 전복).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예) 몸이 딱딱한 껍데기로 덮여 있다. / 배발을 이용해 물속 바위에 붙어서 기어다닌다. 등",
      "rubric": {
        "required": [
          "몸이 딱딱한 껍데기로 덮여 있거나, 배발로 물속 바위에 붙어 기어다닌다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "다슬기와 전복의 공통점을 바르게 썼으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "다슬기와 전복은 몸이 딱딱한 껍데기로 덮여 있고, 배발을 이용해 물속 바위에 붙어서 기어다닙니다. 다슬기는 강이나 호수에 사는 동물이고, 전복은 갯벌이나 바다에 사는 동물입니다.\n[채점 기준] 다슬기와 전복의 공통점을 바르게 썼으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표에 배점 비율이 인쇄되어 있지 않음(ratio '100%'는 단일 기준이라 붙인 값)."
    }
  },
  {
    "id": "s31-u02-o3-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 12,
      "page": 2,
      "sourceId": "sci-31-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "갯벌에 사는 동물",
      "concept": "게와 조개는 주로 갯벌에 산다."
    },
    "prompt": "다음 <보기>에서 주로 갯벌에 사는 동물을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 게",
        "㉡ 조개",
        "㉢ 가오리",
        "㉣ 피라미"
      ]
    },
    "choices": [
      "㉠",
      "㉢",
      "㉣",
      "㉠, ㉡",
      "㉡, ㉣"
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
    "explanation": "게와 조개는 주로 갯벌에 사는 동물입니다. 가오리는 바다에 사는 동물이고, 피라미는 강이나 호수에 사는 동물입니다.",
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
    "id": "s31-u02-o3-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 13,
      "page": 3,
      "sourceId": "sci-31-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "잠자리의 날개",
      "concept": "잠자리는 두 쌍의 날개로 날아다닌다."
    },
    "prompt": "다음 빈칸에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "잠자리는 두 쌍의 □이/가 있어 날 수 있습니다."
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
    "explanation": "잠자리는 두 쌍의 날개로 날아다니는 동물입니다. 잠자리의 날개는 아주 얇아 빨리 날 수 있습니다.",
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
    "id": "s31-u02-o3-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 14,
      "page": 3,
      "sourceId": "sci-31-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "왜가리의 특징",
      "concept": "왜가리는 물가에 살며 한 쌍의 날개로 날아다니고 긴 부리로 물고기·개구리를 잡아먹는다."
    },
    "prompt": "왜가리에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "한 쌍의 다리가 있다.",
      "날개가 없지만 날 수 있다.",
      "물고기나 개구리 등을 잡아먹는다.",
      "강이나 연못 등 물가에서 생활한다.",
      "등은 회색, 배는 흰색 깃털로 덮여 있다."
    ],
    "figure": "assets/bank/s31-u02/s3-q14.webp",
    "figureNote": "물가에 서 있는 왜가리 사진.",
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
    "explanation": "왜가리는 강이나 연못 등 물가에서 생활하는 동물로, 한 쌍의 날개로 날아다니며, 긴 부리로 물고기나 개구리 등을 잡아먹습니다.",
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
    "id": "s31-u02-o3-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 15,
      "page": 3,
      "sourceId": "sci-31-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "사막여우의 특징",
      "concept": "사막여우는 큰 귀로 몸속의 열을 내보내 체온을 조절한다."
    },
    "prompt": "다음과 같은 특징을 가진 동물을 <보기>에서 골라 기호와 이름을 쓰시오.",
    "givens": {
      "지문": "[15~16] 다음 <보기>의 여러 가지 동물을 보고, 물음에 답하시오.\n큰 귀로 몸속의 열을 내보내 체온 조절을 합니다.",
      "보기": [
        "㉠ (사진)",
        "㉡ (사진)",
        "㉢ (사진)",
        "㉣ (사진)"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s31-u02/s3-q15.webp",
    "figureNote": "<보기> 상자 안 사진 4장, 이름 없이 기호만: ㉠ 사막의 낙타, ㉡ 눈 위의 북극곰, ㉢ 사막여우, ㉣ 얼음 위의 바다코끼리(해설: ㉠은 낙타, ㉡은 북극곰, ㉢은 사막여우, ㉣은 바다코끼리).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "기호: ㉢, 이름: 사막여우",
      "accepted": [
        "기호: ㉢, 이름: 사막여우",
        "㉢, 사막여우",
        "ㄷ, 사막여우",
        "㉢ 사막여우",
        "ㄷ 사막여우"
      ]
    },
    "explanation": "㉠은 낙타, ㉡은 북극곰, ㉢은 사막여우, ㉣은 바다코끼리입니다. 큰 귀로 몸속의 열을 내보내 체온 조절을 하는 동물은 사막여우입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란은 '기호: (   ), 이름: (   )' 형식. <보기>는 사진만 있어 givens의 보기 항목은 '(사진)'으로 둠."
    }
  },
  {
    "id": "s31-u02-o3-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 16,
      "page": 3,
      "sourceId": "sci-31-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "사막과 극지방 동물 분류",
      "concept": "낙타와 사막여우는 사막에, 북극곰과 바다코끼리는 극지방에 산다."
    },
    "prompt": "<보기>의 동물을 사는 곳에 따라 알맞게 분류한 것은 어느 것입니까?",
    "givens": {
      "지문": "[15~16] 다음 <보기>의 여러 가지 동물을 보고, 물음에 답하시오.",
      "보기": [
        "㉠ (사진)",
        "㉡ (사진)",
        "㉢ (사진)",
        "㉣ (사진)"
      ]
    },
    "choices": [
      "㉠, ㉡ / ㉢, ㉣",
      "㉠, ㉢ / ㉡, ㉣",
      "㉡, ㉢ / ㉠, ㉣",
      "㉡, ㉣ / ㉠, ㉢",
      "㉢, ㉣ / ㉠, ㉡"
    ],
    "figure": "assets/bank/s31-u02/s3-q15.webp",
    "figureNote": "<보기> 상자 안 사진 4장, 이름 없이 기호만: ㉠ 사막의 낙타, ㉡ 눈 위의 북극곰, ㉢ 사막여우, ㉣ 얼음 위의 바다코끼리(해설: ㉠은 낙타, ㉡은 북극곰, ㉢은 사막여우, ㉣은 바다코끼리).",
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
    "explanation": "낙타와 사막여우는 사막에 사는 동물이고, 북극곰과 바다코끼리는 극지방에 사는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "선택지가 표 형식: 열 머리 '사막' / '극지방'."
    }
  },
  {
    "id": "s31-u02-o3-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 17,
      "page": 3,
      "sourceId": "sci-31-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "초롱아귀가 사는 환경",
      "concept": "초롱아귀가 사는 깊은 바닷속은 햇빛이 거의 닿지 않아 춥고 어두우며 산소가 부족하다."
    },
    "prompt": "초롱아귀가 사는 환경에 대한 설명으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "경사가 급합니다.",
      "편평하고 넓게 트인 땅입니다.",
      "바람이 강하게 불어 매우 춥습니다.",
      "햇빛이 거의 닿지 않아서 어둡습니다.",
      "넓고 오목하게 파인 땅에 물이 고여 있습니다."
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
    "explanation": "초롱아귀는 깊은 바닷속에 사는 동물입니다. 깊은 바닷속은 햇빛이 거의 닿지 않아서 춥고 어두우며, 산소가 부족합니다.",
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
    "id": "s31-u02-o3-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 18,
      "page": 3,
      "sourceId": "sci-31-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "박쥐가 먹이를 찾는 방법",
      "concept": "박쥐는 눈이 잘 보이지 않아 초음파로 먹이를 찾고 지형을 파악한다."
    },
    "prompt": "어두운 동굴에서 박쥐가 먹이를 찾는 방법을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s31-u02/s3-q18.webp",
    "figureNote": "날개를 편 박쥐 사진.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "초음파를 이용해 먹이를 찾는다.",
      "rubric": {
        "required": [
          "초음파를 이용한다",
          "먹이를 찾는다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "초음파를 이용해 먹이를 찾는다는 내용이 포함되어 있으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "박쥐는 동굴에 사는 동물로, 눈이 잘 보이지 않지만 초음파를 이용해 먹이를 찾거나 지형을 파악합니다.\n[채점 기준] 초음파를 이용해 먹이를 찾는다는 내용이 포함되어 있으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표에 배점 비율이 인쇄되어 있지 않음(ratio '100%'는 단일 기준이라 붙인 값)."
    }
  },
  {
    "id": "s31-u02-o3-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 19,
      "page": 4,
      "sourceId": "sci-31-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "홍합의 특징을 이용한 예",
      "concept": "바위에 단단히 붙는 홍합의 특징을 본떠 물속에서도 쓰는 접착제를 만들었다."
    },
    "prompt": "다음과 같은 동물의 특징을 이용한 예로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "홍합은 세찬 파도에도 바위에서 떨어지지 않고 붙어 있습니다."
    },
    "choices": [
      "병따개",
      "굴착기",
      "물갈퀴",
      "붙였다 떼었다 할 수 있는 접착제",
      "물속에서도 사용할 수 있는 접착제"
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
    "explanation": "홍합이 세찬 파도에도 바위에서 떨어지지 않고 붙어 있는 특징을 이용해 물속에서도 사용할 수 있는 접착제를 만들었습니다.",
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
    "id": "s31-u02-o3-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 20,
      "page": 4,
      "sourceId": "sci-31-2-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "동물의 특징을 이용한 물체 짝짓기",
      "concept": "물갈퀴는 오리의 발을, 고속열차는 산천어의 몸 모양을 본뜬 것이므로 문어·지렁이와는 짝이 맞지 않는다."
    },
    "prompt": "다음 <보기>에서 동물과 그 동물의 특징을 이용한 물체를 잘못 짝 지은 것을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 문어 / 물갈퀴",
        "㉡ 산양 / 등산화",
        "㉢ 두더지 / 굴착기",
        "㉣ 지렁이 / 고속열차"
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉣",
      "㉡, ㉢",
      "㉡, ㉣",
      "㉢, ㉣"
    ],
    "figure": "assets/bank/s31-u02/s3-q20.webp",
    "figureNote": "<보기> 상자: 각 기호마다 동물 사진과 물체 사진이 캡션과 함께 짝지어 있음(㉠ ▲ 문어·▲ 물갈퀴, ㉡ ▲ 산양·▲ 등산화, ㉢ ▲ 두더지·▲ 굴착기, ㉣ ▲ 지렁이·▲ 고속열차). 캡션은 givens에 옮김.",
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
    "explanation": "문어의 빨판이 물체에 잘 붙는 특징을 이용해 물체에 잘 붙는 흡착판을 만들었고, 오리의 발에 물갈퀴가 있어 수영을 잘 하는 특징을 이용해 물속에서 수영하는 것을 도와주는 물갈퀴를 만들었습니다. 산천어의 몸이 부드러운 곡선 모양으로 되어 있어 물속에서 빠르게 헤엄칠 수 있는 특징을 이용해 앞부분이 부드러운 곡선 모양인 고속열차를 만들었습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '잘못'에 밑줄이 있음. <보기> 각 항목은 사진 두 장+캡션(▲ 문어, ▲ 물갈퀴 등)이며 '동물 / 물체'로 옮김."
    }
  },
  {
    "id": "s31-u02-o4-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 1,
      "page": 1,
      "sourceId": "sci-31-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "공벌레의 특징",
      "concept": "공벌레는 더듬이와 일곱 쌍의 다리가 있고, 건드리면 몸을 공처럼 둥글게 만든다."
    },
    "prompt": "공벌레를 관찰한 결과로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "다리가 없다.",
      "커다란 눈이 있다.",
      "얇고 투명한 날개가 있다.",
      "지느러미를 이용하여 헤엄친다.",
      "건드리면 몸을 공처럼 둥글게 만든다."
    ],
    "figure": "assets/bank/s31-u02/s4-q01.webp",
    "figureNote": "공벌레 사진(나무 위의 회색 마디 몸 공벌레)",
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
    "explanation": "공벌레는 머리에 더듬이가 있고 일곱 쌍의 다리가 있습니다. 건드리면 몸을 공처럼 둥글게 만듭니다.",
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
    "id": "s31-u02-o4-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 2,
      "page": 1,
      "sourceId": "sci-31-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "설명을 보고 동물 찾기(달팽이)",
      "concept": "달팽이는 다리가 없이 미끄러지듯 움직이고 등에 딱딱한 껍데기가 있다."
    },
    "prompt": "다음은 우리 주변에서 볼 수 있는 동물에 대한 설명입니다. 이 동물은 무엇입니까?",
    "givens": {
      "지문": "• 다리가 없습니다.\n• 미끄러지듯이 움직입니다.\n• 등에 딱딱한 껍데기가 있습니다."
    },
    "choices": [
      "개",
      "참새",
      "고양이",
      "달팽이",
      "잠자리"
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
    "explanation": "다리가 없고 미끄러지듯이 움직이며 등에 딱딱한 껍데기가 있는 동물은 달팽이입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "선택지는 2단 배치(①②/③④/⑤)로 인쇄됨."
    }
  },
  {
    "id": "s31-u02-o4-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 3,
      "page": 1,
      "sourceId": "sci-31-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "분류 기준의 조건",
      "concept": "분류 기준은 누가 분류해도 같은 결과가 나와야 하므로 ‘몸집이 큰가?’처럼 사람마다 판단이 다른 기준은 알맞지 않다."
    },
    "prompt": "단비는 다음의 분류 기준으로 동물을 분류하려고 합니다. 분류 기준으로 알맞은지 알맞지 않은지 쓰고, 그렇게 생각한 까닭을 쓰시오.",
    "givens": {
      "지문": "분류 기준: 몸집이 큰가?"
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "알맞은 분류 기준이 아니다. 분류하는 사람에 따라 분류 결과가 달라질 수 있기 때문이다.",
      "rubric": {
        "required": [
          "알맞은 분류 기준이 아니다",
          "분류하는 사람에 따라 분류 결과가 달라질 수 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "알맞은 분류 기준이 아니며, 분류하는 사람에 따라 분류 결과가 달라질 수 있기 때문이라는 내용이 포함되어 있으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "동물을 분류할 때 분류 기준은 누가 분류하더라도 같은 결과가 나오는 것으로 정해야 합니다. ‘몸집이 큰가?’와 같은 상대적인 기준은 분류하는 사람에 따라 분류 결과가 달라질 수 있기 때문에 분류 기준으로 알맞지 않습니다.\n[채점 기준] 알맞은 분류 기준이 아니며, 분류하는 사람에 따라 분류 결과가 달라질 수 있기 때문이라는 내용이 포함되어 있으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표에 배점 비율이 인쇄되어 있지 않음(단일 기준) — ratio는 100%로 둠."
    }
  },
  {
    "id": "s31-u02-o4-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 4,
      "page": 1,
      "sourceId": "sci-31-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E1",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "분류 결과에 맞는 분류 기준",
      "concept": "개·고양이·토끼는 새끼를 낳고 닭·뱀·꿀벌은 알을 낳으므로 ‘새끼를 낳는가?’로 나눌 수 있다."
    },
    "prompt": "다음은 어떤 분류 기준으로 동물을 분류한 결과입니다. 분류 기준으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "표": {
        "그렇다.": [
          "개, 고양이, 토끼"
        ],
        "그렇지 않다.": [
          "닭, 뱀, 꿀벌"
        ]
      }
    },
    "choices": [
      "날개가 있는가?",
      "다리가 있는가?",
      "더듬이가 있는가?",
      "지느러미가 있는가?",
      "새끼를 낳는 동물인가?"
    ],
    "figure": "assets/bank/s31-u02/s4-q04.webp",
    "figureNote": "분류 결과 표(그렇다./그렇지 않다. 두 칸) — 내용은 givens.표에 옮김",
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
    "explanation": "개, 고양이, 토끼는 새끼를 낳는 동물이고, 닭, 뱀, 꿀벌은 알을 낳는 동물입니다.",
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
    "id": "s31-u02-o4-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 5,
      "page": 1,
      "sourceId": "sci-31-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "땅 위와 땅속을 오가며 사는 동물",
      "concept": "개미는 큰턱으로 땅을 파 땅속에 집을 짓고 땅 위와 땅속을 오가며 살고, 너구리와 딱따구리는 땅 위에서 산다."
    },
    "prompt": "다음 <보기>에서 땅 위와 땅속을 오가며 생활하는 동물을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 개미",
        "㉡ 너구리",
        "㉢ 딱따구리"
      ]
    },
    "choices": [
      "㉠",
      "㉡",
      "㉢",
      "㉠, ㉡",
      "㉡, ㉢"
    ],
    "figure": "assets/bank/s31-u02/s4-q05.webp",
    "figureNote": "<보기> 상자: ㉠ 개미, ㉡ 너구리, ㉢ 딱따구리 사진과 이름표(▲ 개미 등)",
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
    "explanation": "개미는 땅 위와 땅속을 오가며 생활하는 동물로, 큰턱으로 땅을 파서 땅속에 집을 짓습니다. 딱따구리와 너구리는 땅 위에서 사는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "선택지는 3단 배치(①②③/④⑤)로 인쇄됨. <보기> 항목은 사진+이름표."
    }
  },
  {
    "id": "s31-u02-o4-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 6,
      "page": 2,
      "sourceId": "sci-31-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "뱀과 지렁이의 공통점",
      "concept": "뱀과 지렁이는 모두 다리가 없어 기어다닌다."
    },
    "prompt": "뱀과 지렁이의 공통점으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "기어다닌다.",
      "비늘로 덮여 있다.",
      "큰턱으로 땅을 판다.",
      "고리 모양의 마디가 많다.",
      "흙과 썩은 낙엽을 먹는다."
    ],
    "figure": "assets/bank/s31-u02/s4-q06.webp",
    "figureNote": "뱀 사진과 지렁이 사진(▲ 뱀, ▲ 지렁이)",
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
    "explanation": "뱀과 지렁이는 다리가 없고 기어다닙니다. 뱀은 몸이 비늘로 덮여 있고, 땅 위와 땅속을 오가며 생활합니다. 지렁이는 고리 모양의 마디가 많고 흙과 썩은 낙엽 등을 먹습니다.",
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
    "id": "s31-u02-o4-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 7,
      "page": 2,
      "sourceId": "sci-31-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "두더지의 특징",
      "concept": "두더지는 털로 덮인 몸과 삽 같은 앞발로 땅속에 굴을 파고 살며 땅속에서 먹이를 잡는다."
    },
    "prompt": "두더지의 특징으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "삽 같은 앞발이 있다.",
      "몸 윗면이 털로 덮여 있다.",
      "땅속에 굴을 파서 생활한다.",
      "땅속에서 먹이를 잡아먹는다.",
      "가늘고 긴 주둥이로 나무에 구멍을 내어 먹이를 잡아먹는다."
    ],
    "figure": "assets/bank/s31-u02/s4-q07.webp",
    "figureNote": "흙 속에서 나온 두더지 사진",
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
    "explanation": "두더지는 몸 윗면이 털로 덮여 있고 주둥이가 가늘고 깁니다. 삽 같은 앞발로 땅속에 굴을 파서 생활하고, 땅속에서 먹이를 잡아먹습니다. 가늘고 긴 주둥이로 나무에 구멍을 내어 먹이를 잡아먹는 특징을 가진 동물은 딱따구리입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 ‘않은’에 밑줄."
    }
  },
  {
    "id": "s31-u02-o4-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 8,
      "page": 2,
      "sourceId": "sci-31-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "강이나 호수에 사는 동물",
      "concept": "수달과 메기는 강이나 호수에 산다."
    },
    "prompt": "다음 동물들이 주로 사는 곳은 어디입니까?",
    "givens": {
      "지문": "▲ 수달  ▲ 메기"
    },
    "choices": [
      "들",
      "숲",
      "갯벌",
      "바닷속",
      "강이나 호수"
    ],
    "figure": "assets/bank/s31-u02/s4-q08.webp",
    "figureNote": "수달 사진과 메기 사진(▲ 수달, ▲ 메기)",
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
    "explanation": "수달과 메기는 강이나 호수에서 사는 동물입니다. 수달은 땅과 물을 오가며 생활하고, 메기는 강이나 호수의 바닥에서 생활합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "선택지는 2단 배치(①②/③④/⑤)로 인쇄됨. 사진 이름표를 givens.지문에 옮김."
    }
  },
  {
    "id": "s31-u02-o4-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 9,
      "page": 2,
      "sourceId": "sci-31-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "개구리가 물에서 살기에 알맞은 특징",
      "concept": "개구리는 뒷다리에 물갈퀴가 있어 물속에서 헤엄칠 수 있다."
    },
    "prompt": "개구리가 물에서 살기에 알맞은 특징은 어느 것입니까?",
    "givens": null,
    "choices": [
      "몸이 비늘로 덮여 있다.",
      "뒷다리에 물갈퀴가 있다.",
      "한 쌍의 집게 다리와 네 쌍의 다리가 있다.",
      "몸이 뿔 모양의 딱딱한 껍데기로 덮여 있다.",
      "몸의 앞부분이 둥글고 뒤로 갈수록 납작해지며 가늘어진다."
    ],
    "figure": "assets/bank/s31-u02/s4-q09.webp",
    "figureNote": "나뭇가지 위의 청개구리 사진",
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
    "explanation": "개구리는 뒷다리에 물갈퀴가 있어 물속에서 헤엄쳐 다닐 수 있습니다.",
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
    "id": "s31-u02-o4-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 10,
      "page": 2,
      "sourceId": "sci-31-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "갯벌이나 바다에 사는 동물",
      "concept": "게는 갯벌에, 전복과 고등어는 바다에 살고, 다슬기는 강이나 호수에 산다."
    },
    "prompt": "다음 <보기>에서 갯벌이나 바다에서 사는 동물을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 게",
        "㉡ 전복",
        "㉢ 다슬기",
        "㉣ 고등어"
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉢, ㉣",
      "㉠, ㉡, ㉢",
      "㉠, ㉡, ㉣",
      "㉠, ㉡, ㉢, ㉣"
    ],
    "figure": "assets/bank/s31-u02/s4-q10.webp",
    "figureNote": "<보기> 상자: ㉠ 게, ㉡ 전복, ㉢ 다슬기, ㉣ 고등어 사진과 이름표",
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
    "explanation": "게는 갯벌에서 사는 동물이고, 전복과 고등어는 바다에서 사는 동물입니다. 다슬기는 강이나 호수에서 사는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "선택지는 2단 배치로 인쇄됨. <보기> 항목은 사진+이름표."
    }
  },
  {
    "id": "s31-u02-o4-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 11,
      "page": 2,
      "sourceId": "sci-31-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "날개의 개수 비교",
      "concept": "새는 날개가 한 쌍이고 매미 같은 곤충은 날개가 두 쌍이다."
    },
    "prompt": "날개의 개수가 나머지 넷과 다른 동물은 무엇입니까?",
    "givens": null,
    "choices": [
      "까치",
      "매미",
      "갈매기",
      "왜가리",
      "직박구리"
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
    "explanation": "까치, 갈매기, 왜가리, 직박구리와 같은 새는 한 쌍의 날개가 있고, 매미와 같은 곤충은 두 쌍의 날개가 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "선택지는 2단 배치(①②/③④/⑤)로 인쇄됨."
    }
  },
  {
    "id": "s31-u02-o4-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 12,
      "page": 3,
      "sourceId": "sci-31-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "날 수 있는 동물의 공통점",
      "concept": "날 수 있는 동물은 대부분 날개가 있고 몸이 크기에 비해 가볍다."
    },
    "prompt": "날 수 있는 동물들의 대부분이 가지고 있는 공통적인 특징을 두 가지 고르시오.",
    "givens": null,
    "choices": [
      "날개가 있다.",
      "더듬이가 있다.",
      "몸이 깃털로 덮여 있다.",
      "몸이 크기에 비해 가볍다.",
      "꽃에서 꿀을 빨아 먹는다."
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
    "explanation": "새나 곤충 등 날 수 있는 동물은 대부분 날개가 있고, 몸이 크기에 비해 가볍습니다.",
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
    "id": "s31-u02-o4-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 13,
      "page": 3,
      "sourceId": "sci-31-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "낙타의 혹에 저장된 것",
      "concept": "낙타는 등의 혹에 지방을 저장해 물과 먹이가 없어도 며칠 동안 살 수 있다."
    },
    "prompt": "다음 빈칸에 들어갈 알맞은 말은 어느 것입니까?",
    "givens": {
      "지문": "[13~14] 다음은 낙타의 모습입니다. 물음에 답하시오.\n낙타는 등의 혹에 □을/를 저장해 물과 먹이가 없어도 며칠 동안 살 수 있습니다."
    },
    "choices": [
      "우유",
      "공기",
      "모래",
      "지방",
      "얼음"
    ],
    "figure": "assets/bank/s31-u02/s4-q13.webp",
    "figureNote": "[13~14] 공통 그림: 울타리 앞에 선 혹이 두 개인 낙타 어미와 새끼 사진",
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
    "explanation": "낙타 등의 혹에는 지방이 저장되어 있습니다. 혹에 저장되어 있는 지방으로 인해 물과 먹이를 구하기 힘든 사막에서 며칠 동안 물과 먹이가 없어도 살 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 인쇄본에서 빈 네모 상자로 그려져 있어 □로 옮김. 선택지는 3단 배치(①②③/④⑤)."
    }
  },
  {
    "id": "s31-u02-o4-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 14,
      "page": 3,
      "sourceId": "sci-31-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "낙타 발바닥의 특징",
      "concept": "낙타는 발바닥이 넓어 모래에 발이 잘 빠지지 않으므로 사막을 쉽게 걸어 다닐 수 있다."
    },
    "prompt": "낙타가 사막에서 살기에 알맞은 특징을 발바닥과 관련하여 쓰시오.",
    "givens": {
      "지문": "[13~14] 다음은 낙타의 모습입니다. 물음에 답하시오."
    },
    "choices": null,
    "figure": "assets/bank/s31-u02/s4-q13.webp",
    "figureNote": "[13~14] 공통 그림: 울타리 앞에 선 혹이 두 개인 낙타 어미와 새끼 사진",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "낙타는 발바닥이 넓어 모래에 발이 잘 빠지지 않는다. 이로 인해 사막의 모래 위를 잘 걸어 다닐 수 있다.",
      "rubric": {
        "required": [
          "발바닥이 넓다",
          "모래에 발이 잘 빠지지 않는다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "낙타의 발바닥이 넓고, 이로 인해 발이 모래에 잘 빠지지 않는다는 내용이 포함되어 있으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "사막에서는 모래에 발이 빠지기 때문에 빠르게 이동하기 어렵습니다. 하지만 낙타는 넓은 발바닥을 가지고 있어 모래에 발이 잘 빠지지 않아 사막을 빠르고 쉽게 이동할 수 있습니다.\n[채점 기준] 낙타의 발바닥이 넓고, 이로 인해 발이 모래에 잘 빠지지 않는다는 내용이 포함되어 있으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표에 배점 비율이 인쇄되어 있지 않음(단일 기준) — ratio는 100%로 둠."
    }
  },
  {
    "id": "s31-u02-o4-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 15,
      "page": 3,
      "sourceId": "sci-31-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "극지방에 사는 동물",
      "concept": "눈과 얼음으로 덮이고 매우 추운 극지방에는 펭귄과 바다코끼리가 산다."
    },
    "prompt": "다음과 같은 특징이 있는 환경에 주로 사는 동물을 <보기>에서 모두 고른 것은 어느 것입니까?",
    "givens": {
      "지문": "• 눈과 얼음으로 덮여 있습니다.\n• 바람이 강하게 불며 매우 춥습니다.",
      "보기": [
        "㉠ 펭귄",
        "㉡ 사막여우",
        "㉢ 사막 거북",
        "㉣ 바다코끼리"
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉠, ㉣",
      "㉡, ㉢",
      "㉢, ㉣"
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
    "explanation": "눈과 얼음으로 덮여 있고, 바람이 강하게 불며 매우 추운 환경은 극지방의 환경입니다. 펭귄과 바다코끼리는 극지방에서 사는 동물이고, 사막여우와 사막 거북은 사막에서 사는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 ‘<보기>’가 줄 끝에서 ‘<’와 ‘보기>’로 나뉘어 인쇄됨. 선택지는 3단 배치."
    }
  },
  {
    "id": "s31-u02-o4-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 16,
      "page": 3,
      "sourceId": "sci-31-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "동물과 사는 환경 짝 짓기",
      "concept": "초롱아귀는 높은 산이 아니라 깊은 바닷속에 산다."
    },
    "prompt": "동물과 그 동물이 주로 사는 환경을 잘못 짝 지은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "박쥐 - 동굴",
      "눈표범 - 높은 산",
      "동굴옆새우 - 동굴",
      "초롱아귀 - 높은 산",
      "얼룩무늬물범 - 극지방"
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
    "explanation": "초롱아귀는 깊은 바닷속에서 사는 동물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 ‘잘못’에 밑줄."
    }
  },
  {
    "id": "s31-u02-o4-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 17,
      "page": 3,
      "sourceId": "sci-31-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "산양이 높은 산에서 살기에 알맞은 특징",
      "concept": "산양은 털로 덮인 몸으로 추위를 견디고 말랑한 발굽 바닥으로 가파른 바위에서 미끄러지지 않는다."
    },
    "prompt": "다음 <보기>에서 산양이 높은 산에서 살기에 알맞은 특징을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 눈이 없다.",
        "㉡ 몸이 털로 덮여 있다.",
        "㉢ 발굽 바닥이 말랑하다.",
        "㉣ 갈고리 모양의 발톱이 있다."
      ]
    },
    "choices": [
      "㉡",
      "㉠, ㉢",
      "㉡, ㉢",
      "㉠, ㉡, ㉢",
      "㉡, ㉢, ㉣"
    ],
    "figure": "assets/bank/s31-u02/s4-q17.webp",
    "figureNote": "바위 비탈에 선 산양 사진",
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
    "explanation": "높은 산은 춥고 나무가 자라기 힘들며 경사가 급합니다. 산양은 몸이 털로 덮여 있어 추위를 견딜 수 있고, 발굽 바닥이 말랑해서 바위 위에서 미끄러지지 않아 높은 산에서 살 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "선택지는 2단 배치(①②/③④/⑤)로 인쇄됨."
    }
  },
  {
    "id": "s31-u02-o4-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 18,
      "page": 4,
      "sourceId": "sci-31-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "문어의 특징을 이용한 생활용품",
      "concept": "문어 빨판이 물체에 잘 붙는 특징을 본떠 흡착판을 만들었다."
    },
    "prompt": "문어의 특징을 이용해 만든 생활용품은 어느 것입니까?",
    "givens": null,
    "choices": [
      "굴착기",
      "흡착판",
      "고속열차",
      "등산화 밑창",
      "물속에서 사용할 수 있는 접착제"
    ],
    "figure": "assets/bank/s31-u02/s4-q18.webp",
    "figureNote": "빨판이 보이는 문어 사진",
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
    "id": "s31-u02-o4-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 19,
      "page": 4,
      "sourceId": "sci-31-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "고속열차에 이용한 동물의 특징",
      "concept": "산천어의 부드러운 곡선 몸 모양을 본떠 앞부분이 곡선인 고속열차를 만들었다."
    },
    "prompt": "다음과 같은 고속열차를 만들 때 이용한 동물의 특징은 어느 것입니까?",
    "givens": null,
    "choices": [
      "오리의 발",
      "상어의 피부",
      "산양의 발바닥",
      "두더지의 앞발",
      "산천어의 몸 모양"
    ],
    "figure": "assets/bank/s31-u02/s4-q19.webp",
    "figureNote": "앞부분이 부드러운 곡선 모양인 고속열차 사진",
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
    "explanation": "산천어는 몸이 부드러운 곡선 모양으로 되어 있어 물속에서 빠르게 헤엄칠 수 있습니다. 이러한 특징을 이용해 앞부분이 부드러운 곡선 모양인 고속열차를 만들었습니다.",
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
    "id": "s31-u02-o4-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 20,
      "page": 4,
      "sourceId": "sci-31-2-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅱ. 동물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u02",
      "area": "생명",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "수리의 발을 이용한 집게 차",
      "concept": "수리의 발이 먹이를 잘 잡고 놓치지 않는 특징을 본뜬 집게 차는 물건을 잘 잡고 놓치지 않는다."
    },
    "prompt": "수리의 발이 가진 특징을 이용해 집게 차를 만들었을 때의 좋은 점으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "물속에서 수영을 도와준다.",
      "좁은 공간을 통과할 수 있다.",
      "물건을 잘 잡고 놓치지 않는다.",
      "절벽에서 잘 미끄러지지 않는다.",
      "세찬 파도에도 바위에서 떨어지지 않는다."
    ],
    "figure": "assets/bank/s31-u02/s4-q20.webp",
    "figureNote": "수리 사진 → (아래 화살표) → 고철 더미를 집는 집게 차 사진",
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
    "explanation": "수리의 발은 먹이를 잘 잡고 놓치지 않는 특징을 가지고 있습니다. 이런 특징을 이용해 집게 차를 만들면 물건을 잘 잡고 놓치지 않을 수 있습니다.",
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
