export const similar = [
  {
    "id": "c22-s61-u02-v001",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 1,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-01",
      "topic": "위치 변화와 운동의 표현",
      "concept": "위치 변화와 운동의 표현",
      "inquirySkill": "같은 기준의 처음/나중 위치와 시간 순서를 비교하고 정성 표현과 정량 표현을 구별한다."
    },
    "prompt": "같은 벽을 기준으로 2초 전후를 보았습니다. 공이 있던 곳이 달라졌다면 공의 무엇이 변한 것인가요?",
    "givens": {
      "보기": "온도, 위치, 색깔, 무게, 길이"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "위치",
      "accepted": [
        "위치"
      ]
    },
    "explanation": "같은 기준에서 공이 있는 곳을 비교했어요. 시간에 따라 달라진 것은 위치예요. 온도나 크기의 변화가 제시된 것은 아니에요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-1",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v002",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 2,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-01",
      "topic": "위치 변화와 운동의 표현",
      "concept": "위치 변화와 운동의 표현",
      "inquirySkill": "같은 기준의 처음/나중 위치와 시간 순서를 비교하고 정성 표현과 정량 표현을 구별한다."
    },
    "prompt": "복도 벽에 붙인 눈금을 기준으로 기록했습니다. 0초와 2초 사이에 위치가 달라진 대상을 모두 고르세요. (정답 2개)",
    "givens": {
      "자료표": {
        "머리": [
          "대상",
          "0초 위치(눈금)",
          "2초 위치(눈금)"
        ],
        "행": [
          [
            "책장",
            3,
            3
          ],
          [
            "공",
            1,
            5
          ],
          [
            "문",
            7,
            7
          ],
          [
            "장난감차",
            2,
            8
          ],
          [
            "게시판",
            9,
            9
          ]
        ]
      }
    },
    "choices": [
      "게시판",
      "책장",
      "공",
      "문",
      "장난감차"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        4
      ]
    },
    "explanation": "벽을 같은 기준으로 삼아 처음과 나중의 눈금을 비교해요. 공은 1→5, 장난감차는 2→8로 달라졌어요. 나머지는 같은 눈금에 있어요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-2",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v003",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 3,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-01",
      "topic": "위치 변화와 운동의 표현",
      "concept": "위치 변화와 운동의 표현",
      "inquirySkill": "같은 기준의 처음/나중 위치와 시간 순서를 비교하고 정성 표현과 정량 표현을 구별한다."
    },
    "prompt": "이동 거리와 걸린 시간을 모두 알 수 있게 말한 사람의 이름을 쓰세요.",
    "givens": {
      "설명": {
        "머리": [
          "설명"
        ],
        "행": [
          [
            "민준: 로봇이 문 쪽으로 움직였어."
          ],
          [
            "수아: 로봇이 4초 동안 12m를 이동했어."
          ],
          [
            "도윤: 로봇이 12m를 이동했어."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "수아",
      "accepted": [
        "수아"
      ]
    },
    "explanation": "수아의 말에는 4초라는 시간과 12m라는 거리가 모두 있어요. 다른 말도 운동의 정보를 담지만 두 양을 모두 알려 주지는 않아요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-3",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v004",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 4,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-01",
      "topic": "빠르기 변화의 관찰 조건",
      "concept": "빠르기 변화의 관찰 조건",
      "inquirySkill": "물체 이름이나 한 사진만으로 단정하지 않고 관찰 구간과 시간 간격의 이동 기록을 근거로 삼는다."
    },
    "prompt": "작은 수레가 한 방향으로 움직였습니다. 연속한 1초마다 이동한 거리가 아래와 같을 때, 이 관찰 구간에서 빠르기가 일정한 기록을 고르세요.",
    "givens": {
      "자료표": {
        "머리": [
          "수레",
          "연속한 1초 구간의 이동 거리(m)"
        ],
        "행": [
          [
            "가",
            "1, 2, 3"
          ],
          [
            "나",
            "3, 2, 1"
          ],
          [
            "다",
            "3, 3, 3"
          ],
          [
            "라",
            "1, 3, 2"
          ],
          [
            "마",
            "2, 2, 4"
          ]
        ]
      }
    },
    "choices": [
      "다",
      "라",
      "마",
      "가",
      "나"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "같은 1초마다 이동한 거리를 비교해요. 다는 매번 3m로 같아 관찰한 구간의 빠르기가 일정해요. 물체의 이름만으로 판단하지 않아요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-4",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v005",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 5,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-01",
      "topic": "빠르기 변화의 관찰 조건",
      "concept": "빠르기 변화의 관찰 조건",
      "inquirySkill": "물체 이름이나 한 사진만으로 단정하지 않고 관찰 구간과 시간 간격의 이동 기록을 근거로 삼는다."
    },
    "prompt": "컨베이어 위 표시가 연속한 2초마다 4m씩 이동했습니다. 관찰한 구간의 운동을 바르게 설명한 기호를 쓰세요.",
    "givens": {
      "보기": {
        "머리": [
          "보기"
        ],
        "행": [
          [
            "ㄱ. 점점 느려졌습니다."
          ],
          [
            "ㄴ. 빠르기가 일정했습니다."
          ],
          [
            "ㄷ. 위치가 변하지 않았습니다."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "시간 간격이 2초로 같고 각 구간의 거리도 4m로 같아요. 따라서 관찰한 구간에서 빠르기가 일정하다는 ㄴ이 맞아요. 출발·정지 구간의 기록은 제시되지 않았어요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-5",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v006",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 6,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 거리의 시간 비교",
      "concept": "같은 거리의 시간 비교",
      "inquirySkill": "이동 거리가 같을 때 걸린 시간이 짧을수록 빠름을 설명한다."
    },
    "prompt": "세 학생이 실내의 같은 12m 구간을 걸었습니다. 가장 빠른 사람과 가장 느린 사람의 이름을 차례로 쓰세요.",
    "givens": {
      "자료표": {
        "머리": [
          "이름",
          "걸린 시간(초)"
        ],
        "행": [
          [
            "유나",
            10
          ],
          [
            "지민",
            6
          ],
          [
            "서준",
            8
          ]
        ]
      },
      "응답": {
        "머리": [
          "응답"
        ],
        "행": [
          [
            "가장 빠른 사람: [ ]"
          ],
          [
            "가장 느린 사람: [ ]"
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "가장 빠른 사람-지민, 가장 느린 사람-유나",
      "accepted": [
        "가장 빠른 사람-지민, 가장 느린 사람-유나",
        "지민, 유나",
        "가장 빠른 지민, 가장 느린 유나"
      ]
    },
    "explanation": "같은 12m를 걸었으므로 시간이 짧을수록 빨라요. 지민 6초가 가장 짧고 유나 10초가 가장 길어요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-6",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v007",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 7,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 거리의 시간 비교",
      "concept": "같은 거리의 시간 비교",
      "inquirySkill": "이동 거리가 같을 때 걸린 시간이 짧을수록 빠름을 설명한다."
    },
    "prompt": "함께 출발해 같은 20m 구간을 이동한 두 장난감차를 비교했습니다. 빈칸 ㉠과 ㉡을 차례로 쓰세요.",
    "givens": {
      "문장": "더 빠른 차는 도착선에 ㉠(먼저, 나중에) 도착하고, 걸린 시간이 더 ㉡(긴, 짧은) 차입니다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 먼저, ㉡ 짧은",
      "accepted": [
        "㉠ 먼저, ㉡ 짧은",
        "먼저, 짧은"
      ]
    },
    "explanation": "출발과 도착 지점이 같으므로 이동 거리가 같아요. 더 빠른 차는 먼저 도착하고 걸린 시간이 더 짧아요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-7",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v008",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 8,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 시간의 거리 비교",
      "concept": "같은 시간의 거리 비교",
      "inquirySkill": "이동 시간이 같을 때 더 긴 거리를 이동한 물체가 빠름을 설명한다."
    },
    "prompt": "네 대의 청소 로봇이 같은 4초 동안 한 방향으로 이동했습니다. 가장 빠른 로봇을 고르세요.",
    "givens": {
      "자료표": {
        "머리": [
          "로봇",
          "이동 거리(cm)"
        ],
        "행": [
          [
            "가",
            40
          ],
          [
            "나",
            80
          ],
          [
            "다",
            60
          ],
          [
            "라",
            100
          ]
        ]
      }
    },
    "choices": [
      "다",
      "라",
      "모두 같음",
      "가",
      "나"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "시간이 4초로 같으므로 이동 거리가 가장 긴 로봇이 빨라요. 라의 100cm가 가장 길어요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-8",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v009",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 9,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 시간의 거리 비교",
      "concept": "같은 시간의 거리 비교",
      "inquirySkill": "이동 시간이 같을 때 더 긴 거리를 이동한 물체가 빠름을 설명한다."
    },
    "prompt": "모두 5초 동안 움직인 로봇입니다. 같은 5초 동안 60cm를 간 비교 로봇보다 느린 것을 모두 고르세요. (정답 2개)",
    "givens": {
      "자료표": {
        "머리": [
          "로봇",
          "이동 거리(cm)"
        ],
        "행": [
          [
            "가",
            30
          ],
          [
            "나",
            90
          ],
          [
            "다",
            60
          ],
          [
            "라",
            75
          ],
          [
            "마",
            45
          ]
        ]
      }
    },
    "choices": [
      "다",
      "라",
      "마",
      "가",
      "나"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        3
      ]
    },
    "explanation": "같은 5초 동안 60cm보다 짧게 이동한 로봇이 더 느려요. 가 30cm와 마 45cm예요. 다 60cm는 빠르기가 같아 답에 넣지 않아요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-9",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v010",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 10,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "서로 다른 거리와 시간",
      "concept": "서로 다른 거리와 시간",
      "inquirySkill": "한 길을 한 방향으로 움직인 거리와 시간으로 같은 단위 시간의 이동 거리를 구한다."
    },
    "prompt": "두 수레가 한 길을 한 방향으로 움직였습니다. 가는 3초 동안 9m, 나는 4초 동안 8m를 이동했습니다. 두 수레의 빠르기를 비교할 방법을 기호로 쓰세요.",
    "givens": {
      "보기": {
        "머리": [
          "보기"
        ],
        "행": [
          [
            "ㄱ. 이동 거리만 비교합니다."
          ],
          [
            "ㄴ. 걸린 시간만 비교합니다."
          ],
          [
            "ㄷ. 각 이동 거리를 걸린 시간으로 나누어 비교합니다."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "거리와 시간이 모두 다르므로 같은 단위 시간의 이동 거리를 구해야 해요. 가 9÷3=3m/s, 나 8÷4=2m/s로 비교할 수 있어 ㄷ이에요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-10",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v011",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 11,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "속력의 의미와 단위 읽기",
      "concept": "속력의 의미와 단위 읽기",
      "inquirySkill": "거리/시간 단위가 뜻하는 기준 시간을 읽고 단위 변환보다 의미를 설명한다."
    },
    "prompt": "한 길을 한 방향으로 이동한 거리÷걸린 시간으로 구하는 양의 이름을 고르세요.",
    "givens": null,
    "choices": [
      "이동 거리",
      "부피",
      "속력",
      "온도",
      "무게"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "이동한 거리를 걸린 시간으로 나누면 단위 시간 동안 이동한 거리인 속력을 구해요. 시간이나 거리 자체의 이름과 구별해요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-11",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v012",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 12,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "속력의 의미와 단위 읽기",
      "concept": "속력의 의미와 단위 읽기",
      "inquirySkill": "거리/시간 단위가 뜻하는 기준 시간을 읽고 단위 변환보다 의미를 설명한다."
    },
    "prompt": "속력이 일정한 수레의 속력이 2m/s입니다. 이에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "초속 이 미터라고 읽습니다.",
      "이 미터 매 초라고 읽습니다.",
      "3초 동안 6m를 이동합니다.",
      "2초 동안 1m를 이동합니다.",
      "1초 동안 2m를 이동합니다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "2m/s는 1초마다 2m를 이동하는 빠르기예요. 같은 빠르기로 3초 동안 6m를 가요. 2초 동안 1m를 이동한다는 설명은 0.5m/s이므로 옳지 않아요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-12",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v013",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 13,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "속력 자료의 정량 비교",
      "concept": "속력 자료의 정량 비교",
      "inquirySkill": "제시 조건과 단위를 확인하고 표/수치의 속력을 비교한다."
    },
    "prompt": "한 길을 한 방향으로 움직인 로봇입니다. 평균 빠르기가 가장 큰 로봇의 기호를 쓰세요.",
    "givens": {
      "자료표": {
        "머리": [
          "기호",
          "이동 거리(m)",
          "걸린 시간(초)"
        ],
        "행": [
          [
            "ㄱ",
            12,
            4
          ],
          [
            "ㄴ",
            20,
            5
          ],
          [
            "ㄷ",
            18,
            6
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "같은 단위 시간의 거리로 비교해요. 가 12÷4=3, 나 20÷5=4, 다 18÷6=3m/s라서 ㄴ이 가장 빨라요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-13",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v014",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 14,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-03",
      "topic": "안전장치의 목적과 위치",
      "concept": "안전장치의 목적과 위치",
      "inquirySkill": "도로의 감속 장치와 자동차의 탑승자 보호 장치 등의 목적을 구별해 근거와 설명한다."
    },
    "prompt": "도로를 통과하는 자동차의 속력을 낮추도록 설치한 장치를 고르세요.",
    "givens": null,
    "choices": [
      "목 받침대",
      "방음벽",
      "안전띠",
      "에어백",
      "과속 방지 턱"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "과속 방지 턱은 운전자가 속력을 낮추도록 하는 도로 장치예요. 탑승자를 보호하거나 길의 방향을 알리는 장치와 구별해요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-14",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v015",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "originalSet": 1,
        "no": 15,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-03",
      "topic": "교통안전 행동",
      "concept": "교통안전 행동",
      "inquirySkill": "신호·주변 확인·차량 정지 등 상황에 맞는 안전 행동을 선택하고 일상에서 실천한다."
    },
    "prompt": "학교 앞 도로 주변에서 하기에 알맞지 않은 행동을 고르세요.",
    "givens": null,
    "choices": [
      "차도 가까이에서 공놀이하기",
      "공을 주머니에 넣고 이동하기",
      "횡단 전에 차량 정지 확인하기",
      "주차된 차 주변에서 놀지 않기",
      "인도에서 버스를 기다리기"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "도로 주변에서는 공이 차도로 나가거나 사람이 따라 나갈 위험이 있어 공놀이를 하지 않아요. 다른 보기처럼 기다릴 장소와 횡단 전 확인을 지켜요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "1-15",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v016",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 1,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-01",
      "topic": "위치 변화와 운동의 표현",
      "concept": "위치 변화와 운동의 표현",
      "inquirySkill": "같은 기준의 처음/나중 위치와 시간 순서를 비교하고 정성 표현과 정량 표현을 구별한다."
    },
    "prompt": "같은 기준 장소에서 시간에 따라 물체의 위치가 변하는 것을 무엇이라고 하나요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "운동",
      "accepted": [
        "운동"
      ]
    },
    "explanation": "기준 장소가 같을 때 처음과 나중의 위치가 달라지는 것이 운동이에요. 위치를 비교한 시점도 함께 확인해야 해요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-1",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v017",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 2,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-01",
      "topic": "위치 변화와 운동의 표현",
      "concept": "위치 변화와 운동의 표현",
      "inquirySkill": "같은 기준의 처음/나중 위치와 시간 순서를 비교하고 정성 표현과 정량 표현을 구별한다."
    },
    "prompt": "이동 거리와 걸린 시간을 모두 수치로 알려 주지 않은 설명을 고르세요.",
    "givens": null,
    "choices": [
      "로봇이 4초 동안 8m를 갔습니다.",
      "바람이 2초 동안 동쪽으로 불었습니다.",
      "배가 2시간 동안 30km를 갔습니다.",
      "수레가 3초 동안 6m를 갔습니다.",
      "공이 2초 동안 4m를 갔습니다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "바람에 대한 설명을 제외한 네 보기에는 시간과 거리의 수치가 모두 있어요. 바람이 2초 동안 동쪽으로 불었다는 보기에는 이동 거리가 없어요. 이 말이 운동 정보로 틀렸다는 뜻은 아니에요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-2",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v018",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 3,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-01",
      "topic": "빠르기 변화의 관찰 조건",
      "concept": "빠르기 변화의 관찰 조건",
      "inquirySkill": "물체 이름이나 한 사진만으로 단정하지 않고 관찰 구간과 시간 간격의 이동 기록을 근거로 삼는다."
    },
    "prompt": "수레가 연속한 1초 구간마다 2m, 4m, 6m를 갔습니다. 이 기록을 바르게 설명한 것을 고르세요.",
    "givens": null,
    "choices": [
      "빠르기가 일정했습니다.",
      "매초 같은 거리를 갔습니다.",
      "점점 빨라졌습니다.",
      "점점 느려졌습니다.",
      "위치가 변하지 않았습니다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "시간 간격이같은데 이동 거리가 2→4→6m로 늘었어요. 따라서 이 구간에서 점점 빨라졌다고 해석해요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-3",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v019",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 4,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-01",
      "topic": "빠르기 변화의 관찰 조건",
      "concept": "빠르기 변화의 관찰 조건",
      "inquirySkill": "물체 이름이나 한 사진만으로 단정하지 않고 관찰 구간과 시간 간격의 이동 기록을 근거로 삼는다."
    },
    "prompt": "같은 수레의 연속한 2초 구간별 이동 거리가 8m, 6m, 4m였습니다. 빈칸 ㉠과 ㉡을 차례로 쓰세요.",
    "givens": {
      "문장": "같은 시간 동안 이동한 거리가 점점 ㉠(길어, 짧아)졌으므로 점점 ㉡(빨라, 느려)졌습니다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 짧아, ㉡ 느려",
      "accepted": [
        "㉠ 짧아, ㉡ 느려",
        "짧아, 느려"
      ]
    },
    "explanation": "같은 2초마다 이동 거리가 8→6→4m로 짧아졌어요. 같은 시간 동안 거리가 짧아지므로 빠르기가 느려졌어요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-4",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v020",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 5,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 거리의 시간 비교",
      "concept": "같은 거리의 시간 비교",
      "inquirySkill": "이동 거리가 같을 때 걸린 시간이 짧을수록 빠름을 설명한다."
    },
    "prompt": "같은 출발선에서 함께 출발해 같은 도착선까지 간 두 로봇의 빠르기를 비교합니다. 알맞지 않은 방법의 기호를 쓰세요.",
    "givens": {
      "보기": {
        "머리": [
          "보기"
        ],
        "행": [
          [
            "ㄱ. 도착선에 먼저 도착한 로봇을 고릅니다."
          ],
          [
            "ㄴ. 도착할 때까지 시간이 더 긴 로봇을 고릅니다."
          ],
          [
            "ㄷ. 도착할 때까지 시간이 더 짧은 로봇을 고릅니다."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "이동 거리가 같으므로 도착하는 데 걸린 시간이 짧은 로봇이 빨라요. ㄴ은 더 긴 시간이 걸린 로봇을 더 빠르다고 하여 비교 방향이 뒤집혔어요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-5",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v021",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 6,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 거리의 시간 비교",
      "concept": "같은 거리의 시간 비교",
      "inquirySkill": "이동 거리가 같을 때 걸린 시간이 짧을수록 빠름을 설명한다."
    },
    "prompt": "세 로봇이 같은 18m 구간을 갔습니다. 가장 느린 로봇의 이름을 쓰세요.",
    "givens": {
      "자료표": {
        "머리": [
          "이름",
          "걸린 시간(초)"
        ],
        "행": [
          [
            "해",
            6
          ],
          [
            "달",
            9
          ],
          [
            "별",
            12
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "별",
      "accepted": [
        "별"
      ]
    },
    "explanation": "같은 거리를 가는 데 시간이 가장 긴 별이 가장 느려요. 해 6초, 달 9초, 별 12초의 시간을 비교해요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-6",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v022",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 7,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 거리의 시간 비교",
      "concept": "같은 거리의 시간 비교",
      "inquirySkill": "이동 거리가 같을 때 걸린 시간이 짧을수록 빠름을 설명한다."
    },
    "prompt": "세 로봇은 모두 같은 18m를 갔습니다. 걸린 시간으로 빠르기를 비교할 수 있는 까닭을 기호로 쓰세요.",
    "givens": {
      "보기": {
        "머리": [
          "보기"
        ],
        "행": [
          [
            "ㄱ. 같은 거리에서는 시간이 짧을수록 빠르기 때문입니다."
          ],
          [
            "ㄴ. 같은 거리에서는 시간이 길수록 빠르기 때문입니다."
          ],
          [
            "ㄷ. 같은 거리라면 걸린 시간도 모두 같기 때문입니다."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "거리 18m가 같으므로 더 빨리 움직인 로봇은 더 짧은 시간에 도착해요. 같은 거리라는 조건과 시간의 비교 방향을 함께 말한 ㄱ이 맞아요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-7",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v023",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 8,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 시간의 거리 비교",
      "concept": "같은 시간의 거리 비교",
      "inquirySkill": "이동 시간이 같을 때 더 긴 거리를 이동한 물체가 빠름을 설명한다."
    },
    "prompt": "모두 같은 6초 동안 이동했습니다. 기준 수레의 90cm보다 더 빠른 수레끼리 짝지은 것을 고르세요.",
    "givens": {
      "자료표": {
        "머리": [
          "수레",
          "이동 거리(cm)"
        ],
        "행": [
          [
            "가",
            60
          ],
          [
            "나",
            120
          ],
          [
            "다",
            90
          ],
          [
            "라",
            150
          ]
        ]
      }
    },
    "choices": [
      "가, 다",
      "가, 라",
      "다, 라",
      "나, 라",
      "가, 나"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "같은 6초 동안 90cm보다 멀리 간 수레는 나 120cm와 라 150cm예요. 가 60cm는 더 느리고 다 90cm는 같아요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-8",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v024",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 9,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 시간의 거리 비교",
      "concept": "같은 시간의 거리 비교",
      "inquirySkill": "이동 시간이 같을 때 더 긴 거리를 이동한 물체가 빠름을 설명한다."
    },
    "prompt": "두 수레의 평균 빠르기를 비교해 [ ]에 >, <, = 중 하나를 쓰세요.",
    "givens": {
      "왼쪽": "5초 동안 10m 이동",
      "오른쪽": "5초 동안 15m 이동",
      "응답": "왼쪽의 속력 [ ] 오른쪽의 속력"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "<",
      "accepted": [
        "<",
        "작다"
      ]
    },
    "explanation": "두 수레가 이동한 시간은 모두 5초예요. 같은 시간에 왼쪽은 10m, 오른쪽은 15m를 갔으므로 왼쪽이 더 느려 부등호는 <예요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-9",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v025",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 10,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "속력의 의미와 단위 읽기",
      "concept": "속력의 의미와 단위 읽기",
      "inquirySkill": "거리/시간 단위가 뜻하는 기준 시간을 읽고 단위 변환보다 의미를 설명한다."
    },
    "prompt": "1시간 동안 30km를 이동하는 빠르기를 뜻하는 표현을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "초속 삼십 킬로미터",
      "시속 삼십 킬로미터",
      "삼십 미터 매 시",
      "삼십 킬로미터 매 초",
      "삼십 킬로미터 매 시"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    },
    "explanation": "기준 시간이 1시간이고 거리 단위가km예요. 시속 삼십 킬로미터와 삼십 킬로미터 매 시가 같은 뜻이에요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-10",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v026",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 11,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "속력 자료의 정량 비교",
      "concept": "속력 자료의 정량 비교",
      "inquirySkill": "제시 조건과 단위를 확인하고 표/수치의 속력을 비교한다."
    },
    "prompt": "한 방향으로 움직인 수레의 평균 속력이 가장 큰 것을 고르세요.",
    "givens": null,
    "choices": [
      "라는 4초 동안 10m를 갔습니다.",
      "마는 2초 동안 6m를 갔습니다.",
      "가는 4초 동안 8m를 갔습니다.",
      "나는 5초 동안 15m를 갔습니다.",
      "다는 3초 동안 12m를 갔습니다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "같은m/s로 구하면 가 2, 나 3, 다 4, 라 2.5, 마 3이에요. 다 12÷3=4m/s가 가장 커요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-11",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v027",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 12,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "속력 자료의 정량 비교",
      "concept": "속력 자료의 정량 비교",
      "inquirySkill": "제시 조건과 단위를 확인하고 표/수치의 속력을 비교한다."
    },
    "prompt": "네 번 측정한 바람의 속력입니다. 가장 큰 값이 나온 측정 시각을 쓰세요.",
    "givens": {
      "자료표": {
        "머리": [
          "시각",
          "바람의 속력(m/s)"
        ],
        "행": [
          [
            "오전 9시",
            0.8
          ],
          [
            "오전 10시",
            1.5
          ],
          [
            "오전 11시",
            2
          ],
          [
            "낮 12시",
            1.1
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "오전 11시",
      "accepted": [
        "오전 11시",
        "11시"
      ]
    },
    "explanation": "네 측정값 0.8,1.5,2.0,1.1m/s 중 가장 큰 값은 2.0m/s예요. 그때 시각은 오전 11시예요. 다른 날에도 이 시각이 항상 가장 빠른 것은 아니에요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-12",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v028",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 13,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-03",
      "topic": "안전장치의 목적과 위치",
      "concept": "안전장치의 목적과 위치",
      "inquirySkill": "도로의 감속 장치와 자동차의 탑승자 보호 장치 등의 목적을 구별해 근거와 설명한다."
    },
    "prompt": "운전자가 자동차의 속력을 낮추도록 도로에 설치하는 장치의 기호를 쓰세요.",
    "givens": {
      "보기": {
        "머리": [
          "보기"
        ],
        "행": [
          [
            "ㄱ. 안전띠"
          ],
          [
            "ㄴ. 에어백"
          ],
          [
            "ㄷ. 과속 방지 턱"
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "ㄷ의 과속 방지 턱은 속력을 낮추도록 하는 도로 시설이에요. 안전띠와 에어백은 자동차의 탑승자 보호 장치예요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-13",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v029",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 14,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-03",
      "topic": "빠르기와 충돌 위험",
      "concept": "빠르기와 충돌 위험",
      "inquirySkill": "다른 조건이 같을 때 속력과 정지/충돌 위험의 관계를 조건 있게 설명한다."
    },
    "prompt": "다른 조건이 같을 때 충돌 위험을 설명하는 말로 알맞은 것을 골라 쓰세요.",
    "givens": {
      "문장": "속력이 (빠를, 느릴)수록 위험을 발견하고 바로 멈추기 어려워질 수 있습니다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "빠를",
      "accepted": [
        "빠를"
      ]
    },
    "explanation": "같은 조건에서는 속력이 빠를수록 정지하기 어려워지고 충돌 피해도 커질 수 있어요. 이 관계만으로 모든 상황의 정확한 정지 거리를 구할 수는 없어요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-14",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v030",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "originalSet": 2,
        "no": 15,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-03",
      "topic": "교통안전 행동",
      "concept": "교통안전 행동",
      "inquirySkill": "신호·주변 확인·차량 정지 등 상황에 맞는 안전 행동을 선택하고 일상에서 실천한다."
    },
    "prompt": "횡단보도 앞에서 하기에 알맞지 않은 행동을 고르세요.",
    "givens": null,
    "choices": [
      "초록불이 켜지자마자 차도로 뛰어들기",
      "건너기 전에 도로의 좌우를 살피기",
      "휴대 기기를 보지 않고 주변을 살피기",
      "차량이 모두 멈춘 것을 확인하기",
      "정해진 횡단 장소의 인도에서 기다리기"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "신호가 바뀌어도 차량이 모두 멈췄다고 단정할 수 없어요. 곧바로 뛰어들지 않고 주변과 차량 정지를 확인한 뒤 걸어서 건너요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "2-15",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v031",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 1,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-01",
      "topic": "위치 변화와 운동의 표현",
      "concept": "위치 변화와 운동의 표현",
      "inquirySkill": "같은 기준의 처음/나중 위치와 시간 순서를 비교하고 정성 표현과 정량 표현을 구별한다."
    },
    "prompt": "시간에 따른 위치 변화를 설명한 문장입니다. 빈칸에 들어갈 말을 고르세요.",
    "givens": {
      "문장": "시간에 따라 물체의 위치가 변하는 것을 물체의 [ ]이라고 합니다."
    },
    "choices": [
      "부피",
      "운동",
      "모양",
      "온도",
      "무게"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "같은 기준에서 시간이 지날 때 위치가 달라지는 것을 운동이라고 해요. 크기나 온도가 달라졌다는 설명과 구별해요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-1",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v032",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 2,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-01",
      "topic": "위치 변화와 운동의 표현",
      "concept": "위치 변화와 운동의 표현",
      "inquirySkill": "같은 기준의 처음/나중 위치와 시간 순서를 비교하고 정성 표현과 정량 표현을 구별한다."
    },
    "prompt": "벽에 고정한 눈금으로 처음과 3초 뒤를 비교했습니다. 위치가 변하지 않은 대상끼리 묶은 것을 고르세요.",
    "givens": {
      "자료표": {
        "머리": [
          "대상",
          "처음 위치(눈금)",
          "3초 뒤 위치(눈금)"
        ],
        "행": [
          [
            "공",
            1,
            4
          ],
          [
            "문",
            5,
            5
          ],
          [
            "수레",
            2,
            7
          ],
          [
            "책상",
            8,
            8
          ]
        ]
      }
    },
    "choices": [
      "공, 책상",
      "공, 문",
      "문, 책상",
      "공, 수레",
      "수레, 책상"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "문과 책상은 처음과 3초 뒤의 눈금이 각각 같아요. 공과 수레는 눈금이 달라졌어요. 같은 기준으로 두 시점을 비교해요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-2",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v033",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 3,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-01",
      "topic": "위치 변화와 운동의 표현",
      "concept": "위치 변화와 운동의 표현",
      "inquirySkill": "같은 기준의 처음/나중 위치와 시간 순서를 비교하고 정성 표현과 정량 표현을 구별한다."
    },
    "prompt": "수레가 한 방향으로 움직여 0초에는 0m, 2초에는 6m 눈금에 있었습니다. 이때 걸린 시간과 이동 거리를 모두 바르게 말한 기호를 쓰세요.",
    "givens": {
      "보기": {
        "머리": [
          "보기"
        ],
        "행": [
          [
            "ㄱ. 2초 동안 3m를 갔습니다."
          ],
          [
            "ㄴ. 6초 동안 2m를 갔습니다."
          ],
          [
            "ㄷ. 2초 동안 6m를 갔습니다."
          ],
          [
            "ㄹ. 3초 동안 6m를 갔습니다."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "같은 기준의 0m에서 6m까지 한 방향으로 갔으므로 거리는 6m이고 걸린 시간은 2초예요. 두 양을 모두 맞게 쓴 ㄷ이 답이에요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-3",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v034",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 4,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-01",
      "topic": "빠르기 변화의 관찰 조건",
      "concept": "빠르기 변화의 관찰 조건",
      "inquirySkill": "물체 이름이나 한 사진만으로 단정하지 않고 관찰 구간과 시간 간격의 이동 기록을 근거로 삼는다."
    },
    "prompt": "한 방향으로 움직인 로봇의 연속한 1초 구간별 이동 거리입니다. 관찰 구간에서 빠르기가 변한 로봇을 모두 고르세요. (정답 2개)",
    "givens": {
      "자료표": {
        "머리": [
          "로봇",
          "연속한1초 구간별 거리(m)"
        ],
        "행": [
          [
            "가",
            "1, 2, 3"
          ],
          [
            "나",
            "2, 2, 2"
          ],
          [
            "다",
            "4, 3, 2"
          ],
          [
            "라",
            "3, 3, 3"
          ],
          [
            "마",
            "1, 1, 1"
          ]
        ]
      }
    },
    "choices": [
      "라",
      "마",
      "가",
      "나",
      "다"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        4
      ]
    },
    "explanation": "같은 1초마다 이동한 거리가 달라진 로봇을 찾아요. 가는 1→2→3m, 다는 4→3→2m로 변했어요. 나는 2m씩, 라는 3m씩, 마는 1m씩 같아요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-4",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v035",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 5,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-01",
      "topic": "빠르기 변화의 관찰 조건",
      "concept": "빠르기 변화의 관찰 조건",
      "inquirySkill": "물체 이름이나 한 사진만으로 단정하지 않고 관찰 구간과 시간 간격의 이동 기록을 근거로 삼는다."
    },
    "prompt": "수레 가는 매 1초 이동 거리가 2m, 4m, 6m였고, 나는 6m, 4m, 2m였습니다. 빈칸을 차례로 쓰세요.",
    "givens": {
      "문장": "가는 점점 ㉠(빨라, 느려)지고, 나는 점점 ㉡(빨라, 느려)졌습니다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 빨라, ㉡ 느려",
      "accepted": [
        "㉠ 빨라, ㉡ 느려",
        "빨라, 느려"
      ]
    },
    "explanation": "가는 같은 시간에 점점 긴 거리를 가서 빨라졌어요. 나는 같은 시간에 점점 짧은 거리를 가서 느려졌어요. 시간 간격이 같다는 조건을 확인해요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-5",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v036",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 6,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-01",
      "topic": "빠르기 변화의 관찰 조건",
      "concept": "빠르기 변화의 관찰 조건",
      "inquirySkill": "물체 이름이나 한 사진만으로 단정하지 않고 관찰 구간과 시간 간격의 이동 기록을 근거로 삼는다."
    },
    "prompt": "같은 1초 간격으로 잰 이동 거리입니다. 빠르기가 변한 수레의 기호를 쓰고, 어떻게 변했는지 자료를 들어 설명하세요.",
    "givens": {
      "자료표": {
        "머리": [
          "기호",
          "연속한1초 구간별 거리(m)"
        ],
        "행": [
          [
            "ㄱ",
            "3, 3, 3"
          ],
          [
            "ㄴ",
            "2, 4, 6"
          ],
          [
            "ㄷ",
            "0, 0, 0"
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "ㄴ. 같은 1초 동안 이동 거리가 2m, 4m, 6m로 늘어나므로 점점 빨라졌습니다.",
      "rubric": {
        "required": [
          "ㄴ 선택",
          "같은 1초라는 조건",
          "이동 거리가 2→4→6m로 증가",
          "점점 빨라짐을 자료와 연결"
        ],
        "pass": "교사 확인 · 동등 표현과 타당한 근거 인정"
      }
    },
    "explanation": "ㄱ은 매 1초에 3m로 같고 ㄷ은 이동 거리가 0m예요. ㄴ은 같은 1초 동안 간 거리가 2→4→6m로 늘어나 점점 빨라졌다고 설명할 수 있어요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-6",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v037",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 7,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 거리의 시간 비교",
      "concept": "같은 거리의 시간 비교",
      "inquirySkill": "이동 거리가 같을 때 걸린 시간이 짧을수록 빠름을 설명한다."
    },
    "prompt": "두 수레가 같은 8m 구간을 이동했습니다. 빠르기를 비교하려고 직접 비교할 양을 고르세요.",
    "givens": null,
    "choices": [
      "수레의 전체 무게",
      "수레 바퀴의 지름",
      "수레가 움직인 방향",
      "이동하는 데 걸린 시간",
      "수레 앞부분의 높이"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "이동 거리가 같으므로 걸린 시간을 비교해요. 같은 8m를 더 짧은 시간에 간 수레가 빨라요. 다른 길을 간 자료에 시간만 비교하는 방법을 적용하지 않아요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-7",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v038",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 8,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 거리의 시간 비교",
      "concept": "같은 거리의 시간 비교",
      "inquirySkill": "이동 거리가 같을 때 걸린 시간이 짧을수록 빠름을 설명한다."
    },
    "prompt": "같은 거리를 이동한 수레의 빠르기 비교를 바르게 설명한 사람의 이름을 쓰세요.",
    "givens": {
      "설명": {
        "머리": [
          "설명"
        ],
        "행": [
          [
            "시우: 이동 거리가 같으니 걸린 시간도 꼭 같아."
          ],
          [
            "다온: 같은 거리에서는 걸린 시간이 짧을수록 빨라."
          ],
          [
            "가람: 같은 거리에서는 걸린 시간이 길수록 빨라."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "다온",
      "accepted": [
        "다온"
      ]
    },
    "explanation": "같은 거리를 이동했다면 시간이 짧을수록 빨라요. 이 조건과 비교 방향을 바르게 말한 다온의 설명이 맞아요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-8",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v039",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 9,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 거리의 시간 비교",
      "concept": "같은 거리의 시간 비교",
      "inquirySkill": "이동 거리가 같을 때 걸린 시간이 짧을수록 빠름을 설명한다."
    },
    "prompt": "세 사람이 같은 15m 구간을 걸었습니다. 표를 보고 한 설명으로 옳지 않은 것을 고르세요.",
    "givens": {
      "자료표": {
        "머리": [
          "이름",
          "걸린 시간(초)"
        ],
        "행": [
          [
            "수아",
            6
          ],
          [
            "유나",
            8
          ],
          [
            "민준",
            10
          ]
        ]
      }
    },
    "choices": [
      "유나는 수아보다 느립니다.",
      "수아는 민준보다 빠릅니다.",
      "수아가 가장 빠릅니다.",
      "민준이 가장 느립니다.",
      "시간이 길수록 더 빠릅니다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "같은 15m에서 수아의 6초가 가장 짧아 가장 빠르고, 민준의 10초가 가장 길어 가장 느려요. 시간이 길수록 빠르다는 설명은 비교 방향이 뒤집혔어요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-9",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v040",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 10,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 거리의 시간 비교",
      "concept": "같은 거리의 시간 비교",
      "inquirySkill": "이동 거리가 같을 때 걸린 시간이 짧을수록 빠름을 설명한다."
    },
    "prompt": "정해진 같은 코스를 완주하는 데 걸린 시간이 짧을수록 높은 순위를 주는 경기를 고르세요.",
    "givens": null,
    "choices": [
      "같은 코스의 시간을 재는 수레 경주",
      "표적에 맞힌 점수의 합으로 정하는 경기",
      "정해진 경기 시간의 골 수로 정하는 축구",
      "성공하여 넘긴 높이로 정하는 높이뛰기",
      "도약하여 도착한 거리를 재는 멀리뛰기"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "같은 거리를 완주한 시간으로 순위를 정하는 것은 보기의 같은 코스 기록 경주예요. 득점이나 도달 높이 등 다른 기준의 경기와 구별해요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-10",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v041",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 11,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 시간의 거리 비교",
      "concept": "같은 시간의 거리 비교",
      "inquirySkill": "이동 시간이 같을 때 더 긴 거리를 이동한 물체가 빠름을 설명한다."
    },
    "prompt": "세 로봇이 같은 3초 동안 이동했습니다. 가장 빠른 로봇의 이름을 쓰세요.",
    "givens": {
      "자료표": {
        "머리": [
          "로봇",
          "이동 거리(cm)"
        ],
        "행": [
          [
            "하늘",
            90
          ],
          [
            "바다",
            150
          ],
          [
            "구름",
            120
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "바다",
      "accepted": [
        "바다"
      ]
    },
    "explanation": "같은 3초 동안 가장 긴 150cm를 간 바다가 가장 빨라요. 하늘의 90cm와 구름의 120cm보다 길다는 자료를 근거로 삼아요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-11",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v042",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 12,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 시간의 거리 비교",
      "concept": "같은 시간의 거리 비교",
      "inquirySkill": "이동 시간이 같을 때 더 긴 거리를 이동한 물체가 빠름을 설명한다."
    },
    "prompt": "세 로봇이 같은 4초 동안 이동했습니다. 자료에 맞는 설명을 모두 고른 묶음을 고르세요.",
    "givens": {
      "자료표": {
        "머리": [
          "로봇",
          "이동 거리(cm)"
        ],
        "행": [
          [
            "가",
            20
          ],
          [
            "나",
            40
          ],
          [
            "다",
            80
          ]
        ]
      },
      "보기": {
        "머리": [
          "보기"
        ],
        "행": [
          [
            "ㄱ. 가가 가장 느립니다."
          ],
          [
            "ㄴ. 다가 가장 빠릅니다."
          ],
          [
            "ㄷ. 다는 나보다 느립니다."
          ]
        ]
      }
    },
    "choices": [
      "ㄱ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "시간이 같으므로 80cm를 간 다가 가장 빠르고 20cm를 간 가가 가장 느려요. ㄱ과 ㄴ이 맞고, 다가 나보다 느리다는 ㄷ은 틀려요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-12",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v043",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 13,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 시간의 거리 비교",
      "concept": "같은 시간의 거리 비교",
      "inquirySkill": "이동 시간이 같을 때 더 긴 거리를 이동한 물체가 빠름을 설명한다."
    },
    "prompt": "같은 6초 동안의 기록입니다. 60cm를 간 기준 로봇보다 빠른 로봇을 모두 쓰세요. (정답 2개)",
    "givens": {
      "자료표": {
        "머리": [
          "로봇",
          "이동 거리(cm)"
        ],
        "행": [
          [
            "하늘",
            30
          ],
          [
            "구름",
            90
          ],
          [
            "별",
            60
          ],
          [
            "바다",
            120
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "구름, 바다",
      "accepted": [
        "구름, 바다",
        "바다, 구름"
      ]
    },
    "explanation": "시간이 같으므로 60cm보다 멀리 간 구름 90cm와 바다 120cm가 더 빨라요. 하늘 30cm는 느리고 별 60cm는 같아요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-13",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v044",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 14,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 시간의 거리 비교",
      "concept": "같은 시간의 거리 비교",
      "inquirySkill": "이동 시간이 같을 때 더 긴 거리를 이동한 물체가 빠름을 설명한다."
    },
    "prompt": "같은 시간 동안 움직인 두 수레의 빠르기 비교로 알맞은 설명을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "이동 거리를 비교하면 됩니다.",
      "짧은 거리를 간 수레가 더 빠릅니다.",
      "긴 거리를 간 수레가 더 빠릅니다.",
      "시간만 같으면 빠르기도 모두 같습니다.",
      "무게가 무거운 수레가 더 빠릅니다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "이동 시간이 같다는 조건에서는 거리를 비교해요. 같은 시간에 더 긴 거리를 간 수레가 더 빨라요. 시간만 같다고 빠르기까지 모두 같은 것은 아니에요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-14",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v045",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 15,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "서로 다른 거리와 시간",
      "concept": "서로 다른 거리와 시간",
      "inquirySkill": "한 길을 한 방향으로 움직인 거리와 시간으로 같은 단위 시간의 이동 거리를 구한다."
    },
    "prompt": "한 길을 한 방향으로 이동한 물체의 평균 속력을 구하는 방법을 고르세요.",
    "givens": null,
    "choices": [
      "이동 거리 + 걸린 시간",
      "이동 거리 − 걸린 시간",
      "이동 거리 ÷ 걸린 시간",
      "걸린 시간 ÷ 이동 거리",
      "이동 거리 × 걸린 시간"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "단위 시간 동안 이동한 거리를 구하려면 이동 거리를 걸린 시간으로 나눠요. 계산 결과에는 거리와 시간의 단위를 함께 붙여요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-15",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v046",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 16,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "서로 다른 거리와 시간",
      "concept": "서로 다른 거리와 시간",
      "inquirySkill": "한 길을 한 방향으로 움직인 거리와 시간으로 같은 단위 시간의 이동 거리를 구한다."
    },
    "prompt": "수레가 6초 동안 18m를 한 방향으로 갔습니다. 평균 속력을 고르세요.",
    "givens": null,
    "choices": [
      "3m/h",
      "12m/s",
      "108m/s",
      "3m/s",
      "3m"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "이동 거리 18m를 시간 6초로 나누면 3m/s예요. 3m는 거리만 나타내고 3m/h는 시간 단위가 맞지 않아요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-16",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v047",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 17,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "속력의 의미와 단위 읽기",
      "concept": "속력의 의미와 단위 읽기",
      "inquirySkill": "거리/시간 단위가 뜻하는 기준 시간을 읽고 단위 변환보다 의미를 설명한다."
    },
    "prompt": "4m/s를 뜻에 맞게 읽은 표현을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "사 미터 매 시",
      "초속 사 미터",
      "시속 사 미터",
      "사 킬로미터 매 초",
      "사 미터 매 초"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    },
    "explanation": "거리 단위는 m이고 기준 시간은 1초예요. 초속 사 미터와 사 미터 매 초가 맞아요. 시나 km로 바꾸어 읽지 않아요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-17",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v048",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 18,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-03",
      "topic": "안전장치의 목적과 위치",
      "concept": "안전장치의 목적과 위치",
      "inquirySkill": "도로의 감속 장치와 자동차의 탑승자 보호 장치 등의 목적을 구별해 근거와 설명한다."
    },
    "prompt": "자동차의 속력이 갑자기 변할 때 탑승자의 몸을 좌석 쪽에 잡아 주는 장치를 고르세요.",
    "givens": null,
    "choices": [
      "거리 표지판",
      "횡단보도 표시",
      "과속 방지 턱",
      "방음벽",
      "안전띠"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "안전띠는 탑승자의 몸을 잡아 주는 장치예요. 도로 장치인 과속 방지 턱이나 소음을 줄이는 방음벽과 구별해요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-18",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v049",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 19,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-03",
      "topic": "교통안전 행동",
      "concept": "교통안전 행동",
      "inquirySkill": "신호·주변 확인·차량 정지 등 상황에 맞는 안전 행동을 선택하고 일상에서 실천한다."
    },
    "prompt": "학교에서 집으로 걸어갈 때 교통안전 수칙을 지키는 행동을 고르세요.",
    "givens": null,
    "choices": [
      "차량 정지를 확인하고 횡단하기",
      "차도에서 버스를 기다리기",
      "차량 사이에서 바로 도로로 나오기",
      "차도 옆에서 공을 차기",
      "기기 화면을 보며 횡단하기"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "차량이 멈췄는지 확인하고 주변을 살펴 건너는 행동이 알맞아요. 기기 화면을 보거나 차도로 내려가거나 주차 차량 사이에서 갑자기 나오는 행동은 피해야 해요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-19",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v050",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "originalSet": 3,
        "no": 20,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-03",
      "topic": "빠르기와 충돌 위험",
      "concept": "빠르기와 충돌 위험",
      "inquirySkill": "다른 조건이 같을 때 속력과 정지/충돌 위험의 관계를 조건 있게 설명한다."
    },
    "prompt": "같은 조건에서 더 빠른 수레를 조심해야 하는 까닭을 바르게 설명한 기호를 쓰세요.",
    "givens": {
      "보기": {
        "머리": [
          "보기"
        ],
        "행": [
          [
            "ㄱ. 빠른 수레는 언제나 즉시 멈추기 때문입니다."
          ],
          [
            "ㄴ. 빠르면 충돌할 때 더 큰 피해를 줄 수 있기 때문입니다."
          ],
          [
            "ㄷ. 빠르면 위험을 보고 대처할 시간이 더 길기 때문입니다."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "다른 조건이 같으면 빠른 수레는 충돌 피해가 커질 수 있어요. 빠르다는 이유로 즉시 멈추거나 대처할 시간이 더 길어지지는 않아요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "3-20",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v051",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 1,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-01",
      "topic": "위치 변화와 운동의 표현",
      "concept": "위치 변화와 운동의 표현",
      "inquirySkill": "같은 기준의 처음/나중 위치와 시간 순서를 비교하고 정성 표현과 정량 표현을 구별한다."
    },
    "prompt": "이동 거리와 걸린 시간을 모두 알아야 합니다. 추가로 시간을 물어봐야 하는 설명을 고르세요.",
    "givens": null,
    "choices": [
      "사람이 5초 동안 5m를 걸었습니다.",
      "로봇이 북쪽으로 8m를 갔습니다.",
      "공이 2초 동안 6m를 갔습니다.",
      "수레가 4초 동안 8m를 갔습니다.",
      "배가 3시간 동안 60km를 갔습니다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "로봇이 북쪽으로 8m를 갔다는 설명에는 시간이 없어요. 이동했다는 말 자체가 틀린 것은 아니며, 이 문제에서 두 양을 모두 알기 위해 시간을 추가로 질문해요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-1",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v052",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 2,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-01",
      "topic": "위치 변화와 운동의 표현",
      "concept": "위치 변화와 운동의 표현",
      "inquirySkill": "같은 기준의 처음/나중 위치와 시간 순서를 비교하고 정성 표현과 정량 표현을 구별한다."
    },
    "prompt": "같은 바닥 눈금을 기준으로 처음과 2초 뒤를 비교했습니다. 위치가 달라진 대상을 모두 고르세요. (정답 2개)",
    "givens": {
      "자료표": {
        "머리": [
          "대상",
          "처음 위치(눈금)",
          "2초 뒤 위치(눈금)"
        ],
        "행": [
          [
            "의자",
            2,
            2
          ],
          [
            "문",
            6,
            6
          ],
          [
            "공",
            1,
            3
          ],
          [
            "책장",
            8,
            8
          ],
          [
            "수레",
            4,
            9
          ]
        ]
      }
    },
    "choices": [
      "공",
      "책장",
      "수레",
      "의자",
      "문"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "공은 1→3, 수레는 4→9로 눈금이 달라져 운동했어요. 의자·문·책장은 처음과 나중의 위치가 같아요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-2",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v053",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 3,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 시간의 거리 비교",
      "concept": "같은 시간의 거리 비교",
      "inquirySkill": "이동 시간이 같을 때 더 긴 거리를 이동한 물체가 빠름을 설명한다."
    },
    "prompt": "두 수레가 같은 3초 동안 한 방향으로 갔습니다. 빈칸 ㉠과 ㉡을 차례로 쓰세요.",
    "givens": {
      "자료표": {
        "머리": [
          "수레",
          "이동 거리(m)"
        ],
        "행": [
          [
            "가",
            12
          ],
          [
            "나",
            9
          ]
        ]
      },
      "문장": "가는 나보다 더 ㉠(긴, 짧은) 거리를 가서, 가가 나보다 더 ㉡(빠릅, 느립)니다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 긴, ㉡ 빠릅",
      "accepted": [
        "㉠ 긴, ㉡ 빠릅",
        "긴, 빠릅",
        "긴, 빠름",
        "긴, 빠르다"
      ]
    },
    "explanation": "시간이 3초로 같고 가의 12m가 나의 9m보다 길어요. 같은 시간에 더 긴 거리를 갔으므로 가가 더 빨라요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-3",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v054",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 4,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-01",
      "topic": "빠르기 변화의 관찰 조건",
      "concept": "빠르기 변화의 관찰 조건",
      "inquirySkill": "물체 이름이나 한 사진만으로 단정하지 않고 관찰 구간과 시간 간격의 이동 기록을 근거로 삼는다."
    },
    "prompt": "한 방향으로 간 수레의 기록입니다. 자료와 맞지 않는 설명의 기호를 쓰세요.",
    "givens": {
      "자료표": {
        "머리": [
          "수레",
          "연속한1초 구간별 거리(m)"
        ],
        "행": [
          [
            "가",
            "2, 2, 2"
          ],
          [
            "나",
            "1, 3, 5"
          ]
        ]
      },
      "보기": {
        "머리": [
          "보기"
        ],
        "행": [
          [
            "ㄱ. 가는 빠르기가 일정했습니다."
          ],
          [
            "ㄴ. 나는 점점 빨라졌습니다."
          ],
          [
            "ㄷ. 나는 점점 느려졌습니다."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "가는 매 1초에 2m로 일정해요. 나는 매 1초에 1→3→5m로 같은 시간의 거리가 늘어나 빨라졌어요. 느려졌다는 ㄷ이 자료와 맞지 않아요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-4",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v055",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 5,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-01",
      "topic": "빠르기 변화의 관찰 조건",
      "concept": "빠르기 변화의 관찰 조건",
      "inquirySkill": "물체 이름이나 한 사진만으로 단정하지 않고 관찰 구간과 시간 간격의 이동 기록을 근거로 삼는다."
    },
    "prompt": "수레가 연속한 1초 구간마다 9m, 6m, 3m를 갔습니다. 관찰 구간의 빠르기를 바르게 설명한 기호를 쓰세요.",
    "givens": {
      "보기": {
        "머리": [
          "보기"
        ],
        "행": [
          [
            "ㄱ. 점점 빨라졌습니다."
          ],
          [
            "ㄴ. 점점 느려졌습니다."
          ],
          [
            "ㄷ. 빠르기가 일정했습니다."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "같은 1초마다 이동 거리가 9→6→3m로 줄었으므로 점점 느려졌어요. 시간과 거리 기록을 근거로 빠르기의 변화를 판단해요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-5",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v056",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 6,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 거리의 시간 비교",
      "concept": "같은 거리의 시간 비교",
      "inquirySkill": "이동 거리가 같을 때 걸린 시간이 짧을수록 빠름을 설명한다."
    },
    "prompt": "두 로봇이 같은 10m를 갔습니다. 더 빠른 로봇은 걸린 시간이 더 (긴, 짧은) 로봇입니다. 알맞은 말을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "짧은",
      "accepted": [
        "짧은"
      ]
    },
    "explanation": "이동 거리가 같으면 더 빠른 로봇은 더 짧은 시간에 그 거리를 가요. 따라서 빈칸에는 짧은이 알맞아요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-6",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v057",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 7,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 거리의 시간 비교",
      "concept": "같은 거리의 시간 비교",
      "inquirySkill": "이동 거리가 같을 때 걸린 시간이 짧을수록 빠름을 설명한다."
    },
    "prompt": "세 로봇이 같은 24m 구간을 갔습니다. 가장 느린 로봇과 가장 빠른 로봇의 이름을 차례로 쓰세요.",
    "givens": {
      "자료표": {
        "머리": [
          "로봇",
          "걸린 시간(초)"
        ],
        "행": [
          [
            "초록",
            12
          ],
          [
            "빨강",
            8
          ],
          [
            "파랑",
            6
          ]
        ]
      },
      "응답": {
        "머리": [
          "응답"
        ],
        "행": [
          [
            "가장 느린 로봇: [ ]"
          ],
          [
            "가장 빠른 로봇: [ ]"
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "가장 느린 로봇-초록, 가장 빠른 로봇-파랑",
      "accepted": [
        "가장 느린 로봇-초록, 가장 빠른 로봇-파랑",
        "초록, 파랑",
        "가장 느린 초록, 가장 빠른 파랑"
      ]
    },
    "explanation": "같은 24m에서 초록의 12초가 가장 길어 가장 느리고 파랑의 6초가 가장 짧아 가장 빨라요. 빨강의 8초는 중간이에요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-7",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v058",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 8,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 거리의 시간 비교",
      "concept": "같은 거리의 시간 비교",
      "inquirySkill": "이동 거리가 같을 때 걸린 시간이 짧을수록 빠름을 설명한다."
    },
    "prompt": "같은 거리를 간 시간이 짧은 순서로 결과를 정하지 않는 활동의 기호를 쓰세요.",
    "givens": {
      "보기": {
        "머리": [
          "보기"
        ],
        "행": [
          [
            "ㄱ. 같은 코스의 로봇 완주 시간 비교"
          ],
          [
            "ㄴ. 같은 길이의 수영 코스 기록 비교"
          ],
          [
            "ㄷ. 표적에 맞힌 점수의 합계 비교"
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "ㄱ과 ㄴ은 같은 코스의 완주 시간을 비교해요. ㄷ은 표적의 점수를 합산하므로 같은 거리를 간 시간으로 순위를 정하는 활동과 달라요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-8",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v059",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 9,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 시간의 거리 비교",
      "concept": "같은 시간의 거리 비교",
      "inquirySkill": "이동 시간이 같을 때 더 긴 거리를 이동한 물체가 빠름을 설명한다."
    },
    "prompt": "수레 가는 5초 동안 100cm, 나는 5초 동안 150cm를 갔습니다. 자료에 맞는 설명을 고르세요.",
    "givens": null,
    "choices": [
      "가가 더 빠릅니다.",
      "두 수레는 빠르기가 같습니다.",
      "나가 더 빠릅니다.",
      "거리 자료로는 비교할 수 없습니다.",
      "같은 시간이면 거리는 비교할 수 없습니다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "시간이 5초로 같고 나가 더 긴 거리를 갔어요. 따라서 나가 더 빨라요. 이동 시간과 이동 거리를 함께 읽고 비교해요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-9",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v060",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 10,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 시간의 거리 비교",
      "concept": "같은 시간의 거리 비교",
      "inquirySkill": "이동 시간이 같을 때 더 긴 거리를 이동한 물체가 빠름을 설명한다."
    },
    "prompt": "세 장난감차가 같은 2초 동안 이동했습니다. 가장 빠른 차의 이름을 쓰세요.",
    "givens": {
      "자료표": {
        "머리": [
          "차",
          "이동 거리(cm)"
        ],
        "행": [
          [
            "해",
            60
          ],
          [
            "달",
            80
          ],
          [
            "별",
            40
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "달",
      "accepted": [
        "달"
      ]
    },
    "explanation": "시간이 같으므로 이동 거리가 가장 긴 차를 찾아요. 달의 80cm가 해의 60cm와 별의 40cm보다 길어 가장 빨라요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-10",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v061",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 11,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 시간의 거리 비교",
      "concept": "같은 시간의 거리 비교",
      "inquirySkill": "이동 시간이 같을 때 더 긴 거리를 이동한 물체가 빠름을 설명한다."
    },
    "prompt": "모두 같은 3초 동안 움직인 로봇입니다. 빠른 것부터 바르게 나열한 것을 고르세요.",
    "givens": {
      "자료표": {
        "머리": [
          "로봇",
          "이동 거리(cm)"
        ],
        "행": [
          [
            "가",
            120
          ],
          [
            "나",
            90
          ],
          [
            "다",
            150
          ]
        ]
      }
    },
    "choices": [
      "나, 가, 다",
      "나, 다, 가",
      "가, 다, 나",
      "다, 가, 나",
      "가, 나, 다"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "같은 시간이므로 이동 거리 150, 120, 90cm의 순서로 빠르기를 비교해요. 빠른 것부터 나열하면 다, 가, 나의 순서예요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-11",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v062",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 12,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "서로 다른 거리와 시간",
      "concept": "서로 다른 거리와 시간",
      "inquirySkill": "한 길을 한 방향으로 움직인 거리와 시간으로 같은 단위 시간의 이동 거리를 구한다."
    },
    "prompt": "한 길을 한 방향으로 간 물체의 빠르기 비교에 대한 설명 중 옳지 않은 기호를 쓰세요.",
    "givens": {
      "보기": {
        "머리": [
          "보기"
        ],
        "행": [
          [
            "ㄱ. 시간과 거리가 모두 다르면 빠르기는 비교할 수 없습니다."
          ],
          [
            "ㄴ. 같은 거리에서는 걸린 시간을 비교할 수 있습니다."
          ],
          [
            "ㄷ. 같은 시간에서는 이동 거리를 비교할 수 있습니다."
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "거리와 시간이 모두 다르더라도 각 거리÷시간으로 속력을 구해 비교할 수 있어요. 따라서 비교할 수 없다는 ㄱ이 옳지 않아요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-12",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v063",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 13,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "속력의 의미와 단위 읽기",
      "concept": "속력의 의미와 단위 읽기",
      "inquirySkill": "거리/시간 단위가 뜻하는 기준 시간을 읽고 단위 변환보다 의미를 설명한다."
    },
    "prompt": "빈칸 ㉠과 ㉡에 알맞은 말을 차례로 쓰세요.",
    "givens": {
      "문장": "평균 속력은 이동 ㉠[ ]를 걸린 ㉡[ ]으로 나누어 구합니다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 거리, ㉡ 시간",
      "accepted": [
        "㉠ 거리, ㉡ 시간",
        "거리, 시간"
      ]
    },
    "explanation": "속력은 이동 거리를 걸린 시간으로 나눈 양이에요. 따라서 ㉠ 거리, ㉡ 시간이며 순서를 바꾸면 다른 양이 돼요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-13",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v064",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 14,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "속력의 의미와 단위 읽기",
      "concept": "속력의 의미와 단위 읽기",
      "inquirySkill": "거리/시간 단위가 뜻하는 기준 시간을 읽고 단위 변환보다 의미를 설명한다."
    },
    "prompt": "3km/h에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "삼 킬로미터 매 시라고 읽습니다.",
      "1시간에 3km를 가는 빠르기입니다.",
      "거리 단위와 시간 단위를 함께 씁니다.",
      "시속 삼 킬로미터라고 읽습니다.",
      "1초마다 3km를 이동하는 빠르기입니다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "km/h의 기준 시간은 시간이에요. 1초마다 3km라는 설명은 3km/s의 뜻이어서 옳지 않아요. 단위 문자가 뜻하는 시간을 확인해요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-14",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v065",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 15,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "속력 자료의 정량 비교",
      "concept": "속력 자료의 정량 비교",
      "inquirySkill": "제시 조건과 단위를 확인하고 표/수치의 속력을 비교한다."
    },
    "prompt": "한 길을 한 방향으로 이동한 기록입니다. 평균 속력이 가장 큰 물체를 고르세요.",
    "givens": null,
    "choices": [
      "라는 4초 동안 20m를 갔습니다.",
      "마는 5초 동안 15m를 갔습니다.",
      "가는 3초 동안 6m를 갔습니다.",
      "나는 4초 동안 12m를 갔습니다.",
      "다는 2초 동안 8m를 갔습니다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "같은 m/s로 구하면 가 2, 나 3, 다 4, 라 5, 마 3이에요. 라의 20÷4=5m/s가 가장 커요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-15",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v066",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 16,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "속력의 의미와 단위 읽기",
      "concept": "속력의 의미와 단위 읽기",
      "inquirySkill": "거리/시간 단위가 뜻하는 기준 시간을 읽고 단위 변환보다 의미를 설명한다."
    },
    "prompt": "한 방향으로 움직인 수레의 평균 속력은 3m/s입니다. 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "평균 속력이 2m/s인 물체보다 빠릅니다.",
      "6초에 18m를 간 물체보다 느립니다.",
      "초속 삼 미터라고 읽습니다.",
      "삼 미터 매 초라고 읽습니다.",
      "1초에 3m를 가는 빠르기입니다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "6초 동안 18m를 간 물체는 18÷6=3m/s로 같아요. 그보다 느리다는 설명이 옳지 않아요. 나머지는 3m/s의 의미와 맞아요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-16",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v067",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 17,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "서로 다른 거리와 시간",
      "concept": "서로 다른 거리와 시간",
      "inquirySkill": "한 길을 한 방향으로 움직인 거리와 시간으로 같은 단위 시간의 이동 거리를 구한다."
    },
    "prompt": "수레가 8초 동안 24m를 한 방향으로 갔습니다. 평균 속력을 단위와 함께 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "3m/s",
      "accepted": [
        "3m/s",
        "3 m/s",
        "초속 3m",
        "3미터 매 초"
      ]
    },
    "explanation": "24m를 8초로 나누면 3m/s예요. 숫자 3과 함께 m/s를 써야 거리와 시간의 기준이 분명해요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-17",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v068",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 18,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-03",
      "topic": "안전장치의 목적과 위치",
      "concept": "안전장치의 목적과 위치",
      "inquirySkill": "도로의 감속 장치와 자동차의 탑승자 보호 장치 등의 목적을 구별해 근거와 설명한다."
    },
    "prompt": "자동차 안의 탑승자 보호 장치를 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "보기": {
        "머리": [
          "보기"
        ],
        "행": [
          [
            "ㄱ. 과속 방지 턱"
          ],
          [
            "ㄴ. 안전띠"
          ],
          [
            "ㄷ. 에어백"
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ, ㄷ",
      "accepted": [
        "ㄴ, ㄷ",
        "ㄷ, ㄴ",
        "안전띠, 에어백",
        "에어백, 안전띠"
      ]
    },
    "explanation": "안전띠와 에어백은 자동차 탑승자를 보호하는 장치예요. 과속 방지 턱은 도로 시설이므로 자동차 안의 장치에 넣지 않아요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-18",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v069",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 19,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-03",
      "topic": "교통안전 행동",
      "concept": "교통안전 행동",
      "inquirySkill": "신호·주변 확인·차량 정지 등 상황에 맞는 안전 행동을 선택하고 일상에서 실천한다."
    },
    "prompt": "교통안전 수칙에 맞지 않는 행동을 고르세요.",
    "givens": null,
    "choices": [
      "공을 주머니에 넣고 이동하기",
      "횡단 전에 차량 정지 확인하기",
      "주차된 차 사이에서 뛰어나오기",
      "버스를 인도에서 기다리기",
      "길을 건너기 전에 좌우 살피기"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "주차된 차 사이에서 갑자기 차도로 뛰어나오면 운전자와 보행자가 서로 확인하기 어려워 위험해요. 주변과 차량을 살피고 안전한 장소에서 이동해야 해요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-19",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  },
  {
    "id": "c22-s61-u02-v070",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "originalSet": 4,
        "no": 20,
        "course": "초등5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-03",
      "topic": "안전장치의 목적과 위치",
      "concept": "안전장치의 목적과 위치",
      "inquirySkill": "도로의 감속 장치와 자동차의 탑승자 보호 장치 등의 목적을 구별해 근거와 설명한다."
    },
    "prompt": "학교 주변 표지의 안내 자료에는 ‘이 구간에서는 자전거를 타고 지나갈 수 없다’고 적혀 있었습니다. 이 표지의 역할을 바르게 설명한 것을 고르세요.",
    "givens": null,
    "choices": [
      "목적지까지의 방향과 거리를 안내해 줍니다.",
      "위험한 구간이나 위험물을 미리 알려 줍니다.",
      "안전을 위해 따라야 할 통행 방법을 알려 줍니다.",
      "제한하거나 금지하는 사항을 알려 줍니다.",
      "다른 표지의 적용 시간이나 구역을 보충해 줍니다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "이 구간에서 자전거로 지나갈 수 없다는 자료는 통행을 제한하는 뜻이에요. 따라서 제한하거나 금지하는 사항을 알린다는 설명이 맞아요. 경고·지시·보충 설명·길 안내의 뜻과 구별해요.",
    "variantRules": {
      "kind": "independent-pair",
      "sourceKey": "4-20",
      "answerFromOwnConditions": true,
      "sourceAmbiguityInherited": false
    },
    "evidence": {
      "checkedBy": "독립짝70의 자체 조건/자료·응답 형식·보기/정답·23자료모형 검산",
      "date": "2026-10-21",
      "gates": [
        "science",
        "answer"
      ],
      "note": "독립 창작이며 가상 자료는 실제 학생 측정 결과가 아님. 화면/A4 검수 별도."
    }
  }
];
