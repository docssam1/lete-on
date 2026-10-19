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
    "prompt": "관찰 기록에 이름표를 붙이려고 합니다. 알맞은 식물을 고르시오.",
    "givens": {
      "지문": "그늘진 화단에서도 자랐다. 잎은 좁고 길쭉했고 보라색 꽃이 피어 있었다."
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
    "explanation": "맥문동의 좁고 길쭉한 잎과 보라색 꽃을 나타낸 기록이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "두 모둠이 같은 잎을 분류할 때 판단이 달라지기 쉬운 기준은 무엇입니까?",
    "givens": null,
    "choices": [
      "관찰한 잎의 끝이 둥근 모양인가?",
      "관찰한 잎이 바늘처럼 길쭉한가?",
      "관찰한 잎 가장자리가 톱니 모양인가?",
      "관찰한 잎 여러 개가 한곳에 붙었는가?",
      "잎의 색깔이 아름답게 느껴지는가?"
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
    "explanation": "아름답다는 느낌은 사람마다 달라 같은 결과를 얻기 어려워요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "잎 관찰 기록을 읽고 가장자리가 톱니 모양인 카드만 고르시오.",
    "givens": {
      "보기": [
        "㉠ 가장자리에 작은 톱니가 보였다.",
        "㉡ 가장자리가 매끈했다.",
        "㉢ 가장자리에 톱니가 보이고 끝이 뾰족했다.",
        "㉣ 바늘처럼 가늘고 가장자리가 매끈했다."
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
    "explanation": "㉠과 ㉢의 기록에 가장자리가 톱니 모양이라는 공통 특징이 있어요. 잎 끝의 뾰족함과 가장자리의 톱니는 구별해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "기록 카드의 두 상자에 붙일 수 있는 분류 기준을 고르시오.",
    "givens": {
      "지문": "해당함 상자: 바늘 모양 잎 카드, 길고 좁은 잎 카드\n해당하지 않음 상자: 둥근 잎 카드, 손바닥처럼 갈라진 잎 카드"
    },
    "choices": [
      "잎이 귀엽게 느껴지는가?",
      "모든 잎 끝 모양이 둥근가?",
      "잎 여러 개가 한곳에 붙었는가?",
      "잎 가장자리가 모두 톱니인가?",
      "잎 전체 모양이 길쭉한가?"
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
    "explanation": "해당함 상자의 두 잎은 전체 모양이 길쭉하다는 공통 특징으로 묶였어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "다 자란 단풍나무를 관찰했습니다. 이 기록에서 타당한 두 내용을 고르시오.",
    "givens": {
      "보기": [
        "㉠ 함께 관찰한 다 자란 민들레보다 키가 컸다.",
        "㉡ 함께 관찰한 강아지풀보다 줄기가 가늘었다.",
        "㉢ 잎이 손바닥처럼 여러 갈래로 갈라졌다.",
        "㉣ 뿌리·줄기·잎을 구분할 수 없었다."
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
    "explanation": "관찰한 다 자란 단풍나무는 민들레보다 키가 크고, 잎이 여러 갈래로 갈라져 있어요. 모든 풀과 나무의 키가 언제나 같은 순서라는 뜻은 아니에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "다음 관찰 기록으로 부레옥잠이 물에 뜨는 까닭을 설명하시오.",
    "givens": {
      "지문": "관찰 기록: 볼록한 잎자루의 속에 작은 공기주머니가 많았다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "잎자루의 공기주머니 덕분에 물에 뜰 수 있다.",
      "rubric": {
        "required": [
          "잎자루 속 공기가 물에 뜨는 데 도움이 됨"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "잎자루 속 공기와 물에 뜨는 생활을 연결해요. 관찰 기록에 없는 무게 수치를 만들 필요는 없어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "연못 전시의 이름표에 맞는 식물 하나를 고르시오.",
    "givens": {
      "지문": "전시 이름표: 뿌리가 땅에 닿지 않고 물속으로 뻗으며, 물에 떠서 사는 식물"
    },
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
    "explanation": "개구리밥은 물에 떠서 사는 식물이에요. 검정말처럼 물속에 잠겨 사는 식물과 구별해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "안내문에 맞지 않아 다른 전시로 옮겨야 하는 식물을 고르시오.",
    "givens": {
      "지문": "전시 안내: 잎이 물 위로 높이 자라고 뿌리는 물속이나 물가의 땅에 있는 식물"
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
    "explanation": "물상추는 물에 떠서 사는 식물이에요. 연꽃·부들처럼 잎이 물 위로 높이 자라는 무리와 달라요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "두 식물의 기록에 나타난 공통적인 물 저장 방법을 쓰시오.",
    "givens": {
      "지문": "용설란: 잎이 두껍고 안쪽에 물기가 많았다.\n알로에: 두꺼운 잎 안쪽이 촉촉했다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "두꺼운 잎에 물을 저장한다.",
      "rubric": {
        "required": [
          "두꺼운 잎에 물을 저장하는 공통 특징"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "두 식물의 두꺼운 잎과 물 저장을 연결하면 돼요. 사막의 날씨 설명을 다시 적을 필요는 없어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "지문": "환경 카드: 비가 거의 내리지 않아 건조하고 낮과 밤의 온도 차이가 크다."
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "높은 산 전시 카드 / 바닷가·갯벌 전시 카드 순서로 바르게 묶은 것을 고르시오.",
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
    "explanation": "암매·한라솜다리는 높은 산, 퉁퉁마디·갯메꽃은 바닷가나 갯벌에 사는 예예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "단풍나무 열매를 참고하여 회전하는 종이 날개 모형을 설계하려 합니다. 참고한 특징을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 끈끈한 표면에 먼지가 붙는다.",
        "㉡ 빙글빙글 돌면서 천천히 떨어진다.",
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
        "나"
      ]
    },
    "explanation": "열매가 회전하며 떨어지는 특징을 날개 모형 설계에 연결해요. 특정 비행체의 발명 유래를 묻는 문제는 아니에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "함부로 넘어오지 못하게 하는 울타리를 설계하려고 합니다. 목표와 가장 관련 있는 특징을 고르시오.",
    "givens": null,
    "choices": [
      "장미 줄기에 뾰족한 가시가 있다.",
      "연잎 위에서 물방울이 굴러떨어진다.",
      "민들레 씨가 바람을 타고 날아간다.",
      "도꼬마리 열매가 동물 털에 붙는다.",
      "끈끈이주걱 털에 작은 벌레가 붙는다."
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
    "explanation": "가시의 보호 기능을 울타리 설계 목표와 연결할 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "도꼬마리 열매를 관찰한 뒤 쉽게 붙였다 떼는 띠를 설계하려 합니다. 가장 관련 있는 물건을 고르시오.",
    "givens": {
      "지문": "관찰 기록: 열매의 가시 끝이 갈고리처럼 휘어 천에 잘 걸렸다."
    },
    "choices": [
      "찍찍이 테이프",
      "낙하산",
      "철조망",
      "회전 날개 모형",
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
    "explanation": "갈고리가 천에 걸리는 특징을 쉽게 붙였다 떼는 띠와 연결해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "공원 식물 안내문의 문장 중 고쳐야 할 것을 고르시오.",
    "givens": null,
    "choices": [
      "식물마다 잎의 모양과 크기가 다르다.",
      "공원 식물은 모두 생김새가 똑같다.",
      "길가나 화단에서도 여러 식물을 본다.",
      "좁은 보도블록 틈에서도 식물이 자란다.",
      "같은 곳의 식물도 꽃 색이 다를 수 있다."
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
    "explanation": "같은 장소에 사는 식물도 잎·꽃·줄기의 생김새가 다양해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "관찰한 잎의 두 부분을 구별했습니다. ㉠의 이름을 쓰시오.",
    "givens": {
      "지문": "넓적하고 평평한 부분: 잎몸\n잎몸과 줄기를 이어 주는 자루 부분: ㉠"
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
    "explanation": "잎몸을 줄기에 연결하는 부분이 잎자루예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "단풍나무 관찰표에 다른 식물의 특징을 잘못 붙였습니다. 떼어 낼 내용은 무엇입니까?",
    "givens": null,
    "choices": [
      "잎자루가 잎몸과 줄기를 이었다.",
      "잎 가장자리에 톱니가 보였다.",
      "작은 잎 세 장이 함께 붙었다.",
      "잎이 손바닥처럼 갈라져 있었다.",
      "가을에 관찰한 잎은 빨간색이었다."
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
    "explanation": "작은 잎 세 장은 토끼풀의 관찰 예예요. 단풍나무의 손바닥처럼 갈라진 잎과 구별해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "잎 끝 모양으로 카드를 나누었습니다. 옮겨야 할 식물 이름을 쓰시오.",
    "givens": {
      "지문": "관찰 기록: 토끼풀은 끝이 둥글고, 강아지풀·단풍나무·소나무는 끝이 뾰족했다.\n둥근 쪽 상자: 토끼풀·강아지풀\n뾰족한 쪽 상자: 단풍나무·소나무"
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
    "explanation": "관찰 기록에 따르면 강아지풀은 끝이 뾰족한 쪽으로 옮겨야 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "식물 카드를 풀 / 나무 순서로 바르게 묶은 것을 고르시오.",
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
    "explanation": "민들레와 애기똥풀은 풀, 조팝나무와 은행나무는 나무예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "강아지풀과 소나무에 모두 맞는 특징을 서로 다르게 두 가지 쓰시오.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "뿌리·줄기·잎을 구분할 수 있다. 필요한 양분을 스스로 만든다.",
      "rubric": {
        "required": [
          "풀과 나무에 모두 맞는 서로 다른 공통 특징 두 가지"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "공통 특징 두 가지를 써요. 뿌리·줄기·잎을 구분한다는 한 특징을 다른 말로 반복하면 하나로 세어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "부레옥잠의 두 관찰 기록에서 ㉠·㉡을 순서대로 쓰시오.",
    "givens": {
      "지문": "㉠: 볼록한 자루 속에 공기가 들어 있었다.\n㉡: 수염처럼 생겨 물속으로 뻗어 있었다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "잎자루, 뿌리",
      "accepted": [
        "잎자루, 뿌리",
        "잎자루 뿌리",
        "㉠ 잎자루 ㉡ 뿌리",
        "㉠ 잎자루, ㉡ 뿌리"
      ]
    },
    "explanation": "볼록한 잎자루와 물속으로 뻗은 뿌리를 구별해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "다음 전시 이름표 아래에 함께 놓을 식물을 고르시오.",
    "givens": {
      "지문": "전시 이름표: 물속에 잠겨서 사는 식물"
    },
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
    "explanation": "검정말과 나사말은 물속에 잠겨 사는 식물의 예예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "세 식물의 관찰 기록에 공통으로 체크할 수 있는 두 내용을 고르시오.",
    "givens": {
      "지문": "관찰 대상: 개구리밥·물상추·부레옥잠",
      "보기": [
        "㉠ 뿌리가 물속 땅에 박혀 있었다.",
        "㉡ 물에 떠서 살고 있었다.",
        "㉢ 키가 크고 줄기가 단단했다.",
        "㉣ 뿌리가 물속으로 뻗어 있었다."
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
    "explanation": "세 식물은 물에 떠서 살고 뿌리가 물속으로 뻗어 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "지문": "환경 카드: 비가 거의 내리지 않아 건조하고 낮과 밤의 온도 차이가 크다."
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "선인장 줄기의 관찰 기록을 보고, 물이 부족할 때 도움이 되는 특징을 설명하시오.",
    "givens": {
      "지문": "굵고 통통한 줄기 안쪽에 물기가 많았다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "굵은 줄기에 물을 저장할 수 있다.",
      "rubric": {
        "required": [
          "선인장의 굵은 줄기에 물을 저장하는 특징"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "선인장의 굵은 줄기에 물을 저장하는 특징을 쓰면 돼요. 지문에서 이미 말한 물 부족 환경을 답에 다시 요구하지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "단풍나무 열매처럼 회전하며 내려오는 모형을 만들려고 합니다. 가장 관련 있는 설계를 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 천에 붙이는 갈고리 띠",
        "㉡ 빙글빙글 도는 종이 날개",
        "㉢ 뾰족한 가시 울타리"
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
        "나"
      ]
    },
    "explanation": "단풍나무 열매의 회전하며 떨어지는 특징과 회전 날개 모형을 연결해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "물방울이 스며들지 않는 천을 설계하려고 합니다. 연잎과 연결할 특징을 고르시오.",
    "givens": null,
    "choices": [
      "갈고리 가시가 천에 잘 걸린다.",
      "날개가 빙글빙글 돌며 떨어진다.",
      "물방울이 스며들지 않고 굴러간다.",
      "끈끈한 털에 작은 먼지가 붙는다.",
      "뾰족한 가시가 몸을 보호한다."
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
    "explanation": "연잎의 물에 잘 젖지 않는 특징을 설계 목표와 연결해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "쉽게 붙였다 떼는 띠의 설계 메모입니다. 참고할 식물의 특징을 고르시오.",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "같은 잎 사진을 두 모둠이 ‘멋있게 느껴지는가?’로 나누었더니 결과가 달랐습니다. 이 기준이 알맞지 않은 까닭을 쓰시오.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "멋있다고 느끼는 정도가 사람마다 달라 분류 결과가 달라질 수 있다.",
      "rubric": {
        "required": [
          "사람마다 판단이나 분류 결과가 달라질 수 있다는 까닭"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "사람마다 판단이나 결과가 달라질 수 있다는 까닭을 쓰면 돼요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "관찰 카드가 들어 있는 상자의 분류 기준을 고르시오.",
    "givens": {
      "지문": "해당함: 가장자리에 톱니가 보인 단풍나무·토끼풀 카드\n해당하지 않음: 가장자리가 매끈한 강아지풀·소나무 카드"
    },
    "choices": [
      "잎 가장자리가 톱니 모양인가?",
      "잎이 예쁘게 느껴지는가?",
      "모든 잎 끝 모양이 둥근가?",
      "잎 여러 개가 한곳에 붙었는가?",
      "잎 전체 모양이 모두 길쭉한가?"
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
    "explanation": "같은 상자에 모인 카드의 가장자리 기록을 비교하면 톱니 여부로 나눈 것을 알 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "한곳에서 잎 여러 개가 나온다고 관찰한 카드만 고르시오.",
    "givens": {
      "보기": [
        "㉠ 강아지풀: 한 장씩 보였다.",
        "㉡ 토끼풀: 작은 잎 세 장이 함께 보였다.",
        "㉢ 소나무: 가는 잎 두 장이 한곳에서 나왔다.",
        "㉣ 단풍나무: 한 장이 여러 갈래로 갈라졌다."
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
    "explanation": "관찰한 잎의 개수와 한 장의 잎이 갈라진 모양을 구별해요. 소나무도 관찰한 묶음의 잎 수를 기준으로 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "같은 장소에서 다 자란 강아지풀과 소나무를 관찰했습니다. 기록에 맞게 설명한 학생을 쓰시오.",
    "givens": {
      "지문": "관찰 기록: 소나무가 더 컸고 줄기도 더 굵었다. 두 식물 모두 땅에 뿌리를 내렸다.\n하랑: 강아지풀이 소나무보다 더 컸다.\n소율: 강아지풀의 줄기가 소나무보다 가늘었다.\n도윤: 소나무에는 뿌리가 없었다."
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
    "explanation": "이 관찰 기록에서는 강아지풀의 줄기가 더 가늘어요. 모든 풀·나무를 키 하나로 나누는 기준은 아니에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "부레옥잠의 실제 관찰 내용과 맞지 않는 기록 하나를 고르시오.",
    "givens": {
      "지문": "잎자루를 잘라 보고, 물속에서 가볍게 눌러 보았다."
    },
    "choices": [
      "잎자루가 볼록하게 부풀어 있었다.",
      "잎자루가 말랑말랑하게 만져졌다.",
      "속에 물만 가득 차서 무거웠다.",
      "자른 면에 작은 빈 공간이 많았다.",
      "물속에서 누르자 공기 방울이 나왔다."
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
    "explanation": "부레옥잠 잎자루에는 공기가 들어 있는 공간이 있어요. 물만 가득 찼다는 기록과 맞지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "연꽃·부들·갈대 관찰에 공통으로 붙일 안내문을 고르시오.",
    "givens": null,
    "choices": [
      "줄기와 잎이 모두 물속에 잠긴다.",
      "뿌리가 땅에 닿지 않고 떠서 산다.",
      "볼록한 잎자루의 공기로 떠서 산다.",
      "잎이 물 위로 높이 자란다.",
      "잎이 모두 작고 줄기가 쉽게 휜다."
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
    "explanation": "세 식물은 잎이 물 위로 높이 자라는 무리예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "관찰 기록에 이름이 빠졌습니다. 알맞은 식물 이름을 고르시오.",
    "givens": {
      "지문": "물 위에 작은 잎이 떠 있었다. 뿌리는 땅에 닿지 않고 물속으로 뻗어 있었다. 연못 물 위에 작은 개체가 많이 모여 있었다."
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
    "explanation": "물에 떠서 살며 작은 잎을 가진 개구리밥의 기록이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "관찰한 선인장 줄기에 대한 설명으로 뒷받침되는 것을 고르시오.",
    "givens": {
      "지문": "줄기 안쪽은 촉촉했고 자른 면에 댄 마른 휴지가 젖었다."
    },
    "choices": [
      "줄기 안에 물을 저장한다.",
      "잎 안에만 물을 저장한다.",
      "뿌리 안에 공기를 저장한다.",
      "줄기 안에 공기주머니가 있다.",
      "넓은 잎으로 빗물을 모은다."
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
    "explanation": "줄기의 물기로 휴지가 젖는 기록은 줄기에 물을 저장하는 특징과 연결해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "높은 산 식물 두 종류의 생김새 기록입니다. 기록에 나온 특징 중 한 가지와 강한 바람에서의 도움을 연결해 쓰시오.",
    "givens": {
      "지문": "식물 가: 키가 작았다.\n식물 나: 줄기가 위로 서기보다 옆으로 뻗었다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "키가 작거나 옆으로 자라 강한 바람을 견디는 데 도움이 된다.",
      "rubric": {
        "required": [
          "작은 키 또는 옆으로 자람과 강한 바람을 견디는 도움"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "키가 작음 또는 옆으로 자람 중 하나를 바람 견디기와 연결하면 돼요. 두 생김새를 모두 쓸 필요는 없어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "바닷가·갯벌 전시로 보낼 카드만 고르시오.",
    "givens": {
      "지문": "전시 안내: 소금 성분이 있는 물과 강한 바람의 영향을 받는 곳",
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
    "explanation": "퉁퉁마디·갯메꽃은 바닷가나 갯벌에 사는 예이고 한라솜다리는 높은 산의 예예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "민들레 씨처럼 바람을 타며 천천히 내려오는 모형을 만들려고 합니다. 가장 관련 있는 물건을 골라 기호를 쓰시오.",
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
        "나"
      ]
    },
    "explanation": "민들레 씨의 천천히 내려오는 특징을 낙하산 모형과 연결할 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "끈끈이주걱의 끈끈한 털을 본떠 청소 도구를 설계하려 합니다. 목표에 맞는 도구를 골라 기호를 쓰시오.",
    "givens": {
      "지문": "설계 목표: 작은 먼지를 표면에 붙여 제거한다.",
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
        "나"
      ]
    },
    "explanation": "끈끈한 표면에 먼지를 붙이는 청소 도구와 연결해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "잎 관찰 카드의 이름표 중 바르게 붙인 것을 고르시오.",
    "givens": null,
    "choices": [
      "잎맥: 잎몸에서 가는 줄처럼 보인다.",
      "잎몸: 잎몸과 줄기 사이의 자루이다.",
      "잎맥: 잎의 넓적하고 평평한 판이다.",
      "잎자루: 잎몸 전체에 퍼진 가는 줄이다.",
      "잎자루: 잎의 넓적하고 평평한 판이다."
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
    "explanation": "잎몸의 가는 줄처럼 보이는 부분은 잎맥이에요. 이 단원에서는 겉모습을 구별하는 데 중점을 둬요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "누구나 같은 잎을 같은 쪽에 놓기 어려운 분류 기준을 고르시오.",
    "givens": null,
    "choices": [
      "관찰한 잎 끝이 뾰족한 모양인가?",
      "만지면 기분이 좋게 느껴지는가?",
      "관찰한 잎이 바늘처럼 가늘고 긴가?",
      "관찰한 잎의 가장자리가 매끈한가?",
      "관찰한 잎 여러 개가 한곳에 붙었는가?"
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
    "explanation": "기분이 좋다는 느낌은 사람마다 달라질 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "관찰 기록으로 잎 카드를 분류했습니다. 잘못 넣은 카드의 식물 이름을 쓰시오.",
    "givens": {
      "지문": "관찰: 토끼풀은 작은 잎 세 장, 소나무는 가는 잎 두 장이 한곳에서 나왔다. 단풍나무와 강아지풀은 한 장씩 보였다.\n여러 장인 쪽: 토끼풀·소나무·단풍나무\n한 장인 쪽: 강아지풀"
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
    "explanation": "관찰한 단풍나무 잎은 한 장이 갈라진 것이므로 한 장인 쪽으로 옮겨요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "다 자란 강아지풀과 떡갈나무를 함께 관찰했습니다. 두 식물의 공통점으로 쓸 수 없는 기록을 고르시오.",
    "givens": null,
    "choices": [
      "둘 다 땅에 뿌리를 내렸다.",
      "두 식물의 잎은 초록색이었다.",
      "둘 다 키가 크고 줄기가 굵었다.",
      "두 식물을 들이나 산에서 볼 수 있었다.",
      "두 식물의 뿌리·줄기·잎을 구별했다."
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
    "explanation": "관찰한 다 자란 강아지풀은 떡갈나무처럼 키가 크고 줄기가 굵지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "관찰 기록에서 빈칸 두 개를 순서대로 채우시오.",
    "givens": {
      "지문": "같은 장소의 다 자란 강아지풀과 소나무를 관찰했다.\n강아지풀은 소나무보다 키가 ㉠ (작, 크)고 줄기가 ㉡ (굵, 가늘)었다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "작, 가늘",
      "accepted": [
        "작, 가늘",
        "작 가늘",
        "㉠ 작 ㉡ 가늘",
        "㉠ 작, ㉡ 가늘"
      ]
    },
    "explanation": "이 관찰 사례에서 강아지풀은 키가 더 작고 줄기가 더 가늘어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "부레옥잠 관찰 기록을 물에 뜨는 까닭과 바르게 연결한 것을 고르시오.",
    "givens": null,
    "choices": [
      "뿌리가 수염처럼 길게 뻗어 있다.",
      "잎이 넓고 표면은 초록색이다.",
      "꽃이 피면 연한 보라색을 띤다.",
      "잎자루 속에 공기주머니가 있다.",
      "줄기가 길고 아주 단단하다."
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
    "explanation": "부레옥잠의 볼록한 잎자루 속 공기주머니가 물에 뜨는 생활에 도움이 돼요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "전시 이름표에 맞게 한 무리로 모을 수 있는 식물을 고르시오.",
    "givens": {
      "지문": "전시 이름표: 뿌리가 땅에 닿지 않고 물속으로 뻗으며 물에 떠서 사는 식물"
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
    "explanation": "부레옥잠·개구리밥·물상추는 물에 떠서 사는 무리예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "용설란의 잎 관찰에서 뒷받침되는 설명을 고르시오.",
    "givens": {
      "지문": "잎이 두꺼웠고, 자른 면에 마른 휴지를 대자 물기가 묻어 젖었다."
    },
    "choices": [
      "용설란은 잎에 물을 저장한다.",
      "용설란의 잎은 모두 얇고 넓다.",
      "용설란 잎에 공기주머니가 있다.",
      "용설란 줄기에 공기를 저장한다.",
      "용설란은 물속에서만 살 수 있다."
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
    "explanation": "두꺼운 잎에서 나온 물기는 잎의 물 저장과 연결할 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "다음 기록에 나타난 암매의 생김새가 높은 산에서 어떤 도움을 주는지 쓰시오.",
    "givens": {
      "지문": "관찰 기록: 키가 작고 여러 줄기가 모여 자란다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "강한 바람을 견디는 데 도움이 된다.",
      "rubric": {
        "required": [
          "강한 바람을 견디는 도움"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "문제에 생김새가 이미 나와 있으므로 바람을 견디는 도움을 쓰면 돼요. 키와 줄기를 답에 반복할 필요는 없어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "높은 산에서 강한 바람을 견디는 생김새를 소개할 두 식물 카드를 고르시오.",
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
    "explanation": "눈잣나무는 옆으로 자라는 모습, 한라솜다리는 작은 키와 모여 자라는 줄기를 바람 견디기와 연결해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "통보리사초의 안내판에 사용할 수 있는 두 문장을 고르시오.",
    "givens": {
      "보기": [
        "㉠ 바닷가 모래밭에서 자란다.",
        "㉡ 통통한 줄기에 물을 저장한다.",
        "㉢ 열매가 보리와 비슷하게 생겼다."
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
    "explanation": "㉡은 퉁퉁마디의 특징이에요. 통보리사초의 바닷가 서식지와 열매 모양을 구별해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "연잎 위에서 물방울이 굴러가는 특징을 본떠 새 물건을 설계하려 합니다. 목표에 맞는 물건을 고르시오.",
    "givens": null,
    "choices": [
      "철조망",
      "낙하산",
      "물에 젖지 않는 옷감",
      "찍찍이 테이프",
      "회전하는 날개 모형"
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
    "explanation": "물방울이 스며들지 않는 특징을 젖지 않는 옷감의 설계에 연결해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "끈끈이주걱의 끈끈한 털을 참고한 청소 도구 설계입니다. 기대하는 기능을 고르시오.",
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
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
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
    "prompt": "도꼬마리 열매의 관찰 특징 한 가지와 그 특징을 활용할 수 있는 물건을 연결해 쓰시오.",
    "givens": {
      "지문": "물건의 이름과 그 물건에서 활용할 특징이 서로 맞아야 한다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "열매의 갈고리 같은 가시가 천에 잘 붙는 특징을 찍찍이 테이프에 활용할 수 있다.",
      "rubric": {
        "required": [
          "옷이나 털에 잘 붙는 특징과 그에 맞는 물건 한 가지"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "붙는 특징과 그 특징을 활용할 수 있는 물건을 연결해요. 물건 이름만 쓰는 답은 충분하지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  }
];
