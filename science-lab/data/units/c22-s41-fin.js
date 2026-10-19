export const unit = {
  "id": "c22-s41-fin",
  "course": "4-1",
  "no": null,
  "title": "기말평가 · 창작",
  "domain": "종합",
  "sources": {
    "basis": [
      "science-lab/bank/work/s41u01/curriculum.json",
      "science-lab/bank/work/s41u02/curriculum.json",
      "science-lab/bank/work/s41u03/curriculum.json",
      "science-lab/bank/work/s41u04/curriculum.json"
    ],
    "originalExamAvailable": false
  },
  "assessment": {
    "authored": true,
    "forms": [
      1,
      2
    ],
    "perForm": 52,
    "scope": [
      "자석의 이용",
      "물의 상태 변화",
      "땅의 변화",
      "다양한 생물과 우리 생활"
    ],
    "scopeNote": "1~4단원 학습용 구성·학교별 공식 시험 범위와 별개",
    "performanceNote": "실제 관찰·설계·제작·조사·실천·소통은 별도 확인한다."
  }
};
export const items = [
  {
    "id": "c22-s41-fin-f1-01",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 1,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-01",
      "topic": "자석과 물체의 상호작용",
      "concept": "자석과 물체의 상호작용",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "같은 자석으로 보관함 재료를 시험한 기록입니다. 자료가 뒷받침하는 설명은 무엇인가요?",
    "givens": {
      "가상 관찰 기록": {
        "머리": [
          "시료",
          "같은 거리에서의 결과"
        ],
        "행": [
          [
            "철 조각",
            "붙음"
          ],
          [
            "알루미늄 조각",
            "붙지 않음"
          ],
          [
            "나무 조각",
            "붙지 않음"
          ]
        ]
      }
    },
    "choices": [
      "금속 조각은 모두 붙었다.",
      "자석이 닿아야만 붙는다.",
      "붙지 않으면 모두 나무다.",
      "제시한 철 조각이 붙었다.",
      "색이 진한 재료만 붙었다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "철 조각이 붙었다는 결과를 읽어요. 이 세 시료의 결과로 모든 금속이나 색의 영향을 단정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-02",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 2,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-01",
      "topic": "자석과 물체의 상호작용",
      "concept": "자석과 물체의 상호작용",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "얇은 종이 아래 자석으로 철 클립을 움직였습니다. 다음 비교 계획 중 타당한 것을 두 가지 고르세요.",
    "givens": null,
    "choices": [
      "같은 자석으로 종이 두께만 바꾸어 본다.",
      "클립이 움직인 결과를 나무 조각에도 적용한다.",
      "한 번 안 움직이면 모든 종이가 힘을 막는다고 쓴다.",
      "종이를 고정하고 자석과 클립 거리를 바꾼다.",
      "자석과 클립을 함께 바꾸고 두께 효과를 비교한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "한 번에 살필 조건만 바꾸고 나머지는 유지해야 비교할 수 있어요. 한 결과를 모든 종이나 재료로 확대하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-03",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 3,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-01",
      "topic": "자석과 물체의 상호작용",
      "concept": "자석과 물체의 상호작용",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "붙는지 시험할 부품의 실제 재료를 적었습니다. 자석 수거함에 끌릴 수 있는 철 부분의 기호를 쓰세요.",
    "givens": {
      "연습 자료": "ㄱ 플라스틱 뚜껑 / ㄴ 유리판 / ㄷ 철 받침 / ㄹ 고무 끈"
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
    "explanation": "제시한 부품 중 철 받침이 자석에 끌릴 수 있어요. 모양이나 쓰임새만으로 고르지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-04",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 4,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-01",
      "topic": "자석과 물체의 상호작용",
      "concept": "자석과 물체의 상호작용",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "한 조는 자석과 철 조각 사이 거리를 바꾸면서 자석도 작은 것에서 큰 것으로 바꿨습니다. 거리만의 영향을 비교하도록 계획을 고쳐 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "같은 자석과 같은 철 조각을 쓰고 방향·받침을 유지하며 거리만 바꾼다. 각 거리에서 같은 방법으로 관찰하고 결과를 기록한다.",
      "rubric": {
        "required": [
          "같은 자석·철 조각과 다른 조건 유지",
          "거리만 바꾸고 같은 방법으로 비교"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "자석까지 바꾸면 결과 차이가 거리 때문인지 자석 때문인지 구별하기 어려워요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-05",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 5,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-02",
      "topic": "극과 자석 사이 상호작용",
      "concept": "극과 자석 사이 상호작용",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "두 막대자석의 마주 보는 극이 다음과 같습니다. 밀어내는 경우는 어느 것인가요?",
    "givens": null,
    "choices": [
      "자석과 철 고리",
      "N극과 S극",
      "N극과 N극",
      "S극과 N극",
      "자석과 철 못"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "같은 극끼리는 밀어내고 다른 극끼리는 끌어당겨요. 철 물체는 이 극 비교와 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-06",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 6,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-02",
      "topic": "극과 자석 사이 상호작용",
      "concept": "극과 자석 사이 상호작용",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "막대자석 두 개를 움직여 관찰하려고 합니다. 극의 성질을 확인하는 방법 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "자석의 극을 보지 않고 색이 같으면 같은 극이라 쓴다.",
      "두 자석을 붙여 고정하고 움직이지 않는다고 쓴다.",
      "N극과 S극을 마주 보게 하여 움직임을 살핀다.",
      "N극끼리 마주 보게 하여 움직임을 살핀다.",
      "자석 사이 거리를 바꾼 뒤 극의 차이만 비교한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        3
      ]
    },
    "explanation": "같은 극과 다른 극을 각각 가까이하여 비교해요. 움직임을 볼 수 있게 두고 거리 등 비교 조건도 맞춰요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-07",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 7,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-02",
      "topic": "극과 자석 사이 상호작용",
      "concept": "극과 자석 사이 상호작용",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "자유롭게 돌아가는 막대자석을 여러 번 놓았습니다. 계속 북쪽을 가리킨 끝의 극을 기호로 쓰세요.",
    "givens": {
      "연습 자료": "주변에 다른 자석을 두지 않고 자석이 멈춘 뒤 방향을 읽었다. 북쪽을 가리킨 끝을 묻는다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "N",
      "accepted": [
        "N",
        "N극",
        "n"
      ]
    },
    "explanation": "자유롭게 움직이는 자석에서 북쪽을 가리키는 극을 N극이라고 해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-08",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 8,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-02",
      "topic": "극과 자석 사이 상호작용",
      "concept": "극과 자석 사이 상호작용",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "미지의 끝 X와 표시된 N극이 서로 밀어냈습니다. X의 극을 판단하고, 관찰 결과와 연결해 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "X는 N극이다. 같은 극끼리 밀어내므로 표시된 N극을 밀어낸 X도 N극으로 판단한다.",
      "rubric": {
        "required": [
          "X를 N극으로 판단",
          "같은 극의 밀어냄을 관찰과 연결"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "붙는 모습만 보았을 때와 달리 자석끼리의 밀어냄은 같은 극임을 판단하는 근거가 돼요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-09",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 9,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-03",
      "topic": "자석 생활 장치 설계",
      "concept": "자석 생활 장치 설계",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "종이 알림판을 얇은 플라스틱 덮개 바깥에서 붙잡는 도구를 설계합니다. 자석을 쓸 수 있는 구성은 무엇인가요?",
    "givens": null,
    "choices": [
      "유리 두 개의 같은 극이 당긴다고 설계한다.",
      "자석과 철 조각으로 사이 종이를 잡는다.",
      "종이만 두고 자석 없이 끌어당기게 한다.",
      "고무 끈을 붙이지 않고 저절로 당기게 한다.",
      "나무 두 개를 자석 극이라 하고 마주 댄다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "자석이 철을 끌어당기는 성질을 이용할 수 있어요. 실제 덮개 두께에서 잡히는지는 제작 후 확인해야 해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-10",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 10,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-03",
      "topic": "자석 생활 장치 설계",
      "concept": "자석 생활 장치 설계",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "책상 아래 떨어진 철 부품을 모으는 도구의 설계에 담을 내용 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "자석을 달기 전부터 실제 수거 성공으로 표시",
      "손잡이 끝에 자석을 고정하는 방법",
      "붙지 않는 모든 물체도 철이라고 결론 내리기",
      "자석이 없어도 같은 성질이 생긴다고 적기",
      "철 부품을 모으는 목적과 시험 조건"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    },
    "explanation": "설계에는 목적·구조와 시험 계획을 담아요. 만들기 전의 계획은 실제 성공 결과와 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-11",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 11,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-03",
      "topic": "자석 생활 장치 설계",
      "concept": "자석 생활 장치 설계",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "다음 설계안 중 실제 시험 결과가 적힌 기록의 기호를 쓰세요.",
    "givens": {
      "연습 자료": "ㄱ 자석 손잡이를 만들어 볼 계획이다. / ㄴ 손잡이를 만든 뒤 같은 철 조각을 집어 보니 3번 중 2번 옮겼다. / ㄷ 철 조각을 잘 옮길 것 같다."
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
    "explanation": "ㄴ에는 제작 후 실제 시험 횟수와 관찰 결과가 있어요. 계획·예상만 있는 기록과 달라요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-12",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 12,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-03",
      "topic": "자석 생활 장치 설계",
      "concept": "자석 생활 장치 설계",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "철 안내판에 메모를 붙이는 자석 홀더를 설계하세요. 이용할 성질, 구조와 실제 시험 계획을 함께 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "철 안내판을 끌어당기는 자석을 손잡이 안에 고정한다. 같은 메모와 안내판에서 홀더가 버티는지 여러 번 시험하고 떨어지면 구조를 고친 뒤 다시 시험한다.",
      "rubric": {
        "required": [
          "자석과 철의 끌림을 목적·구조에 연결",
          "같은 조건 시험과 개선 계획"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "설계를 글로 쓴 것과 실제로 만들어 버티는지 시험한 것은 따로 기록해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-13",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 13,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-01",
      "topic": "물의 세 상태와 사례",
      "concept": "물의 세 상태와 사례",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "그림 자료에 얼음 조각, 컵 속 물, 보이지 않는 수증기가 나옵니다. 이 순서대로 상태를 나타낸 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "기체·액체·고체",
      "고체·기체·액체",
      "고체·액체·기체",
      "액체·기체·고체",
      "액체·고체·기체"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "얼음은 고체, 물은 액체, 수증기는 기체 상태예요. 눈에 보이는 뿌연 물방울과 수증기를 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-14",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 14,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-01",
      "topic": "물의 세 상태와 사례",
      "concept": "물의 세 상태와 사례",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "물의 세 상태를 구별한 설명 중 옳은 것을 두 가지 고르세요.",
    "givens": null,
    "choices": [
      "보이지 않는 수증기는 물과 관계없는 물질이다.",
      "뿌연 작은 물방울은 모두 기체 상태이다.",
      "컵을 기울이면 물의 양이 반드시 늘어난다.",
      "얼음 조각은 그릇을 옮겨도 자체 모양을 유지한다.",
      "컵 속 물은 담긴 그릇에 따라 모양이 바뀐다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        3,
        4
      ]
    },
    "explanation": "물을 다른 그릇에 옮기는 것과 상태 변화는 달라요. 액체는 그릇에 따라 모양이 바뀌고 얼음은 자체 모양이 있어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-15",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 15,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-01",
      "topic": "물의 세 상태와 사례",
      "concept": "물의 세 상태와 사례",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "상태를 나타내는 낱말을 골라 쓰세요. 보이지 않는 수증기는 물의 어떤 상태인가요?",
    "givens": {
      "연습 자료": "낱말: 고체 / 액체 / 기체"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "기체",
      "accepted": [
        "기체"
      ]
    },
    "explanation": "수증기는 기체 상태의 물이에요. 하얗게 보이는 작은 물방울과 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-16",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 16,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-01",
      "topic": "물의 세 상태와 사례",
      "concept": "물의 세 상태와 사례",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "친구가 “주전자 위에 보이는 하얀 것은 모두 수증기 자체야.”라고 말했습니다. 보이는 것과 보이지 않는 것을 구별하여 고쳐 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "수증기는 눈에 보이지 않는다. 주전자 밖에서 하얗게 보이는 것은 수증기가 식으며 생긴 작은 물방울이다.",
      "rubric": {
        "required": [
          "수증기는 보이지 않음",
          "하얀 부분을 작은 물방울과 연결"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "같은 물이라도 기체와 액체를 관찰 모습에 따라 구별해야 해요. 주전자 가까이에서 확인하는 활동을 지시하는 문제가 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-17",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 17,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-02",
      "topic": "다섯 상태 변화 관찰",
      "concept": "다섯 상태 변화 관찰",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "같은 조건으로 둔 젖은 천이 점점 말랐습니다. 물이 수증기로 변하는 현상의 이름은 무엇인가요?",
    "givens": null,
    "choices": [
      "녹기",
      "부서지기",
      "응결",
      "얼기",
      "증발"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "천의 물이 수증기로 변해 주변으로 퍼지는 것은 증발이에요. 천이 마른다는 관찰을 물이 없어졌다는 뜻으로만 쓰지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-18",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 18,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-02",
      "topic": "다섯 상태 변화 관찰",
      "concept": "다섯 상태 변화 관찰",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "다음 현상 중 수증기가 액체 물로 변하는 경우를 두 가지 고르세요.",
    "givens": null,
    "choices": [
      "차가운 뚜껑 안쪽에 물방울이 맺힌다.",
      "물을 냉동실에 두어 얼음으로 바꾼다.",
      "얼음 조각이 그릇 안에서 물로 녹는다.",
      "젖은 손수건을 펴 두자 물기가 마른다.",
      "찬 컵 바깥을 닦은 뒤 다시 물방울이 맺힌다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        4
      ]
    },
    "explanation": "수증기가 물로 변하는 응결의 사례를 골라요. 컵 바깥 물방울은 안의 물이 새어 나온 것으로 단정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-19",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 19,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-02",
      "topic": "다섯 상태 변화 관찰",
      "concept": "다섯 상태 변화 관찰",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "같은 마개를 닫은 병 전체를 같은 저울로 잰 연습 기록입니다. 두 표시값의 차이는 몇 g인가요? 숫자만 쓰세요.",
    "givens": {
      "가상 관찰 기록": {
        "머리": [
          "단계",
          "마른 병 전체 표시"
        ],
        "행": [
          [
            "얼리기 전",
            "176g"
          ],
          [
            "얼린 뒤",
            "176g"
          ]
        ]
      }
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "0",
      "accepted": [
        "0"
      ]
    },
    "explanation": "176-176=0g이에요. 이 기록의 같은 닫힌 병 전체를 비교한 결과이며 모든 실제 저울 오차가 0이라는 뜻은 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-20",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 20,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-02",
      "topic": "다섯 상태 변화 관찰",
      "concept": "다섯 상태 변화 관찰",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "교사가 제공한 냉동 전후 사진으로 물의 부피 변화를 살펴봅니다. 같은 조건을 확인하고 관찰 내용을 기록하는 방법을 써 보세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "사진이 같은 용기와 내용물을 다루는지 확인하고 시작 물높이 표시와 같은 바닥 기준을 비교한다. 사진의 시점과 달라진 모습·불분명한 점을 기록하고 관찰 전 예상과 구별한다.",
      "rubric": {
        "required": [
          "같은 용기·내용물과 높이 기준 확인",
          "관찰 시점·변화와 불분명한 점 기록"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "용기를 바꾸면 높이 차이가 용기 모양 때문일 수 있어요. 제공 사진을 해석한 것과 직접 실험한 기록도 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-21",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 21,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-03",
      "topic": "물을 얻는 장치 제작",
      "concept": "물을 얻는 장치 제작",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "따뜻한 물 위의 수증기를 차가운 덮개에 닿게 해 물방울을 모으는 장치입니다. 덮개에서 일어나는 변화는 무엇인가요?",
    "givens": null,
    "choices": [
      "물이 수증기로 증발한다.",
      "수증기가 덮개를 그대로 통과한다.",
      "물이 얼음으로 얼어붙는다.",
      "얼음이 물로 녹아내린다.",
      "수증기가 물로 응결한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "차가운 덮개에 닿은 수증기가 액체 물방울로 변해요. 모은 물을 마셔도 된다는 뜻은 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-22",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 22,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-03",
      "topic": "물을 얻는 장치 제작",
      "concept": "물을 얻는 장치 제작",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "물 얻기 장치를 만들고 시험하는 기록으로 적절한 것을 두 가지 고르세요.",
    "givens": null,
    "choices": [
      "모양이 맑으면 마셔도 된다고 결론 낸다.",
      "계획한 양을 실제 모은 양으로 바꿔 적는다.",
      "여러 부분을 바꾸고 한 부분의 효과라 쓴다.",
      "물방울이 모이지 않은 시행도 남긴다.",
      "실제로 모은 양과 시험 시간을 적는다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        3,
        4
      ]
    },
    "explanation": "실제 결과와 실패를 남겨야 개선할 근거가 생겨요. 계획값이나 물의 외관만으로 성능·음용을 확정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-23",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 23,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-03",
      "topic": "물을 얻는 장치 제작",
      "concept": "물을 얻는 장치 제작",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "연습용 장치를 같은 시간씩 시험해 1차에 2mL, 수정한 뒤 2차에 5mL를 모았습니다. 늘어난 양은 몇 mL인가요? 숫자만 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "3",
      "accepted": [
        "3"
      ]
    },
    "explanation": "5-2=3mL이에요. 제시한 두 시행의 차이이며 수정 하나가 항상 같은 증가를 만든다는 뜻은 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-24",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 24,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-03",
      "topic": "물을 얻는 장치 제작",
      "concept": "물을 얻는 장치 제작",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "설계도에는 덮개만 있고 물방울을 받는 통이 빠졌습니다. 실제 만들기와 시험까지 이어지도록 설계를 보완하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "덮개에 맺힌 물방울이 받는 통으로 흐르도록 기울기와 통 위치를 정하고 조립한다. 같은 시간 실제 모인 양과 샌 곳을 기록하고 한 부분을 고쳐 다시 시험한다.",
      "rubric": {
        "required": [
          "물방울 경로와 받는 통 위치",
          "실제 제작·시험·한 부분 수정 후 재시험"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "장치 이름을 쓰는 것만으로 실제 만들기·시험을 했다고 볼 수 없어요. 물방울이 이동하는 경로도 확인해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-25",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 25,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-01",
      "topic": "흐르는 물과 강 지형",
      "concept": "흐르는 물과 강 지형",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "흐르는 물 모형에서 물길 옆 모래가 깎인 곳을 표시했습니다. 이곳에서 두드러진 물의 작용은 무엇인가요?",
    "givens": null,
    "choices": [
      "자석의 끌림",
      "수증기 응결",
      "퇴적 작용",
      "침식 작용",
      "얼음의 녹음"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "흐르는 물이 모래나 흙을 깎는 것은 침식이에요. 옮기고 쌓는 작용과 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-26",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 26,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-01",
      "topic": "흐르는 물과 강 지형",
      "concept": "흐르는 물과 강 지형",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "모래 언덕에 물을 흘린 뒤의 가상 기록입니다. 자료와 맞는 설명 두 가지를 고르세요.",
    "givens": {
      "연습 자료": "위쪽 물길 옆이 깎였고, 옅게 섞인 모래가 흘러 내려가 아래쪽에 쌓였다."
    },
    "choices": [
      "아래쪽에 쌓인 모래는 모두 새로 생겼다.",
      "깎인 모래가 물을 따라 이동할 수 있다.",
      "물이 느려진 곳에 모래가 쌓일 수 있다.",
      "모래가 이동했으므로 물은 흐르지 않았다.",
      "한 모형 결과로 모든 강의 모양을 확정한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        2
      ]
    },
    "explanation": "침식·운반·퇴적을 이어 볼 수 있어요. 모형에서 본 경향을 실제 모든 강의 모양으로 바로 확정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-27",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 27,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-01",
      "topic": "흐르는 물과 강 지형",
      "concept": "흐르는 물과 강 지형",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "물길을 따라 옮겨진 모래가 바닥에 쌓이는 작용의 이름을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "퇴적",
      "accepted": [
        "퇴적",
        "퇴적 작용"
      ]
    },
    "explanation": "흐르는 물이 옮긴 모래나 흙이 쌓이는 것을 퇴적이라고 해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-28",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 28,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-01",
      "topic": "흐르는 물과 강 지형",
      "concept": "흐르는 물과 강 지형",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "같은 모래 언덕에 물을 붓는 양을 비교하려는데 두 언덕의 기울기도 달랐습니다. 물의 양만 비교하려면 어떤 조건을 맞추고 무엇을 관찰해야 하나요?",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "모래 종류·양·언덕 모양과 기울기를 맞추고 물을 붓는 양만 바꾼다. 같은 위치와 방법에서 깎인 곳·옮겨진 모래·쌓인 곳을 관찰해 기록한다.",
      "rubric": {
        "required": [
          "모래·언덕 등 다른 조건 유지",
          "물 양만 바꾸고 침식·운반·퇴적 관찰"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "기울기까지 다르면 결과 차이의 이유를 나누기 어려워요. 모형 조건과 관찰 위치를 함께 적어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-29",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 29,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-02",
      "topic": "화산과 분출 모형",
      "concept": "화산과 분출 모형",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "화산 활동을 설명한 문장으로 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "차가운 물이 얼어붙는 현상만 말한다.",
      "땅속 물질이 지표로 나오는 활동이다.",
      "바닷물이 들고 나는 일만 말한다.",
      "비가 모래를 옮기는 현상만 말한다.",
      "공기가 물방울로 모이는 일만 말한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "화산 활동은 땅속의 마그마와 관련된 물질이 지표로 나오는 활동이에요. 흐르는 물이나 상태 변화의 사례와 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-30",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 30,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-02",
      "topic": "화산과 분출 모형",
      "concept": "화산과 분출 모형",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "화산 활동 때 나오는 물질에 해당하는 것을 두 가지 고르세요.",
    "givens": null,
    "choices": [
      "공중으로 날린 화산재",
      "파도가 밀어온 조개껍데기",
      "지표로 흘러나오는 용암",
      "강바닥에서 굴러온 자갈만",
      "바람에 날린 낙엽 자체"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "용암과 화산재는 화산 분출물의 사례예요. 화산 가스나 화산암 조각 등도 있으며 두 가지만 나온다는 뜻은 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-31",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 31,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-02",
      "topic": "화산과 분출 모형",
      "concept": "화산과 분출 모형",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "가상 모형에서 붉은 묽은 반죽이 가운데 구멍 밖으로 흘렀습니다. 반죽이 나타내려는 실제 화산 분출물을 쓰세요.",
    "givens": {
      "연습 자료": "이것은 안전한 표현 모형이며 실제 고온 물질을 쓰지 않았다. 흘러나오는 물질의 모습을 나타낸다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "용암",
      "accepted": [
        "용암"
      ]
    },
    "explanation": "구멍 밖으로 흐르는 반죽은 용암이 흘러나오는 모습을 표현해요. 반죽이 실제 용암과 같은 물질은 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-32",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 32,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-02",
      "topic": "화산과 분출 모형",
      "concept": "화산과 분출 모형",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "종이 화산 안에서 붉은 반죽을 밀어 올린 모형입니다. 실제 화산과 닮은 점 한 가지와 이 모형이 보여 주지 못하는 점 한 가지를 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "물질이 구멍 밖으로 흘러나오는 모습은 닮았다. 반죽은 실제 용암이 아니며 실제 온도·분출 규모나 모든 분출물을 재현하지 못한다.",
      "rubric": {
        "required": [
          "흘러나오는 모습의 대응",
          "실제 물질·온도·규모 등 한계"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "모형의 닮은 부분과 다른 부분을 구별해야 실제 화산을 모형 그대로라고 생각하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-33",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 33,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-03",
      "topic": "화성암 관찰·분류",
      "concept": "화성암 관찰·분류",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "제시 표본 A는 어두운색 바탕과 작은 알갱이가 보이고, B는 밝고 어두운 알갱이가 섞여 크게 보입니다. 이 자료에 맞는 관찰 기록은 무엇인가요?",
    "givens": null,
    "choices": [
      "B에는 한 가지 색만 나타난다.",
      "A의 모든 알갱이가 B보다 크다.",
      "사진 없이도 모든 구멍 수를 안다.",
      "A와 B는 관찰 모습이 완전히 같다.",
      "B에서 여러 색 알갱이가 보인다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "표본 B의 여러 색 알갱이를 자료대로 읽어요. 제시되지 않은 구멍 수나 모든 암석의 성질을 추정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-34",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 34,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-03",
      "topic": "화성암 관찰·분류",
      "concept": "화성암 관찰·분류",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "현무암·화강암 표본을 비교할 때 관찰 근거로 쓸 내용을 두 가지 고르세요.",
    "givens": null,
    "choices": [
      "사진에 없지만 있을 것 같은 숨은 무늬",
      "손에 든 사람의 키로 짐작한 암석 종류",
      "표본에서 실제로 확인한 구멍의 유무",
      "겉면에서 보이는 알갱이의 크기와 색",
      "이름표를 가리고도 읽었다고 할 표본 이름"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        3
      ]
    },
    "explanation": "관찰할 수 있는 특징과 관찰하지 않은 추측을 나누어요. 색 하나나 구멍 하나를 모든 표본에 적용하는 유일한 기준으로 쓰지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-35",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 35,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-03",
      "topic": "화성암 관찰·분류",
      "concept": "화성암 관찰·분류",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "가상 관찰 자료에서 밝고 어두운 큰 알갱이가 섞인 B를 교사 제공 비교 표본의 화강암과 연결했습니다. B로 분류한 암석 이름을 쓰세요.",
    "givens": {
      "연습 자료": "이 문항은 제시 B와 확인된 비교 표본의 관찰 특징을 함께 사용한다. 모든 밝은 돌을 같은 암석이라 하는 기준은 아니다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "화강암",
      "accepted": [
        "화강암"
      ]
    },
    "explanation": "B의 여러 관찰 특징을 화강암 비교 표본과 연결한 결과예요. 색 하나만으로 모든 돌을 분류하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-36",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 36,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-03",
      "topic": "화성암 관찰·분류",
      "concept": "화성암 관찰·분류",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "“구멍이 안 보이니 현무암일 수 없어.”라는 친구의 분류 기준을 점검하세요. 제시 표본을 더 타당하게 비교하는 방법을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "구멍 유무 하나만으로 확정하지 않는다. 표본의 색·알갱이 크기·구멍을 함께 관찰하고 확인된 현무암과 화강암 표본과 비교하며 불분명하면 남긴다.",
      "rubric": {
        "required": [
          "한 특징만으로 확정하지 않음",
          "여러 관찰 특징·비교 표본·불분명 구별"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "관찰·분류가 핵심이에요. 알갱이가 생긴 원인이나 냉각 과정까지 설명해야만 맞는 문제는 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-37",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 37,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-04",
      "topic": "화산·지진 영향과 대처 실천",
      "concept": "화산·지진 영향과 대처 실천",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "화산 활동의 생활 영향을 정리한 가상 조사표입니다. 표에서 이로운 영향으로 분류한 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "이동 경로가 끊어지는 피해",
      "가스와 재로 생활에 불편함",
      "화산재로 농작물이 손상됨",
      "화산 지형을 이용한 관광",
      "분출물로 길이 막히는 피해"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "특징적인 지형을 관광 자원으로 이용하는 사례는 이로운 영향이에요. 이로운 영향이 있다는 이유로 피해가 없다고 할 수는 없어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-38",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 38,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-04",
      "topic": "화산·지진 영향과 대처 실천",
      "concept": "화산·지진 영향과 대처 실천",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "화산·지진 대처 활동을 평가하는 근거로 적절한 것 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "계획표를 저장하면 실제 훈련 완료로 적는다.",
      "하지 못한 단계와 다음 보완을 함께 남긴다.",
      "선택형 정답이면 모든 대처를 실천했다고 쓴다.",
      "훈련 안내와 실제로 한 행동을 구별한다.",
      "한 지역 피해가 없으면 모든 지역도 같다고 쓴다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        3
      ]
    },
    "explanation": "조사·계획·실제 실천은 다른 증거가 필요해요. 지필 응답만으로 학생의 실제 대처 행동을 확정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-39",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 39,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-04",
      "topic": "화산·지진 영향과 대처 실천",
      "concept": "화산·지진 영향과 대처 실천",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "가상 훈련표에서 안내받은 4단계 중 실제로 한 단계는 3개입니다. 아직 하지 못한 단계는 몇 개인가요? 숫자만 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "1",
      "accepted": [
        "1"
      ]
    },
    "explanation": "4-3=1단계예요. 실제로 못한 단계를 남기며, 이 숫자를 학생의 실제 안전 능력이나 공식 점수로 바꾸지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-40",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 40,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-04",
      "topic": "화산·지진 영향과 대처 실천",
      "concept": "화산·지진 영향과 대처 실천",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "교사가 안내한 대처 훈련을 “다음 주에 해 볼 예정”이라고만 적었습니다. 실제 실천을 확인할 수 있도록 어떤 기록을 추가해야 하나요?",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "안내받은 절차를 실제로 한 날짜와 장소·한 행동·못한 단계를 기록한다. 교사 확인이나 함께 한 사람의 의견과 다음 보완을 남기며 예정과 완료를 구별한다.",
      "rubric": {
        "required": [
          "날짜·실제 행동·못한 단계",
          "계획과 완료 구별·확인/보완"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "이 문항은 훈련 기록의 증거를 묻고 있어요. 재난 상황의 개별 행동 지침을 새로 정하거나 지필 응답으로 실천을 대신하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-41",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 41,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-01",
      "topic": "다양한 생물 관찰",
      "concept": "다양한 생물 관찰",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "교사 제공 자료의 분류표입니다. 버섯과 곰팡이가 속한 무리는 무엇인가요?",
    "givens": {
      "연습 자료": "제공 자료는 버섯·곰팡이를 균류, 짚신벌레·해캄을 원생생물, 대장균을 세균의 사례로 소개한다."
    },
    "choices": [
      "균류",
      "물고기 무리",
      "포유류 무리",
      "곤충 무리",
      "새의 무리"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "제시한 분류 자료에서 버섯과 곰팡이는 균류의 사례예요. 색만 보고 어느 생물인지 정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-42",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 42,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-01",
      "topic": "다양한 생물 관찰",
      "concept": "다양한 생물 관찰",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "다양한 생물의 관찰 기록을 남기는 방법으로 적절한 것을 두 가지 고르세요.",
    "givens": null,
    "choices": [
      "쓴 관찰 도구와 보인 모습을 함께 적는다.",
      "크기가 작으면 모두 같은 세균으로 적는다.",
      "안 보이는 부분은 보았다고 채워 적는다.",
      "사진 색 하나로 사는 곳을 확정해 적는다.",
      "제공 사진인지 직접 본 표본인지 적는다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        4
      ]
    },
    "explanation": "자료의 종류와 관찰 조건이 있어야 기록을 해석할 수 있어요. 못 본 부분과 추측도 실제 관찰과 나누어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-43",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 43,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-01",
      "topic": "다양한 생물 관찰",
      "concept": "다양한 생물 관찰",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "교사 제공 확대 자료에서 짚신벌레와 해캄을 같은 무리로 소개했습니다. 이 무리의 이름을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "원생생물",
      "accepted": [
        "원생생물"
      ]
    },
    "explanation": "이 교육과정에서 짚신벌레와 해캄은 원생생물의 사례로 살펴요. 겉모습이 모두 같다는 뜻은 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-44",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 44,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-01",
      "topic": "다양한 생물 관찰",
      "concept": "다양한 생물 관찰",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "같은 생물 사진을 보았는데 한 학생은 “연못에서 직접 봄”이라고, 다른 학생은 “교사 제공 확대 사진을 봄”이라고 썼습니다. 관찰 기록을 어떻게 바로잡아야 하나요?",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "실제 연못에서 직접 본 것이 아니라면 교사 제공 확대 사진을 본 것으로 고친다. 사진의 출처·배율 등 제시된 조건과 보이는 특징을 적고 직접 사는 곳을 확인한 것처럼 쓰지 않는다.",
      "rubric": {
        "required": [
          "실제 자료 종류·출처로 수정",
          "보이는 특징과 직접 확인하지 않은 사실 구별"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "사진을 본 활동도 자료 관찰이지만 실제 채집·현장 관찰과 같은 증거로 세지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-45",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 45,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-02",
      "topic": "다양한 생물의 생활 영향",
      "concept": "다양한 생물의 생활 영향",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "같은 무리의 생활 영향을 조사한 연습 자료입니다. 이 자료로 할 수 있는 결론은 무엇인가요?",
    "givens": {
      "연습 자료": "자료1: 일부 곰팡이는 식품을 만드는 데 쓰인다. 자료2: 어떤 곰팡이는 식품을 상하게 한다. 실제 식품을 배양하거나 먹는 활동은 하지 않았다."
    },
    "choices": [
      "이로운 사례가 있으면 피해는 조사할 필요 없다.",
      "균류에 이로운 사례와 해로운 사례가 있다.",
      "균류는 모든 상황에서 사람에게 해롭다.",
      "식품에 쓰이면 모든 균류가 먹어도 안전하다.",
      "곰팡이는 어디서나 같은 쓰임만 갖는다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "두 자료는 이로운 영향과 해로운 영향이 함께 있음을 보여 줘요. 모든 균류의 섭취나 건강 효과를 보증하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-46",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 46,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-02",
      "topic": "다양한 생물의 생활 영향",
      "concept": "다양한 생물의 생활 영향",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "세균의 생활 영향을 조사·발표할 때 적절한 내용 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "한 사례만으로 세균이 모두 이롭다고 결론 낸다.",
      "일부 세균의 해로운 영향도 근거와 함께 다룬다.",
      "발효에 이용되는 세균의 구체적 사례를 소개한다.",
      "모든 세균을 눈으로 쉽게 볼 수 있다고 말한다.",
      "친구의 증상만으로 원인 세균 이름을 확정한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        2
      ]
    },
    "explanation": "사례와 근거를 구별해 이로운 영향과 해로운 영향을 함께 조사해요. 관찰 자료만으로 병명을 진단하는 문제는 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-47",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 47,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-02",
      "topic": "다양한 생물의 생활 영향",
      "concept": "다양한 생물의 생활 영향",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "가상 발표표의 두 사례를 읽고 ㄱ·ㄴ 중 이로운 이용 사례의 기호를 쓰세요.",
    "givens": {
      "연습 자료": "ㄱ 확인된 자료에서 일부 세균을 발효 식품 제조에 이용함 / ㄴ 식품이 상하여 버린 피해 사례"
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
    "explanation": "ㄱ은 세균을 목적에 맞게 이용한 사례예요. ㄴ은 해로운 영향의 사례로 나누어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-48",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 48,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T12",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-02",
      "topic": "다양한 생물의 생활 영향",
      "concept": "다양한 생물의 생활 영향",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "모둠 발표에 “세균은 모두 해롭다.”라고만 썼습니다. 조사 내용을 더 균형 있게 고치는 방법을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "확인된 세균의 이로운 이용 사례와 해로운 영향 사례를 각각 조사하고 출처를 붙인다. 서로 다른 사례를 비교하여 모든 세균이 같은 영향을 준다고 일반화하지 않는다.",
      "rubric": {
        "required": [
          "이로운·해로운 구체 사례와 출처",
          "모든 세균으로 일반화하지 않음"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "생물 무리의 영향은 한 사례로 전부 확정하지 않아요. 발표한 내용과 실제 조사 근거도 연결해야 해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-49",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 49,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-03",
      "topic": "생명과학 자료 제작·공유",
      "concept": "생명과학 자료 제작·공유",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "다음 소개 자료 중 생명과학을 이용하는 사례를 보여 주는 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "미생물을 이용해 식품을 만드는 과정",
      "얼음이 녹아 물로 바뀌는 관찰",
      "물이 모래 언덕을 깎아 가는 관찰",
      "돌의 알갱이 색을 비교하는 표",
      "막대자석으로 철 조각을 모으는 도구"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "생물을 이해하고 이용하여 생활에 쓰는 식품 제조 과정은 생명과학 이용 사례예요. 다른 과학 현상과 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-50",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 50,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-03",
      "topic": "생명과학 자료 제작·공유",
      "concept": "생명과학 자료 제작·공유",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "생명과학 사례 소개 자료에 담을 내용을 두 가지 고르세요.",
    "givens": null,
    "choices": [
      "어떤 생물의 어떤 특징을 이용하는지",
      "이용 목적과 확인한 자료의 출처",
      "자료 파일을 저장했다는 이유만으로 공유 완료",
      "소개할 제품의 모든 건강 효과가 확정됐다는 말",
      "모르는 부분을 확인 없이 실제 결과로 채운 표"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1
      ]
    },
    "explanation": "생물의 이용 방식·목적과 출처가 있어야 사례를 설명할 수 있어요. 저장·공유·확인하지 않은 효과를 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-51",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 51,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-03",
      "topic": "생명과학 자료 제작·공유",
      "concept": "생명과학 자료 제작·공유",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "가상 모둠은 소개 카드를 만들고 파일로 저장했지만 다른 사람에게 전달하지 않았습니다. 실제 공유는 완료와 미완료 중 어느 것인가요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "미완료",
      "accepted": [
        "미완료",
        "공유 미완료"
      ]
    },
    "explanation": "파일을 만든 것과 다른 사람에게 실제 전달한 것은 달라요. 아직 전달하지 않았으므로 실제 공유는 미완료예요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f1-52",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 52,
      "edition": "GFIELD 창작 기말평가 A형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T13",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-03",
      "topic": "생명과학 자료 제작·공유",
      "concept": "생명과학 자료 제작·공유",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "미생물을 이용한 환경 정화 사례를 소개하는 카드를 준비합니다. 설명할 내용과 실제 공유·의견 반영 기록 계획을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "어떤 미생물을 어떤 정화 과정에 이용하는지 확인한 자료와 출처를 정리한다. 전달한 대상·날짜·방법을 남기고 받은 의견과 수정한 부분을 구별하며 의견이 없으면 없다고 기록한다.",
      "rubric": {
        "required": [
          "생물 이용 방식·목적과 출처",
          "실제 전달·의견 수신·수정 구별"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "소개 자료를 작성하는 단계와 실제 공유·수정은 따로 확인해요. 환경 정화의 모든 물질·조건에 효과가 같다고 확대하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-01",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 1,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-01",
      "topic": "자석과 물체의 상호작용",
      "concept": "자석과 물체의 상호작용",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "같은 철 구슬을 자석에서 멀리 놓았을 때는 움직이지 않았고 가까이 놓자 움직였습니다. 이 관찰에 맞는 설명은 무엇인가요?",
    "givens": {
      "연습 자료": "같은 자석·같은 철 구슬·같은 받침에서 거리만 바꾼 가상 관찰이다."
    },
    "choices": [
      "거리에 따라 움직임이 달라졌다.",
      "닿지 않으면 힘이 전혀 작용하지 않는다.",
      "모든 자석이 이 거리에서 똑같이 작용한다.",
      "멀리 놓인 물체는 모두 자석에 붙지 않는다.",
      "철 구슬의 재료가 나무로 바뀌었다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "이 비교에서는 거리에 따라 움직임이 달랐어요. 자석이 닿기 전에도 철 구슬을 움직일 수 있어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-02",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 2,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-01",
      "topic": "자석과 물체의 상호작용",
      "concept": "자석과 물체의 상호작용",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "철 조각과 자석의 상호작용을 비교한 기록을 살펴봅니다. 결과를 믿을 수 있게 하는 조건 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "자석의 종류와 처음 거리를 함께 적는다.",
      "어느 부분의 재료를 시험했는지 남긴다.",
      "같은 색이면 재료를 확인하지 않고 합친다.",
      "자석과 받침을 바꾸어 거리 차이만 결론 낸다.",
      "움직이지 않은 시행은 결과에서 모두 뺀다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1
      ]
    },
    "explanation": "부품의 어느 부분과 어떤 조건을 시험했는지 남겨야 비교할 수 있어요. 실패한 시행을 버리면 결과가 한쪽으로 치우칠 수 있어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-03",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 3,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-01",
      "topic": "자석과 물체의 상호작용",
      "concept": "자석과 물체의 상호작용",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "얇은 플라스틱판 사이에서 자석을 움직이자 철 조각도 따라 움직였습니다. 이 기록에서 자석에 끌린 물체의 재료를 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "철",
      "accepted": [
        "철",
        "철 조각"
      ]
    },
    "explanation": "철 조각이 끌린 결과예요. 플라스틱판 자체가 자석에 붙었다거나 모든 두께에서 같다고 해석하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-04",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 4,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-01",
      "topic": "자석과 물체의 상호작용",
      "concept": "자석과 물체의 상호작용",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "철 날과 플라스틱 손잡이가 함께 있는 도구를 시험했더니 날 부분만 자석에 붙었습니다. 도구 전체의 재료를 어떻게 기록하고 결론의 범위를 정해야 하나요?",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "철 날과 플라스틱 손잡이의 재료를 나누어 적고 날 부분이 붙었다고 기록한다. 도구의 모든 부분이나 모든 재료가 붙는다고 결론 내리지 않는다.",
      "rubric": {
        "required": [
          "부품별 재료·붙은 부분 기록",
          "도구 전체·모든 재료로 일반화하지 않음"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "여러 재료가 섞인 물체는 어느 부분이 상호작용했는지 확인해야 해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-05",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 5,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-02",
      "topic": "극과 자석 사이 상호작용",
      "concept": "극과 자석 사이 상호작용",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "움직일 수 있는 자석의 S극 앞에 다른 자석의 N극을 가까이했습니다. 예상되는 상호작용은 무엇인가요?",
    "givens": null,
    "choices": [
      "같은 극으로 바뀌어서 민다.",
      "항상 아무 움직임도 없다.",
      "서로 밀어내기만 한다.",
      "거리와 관계없이 힘이 같다.",
      "서로 끌어당긴다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "다른 극끼리는 서로 끌어당겨요. 실제 움직임을 비교할 때 고정 여부와 거리도 살펴요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-06",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 6,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-02",
      "topic": "극과 자석 사이 상호작용",
      "concept": "극과 자석 사이 상호작용",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "고리자석 두 개의 마주 보는 면이 밀어내어 떨어져 있습니다. 관찰과 맞는 설명 두 가지를 고르세요.",
    "givens": {
      "연습 자료": "교사가 준비한 지지대에서 고리가 위아래로 움직일 수 있으며, 마주 보는 극 때문에 밀어내는 상황이다."
    },
    "choices": [
      "마주 보는 두 면은 같은 극이다.",
      "위 고리를 고정해도 자유로운 움직임을 관찰한 셈이다.",
      "한 고리를 뒤집으면 마주 보는 극이 달라진다.",
      "같은 극끼리 끌어당겨서 간격이 생긴 것이다.",
      "고리가 떨어져 있으니 자석 성질이 없는 것이다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "같은 극이 마주 보면 밀어내요. 한 고리를 뒤집으면 마주 보는 극의 관계가 바뀌어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-07",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 7,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-02",
      "topic": "극과 자석 사이 상호작용",
      "concept": "극과 자석 사이 상호작용",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "다른 자석의 S극과 끝 Y가 마주 보았을 때 서로 밀어냈습니다. 끝 Y의 극을 기호로 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "S",
      "accepted": [
        "S",
        "S극",
        "s"
      ]
    },
    "explanation": "S극과 밀어내는 Y는 같은 S극으로 판단해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-08",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 8,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-02",
      "topic": "극과 자석 사이 상호작용",
      "concept": "극과 자석 사이 상호작용",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "가만히 놓인 자석이 북쪽을 가리키지 않았습니다. 자석을 테이프로 책상에 붙여 둔 상태였다고 합니다. 방향 성질을 관찰할 수 있도록 조건을 고치고 판단 방법을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "자석이 자유롭게 돌아갈 수 있도록 하고 주변 다른 자석의 영향을 피한다. 멈춘 뒤 어느 끝이 북쪽을 가리키는지 여러 번 확인해 N극과 연결한다.",
      "rubric": {
        "required": [
          "자유롭게 돌아갈 조건과 주변 영향 확인",
          "멈춘 방향을 반복 관찰해 N극 연결"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "고정되어 돌아가지 못한 결과만으로 자석의 방향 성질이 없다고 결론 내릴 수 없어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-09",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 9,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-03",
      "topic": "자석 생활 장치 설계",
      "concept": "자석 생활 장치 설계",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "두 자석을 마주 보게 놓아 손으로 밀어도 간격이 생기는 전시 도구를 설계합니다. 이용하려는 성질은 무엇인가요?",
    "givens": null,
    "choices": [
      "종이를 물로 바꾸는 성질",
      "철 조각끼리 저절로 미는 성질",
      "같은 극끼리 밀어내는 성질",
      "나무 조각을 모두 끌어당기는 성질",
      "다른 극끼리 밀어내는 성질"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "같은 극끼리 밀어내는 성질을 이용하는 설계예요. 실제 장치에서는 자석이 기울거나 빠지지 않도록 고정 구조도 시험해야 해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-10",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 10,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-03",
      "topic": "자석 생활 장치 설계",
      "concept": "자석 생활 장치 설계",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "자석 문 잠금 장치를 두 설계안으로 비교합니다. 공정한 시험 계획 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "같은 시험 방법과 횟수로 결과를 남긴다.",
      "성공한 시행만 골라 두 설계의 전체 결과라 한다.",
      "한 설계는 철판, 다른 설계는 나무판에서 시험한다.",
      "실제 만들기 전 예상만으로 더 좋은 설계를 확정한다.",
      "같은 문에서 자석 위치만 바꾼다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        4
      ]
    },
    "explanation": "목표와 비교 조건을 맞추고 실패를 포함한 결과를 남겨야 설계를 평가할 수 있어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-11",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 11,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-03",
      "topic": "자석 생활 장치 설계",
      "concept": "자석 생활 장치 설계",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "가상 시험에서 자석 홀더를 같은 방법으로 5번 사용했고 4번 메모를 잡았습니다. 잡지 못한 횟수는 몇 번인가요? 숫자만 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "1",
      "accepted": [
        "1"
      ]
    },
    "explanation": "5-4=1번이에요. 이 시행의 결과와 실제 개선 계획을 나누어 적어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-12",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 12,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-03",
      "topic": "자석 생활 장치 설계",
      "concept": "자석 생활 장치 설계",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "만든 자석 수거 도구의 자석이 손잡이에서 자꾸 빠졌습니다. 목적을 유지하며 한 부분을 고칠 방법과 다시 시험할 계획을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "철 조각을 모으는 목적은 유지하고 자석을 고정하는 덮개나 결합 부분을 고친다. 같은 철 조각과 거리·사용 방법으로 다시 시험해 빠짐과 수거 결과를 기록한다.",
      "rubric": {
        "required": [
          "자석 고정 구조의 구체적 수정",
          "같은 조건에서 실제 재시험 계획"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "수정한 설계도를 저장한 것과 실제 재시험을 한 결과는 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-13",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 13,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-01",
      "topic": "물의 세 상태와 사례",
      "concept": "물의 세 상태와 사례",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "같은 양의 물을 넓은 그릇에서 좁은 그릇으로 옮겼습니다. 흘리거나 증발한 물은 없었습니다. 알맞은 설명은 무엇인가요?",
    "givens": null,
    "choices": [
      "모양이 바뀌어도 액체 상태다.",
      "물이 그릇 밖 모양을 그대로 유지한다.",
      "그릇을 옮기면 물이 모두 기체가 된다.",
      "모양이 바뀌면 물의 양이 반드시 늘어난다.",
      "높이가 달라지면 물이 얼음이 된다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "그릇에 따라 물의 모양은 달라질 수 있지만 상태가 바뀐 것은 아니에요. 높이만으로 양이 늘었다고 판단하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-14",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 14,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-01",
      "topic": "물의 세 상태와 사례",
      "concept": "물의 세 상태와 사례",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "관찰한 물의 상태와 사례를 바르게 연결한 것을 두 가지 고르세요.",
    "givens": null,
    "choices": [
      "컵 속 물은 그릇 모양이 변해도 고체다.",
      "보이지 않는 수증기는 액체 상태다.",
      "흰 김을 이루는 물방울은 고체 상태다.",
      "냉동실 얼음 조각은 고체 상태다.",
      "물방울이 모인 웅덩이는 액체 상태다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        3,
        4
      ]
    },
    "explanation": "얼음은 고체, 물방울과 웅덩이의 물은 액체예요. 수증기는 기체이며 보이는 작은 물방울과 달라요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-15",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 15,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-01",
      "topic": "물의 세 상태와 사례",
      "concept": "물의 세 상태와 사례",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "보기에 있는 것 중 액체 상태 물의 기호 하나를 쓰세요.",
    "givens": {
      "연습 자료": "ㄱ 각얼음 / ㄴ 보이지 않는 수증기 / ㄷ 풀잎에 맺힌 물방울"
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
    "explanation": "풀잎의 물방울은 액체 물이에요. 크기가 작다는 이유로 기체라고 하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-16",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 16,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-01",
      "topic": "물의 세 상태와 사례",
      "concept": "물의 세 상태와 사례",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "친구가 “수증기는 눈에 안 보이니 물과 관계없어.”라고 말했습니다. 세 상태를 이용하여 설명을 고쳐 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "물은 얼음인 고체·흐르는 물인 액체·보이지 않는 수증기인 기체로 나타날 수 있다. 보이지 않아도 수증기는 물의 기체 상태이다.",
      "rubric": {
        "required": [
          "고체·액체·기체의 물 사례",
          "보이지 않는 수증기도 물임"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "눈에 보이는지와 물의 상태를 혼동하지 않아요. 상태 변화의 자세한 원인을 설명해야 하는 문제는 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-17",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 17,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-02",
      "topic": "다섯 상태 변화 관찰",
      "concept": "다섯 상태 변화 관찰",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "실온에 둔 얼음 조각이 점점 작아지고 그릇에 물이 고였습니다. 관찰한 변화는 무엇인가요?",
    "givens": null,
    "choices": [
      "얼음 안의 물이 밖으로 새기만 한다.",
      "얼음과 물이 서로 다른 물질이 된다.",
      "얼음이 물로 녹는다.",
      "물이 얼음으로 언다.",
      "수증기가 얼음으로 변한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "고체 얼음이 액체 물로 바뀌는 녹는 변화예요. 그릇 속 물과 남은 얼음의 모습을 함께 관찰해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-18",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 18,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-02",
      "topic": "다섯 상태 변화 관찰",
      "concept": "다섯 상태 변화 관찰",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "증발과 끓음을 비교한 설명 중 공통점을 나타내는 것 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "두 경우 모두 물이 얼음으로 변한다.",
      "두 경우 모두 액체에서 기체로 변한다.",
      "두 경우 모두 항상 같은 빠르기로 일어난다.",
      "두 경우 모두 컵 바깥에 물방울이 맺히는 현상이다.",
      "두 경우 모두 물이 수증기로 변한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    },
    "explanation": "증발과 끓음은 액체 물이 기체 수증기로 변한다는 점이 같아요. 빠르기는 조건에 따라 달라 모든 경우 같다고 하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-19",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 19,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-02",
      "topic": "다섯 상태 변화 관찰",
      "concept": "다섯 상태 변화 관찰",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "찬 금속판에 닿은 수증기가 작은 물방울로 바뀌었습니다. 이 변화의 이름을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "응결",
      "accepted": [
        "응결",
        "응결 현상"
      ]
    },
    "explanation": "기체 수증기가 액체 물로 바뀌는 것은 응결이에요. 얼음이 물이 되는 녹음과 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-20",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 20,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-02",
      "topic": "다섯 상태 변화 관찰",
      "concept": "다섯 상태 변화 관찰",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "닫힌 병 속 얼음이 녹기 전후 무게를 재는데, 두 번째에는 마개를 빼고 쟀습니다. 상태 변화만 비교하도록 절차를 고쳐 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "두 번 모두 같은 병·같은 마개와 내용물 전체를 재고 겉면 물기를 닦는다. 같은 저울과 방법으로 표시를 읽고 차이가 있으면 부품·물질 출입·도구 한계를 먼저 확인한다.",
      "rubric": {
        "required": [
          "같은 용기·마개·내용물과 마른 표면",
          "같은 저울·방법·출입/도구 한계 확인"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "마개를 빼면 비교 대상이 달라져요. 실제 작은 표시 차이를 상태 변화 때문이라고 바로 단정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-21",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 21,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-03",
      "topic": "물을 얻는 장치 제작",
      "concept": "물을 얻는 장치 제작",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "물 얻기 장치의 덮개에는 물방울이 맺혔지만 받는 통으로 떨어지지 않았습니다. 먼저 점검할 부분은 무엇인가요?",
    "givens": null,
    "choices": [
      "받는 통에서 물이 모두 얼었는지",
      "모은 물을 곧바로 마셔도 되는지",
      "덮개 물방울이 수증기 자체인지",
      "물방울이 통으로 흐르는 길",
      "물이 증발 없이 저절로 생겼는지"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "물방울이 맺힌 뒤 통으로 이동하는 경로·기울기·통 위치를 살펴야 해요. 실제 개선 여부는 다시 시험해 확인해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-22",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 22,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-03",
      "topic": "물을 얻는 장치 제작",
      "concept": "물을 얻는 장치 제작",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "다음 기록 중 장치의 실제 제작·시험 증거가 담긴 것을 두 가지 고르세요.",
    "givens": null,
    "choices": [
      "조립한 덮개에서 샌 위치를 날짜와 함께 적었다.",
      "같은 시간 받은 물의 양을 시행별로 남겼다.",
      "받는 통을 사기로 한 계획을 조립 완료라 적었다.",
      "멋진 설계도를 저장한 것을 물 수집 성공이라 썼다.",
      "모인 물을 보지 않고 예상 양을 실측 칸에 썼다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1
      ]
    },
    "explanation": "실제 조립한 구조와 관찰한 결과가 제작·시험의 증거예요. 계획·예상만으로 성공을 기록하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-23",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 23,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-03",
      "topic": "물을 얻는 장치 제작",
      "concept": "물을 얻는 장치 제작",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "가상 시험에서 모인 양은 1차 6mL, 2차 4mL입니다. 2차는 1차보다 몇 mL 적은가요? 숫자만 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "2",
      "accepted": [
        "2"
      ]
    },
    "explanation": "6-4=2mL 적어요. 줄어든 결과도 남기고 조건 차이와 실패 원인을 검토해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-24",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 24,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-03",
      "topic": "물을 얻는 장치 제작",
      "concept": "물을 얻는 장치 제작",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "한 조는 덮개의 기울기와 통 위치를 동시에 바꾸고 “기울기만 바꿔 물이 더 모였다.”라고 썼습니다. 이 결론을 고치고 재시험 계획을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "두 부분을 함께 바꿔 어느 부분 때문인지 아직 구별할 수 없다고 고친다. 한 부분만 바꾸고 다른 구조·시간·시작 물 조건을 맞추어 실제 모인 양을 비교한다.",
      "rubric": {
        "required": [
          "동시에 바꾼 두 조건의 효과 미확정",
          "한 부분만 바꾸는 같은 조건 재시험"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "실제 양이 늘었더라도 무엇 때문인지는 비교 조건이 뒷받침해야 해요. 음용 적합성은 이 양 비교로 확인하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-25",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 25,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-01",
      "topic": "흐르는 물과 강 지형",
      "concept": "흐르는 물과 강 지형",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "모래가 섞인 물이 좁은 물길을 따라 아래로 흘렀습니다. 모래가 다른 곳으로 옮겨지는 물의 작용은 무엇인가요?",
    "givens": null,
    "choices": [
      "응결 현상",
      "자석의 밀어냄",
      "얼음이 어는 변화",
      "암석의 알갱이 분류",
      "운반 작용"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "흐르는 물이 모래를 다른 곳으로 옮기는 것은 운반이에요. 깎이는 침식과 쌓이는 퇴적을 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-26",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 26,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-01",
      "topic": "흐르는 물과 강 지형",
      "concept": "흐르는 물과 강 지형",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "강 주변 지형과 물의 작용을 조사할 때 적절한 기록 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "깎인 흔적과 모래가 쌓인 위치를 구별한다.",
      "쌓인 모래는 물이 한 번도 흐르지 않은 증거라 쓴다.",
      "사진을 찍은 곳과 관찰한 시점을 함께 적는다.",
      "모든 강의 위아래는 한 사진과 같다고 쓴다.",
      "보이지 않는 강바닥의 깊이를 사진만으로 확정한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "장소·시점과 실제 보이는 흔적을 근거로 설명해요. 한 사진에 없는 정보나 모든 강의 모습을 확정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-27",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 27,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-01",
      "topic": "흐르는 물과 강 지형",
      "concept": "흐르는 물과 강 지형",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "물 모형의 처음 표시선보다 옆 모래 벽이 깎여 뒤로 물러났습니다. 깎인 곳에서 일어난 작용 이름을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "침식",
      "accepted": [
        "침식",
        "침식 작용"
      ]
    },
    "explanation": "흐르는 물이 모래 벽을 깎은 것은 침식 작용이에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-28",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 28,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-01",
      "topic": "흐르는 물과 강 지형",
      "concept": "흐르는 물과 강 지형",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "물 모형에서 아래쪽에 모래가 쌓였다고 “실제 모든 강도 이 위치에만 모래가 쌓인다.”라고 발표했습니다. 관찰 결과를 살리면서 결론의 범위를 고쳐 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "이 모형의 물 흐름과 언덕 조건에서 아래쪽에 모래가 쌓였다고 쓴다. 실제 강은 흐름·지형·시점이 다르므로 여러 자료를 더 비교해야 하며 모든 강의 한 위치로 확정하지 않는다.",
      "rubric": {
        "required": [
          "모형의 조건과 관찰 결과 유지",
          "실제 강 일반화 제한·추가 자료 비교"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "모형이 알려 준 작용은 활용하되 실제 강의 규모·조건 차이를 함께 설명해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-29",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 29,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-02",
      "topic": "화산과 분출 모형",
      "concept": "화산과 분출 모형",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "제시 그림에서 용암은 땅 밖으로 흘러나온 물질을 가리킵니다. 땅속의 마그마와 구별한 설명은 무엇인가요?",
    "givens": null,
    "choices": [
      "마그마는 식어 굳은 암석만 뜻한다.",
      "마그마는 지표로 나온 용암만 뜻한다.",
      "용암은 지표로 나온 마그마이다.",
      "용암은 물에 쓸려 모인 모래이다.",
      "용암은 땅속에만 머무는 마그마이다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "마그마가 지표로 흘러나온 것을 용암이라고 해요. 모형 반죽을 실제 용암과 같은 물질로 보지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-30",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 30,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-02",
      "topic": "화산과 분출 모형",
      "concept": "화산과 분출 모형",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "안전한 화산 표현 모형의 설명으로 타당한 것을 두 가지 고르세요.",
    "givens": null,
    "choices": [
      "모형이 실제 온도와 규모를 재현하지 못함을 적는다.",
      "반죽이 나왔으므로 모든 분출물을 재현했다고 쓴다.",
      "모형이 작동하면 실제 분출 시각도 예측했다고 쓴다.",
      "흘러나오는 반죽을 용암 모습과 연결한다.",
      "종이 산 안에 실제 마그마가 있다고 결론 낸다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "모형은 일부 모습을 표현해요. 실제 물질·온도·규모·분출 시각을 모두 보여 주는 것은 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-31",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 31,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-02",
      "topic": "화산과 분출 모형",
      "concept": "화산과 분출 모형",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "보기의 화산 분출물 중 작은 고체 가루를 가리키는 낱말을 쓰세요.",
    "givens": {
      "연습 자료": "낱말: 용암 / 화산재 / 화산 가스"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "화산재",
      "accepted": [
        "화산재"
      ]
    },
    "explanation": "화산재는 작은 고체 조각·가루로 구별해요. 눈에 보이는 분출 구름 전체를 기체만으로 생각하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-32",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 32,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-02",
      "topic": "화산과 분출 모형",
      "concept": "화산과 분출 모형",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "한 모둠의 모형은 구멍 밖으로 반죽이 흐르지만 화산재나 가스는 따로 나타내지 않았습니다. 표현한 것과 표현하지 않은 것을 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "반죽이 구멍 밖으로 흐르는 용암의 모습을 표현했다. 화산재와 가스 등 다른 분출물은 나타내지 않았고 실제 고온·규모도 재현하지 않았다.",
      "rubric": {
        "required": [
          "용암 흐름에 해당하는 부분",
          "빠진 분출물과 실제 조건의 한계"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "모형에서 보인 한 현상이 실제 화산의 모든 특징을 나타낸다고 하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-33",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 33,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-03",
      "topic": "화성암 관찰·분류",
      "concept": "화성암 관찰·분류",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "표본 기록에서 거친 면의 알갱이를 여러 색으로 표시했습니다. 이 기록의 성격은 무엇인가요?",
    "givens": null,
    "choices": [
      "다른 학생의 실제 관찰을 대신한 증거",
      "보이지 않는 내부를 측정한 결과",
      "전 세계 모든 돌의 종류 확정",
      "직접 보인 특징을 적은 관찰",
      "암석이 식은 속도를 잰 실험"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "겉면에 보인 알갱이의 특징을 적은 것은 관찰 기록이에요. 보이지 않는 원인이나 전체 암석 분류까지 확정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-34",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 34,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-03",
      "topic": "화성암 관찰·분류",
      "concept": "화성암 관찰·분류",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "분류가 불분명한 돌 표본을 만났습니다. 관찰을 보완하는 방법 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "같은 도구와 조명에서 비교 표본을 살핀다.",
      "다른 표본을 보지 않고 친구의 답만 관찰로 적는다.",
      "이름을 먼저 정한 뒤 맞지 않는 특징은 지운다.",
      "색·알갱이·구멍의 실제 모습을 다시 기록한다.",
      "어두운색이면 구멍과 관계없이 모두 같다고 한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "관찰 조건을 맞추고 여러 특징을 비교해요. 결과가 불분명하면 그대로 남겨 추가 자료를 확인해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-35",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 35,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-03",
      "topic": "화성암 관찰·분류",
      "concept": "화성암 관찰·분류",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "가상 관찰에서 A는 확인된 현무암 비교 표본과 여러 특징이 일치했습니다. A로 분류한 암석 이름을 쓰세요.",
    "givens": {
      "연습 자료": "A의 어두운색 바탕·작은 알갱이를 같은 조건에서 비교했다. 구멍 유무 하나만으로 정한 결과는 아니다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "현무암",
      "accepted": [
        "현무암"
      ]
    },
    "explanation": "제시한 여러 특징과 확인된 비교 표본을 근거로 현무암으로 분류한 결과예요. 모든 어두운 돌이 현무암이라는 뜻은 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-36",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 36,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T09",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-03",
      "topic": "화성암 관찰·분류",
      "concept": "화성암 관찰·분류",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "표본 사진이 흐려 알갱이 크기를 확인할 수 없는데 기록표에는 “큰 알갱이를 직접 봄”이라고 적혀 있습니다. 기록을 고치고 추가 관찰 방법을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "사진이 흐려 알갱이 크기는 확인하지 못했다고 고친다. 더 선명한 자료나 실제 비교 표본을 같은 조명·도구로 관찰해 보이는 특징을 기록하고 확인 전에는 종류를 확정하지 않는다.",
      "rubric": {
        "required": [
          "확인하지 못한 사실로 기록 수정",
          "조건을 맞춘 추가 자료·관찰 후 판단"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "불분명한 부분을 채워 넣지 않고 실제로 확인한 근거를 남겨야 해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-37",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 37,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-04",
      "topic": "화산·지진 영향과 대처 실천",
      "concept": "화산·지진 영향과 대처 실천",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "두 지역의 화산 활동 영향 자료를 비교했습니다. 자료에 맞는 결론은 무엇인가요?",
    "givens": {
      "연습 자료": "지역A 자료에는 화산재 피해, 지역B 자료에는 화산 지형 관광 사례가 실려 있다. 지역과 조사 시점은 각각 다르다."
    },
    "choices": [
      "피해 사례가 있으니 이용 사례는 모두 지운다.",
      "피해와 이로운 영향을 함께 조사한다.",
      "같은 지역이면 모든 시기의 영향이 같다.",
      "두 지역 자료로 전 세계 위험을 확정한다.",
      "관광 사례가 있으니 피해가 없다고 쓴다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "서로 다른 장소·시점의 사례를 함께 보되 모든 지역의 영향을 같다고 하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-38",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 38,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-04",
      "topic": "화산·지진 영향과 대처 실천",
      "concept": "화산·지진 영향과 대처 실천",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "교사 안내에 따라 대처 훈련을 한 가상 모둠의 기록입니다. 실천 증거를 구별한 설명 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "예정 날짜가 있으면 이미 훈련한 것으로 바꾼다.",
      "훈련한 날짜와 받은 확인 의견을 남긴다.",
      "한 사람의 완료를 모둠 모두의 완료로 쓴다.",
      "실제로 한 단계와 못한 단계를 따로 적는다.",
      "퀴즈 정답을 실제 훈련 참여 증거로 사용한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        3
      ]
    },
    "explanation": "누가 언제 무엇을 실제로 했는지 확인해요. 계획과 다른 사람의 기록·지필 응답으로 개인 실천을 대신하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-39",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 39,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-04",
      "topic": "화산·지진 영향과 대처 실천",
      "concept": "화산·지진 영향과 대처 실천",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "가상 훈련 기록에서 “실제로 함”은 2개, “할 계획”은 3개입니다. 실제로 한 항목 수만 숫자로 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "2",
      "accepted": [
        "2"
      ]
    },
    "explanation": "계획 세 개는 실제 완료에 합하지 않아요. 제시한 기록에서 실제로 한 항목은 두 개예요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-40",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 40,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E3",
      "type": "T10",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과11-04",
      "topic": "화산·지진 영향과 대처 실천",
      "concept": "화산·지진 영향과 대처 실천",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "발표에서 “대처 자료를 만들었으니 모둠 모두 실천했다.”라고 했습니다. 자료 제작과 실제 훈련을 구별하여 발표를 고쳐 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "대처 자료를 만든 것은 자료 제작 완료라고 쓴다. 각자가 교사 안내에 따라 실제로 한 날짜·행동과 못한 단계를 따로 확인해야 실천 여부를 말할 수 있다.",
      "rubric": {
        "required": [
          "제작과 실제 실천 분리",
          "개인별 실제 날짜·행동·미실행 확인"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "공동 자료가 있어도 모든 사람의 실천을 증명하지는 않아요. 확인되지 않은 부분을 완료로 처리하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-41",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 41,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-01",
      "topic": "다양한 생물 관찰",
      "concept": "다양한 생물 관찰",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "자료집에는 연못의 짚신벌레 확대 사진과 버섯의 겉모습 사진이 있습니다. 비교할 때 먼저 확인할 내용은 무엇인가요?",
    "givens": null,
    "choices": [
      "자료 출처와 관찰 도구·배율",
      "모둠별 정답 개수만",
      "발표 순서와 발표자 키",
      "사진 파일 이름의 글자 수",
      "사진 테두리 장식의 색"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "사진은 관찰 도구와 배율이 달라 실제 크기·보이는 모습이 달라질 수 있어요. 자료의 출처와 조건을 확인해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-42",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 42,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-01",
      "topic": "다양한 생물 관찰",
      "concept": "다양한 생물 관찰",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "균류·원생생물·세균 자료를 정리한 설명 중 타당한 것 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "제공 자료의 사는 곳과 보인 특징을 연결한다.",
      "겉모습 사진만으로 모든 세균의 특징을 안다고 쓴다.",
      "모든 작은 생물의 모양은 같다고 적는다.",
      "사진으로 확인 못한 움직임은 미확인으로 남긴다.",
      "이름이 비슷하면 관찰 없이 같은 무리로 확정한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "자료에서 확인한 특징·사는 곳과 미확인 부분을 나누어요. 생물 무리마다 다양한 특징이 있어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-43",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 43,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-01",
      "topic": "다양한 생물 관찰",
      "concept": "다양한 생물 관찰",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "제공 분류표에서 대장균이 속한 무리의 이름을 쓰세요.",
    "givens": {
      "연습 자료": "교사 제공 자료에는 버섯·곰팡이: 균류 / 짚신벌레·해캄: 원생생물 / 대장균: 세균으로 정리되어 있다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "세균",
      "accepted": [
        "세균"
      ]
    },
    "explanation": "제시한 분류표에서 대장균은 세균이에요. 실제로 배양하거나 직접 만지는 활동을 요구하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-44",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 44,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-01",
      "topic": "다양한 생물 관찰",
      "concept": "다양한 생물 관찰",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "생물 그림 두 개의 크기를 종이에서 비교하고 “더 크게 인쇄된 쪽이 실제로 더 큰 생물”이라고 했습니다. 관찰 조건을 이용하여 설명을 고쳐 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "그림은 배율이나 인쇄 크기가 다를 수 있어 종이 크기만으로 실제 크기를 확정할 수 없다. 출처와 배율·크기 표시를 확인하고 자료가 없으면 실제 크기는 미확인으로 남긴다.",
      "rubric": {
        "required": [
          "인쇄 크기와 실제 크기 구별",
          "배율·출처·표시 확인과 미확인 유지"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "관찰 도구와 자료 조건을 확인해야 서로 다른 사진을 타당하게 비교할 수 있어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-45",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 45,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-02",
      "topic": "다양한 생물의 생활 영향",
      "concept": "다양한 생물의 생활 영향",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "교사 자료에 버섯을 식품으로 이용하는 사례와 식품이 곰팡이로 상한 사례가 있습니다. 발표 제목으로 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "균류의 여러 생활 영향",
      "균류는 모두 같은 식품",
      "모든 곰팡이의 같은 이용법",
      "버섯은 모든 경우에 해로움",
      "상한 식품은 언제나 안전"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "자료는 균류의 이로운 이용과 해로운 영향을 함께 보여 줘요. 야생 버섯이나 곰팡이 식품의 섭취 가능성을 판단하는 문제가 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-46",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 46,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-02",
      "topic": "다양한 생물의 생활 영향",
      "concept": "다양한 생물의 생활 영향",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "생활 영향 조사 내용을 근거에 맞게 정리하는 방법 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "한 사진으로 모든 세균의 영향을 확정해 쓴다.",
      "좋은 사례만 남기고 피해 사례는 지운다.",
      "사례의 생물과 이용 목적을 구체적으로 적는다.",
      "조회 수가 높으면 모든 효과가 확정됐다고 쓴다.",
      "출처의 확인 범위와 미확인 부분을 나눈다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        4
      ]
    },
    "explanation": "사례와 출처의 확인 범위를 따져요. 인기도나 일부 사례만으로 모든 영향·효과를 확정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-47",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 47,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-02",
      "topic": "다양한 생물의 생활 영향",
      "concept": "다양한 생물의 생활 영향",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "가상 조사표에서 식품을 상하게 한 곰팡이 사례는 “이로운 영향”과 “해로운 영향” 중 어디에 넣나요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "해로운 영향",
      "accepted": [
        "해로운 영향",
        "해로움"
      ]
    },
    "explanation": "식품이 상해 버리게 된 사례는 해로운 영향으로 분류해요. 같은 무리의 이로운 이용 사례도 따로 조사할 수 있어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-48",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 48,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T12",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-02",
      "topic": "다양한 생물의 생활 영향",
      "concept": "다양한 생물의 생활 영향",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "출처가 확인된 자료 한 개에 미생물 이용 식품 사례가 있습니다. 친구가 “이 미생물은 어떤 상황에서도 건강에 좋다.”라고 썼습니다. 발표를 근거의 범위 안으로 고쳐 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "그 자료가 확인한 식품 제조 이용 사례만 소개한다. 모든 상황의 건강 효과가 확인된 것은 아니므로 그런 일반화는 빼고 자료의 출처와 확인하지 못한 부분을 함께 적는다.",
      "rubric": {
        "required": [
          "자료가 확인한 이용 사례로 한정",
          "미확인 건강 효과 일반화 제외·출처 표시"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "어떤 과정에 이용된다는 사실과 모든 상황의 건강 효과는 다른 주장이라 구별해야 해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-49",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 49,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-03",
      "topic": "생명과학 자료 제작·공유",
      "concept": "생명과학 자료 제작·공유",
      "inquirySkill": "관찰 조건·자료 해석"
    },
    "prompt": "소개 카드에 “이용한 생물·이용 과정·생활의 목적·출처”를 담았습니다. 다음으로 실제 공유를 확인할 수 있는 기록은 무엇인가요?",
    "givens": null,
    "choices": [
      "카드 바탕색을 어떤 색으로 골랐는지",
      "누구에게 언제 어떤 방법으로 전달했는지",
      "앞으로 받을 것 같은 칭찬의 개수",
      "파일 이름을 몇 글자로 저장했는지",
      "사진의 테두리를 몇 번 바꾸었는지"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "실제로 전달한 대상·날짜·방법이 공유의 근거예요. 저장·꾸미기·예상 의견만으로 실제 공유를 확정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-50",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 50,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-03",
      "topic": "생명과학 자료 제작·공유",
      "concept": "생명과학 자료 제작·공유",
      "inquirySkill": "관찰 근거·다중 판단"
    },
    "prompt": "친구에게 생명과학 소개 자료를 보여 준 뒤 받은 의견을 반영하려고 합니다. 적절한 기록 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "수정한 부분과 다시 공유할 계획을 따로 적는다.",
      "실제로 받은 질문과 제안을 그대로 구별해 남긴다.",
      "앞으로 수정할 부분을 이미 바꾼 것으로 적는다.",
      "의견이 없으면 좋은 반응을 받았다고 채운다.",
      "전달하지 않은 사람도 모두 읽었다고 기록한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1
      ]
    },
    "explanation": "의견 수신·실제 수정·재공유 계획을 구별해야 소통 과정을 확인할 수 있어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-51",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 51,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-03",
      "topic": "생명과학 자료 제작·공유",
      "concept": "생명과학 자료 제작·공유",
      "inquirySkill": "용어·기호·계산"
    },
    "prompt": "가상 공유 기록은 “학급에 전달함, 의견은 아직 받지 못함”입니다. 의견 수신은 완료와 미완료 중 어느 것인가요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "미완료",
      "accepted": [
        "미완료",
        "의견 수신 미완료"
      ]
    },
    "explanation": "실제 전달과 의견 수신은 다른 단계예요. 전달했어도 의견을 아직 받지 못했으면 수신은 미완료예요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s41-fin-f2-52",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 52,
      "edition": "GFIELD 창작 기말평가 B형",
      "course": "초등4-1",
      "unit": "기말평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "fin",
      "area": "종합",
      "element": "E4",
      "type": "T13",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과12-03",
      "topic": "생명과학 자료 제작·공유",
      "concept": "생명과학 자료 제작·공유",
      "inquirySkill": "설명·설계·수행 구별"
    },
    "prompt": "생물을 이용한 식품 제조 사례 자료에서 친구가 “어떤 생물을 어디에 쓰는지 모르겠어.”라고 했습니다. 소개 내용을 고치는 방법과 의견 반영 기록을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "확인한 출처에서 이용 생물과 제조 과정·목적을 찾아 구체적으로 설명한다. 받은 질문과 실제 고친 문장·수정 날짜를 남기고 다시 전달했는지와 전달 계획을 구별한다.",
      "rubric": {
        "required": [
          "이용 생물·과정·목적과 출처 보완",
          "실제 질문·수정·재전달 구별"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "소개 자료는 사례의 이용 방식을 설명해야 해요. 수정 계획과 실제 수정·다시 공유한 결과를 나누어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·10-01~03·11-01~04·12-01~03 및 네단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  }
];
export {finalBankPaperHtml as bankPaper,wireFinalBankPaper as wireBankPaper} from '../../v2/final41-bank-paper.js';
