// 현행4-1 중간 · 원문50/독립짝50/보충24. 실제 수행/공식 성적은 별도 확인.
export const unit = {
  "id": "c22-s41-mid",
  "course": "4-1",
  "no": 4,
  "title": "중간평가",
  "domain": "종합",
  "sources": {
    "bank": [
      "data/units/c22-s41-mid.source.js"
    ],
    "guidance": "자석·물의 상태 변화 학습용 평가. 원문1-15 자동판정보류·원문 인쇄답 별도 보존. 학교 공식 시험 범위/성적을 대체하지 않는다."
  }
};
export const items = [
  {
    "id": "c22-s41-mid-b01",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-01",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "자석에 붙는 물체 고르기·분류하기",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "모둠의 관찰표에서 어느 부분이 자석에 끌렸는지를 읽을 때 먼저 확인할 내용을 고르세요.",
    "givens": null,
    "choices": [
      "시험한 재료 부분과 같은 자석/거리",
      "친구가 좋아하는 물체의 색/무늬",
      "시험하지 않은 다른 물체의 가격",
      "표를 만든 종이의 크기/두께",
      "자석 이름표를 붙인 글씨 색"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "물체 전체 이름보다 시험한 재료 부분·같은 자석/거리를 확인한다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b02",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-01",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "떨어져 있거나 사이에 물체가 있을 때",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "자석과 철의 거리 영향을 비교할 때 같게 둘 조건 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "매번 바꾸는 자석의 종류",
      "같은 철 시료와 놓는 방향",
      "시행마다 새로 정한 끌림 기준",
      "시행마다 바꾸는 철의 재료",
      "같은 자석과 움직이는 방법"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    },
    "explanation": "거리를바꾸면서자석과철시료를같게해야거리효과를비교한다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b03",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-01",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "떨어져 있거나 사이에 물체가 있을 때",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "관찰 연습표에서 판을 사이에 둔 시행은 네 번 중 두 번 성공했습니다. 성공 횟수의 숫자를 쓰세요.",
    "givens": {
      "연습 자료": "1차 성공 / 2차 실패 / 3차 성공 / 4차 미실행"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "2",
      "accepted": [
        "2"
      ]
    },
    "explanation": "표의 실제 성공 두 번만 세며 계획을 성공으로 더하지 않는다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b04",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-01",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "떨어져 있거나 사이에 물체가 있을 때",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "두꺼운 판을 끼웠더니 철 구슬이 움직이지 않았습니다. 이 결과로 모든 자석 힘이 사라졌다고 할 수 없는 이유와 다음 비교를 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "이 판과 거리에서 움직이지 않은 결과일 뿐 모든 자석 힘이 없어졌다는 뜻은 아니에요. 같은 자석/구슬에서 판 두께 하나를 바꾸고 움직임을 같은 기준으로 비교해요.",
      "rubric": {
        "required": [
          "현재 시행의 조건/한계",
          "바꿀 한 조건·같게 둘 조건/판정"
        ],
        "pass": "근거와 조건을 선생님과 확인",
        "criteria": [
          "직접 작성한 학습용 기준·공식 배점 아님"
        ]
      }
    },
    "explanation": "현재거리·두께·마찰등조건의결과와모든조건일반화를나누고한조건을비교한다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b05",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-02",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "같은 극·다른 극 사이의 힘(고리 자석 탑)",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "고리 자석 탑에서 마주 보는 면을 같은 극으로 바꾸었습니다. 떠 있을 수 있는 까닭을 고르세요.",
    "givens": null,
    "choices": [
      "색이 같으면 재료가 저절로 늘어나서",
      "마주 보는 같은 극이 서로 밀어 내서",
      "막대가 자석을 기체로 바꾸어 올려서",
      "모든 고리 사이에서 끌어당기기만 해서",
      "실제 고리의 무게가 완전히 없어져서"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "같은극의밀어내는힘을탑구조와연결한다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b06",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-02",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "물에 띄우거나 매단 자석의 방향",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "자유롭게 매단 자석의 방향을 살피는 관찰에서 필요한 조건 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "주변의 다른 자석/철 물체를 멀리한다.",
      "자석을 손으로 북쪽에 꽉 고정한다.",
      "도는 중의 한 순간만 방향으로 정한다.",
      "움직임이 멈춘 뒤 두 극 방향을 읽는다.",
      "그림에 없는 방향도 실제 결과로 적는다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "주변방해를줄이고자유롭게움직인뒤멈춘방향을읽는다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b07",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-02",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "자석 주위의 나침반 바늘",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "빨간 부분을 N극이라고 확인한 나침반에서 막대자석의 S극에 끌려 향하려는 바늘의 극 이름을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "N극",
      "accepted": [
        "N극",
        "N"
      ]
    },
    "explanation": "다른극끼리끌어당기므로S극쪽으로바늘N극이향하려한다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b08",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-02",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "같은 극·다른 극 사이의 힘(고리 자석 탑)",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "고리 탑의 높이를 비교했지만 고리 개수와 마주 보는 극을 모두 바꿨습니다. 비교를 고칠 방법과 판단할 근거를 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "같은 고리와 개수·막대를 쓰고 마주 보는 극 배열만 바꿔요. 같은 기준에서 높이/틈과 실제 움직임을 비교하며 막대 마찰도 확인해요.",
      "rubric": {
        "required": [
          "고리/개수/막대 등 같은 조건",
          "극 배열만 바꿈·높이/관찰 근거"
        ],
        "pass": "근거와 조건을 선생님과 확인",
        "criteria": [
          "직접 작성한 학습용 기준·공식 배점 아님"
        ]
      }
    },
    "explanation": "같은개수/고리/막대조건에서극배열하나를바꾸어같은높이기준으로비교한다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b09",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-03",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "자석 장치 설계·공정한 시험",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "종이 미로판 위 철 구슬을 움직이는 장치 설계에서 성질과 구조를 연결한 설명을 고르세요.",
    "givens": null,
    "choices": [
      "자석은 판의 장식 색만 맞추는 부품이다.",
      "구슬은 철 대신 유리여야 같은 힘이 난다.",
      "판 아래 자석으로 위 철 구슬을 끌어 옮긴다.",
      "판을 두껍게 할수록 어떤 자석도 더 잘 된다.",
      "구슬 위치와 자석의 위치는 서로 무관하다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "판아래자석과위철구슬의끌림을목표와연결한다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b10",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-03",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "자석 장치 설계·공정한 시험",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "자석 장치의 설계도에 실제로 넣어야 할 내용 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "목표와 부품 위치·이용할 자석 성질",
      "실제로 받지 않은 의견을 받은 말로 쓰기",
      "아직 시험하지 않은 성공 횟수를 적기",
      "시행마다 다르게 바뀌는 성공 기준",
      "같은 시험 조건과 성공/부분/실패 기준"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        4
      ]
    },
    "explanation": "설계는목표/구조/성질과관찰가능한시험기준을연결한다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b11",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-03",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "자석 장치 설계·공정한 시험",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "연습 기록에서 장치 3회 시험 중 성공한 횟수만 숫자로 쓰세요.",
    "givens": {
      "연습 자료": "1차 성공 / 2차 부분 작동 / 3차 실패 / 다음 시험은 계획"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "1",
      "accepted": [
        "1"
      ]
    },
    "explanation": "표의성공1회만세며부분성공과계획을성공에포함하지않는다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b12",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T13",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과09-03",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "자석 장치 설계·공정한 시험",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "실제 시험에서 철 구슬이 판 아래 자석을 따라오지 않았습니다. 설계에서 고칠 한 부분·이유·재시험 조건을 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "판을 더 얇은 재료로 바꾸어 자석과 철 구슬의 거리를 줄이는 안을 시험해요. 같은 자석·구슬·길·속도와 성공 기준으로 다시 시험하고 못 움직인 결과도 남겨요.",
      "rubric": {
        "required": [
          "성질/구조와 연결한 한 부분 수정 이유",
          "같은 비교 조건·실제 재시험/실패 기록"
        ],
        "pass": "근거와 조건을 선생님과 확인",
        "criteria": [
          "직접 작성한 학습용 기준·공식 배점 아님"
        ]
      }
    },
    "explanation": "판두께/자석거리/구슬등한부분을고치고다른조건과기준을같게하여실제재시험한다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b13",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-01",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "물의 세 가지 상태와 상태 변화의 예",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "흰 김을 보고 수증기 자체가 흰색이라고 적었습니다. 고칠 설명을 고르세요.",
    "givens": null,
    "choices": [
      "흰 김은 항상 단단한 얼음 조각뿐이다.",
      "기체는 종류와 관계없이 모두 흰색이다.",
      "수증기는 손으로 집을 수 있는 덩어리다.",
      "수증기 자체와 보이는 작은 물방울을 나눈다.",
      "보이는 흰색이면 상태를 조사할 필요 없다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "수증기는눈에보이지않는기체이고보이는흰김은작은물방울을포함한다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b14",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-01",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "물의 세 가지 상태와 상태 변화의 예",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "기체 수증기가 액체 물로 변하는 사례 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "실온의 젖은 수건이 마른다.",
      "찬 밀봉 컵 바깥에 물방울이 맺힌다.",
      "냉동실의 물이 얼음으로 굳는다.",
      "차가운 창에 공기 중 수증기가 물로 맺힌다.",
      "따뜻한 곳에서 얼음이 녹는다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        3
      ]
    },
    "explanation": "두차가운표면의물방울맺힘이응결이다. 나머지는증발/어는/녹는변화다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b15",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-01",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "물의 세 가지 상태와 상태 변화의 예",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "상태 이름을 고를 때 액체인 물이 얼어 된 얼음은 어떤 상태인지 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "고체",
      "accepted": [
        "고체",
        "고체 상태"
      ]
    },
    "explanation": "얼음은고체상태이고물/수증기와구별한다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b16",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-01",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "물의 세 가지 상태와 상태 변화의 예",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "젖은 종이가 마르는 사례와 차가운 창에 물방울이 맺히는 사례를 상태 변화 방향으로 각각 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "젖은 종이의 물은 액체에서 기체 수증기로 변해 공기 중으로 퍼져요. 차가운 창에서는 공기 중 기체 수증기가 액체 물로 변해 맺혀요.",
      "rubric": {
        "required": [
          "젖은 종이 액체→기체",
          "찬 창 수증기 기체→액체"
        ],
        "pass": "근거와 조건을 선생님과 확인",
        "criteria": [
          "직접 작성한 학습용 기준·공식 배점 아님"
        ]
      }
    },
    "explanation": "첫사례는액체→기체이고두번째는기체→액체다. 물이사라졌다는설명과나눈다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b17",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-02",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "물이 얼고 녹을 때 부피와 무게",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "얼리기 전후 무게 비교에서 물기와 마개 조건을 확인해야 하는 까닭을 고르세요.",
    "givens": null,
    "choices": [
      "얼음이 언제나 저울을 작동 못 하게 해서",
      "얼린 물은 상태와 무관하게 늘 가벼워져서",
      "마개 이름만 같으면 모든 조건이 같아서",
      "저울을 바꾸어도 표시 단위가 늘 같아서",
      "물기·부품 차이가 저울값에 섞여서"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "상태변화외의물/부품출입이저울값을바꿀수있다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b18",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-02",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "증발과 끓음",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "증발과 끓음을 자료로 비교한 내용 중 맞는 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "둘 다 액체 물이 기체 수증기로 변한다.",
      "둘 다 어떤 온도에서나 물속에서만 난다.",
      "끓을 때는 표면과 물속에서 변화가 난다.",
      "증발은 반드시 얼음이 될 때만 일어난다.",
      "끓음은 언제나 기체가 액체가 되는 변화다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "증발과끓음은공통상태방향과발생위치를구별한다. 속도/조건을무조건일반화하지않는다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b19",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-02",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "응결 실험과 생활 속 응결",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "물 새는 곳 없는 찬 컵 바깥의 물방울은 주변 공기 중 무엇이 변한 것인지 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "수증기",
      "accepted": [
        "수증기",
        "공기 중 수증기"
      ]
    },
    "explanation": "주변공기중기체수증기의응결을연결한다. 컵안물의누출과구별한다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b20",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-02",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "응결 실험과 생활 속 응결",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "찬 컵과 실온 컵 바깥 물방울을 비교하려 합니다. 처음 표면·컵·물의 양·관찰 시간을 포함해 공정한 방법을 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "같은 컵에 같은 양의 물을 넣고 찬/실온 조건만 달리해요. 처음 바깥 물기를 닦고 누출을 확인한 뒤 같은 시간과 위치에서 새 물방울 모습을 기록해요.",
      "rubric": {
        "required": [
          "온도외컵/물양/처음물기/누출 조건",
          "같은 관찰 시간/기준·실제 기록"
        ],
        "pass": "근거와 조건을 선생님과 확인",
        "criteria": [
          "직접 작성한 학습용 기준·공식 배점 아님"
        ]
      }
    },
    "explanation": "온도외조건을가능한같게두고처음물기/누출·같은관찰위치/시간과실제결과를남긴다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b21",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T14",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-03",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "상태 변화 물 얻기·실제 제작/재시험",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "수증기를 식혀 물을 모을 장치 설계에서 필요한 연결을 고르세요.",
    "givens": null,
    "choices": [
      "수증기 이동·냉각 판·물방울 모을 그릇",
      "자석 극·철 구슬·고리 높이만 표시",
      "흙 색깔·종이 무늬·도구 가격만 표시",
      "물방울을 버릴 틈만 넓게 두어 설계",
      "설계도에 관찰 결과를 미리 성공으로 기입"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "기체수증기를차갑게하여액체물방울로모으는통로를구조로연결한다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b22",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T14",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-03",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "상태 변화 물 얻기·실제 제작/재시험",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "물 얻기 장치를 실제로 만들어 평가한 기록에 필요한 내용 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "맑은 색만 보면 음용 안전을 확정한다.",
      "실제 재료·증발/응결 경로와 누출을 남긴다.",
      "설계했으면 실제 제작과 성공도 완료다.",
      "한 번 실패했으면 기록은 모두 삭제한다.",
      "같은 시간/시작 양과 실제 모은 양을 남긴다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    },
    "explanation": "실제재료/상태변화경로·모은양/조건을남기고외관만으로음용을판정하지않는다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b23",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T14",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-03",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "상태 변화 물 얻기·실제 제작/재시험",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "교사 시범의 연습 기록에서 모은 물이 8mL에서 11mL가 되었습니다. 증가한 양의 숫자만 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "3",
      "accepted": [
        "3",
        "3mL",
        "3 mL"
      ]
    },
    "explanation": "11−8=3mL이다. 이모형기록을실제학생결과나음용안전으로확대하지않는다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  },
  {
    "id": "c22-s41-mid-b24",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 설계·관찰 보충"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T14",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과10-03",
      "topic": "현행 기준의 자료와 수행 근거",
      "concept": "상태 변화 물 얻기·실제 제작/재시험",
      "inquirySkill": "비교 조건·근거·설계/실제 구별"
    },
    "prompt": "장치에서 물방울은 생겼지만 모을 그릇에 거의 들어오지 않았습니다. 경로를 고칠 안과 실제 제작·재시험 기록을 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "물방울이 모을 그릇 쪽으로 흐르도록 판 기울기나 그릇 위치 한 부분을 고쳐요. 실제로 고친 부분과 같은 시간/시작 양의 다시 모은 양을 기록하고 아직 시험하지 못했으면 계획으로 남겨요.",
      "rubric": {
        "required": [
          "응결물방울경로와수정연결",
          "실제제작/수정·같은조건재시험/미실행구별"
        ],
        "pass": "근거와 조건을 선생님과 확인",
        "criteria": [
          "직접 작성한 학습용 기준·공식 배점 아님"
        ]
      }
    },
    "explanation": "냉각판기울기/받침위치등물방울경로한부분을고치고실제제작·같은조건재시험/미시행을구별한다.",
    "visualModel": null,
    "variantRules": {
      "independentAuthored": true
    },
    "evidence": {
      "checkedBy": "현행 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "가상/제공 자료의 응답이며 실제 학생 수행·공식 성적을 확정하지 않음"
    }
  }
];
export {midBankPaperHtml as bankPaper,wireMidBankPaper as wireBankPaper} from '../../v2/mid-bank-paper.js';
