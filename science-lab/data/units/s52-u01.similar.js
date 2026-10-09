export const similar = [
  {
    "id": "s52-u01-v001",
    "status": "authored",
    "sourceRef": {
      "type": "authored-practice",
      "of": {
        "set": 1,
        "no": 1
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E1",
      "type": "T01",
      "concept": "궁금한 점에서 탐구 문제 만들기",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "탐구 문제로 가장 알맞은 것은?",
    "givens": null,
    "choices": [
      "비눗방울은 왜 예쁠까?",
      "비눗물의 온도에 따라 비눗방울이 터지기까지 시간이 달라질까?",
      "비눗방울을 좋아하는 친구는 몇 명일까?",
      "비눗방울은 무슨 맛일까?",
      "비눗방울과 풍선 중에서 어느 것이 더 멋지고 아름다울지 정해 볼까?"
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
    "explanation": "조건(온도)과 결과(시간)가 들어 있어 실험으로 확인할 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-v002",
    "status": "authored",
    "sourceRef": {
      "type": "authored-practice",
      "of": {
        "set": 1,
        "no": 2
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E1",
      "type": "T01",
      "concept": "궁금한 점에서 탐구 문제 만들기",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "「글리세린을 넣으면 비눗방울이 더 오래 갈 것이다」는 탐구 과정에서 무엇에 해당하나요?",
    "givens": null,
    "choices": [
      "탐구 문제",
      "가설",
      "결론",
      "관찰 결과",
      "준비물"
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
    "explanation": "실험하기 전에 미리 생각한 답이 가설이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-v003",
    "status": "authored",
    "sourceRef": {
      "type": "authored-practice",
      "of": {
        "set": 1,
        "no": 3
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E2",
      "type": "T03",
      "concept": "변인 통제와 반복 측정(평균)",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "비눗물에 넣는 것에 따른 시간을 비교할 때 같게 할 조건이 아닌 것은?",
    "givens": null,
    "choices": [
      "비눗물의 양",
      "고리의 크기",
      "부는 세기",
      "비눗물에 넣는 것",
      "실험하는 곳의 바람"
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
    "explanation": "넣는 것은 다르게 할 조건이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-v004",
    "status": "authored",
    "sourceRef": {
      "type": "authored-practice",
      "of": {
        "set": 1,
        "no": 4
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E2",
      "type": "T03",
      "concept": "변인 통제와 반복 측정(평균)",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "같은 조건으로 세 번 잰 시간이 24초, 27초, 24초일 때 평균은?",
    "givens": null,
    "choices": [
      "24초",
      "27초",
      "75초",
      "25초",
      "26초"
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
    "explanation": "(24 + 27 + 24) ÷ 3 = 25초예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-v005",
    "status": "authored",
    "sourceRef": {
      "type": "authored-practice",
      "of": {
        "set": 1,
        "no": 5
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E2",
      "type": "T03",
      "concept": "변인 통제와 반복 측정(평균)",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "한 번만 재지 않고 여러 번 재는 까닭은?",
    "givens": null,
    "choices": [
      "시간이 남아서",
      "여러 번 재어 가장 마음에 드는 값 하나만 골라 쓰려고",
      "결과를 가설에 맞추려고",
      "준비물을 다 쓰려고",
      "우연한 차이를 줄여 믿을 수 있는 결과를 얻으려고"
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
    "explanation": "평균을 내면 우연한 차이가 줄어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-v006",
    "status": "authored",
    "sourceRef": {
      "type": "authored-practice",
      "of": {
        "set": 1,
        "no": 6
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E2",
      "type": "T04",
      "concept": "비눗방울의 과학(막·증발·첨가물)",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "비눗방울이 오래 가게 하는 방법으로 알맞은 것은?",
    "givens": null,
    "choices": [
      "비눗물에 글리세린을 조금 넣는다",
      "바람이 센 곳에서 분다",
      "햇볕이 뜨거운 곳에서 분다",
      "비눗물에 물을 아주 많이 더 붓는다",
      "방울을 손으로 만져 본다"
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
    "explanation": "글리세린이 물의 증발을 늦춰요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-v007",
    "status": "authored",
    "sourceRef": {
      "type": "authored-practice",
      "of": {
        "set": 1,
        "no": 7
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E2",
      "type": "T04",
      "concept": "비눗방울의 과학(막·증발·첨가물)",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "설탕을 넣은 비눗방울이 그냥 비눗방울보다 오래 가는 까닭은?",
    "givens": null,
    "choices": [
      "설탕이 막을 무겁게 해서",
      "설탕이 공기를 달게 만들어서",
      "설탕이 물이 증발하는 것을 늦춰서",
      "설탕이 방울 속 공기를 없애서",
      "설탕이 막을 돌처럼 단단하게 굳혀서"
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
    "explanation": "막 속의 물이 천천히 줄어 늦게 터져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-v008",
    "status": "authored",
    "sourceRef": {
      "type": "authored-practice",
      "of": {
        "set": 1,
        "no": 8
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E3",
      "type": "T05",
      "concept": "결과를 표·그래프로 정리하기",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "넣은 것에 따른 평균 시간을 막대그래프로 나타낼 때 가로축에 들어갈 것은?",
    "givens": null,
    "choices": [
      "평균 시간(초)",
      "실험한 날짜",
      "넣은 것(그냥·설탕·글리세린)",
      "실험한 사람의 이름과 반 번호",
      "비눗물의 색"
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
    "explanation": "가로축에는 비교할 조건, 세로축에는 잰 값을 놓아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-v009",
    "status": "authored",
    "sourceRef": {
      "type": "authored-practice",
      "of": {
        "set": 1,
        "no": 9
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E3",
      "type": "T06",
      "concept": "결론 내리고 발표·평가하기",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "결론으로 알맞은 것은? (그냥 비눗물 10초 · 설탕 25초 · 글리세린 59초)",
    "givens": null,
    "choices": [
      "물에 녹는 것이면 무엇이든 넣기만 하면 비눗방울이 오래 간다",
      "글리세린을 넣으면 비눗방울이 가장 오래 간다",
      "글리세린을 넣으면 비눗방울이 더 커진다",
      "설탕을 넣으면 비눗방울이 터지지 않는다",
      "비눗방울은 언제나 1분 동안 떠 있다"
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
    "explanation": "실험한 세 가지 결과로만 결론을 내려요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-v010",
    "status": "authored",
    "sourceRef": {
      "type": "authored-practice",
      "of": {
        "set": 1,
        "no": 10
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E3",
      "type": "T06",
      "concept": "결론 내리고 발표·평가하기",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "탐구를 마친 뒤 새로 이어 갈 수 있는 탐구 문제로 알맞은 것은?",
    "givens": null,
    "choices": [
      "비눗방울은 왜 아름다울까?",
      "글리세린은 어디에서 팔까?",
      "비눗방울 놀이를 할 때 가장 재미있는 친구는 우리 반에서 누구일까?",
      "실험은 몇 시에 끝났을까?",
      "글리세린의 양에 따라 비눗방울이 터지기까지 시간이 달라질까?"
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
    "explanation": "한 가지 조건(글리세린의 양)을 바꾸어 잴 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-v011",
    "status": "authored",
    "sourceRef": {
      "type": "authored-practice",
      "of": {
        "set": 1,
        "no": 11
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E1",
      "type": "T01",
      "concept": "궁금한 점에서 탐구 문제 만들기",
      "level": "기본",
      "track": "교과",
      "format": "단답형"
    },
    "prompt": "탐구 문제의 답을 실험하기 전에 미리 생각해 보는 것을 무엇이라고 하나요?",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "가설",
      "accepted": [
        "가설"
      ]
    },
    "explanation": "가설은 실험으로 맞는지 확인해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-v012",
    "status": "authored",
    "sourceRef": {
      "type": "authored-practice",
      "of": {
        "set": 1,
        "no": 12
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E2",
      "type": "T03",
      "concept": "변인 통제와 반복 측정(평균)",
      "level": "기본",
      "track": "교과",
      "format": "단답형"
    },
    "prompt": "실험에서 일부러 다르게 하는 조건을 무엇이라고 하나요?",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "다르게 할 조건",
      "accepted": [
        "다르게 할 조건",
        "다르게할조건",
        "조작 변인",
        "독립 변인"
      ]
    },
    "explanation": "나머지 조건은 모두 같게 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-v013",
    "status": "authored",
    "sourceRef": {
      "type": "authored-practice",
      "of": {
        "set": 1,
        "no": 13
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E2",
      "type": "T04",
      "concept": "비눗방울의 과학(막·증발·첨가물)",
      "level": "기본",
      "track": "교과",
      "format": "단답형"
    },
    "prompt": "비눗방울의 막이 얇아지는 것은 막 속의 물이 어떻게 되기 때문인가요?",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "증발",
      "accepted": [
        "증발",
        "증발해서",
        "증발한다",
        "증발하기"
      ]
    },
    "explanation": "물이 수증기가 되어 날아가요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-v014",
    "status": "authored",
    "sourceRef": {
      "type": "authored-practice",
      "of": {
        "set": 1,
        "no": 14
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E3",
      "type": "T05",
      "concept": "결과를 표·그래프로 정리하기",
      "level": "기본",
      "track": "교과",
      "format": "단답형"
    },
    "prompt": "조건마다 잰 값의 크기를 막대 길이로 나타내 비교하기 좋은 그래프는?",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "막대그래프",
      "accepted": [
        "막대그래프",
        "막대 그래프"
      ]
    },
    "explanation": "시간에 따른 변화는 꺾은선그래프가 좋아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-v015",
    "status": "authored",
    "sourceRef": {
      "type": "authored-practice",
      "of": {
        "set": 1,
        "no": 15
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E3",
      "type": "T06",
      "concept": "결론 내리고 발표·평가하기",
      "level": "기본",
      "track": "교과",
      "format": "단답형"
    },
    "prompt": "실험 결과를 근거로 탐구 문제의 답을 내린 것을 무엇이라고 하나요?",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "결론",
      "accepted": [
        "결론"
      ]
    },
    "explanation": "결론은 실험한 결과로만 써요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-v016",
    "status": "authored",
    "sourceRef": {
      "type": "authored-practice",
      "of": {
        "set": 1,
        "no": 16
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E1",
      "type": "T02",
      "concept": "탐구 계획 세우기",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "「비눗물의 온도에 따라 비눗방울이 터지기까지 시간이 달라질까?」를 알아보는 실험 계획에서 다르게 할 조건과 같게 할 조건을 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "다르게 할 조건은 비눗물의 온도이고, 같게 할 조건은 비눗물의 양과 진하기, 고리 크기, 부는 세기이다.",
      "rubric": {
        "required": [
          "다르게: 비눗물의 온도",
          "같게: 양·고리·부는 세기 등"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "잴 것은 터지기까지 시간이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-v017",
    "status": "authored",
    "sourceRef": {
      "type": "authored-practice",
      "of": {
        "set": 1,
        "no": 17
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E2",
      "type": "T04",
      "concept": "비눗방울의 과학(막·증발·첨가물)",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "비눗방울이 터지기 전에 막의 색이 바뀌는 것은 막에 무슨 일이 일어나기 때문인지 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "막 속의 물이 증발해 막의 두께가 얇아지면서 빛이 비치는 색이 달라지기 때문이다.",
      "rubric": {
        "required": [
          "물이 증발함",
          "막이 얇아짐"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "막이 아주 얇아지면 곧 터져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-v018",
    "status": "authored",
    "sourceRef": {
      "type": "authored-practice",
      "of": {
        "set": 1,
        "no": 18
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E2",
      "type": "T03",
      "concept": "변인 통제와 반복 측정(평균)",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "세 번 잰 값이 9초, 11초, 10초일 때 평균을 구하는 방법과 답을 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "세 값을 모두 더한 30초를 잰 횟수 3으로 나누어 평균 10초를 구한다.",
      "rubric": {
        "required": [
          "더해서 횟수로 나눔",
          "10초"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "평균은 가장 큰 값이나 합이 아니에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-v019",
    "status": "authored",
    "sourceRef": {
      "type": "authored-practice",
      "of": {
        "set": 1,
        "no": 19
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E3",
      "type": "T06",
      "concept": "결론 내리고 발표·평가하기",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "가설이 「설탕을 넣으면 가장 오래 갈 것이다」였는데 글리세린이 더 오래 갔어요. 이때 어떻게 해야 하는지 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "결과를 고치지 않고 나온 그대로 쓰고, 가설과 다른 까닭을 생각해 새 탐구 문제로 이어 간다.",
      "rubric": {
        "required": [
          "결과를 그대로 씀",
          "까닭을 생각하거나 새 탐구로 이어 감"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "가설과 다른 결과도 소중한 발견이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s52-u01-v020",
    "status": "authored",
    "sourceRef": {
      "type": "authored-practice",
      "of": {
        "set": 1,
        "no": 20
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "탐구",
      "area": "탐구",
      "course": "5-2",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "element": "E3",
      "type": "T05",
      "concept": "결과를 표·그래프로 정리하기",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "넣은 것에 따른 평균 시간을 꺾은선그래프보다 막대그래프로 나타내는 것이 알맞은 까닭을 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "넣은 것은 수가 아니라 서로 다른 종류라서, 종류마다 크기를 비교하기 좋은 막대그래프가 알맞다.",
      "rubric": {
        "required": [
          "넣은 것은 종류(이름)임",
          "크기 비교에 막대그래프가 좋음"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "꺾은선그래프는 시간처럼 이어지는 변화에 써요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-guide-2009-part1-pages29-36",
        "science",
        "answer"
      ]
    }
  }
];
