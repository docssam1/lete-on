// 3-1 창작 기말평가 60문항. 원문 시험지·짝 문항으로 세지 않는다.
export const unit = {
  "id": "s31-fin",
  "course": "3-1",
  "no": null,
  "title": "기말평가 · 창작",
  "domain": "종합",
  "sources": {
    "basis": [
      "bank/work/s31u01/curriculum.json",
      "bank/work/s31u02/curriculum.json",
      "bank/work/s31u03/curriculum.json",
      "bank/work/s31u04/curriculum.json"
    ],
    "originalExamAvailable": false
  },
  "assessment": {
    "authored": true,
    "forms": [
      1,
      2
    ],
    "perForm": 30,
    "scope": [
      "힘과 우리 생활",
      "동물의 생활",
      "식물의 생활",
      "생물의 한살이"
    ],
    "performanceNote": "자료 해석 문제이며 실제 관찰·실험·제작·협력적 소통을 대신하지 않는다."
  }
};
export const items = [
  {
    "id": "s31-fin-f1-01",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 1,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과01-01"
    },
    "prompt": "힘을 준 뒤 모양이 달라진 관찰 기록은 무엇인가요?",
    "givens": null,
    "choices": [
      "스펀지가 눌려 납작해졌다.",
      "공이 굴러 앞쪽으로 갔다.",
      "수레가 움직이기 시작했다.",
      "그네가 뒤쪽으로 움직였다.",
      "문이 밀려 바깥쪽으로 열렸다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "누른 스펀지는 모양이 달라졌어요. 나머지는 제시한 기록에서 움직임의 변화를 나타내요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-02",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 2,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과01-01"
    },
    "prompt": "같은 바닥에서 같은 수레를 같은 방법으로 밀어요. 가장 큰 힘이 들 것으로 예상되는 경우는 무엇인가요?",
    "givens": {
      "조건": "상자는 모두 종류와 무게가 같고 바퀴 상태도 같아요."
    },
    "choices": [
      "상자를 한 개 실었을 때",
      "상자를 네 개 실었을 때",
      "상자를 두 개 실었을 때",
      "상자를 세 개 실었을 때",
      "상자를 전혀 싣지 않았을 때"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "같은 조건에서 상자를 더 많이 실은 수레가 더 무거우므로 움직이게 할 때 더 큰 힘이 들 것으로 예상해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-03",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 3,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과01-02"
    },
    "prompt": "빈 판자가 수평인 수평대의 같은 거리에 두 물체를 놓았어요. 기록으로 알 수 있는 것은 무엇인가요?",
    "givens": {
      "관찰": "왼쪽에 가 물체, 오른쪽에 나 물체를 놓자 가 쪽으로 기울었어요."
    },
    "choices": [
      "나는 가보다 더 무겁다.",
      "가와 나의 무게는 같다.",
      "가의 크기는 나보다 크다.",
      "가는 나보다 더 무겁다.",
      "나의 크기는 가보다 작다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "받침점에서 같은 거리에 놓았으므로 기울어진 가 쪽의 물체가 더 무거워요. 크기는 이 결과만으로 정하지 못해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-04",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 4,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과01-03"
    },
    "prompt": "가상 전자저울 기록에서 가장 가벼운 물건은 무엇인가요?",
    "givens": {
      "표": {
        "머리": [
          "물건",
          "무게"
        ],
        "행": [
          [
            "풀",
            "32 g"
          ],
          [
            "가위",
            "58 g"
          ],
          [
            "필통",
            "140 g"
          ],
          [
            "지우개",
            "21 g"
          ]
        ]
      }
    },
    "choices": [
      "풀",
      "지우개",
      "가위",
      "필통",
      "네 물건 모두"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "같은 단위 g으로 잰 값 중 21 g이 가장 작아요. 문제의 값은 가상 측정 기록이에요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-05",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 5,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과01-04"
    },
    "prompt": "같은 용수철을 사용한 가상 실험이에요. 이 기록으로 알 수 있는 것은 무엇인가요?",
    "givens": {
      "모형 값": [
        "같은 장난감을 직접 천천히 들기: 용수철이 6 cm 늘어남",
        "기울어진 판자를 따라 천천히 올리기: 3 cm 늘어남"
      ],
      "조건": "용수철의 사용 한도를 넘지 않았어요."
    },
    "choices": [
      "판자를 쓰자 장난감의 무게 자체가 줄었다.",
      "이 실험에서는 직접 들 때 힘이 덜 들었다.",
      "이 실험에서는 판자를 쓸 때 힘이 덜 들었다.",
      "판자를 쓰면 모든 조건에서 드는 힘은 같다.",
      "판자를 쓸 때 용수철이 더 많이 늘어났다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "같은 용수철이 덜 늘어난 경우 더 작은 힘을 받은 것으로 비교해요. 물체 자체의 무게가 줄었다고 설명하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-06",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 6,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과01-04"
    },
    "prompt": "친구에게 도구의 도움을 설명할 자료로 가장 알맞은 것은 무엇인가요?",
    "givens": {
      "목표": "기울어진 판자를 이용하기 전후에 드는 힘이 어떻게 달랐는지 공유하기"
    },
    "choices": [
      "무게가 다른 물체를 두 방법으로 옮긴 결과",
      "같은 물체를 서로 다른 높이로 옮긴 결과만",
      "쓰는 방법은 빼고 도구 이름만 모아 놓은 표",
      "힘은 비교하지 않고 도구 길이만 적은 표",
      "같은 물체를 두 방법으로 옮긴 결과와 조건"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "같은 물체를 비교한 조건과 실제 관찰 결과가 있어야 도구의 도움을 근거로 설명할 수 있어요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-07",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 7,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과01-01"
    },
    "prompt": "관찰한 사실을 쓴 기록 두 가지를 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "스펀지를 누르자 두께가 줄었다.",
      "공을 밀자 공이 굴러가기 시작했다.",
      "힘을 주면 모든 물체가 반드시 부서진다.",
      "수레는 언제나 같은 힘으로 움직인다.",
      "보지 않았지만 모든 공의 무게는 같다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1
      ]
    },
    "explanation": "실제로 본 스펀지의 모양 변화와 공의 움직임 변화가 관찰 사실이에요. 나머지는 관찰하지 않은 내용을 단정했어요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-08",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 8,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과01-03"
    },
    "prompt": "다음 가상 기록에서 가방의 무게를 단위까지 쓰세요.",
    "givens": {
      "전자저울 표시": "620 g"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "620 g",
      "accepted": [
        "620 g",
        "620g",
        "620 그램"
      ]
    },
    "explanation": "표시 숫자와 무게 단위 g을 함께 써요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-09",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 9,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과02-01"
    },
    "prompt": "관찰 기록을 이용해 동물을 나눌 기준으로 알맞은 것은 무엇인가요?",
    "givens": {
      "표": {
        "머리": [
          "이름표",
          "보이는 몸 부분"
        ],
        "행": [
          [
            "가",
            "다리 네 개, 털"
          ],
          [
            "나",
            "다리 없음, 비늘"
          ],
          [
            "다",
            "다리 두 개, 깃털"
          ]
        ]
      }
    },
    "choices": [
      "성격이 얌전한가?",
      "다리가 있는가?",
      "사람이 좋아하는가?",
      "모두 같은 먹이를 먹는가?",
      "귀여운 느낌이 드는가?"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "다리의 유무는 제시한 기록으로 확인할 수 있어요. 성격·선호·먹이 정보는 이 기록에 없어요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-10",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 10,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과02-02"
    },
    "prompt": "수달과 물고기의 조사 기록을 비교한 설명으로 알맞은 것은 무엇인가요?",
    "givens": {
      "조사 기록": [
        "수달: 물갈퀴가 있는 발로 헤엄치는 모습을 확인함",
        "붕어: 지느러미와 꼬리를 움직이며 헤엄치는 모습을 확인함"
      ]
    },
    "choices": [
      "둘 다 같은 지느러미로 헤엄치는 동물이다.",
      "수달에게도 붕어와 같은 지느러미가 있다.",
      "물속 이동에 쓰는 몸 부분이 서로 다르다.",
      "물에 사는 모든 동물에게 물갈퀴가 있다.",
      "두 동물 모두 물속에서는 전혀 움직이지 않는다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "두 동물 모두 헤엄치지만 이용하는 몸 부분은 달라요. 물속 생활을 한 가지 모습으로 일반화하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-11",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 11,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과02-03"
    },
    "prompt": "물건을 붙잡아 옮기는 도구의 설계에 가장 알맞은 연결은 무엇인가요?",
    "givens": {
      "설계 목표": "쉽게 놓치지 않도록 앞부분으로 물건을 꽉 잡아 옮기고 싶어요."
    },
    "choices": [
      "오리의 물갈퀴 발 → 물건을 칠하는 붓",
      "문어의 빨판 → 물건의 색을 바꾸는 등",
      "수리가 움켜잡는 발 → 물건을 잡는 집게",
      "두더지의 앞발 → 공기를 식히는 부채",
      "붕어의 지느러미 → 물건의 길이를 재는 자"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "움켜잡는 특징을 집게의 잡는 기능과 연결한 아이디어예요. 실제 발명 유래를 단정한 것은 아니에요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-12",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 12,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과02-02"
    },
    "prompt": "조사 기록만으로 말할 수 있는 것은 무엇인가요?",
    "givens": {
      "사진 메모": "낮에 동굴 안 천장에 박쥐 여러 마리가 매달려 쉬고 있었어요."
    },
    "choices": [
      "모든 박쥐는 평생 동굴 안에서만 지낸다.",
      "이 사진으로 박쥐의 모든 먹이를 알 수 있다.",
      "동굴에 사는 모든 동물은 날개가 없는 동물이다.",
      "이 사진의 박쥐는 낮에 동굴에서 쉬고 있다.",
      "이 박쥐는 밤에도 전혀 움직이지 않는 동물이다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "확인한 장소·시각·행동까지만 설명해요. 한 사진으로 모든 개체의 생활 전체를 정할 수 없어요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-13",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 13,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과02-01"
    },
    "prompt": "분류 기록에서 고쳐야 할 점 두 가지를 고르세요. (정답 2개)",
    "givens": {
      "기준": "더듬이가 있는가?",
      "기록": [
        "있다: 개미, 토끼",
        "없다: 닭, 꿀벌"
      ]
    },
    "choices": [
      "더듬이 대신 귀여운 느낌으로 나눈다.",
      "개미를 없다 모둠으로 옮긴다.",
      "닭을 있다 모둠으로 옮긴다.",
      "꿀벌을 있다 모둠으로 옮긴다.",
      "토끼를 없다 모둠으로 옮긴다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        3,
        4
      ]
    },
    "explanation": "토끼와 닭은 더듬이가 없고, 개미와 꿀벌은 더듬이가 있어요. 같은 기준을 끝까지 적용해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-14",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 14,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과02-02"
    },
    "prompt": "조사한 세 동물 중 지느러미로 헤엄치는 동물의 이름을 쓰세요.",
    "givens": {
      "조사 목록": [
        "수달: 물갈퀴가 있는 발",
        "붕어: 지느러미와 꼬리",
        "다슬기: 배발"
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "붕어",
      "accepted": [
        "붕어"
      ]
    },
    "explanation": "이 조사에서 지느러미와 꼬리를 이용하는 동물은 붕어예요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-15",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 15,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과02-03"
    },
    "prompt": "오리 발의 특징을 이용한 설계예요. 그 특징이 수영 도구에서 어떤 도움을 줄지 쓰세요.",
    "givens": {
      "제시 자료": "오리는 발가락 사이에 물갈퀴가 있어 발로 물을 밀며 헤엄쳐요.",
      "설계": "발에 끼우는 도구의 앞부분을 넓게 만들려고 해요."
    },
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "물갈퀴처럼 물을 넓게 밀어 헤엄치는 데 도움을 줄 수 있어요.",
      "rubric": {
        "required": [
          "물갈퀴 특징과 물을 밀어 헤엄치는 기능을 연결함"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 원자료의 공식 배점표가 아니다."
        ],
        "pass": "제시 자료와 기준에 맞게 설명한다."
      }
    },
    "explanation": "오리 발의 넓은 물갈퀴가 물을 미는 기능을 도구에 연결해요. 이름이나 색만 닮게 하는 것과 구별하며, 기대한 도움은 실제 시험 결과와 나누어 설명해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-16",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 16,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과03-01"
    },
    "prompt": "사진만 보고 확실히 비교하기 어려운 것은 무엇인가요?",
    "givens": {
      "자료 조건": "잎 사진 두 장의 확대 비율이 서로 다르고 길이를 재는 눈금은 없어요."
    },
    "choices": [
      "각 잎 사진의 가장자리 모양",
      "각 잎 사진의 끝부분 모양",
      "사진에서 보이는 잎의 윤곽",
      "사진에서 보이는 갈라진 부분",
      "두 잎의 실제 길이 차이"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "확대 비율이 다르고 기준 눈금이 없으면 사진 크기를 실제 길이로 비교할 수 없어요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-17",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 17,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과03-01"
    },
    "prompt": "두 분류 결과가 달라진 까닭으로 알맞은 것은 무엇인가요?",
    "givens": {
      "기록": [
        "첫 분류: 잎 가장자리의 톱니 유무로 나눔",
        "둘째 분류: 잎 끝이 뾰족한지로 나눔",
        "같은 잎 가가 첫 분류와 둘째 분류에서 다른 모둠에 들어감"
      ]
    },
    "choices": [
      "모든 잎이 관찰 중 다른 식물로 변했기 때문이다.",
      "분류 기준과 상관없이 모둠은 늘 같기 때문이다.",
      "같은 잎은 어떤 기준에서도 한 모둠이기 때문이다.",
      "첫 기록이 있으면 둘째 기준을 쓰면 안 되기 때문이다.",
      "분류할 때 살핀 특징이 달라졌기 때문이다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "같은 잎도 어떤 특징을 기준으로 삼느냐에 따라 다른 모둠으로 나뉠 수 있어요. 두 기준의 기록을 각각 보존해 비교해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-18",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 18,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과03-02"
    },
    "prompt": "강이나 연못의 식물 조사에서 더 확인할 내용은 무엇인가요?",
    "givens": {
      "조사 메모": "한 사진에 잎과 꽃이 보이지만 뿌리 쪽과 물속 부분은 가려졌어요."
    },
    "choices": [
      "몸의 어느 부분이 물속과 물 위에 있는지",
      "모든 물 식물의 꽃 색이 같은지 먼저 단정하기",
      "가려진 뿌리가 없다고 바로 기록하기",
      "모든 잎이 물 위에 뜬다고 먼저 정하기",
      "물속 식물과 땅 식물의 크기가 늘 같은지 정하기"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "가려진 부분은 없다고 단정하지 말고 다른 사진이나 조사 자료로 몸 부분의 위치를 확인해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-19",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 19,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과03-02"
    },
    "prompt": "사막 식물 조사 자료와 가장 알맞게 연결한 것은 무엇인가요?",
    "givens": {
      "제시 자료": "비가 적고 건조한 곳의 선인장은 굵은 줄기에 물을 저장해요."
    },
    "choices": [
      "굵은 줄기의 물 저장을 건조한 환경과 연결한다.",
      "사막의 모든 식물은 뿌리가 없다고 설명한다.",
      "굵은 줄기를 물이 매우 많은 환경만과 연결한다.",
      "모든 사막 식물의 잎은 넓고 얇다고 단정한다.",
      "자료에 없지만 모든 사막 뿌리는 깊다고 정한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "제시한 선인장의 특징과 건조한 환경을 연결해 설명해요. 한 예를 모든 사막 식물에 적용하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-20",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 20,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과03-03"
    },
    "prompt": "물방울이 굴러가는 연잎 특징을 이용한 설계 목표로 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "가방 속 물건의 무게를 없애기",
      "가방 끈의 색을 무조건 진하게 하기",
      "가방 안에 공기를 전혀 못 넣게 하기",
      "가방 덮개에 물이 덜 머물게 하기",
      "가방의 길이를 재지 않고 맞히기"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "물을 머무르게 하지 않는 덮개 아이디어와 연결할 수 있어요. 실제 방수 성능은 만들어 시험한 결과와 구별해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-21",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 21,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과03-02"
    },
    "prompt": "환경과 식물의 생활을 설명하려고 해요. 근거를 확인하는 방법 두 가지를 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "사진에서 가려진 부분은 없는 것으로 기록한다.",
      "식물이 자라는 장소와 사진의 출처를 남긴다.",
      "식물 한 종류로 모든 식물의 생활을 정한다.",
      "몸의 생김새와 그 환경에서의 생활 자료를 함께 본다.",
      "물에 살면 잎과 꽃이 모두 뜬다고 미리 정한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        3
      ]
    },
    "explanation": "어디에서 얻은 자료인지와 환경·생김새·생활을 함께 확인해야 관련을 설명할 수 있어요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-22",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 22,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과03-01"
    },
    "prompt": "표의 기준에 따르면 더 확인 모둠에 남겨야 하는 잎의 이름표를 쓰세요.",
    "givens": {
      "표": {
        "머리": [
          "이름표",
          "가장자리 관찰"
        ],
        "행": [
          [
            "잎 가",
            "톱니가 보임"
          ],
          [
            "잎 나",
            "가장자리가 매끈함"
          ],
          [
            "잎 다",
            "가장자리가 사진 밖으로 가려짐"
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "잎 다",
      "accepted": [
        "잎 다",
        "다"
      ]
    },
    "explanation": "톱니 유무를 확인할 수 없는 잎 다는 더 확인으로 남겨요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-23",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 23,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과03-03"
    },
    "prompt": "연잎 특징을 비 오는 날 가방 덮개에 이용하려 해요. 기대하는 도움을 물과 관련지어 쓰세요.",
    "givens": {
      "제시 특징": "연잎 위에서는 물방울이 굴러가기도 해요."
    },
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "덮개에서 물이 잘 흘러내려 가방이 덜 젖게 하고 싶어요.",
      "rubric": {
        "required": [
          "물방울이 머무르지 않아 덜 젖는 도움을 설명함"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 원자료의 공식 배점표가 아니다."
        ],
        "pass": "제시 자료와 기준에 맞게 설명한다."
      }
    },
    "explanation": "물방울이 굴러가는 특징을 덮개에서 물이 흘러내려 덜 젖는 도움과 연결해요. 실제 덮개의 성능은 만들고 시험한 결과로 따로 확인해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-24",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 24,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과04-01"
    },
    "prompt": "한살이 관찰을 나중에도 이어 비교하기 가장 좋은 기록은 무엇인가요?",
    "givens": null,
    "choices": [
      "예쁘다고 느낀 날만 날짜 없이 모은 기록",
      "다른 동물을 같은 개체인 것처럼 섞은 기록",
      "관찰하지 않은 변화를 예상만으로 채운 기록",
      "날짜·개체 이름표·글·그림을 남긴 기록",
      "이름표 없이 몸집이 큰 사진만 남긴 기록"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "언제 어떤 개체를 관찰했는지와 실제 변화를 글·그림으로 함께 남기면 한살이를 이어 비교할 수 있어요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-25",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 25,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과04-01"
    },
    "prompt": "배추흰나비의 한살이 순서로 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "알 → 번데기 → 애벌레 → 어른벌레",
      "애벌레 → 알 → 번데기 → 어른벌레",
      "번데기 → 어른벌레 → 애벌레 → 알",
      "알 → 어른벌레 → 번데기 → 애벌레",
      "알 → 애벌레 → 번데기 → 어른벌레"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "배추흰나비는 알에서 애벌레가 나온 뒤 번데기를 거쳐 어른벌레가 돼요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-26",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 26,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과04-02"
    },
    "prompt": "햇빛이 식물의 자람에 필요한지 비교할 계획으로 알맞은 것은 무엇인가요?",
    "givens": {
      "조건": "같은 종류이고 처음 자란 정도가 비슷한 식물 두 개를 써요."
    },
    "choices": [
      "물과 햇빛을 두 화분에서 모두 다르게 한다.",
      "한 화분만 물을 주고 햇빛은 같게 한다.",
      "물은 같게 주고 햇빛을 받는 조건만 달리한다.",
      "서로 다른 종류의 식물을 한 개씩 고른다.",
      "다 자란 식물과 막 싹튼 식물의 크기만 비교한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "알아보려는 햇빛 조건만 다르게 하고 물 등 다른 조건을 같게 해야 비교할 수 있어요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-27",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 27,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과04-02"
    },
    "prompt": "씨가 싹트는 데 물이 필요한지 알아보려 해요. 두 모둠에서 달리할 조건은 무엇인가요?",
    "givens": {
      "조건": "같은 종류의 씨를 같은 개수로 준비하고 온도도 같게 해요."
    },
    "choices": [
      "물을 주는 조건",
      "씨의 종류를 고르는 조건",
      "씨를 놓는 장소의 온도",
      "준비하는 씨의 개수",
      "모든 조건을 동시에 바꾸는 방법"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "물이 필요한지 알아보려면 물 조건을 달리해요. 씨 종류·개수·온도는 같게 맞춰 비교해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-28",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 28,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과04-03"
    },
    "prompt": "가상 기록에서 한해살이로 판단한 근거는 무엇인가요?",
    "givens": {
      "가상 기록": "봄에 씨에서 싹이 나 자란 뒤 꽃과 열매를 만들었고, 그해 겨울 전에 그 개체의 한살이가 끝났어요."
    },
    "choices": [
      "잎이 초록색으로 보였던 식물이다.",
      "한 해 안에 그 개체의 한살이가 끝났다.",
      "씨가 생겼으므로 반드시 여러해를 산다.",
      "키가 작으므로 모든 경우 한해살이다.",
      "봄에 싹이 났으므로 겨울에도 반드시 산다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "씨에서 자라 새 씨를 남기고 한 해 안에 그 개체의 한살이가 끝난 기록을 근거로 판단해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-29",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 29,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과04-03"
    },
    "prompt": "한살이 소개 자료를 실제로 공유한 뒤 남길 기록 두 가지를 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "의견을 나눈 날짜와 상대를 적는다.",
      "아직 듣지 않은 친구 의견을 만들어 적는다.",
      "자료의 출처는 공유할 때 모두 지워 버린다.",
      "실제로 받은 질문과 고친 부분을 적는다.",
      "다운로드만 하면 발표 완료로 표시한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "실제로 누구와 언제 나눴는지, 어떤 질문과 수정이 있었는지를 남겨요. 파일을 만든 것과 소통한 것은 구별해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f1-30",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 30,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과04-01"
    },
    "prompt": "배추흰나비에서 애벌레와 어른벌레 사이에 거치는 단계의 이름을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "번데기",
      "accepted": [
        "번데기"
      ]
    },
    "explanation": "배추흰나비는 애벌레 다음에 번데기 단계를 거쳐 어른벌레가 돼요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-01",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 1,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과01-01"
    },
    "prompt": "짐의 무게에 따라 드는 힘이 다른지 비교할 때 같게 할 조건으로 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "수레에 실을 짐의 무게 자체",
      "무거운 쪽에만 더 매끄러운 바닥",
      "수레의 바퀴 상태와 움직이는 바닥",
      "가벼운 쪽에만 더 큰 수레 바퀴",
      "무게와 바퀴 상태를 모두 바꾸기"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "알아보려는 짐의 무게는 다르게 하고 바퀴·바닥·움직이는 방법은 같게 해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-02",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 2,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과01-02"
    },
    "prompt": "수평대 모형의 기록에서 알 수 있는 것은 무엇인가요?",
    "givens": {
      "관찰": "빈 판자는 수평이었어요. 받침점에서 왼쪽 4칸에 가, 오른쪽 2칸에 나를 놓자 수평이 됐어요."
    },
    "choices": [
      "가가 나보다 더 무겁다.",
      "나가 가보다 더 무겁다.",
      "가와 나의 무게는 같다.",
      "가가 나보다 반드시 크다.",
      "두 물체에는 무게가 없다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "서로 다른 거리에서 수평을 이루면 받침점에 가까이 놓인 물체가 더 무거워요. 계산식은 요구하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-03",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 3,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과01-04"
    },
    "prompt": "같은 물체를 같은 용수철로 천천히 들어 올린 가상 기록이에요. 이 결과와 맞는 설명은 무엇인가요?",
    "givens": {
      "모형 값": [
        "직접 들기: 원래 길이보다 8 cm 늘어남",
        "빗면 이용: 원래 길이보다 5 cm 늘어남",
        "지레 이용: 원래 길이보다 3 cm 늘어남"
      ],
      "조건": "같은 용수철의 사용 한도를 넘지 않았어요."
    },
    "choices": [
      "이 기록에서는 직접 들 때 드는 힘이 가장 작다.",
      "이 기록에서는 지레를 쓸 때 드는 힘이 가장 작다.",
      "이 기록에서는 빗면을 쓸 때 드는 힘이 가장 크다.",
      "이 기록에서는 세 방법의 드는 힘이 모두 같다.",
      "도구를 쓸 때마다 같은 물체의 무게 자체가 줄었다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "이 기록에서는 용수철이 가장 적게 늘어난 지레 사용의 힘이 가장 작아요. 모든 사용 조건에서도 순서가 같다고 단정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-04",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 4,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과01-04"
    },
    "prompt": "조사한 도구의 쓰임을 친구에게 설명하려 해요. 발표를 보완하는 방법으로 알맞은 것은 무엇인가요?",
    "givens": {
      "친구 질문": "어떤 물체를 어떻게 옮길 때 도움이 되었나요?"
    },
    "choices": [
      "사용 결과만 보여 주고 물체 설명을 빼 버린다.",
      "전혀 다른 물체의 무게 값만 모아 덧붙인다.",
      "사용 상황과 옮기는 방법이 보이는 자료를 더한다.",
      "힘의 차이는 빼고 도구 자체 무게만 설명한다.",
      "도구 길이만 설명하고 옮기는 방법은 생략한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "어떤 상황에서 어떻게 이용했는지와 확인한 근거를 보여 주면 질문에 맞게 발표를 보완할 수 있어요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-05",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 5,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과01-04"
    },
    "prompt": "기울어진 판자의 도움을 비교한 실험 기록에 남길 내용 두 가지를 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "두 방법의 조건이 달라도 같은 비교라고 적은 결과",
      "두 방법에서 같게 한 물체와 사용 조건",
      "실제로 옮기지 않았지만 측정했다고 적은 예상",
      "도구 길이만으로 힘의 크기를 정해 적은 결론",
      "직접 들 때와 판자를 쓸 때의 관찰 결과"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    },
    "explanation": "비교한 결과와 조건이 있어야 도구의 도움을 근거로 설명할 수 있어요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-06",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 6,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과01-03"
    },
    "prompt": "손 어림의 결과가 서로 달라 무게를 정확히 비교하려 해요. 사용할 도구의 이름을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "저울",
      "accepted": [
        "저울",
        "전자저울",
        "용수철저울"
      ]
    },
    "explanation": "저울을 사용하면 무게를 값으로 재어 정확히 비교할 수 있어요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-07",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 7,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과01-01"
    },
    "prompt": "짐의 무게만 달리해 드는 힘을 비교하려 해요. 아래 계획에서 바닥 조건을 어떻게 고칠지 쓰세요.",
    "givens": {
      "계획": "같은 수레에 짐을 적게 실었을 때는 매끈한 바닥에서, 많이 실었을 때는 거친 바닥에서 밀어요. 바퀴 상태와 미는 방법은 같아요."
    },
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "짐이 적을 때와 많을 때 모두 같은 바닥에서 밀어요.",
      "rubric": {
        "required": [
          "두 경우의 바닥 조건을 같게 수정함"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 원자료의 공식 배점표가 아니다."
        ],
        "pass": "제시 자료와 기준에 맞게 설명한다."
      }
    },
    "explanation": "무게가 달라질 때 드는 힘을 비교하려면 바닥은 같게 맞춰야 해요. 바닥까지 다르면 무게와 바닥 중 무엇 때문에 힘이 달라졌는지 구별하기 어려워요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-08",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 8,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과02-01"
    },
    "prompt": "날개가 있는지로 분류했어요. 자료가 부족해 더 확인할 대상으로 알맞은 것은 무엇인가요?",
    "givens": {
      "관찰 기록": [
        "가: 몸 양옆의 날개를 확인함",
        "나: 몸 전체에서 날개가 없는 것을 확인함",
        "다: 등 부분이 다른 물체에 가려짐"
      ]
    },
    "choices": [
      "가",
      "나",
      "가와 나",
      "세 대상 모두",
      "다"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "다의 가려진 부분은 날개가 없다고 단정할 수 없어요. 다른 사진이나 실제 관찰로 확인해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-09",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 9,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과02-01"
    },
    "prompt": "두 모둠의 분류 결과가 다른 까닭으로 알맞은 것은 무엇인가요?",
    "givens": {
      "기록": "같은 동물 자료를 한 모둠은 다리 유무로, 다른 모둠은 날개 유무로 나눴어요."
    },
    "choices": [
      "누가 분류하든 어떤 기준에서도 결과는 같다.",
      "같은 동물은 두 기준으로 살필 수 없다.",
      "서로 다른 몸 특징을 기준으로 삼았다.",
      "다리와 날개는 언제나 같은 몸 부분이다.",
      "기준을 바꾸면 원래 관찰 기록은 필요 없다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "분류 기준이 달라지면 같은 동물도 서로 다른 모둠에 들어갈 수 있어요. 기준과 동물별 근거를 함께 비교해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-10",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 10,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과02-02"
    },
    "prompt": "제시 자료를 근거로 설명한 것은 무엇인가요?",
    "givens": {
      "조사 자료": "사막여우는 귀가 커서 몸의 열을 내보내는 데 도움이 돼요. 자료에는 건조하고 더운 곳에서의 생활이 소개돼요."
    },
    "choices": [
      "사막의 모든 동물은 귀 크기가 같다.",
      "사막여우의 귀에는 물을 저장한다.",
      "몸의 열은 등 혹에만 저장해 둔다.",
      "자료와 상관없이 모든 사막이 늘 춥다.",
      "큰 귀와 열을 내보내는 생활을 연결한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "조사한 사막여우의 귀와 열을 내보내는 도움을 연결해 설명해요. 모든 사막 동물에 같은 특징을 적용하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-11",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 11,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과02-03"
    },
    "prompt": "문어 빨판의 붙는 특징을 이용한 아이디어로 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "흙의 깊이를 재는 긴 자",
      "빛의 색깔을 바꾸는 전등",
      "모래를 담아 무게를 재는 통",
      "물을 위로 뿜어내는 분수",
      "유리 벽에 붙여 거는 걸이"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "붙는 특징과 유리 벽에 걸이를 고정하는 기능을 연결할 수 있어요. 실제 성능은 확인해 봐야 해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-12",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 12,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과02-03"
    },
    "prompt": "친구의 실제 의견을 반영한 기록은 무엇인가요?",
    "givens": {
      "친구 의견": "집게 끝이 미끄러워 작은 물건을 놓칠 것 같아."
    },
    "choices": [
      "아직 듣지 않은 다른 친구 의견을 덧붙인다.",
      "좋은 설계이므로 질문은 모두 지워 버린다.",
      "집게 끝 재료를 바꾸어 다시 잡아 보려 한다.",
      "도구 이름만 바꾸고 문제는 끝났다고 정한다.",
      "시험하지 않고 완성품 성능을 측정값처럼 쓴다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "지적한 미끄러움과 연결된 재료·확인 방법을 보완한 기록이에요. 계획과 실제 시험 결과는 나누어 적어요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-13",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 13,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과02-03"
    },
    "prompt": "설계 계획과 실제 실행을 구별해 적은 기록은 무엇인가요?",
    "givens": null,
    "choices": [
      "제작은 아직 안 했고 내일 잡는 시험을 할 계획이다.",
      "그림을 그렸으니 실제 제작과 시험도 모두 끝났다.",
      "친구에게 보여 줄 예정이니 소통 완료로 적었다.",
      "시험하지 않았지만 실제 측정값을 만들어 적었다.",
      "좋아 보이는 도구이므로 성능이 증명됐다고 적었다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "하지 않은 제작·시험·소통은 계획으로 남겨요. 그림이나 파일 작성만으로 실제 수행을 했다고 기록하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-14",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 14,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과02-02"
    },
    "prompt": "제시 조사 자료와 맞는 설명 두 가지를 고르세요. (정답 2개)",
    "givens": {
      "조사 자료": [
        "두더지: 크고 넓은 앞발로 땅을 파며 굴에서 생활함",
        "개구리: 물갈퀴가 있는 발로 물속에서 헤엄침"
      ]
    },
    "choices": [
      "두 동물 모두 같은 지느러미로만 이동한다.",
      "개구리의 발과 물속 이동을 연결할 수 있다.",
      "앞발이 넓은 모든 동물은 물속에서만 생활한다.",
      "두더지의 앞발과 굴 생활을 연결할 수 있다.",
      "물에 사는 모든 동물은 개구리와 같은 발이 있다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        3
      ]
    },
    "explanation": "몸 특징과 조사한 생활 모습을 동물별로 연결해요. 한 특징을 다른 동물 전체에 적용하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-15",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 15,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과02-01"
    },
    "prompt": "날개가 있는가로 분류했을 때 잘못 들어간 동물 이름을 쓰세요.",
    "givens": {
      "분류 기록": [
        "있다: 나비, 참새, 고양이",
        "없다: 지렁이, 달팽이"
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "고양이",
      "accepted": [
        "고양이"
      ]
    },
    "explanation": "고양이는 날개가 없으므로 없다 모둠으로 옮겨야 해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-16",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 16,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과03-01"
    },
    "prompt": "잎 관찰 기록 중 직접 확인한 사실과 생각을 구별한 것은 무엇인가요?",
    "givens": {
      "관찰": "살펴본 잎의 끝이 뾰족한 것을 확인했어요. 물을 떨어뜨려 보는 실험은 아직 하지 않았어요."
    },
    "choices": [
      "끝이 뾰족하다 / 빗물이 잘 흘러갈 것 같다.",
      "물을 잘 흘린다 / 끝이 뾰족하게 보인다.",
      "사진 밖 부분은 없다 / 끝부분이 보인다.",
      "모든 잎은 똑같다 / 이 잎은 다를 수도 있다.",
      "재지 않아도 길이는 10 cm다 / 다음에 자로 잰다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "끝이 뾰족한 모습은 관찰한 사실이고, 그 쓰임은 더 확인할 생각으로 구별해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-17",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 17,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과03-02"
    },
    "prompt": "제시한 높은 산 식물 자료와 관련된 설명은 무엇인가요?",
    "givens": {
      "조사 자료": "바람이 강한 높은 곳에서 키가 작고 옆으로 퍼져 자라는 식물을 조사했어요."
    },
    "choices": [
      "모든 높은 산 식물의 모습은 완전히 같다고 정한다.",
      "조사한 생김새를 바람이 강한 환경과 연결한다.",
      "키가 작으면 자라는 곳을 보지 않고 사막으로 정한다.",
      "바람이 없었다고 제시 자료와 반대로 설명한다.",
      "옆으로 자란 식물은 물속에서만 산다고 단정한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "조사한 식물의 모습과 환경을 연결해 설명해요. 모든 산 식물에 똑같은 특징을 적용하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-18",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 18,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과03-03"
    },
    "prompt": "열매의 갈고리가 옷감에 걸리는 특징을 이용한 설계로 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "저울의 숫자를 표시하는 화면",
      "비가 온 날짜를 적는 달력 칸",
      "씨가 자라는 온도를 재는 부분",
      "여닫으며 붙였다 떼는 끈의 끝부분",
      "물체를 굴러가게 하는 둥근 바퀴"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "갈고리가 걸려 붙는 특징은 붙였다 떼는 끈의 아이디어와 연결할 수 있어요. 실제 제품의 발명 유래를 묻는 문제는 아니에요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-19",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 19,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과03-03"
    },
    "prompt": "연잎 특징을 이용한 두 덮개를 비교할 계획으로 알맞은 것은 무엇인가요?",
    "givens": {
      "목표": "물방울이 덜 머무르는 덮개를 찾으려 해요."
    },
    "choices": [
      "한 덮개에만 아주 많은 물을 붓고 더 젖는지 본다.",
      "서로 다른 크기의 물방울로 여러 조건을 함께 바꾼다.",
      "물을 떨어뜨리지 않고 색깔만 보고 성능을 정한다.",
      "덮개 이름이 더 멋지면 물이 덜 묻는다고 정한다.",
      "같은 양의 물을 같은 방법으로 떨어뜨려 비교한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "비교할 물의 양·떨어뜨리는 방법 등을 같게 하고 물방울이 머무르는 모습을 살펴요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-20",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 20,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과03-03"
    },
    "prompt": "친구와 실제로 의견을 나눈 기록으로 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "다운로드한 날짜만으로 소통 완료를 정한다.",
      "상대가 말하지 않은 칭찬을 대신 지어 적는다.",
      "그림 파일만 저장하면 모든 의견을 들었다고 적는다.",
      "상대·날짜·받은 질문·고친 부분을 남긴다.",
      "질문을 받지 않으려고 자료 출처를 지워 버린다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "자료를 만든 일과 실제로 의견을 나눈 일은 구별해요. 질문과 보완 흔적을 함께 남겨요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-21",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 21,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과03-01"
    },
    "prompt": "잎을 톱니 유무로 분류할 때 알맞은 방법 두 가지를 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "색깔이 마음에 들면 톱니가 있다고 정한다.",
      "가려진 잎은 더 확인으로 남기고 자료를 찾는다.",
      "실제 크기는 확대 비율이 다른 사진만으로 정한다.",
      "각 잎의 가장자리를 같은 기준으로 살핀다.",
      "기준을 바꿔도 모든 잎의 모둠을 그대로 둔다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        3
      ]
    },
    "explanation": "같은 기준을 적용하고 자료가 부족한 잎은 더 확인해요. 다른 기준의 기록은 따로 비교해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-22",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 22,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과03-02"
    },
    "prompt": "자료에서 물에 떠 있는 모습과 연결한 부레옥잠의 몸 부분 이름을 쓰세요.",
    "givens": {
      "제시 자료": "잎자루가 볼록하고 그 안에 공기가 든 부분이 있어 물에 떠 있는 데 도움이 돼요."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "잎자루",
      "accepted": [
        "잎자루"
      ]
    },
    "explanation": "제시한 몸 부분은 잎자루예요. 모든 물 식물이 같은 방법으로 떠 있다고 일반화하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-23",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 23,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과04-01"
    },
    "prompt": "동물 한살이 관찰에서 날짜와 개체 이름표를 함께 쓰는 까닭은 무엇인가요?",
    "givens": null,
    "choices": [
      "같은 개체의 시간에 따른 변화를 비교하기 위해",
      "다른 동물 사진을 같은 동물처럼 바꾸기 위해",
      "관찰하지 않은 날짜의 결과를 채워 넣기 위해",
      "몸집이 큰 개체만 정답으로 고르기 위해",
      "한 번 본 모습으로 평생의 모습을 정하기 위해"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "언제 어떤 개체를 관찰했는지 있어야 실제 변화의 순서를 이어 비교할 수 있어요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-24",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 24,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과04-02"
    },
    "prompt": "식물이 자라는 데 물이 필요한지 알아보는 계획으로 알맞은 것은 무엇인가요?",
    "givens": {
      "준비": "같은 종류이고 자란 정도가 비슷한 식물 두 화분을 준비했어요."
    },
    "choices": [
      "물과 햇빛을 두 화분에서 모두 다르게 한다.",
      "햇빛은 같게 하고 물을 주는 조건만 달리한다.",
      "씨 종류와 물의 양을 모두 다르게 정한다.",
      "물은 같게 주고 햇빛을 받는 조건만 바꾼다.",
      "한 화분은 씨만 놓고 다른 화분은 큰 나무를 둔다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "알아보려는 물 조건만 다르게 하고 햇빛 등 다른 조건은 같게 맞춰요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-25",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 25,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과04-02"
    },
    "prompt": "가상 자람 기록으로 말할 수 있는 것은 무엇인가요?",
    "givens": {
      "표": {
        "머리": [
          "조건",
          "처음 높이",
          "7일 뒤 높이"
        ],
        "행": [
          [
            "햇빛 받음·같은 물",
            "4 cm",
            "7 cm"
          ],
          [
            "어둠·같은 물",
            "4 cm",
            "8 cm"
          ]
        ]
      }
    },
    "choices": [
      "어두운 곳이 더 높으니 건강한 자람도 더 좋다고 본다.",
      "처음 높이가 같으니 햇빛은 자람과 관계없다고 본다.",
      "높이 차이가 작으니 잎 색과 줄기 모습은 안 봐도 된다.",
      "높이와 함께 잎 색과 줄기 모습도 확인한다.",
      "둘 다 키가 커졌으니 햇빛 조건도 같았다고 정한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "어두운 곳에서 키가 더 커 보일 수도 있어요. 건강하게 자라는지는 잎 색·줄기 모습 등도 함께 관찰해야 해요. 표는 모형 값이에요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-26",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 26,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과04-03"
    },
    "prompt": "같은 개체가 여러해를 산 근거로 알맞은 기록은 무엇인가요?",
    "givens": {
      "가상 조사": "겨울을 넘긴 뿌리와 줄기를 확인했고, 같은 개체에서 다음 봄에 다시 싹이 자랐어요."
    },
    "choices": [
      "겨울을 넘긴 같은 개체가 다시 자랐다.",
      "같은 자리에 새 씨에서 싹이 난 것만 보았다.",
      "이름이 같은 식물 사진 두 장만 모았다.",
      "키가 작다는 이유만으로 같은 개체라고 정했다.",
      "겨울 전 사진 한 장만 보고 다음 해까지 살았다고 정했다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "같은 자리에 새 씨에서 난 식물과 겨울을 넘긴 같은 개체를 구별해요. 같은 개체가 여러해를 살았다는 기록이 근거예요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-27",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 27,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과04-03"
    },
    "prompt": "한살이 소개 자료를 고치는 방법으로 알맞은 것은 무엇인가요?",
    "givens": {
      "친구 질문": "씨가 생긴 다음에는 어떻게 이어지나요?"
    },
    "choices": [
      "기존 개체가 다시 씨로 되돌아가는 모습을 넣는다.",
      "새 씨의 자람 자료를 빼고 꽃 사진만 더 모은다.",
      "다른 종류의 싹을 기존 개체와 같다고 이어 붙인다.",
      "새 씨에서 다음 세대가 자라는 과정을 자료에 더한다.",
      "자란 순서 대신 키가 큰 사진부터 작게 배열한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "한 개체가 씨로 되돌아가는 것이 아니라 새 씨에서 다음 세대가 이어지는 과정을 설명해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-28",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 28,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과04-01"
    },
    "prompt": "관찰한 사실로 기록할 수 있는 내용 두 가지를 고르세요. (정답 2개)",
    "givens": {
      "가상 관찰": "어제와 같은 이름표의 애벌레를 오늘 다시 살펴보았어요."
    },
    "choices": [
      "오늘 날짜와 몸의 모습을 그림으로 남긴다.",
      "다른 개체의 사진을 같은 개체 사진으로 쓴다.",
      "아직 되지 않은 번데기를 오늘 사실로 적는다.",
      "보지 않은 밤사이 행동을 확정해서 적는다.",
      "자로 잰 오늘의 길이를 단위와 함께 적는다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        4
      ]
    },
    "explanation": "실제로 확인한 날짜·모습·측정값을 기록해요. 추측과 다른 개체 자료는 나누어 표시해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-29",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 29,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과04-03"
    },
    "prompt": "한 개체가 한 해 안에 싹트고 자라 씨를 남긴 뒤 한살이를 마치는 식물의 유형을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "한해살이",
      "accepted": [
        "한해살이",
        "한해살이 식물"
      ]
    },
    "explanation": "한 개체의 한살이가 한 해 안에 끝나는 유형은 한해살이예요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  },
  {
    "id": "s31-fin-f2-30",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 30,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등 3-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과04-02"
    },
    "prompt": "햇빛 조건만 달리해 자람을 비교하려 해요. 아래 계획의 물 조건을 어떻게 고칠지 쓰세요.",
    "givens": {
      "계획": "같은 종류·비슷한 크기의 두 화분 중 햇빛을 받는 화분에만 물을 주고, 어두운 화분에는 물을 주지 않으려 해요."
    },
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "두 화분에 물을 같은 양과 방법으로 주어요.",
      "rubric": {
        "required": [
          "두 화분의 물 조건을 같게 수정함"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 원자료의 공식 배점표가 아니다."
        ],
        "pass": "제시 자료와 기준에 맞게 설명한다."
      }
    },
    "explanation": "햇빛 조건이 자람에 주는 영향을 비교하려면 물 조건은 같게 맞춰야 해요. 물도 함께 달리하면 어느 조건이 자람의 차이와 관련되는지 구별하기 어려워요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-17",
      "against": "교육부 성취기준과 검수한 3-1 네 단원 자료",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다."
    }
  }
];
