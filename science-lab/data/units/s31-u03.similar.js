// 3-1 Ⅲ 식물의 생활 — 유사문항 80 (창작). 원문 1문항당 1개, 같은 유형·난이도로 상황과 물체를 바꿨다. of = 짝이 되는 원문 (세트, 번호).
export const similar = [
  {
    "id": "s31-u03-v001",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 1
      }
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
      "track": "교과"
    },
    "prompt": "다음과 같은 특징을 가진 식물로 알맞은 것을 고르세요.",
    "givens": {
      "지문": "• 그늘진 곳에서도 잘 자랍니다.\n• 잎이 좁고 길쭉하며, 보라색 꽃이 핍니다."
    },
    "choices": [
      "맥문동",
      "토끼풀",
      "회양목",
      "강아지풀",
      "단풍나무"
    ],
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
    "explanation": "그늘진 곳에서도 잘 자라고, 좁고 길쭉한 잎 사이로 보라색 꽃이 피는 식물은 맥문동이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v002",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 2
      }
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
      "track": "교과"
    },
    "prompt": "다음 빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "강아지풀은 꽃에 긴 [  ]이/가 달려 있어 강아지 꼬리와 모양이 비슷합니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "털",
      "accepted": [
        "털",
        "긴 털",
        "털이"
      ]
    },
    "explanation": "강아지풀은 꽃에 긴 털이 달려 있어서 강아지 꼬리처럼 보여요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v003",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 3
      }
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
      "track": "교과"
    },
    "prompt": "식물의 잎을 분류하는 기준으로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "잎의 끝이 둥근 모양인가?",
      "잎이 바늘처럼 가늘고 긴가?",
      "잎의 가장자리가 톱니 모양인가?",
      "잎 여러 개가 한곳에 붙어 있는가?",
      "잎의 색깔이 아름다운가?"
    ],
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
    "explanation": "'아름다운가?'는 사람마다 다르게 판단해서 분류 결과가 달라질 수 있으므로 분류 기준으로 알맞지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v004",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 4
      }
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
      "track": "교과"
    },
    "prompt": "<보기>의 식물 잎 중에서 잎의 가장자리가 톱니 모양인 것을 모두 고른 것을 고르세요.",
    "givens": {
      "보기": [
        "㉠ 토끼풀 잎",
        "㉡ 맥문동 잎",
        "㉢ 단풍나무 잎",
        "㉣ 소나무 잎"
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉣",
      "㉢, ㉣",
      "㉠, ㉢, ㉣"
    ],
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
    "explanation": "토끼풀 잎과 단풍나무 잎은 가장자리가 톱니 모양이고, 맥문동 잎과 소나무 잎은 가장자리가 매끈해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v005",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 5
      }
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
      "track": "교과"
    },
    "prompt": "<보기>의 잎을 다음 표와 같이 분류하였습니다. 분류 기준으로 알맞은 것을 고르세요.",
    "givens": {
      "보기": [
        "㉠ 토끼풀 잎",
        "㉡ 맥문동 잎",
        "㉢ 단풍나무 잎",
        "㉣ 소나무 잎"
      ],
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
      "잎이 귀엽게 생겼는가?",
      "잎의 끝 모양이 둥근가?",
      "잎 여러 개가 붙어 있는가?",
      "잎의 가장자리가 톱니 모양인가?",
      "잎의 전체적인 모양이 길쭉한가?"
    ],
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
    "explanation": "맥문동 잎과 소나무 잎은 전체 모양이 길쭉하고, 토끼풀 잎과 단풍나무 잎은 길쭉하지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v006",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 6
      }
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
      "track": "교과"
    },
    "prompt": "들이나 산에 사는 나무끼리 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "밤나무, 떡갈나무, 조팝나무",
      "명아주, 밤나무, 토끼풀",
      "강아지풀, 민들레, 명아주",
      "은행나무, 애기똥풀, 떡갈나무",
      "소나무, 강아지풀, 조팝나무"
    ],
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
    "explanation": "밤나무·떡갈나무·조팝나무는 줄기가 굵고 단단한 나무예요. 명아주·토끼풀·강아지풀·민들레·애기똥풀은 풀이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v007",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 7
      }
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
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 단풍나무에 대한 알맞은 설명을 모두 고른 것을 고르세요.",
    "givens": {
      "보기": [
        "㉠ 민들레보다 키가 크다.",
        "㉡ 강아지풀보다 줄기가 가늘다.",
        "㉢ 잎이 손바닥처럼 여러 갈래로 갈라져 있다.",
        "㉣ 뿌리, 줄기, 잎을 구분할 수 없다."
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉢",
      "㉡, ㉣",
      "㉢, ㉣"
    ],
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
    "explanation": "단풍나무는 나무라서 민들레보다 키가 크고, 잎이 손바닥처럼 여러 갈래로 갈라져 있어요. 강아지풀보다 줄기가 굵고, 뿌리·줄기·잎을 구분할 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v008",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 8
      }
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
      "track": "교과"
    },
    "prompt": "민들레와 밤나무의 공통점으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "꽃의 색깔이 모두 노란색이다.",
      "키가 모두 사람보다 훨씬 크다.",
      "땅에 뿌리를 내리지 않고 물에 떠서 산다.",
      "필요한 양분을 스스로 만들지 못한다.",
      "뿌리, 줄기, 잎을 구분할 수 있다."
    ],
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
    "explanation": "들이나 산에 사는 풀과 나무는 모두 뿌리·줄기·잎을 구분할 수 있고, 땅에 뿌리를 내리며 양분을 스스로 만들어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v009",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 9
      }
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
      "track": "교과"
    },
    "prompt": "부레옥잠의 볼록한 잎자루를 세로로 잘라 돋보기로 보았더니, 스펀지처럼 작은 방이 많이 있었습니다. 이 생김새가 부레옥잠이 사는 데 어떤 도움이 되는지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "잎자루 속 작은 방에 공기가 들어 있어서, 이 공기주머니 덕분에 부레옥잠이 물에 떠서 살 수 있어요.",
      "rubric": {
        "required": [
          "잎자루 속 작은 방에 공기가 들어 있다",
          "그 공기 덕분에 물에 떠서 살 수 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "잎자루의 작은 방에 공기가 들어 있어 공기주머니 구실을 하고, 그래서 부레옥잠이 물에 떠서 살 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v010",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 10
      }
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
      "track": "교과"
    },
    "prompt": "강이나 연못에 사는 식물 중 뿌리가 땅에 닿지 않고 물에 떠서 사는 식물을 고르세요.",
    "givens": null,
    "choices": [
      "개구리밥",
      "연꽃",
      "부들",
      "갈대",
      "검정말"
    ],
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
    "explanation": "개구리밥은 뿌리가 물속으로 뻗어 있고 물에 떠서 살아요. 연꽃·부들·갈대는 잎이 물 위로 높이 자라고, 검정말은 물속에 잠겨서 살아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v011",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 11
      }
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
      "track": "교과"
    },
    "prompt": "다음과 같은 특징을 가진 식물로 알맞지 않은 것을 고르세요.",
    "givens": {
      "지문": "• 잎이 물 위로 높이 자랍니다.\n• 뿌리는 물속이나 물가의 땅에 있습니다.\n• 대부분 키가 크고 줄기가 단단합니다."
    },
    "choices": [
      "연꽃",
      "부들",
      "물상추",
      "갈대",
      "창포"
    ],
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
    "explanation": "물상추는 물에 떠서 사는 식물이에요. 연꽃·부들·갈대·창포는 잎이 물 위로 높이 자라고 뿌리가 물속이나 물가의 땅에 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v012",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 12
      }
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
      "track": "교과"
    },
    "prompt": "선인장의 생김새를 관찰한 결과로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "줄기가 굵고 통통하다.",
      "잎이 뾰족한 가시 모양이다.",
      "줄기의 겉이 대부분 초록색이다.",
      "넓고 얇은 잎이 많이 달려 있다.",
      "줄기를 자르면 속에 물기가 많다."
    ],
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
    "explanation": "선인장은 잎이 가시 모양이고 굵은 줄기에 물을 저장해요. 넓고 얇은 잎은 선인장의 생김새가 아니에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v013",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 13
      }
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
      "track": "교과"
    },
    "prompt": "용설란이나 리돕스처럼 사막에 사는 식물이 비가 거의 오지 않는 곳에서도 살아갈 수 있는 까닭을 생김새와 관련지어 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "두꺼운 잎에 물을 저장해 두기 때문에 비가 거의 오지 않는 건조한 곳에서도 살 수 있어요.",
      "rubric": {
        "required": [
          "두꺼운 잎(굵은 줄기)에 물을 저장한다",
          "그래서 건조한 곳에서도 살 수 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "사막 식물은 두꺼운 잎이나 굵은 줄기에 물을 저장해서, 비가 거의 오지 않는 건조한 환경에서도 살 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v014",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 14
      }
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
      "track": "교과"
    },
    "prompt": "다음 환경에 주로 사는 식물을 두 가지 고르세요. (정답 2개)",
    "givens": {
      "지문": "• 한 해 동안 비가 아주 조금 내려 땅이 메말라 있습니다.\n• 낮에는 매우 덥고 밤에는 쌀쌀합니다."
    },
    "choices": [
      "부들",
      "용설란",
      "연꽃",
      "리돕스",
      "맥문동"
    ],
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
    "explanation": "비가 거의 내리지 않고 낮과 밤의 온도 차이가 큰 곳은 사막이에요. 용설란과 리돕스는 두꺼운 잎에 물을 저장해 사막에서 살아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v015",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 15
      }
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
      "track": "교과"
    },
    "prompt": "다음 <보기>의 식물을 사는 곳에 따라 (높은 산 / 바닷가나 갯벌)로 알맞게 분류한 것을 고르세요.",
    "givens": {
      "보기": [
        "㉠ 암매",
        "㉡ 퉁퉁마디",
        "㉢ 한라솜다리",
        "㉣ 갯메꽃"
      ]
    },
    "choices": [
      "㉠, ㉡ / ㉢, ㉣",
      "㉠, ㉢ / ㉡, ㉣",
      "㉡, ㉢ / ㉠, ㉣",
      "㉡, ㉣ / ㉠, ㉢",
      "㉢, ㉣ / ㉠, ㉡"
    ],
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
    "explanation": "암매와 한라솜다리는 높은 산에, 퉁퉁마디와 갯메꽃은 바닷가나 갯벌에 살아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v016",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 16
      }
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
      "track": "교과"
    },
    "prompt": "다음은 통보리사초에 대한 설명입니다. 빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 바닷가 모래밭에서 자랍니다.\n• 땅에 [  ]을/를 깊게 내려 강한 바람에도 잘 견딥니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "뿌리",
      "accepted": [
        "뿌리"
      ]
    },
    "explanation": "통보리사초는 바닷가 모래밭에서 땅에 뿌리를 깊게 내리고, 줄기가 땅속에서 옆으로 길게 뻗어 강한 바람에도 잘 견뎌요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v017",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 17
      }
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
      "track": "교과"
    },
    "prompt": "한라솜다리가 주로 사는 환경에 대한 설명으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "비가 거의 내리지 않아 메마릅니다.",
      "물이 고여 있어 뿌리가 물에 잠깁니다.",
      "소금 성분이 많은 바닷물이 드나듭니다.",
      "큰 나무가 많아 햇빛이 거의 들지 않습니다.",
      "기온이 낮고 바람이 강하게 붑니다."
    ],
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
    "explanation": "한라솜다리는 높은 산에 살아요. 높은 산은 기온이 낮고 바람이 강하게 불어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v018",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 18
      }
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
      "track": "교과"
    },
    "prompt": "단풍나무 열매와 드론의 날개의 공통점으로 알맞은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "㉠ 끈끈해서 먼지가 잘 달라붙는다.",
        "㉡ 날개가 빙글빙글 돌면서 공중에서 움직인다.",
        "㉢ 뾰족한 가시가 있어 몸을 보호한다."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ",
        "날개가 빙글빙글 돌면서 공중에서 움직인다."
      ]
    },
    "explanation": "단풍나무 열매는 날개가 있어 빙글빙글 돌며 천천히 떨어지는데, 이 특징을 본떠 드론의 날개를 만들었어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v019",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 19
      }
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
      "track": "교과"
    },
    "prompt": "철조망을 만들 때 이용한 식물의 특징으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "장미 줄기에 가시가 있어 몸을 보호하는 특징",
      "연잎이 물에 젖지 않고 물방울이 굴러가는 특징",
      "민들레 씨가 솜털을 펴고 바람을 타고 날아가는 특징",
      "도꼬마리 열매의 가시가 동물의 털에 잘 붙는 특징",
      "끈끈이주걱의 끈끈한 털에 작은 벌레가 붙는 특징"
    ],
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
    "explanation": "철조망은 장미 줄기의 가시처럼 뾰족한 가시를 달아 사람이나 동물이 함부로 넘어오지 못하게 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v020",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 20
      }
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
      "track": "교과"
    },
    "prompt": "도꼬마리 열매의 특징을 이용해 만든 것을 고르세요.",
    "givens": null,
    "choices": [
      "찍찍이 테이프",
      "낙하산",
      "철조망",
      "드론의 날개",
      "물에 젖지 않는 옷감"
    ],
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
    "explanation": "도꼬마리 열매의 갈고리 같은 가시가 털이나 옷에 잘 붙는 특징을 이용해 찍찍이 테이프를 만들었어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v021",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 1
      }
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
      "track": "교과"
    },
    "prompt": "우리 주변에서 사는 식물에 대한 설명으로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "식물마다 잎의 모양과 크기가 다르다.",
      "공원에 사는 식물은 모두 생김새가 똑같다.",
      "길가나 화단에서도 여러 가지 식물을 볼 수 있다.",
      "보도블록 틈처럼 좁은 곳에서 자라는 식물도 있다.",
      "같은 곳에 사는 식물이라도 꽃의 색깔은 다를 수 있다."
    ],
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
    "explanation": "우리 주변의 식물은 종류에 따라 잎·꽃·줄기의 생김새가 서로 달라요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v022",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 2
      }
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
      "track": "교과"
    },
    "prompt": "다음과 같은 특징을 가진 식물을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "• 잎이 손바닥처럼 여러 갈래로 갈라져 있습니다.\n• 잎의 가장자리가 톱니 모양입니다.\n• 가을에 잎이 빨간색으로 변합니다.",
      "보기": [
        "㉠ 은행나무",
        "㉡ 단풍나무",
        "㉢ 강아지풀",
        "㉣ 회양목"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ",
        "단풍나무"
      ]
    },
    "explanation": "잎이 손바닥처럼 여러 갈래로 갈라지고 가장자리가 톱니 모양이며, 가을에 빨갛게 물드는 나무는 단풍나무예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v023",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 3
      }
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
      "track": "교과"
    },
    "prompt": "다음에서 설명하는 잎의 부분의 이름을 쓰세요.",
    "givens": {
      "지문": "잎몸과 줄기 사이를 이어 주는 자루 부분으로, 잎몸을 받쳐 줍니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "잎자루",
      "accepted": [
        "잎자루"
      ]
    },
    "explanation": "잎몸과 줄기를 이어 주는 자루 부분을 잎자루라고 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v024",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 4
      }
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
      "track": "교과"
    },
    "prompt": "단풍나무의 잎에 대한 설명으로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "잎자루가 있다.",
      "잎의 가장자리가 톱니 모양이다.",
      "작은 잎 세 장이 잎자루 끝에 붙어 있다.",
      "잎이 손바닥처럼 여러 갈래로 갈라져 있다.",
      "가을이 되면 잎의 색깔이 빨갛게 변한다."
    ],
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
    "explanation": "작은 잎 세 장이 잎자루 끝에 붙어 있는 것은 토끼풀 잎이에요. 단풍나무 잎은 한 장이 여러 갈래로 갈라져 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v025",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 5
      }
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
      "track": "교과"
    },
    "prompt": "다음은 '잎의 끝이 둥근 모양인가?'의 기준으로 식물의 잎을 분류한 결과입니다. 잘못 분류한 것을 골라 이름을 쓰세요.",
    "givens": {
      "표": {
        "그렇다.": [
          "토끼풀, 강아지풀"
        ],
        "그렇지 않다.": [
          "단풍나무, 소나무"
        ]
      }
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "강아지풀",
      "accepted": [
        "강아지풀"
      ]
    },
    "explanation": "강아지풀 잎은 길쭉하고 끝이 뾰족해서 '그렇지 않다.'에 들어가야 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v026",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 6
      }
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
      "track": "교과"
    },
    "prompt": "다음과 같은 특징을 가진 식물을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[들이나 산에 사는 식물]\n• 노란색 꽃이 핍니다.\n• 줄기를 자르면 노란색 즙이 나옵니다.\n• 키가 작은 풀입니다.",
      "보기": [
        "㉠ 밤나무",
        "㉡ 애기똥풀",
        "㉢ 조팝나무",
        "㉣ 떡갈나무"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ",
        "애기똥풀"
      ]
    },
    "explanation": "노란색 꽃이 피고 줄기를 자르면 노란색 즙이 나오는 들풀은 애기똥풀이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v027",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 7
      }
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
      "track": "교과"
    },
    "prompt": "<보기>의 식물을 (풀 / 나무)로 알맞게 분류한 것을 고르세요.",
    "givens": {
      "보기": [
        "㉠ 조팝나무",
        "㉡ 민들레",
        "㉢ 애기똥풀",
        "㉣ 은행나무"
      ]
    },
    "choices": [
      "㉠, ㉡ / ㉢, ㉣",
      "㉠, ㉣ / ㉡, ㉢",
      "㉡, ㉢ / ㉠, ㉣",
      "㉡, ㉣ / ㉠, ㉢",
      "㉡, ㉢, ㉣ / ㉠"
    ],
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
    "explanation": "민들레와 애기똥풀은 키가 작고 줄기가 가는 풀이고, 조팝나무와 은행나무는 줄기가 굵고 단단한 나무예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v028",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 8
      }
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
      "track": "교과"
    },
    "prompt": "강아지풀과 소나무를 비교하였습니다. 두 식물의 공통점을 두 가지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "뿌리, 줄기, 잎을 구분할 수 있어요. 필요한 양분을 스스로 만들어요.",
      "rubric": {
        "required": [
          "공통점 하나(뿌리·줄기·잎 구분, 땅에 뿌리를 내림, 잎이 초록색, 양분을 스스로 만듦 중)",
          "공통점 둘(위의 것 중 다른 하나)"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "강아지풀(풀)과 소나무(나무)는 뿌리·줄기·잎을 구분할 수 있고, 땅에 뿌리를 내리며, 잎이 초록색이고, 양분을 스스로 만든다는 점이 같아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v029",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 9
      }
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
      "track": "교과"
    },
    "prompt": "다음은 부레옥잠의 생김새입니다. ㉠, ㉡에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "부레옥잠은 볼록한 [㉠] 속에 공기가 들어 있어 물에 뜨고, 수염처럼 생긴 [㉡]은/는 물속으로 뻗어 있습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 잎자루, ㉡ 뿌리",
      "accepted": [
        "㉠ 잎자루, ㉡ 뿌리",
        "㉠ 잎자루 ㉡ 뿌리",
        "잎자루, 뿌리",
        "잎자루 뿌리",
        "ㄱ 잎자루, ㄴ 뿌리"
      ]
    },
    "explanation": "부레옥잠은 볼록한 잎자루 속 공기주머니 덕분에 물에 뜨고, 수염처럼 생긴 뿌리는 물속으로 뻗어 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v030",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 10
      }
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
      "track": "교과"
    },
    "prompt": "강이나 연못에 사는 식물 중 물속에 잠겨서 사는 식물끼리 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "연꽃, 부들",
      "수련, 마름",
      "개구리밥, 물상추",
      "검정말, 나사말",
      "부레옥잠, 갈대"
    ],
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
    "explanation": "검정말과 나사말은 줄기와 잎이 물속에 잠겨서 살아요. 연꽃·부들·갈대는 물 위로 높이 자라고, 개구리밥·물상추·부레옥잠은 물에 떠서 살아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v031",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 11
      }
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
      "track": "교과"
    },
    "prompt": "개구리밥, 물상추, 부레옥잠의 공통적인 특징을 <보기>에서 모두 고른 것을 고르세요.",
    "givens": {
      "보기": [
        "㉠ 뿌리가 물속의 땅에 단단히 박혀 있다.",
        "㉡ 물에 떠서 산다.",
        "㉢ 키가 크고 줄기가 단단하다.",
        "㉣ 뿌리가 물속으로 뻗어 있다."
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉢",
      "㉡, ㉣",
      "㉢, ㉣"
    ],
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
    "explanation": "개구리밥·물상추·부레옥잠은 물에 떠서 살고, 뿌리가 땅에 닿지 않고 물속으로 뻗어 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v032",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 12
      }
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
      "track": "교과"
    },
    "prompt": "다음과 같은 환경에 주로 사는 식물로 알맞은 것을 고르세요.",
    "givens": {
      "지문": "• 일 년 내내 비가 아주 적게 내려 땅이 메마릅니다.\n• 낮에는 뜨겁고 밤에는 쌀쌀합니다."
    },
    "choices": [
      "수련",
      "명아주",
      "강아지풀",
      "눈잣나무",
      "바오바브나무"
    ],
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
    "explanation": "비가 아주 적고 낮과 밤의 온도 차이가 큰 곳은 사막이에요. 바오바브나무는 굵은 줄기에 물을 저장해 사막에서 살아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v033",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 13
      }
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
      "track": "교과"
    },
    "prompt": "선인장이 사막에서 살 수 있는 까닭을 줄기와 관련지어 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "선인장은 굵은 줄기에 물을 저장하기 때문에 비가 거의 오지 않는 사막에서도 살 수 있어요.",
      "rubric": {
        "required": [
          "굵은 줄기에 물을 저장한다",
          "그래서 비가 거의 오지 않는 건조한 곳에서 살 수 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "선인장은 굵은 줄기에 물을 저장해 두기 때문에, 비가 거의 오지 않는 건조한 사막에서도 살 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v034",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 14
      }
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
      "track": "교과"
    },
    "prompt": "알로에에 대한 설명으로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "잎자루에 공기주머니가 있어서 물에 뜬다.",
      "잎이 두껍고 길쭉하다.",
      "잎의 가장자리에 가시가 있다.",
      "잎에 물을 저장해 건조한 곳에서 산다.",
      "잎을 자르면 안쪽에 투명한 젤리 같은 것이 있다."
    ],
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
    "explanation": "알로에는 두꺼운 잎에 물을 저장하는 사막 식물이에요. 잎자루의 공기주머니로 물에 뜨는 것은 부레옥잠이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v035",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 15
      }
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
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 주로 높은 산에 사는 식물을 모두 고른 것을 고르세요.",
    "givens": {
      "보기": [
        "㉠ 갯메꽃",
        "㉡ 눈잣나무",
        "㉢ 리돕스",
        "㉣ 한라솜다리"
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉢",
      "㉡, ㉣",
      "㉢, ㉣"
    ],
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
    "explanation": "눈잣나무와 한라솜다리는 높은 산에 살아요. 갯메꽃은 바닷가에, 리돕스는 사막에 살아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v036",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 16
      }
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
      "track": "교과"
    },
    "prompt": "다음은 눈잣나무에 대한 설명입니다. ㉠, ㉡에 들어갈 알맞은 말을 골라 쓰세요.",
    "givens": {
      "지문": "눈잣나무는 높은 산의 꼭대기에서 줄기가 ㉠ ( 위, 옆 )으로 자라 강한 ㉡ ( 바람, 비 )을/를 견딥니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 옆, ㉡ 바람",
      "accepted": [
        "㉠ 옆, ㉡ 바람",
        "㉠ 옆 ㉡ 바람",
        "옆, 바람",
        "옆 바람",
        "ㄱ 옆, ㄴ 바람"
      ]
    },
    "explanation": "눈잣나무는 높은 산 꼭대기에서 줄기가 옆으로 누워 자라서 강한 바람을 견뎌요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v037",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 17
      }
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
      "track": "교과"
    },
    "prompt": "퉁퉁마디에 대한 설명으로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "갯벌에서 주로 자란다.",
      "키가 크고 줄기가 굵고 단단한 나무이다.",
      "줄기에 마디가 여러 개 있다.",
      "줄기가 통통하여 물을 저장할 수 있다.",
      "소금 성분이 많은 곳에서도 잘 자란다."
    ],
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
    "explanation": "퉁퉁마디는 갯벌에서 자라는 키가 작은 풀이고, 통통한 줄기에 물을 저장해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v038",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 18
      }
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
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 단풍나무 열매의 특징을 이용한 예로 알맞은 것을 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "㉠ 찍찍이 테이프",
        "㉡ 헬리콥터 프로펠러",
        "㉢ 철조망"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ",
        "헬리콥터 프로펠러"
      ]
    },
    "explanation": "단풍나무 열매는 날개가 있어 빙글빙글 돌며 날아가요. 이 특징을 이용해 헬리콥터 프로펠러를 만들었어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v039",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 19
      }
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
      "track": "교과"
    },
    "prompt": "연잎과 물에 젖지 않는 옷감의 공통적인 특징으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "갈고리 같은 가시가 있어 천에 잘 붙는다.",
      "날개가 있어 빙글빙글 돌며 천천히 떨어진다.",
      "물방울이 스며들지 않고 굴러떨어진다.",
      "끈끈한 털이 있어 작은 먼지가 잘 달라붙는다.",
      "뾰족한 가시가 있어 다른 동물로부터 몸을 지킨다."
    ],
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
    "explanation": "연잎은 물에 젖지 않아 물방울이 동그랗게 굴러떨어져요. 이 특징을 이용해 물에 젖지 않는 옷감을 만들었어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v040",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 20
      }
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
      "track": "교과"
    },
    "prompt": "다음은 식물의 특징을 이용하여 만든 생활용품입니다. 이 생활용품에 이용한 식물의 특징으로 알맞은 것을 고르세요.",
    "givens": {
      "지문": "(생활용품 설명) 두 장의 띠를 맞대어 누르면 한쪽 띠의 작은 갈고리가 다른 쪽 띠의 고리에 걸려 붙고, 잡아당기면 쉽게 떨어집니다."
    },
    "choices": [
      "물에 젖지 않는 연잎",
      "날개가 달려 빙글빙글 도는 단풍나무 열매",
      "솜털을 펴고 바람을 타고 날아가는 민들레 씨",
      "갈고리 같은 가시가 털에 잘 붙는 도꼬마리 열매",
      "가시가 있어 몸을 보호하는 장미의 줄기"
    ],
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
    "explanation": "작은 갈고리가 고리에 걸려 붙는 찍찍이 테이프는 도꼬마리 열매의 갈고리 같은 가시가 털에 잘 붙는 특징을 이용했어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v041",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 1
      }
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
      "track": "교과"
    },
    "prompt": "토끼풀에 대한 설명으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "잎이 바늘처럼 가늘고 길다.",
      "키가 크고 줄기가 굵고 단단하다.",
      "가을이 되면 잎이 노란색으로 변한다.",
      "꽃에 긴 털이 달려 강아지 꼬리처럼 보인다.",
      "줄기가 땅 위를 기듯이 옆으로 뻗는다."
    ],
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
    "explanation": "토끼풀은 줄기가 땅 위를 기듯이 옆으로 뻗고, 작은 잎 세 장이 잎자루 끝에 붙어 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v042",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 2
      }
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
      "track": "교과"
    },
    "prompt": "다음 빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 강아지풀은 □이/가 가늘고 곧게 자랍니다.\n• 은행나무는 □이/가 굵고 키가 큽니다."
    },
    "choices": null,
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
    "explanation": "강아지풀은 줄기가 가늘고 곧게 자라고, 은행나무는 줄기가 굵고 키가 커요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v043",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 3
      }
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
      "track": "교과"
    },
    "prompt": "'잎이 멋있게 생겼는가?'는 식물의 잎을 분류하는 기준으로 알맞지 않습니다. 그 까닭을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "멋있다고 느끼는 것은 사람마다 달라서, 누가 분류하느냐에 따라 분류 결과가 달라지기 때문이에요.",
      "rubric": {
        "required": [
          "멋있다고 느끼는 것은 사람마다 다르다",
          "그래서 분류 결과가 달라질 수 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "'멋있다'는 사람마다 다르게 느끼므로, 분류하는 사람에 따라 분류 결과가 달라져 분류 기준으로 알맞지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v044",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 4
      }
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
      "track": "교과"
    },
    "prompt": "다음과 같이 식물의 잎을 분류할 수 있는 분류 기준으로 알맞은 것을 고르세요.",
    "givens": {
      "표": {
        "그렇다.": [
          "단풍나무 잎, 토끼풀 잎"
        ],
        "그렇지 않다.": [
          "강아지풀 잎, 소나무 잎"
        ]
      }
    },
    "choices": [
      "잎의 가장자리가 톱니 모양인가?",
      "잎이 예쁘게 생겼는가?",
      "잎의 끝 모양이 둥근가?",
      "잎 여러 개가 붙어 있는가?",
      "잎의 전체적인 모양이 길쭉한가?"
    ],
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
    "explanation": "단풍나무 잎과 토끼풀 잎은 가장자리가 톱니 모양이고, 강아지풀 잎과 소나무 잎은 가장자리가 매끈해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v045",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 5
      }
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
      "track": "교과"
    },
    "prompt": "다음 <보기>를 '잎 여러 개가 붙어 있는가?'의 기준으로 분류할 때 '그렇다'에 해당하는 것을 모두 고른 것을 고르세요.",
    "givens": {
      "보기": [
        "㉠ 강아지풀 잎",
        "㉡ 토끼풀 잎",
        "㉢ 소나무 잎",
        "㉣ 단풍나무 잎"
      ]
    },
    "choices": [
      "㉡",
      "㉢",
      "㉡, ㉢",
      "㉠, ㉣",
      "㉡, ㉢, ㉣"
    ],
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
    "explanation": "토끼풀은 작은 잎 세 장이, 소나무는 바늘 모양 잎 여러 개가 붙어 있어요. 강아지풀과 단풍나무는 잎이 한 장씩 따로 나요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v046",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 6
      }
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
      "track": "교과"
    },
    "prompt": "식물이 사는 환경에 대한 설명으로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "부들은 물가에서 산다.",
      "선인장은 물이 많은 연못에서 산다.",
      "퉁퉁마디는 갯벌에서 산다.",
      "눈잣나무는 높은 산에서 산다.",
      "맥문동은 그늘진 곳에서도 잘 자란다."
    ],
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
    "explanation": "선인장은 비가 거의 내리지 않는 건조한 사막에서 살아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v047",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 7
      }
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
      "track": "교과"
    },
    "prompt": "풀과 나무의 차이점에 대해 바르게 말한 사람의 이름을 쓰세요.",
    "givens": {
      "지문": "• 하랑: 나무는 풀보다 키가 작습니다.\n• 소율: 풀은 나무보다 줄기가 가늡니다.\n• 도윤: 풀은 뿌리가 있고, 나무는 뿌리가 없습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "소율",
      "accepted": [
        "소율"
      ]
    },
    "explanation": "풀은 나무보다 줄기가 가늘고 키가 작아요. 풀과 나무 모두 뿌리가 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v048",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 8
      }
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
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 애기똥풀에 대한 알맞은 설명을 모두 고른 것을 고르세요.",
    "givens": {
      "보기": [
        "㉠ 노란색 꽃이 핀다.",
        "㉡ 땅에 뿌리를 내리지 않고 물에 떠서 산다.",
        "㉢ 잎이 초록색이고 필요한 양분을 스스로 만든다.",
        "㉣ 키가 크고 줄기가 굵은 나무이다."
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉢",
      "㉡, ㉣",
      "㉢, ㉣"
    ],
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
    "explanation": "애기똥풀은 노란색 꽃이 피는 풀이고, 잎이 초록색이며 양분을 스스로 만들어요. 땅에 뿌리를 내리고 키가 작아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v049",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 9
      }
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
      "track": "교과"
    },
    "prompt": "부레옥잠의 잎자루를 관찰한 결과로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "잎자루가 볼록하게 부풀어 있다.",
      "잎자루를 만지면 말랑말랑하다.",
      "잎자루 속이 물로 꽉 차 있어 무겁다.",
      "잎자루를 자른 면에 작은 구멍이 많다.",
      "물속에서 잎자루를 누르면 공기 방울이 나온다."
    ],
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
    "explanation": "부레옥잠의 잎자루 속에는 공기가 든 작은 방이 많아요. 그래서 누르면 공기 방울이 나오고 물에 잘 떠요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v050",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 10
      }
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
      "track": "교과"
    },
    "prompt": "연꽃, 부들, 갈대의 공통적인 특징으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "줄기와 잎이 모두 물속에 잠겨서 산다.",
      "뿌리가 땅에 닿지 않고 물속으로 뻗어 있다.",
      "잎자루에 공기주머니가 있어 물에 쉽게 뜬다.",
      "잎이 물 위로 높이 자라고 줄기가 단단하다.",
      "줄기가 가늘어 물의 흐름에 따라 잘 휘어진다."
    ],
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
    "explanation": "연꽃·부들·갈대는 뿌리가 물속이나 물가의 땅에 있고, 잎이 물 위로 높이 자라며 대부분 키가 크고 줄기가 단단해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v051",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 11
      }
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
      "track": "교과"
    },
    "prompt": "다음과 같은 특징을 가진 식물로 알맞은 것을 고르세요.",
    "givens": {
      "지문": "• 작은 잎이 물 위에 떠 있습니다.\n• 뿌리는 땅에 닿지 않고 물속으로 뻗어 있습니다.\n• 몸집이 아주 작아 연못 물 위를 뒤덮듯이 자랍니다."
    },
    "choices": [
      "갈대",
      "연꽃",
      "검정말",
      "붕어마름",
      "개구리밥"
    ],
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
    "explanation": "개구리밥은 작은 잎이 물 위에 떠 있고, 뿌리가 땅에 닿지 않고 물속으로 뻗어 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v052",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 12
      }
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
      "track": "교과"
    },
    "prompt": "다음은 선인장의 줄기를 잘라 관찰한 결과입니다. 이 결과와 관련지어 선인장이 사막에서 살 수 있는 까닭으로 알맞은 것을 고르세요.",
    "givens": {
      "지문": "• 줄기 속이 물기가 많아 촉촉합니다.\n• 자른 면에 마른 휴지를 대어 보면 휴지가 젖습니다."
    },
    "choices": [
      "줄기에 물을 저장하고 있기 때문이다.",
      "잎에 물을 저장하고 있기 때문이다.",
      "뿌리에 공기를 저장하고 있기 때문이다.",
      "줄기에 공기주머니가 있기 때문이다.",
      "잎이 넓어서 빗물을 많이 받기 때문이다."
    ],
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
    "explanation": "선인장 줄기 속에 물기가 많은 것은 굵은 줄기에 물을 저장하기 때문이고, 그래서 건조한 사막에서도 살 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v053",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 13
      }
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
      "track": "교과"
    },
    "prompt": "주로 사막에 사는 식물끼리 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "갈대, 선인장",
      "선인장, 바오바브나무",
      "퉁퉁마디, 부들",
      "한라솜다리, 리돕스",
      "연꽃, 바오바브나무"
    ],
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
    "explanation": "선인장과 바오바브나무는 굵은 줄기에 물을 저장해 사막에서 살아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v054",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 14
      }
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
      "track": "교과"
    },
    "prompt": "다음 빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "알로에와 용설란은 두꺼운 □에 물을 저장하여 건조한 환경에서 살 수 있습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "잎",
      "accepted": [
        "잎",
        "잎사귀"
      ]
    },
    "explanation": "알로에와 용설란은 두꺼운 잎에 물을 저장해서 건조한 사막에서도 살 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v055",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 15
      }
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
      "track": "교과"
    },
    "prompt": "높은 산 꼭대기에 사는 식물들이 대부분 가지고 있는 생김새를 쓰고, 그 생김새가 어떤 도움이 되는지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "키가 작거나 줄기가 옆으로 누워 자라서 높은 산의 강한 바람을 잘 견딜 수 있어요.",
      "rubric": {
        "required": [
          "키가 작거나 줄기가 옆으로 자란다",
          "강한 바람을 견딜 수 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "높은 산 식물은 대부분 키가 작거나 줄기가 옆으로 자라서, 높은 산에 부는 강한 바람을 견딜 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v056",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 16
      }
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
      "track": "교과"
    },
    "prompt": "다음과 같은 환경에 주로 사는 식물을 <보기>에서 모두 고른 것을 고르세요.",
    "givens": {
      "지문": "바닷물이 드나들어 소금 성분이 많고, 바람과 햇빛이 강합니다.",
      "보기": [
        "㉠ 퉁퉁마디",
        "㉡ 한라솜다리",
        "㉢ 갯메꽃"
      ]
    },
    "choices": [
      "㉠",
      "㉡",
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉢"
    ],
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
    "explanation": "소금 성분이 많은 물이 있고 바람과 햇빛이 강한 곳은 바닷가나 갯벌이에요. 퉁퉁마디와 갯메꽃이 그곳에 살고, 한라솜다리는 높은 산에 살아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v057",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 17
      }
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
      "track": "교과"
    },
    "prompt": "암매가 높은 산에서 키가 작고 여러 개의 줄기가 모여 자라는 까닭으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "물에 쉽게 뜨기 위해서이다.",
      "줄기에 물을 저장하기 위해서이다.",
      "강한 바람을 견디기 위해서이다.",
      "소금 성분을 걸러 내기 위해서이다.",
      "동물이 함부로 먹지 못하게 하기 위해서이다."
    ],
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
    "explanation": "높은 산은 바람이 강하게 불어서, 키가 작고 줄기가 모여 자라야 바람을 잘 견딜 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v058",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 18
      }
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
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 민들레 씨의 특징을 이용해 만든 것을 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "㉠ 철조망",
        "㉡ 낙하산",
        "㉢ 설거지용 수세미"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ",
        "낙하산"
      ]
    },
    "explanation": "민들레 씨는 솜털을 펴고 바람을 타고 천천히 날아가요. 이 특징을 이용해 낙하산을 만들었어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v059",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 19
      }
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
      "track": "교과"
    },
    "prompt": "단풍나무 열매에 대한 설명으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "물에 젖지 않아 물방울이 굴러떨어진다.",
      "끈끈한 털이 많아 작은 벌레가 붙는다.",
      "갈고리 같은 가시가 있어 동물의 털에 붙는다.",
      "날개가 있어 빙글빙글 돌며 천천히 떨어진다.",
      "줄기에 뾰족한 가시가 있어 몸을 보호한다."
    ],
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
    "explanation": "단풍나무 열매는 날개가 달려 있어 빙글빙글 돌며 바람을 타고 천천히 떨어져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v060",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 20
      }
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
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 끈끈이주걱의 특징을 이용한 예로 알맞은 것을 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "㉠ 낙하산",
        "㉡ 먼지 제거 돌돌이",
        "㉢ 철조망"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ",
        "먼지 제거 돌돌이"
      ]
    },
    "explanation": "끈끈이주걱의 끈끈한 털에 작은 것이 잘 붙는 특징을 이용해 먼지를 붙여 떼어 내는 돌돌이를 만들었어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v061",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 1
      }
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
      "track": "교과"
    },
    "prompt": "다음에서 설명하는 식물을 고르세요.",
    "givens": {
      "지문": "• 키가 작은 나무로 화단의 울타리로 많이 심습니다.\n• 잎이 작고 두꺼우며 겨울에도 초록색입니다."
    },
    "choices": [
      "토끼풀",
      "맥문동",
      "은행나무",
      "강아지풀",
      "회양목"
    ],
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
    "explanation": "회양목은 키가 작은 나무로, 작고 두꺼운 잎이 겨울에도 초록색이어서 화단 울타리로 많이 심어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v062",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 2
      }
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
      "track": "교과"
    },
    "prompt": "우리 주변에 사는 식물에 대해 바르게 말한 사람의 이름을 쓰세요.",
    "givens": {
      "지문": "• 서진: 화단에 사는 식물은 모두 꽃 색깔이 같습니다.\n• 예린: 공원에는 한 종류의 식물만 삽니다.\n• 지호: 식물은 종류에 따라 잎과 줄기의 생김새가 다릅니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "지호",
      "accepted": [
        "지호"
      ]
    },
    "explanation": "식물은 종류에 따라 잎·줄기·꽃의 생김새가 서로 달라요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v063",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 3
      }
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
      "track": "교과"
    },
    "prompt": "잎의 구조와 그 설명을 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "잎맥 - 물과 양분이 지나가는 통로",
      "잎몸 - 잎몸과 줄기를 이어 주는 부분",
      "잎맥 - 잎에서 넓적하고 평평한 부분",
      "잎자루 - 잎몸에 퍼져 있는 가는 줄",
      "잎자루 - 잎에서 넓적하고 평평한 부분"
    ],
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
    "explanation": "잎맥은 잎몸에 퍼져 있는 줄로 물과 양분이 지나가는 통로예요. 잎몸은 넓적한 부분, 잎자루는 잎몸과 줄기를 잇는 부분이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v064",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 4
      }
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
      "track": "교과"
    },
    "prompt": "식물의 잎을 분류하는 기준으로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "잎의 끝이 뾰족한가?",
      "잎을 만지면 기분이 좋은가?",
      "잎이 바늘 모양인가?",
      "잎의 가장자리가 매끈한가?",
      "잎 여러 개가 한곳에 붙어 있는가?"
    ],
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
    "explanation": "'기분이 좋은가?'는 사람마다 다르게 느껴 분류 결과가 달라질 수 있으므로 분류 기준으로 알맞지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v065",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 5
      }
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
      "track": "교과"
    },
    "prompt": "다음은 '잎 여러 개가 붙어 있는가?'의 기준으로 식물의 잎을 분류한 결과입니다. 잘못 분류한 것을 쓰세요.",
    "givens": {
      "표": {
        "그렇다.": [
          "토끼풀, 소나무, 단풍나무"
        ],
        "그렇지 않다.": [
          "강아지풀"
        ]
      }
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "단풍나무",
      "accepted": [
        "단풍나무"
      ]
    },
    "explanation": "단풍나무 잎은 한 장이 여러 갈래로 갈라진 것이라 잎 여러 개가 붙은 것이 아니에요. '그렇지 않다.'에 들어가야 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v066",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 6
      }
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
      "track": "교과"
    },
    "prompt": "다음에서 설명하는 식물을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "• 키가 크고 줄기가 굵은 나무입니다.\n• 잎이 길쭉하고 가장자리가 톱니 모양입니다.\n• 가을에 가시가 많은 송이 속에서 열매가 익습니다.",
      "보기": [
        "㉠ 민들레",
        "㉡ 밤나무",
        "㉢ 강아지풀",
        "㉣ 애기똥풀"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ",
        "밤나무"
      ]
    },
    "explanation": "키가 크고 줄기가 굵으며, 가시가 많은 송이 속에 열매가 익는 나무는 밤나무예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v067",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 7
      }
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
      "track": "교과"
    },
    "prompt": "강아지풀과 떡갈나무의 공통점으로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "땅에 뿌리를 내린다.",
      "잎이 대부분 초록색이다.",
      "키가 크고 줄기가 굵다.",
      "들이나 산에서 볼 수 있다.",
      "뿌리, 줄기, 잎을 구분할 수 있다."
    ],
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
    "explanation": "떡갈나무는 키가 크고 줄기가 굵지만, 강아지풀은 키가 작고 줄기가 가는 풀이라 공통점이 아니에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v068",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 8
      }
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
      "track": "교과"
    },
    "prompt": "다음 ㉠, ㉡에 들어갈 알맞은 말을 골라 쓰세요.",
    "givens": {
      "지문": "풀은 나무보다 키가 ㉠ ( 작, 크 )고, 줄기가 ㉡ ( 굵, 가늘 )어요."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 작, ㉡ 가늘",
      "accepted": [
        "㉠ 작, ㉡ 가늘",
        "㉠ 작 ㉡ 가늘",
        "작, 가늘",
        "작 가늘",
        "ㄱ 작, ㄴ 가늘",
        "작다, 가늘다"
      ]
    },
    "explanation": "풀은 나무보다 키가 작고 줄기가 가늘어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v069",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 9
      }
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
      "track": "교과"
    },
    "prompt": "부레옥잠에서 물에 뜨는 데 가장 큰 도움을 주는 부분과 그 까닭을 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "뿌리 - 수염처럼 길게 뻗어 있어서",
      "잎 - 넓고 색깔이 초록색이어서",
      "꽃 - 연한 보라색이어서",
      "잎자루 - 속에 공기주머니가 있어서",
      "줄기 - 길고 단단해서"
    ],
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
    "explanation": "부레옥잠은 볼록한 잎자루 속 공기주머니 덕분에 물에 떠서 살 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v070",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 10
      }
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
      "track": "교과"
    },
    "prompt": "검정말에 대한 설명으로 알맞지 않은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "물속에 잠겨서 산다.",
      "잎이 물 위로 높이 자란다.",
      "뿌리는 물속의 땅에 있다.",
      "줄기와 잎이 물의 흐름에 따라 잘 휘어진다.",
      "잎자루에 공기주머니가 있어 물에 뜬다."
    ],
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
    "explanation": "검정말은 물속에 잠겨서 사는 식물로, 뿌리는 물속의 땅에 있고 줄기와 잎이 물의 흐름에 따라 잘 휘어져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v071",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 11
      }
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
      "track": "교과"
    },
    "prompt": "다음과 같은 특징이 있는 식물끼리 짝 지은 것을 고르세요.",
    "givens": {
      "지문": "• 뿌리가 땅에 닿지 않고 물속으로 뻗어 있습니다.\n• 잎이 넓거나 공기주머니가 있어 물에 쉽게 뜹니다."
    },
    "choices": [
      "연꽃, 부들, 갈대",
      "수련, 마름, 가래",
      "검정말, 나사말, 물수세미",
      "부들, 개구리밥, 붕어마름",
      "부레옥잠, 개구리밥, 물상추"
    ],
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
    "explanation": "부레옥잠·개구리밥·물상추는 뿌리가 물속으로 뻗어 있고, 잎이 넓거나 공기주머니가 있어 물에 떠서 살아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v072",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 12
      }
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
      "track": "교과"
    },
    "prompt": "다음은 용설란 잎을 잘라 관찰한 결과입니다. 이를 통해 알 수 있는 것을 고르세요.",
    "givens": {
      "지문": "• 잎이 두껍고 단단합니다.\n• 잎을 자른 면을 만져 보면 물기가 배어 나와 촉촉합니다."
    },
    "choices": [
      "용설란은 잎에 물을 저장하고 있다.",
      "용설란은 잎이 얇고 넓다.",
      "용설란 잎에는 공기주머니가 있다.",
      "용설란은 줄기에 공기를 저장하고 있다.",
      "용설란은 물이 많은 곳에서만 살 수 있다."
    ],
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
    "explanation": "두꺼운 잎을 자른 면에서 물기가 배어 나오는 것은 용설란이 잎에 물을 저장하기 때문이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v073",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 13
      }
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
      "track": "교과"
    },
    "prompt": "다음은 사막에 사는 식물의 특징입니다. 빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 선인장은 잎이 □ 모양이어서 물이 밖으로 빠져나가는 것을 막을 수 있습니다.\n• 알로에는 잎의 가장자리에 뾰족한 □이/가 있습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "가시",
      "accepted": [
        "가시"
      ]
    },
    "explanation": "선인장은 잎이 가시 모양이라 물이 덜 빠져나가고, 알로에는 잎 가장자리에 가시가 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v074",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 14
      }
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
      "track": "교과"
    },
    "prompt": "다음과 같은 환경에 주로 사는 식물을 두 가지 고르세요. (정답 2개)",
    "givens": {
      "지문": "메마른 모래땅이 넓게 펼쳐져 있고 비가 거의 오지 않으며, 낮과 밤의 온도 차이가 큽니다."
    },
    "choices": [
      "선인장",
      "암매",
      "부레옥잠",
      "갯메꽃",
      "리돕스"
    ],
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
    "explanation": "비가 거의 오지 않고 낮과 밤의 온도 차이가 큰 곳은 사막이에요. 선인장과 리돕스는 줄기나 잎에 물을 저장해 사막에서 살아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v075",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 15
      }
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
      "track": "교과"
    },
    "prompt": "암매가 높은 산에서 키가 작고 여러 개의 줄기가 모여 자라는 까닭을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "높은 산에는 바람이 강하게 불어서, 키가 작고 줄기가 모여 자라야 강한 바람을 견딜 수 있기 때문이에요.",
      "rubric": {
        "required": [
          "높은 산에는 바람이 강하게 분다",
          "그 생김새로 강한 바람을 견딘다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "높은 산은 바람이 강하게 불어서, 키가 작고 여러 줄기가 모여 자라면 강한 바람을 견딜 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v076",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 16
      }
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
      "track": "교과"
    },
    "prompt": "높은 산의 꼭대기에서 키가 작게 자라거나 줄기가 옆으로 자라 강한 바람을 견디는 식물끼리 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "부들, 암매",
      "눈잣나무, 한라솜다리",
      "눈잣나무, 갈대",
      "선인장, 갯메꽃",
      "퉁퉁마디, 용설란"
    ],
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
    "explanation": "눈잣나무는 줄기가 옆으로 자라고, 한라솜다리는 키가 작고 줄기가 모여 자라서 높은 산의 강한 바람을 견뎌요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v077",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 17
      }
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
      "track": "교과"
    },
    "prompt": "다음은 통보리사초에 대한 설명입니다. <보기>에서 통보리사초의 특징으로 알맞은 것을 모두 고른 것을 고르세요.",
    "givens": {
      "보기": [
        "㉠ 바닷가 모래밭에서 자란다.",
        "㉡ 줄기가 통통하여 물을 저장한다.",
        "㉢ 열매가 보리와 비슷한 모양이다."
      ]
    },
    "choices": [
      "㉠",
      "㉡",
      "㉠, ㉢",
      "㉡, ㉢",
      "㉠, ㉡, ㉢"
    ],
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
    "explanation": "통보리사초는 바닷가 모래밭에서 자라고 열매가 보리와 비슷해요. 줄기가 통통하여 물을 저장하는 것은 퉁퉁마디예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v078",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 18
      }
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
      "track": "교과"
    },
    "prompt": "연잎의 특징을 이용해 만든 생활용품을 고르세요.",
    "givens": null,
    "choices": [
      "철조망",
      "낙하산",
      "물에 젖지 않는 옷감",
      "찍찍이 테이프",
      "헬리콥터 프로펠러"
    ],
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
    "explanation": "연잎은 물에 젖지 않아 물방울이 굴러떨어져요. 이 특징을 이용해 물에 젖지 않는 옷감을 만들었어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v079",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 19
      }
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
      "track": "교과"
    },
    "prompt": "끈끈이주걱의 끈끈한 털을 본떠 먼지 제거 돌돌이를 만들었을 때의 좋은 점으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "비가 와도 물에 젖지 않는다.",
      "바람을 타고 멀리 날아갈 수 있다.",
      "사람이나 동물이 함부로 넘어오지 못한다.",
      "작은 먼지를 붙여서 쉽게 떼어 낼 수 있다.",
      "두 장의 띠를 쉽게 붙였다 뗐다 할 수 있다."
    ],
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
    "explanation": "끈끈이주걱의 끈끈한 털에 작은 것이 잘 붙는 것처럼, 돌돌이는 바닥의 작은 먼지를 붙여 쉽게 떼어 내요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u03-v080",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 20
      }
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
      "track": "교과"
    },
    "prompt": "도꼬마리 열매의 특징을 쓰고, 이를 이용한 예를 한 가지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "도꼬마리 열매는 갈고리 같은 가시가 있어 동물의 털이나 옷에 잘 붙어요. 이 특징을 이용해 찍찍이 테이프를 만들었어요.",
      "rubric": {
        "required": [
          "열매의 갈고리 같은 가시가 털이나 옷에 잘 붙는다",
          "이를 이용해 찍찍이 테이프를 만들었다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "도꼬마리 열매는 갈고리 같은 가시가 털이나 옷에 잘 붙어서, 이를 본떠 쉽게 붙였다 뗐다 하는 찍찍이 테이프를 만들었어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  }
];
