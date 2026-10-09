// 3-1 Ⅲ 식물의 생활 — 단원평가 원문 80문항(시매쓰DMC 최다빈출 단원평가 세트1·2·3·4). 시험지를 그대로 옮기고 정답 및 풀이와 대조했다.
// 원장 지시(2026-10-09): 원문을 그대로 문제은행에 쓴다. 그림은 시험지에서 잘라 낸 것(assets/bank/s31-u03/).
export const source = [
  {
    "id": "s31-u03-o1-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 1,
      "page": 1,
      "sourceId": "sci-31-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "특징으로 식물 찾기(강아지풀)",
      "concept": "강아지풀은 줄기가 가늘고 곧으며 긴 털이 달린 꽃이 강아지 꼬리처럼 생긴 풀이다."
    },
    "prompt": "다음과 같은 특징을 가진 식물로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 줄기가 가늘고 곧게 자랍니다.\n• 꽃에 긴 털이 달려 있어 강아지 꼬리와 모양이 비슷합니다."
    },
    "choices": [
      "토끼풀",
      "회양목",
      "강아지풀",
      "단풍나무",
      "은행나무"
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
    "explanation": "줄기가 가늘고 곧게 자라며, 꽃에 긴 털이 달려 있어 강아지 꼬리와 모양이 비슷한 식물은 강아지풀입니다.",
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
    "id": "s31-u03-o1-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 2,
      "page": 1,
      "sourceId": "sci-31-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "맥문동의 특징",
      "concept": "맥문동은 그늘에서도 잘 자라며 보라색 꽃을 피우는 식물이다."
    },
    "prompt": "다음 빈칸에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "맥문동은 그늘진 곳에서도 잘 자라고, 보라색 [  ]이/가 핍니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "꽃",
      "accepted": [
        "꽃"
      ]
    },
    "explanation": "맥문동은 그늘진 곳에서도 잘 자라고, 보라색 꽃이 핍니다. 뿌리는 약재로 사용하기도 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 인쇄본에서 네모 상자로 표시됨 → [  ]로 옮김."
    }
  },
  {
    "id": "s31-u03-o1-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 3,
      "page": 1,
      "sourceId": "sci-31-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "잎의 분류 기준",
      "concept": "분류 기준은 누가 분류해도 같은 결과가 나오도록 객관적이어야 하므로 '크다'처럼 사람마다 다른 기준은 쓸 수 없다."
    },
    "prompt": "식물의 잎을 분류하는 기준으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "잎의 크기가 큰가?",
      "잎의 끝이 뾰족한가?",
      "잎이 좁고 길쭉한 모양인가?",
      "잎의 전체적인 모양이 길쭉한가?",
      "잎의 가장자리가 톱니 모양인가?"
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
    "explanation": "식물의 잎을 특징에 따라 분류할 때 누가 분류하더라도 같은 결과가 나오는 분류 기준을 정해야 합니다. '잎의 크기가 큰가?'는 분류하는 사람에 따라 분류 결과가 달라지기 때문에 분류 기준으로 알맞지 않습니다.",
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
    "id": "s31-u03-o1-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 4,
      "page": 1,
      "sourceId": "sci-31-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "잎 끝 모양으로 분류",
      "concept": "강아지풀·소나무·단풍나무 잎은 끝이 뾰족하고 토끼풀 잎은 끝이 둥글다."
    },
    "prompt": "<보기>에서 잎의 끝이 뾰족한 것을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "지문": "[04~05] 다음 여러 가지 식물의 잎을 보고, 물음에 답하시오."
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉣",
      "㉠, ㉢, ㉣",
      "㉡, ㉢, ㉣"
    ],
    "figure": "assets/bank/s31-u03/s1-q04.webp",
    "figureNote": "<보기> 상자 안의 잎 사진 4장: ㉠ 길쭉하고 끝이 뾰족한 잎(강아지풀), ㉡ 작은 잎 세 장이 붙은 잎(토끼풀), ㉢ 가늘고 긴 바늘 모양 잎(소나무), ㉣ 가장자리가 톱니 모양이고 끝이 뾰족하게 갈라진 잎(단풍나무). 사진에 식물 이름은 적혀 있지 않음.",
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
    "explanation": "㉠은 강아지풀, ㉡은 토끼풀, ㉢은 소나무, ㉣은 단풍나무의 잎입니다. 잎의 끝이 뾰족한 것은 강아지풀(㉠), 소나무(㉢), 단풍나무(㉣)입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 사진만으로 이루어져 있어 givens에는 공통 발문만 넣음."
    }
  },
  {
    "id": "s31-u03-o1-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 5,
      "page": 1,
      "sourceId": "sci-31-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "분류 결과에서 기준 찾기",
      "concept": "토끼풀·단풍나무 잎은 가장자리가 톱니 모양이고 강아지풀·소나무 잎은 가장자리가 매끈하다."
    },
    "prompt": "<보기>의 잎을 다음과 같이 분류할 수 있는 분류 기준으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[04~05] 다음 여러 가지 식물의 잎을 보고, 물음에 답하시오.",
      "표": {
        "그렇다.": [
          "㉡, ㉣"
        ],
        "그렇지 않다.": [
          "㉠, ㉢"
        ]
      }
    },
    "choices": [
      "잎이 예쁜가?",
      "잎자루가 있는가?",
      "잎 여러 개가 붙어 있는가?",
      "잎의 가장자리가 톱니 모양인가?",
      "잎의 전체적인 모양이 길쭉한가?"
    ],
    "figure": "assets/bank/s31-u03/s1-q04.webp",
    "figureNote": "<보기> 상자 안의 잎 사진 4장: ㉠ 길쭉하고 끝이 뾰족한 잎(강아지풀), ㉡ 작은 잎 세 장이 붙은 잎(토끼풀), ㉢ 가늘고 긴 바늘 모양 잎(소나무), ㉣ 가장자리가 톱니 모양이고 끝이 뾰족하게 갈라진 잎(단풍나무). 사진에 식물 이름은 적혀 있지 않음. (분류표 '그렇다./그렇지 않다.'는 인쇄된 표로 givens에 옮김.)",
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
    "explanation": "토끼풀과 단풍나무는 잎의 가장자리가 톱니 모양이고, 강아지풀과 소나무는 잎의 가장자리가 매끈합니다.",
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
    "id": "s31-u03-o1-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 6,
      "page": 1,
      "sourceId": "sci-31-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "들이나 산에 사는 풀",
      "concept": "들이나 산에 사는 식물은 명아주·민들레·토끼풀 같은 풀과 밤나무·단풍나무 같은 나무로 나눌 수 있다."
    },
    "prompt": "들이나 산에 사는 풀끼리 짝 지은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "명아주, 밤나무, 민들레",
      "명아주, 민들레, 토끼풀",
      "민들레, 강아지풀, 사과나무",
      "밤나무, 사과나무, 단풍나무",
      "강아지풀, 단풍나무, 떡갈나무"
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
    "explanation": "명아주, 민들레, 토끼풀, 강아지풀은 들이나 산에 사는 풀입니다. 밤나무, 사과나무, 단풍나무, 떡갈나무는 들이나 산에 사는 나무입니다.",
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
    "id": "s31-u03-o1-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 7,
      "page": 2,
      "sourceId": "sci-31-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "소나무의 특징",
      "concept": "소나무는 풀보다 키가 크고 줄기가 굵으며 겨울에도 잎이 초록색이고 스스로 양분을 만든다."
    },
    "prompt": "다음 <보기>에서 소나무에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 토끼풀보다 키가 크다.",
        "㉡ 명아주보다 줄기가 가늘다.",
        "㉢ 겨울에도 잎이 초록색이다.",
        "㉣ 필요한 양분을 스스로 만들지 못한다."
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
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "소나무는 들이나 산에 사는 나무로, 토끼풀과 명아주와 같은 풀보다 키가 크고 줄기가 굵습니다. 또한 겨울에도 잎이 초록색이고, 필요한 양분을 스스로 만듭니다.",
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
    "id": "s31-u03-o1-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 8,
      "page": 2,
      "sourceId": "sci-31-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "들이나 산에 사는 식물의 공통점",
      "concept": "들이나 산에 사는 식물은 뿌리·줄기·잎이 구분되고 땅에 뿌리를 내리며 줄기에 잎·꽃·열매가 달린다."
    },
    "prompt": "다음 식물들의 공통점으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "잎이 대부분 노란색이다.",
      "들이나 산에서 볼 수 없다.",
      "땅에 뿌리를 내리지 않는다.",
      "줄기에 잎, 꽃, 열매가 달린다.",
      "뿌리, 줄기, 잎을 구분할 수 없다."
    ],
    "figure": "assets/bank/s31-u03/s1-q08.webp",
    "figureNote": "사진 2장: 노란 꽃이 핀 애기똥풀, 흰 꽃이 가득 핀 조팝나무. 캡션 '▲ 애기똥풀', '▲ 조팝나무'.",
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
    "explanation": "애기똥풀과 조팝나무는 들이나 산에 사는 식물로, 뿌리, 줄기, 잎을 구분할 수 있고, 대부분 땅에 뿌리를 내리며, 잎이 대부분 초록색입니다. 또한 줄기에 잎, 꽃, 열매가 달립니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "식물 이름은 사진 캡션('▲ 애기똥풀', '▲ 조팝나무')으로만 인쇄됨."
    }
  },
  {
    "id": "s31-u03-o1-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 9,
      "page": 2,
      "sourceId": "sci-31-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "부레옥잠 잎자루의 공기주머니",
      "concept": "부레옥잠 잎자루 속에는 공기주머니가 있어 누르면 공기 방울이 나오며, 이 덕분에 물에 떠서 산다."
    },
    "prompt": "다음은 자른 부레옥잠 잎자루를 물에 넣고 손가락으로 누를 때 나타나는 현상입니다. 이를 통해 알 수 있는 것을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s31-u03/s1-q09.webp",
    "figureNote": "물이 담긴 수조 속에서 손가락으로 부레옥잠 잎자루를 누르자 공기 방울이 나와 위로 올라가는 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "부레옥잠은 잎자루에 있는 공기주머니 때문에 물에 떠서 살 수 있다. / 부레옥잠은 잎자루에 공기주머니가 있다.",
      "rubric": {
        "required": [
          "부레옥잠 속에 공기주머니(공기)가 있다",
          "그 공기주머니가 잎자루에 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "부레옥잠 잎자루에 공기주머니가 있다는 내용이 포함되어 있으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "부레옥잠은 잎자루에 공기주머니가 빽빽하게 배열되어 있기 때문에 자른 부레옥잠의 잎자루를 물에 넣고 손가락으로 누르면 공기방울이 나와 물위로 올라가는 것을 관찰할 수 있습니다.\n[채점 기준] 부레옥잠 잎자루에 공기주머니가 있다는 내용이 포함되어 있으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표에 비율이 인쇄되어 있지 않음 — 단일 기준이라 100%로 기록. 해설의 '물위로'는 붙여 쓴 그대로 옮김."
    }
  },
  {
    "id": "s31-u03-o1-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 10,
      "page": 2,
      "sourceId": "sci-31-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "잎이 물 위로 높이 자라는 식물",
      "concept": "부들은 뿌리를 물속 땅에 내리고 잎과 줄기가 물 위로 높이 자라는 식물이다."
    },
    "prompt": "강이나 연못에 사는 식물 중 잎이 물 위로 높이 자라는 식물은 무엇입니까?",
    "givens": null,
    "choices": [
      "수련",
      "부들",
      "가래",
      "물상추",
      "개구리밥"
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
    "explanation": "부들은 잎이 물 위로 높이 자라는 식물입니다. 수련과 가래는 잎이 물에 떠 있는 식물, 물상추와 개구리밥은 물에 떠서 사는 식물입니다.",
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
    "id": "s31-u03-o1-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 11,
      "page": 2,
      "sourceId": "sci-31-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물속에 잠겨서 사는 식물",
      "concept": "나사말·검정말·물수세미·붕어마름은 물속에 잠겨 살고, 생이가래는 물에 떠서 산다."
    },
    "prompt": "다음과 같은 특징을 가진 식물로 알맞지 않은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 줄기가 가늘고, 잎이 작습니다.\n• 뿌리는 물속의 땅에 있습니다.\n• 줄기와 잎이 물의 흐름에 따라 잘 휘어집니다."
    },
    "choices": [
      "나사말",
      "검정말",
      "물수세미",
      "붕어마름",
      "생이가래"
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
    "explanation": "뿌리가 물속의 땅에 있으며 줄기와 잎이 물의 흐름에 따라 잘 휘어지는 식물은 물속에 잠겨서 사는 식물입니다. 나사말, 검정말, 물수세미, 붕어마름은 물속에 잠겨서 사는 식물이고, 생이가래는 물에 떠서 사는 식물입니다.",
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
    "id": "s31-u03-o1-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 12,
      "page": 2,
      "sourceId": "sci-31-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "알로에의 생김새",
      "concept": "알로에는 잎이 두껍고 길며 가장자리에 가시가 있고, 잎자루가 부푼 것은 부레옥잠의 특징이다."
    },
    "prompt": "알로에의 생김새를 관찰한 결과로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "잎이 두껍고 긴 모양이다.",
      "굵은 뿌리가 여러 가닥 있다.",
      "잎자루가 볼록하게 부풀어 있다.",
      "잎의 표면이 매끈하여 광택이 난다.",
      "잎의 가장자리에 뾰족한 가시가 있다."
    ],
    "figure": "assets/bank/s31-u03/s1-q12.webp",
    "figureNote": "뿌리째 뽑은 알로에 사진. 두껍고 긴 잎(가장자리에 가시)과 여러 가닥의 뿌리, '잎'과 '뿌리' 지시선 표시.",
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
    "explanation": "알로에는 잎이 두껍고 긴 모양이며, 잎의 가장자리에 뾰족한 가시가 있습니다. 잎자루가 볼록하게 부풀어 있는 것은 부레옥잠의 특징입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄. 그림 속 글자 '잎', '뿌리'는 부위 표시용 지시선."
    }
  },
  {
    "id": "s31-u03-o1-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 13,
      "page": 3,
      "sourceId": "sci-31-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T10",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "사막에 사는 식물의 공통 특징",
      "concept": "사막 식물은 두꺼운 잎이나 굵은 줄기에 물을 저장해 건조한 환경을 견딘다."
    },
    "prompt": "사막에 사는 식물이 대부분 가지고 있는 공통적인 특징을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예) 두꺼운 잎이나 굵은 줄기에 물을 저장하여 건조한 환경에서 살 수 있다. 등",
      "rubric": {
        "required": [
          "잎이나 줄기에 물을 저장한다",
          "그래서 건조한 환경에서 살 수 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "건조한 환경에서 살아가기에 알맞은 특징을 썼으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "사막에 사는 식물은 대부분 두꺼운 잎이나 굵은 줄기에 물을 저장하여 건조한 환경에서 살 수 있습니다.\n[채점 기준] 건조한 환경에서 살아가기에 알맞은 특징을 썼으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표에 비율이 인쇄되어 있지 않음 — 단일 기준이라 100%로 기록."
    }
  },
  {
    "id": "s31-u03-o1-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 14,
      "page": 3,
      "sourceId": "sci-31-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "사막 환경에 사는 식물",
      "concept": "비가 거의 오지 않고 일교차가 큰 사막에는 선인장·바오바브나무 같은 식물이 산다."
    },
    "prompt": "다음에서 설명하는 환경에 주로 사는 식물을 두 가지 고르시오.",
    "givens": {
      "지문": "• 비가 거의 내리지 않아 건조합니다.\n• 낮과 밤의 온도 차이가 큽니다."
    },
    "choices": [
      "갈대",
      "민들레",
      "선인장",
      "단풍나무",
      "바오바브나무"
    ],
    "figure": "assets/bank/s31-u03/s1-q14.webp",
    "figureNote": "보기 ①~⑤가 사진+캡션으로 인쇄됨: ① 갈대, ② 민들레(노란 꽃), ③ 선인장, ④ 단풍나무(붉은 단풍), ⑤ 바오바브나무.",
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
    "explanation": "비가 거의 내리지 않아 건조하고 낮과 밤의 온도 차이가 큰 곳은 사막입니다. 선인장과 바오바브나무는 사막에 사는 식물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기는 사진 아래 '▲ 이름' 캡션으로 인쇄되어 있어 '① 갈대' 꼴로 옮김."
    }
  },
  {
    "id": "s31-u03-o1-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 15,
      "page": 3,
      "sourceId": "sci-31-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "사는 곳에 따른 식물 분류(높은 산·바닷가)",
      "concept": "눈잣나무·한라솜다리는 높은 산에, 갯메꽃·통보리사초는 바닷가나 갯벌에 산다."
    },
    "prompt": "다음 <보기>의 식물들을 사는 곳에 따라 알맞게 분류한 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 갯메꽃",
        "㉡ 눈잣나무",
        "㉢ 통보리사초",
        "㉣ 한라솜다리"
      ]
    },
    "choices": [
      "㉠, ㉡ / ㉢, ㉣",
      "㉠, ㉣ / ㉡, ㉢",
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
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "눈잣나무와 한라솜다리는 높은 산에 사는 식물이고, 갯메꽃과 통보리사초는 바닷가나 갯벌에 사는 식물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기가 표 형태: 열 머리 '높은 산' / '바닷가나 갯벌' — 각 행을 '① 높은 산 / 바닷가나 갯벌' 순서로 옮김. <보기>는 2열(㉠ 갯메꽃, ㉡ 눈잣나무 / ㉢ 통보리사초, ㉣ 한라솜다리)로 인쇄됨."
    }
  },
  {
    "id": "s31-u03-o1-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 16,
      "page": 3,
      "sourceId": "sci-31-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "퉁퉁마디의 특징",
      "concept": "갯벌에 사는 퉁퉁마디는 통통한 줄기에 물을 저장한다."
    },
    "prompt": "다음은 퉁퉁마디에 대한 설명입니다. 빈칸에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "• 갯벌에서 자랍니다.\n• 줄기가 통통하여 [  ]을/를 저장할 수 있습니다."
    },
    "choices": null,
    "figure": "assets/bank/s31-u03/s1-q16.webp",
    "figureNote": "바닷가 갯벌에 자란 퉁퉁마디(마디가 있는 통통한 초록 줄기) 그림.",
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
    "explanation": "퉁퉁마디는 갯벌에서 자라는 식물로, 줄기가 통통하여 물을 저장할 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 인쇄본에서 네모 상자로 표시됨 → [  ]로 옮김."
    }
  },
  {
    "id": "s31-u03-o1-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 17,
      "page": 3,
      "sourceId": "sci-31-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "높은 산의 환경(암매)",
      "concept": "암매가 사는 높은 산은 춥고 바람이 강하며 경사가 급하다."
    },
    "prompt": "암매가 주로 사는 환경에 대한 설명으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "경사가 완만합니다.",
      "바람이 강하게 붑니다.",
      "빛이 들어오지 않습니다.",
      "편평하고 넓게 트인 땅입니다.",
      "소금 성분이 많이 포함된 물이 있습니다."
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
    "explanation": "암매는 높은 산에 사는 식물입니다. 높은 산은 춥고 바람이 강하게 불며 경사가 급합니다.",
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
    "id": "s31-u03-o1-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 18,
      "page": 3,
      "sourceId": "sci-31-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "장미 줄기를 본뜬 철조망",
      "concept": "철조망은 가시로 몸을 보호하는 장미 줄기의 특징을 본떠 만들었다."
    },
    "prompt": "다음 <보기>에서 장미의 줄기와 철조망의 공통점으로 알맞은 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 물에 젖지 않는다.",
        "㉡ 가시가 있어 몸을 보호한다.",
        "㉢ 바람을 타고 멀리 날아간다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s31-u03/s1-q18.webp",
    "figureNote": "사진 2장: 가시가 난 장미의 줄기, 가시 돋친 철조망. 캡션 '▲ 장미의 줄기', '▲ 철조망'.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ",
        "가시가 있어 몸을 보호한다."
      ]
    },
    "explanation": "장미의 줄기에 가시가 있어 몸을 보호하는 특징을 이용해 철조망을 만들었습니다.",
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
    "id": "s31-u03-o1-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 19,
      "page": 4,
      "sourceId": "sci-31-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "낙하산과 민들레씨",
      "concept": "낙하산은 바람을 타고 천천히 날아가는 민들레씨의 특징을 본떠 만들었다."
    },
    "prompt": "낙하산을 만들 때 이용한 식물의 특징으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "연잎이 물에 젖지 않는 특징",
      "느릅나무 잎이 빗물을 모으는 특징",
      "민들레씨가 바람을 타고 날아가는 특징",
      "도꼬마리 열매가 동물의 털에 잘 붙는 특징",
      "수세미 열매 속에 구멍이 있어 공기가 잘 통하는 특징"
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
    "explanation": "민들레씨가 바람을 타고 날아가는 모습을 이용해 낙하산을 만들었습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "⑤ 보기는 '특'에서 줄이 바뀌어 '징'이 다음 줄에 인쇄됨."
    }
  },
  {
    "id": "s31-u03-o1-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 20,
      "page": 4,
      "sourceId": "sci-31-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "단풍나무 열매를 본뜬 드론 날개",
      "concept": "단풍나무 열매가 날개처럼 돌며 바람을 타고 멀리 날아가는 특징을 이용해 드론 날개를 만들었다."
    },
    "prompt": "단풍나무 열매의 특징을 이용해 만든 것은 무엇입니까?",
    "givens": null,
    "choices": [
      "드론의 날개",
      "찍찍이 테이프",
      "설거지용 수세미",
      "빗물을 모으는 장치",
      "물에 젖지 않는 옷감"
    ],
    "figure": "assets/bank/s31-u03/s1-q20.webp",
    "figureNote": "붉은색 날개 모양이 달린 단풍나무 열매 사진.",
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
    "explanation": "단풍나무 열매가 바람을 타고 멀리 날아가는 특징을 이용해 드론의 날개를 만들었습니다.",
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
    "id": "s31-u03-o2-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 1,
      "page": 1,
      "sourceId": "sci-31-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "우리 주변에서 사는 식물",
      "concept": "학교 화단, 길가, 공원 등 우리 주변 여러 곳에서 다양한 식물을 관찰할 수 있다."
    },
    "prompt": "우리 주변에서 사는 식물에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "학교 화단에서는 식물을 관찰할 수 없다.",
      "학교나 집 주변에는 다양한 식물이 살고 있다.",
      "공원에서는 여러 가지 식물을 관찰할 수 있다.",
      "식물의 종류에 따라 뿌리의 생김새가 다양하다.",
      "식물의 생김새는 식물이 사는 곳의 환경과 관련이 있다."
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
    "explanation": "학교 화단이나 길가, 공원 등에서 여러 가지 식물을 관찰할 수 있습니다. 식물마다 뿌리, 줄기, 잎 등의 생김새가 다양하고, 식물의 생김새나 생활 방식은 식물이 사는 곳의 환경과 관련이 있습니다.",
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
    "id": "s31-u03-o2-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 2,
      "page": 1,
      "sourceId": "sci-31-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "은행나무의 특징",
      "concept": "은행나무는 키가 크고 줄기가 굵은 나무로, 부채 모양의 잎이 가을에 노랗게 변한다."
    },
    "prompt": "다음과 같은 특징을 가진 식물로 알맞은 것을 <보기>에서 골라 기호를 쓰시오.",
    "givens": {
      "지문": "• 키가 크고 줄기가 굵습니다.\n• 잎은 부채 모양으로 가지의 한 곳에서 여러 개가 납니다.\n• 가을에 잎이 노란색으로 변합니다.",
      "보기": [
        "㉠ 토끼풀",
        "㉡ 회양목",
        "㉢ 은행나무",
        "㉣ 단풍나무"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s31-u03/s2-q02.webp",
    "figureNote": "<보기> 상자: ㉠ 토끼풀, ㉡ 회양목, ㉢ 은행나무, ㉣ 단풍나무 사진 4장과 이름표(▲ 이름).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉢",
      "accepted": [
        "㉢",
        "ㄷ",
        "은행나무"
      ]
    },
    "explanation": "은행나무는 키가 크고, 줄기가 굵으며, 가을에 부채 모양의 잎이 노란색으로 변합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>의 각 사진 아래 이름은 '▲ 토끼풀'처럼 ▲ 표시와 함께 인쇄됨."
    }
  },
  {
    "id": "s31-u03-o2-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 3,
      "page": 1,
      "sourceId": "sci-31-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "잎의 구조(잎맥)",
      "concept": "잎맥은 잎몸에 선처럼 퍼져 있으며 물과 양분이 지나가는 통로이자 잎의 형태를 유지해 준다."
    },
    "prompt": "다음에서 설명하는 잎의 구조의 기호와 이름을 쓰시오.",
    "givens": {
      "지문": "물과 양분이 지나가는 통로로, 잎의 형태를 유지해 주는 역할을 합니다."
    },
    "choices": null,
    "figure": "assets/bank/s31-u03/s2-q03.webp",
    "figureNote": "잎 그림: ㉠은 잎몸의 선(잎맥)을 가리키고, ㉡은 잎몸 전체 길이를 표시한 괄호, ㉢은 잎자루 부분을 표시한 괄호.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "기호: ㉠, 이름: 잎맥",
      "accepted": [
        "기호: ㉠, 이름: 잎맥",
        "㉠, 잎맥",
        "ㄱ, 잎맥",
        "㉠ 잎맥",
        "ㄱ 잎맥"
      ]
    },
    "explanation": "㉠은 잎맥, ㉡은 잎몸, ㉢은 잎자루입니다. 잎몸에서 선처럼 보이는 것으로, 물과 양분이 지나가는 통로이며 잎의 형태를 유지해 주는 역할을 하는 것은 잎맥입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란 형식: '기호: ( ), 이름: ( )'."
    }
  },
  {
    "id": "s31-u03-o2-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 4,
      "page": 1,
      "sourceId": "sci-31-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "토끼풀 잎의 특징",
      "concept": "토끼풀 잎은 둥근 잎이 세 개씩 붙어 있고 가장자리가 톱니 모양이며, 잎몸과 줄기를 잇는 잎자루가 있다."
    },
    "prompt": "토끼풀의 잎에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "잎자루가 없다.",
      "잎의 모양이 둥글다.",
      "잎이 세 개씩 붙어 있다.",
      "잎의 끝 모양이 둥근 모양이다.",
      "잎의 가장자리가 톱니 모양이다."
    ],
    "figure": "assets/bank/s31-u03/s2-q04.webp",
    "figureNote": "토끼풀 잎 사진(둥근 잎 세 장이 잎자루 끝에 붙어 있음).",
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
    "explanation": "잎자루는 잎몸과 줄기를 연결하는 부분으로, 토끼풀은 잎자루가 있습니다.",
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
    "id": "s31-u03-o2-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 5,
      "page": 1,
      "sourceId": "sci-31-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "잎의 분류(길쭉한 모양)",
      "concept": "강아지풀과 소나무의 잎은 전체적인 모양이 길쭉하고, 단풍나무의 잎은 길쭉하지 않다."
    },
    "prompt": "다음은 '잎의 전체적인 모양이 길쭉한가?'의 기준으로 식물의 잎을 분류한 결과입니다. 잘못 분류한 것을 골라 이름을 쓰시오.",
    "givens": {
      "표": {
        "그렇다.": [
          "강아지풀"
        ],
        "그렇지 않다.": [
          "소나무, 단풍나무"
        ]
      }
    },
    "choices": null,
    "figure": "assets/bank/s31-u03/s2-q05.webp",
    "figureNote": "분류 결과 표: 머리칸 '그렇다.' / '그렇지 않다.', 내용 '강아지풀' / '소나무, 단풍나무'.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "소나무",
      "accepted": [
        "소나무"
      ]
    },
    "explanation": "강아지풀과 소나무는 잎의 전체적인 모양이 길쭉하고, 단풍나무는 잎의 전체적인 모양이 길쭉하지 않습니다. 따라서 소나무는 강아지풀과 함께 '그렇다.'로 분류되어야 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '잘못'에 밑줄이 있음."
    }
  },
  {
    "id": "s31-u03-o2-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 6,
      "page": 2,
      "sourceId": "sci-31-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "명아주의 특징",
      "concept": "명아주는 달걀 모양의 톱니 잎을 가지며 황록색 꽃이 피고, 굵은 뿌리에 가늘고 긴 뿌리가 달려 있다."
    },
    "prompt": "다음과 같은 특징을 가지는 식물을 <보기>에서 골라 기호를 쓰시오.",
    "givens": {
      "지문": "[06~07] 다음은 들이나 산에 사는 여러 가지 식물입니다. 물음에 답하시오.\n\n• 잎은 달걀 모양이고 가장자리가 톱니 모양입니다.\n• 황록색 꽃이 피고 열매에는 검은색 씨가 들어 있습니다.\n• 굵은 뿌리에 가늘고 긴 뿌리가 달려 있습니다.",
      "보기": [
        "㉠ 명아주",
        "㉡ 강아지풀",
        "㉢ 밤나무",
        "㉣ 떡갈나무"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s31-u03/s2-q06.webp",
    "figureNote": "<보기> 상자: ㉠ 명아주, ㉡ 강아지풀, ㉢ 밤나무, ㉣ 떡갈나무 사진 4장과 이름표(▲ 이름).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠",
      "accepted": [
        "㉠",
        "ㄱ",
        "명아주"
      ]
    },
    "explanation": "잎이 달걀 모양이고, 황록색 꽃이 피며, 굵은 뿌리에 가늘고 긴 뿌리가 달려 있는 식물은 명아주입니다.",
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
    "id": "s31-u03-o2-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 7,
      "page": 2,
      "sourceId": "sci-31-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "풀과 나무의 분류",
      "concept": "명아주와 강아지풀은 풀이고, 밤나무와 떡갈나무는 나무이다."
    },
    "prompt": "<보기>의 식물을 풀과 나무로 알맞게 분류한 것은 어느 것입니까?",
    "givens": {
      "지문": "[06~07] 다음은 들이나 산에 사는 여러 가지 식물입니다. 물음에 답하시오.",
      "보기": [
        "㉠ 명아주",
        "㉡ 강아지풀",
        "㉢ 밤나무",
        "㉣ 떡갈나무"
      ]
    },
    "choices": [
      "㉠, ㉡ / ㉢, ㉣",
      "㉠, ㉢ / ㉡, ㉣",
      "㉡, ㉢ / ㉠, ㉣",
      "㉡, ㉣ / ㉠, ㉢",
      "㉠, ㉡, ㉢ / ㉣"
    ],
    "figure": "assets/bank/s31-u03/s2-q06.webp",
    "figureNote": "<보기> 상자: ㉠ 명아주, ㉡ 강아지풀, ㉢ 밤나무, ㉣ 떡갈나무 사진 4장과 이름표(▲ 이름).",
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
    "explanation": "명아주와 강아지풀은 풀이고, 밤나무와 떡갈나무는 나무입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기가 표 형식: 열 머리 '풀' / '나무'(밑줄). 각 행을 '① 풀 / 나무'로 적음."
    }
  },
  {
    "id": "s31-u03-o2-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 8,
      "page": 2,
      "sourceId": "sci-31-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "풀과 나무의 공통점",
      "concept": "풀과 나무는 모두 뿌리·줄기·잎이 구분되고, 대부분 땅에 뿌리를 내리며, 양분을 스스로 만든다."
    },
    "prompt": "풀과 나무의 공통점을 두 가지 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예) 뿌리, 줄기, 잎을 구분할 수 있다. / 대부분 땅에 뿌리를 내린다. / 잎이 대부분 초록색이다. / 필요한 양분을 스스로 만든다. 등",
      "rubric": {
        "required": [
          "풀과 나무의 공통점 하나",
          "풀과 나무의 다른 공통점 하나"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "풀과 나무의 알맞은 공통점 두 가지를 바르게 썼으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "들이나 산에 사는 식물은 풀과 나무로 구분할 수 있습니다. 풀과 나무는 뿌리, 줄기, 잎을 구분할 수 있고, 대부분 땅에 뿌리를 내리며, 잎이 대부분 초록색입니다. 또한 줄기에 잎, 꽃, 열매가 달리고, 필요한 양분을 스스로 만듭니다.\n[채점 기준] 풀과 나무의 알맞은 공통점 두 가지를 바르게 썼으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준에 비율(%)이 인쇄되어 있지 않아 100%로 적음."
    }
  },
  {
    "id": "s31-u03-o2-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 9,
      "page": 2,
      "sourceId": "sci-31-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "부레옥잠이 물에 뜨는 까닭",
      "concept": "부레옥잠은 잎자루의 공기주머니 덕분에 물에 떠서 산다."
    },
    "prompt": "다음은 부레옥잠이 물에 떠서 살 수 있는 까닭입니다. ㉠, ㉡에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "부레옥잠은 [㉠]에 있는 [㉡]주머니 때문에 물에 떠서 살 수 있습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 잎자루, ㉡ 공기",
      "accepted": [
        "㉠ 잎자루, ㉡ 공기",
        "㉠ 잎자루 ㉡ 공기",
        "잎자루, 공기",
        "ㄱ 잎자루, ㄴ 공기"
      ]
    },
    "explanation": "부레옥잠은 잎자루에 있는 공기주머니 때문에 물에 떠서 살 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "㉠, ㉡은 지문 안의 네모 칸으로 인쇄됨('[㉠]', '[㉡]'로 적음). 답란 형식: '㉠ ( ), ㉡ ( )'."
    }
  },
  {
    "id": "s31-u03-o2-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 10,
      "page": 2,
      "sourceId": "sci-31-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "잎이 물 위로 높이 자라는 식물",
      "concept": "연꽃과 갈대는 강이나 연못에 살면서 잎이 물 위로 높이 자라는 식물이다."
    },
    "prompt": "강이나 연못에 사는 식물 중 잎이 물 위로 높이 자라는 식물끼리 짝 지은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "마름, 순채",
      "수련, 가래",
      "연꽃, 갈대",
      "물상추, 개구리밥",
      "물질경이, 붕어마름"
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
    "explanation": "연꽃과 갈대는 잎이 물 위로 높이 자라는 식물입니다. 마름, 순채, 수련, 가래는 잎이 물에 떠 있는 식물, 물상추, 개구리밥은 물에 떠서 사는 식물, 물질경이, 붕어마름은 물속에 잠겨서 사는 식물입니다.",
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
    "id": "s31-u03-o2-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 11,
      "page": 2,
      "sourceId": "sci-31-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물속에 잠겨서 사는 식물의 특징",
      "concept": "물속에 잠겨서 사는 식물은 줄기가 가늘고 물의 흐름에 따라 잘 휘어지며, 뿌리는 물속의 땅에 내린다."
    },
    "prompt": "다음 식물들의 공통적인 특징을 <보기>에서 모두 고른 것은 어느 것입니까?",
    "givens": {
      "지문": "(그림 속 식물) 물수세미, 나사말, 검정말",
      "보기": [
        "㉠ 줄기가 가늘다.",
        "㉡ 잎과 꽃이 물에 떠 있다.",
        "㉢ 뿌리는 물속으로 뻗어 있다.",
        "㉣ 줄기와 잎이 물의 흐름에 따라 잘 휘어진다."
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉠, ㉣",
      "㉡, ㉢",
      "㉡, ㉣"
    ],
    "figure": "assets/bank/s31-u03/s2-q11.webp",
    "figureNote": "물속 그림: 물수세미, 나사말, 검정말이 물속 바닥에 뿌리를 두고 물에 잠겨 자라는 모습. 식물 이름은 그림 속 글자로만 인쇄되어 givens.지문에 옮겨 적음.",
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
    "explanation": "물수세미, 나사말, 검정말은 강이나 연못의 물속에 잠겨서 사는 식물입니다. 물속에 잠겨서 사는 식물은 줄기가 가늘고, 잎이 작으며, 줄기와 잎이 물의 흐름에 따라 잘 휘어집니다. 또한 뿌리는 물속의 땅에 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "식물 이름(물수세미, 나사말, 검정말)은 그림 안에만 인쇄됨."
    }
  },
  {
    "id": "s31-u03-o2-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 12,
      "page": 3,
      "sourceId": "sci-31-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "사막에 사는 식물",
      "concept": "낮과 밤의 온도 차가 크고 건조한 사막에는 용설란 같은 식물이 산다."
    },
    "prompt": "다음과 같은 환경에 주로 사는 식물로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 낮과 밤의 온도 차이가 큽니다.\n• 비가 거의 내리지 않아 건조합니다."
    },
    "choices": [
      "부들",
      "맥문동",
      "소나무",
      "용설란",
      "애기똥풀"
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
    "explanation": "용설란은 낮과 밤의 온도 차이가 크고, 비가 거의 내리지 않아 건조한 사막에 사는 식물입니다. 부들은 강이나 연못, 맥문동, 소나무, 애기똥풀은 들이나 산에 사는 식물입니다.",
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
    "id": "s31-u03-o2-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 13,
      "page": 3,
      "sourceId": "sci-31-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T10",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "알로에가 사막에 사는 까닭",
      "concept": "알로에는 두꺼운 잎에 물을 저장해 건조한 사막에서 살 수 있다."
    },
    "prompt": "알로에가 사막에서 살 수 있는 까닭을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s31-u03/s2-q13.webp",
    "figureNote": "검은 흙(모래) 위에 자라는 알로에 사진(두껍고 뾰족한 잎).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예) 알로에는 두꺼운 잎에 물을 저장하기 때문에 사막에서 살 수 있다. 등",
      "rubric": {
        "required": [
          "두꺼운 잎에 물을 저장한다",
          "그래서 사막(건조한 곳)에서 살 수 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "사막에서 살 수 있는 특징을 바르게 썼으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "사막은 비가 거의 내리지 않아 건조하고 낮과 밤의 온도 차이가 큽니다. 알로에는 두꺼운 잎에 물을 저장하고 있기 때문에 건조한 사막에서 살 수 있습니다.\n[채점 기준] 사막에서 살 수 있는 특징을 바르게 썼으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준에 비율(%)이 인쇄되어 있지 않아 100%로 적음."
    }
  },
  {
    "id": "s31-u03-o2-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 14,
      "page": 3,
      "sourceId": "sci-31-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "선인장의 특징",
      "concept": "선인장은 굵은 줄기에 물을 저장하므로 자른 면에 휴지를 대면 휴지가 물에 젖는다."
    },
    "prompt": "선인장에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "가시 모양의 잎이 있다.",
      "굵은 줄기에 물을 저장한다.",
      "동물이 함부로 먹지 못한다.",
      "종류에 따라 생김새가 다양하다.",
      "줄기를 자른 면에 휴지를 대면 휴지가 파란색으로 변한다."
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
    "explanation": "선인장은 사막에 사는 식물로, 굵은 줄기에 물을 저장하기 때문에 선인장의 줄기를 자른 면에 휴지를 대면 휴지가 물에 젖습니다.",
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
    "id": "s31-u03-o2-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 15,
      "page": 3,
      "sourceId": "sci-31-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "높은 산에 사는 식물",
      "concept": "암매와 눈잣나무는 높은 산에 사는 식물이다."
    },
    "prompt": "다음 <보기>에서 주로 높은 산에 사는 식물을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 암매",
        "㉡ 갯메꽃",
        "㉢ 눈잣나무",
        "㉣ 남극좀새풀"
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
    "explanation": "암매와 눈잣나무는 높은 산에 사는 식물입니다. 갯메꽃은 바닷가, 남극좀새풀은 극지방에 사는 식물입니다.",
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
    "id": "s31-u03-o2-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 16,
      "page": 3,
      "sourceId": "sci-31-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "한라솜다리의 특징",
      "concept": "한라솜다리는 키가 작고 여러 줄기가 모여 자라서 강한 바람에도 잘 견딘다."
    },
    "prompt": "다음은 한라솜다리에 대한 설명입니다. ㉠, ㉡에 들어갈 알맞은 말을 골라 쓰시오.",
    "givens": {
      "지문": "한라솜다리는 키가 ㉠ ( 작, 크 )고 여러 개의 ㉡ ( 꽃, 줄기 )이/가 모여 자라 바람이 강하게 불어도 잘 자랍니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 작, ㉡ 줄기",
      "accepted": [
        "㉠ 작, ㉡ 줄기",
        "㉠ 작 ㉡ 줄기",
        "작, 줄기",
        "ㄱ 작, ㄴ 줄기",
        "작 줄기"
      ]
    },
    "explanation": "한라솜다리는 한라산 정상에서만 자라는 식물로, 키가 작고 여러 개의 줄기가 함께 모여 자라 바람이 강하게 불어도 잘 자랍니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란 형식: '㉠ ( ), ㉡ ( )'."
    }
  },
  {
    "id": "s31-u03-o2-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 17,
      "page": 3,
      "sourceId": "sci-31-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "통보리사초의 특징",
      "concept": "바닷가 모래밭에 사는 통보리사초는 뿌리를 깊게 내려 강한 바람에도 잘 자란다."
    },
    "prompt": "통보리사초에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "바닷가에 사는 식물이다.",
      "땅에 뿌리를 깊게 내린다.",
      "열매가 보리와 비슷한 모양이다.",
      "줄기는 땅속에서 옆으로 길게 자란다.",
      "바람이 강하게 불면 잘 자라지 못한다."
    ],
    "figure": "assets/bank/s31-u03/s2-q17.webp",
    "figureNote": "바닷가 모래밭에 자라는 통보리사초 그림(보리 이삭 모양의 열매).",
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
    "explanation": "통보리사초는 바닷가의 모래밭에서 자라는 식물로, 땅에 뿌리를 깊게 내려서 바람이 강하게 불어도 잘 자랍니다.",
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
    "id": "s31-u03-o2-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 18,
      "page": 4,
      "sourceId": "sci-31-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "도꼬마리 열매의 특징 활용",
      "concept": "갈고리 모양 가시로 털이나 천에 잘 붙는 도꼬마리 열매의 특징을 본떠 찍찍이 테이프를 만들었다."
    },
    "prompt": "다음 <보기>에서 도꼬마리 열매의 특징을 이용한 예로 알맞은 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 낙하산",
        "㉡ 찍찍이 테이프",
        "㉢ 설거지용 수세미"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s31-u03/s2-q18.webp",
    "figureNote": "가지에 달린 도꼬마리 열매 사진(뾰족한 가시가 많은 열매).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ",
        "찍찍이 테이프"
      ]
    },
    "explanation": "도꼬마리 열매가 뾰족한 갈고리 모양으로 생겨서 동물의 털이나 천 등에 잘 붙는 특징을 이용해 쉽게 열고 닫을 수 있는 찍찍이 테이프를 만들었습니다.",
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
    "id": "s31-u03-o2-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 19,
      "page": 4,
      "sourceId": "sci-31-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "단풍나무 열매의 특징 활용",
      "concept": "단풍나무 열매가 바람을 타고 빙글빙글 멀리 날아가는 특징을 헬리콥터 프로펠러에 이용했다."
    },
    "prompt": "단풍나무 열매와 헬리콥터 프로펠러의 공통적인 특징으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "공기가 잘 통하고 푹신하다.",
      "물이 스며들지 않아 젖지 않는다.",
      "동물의 털이나 천 등에 잘 붙는다.",
      "바람을 타고 멀리 날아갈 수 있다.",
      "젖으면 오므라들고 마르면 펴진다."
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
    "explanation": "단풍나무 열매가 바람을 타고 멀리 날아가는 특징을 이용해 헬리콥터 프로펠러를 만들었습니다.",
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
    "id": "s31-u03-o2-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 20,
      "page": 4,
      "sourceId": "sci-31-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "끈끈이주걱의 특징 활용",
      "concept": "끈끈이주걱의 끈끈한 털에 작은 것이 잘 붙는 특징을 이용해 먼지를 붙여 청소하는 돌돌이를 설계할 수 있다."
    },
    "prompt": "다음은 식물의 특징을 이용하여 설계한 생활용품입니다. 생활용품에 이용한 식물의 특징으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "(그림 속 설명) 끈끈한 털을 돌돌이에 붙인다. / 끈끈한 털에 먼지가 잘 붙어 책상이나 바닥을 깨끗하게 청소할 수 있다."
    },
    "choices": [
      "물에 젖지 않는 연잎",
      "바람을 타고 날아가는 민들레씨",
      "끈끈한 털이 많이 나 있는 끈끈이주걱",
      "가시가 있어 몸을 보호하는 장미의 줄기",
      "속이 비어 가볍지만 튼튼한 대나무 줄기"
    ],
    "figure": "assets/bank/s31-u03/s2-q20.webp",
    "figureNote": "손으로 쥔 초록색 돌돌이(먼지 제거 롤러) 그림: 롤러 표면에 끝이 둥근 털이 많이 붙어 있고 먼지가 달라붙음. 손글씨 설명 2개(givens.지문에 옮겨 적음).",
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
    "explanation": "끈끈한 털이 많이 나 있고, 작은 벌레가 끈끈한 털에 닿으면 붙어서 도망가지 못하는 끈끈이주걱의 특징을 이용하여 설계한 생활용품입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "그림 속 설명은 손글씨체로 인쇄됨."
    }
  },
  {
    "id": "s31-u03-o3-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 1,
      "page": 1,
      "sourceId": "sci-31-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "강아지풀의 특징",
      "concept": "강아지풀은 꽃에 긴 털이 있어 강아지 꼬리처럼 보인다."
    },
    "prompt": "강아지풀에 대한 설명으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "보라색 꽃이 핀다.",
      "꽃에 긴 털이 달려 있다.",
      "가을에 잎이 빨간색으로 변한다.",
      "잎이 여러 갈래로 갈라진 모양이다.",
      "줄기가 땅을 기어 길게 옆으로 뻗어나간다."
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
    "explanation": "강아지풀은 꽃에 긴 털이 달려 있어 강아지 꼬리와 모양이 비슷합니다.",
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
    "id": "s31-u03-o3-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 2,
      "page": 1,
      "sourceId": "sci-31-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "가을에 색이 변하는 잎",
      "concept": "은행나무와 단풍나무는 가을이 되면 잎의 색이 노란색이나 빨간색으로 바뀐다."
    },
    "prompt": "다음 빈칸에 공통으로 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "• 은행나무는 가을에 □이/가 노란색으로 변합니다.\n• 단풍나무는 가을에 □이/가 빨간색으로 변합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "잎",
      "accepted": [
        "잎",
        "잎사귀",
        "나뭇잎"
      ]
    },
    "explanation": "은행나무는 가을에 잎이 노란색으로 변하고, 단풍나무는 가을에 잎이 빨간색으로 변합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 인쇄본에서 네모 칸(□)으로 표시됨."
    }
  },
  {
    "id": "s31-u03-o3-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 3,
      "page": 1,
      "sourceId": "sci-31-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "알맞은 분류 기준",
      "concept": "분류 기준은 누가 분류해도 같은 결과가 나오는 객관적인 것이어야 한다."
    },
    "prompt": "‘잎의 모양이 예쁜가?’는 식물의 잎을 분류하는 분류 기준으로 알맞지 않은 까닭을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "분류하는 사람에 따라 분류 결과가 달라질 수 있기 때문에 분류 기준으로 알맞지 않다.",
      "rubric": {
        "required": [
          "사람마다 판단이 다르다",
          "그래서 분류 결과가 달라질 수 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "분류하는 사람에 따라 분류 결과가 달라질 수 있다는 내용이 포함되어 있으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "식물의 잎을 분류할 때는 누가 분류하더라도 같은 결과가 나오는 분류 기준을 정해야 합니다. ‘잎의 모양이 예쁜가?’는 분류하는 사람에 따라 분류 결과가 달라질 수 있으므로 분류 기준으로 알맞지 않습니다.\n[채점 기준] 분류하는 사람에 따라 분류 결과가 달라질 수 있다는 내용이 포함되어 있으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표에 비율이 따로 인쇄되어 있지 않아 100%로 적음."
    }
  },
  {
    "id": "s31-u03-o3-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 4,
      "page": 1,
      "sourceId": "sci-31-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "잎의 분류 기준 찾기",
      "concept": "토끼풀과 소나무는 잎 여러 개가 붙어 있고 강아지풀과 단풍나무는 잎이 하나씩 떨어져 있다."
    },
    "prompt": "다음과 같이 식물의 잎을 분류할 수 있는 분류 기준으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "표": {
        "구분": [
          "잎 사진"
        ],
        "그렇다.": [
          "토끼풀 잎, 소나무 잎(사진)"
        ],
        "그렇지 않다.": [
          "강아지풀 잎, 단풍나무 잎(사진)"
        ]
      }
    },
    "choices": [
      "잎의 끝이 뾰족한가?",
      "잎 여러 개가 붙어 있는가?",
      "잎의 끝 모양이 둥근 모양인가?",
      "잎의 전체적인 모양이 길쭉한가?",
      "잎의 가장자리가 톱니 모양인가?"
    ],
    "figure": "assets/bank/s31-u03/s3-q04.webp",
    "figureNote": "‘그렇다.’/‘그렇지 않다.’ 두 칸 표. 그렇다: 토끼풀 잎(세 잎), 소나무 잎(바늘잎 묶음). 그렇지 않다: 강아지풀 잎(길쭉한 잎), 단풍나무 잎. 사진에 이름은 인쇄되어 있지 않음.",
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
    "explanation": "토끼풀과 소나무는 잎 여러 개가 붙어 있고, 강아지풀과 단풍나무는 잎 여러 개가 붙어 있지 않습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "표 안의 잎 이름은 인쇄되지 않은 사진이며, 이름은 해설(05번 해설의 ㉠~㉣ 설명)에서 확인해 givens에 적음."
    }
  },
  {
    "id": "s31-u03-o3-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 5,
      "page": 1,
      "sourceId": "sci-31-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "잎의 끝 모양으로 분류하기",
      "concept": "네 잎 가운데 끝이 둥근 것은 토끼풀 잎이고 강아지풀·소나무·단풍나무 잎은 끝이 뾰족하다."
    },
    "prompt": "다음 <보기>를 ‘잎의 끝이 둥근 모양인가?’의 기준으로 분류할 때 ‘그렇다’에 해당하는 것을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ (강아지풀 잎 사진)",
        "㉡ (토끼풀 잎 사진)",
        "㉢ (소나무 잎 사진)",
        "㉣ (단풍나무 잎 사진)"
      ]
    },
    "choices": [
      "㉠",
      "㉡",
      "㉠, ㉡",
      "㉡, ㉣",
      "㉠, ㉢, ㉣"
    ],
    "figure": "assets/bank/s31-u03/s3-q05.webp",
    "figureNote": "<보기> 상자 안 잎 사진 4장: ㉠ 강아지풀 잎, ㉡ 토끼풀 잎, ㉢ 소나무 잎, ㉣ 단풍나무 잎. 사진에 이름은 인쇄되어 있지 않음.",
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
    "explanation": "㉠은 강아지풀, ㉡은 토끼풀, ㉢은 소나무, ㉣은 단풍나무의 잎입니다. 잎의 끝이 둥근 모양인 것은 토끼풀의 잎입니다. 강아지풀, 소나무, 단풍나무의 잎은 끝이 뾰족합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 사진만 있고 이름이 없음. givens의 이름은 해설에서 가져옴."
    }
  },
  {
    "id": "s31-u03-o3-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 6,
      "page": 2,
      "sourceId": "sci-31-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "식물이 사는 환경",
      "concept": "바오바브나무는 비가 거의 내리지 않는 건조한 사막에 사는 식물이다."
    },
    "prompt": "식물이 사는 환경에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "민들레는 들이나 산에서 산다.",
      "연꽃은 물이 있는 곳에서 산다.",
      "한라솜다리는 한라산 정상에서만 산다.",
      "소나무는 흙이 있는 땅에 뿌리를 내리고 산다.",
      "바오바브나무는 비가 많이 내리는 곳에서 산다."
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
    "explanation": "민들레와 소나무는 들이나 산에, 연꽃은 강이나 연못에, 한라솜다리는 높은 산에, 바오바브나무는 사막에 사는 식물입니다. 사막은 비가 거의 내리지 않아 건조합니다.",
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
    "id": "s31-u03-o3-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 7,
      "page": 2,
      "sourceId": "sci-31-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "풀과 나무의 차이점",
      "concept": "나무는 풀보다 키가 크고 줄기가 굵으며, 풀과 나무 모두 대부분 땅에 뿌리를 내린다."
    },
    "prompt": "풀과 나무의 차이점에 대해 바르게 설명한 사람의 이름을 쓰시오.",
    "givens": {
      "지문": "• 단비: 풀은 나무보다 키가 큽니다.\n• 다래: 나무는 풀보다 줄기가 굵습니다.\n• 하늘: 풀은 땅에 뿌리를 내리고, 나무는 땅에 뿌리를 내리지 않습니다."
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
    "explanation": "나무는 풀보다 키가 크고, 줄기가 굵습니다. 풀과 나무는 대부분 땅에 뿌리를 내립니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "인물 이름(단비·다래·하늘)은 굵게 인쇄됨."
    }
  },
  {
    "id": "s31-u03-o3-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 8,
      "page": 2,
      "sourceId": "sci-31-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "조팝나무의 특징",
      "concept": "조팝나무는 흰 꽃이 가지를 따라 피고 뿌리·줄기·잎이 뚜렷하며 양분을 스스로 만든다."
    },
    "prompt": "다음 <보기>에서 조팝나무에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 흰색 꽃이 가지를 따라 핀다.",
        "㉡ 잎에 꽃, 줄기, 열매가 달린다.",
        "㉢ 필요한 양분을 스스로 만들지 못한다.",
        "㉣ 뿌리, 줄기, 잎을 뚜렷하게 구분할 수 있다."
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
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "조팝나무는 흰색 꽃이 가지를 따라 피고, 이 모습이 튀긴 좁쌀을 붙인 것같이 보인다고 하여 이름 붙여졌습니다. 또한 뿌리, 줄기, 잎을 뚜렷하게 구분할 수 있고, 줄기에 잎, 꽃, 열매가 달리며, 필요한 양분을 스스로 만듭니다.",
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
    "id": "s31-u03-o3-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 9,
      "page": 2,
      "sourceId": "sci-31-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "부레옥잠의 생김새",
      "concept": "부레옥잠은 잎이 둥글고 매끈하며 잎자루가 부풀어 있고 뿌리가 수염 모양이다."
    },
    "prompt": "부레옥잠의 생김새를 관찰한 결과로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "뿌리는 수염처럼 생겼다.",
      "잎은 둥글고 광택이 난다.",
      "잎 가장자리에 가시가 있다.",
      "전체적인 색깔은 초록색이다.",
      "잎자루가 볼록하게 부풀어 있다."
    ],
    "figure": "assets/bank/s31-u03/s3-q09.webp",
    "figureNote": "부레옥잠 전체 사진. 잎, 잎자루, 뿌리에 이름표가 붙어 있음.",
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
    "explanation": "부레옥잠은 전체적인 색깔이 초록색이고, 잎은 둥글고 매끈하여 광택이 납니다. 또한 잎자루가 볼록하게 부풀어 있고, 뿌리는 수염처럼 생겼습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 ‘않은’에 밑줄. 그림의 이름표: 잎, 잎자루, 뿌리."
    }
  },
  {
    "id": "s31-u03-o3-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 10,
      "page": 2,
      "sourceId": "sci-31-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물에 떠서 사는 식물의 특징",
      "concept": "물에 떠서 사는 식물은 공기주머니가 있거나 잎이 넓어서 물에 쉽게 뜬다."
    },
    "prompt": "다음 식물들의 공통적인 특징으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "개구리밥, 물상추, 생이가래"
    },
    "choices": [
      "잎이 작다.",
      "키가 크고 줄기가 단단하다.",
      "뿌리는 물속이나 물가의 땅에 있다.",
      "줄기와 잎이 물의 흐름에 따라 잘 휘어진다.",
      "공기주머니가 있거나 잎이 넓어서 물에 쉽게 뜬다."
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
    "explanation": "개구리밥, 물상추, 생이가래는 강이나 연못의 물에 떠서 사는 식물입니다. 물에 떠서 사는 식물은 공기주머니가 있거나 잎이 넓어서 물에 쉽게 뜨고, 수염 모양의 뿌리가 물속으로 뻗어 있습니다.",
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
    "id": "s31-u03-o3-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 11,
      "page": 3,
      "sourceId": "sci-31-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "잎이 물 위로 높이 자라는 식물",
      "concept": "연꽃은 잎이 물 위로 높이 자라고 뿌리가 물속 땅에 있으며 줄기가 단단하다."
    },
    "prompt": "다음과 같은 특징을 가진 식물로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 잎이 물 위로 높이 자랍니다.\n• 뿌리는 물속이나 물가의 땅에 있습니다.\n• 대부분 키가 크고 줄기가 단단합니다."
    },
    "choices": [
      "연꽃",
      "순채",
      "물질경이",
      "부레옥잠",
      "붕어마름"
    ],
    "figure": "assets/bank/s31-u03/s3-q11.webp",
    "figureNote": "보기 ①~⑤가 사진이고 아래에 이름이 붙어 있음: ① 연꽃, ② 순채, ③ 물질경이, ④ 부레옥잠, ⑤ 붕어마름.",
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
    "explanation": "연꽃과 같이 잎이 물 위로 높이 자라는 식물에 대한 설명입니다. 순채는 잎이 물에 떠 있는 식물, 물질경이와 붕어마름은 물속에 잠겨서 사는 식물, 부레옥잠은 물에 떠서 사는 식물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "선택지는 사진+캡션(▲ 연꽃 등) 형식. choices에는 캡션 이름만 적음."
    }
  },
  {
    "id": "s31-u03-o3-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 12,
      "page": 3,
      "sourceId": "sci-31-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "알로에가 사막에서 사는 까닭",
      "concept": "알로에는 두꺼운 잎 속에 물을 저장해 건조한 사막에서 살 수 있다."
    },
    "prompt": "다음은 알로에 잎을 잘라서 속 모양을 관찰한 결과입니다. 이 결과와 관련지어 알로에가 사막에서 살 수 있는 까닭으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 잎 안쪽에 투명한 젤리 같은 것이 있습니다.\n• 잎의 단면을 만져 보면 물기가 많아 촉촉하고 미끌미끌합니다."
    },
    "choices": [
      "잎에 물을 저장하고 있기 때문이다.",
      "줄기에 물을 저장하고 있기 때문이다.",
      "잎에 지방을 저장하고 있기 때문이다.",
      "잎자루에 공기주머니가 있기 때문이다.",
      "잎의 가장자리에 가시가 있기 때문이다."
    ],
    "figure": "assets/bank/s31-u03/s3-q12.webp",
    "figureNote": "자른 알로에 잎 단면 사진(안쪽의 투명한 젤리 같은 부분이 보임).",
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
    "explanation": "알로에는 두꺼운 잎에 물을 저장하고 있기 때문에 사막에서 살 수 있습니다.",
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
    "id": "s31-u03-o3-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 13,
      "page": 3,
      "sourceId": "sci-31-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "사막에 사는 식물",
      "concept": "용설란과 리돕스는 사막에 사는 식물이다."
    },
    "prompt": "주로 사막에 사는 식물끼리 짝 지은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "명아주, 암매",
      "용설란, 리돕스",
      "명아주, 리돕스",
      "밤나무, 떡갈나무",
      "용설란, 한라솜다리"
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
    "explanation": "용설란과 리돕스는 사막에 사는 식물입니다. 명아주, 밤나무, 떡갈나무는 들이나 산, 암매와 한라솜다리는 높은 산에 사는 식물입니다.",
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
    "id": "s31-u03-o3-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 14,
      "page": 3,
      "sourceId": "sci-31-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "사막 식물의 물 저장",
      "concept": "선인장과 바오바브나무는 굵은 줄기에 물을 저장해 건조한 사막에서 산다."
    },
    "prompt": "다음 빈칸에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "선인장과 바오바브나무는 굵은 □에 물을 저장하여 건조한 환경에서 살 수 있습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "줄기",
      "accepted": [
        "줄기"
      ]
    },
    "explanation": "선인장과 바오바브나무는 사막에 사는 식물로, 굵은 줄기에 물을 저장합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 인쇄본에서 네모 칸(□)으로 표시됨."
    }
  },
  {
    "id": "s31-u03-o3-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 15,
      "page": 3,
      "sourceId": "sci-31-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "높은 산에 사는 식물의 특징",
      "concept": "높은 산의 식물은 춥고 바람이 센 환경을 견디도록 대부분 키가 작거나 줄기가 옆으로 자란다."
    },
    "prompt": "높은 산에 사는 식물이 대부분 가지고 있는 공통적인 특징을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예) 키가 작거나 줄기가 옆으로 자라 강한 바람을 견딜 수 있다. 등",
      "rubric": {
        "required": [
          "키가 작거나 줄기가 옆으로 자란다",
          "그래서 강한 바람을 견딜 수 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "높은 산에서 살아가기에 알맞은 특징을 썼으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "높은 산은 춥고 바람이 강하게 불며 경사가 급합니다. 높은 산에 사는 식물은 대부분 키가 작거나 줄기가 옆으로 자라 강한 바람을 견딜 수 있습니다.\n[채점 기준] 높은 산에서 살아가기에 알맞은 특징을 썼으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표에 비율이 따로 인쇄되어 있지 않아 100%로 적음. 빠른 정답과 해설의 줄바꿈 위치만 다르고 문구는 같음."
    }
  },
  {
    "id": "s31-u03-o3-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 16,
      "page": 4,
      "sourceId": "sci-31-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "바닷가·갯벌에 사는 식물",
      "concept": "갯메꽃, 퉁퉁마디, 통보리사초는 소금기 많고 바람과 햇빛이 강한 바닷가나 갯벌에 산다."
    },
    "prompt": "다음과 같은 환경에 주로 사는 식물을 <보기>에서 모두 고른 것은 어느 것입니까?",
    "givens": {
      "지문": "소금 성분이 많이 포함된 물이 있고 바람이 강하게 불며 햇빛이 강합니다.",
      "보기": [
        "㉠ ▲ 갯메꽃",
        "㉡ ▲ 퉁퉁마디",
        "㉢ ▲ 통보리사초"
      ]
    },
    "choices": [
      "㉠",
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉢",
      "㉠, ㉡, ㉢"
    ],
    "figure": "assets/bank/s31-u03/s3-q16.webp",
    "figureNote": "<보기> 상자 안 그림 3장과 이름: ㉠ 갯메꽃(모래 바닷가의 분홍 꽃), ㉡ 퉁퉁마디(갯벌의 마디 있는 풀), ㉢ 통보리사초(모래밭의 이삭 풀).",
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
    "explanation": "바닷가나 갯벌에 대한 설명입니다. 갯메꽃, 퉁퉁마디, 통보리사초는 모두 바닷가나 갯벌에 사는 식물입니다.",
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
    "id": "s31-u03-o3-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 17,
      "page": 4,
      "sourceId": "sci-31-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "눈잣나무가 옆으로 자라는 까닭",
      "concept": "눈잣나무는 산꼭대기의 강한 바람을 견디기 위해 옆으로 낮게 자란다."
    },
    "prompt": "눈잣나무가 높은 산의 산꼭대기에서 옆으로 자라는 까닭으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "바람이 강하게 불기 때문이다.",
      "비가 거의 내리지 않기 때문이다.",
      "눈과 얼음으로 덮여 있기 때문이다.",
      "낮과 밤의 온도 차이가 크기 때문이다.",
      "소금 성분이 포함된 물이 있기 때문이다."
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
    "explanation": "눈잣나무는 높은 산의 산꼭대기에서는 강한 바람을 견디기 위해 옆으로 자라고, 바람이 약한 곳에서는 위로 자랍니다.",
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
    "id": "s31-u03-o3-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 18,
      "page": 4,
      "sourceId": "sci-31-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "장미 줄기를 본뜬 생활용품",
      "concept": "가시로 몸을 보호하는 장미 줄기의 특징을 본떠 철조망을 만들었다."
    },
    "prompt": "다음 <보기>에서 장미 줄기의 특징을 이용해 만든 생활용품을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 드론",
        "㉡ 낙하산",
        "㉢ 철조망"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s31-u03/s3-q18.webp",
    "figureNote": "가시가 달린 장미 줄기 사진(뒤에 장미꽃).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉢",
      "accepted": [
        "㉢",
        "ㄷ",
        "철조망"
      ]
    },
    "explanation": "장미의 줄기에 가시가 있어 몸을 보호하는 특징을 이용해 철조망을 만들었습니다.",
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
    "id": "s31-u03-o3-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 19,
      "page": 4,
      "sourceId": "sci-31-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "연잎의 특징",
      "concept": "연잎은 표면이 물에 젖지 않아 물방울이 굴러 떨어진다."
    },
    "prompt": "연잎에 대한 설명으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[19~20] 다음 연잎의 모습을 보고, 물음에 답하시오."
    },
    "choices": [
      "물에 젖지 않는다.",
      "가을에 빨간색으로 변한다.",
      "바람을 타고 멀리 날아다닌다.",
      "크고 뾰족한 가시가 달려 있다.",
      "동물의 털이나 천 등에 잘 붙는다."
    ],
    "figure": "assets/bank/s31-u03/s3-q19.webp",
    "figureNote": "[19~20] 공통 사진: 연잎 위에 맺힌 동그란 물방울.",
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
    "explanation": "연잎은 물에 젖지 않는 특징이 있습니다.",
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
    "id": "s31-u03-o3-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 20,
      "page": 5,
      "sourceId": "sci-31-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "연잎을 본뜬 생활용품",
      "concept": "물에 젖지 않는 연잎의 특징을 본떠 물이 스며들지 않는 옷감을 만들었다."
    },
    "prompt": "다음 <보기>에서 연잎의 특징을 이용한 예로 알맞은 것을 골라 기호를 쓰시오.",
    "givens": {
      "지문": "[19~20] 다음 연잎의 모습을 보고, 물음에 답하시오.",
      "보기": [
        "㉠ ▲ 찍찍이 테이프",
        "㉡ ▲ 헬리콥터 프로펠러",
        "㉢ ▲ 물에 젖지 않는 옷감"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s31-u03/s3-q20.webp",
    "figureNote": "<보기> 상자 안 사진 3장과 이름: ㉠ 찍찍이 테이프, ㉡ 헬리콥터 프로펠러, ㉢ 물에 젖지 않는 옷감(물방울이 맺힌 빨간 천). [19~20] 공통 연잎 사진은 4쪽 bbox [365, 417, 498, 509]에 있음.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉢",
      "accepted": [
        "㉢",
        "ㄷ",
        "물에 젖지 않는 옷감"
      ]
    },
    "explanation": "연잎이 물에 젖지 않는 특징을 이용해 물이 스며들지 않아 젖지 않는 옷감을 만들었습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "[19~20] 공통 지문과 연잎 사진은 4쪽에 있고, 20번 문항과 <보기>는 5쪽에 있음."
    }
  },
  {
    "id": "s31-u03-o4-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 1,
      "page": 1,
      "sourceId": "sci-31-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "은행나무의 특징",
      "concept": "은행나무는 키가 크고 줄기가 굵은 나무로, 부채 모양의 잎이 가을에 노랗게 변한다."
    },
    "prompt": "다음에서 설명하는 식물은 무엇입니까?",
    "givens": {
      "지문": "• 키가 크고 줄기가 굵습니다.\n• 잎은 부채 모양으로 가지의 한 곳에서 여러 개가 납니다.\n• 가을에 잎이 노란색으로 변합니다."
    },
    "choices": [
      "토끼풀",
      "맥문동",
      "강아지풀",
      "단풍나무",
      "은행나무"
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
    "explanation": "은행나무는 키가 크고 줄기가 굵으며, 잎이 부채 모양입니다. 또한 가을에 잎이 노란색으로 변합니다.",
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
    "id": "s31-u03-o4-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 2,
      "page": 1,
      "sourceId": "sci-31-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "우리 주변 식물에 대한 바른 설명",
      "concept": "식물의 생김새와 생활 방식은 그 식물이 사는 곳의 환경과 관련이 있다."
    },
    "prompt": "우리 주변에 사는 식물에 대해 바르게 설명한 사람의 이름을 쓰시오.",
    "givens": {
      "지문": "• 단비: 식물마다 꽃의 생김새는 같습니다.\n• 다래: 학교 화단에는 식물이 살고 있지 않습니다.\n• 하늘: 식물의 생활 방식은 식물이 사는 곳의 환경과 관련이 있습니다."
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
    "explanation": "학교 화단이나 길가, 공원 등 우리 주변에는 여러 가지 식물이 살고 있습니다. 식물마다 뿌리, 줄기, 잎, 꽃 등의 생김새가 다양하며, 식물의 생김새나 생활 방식은 식물이 사는 곳의 환경과 관련이 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "이름(단비·다래·하늘)과 콜론이 굵게 인쇄됨."
    }
  },
  {
    "id": "s31-u03-o4-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 3,
      "page": 1,
      "sourceId": "sci-31-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "잎의 구조(잎자루)",
      "concept": "잎몸과 줄기를 이어 주는 부분은 잎자루이다."
    },
    "prompt": "잎의 구조에서 잎몸과 줄기를 연결하는 부분의 기호와 이름을 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "㉠ - 잎몸",
      "㉡ - 잎맥",
      "㉡ - 잎몸",
      "㉢ - 잎맥",
      "㉢ - 잎자루"
    ],
    "figure": "assets/bank/s31-u03/s4-q03.webp",
    "figureNote": "잎 그림. ㉠은 잎 표면의 줄(잎맥), ㉡은 잎의 넓은 부분(잎몸)을 감싼 테두리 선, ㉢은 잎 아래쪽 줄기와 이어지는 부분(잎자루)을 가리킨다.",
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
    "explanation": "㉠은 잎맥, ㉡은 잎몸, ㉢은 잎자루입니다. 잎몸과 줄기를 연결하는 부분은 잎자루입니다.",
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
    "id": "s31-u03-o4-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 4,
      "page": 1,
      "sourceId": "sci-31-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "잎 분류 기준",
      "concept": "분류 기준은 누가 분류해도 같은 결과가 나오는 객관적인 것이어야 한다."
    },
    "prompt": "식물의 잎을 분류하기 위한 분류 기준으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "잎이 귀엽게 생겼는가?",
      "잎의 끝 모양이 둥근가?",
      "잎의 가장자리가 톱니 모양인가?",
      "잎의 전체적인 모양이 길쭉한가?",
      "잎자루에 붙은 잎의 개수가 한 개인가?"
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
    "explanation": "잎의 특징에 따라 분류할 때 누가 분류하더라도 같은 결과가 나오는 분류 기준을 정해야 합니다. ‘잎이 귀엽게 생겼는가?’는 분류하는 사람에 따라 결과가 다르게 나올 수 있으므로 알맞은 분류 기준이 아닙니다.",
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
    "id": "s31-u03-o4-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 5,
      "page": 1,
      "sourceId": "sci-31-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "잎 가장자리 모양에 따른 분류",
      "concept": "소나무 잎은 가장자리가 매끈하므로 톱니 모양이 아닌 쪽으로 분류해야 한다."
    },
    "prompt": "다음은 ‘잎의 가장자리가 톱니 모양인가?’의 분류 기준으로 식물의 잎을 분류한 결과입니다. 잘못 분류한 것을 쓰시오.",
    "givens": {
      "표": {
        "그렇다.": [
          "단풍나무, 소나무, 토끼풀"
        ],
        "그렇지 않다.": [
          "강아지풀"
        ]
      }
    },
    "choices": null,
    "figure": "assets/bank/s31-u03/s4-q05.webp",
    "figureNote": "분류 결과 표: '그렇다.' 칸에 단풍나무, 소나무, 토끼풀 / '그렇지 않다.' 칸에 강아지풀. 표 내용은 givens에 옮겨 적음.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "소나무",
      "accepted": [
        "소나무"
      ]
    },
    "explanation": "소나무는 잎의 가장자리가 매끈합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '잘못'에 밑줄. 표의 '단풍나무, 소나무, 토끼풀'은 칸 안에서 '단풍나무, 소나무,' / '토끼풀'로 줄바꿈됨."
    }
  },
  {
    "id": "s31-u03-o4-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 6,
      "page": 1,
      "sourceId": "sci-31-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "조팝나무의 특징",
      "concept": "조팝나무는 가지를 따라 흰 꽃이 촘촘히 피어 튀긴 좁쌀을 붙인 것처럼 보이는 나무이다."
    },
    "prompt": "다음에서 설명하는 식물을 <보기>에서 골라 기호를 쓰시오.",
    "givens": {
      "지문": "• 흰색 꽃이 가지를 따라 핍니다.\n• 잎은 타원 모양이고 가장자리가 톱니 모양입니다.\n• 꽃이 핀 모습이 튀긴 좁쌀을 붙인 것 같이 보입니다.",
      "보기": [
        "㉠ ▲ 소나무",
        "㉡ ▲ 떡갈나무",
        "㉢ ▲ 애기똥풀",
        "㉣ ▲ 조팝나무"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s31-u03/s4-q06.webp",
    "figureNote": "<보기> 상자: 사진 4장과 캡션 — ㉠ 소나무(바닷가 소나무), ㉡ 떡갈나무(들판의 큰 나무), ㉢ 애기똥풀(노란 꽃), ㉣ 조팝나무(흰 꽃이 가지에 촘촘함). 보기 자체가 사진으로 되어 있음.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉣",
      "accepted": [
        "㉣",
        "ㄹ",
        "조팝나무"
      ]
    },
    "explanation": "조팝나무는 가지를 따라 핀 흰색 꽃이 튀긴 좁쌀을 붙인 것 같이 보인다고 하여 이름 붙여졌습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 사진 4장에 '▲ 이름' 캡션이 붙은 형태. 기호와 캡션을 givens에 옮겨 적음."
    }
  },
  {
    "id": "s31-u03-o4-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 7,
      "page": 2,
      "sourceId": "sci-31-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "들이나 산에 사는 풀의 공통점",
      "concept": "들이나 산에 사는 풀은 뿌리·줄기·잎이 구분되고 잎이 초록색이며 스스로 양분을 만든다."
    },
    "prompt": "다음 식물들의 공통점으로 알맞지 않은 것은 어느 것입니까?",
    "givens": {
      "지문": "▲ 명아주 ▲ 민들레"
    },
    "choices": [
      "잎이 초록색이다.",
      "들이나 산에서 산다.",
      "줄기에 잎이 달린다.",
      "필요한 양분을 스스로 만든다.",
      "잎과 줄기가 잘 구분되지 않는다."
    ],
    "figure": "assets/bank/s31-u03/s4-q07.webp",
    "figureNote": "명아주 사진과 민들레(노란 꽃) 사진 두 장, 캡션 '▲ 명아주', '▲ 민들레'.",
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
    "explanation": "명아주와 민들레는 들이나 산에 사는 풀입니다. 뿌리, 줄기, 잎을 구분할 수 있고, 잎이 초록색이며, 줄기에 잎, 꽃, 열매가 달립니다. 또한 필요한 양분을 스스로 만듭니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄. 07번 해설은 정답지 1쪽 왼쪽 끝('07. ⑤')에서 오른쪽 단 위로 이어짐."
    }
  },
  {
    "id": "s31-u03-o4-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 8,
      "page": 2,
      "sourceId": "sci-31-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "풀과 나무의 비교",
      "concept": "나무는 풀보다 키가 크고 줄기가 굵다."
    },
    "prompt": "다음 ㉠, ㉡에 들어갈 알맞은 말을 골라 쓰시오.",
    "givens": {
      "지문": "나무는 풀보다 키가 ㉠ ( 크, 작 )고, 줄기가 ㉡ ( 가늘, 굵습 )니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 크, ㉡ 굵습",
      "accepted": [
        "㉠ 크, ㉡ 굵습",
        "㉠-크, ㉡-굵습",
        "크, 굵습",
        "㉠ 크 ㉡ 굵습",
        "크 굵습",
        "크다, 굵다"
      ]
    },
    "explanation": "들이나 산에 사는 식물은 풀과 나무로 구분할 수 있습니다. 나무는 풀보다 키가 크고, 줄기가 굵습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란은 '㉠ (      ), ㉡ (      )' 형태."
    }
  },
  {
    "id": "s31-u03-o4-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 9,
      "page": 2,
      "sourceId": "sci-31-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "부레옥잠이 물에 뜨는 까닭",
      "concept": "부레옥잠은 잎자루의 공기주머니 덕분에 물에 떠서 산다."
    },
    "prompt": "부레옥잠이 물에 떠서 살 수 있는 까닭으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "뿌리가 수염처럼 생겼기 때문이다.",
      "잎의 색깔이 초록색이기 때문이다.",
      "뿌리가 물속의 땅에 있기 때문이다.",
      "줄기가 좁고 긴 모양이기 때문이다.",
      "잎자루에 공기주머니가 있기 때문이다."
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
    "explanation": "부레옥잠은 잎자루에 있는 공기주머니 때문에 물에 떠서 살 수 있습니다.",
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
    "id": "s31-u03-o4-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 10,
      "page": 2,
      "sourceId": "sci-31-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "잎이 물 위로 높이 자라는 식물(연꽃)",
      "concept": "연꽃은 뿌리가 물속 땅에 있고 잎이 물 위로 높이 자라는 식물이며, 물에 떠서 사는 식물과 다르다."
    },
    "prompt": "연꽃에 대한 설명으로 알맞지 않은 것을 두 가지 고르시오.",
    "givens": null,
    "choices": [
      "잎이 물 위로 높이 자란다.",
      "키가 크고 줄기가 단단하다.",
      "뿌리는 물속이나 물가의 땅에 있다.",
      "수염 모양의 뿌리가 물속으로 뻗어 있다.",
      "공기주머니가 있고 잎이 넓어서 물에 쉽게 뜬다."
    ],
    "figure": "assets/bank/s31-u03/s4-q10.webp",
    "figureNote": "연못에 핀 분홍색 연꽃과 넓은 연잎 사진.",
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
    "explanation": "연꽃은 잎이 물 위로 높이 자라는 식물입니다. 잎이 물 위로 높이 자라는 식물은 뿌리가 물속이나 물가의 땅에 있고, 대부분 키가 크고 줄기가 단단합니다. 수염 모양의 뿌리가 물속으로 뻗어 있고, 공기주머니나 넓은 잎이 있어 물에 쉽게 뜨는 것은 물에 떠서 사는 식물의 특징입니다.",
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
    "id": "s31-u03-o4-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 11,
      "page": 2,
      "sourceId": "sci-31-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물속에 잠겨서 사는 식물",
      "concept": "물속에 잠겨서 사는 식물은 줄기가 가늘고 잎이 작아 물의 흐름에 따라 잘 휘어진다."
    },
    "prompt": "다음과 같은 특징이 있는 식물끼리 짝 지은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 줄기가 가늘고 잎이 작습니다.\n• 뿌리는 물속의 땅에 있습니다.\n• 줄기와 잎이 물의 흐름에 따라 잘 휘어집니다."
    },
    "choices": [
      "수련, 가래, 마름",
      "연꽃, 부들, 갈대",
      "창포, 나사말, 생이가래",
      "물수세미, 검정말, 붕어마름",
      "개구리밥, 물상추, 물질경이"
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
    "explanation": "물속에 잠겨서 사는 식물의 특징입니다. 물속에 잠겨서 사는 식물에는 물수세미, 나사말, 검정말, 물질경이, 붕어마름 등이 있습니다.",
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
    "id": "s31-u03-o4-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 12,
      "page": 2,
      "sourceId": "sci-31-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "알로에 잎의 속 모습",
      "concept": "알로에는 두꺼운 잎 속에 물을 저장한다."
    },
    "prompt": "다음은 알로에 잎의 속 모습을 관찰한 결과입니다. 이를 통해 알 수 있는 것은 무엇입니까?",
    "givens": {
      "지문": "• 잎 안쪽에 투명한 젤리 같은 것이 있습니다.\n• 잎의 단면을 만져 보면 물기가 많아 촉촉하고 미끌미끌합니다."
    },
    "choices": [
      "알로에 잎은 껍질이 얇다.",
      "알로에는 잎이 가시 모양이다.",
      "알로에는 잎에 물을 저장하고 있다.",
      "알로에는 잎에 지방을 저장하고 있다.",
      "알로에 잎에는 공기주머니가 많이 있다."
    ],
    "figure": "assets/bank/s31-u03/s4-q12.webp",
    "figureNote": "잘라 낸 알로에 잎 단면 사진(안쪽에 투명한 젤리 같은 부분).",
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
    "explanation": "알로에 잎의 속 모습을 관찰한 결과를 통해 알로에는 두꺼운 잎에 물을 저장하고 있음을 알 수 있습니다.",
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
    "id": "s31-u03-o4-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 13,
      "page": 3,
      "sourceId": "sci-31-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "선인장의 특징",
      "concept": "선인장은 굵은 줄기에 물을 저장하고 가시 모양 잎으로 물이 빠져나가는 것을 막는다."
    },
    "prompt": "다음은 선인장의 특징입니다. 빈칸에 공통으로 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "• 굵은 줄기에 □을/를 저장합니다.\n• 잎이 가시 모양이어서 □이/가 밖으로 빠져나가는 것을 막을 수 있습니다."
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
    "explanation": "선인장은 굵은 줄기에 물을 저장하며, 잎이 가시 모양이어서 동물이 함부로 먹지 못하고, 물이 밖으로 빠져나가는 것을 막을 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 인쇄본에서 빈 네모 상자로, '□'로 옮겨 적음. 둘째 줄은 '빠져' / '나가는'으로 줄바꿈됨."
    }
  },
  {
    "id": "s31-u03-o4-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 14,
      "page": 3,
      "sourceId": "sci-31-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "사막에 사는 식물",
      "concept": "사막처럼 건조하고 일교차가 큰 곳에는 용설란, 바오바브나무 같은 식물이 산다."
    },
    "prompt": "다음과 같은 환경에 주로 사는 식물을 두 가지 고르시오.",
    "givens": {
      "지문": "비가 거의 내리지 않아 건조하고 낮과 밤의 온도 차이가 큽니다."
    },
    "choices": [
      "용설란",
      "무궁화",
      "회양목",
      "닭의장풀",
      "바오바브나무"
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
    "explanation": "비가 거의 내리지 않아 건조하고 낮과 밤의 온도 차이가 큰 곳은 사막입니다. 사막에 주로 사는 식물은 용설란과 바오바브나무입니다.",
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
    "id": "s31-u03-o4-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 15,
      "page": 3,
      "sourceId": "sci-31-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "눈잣나무가 옆으로 자라는 까닭",
      "concept": "높은 산꼭대기의 눈잣나무는 강한 바람을 견디기 위해 땅에 붙듯 옆으로 자란다."
    },
    "prompt": "눈잣나무가 높은 산의 산꼭대기에서 옆으로 자라는 까닭을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s31-u03/s4-q15.webp",
    "figureNote": "바위 산꼭대기에서 줄기가 옆으로 누운 듯 뻗어 자란 눈잣나무 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "높은 산의 강한 바람을 견디기 위해서이다.",
      "rubric": {
        "required": [
          "높은 산은 바람이 강하게 분다",
          "그 바람을 견디기 위해서이다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "강한 바람을 견디기 위해서라는 내용이 포함되어 있으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "눈잣나무는 높은 산의 산꼭대기에서는 강한 바람을 견디기 위해 옆으로 자랍니다.\n[채점 기준] 강한 바람을 견디기 위해서라는 내용이 포함되어 있으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준표는 정답지 2쪽 위에 있으며 비율이 인쇄되어 있지 않아 '100%'로 둠. 답란은 밑줄 두 줄."
    }
  },
  {
    "id": "s31-u03-o4-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 16,
      "page": 3,
      "sourceId": "sci-31-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "높은 산에 사는 식물",
      "concept": "높은 산에 사는 암매와 한라솜다리는 키가 작고 줄기가 모여 자라 강한 바람에도 잘 자란다."
    },
    "prompt": "다음과 같은 특징을 가진 식물끼리 짝 지은 것은 어느 것입니까?",
    "givens": {
      "지문": "키가 작고, 여러 개의 줄기가 함께 모여 자랍니다."
    },
    "choices": [
      "암매, 무궁화",
      "갈대, 개구리밥",
      "암매, 한라솜다리",
      "은행나무, 통보리사초",
      "한라솜다리, 통보리사초"
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
    "explanation": "높은 산에 사는 식물인 암매와 한라솜다리는 키가 작고, 여러 개의 줄기가 함께 모여 자라 바람이 강하게 불어도 잘 자랍니다.",
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
    "id": "s31-u03-o4-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 17,
      "page": 3,
      "sourceId": "sci-31-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "퉁퉁마디의 특징",
      "concept": "퉁퉁마디는 갯벌에서 자라며 통통한 줄기에 물을 저장한다."
    },
    "prompt": "다음은 퉁퉁마디의 모습입니다. <보기>에서 퉁퉁마디의 특징으로 알맞은 것을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 갯벌에서 주로 자란다.",
        "㉡ 열매가 보리와 비슷한 모양이다.",
        "㉢ 줄기가 통통하여 물을 저장할 수 있다."
      ]
    },
    "choices": [
      "㉢",
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉢",
      "㉠, ㉡, ㉢"
    ],
    "figure": "assets/bank/s31-u03/s4-q17.webp",
    "figureNote": "바닷가 갯벌에서 자라는 마디가 많은 원통 모양 줄기의 퉁퉁마디 그림.",
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
    "explanation": "퉁퉁마디는 갯벌에서 주로 자라고, 줄기가 통통하여 물을 저장할 수 있습니다. 또한 마디가 많고 원통 모양입니다.",
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
    "id": "s31-u03-o4-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 18,
      "page": 4,
      "sourceId": "sci-31-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "장미 가시를 모방한 생활용품",
      "concept": "장미 줄기의 가시가 몸을 보호하는 특징을 본떠 철조망을 만들었다."
    },
    "prompt": "장미의 줄기에 있는 가시의 특징을 이용해 만든 생활용품은 무엇입니까?",
    "givens": null,
    "choices": [
      "철조망",
      "낙하산",
      "설거지용 수세미",
      "헬리콥터 프로펠러",
      "빗물을 모으는 장치"
    ],
    "figure": "assets/bank/s31-u03/s4-q18.webp",
    "figureNote": "가시가 난 장미 줄기 확대 사진(뒤에 분홍 장미꽃).",
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
    "explanation": "장미의 줄기에 가시가 있어 몸을 보호하는 특징을 이용해 철조망을 만들었습니다.",
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
    "id": "s31-u03-o4-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 19,
      "page": 4,
      "sourceId": "sci-31-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "도꼬마리 열매를 모방한 찍찍이 테이프",
      "concept": "도꼬마리 열매의 갈고리 모양 가시가 잘 붙는 특징을 본떠 쉽게 붙였다 뗄 수 있는 찍찍이 테이프를 만들었다."
    },
    "prompt": "다음과 같이 도꼬마리 열매의 특징을 이용해 찍찍이 테이프를 만들었을 때의 좋은 점으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "가볍고 튼튼하다.",
      "빗물을 모을 수 있다.",
      "벌레를 잘 잡을 수 있다.",
      "쉽게 열고 닫을 수 있다.",
      "바람을 타고 멀리 날아갈 수 있다."
    ],
    "figure": "assets/bank/s31-u03/s4-q19.webp",
    "figureNote": "도꼬마리 열매 사진 → (아래 화살표) 찍찍이 테이프 확대 사진.",
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
    "explanation": "도꼬마리 열매가 뾰족한 갈고리 모양으로 생겨서 동물의 털이나 천 등에 잘 붙는 특징을 이용해 쉽게 열고 닫을 수 있는 찍찍이 테이프를 만들었습니다.",
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
    "id": "s31-u03-o4-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 20,
      "page": 4,
      "sourceId": "sci-31-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-1",
      "unit": "Ⅲ. 식물의 생활"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E6",
      "type": "T13",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "연잎의 특징과 생체 모방",
      "concept": "연잎은 물에 젖지 않는 특징이 있어 이를 본떠 물이 스며들지 않는 옷감을 만들었다."
    },
    "prompt": "연잎의 특징을 쓰고, 이를 이용한 예를 한 가지 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s31-u03/s4-q20.webp",
    "figureNote": "물방울이 맺힌 채 굴러다니는 연잎 확대 사진.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "연잎이 물에 젖지 않는 특징을 이용해 물이 스며들지 않는 옷감을 만들었다.",
      "rubric": {
        "required": [
          "연잎은 물에 젖지 않는다",
          "이를 이용해 물이 스며들지 않는 옷감을 만들었다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "연잎이 물에 젖지 않는 특징과 이를 이용한 예가 내용에 포함되어 있으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "연잎은 물에 젖지 않는 특징을 가지고 있습니다.\n[채점 기준] 연잎이 물에 젖지 않는 특징과 이를 이용한 예가 내용에 포함되어 있으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빠른 정답에서는 '스며' / '들지'로 줄바꿈되어 있고, 해설 쪽은 '스며들지'로 붙어 있음. 채점 기준표에 비율이 인쇄되어 있지 않아 '100%'로 둠. 답란은 밑줄 두 줄."
    }
  }
];
